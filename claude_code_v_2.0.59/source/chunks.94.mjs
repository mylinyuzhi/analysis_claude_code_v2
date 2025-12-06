
// @from(Start 8857932, End 8863284)
nY = L(() => {
  c5();
  hQ();
  sv1();
  _8();
  jQ();
  q0();
  WH1();
  l2();
  _0();
  AQ();
  g1();
  Q3();
  Ok();
  Fe1();
  Ke1();
  De1();
  V0();
  OZ();
  It();
  eQ2 = BA(KU(), 1);
  wIA = {
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
  KLA = s1(() => {
    return PQ1(d0.terminal)
  }), DLA = s1(() => {
    return oT(WU.terminal)
  }), bV = s1(() => {
    return KLA() || DLA() || Boolean(process.env.FORCE_CODE_TERMINAL)
  });
  c25 = h25(import.meta.url), FOG = TQ1(c25, "../");
  ZB2 = s1(() => {
    try {
      return tG("cursor --version"), !0
    } catch {
      return !1
    }
  }), IB2 = s1(() => {
    try {
      return tG("windsurf --version"), !0
    } catch {
      return !1
    }
  }), YB2 = s1(() => {
    try {
      let A = tG("code --help");
      return Boolean(A && A.includes("Visual Studio Code"))
    } catch {
      return !1
    }
  });
  tQ2 = {
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
  XB2 = s1(async (A, Q) => {
    if (process.env.CLAUDE_CODE_IDE_HOST_OVERRIDE) return process.env.CLAUDE_CODE_IDE_HOST_OVERRIDE;
    if (dQ() !== "wsl" || !A) return "127.0.0.1";
    try {
      let G = b25("ip route show | grep -i default", {
        encoding: "utf8"
      }).match(/default via (\d+\.\d+\.\d+\.\d+)/);
      if (G) {
        let Z = G[1];
        if (await Ce1(Z, Q)) return Z
      }
    } catch (B) {}
    return "127.0.0.1"
  })
})
// @from(Start 8863287, End 8864224)
function s25() {
  let A = aE0();
  if (A !== void 0) return A;
  let Q = process.env.CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR;
  if (!Q) return W2A(null), null;
  let B = parseInt(Q, 10);
  if (Number.isNaN(B)) return g(`CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR must be a valid file descriptor number, got: ${Q}`, {
    level: "error"
  }), W2A(null), null;
  try {
    let G = RA(),
      Z = process.platform === "darwin" || process.platform === "freebsd" ? `/dev/fd/${B}` : `/proc/self/fd/${B}`,
      I = G.readFileSync(Z, {
        encoding: "utf8"
      }).trim();
    if (!I) return g("File descriptor contained empty token", {
      level: "error"
    }), W2A(null), null;
    return g(`Successfully read token from file descriptor ${B}`), W2A(I), I
  } catch (G) {
    return g(`Failed to read token from file descriptor ${B}: ${G instanceof Error?G.message:String(G)}`, {
      level: "error"
    }), W2A(null), null
  }
}
// @from(Start 8864226, End 8864334)
function cAA() {
  let A = process.env.CLAUDE_CODE_SESSION_ACCESS_TOKEN;
  if (A) return A;
  return s25()
}
// @from(Start 8864339, End 8864380)
yQ1 = L(() => {
  V0();
  AQ();
  _0()
})
// @from(Start 8864383, End 8864844)
function r25(A) {
  let Q = A,
    B = "",
    G = 0,
    Z = 10;
  while (Q !== B && G < Z) B = Q, Q = Q.normalize("NFKC"), Q = Q.replace(/[\p{Cf}\p{Co}\p{Cn}]/gu, ""), Q = Q.replace(/[\u200B-\u200F]/g, "").replace(/[\u202A-\u202E]/g, "").replace(/[\u2066-\u2069]/g, "").replace(/[\uFEFF]/g, "").replace(/[\uE000-\uF8FF]/g, ""), G++;
  if (G >= Z) throw Error(`Unicode sanitization reached maximum iterations (${Z}) for input: ${A.slice(0,100)}`);
  return Q
}
// @from(Start 8864846, End 8865103)
function qIA(A) {
  if (typeof A === "string") return r25(A);
  if (Array.isArray(A)) return A.map(qIA);
  if (A !== null && typeof A === "object") {
    let Q = {};
    for (let [B, G] of Object.entries(A)) Q[qIA(B)] = qIA(G);
    return Q
  }
  return A
}
// @from(Start 8865105, End 8865191)
function xQ1() {
  return parseInt(process.env.MAX_MCP_OUTPUT_TOKENS ?? "25000", 10)
}
// @from(Start 8865193, End 8865239)
function FB2(A) {
  return A.type === "text"
}
// @from(Start 8865241, End 8865288)
function KB2(A) {
  return A.type === "image"
}
// @from(Start 8865290, End 8865499)
function Ue1(A) {
  if (!A) return 0;
  if (typeof A === "string") return gG(A);
  return A.reduce((Q, B) => {
    if (FB2(B)) return Q + gG(B.text);
    else if (KB2(B)) return Q + VB2;
    return Q
  }, 0)
}
// @from(Start 8865501, End 8865538)
function t25() {
  return xQ1() * 4
}
// @from(Start 8865540, End 8865887)
function e25() {
  return `

[OUTPUT TRUNCATED - exceeded ${xQ1()} token limit]

The tool output was truncated. If this MCP server provides pagination or filtering tools, use them to retrieve specific portions of the data. If pagination is not available, inform the user that you are working with truncated output and results may be incomplete.`
}
// @from(Start 8865889, End 8865965)
function A95(A, Q) {
  if (A.length <= Q) return A;
  return A.slice(0, Q)
}
// @from(Start 8865966, End 8866675)
async function Q95(A, Q) {
  let B = [],
    G = 0;
  for (let Z of A)
    if (FB2(Z)) {
      let I = Q - G;
      if (I <= 0) break;
      if (Z.text.length <= I) B.push(Z), G += Z.text.length;
      else {
        B.push({
          type: "text",
          text: Z.text.slice(0, I)
        });
        break
      }
    } else if (KB2(Z)) {
    let I = VB2 * 4;
    if (G + I <= Q) B.push(Z), G += I;
    else {
      let Y = Q - G;
      if (Y > 0) {
        let J = Math.floor(Y * 0.75);
        try {
          let W = await KMB(Z, J);
          if (B.push(W), W.source.type === "base64") G += W.source.data.length;
          else G += I
        } catch {}
      }
    }
  } else B.push(Z);
  return B
}
// @from(Start 8866676, End 8867029)
async function $e1(A) {
  if (!A) return !1;
  if (Ue1(A) <= xQ1() * o25) return !1;
  try {
    let G = await bNA(typeof A === "string" ? [{
      role: "user",
      content: A
    }] : [{
      role: "user",
      content: A
    }], []);
    return !!(G && G > xQ1())
  } catch (B) {
    return AA(B instanceof Error ? B : Error(String(B))), !1
  }
}
// @from(Start 8867030, End 8867264)
async function B95(A) {
  if (!A) return A;
  let Q = t25(),
    B = e25();
  if (typeof A === "string") return A95(A, Q) + B;
  else {
    let G = await Q95(A, Q);
    return G.push({
      type: "text",
      text: B
    }), G
  }
}
// @from(Start 8867265, End 8867343)
async function DB2(A) {
  if (!await $e1(A)) return A;
  return await B95(A)
}
// @from(Start 8867348, End 8867357)
o25 = 0.5
// @from(Start 8867361, End 8867371)
VB2 = 1600
// @from(Start 8867377, End 8867418)
vQ1 = L(() => {
  xM();
  g1();
  ot()
})
// @from(Start 8867462, End 8867745)
function k6(A, Q, B = {}) {
  let G = G95();
  if (!G) return;
  let Z = {
      timestamp: new Date().toISOString(),
      level: A,
      event: Q,
      data: B
    },
    I = RA();
  if (!I.existsSync(HB2(G))) I.mkdirSync(HB2(G));
  I.appendFileSync(G, JSON.stringify(Z) + `
`)
}
// @from(Start 8867747, End 8867815)
function G95() {
  return process.env.CLAUDE_CODE_DIAGNOSTICS_FILE
}
// @from(Start 8867820, End 8867845)
NIA = L(() => {
  AQ()
})
// @from(Start 8867847, End 8869728)
class bQ1 {
  ws;
  started = !1;
  opened;
  constructor(A) {
    this.ws = A;
    this.opened = new Promise((Q, B) => {
      if (this.ws.readyState === __.OPEN) Q();
      else this.ws.on("open", () => {
        Q()
      }), this.ws.on("error", (G) => {
        k6("error", "mcp_websocket_connect_fail"), B(G)
      })
    }), this.ws.on("message", this.onMessageHandler), this.ws.on("error", this.onErrorHandler), this.ws.on("close", this.onCloseHandler)
  }
  onclose;
  onerror;
  onmessage;
  onMessageHandler = (A) => {
    try {
      let Q = JSON.parse(A.toString("utf-8")),
        B = Mk.parse(Q);
      this.onmessage?.(B)
    } catch (Q) {
      this.onErrorHandler(Q)
    }
  };
  onErrorHandler = (A) => {
    k6("error", "mcp_websocket_message_fail"), this.onerror?.(A instanceof Error ? A : Error("Failed to process message"))
  };
  onCloseHandler = () => {
    this.onclose?.(), this.ws.off("message", this.onMessageHandler), this.ws.off("error", this.onErrorHandler), this.ws.off("close", this.onCloseHandler)
  };
  async start() {
    if (this.started) throw Error("Start can only be called once per transport.");
    if (await this.opened, this.ws.readyState !== __.OPEN) throw k6("error", "mcp_websocket_start_not_opened"), Error("WebSocket is not open. Cannot start transport.");
    this.started = !0
  }
  async close() {
    if (this.ws.readyState === __.OPEN || this.ws.readyState === __.CONNECTING) this.ws.close();
    this.onCloseHandler()
  }
  async send(A) {
    if (this.ws.readyState !== __.OPEN) throw k6("error", "mcp_websocket_send_not_opened"), Error("WebSocket is not open. Cannot send message.");
    let Q = JSON.stringify(A);
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
// @from(Start 8869733, End 8869776)
CB2 = L(() => {
  dUA();
  SD();
  NIA()
})
// @from(Start 8869782, End 8869790)
EB2 = ""
// @from(Start 8869794, End 8869802)
zB2 = ""
// @from(Start 8869805, End 8869956)
function UB2(A) {
  if (Object.keys(A).length === 0) return null;
  return Object.entries(A).map(([Q, B]) => `${Q}: ${JSON.stringify(B)}`).join(", ")
}
// @from(Start 8869958, End 8870012)
function $B2() {
  return HG.createElement(k5, null)
}
// @from(Start 8870014, End 8870118)
function wB2(A, {
  verbose: Q
}) {
  return HG.createElement(Q6, {
    result: A,
    verbose: Q
  })
}
// @from(Start 8870120, End 8870152)
function qB2() {
  return null
}
// @from(Start 8870154, End 8871460)
function NB2(A, Q, {
  verbose: B
}) {
  let G = A,
    Z = Ue1(G),
    Y = Z > Z95 ? `${H1.warning} Large MCP response (~${JZ(Z)} tokens), this can fill up context quickly` : null,
    J;
  if (Array.isArray(G)) {
    let W = G.map((X, V) => {
      if (X.type === "image") return HG.createElement(S, {
        key: V,
        justifyContent: "space-between",
        overflowX: "hidden",
        width: "100%"
      }, HG.createElement(S0, {
        height: 1
      }, HG.createElement($, null, "[Image]")));
      let F = X.type === "text" && "text" in X && X.text !== null && X.text !== void 0 ? String(X.text) : "";
      return HG.createElement(_U, {
        key: V,
        content: F,
        verbose: B
      })
    });
    J = HG.createElement(S, {
      flexDirection: "column",
      width: "100%"
    }, W)
  } else if (!G) J = HG.createElement(S, {
    justifyContent: "space-between",
    overflowX: "hidden",
    width: "100%"
  }, HG.createElement(S0, {
    height: 1
  }, HG.createElement($, {
    dimColor: !0
  }, "(No content)")));
  else J = HG.createElement(_U, {
    content: G,
    verbose: B
  });
  if (Y) return HG.createElement(S, {
    flexDirection: "column"
  }, HG.createElement(S0, {
    height: 1
  }, HG.createElement($, {
    color: "warning"
  }, Y)), J);
  return J
}
// @from(Start 8871465, End 8871467)
HG
// @from(Start 8871469, End 8871478)
Z95 = 1e4
// @from(Start 8871484, End 8871579)
LB2 = L(() => {
  hA();
  iX();
  yJ();
  QIA();
  q8();
  V9();
  vQ1();
  HG = BA(VA(), 1)
})
// @from(Start 8871585, End 8871588)
I95
// @from(Start 8871590, End 8871593)
Y95
// @from(Start 8871595, End 8871598)
MB2
// @from(Start 8871604, End 8872704)
OB2 = L(() => {
  Q2();
  LB2();
  I95 = j.object({}).passthrough(), Y95 = j.string().describe("MCP tool execution result"), MB2 = {
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
    async description() {
      return zB2
    },
    async prompt() {
      return EB2
    },
    inputSchema: I95,
    outputSchema: Y95,
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
    renderToolUseMessage: UB2,
    userFacingName: () => "mcp",
    renderToolUseRejectedMessage: $B2,
    renderToolUseErrorMessage: wB2,
    renderToolUseProgressMessage: qB2,
    renderToolResultMessage: NB2,
    mapToolResultToToolResultBlockParam(A, Q) {
      return {
        tool_use_id: Q,
        type: "tool_result",
        content: A
      }
    }
  }
})
// @from(Start 8872710, End 8873019)
RB2 = `
Lists available resources from configured MCP servers.
Each resource object includes a 'server' field indicating which server it's from.

Usage examples:
- List all resources from all servers: \`listMcpResources\`
- List resources from a specific server: \`listMcpResources({ server: "myserver" })\`
`
// @from(Start 8873023, End 8873382)
TB2 = `
List available resources from configured MCP servers.
Each returned resource will include all standard MCP resource fields plus a 'server' field 
indicating which server the resource belongs to.

Parameters:
- server (optional): The name of a specific MCP server to get resources from. If not provided,
  resources from all servers will be returned.
`
// @from(Start 8873385, End 8873498)
function PB2(A) {
  return A.server ? `List MCP resources from server "${A.server}"` : "List all MCP resources"
}
// @from(Start 8873500, End 8873554)
function jB2() {
  return OE.createElement(k5, null)
}
// @from(Start 8873556, End 8873660)
function SB2(A, {
  verbose: Q
}) {
  return OE.createElement(Q6, {
    result: A,
    verbose: Q
  })
}
// @from(Start 8873662, End 8873694)
function _B2() {
  return null
}
// @from(Start 8873696, End 8874143)
function kB2(A, Q, {
  verbose: B
}) {
  if (!A || A.length === 0) return OE.createElement(S, {
    justifyContent: "space-between",
    overflowX: "hidden",
    width: "100%"
  }, OE.createElement(S, {
    flexDirection: "row"
  }, OE.createElement($, null, "  ⎿  "), OE.createElement($, {
    dimColor: !0
  }, "(No resources found)")));
  let G = JSON.stringify(A, null, 2);
  return OE.createElement(_U, {
    content: G,
    verbose: B
  })
}
// @from(Start 8874148, End 8874150)
OE
// @from(Start 8874156, End 8874226)
yB2 = L(() => {
  hA();
  iX();
  yJ();
  QIA();
  OE = BA(VA(), 1)
})
// @from(Start 8874232, End 8874235)
J95
// @from(Start 8874237, End 8874240)
W95
// @from(Start 8874242, End 8874244)
Wh
// @from(Start 8874250, End 8876493)
fQ1 = L(() => {
  Q2();
  SD();
  g1();
  yB2();
  J95 = j.object({
    server: j.string().optional().describe("Optional server name to filter resources by")
  }), W95 = j.array(j.object({
    uri: j.string().describe("Resource URI"),
    name: j.string().describe("Resource name"),
    mimeType: j.string().optional().describe("MIME type of the resource"),
    description: j.string().optional().describe("Resource description"),
    server: j.string().describe("Server that provides this resource")
  })), Wh = {
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
    async description() {
      return RB2
    },
    async prompt() {
      return TB2
    },
    inputSchema: J95,
    outputSchema: W95,
    async call(A, {
      options: {
        mcpClients: Q
      }
    }) {
      let B = [],
        {
          server: G
        } = A,
        Z = G ? Q.filter((I) => I.name === G) : Q;
      if (G && Z.length === 0) throw Error(`Server "${G}" not found. Available servers: ${Q.map((I)=>I.name).join(", ")}`);
      for (let I of Z) {
        if (I.type !== "connected") continue;
        let Y = I;
        try {
          if (!Y.capabilities?.resources) continue;
          let J = await Y.client.request({
            method: "resources/list"
          }, gAA);
          if (!J.resources) continue;
          let W = J.resources.map((X) => ({
            ...X,
            server: I.name
          }));
          B.push(...W)
        } catch (J) {
          WI(I.name, `Failed to fetch resources: ${J instanceof Error?J.message:String(J)}`)
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
    renderToolUseMessage: PB2,
    userFacingName: () => "listMcpResources",
    renderToolUseRejectedMessage: jB2,
    renderToolUseErrorMessage: SB2,
    renderToolUseProgressMessage: _B2,
    renderToolResultMessage: kB2,
    mapToolResultToToolResultBlockParam(A, Q) {
      return {
        tool_use_id: Q,
        type: "tool_result",
        content: JSON.stringify(A)
      }
    }
  }
})
// @from(Start 8876499, End 8876761)
xB2 = `
Reads a specific resource from an MCP server.
- server: The name of the MCP server to read from
- uri: The URI of the resource to read

Usage examples:
- Read a resource from a server: \`readMcpResource({ server: "myserver", uri: "my-resource-uri" })\`
`
// @from(Start 8876765, End 8877007)
vB2 = `
Reads a specific resource from an MCP server, identified by server name and resource URI.

Parameters:
- server (required): The name of the MCP server from which to read the resource
- uri (required): The URI of the resource to read
`
// @from(Start 8877010, End 8877131)
function bB2(A) {
  if (!A.uri || !A.server) return null;
  return `Read resource "${A.uri}" from server "${A.server}"`
}
// @from(Start 8877133, End 8877178)
function fB2() {
  return "readMcpResource"
}
// @from(Start 8877180, End 8877234)
function hB2() {
  return Cq.createElement(k5, null)
}
// @from(Start 8877236, End 8877340)
function gB2(A, {
  verbose: Q
}) {
  return Cq.createElement(Q6, {
    result: A,
    verbose: Q
  })
}
// @from(Start 8877342, End 8877374)
function uB2() {
  return null
}
// @from(Start 8877376, End 8877793)
function mB2(A, Q, {
  verbose: B
}) {
  if (!A || !A.contents || A.contents.length === 0) return Cq.createElement(S, {
    justifyContent: "space-between",
    overflowX: "hidden",
    width: "100%"
  }, Cq.createElement(S0, {
    height: 1
  }, Cq.createElement($, {
    dimColor: !0
  }, "(No content)")));
  let G = JSON.stringify(A, null, 2);
  return Cq.createElement(_U, {
    content: G,
    verbose: B
  })
}
// @from(Start 8877798, End 8877800)
Cq
// @from(Start 8877806, End 8877884)
dB2 = L(() => {
  hA();
  iX();
  yJ();
  q8();
  QIA();
  Cq = BA(VA(), 1)
})
// @from(Start 8877890, End 8877893)
X95
// @from(Start 8877895, End 8877898)
V95
// @from(Start 8877900, End 8877902)
Xh
// @from(Start 8877908, End 8879789)
hQ1 = L(() => {
  Q2();
  SD();
  dB2();
  X95 = j.object({
    server: j.string().describe("The MCP server name"),
    uri: j.string().describe("The resource URI to read")
  }), V95 = j.object({
    contents: j.array(j.object({
      uri: j.string().describe("Resource URI"),
      mimeType: j.string().optional().describe("MIME type of the content"),
      text: j.string().optional().describe("Text content of the resource")
    }))
  }), Xh = {
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
    async description() {
      return xB2
    },
    async prompt() {
      return vB2
    },
    inputSchema: X95,
    outputSchema: V95,
    async call(A, {
      options: {
        mcpClients: Q
      }
    }) {
      let {
        server: B,
        uri: G
      } = A, Z = Q.find((J) => J.name === B);
      if (!Z) throw Error(`Server "${B}" not found. Available servers: ${Q.map((J)=>J.name).join(", ")}`);
      if (Z.type !== "connected") throw Error(`Server "${B}" is not connected`);
      let I = Z;
      if (!I.capabilities?.resources) throw Error(`Server "${B}" does not support resources`);
      return {
        data: await I.client.request({
          method: "resources/read",
          params: {
            uri: G
          }
        }, gl)
      }
    },
    async checkPermissions(A) {
      return {
        behavior: "allow",
        updatedInput: A
      }
    },
    renderToolUseMessage: bB2,
    userFacingName: fB2,
    renderToolUseRejectedMessage: hB2,
    renderToolUseErrorMessage: gB2,
    renderToolUseProgressMessage: uB2,
    renderToolResultMessage: mB2,
    mapToolResultToToolResultBlockParam(A, Q) {
      return {
        tool_use_id: Q,
        type: "tool_result",
        content: JSON.stringify(A)
      }
    }
  }
})
// @from(Start 8879792, End 8880053)
function F95(A) {
  let Q;
  try {
    Q = new URL(A)
  } catch (B) {
    throw Error(`Invalid URL format: ${A}`)
  }
  if (Q.protocol !== "http:" && Q.protocol !== "https:") throw Error(`Invalid URL protocol: must use http:// or https://, got ${Q.protocol}`)
}
// @from(Start 8880054, End 8880595)
async function cZ(A) {
  try {
    F95(A);
    let Q = process.env.BROWSER,
      B = process.platform;
    if (B === "win32") {
      if (Q) {
        let {
          code: Z
        } = await QQ(Q, [`"${A}"`]);
        return Z === 0
      }
      let {
        code: G
      } = await QQ("rundll32", ["url,OpenURL", A], {});
      return G === 0
    } else {
      let G = Q || (B === "darwin" ? "open" : "xdg-open"),
        {
          code: Z
        } = await QQ(G, [A]);
      return Z === 0
    }
  } catch (Q) {
    return !1
  }
}
// @from(Start 8880600, End 8880624)
gM = L(() => {
  _8()
})
// @from(Start 8880630, End 8889057)
we1 = z((E95) => {
  function cB2() {
    var A = {};
    return A["align-content"] = !1, A["align-items"] = !1, A["align-self"] = !1, A["alignment-adjust"] = !1, A["alignment-baseline"] = !1, A.all = !1, A["anchor-point"] = !1, A.animation = !1, A["animation-delay"] = !1, A["animation-direction"] = !1, A["animation-duration"] = !1, A["animation-fill-mode"] = !1, A["animation-iteration-count"] = !1, A["animation-name"] = !1, A["animation-play-state"] = !1, A["animation-timing-function"] = !1, A.azimuth = !1, A["backface-visibility"] = !1, A.background = !0, A["background-attachment"] = !0, A["background-clip"] = !0, A["background-color"] = !0, A["background-image"] = !0, A["background-origin"] = !0, A["background-position"] = !0, A["background-repeat"] = !0, A["background-size"] = !0, A["baseline-shift"] = !1, A.binding = !1, A.bleed = !1, A["bookmark-label"] = !1, A["bookmark-level"] = !1, A["bookmark-state"] = !1, A.border = !0, A["border-bottom"] = !0, A["border-bottom-color"] = !0, A["border-bottom-left-radius"] = !0, A["border-bottom-right-radius"] = !0, A["border-bottom-style"] = !0, A["border-bottom-width"] = !0, A["border-collapse"] = !0, A["border-color"] = !0, A["border-image"] = !0, A["border-image-outset"] = !0, A["border-image-repeat"] = !0, A["border-image-slice"] = !0, A["border-image-source"] = !0, A["border-image-width"] = !0, A["border-left"] = !0, A["border-left-color"] = !0, A["border-left-style"] = !0, A["border-left-width"] = !0, A["border-radius"] = !0, A["border-right"] = !0, A["border-right-color"] = !0, A["border-right-style"] = !0, A["border-right-width"] = !0, A["border-spacing"] = !0, A["border-style"] = !0, A["border-top"] = !0, A["border-top-color"] = !0, A["border-top-left-radius"] = !0, A["border-top-right-radius"] = !0, A["border-top-style"] = !0, A["border-top-width"] = !0, A["border-width"] = !0, A.bottom = !1, A["box-decoration-break"] = !0, A["box-shadow"] = !0, A["box-sizing"] = !0, A["box-snap"] = !0, A["box-suppress"] = !0, A["break-after"] = !0, A["break-before"] = !0, A["break-inside"] = !0, A["caption-side"] = !1, A.chains = !1, A.clear = !0, A.clip = !1, A["clip-path"] = !1, A["clip-rule"] = !1, A.color = !0, A["color-interpolation-filters"] = !0, A["column-count"] = !1, A["column-fill"] = !1, A["column-gap"] = !1, A["column-rule"] = !1, A["column-rule-color"] = !1, A["column-rule-style"] = !1, A["column-rule-width"] = !1, A["column-span"] = !1, A["column-width"] = !1, A.columns = !1, A.contain = !1, A.content = !1, A["counter-increment"] = !1, A["counter-reset"] = !1, A["counter-set"] = !1, A.crop = !1, A.cue = !1, A["cue-after"] = !1, A["cue-before"] = !1, A.cursor = !1, A.direction = !1, A.display = !0, A["display-inside"] = !0, A["display-list"] = !0, A["display-outside"] = !0, A["dominant-baseline"] = !1, A.elevation = !1, A["empty-cells"] = !1, A.filter = !1, A.flex = !1, A["flex-basis"] = !1, A["flex-direction"] = !1, A["flex-flow"] = !1, A["flex-grow"] = !1, A["flex-shrink"] = !1, A["flex-wrap"] = !1, A.float = !1, A["float-offset"] = !1, A["flood-color"] = !1, A["flood-opacity"] = !1, A["flow-from"] = !1, A["flow-into"] = !1, A.font = !0, A["font-family"] = !0, A["font-feature-settings"] = !0, A["font-kerning"] = !0, A["font-language-override"] = !0, A["font-size"] = !0, A["font-size-adjust"] = !0, A["font-stretch"] = !0, A["font-style"] = !0, A["font-synthesis"] = !0, A["font-variant"] = !0, A["font-variant-alternates"] = !0, A["font-variant-caps"] = !0, A["font-variant-east-asian"] = !0, A["font-variant-ligatures"] = !0, A["font-variant-numeric"] = !0, A["font-variant-position"] = !0, A["font-weight"] = !0, A.grid = !1, A["grid-area"] = !1, A["grid-auto-columns"] = !1, A["grid-auto-flow"] = !1, A["grid-auto-rows"] = !1, A["grid-column"] = !1, A["grid-column-end"] = !1, A["grid-column-start"] = !1, A["grid-row"] = !1, A["grid-row-end"] = !1, A["grid-row-start"] = !1, A["grid-template"] = !1, A["grid-template-areas"] = !1, A["grid-template-columns"] = !1, A["grid-template-rows"] = !1, A["hanging-punctuation"] = !1, A.height = !0, A.hyphens = !1, A.icon = !1, A["image-orientation"] = !1, A["image-resolution"] = !1, A["ime-mode"] = !1, A["initial-letters"] = !1, A["inline-box-align"] = !1, A["justify-content"] = !1, A["justify-items"] = !1, A["justify-self"] = !1, A.left = !1, A["letter-spacing"] = !0, A["lighting-color"] = !0, A["line-box-contain"] = !1, A["line-break"] = !1, A["line-grid"] = !1, A["line-height"] = !1, A["line-snap"] = !1, A["line-stacking"] = !1, A["line-stacking-ruby"] = !1, A["line-stacking-shift"] = !1, A["line-stacking-strategy"] = !1, A["list-style"] = !0, A["list-style-image"] = !0, A["list-style-position"] = !0, A["list-style-type"] = !0, A.margin = !0, A["margin-bottom"] = !0, A["margin-left"] = !0, A["margin-right"] = !0, A["margin-top"] = !0, A["marker-offset"] = !1, A["marker-side"] = !1, A.marks = !1, A.mask = !1, A["mask-box"] = !1, A["mask-box-outset"] = !1, A["mask-box-repeat"] = !1, A["mask-box-slice"] = !1, A["mask-box-source"] = !1, A["mask-box-width"] = !1, A["mask-clip"] = !1, A["mask-image"] = !1, A["mask-origin"] = !1, A["mask-position"] = !1, A["mask-repeat"] = !1, A["mask-size"] = !1, A["mask-source-type"] = !1, A["mask-type"] = !1, A["max-height"] = !0, A["max-lines"] = !1, A["max-width"] = !0, A["min-height"] = !0, A["min-width"] = !0, A["move-to"] = !1, A["nav-down"] = !1, A["nav-index"] = !1, A["nav-left"] = !1, A["nav-right"] = !1, A["nav-up"] = !1, A["object-fit"] = !1, A["object-position"] = !1, A.opacity = !1, A.order = !1, A.orphans = !1, A.outline = !1, A["outline-color"] = !1, A["outline-offset"] = !1, A["outline-style"] = !1, A["outline-width"] = !1, A.overflow = !1, A["overflow-wrap"] = !1, A["overflow-x"] = !1, A["overflow-y"] = !1, A.padding = !0, A["padding-bottom"] = !0, A["padding-left"] = !0, A["padding-right"] = !0, A["padding-top"] = !0, A.page = !1, A["page-break-after"] = !1, A["page-break-before"] = !1, A["page-break-inside"] = !1, A["page-policy"] = !1, A.pause = !1, A["pause-after"] = !1, A["pause-before"] = !1, A.perspective = !1, A["perspective-origin"] = !1, A.pitch = !1, A["pitch-range"] = !1, A["play-during"] = !1, A.position = !1, A["presentation-level"] = !1, A.quotes = !1, A["region-fragment"] = !1, A.resize = !1, A.rest = !1, A["rest-after"] = !1, A["rest-before"] = !1, A.richness = !1, A.right = !1, A.rotation = !1, A["rotation-point"] = !1, A["ruby-align"] = !1, A["ruby-merge"] = !1, A["ruby-position"] = !1, A["shape-image-threshold"] = !1, A["shape-outside"] = !1, A["shape-margin"] = !1, A.size = !1, A.speak = !1, A["speak-as"] = !1, A["speak-header"] = !1, A["speak-numeral"] = !1, A["speak-punctuation"] = !1, A["speech-rate"] = !1, A.stress = !1, A["string-set"] = !1, A["tab-size"] = !1, A["table-layout"] = !1, A["text-align"] = !0, A["text-align-last"] = !0, A["text-combine-upright"] = !0, A["text-decoration"] = !0, A["text-decoration-color"] = !0, A["text-decoration-line"] = !0, A["text-decoration-skip"] = !0, A["text-decoration-style"] = !0, A["text-emphasis"] = !0, A["text-emphasis-color"] = !0, A["text-emphasis-position"] = !0, A["text-emphasis-style"] = !0, A["text-height"] = !0, A["text-indent"] = !0, A["text-justify"] = !0, A["text-orientation"] = !0, A["text-overflow"] = !0, A["text-shadow"] = !0, A["text-space-collapse"] = !0, A["text-transform"] = !0, A["text-underline-position"] = !0, A["text-wrap"] = !0, A.top = !1, A.transform = !1, A["transform-origin"] = !1, A["transform-style"] = !1, A.transition = !1, A["transition-delay"] = !1, A["transition-duration"] = !1, A["transition-property"] = !1, A["transition-timing-function"] = !1, A["unicode-bidi"] = !1, A["vertical-align"] = !1, A.visibility = !1, A["voice-balance"] = !1, A["voice-duration"] = !1, A["voice-family"] = !1, A["voice-pitch"] = !1, A["voice-range"] = !1, A["voice-rate"] = !1, A["voice-stress"] = !1, A["voice-volume"] = !1, A.volume = !1, A["white-space"] = !1, A.widows = !1, A.width = !0, A["will-change"] = !1, A["word-break"] = !0, A["word-spacing"] = !0, A["word-wrap"] = !0, A["wrap-flow"] = !1, A["wrap-through"] = !1, A["writing-mode"] = !1, A["z-index"] = !1, A
  }

  function K95(A, Q, B) {}

  function D95(A, Q, B) {}
  var H95 = /javascript\s*\:/img;

  function C95(A, Q) {
    if (H95.test(Q)) return "";
    return Q
  }
  E95.whiteList = cB2();
  E95.getDefaultWhiteList = cB2;
  E95.onAttr = K95;
  E95.onIgnoreAttr = D95;
  E95.safeAttrValue = C95
})
// @from(Start 8889063, End 8889754)
qe1 = z((ERG, pB2) => {
  pB2.exports = {
    indexOf: function(A, Q) {
      var B, G;
      if (Array.prototype.indexOf) return A.indexOf(Q);
      for (B = 0, G = A.length; B < G; B++)
        if (A[B] === Q) return B;
      return -1
    },
    forEach: function(A, Q, B) {
      var G, Z;
      if (Array.prototype.forEach) return A.forEach(Q, B);
      for (G = 0, Z = A.length; G < Z; G++) Q.call(B, A[G], G, A)
    },
    trim: function(A) {
      if (String.prototype.trim) return A.trim();
      return A.replace(/(^\s*)|(\s*$)/g, "")
    },
    trimRight: function(A) {
      if (String.prototype.trimRight) return A.trimRight();
      return A.replace(/(\s*$)/g, "")
    }
  }
})
// @from(Start 8889760, End 8890742)
iB2 = z((zRG, lB2) => {
  var CLA = qe1();

  function N95(A, Q) {
    if (A = CLA.trimRight(A), A[A.length - 1] !== ";") A += ";";
    var B = A.length,
      G = !1,
      Z = 0,
      I = 0,
      Y = "";

    function J() {
      if (!G) {
        var V = CLA.trim(A.slice(Z, I)),
          F = V.indexOf(":");
        if (F !== -1) {
          var K = CLA.trim(V.slice(0, F)),
            D = CLA.trim(V.slice(F + 1));
          if (K) {
            var H = Q(Z, Y.length, K, D, V);
            if (H) Y += H + "; "
          }
        }
      }
      Z = I + 1
    }
    for (; I < B; I++) {
      var W = A[I];
      if (W === "/" && A[I + 1] === "*") {
        var X = A.indexOf("*/", I + 2);
        if (X === -1) break;
        I = X + 1, Z = I + 1, G = !1
      } else if (W === "(") G = !0;
      else if (W === ")") G = !1;
      else if (W === ";")
        if (G);
        else J();
      else if (W === `
`) J()
    }
    return CLA.trim(Y)
  }
  lB2.exports = N95
})
// @from(Start 8890748, End 8892116)
rB2 = z(($RG, sB2) => {
  var gQ1 = we1(),
    L95 = iB2(),
    URG = qe1();

  function nB2(A) {
    return A === void 0 || A === null
  }

  function M95(A) {
    var Q = {};
    for (var B in A) Q[B] = A[B];
    return Q
  }

  function aB2(A) {
    A = M95(A || {}), A.whiteList = A.whiteList || gQ1.whiteList, A.onAttr = A.onAttr || gQ1.onAttr, A.onIgnoreAttr = A.onIgnoreAttr || gQ1.onIgnoreAttr, A.safeAttrValue = A.safeAttrValue || gQ1.safeAttrValue, this.options = A
  }
  aB2.prototype.process = function(A) {
    if (A = A || "", A = A.toString(), !A) return "";
    var Q = this,
      B = Q.options,
      G = B.whiteList,
      Z = B.onAttr,
      I = B.onIgnoreAttr,
      Y = B.safeAttrValue,
      J = L95(A, function(W, X, V, F, K) {
        var D = G[V],
          H = !1;
        if (D === !0) H = D;
        else if (typeof D === "function") H = D(F);
        else if (D instanceof RegExp) H = D.test(F);
        if (H !== !0) H = !1;
        if (F = Y(V, F), !F) return;
        var C = {
          position: X,
          sourcePosition: W,
          source: K,
          isWhite: H
        };
        if (H) {
          var E = Z(V, F, C);
          if (nB2(E)) return V + ":" + F;
          else return E
        } else {
          var E = I(V, F, C);
          if (!nB2(E)) return E
        }
      });
    return J
  };
  sB2.exports = aB2
})
// @from(Start 8892122, End 8892419)
dQ1 = z((mQ1, Ne1) => {
  var oB2 = we1(),
    tB2 = rB2();

  function O95(A, Q) {
    var B = new tB2(Q);
    return B.process(A)
  }
  mQ1 = Ne1.exports = O95;
  mQ1.FilterCSS = tB2;
  for (uQ1 in oB2) mQ1[uQ1] = oB2[uQ1];
  var uQ1;
  if (typeof window < "u") window.filterCSS = Ne1.exports
})
// @from(Start 8892425, End 8893098)
cQ1 = z((wRG, eB2) => {
  eB2.exports = {
    indexOf: function(A, Q) {
      var B, G;
      if (Array.prototype.indexOf) return A.indexOf(Q);
      for (B = 0, G = A.length; B < G; B++)
        if (A[B] === Q) return B;
      return -1
    },
    forEach: function(A, Q, B) {
      var G, Z;
      if (Array.prototype.forEach) return A.forEach(Q, B);
      for (G = 0, Z = A.length; G < Z; G++) Q.call(B, A[G], G, A)
    },
    trim: function(A) {
      if (String.prototype.trim) return A.trim();
      return A.replace(/(^\s*)|(\s*$)/g, "")
    },
    spaceIndex: function(A) {
      var Q = /\s|\n|\t/,
        B = Q.exec(A);
      return B ? B.index : -1
    }
  }
})
// @from(Start 8893104, End 8899097)
Le1 = z((p95) => {
  var R95 = dQ1().FilterCSS,
    T95 = dQ1().getDefaultWhiteList,
    lQ1 = cQ1();

  function B22() {
    return {
      a: ["target", "href", "title"],
      abbr: ["title"],
      address: [],
      area: ["shape", "coords", "href", "alt"],
      article: [],
      aside: [],
      audio: ["autoplay", "controls", "crossorigin", "loop", "muted", "preload", "src"],
      b: [],
      bdi: ["dir"],
      bdo: ["dir"],
      big: [],
      blockquote: ["cite"],
      br: [],
      caption: [],
      center: [],
      cite: [],
      code: [],
      col: ["align", "valign", "span", "width"],
      colgroup: ["align", "valign", "span", "width"],
      dd: [],
      del: ["datetime"],
      details: ["open"],
      div: [],
      dl: [],
      dt: [],
      em: [],
      figcaption: [],
      figure: [],
      font: ["color", "size", "face"],
      footer: [],
      h1: [],
      h2: [],
      h3: [],
      h4: [],
      h5: [],
      h6: [],
      header: [],
      hr: [],
      i: [],
      img: ["src", "alt", "title", "width", "height", "loading"],
      ins: ["datetime"],
      kbd: [],
      li: [],
      mark: [],
      nav: [],
      ol: [],
      p: [],
      pre: [],
      s: [],
      section: [],
      small: [],
      span: [],
      sub: [],
      summary: [],
      sup: [],
      strong: [],
      strike: [],
      table: ["width", "border", "align", "valign"],
      tbody: ["align", "valign"],
      td: ["width", "rowspan", "colspan", "align", "valign"],
      tfoot: ["align", "valign"],
      th: ["width", "rowspan", "colspan", "align", "valign"],
      thead: ["align", "valign"],
      tr: ["rowspan", "align", "valign"],
      tt: [],
      u: [],
      ul: [],
      video: ["autoplay", "controls", "crossorigin", "loop", "muted", "playsinline", "poster", "preload", "src", "height", "width"]
    }
  }
  var G22 = new R95;

  function P95(A, Q, B) {}

  function j95(A, Q, B) {}

  function S95(A, Q, B) {}

  function _95(A, Q, B) {}

  function Z22(A) {
    return A.replace(y95, "&lt;").replace(x95, "&gt;")
  }

  function k95(A, Q, B, G) {
    if (B = V22(B), Q === "href" || Q === "src") {
      if (B = lQ1.trim(B), B === "#") return "#";
      if (!(B.substr(0, 7) === "http://" || B.substr(0, 8) === "https://" || B.substr(0, 7) === "mailto:" || B.substr(0, 4) === "tel:" || B.substr(0, 11) === "data:image/" || B.substr(0, 6) === "ftp://" || B.substr(0, 2) === "./" || B.substr(0, 3) === "../" || B[0] === "#" || B[0] === "/")) return ""
    } else if (Q === "background") {
      if (pQ1.lastIndex = 0, pQ1.test(B)) return ""
    } else if (Q === "style") {
      if (A22.lastIndex = 0, A22.test(B)) return "";
      if (Q22.lastIndex = 0, Q22.test(B)) {
        if (pQ1.lastIndex = 0, pQ1.test(B)) return ""
      }
      if (G !== !1) G = G || G22, B = G.process(B)
    }
    return B = F22(B), B
  }
  var y95 = /</g,
    x95 = />/g,
    v95 = /"/g,
    b95 = /&quot;/g,
    f95 = /&#([a-zA-Z0-9]*);?/gim,
    h95 = /&colon;?/gim,
    g95 = /&newline;?/gim,
    pQ1 = /((j\s*a\s*v\s*a|v\s*b|l\s*i\s*v\s*e)\s*s\s*c\s*r\s*i\s*p\s*t\s*|m\s*o\s*c\s*h\s*a):/gi,
    A22 = /e\s*x\s*p\s*r\s*e\s*s\s*s\s*i\s*o\s*n\s*\(.*/gi,
    Q22 = /u\s*r\s*l\s*\(.*/gi;

  function I22(A) {
    return A.replace(v95, "&quot;")
  }

  function Y22(A) {
    return A.replace(b95, '"')
  }

  function J22(A) {
    return A.replace(f95, function(B, G) {
      return G[0] === "x" || G[0] === "X" ? String.fromCharCode(parseInt(G.substr(1), 16)) : String.fromCharCode(parseInt(G, 10))
    })
  }

  function W22(A) {
    return A.replace(h95, ":").replace(g95, " ")
  }

  function X22(A) {
    var Q = "";
    for (var B = 0, G = A.length; B < G; B++) Q += A.charCodeAt(B) < 32 ? " " : A.charAt(B);
    return lQ1.trim(Q)
  }

  function V22(A) {
    return A = Y22(A), A = J22(A), A = W22(A), A = X22(A), A
  }

  function F22(A) {
    return A = I22(A), A = Z22(A), A
  }

  function u95() {
    return ""
  }

  function m95(A, Q) {
    if (typeof Q !== "function") Q = function() {};
    var B = !Array.isArray(A);

    function G(Y) {
      if (B) return !0;
      return lQ1.indexOf(A, Y) !== -1
    }
    var Z = [],
      I = !1;
    return {
      onIgnoreTag: function(Y, J, W) {
        if (G(Y))
          if (W.isClosing) {
            var X = "[/removed]",
              V = W.position + X.length;
            return Z.push([I !== !1 ? I : W.position, V]), I = !1, X
          } else {
            if (!I) I = W.position;
            return "[removed]"
          }
        else return Q(Y, J, W)
      },
      remove: function(Y) {
        var J = "",
          W = 0;
        return lQ1.forEach(Z, function(X) {
          J += Y.slice(W, X[0]), W = X[1]
        }), J += Y.slice(W), J
      }
    }
  }

  function d95(A) {
    var Q = "",
      B = 0;
    while (B < A.length) {
      var G = A.indexOf("<!--", B);
      if (G === -1) {
        Q += A.slice(B);
        break
      }
      Q += A.slice(B, G);
      var Z = A.indexOf("-->", G);
      if (Z === -1) break;
      B = Z + 3
    }
    return Q
  }

  function c95(A) {
    var Q = A.split("");
    return Q = Q.filter(function(B) {
      var G = B.charCodeAt(0);
      if (G === 127) return !1;
      if (G <= 31) {
        if (G === 10 || G === 13) return !0;
        return !1
      }
      return !0
    }), Q.join("")
  }
  p95.whiteList = B22();
  p95.getDefaultWhiteList = B22;
  p95.onTag = P95;
  p95.onIgnoreTag = j95;
  p95.onTagAttr = S95;
  p95.onIgnoreTagAttr = _95;
  p95.safeAttrValue = k95;
  p95.escapeHtml = Z22;
  p95.escapeQuote = I22;
  p95.unescapeQuote = Y22;
  p95.escapeHtmlEntities = J22;
  p95.escapeDangerHtml5Entities = W22;
  p95.clearNonPrintableCharacter = X22;
  p95.friendlyAttrValue = V22;
  p95.escapeAttrValue = F22;
  p95.onIgnoreTagStripAll = u95;
  p95.StripTagBody = m95;
  p95.stripCommentTag = d95;
  p95.stripBlankChar = c95;
  p95.attributeWrapSign = '"';
  p95.cssFilter = G22;
  p95.getDefaultCSSWhiteList = T95
})
// @from(Start 8899103, End 8902661)
Me1 = z((N45) => {
  var ll = cQ1();

  function D45(A) {
    var Q = ll.spaceIndex(A),
      B;
    if (Q === -1) B = A.slice(1, -1);
    else B = A.slice(1, Q + 1);
    if (B = ll.trim(B).toLowerCase(), B.slice(0, 1) === "/") B = B.slice(1);
    if (B.slice(-1) === "/") B = B.slice(0, -1);
    return B
  }

  function H45(A) {
    return A.slice(0, 2) === "</"
  }

  function C45(A, Q, B) {
    var G = "",
      Z = 0,
      I = !1,
      Y = !1,
      J = 0,
      W = A.length,
      X = "",
      V = "";
    A: for (J = 0; J < W; J++) {
      var F = A.charAt(J);
      if (I === !1) {
        if (F === "<") {
          I = J;
          continue
        }
      } else if (Y === !1) {
        if (F === "<") {
          G += B(A.slice(Z, J)), I = J, Z = J;
          continue
        }
        if (F === ">" || J === W - 1) {
          G += B(A.slice(Z, I)), V = A.slice(I, J + 1), X = D45(V), G += Q(I, G.length, X, V, H45(V)), Z = J + 1, I = !1;
          continue
        }
        if (F === '"' || F === "'") {
          var K = 1,
            D = A.charAt(J - K);
          while (D.trim() === "" || D === "=") {
            if (D === "=") {
              Y = F;
              continue A
            }
            D = A.charAt(J - ++K)
          }
        }
      } else if (F === Y) {
        Y = !1;
        continue
      }
    }
    if (Z < W) G += B(A.substr(Z));
    return G
  }
  var E45 = /[^a-zA-Z0-9\\_:.-]/gim;

  function z45(A, Q) {
    var B = 0,
      G = 0,
      Z = [],
      I = !1,
      Y = A.length;

    function J(K, D) {
      if (K = ll.trim(K), K = K.replace(E45, "").toLowerCase(), K.length < 1) return;
      var H = Q(K, D || "");
      if (H) Z.push(H)
    }
    for (var W = 0; W < Y; W++) {
      var X = A.charAt(W),
        V, F;
      if (I === !1 && X === "=") {
        I = A.slice(B, W), B = W + 1, G = A.charAt(B) === '"' || A.charAt(B) === "'" ? B : $45(A, W + 1);
        continue
      }
      if (I !== !1) {
        if (W === G)
          if (F = A.indexOf(X, W + 1), F === -1) break;
          else {
            V = ll.trim(A.slice(G + 1, F)), J(I, V), I = !1, W = F, B = W + 1;
            continue
          }
      }
      if (/\s|\n|\t/.test(X))
        if (A = A.replace(/\s|\n|\t/g, " "), I === !1)
          if (F = U45(A, W), F === -1) {
            V = ll.trim(A.slice(B, W)), J(V), I = !1, B = W + 1;
            continue
          } else {
            W = F - 1;
            continue
          }
      else if (F = w45(A, W - 1), F === -1) {
        V = ll.trim(A.slice(B, W)), V = K22(V), J(I, V), I = !1, B = W + 1;
        continue
      } else continue
    }
    if (B < A.length)
      if (I === !1) J(A.slice(B));
      else J(I, K22(ll.trim(A.slice(B))));
    return ll.trim(Z.join(" "))
  }

  function U45(A, Q) {
    for (; Q < A.length; Q++) {
      var B = A[Q];
      if (B === " ") continue;
      if (B === "=") return Q;
      return -1
    }
  }

  function $45(A, Q) {
    for (; Q < A.length; Q++) {
      var B = A[Q];
      if (B === " ") continue;
      if (B === "'" || B === '"') return Q;
      return -1
    }
  }

  function w45(A, Q) {
    for (; Q > 0; Q--) {
      var B = A[Q];
      if (B === " ") continue;
      if (B === "=") return Q;
      return -1
    }
  }

  function q45(A) {
    if (A[0] === '"' && A[A.length - 1] === '"' || A[0] === "'" && A[A.length - 1] === "'") return !0;
    else return !1
  }

  function K22(A) {
    if (q45(A)) return A.substr(1, A.length - 2);
    else return A
  }
  N45.parseTag = C45;
  N45.parseAttr = z45
})
// @from(Start 8902667, End 8906005)
E22 = z((LRG, C22) => {
  var O45 = dQ1().FilterCSS,
    uM = Le1(),
    D22 = Me1(),
    R45 = D22.parseTag,
    T45 = D22.parseAttr,
    nQ1 = cQ1();

  function iQ1(A) {
    return A === void 0 || A === null
  }

  function P45(A) {
    var Q = nQ1.spaceIndex(A);
    if (Q === -1) return {
      html: "",
      closing: A[A.length - 2] === "/"
    };
    A = nQ1.trim(A.slice(Q + 1, -1));
    var B = A[A.length - 1] === "/";
    if (B) A = nQ1.trim(A.slice(0, -1));
    return {
      html: A,
      closing: B
    }
  }

  function j45(A) {
    var Q = {};
    for (var B in A) Q[B] = A[B];
    return Q
  }

  function S45(A) {
    var Q = {};
    for (var B in A)
      if (Array.isArray(A[B])) Q[B.toLowerCase()] = A[B].map(function(G) {
        return G.toLowerCase()
      });
      else Q[B.toLowerCase()] = A[B];
    return Q
  }

  function H22(A) {
    if (A = j45(A || {}), A.stripIgnoreTag) {
      if (A.onIgnoreTag) console.error('Notes: cannot use these two options "stripIgnoreTag" and "onIgnoreTag" at the same time');
      A.onIgnoreTag = uM.onIgnoreTagStripAll
    }
    if (A.whiteList || A.allowList) A.whiteList = S45(A.whiteList || A.allowList);
    else A.whiteList = uM.whiteList;
    if (this.attributeWrapSign = A.singleQuotedAttributeValue === !0 ? "'" : uM.attributeWrapSign, A.onTag = A.onTag || uM.onTag, A.onTagAttr = A.onTagAttr || uM.onTagAttr, A.onIgnoreTag = A.onIgnoreTag || uM.onIgnoreTag, A.onIgnoreTagAttr = A.onIgnoreTagAttr || uM.onIgnoreTagAttr, A.safeAttrValue = A.safeAttrValue || uM.safeAttrValue, A.escapeHtml = A.escapeHtml || uM.escapeHtml, this.options = A, A.css === !1) this.cssFilter = !1;
    else A.css = A.css || {}, this.cssFilter = new O45(A.css)
  }
  H22.prototype.process = function(A) {
    if (A = A || "", A = A.toString(), !A) return "";
    var Q = this,
      B = Q.options,
      G = B.whiteList,
      Z = B.onTag,
      I = B.onIgnoreTag,
      Y = B.onTagAttr,
      J = B.onIgnoreTagAttr,
      W = B.safeAttrValue,
      X = B.escapeHtml,
      V = Q.attributeWrapSign,
      F = Q.cssFilter;
    if (B.stripBlankChar) A = uM.stripBlankChar(A);
    if (!B.allowCommentTag) A = uM.stripCommentTag(A);
    var K = !1;
    if (B.stripIgnoreTagBody) K = uM.StripTagBody(B.stripIgnoreTagBody, I), I = K.onIgnoreTag;
    var D = R45(A, function(H, C, E, U, q) {
      var w = {
          sourcePosition: H,
          position: C,
          isClosing: q,
          isWhite: Object.prototype.hasOwnProperty.call(G, E)
        },
        N = Z(E, U, w);
      if (!iQ1(N)) return N;
      if (w.isWhite) {
        if (w.isClosing) return "</" + E + ">";
        var R = P45(U),
          T = G[E],
          y = T45(R.html, function(v, x) {
            var p = nQ1.indexOf(T, v) !== -1,
              u = Y(E, v, x, p);
            if (!iQ1(u)) return u;
            if (p)
              if (x = W(E, v, x, F), x) return v + "=" + V + x + V;
              else return v;
            else {
              if (u = J(E, v, x, p), !iQ1(u)) return u;
              return
            }
          });
        if (U = "<" + E, y) U += " " + y;
        if (R.closing) U += " /";
        return U += ">", U
      } else {
        if (N = I(E, U, w), !iQ1(N)) return N;
        return X(U)
      }
    }, X);
    if (K) D = K.remove(D);
    return D
  };
  C22.exports = H22
})
// @from(Start 8906011, End 8906585)
q22 = z((LIA, aQ1) => {
  var z22 = Le1(),
    U22 = Me1(),
    $22 = E22();

  function w22(A, Q) {
    var B = new $22(Q);
    return B.process(A)
  }
  LIA = aQ1.exports = w22;
  LIA.filterXSS = w22;
  LIA.FilterXSS = $22;
  (function() {
    for (var A in z22) LIA[A] = z22[A];
    for (var Q in U22) LIA[Q] = U22[Q]
  })();
  if (typeof window < "u") window.filterXSS = aQ1.exports;

  function _45() {
    return typeof self < "u" && typeof DedicatedWorkerGlobalScope < "u" && self instanceof DedicatedWorkerGlobalScope
  }
  if (_45()) self.filterXSS = aQ1.exports
})
// @from(Start 8906740, End 8906853)
function f45() {
  let A = parseInt(process.env.MCP_OAUTH_CALLBACK_PORT || "", 10);
  return A > 0 ? A : void 0
}
// @from(Start 8906854, End 8907526)
async function h45() {
  let A = f45();
  if (A) return A;
  let {
    min: Q,
    max: B
  } = v45, G = B - Q + 1, Z = Math.min(G, 100);
  for (let I = 0; I < Z; I++) {
    let Y = Q + Math.floor(Math.random() * G);
    try {
      return await new Promise((J, W) => {
        let X = Oe1();
        X.once("error", W), X.listen(Y, () => {
          X.close(() => J())
        })
      }), Y
    } catch {
      continue
    }
  }
  try {
    return await new Promise((I, Y) => {
      let J = Oe1();
      J.once("error", Y), J.listen(N22, () => {
        J.close(() => I())
      })
    }), N22
  } catch {
    throw Error("No available ports for OAuth redirect")
  }
}
// @from(Start 8907528, End 8907739)
function pAA(A, Q) {
  let B = JSON.stringify({
      type: Q.type,
      url: Q.url,
      headers: Q.headers || {}
    }),
    G = y45("sha256").update(B).digest("hex").substring(0, 16);
  return `${A}|${G}`
}
// @from(Start 8907740, End 8909269)
async function Te1(A, Q) {
  let G = Fw().read();
  if (!G?.mcpOAuth) return;
  let Z = pAA(A, Q),
    I = G.mcpOAuth[Z];
  if (!I?.accessToken) {
    y0(A, "No tokens to revoke");
    return
  }
  try {
    let Y = await XLA(Q.url);
    if (!Y?.revocation_endpoint) {
      y0(A, "Server does not support token revocation");
      return
    }
    y0(A, "Revoking tokens on server");
    let J = String(Y.revocation_endpoint);
    y0(A, `Revocation endpoint: ${J}`);
    let W = new URLSearchParams;
    if (W.set("token", I.accessToken), W.set("token_type_hint", "access_token"), I.clientId) W.set("client_id", I.clientId);
    if (await YQ.post(J, W, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${I.accessToken}`
        }
      }), y0(A, "Successfully revoked access token"), I.refreshToken) {
      let X = new URLSearchParams;
      if (X.set("token", I.refreshToken), X.set("token_type_hint", "refresh_token"), I.clientId) X.set("client_id", I.clientId);
      await YQ.post(J, X, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${I.accessToken}`
        }
      }), y0(A, "Successfully revoked refresh token")
    }
  } catch (Y) {
    if (YQ.isAxiosError(Y) && Y.response) y0(A, `Failed to revoke tokens on server: ${Y.message}, Status: ${Y.response.status}, Data: ${JSON.stringify(Y.response.data)}`);
    else y0(A, `Failed to revoke tokens on server: ${Y}`)
  }
  L22(A, Q)
}
// @from(Start 8909271, End 8909463)
function L22(A, Q) {
  let B = Fw(),
    G = B.read();
  if (!G?.mcpOAuth) return;
  let Z = pAA(A, Q);
  if (G.mcpOAuth[Z]) delete G.mcpOAuth[Z], B.update(G), y0(A, "Cleared stored tokens")
}
// @from(Start 8909464, End 8913289)
async function M22(A, Q, B, G) {
  L22(A, Q), GA("tengu_mcp_oauth_flow_start", {
    isOAuthFlow: !0
  });
  let Z = await h45(),
    I = `http://localhost:${Z}/callback`;
  y0(A, `Using redirect port: ${Z}`);
  let Y = new lAA(A, Q, I, !0);
  try {
    let D = await XLA(Q.url);
    if (D) Y.setMetadata(D), y0(A, `Fetched OAuth metadata with scope: ${D.scope||D.default_scope||D.scopes_supported?.join(" ")||"NONE"}`)
  } catch (D) {
    y0(A, `Failed to fetch OAuth metadata: ${D instanceof Error?D.message:String(D)}`)
  }
  let J, W = await Y.state(),
    X = null,
    V = null,
    F = () => {
      if (X) X.close(), X = null;
      if (V) clearTimeout(V), V = null;
      y0(A, "MCP OAuth server cleaned up")
    },
    K = await new Promise((D, H) => {
      if (G) {
        let C = () => {
          F(), H(new sQ1)
        };
        if (G.aborted) {
          C();
          return
        }
        G.addEventListener("abort", C)
      }
      X = Oe1((C, E) => {
        let U = k45(C.url || "", !0);
        if (U.pathname === "/callback") {
          let q = U.query.code,
            w = U.query.state,
            N = U.query.error,
            R = U.query.error_description,
            T = U.query.error_uri;
          if (!N && w !== W) {
            E.writeHead(400, {
              "Content-Type": "text/html"
            }), E.end("<h1>Authentication Error</h1><p>Invalid state parameter. Please try again.</p><p>You can close this window.</p>"), F(), H(Error("OAuth state mismatch - possible CSRF attack"));
            return
          }
          if (N) {
            E.writeHead(200, {
              "Content-Type": "text/html"
            });
            let y = Re1.default(String(N)),
              v = R ? Re1.default(String(R)) : "";
            E.end(`<h1>Authentication Error</h1><p>${y}: ${v}</p><p>You can close this window.</p>`), F();
            let x = `OAuth error: ${N}`;
            if (R) x += ` - ${R}`;
            if (T) x += ` (See: ${T})`;
            H(Error(x));
            return
          }
          if (q) E.writeHead(200, {
            "Content-Type": "text/html"
          }), E.end("<h1>Authentication Successful</h1><p>You can close this window. Return to Claude Code.</p>"), F(), D(q)
        }
      }), X.listen(Z, async () => {
        try {
          y0(A, "Starting SDK auth"), y0(A, `Server URL: ${Q.url}`);
          let C = await rT(Y, {
            serverUrl: Q.url
          });
          if (y0(A, `Initial auth result: ${C}`), J = Y.authorizationUrl, J) B(J);
          if (C !== "REDIRECT") y0(A, `Unexpected auth result, expected REDIRECT: ${C}`)
        } catch (C) {
          y0(A, `SDK auth error: ${C}`), F(), H(C)
        }
      }), V = setTimeout(() => {
        F(), H(Error("Authentication timeout"))
      }, 300000)
    });
  try {
    y0(A, "Completing auth flow with authorization code");
    let D = await rT(Y, {
      serverUrl: Q.url,
      authorizationCode: K
    });
    if (y0(A, `Auth result: ${D}`), D === "AUTHORIZED") {
      let H = await Y.tokens();
      if (y0(A, `Tokens after auth: ${H?"Present":"Missing"}`), H) y0(A, `Token access_token length: ${H.access_token?.length}`), y0(A, `Token expires_in: ${H.expires_in}`);
      GA("tengu_mcp_oauth_flow_success", {})
    } else throw Error("Unexpected auth result: " + D)
  } catch (D) {
    if (y0(A, `Error during auth completion: ${D}`), YQ.isAxiosError(D)) try {
      let H = WQ1.parse(D.response?.data);
      if (H.error === "invalid_client" && H.error_description?.includes("Client not found")) {
        let C = Fw(),
          E = C.read() || {},
          U = pAA(A, Q);
        if (E.mcpOAuth?.[U]) delete E.mcpOAuth[U].clientId, delete E.mcpOAuth[U].clientSecret, C.update(E)
      }
    } catch {}
    throw GA("tengu_mcp_oauth_flow_error", {}), D
  }
}
// @from(Start 8913290, End 8920071)
class lAA {
  serverName;
  serverConfig;
  redirectUri;
  handleRedirection;
  _codeVerifier;
  _authorizationUrl;
  _state;
  _scopes;
  _metadata;
  _refreshInProgress;
  constructor(A, Q, B = b45, G = !1) {
    this.serverName = A, this.serverConfig = Q, this.redirectUri = B, this.handleRedirection = G
  }
  get redirectUrl() {
    return this.redirectUri
  }
  get authorizationUrl() {
    return this._authorizationUrl
  }
  get clientMetadata() {
    let A = {
        client_name: `Claude Code (${this.serverName})`,
        redirect_uris: [this.redirectUri],
        grant_types: ["authorization_code", "refresh_token"],
        response_types: ["code"],
        token_endpoint_auth_method: "none"
      },
      Q = this._metadata?.scope || this._metadata?.default_scope || this._metadata?.scopes_supported?.join(" ");
    if (Q) A.scope = Q, y0(this.serverName, `Using scope from metadata: ${A.scope}`);
    return A
  }
  setMetadata(A) {
    this._metadata = A
  }
  async state() {
    if (!this._state) this._state = x45(32).toString("base64url"), y0(this.serverName, "Generated new OAuth state");
    return this._state
  }
  async clientInformation() {
    let Q = Fw().read(),
      B = pAA(this.serverName, this.serverConfig),
      G = Q?.mcpOAuth?.[B];
    if (G?.clientId) return y0(this.serverName, "Found client info"), {
      client_id: G.clientId,
      client_secret: G.clientSecret
    };
    y0(this.serverName, "No client info found");
    return
  }
  async saveClientInformation(A) {
    let Q = Fw(),
      B = Q.read() || {},
      G = pAA(this.serverName, this.serverConfig),
      Z = {
        ...B,
        mcpOAuth: {
          ...B.mcpOAuth,
          [G]: {
            ...B.mcpOAuth?.[G],
            serverName: this.serverName,
            serverUrl: this.serverConfig.url,
            clientId: A.client_id,
            clientSecret: A.client_secret,
            accessToken: B.mcpOAuth?.[G]?.accessToken || "",
            expiresAt: B.mcpOAuth?.[G]?.expiresAt || 0
          }
        }
      };
    Q.update(Z)
  }
  async tokens() {
    let Q = Fw().read(),
      B = pAA(this.serverName, this.serverConfig),
      G = Q?.mcpOAuth?.[B];
    if (!G) {
      y0(this.serverName, "No token data found");
      return
    }
    let Z = (G.expiresAt - Date.now()) / 1000;
    if (Z <= 0 && !G.refreshToken) {
      y0(this.serverName, "Token expired without refresh token");
      return
    }
    if (Z <= 300 && G.refreshToken) {
      if (!this._refreshInProgress) y0(this.serverName, `Token expires in ${Math.floor(Z)}s, attempting proactive refresh`), this._refreshInProgress = this.refreshAuthorization(G.refreshToken).finally(() => {
        this._refreshInProgress = void 0
      });
      else y0(this.serverName, "Token refresh already in progress, reusing existing promise");
      try {
        let Y = await this._refreshInProgress;
        if (Y) return y0(this.serverName, "Token refreshed successfully"), Y;
        y0(this.serverName, "Token refresh failed, returning current tokens")
      } catch (Y) {
        y0(this.serverName, `Token refresh error: ${Y instanceof Error?Y.message:String(Y)}`)
      }
    }
    let I = {
      access_token: G.accessToken,
      refresh_token: G.refreshToken,
      expires_in: Z,
      scope: G.scope,
      token_type: "Bearer"
    };
    return y0(this.serverName, "Returning tokens"), y0(this.serverName, `Token length: ${I.access_token?.length}`), y0(this.serverName, `Has refresh token: ${!!I.refresh_token}`), y0(this.serverName, `Expires in: ${Math.floor(Z)}s`), I
  }
  async saveTokens(A) {
    let Q = Fw(),
      B = Q.read() || {},
      G = pAA(this.serverName, this.serverConfig);
    y0(this.serverName, "Saving tokens"), y0(this.serverName, `Token expires in: ${A.expires_in}`), y0(this.serverName, `Has refresh token: ${!!A.refresh_token}`);
    let Z = {
      ...B,
      mcpOAuth: {
        ...B.mcpOAuth,
        [G]: {
          ...B.mcpOAuth?.[G],
          serverName: this.serverName,
          serverUrl: this.serverConfig.url,
          accessToken: A.access_token,
          refreshToken: A.refresh_token,
          expiresAt: Date.now() + (A.expires_in || 3600) * 1000,
          scope: A.scope
        }
      }
    };
    Q.update(Z)
  }
  async redirectToAuthorization(A) {
    this._authorizationUrl = A.toString();
    let Q = A.searchParams.get("scope");
    if (y0(this.serverName, `Authorization URL: ${A.toString()}`), y0(this.serverName, `Scopes in URL: ${Q||"NOT FOUND"}`), Q) this._scopes = Q, y0(this.serverName, `Captured scopes from authorization URL: ${Q}`);
    else {
      let Z = this._metadata?.scope || this._metadata?.default_scope || this._metadata?.scopes_supported?.join(" ");
      if (Z) this._scopes = Z, y0(this.serverName, `Using scopes from metadata: ${Z}`);
      else y0(this.serverName, "No scopes available from URL or metadata")
    }
    if (!this.handleRedirection) {
      y0(this.serverName, "Redirection handling is disabled, skipping redirect");
      return
    }
    let B = A.toString();
    if (!B.startsWith("http://") && !B.startsWith("https://")) throw Error("Invalid authorization URL: must use http:// or https:// scheme");
    if (y0(this.serverName, "Redirecting to authorization URL"), y0(this.serverName, `Authorization URL: ${B}`), y0(this.serverName, `Opening authorization URL: ${B}`), !await cZ(B)) process.stdout.write(`
Couldn't open browser automatically. Please manually open the URL above in your browser.
`)
  }
  async saveCodeVerifier(A) {
    y0(this.serverName, "Saving code verifier"), this._codeVerifier = A
  }
  async codeVerifier() {
    if (!this._codeVerifier) throw y0(this.serverName, "No code verifier saved"), Error("No code verifier saved");
    return y0(this.serverName, "Returning code verifier"), this._codeVerifier
  }
  async refreshAuthorization(A) {
    try {
      y0(this.serverName, "Starting token refresh");
      let Q = await XLA(new URL(this.serverConfig.url));
      if (!Q) {
        y0(this.serverName, "Failed to discover OAuth metadata");
        return
      }
      let B = await this.clientInformation();
      if (!B) {
        y0(this.serverName, "No client information available for refresh");
        return
      }
      let G = await Je1(new URL(this.serverConfig.url), {
        metadata: Q,
        clientInformation: B,
        refreshToken: A,
        resource: new URL(this.serverConfig.url)
      });
      if (G) return y0(this.serverName, "Token refresh successful, saving new tokens"), await this.saveTokens(G), G;
      y0(this.serverName, "Token refresh returned no tokens");
      return
    } catch (Q) {
      y0(this.serverName, `Token refresh failed: ${Q instanceof Error?Q.message:String(Q)}`);
      return
    }
  }
}
// @from(Start 8920076, End 8920079)
Re1
// @from(Start 8920081, End 8920084)
sQ1
// @from(Start 8920086, End 8920089)
v45
// @from(Start 8920091, End 8920101)
N22 = 3118
// @from(Start 8920105, End 8920143)
b45 = "http://localhost:3118/callback"
// @from(Start 8920149, End 8920520)
rQ1 = L(() => {
  mbA();
  q0();
  XQ1();
  VLA();
  gM();
  O3();
  g1();
  Q3();
  Re1 = BA(q22(), 1);
  sQ1 = class sQ1 extends Error {
    constructor() {
      super("Authentication was cancelled");
      this.name = "AuthenticationCancelledError"
    }
  };
  v45 = dQ() === "windows" ? {
    min: 39152,
    max: 49151
  } : {
    min: 49152,
    max: 65535
  }
})
// @from(Start 8920523, End 8920803)
function ELA(A) {
  let Q = [];
  return {
    expanded: A.replace(/\$\{([^}]+)\}/g, (G, Z) => {
      let [I, Y] = Z.split(":-", 2), J = process.env[I];
      if (J !== void 0) return J;
      if (Y !== void 0) return Y;
      return Q.push(I), G
    }),
    missingVars: Q
  }
}
// @from(Start 8920808, End 8920811)
Pe1
// @from(Start 8920813, End 8920816)
hRG
// @from(Start 8920818, End 8920821)
je1
// @from(Start 8920823, End 8920826)
g45
// @from(Start 8920828, End 8920831)
u45
// @from(Start 8920833, End 8920836)
m45
// @from(Start 8920838, End 8920841)
d45
// @from(Start 8920843, End 8920846)
c45
// @from(Start 8920848, End 8920851)
p45
// @from(Start 8920853, End 8920855)
il
// @from(Start 8920857, End 8920860)
O22
// @from(Start 8920866, End 8922232)
MIA = L(() => {
  Q2();
  Pe1 = j.enum(["local", "user", "project", "dynamic", "enterprise"]), hRG = j.enum(["stdio", "sse", "sse-ide", "http", "ws", "sdk"]), je1 = j.object({
    type: j.literal("stdio").optional(),
    command: j.string().min(1, "Command cannot be empty"),
    args: j.array(j.string()).default([]),
    env: j.record(j.string()).optional()
  }), g45 = j.object({
    type: j.literal("sse"),
    url: j.string(),
    headers: j.record(j.string()).optional(),
    headersHelper: j.string().optional()
  }), u45 = j.object({
    type: j.literal("sse-ide"),
    url: j.string(),
    ideName: j.string(),
    ideRunningInWindows: j.boolean().optional()
  }), m45 = j.object({
    type: j.literal("ws-ide"),
    url: j.string(),
    ideName: j.string(),
    authToken: j.string().optional(),
    ideRunningInWindows: j.boolean().optional()
  }), d45 = j.object({
    type: j.literal("http"),
    url: j.string(),
    headers: j.record(j.string()).optional(),
    headersHelper: j.string().optional()
  }), c45 = j.object({
    type: j.literal("ws"),
    url: j.string(),
    headers: j.record(j.string()).optional(),
    headersHelper: j.string().optional()
  }), p45 = j.object({
    type: j.literal("sdk"),
    name: j.string()
  }), il = j.union([je1, g45, u45, m45, d45, c45, p45]), O22 = j.object({
    mcpServers: j.record(j.string(), il)
  })
})
// @from(Start 8922238, End 8922241)
zLA
// @from(Start 8922247, End 8922467)
oQ1 = L(() => {
  zLA = ["PreToolUse", "PostToolUse", "PostToolUseFailure", "Notification", "UserPromptSubmit", "SessionStart", "SessionEnd", "Stop", "SubagentStart", "SubagentStop", "PreCompact", "PermissionRequest"]
})
// @from(Start 8922470, End 8922531)
function R22(A) {
  return Se1.filePatternTools.includes(A)
}
// @from(Start 8922533, End 8922593)
function T22(A) {
  return Se1.bashPrefixTools.includes(A)
}
// @from(Start 8922595, End 8922647)
function P22(A) {
  return Se1.customValidation[A]
}
// @from(Start 8922652, End 8922655)
Se1
// @from(Start 8922661, End 8923882)
j22 = L(() => {
  Se1 = {
    filePatternTools: ["Read", "Write", "Edit", "Glob", "NotebookRead", "NotebookEdit"],
    bashPrefixTools: ["Bash"],
    customValidation: {
      WebSearch: (A) => {
        if (A.includes("*") || A.includes("?")) return {
          valid: !1,
          error: "WebSearch does not support wildcards",
          suggestion: "Use exact search terms without * or ?",
          examples: ["WebSearch(claude ai)", "WebSearch(typescript tutorial)"]
        };
        return {
          valid: !0
        }
      },
      WebFetch: (A) => {
        if (A.includes("://") || A.startsWith("http")) return {
          valid: !1,
          error: "WebFetch permissions use domain format, not URLs",
          suggestion: 'Use "domain:hostname" format',
          examples: ["WebFetch(domain:example.com)", "WebFetch(domain:github.com)"]
        };
        if (!A.startsWith("domain:")) return {
          valid: !1,
          error: 'WebFetch permissions must use "domain:" prefix',
          suggestion: 'Use "domain:hostname" format',
          examples: ["WebFetch(domain:example.com)", "WebFetch(domain:*.google.com)"]
        };
        return {
          valid: !0
        }
      }
    }
  }
})
// @from(Start 8923885, End 8928211)
function l45(A) {
  if (!A || A.trim() === "") return {
    valid: !1,
    error: "Permission rule cannot be empty"
  };
  let Q = (A.match(/\(/g) || []).length,
    B = (A.match(/\)/g) || []).length;
  if (Q !== B) return {
    valid: !1,
    error: "Mismatched parentheses",
    suggestion: "Ensure all opening parentheses have matching closing parentheses"
  };
  if (A.includes("()")) {
    let Y = A.substring(0, A.indexOf("("));
    if (!Y) return {
      valid: !1,
      error: "Empty parentheses with no tool name",
      suggestion: "Specify a tool name before the parentheses"
    };
    return {
      valid: !1,
      error: "Empty parentheses",
      suggestion: `Either specify a pattern or use just "${Y}" without parentheses`,
      examples: [`${Y}`, `${Y}(some-pattern)`]
    }
  }
  let G = nN(A),
    Z = mU(G.toolName);
  if (Z) {
    if (G.ruleContent !== void 0) return {
      valid: !1,
      error: "MCP rules do not support patterns",
      suggestion: `Use "${G.toolName}" without parentheses`,
      examples: [`mcp__${Z.serverName}`, Z.toolName ? `mcp__${Z.serverName}__${Z.toolName}` : void 0].filter(Boolean)
    };
    return {
      valid: !0
    }
  }
  if (!G.toolName || G.toolName.length === 0) return {
    valid: !1,
    error: "Tool name cannot be empty"
  };
  if (G.toolName[0] !== G.toolName[0]?.toUpperCase()) return {
    valid: !1,
    error: "Tool names must start with uppercase",
    suggestion: `Use "${String(G.toolName).charAt(0).toUpperCase()+String(G.toolName).slice(1)}"`
  };
  let I = P22(G.toolName);
  if (I && G.ruleContent !== void 0) {
    let Y = I(G.ruleContent);
    if (!Y.valid) return Y
  }
  if (T22(G.toolName) && G.ruleContent !== void 0) {
    let Y = G.ruleContent;
    if (Y.includes(":*") && !Y.endsWith(":*")) return {
      valid: !1,
      error: "The :* pattern must be at the end",
      suggestion: "Move :* to the end for prefix matching",
      examples: ["Bash(npm run:*)", "Bash(git commit:*)"]
    };
    if (Y.includes(" * ") && !Y.endsWith(":*")) return {
      valid: !1,
      error: "Wildcards in the middle of commands are not supported",
      suggestion: 'Use prefix matching with ":*" or specify exact commands',
      examples: ["Bash(npm run:*) - allows any npm run command", "Bash(npm install express) - allows exact command", "Bash - allows all commands"]
    };
    if (Y === ":*") return {
      valid: !1,
      error: "Prefix cannot be empty before :*",
      suggestion: "Specify a command prefix before :*",
      examples: ["Bash(npm:*)", "Bash(git:*)"]
    };
    let J = ['"', "'"];
    for (let X of J)
      if ((Y.match(new RegExp(X, "g")) || []).length % 2 !== 0) return {
        valid: !1,
        error: `Unmatched ${X} in Bash pattern`,
        suggestion: "Ensure all quotes are properly paired"
      };
    if (Y === "*") return {
      valid: !1,
      error: 'Use "Bash" without parentheses to allow all commands',
      suggestion: "Remove the parentheses or specify a command pattern",
      examples: ["Bash", "Bash(npm:*)", "Bash(npm install)"]
    };
    let W = Y.indexOf("*");
    if (W !== -1 && !Y.includes("/")) {
      if (!Y.substring(0, W).endsWith(":")) return {
        valid: !1,
        error: 'Use ":*" for prefix matching, not just "*"',
        suggestion: `Change to "Bash(${String(Y).replace(/\*/g,":*")})" for prefix matching`,
        examples: ["Bash(npm run:*)", "Bash(git:*)"]
      }
    }
  }
  if (R22(G.toolName) && G.ruleContent !== void 0) {
    let Y = G.ruleContent;
    if (Y.includes(":*")) return {
      valid: !1,
      error: 'The ":*" syntax is only for Bash prefix rules',
      suggestion: 'Use glob patterns like "*" or "**" for file matching',
      examples: [`${G.toolName}(*.ts) - matches .ts files`, `${G.toolName}(src/**) - matches all files in src`, `${G.toolName}(**/*.test.ts) - matches test files`]
    };
    if (Y.includes("*") && !Y.match(/^\*|\*$|\*\*|\/\*|\*\.|\*\)/) && !Y.includes("**")) return {
      valid: !1,
      error: "Wildcard placement might be incorrect",
      suggestion: "Wildcards are typically used at path boundaries",
      examples: [`${G.toolName}(*.js) - all .js files`, `${G.toolName}(src/*) - all files directly in src`, `${G.toolName}(src/**) - all files recursively in src`]
    }
  }
  return {
    valid: !0
  }
}
// @from(Start 8928216, End 8928219)
tQ1
// @from(Start 8928225, End 8928670)
S22 = L(() => {
  Q2();
  AZ();
  nX();
  j22();
  tQ1 = j.string().superRefine((A, Q) => {
    let B = l45(A);
    if (!B.valid) {
      let G = B.error;
      if (B.suggestion) G += `. ${B.suggestion}`;
      if (B.examples && B.examples.length > 0) G += `. Examples: ${B.examples.join(", ")}`;
      Q.addIssue({
        code: j.ZodIssueCode.custom,
        message: G,
        params: {
          received: A
        }
      })
    }
  })
})
// @from(Start 8928676, End 8928678)
Vh
// @from(Start 8928680, End 8928683)
OIA
// @from(Start 8928685, End 8928688)
_22
// @from(Start 8928690, End 8928693)
_e1
// @from(Start 8928695, End 8928698)
ke1
// @from(Start 8928700, End 8928703)
y22
// @from(Start 8928705, End 8928708)
i45
// @from(Start 8928710, End 8928713)
x22
// @from(Start 8928715, End 8928718)
n45
// @from(Start 8928720, End 8928723)
a45
// @from(Start 8928725, End 8928728)
s45
// @from(Start 8928730, End 8928733)
r45
// @from(Start 8928735, End 8928738)
o45
// @from(Start 8928740, End 8928743)
t45
// @from(Start 8928745, End 8928748)
e45
// @from(Start 8928750, End 8928753)
k22
// @from(Start 8928755, End 8928758)
A85
// @from(Start 8928760, End 8928763)
RIA
// @from(Start 8928765, End 8928768)
Q85
// @from(Start 8928770, End 8928773)
nAA
// @from(Start 8928775, End 8928778)
v22
// @from(Start 8928780, End 8928783)
eQ1
// @from(Start 8928785, End 8928788)
B85
// @from(Start 8928790, End 8928793)
G85
// @from(Start 8928795, End 8928798)
TIA
// @from(Start 8928800, End 8928803)
iAA
// @from(Start 8928805, End 8928808)
rRG
// @from(Start 8928810, End 8928813)
Z85
// @from(Start 8928815, End 8928818)
$LA
// @from(Start 8928820, End 8928823)
I85
// @from(Start 8928825, End 8928828)
Y85
// @from(Start 8928830, End 8928833)
AB1
// @from(Start 8928835, End 8928838)
oRG
// @from(Start 8928840, End 8928843)
J85
// @from(Start 8928845, End 8928848)
ye1
// @from(Start 8928854, End 8944487)
aAA = L(() => {
  Q2();
  PIA();
  MIA();
  Vh = j.string().startsWith("./"), OIA = Vh.endsWith(".json"), _22 = j.union([Vh.refine((A) => A.endsWith(".mcpb") || A.endsWith(".dxt"), {
    message: "MCPB file path must end with .mcpb or .dxt"
  }).describe("Path to MCPB file relative to plugin root"), j.string().url().refine((A) => A.endsWith(".mcpb") || A.endsWith(".dxt"), {
    message: "MCPB URL must end with .mcpb or .dxt"
  }).describe("URL to MCPB file")]), _e1 = Vh.endsWith(".md"), ke1 = j.union([_e1, Vh]), y22 = j.object({
    name: j.string().min(1, "Author name cannot be empty").describe("Display name of the plugin author or organization"),
    email: j.string().optional().describe("Contact email for support or feedback"),
    url: j.string().optional().describe("Website, GitHub profile, or organization URL")
  }), i45 = j.object({
    name: j.string().min(1, "Plugin name cannot be empty").refine((A) => !A.includes(" "), {
      message: 'Plugin name cannot contain spaces. Use kebab-case (e.g., "my-plugin")'
    }).describe("Unique identifier for the plugin, used for namespacing (prefer kebab-case)"),
    version: j.string().optional().describe("Semantic version (e.g., 1.2.3) following semver.org specification"),
    description: j.string().optional().describe("Brief, user-facing explanation of what the plugin provides"),
    author: y22.optional().describe("Information about the plugin creator or maintainer"),
    homepage: j.string().url().optional().describe("Plugin homepage or documentation URL"),
    repository: j.string().optional().describe("Source code repository URL"),
    license: j.string().optional().describe("SPDX license identifier (e.g., MIT, Apache-2.0)"),
    keywords: j.array(j.string()).optional().describe("Tags for plugin discovery and categorization")
  }), x22 = j.object({
    description: j.string().optional().describe("Brief, user-facing explanation of what these hooks provide"),
    hooks: j.lazy(() => ULA).describe("The hooks provided by the plugin, in the same format as the one used for settings")
  }), n45 = j.object({
    hooks: j.union([OIA.describe("Path to file with additional hooks (in addition to those in hooks/hooks.json, if it exists), relative to the plugin root"), j.lazy(() => ULA).describe("Additional hooks (in addition to those in hooks/hooks.json, if it exists)"), j.array(j.union([OIA.describe("Path to file with additional hooks (in addition to those in hooks/hooks.json, if it exists), relative to the plugin root"), j.lazy(() => ULA).describe("Additional hooks (in addition to those in hooks/hooks.json, if it exists)")]))])
  }), a45 = j.object({
    source: ke1.optional().describe("Path to command markdown file, relative to plugin root"),
    content: j.string().optional().describe("Inline markdown content for the command"),
    description: j.string().optional().describe("Command description override"),
    argumentHint: j.string().optional().describe('Hint for command arguments (e.g., "[file]")'),
    model: j.string().optional().describe("Default model for this command"),
    allowedTools: j.array(j.string()).optional().describe("Tools allowed when command runs")
  }).refine((A) => A.source && !A.content || !A.source && A.content, {
    message: 'Command must have either "source" (file path) or "content" (inline markdown), but not both'
  }), s45 = j.object({
    commands: j.union([ke1.describe("Path to additional command file or skill directory (in addition to those in the commands/ directory, if it exists), relative to the plugin root"), j.array(ke1.describe("Path to additional command file or skill directory (in addition to those in the commands/ directory, if it exists), relative to the plugin root")).describe("List of paths to additional command files or skill directories"), j.record(j.string(), a45).describe('Object mapping of command names to their metadata and source files. Command name becomes the slash command name (e.g., "about" → "/plugin:about")')])
  }), r45 = j.object({
    agents: j.union([_e1.describe("Path to additional agent file (in addition to those in the agents/ directory, if it exists), relative to the plugin root"), j.array(_e1.describe("Path to additional agent file (in addition to those in the agents/ directory, if it exists), relative to the plugin root")).describe("List of paths to additional agent files")])
  }), o45 = j.object({
    skills: j.union([Vh.describe("Path to additional skill directory (in addition to those in the skills/ directory, if it exists), relative to the plugin root"), j.array(Vh.describe("Path to additional skill directory (in addition to those in the skills/ directory, if it exists), relative to the plugin root")).describe("List of paths to additional skill directories")])
  }), t45 = j.object({
    outputStyles: j.union([Vh.describe("Path to additional output styles directory or file (in addition to those in the output-styles/ directory, if it exists), relative to the plugin root"), j.array(Vh.describe("Path to additional output styles directory or file (in addition to those in the output-styles/ directory, if it exists), relative to the plugin root")).describe("List of paths to additional output styles directories or files")])
  }), e45 = j.object({
    mcpServers: j.union([OIA.describe("MCP servers to include in the plugin (in addition to those in the .mcp.json file, if it exists)"), _22.describe("Path or URL to MCPB file containing MCP server configuration"), j.record(j.string(), il).describe("MCP server configurations keyed by server name"), j.array(j.union([OIA.describe("Path to MCP servers configuration file"), _22.describe("Path or URL to MCPB file"), j.record(j.string(), il).describe("Inline MCP server configurations")])).describe("Array of MCP server configurations (paths, MCPB files, or inline definitions)")])
  }), k22 = j.string().min(1), A85 = j.string().min(2).refine((A) => A.startsWith("."), {
    message: 'File extensions must start with dot (e.g., ".ts", not "ts")'
  }), RIA = j.strictObject({
    command: j.string().min(1).refine((A) => {
      if (A.includes(" ") && !A.startsWith("/")) return !1;
      return !0
    }, {
      message: "Command should not contain spaces. Use args array for arguments."
    }).describe('Command to execute the LSP server (e.g., "typescript-language-server")'),
    args: j.array(k22).optional().describe("Command-line arguments to pass to the server"),
    extensionToLanguage: j.record(A85, k22).refine((A) => Object.keys(A).length > 0, {
      message: "extensionToLanguage must have at least one mapping"
    }).describe("Mapping from file extension to LSP language ID. File extensions and languages are derived from this mapping."),
    transport: j.enum(["stdio", "socket"]).default("stdio").describe("Communication transport mechanism"),
    env: j.record(j.string(), j.string()).optional().describe("Environment variables to set when starting the server"),
    initializationOptions: j.unknown().optional().describe("Initialization options passed to the server during initialization"),
    settings: j.unknown().optional().describe("Settings passed to the server via workspace/didChangeConfiguration"),
    workspaceFolder: j.string().optional().describe("Workspace folder path to use for the server"),
    startupTimeout: j.number().int().positive().optional().describe("Maximum time to wait for server startup (milliseconds)"),
    shutdownTimeout: j.number().int().positive().optional().describe("Maximum time to wait for graceful shutdown (milliseconds)"),
    restartOnCrash: j.boolean().optional().describe("Whether to restart the server if it crashes"),
    maxRestarts: j.number().int().nonnegative().optional().describe("Maximum number of restart attempts before giving up")
  }), Q85 = j.object({
    lspServers: j.union([OIA.describe("Path to .lsp.json configuration file relative to plugin root"), j.record(j.string(), RIA).describe("LSP server configurations keyed by server name"), j.array(j.union([OIA.describe("Path to LSP configuration file"), j.record(j.string(), RIA).describe("Inline LSP server configurations")])).describe("Array of LSP server configurations (paths or inline definitions)")])
  }), nAA = j.object({
    ...i45.shape,
    ...n45.partial().shape,
    ...s45.partial().shape,
    ...r45.partial().shape,
    ...o45.partial().shape,
    ...t45.partial().shape,
    ...e45.partial().shape,
    ...Q85.partial().shape
  }).strict(), v22 = j.string().refine((A) => !A.includes("..") && !A.includes("//"), "Package name cannot contain path traversal patterns").refine((A) => {
    let Q = /^@[a-z0-9][a-z0-9-._]*\/[a-z0-9][a-z0-9-._]*$/,
      B = /^[a-z0-9][a-z0-9-._]*$/;
    return Q.test(A) || B.test(A)
  }, "Invalid npm package name format"), eQ1 = j.discriminatedUnion("source", [j.object({
    source: j.literal("url"),
    url: j.string().url().describe("Direct URL to marketplace.json file"),
    headers: j.record(j.string(), j.string()).optional().describe("Custom HTTP headers (e.g., for authentication)")
  }), j.object({
    source: j.literal("github"),
    repo: j.string().describe("GitHub repository in owner/repo format"),
    ref: j.string().optional().describe('Git branch or tag to use (e.g., "main", "v1.0.0"). Defaults to repository default branch.'),
    path: j.string().optional().describe("Path to marketplace.json within repo (defaults to .claude-plugin/marketplace.json)")
  }), j.object({
    source: j.literal("git"),
    url: j.string().endsWith(".git").describe("Full git repository URL"),
    ref: j.string().optional().describe('Git branch or tag to use (e.g., "main", "v1.0.0"). Defaults to repository default branch.'),
    path: j.string().optional().describe("Path to marketplace.json within repo (defaults to .claude-plugin/marketplace.json)")
  }), j.object({
    source: j.literal("npm"),
    package: v22.describe("NPM package containing marketplace.json")
  }), j.object({
    source: j.literal("file"),
    path: j.string().describe("Local file path to marketplace.json")
  }), j.object({
    source: j.literal("directory"),
    path: j.string().describe("Local directory containing .claude-plugin/marketplace.json")
  })]), B85 = j.union([Vh.describe("Path to the plugin root, relative to the marketplace directory"), j.object({
    source: j.literal("npm"),
    package: v22.or(j.string()).describe("Package name (or url, or local path, or anything else that can be passed to `npm` as a package)"),
    version: j.string().optional().describe("Specific version or version range (e.g., ^1.0.0, ~2.1.0)"),
    registry: j.string().url().optional().describe("Custom NPM registry URL (defaults to using system default, likely npmjs.org)")
  }).describe("NPM package as plugin source"), j.object({
    source: j.literal("pip"),
    package: j.string().describe("Python package name as it appears on PyPI"),
    version: j.string().optional().describe("Version specifier (e.g., ==1.0.0, >=2.0.0, <3.0.0)"),
    registry: j.string().url().optional().describe("Custom PyPI registry URL (defaults to using system default, likely pypi.org)")
  }).describe("Python package as plugin source"), j.object({
    source: j.literal("url"),
    url: j.string().endsWith(".git").describe("Full git repository URL (https:// or git@)"),
    ref: j.string().optional().describe('Git branch or tag to use (e.g., "main", "v1.0.0"). Defaults to repository default branch.')
  }), j.object({
    source: j.literal("github"),
    repo: j.string().describe("GitHub repository in owner/repo format"),
    ref: j.string().optional().describe('Git branch or tag to use (e.g., "main", "v1.0.0"). Defaults to repository default branch.')
  })]), G85 = nAA.partial().extend({
    name: j.string().min(1, "Plugin name cannot be empty").refine((A) => !A.includes(" "), {
      message: 'Plugin name cannot contain spaces. Use kebab-case (e.g., "my-plugin")'
    }).describe("Unique identifier matching the plugin name"),
    source: B85.describe("Where to fetch the plugin from"),
    category: j.string().optional().describe('Category for organizing plugins (e.g., "productivity", "development")'),
    tags: j.array(j.string()).optional().describe("Tags for searchability and discovery"),
    strict: j.boolean().optional().default(!0).describe("Require the plugin manifest to be present in the plugin folder. If false, the marketplace entry provides the manifest.")
  }).strict(), TIA = j.object({
    name: j.string().min(1, "Marketplace must have a name").refine((A) => !A.includes(" "), {
      message: 'Marketplace name cannot contain spaces. Use kebab-case (e.g., "my-marketplace")'
    }),
    owner: y22.describe("Marketplace maintainer or curator information"),
    plugins: j.array(G85).describe("Collection of available plugins in this marketplace"),
    metadata: j.object({
      pluginRoot: j.string().optional().describe("Base path for relative plugin sources"),
      version: j.string().optional().describe("Marketplace version"),
      description: j.string().optional().describe("Marketplace description")
    }).optional().describe("Optional marketplace metadata")
  }), iAA = j.string().regex(/^[a-z0-9][-a-z0-9._]*@[a-z0-9][-a-z0-9._]*$/i, "Plugin ID must be in format: plugin@marketplace"), rRG = j.union([iAA, j.object({
    id: iAA.describe('Plugin identifier (e.g., "formatter@tools")'),
    version: j.string().optional().describe('Version constraint (e.g., "^2.0.0")'),
    required: j.boolean().optional().describe("If true, cannot be disabled"),
    config: j.record(j.unknown()).optional().describe("Plugin-specific configuration")
  })]), Z85 = j.object({
    version: j.string().describe("Currently installed version"),
    installedAt: j.string().describe("ISO 8601 timestamp of installation"),
    lastUpdated: j.string().optional().describe("ISO 8601 timestamp of last update"),
    installPath: j.string().describe("Absolute path to the installed plugin directory"),
    gitCommitSha: j.string().optional().describe("Git commit SHA for git-based plugins (for version tracking)"),
    isLocal: j.boolean().optional().describe("True if plugin is local (in marketplace directory). Local plugins should not be deleted on uninstall.")
  }), $LA = j.object({
    version: j.literal(1).describe("Schema version 1"),
    plugins: j.record(iAA, Z85).describe("Map of plugin IDs to their installation metadata")
  }), I85 = j.enum(["managed", "user", "project", "local"]), Y85 = j.object({
    scope: I85.describe("Installation scope"),
    projectPath: j.string().optional().describe("Project path (required for project/local scopes)"),
    installPath: j.string().describe("Absolute path to the versioned plugin directory"),
    version: j.string().optional().describe("Currently installed version"),
    installedAt: j.string().optional().describe("ISO 8601 timestamp of installation"),
    lastUpdated: j.string().optional().describe("ISO 8601 timestamp of last update"),
    gitCommitSha: j.string().optional().describe("Git commit SHA for git-based plugins"),
    isLocal: j.boolean().optional().describe("True if plugin is in marketplace directory")
  }), AB1 = j.object({
    version: j.literal(2).describe("Schema version 2"),
    plugins: j.record(iAA, j.array(Y85)).describe("Map of plugin IDs to arrays of installation entries")
  }), oRG = j.union([$LA, AB1]), J85 = j.object({
    source: eQ1.describe("Where to fetch the marketplace from"),
    installLocation: j.string().describe("Local cache path where marketplace manifest is stored"),
    lastUpdated: j.string().describe("ISO 8601 timestamp of last marketplace refresh")
  }), ye1 = j.record(j.string(), J85)
})
// @from(Start 8944493, End 8944496)
W85
// @from(Start 8944498, End 8944501)
b22
// @from(Start 8944507, End 8945593)
f22 = L(() => {
  Q2();
  W85 = j.object({
    allowUnixSockets: j.array(j.string()).optional(),
    allowAllUnixSockets: j.boolean().optional(),
    allowLocalBinding: j.boolean().optional(),
    httpProxyPort: j.number().optional(),
    socksProxyPort: j.number().optional()
  }).optional(), b22 = j.object({
    enabled: j.boolean().optional(),
    autoAllowBashIfSandboxed: j.boolean().optional(),
    allowUnsandboxedCommands: j.boolean().optional().describe("Allow commands to run outside the sandbox via the dangerouslyDisableSandbox parameter. When false, the dangerouslyDisableSandbox parameter is completely ignored and all commands must run sandboxed. Default: true."),
    network: W85,
    ignoreViolations: j.record(j.string(), j.array(j.string())).optional(),
    enableWeakerNestedSandbox: j.boolean().optional(),
    excludedCommands: j.array(j.string()).optional(),
    ripgrep: j.object({
      command: j.string(),
      args: j.array(j.string()).optional()
    }).optional().describe("Custom ripgrep configuration for bundled ripgrep support")
  }).passthrough()
})
// @from(Start 8945596, End 8945669)
function wLA(A) {
  return "serverName" in A && A.serverName !== void 0
}
// @from(Start 8945671, End 8945750)
function QB1(A) {
  return "serverCommand" in A && A.serverCommand !== void 0
}
// @from(Start 8945755, End 8945758)
X85
// @from(Start 8945760, End 8945763)
V85
// @from(Start 8945765, End 8945768)
F85
// @from(Start 8945770, End 8945773)
K85
// @from(Start 8945775, End 8945778)
D85
// @from(Start 8945780, End 8945783)
H85
// @from(Start 8945785, End 8945788)
C85
// @from(Start 8945790, End 8945793)
ULA
// @from(Start 8945795, End 8945798)
E85
// @from(Start 8945800, End 8945803)
z85
// @from(Start 8945805, End 8945808)
U85
// @from(Start 8945810, End 8945813)
sAA