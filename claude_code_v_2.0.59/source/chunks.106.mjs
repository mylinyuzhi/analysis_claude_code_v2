
// @from(Start 9888621, End 9892288)
function bE(A, Q, B = 0, G = null, Z = null) {
  switch (A.type) {
    case "blockquote":
      return tA.dim.italic((A.tokens ?? []).map((I) => bE(I, Q)).join(""));
    case "code":
      if (A.lang && OMA.supportsLanguage(A.lang)) return OMA.highlight(A.text, {
        language: A.lang
      }) + eH;
      else return g(`Language not supported while highlighting code, falling back to markdown: ${A.lang}`), OMA.highlight(A.text, {
        language: "markdown"
      }) + eH;
    case "codespan":
      return ZB("permission", Q)(A.text);
    case "em":
      return tA.italic((A.tokens ?? []).map((I) => bE(I, Q)).join(""));
    case "strong":
      return tA.bold((A.tokens ?? []).map((I) => bE(I, Q)).join(""));
    case "del":
      return tA.strikethrough((A.tokens ?? []).map((I) => bE(I, Q)).join(""));
    case "heading":
      switch (A.depth) {
        case 1:
          return tA.bold.italic.underline((A.tokens ?? []).map((I) => bE(I, Q)).join("")) + eH + eH;
        case 2:
          return tA.bold((A.tokens ?? []).map((I) => bE(I, Q)).join("")) + eH + eH;
        default:
          return tA.bold((A.tokens ?? []).map((I) => bE(I, Q)).join("")) + eH + eH
      }
    case "hr":
      return "---";
    case "image":
      return A.href;
    case "link": {
      if (A.href.startsWith("mailto:")) return A.href.replace(/^mailto:/, "");
      return JZ2(A.href)
    }
    case "list":
      return A.items.map((I, Y) => bE(I, Q, B, A.ordered ? A.start + Y : null, A)).join("");
    case "list_item":
      return (A.tokens ?? []).map((I) => `${"  ".repeat(B)}${bE(I,Q,B+1,G,A)}`).join("");
    case "paragraph":
      return (A.tokens ?? []).map((I) => bE(I, Q)).join("") + eH;
    case "space":
      return eH;
    case "br":
      return eH;
    case "text":
      if (Z?.type === "list_item") return `${G===null?"-":HK5(B,G)+"."} ${A.tokens?A.tokens.map((I)=>bE(I,Q,B,G,A)).join(""):A.text}${eH}`;
      else return A.text;
    case "table": {
      let Y = function(X) {
          return cY(X?.map((V) => bE(V, Q)).join("") ?? "")
        },
        I = A,
        J = I.header.map((X, V) => {
          let F = Y(X.tokens).length;
          for (let K of I.rows) {
            let D = Y(K[V]?.tokens).length;
            F = Math.max(F, D)
          }
          return Math.max(F, 3)
        }),
        W = "| ";
      return I.header.forEach((X, V) => {
        let F = X.tokens?.map((E) => bE(E, Q)).join("") ?? "",
          K = Y(X.tokens),
          D = J[V],
          H = I.align?.[V],
          C;
        if (H === "center") {
          let E = D - K.length,
            U = Math.floor(E / 2),
            q = E - U;
          C = " ".repeat(U) + F + " ".repeat(q)
        } else if (H === "right") {
          let E = D - K.length;
          C = " ".repeat(E) + F
        } else C = F + " ".repeat(D - K.length);
        W += C + " | "
      }), W = W.trimEnd() + eH, W += "|", J.forEach((X) => {
        let V = "-".repeat(X + 2);
        W += V + "|"
      }), W += eH, I.rows.forEach((X) => {
        W += "| ", X.forEach((V, F) => {
          let K = V.tokens?.map((U) => bE(U, Q)).join("") ?? "",
            D = Y(V.tokens),
            H = J[F],
            C = I.align?.[F],
            E;
          if (C === "center") {
            let U = H - D.length,
              q = Math.floor(U / 2),
              w = U - q;
            E = " ".repeat(q) + K + " ".repeat(w)
          } else if (C === "right") {
            let U = H - D.length;
            E = " ".repeat(U) + K
          } else E = K + " ".repeat(H - D.length);
          W += E + " | "
        }), W = W.trimEnd() + eH
      }), W + eH
    }
  }
  return ""
}
// @from(Start 9892290, End 9892495)
function HK5(A, Q) {
  switch (A) {
    case 0:
    case 1:
      return Q.toString();
    case 2:
      return KK5[Q - 1];
    case 3:
      return DK5[Q - 1];
    default:
      return Q.toString()
  }
}
// @from(Start 9892500, End 9892503)
OMA
// @from(Start 9892505, End 9892508)
KK5
// @from(Start 9892510, End 9892513)
DK5
// @from(Start 9892519, End 9893221)
wh = L(() => {
  l10();
  cQ();
  F9();
  V0();
  ET();
  hA();
  WZ2();
  OMA = BA(p21(), 1);
  KK5 = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "aa", "ab", "ac", "ad", "ae", "af", "ag", "ah", "ai", "aj", "ak", "al", "am", "an", "ao", "ap", "aq", "ar", "as", "at", "au", "av", "aw", "ax", "ay", "az"], DK5 = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii", "xiii", "xiv", "xv", "xvi", "xvii", "xviii", "xix", "xx", "xxi", "xxii", "xxiii", "xxiv", "xxv", "xxvi", "xxvii", "xxviii", "xxix", "xxx", "xxxi", "xxxii", "xxxiii", "xxxiv", "xxxv", "xxxvi", "xxxvii", "xxxviii", "xxxix", "xl"]
})
// @from(Start 9893224, End 9893398)
function CK5(A) {
  if (!A.match(/<sandbox_violations>([\s\S]*?)<\/sandbox_violations>/)) return {
    cleanedStderr: A
  };
  return {
    cleanedStderr: e11(A).trim()
  }
}
// @from(Start 9893400, End 9894996)
function L1A({
  content: {
    stdout: A,
    stderr: Q,
    summary: B,
    isImage: G,
    returnCodeInterpretation: Z,
    backgroundTaskId: I
  },
  verbose: Y
}) {
  let [J] = qB(), {
    cleanedStderr: W
  } = CK5(Q);
  if (G) return AC.default.createElement(S0, {
    height: 1
  }, AC.default.createElement($, {
    dimColor: !0
  }, "[Image data detected and sent to Claude]"));
  if (B) {
    if (!Y) return AC.default.createElement(S, {
      flexDirection: "column"
    }, AC.default.createElement(_U, {
      content: fD(B, J),
      verbose: !1
    }));
    return AC.default.createElement(S, {
      flexDirection: "column"
    }, AC.default.createElement(_U, {
      content: B,
      verbose: Y
    }), (A !== "" || W !== "") && AC.default.createElement(S, {
      flexDirection: "column",
      marginTop: 1
    }, AC.default.createElement($, {
      bold: !0
    }, "=== Original Output ==="), A !== "" ? AC.default.createElement(_U, {
      content: A,
      verbose: Y
    }) : null, W !== "" ? AC.default.createElement(_U, {
      content: W,
      verbose: Y,
      isError: !0
    }) : null))
  }
  return AC.default.createElement(S, {
    flexDirection: "column"
  }, A !== "" ? AC.default.createElement(_U, {
    content: A,
    verbose: Y
  }) : null, W !== "" ? AC.default.createElement(_U, {
    content: W,
    verbose: Y,
    isError: !0
  }) : null, A === "" && W === "" ? AC.default.createElement(S0, {
    height: 1
  }, AC.default.createElement($, {
    dimColor: !0
  }, I ? "Running in the background (down arrow to manage)" : Z || "(No content)")) : null)
}
// @from(Start 9895001, End 9895003)
AC
// @from(Start 9895009, End 9895079)
l21 = L(() => {
  hA();
  QIA();
  q8();
  wh();
  AC = BA(VA(), 1)
})
// @from(Start 9895082, End 9896070)
function i21({
  output: A,
  fullOutput: Q,
  elapsedTimeSeconds: B,
  totalLines: G,
  verbose: Z
}) {
  let I = cY(Q.trim()),
    J = cY(A.trim()).split(`
`).filter((F) => F),
    W = Z ? I : J.slice(-5).join(`
`),
    X = Z ? 0 : G ? Math.max(0, G - 5) : 0,
    V = B !== void 0 ? `(${eC(B*1000)})` : void 0;
  if (!J.length) return mk.default.createElement(S0, null, mk.default.createElement($, {
    dimColor: !0
  }, "Running… ", V));
  return mk.default.createElement(S0, null, mk.default.createElement(S, {
    flexDirection: "column"
  }, mk.default.createElement(S, {
    height: Z ? void 0 : Math.min(5, J.length),
    flexDirection: "column",
    overflow: "hidden"
  }, mk.default.createElement($, {
    dimColor: !0
  }, W)), mk.default.createElement(S, {
    flexDirection: "row",
    gap: 1
  }, !Z && X > 0 && mk.default.createElement($, {
    dimColor: !0
  }, X > 0 && `+${X} more line${X===1?"":"s"}`), V && mk.default.createElement($, {
    dimColor: !0
  }, V))))
}
// @from(Start 9896075, End 9896077)
mk
// @from(Start 9896083, End 9896144)
q00 = L(() => {
  hA();
  ET();
  q8();
  mk = BA(VA(), 1)
})
// @from(Start 9896147, End 9896483)
function VZ2({
  onBackground: A
}) {
  f1((B, G) => {
    if (B === "b" && G.ctrl) A()
  });
  let Q = d0.terminal === "tmux" ? "ctrl+b ctrl+b" : "ctrl+b";
  return NI.createElement(S, {
    paddingLeft: 5
  }, NI.createElement($, {
    dimColor: !0
  }, NI.createElement(E4, {
    shortcut: Q,
    action: "run in background"
  })))
}
// @from(Start 9896485, End 9897162)
function FZ2(A, {
  verbose: Q,
  theme: B
}) {
  let {
    command: G
  } = A;
  if (!G) return null;
  let Z = G;
  if (G.includes(`"$(cat <<'EOF'`)) {
    let I = G.match(/^(.*?)"?\$\(cat <<'EOF'\n([\s\S]*?)\n\s*EOF\n\s*\)"(.*)$/);
    if (I && I[1] && I[2]) {
      let Y = I[1],
        J = I[2],
        W = I[3] || "";
      Z = `${Y.trim()} "${J.trim()}"${W.trim()}`
    }
  }
  if (!Q) {
    let I = Z.split(`
`),
      Y = I.length > XZ2,
      J = Z.length > N00;
    if (Y || J) {
      let W = Z;
      if (Y) W = I.slice(0, XZ2).join(`
`);
      if (W.length > N00) W = W.slice(0, N00);
      return NI.createElement($, null, W.trim(), "…")
    }
  }
  return Z
}
// @from(Start 9897164, End 9897218)
function KZ2() {
  return NI.createElement(k5, null)
}
// @from(Start 9897220, End 9897683)
function DZ2(A, {
  verbose: Q,
  tools: B,
  terminalSize: G,
  inProgressToolCallCount: Z
}) {
  let I = A.at(-1);
  if (!I || !I.data || !I.data.output) return NI.createElement(S0, {
    height: 1
  }, NI.createElement($, {
    dimColor: !0
  }, "Running…"));
  let Y = I.data;
  return NI.createElement(i21, {
    fullOutput: Y.fullOutput,
    output: Y.output,
    elapsedTimeSeconds: Y.elapsedTimeSeconds,
    totalLines: Y.totalLines,
    verbose: Q
  })
}
// @from(Start 9897685, End 9897811)
function HZ2() {
  return NI.createElement(S0, {
    height: 1
  }, NI.createElement($, {
    dimColor: !0
  }, "Waiting…"))
}
// @from(Start 9897813, End 9897958)
function CZ2(A, Q, {
  verbose: B,
  theme: G,
  tools: Z,
  style: I
}) {
  return NI.createElement(L1A, {
    content: A,
    verbose: B
  })
}
// @from(Start 9897960, End 9898109)
function EZ2(A, {
  verbose: Q,
  progressMessagesForMessage: B,
  tools: G
}) {
  return NI.createElement(Q6, {
    result: A,
    verbose: Q
  })
}
// @from(Start 9898114, End 9898116)
NI
// @from(Start 9898118, End 9898125)
XZ2 = 2
// @from(Start 9898129, End 9898138)
N00 = 160
// @from(Start 9898144, End 9898247)
L00 = L(() => {
  hA();
  iX();
  yJ();
  q8();
  l21();
  q00();
  c5();
  dF();
  NI = BA(VA(), 1)
})
// @from(Start 9898347, End 9898532)
function UZ2(A) {
  let Q = lF(A);
  if (Q.length === 0) return "other";
  for (let B of Q) {
    let G = B.split(" ")[0] || "";
    if (qK5.includes(G)) return G
  }
  return "other"
}
// @from(Start 9898534, End 9899033)
function LK5(A, Q) {
  if (Q !== 0) return;
  if (A.match(/\bgit\s+commit\b/)) {
    if (GA("tengu_git_operation", {
        operation: "commit"
      }), A.match(/--amend\b/)) GA("tengu_git_operation", {
      operation: "commit_amend"
    });
    fE0()?.add(1)
  }
  if (A.match(/\bgh\s+pr\s+create\b/)) GA("tengu_git_operation", {
    operation: "pr_create"
  }), PX1()?.add(1);
  if (A.match(/\bglab\s+mr\s+create\b/)) GA("tengu_git_operation", {
    operation: "pr_create"
  }), PX1()?.add(1)
}
// @from(Start 9899035, End 9899175)
function MK5(A) {
  let Q = lF(A);
  if (Q.length === 0) return !0;
  let B = Q[0]?.trim();
  if (!B) return !0;
  return !$K5.includes(B)
}
// @from(Start 9899177, End 9899586)
function OK5(A) {
  let B = l0().sandbox?.excludedCommands ?? [];
  if (B.length === 0) return !1;
  for (let G of B) {
    let Z = po1(G);
    switch (Z.type) {
      case "exact":
        if (A.trim() === Z.command) return !0;
        break;
      case "prefix": {
        let I = A.trim();
        if (I === Z.prefix || I.startsWith(Z.prefix + " ")) return !0;
        break
      }
    }
  }
  return !1
}
// @from(Start 9899588, End 9899809)
function WIA(A) {
  if (!nQ.isSandboxingEnabled()) return !1;
  if (A.dangerouslyDisableSandbox && nQ.areUnsandboxedCommandsAllowed()) return !1;
  if (!A.command) return !1;
  if (OK5(A.command)) return !1;
  return !0
}
// @from(Start 9899810, End 9899861)
async function RK5(A, Q, B, G, Z) {
  return null
}
// @from(Start 9899862, End 9901864)
async function* TK5({
  input: A,
  abortController: Q,
  setAppState: B,
  setToolJSX: G,
  preventCwdChanges: Z
}) {
  let {
    command: I,
    description: Y,
    timeout: J,
    shellExecutable: W,
    run_in_background: X
  } = A, V = J || ZGA(), F = "", K = "", D = 0, H = void 0, C = MK5(I), E = await $rA(I, Q.signal, V, W, (y, v, x) => {
    K = y, F = v, D = x
  }, Z, WIA(A), C), U = E.result;

  function q(y, v) {
    B((x) => {
      let p = x.backgroundTasks[y];
      if (p && p.type !== "shell") return x;
      return {
        ...x,
        backgroundTasks: {
          ...x.backgroundTasks,
          [y]: v(p)
        }
      }
    })
  }

  function w(y, v) {
    let x = Fo1(I, E, Y || I, q);
    if (H = x, GA(y, {
        command_type: UZ2(I)
      }), v) v(x)
  }

  function N() {
    w("tengu_bash_command_backgrounded")
  }
  if (E.onTimeout && C) E.onTimeout((y) => {
    w("tengu_bash_command_timeout_backgrounded", y)
  });
  if (X === !0) {
    let y = Fo1(I, E, Y || I, q);
    return GA("tengu_bash_command_explicitly_backgrounded", {
      command_type: UZ2(I)
    }), {
      stdout: "",
      stderr: "",
      code: 0,
      interrupted: !1,
      backgroundTaskId: y
    }
  }
  let R = Date.now(),
    T = R + zZ2;
  while (!0) {
    let y = Date.now(),
      v = Math.max(0, T - y),
      x = await Promise.race([U, new Promise((e) => setTimeout(() => e(null), v))]);
    if (x !== null) return x;
    if (H) return {
      stdout: "",
      stderr: "",
      code: 0,
      interrupted: !1,
      backgroundTaskId: H
    };
    let p = Date.now() - R,
      u = Math.floor(p / 1000);
    if (H === void 0 && u >= zZ2 / 1000 && G) G({
      jsx: M00.createElement(VZ2, {
        onBackground: N
      }),
      shouldHidePromptInput: !1,
      shouldContinueAnimation: !0,
      showSpinner: !0
    });
    yield {
      type: "progress",
      fullOutput: F,
      output: K,
      elapsedTimeSeconds: u,
      totalLines: D
    }, T = Date.now() + UK5
  }
}
// @from(Start 9901865, End 9903789)
async function PK5(A, Q, B) {
  try {
    let G = JSON.parse(A),
      {
        content: Z,
        type: I,
        schema: Y
      } = await b10(G, B.tool, B.server);
    if (!await $e1(Z)) {
      if (Array.isArray(Z)) return {
        stdout: kOB(Z),
        structuredContent: Z,
        rawOutputPath: void 0
      };
      else if (typeof Z === "string") return {
        stdout: Z,
        structuredContent: void 0,
        rawOutputPath: void 0
      };
      return null
    }
    let W = typeof Z === "string" ? Z : JSON.stringify(Z, null, 2),
      X = _OB(W, Q),
      V;
    switch (I) {
      case "toolResult":
        V = "Plain text";
        break;
      case "structuredContent":
        V = Y ? `JSON with schema: ${Y}` : "JSON";
        break;
      case "contentArray":
        V = Y ? `JSON array with schema: ${Y}` : "JSON array";
        break
    }
    return {
      stdout: `Error: result (${W.length.toLocaleString()} characters) exceeds maximum allowed tokens. Output has been saved to ${X}.
Format: ${V}
Use offset and limit parameters to read specific portions of the file, the ${xY} tool to search for specific content, and jq to make structured queries.
REQUIREMENTS FOR SUMMARIZATION/ANALYSIS/REVIEW:
- You MUST read the content from the file at ${X} in sequential chunks until 100% of the content has been read.
- If you receive truncation warnings when reading the file ("[N lines truncated]"), reduce the chunk size until you have read 100% of the content without truncation ***DO NOT PROCEED UNTIL YOU HAVE DONE THIS***. Bash output is limited to ${Ge().toLocaleString()} chars.
- Before producing ANY summary or analysis, you MUST explicitly describe what portion of the content you have read. ***If you did not read the entire content, you MUST explicitly state this.***
`,
      structuredContent: void 0,
      rawOutputPath: X
    }
  } catch (G) {
    return AA(G), null
  }
}
// @from(Start 9903794, End 9903797)
M00
// @from(Start 9903799, End 9903809)
zZ2 = 2000
// @from(Start 9903813, End 9903823)
UK5 = 1000
// @from(Start 9903827, End 9903830)
$K5
// @from(Start 9903832, End 9903835)
wK5
// @from(Start 9903837, End 9903840)
qK5
// @from(Start 9903842, End 9903845)
NK5
// @from(Start 9903847, End 9903849)
D9
// @from(Start 9903855, End 9913427)
pF = L(() => {
  Q2();
  fOB();
  bU();
  g1();
  OZ();
  ot();
  U2();
  hQ();
  Dq();
  _AA();
  IGA();
  $J();
  vM();
  Np();
  ao1();
  to1();
  u2();
  q0();
  _0();
  Ok();
  vQ1();
  MB();
  RZ();
  b32();
  IGA();
  _0();
  L00();
  u_();
  dH();
  yR();
  M00 = BA(VA(), 1), $K5 = ["sleep"], wK5 = j.strictObject({
    command: j.string().describe("The command to execute"),
    timeout: j.number().optional().describe(`Optional timeout in milliseconds (max ${zrA()})`),
    description: j.string().optional().describe(`Clear, concise description of what this command does in 5-10 words, in active voice. Examples:
Input: ls
Output: List files in current directory

Input: git status
Output: Show working tree status

Input: npm install
Output: Install package dependencies

Input: mkdir foo
Output: Create directory 'foo'`),
    run_in_background: j.boolean().optional().describe("Set to true to run this command in the background. Use BashOutput to read the output later."),
    dangerouslyDisableSandbox: j.boolean().optional().describe("Set this to true to dangerously override sandbox mode and run commands without sandboxing.")
  }), qK5 = ["npm", "yarn", "pnpm", "node", "python", "python3", "go", "cargo", "make", "docker", "terraform", "webpack", "vite", "jest", "pytest", "curl", "wget", "build", "test", "serve", "watch", "dev"];
  NK5 = j.object({
    stdout: j.string().describe("The standard output of the command"),
    stderr: j.string().describe("The standard error output of the command"),
    summary: j.string().optional().describe("Summarized output when available"),
    rawOutputPath: j.string().optional().describe("Path to raw output file when summarized"),
    interrupted: j.boolean().describe("Whether the command was interrupted"),
    isImage: j.boolean().optional().describe("Flag to indicate if stdout contains image data"),
    backgroundTaskId: j.string().optional().describe("ID of the background task if command is running in background"),
    dangerouslyDisableSandbox: j.boolean().optional().describe("Flag to indicate if sandbox mode was overridden"),
    returnCodeInterpretation: j.string().optional().describe("Semantic interpretation for non-error exit codes with special meaning"),
    structuredContent: j.array(j.any()).optional().describe("Structured content blocks from mcp-cli commands")
  });
  D9 = {
    name: C9,
    strict: !0,
    async description({
      description: A
    }) {
      return A || "Run shell command"
    },
    async prompt() {
      return EOB()
    },
    isConcurrencySafe(A) {
      return this.isReadOnly(A)
    },
    isReadOnly(A) {
      return B12(A).behavior === "allow"
    },
    inputSchema: wK5,
    outputSchema: NK5,
    userFacingName(A) {
      if (!A) return "Bash";
      return WIA(A) && Y0(process.env.CLAUDE_CODE_BASH_SANDBOX_SHOW_INDICATOR) ? "SandboxedBash" : "Bash"
    },
    getToolUseSummary(A) {
      if (!A?.command) return null;
      let {
        command: Q,
        description: B
      } = A;
      if (B) return B;
      return J7(Q, $k)
    },
    isEnabled() {
      return !0
    },
    async checkPermissions(A, Q) {
      return await no1(A, Q)
    },
    renderToolUseMessage: FZ2,
    renderToolUseRejectedMessage: KZ2,
    renderToolUseProgressMessage: DZ2,
    renderToolUseQueuedMessage: HZ2,
    renderToolResultMessage: CZ2,
    mapToolResultToToolResultBlockParam({
      interrupted: A,
      stdout: Q,
      stderr: B,
      summary: G,
      isImage: Z,
      backgroundTaskId: I,
      structuredContent: Y
    }, J) {
      if (Y && Y.length > 0) return {
        tool_use_id: J,
        type: "tool_result",
        content: Y
      };
      if (Z) {
        let F = Q.trim().match(/^data:([^;]+);base64,(.+)$/);
        if (F) {
          let K = F[1],
            D = F[2];
          return {
            tool_use_id: J,
            type: "tool_result",
            content: [{
              type: "image",
              source: {
                type: "base64",
                media_type: K || "image/jpeg",
                data: D || ""
              }
            }]
          }
        }
      }
      if (G) return {
        tool_use_id: J,
        type: "tool_result",
        content: G,
        is_error: A
      };
      let W = Q;
      if (Q) W = Q.replace(/^(\s*\n)+/, ""), W = W.trimEnd();
      let X = B.trim();
      if (A) {
        if (B) X += TMA;
        X += "<error>Command was aborted before completion</error>"
      }
      let V = I ? `Command running in background with ID: ${I}` : "";
      return {
        tool_use_id: J,
        type: "tool_result",
        content: [W, X, V].filter(Boolean).join(`
`),
        is_error: A
      }
    },
    async call(A, Q, B, G, Z) {
      let {
        abortController: I,
        readFileState: Y,
        getAppState: J,
        setAppState: W,
        setToolJSX: X,
        messages: V
      } = Q, F = new h7A, K = new h7A, D, H = 0, C = !1, E, q = Q.agentId !== e1();
      try {
        let FA = TK5({
            input: A,
            abortController: I,
            setAppState: W,
            setToolJSX: X,
            preventCwdChanges: q
          }),
          zA;
        do
          if (zA = await FA.next(), !zA.done && Z) {
            let OA = zA.value;
            Z({
              toolUseID: `bash-progress-${H++}`,
              data: {
                type: "bash_progress",
                output: OA.output,
                fullOutput: OA.fullOutput,
                elapsedTimeSeconds: OA.elapsedTimeSeconds,
                totalLines: OA.totalLines
              }
            })
          } while (!zA.done);
        if (E = zA.value, LK5(A.command, E.code), F.append((E.stdout || "").trimEnd() + TMA), D = v32(A.command, E.code, E.stdout || "", E.stderr || ""), E.stderr && E.stderr.includes(".git/index.lock': File exists")) GA("tengu_git_index_lock_error", {});
        if (D.isError) {
          if (K.append(E.stderr.trimEnd() + TMA), E.code !== 0) K.append(`Exit code ${E.code}`)
        } else if (hAA(A.command) !== null) K.append(E.stderr.trimEnd() + TMA);
        else F.append(E.stderr.trimEnd() + TMA);
        if (!q) {
          let OA = await J();
          if (qrA(OA.toolPermissionContext)) {
            let mA = K.toString();
            K.clear(), K.append(wrA(mA))
          }
        }
        let NA = nQ.annotateStderrWithSandboxFailures(A.command, E.stderr || "");
        if (D.isError) throw new tj(E.stdout, NA, E.code, E.interrupted);
        C = E.interrupted
      } finally {
        if (X) X(null)
      }
      let w = F.toString(),
        N = K.toString();
      {
        let FA = o9();
        SOB(A.command, w, FA.signal, Q.options.isNonInteractiveSession).then(async (zA) => {
          for (let NA of zA) {
            let OA = EK5(NA) ? NA : zK5(W0(), NA);
            try {
              if (!(await n8.validateInput({
                  file_path: OA
                }, Q)).result) {
                Y.delete(OA);
                continue
              }
              await n8.call({
                file_path: OA
              }, Q)
            } catch (mA) {
              Y.delete(OA), AA(mA)
            }
          }
          GA("tengu_bash_tool_haiku_file_paths_read", {
            filePathsExtracted: zA.length,
            readFileStateSize: Y.size,
            readFileStateValuesCharLength: _l(Y).reduce((NA, OA) => {
              let mA = Y.get(OA);
              return NA + (mA?.content.length || 0)
            }, 0)
          })
        }).catch((zA) => {
          if (zA instanceof Error && zA.message.includes("Request was aborted")) return;
          AA(zA)
        })
      }
      let R = await RK5(w, N, A.command, I, V || []),
        T = R?.shouldSummarize === !0,
        y = R?.modelReason,
        v = A.command.split(" ")[0];
      GA("tengu_bash_tool_command_executed", {
        command_type: v,
        stdout_length: w.length,
        stderr_length: N.length,
        exit_code: E.code,
        interrupted: C,
        summarization_attempted: R !== null,
        summarization_succeeded: T,
        summarization_duration_ms: R?.queryDurationMs,
        summarization_reason: !T && R ? R.reason : void 0,
        model_summarization_reason: y,
        summary_length: R?.shouldSummarize && R.summary ? R.summary.length : void 0
      });
      let {
        truncatedContent: x,
        isImage: p
      } = m_(Ff(w)), {
        truncatedContent: u
      } = m_(Ff(N)), e = void 0, l = x, k = void 0, m = hAA(A.command);
      if (m !== null) {
        let FA = await PK5(w, A.command, m);
        if (FA !== null) l = FA.stdout, k = FA.structuredContent, e = FA.rawOutputPath
      }
      let o = l;
      if (p) {
        let FA = l.trim().match(/^data:([^;]+);base64,(.+)$/);
        if (FA && FA[1] && FA[2]) {
          let zA = FA[1],
            NA = FA[2],
            OA = Buffer.from(NA, "base64"),
            mA = await rt(OA, void 0, zA);
          o = `data:${mA.mediaType};base64,${mA.base64}`
        }
      }
      return {
        data: {
          stdout: o,
          stderr: u,
          summary: T ? R?.summary : void 0,
          rawOutputPath: T ? R?.rawOutputPath : e,
          interrupted: C,
          isImage: p,
          returnCodeInterpretation: D?.message,
          backgroundTaskId: E.backgroundTaskId,
          structuredContent: k,
          dangerouslyDisableSandbox: "dangerouslyDisableSandbox" in A ? A.dangerouslyDisableSandbox : void 0
        }
      }
    },
    renderToolUseErrorMessage: EZ2
  }
})
// @from(Start 9913430, End 9914231)
function n21({
  ruleValue: A
}) {
  switch (A.toolName) {
    case D9.name:
      if (A.ruleContent)
        if (A.ruleContent.endsWith(":*")) return fE.createElement($, {
          dimColor: !0
        }, "Any Bash command starting with", " ", fE.createElement($, {
          bold: !0
        }, A.ruleContent.slice(0, -2)));
        else return fE.createElement($, {
          dimColor: !0
        }, "The Bash command ", fE.createElement($, {
          bold: !0
        }, A.ruleContent));
      else return fE.createElement($, {
        dimColor: !0
      }, "Any Bash command");
    default:
      if (!A.ruleContent) return fE.createElement($, {
        dimColor: !0
      }, "Any use of the ", fE.createElement($, {
        bold: !0
      }, A.toolName), " tool");
      else return null
  }
}
// @from(Start 9914236, End 9914238)
fE
// @from(Start 9914244, End 9914297)
O00 = L(() => {
  hA();
  pF();
  fE = BA(VA(), 1)
})
// @from(Start 9914300, End 9915274)
function jK5({
  orientation: A = "horizontal",
  width: Q = "auto",
  dividerChar: B,
  dividerColor: G,
  dividerDimColor: Z = !0,
  boxProps: I
}) {
  let Y = A === "vertical",
    J = B || (Y ? "│" : "─");
  if (Y) return Li.default.createElement(S, {
    height: "100%",
    borderStyle: {
      topLeft: "",
      top: "",
      topRight: "",
      right: J,
      bottomRight: "",
      bottom: "",
      bottomLeft: "",
      left: ""
    },
    borderColor: G,
    borderDimColor: Z,
    borderBottom: !1,
    borderTop: !1,
    borderLeft: !1,
    borderRight: !0,
    ...I
  });
  return Li.default.createElement(S, {
    width: Q,
    borderStyle: {
      topLeft: "",
      top: "",
      topRight: "",
      right: "",
      bottomRight: "",
      bottom: J,
      bottomLeft: "",
      left: ""
    },
    borderColor: G,
    borderDimColor: Z,
    flexGrow: 1,
    borderBottom: !0,
    borderTop: !1,
    borderLeft: !1,
    borderRight: !1,
    ...I
  })
}
// @from(Start 9915276, End 9916074)
function SK5({
  orientation: A = "horizontal",
  title: Q,
  width: B = "auto",
  padding: G = 0,
  titlePadding: Z = 1,
  titleColor: I = "text",
  titleDimColor: Y = !0,
  dividerChar: J,
  dividerColor: W,
  dividerDimColor: X = !0,
  boxProps: V
}) {
  let F = A === "vertical",
    D = Li.default.createElement(jK5, {
      orientation: A,
      dividerChar: J || (F ? "│" : "─"),
      dividerColor: W,
      dividerDimColor: X,
      boxProps: V
    });
  if (F) return D;
  if (!Q) return Li.default.createElement(S, {
    paddingLeft: G,
    paddingRight: G
  }, D);
  return Li.default.createElement(S, {
    width: B,
    paddingLeft: G,
    paddingRight: G,
    gap: Z
  }, D, Li.default.createElement(S, null, Li.default.createElement($, {
    color: I,
    dimColor: Y
  }, Q)), D)
}
// @from(Start 9916079, End 9916081)
Li
// @from(Start 9916083, End 9916085)
D3
// @from(Start 9916091, End 9916147)
BK = L(() => {
  hA();
  Li = BA(VA(), 1);
  D3 = SK5
})
// @from(Start 9916150, End 9916472)
function hD({
  title: A,
  subtitle: Q,
  children: B,
  onCancel: G,
  color: Z,
  borderDimColor: I,
  hideInputGuide: Y,
  hideBorder: J
}) {
  return GK.default.createElement(_K5, {
    title: A,
    subtitle: Q,
    onCancel: G,
    color: Z,
    borderDimColor: I,
    hideInputGuide: Y,
    hideBorder: J
  }, B)
}
// @from(Start 9916474, End 9917719)
function _K5({
  title: A,
  subtitle: Q,
  children: B,
  onCancel: G,
  color: Z = "permission",
  borderDimColor: I = !0,
  hideInputGuide: Y,
  hideBorder: J
}) {
  let W = EQ();
  return f1((X, V) => {
    if (V.escape) {
      G();
      return
    }
  }), GK.default.createElement(GK.default.Fragment, null, GK.default.createElement(S, {
    flexDirection: "column",
    paddingBottom: 1
  }, !J && GK.default.createElement(D3, {
    dividerColor: Z,
    dividerDimColor: I
  }), GK.default.createElement(S, {
    flexDirection: "column",
    paddingX: J ? 0 : 1,
    gap: 1
  }, GK.default.createElement(S, {
    flexDirection: "column"
  }, GK.default.createElement($, {
    bold: !0,
    color: Z
  }, A), Q && GK.default.createElement($, {
    dimColor: !0
  }, Q)), B)), !Y && GK.default.createElement(S, {
    paddingX: J ? 0 : 1
  }, GK.default.createElement($, {
    dimColor: !0,
    italic: !0
  }, W.pending ? GK.default.createElement(GK.default.Fragment, null, "Press ", W.keyName, " again to exit") : GK.default.createElement(GK.default.Fragment, null, GK.default.createElement(E4, {
    shortcut: "Enter",
    action: "confirm"
  }), " · ", GK.default.createElement(E4, {
    shortcut: "Esc",
    action: "cancel"
  })))))
}
// @from(Start 9917724, End 9917726)
GK
// @from(Start 9917732, End 9917800)
Mi = L(() => {
  hA();
  Q4();
  BK();
  dF();
  GK = BA(VA(), 1)
})
// @from(Start 9917803, End 9918285)
function R00(A) {
  switch (A) {
    case "localSettings":
      return {
        label: "Project settings (local)", description: `Saved in ${PMA("localSettings")}`, value: A
      };
    case "projectSettings":
      return {
        label: "Project settings", description: `Checked in at ${PMA("projectSettings")}`, value: A
      };
    case "userSettings":
      return {
        label: "User settings", description: "Saved in at ~/.claude/settings.json", value: A
      }
  }
}
// @from(Start 9918287, End 9919700)
function wZ2({
  onAddRules: A,
  onCancel: Q,
  ruleValues: B,
  ruleBehavior: G,
  initialContext: Z,
  setToolPermissionContext: I
}) {
  let Y = HYA.map(R00),
    J = $Z2.useCallback((X) => {
      if (X === "cancel") {
        Q();
        return
      } else if (HYA.includes(X)) {
        let V = X,
          F = UF(Z, {
            type: "addRules",
            rules: B,
            behavior: G,
            destination: V
          });
        Iv({
          type: "addRules",
          rules: B,
          behavior: G,
          destination: V
        }), I(F);
        let K = B.map((D) => ({
          ruleValue: D,
          ruleBehavior: G,
          source: V
        }));
        A(K)
      }
    }, [A, Q, B, G, Z, I]),
    W = `Add ${G} permission rule${B.length===1?"":"s"}`;
  return gD.createElement(hD, {
    title: W,
    onCancel: Q,
    color: "permission"
  }, gD.createElement(S, {
    flexDirection: "column",
    paddingX: 2
  }, B.map((X) => gD.createElement(S, {
    flexDirection: "column",
    key: B3(X)
  }, gD.createElement($, {
    bold: !0
  }, B3(X)), gD.createElement(n21, {
    ruleValue: X
  })))), gD.createElement(S, {
    flexDirection: "column",
    marginY: 1
  }, gD.createElement($, null, B.length === 1 ? "Where should this rule be saved?" : "Where should these rules be saved?"), gD.createElement(M0, {
    options: Y,
    onChange: J,
    onCancel: Q
  })))
}
// @from(Start 9919705, End 9919707)
gD
// @from(Start 9919709, End 9919712)
$Z2
// @from(Start 9919714, End 9919717)
HYA
// @from(Start 9919723, End 9919906)
a21 = L(() => {
  hA();
  S5();
  AZ();
  cK();
  cK();
  O00();
  MB();
  Mi();
  gD = BA(VA(), 1), $Z2 = BA(VA(), 1);
  HYA = ["localSettings", "projectSettings", "userSettings"]
})
// @from(Start 9919909, End 9920076)
function s21(A, Q, B, G, Z, I, Y) {
  let J = {
    type: "function",
    timeout: Y?.timeout || 5000,
    callback: Z,
    errorMessage: I
  };
  kK5(A, Q, B, G, J)
}
// @from(Start 9920078, End 9920827)
function kK5(A, Q, B, G, Z, I) {
  A((Y) => {
    let J = Y.sessionHooks[Q] || {
        hooks: {}
      },
      W = J.hooks[B] || [],
      X = W.findIndex((K) => K.matcher === G),
      V;
    if (X >= 0) {
      V = [...W];
      let K = V[X];
      V[X] = {
        matcher: K.matcher,
        hooks: [...K.hooks, {
          hook: Z,
          onHookSuccess: I
        }]
      }
    } else V = [...W, {
      matcher: G,
      hooks: [{
        hook: Z,
        onHookSuccess: I
      }]
    }];
    let F = {
      ...J.hooks,
      [B]: V
    };
    return {
      ...Y,
      sessionHooks: {
        ...Y.sessionHooks,
        [Q]: {
          hooks: F
        }
      }
    }
  }), g(`Added session hook for event ${B} in session ${Q}`)
}
// @from(Start 9920829, End 9920978)
function qZ2(A) {
  return A.map((Q) => ({
    matcher: Q.matcher,
    hooks: Q.hooks.map((B) => B.hook).filter((B) => B.type !== "function")
  }))
}
// @from(Start 9920980, End 9921250)
function r21(A, Q, B) {
  let G = A.sessionHooks[Q];
  if (!G) return new Map;
  let Z = new Map;
  if (B) {
    let I = G.hooks[B];
    if (I) Z.set(B, qZ2(I));
    return Z
  }
  for (let I of zLA) {
    let Y = G.hooks[I];
    if (Y) Z.set(I, qZ2(Y))
  }
  return Z
}
// @from(Start 9921252, End 9921514)
function NZ2(A, Q, B, G, Z) {
  let I = A.sessionHooks[Q];
  if (!I) return;
  let Y = I.hooks[B];
  if (!Y) return;
  for (let J of Y)
    if (J.matcher === G || G === "") {
      let W = J.hooks.find((X) => SMA(X.hook, Z));
      if (W) return W
    } return
}
// @from(Start 9921516, End 9921716)
function o21(A, Q) {
  A((B) => {
    let G = {
      ...B.sessionHooks
    };
    return delete G[Q], {
      ...B,
      sessionHooks: G
    }
  }), g(`Cleared all session hooks for session ${Q}`)
}
// @from(Start 9921721, End 9921763)
jMA = L(() => {
  oQ1();
  V0();
  dk()
})
// @from(Start 9921766, End 9922121)
function SMA(A, Q) {
  if (A.type !== Q.type) return !1;
  switch (A.type) {
    case "command":
      return Q.type === "command" && A.command === Q.command;
    case "prompt":
      return Q.type === "prompt" && A.prompt === Q.prompt;
    case "agent":
      return Q.type === "agent" && A.prompt === Q.prompt;
    case "function":
      return !1
  }
}
// @from(Start 9922123, End 9922458)
function hE(A) {
  if ("statusMessage" in A && A.statusMessage) return A.statusMessage;
  switch (A.type) {
    case "command":
      return A.command;
    case "prompt":
      return A.prompt;
    case "agent":
      return A.prompt([]);
    case "callback":
      return "callback";
    case "function":
      return "function"
  }
}
// @from(Start 9922460, End 9923177)
function LZ2(A) {
  let Q = [];
  if (OB("policySettings")?.allowManagedHooksOnly !== !0) {
    let Y = ["userSettings", "projectSettings", "localSettings"];
    for (let J of Y) {
      let W = OB(J);
      if (!W?.hooks) continue;
      for (let [X, V] of Object.entries(W.hooks))
        for (let F of V)
          for (let K of F.hooks) Q.push({
            event: X,
            config: K,
            matcher: F.matcher,
            source: J
          })
    }
  }
  let Z = e1(),
    I = r21(A, Z);
  for (let [Y, J] of I.entries())
    for (let W of J)
      for (let X of W.hooks) Q.push({
        event: Y,
        config: X,
        matcher: W.matcher,
        source: "sessionHook"
      });
  return Q
}
// @from(Start 9923178, End 9923671)
async function MZ2(A, Q, B = "", G = "userSettings") {
  let I = (OB(G) ?? {}).hooks ?? {},
    Y = I[A] ?? [],
    J = Y.findIndex((F) => F.matcher === B),
    W;
  if (J >= 0) {
    W = [...Y];
    let F = W[J];
    W[J] = {
      matcher: F.matcher,
      hooks: [...F.hooks, Q]
    }
  } else W = [...Y, {
    matcher: B,
    hooks: [Q]
  }];
  let X = {
      ...I,
      [A]: W
    },
    {
      error: V
    } = cB(G, {
      hooks: X
    });
  if (V) throw Error(V.message);
  _MA()
}
// @from(Start 9923672, End 9924503)
async function OZ2(A) {
  if (A.source === "pluginHook") throw Error("Plugin hooks cannot be removed through settings. Disable the plugin instead.");
  if (A.source === "sessionHook") throw Error("Session hooks cannot be removed through settings. They are temporary and will be cleared when the session ends.");
  let Q = OB(A.source) ?? {},
    B = Q.hooks ?? {},
    Z = (B[A.event] ?? []).map((J) => {
      if (J.matcher === A.matcher) {
        let W = J.hooks.filter((X) => !SMA(X, A.config));
        return W.length > 0 ? {
          ...J,
          hooks: W
        } : null
      }
      return J
    }).filter((J) => J !== null),
    I = {
      ...B,
      [A.event]: Z.length > 0 ? Z : void 0
    },
    Y = Object.values(I).some((J) => J !== void 0);
  cB(A.source, {
    ...Q,
    hooks: Y ? I : void 0
  }), _MA()
}
// @from(Start 9924505, End 9924992)
function RZ2(A) {
  switch (A) {
    case "userSettings":
      return "User settings (~/.claude/settings.json)";
    case "projectSettings":
      return "Project settings (.claude/settings.json)";
    case "localSettings":
      return "Local settings (.claude/settings.local.json)";
    case "pluginHook":
      return "Plugin hooks (~/.claude/plugins/*/hooks/hooks.json)";
    case "sessionHook":
      return "Session hooks (in-memory, temporary)";
    default:
      return A
  }
}
// @from(Start 9924994, End 9925339)
function T00(A) {
  switch (A) {
    case "userSettings":
      return "User Settings";
    case "projectSettings":
      return "Project Settings";
    case "localSettings":
      return "Local Settings";
    case "pluginHook":
      return "Plugin Hooks";
    case "sessionHook":
      return "Session Hooks";
    default:
      return A
  }
}
// @from(Start 9925341, End 9925647)
function TZ2(A) {
  switch (A) {
    case "userSettings":
      return "User";
    case "projectSettings":
      return "Project";
    case "localSettings":
      return "Local";
    case "pluginHook":
      return "Plugin";
    case "sessionHook":
      return "Session";
    default:
      return A
  }
}
// @from(Start 9925649, End 9926124)
function PZ2(A, Q, B) {
  let G = HYA.reduce((Z, I, Y) => {
    return Z[I] = Y, Z
  }, {});
  return [...A].sort((Z, I) => {
    let Y = Q[B]?.[Z] || [],
      J = Q[B]?.[I] || [],
      W = Array.from(new Set(Y.map((D) => D.source))),
      X = Array.from(new Set(J.map((D) => D.source))),
      V = (D) => D === "pluginHook" ? 999 : G[D],
      F = Math.min(...W.map(V)),
      K = Math.min(...X.map(V));
    if (F !== K) return F - K;
    return Z.localeCompare(I)
  })
}
// @from(Start 9926129, End 9926188)
dk = L(() => {
  MB();
  a21();
  CYA();
  jMA();
  _0()
})
// @from(Start 9926191, End 9926328)
function P00() {
  let A = OB("policySettings");
  if (A?.allowManagedHooksOnly === !0) return A.hooks ?? {};
  return l0().hooks ?? {}
}
// @from(Start 9926330, End 9926408)
function t21() {
  return OB("policySettings")?.allowManagedHooksOnly === !0
}
// @from(Start 9926410, End 9926839)
function j00(A) {
  if (!A) return null;
  let Q = {},
    B = Object.keys(A).sort();
  for (let G of B) {
    let Z = A[G];
    if (!Z) continue;
    let I = [...Z].sort((Y, J) => {
      let W = Y.matcher || "",
        X = J.matcher || "";
      return W.localeCompare(X)
    });
    Q[G] = I.map((Y) => ({
      matcher: Y.matcher,
      hooks: [...Y.hooks].sort((J, W) => hE(J).localeCompare(hE(W)))
    }))
  }
  return Q
}
// @from(Start 9926841, End 9926890)
function S00() {
  let A = P00();
  Oi = j00(A)
}
// @from(Start 9926892, End 9926941)
function _MA() {
  let A = P00();
  Oi = j00(A)
}
// @from(Start 9926943, End 9928292)
function jZ2() {
  if (Oi === null) return null;
  let A = j00(P00()),
    Q = JSON.stringify(Oi),
    B = JSON.stringify(A);
  if (Q === B) return null;
  let G = [],
    Z = new Set(Object.keys(Oi || {})),
    I = new Set(Object.keys(A || {}));
  for (let Y of I)
    if (!Z.has(Y)) G.push(`Added hooks for event: ${Y}`);
  for (let Y of Z)
    if (!I.has(Y)) G.push(`Removed all hooks for event: ${Y}`);
  for (let Y of Z)
    if (I.has(Y)) {
      let J = Oi?.[Y] || [],
        W = A?.[Y] || [];
      if (JSON.stringify(J) !== JSON.stringify(W)) {
        let X = [],
          V = new Map(J.map((K) => [K.matcher || "", K])),
          F = new Map(W.map((K) => [K.matcher || "", K]));
        for (let [K] of F)
          if (!V.has(K)) X.push(`  - Added matcher: ${K||"(no matcher)"}`);
        for (let [K] of V)
          if (!F.has(K)) X.push(`  - Removed matcher: ${K||"(no matcher)"}`);
        for (let [K, D] of F)
          if (V.has(K)) {
            let H = V.get(K);
            if (JSON.stringify(H.hooks) !== JSON.stringify(D.hooks)) X.push(`  - Modified hooks for matcher: ${K||"(no matcher)"}`)
          } if (X.length > 0) G.push(`Modified hooks for event: ${Y}`), G.push(...X);
        else G.push(`Modified hooks for event: ${Y}`)
      }
    } return G.length > 0 ? G.join(`
`) : "Hooks configuration has been modified"
}
// @from(Start 9928294, End 9928350)
function SZ2() {
  if (Oi === null) S00();
  return Oi
}
// @from(Start 9928355, End 9928364)
Oi = null
// @from(Start 9928370, End 9928411)
CYA = L(() => {
  MB();
  dk();
  _0()
})
// @from(Start 9928417, End 9928420)
ixG
// @from(Start 9928422, End 9928425)
e21
// @from(Start 9928431, End 9928590)
_Z2 = L(() => {
  Q2();
  ixG = W2.enum(["allow", "deny", "ask"]), e21 = W2.object({
    toolName: W2.string(),
    ruleContent: W2.string().optional()
  })
})
// @from(Start 9928596, End 9928599)
EYA
// @from(Start 9928601, End 9928604)
A91
// @from(Start 9928610, End 9929562)
_00 = L(() => {
  Q2();
  _Z2();
  Zw();
  EYA = W2.enum(["userSettings", "projectSettings", "localSettings", "session", "cliArg"]), A91 = W2.discriminatedUnion("type", [W2.object({
    type: W2.literal("addRules"),
    rules: W2.array(e21),
    behavior: W2.enum(["allow", "deny", "ask"]),
    destination: EYA
  }), W2.object({
    type: W2.literal("replaceRules"),
    rules: W2.array(e21),
    behavior: W2.enum(["allow", "deny", "ask"]),
    destination: EYA
  }), W2.object({
    type: W2.literal("removeRules"),
    rules: W2.array(e21),
    behavior: W2.enum(["allow", "deny", "ask"]),
    destination: EYA
  }), W2.object({
    type: W2.literal("setMode"),
    mode: Qc0,
    destination: EYA
  }), W2.object({
    type: W2.literal("addDirectories"),
    directories: W2.array(W2.string()),
    destination: EYA
  }), W2.object({
    type: W2.literal("removeDirectories"),
    directories: W2.array(W2.string()),
    destination: EYA
  })])
})
// @from(Start 9929565, End 9929629)
function kZ2(A) {
  return !(("async" in A) && A.async === !0)
}
// @from(Start 9929631, End 9929690)
function zYA(A) {
  return "async" in A && A.async === !0
}
// @from(Start 9929695, End 9929698)
yK5
// @from(Start 9929700, End 9929703)
xK5
// @from(Start 9929705, End 9929708)
Q91
// @from(Start 9929714, End 9931785)
k00 = L(() => {
  Q2();
  oQ1();
  _00();
  yK5 = j.object({
    async: j.literal(!0),
    asyncTimeout: j.number().optional()
  }), xK5 = j.object({
    continue: j.boolean().describe("Whether Claude should continue after hook (default: true)").optional(),
    suppressOutput: j.boolean().describe("Hide stdout from transcript (default: false)").optional(),
    stopReason: j.string().describe("Message shown when continue is false").optional(),
    decision: j.enum(["approve", "block"]).optional(),
    reason: j.string().describe("Explanation for the decision").optional(),
    systemMessage: j.string().describe("Warning message shown to the user").optional(),
    hookSpecificOutput: j.union([j.object({
      hookEventName: j.literal("PreToolUse"),
      permissionDecision: j.enum(["allow", "deny", "ask"]).optional(),
      permissionDecisionReason: j.string().optional(),
      updatedInput: j.record(j.unknown()).optional()
    }), j.object({
      hookEventName: j.literal("UserPromptSubmit"),
      additionalContext: j.string().optional()
    }), j.object({
      hookEventName: j.literal("SessionStart"),
      additionalContext: j.string().optional()
    }), j.object({
      hookEventName: j.literal("SubagentStart"),
      additionalContext: j.string().optional()
    }), j.object({
      hookEventName: j.literal("PostToolUse"),
      additionalContext: j.string().optional(),
      updatedMCPToolOutput: j.unknown().describe("Updates the output for MCP tools").optional()
    }), j.object({
      hookEventName: j.literal("PostToolUseFailure"),
      additionalContext: j.string().optional()
    }), j.object({
      hookEventName: j.literal("PermissionRequest"),
      decision: j.union([j.object({
        behavior: j.literal("allow"),
        updatedInput: j.record(j.unknown()).optional(),
        updatedPermissions: j.array(A91).optional()
      }), j.object({
        behavior: j.literal("deny"),
        message: j.string().optional(),
        interrupt: j.boolean().optional()
      })])
    })]).optional()
  }), Q91 = j.union([yK5, xK5])
})
// @from(Start 9931788, End 9932080)
function ck(A, Q) {
  let B = o9(),
    G = () => {
      B.abort()
    };
  A.addEventListener("abort", G), Q?.addEventListener("abort", G);
  let Z = () => {
    A.removeEventListener("abort", G), Q?.removeEventListener("abort", G)
  };
  return {
    signal: B.signal,
    cleanup: Z
  }
}
// @from(Start 9932085, End 9932110)
B91 = L(() => {
  OZ()
})
// @from(Start 9932113, End 9932583)
function yZ2({
  processId: A,
  asyncResponse: Q,
  hookName: B,
  hookEvent: G,
  command: Z,
  shellCommand: I,
  toolName: Y
}) {
  let J = Q.asyncTimeout || 15000;
  g(`Hooks: Registering async hook ${A} (${B}) with timeout ${J}ms`), qh.set(A, {
    processId: A,
    hookName: B,
    hookEvent: G,
    toolName: Y,
    command: Z,
    startTime: Date.now(),
    timeout: J,
    stdout: "",
    stderr: "",
    responseAttachmentSent: !1,
    shellCommand: I
  })
}
// @from(Start 9932585, End 9932779)
function xZ2(A, Q) {
  let B = qh.get(A);
  if (B) g(`Hooks: Adding stdout to ${A}: ${Q.substring(0,50)}...`), B.stdout += Q;
  else g(`Hooks: Attempted to add output to unknown process ${A}`)
}
// @from(Start 9932781, End 9932975)
function vZ2(A, Q) {
  let B = qh.get(A);
  if (B) g(`Hooks: Adding stderr to ${A}: ${Q.substring(0,50)}...`), B.stderr += Q;
  else g(`Hooks: Attempted to add stderr to unknown process ${A}`)
}
// @from(Start 9932976, End 9935049)
async function bZ2() {
  let A = [],
    Q = qh.size;
  g(`Hooks: Found ${Q} total hooks in registry`);
  let B = [];
  for (let G of qh.values()) {
    if (g(`Hooks: Checking hook ${G.processId} (${G.hookName}) - attachmentSent: ${G.responseAttachmentSent}, stdout length: ${G.stdout.length}`), !G.shellCommand) {
      g(`Hooks: Hook ${G.processId} has no shell command, removing from registry`), B.push(G.processId);
      continue
    }
    if (g(`Hooks: Hook shell status ${G.shellCommand.status}`), G.shellCommand.status === "killed") {
      g(`Hooks: Hook ${G.processId} is ${G.shellCommand.status}, removing from registry`), B.push(G.processId);
      continue
    }
    if (G.shellCommand.status !== "completed") continue;
    if (G.responseAttachmentSent || !G.stdout.trim()) {
      g(`Hooks: Skipping hook ${G.processId} - already delivered/sent or no stdout`), B.push(G.processId);
      continue
    }
    let Z = G.stdout.split(`
`);
    g(`Hooks: Processing ${Z.length} lines of stdout for ${G.processId}`);
    let Y = (await G.shellCommand.result).code,
      J = {};
    for (let W of Z)
      if (W.trim().startsWith("{")) {
        g(`Hooks: Found JSON line: ${W.trim().substring(0,100)}...`);
        try {
          let X = JSON.parse(W.trim());
          if (!("async" in X)) {
            g(`Hooks: Found sync response from ${G.processId}: ${JSON.stringify(X)}`), J = X;
            break
          }
        } catch {
          g(`Hooks: Failed to parse JSON from ${G.processId}: ${W.trim()}`)
        }
      } if (A.push({
        processId: G.processId,
        response: J,
        hookName: G.hookName,
        hookEvent: G.hookEvent,
        toolName: G.toolName,
        stdout: G.stdout,
        stderr: G.stderr,
        exitCode: Y
      }), G.responseAttachmentSent = !0, qh.delete(G.processId), G.hookEvent === "SessionStart") g(`Invalidating session env cache after SessionStart hook ${G.processId} completed`), LNB()
  }
  for (let G of B) qh.delete(G);
  return g(`Hooks: checkForNewResponses returning ${A.length} responses`), A
}
// @from(Start 9935051, End 9935212)
function fZ2(A) {
  for (let Q of A) {
    let B = qh.get(Q);
    if (B && B.responseAttachmentSent) g(`Hooks: Removing delivered hook ${Q}`), qh.delete(Q)
  }
}
// @from(Start 9935217, End 9935219)
qh
// @from(Start 9935225, End 9935275)
y00 = L(() => {
  V0();
  D$A();
  qh = new Map
})
// @from(Start 9935316, End 9935421)
function x00() {
  let A = G91(MQ(), "todos");
  if (!RA().existsSync(A)) RA().mkdirSync(A);
  return A
}
// @from(Start 9935423, End 9935501)
function Ri(A) {
  let Q = `${e1()}-agent-${A}.json`;
  return G91(x00(), Q)
}
// @from(Start 9935503, End 9935541)
function Nh(A) {
  return hZ2(Ri(A))
}
// @from(Start 9935543, End 9935581)
function UYA(A, Q) {
  gZ2(A, Ri(Q))
}
// @from(Start 9935583, End 9935718)
function Z91(A) {
  if (A.messages.length > 0) {
    let Q = A.messages[0];
    if (Q && "sessionId" in Q) vK5(Q.sessionId, e1())
  }
}
// @from(Start 9935720, End 9936001)
function vK5(A, Q) {
  let B = G91(x00(), `${A}-agent-${A}.json`),
    G = G91(x00(), `${Q}-agent-${Q}.json`);
  try {
    let Z = hZ2(B);
    if (Z.length === 0) return !1;
    return gZ2(Z, G), !0
  } catch (Z) {
    return AA(Z instanceof Error ? Z : Error(String(Z))), !1
  }
}
// @from(Start 9936003, End 9936252)
function hZ2(A) {
  if (!RA().existsSync(A)) return [];
  try {
    let Q = JSON.parse(RA().readFileSync(A, {
      encoding: "utf-8"
    }));
    return V7A.parse(Q)
  } catch (Q) {
    return AA(Q instanceof Error ? Q : Error(String(Q))), []
  }
}
// @from(Start 9936254, End 9936392)
function gZ2(A, Q) {
  try {
    L_(Q, JSON.stringify(A, null, 2))
  } catch (B) {
    AA(B instanceof Error ? B : Error(String(B)))
  }
}
// @from(Start 9936397, End 9936462)
Ti = L(() => {
  R9();
  _0();
  AQ();
  hQ();
  g1();
  Lh1()
})
// @from(Start 9936576, End 9936616)
function mZ2(A) {
  return Mh(A, uQ())
}
// @from(Start 9936618, End 9936983)
function uK5(A) {
  let {
    frontmatter: Q,
    content: B
  } = NV(A);
  if (!Q.paths) return {
    content: B
  };
  let G = yh0(Q.paths).map((Z) => {
    return Z.endsWith("/**") ? Z.slice(0, -3) : Z
  }).filter((Z) => Z.length > 0);
  if (G.length === 0 || G.every((Z) => Z === "**")) return {
    content: B
  };
  return {
    content: B,
    paths: G
  }
}
// @from(Start 9936985, End 9937557)
function dZ2(A, Q) {
  try {
    if (RA().existsSync(A)) {
      if (!RA().statSync(A).isFile()) return null;
      let G = RA().readFileSync(A, {
          encoding: "utf-8"
        }),
        {
          content: Z,
          paths: I
        } = uK5(G);
      return {
        path: A,
        type: Q,
        content: Z,
        globs: I
      }
    }
  } catch (B) {
    if (B instanceof Error && B.message.includes("EACCES")) GA("tengu_claude_md_permission_error", {
      is_access_error: 1,
      has_home_dir: A.includes(MQ()) ? 1 : 0
    })
  }
  return null
}
// @from(Start 9937559, End 9938365)
function mK5(A, Q) {
  let B = new Set,
    Z = new vE().lex(A);

  function I(Y) {
    for (let J of Y) {
      if (J.type === "code" || J.type === "codespan") continue;
      if (J.type === "text") {
        let W = J.text || "",
          X = /(?:^|\s)@((?:[^\s\\]|\\ )+)/g,
          V;
        while ((V = X.exec(W)) !== null) {
          let F = V[1];
          if (!F) continue;
          if (F = F.replace(/\\ /g, " "), F) {
            if (F.startsWith("./") || F.startsWith("~/") || F.startsWith("/") && F !== "/" || !F.startsWith("@") && !F.match(/^[#%^&*()]+/) && F.match(/^[a-zA-Z0-9._-]/)) {
              let D = b9(F, I91(Q));
              B.add(D)
            }
          }
        }
      }
      if (J.tokens) I(J.tokens);
      if (J.items) I(J.items)
    }
  }
  return I(Z), [...B]
}
// @from(Start 9938367, End 9938793)
function pk(A, Q, B, G, Z = 0, I) {
  if (B.has(A) || Z >= dK5) return [];
  let Y = dZ2(A, Q);
  if (!Y || !Y.content.trim()) return [];
  if (I) Y.parent = I;
  B.add(A);
  let J = [];
  J.push(Y);
  let {
    resolvedPath: W
  } = fK(RA(), A);
  if (W !== A) B.add(W);
  let X = mK5(Y.content, W);
  for (let V of X) {
    if (!mZ2(V) && !G) continue;
    let K = pk(V, Q, B, G, Z + 1, A);
    J.push(...K)
  }
  return J
}
// @from(Start 9938795, End 9940079)
function $YA({
  rulesDir: A,
  type: Q,
  processedPaths: B,
  includeExternal: G,
  conditionalRule: Z,
  visitedDirs: I = new Set
}) {
  let Y = [];
  if (!Y0(process.env.CLAUDE_CODE_ENABLE_PROCESS_CLAUDE_RULES)) return Y;
  try {
    if (!RA().existsSync(A)) return Y;
    if (!RA().statSync(A).isDirectory()) return Y;
    let X;
    try {
      X = RA().realpathSync(A)
    } catch {
      X = A
    }
    if (I.has(X)) return Y;
    I.add(X);
    let V = RA().readdirSync(A);
    for (let F of V) {
      let K = F.name,
        D = lk(A, K);
      if (F.isDirectory()) {
        let H = $YA({
          rulesDir: D,
          type: Q,
          processedPaths: B,
          includeExternal: G,
          conditionalRule: Z,
          visitedDirs: I
        });
        Y.push(...H)
      } else if (F.isFile() && K.endsWith(".md")) {
        let H = pk(D, Q, B, G);
        if (Z) {
          let C = H.filter((E) => E.globs);
          Y.push(...C)
        } else {
          let C = H.filter((E) => !E.globs);
          Y.push(...C)
        }
      }
    }
  } catch (W) {
    if (W instanceof Error && W.message.includes("EACCES")) GA("tengu_claude_rules_md_permission_error", {
      is_access_error: 1,
      has_home_dir: A.includes(MQ()) ? 1 : 0
    })
  }
  return Y
}
// @from(Start 9940081, End 9940150)
function M1A() {
  return gV().filter((A) => A.content.length > Lh)
}
// @from(Start 9940152, End 9940184)
function O1A() {
  return null
}
// @from(Start 9940186, End 9940216)
function v00() {
  return []
}
// @from(Start 9940218, End 9940411)
function pZ2(A, Q) {
  let B = [],
    G = nv1();
  if (B.push(...Y91(A, G, "Managed", Q, !1)), EH("userSettings")) {
    let Z = av1();
    B.push(...Y91(A, Z, "User", Q, !0))
  }
  return B
}
// @from(Start 9940413, End 9941021)
function lZ2(A, Q, B) {
  let G = [];
  if (EH("projectSettings")) {
    let Y = lk(A, "CLAUDE.md");
    G.push(...pk(Y, "Project", B, !1));
    let J = lk(A, ".claude", "CLAUDE.md");
    G.push(...pk(J, "Project", B, !1))
  }
  if (EH("localSettings")) {
    let Y = lk(A, "CLAUDE.local.md");
    G.push(...pk(Y, "Local", B, !1))
  }
  let Z = lk(A, ".claude", "rules"),
    I = new Set(B);
  G.push(...$YA({
    rulesDir: Z,
    type: "Project",
    processedPaths: I,
    includeExternal: !1,
    conditionalRule: !1
  })), G.push(...Y91(Q, Z, "Project", B, !1));
  for (let Y of I) B.add(Y);
  return G
}
// @from(Start 9941023, End 9941122)
function iZ2(A, Q, B) {
  let G = lk(A, ".claude", "rules");
  return Y91(Q, G, "Project", B, !1)
}
// @from(Start 9941124, End 9941483)
function Y91(A, Q, B, G, Z) {
  return $YA({
    rulesDir: Q,
    type: B,
    processedPaths: G,
    includeExternal: Z,
    conditionalRule: !0
  }).filter((Y) => {
    if (!Y.globs || Y.globs.length === 0) return !1;
    let J = B === "Project" ? I91(I91(Q)) : uQ(),
      W = hK5(A) ? fK5(J, A) : A;
    return uZ2.default().add(Y.globs).ignores(W)
  })
}
// @from(Start 9941485, End 9941605)
function b00() {
  for (let A of gV(!0))
    if (A.type !== "User" && A.parent && !mZ2(A.path)) return !0;
  return !1
}
// @from(Start 9941606, End 9941762)
async function nZ2() {
  let A = j5();
  if (A.hasClaudeMdExternalIncludesApproved || A.hasClaudeMdExternalIncludesWarningShown) return !1;
  return b00()
}
// @from(Start 9941767, End 9941770)
uZ2
// @from(Start 9941772, End 9941973)
gK5 = "Codebase and user instructions are shown below. Be sure to adhere to these instructions. IMPORTANT: These instructions OVERRIDE any default behavior and you MUST follow them exactly as written."
// @from(Start 9941977, End 9941987)
Lh = 40000
// @from(Start 9941991, End 9942001)
wYA = 3000
// @from(Start 9942005, End 9942012)
dK5 = 5
// @from(Start 9942016, End 9942018)
gV
// @from(Start 9942020, End 9942480)
cZ2 = () => {
    let A = gV(),
      Q = [];
    for (let B of A)
      if (B.content) {
        let G = B.type === "Project" ? " (project instructions, checked into the codebase)" : B.type === "Local" ? " (user's private project instructions, not checked in)" : " (user's private global instructions for all projects)";
        Q.push(`Contents of ${B.path}${G}:

${B.content}`)
      } if (Q.length === 0) return "";
    return `${gK5}

${Q.join(`

`)}`
  }
// @from(Start 9942486, End 9943964)
gE = L(() => {
  l2();
  _0();
  AQ();
  yI();
  u2();
  q0();
  l10();
  LV();
  EJ();
  jQ();
  hQ();
  uZ2 = BA(UB1(), 1);
  gV = s1((A = !1) => {
    let Q = [],
      B = new Set,
      G = j5(),
      Z = A || G.hasClaudeMdExternalIncludesApproved || !1,
      I = Gt("Managed");
    Q.push(...pk(I, "Managed", B, Z));
    let Y = nv1();
    if (Q.push(...$YA({
        rulesDir: Y,
        type: "Managed",
        processedPaths: B,
        includeExternal: Z,
        conditionalRule: !1
      })), EH("userSettings")) {
      let X = Gt("User");
      Q.push(...pk(X, "User", B, !0));
      let V = av1();
      Q.push(...$YA({
        rulesDir: V,
        type: "User",
        processedPaths: B,
        includeExternal: !0,
        conditionalRule: !1
      }))
    }
    let J = [],
      W = uQ();
    while (W !== bK5(W).root) J.push(W), W = I91(W);
    for (let X of J.reverse()) {
      if (EH("projectSettings")) {
        let V = lk(X, "CLAUDE.md");
        Q.push(...pk(V, "Project", B, Z));
        let F = lk(X, ".claude", "CLAUDE.md");
        Q.push(...pk(F, "Project", B, Z));
        let K = lk(X, ".claude", "rules");
        Q.push(...$YA({
          rulesDir: K,
          type: "Project",
          processedPaths: B,
          includeExternal: Z,
          conditionalRule: !1
        }))
      }
      if (EH("localSettings")) {
        let V = lk(X, "CLAUDE.local.md");
        Q.push(...pk(V, "Local", B, Z))
      }
    }
    return Q
  })
})
// @from(Start 9943966, End 9948837)
class WP {
  static instance;
  baseline = new Map;
  initialized = !1;
  mcpClient;
  lastProcessedTimestamps = new Map;
  rightFileDiagnosticsState = new Map;
  static getInstance() {
    if (!WP.instance) WP.instance = new WP;
    return WP.instance
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
    let Q = ["file://", "_claude_fs_right:", "_claude_fs_left:"];
    for (let B of Q)
      if (A.startsWith(B)) return A.slice(B.length);
    return A
  }
  async ensureFileOpened(A) {
    if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected") return;
    try {
      await Jh("openFile", {
        filePath: A,
        preview: !1,
        startText: "",
        endText: "",
        selectToEndOfLine: !1,
        makeFrontmost: !1
      }, this.mcpClient)
    } catch (Q) {
      AA(Q)
    }
  }
  async beforeFileEdited(A) {
    if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected") return;
    let Q = Date.now();
    try {
      let B = await Jh("getDiagnostics", {
          uri: `file://${A}`
        }, this.mcpClient),
        G = this.parseDiagnosticResult(B)[0];
      if (G) {
        if (A !== this.normalizeFileUri(G.uri)) {
          AA(new aZ2(`Diagnostics file path mismatch: expected ${A}, got ${G.uri})`));
          return
        }
        this.baseline.set(A, G.diagnostics), this.lastProcessedTimestamps.set(A, Q)
      } else this.baseline.set(A, []), this.lastProcessedTimestamps.set(A, Q)
    } catch (B) {}
  }
  async getNewDiagnostics() {
    if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected") return [];
    let A = [];
    try {
      let Z = await Jh("getDiagnostics", {}, this.mcpClient);
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
      let I = this.normalizeFileUri(Z.uri),
        Y = this.baseline.get(I) || [],
        J = B.get(I),
        W = Z;
      if (J) {
        let V = this.rightFileDiagnosticsState.get(I);
        if (!V || !this.areDiagnosticArraysEqual(V, J.diagnostics)) W = J;
        this.rightFileDiagnosticsState.set(I, J.diagnostics)
      }
      let X = W.diagnostics.filter((V) => !Y.some((F) => this.areDiagnosticsEqual(V, F)));
      if (X.length > 0) G.push({
        uri: Z.uri,
        diagnostics: X
      });
      this.baseline.set(I, W.diagnostics)
    }
    return G
  }
  parseDiagnosticResult(A) {
    if (Array.isArray(A)) {
      let Q = A.find((B) => B.type === "text");
      if (Q && "text" in Q) return JSON.parse(Q.text)
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
      let Q = uU(A);
      if (Q) this.initialize(Q)
    } else this.reset()
  }
  static formatDiagnosticsSummary(A) {
    return A.map((Q) => {
      let B = Q.uri.split("/").pop() || Q.uri,
        G = Q.diagnostics.map((Z) => {
          return `  ${WP.getSeveritySymbol(Z.severity)} [Line ${Z.range.start.line+1}:${Z.range.start.character+1}] ${Z.message}${Z.code?` [${Z.code}]`:""}${Z.source?` (${Z.source})`:""}`
        }).join(`
`);
      return `${B}:
${G}`
    }).join(`

`)
  }
  static getSeveritySymbol(A) {
    return {
      Error: H1.cross,
      Warning: H1.warning,
      Info: H1.info,
      Hint: H1.star
    } [A] || H1.bullet
  }
}
// @from(Start 9948842, End 9948845)
aZ2
// @from(Start 9948847, End 9948849)
Oh
// @from(Start 9948855, End 9948971)
R1A = L(() => {
  Ok();
  nY();
  g1();
  RZ();
  V9();
  aZ2 = class aZ2 extends BKA {};
  Oh = WP.getInstance()
})
// @from(Start 9948974, End 9948990)
function XP() {}
// @from(Start 9948992, End 9949651)
function sZ2(A, Q, B, G, Z) {
  var I = [],
    Y;
  while (Q) I.push(Q), Y = Q.previousComponent, delete Q.previousComponent, Q = Y;
  I.reverse();
  var J = 0,
    W = I.length,
    X = 0,
    V = 0;
  for (; J < W; J++) {
    var F = I[J];
    if (!F.removed) {
      if (!F.added && Z) {
        var K = B.slice(X, X + F.count);
        K = K.map(function(D, H) {
          var C = G[V + H];
          return C.length > D.length ? C : D
        }), F.value = A.join(K)
      } else F.value = A.join(B.slice(X, X + F.count));
      if (X += F.count, !F.added) V += F.count
    } else F.value = A.join(G.slice(V, V + F.count)), V += F.count
  }
  return I
}
// @from(Start 9949653, End 9949800)
function rZ2(A, Q) {
  var B;
  for (B = 0; B < A.length && B < Q.length; B++)
    if (A[B] != Q[B]) return A.slice(0, B);
  return A.slice(0, B)
}
// @from(Start 9949802, End 9950044)
function oZ2(A, Q) {
  var B;
  if (!A || !Q || A[A.length - 1] != Q[Q.length - 1]) return "";
  for (B = 0; B < A.length && B < Q.length; B++)
    if (A[A.length - (B + 1)] != Q[Q.length - (B + 1)]) return A.slice(-B);
  return A.slice(-B)
}
// @from(Start 9950046, End 9950261)
function h00(A, Q, B) {
  if (A.slice(0, Q.length) != Q) throw Error("string ".concat(JSON.stringify(A), " doesn't start with prefix ").concat(JSON.stringify(Q), "; this is a bug"));
  return B + A.slice(Q.length)
}
// @from(Start 9950263, End 9950502)
function g00(A, Q, B) {
  if (!Q) return A + B;
  if (A.slice(-Q.length) != Q) throw Error("string ".concat(JSON.stringify(A), " doesn't end with suffix ").concat(JSON.stringify(Q), "; this is a bug"));
  return A.slice(0, -Q.length) + B
}
// @from(Start 9950504, End 9950549)
function kMA(A, Q) {
  return h00(A, Q, "")
}
// @from(Start 9950551, End 9950596)
function J91(A, Q) {
  return g00(A, Q, "")
}
// @from(Start 9950598, End 9950651)
function tZ2(A, Q) {
  return Q.slice(0, cK5(A, Q))
}
// @from(Start 9950653, End 9951137)
function cK5(A, Q) {
  var B = 0;
  if (A.length > Q.length) B = A.length - Q.length;
  var G = Q.length;
  if (A.length < Q.length) G = A.length;
  var Z = Array(G),
    I = 0;
  Z[0] = 0;
  for (var Y = 1; Y < G; Y++) {
    if (Q[Y] == Q[I]) Z[Y] = Z[I];
    else Z[Y] = I;
    while (I > 0 && Q[Y] != Q[I]) I = Z[I];
    if (Q[Y] == Q[I]) I++
  }
  I = 0;
  for (var J = B; J < A.length; J++) {
    while (I > 0 && A[J] != Q[I]) I = Z[I];
    if (A[J] == Q[I]) I++
  }
  return I
}
// @from(Start 9951139, End 9952338)
function eZ2(A, Q, B, G) {
  if (Q && B) {
    var Z = Q.value.match(/^\s*/)[0],
      I = Q.value.match(/\s*$/)[0],
      Y = B.value.match(/^\s*/)[0],
      J = B.value.match(/\s*$/)[0];
    if (A) {
      var W = rZ2(Z, Y);
      A.value = g00(A.value, Y, W), Q.value = kMA(Q.value, W), B.value = kMA(B.value, W)
    }
    if (G) {
      var X = oZ2(I, J);
      G.value = h00(G.value, J, X), Q.value = J91(Q.value, X), B.value = J91(B.value, X)
    }
  } else if (B) {
    if (A) B.value = B.value.replace(/^\s*/, "");
    if (G) G.value = G.value.replace(/^\s*/, "")
  } else if (A && G) {
    var V = G.value.match(/^\s*/)[0],
      F = Q.value.match(/^\s*/)[0],
      K = Q.value.match(/\s*$/)[0],
      D = rZ2(V, F);
    Q.value = kMA(Q.value, D);
    var H = oZ2(kMA(V, D), K);
    Q.value = J91(Q.value, H), G.value = h00(G.value, V, H), A.value = g00(A.value, V, V.slice(0, V.length - H.length))
  } else if (G) {
    var C = G.value.match(/^\s*/)[0],
      E = Q.value.match(/\s*$/)[0],
      U = tZ2(E, C);
    Q.value = J91(Q.value, U)
  } else if (A) {
    var q = A.value.match(/\s*$/)[0],
      w = Q.value.match(/^\s*/)[0],
      N = tZ2(q, w);
    Q.value = kMA(Q.value, N)
  }
}
// @from(Start 9952340, End 9952392)
function GI2(A, Q, B) {
  return BI2.diff(A, Q, B)
}
// @from(Start 9952394, End 9952446)
function X91(A, Q, B) {
  return F91.diff(A, Q, B)
}
// @from(Start 9952448, End 9952721)
function AI2(A, Q) {
  var B = Object.keys(A);
  if (Object.getOwnPropertySymbols) {
    var G = Object.getOwnPropertySymbols(A);
    Q && (G = G.filter(function(Z) {
      return Object.getOwnPropertyDescriptor(A, Z).enumerable
    })), B.push.apply(B, G)
  }
  return B
}
// @from(Start 9952723, End 9953160)
function QI2(A) {
  for (var Q = 1; Q < arguments.length; Q++) {
    var B = arguments[Q] != null ? arguments[Q] : {};
    Q % 2 ? AI2(Object(B), !0).forEach(function(G) {
      sK5(A, G, B[G])
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(A, Object.getOwnPropertyDescriptors(B)) : AI2(Object(B)).forEach(function(G) {
      Object.defineProperty(A, G, Object.getOwnPropertyDescriptor(B, G))
    })
  }
  return A
}
// @from(Start 9953162, End 9953481)
function nK5(A, Q) {
  if (typeof A != "object" || !A) return A;
  var B = A[Symbol.toPrimitive];
  if (B !== void 0) {
    var G = B.call(A, Q || "default");
    if (typeof G != "object") return G;
    throw TypeError("@@toPrimitive must return a primitive value.")
  }
  return (Q === "string" ? String : Number)(A)
}
// @from(Start 9953483, End 9953573)
function aK5(A) {
  var Q = nK5(A, "string");
  return typeof Q == "symbol" ? Q : Q + ""
}
// @from(Start 9953575, End 9953863)
function u00(A) {
  return u00 = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(Q) {
    return typeof Q
  } : function(Q) {
    return Q && typeof Symbol == "function" && Q.constructor === Symbol && Q !== Symbol.prototype ? "symbol" : typeof Q
  }, u00(A)
}
// @from(Start 9953865, End 9954053)
function sK5(A, Q, B) {
  if (Q = aK5(Q), Q in A) Object.defineProperty(A, Q, {
    value: B,
    enumerable: !0,
    configurable: !0,
    writable: !0
  });
  else A[Q] = B;
  return A
}
// @from(Start 9954055, End 9954119)
function f00(A) {
  return rK5(A) || oK5(A) || tK5(A) || eK5()
}
// @from(Start 9954121, End 9954178)
function rK5(A) {
  if (Array.isArray(A)) return m00(A)
}
// @from(Start 9954180, End 9954304)
function oK5(A) {
  if (typeof Symbol < "u" && A[Symbol.iterator] != null || A["@@iterator"] != null) return Array.from(A)
}
// @from(Start 9954306, End 9954666)
function tK5(A, Q) {
  if (!A) return;
  if (typeof A === "string") return m00(A, Q);
  var B = Object.prototype.toString.call(A).slice(8, -1);
  if (B === "Object" && A.constructor) B = A.constructor.name;
  if (B === "Map" || B === "Set") return Array.from(A);
  if (B === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(B)) return m00(A, Q)
}
// @from(Start 9954668, End 9954805)
function m00(A, Q) {
  if (Q == null || Q > A.length) Q = A.length;
  for (var B = 0, G = Array(Q); B < Q; B++) G[B] = A[B];
  return G
}
// @from(Start 9954807, End 9954978)
function eK5() {
  throw TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)
}
// @from(Start 9954980, End 9955721)
function d00(A, Q, B, G, Z) {
  if (Q = Q || [], B = B || [], G) A = G(Z, A);
  var I;
  for (I = 0; I < Q.length; I += 1)
    if (Q[I] === A) return B[I];
  var Y;
  if (Object.prototype.toString.call(A) === "[object Array]") {
    Q.push(A), Y = Array(A.length), B.push(Y);
    for (I = 0; I < A.length; I += 1) Y[I] = d00(A[I], Q, B, G, Z);
    return Q.pop(), B.pop(), Y
  }
  if (A && A.toJSON) A = A.toJSON();
  if (u00(A) === "object" && A !== null) {
    Q.push(A), Y = {}, B.push(Y);
    var J = [],
      W;
    for (W in A)
      if (Object.prototype.hasOwnProperty.call(A, W)) J.push(W);
    J.sort();
    for (I = 0; I < J.length; I += 1) W = J[I], Y[W] = d00(A[W], Q, B, G, W);
    Q.pop(), B.pop()
  } else Y = A;
  return Y
}
// @from(Start 9955723, End 9958047)
function xMA(A, Q, B, G, Z, I, Y) {
  if (!Y) Y = {};
  if (typeof Y === "function") Y = {
    callback: Y
  };
  if (typeof Y.context > "u") Y.context = 4;
  if (Y.newlineIsToken) throw Error("newlineIsToken may not be used with patch-generation functions, only with diffing functions");
  if (!Y.callback) return X(X91(B, G, Y));
  else {
    var J = Y,
      W = J.callback;
    X91(B, G, QI2(QI2({}, Y), {}, {
      callback: function(F) {
        var K = X(F);
        W(K)
      }
    }))
  }

  function X(V) {
    if (!V) return;
    V.push({
      value: "",
      lines: []
    });

    function F(v) {
      return v.map(function(x) {
        return " " + x
      })
    }
    var K = [],
      D = 0,
      H = 0,
      C = [],
      E = 1,
      U = 1,
      q = function() {
        var x = V[w],
          p = x.lines || AD5(x.value);
        if (x.lines = p, x.added || x.removed) {
          var u;
          if (!D) {
            var e = V[w - 1];
            if (D = E, H = U, e) C = Y.context > 0 ? F(e.lines.slice(-Y.context)) : [], D -= C.length, H -= C.length
          }
          if ((u = C).push.apply(u, f00(p.map(function(IA) {
              return (x.added ? "+" : "-") + IA
            }))), x.added) U += p.length;
          else E += p.length
        } else {
          if (D)
            if (p.length <= Y.context * 2 && w < V.length - 2) {
              var l;
              (l = C).push.apply(l, f00(F(p)))
            } else {
              var k, m = Math.min(p.length, Y.context);
              (k = C).push.apply(k, f00(F(p.slice(0, m))));
              var o = {
                oldStart: D,
                oldLines: E - D + m,
                newStart: H,
                newLines: U - H + m,
                lines: C
              };
              K.push(o), D = 0, H = 0, C = []
            } E += p.length, U += p.length
        }
      };
    for (var w = 0; w < V.length; w++) q();
    for (var N = 0, R = K; N < R.length; N++) {
      var T = R[N];
      for (var y = 0; y < T.lines.length; y++)
        if (T.lines[y].endsWith(`
`)) T.lines[y] = T.lines[y].slice(0, -1);
        else T.lines.splice(y + 1, 0, "\\ No newline at end of file"), y++
    }
    return {
      oldFileName: A,
      newFileName: Q,
      oldHeader: Z,
      newHeader: I,
      hunks: K
    }
  }
}
// @from(Start 9958049, End 9958229)
function AD5(A) {
  var Q = A.endsWith(`
`),
    B = A.split(`
`).map(function(G) {
      return G + `
`
    });
  if (Q) B.pop();
  else B.push(B.pop().slice(0, -1));
  return B
}
// @from(Start 9958234, End 9958237)
bvG
// @from(Start 9958239, End 9958356)
W91 = "a-zA-Z0-9_\\u{C0}-\\u{FF}\\u{D8}-\\u{F6}\\u{F8}-\\u{2C6}\\u{2C8}-\\u{2D7}\\u{2DE}-\\u{2FF}\\u{1E00}-\\u{1EFF}"
// @from(Start 9958360, End 9958363)
pK5
// @from(Start 9958365, End 9958368)
V91
// @from(Start 9958370, End 9958373)
BI2
// @from(Start 9958375, End 9958378)
F91
// @from(Start 9958380, End 9958383)
lK5
// @from(Start 9958385, End 9958388)
iK5
// @from(Start 9958390, End 9958393)
yMA
// @from(Start 9958395, End 9958398)
c00
// @from(Start 9958404, End 9965637)
vMA = L(() => {
  XP.prototype = {
    diff: function(Q, B) {
      var G, Z = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
        I = Z.callback;
      if (typeof Z === "function") I = Z, Z = {};
      var Y = this;

      function J(N) {
        if (N = Y.postProcess(N, Z), I) return setTimeout(function() {
          I(N)
        }, 0), !0;
        else return N
      }
      Q = this.castInput(Q, Z), B = this.castInput(B, Z), Q = this.removeEmpty(this.tokenize(Q, Z)), B = this.removeEmpty(this.tokenize(B, Z));
      var W = B.length,
        X = Q.length,
        V = 1,
        F = W + X;
      if (Z.maxEditLength != null) F = Math.min(F, Z.maxEditLength);
      var K = (G = Z.timeout) !== null && G !== void 0 ? G : 1 / 0,
        D = Date.now() + K,
        H = [{
          oldPos: -1,
          lastComponent: void 0
        }],
        C = this.extractCommon(H[0], B, Q, 0, Z);
      if (H[0].oldPos + 1 >= X && C + 1 >= W) return J(sZ2(Y, H[0].lastComponent, B, Q, Y.useLongestToken));
      var E = -1 / 0,
        U = 1 / 0;

      function q() {
        for (var N = Math.max(E, -V); N <= Math.min(U, V); N += 2) {
          var R = void 0,
            T = H[N - 1],
            y = H[N + 1];
          if (T) H[N - 1] = void 0;
          var v = !1;
          if (y) {
            var x = y.oldPos - N;
            v = y && 0 <= x && x < W
          }
          var p = T && T.oldPos + 1 < X;
          if (!v && !p) {
            H[N] = void 0;
            continue
          }
          if (!p || v && T.oldPos < y.oldPos) R = Y.addToPath(y, !0, !1, 0, Z);
          else R = Y.addToPath(T, !1, !0, 1, Z);
          if (C = Y.extractCommon(R, B, Q, N, Z), R.oldPos + 1 >= X && C + 1 >= W) return J(sZ2(Y, R.lastComponent, B, Q, Y.useLongestToken));
          else {
            if (H[N] = R, R.oldPos + 1 >= X) U = Math.min(U, N - 1);
            if (C + 1 >= W) E = Math.max(E, N + 1)
          }
        }
        V++
      }
      if (I)(function N() {
        setTimeout(function() {
          if (V > F || Date.now() > D) return I();
          if (!q()) N()
        }, 0)
      })();
      else
        while (V <= F && Date.now() <= D) {
          var w = q();
          if (w) return w
        }
    },
    addToPath: function(Q, B, G, Z, I) {
      var Y = Q.lastComponent;
      if (Y && !I.oneChangePerToken && Y.added === B && Y.removed === G) return {
        oldPos: Q.oldPos + Z,
        lastComponent: {
          count: Y.count + 1,
          added: B,
          removed: G,
          previousComponent: Y.previousComponent
        }
      };
      else return {
        oldPos: Q.oldPos + Z,
        lastComponent: {
          count: 1,
          added: B,
          removed: G,
          previousComponent: Y
        }
      }
    },
    extractCommon: function(Q, B, G, Z, I) {
      var Y = B.length,
        J = G.length,
        W = Q.oldPos,
        X = W - Z,
        V = 0;
      while (X + 1 < Y && W + 1 < J && this.equals(G[W + 1], B[X + 1], I))
        if (X++, W++, V++, I.oneChangePerToken) Q.lastComponent = {
          count: 1,
          previousComponent: Q.lastComponent,
          added: !1,
          removed: !1
        };
      if (V && !I.oneChangePerToken) Q.lastComponent = {
        count: V,
        previousComponent: Q.lastComponent,
        added: !1,
        removed: !1
      };
      return Q.oldPos = W, X
    },
    equals: function(Q, B, G) {
      if (G.comparator) return G.comparator(Q, B);
      else return Q === B || G.ignoreCase && Q.toLowerCase() === B.toLowerCase()
    },
    removeEmpty: function(Q) {
      var B = [];
      for (var G = 0; G < Q.length; G++)
        if (Q[G]) B.push(Q[G]);
      return B
    },
    castInput: function(Q) {
      return Q
    },
    tokenize: function(Q) {
      return Array.from(Q)
    },
    join: function(Q) {
      return Q.join("")
    },
    postProcess: function(Q) {
      return Q
    }
  };
  bvG = new XP;
  pK5 = new RegExp("[".concat(W91, "]+|\\s+|[^").concat(W91, "]"), "ug"), V91 = new XP;
  V91.equals = function(A, Q, B) {
    if (B.ignoreCase) A = A.toLowerCase(), Q = Q.toLowerCase();
    return A.trim() === Q.trim()
  };
  V91.tokenize = function(A) {
    var Q = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      B;
    if (Q.intlSegmenter) {
      if (Q.intlSegmenter.resolvedOptions().granularity != "word") throw Error('The segmenter passed must have a granularity of "word"');
      B = Array.from(Q.intlSegmenter.segment(A), function(I) {
        return I.segment
      })
    } else B = A.match(pK5) || [];
    var G = [],
      Z = null;
    return B.forEach(function(I) {
      if (/\s/.test(I))
        if (Z == null) G.push(I);
        else G.push(G.pop() + I);
      else if (/\s/.test(Z))
        if (G[G.length - 1] == Z) G.push(G.pop() + I);
        else G.push(Z + I);
      else G.push(I);
      Z = I
    }), G
  };
  V91.join = function(A) {
    return A.map(function(Q, B) {
      if (B == 0) return Q;
      else return Q.replace(/^\s+/, "")
    }).join("")
  };
  V91.postProcess = function(A, Q) {
    if (!A || Q.oneChangePerToken) return A;
    var B = null,
      G = null,
      Z = null;
    if (A.forEach(function(I) {
        if (I.added) G = I;
        else if (I.removed) Z = I;
        else {
          if (G || Z) eZ2(B, Z, G, I);
          B = I, G = null, Z = null
        }
      }), G || Z) eZ2(B, Z, G, null);
    return A
  };
  BI2 = new XP;
  BI2.tokenize = function(A) {
    var Q = new RegExp("(\\r?\\n)|[".concat(W91, "]+|[^\\S\\n\\r]+|[^").concat(W91, "]"), "ug");
    return A.match(Q) || []
  };
  F91 = new XP;
  F91.tokenize = function(A, Q) {
    if (Q.stripTrailingCr) A = A.replace(/\r\n/g, `
`);
    var B = [],
      G = A.split(/(\n|\r\n)/);
    if (!G[G.length - 1]) G.pop();
    for (var Z = 0; Z < G.length; Z++) {
      var I = G[Z];
      if (Z % 2 && !Q.newlineIsToken) B[B.length - 1] += I;
      else B.push(I)
    }
    return B
  };
  F91.equals = function(A, Q, B) {
    if (B.ignoreWhitespace) {
      if (!B.newlineIsToken || !A.includes(`
`)) A = A.trim();
      if (!B.newlineIsToken || !Q.includes(`
`)) Q = Q.trim()
    } else if (B.ignoreNewlineAtEof && !B.newlineIsToken) {
      if (A.endsWith(`
`)) A = A.slice(0, -1);
      if (Q.endsWith(`
`)) Q = Q.slice(0, -1)
    }
    return XP.prototype.equals.call(this, A, Q, B)
  };
  lK5 = new XP;
  lK5.tokenize = function(A) {
    return A.split(/(\S.+?[.!?])(?=\s+|$)/)
  };
  iK5 = new XP;
  iK5.tokenize = function(A) {
    return A.split(/([{}:;,]|\s+)/)
  };
  yMA = new XP;
  yMA.useLongestToken = !0;
  yMA.tokenize = F91.tokenize;
  yMA.castInput = function(A, Q) {
    var {
      undefinedReplacement: B,
      stringifyReplacer: G
    } = Q, Z = G === void 0 ? function(I, Y) {
      return typeof Y > "u" ? B : Y
    } : G;
    return typeof A === "string" ? A : JSON.stringify(d00(A, null, null, Z), Z, "  ")
  };
  yMA.equals = function(A, Q, B) {
    return XP.prototype.equals.call(yMA, A.replace(/,([\r\n])/g, "$1"), Q.replace(/,([\r\n])/g, "$1"), B)
  };
  c00 = new XP;
  c00.tokenize = function(A) {
    return A.slice()
  };
  c00.join = c00.removeEmpty = function(A) {
    return A
  }
})
// @from(Start 9965640, End 9965712)
function bMA(A) {
  return A.replaceAll("&", II2).replaceAll("$", YI2)
}
// @from(Start 9965714, End 9965786)
function JI2(A) {
  return A.replaceAll(II2, "&").replaceAll(YI2, "$")
}
// @from(Start 9965788, End 9966225)
function fMA(A, Q) {
  let B = 0,
    G = 0;
  if (A.length === 0 && Q) B = Q.split(/\r?\n/).length;
  else B = A.reduce((Z, I) => Z + I.lines.filter((Y) => Y.startsWith("+")).length, 0), G = A.reduce((Z, I) => Z + I.lines.filter((Y) => Y.startsWith("-")).length, 0);
  LX1(B, G), TX1()?.add(B, {
    type: "added"
  }), TX1()?.add(G, {
    type: "removed"
  }), GA("tengu_file_changed", {
    lines_added: B,
    lines_removed: G
  })
}
// @from(Start 9966227, End 9966520)
function WI2({
  filePath: A,
  oldContent: Q,
  newContent: B,
  ignoreWhitespace: G = !1,
  singleHunk: Z = !1
}) {
  return xMA(A, A, bMA(Q), bMA(B), void 0, void 0, {
    ignoreWhitespace: G,
    context: Z ? 1e5 : ZI2
  }).hunks.map((I) => ({
    ...I,
    lines: I.lines.map(JI2)
  }))
}
// @from(Start 9966522, End 9967042)
function Uq({
  filePath: A,
  fileContents: Q,
  edits: B,
  ignoreWhitespace: G = !1
}) {
  let Z = bMA(qYA(Q));
  return xMA(A, A, Z, B.reduce((I, Y) => {
    let {
      old_string: J,
      new_string: W
    } = Y, X = "replace_all" in Y ? Y.replace_all : !1, V = bMA(qYA(J)), F = bMA(qYA(W));
    if (X) return I.replaceAll(V, () => F);
    else return I.replace(V, () => F)
  }, Z), void 0, void 0, {
    context: ZI2,
    ignoreWhitespace: G
  }).hunks.map((I) => ({
    ...I,
    lines: I.lines.map(JI2)
  }))
}
// @from(Start 9967047, End 9967054)
ZI2 = 3
// @from(Start 9967058, End 9967087)
II2 = "<<:AMPERSAND_TOKEN:>>"
// @from(Start 9967091, End 9967117)
YI2 = "<<:DOLLAR_TOKEN:>>"
// @from(Start 9967123, End 9967180)
Rh = L(() => {
  vMA();
  M_();
  R9();
  q0();
  _0()
})
// @from(Start 9967183, End 9967297)
function XI2(A) {
  return A.replaceAll(QD5, "'").replaceAll(BD5, "'").replaceAll(GD5, '"').replaceAll(ZD5, '"')
}
// @from(Start 9967299, End 9967528)
function p00(A) {
  let Q = A.split(/(\r\n|\n|\r)/),
    B = "";
  for (let G = 0; G < Q.length; G++) {
    let Z = Q[G];
    if (Z !== void 0)
      if (G % 2 === 0) B += Z.replace(/\s+$/, "");
      else B += Z
  }
  return B
}
// @from(Start 9967530, End 9967695)
function T1A(A, Q) {
  if (A.includes(Q)) return Q;
  let B = XI2(Q),
    Z = XI2(A).indexOf(B);
  if (Z !== -1) return A.substring(Z, Z + Q.length);
  return null
}
// @from(Start 9967697, End 9967936)
function VI2(A, Q, B, G = !1) {
  let Z = G ? (Y, J, W) => Y.replaceAll(J, () => W) : (Y, J, W) => Y.replace(J, () => W);
  if (B !== "") return Z(A, Q, B);
  return !Q.endsWith(`
`) && A.includes(Q + `
`) ? Z(A, Q + `
`, B) : Z(A, Q, B)
}
// @from(Start 9967938, End 9968188)
function K91({
  filePath: A,
  fileContents: Q,
  oldString: B,
  newString: G,
  replaceAll: Z = !1
}) {
  return hMA({
    filePath: A,
    fileContents: Q,
    edits: [{
      old_string: B,
      new_string: G,
      replace_all: Z
    }]
  })
}
// @from(Start 9968190, End 9969292)
function hMA({
  filePath: A,
  fileContents: Q,
  edits: B
}) {
  let G = Q,
    Z = [];
  if (!Q && B.length === 1 && B[0] && B[0].old_string === "" && B[0].new_string === "") return {
    patch: Uq({
      filePath: A,
      fileContents: Q,
      edits: [{
        old_string: Q,
        new_string: G,
        replace_all: !1
      }]
    }),
    updatedFile: ""
  };
  for (let Y of B) {
    let J = Y.old_string.replace(/\n+$/, "");
    for (let X of Z)
      if (J !== "" && X.includes(J)) throw Error("Cannot edit file: old_string is a substring of a new_string from a previous edit.");
    let W = G;
    if (G = Y.old_string === "" ? Y.new_string : VI2(G, Y.old_string, Y.new_string, Y.replace_all), G === W) throw Error("String not found in file. Failed to apply edit.");
    Z.push(Y.new_string)
  }
  if (G === Q) throw Error("Original and edited file match exactly. Failed to apply edit.");
  return {
    patch: Uq({
      filePath: A,
      fileContents: Q,
      edits: [{
        old_string: Q,
        new_string: G,
        replace_all: !1
      }]
    }),
    updatedFile: G
  }
}
// @from(Start 9969294, End 9969583)
function l00(A, Q) {
  return xMA("file.txt", "file.txt", A, Q, void 0, void 0, {
    context: 8
  }).hunks.map((G) => ({
    startLine: G.oldStart,
    content: G.lines.filter((Z) => !Z.startsWith("-") && !Z.startsWith("\\")).map((Z) => Z.slice(1)).join(`
`)
  })).map(Sl).join(`
...
`)
}
// @from(Start 9969585, End 9969856)
function FI2(A, Q, B, G = 4) {
  let I = (A.split(Q)[0] ?? "").split(/\r?\n/).length - 1,
    Y = VI2(A, Q, B).split(/\r?\n/),
    J = Math.max(0, I - G),
    W = I + G + B.split(/\r?\n/).length;
  return {
    snippet: Y.slice(J, W).join(`
`),
    startLine: J + 1
  }
}
// @from(Start 9969858, End 9970275)
function KI2(A) {
  return A.map((Q) => {
    let B = [],
      G = [],
      Z = [];
    for (let I of Q.lines)
      if (I.startsWith(" ")) B.push(I.slice(1)), G.push(I.slice(1)), Z.push(I.slice(1));
      else if (I.startsWith("-")) G.push(I.slice(1));
    else if (I.startsWith("+")) Z.push(I.slice(1));
    return {
      old_string: G.join(`
`),
      new_string: Z.join(`
`),
      replace_all: !1
    }
  })
}
// @from(Start 9970277, End 9970525)
function YD5(A) {
  let Q = A,
    B = [];
  for (let [G, Z] of Object.entries(ID5)) {
    let I = Q;
    if (Q = Q.replaceAll(G, Z), I !== Q) B.push({
      from: G,
      to: Z
    })
  }
  return {
    result: Q,
    appliedReplacements: B
  }
}
// @from(Start 9970527, End 9971626)
function DI2({
  file_path: A,
  edits: Q
}) {
  if (Q.length === 0) return {
    file_path: A,
    edits: Q
  };
  try {
    let B = b9(A);
    if (!RA().existsSync(B)) return {
      file_path: A,
      edits: Q
    };
    let G = i00(B);
    return {
      file_path: A,
      edits: Q.map(({
        old_string: Z,
        new_string: I,
        replace_all: Y
      }) => {
        let J = p00(I);
        if (G.includes(Z)) return {
          old_string: Z,
          new_string: J,
          replace_all: Y
        };
        let {
          result: W,
          appliedReplacements: X
        } = YD5(Z);
        if (G.includes(W)) {
          let V = J;
          for (let {
              from: F,
              to: K
            }
            of X) V = V.replaceAll(F, K);
          return {
            old_string: W,
            new_string: V,
            replace_all: Y
          }
        }
        return {
          old_string: Z,
          new_string: J,
          replace_all: Y
        }
      })
    }
  } catch (B) {
    AA(B)
  }
  return {
    file_path: A,
    edits: Q
  }
}
// @from(Start 9971628, End 9972384)
function JD5(A, Q, B) {
  if (A.length === Q.length && A.every((J, W) => {
      let X = Q[W];
      return X !== void 0 && J.old_string === X.old_string && J.new_string === X.new_string && J.replace_all === X.replace_all
    })) return !0;
  let G = null,
    Z = null,
    I = null,
    Y = null;
  try {
    G = hMA({
      filePath: "temp",
      fileContents: B,
      edits: A
    })
  } catch (J) {
    Z = J instanceof Error ? J.message : String(J)
  }
  try {
    I = hMA({
      filePath: "temp",
      fileContents: B,
      edits: Q
    })
  } catch (J) {
    Y = J instanceof Error ? J.message : String(J)
  }
  if (Z !== null && Y !== null) return Z === Y;
  if (Z !== null || Y !== null) return !1;
  return G.updatedFile === I.updatedFile
}
// @from(Start 9972386, End 9972793)
function HI2(A, Q) {
  if (A.file_path !== Q.file_path) return !1;
  if (A.edits.length === Q.edits.length && A.edits.every((Z, I) => {
      let Y = Q.edits[I];
      return Y !== void 0 && Z.old_string === Y.old_string && Z.new_string === Y.new_string && Z.replace_all === Y.replace_all
    })) return !0;
  let G = RA().existsSync(A.file_path) ? i00(A.file_path) : "";
  return JD5(A.edits, Q.edits, G)
}
// @from(Start 9972798, End 9972807)
QD5 = "‘"
// @from(Start 9972811, End 9972820)
BD5 = "’"
// @from(Start 9972824, End 9972833)
GD5 = "“"
// @from(Start 9972837, End 9972846)
ZD5 = "”"
// @from(Start 9972850, End 9972853)
ID5
// @from(Start 9972859, End 9973410)
P1A = L(() => {
  vMA();
  R9();
  Rh();
  yI();
  AQ();
  g1();
  ID5 = {
    "<fnr>": "<function_results>",
    "<n>": "<name>",
    "</n>": "</name>",
    "<o>": "<output>",
    "</o>": "</output>",
    "<e>": "<error>",
    "</e>": "</error>",
    "<s>": "<system>",
    "</s>": "</system>",
    "<r>": "<result>",
    "</r>": "</result>",
    "< META_START >": "<META_START>",
    "< META_END >": "<META_END>",
    "< EOT >": "<EOT>",
    "< META >": "<META>",
    "< SOS >": "<SOS>",
    "\n\nH:": `

Human:`,
    "\n\nA:": `

Assistant:`
  }
})
// @from(Start 9973450, End 9973536)
async function EI2(A, Q, B) {
  if (B !== "repl_main_thread") return [];
  return []
}
// @from(Start 9973541, End 9973550)
WD5 = 1e4
// @from(Start 9973554, End 9973563)
XD5 = 300
// @from(Start 9973567, End 9973570)
n00
// @from(Start 9973576, End 9973678)
zI2 = L(() => {
  hQ();
  _0();
  xM();
  AQ();
  g1();
  u2();
  n00 = CI2(MQ(), "session-memory")
})
// @from(Start 9973727, End 9973983)
function wI2({
  serverName: A,
  files: Q
}) {
  let B = VD5();
  g(`LSP Diagnostics: Registering ${Q.length} diagnostic file(s) from ${A} (ID: ${B})`), gMA.set(B, {
    serverName: A,
    files: Q,
    timestamp: Date.now(),
    attachmentSent: !1
  })
}
// @from(Start 9973985, End 9974187)
function $I2(A) {
  switch (A) {
    case "Error":
      return 1;
    case "Warning":
      return 2;
    case "Info":
      return 3;
    case "Hint":
      return 4;
    default:
      return 4
  }
}
// @from(Start 9974189, End 9974364)
function qI2(A) {
  return JSON.stringify({
    message: A.message,
    severity: A.severity,
    range: A.range,
    source: A.source || null,
    code: A.code || null
  })
}
// @from(Start 9974366, End 9975109)
function FD5(A) {
  let Q = new Map,
    B = [];
  for (let G of A) {
    if (!Q.has(G.uri)) Q.set(G.uri, new Set), B.push({
      uri: G.uri,
      diagnostics: []
    });
    let Z = Q.get(G.uri),
      I = B.find((J) => J.uri === G.uri),
      Y = NYA.get(G.uri) || new Set;
    for (let J of G.diagnostics) try {
      let W = qI2(J);
      if (Z.has(W) || Y.has(W)) continue;
      Z.add(W), I.diagnostics.push(J)
    } catch (W) {
      let X = W instanceof Error ? W : Error(String(W)),
        V = J.message?.substring(0, 100) || "<no message>";
      AA(Error(`Failed to deduplicate diagnostic in ${G.uri}: ${X.message}. Diagnostic message: ${V}`)), I.diagnostics.push(J)
    }
  }
  return B.filter((G) => G.diagnostics.length > 0)
}
// @from(Start 9975111, End 9977110)
function NI2() {
  g(`LSP Diagnostics: Checking registry - ${gMA.size} pending`);
  let A = [],
    Q = new Set,
    B = [];
  for (let X of gMA.values())
    if (!X.attachmentSent) A.push(...X.files), Q.add(X.serverName), B.push(X);
  if (A.length === 0) return [];
  let G;
  try {
    G = FD5(A)
  } catch (X) {
    let V = X instanceof Error ? X : Error(String(X));
    AA(Error(`Failed to deduplicate LSP diagnostics: ${V.message}`)), G = A
  }
  for (let X of B) X.attachmentSent = !0;
  let Z = A.reduce((X, V) => X + V.diagnostics.length, 0),
    I = G.reduce((X, V) => X + V.diagnostics.length, 0);
  if (Z > I) g(`LSP Diagnostics: Deduplication removed ${Z-I} duplicate diagnostic(s)`);
  let Y = 0,
    J = 0;
  for (let X of G) {
    if (X.diagnostics.sort((F, K) => $I2(F.severity) - $I2(K.severity)), X.diagnostics.length > D91) J += X.diagnostics.length - D91, X.diagnostics = X.diagnostics.slice(0, D91);
    let V = UI2 - Y;
    if (X.diagnostics.length > V) J += X.diagnostics.length - V, X.diagnostics = X.diagnostics.slice(0, V);
    Y += X.diagnostics.length
  }
  if (G = G.filter((X) => X.diagnostics.length > 0), J > 0) g(`LSP Diagnostics: Volume limiting removed ${J} diagnostic(s) (max ${D91}/file, ${UI2} total)`);
  for (let X of G) {
    if (!NYA.has(X.uri)) NYA.set(X.uri, new Set);
    let V = NYA.get(X.uri);
    for (let F of X.diagnostics) try {
      V.add(qI2(F))
    } catch (K) {
      let D = K instanceof Error ? K : Error(String(K)),
        H = F.message?.substring(0, 100) || "<no message>";
      AA(Error(`Failed to track delivered diagnostic in ${X.uri}: ${D.message}. Diagnostic message: ${H}`))
    }
  }
  let W = G.reduce((X, V) => X + V.diagnostics.length, 0);
  if (W === 0) return g("LSP Diagnostics: No new diagnostics to deliver (all filtered by deduplication)"), [];
  return g(`LSP Diagnostics: Delivering ${G.length} file(s) with ${W} diagnostic(s) from ${Q.size} server(s)`), [{
    serverName: Array.from(Q).join(", "),
    files: G
  }]
}
// @from(Start 9977112, End 9977210)
function LI2() {
  g(`LSP Diagnostics: Clearing ${gMA.size} pending diagnostic(s)`), gMA.clear()
}
// @from(Start 9977212, End 9977326)
function H91(A) {
  if (NYA.has(A)) g(`LSP Diagnostics: Clearing delivered diagnostics for ${A}`), NYA.delete(A)
}
// @from(Start 9977331, End 9977339)
D91 = 10
// @from(Start 9977343, End 9977351)
UI2 = 30
// @from(Start 9977355, End 9977358)
gMA
// @from(Start 9977360, End 9977363)
NYA
// @from(Start 9977369, End 9977434)
uMA = L(() => {
  V0();
  g1();
  gMA = new Map, NYA = new Map
})
// @from(Start 9977437, End 9977663)
function C91(A) {
  if (A?.type === "assistant" && "usage" in A.message && !(A.message.content[0]?.type === "text" && a00.has(A.message.content[0].text)) && A.message.model !== "<synthetic>") return A.message.usage;
  return
}
// @from(Start 9977665, End 9977800)
function E91(A) {
  return A.input_tokens + (A.cache_creation_input_tokens ?? 0) + (A.cache_read_input_tokens ?? 0) + A.output_tokens
}
// @from(Start 9977802, End 9977961)
function ZK(A) {
  let Q = A.length - 1;
  while (Q >= 0) {
    let B = A[Q],
      G = B ? C91(B) : void 0;
    if (G) return E91(G);
    Q--
  }
  return 0
}
// @from(Start 9977963, End 9978176)
function z91(A) {
  for (let B = A.length - 1; B >= 0; B--) {
    let G = A[B];
    if (G?.type === "assistant") {
      let Z = C91(G);
      if (Z) return E91(Z) > 200000;
      return !1
    }
  }
  return !1
}
// @from(Start 9978181, End 9978205)
GO = L(() => {
  cQ()
})
// @from(Start 9978208, End 9978266)
function s00(A) {
  if (y4A()) return _o0(A);
  return A
}
// @from(Start 9978268, End 9978307)
function LYA(A) {
  return A || y4A()
}
// @from(Start 9978309, End 9978363)
function MI2(A) {
  return y4A() && A.status === 429
}
// @from(Start 9978368, End 9978410)
mMA = L(() => {
  lbA();
  p_();
  t2()
})
// @from(Start 9978413, End 9978474)
function OI2(A) {
  return KD5.some((Q) => A.startsWith(Q))
}
// @from(Start 9978476, End 9978774)
function RI2(A, Q) {
  if (A.isUsingOverage) return null;
  if (A.status === "rejected") return {
    message: DD5(A, Q),
    severity: "error"
  };
  if (A.status === "allowed_warning") {
    let B = HD5(A);
    if (B) return {
      message: B,
      severity: "warning"
    }
  }
  return null
}
// @from(Start 9978776, End 9978886)
function r00(A, Q) {
  let B = RI2(A, Q);
  if (B && B.severity === "error") return B.message;
  return null
}
// @from(Start 9978888, End 9979000)
function o00(A, Q) {
  let B = RI2(A, Q);
  if (B && B.severity === "warning") return B.message;
  return null
}
// @from(Start 9979002, End 9979970)
function DD5(A, Q) {
  let G = f4() === "pro" && KT(Q) && o2("tengu_backstage_only"),
    Z = A.resetsAt,
    I = Z ? g3A(Z, !0) : void 0,
    Y = A.overageResetsAt ? g3A(A.overageResetsAt, !0) : void 0,
    J = I ? ` · resets ${I}` : "";
  if (A.overageStatus === "rejected") {
    let W = "";
    if (Z && A.overageResetsAt && !G)
      if (Z < A.overageResetsAt) W = ` · resets ${I}`;
      else W = ` · resets ${Y}`;
    else if (I && !G) W = ` · resets ${I}`;
    else if (Y) W = ` · resets ${Y}`;
    return MYA("Limit", W, Q)
  }
  if (A.rateLimitType === "seven_day_sonnet") {
    let W = f4();
    return MYA(W === "pro" || W === "enterprise" ? "Weekly limit" : "Sonnet weekly limit", J, Q)
  }
  if (A.rateLimitType === "seven_day_opus") return MYA("Opus weekly limit", J, Q);
  if (A.rateLimitType === "seven_day") return MYA("Weekly limit", J, Q);
  if (A.rateLimitType === "five_hour") return MYA("5-hour limit", J, Q);
  return MYA("Usage limit", J, Q)
}
// @from(Start 9979972, End 9980325)
function HD5(A) {
  let Q = A.rateLimitType === "seven_day" ? "weekly limit" : A.rateLimitType === "five_hour" ? "5-hour limit" : null;
  if (!Q) return null;
  let B = A.utilization ? Math.floor(A.utilization * 100) : void 0,
    G = A.resetsAt ? g3A(A.resetsAt, !0) : void 0;
  return B && G ? `${B}% of ${Q} used · resets ${G}` : `Approaching ${Q}`
}