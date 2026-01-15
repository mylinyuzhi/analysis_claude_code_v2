
// @from(Ln 193654, Col 54)
Z20 = async (A, Q, B) => {
    if (B === void 0) return;
    if (B == null) throw TypeError(`Received null for "${Q}"; to pass null in FormData, you must use the string 'null'`);
    if (typeof B === "string" || typeof B === "number" || typeof B === "boolean") A.append(Q, String(B));
    else if (B instanceof Response) {
      let G = {},
        Z = B.headers.get("Content-Type");
      if (Z) G = {
        type: Z
      };
      A.append(Q, Z2A([await B.blob()], NjA(B), G))
    } else if (J20(B)) A.append(Q, Z2A([await new Response(AB1(B)).blob()], NjA(B)));
    else if (Pz8(B)) A.append(Q, Z2A([B], NjA(B), {
      type: B.type
    }));
    else if (Array.isArray(B)) await Promise.all(B.map((G) => Z20(A, Q + "[]", G)));
    else if (typeof B === "object") await Promise.all(Object.entries(B).map(([G, Z]) => Z20(A, `${Q}[${G}]`, Z)));
    else throw TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${B} instead`)
  }
// @from(Ln 193673, Col 4)
CDA = w(() => {
  pRB = new WeakMap
})
// @from(Ln 193676, Col 0)
async function M91(A, Q, B) {
  if (Y20(), A = await A, Q || (Q = NjA(A)), Sz8(A)) {
    if (A instanceof File && Q == null && B == null) return A;
    return Z2A([await A.arrayBuffer()], Q ?? A.name, {
      type: A.type,
      lastModified: A.lastModified,
      ...B
    })
  }
  if (xz8(A)) {
    let Z = await A.blob();
    return Q || (Q = new URL(A.url).pathname.split(/[\\/]/).pop()), Z2A(await X20(Z), Q, B)
  }
  let G = await X20(A);
  if (!B?.type) {
    let Z = G.find((Y) => typeof Y === "object" && ("type" in Y) && Y.type);
    if (typeof Z === "string") B = {
      ...B,
      type: Z
    }
  }
  return Z2A(G, Q, B)
}
// @from(Ln 193699, Col 0)
async function X20(A) {
  let Q = [];
  if (typeof A === "string" || ArrayBuffer.isView(A) || A instanceof ArrayBuffer) Q.push(A);
  else if (lRB(A)) Q.push(A instanceof Blob ? A : await A.arrayBuffer());
  else if (J20(A))
    for await (let B of A) Q.push(...await X20(B));
  else {
    let B = A?.constructor?.name;
    throw Error(`Unexpected data type: ${typeof A}${B?`; constructor: ${B}`:""}${yz8(A)}`)
  }
  return Q
}
// @from(Ln 193712, Col 0)
function yz8(A) {
  if (typeof A !== "object" || A === null) return "";
  return `; props: [${Object.getOwnPropertyNames(A).map((B)=>`"${B}"`).join(", ")}]`
}
// @from(Ln 193716, Col 4)
lRB = (A) => A != null && typeof A === "object" && typeof A.size === "number" && typeof A.type === "string" && typeof A.text === "function" && typeof A.slice === "function" && typeof A.arrayBuffer === "function"
// @from(Ln 193717, Col 2)
Sz8 = (A) => A != null && typeof A === "object" && typeof A.name === "string" && typeof A.lastModified === "number" && lRB(A)
// @from(Ln 193718, Col 2)
xz8 = (A) => A != null && typeof A === "object" && typeof A.url === "string" && typeof A.blob === "function"
// @from(Ln 193719, Col 4)
iRB = w(() => {
  CDA();
  CDA()
})
// @from(Ln 193723, Col 4)
I20 = w(() => {
  iRB()
})
// @from(Ln 193726, Col 4)
nRB = () => {}
// @from(Ln 193727, Col 0)
class WI {
  constructor(A) {
    this._client = A
  }
}
// @from(Ln 193733, Col 0)
function* kz8(A) {
  if (!A) return;
  if (aRB in A) {
    let {
      values: G,
      nulls: Z
    } = A;
    yield* G.entries();
    for (let Y of Z) yield [Y, null];
    return
  }
  let Q = !1,
    B;
  if (A instanceof Headers) B = A.entries();
  else if (x10(A)) B = A;
  else Q = !0, B = Object.entries(A ?? {});
  for (let G of B) {
    let Z = G[0];
    if (typeof Z !== "string") throw TypeError("expected header name to be a string");
    let Y = x10(G[1]) ? G[1] : [G[1]],
      J = !1;
    for (let X of Y) {
      if (X === void 0) continue;
      if (Q && !J) J = !0, yield [Z, null];
      yield [Z, X]
    }
  }
}
// @from(Ln 193761, Col 4)
aRB
// @from(Ln 193761, Col 9)
l6 = (A) => {
  let Q = new Headers,
    B = new Set;
  for (let G of A) {
    let Z = new Set;
    for (let [Y, J] of kz8(G)) {
      let X = Y.toLowerCase();
      if (!Z.has(X)) Q.delete(Y), Z.add(X);
      if (J === null) Q.delete(Y), B.add(X);
      else Q.append(Y, J), B.delete(X)
    }
  }
  return {
    [aRB]: !0,
    values: Q,
    nulls: B
  }
}
// @from(Ln 193779, Col 4)
J_ = w(() => {
  LBA();
  aRB = Symbol.for("brand.privateNullableHeaders")
})
// @from(Ln 193784, Col 0)
function rRB(A) {
  return A.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent)
}
// @from(Ln 193787, Col 4)
oRB
// @from(Ln 193787, Col 9)
bz8 = (A = rRB) => function (B, ...G) {
    if (B.length === 1) return B[0];
    let Z = !1,
      Y = [],
      J = B.reduce((W, K, V) => {
        if (/[?#]/.test(K)) Z = !0;
        let F = G[V],
          H = (Z ? encodeURIComponent : A)("" + F);
        if (V !== G.length && (F == null || typeof F === "object" && F.toString === Object.getPrototypeOf(Object.getPrototypeOf(F.hasOwnProperty ?? oRB) ?? oRB)?.toString)) H = F + "", Y.push({
          start: W.length + K.length,
          length: H.length,
          error: `Value of type ${Object.prototype.toString.call(F).slice(8,-1)} is not a valid path parameter`
        });
        return W + K + (V === G.length ? "" : H)
      }, ""),
      X = J.split(/[?#]/, 1)[0],
      I = /(?<=^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi,
      D;
    while ((D = I.exec(X)) !== null) Y.push({
      start: D.index,
      length: D[0].length,
      error: `Value "${D[0]}" can't be safely passed as a path parameter`
    });
    if (Y.sort((W, K) => W.start - K.start), Y.length > 0) {
      let W = 0,
        K = Y.reduce((V, F) => {
          let H = " ".repeat(F.start - W),
            E = "^".repeat(F.length);
          return W = F.start + F.length, V + H + E
        }, "");
      throw new M2(`Path parameters result in path with invalid segments:
${Y.map((V)=>V.error).join(`
`)}
${J}
${K}`)
    }
    return J
  }
// @from(Ln 193825, Col 2)
wX
// @from(Ln 193826, Col 4)
na = w(() => {
  $C();
  oRB = Object.freeze(Object.create(null)), wX = bz8(rRB)
})
// @from(Ln 193830, Col 4)
wjA
// @from(Ln 193831, Col 4)
D20 = w(() => {
  yk();
  J_();
  CDA();
  na();
  wjA = class wjA extends WI {
    list(A = {}, Q) {
      let {
        betas: B,
        ...G
      } = A ?? {};
      return this._client.getAPIList("/v1/files", bP, {
        query: G,
        ...Q,
        headers: l6([{
          "anthropic-beta": [...B ?? [], "files-api-2025-04-14"].toString()
        }, Q?.headers])
      })
    }
    delete(A, Q = {}, B) {
      let {
        betas: G
      } = Q ?? {};
      return this._client.delete(wX`/v1/files/${A}`, {
        ...B,
        headers: l6([{
          "anthropic-beta": [...G ?? [], "files-api-2025-04-14"].toString()
        }, B?.headers])
      })
    }
    download(A, Q = {}, B) {
      let {
        betas: G
      } = Q ?? {};
      return this._client.get(wX`/v1/files/${A}/content`, {
        ...B,
        headers: l6([{
          "anthropic-beta": [...G ?? [], "files-api-2025-04-14"].toString(),
          Accept: "application/binary"
        }, B?.headers]),
        __binaryResponse: !0
      })
    }
    retrieveMetadata(A, Q = {}, B) {
      let {
        betas: G
      } = Q ?? {};
      return this._client.get(wX`/v1/files/${A}`, {
        ...B,
        headers: l6([{
          "anthropic-beta": [...G ?? [], "files-api-2025-04-14"].toString()
        }, B?.headers])
      })
    }
    upload(A, Q) {
      let {
        betas: B,
        ...G
      } = A;
      return this._client.post("/v1/files", $DA({
        body: G,
        ...Q,
        headers: l6([{
          "anthropic-beta": [...B ?? [], "files-api-2025-04-14"].toString()
        }, Q?.headers])
      }, this._client))
    }
  }
})
// @from(Ln 193900, Col 4)
LjA
// @from(Ln 193901, Col 4)
W20 = w(() => {
  yk();
  J_();
  na();
  LjA = class LjA extends WI {
    retrieve(A, Q = {}, B) {
      let {
        betas: G
      } = Q ?? {};
      return this._client.get(wX`/v1/models/${A}?beta=true`, {
        ...B,
        headers: l6([{
          ...G?.toString() != null ? {
            "anthropic-beta": G?.toString()
          } : void 0
        }, B?.headers])
      })
    }
    list(A = {}, Q) {
      let {
        betas: B,
        ...G
      } = A ?? {};
      return this._client.getAPIList("/v1/models?beta=true", bP, {
        query: G,
        ...Q,
        headers: l6([{
          ...B?.toString() != null ? {
            "anthropic-beta": B?.toString()
          } : void 0
        }, Q?.headers])
      })
    }
  }
})
// @from(Ln 193936, Col 4)
R91
// @from(Ln 193937, Col 4)
K20 = w(() => {
  R91 = {
    "claude-opus-4-20250514": 8192,
    "claude-opus-4-0": 8192,
    "claude-4-opus-20250514": 8192,
    "anthropic.claude-opus-4-20250514-v1:0": 8192,
    "claude-opus-4@20250514": 8192,
    "claude-opus-4-1-20250805": 8192,
    "anthropic.claude-opus-4-1-20250805-v1:0": 8192,
    "claude-opus-4-1@20250805": 8192
  }
})
// @from(Ln 193950, Col 0)
function sRB() {
  let A, Q;
  return {
    promise: new Promise((G, Z) => {
      A = G, Q = Z
    }),
    resolve: A,
    reject: Q
  }
}
// @from(Ln 193960, Col 0)
async function gz8(A, Q = A.messages.at(-1)) {
  if (!Q || Q.role !== "assistant" || !Q.content || typeof Q.content === "string") return null;
  let B = Q.content.filter((Z) => Z.type === "tool_use");
  if (B.length === 0) return null;
  return {
    role: "user",
    content: await Promise.all(B.map(async (Z) => {
      let Y = A.tools.find((J) => J.name === Z.name);
      if (!Y || !("run" in Y)) return {
        type: "tool_result",
        tool_use_id: Z.id,
        content: `Error: Tool '${Z.name}' not found`,
        is_error: !0
      };
      try {
        let J = Z.input;
        if ("parse" in Y && Y.parse) J = Y.parse(J);
        let X = await Y.run(J);
        return {
          type: "tool_result",
          tool_use_id: Z.id,
          content: X
        }
      } catch (J) {
        return {
          type: "tool_result",
          tool_use_id: Z.id,
          content: `Error: ${J instanceof Error?J.message:String(J)}`,
          is_error: !0
        }
      }
    }))
  }
}
// @from(Ln 193994, Col 4)
_91
// @from(Ln 193994, Col 9)
UDA
// @from(Ln 193994, Col 14)
Y2A
// @from(Ln 193994, Col 19)
YN
// @from(Ln 193994, Col 23)
OjA
// @from(Ln 193994, Col 28)
fP
// @from(Ln 193994, Col 32)
Em
// @from(Ln 193994, Col 36)
aa
// @from(Ln 193994, Col 40)
MjA
// @from(Ln 193994, Col 45)
V20
// @from(Ln 193994, Col 50)
RjA
// @from(Ln 193995, Col 4)
F20 = w(() => {
  tu();
  $C();
  J_();
  RjA = class RjA {
    constructor(A, Q, B) {
      _91.add(this), this.client = A, UDA.set(this, !1), Y2A.set(this, !1), YN.set(this, void 0), OjA.set(this, void 0), fP.set(this, void 0), Em.set(this, void 0), aa.set(this, void 0), MjA.set(this, 0), j2(this, YN, {
        params: {
          ...Q,
          messages: structuredClone(Q.messages)
        }
      }, "f"), j2(this, OjA, {
        ...B,
        headers: l6([{
          "x-stainless-helper": "BetaToolRunner"
        }, B?.headers])
      }, "f"), j2(this, aa, sRB(), "f")
    }
    async * [(UDA = new WeakMap, Y2A = new WeakMap, YN = new WeakMap, OjA = new WeakMap, fP = new WeakMap, Em = new WeakMap, aa = new WeakMap, MjA = new WeakMap, _91 = new WeakSet, Symbol.asyncIterator)]() {
      var A;
      if (u0(this, UDA, "f")) throw new M2("Cannot iterate over a consumed stream");
      j2(this, UDA, !0, "f"), j2(this, Y2A, !0, "f"), j2(this, Em, void 0, "f");
      try {
        while (!0) {
          let Q;
          try {
            if (u0(this, YN, "f").params.max_iterations && u0(this, MjA, "f") >= u0(this, YN, "f").params.max_iterations) break;
            j2(this, Y2A, !1, "f"), j2(this, fP, void 0, "f"), j2(this, Em, void 0, "f"), j2(this, MjA, (A = u0(this, MjA, "f"), A++, A), "f");
            let {
              max_iterations: B,
              ...G
            } = u0(this, YN, "f").params;
            if (G.stream) Q = this.client.beta.messages.stream({
              ...G
            }, u0(this, OjA, "f")), j2(this, fP, Q.finalMessage(), "f"), u0(this, fP, "f").catch(() => {}), yield Q;
            else j2(this, fP, this.client.beta.messages.create({
              ...G,
              stream: !1
            }, u0(this, OjA, "f")), "f"), yield u0(this, fP, "f");
            if (!u0(this, Y2A, "f")) {
              let {
                role: Y,
                content: J
              } = await u0(this, fP, "f");
              u0(this, YN, "f").params.messages.push({
                role: Y,
                content: J
              })
            }
            let Z = await u0(this, _91, "m", V20).call(this, u0(this, YN, "f").params.messages.at(-1));
            if (Z) u0(this, YN, "f").params.messages.push(Z);
            if (!Z && !u0(this, Y2A, "f")) break
          } finally {
            if (Q) Q.abort()
          }
        }
        if (!u0(this, fP, "f")) throw new M2("ToolRunner concluded without a message from the server");
        u0(this, aa, "f").resolve(await u0(this, fP, "f"))
      } catch (Q) {
        throw j2(this, UDA, !1, "f"), u0(this, aa, "f").promise.catch(() => {}), u0(this, aa, "f").reject(Q), j2(this, aa, sRB(), "f"), Q
      }
    }
    setMessagesParams(A) {
      if (typeof A === "function") u0(this, YN, "f").params = A(u0(this, YN, "f").params);
      else u0(this, YN, "f").params = A;
      j2(this, Y2A, !0, "f"), j2(this, Em, void 0, "f")
    }
    async generateToolResponse() {
      let A = await u0(this, fP, "f") ?? this.params.messages.at(-1);
      if (!A) return null;
      return u0(this, _91, "m", V20).call(this, A)
    }
    done() {
      return u0(this, aa, "f").promise
    }
    async runUntilDone() {
      if (!u0(this, UDA, "f"))
        for await (let A of this);
      return this.done()
    }
    get params() {
      return u0(this, YN, "f").params
    }
    pushMessages(...A) {
      this.setMessagesParams((Q) => ({
        ...Q,
        messages: [...Q.messages, ...A]
      }))
    }
    then(A, Q) {
      return this.runUntilDone().then(A, Q)
    }
  };
  V20 = async function (Q) {
    if (u0(this, Em, "f") !== void 0) return u0(this, Em, "f");
    return j2(this, Em, gz8(u0(this, YN, "f").params, Q), "f"), u0(this, Em, "f")
  }
})
// @from(Ln 194093, Col 4)
qDA
// @from(Ln 194094, Col 4)
H20 = w(() => {
  $C();
  P10();
  qDA = class qDA {
    constructor(A, Q) {
      this.iterator = A, this.controller = Q
    }
    async * decoder() {
      let A = new Na;
      for await (let Q of this.iterator) for (let B of A.decode(Q)) yield JSON.parse(B);
      for (let Q of A.flush()) yield JSON.parse(Q)
    } [Symbol.asyncIterator]() {
      return this.decoder()
    }
    static fromResponse(A, Q) {
      if (!A.body) {
        if (Q.abort(), typeof globalThis.navigator < "u" && globalThis.navigator.product === "ReactNative") throw new M2("The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api");
        throw new M2("Attempted to iterate over a response with no body")
      }
      return new qDA(Z_A(A.body), Q)
    }
  }
})
// @from(Ln 194117, Col 4)
_jA
// @from(Ln 194118, Col 4)
E20 = w(() => {
  yk();
  J_();
  H20();
  wBA();
  na();
  _jA = class _jA extends WI {
    create(A, Q) {
      let {
        betas: B,
        ...G
      } = A;
      return this._client.post("/v1/messages/batches?beta=true", {
        body: G,
        ...Q,
        headers: l6([{
          "anthropic-beta": [...B ?? [], "message-batches-2024-09-24"].toString()
        }, Q?.headers])
      })
    }
    retrieve(A, Q = {}, B) {
      let {
        betas: G
      } = Q ?? {};
      return this._client.get(wX`/v1/messages/batches/${A}?beta=true`, {
        ...B,
        headers: l6([{
          "anthropic-beta": [...G ?? [], "message-batches-2024-09-24"].toString()
        }, B?.headers])
      })
    }
    list(A = {}, Q) {
      let {
        betas: B,
        ...G
      } = A ?? {};
      return this._client.getAPIList("/v1/messages/batches?beta=true", bP, {
        query: G,
        ...Q,
        headers: l6([{
          "anthropic-beta": [...B ?? [], "message-batches-2024-09-24"].toString()
        }, Q?.headers])
      })
    }
    delete(A, Q = {}, B) {
      let {
        betas: G
      } = Q ?? {};
      return this._client.delete(wX`/v1/messages/batches/${A}?beta=true`, {
        ...B,
        headers: l6([{
          "anthropic-beta": [...G ?? [], "message-batches-2024-09-24"].toString()
        }, B?.headers])
      })
    }
    cancel(A, Q = {}, B) {
      let {
        betas: G
      } = Q ?? {};
      return this._client.post(wX`/v1/messages/batches/${A}/cancel?beta=true`, {
        ...B,
        headers: l6([{
          "anthropic-beta": [...G ?? [], "message-batches-2024-09-24"].toString()
        }, B?.headers])
      })
    }
    async results(A, Q = {}, B) {
      let G = await this.retrieve(A);
      if (!G.results_url) throw new M2(`No batch \`results_url\`; Has it finished processing? ${G.processing_status} - ${G.id}`);
      let {
        betas: Z
      } = Q ?? {};
      return this._client.get(G.results_url, {
        ...B,
        headers: l6([{
          "anthropic-beta": [...Z ?? [], "message-batches-2024-09-24"].toString(),
          Accept: "application/binary"
        }, B?.headers]),
        stream: !0,
        __binaryResponse: !0
      })._thenUnwrap((Y, J) => qDA.fromResponse(J.response, J.controller))
    }
  }
})
// @from(Ln 194202, Col 4)
tRB
// @from(Ln 194202, Col 9)
J2A
// @from(Ln 194203, Col 4)
z20 = w(() => {
  K20();
  J_();
  f10();
  d10();
  F20();
  E20();
  E20();
  F20();
  tRB = {
    "claude-1.3": "November 6th, 2024",
    "claude-1.3-100k": "November 6th, 2024",
    "claude-instant-1.1": "November 6th, 2024",
    "claude-instant-1.1-100k": "November 6th, 2024",
    "claude-instant-1.2": "November 6th, 2024",
    "claude-3-sonnet-20240229": "July 21st, 2025",
    "claude-3-opus-20240229": "January 5th, 2026",
    "claude-2.1": "July 21st, 2025",
    "claude-2.0": "July 21st, 2025",
    "claude-3-7-sonnet-latest": "February 19th, 2026",
    "claude-3-7-sonnet-20250219": "February 19th, 2026"
  };
  J2A = class J2A extends WI {
    constructor() {
      super(...arguments);
      this.batches = new _jA(this._client)
    }
    create(A, Q) {
      let {
        betas: B,
        ...G
      } = A;
      if (G.model in tRB) console.warn(`The model '${G.model}' is deprecated and will reach end-of-life on ${tRB[G.model]}
Please migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`);
      let Z = this._client._options.timeout;
      if (!G.stream && Z == null) {
        let Y = R91[G.model] ?? void 0;
        Z = this._client.calculateNonstreamingTimeout(G.max_tokens, Y)
      }
      return this._client.post("/v1/messages?beta=true", {
        body: G,
        timeout: Z ?? 600000,
        ...Q,
        headers: l6([{
          ...B?.toString() != null ? {
            "anthropic-beta": B?.toString()
          } : void 0
        }, Q?.headers]),
        stream: A.stream ?? !1
      })
    }
    parse(A, Q) {
      return Q = {
        ...Q,
        headers: l6([{
          "anthropic-beta": [...A.betas ?? [], "structured-outputs-2025-09-17"].toString()
        }, Q?.headers])
      }, this.create(A, Q).then((B) => b10(B, A))
    }
    stream(A, Q) {
      return OBA.createMessage(this, A, Q)
    }
    countTokens(A, Q) {
      let {
        betas: B,
        ...G
      } = A;
      return this._client.post("/v1/messages/count_tokens?beta=true", {
        body: G,
        ...Q,
        headers: l6([{
          "anthropic-beta": [...B ?? [], "token-counting-2024-11-01"].toString()
        }, Q?.headers])
      })
    }
    toolRunner(A, Q) {
      return new RjA(this._client, A, Q)
    }
  };
  J2A.Batches = _jA;
  J2A.BetaToolRunner = RjA
})
// @from(Ln 194285, Col 4)
jjA
// @from(Ln 194286, Col 4)
$20 = w(() => {
  yk();
  J_();
  CDA();
  na();
  jjA = class jjA extends WI {
    create(A, Q = {}, B) {
      let {
        betas: G,
        ...Z
      } = Q ?? {};
      return this._client.post(wX`/v1/skills/${A}/versions?beta=true`, $DA({
        body: Z,
        ...B,
        headers: l6([{
          "anthropic-beta": [...G ?? [], "skills-2025-10-02"].toString()
        }, B?.headers])
      }, this._client))
    }
    retrieve(A, Q, B) {
      let {
        skill_id: G,
        betas: Z
      } = Q;
      return this._client.get(wX`/v1/skills/${G}/versions/${A}?beta=true`, {
        ...B,
        headers: l6([{
          "anthropic-beta": [...Z ?? [], "skills-2025-10-02"].toString()
        }, B?.headers])
      })
    }
    list(A, Q = {}, B) {
      let {
        betas: G,
        ...Z
      } = Q ?? {};
      return this._client.getAPIList(wX`/v1/skills/${A}/versions?beta=true`, qjA, {
        query: Z,
        ...B,
        headers: l6([{
          "anthropic-beta": [...G ?? [], "skills-2025-10-02"].toString()
        }, B?.headers])
      })
    }
    delete(A, Q, B) {
      let {
        skill_id: G,
        betas: Z
      } = Q;
      return this._client.delete(wX`/v1/skills/${G}/versions/${A}?beta=true`, {
        ...B,
        headers: l6([{
          "anthropic-beta": [...Z ?? [], "skills-2025-10-02"].toString()
        }, B?.headers])
      })
    }
  }
})
// @from(Ln 194344, Col 4)
NDA
// @from(Ln 194345, Col 4)
C20 = w(() => {
  $20();
  $20();
  yk();
  J_();
  CDA();
  na();
  NDA = class NDA extends WI {
    constructor() {
      super(...arguments);
      this.versions = new jjA(this._client)
    }
    create(A = {}, Q) {
      let {
        betas: B,
        ...G
      } = A ?? {};
      return this._client.post("/v1/skills?beta=true", $DA({
        body: G,
        ...Q,
        headers: l6([{
          "anthropic-beta": [...B ?? [], "skills-2025-10-02"].toString()
        }, Q?.headers])
      }, this._client))
    }
    retrieve(A, Q = {}, B) {
      let {
        betas: G
      } = Q ?? {};
      return this._client.get(wX`/v1/skills/${A}?beta=true`, {
        ...B,
        headers: l6([{
          "anthropic-beta": [...G ?? [], "skills-2025-10-02"].toString()
        }, B?.headers])
      })
    }
    list(A = {}, Q) {
      let {
        betas: B,
        ...G
      } = A ?? {};
      return this._client.getAPIList("/v1/skills?beta=true", qjA, {
        query: G,
        ...Q,
        headers: l6([{
          "anthropic-beta": [...B ?? [], "skills-2025-10-02"].toString()
        }, Q?.headers])
      })
    }
    delete(A, Q = {}, B) {
      let {
        betas: G
      } = Q ?? {};
      return this._client.delete(wX`/v1/skills/${A}?beta=true`, {
        ...B,
        headers: l6([{
          "anthropic-beta": [...G ?? [], "skills-2025-10-02"].toString()
        }, B?.headers])
      })
    }
  };
  NDA.Versions = jjA
})
// @from(Ln 194408, Col 4)
Pz
// @from(Ln 194409, Col 4)
U20 = w(() => {
  D20();
  D20();
  W20();
  W20();
  z20();
  z20();
  C20();
  C20();
  Pz = class Pz extends WI {
    constructor() {
      super(...arguments);
      this.models = new LjA(this._client), this.messages = new J2A(this._client), this.files = new wjA(this._client), this.skills = new NDA(this._client)
    }
  };
  Pz.Models = LjA;
  Pz.Messages = J2A;
  Pz.Files = wjA;
  Pz.Skills = NDA
})
// @from(Ln 194429, Col 4)
oa
// @from(Ln 194430, Col 4)
q20 = w(() => {
  J_();
  oa = class oa extends WI {
    create(A, Q) {
      let {
        betas: B,
        ...G
      } = A;
      return this._client.post("/v1/complete", {
        body: G,
        timeout: this._client._options.timeout ?? 600000,
        ...Q,
        headers: l6([{
          ...B?.toString() != null ? {
            "anthropic-beta": B?.toString()
          } : void 0
        }, Q?.headers]),
        stream: A.stream ?? !1
      })
    }
  }
})
// @from(Ln 194453, Col 0)
function B_B(A) {
  return A.type === "tool_use" || A.type === "server_tool_use"
}
// @from(Ln 194457, Col 0)
function G_B(A) {}
// @from(Ln 194458, Col 4)
X_
// @from(Ln 194458, Col 8)
ra
// @from(Ln 194458, Col 12)
TjA
// @from(Ln 194458, Col 17)
j91
// @from(Ln 194458, Col 22)
PjA
// @from(Ln 194458, Col 27)
SjA
// @from(Ln 194458, Col 32)
T91
// @from(Ln 194458, Col 37)
xjA
// @from(Ln 194458, Col 42)
zm
// @from(Ln 194458, Col 46)
yjA
// @from(Ln 194458, Col 51)
P91
// @from(Ln 194458, Col 56)
S91
// @from(Ln 194458, Col 61)
wDA
// @from(Ln 194458, Col 66)
x91
// @from(Ln 194458, Col 71)
y91
// @from(Ln 194458, Col 76)
N20
// @from(Ln 194458, Col 81)
eRB
// @from(Ln 194458, Col 86)
w20
// @from(Ln 194458, Col 91)
L20
// @from(Ln 194458, Col 96)
O20
// @from(Ln 194458, Col 101)
M20
// @from(Ln 194458, Col 106)
A_B
// @from(Ln 194458, Col 111)
Q_B = "__json_buf"
// @from(Ln 194459, Col 2)
vjA
// @from(Ln 194460, Col 4)
Z_B = w(() => {
  tu();
  wBA();
  JB1();
  _10();
  vjA = class vjA {
    constructor() {
      X_.add(this), this.messages = [], this.receivedMessages = [], ra.set(this, void 0), this.controller = new AbortController, TjA.set(this, void 0), j91.set(this, () => {}), PjA.set(this, () => {}), SjA.set(this, void 0), T91.set(this, () => {}), xjA.set(this, () => {}), zm.set(this, {}), yjA.set(this, !1), P91.set(this, !1), S91.set(this, !1), wDA.set(this, !1), x91.set(this, void 0), y91.set(this, void 0), w20.set(this, (A) => {
        if (j2(this, P91, !0, "f"), eu(A)) A = new II;
        if (A instanceof II) return j2(this, S91, !0, "f"), this._emit("abort", A);
        if (A instanceof M2) return this._emit("error", A);
        if (A instanceof Error) {
          let Q = new M2(A.message);
          return Q.cause = A, this._emit("error", Q)
        }
        return this._emit("error", new M2(String(A)))
      }), j2(this, TjA, new Promise((A, Q) => {
        j2(this, j91, A, "f"), j2(this, PjA, Q, "f")
      }), "f"), j2(this, SjA, new Promise((A, Q) => {
        j2(this, T91, A, "f"), j2(this, xjA, Q, "f")
      }), "f"), u0(this, TjA, "f").catch(() => {}), u0(this, SjA, "f").catch(() => {})
    }
    get response() {
      return u0(this, x91, "f")
    }
    get request_id() {
      return u0(this, y91, "f")
    }
    async withResponse() {
      let A = await u0(this, TjA, "f");
      if (!A) throw Error("Could not resolve a `Response` object");
      return {
        data: this,
        response: A,
        request_id: A.headers.get("request-id")
      }
    }
    static fromReadableStream(A) {
      let Q = new vjA;
      return Q._run(() => Q._fromReadableStream(A)), Q
    }
    static createMessage(A, Q, B) {
      let G = new vjA;
      for (let Z of Q.messages) G._addMessageParam(Z);
      return G._run(() => G._createMessage(A, {
        ...Q,
        stream: !0
      }, {
        ...B,
        headers: {
          ...B?.headers,
          "X-Stainless-Helper-Method": "stream"
        }
      })), G
    }
    _run(A) {
      A().then(() => {
        this._emitFinal(), this._emit("end")
      }, u0(this, w20, "f"))
    }
    _addMessageParam(A) {
      this.messages.push(A)
    }
    _addMessage(A, Q = !0) {
      if (this.receivedMessages.push(A), Q) this._emit("message", A)
    }
    async _createMessage(A, Q, B) {
      let G = B?.signal,
        Z;
      if (G) {
        if (G.aborted) this.controller.abort();
        Z = this.controller.abort.bind(this.controller), G.addEventListener("abort", Z)
      }
      try {
        u0(this, X_, "m", L20).call(this);
        let {
          response: Y,
          data: J
        } = await A.create({
          ...Q,
          stream: !0
        }, {
          ...B,
          signal: this.controller.signal
        }).withResponse();
        this._connected(Y);
        for await (let X of J) u0(this, X_, "m", O20).call(this, X);
        if (J.controller.signal?.aborted) throw new II;
        u0(this, X_, "m", M20).call(this)
      } finally {
        if (G && Z) G.removeEventListener("abort", Z)
      }
    }
    _connected(A) {
      if (this.ended) return;
      j2(this, x91, A, "f"), j2(this, y91, A?.headers.get("request-id"), "f"), u0(this, j91, "f").call(this, A), this._emit("connect")
    }
    get ended() {
      return u0(this, yjA, "f")
    }
    get errored() {
      return u0(this, P91, "f")
    }
    get aborted() {
      return u0(this, S91, "f")
    }
    abort() {
      this.controller.abort()
    }
    on(A, Q) {
      return (u0(this, zm, "f")[A] || (u0(this, zm, "f")[A] = [])).push({
        listener: Q
      }), this
    }
    off(A, Q) {
      let B = u0(this, zm, "f")[A];
      if (!B) return this;
      let G = B.findIndex((Z) => Z.listener === Q);
      if (G >= 0) B.splice(G, 1);
      return this
    }
    once(A, Q) {
      return (u0(this, zm, "f")[A] || (u0(this, zm, "f")[A] = [])).push({
        listener: Q,
        once: !0
      }), this
    }
    emitted(A) {
      return new Promise((Q, B) => {
        if (j2(this, wDA, !0, "f"), A !== "error") this.once("error", B);
        this.once(A, Q)
      })
    }
    async done() {
      j2(this, wDA, !0, "f"), await u0(this, SjA, "f")
    }
    get currentMessage() {
      return u0(this, ra, "f")
    }
    async finalMessage() {
      return await this.done(), u0(this, X_, "m", N20).call(this)
    }
    async finalText() {
      return await this.done(), u0(this, X_, "m", eRB).call(this)
    }
    _emit(A, ...Q) {
      if (u0(this, yjA, "f")) return;
      if (A === "end") j2(this, yjA, !0, "f"), u0(this, T91, "f").call(this);
      let B = u0(this, zm, "f")[A];
      if (B) u0(this, zm, "f")[A] = B.filter((G) => !G.once), B.forEach(({
        listener: G
      }) => G(...Q));
      if (A === "abort") {
        let G = Q[0];
        if (!u0(this, wDA, "f") && !B?.length) Promise.reject(G);
        u0(this, PjA, "f").call(this, G), u0(this, xjA, "f").call(this, G), this._emit("end");
        return
      }
      if (A === "error") {
        let G = Q[0];
        if (!u0(this, wDA, "f") && !B?.length) Promise.reject(G);
        u0(this, PjA, "f").call(this, G), u0(this, xjA, "f").call(this, G), this._emit("end")
      }
    }
    _emitFinal() {
      if (this.receivedMessages.at(-1)) this._emit("finalMessage", u0(this, X_, "m", N20).call(this))
    }
    async _fromReadableStream(A, Q) {
      let B = Q?.signal,
        G;
      if (B) {
        if (B.aborted) this.controller.abort();
        G = this.controller.abort.bind(this.controller), B.addEventListener("abort", G)
      }
      try {
        u0(this, X_, "m", L20).call(this), this._connected(null);
        let Z = CC.fromReadableStream(A, this.controller);
        for await (let Y of Z) u0(this, X_, "m", O20).call(this, Y);
        if (Z.controller.signal?.aborted) throw new II;
        u0(this, X_, "m", M20).call(this)
      } finally {
        if (B && G) B.removeEventListener("abort", G)
      }
    } [(ra = new WeakMap, TjA = new WeakMap, j91 = new WeakMap, PjA = new WeakMap, SjA = new WeakMap, T91 = new WeakMap, xjA = new WeakMap, zm = new WeakMap, yjA = new WeakMap, P91 = new WeakMap, S91 = new WeakMap, wDA = new WeakMap, x91 = new WeakMap, y91 = new WeakMap, w20 = new WeakMap, X_ = new WeakSet, N20 = function () {
      if (this.receivedMessages.length === 0) throw new M2("stream ended without producing a Message with role=assistant");
      return this.receivedMessages.at(-1)
    }, eRB = function () {
      if (this.receivedMessages.length === 0) throw new M2("stream ended without producing a Message with role=assistant");
      let Q = this.receivedMessages.at(-1).content.filter((B) => B.type === "text").map((B) => B.text);
      if (Q.length === 0) throw new M2("stream ended without producing a content block with type=text");
      return Q.join(" ")
    }, L20 = function () {
      if (this.ended) return;
      j2(this, ra, void 0, "f")
    }, O20 = function (Q) {
      if (this.ended) return;
      let B = u0(this, X_, "m", A_B).call(this, Q);
      switch (this._emit("streamEvent", Q, B), Q.type) {
        case "content_block_delta": {
          let G = B.content.at(-1);
          switch (Q.delta.type) {
            case "text_delta": {
              if (G.type === "text") this._emit("text", Q.delta.text, G.text || "");
              break
            }
            case "citations_delta": {
              if (G.type === "text") this._emit("citation", Q.delta.citation, G.citations ?? []);
              break
            }
            case "input_json_delta": {
              if (B_B(G) && G.input) this._emit("inputJson", Q.delta.partial_json, G.input);
              break
            }
            case "thinking_delta": {
              if (G.type === "thinking") this._emit("thinking", Q.delta.thinking, G.thinking);
              break
            }
            case "signature_delta": {
              if (G.type === "thinking") this._emit("signature", G.signature);
              break
            }
            default:
              G_B(Q.delta)
          }
          break
        }
        case "message_stop": {
          this._addMessageParam(B), this._addMessage(B, !0);
          break
        }
        case "content_block_stop": {
          this._emit("contentBlock", B.content.at(-1));
          break
        }
        case "message_start": {
          j2(this, ra, B, "f");
          break
        }
        case "content_block_start":
        case "message_delta":
          break
      }
    }, M20 = function () {
      if (this.ended) throw new M2("stream has ended, this shouldn't happen");
      let Q = u0(this, ra, "f");
      if (!Q) throw new M2("request ended without sending any chunks");
      return j2(this, ra, void 0, "f"), Q
    }, A_B = function (Q) {
      let B = u0(this, ra, "f");
      if (Q.type === "message_start") {
        if (B) throw new M2(`Unexpected event order, got ${Q.type} before receiving "message_stop"`);
        return Q.message
      }
      if (!B) throw new M2(`Unexpected event order, got ${Q.type} before "message_start"`);
      switch (Q.type) {
        case "message_stop":
          return B;
        case "message_delta":
          if (B.stop_reason = Q.delta.stop_reason, B.stop_sequence = Q.delta.stop_sequence, B.usage.output_tokens = Q.usage.output_tokens, Q.usage.input_tokens != null) B.usage.input_tokens = Q.usage.input_tokens;
          if (Q.usage.cache_creation_input_tokens != null) B.usage.cache_creation_input_tokens = Q.usage.cache_creation_input_tokens;
          if (Q.usage.cache_read_input_tokens != null) B.usage.cache_read_input_tokens = Q.usage.cache_read_input_tokens;
          if (Q.usage.server_tool_use != null) B.usage.server_tool_use = Q.usage.server_tool_use;
          return B;
        case "content_block_start":
          return B.content.push({
            ...Q.content_block
          }), B;
        case "content_block_delta": {
          let G = B.content.at(Q.index);
          switch (Q.delta.type) {
            case "text_delta": {
              if (G?.type === "text") B.content[Q.index] = {
                ...G,
                text: (G.text || "") + Q.delta.text
              };
              break
            }
            case "citations_delta": {
              if (G?.type === "text") B.content[Q.index] = {
                ...G,
                citations: [...G.citations ?? [], Q.delta.citation]
              };
              break
            }
            case "input_json_delta": {
              if (G && B_B(G)) {
                let Z = G[Q_B] || "";
                Z += Q.delta.partial_json;
                let Y = {
                  ...G
                };
                if (Object.defineProperty(Y, Q_B, {
                    value: Z,
                    enumerable: !1,
                    writable: !0
                  }), Z) Y.input = eQ1(Z);
                B.content[Q.index] = Y
              }
              break
            }
            case "thinking_delta": {
              if (G?.type === "thinking") B.content[Q.index] = {
                ...G,
                thinking: G.thinking + Q.delta.thinking
              };
              break
            }
            case "signature_delta": {
              if (G?.type === "thinking") B.content[Q.index] = {
                ...G,
                signature: Q.delta.signature
              };
              break
            }
            default:
              G_B(Q.delta)
          }
          return B
        }
        case "content_block_stop":
          return B
      }
    }, Symbol.asyncIterator)]() {
      let A = [],
        Q = [],
        B = !1;
      return this.on("streamEvent", (G) => {
        let Z = Q.shift();
        if (Z) Z.resolve(G);
        else A.push(G)
      }), this.on("end", () => {
        B = !0;
        for (let G of Q) G.resolve(void 0);
        Q.length = 0
      }), this.on("abort", (G) => {
        B = !0;
        for (let Z of Q) Z.reject(G);
        Q.length = 0
      }), this.on("error", (G) => {
        B = !0;
        for (let Z of Q) Z.reject(G);
        Q.length = 0
      }), {
        next: async () => {
          if (!A.length) {
            if (B) return {
              value: void 0,
              done: !0
            };
            return new Promise((Z, Y) => Q.push({
              resolve: Z,
              reject: Y
            })).then((Z) => Z ? {
              value: Z,
              done: !1
            } : {
              value: void 0,
              done: !0
            })
          }
          return {
            value: A.shift(),
            done: !1
          }
        },
        return: async () => {
          return this.abort(), {
            value: void 0,
            done: !0
          }
        }
      }
    }
    toReadableStream() {
      return new CC(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream()
    }
  }
})
// @from(Ln 194838, Col 4)
kjA
// @from(Ln 194839, Col 4)
R20 = w(() => {
  yk();
  J_();
  H20();
  wBA();
  na();
  kjA = class kjA extends WI {
    create(A, Q) {
      return this._client.post("/v1/messages/batches", {
        body: A,
        ...Q
      })
    }
    retrieve(A, Q) {
      return this._client.get(wX`/v1/messages/batches/${A}`, Q)
    }
    list(A = {}, Q) {
      return this._client.getAPIList("/v1/messages/batches", bP, {
        query: A,
        ...Q
      })
    }
    delete(A, Q) {
      return this._client.delete(wX`/v1/messages/batches/${A}`, Q)
    }
    cancel(A, Q) {
      return this._client.post(wX`/v1/messages/batches/${A}/cancel`, Q)
    }
    async results(A, Q) {
      let B = await this.retrieve(A);
      if (!B.results_url) throw new M2(`No batch \`results_url\`; Has it finished processing? ${B.processing_status} - ${B.id}`);
      return this._client.get(B.results_url, {
        ...Q,
        headers: l6([{
          Accept: "application/binary"
        }, Q?.headers]),
        stream: !0,
        __binaryResponse: !0
      })._thenUnwrap((G, Z) => qDA.fromResponse(Z.response, Z.controller))
    }
  }
})
// @from(Ln 194881, Col 4)
rL
// @from(Ln 194881, Col 8)
Y_B
// @from(Ln 194882, Col 4)
_20 = w(() => {
  Z_B();
  R20();
  R20();
  K20();
  rL = class rL extends WI {
    constructor() {
      super(...arguments);
      this.batches = new kjA(this._client)
    }
    create(A, Q) {
      if (A.model in Y_B) console.warn(`The model '${A.model}' is deprecated and will reach end-of-life on ${Y_B[A.model]}
Please migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`);
      let B = this._client._options.timeout;
      if (!A.stream && B == null) {
        let G = R91[A.model] ?? void 0;
        B = this._client.calculateNonstreamingTimeout(A.max_tokens, G)
      }
      return this._client.post("/v1/messages", {
        body: A,
        timeout: B ?? 600000,
        ...Q,
        stream: A.stream ?? !1
      })
    }
    stream(A, Q) {
      return vjA.createMessage(this, A, Q)
    }
    countTokens(A, Q) {
      return this._client.post("/v1/messages/count_tokens", {
        body: A,
        ...Q
      })
    }
  };
  Y_B = {
    "claude-1.3": "November 6th, 2024",
    "claude-1.3-100k": "November 6th, 2024",
    "claude-instant-1.1": "November 6th, 2024",
    "claude-instant-1.1-100k": "November 6th, 2024",
    "claude-instant-1.2": "November 6th, 2024",
    "claude-3-sonnet-20240229": "July 21st, 2025",
    "claude-3-opus-20240229": "January 5th, 2026",
    "claude-2.1": "July 21st, 2025",
    "claude-2.0": "July 21st, 2025",
    "claude-3-7-sonnet-latest": "February 19th, 2026",
    "claude-3-7-sonnet-20250219": "February 19th, 2026"
  };
  rL.Batches = kjA
})
// @from(Ln 194932, Col 4)
LDA
// @from(Ln 194933, Col 4)
j20 = w(() => {
  yk();
  J_();
  na();
  LDA = class LDA extends WI {
    retrieve(A, Q = {}, B) {
      let {
        betas: G
      } = Q ?? {};
      return this._client.get(wX`/v1/models/${A}`, {
        ...B,
        headers: l6([{
          ...G?.toString() != null ? {
            "anthropic-beta": G?.toString()
          } : void 0
        }, B?.headers])
      })
    }
    list(A = {}, Q) {
      let {
        betas: B,
        ...G
      } = A ?? {};
      return this._client.getAPIList("/v1/models", bP, {
        query: G,
        ...Q,
        headers: l6([{
          ...B?.toString() != null ? {
            "anthropic-beta": B?.toString()
          } : void 0
        }, Q?.headers])
      })
    }
  }
})
// @from(Ln 194968, Col 4)
bjA = w(() => {
  U20();
  q20();
  _20();
  j20();
  nRB()
})
// @from(Ln 194975, Col 4)
fjA = (A) => {
  if (typeof globalThis.process < "u") return globalThis.process.env?.[A]?.trim() ?? void 0;
  if (typeof globalThis.Deno < "u") return globalThis.Deno.env?.get?.(A)?.trim();
  return
}
// @from(Ln 194980, Col 0)
class IZ {
  constructor({
    baseURL: A = fjA("ANTHROPIC_BASE_URL"),
    apiKey: Q = fjA("ANTHROPIC_API_KEY") ?? null,
    authToken: B = fjA("ANTHROPIC_AUTH_TOKEN") ?? null,
    ...G
  } = {}) {
    T20.add(this), k91.set(this, void 0);
    let Z = {
      apiKey: Q,
      authToken: B,
      ...G,
      baseURL: A || "https://api.anthropic.com"
    };
    if (!Z.dangerouslyAllowBrowser && mRB()) throw new M2(`It looks like you're running in a browser-like environment.

This is disabled by default, as it risks exposing your secret API credentials to attackers.
If you understand the risks and have appropriate mitigations in place,
you can set the \`dangerouslyAllowBrowser\` option to \`true\`, e.g.,

new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
`);
    this.baseURL = Z.baseURL, this.timeout = Z.timeout ?? P20.DEFAULT_TIMEOUT, this.logger = Z.logger ?? console;
    let Y = "warn";
    this.logLevel = Y, this.logLevel = y10(Z.logLevel, "ClientOptions.logLevel", this) ?? y10(fjA("ANTHROPIC_LOG"), "process.env['ANTHROPIC_LOG']", this) ?? Y, this.fetchOptions = Z.fetchOptions, this.maxRetries = Z.maxRetries ?? 2, this.fetch = Z.fetch ?? h$B(), j2(this, k91, cRB, "f"), this._options = Z, this.apiKey = typeof Q === "string" ? Q : null, this.authToken = B
  }
  withOptions(A) {
    return new this.constructor({
      ...this._options,
      baseURL: this.baseURL,
      maxRetries: this.maxRetries,
      timeout: this.timeout,
      logger: this.logger,
      logLevel: this.logLevel,
      fetch: this.fetch,
      fetchOptions: this.fetchOptions,
      apiKey: this.apiKey,
      authToken: this.authToken,
      ...A
    })
  }
  defaultQuery() {
    return this._options.defaultQuery
  }
  validateHeaders({
    values: A,
    nulls: Q
  }) {
    if (A.get("x-api-key") || A.get("authorization")) return;
    if (this.apiKey && A.get("x-api-key")) return;
    if (Q.has("x-api-key")) return;
    if (this.authToken && A.get("authorization")) return;
    if (Q.has("authorization")) return;
    throw Error('Could not resolve authentication method. Expected either apiKey or authToken to be set. Or for one of the "X-Api-Key" or "Authorization" headers to be explicitly omitted')
  }
  async authHeaders(A) {
    return l6([await this.apiKeyAuth(A), await this.bearerAuth(A)])
  }
  async apiKeyAuth(A) {
    if (this.apiKey == null) return;
    return l6([{
      "X-Api-Key": this.apiKey
    }])
  }
  async bearerAuth(A) {
    if (this.authToken == null) return;
    return l6([{
      Authorization: `Bearer ${this.authToken}`
    }])
  }
  stringifyQuery(A) {
    return Object.entries(A).filter(([Q, B]) => typeof B < "u").map(([Q, B]) => {
      if (typeof B === "string" || typeof B === "number" || typeof B === "boolean") return `${encodeURIComponent(Q)}=${encodeURIComponent(B)}`;
      if (B === null) return `${encodeURIComponent(Q)}=`;
      throw new M2(`Cannot stringify type ${typeof B}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`)
    }).join("&")
  }
  getUserAgent() {
    return `${this.constructor.name}/JS ${ia}`
  }
  defaultIdempotencyKey() {
    return `stainless-node-retry-${eB0()}`
  }
  makeStatusError(A, Q, B, G) {
    return D9.generate(A, Q, B, G)
  }
  buildURL(A, Q, B) {
    let G = !u0(this, T20, "m", J_B).call(this) && B || this.baseURL,
      Z = p$B(A) ? new URL(A) : new URL(G + (G.endsWith("/") && A.startsWith("/") ? A.slice(1) : A)),
      Y = this.defaultQuery();
    if (!l$B(Y)) Q = {
      ...Y,
      ...Q
    };
    if (typeof Q === "object" && Q && !Array.isArray(Q)) Z.search = this.stringifyQuery(Q);
    return Z.toString()
  }
  _calculateNonstreamingTimeout(A) {
    if (3600 * A / 128000 > 600) throw new M2("Streaming is required for operations that may take longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-typescript#streaming-responses for more details");
    return 600000
  }
  async prepareOptions(A) {}
  async prepareRequest(A, {
    url: Q,
    options: B
  }) {}
  get(A, Q) {
    return this.methodRequest("get", A, Q)
  }
  post(A, Q) {
    return this.methodRequest("post", A, Q)
  }
  patch(A, Q) {
    return this.methodRequest("patch", A, Q)
  }
  put(A, Q) {
    return this.methodRequest("put", A, Q)
  }
  delete(A, Q) {
    return this.methodRequest("delete", A, Q)
  }
  methodRequest(A, Q, B) {
    return this.request(Promise.resolve(B).then((G) => {
      return {
        method: A,
        path: Q,
        ...G
      }
    }))
  }
  request(A, Q = null) {
    return new G2A(this, this.makeRequest(A, Q, void 0))
  }
  async makeRequest(A, Q, B) {
    let G = await A,
      Z = G.maxRetries ?? this.maxRetries;
    if (Q == null) Q = Z;
    await this.prepareOptions(G);
    let {
      req: Y,
      url: J,
      timeout: X
    } = await this.buildRequest(G, {
      retryCount: Z - Q
    });
    await this.prepareRequest(Y, {
      url: J,
      options: G
    });
    let I = "log_" + (Math.random() * 16777216 | 0).toString(16).padStart(6, "0"),
      D = B === void 0 ? "" : `, retryOf: ${B}`,
      W = Date.now();
    if (JF(this).debug(`[${I}] sending request`, Am({
        retryOfRequestLogID: B,
        method: G.method,
        url: J,
        options: G,
        headers: Y.headers
      })), G.signal?.aborted) throw new II;
    let K = new AbortController,
      V = await this.fetchWithTimeout(J, Y, X, K).catch(sRA),
      F = Date.now();
    if (V instanceof globalThis.Error) {
      let z = `retrying, ${Q} attempts remaining`;
      if (G.signal?.aborted) throw new II;
      let $ = eu(V) || /timed? ?out/i.test(String(V) + ("cause" in V ? String(V.cause) : ""));
      if (Q) return JF(this).info(`[${I}] connection ${$?"timed out":"failed"} - ${z}`), JF(this).debug(`[${I}] connection ${$?"timed out":"failed"} (${z})`, Am({
        retryOfRequestLogID: B,
        url: J,
        durationMs: F - W,
        message: V.message
      })), this.retryRequest(G, Q, B ?? I);
      if (JF(this).info(`[${I}] connection ${$?"timed out":"failed"} - error; no more retries left`), JF(this).debug(`[${I}] connection ${$?"timed out":"failed"} (error; no more retries left)`, Am({
          retryOfRequestLogID: B,
          url: J,
          durationMs: F - W,
          message: V.message
        })), $) throw new $k;
      throw new zC({
        cause: V
      })
    }
    let H = [...V.headers.entries()].filter(([z]) => z === "request-id").map(([z, $]) => ", " + z + ": " + JSON.stringify($)).join(""),
      E = `[${I}${D}${H}] ${Y.method} ${J} ${V.ok?"succeeded":"failed"} with status ${V.status} in ${F-W}ms`;
    if (!V.ok) {
      let z = await this.shouldRetry(V);
      if (Q && z) {
        let j = `retrying, ${Q} attempts remaining`;
        return await g$B(V.body), JF(this).info(`${E} - ${j}`), JF(this).debug(`[${I}] response error (${j})`, Am({
          retryOfRequestLogID: B,
          url: V.url,
          status: V.status,
          headers: V.headers,
          durationMs: F - W
        })), this.retryRequest(G, Q, B ?? I, V.headers)
      }
      let $ = z ? "error; no more retries left" : "error; not retryable";
      JF(this).info(`${E} - ${$}`);
      let O = await V.text().catch((j) => sRA(j).message),
        L = BB1(O),
        M = L ? void 0 : O;
      throw JF(this).debug(`[${I}] response error (${$})`, Am({
        retryOfRequestLogID: B,
        url: V.url,
        status: V.status,
        headers: V.headers,
        message: M,
        durationMs: Date.now() - W
      })), this.makeStatusError(V.status, L, M, V.headers)
    }
    return JF(this).info(E), JF(this).debug(`[${I}] response start`, Am({
      retryOfRequestLogID: B,
      url: V.url,
      status: V.status,
      headers: V.headers,
      durationMs: F - W
    })), {
      response: V,
      options: G,
      controller: K,
      requestLogID: I,
      retryOfRequestLogID: B,
      startTime: W
    }
  }
  getAPIList(A, Q, B) {
    return this.requestAPIList(Q, {
      method: "get",
      path: A,
      ...B
    })
  }
  requestAPIList(A, Q) {
    let B = this.makeRequest(Q, null, void 0);
    return new O91(this, B, A)
  }
  async fetchWithTimeout(A, Q, B, G) {
    let {
      signal: Z,
      method: Y,
      ...J
    } = Q || {};
    if (Z) Z.addEventListener("abort", () => G.abort());
    let X = setTimeout(() => G.abort(), B),
      I = globalThis.ReadableStream && J.body instanceof globalThis.ReadableStream || typeof J.body === "object" && J.body !== null && Symbol.asyncIterator in J.body,
      D = {
        signal: G.signal,
        ...I ? {
          duplex: "half"
        } : {},
        method: "GET",
        ...J
      };
    if (Y) D.method = Y.toUpperCase();
    try {
      return await this.fetch.call(void 0, A, D)
    } finally {
      clearTimeout(X)
    }
  }
  async shouldRetry(A) {
    let Q = A.headers.get("x-should-retry");
    if (Q === "true") return !0;
    if (Q === "false") return !1;
    if (A.status === 408) return !0;
    if (A.status === 409) return !0;
    if (A.status === 429) return !0;
    if (A.status >= 500) return !0;
    return !1
  }
  async retryRequest(A, Q, B, G) {
    let Z, Y = G?.get("retry-after-ms");
    if (Y) {
      let X = parseFloat(Y);
      if (!Number.isNaN(X)) Z = X
    }
    let J = G?.get("retry-after");
    if (J && !Z) {
      let X = parseFloat(J);
      if (!Number.isNaN(X)) Z = X * 1000;
      else Z = Date.parse(J) - Date.now()
    }
    if (!(Z && 0 <= Z && Z < 60000)) {
      let X = A.maxRetries ?? this.maxRetries;
      Z = this.calculateDefaultRetryTimeoutMillis(Q, X)
    }
    return await fRB(Z), this.makeRequest(A, Q - 1, B)
  }
  calculateDefaultRetryTimeoutMillis(A, Q) {
    let Z = Q - A,
      Y = Math.min(0.5 * Math.pow(2, Z), 8),
      J = 1 - Math.random() * 0.25;
    return Y * J * 1000
  }
  calculateNonstreamingTimeout(A, Q) {
    if (3600000 * A / 128000 > 600000 || Q != null && A > Q) throw new M2("Streaming is required for operations that may take longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-typescript#long-requests for more details");
    return 600000
  }
  async buildRequest(A, {
    retryCount: Q = 0
  } = {}) {
    let B = {
        ...A
      },
      {
        method: G,
        path: Z,
        query: Y,
        defaultBaseURL: J
      } = B,
      X = this.buildURL(Z, Y, J);
    if ("timeout" in B) n$B("timeout", B.timeout);
    B.timeout = B.timeout ?? this.timeout;
    let {
      bodyHeaders: I,
      body: D
    } = this.buildBody({
      options: B
    }), W = await this.buildHeaders({
      options: A,
      method: G,
      bodyHeaders: I,
      retryCount: Q
    });
    return {
      req: {
        method: G,
        headers: W,
        ...B.signal && {
          signal: B.signal
        },
        ...globalThis.ReadableStream && D instanceof globalThis.ReadableStream && {
          duplex: "half"
        },
        ...D && {
          body: D
        },
        ...this.fetchOptions ?? {},
        ...B.fetchOptions ?? {}
      },
      url: X,
      timeout: B.timeout
    }
  }
  async buildHeaders({
    options: A,
    method: Q,
    bodyHeaders: B,
    retryCount: G
  }) {
    let Z = {};
    if (this.idempotencyHeader && Q !== "get") {
      if (!A.idempotencyKey) A.idempotencyKey = this.defaultIdempotencyKey();
      Z[this.idempotencyHeader] = A.idempotencyKey
    }
    let Y = l6([Z, {
      Accept: "application/json",
      "User-Agent": this.getUserAgent(),
      "X-Stainless-Retry-Count": String(G),
      ...A.timeout ? {
        "X-Stainless-Timeout": String(Math.trunc(A.timeout / 1000))
      } : {},
      ...dRB(),
      ...this._options.dangerouslyAllowBrowser ? {
        "anthropic-dangerous-direct-browser-access": "true"
      } : void 0,
      "anthropic-version": "2023-06-01"
    }, await this.authHeaders(A), this._options.defaultHeaders, B, A.headers]);
    return this.validateHeaders(Y), Y.values
  }
  buildBody({
    options: {
      body: A,
      headers: Q
    }
  }) {
    if (!A) return {
      bodyHeaders: void 0,
      body: void 0
    };
    let B = l6([Q]);
    if (ArrayBuffer.isView(A) || A instanceof ArrayBuffer || A instanceof DataView || typeof A === "string" && B.values.has("content-type") || globalThis.Blob && A instanceof globalThis.Blob || A instanceof FormData || A instanceof URLSearchParams || globalThis.ReadableStream && A instanceof globalThis.ReadableStream) return {
      bodyHeaders: void 0,
      body: A
    };
    else if (typeof A === "object" && ((Symbol.asyncIterator in A) || (Symbol.iterator in A) && ("next" in A) && typeof A.next === "function")) return {
      bodyHeaders: void 0,
      body: AB1(A)
    };
    else return u0(this, k91, "f").call(this, {
      body: A,
      headers: B
    })
  }
}
// @from(Ln 195375, Col 4)
T20
// @from(Ln 195375, Col 9)
P20
// @from(Ln 195375, Col 14)
k91
// @from(Ln 195375, Col 19)
J_B
// @from(Ln 195375, Col 24)
X_B = "\\n\\nHuman:"
// @from(Ln 195376, Col 2)
I_B = "\\n\\nAssistant:"
// @from(Ln 195377, Col 2)
hP
// @from(Ln 195378, Col 4)
$m = w(() => {
  tu();
  LBA();
  A20();
  $C();
  yk();
  I20();
  bjA();
  w91();
  q20();
  j20();
  U20();
  _20();
  A20();
  J_();
  YB1();
  LBA();
  P20 = IZ, k91 = new WeakMap, T20 = new WeakSet, J_B = function () {
    return this.baseURL !== "https://api.anthropic.com"
  };
  IZ.Anthropic = P20;
  IZ.HUMAN_PROMPT = X_B;
  IZ.AI_PROMPT = I_B;
  IZ.DEFAULT_TIMEOUT = 600000;
  IZ.AnthropicError = M2;
  IZ.APIError = D9;
  IZ.APIConnectionError = zC;
  IZ.APIConnectionTimeoutError = $k;
  IZ.APIUserAbortError = II;
  IZ.NotFoundError = NBA;
  IZ.ConflictError = A_A;
  IZ.RateLimitError = B_A;
  IZ.BadRequestError = tRA;
  IZ.AuthenticationError = qBA;
  IZ.InternalServerError = G_A;
  IZ.PermissionDeniedError = eRA;
  IZ.UnprocessableEntityError = Q_A;
  IZ.toFile = M91;
  hP = class hP extends IZ {
    constructor() {
      super(...arguments);
      this.completions = new oa(this), this.messages = new rL(this), this.models = new LDA(this), this.beta = new Pz(this)
    }
  };
  hP.Completions = oa;
  hP.Messages = rL;
  hP.Models = LDA;
  hP.Beta = Pz
})
// @from(Ln 195427, Col 4)
vk = w(() => {
  $m();
  I20();
  w91();
  $m();
  yk();
  $C()
})
// @from(Ln 195435, Col 4)
x20 = U((iuG, f91) => {
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
  var D_B, W_B, K_B, V_B, F_B, H_B, E_B, z_B, $_B, b91, S20, C_B, U_B, ODA, q_B, N_B, w_B, L_B, O_B, M_B, R_B, __B, j_B;
  (function (A) {
    var Q = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) define("tslib", ["exports"], function (G) {
      A(B(Q, B(G)))
    });
    else if (typeof f91 === "object" && typeof iuG === "object") A(B(Q, B(iuG)));
    else A(B(Q));

    function B(G, Z) {
      if (G !== Q)
        if (typeof Object.create === "function") Object.defineProperty(G, "__esModule", {
          value: !0
        });
        else G.__esModule = !0;
      return function (Y, J) {
        return G[Y] = Z ? Z(Y, J) : J
      }
    }
  })(function (A) {
    var Q = Object.setPrototypeOf || {
      __proto__: []
    }
    instanceof Array && function (B, G) {
      B.__proto__ = G
    } || function (B, G) {
      for (var Z in G)
        if (G.hasOwnProperty(Z)) B[Z] = G[Z]
    };
    D_B = function (B, G) {
      Q(B, G);

      function Z() {
        this.constructor = B
      }
      B.prototype = G === null ? Object.create(G) : (Z.prototype = G.prototype, new Z)
    }, W_B = Object.assign || function (B) {
      for (var G, Z = 1, Y = arguments.length; Z < Y; Z++) {
        G = arguments[Z];
        for (var J in G)
          if (Object.prototype.hasOwnProperty.call(G, J)) B[J] = G[J]
      }
      return B
    }, K_B = function (B, G) {
      var Z = {};
      for (var Y in B)
        if (Object.prototype.hasOwnProperty.call(B, Y) && G.indexOf(Y) < 0) Z[Y] = B[Y];
      if (B != null && typeof Object.getOwnPropertySymbols === "function") {
        for (var J = 0, Y = Object.getOwnPropertySymbols(B); J < Y.length; J++)
          if (G.indexOf(Y[J]) < 0 && Object.prototype.propertyIsEnumerable.call(B, Y[J])) Z[Y[J]] = B[Y[J]]
      }
      return Z
    }, V_B = function (B, G, Z, Y) {
      var J = arguments.length,
        X = J < 3 ? G : Y === null ? Y = Object.getOwnPropertyDescriptor(G, Z) : Y,
        I;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") X = Reflect.decorate(B, G, Z, Y);
      else
        for (var D = B.length - 1; D >= 0; D--)
          if (I = B[D]) X = (J < 3 ? I(X) : J > 3 ? I(G, Z, X) : I(G, Z)) || X;
      return J > 3 && X && Object.defineProperty(G, Z, X), X
    }, F_B = function (B, G) {
      return function (Z, Y) {
        G(Z, Y, B)
      }
    }, H_B = function (B, G) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(B, G)
    }, E_B = function (B, G, Z, Y) {
      function J(X) {
        return X instanceof Z ? X : new Z(function (I) {
          I(X)
        })
      }
      return new(Z || (Z = Promise))(function (X, I) {
        function D(V) {
          try {
            K(Y.next(V))
          } catch (F) {
            I(F)
          }
        }

        function W(V) {
          try {
            K(Y.throw(V))
          } catch (F) {
            I(F)
          }
        }

        function K(V) {
          V.done ? X(V.value) : J(V.value).then(D, W)
        }
        K((Y = Y.apply(B, G || [])).next())
      })
    }, z_B = function (B, G) {
      var Z = {
          label: 0,
          sent: function () {
            if (X[0] & 1) throw X[1];
            return X[1]
          },
          trys: [],
          ops: []
        },
        Y, J, X, I;
      return I = {
        next: D(0),
        throw: D(1),
        return: D(2)
      }, typeof Symbol === "function" && (I[Symbol.iterator] = function () {
        return this
      }), I;

      function D(K) {
        return function (V) {
          return W([K, V])
        }
      }

      function W(K) {
        if (Y) throw TypeError("Generator is already executing.");
        while (Z) try {
          if (Y = 1, J && (X = K[0] & 2 ? J.return : K[0] ? J.throw || ((X = J.return) && X.call(J), 0) : J.next) && !(X = X.call(J, K[1])).done) return X;
          if (J = 0, X) K = [K[0] & 2, X.value];
          switch (K[0]) {
            case 0:
            case 1:
              X = K;
              break;
            case 4:
              return Z.label++, {
                value: K[1],
                done: !1
              };
            case 5:
              Z.label++, J = K[1], K = [0];
              continue;
            case 7:
              K = Z.ops.pop(), Z.trys.pop();
              continue;
            default:
              if ((X = Z.trys, !(X = X.length > 0 && X[X.length - 1])) && (K[0] === 6 || K[0] === 2)) {
                Z = 0;
                continue
              }
              if (K[0] === 3 && (!X || K[1] > X[0] && K[1] < X[3])) {
                Z.label = K[1];
                break
              }
              if (K[0] === 6 && Z.label < X[1]) {
                Z.label = X[1], X = K;
                break
              }
              if (X && Z.label < X[2]) {
                Z.label = X[2], Z.ops.push(K);
                break
              }
              if (X[2]) Z.ops.pop();
              Z.trys.pop();
              continue
          }
          K = G.call(B, Z)
        } catch (V) {
          K = [6, V], J = 0
        } finally {
          Y = X = 0
        }
        if (K[0] & 5) throw K[1];
        return {
          value: K[0] ? K[1] : void 0,
          done: !0
        }
      }
    }, j_B = function (B, G, Z, Y) {
      if (Y === void 0) Y = Z;
      B[Y] = G[Z]
    }, $_B = function (B, G) {
      for (var Z in B)
        if (Z !== "default" && !G.hasOwnProperty(Z)) G[Z] = B[Z]
    }, b91 = function (B) {
      var G = typeof Symbol === "function" && Symbol.iterator,
        Z = G && B[G],
        Y = 0;
      if (Z) return Z.call(B);
      if (B && typeof B.length === "number") return {
        next: function () {
          if (B && Y >= B.length) B = void 0;
          return {
            value: B && B[Y++],
            done: !B
          }
        }
      };
      throw TypeError(G ? "Object is not iterable." : "Symbol.iterator is not defined.")
    }, S20 = function (B, G) {
      var Z = typeof Symbol === "function" && B[Symbol.iterator];
      if (!Z) return B;
      var Y = Z.call(B),
        J, X = [],
        I;
      try {
        while ((G === void 0 || G-- > 0) && !(J = Y.next()).done) X.push(J.value)
      } catch (D) {
        I = {
          error: D
        }
      } finally {
        try {
          if (J && !J.done && (Z = Y.return)) Z.call(Y)
        } finally {
          if (I) throw I.error
        }
      }
      return X
    }, C_B = function () {
      for (var B = [], G = 0; G < arguments.length; G++) B = B.concat(S20(arguments[G]));
      return B
    }, U_B = function () {
      for (var B = 0, G = 0, Z = arguments.length; G < Z; G++) B += arguments[G].length;
      for (var Y = Array(B), J = 0, G = 0; G < Z; G++)
        for (var X = arguments[G], I = 0, D = X.length; I < D; I++, J++) Y[J] = X[I];
      return Y
    }, ODA = function (B) {
      return this instanceof ODA ? (this.v = B, this) : new ODA(B)
    }, q_B = function (B, G, Z) {
      if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
      var Y = Z.apply(B, G || []),
        J, X = [];
      return J = {}, I("next"), I("throw"), I("return"), J[Symbol.asyncIterator] = function () {
        return this
      }, J;

      function I(H) {
        if (Y[H]) J[H] = function (E) {
          return new Promise(function (z, $) {
            X.push([H, E, z, $]) > 1 || D(H, E)
          })
        }
      }

      function D(H, E) {
        try {
          W(Y[H](E))
        } catch (z) {
          F(X[0][3], z)
        }
      }

      function W(H) {
        H.value instanceof ODA ? Promise.resolve(H.value.v).then(K, V) : F(X[0][2], H)
      }

      function K(H) {
        D("next", H)
      }

      function V(H) {
        D("throw", H)
      }

      function F(H, E) {
        if (H(E), X.shift(), X.length) D(X[0][0], X[0][1])
      }
    }, N_B = function (B) {
      var G, Z;
      return G = {}, Y("next"), Y("throw", function (J) {
        throw J
      }), Y("return"), G[Symbol.iterator] = function () {
        return this
      }, G;

      function Y(J, X) {
        G[J] = B[J] ? function (I) {
          return (Z = !Z) ? {
            value: ODA(B[J](I)),
            done: J === "return"
          } : X ? X(I) : I
        } : X
      }
    }, w_B = function (B) {
      if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
      var G = B[Symbol.asyncIterator],
        Z;
      return G ? G.call(B) : (B = typeof b91 === "function" ? b91(B) : B[Symbol.iterator](), Z = {}, Y("next"), Y("throw"), Y("return"), Z[Symbol.asyncIterator] = function () {
        return this
      }, Z);

      function Y(X) {
        Z[X] = B[X] && function (I) {
          return new Promise(function (D, W) {
            I = B[X](I), J(D, W, I.done, I.value)
          })
        }
      }

      function J(X, I, D, W) {
        Promise.resolve(W).then(function (K) {
          X({
            value: K,
            done: D
          })
        }, I)
      }
    }, L_B = function (B, G) {
      if (Object.defineProperty) Object.defineProperty(B, "raw", {
        value: G
      });
      else B.raw = G;
      return B
    }, O_B = function (B) {
      if (B && B.__esModule) return B;
      var G = {};
      if (B != null) {
        for (var Z in B)
          if (Object.hasOwnProperty.call(B, Z)) G[Z] = B[Z]
      }
      return G.default = B, G
    }, M_B = function (B) {
      return B && B.__esModule ? B : {
        default: B
      }
    }, R_B = function (B, G) {
      if (!G.has(B)) throw TypeError("attempted to get private field on non-instance");
      return G.get(B)
    }, __B = function (B, G, Z) {
      if (!G.has(B)) throw TypeError("attempted to set private field on non-instance");
      return G.set(B, Z), Z
    }, A("__extends", D_B), A("__assign", W_B), A("__rest", K_B), A("__decorate", V_B), A("__param", F_B), A("__metadata", H_B), A("__awaiter", E_B), A("__generator", z_B), A("__exportStar", $_B), A("__createBinding", j_B), A("__values", b91), A("__read", S20), A("__spread", C_B), A("__spreadArrays", U_B), A("__await", ODA), A("__asyncGenerator", q_B), A("__asyncDelegator", N_B), A("__asyncValues", w_B), A("__makeTemplateObject", L_B), A("__importStar", O_B), A("__importDefault", M_B), A("__classPrivateFieldGet", R_B), A("__classPrivateFieldSet", __B)
  })
})
// @from(Ln 195781, Col 4)
y20 = U((T_B) => {
  Object.defineProperty(T_B, "__esModule", {
    value: !0
  });
  T_B.MAX_HASHABLE_LENGTH = T_B.INIT = T_B.KEY = T_B.DIGEST_LENGTH = T_B.BLOCK_SIZE = void 0;
  T_B.BLOCK_SIZE = 64;
  T_B.DIGEST_LENGTH = 32;
  T_B.KEY = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]);
  T_B.INIT = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225];
  T_B.MAX_HASHABLE_LENGTH = Math.pow(2, 53) - 1
})
// @from(Ln 195792, Col 4)
y_B = U((S_B) => {
  Object.defineProperty(S_B, "__esModule", {
    value: !0
  });
  S_B.RawSha256 = void 0;
  var I_ = y20(),
    oz8 = function () {
      function A() {
        this.state = Int32Array.from(I_.INIT), this.temp = new Int32Array(64), this.buffer = new Uint8Array(64), this.bufferLength = 0, this.bytesHashed = 0, this.finished = !1
      }
      return A.prototype.update = function (Q) {
        if (this.finished) throw Error("Attempted to update an already finished hash.");
        var B = 0,
          G = Q.byteLength;
        if (this.bytesHashed += G, this.bytesHashed * 8 > I_.MAX_HASHABLE_LENGTH) throw Error("Cannot hash more than 2^53 - 1 bits");
        while (G > 0)
          if (this.buffer[this.bufferLength++] = Q[B++], G--, this.bufferLength === I_.BLOCK_SIZE) this.hashBuffer(), this.bufferLength = 0
      }, A.prototype.digest = function () {
        if (!this.finished) {
          var Q = this.bytesHashed * 8,
            B = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength),
            G = this.bufferLength;
          if (B.setUint8(this.bufferLength++, 128), G % I_.BLOCK_SIZE >= I_.BLOCK_SIZE - 8) {
            for (var Z = this.bufferLength; Z < I_.BLOCK_SIZE; Z++) B.setUint8(Z, 0);
            this.hashBuffer(), this.bufferLength = 0
          }
          for (var Z = this.bufferLength; Z < I_.BLOCK_SIZE - 8; Z++) B.setUint8(Z, 0);
          B.setUint32(I_.BLOCK_SIZE - 8, Math.floor(Q / 4294967296), !0), B.setUint32(I_.BLOCK_SIZE - 4, Q), this.hashBuffer(), this.finished = !0
        }
        var Y = new Uint8Array(I_.DIGEST_LENGTH);
        for (var Z = 0; Z < 8; Z++) Y[Z * 4] = this.state[Z] >>> 24 & 255, Y[Z * 4 + 1] = this.state[Z] >>> 16 & 255, Y[Z * 4 + 2] = this.state[Z] >>> 8 & 255, Y[Z * 4 + 3] = this.state[Z] >>> 0 & 255;
        return Y
      }, A.prototype.hashBuffer = function () {
        var Q = this,
          B = Q.buffer,
          G = Q.state,
          Z = G[0],
          Y = G[1],
          J = G[2],
          X = G[3],
          I = G[4],
          D = G[5],
          W = G[6],
          K = G[7];
        for (var V = 0; V < I_.BLOCK_SIZE; V++) {
          if (V < 16) this.temp[V] = (B[V * 4] & 255) << 24 | (B[V * 4 + 1] & 255) << 16 | (B[V * 4 + 2] & 255) << 8 | B[V * 4 + 3] & 255;
          else {
            var F = this.temp[V - 2],
              H = (F >>> 17 | F << 15) ^ (F >>> 19 | F << 13) ^ F >>> 10;
            F = this.temp[V - 15];
            var E = (F >>> 7 | F << 25) ^ (F >>> 18 | F << 14) ^ F >>> 3;
            this.temp[V] = (H + this.temp[V - 7] | 0) + (E + this.temp[V - 16] | 0)
          }
          var z = (((I >>> 6 | I << 26) ^ (I >>> 11 | I << 21) ^ (I >>> 25 | I << 7)) + (I & D ^ ~I & W) | 0) + (K + (I_.KEY[V] + this.temp[V] | 0) | 0) | 0,
            $ = ((Z >>> 2 | Z << 30) ^ (Z >>> 13 | Z << 19) ^ (Z >>> 22 | Z << 10)) + (Z & Y ^ Z & J ^ Y & J) | 0;
          K = W, W = D, D = I, I = X + z | 0, X = J, J = Y, Y = Z, Z = z + $ | 0
        }
        G[0] += Z, G[1] += Y, G[2] += J, G[3] += X, G[4] += I, G[5] += D, G[6] += W, G[7] += K
      }, A
    }();
  S_B.RawSha256 = oz8
})
// @from(Ln 195854, Col 4)
b_B = U((v_B) => {
  Object.defineProperty(v_B, "__esModule", {
    value: !0
  });
  v_B.toUtf8 = v_B.fromUtf8 = void 0;
  var rz8 = (A) => {
    let Q = [];
    for (let B = 0, G = A.length; B < G; B++) {
      let Z = A.charCodeAt(B);
      if (Z < 128) Q.push(Z);
      else if (Z < 2048) Q.push(Z >> 6 | 192, Z & 63 | 128);
      else if (B + 1 < A.length && (Z & 64512) === 55296 && (A.charCodeAt(B + 1) & 64512) === 56320) {
        let Y = 65536 + ((Z & 1023) << 10) + (A.charCodeAt(++B) & 1023);
        Q.push(Y >> 18 | 240, Y >> 12 & 63 | 128, Y >> 6 & 63 | 128, Y & 63 | 128)
      } else Q.push(Z >> 12 | 224, Z >> 6 & 63 | 128, Z & 63 | 128)
    }
    return Uint8Array.from(Q)
  };
  v_B.fromUtf8 = rz8;
  var sz8 = (A) => {
    let Q = "";
    for (let B = 0, G = A.length; B < G; B++) {
      let Z = A[B];
      if (Z < 128) Q += String.fromCharCode(Z);
      else if (192 <= Z && Z < 224) {
        let Y = A[++B];
        Q += String.fromCharCode((Z & 31) << 6 | Y & 63)
      } else if (240 <= Z && Z < 365) {
        let J = "%" + [Z, A[++B], A[++B], A[++B]].map((X) => X.toString(16)).join("%");
        Q += decodeURIComponent(J)
      } else Q += String.fromCharCode((Z & 15) << 12 | (A[++B] & 63) << 6 | A[++B] & 63)
    }
    return Q
  };
  v_B.toUtf8 = sz8
})
// @from(Ln 195890, Col 4)
g_B = U((f_B) => {
  Object.defineProperty(f_B, "__esModule", {
    value: !0
  });
  f_B.toUtf8 = f_B.fromUtf8 = void 0;

  function ez8(A) {
    return new TextEncoder().encode(A)
  }
  f_B.fromUtf8 = ez8;

  function A$8(A) {
    return new TextDecoder("utf-8").decode(A)
  }
  f_B.toUtf8 = A$8
})
// @from(Ln 195906, Col 4)
v20 = U((d_B) => {
  Object.defineProperty(d_B, "__esModule", {
    value: !0
  });
  d_B.toUtf8 = d_B.fromUtf8 = void 0;
  var u_B = b_B(),
    m_B = g_B(),
    B$8 = (A) => typeof TextEncoder === "function" ? (0, m_B.fromUtf8)(A) : (0, u_B.fromUtf8)(A);
  d_B.fromUtf8 = B$8;
  var G$8 = (A) => typeof TextDecoder === "function" ? (0, m_B.toUtf8)(A) : (0, u_B.toUtf8)(A);
  d_B.toUtf8 = G$8
})
// @from(Ln 195918, Col 4)
i_B = U((p_B) => {
  Object.defineProperty(p_B, "__esModule", {
    value: !0
  });
  p_B.convertToBuffer = void 0;
  var Y$8 = v20(),
    J$8 = typeof Buffer < "u" && Buffer.from ? function (A) {
      return Buffer.from(A, "utf8")
    } : Y$8.fromUtf8;

  function X$8(A) {
    if (A instanceof Uint8Array) return A;
    if (typeof A === "string") return J$8(A);
    if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
    return new Uint8Array(A)
  }
  p_B.convertToBuffer = X$8
})
// @from(Ln 195936, Col 4)
o_B = U((n_B) => {
  Object.defineProperty(n_B, "__esModule", {
    value: !0
  });
  n_B.isEmptyData = void 0;

  function I$8(A) {
    if (typeof A === "string") return A.length === 0;
    return A.byteLength === 0
  }
  n_B.isEmptyData = I$8
})
// @from(Ln 195948, Col 4)
t_B = U((r_B) => {
  Object.defineProperty(r_B, "__esModule", {
    value: !0
  });
  r_B.numToUint8 = void 0;

  function D$8(A) {
    return new Uint8Array([(A & 4278190080) >> 24, (A & 16711680) >> 16, (A & 65280) >> 8, A & 255])
  }
  r_B.numToUint8 = D$8
})
// @from(Ln 195959, Col 4)
QjB = U((e_B) => {
  Object.defineProperty(e_B, "__esModule", {
    value: !0
  });
  e_B.uint32ArrayFrom = void 0;

  function W$8(A) {
    if (!Uint32Array.from) {
      var Q = new Uint32Array(A.length),
        B = 0;
      while (B < A.length) Q[B] = A[B], B += 1;
      return Q
    }
    return Uint32Array.from(A)
  }
  e_B.uint32ArrayFrom = W$8
})
// @from(Ln 195976, Col 4)
BjB = U((MDA) => {
  Object.defineProperty(MDA, "__esModule", {
    value: !0
  });
  MDA.uint32ArrayFrom = MDA.numToUint8 = MDA.isEmptyData = MDA.convertToBuffer = void 0;
  var K$8 = i_B();
  Object.defineProperty(MDA, "convertToBuffer", {
    enumerable: !0,
    get: function () {
      return K$8.convertToBuffer
    }
  });
  var V$8 = o_B();
  Object.defineProperty(MDA, "isEmptyData", {
    enumerable: !0,
    get: function () {
      return V$8.isEmptyData
    }
  });
  var F$8 = t_B();
  Object.defineProperty(MDA, "numToUint8", {
    enumerable: !0,
    get: function () {
      return F$8.numToUint8
    }
  });
  var H$8 = QjB();
  Object.defineProperty(MDA, "uint32ArrayFrom", {
    enumerable: !0,
    get: function () {
      return H$8.uint32ArrayFrom
    }
  })
})
// @from(Ln 196010, Col 4)
JjB = U((ZjB) => {
  Object.defineProperty(ZjB, "__esModule", {
    value: !0
  });
  ZjB.Sha256 = void 0;
  var GjB = x20(),
    g91 = y20(),
    h91 = y_B(),
    k20 = BjB(),
    z$8 = function () {
      function A(Q) {
        this.secret = Q, this.hash = new h91.RawSha256, this.reset()
      }
      return A.prototype.update = function (Q) {
        if ((0, k20.isEmptyData)(Q) || this.error) return;
        try {
          this.hash.update((0, k20.convertToBuffer)(Q))
        } catch (B) {
          this.error = B
        }
      }, A.prototype.digestSync = function () {
        if (this.error) throw this.error;
        if (this.outer) {
          if (!this.outer.finished) this.outer.update(this.hash.digest());
          return this.outer.digest()
        }
        return this.hash.digest()
      }, A.prototype.digest = function () {
        return GjB.__awaiter(this, void 0, void 0, function () {
          return GjB.__generator(this, function (Q) {
            return [2, this.digestSync()]
          })
        })
      }, A.prototype.reset = function () {
        if (this.hash = new h91.RawSha256, this.secret) {
          this.outer = new h91.RawSha256;
          var Q = $$8(this.secret),
            B = new Uint8Array(g91.BLOCK_SIZE);
          B.set(Q);
          for (var G = 0; G < g91.BLOCK_SIZE; G++) Q[G] ^= 54, B[G] ^= 92;
          this.hash.update(Q), this.outer.update(B);
          for (var G = 0; G < Q.byteLength; G++) Q[G] = 0
        }
      }, A
    }();
  ZjB.Sha256 = z$8;

  function $$8(A) {
    var Q = (0, k20.convertToBuffer)(A);
    if (Q.byteLength > g91.BLOCK_SIZE) {
      var B = new h91.RawSha256;
      B.update(Q), Q = B.digest()
    }
    var G = new Uint8Array(g91.BLOCK_SIZE);
    return G.set(Q), G
  }
})
// @from(Ln 196067, Col 4)
XjB = U((b20) => {
  Object.defineProperty(b20, "__esModule", {
    value: !0
  });
  var C$8 = x20();
  C$8.__exportStar(JjB(), b20)
})
// @from(Ln 196074, Col 4)
$jB = U((ImG, zjB) => {
  var {
    defineProperty: u91,
    getOwnPropertyDescriptor: U$8,
    getOwnPropertyNames: q$8
  } = Object, N$8 = Object.prototype.hasOwnProperty, m91 = (A, Q) => u91(A, "name", {
    value: Q,
    configurable: !0
  }), w$8 = (A, Q) => {
    for (var B in Q) u91(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, L$8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of q$8(Q))
        if (!N$8.call(A, Z) && Z !== B) u91(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = U$8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, O$8 = (A) => L$8(u91({}, "__esModule", {
    value: !0
  }), A), IjB = {};
  w$8(IjB, {
    AlgorithmId: () => VjB,
    EndpointURLScheme: () => KjB,
    FieldPosition: () => FjB,
    HttpApiKeyAuthLocation: () => WjB,
    HttpAuthLocation: () => DjB,
    IniSectionType: () => HjB,
    RequestHandlerProtocol: () => EjB,
    SMITHY_CONTEXT_KEY: () => T$8,
    getDefaultClientConfiguration: () => _$8,
    resolveDefaultRuntimeConfig: () => j$8
  });
  zjB.exports = O$8(IjB);
  var DjB = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(DjB || {}),
    WjB = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(WjB || {}),
    KjB = ((A) => {
      return A.HTTP = "http", A.HTTPS = "https", A
    })(KjB || {}),
    VjB = ((A) => {
      return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
    })(VjB || {}),
    M$8 = m91((A) => {
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
    R$8 = m91((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    _$8 = m91((A) => {
      return M$8(A)
    }, "getDefaultClientConfiguration"),
    j$8 = m91((A) => {
      return R$8(A)
    }, "resolveDefaultRuntimeConfig"),
    FjB = ((A) => {
      return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
    })(FjB || {}),
    T$8 = "__smithy_context",
    HjB = ((A) => {
      return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
    })(HjB || {}),
    EjB = ((A) => {
      return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
    })(EjB || {})
})
// @from(Ln 196166, Col 4)
LjB = U((DmG, wjB) => {
  var {
    defineProperty: d91,
    getOwnPropertyDescriptor: P$8,
    getOwnPropertyNames: S$8
  } = Object, x$8 = Object.prototype.hasOwnProperty, sa = (A, Q) => d91(A, "name", {
    value: Q,
    configurable: !0
  }), y$8 = (A, Q) => {
    for (var B in Q) d91(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, v$8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of S$8(Q))
        if (!x$8.call(A, Z) && Z !== B) d91(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = P$8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, k$8 = (A) => v$8(d91({}, "__esModule", {
    value: !0
  }), A), CjB = {};
  y$8(CjB, {
    Field: () => h$8,
    Fields: () => g$8,
    HttpRequest: () => u$8,
    HttpResponse: () => m$8,
    IHttpRequest: () => UjB.HttpRequest,
    getHttpHandlerExtensionConfiguration: () => b$8,
    isValidHostname: () => NjB,
    resolveHttpHandlerRuntimeConfig: () => f$8
  });
  wjB.exports = k$8(CjB);
  var b$8 = sa((A) => {
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
    f$8 = sa((A) => {
      return {
        httpHandler: A.httpHandler()
      }
    }, "resolveHttpHandlerRuntimeConfig"),
    UjB = $jB(),
    h$8 = class {
      static {
        sa(this, "Field")
      }
      constructor({
        name: A,
        kind: Q = UjB.FieldPosition.HEADER,
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
    g$8 = class {
      constructor({
        fields: A = [],
        encoding: Q = "utf-8"
      }) {
        this.entries = {}, A.forEach(this.setField.bind(this)), this.encoding = Q
      }
      static {
        sa(this, "Fields")
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
    u$8 = class A {
      static {
        sa(this, "HttpRequest")
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
        if (B.query) B.query = qjB(B.query);
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

  function qjB(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  sa(qjB, "cloneQuery");
  var m$8 = class {
    static {
      sa(this, "HttpResponse")
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

  function NjB(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  sa(NjB, "isValidHostname")
})
// @from(Ln 196330, Col 4)
_jB = U((FmG, RjB) => {
  var {
    defineProperty: c91,
    getOwnPropertyDescriptor: d$8,
    getOwnPropertyNames: c$8
  } = Object, p$8 = Object.prototype.hasOwnProperty, f20 = (A, Q) => c91(A, "name", {
    value: Q,
    configurable: !0
  }), l$8 = (A, Q) => {
    for (var B in Q) c91(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, i$8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of c$8(Q))
        if (!p$8.call(A, Z) && Z !== B) c91(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = d$8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, n$8 = (A) => i$8(c91({}, "__esModule", {
    value: !0
  }), A), OjB = {};
  l$8(OjB, {
    escapeUri: () => MjB,
    escapeUriPath: () => o$8
  });
  RjB.exports = n$8(OjB);
  var MjB = f20((A) => encodeURIComponent(A).replace(/[!'()*]/g, a$8), "escapeUri"),
    a$8 = f20((A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`, "hexEncode"),
    o$8 = f20((A) => A.split("/").map(MjB).join("/"), "escapeUriPath")
})
// @from(Ln 196364, Col 4)
SjB = U((HmG, PjB) => {
  var {
    defineProperty: p91,
    getOwnPropertyDescriptor: r$8,
    getOwnPropertyNames: s$8
  } = Object, t$8 = Object.prototype.hasOwnProperty, e$8 = (A, Q) => p91(A, "name", {
    value: Q,
    configurable: !0
  }), AC8 = (A, Q) => {
    for (var B in Q) p91(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, QC8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of s$8(Q))
        if (!t$8.call(A, Z) && Z !== B) p91(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = r$8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, BC8 = (A) => QC8(p91({}, "__esModule", {
    value: !0
  }), A), jjB = {};
  AC8(jjB, {
    buildQueryString: () => TjB
  });
  PjB.exports = BC8(jjB);
  var h20 = _jB();

  function TjB(A) {
    let Q = [];
    for (let B of Object.keys(A).sort()) {
      let G = A[B];
      if (B = (0, h20.escapeUri)(B), Array.isArray(G))
        for (let Z = 0, Y = G.length; Z < Y; Z++) Q.push(`${B}=${(0,h20.escapeUri)(G[Z])}`);
      else {
        let Z = B;
        if (G || typeof G === "string") Z += `=${(0,h20.escapeUri)(G)}`;
        Q.push(Z)
      }
    }
    return Q.join("&")
  }
  e$8(TjB, "buildQueryString")
})
// @from(Ln 196411, Col 4)
xjB = U((ZC8) => {
  var GC8 = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
  ZC8.isArrayBuffer = GC8
})
// @from(Ln 196415, Col 4)
u20 = U((DC8) => {
  var JC8 = xjB(),
    g20 = NA("buffer"),
    XC8 = (A, Q = 0, B = A.byteLength - Q) => {
      if (!JC8.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
      return g20.Buffer.from(A, Q, B)
    },
    IC8 = (A, Q) => {
      if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
      return Q ? g20.Buffer.from(A, Q) : g20.Buffer.from(A)
    };
  DC8.fromArrayBuffer = XC8;
  DC8.fromString = IC8
})
// @from(Ln 196429, Col 4)
kjB = U((yjB) => {
  Object.defineProperty(yjB, "__esModule", {
    value: !0
  });
  yjB.fromBase64 = void 0;
  var VC8 = u20(),
    FC8 = /^[A-Za-z0-9+/]*={0,2}$/,
    HC8 = (A) => {
      if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
      if (!FC8.exec(A)) throw TypeError("Invalid base64 string.");
      let Q = (0, VC8.fromString)(A, "base64");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength)
    };
  yjB.fromBase64 = HC8
})
// @from(Ln 196444, Col 4)
hjB = U((bjB) => {
  Object.defineProperty(bjB, "__esModule", {
    value: !0
  });
  bjB.toBase64 = void 0;
  var EC8 = u20(),
    zC8 = oG(),
    $C8 = (A) => {
      let Q;
      if (typeof A === "string") Q = (0, zC8.fromUtf8)(A);
      else Q = A;
      if (typeof Q !== "object" || typeof Q.byteOffset !== "number" || typeof Q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
      return (0, EC8.fromArrayBuffer)(Q.buffer, Q.byteOffset, Q.byteLength).toString("base64")
    };
  bjB.toBase64 = $C8
})
// @from(Ln 196460, Col 4)
mjB = U((UmG, l91) => {
  var {
    defineProperty: gjB,
    getOwnPropertyDescriptor: CC8,
    getOwnPropertyNames: UC8
  } = Object, qC8 = Object.prototype.hasOwnProperty, m20 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of UC8(Q))
        if (!qC8.call(A, Z) && Z !== B) gjB(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = CC8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, ujB = (A, Q, B) => (m20(A, Q, "default"), B && m20(B, Q, "default")), NC8 = (A) => m20(gjB({}, "__esModule", {
    value: !0
  }), A), d20 = {};
  l91.exports = NC8(d20);
  ujB(d20, kjB(), l91.exports);
  ujB(d20, hjB(), l91.exports)
})
// @from(Ln 196481, Col 4)
p20 = U((qmG, ajB) => {
  var {
    defineProperty: n91,
    getOwnPropertyDescriptor: wC8,
    getOwnPropertyNames: LC8
  } = Object, OC8 = Object.prototype.hasOwnProperty, kk = (A, Q) => n91(A, "name", {
    value: Q,
    configurable: !0
  }), MC8 = (A, Q) => {
    for (var B in Q) n91(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, RC8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of LC8(Q))
        if (!OC8.call(A, Z) && Z !== B) n91(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = wC8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, _C8 = (A) => RC8(n91({}, "__esModule", {
    value: !0
  }), A), cjB = {};
  MC8(cjB, {
    FetchHttpHandler: () => TC8,
    keepAliveSupport: () => i91,
    streamCollector: () => SC8
  });
  ajB.exports = _C8(cjB);
  var djB = LjB(),
    jC8 = SjB();

  function c20(A, Q) {
    return new Request(A, Q)
  }
  kk(c20, "createRequest");

  function pjB(A = 0) {
    return new Promise((Q, B) => {
      if (A) setTimeout(() => {
        let G = Error(`Request did not complete within ${A} ms`);
        G.name = "TimeoutError", B(G)
      }, A)
    })
  }
  kk(pjB, "requestTimeout");
  var i91 = {
      supported: void 0
    },
    TC8 = class A {
      static {
        kk(this, "FetchHttpHandler")
      }
      static create(Q) {
        if (typeof Q?.handle === "function") return Q;
        return new A(Q)
      }
      constructor(Q) {
        if (typeof Q === "function") this.configProvider = Q().then((B) => B || {});
        else this.config = Q ?? {}, this.configProvider = Promise.resolve(this.config);
        if (i91.supported === void 0) i91.supported = Boolean(typeof Request < "u" && "keepalive" in c20("https://[::1]"))
      }
      destroy() {}
      async handle(Q, {
        abortSignal: B
      } = {}) {
        if (!this.config) this.config = await this.configProvider;
        let G = this.config.requestTimeout,
          Z = this.config.keepAlive === !0,
          Y = this.config.credentials;
        if (B?.aborted) {
          let $ = Error("Request aborted");
          return $.name = "AbortError", Promise.reject($)
        }
        let J = Q.path,
          X = (0, jC8.buildQueryString)(Q.query || {});
        if (X) J += `?${X}`;
        if (Q.fragment) J += `#${Q.fragment}`;
        let I = "";
        if (Q.username != null || Q.password != null) {
          let $ = Q.username ?? "",
            O = Q.password ?? "";
          I = `${$}:${O}@`
        }
        let {
          port: D,
          method: W
        } = Q, K = `${Q.protocol}//${I}${Q.hostname}${D?`:${D}`:""}${J}`, V = W === "GET" || W === "HEAD" ? void 0 : Q.body, F = {
          body: V,
          headers: new Headers(Q.headers),
          method: W,
          credentials: Y
        };
        if (this.config?.cache) F.cache = this.config.cache;
        if (V) F.duplex = "half";
        if (typeof AbortController < "u") F.signal = B;
        if (i91.supported) F.keepalive = Z;
        if (typeof this.config.requestInit === "function") Object.assign(F, this.config.requestInit(Q));
        let H = kk(() => {}, "removeSignalEventListener"),
          E = c20(K, F),
          z = [fetch(E).then(($) => {
            let O = $.headers,
              L = {};
            for (let _ of O.entries()) L[_[0]] = _[1];
            if ($.body == null) return $.blob().then((_) => ({
              response: new djB.HttpResponse({
                headers: L,
                reason: $.statusText,
                statusCode: $.status,
                body: _
              })
            }));
            return {
              response: new djB.HttpResponse({
                headers: L,
                reason: $.statusText,
                statusCode: $.status,
                body: $.body
              })
            }
          }), pjB(G)];
        if (B) z.push(new Promise(($, O) => {
          let L = kk(() => {
            let M = Error("Request aborted");
            M.name = "AbortError", O(M)
          }, "onAbort");
          if (typeof B.addEventListener === "function") {
            let M = B;
            M.addEventListener("abort", L, {
              once: !0
            }), H = kk(() => M.removeEventListener("abort", L), "removeSignalEventListener")
          } else B.onabort = L
        }));
        return Promise.race(z).finally(H)
      }
      updateHttpClientConfig(Q, B) {
        this.config = void 0, this.configProvider = this.configProvider.then((G) => {
          return G[Q] = B, G
        })
      }
      httpHandlerConfigs() {
        return this.config ?? {}
      }
    },
    PC8 = mjB(),
    SC8 = kk(async (A) => {
      if (typeof Blob === "function" && A instanceof Blob || A.constructor?.name === "Blob") {
        if (Blob.prototype.arrayBuffer !== void 0) return new Uint8Array(await A.arrayBuffer());
        return ljB(A)
      }
      return ijB(A)
    }, "streamCollector");
  async function ljB(A) {
    let Q = await njB(A),
      B = (0, PC8.fromBase64)(Q);
    return new Uint8Array(B)
  }
  kk(ljB, "collectBlob");
  async function ijB(A) {
    let Q = [],
      B = A.getReader(),
      G = !1,
      Z = 0;
    while (!G) {
      let {
        done: X,
        value: I
      } = await B.read();
      if (I) Q.push(I), Z += I.length;
      G = X
    }
    let Y = new Uint8Array(Z),
      J = 0;
    for (let X of Q) Y.set(X, J), J += X.length;
    return Y
  }
  kk(ijB, "collectStream");

  function njB(A) {
    return new Promise((Q, B) => {
      let G = new FileReader;
      G.onloadend = () => {
        if (G.readyState !== 2) return B(Error("Reader aborted too early"));
        let Z = G.result ?? "",
          Y = Z.indexOf(","),
          J = Y > -1 ? Y + 1 : Z.length;
        Q(Z.substring(J))
      }, G.onabort = () => B(Error("Read aborted")), G.onerror = () => B(G.error), G.readAsDataURL(A)
    })
  }
  kk(njB, "readToBase64")
})
// @from(Ln 196675, Col 4)
l20 = U((NmG, GTB) => {
  var {
    defineProperty: a91,
    getOwnPropertyDescriptor: xC8,
    getOwnPropertyNames: yC8
  } = Object, vC8 = Object.prototype.hasOwnProperty, o91 = (A, Q) => a91(A, "name", {
    value: Q,
    configurable: !0
  }), kC8 = (A, Q) => {
    for (var B in Q) a91(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, bC8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of yC8(Q))
        if (!vC8.call(A, Z) && Z !== B) a91(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = xC8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, fC8 = (A) => bC8(a91({}, "__esModule", {
    value: !0
  }), A), ojB = {};
  kC8(ojB, {
    AlgorithmId: () => ejB,
    EndpointURLScheme: () => tjB,
    FieldPosition: () => ATB,
    HttpApiKeyAuthLocation: () => sjB,
    HttpAuthLocation: () => rjB,
    IniSectionType: () => QTB,
    RequestHandlerProtocol: () => BTB,
    SMITHY_CONTEXT_KEY: () => dC8,
    getDefaultClientConfiguration: () => uC8,
    resolveDefaultRuntimeConfig: () => mC8
  });
  GTB.exports = fC8(ojB);
  var rjB = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(rjB || {}),
    sjB = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(sjB || {}),
    tjB = ((A) => {
      return A.HTTP = "http", A.HTTPS = "https", A
    })(tjB || {}),
    ejB = ((A) => {
      return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
    })(ejB || {}),
    hC8 = o91((A) => {
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
        _checksumAlgorithms: Q,
        addChecksumAlgorithm(B) {
          this._checksumAlgorithms.push(B)
        },
        checksumAlgorithms() {
          return this._checksumAlgorithms
        }
      }
    }, "getChecksumConfiguration"),
    gC8 = o91((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    uC8 = o91((A) => {
      return {
        ...hC8(A)
      }
    }, "getDefaultClientConfiguration"),
    mC8 = o91((A) => {
      return {
        ...gC8(A)
      }
    }, "resolveDefaultRuntimeConfig"),
    ATB = ((A) => {
      return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
    })(ATB || {}),
    dC8 = "__smithy_context",
    QTB = ((A) => {
      return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
    })(QTB || {}),
    BTB = ((A) => {
      return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
    })(BTB || {})
})