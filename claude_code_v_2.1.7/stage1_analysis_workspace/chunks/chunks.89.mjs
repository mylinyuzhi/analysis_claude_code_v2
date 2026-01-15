
// @from(Ln 259119, Col 4)
c92 = w(() => {
  JJ0();
  eK();
  IX0();
  QxA();
  d92();
  PG1 = class PG1 extends HxA {
    constructor(A, Q) {
      var B, G;
      super(Q);
      this._clientInfo = A, this._cachedToolOutputValidators = new Map, this._cachedKnownTaskTools = new Set, this._cachedRequiredTaskTools = new Set, this._capabilities = (B = Q === null || Q === void 0 ? void 0 : Q.capabilities) !== null && B !== void 0 ? B : {}, this._jsonSchemaValidator = (G = Q === null || Q === void 0 ? void 0 : Q.jsonSchemaValidator) !== null && G !== void 0 ? G : new hxA
    }
    get experimental() {
      if (!this._experimental) this._experimental = {
        tasks: new DX0(this)
      };
      return this._experimental
    }
    registerCapabilities(A) {
      if (this.transport) throw Error("Cannot register capabilities after connecting to transport");
      this._capabilities = d71(this._capabilities, A)
    }
    setRequestHandler(A, Q) {
      var B, G, Z;
      let Y = RKA(A),
        J = Y === null || Y === void 0 ? void 0 : Y.method;
      if (!J) throw Error("Schema is missing a method literal");
      let X;
      if (Dr(J)) {
        let D = J,
          W = (B = D._zod) === null || B === void 0 ? void 0 : B.def;
        X = (G = W === null || W === void 0 ? void 0 : W.value) !== null && G !== void 0 ? G : D.value
      } else {
        let D = J,
          W = D._def;
        X = (Z = W === null || W === void 0 ? void 0 : W.value) !== null && Z !== void 0 ? Z : D.value
      }
      if (typeof X !== "string") throw Error("Schema method literal must be a string");
      let I = X;
      if (I === "elicitation/create") {
        let D = async (W, K) => {
          var V, F, H;
          let E = lC(b71, W);
          if (!E.success) {
            let b = E.error instanceof Error ? E.error.message : String(E.error);
            throw new P9(q4.InvalidParams, `Invalid elicitation request: ${b}`)
          }
          let {
            params: z
          } = E.data, $ = (V = z.mode) !== null && V !== void 0 ? V : "form", {
            supportsFormMode: O,
            supportsUrlMode: L
          } = U35(this._capabilities.elicitation);
          if ($ === "form" && !O) throw new P9(q4.InvalidParams, "Client does not support form-mode elicitation requests");
          if ($ === "url" && !L) throw new P9(q4.InvalidParams, "Client does not support URL-mode elicitation requests");
          let M = await Promise.resolve(Q(W, K));
          if (z.task) {
            let b = lC(Kd, M);
            if (!b.success) {
              let S = b.error instanceof Error ? b.error.message : String(b.error);
              throw new P9(q4.InvalidParams, `Invalid task creation result: ${S}`)
            }
            return b.data
          }
          let _ = lC(TKA, M);
          if (!_.success) {
            let b = _.error instanceof Error ? _.error.message : String(_.error);
            throw new P9(q4.InvalidParams, `Invalid elicitation result: ${b}`)
          }
          let j = _.data,
            x = $ === "form" ? z.requestedSchema : void 0;
          if ($ === "form" && j.action === "accept" && j.content && x) {
            if ((H = (F = this._capabilities.elicitation) === null || F === void 0 ? void 0 : F.form) === null || H === void 0 ? void 0 : H.applyDefaults) try {
              TG1(x, j.content)
            } catch (b) {}
          }
          return j
        };
        return super.setRequestHandler(A, D)
      }
      if (I === "sampling/createMessage") {
        let D = async (W, K) => {
          let V = lC(PY0, W);
          if (!V.success) {
            let z = V.error instanceof Error ? V.error.message : String(V.error);
            throw new P9(q4.InvalidParams, `Invalid sampling request: ${z}`)
          }
          let {
            params: F
          } = V.data, H = await Promise.resolve(Q(W, K));
          if (F.task) {
            let z = lC(Kd, H);
            if (!z.success) {
              let $ = z.error instanceof Error ? z.error.message : String(z.error);
              throw new P9(q4.InvalidParams, `Invalid task creation result: ${$}`)
            }
            return z.data
          }
          let E = lC(VxA, H);
          if (!E.success) {
            let z = E.error instanceof Error ? E.error.message : String(E.error);
            throw new P9(q4.InvalidParams, `Invalid sampling result: ${z}`)
          }
          return E.data
        };
        return super.setRequestHandler(A, D)
      }
      return super.setRequestHandler(A, Q)
    }
    assertCapability(A, Q) {
      var B;
      if (!((B = this._serverCapabilities) === null || B === void 0 ? void 0 : B[A])) throw Error(`Server does not support ${A} (required for ${Q})`)
    }
    async connect(A, Q) {
      if (await super.connect(A), A.sessionId !== void 0) return;
      try {
        let B = await this.request({
          method: "initialize",
          params: {
            protocolVersion: Wr,
            capabilities: this._capabilities,
            clientInfo: this._clientInfo
          }
        }, $Y0, Q);
        if (B === void 0) throw Error(`Server sent invalid initialize result: ${B}`);
        if (!O71.includes(B.protocolVersion)) throw Error(`Server's protocol version is not supported: ${B.protocolVersion}`);
        if (this._serverCapabilities = B.capabilities, this._serverVersion = B.serverInfo, A.setProtocolVersion) A.setProtocolVersion(B.protocolVersion);
        this._instructions = B.instructions, await this.notification({
          method: "notifications/initialized"
        })
      } catch (B) {
        throw this.close(), B
      }
    }
    getServerCapabilities() {
      return this._serverCapabilities
    }
    getServerVersion() {
      return this._serverVersion
    }
    getInstructions() {
      return this._instructions
    }
    assertCapabilityForMethod(A) {
      var Q, B, G, Z, Y;
      switch (A) {
        case "logging/setLevel":
          if (!((Q = this._serverCapabilities) === null || Q === void 0 ? void 0 : Q.logging)) throw Error(`Server does not support logging (required for ${A})`);
          break;
        case "prompts/get":
        case "prompts/list":
          if (!((B = this._serverCapabilities) === null || B === void 0 ? void 0 : B.prompts)) throw Error(`Server does not support prompts (required for ${A})`);
          break;
        case "resources/list":
        case "resources/templates/list":
        case "resources/read":
        case "resources/subscribe":
        case "resources/unsubscribe":
          if (!((G = this._serverCapabilities) === null || G === void 0 ? void 0 : G.resources)) throw Error(`Server does not support resources (required for ${A})`);
          if (A === "resources/subscribe" && !this._serverCapabilities.resources.subscribe) throw Error(`Server does not support resource subscriptions (required for ${A})`);
          break;
        case "tools/call":
        case "tools/list":
          if (!((Z = this._serverCapabilities) === null || Z === void 0 ? void 0 : Z.tools)) throw Error(`Server does not support tools (required for ${A})`);
          break;
        case "completion/complete":
          if (!((Y = this._serverCapabilities) === null || Y === void 0 ? void 0 : Y.completions)) throw Error(`Server does not support completions (required for ${A})`);
          break;
        case "initialize":
          break;
        case "ping":
          break
      }
    }
    assertNotificationCapability(A) {
      var Q;
      switch (A) {
        case "notifications/roots/list_changed":
          if (!((Q = this._capabilities.roots) === null || Q === void 0 ? void 0 : Q.listChanged)) throw Error(`Client does not support roots list changed notifications (required for ${A})`);
          break;
        case "notifications/initialized":
          break;
        case "notifications/cancelled":
          break;
        case "notifications/progress":
          break
      }
    }
    assertRequestHandlerCapability(A) {
      if (!this._capabilities) return;
      switch (A) {
        case "sampling/createMessage":
          if (!this._capabilities.sampling) throw Error(`Client does not support sampling capability (required for ${A})`);
          break;
        case "elicitation/create":
          if (!this._capabilities.elicitation) throw Error(`Client does not support elicitation capability (required for ${A})`);
          break;
        case "roots/list":
          if (!this._capabilities.roots) throw Error(`Client does not support roots capability (required for ${A})`);
          break;
        case "tasks/get":
        case "tasks/list":
        case "tasks/result":
        case "tasks/cancel":
          if (!this._capabilities.tasks) throw Error(`Client does not support tasks capability (required for ${A})`);
          break;
        case "ping":
          break
      }
    }
    assertTaskCapability(A) {
      var Q, B;
      _G1((B = (Q = this._serverCapabilities) === null || Q === void 0 ? void 0 : Q.tasks) === null || B === void 0 ? void 0 : B.requests, A, "Server")
    }
    assertTaskHandlerCapability(A) {
      var Q;
      if (!this._capabilities) return;
      jG1((Q = this._capabilities.tasks) === null || Q === void 0 ? void 0 : Q.requests, A, "Client")
    }
    async ping(A) {
      return this.request({
        method: "ping"
      }, Wd, A)
    }
    async complete(A, Q) {
      return this.request({
        method: "completion/complete",
        params: A
      }, xY0, Q)
    }
    async setLoggingLevel(A, Q) {
      return this.request({
        method: "logging/setLevel",
        params: {
          level: A
        }
      }, Wd, Q)
    }
    async getPrompt(A, Q) {
      return this.request({
        method: "prompts/get",
        params: A
      }, RY0, Q)
    }
    async listPrompts(A, Q) {
      return this.request({
        method: "prompts/list",
        params: A
      }, IxA, Q)
    }
    async listResources(A, Q) {
      return this.request({
        method: "resources/list",
        params: A
      }, l9A, Q)
    }
    async listResourceTemplates(A, Q) {
      return this.request({
        method: "resources/templates/list",
        params: A
      }, UY0, Q)
    }
    async readResource(A, Q) {
      return this.request({
        method: "resources/read",
        params: A
      }, i9A, Q)
    }
    async subscribeResource(A, Q) {
      return this.request({
        method: "resources/subscribe",
        params: A
      }, Wd, Q)
    }
    async unsubscribeResource(A, Q) {
      return this.request({
        method: "resources/unsubscribe",
        params: A
      }, Wd, Q)
    }
    async callTool(A, Q = iC, B) {
      if (this.isToolTaskRequired(A.name)) throw new P9(q4.InvalidRequest, `Tool "${A.name}" requires task-based execution. Use client.experimental.tasks.callToolStream() instead.`);
      let G = await this.request({
          method: "tools/call",
          params: A
        }, Q, B),
        Z = this.getToolOutputValidator(A.name);
      if (Z) {
        if (!G.structuredContent && !G.isError) throw new P9(q4.InvalidRequest, `Tool ${A.name} has an output schema but did not return structured content`);
        if (G.structuredContent) try {
          let Y = Z(G.structuredContent);
          if (!Y.valid) throw new P9(q4.InvalidParams, `Structured content does not match the tool's output schema: ${Y.errorMessage}`)
        } catch (Y) {
          if (Y instanceof P9) throw Y;
          throw new P9(q4.InvalidParams, `Failed to validate structured content: ${Y instanceof Error?Y.message:String(Y)}`)
        }
      }
      return G
    }
    isToolTask(A) {
      var Q, B, G, Z;
      if (!((Z = (G = (B = (Q = this._serverCapabilities) === null || Q === void 0 ? void 0 : Q.tasks) === null || B === void 0 ? void 0 : B.requests) === null || G === void 0 ? void 0 : G.tools) === null || Z === void 0 ? void 0 : Z.call)) return !1;
      return this._cachedKnownTaskTools.has(A)
    }
    isToolTaskRequired(A) {
      return this._cachedRequiredTaskTools.has(A)
    }
    cacheToolMetadata(A) {
      var Q;
      this._cachedToolOutputValidators.clear(), this._cachedKnownTaskTools.clear(), this._cachedRequiredTaskTools.clear();
      for (let B of A) {
        if (B.outputSchema) {
          let Z = this._jsonSchemaValidator.getValidator(B.outputSchema);
          this._cachedToolOutputValidators.set(B.name, Z)
        }
        let G = (Q = B.execution) === null || Q === void 0 ? void 0 : Q.taskSupport;
        if (G === "required" || G === "optional") this._cachedKnownTaskTools.add(B.name);
        if (G === "required") this._cachedRequiredTaskTools.add(B.name)
      }
    }
    getToolOutputValidator(A) {
      return this._cachedToolOutputValidators.get(A)
    }
    async listTools(A, Q) {
      let B = await this.request({
        method: "tools/list",
        params: A
      }, WxA, Q);
      return this.cacheToolMetadata(B.tools), B
    }
    async sendRootsListChanged() {
      return this.notification({
        method: "notifications/roots/list_changed"
      })
    }
  }
})
// @from(Ln 259456, Col 0)
class gxA {
  append(A) {
    this._buffer = this._buffer ? Buffer.concat([this._buffer, A]) : A
  }
  readMessage() {
    if (!this._buffer) return null;
    let A = this._buffer.indexOf(`
`);
    if (A === -1) return null;
    let Q = this._buffer.toString("utf8", 0, A).replace(/\r$/, "");
    return this._buffer = this._buffer.subarray(A + 1), q35(Q)
  }
  clear() {
    this._buffer = void 0
  }
}
// @from(Ln 259473, Col 0)
function q35(A) {
  return Nb.parse(JSON.parse(A))
}
// @from(Ln 259477, Col 0)
function SG1(A) {
  return JSON.stringify(A) + `
`
}
// @from(Ln 259481, Col 4)
WX0 = w(() => {
  eK()
})
// @from(Ln 259489, Col 0)
function L35() {
  let A = {};
  for (let Q of w35) {
    let B = xG1.env[Q];
    if (B === void 0) continue;
    if (B.startsWith("()")) continue;
    A[Q] = B
  }
  return A
}
// @from(Ln 259499, Col 0)
class KX0 {
  constructor(A) {
    if (this._readBuffer = new gxA, this._stderrStream = null, this._serverParams = A, A.stderr === "pipe" || A.stderr === "overlapped") this._stderrStream = new N35
  }
  async start() {
    if (this._process) throw Error("StdioClientTransport already started! If using Client class, note that connect() calls start() automatically.");
    return new Promise((A, Q) => {
      var B, G, Z, Y, J;
      if (this._process = p92.default(this._serverParams.command, (B = this._serverParams.args) !== null && B !== void 0 ? B : [], {
          env: {
            ...L35(),
            ...this._serverParams.env
          },
          stdio: ["pipe", "pipe", (G = this._serverParams.stderr) !== null && G !== void 0 ? G : "inherit"],
          shell: !1,
          windowsHide: xG1.platform === "win32" && O35(),
          cwd: this._serverParams.cwd
        }), this._process.on("error", (X) => {
          var I;
          Q(X), (I = this.onerror) === null || I === void 0 || I.call(this, X)
        }), this._process.on("spawn", () => {
          A()
        }), this._process.on("close", (X) => {
          var I;
          this._process = void 0, (I = this.onclose) === null || I === void 0 || I.call(this)
        }), (Z = this._process.stdin) === null || Z === void 0 || Z.on("error", (X) => {
          var I;
          (I = this.onerror) === null || I === void 0 || I.call(this, X)
        }), (Y = this._process.stdout) === null || Y === void 0 || Y.on("data", (X) => {
          this._readBuffer.append(X), this.processReadBuffer()
        }), (J = this._process.stdout) === null || J === void 0 || J.on("error", (X) => {
          var I;
          (I = this.onerror) === null || I === void 0 || I.call(this, X)
        }), this._stderrStream && this._process.stderr) this._process.stderr.pipe(this._stderrStream)
    })
  }
  get stderr() {
    var A, Q;
    if (this._stderrStream) return this._stderrStream;
    return (Q = (A = this._process) === null || A === void 0 ? void 0 : A.stderr) !== null && Q !== void 0 ? Q : null
  }
  get pid() {
    var A, Q;
    return (Q = (A = this._process) === null || A === void 0 ? void 0 : A.pid) !== null && Q !== void 0 ? Q : null
  }
  processReadBuffer() {
    var A, Q;
    while (!0) try {
      let B = this._readBuffer.readMessage();
      if (B === null) break;
      (A = this.onmessage) === null || A === void 0 || A.call(this, B)
    } catch (B) {
      (Q = this.onerror) === null || Q === void 0 || Q.call(this, B)
    }
  }
  async close() {
    var A;
    if (this._process) {
      let Q = this._process;
      this._process = void 0;
      let B = new Promise((G) => {
        Q.once("close", () => {
          G()
        })
      });
      try {
        (A = Q.stdin) === null || A === void 0 || A.end()
      } catch (G) {}
      if (await Promise.race([B, new Promise((G) => setTimeout(G, 2000).unref())]), Q.exitCode === null) {
        try {
          Q.kill("SIGTERM")
        } catch (G) {}
        await Promise.race([B, new Promise((G) => setTimeout(G, 2000).unref())])
      }
      if (Q.exitCode === null) try {
        Q.kill("SIGKILL")
      } catch (G) {}
    }
    this._readBuffer.clear()
  }
  send(A) {
    return new Promise((Q) => {
      var B;
      if (!((B = this._process) === null || B === void 0 ? void 0 : B.stdin)) throw Error("Not connected");
      let G = SG1(A);
      if (this._process.stdin.write(G)) Q();
      else this._process.stdin.once("drain", Q)
    })
  }
}
// @from(Ln 259590, Col 0)
function O35() {
  return "type" in xG1
}
// @from(Ln 259593, Col 4)
p92
// @from(Ln 259593, Col 9)
w35
// @from(Ln 259594, Col 4)
l92 = w(() => {
  WX0();
  p92 = c(NL1(), 1), w35 = xG1.platform === "win32" ? ["APPDATA", "HOMEDRIVE", "HOMEPATH", "LOCALAPPDATA", "PATH", "PROCESSOR_ARCHITECTURE", "SYSTEMDRIVE", "SYSTEMROOT", "TEMP", "USERNAME", "USERPROFILE", "PROGRAMFILES"] : ["HOME", "LOGNAME", "PATH", "SHELL", "TERM", "USER"]
})
// @from(Ln 259599, Col 0)
function VX0(A) {}
// @from(Ln 259601, Col 0)
function yG1(A) {
  if (typeof A == "function") throw TypeError("`callbacks` must be an object, got a function instead. Did you mean `{onEvent: fn}`?");
  let {
    onEvent: Q = VX0,
    onError: B = VX0,
    onRetry: G = VX0,
    onComment: Z
  } = A, Y = "", J = !0, X, I = "", D = "";

  function W(E) {
    let z = J ? E.replace(/^\xEF\xBB\xBF/, "") : E,
      [$, O] = M35(`${Y}${z}`);
    for (let L of $) K(L);
    Y = O, J = !1
  }

  function K(E) {
    if (E === "") {
      F();
      return
    }
    if (E.startsWith(":")) {
      Z && Z(E.slice(E.startsWith(": ") ? 2 : 1));
      return
    }
    let z = E.indexOf(":");
    if (z !== -1) {
      let $ = E.slice(0, z),
        O = E[z + 1] === " " ? 2 : 1,
        L = E.slice(z + O);
      V($, L, E);
      return
    }
    V(E, "", E)
  }

  function V(E, z, $) {
    switch (E) {
      case "event":
        D = z;
        break;
      case "data":
        I = `${I}${z}
`;
        break;
      case "id":
        X = z.includes("\x00") ? void 0 : z;
        break;
      case "retry":
        /^\d+$/.test(z) ? G(parseInt(z, 10)) : B(new FX0(`Invalid \`retry\` value: "${z}"`, {
          type: "invalid-retry",
          value: z,
          line: $
        }));
        break;
      default:
        B(new FX0(`Unknown field "${E.length>20?`${E.slice(0,20)}…`:E}"`, {
          type: "unknown-field",
          field: E,
          value: z,
          line: $
        }));
        break
    }
  }

  function F() {
    I.length > 0 && Q({
      id: X,
      event: D || void 0,
      data: I.endsWith(`
`) ? I.slice(0, -1) : I
    }), X = void 0, I = "", D = ""
  }

  function H(E = {}) {
    Y && E.consume && K(Y), J = !0, X = void 0, I = "", D = "", Y = ""
  }
  return {
    feed: W,
    reset: H
  }
}
// @from(Ln 259685, Col 0)
function M35(A) {
  let Q = [],
    B = "",
    G = 0;
  for (; G < A.length;) {
    let Z = A.indexOf("\r", G),
      Y = A.indexOf(`
`, G),
      J = -1;
    if (Z !== -1 && Y !== -1 ? J = Math.min(Z, Y) : Z !== -1 ? J = Z : Y !== -1 && (J = Y), J === -1) {
      B = A.slice(G);
      break
    } else {
      let X = A.slice(G, J);
      Q.push(X), G = J + 1, A[G - 1] === "\r" && A[G] === `
` && G++
    }
  }
  return [Q, B]
}
// @from(Ln 259705, Col 4)
FX0
// @from(Ln 259706, Col 4)
HX0 = w(() => {
  FX0 = class FX0 extends Error {
    constructor(A, Q) {
      super(A), this.name = "ParseError", this.type = Q.type, this.field = Q.field, this.value = Q.value, this.line = Q.line
    }
  }
})
// @from(Ln 259714, Col 0)
function R35(A) {
  let Q = globalThis.DOMException;
  return typeof Q == "function" ? new Q(A, "SyntaxError") : SyntaxError(A)
}
// @from(Ln 259719, Col 0)
function zX0(A) {
  return A instanceof Error ? "errors" in A && Array.isArray(A.errors) ? A.errors.map(zX0).join(", ") : ("cause" in A) && A.cause instanceof Error ? `${A}: ${zX0(A.cause)}` : A.message : `${A}`
}
// @from(Ln 259723, Col 0)
function i92(A) {
  return {
    type: A.type,
    message: A.message,
    code: A.code,
    defaultPrevented: A.defaultPrevented,
    cancelable: A.cancelable,
    timeStamp: A.timeStamp
  }
}
// @from(Ln 259734, Col 0)
function _35() {
  let A = "document" in globalThis ? globalThis.document : void 0;
  return A && typeof A == "object" && "baseURI" in A && typeof A.baseURI == "string" ? A.baseURI : void 0
}
// @from(Ln 259738, Col 4)
EX0
// @from(Ln 259738, Col 9)
a92 = (A) => {
    throw TypeError(A)
  }
// @from(Ln 259741, Col 2)
OX0 = (A, Q, B) => Q.has(A) || a92("Cannot " + B)
// @from(Ln 259742, Col 2)
I5 = (A, Q, B) => (OX0(A, Q, "read from private field"), B ? B.call(A) : Q.get(A))
// @from(Ln 259743, Col 2)
AV = (A, Q, B) => Q.has(A) ? a92("Cannot add the same private member more than once") : Q instanceof WeakSet ? Q.add(A) : Q.set(A, B)
// @from(Ln 259744, Col 2)
RX = (A, Q, B, G) => (OX0(A, Q, "write to private field"), Q.set(A, B), B)
// @from(Ln 259745, Col 2)
Cd = (A, Q, B) => (OX0(A, Q, "access private method"), B)
// @from(Ln 259746, Col 2)
_N
// @from(Ln 259746, Col 6)
A4A
// @from(Ln 259746, Col 11)
mKA
// @from(Ln 259746, Col 16)
vG1
// @from(Ln 259746, Col 21)
kG1
// @from(Ln 259746, Col 26)
dxA
// @from(Ln 259746, Col 31)
pKA
// @from(Ln 259746, Col 36)
cxA
// @from(Ln 259746, Col 41)
Ur
// @from(Ln 259746, Col 45)
dKA
// @from(Ln 259746, Col 50)
lKA
// @from(Ln 259746, Col 55)
cKA
// @from(Ln 259746, Col 60)
uxA
// @from(Ln 259746, Col 65)
qS
// @from(Ln 259746, Col 69)
$X0
// @from(Ln 259746, Col 74)
CX0
// @from(Ln 259746, Col 79)
UX0
// @from(Ln 259746, Col 84)
n92
// @from(Ln 259746, Col 89)
qX0
// @from(Ln 259746, Col 94)
NX0
// @from(Ln 259746, Col 99)
mxA
// @from(Ln 259746, Col 104)
wX0
// @from(Ln 259746, Col 109)
LX0
// @from(Ln 259746, Col 114)
iKA
// @from(Ln 259747, Col 4)
o92 = w(() => {
  HX0();
  EX0 = class EX0 extends Event {
    constructor(A, Q) {
      var B, G;
      super(A), this.code = (B = Q == null ? void 0 : Q.code) != null ? B : void 0, this.message = (G = Q == null ? void 0 : Q.message) != null ? G : void 0
    } [Symbol.for("nodejs.util.inspect.custom")](A, Q, B) {
      return B(i92(this), Q)
    } [Symbol.for("Deno.customInspect")](A, Q) {
      return A(i92(this), Q)
    }
  };
  iKA = class iKA extends EventTarget {
    constructor(A, Q) {
      var B, G;
      super(), AV(this, qS), this.CONNECTING = 0, this.OPEN = 1, this.CLOSED = 2, AV(this, _N), AV(this, A4A), AV(this, mKA), AV(this, vG1), AV(this, kG1), AV(this, dxA), AV(this, pKA), AV(this, cxA, null), AV(this, Ur), AV(this, dKA), AV(this, lKA, null), AV(this, cKA, null), AV(this, uxA, null), AV(this, CX0, async (Z) => {
        var Y;
        I5(this, dKA).reset();
        let {
          body: J,
          redirected: X,
          status: I,
          headers: D
        } = Z;
        if (I === 204) {
          Cd(this, qS, mxA).call(this, "Server sent HTTP 204, not reconnecting", 204), this.close();
          return
        }
        if (X ? RX(this, mKA, new URL(Z.url)) : RX(this, mKA, void 0), I !== 200) {
          Cd(this, qS, mxA).call(this, `Non-200 status code (${I})`, I);
          return
        }
        if (!(D.get("content-type") || "").startsWith("text/event-stream")) {
          Cd(this, qS, mxA).call(this, 'Invalid content type, expected "text/event-stream"', I);
          return
        }
        if (I5(this, _N) === this.CLOSED) return;
        RX(this, _N, this.OPEN);
        let W = new Event("open");
        if ((Y = I5(this, uxA)) == null || Y.call(this, W), this.dispatchEvent(W), typeof J != "object" || !J || !("getReader" in J)) {
          Cd(this, qS, mxA).call(this, "Invalid response body, expected a web ReadableStream", I), this.close();
          return
        }
        let K = new TextDecoder,
          V = J.getReader(),
          F = !0;
        do {
          let {
            done: H,
            value: E
          } = await V.read();
          E && I5(this, dKA).feed(K.decode(E, {
            stream: !H
          })), H && (F = !1, I5(this, dKA).reset(), Cd(this, qS, wX0).call(this))
        } while (F)
      }), AV(this, UX0, (Z) => {
        RX(this, Ur, void 0), !(Z.name === "AbortError" || Z.type === "aborted") && Cd(this, qS, wX0).call(this, zX0(Z))
      }), AV(this, qX0, (Z) => {
        typeof Z.id == "string" && RX(this, cxA, Z.id);
        let Y = new MessageEvent(Z.event || "message", {
          data: Z.data,
          origin: I5(this, mKA) ? I5(this, mKA).origin : I5(this, A4A).origin,
          lastEventId: Z.id || ""
        });
        I5(this, cKA) && (!Z.event || Z.event === "message") && I5(this, cKA).call(this, Y), this.dispatchEvent(Y)
      }), AV(this, NX0, (Z) => {
        RX(this, dxA, Z)
      }), AV(this, LX0, () => {
        RX(this, pKA, void 0), I5(this, _N) === this.CONNECTING && Cd(this, qS, $X0).call(this)
      });
      try {
        if (A instanceof URL) RX(this, A4A, A);
        else if (typeof A == "string") RX(this, A4A, new URL(A, _35()));
        else throw Error("Invalid URL")
      } catch {
        throw R35("An invalid or illegal string was specified")
      }
      RX(this, dKA, yG1({
        onEvent: I5(this, qX0),
        onRetry: I5(this, NX0)
      })), RX(this, _N, this.CONNECTING), RX(this, dxA, 3000), RX(this, kG1, (B = Q == null ? void 0 : Q.fetch) != null ? B : globalThis.fetch), RX(this, vG1, (G = Q == null ? void 0 : Q.withCredentials) != null ? G : !1), Cd(this, qS, $X0).call(this)
    }
    get readyState() {
      return I5(this, _N)
    }
    get url() {
      return I5(this, A4A).href
    }
    get withCredentials() {
      return I5(this, vG1)
    }
    get onerror() {
      return I5(this, lKA)
    }
    set onerror(A) {
      RX(this, lKA, A)
    }
    get onmessage() {
      return I5(this, cKA)
    }
    set onmessage(A) {
      RX(this, cKA, A)
    }
    get onopen() {
      return I5(this, uxA)
    }
    set onopen(A) {
      RX(this, uxA, A)
    }
    addEventListener(A, Q, B) {
      let G = Q;
      super.addEventListener(A, G, B)
    }
    removeEventListener(A, Q, B) {
      let G = Q;
      super.removeEventListener(A, G, B)
    }
    close() {
      I5(this, pKA) && clearTimeout(I5(this, pKA)), I5(this, _N) !== this.CLOSED && (I5(this, Ur) && I5(this, Ur).abort(), RX(this, _N, this.CLOSED), RX(this, Ur, void 0))
    }
  };
  _N = new WeakMap, A4A = new WeakMap, mKA = new WeakMap, vG1 = new WeakMap, kG1 = new WeakMap, dxA = new WeakMap, pKA = new WeakMap, cxA = new WeakMap, Ur = new WeakMap, dKA = new WeakMap, lKA = new WeakMap, cKA = new WeakMap, uxA = new WeakMap, qS = new WeakSet, $X0 = function () {
    RX(this, _N, this.CONNECTING), RX(this, Ur, new AbortController), I5(this, kG1)(I5(this, A4A), Cd(this, qS, n92).call(this)).then(I5(this, CX0)).catch(I5(this, UX0))
  }, CX0 = new WeakMap, UX0 = new WeakMap, n92 = function () {
    var A;
    let Q = {
      mode: "cors",
      redirect: "follow",
      headers: {
        Accept: "text/event-stream",
        ...I5(this, cxA) ? {
          "Last-Event-ID": I5(this, cxA)
        } : void 0
      },
      cache: "no-store",
      signal: (A = I5(this, Ur)) == null ? void 0 : A.signal
    };
    return "window" in globalThis && (Q.credentials = this.withCredentials ? "include" : "same-origin"), Q
  }, qX0 = new WeakMap, NX0 = new WeakMap, mxA = function (A, Q) {
    var B;
    I5(this, _N) !== this.CLOSED && RX(this, _N, this.CLOSED);
    let G = new EX0("error", {
      code: Q,
      message: A
    });
    (B = I5(this, lKA)) == null || B.call(this, G), this.dispatchEvent(G)
  }, wX0 = function (A, Q) {
    var B;
    if (I5(this, _N) === this.CLOSED) return;
    RX(this, _N, this.CONNECTING);
    let G = new EX0("error", {
      code: Q,
      message: A
    });
    (B = I5(this, lKA)) == null || B.call(this, G), this.dispatchEvent(G), RX(this, pKA, setTimeout(I5(this, LX0), I5(this, dxA)))
  }, LX0 = new WeakMap, iKA.CONNECTING = 0, iKA.OPEN = 1, iKA.CLOSED = 2
})
// @from(Ln 259905, Col 0)
function nKA(A) {
  if (!A) return {};
  if (A instanceof Headers) return Object.fromEntries(A.entries());
  if (Array.isArray(A)) return Object.fromEntries(A);
  return {
    ...A
  }
}
// @from(Ln 259914, Col 0)
function Q4A(A = fetch, Q) {
  if (!Q) return A;
  return async (B, G) => {
    let Z = {
      ...Q,
      ...G,
      headers: (G === null || G === void 0 ? void 0 : G.headers) ? {
        ...nKA(Q.headers),
        ...nKA(G.headers)
      } : Q.headers
    };
    return A(B, Z)
  }
}
// @from(Ln 259928, Col 0)
async function j35(A) {
  return (await MX0).getRandomValues(new Uint8Array(A))
}
// @from(Ln 259931, Col 0)
async function T35(A) {
  let B = "",
    G = await j35(A);
  for (let Z = 0; Z < A; Z++) {
    let Y = G[Z] % 66;
    B += "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~" [Y]
  }
  return B
}
// @from(Ln 259940, Col 0)
async function P35(A) {
  return await T35(A)
}
// @from(Ln 259943, Col 0)
async function S35(A) {
  let Q = await (await MX0).subtle.digest("SHA-256", new TextEncoder().encode(A));
  return btoa(String.fromCharCode(...new Uint8Array(Q))).replace(/\//g, "_").replace(/\+/g, "-").replace(/=/g, "")
}
// @from(Ln 259947, Col 0)
async function RX0(A) {
  if (!A) A = 43;
  if (A < 43 || A > 128) throw `Expected a length between 43 and 128. Received ${A}.`;
  let Q = await P35(A),
    B = await S35(Q);
  return {
    code_verifier: Q,
    code_challenge: B
  }
}
// @from(Ln 259957, Col 4)
MX0
// @from(Ln 259958, Col 4)
r92 = w(() => {
  MX0 = globalThis.crypto?.webcrypto ?? globalThis.crypto ?? import("node:crypto").then((A) => A.webcrypto)
})
// @from(Ln 259961, Col 4)
ZE
// @from(Ln 259961, Col 8)
t92
// @from(Ln 259961, Col 13)
_X0
// @from(Ln 259961, Col 18)
x35
// @from(Ln 259961, Col 23)
e92
// @from(Ln 259961, Col 28)
A42
// @from(Ln 259961, Col 33)
bG1
// @from(Ln 259961, Col 38)
s92
// @from(Ln 259961, Col 43)
y35
// @from(Ln 259961, Col 48)
v35
// @from(Ln 259961, Col 53)
Q42
// @from(Ln 259961, Col 58)
hEZ
// @from(Ln 259961, Col 63)
gEZ
// @from(Ln 259962, Col 4)
fG1 = w(() => {
  j9();
  ZE = tA0().superRefine((A, Q) => {
    if (!URL.canParse(A)) return Q.addIssue({
      code: O10.custom,
      message: "URL must be parseable",
      fatal: !0
    }), IRA
  }).refine((A) => {
    let Q = new URL(A);
    return Q.protocol !== "javascript:" && Q.protocol !== "data:" && Q.protocol !== "vbscript:"
  }, {
    message: "URL cannot use javascript:, data:, or vbscript: scheme"
  }), t92 = hH({
    resource: h1().url(),
    authorization_servers: iB(ZE).optional(),
    jwks_uri: h1().url().optional(),
    scopes_supported: iB(h1()).optional(),
    bearer_methods_supported: iB(h1()).optional(),
    resource_signing_alg_values_supported: iB(h1()).optional(),
    resource_name: h1().optional(),
    resource_documentation: h1().optional(),
    resource_policy_uri: h1().url().optional(),
    resource_tos_uri: h1().url().optional(),
    tls_client_certificate_bound_access_tokens: RZ().optional(),
    authorization_details_types_supported: iB(h1()).optional(),
    dpop_signing_alg_values_supported: iB(h1()).optional(),
    dpop_bound_access_tokens_required: RZ().optional()
  }), _X0 = hH({
    issuer: h1(),
    authorization_endpoint: ZE,
    token_endpoint: ZE,
    registration_endpoint: ZE.optional(),
    scopes_supported: iB(h1()).optional(),
    response_types_supported: iB(h1()),
    response_modes_supported: iB(h1()).optional(),
    grant_types_supported: iB(h1()).optional(),
    token_endpoint_auth_methods_supported: iB(h1()).optional(),
    token_endpoint_auth_signing_alg_values_supported: iB(h1()).optional(),
    service_documentation: ZE.optional(),
    revocation_endpoint: ZE.optional(),
    revocation_endpoint_auth_methods_supported: iB(h1()).optional(),
    revocation_endpoint_auth_signing_alg_values_supported: iB(h1()).optional(),
    introspection_endpoint: h1().optional(),
    introspection_endpoint_auth_methods_supported: iB(h1()).optional(),
    introspection_endpoint_auth_signing_alg_values_supported: iB(h1()).optional(),
    code_challenge_methods_supported: iB(h1()).optional(),
    client_id_metadata_document_supported: RZ().optional()
  }), x35 = hH({
    issuer: h1(),
    authorization_endpoint: ZE,
    token_endpoint: ZE,
    userinfo_endpoint: ZE.optional(),
    jwks_uri: ZE,
    registration_endpoint: ZE.optional(),
    scopes_supported: iB(h1()).optional(),
    response_types_supported: iB(h1()),
    response_modes_supported: iB(h1()).optional(),
    grant_types_supported: iB(h1()).optional(),
    acr_values_supported: iB(h1()).optional(),
    subject_types_supported: iB(h1()),
    id_token_signing_alg_values_supported: iB(h1()),
    id_token_encryption_alg_values_supported: iB(h1()).optional(),
    id_token_encryption_enc_values_supported: iB(h1()).optional(),
    userinfo_signing_alg_values_supported: iB(h1()).optional(),
    userinfo_encryption_alg_values_supported: iB(h1()).optional(),
    userinfo_encryption_enc_values_supported: iB(h1()).optional(),
    request_object_signing_alg_values_supported: iB(h1()).optional(),
    request_object_encryption_alg_values_supported: iB(h1()).optional(),
    request_object_encryption_enc_values_supported: iB(h1()).optional(),
    token_endpoint_auth_methods_supported: iB(h1()).optional(),
    token_endpoint_auth_signing_alg_values_supported: iB(h1()).optional(),
    display_values_supported: iB(h1()).optional(),
    claim_types_supported: iB(h1()).optional(),
    claims_supported: iB(h1()).optional(),
    service_documentation: h1().optional(),
    claims_locales_supported: iB(h1()).optional(),
    ui_locales_supported: iB(h1()).optional(),
    claims_parameter_supported: RZ().optional(),
    request_parameter_supported: RZ().optional(),
    request_uri_parameter_supported: RZ().optional(),
    require_request_uri_registration: RZ().optional(),
    op_policy_uri: ZE.optional(),
    op_tos_uri: ZE.optional(),
    client_id_metadata_document_supported: RZ().optional()
  }), e92 = CB({
    ...x35.shape,
    ..._X0.pick({
      code_challenge_methods_supported: !0
    }).shape
  }), A42 = CB({
    access_token: h1(),
    id_token: h1().optional(),
    token_type: h1(),
    expires_in: rRA.number().optional(),
    scope: h1().optional(),
    refresh_token: h1().optional()
  }).strip(), bG1 = CB({
    error: h1(),
    error_description: h1().optional(),
    error_uri: h1().optional()
  }), s92 = ZE.optional().or(I9("").transform(() => {
    return
  })), y35 = CB({
    redirect_uris: iB(ZE),
    token_endpoint_auth_method: h1().optional(),
    grant_types: iB(h1()).optional(),
    response_types: iB(h1()).optional(),
    client_name: h1().optional(),
    client_uri: ZE.optional(),
    logo_uri: s92,
    scope: h1().optional(),
    contacts: iB(h1()).optional(),
    tos_uri: s92,
    policy_uri: h1().optional(),
    jwks_uri: ZE.optional(),
    jwks: E10().optional(),
    software_id: h1().optional(),
    software_version: h1().optional(),
    software_statement: h1().optional()
  }).strip(), v35 = CB({
    client_id: h1(),
    client_secret: h1().optional(),
    client_id_issued_at: c7().optional(),
    client_secret_expires_at: c7().optional()
  }).strip(), Q42 = y35.merge(v35), hEZ = CB({
    error: h1(),
    error_description: h1().optional()
  }).strip(), gEZ = CB({
    token: h1(),
    token_type_hint: h1().optional()
  }).strip()
})
// @from(Ln 260096, Col 0)
function B42(A) {
  let Q = typeof A === "string" ? new URL(A) : new URL(A.href);
  return Q.hash = "", Q
}
// @from(Ln 260101, Col 0)
function G42({
  requestedResource: A,
  configuredResource: Q
}) {
  let B = typeof A === "string" ? new URL(A) : new URL(A.href),
    G = typeof Q === "string" ? new URL(Q) : new URL(Q.href);
  if (B.origin !== G.origin) return !1;
  if (B.pathname.length < G.pathname.length) return !1;
  let Z = B.pathname.endsWith("/") ? B.pathname : B.pathname + "/",
    Y = G.pathname.endsWith("/") ? G.pathname : G.pathname + "/";
  return Z.startsWith(Y)
}
// @from(Ln 260113, Col 4)
BK
// @from(Ln 260113, Col 8)
hG1
// @from(Ln 260113, Col 13)
aKA
// @from(Ln 260113, Col 18)
oKA
// @from(Ln 260113, Col 23)
rKA
// @from(Ln 260113, Col 28)
gG1
// @from(Ln 260113, Col 33)
uG1
// @from(Ln 260113, Col 38)
mG1
// @from(Ln 260113, Col 43)
qr
// @from(Ln 260113, Col 47)
dG1
// @from(Ln 260113, Col 52)
cG1
// @from(Ln 260113, Col 57)
pG1
// @from(Ln 260113, Col 62)
lG1
// @from(Ln 260113, Col 67)
iG1
// @from(Ln 260113, Col 72)
nG1
// @from(Ln 260113, Col 77)
sKA
// @from(Ln 260113, Col 82)
aG1
// @from(Ln 260113, Col 87)
oG1
// @from(Ln 260113, Col 92)
Z42
// @from(Ln 260114, Col 4)
Y42 = w(() => {
  BK = class BK extends Error {
    constructor(A, Q) {
      super(A);
      this.errorUri = Q, this.name = this.constructor.name
    }
    toResponseObject() {
      let A = {
        error: this.errorCode,
        error_description: this.message
      };
      if (this.errorUri) A.error_uri = this.errorUri;
      return A
    }
    get errorCode() {
      return this.constructor.errorCode
    }
  };
  hG1 = class hG1 extends BK {};
  hG1.errorCode = "invalid_request";
  aKA = class aKA extends BK {};
  aKA.errorCode = "invalid_client";
  oKA = class oKA extends BK {};
  oKA.errorCode = "invalid_grant";
  rKA = class rKA extends BK {};
  rKA.errorCode = "unauthorized_client";
  gG1 = class gG1 extends BK {};
  gG1.errorCode = "unsupported_grant_type";
  uG1 = class uG1 extends BK {};
  uG1.errorCode = "invalid_scope";
  mG1 = class mG1 extends BK {};
  mG1.errorCode = "access_denied";
  qr = class qr extends BK {};
  qr.errorCode = "server_error";
  dG1 = class dG1 extends BK {};
  dG1.errorCode = "temporarily_unavailable";
  cG1 = class cG1 extends BK {};
  cG1.errorCode = "unsupported_response_type";
  pG1 = class pG1 extends BK {};
  pG1.errorCode = "unsupported_token_type";
  lG1 = class lG1 extends BK {};
  lG1.errorCode = "invalid_token";
  iG1 = class iG1 extends BK {};
  iG1.errorCode = "method_not_allowed";
  nG1 = class nG1 extends BK {};
  nG1.errorCode = "too_many_requests";
  sKA = class sKA extends BK {};
  sKA.errorCode = "invalid_client_metadata";
  aG1 = class aG1 extends BK {};
  aG1.errorCode = "insufficient_scope";
  oG1 = class oG1 extends BK {};
  oG1.errorCode = "invalid_target";
  Z42 = {
    [hG1.errorCode]: hG1,
    [aKA.errorCode]: aKA,
    [oKA.errorCode]: oKA,
    [rKA.errorCode]: rKA,
    [gG1.errorCode]: gG1,
    [uG1.errorCode]: uG1,
    [mG1.errorCode]: mG1,
    [qr.errorCode]: qr,
    [dG1.errorCode]: dG1,
    [cG1.errorCode]: cG1,
    [pG1.errorCode]: pG1,
    [lG1.errorCode]: lG1,
    [iG1.errorCode]: iG1,
    [nG1.errorCode]: nG1,
    [sKA.errorCode]: sKA,
    [aG1.errorCode]: aG1,
    [oG1.errorCode]: oG1
  }
})
// @from(Ln 260187, Col 0)
function k35(A) {
  return ["client_secret_basic", "client_secret_post", "none"].includes(A)
}
// @from(Ln 260191, Col 0)
function b35(A, Q) {
  let B = A.client_secret !== void 0;
  if (Q.length === 0) return B ? "client_secret_post" : "none";
  if ("token_endpoint_auth_method" in A && A.token_endpoint_auth_method && k35(A.token_endpoint_auth_method) && Q.includes(A.token_endpoint_auth_method)) return A.token_endpoint_auth_method;
  if (B && Q.includes("client_secret_basic")) return "client_secret_basic";
  if (B && Q.includes("client_secret_post")) return "client_secret_post";
  if (Q.includes("none")) return "none";
  return B ? "client_secret_post" : "none"
}
// @from(Ln 260201, Col 0)
function f35(A, Q, B, G) {
  let {
    client_id: Z,
    client_secret: Y
  } = Q;
  switch (A) {
    case "client_secret_basic":
      h35(Z, Y, B);
      return;
    case "client_secret_post":
      g35(Z, Y, G);
      return;
    case "none":
      u35(Z, G);
      return;
    default:
      throw Error(`Unsupported client authentication method: ${A}`)
  }
}
// @from(Ln 260221, Col 0)
function h35(A, Q, B) {
  if (!Q) throw Error("client_secret_basic authentication requires a client_secret");
  let G = btoa(`${A}:${Q}`);
  B.set("Authorization", `Basic ${G}`)
}
// @from(Ln 260227, Col 0)
function g35(A, Q, B) {
  if (B.set("client_id", A), Q) B.set("client_secret", Q)
}
// @from(Ln 260231, Col 0)
function u35(A, Q) {
  Q.set("client_id", A)
}
// @from(Ln 260234, Col 0)
async function X42(A) {
  let Q = A instanceof Response ? A.status : void 0,
    B = A instanceof Response ? await A.text() : A;
  try {
    let G = bG1.parse(JSON.parse(B)),
      {
        error: Z,
        error_description: Y,
        error_uri: J
      } = G;
    return new(Z42[Z] || qr)(Y || "", J)
  } catch (G) {
    let Z = `${Q?`HTTP ${Q}: `:""}Invalid OAuth error response: ${G}. Raw body: ${B}`;
    return new qr(Z)
  }
}
// @from(Ln 260250, Col 0)
async function v_(A, Q) {
  var B, G;
  try {
    return await PX0(A, Q)
  } catch (Z) {
    if (Z instanceof aKA || Z instanceof rKA) return await ((B = A.invalidateCredentials) === null || B === void 0 ? void 0 : B.call(A, "all")), await PX0(A, Q);
    else if (Z instanceof oKA) return await ((G = A.invalidateCredentials) === null || G === void 0 ? void 0 : G.call(A, "tokens")), await PX0(A, Q);
    throw Z
  }
}
// @from(Ln 260260, Col 0)
async function PX0(A, {
  serverUrl: Q,
  authorizationCode: B,
  scope: G,
  resourceMetadataUrl: Z,
  fetchFn: Y
}) {
  var J, X;
  let I, D;
  try {
    if (I = await c35(Q, {
        resourceMetadataUrl: Z
      }, Y), I.authorization_servers && I.authorization_servers.length > 0) D = I.authorization_servers[0]
  } catch (O) {}
  if (!D) D = new URL("/", Q);
  let W = await d35(Q, A, I),
    K = await pxA(D, {
      fetchFn: Y
    }),
    V = await Promise.resolve(A.clientInformation());
  if (!V) {
    if (B !== void 0) throw Error("Existing OAuth client information is required when exchanging an authorization code");
    let O = (K === null || K === void 0 ? void 0 : K.client_id_metadata_document_supported) === !0,
      L = A.clientMetadataUrl;
    if (L && !m35(L)) throw new sKA(`clientMetadataUrl must be a valid HTTPS URL with a non-root pathname, got: ${L}`);
    if (O && L) V = {
      client_id: L
    }, await ((J = A.saveClientInformation) === null || J === void 0 ? void 0 : J.call(A, V));
    else {
      if (!A.saveClientInformation) throw Error("OAuth client information must be saveable for dynamic registration");
      let _ = await s35(D, {
        metadata: K,
        clientMetadata: A.clientMetadata,
        fetchFn: Y
      });
      await A.saveClientInformation(_), V = _
    }
  }
  let F = !A.redirectUrl;
  if (B !== void 0 || F) {
    let O = await r35(A, D, {
      metadata: K,
      resource: W,
      authorizationCode: B,
      fetchFn: Y
    });
    return await A.saveTokens(O), "AUTHORIZED"
  }
  let H = await A.tokens();
  if (H === null || H === void 0 ? void 0 : H.refresh_token) try {
    let O = await yX0(D, {
      metadata: K,
      clientInformation: V,
      refreshToken: H.refresh_token,
      resource: W,
      addClientAuthentication: A.addClientAuthentication,
      fetchFn: Y
    });
    return await A.saveTokens(O), "AUTHORIZED"
  } catch (O) {
    if (!(O instanceof BK) || O instanceof qr);
    else throw O
  }
  let E = A.state ? await A.state() : void 0,
    {
      authorizationUrl: z,
      codeVerifier: $
    } = await a35(D, {
      metadata: K,
      clientInformation: V,
      state: E,
      redirectUrl: A.redirectUrl,
      scope: G || ((X = I === null || I === void 0 ? void 0 : I.scopes_supported) === null || X === void 0 ? void 0 : X.join(" ")) || A.clientMetadata.scope,
      resource: W
    });
  return await A.saveCodeVerifier($), await A.redirectToAuthorization(z), "REDIRECT"
}
// @from(Ln 260338, Col 0)
function m35(A) {
  if (!A) return !1;
  try {
    let Q = new URL(A);
    return Q.protocol === "https:" && Q.pathname !== "/"
  } catch (Q) {
    return !1
  }
}
// @from(Ln 260347, Col 0)
async function d35(A, Q, B) {
  let G = B42(A);
  if (Q.validateResourceURL) return await Q.validateResourceURL(G, B === null || B === void 0 ? void 0 : B.resource);
  if (!B) return;
  if (!G42({
      requestedResource: G,
      configuredResource: B.resource
    })) throw Error(`Protected resource ${B.resource} does not match expected ${G} (or origin)`);
  return new URL(B.resource)
}
// @from(Ln 260358, Col 0)
function tKA(A) {
  let Q = A.headers.get("WWW-Authenticate");
  if (!Q) return {};
  let [B, G] = Q.split(" ");
  if (B.toLowerCase() !== "bearer" || !G) return {};
  let Z = SX0(A, "resource_metadata") || void 0,
    Y;
  if (Z) try {
    Y = new URL(Z)
  } catch (I) {}
  let J = SX0(A, "scope") || void 0,
    X = SX0(A, "error") || void 0;
  return {
    resourceMetadataUrl: Y,
    scope: J,
    error: X
  }
}
// @from(Ln 260377, Col 0)
function SX0(A, Q) {
  let B = A.headers.get("WWW-Authenticate");
  if (!B) return null;
  let G = new RegExp(`${Q}=(?:"([^"]+)"|([^\\s,]+))`),
    Z = B.match(G);
  if (Z) return Z[1] || Z[2];
  return null
}
// @from(Ln 260385, Col 0)
async function c35(A, Q, B = fetch) {
  var G, Z;
  let Y = await i35(A, "oauth-protected-resource", B, {
    protocolVersion: Q === null || Q === void 0 ? void 0 : Q.protocolVersion,
    metadataUrl: Q === null || Q === void 0 ? void 0 : Q.resourceMetadataUrl
  });
  if (!Y || Y.status === 404) throw await ((G = Y === null || Y === void 0 ? void 0 : Y.body) === null || G === void 0 ? void 0 : G.cancel()), Error("Resource server does not implement OAuth 2.0 Protected Resource Metadata.");
  if (!Y.ok) throw await ((Z = Y.body) === null || Z === void 0 ? void 0 : Z.cancel()), Error(`HTTP ${Y.status} trying to load well-known OAuth protected resource metadata.`);
  return t92.parse(await Y.json())
}
// @from(Ln 260395, Col 0)
async function xX0(A, Q, B = fetch) {
  try {
    return await B(A, {
      headers: Q
    })
  } catch (G) {
    if (G instanceof TypeError)
      if (Q) return xX0(A, void 0, B);
      else return;
    throw G
  }
}
// @from(Ln 260408, Col 0)
function p35(A, Q = "", B = {}) {
  if (Q.endsWith("/")) Q = Q.slice(0, -1);
  return B.prependPathname ? `${Q}/.well-known/${A}` : `/.well-known/${A}${Q}`
}
// @from(Ln 260412, Col 0)
async function J42(A, Q, B = fetch) {
  return await xX0(A, {
    "MCP-Protocol-Version": Q
  }, B)
}
// @from(Ln 260418, Col 0)
function l35(A, Q) {
  return !A || A.status >= 400 && A.status < 500 && Q !== "/"
}
// @from(Ln 260421, Col 0)
async function i35(A, Q, B, G) {
  var Z, Y;
  let J = new URL(A),
    X = (Z = G === null || G === void 0 ? void 0 : G.protocolVersion) !== null && Z !== void 0 ? Z : Wr,
    I;
  if (G === null || G === void 0 ? void 0 : G.metadataUrl) I = new URL(G.metadataUrl);
  else {
    let W = p35(Q, J.pathname);
    I = new URL(W, (Y = G === null || G === void 0 ? void 0 : G.metadataServerUrl) !== null && Y !== void 0 ? Y : J), I.search = J.search
  }
  let D = await J42(I, X, B);
  if (!(G === null || G === void 0 ? void 0 : G.metadataUrl) && l35(D, J.pathname)) {
    let W = new URL(`/.well-known/${Q}`, J);
    D = await J42(W, X, B)
  }
  return D
}
// @from(Ln 260439, Col 0)
function n35(A) {
  let Q = typeof A === "string" ? new URL(A) : A,
    B = Q.pathname !== "/",
    G = [];
  if (!B) return G.push({
    url: new URL("/.well-known/oauth-authorization-server", Q.origin),
    type: "oauth"
  }), G.push({
    url: new URL("/.well-known/openid-configuration", Q.origin),
    type: "oidc"
  }), G;
  let Z = Q.pathname;
  if (Z.endsWith("/")) Z = Z.slice(0, -1);
  return G.push({
    url: new URL(`/.well-known/oauth-authorization-server${Z}`, Q.origin),
    type: "oauth"
  }), G.push({
    url: new URL(`/.well-known/openid-configuration${Z}`, Q.origin),
    type: "oidc"
  }), G.push({
    url: new URL(`${Z}/.well-known/openid-configuration`, Q.origin),
    type: "oidc"
  }), G
}
// @from(Ln 260463, Col 0)
async function pxA(A, {
  fetchFn: Q = fetch,
  protocolVersion: B = Wr
} = {}) {
  var G;
  let Z = {
      "MCP-Protocol-Version": B,
      Accept: "application/json"
    },
    Y = n35(A);
  for (let {
      url: J,
      type: X
    }
    of Y) {
    let I = await xX0(J, Z, Q);
    if (!I) continue;
    if (!I.ok) {
      if (await ((G = I.body) === null || G === void 0 ? void 0 : G.cancel()), I.status >= 400 && I.status < 500) continue;
      throw Error(`HTTP ${I.status} trying to load ${X==="oauth"?"OAuth":"OpenID provider"} metadata from ${J}`)
    }
    if (X === "oauth") return _X0.parse(await I.json());
    else return e92.parse(await I.json())
  }
  return
}
// @from(Ln 260489, Col 0)
async function a35(A, {
  metadata: Q,
  clientInformation: B,
  redirectUrl: G,
  scope: Z,
  state: Y,
  resource: J
}) {
  let X;
  if (Q) {
    if (X = new URL(Q.authorization_endpoint), !Q.response_types_supported.includes(jX0)) throw Error(`Incompatible auth server: does not support response type ${jX0}`);
    if (Q.code_challenge_methods_supported && !Q.code_challenge_methods_supported.includes(TX0)) throw Error(`Incompatible auth server: does not support code challenge method ${TX0}`)
  } else X = new URL("/authorize", A);
  let I = await RX0(),
    D = I.code_verifier,
    W = I.code_challenge;
  if (X.searchParams.set("response_type", jX0), X.searchParams.set("client_id", B.client_id), X.searchParams.set("code_challenge", W), X.searchParams.set("code_challenge_method", TX0), X.searchParams.set("redirect_uri", String(G)), Y) X.searchParams.set("state", Y);
  if (Z) X.searchParams.set("scope", Z);
  if (Z === null || Z === void 0 ? void 0 : Z.includes("offline_access")) X.searchParams.append("prompt", "consent");
  if (J) X.searchParams.set("resource", J.href);
  return {
    authorizationUrl: X,
    codeVerifier: D
  }
}
// @from(Ln 260515, Col 0)
function o35(A, Q, B) {
  return new URLSearchParams({
    grant_type: "authorization_code",
    code: A,
    code_verifier: Q,
    redirect_uri: String(B)
  })
}
// @from(Ln 260523, Col 0)
async function I42(A, {
  metadata: Q,
  tokenRequestParams: B,
  clientInformation: G,
  addClientAuthentication: Z,
  resource: Y,
  fetchFn: J
}) {
  var X;
  let I = (Q === null || Q === void 0 ? void 0 : Q.token_endpoint) ? new URL(Q.token_endpoint) : new URL("/token", A),
    D = new Headers({
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json"
    });
  if (Y) B.set("resource", Y.href);
  if (Z) await Z(D, B, I, Q);
  else if (G) {
    let K = (X = Q === null || Q === void 0 ? void 0 : Q.token_endpoint_auth_methods_supported) !== null && X !== void 0 ? X : [],
      V = b35(G, K);
    f35(V, G, D, B)
  }
  let W = await (J !== null && J !== void 0 ? J : fetch)(I, {
    method: "POST",
    headers: D,
    body: B
  });
  if (!W.ok) throw await X42(W);
  return A42.parse(await W.json())
}
// @from(Ln 260552, Col 0)
async function yX0(A, {
  metadata: Q,
  clientInformation: B,
  refreshToken: G,
  resource: Z,
  addClientAuthentication: Y,
  fetchFn: J
}) {
  let X = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: G
    }),
    I = await I42(A, {
      metadata: Q,
      tokenRequestParams: X,
      clientInformation: B,
      addClientAuthentication: Y,
      resource: Z,
      fetchFn: J
    });
  return {
    refresh_token: G,
    ...I
  }
}
// @from(Ln 260577, Col 0)
async function r35(A, Q, {
  metadata: B,
  resource: G,
  authorizationCode: Z,
  fetchFn: Y
} = {}) {
  let J = A.clientMetadata.scope,
    X;
  if (A.prepareTokenRequest) X = await A.prepareTokenRequest(J);
  if (!X) {
    if (!Z) throw Error("Either provider.prepareTokenRequest() or authorizationCode is required");
    if (!A.redirectUrl) throw Error("redirectUrl is required for authorization_code flow");
    let D = await A.codeVerifier();
    X = o35(Z, D, A.redirectUrl)
  }
  let I = await A.clientInformation();
  return I42(Q, {
    metadata: B,
    tokenRequestParams: X,
    clientInformation: I !== null && I !== void 0 ? I : void 0,
    addClientAuthentication: A.addClientAuthentication,
    resource: G,
    fetchFn: Y
  })
}
// @from(Ln 260602, Col 0)
async function s35(A, {
  metadata: Q,
  clientMetadata: B,
  fetchFn: G
}) {
  let Z;
  if (Q) {
    if (!Q.registration_endpoint) throw Error("Incompatible auth server: does not support dynamic client registration");
    Z = new URL(Q.registration_endpoint)
  } else Z = new URL("/register", A);
  let Y = await (G !== null && G !== void 0 ? G : fetch)(Z, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(B)
  });
  if (!Y.ok) throw await X42(Y);
  return Q42.parse(await Y.json())
}
// @from(Ln 260622, Col 4)
YE
// @from(Ln 260622, Col 8)
jX0 = "code"
// @from(Ln 260623, Col 2)
TX0 = "S256"
// @from(Ln 260624, Col 4)
lxA = w(() => {
  r92();
  eK();
  fG1();
  fG1();
  Y42();
  YE = class YE extends Error {
    constructor(A) {
      super(A !== null && A !== void 0 ? A : "Unauthorized")
    }
  }
})
// @from(Ln 260636, Col 0)
class rG1 {
  constructor(A, Q) {
    this._url = A, this._resourceMetadataUrl = void 0, this._scope = void 0, this._eventSourceInit = Q === null || Q === void 0 ? void 0 : Q.eventSourceInit, this._requestInit = Q === null || Q === void 0 ? void 0 : Q.requestInit, this._authProvider = Q === null || Q === void 0 ? void 0 : Q.authProvider, this._fetch = Q === null || Q === void 0 ? void 0 : Q.fetch, this._fetchWithInit = Q4A(Q === null || Q === void 0 ? void 0 : Q.fetch, Q === null || Q === void 0 ? void 0 : Q.requestInit)
  }
  async _authThenStart() {
    var A;
    if (!this._authProvider) throw new YE("No auth provider");
    let Q;
    try {
      Q = await v_(this._authProvider, {
        serverUrl: this._url,
        resourceMetadataUrl: this._resourceMetadataUrl,
        scope: this._scope,
        fetchFn: this._fetchWithInit
      })
    } catch (B) {
      throw (A = this.onerror) === null || A === void 0 || A.call(this, B), B
    }
    if (Q !== "AUTHORIZED") throw new YE;
    return await this._startOrAuth()
  }
  async _commonHeaders() {
    var A;
    let Q = {};
    if (this._authProvider) {
      let G = await this._authProvider.tokens();
      if (G) Q.Authorization = `Bearer ${G.access_token}`
    }
    if (this._protocolVersion) Q["mcp-protocol-version"] = this._protocolVersion;
    let B = nKA((A = this._requestInit) === null || A === void 0 ? void 0 : A.headers);
    return new Headers({
      ...Q,
      ...B
    })
  }
  _startOrAuth() {
    var A, Q, B;
    let G = (B = (Q = (A = this === null || this === void 0 ? void 0 : this._eventSourceInit) === null || A === void 0 ? void 0 : A.fetch) !== null && Q !== void 0 ? Q : this._fetch) !== null && B !== void 0 ? B : fetch;
    return new Promise((Z, Y) => {
      this._eventSource = new iKA(this._url.href, {
        ...this._eventSourceInit,
        fetch: async (J, X) => {
          let I = await this._commonHeaders();
          I.set("Accept", "text/event-stream");
          let D = await G(J, {
            ...X,
            headers: I
          });
          if (D.status === 401 && D.headers.has("www-authenticate")) {
            let {
              resourceMetadataUrl: W,
              scope: K
            } = tKA(D);
            this._resourceMetadataUrl = W, this._scope = K
          }
          return D
        }
      }), this._abortController = new AbortController, this._eventSource.onerror = (J) => {
        var X;
        if (J.code === 401 && this._authProvider) {
          this._authThenStart().then(Z, Y);
          return
        }
        let I = new D42(J.code, J.message, J);
        Y(I), (X = this.onerror) === null || X === void 0 || X.call(this, I)
      }, this._eventSource.onopen = () => {}, this._eventSource.addEventListener("endpoint", (J) => {
        var X;
        let I = J;
        try {
          if (this._endpoint = new URL(I.data, this._url), this._endpoint.origin !== this._url.origin) throw Error(`Endpoint origin does not match connection origin: ${this._endpoint.origin}`)
        } catch (D) {
          Y(D), (X = this.onerror) === null || X === void 0 || X.call(this, D), this.close();
          return
        }
        Z()
      }), this._eventSource.onmessage = (J) => {
        var X, I;
        let D = J,
          W;
        try {
          W = Nb.parse(JSON.parse(D.data))
        } catch (K) {
          (X = this.onerror) === null || X === void 0 || X.call(this, K);
          return
        }(I = this.onmessage) === null || I === void 0 || I.call(this, W)
      }
    })
  }
  async start() {
    if (this._eventSource) throw Error("SSEClientTransport already started! If using Client class, note that connect() calls start() automatically.");
    return await this._startOrAuth()
  }
  async finishAuth(A) {
    if (!this._authProvider) throw new YE("No auth provider");
    if (await v_(this._authProvider, {
        serverUrl: this._url,
        authorizationCode: A,
        resourceMetadataUrl: this._resourceMetadataUrl,
        scope: this._scope,
        fetchFn: this._fetchWithInit
      }) !== "AUTHORIZED") throw new YE("Failed to authorize")
  }
  async close() {
    var A, Q, B;
    (A = this._abortController) === null || A === void 0 || A.abort(), (Q = this._eventSource) === null || Q === void 0 || Q.close(), (B = this.onclose) === null || B === void 0 || B.call(this)
  }
  async send(A) {
    var Q, B, G;
    if (!this._endpoint) throw Error("Not connected");
    try {
      let Z = await this._commonHeaders();
      Z.set("content-type", "application/json");
      let Y = {
          ...this._requestInit,
          method: "POST",
          headers: Z,
          body: JSON.stringify(A),
          signal: (Q = this._abortController) === null || Q === void 0 ? void 0 : Q.signal
        },
        J = await ((B = this._fetch) !== null && B !== void 0 ? B : fetch)(this._endpoint, Y);
      if (!J.ok) {
        let X = await J.text().catch(() => null);
        if (J.status === 401 && this._authProvider) {
          let {
            resourceMetadataUrl: I,
            scope: D
          } = tKA(J);
          if (this._resourceMetadataUrl = I, this._scope = D, await v_(this._authProvider, {
              serverUrl: this._url,
              resourceMetadataUrl: this._resourceMetadataUrl,
              scope: this._scope,
              fetchFn: this._fetchWithInit
            }) !== "AUTHORIZED") throw new YE;
          return this.send(A)
        }
        throw Error(`Error POSTing to endpoint (HTTP ${J.status}): ${X}`)
      }
    } catch (Z) {
      throw (G = this.onerror) === null || G === void 0 || G.call(this, Z), Z
    }
  }
  setProtocolVersion(A) {
    this._protocolVersion = A
  }
}
// @from(Ln 260781, Col 4)
D42
// @from(Ln 260782, Col 4)
W42 = w(() => {
  o92();
  eK();
  lxA();
  D42 = class D42 extends Error {
    constructor(A, Q, B) {
      super(`SSE error: ${Q}`);
      this.code = A, this.event = B
    }
  }
})
// @from(Ln 260793, Col 4)
vX0
// @from(Ln 260794, Col 4)
K42 = w(() => {
  HX0();
  vX0 = class vX0 extends TransformStream {
    constructor({
      onError: A,
      onRetry: Q,
      onComment: B
    } = {}) {
      let G;
      super({
        start(Z) {
          G = yG1({
            onEvent: (Y) => {
              Z.enqueue(Y)
            },
            onError(Y) {
              A === "terminate" ? Z.error(Y) : typeof A == "function" && A(Y)
            },
            onRetry: Q,
            onComment: B
          })
        },
        transform(Z) {
          G.feed(Z)
        }
      })
    }
  }
})
// @from(Ln 260823, Col 0)
class kX0 {
  constructor(A, Q) {
    var B;
    this._hasCompletedAuthFlow = !1, this._url = A, this._resourceMetadataUrl = void 0, this._scope = void 0, this._requestInit = Q === null || Q === void 0 ? void 0 : Q.requestInit, this._authProvider = Q === null || Q === void 0 ? void 0 : Q.authProvider, this._fetch = Q === null || Q === void 0 ? void 0 : Q.fetch, this._fetchWithInit = Q4A(Q === null || Q === void 0 ? void 0 : Q.fetch, Q === null || Q === void 0 ? void 0 : Q.requestInit), this._sessionId = Q === null || Q === void 0 ? void 0 : Q.sessionId, this._reconnectionOptions = (B = Q === null || Q === void 0 ? void 0 : Q.reconnectionOptions) !== null && B !== void 0 ? B : t35
  }
  async _authThenStart() {
    var A;
    if (!this._authProvider) throw new YE("No auth provider");
    let Q;
    try {
      Q = await v_(this._authProvider, {
        serverUrl: this._url,
        resourceMetadataUrl: this._resourceMetadataUrl,
        scope: this._scope,
        fetchFn: this._fetchWithInit
      })
    } catch (B) {
      throw (A = this.onerror) === null || A === void 0 || A.call(this, B), B
    }
    if (Q !== "AUTHORIZED") throw new YE;
    return await this._startOrAuthSse({
      resumptionToken: void 0
    })
  }
  async _commonHeaders() {
    var A;
    let Q = {};
    if (this._authProvider) {
      let G = await this._authProvider.tokens();
      if (G) Q.Authorization = `Bearer ${G.access_token}`
    }
    if (this._sessionId) Q["mcp-session-id"] = this._sessionId;
    if (this._protocolVersion) Q["mcp-protocol-version"] = this._protocolVersion;
    let B = nKA((A = this._requestInit) === null || A === void 0 ? void 0 : A.headers);
    return new Headers({
      ...Q,
      ...B
    })
  }
  async _startOrAuthSse(A) {
    var Q, B, G, Z;
    let {
      resumptionToken: Y
    } = A;
    try {
      let J = await this._commonHeaders();
      if (J.set("Accept", "text/event-stream"), Y) J.set("last-event-id", Y);
      let X = await ((Q = this._fetch) !== null && Q !== void 0 ? Q : fetch)(this._url, {
        method: "GET",
        headers: J,
        signal: (B = this._abortController) === null || B === void 0 ? void 0 : B.signal
      });
      if (!X.ok) {
        if (await ((G = X.body) === null || G === void 0 ? void 0 : G.cancel()), X.status === 401 && this._authProvider) return await this._authThenStart();
        if (X.status === 405) return;
        throw new B4A(X.status, `Failed to open SSE stream: ${X.statusText}`)
      }
      this._handleSseStream(X.body, A, !0)
    } catch (J) {
      throw (Z = this.onerror) === null || Z === void 0 || Z.call(this, J), J
    }
  }
  _getNextReconnectionDelay(A) {
    if (this._serverRetryMs !== void 0) return this._serverRetryMs;
    let Q = this._reconnectionOptions.initialReconnectionDelay,
      B = this._reconnectionOptions.reconnectionDelayGrowFactor,
      G = this._reconnectionOptions.maxReconnectionDelay;
    return Math.min(Q * Math.pow(B, A), G)
  }
  _scheduleReconnection(A, Q = 0) {
    var B;
    let G = this._reconnectionOptions.maxRetries;
    if (Q >= G) {
      (B = this.onerror) === null || B === void 0 || B.call(this, Error(`Maximum reconnection attempts (${G}) exceeded.`));
      return
    }
    let Z = this._getNextReconnectionDelay(Q);
    this._reconnectionTimeout = setTimeout(() => {
      this._startOrAuthSse(A).catch((Y) => {
        var J;
        (J = this.onerror) === null || J === void 0 || J.call(this, Error(`Failed to reconnect SSE stream: ${Y instanceof Error?Y.message:String(Y)}`)), this._scheduleReconnection(A, Q + 1)
      })
    }, Z)
  }
  _handleSseStream(A, Q, B) {
    if (!A) return;
    let {
      onresumptiontoken: G,
      replayMessageId: Z
    } = Q, Y, J = !1, X = !1;
    (async () => {
      var D, W, K, V;
      try {
        let F = A.pipeThrough(new TextDecoderStream).pipeThrough(new vX0({
          onRetry: (z) => {
            this._serverRetryMs = z
          }
        })).getReader();
        while (!0) {
          let {
            value: z,
            done: $
          } = await F.read();
          if ($) break;
          if (z.id) Y = z.id, J = !0, G === null || G === void 0 || G(z.id);
          if (!z.data) continue;
          if (!z.event || z.event === "message") try {
            let O = Nb.parse(JSON.parse(z.data));
            if (p9A(O)) {
              if (X = !0, Z !== void 0) O.id = Z
            }(D = this.onmessage) === null || D === void 0 || D.call(this, O)
          } catch (O) {
            (W = this.onerror) === null || W === void 0 || W.call(this, O)
          }
        }
        if ((B || J) && !X && this._abortController && !this._abortController.signal.aborted) this._scheduleReconnection({
          resumptionToken: Y,
          onresumptiontoken: G,
          replayMessageId: Z
        }, 0)
      } catch (F) {
        if ((K = this.onerror) === null || K === void 0 || K.call(this, Error(`SSE stream disconnected: ${F}`)), (B || J) && !X && this._abortController && !this._abortController.signal.aborted) try {
          this._scheduleReconnection({
            resumptionToken: Y,
            onresumptiontoken: G,
            replayMessageId: Z
          }, 0)
        } catch (z) {
          (V = this.onerror) === null || V === void 0 || V.call(this, Error(`Failed to reconnect: ${z instanceof Error?z.message:String(z)}`))
        }
      }
    })()
  }
  async start() {
    if (this._abortController) throw Error("StreamableHTTPClientTransport already started! If using Client class, note that connect() calls start() automatically.");
    this._abortController = new AbortController
  }
  async finishAuth(A) {
    if (!this._authProvider) throw new YE("No auth provider");
    if (await v_(this._authProvider, {
        serverUrl: this._url,
        authorizationCode: A,
        resourceMetadataUrl: this._resourceMetadataUrl,
        scope: this._scope,
        fetchFn: this._fetchWithInit
      }) !== "AUTHORIZED") throw new YE("Failed to authorize")
  }
  async close() {
    var A, Q;
    if (this._reconnectionTimeout) clearTimeout(this._reconnectionTimeout), this._reconnectionTimeout = void 0;
    (A = this._abortController) === null || A === void 0 || A.abort(), (Q = this.onclose) === null || Q === void 0 || Q.call(this)
  }
  async send(A, Q) {
    var B, G, Z, Y, J;
    try {
      let {
        resumptionToken: X,
        onresumptiontoken: I
      } = Q || {};
      if (X) {
        this._startOrAuthSse({
          resumptionToken: X,
          replayMessageId: BxA(A) ? A.id : void 0
        }).catch((z) => {
          var $;
          return ($ = this.onerror) === null || $ === void 0 ? void 0 : $.call(this, z)
        });
        return
      }
      let D = await this._commonHeaders();
      D.set("content-type", "application/json"), D.set("accept", "application/json, text/event-stream");
      let W = {
          ...this._requestInit,
          method: "POST",
          headers: D,
          body: JSON.stringify(A),
          signal: (B = this._abortController) === null || B === void 0 ? void 0 : B.signal
        },
        K = await ((G = this._fetch) !== null && G !== void 0 ? G : fetch)(this._url, W),
        V = K.headers.get("mcp-session-id");
      if (V) this._sessionId = V;
      if (!K.ok) {
        let z = await K.text().catch(() => null);
        if (K.status === 401 && this._authProvider) {
          if (this._hasCompletedAuthFlow) throw new B4A(401, "Server returned 401 after successful authentication");
          let {
            resourceMetadataUrl: $,
            scope: O
          } = tKA(K);
          if (this._resourceMetadataUrl = $, this._scope = O, await v_(this._authProvider, {
              serverUrl: this._url,
              resourceMetadataUrl: this._resourceMetadataUrl,
              scope: this._scope,
              fetchFn: this._fetchWithInit
            }) !== "AUTHORIZED") throw new YE;
          return this._hasCompletedAuthFlow = !0, this.send(A)
        }
        if (K.status === 403 && this._authProvider) {
          let {
            resourceMetadataUrl: $,
            scope: O,
            error: L
          } = tKA(K);
          if (L === "insufficient_scope") {
            let M = K.headers.get("WWW-Authenticate");
            if (this._lastUpscopingHeader === M) throw new B4A(403, "Server returned 403 after trying upscoping");
            if (O) this._scope = O;
            if ($) this._resourceMetadataUrl = $;
            if (this._lastUpscopingHeader = M !== null && M !== void 0 ? M : void 0, await v_(this._authProvider, {
                serverUrl: this._url,
                resourceMetadataUrl: this._resourceMetadataUrl,
                scope: this._scope,
                fetchFn: this._fetch
              }) !== "AUTHORIZED") throw new YE;
            return this.send(A)
          }
        }
        throw new B4A(K.status, `Error POSTing to endpoint: ${z}`)
      }
      if (this._hasCompletedAuthFlow = !1, this._lastUpscopingHeader = void 0, K.status === 202) {
        if (await ((Z = K.body) === null || Z === void 0 ? void 0 : Z.cancel()), l12(A)) this._startOrAuthSse({
          resumptionToken: void 0
        }).catch((z) => {
          var $;
          return ($ = this.onerror) === null || $ === void 0 ? void 0 : $.call(this, z)
        });
        return
      }
      let H = (Array.isArray(A) ? A : [A]).filter((z) => ("method" in z) && ("id" in z) && z.id !== void 0).length > 0,
        E = K.headers.get("content-type");
      if (H)
        if (E === null || E === void 0 ? void 0 : E.includes("text/event-stream")) this._handleSseStream(K.body, {
          onresumptiontoken: I
        }, !1);
        else if (E === null || E === void 0 ? void 0 : E.includes("application/json")) {
        let z = await K.json(),
          $ = Array.isArray(z) ? z.map((O) => Nb.parse(O)) : [Nb.parse(z)];
        for (let O of $)(Y = this.onmessage) === null || Y === void 0 || Y.call(this, O)
      } else throw new B4A(-1, `Unexpected content type: ${E}`)
    } catch (X) {
      throw (J = this.onerror) === null || J === void 0 || J.call(this, X), X
    }
  }
  get sessionId() {
    return this._sessionId
  }
  async terminateSession() {
    var A, Q, B, G;
    if (!this._sessionId) return;
    try {
      let Z = await this._commonHeaders(),
        Y = {
          ...this._requestInit,
          method: "DELETE",
          headers: Z,
          signal: (A = this._abortController) === null || A === void 0 ? void 0 : A.signal
        },
        J = await ((Q = this._fetch) !== null && Q !== void 0 ? Q : fetch)(this._url, Y);
      if (await ((B = J.body) === null || B === void 0 ? void 0 : B.cancel()), !J.ok && J.status !== 405) throw new B4A(J.status, `Failed to terminate session: ${J.statusText}`);
      this._sessionId = void 0
    } catch (Z) {
      throw (G = this.onerror) === null || G === void 0 || G.call(this, Z), Z
    }
  }
  setProtocolVersion(A) {
    this._protocolVersion = A
  }
  get protocolVersion() {
    return this._protocolVersion
  }
  async resumeStream(A, Q) {
    await this._startOrAuthSse({
      resumptionToken: A,
      onresumptiontoken: Q === null || Q === void 0 ? void 0 : Q.onresumptiontoken
    })
  }
}
// @from(Ln 261100, Col 4)
t35
// @from(Ln 261100, Col 9)
B4A
// @from(Ln 261101, Col 4)
V42 = w(() => {
  eK();
  lxA();
  K42();
  t35 = {
    initialReconnectionDelay: 1000,
    maxReconnectionDelay: 30000,
    reconnectionDelayGrowFactor: 1.5,
    maxRetries: 2
  };
  B4A = class B4A extends Error {
    constructor(A, Q) {
      super(`Streamable HTTP error: ${Q}`);
      this.code = A
    }
  }
})
// @from(Ln 261119, Col 0)
function e35() {
  let A = lb0();
  if (A !== void 0) return A;
  let Q = process.env.CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR;
  if (!Q) return A7A(null), null;
  let B = parseInt(Q, 10);
  if (Number.isNaN(B)) return k(`CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR must be a valid file descriptor number, got: ${Q}`, {
    level: "error"
  }), A7A(null), null;
  try {
    let G = vA(),
      Z = process.platform === "darwin" || process.platform === "freebsd" ? `/dev/fd/${B}` : `/proc/self/fd/${B}`,
      Y = G.readFileSync(Z, {
        encoding: "utf8"
      }).trim();
    if (!Y) return k("File descriptor contained empty token", {
      level: "error"
    }), A7A(null), null;
    return k(`Successfully read token from file descriptor ${B}`), A7A(Y), Y
  } catch (G) {
    return k(`Failed to read token from file descriptor ${B}: ${G instanceof Error?G.message:String(G)}`, {
      level: "error"
    }), A7A(null), null
  }
}
// @from(Ln 261145, Col 0)
function G4A() {
  let A = process.env.CLAUDE_CODE_SESSION_ACCESS_TOKEN;
  if (A) return A;
  return e35()
}
// @from(Ln 261150, Col 4)
sG1 = w(() => {
  T1();
  DQ();
  C0()
})
// @from(Ln 261156, Col 0)
function F42(A) {
  tG1 = A
}
// @from(Ln 261160, Col 0)
function bX0() {
  tG1 = null
}
// @from(Ln 261164, Col 0)
function H42() {
  tG1?.()
}
// @from(Ln 261168, Col 0)
function E42() {
  return tG1 !== null
}
// @from(Ln 261171, Col 4)
tG1 = null
// @from(Ln 261173, Col 0)
function A85(A) {
  let Q = A,
    B = "",
    G = 0,
    Z = 10;
  while (Q !== B && G < Z) B = Q, Q = Q.normalize("NFKC"), Q = Q.replace(/[\p{Cf}\p{Co}\p{Cn}]/gu, ""), Q = Q.replace(/[\u200B-\u200F]/g, "").replace(/[\u202A-\u202E]/g, "").replace(/[\u2066-\u2069]/g, "").replace(/[\uFEFF]/g, "").replace(/[\uE000-\uF8FF]/g, ""), G++;
  if (G >= Z) throw Error(`Unicode sanitization reached maximum iterations (${Z}) for input: ${A.slice(0,100)}`);
  return Q
}
// @from(Ln 261183, Col 0)
function Nr(A) {
  if (typeof A === "string") return A85(A);
  if (Array.isArray(A)) return A.map(Nr);
  if (A !== null && typeof A === "object") {
    let Q = {};
    for (let [B, G] of Object.entries(A)) Q[Nr(B)] = Nr(G);
    return Q
  }
  return A
}
// @from(Ln 261194, Col 0)
function eG1() {
  return parseInt(process.env.MAX_MCP_OUTPUT_TOKENS ?? "25000", 10)
}
// @from(Ln 261198, Col 0)
function $42(A) {
  return A.type === "text"
}
// @from(Ln 261202, Col 0)
function C42(A) {
  return A.type === "image"
}
// @from(Ln 261206, Col 0)
function fX0(A) {
  if (!A) return 0;
  if (typeof A === "string") return l7(A);
  return A.reduce((Q, B) => {
    if ($42(B)) return Q + l7(B.text);
    else if (C42(B)) return Q + z42;
    return Q
  }, 0)
}
// @from(Ln 261216, Col 0)
function B85() {
  return eG1() * 4
}
// @from(Ln 261220, Col 0)
function G85() {
  return `

[OUTPUT TRUNCATED - exceeded ${eG1()} token limit]

The tool output was truncated. If this MCP server provides pagination or filtering tools, use them to retrieve specific portions of the data. If pagination is not available, inform the user that you are working with truncated output and results may be incomplete.`
}
// @from(Ln 261228, Col 0)
function Z85(A, Q) {
  if (A.length <= Q) return A;
  return A.slice(0, Q)
}
// @from(Ln 261232, Col 0)
async function Y85(A, Q) {
  let B = [],
    G = 0;
  for (let Z of A)
    if ($42(Z)) {
      let Y = Q - G;
      if (Y <= 0) break;
      if (Z.text.length <= Y) B.push(Z), G += Z.text.length;
      else {
        B.push({
          type: "text",
          text: Z.text.slice(0, Y)
        });
        break
      }
    } else if (C42(Z)) {
    let Y = z42 * 4;
    if (G + Y <= Q) B.push(Z), G += Y;
    else {
      let J = Q - G;
      if (J > 0) {
        let X = Math.floor(J * 0.75);
        try {
          let I = await OeB(Z, X);
          if (B.push(I), I.source.type === "base64") G += I.source.data.length;
          else G += Y
        } catch {}
      }
    }
  } else B.push(Z);
  return B
}
// @from(Ln 261264, Col 0)
async function ixA(A) {
  if (!A) return !1;
  if (fX0(A) <= eG1() * Q85) return !1;
  try {
    let G = await gSA(typeof A === "string" ? [{
      role: "user",
      content: A
    }] : [{
      role: "user",
      content: A
    }], []);
    return !!(G && G > eG1())
  } catch (B) {
    return e(B instanceof Error ? B : Error(String(B))), !1
  }
}
// @from(Ln 261280, Col 0)
async function J85(A) {
  if (!A) return A;
  let Q = B85(),
    B = G85();
  if (typeof A === "string") return Z85(A, Q) + B;
  else {
    let G = await Y85(A, Q);
    return G.push({
      type: "text",
      text: B
    }), G
  }
}
// @from(Ln 261293, Col 0)
async function hX0(A) {
  if (!await ixA(A)) return A;
  return await J85(A)
}
// @from(Ln 261297, Col 4)
Q85 = 0.5
// @from(Ln 261298, Col 2)
z42 = 1600
// @from(Ln 261299, Col 4)
AZ1 = w(() => {
  qN();
  v1();
  Ib()
})
// @from(Ln 261305, Col 0)
function QZ1(A, Q) {
  switch (A) {
    case "toolResult":
      return "Plain text";
    case "structuredContent":
      return Q ? `JSON with schema: ${Q}` : "JSON";
    case "contentArray":
      return Q ? `JSON array with schema: ${Q}` : "JSON array"
  }
}
// @from(Ln 261316, Col 0)
function BZ1(A, Q, B, G) {
  let Z = `Error: result (${Q.toLocaleString()} characters) exceeds maximum allowed tokens. Output has been saved to ${A}.
Format: ${B}
Use offset and limit parameters to read specific portions of the file, the ${DI} tool to search for specific content, and jq to make structured queries.
REQUIREMENTS FOR SUMMARIZATION/ANALYSIS/REVIEW:
- You MUST read the content from the file at ${A} in sequential chunks until 100% of the content has been read.
`,
    Y = G ? `- If you receive truncation warnings when reading the file ("[N lines truncated]"), reduce the chunk size until you have read 100% of the content without truncation ***DO NOT PROCEED UNTIL YOU HAVE DONE THIS***. Bash output is limited to ${G.toLocaleString()} chars.
` : `- If you receive truncation warnings when reading the file, reduce the chunk size until you have read 100% of the content without truncation.
`,
    J = `- Before producing ANY summary or analysis, you MUST explicitly describe what portion of the content you have read. ***If you did not read the entire content, you MUST explicitly state this.***
`;
  return Z + Y + `- Before producing ANY summary or analysis, you MUST explicitly describe what portion of the content you have read. ***If you did not read the entire content, you MUST explicitly state this.***
`
}
// @from(Ln 261331, Col 4)
gX0 = w(() => {
  wP()
})
// @from(Ln 261334, Col 4)
uX0 = 4
// @from(Ln 261335, Col 2)
U42 = 400000
// @from(Ln 261336, Col 2)
Mb = 50
// @from(Ln 261346, Col 0)
function W85() {
  return mX0(QV(EQ()), q0())
}
// @from(Ln 261350, Col 0)
function ZZ1() {
  return mX0(W85(), dX0)
}
// @from(Ln 261353, Col 0)
async function K85() {
  try {
    await X85(ZZ1(), {
      recursive: !0
    })
  } catch {}
}
// @from(Ln 261360, Col 0)
async function Z4A(A, Q) {
  await K85();
  let B = Array.isArray(A),
    G = B ? "json" : "txt",
    Z = mX0(ZZ1(), `${Q}.${G}`),
    Y = B ? eA(A, null, 2) : A,
    J = !1;
  try {
    await D85(Z), J = !0
  } catch {}
  if (!J) {
    try {
      await I85(Z, Y, "utf-8")
    } catch (D) {
      let W = D instanceof Error ? D : Error(String(D));
      return e(W), {
        error: E85(W)
      }
    }
    k(`Persisted tool result to ${Z} (${xD(Y.length)})`)
  }
  let {
    preview: X,
    hasMore: I
  } = H85(Y, q42);
  return {
    filepath: Z,
    originalSize: Y.length,
    isJson: B,
    preview: X,
    hasMore: I
  }
}
// @from(Ln 261394, Col 0)
function V85(A) {
  let Q = `${GZ1}
`;
  return Q += `Output too large (${xD(A.originalSize)}). Full output saved to: ${A.filepath}

`, Q += `Preview (first ${xD(q42)}):
`, Q += A.preview, Q += A.hasMore ? `
...
` : `
`, Q += cX0, Q
}
// @from(Ln 261405, Col 0)
async function YZ1(A, Q, B) {
  let G = A.mapToolResultToToolResultBlockParam(Q, B);
  return F85(G, A.name, A.maxResultSizeChars)
}
// @from(Ln 261409, Col 0)
async function F85(A, Q, B) {
  let G = A.content;
  if (!G) return A;
  if (Array.isArray(G)) {
    if (G.some((D) => typeof D === "object" && ("type" in D) && D.type === "image")) return A
  }
  if ((typeof G === "string" ? G.length : eA(G).length) <= (B ?? U42)) return A;
  let J = await Z4A(G, A.tool_use_id);
  if (Y4A(J)) return A;
  let X = V85(J);
  return l("tengu_tool_result_persisted", {
    toolName: k9(Q),
    originalSizeBytes: J.originalSize,
    persistedSizeBytes: X.length,
    estimatedOriginalTokens: Math.ceil(J.originalSize / uX0),
    estimatedPersistedTokens: Math.ceil(X.length / uX0)
  }), {
    ...A,
    content: X
  }
}
// @from(Ln 261431, Col 0)
function H85(A, Q) {
  if (A.length <= Q) return {
    preview: A,
    hasMore: !1
  };
  let G = A.slice(0, Q).lastIndexOf(`
`),
    Z = G > Q * 0.5 ? G : Q;
  return {
    preview: A.slice(0, Z),
    hasMore: !0
  }
}
// @from(Ln 261445, Col 0)
function Y4A(A) {
  return "error" in A
}
// @from(Ln 261449, Col 0)
function E85(A) {
  let Q = A;
  if (Q.code) switch (Q.code) {
    case "ENOENT":
      return `Directory not found: ${Q.path??"unknown path"}`;
    case "EACCES":
      return `Permission denied: ${Q.path??"unknown path"}`;
    case "ENOSPC":
      return "No space left on device";
    case "EROFS":
      return "Read-only file system";
    case "EMFILE":
      return "Too many open files";
    case "EEXIST":
      return `File already exists: ${Q.path??"unknown path"}`;
    default:
      return `${Q.code}: ${Q.message}`
  }
  return A.message
}
// @from(Ln 261469, Col 4)
dX0 = "tool-results"
// @from(Ln 261470, Col 2)
GZ1 = "<persisted-output>"
// @from(Ln 261471, Col 2)
cX0 = "</persisted-output>"
// @from(Ln 261472, Col 2)
pX0 = "[Old tool result content cleared]"
// @from(Ln 261473, Col 2)
q42 = 2000
// @from(Ln 261474, Col 4)
wr = w(() => {
  T1();
  v1();
  y9();
  Z0();
  hW();
  C0();
  d4();
  A0()
})
// @from(Ln 261485, Col 0)
function N42(A) {
  let Q = A.trim(),
    B = Q.split(/\s+/)[0]?.toLowerCase();
  if (!B) return;
  if (B === "npx" || B === "bunx") {
    let G = Q.split(/\s+/)[1]?.toLowerCase();
    if (G && G in lX0) return lX0[G]
  }
  return lX0[B]
}
// @from(Ln 261496, Col 0)
function w42(A) {
  for (let {
      pattern: Q,
      tool: B
    }
    of z85)
    if (Q.test(A)) return B;
  return
}
// @from(Ln 261505, Col 4)
lX0
// @from(Ln 261505, Col 9)
z85
// @from(Ln 261506, Col 4)
iX0 = w(() => {
  lX0 = {
    src: "sourcegraph",
    cody: "cody",
    aider: "aider",
    tabby: "tabby",
    tabnine: "tabnine",
    augment: "augment",
    pieces: "pieces",
    qodo: "qodo",
    aide: "aide",
    hound: "hound",
    seagoat: "seagoat",
    bloop: "bloop",
    gitloop: "gitloop",
    q: "amazon-q",
    gemini: "gemini"
  }, z85 = [{
    pattern: /^sourcegraph$/i,
    tool: "sourcegraph"
  }, {
    pattern: /^cody$/i,
    tool: "cody"
  }, {
    pattern: /^openctx$/i,
    tool: "openctx"
  }, {
    pattern: /^aider$/i,
    tool: "aider"
  }, {
    pattern: /^continue$/i,
    tool: "continue"
  }, {
    pattern: /^github[-_]?copilot$/i,
    tool: "github-copilot"
  }, {
    pattern: /^copilot$/i,
    tool: "github-copilot"
  }, {
    pattern: /^cursor$/i,
    tool: "cursor"
  }, {
    pattern: /^tabby$/i,
    tool: "tabby"
  }, {
    pattern: /^codeium$/i,
    tool: "codeium"
  }, {
    pattern: /^tabnine$/i,
    tool: "tabnine"
  }, {
    pattern: /^augment[-_]?code$/i,
    tool: "augment"
  }, {
    pattern: /^augment$/i,
    tool: "augment"
  }, {
    pattern: /^windsurf$/i,
    tool: "windsurf"
  }, {
    pattern: /^aide$/i,
    tool: "aide"
  }, {
    pattern: /^codestory$/i,
    tool: "aide"
  }, {
    pattern: /^pieces$/i,
    tool: "pieces"
  }, {
    pattern: /^qodo$/i,
    tool: "qodo"
  }, {
    pattern: /^amazon[-_]?q$/i,
    tool: "amazon-q"
  }, {
    pattern: /^gemini[-_]?code[-_]?assist$/i,
    tool: "gemini"
  }, {
    pattern: /^gemini$/i,
    tool: "gemini"
  }, {
    pattern: /^hound$/i,
    tool: "hound"
  }, {
    pattern: /^seagoat$/i,
    tool: "seagoat"
  }, {
    pattern: /^bloop$/i,
    tool: "bloop"
  }, {
    pattern: /^gitloop$/i,
    tool: "gitloop"
  }, {
    pattern: /^claude[-_]?context$/i,
    tool: "claude-context"
  }, {
    pattern: /^code[-_]?index[-_]?mcp$/i,
    tool: "code-index-mcp"
  }, {
    pattern: /^code[-_]?index$/i,
    tool: "code-index-mcp"
  }, {
    pattern: /^local[-_]?code[-_]?search$/i,
    tool: "local-code-search"
  }, {
    pattern: /^codebase$/i,
    tool: "autodev-codebase"
  }, {
    pattern: /^autodev[-_]?codebase$/i,
    tool: "autodev-codebase"
  }, {
    pattern: /^code[-_]?context$/i,
    tool: "claude-context"
  }]
})
// @from(Ln 261621, Col 0)
class JZ1 {
  ws;
  started = !1;
  opened;
  constructor(A) {
    this.ws = A;
    this.opened = new Promise((Q, B) => {
      if (this.ws.readyState === Ok.OPEN) Q();
      else this.ws.on("open", () => {
        Q()
      }), this.ws.on("error", (G) => {
        OB("error", "mcp_websocket_connect_fail"), B(G)
      })
    }), this.ws.on("message", this.onMessageHandler), this.ws.on("error", this.onErrorHandler), this.ws.on("close", this.onCloseHandler)
  }
  onclose;
  onerror;
  onmessage;
  onMessageHandler = (A) => {
    try {
      let Q = AQ(A.toString("utf-8")),
        B = Nb.parse(Q);
      this.onmessage?.(B)
    } catch (Q) {
      this.onErrorHandler(Q)
    }
  };
  onErrorHandler = (A) => {
    OB("error", "mcp_websocket_message_fail"), this.onerror?.(A instanceof Error ? A : Error("Failed to process message"))
  };
  onCloseHandler = () => {
    this.onclose?.(), this.ws.off("message", this.onMessageHandler), this.ws.off("error", this.onErrorHandler), this.ws.off("close", this.onCloseHandler)
  };
  async start() {
    if (this.started) throw Error("Start can only be called once per transport.");
    if (await this.opened, this.ws.readyState !== Ok.OPEN) throw OB("error", "mcp_websocket_start_not_opened"), Error("WebSocket is not open. Cannot start transport.");
    this.started = !0
  }
  async close() {
    if (this.ws.readyState === Ok.OPEN || this.ws.readyState === Ok.CONNECTING) this.ws.close();
    this.onCloseHandler()
  }
  async send(A) {
    if (this.ws.readyState !== Ok.OPEN) throw OB("error", "mcp_websocket_send_not_opened"), Error("WebSocket is not open. Cannot send message.");
    let Q = eA(A);
    try {
      await new Promise((B, G) => {
        this.ws.send(Q, (Z) => {
          if (Z) G(Z);
          else B()
        })
      })
    } catch (B) {
      throw this.onErrorHandler(B), B
    }
  }
}
// @from(Ln 261678, Col 4)
L42 = w(() => {
  v_A();
  eK();
  PL();
  A0()
})
// @from(Ln 261684, Col 4)
O42 = ""
// @from(Ln 261685, Col 2)
M42 = ""
// @from(Ln 261687, Col 0)
function R42(A) {
  if (Object.keys(A).length === 0) return null;
  return Object.entries(A).map(([Q, B]) => `${Q}: ${eA(B)}`).join(", ")
}
// @from(Ln 261692, Col 0)
function _42() {
  return WZ.createElement(w7, null)
}
// @from(Ln 261696, Col 0)
function j42(A, {
  verbose: Q
}) {
  return WZ.createElement(X5, {
    result: A,
    verbose: Q
  })
}
// @from(Ln 261705, Col 0)
function T42() {
  return null
}
// @from(Ln 261709, Col 0)
function XZ1(A, Q, {
  verbose: B
}) {
  let G = A,
    Z = fX0(G),
    J = Z > $85 ? `${tA.warning} Large MCP response (~${X8(Z)} tokens), this can fill up context quickly` : null,
    X;
  if (Array.isArray(G)) {
    let I = G.map((D, W) => {
      if (D.type === "image") return WZ.createElement(T, {
        key: W,
        justifyContent: "space-between",
        overflowX: "hidden",
        width: "100%"
      }, WZ.createElement(x0, {
        height: 1
      }, WZ.createElement(C, null, "[Image]")));
      let K = D.type === "text" && "text" in D && D.text !== null && D.text !== void 0 ? String(D.text) : "";
      return WZ.createElement(Eb, {
        key: W,
        content: K,
        verbose: B
      })
    });
    X = WZ.createElement(T, {
      flexDirection: "column",
      width: "100%"
    }, I)
  } else if (!G) X = WZ.createElement(T, {
    justifyContent: "space-between",
    overflowX: "hidden",
    width: "100%"
  }, WZ.createElement(x0, {
    height: 1
  }, WZ.createElement(C, {
    dimColor: !0
  }, "(No content)")));
  else X = WZ.createElement(Eb, {
    content: G,
    verbose: B
  });
  if (J) return WZ.createElement(T, {
    flexDirection: "column"
  }, WZ.createElement(x0, {
    height: 1
  }, WZ.createElement(C, {
    color: "warning"
  }, J)), X);
  return X
}
// @from(Ln 261759, Col 4)
WZ
// @from(Ln 261759, Col 8)
$85 = 1e4
// @from(Ln 261760, Col 4)
nX0 = w(() => {
  fA();
  tH();
  eW();
  LKA();
  c4();
  B2();
  AZ1();
  A0();
  WZ = c(QA(), 1)
})
// @from(Ln 261771, Col 4)
C85
// @from(Ln 261771, Col 9)
U85
// @from(Ln 261771, Col 14)
P42
// @from(Ln 261772, Col 4)
S42 = w(() => {
  j9();
  nX0();
  C85 = m.object({}).passthrough(), U85 = m.string().describe("MCP tool execution result"), P42 = {
    isMcp: !0,
    isEnabled() {
      return !0
    },
    isConcurrencySafe() {
      return !1
    },
    isReadOnly() {
      return !1
    },
    isDestructive() {
      return !1
    },
    isOpenWorld() {
      return !1
    },
    name: "mcp",
    maxResultSizeChars: 1e5,
    async description() {
      return M42
    },
    async prompt() {
      return O42
    },
    inputSchema: C85,
    outputSchema: U85,
    async call() {
      return {
        data: ""
      }
    },
    async checkPermissions() {
      return {
        behavior: "passthrough",
        message: "MCPTool requires permission."
      }
    },
    renderToolUseMessage: R42,
    userFacingName: () => "mcp",
    renderToolUseRejectedMessage: _42,
    renderToolUseErrorMessage: j42,
    renderToolUseProgressMessage: T42,
    renderToolResultMessage: XZ1,
    mapToolResultToToolResultBlockParam(A, Q) {
      return {
        tool_use_id: Q,
        type: "tool_result",
        content: A
      }
    }
  }
})
// @from(Ln 261828, Col 4)
x42 = `
Lists available resources from configured MCP servers.
Each resource object includes a 'server' field indicating which server it's from.

Usage examples:
- List all resources from all servers: \`listMcpResources\`
- List resources from a specific server: \`listMcpResources({ server: "myserver" })\`
`
// @from(Ln 261836, Col 2)
y42 = `
List available resources from configured MCP servers.
Each returned resource will include all standard MCP resource fields plus a 'server' field 
indicating which server the resource belongs to.

Parameters:
- server (optional): The name of a specific MCP server to get resources from. If not provided,
  resources from all servers will be returned.
`
// @from(Ln 261846, Col 0)
function v42(A) {
  return A.server ? `List MCP resources from server "${A.server}"` : "List all MCP resources"
}
// @from(Ln 261850, Col 0)
function k42() {
  return oC.createElement(w7, null)
}
// @from(Ln 261854, Col 0)
function b42(A, {
  verbose: Q
}) {
  return oC.createElement(X5, {
    result: A,
    verbose: Q
  })
}
// @from(Ln 261863, Col 0)
function f42() {
  return null
}
// @from(Ln 261867, Col 0)
function h42(A, Q, {
  verbose: B
}) {
  if (!A || A.length === 0) return oC.createElement(T, {
    justifyContent: "space-between",
    overflowX: "hidden",
    width: "100%"
  }, oC.createElement(T, {
    flexDirection: "row"
  }, oC.createElement(C, null, "  ⎿  "), oC.createElement(C, {
    dimColor: !0
  }, "(No resources found)")));
  let G = eA(A, null, 2);
  return oC.createElement(Eb, {
    content: G,
    verbose: B
  })
}
// @from(Ln 261885, Col 4)
oC
// @from(Ln 261886, Col 4)
g42 = w(() => {
  fA();
  tH();
  eW();
  LKA();
  A0();
  oC = c(QA(), 1)
})
// @from(Ln 261894, Col 4)
q85
// @from(Ln 261894, Col 9)
N85
// @from(Ln 261894, Col 14)
Ud
// @from(Ln 261895, Col 4)
IZ1 = w(() => {
  j9();
  eK();
  v1();
  jN();
  g42();
  A0();
  q85 = m.object({
    server: m.string().optional().describe("Optional server name to filter resources by")
  }), N85 = m.array(m.object({
    uri: m.string().describe("Resource URI"),
    name: m.string().describe("Resource name"),
    mimeType: m.string().optional().describe("MIME type of the resource"),
    description: m.string().optional().describe("Resource description"),
    server: m.string().describe("Server that provides this resource")
  })), Ud = {
    isEnabled() {
      return !0
    },
    isConcurrencySafe() {
      return !0
    },
    isReadOnly() {
      return !0
    },
    name: "ListMcpResourcesTool",
    maxResultSizeChars: 1e5,
    async description() {
      return x42
    },
    async prompt() {
      return y42
    },
    inputSchema: q85,
    outputSchema: N85,
    async call(A, {
      options: {
        mcpClients: Q
      }
    }) {
      let B = [],
        {
          server: G
        } = A,
        Z = G ? Q.filter((Y) => Y.name === G) : Q;
      if (G && Z.length === 0) throw Error(`Server "${G}" not found. Available servers: ${Q.map((Y)=>Y.name).join(", ")}`);
      for (let Y of Z) {
        if (Y.type !== "connected") continue;
        try {
          if (!Y.capabilities?.resources) continue;
          let X = await (await eKA(Y)).client.request({
            method: "resources/list"
          }, l9A);
          if (!X.resources) continue;
          let I = X.resources.map((D) => ({
            ...D,
            server: Y.name
          }));
          B.push(...I)
        } catch (J) {
          NZ(Y.name, `Failed to fetch resources: ${J instanceof Error?J.message:String(J)}`)
        }
      }
      return {
        data: B
      }
    },
    async checkPermissions(A) {
      return {
        behavior: "allow",
        updatedInput: A
      }
    },
    renderToolUseMessage: v42,
    userFacingName: () => "listMcpResources",
    renderToolUseRejectedMessage: k42,
    renderToolUseErrorMessage: b42,
    renderToolUseProgressMessage: f42,
    renderToolResultMessage: h42,
    mapToolResultToToolResultBlockParam(A, Q) {
      return {
        tool_use_id: Q,
        type: "tool_result",
        content: eA(A)
      }
    }
  }
})
// @from(Ln 261983, Col 4)
u42 = `
Reads a specific resource from an MCP server.
- server: The name of the MCP server to read from
- uri: The URI of the resource to read

Usage examples:
- Read a resource from a server: \`readMcpResource({ server: "myserver", uri: "my-resource-uri" })\`
`
// @from(Ln 261991, Col 2)
m42 = `
Reads a specific resource from an MCP server, identified by server name and resource URI.

Parameters:
- server (required): The name of the MCP server from which to read the resource
- uri (required): The URI of the resource to read
`
// @from(Ln 261999, Col 0)
function d42(A) {
  if (!A.uri || !A.server) return null;
  return `Read resource "${A.uri}" from server "${A.server}"`
}
// @from(Ln 262004, Col 0)
function c42() {
  return "readMcpResource"
}
// @from(Ln 262008, Col 0)
function p42() {
  return WO.createElement(w7, null)
}
// @from(Ln 262012, Col 0)
function l42(A, {
  verbose: Q
}) {
  return WO.createElement(X5, {
    result: A,
    verbose: Q
  })
}
// @from(Ln 262021, Col 0)
function i42() {
  return null
}
// @from(Ln 262025, Col 0)
function n42(A, Q, {
  verbose: B
}) {
  if (!A || !A.contents || A.contents.length === 0) return WO.createElement(T, {
    justifyContent: "space-between",
    overflowX: "hidden",
    width: "100%"
  }, WO.createElement(x0, {
    height: 1
  }, WO.createElement(C, {
    dimColor: !0
  }, "(No content)")));
  let G = eA(A, null, 2);
  return WO.createElement(Eb, {
    content: G,
    verbose: B
  })
}
// @from(Ln 262043, Col 4)
WO
// @from(Ln 262044, Col 4)
a42 = w(() => {
  fA();
  tH();
  eW();
  c4();
  LKA();
  A0();
  WO = c(QA(), 1)
})
// @from(Ln 262053, Col 4)
w85
// @from(Ln 262053, Col 9)
L85
// @from(Ln 262053, Col 14)
qd
// @from(Ln 262054, Col 4)
DZ1 = w(() => {
  j9();
  eK();
  jN();
  a42();
  A0();
  w85 = m.object({
    server: m.string().describe("The MCP server name"),
    uri: m.string().describe("The resource URI to read")
  }), L85 = m.object({
    contents: m.array(m.object({
      uri: m.string().describe("Resource URI"),
      mimeType: m.string().optional().describe("MIME type of the content"),
      text: m.string().optional().describe("Text content of the resource")
    }))
  }), qd = {
    isEnabled() {
      return !0
    },
    isConcurrencySafe() {
      return !0
    },
    isReadOnly() {
      return !0
    },
    name: "ReadMcpResourceTool",
    maxResultSizeChars: 1e5,
    async description() {
      return u42
    },
    async prompt() {
      return m42
    },
    inputSchema: w85,
    outputSchema: L85,
    async call(A, {
      options: {
        mcpClients: Q
      }
    }) {
      let {
        server: B,
        uri: G
      } = A, Z = Q.find((X) => X.name === B);
      if (!Z) throw Error(`Server "${B}" not found. Available servers: ${Q.map((X)=>X.name).join(", ")}`);
      if (Z.type !== "connected") throw Error(`Server "${B}" is not connected`);
      if (!Z.capabilities?.resources) throw Error(`Server "${B}" does not support resources`);
      return {
        data: await (await eKA(Z)).client.request({
          method: "resources/read",
          params: {
            uri: G
          }
        }, i9A)
      }
    },
    async checkPermissions(A) {
      return {
        behavior: "allow",
        updatedInput: A
      }
    },
    renderToolUseMessage: d42,
    userFacingName: c42,
    renderToolUseRejectedMessage: p42,
    renderToolUseErrorMessage: l42,
    renderToolUseProgressMessage: i42,
    renderToolResultMessage: n42,
    mapToolResultToToolResultBlockParam(A, Q) {
      return {
        tool_use_id: Q,
        type: "tool_result",
        content: eA(A)
      }
    }
  }
})
// @from(Ln 262132, Col 0)
function O85(A) {
  let Q;
  try {
    Q = new URL(A)
  } catch (B) {
    throw Error(`Invalid URL format: ${A}`)
  }
  if (Q.protocol !== "http:" && Q.protocol !== "https:") throw Error(`Invalid URL protocol: must use http:// or https://, got ${Q.protocol}`)
}
// @from(Ln 262141, Col 0)
async function i7(A) {
  try {
    O85(A);
    let Q = process.env.BROWSER,
      B = process.platform;
    if (B === "win32") {
      if (Q) {
        let {
          code: Z
        } = await TQ(Q, [`"${A}"`]);
        return Z === 0
      }
      let {
        code: G
      } = await TQ("rundll32", ["url,OpenURL", A], {});
      return G === 0
    } else {
      let G = Q || (B === "darwin" ? "open" : "xdg-open"),
        {
          code: Z
        } = await TQ(G, [A]);
      return Z === 0
    }
  } catch (Q) {
    return !1
  }
}
// @from(Ln 262168, Col 4)
TN = w(() => {
  t4()
})