
// @from(Start 5158271, End 5158528)
async function T8B(A) {
  let {
    instance: Q,
    timeout: B,
    skipCache: G,
    allowStale: Z,
    backgroundSync: I
  } = A;
  if (!I) bH.backgroundSync = !1;
  return Do8({
    instance: Q,
    allowStale: Z,
    timeout: B,
    skipCache: G
  })
}
// @from(Start 5158530, End 5158624)
function Vo8(A) {
  let Q = izA(A),
    B = m3A.get(Q) || new Set;
  B.add(A), m3A.set(Q, B)
}
// @from(Start 5158626, End 5158679)
function P8B(A) {
  m3A.forEach((Q) => Q.delete(A))
}
// @from(Start 5158681, End 5158776)
function Fo8() {
  d3A.forEach((A) => {
    if (!A) return;
    A.state = "idle", Yb1(A)
  })
}
// @from(Start 5158778, End 5158891)
function Ko8() {
  d3A.forEach((A) => {
    if (!A) return;
    if (A.state !== "idle") return;
    Jb1(A)
  })
}
// @from(Start 5158892, End 5159064)
async function O8B() {
  try {
    if (!O_.localStorage) return;
    await O_.localStorage.setItem(bH.cacheKey, JSON.stringify(Array.from(ub.entries())))
  } catch (A) {}
}
// @from(Start 5159065, End 5159674)
async function Do8(A) {
  let {
    instance: Q,
    allowStale: B,
    timeout: G,
    skipCache: Z
  } = A, I = izA(Q), Y = Zb1(Q), J = new Date, W = new Date(J.getTime() - bH.maxAge + bH.staleTTL);
  await Ho8();
  let X = !bH.disableCache && !Z ? ub.get(Y) : void 0;
  if (X && (B || X.staleAt > J) && X.staleAt > W) {
    if (X.sse) c3A.add(I);
    if (X.staleAt < J) Gb1(Q);
    else Ib1(Q);
    return {
      data: X.data,
      success: !0,
      source: "cache"
    }
  } else return await ciA(Gb1(Q), G) || {
    data: null,
    success: !1,
    source: "timeout",
    error: Error("Timeout")
  }
}
// @from(Start 5159676, End 5159748)
function izA(A) {
  let [Q, B] = A.getApiInfo();
  return `${Q}||${B}`
}
// @from(Start 5159750, End 5160110)
function Zb1(A) {
  let Q = izA(A);
  if (!("isRemoteEval" in A) || !A.isRemoteEval()) return Q;
  let B = A.getAttributes(),
    G = A.getCacheKeyAttributes() || Object.keys(A.getAttributes()),
    Z = {};
  G.forEach((J) => {
    Z[J] = B[J]
  });
  let I = A.getForcedVariations(),
    Y = A.getUrl();
  return `${Q}||${JSON.stringify({ca:Z,fv:I,url:Y})}`
}
// @from(Start 5160111, End 5160665)
async function Ho8() {
  if (M8B) return;
  M8B = !0;
  try {
    if (O_.localStorage) {
      let A = await O_.localStorage.getItem(bH.cacheKey);
      if (!bH.disableCache && A) {
        let Q = JSON.parse(A);
        if (Q && Array.isArray(Q)) Q.forEach((B) => {
          let [G, Z] = B;
          ub.set(G, {
            ...Z,
            staleAt: new Date(Z.staleAt)
          })
        });
        j8B()
      }
    }
  } catch (A) {}
  if (!bH.disableIdleStreams) {
    let A = u3A.startIdleListener();
    if (A) u3A.stopIdleListener = A
  }
}
// @from(Start 5160667, End 5160992)
function j8B() {
  let A = Array.from(ub.entries()).map((B) => {
      let [G, Z] = B;
      return {
        key: G,
        staleAt: Z.staleAt.getTime()
      }
    }).sort((B, G) => B.staleAt - G.staleAt),
    Q = Math.min(Math.max(0, ub.size - bH.maxEntries), ub.size);
  for (let B = 0; B < Q; B++) ub.delete(A[B].key)
}
// @from(Start 5160994, End 5161397)
function S8B(A, Q, B) {
  let G = B.dateUpdated || "",
    Z = new Date(Date.now() + bH.staleTTL),
    I = !bH.disableCache ? ub.get(Q) : void 0;
  if (I && G && I.version === G) {
    I.staleAt = Z, O8B();
    return
  }
  if (!bH.disableCache) ub.set(Q, {
    data: B,
    version: G,
    staleAt: Z,
    sse: c3A.has(A)
  }), j8B();
  O8B();
  let Y = m3A.get(A);
  Y && Y.forEach((J) => Co8(J, B))
}
// @from(Start 5161398, End 5161468)
async function Co8(A, Q) {
  await A.setPayload(Q || A.getPayload())
}
// @from(Start 5161469, End 5162493)
async function Gb1(A) {
  let {
    apiHost: Q,
    apiRequestHeaders: B
  } = A.getApiHosts(), G = A.getClientKey(), Z = "isRemoteEval" in A && A.isRemoteEval(), I = izA(A), Y = Zb1(A), J = piA.get(Y);
  if (!J) J = (Z ? u3A.fetchRemoteEvalCall({
    host: Q,
    clientKey: G,
    payload: {
      attributes: A.getAttributes(),
      forcedVariations: A.getForcedVariations(),
      forcedFeatures: Array.from(A.getForcedFeatures().entries()),
      url: A.getUrl()
    },
    headers: B
  }) : u3A.fetchFeaturesCall({
    host: Q,
    clientKey: G,
    headers: B
  })).then((X) => {
    if (!X.ok) throw Error(`HTTP error: ${X.status}`);
    if (X.headers.get("x-sse-support") === "enabled") c3A.add(I);
    return X.json()
  }).then((X) => {
    return S8B(I, Y, X), Ib1(A), piA.delete(Y), {
      data: X,
      success: !0,
      source: "network"
    }
  }).catch((X) => {
    return piA.delete(Y), {
      data: null,
      source: "error",
      success: !1,
      error: X
    }
  }), piA.set(Y, J);
  return J
}
// @from(Start 5162495, End 5163399)
function Ib1(A) {
  let Q = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1,
    B = izA(A),
    G = Zb1(A),
    {
      streamingHost: Z,
      streamingHostRequestHeaders: I
    } = A.getApiHosts(),
    Y = A.getClientKey();
  if (Q) c3A.add(B);
  if (bH.backgroundSync && c3A.has(B) && O_.EventSource) {
    if (d3A.has(B)) return;
    let J = {
      src: null,
      host: Z,
      clientKey: Y,
      headers: I,
      cb: (W) => {
        try {
          if (W.type === "features-updated") {
            let X = m3A.get(B);
            X && X.forEach((V) => {
              Gb1(V)
            })
          } else if (W.type === "features") {
            let X = JSON.parse(W.data);
            S8B(B, G, X)
          }
          J.errors = 0
        } catch (X) {
          _8B(J)
        }
      },
      errors: 0,
      state: "active"
    };
    d3A.set(B, J), Jb1(J)
  }
}
// @from(Start 5163401, End 5163726)
function _8B(A) {
  if (A.state === "idle") return;
  if (A.errors++, A.errors > 3 || A.src && A.src.readyState === 2) {
    let Q = Math.pow(3, A.errors - 3) * (1000 + Math.random() * 1000);
    Yb1(A), setTimeout(() => {
      if (["idle", "active"].includes(A.state)) return;
      Jb1(A)
    }, Math.min(Q, 300000))
  }
}
// @from(Start 5163728, End 5163890)
function Yb1(A) {
  if (!A.src) return;
  if (A.src.onopen = null, A.src.onerror = null, A.src.close(), A.src = null, A.state === "active") A.state = "disabled"
}
// @from(Start 5163892, End 5164204)
function Jb1(A) {
  A.src = u3A.eventSourceCall({
    host: A.host,
    clientKey: A.clientKey,
    headers: A.headers
  }), A.state = "active", A.src.addEventListener("features", A.cb), A.src.addEventListener("features-updated", A.cb), A.src.onerror = () => _8B(A), A.src.onopen = () => {
    A.errors = 0
  }
}
// @from(Start 5164206, End 5164252)
function Eo8(A, Q) {
  Yb1(A), d3A.delete(Q)
}
// @from(Start 5164254, End 5164341)
function zo8() {
  c3A.clear(), d3A.forEach(Eo8), m3A.clear(), u3A.stopIdleListener()
}
// @from(Start 5164343, End 5164518)
function liA(A, Q) {
  if (Q.streaming) {
    if (!A.getClientKey()) throw Error("Must specify clientKey to enable streaming");
    if (Q.payload) Ib1(A, !0);
    Vo8(A)
  }
}
// @from(Start 5164523, End 5164525)
bH
// @from(Start 5164527, End 5164529)
O_
// @from(Start 5164531, End 5164534)
u3A
// @from(Start 5164536, End 5164539)
m3A
// @from(Start 5164541, End 5164549)
M8B = !1
// @from(Start 5164553, End 5164555)
ub
// @from(Start 5164557, End 5164560)
piA
// @from(Start 5164562, End 5164565)
d3A
// @from(Start 5164567, End 5164570)
c3A
// @from(Start 5164576, End 5166316)
k8B = L(() => {
  lzA();
  bH = {
    staleTTL: 60000,
    maxAge: 14400000,
    cacheKey: "gbFeaturesCache",
    backgroundSync: !0,
    maxEntries: 10,
    disableIdleStreams: !1,
    idleStreamInterval: 20000,
    disableCache: !1
  }, O_ = E8B(), u3A = {
    fetchFeaturesCall: (A) => {
      let {
        host: Q,
        clientKey: B,
        headers: G
      } = A;
      return O_.fetch(`${Q}/api/features/${B}`, {
        headers: G
      })
    },
    fetchRemoteEvalCall: (A) => {
      let {
        host: Q,
        clientKey: B,
        payload: G,
        headers: Z
      } = A, I = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...Z
        },
        body: JSON.stringify(G)
      };
      return O_.fetch(`${Q}/api/eval/${B}`, I)
    },
    eventSourceCall: (A) => {
      let {
        host: Q,
        clientKey: B,
        headers: G
      } = A;
      if (G) return new O_.EventSource(`${Q}/sub/${B}`, {
        headers: G
      });
      return new O_.EventSource(`${Q}/sub/${B}`)
    },
    startIdleListener: () => {
      let A;
      if (!(typeof window < "u" && typeof document < "u")) return;
      let B = () => {
        if (document.visibilityState === "visible") window.clearTimeout(A), Ko8();
        else if (document.visibilityState === "hidden") A = window.setTimeout(Fo8, bH.idleStreamInterval)
      };
      return document.addEventListener("visibilitychange", B), () => document.removeEventListener("visibilitychange", B)
    },
    stopIdleListener: () => {}
  };
  try {
    if (globalThis.localStorage) O_.localStorage = globalThis.localStorage
  } catch (A) {}
  m3A = new Map, ub = new Map, piA = new Map, d3A = new Map, c3A = new Set
})
// @from(Start 5166322, End 5175522)
p8B = z((c8B) => {
  Object.defineProperty(c8B, "__esModule", {
    value: !0
  });
  var b8B = /^[a-zA-Z:_][a-zA-Z0-9:_.-]*$/,
    Vb1 = {
      revert: function() {}
    },
    siA = new Map,
    Xb1 = new Set;

  function riA(A) {
    var Q = siA.get(A);
    return Q || siA.set(A, Q = {
      element: A,
      attributes: {}
    }), Q
  }

  function oiA(A, Q, B, G, Z) {
    var I = B(A),
      Y = {
        isDirty: !1,
        originalValue: I,
        virtualValue: I,
        mutations: [],
        el: A,
        _positionTimeout: null,
        observer: new MutationObserver(function() {
          if (Q !== "position" || !Y._positionTimeout) {
            Q === "position" && (Y._positionTimeout = setTimeout(function() {
              Y._positionTimeout = null
            }, 1000));
            var J = B(A);
            Q === "position" && J.parentNode === Y.virtualValue.parentNode && J.insertBeforeNode === Y.virtualValue.insertBeforeNode || J !== Y.virtualValue && (Y.originalValue = J, Z(Y))
          }
        }),
        mutationRunner: Z,
        setValue: G,
        getCurrentValue: B
      };
    return Q === "position" && A.parentNode ? Y.observer.observe(A.parentNode, {
      childList: !0,
      subtree: !0,
      attributes: !1,
      characterData: !1
    }) : Y.observer.observe(A, function(J) {
      return J === "html" ? {
        childList: !0,
        subtree: !0,
        attributes: !0,
        characterData: !0
      } : {
        childList: !1,
        subtree: !1,
        attributes: !0,
        attributeFilter: [J]
      }
    }(Q)), Y
  }

  function tiA(A, Q) {
    var B = Q.getCurrentValue(Q.el);
    Q.virtualValue = A, A && typeof A != "string" ? B && A.parentNode === B.parentNode && A.insertBeforeNode === B.insertBeforeNode || (Q.isDirty = !0, y8B()) : A !== B && (Q.isDirty = !0, y8B())
  }

  function Uo8(A) {
    var Q = A.originalValue;
    A.mutations.forEach(function(B) {
      return Q = B.mutate(Q)
    }), tiA(function(B) {
      return iiA || (iiA = document.createElement("div")), iiA.innerHTML = B, iiA.innerHTML
    }(Q), A)
  }

  function $o8(A) {
    var Q = new Set(A.originalValue.split(/\s+/).filter(Boolean));
    A.mutations.forEach(function(B) {
      return B.mutate(Q)
    }), tiA(Array.from(Q).filter(Boolean).join(" "), A)
  }

  function wo8(A) {
    var Q = A.originalValue;
    A.mutations.forEach(function(B) {
      return Q = B.mutate(Q)
    }), tiA(Q, A)
  }

  function qo8(A) {
    var Q = A.originalValue;
    A.mutations.forEach(function(B) {
      var G = function(Z) {
        var I = Z.insertBeforeSelector,
          Y = document.querySelector(Z.parentSelector);
        if (!Y) return null;
        var J = I ? document.querySelector(I) : null;
        return I && !J ? null : {
          parentNode: Y,
          insertBeforeNode: J
        }
      }(B.mutate());
      Q = G || Q
    }), tiA(Q, A)
  }
  var No8 = function(A) {
      return A.innerHTML
    },
    Lo8 = function(A, Q) {
      return A.innerHTML = Q
    };

  function f8B(A) {
    var Q = riA(A);
    return Q.html || (Q.html = oiA(A, "html", No8, Lo8, Uo8)), Q.html
  }
  var Mo8 = function(A) {
      return {
        parentNode: A.parentElement,
        insertBeforeNode: A.nextElementSibling
      }
    },
    Oo8 = function(A, Q) {
      Q.insertBeforeNode && !Q.parentNode.contains(Q.insertBeforeNode) || Q.parentNode.insertBefore(A, Q.insertBeforeNode)
    };

  function h8B(A) {
    var Q = riA(A);
    return Q.position || (Q.position = oiA(A, "position", Mo8, Oo8, qo8)), Q.position
  }
  var iiA, azA, Ro8 = function(A, Q) {
      return Q ? A.className = Q : A.removeAttribute("class")
    },
    To8 = function(A) {
      return A.className
    };

  function g8B(A) {
    var Q = riA(A);
    return Q.classes || (Q.classes = oiA(A, "class", To8, Ro8, $o8)), Q.classes
  }

  function u8B(A, Q) {
    var B, G = riA(A);
    return G.attributes[Q] || (G.attributes[Q] = oiA(A, Q, (B = Q, function(Z) {
      var I;
      return (I = Z.getAttribute(B)) != null ? I : null
    }), function(Z) {
      return function(I, Y) {
        return Y !== null ? I.setAttribute(Z, Y) : I.removeAttribute(Z)
      }
    }(Q), wo8)), G.attributes[Q]
  }

  function niA(A, Q, B) {
    if (B.isDirty) {
      B.isDirty = !1;
      var G = B.virtualValue;
      B.mutations.length || function(Z, I) {
        var Y, J, W = siA.get(Z);
        if (W)
          if (I === "html")(Y = W.html) == null || (J = Y.observer) == null || J.disconnect(), delete W.html;
          else if (I === "class") {
          var X, V;
          (X = W.classes) == null || (V = X.observer) == null || V.disconnect(), delete W.classes
        } else if (I === "position") {
          var F, K;
          (F = W.position) == null || (K = F.observer) == null || K.disconnect(), delete W.position
        } else {
          var D, H, C;
          (D = W.attributes) == null || (H = D[I]) == null || (C = H.observer) == null || C.disconnect(), delete W.attributes[I]
        }
      }(A, Q), B.setValue(A, G)
    }
  }

  function Po8(A, Q) {
    A.html && niA(Q, "html", A.html), A.classes && niA(Q, "class", A.classes), A.position && niA(Q, "position", A.position), Object.keys(A.attributes).forEach(function(B) {
      niA(Q, B, A.attributes[B])
    })
  }

  function y8B() {
    siA.forEach(Po8)
  }

  function m8B(A) {
    if (A.kind !== "position" || A.elements.size !== 1) {
      var Q = new Set(A.elements);
      document.querySelectorAll(A.selector).forEach(function(B) {
        Q.has(B) || (A.elements.add(B), function(G, Z) {
          var I = null;
          G.kind === "html" ? I = f8B(Z) : G.kind === "class" ? I = g8B(Z) : G.kind === "attribute" ? I = u8B(Z, G.attribute) : G.kind === "position" && (I = h8B(Z)), I && (I.mutations.push(G), I.mutationRunner(I))
        }(A, B))
      })
    }
  }

  function x8B() {
    Xb1.forEach(m8B)
  }

  function d8B() {
    typeof document < "u" && (azA || (azA = new MutationObserver(function() {
      x8B()
    })), x8B(), azA.observe(document.documentElement, {
      childList: !0,
      subtree: !0,
      attributes: !1,
      characterData: !1
    }))
  }

  function eiA(A) {
    return typeof document > "u" ? Vb1 : (Xb1.add(A), m8B(A), {
      revert: function() {
        var Q;
        (Q = A).elements.forEach(function(B) {
          return function(G, Z) {
            var I = null;
            if (G.kind === "html" ? I = f8B(Z) : G.kind === "class" ? I = g8B(Z) : G.kind === "attribute" ? I = u8B(Z, G.attribute) : G.kind === "position" && (I = h8B(Z)), I) {
              var Y = I.mutations.indexOf(G);
              Y !== -1 && I.mutations.splice(Y, 1), I.mutationRunner(I)
            }
          }(Q, B)
        }), Q.elements.clear(), Xb1.delete(Q)
      }
    })
  }

  function Wb1(A, Q) {
    return eiA({
      kind: "html",
      elements: new Set,
      mutate: Q,
      selector: A
    })
  }

  function v8B(A, Q) {
    return eiA({
      kind: "position",
      elements: new Set,
      mutate: Q,
      selector: A
    })
  }

  function nzA(A, Q) {
    return eiA({
      kind: "class",
      elements: new Set,
      mutate: Q,
      selector: A
    })
  }

  function aiA(A, Q, B) {
    return b8B.test(Q) ? Q === "class" || Q === "className" ? nzA(A, function(G) {
      var Z = B(Array.from(G).join(" "));
      G.clear(), Z && Z.split(/\s+/g).filter(Boolean).forEach(function(I) {
        return G.add(I)
      })
    }) : eiA({
      kind: "attribute",
      attribute: Q,
      elements: new Set,
      mutate: B,
      selector: A
    }) : Vb1
  }
  d8B();
  var jo8 = {
    html: Wb1,
    classes: nzA,
    attribute: aiA,
    position: v8B,
    declarative: function(A) {
      var {
        selector: Q,
        action: B,
        value: G,
        attribute: Z,
        parentSelector: I,
        insertBeforeSelector: Y
      } = A;
      if (Z === "html") {
        if (B === "append") return Wb1(Q, function(J) {
          return J + (G != null ? G : "")
        });
        if (B === "set") return Wb1(Q, function() {
          return G != null ? G : ""
        })
      } else if (Z === "class") {
        if (B === "append") return nzA(Q, function(J) {
          G && J.add(G)
        });
        if (B === "remove") return nzA(Q, function(J) {
          G && J.delete(G)
        });
        if (B === "set") return nzA(Q, function(J) {
          J.clear(), G && J.add(G)
        })
      } else if (Z === "position") {
        if (B === "set" && I) return v8B(Q, function() {
          return {
            insertBeforeSelector: Y,
            parentSelector: I
          }
        })
      } else {
        if (B === "append") return aiA(Q, Z, function(J) {
          return J !== null ? J + (G != null ? G : "") : G != null ? G : ""
        });
        if (B === "set") return aiA(Q, Z, function() {
          return G != null ? G : ""
        });
        if (B === "remove") return aiA(Q, Z, function() {
          return null
        })
      }
      return Vb1
    }
  };
  c8B.connectGlobalObserver = d8B, c8B.default = jo8, c8B.disconnectGlobalObserver = function() {
    azA && azA.disconnect()
  }, c8B.validAttributeName = b8B
})
// @from(Start 5175525, End 5175949)
function gc(A, Q, B) {
  B = B || {};
  for (let [G, Z] of Object.entries(Q)) switch (G) {
    case "$or":
      if (!l8B(A, Z, B)) return !1;
      break;
    case "$nor":
      if (l8B(A, Z, B)) return !1;
      break;
    case "$and":
      if (!vo8(A, Z, B)) return !1;
      break;
    case "$not":
      if (gc(A, Z, B)) return !1;
      break;
    default:
      if (!szA(Z, So8(A, G), B)) return !1
  }
  return !0
}
// @from(Start 5175951, End 5176140)
function So8(A, Q) {
  let B = Q.split("."),
    G = A;
  for (let Z = 0; Z < B.length; Z++)
    if (G && typeof G === "object" && B[Z] in G) G = G[B[Z]];
    else return null;
  return G
}
// @from(Start 5176142, End 5176247)
function _o8(A) {
  if (!Fb1[A]) Fb1[A] = new RegExp(A.replace(/([^\\])\//g, "$1\\/"));
  return Fb1[A]
}
// @from(Start 5176249, End 5176626)
function szA(A, Q, B) {
  if (typeof A === "string") return Q + "" === A;
  if (typeof A === "number") return Q * 1 === A;
  if (typeof A === "boolean") return Q !== null && !!Q === A;
  if (A === null) return Q === null;
  if (Array.isArray(A) || !i8B(A)) return JSON.stringify(Q) === JSON.stringify(A);
  for (let G in A)
    if (!xo8(G, Q, A[G], B)) return !1;
  return !0
}
// @from(Start 5176628, End 5176748)
function i8B(A) {
  let Q = Object.keys(A);
  return Q.length > 0 && Q.filter((B) => B[0] === "$").length === Q.length
}
// @from(Start 5176750, End 5176965)
function ko8(A) {
  if (A === null) return "null";
  if (Array.isArray(A)) return "array";
  let Q = typeof A;
  if (["string", "number", "boolean", "object", "undefined"].includes(Q)) return Q;
  return "unknown"
}
// @from(Start 5176967, End 5177174)
function yo8(A, Q, B) {
  if (!Array.isArray(A)) return !1;
  let G = i8B(Q) ? (Z) => szA(Q, Z, B) : (Z) => gc(Z, Q, B);
  for (let Z = 0; Z < A.length; Z++)
    if (A[Z] && G(A[Z])) return !0;
  return !1
}
// @from(Start 5177176, End 5177282)
function AnA(A, Q) {
  if (Array.isArray(A)) return A.some((B) => Q.includes(B));
  return Q.includes(A)
}
// @from(Start 5177284, End 5178868)
function xo8(A, Q, B, G) {
  switch (A) {
    case "$veq":
      return aw(Q) === aw(B);
    case "$vne":
      return aw(Q) !== aw(B);
    case "$vgt":
      return aw(Q) > aw(B);
    case "$vgte":
      return aw(Q) >= aw(B);
    case "$vlt":
      return aw(Q) < aw(B);
    case "$vlte":
      return aw(Q) <= aw(B);
    case "$eq":
      return Q === B;
    case "$ne":
      return Q !== B;
    case "$lt":
      return Q < B;
    case "$lte":
      return Q <= B;
    case "$gt":
      return Q > B;
    case "$gte":
      return Q >= B;
    case "$exists":
      return B ? Q != null : Q == null;
    case "$in":
      if (!Array.isArray(B)) return !1;
      return AnA(Q, B);
    case "$inGroup":
      return AnA(Q, G[B] || []);
    case "$notInGroup":
      return !AnA(Q, G[B] || []);
    case "$nin":
      if (!Array.isArray(B)) return !1;
      return !AnA(Q, B);
    case "$not":
      return !szA(B, Q, G);
    case "$size":
      if (!Array.isArray(Q)) return !1;
      return szA(B, Q.length, G);
    case "$elemMatch":
      return yo8(Q, B, G);
    case "$all":
      if (!Array.isArray(Q)) return !1;
      for (let Z = 0; Z < B.length; Z++) {
        let I = !1;
        for (let Y = 0; Y < Q.length; Y++)
          if (szA(B[Z], Q[Y], G)) {
            I = !0;
            break
          } if (!I) return !1
      }
      return !0;
    case "$regex":
      try {
        return _o8(B).test(Q)
      } catch (Z) {
        return !1
      }
    case "$type":
      return ko8(Q) === B;
    default:
      return console.error("Unknown operator: " + A), !1
  }
}
// @from(Start 5178870, End 5179007)
function l8B(A, Q, B) {
  if (!Q.length) return !0;
  for (let G = 0; G < Q.length; G++)
    if (gc(A, Q[G], B)) return !0;
  return !1
}
// @from(Start 5179009, End 5179119)
function vo8(A, Q, B) {
  for (let G = 0; G < Q.length; G++)
    if (!gc(A, Q[G], B)) return !1;
  return !0
}
// @from(Start 5179124, End 5179127)
Fb1
// @from(Start 5179133, End 5179171)
n8B = L(() => {
  lzA();
  Fb1 = {}
})
// @from(Start 5179174, End 5179413)
function ho8(A) {
  let Q = new Map;
  if (A.global.forcedFeatureValues) A.global.forcedFeatureValues.forEach((B, G) => Q.set(G, B));
  if (A.user.forcedFeatureValues) A.user.forcedFeatureValues.forEach((B, G) => Q.set(G, B));
  return Q
}
// @from(Start 5179415, End 5179730)
function go8(A) {
  if (A.global.forcedVariations && A.user.forcedVariations) return {
    ...A.global.forcedVariations,
    ...A.user.forcedVariations
  };
  else if (A.global.forcedVariations) return A.global.forcedVariations;
  else if (A.user.forcedVariations) return A.user.forcedVariations;
  else return {}
}
// @from(Start 5179731, End 5179795)
async function p3A(A) {
  try {
    await A()
  } catch (Q) {}
}
// @from(Start 5179797, End 5180628)
function a8B(A, Q, B) {
  if (A.user.trackedExperiments) {
    let Z = GnA(Q, B);
    if (A.user.trackedExperiments.has(Z)) return [];
    A.user.trackedExperiments.add(Z)
  }
  if (A.user.enableDevMode && A.user.devLogs) A.user.devLogs.push({
    experiment: Q,
    result: B,
    timestamp: Date.now().toString(),
    logType: "experiment"
  });
  let G = [];
  if (A.global.trackingCallback) {
    let Z = A.global.trackingCallback;
    G.push(p3A(() => Z(Q, B, A.user)))
  }
  if (A.user.trackingCallback) {
    let Z = A.user.trackingCallback;
    G.push(p3A(() => Z(Q, B)))
  }
  if (A.global.eventLogger) {
    let Z = A.global.eventLogger;
    G.push(p3A(() => Z(fo8, {
      experimentId: Q.key,
      variationId: B.key,
      hashAttribute: B.hashAttribute,
      hashValue: B.hashValue
    }, A.user)))
  }
  return G
}
// @from(Start 5180630, End 5181510)
function uo8(A, Q, B) {
  if (A.user.trackedFeatureUsage) {
    let G = JSON.stringify(B.value);
    if (A.user.trackedFeatureUsage[Q] === G) return;
    if (A.user.trackedFeatureUsage[Q] = G, A.user.enableDevMode && A.user.devLogs) A.user.devLogs.push({
      featureKey: Q,
      result: B,
      timestamp: Date.now().toString(),
      logType: "feature"
    })
  }
  if (A.global.onFeatureUsage) {
    let G = A.global.onFeatureUsage;
    p3A(() => G(Q, B, A.user))
  }
  if (A.user.onFeatureUsage) {
    let G = A.user.onFeatureUsage;
    p3A(() => G(Q, B))
  }
  if (A.global.eventLogger) {
    let G = A.global.eventLogger;
    p3A(() => G(bo8, {
      feature: Q,
      source: B.source,
      value: B.value,
      ruleId: B.source === "defaultValue" ? "$default" : B.ruleId || "",
      variationId: B.experimentResult ? B.experimentResult.key : ""
    }, A.user))
  }
}
// @from(Start 5181512, End 5184351)
function QnA(A, Q) {
  if (Q.stack.evaluatedFeatures.has(A)) return uc(Q, A, null, "cyclicPrerequisite");
  Q.stack.evaluatedFeatures.add(A), Q.stack.id = A;
  let B = ho8(Q);
  if (B.has(A)) return uc(Q, A, B.get(A), "override");
  if (!Q.global.features || !Q.global.features[A]) return uc(Q, A, null, "unknownFeature");
  let G = Q.global.features[A];
  if (G.rules) {
    let Z = new Set(Q.stack.evaluatedFeatures);
    A: for (let I of G.rules) {
      if (I.parentConditions)
        for (let W of I.parentConditions) {
          Q.stack.evaluatedFeatures = new Set(Z);
          let X = QnA(W.id, Q);
          if (X.source === "cyclicPrerequisite") return uc(Q, A, null, "cyclicPrerequisite");
          let V = {
            value: X.value
          };
          if (!gc(V, W.condition || {})) {
            if (W.gate) return uc(Q, A, null, "prerequisite");
            continue A
          }
        }
      if (I.filters && o8B(I.filters, Q)) continue;
      if ("force" in I) {
        if (I.condition && !r8B(I.condition, Q)) continue;
        if (!mo8(Q, I.seed || A, I.hashAttribute, Q.user.saveStickyBucketAssignmentDoc && !I.disableStickyBucketing ? I.fallbackAttribute : void 0, I.range, I.coverage, I.hashVersion)) continue;
        if (I.tracks) I.tracks.forEach((W) => {
          if (!a8B(Q, W.experiment, W.result).length && Q.global.saveDeferredTrack) Q.global.saveDeferredTrack({
            experiment: W.experiment,
            result: W.result
          })
        });
        return uc(Q, A, I.force, "force", I.id)
      }
      if (!I.variations) continue;
      let Y = {
        variations: I.variations,
        key: I.key || A
      };
      if ("coverage" in I) Y.coverage = I.coverage;
      if (I.weights) Y.weights = I.weights;
      if (I.hashAttribute) Y.hashAttribute = I.hashAttribute;
      if (I.fallbackAttribute) Y.fallbackAttribute = I.fallbackAttribute;
      if (I.disableStickyBucketing) Y.disableStickyBucketing = I.disableStickyBucketing;
      if (I.bucketVersion !== void 0) Y.bucketVersion = I.bucketVersion;
      if (I.minBucketVersion !== void 0) Y.minBucketVersion = I.minBucketVersion;
      if (I.namespace) Y.namespace = I.namespace;
      if (I.meta) Y.meta = I.meta;
      if (I.ranges) Y.ranges = I.ranges;
      if (I.name) Y.name = I.name;
      if (I.phase) Y.phase = I.phase;
      if (I.seed) Y.seed = I.seed;
      if (I.hashVersion) Y.hashVersion = I.hashVersion;
      if (I.filters) Y.filters = I.filters;
      if (I.condition) Y.condition = I.condition;
      let {
        result: J
      } = BnA(Y, A, Q);
      if (Q.global.onExperimentEval && Q.global.onExperimentEval(Y, J), J.inExperiment && !J.passthrough) return uc(Q, A, J.value, "experiment", I.id, Y, J)
    }
  }
  return uc(Q, A, G.defaultValue === void 0 ? null : G.defaultValue, "defaultValue")
}
// @from(Start 5184353, End 5188154)
function BnA(A, Q, B) {
  let G = A.key,
    Z = A.variations.length;
  if (Z < 2) return {
    result: QY(B, A, -1, !1, Q)
  };
  if (B.global.enabled === !1 || B.user.enabled === !1) return {
    result: QY(B, A, -1, !1, Q)
  };
  if (A = do8(A, B), A.urlPatterns && !miA(B.user.url || "", A.urlPatterns)) return {
    result: QY(B, A, -1, !1, Q)
  };
  let I = w8B(G, B.user.url || "", Z);
  if (I !== null) return {
    result: QY(B, A, I, !1, Q)
  };
  let Y = go8(B);
  if (G in Y) {
    let E = Y[G];
    return {
      result: QY(B, A, E, !1, Q)
    }
  }
  if (A.status === "draft" || A.active === !1) return {
    result: QY(B, A, -1, !1, Q)
  };
  let {
    hashAttribute: J,
    hashValue: W
  } = Vt(B, A.hashAttribute, B.user.saveStickyBucketAssignmentDoc && !A.disableStickyBucketing ? A.fallbackAttribute : void 0);
  if (!W) return {
    result: QY(B, A, -1, !1, Q)
  };
  let X = -1,
    V = !1,
    F = !1;
  if (B.user.saveStickyBucketAssignmentDoc && !A.disableStickyBucketing) {
    let {
      variation: E,
      versionIsBlocked: U
    } = lo8({
      ctx: B,
      expKey: A.key,
      expBucketVersion: A.bucketVersion,
      expHashAttribute: A.hashAttribute,
      expFallbackAttribute: A.fallbackAttribute,
      expMinBucketVersion: A.minBucketVersion,
      expMeta: A.meta
    });
    V = E >= 0, X = E, F = !!U
  }
  if (!V) {
    if (A.filters) {
      if (o8B(A.filters, B)) return {
        result: QY(B, A, -1, !1, Q)
      }
    } else if (A.namespace && !z8B(W, A.namespace)) return {
      result: QY(B, A, -1, !1, Q)
    };
    if (A.include && !q8B(A.include)) return {
      result: QY(B, A, -1, !1, Q)
    };
    if (A.condition && !r8B(A.condition, B)) return {
      result: QY(B, A, -1, !1, Q)
    };
    if (A.parentConditions) {
      let E = new Set(B.stack.evaluatedFeatures);
      for (let U of A.parentConditions) {
        B.stack.evaluatedFeatures = new Set(E);
        let q = QnA(U.id, B);
        if (q.source === "cyclicPrerequisite") return {
          result: QY(B, A, -1, !1, Q)
        };
        let w = {
          value: q.value
        };
        if (!gc(w, U.condition || {})) return {
          result: QY(B, A, -1, !1, Q)
        }
      }
    }
    if (A.groups && !po8(A.groups, B)) return {
      result: QY(B, A, -1, !1, Q)
    }
  }
  if (A.url && !co8(A.url, B)) return {
    result: QY(B, A, -1, !1, Q)
  };
  let K = czA(A.seed || G, W, A.hashVersion || 1);
  if (K === null) return {
    result: QY(B, A, -1, !1, Q)
  };
  if (!V) {
    let E = A.ranges || $8B(Z, A.coverage === void 0 ? 1 : A.coverage, A.weights);
    X = U8B(K, E)
  }
  if (F) return {
    result: QY(B, A, -1, !1, Q, void 0, !0)
  };
  if (X < 0) return {
    result: QY(B, A, -1, !1, Q)
  };
  if ("force" in A) return {
    result: QY(B, A, A.force === void 0 ? -1 : A.force, !1, Q)
  };
  if (B.global.qaMode || B.user.qaMode) return {
    result: QY(B, A, -1, !1, Q)
  };
  if (A.status === "stopped") return {
    result: QY(B, A, -1, !1, Q)
  };
  let D = QY(B, A, X, !0, Q, K, V);
  if (B.user.saveStickyBucketAssignmentDoc && !A.disableStickyBucketing) {
    let {
      changed: E,
      key: U,
      doc: q
    } = no8(B, J, pzA(W), {
      [Kb1(A.key, A.bucketVersion)]: D.key
    });
    if (E) B.user.stickyBucketAssignmentDocs = B.user.stickyBucketAssignmentDocs || {}, B.user.stickyBucketAssignmentDocs[U] = q, B.user.saveStickyBucketAssignmentDoc(q)
  }
  let H = a8B(B, A, D);
  if (H.length === 0 && B.global.saveDeferredTrack) B.global.saveDeferredTrack({
    experiment: A,
    result: D
  });
  let C = !H.length ? void 0 : H.length === 1 ? H[0] : Promise.all(H).then(() => {});
  return "changeId" in A && A.changeId && B.global.recordChangeId && B.global.recordChangeId(A.changeId), {
    result: D,
    trackingCall: C
  }
}
// @from(Start 5188156, End 5188393)
function uc(A, Q, B, G, Z, I, Y) {
  let J = {
    value: B,
    on: !!B,
    off: !B,
    source: G,
    ruleId: Z || ""
  };
  if (I) J.experiment = I;
  if (Y) J.experimentResult = Y;
  if (G !== "override") uo8(A, Q, J);
  return J
}
// @from(Start 5188395, End 5188488)
function s8B(A) {
  return {
    ...A.user.attributes,
    ...A.user.attributeOverrides
  }
}
// @from(Start 5188490, End 5188563)
function r8B(A, Q) {
  return gc(s8B(Q), A, Q.global.savedGroups || {})
}
// @from(Start 5188565, End 5188820)
function o8B(A, Q) {
  return A.some((B) => {
    let {
      hashValue: G
    } = Vt(Q, B.attribute);
    if (!G) return !0;
    let Z = czA(B.seed, G, B.hashVersion || 2);
    if (Z === null) return !0;
    return !B.ranges.some((I) => uiA(Z, I))
  })
}
// @from(Start 5188822, End 5189103)
function mo8(A, Q, B, G, Z, I, Y) {
  if (!Z && I === void 0) return !0;
  if (!Z && I === 0) return !1;
  let {
    hashValue: J
  } = Vt(A, B, G);
  if (!J) return !1;
  let W = czA(Q, J, Y || 1);
  if (W === null) return !1;
  return Z ? uiA(W, Z) : I !== void 0 ? W <= I : !0
}
// @from(Start 5189105, End 5189750)
function QY(A, Q, B, G, Z, I, Y) {
  let J = !0;
  if (B < 0 || B >= Q.variations.length) B = 0, J = !1;
  let {
    hashAttribute: W,
    hashValue: X
  } = Vt(A, Q.hashAttribute, A.user.saveStickyBucketAssignmentDoc && !Q.disableStickyBucketing ? Q.fallbackAttribute : void 0), V = Q.meta ? Q.meta[B] : {}, F = {
    key: V.key || "" + B,
    featureId: Z,
    inExperiment: J,
    hashUsed: G,
    variationId: B,
    value: Q.variations[B],
    hashAttribute: W,
    hashValue: X,
    stickyBucketUsed: !!Y
  };
  if (V.name) F.name = V.name;
  if (I !== void 0) F.bucket = I;
  if (V.passthrough) F.passthrough = V.passthrough;
  return F
}
// @from(Start 5189752, End 5189939)
function do8(A, Q) {
  let B = A.key,
    G = Q.global.overrides;
  if (G && G[B]) {
    if (A = Object.assign({}, A, G[B]), typeof A.url === "string") A.url = Bb1(A.url)
  }
  return A
}
// @from(Start 5189941, End 5190152)
function Vt(A, Q, B) {
  let G = Q || "id",
    Z = "",
    I = s8B(A);
  if (I[G]) Z = I[G];
  if (!Z && B) {
    if (I[B]) Z = I[B];
    if (Z) G = B
  }
  return {
    hashAttribute: G,
    hashValue: Z
  }
}
// @from(Start 5190154, End 5190353)
function co8(A, Q) {
  let B = Q.user.url;
  if (!B) return !1;
  let G = B.replace(/^https?:\/\//, "").replace(/^[^/]*\//, "/");
  if (A.test(B)) return !0;
  if (A.test(G)) return !0;
  return !1
}
// @from(Start 5190355, End 5190487)
function po8(A, Q) {
  let B = Q.global.groups || {};
  for (let G = 0; G < A.length; G++)
    if (B[A[G]]) return !0;
  return !1
}
// @from(Start 5190489, End 5191134)
function lo8(A) {
  let {
    ctx: Q,
    expKey: B,
    expBucketVersion: G,
    expHashAttribute: Z,
    expFallbackAttribute: I,
    expMinBucketVersion: Y,
    expMeta: J
  } = A;
  G = G || 0, Y = Y || 0, Z = Z || "id", J = J || [];
  let W = Kb1(B, G),
    X = io8(Q, Z, I);
  if (Y > 0)
    for (let K = 0; K <= Y; K++) {
      let D = Kb1(B, K);
      if (X[D] !== void 0) return {
        variation: -1,
        versionIsBlocked: !0
      }
    }
  let V = X[W];
  if (V === void 0) return {
    variation: -1
  };
  let F = J.findIndex((K) => K.key === V);
  if (F < 0) return {
    variation: -1
  };
  return {
    variation: F
  }
}
// @from(Start 5191136, End 5191192)
function Kb1(A, Q) {
  return Q = Q || 0, `${A}__${Q}`
}
// @from(Start 5191194, End 5191238)
function Db1(A, Q) {
  return `${A}||${Q}`
}
// @from(Start 5191240, End 5191749)
function io8(A, Q, B) {
  if (!A.user.stickyBucketAssignmentDocs) return {};
  let {
    hashAttribute: G,
    hashValue: Z
  } = Vt(A, Q), I = Db1(G, pzA(Z)), {
    hashAttribute: Y,
    hashValue: J
  } = Vt(A, B), W = J ? Db1(Y, pzA(J)) : null, X = {};
  if (W && A.user.stickyBucketAssignmentDocs[W]) Object.assign(X, A.user.stickyBucketAssignmentDocs[W].assignments || {});
  if (A.user.stickyBucketAssignmentDocs[I]) Object.assign(X, A.user.stickyBucketAssignmentDocs[I].assignments || {});
  return X
}
// @from(Start 5191751, End 5192164)
function no8(A, Q, B, G) {
  let Z = Db1(Q, B),
    I = A.user.stickyBucketAssignmentDocs && A.user.stickyBucketAssignmentDocs[Z] ? A.user.stickyBucketAssignmentDocs[Z].assignments || {} : {},
    Y = {
      ...I,
      ...G
    },
    J = JSON.stringify(I) !== JSON.stringify(Y);
  return {
    key: Z,
    doc: {
      attributeName: Q,
      attributeValue: B,
      assignments: Y
    },
    changed: J
  }
}
// @from(Start 5192166, End 5192718)
function ao8(A, Q) {
  let B = new Set,
    G = Q && Q.features ? Q.features : A.global.features || {},
    Z = Q && Q.experiments ? Q.experiments : A.global.experiments || [];
  return Object.keys(G).forEach((I) => {
    let Y = G[I];
    if (Y.rules) {
      for (let J of Y.rules)
        if (J.variations) {
          if (B.add(J.hashAttribute || "id"), J.fallbackAttribute) B.add(J.fallbackAttribute)
        }
    }
  }), Z.map((I) => {
    if (B.add(I.hashAttribute || "id"), I.fallbackAttribute) B.add(I.fallbackAttribute)
  }), Array.from(B)
}
// @from(Start 5192719, End 5192803)
async function t8B(A, Q, B) {
  let G = Hb1(A, B);
  return Q.getAllAssignments(G)
}
// @from(Start 5192805, End 5192950)
function Hb1(A, Q) {
  let B = {};
  return ao8(A, Q).forEach((Z) => {
    let {
      hashValue: I
    } = Vt(A, Z);
    B[Z] = pzA(I)
  }), B
}
// @from(Start 5192951, End 5193605)
async function e8B(A, Q, B) {
  if (A = {
      ...A
    }, A.encryptedFeatures) {
    try {
      A.features = JSON.parse(await Xt(A.encryptedFeatures, Q, B))
    } catch (G) {
      console.error(G)
    }
    delete A.encryptedFeatures
  }
  if (A.encryptedExperiments) {
    try {
      A.experiments = JSON.parse(await Xt(A.encryptedExperiments, Q, B))
    } catch (G) {
      console.error(G)
    }
    delete A.encryptedExperiments
  }
  if (A.encryptedSavedGroups) {
    try {
      A.savedGroups = JSON.parse(await Xt(A.encryptedSavedGroups, Q, B))
    } catch (G) {
      console.error(G)
    }
    delete A.encryptedSavedGroups
  }
  return A
}
// @from(Start 5193607, End 5193903)
function A6B(A) {
  let Q = A.apiHost || "https://cdn.growthbook.io";
  return {
    apiHost: Q.replace(/\/*$/, ""),
    streamingHost: (A.streamingHost || Q).replace(/\/*$/, ""),
    apiRequestHeaders: A.apiHostRequestHeaders,
    streamingHostRequestHeaders: A.streamingHostRequestHeaders
  }
}
// @from(Start 5193905, End 5193990)
function GnA(A, Q) {
  return Q.hashAttribute + Q.hashValue + A.key + Q.variationId
}
// @from(Start 5193995, End 5194020)
bo8 = "Feature Evaluated"
// @from(Start 5194024, End 5194049)
fo8 = "Experiment Viewed"
// @from(Start 5194055, End 5194090)
Q6B = L(() => {
  n8B();
  lzA()
})
// @from(Start 5194092, End 5212772)
class ZnA {
  constructor(A) {
    if (A = A || {}, this.version = so8, this._options = this.context = A, this._renderer = A.renderer || null, this._trackedExperiments = new Set, this._completedChangeIds = new Set, this._trackedFeatures = {}, this.debug = !!A.debug, this._subscriptions = new Set, this.ready = !1, this._assigned = new Map, this._activeAutoExperiments = new Map, this._triggeredExpKeys = new Set, this._initialized = !1, this._redirectedUrl = "", this._deferredTrackingCalls = new Map, this._autoExperimentsAllowed = !A.disableExperimentsOnLoad, this._destroyCallbacks = [], this.logs = [], this.log = this.log.bind(this), this._saveDeferredTrack = this._saveDeferredTrack.bind(this), this._fireSubscriptions = this._fireSubscriptions.bind(this), this._recordChangedId = this._recordChangedId.bind(this), A.remoteEval) {
      if (A.decryptionKey) throw Error("Encryption is not available for remoteEval");
      if (!A.clientKey) throw Error("Missing clientKey");
      let Q = !1;
      try {
        Q = !!new URL(A.apiHost || "").hostname.match(/growthbook\.io$/i)
      } catch (B) {}
      if (Q) throw Error("Cannot use remoteEval on GrowthBook Cloud")
    } else if (A.cacheKeyAttributes) throw Error("cacheKeyAttributes are only used for remoteEval");
    if (A.stickyBucketService) {
      let Q = A.stickyBucketService;
      this._saveStickyBucketAssignmentDoc = (B) => {
        return Q.saveAssignments(B)
      }
    }
    if (A.plugins)
      for (let Q of A.plugins) Q(this);
    if (A.features) this.ready = !0;
    if (l3A && A.enableDevMode) window._growthbook = this, document.dispatchEvent(new Event("gbloaded"));
    if (A.experiments) this.ready = !0, this._updateAllAutoExperiments();
    if (this._options.stickyBucketService && this._options.stickyBucketAssignmentDocs)
      for (let Q in this._options.stickyBucketAssignmentDocs) {
        let B = this._options.stickyBucketAssignmentDocs[Q];
        if (B) this._options.stickyBucketService.saveAssignments(B).catch(() => {})
      }
    if (this.ready) this.refreshStickyBuckets(this.getPayload())
  }
  async setPayload(A) {
    this._payload = A;
    let Q = await e8B(A, this._options.decryptionKey);
    if (this._decryptedPayload = Q, await this.refreshStickyBuckets(Q), Q.features) this._options.features = Q.features;
    if (Q.savedGroups) this._options.savedGroups = Q.savedGroups;
    if (Q.experiments) this._options.experiments = Q.experiments, this._updateAllAutoExperiments();
    this.ready = !0, this._render()
  }
  initSync(A) {
    this._initialized = !0;
    let Q = A.payload;
    if (Q.encryptedExperiments || Q.encryptedFeatures) throw Error("initSync does not support encrypted payloads");
    if (this._options.stickyBucketService && !this._options.stickyBucketAssignmentDocs) this._options.stickyBucketAssignmentDocs = this.generateStickyBucketAssignmentDocsSync(this._options.stickyBucketService, Q);
    if (this._payload = Q, this._decryptedPayload = Q, Q.features) this._options.features = Q.features;
    if (Q.experiments) this._options.experiments = Q.experiments, this._updateAllAutoExperiments();
    return this.ready = !0, liA(this, A), this
  }
  async init(A) {
    if (this._initialized = !0, A = A || {}, A.cacheSettings) R8B(A.cacheSettings);
    if (A.payload) return await this.setPayload(A.payload), liA(this, A), {
      success: !0,
      source: "init"
    };
    else {
      let {
        data: Q,
        ...B
      } = await this._refresh({
        ...A,
        allowStale: !0
      });
      return liA(this, A), await this.setPayload(Q || {}), B
    }
  }
  async loadFeatures(A) {
    A = A || {}, await this.init({
      skipCache: A.skipCache,
      timeout: A.timeout,
      streaming: (this._options.backgroundSync ?? !0) && (A.autoRefresh || this._options.subscribeToChanges)
    })
  }
  async refreshFeatures(A) {
    let Q = await this._refresh({
      ...A || {},
      allowStale: !1
    });
    if (Q.data) await this.setPayload(Q.data)
  }
  getApiInfo() {
    return [this.getApiHosts().apiHost, this.getClientKey()]
  }
  getApiHosts() {
    return A6B(this._options)
  }
  getClientKey() {
    return this._options.clientKey || ""
  }
  getPayload() {
    return this._payload || {
      features: this.getFeatures(),
      experiments: this.getExperiments()
    }
  }
  getDecryptedPayload() {
    return this._decryptedPayload || this.getPayload()
  }
  isRemoteEval() {
    return this._options.remoteEval || !1
  }
  getCacheKeyAttributes() {
    return this._options.cacheKeyAttributes
  }
  async _refresh(A) {
    let {
      timeout: Q,
      skipCache: B,
      allowStale: G,
      streaming: Z
    } = A;
    if (!this._options.clientKey) throw Error("Missing clientKey");
    return T8B({
      instance: this,
      timeout: Q,
      skipCache: B || this._options.disableCache,
      allowStale: G,
      backgroundSync: Z ?? this._options.backgroundSync ?? !0
    })
  }
  _render() {
    if (this._renderer) try {
      this._renderer()
    } catch (A) {
      console.error("Failed to render", A)
    }
  }
  setFeatures(A) {
    this._options.features = A, this.ready = !0, this._render()
  }
  async setEncryptedFeatures(A, Q, B) {
    let G = await Xt(A, Q || this._options.decryptionKey, B);
    this.setFeatures(JSON.parse(G))
  }
  setExperiments(A) {
    this._options.experiments = A, this.ready = !0, this._updateAllAutoExperiments()
  }
  async setEncryptedExperiments(A, Q, B) {
    let G = await Xt(A, Q || this._options.decryptionKey, B);
    this.setExperiments(JSON.parse(G))
  }
  async setAttributes(A) {
    if (this._options.attributes = A, this._options.stickyBucketService) await this.refreshStickyBuckets();
    if (this._options.remoteEval) {
      await this._refreshForRemoteEval();
      return
    }
    this._render(), this._updateAllAutoExperiments()
  }
  async updateAttributes(A) {
    return this.setAttributes({
      ...this._options.attributes,
      ...A
    })
  }
  async setAttributeOverrides(A) {
    if (this._options.attributeOverrides = A, this._options.stickyBucketService) await this.refreshStickyBuckets();
    if (this._options.remoteEval) {
      await this._refreshForRemoteEval();
      return
    }
    this._render(), this._updateAllAutoExperiments()
  }
  async setForcedVariations(A) {
    if (this._options.forcedVariations = A || {}, this._options.remoteEval) {
      await this._refreshForRemoteEval();
      return
    }
    this._render(), this._updateAllAutoExperiments()
  }
  setForcedFeatures(A) {
    this._options.forcedFeatureValues = A, this._render()
  }
  async setURL(A) {
    if (A === this._options.url) return;
    if (this._options.url = A, this._redirectedUrl = "", this._options.remoteEval) {
      await this._refreshForRemoteEval(), this._updateAllAutoExperiments(!0);
      return
    }
    this._updateAllAutoExperiments(!0)
  }
  getAttributes() {
    return {
      ...this._options.attributes,
      ...this._options.attributeOverrides
    }
  }
  getForcedVariations() {
    return this._options.forcedVariations || {}
  }
  getForcedFeatures() {
    return this._options.forcedFeatureValues || new Map
  }
  getStickyBucketAssignmentDocs() {
    return this._options.stickyBucketAssignmentDocs || {}
  }
  getUrl() {
    return this._options.url || ""
  }
  getFeatures() {
    return this._options.features || {}
  }
  getExperiments() {
    return this._options.experiments || []
  }
  getCompletedChangeIds() {
    return Array.from(this._completedChangeIds)
  }
  subscribe(A) {
    return this._subscriptions.add(A), () => {
      this._subscriptions.delete(A)
    }
  }
  async _refreshForRemoteEval() {
    if (!this._options.remoteEval) return;
    if (!this._initialized) return;
    let A = await this._refresh({
      allowStale: !1
    });
    if (A.data) await this.setPayload(A.data)
  }
  getAllResults() {
    return new Map(this._assigned)
  }
  onDestroy(A) {
    this._destroyCallbacks.push(A)
  }
  isDestroyed() {
    return !!this._destroyed
  }
  destroy() {
    if (this._destroyed = !0, this._destroyCallbacks.forEach((A) => {
        try {
          A()
        } catch (Q) {
          console.error(Q)
        }
      }), this._subscriptions.clear(), this._assigned.clear(), this._trackedExperiments.clear(), this._completedChangeIds.clear(), this._deferredTrackingCalls.clear(), this._trackedFeatures = {}, this._destroyCallbacks = [], this._payload = void 0, this._saveStickyBucketAssignmentDoc = void 0, P8B(this), this.logs = [], l3A && window._growthbook === this) delete window._growthbook;
    this._activeAutoExperiments.forEach((A) => {
      A.undo()
    }), this._activeAutoExperiments.clear(), this._triggeredExpKeys.clear()
  }
  setRenderer(A) {
    this._renderer = A
  }
  forceVariation(A, Q) {
    if (this._options.forcedVariations = this._options.forcedVariations || {}, this._options.forcedVariations[A] = Q, this._options.remoteEval) {
      this._refreshForRemoteEval();
      return
    }
    this._updateAllAutoExperiments(), this._render()
  }
  run(A) {
    let {
      result: Q
    } = BnA(A, null, this._getEvalContext());
    return this._fireSubscriptions(A, Q), Q
  }
  triggerExperiment(A) {
    if (this._triggeredExpKeys.add(A), !this._options.experiments) return null;
    return this._options.experiments.filter((B) => B.key === A).map((B) => {
      return this._runAutoExperiment(B)
    }).filter((B) => B !== null)
  }
  triggerAutoExperiments() {
    this._autoExperimentsAllowed = !0, this._updateAllAutoExperiments(!0)
  }
  _getEvalContext() {
    return {
      user: this._getUserContext(),
      global: this._getGlobalContext(),
      stack: {
        evaluatedFeatures: new Set
      }
    }
  }
  _getUserContext() {
    return {
      attributes: this._options.user ? {
        ...this._options.user,
        ...this._options.attributes
      } : this._options.attributes,
      enableDevMode: this._options.enableDevMode,
      blockedChangeIds: this._options.blockedChangeIds,
      stickyBucketAssignmentDocs: this._options.stickyBucketAssignmentDocs,
      url: this._getContextUrl(),
      forcedVariations: this._options.forcedVariations,
      forcedFeatureValues: this._options.forcedFeatureValues,
      attributeOverrides: this._options.attributeOverrides,
      saveStickyBucketAssignmentDoc: this._saveStickyBucketAssignmentDoc,
      trackingCallback: this._options.trackingCallback,
      onFeatureUsage: this._options.onFeatureUsage,
      devLogs: this.logs,
      trackedExperiments: this._trackedExperiments,
      trackedFeatureUsage: this._trackedFeatures
    }
  }
  _getGlobalContext() {
    return {
      features: this._options.features,
      experiments: this._options.experiments,
      log: this.log,
      enabled: this._options.enabled,
      qaMode: this._options.qaMode,
      savedGroups: this._options.savedGroups,
      groups: this._options.groups,
      overrides: this._options.overrides,
      onExperimentEval: this._subscriptions.size > 0 ? this._fireSubscriptions : void 0,
      recordChangeId: this._recordChangedId,
      saveDeferredTrack: this._saveDeferredTrack,
      eventLogger: this._options.eventLogger
    }
  }
  _runAutoExperiment(A, Q) {
    let B = this._activeAutoExperiments.get(A);
    if (A.manual && !this._triggeredExpKeys.has(A.key) && !B) return null;
    let G = this._isAutoExperimentBlockedByContext(A),
      Z, I;
    if (G) Z = QY(this._getEvalContext(), A, -1, !1, "");
    else({
      result: Z,
      trackingCall: I
    } = BnA(A, null, this._getEvalContext())), this._fireSubscriptions(A, Z);
    let Y = JSON.stringify(Z.value);
    if (!Q && Z.inExperiment && B && B.valueHash === Y) return Z;
    if (B) this._undoActiveAutoExperiment(A);
    if (Z.inExperiment) {
      let J = diA(A);
      if (J === "redirect" && Z.value.urlRedirect && A.urlPatterns) {
        let W = A.persistQueryString ? L8B(this._getContextUrl(), Z.value.urlRedirect) : Z.value.urlRedirect;
        if (miA(W, A.urlPatterns)) return this.log("Skipping redirect because original URL matches redirect URL", {
          id: A.key
        }), Z;
        this._redirectedUrl = W;
        let {
          navigate: X,
          delay: V
        } = this._getNavigateFunction();
        if (X)
          if (l3A) Promise.all([...I ? [ciA(I, this._options.maxNavigateDelay ?? 1000)] : [], new Promise((F) => window.setTimeout(F, this._options.navigateDelay ?? V))]).then(() => {
            try {
              X(W)
            } catch (F) {
              console.error(F)
            }
          });
          else try {
            X(W)
          } catch (F) {
            console.error(F)
          }
      } else if (J === "visual") {
        let W = this._options.applyDomChangesCallback ? this._options.applyDomChangesCallback(Z.value) : this._applyDOMChanges(Z.value);
        if (W) this._activeAutoExperiments.set(A, {
          undo: W,
          valueHash: Y
        })
      }
    }
    return Z
  }
  _undoActiveAutoExperiment(A) {
    let Q = this._activeAutoExperiments.get(A);
    if (Q) Q.undo(), this._activeAutoExperiments.delete(A)
  }
  _updateAllAutoExperiments(A) {
    if (!this._autoExperimentsAllowed) return;
    let Q = this._options.experiments || [],
      B = new Set(Q);
    this._activeAutoExperiments.forEach((G, Z) => {
      if (!B.has(Z)) G.undo(), this._activeAutoExperiments.delete(Z)
    });
    for (let G of Q) {
      let Z = this._runAutoExperiment(G, A);
      if (Z !== null && Z !== void 0 && Z.inExperiment && diA(G) === "redirect") break
    }
  }
  _fireSubscriptions(A, Q) {
    let B = A.key,
      G = this._assigned.get(B);
    if (!G || G.result.inExperiment !== Q.inExperiment || G.result.variationId !== Q.variationId) this._assigned.set(B, {
      experiment: A,
      result: Q
    }), this._subscriptions.forEach((Z) => {
      try {
        Z(A, Q)
      } catch (I) {
        console.error(I)
      }
    })
  }
  _recordChangedId(A) {
    this._completedChangeIds.add(A)
  }
  isOn(A) {
    return this.evalFeature(A).on
  }
  isOff(A) {
    return this.evalFeature(A).off
  }
  getFeatureValue(A, Q) {
    let B = this.evalFeature(A).value;
    return B === null ? Q : B
  }
  feature(A) {
    return this.evalFeature(A)
  }
  evalFeature(A) {
    return QnA(A, this._getEvalContext())
  }
  log(A, Q) {
    if (!this.debug) return;
    if (this._options.log) this._options.log(A, Q);
    else console.log(A, Q)
  }
  getDeferredTrackingCalls() {
    return Array.from(this._deferredTrackingCalls.values())
  }
  setDeferredTrackingCalls(A) {
    this._deferredTrackingCalls = new Map(A.filter((Q) => Q && Q.experiment && Q.result).map((Q) => {
      return [GnA(Q.experiment, Q.result), Q]
    }))
  }
  async fireDeferredTrackingCalls() {
    if (!this._options.trackingCallback) return;
    let A = [];
    this._deferredTrackingCalls.forEach((Q) => {
      if (!Q || !Q.experiment || !Q.result) console.error("Invalid deferred tracking call", {
        call: Q
      });
      else A.push(this._options.trackingCallback(Q.experiment, Q.result))
    }), this._deferredTrackingCalls.clear(), await Promise.all(A)
  }
  setTrackingCallback(A) {
    this._options.trackingCallback = A, this.fireDeferredTrackingCalls()
  }
  setEventLogger(A) {
    this._options.eventLogger = A
  }
  async logEvent(A, Q) {
    if (this._destroyed) {
      console.error("Cannot log event to destroyed GrowthBook instance");
      return
    }
    if (this._options.enableDevMode) this.logs.push({
      eventName: A,
      properties: Q,
      timestamp: Date.now().toString(),
      logType: "event"
    });
    if (this._options.eventLogger) try {
      await this._options.eventLogger(A, Q || {}, this._getUserContext())
    } catch (B) {
      console.error(B)
    } else console.error("No event logger configured")
  }
  _saveDeferredTrack(A) {
    this._deferredTrackingCalls.set(GnA(A.experiment, A.result), A)
  }
  _getContextUrl() {
    return this._options.url || (l3A ? window.location.href : "")
  }
  _isAutoExperimentBlockedByContext(A) {
    let Q = diA(A);
    if (Q === "visual") {
      if (this._options.disableVisualExperiments) return !0;
      if (this._options.disableJsInjection) {
        if (A.variations.some((B) => B.js)) return !0
      }
    } else if (Q === "redirect") {
      if (this._options.disableUrlRedirectExperiments) return !0;
      try {
        let B = new URL(this._getContextUrl());
        for (let G of A.variations) {
          if (!G || !G.urlRedirect) continue;
          let Z = new URL(G.urlRedirect);
          if (this._options.disableCrossOriginUrlRedirectExperiments) {
            if (Z.protocol !== B.protocol) return !0;
            if (Z.host !== B.host) return !0
          }
        }
      } catch (B) {
        return this.log("Error parsing current or redirect URL", {
          id: A.key,
          error: B
        }), !0
      }
    } else return !0;
    if (A.changeId && (this._options.blockedChangeIds || []).includes(A.changeId)) return !0;
    return !1
  }
  getRedirectUrl() {
    return this._redirectedUrl
  }
  _getNavigateFunction() {
    if (this._options.navigate) return {
      navigate: this._options.navigate,
      delay: 0
    };
    else if (l3A) return {
      navigate: (A) => {
        window.location.replace(A)
      },
      delay: 100
    };
    return {
      navigate: null,
      delay: 0
    }
  }
  _applyDOMChanges(A) {
    if (!l3A) return;
    let Q = [];
    if (A.css) {
      let B = document.createElement("style");
      B.innerHTML = A.css, document.head.appendChild(B), Q.push(() => B.remove())
    }
    if (A.js) {
      let B = document.createElement("script");
      if (B.innerHTML = A.js, this._options.jsInjectionNonce) B.nonce = this._options.jsInjectionNonce;
      document.head.appendChild(B), Q.push(() => B.remove())
    }
    if (A.domMutations) A.domMutations.forEach((B) => {
      Q.push(B6B.default.declarative(B).revert)
    });
    return () => {
      Q.forEach((B) => B())
    }
  }
  async refreshStickyBuckets(A) {
    if (this._options.stickyBucketService) {
      let Q = this._getEvalContext(),
        B = await t8B(Q, this._options.stickyBucketService, A);
      this._options.stickyBucketAssignmentDocs = B
    }
  }
  generateStickyBucketAssignmentDocsSync(A, Q) {
    if (!("getAllAssignmentsSync" in A)) {
      console.error("generating StickyBucketAssignmentDocs docs requires StickyBucketServiceSync");
      return
    }
    let B = this._getEvalContext(),
      G = Hb1(B, Q);
    return A.getAllAssignmentsSync(G)
  }
  inDevMode() {
    return !!this._options.enableDevMode
  }
}
// @from(Start 5212777, End 5212780)
B6B
// @from(Start 5212782, End 5212785)
l3A
// @from(Start 5212787, End 5212790)
so8
// @from(Start 5212796, End 5212927)
G6B = L(() => {
  lzA();
  k8B();
  Q6B();
  B6B = BA(p8B(), 1), l3A = typeof window < "u" && typeof document < "u", so8 = N8B()
})
// @from(Start 5212933, End 5212959)
Z6B = L(() => {
  G6B()
})
// @from(Start 5212962, End 5213206)
function fX() {
  return Y0(process.env.CLAUDE_CODE_USE_BEDROCK) || Y0(process.env.CLAUDE_CODE_USE_VERTEX) || Y0(process.env.CLAUDE_CODE_USE_FOUNDRY) || !!process.env.DISABLE_TELEMETRY || !!process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC
}
// @from(Start 5213211, End 5213235)
Ft = L(() => {
  hQ()
})
// @from(Start 5213241, End 5213428)
J6B = z((I6B) => {
  Object.defineProperty(I6B, "__esModule", {
    value: !0
  });
  I6B._globalThis = void 0;
  I6B._globalThis = typeof globalThis === "object" ? globalThis : global
})
// @from(Start 5213434, End 5214032)
W6B = z((Kt) => {
  var ro8 = Kt && Kt.__createBinding || (Object.create ? function(A, Q, B, G) {
      if (G === void 0) G = B;
      Object.defineProperty(A, G, {
        enumerable: !0,
        get: function() {
          return Q[B]
        }
      })
    } : function(A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    oo8 = Kt && Kt.__exportStar || function(A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) ro8(Q, A, B)
    };
  Object.defineProperty(Kt, "__esModule", {
    value: !0
  });
  oo8(J6B(), Kt)
})
// @from(Start 5214038, End 5214636)
X6B = z((Dt) => {
  var to8 = Dt && Dt.__createBinding || (Object.create ? function(A, Q, B, G) {
      if (G === void 0) G = B;
      Object.defineProperty(A, G, {
        enumerable: !0,
        get: function() {
          return Q[B]
        }
      })
    } : function(A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    eo8 = Dt && Dt.__exportStar || function(A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) to8(Q, A, B)
    };
  Object.defineProperty(Dt, "__esModule", {
    value: !0
  });
  eo8(W6B(), Dt)
})
// @from(Start 5214642, End 5214776)
Cb1 = z((V6B) => {
  Object.defineProperty(V6B, "__esModule", {
    value: !0
  });
  V6B.VERSION = void 0;
  V6B.VERSION = "1.9.0"
})
// @from(Start 5214782, End 5216013)
E6B = z((H6B) => {
  Object.defineProperty(H6B, "__esModule", {
    value: !0
  });
  H6B.isCompatible = H6B._makeCompatibilityCheck = void 0;
  var At8 = Cb1(),
    K6B = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;

  function D6B(A) {
    let Q = new Set([A]),
      B = new Set,
      G = A.match(K6B);
    if (!G) return () => !1;
    let Z = {
      major: +G[1],
      minor: +G[2],
      patch: +G[3],
      prerelease: G[4]
    };
    if (Z.prerelease != null) return function(W) {
      return W === A
    };

    function I(J) {
      return B.add(J), !1
    }

    function Y(J) {
      return Q.add(J), !0
    }
    return function(W) {
      if (Q.has(W)) return !0;
      if (B.has(W)) return !1;
      let X = W.match(K6B);
      if (!X) return I(W);
      let V = {
        major: +X[1],
        minor: +X[2],
        patch: +X[3],
        prerelease: X[4]
      };
      if (V.prerelease != null) return I(W);
      if (Z.major !== V.major) return I(W);
      if (Z.major === 0) {
        if (Z.minor === V.minor && Z.patch <= V.patch) return Y(W);
        return I(W)
      }
      if (Z.minor <= V.minor) return Y(W);
      return I(W)
    }
  }
  H6B._makeCompatibilityCheck = D6B;
  H6B.isCompatible = D6B(At8.VERSION)
})
// @from(Start 5216019, End 5217471)
Ht = z((z6B) => {
  Object.defineProperty(z6B, "__esModule", {
    value: !0
  });
  z6B.unregisterGlobal = z6B.getGlobal = z6B.registerGlobal = void 0;
  var Bt8 = X6B(),
    i3A = Cb1(),
    Gt8 = E6B(),
    Zt8 = i3A.VERSION.split(".")[0],
    rzA = Symbol.for(`opentelemetry.js.api.${Zt8}`),
    ozA = Bt8._globalThis;

  function It8(A, Q, B, G = !1) {
    var Z;
    let I = ozA[rzA] = (Z = ozA[rzA]) !== null && Z !== void 0 ? Z : {
      version: i3A.VERSION
    };
    if (!G && I[A]) {
      let Y = Error(`@opentelemetry/api: Attempted duplicate registration of API: ${A}`);
      return B.error(Y.stack || Y.message), !1
    }
    if (I.version !== i3A.VERSION) {
      let Y = Error(`@opentelemetry/api: Registration of version v${I.version} for ${A} does not match previously registered API v${i3A.VERSION}`);
      return B.error(Y.stack || Y.message), !1
    }
    return I[A] = Q, B.debug(`@opentelemetry/api: Registered a global for ${A} v${i3A.VERSION}.`), !0
  }
  z6B.registerGlobal = It8;

  function Yt8(A) {
    var Q, B;
    let G = (Q = ozA[rzA]) === null || Q === void 0 ? void 0 : Q.version;
    if (!G || !(0, Gt8.isCompatible)(G)) return;
    return (B = ozA[rzA]) === null || B === void 0 ? void 0 : B[A]
  }
  z6B.getGlobal = Yt8;

  function Jt8(A, Q) {
    Q.debug(`@opentelemetry/api: Unregistering a global for ${A} v${i3A.VERSION}.`);
    let B = ozA[rzA];
    if (B) delete B[A]
  }
  z6B.unregisterGlobal = Jt8
})
// @from(Start 5217477, End 5218233)
N6B = z((w6B) => {
  Object.defineProperty(w6B, "__esModule", {
    value: !0
  });
  w6B.DiagComponentLogger = void 0;
  var Vt8 = Ht();
  class $6B {
    constructor(A) {
      this._namespace = A.namespace || "DiagComponentLogger"
    }
    debug(...A) {
      return tzA("debug", this._namespace, A)
    }
    error(...A) {
      return tzA("error", this._namespace, A)
    }
    info(...A) {
      return tzA("info", this._namespace, A)
    }
    warn(...A) {
      return tzA("warn", this._namespace, A)
    }
    verbose(...A) {
      return tzA("verbose", this._namespace, A)
    }
  }
  w6B.DiagComponentLogger = $6B;

  function tzA(A, Q, B) {
    let G = (0, Vt8.getGlobal)("diag");
    if (!G) return;
    return B.unshift(Q), G[A](...B)
  }
})
// @from(Start 5218239, End 5218625)
InA = z((L6B) => {
  Object.defineProperty(L6B, "__esModule", {
    value: !0
  });
  L6B.DiagLogLevel = void 0;
  var Ft8;
  (function(A) {
    A[A.NONE = 0] = "NONE", A[A.ERROR = 30] = "ERROR", A[A.WARN = 50] = "WARN", A[A.INFO = 60] = "INFO", A[A.DEBUG = 70] = "DEBUG", A[A.VERBOSE = 80] = "VERBOSE", A[A.ALL = 9999] = "ALL"
  })(Ft8 = L6B.DiagLogLevel || (L6B.DiagLogLevel = {}))
})
// @from(Start 5218631, End 5219379)
R6B = z((M6B) => {
  Object.defineProperty(M6B, "__esModule", {
    value: !0
  });
  M6B.createLogLevelDiagLogger = void 0;
  var mb = InA();

  function Kt8(A, Q) {
    if (A < mb.DiagLogLevel.NONE) A = mb.DiagLogLevel.NONE;
    else if (A > mb.DiagLogLevel.ALL) A = mb.DiagLogLevel.ALL;
    Q = Q || {};

    function B(G, Z) {
      let I = Q[G];
      if (typeof I === "function" && A >= Z) return I.bind(Q);
      return function() {}
    }
    return {
      error: B("error", mb.DiagLogLevel.ERROR),
      warn: B("warn", mb.DiagLogLevel.WARN),
      info: B("info", mb.DiagLogLevel.INFO),
      debug: B("debug", mb.DiagLogLevel.DEBUG),
      verbose: B("verbose", mb.DiagLogLevel.VERBOSE)
    }
  }
  M6B.createLogLevelDiagLogger = Kt8
})
// @from(Start 5219385, End 5221258)
Ct = z((P6B) => {
  Object.defineProperty(P6B, "__esModule", {
    value: !0
  });
  P6B.DiagAPI = void 0;
  var Dt8 = N6B(),
    Ht8 = R6B(),
    T6B = InA(),
    YnA = Ht(),
    Ct8 = "diag";
  class zb1 {
    constructor() {
      function A(G) {
        return function(...Z) {
          let I = (0, YnA.getGlobal)("diag");
          if (!I) return;
          return I[G](...Z)
        }
      }
      let Q = this,
        B = (G, Z = {
          logLevel: T6B.DiagLogLevel.INFO
        }) => {
          var I, Y, J;
          if (G === Q) {
            let V = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
            return Q.error((I = V.stack) !== null && I !== void 0 ? I : V.message), !1
          }
          if (typeof Z === "number") Z = {
            logLevel: Z
          };
          let W = (0, YnA.getGlobal)("diag"),
            X = (0, Ht8.createLogLevelDiagLogger)((Y = Z.logLevel) !== null && Y !== void 0 ? Y : T6B.DiagLogLevel.INFO, G);
          if (W && !Z.suppressOverrideMessage) {
            let V = (J = Error().stack) !== null && J !== void 0 ? J : "<failed to generate stacktrace>";
            W.warn(`Current logger will be overwritten from ${V}`), X.warn(`Current logger will overwrite one already registered from ${V}`)
          }
          return (0, YnA.registerGlobal)("diag", X, Q, !0)
        };
      Q.setLogger = B, Q.disable = () => {
        (0, YnA.unregisterGlobal)(Ct8, Q)
      }, Q.createComponentLogger = (G) => {
        return new Dt8.DiagComponentLogger(G)
      }, Q.verbose = A("verbose"), Q.debug = A("debug"), Q.info = A("info"), Q.warn = A("warn"), Q.error = A("error")
    }
    static instance() {
      if (!this._instance) this._instance = new zb1;
      return this._instance
    }
  }
  P6B.DiagAPI = zb1
})
// @from(Start 5221264, End 5222086)
k6B = z((S6B) => {
  Object.defineProperty(S6B, "__esModule", {
    value: !0
  });
  S6B.BaggageImpl = void 0;
  class n3A {
    constructor(A) {
      this._entries = A ? new Map(A) : new Map
    }
    getEntry(A) {
      let Q = this._entries.get(A);
      if (!Q) return;
      return Object.assign({}, Q)
    }
    getAllEntries() {
      return Array.from(this._entries.entries()).map(([A, Q]) => [A, Q])
    }
    setEntry(A, Q) {
      let B = new n3A(this._entries);
      return B._entries.set(A, Q), B
    }
    removeEntry(A) {
      let Q = new n3A(this._entries);
      return Q._entries.delete(A), Q
    }
    removeEntries(...A) {
      let Q = new n3A(this._entries);
      for (let B of A) Q._entries.delete(B);
      return Q
    }
    clear() {
      return new n3A
    }
  }
  S6B.BaggageImpl = n3A
})
// @from(Start 5222092, End 5222287)
v6B = z((y6B) => {
  Object.defineProperty(y6B, "__esModule", {
    value: !0
  });
  y6B.baggageEntryMetadataSymbol = void 0;
  y6B.baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata")
})
// @from(Start 5222293, End 5222942)
Ub1 = z((b6B) => {
  Object.defineProperty(b6B, "__esModule", {
    value: !0
  });
  b6B.baggageEntryMetadataFromString = b6B.createBaggage = void 0;
  var Et8 = Ct(),
    zt8 = k6B(),
    Ut8 = v6B(),
    $t8 = Et8.DiagAPI.instance();

  function wt8(A = {}) {
    return new zt8.BaggageImpl(new Map(Object.entries(A)))
  }
  b6B.createBaggage = wt8;

  function qt8(A) {
    if (typeof A !== "string") $t8.error(`Cannot create baggage metadata from unknown type: ${typeof A}`), A = "";
    return {
      __TYPE__: Ut8.baggageEntryMetadataSymbol,
      toString() {
        return A
      }
    }
  }
  b6B.baggageEntryMetadataFromString = qt8
})
// @from(Start 5222948, End 5223605)
ezA = z((h6B) => {
  Object.defineProperty(h6B, "__esModule", {
    value: !0
  });
  h6B.ROOT_CONTEXT = h6B.createContextKey = void 0;

  function Lt8(A) {
    return Symbol.for(A)
  }
  h6B.createContextKey = Lt8;
  class JnA {
    constructor(A) {
      let Q = this;
      Q._currentContext = A ? new Map(A) : new Map, Q.getValue = (B) => Q._currentContext.get(B), Q.setValue = (B, G) => {
        let Z = new JnA(Q._currentContext);
        return Z._currentContext.set(B, G), Z
      }, Q.deleteValue = (B) => {
        let G = new JnA(Q._currentContext);
        return G._currentContext.delete(B), G
      }
    }
  }
  h6B.ROOT_CONTEXT = new JnA
})
// @from(Start 5223611, End 5224346)
c6B = z((m6B) => {
  Object.defineProperty(m6B, "__esModule", {
    value: !0
  });
  m6B.DiagConsoleLogger = void 0;
  var $b1 = [{
    n: "error",
    c: "error"
  }, {
    n: "warn",
    c: "warn"
  }, {
    n: "info",
    c: "info"
  }, {
    n: "debug",
    c: "debug"
  }, {
    n: "verbose",
    c: "trace"
  }];
  class u6B {
    constructor() {
      function A(Q) {
        return function(...B) {
          if (console) {
            let G = console[Q];
            if (typeof G !== "function") G = console.log;
            if (typeof G === "function") return G.apply(console, B)
          }
        }
      }
      for (let Q = 0; Q < $b1.length; Q++) this[$b1[Q].n] = A($b1[Q].c)
    }
  }
  m6B.DiagConsoleLogger = u6B
})
// @from(Start 5224352, End 5226778)
Pb1 = z((p6B) => {
  Object.defineProperty(p6B, "__esModule", {
    value: !0
  });
  p6B.createNoopMeter = p6B.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = p6B.NOOP_OBSERVABLE_GAUGE_METRIC = p6B.NOOP_OBSERVABLE_COUNTER_METRIC = p6B.NOOP_UP_DOWN_COUNTER_METRIC = p6B.NOOP_HISTOGRAM_METRIC = p6B.NOOP_GAUGE_METRIC = p6B.NOOP_COUNTER_METRIC = p6B.NOOP_METER = p6B.NoopObservableUpDownCounterMetric = p6B.NoopObservableGaugeMetric = p6B.NoopObservableCounterMetric = p6B.NoopObservableMetric = p6B.NoopHistogramMetric = p6B.NoopGaugeMetric = p6B.NoopUpDownCounterMetric = p6B.NoopCounterMetric = p6B.NoopMetric = p6B.NoopMeter = void 0;
  class wb1 {
    constructor() {}
    createGauge(A, Q) {
      return p6B.NOOP_GAUGE_METRIC
    }
    createHistogram(A, Q) {
      return p6B.NOOP_HISTOGRAM_METRIC
    }
    createCounter(A, Q) {
      return p6B.NOOP_COUNTER_METRIC
    }
    createUpDownCounter(A, Q) {
      return p6B.NOOP_UP_DOWN_COUNTER_METRIC
    }
    createObservableGauge(A, Q) {
      return p6B.NOOP_OBSERVABLE_GAUGE_METRIC
    }
    createObservableCounter(A, Q) {
      return p6B.NOOP_OBSERVABLE_COUNTER_METRIC
    }
    createObservableUpDownCounter(A, Q) {
      return p6B.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC
    }
    addBatchObservableCallback(A, Q) {}
    removeBatchObservableCallback(A) {}
  }
  p6B.NoopMeter = wb1;
  class a3A {}
  p6B.NoopMetric = a3A;
  class qb1 extends a3A {
    add(A, Q) {}
  }
  p6B.NoopCounterMetric = qb1;
  class Nb1 extends a3A {
    add(A, Q) {}
  }
  p6B.NoopUpDownCounterMetric = Nb1;
  class Lb1 extends a3A {
    record(A, Q) {}
  }
  p6B.NoopGaugeMetric = Lb1;
  class Mb1 extends a3A {
    record(A, Q) {}
  }
  p6B.NoopHistogramMetric = Mb1;
  class AUA {
    addCallback(A) {}
    removeCallback(A) {}
  }
  p6B.NoopObservableMetric = AUA;
  class Ob1 extends AUA {}
  p6B.NoopObservableCounterMetric = Ob1;
  class Rb1 extends AUA {}
  p6B.NoopObservableGaugeMetric = Rb1;
  class Tb1 extends AUA {}
  p6B.NoopObservableUpDownCounterMetric = Tb1;
  p6B.NOOP_METER = new wb1;
  p6B.NOOP_COUNTER_METRIC = new qb1;
  p6B.NOOP_GAUGE_METRIC = new Lb1;
  p6B.NOOP_HISTOGRAM_METRIC = new Mb1;
  p6B.NOOP_UP_DOWN_COUNTER_METRIC = new Nb1;
  p6B.NOOP_OBSERVABLE_COUNTER_METRIC = new Ob1;
  p6B.NOOP_OBSERVABLE_GAUGE_METRIC = new Rb1;
  p6B.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new Tb1;

  function Ot8() {
    return p6B.NOOP_METER
  }
  p6B.createNoopMeter = Ot8
})
// @from(Start 5226784, End 5227027)
Q5B = z((A5B) => {
  Object.defineProperty(A5B, "__esModule", {
    value: !0
  });
  A5B.ValueType = void 0;
  var bt8;
  (function(A) {
    A[A.INT = 0] = "INT", A[A.DOUBLE = 1] = "DOUBLE"
  })(bt8 = A5B.ValueType || (A5B.ValueType = {}))
})
// @from(Start 5227033, End 5227473)
Sb1 = z((B5B) => {
  Object.defineProperty(B5B, "__esModule", {
    value: !0
  });
  B5B.defaultTextMapSetter = B5B.defaultTextMapGetter = void 0;
  B5B.defaultTextMapGetter = {
    get(A, Q) {
      if (A == null) return;
      return A[Q]
    },
    keys(A) {
      if (A == null) return [];
      return Object.keys(A)
    }
  };
  B5B.defaultTextMapSetter = {
    set(A, Q, B) {
      if (A == null) return;
      A[Q] = B
    }
  }
})
// @from(Start 5227479, End 5227897)
J5B = z((I5B) => {
  Object.defineProperty(I5B, "__esModule", {
    value: !0
  });
  I5B.NoopContextManager = void 0;
  var ht8 = ezA();
  class Z5B {
    active() {
      return ht8.ROOT_CONTEXT
    }
    with(A, Q, B, ...G) {
      return Q.call(B, ...G)
    }
    bind(A, Q) {
      return Q
    }
    enable() {
      return this
    }
    disable() {
      return this
    }
  }
  I5B.NoopContextManager = Z5B
})
// @from(Start 5227903, End 5228840)
QUA = z((X5B) => {
  Object.defineProperty(X5B, "__esModule", {
    value: !0
  });
  X5B.ContextAPI = void 0;
  var gt8 = J5B(),
    _b1 = Ht(),
    W5B = Ct(),
    kb1 = "context",
    ut8 = new gt8.NoopContextManager;
  class yb1 {
    constructor() {}
    static getInstance() {
      if (!this._instance) this._instance = new yb1;
      return this._instance
    }
    setGlobalContextManager(A) {
      return (0, _b1.registerGlobal)(kb1, A, W5B.DiagAPI.instance())
    }
    active() {
      return this._getContextManager().active()
    }
    with(A, Q, B, ...G) {
      return this._getContextManager().with(A, Q, B, ...G)
    }
    bind(A, Q) {
      return this._getContextManager().bind(A, Q)
    }
    _getContextManager() {
      return (0, _b1.getGlobal)(kb1) || ut8
    }
    disable() {
      this._getContextManager().disable(), (0, _b1.unregisterGlobal)(kb1, W5B.DiagAPI.instance())
    }
  }
  X5B.ContextAPI = yb1
})
// @from(Start 5228846, End 5229096)
vb1 = z((F5B) => {
  Object.defineProperty(F5B, "__esModule", {
    value: !0
  });
  F5B.TraceFlags = void 0;
  var mt8;
  (function(A) {
    A[A.NONE = 0] = "NONE", A[A.SAMPLED = 1] = "SAMPLED"
  })(mt8 = F5B.TraceFlags || (F5B.TraceFlags = {}))
})
// @from(Start 5229102, End 5229527)
WnA = z((K5B) => {
  Object.defineProperty(K5B, "__esModule", {
    value: !0
  });
  K5B.INVALID_SPAN_CONTEXT = K5B.INVALID_TRACEID = K5B.INVALID_SPANID = void 0;
  var dt8 = vb1();
  K5B.INVALID_SPANID = "0000000000000000";
  K5B.INVALID_TRACEID = "00000000000000000000000000000000";
  K5B.INVALID_SPAN_CONTEXT = {
    traceId: K5B.INVALID_TRACEID,
    spanId: K5B.INVALID_SPANID,
    traceFlags: dt8.TraceFlags.NONE
  }
})
// @from(Start 5229533, End 5230253)
XnA = z((z5B) => {
  Object.defineProperty(z5B, "__esModule", {
    value: !0
  });
  z5B.NonRecordingSpan = void 0;
  var ct8 = WnA();
  class E5B {
    constructor(A = ct8.INVALID_SPAN_CONTEXT) {
      this._spanContext = A
    }
    spanContext() {
      return this._spanContext
    }
    setAttribute(A, Q) {
      return this
    }
    setAttributes(A) {
      return this
    }
    addEvent(A, Q) {
      return this
    }
    addLink(A) {
      return this
    }
    addLinks(A) {
      return this
    }
    setStatus(A) {
      return this
    }
    updateName(A) {
      return this
    }
    end(A) {}
    isRecording() {
      return !1
    }
    recordException(A, Q) {}
  }
  z5B.NonRecordingSpan = E5B
})
// @from(Start 5230259, End 5231174)
hb1 = z((w5B) => {
  Object.defineProperty(w5B, "__esModule", {
    value: !0
  });
  w5B.getSpanContext = w5B.setSpanContext = w5B.deleteSpan = w5B.setSpan = w5B.getActiveSpan = w5B.getSpan = void 0;
  var pt8 = ezA(),
    lt8 = XnA(),
    it8 = QUA(),
    bb1 = (0, pt8.createContextKey)("OpenTelemetry Context Key SPAN");

  function fb1(A) {
    return A.getValue(bb1) || void 0
  }
  w5B.getSpan = fb1;

  function nt8() {
    return fb1(it8.ContextAPI.getInstance().active())
  }
  w5B.getActiveSpan = nt8;

  function $5B(A, Q) {
    return A.setValue(bb1, Q)
  }
  w5B.setSpan = $5B;

  function at8(A) {
    return A.deleteValue(bb1)
  }
  w5B.deleteSpan = at8;

  function st8(A, Q) {
    return $5B(A, new lt8.NonRecordingSpan(Q))
  }
  w5B.setSpanContext = st8;

  function rt8(A) {
    var Q;
    return (Q = fb1(A)) === null || Q === void 0 ? void 0 : Q.spanContext()
  }
  w5B.getSpanContext = rt8
})
// @from(Start 5231180, End 5231860)
VnA = z((O5B) => {
  Object.defineProperty(O5B, "__esModule", {
    value: !0
  });
  O5B.wrapSpanContext = O5B.isSpanContextValid = O5B.isValidSpanId = O5B.isValidTraceId = void 0;
  var N5B = WnA(),
    Be8 = XnA(),
    Ge8 = /^([0-9a-f]{32})$/i,
    Ze8 = /^[0-9a-f]{16}$/i;

  function L5B(A) {
    return Ge8.test(A) && A !== N5B.INVALID_TRACEID
  }
  O5B.isValidTraceId = L5B;

  function M5B(A) {
    return Ze8.test(A) && A !== N5B.INVALID_SPANID
  }
  O5B.isValidSpanId = M5B;

  function Ie8(A) {
    return L5B(A.traceId) && M5B(A.spanId)
  }
  O5B.isSpanContextValid = Ie8;

  function Ye8(A) {
    return new Be8.NonRecordingSpan(A)
  }
  O5B.wrapSpanContext = Ye8
})
// @from(Start 5231866, End 5233015)
mb1 = z((j5B) => {
  Object.defineProperty(j5B, "__esModule", {
    value: !0
  });
  j5B.NoopTracer = void 0;
  var Ve8 = QUA(),
    T5B = hb1(),
    gb1 = XnA(),
    Fe8 = VnA(),
    ub1 = Ve8.ContextAPI.getInstance();
  class P5B {
    startSpan(A, Q, B = ub1.active()) {
      if (Boolean(Q === null || Q === void 0 ? void 0 : Q.root)) return new gb1.NonRecordingSpan;
      let Z = B && (0, T5B.getSpanContext)(B);
      if (Ke8(Z) && (0, Fe8.isSpanContextValid)(Z)) return new gb1.NonRecordingSpan(Z);
      else return new gb1.NonRecordingSpan
    }
    startActiveSpan(A, Q, B, G) {
      let Z, I, Y;
      if (arguments.length < 2) return;
      else if (arguments.length === 2) Y = Q;
      else if (arguments.length === 3) Z = Q, Y = B;
      else Z = Q, I = B, Y = G;
      let J = I !== null && I !== void 0 ? I : ub1.active(),
        W = this.startSpan(A, Z, J),
        X = (0, T5B.setSpan)(J, W);
      return ub1.with(X, Y, void 0, W)
    }
  }
  j5B.NoopTracer = P5B;

  function Ke8(A) {
    return typeof A === "object" && typeof A.spanId === "string" && typeof A.traceId === "string" && typeof A.traceFlags === "number"
  }
})
// @from(Start 5233021, End 5233787)
db1 = z((k5B) => {
  Object.defineProperty(k5B, "__esModule", {
    value: !0
  });
  k5B.ProxyTracer = void 0;
  var De8 = mb1(),
    He8 = new De8.NoopTracer;
  class _5B {
    constructor(A, Q, B, G) {
      this._provider = A, this.name = Q, this.version = B, this.options = G
    }
    startSpan(A, Q, B) {
      return this._getTracer().startSpan(A, Q, B)
    }
    startActiveSpan(A, Q, B, G) {
      let Z = this._getTracer();
      return Reflect.apply(Z.startActiveSpan, Z, arguments)
    }
    _getTracer() {
      if (this._delegate) return this._delegate;
      let A = this._provider.getDelegateTracer(this.name, this.version, this.options);
      if (!A) return He8;
      return this._delegate = A, this._delegate
    }
  }
  k5B.ProxyTracer = _5B
})
// @from(Start 5233793, End 5234045)
f5B = z((v5B) => {
  Object.defineProperty(v5B, "__esModule", {
    value: !0
  });
  v5B.NoopTracerProvider = void 0;
  var Ce8 = mb1();
  class x5B {
    getTracer(A, Q, B) {
      return new Ce8.NoopTracer
    }
  }
  v5B.NoopTracerProvider = x5B
})
// @from(Start 5234051, End 5234761)
cb1 = z((g5B) => {
  Object.defineProperty(g5B, "__esModule", {
    value: !0
  });
  g5B.ProxyTracerProvider = void 0;
  var Ee8 = db1(),
    ze8 = f5B(),
    Ue8 = new ze8.NoopTracerProvider;
  class h5B {
    getTracer(A, Q, B) {
      var G;
      return (G = this.getDelegateTracer(A, Q, B)) !== null && G !== void 0 ? G : new Ee8.ProxyTracer(this, A, Q, B)
    }
    getDelegate() {
      var A;
      return (A = this._delegate) !== null && A !== void 0 ? A : Ue8
    }
    setDelegate(A) {
      this._delegate = A
    }
    getDelegateTracer(A, Q, B) {
      var G;
      return (G = this._delegate) === null || G === void 0 ? void 0 : G.getTracer(A, Q, B)
    }
  }
  g5B.ProxyTracerProvider = h5B
})
// @from(Start 5234767, End 5235097)
d5B = z((m5B) => {
  Object.defineProperty(m5B, "__esModule", {
    value: !0
  });
  m5B.SamplingDecision = void 0;
  var $e8;
  (function(A) {
    A[A.NOT_RECORD = 0] = "NOT_RECORD", A[A.RECORD = 1] = "RECORD", A[A.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED"
  })($e8 = m5B.SamplingDecision || (m5B.SamplingDecision = {}))
})
// @from(Start 5235103, End 5235445)
p5B = z((c5B) => {
  Object.defineProperty(c5B, "__esModule", {
    value: !0
  });
  c5B.SpanKind = void 0;
  var we8;
  (function(A) {
    A[A.INTERNAL = 0] = "INTERNAL", A[A.SERVER = 1] = "SERVER", A[A.CLIENT = 2] = "CLIENT", A[A.PRODUCER = 3] = "PRODUCER", A[A.CONSUMER = 4] = "CONSUMER"
  })(we8 = c5B.SpanKind || (c5B.SpanKind = {}))
})
// @from(Start 5235451, End 5235731)
i5B = z((l5B) => {
  Object.defineProperty(l5B, "__esModule", {
    value: !0
  });
  l5B.SpanStatusCode = void 0;
  var qe8;
  (function(A) {
    A[A.UNSET = 0] = "UNSET", A[A.OK = 1] = "OK", A[A.ERROR = 2] = "ERROR"
  })(qe8 = l5B.SpanStatusCode || (l5B.SpanStatusCode = {}))
})
// @from(Start 5235737, End 5236242)
s5B = z((n5B) => {
  Object.defineProperty(n5B, "__esModule", {
    value: !0
  });
  n5B.validateValue = n5B.validateKey = void 0;
  var nb1 = "[_0-9a-z-*/]",
    Ne8 = `[a-z]${nb1}{0,255}`,
    Le8 = `[a-z0-9]${nb1}{0,240}@[a-z]${nb1}{0,13}`,
    Me8 = new RegExp(`^(?:${Ne8}|${Le8})$`),
    Oe8 = /^[ -~]{0,255}[!-~]$/,
    Re8 = /,|=/;

  function Te8(A) {
    return Me8.test(A)
  }
  n5B.validateKey = Te8;

  function Pe8(A) {
    return Oe8.test(A) && !Re8.test(A)
  }
  n5B.validateValue = Pe8
})
// @from(Start 5236248, End 5237771)
B3B = z((A3B) => {
  Object.defineProperty(A3B, "__esModule", {
    value: !0
  });
  A3B.TraceStateImpl = void 0;
  var r5B = s5B(),
    o5B = 32,
    Se8 = 512,
    t5B = ",",
    e5B = "=";
  class ab1 {
    constructor(A) {
      if (this._internalState = new Map, A) this._parse(A)
    }
    set(A, Q) {
      let B = this._clone();
      if (B._internalState.has(A)) B._internalState.delete(A);
      return B._internalState.set(A, Q), B
    }
    unset(A) {
      let Q = this._clone();
      return Q._internalState.delete(A), Q
    }
    get(A) {
      return this._internalState.get(A)
    }
    serialize() {
      return this._keys().reduce((A, Q) => {
        return A.push(Q + e5B + this.get(Q)), A
      }, []).join(t5B)
    }
    _parse(A) {
      if (A.length > Se8) return;
      if (this._internalState = A.split(t5B).reverse().reduce((Q, B) => {
          let G = B.trim(),
            Z = G.indexOf(e5B);
          if (Z !== -1) {
            let I = G.slice(0, Z),
              Y = G.slice(Z + 1, B.length);
            if ((0, r5B.validateKey)(I) && (0, r5B.validateValue)(Y)) Q.set(I, Y)
          }
          return Q
        }, new Map), this._internalState.size > o5B) this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, o5B))
    }
    _keys() {
      return Array.from(this._internalState.keys()).reverse()
    }
    _clone() {
      let A = new ab1;
      return A._internalState = new Map(this._internalState), A
    }
  }
  A3B.TraceStateImpl = ab1
})
// @from(Start 5237777, End 5238006)
I3B = z((G3B) => {
  Object.defineProperty(G3B, "__esModule", {
    value: !0
  });
  G3B.createTraceState = void 0;
  var _e8 = B3B();

  function ke8(A) {
    return new _e8.TraceStateImpl(A)
  }
  G3B.createTraceState = ke8
})
// @from(Start 5238012, End 5238186)
W3B = z((Y3B) => {
  Object.defineProperty(Y3B, "__esModule", {
    value: !0
  });
  Y3B.context = void 0;
  var ye8 = QUA();
  Y3B.context = ye8.ContextAPI.getInstance()
})
// @from(Start 5238192, End 5238353)
F3B = z((X3B) => {
  Object.defineProperty(X3B, "__esModule", {
    value: !0
  });
  X3B.diag = void 0;
  var xe8 = Ct();
  X3B.diag = xe8.DiagAPI.instance()
})
// @from(Start 5238359, End 5238667)
H3B = z((K3B) => {
  Object.defineProperty(K3B, "__esModule", {
    value: !0
  });
  K3B.NOOP_METER_PROVIDER = K3B.NoopMeterProvider = void 0;
  var ve8 = Pb1();
  class sb1 {
    getMeter(A, Q, B) {
      return ve8.NOOP_METER
    }
  }
  K3B.NoopMeterProvider = sb1;
  K3B.NOOP_METER_PROVIDER = new sb1
})
// @from(Start 5238673, End 5239404)
U3B = z((E3B) => {
  Object.defineProperty(E3B, "__esModule", {
    value: !0
  });
  E3B.MetricsAPI = void 0;
  var fe8 = H3B(),
    rb1 = Ht(),
    C3B = Ct(),
    ob1 = "metrics";
  class tb1 {
    constructor() {}
    static getInstance() {
      if (!this._instance) this._instance = new tb1;
      return this._instance
    }
    setGlobalMeterProvider(A) {
      return (0, rb1.registerGlobal)(ob1, A, C3B.DiagAPI.instance())
    }
    getMeterProvider() {
      return (0, rb1.getGlobal)(ob1) || fe8.NOOP_METER_PROVIDER
    }
    getMeter(A, Q, B) {
      return this.getMeterProvider().getMeter(A, Q, B)
    }
    disable() {
      (0, rb1.unregisterGlobal)(ob1, C3B.DiagAPI.instance())
    }
  }
  E3B.MetricsAPI = tb1
})
// @from(Start 5239410, End 5239584)
q3B = z(($3B) => {
  Object.defineProperty($3B, "__esModule", {
    value: !0
  });
  $3B.metrics = void 0;
  var he8 = U3B();
  $3B.metrics = he8.MetricsAPI.getInstance()
})
// @from(Start 5239590, End 5239864)
O3B = z((L3B) => {
  Object.defineProperty(L3B, "__esModule", {
    value: !0
  });
  L3B.NoopTextMapPropagator = void 0;
  class N3B {
    inject(A, Q) {}
    extract(A, Q) {
      return A
    }
    fields() {
      return []
    }
  }
  L3B.NoopTextMapPropagator = N3B
})
// @from(Start 5239870, End 5240502)
j3B = z((T3B) => {
  Object.defineProperty(T3B, "__esModule", {
    value: !0
  });
  T3B.deleteBaggage = T3B.setBaggage = T3B.getActiveBaggage = T3B.getBaggage = void 0;
  var ge8 = QUA(),
    ue8 = ezA(),
    eb1 = (0, ue8.createContextKey)("OpenTelemetry Baggage Key");

  function R3B(A) {
    return A.getValue(eb1) || void 0
  }
  T3B.getBaggage = R3B;

  function me8() {
    return R3B(ge8.ContextAPI.getInstance().active())
  }
  T3B.getActiveBaggage = me8;

  function de8(A, Q) {
    return A.setValue(eb1, Q)
  }
  T3B.setBaggage = de8;

  function ce8(A) {
    return A.deleteValue(eb1)
  }
  T3B.deleteBaggage = ce8
})
// @from(Start 5240508, End 5241740)
x3B = z((k3B) => {
  Object.defineProperty(k3B, "__esModule", {
    value: !0
  });
  k3B.PropagationAPI = void 0;
  var Af1 = Ht(),
    ne8 = O3B(),
    S3B = Sb1(),
    FnA = j3B(),
    ae8 = Ub1(),
    _3B = Ct(),
    Qf1 = "propagation",
    se8 = new ne8.NoopTextMapPropagator;
  class Bf1 {
    constructor() {
      this.createBaggage = ae8.createBaggage, this.getBaggage = FnA.getBaggage, this.getActiveBaggage = FnA.getActiveBaggage, this.setBaggage = FnA.setBaggage, this.deleteBaggage = FnA.deleteBaggage
    }
    static getInstance() {
      if (!this._instance) this._instance = new Bf1;
      return this._instance
    }
    setGlobalPropagator(A) {
      return (0, Af1.registerGlobal)(Qf1, A, _3B.DiagAPI.instance())
    }
    inject(A, Q, B = S3B.defaultTextMapSetter) {
      return this._getGlobalPropagator().inject(A, Q, B)
    }
    extract(A, Q, B = S3B.defaultTextMapGetter) {
      return this._getGlobalPropagator().extract(A, Q, B)
    }
    fields() {
      return this._getGlobalPropagator().fields()
    }
    disable() {
      (0, Af1.unregisterGlobal)(Qf1, _3B.DiagAPI.instance())
    }
    _getGlobalPropagator() {
      return (0, Af1.getGlobal)(Qf1) || se8
    }
  }
  k3B.PropagationAPI = Bf1
})
// @from(Start 5241746, End 5241932)
f3B = z((v3B) => {
  Object.defineProperty(v3B, "__esModule", {
    value: !0
  });
  v3B.propagation = void 0;
  var re8 = x3B();
  v3B.propagation = re8.PropagationAPI.getInstance()
})
// @from(Start 5241938, End 5243226)
c3B = z((m3B) => {
  Object.defineProperty(m3B, "__esModule", {
    value: !0
  });
  m3B.TraceAPI = void 0;
  var Gf1 = Ht(),
    h3B = cb1(),
    g3B = VnA(),
    s3A = hb1(),
    u3B = Ct(),
    Zf1 = "trace";
  class If1 {
    constructor() {
      this._proxyTracerProvider = new h3B.ProxyTracerProvider, this.wrapSpanContext = g3B.wrapSpanContext, this.isSpanContextValid = g3B.isSpanContextValid, this.deleteSpan = s3A.deleteSpan, this.getSpan = s3A.getSpan, this.getActiveSpan = s3A.getActiveSpan, this.getSpanContext = s3A.getSpanContext, this.setSpan = s3A.setSpan, this.setSpanContext = s3A.setSpanContext
    }
    static getInstance() {
      if (!this._instance) this._instance = new If1;
      return this._instance
    }
    setGlobalTracerProvider(A) {
      let Q = (0, Gf1.registerGlobal)(Zf1, this._proxyTracerProvider, u3B.DiagAPI.instance());
      if (Q) this._proxyTracerProvider.setDelegate(A);
      return Q
    }
    getTracerProvider() {
      return (0, Gf1.getGlobal)(Zf1) || this._proxyTracerProvider
    }
    getTracer(A, Q) {
      return this.getTracerProvider().getTracer(A, Q)
    }
    disable() {
      (0, Gf1.unregisterGlobal)(Zf1, u3B.DiagAPI.instance()), this._proxyTracerProvider = new h3B.ProxyTracerProvider
    }
  }
  m3B.TraceAPI = If1
})
// @from(Start 5243232, End 5243400)
i3B = z((p3B) => {
  Object.defineProperty(p3B, "__esModule", {
    value: !0
  });
  p3B.trace = void 0;
  var oe8 = c3B();
  p3B.trace = oe8.TraceAPI.getInstance()
})
// @from(Start 5243406, End 5248189)
K9 = z((XG) => {
  Object.defineProperty(XG, "__esModule", {
    value: !0
  });
  XG.trace = XG.propagation = XG.metrics = XG.diag = XG.context = XG.INVALID_SPAN_CONTEXT = XG.INVALID_TRACEID = XG.INVALID_SPANID = XG.isValidSpanId = XG.isValidTraceId = XG.isSpanContextValid = XG.createTraceState = XG.TraceFlags = XG.SpanStatusCode = XG.SpanKind = XG.SamplingDecision = XG.ProxyTracerProvider = XG.ProxyTracer = XG.defaultTextMapSetter = XG.defaultTextMapGetter = XG.ValueType = XG.createNoopMeter = XG.DiagLogLevel = XG.DiagConsoleLogger = XG.ROOT_CONTEXT = XG.createContextKey = XG.baggageEntryMetadataFromString = void 0;
  var te8 = Ub1();
  Object.defineProperty(XG, "baggageEntryMetadataFromString", {
    enumerable: !0,
    get: function() {
      return te8.baggageEntryMetadataFromString
    }
  });
  var n3B = ezA();
  Object.defineProperty(XG, "createContextKey", {
    enumerable: !0,
    get: function() {
      return n3B.createContextKey
    }
  });
  Object.defineProperty(XG, "ROOT_CONTEXT", {
    enumerable: !0,
    get: function() {
      return n3B.ROOT_CONTEXT
    }
  });
  var ee8 = c6B();
  Object.defineProperty(XG, "DiagConsoleLogger", {
    enumerable: !0,
    get: function() {
      return ee8.DiagConsoleLogger
    }
  });
  var AA6 = InA();
  Object.defineProperty(XG, "DiagLogLevel", {
    enumerable: !0,
    get: function() {
      return AA6.DiagLogLevel
    }
  });
  var QA6 = Pb1();
  Object.defineProperty(XG, "createNoopMeter", {
    enumerable: !0,
    get: function() {
      return QA6.createNoopMeter
    }
  });
  var BA6 = Q5B();
  Object.defineProperty(XG, "ValueType", {
    enumerable: !0,
    get: function() {
      return BA6.ValueType
    }
  });
  var a3B = Sb1();
  Object.defineProperty(XG, "defaultTextMapGetter", {
    enumerable: !0,
    get: function() {
      return a3B.defaultTextMapGetter
    }
  });
  Object.defineProperty(XG, "defaultTextMapSetter", {
    enumerable: !0,
    get: function() {
      return a3B.defaultTextMapSetter
    }
  });
  var GA6 = db1();
  Object.defineProperty(XG, "ProxyTracer", {
    enumerable: !0,
    get: function() {
      return GA6.ProxyTracer
    }
  });
  var ZA6 = cb1();
  Object.defineProperty(XG, "ProxyTracerProvider", {
    enumerable: !0,
    get: function() {
      return ZA6.ProxyTracerProvider
    }
  });
  var IA6 = d5B();
  Object.defineProperty(XG, "SamplingDecision", {
    enumerable: !0,
    get: function() {
      return IA6.SamplingDecision
    }
  });
  var YA6 = p5B();
  Object.defineProperty(XG, "SpanKind", {
    enumerable: !0,
    get: function() {
      return YA6.SpanKind
    }
  });
  var JA6 = i5B();
  Object.defineProperty(XG, "SpanStatusCode", {
    enumerable: !0,
    get: function() {
      return JA6.SpanStatusCode
    }
  });
  var WA6 = vb1();
  Object.defineProperty(XG, "TraceFlags", {
    enumerable: !0,
    get: function() {
      return WA6.TraceFlags
    }
  });
  var XA6 = I3B();
  Object.defineProperty(XG, "createTraceState", {
    enumerable: !0,
    get: function() {
      return XA6.createTraceState
    }
  });
  var Yf1 = VnA();
  Object.defineProperty(XG, "isSpanContextValid", {
    enumerable: !0,
    get: function() {
      return Yf1.isSpanContextValid
    }
  });
  Object.defineProperty(XG, "isValidTraceId", {
    enumerable: !0,
    get: function() {
      return Yf1.isValidTraceId
    }
  });
  Object.defineProperty(XG, "isValidSpanId", {
    enumerable: !0,
    get: function() {
      return Yf1.isValidSpanId
    }
  });
  var Jf1 = WnA();
  Object.defineProperty(XG, "INVALID_SPANID", {
    enumerable: !0,
    get: function() {
      return Jf1.INVALID_SPANID
    }
  });
  Object.defineProperty(XG, "INVALID_TRACEID", {
    enumerable: !0,
    get: function() {
      return Jf1.INVALID_TRACEID
    }
  });
  Object.defineProperty(XG, "INVALID_SPAN_CONTEXT", {
    enumerable: !0,
    get: function() {
      return Jf1.INVALID_SPAN_CONTEXT
    }
  });
  var s3B = W3B();
  Object.defineProperty(XG, "context", {
    enumerable: !0,
    get: function() {
      return s3B.context
    }
  });
  var r3B = F3B();
  Object.defineProperty(XG, "diag", {
    enumerable: !0,
    get: function() {
      return r3B.diag
    }
  });
  var o3B = q3B();
  Object.defineProperty(XG, "metrics", {
    enumerable: !0,
    get: function() {
      return o3B.metrics
    }
  });
  var t3B = f3B();
  Object.defineProperty(XG, "propagation", {
    enumerable: !0,
    get: function() {
      return t3B.propagation
    }
  });
  var e3B = i3B();
  Object.defineProperty(XG, "trace", {
    enumerable: !0,
    get: function() {
      return e3B.trace
    }
  });
  XG.default = {
    context: s3B.context,
    diag: r3B.diag,
    metrics: o3B.metrics,
    propagation: t3B.propagation,
    trace: e3B.trace
  }
})
// @from(Start 5248195, End 5249100)
Q7B = z((A7B) => {
  Object.defineProperty(A7B, "__esModule", {
    value: !0
  });
  A7B.SeverityNumber = void 0;
  var KA6;
  (function(A) {
    A[A.UNSPECIFIED = 0] = "UNSPECIFIED", A[A.TRACE = 1] = "TRACE", A[A.TRACE2 = 2] = "TRACE2", A[A.TRACE3 = 3] = "TRACE3", A[A.TRACE4 = 4] = "TRACE4", A[A.DEBUG = 5] = "DEBUG", A[A.DEBUG2 = 6] = "DEBUG2", A[A.DEBUG3 = 7] = "DEBUG3", A[A.DEBUG4 = 8] = "DEBUG4", A[A.INFO = 9] = "INFO", A[A.INFO2 = 10] = "INFO2", A[A.INFO3 = 11] = "INFO3", A[A.INFO4 = 12] = "INFO4", A[A.WARN = 13] = "WARN", A[A.WARN2 = 14] = "WARN2", A[A.WARN3 = 15] = "WARN3", A[A.WARN4 = 16] = "WARN4", A[A.ERROR = 17] = "ERROR", A[A.ERROR2 = 18] = "ERROR2", A[A.ERROR3 = 19] = "ERROR3", A[A.ERROR4 = 20] = "ERROR4", A[A.FATAL = 21] = "FATAL", A[A.FATAL2 = 22] = "FATAL2", A[A.FATAL3 = 23] = "FATAL3", A[A.FATAL4 = 24] = "FATAL4"
  })(KA6 = A7B.SeverityNumber || (A7B.SeverityNumber = {}))
})
// @from(Start 5249106, End 5249322)
KnA = z((B7B) => {
  Object.defineProperty(B7B, "__esModule", {
    value: !0
  });
  B7B.NOOP_LOGGER = B7B.NoopLogger = void 0;
  class Xf1 {
    emit(A) {}
  }
  B7B.NoopLogger = Xf1;
  B7B.NOOP_LOGGER = new Xf1
})
// @from(Start 5249328, End 5249645)
DnA = z((Z7B) => {
  Object.defineProperty(Z7B, "__esModule", {
    value: !0
  });
  Z7B.NOOP_LOGGER_PROVIDER = Z7B.NoopLoggerProvider = void 0;
  var HA6 = KnA();
  class Vf1 {
    getLogger(A, Q, B) {
      return new HA6.NoopLogger
    }
  }
  Z7B.NoopLoggerProvider = Vf1;
  Z7B.NOOP_LOGGER_PROVIDER = new Vf1
})
// @from(Start 5249651, End 5250238)
Ff1 = z((J7B) => {
  Object.defineProperty(J7B, "__esModule", {
    value: !0
  });
  J7B.ProxyLogger = void 0;
  var EA6 = KnA();
  class Y7B {
    constructor(A, Q, B, G) {
      this._provider = A, this.name = Q, this.version = B, this.options = G
    }
    emit(A) {
      this._getLogger().emit(A)
    }
    _getLogger() {
      if (this._delegate) return this._delegate;
      let A = this._provider._getDelegateLogger(this.name, this.version, this.options);
      if (!A) return EA6.NOOP_LOGGER;
      return this._delegate = A, this._delegate
    }
  }
  J7B.ProxyLogger = Y7B
})
// @from(Start 5250244, End 5250941)
Kf1 = z((V7B) => {
  Object.defineProperty(V7B, "__esModule", {
    value: !0
  });
  V7B.ProxyLoggerProvider = void 0;
  var zA6 = DnA(),
    UA6 = Ff1();
  class X7B {
    getLogger(A, Q, B) {
      var G;
      return (G = this._getDelegateLogger(A, Q, B)) !== null && G !== void 0 ? G : new UA6.ProxyLogger(this, A, Q, B)
    }
    _getDelegate() {
      var A;
      return (A = this._delegate) !== null && A !== void 0 ? A : zA6.NOOP_LOGGER_PROVIDER
    }
    _setDelegate(A) {
      this._delegate = A
    }
    _getDelegateLogger(A, Q, B) {
      var G;
      return (G = this._delegate) === null || G === void 0 ? void 0 : G.getLogger(A, Q, B)
    }
  }
  V7B.ProxyLoggerProvider = X7B
})
// @from(Start 5250947, End 5251134)
H7B = z((K7B) => {
  Object.defineProperty(K7B, "__esModule", {
    value: !0
  });
  K7B._globalThis = void 0;
  K7B._globalThis = typeof globalThis === "object" ? globalThis : global
})
// @from(Start 5251140, End 5251401)
C7B = z((Df1) => {
  Object.defineProperty(Df1, "__esModule", {
    value: !0
  });
  Df1._globalThis = void 0;
  var $A6 = H7B();
  Object.defineProperty(Df1, "_globalThis", {
    enumerable: !0,
    get: function() {
      return $A6._globalThis
    }
  })
})
// @from(Start 5251407, End 5251668)
E7B = z((Hf1) => {
  Object.defineProperty(Hf1, "__esModule", {
    value: !0
  });
  Hf1._globalThis = void 0;
  var qA6 = C7B();
  Object.defineProperty(Hf1, "_globalThis", {
    enumerable: !0,
    get: function() {
      return qA6._globalThis
    }
  })
})
// @from(Start 5251674, End 5252128)
$7B = z((z7B) => {
  Object.defineProperty(z7B, "__esModule", {
    value: !0
  });
  z7B.API_BACKWARDS_COMPATIBILITY_VERSION = z7B.makeGetter = z7B._global = z7B.GLOBAL_LOGS_API_KEY = void 0;
  var LA6 = E7B();
  z7B.GLOBAL_LOGS_API_KEY = Symbol.for("io.opentelemetry.js.api.logs");
  z7B._global = LA6._globalThis;

  function MA6(A, Q, B) {
    return (G) => G === A ? Q : B
  }
  z7B.makeGetter = MA6;
  z7B.API_BACKWARDS_COMPATIBILITY_VERSION = 1
})
// @from(Start 5252134, End 5253313)
L7B = z((q7B) => {
  Object.defineProperty(q7B, "__esModule", {
    value: !0
  });
  q7B.LogsAPI = void 0;
  var BM = $7B(),
    PA6 = DnA(),
    w7B = Kf1();
  class Cf1 {
    constructor() {
      this._proxyLoggerProvider = new w7B.ProxyLoggerProvider
    }
    static getInstance() {
      if (!this._instance) this._instance = new Cf1;
      return this._instance
    }
    setGlobalLoggerProvider(A) {
      if (BM._global[BM.GLOBAL_LOGS_API_KEY]) return this.getLoggerProvider();
      return BM._global[BM.GLOBAL_LOGS_API_KEY] = (0, BM.makeGetter)(BM.API_BACKWARDS_COMPATIBILITY_VERSION, A, PA6.NOOP_LOGGER_PROVIDER), this._proxyLoggerProvider._setDelegate(A), A
    }
    getLoggerProvider() {
      var A, Q;
      return (Q = (A = BM._global[BM.GLOBAL_LOGS_API_KEY]) === null || A === void 0 ? void 0 : A.call(BM._global, BM.API_BACKWARDS_COMPATIBILITY_VERSION)) !== null && Q !== void 0 ? Q : this._proxyLoggerProvider
    }
    getLogger(A, Q, B) {
      return this.getLoggerProvider().getLogger(A, Q, B)
    }
    disable() {
      delete BM._global[BM.GLOBAL_LOGS_API_KEY], this._proxyLoggerProvider = new w7B.ProxyLoggerProvider
    }
  }
  q7B.LogsAPI = Cf1
})