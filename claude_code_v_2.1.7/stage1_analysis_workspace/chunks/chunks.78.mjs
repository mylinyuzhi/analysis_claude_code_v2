
// @from(Ln 226678, Col 0)
function YdB() {
  return I80(this, arguments, function* () {
    let Q = this.getReader();
    try {
      while (!0) {
        let {
          done: B,
          value: G
        } = yield U2A(Q.read());
        if (B) return yield U2A(void 0);
        yield yield U2A(G)
      }
    } finally {
      Q.releaseLock()
    }
  })
}
// @from(Ln 226696, Col 0)
function Wb8(A) {
  if (!A[Symbol.asyncIterator]) A[Symbol.asyncIterator] = YdB.bind(A);
  if (!A.values) A.values = YdB.bind(A)
}
// @from(Ln 226701, Col 0)
function JdB(A) {
  if (A instanceof ReadableStream) return Wb8(A), D80.fromWeb(A);
  else return A
}
// @from(Ln 226706, Col 0)
function Kb8(A) {
  if (A instanceof Uint8Array) return D80.from(Buffer.from(A));
  else if (r61(A)) return JdB(A.stream());
  else return JdB(A)
}
// @from(Ln 226711, Col 0)
async function XdB(A) {
  return function () {
    let Q = A.map((B) => typeof B === "function" ? B() : B).map(Kb8);
    return D80.from(function () {
      return I80(this, arguments, function* () {
        var B, G, Z, Y;
        for (let D of Q) try {
          for (var J = !0, X = (G = void 0, GdB(D)), I; I = yield U2A(X.next()), B = I.done, !B; J = !0) Y = I.value, J = !1, yield yield U2A(Y)
        } catch (W) {
          G = {
            error: W
          }
        } finally {
          try {
            if (!J && !B && (Z = X.return)) yield U2A(Z.call(X))
          } finally {
            if (G) throw G.error
          }
        }
      })
    }())
  }
}
// @from(Ln 226734, Col 4)
IdB = w(() => {
  ZdB()
})
// @from(Ln 226738, Col 0)
function Vb8() {
  return `----AzSDKFormBoundary${LTA()}`
}
// @from(Ln 226742, Col 0)
function Fb8(A) {
  let Q = "";
  for (let [B, G] of A) Q += `${B}: ${G}\r
`;
  return Q
}
// @from(Ln 226749, Col 0)
function Hb8(A) {
  if (A instanceof Uint8Array) return A.byteLength;
  else if (r61(A)) return A.size === -1 ? void 0 : A.size;
  else return
}
// @from(Ln 226755, Col 0)
function Eb8(A) {
  let Q = 0;
  for (let B of A) {
    let G = Hb8(B);
    if (G === void 0) return;
    else Q += G
  }
  return Q
}
// @from(Ln 226764, Col 0)
async function zb8(A, Q, B) {
  let G = [ik(`--${B}`, "utf-8"), ...Q.flatMap((Y) => [ik(`\r
`, "utf-8"), ik(Fb8(Y.headers), "utf-8"), ik(`\r
`, "utf-8"), Y.body, ik(`\r
--${B}`, "utf-8")]), ik(`--\r
\r
`, "utf-8")],
    Z = Eb8(G);
  if (Z) A.headers.set("Content-Length", Z);
  A.body = await XdB(G)
}
// @from(Ln 226776, Col 0)
function Ub8(A) {
  if (A.length > $b8) throw Error(`Multipart boundary "${A}" exceeds maximum length of 70 characters`);
  if (Array.from(A).some((Q) => !Cb8.has(Q))) throw Error(`Multipart boundary "${A}" contains invalid characters`)
}
// @from(Ln 226781, Col 0)
function W80() {
  return {
    name: s61,
    async sendRequest(A, Q) {
      var B;
      if (!A.multipartBody) return Q(A);
      if (A.body) throw Error("multipartBody and regular body cannot be set at the same time");
      let G = A.multipartBody.boundary,
        Z = (B = A.headers.get("Content-Type")) !== null && B !== void 0 ? B : "multipart/mixed",
        Y = Z.match(/^(multipart\/[^ ;]+)(?:; *boundary=(.+))?$/);
      if (!Y) throw Error(`Got multipart request body, but content-type header was not multipart: ${Z}`);
      let [, J, X] = Y;
      if (X && G && X !== G) throw Error(`Multipart boundary was specified as ${X} in the header, but got ${G} in the request body`);
      if (G !== null && G !== void 0 || (G = X), G) Ub8(G);
      else G = Vb8();
      return A.headers.set("Content-Type", `${J}; boundary=${G}`), await zb8(A, A.multipartBody.parts, G), A.multipartBody = void 0, Q(A)
    }
  }
}
// @from(Ln 226800, Col 4)
s61 = "multipartPolicy"
// @from(Ln 226801, Col 2)
$b8 = 70
// @from(Ln 226802, Col 2)
Cb8
// @from(Ln 226803, Col 4)
DdB = w(() => {
  T30();
  IdB();
  Cb8 = new Set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'()+,-./:=?")
})
// @from(Ln 226808, Col 4)
VWA = w(() => {
  wTA();
  $mB();
  UmB();
  k30();
  _mB();
  HmB();
  EmB()
})
// @from(Ln 226818, Col 0)
function PTA() {
  return S30()
}
// @from(Ln 226821, Col 4)
K80 = w(() => {
  VWA()
})
// @from(Ln 226824, Col 4)
Pm
// @from(Ln 226825, Col 4)
t61 = w(() => {
  $2A();
  Pm = zo("core-rest-pipeline")
})
// @from(Ln 226829, Col 4)
tP = w(() => {
  gmB();
  n30();
  lmB();
  jmB();
  DdB();
  QdB();
  SmB()
})
// @from(Ln 226839, Col 0)
function WdB(A = {}) {
  return g30(Object.assign({
    logger: Pm.info
  }, A))
}
// @from(Ln 226844, Col 4)
KdB = w(() => {
  t61();
  tP()
})
// @from(Ln 226849, Col 0)
function VdB(A = {}) {
  return u30(A)
}
// @from(Ln 226852, Col 4)
FdB = w(() => {
  tP()
})
// @from(Ln 226858, Col 0)
function HdB() {
  return "User-Agent"
}
// @from(Ln 226861, Col 0)
async function EdB(A) {
  if (e61 && e61.versions) {
    let Q = e61.versions;
    if (Q.bun) A.set("Bun", Q.bun);
    else if (Q.deno) A.set("Deno", Q.deno);
    else if (Q.node) A.set("Node", Q.node)
  }
  A.set("OS", `(${FWA.arch()}-${FWA.type()}-${FWA.release()})`)
}
// @from(Ln 226870, Col 4)
zdB = () => {}
// @from(Ln 226871, Col 4)
A31 = "1.21.0"
// @from(Ln 226872, Col 2)
$dB = 3
// @from(Ln 226874, Col 0)
function Mb8(A) {
  let Q = [];
  for (let [B, G] of A) {
    let Z = G ? `${B}/${G}` : B;
    Q.push(Z)
  }
  return Q.join(" ")
}
// @from(Ln 226883, Col 0)
function CdB() {
  return HdB()
}
// @from(Ln 226886, Col 0)
async function Q31(A) {
  let Q = new Map;
  Q.set("core-rest-pipeline", A31), await EdB(Q);
  let B = Mb8(Q);
  return A ? `${A} ${B}` : B
}
// @from(Ln 226892, Col 4)
V80 = w(() => {
  zdB()
})
// @from(Ln 226896, Col 0)
function qdB(A = {}) {
  let Q = Q31(A.userAgentPrefix);
  return {
    name: Rb8,
    async sendRequest(B, G) {
      if (!B.headers.has(UdB)) B.headers.set(UdB, await Q);
      return G(B)
    }
  }
}
// @from(Ln 226906, Col 4)
UdB
// @from(Ln 226906, Col 9)
Rb8 = "userAgentPolicy"
// @from(Ln 226907, Col 4)
NdB = w(() => {
  V80();
  UdB = CdB()
})
// @from(Ln 226911, Col 4)
B31 = w(() => {
  c30();
  x30();
  A80();
  MTA()
})
// @from(Ln 226917, Col 4)
HWA
// @from(Ln 226918, Col 4)
wdB = w(() => {
  HWA = class HWA extends Error {
    constructor(A) {
      super(A);
      this.name = "AbortError"
    }
  }
})
// @from(Ln 226926, Col 4)
F80 = w(() => {
  wdB()
})
// @from(Ln 226930, Col 0)
function LdB(A, Q) {
  let {
    cleanupBeforeAbort: B,
    abortSignal: G,
    abortErrorMsg: Z
  } = Q !== null && Q !== void 0 ? Q : {};
  return new Promise((Y, J) => {
    function X() {
      J(new HWA(Z !== null && Z !== void 0 ? Z : "The operation was aborted."))
    }

    function I() {
      G === null || G === void 0 || G.removeEventListener("abort", D)
    }

    function D() {
      B === null || B === void 0 || B(), I(), X()
    }
    if (G === null || G === void 0 ? void 0 : G.aborted) return X();
    try {
      A((W) => {
        I(), Y(W)
      }, (W) => {
        I(), J(W)
      })
    } catch (W) {
      J(W)
    }
    G === null || G === void 0 || G.addEventListener("abort", D)
  })
}
// @from(Ln 226961, Col 4)
OdB = w(() => {
  F80()
})
// @from(Ln 226965, Col 0)
function H80(A, Q) {
  let B, {
    abortSignal: G,
    abortErrorMsg: Z
  } = Q !== null && Q !== void 0 ? Q : {};
  return LdB((Y) => {
    B = setTimeout(Y, A)
  }, {
    cleanupBeforeAbort: () => clearTimeout(B),
    abortSignal: G,
    abortErrorMsg: Z !== null && Z !== void 0 ? Z : Tb8
  })
}
// @from(Ln 226978, Col 4)
Tb8 = "The delay was aborted."
// @from(Ln 226979, Col 4)
MdB = w(() => {
  OdB()
})
// @from(Ln 226983, Col 0)
function EWA(A) {
  if (C2A(A)) return A.message;
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
// @from(Ln 226996, Col 4)
RdB = w(() => {
  B31()
})
// @from(Ln 227000, Col 0)
function _dB(A, Q) {
  return jTA(A, Q)
}
// @from(Ln 227004, Col 0)
function G31(A) {
  return C2A(A)
}
// @from(Ln 227007, Col 4)
Z31
// @from(Ln 227007, Col 9)
STA
// @from(Ln 227008, Col 4)
Co = w(() => {
  B31();
  MdB();
  RdB();
  Z31 = WWA, STA = WWA
})
// @from(Ln 227015, Col 0)
function E80(A) {
  return typeof A[jdB] === "function"
}
// @from(Ln 227019, Col 0)
function TdB(A) {
  if (E80(A)) return A[jdB]();
  else return A
}
// @from(Ln 227023, Col 4)
jdB
// @from(Ln 227024, Col 4)
PdB = w(() => {
  jdB = Symbol("rawContent")
})
// @from(Ln 227028, Col 0)
function SdB() {
  let A = W80();
  return {
    name: z80,
    sendRequest: async (Q, B) => {
      if (Q.multipartBody) {
        for (let G of Q.multipartBody.parts)
          if (E80(G.body)) G.body = TdB(G.body)
      }
      return A.sendRequest(Q, B)
    }
  }
}
// @from(Ln 227041, Col 4)
z80
// @from(Ln 227042, Col 4)
xdB = w(() => {
  tP();
  PdB();
  z80 = s61
})
// @from(Ln 227048, Col 0)
function ydB() {
  return m30()
}
// @from(Ln 227051, Col 4)
vdB = w(() => {
  tP()
})
// @from(Ln 227055, Col 0)
function kdB(A = {}) {
  return o30(A)
}
// @from(Ln 227058, Col 4)
bdB = w(() => {
  tP()
})
// @from(Ln 227062, Col 0)
function fdB() {
  return B80()
}
// @from(Ln 227065, Col 4)
hdB = w(() => {
  tP()
})
// @from(Ln 227069, Col 0)
function gdB(A, Q) {
  return Y80(A, Q)
}
// @from(Ln 227072, Col 4)
udB = w(() => {
  tP()
})
// @from(Ln 227076, Col 0)
function mdB(A = "x-ms-client-request-id") {
  return {
    name: "setClientRequestIdPolicy",
    async sendRequest(Q, B) {
      if (!Q.headers.has(A)) Q.headers.set(A, Q.requestId);
      return B(Q)
    }
  }
}
// @from(Ln 227086, Col 0)
function ddB(A) {
  return J80(A)
}
// @from(Ln 227089, Col 4)
cdB = w(() => {
  tP()
})
// @from(Ln 227093, Col 0)
function pdB(A) {
  return X80(A)
}
// @from(Ln 227096, Col 4)
ldB = w(() => {
  tP()
})
// @from(Ln 227100, Col 0)
function idB(A = {}) {
  let Q = new xTA(A.parentContext);
  if (A.span) Q = Q.setValue(zWA.span, A.span);
  if (A.namespace) Q = Q.setValue(zWA.namespace, A.namespace);
  return Q
}
// @from(Ln 227106, Col 0)
class xTA {
  constructor(A) {
    this._contextMap = A instanceof xTA ? new Map(A._contextMap) : new Map
  }
  setValue(A, Q) {
    let B = new xTA(this);
    return B._contextMap.set(A, Q), B
  }
  getValue(A) {
    return this._contextMap.get(A)
  }
  deleteValue(A) {
    let Q = new xTA(this);
    return Q._contextMap.delete(A), Q
  }
}
// @from(Ln 227122, Col 4)
zWA
// @from(Ln 227123, Col 4)
$80 = w(() => {
  zWA = {
    span: Symbol.for("@azure/core-tracing span"),
    namespace: Symbol.for("@azure/core-tracing namespace")
  }
})
// @from(Ln 227129, Col 4)
odB = U((ndB) => {
  Object.defineProperty(ndB, "__esModule", {
    value: !0
  });
  ndB.state = void 0;
  ndB.state = {
    instrumenterImplementation: void 0
  }
})
// @from(Ln 227138, Col 4)
rdB
// @from(Ln 227138, Col 9)
Y31
// @from(Ln 227139, Col 4)
sdB = w(() => {
  rdB = c(odB(), 1), Y31 = rdB.state
})
// @from(Ln 227143, Col 0)
function Pb8() {
  return {
    end: () => {},
    isRecording: () => !1,
    recordException: () => {},
    setAttribute: () => {},
    setStatus: () => {},
    addEvent: () => {}
  }
}
// @from(Ln 227154, Col 0)
function Sb8() {
  return {
    createRequestHeaders: () => {
      return {}
    },
    parseTraceparentHeader: () => {
      return
    },
    startSpan: (A, Q) => {
      return {
        span: Pb8(),
        tracingContext: idB({
          parentContext: Q.tracingContext
        })
      }
    },
    withContext(A, Q, ...B) {
      return Q(...B)
    }
  }
}
// @from(Ln 227176, Col 0)
function yTA() {
  if (!Y31.instrumenterImplementation) Y31.instrumenterImplementation = Sb8();
  return Y31.instrumenterImplementation
}
// @from(Ln 227180, Col 4)
tdB = w(() => {
  $80();
  sdB()
})
// @from(Ln 227185, Col 0)
function vTA(A) {
  let {
    namespace: Q,
    packageName: B,
    packageVersion: G
  } = A;

  function Z(D, W, K) {
    var V;
    let F = yTA().startSpan(D, Object.assign(Object.assign({}, K), {
        packageName: B,
        packageVersion: G,
        tracingContext: (V = W === null || W === void 0 ? void 0 : W.tracingOptions) === null || V === void 0 ? void 0 : V.tracingContext
      })),
      H = F.tracingContext,
      E = F.span;
    if (!H.getValue(zWA.namespace)) H = H.setValue(zWA.namespace, Q);
    E.setAttribute("az.namespace", H.getValue(zWA.namespace));
    let z = Object.assign({}, W, {
      tracingOptions: Object.assign(Object.assign({}, W === null || W === void 0 ? void 0 : W.tracingOptions), {
        tracingContext: H
      })
    });
    return {
      span: E,
      updatedOptions: z
    }
  }
  async function Y(D, W, K, V) {
    let {
      span: F,
      updatedOptions: H
    } = Z(D, W, V);
    try {
      let E = await J(H.tracingOptions.tracingContext, () => Promise.resolve(K(H, F)));
      return F.setStatus({
        status: "success"
      }), E
    } catch (E) {
      throw F.setStatus({
        status: "error",
        error: E
      }), E
    } finally {
      F.end()
    }
  }

  function J(D, W, ...K) {
    return yTA().withContext(D, W, ...K)
  }

  function X(D) {
    return yTA().parseTraceparentHeader(D)
  }

  function I(D) {
    return yTA().createRequestHeaders(D)
  }
  return {
    startSpan: Z,
    withSpan: Y,
    withContext: J,
    parseTraceparentHeader: X,
    createRequestHeaders: I
  }
}
// @from(Ln 227252, Col 4)
edB = w(() => {
  tdB();
  $80()
})
// @from(Ln 227256, Col 4)
C80 = w(() => {
  edB()
})
// @from(Ln 227260, Col 0)
function kTA(A) {
  return v30(A)
}
// @from(Ln 227263, Col 4)
$WA
// @from(Ln 227264, Col 4)
J31 = w(() => {
  VWA();
  $WA = WN
})
// @from(Ln 227269, Col 0)
function AcB(A = {}) {
  let Q = Q31(A.userAgentPrefix),
    B = new lk({
      additionalAllowedQueryParameters: A.additionalAllowedQueryParameters
    }),
    G = yb8();
  return {
    name: xb8,
    async sendRequest(Z, Y) {
      var J;
      if (!G) return Y(Z);
      let X = await Q,
        I = {
          "http.url": B.sanitizeUrl(Z.url),
          "http.method": Z.method,
          "http.user_agent": X,
          requestId: Z.requestId
        };
      if (X) I["http.user_agent"] = X;
      let {
        span: D,
        tracingContext: W
      } = (J = vb8(G, Z, I)) !== null && J !== void 0 ? J : {};
      if (!D || !W) return Y(Z);
      try {
        let K = await G.withContext(W, Y, Z);
        return bb8(D, K), K
      } catch (K) {
        throw kb8(D, K), K
      }
    }
  }
}
// @from(Ln 227303, Col 0)
function yb8() {
  try {
    return vTA({
      namespace: "",
      packageName: "@azure/core-rest-pipeline",
      packageVersion: A31
    })
  } catch (A) {
    Pm.warning(`Error when creating the TracingClient: ${EWA(A)}`);
    return
  }
}
// @from(Ln 227316, Col 0)
function vb8(A, Q, B) {
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
    let Y = A.createRequestHeaders(Z.tracingOptions.tracingContext);
    for (let [J, X] of Object.entries(Y)) Q.headers.set(J, X);
    return {
      span: G,
      tracingContext: Z.tracingOptions.tracingContext
    }
  } catch (G) {
    Pm.warning(`Skipping creating a tracing span due to an error: ${EWA(G)}`);
    return
  }
}
// @from(Ln 227343, Col 0)
function kb8(A, Q) {
  try {
    if (A.setStatus({
        status: "error",
        error: G31(Q) ? Q : void 0
      }), kTA(Q) && Q.statusCode) A.setAttribute("http.status_code", Q.statusCode);
    A.end()
  } catch (B) {
    Pm.warning(`Skipping tracing span processing due to an error: ${EWA(B)}`)
  }
}
// @from(Ln 227355, Col 0)
function bb8(A, Q) {
  try {
    A.setAttribute("http.status_code", Q.status);
    let B = Q.headers.get("x-ms-request-id");
    if (B) A.setAttribute("serviceRequestId", B);
    if (Q.status >= 400) A.setStatus({
      status: "error"
    });
    A.end()
  } catch (B) {
    Pm.warning(`Skipping tracing span processing due to an error: ${EWA(B)}`)
  }
}
// @from(Ln 227368, Col 4)
xb8 = "tracingPolicy"
// @from(Ln 227369, Col 4)
QcB = w(() => {
  C80();
  V80();
  t61();
  Co();
  J31();
  B31()
})
// @from(Ln 227378, Col 0)
function X31(A) {
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
// @from(Ln 227401, Col 0)
function BcB() {
  return {
    name: fb8,
    sendRequest: async (A, Q) => {
      if (!A.abortSignal) return Q(A);
      let {
        abortSignal: B,
        cleanup: G
      } = X31(A.abortSignal);
      A.abortSignal = B;
      try {
        return await Q(A)
      } finally {
        G === null || G === void 0 || G()
      }
    }
  }
}
// @from(Ln 227419, Col 4)
fb8 = "wrapAbortSignalLikePolicy"
// @from(Ln 227420, Col 4)
GcB = () => {}
// @from(Ln 227422, Col 0)
function U80(A) {
  var Q;
  let B = PTA();
  if (STA) {
    if (A.agent) B.addPolicy(ddB(A.agent));
    if (A.tlsOptions) B.addPolicy(pdB(A.tlsOptions));
    B.addPolicy(gdB(A.proxyOptions)), B.addPolicy(ydB())
  }
  if (B.addPolicy(BcB()), B.addPolicy(fdB(), {
      beforePolicies: [z80]
    }), B.addPolicy(qdB(A.userAgentOptions)), B.addPolicy(mdB((Q = A.telemetryOptions) === null || Q === void 0 ? void 0 : Q.clientRequestIdHeaderName)), B.addPolicy(SdB(), {
      afterPhase: "Deserialize"
    }), B.addPolicy(kdB(A.retryOptions), {
      phase: "Retry"
    }), B.addPolicy(AcB(Object.assign(Object.assign({}, A.userAgentOptions), A.loggingOptions)), {
      afterPhase: "Retry"
    }), STA) B.addPolicy(VdB(A.redirectOptions), {
    afterPhase: "Retry"
  });
  return B.addPolicy(WdB(A.loggingOptions), {
    afterPhase: "Sign"
  }), B
}
// @from(Ln 227445, Col 4)
ZcB = w(() => {
  KdB();
  K80();
  FdB();
  NdB();
  xdB();
  vdB();
  bdB();
  hdB();
  Co();
  udB();
  cdB();
  ldB();
  QcB();
  GcB()
})
// @from(Ln 227462, Col 0)
function q80() {
  let A = f30();
  return {
    async sendRequest(Q) {
      let {
        abortSignal: B,
        cleanup: G
      } = Q.abortSignal ? X31(Q.abortSignal) : {};
      try {
        return Q.abortSignal = B, await A.sendRequest(Q)
      } finally {
        G === null || G === void 0 || G()
      }
    }
  }
}
// @from(Ln 227478, Col 4)
YcB = w(() => {
  VWA()
})
// @from(Ln 227482, Col 0)
function q2A(A) {
  return pk(A)
}
// @from(Ln 227485, Col 4)
JcB = w(() => {
  VWA()
})
// @from(Ln 227489, Col 0)
function eP(A) {
  return P30(A)
}
// @from(Ln 227492, Col 4)
XcB = w(() => {
  VWA()
})
// @from(Ln 227496, Col 0)
function N80(A, Q = {
  maxRetries: $dB
}) {
  return TTA(A, Object.assign({
    logger: hb8
  }, Q))
}
// @from(Ln 227503, Col 4)
hb8
// @from(Ln 227504, Col 4)
IcB = w(() => {
  $2A();
  tP();
  hb8 = zo("core-rest-pipeline retryPolicy")
})
// @from(Ln 227509, Col 0)
async function ub8(A, Q, B) {
  async function G() {
    if (Date.now() < B) try {
      return await A()
    } catch (Y) {
      return null
    } else {
      let Y = await A();
      if (Y === null) throw Error("Failed to refresh access token.");
      return Y
    }
  }
  let Z = await G();
  while (Z === null) await H80(Q), Z = await G();
  return Z
}
// @from(Ln 227526, Col 0)
function DcB(A, Q) {
  let B = null,
    G = null,
    Z, Y = Object.assign(Object.assign({}, gb8), Q),
    J = {
      get isRefreshing() {
        return B !== null
      },
      get shouldRefresh() {
        var I;
        if (J.isRefreshing) return !1;
        if ((G === null || G === void 0 ? void 0 : G.refreshAfterTimestamp) && G.refreshAfterTimestamp < Date.now()) return !0;
        return ((I = G === null || G === void 0 ? void 0 : G.expiresOnTimestamp) !== null && I !== void 0 ? I : 0) - Y.refreshWindowInMs < Date.now()
      },
      get mustRefresh() {
        return G === null || G.expiresOnTimestamp - Y.forcedRefreshWindowInMs < Date.now()
      }
    };

  function X(I, D) {
    var W;
    if (!J.isRefreshing) B = ub8(() => A.getToken(I, D), Y.retryIntervalInMs, (W = G === null || G === void 0 ? void 0 : G.expiresOnTimestamp) !== null && W !== void 0 ? W : Date.now()).then((V) => {
      return B = null, G = V, Z = D.tenantId, G
    }).catch((V) => {
      throw B = null, G = null, Z = void 0, V
    });
    return B
  }
  return async (I, D) => {
    let W = Boolean(D.claims),
      K = Z !== D.tenantId;
    if (W) G = null;
    if (K || W || J.mustRefresh) return X(I, D);
    if (J.shouldRefresh) X(I, D);
    return G
  }
}
// @from(Ln 227563, Col 4)
gb8
// @from(Ln 227564, Col 4)
WcB = w(() => {
  Co();
  gb8 = {
    forcedRefreshWindowInMs: 1000,
    retryIntervalInMs: 3000,
    refreshWindowInMs: 120000
  }
})
// @from(Ln 227572, Col 0)
async function I31(A, Q) {
  try {
    return [await Q(A), void 0]
  } catch (B) {
    if (kTA(B) && B.response) return [B.response, B];
    else throw B
  }
}
// @from(Ln 227580, Col 0)
async function mb8(A) {
  let {
    scopes: Q,
    getAccessToken: B,
    request: G
  } = A, Z = {
    abortSignal: G.abortSignal,
    tracingOptions: G.tracingOptions,
    enableCae: !0
  }, Y = await B(Q, Z);
  if (Y) A.request.headers.set("Authorization", `Bearer ${Y.token}`)
}
// @from(Ln 227593, Col 0)
function KcB(A) {
  return A.status === 401 && A.headers.has("WWW-Authenticate")
}
// @from(Ln 227596, Col 0)
async function VcB(A, Q) {
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
// @from(Ln 227608, Col 0)
function bTA(A) {
  var Q, B, G;
  let {
    credential: Z,
    scopes: Y,
    challengeCallbacks: J
  } = A, X = A.logger || Pm, I = {
    authorizeRequest: (B = (Q = J === null || J === void 0 ? void 0 : J.authorizeRequest) === null || Q === void 0 ? void 0 : Q.bind(J)) !== null && B !== void 0 ? B : mb8,
    authorizeRequestOnChallenge: (G = J === null || J === void 0 ? void 0 : J.authorizeRequestOnChallenge) === null || G === void 0 ? void 0 : G.bind(J)
  }, D = Z ? DcB(Z) : () => Promise.resolve(null);
  return {
    name: HcB,
    async sendRequest(W, K) {
      if (!W.url.toLowerCase().startsWith("https://")) throw Error("Bearer token authentication is not permitted for non-TLS protected (non-https) URLs.");
      await I.authorizeRequest({
        scopes: Array.isArray(Y) ? Y : [Y],
        request: W,
        getAccessToken: D,
        logger: X
      });
      let V, F, H;
      if ([V, F] = await I31(W, K), KcB(V)) {
        let E = FcB(V.headers.get("WWW-Authenticate"));
        if (E) {
          let z;
          try {
            z = atob(E)
          } catch ($) {
            return X.warning(`The WWW-Authenticate header contains "claims" that cannot be parsed. Unable to perform the Continuous Access Evaluation authentication flow. Unparsable claims: ${E}`), V
          }
          if (H = await VcB({
              scopes: Array.isArray(Y) ? Y : [Y],
              response: V,
              request: W,
              getAccessToken: D,
              logger: X
            }, z), H)[V, F] = await I31(W, K)
        } else if (I.authorizeRequestOnChallenge) {
          if (H = await I.authorizeRequestOnChallenge({
              scopes: Array.isArray(Y) ? Y : [Y],
              request: W,
              response: V,
              getAccessToken: D,
              logger: X
            }), H)[V, F] = await I31(W, K);
          if (KcB(V)) {
            if (E = FcB(V.headers.get("WWW-Authenticate")), E) {
              let z;
              try {
                z = atob(E)
              } catch ($) {
                return X.warning(`The WWW-Authenticate header contains "claims" that cannot be parsed. Unable to perform the Continuous Access Evaluation authentication flow. Unparsable claims: ${E}`), V
              }
              if (H = await VcB({
                  scopes: Array.isArray(Y) ? Y : [Y],
                  response: V,
                  request: W,
                  getAccessToken: D,
                  logger: X
                }, z), H)[V, F] = await I31(W, K)
            }
          }
        }
      }
      if (F) throw F;
      else return V
    }
  }
}
// @from(Ln 227678, Col 0)
function db8(A) {
  let Q = /(\w+)\s+((?:\w+=(?:"[^"]*"|[^,]*),?\s*)+)/g,
    B = /(\w+)="([^"]*)"/g,
    G = [],
    Z;
  while ((Z = Q.exec(A)) !== null) {
    let Y = Z[1],
      J = Z[2],
      X = {},
      I;
    while ((I = B.exec(J)) !== null) X[I[1]] = I[2];
    G.push({
      scheme: Y,
      params: X
    })
  }
  return G
}
// @from(Ln 227697, Col 0)
function FcB(A) {
  var Q;
  if (!A) return;
  return (Q = db8(A).find((G) => G.scheme === "Bearer" && G.params.claims && G.params.error === "insufficient_claims")) === null || Q === void 0 ? void 0 : Q.params.claims
}
// @from(Ln 227702, Col 4)
HcB = "bearerTokenAuthenticationPolicy"
// @from(Ln 227703, Col 4)
EcB = w(() => {
  WcB();
  t61();
  J31()
})
// @from(Ln 227708, Col 4)
Sm = w(() => {
  K80();
  ZcB();
  YcB();
  JcB();
  XcB();
  J31();
  IcB();
  EcB()
})
// @from(Ln 227718, Col 4)
CcB = U((zcB) => {
  Object.defineProperty(zcB, "__esModule", {
    value: !0
  });
  zcB.state = void 0;
  zcB.state = {
    operationRequestMap: new WeakMap
  }
})
// @from(Ln 227727, Col 4)
UcB
// @from(Ln 227727, Col 9)
w80
// @from(Ln 227728, Col 4)
qcB = w(() => {
  UcB = c(CcB(), 1), w80 = UcB.state
})
// @from(Ln 227732, Col 0)
function Uo(A, Q, B) {
  let {
    parameterPath: G,
    mapper: Z
  } = Q, Y;
  if (typeof G === "string") G = [G];
  if (Array.isArray(G)) {
    if (G.length > 0)
      if (Z.isConstant) Y = Z.defaultValue;
      else {
        let J = NcB(A, G);
        if (!J.propertyFound && B) J = NcB(B, G);
        let X = !1;
        if (!J.propertyFound) X = Z.required || G[0] === "options" && G.length === 2;
        Y = X ? Z.defaultValue : J.propertyValue
      }
  } else {
    if (Z.required) Y = {};
    for (let J in G) {
      let X = Z.type.modelProperties[J],
        I = G[J],
        D = Uo(A, {
          parameterPath: I,
          mapper: X
        }, B);
      if (D !== void 0) {
        if (!Y) Y = {};
        Y[J] = D
      }
    }
  }
  return Y
}
// @from(Ln 227766, Col 0)
function NcB(A, Q) {
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
// @from(Ln 227780, Col 0)
function cb8(A) {
  return wcB in A
}
// @from(Ln 227784, Col 0)
function xm(A) {
  if (cb8(A)) return xm(A[wcB]);
  let Q = w80.operationRequestMap.get(A);
  if (!Q) Q = {}, w80.operationRequestMap.set(A, Q);
  return Q
}
// @from(Ln 227790, Col 4)
wcB
// @from(Ln 227791, Col 4)
fTA = w(() => {
  qcB();
  wcB = Symbol.for("@azure/core-client original request")
})
// @from(Ln 227796, Col 0)
function LcB(A = {}) {
  var Q, B, G, Z, Y, J, X;
  let I = (B = (Q = A.expectedContentTypes) === null || Q === void 0 ? void 0 : Q.json) !== null && B !== void 0 ? B : pb8,
    D = (Z = (G = A.expectedContentTypes) === null || G === void 0 ? void 0 : G.xml) !== null && Z !== void 0 ? Z : lb8,
    W = A.parseXML,
    K = A.serializerOptions,
    V = {
      xml: {
        rootName: (Y = K === null || K === void 0 ? void 0 : K.xml.rootName) !== null && Y !== void 0 ? Y : "",
        includeRoot: (J = K === null || K === void 0 ? void 0 : K.xml.includeRoot) !== null && J !== void 0 ? J : !1,
        xmlCharKey: (X = K === null || K === void 0 ? void 0 : K.xml.xmlCharKey) !== null && X !== void 0 ? X : d61
      }
    };
  return {
    name: ib8,
    async sendRequest(F, H) {
      let E = await H(F);
      return ob8(I, D, E, V, W)
    }
  }
}
// @from(Ln 227818, Col 0)
function nb8(A) {
  let Q, B = A.request,
    G = xm(B),
    Z = G === null || G === void 0 ? void 0 : G.operationSpec;
  if (Z)
    if (!(G === null || G === void 0 ? void 0 : G.operationResponseGetter)) Q = Z.responses[A.status];
    else Q = G === null || G === void 0 ? void 0 : G.operationResponseGetter(Z, A);
  return Q
}
// @from(Ln 227828, Col 0)
function ab8(A) {
  let Q = A.request,
    B = xm(Q),
    G = B === null || B === void 0 ? void 0 : B.shouldDeserialize,
    Z;
  if (G === void 0) Z = !0;
  else if (typeof G === "boolean") Z = G;
  else Z = G(A);
  return Z
}
// @from(Ln 227838, Col 0)
async function ob8(A, Q, B, G, Z) {
  let Y = await tb8(A, Q, B, G, Z);
  if (!ab8(Y)) return Y;
  let J = xm(Y.request),
    X = J === null || J === void 0 ? void 0 : J.operationSpec;
  if (!X || !X.responses) return Y;
  let I = nb8(Y),
    {
      error: D,
      shouldReturnResponse: W
    } = sb8(Y, X, I, G);
  if (D) throw D;
  else if (W) return Y;
  if (I) {
    if (I.bodyMapper) {
      let K = Y.parsedBody;
      if (X.isXML && I.bodyMapper.type.name === Tm.Sequence) K = typeof K === "object" ? K[I.bodyMapper.xmlElementName] : [];
      try {
        Y.parsedBody = X.serializer.deserialize(I.bodyMapper, K, "operationRes.parsedBody", G)
      } catch (V) {
        throw new $WA(`Error ${V} occurred in deserializing the responseBody - ${Y.bodyAsText}`, {
          statusCode: Y.status,
          request: Y.request,
          response: Y
        })
      }
    } else if (X.httpMethod === "HEAD") Y.parsedBody = B.status >= 200 && B.status < 300;
    if (I.headersMapper) Y.parsedHeaders = X.serializer.deserialize(I.headersMapper, Y.headers.toJSON(), "operationRes.parsedHeaders", {
      xml: {},
      ignoreUnknownProperties: !0
    })
  }
  return Y
}
// @from(Ln 227873, Col 0)
function rb8(A) {
  let Q = Object.keys(A.responses);
  return Q.length === 0 || Q.length === 1 && Q[0] === "default"
}
// @from(Ln 227878, Col 0)
function sb8(A, Q, B, G) {
  var Z, Y, J, X, I;
  let D = 200 <= A.status && A.status < 300;
  if (rb8(Q) ? D : !!B)
    if (B) {
      if (!B.isError) return {
        error: null,
        shouldReturnResponse: !1
      }
    } else return {
      error: null,
      shouldReturnResponse: !1
    };
  let K = B !== null && B !== void 0 ? B : Q.responses.default,
    V = ((Z = A.request.streamResponseStatusCodes) === null || Z === void 0 ? void 0 : Z.has(A.status)) ? `Unexpected status code: ${A.status}` : A.bodyAsText,
    F = new $WA(V, {
      statusCode: A.status,
      request: A.request,
      response: A
    });
  if (!K && !(((J = (Y = A.parsedBody) === null || Y === void 0 ? void 0 : Y.error) === null || J === void 0 ? void 0 : J.code) && ((I = (X = A.parsedBody) === null || X === void 0 ? void 0 : X.error) === null || I === void 0 ? void 0 : I.message))) throw F;
  let H = K === null || K === void 0 ? void 0 : K.bodyMapper,
    E = K === null || K === void 0 ? void 0 : K.headersMapper;
  try {
    if (A.parsedBody) {
      let z = A.parsedBody,
        $;
      if (H) {
        let L = z;
        if (Q.isXML && H.type.name === Tm.Sequence) {
          L = [];
          let M = H.xmlElementName;
          if (typeof z === "object" && M) L = z[M]
        }
        $ = Q.serializer.deserialize(H, L, "error.response.parsedBody", G)
      }
      let O = z.error || $ || z;
      if (F.code = O.code, O.message) F.message = O.message;
      if (H) F.response.parsedBody = $
    }
    if (A.headers && E) F.response.parsedHeaders = Q.serializer.deserialize(E, A.headers.toJSON(), "operationRes.parsedHeaders")
  } catch (z) {
    F.message = `Error "${z.message}" occurred in deserializing the responseBody - "${A.bodyAsText}" for the default response.`
  }
  return {
    error: F,
    shouldReturnResponse: !1
  }
}
// @from(Ln 227927, Col 0)
async function tb8(A, Q, B, G, Z) {
  var Y;
  if (!((Y = B.request.streamResponseStatusCodes) === null || Y === void 0 ? void 0 : Y.has(B.status)) && B.bodyAsText) {
    let J = B.bodyAsText,
      X = B.headers.get("Content-Type") || "",
      I = !X ? [] : X.split(";").map((D) => D.toLowerCase());
    try {
      if (I.length === 0 || I.some((D) => A.indexOf(D) !== -1)) return B.parsedBody = JSON.parse(J), B;
      else if (I.some((D) => Q.indexOf(D) !== -1)) {
        if (!Z) throw Error("Parsing XML not supported.");
        let D = await Z(J, G.xml);
        return B.parsedBody = D, B
      }
    } catch (D) {
      let W = `Error "${D}" occurred while parsing the response body - ${B.bodyAsText}.`,
        K = D.code || $WA.PARSE_ERROR;
      throw new $WA(W, {
        code: K,
        statusCode: B.status,
        request: B.request,
        response: B
      })
    }
  }
  return B
}
// @from(Ln 227953, Col 4)
pb8
// @from(Ln 227953, Col 9)
lb8
// @from(Ln 227953, Col 14)
ib8 = "deserializationPolicy"
// @from(Ln 227954, Col 4)
OcB = w(() => {
  Sm();
  c61();
  fTA();
  pb8 = ["application/json", "text/json"], lb8 = ["application/xml", "application/atom+xml"]
})
// @from(Ln 227961, Col 0)
function McB(A) {
  let Q = new Set;
  for (let B in A.responses) {
    let G = A.responses[B];
    if (G.bodyMapper && G.bodyMapper.type.name === Tm.Stream) Q.add(Number(B))
  }
  return Q
}
// @from(Ln 227970, Col 0)
function nk(A) {
  let {
    parameterPath: Q,
    mapper: B
  } = A, G;
  if (typeof Q === "string") G = Q;
  else if (Array.isArray(Q)) G = Q.join(".");
  else G = B.serializedName;
  return G
}
// @from(Ln 227980, Col 4)
D31 = w(() => {
  c61()
})
// @from(Ln 227984, Col 0)
function RcB(A = {}) {
  let Q = A.stringifyXML;
  return {
    name: eb8,
    async sendRequest(B, G) {
      let Z = xm(B),
        Y = Z === null || Z === void 0 ? void 0 : Z.operationSpec,
        J = Z === null || Z === void 0 ? void 0 : Z.operationArguments;
      if (Y && J) Af8(B, J, Y), Qf8(B, J, Y, Q);
      return G(B)
    }
  }
}
// @from(Ln 227998, Col 0)
function Af8(A, Q, B) {
  var G, Z;
  if (B.headerParameters)
    for (let J of B.headerParameters) {
      let X = Uo(Q, J);
      if (X !== null && X !== void 0 || J.mapper.required) {
        X = B.serializer.serialize(J.mapper, X, nk(J));
        let I = J.mapper.headerCollectionPrefix;
        if (I)
          for (let D of Object.keys(X)) A.headers.set(I + D, X[D]);
        else A.headers.set(J.mapper.serializedName || nk(J), X)
      }
    }
  let Y = (Z = (G = Q.options) === null || G === void 0 ? void 0 : G.requestOptions) === null || Z === void 0 ? void 0 : Z.customHeaders;
  if (Y)
    for (let J of Object.keys(Y)) A.headers.set(J, Y[J])
}
// @from(Ln 228016, Col 0)
function Qf8(A, Q, B, G = function () {
  throw Error("XML serialization unsupported!")
}) {
  var Z, Y, J, X, I;
  let D = (Z = Q.options) === null || Z === void 0 ? void 0 : Z.serializerOptions,
    W = {
      xml: {
        rootName: (Y = D === null || D === void 0 ? void 0 : D.xml.rootName) !== null && Y !== void 0 ? Y : "",
        includeRoot: (J = D === null || D === void 0 ? void 0 : D.xml.includeRoot) !== null && J !== void 0 ? J : !1,
        xmlCharKey: (X = D === null || D === void 0 ? void 0 : D.xml.xmlCharKey) !== null && X !== void 0 ? X : d61
      }
    },
    K = W.xml.xmlCharKey;
  if (B.requestBody && B.requestBody.mapper) {
    A.body = Uo(Q, B.requestBody);
    let V = B.requestBody.mapper,
      {
        required: F,
        serializedName: H,
        xmlName: E,
        xmlElementName: z,
        xmlNamespace: $,
        xmlNamespacePrefix: O,
        nullable: L
      } = V,
      M = V.type.name;
    try {
      if (A.body !== void 0 && A.body !== null || L && A.body === null || F) {
        let _ = nk(B.requestBody);
        A.body = B.serializer.serialize(V, A.body, _, W);
        let j = M === Tm.Stream;
        if (B.isXML) {
          let x = O ? `xmlns:${O}` : "xmlns",
            b = Bf8($, x, M, A.body, W);
          if (M === Tm.Sequence) A.body = G(Gf8(b, z || E || H, x, $), {
            rootName: E || H,
            xmlCharKey: K
          });
          else if (!j) A.body = G(b, {
            rootName: E || H,
            xmlCharKey: K
          })
        } else if (M === Tm.String && (((I = B.contentType) === null || I === void 0 ? void 0 : I.match("text/plain")) || B.mediaType === "text")) return;
        else if (!j) A.body = JSON.stringify(A.body)
      }
    } catch (_) {
      throw Error(`Error "${_.message}" occurred in serializing the payload - ${JSON.stringify(H,void 0,"  ")}.`)
    }
  } else if (B.formDataParameters && B.formDataParameters.length > 0) {
    A.formData = {};
    for (let V of B.formDataParameters) {
      let F = Uo(Q, V);
      if (F !== void 0 && F !== null) {
        let H = V.mapper.serializedName || nk(V);
        A.formData[H] = B.serializer.serialize(V.mapper, F, nk(V), W)
      }
    }
  }
}
// @from(Ln 228076, Col 0)
function Bf8(A, Q, B, G, Z) {
  if (A && !["Composite", "Sequence", "Dictionary"].includes(B)) {
    let Y = {};
    return Y[Z.xml.xmlCharKey] = G, Y[R30] = {
      [Q]: A
    }, Y
  }
  return G
}
// @from(Ln 228086, Col 0)
function Gf8(A, Q, B, G) {
  if (!Array.isArray(A)) A = [A];
  if (!B || !G) return {
    [Q]: A
  };
  let Z = {
    [Q]: A
  };
  return Z[R30] = {
    [B]: G
  }, Z
}
// @from(Ln 228098, Col 4)
eb8 = "serializationPolicy"
// @from(Ln 228099, Col 4)
_cB = w(() => {
  fTA();
  c61();
  D31()
})
// @from(Ln 228105, Col 0)
function jcB(A = {}) {
  let Q = U80(A !== null && A !== void 0 ? A : {});
  if (A.credentialOptions) Q.addPolicy(bTA({
    credential: A.credentialOptions.credential,
    scopes: A.credentialOptions.credentialScopes
  }));
  return Q.addPolicy(RcB(A.serializationOptions), {
    phase: "Serialize"
  }), Q.addPolicy(LcB(A.deserializationOptions), {
    phase: "Deserialize"
  }), Q
}
// @from(Ln 228117, Col 4)
TcB = w(() => {
  OcB();
  Sm();
  _cB()
})
// @from(Ln 228123, Col 0)
function PcB() {
  if (!L80) L80 = q80();
  return L80
}
// @from(Ln 228127, Col 4)
L80
// @from(Ln 228128, Col 4)
ScB = w(() => {
  Sm()
})
// @from(Ln 228132, Col 0)
function ycB(A, Q, B, G) {
  let Z = Yf8(Q, B, G),
    Y = !1,
    J = xcB(A, Z);
  if (Q.path) {
    let D = xcB(Q.path, Z);
    if (Q.path === "/{nextLink}" && D.startsWith("/")) D = D.substring(1);
    if (Jf8(D)) J = D, Y = !0;
    else J = Xf8(J, D)
  }
  let {
    queryParams: X,
    sequenceParams: I
  } = If8(Q, B, G);
  return J = Wf8(J, X, I, Y), J
}
// @from(Ln 228149, Col 0)
function xcB(A, Q) {
  let B = A;
  for (let [G, Z] of Q) B = B.split(G).join(Z);
  return B
}
// @from(Ln 228155, Col 0)
function Yf8(A, Q, B) {
  var G;
  let Z = new Map;
  if ((G = A.urlParameters) === null || G === void 0 ? void 0 : G.length)
    for (let Y of A.urlParameters) {
      let J = Uo(Q, Y, B),
        X = nk(Y);
      if (J = A.serializer.serialize(Y.mapper, J, X), !Y.skipEncoding) J = encodeURIComponent(J);
      Z.set(`{${Y.mapper.serializedName||X}}`, J)
    }
  return Z
}
// @from(Ln 228168, Col 0)
function Jf8(A) {
  return A.includes("://")
}
// @from(Ln 228172, Col 0)
function Xf8(A, Q) {
  if (!Q) return A;
  let B = new URL(A),
    G = B.pathname;
  if (!G.endsWith("/")) G = `${G}/`;
  if (Q.startsWith("/")) Q = Q.substring(1);
  let Z = Q.indexOf("?");
  if (Z !== -1) {
    let Y = Q.substring(0, Z),
      J = Q.substring(Z + 1);
    if (G = G + Y, J) B.search = B.search ? `${B.search}&${J}` : J
  } else G = G + Q;
  return B.pathname = G, B.toString()
}
// @from(Ln 228187, Col 0)
function If8(A, Q, B) {
  var G;
  let Z = new Map,
    Y = new Set;
  if ((G = A.queryParameters) === null || G === void 0 ? void 0 : G.length)
    for (let J of A.queryParameters) {
      if (J.mapper.type.name === "Sequence" && J.mapper.serializedName) Y.add(J.mapper.serializedName);
      let X = Uo(Q, J, B);
      if (X !== void 0 && X !== null || J.mapper.required) {
        X = A.serializer.serialize(J.mapper, X, nk(J));
        let I = J.collectionFormat ? Zf8[J.collectionFormat] : "";
        if (Array.isArray(X)) X = X.map((D) => {
          if (D === null || D === void 0) return "";
          return D
        });
        if (J.collectionFormat === "Multi" && X.length === 0) continue;
        else if (Array.isArray(X) && (J.collectionFormat === "SSV" || J.collectionFormat === "TSV")) X = X.join(I);
        if (!J.skipEncoding)
          if (Array.isArray(X)) X = X.map((D) => {
            return encodeURIComponent(D)
          });
          else X = encodeURIComponent(X);
        if (Array.isArray(X) && (J.collectionFormat === "CSV" || J.collectionFormat === "Pipes")) X = X.join(I);
        Z.set(J.mapper.serializedName || nk(J), X)
      }
    }
  return {
    queryParams: Z,
    sequenceParams: Y
  }
}
// @from(Ln 228219, Col 0)
function Df8(A) {
  let Q = new Map;
  if (!A || A[0] !== "?") return Q;
  A = A.slice(1);
  let B = A.split("&");
  for (let G of B) {
    let [Z, Y] = G.split("=", 2), J = Q.get(Z);
    if (J)
      if (Array.isArray(J)) J.push(Y);
      else Q.set(Z, [J, Y]);
    else Q.set(Z, Y)
  }
  return Q
}
// @from(Ln 228234, Col 0)
function Wf8(A, Q, B, G = !1) {
  if (Q.size === 0) return A;
  let Z = new URL(A),
    Y = Df8(Z.search);
  for (let [X, I] of Q) {
    let D = Y.get(X);
    if (Array.isArray(D))
      if (Array.isArray(I)) {
        D.push(...I);
        let W = new Set(D);
        Y.set(X, Array.from(W))
      } else D.push(I);
    else if (D) {
      if (Array.isArray(I)) I.unshift(D);
      else if (B.has(X)) Y.set(X, [D, I]);
      if (!G) Y.set(X, I)
    } else Y.set(X, I)
  }
  let J = [];
  for (let [X, I] of Y)
    if (typeof I === "string") J.push(`${X}=${I}`);
    else if (Array.isArray(I))
    for (let D of I) J.push(`${X}=${D}`);
  else J.push(`${X}=${I}`);
  return Z.search = J.length ? `?${J.join("&")}` : "", Z.toString()
}
// @from(Ln 228260, Col 4)
Zf8
// @from(Ln 228261, Col 4)
vcB = w(() => {
  fTA();
  D31();
  Zf8 = {
    CSV: ",",
    SSV: " ",
    Multi: "Multi",
    TSV: "\t",
    Pipes: "|"
  }
})
// @from(Ln 228272, Col 4)
kcB
// @from(Ln 228273, Col 4)
bcB = w(() => {
  $2A();
  kcB = zo("core-client")
})
// @from(Ln 228277, Col 0)
class W31 {
  constructor(A = {}) {
    var Q, B;
    if (this._requestContentType = A.requestContentType, this._endpoint = (Q = A.endpoint) !== null && Q !== void 0 ? Q : A.baseUri, A.baseUri) kcB.warning("The baseUri option for SDK Clients has been deprecated, please use endpoint instead.");
    if (this._allowInsecureConnection = A.allowInsecureConnection, this._httpClient = A.httpClient || PcB(), this.pipeline = A.pipeline || Kf8(A), (B = A.additionalPolicies) === null || B === void 0 ? void 0 : B.length)
      for (let {
          policy: G,
          position: Z
        }
        of A.additionalPolicies) {
        let Y = Z === "perRetry" ? "Sign" : void 0;
        this.pipeline.addPolicy(G, {
          afterPhase: Y
        })
      }
  }
  async sendRequest(A) {
    return this.pipeline.sendRequest(this._httpClient, A)
  }
  async sendOperationRequest(A, Q) {
    let B = Q.baseUrl || this._endpoint;
    if (!B) throw Error("If operationSpec.baseUrl is not specified, then the ServiceClient must have a endpoint string property that contains the base URL to use.");
    let G = ycB(B, Q, A, this),
      Z = eP({
        url: G
      });
    Z.method = Q.httpMethod;
    let Y = xm(Z);
    Y.operationSpec = Q, Y.operationArguments = A;
    let J = Q.contentType || this._requestContentType;
    if (J && Q.requestBody) Z.headers.set("Content-Type", J);
    let X = A.options;
    if (X) {
      let I = X.requestOptions;
      if (I) {
        if (I.timeout) Z.timeout = I.timeout;
        if (I.onUploadProgress) Z.onUploadProgress = I.onUploadProgress;
        if (I.onDownloadProgress) Z.onDownloadProgress = I.onDownloadProgress;
        if (I.shouldDeserialize !== void 0) Y.shouldDeserialize = I.shouldDeserialize;
        if (I.allowInsecureConnection) Z.allowInsecureConnection = !0
      }
      if (X.abortSignal) Z.abortSignal = X.abortSignal;
      if (X.tracingOptions) Z.tracingOptions = X.tracingOptions
    }
    if (this._allowInsecureConnection) Z.allowInsecureConnection = !0;
    if (Z.streamResponseStatusCodes === void 0) Z.streamResponseStatusCodes = McB(Q);
    try {
      let I = await this.sendRequest(Z),
        D = _30(I, Q.responses[I.status]);
      if (X === null || X === void 0 ? void 0 : X.onResponse) X.onResponse(I, D);
      return D
    } catch (I) {
      if (typeof I === "object" && (I === null || I === void 0 ? void 0 : I.response)) {
        let D = I.response,
          W = _30(D, Q.responses[I.statusCode] || Q.responses.default);
        if (I.details = W, X === null || X === void 0 ? void 0 : X.onResponse) X.onResponse(D, W, I)
      }
      throw I
    }
  }
}
// @from(Ln 228339, Col 0)
function Kf8(A) {
  let Q = Vf8(A),
    B = A.credential && Q ? {
      credentialScopes: Q,
      credential: A.credential
    } : void 0;
  return jcB(Object.assign(Object.assign({}, A), {
    credentialOptions: B
  }))
}
// @from(Ln 228350, Col 0)
function Vf8(A) {
  if (A.credentialScopes) return A.credentialScopes;
  if (A.endpoint) return `${A.endpoint}/.default`;
  if (A.baseUri) return `${A.baseUri}/.default`;
  if (A.credential && !A.credentialScopes) throw Error("When using credentials, the ServiceClientOptions must contain either a endpoint or a credentialScopes. Unable to create a bearerTokenAuthenticationPolicy");
  return
}
// @from(Ln 228357, Col 4)
fcB = w(() => {
  Sm();
  TcB();
  VmB();
  ScB();
  fTA();
  vcB();
  D31();
  bcB()
})
// @from(Ln 228367, Col 4)
hcB = w(() => {
  fcB()
})
// @from(Ln 228371, Col 0)
function gcB(A) {
  if (A === "adfs") return "oauth2/token";
  else return "oauth2/v2.0/token"
}
// @from(Ln 228375, Col 4)
LX
// @from(Ln 228376, Col 4)
tL = w(() => {
  JWA();
  C80();
  LX = vTA({
    namespace: "Microsoft.AAD",
    packageName: "@azure/identity",
    packageVersion: k61
  })
})
// @from(Ln 228386, Col 0)
function hTA(A) {
  let Q = "";
  if (Array.isArray(A)) {
    if (A.length !== 1) return;
    Q = A[0]
  } else if (typeof A === "string") Q = A;
  if (!Q.endsWith("/.default")) return Q;
  return Q.substr(0, Q.lastIndexOf("/.default"))
}
// @from(Ln 228396, Col 0)
function mcB(A) {
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
// @from(Ln 228408, Col 0)
function dcB(A) {
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
// @from(Ln 228420, Col 4)
ucB = "Specifying a `clientId` or `resourceId` is not supported by the Service Fabric managed identity environment. The managed identity configuration is determined by the Service Fabric cluster resource configuration. See https://aka.ms/servicefabricmi for more information"
// @from(Ln 228422, Col 0)
function Ff8(A) {
  let Q = A === null || A === void 0 ? void 0 : A.authorityHost;
  if (Z31) Q = Q !== null && Q !== void 0 ? Q : process.env.AZURE_AUTHORITY_HOST;
  return Q !== null && Q !== void 0 ? Q : qTA
}
// @from(Ln 228427, Col 4)
gTA = "noCorrelationId"
// @from(Ln 228428, Col 2)
CWA
// @from(Ln 228429, Col 4)
O80 = w(() => {
  hcB();
  Co();
  Sm();
  RC();
  JWA();
  tL();
  uD();
  CWA = class CWA extends W31 {
    constructor(A) {
      var Q, B;
      let G = `azsdk-js-identity/${k61}`,
        Z = ((Q = A === null || A === void 0 ? void 0 : A.userAgentOptions) === null || Q === void 0 ? void 0 : Q.userAgentPrefix) ? `${A.userAgentOptions.userAgentPrefix} ${G}` : `${G}`,
        Y = Ff8(A);
      if (!Y.startsWith("https:")) throw Error("The authorityHost address must use the 'https' protocol.");
      super(Object.assign(Object.assign({
        requestContentType: "application/json; charset=utf-8",
        retryOptions: {
          maxRetries: 3
        }
      }, A), {
        userAgentOptions: {
          userAgentPrefix: Z
        },
        baseUri: Y
      }));
      if (this.allowInsecureConnection = !1, this.authorityHost = Y, this.abortControllers = new Map, this.allowLoggingAccountIdentifiers = (B = A === null || A === void 0 ? void 0 : A.loggingOptions) === null || B === void 0 ? void 0 : B.allowLoggingAccountIdentifiers, this.tokenCredentialOptions = Object.assign({}, A), A === null || A === void 0 ? void 0 : A.allowInsecureConnection) this.allowInsecureConnection = A.allowInsecureConnection
    }
    async sendTokenRequest(A) {
      $_.info(`IdentityClient: sending token request to [${A.url}]`);
      let Q = await this.sendRequest(A);
      if (Q.bodyAsText && (Q.status === 200 || Q.status === 201)) {
        let B = JSON.parse(Q.bodyAsText);
        if (!B.access_token) return null;
        this.logIdentifiers(Q);
        let G = {
          accessToken: {
            token: B.access_token,
            expiresOnTimestamp: mcB(B),
            refreshAfterTimestamp: dcB(B),
            tokenType: "Bearer"
          },
          refreshToken: B.refresh_token
        };
        return $_.info(`IdentityClient: [${A.url}] token acquired, expires on ${G.accessToken.expiresOnTimestamp}`), G
      } else {
        let B = new NTA(Q.status, Q.bodyAsText);
        throw $_.warning(`IdentityClient: authentication error. HTTP status: ${Q.status}, ${B.errorResponse.errorDescription}`), B
      }
    }
    async refreshAccessToken(A, Q, B, G, Z, Y = {}) {
      if (G === void 0) return null;
      $_.info(`IdentityClient: refreshing access token with client ID: ${Q}, scopes: ${B} started`);
      let J = {
        grant_type: "refresh_token",
        client_id: Q,
        refresh_token: G,
        scope: B
      };
      if (Z !== void 0) J.client_secret = Z;
      let X = new URLSearchParams(J);
      return LX.withSpan("IdentityClient.refreshAccessToken", Y, async (I) => {
        try {
          let D = gcB(A),
            W = eP({
              url: `${this.authorityHost}/${A}/${D}`,
              method: "POST",
              body: X.toString(),
              abortSignal: Y.abortSignal,
              headers: q2A({
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
              }),
              tracingOptions: I.tracingOptions
            }),
            K = await this.sendTokenRequest(W);
          return $_.info(`IdentityClient: refreshed token for client ID: ${Q}`), K
        } catch (D) {
          if (D.name === O30 && D.errorResponse.error === "interaction_required") return $_.info(`IdentityClient: interaction required for client ID: ${Q}`), null;
          else throw $_.warning(`IdentityClient: failed refreshing token for client ID: ${Q}: ${D}`), D
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
      let Q = A || gTA,
        B = [...this.abortControllers.get(Q) || [], ...this.abortControllers.get(gTA) || []];
      if (!B.length) return;
      for (let G of B) G.abort();
      this.abortControllers.set(Q, void 0)
    }
    getCorrelationId(A) {
      var Q;
      let B = (Q = A === null || A === void 0 ? void 0 : A.body) === null || Q === void 0 ? void 0 : Q.split("&").map((G) => G.split("=")).find(([G]) => G === "client-request-id");
      return B && B.length ? B[1] || gTA : gTA
    }
    async sendGetRequestAsync(A, Q) {
      let B = eP({
          url: A,
          method: "GET",
          body: Q === null || Q === void 0 ? void 0 : Q.body,
          allowInsecureConnection: this.allowInsecureConnection,
          headers: q2A(Q === null || Q === void 0 ? void 0 : Q.headers),
          abortSignal: this.generateAbortSignal(gTA)
        }),
        G = await this.sendRequest(B);
      return this.logIdentifiers(G), {
        body: G.bodyAsText ? JSON.parse(G.bodyAsText) : void 0,
        headers: G.headers.toJSON(),
        status: G.status
      }
    }
    async sendPostRequestAsync(A, Q) {
      let B = eP({
          url: A,
          method: "POST",
          body: Q === null || Q === void 0 ? void 0 : Q.body,
          headers: q2A(Q === null || Q === void 0 ? void 0 : Q.headers),
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
            appid: Y,
            upn: J,
            tid: X,
            oid: I
          } = JSON.parse(Buffer.from(Z, "base64").toString("utf8"));
        $_.info(`[Authenticated account] Client ID: ${Y}. Tenant ID: ${X}. User Principal Name: ${J||Q}. Object ID (user): ${I}`)
      } catch (B) {
        $_.warning("allowLoggingAccountIdentifiers was set, but we couldn't log the account information. Error:", B.message)
      }
    }
  }
})
// @from(Ln 228588, Col 4)
ccB = () => {}
// @from(Ln 228589, Col 0)
class N2A {
  static serializeJSONBlob(A) {
    return JSON.stringify(A)
  }
  static serializeAccounts(A) {
    let Q = {};
    return Object.keys(A).map(function (B) {
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
    return Object.keys(A).map(function (B) {
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
    return Object.keys(A).map(function (B) {
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
    return Object.keys(A).map(function (B) {
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
    return Object.keys(A).map(function (B) {
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
// @from(Ln 228689, Col 4)
K31 = w(() => {
  /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 228692, Col 4)
m0
// @from(Ln 228692, Col 8)
i6
// @from(Ln 228692, Col 12)
yz
// @from(Ln 228692, Col 16)
M80
// @from(Ln 228692, Col 21)
pY
// @from(Ln 228692, Col 25)
KN
// @from(Ln 228692, Col 29)
w2A
// @from(Ln 228692, Col 34)
qo
// @from(Ln 228692, Col 38)
V31
// @from(Ln 228692, Col 43)
UWA
// @from(Ln 228692, Col 48)
ak
// @from(Ln 228692, Col 52)
VN
// @from(Ln 228692, Col 56)
L2A
// @from(Ln 228692, Col 61)
ym
// @from(Ln 228692, Col 65)
SG
// @from(Ln 228692, Col 69)
uTA = "appmetadata"
// @from(Ln 228693, Col 2)
pcB = "client_info"
// @from(Ln 228694, Col 2)
No = "1"
// @from(Ln 228695, Col 2)
qWA
// @from(Ln 228695, Col 7)
jC
// @from(Ln 228695, Col 11)
rK
// @from(Ln 228695, Col 15)
J5
// @from(Ln 228695, Col 19)
ok
// @from(Ln 228695, Col 23)
mTA
// @from(Ln 228695, Col 28)
dTA
// @from(Ln 228695, Col 33)
O2A
// @from(Ln 228695, Col 38)
F31
// @from(Ln 228695, Col 43)
YY
// @from(Ln 228695, Col 47)
NWA = 300
// @from(Ln 228696, Col 2)
aH
// @from(Ln 228697, Col 4)
lY = w(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */
  m0 = {
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
  }, i6 = {
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
  }, yz = [m0.OPENID_SCOPE, m0.PROFILE_SCOPE, m0.OFFLINE_ACCESS_SCOPE], M80 = [...yz, m0.EMAIL_SCOPE], pY = {
    CONTENT_TYPE: "Content-Type",
    CONTENT_LENGTH: "Content-Length",
    RETRY_AFTER: "Retry-After",
    CCS_HEADER: "X-AnchorMailbox",
    WWWAuthenticate: "WWW-Authenticate",
    AuthenticationInfo: "Authentication-Info",
    X_MS_REQUEST_ID: "x-ms-request-id",
    X_MS_HTTP_VERSION: "x-ms-httpver"
  }, KN = {
    COMMON: "common",
    ORGANIZATIONS: "organizations",
    CONSUMERS: "consumers"
  }, w2A = {
    ACCESS_TOKEN: "access_token",
    XMS_CC: "xms_cc"
  }, qo = {
    LOGIN: "login",
    SELECT_ACCOUNT: "select_account",
    CONSENT: "consent",
    NONE: "none",
    CREATE: "create",
    NO_SESSION: "no_session"
  }, V31 = {
    PLAIN: "plain",
    S256: "S256"
  }, UWA = {
    CODE: "code",
    IDTOKEN_TOKEN: "id_token token",
    IDTOKEN_TOKEN_REFRESHTOKEN: "id_token token refresh_token"
  }, ak = {
    QUERY: "query",
    FRAGMENT: "fragment",
    FORM_POST: "form_post"
  }, VN = {
    IMPLICIT_GRANT: "implicit",
    AUTHORIZATION_CODE_GRANT: "authorization_code",
    CLIENT_CREDENTIALS_GRANT: "client_credentials",
    RESOURCE_OWNER_PASSWORD_GRANT: "password",
    REFRESH_TOKEN_GRANT: "refresh_token",
    DEVICE_CODE_GRANT: "device_code",
    JWT_BEARER: "urn:ietf:params:oauth:grant-type:jwt-bearer"
  }, L2A = {
    MSSTS_ACCOUNT_TYPE: "MSSTS",
    ADFS_ACCOUNT_TYPE: "ADFS",
    MSAV1_ACCOUNT_TYPE: "MSA",
    GENERIC_ACCOUNT_TYPE: "Generic"
  }, ym = {
    CACHE_KEY_SEPARATOR: "-",
    CLIENT_INFO_SEPARATOR: "."
  }, SG = {
    ID_TOKEN: "IdToken",
    ACCESS_TOKEN: "AccessToken",
    ACCESS_TOKEN_WITH_AUTH_SCHEME: "AccessToken_With_AuthScheme",
    REFRESH_TOKEN: "RefreshToken"
  }, qWA = {
    CACHE_KEY: "authority-metadata",
    REFRESH_TIME_SECONDS: 86400
  }, jC = {
    CONFIG: "config",
    CACHE: "cache",
    NETWORK: "network",
    HARDCODED_VALUES: "hardcoded_values"
  }, rK = {
    SCHEMA_VERSION: 5,
    MAX_LAST_HEADER_BYTES: 330,
    MAX_CACHED_ERRORS: 50,
    CACHE_KEY: "server-telemetry",
    CATEGORY_SEPARATOR: "|",
    VALUE_SEPARATOR: ",",
    OVERFLOW_TRUE: "1",
    OVERFLOW_FALSE: "0",
    UNKNOWN_ERROR: "unknown_error"
  }, J5 = {
    BEARER: "Bearer",
    POP: "pop",
    SSH: "ssh-cert"
  }, ok = {
    DEFAULT_THROTTLE_TIME_SECONDS: 60,
    DEFAULT_MAX_THROTTLE_TIME_SECONDS: 3600,
    THROTTLING_PREFIX: "throttling",
    X_MS_LIB_CAPABILITY_VALUE: "retry-after, h429"
  }, mTA = {
    INVALID_GRANT_ERROR: "invalid_grant",
    CLIENT_MISMATCH_ERROR: "client_mismatch"
  }, dTA = {
    username: "username",
    password: "password"
  }, O2A = {
    FAILED_AUTO_DETECTION: "1",
    INTERNAL_CACHE: "2",
    ENVIRONMENT_VARIABLE: "3",
    IMDS: "4"
  }, F31 = {
    CONFIGURED_NO_AUTO_DETECTION: "2",
    AUTO_DETECTION_REQUESTED_SUCCESSFUL: "4",
    AUTO_DETECTION_REQUESTED_FAILED: "5"
  }, YY = {
    NOT_APPLICABLE: "0",
    FORCE_REFRESH_OR_CLAIMS: "1",
    NO_CACHED_ACCESS_TOKEN: "2",
    CACHED_ACCESS_TOKEN_EXPIRED: "3",
    PROACTIVELY_REFRESHED: "4"
  }, aH = {
    BASE64: "base64",
    HEX: "hex",
    UTF8: "utf-8"
  }
})
// @from(Ln 228865, Col 4)
wWA = {}
// @from(Ln 228870, Col 4)
cTA = "unexpected_error"
// @from(Ln 228871, Col 2)
pTA = "post_request_failed"
// @from(Ln 228872, Col 4)
R80 = w(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 228876, Col 0)
function j80(A, Q) {
  return new n6(A, Q ? `${H31[A]} ${Q}` : H31[A])
}
// @from(Ln 228879, Col 4)
H31
// @from(Ln 228879, Col 9)
_80
// @from(Ln 228879, Col 14)
n6
// @from(Ln 228880, Col 4)
U_ = w(() => {
  lY();
  R80(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  H31 = {
    [cTA]: "Unexpected error in authentication.",
    [pTA]: "Post request failed from the network, could be a 4xx/5xx or a network unavailability. Please check the exact error code for details."
  }, _80 = {
    unexpectedError: {
      code: cTA,
      desc: H31[cTA]
    },
    postRequestFailed: {
      code: pTA,
      desc: H31[pTA]
    }
  };
  n6 = class n6 extends Error {
    constructor(A, Q, B) {
      let G = Q ? `${A}: ${Q}` : A;
      super(G);
      Object.setPrototypeOf(this, n6.prototype), this.errorCode = A || m0.EMPTY_STRING, this.errorMessage = Q || m0.EMPTY_STRING, this.subError = B || m0.EMPTY_STRING, this.name = "AuthError"
    }
    setCorrelationId(A) {
      this.correlationId = A
    }
  }
})
// @from(Ln 228907, Col 4)
xZ = {}
// @from(Ln 228954, Col 4)
wo = "client_info_decoding_error"
// @from(Ln 228955, Col 2)
M2A = "client_info_empty_error"
// @from(Ln 228956, Col 2)
Lo = "token_parsing_error"
// @from(Ln 228957, Col 2)
R2A = "null_or_empty_token"
// @from(Ln 228958, Col 2)
TC = "endpoints_resolution_error"
// @from(Ln 228959, Col 2)
_2A = "network_error"
// @from(Ln 228960, Col 2)
j2A = "openid_config_error"
// @from(Ln 228961, Col 2)
T2A = "hash_not_deserialized"
// @from(Ln 228962, Col 2)
AS = "invalid_state"
// @from(Ln 228963, Col 2)
P2A = "state_mismatch"
// @from(Ln 228964, Col 2)
Oo = "state_not_found"
// @from(Ln 228965, Col 2)
S2A = "nonce_mismatch"
// @from(Ln 228966, Col 2)
vm = "auth_time_not_found"
// @from(Ln 228967, Col 2)
x2A = "max_age_transpired"
// @from(Ln 228968, Col 2)
lTA = "multiple_matching_tokens"
// @from(Ln 228969, Col 2)
iTA = "multiple_matching_accounts"
// @from(Ln 228970, Col 2)
y2A = "multiple_matching_appMetadata"
// @from(Ln 228971, Col 2)
v2A = "request_cannot_be_made"
// @from(Ln 228972, Col 2)
k2A = "cannot_remove_empty_scope"
// @from(Ln 228973, Col 2)
b2A = "cannot_append_scopeset"
// @from(Ln 228974, Col 2)
Mo = "empty_input_scopeset"
// @from(Ln 228975, Col 2)
nTA = "device_code_polling_cancelled"
// @from(Ln 228976, Col 2)
aTA = "device_code_expired"
// @from(Ln 228977, Col 2)
oTA = "device_code_unknown_error"
// @from(Ln 228978, Col 2)
km = "no_account_in_silent_request"
// @from(Ln 228979, Col 2)
f2A = "invalid_cache_record"
// @from(Ln 228980, Col 2)
bm = "invalid_cache_environment"
// @from(Ln 228981, Col 2)
rTA = "no_account_found"
// @from(Ln 228982, Col 2)
Ro = "no_crypto_object"
// @from(Ln 228983, Col 2)
sTA = "unexpected_credential_type"
// @from(Ln 228984, Col 2)
tTA = "invalid_assertion"
// @from(Ln 228985, Col 2)
eTA = "invalid_client_credential"
// @from(Ln 228986, Col 2)
fm = "token_refresh_required"
// @from(Ln 228987, Col 2)
APA = "user_timeout_reached"
// @from(Ln 228988, Col 2)
h2A = "token_claims_cnf_required_for_signedjwt"
// @from(Ln 228989, Col 2)
g2A = "authorization_code_missing_from_server_response"
// @from(Ln 228990, Col 2)
QPA = "binding_key_not_removed"
// @from(Ln 228991, Col 2)
u2A = "end_session_endpoint_not_supported"
// @from(Ln 228992, Col 2)
m2A = "key_id_missing"
// @from(Ln 228993, Col 2)
BPA = "no_network_connectivity"
// @from(Ln 228994, Col 2)
GPA = "user_canceled"
// @from(Ln 228995, Col 2)
ZPA = "missing_tenant_id_error"
// @from(Ln 228996, Col 2)
o3 = "method_not_implemented"
// @from(Ln 228997, Col 2)
YPA = "nested_app_auth_bridge_disabled"
// @from(Ln 228998, Col 4)
mD = w(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 229002, Col 0)
function YQ(A, Q) {
  return new _o(A, Q)
}
// @from(Ln 229005, Col 4)
a6
// @from(Ln 229005, Col 8)
T80
// @from(Ln 229005, Col 13)
_o
// @from(Ln 229006, Col 4)
aW = w(() => {
  U_();
  mD(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  a6 = {
    [wo]: "The client info could not be parsed/decoded correctly",
    [M2A]: "The client info was empty",
    [Lo]: "Token cannot be parsed",
    [R2A]: "The token is null or empty",
    [TC]: "Endpoints cannot be resolved",
    [_2A]: "Network request failed",
    [j2A]: "Could not retrieve endpoints. Check your authority and verify the .well-known/openid-configuration endpoint returns the required endpoints.",
    [T2A]: "The hash parameters could not be deserialized",
    [AS]: "State was not the expected format",
    [P2A]: "State mismatch error",
    [Oo]: "State not found",
    [S2A]: "Nonce mismatch error",
    [vm]: "Max Age was requested and the ID token is missing the auth_time variable. auth_time is an optional claim and is not enabled by default - it must be enabled. See https://aka.ms/msaljs/optional-claims for more information.",
    [x2A]: "Max Age is set to 0, or too much time has elapsed since the last end-user authentication.",
    [lTA]: "The cache contains multiple tokens satisfying the requirements. Call AcquireToken again providing more requirements such as authority or account.",
    [iTA]: "The cache contains multiple accounts satisfying the given parameters. Please pass more info to obtain the correct account",
    [y2A]: "The cache contains multiple appMetadata satisfying the given parameters. Please pass more info to obtain the correct appMetadata",
    [v2A]: "Token request cannot be made without authorization code or refresh token.",
    [k2A]: "Cannot remove null or empty scope from ScopeSet",
    [b2A]: "Cannot append ScopeSet",
    [Mo]: "Empty input ScopeSet cannot be processed",
    [nTA]: "Caller has cancelled token endpoint polling during device code flow by setting DeviceCodeRequest.cancel = true.",
    [aTA]: "Device code is expired.",
    [oTA]: "Device code stopped polling for unknown reasons.",
    [km]: "Please pass an account object, silent flow is not supported without account information",
    [f2A]: "Cache record object was null or undefined.",
    [bm]: "Invalid environment when attempting to create cache entry",
    [rTA]: "No account found in cache for given key.",
    [Ro]: "No crypto object detected.",
    [sTA]: "Unexpected credential type.",
    [tTA]: "Client assertion must meet requirements described in https://tools.ietf.org/html/rfc7515",
    [eTA]: "Client credential (secret, certificate, or assertion) must not be empty when creating a confidential client. An application should at most have one credential",
    [fm]: "Cannot return token from cache because it must be refreshed. This may be due to one of the following reasons: forceRefresh parameter is set to true, claims have been requested, there is no cached access token or it is expired.",
    [APA]: "User defined timeout for device code polling reached",
    [h2A]: "Cannot generate a POP jwt if the token_claims are not populated",
    [g2A]: "Server response does not contain an authorization code to proceed",
    [QPA]: "Could not remove the credential's binding key from storage.",
    [u2A]: "The provided authority does not support logout",
    [m2A]: "A keyId value is missing from the requested bound token's cache record and is required to match the token to it's stored binding key.",
    [BPA]: "No network connectivity. Check your internet connection.",
    [GPA]: "User cancelled the flow.",
    [ZPA]: "A tenant id - not common, organizations, or consumers - must be specified when using the client_credentials flow.",
    [o3]: "This method has not been implemented",
    [YPA]: "The nested app auth bridge is disabled"
  }, T80 = {
    clientInfoDecodingError: {
      code: wo,
      desc: a6[wo]
    },
    clientInfoEmptyError: {
      code: M2A,
      desc: a6[M2A]
    },
    tokenParsingError: {
      code: Lo,
      desc: a6[Lo]
    },
    nullOrEmptyToken: {
      code: R2A,
      desc: a6[R2A]
    },
    endpointResolutionError: {
      code: TC,
      desc: a6[TC]
    },
    networkError: {
      code: _2A,
      desc: a6[_2A]
    },
    unableToGetOpenidConfigError: {
      code: j2A,
      desc: a6[j2A]
    },
    hashNotDeserialized: {
      code: T2A,
      desc: a6[T2A]
    },
    invalidStateError: {
      code: AS,
      desc: a6[AS]
    },
    stateMismatchError: {
      code: P2A,
      desc: a6[P2A]
    },
    stateNotFoundError: {
      code: Oo,
      desc: a6[Oo]
    },
    nonceMismatchError: {
      code: S2A,
      desc: a6[S2A]
    },
    authTimeNotFoundError: {
      code: vm,
      desc: a6[vm]
    },
    maxAgeTranspired: {
      code: x2A,
      desc: a6[x2A]
    },
    multipleMatchingTokens: {
      code: lTA,
      desc: a6[lTA]
    },
    multipleMatchingAccounts: {
      code: iTA,
      desc: a6[iTA]
    },
    multipleMatchingAppMetadata: {
      code: y2A,
      desc: a6[y2A]
    },
    tokenRequestCannotBeMade: {
      code: v2A,
      desc: a6[v2A]
    },
    removeEmptyScopeError: {
      code: k2A,
      desc: a6[k2A]
    },
    appendScopeSetError: {
      code: b2A,
      desc: a6[b2A]
    },
    emptyInputScopeSetError: {
      code: Mo,
      desc: a6[Mo]
    },
    DeviceCodePollingCancelled: {
      code: nTA,
      desc: a6[nTA]
    },
    DeviceCodeExpired: {
      code: aTA,
      desc: a6[aTA]
    },
    DeviceCodeUnknownError: {
      code: oTA,
      desc: a6[oTA]
    },
    NoAccountInSilentRequest: {
      code: km,
      desc: a6[km]
    },
    invalidCacheRecord: {
      code: f2A,
      desc: a6[f2A]
    },
    invalidCacheEnvironment: {
      code: bm,
      desc: a6[bm]
    },
    noAccountFound: {
      code: rTA,
      desc: a6[rTA]
    },
    noCryptoObj: {
      code: Ro,
      desc: a6[Ro]
    },
    unexpectedCredentialType: {
      code: sTA,
      desc: a6[sTA]
    },
    invalidAssertion: {
      code: tTA,
      desc: a6[tTA]
    },
    invalidClientCredential: {
      code: eTA,
      desc: a6[eTA]
    },
    tokenRefreshRequired: {
      code: fm,
      desc: a6[fm]
    },
    userTimeoutReached: {
      code: APA,
      desc: a6[APA]
    },
    tokenClaimsRequired: {
      code: h2A,
      desc: a6[h2A]
    },
    noAuthorizationCodeFromServer: {
      code: g2A,
      desc: a6[g2A]
    },
    bindingKeyNotRemovedError: {
      code: QPA,
      desc: a6[QPA]
    },
    logoutNotSupported: {
      code: u2A,
      desc: a6[u2A]
    },
    keyIdMissing: {
      code: m2A,
      desc: a6[m2A]
    },
    noNetworkConnectivity: {
      code: BPA,
      desc: a6[BPA]
    },
    userCanceledError: {
      code: GPA,
      desc: a6[GPA]
    },
    missingTenantIdError: {
      code: ZPA,
      desc: a6[ZPA]
    },
    nestedAppAuthBridgeDisabled: {
      code: YPA,
      desc: a6[YPA]
    }
  };
  _o = class _o extends n6 {
    constructor(A, Q) {
      super(A, Q ? `${a6[A]}: ${Q}` : a6[A]);
      this.name = "ClientAuthError", Object.setPrototypeOf(this, _o.prototype)
    }
  }
})
// @from(Ln 229235, Col 4)
LWA
// @from(Ln 229236, Col 4)
P80 = w(() => {
  aW();
  mD(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  LWA = {
    createNewGuid: () => {
      throw YQ(o3)
    },
    base64Decode: () => {
      throw YQ(o3)
    },
    base64Encode: () => {
      throw YQ(o3)
    },
    base64UrlEncode: () => {
      throw YQ(o3)
    },
    encodeKid: () => {
      throw YQ(o3)
    },
    async getPublicKeyThumbprint() {
      throw YQ(o3)
    },
    async removeTokenBindingKey() {
      throw YQ(o3)
    },
    async clearKeystore() {
      throw YQ(o3)
    },
    async signJwt() {
      throw YQ(o3)
    },
    async hashString() {
      throw YQ(o3)
    }
  }
})
// @from(Ln 229272, Col 0)
class FN {
  constructor(A, Q, B) {
    this.level = KI.Info;
    let G = () => {
        return
      },
      Z = A || FN.createDefaultLoggerOptions();
    this.localCallback = Z.loggerCallback || G, this.piiLoggingEnabled = Z.piiLoggingEnabled || !1, this.level = typeof Z.logLevel === "number" ? Z.logLevel : KI.Info, this.correlationId = Z.correlationId || m0.EMPTY_STRING, this.packageName = Q || m0.EMPTY_STRING, this.packageVersion = B || m0.EMPTY_STRING
  }
  static createDefaultLoggerOptions() {
    return {
      loggerCallback: () => {},
      piiLoggingEnabled: !1,
      logLevel: KI.Info
    }
  }
  clone(A, Q, B) {
    return new FN({
      loggerCallback: this.localCallback,
      piiLoggingEnabled: this.piiLoggingEnabled,
      logLevel: this.level,
      correlationId: B || this.correlationId
    }, A, Q)
  }
  logMessage(A, Q) {
    if (Q.logLevel > this.level || !this.piiLoggingEnabled && Q.containsPii) return;
    let Z = `${`[${new Date().toUTCString()}] : [${Q.correlationId||this.correlationId||""}]`} : ${this.packageName}@${this.packageVersion} : ${KI[Q.logLevel]} - ${A}`;
    this.executeCallback(Q.logLevel, Z, Q.containsPii || !1)
  }
  executeCallback(A, Q, B) {
    if (this.localCallback) this.localCallback(A, Q, B)
  }
  error(A, Q) {
    this.logMessage(A, {
      logLevel: KI.Error,
      containsPii: !1,
      correlationId: Q || m0.EMPTY_STRING
    })
  }
  errorPii(A, Q) {
    this.logMessage(A, {
      logLevel: KI.Error,
      containsPii: !0,
      correlationId: Q || m0.EMPTY_STRING
    })
  }
  warning(A, Q) {
    this.logMessage(A, {
      logLevel: KI.Warning,
      containsPii: !1,
      correlationId: Q || m0.EMPTY_STRING
    })
  }
  warningPii(A, Q) {
    this.logMessage(A, {
      logLevel: KI.Warning,
      containsPii: !0,
      correlationId: Q || m0.EMPTY_STRING
    })
  }
  info(A, Q) {
    this.logMessage(A, {
      logLevel: KI.Info,
      containsPii: !1,
      correlationId: Q || m0.EMPTY_STRING
    })
  }
  infoPii(A, Q) {
    this.logMessage(A, {
      logLevel: KI.Info,
      containsPii: !0,
      correlationId: Q || m0.EMPTY_STRING
    })
  }
  verbose(A, Q) {
    this.logMessage(A, {
      logLevel: KI.Verbose,
      containsPii: !1,
      correlationId: Q || m0.EMPTY_STRING
    })
  }
  verbosePii(A, Q) {
    this.logMessage(A, {
      logLevel: KI.Verbose,
      containsPii: !0,
      correlationId: Q || m0.EMPTY_STRING
    })
  }
  trace(A, Q) {
    this.logMessage(A, {
      logLevel: KI.Trace,
      containsPii: !1,
      correlationId: Q || m0.EMPTY_STRING
    })
  }
  tracePii(A, Q) {
    this.logMessage(A, {
      logLevel: KI.Trace,
      containsPii: !0,
      correlationId: Q || m0.EMPTY_STRING
    })
  }
  isPiiLoggingEnabled() {
    return this.piiLoggingEnabled || !1
  }
}
// @from(Ln 229378, Col 4)
KI
// @from(Ln 229379, Col 4)
E31 = w(() => {
  lY(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  (function (A) {
    A[A.Error = 0] = "Error", A[A.Warning = 1] = "Warning", A[A.Info = 2] = "Info", A[A.Verbose = 3] = "Verbose", A[A.Trace = 4] = "Trace"
  })(KI || (KI = {}))
})
// @from(Ln 229385, Col 4)
z31 = "@azure/msal-common"
// @from(Ln 229386, Col 2)
OWA = "15.13.1"
// @from(Ln 229387, Col 4)
$31 = w(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 229390, Col 4)
hm
// @from(Ln 229391, Col 4)
C31 = w(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */
  hm = {
    None: "none",
    AzurePublic: "https://login.microsoftonline.com",
    AzurePpe: "https://login.windows-ppe.net",
    AzureChina: "https://login.chinacloudapi.cn",
    AzureGermany: "https://login.microsoftonline.de",
    AzureUsGovernment: "https://login.microsoftonline.us"
  }
})
// @from(Ln 229402, Col 4)
MWA = {}
// @from(Ln 229428, Col 4)
d2A = "redirect_uri_empty"
// @from(Ln 229429, Col 2)
JPA = "claims_request_parsing_error"
// @from(Ln 229430, Col 2)
c2A = "authority_uri_insecure"
// @from(Ln 229431, Col 2)
rk = "url_parse_error"
// @from(Ln 229432, Col 2)
p2A = "empty_url_error"
// @from(Ln 229433, Col 2)
l2A = "empty_input_scopes_error"
// @from(Ln 229434, Col 2)
jo = "invalid_claims"
// @from(Ln 229435, Col 2)
i2A = "token_request_empty"
// @from(Ln 229436, Col 2)
n2A = "logout_request_empty"
// @from(Ln 229437, Col 2)
XPA = "invalid_code_challenge_method"
// @from(Ln 229438, Col 2)
a2A = "pkce_params_missing"
// @from(Ln 229439, Col 2)
To = "invalid_cloud_discovery_metadata"
// @from(Ln 229440, Col 2)
o2A = "invalid_authority_metadata"
// @from(Ln 229441, Col 2)
r2A = "untrusted_authority"
// @from(Ln 229442, Col 2)
gm = "missing_ssh_jwk"
// @from(Ln 229443, Col 2)
IPA = "missing_ssh_kid"
// @from(Ln 229444, Col 2)
DPA = "missing_nonce_authentication_header"
// @from(Ln 229445, Col 2)
WPA = "invalid_authentication_header"
// @from(Ln 229446, Col 2)
KPA = "cannot_set_OIDCOptions"
// @from(Ln 229447, Col 2)
VPA = "cannot_allow_platform_broker"
// @from(Ln 229448, Col 2)
FPA = "authority_mismatch"
// @from(Ln 229449, Col 2)
HPA = "invalid_request_method_for_EAR"
// @from(Ln 229450, Col 2)
EPA = "invalid_authorize_post_body_parameters"
// @from(Ln 229451, Col 4)
um = w(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 229455, Col 0)
function yZ(A) {
  return new RWA(A)
}
// @from(Ln 229458, Col 4)
OX
// @from(Ln 229458, Col 8)
S80
// @from(Ln 229458, Col 13)
RWA
// @from(Ln 229459, Col 4)
Po = w(() => {
  U_();
  um(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  OX = {
    [d2A]: "A redirect URI is required for all calls, and none has been set.",
    [JPA]: "Could not parse the given claims request object.",
    [c2A]: "Authority URIs must use https.  Please see here for valid authority configuration options: https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-js-initializing-client-applications#configuration-options",
    [rk]: "URL could not be parsed into appropriate segments.",
    [p2A]: "URL was empty or null.",
    [l2A]: "Scopes cannot be passed as null, undefined or empty array because they are required to obtain an access token.",
    [jo]: "Given claims parameter must be a stringified JSON object.",
    [i2A]: "Token request was empty and not found in cache.",
    [n2A]: "The logout request was null or undefined.",
    [XPA]: 'code_challenge_method passed is invalid. Valid values are "plain" and "S256".',
    [a2A]: "Both params: code_challenge and code_challenge_method are to be passed if to be sent in the request",
    [To]: "Invalid cloudDiscoveryMetadata provided. Must be a stringified JSON object containing tenant_discovery_endpoint and metadata fields",
    [o2A]: "Invalid authorityMetadata provided. Must by a stringified JSON object containing authorization_endpoint, token_endpoint, issuer fields.",
    [r2A]: "The provided authority is not a trusted authority. Please include this authority in the knownAuthorities config parameter.",
    [gm]: "Missing sshJwk in SSH certificate request. A stringified JSON Web Key is required when using the SSH authentication scheme.",
    [IPA]: "Missing sshKid in SSH certificate request. A string that uniquely identifies the public SSH key is required when using the SSH authentication scheme.",
    [DPA]: "Unable to find an authentication header containing server nonce. Either the Authentication-Info or WWW-Authenticate headers must be present in order to obtain a server nonce.",
    [WPA]: "Invalid authentication header provided",
    [KPA]: "Cannot set OIDCOptions parameter. Please change the protocol mode to OIDC or use a non-Microsoft authority.",
    [VPA]: "Cannot set allowPlatformBroker parameter to true when not in AAD protocol mode.",
    [FPA]: "Authority mismatch error. Authority provided in login request or PublicClientApplication config does not match the environment of the provided account. Please use a matching account or make an interactive request to login to this authority.",
    [EPA]: "Invalid authorize post body parameters provided. If you are using authorizePostBodyParameters, the request method must be POST. Please check the request method and parameters.",
    [HPA]: "Invalid request method for EAR protocol mode. The request method cannot be GET when using EAR protocol mode. Please change the request method to POST."
  }, S80 = {
    redirectUriNotSet: {
      code: d2A,
      desc: OX[d2A]
    },
    claimsRequestParsingError: {
      code: JPA,
      desc: OX[JPA]
    },
    authorityUriInsecure: {
      code: c2A,
      desc: OX[c2A]
    },
    urlParseError: {
      code: rk,
      desc: OX[rk]
    },
    urlEmptyError: {
      code: p2A,
      desc: OX[p2A]
    },
    emptyScopesError: {
      code: l2A,
      desc: OX[l2A]
    },
    invalidClaimsRequest: {
      code: jo,
      desc: OX[jo]
    },
    tokenRequestEmptyError: {
      code: i2A,
      desc: OX[i2A]
    },
    logoutRequestEmptyError: {
      code: n2A,
      desc: OX[n2A]
    },
    invalidCodeChallengeMethod: {
      code: XPA,
      desc: OX[XPA]
    },
    invalidCodeChallengeParams: {
      code: a2A,
      desc: OX[a2A]
    },
    invalidCloudDiscoveryMetadata: {
      code: To,
      desc: OX[To]
    },
    invalidAuthorityMetadata: {
      code: o2A,
      desc: OX[o2A]
    },
    untrustedAuthority: {
      code: r2A,
      desc: OX[r2A]
    },
    missingSshJwk: {
      code: gm,
      desc: OX[gm]
    },
    missingSshKid: {
      code: IPA,
      desc: OX[IPA]
    },
    missingNonceAuthenticationHeader: {
      code: DPA,
      desc: OX[DPA]
    },
    invalidAuthenticationHeader: {
      code: WPA,
      desc: OX[WPA]
    },
    cannotSetOIDCOptions: {
      code: KPA,
      desc: OX[KPA]
    },
    cannotAllowPlatformBroker: {
      code: VPA,
      desc: OX[VPA]
    },
    authorityMismatch: {
      code: FPA,
      desc: OX[FPA]
    },
    invalidAuthorizePostBodyParameters: {
      code: EPA,
      desc: OX[EPA]
    },
    invalidRequestMethodForEAR: {
      code: HPA,
      desc: OX[HPA]
    }
  };
  RWA = class RWA extends n6 {
    constructor(A) {
      super(A, OX[A]);
      this.name = "ClientConfigurationError", Object.setPrototypeOf(this, RWA.prototype)
    }
  }
})
// @from(Ln 229587, Col 0)
class JY {
  static isEmptyObj(A) {
    if (A) try {
      let Q = JSON.parse(A);
      return Object.keys(Q).length === 0
    } catch (Q) {}
    return !0
  }
  static startsWith(A, Q) {
    return A.indexOf(Q) === 0
  }
  static endsWith(A, Q) {
    return A.length >= Q.length && A.lastIndexOf(Q) === A.length - Q.length
  }
  static queryStringToObject(A) {
    let Q = {},
      B = A.split("&"),
      G = (Z) => decodeURIComponent(Z.replace(/\+/g, " "));
    return B.forEach((Z) => {
      if (Z.trim()) {
        let [Y, J] = Z.split(/=(.+)/g, 2);
        if (Y && J) Q[G(Y)] = G(J)
      }
    }), Q
  }
  static trimArrayEntries(A) {
    return A.map((Q) => Q.trim())
  }
  static removeEmptyStringsFromArray(A) {
    return A.filter((Q) => {
      return !!Q
    })
  }
  static jsonParseHelper(A) {
    try {
      return JSON.parse(A)
    } catch (Q) {
      return null
    }
  }
  static matchPattern(A, Q) {
    return new RegExp(A.replace(/\\/g, "\\\\").replace(/\*/g, "[^ ]*").replace(/\?/g, "\\?")).test(Q)
  }
}
// @from(Ln 229631, Col 4)
So = w(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 229634, Col 0)
class aI {
  constructor(A) {
    let Q = A ? JY.trimArrayEntries([...A]) : [],
      B = Q ? JY.removeEmptyStringsFromArray(Q) : [];
    if (!B || !B.length) throw yZ(l2A);
    this.scopes = new Set, B.forEach((G) => this.scopes.add(G))
  }
  static fromString(A) {
    let B = (A || m0.EMPTY_STRING).split(" ");
    return new aI(B)
  }
  static createSearchScopes(A) {
    let Q = A && A.length > 0 ? A : [...yz],
      B = new aI(Q);
    if (!B.containsOnlyOIDCScopes()) B.removeOIDCScopes();
    else B.removeScope(m0.OFFLINE_ACCESS_SCOPE);
    return B
  }
  containsScope(A) {
    let Q = this.printScopesLowerCase().split(" "),
      B = new aI(Q);
    return A ? B.scopes.has(A.toLowerCase()) : !1
  }
  containsScopeSet(A) {
    if (!A || A.scopes.size <= 0) return !1;
    return this.scopes.size >= A.scopes.size && A.asArray().every((Q) => this.containsScope(Q))
  }
  containsOnlyOIDCScopes() {
    let A = 0;
    return M80.forEach((Q) => {
      if (this.containsScope(Q)) A += 1
    }), this.scopes.size === A
  }
  appendScope(A) {
    if (A) this.scopes.add(A.trim())
  }
  appendScopes(A) {
    try {
      A.forEach((Q) => this.appendScope(Q))
    } catch (Q) {
      throw YQ(b2A)
    }
  }
  removeScope(A) {
    if (!A) throw YQ(k2A);
    this.scopes.delete(A.trim())
  }
  removeOIDCScopes() {
    M80.forEach((A) => {
      this.scopes.delete(A)
    })
  }
  unionScopeSets(A) {
    if (!A) throw YQ(Mo);
    let Q = new Set;
    return A.scopes.forEach((B) => Q.add(B.toLowerCase())), this.scopes.forEach((B) => Q.add(B.toLowerCase())), Q
  }
  intersectingScopeSets(A) {
    if (!A) throw YQ(Mo);
    if (!A.containsOnlyOIDCScopes()) A.removeOIDCScopes();
    let Q = this.unionScopeSets(A),
      B = A.getScopeCount(),
      G = this.getScopeCount();
    return Q.size < G + B
  }
  getScopeCount() {
    return this.scopes.size
  }
  asArray() {
    let A = [];
    return this.scopes.forEach((Q) => A.push(Q)), A
  }
  printScopes() {
    if (this.scopes) return this.asArray().join(" ");
    return m0.EMPTY_STRING
  }
  printScopesLowerCase() {
    return this.printScopes().toLowerCase()
  }
}
// @from(Ln 229714, Col 4)
zPA = w(() => {
  Po();
  So();
  aW();
  lY();
  um();
  mD(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 229723, Col 0)
function _WA(A, Q) {
  if (!A) throw YQ(M2A);
  try {
    let B = Q(A);
    return JSON.parse(B)
  } catch (B) {
    throw YQ(wo)
  }
}
// @from(Ln 229733, Col 0)
function sk(A) {
  if (!A) throw YQ(wo);
  let Q = A.split(ym.CLIENT_INFO_SEPARATOR, 2);
  return {
    uid: Q[0],
    utid: Q.length < 2 ? m0.EMPTY_STRING : Q[1]
  }
}
// @from(Ln 229741, Col 4)
jWA = w(() => {
  aW();
  lY();
  mD(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 229747, Col 0)
function lcB(A, Q) {
  return !!A && !!Q && A === Q.split(".")[1]
}
// @from(Ln 229751, Col 0)
function $PA(A, Q, B, G) {
  if (G) {
    let {
      oid: Z,
      sub: Y,
      tid: J,
      name: X,
      tfp: I,
      acr: D,
      preferred_username: W,
      upn: K,
      login_hint: V
    } = G, F = J || I || D || "";
    return {
      tenantId: F,
      localAccountId: Z || Y || "",
      name: X,
      username: W || K || "",
      loginHint: V,
      isHomeTenant: lcB(F, A)
    }
  } else return {
    tenantId: B,
    localAccountId: Q,
    username: "",
    isHomeTenant: lcB(B, A)
  }
}
// @from(Ln 229780, Col 0)
function U31(A, Q, B, G) {
  let Z = A;
  if (Q) {
    let {
      isHomeTenant: Y,
      ...J
    } = Q;
    Z = {
      ...A,
      ...J
    }
  }
  if (B) {
    let {
      isHomeTenant: Y,
      ...J
    } = $PA(A.homeAccountId, A.localAccountId, A.tenantId, B);
    return Z = {
      ...Z,
      ...J,
      idTokenClaims: B,
      idToken: G
    }, Z
  }
  return Z
}
// @from(Ln 229806, Col 4)
q31 = w(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 229809, Col 4)
q_
// @from(Ln 229810, Col 4)
x80 = w(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */
  q_ = {
    Default: 0,
    Adfs: 1,
    Dsts: 2,
    Ciam: 3
  }
})
// @from(Ln 229820, Col 0)
function N31(A) {
  if (A) return A.tid || A.tfp || A.acr || null;
  return null
}
// @from(Ln 229824, Col 4)
y80 = w(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 229827, Col 4)
vz
// @from(Ln 229828, Col 4)
CPA = w(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */
  vz = {
    AAD: "AAD",
    OIDC: "OIDC",
    EAR: "EAR"
  }
})
// @from(Ln 229836, Col 0)
class oW {
  static getAccountInfo(A) {
    return {
      homeAccountId: A.homeAccountId,
      environment: A.environment,
      tenantId: A.realm,
      username: A.username,
      localAccountId: A.localAccountId,
      loginHint: A.loginHint,
      name: A.name,
      nativeAccountId: A.nativeAccountId,
      authorityType: A.authorityType,
      tenantProfiles: new Map((A.tenantProfiles || []).map((Q) => {
        return [Q.tenantId, Q]
      })),
      dataBoundary: A.dataBoundary
    }
  }
  isSingleTenant() {
    return !this.tenantProfiles
  }
  static createAccount(A, Q, B) {
    let G = new oW;
    if (Q.authorityType === q_.Adfs) G.authorityType = L2A.ADFS_ACCOUNT_TYPE;
    else if (Q.protocolMode === vz.OIDC) G.authorityType = L2A.GENERIC_ACCOUNT_TYPE;
    else G.authorityType = L2A.MSSTS_ACCOUNT_TYPE;
    let Z;
    if (A.clientInfo && B) {
      if (Z = _WA(A.clientInfo, B), Z.xms_tdbr) G.dataBoundary = Z.xms_tdbr === "EU" ? "EU" : "None"
    }
    G.clientInfo = A.clientInfo, G.homeAccountId = A.homeAccountId, G.nativeAccountId = A.nativeAccountId;
    let Y = A.environment || Q && Q.getPreferredCache();
    if (!Y) throw YQ(bm);
    G.environment = Y, G.realm = Z?.utid || N31(A.idTokenClaims) || "", G.localAccountId = Z?.uid || A.idTokenClaims?.oid || A.idTokenClaims?.sub || "";
    let J = A.idTokenClaims?.preferred_username || A.idTokenClaims?.upn,
      X = A.idTokenClaims?.emails ? A.idTokenClaims.emails[0] : null;
    if (G.username = J || X || "", G.loginHint = A.idTokenClaims?.login_hint, G.name = A.idTokenClaims?.name || "", G.cloudGraphHostName = A.cloudGraphHostName, G.msGraphHost = A.msGraphHost, A.tenantProfiles) G.tenantProfiles = A.tenantProfiles;
    else {
      let I = $PA(A.homeAccountId, G.localAccountId, G.realm, A.idTokenClaims);
      G.tenantProfiles = [I]
    }
    return G
  }
  static createFromAccountInfo(A, Q, B) {
    let G = new oW;
    return G.authorityType = A.authorityType || L2A.GENERIC_ACCOUNT_TYPE, G.homeAccountId = A.homeAccountId, G.localAccountId = A.localAccountId, G.nativeAccountId = A.nativeAccountId, G.realm = A.tenantId, G.environment = A.environment, G.username = A.username, G.name = A.name, G.loginHint = A.loginHint, G.cloudGraphHostName = Q, G.msGraphHost = B, G.tenantProfiles = Array.from(A.tenantProfiles?.values() || []), G.dataBoundary = A.dataBoundary, G
  }
  static generateHomeAccountId(A, Q, B, G, Z) {
    if (!(Q === q_.Adfs || Q === q_.Dsts)) {
      if (A) try {
        let Y = _WA(A, G.base64Decode);
        if (Y.uid && Y.utid) return `${Y.uid}.${Y.utid}`
      } catch (Y) {}
      B.warning("No client info in response")
    }
    return Z?.sub || ""
  }
  static isAccountEntity(A) {
    if (!A) return !1;
    return A.hasOwnProperty("homeAccountId") && A.hasOwnProperty("environment") && A.hasOwnProperty("realm") && A.hasOwnProperty("localAccountId") && A.hasOwnProperty("username") && A.hasOwnProperty("authorityType")
  }
  static accountInfoIsEqual(A, Q, B) {
    if (!A || !Q) return !1;
    let G = !0;
    if (B) {
      let Z = A.idTokenClaims || {},
        Y = Q.idTokenClaims || {};
      G = Z.iat === Y.iat && Z.nonce === Y.nonce
    }
    return A.homeAccountId === Q.homeAccountId && A.localAccountId === Q.localAccountId && A.username === Q.username && A.tenantId === Q.tenantId && A.loginHint === Q.loginHint && A.environment === Q.environment && A.nativeAccountId === Q.nativeAccountId && G
  }
}
// @from(Ln 229908, Col 4)
w31 = w(() => {
  lY();
  jWA();
  q31();
  aW();
  x80();
  y80();
  CPA();
  mD(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 229918, Col 4)
L31 = {}
// @from(Ln 229926, Col 0)
function mm(A, Q) {
  let B = icB(A);
  try {
    let G = Q(B);
    return JSON.parse(G)
  } catch (G) {
    throw YQ(Lo)
  }
}
// @from(Ln 229936, Col 0)
function v80(A) {
  if (!A.signin_state) return !1;
  let Q = ["kmsi", "dvc_dmjd"];
  return A.signin_state.some((G) => Q.includes(G.trim().toLowerCase()))
}
// @from(Ln 229942, Col 0)
function icB(A) {
  if (!A) throw YQ(R2A);
  let B = /^([^\.\s]*)\.([^\.\s]+)\.([^\.\s]*)$/.exec(A);
  if (!B || B.length < 4) throw YQ(Lo);
  return B[2]
}
// @from(Ln 229949, Col 0)
function UPA(A, Q) {
  if (Q === 0 || Date.now() - 300000 > A + Q) throw YQ(x2A)
}
// @from(Ln 229952, Col 4)
TWA = w(() => {
  aW();
  mD(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 229956, Col 4)
oH = {}
// @from(Ln 229964, Col 0)
function ncB(A) {
  if (!A) return A;
  let Q = A.toLowerCase();
  if (JY.endsWith(Q, "?")) Q = Q.slice(0, -1);
  else if (JY.endsWith(Q, "?/")) Q = Q.slice(0, -2);
  if (!JY.endsWith(Q, "/")) Q += "/";
  return Q
}
// @from(Ln 229973, Col 0)
function acB(A) {
  if (A.startsWith("#/")) return A.substring(2);
  else if (A.startsWith("#") || A.startsWith("?")) return A.substring(1);
  return A
}
// @from(Ln 229979, Col 0)
function k80(A) {
  if (!A || A.indexOf("=") < 0) return null;
  try {
    let Q = acB(A),
      B = Object.fromEntries(new URLSearchParams(Q));
    if (B.code || B.ear_jwe || B.error || B.error_description || B.state) return B
  } catch (Q) {
    throw YQ(T2A)
  }
  return null
}
// @from(Ln 229991, Col 0)
function tk(A, Q = !0, B) {
  let G = [];
  return A.forEach((Z, Y) => {
    if (!Q && B && Y in B) G.push(`${Y}=${Z}`);
    else G.push(`${Y}=${encodeURIComponent(Z)}`)
  }), G.join("&")
}
// @from(Ln 229999, Col 0)
function Hf8(A) {
  if (!A) return A;
  let Q = A.split("#")[0];
  try {
    let B = new URL(Q),
      G = B.origin + B.pathname + B.search;
    return ncB(G)
  } catch (B) {
    return ncB(Q)
  }
}
// @from(Ln 230010, Col 4)
s2A = w(() => {
  aW();
  So();
  mD(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 230015, Col 0)
class U3 {
  get urlString() {
    return this._urlString
  }
  constructor(A) {
    if (this._urlString = A, !this._urlString) throw yZ(p2A);
    if (!A.includes("#")) this._urlString = U3.canonicalizeUri(A)
  }
  static canonicalizeUri(A) {
    if (A) {
      let Q = A.toLowerCase();
      if (JY.endsWith(Q, "?")) Q = Q.slice(0, -1);
      else if (JY.endsWith(Q, "?/")) Q = Q.slice(0, -2);
      if (!JY.endsWith(Q, "/")) Q += "/";
      return Q
    }
    return A
  }
  validateAsUri() {
    let A;
    try {
      A = this.getUrlComponents()
    } catch (Q) {
      throw yZ(rk)
    }
    if (!A.HostNameAndPort || !A.PathSegments) throw yZ(rk);
    if (!A.Protocol || A.Protocol.toLowerCase() !== "https:") throw yZ(c2A)
  }
  static appendQueryString(A, Q) {
    if (!Q) return A;
    return A.indexOf("?") < 0 ? `${A}?${Q}` : `${A}&${Q}`
  }
  static removeHashFromUrl(A) {
    return U3.canonicalizeUri(A.split("#")[0])
  }
  replaceTenantPath(A) {
    let Q = this.getUrlComponents(),
      B = Q.PathSegments;
    if (A && B.length !== 0 && (B[0] === KN.COMMON || B[0] === KN.ORGANIZATIONS)) B[0] = A;
    return U3.constructAuthorityUriFromObject(Q)
  }
  getUrlComponents() {
    let A = RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?"),
      Q = this.urlString.match(A);
    if (!Q) throw yZ(rk);
    let B = {
        Protocol: Q[1],
        HostNameAndPort: Q[4],
        AbsolutePath: Q[5],
        QueryString: Q[7]
      },
      G = B.AbsolutePath.split("/");
    if (G = G.filter((Z) => Z && Z.length > 0), B.PathSegments = G, B.QueryString && B.QueryString.endsWith("/")) B.QueryString = B.QueryString.substring(0, B.QueryString.length - 1);
    return B
  }
  static getDomainFromUrl(A) {
    let Q = RegExp("^([^:/?#]+://)?([^/?#]*)"),
      B = A.match(Q);
    if (!B) throw yZ(rk);
    return B[2]
  }
  static getAbsoluteUrl(A, Q) {
    if (A[0] === m0.FORWARD_SLASH) {
      let G = new U3(Q).getUrlComponents();
      return G.Protocol + "//" + G.HostNameAndPort + A
    }
    return A
  }
  static constructAuthorityUriFromObject(A) {
    return new U3(A.Protocol + "//" + A.HostNameAndPort + "/" + A.PathSegments.join("/"))
  }
  static hashContainsKnownProperties(A) {
    return !!k80(A)
  }
}
// @from(Ln 230090, Col 4)
xo = w(() => {
  Po();
  So();
  lY();
  s2A();
  um(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 230098, Col 0)
function scB(A, Q) {
  let B, G = A.canonicalAuthority;
  if (G) {
    let Z = new U3(G).getUrlComponents().HostNameAndPort;
    B = ocB(Z, A.cloudDiscoveryMetadata?.metadata, jC.CONFIG, Q) || ocB(Z, f80.metadata, jC.HARDCODED_VALUES, Q) || A.knownAuthorities
  }
  return B || []
}
// @from(Ln 230107, Col 0)
function ocB(A, Q, B, G) {
  if (G?.trace(`getAliasesFromMetadata called with source: ${B}`), A && Q) {
    let Z = qPA(Q, A);
    if (Z) return G?.trace(`getAliasesFromMetadata: found cloud discovery metadata in ${B}, returning aliases`), Z.aliases;
    else G?.trace(`getAliasesFromMetadata: did not find cloud discovery metadata in ${B}`)
  }
  return null
}