
// @from(Ln 383720, Col 0)
async function mEA(A) {
  switch ($Q()) {
    case "macos": {
      let {
        code: B
      } = await TQ("open", ["-a", "Google Chrome", A]);
      return B === 0
    }
    case "windows": {
      let {
        code: B
      } = await TQ("rundll32", ["url,OpenURL", A]);
      return B === 0
    }
    case "linux": {
      let B = ["google-chrome", "google-chrome-stable"];
      for (let G of B) {
        let {
          code: Z
        } = await TQ(G, [A]);
        if (Z === 0) return !0
      }
      return !1
    }
    default:
      return !1
  }
}
// @from(Ln 383749, Col 0)
function sfA() {
  if (_B7() === "win32") return `\\\\.\\pipe\\${oo2()}`;
  return PB7(jB7(), oo2())
}
// @from(Ln 383754, Col 0)
function oo2() {
  return `claude-mcp-browser-bridge-${SB7()}`
}
// @from(Ln 383758, Col 0)
function SB7() {
  try {
    return TB7().username || "default"
  } catch {
    return process.env.USER || process.env.USERNAME || "default"
  }
}
// @from(Ln 383765, Col 4)
Ej = "claude-in-chrome"
// @from(Ln 383766, Col 2)
ro2
// @from(Ln 383767, Col 4)
Ox = w(() => {
  c3();
  t4();
  PJ();
  ro2 = new Set
})
// @from(Ln 383774, Col 0)
function e3(A) {
  let Q = A.replace(/[^a-zA-Z0-9_-]/g, "_");
  if (A.startsWith("claude.ai ")) Q = Q.replace(/_+/g, "_").replace(/^_|_$/g, "");
  return Q
}
// @from(Ln 383780, Col 0)
function eo2() {
  kB7.cache.clear?.()
}
// @from(Ln 383783, Col 4)
xB7 = "tengu_claudeai_mcp_connectors"
// @from(Ln 383784, Col 2)
yB7 = 5000
// @from(Ln 383785, Col 2)
vB7 = "mcp-servers-2025-12-04"
// @from(Ln 383786, Col 2)
kB7
// @from(Ln 383787, Col 4)
XL0 = w(() => {
  Y9();
  j5();
  JX();
  Z0();
  Q2();
  T1();
  fQ();
  w6();
  kB7 = W0(async () => {
    try {
      return {}
    } catch {
      return k("[claudeai-mcp] Fetch failed"), {}
    }
  })
})
// @from(Ln 383810, Col 0)
function MF1() {
  return OF1(xL(), "managed-mcp.json")
}
// @from(Ln 383814, Col 0)
function tfA(A, Q) {
  if (!A) return {};
  let B = {};
  for (let [G, Z] of Object.entries(A)) B[G] = {
    ...Z,
    scope: Q
  };
  return B
}
// @from(Ln 383824, Col 0)
function Ar2(A) {
  let Q = OF1(o1(), ".mcp.json");
  yR(Q, eA(A, null, 2), {
    encoding: "utf8"
  })
}
// @from(Ln 383831, Col 0)
function Qr2(A) {
  if (A.type !== void 0 && A.type !== "stdio") return null;
  let Q = A;
  return [Q.command, ...Q.args]
}
// @from(Ln 383837, Col 0)
function Br2(A, Q) {
  if (A.length !== Q.length) return !1;
  return A.every((B, G) => B === Q[G])
}
// @from(Ln 383842, Col 0)
function Gr2(A) {
  return "url" in A ? A.url : null
}
// @from(Ln 383846, Col 0)
function hB7(A) {
  let B = A.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
  return new RegExp(`^${B}$`)
}
// @from(Ln 383851, Col 0)
function Zr2(A, Q) {
  return hB7(Q).test(A)
}
// @from(Ln 383855, Col 0)
function Yr2(A, Q) {
  let B = jQ();
  if (!B.deniedMcpServers) return !1;
  for (let G of B.deniedMcpServers)
    if (XVA(G) && G.serverName === A) return !0;
  if (Q) {
    let G = Qr2(Q);
    if (G) {
      for (let Y of B.deniedMcpServers)
        if (wZ1(Y) && Br2(Y.serverCommand, G)) return !0
    }
    let Z = Gr2(Q);
    if (Z) {
      for (let Y of B.deniedMcpServers)
        if (LZ1(Y) && Zr2(Z, Y.serverUrl)) return !0
    }
  }
  return !1
}
// @from(Ln 383875, Col 0)
function IL0(A, Q) {
  if (Yr2(A, Q)) return !1;
  let B = jQ();
  if (!B.allowedMcpServers) return !0;
  if (B.allowedMcpServers.length === 0) return !1;
  let G = B.allowedMcpServers.some(wZ1),
    Z = B.allowedMcpServers.some(LZ1);
  if (Q) {
    let Y = Qr2(Q),
      J = Gr2(Q);
    if (Y)
      if (G) {
        for (let X of B.allowedMcpServers)
          if (wZ1(X) && Br2(X.serverCommand, Y)) return !0;
        return !1
      } else {
        for (let X of B.allowedMcpServers)
          if (XVA(X) && X.serverName === A) return !0;
        return !1
      }
    else if (J)
      if (Z) {
        for (let X of B.allowedMcpServers)
          if (LZ1(X) && Zr2(J, X.serverUrl)) return !0;
        return !1
      } else {
        for (let X of B.allowedMcpServers)
          if (XVA(X) && X.serverName === A) return !0;
        return !1
      }
    else {
      for (let X of B.allowedMcpServers)
        if (XVA(X) && X.serverName === A) return !0;
      return !1
    }
  }
  for (let Y of B.allowedMcpServers)
    if (XVA(Y) && Y.serverName === A) return !0;
  return !1
}
// @from(Ln 383916, Col 0)
function gB7(A) {
  let Q = [];

  function B(Z) {
    let {
      expanded: Y,
      missingVars: J
    } = BVA(Z);
    return Q.push(...J), Y
  }
  let G;
  switch (A.type) {
    case void 0:
    case "stdio": {
      let Z = A;
      G = {
        ...Z,
        command: B(Z.command),
        args: Z.args.map(B),
        env: Z.env ? I1A(Z.env, B) : void 0
      };
      break
    }
    case "sse":
    case "http":
    case "ws": {
      let Z = A;
      G = {
        ...Z,
        url: B(Z.url),
        headers: Z.headers ? I1A(Z.headers, B) : void 0
      };
      break
    }
    case "sse-ide":
    case "ws-ide":
      G = A;
      break;
    case "sdk":
      G = A;
      break;
    case "claudeai-proxy":
      G = A;
      break
  }
  return {
    expanded: G,
    missingVars: [...new Set(Q)]
  }
}
// @from(Ln 383967, Col 0)
function uf(A, Q, B) {
  if (A.match(/[^a-zA-Z0-9_-]/)) throw Error(`Invalid name ${A}. Names can only contain letters, numbers, hyphens, and underscores.`);
  if (uEA(A)) throw Error(`Cannot add MCP server "${A}": this name is reserved.`);
  if (AhA()) throw Error("Cannot add MCP server: enterprise MCP configuration is active and has exclusive control over MCP servers");
  let G = Rb.safeParse(Q);
  if (!G.success) {
    let Y = G.error.issues.map((J) => `${J.path.join(".")}: ${J.message}`).join(", ");
    throw Error(`Invalid configuration: ${Y}`)
  }
  let Z = G.data;
  if (Yr2(A, Z)) throw Error(`Cannot add MCP server "${A}": server is explicitly blocked by enterprise policy`);
  if (!IL0(A, Z)) throw Error(`Cannot add MCP server "${A}": not allowed by enterprise policy`);
  switch (B) {
    case "project": {
      let {
        servers: Y
      } = DL0();
      if (Y[A]) throw Error(`MCP server ${A} already exists in .mcp.json`);
      break
    }
    case "user": {
      if (L1().mcpServers?.[A]) throw Error(`MCP server ${A} already exists in user config`);
      break
    }
    case "local": {
      if (JG().mcpServers?.[A]) throw Error(`MCP server ${A} already exists in local config`);
      break
    }
    case "dynamic":
      throw Error("Cannot add MCP server to scope: dynamic");
    case "enterprise":
      throw Error("Cannot add MCP server to scope: enterprise");
    case "claudeai":
      throw Error("Cannot add MCP server to scope: claudeai")
  }
  switch (B) {
    case "project": {
      let {
        servers: Y
      } = DL0(), J = {};
      for (let [I, D] of Object.entries(Y)) {
        let {
          scope: W,
          ...K
        } = D;
        J[I] = K
      }
      J[A] = Z;
      let X = {
        mcpServers: J
      };
      try {
        Ar2(X)
      } catch (I) {
        throw Error(`Failed to write to .mcp.json: ${I}`)
      }
      break
    }
    case "user": {
      S0((Y) => ({
        ...Y,
        mcpServers: {
          ...Y.mcpServers,
          [A]: Z
        }
      }));
      break
    }
    case "local": {
      BZ((Y) => ({
        ...Y,
        mcpServers: {
          ...Y.mcpServers,
          [A]: Z
        }
      }));
      break
    }
    default:
      throw Error(`Cannot add MCP server to scope: ${B}`)
  }
}
// @from(Ln 384050, Col 0)
function WL0(A, Q) {
  switch (Q) {
    case "project": {
      let {
        servers: B
      } = DL0();
      if (!B[A]) throw Error(`No MCP server found with name: ${A} in .mcp.json`);
      let G = {};
      for (let [Y, J] of Object.entries(B))
        if (Y !== A) {
          let {
            scope: X,
            ...I
          } = J;
          G[Y] = I
        } let Z = {
        mcpServers: G
      };
      try {
        Ar2(Z)
      } catch (Y) {
        throw Error(`Failed to remove from .mcp.json: ${Y}`)
      }
      break
    }
    case "user": {
      if (!L1().mcpServers?.[A]) throw Error(`No user-scoped MCP server found with name: ${A}`);
      S0((G) => {
        let {
          [A]: Z, ...Y
        } = G.mcpServers ?? {};
        return {
          ...G,
          mcpServers: Y
        }
      });
      break
    }
    case "local": {
      if (!JG().mcpServers?.[A]) throw Error(`No project-local MCP server found with name: ${A}`);
      BZ((G) => {
        let {
          [A]: Z, ...Y
        } = G.mcpServers ?? {};
        return {
          ...G,
          mcpServers: Y
        }
      });
      break
    }
    default:
      throw Error(`Cannot remove MCP server from scope: ${Q}`)
  }
}
// @from(Ln 384106, Col 0)
function DL0() {
  if (!iK("projectSettings")) return {
    servers: {},
    errors: []
  };
  let A = vA(),
    Q = OF1(o1(), ".mcp.json");
  if (!A.existsSync(Q)) return {
    servers: {},
    errors: []
  };
  let {
    config: B,
    errors: G
  } = dEA({
    filePath: Q,
    expandVars: !0,
    scope: "project"
  });
  return {
    servers: B?.mcpServers ? tfA(B.mcpServers, "project") : {},
    errors: G || []
  }
}
// @from(Ln 384131, Col 0)
function GW(A) {
  let Q = {
    project: "projectSettings",
    user: "userSettings",
    local: "localSettings"
  };
  if (A in Q && !iK(Q[A])) return {
    servers: {},
    errors: []
  };
  switch (A) {
    case "project": {
      let B = vA(),
        G = {},
        Z = [],
        Y = [],
        J = o1();
      while (J !== fB7(J).root) Y.push(J), J = bB7(J);
      for (let X of Y.reverse()) {
        let I = OF1(X, ".mcp.json");
        if (!B.existsSync(I)) continue;
        let {
          config: D,
          errors: W
        } = dEA({
          filePath: I,
          expandVars: !0,
          scope: "project"
        });
        if (D?.mcpServers) Object.assign(G, tfA(D.mcpServers, A));
        if (W.length > 0) Z.push(...W)
      }
      return {
        servers: G,
        errors: Z
      }
    }
    case "user": {
      let B = L1().mcpServers;
      if (!B) return {
        servers: {},
        errors: []
      };
      let {
        config: G,
        errors: Z
      } = efA({
        configObject: {
          mcpServers: B
        },
        expandVars: !0,
        scope: "user"
      });
      return {
        servers: tfA(G?.mcpServers, A),
        errors: Z
      }
    }
    case "local": {
      let B = JG().mcpServers;
      if (!B) return {
        servers: {},
        errors: []
      };
      let {
        config: G,
        errors: Z
      } = efA({
        configObject: {
          mcpServers: B
        },
        expandVars: !0,
        scope: "local"
      });
      return {
        servers: tfA(G?.mcpServers, A),
        errors: Z
      }
    }
    case "enterprise": {
      let B = MF1();
      if (!vA().existsSync(B)) return {
        servers: {},
        errors: []
      };
      let {
        config: Z,
        errors: Y
      } = dEA({
        filePath: B,
        expandVars: !0,
        scope: "enterprise"
      });
      return {
        servers: tfA(Z?.mcpServers, A),
        errors: Y
      }
    }
  }
}
// @from(Ln 384232, Col 0)
function vs(A) {
  let {
    servers: Q
  } = GW("enterprise"), {
    servers: B
  } = GW("user"), {
    servers: G
  } = GW("project"), {
    servers: Z
  } = GW("local");
  if (Q[A]) return Q[A];
  if (Z[A]) return Z[A];
  if (G[A]) return G[A];
  if (B[A]) return B[A];
  return null
}
// @from(Ln 384248, Col 0)
async function cEA() {
  let {
    servers: A
  } = GW("enterprise");
  if (AhA()) {
    let W = {};
    for (let [K, V] of Object.entries(A)) {
      if (!IL0(K, V)) continue;
      W[K] = V
    }
    return {
      servers: W,
      errors: []
    }
  }
  let {
    servers: Q
  } = GW("user"), {
    servers: B
  } = GW("project"), {
    servers: G
  } = GW("local"), Z = {}, Y = await DG(), J = [];
  if (Y.errors.length > 0)
    for (let W of Y.errors)
      if (W.type === "mcp-config-invalid" || W.type === "mcpb-download-failed" || W.type === "mcpb-extract-failed" || W.type === "mcpb-invalid-manifest") {
        let K = `Plugin MCP loading error - ${W.type}: ${h_(W)}`;
        e(Error(K))
      } else {
        let K = W.type;
        k(`Plugin not available for MCP: ${W.source} - error type: ${K}`)
      } for (let W of Y.enabled) {
    let K = await To2(W, J);
    if (K) Object.assign(Z, K)
  }
  if (J.length > 0)
    for (let W of J) {
      let K = `Plugin MCP server error - ${W.type}: ${h_(W)}`;
      e(Error(K))
    }
  let X = {};
  for (let [W, K] of Object.entries(B))
    if (RF1(W) === "approved") X[W] = K;
  let I = Object.assign({}, Z, Q, X, G),
    D = {};
  for (let [W, K] of Object.entries(I)) {
    if (!IL0(W, K)) continue;
    D[W] = K
  }
  return {
    servers: D,
    errors: J
  }
}
// @from(Ln 384301, Col 0)
async function it() {
  let {
    servers: A,
    errors: Q
  } = await cEA();
  if (AhA()) return {
    servers: A,
    errors: Q
  };
  return {
    servers: Object.assign({}, {}, A),
    errors: Q
  }
}
// @from(Ln 384316, Col 0)
function efA(A) {
  let {
    configObject: Q,
    expandVars: B,
    scope: G,
    filePath: Z
  } = A, Y = x62.safeParse(Q);
  if (!Y.success) return {
    config: null,
    errors: Y.error.issues.map((I) => ({
      ...Z && {
        file: Z
      },
      path: I.path.join("."),
      message: "Does not adhere to MCP server configuration schema",
      mcpErrorMetadata: {
        scope: G,
        severity: "fatal"
      }
    }))
  };
  let J = [],
    X = {};
  for (let [I, D] of Object.entries(Y.data.mcpServers)) {
    let W = D;
    if (B) {
      let {
        expanded: K,
        missingVars: V
      } = gB7(D);
      if (V.length > 0) J.push({
        ...Z && {
          file: Z
        },
        path: `mcpServers.${I}`,
        message: `Missing environment variables: ${V.join(", ")}`,
        suggestion: `Set the following environment variables: ${V.join(", ")}`,
        mcpErrorMetadata: {
          scope: G,
          serverName: I,
          severity: "warning"
        }
      });
      W = K
    }
    if ($Q() === "windows" && (!W.type || W.type === "stdio") && (W.command === "npx" || W.command.endsWith("\\npx") || W.command.endsWith("/npx"))) J.push({
      ...Z && {
        file: Z
      },
      path: `mcpServers.${I}`,
      message: "Windows requires 'cmd /c' wrapper to execute npx",
      suggestion: 'Change command to "cmd" with args ["/c", "npx", ...]. See: https://code.claude.com/docs/en/mcp#configure-mcp-servers',
      mcpErrorMetadata: {
        scope: G,
        serverName: I,
        severity: "warning"
      }
    });
    X[I] = W
  }
  return {
    config: {
      mcpServers: X
    },
    errors: J
  }
}
// @from(Ln 384384, Col 0)
function dEA(A) {
  let {
    filePath: Q,
    expandVars: B,
    scope: G
  } = A, Z = vA();
  if (!Z.existsSync(Q)) return {
    config: null,
    errors: [{
      file: Q,
      path: "",
      message: `MCP config file not found: ${Q}`,
      suggestion: "Check that the file path is correct",
      mcpErrorMetadata: {
        scope: G,
        severity: "fatal"
      }
    }]
  };
  let Y;
  try {
    Y = Z.readFileSync(Q, {
      encoding: "utf8"
    })
  } catch (X) {
    return {
      config: null,
      errors: [{
        file: Q,
        path: "",
        message: `Failed to read file: ${X}`,
        suggestion: "Check file permissions and ensure the file exists",
        mcpErrorMetadata: {
          scope: G,
          severity: "fatal"
        }
      }]
    }
  }
  let J = c5(Y);
  if (!J) return {
    config: null,
    errors: [{
      file: Q,
      path: "",
      message: "MCP config is not a valid JSON",
      suggestion: "Fix the JSON syntax errors in the file",
      mcpErrorMetadata: {
        scope: G,
        severity: "fatal"
      }
    }]
  };
  return efA({
    configObject: J,
    expandVars: B,
    scope: G,
    filePath: Q
  })
}
// @from(Ln 384445, Col 0)
function AhA() {
  let {
    config: A
  } = dEA({
    filePath: MF1(),
    expandVars: !0,
    scope: "enterprise"
  });
  return A !== null
}
// @from(Ln 384456, Col 0)
function Jr2(A) {
  return Object.values(A).every((Q) => Q.type === "sdk" && Q.name === "claude-vscode")
}
// @from(Ln 384460, Col 0)
function QhA(A) {
  return (JG().disabledMcpServers || []).includes(A)
}
// @from(Ln 384464, Col 0)
function KL0(A, Q) {
  BZ((B) => {
    let G = B.disabledMcpServers || [];
    if (Q) G = G.filter((Z) => Z !== A);
    else if (!G.includes(A)) G = [...G, A];
    return {
      ...B,
      disabledMcpServers: G
    }
  })
}
// @from(Ln 384475, Col 4)
G$ = w(() => {
  GQ();
  DQ();
  vI();
  RpA();
  V2();
  y9();
  D4A();
  PJ();
  c3();
  GB();
  wd();
  YI();
  v1();
  T1();
  GK();
  Ox();
  sw0();
  XL0();
  A0()
})
// @from(Ln 384497, Col 0)
function uB7(A) {
  return A.scope === "project" || A.scope === "local"
}
// @from(Ln 384500, Col 0)
async function mB7(A, Q) {
  if (!Q.headersHelper) return null;
  if ("scope" in Q && uB7(Q) && !p2()) {
    if (!eZ(!0)) {
      let G = Error(`Security: headersHelper for MCP server '${A}' executed before workspace trust is confirmed. If you see this message, post in ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.FEEDBACK_CHANNEL}.`);
      return xM("MCP headersHelper invoked before trust check", G), l("tengu_mcp_headersHelper_missing_trust", {}), null
    }
  }
  try {
    i0(A, "Executing headersHelper to get dynamic headers");
    let B = await J2(Q.headersHelper, [], {
      shell: !0,
      timeout: 1e4
    });
    if (B.code !== 0 || !B.stdout) throw Error(`headersHelper for MCP server '${A}' did not return a valid value`);
    let G = B.stdout.trim(),
      Z = AQ(G);
    if (typeof Z !== "object" || Z === null || Array.isArray(Z)) throw Error(`headersHelper for MCP server '${A}' must return a JSON object with string key-value pairs`);
    for (let [Y, J] of Object.entries(Z))
      if (typeof J !== "string") throw Error(`headersHelper for MCP server '${A}' returned non-string value for key "${Y}": ${typeof J}`);
    return i0(A, `Successfully retrieved ${Object.keys(Z).length} headers from headersHelper`), Z
  } catch (B) {
    return NZ(A, `Error getting headers from headersHelper: ${B instanceof Error?B.message:String(B)}`), e(Error(`Error getting MCP headers from headersHelper for server '${A}': ${B instanceof Error?B.message:String(B)}`)), null
  }
}
// @from(Ln 384525, Col 0)
async function _F1(A, Q) {
  let B = Q.headers || {},
    G = await mB7(A, Q) || {};
  return {
    ...B,
    ...G
  }
}
// @from(Ln 384533, Col 4)
Xr2 = w(() => {
  t4();
  GQ();
  v1();
  T1();
  Z0();
  C0();
  A0()
})
// @from(Ln 384542, Col 0)
class VL0 {
  serverName;
  sendMcpMessage;
  isClosed = !1;
  onclose;
  onerror;
  onmessage;
  constructor(A, Q) {
    this.serverName = A;
    this.sendMcpMessage = Q
  }
  async start() {}
  async send(A) {
    if (this.isClosed) throw Error("Transport is closed");
    let Q = await this.sendMcpMessage(this.serverName, A);
    if (this.onmessage) this.onmessage(Q)
  }
  async close() {
    if (this.isClosed) return;
    this.isClosed = !0, this.onclose?.()
  }
}
// @from(Ln 384565, Col 0)
function cB7(A, Q, B) {
  let G = A.tabId;
  if (typeof G === "number") so2(G);
  let Z = [];
  switch (Q) {
    case "navigate":
      if (typeof A.url === "string") try {
        let Y = new URL(A.url);
        Z.push(Y.hostname)
      } catch {
        Z.push(BhA(A.url, 30))
      }
      break;
    case "find":
      if (typeof A.query === "string") Z.push(`pattern: ${BhA(A.query,30)}`);
      break;
    case "computer":
      if (typeof A.action === "string") {
        let Y = A.action;
        if (Y === "left_click" || Y === "right_click" || Y === "double_click" || Y === "middle_click")
          if (typeof A.ref === "string") Z.push(`${Y} on ${A.ref}`);
          else if (Array.isArray(A.coordinate)) Z.push(`${Y} at (${A.coordinate.join(", ")})`);
        else Z.push(Y);
        else if (Y === "type" && typeof A.text === "string") Z.push(`type "${BhA(A.text,15)}"`);
        else if (Y === "key" && typeof A.text === "string") Z.push(`key ${A.text}`);
        else if (Y === "scroll" && typeof A.scroll_direction === "string") Z.push(`scroll ${A.scroll_direction}`);
        else if (Y === "wait" && typeof A.duration === "number") Z.push(`wait ${A.duration}s`);
        else if (Y === "left_click_drag") Z.push("drag");
        else Z.push(Y)
      }
      break;
    case "gif_creator":
      if (typeof A.action === "string") Z.push(`${A.action}`);
      break;
    case "resize_window":
      if (typeof A.width === "number" && typeof A.height === "number") Z.push(`${A.width}x${A.height}`);
      break;
    case "read_console_messages":
      if (typeof A.pattern === "string") Z.push(`pattern: ${BhA(A.pattern,20)}`);
      if (A.onlyErrors === !0) Z.push("errors only");
      break;
    case "read_network_requests":
      if (typeof A.urlPattern === "string") Z.push(`pattern: ${BhA(A.urlPattern,20)}`);
      break;
    case "shortcuts_execute":
      if (typeof A.shortcutId === "string") Z.push(`shortcut_id: ${A.shortcutId}`);
      break;
    case "javascript_tool":
      if (B && typeof A.text === "string") return A.text;
      return "";
    case "tabs_create_mcp":
    case "tabs_context_mcp":
    case "form_input":
    case "shortcuts_list":
    case "read_page":
    case "upload_image":
    case "get_page_text":
    case "update_plan":
      return ""
  }
  return Z.join(", ") || null
}
// @from(Ln 384628, Col 0)
function pB7(A) {
  if (!Sk()) return null;
  if (typeof A !== "object" || A === null || !("tabId" in A)) return null;
  let Q = typeof A.tabId === "number" ? A.tabId : typeof A.tabId === "string" ? parseInt(A.tabId, 10) : NaN;
  if (isNaN(Q)) return null;
  let B = `${dB7}${Q}`;
  return Mx.createElement(T, {
    flexWrap: "nowrap",
    marginLeft: 1
  }, Mx.createElement(i2, {
    url: B
  }, Mx.createElement(C, {
    color: "subtle"
  }, "[View Tab]")))
}
// @from(Ln 384644, Col 0)
function lB7(A, Q, B) {
  if (B) return XZ1(A, [], {
    verbose: B
  });
  let G = null;
  switch (Q) {
    case "navigate":
      G = "Navigation completed";
      break;
    case "tabs_create_mcp":
      G = "Tab created";
      break;
    case "tabs_context_mcp":
      G = "Tabs read";
      break;
    case "form_input":
      G = "Input completed";
      break;
    case "computer":
      G = "Action completed";
      break;
    case "resize_window":
      G = "Window resized";
      break;
    case "find":
      G = "Search completed";
      break;
    case "gif_creator":
      G = "GIF action completed";
      break;
    case "read_console_messages":
      G = "Console messages retrieved";
      break;
    case "read_network_requests":
      G = "Network requests retrieved";
      break;
    case "shortcuts_list":
      G = "Shortcuts retrieved";
      break;
    case "shortcuts_execute":
      G = "Shortcut executed";
      break;
    case "javascript_tool":
      G = "Script executed";
      break;
    case "read_page":
      G = "Page read";
      break;
    case "upload_image":
      G = "Image uploaded";
      break;
    case "get_page_text":
      G = "Page text retrieved";
      break;
    case "update_plan":
      G = "Plan updated";
      break
  }
  if (G) return Mx.createElement(x0, {
    height: 1
  }, Mx.createElement(C, {
    dimColor: !0
  }, G));
  return null
}
// @from(Ln 384710, Col 0)
function Ir2(A) {
  return {
    userFacingName(Q) {
      return `Claude in Chrome[${A.replace(/_mcp$/,"")}]`
    },
    renderToolUseMessage(Q, {
      verbose: B
    }) {
      return cB7(Q, A, B)
    },
    renderToolUseTag(Q) {
      return pB7(Q)
    },
    renderToolResultMessage(Q, B, {
      verbose: G
    }) {
      if (!iB7(Q)) return null;
      return lB7(Q, A, G)
    }
  }
}
// @from(Ln 384732, Col 0)
function BhA(A, Q) {
  return A.length > Q ? A.slice(0, Q) + "…" : A
}
// @from(Ln 384736, Col 0)
function iB7(A) {
  return typeof A === "object" && A !== null
}
// @from(Ln 384739, Col 4)
Mx
// @from(Ln 384739, Col 8)
dB7 = "https://clau.de/chrome/tab/"
// @from(Ln 384740, Col 4)
Dr2 = w(() => {
  fA();
  c4();
  DDA();
  nX0();
  Ox();
  Mx = c(QA(), 1)
})
// @from(Ln 384749, Col 0)
function jF1() {
  return parseInt(process.env.MCP_TIMEOUT || "", 10) || 30000
}
// @from(Ln 384753, Col 0)
function Wr2(A) {
  return async (Q, B) => {
    if ((B?.method ?? "GET").toUpperCase() === "GET") return A(Q, B);
    let Z = AbortSignal.timeout(Fr2);
    if (!B?.signal) return A(Q, {
      ...B,
      signal: Z
    });
    let Y = new AbortController,
      J = () => Y.abort();
    B.signal.addEventListener("abort", J), Z.addEventListener("abort", J);
    let X = () => {
      B.signal?.removeEventListener("abort", J), Z.removeEventListener("abort", J)
    };
    if (B.signal.aborted) Y.abort();
    try {
      let I = await A(Q, {
        ...B,
        signal: Y.signal
      });
      return X(), I
    } catch (I) {
      throw X(), I
    }
  }
}
// @from(Ln 384780, Col 0)
function HL0() {
  return parseInt(process.env.MCP_SERVER_CONNECTION_BATCH_SIZE || "", 10) || 3
}
// @from(Ln 384784, Col 0)
function aB7() {
  return parseInt(process.env.MCP_REMOTE_SERVER_CONNECTION_BATCH_SIZE || "", 10) || 20
}
// @from(Ln 384788, Col 0)
function Kr2(A) {
  return !A.type || A.type === "stdio" || A.type === "sdk"
}
// @from(Ln 384792, Col 0)
function rB7(A) {
  return !A.name.startsWith("mcp__ide__") || oB7.includes(A.name)
}
// @from(Ln 384796, Col 0)
function FL0(A, Q) {
  return `${A}-${eA(Q)}`
}
// @from(Ln 384799, Col 0)
async function pc(A, Q) {
  let B = FL0(A, Q);
  try {
    let G = await SO(A, Q);
    if (G.type === "connected") await G.cleanup()
  } catch {}
  SO.cache.delete(B)
}
// @from(Ln 384807, Col 0)
async function eKA(A) {
  if (A.config.type === "sdk") return A;
  let Q = await SO(A.name, A.config);
  if (Q.type !== "connected") throw Error(`MCP server ${A.name} is not connected`);
  return Q
}
// @from(Ln 384814, Col 0)
function Hr2(A, Q) {
  if (A.type !== Q.type) return !1;
  let {
    scope: B,
    ...G
  } = A, {
    scope: Z,
    ...Y
  } = Q;
  return eA(G) === eA(Y)
}
// @from(Ln 384825, Col 0)
async function Hc(A, Q, B) {
  return zr2({
    client: B,
    tool: A,
    args: Q,
    signal: c9().signal
  })
}
// @from(Ln 384833, Col 0)
async function C3A(A, Q) {
  try {
    await pc(A, Q);
    let B = await SO(A, Q);
    if (B.type !== "connected") return {
      client: B,
      tools: [],
      commands: []
    };
    let G = !!B.capabilities?.resources,
      [Z, Y, J] = await Promise.all([Ax(B), ZhA(B), G ? GhA(B) : Promise.resolve([])]),
      X = [];
    if (G) {
      if (![Ud, qd].some((D) => Z.some((W) => W.name === D.name))) X.push(Ud, qd)
    }
    return {
      client: B,
      tools: [...Z, ...X],
      commands: Y,
      resources: J.length > 0 ? J : void 0
    }
  } catch (B) {
    return NZ(A, `Error during reconnection: ${B instanceof Error?B.message:String(B)}`), {
      client: {
        name: A,
        type: "failed",
        config: Q
      },
      tools: [],
      commands: []
    }
  }
}
// @from(Ln 384866, Col 0)
async function Vr2(A, Q, B) {
  for (let G = 0; G < A.length; G += Q) {
    let Z = A.slice(G, G + Q);
    await Promise.all(Z.map(B))
  }
}
// @from(Ln 384872, Col 0)
async function EL0(A, Q) {
  let B = !1,
    G = Object.entries(Q ?? (await it()).servers),
    Z = G.length,
    Y = G.filter(([H, E]) => E.type === "stdio").length,
    J = G.filter(([H, E]) => E.type === "sse").length,
    X = G.filter(([H, E]) => E.type === "http").length,
    I = G.filter(([H, E]) => E.type === "sse-ide").length,
    D = G.filter(([H, E]) => E.type === "ws-ide").length,
    W = G.filter(([H, E]) => Kr2(E)),
    K = G.filter(([H, E]) => !Kr2(E)),
    V = {
      totalServers: Z,
      stdioCount: Y,
      sseCount: J,
      httpCount: X,
      sseIdeCount: I,
      wsIdeCount: D
    },
    F = async ([H, E]) => {
      try {
        if (QhA(H)) {
          A({
            client: {
              name: H,
              type: "disabled",
              config: E
            },
            tools: [],
            commands: []
          });
          return
        }
        let z = await SO(H, E, V);
        if (z.type !== "connected") {
          A({
            client: z,
            tools: [],
            commands: []
          });
          return
        }
        let $ = !!z.capabilities?.resources,
          [O, L, M] = await Promise.all([Ax(z), ZhA(z), $ ? GhA(z) : Promise.resolve([])]),
          _ = [];
        if ($ && !B) B = !0, _.push(Ud, qd);
        A({
          client: z,
          tools: [...O, ..._],
          commands: L,
          resources: M.length > 0 ? M : void 0
        })
      } catch (z) {
        NZ(H, `Error fetching tools/commands/resources: ${z instanceof Error?z.message:String(z)}`), A({
          client: {
            name: H,
            type: "failed",
            config: E
          },
          tools: [],
          commands: []
        })
      }
    };
  await Promise.all([Vr2(W, HL0(), F), Vr2(K, aB7(), F)])
}
// @from(Ln 384938, Col 0)
async function Er2(A, Q) {
  switch (A.type) {
    case "text":
      return [{
        type: "text",
        text: A.text
      }];
    case "image": {
      let B = Buffer.from(String(A.data), "base64"),
        G = await x9A(B, void 0, A.mimeType);
      return [{
        type: "image",
        source: {
          data: G.base64,
          media_type: G.mediaType,
          type: "base64"
        }
      }]
    }
    case "resource": {
      let B = A.resource,
        G = `[Resource from ${Q} at ${B.uri}] `;
      if ("text" in B) return [{
        type: "text",
        text: `${G}${B.text}`
      }];
      else if ("blob" in B)
        if (nB7.has(B.mimeType ?? "")) {
          let Y = Buffer.from(B.blob, "base64"),
            J = await x9A(Y, void 0, B.mimeType),
            X = [];
          if (G) X.push({
            type: "text",
            text: G
          });
          return X.push({
            type: "image",
            source: {
              data: J.base64,
              media_type: J.mediaType,
              type: "base64"
            }
          }), X
        } else return [{
          type: "text",
          text: `${G}Base64 data (${B.mimeType||"unknown type"}) ${B.blob}`
        }];
      return []
    }
    case "resource_link": {
      let B = A,
        G = `[Resource link: ${B.name}] ${B.uri}`;
      if (B.description) G += ` (${B.description})`;
      return [{
        type: "text",
        text: G
      }]
    }
    default:
      return []
  }
}
// @from(Ln 385001, Col 0)
function TF1(A, Q = 2) {
  if (A === null) return "null";
  if (Array.isArray(A)) {
    if (A.length === 0) return "[]";
    return `[${TF1(A[0],Q-1)}]`
  }
  if (typeof A === "object") {
    if (Q <= 0) return "{...}";
    let G = Object.entries(A).slice(0, 10).map(([Y, J]) => `${Y}: ${TF1(J,Q-1)}`),
      Z = Object.keys(A).length > 10 ? ", ..." : "";
    return `{${G.join(", ")}${Z}}`
  }
  return typeof A
}
// @from(Ln 385015, Col 0)
async function sq0(A, Q, B) {
  if (A && typeof A === "object") {
    if ("toolResult" in A) return {
      content: String(A.toolResult),
      type: "toolResult"
    };
    if ("structuredContent" in A && A.structuredContent !== void 0) return {
      content: eA(A.structuredContent),
      type: "structuredContent",
      schema: TF1(A.structuredContent)
    };
    if ("content" in A && Array.isArray(A.content)) {
      let Z = (await Promise.all(A.content.map((Y) => Er2(Y, B)))).flat();
      return {
        content: Z,
        type: "contentArray",
        schema: TF1(Z)
      }
    }
  }
  let G = `Unexpected response format from tool ${Q}`;
  throw NZ(B, G), Error(G)
}
// @from(Ln 385039, Col 0)
function sB7(A) {
  if (!A || typeof A === "string") return !1;
  return A.some((Q) => Q.type === "image")
}
// @from(Ln 385043, Col 0)
async function tB7(A, Q, B) {
  let {
    content: G,
    type: Z,
    schema: Y
  } = await sq0(A, Q, B);
  if (B === "ide") return G;
  if (!await ixA(G)) return G;
  if (iX(process.env.ENABLE_MCP_LARGE_OUTPUT_FILES)) return await hX0(G);
  if (!G) return G;
  if (sB7(G)) return await hX0(G);
  let J = Date.now(),
    X = `mcp-${e3(B)}-${e3(Q)}-${J}`,
    I = typeof G === "string" ? G : eA(G, null, 2),
    D = await Z4A(I, X);
  if (Y4A(D)) return `Error: result (${I.length.toLocaleString()} characters) exceeds maximum allowed tokens. Failed to save output to file: ${D.error}. If this MCP server provides pagination or filtering tools, use them to retrieve specific portions of the data.`;
  let W = QZ1(Z, Y);
  return BZ1(D.filepath, D.originalSize, W)
}
// @from(Ln 385062, Col 0)
async function zr2({
  client: {
    client: A,
    name: Q
  },
  tool: B,
  args: G,
  meta: Z,
  signal: Y
}) {
  let J = Date.now(),
    X, I;
  try {
    if (i0(Q, `Calling MCP tool: ${B}`), X = setInterval(() => {
        let z = Date.now() - J,
          O = `${Math.floor(z/1000)}s`;
        i0(Q, `Tool '${B}' still running (${O} elapsed)`)
      }, 30000), E42()) I = setInterval(() => {
      H42()
    }, 50000);
    let D = U3A(),
      W, K = new Promise((z, $) => {
        W = setTimeout(() => {
          $(Error(`MCP tool call '${B}' timed out after ${Math.floor(D/1000)}s`))
        }, D)
      }),
      V = await Promise.race([A.callTool({
        name: B,
        arguments: G,
        _meta: Z
      }, iC, {
        signal: Y,
        timeout: D
      }), K]).finally(() => {
        if (W) clearTimeout(W)
      });
    if ("isError" in V && V.isError) {
      let z = "Unknown error";
      if ("content" in V && Array.isArray(V.content) && V.content.length > 0) {
        let $ = V.content[0];
        if ($ && typeof $ === "object" && "text" in $) z = $.text
      } else if ("error" in V) z = String(V.error);
      throw NZ(Q, z), Error(z)
    }
    let F = Date.now() - J,
      H = F < 1000 ? `${F}ms` : F < 60000 ? `${Math.floor(F/1000)}s` : `${Math.floor(F/60000)}m ${Math.floor(F%60000/1000)}s`;
    i0(Q, `Tool '${B}' completed successfully in ${H}`);
    let E = w42(Q);
    if (E) l("tengu_code_indexing_tool_used", {
      tool: E,
      source: "mcp",
      success: !0
    });
    return await tB7(V, B, Q)
  } catch (D) {
    if (X !== void 0) clearInterval(X);
    if (I !== void 0) clearInterval(I);
    let W = Date.now() - J;
    if (D instanceof Error && D.name !== "AbortError") i0(Q, `Tool '${B}' failed after ${Math.floor(W/1000)}s: ${D.message}`);
    if (!(D instanceof Error) || D.name !== "AbortError") throw D
  } finally {
    if (X !== void 0) clearInterval(X);
    if (I !== void 0) clearInterval(I)
  }
}
// @from(Ln 385128, Col 0)
function eB7(A) {
  if (A.message.content[0]?.type !== "tool_use") return;
  return A.message.content[0].id
}
// @from(Ln 385132, Col 0)
async function $r2(A, Q) {
  let B = [],
    G = [],
    Z = await Promise.allSettled(Object.entries(A).map(async ([Y, J]) => {
      let X = new VL0(Y, Q),
        I = new PG1({
          name: "claude-code",
          version: {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.7",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-01-13T22:55:21Z"
          }.VERSION ?? "unknown"
        }, {
          capabilities: {}
        });
      try {
        await I.connect(X);
        let D = I.getServerCapabilities(),
          W = {
            type: "connected",
            name: Y,
            capabilities: D || {},
            client: I,
            config: {
              ...J,
              scope: "dynamic"
            },
            cleanup: async () => {
              await I.close()
            }
          },
          K = [];
        if (D?.tools) {
          let V = await Ax(W);
          K.push(...V)
        }
        return {
          client: W,
          tools: K
        }
      } catch (D) {
        return NZ(Y, `Failed to connect SDK MCP server: ${D}`), {
          client: {
            type: "failed",
            name: Y,
            config: {
              ...J,
              scope: "user"
            }
          },
          tools: []
        }
      }
    }));
  for (let Y of Z)
    if (Y.status === "fulfilled") B.push(Y.value.client), G.push(...Y.value.tools);
  return {
    clients: B,
    tools: G
  }
}
// @from(Ln 385196, Col 4)
nB7
// @from(Ln 385196, Col 9)
Fr2 = 60000
// @from(Ln 385197, Col 2)
oB7
// @from(Ln 385197, Col 7)
SO
// @from(Ln 385197, Col 11)
Ax
// @from(Ln 385197, Col 15)
GhA
// @from(Ln 385197, Col 20)
ZhA
// @from(Ln 385197, Col 25)
PF1
// @from(Ln 385198, Col 4)
jN = w(() => {
  Y9();
  v_A();
  c92();
  l92();
  W42();
  V42();
  eK();
  t9Q();
  v1();
  qz();
  Z0();
  TX();
  C0();
  Q2();
  JX();
  nX();
  sG1();
  AZ1();
  gX0();
  wr();
  fQ();
  PJ();
  iX0();
  L42();
  cJA();
  fn();
  iZ();
  Ib();
  S42();
  IZ1();
  DZ1();
  QVA();
  G$();
  Xr2();
  lxA();
  $F();
  Ox();
  Dr2();
  A0();
  nB7 = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);
  oB7 = ["mcp__ide__executeCode", "mcp__ide__getDiagnostics"];
  SO = W0(async (A, Q, B) => {
    let G = Date.now();
    try {
      let Z, Y = G4A();
      if (Q.type === "sse") {
        let b = new I4A(A, Q),
          S = await _F1(A, Q),
          u = {
            authProvider: b,
            fetch: Wr2(Q4A()),
            requestInit: {
              headers: {
                "User-Agent": VQA(),
                ...S
              }
            }
          };
        u.eventSourceInit = {
          fetch: async (f, AA) => {
            let n = {},
              y = await b.tokens();
            if (y) n.Authorization = `Bearer ${y.access_token}`;
            let p = pJA();
            return fetch(f, {
              ...AA,
              ...p,
              headers: {
                "User-Agent": VQA(),
                ...n,
                ...AA?.headers,
                ...S,
                Accept: "text/event-stream"
              }
            })
          }
        }, Z = new rG1(new URL(Q.url), u), i0(A, "SSE transport initialized, awaiting connection")
      } else if (Q.type === "sse-ide") {
        i0(A, `Setting up SSE-IDE transport to ${Q.url}`);
        let b = pJA(),
          S = b.dispatcher ? {
            eventSourceInit: {
              fetch: async (u, f) => {
                return fetch(u, {
                  ...f,
                  ...b,
                  headers: {
                    "User-Agent": VQA(),
                    ...f?.headers
                  }
                })
              }
            }
          } : {};
        Z = new rG1(new URL(Q.url), Object.keys(S).length > 0 ? S : void 0)
      } else if (Q.type === "ws-ide") {
        let b = Np1(),
          S = {
            headers: {
              "User-Agent": VQA(),
              ...Q.authToken && {
                "X-Claude-Code-Ide-Authorization": Q.authToken
              }
            },
            agent: COA(Q.url),
            ...b || {}
          },
          u = new y_A.default(Q.url, ["mcp"], Object.keys(S).length > 0 ? S : void 0);
        Z = new JZ1(u)
      } else if (Q.type === "ws") {
        i0(A, `Initializing WebSocket transport to ${Q.url}`);
        let b = await _F1(A, Q),
          S = Np1(),
          u = {
            headers: {
              "User-Agent": VQA(),
              ...Y && {
                Authorization: `Bearer ${Y}`
              },
              ...b
            },
            agent: COA(Q.url),
            ...S || {}
          },
          f = Object.fromEntries(Object.entries(u.headers).map(([n, y]) => n.toLowerCase() === "authorization" ? [n, "[REDACTED]"] : [n, y]));
        i0(A, `WebSocket transport options: ${eA({url:Q.url,headers:f,hasSessionAuth:!!Y})}`);
        let AA = new y_A.default(Q.url, ["mcp"], Object.keys(u).length > 0 ? u : void 0);
        Z = new JZ1(AA)
      } else if (Q.type === "http") {
        i0(A, `Initializing HTTP transport to ${Q.url}`), i0(A, `Node version: ${process.version}, Platform: ${process.platform}`), i0(A, `Environment: ${eA({NODE_OPTIONS:process.env.NODE_OPTIONS||"not set",UV_THREADPOOL_SIZE:process.env.UV_THREADPOOL_SIZE||"default",HTTP_PROXY:process.env.HTTP_PROXY||"not set",HTTPS_PROXY:process.env.HTTPS_PROXY||"not set",NO_PROXY:process.env.NO_PROXY||"not set"})}`);
        let b = new I4A(A, Q),
          S = await _F1(A, Q),
          u = pJA();
        i0(A, `Proxy options: ${u.dispatcher?"custom dispatcher":"default"}`);
        let f = {
            authProvider: b,
            fetch: Wr2(Q4A()),
            requestInit: {
              ...u,
              headers: {
                "User-Agent": VQA(),
                ...Y && {
                  Authorization: `Bearer ${Y}`
                },
                ...S
              }
            }
          },
          AA = f.requestInit?.headers ? Object.fromEntries(Object.entries(f.requestInit.headers).map(([n, y]) => n.toLowerCase() === "authorization" ? [n, "[REDACTED]"] : [n, y])) : void 0;
        i0(A, `HTTP transport options: ${eA({url:Q.url,headers:AA,hasAuthProvider:!!b,timeoutMs:Fr2})}`), Z = new kX0(new URL(Q.url), f), i0(A, "HTTP transport created successfully")
      } else if (Q.type === "sdk") throw Error("SDK servers should be handled in print.ts");
      else if (Q.type === "stdio" || !Q.type) {
        let b = process.env.CLAUDE_CODE_SHELL_PREFIX || Q.command,
          S = process.env.CLAUDE_CODE_SHELL_PREFIX ? [
            [Q.command, ...Q.args].join(" ")
          ] : Q.args;
        Z = new KX0({
          command: b,
          args: S,
          env: {
            ...process.env,
            ...Q.env
          },
          stderr: "pipe"
        })
      } else throw Error(`Unsupported server type: ${Q.type}. claude.ai MCP servers require ENABLE_CLAUDEAI_MCP_SERVERS=true.`);
      let J;
      if (Q.type === "stdio" || !Q.type) {
        let b = Z;
        if (b.stderr) J = (S) => {
          let u = S.toString().trim();
          if (u) NZ(A, `Server stderr: ${u}`)
        }, b.stderr.on("data", J)
      }
      let X = new PG1({
        name: "claude-code",
        version: {
          ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
          PACKAGE_URL: "@anthropic-ai/claude-code",
          README_URL: "https://code.claude.com/docs/en/overview",
          VERSION: "2.1.7",
          FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
          BUILD_TIME: "2026-01-13T22:55:21Z"
        }.VERSION ?? "unknown"
      }, {
        capabilities: {
          roots: {},
          ...{}
        }
      });
      if (Q.type === "http") i0(A, "Client created, setting up request handler");
      if (X.setRequestHandler(yY0, async () => {
          return i0(A, "Received ListRoots request from server"), {
            roots: [{
              uri: `file://${EQ()}`
            }]
          }
        }), i0(A, `Starting connection with timeout of ${jF1()}ms`), Q.type === "http") {
        i0(A, `Testing basic HTTP connectivity to ${Q.url}`);
        try {
          let b = new URL(Q.url);
          if (i0(A, `Parsed URL: host=${b.hostname}, port=${b.port||"default"}, protocol=${b.protocol}`), b.hostname === "127.0.0.1" || b.hostname === "localhost") i0(A, `Using loopback address: ${b.hostname}`)
        } catch (b) {
          i0(A, `Failed to parse URL: ${b}`)
        }
      }
      let I = X.connect(Z),
        D = new Promise((b, S) => {
          let u = setTimeout(() => {
            let f = Date.now() - G;
            i0(A, `Connection timeout triggered after ${f}ms (limit: ${jF1()}ms)`), S(Error(`Connection to MCP server "${A}" timed out after ${jF1()}ms`))
          }, jF1());
          I.then(() => {
            clearTimeout(u)
          }, (f) => {
            clearTimeout(u)
          })
        });
      try {
        await Promise.race([I, D]);
        let b = Date.now() - G;
        i0(A, `Successfully connected to ${Q.type} server in ${b}ms`)
      } catch (b) {
        let S = Date.now() - G;
        if (Q.type === "sse" && b instanceof Error) {
          if (i0(A, `SSE Connection failed after ${S}ms: ${eA({url:Q.url,error:b.message,errorType:b.constructor.name,stack:b.stack})}`), NZ(A, b), b instanceof YE) return l("tengu_mcp_server_needs_auth", {}), i0(A, "Authentication required for SSE server"), {
            name: A,
            type: "needs-auth",
            config: Q
          }
        } else if (Q.type === "http" && b instanceof Error) {
          let u = b;
          if (i0(A, `HTTP Connection failed after ${S}ms: ${b.message} (code: ${u.code||"none"}, errno: ${u.errno||"none"})`), NZ(A, b), b instanceof YE) return l("tengu_mcp_server_needs_auth", {}), i0(A, "Authentication required for HTTP server"), {
            name: A,
            type: "needs-auth",
            config: Q
          }
        } else if (Q.type === "sse-ide" || Q.type === "ws-ide") l("tengu_mcp_ide_server_connection_failed", {
          connectionDurationMs: S
        });
        throw b
      }
      let W = X.getServerCapabilities(),
        K = X.getServerVersion(),
        V = X.getInstructions();
      if (i0(A, `Connection established with capabilities: ${eA({hasTools:!!W?.tools,hasPrompts:!!W?.prompts,hasResources:!!W?.resources,serverVersion:K||"unknown"})}`), Q.type === "sse-ide" || Q.type === "ws-ide") {
        let b = Date.now() - G;
        l("tengu_mcp_ide_server_connection_succeeded", {
          connectionDurationMs: b,
          serverVersion: K
        });
        try {
          Cr2(X)
        } catch (S) {
          NZ(A, `Failed to send ide_connected notification: ${S}`)
        }
      }
      let F = Date.now(),
        H = !1,
        E = X.onerror,
        z = X.onclose,
        $ = 0,
        O = 3,
        L = (b) => {
          return b.includes("ECONNRESET") || b.includes("ETIMEDOUT") || b.includes("EPIPE") || b.includes("EHOSTUNREACH") || b.includes("ECONNREFUSED") || b.includes("Body Timeout Error") || b.includes("terminated")
        };
      X.onerror = (b) => {
        let S = Date.now() - F;
        H = !0;
        let u = Q.type || "stdio";
        if (i0(A, `${u.toUpperCase()} connection dropped after ${Math.floor(S/1000)}s uptime`), b.message)
          if (b.message.includes("ECONNRESET")) i0(A, "Connection reset - server may have crashed or restarted");
          else if (b.message.includes("ETIMEDOUT")) i0(A, "Connection timeout - network issue or server unresponsive");
        else if (b.message.includes("ECONNREFUSED")) i0(A, "Connection refused - server may be down");
        else if (b.message.includes("EPIPE")) i0(A, "Broken pipe - server closed connection unexpectedly");
        else if (b.message.includes("EHOSTUNREACH")) i0(A, "Host unreachable - network connectivity issue");
        else if (b.message.includes("ESRCH")) i0(A, "Process not found - stdio server process terminated");
        else if (b.message.includes("spawn")) i0(A, "Failed to spawn process - check command and permissions");
        else i0(A, `Connection error: ${b.message}`);
        if (u === "sse" || u === "http" || u === "claudeai-proxy")
          if (L(b.message)) {
            if ($++, i0(A, `Terminal connection error ${$}/${O}`), $ >= O) i0(A, "Max consecutive errors reached, triggering reconnection via onclose"), $ = 0, X.onclose?.()
          } else $ = 0;
        if (E) E(b)
      }, X.onclose = () => {
        let b = Date.now() - F,
          S = Q.type ?? "unknown";
        i0(A, `${S.toUpperCase()} connection closed after ${Math.floor(b/1000)}s (${H?"with errors":"cleanly"})`);
        let u = FL0(A, Q);
        if (SO.cache.delete(u), i0(A, "Cleared connection cache for reconnection"), z) z()
      };
      let M = async () => {
        if (J && (Q.type === "stdio" || !Q.type)) Z.stderr?.off("data", J);
        if (Q.type === "stdio") try {
          let S = Z.pid;
          if (S) {
            i0(A, "Sending SIGINT to MCP server process");
            try {
              process.kill(S, "SIGINT")
            } catch (u) {
              i0(A, `Error sending SIGINT: ${u}`);
              return
            }
            await new Promise(async (u) => {
              let f = !1,
                AA = setInterval(() => {
                  try {
                    process.kill(S, 0)
                  } catch {
                    if (!f) f = !0, clearInterval(AA), clearTimeout(n), i0(A, "MCP server process exited cleanly"), u()
                  }
                }, 50),
                n = setTimeout(() => {
                  if (!f) f = !0, clearInterval(AA), i0(A, "Cleanup timeout reached, stopping process monitoring"), u()
                }, 600);
              try {
                if (await new Promise((y) => setTimeout(y, 100)), !f) {
                  try {
                    process.kill(S, 0), i0(A, "SIGINT failed, sending SIGTERM to MCP server process");
                    try {
                      process.kill(S, "SIGTERM")
                    } catch (y) {
                      i0(A, `Error sending SIGTERM: ${y}`), f = !0, clearInterval(AA), clearTimeout(n), u();
                      return
                    }
                  } catch {
                    f = !0, clearInterval(AA), clearTimeout(n), u();
                    return
                  }
                  if (await new Promise((y) => setTimeout(y, 400)), !f) try {
                    process.kill(S, 0), i0(A, "SIGTERM failed, sending SIGKILL to MCP server process");
                    try {
                      process.kill(S, "SIGKILL")
                    } catch (y) {
                      i0(A, `Error sending SIGKILL: ${y}`)
                    }
                  } catch {
                    f = !0, clearInterval(AA), clearTimeout(n), u()
                  }
                }
                if (!f) f = !0, clearInterval(AA), clearTimeout(n), u()
              } catch {
                if (!f) f = !0, clearInterval(AA), clearTimeout(n), u()
              }
            })
          }
        } catch (b) {
          i0(A, `Error terminating process: ${b}`)
        }
        try {
          await X.close()
        } catch (b) {
          i0(A, `Error closing client: ${b}`)
        }
      }, _ = C6(M), j = async () => {
        _?.(), await M()
      }, x = Date.now() - G;
      return l("tengu_mcp_server_connection_succeeded", {
        connectionDurationMs: x,
        transportType: Q.type,
        totalServers: B?.totalServers,
        stdioCount: B?.stdioCount,
        sseCount: B?.sseCount,
        httpCount: B?.httpCount,
        sseIdeCount: B?.sseIdeCount,
        wsIdeCount: B?.wsIdeCount
      }), {
        name: A,
        client: X,
        type: "connected",
        capabilities: W ?? {},
        serverInfo: K,
        instructions: V,
        config: Q,
        cleanup: j
      }
    } catch (Z) {
      let Y = Date.now() - G;
      return l("tengu_mcp_server_connection_failed", {
        connectionDurationMs: Y,
        totalServers: B?.totalServers || 1,
        stdioCount: B?.stdioCount || (Q.type === "stdio" ? 1 : 0),
        sseCount: B?.sseCount || (Q.type === "sse" ? 1 : 0),
        httpCount: B?.httpCount || (Q.type === "http" ? 1 : 0),
        sseIdeCount: B?.sseIdeCount || (Q.type === "sse-ide" ? 1 : 0),
        wsIdeCount: B?.wsIdeCount || (Q.type === "ws-ide" ? 1 : 0),
        transportType: Q.type
      }), i0(A, `Connection failed after ${Y}ms: ${Z instanceof Error?Z.message:String(Z)}`), NZ(A, `Connection failed: ${Z instanceof Error?Z.message:String(Z)}`), {
        name: A,
        type: "failed",
        config: Q,
        error: Z instanceof Error ? Z.message : String(Z)
      }
    }
  }, FL0);
  Ax = W0(async (A) => {
    if (A.type !== "connected") return [];
    try {
      if (!A.capabilities?.tools) return [];
      let Q = await A.client.request({
        method: "tools/list"
      }, WxA);
      return Nr(Q.tools).map((G) => ({
        ...P42,
        name: `mcp__${e3(A.name)}__${e3(G.name)}`,
        originalMcpToolName: G.name,
        isMcp: !0,
        async description() {
          return G.description ?? ""
        },
        async prompt() {
          return G.description ?? ""
        },
        isConcurrencySafe() {
          return G.annotations?.readOnlyHint ?? !1
        },
        isReadOnly() {
          return G.annotations?.readOnlyHint ?? !1
        },
        isDestructive() {
          return G.annotations?.destructiveHint ?? !1
        },
        isOpenWorld() {
          return G.annotations?.openWorldHint ?? !1
        },
        inputJSONSchema: G.inputSchema,
        async checkPermissions() {
          return {
            behavior: "passthrough",
            message: "MCPTool requires permission.",
            suggestions: [{
              type: "addRules",
              rules: [{
                toolName: `mcp__${e3(A.name)}__${e3(G.name)}`,
                ruleContent: void 0
              }],
              behavior: "allow",
              destination: "localSettings"
            }]
          }
        },
        async call(Z, Y, J, X) {
          let I = eB7(X),
            D = I ? {
              "claudecode/toolUseId": I
            } : {},
            W = await eKA(A);
          return {
            data: await zr2({
              client: W,
              tool: G.name,
              args: Z,
              meta: D,
              signal: Y.abortController.signal
            })
          }
        },
        userFacingName() {
          let Z = G.annotations?.title || G.name;
          return `${A.name} - ${Z} (MCP)`
        },
        ...uEA(A.name) ? Ir2(G.name) : {}
      })).filter(rB7)
    } catch (Q) {
      return NZ(A.name, `Failed to fetch tools: ${Q instanceof Error?Q.message:String(Q)}`), []
    }
  }), GhA = W0(async (A) => {
    if (A.type !== "connected") return [];
    try {
      if (!A.capabilities?.resources) return [];
      let Q = await A.client.request({
        method: "resources/list"
      }, l9A);
      if (!Q.resources) return [];
      return Q.resources.map((B) => ({
        ...B,
        server: A.name
      }))
    } catch (Q) {
      return NZ(A.name, `Failed to fetch resources: ${Q instanceof Error?Q.message:String(Q)}`), []
    }
  }), ZhA = W0(async (A) => {
    if (A.type !== "connected") return [];
    try {
      if (!A.capabilities?.prompts) return [];
      let Q = await A.client.request({
        method: "prompts/list"
      }, IxA);
      if (!Q.prompts) return [];
      return Nr(Q.prompts).map((G) => {
        let Z = Object.values(G.arguments ?? {}).map((Y) => Y.name);
        return {
          type: "prompt",
          name: "mcp__" + e3(A.name) + "__" + G.name,
          description: G.description ?? "",
          hasUserSpecifiedDescription: !!G.description,
          contentLength: 0,
          isEnabled: () => !0,
          isHidden: !1,
          isMcp: !0,
          progressMessage: "running",
          userFacingName() {
            return `${A.name}:${G.name} (MCP)`
          },
          argNames: Z,
          source: "mcp",
          async getPromptForCommand(Y) {
            let J = Y.split(" ");
            try {
              let X = await eKA(A),
                I = await X.client.getPrompt({
                  name: G.name,
                  arguments: s9Q(Z, J)
                });
              return (await Promise.all(I.messages.map((W) => Er2(W.content, X.name)))).flat()
            } catch (X) {
              throw NZ(A.name, `Error running command '${G.name}': ${X instanceof Error?X.message:String(X)}`), X
            }
          }
        }
      })
    } catch (Q) {
      return NZ(A.name, `Failed to fetch commands: ${Q instanceof Error?Q.message:String(Q)}`), []
    }
  });
  PF1 = W0(async (A) => {
    return new Promise((Q) => {
      let B = 0,
        G = 0;
      if (B = Object.keys(A).length, B === 0) {
        Q({
          clients: [],
          tools: [],
          commands: []
        });
        return
      }
      let Z = [],
        Y = [],
        J = [];
      EL0((X) => {
        if (Z.push(X.client), Y.push(...X.tools), J.push(...X.commands), G++, G >= B) {
          let I = J.reduce((D, W) => {
            let K = W.name.length + (W.description ?? "").length + (W.argumentHint ?? "").length;
            return D + K
          }, 0);
          l("tengu_mcp_tools_commands_loaded", {
            tools_count: Y.length,
            commands_count: J.length,
            commands_metadata_length: I
          }), Q({
            clients: Z,
            tools: Y,
            commands: J
          })
        }
      }, A).catch((X) => {
        NZ("prefetchAllMcpResources", `Failed to get MCP resources: ${X instanceof Error?X.message:String(X)}`), Q({
          clients: [],
          tools: [],
          commands: []
        })
      })
    })
  })
})
// @from(Ln 385768, Col 0)
function Q27(A) {
  let Q = YhA.homedir(),
    B = [],
    G = qr2[A.toLowerCase()];
  if (!G) return B;
  let Z = process.env.APPDATA || lF.join(Q, "AppData", "Roaming"),
    Y = process.env.LOCALAPPDATA || lF.join(Q, "AppData", "Local");
  switch (YhA.platform()) {
    case "darwin":
      if (B.push(lF.join(Q, "Library", "Application Support", "JetBrains"), lF.join(Q, "Library", "Application Support")), A.toLowerCase() === "androidstudio") B.push(lF.join(Q, "Library", "Application Support", "Google"));
      break;
    case "win32":
      if (B.push(lF.join(Z, "JetBrains"), lF.join(Y, "JetBrains"), lF.join(Z)), A.toLowerCase() === "androidstudio") B.push(lF.join(Y, "Google"));
      break;
    case "linux":
      B.push(lF.join(Q, ".config", "JetBrains"), lF.join(Q, ".local", "share", "JetBrains"));
      for (let J of G) B.push(lF.join(Q, "." + J));
      if (A.toLowerCase() === "androidstudio") B.push(lF.join(Q, ".config", "Google"));
      break;
    default:
      break
  }
  return B
}
// @from(Ln 385793, Col 0)
function B27(A) {
  let Q = [],
    B = vA(),
    G = Q27(A),
    Z = qr2[A.toLowerCase()];
  if (!Z) return Q;
  for (let Y of G) {
    if (!B.existsSync(Y)) continue;
    for (let J of Z) try {
      let X = new RegExp("^" + J + ".*$"),
        I = B.readdirSync(Y).filter((D) => X.test(D.name) && B.statSync(lF.join(Y, D.name)).isDirectory()).map((D) => lF.join(Y, D.name));
      for (let D of I) {
        let W = YhA.platform() === "linux" ? D : lF.join(D, "plugins");
        if (B.existsSync(W)) Q.push(W)
      }
    } catch {
      continue
    }
  }
  return Q.filter((Y, J) => Q.indexOf(Y) === J)
}
// @from(Ln 385815, Col 0)
function zL0(A) {
  let Q = B27(A);
  for (let B of Q) {
    let G = lF.join(B, A27);
    if (vA().existsSync(G)) return !0
  }
  return !1
}
// @from(Ln 385824, Col 0)
function Nr2(A, Q = !1) {
  if (Q) Ur2.cache.delete(A);
  return Ur2(A)
}
// @from(Ln 385828, Col 4)
A27 = "claude-code-jetbrains-plugin"
// @from(Ln 385829, Col 2)
qr2
// @from(Ln 385829, Col 7)
Ur2
// @from(Ln 385830, Col 4)
$L0 = w(() => {
  DQ();
  Y9();
  qr2 = {
    pycharm: ["PyCharm"],
    intellij: ["IntelliJIdea", "IdeaIC"],
    webstorm: ["WebStorm"],
    phpstorm: ["PhpStorm"],
    rubymine: ["RubyMine"],
    clion: ["CLion"],
    goland: ["GoLand"],
    rider: ["Rider"],
    datagrip: ["DataGrip"],
    appcode: ["AppCode"],
    dataspell: ["DataSpell"],
    aqua: ["Aqua"],
    gateway: ["Gateway"],
    fleet: ["Fleet"],
    androidstudio: ["AndroidStudio"]
  };
  Ur2 = W0(zL0)
})
// @from(Ln 385853, Col 0)
function wr2({
  onDone: A,
  installationStatus: Q
}) {
  let B = MQ();
  G27(), J0((D, W) => {
    if (W.escape || W.return) A()
  });
  let G = Q?.ideType ?? pEA(),
    Z = Rx(G),
    Y = EK(G),
    J = Q?.installedVersion,
    X = Z ? "plugin" : "extension",
    I = l0.platform === "darwin" ? "Cmd+Option+K" : "Ctrl+Alt+K";
  return EZ.default.createElement(EZ.default.Fragment, null, EZ.default.createElement(T, {
    flexDirection: "column"
  }, EZ.default.createElement(T, {
    flexDirection: "column",
    borderStyle: "round",
    borderColor: "ide",
    paddingLeft: 1,
    paddingRight: 1,
    gap: 1
  }, EZ.default.createElement(T, null, EZ.default.createElement(C, {
    color: "claude"
  }, "✻ "), EZ.default.createElement(T, {
    flexDirection: "column"
  }, EZ.default.createElement(C, null, "Welcome to ", EZ.default.createElement(C, {
    bold: !0
  }, "Claude Code"), " for", " ", EZ.default.createElement(C, {
    color: "ide",
    bold: !0
  }, Y)), J && EZ.default.createElement(C, {
    dimColor: !0
  }, "installed ", X, " v", J))), EZ.default.createElement(T, {
    flexDirection: "column",
    paddingLeft: 1,
    gap: 1
  }, EZ.default.createElement(C, null, "• Claude has context of", " ", EZ.default.createElement(C, {
    color: "suggestion"
  }, "⧉ open files"), " and", " ", EZ.default.createElement(C, {
    color: "suggestion"
  }, "⧉ selected lines")), EZ.default.createElement(C, null, "• Review Claude Code's changes", " ", EZ.default.createElement(C, {
    color: "diffAddedWord"
  }, "+11"), " ", EZ.default.createElement(C, {
    color: "diffRemovedWord"
  }, "-22"), " in the comfort of your IDE"), EZ.default.createElement(C, null, "• Cmd+Esc", EZ.default.createElement(C, {
    dimColor: !0
  }, " for Quick Launch")), EZ.default.createElement(C, null, "• ", I, EZ.default.createElement(C, {
    dimColor: !0
  }, " to reference files or lines in your input")))), EZ.default.createElement(T, {
    marginLeft: 3
  }, EZ.default.createElement(C, {
    dimColor: !0
  }, B.pending ? EZ.default.createElement(EZ.default.Fragment, null, "Press ", B.keyName, " again to exit") : EZ.default.createElement(EZ.default.Fragment, null, "Press Enter to continue")))))
}
// @from(Ln 385910, Col 0)
function SF1() {
  let A = L1(),
    Q = wq.terminal || "unknown";
  return A.hasIdeOnboardingBeenShown?.[Q] === !0
}
// @from(Ln 385916, Col 0)
function G27() {
  if (SF1()) return;
  let A = wq.terminal || "unknown";
  S0((Q) => ({
    ...Q,
    hasIdeOnboardingBeenShown: {
      ...Q.hasIdeOnboardingBeenShown,
      [A]: !0
    }
  }))
}
// @from(Ln 385927, Col 4)
EZ
// @from(Ln 385928, Col 4)
CL0 = w(() => {
  fA();
  TX();
  p3();
  E9();
  GQ();
  G0A();
  EZ = c(QA(), 1)
})
// @from(Ln 385940, Col 0)
class lEA {
  wslDistroName;
  constructor(A) {
    this.wslDistroName = A
  }
  toLocalPath(A) {
    if (!A) return A;
    if (this.wslDistroName) {
      let Q = A.match(/^\\\\wsl(?:\.localhost|\$)\\([^\\]+)(.*)$/);
      if (Q && Q[1] !== this.wslDistroName) return A
    }
    try {
      return Lr2("wslpath", ["-u", A], {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "ignore"]
      }).trim()
    } catch {
      return A.replace(/\\/g, "/").replace(/^([A-Z]):/i, (Q, B) => `/mnt/${B.toLowerCase()}`)
    }
  }
  toIDEPath(A) {
    if (!A) return A;
    try {
      return Lr2("wslpath", ["-w", A], {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "ignore"]
      }).trim()
    } catch {
      return A
    }
  }
}
// @from(Ln 385973, Col 0)
function Or2(A, Q) {
  let B = A.match(/^\\\\wsl(?:\.localhost|\$)\\([^\\]+)(.*)$/);
  if (B) return B[1] === Q;
  return !0
}
// @from(Ln 385978, Col 4)
UL0 = () => {}
// @from(Ln 385992, Col 0)
function Pr2(A) {
  try {
    return process.kill(A, 0), !0
  } catch {
    return !1
  }
}
// @from(Ln 386000, Col 0)
function X27(A) {
  if (!Pr2(A)) return !1;
  if (!zK()) return !0;
  try {
    let Q = process.ppid;
    for (let B = 0; B < 10; B++) {
      if (Q === A) return !0;
      if (Q === 0 || Q === 1) break;
      let G = _aA(Q),
        Z = G ? parseInt(G) : null;
      if (!Z || Z === Q) break;
      Q = Z
    }
    return !1
  } catch (Q) {
    return !1
  }
}
// @from(Ln 386019, Col 0)
function kF1(A) {
  if (!A) return !1;
  let Q = iEA[A];
  return Q && Q.ideKind === "vscode"
}
// @from(Ln 386025, Col 0)
function Rx(A) {
  if (!A) return !1;
  let Q = iEA[A];
  return Q && Q.ideKind === "jetbrains"
}
// @from(Ln 386031, Col 0)
function pEA() {
  if (!zK()) return null;
  return l0.terminal
}
// @from(Ln 386036, Col 0)
function bF1() {
  try {
    return I27().flatMap((B) => {
      try {
        return vA().readdirSync(B).filter((G) => G.name.endsWith(".lock")).map((G) => {
          let Z = qL0(B, G.name);
          return {
            path: Z,
            mtime: vA().statSync(Z).mtime
          }
        })
      } catch (G) {
        return e(G), []
      }
    }).sort((B, G) => G.mtime.getTime() - B.mtime.getTime()).map((B) => B.path)
  } catch (A) {
    return e(A), []
  }
}
// @from(Ln 386056, Col 0)
function Sr2(A) {
  try {
    let Q = vA().readFileSync(A, {
        encoding: "utf-8"
      }),
      B = [],
      G, Z, Y = !1,
      J = !1,
      X;
    try {
      let W = AQ(Q);
      if (W.workspaceFolders) B = W.workspaceFolders;
      G = W.pid, Z = W.ideName, Y = W.transport === "ws", J = W.runningInWindows === !0, X = W.authToken
    } catch (W) {
      B = Q.split(`
`).map((K) => K.trim())
    }
    let I = A.split(yF1).pop();
    if (!I) return null;
    let D = I.replace(".lock", "");
    return {
      workspaceFolders: B,
      port: parseInt(D),
      pid: G,
      ideName: Z,
      useWebSocket: Y,
      runningInWindows: J,
      authToken: X
    }
  } catch (Q) {
    return e(Q), null
  }
}
// @from(Ln 386089, Col 0)
async function NL0(A, Q, B = 500) {
  try {
    return new Promise((G) => {
      let Z = J27({
        host: A,
        port: Q,
        timeout: B
      });
      Z.on("connect", () => {
        Z.destroy(), G(!0)
      }), Z.on("error", () => {
        G(!1)
      }), Z.on("timeout", () => {
        Z.destroy(), G(!1)
      })
    })
  } catch (G) {
    return !1
  }
}
// @from(Ln 386110, Col 0)
function I27() {
  let A = [],
    Q = vA(),
    B = $Q(),
    G = qL0(zQ(), "ide");
  if (Q.existsSync(G)) A.push(G);
  if (B !== "wsl") return A;
  let Z = process.env.USERPROFILE;
  if (!Z) try {
    let Y = NH("powershell.exe -Command '$env:USERPROFILE'");
    if (Y) Z = Y.trim()
  } catch {
    k("Unable to get Windows USERPROFILE via PowerShell - IDE detection may be incomplete")
  }
  if (Z) {
    let J = new lEA(process.env.WSL_DISTRO_NAME).toLocalPath(Z),
      X = vF1(J, ".claude", "ide");
    if (Q.existsSync(X)) A.push(X)
  }
  try {
    if (Q.existsSync("/mnt/c/Users")) {
      let J = Q.readdirSync("/mnt/c/Users");
      for (let X of J) {
        if (X.name === "Public" || X.name === "Default" || X.name === "Default User" || X.name === "All Users") continue;
        let I = qL0("/mnt/c/Users", X.name, ".claude", "ide");
        if (Q.existsSync(I)) A.push(I)
      }
    }
  } catch (Y) {
    e(Y instanceof Error ? Y : Error(String(Y)))
  }
  return A
}
// @from(Ln 386143, Col 0)
async function D27() {
  try {
    let A = bF1();
    for (let Q of A) {
      let B = Sr2(Q);
      if (!B) {
        try {
          vA().unlinkSync(Q)
        } catch (Y) {
          e(Y)
        }
        continue
      }
      let G = await gr2(B.runningInWindows, B.port),
        Z = !1;
      if (B.pid) {
        if (!Pr2(B.pid)) {
          if ($Q() !== "wsl") Z = !0;
          else if (!await NL0(G, B.port)) Z = !0
        }
      } else if (!await NL0(G, B.port)) Z = !0;
      if (Z) try {
        vA().unlinkSync(Q)
      } catch (Y) {
        e(Y)
      }
    }
  } catch (A) {
    e(A)
  }
}
// @from(Ln 386174, Col 0)
async function K27(A) {
  try {
    let Q = await F27(A);
    if (l("tengu_ext_installed", {}), !L1().diffTool) S0((G) => ({
      ...G,
      diffTool: "auto"
    }));
    return {
      installed: !0,
      error: null,
      installedVersion: Q,
      ideType: A
    }
  } catch (Q) {
    l("tengu_ext_install_error", {});
    let B = Q instanceof Error ? Q.message : String(Q);
    return e(Q), {
      installed: !1,
      error: B,
      installedVersion: null,
      ideType: A
    }
  }
}
// @from(Ln 386198, Col 0)
async function Mr2() {
  if (xF1) xF1.abort();
  xF1 = c9();
  let A = xF1.signal;
  await D27();
  let Q = Date.now();
  while (Date.now() - Q < 30000 && !A.aborted) {
    let B = await IhA(!1);
    if (A.aborted) return null;
    if (B.length === 1) return B[0];
    await new Promise((G) => setTimeout(G, 1000))
  }
  return null
}
// @from(Ln 386212, Col 0)
async function IhA(A) {
  let Q = [];
  try {
    let B = process.env.CLAUDE_CODE_SSE_PORT,
      G = B ? parseInt(B) : null,
      Z = EQ(),
      Y = bF1();
    for (let J of Y) {
      let X = Sr2(J);
      if (!X) continue;
      if ($Q() !== "wsl" && zK() && (!X.pid || !X27(X.pid))) continue;
      let I = !1;
      if (process.env.CLAUDE_CODE_IDE_SKIP_VALID_CHECK === "true") I = !0;
      else if (X.port === G) I = !0;
      else I = X.workspaceFolders.some((V) => {
        if (!V) return !1;
        let F = V;
        if ($Q() === "wsl" && X.runningInWindows && process.env.WSL_DISTRO_NAME) {
          if (!Or2(V, process.env.WSL_DISTRO_NAME)) return !1;
          let E = vF1(F);
          if (Z === E || Z.startsWith(E + yF1)) return !0;
          F = new lEA(process.env.WSL_DISTRO_NAME).toLocalPath(V)
        }
        let H = vF1(F);
        if ($Q() === "windows") {
          let E = Z.replace(/^[a-zA-Z]:/, ($) => $.toUpperCase()),
            z = H.replace(/^[a-zA-Z]:/, ($) => $.toUpperCase());
          return E === z || E.startsWith(z + yF1)
        }
        return Z === H || Z.startsWith(H + yF1)
      });
      if (!I && !A) continue;
      let D = X.ideName ?? (zK() ? EK(wq.terminal) : "IDE"),
        W = await gr2(X.runningInWindows, X.port),
        K;
      if (X.useWebSocket) K = `ws://${W}:${X.port}`;
      else K = `http://${W}:${X.port}/sse`;
      Q.push({
        url: K,
        name: D,
        workspaceFolders: X.workspaceFolders,
        port: X.port,
        isValid: I,
        authToken: X.authToken,
        ideRunningInWindows: X.runningInWindows
      })
    }
    if (!A && G) {
      let J = Q.filter((X) => X.isValid && X.port === G);
      if (J.length === 1) return J
    }
  } catch (B) {
    e(B)
  }
  return Q
}
// @from(Ln 386268, Col 0)
async function Cr2(A) {
  await A.notification({
    method: "ide_connected",
    params: {
      pid: process.pid
    }
  })
}
// @from(Ln 386277, Col 0)
function fF1(A) {
  return A.some((Q) => Q.type === "connected" && Q.name === "ide")
}
// @from(Ln 386280, Col 0)
async function Rr2(A) {
  if (kF1(A)) {
    let Q = xr2(A);
    if (Q) try {
      if ((await J2(Q, ["--list-extensions"], {
          env: LL0()
        })).stdout?.includes(V27)) return !0
    } catch {}
  } else if (Rx(A)) return zL0(A);
  return !1
}
// @from(Ln 386291, Col 0)
async function F27(A) {
  if (kF1(A)) {
    let Q = xr2(A);
    if (Q) {
      let B = await H27(Q);
      if (!B || Tr2.lt(B, _r2())) {
        await new Promise((Z) => {
          setTimeout(Z, 500)
        });
        let G = await J2(Q, ["--force", "--install-extension", "anthropic.claude-code"], {
          env: LL0()
        });
        if (G.code !== 0) throw Error(`${G.code}: ${G.error} ${G.stderr}`);
        B = _r2()
      }
      return B
    }
  }
  return null
}
// @from(Ln 386312, Col 0)
function LL0() {
  if ($Q() === "linux") return {
    ...process.env,
    DISPLAY: ""
  };
  return
}
// @from(Ln 386320, Col 0)
function _r2() {
  return {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.1.7",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
    BUILD_TIME: "2026-01-13T22:55:21Z"
  }.VERSION
}
// @from(Ln 386330, Col 0)
async function H27(A) {
  let {
    stdout: Q
  } = await TQ(A, ["--list-extensions", "--show-versions"], {
    env: LL0()
  }), B = Q?.split(`
`) || [];
  for (let G of B) {
    let [Z, Y] = G.split("@");
    if (Z === "anthropic.claude-code" && Y) return Y
  }
  return null
}
// @from(Ln 386344, Col 0)
function E27() {
  try {
    if ($Q() !== "macos") return null;
    let Q = process.ppid;
    for (let B = 0; B < 10; B++) {
      if (!Q || Q === 0 || Q === 1) break;
      let G = NH(`ps -o command= -p ${Q}`)?.trim();
      if (G) {
        let Y = {
            "Visual Studio Code.app": "code",
            "Cursor.app": "cursor",
            "Windsurf.app": "windsurf",
            "Visual Studio Code - Insiders.app": "code",
            "VSCodium.app": "codium"
          },
          J = "/Contents/MacOS/Electron";
        for (let [X, I] of Object.entries(Y)) {
          let D = G.indexOf(X + "/Contents/MacOS/Electron");
          if (D !== -1) {
            let W = D + X.length;
            return G.substring(0, W) + "/Contents/Resources/app/bin/" + I
          }
        }
      }
      let Z = NH(`ps -o ppid= -p ${Q}`)?.trim();
      if (!Z) break;
      Q = parseInt(Z.trim())
    }
    return null
  } catch {
    return null
  }
}
// @from(Ln 386378, Col 0)
function xr2(A) {
  let Q = E27();
  if (Q) {
    if (vA().existsSync(Q)) return Q
  }
  switch (A) {
    case "vscode":
      return "code";
    case "cursor":
      return "cursor";
    case "windsurf":
      return "windsurf";
    default:
      break
  }
  return null
}
// @from(Ln 386395, Col 0)
async function yr2() {
  return (await TQ("cursor", ["--version"])).code === 0
}
// @from(Ln 386398, Col 0)
async function vr2() {
  return (await TQ("windsurf", ["--version"])).code === 0
}
// @from(Ln 386401, Col 0)
async function kr2() {
  let A = await TQ("code", ["--help"]);
  return A.code === 0 && Boolean(A.stdout?.includes("Visual Studio Code"))
}
// @from(Ln 386405, Col 0)
async function z27() {
  let A = [];
  try {
    let Q = $Q();
    if (Q === "macos") {
      let G = (await e5('ps aux | grep -E "Visual Studio Code|Code Helper|Cursor Helper|Windsurf Helper|IntelliJ IDEA|PyCharm|WebStorm|PhpStorm|RubyMine|CLion|GoLand|Rider|DataGrip|AppCode|DataSpell|Aqua|Gateway|Fleet|Android Studio" | grep -v grep', {
        shell: !0,
        reject: !1
      })).stdout ?? "";
      for (let [Z, Y] of Object.entries(iEA))
        for (let J of Y.processKeywordsMac)
          if (G.includes(J)) {
            A.push(Z);
            break
          }
    } else if (Q === "windows") {
      let Z = ((await e5('tasklist | findstr /I "Code.exe Cursor.exe Windsurf.exe idea64.exe pycharm64.exe webstorm64.exe phpstorm64.exe rubymine64.exe clion64.exe goland64.exe rider64.exe datagrip64.exe appcode.exe dataspell64.exe aqua64.exe gateway64.exe fleet.exe studio64.exe"', {
        shell: !0,
        reject: !1
      })).stdout ?? "").toLowerCase();
      for (let [Y, J] of Object.entries(iEA))
        for (let X of J.processKeywordsWindows)
          if (Z.includes(X.toLowerCase())) {
            A.push(Y);
            break
          }
    } else if (Q === "linux") {
      let Z = ((await e5('ps aux | grep -E "code|cursor|windsurf|idea|pycharm|webstorm|phpstorm|rubymine|clion|goland|rider|datagrip|dataspell|aqua|gateway|fleet|android-studio" | grep -v grep', {
        shell: !0,
        reject: !1
      })).stdout ?? "").toLowerCase();
      for (let [Y, J] of Object.entries(iEA))
        for (let X of J.processKeywordsLinux)
          if (Z.includes(X)) {
            if (Y !== "vscode") {
              A.push(Y);
              break
            } else if (!Z.includes("cursor") && !Z.includes("appcode")) {
              A.push(Y);
              break
            }
          }
    }
  } catch (Q) {
    e(Q)
  }
  return A
}
// @from(Ln 386453, Col 0)
async function OL0() {
  let A = await z27();
  return wL0 = A, A
}
// @from(Ln 386457, Col 0)
async function br2() {
  if (wL0 === null) return OL0();
  return wL0
}
// @from(Ln 386462, Col 0)
function hF1(A) {
  let Q = A.find((B) => B.type === "connected" && B.name === "ide");
  return ML0(Q)
}
// @from(Ln 386467, Col 0)
function ML0(A) {
  let Q = A?.config;
  return Q?.type === "sse-ide" || Q?.type === "ws-ide" ? Q.ideName : zK() ? EK(wq.terminal) : null
}
// @from(Ln 386472, Col 0)
function EK(A) {
  if (!A) return "IDE";
  let Q = iEA[A];
  if (Q) return Q.displayName;
  let B = jr2[A.toLowerCase().trim()];
  if (B) return B;
  let G = A.split(" ")[0],
    Z = G ? Z27(G).toLowerCase() : null;
  if (Z) {
    let Y = jr2[Z];
    if (Y) return Y;
    return J1A(Z)
  }
  return J1A(A)
}
// @from(Ln 386488, Col 0)
function nN(A) {
  if (!A) return;
  let Q = A.find((B) => B.type === "connected" && B.name === "ide");
  return Q?.type === "connected" ? Q : void 0
}
// @from(Ln 386493, Col 0)
async function fr2(A) {
  try {
    await Hc("closeAllDiffTabs", {}, A)
  } catch (Q) {}
}
// @from(Ln 386498, Col 0)
async function hr2(A, Q, B, G) {
  Mr2().then(A);
  let Z = L1().autoInstallIdeExtension ?? !0;
  if (process.env.CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL !== "true" && Z) {
    let Y = Q ?? pEA();
    if (Y) {
      if (kF1(Y)) Rr2(Y).then(async (J) => {
        K27(Y).catch((X) => {
          return {
            installed: !1,
            error: X.message || "Installation failed",
            installedVersion: null,
            ideType: Y
          }
        }).then((X) => {
          if (G(X), X?.installed) Mr2().then(A);
          if (!J && X?.installed === !0 && !SF1()) B()
        })
      });
      else if (Rx(Y) && !SF1()) Rr2(Y).then(async (J) => {
        if (J) B()
      })
    }
  }
}
// @from(Ln 386523, Col 4)
Tr2
// @from(Ln 386523, Col 9)
iEA
// @from(Ln 386523, Col 14)
JhA
// @from(Ln 386523, Col 19)
XhA
// @from(Ln 386523, Col 24)
zK
// @from(Ln 386523, Col 28)
W27
// @from(Ln 386523, Col 33)
cVY
// @from(Ln 386523, Col 38)
xF1 = null
// @from(Ln 386524, Col 2)
V27 = "anthropic.claude-code"
// @from(Ln 386525, Col 2)
wL0 = null
// @from(Ln 386526, Col 2)
jr2
// @from(Ln 386526, Col 7)
gr2
// @from(Ln 386527, Col 4)
TX = w(() => {
  p3();
  fQ();
  TaA();
  t4();
  Vq();
  GQ();
  Z0();
  LpA();
  Y9();
  C0();
  DQ();
  v1();
  c3();
  jN();
  $L0();
  CL0();
  UL0();
  T1();
  iZ();
  G0A();
  A0();
  Tr2 = c(xP(), 1);
  iEA = {
    cursor: {
      ideKind: "vscode",
      displayName: "Cursor",
      processKeywordsMac: ["Cursor Helper", "Cursor.app"],
      processKeywordsWindows: ["cursor.exe"],
      processKeywordsLinux: ["cursor"]
    },
    windsurf: {
      ideKind: "vscode",
      displayName: "Windsurf",
      processKeywordsMac: ["Windsurf Helper", "Windsurf.app"],
      processKeywordsWindows: ["windsurf.exe"],
      processKeywordsLinux: ["windsurf"]
    },
    vscode: {
      ideKind: "vscode",
      displayName: "VS Code",
      processKeywordsMac: ["Visual Studio Code", "Code Helper"],
      processKeywordsWindows: ["code.exe"],
      processKeywordsLinux: ["code"]
    },
    intellij: {
      ideKind: "jetbrains",
      displayName: "IntelliJ IDEA",
      processKeywordsMac: ["IntelliJ IDEA"],
      processKeywordsWindows: ["idea64.exe"],
      processKeywordsLinux: ["idea", "intellij"]
    },
    pycharm: {
      ideKind: "jetbrains",
      displayName: "PyCharm",
      processKeywordsMac: ["PyCharm"],
      processKeywordsWindows: ["pycharm64.exe"],
      processKeywordsLinux: ["pycharm"]
    },
    webstorm: {
      ideKind: "jetbrains",
      displayName: "WebStorm",
      processKeywordsMac: ["WebStorm"],
      processKeywordsWindows: ["webstorm64.exe"],
      processKeywordsLinux: ["webstorm"]
    },
    phpstorm: {
      ideKind: "jetbrains",
      displayName: "PhpStorm",
      processKeywordsMac: ["PhpStorm"],
      processKeywordsWindows: ["phpstorm64.exe"],
      processKeywordsLinux: ["phpstorm"]
    },
    rubymine: {
      ideKind: "jetbrains",
      displayName: "RubyMine",
      processKeywordsMac: ["RubyMine"],
      processKeywordsWindows: ["rubymine64.exe"],
      processKeywordsLinux: ["rubymine"]
    },
    clion: {
      ideKind: "jetbrains",
      displayName: "CLion",
      processKeywordsMac: ["CLion"],
      processKeywordsWindows: ["clion64.exe"],
      processKeywordsLinux: ["clion"]
    },
    goland: {
      ideKind: "jetbrains",
      displayName: "GoLand",
      processKeywordsMac: ["GoLand"],
      processKeywordsWindows: ["goland64.exe"],
      processKeywordsLinux: ["goland"]
    },
    rider: {
      ideKind: "jetbrains",
      displayName: "Rider",
      processKeywordsMac: ["Rider"],
      processKeywordsWindows: ["rider64.exe"],
      processKeywordsLinux: ["rider"]
    },
    datagrip: {
      ideKind: "jetbrains",
      displayName: "DataGrip",
      processKeywordsMac: ["DataGrip"],
      processKeywordsWindows: ["datagrip64.exe"],
      processKeywordsLinux: ["datagrip"]
    },
    appcode: {
      ideKind: "jetbrains",
      displayName: "AppCode",
      processKeywordsMac: ["AppCode"],
      processKeywordsWindows: ["appcode.exe"],
      processKeywordsLinux: ["appcode"]
    },
    dataspell: {
      ideKind: "jetbrains",
      displayName: "DataSpell",
      processKeywordsMac: ["DataSpell"],
      processKeywordsWindows: ["dataspell64.exe"],
      processKeywordsLinux: ["dataspell"]
    },
    aqua: {
      ideKind: "jetbrains",
      displayName: "Aqua",
      processKeywordsMac: [],
      processKeywordsWindows: ["aqua64.exe"],
      processKeywordsLinux: []
    },
    gateway: {
      ideKind: "jetbrains",
      displayName: "Gateway",
      processKeywordsMac: [],
      processKeywordsWindows: ["gateway64.exe"],
      processKeywordsLinux: []
    },
    fleet: {
      ideKind: "jetbrains",
      displayName: "Fleet",
      processKeywordsMac: [],
      processKeywordsWindows: ["fleet.exe"],
      processKeywordsLinux: []
    },
    androidstudio: {
      ideKind: "jetbrains",
      displayName: "Android Studio",
      processKeywordsMac: ["Android Studio"],
      processKeywordsWindows: ["studio64.exe"],
      processKeywordsLinux: ["android-studio"]
    }
  };
  JhA = W0(() => {
    return kF1(l0.terminal)
  }), XhA = W0(() => {
    return Rx(wq.terminal)
  }), zK = W0(() => {
    return JhA() || XhA() || Boolean(process.env.FORCE_CODE_TERMINAL)
  });
  W27 = Y27(import.meta.url), cVY = vF1(W27, "../");
  jr2 = {
    code: "VS Code",
    cursor: "Cursor",
    windsurf: "Windsurf",
    antigravity: "Antigravity",
    vi: "Vim",
    vim: "Vim",
    nano: "nano",
    notepad: "Notepad",
    "start /wait notepad": "Notepad",
    emacs: "Emacs",
    subl: "Sublime Text",
    atom: "Atom"
  };
  gr2 = W0(async (A, Q) => {
    if (process.env.CLAUDE_CODE_IDE_HOST_OVERRIDE) return process.env.CLAUDE_CODE_IDE_HOST_OVERRIDE;
    if ($Q() !== "wsl" || !A) return "127.0.0.1";
    try {
      let B = await e5("ip route show | grep -i default", {
        shell: !0,
        reject: !1
      });
      if (B.exitCode === 0 && B.stdout) {
        let G = B.stdout.match(/default via (\d+\.\d+\.\d+\.\d+)/);
        if (G) {
          let Z = G[1];
          if (await NL0(Z, Q)) return Z
        }
      }
    } catch (B) {}
    return "127.0.0.1"
  })
})
// @from(Ln 386722, Col 0)
async function mr2(A, Q, B) {
  if (B !== "repl_main_thread") return [];
  return []
}
// @from(Ln 386726, Col 4)
$27 = 1e4
// @from(Ln 386727, Col 2)
C27 = 300
// @from(Ln 386728, Col 2)
RL0
// @from(Ln 386729, Col 4)
dr2 = w(() => {
  fQ();
  C0();
  qN();
  DQ();
  v1();
  BI();
  RL0 = ur2(zQ(), "session-memory")
})
// @from(Ln 386738, Col 0)
class cr2 {
  chatId = "";
  targetUid = "";
  handle = "";
  constructor(A, Q, B) {}
  markRead() {}
  get unread() {
    return 0
  }
  get isListening() {
    return !1
  }
  unsubscribe() {}
}
// @from(Ln 386753, Col 0)
function pr2(A, Q, B) {
  return new cr2("", "", "")
}
// @from(Ln 386757, Col 0)
function gF1() {
  return []
}
// @from(Ln 386761, Col 0)
function lr2(A) {
  return () => {}
}
// @from(Ln 386772, Col 0)
async function O27(A, Q, B, G, Z, Y) {
  if (a1(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS)) return [];
  let J = c9();
  setTimeout(() => {
    J.abort()
  }, 1000);
  let X = {
      ...Q,
      abortController: J
    },
    I = !Q.agentId,
    D = A ? [fJ("at_mentioned_files", () => h27(A, X)), fJ("mcp_resources", () => u27(A, X)), fJ("agent_mentions", () => Promise.resolve(g27(A, Q.options.agentDefinitions.activeAgents)))] : [],
    W = await Promise.all(D),
    K = [fJ("changed_files", () => m27(X)), fJ("nested_memory", () => d27(X)), fJ("ultra_claude_md", async () => v27(Z)), fJ("plan_mode", () => j27(Z, Q)), fJ("plan_mode_exit", () => T27(Q)), fJ("delegate_mode", () => P27(Q)), fJ("delegate_mode_exit", () => Promise.resolve(S27())), fJ("todo_reminders", () => t27(Z, Q)), ...[], fJ("collab_notification", async () => B97()), fJ("critical_system_reminder", () => Promise.resolve(x27(Q)))],
    V = I ? [fJ("ide_selection", async () => k27(B, Q)), fJ("ide_opened_file", async () => f27(B, Q)), fJ("output_style", async () => Promise.resolve(y27())), fJ("queued_commands", async () => M27(G)), fJ("diagnostics", async () => o27()), fJ("lsp_diagnostics", async () => r27()), fJ("unified_tasks", async () => A97(Q, Z)), fJ("async_hook_responses", async () => Q97()), fJ("memory", async () => mr2(Q, Z, Y)), fJ("token_usage", async () => Promise.resolve(G97(Z ?? []))), fJ("budget_usd", async () => Promise.resolve(Z97(Q.options.maxBudgetUsd))), fJ("verify_plan_reminder", async () => J97(Z, Q))] : [],
    [F, H] = await Promise.all([Promise.all(K), Promise.all(V)]);
  return [...W.flat(), ...F.flat(), ...H.flat()]
}
// @from(Ln 386790, Col 0)
async function fJ(A, Q) {
  let B = Date.now();
  try {
    let G = await Q(),
      Z = Date.now() - B,
      Y = G.reduce((J, X) => {
        return J + eA(X).length
      }, 0);
    if (Math.random() < 0.05) l("tengu_attachment_compute_duration", {
      label: A,
      duration_ms: Z,
      attachment_size_bytes: Y,
      attachment_count: G.length
    });
    return G
  } catch (G) {
    let Z = Date.now() - B;
    if (Math.random() < 0.05) l("tengu_attachment_compute_duration", {
      label: A,
      duration_ms: Z,
      error: !0
    });
    return e(G), xM(`Attachment error in ${A}`, G), []
  }
}
// @from(Ln 386816, Col 0)
function M27(A) {
  if (!A) return [];
  return A.filter((Q) => Q.mode === "prompt").map((Q) => ({
    type: "queued_command",
    prompt: Q.value,
    source_uuid: Q.uuid,
    imagePasteIds: Q.imagePasteIds
  }))
}
// @from(Ln 386826, Col 0)
function R27(A) {
  let Q = 0,
    B = !1;
  for (let G = A.length - 1; G >= 0; G--) {
    let Z = A[G];
    if (Z?.type === "assistant") {
      if (dF1(Z)) continue;
      Q++
    } else if (Z?.type === "attachment" && (Z.attachment.type === "plan_mode" || Z.attachment.type === "plan_mode_reentry")) {
      B = !0;
      break
    }
  }
  return {
    turnCount: Q,
    foundPlanModeAttachment: B
  }
}
// @from(Ln 386845, Col 0)
function _27(A) {
  let Q = 0;
  for (let B = A.length - 1; B >= 0; B--) {
    let G = A[B];
    if (G?.type === "attachment") {
      if (G.attachment.type === "plan_mode_exit") break;
      if (G.attachment.type === "plan_mode") Q++
    }
  }
  return Q
}
// @from(Ln 386856, Col 0)
async function j27(A, Q) {
  if ((await Q.getAppState()).toolPermissionContext.mode !== "plan") return [];
  if (A && A.length > 0) {
    let {
      turnCount: D,
      foundPlanModeAttachment: W
    } = R27(A);
    if (W && D < ar2.TURNS_BETWEEN_ATTACHMENTS) return []
  }
  let Z = dC(Q.agentId),
    Y = AK(Q.agentId),
    J = [];
  if (Xf0() && Y !== null) J.push({
    type: "plan_mode_reentry",
    planFilePath: Z
  }), Iq(!1);
  let I = (_27(A ?? []) + 1) % ar2.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1 ? "full" : "sparse";
  return J.push({
    type: "plan_mode",
    reminderType: I,
    isSubAgent: !!Q.agentId,
    planFilePath: Z,
    planExists: Y !== null
  }), J
}
// @from(Ln 386881, Col 0)
async function T27(A) {
  if (!If0()) return [];
  if ((await A.getAppState()).toolPermissionContext.mode === "plan") return lw(!1), [];
  lw(!1);
  let B = dC(A.agentId),
    G = AK(A.agentId) !== null;
  return [{
    type: "plan_mode_exit",
    planFilePath: B,
    planExists: G
  }]
}
// @from(Ln 386893, Col 0)
async function P27(A) {
  let Q = await A.getAppState();
  if (Q.toolPermissionContext.mode !== "delegate") return [];
  if (!Q.teamContext) return [];
  let Z = `${process.env.HOME||process.env.USERPROFILE||"."}/.claude/tasks/${Q.teamContext.teamName}/`;
  return [{
    type: "delegate_mode",
    teamName: Q.teamContext.teamName,
    taskListPath: Z
  }]
}
// @from(Ln 386905, Col 0)
function S27() {
  if (!Wf0()) return [];
  return jdA(!1), [{
    type: "delegate_mode_exit"
  }]
}
// @from(Ln 386912, Col 0)
function x27(A) {
  let Q = A.criticalSystemReminder_EXPERIMENTAL;
  if (!Q) return [];
  return [{
    type: "critical_system_reminder",
    content: Q
  }]
}
// @from(Ln 386921, Col 0)
function y27() {
  let Q = jQ()?.outputStyle || "default";
  if (Q === "default") return [];
  return [{
    type: "output_style",
    style: Q
  }]
}
// @from(Ln 386930, Col 0)
function v27(A) {
  return []
}
// @from(Ln 386933, Col 0)
async function k27(A, Q) {
  let B = hF1(Q.options.mcpClients);
  if (!B || A?.lineStart === void 0 || !A.text || !A.filePath) return [];
  let G = await Q.getAppState();
  if (nEA(A.filePath, G.toolPermissionContext)) return [];
  return [{
    type: "selected_lines_in_ide",
    ideName: B,
    lineStart: A.lineStart,
    lineEnd: A.lineStart + A.lineCount - 1,
    filename: A.filePath,
    content: A.text
  }]
}
// @from(Ln 386948, Col 0)
function b27(A, Q) {
  let B = _L0(U27(A)),
    G = [],
    Z = B;
  while (Z !== Q && Z !== ir2(Z).root) {
    if (Z.startsWith(Q)) G.push(Z);
    Z = _L0(Z)
  }
  G.reverse();
  let Y = [];
  Z = Q;
  while (Z !== ir2(Z).root) Y.push(Z), Z = _L0(Z);
  return Y.reverse(), {
    nestedDirs: G,
    cwdLevelDirs: Y
  }
}
// @from(Ln 386966, Col 0)
function jL0(A, Q) {
  let B = [];
  for (let G of A)
    if (!Q.readFileState.has(G.path)) B.push({
      type: "nested_memory",
      path: G.path,
      content: G
    }), Q.readFileState.set(G.path, {
      content: G.content,
      timestamp: Date.now(),
      offset: void 0,
      limit: void 0
    });
  return B
}
// @from(Ln 386982, Col 0)
function or2(A, Q, B) {
  let G = [];
  try {
    if (!WS(A, B.toolPermissionContext)) return G;
    let Z = new Set,
      Y = EQ(),
      J = G52(A, Z);
    G.push(...jL0(J, Q));
    let {
      nestedDirs: X,
      cwdLevelDirs: I
    } = b27(A, Y);
    for (let D of X) {
      let W = Z52(D, A, Z);
      G.push(...jL0(W, Q))
    }
    for (let D of I) {
      let W = Y52(D, A, Z);
      G.push(...jL0(W, Q))
    }
  } catch (Z) {
    e(Z)
  }
  return G
}
// @from(Ln 387007, Col 0)
async function f27(A, Q) {
  if (!A?.filePath || A.text) return [];
  let B = await Q.getAppState();
  if (nEA(A.filePath, B.toolPermissionContext)) return [];
  return [...or2(A.filePath, Q, B), {
    type: "opened_file_in_ide",
    filename: A.filePath
  }]
}
// @from(Ln 387016, Col 0)
async function h27(A, Q) {
  let B = c27(A);
  if (B.length > 0) T9("at-mentions");
  let G = await Q.getAppState();
  return (await Promise.all(B.map(async (Y) => {
    try {
      let {
        filename: J,
        lineStart: X,
        lineEnd: I
      } = i27(Y), D = Y4(J);
      if (nEA(D, G.toolPermissionContext)) return null;
      try {
        if (vA().statSync(D).isDirectory()) try {
          let K = await o2.call({
            command: `ls ${m6([D])}`,
            description: `Lists files in ${D}`
          }, Q);
          l("tengu_at_mention_extracting_directory_success", {});
          let V = K.data.stdout;
          return {
            type: "directory",
            path: D,
            content: V
          }
        } catch {
          return null
        }
      } catch {}
      return await TL0(D, Q, "tengu_at_mention_extracting_filename_success", "tengu_at_mention_extracting_filename_error", "at-mention", {
        offset: X,
        limit: I && X ? I - X + 1 : void 0
      })
    } catch {
      l("tengu_at_mention_extracting_filename_error", {})
    }
  }))).filter(Boolean)
}
// @from(Ln 387055, Col 0)
function g27(A, Q) {
  let B = l27(A);
  if (B.length === 0) return [];
  return B.map((Z) => {
    let Y = Z.replace("agent-", ""),
      J = Q.find((X) => X.agentType === Y);
    if (!J) return l("tengu_at_mention_agent_not_found", {}), null;
    return l("tengu_at_mention_agent_success", {}), {
      type: "agent_mention",
      agentType: J.agentType
    }
  }).filter((Z) => Z !== null)
}
// @from(Ln 387068, Col 0)
async function u27(A, Q) {
  let B = p27(A);
  if (B.length === 0) return [];
  let G = Q.options.mcpClients || [];
  return (await Promise.all(B.map(async (Y) => {
    try {
      let [J, ...X] = Y.split(":"), I = X.join(":");
      if (!J || !I) return l("tengu_at_mention_mcp_resource_error", {}), null;
      let D = G.find((V) => V.name === J);
      if (!D || D.type !== "connected") return l("tengu_at_mention_mcp_resource_error", {}), null;
      let K = (Q.options.mcpResources?.[J] || []).find((V) => V.uri === I);
      if (!K) return l("tengu_at_mention_mcp_resource_error", {}), null;
      try {
        let V = await D.client.readResource({
          uri: I
        });
        return l("tengu_at_mention_mcp_resource_success", {}), {
          type: "mcp_resource",
          server: J,
          uri: I,
          name: K.name || I,
          description: K.description,
          content: V
        }
      } catch (V) {
        return l("tengu_at_mention_mcp_resource_error", {}), e(V), null
      }
    } catch {
      return l("tengu_at_mention_mcp_resource_error", {}), null
    }
  }))).filter((Y) => Y !== null)
}
// @from(Ln 387100, Col 0)
async function m27(A) {
  let Q = await A.getAppState();
  return (await Promise.all(FS(A.readFileState).map(async (G) => {
    let Z = A.readFileState.get(G);
    if (!Z) return null;
    if (Z.offset !== void 0 || Z.limit !== void 0) return null;
    let Y = Y4(G);
    if (nEA(Y, Q.toolPermissionContext)) return null;
    try {
      if (mz(Y) <= Z.timestamp) return null;
      let J = {
        file_path: Y
      };
      if (!(await v5.validateInput(J, A)).result) return null;
      let I = await v5.call(J, A),
        D = A.agentId ?? q0();
      if (Y === Ir(D)) {
        if (!A.options.tools.some((K) => K.name === Bm)) return null;
        let W = Cb(D);
        return {
          type: "todo",
          content: W,
          itemCount: W.length,
          context: "file-watch"
        }
      }
      if (I.data.type === "text") {
        if (A$0(Z.content, I.data.file.content) === "") return null;
        return {
          type: "edited_text_file",
          filename: Y,
          snippet: A$0(Z.content, I.data.file.content)
        }
      }
      if (I.data.type === "image") try {
        let W = await KY0(Y);
        return {
          type: "edited_image_file",
          filename: Y,
          content: W
        }
      } catch (W) {
        return e(W), l("tengu_watched_file_compression_failed", {
          file: Y
        }), null
      }
    } catch {
      return l("tengu_watched_file_stat_error", {}), null
    }
  }))).filter((G) => G !== null)
}
// @from(Ln 387151, Col 0)
async function d27(A) {
  let Q = await A.getAppState(),
    B = [];
  if (A.nestedMemoryAttachmentTriggers && A.nestedMemoryAttachmentTriggers.size > 0) {
    for (let G of A.nestedMemoryAttachmentTriggers) {
      let Z = or2(G, A, Q);
      B.push(...Z)
    }
    A.nestedMemoryAttachmentTriggers.clear()
  }
  return B
}
// @from(Ln 387164, Col 0)
function c27(A) {
  let Q = /(^|\s)@"([^"]+)"/g,
    B = /(^|\s)@([^\s]+)\b/g,
    G = [],
    Z = [],
    Y;
  while ((Y = Q.exec(A)) !== null)
    if (Y[2]) G.push(Y[2]);
  return (A.match(B) || []).forEach((X) => {
    let I = X.slice(X.indexOf("@") + 1);
    if (!I.startsWith('"')) Z.push(I)
  }), [...new Set([...G, ...Z])]
}
// @from(Ln 387178, Col 0)
function p27(A) {
  let Q = /(^|\s)@([^\s]+:[^\s]+)\b/g,
    B = A.match(Q) || [];
  return [...new Set(B.map((G) => G.slice(G.indexOf("@") + 1)))]
}
// @from(Ln 387184, Col 0)
function l27(A) {
  let Q = /(^|\s)@(agent-[\w:.@-]+)/g,
    B = A.match(Q) || [];
  return [...new Set(B.map((G) => G.slice(G.indexOf("@") + 1)))]
}
// @from(Ln 387190, Col 0)
function i27(A) {
  let Q = A.match(/^([^#]+)(?:#L(\d+)(?:-(\d+))?)?$/);
  if (!Q) return {
    filename: A
  };
  let [, B, G, Z] = Q, Y = G ? parseInt(G, 10) : void 0, J = Z ? parseInt(Z, 10) : Y;
  return {
    filename: B ?? A,
    lineStart: Y,
    lineEnd: J
  }
}
// @from(Ln 387203, Col 0)
function n27(A) {
  let Q = 0,
    B = !1;
  for (let G = A.length - 1; G >= 0; G--) {
    let Z = A[G];
    if (Z?.type === "attachment" && Z.attachment.type === "ultramemory") {
      B = !0;
      break
    }
    if (Z?.type === "assistant") Q += PZ0(Z)
  }
  return B ? Q : null
}
// @from(Ln 387217, Col 0)
function a27(A) {
  if (!A || A.length === 0) return !0;
  let Q = n27(A);
  if (Q === null) return !0;
  return Q >= N27.TOKEN_COOLDOWN
}
// @from(Ln 387223, Col 0)
async function o27() {
  let A = await Ec.getNewDiagnostics();
  if (A.length === 0) return [];
  return [{
    type: "diagnostics",
    files: A,
    isNew: !0
  }]
}
// @from(Ln 387232, Col 0)
async function r27() {
  k("LSP Diagnostics: getLSPDiagnosticAttachments called");
  try {
    let A = My2();
    if (A.length === 0) return [];
    k(`LSP Diagnostics: Found ${A.length} pending diagnostic set(s)`);
    let Q = A.map(({
      files: B
    }) => ({
      type: "diagnostics",
      files: B,
      isNew: !0
    }));
    if (A.length > 0) Ry2(), k(`LSP Diagnostics: Cleared ${A.length} delivered diagnostic(s) from registry`);
    return k(`LSP Diagnostics: Returning ${Q.length} diagnostic attachment(s)`), Q
  } catch (A) {
    let Q = A instanceof Error ? A : Error(String(A));
    return e(Error(`Failed to get LSP diagnostic attachments: ${Q.message}`)), []
  }
}
// @from(Ln 387252, Col 0)
async function* VHA(A, Q, B, G, Z, Y) {
  let J = await O27(A, Q, B, G, Z, Y);
  if (J.length === 0) return;
  l("tengu_attachments", {
    attachment_types: J.map((X) => X.type)
  });
  for (let X of J) yield X4(X)
}