
// @from(Ln 404392, Col 0)
function rQ9({
  context: A
}) {
  let [Q] = a0(), [B, G] = g3.useState([]), [Z, Y] = g3.useState([]), J = A.options.ideInstallationStatus, [X] = oB();
  return g3.useEffect(() => {
    async function I() {
      let D = [oY7(), rY7({
          appState: Q,
          theme: X,
          context: A
        })],
        W = await sY7();
      G(D), Y(W)
    }
    I()
  }, [Q, X, J, A]), g3.createElement(T, {
    flexDirection: "column"
  }, g3.createElement(T, {
    flexDirection: "column",
    gap: 1,
    marginTop: 1
  }, B.map((I, D) => I.length > 0 && g3.createElement(T, {
    key: D,
    flexDirection: "column"
  }, I.map(({
    label: W,
    value: K
  }, V) => g3.createElement(T, {
    key: V,
    flexDirection: "row",
    gap: 1,
    flexShrink: 0
  }, W !== void 0 && g3.createElement(C, {
    bold: !0
  }, W, ":"), g3.createElement(tY7, {
    value: K
  }))))), Z.length > 0 && g3.createElement(T, {
    flexDirection: "column",
    paddingBottom: 1
  }, g3.createElement(C, {
    bold: !0
  }, "System Diagnostics"), Z.map((I, D) => g3.createElement(T, {
    key: D,
    flexDirection: "row",
    gap: 1,
    paddingX: 1
  }, g3.createElement(C, {
    color: "error"
  }, tA.warning), typeof I === "string" ? g3.createElement(C, {
    wrap: "wrap"
  }, I) : I)))), g3.createElement(C, {
    dimColor: !0
  }, g3.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "cancel"
  })))
}
// @from(Ln 404451, Col 4)
g3
// @from(Ln 404452, Col 4)
sQ9 = w(() => {
  fA();
  B2();
  hB();
  C0();
  qQ9();
  xx();
  aQ9();
  V2();
  d4();
  I3();
  g3 = c(QA(), 1)
})
// @from(Ln 404466, Col 0)
function _zA({
  onThemeSelect: A,
  showIntroText: Q = !1,
  helpText: B = "",
  showHelpTextBelow: G = !1,
  hideEscToCancel: Z = !1,
  skipExitHandling: Y = !1,
  onCancel: J
}) {
  let [X] = oB(), {
    columns: I
  } = ZB(), D = d$0(), W = D === null ? Dv2(X) : null, {
    setPreviewTheme: K,
    savePreview: V,
    cancelPreview: F
  } = yQ0(), [H, E] = a0(), z = H.settings.syntaxHighlightingDisabled ?? !1, $ = J3("theme:toggleSyntaxHighlighting", "ThemePicker", "ctrl+t");
  H2("theme:toggleSyntaxHighlighting", () => {
    if (D === null) {
      let _ = !z;
      pB("userSettings", {
        syntaxHighlightingDisabled: _
      }), E((j) => ({
        ...j,
        settings: {
          ...j.settings,
          syntaxHighlightingDisabled: _
        }
      }))
    }
  }, {
    context: "ThemePicker"
  });
  let O = MQ(Y ? () => {} : void 0),
    M = N4.createElement(T, {
      flexDirection: "column",
      gap: 1
    }, N4.createElement(T, {
      flexDirection: "column",
      gap: 1,
      marginX: 1
    }, Q ? N4.createElement(C, null, "Let's get started.") : N4.createElement(C, {
      bold: !0,
      color: "permission"
    }, "Theme"), N4.createElement(T, {
      flexDirection: "column"
    }, N4.createElement(C, {
      bold: !0
    }, "Choose the text style that looks best with your terminal"), B && !G && N4.createElement(C, {
      dimColor: !0
    }, B)), N4.createElement(k0, {
      options: [{
        label: "Dark mode",
        value: "dark"
      }, {
        label: "Light mode",
        value: "light"
      }, {
        label: "Dark mode (colorblind-friendly)",
        value: "dark-daltonized"
      }, {
        label: "Light mode (colorblind-friendly)",
        value: "light-daltonized"
      }, {
        label: "Dark mode (ANSI colors only)",
        value: "dark-ansi"
      }, {
        label: "Light mode (ANSI colors only)",
        value: "light-ansi"
      }],
      onFocus: (_) => {
        K(_)
      },
      onChange: (_) => {
        V(), A(_)
      },
      onCancel: Y ? () => {
        F(), J?.()
      } : async () => {
        F(), await w3(0)
      },
      visibleOptionCount: 6,
      defaultValue: X,
      defaultFocusValue: X
    })), N4.createElement(T, {
      flexDirection: "column",
      width: "100%"
    }, N4.createElement(T, {
      flexDirection: "column",
      borderTop: !0,
      borderBottom: !0,
      borderLeft: !1,
      borderRight: !1,
      borderStyle: "dashed",
      borderColor: "subtle",
      borderDimColor: !0
    }, N4.createElement(sN, {
      patch: {
        oldStart: 1,
        newStart: 1,
        oldLines: 3,
        newLines: 3,
        lines: [" function greet() {", '-  console.log("Hello, World!");', '+  console.log("Hello, Claude!");', " }"]
      },
      dim: !1,
      filePath: "demo.js",
      firstLine: null,
      width: I
    })), N4.createElement(C, {
      dimColor: !0
    }, " ", D === "env" ? `Syntax highlighting disabled (via CLAUDE_CODE_SYNTAX_HIGHLIGHT=${process.env.CLAUDE_CODE_SYNTAX_HIGHLIGHT})` : D === "build" ? "Syntax highlighting available only in native build" : z ? `Syntax highlighting disabled (${$} to enable)` : W ? `Syntax theme: ${W.theme}${W.source?` (from ${W.source})`:""} (${$} to disable)` : `Syntax highlighting enabled (${$} to disable)`)));
  if (!Q) return N4.createElement(N4.Fragment, null, N4.createElement(T, {
    flexDirection: "column"
  }, M), N4.createElement(T, {
    marginX: 1,
    marginTop: 1
  }, G && B && N4.createElement(T, {
    marginLeft: 3
  }, N4.createElement(C, {
    dimColor: !0
  }, B)), !Z && N4.createElement(T, null, N4.createElement(C, {
    dimColor: !0,
    italic: !0
  }, O.pending ? N4.createElement(N4.Fragment, null, "Press ", O.keyName, " again to exit") : N4.createElement(vQ, null, N4.createElement(F0, {
    shortcut: "Enter",
    action: "select"
  }), N4.createElement(F0, {
    shortcut: "Esc",
    action: "cancel"
  }))))));
  return M
}
// @from(Ln 404597, Col 4)
N4
// @from(Ln 404598, Col 4)
NE1 = w(() => {
  fA();
  u8();
  ls();
  E9();
  yJ();
  fA();
  P4();
  e9();
  K6();
  KbA();
  GB();
  hB();
  c6();
  NX();
  N4 = c(QA(), 1)
})
// @from(Ln 404616, Col 0)
function jzA({
  initial: A,
  sessionModel: Q,
  onSelect: B,
  onCancel: G,
  isStandaloneCommand: Z
}) {
  let Y = A === null ? MR0 : A,
    J = 10,
    X = MQ(),
    I = !1,
    [D, W] = Xp.useState(() => eY7()),
    [K, V] = Xp.useState(!1),
    [F, H] = Xp.useState(Y),
    E = Xp.useMemo(() => zQA(), []),
    z = Xp.useMemo(() => {
      if (A !== null && !E.some((b) => b.value === A)) return [...E, {
        value: A,
        label: eT(A),
        description: "Current model"
      }];
      return E
    }, [E, A]),
    $ = Xp.useMemo(() => z.map((b) => ({
      ...b,
      value: b.value === null ? MR0 : b.value
    })), [z]),
    O = Xp.useMemo(() => $.some((b) => b.value === Y) ? Y : $[0]?.value ?? void 0, [$, Y]),
    L = Math.min(10, $.length),
    M = Math.max(0, $.length - L),
    _ = $.find((b) => b.value === F)?.label,
    j = !1;
  J0((b, S) => {
    return
  });

  function x(b) {
    if (b === MR0) {
      B(null, void 0);
      return
    }
    B(b, void 0)
  }
  return E8.createElement(T, {
    flexDirection: "column",
    width: "100%"
  }, Z && E8.createElement(K8, {
    dividerColor: "permission",
    dividerDimColor: !1
  }), E8.createElement(T, {
    flexDirection: "column",
    paddingX: Z ? 1 : 0
  }, E8.createElement(T, {
    flexDirection: "column"
  }, E8.createElement(T, {
    marginBottom: 1,
    flexDirection: "column"
  }, E8.createElement(C, {
    color: "remember",
    bold: !0
  }, "Select model"), E8.createElement(C, {
    dimColor: !0
  }, "Switch between Claude models. Applies to this session and future Claude Code sessions. For other/previous model names, specify with --model."), Q && E8.createElement(C, {
    dimColor: !0
  }, "Currently using ", eT(Q), " for this session (set by plan mode). Selecting a model will undo this.")), E8.createElement(T, {
    flexDirection: "column",
    marginBottom: 1
  }, E8.createElement(T, {
    flexDirection: "column"
  }, E8.createElement(k0, {
    defaultValue: Y,
    defaultFocusValue: O,
    options: $,
    onChange: x,
    onFocus: H,
    onCancel: G ?? (() => {}),
    visibleOptionCount: L
  })), M > 0 && E8.createElement(T, {
    paddingLeft: 3
  }, E8.createElement(C, {
    dimColor: !0
  }, "and ", M, " more…"))), !1), Z && E8.createElement(C, {
    dimColor: !0,
    italic: !0
  }, X.pending ? E8.createElement(E8.Fragment, null, "Press ", X.keyName, " again to exit") : E8.createElement(vQ, null, E8.createElement(F0, {
    shortcut: "Enter",
    action: "confirm"
  }), E8.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "exit"
  })))))
}
// @from(Ln 404711, Col 0)
function eY7() {
  let A = w3A();
  if (A === void 0) return "high";
  return vs2(A)
}
// @from(Ln 404716, Col 4)
E8
// @from(Ln 404716, Col 8)
Xp
// @from(Ln 404716, Col 12)
MR0 = "__NO_PREFERENCE__"
// @from(Ln 404717, Col 4)
wE1 = w(() => {
  fA();
  l2();
  rEA();
  GB();
  u8();
  E9();
  lD();
  e9();
  I3();
  K6();
  Z0();
  E8 = c(QA(), 1), Xp = c(QA(), 1)
})
// @from(Ln 404732, Col 0)
function LE1({
  onDone: A,
  isStandaloneDialog: Q,
  externalIncludes: B
}) {
  CK.default.useEffect(() => {
    l("tengu_claude_md_includes_dialog_shown", {})
  }, []);

  function G(Y) {
    if (Y === "no") l("tengu_claude_md_external_includes_dialog_declined", {}), BZ((J) => ({
      ...J,
      hasClaudeMdExternalIncludesApproved: !1,
      hasClaudeMdExternalIncludesWarningShown: !0
    }));
    else l("tengu_claude_md_external_includes_dialog_accepted", {}), BZ((J) => ({
      ...J,
      hasClaudeMdExternalIncludesApproved: !0,
      hasClaudeMdExternalIncludesWarningShown: !0
    }));
    A()
  }
  let Z = MQ();
  return J0((Y, J) => {
    if (J.escape) {
      G("no");
      return
    }
  }), CK.default.createElement(CK.default.Fragment, null, CK.default.createElement(T, {
    flexDirection: "column",
    gap: 1,
    paddingX: Q ? 1 : 0,
    marginBottom: 1,
    borderStyle: Q ? "round" : void 0,
    borderTop: Q,
    borderLeft: !1,
    borderRight: !1,
    borderBottom: !1,
    borderColor: "warning"
  }, CK.default.createElement(C, {
    bold: !0,
    color: "warning"
  }, "Allow external CLAUDE.md file imports?"), CK.default.createElement(C, null, "This project's CLAUDE.md imports files outside the current working directory. Never allow this for third-party repositories."), B && B.length > 0 && CK.default.createElement(T, {
    flexDirection: "column"
  }, CK.default.createElement(C, {
    dimColor: !0
  }, "External imports:"), B.map((Y, J) => CK.default.createElement(C, {
    key: J,
    dimColor: !0
  }, "  ", Y.path))), CK.default.createElement(C, {
    dimColor: !0
  }, "Important: Only use Claude Code with files you trust. Accessing untrusted files may pose security risks", " ", CK.default.createElement(i2, {
    url: "https://code.claude.com/docs/en/security"
  }), " "), CK.default.createElement(k0, {
    options: [{
      label: "Yes, allow external imports",
      value: "yes"
    }, {
      label: "No, disable external imports",
      value: "no"
    }],
    onChange: (Y) => G(Y),
    onCancel: () => G("no")
  })), Q && CK.default.createElement(T, {
    marginLeft: 1
  }, CK.default.createElement(C, {
    dimColor: !0
  }, Z.pending ? CK.default.createElement(CK.default.Fragment, null, "Press ", Z.keyName, " again to exit") : CK.default.createElement(vQ, null, CK.default.createElement(F0, {
    shortcut: "Enter",
    action: "confirm"
  }), CK.default.createElement(F0, {
    shortcut: "Esc",
    action: "disable external includes"
  })))))
}
// @from(Ln 404807, Col 4)
CK
// @from(Ln 404808, Col 4)
RR0 = w(() => {
  fA();
  u8();
  GQ();
  Z0();
  E9();
  fA();
  e9();
  K6();
  CK = c(QA(), 1)
})
// @from(Ln 404820, Col 0)
function eQ9({
  currentVersion: A,
  onChoice: Q
}) {
  function B(Z) {
    Q(Z)
  }

  function G() {
    Q("cancel")
  }
  return JgA.default.createElement(o9, {
    title: "Switch to Stable Channel",
    onCancel: G,
    color: "permission",
    hideBorder: !0,
    hideInputGuide: !0
  }, JgA.default.createElement(C, null, "The stable channel may have an older version than what you're currently running (", A, ")."), JgA.default.createElement(C, {
    dimColor: !0
  }, "How would you like to handle this?"), JgA.default.createElement(k0, {
    options: [{
      label: "Allow possible downgrade to stable version",
      value: "downgrade"
    }, {
      label: `Stay on current version (${A}) until stable catches up`,
      value: "stay"
    }],
    onChange: B
  }))
}
// @from(Ln 404850, Col 4)
JgA
// @from(Ln 404851, Col 4)
AB9 = w(() => {
  fA();
  u8();
  fA();
  hB();
  rY();
  Kf();
  Bc();
  JgA = c(QA(), 1)
})
// @from(Ln 404862, Col 0)
function QB9(A) {
  return Object.entries(A).map(([Q, B]) => ({
    label: B?.name ?? AJ7,
    value: Q,
    description: B?.description ?? QJ7
  }))
}
// @from(Ln 404870, Col 0)
function OE1({
  initialStyle: A,
  onComplete: Q,
  onCancel: B,
  isStandaloneCommand: G
}) {
  let [Z, Y] = m3A.useState([]), [J, X] = m3A.useState(!0);
  m3A.useEffect(() => {
    d3A(o1()).then((D) => {
      let W = QB9(D);
      Y(W), X(!1)
    }).catch(() => {
      let D = QB9(y6A);
      Y(D), X(!1)
    })
  }, []);
  let I = m3A.useCallback((D) => {
    Q(D)
  }, [Q]);
  return aO.createElement(o9, {
    title: "Preferred output style",
    onCancel: B,
    borderDimColor: !0,
    hideInputGuide: !G,
    hideBorder: !G
  }, aO.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, aO.createElement(T, {
    marginTop: 1
  }, aO.createElement(C, {
    dimColor: !0
  }, "This changes how Claude Code communicates with you")), J ? aO.createElement(C, {
    dimColor: !0
  }, "Loading output styles…") : aO.createElement(k0, {
    options: Z,
    onChange: I,
    visibleOptionCount: 10,
    defaultValue: A
  })))
}
// @from(Ln 404911, Col 4)
aO
// @from(Ln 404911, Col 8)
m3A
// @from(Ln 404911, Col 13)
AJ7 = "Default"
// @from(Ln 404912, Col 2)
QJ7 = "Claude completes coding tasks efficiently and provides concise responses"
// @from(Ln 404913, Col 4)
_R0 = w(() => {
  fA();
  W8();
  Cf();
  V2();
  rY();
  aO = c(QA(), 1), m3A = c(QA(), 1)
})
// @from(Ln 404922, Col 0)
function BB9({
  initialLanguage: A,
  onComplete: Q,
  onCancel: B
}) {
  let [G, Z] = jR0.useState(A), [Y, J] = jR0.useState((A ?? "").length);
  H2("confirm:no", B, {
    context: "Settings"
  });

  function X() {
    let I = G?.trim();
    Q(I || void 0)
  }
  return c3A.default.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, c3A.default.createElement(C, null, "Enter your preferred response language:"), c3A.default.createElement(T, {
    flexDirection: "row",
    gap: 1
  }, c3A.default.createElement(C, null, tA.pointer), c3A.default.createElement(p4, {
    value: G ?? "",
    onChange: Z,
    onSubmit: X,
    focus: !0,
    showCursor: !0,
    placeholder: `e.g., Japanese, 日本語, Español${tA.ellipsis}`,
    columns: 60,
    cursorOffset: Y,
    onChangeCursorOffset: J
  })), c3A.default.createElement(C, {
    dimColor: !0
  }, "Leave empty for default (English)"))
}
// @from(Ln 404956, Col 4)
c3A
// @from(Ln 404956, Col 9)
jR0
// @from(Ln 404957, Col 4)
GB9 = w(() => {
  fA();
  IY();
  B2();
  c6();
  c3A = c(QA(), 1), jR0 = c(QA(), 1)
})
// @from(Ln 404965, Col 0)
function ZB9({
  onClose: A,
  context: Q,
  setTabsHidden: B,
  setIsWarning: G,
  setHideMargin: Z
}) {
  let [Y, J] = oB(), [X, I] = oO.useState(L1()), [D, W] = oO.useState(Q19()), K = E0.useRef(L1()), [V, F] = oO.useState(r3()), H = E0.useRef(r3()), [E, z] = oO.useState(V?.outputStyle || vF), $ = E0.useRef(E), [O, L] = oO.useState(V?.language), M = E0.useRef(O), [_, j] = oO.useState(0), [x, b] = oO.useState(""), [S, u] = oO.useState(!0), f = GN(), [{
    mainLoopModel: AA,
    verbose: n,
    thinkingEnabled: y,
    promptSuggestionEnabled: p
  }, GA] = a0(), [WA, MA] = oO.useState({}), [TA, bA] = oO.useState(null), jA = fF1(Q.options.mcpClients), OA = !a1(process.env.CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING), IA = DD0(), HA = DXA();
  async function ZA(t) {
    l("tengu_config_model_changed", {
      from_model: AA,
      to_model: t
    }), GA((DA) => ({
      ...DA,
      mainLoopModel: t
    })), MA((DA) => {
      let CA = eT(t);
      if ("model" in DA) {
        let {
          model: FA,
          ...xA
        } = DA;
        return {
          ...xA,
          model: CA
        }
      }
      return {
        ...DA,
        model: CA
      }
    })
  }

  function zA(t) {
    S0((BA) => ({
      ...BA,
      verbose: t
    })), I({
      ...L1(),
      verbose: t
    }), GA((BA) => ({
      ...BA,
      verbose: t
    })), MA((BA) => {
      if ("verbose" in BA) {
        let {
          verbose: DA,
          ...CA
        } = BA;
        return CA
      }
      return {
        ...BA,
        verbose: t
      }
    })
  }
  let wA = [{
      id: "autoCompactEnabled",
      label: "Auto-compact",
      value: X.autoCompactEnabled,
      type: "boolean",
      onChange(t) {
        S0((BA) => ({
          ...BA,
          autoCompactEnabled: t
        })), I({
          ...L1(),
          autoCompactEnabled: t
        }), l("tengu_auto_compact_setting_changed", {
          enabled: t
        })
      }
    }, {
      id: "spinnerTipsEnabled",
      label: "Show tips",
      value: V?.spinnerTipsEnabled ?? !0,
      type: "boolean",
      onChange(t) {
        pB("localSettings", {
          spinnerTipsEnabled: t
        }), F((BA) => ({
          ...BA,
          spinnerTipsEnabled: t
        })), l("tengu_tips_setting_changed", {
          enabled: t
        })
      }
    }, {
      id: "thinkingEnabled",
      label: "Thinking mode",
      value: y,
      type: "boolean",
      onChange(t) {
        GA((BA) => ({
          ...BA,
          thinkingEnabled: t
        })), pB("userSettings", {
          alwaysThinkingEnabled: t ? void 0 : !1
        }), l("tengu_thinking_toggled", {
          enabled: t
        })
      }
    }, ...f8("tengu_prompt_suggestion") ? [{
      id: "promptSuggestionEnabled",
      label: "Prompt suggestions",
      value: p,
      type: "boolean",
      onChange(t) {
        GA((BA) => ({
          ...BA,
          promptSuggestionEnabled: t
        })), pB("userSettings", {
          promptSuggestionEnabled: t ? void 0 : !1
        })
      }
    }] : [], ...[], ...OA ? [{
      id: "fileCheckpointingEnabled",
      label: "Rewind code (checkpoints)",
      value: X.fileCheckpointingEnabled,
      type: "boolean",
      onChange(t) {
        S0((BA) => ({
          ...BA,
          fileCheckpointingEnabled: t
        })), I({
          ...L1(),
          fileCheckpointingEnabled: t
        }), l("tengu_file_history_snapshots_setting_changed", {
          enabled: t
        })
      }
    }] : [], {
      id: "verbose",
      label: "Verbose output",
      value: n,
      type: "boolean",
      onChange: zA
    }, {
      id: "terminalProgressBarEnabled",
      label: "Terminal progress bar",
      value: X.terminalProgressBarEnabled,
      type: "boolean",
      onChange(t) {
        S0((BA) => ({
          ...BA,
          terminalProgressBarEnabled: t
        })), I({
          ...L1(),
          terminalProgressBarEnabled: t
        }), l("tengu_terminal_progress_bar_setting_changed", {
          enabled: t
        })
      }
    }, {
      id: "defaultPermissionMode",
      label: "Default permission mode",
      value: V?.permissions?.defaultMode || "default",
      options: (() => {
        let t = ["default", "plan"],
          BA = ["bypassPermissions", "delegate"];
        return [...t, ...NP.filter((DA) => !t.includes(DA) && !BA.includes(DA))]
      })(),
      type: "enum",
      onChange(t) {
        let BA = tQ1(t),
          DA = pB("userSettings", {
            permissions: {
              ...V?.permissions,
              defaultMode: BA
            }
          });
        if (DA.error) {
          e(DA.error);
          return
        }
        F((CA) => ({
          ...CA,
          permissions: {
            ...CA?.permissions,
            defaultMode: BA
          }
        })), MA((CA) => ({
          ...CA,
          defaultPermissionMode: t
        })), l("tengu_config_changed", {
          setting: "defaultPermissionMode",
          value: t
        })
      }
    }, {
      id: "respectGitignore",
      label: "Respect .gitignore in file picker",
      value: X.respectGitignore,
      type: "boolean",
      onChange(t) {
        S0((BA) => ({
          ...BA,
          respectGitignore: t
        })), I({
          ...L1(),
          respectGitignore: t
        }), l("tengu_respect_gitignore_setting_changed", {
          enabled: t
        })
      }
    }, HA ? {
      id: "autoUpdatesChannel",
      label: "Auto-update channel",
      value: "disabled",
      type: "managedEnum",
      onChange() {}
    } : {
      id: "autoUpdatesChannel",
      label: "Auto-update channel",
      value: V?.autoUpdatesChannel ?? "latest",
      type: "managedEnum",
      onChange() {}
    }, {
      id: "theme",
      label: "Theme",
      value: Y,
      type: "managedEnum",
      onChange: J
    }, {
      id: "notifChannel",
      label: "Notifications",
      value: X.preferredNotifChannel,
      options: ["auto", "iterm2", "terminal_bell", "iterm2_with_bell", "kitty", "ghostty", "notifications_disabled"],
      type: "enum",
      onChange(t) {
        S0((BA) => ({
          ...BA,
          preferredNotifChannel: t
        })), I({
          ...L1(),
          preferredNotifChannel: t
        })
      }
    }, {
      id: "outputStyle",
      label: "Output style",
      value: E,
      type: "managedEnum",
      onChange: () => {}
    }, {
      id: "language",
      label: "Language",
      value: O ?? "Default (English)",
      type: "managedEnum",
      onChange: () => {}
    }, {
      id: "editorMode",
      label: "Editor mode",
      value: X.editorMode === "emacs" ? "normal" : X.editorMode || "normal",
      options: ["normal", "vim"],
      type: "enum",
      onChange(t) {
        S0((BA) => ({
          ...BA,
          editorMode: t
        })), I({
          ...L1(),
          editorMode: t
        }), l("tengu_editor_mode_changed", {
          mode: t,
          source: "config_panel"
        })
      }
    }, ...[], ...ZZ("tengu_code_diff_cli", !1) ? [{
      id: "codeDiffFooterEnabled",
      label: "Show code diff footer",
      value: X.codeDiffFooterEnabled ?? !0,
      type: "boolean",
      onChange(t) {
        S0((BA) => {
          if (BA.codeDiffFooterEnabled === t) return BA;
          return {
            ...BA,
            codeDiffFooterEnabled: t
          }
        }), I({
          ...L1(),
          codeDiffFooterEnabled: t
        }), l("tengu_code_diff_footer_setting_changed", {
          enabled: t
        })
      }
    }] : [], {
      id: "model",
      label: "Model",
      value: AA === null ? "Default (recommended)" : AA,
      type: "managedEnum",
      onChange: ZA
    }, ...jA ? [{
      id: "diffTool",
      label: "Diff tool",
      value: X.diffTool ?? "auto",
      options: ["terminal", "auto"],
      type: "enum",
      onChange(t) {
        S0((BA) => ({
          ...BA,
          diffTool: t
        })), I({
          ...L1(),
          diffTool: t
        }), l("tengu_diff_tool_changed", {
          tool: t,
          source: "config_panel"
        })
      }
    }] : [], ...!zK() ? [{
      id: "autoConnectIde",
      label: "Auto-connect to IDE (external terminal)",
      value: X.autoConnectIde ?? !1,
      type: "boolean",
      onChange(t) {
        S0((BA) => ({
          ...BA,
          autoConnectIde: t
        })), I({
          ...L1(),
          autoConnectIde: t
        }), l("tengu_auto_connect_ide_changed", {
          enabled: t,
          source: "config_panel"
        })
      }
    }] : [], ...zK() ? [{
      id: "autoInstallIdeExtension",
      label: "Auto-install IDE extension",
      value: X.autoInstallIdeExtension ?? !0,
      type: "boolean",
      onChange(t) {
        S0((BA) => ({
          ...BA,
          autoInstallIdeExtension: t
        })), I({
          ...L1(),
          autoInstallIdeExtension: t
        }), l("tengu_auto_install_ide_extension_changed", {
          enabled: t,
          source: "config_panel"
        })
      }
    }] : [], {
      id: "claudeInChromeDefaultEnabled",
      label: "Claude in Chrome enabled by default",
      value: X.claudeInChromeDefaultEnabled ?? !0,
      type: "boolean",
      onChange(t) {
        S0((BA) => ({
          ...BA,
          claudeInChromeDefaultEnabled: t
        })), I({
          ...L1(),
          claudeInChromeDefaultEnabled: t
        }), l("tengu_claude_in_chrome_setting_changed", {
          enabled: t
        })
      }
    }, ...[], ...IA ? [{
      id: "showExternalIncludesDialog",
      label: "External CLAUDE.md includes",
      value: (() => {
        if (JG().hasClaudeMdExternalIncludesApproved) return "true";
        else return "false"
      })(),
      type: "managedEnum",
      onChange() {}
    }] : [], ...process.env.ANTHROPIC_API_KEY ? [{
      id: "apiKey",
      label: E0.createElement(C, null, "Use custom API key:", " ", E0.createElement(C, {
        bold: !0
      }, TL(process.env.ANTHROPIC_API_KEY))),
      searchText: "Use custom API key",
      value: Boolean(process.env.ANTHROPIC_API_KEY && X.customApiKeyResponses?.approved?.includes(TL(process.env.ANTHROPIC_API_KEY))),
      type: "boolean",
      onChange(t) {
        S0((BA) => {
          let DA = {
            ...BA
          };
          if (!DA.customApiKeyResponses) DA.customApiKeyResponses = {
            approved: [],
            rejected: []
          };
          if (!DA.customApiKeyResponses.approved) DA.customApiKeyResponses = {
            ...DA.customApiKeyResponses,
            approved: []
          };
          if (!DA.customApiKeyResponses.rejected) DA.customApiKeyResponses = {
            ...DA.customApiKeyResponses,
            rejected: []
          };
          if (process.env.ANTHROPIC_API_KEY) {
            let CA = TL(process.env.ANTHROPIC_API_KEY);
            if (t) DA.customApiKeyResponses = {
              ...DA.customApiKeyResponses,
              approved: [...(DA.customApiKeyResponses.approved ?? []).filter((FA) => FA !== CA), CA],
              rejected: (DA.customApiKeyResponses.rejected ?? []).filter((FA) => FA !== CA)
            };
            else DA.customApiKeyResponses = {
              ...DA.customApiKeyResponses,
              approved: (DA.customApiKeyResponses.approved ?? []).filter((FA) => FA !== CA),
              rejected: [...(DA.customApiKeyResponses.rejected ?? []).filter((FA) => FA !== CA), CA]
            }
          }
          return DA
        }), I(L1())
      }
    }] : []],
    _A = E0.useMemo(() => {
      if (!x) return wA;
      let t = x.toLowerCase();
      return wA.filter((BA) => {
        if (BA.id.toLowerCase().includes(t)) return !0;
        return ("searchText" in BA ? BA.searchText : BA.label).toLowerCase().includes(t)
      })
    }, [wA, x]);
  E0.useEffect(() => {
    if (_ >= _A.length) j(Math.max(0, _A.length - 1))
  }, [_A.length, _]);
  let s = oO.useCallback(() => {
    if (TA !== null) return;
    let t = Object.entries(WA).map(([CA, FA]) => {
        return l("tengu_config_changed", {
          key: CA,
          value: FA
        }), `Set ${CA} to ${I1.bold(FA)}`
      }),
      BA = Boolean(process.env.ANTHROPIC_API_KEY && K.current.customApiKeyResponses?.approved?.includes(TL(process.env.ANTHROPIC_API_KEY))),
      DA = Boolean(process.env.ANTHROPIC_API_KEY && X.customApiKeyResponses?.approved?.includes(TL(process.env.ANTHROPIC_API_KEY)));
    if (BA !== DA) t.push(`${DA?"Enabled":"Disabled"} custom API key`), l("tengu_config_changed", {
      key: "env.ANTHROPIC_API_KEY",
      value: DA
    });
    if (X.theme !== K.current.theme) t.push(`Set theme to ${I1.bold(X.theme)}`);
    if (X.preferredNotifChannel !== K.current.preferredNotifChannel) t.push(`Set notifications to ${I1.bold(X.preferredNotifChannel)}`);
    if (E !== $.current) t.push(`Set output style to ${I1.bold(E)}`);
    if (O !== M.current) t.push(`Set response language to ${I1.bold(O??"Default (English)")}`);
    if (X.editorMode !== K.current.editorMode) t.push(`Set editor mode to ${I1.bold(X.editorMode||"emacs")}`);
    if (X.diffTool !== K.current.diffTool) t.push(`Set diff tool to ${I1.bold(X.diffTool)}`);
    if (X.autoConnectIde !== K.current.autoConnectIde) t.push(`${X.autoConnectIde?"Enabled":"Disabled"} auto-connect to IDE`);
    if (X.autoInstallIdeExtension !== K.current.autoInstallIdeExtension) t.push(`${X.autoInstallIdeExtension?"Enabled":"Disabled"} auto-install IDE extension`);
    if (X.autoCompactEnabled !== K.current.autoCompactEnabled) t.push(`${X.autoCompactEnabled?"Enabled":"Disabled"} auto-compact`);
    if (X.respectGitignore !== K.current.respectGitignore) t.push(`${X.respectGitignore?"Enabled":"Disabled"} respect .gitignore in file picker`);
    if (X.terminalProgressBarEnabled !== K.current.terminalProgressBarEnabled) t.push(`${X.terminalProgressBarEnabled?"Enabled":"Disabled"} terminal progress bar`);
    if (V?.autoUpdatesChannel !== H.current?.autoUpdatesChannel) t.push(`Set auto-update channel to ${I1.bold(V?.autoUpdatesChannel??"latest")}`);
    if (t.length > 0) A(t.join(`
`));
    else A("Config dialog dismissed", {
      display: "system"
    })
  }, [TA, WA, X, E, O, V?.autoUpdatesChannel, A]);
  return H2("confirm:no", s, {
    context: "Settings"
  }), J0((t, BA) => {
    if (TA !== null) return;
    if (S) {
      if (BA.escape) {
        if (x.length > 0) b("");
        else u(!1);
        return
      }
      if (BA.return || BA.downArrow) {
        u(!1), j(0);
        return
      }
      if (BA.backspace || BA.delete) {
        if (x.length === 0) u(!1);
        else b((CA) => CA.slice(0, -1));
        return
      }
      if (t && !BA.ctrl && !BA.meta) b((CA) => CA + t);
      return
    }

    function DA() {
      let CA = _A[_];
      if (!CA || !CA.onChange) return;
      if (CA.type === "boolean") {
        CA.onChange(!CA.value);
        return
      }
      if (CA.id === "theme" && BA.return) {
        bA(0), B(!0), Z(!0);
        return
      }
      if (CA.id === "model" && BA.return) {
        bA(1), B(!0);
        return
      }
      if (CA.id === "showExternalIncludesDialog" && BA.return) {
        bA(2), B(!0), G(!0);
        return
      }
      if (CA.id === "outputStyle" && BA.return) {
        bA(3), B(!0);
        return
      }
      if (CA.id === "language" && BA.return) {
        bA(5), B(!0);
        return
      }
      if (CA.id === "autoUpdatesChannel" && BA.return) {
        if ((V?.autoUpdatesChannel ?? "latest") === "latest") bA(4), B(!0);
        else pB("userSettings", {
          autoUpdatesChannel: "latest",
          minimumVersion: void 0
        }), F((xA) => ({
          ...xA,
          autoUpdatesChannel: "latest",
          minimumVersion: void 0
        })), l("tengu_autoupdate_channel_changed", {
          channel: "latest"
        });
        return
      }
      if (CA.type === "enum") {
        let xA = (CA.options.indexOf(CA.value) + 1) % CA.options.length;
        CA.onChange(CA.options[xA]);
        return
      }
    }
    if (BA.return || t === " ") {
      DA();
      return
    }
    if (BA.upArrow || BA.ctrl && t === "p" || !BA.ctrl && !BA.shift && t === "k") {
      if (_ === 0) u(!0);
      else j((CA) => Math.max(0, CA - 1));
      return
    }
    if (BA.downArrow || BA.ctrl && t === "n" || !BA.ctrl && !BA.shift && t === "j") {
      j((CA) => Math.min(_A.length - 1, CA + 1));
      return
    }
    if (!BA.ctrl && !BA.meta && t === "/") u(!0), b("");
    else if (!BA.ctrl && !BA.meta && t.length > 0 && t !== "j" && t !== "k" && !/^\s+$/.test(t)) u(!0), b(t)
  }), E0.createElement(T, {
    flexDirection: "column",
    width: "100%"
  }, TA === 0 ? E0.createElement(E0.Fragment, null, E0.createElement(_zA, {
    initialTheme: Y,
    onThemeSelect: (t) => {
      J(t), bA(null), Z(!1), B(!1)
    },
    onCancel: () => {
      bA(null), Z(!1), B(!1)
    },
    hideEscToCancel: !0,
    skipExitHandling: !0
  }), E0.createElement(T, {
    marginLeft: 1
  }, E0.createElement(C, {
    dimColor: !0,
    italic: !0
  }, E0.createElement(vQ, null, E0.createElement(F0, {
    shortcut: "Enter",
    action: "select"
  }), E0.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "cancel"
  }))))) : TA === 1 ? E0.createElement(E0.Fragment, null, E0.createElement(jzA, {
    initial: AA,
    onSelect: (t, BA) => {
      ZA(t), bA(null), B(!1)
    },
    onCancel: () => {
      bA(null), B(!1)
    }
  }), E0.createElement(C, {
    dimColor: !0
  }, E0.createElement(vQ, null, E0.createElement(F0, {
    shortcut: "Enter",
    action: "confirm"
  }), E0.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "cancel"
  })))) : TA === 2 ? E0.createElement(E0.Fragment, null, E0.createElement(LE1, {
    onDone: () => {
      bA(null), B(!1), G(!1)
    },
    externalIncludes: qyA()
  }), E0.createElement(C, {
    dimColor: !0
  }, E0.createElement(vQ, null, E0.createElement(F0, {
    shortcut: "Enter",
    action: "confirm"
  }), E0.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "disable external includes"
  })))) : TA === 3 ? E0.createElement(E0.Fragment, null, E0.createElement(OE1, {
    initialStyle: E,
    onComplete: (t) => {
      z(t ?? vF), bA(null), B(!1), pB("localSettings", {
        outputStyle: t
      }), l("tengu_output_style_changed", {
        style: t ?? vF,
        source: "config_panel",
        settings_source: "localSettings"
      })
    },
    onCancel: () => {
      bA(null), B(!1)
    }
  }), E0.createElement(C, {
    dimColor: !0
  }, E0.createElement(vQ, null, E0.createElement(F0, {
    shortcut: "Enter",
    action: "confirm"
  }), E0.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "cancel"
  })))) : TA === 5 ? E0.createElement(E0.Fragment, null, E0.createElement(BB9, {
    initialLanguage: O,
    onComplete: (t) => {
      L(t), bA(null), B(!1), pB("userSettings", {
        language: t
      }), l("tengu_language_changed", {
        language: t ?? "default",
        source: "config_panel"
      })
    },
    onCancel: () => {
      bA(null), B(!1)
    }
  }), E0.createElement(C, {
    dimColor: !0
  }, E0.createElement(vQ, null, E0.createElement(F0, {
    shortcut: "Enter",
    action: "confirm"
  }), E0.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "cancel"
  })))) : TA === 4 ? E0.createElement(eQ9, {
    currentVersion: {
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.1.7",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
      BUILD_TIME: "2026-01-13T22:55:21Z"
    }.VERSION,
    onChoice: (t) => {
      if (bA(null), B(!1), t === "cancel") return;
      let BA = {
        autoUpdatesChannel: "stable"
      };
      if (t === "stay") BA.minimumVersion = {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.7",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-01-13T22:55:21Z"
      }.VERSION;
      pB("userSettings", BA), F((DA) => ({
        ...DA,
        ...BA
      })), l("tengu_autoupdate_channel_changed", {
        channel: "stable",
        minimum_version_set: t === "stay"
      })
    }
  }) : E0.createElement(T, {
    flexDirection: "column",
    marginY: 1,
    gap: 1
  }, E0.createElement(C, null, "Configure Claude Code preferences"), E0.createElement(Ap, {
    query: x,
    isFocused: S,
    isTerminalFocused: f,
    placeholder: "Search settings..."
  }), E0.createElement(T, {
    flexDirection: "column"
  }, _A.length === 0 ? E0.createElement(C, {
    dimColor: !0,
    italic: !0
  }, 'No settings match "', x, '"') : _A.map((t, BA) => {
    let DA = BA === _;
    return E0.createElement(T, {
      key: t.id
    }, E0.createElement(T, {
      width: 44
    }, E0.createElement(C, {
      color: DA ? "suggestion" : void 0
    }, DA ? tA.pointer : " ", " ", t.label)), E0.createElement(T, {
      key: DA ? "selected" : "unselected"
    }, t.type === "boolean" ? E0.createElement(C, {
      color: DA ? "suggestion" : void 0
    }, t.value.toString()) : t.id === "theme" ? E0.createElement(C, {
      color: DA ? "suggestion" : void 0
    }, (() => {
      return {
        dark: "Dark mode",
        light: "Light mode",
        "dark-daltonized": "Dark mode (colorblind-friendly)",
        "light-daltonized": "Light mode (colorblind-friendly)",
        "dark-ansi": "Dark mode (ANSI colors only)",
        "light-ansi": "Light mode (ANSI colors only)"
      } [t.value.toString()] || t.value.toString()
    })()) : t.id === "notifChannel" ? E0.createElement(C, {
      color: DA ? "suggestion" : void 0
    }, (() => {
      switch (t.value.toString()) {
        case "auto":
          return "Auto";
        case "iterm2":
          return E0.createElement(E0.Fragment, null, "iTerm2 ", E0.createElement(C, {
            dimColor: !0
          }, "(OSC 9)"));
        case "terminal_bell":
          return E0.createElement(E0.Fragment, null, "Terminal Bell ", E0.createElement(C, {
            dimColor: !0
          }, "(\\a)"));
        case "kitty":
          return E0.createElement(E0.Fragment, null, "Kitty ", E0.createElement(C, {
            dimColor: !0
          }, "(OSC 99)"));
        case "ghostty":
          return E0.createElement(E0.Fragment, null, "Ghostty ", E0.createElement(C, {
            dimColor: !0
          }, "(OSC 777)"));
        case "iterm2_with_bell":
          return "iTerm2 w/ Bell";
        case "notifications_disabled":
          return "Disabled";
        default:
          return t.value.toString()
      }
    })()) : t.id === "defaultPermissionMode" ? E0.createElement(C, {
      color: DA ? "suggestion" : void 0
    }, su(t.value)) : t.id === "autoUpdatesChannel" && HA ? E0.createElement(T, {
      flexDirection: "column"
    }, E0.createElement(C, {
      color: DA ? "suggestion" : void 0
    }, "disabled"), E0.createElement(C, {
      dimColor: !0
    }, "(", HA, ")")) : E0.createElement(C, {
      color: DA ? "suggestion" : void 0
    }, t.value.toString())))
  })), S ? E0.createElement(C, {
    dimColor: !0
  }, E0.createElement(vQ, null, E0.createElement(C, null, "Type to filter"), E0.createElement(F0, {
    shortcut: "Enter/↓",
    action: "select"
  }), E0.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "clear"
  }))) : E0.createElement(C, {
    dimColor: !0
  }, E0.createElement(vQ, null, E0.createElement(F0, {
    shortcut: "Enter/Space",
    action: "change"
  }), E0.createElement(C, null, "Type or / to search"), E0.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "cancel"
  })))))
}
// @from(Ln 405747, Col 4)
E0
// @from(Ln 405747, Col 8)
oO
// @from(Ln 405748, Col 4)
YB9 = w(() => {
  fA();
  c6();
  B2();
  GQ();
  gOA();
  GQ();
  Z3();
  mL();
  v1();
  Z0();
  NE1();
  hB();
  wE1();
  l2();
  RR0();
  AB9();
  _R0();
  GB9();
  nz();
  e9();
  I3();
  K6();
  CzA();
  TX();
  GB();
  Cf();
  fQ();
  vhA();
  w6();
  E0 = c(QA(), 1), oO = c(QA(), 1)
})
// @from(Ln 405780, Col 0)
async function TR0() {
  if (!qB()) return {};
  let A = g4();
  if (A && yg(A.expiresAt)) return null;
  let Q = CJ();
  if (Q.error) throw Error(`Auth error: ${Q.error}`);
  let B = {
      "Content-Type": "application/json",
      "User-Agent": PD(),
      ...Q.headers
    },
    G = `${v9().BASE_API_URL}/api/oauth/usage`;
  return (await xQ.get(G, {
    headers: B,
    timeout: 5000
  })).data
}
// @from(Ln 405797, Col 4)
PR0 = w(() => {
  j5();
  qz();
  JX();
  Q2();
  JL()
})
// @from(Ln 405805, Col 0)
function IgA({
  ratio: A,
  width: Q,
  fillColor: B,
  emptyColor: G
}) {
  let Z = Math.min(1, Math.max(0, A)),
    Y = Math.floor(Z * Q),
    J = [XgA[XgA.length - 1].repeat(Y)];
  if (Y < Q) {
    let X = Z * Q - Y,
      I = Math.floor(X * XgA.length);
    J.push(XgA[I]);
    let D = Q - Y - 1;
    if (D > 0) J.push(XgA[0].repeat(D))
  }
  return JB9.default.createElement(C, {
    color: B,
    backgroundColor: G
  }, J.join(""))
}
// @from(Ln 405826, Col 4)
JB9
// @from(Ln 405826, Col 9)
XgA
// @from(Ln 405827, Col 4)
SR0 = w(() => {
  fA();
  JB9 = c(QA(), 1), XgA = [" ", "▏", "▎", "▍", "▌", "▋", "▊", "▉", "█"]
})
// @from(Ln 405832, Col 0)
function XB9({
  title: A,
  limit: Q,
  maxWidth: B,
  showTimeInReset: G = !0,
  extraSubtext: Z
}) {
  let {
    utilization: Y,
    resets_at: J
  } = Q;
  if (Y === null) return null;
  let X = `${Math.floor(Y)}% used`,
    I;
  if (J) I = `Resets ${atQ(J,!0,G)}`;
  if (Z)
    if (I) I = `${Z} · ${I}`;
    else I = Z;
  let D = 50;
  if (B >= D + 12) return rB.createElement(T, {
    flexDirection: "column"
  }, rB.createElement(C, {
    bold: !0
  }, A), rB.createElement(T, {
    flexDirection: "row",
    gap: 1
  }, rB.createElement(IgA, {
    ratio: Y / 100,
    width: D,
    fillColor: "rate_limit_fill",
    emptyColor: "rate_limit_empty"
  }), rB.createElement(C, null, X)), I && rB.createElement(C, {
    dimColor: !0
  }, I));
  else return rB.createElement(T, {
    flexDirection: "column"
  }, rB.createElement(C, null, rB.createElement(C, {
    bold: !0
  }, A), I && rB.createElement(rB.Fragment, null, rB.createElement(C, null, " "), rB.createElement(C, {
    dimColor: !0
  }, "· ", I))), rB.createElement(IgA, {
    ratio: Y / 100,
    width: B,
    fillColor: "rate_limit_fill",
    emptyColor: "rate_limit_empty"
  }), rB.createElement(C, null, X))
}
// @from(Ln 405880, Col 0)
function IB9() {
  let [A, Q] = TzA.useState(null), [B, G] = TzA.useState(null), [Z, Y] = TzA.useState(!0), {
    columns: J
  } = ZB(), X = J - 2, I = Math.min(X, 80), D = rB.useCallback(async () => {
    Y(!0), G(null);
    try {
      let K = await TR0();
      Q(K)
    } catch (K) {
      e(K);
      let V = K,
        F = V.response?.data ? eA(V.response.data) : void 0;
      G(F ? `Failed to load usage data: ${F}` : "Failed to load usage data")
    } finally {
      Y(!1)
    }
  }, []);
  if (TzA.useEffect(() => {
      D()
    }, [D]), J0((K) => {
      if (K === "r" && B && !Z) D()
    }), B) return rB.createElement(T, {
    flexDirection: "column",
    marginTop: 1,
    gap: 1
  }, rB.createElement(C, {
    color: "error"
  }, "Error: ", B), rB.createElement(C, {
    dimColor: !0
  }, rB.createElement(vQ, null, rB.createElement(F0, {
    shortcut: "r",
    action: "retry"
  }), rB.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "cancel"
  }))));
  if (!A) return rB.createElement(T, {
    flexDirection: "column",
    marginTop: 1,
    gap: 1
  }, rB.createElement(C, {
    dimColor: !0
  }, "Loading usage data…"), rB.createElement(C, {
    dimColor: !0
  }, rB.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "cancel"
  })));
  let W = [{
    title: "Current session",
    limit: A.five_hour
  }, {
    title: "Current week (all models)",
    limit: A.seven_day
  }, {
    title: "Current week (Sonnet only)",
    limit: A.seven_day_sonnet
  }];
  return rB.createElement(T, {
    flexDirection: "column",
    marginTop: 1,
    gap: 1,
    width: "100%"
  }, W.some(({
    limit: K
  }) => K) || rB.createElement(C, {
    dimColor: !0
  }, "/usage is only available for subscription plans."), W.map(({
    title: K,
    limit: V
  }) => V && rB.createElement(XB9, {
    key: K,
    title: K,
    limit: V,
    maxWidth: I
  })), A.extra_usage && rB.createElement(BJ7, {
    extraUsage: A.extra_usage,
    maxWidth: I
  }), rB.createElement(C, {
    dimColor: !0
  }, rB.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "cancel"
  })))
}
// @from(Ln 405972, Col 0)
function BJ7({
  extraUsage: A,
  maxWidth: Q
}) {
  let B = N6();
  if (!(B === "pro" || B === "max")) return !1;
  if (!A.is_enabled) {
    if (Wc.isEnabled()) return rB.createElement(T, {
      flexDirection: "column"
    }, rB.createElement(C, {
      bold: !0
    }, xR0), rB.createElement(C, {
      dimColor: !0
    }, "Extra usage not enabled • /extra-usage to enable"));
    return null
  }
  if (A.monthly_limit === null) return rB.createElement(T, {
    flexDirection: "column"
  }, rB.createElement(C, {
    bold: !0
  }, xR0), rB.createElement(C, {
    dimColor: !0
  }, "Unlimited"));
  if (typeof A.used_credits !== "number" || typeof A.utilization !== "number") return null;
  let Z = wOA(A.used_credits / 100, 2),
    Y = wOA(A.monthly_limit / 100, 2),
    J = new Date,
    X = new Date(J.getFullYear(), J.getMonth() + 1, 1);
  return rB.createElement(XB9, {
    title: xR0,
    limit: {
      utilization: A.utilization,
      resets_at: X.toISOString()
    },
    showTimeInReset: !1,
    extraSubtext: `${Z} / ${Y} spent`,
    maxWidth: Q
  })
}
// @from(Ln 406011, Col 4)
rB
// @from(Ln 406011, Col 8)
TzA
// @from(Ln 406011, Col 13)
xR0 = "Extra usage"
// @from(Ln 406012, Col 4)
DB9 = w(() => {
  fA();
  P4();
  PR0();
  v1();
  SR0();
  e9();
  I3();
  K6();
  ykA();
  LR();
  Q2();
  A0();
  rB = c(QA(), 1), TzA = c(QA(), 1)
})
// @from(Ln 406028, Col 0)
function SzA({
  onClose: A,
  context: Q,
  defaultTab: B
}) {
  let [G, Z] = PzA.useState(!1), [Y, J] = PzA.useState(!1), [X, I] = PzA.useState(!1), D = PzA.useCallback(() => {
    if (G) return;
    A("Status dialog dismissed", {
      display: "system"
    })
  }, [G, A]);
  return H2("confirm:no", D, {
    context: "Settings"
  }), DW.createElement(T, {
    flexDirection: "column"
  }, DW.createElement(K8, {
    dividerColor: Y ? "warning" : "permission",
    dividerDimColor: !Y
  }), DW.createElement(T, {
    marginX: X ? 0 : 1
  }, DW.createElement(Nj, {
    title: "Settings:",
    color: "permission",
    defaultTab: B,
    hidden: G
  }, [DW.createElement(kX, {
    key: "status",
    title: "Status"
  }, DW.createElement(rQ9, {
    context: Q
  })), DW.createElement(kX, {
    key: "config",
    title: "Config"
  }, DW.createElement(ZB9, {
    context: Q,
    onClose: A,
    setTabsHidden: Z,
    setIsWarning: J,
    setHideMargin: I
  })), DW.createElement(kX, {
    key: "usage",
    title: "Usage"
  }, DW.createElement(IB9, null))])))
}
// @from(Ln 406072, Col 4)
DW
// @from(Ln 406072, Col 8)
PzA
// @from(Ln 406073, Col 4)
ME1 = w(() => {
  fA();
  c6();
  lD();
  v3A();
  sQ9();
  YB9();
  DB9();
  DW = c(QA(), 1), PzA = c(QA(), 1)
})
// @from(Ln 406083, Col 4)
yR0
// @from(Ln 406083, Col 9)
GJ7
// @from(Ln 406083, Col 14)
WB9
// @from(Ln 406084, Col 4)
KB9 = w(() => {
  ME1();
  yR0 = c(QA(), 1), GJ7 = {
    aliases: ["settings"],
    type: "local-jsx",
    name: "config",
    description: "Open config panel",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A, Q) {
      return yR0.createElement(SzA, {
        onClose: A,
        context: Q,
        defaultTab: "Config"
      })
    },
    userFacingName() {
      return "config"
    }
  }, WB9 = GJ7
})
// @from(Ln 406106, Col 0)
function ZJ7(A) {
  return `${Math.round(A/1000)}k`
}
// @from(Ln 406110, Col 0)
function DgA(A) {
  return A < 1000 ? `${A}` : `${(A/1000).toFixed(1)}k`
}
// @from(Ln 406114, Col 0)
function VB9(A) {
  let Q = new Map;
  for (let G of A) {
    let Z = E01(G.source),
      Y = Q.get(Z) || [];
    Y.push(G), Q.set(Z, Y)
  }
  for (let [G, Z] of Q.entries()) Q.set(G, Z.sort((Y, J) => J.tokens - Y.tokens));
  let B = new Map;
  for (let G of YJ7) {
    let Z = Q.get(G);
    if (Z) B.set(G, Z)
  }
  return B
}
// @from(Ln 406130, Col 0)
function FB9({
  data: A
}) {
  let {
    categories: Q,
    totalTokens: B,
    rawMaxTokens: G,
    percentage: Z,
    gridRows: Y,
    model: J,
    memoryFiles: X,
    mcpTools: I,
    agents: D,
    skills: W,
    messageBreakdown: K
  } = A, V = Q.filter((E) => E.tokens > 0 && E.name !== "Free space" && E.name !== RE1 && !E.isDeferred), F = Q.some((E) => E.isDeferred && E.name.includes("MCP")), H = Q.find((E) => E.name === RE1);
  return BQ.createElement(T, {
    flexDirection: "column",
    paddingLeft: 1
  }, BQ.createElement(C, {
    bold: !0
  }, "Context Usage"), BQ.createElement(T, {
    flexDirection: "row",
    gap: 2
  }, BQ.createElement(T, {
    flexDirection: "column",
    flexShrink: 0
  }, Y.map((E, z) => BQ.createElement(T, {
    key: z,
    flexDirection: "row",
    marginLeft: -1
  }, E.map(($, O) => {
    if ($.categoryName === "Free space") return BQ.createElement(C, {
      key: O,
      dimColor: !0
    }, "⛶ ");
    if ($.categoryName === RE1) return BQ.createElement(C, {
      key: O,
      color: $.color
    }, "⛝ ");
    return BQ.createElement(C, {
      key: O,
      color: $.color
    }, $.squareFullness >= 0.7 ? "⛁ " : "⛀ ")
  })))), BQ.createElement(T, {
    flexDirection: "column",
    gap: 0,
    flexShrink: 0
  }, BQ.createElement(C, {
    dimColor: !0
  }, J, " · ", Math.round(B / 1000), "k/", Math.round(G / 1000), "k tokens (", Z, "%)"), V.map((E, z) => {
    let $ = E.tokens < 1000 ? `${E.tokens}` : `${(E.tokens/1000).toFixed(1)}k`,
      O = E.isDeferred ? "N/A" : `${(E.tokens/G*100).toFixed(1)}%`,
      L = E.name === RE1,
      M = E.name,
      _ = E.isDeferred ? " " : L ? "⛝" : "⛁";
    return BQ.createElement(T, {
      key: z
    }, BQ.createElement(C, {
      color: E.color
    }, _), BQ.createElement(C, null, " ", M, ": "), BQ.createElement(C, {
      dimColor: !0
    }, $, " tokens (", O, ")"))
  }), (Q.find((E) => E.name === "Free space")?.tokens ?? 0) > 0 && BQ.createElement(T, null, BQ.createElement(C, {
    dimColor: !0
  }, "⛶"), BQ.createElement(C, null, " Free space: "), BQ.createElement(C, {
    dimColor: !0
  }, ZJ7(Q.find((E) => E.name === "Free space")?.tokens || 0), " ", "(", ((Q.find((E) => E.name === "Free space")?.tokens || 0) / G * 100).toFixed(1), "%)")), H && H.tokens > 0 && BQ.createElement(T, null, BQ.createElement(C, {
    color: H.color
  }, "⛝"), BQ.createElement(C, {
    dimColor: !0
  }, " ", H.name, ": "), BQ.createElement(C, {
    dimColor: !0
  }, H.tokens < 1000 ? `${H.tokens}` : `${(H.tokens/1000).toFixed(1)}k`, " ", "tokens (", (H.tokens / G * 100).toFixed(1), "%)")))), BQ.createElement(T, {
    flexDirection: "column",
    marginLeft: -1
  }, I.length > 0 && BQ.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, BQ.createElement(T, null, BQ.createElement(C, {
    bold: !0
  }, "MCP tools"), BQ.createElement(C, {
    dimColor: !0
  }, " ", "· /mcp", F ? " (loaded on-demand)" : "")), I.some((E) => E.isLoaded) && BQ.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, BQ.createElement(C, {
    dimColor: !0
  }, "Loaded"), I.filter((E) => E.isLoaded).map((E, z) => BQ.createElement(T, {
    key: z
  }, BQ.createElement(C, null, "└ ", E.name, ": "), BQ.createElement(C, {
    dimColor: !0
  }, DgA(E.tokens), " tokens")))), F && I.some((E) => !E.isLoaded) && BQ.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, BQ.createElement(C, {
    dimColor: !0
  }, "Available"), I.filter((E) => !E.isLoaded).map((E, z) => BQ.createElement(T, {
    key: z
  }, BQ.createElement(C, {
    dimColor: !0
  }, "└ ", E.name)))), !F && I.map((E, z) => BQ.createElement(T, {
    key: z
  }, BQ.createElement(C, null, "└ ", E.name, ": "), BQ.createElement(C, {
    dimColor: !0
  }, DgA(E.tokens), " tokens")))), D.length > 0 && BQ.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, BQ.createElement(T, null, BQ.createElement(C, {
    bold: !0
  }, "Custom agents"), BQ.createElement(C, {
    dimColor: !0
  }, " · /agents")), Array.from(VB9(D).entries()).map(([E, z]) => BQ.createElement(T, {
    key: E,
    flexDirection: "column",
    marginTop: 1
  }, BQ.createElement(C, {
    dimColor: !0
  }, E), z.map(($, O) => BQ.createElement(T, {
    key: O
  }, BQ.createElement(C, null, "└ ", $.agentType, ": "), BQ.createElement(C, {
    dimColor: !0
  }, DgA($.tokens), " tokens")))))), X.length > 0 && BQ.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, BQ.createElement(T, null, BQ.createElement(C, {
    bold: !0
  }, "Memory files"), BQ.createElement(C, {
    dimColor: !0
  }, " · /memory")), X.map((E, z) => BQ.createElement(T, {
    key: z
  }, BQ.createElement(C, null, "└ ", k6(E.path), ": "), BQ.createElement(C, {
    dimColor: !0
  }, DgA(E.tokens), " tokens")))), W && W.tokens > 0 && BQ.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, BQ.createElement(T, null, BQ.createElement(C, {
    bold: !0
  }, "Skills"), BQ.createElement(C, {
    dimColor: !0
  }, " · /skills")), Array.from(VB9(W.skillFrontmatter).entries()).map(([E, z]) => BQ.createElement(T, {
    key: E,
    flexDirection: "column",
    marginTop: 1
  }, BQ.createElement(C, {
    dimColor: !0
  }, E), z.map(($, O) => BQ.createElement(T, {
    key: O
  }, BQ.createElement(C, null, "└ ", $.name, ": "), BQ.createElement(C, {
    dimColor: !0
  }, DgA($.tokens), " tokens")))))), K && !1))
}
// @from(Ln 406282, Col 4)
BQ
// @from(Ln 406282, Col 8)
RE1 = "Autocompact buffer"
// @from(Ln 406283, Col 2)
YJ7
// @from(Ln 406284, Col 4)
HB9 = w(() => {
  fA();
  YI();
  y9();
  BQ = c(QA(), 1);
  YJ7 = ["Project", "User", "Managed", "Plugin", "Built-in"]
})
// @from(Ln 406295, Col 0)
function XJ7({
  children: A
}) {
  let {
    exit: Q
  } = JjA();
  return p3A.useLayoutEffect(() => {
    let B = setTimeout(Q, 0);
    return () => clearTimeout(B)
  }, [Q]), Lj.createElement(Lj.Fragment, null, A)
}
// @from(Ln 406307, Col 0)
function EB9(A) {
  return new Promise(async (Q) => {
    let B = "",
      G = new JJ7;
    G.on("data", (Y) => {
      B += Y.toString()
    }), await (await Y5(Lj.createElement(XJ7, null, A), {
      stdout: G
    })).waitUntilExit(), await Q(B)
  })
}
// @from(Ln 406318, Col 0)
async function xzA(A) {
  let Q = await EB9(A);
  return jZ(Q)
}
// @from(Ln 406323, Col 0)
function yzA({
  children: A,
  onComplete: Q
}) {
  let B = p3A.useContext(AN),
    G = p3A.useRef(!1);
  if (p3A.useLayoutEffect(() => {
      if (G.current) return;
      G.current = !0, EB9(A).then((Z) => {
        Q(Z)
      })
    }, [A, Q]), B) return Lj.createElement(Lj.Fragment, null, A);
  return null
}
// @from(Ln 406337, Col 4)
Lj
// @from(Ln 406337, Col 8)
p3A
// @from(Ln 406338, Col 4)
WgA = w(() => {
  fA();
  ba();
  rR();
  Lj = c(QA(), 1), p3A = c(QA(), 1)
})
// @from(Ln 406345, Col 0)
function Ip(A) {
  return A < 1000 ? `${A}` : `${(A/1000).toFixed(1)}k`
}
// @from(Ln 406349, Col 0)
function IJ7(A) {
  let {
    categories: Q,
    totalTokens: B,
    rawMaxTokens: G,
    percentage: Z,
    model: Y,
    memoryFiles: J,
    mcpTools: X,
    agents: I,
    skills: D,
    messageBreakdown: W
  } = A, K = `## Context Usage

`;
  K += `**Model:** ${Y}  
`, K += `**Tokens:** ${Ip(B)} / ${Ip(G)} (${Z}%)

`;
  let V = Q.filter((F) => F.tokens > 0 && F.name !== "Free space" && F.name !== "Autocompact buffer");
  if (V.length > 0) {
    K += `### Categories

`, K += `| Category | Tokens | Percentage |
`, K += `|----------|--------|------------|
`;
    for (let E of V) {
      let z = (E.tokens / G * 100).toFixed(1);
      K += `| ${E.name} | ${Ip(E.tokens)} | ${z}% |
`
    }
    let F = Q.find((E) => E.name === "Free space");
    if (F && F.tokens > 0) {
      let E = (F.tokens / G * 100).toFixed(1);
      K += `| Free space | ${Ip(F.tokens)} | ${E}% |
`
    }
    let H = Q.find((E) => E.name === "Autocompact buffer");
    if (H && H.tokens > 0) {
      let E = (H.tokens / G * 100).toFixed(1);
      K += `| Autocompact buffer | ${Ip(H.tokens)} | ${E}% |
`
    }
    K += `
`
  }
  if (X.length > 0) {
    K += `### MCP Tools

`, K += `| Tool | Server | Tokens |
`, K += `|------|--------|--------|
`;
    for (let F of X) K += `| ${F.name} | ${F.serverName} | ${Ip(F.tokens)} |
`;
    K += `
`
  }
  if (I.length > 0) {
    K += `### Custom Agents

`, K += `| Agent Type | Source | Tokens |
`, K += `|------------|--------|--------|
`;
    for (let F of I) {
      let H;
      switch (F.source) {
        case "projectSettings":
          H = "Project";
          break;
        case "userSettings":
          H = "User";
          break;
        case "localSettings":
          H = "Local";
          break;
        case "flagSettings":
          H = "Flag";
          break;
        case "policySettings":
          H = "Policy";
          break;
        case "plugin":
          H = "Plugin";
          break;
        case "built-in":
          H = "Built-in";
          break;
        default:
          H = String(F.source)
      }
      K += `| ${F.agentType} | ${H} | ${Ip(F.tokens)} |
`
    }
    K += `
`
  }
  if (J.length > 0) {
    K += `### Memory Files

`, K += `| Type | Path | Tokens |
`, K += `|------|------|--------|
`;
    for (let F of J) K += `| ${F.type} | ${F.path} | ${Ip(F.tokens)} |
`;
    K += `
`
  }
  if (D && D.tokens > 0 && D.skillFrontmatter.length > 0) {
    K += `### Skills

`, K += `| Skill | Source | Tokens |
`, K += `|-------|--------|--------|
`;
    for (let F of D.skillFrontmatter) K += `| ${F.name} | ${E01(F.source)} | ${Ip(F.tokens)} |
`;
    K += `
`
  }
  return K
}
// @from(Ln 406469, Col 4)
KgA
// @from(Ln 406469, Col 9)
zB9
// @from(Ln 406469, Col 14)
$B9
// @from(Ln 406470, Col 4)
CB9 = w(() => {
  HB9();
  wH1();
  WgA();
  N3A();
  tQ();
  JZ();
  C0();
  YI();
  KgA = c(QA(), 1), zB9 = {
    name: "context",
    description: "Visualize current context usage as a colored grid",
    isEnabled: () => !p2(),
    isHidden: !1,
    type: "local-jsx",
    userFacingName() {
      return this.name
    },
    async call(A, Q) {
      let {
        messages: B,
        getAppState: G,
        options: {
          mainLoopModel: Z,
          tools: Y
        }
      } = Q;
      T9("context");
      let J = _x(B),
        {
          messages: X
        } = await lc(J),
        I = process.stdout.columns || 80,
        D = await G(),
        W = await oO0(X, Z, async () => D.toolPermissionContext, Y, D.agentDefinitions, I, Q);
      return KgA.createElement(yzA, {
        onComplete: A
      }, KgA.createElement(FB9, {
        data: W
      }))
    }
  }, $B9 = {
    type: "local",
    name: "context",
    supportsNonInteractive: !0,
    description: "Show current context usage",
    get isHidden() {
      return !p2()
    },
    isEnabled() {
      return p2()
    },
    userFacingName() {
      return "context"
    },
    async call(A, Q) {
      let {
        messages: B,
        getAppState: G,
        options: {
          mainLoopModel: Z,
          tools: Y,
          agentDefinitions: J
        }
      } = Q, X = _x(B), {
        messages: I
      } = await lc(X), D = await G(), W = await oO0(I, Z, async () => D.toolPermissionContext, Y, J, void 0, Q);
      return {
        type: "text",
        value: IJ7(W)
      }
    }
  }
})
// @from(Ln 406544, Col 4)
DJ7
// @from(Ln 406544, Col 9)
UB9
// @from(Ln 406545, Col 4)
qB9 = w(() => {
  LR();
  Q2();
  IS();
  JZ();
  DJ7 = {
    type: "local",
    name: "cost",
    description: "Show the total cost and duration of the current session",
    isEnabled: () => !0,
    get isHidden() {
      return qB()
    },
    supportsNonInteractive: !0,
    async call() {
      if (T9("cost"), qB()) {
        let A;
        if (__.isUsingOverage) A = "You are currently using your overages to power your Claude Code usage. We will automatically switch you back to your subscription rate limits when they reset";
        else A = "You are currently using your subscription to power your Claude Code usage";
        return {
          type: "text",
          value: A
        }
      }
      return {
        type: "text",
        value: xp1()
      }
    },
    userFacingName() {
      return "cost"
    }
  }, UB9 = DJ7
})
// @from(Ln 406579, Col 4)
NB9 = () => {}
// @from(Ln 406581, Col 0)
function LB9({
  categories: A,
  stats: Q,
  onSelect: B
}) {
  let [G, Z] = wB9.useState(0);
  return J0((Y, J) => {
    if (J.upArrow || Y === "k") Z((X) => X > 0 ? X - 1 : A.length - 1);
    else if (J.downArrow || Y === "j") Z((X) => X < A.length - 1 ? X + 1 : 0);
    else if (J.return) {
      let X = A[G];
      if (X) B(X.id)
    } else if (Y >= "1" && Y <= "9") {
      let X = parseInt(Y, 10) - 1;
      if (X < A.length) {
        Z(X);
        let I = A[X];
        if (I) B(I.id)
      }
    }
  }), De.default.createElement(T, {
    flexDirection: "column"
  }, A.map((Y, J) => {
    let X = J === G,
      I = Q?.[Y.id],
      D = I?.explored ?? 0,
      W = I?.total ?? 0,
      K, V;
    if (D === 0) K = tA.circle, V = "inactive";
    else if (D === W) K = tA.tick, V = "success";
    else K = tA.circleFilled, V = "warning";
    let F = X ? "suggestion" : void 0;
    return De.default.createElement(T, {
      key: Y.id,
      gap: 1
    }, De.default.createElement(C, {
      color: F
    }, X ? tA.pointer : " "), De.default.createElement(C, {
      color: V
    }, K), De.default.createElement(T, {
      width: 24
    }, De.default.createElement(C, {
      color: F,
      bold: X
    }, Y.name)), De.default.createElement(C, {
      dimColor: !0
    }, "[", D, "/", W, " ", D === W ? "completed" : D === 0 ? "unexplored" : "explored", "]"))
  }))
}
// @from(Ln 406630, Col 4)
De
// @from(Ln 406630, Col 8)
wB9
// @from(Ln 406631, Col 4)
OB9 = w(() => {
  fA();
  B2();
  De = c(QA(), 1), wB9 = c(QA(), 1)
})
// @from(Ln 406637, Col 0)
function MB9({
  feature: A,
  isUsed: Q,
  isFocused: B
}) {
  let G = Q ? tA.tick : tA.circle,
    Z = Q ? "success" : "inactive",
    Y = B ? "suggestion" : void 0;
  return Dp.default.createElement(T, {
    flexDirection: "column"
  }, Dp.default.createElement(T, {
    gap: 1
  }, Dp.default.createElement(C, {
    color: Y
  }, B ? tA.pointer : " "), Dp.default.createElement(C, {
    color: Z
  }, G), Dp.default.createElement(C, {
    color: Y,
    bold: B
  }, A.name)), B && Dp.default.createElement(T, {
    flexDirection: "column",
    marginLeft: 4
  }, Dp.default.createElement(C, {
    dimColor: !0
  }, A.description), !Q && A.tryItPrompt && Dp.default.createElement(C, {
    color: "warning",
    dimColor: !0
  }, "Try it: ", A.tryItPrompt)))
}
// @from(Ln 406666, Col 4)
Dp
// @from(Ln 406667, Col 4)
RB9 = w(() => {
  fA();
  B2();
  Dp = c(QA(), 1)
})
// @from(Ln 406673, Col 0)
function _B9({
  categoryId: A,
  onBack: Q,
  onClose: B
}) {
  let [G, Z] = l3A.useState(0), [Y, J] = l3A.useState({}), X = MQ(), I = iOB(A), D = l3A.useMemo(() => lOB(A), [A]);
  if (l3A.useEffect(() => {
      Promise.all(D.map(async (W) => [W.id, await W.hasBeenUsed()])).then((W) => J(Object.fromEntries(W)))
    }, [D]), H2("confirm:no", B, {
      context: "Confirmation"
    }), J0((W, K) => {
      if (K.backspace || K.delete) Q();
      else if (K.upArrow || W === "k") Z((V) => V > 0 ? V - 1 : D.length - 1);
      else if (K.downArrow || W === "j") Z((V) => V < D.length - 1 ? V + 1 : 0)
    }), !I) return nF.default.createElement(C, {
    color: "error"
  }, "Category not found");
  return nF.default.createElement(T, {
    flexDirection: "column",
    paddingBottom: 1
  }, nF.default.createElement(K8, {
    dividerColor: "suggestion",
    dividerDimColor: !0
  }), nF.default.createElement(T, {
    flexDirection: "column",
    paddingX: 1,
    gap: 1
  }, nF.default.createElement(T, {
    flexDirection: "column"
  }, nF.default.createElement(C, {
    bold: !0,
    color: "suggestion"
  }, I.name), nF.default.createElement(C, {
    dimColor: !0
  }, I.description)), nF.default.createElement(T, {
    flexDirection: "column"
  }, D.map((W, K) => nF.default.createElement(MB9, {
    key: W.id,
    feature: W,
    isUsed: Y[W.id] ?? !1,
    isFocused: K === G
  })))), nF.default.createElement(T, {
    paddingX: 1
  }, nF.default.createElement(C, {
    dimColor: !0,
    italic: !0
  }, X.pending ? nF.default.createElement(nF.default.Fragment, null, "Press ", X.keyName, " again to exit") : nF.default.createElement(vQ, null, nF.default.createElement(F0, {
    shortcut: "↑/↓",
    action: "navigate"
  }), nF.default.createElement(F0, {
    shortcut: "Backspace",
    action: "back"
  }), nF.default.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "close"
  })))))
}
// @from(Ln 406732, Col 4)
nF
// @from(Ln 406732, Col 8)
l3A
// @from(Ln 406733, Col 4)
jB9 = w(() => {
  fA();
  c6();
  E9();
  lD();
  e9();
  I3();
  K6();
  RB9();
  n21();
  nF = c(QA(), 1), l3A = c(QA(), 1)
})
// @from(Ln 406746, Col 0)
function TB9({
  onClose: A
}) {
  let [Q, B] = wY.useState(null), [G, Z] = wY.useState(null), Y = MQ();
  if (wY.useEffect(() => {
      aOB().then(Z)
    }, [Q]), H2("confirm:no", A, {
      context: "Confirmation",
      isActive: !Q
    }), Q) return wY.default.createElement(_B9, {
    categoryId: Q,
    onBack: () => B(null),
    onClose: A
  });
  let J = G ? G.explored / G.total : 0,
    X = G ? Math.round(G.explored / G.total * 100) : 0;
  return wY.default.createElement(T, {
    flexDirection: "column",
    paddingBottom: 1
  }, wY.default.createElement(K8, {
    dividerColor: "suggestion",
    dividerDimColor: !0
  }), wY.default.createElement(T, {
    flexDirection: "column",
    paddingX: 1,
    gap: 1
  }, wY.default.createElement(T, {
    flexDirection: "column"
  }, wY.default.createElement(C, {
    bold: !0,
    color: "suggestion"
  }, "Discover Claude Code"), wY.default.createElement(C, {
    dimColor: !0
  }, "Explore features and track your progress")), G && wY.default.createElement(T, {
    flexDirection: "column",
    gap: 0
  }, wY.default.createElement(C, null, "You've explored", " ", wY.default.createElement(C, {
    bold: !0,
    color: "success"
  }, G.explored), " ", "of ", G.total, " features (", X, "%)"), wY.default.createElement(T, null, wY.default.createElement(IgA, {
    ratio: J,
    width: 40,
    fillColor: "success",
    emptyColor: "inactive"
  }))), wY.default.createElement(LB9, {
    categories: l21,
    stats: G?.byCategory ?? null,
    onSelect: B
  })), wY.default.createElement(T, {
    paddingX: 1
  }, wY.default.createElement(C, {
    dimColor: !0,
    italic: !0
  }, Y.pending ? wY.default.createElement(wY.default.Fragment, null, "Press ", Y.keyName, " again to exit") : wY.default.createElement(vQ, null, wY.default.createElement(F0, {
    shortcut: "↑/↓",
    action: "navigate"
  }), wY.default.createElement(F0, {
    shortcut: "Enter",
    action: "explore"
  }), wY.default.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "close"
  })))))
}
// @from(Ln 406812, Col 4)
wY
// @from(Ln 406813, Col 4)
PB9 = w(() => {
  fA();
  c6();
  E9();
  lD();
  SR0();
  e9();
  I3();
  K6();
  OB9();
  jB9();
  n21();
  JZ();
  wY = c(QA(), 1)
})
// @from(Ln 406828, Col 4)
vR0
// @from(Ln 406828, Col 9)
IyY
// @from(Ln 406829, Col 4)
SB9 = w(() => {
  PB9();
  JZ();
  vR0 = c(QA(), 1), IyY = {
    type: "local-jsx",
    name: "discover",
    description: "Explore Claude Code features and track your progress",
    isEnabled: a21,
    isHidden: !a21(),
    async call(A) {
      return vR0.createElement(TB9, {
        onClose: A
      })
    },
    userFacingName() {
      return "discover"
    }
  }
})
// @from(Ln 406849, Col 0)
function vzA() {
  return VgA.createElement(C, {
    color: "permission"
  }, "Press ", VgA.createElement(C, {
    bold: !0
  }, "Enter"), " to continue…")
}
// @from(Ln 406856, Col 4)
VgA
// @from(Ln 406857, Col 4)
_E1 = w(() => {
  fA();
  VgA = c(QA(), 1)
})
// @from(Ln 406862, Col 0)
function jE1() {
  let {
    addNotification: A,
    removeNotification: Q
  } = S4(), [B, G] = kzA.useState(() => {
    let {
      errors: Y
    } = kP();
    return Y
  }), Z = kzA.useCallback(() => {
    let {
      errors: Y
    } = kP();
    G(Y)
  }, []);
  return EDA(Z), kzA.useEffect(() => {
    if (B.length > 0) {
      let Y = `Found ${B.length} invalid settings ${B.length===1?"file":"files"} · /doctor for details`;
      A({
        key: xB9,
        text: Y,
        color: "warning",
        priority: "high",
        timeoutMs: 60000
      })
    } else Q(xB9)
  }, [B, A, Q]), B
}
// @from(Ln 406890, Col 4)
kzA
// @from(Ln 406890, Col 9)
xB9 = "settings-errors"
// @from(Ln 406891, Col 4)
kR0 = w(() => {
  GB();
  F91();
  HY();
  kzA = c(QA(), 1)
})
// @from(Ln 406898, Col 0)
function yB9(A, Q = {}) {
  let {
    showValues: B = !0,
    hideFunctions: G = !1,
    themeName: Z = "dark",
    treeCharColors: Y = {}
  } = Q, J = [], X = new WeakSet;

  function I(K, V) {
    if (!V) return K;
    return sQ(V, Z)(K)
  }

  function D(K, V, F, H = 0) {
    if (typeof K === "string") {
      J.push(V + I(K, Y.value));
      return
    }
    if (typeof K !== "object" || K === null) {
      if (B) {
        let z = String(K);
        J.push(V + I(z, Y.value))
      }
      return
    }
    if (X.has(K)) {
      J.push(V + I("[Circular]", Y.value));
      return
    }
    X.add(K);
    let E = Object.keys(K).filter((z) => {
      let $ = K[z];
      if (G && typeof $ === "function") return !1;
      return !0
    });
    E.forEach((z, $) => {
      let O = K[z],
        L = $ === E.length - 1,
        M = H === 0 && $ === 0 ? "" : V,
        _ = L ? FgA.lastBranch : FgA.branch,
        j = I(_, Y.treeChar),
        x = z.trim() === "" ? "" : I(z, Y.key),
        b = M + j + (x ? " " + x : ""),
        S = z.trim() !== "";
      if (O && typeof O === "object" && X.has(O)) {
        let u = I("[Circular]", Y.value);
        J.push(b + (S ? ": " : b ? " " : "") + u)
      } else if (O && typeof O === "object" && !Array.isArray(O)) {
        J.push(b);
        let u = L ? FgA.empty : FgA.line,
          f = I(u, Y.treeChar),
          AA = M + f + " ";
        D(O, AA, L, H + 1)
      } else if (Array.isArray(O)) J.push(b + (S ? ": " : b ? " " : "") + "[Array(" + O.length + ")]");
      else if (B) {
        let u = typeof O === "function" ? "[Function]" : String(O),
          f = I(u, Y.value);
        b += (S ? ": " : b ? " " : "") + f, J.push(b)
      } else J.push(b)
    })
  }
  let W = Object.keys(A);
  if (W.length === 0) return I("(empty)", Y.value);
  if (W.length === 1 && W[0] !== void 0 && W[0].trim() === "" && typeof A[W[0]] === "string") {
    let K = W[0],
      V = I(FgA.lastBranch, Y.treeChar),
      F = I(A[K], Y.value);
    return V + " " + F
  }
  return D(A, "", !0), J.join(`
`)
}
// @from(Ln 406970, Col 4)
FgA
// @from(Ln 406971, Col 4)
vB9 = w(() => {
  B2();
  fA();
  FgA = {
    branch: tA.lineUpDownRight,
    lastBranch: tA.lineUpRight,
    line: tA.lineVertical,
    empty: " "
  }
})
// @from(Ln 406982, Col 0)
function WJ7(A) {
  let Q = {};
  return A.forEach((B) => {
    if (!B.path) {
      Q[""] = B.message;
      return
    }
    let G = B.path.split("."),
      Z = B.path;
    if (B.invalidValue !== null && B.invalidValue !== void 0 && G.length > 0) {
      let Y = [];
      for (let J = 0; J < G.length; J++) {
        let X = G[J];
        if (!X) continue;
        let I = parseInt(X, 10);
        if (!isNaN(I) && J === G.length - 1) {
          let D;
          if (typeof B.invalidValue === "string") D = `"${B.invalidValue}"`;
          else if (B.invalidValue === null) D = "null";
          else if (B.invalidValue === void 0) D = "undefined";
          else D = String(B.invalidValue);
          Y.push(D)
        } else Y.push(X)
      }
      Z = Y.join(".")
    }
    c9Q(Q, Z, B.message, Object)
  }), Q
}
// @from(Ln 407012, Col 0)
function TE1({
  errors: A
}) {
  let [Q] = oB();
  if (A.length === 0) return null;
  let B = A.reduce((Z, Y) => {
      let J = Y.file || "(file not specified)";
      if (!Z[J]) Z[J] = [];
      return Z[J].push(Y), Z
    }, {}),
    G = Object.keys(B).sort();
  return VV.createElement(T, {
    flexDirection: "column"
  }, G.map((Z) => {
    let Y = B[Z] || [];
    Y.sort((D, W) => {
      if (!D.path && W.path) return -1;
      if (D.path && !W.path) return 1;
      return (D.path || "").localeCompare(W.path || "")
    });
    let J = WJ7(Y),
      X = new Map;
    Y.forEach((D) => {
      if (D.suggestion || D.docLink) {
        let W = `${D.suggestion||""}|${D.docLink||""}`;
        if (!X.has(W)) X.set(W, {
          suggestion: D.suggestion,
          docLink: D.docLink
        })
      }
    });
    let I = yB9(J, {
      showValues: !0,
      themeName: Q,
      treeCharColors: {
        treeChar: "inactive",
        key: "text",
        value: "inactive"
      }
    });
    return VV.createElement(T, {
      key: Z,
      flexDirection: "column"
    }, VV.createElement(C, null, Z), VV.createElement(T, {
      marginLeft: 1
    }, VV.createElement(C, {
      dimColor: !0
    }, I)), X.size > 0 && VV.createElement(T, {
      flexDirection: "column",
      marginTop: 1
    }, Array.from(X.values()).map((D, W) => VV.createElement(T, {
      key: `suggestion-pair-${W}`,
      flexDirection: "column",
      marginBottom: 1
    }, D.suggestion && VV.createElement(C, {
      dimColor: !0,
      wrap: "wrap"
    }, D.suggestion), D.docLink && VV.createElement(C, {
      dimColor: !0,
      wrap: "wrap"
    }, "Learn more: ", D.docLink)))))
  }))
}
// @from(Ln 407075, Col 4)
VV
// @from(Ln 407076, Col 4)
bR0 = w(() => {
  fA();
  p9Q();
  vB9();
  VV = c(QA(), 1)
})
// @from(Ln 407083, Col 0)
function KJ7({
  scope: A,
  parsingErrors: Q,
  warnings: B
}) {
  let G = Q.length > 0,
    Z = B.length > 0;
  if (!G && !Z) return null;
  return hJ.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, hJ.default.createElement(T, null, (G || Z) && hJ.default.createElement(C, {
    color: G ? "error" : "warning"
  }, "[", G ? "Failed to parse" : "Contains warnings", "]", " "), hJ.default.createElement(C, null, HgA(A))), hJ.default.createElement(T, null, hJ.default.createElement(C, {
    dimColor: !0
  }, "Location: "), hJ.default.createElement(C, {
    dimColor: !0
  }, N$(A))), hJ.default.createElement(T, {
    marginLeft: 1,
    flexDirection: "column"
  }, Q.map((Y, J) => {
    let X = Y.mcpErrorMetadata?.serverName;
    return hJ.default.createElement(T, {
      key: `error-${J}`
    }, hJ.default.createElement(C, null, hJ.default.createElement(C, {
      dimColor: !0
    }, "└ "), hJ.default.createElement(C, {
      color: "error"
    }, "[Error]"), hJ.default.createElement(C, {
      dimColor: !0
    }, " ", X && `[${X}] `, Y.path && Y.path !== "" ? `${Y.path}: ` : "", Y.message)))
  }), B.map((Y, J) => {
    let X = Y.mcpErrorMetadata?.serverName;
    return hJ.default.createElement(T, {
      key: `warning-${J}`
    }, hJ.default.createElement(C, null, hJ.default.createElement(C, {
      dimColor: !0
    }, "└ "), hJ.default.createElement(C, {
      color: "warning"
    }, "[Warning]"), hJ.default.createElement(C, {
      dimColor: !0
    }, " ", X && `[${X}] `, Y.path && Y.path !== "" ? `${Y.path}: ` : "", Y.message)))
  })))
}
// @from(Ln 407128, Col 0)
function SE1() {
  let A = GW("user"),
    Q = GW("project"),
    B = GW("local"),
    G = GW("enterprise"),
    Z = [{
      scope: "user",
      config: A
    }, {
      scope: "project",
      config: Q
    }, {
      scope: "local",
      config: B
    }, {
      scope: "enterprise",
      config: G
    }],
    Y = Z.some(({
      config: X
    }) => PE1(X.errors, "fatal").length > 0),
    J = Z.some(({
      config: X
    }) => PE1(X.errors, "warning").length > 0);
  if (!Y && !J) return null;
  return hJ.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1,
    marginBottom: 1
  }, hJ.default.createElement(C, {
    bold: !0
  }, "MCP Config Diagnostics"), hJ.default.createElement(T, {
    marginTop: 1
  }, hJ.default.createElement(C, {
    dimColor: !0
  }, "For help configuring MCP servers, see:", " ", hJ.default.createElement(i2, {
    url: "https://code.claude.com/docs/en/mcp"
  }, "https://code.claude.com/docs/en/mcp"))), Z.map(({
    scope: X,
    config: I
  }) => hJ.default.createElement(KJ7, {
    key: X,
    scope: X,
    parsingErrors: PE1(I.errors, "fatal"),
    warnings: PE1(I.errors, "warning")
  })))
}
// @from(Ln 407176, Col 0)
function PE1(A, Q) {
  return A.filter((B) => B.mcpErrorMetadata?.severity === Q)
}
// @from(Ln 407179, Col 4)
hJ
// @from(Ln 407180, Col 4)
fR0 = w(() => {
  fA();
  G$();
  PJ();
  fA();
  hJ = c(QA(), 1)
})
// @from(Ln 407188, Col 0)
function kB9() {
  if (!Pk()) return null;
  let A = cOB();
  if (A.length === 0) return null;
  let Q = A.filter((G) => G.severity === "error"),
    B = A.filter((G) => G.severity === "warning");
  return WW.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1,
    marginBottom: 1
  }, WW.default.createElement(C, {
    bold: !0,
    color: Q.length > 0 ? "error" : "warning"
  }, "Keybinding Configuration Issues"), WW.default.createElement(T, null, WW.default.createElement(C, {
    dimColor: !0
  }, "Location: "), WW.default.createElement(C, {
    dimColor: !0
  }, rBA())), WW.default.createElement(T, {
    marginLeft: 1,
    flexDirection: "column",
    marginTop: 1
  }, Q.map((G, Z) => WW.default.createElement(T, {
    key: `error-${Z}`,
    flexDirection: "column"
  }, WW.default.createElement(T, null, WW.default.createElement(C, {
    dimColor: !0
  }, "└ "), WW.default.createElement(C, {
    color: "error"
  }, "[Error]"), WW.default.createElement(C, {
    dimColor: !0
  }, " ", G.message)), G.suggestion && WW.default.createElement(T, {
    marginLeft: 3
  }, WW.default.createElement(C, {
    dimColor: !0
  }, "→ ", G.suggestion)))), B.map((G, Z) => WW.default.createElement(T, {
    key: `warning-${Z}`,
    flexDirection: "column"
  }, WW.default.createElement(T, null, WW.default.createElement(C, {
    dimColor: !0
  }, "└ "), WW.default.createElement(C, {
    color: "warning"
  }, "[Warning]"), WW.default.createElement(C, {
    dimColor: !0
  }, " ", G.message)), G.suggestion && WW.default.createElement(T, {
    marginLeft: 3
  }, WW.default.createElement(C, {
    dimColor: !0
  }, "→ ", G.suggestion))))))
}
// @from(Ln 407237, Col 4)
WW
// @from(Ln 407238, Col 4)
bB9 = w(() => {
  fA();
  XDA();
  WW = c(QA(), 1)
})
// @from(Ln 407244, Col 0)
function fB9() {
  return ab0().map((Q) => ({
    name: Q.name,
    value: process.env[Q.name],
    ...Q.validate(process.env[Q.name])
  })).filter((Q) => Q.status !== "valid")
}
// @from(Ln 407251, Col 4)
hB9 = w(() => {
  C0()
})
// @from(Ln 407255, Col 0)
function EgA(A) {
  if (!A) return 0;
  return A.activeAgents.filter((Q) => Q.source !== "built-in").reduce((Q, B) => {
    let G = `${B.agentType}: ${B.whenToUse}`;
    return Q + l7(G)
  }, 0)
}
// @from(Ln 407262, Col 4)
i3A = 15000
// @from(Ln 407263, Col 4)
hR0 = w(() => {
  qN()
})
// @from(Ln 407266, Col 0)
async function VJ7() {
  let A = N4A();
  if (A.length === 0) return null;
  let Q = A.sort((G, Z) => Z.content.length - G.content.length).map((G) => `${G.path}: ${G.content.length.toLocaleString()} chars`);
  return {
    type: "claudemd_files",
    severity: "warning",
    message: A.length === 1 ? `Large CLAUDE.md file detected (${A[0].content.length.toLocaleString()} chars > ${xd.toLocaleString()})` : `${A.length} large CLAUDE.md files detected (each > ${xd.toLocaleString()} chars)`,
    details: Q,
    currentValue: A.length,
    threshold: xd
  }
}
// @from(Ln 407279, Col 0)
async function FJ7(A) {
  if (!A) return null;
  let Q = EgA(A);
  if (Q <= i3A) return null;
  let B = A.activeAgents.filter((Z) => Z.source !== "built-in").map((Z) => {
      let Y = `${Z.agentType}: ${Z.whenToUse}`;
      return {
        name: Z.agentType,
        tokens: l7(Y)
      }
    }).sort((Z, Y) => Y.tokens - Z.tokens),
    G = B.slice(0, 5).map((Z) => `${Z.name}: ~${Z.tokens.toLocaleString()} tokens`);
  if (B.length > 5) G.push(`(${B.length-5} more custom agents)`);
  return {
    type: "agent_descriptions",
    severity: "warning",
    message: `Large agent descriptions (~${Q.toLocaleString()} tokens > ${i3A.toLocaleString()})`,
    details: G,
    currentValue: Q,
    threshold: i3A
  }
}
// @from(Ln 407301, Col 0)
async function HJ7(A, Q, B) {
  let G = A.filter((Z) => Z.isMcp);
  if (G.length === 0) return null;
  if (jJ()) return null;
  try {
    let Z = B5(),
      {
        mcpToolTokens: Y,
        mcpToolDetails: J
      } = await ThA(A, Q, B, Z);
    if (Y <= bzA) return null;
    let X = new Map;
    for (let W of J) {
      let V = W.name.split("__")[1] || "unknown",
        F = X.get(V) || {
          count: 0,
          tokens: 0
        };
      X.set(V, {
        count: F.count + 1,
        tokens: F.tokens + W.tokens
      })
    }
    let I = Array.from(X.entries()).sort((W, K) => K[1].tokens - W[1].tokens),
      D = I.slice(0, 5).map(([W, K]) => `${W}: ${K.count} tools (~${K.tokens.toLocaleString()} tokens)`);
    if (I.length > 5) D.push(`(${I.length-5} more servers)`);
    return {
      type: "mcp_tools",
      severity: "warning",
      message: `Large MCP tools context (~${Y.toLocaleString()} tokens > ${bzA.toLocaleString()})`,
      details: D,
      currentValue: Y,
      threshold: bzA
    }
  } catch (Z) {
    let Y = G.reduce((J, X) => {
      let I = (X.name?.length || 0) + X.description.length;
      return J + l7(I.toString())
    }, 0);
    if (Y <= bzA) return null;
    return {
      type: "mcp_tools",
      severity: "warning",
      message: `Large MCP tools context (~${Y.toLocaleString()} tokens estimated > ${bzA.toLocaleString()})`,
      details: [`${G.length} MCP tools detected (token count estimated)`],
      currentValue: Y,
      threshold: bzA
    }
  }
}
// @from(Ln 407351, Col 0)
async function EJ7(A) {
  let Q = await A(),
    B = XB.isSandboxingEnabled() && XB.isAutoAllowBashIfSandboxedEnabled(),
    G = $VA(Q, {
      sandboxAutoAllowEnabled: B
    });
  if (G.length === 0) return null;
  let Z = G.flatMap((Y) => [`${S5(Y.rule.ruleValue)}: ${Y.reason}`, `  Fix: ${Y.fix}`]);
  return {
    type: "unreachable_rules",
    severity: "warning",
    message: `${G.length} unreachable permission rule${G.length===1?"":"s"} detected`,
    details: Z,
    currentValue: G.length,
    threshold: 0
  }
}
// @from(Ln 407368, Col 0)
async function gB9(A, Q, B) {
  let [G, Z, Y, J] = await Promise.all([VJ7(), FJ7(Q), HJ7(A, B, Q), EJ7(B)]);
  return {
    claudeMdWarning: G,
    agentWarning: Z,
    mcpWarning: Y,
    unreachableRulesWarning: J
  }
}
// @from(Ln 407377, Col 4)
bzA = 25000
// @from(Ln 407378, Col 4)
uB9 = w(() => {
  nz();
  hR0();
  wH1();
  qN();
  $F();
  l2();
  dZ1();
  NJ();
  YZ()
})
// @from(Ln 407393, Col 0)
function zJ7({
  promise: A
}) {
  let Q = WB.use(A);
  if (!Q.latest) return WB.default.createElement(C, {
    dimColor: !0
  }, "└ Failed to fetch versions");
  return WB.default.createElement(WB.default.Fragment, null, Q.stable && WB.default.createElement(C, null, "└ Stable version: ", Q.stable), WB.default.createElement(C, null, "└ Latest version: ", Q.latest))
}
// @from(Ln 407403, Col 0)
function xE1({
  onDone: A
}) {
  let [Q] = a0(), B = Q.agentDefinitions, G = yx.useMemo(() => {
    return Q?.mcp?.tools || []
  }, [Q?.mcp?.tools]), [Z, Y] = yx.useState(null), [J, X] = yx.useState(null), [I, D] = yx.useState(null), [W, K] = yx.useState(null), V = jE1(), F = yx.useMemo(() => zt().then(($) => {
    return ($.installationType === "native" ? km2 : vm2)().catch(() => ({
      latest: null,
      stable: null
    }))
  }), []), H = r3()?.autoUpdatesChannel ?? "latest", E = V.filter(($) => $.mcpErrorMetadata === void 0), z = yx.useMemo(() => fB9(), []);
  if (yx.useEffect(() => {
      zt().then(Y), (async () => {
        let $ = vA(),
          O = gR0(zQ(), "agents"),
          L = gR0(EQ(), ".claude", "agents"),
          {
            activeAgents: M,
            allAgents: _,
            failedFiles: j
          } = B,
          x = {
            activeAgents: M.map((S) => ({
              agentType: S.agentType,
              source: S.source
            })),
            userAgentsDir: O,
            projectAgentsDir: L,
            userDirExists: $.existsSync(O),
            projectDirExists: $.existsSync(L),
            failedFiles: j
          };
        X(x);
        let b = await gB9(G, {
          activeAgents: M,
          allAgents: _,
          failedFiles: j
        }, async () => Q.toolPermissionContext);
        if (D(b), h3A()) {
          let S = gR0(VE1(), "claude", "locks"),
            u = zE1(S),
            f = $R0(S);
          K({
            enabled: !0,
            locks: f,
            locksDir: S,
            staleLocksCleaned: u
          })
        } else K({
          enabled: !1,
          locks: [],
          locksDir: "",
          staleLocksCleaned: 0
        })
      })()
    }, [Q.toolPermissionContext, G, B]), J0(($, O) => {
      if (O.return || O.escape || O.ctrl && $ === "c") A("Claude Code diagnostics dismissed", {
        display: "system"
      })
    }), !Z) return WB.default.createElement(T, {
    paddingX: 1,
    paddingTop: 1
  }, WB.default.createElement(C, {
    dimColor: !0
  }, "Checking installation status…"));
  return WB.default.createElement(T, {
    flexDirection: "column",
    gap: 1,
    paddingX: 1,
    paddingTop: 1
  }, WB.default.createElement(T, {
    flexDirection: "column"
  }, WB.default.createElement(C, {
    bold: !0
  }, "Diagnostics"), WB.default.createElement(C, null, "└ Currently running: ", Z.installationType, " (", Z.version, ")"), Z.packageManager && WB.default.createElement(C, null, "└ Package manager: ", Z.packageManager), WB.default.createElement(C, null, "└ Path: ", Z.installationPath), WB.default.createElement(C, null, "└ Invoked: ", Z.invokedBinary), WB.default.createElement(C, null, "└ Config install method: ", Z.configInstallMethod), WB.default.createElement(C, null, "└ Search: ", Z.ripgrepStatus.working ? "OK" : "Not working", " (", Z.ripgrepStatus.mode === "builtin" ? LG() ? "bundled" : "vendor" : Z.ripgrepStatus.systemPath || "system", ")"), Z.recommendation && WB.default.createElement(WB.default.Fragment, null, WB.default.createElement(C, null), WB.default.createElement(C, {
    color: "warning"
  }, "Recommendation: ", Z.recommendation.split(`
`)[0]), WB.default.createElement(C, {
    dimColor: !0
  }, Z.recommendation.split(`
`)[1])), Z.multipleInstallations.length > 1 && WB.default.createElement(WB.default.Fragment, null, WB.default.createElement(C, null), WB.default.createElement(C, {
    color: "warning"
  }, "Warning: Multiple installations found"), Z.multipleInstallations.map(($, O) => WB.default.createElement(C, {
    key: O
  }, "└ ", $.type, " at ", $.path))), Z.warnings.length > 0 && WB.default.createElement(WB.default.Fragment, null, WB.default.createElement(C, null), Z.warnings.map(($, O) => WB.default.createElement(T, {
    key: O,
    flexDirection: "column"
  }, WB.default.createElement(C, {
    color: "warning"
  }, "Warning: ", $.issue), WB.default.createElement(C, null, "Fix: ", $.fix)))), E.length > 0 && WB.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1,
    marginBottom: 1
  }, WB.default.createElement(C, {
    bold: !0
  }, "Invalid Settings"), WB.default.createElement(TE1, {
    errors: E
  }))), WB.default.createElement(T, {
    flexDirection: "column"
  }, WB.default.createElement(C, {
    bold: !0
  }, "Updates"), WB.default.createElement(C, null, "└ Auto-updates:", " ", Z.packageManager ? "Managed by package manager" : Z.autoUpdates), Z.hasUpdatePermissions !== null && WB.default.createElement(C, null, "└ Update permissions:", " ", Z.hasUpdatePermissions ? "Yes" : "No (requires sudo)"), WB.default.createElement(C, null, "└ Auto-update channel: ", H), WB.default.createElement(WB.Suspense, {
    fallback: null
  }, WB.default.createElement(zJ7, {
    promise: F
  }))), WB.default.createElement(SE1, null), WB.default.createElement(kB9, null), z.length > 0 && WB.default.createElement(T, {
    flexDirection: "column"
  }, WB.default.createElement(C, {
    bold: !0
  }, "Environment Variables"), z.map(($, O) => WB.default.createElement(C, {
    key: O
  }, "└ ", $.name, ":", " ", WB.default.createElement(C, {
    color: $.status === "capped" ? "warning" : "error"
  }, $.message)))), W?.enabled && WB.default.createElement(T, {
    flexDirection: "column"
  }, WB.default.createElement(C, {
    bold: !0
  }, "Version Locks"), W.staleLocksCleaned > 0 && WB.default.createElement(C, {
    dimColor: !0
  }, "└ Cleaned ", W.staleLocksCleaned, " stale lock(s)"), W.locks.length === 0 ? WB.default.createElement(C, {
    dimColor: !0
  }, "└ No active version locks") : W.locks.map(($, O) => WB.default.createElement(C, {
    key: O
  }, "└ ", $.version, ": PID ", $.pid, " ", $.isProcessRunning ? WB.default.createElement(C, null, "(running)") : WB.default.createElement(C, {
    color: "warning"
  }, "(stale)")))), J?.failedFiles && J.failedFiles.length > 0 && WB.default.createElement(T, {
    flexDirection: "column"
  }, WB.default.createElement(C, {
    bold: !0,
    color: "error"
  }, "Agent Parse Errors"), WB.default.createElement(C, {
    color: "error"
  }, "└ Failed to parse ", J.failedFiles.length, " agent file(s):"), J.failedFiles.map(($, O) => WB.default.createElement(C, {
    key: O,
    dimColor: !0
  }, "  ", "└ ", $.path, ": ", $.error))), Q.plugins.errors.length > 0 && WB.default.createElement(T, {
    flexDirection: "column"
  }, WB.default.createElement(C, {
    bold: !0,
    color: "error"
  }, "Plugin Errors"), WB.default.createElement(C, {
    color: "error"
  }, "└ ", Q.plugins.errors.length, " plugin error(s) detected:"), Q.plugins.errors.map(($, O) => WB.default.createElement(C, {
    key: O,
    dimColor: !0
  }, "  ", "└ ", $.source || "unknown", "plugin" in $ && $.plugin ? ` [${$.plugin}]` : "", ":", " ", h_($)))), I?.unreachableRulesWarning && WB.default.createElement(T, {
    flexDirection: "column"
  }, WB.default.createElement(C, {
    bold: !0,
    color: "warning"
  }, "Unreachable Permission Rules"), WB.default.createElement(C, null, "└", " ", WB.default.createElement(C, {
    color: "warning"
  }, tA.warning, " ", I.unreachableRulesWarning.message)), I.unreachableRulesWarning.details.map(($, O) => WB.default.createElement(C, {
    key: O,
    dimColor: !0
  }, "  ", "└ ", $))), I && (I.claudeMdWarning || I.agentWarning || I.mcpWarning) && WB.default.createElement(T, {
    flexDirection: "column"
  }, WB.default.createElement(C, {
    bold: !0
  }, "Context Usage Warnings"), I.claudeMdWarning && WB.default.createElement(WB.default.Fragment, null, WB.default.createElement(C, null, "└", " ", WB.default.createElement(C, {
    color: "warning"
  }, tA.warning, " ", I.claudeMdWarning.message)), WB.default.createElement(C, null, "  ", "└ Files:"), I.claudeMdWarning.details.map(($, O) => WB.default.createElement(C, {
    key: O,
    dimColor: !0
  }, "    ", "└ ", $))), I.agentWarning && WB.default.createElement(WB.default.Fragment, null, WB.default.createElement(C, null, "└", " ", WB.default.createElement(C, {
    color: "warning"
  }, tA.warning, " ", I.agentWarning.message)), WB.default.createElement(C, null, "  ", "└ Top contributors:"), I.agentWarning.details.map(($, O) => WB.default.createElement(C, {
    key: O,
    dimColor: !0
  }, "    ", "└ ", $))), I.mcpWarning && WB.default.createElement(WB.default.Fragment, null, WB.default.createElement(C, null, "└", " ", WB.default.createElement(C, {
    color: "warning"
  }, tA.warning, " ", I.mcpWarning.message)), WB.default.createElement(C, null, "  ", "└ MCP servers:"), I.mcpWarning.details.map(($, O) => WB.default.createElement(C, {
    key: O,
    dimColor: !0
  }, "    ", "└ ", $)))), WB.default.createElement(T, null, WB.default.createElement(vzA, null)))
}
// @from(Ln 407579, Col 4)
WB
// @from(Ln 407579, Col 8)
yx
// @from(Ln 407580, Col 4)
uR0 = w(() => {
  fA();
  B2();
  jf();
  bc();
  GB();
  _E1();
  kR0();
  bR0();
  fR0();
  bB9();
  C0();
  DQ();
  fQ();
  hB9();
  uB9();
  CR0();
  FR0();
  hB();
  WB = c(QA(), 1), yx = c(QA(), 1)
})
// @from(Ln 407601, Col 4)
mB9
// @from(Ln 407601, Col 9)
$J7
// @from(Ln 407601, Col 14)
dB9
// @from(Ln 407602, Col 4)
cB9 = w(() => {
  uR0();
  mB9 = c(QA(), 1), $J7 = {
    name: "doctor",
    description: "Diagnose and verify your Claude Code installation and settings",
    isEnabled: () => !process.env.DISABLE_DOCTOR_COMMAND,
    isHidden: !1,
    userFacingName() {
      return "doctor"
    },
    type: "local-jsx",
    call(A, Q, B) {
      return new Promise((G) => G(mB9.default.createElement(xE1, {
        onDone: A
      })))
    }
  }, dB9 = $J7
})
// @from(Ln 407620, Col 4)
mR0 = w(() => {
  fQ()
})
// @from(Ln 407623, Col 4)
dR0 = w(() => {
  cfA();
  T1();
  A0();
  DQ();
  pfA();
  mR0();
  A0()
})
// @from(Ln 407632, Col 4)
cR0 = w(() => {
  cfA();
  T1();
  v1();
  iw0();
  pw0();
  mR0();
  A0();
  DQ();
  pfA();
  dR0();
  A0()
})
// @from(Ln 407645, Col 4)
qJ7
// @from(Ln 407646, Col 4)
pB9 = w(() => {
  fA();
  u8();
  E9();
  fA();
  qJ7 = c(QA(), 1)
})
// @from(Ln 407653, Col 4)
NJ7
// @from(Ln 407653, Col 9)
wJ7
// @from(Ln 407654, Col 4)
lB9 = w(() => {
  fA();
  NJ7 = c(QA(), 1), wJ7 = c(QA(), 1)
})
// @from(Ln 407658, Col 4)
LJ7
// @from(Ln 407658, Col 9)
iB9
// @from(Ln 407659, Col 4)
nB9 = w(() => {
  fA();
  IY();
  yG();
  dR0();
  T1();
  LJ7 = c(QA(), 1), iB9 = c(QA(), 1)
})
// @from(Ln 407667, Col 4)
OJ7
// @from(Ln 407667, Col 9)
pR0
// @from(Ln 407668, Col 4)
aB9 = w(() => {
  fA();
  yG();
  cR0();
  pB9();
  lB9();
  nB9();
  T1();
  OJ7 = c(QA(), 1), pR0 = c(QA(), 1)
})
// @from(Ln 407678, Col 4)
lR0
// @from(Ln 407679, Col 4)
oB9 = w(() => {
  fA();
  yG();
  cR0();
  T1();
  DQ();
  oZ();
  aB9();
  lR0 = c(QA(), 1)
})
// @from(Ln 407690, Col 0)
function MJ7(A) {
  try {
    let Q = process.platform === "win32" ? "where" : "which";
    return ly(`${Q} ${A}`, {
      stdio: "ignore"
    }), !0
  } catch {
    return !1
  }
}
// @from(Ln 407700, Col 0)
async function tf(A) {
  let Q = Wp();
  if (!Q) throw Error("No editor available");
  ly(`${Q} "${A}"`, {
    stdio: "inherit"
  })
}
// @from(Ln 407707, Col 4)
Wp
// @from(Ln 407708, Col 4)
Kp = w(() => {
  _lA();
  Y9();
  Wp = W0(() => {
    if (process.env.VISUAL?.trim()) return process.env.VISUAL.trim();
    if (process.env.EDITOR?.trim()) return process.env.EDITOR.trim();
    if (process.platform === "win32") return "start /wait notepad";
    return ["code", "vi", "nano"].find((Q) => MJ7(Q))
  })
})
// @from(Ln 407725, Col 0)
async function TJ7(A, Q) {
  let {
    code: B
  } = await J2("git", ["check-ignore", A], {
    preserveOutputOnError: !1,
    cwd: Q
  });
  return B === 0
}
// @from(Ln 407735, Col 0)
function PJ7() {
  return RJ7(jJ7(), ".config", "git", "ignore")
}
// @from(Ln 407738, Col 0)
async function iR0(A, Q = o1()) {
  try {
    if (!await cBB(Q)) return;
    let B = `**/${A}`,
      G = A.endsWith("/") ? `${A}sample-file.txt` : A;
    if (await TJ7(G, Q)) return;
    let Z = PJ7(),
      Y = vA(),
      J = _J7(Z);
    if (!Y.existsSync(J)) Y.mkdirSync(J);
    if (Y.existsSync(Z)) {
      if (Y.readFileSync(Z, {
          encoding: "utf-8"
        }).includes(B)) return;
      Y.appendFileSync(Z, `
${B}
`)
    } else bB(Z, `${B}
`, "utf-8")
  } catch (B) {
    e(B instanceof Error ? B : Error(String(B)))
  }
}
// @from(Ln 407761, Col 4)
nR0 = w(() => {
  ZI();
  DQ();
  V2();
  v1();
  t4();
  A0()
})
// @from(Ln 407773, Col 0)
function rB9(A) {
  try {
    SJ7("git", ["rev-parse", "--is-inside-work-tree"], {
      cwd: A,
      stdio: "ignore"
    })
  } catch (Q) {
    return !1
  }
  return !0
}
// @from(Ln 407784, Col 4)
sB9 = w(() => {
  DQ();
  nR0()
})
// @from(Ln 407792, Col 0)
function A29({
  onSelect: A,
  onCancel: Q,
  title: B,
  renderDetails: G
}) {
  let Z = GV(),
    Y = tB9(zQ(), "CLAUDE.md"),
    J = tB9(EQ(), "CLAUDE.md"),
    X = Z.some(($) => $.path === Y),
    I = Z.some(($) => $.path === J),
    D = [...Z.map(($) => ({
      ...$,
      exists: !0
    })), ...X ? [] : [{
      path: Y,
      type: "User",
      content: "",
      exists: !1
    }], ...I ? [] : [{
      path: J,
      type: "Project",
      content: "",
      exists: !1
    }]],
    W = new Map,
    K = D.map(($) => {
      let O = k6($.path),
        L = $.exists ? "" : " (new)",
        M = $.parent ? (W.get($.parent) ?? 0) + 1 : 0;
      W.set($.path, M);
      let _ = M > 0 ? "  ".repeat(M - 1) : "",
        j;
      if ($.type === "User" && !$.isNested && $.path === Y) j = "User memory";
      else if ($.type === "Project" && !$.isNested && $.path === J) j = "Project memory";
      else if (M > 0) j = `${_}L ${O}${L}`;
      else j = `${O}`;
      let x, b = rB9(EQ());
      if ($.type === "User" && !$.isNested) x = "Saved in ~/.claude/CLAUDE.md";
      else if ($.type === "Project" && !$.isNested && $.path === J) x = `${b?"Checked in at":"Saved in"} ./CLAUDE.md`;
      else if ($.type, $.parent) x = "@-imported";
      else if ($.isNested) x = "dynamically loaded";
      else x = "";
      return {
        label: j,
        value: $.path,
        description: x
      }
    }),
    V = yE1 && K.some(($) => $.value === yE1) ? yE1 : K[0]?.value || "",
    [F, H] = eB9.useState(V),
    z = D.find(($) => $.path === F)?.type;
  return MQ(), J0(($, O) => {
    if (O.escape) Q()
  }), rO.createElement(T, {
    flexDirection: "column",
    borderStyle: "round",
    borderColor: "remember",
    padding: 1,
    width: "100%"
  }, rO.createElement(T, {
    marginBottom: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  }, rO.createElement(C, {
    color: "remember",
    bold: !0
  }, B || "Select memory file to edit:")), rO.createElement(T, {
    flexDirection: "column",
    paddingX: 1
  }, rO.createElement(k0, {
    defaultFocusValue: V,
    options: K,
    onFocus: ($) => H($),
    onChange: ($) => {
      yE1 = $, A($)
    },
    onCancel: Q
  })), G && rO.createElement(T, {
    marginTop: 1,
    flexDirection: "column"
  }, G(F, z)))
}
// @from(Ln 407875, Col 4)
rO
// @from(Ln 407875, Col 8)
eB9
// @from(Ln 407875, Col 13)
yE1
// @from(Ln 407876, Col 4)
Q29 = w(() => {
  fA();
  u8();
  E9();
  nz();
  y9();
  sB9();
  C0();
  fQ();
  rO = c(QA(), 1), eB9 = c(QA(), 1)
})
// @from(Ln 407894, Col 0)
function B29(A) {
  let Q = xJ7(),
    B = o1(),
    G = A.startsWith(Q) ? "~" + A.slice(Q.length) : null,
    Z = A.startsWith(B) ? "./" + yJ7(B, A) : null;
  if (G && Z) return G.length <= Z.length ? G : Z;
  return G || Z || A
}
// @from(Ln 407902, Col 4)
vJ7
// @from(Ln 407903, Col 4)
G29 = w(() => {
  fA();
  V2();
  vJ7 = c(QA(), 1)
})