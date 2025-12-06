
// @from(Start 6651230, End 6651740)
function T$A(A, Q, B, G) {
  let Z = QGA.useRef(Date.now()),
    [I, Y] = QGA.useState(A === "requesting" ? -1 : 10),
    J = QGA.useMemo(() => {
      if (A === "requesting") return 50;
      return 200
    }, [A]);
  return CI(() => {
    if (B === !1 || G) return;
    let W = Date.now() - Z.current,
      X = Math.floor(W / J),
      V = Q.length,
      F = V + 20;
    if (A === "requesting") {
      let K = X % F - 10;
      Y(K)
    } else {
      let K = V + 10 - X % F;
      Y(K)
    }
  }, J), I
}
// @from(Start 6651745, End 6651748)
QGA
// @from(Start 6651754, End 6651800)
Lm1 = L(() => {
  JE();
  QGA = BA(VA(), 1)
})
// @from(Start 6651803, End 6652610)
function WOB(A, Q) {
  if (Q.length === 0) return [{
    text: A,
    start: 0
  }];
  let B = [...Q].sort((W, X) => {
      if (W.start !== X.start) return W.start - X.start;
      return X.priority - W.priority
    }),
    G = [],
    Z = [];
  for (let W of B)
    if (!Z.some((V) => W.start >= V.start && W.start < V.end || W.end > V.start && W.end <= V.end || W.start <= V.start && W.end >= V.end)) G.push(W), Z.push({
      start: W.start,
      end: W.end
    });
  let I = [],
    Y = 0,
    J = cY(A).length;
  for (let W of G) {
    if (W.start > Y) I.push({
      text: ct(A, Y, W.start),
      start: Y
    });
    I.push({
      text: ct(A, W.start, W.end),
      start: W.start,
      highlight: W
    }), Y = W.end
  }
  if (Y < J) I.push({
    text: ct(A, Y),
    start: Y
  });
  return I
}
// @from(Start 6652615, End 6652649)
XOB = L(() => {
  Tg1();
  ET()
})
// @from(Start 6652652, End 6653781)
function VOB({
  text: A,
  highlights: Q = []
}) {
  let B = WOB(A, Q),
    G = T$A("requesting", A, !0, !1);
  return mH.createElement(mH.Fragment, null, B.map((Z, I) => {
    if (!Z.highlight) return mH.createElement($, {
      key: I
    }, Z.text);
    let {
      style: Y
    } = Z.highlight;
    if (Y.type === "rainbow") return Z.text.split("").map((J, W) => {
      let X = Z.start + W,
        V = O$A(W, !1),
        F = O$A(W, !0);
      return mH.createElement(AGA, {
        key: `${I}-${W}`,
        char: J,
        index: X,
        glimmerIndex: G,
        messageColor: V,
        shimmerColor: F
      })
    });
    else if (Y.type === "shimmer") return Z.text.split("").map((J, W) => {
      let X = Z.start + W;
      return mH.createElement(AGA, {
        key: `${I}-${W}`,
        char: J,
        index: X,
        glimmerIndex: G,
        messageColor: Y.baseColor,
        shimmerColor: Y.shimmerColor
      })
    });
    else if (Y.type === "solid") return mH.createElement($, {
      key: I,
      color: Y.color
    }, Z.text);
    return mH.createElement($, {
      key: I
    }, Z.text)
  }))
}
// @from(Start 6653786, End 6653788)
mH
// @from(Start 6653794, End 6653874)
FOB = L(() => {
  hA();
  KrA();
  Lm1();
  CU();
  XOB();
  mH = BA(VA(), 1)
})
// @from(Start 6653877, End 6655205)
function DrA({
  inputState: A,
  children: Q,
  terminalFocus: B,
  ...G
}) {
  let {
    onInput: Z,
    renderedValue: I
  } = A, {
    wrappedOnInput: Y,
    isPasting: J
  } = ZOB({
    onPaste: G.onPaste,
    onInput: (C, E) => {
      if (J && E.return) return;
      Z(C, E)
    },
    onImagePaste: G.onImagePaste
  }), {
    onIsPastingChange: W
  } = G;
  BGA.default.useEffect(() => {
    if (W) W(J)
  }, [J, W]);
  let {
    showPlaceholder: X,
    renderedPlaceholder: V
  } = YOB({
    placeholder: G.placeholder,
    value: G.value,
    showCursor: G.showCursor,
    focus: G.focus,
    terminalFocus: B
  });
  f1(Y, {
    isActive: G.focus
  });
  let F = G.value && G.value.trim().indexOf(" ") === -1 || G.value && G.value.endsWith(" "),
    K = Boolean(G.argumentHint && G.value && F && G.value.startsWith("/")),
    D = G.showCursor && G.highlights ? G.highlights.filter((C) => G.cursorOffset < C.start || G.cursorOffset >= C.end) : G.highlights,
    H = D && D.length > 0;
  return BGA.default.createElement(S, null, BGA.default.createElement($, {
    wrap: "truncate-end",
    dimColor: G.dimColor
  }, X ? V : H ? BGA.default.createElement(VOB, {
    text: I,
    highlights: D
  }) : I, K && BGA.default.createElement($, {
    dimColor: !0
  }, G.value?.endsWith(" ") ? "" : " ", G.argumentHint), Q))
}
// @from(Start 6655210, End 6655213)
BGA
// @from(Start 6655219, End 6655292)
Mm1 = L(() => {
  hA();
  IOB();
  JOB();
  FOB();
  BGA = BA(VA(), 1)
})
// @from(Start 6655295, End 6655465)
function Rm1(A) {
  let Q = A.toString();
  if (Q.includes("\x1B[I")) Om1 = !0, Be.forEach((B) => B(!0));
  if (Q.includes("\x1B[O")) Om1 = !1, Be.forEach((B) => B(!1))
}
// @from(Start 6655467, End 6655635)
function KOB() {
  let A = () => {
    if (Be.size === 0) return;
    process.stdin.off("data", Rm1), process.stdout.write("\x1B[?1004l")
  };
  process.on("exit", A)
}
// @from(Start 6655637, End 6656412)
function HrA() {
  let [A, Q] = Vf.useState(Om1), [B, G] = Vf.useState(!1), Z = Vf.useCallback((Y) => {
    Q(Y), G(!1)
  }, []);
  Vf.useEffect(() => {
    if (!process.stdout.isTTY) return;
    if (Be.add(Z), Be.size === 1) process.stdout.write("\x1B[?1004h"), process.stdin.on("data", Rm1);
    return () => {
      if (Be.delete(Z), Be.size === 0) process.stdin.off("data", Rm1), process.stdout.write("\x1B[?1004l")
    }
  }, [Z]), Vf.useEffect(() => {
    if (!A && B) GA("tengu_typing_without_terminal_focus", {})
  }, [A, B]);
  let I = Vf.useCallback((Y, J) => {
    if (Y === "\x1B[I" || Y === "\x1B[O" || Y === "[I" || Y === "[O") return "";
    if ((Y || J) && !A) G(!0);
    return Y
  }, [A]);
  return {
    isFocused: A || B,
    filterFocusSequences: I
  }
}
// @from(Start 6656417, End 6656419)
Vf
// @from(Start 6656421, End 6656429)
Om1 = !0
// @from(Start 6656433, End 6656435)
Be
// @from(Start 6656441, End 6656500)
CrA = L(() => {
  q0();
  Vf = BA(VA(), 1), Be = new Set
})
// @from(Start 6656503, End 6657438)
function s4(A) {
  let [Q] = qB(), {
    isFocused: B,
    filterFocusSequences: G
  } = HrA(), Z = FrA({
    value: A.value,
    onChange: A.onChange,
    onSubmit: A.onSubmit,
    onExit: A.onExit,
    onExitMessage: A.onExitMessage,
    onHistoryReset: A.onHistoryReset,
    onHistoryUp: A.onHistoryUp,
    onHistoryDown: A.onHistoryDown,
    focus: A.focus,
    mask: A.mask,
    multiline: A.multiline,
    cursorChar: A.showCursor ? " " : "",
    highlightPastedText: A.highlightPastedText,
    invert: B ? tA.inverse : (I) => I,
    themeText: ZB("text", Q),
    columns: A.columns,
    onImagePaste: A.onImagePaste,
    disableCursorMovementForUpDownKeys: A.disableCursorMovementForUpDownKeys,
    externalOffset: A.cursorOffset,
    onOffsetChange: A.onChangeCursorOffset,
    inputFilter: G
  });
  return DOB.default.createElement(DrA, {
    inputState: Z,
    terminalFocus: B,
    highlights: A.highlights,
    ...A
  })
}
// @from(Start 6657443, End 6657446)
DOB
// @from(Start 6657452, End 6657532)
ZY = L(() => {
  F9();
  Um1();
  Mm1();
  CrA();
  hA();
  DOB = BA(VA(), 1)
})
// @from(Start 6657535, End 6659048)
function GGA({
  option: A,
  isFocused: Q,
  isSelected: B,
  shouldShowDownArrow: G,
  shouldShowUpArrow: Z,
  maxIndexWidth: I,
  index: Y,
  inputValue: J,
  onInputChange: W,
  onSubmit: X,
  onExit: V,
  layout: F,
  children: K
}) {
  let [D, H] = Qq.useState(0), C = F === "expanded" ? I + 3 : I + 4;
  return Qq.default.createElement(S, {
    flexDirection: "column",
    flexShrink: 0
  }, Qq.default.createElement(Xp, {
    isFocused: Q,
    isSelected: B,
    shouldShowDownArrow: G,
    shouldShowUpArrow: Z
  }, Qq.default.createElement(S, {
    flexDirection: "row",
    flexShrink: F === "compact" ? 0 : void 0
  }, Qq.default.createElement($, {
    color: B ? "success" : Q ? "suggestion" : void 0
  }, tA.dim(`${Y}.`.padEnd(I + 1)), " "), K, Q ? Qq.default.createElement(s4, {
    value: J,
    onChange: (E) => {
      W(E), A.onChange(E)
    },
    onSubmit: X,
    onExit: V,
    placeholder: A.placeholder || A.label,
    focus: !0,
    showCursor: !0,
    cursorOffset: D,
    onChangeCursorOffset: H,
    columns: 80
  }) : Qq.default.createElement(S, {
    width: 80
  }, Qq.default.createElement($, {
    color: B ? "success" : Q ? "suggestion" : J ? void 0 : "inactive"
  }, J || A.placeholder || A.label)))), A.description && Qq.default.createElement(S, {
    paddingLeft: C
  }, Qq.default.createElement($, {
    dimColor: A.dimDescription !== !1,
    color: B ? "success" : Q ? "suggestion" : void 0
  }, A.description)), F === "expanded" && Qq.default.createElement($, null, " "))
}
// @from(Start 6659053, End 6659055)
Qq
// @from(Start 6659061, End 6659131)
Tm1 = L(() => {
  hA();
  MsA();
  ZY();
  F9();
  Qq = BA(VA(), 1)
})
// @from(Start 6659134, End 6666936)
function M0({
  isDisabled: A = !1,
  hideIndexes: Q = !1,
  visibleOptionCount: B = 5,
  highlightText: G,
  options: Z,
  defaultValue: I,
  onCancel: Y,
  onChange: J,
  onFocus: W,
  focusValue: X,
  layout: V = "compact",
  disableSelection: F = !1
}) {
  let [K, D] = V3.useState(() => {
    let N = new Map;
    return Z.forEach((R) => {
      if (R.type === "input" && R.initialValue) N.set(R.value, R.initialValue)
    }), N
  }), H = TNB({
    visibleOptionCount: B,
    options: Z,
    defaultValue: I,
    onChange: J,
    onCancel: Y,
    onFocus: W,
    focusValue: X
  });
  jNB({
    isDisabled: A,
    disableSelection: F || (Q ? "numeric" : !1),
    state: H,
    options: Z,
    isMultiSelect: !1
  });
  let C = {
    container: () => ({
      flexDirection: "column"
    }),
    highlightedText: () => ({
      bold: !0
    })
  };
  if (V === "expanded") {
    let N = H.options.length.toString().length;
    return V3.default.createElement(S, {
      ...C.container()
    }, H.visibleOptions.map((R, T) => {
      let y = R.index === H.visibleFromIndex,
        v = R.index === H.visibleToIndex - 1,
        x = H.visibleToIndex < Z.length,
        p = H.visibleFromIndex > 0,
        u = H.visibleFromIndex + T + 1,
        e = !A && H.focusedValue === R.value,
        l = H.value === R.value;
      if (R.type === "input") {
        let FA = K.get(R.value) || "";
        return V3.default.createElement(GGA, {
          key: String(R.value),
          option: R,
          isFocused: e,
          isSelected: l,
          shouldShowDownArrow: x && v,
          shouldShowUpArrow: p && y,
          maxIndexWidth: N,
          index: u,
          inputValue: FA,
          onInputChange: (zA) => {
            D((NA) => {
              let OA = new Map(NA);
              return OA.set(R.value, zA), OA
            })
          },
          onSubmit: (zA) => {
            if (zA.trim()) J?.(R.value)
          },
          onExit: Y,
          layout: "expanded"
        })
      }
      let k = R.label,
        m = k;
      if (G && k.includes(G)) {
        let FA = k.indexOf(G);
        m = V3.default.createElement(V3.default.Fragment, null, k.slice(0, FA), V3.default.createElement($, {
          ...C.highlightedText()
        }, G), k.slice(FA + G.length))
      }
      let o = R.disabled === !0,
        IA = o ? void 0 : l ? "success" : e ? "suggestion" : void 0;
      return V3.default.createElement(S, {
        key: String(R.value),
        flexDirection: "column",
        flexShrink: 0
      }, V3.default.createElement(Xp, {
        isFocused: e,
        isSelected: l,
        shouldShowDownArrow: x && v,
        shouldShowUpArrow: p && y
      }, V3.default.createElement($, {
        dimColor: o,
        color: IA
      }, m)), R.description && V3.default.createElement(S, {
        paddingLeft: 2
      }, V3.default.createElement($, {
        dimColor: o || R.dimDescription !== !1,
        color: IA
      }, R.description)), V3.default.createElement($, null, " "))
    }))
  }
  if (V === "compact-vertical") {
    let N = Q ? 0 : H.options.length.toString().length;
    return V3.default.createElement(S, {
      ...C.container()
    }, H.visibleOptions.map((R, T) => {
      let y = R.index === H.visibleFromIndex,
        v = R.index === H.visibleToIndex - 1,
        x = H.visibleToIndex < Z.length,
        p = H.visibleFromIndex > 0,
        u = H.visibleFromIndex + T + 1,
        e = !A && H.focusedValue === R.value,
        l = H.value === R.value;
      if (R.type === "input") {
        let IA = K.get(R.value) || "";
        return V3.default.createElement(GGA, {
          key: String(R.value),
          option: R,
          isFocused: e,
          isSelected: l,
          shouldShowDownArrow: x && v,
          shouldShowUpArrow: p && y,
          maxIndexWidth: N,
          index: u,
          inputValue: IA,
          onInputChange: (FA) => {
            D((zA) => {
              let NA = new Map(zA);
              return NA.set(R.value, FA), NA
            })
          },
          onSubmit: (FA) => {
            if (FA.trim()) J?.(R.value)
          },
          onExit: Y,
          layout: "compact"
        })
      }
      let k = R.label,
        m = k;
      if (G && k.includes(G)) {
        let IA = k.indexOf(G);
        m = V3.default.createElement(V3.default.Fragment, null, k.slice(0, IA), V3.default.createElement($, {
          ...C.highlightedText()
        }, G), k.slice(IA + G.length))
      }
      let o = R.disabled === !0;
      return V3.default.createElement(S, {
        key: String(R.value),
        flexDirection: "column",
        flexShrink: 0
      }, V3.default.createElement(Xp, {
        isFocused: e,
        isSelected: l,
        shouldShowDownArrow: x && v,
        shouldShowUpArrow: p && y
      }, V3.default.createElement($, {
        dimColor: o,
        color: o ? void 0 : l ? "success" : e ? "suggestion" : void 0
      }, !Q && tA.dim(`${u}.`.padEnd(N + 2)), m)), R.description && V3.default.createElement(S, {
        paddingLeft: Q ? 2 : N + 4
      }, V3.default.createElement($, {
        dimColor: o || R.dimDescription !== !1,
        color: o ? void 0 : l ? "success" : e ? "suggestion" : void 0
      }, R.description)))
    }))
  }
  let E = Q ? 0 : H.options.length.toString().length,
    U = Math.max(...H.options.map((N) => N.label.length)),
    q = Q ? 0 : 2,
    w = E + U + q;
  return V3.default.createElement(S, {
    ...C.container()
  }, H.visibleOptions.map((N, R) => {
    if (N.type === "input") {
      let o = K.get(N.value) || "",
        IA = N.index === H.visibleFromIndex,
        FA = N.index === H.visibleToIndex - 1,
        zA = H.visibleToIndex < Z.length,
        NA = H.visibleFromIndex > 0,
        OA = H.visibleFromIndex + R + 1,
        mA = !A && H.focusedValue === N.value,
        wA = H.value === N.value;
      return V3.default.createElement(GGA, {
        key: String(N.value),
        option: N,
        isFocused: mA,
        isSelected: wA,
        shouldShowDownArrow: zA && FA,
        shouldShowUpArrow: NA && IA,
        maxIndexWidth: E,
        index: OA,
        inputValue: o,
        onInputChange: (qA) => {
          D((KA) => {
            let yA = new Map(KA);
            return yA.set(N.value, qA), yA
          })
        },
        onSubmit: (qA) => {
          if (qA.trim()) J?.(N.value)
        },
        onExit: Y,
        layout: "compact"
      })
    }
    let T = N.label,
      y = T;
    if (G && T.includes(G)) {
      let o = T.indexOf(G);
      y = V3.default.createElement(V3.default.Fragment, null, T.slice(0, o), V3.default.createElement($, {
        ...C.highlightedText()
      }, G), T.slice(o + G.length))
    }
    let v = N.index === H.visibleFromIndex,
      x = N.index === H.visibleToIndex - 1,
      p = H.visibleToIndex < Z.length,
      u = H.visibleFromIndex > 0,
      e = H.visibleFromIndex + R + 1,
      l = !A && H.focusedValue === N.value,
      k = H.value === N.value,
      m = N.disabled === !0;
    return V3.default.createElement(Xp, {
      key: String(N.value),
      isFocused: l,
      isSelected: k,
      shouldShowDownArrow: p && x,
      shouldShowUpArrow: u && v
    }, V3.default.createElement(S, {
      flexDirection: "row",
      flexShrink: 0,
      width: N.description ? w : void 0
    }, V3.default.createElement($, {
      dimColor: m,
      color: m ? void 0 : k ? "success" : l ? "suggestion" : void 0
    }, !Q && tA.dim(`${e}.`.padEnd(E + 2)), y)), N.description && V3.default.createElement(S, {
      flexShrink: 99,
      marginLeft: 2
    }, V3.default.createElement($, {
      wrap: "wrap-trim",
      dimColor: m || N.dimDescription !== !1,
      color: m ? void 0 : k ? "success" : l ? "suggestion" : void 0
    }, N.description)))
  }))
}
// @from(Start 6666941, End 6666943)
V3
// @from(Start 6666949, End 6667037)
S5 = L(() => {
  hA();
  MsA();
  PNB();
  SNB();
  F9();
  Tm1();
  V3 = BA(VA(), 1)
})
// @from(Start 6667043, End 6667081)
HOB = "https://claude.com/claude-code"
// @from(Start 6667084, End 6667246)
function ErA() {
  let A = process.env.BASH_DEFAULT_TIMEOUT_MS;
  if (A) {
    let Q = parseInt(A, 10);
    if (!isNaN(Q) && Q > 0) return Q
  }
  return 120000
}
// @from(Start 6667248, End 6667440)
function COB() {
  let A = process.env.BASH_MAX_TIMEOUT_MS;
  if (A) {
    let Q = parseInt(A, 10);
    if (!isNaN(Q) && Q > 0) return Math.max(Q, ErA())
  }
  return Math.max(600000, ErA())
}
// @from(Start 6667442, End 6667611)
function Ge() {
  let A = DkA.validate(process.env.BASH_MAX_OUTPUT_LENGTH);
  if (A.status === "capped") g(`BASH_MAX_OUTPUT_LENGTH ${A.message}`);
  return A.effective
}
// @from(Start 6667613, End 6667646)
function ZGA() {
  return ErA()
}
// @from(Start 6667648, End 6667681)
function zrA() {
  return COB()
}
// @from(Start 6667683, End 6667974)
function mU6() {
  if (!(((l0() || {}).includeCoAuthoredBy ?? !0) && qkA() !== "remote")) return {
    commit: "",
    pr: ""
  };
  let B = `\uD83E\uDD16 Generated with [Claude Code](${HOB})`;
  return {
    commit: `${B}

   Co-Authored-By: Claude <noreply@anthropic.com>`,
    pr: B
  }
}
// @from(Start 6667976, End 6671559)
function dU6() {
  if (!nQ.isSandboxingEnabled()) return "";
  let A = nQ.getFsReadConfig(),
    Q = nQ.getFsWriteConfig(),
    B = nQ.getNetworkRestrictionConfig(),
    G = nQ.getAllowUnixSockets(),
    Z = nQ.getIgnoreViolations(),
    I = nQ.areUnsandboxedCommandsAllowed(),
    Y = {
      read: A,
      write: Q
    },
    J = {
      ...B?.allowedHosts && {
        allowedHosts: B.allowedHosts
      },
      ...B?.deniedHosts && {
        deniedHosts: B.deniedHosts
      },
      ...G && {
        allowUnixSockets: G
      }
    },
    W = [];
  if (Object.keys(Y).length > 0) W.push(`    - Filesystem: ${JSON.stringify(Y,null,2).split(`
`).join(`
      `)}`);
  if (Object.keys(J).length > 0) W.push(`    - Network: ${JSON.stringify(J,null,2).split(`
`).join(`
      `)}`);
  if (Z) W.push(`    - Ignored violations: ${JSON.stringify(Z,null,2).split(`
`).join(`
      `)}`);
  let X = bZ() ? "    - EXCEPTION: `mcp-cli` commands must always be called with `dangerouslyDisableSandbox: true` as they do not work properly in sandboxed mode\n" : "",
    V = I ? `  - CRITICAL: Commands run in sandbox mode by default - do NOT set \`dangerouslyDisableSandbox\`
    - Even if you have recently run commands with \`dangerouslyDisableSandbox: true\`, you MUST NOT continue that pattern
    - VERY IMPORTANT: Do NOT learn from or repeat the pattern of overriding sandbox - each command should run sandboxed by default
${X}    - Set \`dangerouslyDisableSandbox: true\` if:
      1. The user *explicitly* asks to bypass sandbox, OR
      2. A command just failed and you see evidence of sandbox restrictions causing the failure
    - When analyzing failures:
      - Commands can fail for many reasons unrelated to the sandbox (missing files, wrong arguments, network issues, etc.)
      - Evidence of sandbox-caused failures includes:
        - "Operation not permitted" errors for file/network operations
        - Access denied to specific paths outside allowed directories
        - Network connection failures to non-whitelisted hosts
        - Unix socket connection errors
      - Sandbox violation logs can be noisy, but clear permission errors are strong indicators
    - When you see evidence of sandbox-caused failure:
      - IMMEDIATELY retry with \`dangerouslyDisableSandbox: true\` (don't ask, just do it)
      - Briefly explain what sandbox restriction likely caused the failure
      - Mention: "Use \`/sandbox\` to manage restrictions"
      - This will prompt the user for permission
    - Example of normal usage: { "command": "ls", "description": "List files" }
    - Example of override: { "command": "my-tool", "description": "Run my-tool", "dangerouslyDisableSandbox": true }
    - DO NOT suggest adding sensitive paths like ~/.bashrc, ~/.zshrc, ~/.ssh/*, or credential files to the allowlist` : "  - CRITICAL: All commands MUST run in sandbox mode - the `dangerouslyDisableSandbox` parameter is disabled by policy\n    - Commands cannot run outside the sandbox under any circumstances\n    - If a command fails due to sandbox restrictions, work with the user to adjust sandbox settings instead";
  return `- Commands run in a sandbox by default with the following restrictions:
${W.join(`
`)}
${V}
  - IMPORTANT: For temporary files, use \`/tmp/claude/\` as your temporary directory
    - The TMPDIR environment variable is automatically set to \`/tmp/claude\` when running in sandbox mode
    - Do NOT use \`/tmp\` directly - use \`/tmp/claude/\` or rely on TMPDIR instead
    - Most programs that respect TMPDIR will automatically use \`/tmp/claude/\``
}
// @from(Start 6671561, End 6675285)
function EOB() {
  return `Executes a given bash command in a persistent shell session with optional timeout, ensuring proper handling and security measures.

IMPORTANT: This tool is for terminal operations like git, npm, docker, etc. DO NOT use it for file operations (reading, writing, editing, searching, finding files) - use the specialized tools for this instead.

Before executing the command, please follow these steps:

1. Directory Verification:
   - If the command will create new directories or files, first use \`ls\` to verify the parent directory exists and is the correct location
   - For example, before running "mkdir foo/bar", first use \`ls foo\` to check that "foo" exists and is the intended parent directory

2. Command Execution:
   - Always quote file paths that contain spaces with double quotes (e.g., cd "path with spaces/file.txt")
   - Examples of proper quoting:
     - cd "/Users/name/My Documents" (correct)
     - cd /Users/name/My Documents (incorrect - will fail)
     - python "/path/with spaces/script.py" (correct)
     - python /path/with spaces/script.py (incorrect - will fail)
   - After ensuring proper quoting, execute the command.
   - Capture the output of the command.

Usage notes:
  - The command argument is required.
  - You can specify an optional timeout in milliseconds (up to ${zrA()}ms / ${zrA()/60000} minutes). If not specified, commands will timeout after ${ZGA()}ms (${ZGA()/60000} minutes).
  - It is very helpful if you write a clear, concise description of what this command does in 5-10 words.
  - If the output exceeds ${Ge()} characters, output will be truncated before being returned to you.
  - You can use the \`run_in_background\` parameter to run the command in the background, which allows you to continue working while the command runs. You can monitor the output using the ${C9} tool as it becomes available. You do not need to use '&' at the end of the command when using this parameter.
  ${dU6()}
  - Avoid using Bash with the \`find\`, \`grep\`, \`cat\`, \`head\`, \`tail\`, \`sed\`, \`awk\`, or \`echo\` commands, unless explicitly instructed or when these commands are truly necessary for the task. Instead, always prefer using the dedicated tools for these commands:
    - File search: Use ${iK} (NOT find or ls)
    - Content search: Use ${xY} (NOT grep or rg)
    - Read files: Use ${d5} (NOT cat/head/tail)
    - Edit files: Use ${$5} (NOT sed/awk)
    - Write files: Use ${wX} (NOT echo >/cat <<EOF)
    - Communication: Output text directly (NOT echo/printf)
  - When issuing multiple commands:
    - If the commands are independent and can run in parallel, make multiple ${C9} tool calls in a single message. For example, if you need to run "git status" and "git diff", send a single message with two ${C9} tool calls in parallel.
    - If the commands depend on each other and must run sequentially, use a single ${C9} call with '&&' to chain them together (e.g., \`git add . && git commit -m "message" && git push\`). For instance, if one operation must complete before another starts (like mkdir before cp, Write before Bash for git operations, or git add before git commit), run these operations sequentially instead.
    - Use ';' only when you need to run commands sequentially but don't care if earlier commands fail
    - DO NOT use newlines to separate commands (newlines are ok in quoted strings)
  - Try to maintain your current working directory throughout the session by using absolute paths and avoiding usage of \`cd\`. You may use \`cd\` if the User explicitly requests it.
    <good-example>
    pytest /foo/bar/tests
    </good-example>
    <bad-example>
    cd /foo/bar && pytest tests
    </bad-example>

${cU6()}`
}
// @from(Start 6675287, End 6681536)
function cU6() {
  let {
    commit: Q,
    pr: B
  } = mU6();
  return `# Committing changes with git

Only create commits when requested by the user. If unclear, ask first. When the user asks you to create a new git commit, follow these steps carefully:

Git Safety Protocol:
- NEVER update the git config
- NEVER run destructive/irreversible git commands (like push --force, hard reset, etc) unless the user explicitly requests them 
- NEVER skip hooks (--no-verify, --no-gpg-sign, etc) unless the user explicitly requests it
- NEVER run force push to main/master, warn the user if they request it
- Avoid git commit --amend.  ONLY use --amend when either (1) user explicitly requested amend OR (2) adding edits from pre-commit hook (additional instructions below) 
- Before amending: ALWAYS check authorship (git log -1 --format='%an %ae')
- NEVER commit changes unless the user explicitly asks you to. It is VERY IMPORTANT to only commit when explicitly asked, otherwise the user will feel that you are being too proactive.

1. You can call multiple tools in a single response. When multiple independent pieces of information are requested and all commands are likely to succeed, run multiple tool calls in parallel for optimal performance. run the following bash commands in parallel, each using the ${C9} tool:
  - Run a git status command to see all untracked files.
  - Run a git diff command to see both staged and unstaged changes that will be committed.
  - Run a git log command to see recent commit messages, so that you can follow this repository's commit message style.
2. Analyze all staged changes (both previously staged and newly added) and draft a commit message:
  - Summarize the nature of the changes (eg. new feature, enhancement to an existing feature, bug fix, refactoring, test, docs, etc.). Ensure the message accurately reflects the changes and their purpose (i.e. "add" means a wholly new feature, "update" means an enhancement to an existing feature, "fix" means a bug fix, etc.).
  - Do not commit files that likely contain secrets (.env, credentials.json, etc). Warn the user if they specifically request to commit those files
  - Draft a concise (1-2 sentences) commit message that focuses on the "why" rather than the "what"
  - Ensure it accurately reflects the changes and their purpose
3. You can call multiple tools in a single response. When multiple independent pieces of information are requested and all commands are likely to succeed, run multiple tool calls in parallel for optimal performance. run the following commands:
   - Add relevant untracked files to the staging area.
   - Create the commit with a message${Q?` ending with:
   ${Q}`:"."}
   - Run git status after the commit completes to verify success.
   Note: git status depends on the commit completing, so run it sequentially after the commit.
4. If the commit fails due to pre-commit hook changes, retry ONCE. If it succeeds but files were modified by the hook, verify it's safe to amend:
   - Check HEAD commit: git log -1 --format='[%h] (%an <%ae>) %s'. VERIFY it matches your commit
   - Check not pushed: git status shows "Your branch is ahead"
   - If both true: amend your commit. Otherwise: create NEW commit (never amend other developers' commits)

Important notes:
- NEVER run additional commands to read or explore code, besides git bash commands
- NEVER use the ${BY.name} or ${A6} tools
- DO NOT push to the remote repository unless the user explicitly asks you to do so
- IMPORTANT: Never use git commands with the -i flag (like git rebase -i or git add -i) since they require interactive input which is not supported.
- If there are no changes to commit (i.e., no untracked files and no modifications), do not create an empty commit
- In order to ensure good formatting, ALWAYS pass the commit message via a HEREDOC, a la this example:
<example>
git commit -m "$(cat <<'EOF'
   Commit message here.${Q?`

   ${Q}`:""}
   EOF
   )"
</example>

# Creating pull requests
Use the gh command via the Bash tool for ALL GitHub-related tasks including working with issues, pull requests, checks, and releases. If given a Github URL use the gh command to get the information needed.

IMPORTANT: When the user asks you to create a pull request, follow these steps carefully:

1. You can call multiple tools in a single response. When multiple independent pieces of information are requested and all commands are likely to succeed, run multiple tool calls in parallel for optimal performance. run the following bash commands in parallel using the ${C9} tool, in order to understand the current state of the branch since it diverged from the main branch:
   - Run a git status command to see all untracked files
   - Run a git diff command to see both staged and unstaged changes that will be committed
   - Check if the current branch tracks a remote branch and is up to date with the remote, so you know if you need to push to the remote
   - Run a git log command and \`git diff [base-branch]...HEAD\` to understand the full commit history for the current branch (from the time it diverged from the base branch)
2. Analyze all changes that will be included in the pull request, making sure to look at all relevant commits (NOT just the latest commit, but ALL commits that will be included in the pull request!!!), and draft a pull request summary
3. You can call multiple tools in a single response. When multiple independent pieces of information are requested and all commands are likely to succeed, run multiple tool calls in parallel for optimal performance. run the following commands in parallel:
   - Create new branch if needed
   - Push to remote with -u flag if needed
   - Create PR using gh pr create with the format below. Use a HEREDOC to pass the body to ensure correct formatting.
<example>
gh pr create --title "the pr title" --body "$(cat <<'EOF'
## Summary
<1-3 bullet points>

## Test plan
[Bulleted markdown checklist of TODOs for testing the pull request...]${B?`

${B}`:""}
EOF
)"
</example>

Important:
- DO NOT use the ${BY.name} or ${A6} tools
- Return the PR URL when you're done, so the user can see it

# Other common operations
- View comments on a Github PR: gh api repos/foo/bar/pulls/123/comments`
}
// @from(Start 6681541, End 6681639)
IGA = L(() => {
  yR();
  MB();
  wF();
  YS();
  kt();
  V0();
  CkA();
  _0();
  $J();
  dH()
})
// @from(Start 6681642, End 6681827)
function Pm1(A) {
  if (/\d\s*<<\s*\d/.test(A) || /\[\[\s*\d+\s*<<\s*\d+\s*\]\]/.test(A) || /\$\(\(.*<<.*\)\)/.test(A)) return !1;
  return /<<-?\s*(?:(['"]?)(\w+)\1|\\(\w+))/.test(A)
}
// @from(Start 6681829, End 6681974)
function pU6(A) {
  let Q = /'(?:[^'\\]|\\.)*\n(?:[^'\\]|\\.)*'/,
    B = /"(?:[^"\\]|\\.)*\n(?:[^"\\]|\\.)*"/;
  return Q.test(A) || B.test(A)
}
// @from(Start 6681976, End 6682201)
function zOB(A, Q = !0) {
  if (Pm1(A) || pU6(A)) {
    let G = `'${A.replace(/'/g,`'"'"'`)}'`;
    if (Pm1(A)) return G;
    return Q ? `${G} < /dev/null` : G
  }
  if (Q) return z8([A, "<", "/dev/null"]);
  return z8([A])
}
// @from(Start 6682203, End 6682270)
function lU6(A) {
  return /(?:^|[\s;&|])<(?![<(])\s*\S+/.test(A)
}
// @from(Start 6682272, End 6682353)
function UOB(A) {
  if (Pm1(A)) return !1;
  if (lU6(A)) return !1;
  return !0
}
// @from(Start 6682358, End 6682383)
$OB = L(() => {
  dK()
})
// @from(Start 6682386, End 6682710)
function qOB(A) {
  if (A.includes("`")) return z8([A, "<", "/dev/null"]);
  let Q = JW(A);
  if (!Q.success) return z8([A, "<", "/dev/null"]);
  let B = Q.tokens,
    G = iU6(B);
  if (G <= 0) return z8([A, "<", "/dev/null"]);
  let Z = [...wOB(B, 0, G), "< /dev/null", ...wOB(B, G, B.length)];
  return z8([Z.join(" ")])
}
// @from(Start 6682712, End 6682834)
function iU6(A) {
  for (let Q = 0; Q < A.length; Q++) {
    let B = A[Q];
    if (jm1(B, "|")) return Q
  }
  return -1
}
// @from(Start 6682836, End 6683925)
function wOB(A, Q, B) {
  let G = [],
    Z = !1;
  for (let I = Q; I < B; I++) {
    let Y = A[I];
    if (typeof Y === "string" && /^[012]$/.test(Y) && I + 2 < B && jm1(A[I + 1])) {
      let J = A[I + 1],
        W = A[I + 2];
      if (J.op === ">&" && typeof W === "string" && /^[012]$/.test(W)) {
        G.push(`${Y}>&${W}`), I += 2;
        continue
      }
      if (J.op === ">" && W === "/dev/null") {
        G.push(`${Y}>/dev/null`), I += 2;
        continue
      }
      if (J.op === ">" && typeof W === "string" && W.startsWith("&")) {
        let X = W.slice(1);
        if (/^[012]$/.test(X)) {
          G.push(`${Y}>&${X}`), I += 2;
          continue
        }
      }
    }
    if (typeof Y === "string")
      if (!Z && nU6(Y)) {
        let W = Y.indexOf("="),
          X = Y.slice(0, W),
          V = Y.slice(W + 1),
          F = z8([V]);
        G.push(`${X}=${F}`)
      } else Z = !0, G.push(z8([Y]));
    else if (jm1(Y)) {
      if (Y.op === "glob" && "pattern" in Y) G.push(Y.pattern);
      else if (G.push(Y.op), aU6(Y.op)) Z = !1
    }
  }
  return G
}
// @from(Start 6683927, End 6683990)
function nU6(A) {
  return /^[A-Za-z_][A-Za-z0-9_]*=/.test(A)
}
// @from(Start 6683992, End 6684058)
function aU6(A) {
  return A === "&&" || A === "||" || A === ";"
}
// @from(Start 6684060, End 6684173)
function jm1(A, Q) {
  if (!A || typeof A !== "object" || !("op" in A)) return !1;
  return Q ? A.op === Q : !0
}
// @from(Start 6684178, End 6684203)
NOB = L(() => {
  dK()
})
// @from(Start 6684465, End 6684619)
function A$6() {
  let A = Y9A(),
    Q = z8([A.rgPath]),
    B = A.rgArgs.map((G) => z8([G]));
  return A.rgArgs.length > 0 ? `${Q} ${B.join(" ")}` : Q
}
// @from(Start 6684621, End 6684757)
function km1(A) {
  let Q = A.includes("zsh") ? ".zshrc" : A.includes("bash") ? ".bashrc" : ".profile";
  return _m1(UrA.homedir(), Q)
}
// @from(Start 6684759, End 6686830)
function Q$6(A) {
  let Q = A.endsWith(".zshrc"),
    B = "";
  if (Q) B += `
      echo "# Functions" >> "$SNAPSHOT_FILE"

      # Force autoload all functions first
      typeset -f > /dev/null 2>&1

      # Now get user function names - filter system ones and write directly to file
      typeset +f | grep -vE '^(_|__)' | while read func; do
        typeset -f "$func" >> "$SNAPSHOT_FILE"
      done
    `;
  else B += `
      echo "# Functions" >> "$SNAPSHOT_FILE"

      # Force autoload all functions first
      declare -f > /dev/null 2>&1

      # Now get user function names - filter system ones and give the rest to eval in b64 encoding
      declare -F | cut -d' ' -f3 | grep -vE '^(_|__)' | while read func; do
        # Encode the function to base64, preserving all special characters
        encoded_func=$(declare -f "$func" | base64 )
        # Write the function definition to the snapshot
        echo "eval ${Sm1}"${Sm1}$(echo '$encoded_func' | base64 -d)${Sm1}" > /dev/null 2>&1" >> "$SNAPSHOT_FILE"
      done
    `;
  if (Q) B += `
      echo "# Shell Options" >> "$SNAPSHOT_FILE"
      setopt | sed 's/^/setopt /' | head -n 1000 >> "$SNAPSHOT_FILE"
    `;
  else B += `
      echo "# Shell Options" >> "$SNAPSHOT_FILE"
      shopt -p | head -n 1000 >> "$SNAPSHOT_FILE"
      set -o | grep "on" | awk '{print "set -o " $1}' | head -n 1000 >> "$SNAPSHOT_FILE"
      echo "shopt -s expand_aliases" >> "$SNAPSHOT_FILE"
    `;
  return B += `
      echo "# Aliases" >> "$SNAPSHOT_FILE"
      # Filter out winpty aliases on Windows to avoid "stdin is not a tty" errors
      # Git Bash automatically creates aliases like "alias node='winpty node.exe'" for
      # programs that need Win32 Console in mintty, but winpty fails when there's no TTY
      if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        alias | grep -v "='winpty " | sed 's/^alias //g' | sed 's/^/alias -- /' | head -n 1000 >> "$SNAPSHOT_FILE"
      else
        alias | sed 's/^alias //g' | sed 's/^/alias -- /' | head -n 1000 >> "$SNAPSHOT_FILE"
      fi
  `, B
}
// @from(Start 6686832, End 6687191)
function B$6() {
  if (!bZ()) return null;
  try {
    let A = UX() ? process.execPath : process.argv[1];
    if (!A) return null;
    try {
      A = oU6(A)
    } catch {}
    if (dQ() === "windows") A = rj(A);
    return {
      cliPath: A,
      args: ["--mcp-cli"]
    }
  } catch (A) {
    return AA(A instanceof Error ? A : Error(String(A))), null
  }
}
// @from(Start 6687193, End 6688231)
function G$6() {
  let A = process.env.PATH;
  if (dQ() === "windows") try {
    A = tU6("echo $PATH", {
      encoding: "utf8"
    }).trim()
  } catch {}
  let Q = A$6(),
    B = B$6(),
    G = "";
  if (G += `
      # Check for rg availability
      echo "# Check for rg availability" >> "$SNAPSHOT_FILE"
      echo "if ! command -v rg >/dev/null 2>&1; then" >> "$SNAPSHOT_FILE"
      echo '  alias rg='"'${Q.replace(/'/g,"'\\''")}'" >> "$SNAPSHOT_FILE"
      echo "fi" >> "$SNAPSHOT_FILE"
  `, B) {
    let Z = z8([B.cliPath]),
      I = B.args.map((J) => z8([J])),
      Y = `${Z} ${I.join(" ")}`;
    G += `

      # Check for mcp-cli availability
      echo "# Check for mcp-cli availability" >> "$SNAPSHOT_FILE"
      echo "if ! command -v mcp-cli >/dev/null 2>&1; then" >> "$SNAPSHOT_FILE"
      echo '  alias mcp-cli='"'${Y.replace(/'/g,"'\\''")}'" >> "$SNAPSHOT_FILE"
      echo "fi" >> "$SNAPSHOT_FILE"
    `
  }
  return G += `

      # Add PATH to the file
      echo "export PATH=${z8([A||""])}" >> "$SNAPSHOT_FILE"
  `, G
}
// @from(Start 6688233, End 6689258)
function Z$6(A, Q, B) {
  let G = km1(A),
    Z = G.endsWith(".zshrc"),
    I = B ? Q$6(G) : !Z ? 'echo "shopt -s expand_aliases" >> "$SNAPSHOT_FILE"' : "",
    Y = G$6();
  return `SNAPSHOT_FILE=${z8([Q])}
      ${B?`source "${G}" < /dev/null`:"# No user config file to source"}

      # First, create/clear the snapshot file
      echo "# Snapshot file" >| "$SNAPSHOT_FILE"

      # When this file is sourced, we first unalias to avoid conflicts
      # This is necessary because aliases get "frozen" inside function definitions at definition time,
      # which can cause unexpected behavior when functions use commands that conflict with aliases
      echo "# Unset all aliases to avoid conflicts with functions" >> "$SNAPSHOT_FILE"
      echo "unalias -a 2>/dev/null || true" >> "$SNAPSHOT_FILE"

      ${I}

      ${Y}

      # Exit silently on success, only report errors
      if [ ! -f "$SNAPSHOT_FILE" ]; then
        echo "Error: Snapshot file was not created at $SNAPSHOT_FILE" >&2
        exit 1
      fi
    `
}
// @from(Start 6689263, End 6689273)
Sm1 = "\\"
// @from(Start 6689277, End 6689286)
LOB = 1e4
// @from(Start 6689290, End 6692616)
MOB = async (A) => {
    let Q = A.includes("zsh") ? "zsh" : A.includes("bash") ? "bash" : "sh";
    return g(`Creating shell snapshot for ${Q} (${A})`), new Promise(async (B) => {
      try {
        let G = km1(A);
        g(`Looking for shell config file: ${G}`);
        let Z = P$A(G);
        if (!Z) g(`Shell config file not found: ${G}, creating snapshot with Claude Code defaults only`);
        let I = Date.now(),
          Y = Math.random().toString(36).substring(2, 8),
          J = _m1(MQ(), "shell-snapshots");
        g(`Snapshots directory: ${J}`);
        let W = _m1(J, `snapshot-${Q}-${I}-${Y}.sh`);
        rU6(J, {
          recursive: !0
        });
        let X = Z$6(A, W, Z);
        g(`Creating snapshot at: ${W}`), g(`Shell binary exists: ${P$A(A)}`), g(`Execution timeout: ${LOB}ms`), eU6(A, ["-c", "-l", X], {
          env: {
            ...process.env.CLAUDE_CODE_DONT_INHERIT_ENV ? {} : process.env,
            SHELL: A,
            GIT_EDITOR: "true",
            CLAUDECODE: "1"
          },
          timeout: LOB,
          maxBuffer: 1048576,
          encoding: "utf8"
        }, async (V, F, K) => {
          if (V) {
            let D = V;
            if (g(`Shell snapshot creation failed: ${V.message}`), g("Error details:"), g(`  - Error code: ${D?.code}`), g(`  - Error signal: ${D?.signal}`), g(`  - Error killed: ${D?.killed}`), g(`  - Shell path: ${A}`), g(`  - Config file: ${km1(A)}`), g(`  - Config file exists: ${Z}`), g(`  - Working directory: ${W0()}`), g(`  - Claude home: ${MQ()}`), g(`Full snapshot script:
${X}`), F) g(`stdout output (${F.length} chars):
${F}`);
            else g("No stdout output captured");
            if (K) g(`stderr output (${K.length} chars): ${K}`);
            else g("No stderr output captured");
            AA(Error(`Failed to create shell snapshot: ${V.message}`));
            let H = D?.signal ? UrA.constants.signals[D.signal] : void 0;
            GA("tengu_shell_snapshot_failed", {
              stderr_length: K?.length || 0,
              has_error_code: !!D?.code,
              error_signal_number: H,
              error_killed: D?.killed
            }), B(void 0)
          } else if (P$A(W)) {
            let D = sU6(W).size;
            g(`Shell snapshot created successfully (${D} bytes)`), PG(async () => {
              try {
                if (P$A(W)) RA().unlinkSync(W), g(`Cleaned up session snapshot: ${W}`)
              } catch (H) {
                g(`Error cleaning up session snapshot: ${H}`)
              }
            }), B(W)
          } else {
            g(`Shell snapshot file not found after creation: ${W}`), g(`Checking if parent directory still exists: ${J}`);
            let D = P$A(J);
            if (g(`Parent directory exists: ${D}`), D) try {
              let H = RA().readdirSync(J);
              g(`Directory contains ${H.length} files`)
            } catch (H) {
              g(`Could not read directory contents: ${H}`)
            }
            GA("tengu_shell_unknown_error", {}), B(void 0)
          }
        })
      } catch (G) {
        if (g(`Unexpected error during snapshot creation: ${G}`), G instanceof Error) g(`Error stack trace: ${G.stack}`);
        AA(G instanceof Error ? G : Error(String(G))), GA("tengu_shell_snapshot_error", {}), B(void 0)
      }
    })
  }
// @from(Start 6692622, End 6692736)
OOB = L(() => {
  dK();
  g1();
  q0();
  hQ();
  HH();
  AQ();
  Q3();
  V0();
  sj();
  U2();
  H9A();
  dH()
})
// @from(Start 6693042, End 6693264)
function ROB(A) {
  try {
    return F$6(A, I$6.X_OK), !0
  } catch (Q) {
    try {
      return TOB(`${A} --version`, {
        timeout: 1000,
        stdio: "ignore"
      }), !0
    } catch {
      return !1
    }
  }
}
// @from(Start 6693266, End 6693425)
function D$6(A) {
  if (A.includes("zsh") || A.includes("bash")) return "{ shopt -u extglob || setopt NO_EXTENDED_GLOB; } 2>/dev/null || true";
  return null
}
// @from(Start 6693427, End 6694369)
function H$6() {
  let A = (V) => {
      try {
        return TOB(`which ${V}`, {
          stdio: ["ignore", "pipe", "ignore"]
        }).toString().trim()
      } catch {
        return null
      }
    },
    Q = process.env.SHELL,
    B = Q && (Q.includes("bash") || Q.includes("zsh")),
    G = Q?.includes("bash"),
    Z = A("zsh"),
    I = A("bash"),
    Y = ["/bin", "/usr/bin", "/usr/local/bin", "/opt/homebrew/bin"],
    W = (G ? ["bash", "zsh"] : ["zsh", "bash"]).flatMap((V) => Y.map((F) => `${F}/${V}`));
  if (G) {
    if (I) W.unshift(I);
    if (Z) W.push(Z)
  } else {
    if (Z) W.unshift(Z);
    if (I) W.push(I)
  }
  if (B && ROB(Q)) W.unshift(Q);
  let X = W.find((V) => V && ROB(V));
  if (!X) {
    let V = "No suitable shell found. Claude CLI requires a Posix shell environment. Please ensure you have a valid shell installed and the SHELL environment variable set.";
    throw AA(Error(V)), Error(V)
  }
  return X
}
// @from(Start 6694370, End 6694582)
async function C$6() {
  let A = H$6(),
    Q;
  try {
    Q = await MOB(A)
  } catch (B) {
    g(`Failed to create shell snapshot: ${B}`), Q = void 0
  }
  return {
    binShell: A,
    snapshotFilePath: Q
  }
}
// @from(Start 6694583, End 6696957)
async function $rA(A, Q, B, G, Z, I, Y, J) {
  let W = B || K$6,
    {
      binShell: X,
      snapshotFilePath: V
    } = await j$A();
  if (G) X = G, V = void 0;
  let F = Math.floor(Math.random() * 65536).toString(16).padStart(4, "0"),
    K = POB.tmpdir();
  if (dQ() === "windows") K = rj(K);
  let D = `${K}/claude-${F}-cwd`,
    H = UOB(A),
    C = zOB(A, H);
  if (!Y && A.includes("|") && H) C = qOB(A);
  let E = [];
  if (V) {
    if (!J$6(V)) g(`Snapshot file missing, recreating: ${V}`), j$A.cache?.clear?.(), V = (await j$A()).snapshotFilePath;
    if (V) {
      let y = dQ() === "windows" ? rj(V) : V;
      E.push(`source ${z8([y])}`)
    }
  }
  let U = MNB();
  if (U) E.push(U);
  let q = D$6(X);
  if (q) E.push(q);
  E.push(`eval ${C}`), E.push(`pwd -P >| ${D}`);
  let w = E.join(" && ");
  if (process.env.CLAUDE_CODE_SHELL_PREFIX) w = NsA(process.env.CLAUDE_CODE_SHELL_PREFIX, w);
  let N = UD1();
  if (Q.aborted) return $NB();
  if (Y) {
    w = await nQ.wrapWithSandbox(w, X, void 0, Q);
    try {
      let y = RA(),
        v = "/tmp/claude";
      if (!y.existsSync("/tmp/claude")) y.mkdirSync("/tmp/claude")
    } catch (y) {
      g(`Failed to create /tmp/claude directory: ${y}`)
    }
  }
  let R = (process.env.CLAUDE_BASH_NO_LOGIN === "true" || process.env.CLAUDE_BASH_NO_LOGIN === "1") && V !== void 0,
    T = ["-c", ...R ? [] : ["-l"], w];
  if (R) g("Spawning shell without login (-l flag skipped)");
  try {
    let y = W$6(X, T, {
        env: {
          ...process.env,
          SHELL: X,
          GIT_EDITOR: "true",
          CLAUDECODE: "1",
          ...{},
          ...Y ? {
            TMPDIR: "/tmp/claude"
          } : {}
        },
        cwd: N,
        detached: !0
      }),
      v = qsA(y, Q, W, Z, J);
    return v.result.then(async (x) => {
      if (x && !I && !x.backgroundTaskId) try {
        Bq(Y$6(D, {
          encoding: "utf8"
        }).trim(), N)
      } catch {
        GA("tengu_shell_set_cwd", {
          success: !1
        })
      }
    }), v
  } catch (y) {
    return g(`Shell exec error: ${y instanceof Error?y.message:String(y)}`), {
      status: "killed",
      background: () => null,
      kill: () => {},
      result: Promise.resolve({
        code: 126,
        stdout: "",
        stderr: y instanceof Error ? y.message : String(y),
        interrupted: !1
      })
    }
  }
}
// @from(Start 6696959, End 6697222)
function Bq(A, Q) {
  let B = X$6(A) ? A : V$6(Q || RA().cwd(), A);
  if (!RA().existsSync(B)) throw Error(`Path "${B}" does not exist`);
  let G = RA().realpathSync(B);
  LE0(G);
  try {
    GA("tengu_shell_set_cwd", {
      success: !0
    })
  } catch (Z) {}
}
// @from(Start 6697227, End 6697240)
K$6 = 1800000
// @from(Start 6697244, End 6697247)
j$A
// @from(Start 6697253, End 6697429)
u_ = L(() => {
  dK();
  hu1();
  $OB();
  g1();
  q0();
  fu1();
  AQ();
  _0();
  H9A();
  Q3();
  V0();
  NOB();
  OOB();
  l2();
  U2();
  $J();
  D$A();
  j$A = s1(C$6)
})
// @from(Start 6697470, End 6697704)
function Ff(A) {
  let Q = A.split(`
`),
    B = 0;
  while (B < Q.length && Q[B]?.trim() === "") B++;
  let G = Q.length - 1;
  while (G >= 0 && Q[G]?.trim() === "") G--;
  if (B > G) return "";
  return Q.slice(B, G + 1).join(`
`)
}
// @from(Start 6697706, End 6698194)
function m_(A) {
  let Q = /^data:image\/[a-z0-9.+_-]+;base64,/i.test(A);
  if (Q) return {
    totalLines: 1,
    truncatedContent: A,
    isImage: Q
  };
  let B = Ge();
  if (A.length <= B) return {
    totalLines: A.split(`
`).length,
    truncatedContent: A,
    isImage: Q
  };
  let G = A.slice(0, B),
    Z = A.slice(B).split(`
`).length,
    I = `${G}

... [${Z} lines truncated] ...`;
  return {
    totalLines: A.split(`
`).length,
    truncatedContent: I,
    isImage: Q
  }
}
// @from(Start 6698196, End 6698347)
function qrA(A) {
  if (IX1() || !qT(W0(), A)) {
    if (Bq(uQ()), !IX1()) return GA("tengu_bash_tool_reset_to_original_dir", {}), !0
  }
  return !1
}
// @from(Start 6698348, End 6699917)
async function SOB(A, Q, B, G) {
  let I = (await uX({
    systemPrompt: [`Extract any file paths that this command reads or modifies. For commands like "git diff" and "cat", include the paths of files being shown. Use paths verbatim -- don't add any slashes or try to resolve them. Do not try to infer paths that were not explicitly listed in the command output.

IMPORTANT: Commands that do not display the contents of the files should not return any filepaths. For eg. "ls", pwd", "find". Even more complicated commands that don't display the contents should not be considered: eg "find . -type f -exec ls -la {} + | sort -k5 -nr | head -5"

First, determine if the command displays the contents of the files. If it does, then <is_displaying_contents> tag should be true. If it does not, then <is_displaying_contents> tag should be false.

Format your response as:
<is_displaying_contents>
true
</is_displaying_contents>

<filepaths>
path/to/file1
path/to/file2
</filepaths>

If no files are read or modified, return empty filepaths tags:
<filepaths>
</filepaths>

Do not include any other text in your response.`],
    userPrompt: `Command: ${A}
Output: ${Q}`,
    enablePromptCaching: !0,
    signal: B,
    options: {
      querySource: "bash_extract_command_paths",
      agents: [],
      isNonInteractiveSession: G,
      hasAppendSystemPrompt: !1,
      mcpTools: [],
      agentIdOrSessionId: e1()
    }
  })).message.content.filter((Y) => Y.type === "text").map((Y) => Y.text).join("");
  return B9(I, "filepaths")?.trim().split(`
`).filter(Boolean) || []
}
// @from(Start 6699919, End 6700431)
function _OB(A, Q) {
  let B = RA(),
    G = e1(),
    Z = jOB("/tmp/claude/mcp-outputs", G),
    I = new Date().toISOString().replace(/[:.]/g, "-"),
    J = `mcp-output-${Q.replace(/[^a-zA-Z0-9_-]/g,"_").slice(0,50)}-${I}.json`,
    W = jOB(Z, J);
  if (!NrA(Z)) return AA(Error(`Failed to create directory for MCP output: ${Z}`)), "";
  try {
    return B.writeFileSync(W, A, {
      encoding: "utf8",
      flush: !0
    }), W
  } catch (X) {
    return AA(X instanceof Error ? X : Error(String(X))), ""
  }
}
// @from(Start 6700433, End 6700879)
function kOB(A) {
  let Q = [],
    B = 0,
    G = 0;
  for (let I of A)
    if (I.type === "image") G++;
    else if (I.type === "text" && "text" in I) {
    B++;
    let Y = I.text.slice(0, 200);
    Q.push(Y + (I.text.length > 200 ? "..." : ""))
  }
  let Z = [];
  if (G > 0) Z.push(`[${G} image${G>1?"s":""}]`);
  if (B > 0) Z.push(`[${B} text block${B>1?"s":""}]`);
  return `MCP Result: ${Z.join(", ")}${Q.length>0?`

`+Q.join(`

`):""}`
}
// @from(Start 6700884, End 6700941)
wrA = (A) => `${A.trim()}
Shell cwd was reset to ${uQ()}`
// @from(Start 6700947, End 6701060)
Np = L(() => {
  hQ();
  fZ();
  cQ();
  IGA();
  EJ();
  _0();
  q0();
  U2();
  u_();
  AQ();
  R9();
  g1()
})
// @from(Start 6701063, End 6703754)
function yOB() {
  return `You are analyzing output from a bash command to determine if it should be summarized.

Your task is to:
1. Determine if the output contains mostly repetitive logs, verbose build output, or other "log spew"
2. If it does, extract only the relevant information (errors, test results, completion status, etc.)
3. Consider the conversation context - if the user specifically asked to see detailed output, preserve it

You MUST output your response using XML tags in the following format:
<should_summarize>true/false</should_summarize>
<reason>reason for why you decided to summarize or not summarize the output</reason>
<summary>markdown summary as described below (only if should_summarize is true)</summary>

If should_summarize is true, include all three tags with a comprehensive summary.
If should_summarize is false, include only the first two tags and omit the summary tag.

Summary: The summary should be extremely comprehensive and detailed in markdown format. Especially consider the converstion context to determine what to focus on.
Freely copy parts of the output verbatim into the summary if you think it is relevant to the conversation context or what the user is asking for.
It's fine if the summary is verbose. The summary should contain the following sections: (Make sure to include all of these sections)
1. Overview: An overview of the output including the most interesting information summarized.
2. Detailed summary: An extremely detailed summary of the output.
3. Errors: List of relevant errors that were encountered. Include snippets of the output wherever possible.
4. Verbatim output: Copy any parts of the provided output verbatim that are relevant to the conversation context. This is critical. Make sure to include ATLEAST 3 snippets of the output verbatim. 
5. DO NOT provide a recommendation. Just summarize the facts.

Reason: If providing a reason, it should comprehensively explain why you decided not to summarize the output.

Examples of when to summarize:
- Verbose build logs with only the final status being important. Eg. if we are running npm run build to test if our code changes build.
- Test output where only the pass/fail results matter
- Repetitive debug logs with a few key errors

Examples of when NOT to summarize:
- User explicitly asked to see the full output
- Output contains unique, non-repetitive information
- Error messages that need full stack traces for debugging


CRITICAL: You MUST start your response with the <should_summarize> tag as the very first thing. Do not include any other text before the first tag. The summary tag can contain markdown format, but ensure all XML tags are properly closed.`
}
// @from(Start 6703756, End 6704022)
function xOB(A, Q, B) {
  return `Command executed: \`${A}\`

Recent conversation context:
${Q||"No recent conversation context"}

Bash output to analyze:
${B}

Should this output be summarized? If yes, provide a summary focusing on the most relevant information.`
}
// @from(Start 6704108, End 6704269)
function q$6(A) {
  let Q = new Date().toISOString().replace(/[:.]/g, "-"),
    B = z$6("sha256").update(A).digest("hex").slice(0, 8);
  return `${Q}-${B}.txt`
}
// @from(Start 6704271, End 6704349)
function N$6(A, Q, B) {
  return `COMMAND: ${A}

STDOUT:
${Q}

STDERR:
${B}`
}
// @from(Start 6704351, End 6704736)
function L$6(A, Q, B) {
  let G = RA(),
    Z = e1(),
    I = vOB(cH(uQ()), w$6, Z),
    Y = vOB(I, q$6(B));
  if (!NrA(I)) return AA(Error(`Failed to create directory for bash output: ${I}`)), "";
  try {
    return G.writeFileSync(Y, N$6(B, A, Q), {
      encoding: "utf-8",
      flush: !0
    }), Y
  } catch (J) {
    return AA(J instanceof Error ? J : Error(String(J))), ""
  }
}
// @from(Start 6704738, End 6704824)
function M$6(A) {
  let Q = A.slice(-$$6),
    B = WZ(Q);
  return JSON.stringify(B)
}
// @from(Start 6704825, End 6706497)
async function bOB(A, Q, B, G, Z = []) {
  let I = [A, Q].filter(Boolean).join(`
`),
    {
      isImage: Y
    } = m_(Ff(A));
  if (Y) return {
    shouldSummarize: !1,
    reason: "image_data"
  };
  if (I.length < U$6) return {
    shouldSummarize: !1,
    reason: "below_threshold"
  };
  try {
    let J = M$6(Z),
      W = yOB(),
      X = xOB(B, J, I),
      V = Date.now(),
      F = await uX({
        systemPrompt: [W],
        userPrompt: X,
        enablePromptCaching: !0,
        options: {
          querySource: "bash_output_summarization",
          hasAppendSystemPrompt: !1,
          isNonInteractiveSession: !1,
          agents: [],
          mcpTools: [],
          agentIdOrSessionId: e1()
        },
        signal: G.signal
      }),
      K = Date.now() - V,
      D = F.message.content.filter((q) => q.type === "text").map((q) => q.text).join(""),
      H = B9(D, "should_summarize"),
      C = B9(D, "reason"),
      E = B9(D, "summary")?.trim() || "";
    if (!H) return {
      shouldSummarize: !1,
      reason: "parse_error",
      queryDurationMs: K
    };
    if (H === "true" && E) {
      let q = L$6(A, Q, B);
      return {
        shouldSummarize: !0,
        summary: O$6(E, q),
        rawOutputPath: q,
        queryDurationMs: K,
        ...C ? {
          modelReason: C
        } : {}
      }
    }
    return {
      shouldSummarize: !1,
      reason: "model_decided_user_needs_full_output",
      queryDurationMs: K,
      ...C ? {
        modelReason: C
      } : {}
    }
  } catch (J) {
    return AA(J instanceof Error ? J : Error(String(J))), {
      shouldSummarize: !1,
      reason: "summarization_error"
    }
  }
}
// @from(Start 6706499, End 6706734)
function O$6(A, Q) {
  let G = Q ? `

Note: The complete bash output is available at ${Q}. You can use Read or Grep tools to search for specific information not included in this summary.` : "";
  return `[Summarized output]
${A}${G}`
}
// @from(Start 6706739, End 6706749)
U$6 = 5000
// @from(Start 6706753, End 6706761)
$$6 = 10
// @from(Start 6706765, End 6706785)
w$6 = "bash-outputs"
// @from(Start 6706791, End 6706872)
fOB = L(() => {
  fZ();
  Np();
  AQ();
  g1();
  cQ();
  S7();
  _0();
  R9()
})
// @from(Start 6706875, End 6707018)
function ym1(A) {
  if (!A) return "";
  let Q = Array.isArray(A) ? A.join("") : A,
    {
      truncatedContent: B
    } = m_(Q);
  return B
}
// @from(Start 6707020, End 6707321)
function R$6(A) {
  if (typeof A["image/png"] === "string") return {
    image_data: A["image/png"].replace(/\s/g, ""),
    media_type: "image/png"
  };
  if (typeof A["image/jpeg"] === "string") return {
    image_data: A["image/jpeg"].replace(/\s/g, ""),
    media_type: "image/jpeg"
  };
  return
}
// @from(Start 6707323, End 6707785)
function T$6(A) {
  switch (A.output_type) {
    case "stream":
      return {
        output_type: A.output_type, text: ym1(A.text)
      };
    case "execute_result":
    case "display_data":
      return {
        output_type: A.output_type, text: ym1(A.data?.["text/plain"]), image: A.data && R$6(A.data)
      };
    case "error":
      return {
        output_type: A.output_type, text: ym1(`${A.ename}: ${A.evalue}
${A.traceback.join(`
`)}`)
      }
  }
}
// @from(Start 6707787, End 6708444)
function hOB(A, Q, B, G) {
  let Z = A.id ?? `cell-${Q}`,
    I = {
      cellType: A.cell_type,
      source: Array.isArray(A.source) ? A.source.join("") : A.source,
      execution_count: A.cell_type === "code" ? A.execution_count || void 0 : void 0,
      cell_id: Z
    };
  if (A.cell_type === "code") I.language = B;
  if (A.cell_type === "code" && A.outputs?.length) {
    let Y = A.outputs.map(T$6);
    if (!G && JSON.stringify(Y).length > 1e4) I.outputs = [{
      output_type: "stream",
      text: `Outputs are too large to include. Use ${C9} with: cat <notebook_path> | jq '.cells[${Q}].outputs'`
    }];
    else I.outputs = Y
  }
  return I
}
// @from(Start 6708446, End 6708777)
function P$6(A) {
  let Q = [];
  if (A.cellType !== "code") Q.push(`<cell_type>${A.cellType}</cell_type>`);
  if (A.language !== "python" && A.cellType === "code") Q.push(`<language>${A.language}</language>`);
  return {
    text: `<cell id="${A.cell_id}">${Q.join("")}${A.source}</cell id="${A.cell_id}">`,
    type: "text"
  }
}
// @from(Start 6708779, End 6709053)
function j$6(A) {
  let Q = [];
  if (A.text) Q.push({
    text: `
${A.text}`,
    type: "text"
  });
  if (A.image) Q.push({
    type: "image",
    source: {
      data: A.image.image_data,
      media_type: A.image.media_type,
      type: "base64"
    }
  });
  return Q
}
// @from(Start 6709055, End 6709150)
function S$6(A) {
  let Q = P$6(A),
    B = A.outputs?.flatMap(j$6);
  return [Q, ...B ?? []]
}
// @from(Start 6709152, End 6709555)
function gOB(A, Q) {
  let B = b9(A),
    G = RA().readFileSync(B, {
      encoding: "utf-8"
    }),
    Z = JSON.parse(G),
    I = Z.metadata.language_info?.name ?? "python";
  if (Q) {
    let Y = Z.cells.find((J) => J.id === Q);
    if (!Y) throw Error(`Cell with ID "${Q}" not found in notebook`);
    return [hOB(Y, Z.cells.indexOf(Y), I, !0)]
  }
  return Z.cells.map((Y, J) => hOB(Y, J, I, !1))
}
// @from(Start 6709557, End 6709891)
function uOB(A, Q) {
  let B = A.flatMap(S$6);
  return {
    tool_use_id: Q,
    type: "tool_result",
    content: B.reduce((G, Z) => {
      if (G.length === 0) return [Z];
      let I = G[G.length - 1];
      if (I && I.type === "text" && Z.type === "text") return I.text += `
` + Z.text, G;
      return [...G, Z]
    }, [])
  }
}
// @from(Start 6709893, End 6710044)
function S$A(A) {
  let Q = A.match(/^cell-(\d+)$/);
  if (Q && Q[1]) {
    let B = parseInt(Q[1], 10);
    return isNaN(B) ? void 0 : B
  }
  return
}
// @from(Start 6710049, End 6710090)
LrA = L(() => {
  Np();
  yI();
  AQ()
})
// @from(Start 6710096, End 6710447)
xm1 = function() {
  let {
    crypto: A
  } = globalThis;
  if (A?.randomUUID) return xm1 = A.randomUUID.bind(A), A.randomUUID();
  let Q = new Uint8Array(1),
    B = A ? () => A.getRandomValues(Q)[0] : () => Math.random() * 255 & 255;
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (G) => (+G ^ B() & 15 >> +G / 4).toString(16))
}
// @from(Start 6710453, End 6710502)
mOB = (A) => new Promise((Q) => setTimeout(Q, A))
// @from(Start 6710508, End 6710521)
Lp = "0.70.0"
// @from(Start 6710524, End 6710804)
function _$6() {
  if (typeof Deno < "u" && Deno.build != null) return "deno";
  if (typeof EdgeRuntime < "u") return "edge";
  if (Object.prototype.toString.call(typeof globalThis.process < "u" ? globalThis.process : 0) === "[object process]") return "node";
  return "unknown"
}
// @from(Start 6710806, End 6711680)
function y$6() {
  if (typeof navigator > "u" || !navigator) return null;
  let A = [{
    key: "edge",
    pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
  }, {
    key: "ie",
    pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
  }, {
    key: "ie",
    pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/
  }, {
    key: "chrome",
    pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
  }, {
    key: "firefox",
    pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
  }, {
    key: "safari",
    pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/
  }];
  for (let {
      key: Q,
      pattern: B
    }
    of A) {
    let G = B.exec(navigator.userAgent);
    if (G) {
      let Z = G[1] || 0,
        I = G[2] || 0,
        Y = G[3] || 0;
      return {
        browser: Q,
        version: `${Z}.${I}.${Y}`
      }
    }
  }
  return null
}
// @from(Start 6711685, End 6711791)
lOB = () => {
    return typeof window < "u" && typeof window.document < "u" && typeof navigator < "u"
  }
// @from(Start 6711795, End 6713406)
k$6 = () => {
    let A = _$6();
    if (A === "deno") return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": Lp,
      "X-Stainless-OS": cOB(Deno.build.os),
      "X-Stainless-Arch": dOB(Deno.build.arch),
      "X-Stainless-Runtime": "deno",
      "X-Stainless-Runtime-Version": typeof Deno.version === "string" ? Deno.version : Deno.version?.deno ?? "unknown"
    };
    if (typeof EdgeRuntime < "u") return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": Lp,
      "X-Stainless-OS": "Unknown",
      "X-Stainless-Arch": `other:${EdgeRuntime}`,
      "X-Stainless-Runtime": "edge",
      "X-Stainless-Runtime-Version": globalThis.process.version
    };
    if (A === "node") return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": Lp,
      "X-Stainless-OS": cOB(globalThis.process.platform ?? "unknown"),
      "X-Stainless-Arch": dOB(globalThis.process.arch ?? "unknown"),
      "X-Stainless-Runtime": "node",
      "X-Stainless-Runtime-Version": globalThis.process.version ?? "unknown"
    };
    let Q = y$6();
    if (Q) return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": Lp,
      "X-Stainless-OS": "Unknown",
      "X-Stainless-Arch": "unknown",
      "X-Stainless-Runtime": `browser:${Q.browser}`,
      "X-Stainless-Runtime-Version": Q.version
    };
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": Lp,
      "X-Stainless-OS": "Unknown",
      "X-Stainless-Arch": "unknown",
      "X-Stainless-Runtime": "unknown",
      "X-Stainless-Runtime-Version": "unknown"
    }
  }
// @from(Start 6713410, End 6713662)
dOB = (A) => {
    if (A === "x32") return "x32";
    if (A === "x86_64" || A === "x64") return "x64";
    if (A === "arm") return "arm";
    if (A === "aarch64" || A === "arm64") return "arm64";
    if (A) return `other:${A}`;
    return "unknown"
  }
// @from(Start 6713666, End 6714048)
cOB = (A) => {
    if (A = A.toLowerCase(), A.includes("ios")) return "iOS";
    if (A === "android") return "Android";
    if (A === "darwin") return "MacOS";
    if (A === "win32") return "Windows";
    if (A === "freebsd") return "FreeBSD";
    if (A === "openbsd") return "OpenBSD";
    if (A === "linux") return "Linux";
    if (A) return `Other:${A}`;
    return "Unknown"
  }
// @from(Start 6714052, End 6714055)
pOB
// @from(Start 6714057, End 6714106)
iOB = () => {
    return pOB ?? (pOB = k$6())
  }
// @from(Start 6714112, End 6714126)
vm1 = () => {}
// @from(Start 6714132, End 6714284)
nOB = ({
  headers: A,
  body: Q
}) => {
  return {
    bodyHeaders: {
      "content-type": "application/json"
    },
    body: JSON.stringify(Q)
  }
}
// @from(Start 6714286, End 6715165)
async function MrA(A, Q) {
  let {
    response: B,
    requestLogID: G,
    retryOfRequestLogID: Z,
    startTime: I
  } = Q, Y = await (async () => {
    if (Q.options.stream) {
      if (qF(A).debug("response", B.status, B.url, B.headers, B.body), Q.options.__streamClass) return Q.options.__streamClass.fromSSEResponse(B, Q.controller);
      return lC.fromSSEResponse(B, Q.controller)
    }
    if (B.status === 204) return null;
    if (Q.options.__binaryResponse) return B;
    let W = B.headers.get("content-type")?.split(";")[0]?.trim();
    if (W?.includes("application/json") || W?.endsWith("+json")) {
      let F = await B.json();
      return bm1(F, B)
    }
    return await B.text()
  })();
  return qF(A).debug(`[${G}] response parsed`, Hv({
    retryOfRequestLogID: Z,
    url: B.url,
    status: B.status,
    body: Y,
    durationMs: Date.now() - I
  })), Y
}
// @from(Start 6715167, End 6715369)
function bm1(A, Q) {
  if (!A || typeof A !== "object" || Array.isArray(A)) return A;
  return Object.defineProperty(A, "_request_id", {
    value: Q.headers.get("request-id"),
    enumerable: !1
  })
}
// @from(Start 6715374, End 6715409)
fm1 = L(() => {
  IC1();
  AvA()
})
// @from(Start 6715415, End 6715418)
_$A
// @from(Start 6715420, End 6715422)
Ze
// @from(Start 6715428, End 6716517)
OrA = L(() => {
  Kv();
  fm1();
  Ze = class Ze extends Promise {
    constructor(A, Q, B = MrA) {
      super((G) => {
        G(null)
      });
      this.responsePromise = Q, this.parseResponse = B, _$A.set(this, void 0), fB(this, _$A, A, "f")
    }
    _thenUnwrap(A) {
      return new Ze(N0(this, _$A, "f"), this.responsePromise, async (Q, B) => bm1(A(await this.parseResponse(Q, B), B), B.response))
    }
    asResponse() {
      return this.responsePromise.then((A) => A.response)
    }
    async withResponse() {
      let [A, Q] = await Promise.all([this.parse(), this.asResponse()]);
      return {
        data: A,
        response: Q,
        request_id: Q.headers.get("request-id")
      }
    }
    parse() {
      if (!this.parsedPromise) this.parsedPromise = this.responsePromise.then((A) => this.parseResponse(N0(this, _$A, "f"), A));
      return this.parsedPromise
    }
    then(A, Q) {
      return this.parse().then(A, Q)
    } catch (A) {
      return this.parse().catch(A)
    } finally(A) {
      return this.parse().finally(A)
    }
  };
  _$A = new WeakMap
})
// @from(Start 6716523, End 6716526)
RrA
// @from(Start 6716528, End 6716531)
hm1
// @from(Start 6716533, End 6716536)
TrA
// @from(Start 6716538, End 6716540)
NT
// @from(Start 6716542, End 6716545)
k$A
// @from(Start 6716551, End 6719192)
d_ = L(() => {
  Kv();
  pC();
  fm1();
  OrA();
  Jr();
  hm1 = class hm1 {
    constructor(A, Q, B, G) {
      RrA.set(this, void 0), fB(this, RrA, A, "f"), this.options = G, this.response = Q, this.body = B
    }
    hasNextPage() {
      if (!this.getPaginatedItems().length) return !1;
      return this.nextPageRequestOptions() != null
    }
    async getNextPage() {
      let A = this.nextPageRequestOptions();
      if (!A) throw new vB("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");
      return await N0(this, RrA, "f").requestAPIList(this.constructor, A)
    }
    async * iterPages() {
      let A = this;
      yield A;
      while (A.hasNextPage()) A = await A.getNextPage(), yield A
    }
    async * [(RrA = new WeakMap, Symbol.asyncIterator)]() {
      for await (let A of this.iterPages()) for (let Q of A.getPaginatedItems()) yield Q
    }
  };
  TrA = class TrA extends Ze {
    constructor(A, Q, B) {
      super(A, Q, async (G, Z) => new B(G, Z.response, await MrA(G, Z), Z.options))
    }
    async * [Symbol.asyncIterator]() {
      let A = await this;
      for await (let Q of A) yield Q
    }
  };
  NT = class NT extends hm1 {
    constructor(A, Q, B, G) {
      super(A, Q, B, G);
      this.data = B.data || [], this.has_more = B.has_more || !1, this.first_id = B.first_id || null, this.last_id = B.last_id || null
    }
    getPaginatedItems() {
      return this.data ?? []
    }
    hasNextPage() {
      if (this.has_more === !1) return !1;
      return super.hasNextPage()
    }
    nextPageRequestOptions() {
      if (this.options.query?.before_id) {
        let Q = this.first_id;
        if (!Q) return null;
        return {
          ...this.options,
          query: {
            ...rxA(this.options.query),
            before_id: Q
          }
        }
      }
      let A = this.last_id;
      if (!A) return null;
      return {
        ...this.options,
        query: {
          ...rxA(this.options.query),
          after_id: A
        }
      }
    }
  };
  k$A = class k$A extends hm1 {
    constructor(A, Q, B, G) {
      super(A, Q, B, G);
      this.data = B.data || [], this.has_more = B.has_more || !1, this.next_page = B.next_page || null
    }
    getPaginatedItems() {
      return this.data ?? []
    }
    hasNextPage() {
      if (this.has_more === !1) return !1;
      return super.hasNextPage()
    }
    nextPageRequestOptions() {
      let A = this.next_page;
      if (!A) return null;
      return {
        ...this.options,
        query: {
          ...rxA(this.options.query),
          page: A
        }
      }
    }
  }
})
// @from(Start 6719195, End 6719271)
function Ie(A, Q, B) {
  return um1(), new File(A, Q ?? "unknown_file", B)
}
// @from(Start 6719273, End 6719567)
function y$A(A) {
  return (typeof A === "object" && A !== null && (("name" in A) && A.name && String(A.name) || ("url" in A) && A.url && String(A.url) || ("filename" in A) && A.filename && String(A.filename) || ("path" in A) && A.path && String(A.path)) || "").split(/[\\/]/).pop() || void 0
}
// @from(Start 6719569, End 6719962)
function b$6(A) {
  let Q = typeof A === "function" ? A : A.fetch,
    B = aOB.get(Q);
  if (B) return B;
  let G = (async () => {
    try {
      let Z = "Response" in Q ? Q.Response : (await Q("data:,")).constructor,
        I = new FormData;
      if (I.toString() === await new Z(I).text()) return !1;
      return !0
    } catch {
      return !0
    }
  })();
  return aOB.set(Q, G), G
}
// @from(Start 6719967, End 6720358)
um1 = () => {
    if (typeof File > "u") {
      let {
        process: A
      } = globalThis, Q = typeof A?.versions?.node === "string" && parseInt(A.versions.node.split(".")) < 20;
      throw Error("`File` is not defined as a global, which is required for file uploads." + (Q ? " Update to Node 20 LTS or newer, or set `globalThis.File` to `import('node:buffer').File`." : ""))
    }
  }
// @from(Start 6720362, End 6720458)
mm1 = (A) => A != null && typeof A === "object" && typeof A[Symbol.asyncIterator] === "function"
// @from(Start 6720462, End 6720553)
YGA = async (A, Q) => {
    return {
      ...A,
      body: await f$6(A.body, Q)
    }
  }
// @from(Start 6720555, End 6720558)
aOB
// @from(Start 6720560, End 6720841)
f$6 = async (A, Q) => {
    if (!await b$6(Q)) throw TypeError("The provided fetch function does not support file uploads with the current global FormData class.");
    let B = new FormData;
    return await Promise.all(Object.entries(A || {}).map(([G, Z]) => gm1(B, G, Z))), B
  }
// @from(Start 6720843, End 6720890)
h$6 = (A) => A instanceof Blob && ("name" in A)
// @from(Start 6720892, End 6721880)
gm1 = async (A, Q, B) => {
    if (B === void 0) return;
    if (B == null) throw TypeError(`Received null for "${Q}"; to pass null in FormData, you must use the string 'null'`);
    if (typeof B === "string" || typeof B === "number" || typeof B === "boolean") A.append(Q, String(B));
    else if (B instanceof Response) {
      let G = {},
        Z = B.headers.get("Content-Type");
      if (Z) G = {
        type: Z
      };
      A.append(Q, Ie([await B.blob()], y$A(B), G))
    } else if (mm1(B)) A.append(Q, Ie([await new Response(sxA(B)).blob()], y$A(B)));
    else if (h$6(B)) A.append(Q, Ie([B], y$A(B), {
      type: B.type
    }));
    else if (Array.isArray(B)) await Promise.all(B.map((G) => gm1(A, Q + "[]", G)));
    else if (typeof B === "object") await Promise.all(Object.entries(B).map(([G, Z]) => gm1(A, `${Q}[${G}]`, Z)));
    else throw TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${B} instead`)
  }
// @from(Start 6721886, End 6721924)
JGA = L(() => {
  aOB = new WeakMap
})
// @from(Start 6721926, End 6722559)
async function PrA(A, Q, B) {
  if (um1(), A = await A, Q || (Q = y$A(A)), g$6(A)) {
    if (A instanceof File && Q == null && B == null) return A;
    return Ie([await A.arrayBuffer()], Q ?? A.name, {
      type: A.type,
      lastModified: A.lastModified,
      ...B
    })
  }
  if (u$6(A)) {
    let Z = await A.blob();
    return Q || (Q = new URL(A.url).pathname.split(/[\\/]/).pop()), Ie(await dm1(Z), Q, B)
  }
  let G = await dm1(A);
  if (!B?.type) {
    let Z = G.find((I) => typeof I === "object" && ("type" in I) && I.type);
    if (typeof Z === "string") B = {
      ...B,
      type: Z
    }
  }
  return Ie(G, Q, B)
}
// @from(Start 6722560, End 6722986)
async function dm1(A) {
  let Q = [];
  if (typeof A === "string" || ArrayBuffer.isView(A) || A instanceof ArrayBuffer) Q.push(A);
  else if (sOB(A)) Q.push(A instanceof Blob ? A : await A.arrayBuffer());
  else if (mm1(A))
    for await (let B of A) Q.push(...await dm1(B));
  else {
    let B = A?.constructor?.name;
    throw Error(`Unexpected data type: ${typeof A}${B?`; constructor: ${B}`:""}${m$6(A)}`)
  }
  return Q
}
// @from(Start 6722988, End 6723146)
function m$6(A) {
  if (typeof A !== "object" || A === null) return "";
  return `; props: [${Object.getOwnPropertyNames(A).map((B)=>`"${B}"`).join(", ")}]`
}
// @from(Start 6723151, End 6723362)
sOB = (A) => A != null && typeof A === "object" && typeof A.size === "number" && typeof A.type === "string" && typeof A.text === "function" && typeof A.slice === "function" && typeof A.arrayBuffer === "function"
// @from(Start 6723366, End 6723491)
g$6 = (A) => A != null && typeof A === "object" && typeof A.name === "string" && typeof A.lastModified === "number" && sOB(A)
// @from(Start 6723495, End 6723603)
u$6 = (A) => A != null && typeof A === "object" && typeof A.url === "string" && typeof A.blob === "function"
// @from(Start 6723609, End 6723644)
rOB = L(() => {
  JGA();
  JGA()
})
// @from(Start 6723650, End 6723676)
cm1 = L(() => {
  rOB()
})
// @from(Start 6723682, End 6723696)
oOB = () => {}
// @from(Start 6723698, End 6723754)
class pY {
  constructor(A) {
    this._client = A
  }
}
// @from(Start 6723756, End 6724387)
function* c$6(A) {
  if (!A) return;
  if (tOB in A) {
    let {
      values: G,
      nulls: Z
    } = A;
    yield* G.entries();
    for (let I of Z) yield [I, null];
    return
  }
  let Q = !1,
    B;
  if (A instanceof Headers) B = A.entries();
  else if (GC1(A)) B = A;
  else Q = !0, B = Object.entries(A ?? {});
  for (let G of B) {
    let Z = G[0];
    if (typeof Z !== "string") throw TypeError("expected header name to be a string");
    let I = GC1(G[1]) ? G[1] : [G[1]],
      Y = !1;
    for (let J of I) {
      if (J === void 0) continue;
      if (Q && !Y) Y = !0, yield [Z, null];
      yield [Z, J]
    }
  }
}
// @from(Start 6724392, End 6724395)
tOB
// @from(Start 6724397, End 6724754)
r4 = (A) => {
  let Q = new Headers,
    B = new Set;
  for (let G of A) {
    let Z = new Set;
    for (let [I, Y] of c$6(G)) {
      let J = I.toLowerCase();
      if (!Z.has(J)) Q.delete(I), Z.add(J);
      if (Y === null) Q.delete(I), B.add(J);
      else Q.append(I, Y), B.delete(J)
    }
  }
  return {
    [tOB]: !0,
    values: Q,
    nulls: B
  }
}
// @from(Start 6724760, End 6724836)
CM = L(() => {
  Jr();
  tOB = Symbol.for("brand.privateNullableHeaders")
})
// @from(Start 6724839, End 6724933)
function ARB(A) {
  return A.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent)
}
// @from(Start 6724938, End 6724941)
eOB
// @from(Start 6724943, End 6726307)
p$6 = (A = ARB) => function(B, ...G) {
    if (B.length === 1) return B[0];
    let Z = !1,
      I = [],
      Y = B.reduce((V, F, K) => {
        if (/[?#]/.test(F)) Z = !0;
        let D = G[K],
          H = (Z ? encodeURIComponent : A)("" + D);
        if (K !== G.length && (D == null || typeof D === "object" && D.toString === Object.getPrototypeOf(Object.getPrototypeOf(D.hasOwnProperty ?? eOB) ?? eOB)?.toString)) H = D + "", I.push({
          start: V.length + F.length,
          length: H.length,
          error: `Value of type ${Object.prototype.toString.call(D).slice(8,-1)} is not a valid path parameter`
        });
        return V + F + (K === G.length ? "" : H)
      }, ""),
      J = Y.split(/[?#]/, 1)[0],
      W = /(?<=^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi,
      X;
    while ((X = W.exec(J)) !== null) I.push({
      start: X.index,
      length: X[0].length,
      error: `Value "${X[0]}" can't be safely passed as a path parameter`
    });
    if (I.sort((V, F) => V.start - F.start), I.length > 0) {
      let V = 0,
        F = I.reduce((K, D) => {
          let H = " ".repeat(D.start - V),
            C = "^".repeat(D.length);
          return V = D.start + D.length, K + H + C
        }, "");
      throw new vB(`Path parameters result in path with invalid segments:
${I.map((K)=>K.error).join(`
`)}
${Y}
${F}`)
    }
    return Y
  }
// @from(Start 6726311, End 6726313)
IY
// @from(Start 6726319, End 6726402)
Mp = L(() => {
  pC();
  eOB = Object.freeze(Object.create(null)), IY = p$6(ARB)
})
// @from(Start 6726408, End 6726411)
x$A
// @from(Start 6726417, End 6728052)
pm1 = L(() => {
  d_();
  CM();
  JGA();
  Mp();
  x$A = class x$A extends pY {
    list(A = {}, Q) {
      let {
        betas: B,
        ...G
      } = A ?? {};
      return this._client.getAPIList("/v1/files", NT, {
        query: G,
        ...Q,
        headers: r4([{
          "anthropic-beta": [...B ?? [], "files-api-2025-04-14"].toString()
        }, Q?.headers])
      })
    }
    delete(A, Q = {}, B) {
      let {
        betas: G
      } = Q ?? {};
      return this._client.delete(IY`/v1/files/${A}`, {
        ...B,
        headers: r4([{
          "anthropic-beta": [...G ?? [], "files-api-2025-04-14"].toString()
        }, B?.headers])
      })
    }
    download(A, Q = {}, B) {
      let {
        betas: G
      } = Q ?? {};
      return this._client.get(IY`/v1/files/${A}/content`, {
        ...B,
        headers: r4([{
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
      return this._client.get(IY`/v1/files/${A}`, {
        ...B,
        headers: r4([{
          "anthropic-beta": [...G ?? [], "files-api-2025-04-14"].toString()
        }, B?.headers])
      })
    }
    upload(A, Q) {
      let {
        betas: B,
        ...G
      } = A;
      return this._client.post("/v1/files", YGA({
        body: G,
        ...Q,
        headers: r4([{
          "anthropic-beta": [...B ?? [], "files-api-2025-04-14"].toString()
        }, Q?.headers])
      }, this._client))
    }
  }
})
// @from(Start 6728058, End 6728061)
v$A
// @from(Start 6728067, End 6728813)
lm1 = L(() => {
  d_();
  CM();
  Mp();
  v$A = class v$A extends pY {
    retrieve(A, Q = {}, B) {
      let {
        betas: G
      } = Q ?? {};
      return this._client.get(IY`/v1/models/${A}?beta=true`, {
        ...B,
        headers: r4([{
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
      return this._client.getAPIList("/v1/models?beta=true", NT, {
        query: G,
        ...Q,
        headers: r4([{
          ...B?.toString() != null ? {
            "anthropic-beta": B?.toString()
          } : void 0
        }, Q?.headers])
      })
    }
  }
})
// @from(Start 6728819, End 6728822)
jrA
// @from(Start 6728828, End 6729176)
im1 = L(() => {
  jrA = {
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
// @from(Start 6729179, End 6729318)
function QRB() {
  let A, Q;
  return {
    promise: new Promise((G, Z) => {
      A = G, Q = Z
    }),
    resolve: A,
    reject: Q
  }
}
// @from(Start 6729319, End 6730322)
async function n$6(A, Q = A.messages.at(-1)) {
  if (!Q || Q.role !== "assistant" || !Q.content || typeof Q.content === "string") return null;
  let B = Q.content.filter((Z) => Z.type === "tool_use");
  if (B.length === 0) return null;
  return {
    role: "user",
    content: await Promise.all(B.map(async (Z) => {
      let I = A.tools.find((Y) => Y.name === Z.name);
      if (!I || !("run" in I)) return {
        type: "tool_result",
        tool_use_id: Z.id,
        content: `Error: Tool '${Z.name}' not found`,
        is_error: !0
      };
      try {
        let Y = Z.input;
        if ("parse" in I && I.parse) Y = I.parse(Y);
        let J = await I.run(Y);
        return {
          type: "tool_result",
          tool_use_id: Z.id,
          content: J
        }
      } catch (Y) {
        return {
          type: "tool_result",
          tool_use_id: Z.id,
          content: `Error: ${Y instanceof Error?Y.message:String(Y)}`,
          is_error: !0
        }
      }
    }))
  }
}
// @from(Start 6730327, End 6730330)
SrA
// @from(Start 6730332, End 6730335)
WGA
// @from(Start 6730337, End 6730339)
Ye
// @from(Start 6730341, End 6730343)
zU
// @from(Start 6730345, End 6730348)
b$A
// @from(Start 6730350, End 6730352)
LT
// @from(Start 6730354, End 6730356)
Kf
// @from(Start 6730358, End 6730360)
Op
// @from(Start 6730362, End 6730365)
f$A
// @from(Start 6730367, End 6730370)
nm1
// @from(Start 6730372, End 6730375)
h$A
// @from(Start 6730381, End 6734132)
am1 = L(() => {
  Kv();
  pC();
  CM();
  h$A = class h$A {
    constructor(A, Q, B) {
      SrA.add(this), this.client = A, WGA.set(this, !1), Ye.set(this, !1), zU.set(this, void 0), b$A.set(this, void 0), LT.set(this, void 0), Kf.set(this, void 0), Op.set(this, void 0), f$A.set(this, 0), fB(this, zU, {
        params: {
          ...Q,
          messages: structuredClone(Q.messages)
        }
      }, "f"), fB(this, b$A, {
        ...B,
        headers: r4([{
          "x-stainless-helper": "BetaToolRunner"
        }, B?.headers])
      }, "f"), fB(this, Op, QRB(), "f")
    }
    async * [(WGA = new WeakMap, Ye = new WeakMap, zU = new WeakMap, b$A = new WeakMap, LT = new WeakMap, Kf = new WeakMap, Op = new WeakMap, f$A = new WeakMap, SrA = new WeakSet, Symbol.asyncIterator)]() {
      var A;
      if (N0(this, WGA, "f")) throw new vB("Cannot iterate over a consumed stream");
      fB(this, WGA, !0, "f"), fB(this, Ye, !0, "f"), fB(this, Kf, void 0, "f");
      try {
        while (!0) {
          let Q;
          try {
            if (N0(this, zU, "f").params.max_iterations && N0(this, f$A, "f") >= N0(this, zU, "f").params.max_iterations) break;
            fB(this, Ye, !1, "f"), fB(this, LT, void 0, "f"), fB(this, Kf, void 0, "f"), fB(this, f$A, (A = N0(this, f$A, "f"), A++, A), "f");
            let {
              max_iterations: B,
              ...G
            } = N0(this, zU, "f").params;
            if (G.stream) Q = this.client.beta.messages.stream({
              ...G
            }, N0(this, b$A, "f")), fB(this, LT, Q.finalMessage(), "f"), N0(this, LT, "f").catch(() => {}), yield Q;
            else fB(this, LT, this.client.beta.messages.create({
              ...G,
              stream: !1
            }, N0(this, b$A, "f")), "f"), yield N0(this, LT, "f");
            if (!N0(this, Ye, "f")) {
              let {
                role: I,
                content: Y
              } = await N0(this, LT, "f");
              N0(this, zU, "f").params.messages.push({
                role: I,
                content: Y
              })
            }
            let Z = await N0(this, SrA, "m", nm1).call(this, N0(this, zU, "f").params.messages.at(-1));
            if (Z) N0(this, zU, "f").params.messages.push(Z);
            if (!Z && !N0(this, Ye, "f")) break
          } finally {
            if (Q) Q.abort()
          }
        }
        if (!N0(this, LT, "f")) throw new vB("ToolRunner concluded without a message from the server");
        N0(this, Op, "f").resolve(await N0(this, LT, "f"))
      } catch (Q) {
        throw fB(this, WGA, !1, "f"), N0(this, Op, "f").promise.catch(() => {}), N0(this, Op, "f").reject(Q), fB(this, Op, QRB(), "f"), Q
      }
    }
    setMessagesParams(A) {
      if (typeof A === "function") N0(this, zU, "f").params = A(N0(this, zU, "f").params);
      else N0(this, zU, "f").params = A;
      fB(this, Ye, !0, "f"), fB(this, Kf, void 0, "f")
    }
    async generateToolResponse() {
      let A = await N0(this, LT, "f") ?? this.params.messages.at(-1);
      if (!A) return null;
      return N0(this, SrA, "m", nm1).call(this, A)
    }
    done() {
      return N0(this, Op, "f").promise
    }
    async runUntilDone() {
      if (!N0(this, WGA, "f"))
        for await (let A of this);
      return this.done()
    }
    get params() {
      return N0(this, zU, "f").params
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
  nm1 = async function(Q) {
    if (N0(this, Kf, "f") !== void 0) return N0(this, Kf, "f");
    return fB(this, Kf, n$6(N0(this, zU, "f").params, Q), "f"), N0(this, Kf, "f")
  }
})
// @from(Start 6734138, End 6734141)
XGA
// @from(Start 6734147, End 6734996)
sm1 = L(() => {
  pC();
  QC1();
  XGA = class XGA {
    constructor(A, Q) {
      this.iterator = A, this.controller = Q
    }
    async * decoder() {
      let A = new gm;
      for await (let Q of this.iterator) for (let B of A.decode(Q)) yield JSON.parse(B);
      for (let Q of A.flush()) yield JSON.parse(Q)
    } [Symbol.asyncIterator]() {
      return this.decoder()
    }
    static fromResponse(A, Q) {
      if (!A.body) {
        if (Q.abort(), typeof globalThis.navigator < "u" && globalThis.navigator.product === "ReactNative") throw new vB("The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api");
        throw new vB("Attempted to iterate over a response with no body")
      }
      return new XGA(_KA(A.body), Q)
    }
  }
})
// @from(Start 6735002, End 6735005)
g$A
// @from(Start 6735011, End 6737301)
rm1 = L(() => {
  d_();
  CM();
  sm1();
  Yr();
  Mp();
  g$A = class g$A extends pY {
    create(A, Q) {
      let {
        betas: B,
        ...G
      } = A;
      return this._client.post("/v1/messages/batches?beta=true", {
        body: G,
        ...Q,
        headers: r4([{
          "anthropic-beta": [...B ?? [], "message-batches-2024-09-24"].toString()
        }, Q?.headers])
      })
    }
    retrieve(A, Q = {}, B) {
      let {
        betas: G
      } = Q ?? {};
      return this._client.get(IY`/v1/messages/batches/${A}?beta=true`, {
        ...B,
        headers: r4([{
          "anthropic-beta": [...G ?? [], "message-batches-2024-09-24"].toString()
        }, B?.headers])
      })
    }
    list(A = {}, Q) {
      let {
        betas: B,
        ...G
      } = A ?? {};
      return this._client.getAPIList("/v1/messages/batches?beta=true", NT, {
        query: G,
        ...Q,
        headers: r4([{
          "anthropic-beta": [...B ?? [], "message-batches-2024-09-24"].toString()
        }, Q?.headers])
      })
    }
    delete(A, Q = {}, B) {
      let {
        betas: G
      } = Q ?? {};
      return this._client.delete(IY`/v1/messages/batches/${A}?beta=true`, {
        ...B,
        headers: r4([{
          "anthropic-beta": [...G ?? [], "message-batches-2024-09-24"].toString()
        }, B?.headers])
      })
    }
    cancel(A, Q = {}, B) {
      let {
        betas: G
      } = Q ?? {};
      return this._client.post(IY`/v1/messages/batches/${A}/cancel?beta=true`, {
        ...B,
        headers: r4([{
          "anthropic-beta": [...G ?? [], "message-batches-2024-09-24"].toString()
        }, B?.headers])
      })
    }
    async results(A, Q = {}, B) {
      let G = await this.retrieve(A);
      if (!G.results_url) throw new vB(`No batch \`results_url\`; Has it finished processing? ${G.processing_status} - ${G.id}`);
      let {
        betas: Z
      } = Q ?? {};
      return this._client.get(G.results_url, {
        ...B,
        headers: r4([{
          "anthropic-beta": [...Z ?? [], "message-batches-2024-09-24"].toString(),
          Accept: "application/binary"
        }, B?.headers]),
        stream: !0,
        __binaryResponse: !0
      })._thenUnwrap((I, Y) => XGA.fromResponse(Y.response, Y.controller))
    }
  }
})
// @from(Start 6737307, End 6737310)
BRB
// @from(Start 6737312, End 6737314)
Je
// @from(Start 6737320, End 6739673)
om1 = L(() => {
  im1();
  CM();
  WC1();
  DC1();
  am1();
  rm1();
  rm1();
  am1();
  BRB = {
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
  Je = class Je extends pY {
    constructor() {
      super(...arguments);
      this.batches = new g$A(this._client)
    }
    create(A, Q) {
      let {
        betas: B,
        ...G
      } = A;
      if (G.model in BRB) console.warn(`The model '${G.model}' is deprecated and will reach end-of-life on ${BRB[G.model]}
Please migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`);
      let Z = this._client._options.timeout;
      if (!G.stream && Z == null) {
        let I = jrA[G.model] ?? void 0;
        Z = this._client.calculateNonstreamingTimeout(G.max_tokens, I)
      }
      return this._client.post("/v1/messages?beta=true", {
        body: G,
        timeout: Z ?? 600000,
        ...Q,
        headers: r4([{
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
        headers: r4([{
          "anthropic-beta": [...A.betas ?? [], "structured-outputs-2025-09-17"].toString()
        }, Q?.headers])
      }, this.create(A, Q).then((B) => JC1(B, A))
    }
    stream(A, Q) {
      return Wr.createMessage(this, A, Q)
    }
    countTokens(A, Q) {
      let {
        betas: B,
        ...G
      } = A;
      return this._client.post("/v1/messages/count_tokens?beta=true", {
        body: G,
        ...Q,
        headers: r4([{
          "anthropic-beta": [...B ?? [], "token-counting-2024-11-01"].toString()
        }, Q?.headers])
      })
    }
    toolRunner(A, Q) {
      return new h$A(this._client, A, Q)
    }
  };
  Je.Batches = g$A;
  Je.BetaToolRunner = h$A
})
// @from(Start 6739679, End 6739682)
u$A
// @from(Start 6739688, End 6741086)
tm1 = L(() => {
  d_();
  CM();
  JGA();
  Mp();
  u$A = class u$A extends pY {
    create(A, Q = {}, B) {
      let {
        betas: G,
        ...Z
      } = Q ?? {};
      return this._client.post(IY`/v1/skills/${A}/versions?beta=true`, YGA({
        body: Z,
        ...B,
        headers: r4([{
          "anthropic-beta": [...G ?? [], "skills-2025-10-02"].toString()
        }, B?.headers])
      }, this._client))
    }
    retrieve(A, Q, B) {
      let {
        skill_id: G,
        betas: Z
      } = Q;
      return this._client.get(IY`/v1/skills/${G}/versions/${A}?beta=true`, {
        ...B,
        headers: r4([{
          "anthropic-beta": [...Z ?? [], "skills-2025-10-02"].toString()
        }, B?.headers])
      })
    }
    list(A, Q = {}, B) {
      let {
        betas: G,
        ...Z
      } = Q ?? {};
      return this._client.getAPIList(IY`/v1/skills/${A}/versions?beta=true`, k$A, {
        query: Z,
        ...B,
        headers: r4([{
          "anthropic-beta": [...G ?? [], "skills-2025-10-02"].toString()
        }, B?.headers])
      })
    }
    delete(A, Q, B) {
      let {
        skill_id: G,
        betas: Z
      } = Q;
      return this._client.delete(IY`/v1/skills/${G}/versions/${A}?beta=true`, {
        ...B,
        headers: r4([{
          "anthropic-beta": [...Z ?? [], "skills-2025-10-02"].toString()
        }, B?.headers])
      })
    }
  }
})
// @from(Start 6741092, End 6741095)
VGA
// @from(Start 6741101, End 6742550)
em1 = L(() => {
  tm1();
  tm1();
  d_();
  CM();
  JGA();
  Mp();
  VGA = class VGA extends pY {
    constructor() {
      super(...arguments);
      this.versions = new u$A(this._client)
    }
    create(A = {}, Q) {
      let {
        betas: B,
        ...G
      } = A ?? {};
      return this._client.post("/v1/skills?beta=true", YGA({
        body: G,
        ...Q,
        headers: r4([{
          "anthropic-beta": [...B ?? [], "skills-2025-10-02"].toString()
        }, Q?.headers])
      }, this._client))
    }
    retrieve(A, Q = {}, B) {
      let {
        betas: G
      } = Q ?? {};
      return this._client.get(IY`/v1/skills/${A}?beta=true`, {
        ...B,
        headers: r4([{
          "anthropic-beta": [...G ?? [], "skills-2025-10-02"].toString()
        }, B?.headers])
      })
    }
    list(A = {}, Q) {
      let {
        betas: B,
        ...G
      } = A ?? {};
      return this._client.getAPIList("/v1/skills?beta=true", k$A, {
        query: G,
        ...Q,
        headers: r4([{
          "anthropic-beta": [...B ?? [], "skills-2025-10-02"].toString()
        }, Q?.headers])
      })
    }
    delete(A, Q = {}, B) {
      let {
        betas: G
      } = Q ?? {};
      return this._client.delete(IY`/v1/skills/${A}?beta=true`, {
        ...B,
        headers: r4([{
          "anthropic-beta": [...G ?? [], "skills-2025-10-02"].toString()
        }, B?.headers])
      })
    }
  };
  VGA.Versions = u$A
})
// @from(Start 6742556, End 6742558)
pH
// @from(Start 6742564, End 6742969)
Ad1 = L(() => {
  pm1();
  pm1();
  lm1();
  lm1();
  om1();
  om1();
  em1();
  em1();
  pH = class pH extends pY {
    constructor() {
      super(...arguments);
      this.models = new v$A(this._client), this.messages = new Je(this._client), this.files = new x$A(this._client), this.skills = new VGA(this._client)
    }
  };
  pH.Models = v$A;
  pH.Messages = Je;
  pH.Files = x$A;
  pH.Skills = VGA
})
// @from(Start 6742975, End 6742977)
Rp
// @from(Start 6742983, End 6743453)
Qd1 = L(() => {
  CM();
  Rp = class Rp extends pY {
    create(A, Q) {
      let {
        betas: B,
        ...G
      } = A;
      return this._client.post("/v1/complete", {
        body: G,
        timeout: this._client._options.timeout ?? 600000,
        ...Q,
        headers: r4([{
          ...B?.toString() != null ? {
            "anthropic-beta": B?.toString()
          } : void 0
        }, Q?.headers]),
        stream: A.stream ?? !1
      })
    }
  }
})
// @from(Start 6743456, End 6743538)
function YRB(A) {
  return A.type === "tool_use" || A.type === "server_tool_use"
}
// @from(Start 6743540, End 6743558)
function JRB(A) {}
// @from(Start 6743563, End 6743565)
EM
// @from(Start 6743567, End 6743569)
Tp
// @from(Start 6743571, End 6743574)
m$A
// @from(Start 6743576, End 6743579)
_rA
// @from(Start 6743581, End 6743584)
d$A
// @from(Start 6743586, End 6743589)
c$A
// @from(Start 6743591, End 6743594)
krA
// @from(Start 6743596, End 6743599)
p$A
// @from(Start 6743601, End 6743603)
Df
// @from(Start 6743605, End 6743608)
l$A
// @from(Start 6743610, End 6743613)
yrA
// @from(Start 6743615, End 6743618)
xrA
// @from(Start 6743620, End 6743623)
FGA
// @from(Start 6743625, End 6743628)
vrA
// @from(Start 6743630, End 6743633)
brA
// @from(Start 6743635, End 6743638)
Bd1
// @from(Start 6743640, End 6743643)
GRB
// @from(Start 6743645, End 6743648)
Gd1
// @from(Start 6743650, End 6743653)
Zd1
// @from(Start 6743655, End 6743658)
Id1
// @from(Start 6743660, End 6743663)
Yd1
// @from(Start 6743665, End 6743668)
ZRB
// @from(Start 6743670, End 6743688)
IRB = "__json_buf"
// @from(Start 6743692, End 6743695)
i$A