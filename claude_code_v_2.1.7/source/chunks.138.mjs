
// @from(Ln 407909, Col 0)
function bJ7({
  onDone: A
}) {
  aR0.useState(() => {
    GV.cache.clear?.()
  });
  let {
    columns: Q
  } = ZB(), B = async (I) => {
    try {
      if (I.includes(zQ())) {
        let F = zQ();
        if (!vA().existsSync(F)) vA().mkdirSync(F)
      }
      if (!vA().existsSync(I)) bB(I, "", {
        encoding: "utf8",
        flush: !0
      });
      await tf(I);
      let D = "default",
        W = "";
      if (process.env.VISUAL) D = "$VISUAL", W = process.env.VISUAL;
      else if (process.env.EDITOR) D = "$EDITOR", W = process.env.EDITOR;
      let K = D !== "default" ? `Using ${D}="${W}".` : "",
        V = K ? `> ${K} To change editor, set $EDITOR or $VISUAL environment variable.` : "> To use a different editor, set the $EDITOR or $VISUAL environment variable.";
      A(`Opened memory file at ${B29(I)}

${V}`, {
        display: "system"
      })
    } catch (D) {
      e(D instanceof Error ? D : Error(String(D))), A(`Error opening memory file: ${D}`)
    }
  }, G = () => {
    A("Cancelled memory editing", {
      display: "system"
    })
  }, Y = [].length, [J, X] = aR0.useState(!1);
  return J0((I, D) => {}), sO.createElement(T, {
    flexDirection: "column"
  }, sO.createElement(T, {
    marginTop: 1,
    marginBottom: 1
  }, sO.createElement(C, {
    dimColor: !0
  }, "Learn more: ", sO.createElement(i2, {
    url: "https://code.claude.com/docs/en/memory"
  }))), !1, !1, !1, !J && sO.createElement(A29, {
    title: "Select memory to edit:",
    onSelect: B,
    onCancel: G
  }))
}
// @from(Ln 407962, Col 4)
sO
// @from(Ln 407962, Col 8)
aR0
// @from(Ln 407962, Col 13)
kJ7
// @from(Ln 407962, Col 18)
Z29
// @from(Ln 407963, Col 4)
Y29 = w(() => {
  fQ();
  v1();
  Kp();
  DQ();
  A0();
  Q29();
  G29();
  fA();
  fA();
  nz();
  P4();
  sO = c(QA(), 1), aR0 = c(QA(), 1), kJ7 = {
    type: "local-jsx",
    name: "memory",
    description: "Edit Claude memory files",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A) {
      return sO.createElement(bJ7, {
        onDone: A
      })
    },
    userFacingName() {
      return this.name
    }
  };
  Z29 = kJ7
})
// @from(Ln 407993, Col 0)
function We() {
  return L1().editorMode === "vim"
}
// @from(Ln 407997, Col 0)
function J29() {
  if (l0.terminal === "Apple_Terminal" && process.platform === "darwin") return "shift + ⏎ for newline";
  if (tBA.isEnabled() && ZRB()) return "shift + ⏎ for newline";
  return YRB() ? "\\⏎ for newline" : "backslash (\\) + return (⏎) for newline"
}
// @from(Ln 408002, Col 4)
fzA = w(() => {
  eBA();
  GQ();
  p3()
})
// @from(Ln 408008, Col 0)
function hzA(A) {
  return A.replace(/\+/g, " + ")
}
// @from(Ln 408012, Col 0)
function vE1(A) {
  let {
    dimColor: Q,
    fixedWidth: B,
    gap: G,
    paddingX: Z
  } = A, Y = hzA(J3("app:toggleTranscript", "Global", "ctrl+o")), J = hzA(J3("app:toggleTodos", "Global", "ctrl+t")), X = hzA(J3("chat:undo", "Chat", "ctrl+_")), I = hzA(J3("chat:stash", "Chat", "ctrl+s")), D = hzA(J3("chat:cycleMode", "Chat", "shift+tab")), W = hzA(J3("chat:modelPicker", "Chat", "alt+p"));
  return y2.createElement(T, {
    paddingX: Z,
    flexDirection: "row",
    gap: G
  }, y2.createElement(T, {
    flexDirection: "column",
    width: B ? 24 : void 0
  }, y2.createElement(T, null, y2.createElement(C, {
    dimColor: Q
  }, "! for bash mode")), y2.createElement(T, null, y2.createElement(C, {
    dimColor: Q
  }, "/ for commands")), y2.createElement(T, null, y2.createElement(C, {
    dimColor: Q
  }, "@ for file paths")), y2.createElement(T, null, y2.createElement(C, {
    dimColor: Q
  }, "& for background")), !1), y2.createElement(T, {
    flexDirection: "column",
    width: B ? 35 : void 0
  }, y2.createElement(T, null, y2.createElement(C, {
    dimColor: Q
  }, "double tap esc to clear input")), y2.createElement(T, null, y2.createElement(C, {
    dimColor: Q
  }, D, " to auto-accept edits")), y2.createElement(T, null, y2.createElement(C, {
    dimColor: Q
  }, Y, " for verbose output")), y2.createElement(T, null, y2.createElement(C, {
    dimColor: Q
  }, J, " to show todos")), y2.createElement(T, null, y2.createElement(C, {
    dimColor: Q
  }, J29()))), y2.createElement(T, {
    flexDirection: "column"
  }, y2.createElement(T, null, y2.createElement(C, {
    dimColor: Q
  }, X, " to undo")), Qs0 && y2.createElement(T, null, y2.createElement(C, {
    dimColor: Q
  }, "ctrl + z to suspend")), y2.createElement(T, null, y2.createElement(C, {
    dimColor: Q
  }, zzA.displayText.replace("+", " + "), " to paste images")), y2.createElement(T, null, y2.createElement(C, {
    dimColor: Q
  }, W, " to switch model")), y2.createElement(T, null, y2.createElement(C, {
    dimColor: Q
  }, I, " to stash prompt")), Pk() && y2.createElement(T, null, y2.createElement(C, {
    dimColor: Q
  }, "/keybindings to customize"))))
}
// @from(Ln 408063, Col 4)
y2
// @from(Ln 408064, Col 4)
oR0 = w(() => {
  fA();
  x3A();
  c3();
  fzA();
  NX();
  XDA();
  y2 = c(QA(), 1)
})
// @from(Ln 408074, Col 0)
function X29({
  onCancel: A
}) {
  return J0((Q, B) => {
    if (B.escape) A()
  }), LU.createElement(T, {
    flexDirection: "column",
    paddingY: 1,
    gap: 1
  }, LU.createElement(T, null, LU.createElement(C, null, "Claude understands your codebase, makes edits with your permission, and executes commands — right from your terminal.")), LU.createElement(T, {
    flexDirection: "column"
  }, LU.createElement(T, null, LU.createElement(C, {
    bold: !0
  }, "Shortcuts")), LU.createElement(vE1, {
    gap: 2
  })))
}
// @from(Ln 408091, Col 4)
LU
// @from(Ln 408092, Col 4)
I29 = w(() => {
  fA();
  oR0();
  LU = c(QA(), 1)
})
// @from(Ln 408098, Col 0)
function rR0({
  commands: A,
  maxHeight: Q,
  title: B,
  onCancel: G,
  emptyMessage: Z
}) {
  let Y = Math.max(1, Math.floor((Q - 6) / 2)),
    J = D29.useMemo(() => [...A].sort((X, I) => X.name.localeCompare(I.name)).map((X) => ({
      label: `/${X.name}`,
      value: X.name,
      description: gzA(X)
    })), [A]);
  return w$.createElement(T, {
    flexDirection: "column",
    paddingY: 1
  }, A.length === 0 && Z ? w$.createElement(C, {
    dimColor: !0
  }, Z) : w$.createElement(w$.Fragment, null, w$.createElement(C, null, B), w$.createElement(T, {
    marginTop: 1
  }, w$.createElement(k0, {
    options: J,
    visibleOptionCount: Y,
    onCancel: G,
    disableSelection: !0,
    hideIndexes: !0,
    layout: "compact-vertical"
  }))))
}
// @from(Ln 408127, Col 4)
w$
// @from(Ln 408127, Col 8)
D29
// @from(Ln 408128, Col 4)
W29 = w(() => {
  fA();
  WV();
  W8();
  w$ = c(QA(), 1), D29 = c(QA(), 1)
})
// @from(Ln 408135, Col 0)
function K29({
  onClose: A,
  commands: Q
}) {
  let {
    rows: B
  } = ZB(), G = Math.floor(B / 2), Z = () => A("Help dialog dismissed", {
    display: "system"
  }), Y = MQ(Z), J = xs(), X = Q.filter((K) => J.has(K.name) && !K.isHidden), I = [], D = Q.filter((K) => !J.has(K.name) && !K.isHidden), W = [p8.createElement(kX, {
    key: "general",
    title: "general"
  }, p8.createElement(X29, {
    onCancel: Z
  }))];
  return W.push(p8.createElement(kX, {
    key: "commands",
    title: "commands"
  }, p8.createElement(rR0, {
    commands: X,
    maxHeight: G,
    title: "Browse default commands:",
    onCancel: Z
  }))), W.push(p8.createElement(kX, {
    key: "custom",
    title: "custom-commands"
  }, p8.createElement(rR0, {
    commands: D,
    maxHeight: G,
    title: "Browse custom commands:",
    emptyMessage: "No custom commands found",
    onCancel: Z
  }))), p8.createElement(T, {
    flexDirection: "column",
    height: G
  }, p8.createElement(K8, {
    dividerColor: "professionalBlue"
  }), p8.createElement(T, {
    paddingX: 1,
    flexDirection: "column"
  }, p8.createElement(Nj, {
    title: `Claude Code v${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.VERSION}`,
    color: "professionalBlue",
    defaultTab: "general"
  }, W), p8.createElement(T, {
    marginTop: 1
  }, p8.createElement(C, null, "For more help:", " ", p8.createElement(i2, {
    url: "https://code.claude.com/docs/en/overview"
  }))), p8.createElement(T, {
    marginTop: 1
  }, p8.createElement(C, {
    dimColor: !0
  }, Y.pending ? p8.createElement(p8.Fragment, null, "Press ", Y.keyName, " again to exit") : p8.createElement(C, {
    italic: !0
  }, "Esc to cancel")))))
}
// @from(Ln 408190, Col 4)
p8
// @from(Ln 408191, Col 4)
V29 = w(() => {
  fA();
  lD();
  v3A();
  I29();
  W29();
  WV();
  P4();
  E9();
  fA();
  p8 = c(QA(), 1)
})
// @from(Ln 408203, Col 4)
sR0
// @from(Ln 408203, Col 9)
fJ7
// @from(Ln 408203, Col 14)
F29
// @from(Ln 408204, Col 4)
H29 = w(() => {
  V29();
  sR0 = c(QA(), 1), fJ7 = {
    type: "local-jsx",
    name: "help",
    description: "Show help and available commands",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A, {
      options: {
        commands: Q
      }
    }) {
      return sR0.createElement(K29, {
        commands: Q,
        onClose: A
      })
    },
    userFacingName() {
      return "help"
    }
  }, F29 = fJ7
})
// @from(Ln 408228, Col 0)
function E29({
  onComplete: A
}) {
  let Q = MQ(),
    B = tR0.useCallback(async (Z) => {
      let Y = Z === "yes";
      S0((J) => ({
        ...J,
        autoConnectIde: Y,
        hasIdeAutoConnectDialogBeenShown: !0
      })), A()
    }, [A]);
  return J0((Z, Y) => {
    if (Y.escape) A()
  }), gJ.default.createElement(T, {
    marginTop: 1,
    flexDirection: "column"
  }, gJ.default.createElement(T, {
    flexDirection: "column",
    borderStyle: "round",
    borderColor: "ide",
    paddingX: 2,
    paddingY: 1,
    width: "100%"
  }, gJ.default.createElement(T, {
    marginBottom: 1
  }, gJ.default.createElement(C, {
    color: "ide"
  }, "Do you wish to enable auto-connect to IDE?")), gJ.default.createElement(T, {
    flexDirection: "column",
    paddingX: 1
  }, gJ.default.createElement(k0, {
    options: [{
      label: "Yes",
      value: "yes"
    }, {
      label: "No",
      value: "no"
    }],
    onChange: B,
    defaultValue: "yes",
    onCancel: () => A()
  })), gJ.default.createElement(T, {
    marginTop: 1
  }, gJ.default.createElement(C, {
    dimColor: !0
  }, "You can also configure this in /config or with the --ide flag"))), gJ.default.createElement(T, {
    paddingX: 1
  }, gJ.default.createElement(C, {
    dimColor: !0
  }, Q.pending ? gJ.default.createElement(gJ.default.Fragment, null, "Press ", Q.keyName, " again to exit") : "Enter to confirm")))
}
// @from(Ln 408281, Col 0)
function z29() {
  let A = L1();
  return !zK() && A.autoConnectIde !== !0 && A.hasIdeAutoConnectDialogBeenShown !== !0
}
// @from(Ln 408286, Col 0)
function $29({
  onComplete: A
}) {
  let Q = MQ(),
    B = tR0.useCallback((Z) => {
      let Y = Z === "yes";
      if (Y) S0((J) => ({
        ...J,
        autoConnectIde: !1
      }));
      A(Y)
    }, [A]);
  return J0((Z, Y) => {
    if (Y.escape) A(!1)
  }), gJ.default.createElement(T, {
    marginTop: 1,
    flexDirection: "column"
  }, gJ.default.createElement(T, {
    flexDirection: "column",
    borderStyle: "round",
    borderColor: "ide",
    paddingX: 2,
    paddingY: 1,
    width: "100%"
  }, gJ.default.createElement(T, {
    marginBottom: 1
  }, gJ.default.createElement(C, {
    color: "ide"
  }, "Do you wish to disable auto-connect to IDE?")), gJ.default.createElement(T, {
    flexDirection: "column",
    paddingX: 1
  }, gJ.default.createElement(k0, {
    options: [{
      label: "Yes",
      value: "yes"
    }, {
      label: "No",
      value: "no"
    }],
    onChange: B,
    defaultValue: "yes",
    onCancel: () => A(!1)
  })), gJ.default.createElement(T, {
    marginTop: 1
  }, gJ.default.createElement(C, {
    dimColor: !0
  }, "You can also configure this in /config"))), gJ.default.createElement(T, {
    paddingX: 1
  }, gJ.default.createElement(C, {
    dimColor: !0
  }, Q.pending ? gJ.default.createElement(gJ.default.Fragment, null, "Press ", Q.keyName, " again to exit") : "Enter to confirm")))
}
// @from(Ln 408339, Col 0)
function C29() {
  let A = L1();
  return !zK() && A.autoConnectIde === !0
}
// @from(Ln 408343, Col 4)
gJ
// @from(Ln 408343, Col 8)
tR0
// @from(Ln 408344, Col 4)
U29 = w(() => {
  fA();
  GQ();
  fA();
  u8();
  E9();
  TX();
  gJ = c(QA(), 1), tR0 = c(QA(), 1)
})
// @from(Ln 408353, Col 4)
zgA = w(() => {
  t4();
  V2();
  DQ();
  ZI();
  T1();
  GQ();
  GB()
})
// @from(Ln 408364, Col 0)
function hJ7({
  availableIDEs: A,
  unavailableIDEs: Q,
  selectedIDE: B,
  onClose: G,
  onSelect: Z
}) {
  let [Y, J] = ef.useState(B?.port?.toString() ?? "None"), [X, I] = ef.useState(!1), [D, W] = ef.useState(!1), K = ef.useCallback((H) => {
    if (H !== "None" && z29()) I(!0);
    else if (H === "None" && C29()) W(!0);
    else Z(A.find((E) => E.port === parseInt(H)))
  }, [A, Z]), V = A.reduce((H, E) => {
    return H[E.name] = (H[E.name] || 0) + 1, H
  }, {}), F = A.map((H) => {
    let z = (V[H.name] || 0) > 1 && H.workspaceFolders.length > 0;
    return {
      label: H.name,
      value: H.port.toString(),
      description: z ? q29(H.workspaceFolders) : void 0
    }
  }).concat([{
    label: "None",
    value: "None",
    description: void 0
  }]);
  if (X) return aF.default.createElement(E29, {
    onComplete: () => K(Y)
  });
  if (D) return aF.default.createElement($29, {
    onComplete: () => {
      Z(void 0)
    }
  });
  return aF.default.createElement(o9, {
    title: "Select IDE",
    subtitle: "Connect to an IDE for integrated development features.",
    onCancel: G,
    color: "ide",
    borderDimColor: !1
  }, aF.default.createElement(T, {
    flexDirection: "column"
  }, A.length === 0 && aF.default.createElement(C, {
    dimColor: !0
  }, XhA() ? `No available IDEs detected. Please install the plugin and restart your IDE:
https://docs.claude.com/s/claude-code-jetbrains` : "No available IDEs detected. Make sure your IDE has the Claude Code extension or plugin installed and is running."), A.length !== 0 && aF.default.createElement(k0, {
    defaultValue: Y,
    defaultFocusValue: Y,
    options: F,
    onChange: (H) => {
      J(H), K(H)
    }
  }), A.length !== 0 && !zK() && aF.default.createElement(C, {
    dimColor: !0
  }, "Tip: You can enable auto-connect to IDE in /config or with the --ide flag"), Q.length > 0 && aF.default.createElement(T, {
    flexDirection: "column"
  }, aF.default.createElement(C, {
    dimColor: !0
  }, "Found ", Q.length, " other running IDE(s). However, their workspace/project directories do not match the current cwd."), aF.default.createElement(T, {
    marginTop: 1,
    flexDirection: "column"
  }, Q.map((H, E) => aF.default.createElement(T, {
    key: E,
    paddingLeft: 3
  }, aF.default.createElement(C, {
    dimColor: !0
  }, "• ", H.name, ": ", q29(H.workspaceFolders))))))))
}
// @from(Ln 408431, Col 0)
async function gJ7(A, Q) {
  let B = Q?.ide;
  if (!B || B.type !== "sse-ide" && B.type !== "ws-ide") return null;
  for (let G of A)
    if (G.url === B.url) return G;
  return null
}
// @from(Ln 408439, Col 0)
function uJ7({
  runningIDEs: A,
  onSelectIDE: Q,
  onDone: B
}) {
  let [G, Z] = ef.useState(A[0] ?? ""), Y = ef.useCallback((I) => {
    Q(I)
  }, [Q]), J = A.map((I) => ({
    label: EK(I),
    value: I
  }));

  function X() {
    B("IDE selection cancelled", {
      display: "system"
    })
  }
  return aF.default.createElement(o9, {
    title: "Select IDE to install extension",
    onCancel: X,
    color: "ide",
    borderDimColor: !1
  }, aF.default.createElement(k0, {
    defaultFocusValue: G,
    options: J,
    onChange: (I) => {
      Z(I), Y(I)
    }
  }))
}
// @from(Ln 408470, Col 0)
function q29(A, Q = 100) {
  if (A.length === 0) return "";
  let B = o1(),
    G = A.slice(0, 2),
    Z = A.length > 2,
    Y = Z ? 3 : 0,
    J = (G.length - 1) * 2,
    X = Q - J - Y,
    I = Math.floor(X / G.length),
    W = G.map((K) => {
      if (K.startsWith(B + N29.sep)) K = K.slice(B.length + 1);
      if (K.length <= I) return K;
      return "…" + K.slice(-(I - 1))
    }).join(", ");
  if (Z) W += ", …";
  return W
}
// @from(Ln 408487, Col 4)
aF
// @from(Ln 408487, Col 8)
ef
// @from(Ln 408487, Col 12)
mJ7
// @from(Ln 408487, Col 17)
w29
// @from(Ln 408488, Col 4)
L29 = w(() => {
  fA();
  u8();
  U29();
  TX();
  Z0();
  JZ();
  rY();
  zgA();
  V2();
  t4();
  Z3();
  aF = c(QA(), 1), ef = c(QA(), 1);
  mJ7 = {
    type: "local-jsx",
    name: "ide",
    description: "Manage IDE integrations and show status",
    isEnabled: () => !0,
    isHidden: !1,
    argumentHint: "[open]",
    async call(A, Q, B) {
      l("tengu_ext_ide_command", {}), T9("ide-integration");
      let {
        options: {
          dynamicMcpConfig: G
        },
        onChangeDynamicMcpConfig: Z
      } = Q, Y = await IhA(!0);
      if (Y.length === 0 && Q.onInstallIDEExtension && !zK()) {
        let W = await OL0(),
          K = (V) => {
            if (Q.onInstallIDEExtension)
              if (Q.onInstallIDEExtension(V), Rx(V)) A(`Installed plugin to ${I1.bold(EK(V))}
Please ${I1.bold("restart your IDE")} completely for it to take effect`);
              else A(`Installed extension to ${I1.bold(EK(V))}`)
          };
        if (W.length > 1) return aF.default.createElement(uJ7, {
          runningIDEs: W,
          onSelectIDE: K,
          onDone: () => {
            A("No IDE selected.", {
              display: "system"
            })
          }
        });
        else if (W.length === 1) {
          let V = W[0];
          return aF.default.createElement(() => {
            return ef.useEffect(() => {
              K(V)
            }, []), null
          }, null)
        }
      }
      let J = Y.filter((W) => W.isValid),
        X = Y.filter((W) => !W.isValid),
        I = await gJ7(J, G);
      return aF.default.createElement(hJ7, {
        availableIDEs: J,
        unavailableIDEs: X,
        selectedIDE: I,
        onClose: () => A("IDE selection cancelled", {
          display: "system"
        }),
        onSelect: async (W) => {
          try {
            if (!Z) {
              A("Error connecting to IDE.");
              return
            }
            let K = {
              ...G || {}
            };
            if (I) delete K.ide;
            if (!W) A(I ? `Disconnected from ${I.name}.` : "No IDE selected.");
            else {
              let V = W.url;
              K.ide = {
                type: V.startsWith("ws:") ? "ws-ide" : "sse-ide",
                url: V,
                ideName: W.name,
                authToken: W.authToken,
                ideRunningInWindows: W.ideRunningInWindows,
                scope: "dynamic"
              }, A(`Connected to ${W.name}.`)
            }
            Z(K)
          } catch (K) {
            A("Error connecting to IDE.")
          }
        }
      })
    },
    userFacingName() {
      return "ide"
    }
  }, w29 = mJ7
})
// @from(Ln 408586, Col 4)
dJ7
// @from(Ln 408586, Col 9)
O29
// @from(Ln 408587, Col 4)
M29 = w(() => {
  KjA();
  dJ7 = {
    type: "prompt",
    name: "init",
    description: "Initialize a new CLAUDE.md file with codebase documentation",
    contentLength: 0,
    isEnabled: () => !0,
    isHidden: !1,
    progressMessage: "analyzing your codebase",
    userFacingName() {
      return "init"
    },
    source: "builtin",
    async getPromptForCommand() {
      return FDA(), [{
        type: "text",
        text: `Please analyze this codebase and create a CLAUDE.md file, which will be given to future instances of Claude Code to operate in this repository.

What to add:
1. Commands that will be commonly used, such as how to build, lint, and run tests. Include the necessary commands to develop in this codebase, such as how to run a single test.
2. High-level code architecture and structure so that future instances can be productive more quickly. Focus on the "big picture" architecture that requires reading multiple files to understand.

Usage notes:
- If there's already a CLAUDE.md, suggest improvements to it.
- When you make the initial CLAUDE.md, do not repeat yourself and do not include obvious instructions like "Provide helpful error messages to users", "Write unit tests for all new utilities", "Never include sensitive information (API keys, tokens) in code or commits".
- Avoid listing every component or file structure that can be easily discovered.
- Don't include generic development practices.
- If there are Cursor rules (in .cursor/rules/ or .cursorrules) or Copilot rules (in .github/copilot-instructions.md), make sure to include the important parts.
- If there is a README.md, make sure to include the important parts.
- Do not make up information such as "Common Development Tasks", "Tips for Development", "Support and Documentation" unless this is expressly included in other files that you read.
- Be sure to prefix the file with the following text:

\`\`\`
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
\`\`\``
      }]
    }
  }, O29 = dJ7
})
// @from(Ln 408630, Col 0)
function cJ7(A) {
  let Q = new Set(IB0.map((B) => aBA(B.key)));
  return A.map((B) => {
    let G = {};
    for (let [Z, Y] of Object.entries(B.bindings))
      if (!Q.has(aBA(Z))) G[Z] = Y;
    return {
      context: B.context,
      bindings: G
    }
  }).filter((B) => Object.keys(B.bindings).length > 0)
}
// @from(Ln 408643, Col 0)
function R29() {
  let Q = {
    $schema: "https://code.claude.com/docs/schemas/keybindings.json",
    $docs: "https://code.claude.com/docs/s/claude-code-keybindings",
    bindings: cJ7(d21)
  };
  return eA(Q, null, 2) + `
`
}
// @from(Ln 408652, Col 4)
_29 = w(() => {
  XB0();
  DB0();
  A0()
})
// @from(Ln 408665, Col 0)
async function aJ7() {
  if (!Pk()) return {
    type: "text",
    value: "Keybinding customization is not enabled. This feature is currently in preview."
  };
  let A = rBA(),
    Q = !1;
  try {
    await pJ7(A), Q = !0
  } catch {}
  if (!Q) {
    let B = R29(),
      G = nJ7(A);
    await iJ7(G, {
      recursive: !0
    }), await lJ7(A, B, "utf-8")
  }
  try {
    return await tf(A), {
      type: "text",
      value: Q ? `Opened ${A} in your editor.` : `Created ${A} with template. Opened in your editor.`
    }
  } catch (B) {
    return {
      type: "text",
      value: `${Q?"Opened":"Created"} ${A}. Could not open in editor: ${B instanceof Error?B.message:String(B)}`
    }
  }
}
// @from(Ln 408694, Col 4)
oJ7
// @from(Ln 408694, Col 9)
j29
// @from(Ln 408695, Col 4)
T29 = w(() => {
  XDA();
  _29();
  Kp();
  oJ7 = {
    name: "keybindings",
    description: "Open or create your keybindings configuration file",
    isEnabled: () => Pk(),
    isHidden: !1,
    supportsNonInteractive: !1,
    type: "local",
    userFacingName: () => "keybindings",
    call: aJ7
  }, j29 = oJ7
})
// @from(Ln 408711, Col 0)
function S29() {
  return P29.default.createElement(C, null, "Checking GitHub CLI installation…")
}
// @from(Ln 408714, Col 4)
P29
// @from(Ln 408715, Col 4)
x29 = w(() => {
  fA();
  P29 = c(QA(), 1)
})
// @from(Ln 408720, Col 0)
function y29({
  currentRepo: A,
  useCurrentRepo: Q,
  repoUrl: B,
  onRepoUrlChange: G,
  onSubmit: Z,
  onToggleUseCurrentRepo: Y
}) {
  let [J, X] = UK.useState(0), [I, D] = UK.useState(!1), K = ZB().columns, V = () => {
    if (!(Q ? A : B)?.trim()) {
      D(!0);
      return
    }
    Z()
  };
  return J0((F, H) => {
    if (H.upArrow) Y(!0), D(!1);
    else if (H.downArrow) Y(!1), D(!1);
    else if (H.return) V()
  }), UK.default.createElement(UK.default.Fragment, null, UK.default.createElement(T, {
    flexDirection: "column",
    borderStyle: "round",
    borderDimColor: !0,
    paddingX: 1
  }, UK.default.createElement(T, {
    flexDirection: "column",
    marginBottom: 1
  }, UK.default.createElement(C, {
    bold: !0
  }, "Install GitHub App"), UK.default.createElement(C, {
    dimColor: !0
  }, "Select GitHub repository")), A && UK.default.createElement(T, {
    marginBottom: 1
  }, UK.default.createElement(C, {
    bold: Q,
    color: Q ? "permission" : void 0
  }, Q ? "> " : "  ", "Use current repository: ", A)), UK.default.createElement(T, {
    marginBottom: 1
  }, UK.default.createElement(C, {
    bold: !Q || !A,
    color: !Q || !A ? "permission" : void 0
  }, !Q || !A ? "> " : "  ", A ? "Enter a different repository" : "Enter repository")), (!Q || !A) && UK.default.createElement(T, {
    marginLeft: 2,
    marginBottom: 1
  }, UK.default.createElement(p4, {
    value: B,
    onChange: (F) => {
      G(F), D(!1)
    },
    onSubmit: V,
    focus: !0,
    placeholder: "Enter a repo as owner/repo or https://github.com/owner/repo…",
    columns: K,
    cursorOffset: J,
    onChangeCursorOffset: X,
    showCursor: !0
  }))), I && UK.default.createElement(T, {
    marginLeft: 3,
    marginBottom: 1
  }, UK.default.createElement(C, {
    color: "error"
  }, "Please enter a repository name to continue")), UK.default.createElement(T, {
    marginLeft: 3
  }, UK.default.createElement(C, {
    dimColor: !0
  }, A ? "↑/↓ to select · " : "", "Enter to continue")))
}
// @from(Ln 408787, Col 4)
UK
// @from(Ln 408788, Col 4)
v29 = w(() => {
  fA();
  IY();
  P4();
  UK = c(QA(), 1)
})
// @from(Ln 408794, Col 4)
k29 = "Add Claude Code GitHub Workflow"
// @from(Ln 408795, Col 2)
Ah = "https://github.com/anthropics/claude-code-action/blob/main/docs/setup.md"
// @from(Ln 408796, Col 2)
b29 = `name: Claude Code

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, assigned]
  pull_request_review:
    types: [submitted]

jobs:
  claude:
    if: |
      (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review' && contains(github.event.review.body, '@claude')) ||
      (github.event_name == 'issues' && (contains(github.event.issue.body, '@claude') || contains(github.event.issue.title, '@claude')))
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
      issues: read
      id-token: write
      actions: read # Required for Claude to read CI results on PRs
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Run Claude Code
        id: claude
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: \${{ secrets.ANTHROPIC_API_KEY }}

          # This is an optional setting that allows Claude to read CI results on PRs
          additional_permissions: |
            actions: read

          # Optional: Give a custom prompt to Claude. If this is not specified, Claude will perform the instructions specified in the comment that tagged it.
          # prompt: 'Update the pull request description to include a summary of changes.'

          # Optional: Add claude_args to customize behavior and configuration
          # See https://github.com/anthropics/claude-code-action/blob/main/docs/usage.md
          # or https://code.claude.com/docs/en/cli-reference for available options
          # claude_args: '--allowed-tools Bash(gh pr:*)'

`
// @from(Ln 408847, Col 2)
f29 = `## \uD83E\uDD16 Installing Claude Code GitHub App

This PR adds a GitHub Actions workflow that enables Claude Code integration in our repository.

### What is Claude Code?

[Claude Code](https://claude.com/claude-code) is an AI coding agent that can help with:
- Bug fixes and improvements  
- Documentation updates
- Implementing new features
- Code reviews and suggestions
- Writing tests
- And more!

### How it works

Once this PR is merged, we'll be able to interact with Claude by mentioning @claude in a pull request or issue comment.
Once the workflow is triggered, Claude will analyze the comment and surrounding context, and execute on the request in a GitHub action.

### Important Notes

- **This workflow won't take effect until this PR is merged**
- **@claude mentions won't work until after the merge is complete**
- The workflow runs automatically whenever Claude is mentioned in PR or issue comments
- Claude gets access to the entire PR or issue context including files, diffs, and previous comments

### Security

- Our Anthropic API key is securely stored as a GitHub Actions secret
- Only users with write access to the repository can trigger the workflow
- All Claude runs are stored in the GitHub Actions run history
- Claude's default tools are limited to reading/writing files and interacting with our repo by creating comments, branches, and commits.
- We can add more allowed tools by adding them to the workflow file like:

\`\`\`
allowed_tools: Bash(npm install),Bash(npm run build),Bash(npm run lint),Bash(npm run test)
\`\`\`

There's more information in the [Claude Code action repo](https://github.com/anthropics/claude-code-action).

After merging this PR, let's try mentioning @claude in a comment on any PR to get started!`
// @from(Ln 408888, Col 2)
h29 = `name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize, ready_for_review, reopened]
    # Optional: Only run on specific file changes
    # paths:
    #   - "src/**/*.ts"
    #   - "src/**/*.tsx"
    #   - "src/**/*.js"
    #   - "src/**/*.jsx"

jobs:
  claude-review:
    # Optional: Filter by PR author
    # if: |
    #   github.event.pull_request.user.login == 'external-contributor' ||
    #   github.event.pull_request.user.login == 'new-developer' ||
    #   github.event.pull_request.author_association == 'FIRST_TIME_CONTRIBUTOR'

    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
      issues: read
      id-token: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Run Claude Code Review
        id: claude-review
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: \${{ secrets.ANTHROPIC_API_KEY }}
          plugin_marketplaces: 'https://github.com/anthropics/claude-code.git'
          plugins: 'code-review@claude-code-plugins'
          prompt: '/code-review:code-review \${{ github.repository }}/pull/\${{ github.event.pull_request.number }}'
          # See https://github.com/anthropics/claude-code-action/blob/main/docs/usage.md
          # or https://code.claude.com/docs/en/cli-reference for available options

`
// @from(Ln 408934, Col 0)
function g29({
  repoUrl: A,
  onSubmit: Q
}) {
  return J0((B, G) => {
    if (G.return) Q()
  }), qK.default.createElement(T, {
    flexDirection: "column",
    borderStyle: "round",
    borderDimColor: !0,
    paddingX: 1
  }, qK.default.createElement(T, {
    flexDirection: "column",
    marginBottom: 1
  }, qK.default.createElement(C, {
    bold: !0
  }, "Install the Claude GitHub App")), qK.default.createElement(T, {
    marginBottom: 1
  }, qK.default.createElement(C, null, "Opening browser to install the Claude GitHub App…")), qK.default.createElement(T, {
    marginBottom: 1
  }, qK.default.createElement(C, null, "If your browser doesn't open automatically, visit:")), qK.default.createElement(T, {
    marginBottom: 1
  }, qK.default.createElement(C, {
    underline: !0
  }, "https://github.com/apps/claude")), qK.default.createElement(T, {
    marginBottom: 1
  }, qK.default.createElement(C, null, "Please install the app for repository: ", qK.default.createElement(C, {
    bold: !0
  }, A))), qK.default.createElement(T, {
    marginBottom: 1
  }, qK.default.createElement(C, {
    dimColor: !0
  }, "Important: Make sure to grant access to this specific repository")), qK.default.createElement(T, null, qK.default.createElement(C, {
    bold: !0,
    color: "permission"
  }, "Press Enter once you've installed the app", tA.ellipsis)), qK.default.createElement(T, {
    marginTop: 1
  }, qK.default.createElement(C, {
    dimColor: !0
  }, "Having trouble? See manual setup instructions at:", " ", qK.default.createElement(C, {
    color: "claude"
  }, Ah))))
}
// @from(Ln 408977, Col 4)
qK
// @from(Ln 408978, Col 4)
u29 = w(() => {
  fA();
  B2();
  qK = c(QA(), 1)
})
// @from(Ln 408984, Col 0)
function m29({
  useExistingSecret: A,
  secretName: Q,
  onToggleUseExistingSecret: B,
  onSecretNameChange: G,
  onSubmit: Z
}) {
  let [Y, J] = bX.useState(0), X = ZB(), [I] = oB();
  return J0((D, W) => {
    if (W.upArrow) B(!0);
    else if (W.downArrow) B(!1);
    else if (W.return) Z()
  }), bX.default.createElement(bX.default.Fragment, null, bX.default.createElement(T, {
    flexDirection: "column",
    borderStyle: "round",
    borderDimColor: !0,
    paddingX: 1
  }, bX.default.createElement(T, {
    flexDirection: "column",
    marginBottom: 1
  }, bX.default.createElement(C, {
    bold: !0
  }, "Install GitHub App"), bX.default.createElement(C, {
    dimColor: !0
  }, "Setup API key secret")), bX.default.createElement(T, {
    marginBottom: 1
  }, bX.default.createElement(C, {
    color: "warning"
  }, "ANTHROPIC_API_KEY already exists in repository secrets!")), bX.default.createElement(T, {
    marginBottom: 1
  }, bX.default.createElement(C, null, "Would you like to:")), bX.default.createElement(T, {
    marginBottom: 1
  }, bX.default.createElement(C, null, A ? sQ("success", I)("> ") : "  ", "Use the existing API key")), bX.default.createElement(T, {
    marginBottom: 1
  }, bX.default.createElement(C, null, !A ? sQ("success", I)("> ") : "  ", "Create a new secret with a different name")), !A && bX.default.createElement(bX.default.Fragment, null, bX.default.createElement(T, {
    marginBottom: 1
  }, bX.default.createElement(C, null, "Enter new secret name (alphanumeric with underscores):")), bX.default.createElement(p4, {
    value: Q,
    onChange: G,
    onSubmit: Z,
    focus: !0,
    placeholder: "e.g., CLAUDE_API_KEY",
    columns: X.columns,
    cursorOffset: Y,
    onChangeCursorOffset: J,
    showCursor: !0
  }))), bX.default.createElement(T, {
    marginLeft: 3
  }, bX.default.createElement(C, {
    dimColor: !0
  }, "↑/↓ to select · Enter to continue")))
}
// @from(Ln 409036, Col 4)
bX
// @from(Ln 409037, Col 4)
d29 = w(() => {
  fA();
  IY();
  P4();
  bX = c(QA(), 1)
})
// @from(Ln 409044, Col 0)
function c29({
  existingApiKey: A,
  apiKeyOrOAuthToken: Q,
  onApiKeyChange: B,
  onSubmit: G,
  onToggleUseExistingKey: Z,
  onCreateOAuthToken: Y,
  selectedOption: J = A ? "existing" : Y ? "oauth" : "new",
  onSelectOption: X
}) {
  let [I, D] = oF.useState(0), W = ZB(), [K] = oB();
  return J0((V, F) => {
    if (F.upArrow) {
      if (J === "new" && Y) X?.("oauth");
      else if (J === "oauth" && A) X?.("existing"), Z(!0)
    } else if (F.downArrow) {
      if (J === "existing") X?.(Y ? "oauth" : "new"), Z(!1);
      else if (J === "oauth") X?.("new")
    }
    if (F.return)
      if (J === "oauth" && Y) Y();
      else G()
  }), oF.default.createElement(oF.default.Fragment, null, oF.default.createElement(T, {
    flexDirection: "column",
    borderStyle: "round",
    borderDimColor: !0,
    paddingX: 1
  }, oF.default.createElement(T, {
    flexDirection: "column",
    marginBottom: 1
  }, oF.default.createElement(C, {
    bold: !0
  }, "Install GitHub App"), oF.default.createElement(C, {
    dimColor: !0
  }, "Choose API key")), A && oF.default.createElement(T, {
    marginBottom: 1
  }, oF.default.createElement(C, null, J === "existing" ? sQ("success", K)("> ") : "  ", "Use your existing Claude Code API key")), Y && oF.default.createElement(T, {
    marginBottom: 1
  }, oF.default.createElement(C, null, J === "oauth" ? sQ("success", K)("> ") : "  ", "Create a long-lived token with your Claude subscription")), oF.default.createElement(T, {
    marginBottom: 1
  }, oF.default.createElement(C, null, J === "new" ? sQ("success", K)("> ") : "  ", "Enter a new API key")), J === "new" && oF.default.createElement(p4, {
    value: Q,
    onChange: B,
    onSubmit: G,
    onPaste: B,
    focus: !0,
    placeholder: "sk-ant… (Create a new key at https://platform.claude.com/settings/keys)",
    mask: "*",
    columns: W.columns,
    cursorOffset: I,
    onChangeCursorOffset: D,
    showCursor: !0
  })), oF.default.createElement(T, {
    marginLeft: 3
  }, oF.default.createElement(C, {
    dimColor: !0
  }, "↑/↓ to select · Enter to continue")))
}
// @from(Ln 409102, Col 4)
oF
// @from(Ln 409103, Col 4)
p29 = w(() => {
  fA();
  IY();
  P4();
  oF = c(QA(), 1)
})
// @from(Ln 409110, Col 0)
function l29({
  currentWorkflowInstallStep: A,
  secretExists: Q,
  useExistingSecret: B,
  secretName: G,
  skipWorkflow: Z = !1,
  selectedWorkflows: Y
}) {
  let J = Z ? ["Getting repository information", Q && B ? "Using existing API key secret" : `Setting up ${G} secret`] : ["Getting repository information", "Creating branch", Y.length > 1 ? "Creating workflow files" : "Creating workflow file", Q && B ? "Using existing API key secret" : `Setting up ${G} secret`, "Opening pull request page"];
  return Vp.default.createElement(Vp.default.Fragment, null, Vp.default.createElement(T, {
    flexDirection: "column",
    borderStyle: "round",
    borderDimColor: !0,
    paddingX: 1
  }, Vp.default.createElement(T, {
    flexDirection: "column",
    marginBottom: 1
  }, Vp.default.createElement(C, {
    bold: !0
  }, "Install GitHub App"), Vp.default.createElement(C, {
    dimColor: !0
  }, "Create GitHub Actions workflow")), J.map((X, I) => {
    let D = "pending";
    if (I < A) D = "completed";
    else if (I === A) D = "in-progress";
    return Vp.default.createElement(T, {
      key: I
    }, Vp.default.createElement(C, {
      color: D === "completed" ? "success" : D === "in-progress" ? "warning" : void 0
    }, D === "completed" ? "✓ " : "", X, D === "in-progress" ? "…" : ""))
  })))
}
// @from(Ln 409142, Col 4)
Vp
// @from(Ln 409143, Col 4)
i29 = w(() => {
  fA();
  Vp = c(QA(), 1)
})
// @from(Ln 409148, Col 0)
function n29({
  secretExists: A,
  useExistingSecret: Q,
  secretName: B,
  skipWorkflow: G = !1
}) {
  return ZJ.default.createElement(ZJ.default.Fragment, null, ZJ.default.createElement(T, {
    flexDirection: "column",
    borderStyle: "round",
    borderDimColor: !0,
    paddingX: 1
  }, ZJ.default.createElement(T, {
    flexDirection: "column",
    marginBottom: 1
  }, ZJ.default.createElement(C, {
    bold: !0
  }, "Install GitHub App"), ZJ.default.createElement(C, {
    dimColor: !0
  }, "Success")), !G && ZJ.default.createElement(C, {
    color: "success"
  }, "✓ GitHub Actions workflow created!"), A && Q && ZJ.default.createElement(T, {
    marginTop: 1
  }, ZJ.default.createElement(C, {
    color: "success"
  }, "✓ Using existing ANTHROPIC_API_KEY secret")), (!A || !Q) && ZJ.default.createElement(T, {
    marginTop: 1
  }, ZJ.default.createElement(C, {
    color: "success"
  }, "✓ API key saved as ", B, " secret")), ZJ.default.createElement(T, {
    marginTop: 1
  }, ZJ.default.createElement(C, null, "Next steps:")), G ? ZJ.default.createElement(ZJ.default.Fragment, null, ZJ.default.createElement(C, null, "1. Install the Claude GitHub App if you haven't already"), ZJ.default.createElement(C, null, "2. Your workflow file was kept unchanged"), ZJ.default.createElement(C, null, "3. API key is configured and ready to use")) : ZJ.default.createElement(ZJ.default.Fragment, null, ZJ.default.createElement(C, null, "1. A pre-filled PR page has been created"), ZJ.default.createElement(C, null, "2. Install the Claude GitHub App if you haven't already"), ZJ.default.createElement(C, null, "3. Merge the PR to enable Claude PR assistance"))), ZJ.default.createElement(T, {
    marginLeft: 3
  }, ZJ.default.createElement(C, {
    dimColor: !0
  }, "Press any key to exit")))
}
// @from(Ln 409184, Col 4)
ZJ
// @from(Ln 409185, Col 4)
a29 = w(() => {
  fA();
  ZJ = c(QA(), 1)
})
// @from(Ln 409190, Col 0)
function o29({
  error: A,
  errorReason: Q,
  errorInstructions: B
}) {
  return FV.default.createElement(FV.default.Fragment, null, FV.default.createElement(T, {
    flexDirection: "column",
    borderStyle: "round",
    borderDimColor: !0,
    paddingX: 1
  }, FV.default.createElement(T, {
    flexDirection: "column",
    marginBottom: 1
  }, FV.default.createElement(C, {
    bold: !0
  }, "Install GitHub App")), FV.default.createElement(C, {
    color: "error"
  }, "Error: ", A), Q && FV.default.createElement(T, {
    marginTop: 1
  }, FV.default.createElement(C, {
    dimColor: !0
  }, "Reason: ", Q)), B && B.length > 0 && FV.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, FV.default.createElement(C, {
    dimColor: !0
  }, "How to fix:"), B.map((G, Z) => FV.default.createElement(T, {
    key: Z,
    marginLeft: 2
  }, FV.default.createElement(C, {
    dimColor: !0
  }, "• "), FV.default.createElement(C, null, G)))), FV.default.createElement(T, {
    marginTop: 1
  }, FV.default.createElement(C, {
    dimColor: !0
  }, "For manual setup instructions, see:", " ", FV.default.createElement(C, {
    color: "claude"
  }, Ah)))), FV.default.createElement(T, {
    marginLeft: 3
  }, FV.default.createElement(C, {
    dimColor: !0
  }, "Press any key to exit")))
}
// @from(Ln 409233, Col 4)
FV
// @from(Ln 409234, Col 4)
r29 = w(() => {
  fA();
  FV = c(QA(), 1)
})
// @from(Ln 409239, Col 0)
function s29({
  repoName: A,
  onSelectAction: Q
}) {
  return Fw.default.createElement(T, {
    flexDirection: "column",
    borderStyle: "round",
    borderDimColor: !0,
    paddingX: 1
  }, Fw.default.createElement(T, {
    flexDirection: "column",
    marginBottom: 1
  }, Fw.default.createElement(C, {
    bold: !0
  }, "Existing Workflow Found"), Fw.default.createElement(C, {
    dimColor: !0
  }, "Repository: ", A)), Fw.default.createElement(T, {
    flexDirection: "column",
    marginBottom: 1
  }, Fw.default.createElement(C, null, "A Claude workflow file already exists at", " ", Fw.default.createElement(C, {
    color: "claude"
  }, ".github/workflows/claude.yml")), Fw.default.createElement(C, {
    dimColor: !0
  }, "What would you like to do?")), Fw.default.createElement(T, {
    flexDirection: "column"
  }, Fw.default.createElement(k0, {
    options: [{
      label: "Update workflow file with latest version",
      value: "update"
    }, {
      label: "Skip workflow update (configure secrets only)",
      value: "skip"
    }, {
      label: "Exit without making changes",
      value: "exit"
    }],
    onChange: (Y) => {
      Q(Y)
    },
    onCancel: () => {
      Q("exit")
    }
  })), Fw.default.createElement(T, {
    marginTop: 1
  }, Fw.default.createElement(C, {
    dimColor: !0
  }, "View the latest workflow template at:", " ", Fw.default.createElement(C, {
    color: "claude"
  }, "https://github.com/anthropics/claude-code-action/blob/main/examples/claude.yml"))))
}
// @from(Ln 409289, Col 4)
Fw
// @from(Ln 409290, Col 4)
t29 = w(() => {
  fA();
  u8();
  Fw = c(QA(), 1)
})
// @from(Ln 409296, Col 0)
function e29({
  warnings: A,
  onContinue: Q
}) {
  return J0((B, G) => {
    if (G.return) Q()
  }), xE.default.createElement(xE.default.Fragment, null, xE.default.createElement(T, {
    flexDirection: "column",
    borderStyle: "round",
    borderDimColor: !0,
    paddingX: 1
  }, xE.default.createElement(T, {
    flexDirection: "column",
    marginBottom: 1
  }, xE.default.createElement(C, {
    bold: !0
  }, tA.warning, " Setup Warnings"), xE.default.createElement(C, {
    dimColor: !0
  }, "We found some potential issues, but you can continue anyway")), A.map((B, G) => xE.default.createElement(T, {
    key: G,
    flexDirection: "column",
    marginBottom: 1
  }, xE.default.createElement(C, {
    color: "warning",
    bold: !0
  }, B.title), xE.default.createElement(C, null, B.message), B.instructions.length > 0 && xE.default.createElement(T, {
    flexDirection: "column",
    marginLeft: 2,
    marginTop: 1
  }, B.instructions.map((Z, Y) => xE.default.createElement(C, {
    key: Y,
    dimColor: !0
  }, "• ", Z))))), xE.default.createElement(T, {
    marginTop: 1
  }, xE.default.createElement(C, {
    bold: !0,
    color: "permission"
  }, "Press Enter to continue anyway, or Ctrl+C to exit and fix issues")), xE.default.createElement(T, {
    marginTop: 1
  }, xE.default.createElement(C, {
    dimColor: !0
  }, "You can also try the manual setup steps if needed:", " ", xE.default.createElement(C, {
    color: "claude"
  }, Ah)))))
}
// @from(Ln 409341, Col 4)
xE
// @from(Ln 409342, Col 4)
A99 = w(() => {
  fA();
  B2();
  xE = c(QA(), 1)
})
// @from(Ln 409348, Col 0)
function Q99({
  onSubmit: A,
  defaultSelections: Q
}) {
  let [B, G] = kE1.useState(new Set(Q)), [Z, Y] = kE1.useState(0), [J, X] = kE1.useState(!1), I = [{
    value: "claude",
    label: "@Claude Code",
    description: "Tag @claude in issues and PR comments"
  }, {
    value: "claude-review",
    label: "Claude Code Review",
    description: "Automated code review on new PRs"
  }];
  return J0((D, W) => {
    if (W.upArrow) Y((K) => K > 0 ? K - 1 : I.length - 1), X(!1);
    else if (W.downArrow) Y((K) => K < I.length - 1 ? K + 1 : 0), X(!1);
    else if (D === " ") {
      let K = I[Z]?.value;
      if (K) G((V) => {
        let F = new Set(V);
        if (F.has(K)) F.delete(K);
        else F.add(K);
        return F
      })
    } else if (W.return)
      if (B.size === 0) X(!0);
      else A(Array.from(B))
  }), uJ.default.createElement(uJ.default.Fragment, null, uJ.default.createElement(T, {
    flexDirection: "column",
    borderStyle: "round",
    borderDimColor: !0,
    paddingX: 1,
    width: "100%"
  }, uJ.default.createElement(T, {
    flexDirection: "column",
    marginBottom: 1
  }, uJ.default.createElement(C, {
    bold: !0
  }, "Select GitHub workflows to install"), uJ.default.createElement(C, {
    dimColor: !0
  }, "We'll create a workflow file in your repository for each one you select."), uJ.default.createElement(T, {
    marginTop: 1
  }, uJ.default.createElement(C, {
    dimColor: !0
  }, "More workflow examples (issue triage, CI fixes, etc.) at:", " ", uJ.default.createElement(i2, {
    url: "https://github.com/anthropics/claude-code-action/blob/main/examples/"
  }, "https://github.com/anthropics/claude-code-action/blob/main/examples/")))), uJ.default.createElement(T, {
    flexDirection: "column",
    paddingX: 1
  }, I.map((D, W) => {
    let K = B.has(D.value),
      V = W === Z;
    return uJ.default.createElement(T, {
      key: D.value,
      flexDirection: "row",
      marginBottom: W < I.length - 1 ? 1 : 0
    }, uJ.default.createElement(T, {
      marginRight: 1,
      minWidth: 2
    }, uJ.default.createElement(C, {
      bold: V
    }, K ? "✓" : " ")), uJ.default.createElement(T, {
      flexDirection: "column"
    }, uJ.default.createElement(C, {
      bold: V
    }, D.label), uJ.default.createElement(C, {
      dimColor: !0
    }, D.description)))
  }))), uJ.default.createElement(T, {
    marginLeft: 2
  }, uJ.default.createElement(C, {
    dimColor: !0
  }, uJ.default.createElement(vQ, null, uJ.default.createElement(F0, {
    shortcut: "↑↓",
    action: "Navigate"
  }), uJ.default.createElement(F0, {
    shortcut: "Space",
    action: "toggle"
  }), uJ.default.createElement(F0, {
    shortcut: "Enter",
    action: "confirm"
  })))), J && uJ.default.createElement(T, {
    marginLeft: 1
  }, uJ.default.createElement(C, {
    color: "error"
  }, "You must select at least one workflow to continue")))
}
// @from(Ln 409435, Col 4)
uJ
// @from(Ln 409435, Col 8)
kE1
// @from(Ln 409436, Col 4)
B99 = w(() => {
  fA();
  fA();
  e9();
  K6();
  uJ = c(QA(), 1), kE1 = c(QA(), 1)
})
// @from(Ln 409443, Col 0)
async function rJ7(A, Q, B, G, Z, Y, J) {
  let X = await TQ("gh", ["api", `repos/${A}/contents/${B}`, "--jq", ".sha"]),
    I = null;
  if (X.code === 0) I = X.stdout.trim();
  let D = G;
  if (Z === "CLAUDE_CODE_OAUTH_TOKEN") D = G.replace(/anthropic_api_key: \$\{\{ secrets\.ANTHROPIC_API_KEY \}\}/g, "claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}");
  else if (Z !== "ANTHROPIC_API_KEY") D = G.replace(/anthropic_api_key: \$\{\{ secrets\.ANTHROPIC_API_KEY \}\}/g, `anthropic_api_key: \${{ secrets.${Z} }}`);
  let W = Buffer.from(D).toString("base64"),
    K = ["api", "--method", "PUT", `repos/${A}/contents/${B}`, "-f", `message=${I?`"Update ${Y}"`:`"${Y}"`}`, "-f", `content=${W}`, "-f", `branch=${Q}`];
  if (I) K.push("-f", `sha=${I}`);
  let V = await TQ("gh", K);
  if (V.code !== 0) {
    if (V.stderr.includes("422") && V.stderr.includes("sha")) throw l("tengu_setup_github_actions_failed", {
      reason: "failed_to_create_workflow_file",
      exit_code: V.code,
      ...J
    }), Error(`Failed to create workflow file ${B}: A Claude workflow file already exists in this repository. Please remove it first or update it manually.`);
    l("tengu_setup_github_actions_failed", {
      reason: "failed_to_create_workflow_file",
      exit_code: V.code,
      ...J
    });
    let F = `

Need help? Common issues:
` + `• Permission denied → Run: gh auth refresh -h github.com -s repo,workflow
` + `• Not authorized → Ensure you have admin access to the repository
` + "• For manual setup → Visit: https://github.com/anthropics/claude-code-action";
    throw Error(`Failed to create workflow file ${B}: ${V.stderr}${F}`)
  }
}
// @from(Ln 409474, Col 0)
async function G99(A, Q, B, G, Z = !1, Y, J, X) {
  try {
    l("tengu_setup_github_actions_started", {
      skip_workflow: Z,
      has_api_key: !!Q,
      using_default_secret_name: B === "ANTHROPIC_API_KEY",
      selected_claude_workflow: Y.includes("claude"),
      selected_claude_review_workflow: Y.includes("claude-review"),
      ...X
    });
    let I = await TQ("gh", ["api", `repos/${A}`, "--jq", ".id"]);
    if (I.code !== 0) throw l("tengu_setup_github_actions_failed", {
      reason: "repo_not_found",
      exit_code: I.code,
      ...X
    }), Error(`Failed to access repository ${A}`);
    let D = await TQ("gh", ["api", `repos/${A}`, "--jq", ".default_branch"]);
    if (D.code !== 0) throw l("tengu_setup_github_actions_failed", {
      reason: "failed_to_get_default_branch",
      exit_code: D.code,
      ...X
    }), Error(`Failed to get default branch: ${D.stderr}`);
    let W = D.stdout.trim(),
      K = await TQ("gh", ["api", `repos/${A}/git/ref/heads/${W}`, "--jq", ".object.sha"]);
    if (K.code !== 0) throw l("tengu_setup_github_actions_failed", {
      reason: "failed_to_get_branch_sha",
      exit_code: K.code,
      ...X
    }), Error(`Failed to get branch SHA: ${K.stderr}`);
    let V = K.stdout.trim(),
      F = null;
    if (!Z) {
      G(), F = `add-claude-github-actions-${Date.now()}`;
      let H = await TQ("gh", ["api", "--method", "POST", `repos/${A}/git/refs`, "-f", `ref=refs/heads/${F}`, "-f", `sha=${V}`]);
      if (H.code !== 0) throw l("tengu_setup_github_actions_failed", {
        reason: "failed_to_create_branch",
        exit_code: H.code,
        ...X
      }), Error(`Failed to create branch: ${H.stderr}`);
      G();
      let E = [];
      if (Y.includes("claude")) E.push({
        path: ".github/workflows/claude.yml",
        content: b29,
        message: "Claude PR Assistant workflow"
      });
      if (Y.includes("claude-review")) E.push({
        path: ".github/workflows/claude-code-review.yml",
        content: h29,
        message: "Claude Code Review workflow"
      });
      for (let z of E) await rJ7(A, F, z.path, z.content, B, z.message, X)
    }
    if (G(), Q) {
      let H = await TQ("gh", ["secret", "set", B, "--body", Q, "--repo", A]);
      if (H.code !== 0) {
        l("tengu_setup_github_actions_failed", {
          reason: "failed_to_set_api_key_secret",
          exit_code: H.code,
          ...X
        });
        let E = `

Need help? Common issues:
` + `• Permission denied → Run: gh auth refresh -h github.com -s repo
` + `• Not authorized → Ensure you have admin access to the repository
` + "• For manual setup → Visit: https://github.com/anthropics/claude-code-action";
        throw Error(`Failed to set API key secret: ${H.stderr||"Unknown error"}${E}`)
      }
    }
    if (!Z && F) {
      G();
      let H = `https://github.com/${A}/compare/${W}...${F}?quick_pull=1&title=${encodeURIComponent(k29)}&body=${encodeURIComponent(f29)}`;
      await i7(H)
    }
    l("tengu_setup_github_actions_completed", {
      skip_workflow: Z,
      has_api_key: !!Q,
      auth_type: J,
      using_default_secret_name: B === "ANTHROPIC_API_KEY",
      selected_claude_workflow: Y.includes("claude"),
      selected_claude_review_workflow: Y.includes("claude-review"),
      ...X
    }), S0((H) => ({
      ...H,
      githubActionSetupCount: (H.githubActionSetupCount ?? 0) + 1
    }))
  } catch (I) {
    if (!I || !(I instanceof Error) || !I.message.includes("Failed to")) l("tengu_setup_github_actions_failed", {
      reason: "unexpected_error",
      ...X
    });
    if (I instanceof Error) e(I);
    throw I
  }
}
// @from(Ln 409570, Col 4)
Z99 = w(() => {
  t4();
  TN();
  Z0();
  v1();
  GQ()
})
// @from(Ln 409578, Col 0)
function J99({
  onSuccess: A,
  onCancel: Q
}) {
  let [B, G] = Hw.useState({
    state: "starting"
  }), [Z] = Hw.useState(() => new YkA), [Y, J] = Hw.useState(""), [X, I] = Hw.useState(0), [D, W] = Hw.useState(!1), K = Hw.useRef(new Set), V = ZB(), F = Math.max(50, V.columns - Y99.length - 4);
  J0(($, O) => {
    if (B.state === "error")
      if (O.return && B.toRetry) J(""), I(0), G({
        state: "about_to_retry",
        nextState: B.toRetry
      });
      else Q()
  });
  async function H($, O) {
    try {
      let [L, M] = $.split("#");
      if (!L || !M) {
        G({
          state: "error",
          message: "Invalid code. Please make sure the full code was copied",
          toRetry: {
            state: "waiting_for_login",
            url: O
          }
        });
        return
      }
      l("tengu_oauth_manual_entry", {}), Z.handleManualAuthCodeInput({
        authorizationCode: L,
        state: M
      })
    } catch (L) {
      e(L instanceof Error ? L : Error(String(L))), G({
        state: "error",
        message: L.message,
        toRetry: {
          state: "waiting_for_login",
          url: O
        }
      })
    }
  }
  let E = Hw.useCallback(async () => {
    K.current.forEach(($) => clearTimeout($)), K.current.clear();
    try {
      let $ = await Z.startOAuthFlow(async (M) => {
        G({
          state: "waiting_for_login",
          url: M
        });
        let _ = setTimeout(() => W(!0), 3000);
        K.current.add(_)
      }, {
        loginWithClaudeAi: !0,
        inferenceOnly: !0,
        expiresIn: 31536000
      });
      if (!Tz()) await sI();
      G({
        state: "processing"
      });
      let O = XXA($);
      if (O.warning) l("tengu_oauth_storage_warning", {
        warning: O.warning
      });
      let L = setTimeout(() => {
        G({
          state: "success",
          token: $.accessToken
        });
        let M = setTimeout(() => {
          A($.accessToken)
        }, 1000);
        K.current.add(M)
      }, 100);
      K.current.add(L)
    } catch ($) {
      let O = $.message;
      if (!Tz()) await sI();
      G({
        state: "error",
        message: O,
        toRetry: {
          state: "starting"
        }
      }), e($ instanceof Error ? $ : Error(String($))), l("tengu_oauth_error", {
        error: O
      })
    }
  }, [Z, A]);
  Hw.useEffect(() => {
    if (B.state === "starting") E()
  }, [B.state, E]), Hw.useEffect(() => {
    if (B.state === "about_to_retry") {
      if (!Tz()) sI();
      let $ = setTimeout(() => {
        if (B.nextState.state === "waiting_for_login") W(!0);
        else W(!1);
        G(B.nextState)
      }, 500);
      K.current.add($)
    }
  }, [B]), Hw.useEffect(() => {
    let $ = K.current;
    return () => {
      Z.cleanup(), $.forEach((O) => clearTimeout(O)), $.clear()
    }
  }, [Z]);

  function z() {
    switch (B.state) {
      case "starting":
        return $5.default.createElement(T, null, $5.default.createElement(W9, null), $5.default.createElement(C, null, "Starting authentication…"));
      case "waiting_for_login":
        return $5.default.createElement(T, {
          flexDirection: "column",
          gap: 1
        }, !D && $5.default.createElement(T, null, $5.default.createElement(W9, null), $5.default.createElement(C, null, "Opening browser to sign in with your Claude account…")), D && $5.default.createElement(T, null, $5.default.createElement(C, null, Y99), $5.default.createElement(p4, {
          value: Y,
          onChange: J,
          onSubmit: ($) => H($, B.url),
          cursorOffset: X,
          onChangeCursorOffset: I,
          columns: F
        })));
      case "processing":
        return $5.default.createElement(T, null, $5.default.createElement(W9, null), $5.default.createElement(C, null, "Processing authentication…"));
      case "success":
        return $5.default.createElement(T, {
          flexDirection: "column",
          gap: 1
        }, $5.default.createElement(C, {
          color: "success"
        }, "✓ Authentication token created successfully!"), $5.default.createElement(C, {
          dimColor: !0
        }, "Using token for GitHub Actions setup…"));
      case "error":
        return $5.default.createElement(T, {
          flexDirection: "column",
          gap: 1
        }, $5.default.createElement(C, {
          color: "error"
        }, "OAuth error: ", B.message), B.toRetry ? $5.default.createElement(C, {
          dimColor: !0
        }, "Press Enter to try again, or any other key to cancel") : $5.default.createElement(C, {
          dimColor: !0
        }, "Press any key to return to API key selection"));
      case "about_to_retry":
        return $5.default.createElement(T, {
          flexDirection: "column",
          gap: 1
        }, $5.default.createElement(C, {
          color: "permission"
        }, "Retrying…"));
      default:
        return null
    }
  }
  return $5.default.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, B.state === "starting" && $5.default.createElement(T, {
    flexDirection: "column",
    gap: 1,
    paddingBottom: 1
  }, $5.default.createElement(C, {
    bold: !0
  }, "Create Authentication Token"), $5.default.createElement(C, {
    dimColor: !0
  }, "Creating a long-lived token for GitHub Actions")), B.state !== "success" && B.state !== "starting" && B.state !== "processing" && $5.default.createElement(T, {
    key: "header",
    flexDirection: "column",
    gap: 1,
    paddingBottom: 1
  }, $5.default.createElement(C, {
    bold: !0
  }, "Create Authentication Token"), $5.default.createElement(C, {
    dimColor: !0
  }, "Creating a long-lived token for GitHub Actions")), B.state === "waiting_for_login" && D && $5.default.createElement(T, {
    flexDirection: "column",
    key: "urlToCopy",
    gap: 1,
    paddingBottom: 1
  }, $5.default.createElement(T, {
    paddingX: 1
  }, $5.default.createElement(C, {
    dimColor: !0
  }, "Browser didn't open? Use the url below to sign in:")), $5.default.createElement(b4A, null, $5.default.createElement(i2, {
    url: B.url
  }, $5.default.createElement(C, {
    dimColor: !0
  }, B.url)))), $5.default.createElement(T, {
    paddingLeft: 1,
    flexDirection: "column",
    gap: 1
  }, z()))
}
// @from(Ln 409777, Col 4)
$5
// @from(Ln 409777, Col 8)
Hw
// @from(Ln 409777, Col 12)
Y99 = "Paste code here if prompted > "
// @from(Ln 409778, Col 4)
X99 = w(() => {
  fA();
  sY1();
  IY();
  tH0();
  Q2();
  Z0();
  yG();
  v1();
  P4();
  Xd();
  sBA();
  $5 = c(QA(), 1), Hw = c(QA(), 1)
})
// @from(Ln 409793, Col 0)
function tJ7(A) {
  let [Q] = mJ.useState(() => YL()), [B, G] = mJ.useState({
    ...sJ7,
    useExistingKey: !!Q,
    selectedApiKeyOption: Q ? "existing" : iq() ? "oauth" : "new"
  });
  MQ(), mJ.default.useEffect(() => {
    l("tengu_install_github_app_started", {})
  }, []);
  let Z = mJ.useCallback(async () => {
    let j = [];
    if ((await e5("gh --version", {
        shell: !0,
        reject: !1
      })).exitCode !== 0) j.push({
      title: "GitHub CLI not found",
      message: "GitHub CLI (gh) does not appear to be installed or accessible.",
      instructions: ["Install GitHub CLI from https://cli.github.com/", "macOS: brew install gh", "Windows: winget install --id GitHub.cli", "Linux: See installation instructions at https://github.com/cli/cli#installation"]
    });
    let b = await e5("gh auth status -a", {
      shell: !0,
      reject: !1
    });
    if (b.exitCode !== 0) j.push({
      title: "GitHub CLI not authenticated",
      message: "GitHub CLI does not appear to be authenticated.",
      instructions: ["Run: gh auth login", "Follow the prompts to authenticate with GitHub", "Or set up authentication using environment variables or other methods"]
    });
    else {
      let f = b.stdout.match(/Token scopes:.*$/m);
      if (f) {
        let AA = f[0],
          n = [];
        if (!AA.includes("repo")) n.push("repo");
        if (!AA.includes("workflow")) n.push("workflow");
        if (n.length > 0) {
          G((y) => ({
            ...y,
            step: "error",
            error: `GitHub CLI is missing required permissions: ${n.join(", ")}.`,
            errorReason: "Missing required scopes",
            errorInstructions: [`Your GitHub CLI authentication is missing the "${n.join('" and "')}" scope${n.length>1?"s":""} needed to manage GitHub Actions and secrets.`, "", "To fix this, run:", "  gh auth refresh -h github.com -s repo,workflow", "", "This will add the necessary permissions to manage workflows and secrets."]
          }));
          return
        }
      }
    }
    let S = "";
    if ((await e5("git rev-parse --is-inside-work-tree", {
        shell: !0,
        reject: !1
      })).exitCode === 0) {
      let f = await e5("git remote get-url origin", {
        shell: !0,
        reject: !1
      });
      if (f.exitCode === 0) {
        let AA = f.stdout.trim().match(/github\.com[:/]([^/]+\/[^/]+)(\.git)?$/);
        if (AA) S = AA[1]?.replace(/\.git$/, "") || ""
      }
    }
    l("tengu_install_github_app_step_completed", {
      step: "check-gh"
    }), G((f) => ({
      ...f,
      warnings: j,
      currentRepo: S,
      selectedRepoName: S,
      useCurrentRepo: !!S,
      step: j.length > 0 ? "warnings" : "choose-repo"
    }))
  }, []);
  mJ.default.useEffect(() => {
    if (B.step === "check-gh") Z()
  }, [B.step, Z]);
  let Y = mJ.useCallback(async (j, x) => {
    G((b) => ({
      ...b,
      step: "creating",
      currentWorkflowInstallStep: 0
    }));
    try {
      await G99(B.selectedRepoName, j, x, () => {
        G((b) => ({
          ...b,
          currentWorkflowInstallStep: b.currentWorkflowInstallStep + 1
        }))
      }, B.workflowAction === "skip", B.selectedWorkflows, B.authType, {
        useCurrentRepo: B.useCurrentRepo,
        workflowExists: B.workflowExists,
        secretExists: B.secretExists
      }), l("tengu_install_github_app_step_completed", {
        step: "creating"
      }), G((b) => ({
        ...b,
        step: "success"
      }))
    } catch (b) {
      let S = b instanceof Error ? b.message : "Failed to set up GitHub Actions";
      if (S.includes("workflow file already exists")) l("tengu_install_github_app_error", {
        reason: "workflow_file_exists"
      }), G((u) => ({
        ...u,
        step: "error",
        error: "A Claude workflow file already exists in this repository.",
        errorReason: "Workflow file conflict",
        errorInstructions: ["The file .github/workflows/claude.yml already exists", "You can either:", "  1. Delete the existing file and run this command again", "  2. Update the existing file manually using the template from:", `     ${Ah}`]
      }));
      else l("tengu_install_github_app_error", {
        reason: "setup_github_actions_failed"
      }), G((u) => ({
        ...u,
        step: "error",
        error: S,
        errorReason: "GitHub Actions setup failed",
        errorInstructions: []
      }))
    }
  }, [B.selectedRepoName, B.workflowAction, B.selectedWorkflows, B.useCurrentRepo, B.workflowExists, B.secretExists, B.authType]);
  async function J() {
    await i7("https://github.com/apps/claude")
  }
  async function X(j) {
    try {
      let x = await TQ("gh", ["api", `repos/${j}`, "--jq", ".permissions.admin"]);
      if (x.code === 0) return {
        hasAccess: x.stdout.trim() === "true"
      };
      if (x.stderr.includes("404") || x.stderr.includes("Not Found")) return {
        hasAccess: !1,
        error: "repository_not_found"
      };
      return {
        hasAccess: !1
      }
    } catch {
      return {
        hasAccess: !1
      }
    }
  }
  async function I(j) {
    return (await TQ("gh", ["api", `repos/${j}/contents/.github/workflows/claude.yml`, "--jq", ".sha"])).code === 0
  }
  async function D() {
    let j = await TQ("gh", ["secret", "list", "--app", "actions", "--repo", B.selectedRepoName]);
    if (j.code === 0)
      if (j.stdout.split(`
`).some((S) => {
          return /^ANTHROPIC_API_KEY\s+/.test(S)
        })) G((S) => ({
        ...S,
        secretExists: !0,
        step: "check-existing-secret"
      }));
      else if (Q) G((S) => ({
      ...S,
      apiKeyOrOAuthToken: Q,
      useExistingKey: !0
    })), await Y(Q, B.secretName);
    else G((S) => ({
      ...S,
      step: "api-key"
    }));
    else if (Q) G((x) => ({
      ...x,
      apiKeyOrOAuthToken: Q,
      useExistingKey: !0
    })), await Y(Q, B.secretName);
    else G((x) => ({
      ...x,
      step: "api-key"
    }))
  }
  let W = async () => {
    if (B.step === "warnings") l("tengu_install_github_app_step_completed", {
      step: "warnings"
    }), G((j) => ({
      ...j,
      step: "install-app"
    })), setTimeout(() => {
      J()
    }, 0);
    else if (B.step === "choose-repo") {
      let j = B.useCurrentRepo ? B.currentRepo : B.selectedRepoName;
      if (!j.trim()) return;
      let x = [];
      if (j.includes("github.com")) {
        let u = j.match(/github\.com[:/]([^/]+\/[^/]+)(\.git)?$/);
        if (!u) x.push({
          title: "Invalid GitHub URL format",
          message: "The repository URL format appears to be invalid.",
          instructions: ["Use format: owner/repo or https://github.com/owner/repo", "Example: anthropics/claude-cli"]
        });
        else j = u[1]?.replace(/\.git$/, "") || ""
      }
      if (!j.includes("/")) x.push({
        title: "Repository format warning",
        message: 'Repository should be in format "owner/repo"',
        instructions: ["Use format: owner/repo", "Example: anthropics/claude-cli"]
      });
      let b = await X(j);
      if (b.error === "repository_not_found") x.push({
        title: "Repository not found",
        message: `Repository ${j} was not found or you don't have access.`,
        instructions: [`Check that the repository name is correct: ${j}`, "Ensure you have access to this repository", 'For private repositories, make sure your GitHub token has the "repo" scope', "You can add the repo scope with: gh auth refresh -h github.com -s repo,workflow"]
      });
      else if (!b.hasAccess) x.push({
        title: "Admin permissions required",
        message: `You might need admin permissions on ${j} to set up GitHub Actions.`,
        instructions: ["Repository admins can install GitHub Apps and set secrets", "Ask a repository admin to run this command if setup fails", "Alternatively, you can use the manual setup instructions"]
      });
      let S = await I(j);
      if (x.length > 0) {
        let u = [...B.warnings, ...x];
        G((f) => ({
          ...f,
          selectedRepoName: j,
          workflowExists: S,
          warnings: u,
          step: "warnings"
        }))
      } else l("tengu_install_github_app_step_completed", {
        step: "choose-repo"
      }), G((u) => ({
        ...u,
        selectedRepoName: j,
        workflowExists: S,
        step: "install-app"
      })), setTimeout(() => {
        J()
      }, 0)
    } else if (B.step === "install-app")
      if (l("tengu_install_github_app_step_completed", {
          step: "install-app"
        }), B.workflowExists) G((j) => ({
        ...j,
        step: "check-existing-workflow"
      }));
      else G((j) => ({
        ...j,
        step: "select-workflows"
      }));
    else if (B.step === "check-existing-workflow") return;
    else if (B.step === "select-workflows") return;
    else if (B.step === "check-existing-secret")
      if (l("tengu_install_github_app_step_completed", {
          step: "check-existing-secret"
        }), B.useExistingSecret) await Y(null, B.secretName);
      else await Y(B.apiKeyOrOAuthToken, B.secretName);
    else if (B.step === "api-key") {
      if (B.selectedApiKeyOption === "oauth") return;
      let j = B.selectedApiKeyOption === "existing" ? Q : B.apiKeyOrOAuthToken;
      if (!j) {
        l("tengu_install_github_app_error", {
          reason: "api_key_missing"
        }), G((b) => ({
          ...b,
          step: "error",
          error: "API key is required"
        }));
        return
      }
      G((b) => ({
        ...b,
        apiKeyOrOAuthToken: j,
        useExistingKey: B.selectedApiKeyOption === "existing"
      }));
      let x = await TQ("gh", ["secret", "list", "--app", "actions", "--repo", B.selectedRepoName]);
      if (x.code === 0)
        if (x.stdout.split(`
`).some((u) => {
            return /^ANTHROPIC_API_KEY\s+/.test(u)
          })) l("tengu_install_github_app_step_completed", {
          step: "api-key"
        }), G((u) => ({
          ...u,
          secretExists: !0,
          step: "check-existing-secret"
        }));
        else l("tengu_install_github_app_step_completed", {
          step: "api-key"
        }), await Y(j, B.secretName);
      else l("tengu_install_github_app_step_completed", {
        step: "api-key"
      }), await Y(j, B.secretName)
    }
  }, K = (j) => {
    G((x) => ({
      ...x,
      selectedRepoName: j
    }))
  }, V = (j) => {
    G((x) => ({
      ...x,
      apiKeyOrOAuthToken: j
    }))
  }, F = (j) => {
    G((x) => ({
      ...x,
      selectedApiKeyOption: j
    }))
  }, H = mJ.useCallback(() => {
    l("tengu_install_github_app_step_completed", {
      step: "api-key"
    }), G((j) => ({
      ...j,
      step: "oauth-flow"
    }))
  }, []), E = mJ.useCallback((j) => {
    l("tengu_install_github_app_step_completed", {
      step: "oauth-flow"
    }), G((x) => ({
      ...x,
      apiKeyOrOAuthToken: j,
      useExistingKey: !1,
      secretName: "CLAUDE_CODE_OAUTH_TOKEN",
      authType: "oauth_token"
    })), Y(j, "CLAUDE_CODE_OAUTH_TOKEN")
  }, [Y]), z = mJ.useCallback(() => {
    G((j) => ({
      ...j,
      step: "api-key"
    }))
  }, []), $ = (j) => {
    if (j && !/^[a-zA-Z0-9_]+$/.test(j)) return;
    G((x) => ({
      ...x,
      secretName: j
    }))
  }, O = (j) => {
    G((x) => ({
      ...x,
      useCurrentRepo: j,
      selectedRepoName: j ? x.currentRepo : ""
    }))
  }, L = (j) => {
    G((x) => ({
      ...x,
      useExistingKey: j
    }))
  }, M = (j) => {
    G((x) => ({
      ...x,
      useExistingSecret: j,
      secretName: j ? "ANTHROPIC_API_KEY" : ""
    }))
  }, _ = async (j) => {
    if (j === "exit") {
      A.onDone("Installation cancelled by user");
      return
    }
    if (l("tengu_install_github_app_step_completed", {
        step: "check-existing-workflow"
      }), G((x) => ({
        ...x,
        workflowAction: j
      })), j === "skip" || j === "update")
      if (Q) await D();
      else G((x) => ({
        ...x,
        step: "api-key"
      }))
  };
  switch (J0(() => {
      if (B.step === "success" || B.step === "error") {
        if (B.step === "success") l("tengu_install_github_app_completed", {});
        A.onDone(B.step === "success" ? "GitHub Actions setup complete!" : B.error ? `Couldn't install GitHub App: ${B.error}
For manual setup instructions, see: ${Ah}` : `GitHub App installation failed
For manual setup instructions, see: ${Ah}`)
      }
    }), B.step) {
    case "check-gh":
      return mJ.default.createElement(S29, null);
    case "warnings":
      return mJ.default.createElement(e29, {
        warnings: B.warnings,
        onContinue: W
      });
    case "choose-repo":
      return mJ.default.createElement(y29, {
        currentRepo: B.currentRepo,
        useCurrentRepo: B.useCurrentRepo,
        repoUrl: B.selectedRepoName,
        onRepoUrlChange: K,
        onToggleUseCurrentRepo: O,
        onSubmit: W
      });
    case "install-app":
      return mJ.default.createElement(g29, {
        repoUrl: B.selectedRepoName,
        onSubmit: W
      });
    case "check-existing-workflow":
      return mJ.default.createElement(s29, {
        repoName: B.selectedRepoName,
        onSelectAction: _
      });
    case "check-existing-secret":
      return mJ.default.createElement(m29, {
        useExistingSecret: B.useExistingSecret,
        secretName: B.secretName,
        onToggleUseExistingSecret: M,
        onSecretNameChange: $,
        onSubmit: W
      });
    case "api-key":
      return mJ.default.createElement(c29, {
        existingApiKey: Q,
        useExistingKey: B.useExistingKey,
        apiKeyOrOAuthToken: B.apiKeyOrOAuthToken,
        onApiKeyChange: V,
        onToggleUseExistingKey: L,
        onSubmit: W,
        onCreateOAuthToken: iq() ? H : void 0,
        selectedOption: B.selectedApiKeyOption,
        onSelectOption: F
      });
    case "creating":
      return mJ.default.createElement(l29, {
        currentWorkflowInstallStep: B.currentWorkflowInstallStep,
        secretExists: B.secretExists,
        useExistingSecret: B.useExistingSecret,
        secretName: B.secretName,
        skipWorkflow: B.workflowAction === "skip",
        selectedWorkflows: B.selectedWorkflows
      });
    case "success":
      return mJ.default.createElement(n29, {
        secretExists: B.secretExists,
        useExistingSecret: B.useExistingSecret,
        secretName: B.secretName,
        skipWorkflow: B.workflowAction === "skip"
      });
    case "error":
      return mJ.default.createElement(o29, {
        error: B.error,
        errorReason: B.errorReason,
        errorInstructions: B.errorInstructions
      });
    case "select-workflows":
      return mJ.default.createElement(Q99, {
        defaultSelections: B.selectedWorkflows,
        onSubmit: (j) => {
          if (l("tengu_install_github_app_step_completed", {
              step: "select-workflows"
            }), G((x) => ({
              ...x,
              selectedWorkflows: j
            })), Q) D();
          else G((x) => ({
            ...x,
            step: "api-key"
          }))
        }
      });
    case "oauth-flow":
      return mJ.default.createElement(J99, {
        onSuccess: E,
        onCancel: z
      })
  }
}
// @from(Ln 410256, Col 4)
mJ
// @from(Ln 410256, Col 8)
sJ7
// @from(Ln 410256, Col 13)
eJ7
// @from(Ln 410256, Col 18)
I99
// @from(Ln 410257, Col 4)
D99 = w(() => {
  fA();
  Q2();
  E9();
  t4();
  Vq();
  TN();
  x29();
  v29();
  u29();
  d29();
  p29();
  i29();
  a29();
  r29();
  t29();
  A99();
  B99();
  Z99();
  X99();
  Z0();
  JZ();
  mJ = c(QA(), 1), sJ7 = {
    step: "check-gh",
    selectedRepoName: "",
    currentRepo: "",
    useCurrentRepo: !1,
    apiKeyOrOAuthToken: "",
    useExistingKey: !0,
    currentWorkflowInstallStep: 0,
    warnings: [],
    secretExists: !1,
    secretName: "ANTHROPIC_API_KEY",
    useExistingSecret: !0,
    workflowExists: !1,
    selectedWorkflows: ["claude", "claude-review"],
    selectedApiKeyOption: "new",
    authType: "api_key"
  };
  eJ7 = {
    type: "local-jsx",
    name: "install-github-app",
    description: "Set up Claude GitHub Actions for a repository",
    isEnabled: () => !process.env.DISABLE_INSTALL_GITHUB_APP_COMMAND && !Yk(),
    isHidden: !1,
    async call(A) {
      return T9("github-app"), mJ.default.createElement(tJ7, {
        onDone: A
      })
    },
    userFacingName() {
      return "install-github-app"
    }
  }, I99 = eJ7
})
// @from(Ln 410312, Col 4)
W99 = "https://slack.com/marketplace/A08SF47R6P4-claude"
// @from(Ln 410313, Col 2)
AX7
// @from(Ln 410313, Col 7)
K99
// @from(Ln 410314, Col 4)
V99 = w(() => {
  TN();
  GQ();
  Z0();
  JZ();
  AX7 = {
    type: "local",
    name: "install-slack-app",
    description: "Install the Claude Slack app",
    isEnabled: () => !0,
    isHidden: !1,
    supportsNonInteractive: !1,
    async call() {
      if (T9("slack-app"), l("tengu_install_slack_app_clicked", {}), S0((Q) => ({
          ...Q,
          slackAppInstallCount: (Q.slackAppInstallCount ?? 0) + 1
        })), await i7(W99)) return {
        type: "text",
        value: "Opening Slack app installation page in browser…"
      };
      else return {
        type: "text",
        value: `Couldn't open browser. Visit: ${W99}`
      }
    },
    userFacingName() {
      return "install-slack-app"
    }
  }, K99 = AX7
})
// @from(Ln 410345, Col 0)
function H99(A) {
  switch (A) {
    case "project":
      return {
        label: "Project MCPs", path: N$(A)
      };
    case "user":
      return {
        label: "User MCPs", path: N$(A)
      };
    case "local":
      return {
        label: "Local MCPs", path: N$(A)
      };
    case "enterprise":
      return {
        label: "Enterprise MCPs"
      };
    case "dynamic":
      return {
        label: "Built-in MCPs", path: "always available"
      };
    default:
      return {
        label: A
      }
  }
}
// @from(Ln 410374, Col 0)
function QX7(A) {
  let Q = new Map;
  for (let B of A) {
    let G = B.scope;
    if (!Q.has(G)) Q.set(G, []);
    Q.get(G).push(B)
  }
  for (let [, B] of Q) B.sort((G, Z) => G.name.localeCompare(Z.name));
  return Q
}
// @from(Ln 410385, Col 0)
function eR0({
  servers: A,
  agentServers: Q = [],
  onSelectServer: B,
  onSelectAgentServer: G,
  onComplete: Z
}) {
  let [Y] = oB(), [J, X] = x4.useState(0), I = x4.default.useMemo(() => {
    let j = A.filter((x) => x.client.config.type !== "claudeai-proxy");
    return QX7(j)
  }, [A]), D = x4.default.useMemo(() => [], [A]), W = x4.default.useMemo(() => (I.get("dynamic") ?? []).sort((j, x) => j.name.localeCompare(x.name)), [I]), K = H99("dynamic"), V = x4.default.useMemo(() => {
    let j = [];
    for (let x of F99) {
      let b = I.get(x) ?? [];
      for (let S of b) j.push({
        type: "server",
        server: S
      })
    }
    for (let x of D) j.push({
      type: "server",
      server: x
    });
    for (let x of Q) j.push({
      type: "agent-server",
      agentServer: x
    });
    for (let x of W) j.push({
      type: "server",
      server: x
    });
    return j
  }, [I, D, Q, W]), F = x4.useCallback(() => {
    Z("MCP dialog dismissed", {
      display: "system"
    })
  }, [Z]), H = x4.useCallback(() => {
    let j = V[J];
    if (!j) return;
    if (j.type === "server") B(j.server);
    else if (j.type === "agent-server" && G) G(j.agentServer)
  }, [V, J, B, G]);
  iW({
    "confirm:previous": () => X((j) => j === 0 ? V.length - 1 : j - 1),
    "confirm:next": () => X((j) => j === V.length - 1 ? 0 : j + 1),
    "confirm:yes": H,
    "confirm:no": F
  }, {
    context: "Confirmation"
  });
  let E = (j) => {
      return V.findIndex((x) => x.type === "server" && x.server === j)
    },
    z = (j) => {
      return V.findIndex((x) => x.type === "agent-server" && x.agentServer === j)
    },
    $ = J7A(),
    O = A.some((j) => j.client.type === "failed");
  if (A.length === 0 && Q.length === 0) return null;
  let L = (j) => {
      let x = E(j),
        b = J === x,
        S = "",
        u = "";
      if (j.client.type === "disabled") S = sQ("inactive", Y)(tA.radioOff), u = "disabled";
      else if (j.client.type === "connected") S = sQ("success", Y)(tA.tick), u = "connected";
      else if (j.client.type === "pending") {
        S = sQ("inactive", Y)(tA.radioOff);
        let {
          reconnectAttempt: f,
          maxReconnectAttempts: AA
        } = j.client;
        if (f && AA) u = `reconnecting (${f}/${AA})…`;
        else u = "connecting…"
      } else if (j.client.type === "needs-auth") S = sQ("warning", Y)(tA.triangleUpOutline), u = "needs authentication";
      else S = sQ("error", Y)(tA.cross), u = "failed";
      return x4.default.createElement(T, {
        key: `${j.name}-${x}`
      }, x4.default.createElement(C, {
        color: b ? "suggestion" : void 0
      }, b ? `${tA.pointer} ` : "  "), x4.default.createElement(C, {
        color: b ? "suggestion" : void 0
      }, j.name), x4.default.createElement(C, {
        dimColor: !b
      }, " · ", S, " "), x4.default.createElement(C, {
        dimColor: !b
      }, u))
    },
    M = (j) => {
      let x = z(j),
        b = J === x,
        S = j.needsAuth ? sQ("warning", Y)(tA.triangleUpOutline) : sQ("inactive", Y)(tA.radioOff),
        u = j.needsAuth ? "may need auth" : "agent-only";
      return x4.default.createElement(T, {
        key: `agent-${j.name}-${x}`
      }, x4.default.createElement(C, {
        color: b ? "suggestion" : void 0
      }, b ? `${tA.pointer} ` : "  "), x4.default.createElement(C, {
        color: b ? "suggestion" : void 0
      }, j.name), x4.default.createElement(C, {
        dimColor: !b
      }, " · ", S, " "), x4.default.createElement(C, {
        dimColor: !b
      }, u))
    },
    _ = A.length + Q.length;
  return x4.default.createElement(T, {
    flexDirection: "column"
  }, x4.default.createElement(SE1, null), x4.default.createElement(o9, {
    title: "Manage MCP servers",
    subtitle: `${_} server${_===1?"":"s"}`,
    onCancel: F,
    hideInputGuide: !0
  }, x4.default.createElement(T, {
    flexDirection: "column"
  }, F99.map((j) => {
    let x = I.get(j);
    if (!x || x.length === 0) return null;
    let b = H99(j);
    return x4.default.createElement(T, {
      key: j,
      flexDirection: "column",
      marginBottom: 1
    }, x4.default.createElement(T, {
      paddingLeft: 2
    }, x4.default.createElement(C, {
      bold: !0
    }, b.label), b.path && x4.default.createElement(C, {
      dimColor: !0
    }, " (", b.path, ")")), x.map((S) => L(S)))
  }), D.length > 0 && x4.default.createElement(T, {
    flexDirection: "column",
    marginBottom: 1
  }, x4.default.createElement(T, {
    paddingLeft: 2
  }, x4.default.createElement(C, {
    bold: !0
  }, "claude.ai")), D.map((j) => L(j))), Q.length > 0 && x4.default.createElement(T, {
    flexDirection: "column",
    marginBottom: 1
  }, x4.default.createElement(T, {
    paddingLeft: 2
  }, x4.default.createElement(C, {
    bold: !0
  }, "Agent MCPs")), [...new Set(Q.flatMap((j) => j.sourceAgents))].map((j) => x4.default.createElement(T, {
    key: j,
    flexDirection: "column",
    marginTop: 1
  }, x4.default.createElement(T, {
    paddingLeft: 2
  }, x4.default.createElement(C, {
    dimColor: !0
  }, "@", j)), Q.filter((x) => x.sourceAgents.includes(j)).map((x) => M(x))))), W.length > 0 && x4.default.createElement(T, {
    flexDirection: "column",
    marginBottom: 1
  }, x4.default.createElement(T, {
    paddingLeft: 2
  }, x4.default.createElement(C, {
    bold: !0
  }, K.label), K.path && x4.default.createElement(C, {
    dimColor: !0
  }, " (", K.path, ")")), W.map((j) => L(j))), x4.default.createElement(T, {
    flexDirection: "column"
  }, O && x4.default.createElement(C, {
    dimColor: !0
  }, $ ? "※ Error logs shown inline with --debug" : "※ Run claude --debug to see error logs"), x4.default.createElement(C, {
    dimColor: !0
  }, x4.default.createElement(i2, {
    url: "https://code.claude.com/docs/en/mcp"
  }, "https://code.claude.com/docs/en/mcp"), " ", "for help")))), x4.default.createElement(T, {
    paddingX: 1
  }, x4.default.createElement(C, {
    dimColor: !0,
    italic: !0
  }, x4.default.createElement(vQ, null, x4.default.createElement(F0, {
    shortcut: "↑↓",
    action: "navigate"
  }), x4.default.createElement(F0, {
    shortcut: "Enter",
    action: "confirm"
  }), x4.default.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "cancel"
  })))))
}
// @from(Ln 410572, Col 4)
x4
// @from(Ln 410572, Col 8)
F99
// @from(Ln 410573, Col 4)
A_0 = w(() => {
  fA();
  c6();
  T1();
  B2();
  fR0();
  rY();
  e9();
  I3();
  K6();
  PJ();
  x4 = c(QA(), 1), F99 = ["project", "local", "user", "enterprise"]
})
// @from(Ln 410587, Col 0)
function bE1({
  serverToolsCount: A,
  serverPromptsCount: Q,
  serverResourcesCount: B
}) {
  let G = [];
  if (A > 0) G.push("tools");
  if (B > 0) G.push("resources");
  if (Q > 0) G.push("prompts");
  return $gA.default.createElement(T, null, $gA.default.createElement(C, {
    bold: !0
  }, "Capabilities: "), $gA.default.createElement(C, {
    color: "text"
  }, G.length > 0 ? $gA.default.createElement(vQ, null, G) : "none"))
}
// @from(Ln 410602, Col 4)
$gA
// @from(Ln 410603, Col 4)
Q_0 = w(() => {
  fA();
  K6();
  $gA = c(QA(), 1)
})
// @from(Ln 410608, Col 4)
E99 = w(() => {
  eK();
  v1();
  A0()
})
// @from(Ln 410614, Col 0)
function z99(A) {
  let Q = "plugin" in A ? A.plugin : "no-plugin";
  return `${A.type}:${A.source}:${Q}`
}
// @from(Ln 410619, Col 0)
function $99(A, Q) {
  if (Q.length === 0) return;
  A((B) => {
    let G = new Set(B.plugins.errors.map((Y) => z99(Y))),
      Z = Q.filter((Y) => !G.has(z99(Y)));
    if (Z.length === 0) return B;
    return {
      ...B,
      plugins: {
        ...B.plugins,
        errors: [...B.plugins.errors, ...Z]
      }
    }
  })
}
// @from(Ln 410635, Col 0)
function C99(A, Q = !1, B) {
  let [G, Z] = a0(), Y = OU.useRef(new Map), J = OU.useCallback((K, V, F, H) => {
    Z((E) => {
      let z = q99(K.name),
        O = E.mcp.clients.findIndex((j) => j.name === K.name) === -1 ? [...E.mcp.clients, K] : E.mcp.clients.map((j) => j.name === K.name ? K : j),
        L = V === void 0 ? E.mcp.tools : [...mO1(E.mcp.tools, (j) => j.name?.startsWith(z)), ...V],
        M = F === void 0 ? E.mcp.commands : [...mO1(E.mcp.commands, (j) => j.name?.startsWith(z)), ...F],
        _ = H === void 0 ? E.mcp.resources : {
          ...E.mcp.resources,
          ...H.length > 0 ? {
            [K.name]: H
          } : x9Q(E.mcp.resources, K.name)
        };
      return {
        ...E,
        mcp: {
          ...E.mcp,
          clients: O,
          tools: L,
          commands: M,
          resources: _
        }
      }
    })
  }, [Z]), X = OU.useCallback(({
    client: K,
    tools: V,
    commands: F,
    resources: H
  }) => {
    switch (J(K, V, F, H), K.type) {
      case "connected": {
        if (K.client.onclose = () => {
            let E = K.config.type ?? "stdio";
            if (pc(K.name, K.config).catch(() => {
                k(`Failed to invalidate the server cache: ${K.name}`)
              }), QhA(K.name)) {
              i0(K.name, "Server is disabled, skipping automatic reconnection");
              return
            }
            if (E !== "stdio" && E !== "sdk") {
              let z = ZX7(E);
              i0(K.name, `${z} transport closed/disconnected, attempting automatic reconnection`);
              let $ = Y.current.get(K.name);
              if ($) clearTimeout($), Y.current.delete(K.name);
              (async () => {
                for (let L = 1; L <= uzA; L++) {
                  if (QhA(K.name)) {
                    i0(K.name, "Server disabled during reconnection, stopping retry"), Y.current.delete(K.name);
                    return
                  }
                  J({
                    ...K,
                    type: "pending",
                    reconnectAttempt: L,
                    maxReconnectAttempts: uzA
                  });
                  let M = Date.now();
                  try {
                    let j = await C3A(K.name, K.config),
                      x = Date.now() - M;
                    if (j.client.type === "connected") {
                      i0(K.name, `${z} reconnection successful after ${x}ms (attempt ${L})`), Y.current.delete(K.name), X(j);
                      return
                    }
                    if (i0(K.name, `${z} reconnection attempt ${L} completed with status: ${j.client.type}`), L === uzA) {
                      i0(K.name, `Max reconnection attempts (${uzA}) reached, giving up`), Y.current.delete(K.name), X(j);
                      return
                    }
                  } catch (j) {
                    let x = Date.now() - M;
                    if (NZ(K.name, `${z} reconnection attempt ${L} failed after ${x}ms: ${j}`), L === uzA) {
                      i0(K.name, `Max reconnection attempts (${uzA}) reached, giving up`), Y.current.delete(K.name), J({
                        ...K,
                        type: "failed"
                      });
                      return
                    }
                  }
                  let _ = Math.min(BX7 * Math.pow(2, L - 1), GX7);
                  i0(K.name, `Scheduling reconnection attempt ${L+1} in ${_}ms`), await new Promise((j) => {
                    let x = setTimeout(j, _);
                    Y.current.set(K.name, x)
                  })
                }
              })()
            } else J({
              ...K,
              type: "failed"
            })
          }, K.capabilities?.tools?.listChanged) K.client.setNotificationHandler(jY0, async () => {
          i0(K.name, "Received tools/list_changed notification, refreshing tools"), l("tengu_mcp_list_changed", {
            type: "tools"
          });
          try {
            Ax.cache.delete(K);
            let E = await Ax(K);
            J(K, E)
          } catch (E) {
            NZ(K.name, `Failed to refresh tools after list_changed notification: ${E instanceof Error?E.message:String(E)}`)
          }
        });
        if (K.capabilities?.prompts?.listChanged) K.client.setNotificationHandler(_Y0, async () => {
          i0(K.name, "Received prompts/list_changed notification, refreshing prompts"), l("tengu_mcp_list_changed", {
            type: "prompts"
          });
          try {
            ZhA.cache.delete(K);
            let E = await ZhA(K);
            J(K, void 0, E)
          } catch (E) {
            NZ(K.name, `Failed to refresh prompts after list_changed notification: ${E instanceof Error?E.message:String(E)}`)
          }
        });
        if (K.capabilities?.resources?.listChanged) K.client.setNotificationHandler(NY0, async () => {
          i0(K.name, "Received resources/list_changed notification, refreshing resources"), l("tengu_mcp_list_changed", {
            type: "resources"
          });
          try {
            GhA.cache.delete(K);
            let E = await GhA(K);
            J(K, void 0, void 0, E)
          } catch (E) {
            NZ(K.name, `Failed to refresh resources after list_changed notification: ${E instanceof Error?E.message:String(E)}`)
          }
        });
        break
      }
      case "needs-auth":
      case "failed":
      case "pending":
      case "disabled":
      case "proxy":
        break
    }
  }, [J]), I = q0();
  OU.useEffect(() => {
    async function K() {
      let {
        servers: V,
        errors: F
      } = Q ? {
        servers: {},
        errors: []
      } : await cEA(), H = {
        ...V,
        ...A
      };
      $99(Z, F), Z((E) => {
        let z = new Set(E.mcp.clients.map((O) => O.name)),
          $ = Object.entries(H).filter(([O]) => !z.has(O)).map(([O, L]) => ({
            name: O,
            type: "pending",
            config: L
          }));
        if ($.length === 0) return E;
        return {
          ...E,
          mcp: {
            ...E.mcp,
            clients: [...E.mcp.clients, ...$]
          }
        }
      })
    }
    K().catch((V) => {
      NZ("useManageMCPConnections", `Failed to initialize servers as pending: ${V instanceof Error?V.message:String(V)}`)
    })
  }, [Q, A, Z, I]), OU.useEffect(() => {
    let K = !1;
    async function V() {
      eo2();
      let {
        servers: F,
        errors: H
      } = Q ? {
        servers: {},
        errors: []
      } : await cEA();
      if (K) return;
      $99(Z, H);
      let E = {
        ...F,
        ...A
      };
      EL0(X, E).catch((L) => {
        NZ("useManageMcpConnections", `Failed to get MCP resources: ${L instanceof Error?L.message:String(L)}`)
      });
      let $ = {
          ...E,
          ...{}
        },
        O = {
          enterprise: 0,
          global: 0,
          project: 0,
          user: 0,
          plugin: 0,
          claudeai: 0
        };
      for (let L of Object.values($))
        if (L.scope === "enterprise") O.enterprise++;
        else if (L.scope === "user") O.global++;
      else if (L.scope === "project") O.project++;
      else if (L.scope === "local") O.user++;
      else if (L.scope === "dynamic") O.plugin++;
      else if (L.scope === "claudeai") O.claudeai++;
      l("tengu_mcp_servers", O)
    }
    return V(), () => {
      K = !0
    }
  }, [Q, A, X, I, G.authVersion, Z]), OU.useEffect(() => {
    let K = Y.current;
    return () => {
      for (let V of K.values()) clearTimeout(V);
      K.clear()
    }
  }, []), OU.useEffect(() => {}, [G.mcp.clients, Z]), OU.useEffect(() => B?.updateClients(G.mcp.clients), [B, G.mcp.clients]), OU.useEffect(() => B?.updateTools(G.mcp.tools), [B, G.mcp.tools]), OU.useEffect(() => B?.updateResources(G.mcp.resources), [B, G.mcp.resources]);
  let D = OU.useCallback(async (K) => {
      let V = G.mcp.clients.find((E) => E.name === K);
      if (!V) throw Error(`MCP server ${K} not found`);
      let F = Y.current.get(K);
      if (F) clearTimeout(F), Y.current.delete(K);
      let H = await C3A(K, V.config);
      return X(H), H
    }, [G.mcp.clients, X, Z]),
    W = OU.useCallback(async (K) => {
      let V = G.mcp.clients.find((H) => H.name === K);
      if (!V) throw Error(`MCP server ${K} not found`);
      if (V.type !== "disabled") {
        let H = Y.current.get(K);
        if (H) clearTimeout(H), Y.current.delete(K);
        if (KL0(K, !1), V.type === "connected") await pc(K, V.config);
        J({
          name: K,
          type: "disabled",
          config: V.config
        })
      } else {
        KL0(K, !0), J({
          name: K,
          type: "pending",
          config: V.config
        });
        let H = await C3A(K, V.config);
        X(H)
      }
    }, [G.mcp.clients, J, X, Z]);
  return {
    reconnectMcpServer: D,
    toggleMcpServer: W
  }
}
// @from(Ln 410890, Col 0)
function ZX7(A) {
  switch (A) {
    case "http":
      return "HTTP";
    case "ws":
    case "ws-ide":
      return "WebSocket";
    default:
      return "SSE"
  }
}
// @from(Ln 410901, Col 4)
OU
// @from(Ln 410901, Col 8)
uzA = 5
// @from(Ln 410902, Col 2)
BX7 = 1000
// @from(Ln 410903, Col 2)
GX7 = 30000
// @from(Ln 410904, Col 4)
U99 = w(() => {
  C0();
  jN();
  v1();
  eK();
  hB();
  y9Q();
  u9Q();
  G$();
  XL0();
  PJ();
  T1();
  Z0();
  E99();
  OU = c(QA(), 1)
})
// @from(Ln 410921, Col 0)
function n3A() {
  let A = Fp.useContext(B_0);
  if (!A) throw Error("useMcpReconnect must be used within MCPConnectionManager");
  return A.reconnectMcpServer
}
// @from(Ln 410927, Col 0)
function Ke() {
  let A = Fp.useContext(B_0);
  if (!A) throw Error("useMcpToggleEnabled must be used within MCPConnectionManager");
  return A.toggleMcpServer
}
// @from(Ln 410933, Col 0)
function fE1({
  children: A,
  dynamicMcpConfig: Q,
  isStrictMcpConfig: B,
  mcpCliEndpoint: G
}) {
  let {
    reconnectMcpServer: Z,
    toggleMcpServer: Y
  } = C99(Q, B, G), J = Fp.useMemo(() => ({
    reconnectMcpServer: Z,
    toggleMcpServer: Y
  }), [Z, Y]);
  return Fp.default.createElement(B_0.Provider, {
    value: J
  }, A)
}
// @from(Ln 410950, Col 4)
Fp
// @from(Ln 410950, Col 8)
B_0
// @from(Ln 410951, Col 4)
Hp = w(() => {
  U99();
  Fp = c(QA(), 1), B_0 = Fp.createContext(null)
})
// @from(Ln 410956, Col 0)
function hE1(A, Q) {
  switch (A.client.type) {
    case "connected":
      return {
        message: `Reconnected to ${Q}.`, success: !0
      };
    case "needs-auth":
      return {
        message: `${Q} requires authentication. Use the 'Authenticate' option.`, success: !1
      };
    case "failed":
      return {
        message: `Failed to reconnect to ${Q}.`, success: !1
      };
    default:
      return {
        message: `Unknown result when reconnecting to ${Q}.`, success: !1
      }
  }
}
// @from(Ln 410977, Col 0)
function CgA(A, Q) {
  let B = A instanceof Error ? A.message : String(A);
  return `Error reconnecting to ${Q}: ${B}`
}