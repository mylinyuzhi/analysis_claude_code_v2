
// @from(Ln 324822, Col 0)
function Kb5() {
  return ET2.sample(["Got it.", "Good to know.", "Noted."])
}
// @from(Ln 324826, Col 0)
function $T2({
  text: A,
  addMargin: Q
}) {
  let B = Q9(A, "user-memory-input"),
    G = zT2.useMemo(() => Kb5(), []);
  if (!B) return null;
  return _O.createElement(T, {
    flexDirection: "column",
    marginTop: Q ? 1 : 0,
    width: "100%"
  }, _O.createElement(T, null, _O.createElement(C, {
    color: "remember",
    backgroundColor: "memoryBackgroundColor"
  }, "#"), _O.createElement(C, {
    backgroundColor: "memoryBackgroundColor",
    color: "text"
  }, " ", B, " ")), _O.createElement(x0, {
    height: 1
  }, _O.createElement(C, {
    dimColor: !0
  }, G)))
}
// @from(Ln 324849, Col 4)
_O
// @from(Ln 324849, Col 8)
ET2
// @from(Ln 324849, Col 13)
zT2
// @from(Ln 324850, Col 4)
CT2 = w(() => {
  fA();
  tQ();
  c4();
  _O = c(QA(), 1), ET2 = c(HT2(), 1), zT2 = c(QA(), 1)
})
// @from(Ln 324857, Col 0)
function Vb5(A) {
  if (!A.match(/<sandbox_violations>([\s\S]*?)<\/sandbox_violations>/)) return {
    cleanedStderr: A
  };
  return {
    cleanedStderr: D71(A).trim()
  }
}
// @from(Ln 324866, Col 0)
function Fb5(A) {
  let Q = A.match(UT2);
  if (!Q) return {
    cleanedStderr: A,
    cwdResetWarning: null
  };
  let B = Q[1] ?? null;
  return {
    cleanedStderr: A.replace(UT2, "").trim(),
    cwdResetWarning: B
  }
}
// @from(Ln 324879, Col 0)
function M6A({
  content: {
    stdout: A,
    stderr: Q,
    isImage: B,
    returnCodeInterpretation: G,
    backgroundTaskId: Z
  },
  verbose: Y
}) {
  let {
    cleanedStderr: J
  } = Vb5(Q), {
    cleanedStderr: X,
    cwdResetWarning: I
  } = Fb5(J);
  if (B) return jO.default.createElement(x0, {
    height: 1
  }, jO.default.createElement(C, {
    dimColor: !0
  }, "[Image data detected and sent to Claude]"));
  return jO.default.createElement(T, {
    flexDirection: "column"
  }, A !== "" ? jO.default.createElement(Eb, {
    content: A,
    verbose: Y
  }) : null, X !== "" ? jO.default.createElement(Eb, {
    content: X,
    verbose: Y,
    isError: !0
  }) : null, I ? jO.default.createElement(x0, null, jO.default.createElement(C, {
    dimColor: !0
  }, I)) : null, A === "" && X === "" && !I ? jO.default.createElement(x0, {
    height: 1
  }, jO.default.createElement(C, {
    dimColor: !0
  }, Z ? jO.default.createElement(jO.default.Fragment, null, "Running in the background", " ", jO.default.createElement(F0, {
    shortcut: "↓",
    action: "manage",
    parens: !0
  })) : G || "(No content)")) : null)
}
// @from(Ln 324921, Col 4)
jO
// @from(Ln 324921, Col 8)
UT2
// @from(Ln 324922, Col 4)
FD1 = w(() => {
  fA();
  LKA();
  c4();
  e9();
  jO = c(QA(), 1), UT2 = /(?:^|\n)(Shell cwd was reset to .+)$/
})
// @from(Ln 324930, Col 0)
function qT2({
  content: A,
  verbose: Q
}) {
  let B = Q9(A, "bash-stdout") ?? "",
    G = Q9(A, "bash-stderr") ?? "";
  return zz0.createElement(M6A, {
    content: {
      stdout: B,
      stderr: G
    },
    verbose: !!Q
  })
}
// @from(Ln 324944, Col 4)
zz0
// @from(Ln 324945, Col 4)
NT2 = w(() => {
  FD1();
  tQ();
  zz0 = c(QA(), 1)
})
// @from(Ln 324951, Col 0)
function LT2({
  content: A
}) {
  let Q = Q9(A, "local-command-stdout"),
    B = Q9(A, "local-command-stderr");
  if (!Q && !B) return qE.createElement(x0, null, qE.createElement(C, {
    dimColor: !0
  }, JO));
  let G = [];
  if (Q?.trim()) G.push(qE.createElement(wT2, {
    key: "stdout"
  }, Q.trim()));
  if (B?.trim()) G.push(qE.createElement(wT2, {
    key: "stderr",
    isError: !0
  }, B.trim()));
  return G
}
// @from(Ln 324970, Col 0)
function wT2({
  children: A,
  isError: Q
}) {
  return qE.createElement(T, {
    flexDirection: "row"
  }, qE.createElement(C, {
    color: Q ? "error" : "text"
  }, "  ⎿  "), qE.createElement(T, {
    flexDirection: "column",
    flexGrow: 1
  }, qE.createElement(JV, null, A)))
}
// @from(Ln 324983, Col 4)
qE
// @from(Ln 324984, Col 4)
OT2 = w(() => {
  tQ();
  fA();
  c4();
  XO();
  pb();
  qE = c(QA(), 1)
})
// @from(Ln 324993, Col 0)
function R6A({
  param: {
    text: A
  },
  addMargin: Q
}) {
  let B = Q9(A, "background-task-input");
  if (!B) return null;
  return Vc.createElement(T, {
    flexDirection: "column",
    marginTop: Q ? 1 : 0,
    width: "100%"
  }, Vc.createElement(T, null, Vc.createElement(C, {
    color: "background"
  }, "&"), Vc.createElement(C, {
    dimColor: !0
  }, " ", B)))
}
// @from(Ln 325011, Col 4)
Vc
// @from(Ln 325012, Col 4)
$z0 = w(() => {
  fA();
  tQ();
  Vc = c(QA(), 1)
})
// @from(Ln 325018, Col 0)
function MT2({
  content: A
}) {
  let Q = Q9(A, "background-task-output") ?? "";
  return fkA.createElement(x0, null, fkA.createElement(C, {
    dimColor: !0
  }, Q))
}
// @from(Ln 325026, Col 4)
fkA
// @from(Ln 325027, Col 4)
RT2 = w(() => {
  fA();
  tQ();
  c4();
  fkA = c(QA(), 1)
})
// @from(Ln 325034, Col 0)
function Hb5(A) {
  switch (A) {
    case "completed":
      return "success";
    case "failed":
      return "error";
    case "killed":
      return "warning";
    default:
      return "text"
  }
}
// @from(Ln 325047, Col 0)
function _T2({
  addMargin: A,
  param: {
    text: Q
  }
}) {
  let B = Q9(Q, "summary");
  if (!B) return null;
  let G = Q9(Q, "status"),
    Z = Hb5(G);
  return _6A.createElement(T, {
    marginTop: A ? 1 : 0
  }, _6A.createElement(C, null, _6A.createElement(C, {
    color: Z
  }, xJ), " ", B))
}
// @from(Ln 325063, Col 4)
_6A
// @from(Ln 325064, Col 4)
jT2 = w(() => {
  fA();
  vS();
  tQ();
  _6A = c(QA(), 1)
})
// @from(Ln 325071, Col 0)
function HD1({
  addMargin: A,
  planContent: Q
}) {
  return Fc.createElement(T, {
    flexDirection: "column",
    borderStyle: "round",
    borderColor: "planMode",
    marginTop: A ? 1 : 0,
    paddingX: 1
  }, Fc.createElement(T, {
    marginBottom: 1
  }, Fc.createElement(C, {
    bold: !0,
    color: "planMode"
  }, "Plan to implement")), Fc.createElement(JV, null, Q))
}
// @from(Ln 325088, Col 4)
Fc
// @from(Ln 325089, Col 4)
Cz0 = w(() => {
  fA();
  pb();
  Fc = c(QA(), 1)
})
// @from(Ln 325095, Col 0)
function TT2({
  addMargin: A,
  time: Q
}) {
  let B = Eb5(Q);
  return hkA.createElement(T, {
    flexDirection: "column",
    marginTop: A ? 1 : 0,
    width: "100%"
  }, hkA.createElement(C, {
    dimColor: !0
  }, "↻ ", B))
}
// @from(Ln 325109, Col 0)
function Eb5(A) {
  let Q = new Date(A);
  if (isNaN(Q.getTime())) return A;
  return Q.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !0
  })
}
// @from(Ln 325118, Col 4)
hkA
// @from(Ln 325119, Col 4)
PT2 = w(() => {
  fA();
  hkA = c(QA(), 1)
})
// @from(Ln 325124, Col 0)
function j6A({
  addMargin: A,
  param: Q,
  verbose: B,
  thinkingMetadata: G,
  planContent: Z
}) {
  if (Q.text.trim() === JO) return null;
  if (Z) return EY.createElement(HD1, {
    addMargin: A,
    planContent: Z
  });
  let Y = Q9(Q.text, bZ0);
  if (Y) return EY.createElement(TT2, {
    addMargin: A,
    time: Y
  });
  if (Q.text.startsWith("<bash-stdout") || Q.text.startsWith("<bash-stderr")) return EY.createElement(qT2, {
    content: Q.text,
    verbose: B
  });
  if (Q.text.startsWith("<background-task-output>")) return EY.createElement(MT2, {
    content: Q.text
  });
  if (Q.text.startsWith("<local-command-stdout") || Q.text.startsWith("<local-command-stderr")) return EY.createElement(LT2, {
    content: Q.text
  });
  if (Q.text === Ss || Q.text === vN) return EY.createElement(x0, {
    height: 1
  }, EY.createElement(Hb, null));
  if (Q.text.includes("<bash-input>")) return EY.createElement(VD1, {
    addMargin: A,
    param: Q
  });
  if (Q.text.includes("<background-task-input>")) return EY.createElement(R6A, {
    addMargin: A,
    param: Q
  });
  if (Q.text.includes(`<${fz}>`)) return EY.createElement(JT2, {
    addMargin: A,
    param: Q
  });
  if (Q.text.includes("<user-memory-input>")) return EY.createElement($T2, {
    addMargin: A,
    text: Q.text
  });
  if (Q.text.includes(`<${zF}`)) return EY.createElement(_T2, {
    addMargin: A,
    param: Q
  });
  return EY.createElement(VT2, {
    addMargin: A,
    param: Q,
    thinkingMetadata: G
  })
}
// @from(Ln 325180, Col 4)
EY
// @from(Ln 325181, Col 4)
ED1 = w(() => {
  Fz0();
  XT2();
  FT2();
  XO();
  CT2();
  NKA();
  tQ();
  c4();
  NT2();
  OT2();
  $z0();
  RT2();
  jT2();
  cD();
  Cz0();
  PT2();
  tQ();
  EY = c(QA(), 1)
})
// @from(Ln 325206, Col 0)
function xT2() {
  return zD1(zQ(), ST2, q0())
}
// @from(Ln 325210, Col 0)
function yT2(A, Q) {
  if (A.existsSync(Q)) return;
  let B = zb5(Q);
  if (B !== Q) yT2(A, B);
  A.mkdirSync(Q)
}
// @from(Ln 325217, Col 0)
function $b5() {
  let A = vA(),
    Q = xT2();
  yT2(A, Q)
}
// @from(Ln 325223, Col 0)
function vT2(A, Q) {
  let B = Q.split("/")[1] || "png";
  return zD1(xT2(), `${A}.${B}`)
}
// @from(Ln 325228, Col 0)
function kT2(A) {
  if (A.type !== "image") return null;
  let Q = vT2(A.id, A.mediaType || "image/png");
  return Uz0.set(A.id, Q), Q
}
// @from(Ln 325234, Col 0)
function qz0(A) {
  if (A.type !== "image") return null;
  try {
    $b5();
    let Q = vT2(A.id, A.mediaType || "image/png");
    return bB(Q, A.content, {
      encoding: "base64",
      flush: !0,
      mode: 384
    }), Uz0.set(A.id, Q), k(`Stored image ${A.id} to ${Q}`), Q
  } catch (Q) {
    return k(`Failed to store image: ${Q}`), null
  }
}
// @from(Ln 325249, Col 0)
function bT2(A) {
  let Q = new Map;
  for (let [B, G] of Object.entries(A))
    if (G.type === "image") {
      let Z = qz0(G);
      if (Z) Q.set(Number(B), Z)
    } return Q
}
// @from(Ln 325258, Col 0)
function $D1(A) {
  return Uz0.get(A) ?? null
}
// @from(Ln 325262, Col 0)
function fT2() {
  let A = vA(),
    Q = zD1(zQ(), ST2),
    B = q0();
  try {
    if (!A.existsSync(Q)) return;
    let G = A.readdirSync(Q);
    for (let Z of G) {
      if (Z.name === B) continue;
      let Y = zD1(Q, Z.name);
      try {
        A.rmSync(Y, {
          recursive: !0,
          force: !0
        }), k(`Cleaned up old image cache: ${Y}`)
      } catch {}
    }
    try {
      if (A.isDirEmptySync(Q)) A.rmdirSync(Q)
    } catch {}
  } catch {}
}
// @from(Ln 325284, Col 4)
ST2 = "image-cache"
// @from(Ln 325285, Col 2)
Uz0
// @from(Ln 325286, Col 4)
IHA = w(() => {
  fQ();
  C0();
  DQ();
  T1();
  A0();
  Uz0 = new Map
})
// @from(Ln 325298, Col 0)
function CD1({
  imageId: A,
  addMargin: Q
}) {
  let B = A ? `[Image #${A}]` : "[Image]",
    G = A ? $D1(A) : null,
    Z = G && Sk() ? sS.createElement(i2, {
      url: Cb5(G).href
    }, sS.createElement(C, null, B)) : sS.createElement(C, null, B);
  if (Q) return sS.createElement(T, {
    marginTop: 1
  }, Z);
  return sS.createElement(x0, null, Z)
}
// @from(Ln 325312, Col 4)
sS
// @from(Ln 325313, Col 4)
Nz0 = w(() => {
  fA();
  WDA();
  IHA();
  DDA();
  c4();
  sS = c(QA(), 1)
})
// @from(Ln 325322, Col 0)
function gkA({
  param: {
    thinking: A
  },
  addMargin: Q = !1,
  isTranscriptMode: B,
  verbose: G,
  hideInTranscript: Z = !1
}) {
  let Y = J3("app:toggleTranscript", "Global", "ctrl+o");
  if (!A) return null;
  if (Z) return null;
  if (!(B || G)) return T6A.default.createElement(T, {
    marginTop: Q ? 1 : 0
  }, T6A.default.createElement(C, {
    dimColor: !0,
    italic: !0
  }, "∴ Thinking (", Y, " to expand)"));
  return T6A.default.createElement(T, {
    flexDirection: "column",
    gap: 1,
    marginTop: Q ? 1 : 0,
    width: "100%"
  }, T6A.default.createElement(C, {
    dimColor: !0,
    italic: !0
  }, "∴ Thinking…"), T6A.default.createElement(T, {
    paddingLeft: 2
  }, T6A.default.createElement(JV, null, A)))
}
// @from(Ln 325352, Col 4)
T6A
// @from(Ln 325353, Col 4)
wz0 = w(() => {
  fA();
  pb();
  NX();
  T6A = c(QA(), 1)
})
// @from(Ln 325360, Col 0)
function hT2({
  addMargin: A = !1
}) {
  return Lz0.default.createElement(T, {
    marginTop: A ? 1 : 0
  }, Lz0.default.createElement(C, {
    dimColor: !0,
    italic: !0
  }, "✻ Thinking…"))
}
// @from(Ln 325370, Col 4)
Lz0
// @from(Ln 325371, Col 4)
gT2 = w(() => {
  fA();
  Lz0 = c(QA(), 1)
})
// @from(Ln 325375, Col 0)
class tS {
  static instance;
  baseline = new Map;
  initialized = !1;
  mcpClient;
  lastProcessedTimestamps = new Map;
  rightFileDiagnosticsState = new Map;
  static getInstance() {
    if (!tS.instance) tS.instance = new tS;
    return tS.instance
  }
  initialize(A) {
    if (this.initialized) return;
    this.mcpClient = A, this.initialized = !0
  }
  async shutdown() {
    this.initialized = !1, this.baseline.clear()
  }
  reset() {
    this.baseline.clear(), this.rightFileDiagnosticsState.clear()
  }
  normalizeFileUri(A) {
    let Q = ["file://", "_claude_fs_right:", "_claude_fs_left:"],
      B = A;
    for (let G of Q)
      if (A.startsWith(G)) {
        B = A.slice(G.length);
        break
      } return UD1(B)
  }
  async ensureFileOpened(A) {
    if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected") return;
    try {
      await Hc("openFile", {
        filePath: A,
        preview: !1,
        startText: "",
        endText: "",
        selectToEndOfLine: !1,
        makeFrontmost: !1
      }, this.mcpClient)
    } catch (Q) {
      e(Q)
    }
  }
  async beforeFileEdited(A) {
    if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected") return;
    let Q = Date.now();
    try {
      let B = await Hc("getDiagnostics", {
          uri: `file://${A}`
        }, this.mcpClient),
        G = this.parseDiagnosticResult(B)[0];
      if (G) {
        if (!dT2(this.normalizeFileUri(A), this.normalizeFileUri(G.uri))) {
          e(new mT2(`Diagnostics file path mismatch: expected ${A}, got ${G.uri})`));
          return
        }
        let Z = this.normalizeFileUri(A);
        this.baseline.set(Z, G.diagnostics), this.lastProcessedTimestamps.set(Z, Q)
      } else {
        let Z = this.normalizeFileUri(A);
        this.baseline.set(Z, []), this.lastProcessedTimestamps.set(Z, Q)
      }
    } catch (B) {}
  }
  async getNewDiagnostics() {
    if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected") return [];
    let A = [];
    try {
      let Z = await Hc("getDiagnostics", {}, this.mcpClient);
      A = this.parseDiagnosticResult(Z)
    } catch (Z) {
      return []
    }
    let Q = A.filter((Z) => this.baseline.has(this.normalizeFileUri(Z.uri))).filter((Z) => Z.uri.startsWith("file://")),
      B = new Map;
    A.filter((Z) => this.baseline.has(this.normalizeFileUri(Z.uri))).filter((Z) => Z.uri.startsWith("_claude_fs_right:")).forEach((Z) => {
      B.set(this.normalizeFileUri(Z.uri), Z)
    });
    let G = [];
    for (let Z of Q) {
      let Y = this.normalizeFileUri(Z.uri),
        J = this.baseline.get(Y) || [],
        X = B.get(Y),
        I = Z;
      if (X) {
        let W = this.rightFileDiagnosticsState.get(Y);
        if (!W || !this.areDiagnosticArraysEqual(W, X.diagnostics)) I = X;
        this.rightFileDiagnosticsState.set(Y, X.diagnostics)
      }
      let D = I.diagnostics.filter((W) => !J.some((K) => this.areDiagnosticsEqual(W, K)));
      if (D.length > 0) G.push({
        uri: Z.uri,
        diagnostics: D
      });
      this.baseline.set(Y, I.diagnostics)
    }
    return G
  }
  parseDiagnosticResult(A) {
    if (Array.isArray(A)) {
      let Q = A.find((B) => B.type === "text");
      if (Q && "text" in Q) return AQ(Q.text)
    }
    return []
  }
  areDiagnosticsEqual(A, Q) {
    return A.message === Q.message && A.severity === Q.severity && A.source === Q.source && A.code === Q.code && A.range.start.line === Q.range.start.line && A.range.start.character === Q.range.start.character && A.range.end.line === Q.range.end.line && A.range.end.character === Q.range.end.character
  }
  areDiagnosticArraysEqual(A, Q) {
    if (A.length !== Q.length) return !1;
    return A.every((B) => Q.some((G) => this.areDiagnosticsEqual(B, G))) && Q.every((B) => A.some((G) => this.areDiagnosticsEqual(G, B)))
  }
  isLinterDiagnostic(A) {
    let Q = ["eslint", "eslint-plugin", "tslint", "prettier", "stylelint", "jshint", "standardjs", "xo", "rome", "biome", "deno-lint", "rubocop", "pylint", "flake8", "black", "ruff", "clippy", "rustfmt", "golangci-lint", "gofmt", "swiftlint", "detekt", "ktlint", "checkstyle", "pmd", "sonarqube", "sonarjs"];
    if (!A.source) return !1;
    let B = A.source.toLowerCase();
    return Q.some((G) => B.includes(G))
  }
  async handleQueryStart(A) {
    if (!this.initialized) {
      let Q = nN(A);
      if (Q) this.initialize(Q)
    } else this.reset()
  }
  static formatDiagnosticsSummary(A) {
    let B = A.map((G) => {
      let Z = G.uri.split("/").pop() || G.uri,
        Y = G.diagnostics.map((J) => {
          return `  ${tS.getSeveritySymbol(J.severity)} [Line ${J.range.start.line+1}:${J.range.start.character+1}] ${J.message}${J.code?` [${J.code}]`:""}${J.source?` (${J.source})`:""}`
        }).join(`
`);
      return `${Z}:
${Y}`
    }).join(`

`);
    if (B.length > uT2) return B.slice(0, uT2 - 12) + "…[truncated]";
    return B
  }
  static getSeveritySymbol(A) {
    return {
      Error: tA.cross,
      Warning: tA.warning,
      Info: tA.info,
      Hint: tA.star
    } [A] || tA.bullet
  }
}
// @from(Ln 325525, Col 4)
mT2
// @from(Ln 325525, Col 9)
uT2 = 4000
// @from(Ln 325526, Col 2)
Ec
// @from(Ln 325527, Col 4)
P6A = w(() => {
  jN();
  TX();
  v1();
  XX();
  B2();
  A0();
  y9();
  mT2 = class mT2 extends rUA {};
  Ec = tS.getInstance()
})
// @from(Ln 325542, Col 0)
function cT2({
  attachment: A,
  verbose: Q
}) {
  let B = J3("app:toggleTranscript", "Global", "ctrl+o");
  if (A.files.length === 0) return null;
  let G = A.files.reduce((Y, J) => Y + J.diagnostics.length, 0),
    Z = A.files.length;
  if (Q) return TO.default.createElement(T, {
    flexDirection: "column"
  }, A.files.map((Y, J) => TO.default.createElement(TO.default.Fragment, {
    key: J
  }, TO.default.createElement(x0, null, TO.default.createElement(C, {
    dimColor: !0,
    wrap: "wrap"
  }, TO.default.createElement(C, {
    bold: !0
  }, Ub5(o1(), Y.uri.replace("file://", "").replace("_claude_fs_right:", ""))), " ", TO.default.createElement(C, {
    dimColor: !0
  }, Y.uri.startsWith("file://") ? "(file://)" : Y.uri.startsWith("_claude_fs_right:") ? "(claude_fs_right)" : `(${Y.uri.split(":")[0]})`), ":")), Y.diagnostics.map((X, I) => TO.default.createElement(x0, {
    key: I
  }, TO.default.createElement(C, {
    dimColor: !0,
    wrap: "wrap"
  }, "  ", tS.getSeveritySymbol(X.severity), " [Line ", X.range.start.line + 1, ":", X.range.start.character + 1, "] ", X.message, X.code ? ` [${X.code}]` : "", X.source ? ` (${X.source})` : ""))))));
  else return TO.default.createElement(x0, null, TO.default.createElement(C, {
    dimColor: !0,
    wrap: "wrap"
  }, "Found ", TO.default.createElement(C, {
    bold: !0
  }, G), " new diagnostic", " ", G === 1 ? "issue" : "issues", " in ", Z, " ", Z === 1 ? "file" : "files", " (", B, " to expand)"))
}
// @from(Ln 325574, Col 4)
TO
// @from(Ln 325575, Col 4)
pT2 = w(() => {
  fA();
  V2();
  c4();
  P6A();
  NX();
  TO = c(QA(), 1)
})
// @from(Ln 325588, Col 0)
function lT2({
  attachment: A,
  addMargin: Q,
  verbose: B
}) {
  let [{
    tasks: G
  }] = a0();
  switch (A.type) {
    case "directory":
      return D3.default.createElement(AW, null, "Listed directory", " ", D3.default.createElement(C, {
        bold: !0
      }, DHA(o1(), A.path) + qb5));
    case "file":
    case "already_read_file":
      if (A.content.type === "notebook") return D3.default.createElement(AW, null, "Read ", D3.default.createElement(C, {
        bold: !0
      }, DHA(o1(), A.filename)), " (", A.content.file.cells.length, " cells)");
      return D3.default.createElement(AW, null, "Read ", D3.default.createElement(C, {
        bold: !0
      }, DHA(o1(), A.filename)), " (", A.content.type === "text" ? `${A.content.file.numLines}${A.truncated?"+":""} lines` : xD(A.content.file.originalSize), ")");
    case "compact_file_reference":
      return D3.default.createElement(AW, null, "Referenced file", " ", D3.default.createElement(C, {
        bold: !0
      }, DHA(o1(), A.filename)));
    case "selected_lines_in_ide":
      return D3.default.createElement(AW, null, "⧉ Selected", " ", D3.default.createElement(C, {
        bold: !0
      }, A.lineEnd - A.lineStart + 1), " ", "lines from ", D3.default.createElement(C, {
        bold: !0
      }, DHA(o1(), A.filename)), " ", "in ", A.ideName);
    case "nested_memory":
      return D3.default.createElement(AW, null, "Loaded ", D3.default.createElement(C, {
        bold: !0
      }, DHA(o1(), A.path)));
    case "queued_command": {
      let Z = typeof A.prompt === "string" ? A.prompt : S6A(A.prompt) || "",
        Y = A.imagePasteIds && A.imagePasteIds.length > 0;
      return D3.default.createElement(T, {
        flexDirection: "column"
      }, D3.default.createElement(j6A, {
        addMargin: Q,
        param: {
          text: Z,
          type: "text"
        },
        verbose: B
      }), Y && A.imagePasteIds?.map((J) => D3.default.createElement(CD1, {
        key: J,
        imageId: J
      })))
    }
    case "todo":
      if (A.context === "post-compact") return D3.default.createElement(AW, null, "Todo list read (", A.itemCount, " ", A.itemCount === 1 ? "item" : "items", ")");
      return null;
    case "plan_file_reference":
      return D3.default.createElement(AW, null, "Plan file referenced (", k6(A.planFilePath), ")");
    case "invoked_skills": {
      if (A.skills.length === 0) return null;
      let Z = A.skills.map((Y) => Y.name).join(", ");
      return D3.default.createElement(AW, null, "Skills restored (", Z, ")")
    }
    case "diagnostics":
      return D3.default.createElement(cT2, {
        attachment: A,
        verbose: B
      });
    case "mcp_resource":
      return D3.default.createElement(AW, null, "Read MCP resource ", D3.default.createElement(C, {
        bold: !0
      }, A.name), " from", " ", A.server);
    case "command_permissions":
      return null;
    case "async_hook_response": {
      if (A.hookEvent === "SessionStart" && !B) return null;
      let Z = A.response;
      return D3.default.createElement(AW, null, "Async hook ", D3.default.createElement(C, {
        bold: !0
      }, A.hookEvent), " completed", B && D3.default.createElement(D3.default.Fragment, null, ":", `
`, Z.systemMessage ? Z.systemMessage : Z.hookSpecificOutput && ("additionalContext" in Z.hookSpecificOutput) && Z.hookSpecificOutput.additionalContext ? Z.hookSpecificOutput.additionalContext : null))
    }
    case "hook_blocking_error": {
      if (A.hookEvent === "Stop" || A.hookEvent === "SubagentStop") return null;
      if (B) return D3.default.createElement(AW, {
        color: "error"
      }, A.hookName, " hook returned blocking error:", " ", A.blockingError.blockingError);
      return D3.default.createElement(AW, {
        color: "error"
      }, A.hookName, " hook returned blocking error")
    }
    case "hook_non_blocking_error": {
      if (A.hookEvent === "Stop" || A.hookEvent === "SubagentStop") return null;
      if (B) return D3.default.createElement(AW, {
        color: "error"
      }, A.hookName, " hook error: ", A.stderr);
      return D3.default.createElement(AW, {
        color: "error"
      }, A.hookName, " hook error")
    }
    case "hook_error_during_execution":
      if (A.hookEvent === "Stop" || A.hookEvent === "SubagentStop") return null;
      if (B) return D3.default.createElement(AW, null, A.hookName, " hook warning: ", A.content);
      return D3.default.createElement(AW, null, A.hookName, " hook warning");
    case "hook_success":
      if (A.hookEvent === "Stop" || A.hookEvent === "SubagentStop") return null;
      if (B) return D3.default.createElement(AW, null, A.hookName, " hook succeeded", A.content ? `: ${A.content}` : "");
      return null;
    case "hook_stopped_continuation":
      if (A.hookEvent === "Stop" || A.hookEvent === "SubagentStop") return null;
      return D3.default.createElement(AW, {
        color: "warning"
      }, A.hookName, " hook stopped continuation: ", A.message);
    case "hook_system_message":
      return D3.default.createElement(AW, null, A.hookName, " says: ", A.content);
    case "hook_permission_decision": {
      let Z = A.decision === "allow" ? "Allowed" : "Denied";
      return D3.default.createElement(AW, null, Z, " by ", D3.default.createElement(C, {
        bold: !0
      }, A.hookEvent), " hook")
    }
    case "task_status": {
      let Z = A.status === "completed" ? "completed in background" : A.status;
      return D3.default.createElement(T, {
        flexDirection: "row",
        width: "100%",
        marginTop: 1
      }, D3.default.createElement(C, {
        dimColor: !0
      }, xJ, " "), D3.default.createElement(C, {
        dimColor: !0
      }, 'Task "', D3.default.createElement(C, {
        bold: !0
      }, A.description), '"', " ", Z))
    }
    case "task_progress":
      return null;
    case "agent_mention":
    case "budget_usd":
    case "critical_system_reminder":
    case "delegate_mode":
    case "delegate_mode_exit":
    case "edited_image_file":
    case "edited_text_file":
    case "hook_additional_context":
    case "hook_cancelled":
    case "memory":
    case "opened_file_in_ide":
    case "output_style":
    case "plan_mode":
    case "plan_mode_exit":
    case "plan_mode_reentry":
    case "structured_output":
    case "team_context":
    case "todo_reminder":
    case "ultramemory":
    case "token_usage":
      return null
  }
}
// @from(Ln 325748, Col 0)
function AW({
  dimColor: A = !0,
  children: Q,
  color: B
}) {
  return D3.default.createElement(x0, null, D3.default.createElement(C, {
    color: B,
    dimColor: A,
    wrap: "wrap"
  }, Q))
}
// @from(Ln 325759, Col 4)
D3
// @from(Ln 325760, Col 4)
iT2 = w(() => {
  fA();
  hB();
  y9();
  c4();
  V2();
  ED1();
  pT2();
  tQ();
  Nz0();
  mH0();
  A0();
  vS();
  D3 = c(QA(), 1)
})
// @from(Ln 325775, Col 4)
nT2
// @from(Ln 325776, Col 4)
aT2 = w(() => {
  nT2 = ["Baked", "Brewed", "Churned", "Cogitated", "Cooked", "Crunched", "Sautéed", "Worked"]
})
// @from(Ln 325780, Col 0)
function oT2({
  message: {
    retryAttempt: A,
    error: Q,
    retryInMs: B,
    maxRetries: G
  }
}) {
  let [Z, Y] = qD1.useState(0);
  if (XZ(() => Y((X) => X + 1000), 1000), qD1.useEffect(() => Y(0), []), A < 4) return null;
  let J = Math.max(0, Math.round((B - Z) / 1000));
  return zc.createElement(x0, null, zc.createElement(T, {
    flexDirection: "column"
  }, zc.createElement(C, {
    color: "error"
  }, irB(Q)), zc.createElement(C, {
    dimColor: !0
  }, "Retrying in ", J, " ", J === 1 ? "second" : "seconds", "… (attempt", " ", A, "/", G, ")", process.env.API_TIMEOUT_MS ? ` · API_TIMEOUT_MS=${process.env.API_TIMEOUT_MS}ms, try increasing it` : "")))
}
// @from(Ln 325799, Col 4)
zc
// @from(Ln 325799, Col 8)
qD1
// @from(Ln 325800, Col 4)
rT2 = w(() => {
  c4();
  fA();
  _9A();
  oK();
  zc = c(QA(), 1), qD1 = c(QA(), 1)
})
// @from(Ln 325808, Col 0)
function tT2({
  message: A,
  addMargin: Q,
  verbose: B
}) {
  if (A.subtype === "turn_duration") return O6.createElement(Lb5, {
    message: A,
    addMargin: Q
  });
  if (A.subtype !== "stop_hook_summary" && !B && A.level === "info") return null;
  if (A.subtype === "api_error") return O6.createElement(oT2, {
    message: A
  });
  if (A.subtype === "stop_hook_summary") return O6.createElement(Nb5, {
    message: A,
    addMargin: Q,
    verbose: B
  });
  let Z = A.content;
  return O6.createElement(T, {
    flexDirection: "row",
    width: "100%"
  }, O6.createElement(wb5, {
    content: Z,
    addMargin: Q,
    dot: A.level !== "info",
    color: A.level === "warning" ? "warning" : void 0,
    dimColor: A.level === "info"
  }))
}
// @from(Ln 325839, Col 0)
function Nb5({
  message: A,
  addMargin: Q,
  verbose: B
}) {
  let {
    hookCount: G,
    hookInfos: Z,
    hookErrors: Y,
    preventedContinuation: J,
    stopReason: X
  } = A, {
    columns: I
  } = ZB();
  if (Y.length === 0 && !J) return null;
  return O6.createElement(T, {
    flexDirection: "row",
    marginTop: Q ? 1 : 0,
    width: "100%"
  }, O6.createElement(T, {
    minWidth: 2
  }, O6.createElement(C, null, xJ)), O6.createElement(T, {
    flexDirection: "column",
    width: I - 10
  }, O6.createElement(C, null, "Ran ", O6.createElement(C, {
    bold: !0
  }, G), " stop", " ", G === 1 ? "hook" : "hooks"), B && Z.length > 0 && Z.map((D, W) => O6.createElement(C, {
    key: `cmd-${W}`
  }, "⎿  ", D.command === "prompt" ? `prompt: ${D.promptText||""}` : `command: ${D.command}`)), J && X && O6.createElement(C, null, "⎿  ", X), Y.length > 0 && Y.map((D, W) => O6.createElement(C, {
    key: W
  }, "⎿  Stop hook error: ", D))))
}
// @from(Ln 325872, Col 0)
function wb5({
  content: A,
  addMargin: Q,
  dot: B,
  color: G,
  dimColor: Z
}) {
  let {
    columns: Y
  } = ZB();
  return O6.createElement(T, {
    flexDirection: "row",
    marginTop: Q ? 1 : 0,
    width: "100%"
  }, B && O6.createElement(T, {
    minWidth: 2
  }, O6.createElement(C, {
    color: G,
    dimColor: Z
  }, xJ)), O6.createElement(T, {
    flexDirection: "column",
    width: Y - 10
  }, O6.createElement(C, {
    color: G,
    dimColor: Z,
    wrap: "wrap"
  }, A.trim())))
}
// @from(Ln 325901, Col 0)
function Lb5({
  message: A,
  addMargin: Q
}) {
  let [B] = sT2.useState(() => Wg(nT2) ?? "Worked");
  if (!(L1().showTurnDuration ?? !0)) return null;
  let Z = QI(A.durationMs);
  return O6.createElement(T, {
    flexDirection: "row",
    marginTop: Q ? 1 : 0,
    width: "100%"
  }, O6.createElement(T, {
    minWidth: 2
  }, O6.createElement(C, {
    dimColor: !0
  }, IZ2)), O6.createElement(C, {
    dimColor: !0
  }, B, " for ", Z))
}
// @from(Ln 325920, Col 4)
O6
// @from(Ln 325920, Col 8)
sT2
// @from(Ln 325921, Col 4)
eT2 = w(() => {
  fA();
  HUA();
  vS();
  aT2();
  P4();
  rT2();
  GQ();
  O6 = c(QA(), 1), sT2 = c(QA(), 1)
})
// @from(Ln 325932, Col 0)
function AP2() {
  let {
    columns: A
  } = ZB(), Q = J3("app:toggleTranscript", "Global", "ctrl+o");
  return Oz0.createElement(K8, {
    dividerChar: "═",
    title: `Conversation compacted · ${Q} for history`,
    width: A
  })
}
// @from(Ln 325942, Col 4)
Oz0
// @from(Ln 325943, Col 4)
QP2 = w(() => {
  lD();
  P4();
  NX();
  Oz0 = c(QA(), 1)
})
// @from(Ln 325950, Col 0)
function BP2({
  message: A,
  tools: Q,
  normalizedMessages: B,
  resolvedToolUseIDs: G,
  erroredToolUseIDs: Z,
  inProgressToolUseIDs: Y,
  shouldAnimate: J
}) {
  let X = Q.find((K) => K.name === A.toolName);
  if (!X?.renderGroupedToolUse) return null;
  let I = new Map;
  for (let K of A.results)
    for (let V of K.message.content)
      if (V.type === "tool_result") I.set(V.tool_use_id, {
        param: V,
        output: K.toolUseResult
      });
  let D = A.messages.map((K) => {
      let V = K.message.content[0],
        F = I.get(V.id);
      return {
        param: V,
        isResolved: G.has(V.id),
        isError: Z.has(V.id),
        isInProgress: Y.has(V.id),
        progressMessages: la(B.filter((H) => H.type === "progress" && H.parentToolUseID === V.id)),
        result: F
      }
    }),
    W = D.some((K) => K.isInProgress);
  return X.renderGroupedToolUse(D, {
    shouldAnimate: J && W,
    tools: Q
  })
}
// @from(Ln 325986, Col 4)
GP2 = () => {}
// @from(Ln 325988, Col 0)
function JP2(A, Q, B) {
  let G = K91(B, A);
  if (!G?.isSearchOrReadCommand) return {
    isCollapsible: !1,
    isSearch: !1,
    isRead: !1
  };
  let Z = G.isSearchOrReadCommand(Q);
  return {
    isCollapsible: Z.isSearch || Z.isRead,
    isSearch: Z.isSearch,
    isRead: Z.isRead
  }
}
// @from(Ln 326003, Col 0)
function ukA(A, Q) {
  if (A?.type === "tool_use" && A.name) {
    let B = JP2(A.name, A.input, Q);
    if (B.isCollapsible) return {
      isSearch: B.isSearch,
      isRead: B.isRead
    }
  }
  return null
}
// @from(Ln 326014, Col 0)
function ND1(A, Q, B) {
  return JP2(A, Q, B).isCollapsible
}
// @from(Ln 326018, Col 0)
function Ob5(A, Q) {
  if (A.type === "assistant") {
    let B = A.message.content[0],
      G = ukA(B, Q);
    if (G && B?.type === "tool_use") return {
      name: B.name,
      input: B.input,
      ...G
    }
  }
  if (A.type === "grouped_tool_use") {
    let B = A.messages[0]?.message.content[0],
      G = ukA(B ? {
        type: "tool_use",
        name: A.toolName,
        input: B.input
      } : void 0, Q);
    if (G && B?.type === "tool_use") return {
      name: A.toolName,
      input: B.input,
      ...G
    }
  }
  return null
}
// @from(Ln 326044, Col 0)
function Mb5(A) {
  if (A.type === "assistant") {
    let Q = A.message.content[0];
    if (Q?.type === "text" && Q.text.trim().length > 0) return !0
  }
  return !1
}
// @from(Ln 326052, Col 0)
function Rb5(A, Q) {
  if (A.type === "assistant") {
    let B = A.message.content[0];
    if (B?.type === "tool_use" && !ND1(B.name, B.input, Q)) return !0
  }
  if (A.type === "grouped_tool_use") {
    let B = A.messages[0]?.message.content[0];
    if (B?.type === "tool_use" && !ND1(A.toolName, B.input, Q)) return !0
  }
  return !1
}
// @from(Ln 326064, Col 0)
function _b5(A) {
  if (A.type === "assistant") {
    let Q = A.message.content[0];
    if (Q?.type === "thinking" || Q?.type === "redacted_thinking") return !0
  }
  if (A.type === "attachment") return !0;
  if (A.type === "system") return !0;
  return !1
}
// @from(Ln 326074, Col 0)
function jb5(A, Q) {
  if (A.type === "assistant") {
    let B = A.message.content[0];
    return B?.type === "tool_use" && ND1(B.name, B.input, Q)
  }
  if (A.type === "grouped_tool_use") {
    let B = A.messages[0]?.message.content[0];
    return B?.type === "tool_use" && ND1(A.toolName, B.input, Q)
  }
  return !1
}
// @from(Ln 326086, Col 0)
function Tb5(A, Q) {
  if (A.type === "user") {
    let B = A.message.content.filter((G) => G.type === "tool_result");
    return B.length > 0 && B.every((G) => Q.has(G.tool_use_id))
  }
  return !1
}
// @from(Ln 326094, Col 0)
function XP2(A) {
  if (A.type === "assistant") {
    let Q = A.message.content[0];
    if (Q?.type === "tool_use") return [Q.id]
  }
  if (A.type === "grouped_tool_use") return A.messages.map((Q) => {
    let B = Q.message.content[0];
    return B.type === "tool_use" ? B.id : ""
  }).filter(Boolean);
  return []
}
// @from(Ln 326106, Col 0)
function Mz0(A) {
  let Q = [];
  for (let B of A.messages) Q.push(...XP2(B));
  return Q
}
// @from(Ln 326112, Col 0)
function IP2(A, Q) {
  return Mz0(A).some((B) => Q.has(B))
}
// @from(Ln 326116, Col 0)
function DP2(A) {
  let Q = A.displayMessage;
  if (Q.type === "grouped_tool_use") return Q.displayMessage;
  return Q
}
// @from(Ln 326122, Col 0)
function ZP2(A) {
  if (A.type === "grouped_tool_use") return A.messages.length;
  return 1
}
// @from(Ln 326127, Col 0)
function Pb5(A) {
  let Q = [];
  if (A.type === "assistant") {
    let B = A.message.content[0];
    if (B?.type === "tool_use") {
      let G = B.input;
      if (G?.file_path) Q.push(G.file_path)
    }
  } else if (A.type === "grouped_tool_use")
    for (let B of A.messages) {
      let G = B.message.content[0];
      if (G?.type === "tool_use") {
        let Z = G.input;
        if (Z?.file_path) Q.push(Z.file_path)
      }
    }
  return Q
}
// @from(Ln 326146, Col 0)
function YP2() {
  return {
    messages: [],
    searchCount: 0,
    readFilePaths: new Set,
    readOperationCount: 0,
    toolUseIds: new Set
  }
}
// @from(Ln 326156, Col 0)
function Sb5(A) {
  let Q = A.messages[0],
    B = A.readFilePaths.size + A.readOperationCount;
  return {
    type: "collapsed_read_search",
    searchCount: A.searchCount,
    readCount: B,
    messages: A.messages,
    displayMessage: Q,
    uuid: `collapsed-${Q.uuid}`,
    timestamp: Q.timestamp
  }
}
// @from(Ln 326170, Col 0)
function WP2(A, Q, B) {
  return A;

  function J() {
    if (Z.messages.length === 0) return;
    G.push(Sb5(Z));
    for (let X of Y) G.push(X);
    Y = [], Z = YP2()
  }
}
// @from(Ln 326181, Col 0)
function KP2(A, Q, B) {
  let G = [];
  if (A > 0) {
    let Y = B ? "Searching for" : "Searched for";
    G.push(`${Y} ${A} ${A===1?"pattern":"patterns"}`)
  }
  if (Q > 0) {
    let Y = B ? G.length === 0 ? "Reading" : "reading" : G.length === 0 ? "Read" : "read";
    G.push(`${Y} ${Q} ${Q===1?"file":"files"}`)
  }
  let Z = G.join(", ");
  return B ? `${Z}…` : Z
}
// @from(Ln 326194, Col 4)
wD1 = () => {}
// @from(Ln 326196, Col 0)
function xb5({
  content: A,
  tools: Q,
  normalizedMessages: B,
  resolvedToolUseIDs: G,
  erroredToolUseIDs: Z,
  inProgressToolUseIDs: Y,
  shouldAnimate: J,
  theme: X
}) {
  let I = Q.find((M) => M.name === A.name);
  if (!I) return null;
  let D = G.has(A.id),
    W = Z.has(A.id),
    K = Y.has(A.id),
    V = B.find((M) => M.type === "user" && M.message.content.some((_) => _.type === "tool_result" && _.tool_use_id === A.id)),
    F = V?.type === "user" ? V.toolUseResult : void 0,
    H = I.outputSchema?.safeParse(F),
    E = H?.success ? H.data : void 0,
    z = I.inputSchema.safeParse(A.input),
    $ = z.success ? z.data : void 0,
    O = I.userFacingName($),
    L = $ ? I.renderToolUseMessage($, {
      theme: X,
      verbose: !1
    }) : null;
  return DV.default.createElement(T, {
    key: A.id,
    flexDirection: "column",
    marginTop: 1
  }, DV.default.createElement(T, {
    flexDirection: "row"
  }, DV.default.createElement(k4A, {
    shouldAnimate: J && K,
    isUnresolved: !D,
    isError: W
  }), DV.default.createElement(C, {
    bold: !0
  }, O), L && DV.default.createElement(C, null, "(", L, ")"), $ && I.renderToolUseTag?.($)), D && !W && E !== void 0 && DV.default.createElement(T, null, I.renderToolResultMessage(E, [], {
    verbose: !1,
    tools: Q,
    theme: X
  })))
}
// @from(Ln 326241, Col 0)
function VP2({
  message: A,
  resolvedToolUseIDs: Q,
  erroredToolUseIDs: B,
  inProgressToolUseIDs: G,
  shouldAnimate: Z,
  verbose: Y,
  tools: J,
  normalizedMessages: X,
  isActiveGroup: I
}) {
  let {
    searchCount: D,
    readCount: W,
    messages: K
  } = A, [V] = oB(), F = Mz0(A).some((E) => B.has(E));
  if (Y) {
    let E = [];
    for (let z of K)
      if (z.type === "assistant") E.push(z);
      else if (z.type === "grouped_tool_use") E.push(...z.messages);
    return DV.default.createElement(T, {
      flexDirection: "column"
    }, E.map((z) => {
      let $ = z.message.content[0];
      if ($?.type !== "tool_use") return null;
      return DV.default.createElement(xb5, {
        key: $.id,
        content: $,
        tools: J,
        normalizedMessages: X,
        resolvedToolUseIDs: Q,
        erroredToolUseIDs: B,
        inProgressToolUseIDs: G,
        shouldAnimate: Z,
        theme: V
      })
    }))
  }
  if (D === 0 && W === 0) return null;
  let H = [];
  if (D > 0) {
    let E = I ? "Searching for" : "Searched for";
    H.push(DV.default.createElement(C, {
      key: "search"
    }, E, " ", DV.default.createElement(C, {
      bold: !0
    }, D), " ", D === 1 ? "pattern" : "patterns"))
  }
  if (W > 0) {
    let E = I ? H.length === 0 ? "Reading" : "reading" : H.length === 0 ? "Read" : "read";
    if (H.length > 0) H.push(DV.default.createElement(C, {
      key: "comma"
    }, ", "));
    H.push(DV.default.createElement(C, {
      key: "read"
    }, E, " ", DV.default.createElement(C, {
      bold: !0
    }, W), " ", W === 1 ? "file" : "files"))
  }
  if (I) H.push(DV.default.createElement(C, {
    key: "ellipsis"
  }, "…"));
  return DV.default.createElement(T, {
    flexDirection: "row",
    marginTop: 1
  }, DV.default.createElement(k4A, {
    shouldAnimate: !!I,
    isUnresolved: !!I,
    isError: F
  }), DV.default.createElement(C, null, H, " ", DV.default.createElement(VS, null)))
}
// @from(Ln 326313, Col 4)
DV
// @from(Ln 326314, Col 4)
FP2 = w(() => {
  fA();
  rY1();
  Gr();
  wD1();
  DV = c(QA(), 1)
})
// @from(Ln 326322, Col 0)
function yb5({
  message: A,
  messages: Q,
  addMargin: B,
  tools: G,
  commands: Z,
  verbose: Y,
  erroredToolUseIDs: J,
  inProgressToolUseIDs: X,
  resolvedToolUseIDs: I,
  progressMessagesForMessage: D,
  shouldAnimate: W,
  shouldShowDot: K,
  style: V,
  width: F,
  isTranscriptMode: H,
  onOpenRateLimitOptions: E,
  isActiveCollapsedGroup: z,
  isUserContinuation: $ = !1,
  lastThinkingBlockId: O
}) {
  switch (A.type) {
    case "attachment":
      return K5.createElement(lT2, {
        addMargin: B,
        attachment: A.attachment,
        verbose: Y
      });
    case "assistant":
      return K5.createElement(T, {
        flexDirection: "column",
        width: "100%"
      }, A.message.content.map((L, M) => K5.createElement(kb5, {
        key: M,
        param: L,
        addMargin: B,
        tools: G,
        commands: Z,
        verbose: Y,
        erroredToolUseIDs: J,
        inProgressToolUseIDs: X,
        resolvedToolUseIDs: I,
        progressMessagesForMessage: D,
        shouldAnimate: W,
        shouldShowDot: K,
        width: F,
        inProgressToolCallCount: X.size,
        isTranscriptMode: H,
        messages: Q,
        onOpenRateLimitOptions: E,
        thinkingBlockId: `${A.uuid}:${M}`,
        lastThinkingBlockId: O
      })));
    case "user": {
      let L = 0;
      return K5.createElement(T, {
        flexDirection: "column",
        width: "100%"
      }, A.message.content.map((M, _) => {
        let j;
        if (M.type === "image") j = A.imagePasteIds?.[L], L++;
        return K5.createElement(vb5, {
          key: _,
          message: A,
          addMargin: B,
          tools: G,
          progressMessagesForMessage: D,
          param: M,
          style: V,
          verbose: Y,
          imageIndex: j ?? L,
          isUserContinuation: $,
          messages: Q
        })
      }))
    }
    case "system":
      if (A.subtype === "compact_boundary") return K5.createElement(AP2, null);
      if (A.subtype === "local_command") return K5.createElement(j6A, {
        addMargin: B,
        param: {
          type: "text",
          text: A.content
        },
        verbose: Y
      });
      return K5.createElement(tT2, {
        message: A,
        addMargin: B,
        verbose: Y
      });
    case "grouped_tool_use":
      return K5.createElement(BP2, {
        message: A,
        tools: G,
        normalizedMessages: Q,
        resolvedToolUseIDs: I,
        erroredToolUseIDs: J,
        inProgressToolUseIDs: X,
        shouldAnimate: W
      });
    case "collapsed_read_search":
      return K5.createElement(VP2, {
        message: A,
        resolvedToolUseIDs: I,
        erroredToolUseIDs: J,
        inProgressToolUseIDs: X,
        shouldAnimate: W,
        verbose: Y,
        tools: G,
        normalizedMessages: Q,
        isActiveGroup: z
      })
  }
}
// @from(Ln 326438, Col 0)
function vb5({
  message: A,
  addMargin: Q,
  tools: B,
  progressMessagesForMessage: G,
  param: Z,
  style: Y,
  verbose: J,
  imageIndex: X,
  isUserContinuation: I,
  messages: D
}) {
  let {
    columns: W
  } = ZB();
  switch (Z.type) {
    case "text":
      return K5.createElement(j6A, {
        addMargin: Q,
        param: Z,
        verbose: J,
        thinkingMetadata: A.thinkingMetadata,
        planContent: A.planContent
      });
    case "image":
      return K5.createElement(CD1, {
        imageId: X,
        addMargin: Q && !I
      });
    case "tool_result":
      return K5.createElement(JZ2, {
        param: Z,
        message: A,
        messages: D,
        progressMessagesForMessage: G,
        style: Y,
        tools: B,
        verbose: J,
        width: W - 5
      });
    default:
      return
  }
}
// @from(Ln 326483, Col 0)
function kb5({
  param: A,
  addMargin: Q,
  tools: B,
  commands: G,
  verbose: Z,
  erroredToolUseIDs: Y,
  inProgressToolUseIDs: J,
  resolvedToolUseIDs: X,
  progressMessagesForMessage: I,
  shouldAnimate: D,
  shouldShowDot: W,
  width: K,
  inProgressToolCallCount: V,
  isTranscriptMode: F,
  messages: H,
  onOpenRateLimitOptions: E,
  thinkingBlockId: z,
  lastThinkingBlockId: $
}) {
  switch (A.type) {
    case "tool_use":
      return K5.createElement(VZ2, {
        param: A,
        addMargin: Q,
        tools: B,
        commands: G,
        verbose: Z,
        erroredToolUseIDs: Y,
        inProgressToolUseIDs: J,
        resolvedToolUseIDs: X,
        progressMessagesForMessage: I,
        shouldAnimate: D,
        shouldShowDot: W,
        inProgressToolCallCount: V,
        messages: H
      });
    case "text":
      return K5.createElement(ZT2, {
        param: A,
        addMargin: Q,
        shouldShowDot: W,
        width: K,
        onOpenRateLimitOptions: E
      });
    case "redacted_thinking":
      if (!F && !Z) return null;
      return K5.createElement(hT2, {
        addMargin: Q
      });
    case "thinking": {
      if (!F && !Z) return null;
      return K5.createElement(gkA, {
        addMargin: Q,
        param: A,
        isTranscriptMode: F,
        verbose: Z,
        hideInTranscript: F && !(!$ || z === $)
      })
    }
    default:
      return e(Error(`Unable to render message type: ${A.type}`)), null
  }
}
// @from(Ln 326548, Col 0)
function bb5(A, Q) {
  if (A.message.uuid !== Q.message.uuid) return !1;
  if (A.lastThinkingBlockId !== Q.lastThinkingBlockId) return !1;
  if (A.isStatic && Q.isStatic) return !0;
  return !1
}
// @from(Ln 326554, Col 4)
K5
// @from(Ln 326554, Col 8)
PO
// @from(Ln 326555, Col 4)
x6A = w(() => {
  fA();
  v1();
  XZ2();
  FZ2();
  YT2();
  ED1();
  Nz0();
  wz0();
  gT2();
  P4();
  iT2();
  eT2();
  QP2();
  GP2();
  FP2();
  K5 = c(QA(), 1);
  PO = K5.memo(yb5, bb5)
})
// @from(Ln 326575, Col 0)
function HP2({
  agentType: A,
  description: Q,
  toolUseCount: B,
  tokens: G,
  color: Z,
  isLast: Y,
  isResolved: J,
  isError: X,
  isAsync: I = !1,
  shouldAnimate: D,
  lastToolInfo: W,
  hideType: K = !1
}) {
  let V = Y ? "└─" : "├─",
    F = I && J,
    H = () => {
      if (!J) return W || "Initializing…";
      if (F) return d8.createElement(C, null, "Running in the background", " ", d8.createElement(F0, {
        shortcut: "↓",
        action: "manage",
        parens: !0
      }));
      return "Done"
    };
  return d8.createElement(T, {
    flexDirection: "column"
  }, d8.createElement(T, {
    paddingLeft: 3
  }, d8.createElement(C, {
    dimColor: !J
  }, V, " ", K ? d8.createElement(C, {
    bold: !0
  }, Q || A) : d8.createElement(d8.Fragment, null, d8.createElement(C, {
    bold: !0,
    backgroundColor: Z,
    color: Z ? "inverseText" : void 0
  }, A), Q && d8.createElement(C, null, " (", Q, ")")), !F && d8.createElement(d8.Fragment, null, " · ", B, " tool ", B === 1 ? "use" : "uses", G !== null && d8.createElement(d8.Fragment, null, " · ", X8(G), " tokens")))), d8.createElement(T, {
    paddingLeft: 3,
    flexDirection: "row"
  }, d8.createElement(C, {
    dimColor: !J
  }, Y ? " " : "│"), d8.createElement(x0, null, d8.createElement(C, {
    dimColor: !0
  }, H()))))
}
// @from(Ln 326621, Col 4)
d8
// @from(Ln 326622, Col 4)
EP2 = w(() => {
  fA();
  c4();
  e9();
  d8 = c(QA(), 1)
})
// @from(Ln 326629, Col 0)
function hb5(A, Q) {
  let B = A.data.message;
  if (B.type === "assistant") return ukA(B.message.content[0], Q);
  if (B.type === "user") {
    let G = B.message.content[0];
    if (G?.type === "tool_result") {
      let Z = G.tool_use_id;
      for (let Y of A.data.normalizedMessages)
        if (Y.type === "assistant") {
          let J = Y.message.content.find((X) => X.type === "tool_use" && X.id === Z);
          if (J) return ukA(J, Q)
        }
    }
  }
  return null
}
// @from(Ln 326646, Col 0)
function gb5(A, Q, B) {
  return A.map((J) => ({
    type: "original",
    message: J
  }));

  function Y(J) {
    if (Z && (Z.searchCount > 0 || Z.readCount > 0)) G.push({
      type: "summary",
      searchCount: Z.searchCount,
      readCount: Z.readCount,
      uuid: `summary-${Z.startUuid}`,
      isActive: J
    });
    Z = null
  }
}
// @from(Ln 326664, Col 0)
function mkA({
  prompt: A,
  dim: Q = !1
}) {
  return n0.createElement(T, {
    flexDirection: "column"
  }, n0.createElement(C, {
    color: "success",
    bold: !0
  }, "Prompt:"), n0.createElement(T, {
    paddingLeft: 2
  }, n0.createElement(JV, null, A)))
}
// @from(Ln 326678, Col 0)
function Rz0({
  content: A
}) {
  return n0.createElement(T, {
    flexDirection: "column"
  }, n0.createElement(C, {
    color: "success",
    bold: !0
  }, "Response:"), A.map((Q, B) => n0.createElement(T, {
    key: B,
    paddingLeft: 2,
    marginTop: B === 0 ? 0 : 1
  }, n0.createElement(JV, null, Q.text))))
}
// @from(Ln 326693, Col 0)
function zP2(A, Q, {
  tools: B,
  verbose: G,
  theme: Z
}) {
  if (A.status === "async_launched") {
    let {
      prompt: E
    } = A;
    return n0.createElement(T, {
      flexDirection: "column"
    }, n0.createElement(x0, {
      height: 1
    }, n0.createElement(C, null, "Backgrounded agent", !G && n0.createElement(C, {
      dimColor: !0
    }, " (", n0.createElement(vQ, null, n0.createElement(F0, {
      shortcut: "↓",
      action: "manage"
    }), E && n0.createElement(hQ, {
      action: "app:toggleTranscript",
      context: "Global",
      fallback: "ctrl+o",
      description: "expand"
    })), ")"))), G && E && n0.createElement(x0, null, n0.createElement(mkA, {
      prompt: E,
      theme: Z
    })))
  }
  if (A.status !== "completed") return null;
  let {
    agentId: Y,
    totalDurationMs: J,
    totalToolUseCount: X,
    totalTokens: I,
    usage: D,
    content: W,
    prompt: K
  } = A, F = `Done (${[X===1?"1 tool use":`${X} tool uses`,X8(I)+" tokens",QI(J)].join(" · ")})`, H = QU({
    content: F,
    usage: D
  });
  return n0.createElement(T, {
    flexDirection: "column"
  }, !1, G && K && n0.createElement(x0, null, n0.createElement(mkA, {
    prompt: K,
    theme: Z
  })), G ? n0.createElement(oSA, null, Q.map((E) => n0.createElement(x0, {
    key: E.uuid
  }, n0.createElement(PO, {
    message: E.data.message,
    messages: E.data.normalizedMessages,
    addMargin: !1,
    tools: B,
    commands: [],
    verbose: G,
    erroredToolUseIDs: new Set,
    inProgressToolUseIDs: new Set,
    resolvedToolUseIDs: new Set,
    progressMessagesForMessage: Q,
    shouldAnimate: !1,
    shouldShowDot: !1,
    isTranscriptMode: !1,
    isStatic: !0
  })))) : null, G && W && W.length > 0 && n0.createElement(x0, null, n0.createElement(Rz0, {
    content: W,
    theme: Z
  })), n0.createElement(x0, {
    height: 1
  }, n0.createElement(PO, {
    message: H,
    messages: a7([H]),
    addMargin: !1,
    tools: B,
    commands: [],
    verbose: G,
    erroredToolUseIDs: new Set,
    inProgressToolUseIDs: new Set,
    resolvedToolUseIDs: new Set,
    progressMessagesForMessage: [],
    shouldAnimate: !1,
    shouldShowDot: !1,
    isTranscriptMode: !1,
    isStatic: !0
  })))
}
// @from(Ln 326779, Col 0)
function $P2({
  description: A,
  prompt: Q
}) {
  if (!A || !Q) return null;
  return A
}
// @from(Ln 326787, Col 0)
function CP2(A) {
  let Q = [];
  if (A.resume) Q.push(n0.createElement(T, {
    key: "resume",
    flexWrap: "nowrap",
    marginLeft: 1
  }, n0.createElement(C, {
    dimColor: !0
  }, "resuming ", A.resume)));
  if (A.model) {
    let B = FX(A.model),
      G = B5();
    if (B !== G) Q.push(n0.createElement(T, {
      key: "model",
      flexWrap: "nowrap",
      marginLeft: 1
    }, n0.createElement(C, {
      dimColor: !0
    }, KC(B))))
  }
  if (Q.length === 0) return null;
  return n0.createElement(n0.Fragment, null, Q)
}
// @from(Ln 326811, Col 0)
function WHA(A, {
  tools: Q,
  verbose: B,
  terminalSize: G,
  inProgressToolCallCount: Z
}) {
  if (!A.length) return n0.createElement(x0, {
    height: 1
  }, n0.createElement(C, {
    dimColor: !0
  }, db5));
  let Y = (Z ?? 1) * ub5 + mb5,
    J = !B && G && G.rows && G.rows < Y,
    X = () => {
      let V = A.filter((E) => {
          return E.data.message.message.content.some(($) => $.type === "tool_use")
        }).length,
        F = [...A].reverse().find((E) => E.data.message.type === "assistant"),
        H = null;
      if (F?.data.message.type === "assistant") {
        let E = F.data.message.message.usage;
        H = (E.cache_creation_input_tokens ?? 0) + (E.cache_read_input_tokens ?? 0) + E.input_tokens + E.output_tokens
      }
      return {
        toolUseCount: V,
        tokens: H
      }
    };
  if (J) {
    let {
      toolUseCount: V,
      tokens: F
    } = X();
    return n0.createElement(x0, {
      height: 1
    }, n0.createElement(C, {
      dimColor: !0
    }, "In progress… · ", n0.createElement(C, {
      bold: !0
    }, V), " tool", " ", V === 1 ? "use" : "uses", F && ` · ${X8(F)} tokens`, " ·", " ", n0.createElement(hQ, {
      action: "app:toggleTranscript",
      context: "Global",
      fallback: "ctrl+o",
      description: "expand",
      parens: !0
    })))
  }
  let I = gb5(A, Q, !0),
    D = B ? I : I.slice(-fb5),
    W = I.length - D.length,
    K = A[0]?.data.prompt;
  return n0.createElement(x0, null, n0.createElement(T, {
    flexDirection: "column"
  }, n0.createElement(oSA, null, B && K && n0.createElement(T, {
    marginBottom: 1
  }, n0.createElement(mkA, {
    prompt: K
  })), D.map((V) => {
    if (V.type === "summary") {
      let F = KP2(V.searchCount, V.readCount, V.isActive);
      return n0.createElement(T, {
        key: V.uuid,
        height: 1,
        overflow: "hidden"
      }, n0.createElement(C, {
        dimColor: !0
      }, F))
    }
    return n0.createElement(T, {
      key: V.message.uuid,
      height: 1,
      overflow: "hidden"
    }, n0.createElement(PO, {
      message: V.message.data.message,
      messages: V.message.data.normalizedMessages,
      addMargin: !1,
      tools: Q,
      commands: [],
      verbose: B,
      erroredToolUseIDs: new Set,
      inProgressToolUseIDs: new Set,
      resolvedToolUseIDs: dkA(A),
      progressMessagesForMessage: A,
      shouldAnimate: !1,
      shouldShowDot: !1,
      style: "condensed",
      isTranscriptMode: !1,
      isStatic: !0
    }))
  })), W > 0 && n0.createElement(C, {
    dimColor: !0
  }, "+", W, " more tool ", W === 1 ? "use" : "uses", " ", n0.createElement(VS, null))))
}
// @from(Ln 326905, Col 0)
function UP2(A, {
  progressMessagesForMessage: Q,
  tools: B,
  verbose: G
}) {
  let Z = Q[0]?.data?.agentId;
  return n0.createElement(n0.Fragment, null, !1, WHA(Q, {
    tools: B,
    verbose: G
  }), n0.createElement(w7, null))
}
// @from(Ln 326917, Col 0)
function qP2(A, {
  progressMessagesForMessage: Q,
  tools: B,
  verbose: G
}) {
  return n0.createElement(n0.Fragment, null, WHA(Q, {
    tools: B,
    verbose: G
  }), n0.createElement(X5, {
    result: A,
    verbose: G
  }))
}
// @from(Ln 326931, Col 0)
function cb5(A) {
  let Q = A.filter((Z) => {
      let Y = Z.data.message;
      return Y.type === "user" && Y.message.content.some((J) => J.type === "tool_result")
    }).length,
    B = [...A].reverse().find((Z) => Z.data.message.type === "assistant"),
    G = null;
  if (B?.data.message.type === "assistant") {
    let Z = B.data.message.message.usage;
    G = (Z.cache_creation_input_tokens ?? 0) + (Z.cache_read_input_tokens ?? 0) + Z.input_tokens + Z.output_tokens
  }
  return {
    toolUseCount: Q,
    tokens: G
  }
}
// @from(Ln 326948, Col 0)
function NP2(A, Q) {
  let {
    shouldAnimate: B,
    tools: G
  } = Q, Z = A.map(({
    param: K,
    isResolved: V,
    isError: F,
    progressMessages: H,
    result: E
  }) => {
    let z = cb5(H),
      $ = pb5(H, G),
      O = Tz0.safeParse(K.input),
      L = O.success ? _z0(O.data) : "Task",
      M = O.success ? O.data.description : void 0,
      _ = O.success ? jz0(O.data) : void 0,
      j = O.success && "run_in_background" in O.data && O.data.run_in_background === !0,
      x = E?.output?.status === "async_launched",
      b = j || x;
    return {
      id: K.id,
      agentType: L,
      description: M,
      toolUseCount: z.toolUseCount,
      tokens: z.tokens,
      isResolved: V,
      isError: F,
      isAsync: b,
      color: _,
      lastToolInfo: $
    }
  }), Y = A.some((K) => !K.isResolved), J = A.some((K) => K.isError), X = !Y, I = Z.length > 0 && Z.every((K) => K.agentType === Z[0]?.agentType), D = I ? Z[0]?.agentType : null, W = Z.every((K) => K.isAsync);
  return n0.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, n0.createElement(T, {
    flexDirection: "row"
  }, n0.createElement(k4A, {
    shouldAnimate: B && Y,
    isUnresolved: Y,
    isError: J
  }), n0.createElement(C, null, X ? n0.createElement(n0.Fragment, null, n0.createElement(C, {
    bold: !0
  }, A.length), " ", D ? `${D} agents` : "agents", " ", W ? "launched" : "finished") : n0.createElement(n0.Fragment, null, "Running ", n0.createElement(C, {
    bold: !0
  }, A.length), " ", D ? `${D} agents` : "agents", "…"), " "), n0.createElement(VS, null)), Z.map((K, V) => n0.createElement(HP2, {
    key: K.id,
    agentType: K.agentType,
    description: K.description,
    toolUseCount: K.toolUseCount,
    tokens: K.tokens,
    color: K.color,
    isLast: V === Z.length - 1,
    isResolved: K.isResolved,
    isError: K.isError,
    isAsync: K.isAsync,
    shouldAnimate: B,
    lastToolInfo: K.lastToolInfo,
    hideType: I
  })))
}
// @from(Ln 327011, Col 0)
function _z0(A) {
  if (A?.subagent_type && A.subagent_type !== $Y1.agentType) return A.subagent_type;
  return "Task"
}
// @from(Ln 327016, Col 0)
function jz0(A) {
  if (!A?.subagent_type) return;
  return yVA(A.subagent_type)
}
// @from(Ln 327021, Col 0)
function pb5(A, Q) {
  let B = [...A].reverse().find((G) => {
    let Z = G.data.message;
    return Z.type === "user" && Z.message.content.some((Y) => Y.type === "tool_result")
  });
  if (B?.data.message.type === "user") {
    let G = B.data.message.message.content.find((Z) => Z.type === "tool_result");
    if (G?.type === "tool_result") {
      let Z = G.tool_use_id,
        Y = A.find((J) => {
          let X = J.data.message;
          return X.type === "assistant" && X.message.content.some((I) => I.type === "tool_use" && I.id === Z)
        });
      if (Y?.data.message.type === "assistant") {
        let J = Y.data.message.message.content.find((X) => X.type === "tool_use" && X.id === Z);
        if (J?.type === "tool_use") {
          let X = Q.find((K) => K.name === J.name);
          if (!X) return J.name;
          let I = J.input,
            D = X.inputSchema.safeParse(I),
            W = X.userFacingName(D.success ? D.data : void 0);
          if (X.getToolUseSummary) {
            let K = X.getToolUseSummary(D.success ? D.data : void 0);
            if (K) return `${W}: ${K}`
          }
          return W
        }
      }
    }
  }
  return null
}
// @from(Ln 327053, Col 4)
n0
// @from(Ln 327053, Col 8)
fb5 = 3
// @from(Ln 327054, Col 2)
ub5 = 9
// @from(Ln 327055, Col 2)
mb5 = 7
// @from(Ln 327056, Col 2)
db5 = "Initializing…"
// @from(Ln 327057, Col 4)
LD1 = w(() => {
  fA();
  tH();
  eW();
  pb();
  c4();
  x6A();
  tQ();
  tQ();
  FD0();
  EO();
  Gr();
  e9();
  I3();
  K6();
  rY1();
  EP2();
  YY1();
  OyA();
  y9();
  wD1();
  l2();
  n0 = c(QA(), 1)
})
// @from(Ln 327082, Col 0)
function wP2(A) {
  let Q = A.trim();
  if (!Q.startsWith("/")) return null;
  let G = Q.slice(1).split(" ");
  if (!G[0]) return null;
  let Z = G[0],
    Y = !1,
    J = 1;
  if (G.length > 1 && G[1] === "(MCP)") Z = Z + " (MCP)", Y = !0, J = 2;
  let X = G.slice(J).join(" ");
  return {
    commandName: Z,
    args: X,
    isMcp: Y
  }
}
// @from(Ln 327099, Col 0)
function OD1(A, Q, B, G) {
  let Z = 0;
  for (let Y of _b) {
    let J = B[Y];
    if (!J) continue;
    for (let X of J)
      for (let I of X.hooks) {
        let D = I.once ? () => {
          k(`Removing one-shot hook for event ${Y} in skill '${G}'`), g32(A, Q, Y, I)
        } : void 0;
        pZ1(A, Q, Y, X.matcher || "", I, D), Z++
      }
  }
  if (Z > 0) k(`Registered ${Z} hooks from skill '${G}'`)
}
// @from(Ln 327114, Col 4)
Pz0 = w(() => {
  GVA();
  vr();
  T1()
})
// @from(Ln 327120, Col 0)
function MD1(A) {
  let B = L1().skillUsage?.[A],
    G = Date.now(),
    Z = (B?.usageCount ?? 0) + 1;
  if (!B || B.usageCount !== Z || B.lastUsedAt !== G) S0((Y) => ({
    ...Y,
    skillUsage: {
      ...Y.skillUsage,
      [A]: {
        usageCount: Z,
        lastUsedAt: G
      }
    }
  }))
}
// @from(Ln 327136, Col 0)
function RD1(A) {
  let B = L1().skillUsage?.[A];
  if (!B) return 0;
  let G = (Date.now() - B.lastUsedAt) / 86400000,
    Z = Math.pow(0.5, G / 7);
  return B.usageCount * Math.max(Z, 0.1)
}
// @from(Ln 327143, Col 4)
_D1 = w(() => {
  GQ()
})
// @from(Ln 327149, Col 0)
async function ib5(A, Q, B, G, Z, Y) {
  let J = LS();
  l("tengu_slash_command_forked", {
    command_name: A.name
  });
  let {
    skillContent: X,
    modifiedGetAppState: I,
    baseAgent: D,
    promptMessages: W
  } = await TD1(A, Q, B), K = [];
  k(`Executing forked slash command /${A.name} with agent ${D.agentType}`);
  let V = [],
    F = `forked-command-${A.name}`,
    H = 0,
    E = (O) => {
      return H++, {
        type: "progress",
        data: {
          message: O,
          normalizedMessages: a7(K),
          type: "agent_progress",
          prompt: X,
          agentId: J
        },
        parentToolUseID: F,
        toolUseID: `${F}-${H}`,
        timestamp: new Date().toISOString(),
        uuid: lb5()
      }
    },
    z = () => {
      Z({
        jsx: WHA(V, {
          tools: B.options.tools,
          verbose: !1
        }),
        shouldHidePromptInput: !1,
        shouldContinueAnimation: !0,
        showSpinner: !0
      })
    };
  z();
  try {
    for await (let O of $f({
      agentDefinition: D,
      promptMessages: W,
      toolUseContext: {
        ...B,
        getAppState: I
      },
      canUseTool: Y,
      isAsync: !1,
      querySource: "agent:custom",
      model: A.model
    })) {
      if (K.push(O), O.type === "assistant") {
        let L = g51(O);
        if (L > 0) B.setResponseLength((j) => j + L);
        let _ = a7([O])[0];
        if (_ && _.type === "assistant") V.push(E(O)), z()
      }
      if (O.type === "user") {
        let M = a7([O])[0];
        if (M && M.type === "user") V.push(E(M)), z()
      }
    }
  } finally {
    Z(null)
  }
  let $ = PD1(K, "Command completed");
  return k(`Forked slash command /${A.name} completed with agent ${J}`), {
    messages: [H0({
      content: IU({
        inputString: `/${A.userFacingName()} ${Q}`.trim(),
        precedingInputBlocks: G
      })
    }), H0({
      content: `<local-command-stdout>
${$}
</local-command-stdout>`
    })],
    shouldQuery: !1,
    command: A,
    resultText: $
  }
}
// @from(Ln 327237, Col 0)
function nb5(A) {
  return !/[^a-zA-Z0-9:\-_]/.test(A)
}
// @from(Ln 327240, Col 0)
async function OP2(A, Q, B, G, Z, Y, J, X, I, D) {
  let W = wP2(A);
  if (!W) {
    l("tengu_input_slash_missing", {});
    let b = "Commands are in the form `/command [args]`";
    return {
      messages: [NE(), ...G, H0({
        content: IU({
          inputString: b,
          precedingInputBlocks: Q
        })
      })],
      shouldQuery: !1,
      resultText: b
    }
  }
  let {
    commandName: K,
    args: V,
    isMcp: F
  } = W, H = F ? "mcp" : !xs().has(K) ? "custom" : K;
  if (!Cc(K, Z.options.commands)) {
    let b = vA().existsSync(`/${K}`);
    if (nb5(K) && !b) {
      l("tengu_input_slash_invalid", {
        input: K
      });
      let S = `Unknown skill: ${K}`;
      return {
        messages: [NE(), ...G, H0({
          content: IU({
            inputString: S,
            precedingInputBlocks: Q
          })
        })],
        shouldQuery: !1,
        resultText: S
      }
    }
    return l("tengu_input_prompt", {}), LF("user_prompt", {
      prompt_length: String(A.length),
      prompt: nZ1(A)
    }), {
      messages: [H0({
        content: IU({
          inputString: A,
          precedingInputBlocks: Q
        }),
        uuid: X
      }), ...G],
      shouldQuery: !0
    }
  }
  Y(!0), T9("slash-commands");
  let {
    messages: E,
    shouldQuery: z,
    allowedTools: $,
    maxThinkingTokens: O,
    model: L,
    command: M,
    resultText: _
  } = await ab5(K, V, J, Z, Q, B, I, D);
  if (E.length === 0) {
    let b = {
      input: H
    };
    if (M.type === "prompt" && M.pluginInfo) {
      let {
        pluginManifest: S,
        repository: u
      } = M.pluginInfo;
      if (b.plugin_repository = u, b.plugin_name = S.name, S.version) b.plugin_version = S.version
    }
    return l("tengu_input_command", b), {
      messages: [],
      shouldQuery: !1,
      maxThinkingTokens: O,
      model: L
    }
  }
  if (E.length === 2 && E[1].type === "user" && typeof E[1].message.content === "string" && E[1].message.content.startsWith("Unknown command:")) {
    if (!(A.startsWith("/var") || A.startsWith("/tmp") || A.startsWith("/private"))) l("tengu_input_slash_invalid", {
      input: K
    });
    return {
      messages: [NE(), ...E],
      shouldQuery: z,
      allowedTools: $,
      maxThinkingTokens: O,
      model: L
    }
  }
  let j = {
    input: H
  };
  if (M.type === "prompt" && M.pluginInfo) {
    let {
      pluginManifest: b,
      repository: S
    } = M.pluginInfo;
    if (j.plugin_repository = S, j.plugin_name = b.name, b.version) j.plugin_version = b.version
  }
  l("tengu_input_command", j);
  let x = E.length > 0 && E[0] && qc(E[0]);
  return {
    messages: z || E.every(_P2) || x ? E : [NE(), ...E],
    shouldQuery: z,
    allowedTools: $,
    maxThinkingTokens: O,
    model: L,
    resultText: _
  }
}
// @from(Ln 327354, Col 0)
async function ab5(A, Q, B, G, Z, Y, J, X) {
  let I = eS(A, G.options.commands);
  if (I.type === "prompt" && I.userInvocable !== !1) MD1(A);
  if (I.userInvocable === !1) return {
    messages: [H0({
      content: IU({
        inputString: `/${A}`,
        precedingInputBlocks: Z
      })
    }), H0({
      content: `This skill can only be invoked by Claude, not directly by users. Ask Claude to use the "${A}" skill for you.`
    })],
    shouldQuery: !1,
    command: I
  };
  try {
    switch (I.type) {
      case "local-jsx":
        return new Promise((D) => {
          I.call((W, K) => {
            if (K?.display === "skip") {
              D({
                messages: [],
                shouldQuery: !1,
                command: I
              });
              return
            }
            D({
              messages: K?.display === "system" ? [Sz0(ckA(I, Q)), Sz0(`<local-command-stdout>${W}</local-command-stdout>`)] : [H0({
                content: IU({
                  inputString: ckA(I, Q),
                  precedingInputBlocks: Z
                })
              }), W ? H0({
                content: `<local-command-stdout>${W}</local-command-stdout>`
              }) : H0({
                content: `<local-command-stdout>${JO}</local-command-stdout>`
              })],
              shouldQuery: K?.shouldQuery ?? !1,
              command: I
            })
          }, G, Q).then((W) => {
            if (G.options.isNonInteractiveSession) {
              D({
                messages: [],
                shouldQuery: !1,
                command: I
              });
              return
            }
            B({
              jsx: W,
              shouldHidePromptInput: !0,
              showSpinner: !1,
              isLocalJSXCommand: !0
            })
          })
        });
      case "local": {
        let D = H0({
          content: IU({
            inputString: ckA(I, Q),
            precedingInputBlocks: Z
          })
        });
        try {
          let W = NE(),
            K = await I.call(Q, G);
          if (K.type === "skip") return {
            messages: [],
            shouldQuery: !1,
            command: I
          };
          if (K.type === "compact") {
            let V = [W, D, ...K.displayText ? [H0({
                content: `<local-command-stdout>${K.displayText}</local-command-stdout>`,
                timestamp: new Date(Date.now() + 100).toISOString()
              })] : []],
              F = {
                ...K.compactionResult,
                messagesToKeep: [...K.compactionResult.messagesToKeep ?? [], ...V]
              };
            return {
              messages: FHA(F),
              shouldQuery: !1,
              command: I
            }
          }
          return {
            messages: [D, H0({
              content: `<local-command-stdout>${K.value}</local-command-stdout>`
            })],
            shouldQuery: !1,
            command: I
          }
        } catch (W) {
          return e(W), {
            messages: [D, H0({
              content: `<local-command-stderr>${String(W)}</local-command-stderr>`
            })],
            shouldQuery: !1,
            command: I
          }
        }
      }
      case "prompt":
        try {
          if (I.context === "fork") return await ib5(I, Q, G, Z, B, X ?? B$);
          return await RP2(I, Q, G, Z, Y)
        } catch (D) {
          if (D instanceof aG) return {
            messages: [H0({
              content: IU({
                inputString: ckA(I, Q),
                precedingInputBlocks: Z
              })
            }), H0({
              content: Ss
            })],
            shouldQuery: !1,
            command: I
          };
          return {
            messages: [H0({
              content: IU({
                inputString: ckA(I, Q),
                precedingInputBlocks: Z
              })
            }), H0({
              content: `<local-command-stderr>${String(D)}</local-command-stderr>`
            })],
            shouldQuery: !1,
            command: I
          }
        }
    }
  } catch (D) {
    if (D instanceof ny) return {
      messages: [H0({
        content: IU({
          inputString: D.message,
          precedingInputBlocks: Z
        })
      })],
      shouldQuery: !1,
      command: I
    };
    throw D
  }
}
// @from(Ln 327506, Col 0)
function ckA(A, Q) {
  return `<${mC}>/${A.userFacingName()}</${mC}>
            <${fz}>${A.userFacingName()}</${fz}>
            <command-args>${Q}</command-args>`
}
// @from(Ln 327512, Col 0)
function xz0(A, Q = "loading") {
  return [`<${fz}>${A}</${fz}>`, `<${mC}>${A}</${mC}>`, "<skill-format>true</skill-format>"].join(`
`)
}
// @from(Ln 327517, Col 0)
function LP2(A, Q) {
  return [`<${fz}>${A}</${fz}>`, `<${mC}>/${A}</${mC}>`, Q ? `<command-args>${Q}</command-args>` : null].filter(Boolean).join(`
`)
}
// @from(Ln 327522, Col 0)
function ob5(A, Q) {
  if (A.userInvocable !== !1) return LP2(A.userFacingName(), Q);
  if (A.loadedFrom === "skills" || A.loadedFrom === "plugin") return xz0(A.userFacingName(), A.progressMessage);
  return LP2(A.userFacingName(), Q)
}
// @from(Ln 327527, Col 0)
async function MP2(A, Q, B, G, Z = []) {
  if (!Cc(A, B)) throw new ny(`Unknown command: ${A}`);
  let Y = eS(A, B);
  if (Y.type !== "prompt") throw Error(`Unexpected ${Y.type} command. Expected 'prompt' command. Use /${A} directly in the main conversation.`);
  return RP2(Y, Q, G, [], Z)
}
// @from(Ln 327533, Col 0)
async function RP2(A, Q, B, G = [], Z = []) {
  let Y = await A.getPromptForCommand(Q, B);
  if (A.hooks) {
    let F = q0();
    OD1(B.setAppState, F, A.hooks, A.name)
  }
  let J = ob5(A, Q);
  k(`Metadata string for ${A.userFacingName()}:`), k(`  ${J.substring(0,200)}`);
  let X = (J.match(/<command-message>/g) || []).length;
  k(`  command-message tags in metadata: ${X}`);
  let I = Uc(A.allowedTools ?? []),
    D = Z.length > 0 || G.length > 0 ? [...Z, ...G, ...Y] : Y,
    W = Hm([H0({
      content: D
    })], void 0),
    K = await QY1(VHA(Y.filter((F) => F.type === "text").map((F) => F.text).join(" "), B, null, [], B.messages, "repl_main_thread")),
    V = [H0({
      content: J
    }), H0({
      content: D,
      isMeta: !0
    }), ...K, X4({
      type: "command_permissions",
      allowedTools: I,
      model: A.model
    })];
  return k(`processPromptSlashCommand creating ${V.length} messages for ${A.userFacingName()}`), V.forEach((F, H) => {
    if (F.type === "user" && "message" in F) {
      let E = typeof F.message.content === "string" ? F.message.content : eA(F.message.content),
        z = "isMeta" in F && F.isMeta ? " [META]" : "",
        $ = E.substring(0, 200);
      k(`  Message ${H+1}${z}: ${$}`)
    } else if (F.type === "attachment") k(`  Message ${H+1}: [ATTACHMENT]`)
  }), {
    messages: V,
    shouldQuery: !0,
    allowedTools: I,
    maxThinkingTokens: W > 0 ? W : void 0,
    model: A.model,
    command: A
  }
}
// @from(Ln 327575, Col 4)
jD1 = w(() => {
  LD1();
  Z0();
  tQ();
  WV();
  DQ();
  fr();
  XO();
  v1();
  T1();
  XX();
  ys();
  gr();
  m_();
  Y_();
  JZ();
  A0();
  cD();
  C0();
  Pz0();
  KHA();
  YZ();
  d_();
  $c();
  uC();
  _D1();
  O6A()
})
// @from(Ln 327606, Col 0)
async function sb5(A, Q) {
  if (!A.mcpServers?.length) return {
    clients: Q,
    tools: [],
    cleanup: async () => {}
  };
  let B = [],
    G = [],
    Z = [];
  for (let J of A.mcpServers) {
    let X = null,
      I, D = !1;
    if (typeof J === "string") {
      if (I = J, X = vs(J), !X) {
        k(`[Agent: ${A.agentType}] MCP server not found: ${J}`, {
          level: "warn"
        });
        continue
      }
    } else {
      let K = Object.entries(J);
      if (K.length !== 1) {
        k(`[Agent: ${A.agentType}] Invalid MCP server spec: expected exactly one key`, {
          level: "warn"
        });
        continue
      }
      let [V, F] = K[0];
      I = V, X = {
        ...F,
        scope: "dynamic"
      }, D = !0
    }
    let W = await SO(I, X);
    if (B.push(W), D) G.push(W);
    if (W.type === "connected") {
      let K = await Ax(W);
      Z.push(...K), k(`[Agent: ${A.agentType}] Connected to MCP server '${I}' with ${K.length} tools`)
    } else k(`[Agent: ${A.agentType}] Failed to connect to MCP server '${I}': ${W.type}`, {
      level: "warn"
    })
  }
  let Y = async () => {
    for (let J of G)
      if (J.type === "connected") try {
        await J.cleanup()
      } catch (X) {
        k(`[Agent: ${A.agentType}] Error cleaning up MCP server '${J.name}': ${X}`, {
          level: "warn"
        })
      }
  };
  return {
    clients: [...Q, ...B],
    tools: Z,
    cleanup: Y
  }
}
// @from(Ln 327665, Col 0)
function tb5(A) {
  return A.type === "assistant" || A.type === "user" || A.type === "progress" || A.type === "system" && "subtype" in A && A.subtype === "compact_boundary"
}
// @from(Ln 327668, Col 0)
async function* $f({
  agentDefinition: A,
  promptMessages: Q,
  toolUseContext: B,
  canUseTool: G,
  isAsync: Z,
  forkContextMessages: Y,
  querySource: J,
  override: X,
  model: I,
  maxTurns: D
}) {
  T9("subagents");
  let W = await B.getAppState(),
    K = W.toolPermissionContext.mode,
    V = YA1(A.model, B.options.mainLoopModel, I, K),
    F = X?.agentId ? X.agentId : LS(),
    E = [...Y ? vz0(Y) : [], ...Q],
    z = Y !== void 0 ? m9A(B.readFileState) : Id(u9A),
    [$, O] = await Promise.all([X?.userContext ?? ZV(), X?.systemContext ?? OF()]),
    L = A.permissionMode,
    M = async () => {
      let bA = await B.getAppState(),
        jA = bA.toolPermissionContext;
      if (L && bA.toolPermissionContext.mode !== "bypassPermissions") jA = {
        ...jA,
        mode: L
      };
      if (Z) jA = {
        ...jA,
        shouldAvoidPermissionPrompts: !0
      };
      return {
        ...bA,
        toolPermissionContext: jA,
        queuedCommands: []
      }
    }, j = ur(A, B.options.tools, Z).resolvedTools, x = Array.from(W.toolPermissionContext.additionalWorkingDirectories.keys()), b = X?.systemPrompt ? X.systemPrompt : await eb5(A, B, V, x), S = [], u = X?.abortController ? X.abortController : Z ? new AbortController : B.abortController, f = [];
  for await (let bA of kz0(F, A.agentType, u.signal)) if (bA.additionalContexts && bA.additionalContexts.length > 0) f.push(...bA.additionalContexts);
  if (f.length > 0) {
    let bA = X4({
      type: "hook_additional_context",
      content: f,
      hookName: "SubagentStart",
      toolUseID: rb5(),
      hookEvent: "SubagentStart"
    });
    E.push(bA)
  }
  if (A.hooks) j52(B.setAppState, F, A.hooks, `agent '${A.agentType}'`, !0);
  let AA = A.skills ?? [];
  if (AA.length > 0) {
    let bA = await Nc(Xq()),
      jA = [];
    for (let OA of AA) {
      if (!Cc(OA, bA)) {
        k(`[Agent: ${A.agentType}] Warning: Skill '${OA}' specified in frontmatter was not found`, {
          level: "warn"
        });
        continue
      }
      let IA = eS(OA, bA);
      if (IA.type !== "prompt") {
        k(`[Agent: ${A.agentType}] Warning: Skill '${OA}' is not a prompt-based skill`, {
          level: "warn"
        });
        continue
      }
      jA.push({
        skillName: OA,
        skill: IA
      })
    }
    for (let {
        skillName: OA,
        skill: IA
      }
      of jA) {
      let HA = await IA.getPromptForCommand("", B);
      k(`[Agent: ${A.agentType}] Preloaded skill '${OA}'`);
      let ZA = xz0(OA, IA.progressMessage);
      E.push(H0({
        content: [{
          type: "text",
          text: ZA
        }, ...HA]
      }))
    }
  }
  let {
    clients: n,
    tools: y,
    cleanup: p
  } = await sb5(A, B.options.mcpClients), GA = [...j, ...y], WA = {
    isNonInteractiveSession: Z ? !0 : B.options.isNonInteractiveSession ?? !1,
    appendSystemPrompt: B.options.appendSystemPrompt,
    tools: GA,
    commands: [],
    debug: B.options.debug,
    verbose: B.options.verbose,
    mainLoopModel: V,
    maxThinkingTokens: Hm(E),
    mcpClients: n,
    mcpResources: B.options.mcpResources,
    agentDefinitions: B.options.agentDefinitions
  }, MA = lkA(B, {
    options: WA,
    agentId: F,
    messages: E,
    readFileState: z,
    abortController: u,
    getAppState: M,
    shareSetAppState: !Z,
    shareSetResponseLength: !0,
    criticalSystemReminder_EXPERIMENTAL: A.criticalSystemReminder_EXPERIMENTAL
  });
  await yz0(E, F).catch((bA) => k(`Failed to record sidechain transcript: ${bA}`));
  let TA = E.length > 0 ? E[E.length - 1].uuid : null;
  try {
    for await (let bA of aN({
      messages: E,
      systemPrompt: b,
      userContext: $,
      systemContext: O,
      canUseTool: G,
      toolUseContext: MA,
      querySource: J,
      maxTurns: D
    })) {
      if (bA.type === "attachment") {
        if (bA.attachment.type === "max_turns_reached") {
          k(`[Agent: ${A.agentType}] Reached max turns limit (${bA.attachment.maxTurns})`);
          break
        }
        yield bA;
        continue
      }
      if (tb5(bA)) S.push(bA), await yz0([bA], F, TA).catch((jA) => k(`Failed to record sidechain transcript: ${jA}`)), TA = bA.uuid, yield bA
    }
    if (u.signal.aborted) throw new aG;
    if (p_(A) && A.callback) A.callback()
  } finally {
    if (await p(), A.hooks) wVA(B.setAppState, F)
  }
}
// @from(Ln 327814, Col 0)
function vz0(A) {
  let Q = new Set;
  for (let B of A)
    if (B?.type === "user") {
      let Z = B.message.content;
      if (Array.isArray(Z)) {
        for (let Y of Z)
          if (Y.type === "tool_result" && Y.tool_use_id) Q.add(Y.tool_use_id)
      }
    } return A.filter((B) => {
    if (B?.type === "assistant") {
      let Z = B.message.content;
      if (Array.isArray(Z)) return !Z.some((J) => J.type === "tool_use" && J.id && !Q.has(J.id))
    }
    return !0
  })
}
// @from(Ln 327831, Col 0)
async function eb5(A, Q, B, G) {
  try {
    let Z = A.getSystemPrompt({
      toolUseContext: Q
    });
    return await pkA([Z], B, G)
  } catch (Z) {
    return await pkA([jP2], B, G)
  }
}
// @from(Ln 327841, Col 4)
KHA = w(() => {
  ks();
  XX();
  d_();
  OS();
  wc();
  l2();
  Y_();
  L4A();
  _S();
  pC();
  zO();
  T52();
  vr();
  m_();
  d4();
  T1();
  OyA();
  y9();
  WV();
  C0();
  tQ();
  jD1();
  $c();
  JZ();
  jN();
  G$()
})
// @from(Ln 327870, Col 0)
function TP2(A, Q) {
  if (Q) return A ? `agent:builtin:${A}` : "agent:default";
  else return "agent:custom"
}
// @from(Ln 327875, Col 0)
function SD1() {
  let Q = jQ()?.outputStyle ?? vF;
  if (Q === vF) return "repl_main_thread";
  return Q in y6A ? `repl_main_thread:outputStyle:${Q}` : "repl_main_thread:outputStyle:custom"
}
// @from(Ln 327880, Col 4)
bz0 = w(() => {
  GB();
  Cf()
})
// @from(Ln 327885, Col 0)
function xD1({
  output: A,
  fullOutput: Q,
  elapsedTimeSeconds: B,
  totalLines: G,
  verbose: Z
}) {
  let Y = jZ(Q.trim()),
    X = jZ(A.trim()).split(`
`).filter((K) => K),
    I = Z ? Y : X.slice(-5).join(`
`),
    D = Z ? 0 : G ? Math.max(0, G - 5) : 0,
    W = B !== void 0 ? `(${QI(B*1000)})` : void 0;
  if (!X.length) return Uf.default.createElement(x0, null, Uf.default.createElement(C, {
    dimColor: !0
  }, "Running… ", W));
  return Uf.default.createElement(x0, null, Uf.default.createElement(T, {
    flexDirection: "column"
  }, Uf.default.createElement(T, {
    height: Z ? void 0 : Math.min(5, X.length),
    flexDirection: "column",
    overflow: "hidden"
  }, Uf.default.createElement(C, {
    dimColor: !0
  }, I)), Uf.default.createElement(T, {
    flexDirection: "row",
    gap: 1
  }, !Z && D > 0 && Uf.default.createElement(C, {
    dimColor: !0
  }, D > 0 && `+${D} more line${D===1?"":"s"}`), W && Uf.default.createElement(C, {
    dimColor: !0
  }, W))))
}
// @from(Ln 327919, Col 4)
Uf
// @from(Ln 327920, Col 4)
fz0 = w(() => {
  fA();
  rR();
  c4();
  Uf = c(QA(), 1)
})
// @from(Ln 327930, Col 0)
function HHA(A) {
  let Q = A.trim(),
    B = Q.match(/^\s*sed\s+/);
  if (!B) return null;
  let G = Q.slice(B[0].length),
    Z = bY(G);
  if (!Z.success) return null;
  let Y = Z.tokens,
    J = [];
  for (let M of Y)
    if (typeof M === "string") J.push(M);
    else if (typeof M === "object" && M !== null && "op" in M && M.op === "glob") return null;
  let X = !1,
    I = !1,
    D = null,
    W = null,
    K = 0;
  while (K < J.length) {
    let M = J[K];
    if (M === "-i" || M === "--in-place") {
      if (X = !0, K++, K < J.length) {
        let _ = J[K];
        if (typeof _ === "string" && !_.startsWith("-") && (_ === "" || _.startsWith("."))) K++
      }
      continue
    }
    if (M.startsWith("-i")) {
      X = !0, K++;
      continue
    }
    if (M === "-E" || M === "-r" || M === "--regexp-extended") {
      I = !0, K++;
      continue
    }
    if (M === "-e" || M === "--expression") {
      if (K + 1 < J.length && typeof J[K + 1] === "string") {
        if (D !== null) return null;
        D = J[K + 1], K += 2;
        continue
      }
      return null
    }
    if (M.startsWith("--expression=")) {
      if (D !== null) return null;
      D = M.slice(13), K++;
      continue
    }
    if (M.startsWith("-")) return null;
    if (D === null) D = M;
    else if (W === null) W = M;
    else return null;
    K++
  }
  if (!X || !D || !W) return null;
  if (!D.match(/^s\//)) return null;
  let F = D.slice(2),
    H = "",
    E = "",
    z = "",
    $ = "pattern",
    O = 0;
  while (O < F.length) {
    let M = F[O];
    if (M === "\\" && O + 1 < F.length) {
      if ($ === "pattern") H += M + F[O + 1];
      else if ($ === "replacement") E += M + F[O + 1];
      else z += M + F[O + 1];
      O += 2;
      continue
    }
    if (M === "/") {
      if ($ === "pattern") $ = "replacement";
      else if ($ === "replacement") $ = "flags";
      else return null;
      O++;
      continue
    }
    if ($ === "pattern") H += M;
    else if ($ === "replacement") E += M;
    else z += M;
    O++
  }
  if ($ !== "flags") return null;
  if (!/^[gpimIM1-9]*$/.test(z)) return null;
  return {
    filePath: W,
    pattern: H,
    replacement: E,
    flags: z,
    extendedRegex: I
  }
}
// @from(Ln 328023, Col 0)
function PP2(A, Q) {
  let B = "";
  if (Q.flags.includes("g")) B += "g";
  if (Q.flags.includes("i") || Q.flags.includes("I")) B += "i";
  if (Q.flags.includes("m") || Q.flags.includes("M")) B += "m";
  let G = Q.pattern.replace(/\\\//g, "/");
  if (!Q.extendedRegex) G = G.replace(/\\\\/g, "\x00BACKSLASH\x00").replace(/\\\+/g, "\x00PLUS\x00").replace(/\\\?/g, "\x00QUESTION\x00").replace(/\\\|/g, "\x00PIPE\x00").replace(/\\\(/g, "\x00LPAREN\x00").replace(/\\\)/g, "\x00RPAREN\x00").replace(/\+/g, "\\+").replace(/\?/g, "\\?").replace(/\|/g, "\\|").replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(new RegExp("\x00BACKSLASH\x00", "g"), "\\\\").replace(new RegExp("\x00PLUS\x00", "g"), "+").replace(new RegExp("\x00QUESTION\x00", "g"), "?").replace(new RegExp("\x00PIPE\x00", "g"), "|").replace(new RegExp("\x00LPAREN\x00", "g"), "(").replace(new RegExp("\x00RPAREN\x00", "g"), ")");
  let Y = `___ESCAPED_AMPERSAND_${Af5(8).toString("hex")}___`,
    J = Q.replacement.replace(/\\\//g, "/").replace(/\\&/g, Y).replace(/&/g, "$$&").replace(new RegExp(Y, "g"), "&");
  try {
    let X = new RegExp(G, B);
    return A.replace(X, J)
  } catch {
    return A
  }
}
// @from(Ln 328039, Col 4)
ikA = w(() => {
  pV()
})
// @from(Ln 328043, Col 0)
function yD1({
  onBackground: A
} = {}) {
  let [Q, B] = a0(), G = M7.useRef(Q);
  G.current = Q;
  let Z = M7.useCallback(() => {
    vD1(() => G.current, B), A?.()
  }, [B, A]);
  H2("task:background", Z, {
    context: "Task"
  });
  let Y = J3("task:background", "Task", "ctrl+b"),
    J = l0.terminal === "tmux" && Y === "ctrl+b" ? "ctrl+b ctrl+b (twice)" : Y;
  if (a1(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS)) return null;
  return M7.createElement(T, {
    paddingLeft: 5
  }, M7.createElement(C, {
    dimColor: !0
  }, M7.createElement(F0, {
    shortcut: J,
    action: "run in background"
  })))
}
// @from(Ln 328067, Col 0)
function xP2(A, {
  verbose: Q,
  theme: B
}) {
  let {
    command: G
  } = A;
  if (!G) return null;
  let Z = HHA(G);
  if (Z) return Q ? Z.filePath : k6(Z.filePath);
  let Y = G;
  if (G.includes(`"$(cat <<'EOF'`)) {
    let J = G.match(/^(.*?)"?\$\(cat <<'EOF'\n([\s\S]*?)\n\s*EOF\n\s*\)"(.*)$/);
    if (J && J[1] && J[2]) {
      let X = J[1],
        I = J[2],
        D = J[3] || "";
      Y = `${X.trim()} "${I.trim()}"${D.trim()}`
    }
  }
  if (!Q) {
    let J = Y.split(`
`),
      X = J.length > SP2,
      I = Y.length > hz0;
    if (X || I) {
      let D = Y;
      if (X) D = J.slice(0, SP2).join(`
`);
      if (D.length > hz0) D = D.slice(0, hz0);
      return M7.createElement(C, null, D.trim(), "…")
    }
  }
  return Y
}
// @from(Ln 328103, Col 0)
function yP2(A) {
  let {
    timeout: Q
  } = A;
  if (!Q) return null;
  let B = CKA();
  if (Q === B) return null;
  return M7.createElement(T, {
    flexWrap: "nowrap",
    marginLeft: 1
  }, M7.createElement(C, {
    dimColor: !0
  }, "timeout: ", QI(Q)))
}
// @from(Ln 328118, Col 0)
function vP2() {
  return M7.createElement(w7, null)
}
// @from(Ln 328122, Col 0)
function kP2(A, {
  verbose: Q,
  tools: B,
  terminalSize: G,
  inProgressToolCallCount: Z
}) {
  let Y = A.at(-1);
  if (!Y || !Y.data || !Y.data.output) return M7.createElement(x0, {
    height: 1
  }, M7.createElement(C, {
    dimColor: !0
  }, "Running…"));
  let J = Y.data;
  return M7.createElement(xD1, {
    fullOutput: J.fullOutput,
    output: J.output,
    elapsedTimeSeconds: J.elapsedTimeSeconds,
    totalLines: J.totalLines,
    verbose: Q
  })
}
// @from(Ln 328144, Col 0)
function bP2() {
  return M7.createElement(x0, {
    height: 1
  }, M7.createElement(C, {
    dimColor: !0
  }, "Waiting…"))
}
// @from(Ln 328152, Col 0)
function fP2(A, Q, {
  verbose: B,
  theme: G,
  tools: Z,
  style: Y
}) {
  return M7.createElement(M6A, {
    content: A,
    verbose: B
  })
}
// @from(Ln 328164, Col 0)
function hP2(A, {
  verbose: Q,
  progressMessagesForMessage: B,
  tools: G
}) {
  return M7.createElement(X5, {
    result: A,
    verbose: Q
  })
}
// @from(Ln 328174, Col 4)
M7
// @from(Ln 328174, Col 8)
SP2 = 2
// @from(Ln 328175, Col 2)
hz0 = 160
// @from(Ln 328176, Col 4)
gz0 = w(() => {
  fA();
  tH();
  eW();
  c4();
  FD1();
  fz0();
  ikA();
  y9();
  cSA();
  p3();
  e9();
  hB();
  v6A();
  fQ();
  c6();
  NX();
  M7 = c(QA(), 1)
})
// @from(Ln 328196, Col 0)
function Jf5(A) {
  let Q = 0,
    B = a7(A);
  for (let G of B)
    if (G.type === "assistant") {
      for (let Z of G.message.content)
        if (Z.type === "tool_use") Q++
    } return Q
}
// @from(Ln 328206, Col 0)
function uz0(A, Q, B) {
  let {
    prompt: G,
    resolvedAgentModel: Z,
    isBuiltInAgent: Y,
    startTime: J
  } = B, X = Qx(A);
  if (X === void 0) throw Error("No assistant messages found");
  let I = X.message.content.filter((K) => K.type === "text"),
    D = uSA(X.message.usage),
    W = Jf5(A);
  return l("tengu_agent_tool_completed", {
    model: Z,
    prompt_char_count: G.length,
    response_char_count: I.length,
    assistant_message_count: A.length,
    total_tool_uses: W,
    duration_ms: Date.now() - J,
    total_tokens: D,
    is_built_in_agent: Y
  }), {
    agentId: Q,
    content: I,
    totalDurationMs: Date.now() - J,
    totalTokens: D,
    totalToolUseCount: W,
    usage: X.message.usage
  }
}
// @from(Ln 328235, Col 4)
dz0
// @from(Ln 328235, Col 9)
gP2 = () => {
    return
  }
// @from(Ln 328238, Col 2)
Qf5 = 2000
// @from(Ln 328239, Col 2)
nkA
// @from(Ln 328239, Col 7)
uP2
// @from(Ln 328239, Col 12)
Tz0
// @from(Ln 328239, Col 17)
Bf5
// @from(Ln 328239, Col 22)
Gf5
// @from(Ln 328239, Col 27)
Zf5
// @from(Ln 328239, Col 32)
Yf5
// @from(Ln 328239, Col 37)
xVA