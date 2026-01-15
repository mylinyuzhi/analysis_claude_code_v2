
// @from(Ln 446352, Col 0)
function Oq7(A) {
  return Array.isArray(A) && typeof A[0] === "object" && A[0] !== null && "type" in A[0] && A[0].type === "text" && "text" in A[0] && A[0].text === "DIFF_REJECTED"
}
// @from(Ln 446356, Col 0)
function Mq7(A) {
  return Array.isArray(A) && A[0]?.type === "text" && A[0].text === "FILE_SAVED" && typeof A[1].text === "string"
}
// @from(Ln 446359, Col 4)
Pp
// @from(Ln 446360, Col 4)
eI9 = w(() => {
  DQ();
  hs();
  Lc();
  v1();
  GQ();
  TX();
  Z0();
  TX();
  oZ();
  UL0();
  c3();
  y9();
  Pp = c(QA(), 1)
})
// @from(Ln 446379, Col 0)
function AD9({
  onChange: A,
  options: Q,
  input: B,
  filePath: G,
  ideName: Z,
  rejectFeedback: Y,
  acceptFeedback: J,
  setFocusedOption: X,
  onInputModeToggle: I,
  focusedOption: D,
  yesInputMode: W,
  noInputMode: K
}) {
  return vj.default.createElement(T, {
    flexDirection: "column"
  }, vj.default.createElement(K8, {
    dividerColor: "permission"
  }), vj.default.createElement(T, {
    marginX: 1,
    flexDirection: "column",
    gap: 1
  }, vj.default.createElement(C, {
    bold: !0,
    color: "permission"
  }, "Opened changes in ", Z, " ⧉"), JhA() && vj.default.createElement(C, {
    dimColor: !0
  }, "Save file to continue…"), vj.default.createElement(T, {
    flexDirection: "column"
  }, vj.default.createElement(C, null, "Do you want to make this edit to", " ", vj.default.createElement(C, {
    bold: !0
  }, Rq7(G)), "?"), vj.default.createElement(k0, {
    options: Q,
    inlineDescriptions: !0,
    onChange: (V) => {
      let F = Q.find((H) => H.value === V);
      if (F) {
        if (F.option.type === "reject") {
          let H = Y.trim();
          A(F.option, B, H || void 0);
          return
        }
        if (F.option.type === "accept-once") {
          let H = J.trim();
          A(F.option, B, H || void 0);
          return
        }
        A(F.option, B)
      }
    },
    onCancel: () => A({
      type: "reject"
    }, B),
    onFocus: (V) => X(V),
    onInputModeToggle: I
  })), vj.default.createElement(T, {
    marginTop: 1
  }, vj.default.createElement(C, {
    dimColor: !0
  }, "Esc to cancel", (D === "yes" && !W || D === "no" && !K) && " · Tab to add additional instructions"))))
}
// @from(Ln 446440, Col 4)
vj
// @from(Ln 446441, Col 4)
QD9 = w(() => {
  fA();
  u8();
  TX();
  lD();
  vj = c(QA(), 1)
})
// @from(Ln 446449, Col 0)
function Ih({
  toolUseConfirm: A,
  toolUseContext: Q,
  onDone: B,
  onReject: G,
  title: Z,
  subtitle: Y,
  question: J = "Do you want to proceed?",
  content: X,
  completionType: I = "tool_use_single",
  languageName: D = "none",
  path: W,
  parseInput: K,
  operationType: V = "write",
  ideDiffSupport: F
}) {
  let H = BD9.useMemo(() => ({
    completion_type: I,
    language_name: D
  }), [I, D]);
  yj(A, H);
  let E = rI9({
      filePath: W || "",
      completionType: I,
      languageName: D,
      toolUseConfirm: A,
      onDone: B,
      onReject: G,
      parseInput: K,
      operationType: V
    }),
    {
      options: z,
      acceptFeedback: $,
      rejectFeedback: O,
      setFocusedOption: L,
      handleInputModeToggle: M,
      focusedOption: _,
      yesInputMode: j,
      noInputMode: x
    } = E,
    b = K(A.input),
    S = F ? F.getConfig(b) : null,
    u = S ? {
      onChange: (p, GA) => {
        let WA = F.applyChanges(b, GA.edits);
        E.onChange(p, WA)
      },
      toolUseContext: Q,
      filePath: S.filePath,
      edits: (S.edits || []).map((p) => ({
        old_string: p.old_string,
        new_string: p.new_string,
        replace_all: p.replace_all || !1
      })),
      editMode: S.editMode || "single"
    } : {
      onChange: () => {},
      toolUseContext: Q,
      filePath: "",
      edits: [],
      editMode: "single"
    },
    {
      closeTabInIDE: f,
      showingDiffInIDE: AA,
      ideName: n
    } = tI9(u),
    y = (p, GA) => {
      f?.(), E.onChange(p, b, GA?.trim())
    };
  if (AA && S && W) return Xh.default.createElement(AD9, {
    onChange: (p, GA, WA) => y(p, WA),
    options: z,
    filePath: W,
    input: b,
    ideName: n,
    rejectFeedback: O,
    acceptFeedback: $,
    setFocusedOption: L,
    onInputModeToggle: M,
    focusedOption: _,
    yesInputMode: j,
    noInputMode: x
  });
  return Xh.default.createElement(Xh.default.Fragment, null, Xh.default.createElement(VY, {
    title: Z,
    subtitle: Y,
    innerPaddingX: 0
  }, X, Xh.default.createElement(T, {
    flexDirection: "column",
    paddingX: 1
  }, typeof J === "string" ? Xh.default.createElement(C, null, J) : J, Xh.default.createElement(k0, {
    options: z,
    inlineDescriptions: !0,
    onChange: (p) => {
      let GA = z.find((WA) => WA.value === p);
      if (GA) {
        if (GA.option.type === "reject") {
          let WA = O.trim();
          y(GA.option, WA || void 0);
          return
        }
        if (GA.option.type === "accept-once") {
          let WA = $.trim();
          y(GA.option, WA || void 0);
          return
        }
        y(GA.option)
      }
    },
    onCancel: () => y({
      type: "reject"
    }),
    onFocus: (p) => L(p),
    onInputModeToggle: M
  }))), Xh.default.createElement(T, {
    paddingX: 1,
    marginTop: 1
  }, Xh.default.createElement(C, {
    dimColor: !0
  }, "Esc to cancel", (_ === "yes" && !j || _ === "no" && !x) && " · Tab to add additional instructions")))
}
// @from(Ln 446572, Col 4)
Xh
// @from(Ln 446572, Col 8)
BD9
// @from(Ln 446573, Col 4)
U$A = w(() => {
  fA();
  u8();
  dN();
  O8A();
  sI9();
  eI9();
  QD9();
  Xh = c(QA(), 1), BD9 = c(QA(), 1)
})
// @from(Ln 446584, Col 0)
function u$1(A, Q, B, G) {
  return {
    filePath: A,
    edits: [{
      old_string: Q,
      new_string: B,
      replace_all: G
    }],
    editMode: "single"
  }
}
// @from(Ln 446602, Col 0)
function GD9(A) {
  let Q = (X) => {
      return J$.inputSchema.parse(X)
    },
    B = Q(A.toolUseConfirm.input),
    {
      file_path: G,
      old_string: Z,
      new_string: Y,
      replace_all: J
    } = B;
  return guA.default.createElement(Ih, {
    toolUseConfirm: A.toolUseConfirm,
    toolUseContext: A.toolUseContext,
    onDone: A.onDone,
    onReject: A.onReject,
    title: "Edit file",
    subtitle: jq7(o1(), G),
    question: guA.default.createElement(C, null, "Do you want to make this edit to", " ", guA.default.createElement(C, {
      bold: !0
    }, _q7(G)), "?"),
    content: guA.default.createElement(g$1, {
      file_path: G,
      edits: [{
        old_string: Z,
        new_string: Y,
        replace_all: J || !1
      }]
    }),
    path: G,
    completionType: "str_replace_single",
    languageName: ge(G),
    parseInput: Q,
    ideDiffSupport: Tq7
  })
}
// @from(Ln 446638, Col 4)
guA
// @from(Ln 446638, Col 9)
Tq7
// @from(Ln 446639, Col 4)
ZD9 = w(() => {
  fA();
  is();
  WS0();
  y9();
  U$A();
  V2();
  guA = c(QA(), 1), Tq7 = {
    getConfig: (A) => u$1(A.file_path, A.old_string, A.new_string, A.replace_all),
    applyChanges: (A, Q) => {
      let B = Q[0];
      if (B) return {
        ...A,
        old_string: B.old_string,
        new_string: B.new_string,
        replace_all: B.replace_all
      };
      return A
    }
  }
})
// @from(Ln 446661, Col 0)
function Sp(A, {
  assistantMessage: {
    message: {
      id: Q
    }
  }
}, B, G) {
  iJ({
    completion_type: A,
    event: B,
    metadata: {
      language_name: "none",
      message_id: Q,
      platform: l0.platform,
      hasFeedback: G ?? !1
    }
  })
}
// @from(Ln 446679, Col 4)
FS0 = w(() => {
  p3();
  le()
})
// @from(Ln 446685, Col 0)
function Pq7(A) {
  switch (A.length) {
    case 0:
      return "";
    case 1:
      return LY.default.createElement(C, {
        bold: !0
      }, A[0]);
    case 2:
      return LY.default.createElement(C, null, LY.default.createElement(C, {
        bold: !0
      }, A[0]), " and ", LY.default.createElement(C, {
        bold: !0
      }, A[1]));
    default:
      return LY.default.createElement(C, null, LY.default.createElement(C, {
        bold: !0
      }, A.slice(0, -1).join(", ")), ", and", " ", LY.default.createElement(C, {
        bold: !0
      }, A.slice(-1)[0]))
  }
}
// @from(Ln 446708, Col 0)
function HS0(A) {
  if (A.join(", ").length > 50) return "similar";
  return Pq7(A)
}
// @from(Ln 446713, Col 0)
function uuA(A) {
  if (A.length === 0) return "";
  let Q = A.map((B) => B.split("/").pop() || B);
  if (Q.length === 1) return LY.default.createElement(C, null, LY.default.createElement(C, {
    bold: !0
  }, Q[0]), ne.sep);
  if (Q.length === 2) return LY.default.createElement(C, null, LY.default.createElement(C, {
    bold: !0
  }, Q[0]), ne.sep, " and ", LY.default.createElement(C, {
    bold: !0
  }, Q[1]), ne.sep);
  return LY.default.createElement(C, null, LY.default.createElement(C, {
    bold: !0
  }, Q[0]), ne.sep, ", ", LY.default.createElement(C, {
    bold: !0
  }, Q[1]), ne.sep, " and ", A.length - 2, " more")
}
// @from(Ln 446731, Col 0)
function Sq7(A) {
  let Q = A.filter((W) => W.type === "addRules").flatMap((W) => W.rules || []),
    B = Q.filter((W) => W.toolName === "Read"),
    G = Q.filter((W) => W.toolName === "Bash"),
    Z = A.filter((W) => W.type === "addDirectories").flatMap((W) => W.directories || []),
    Y = B.map((W) => W.ruleContent?.replace("/**", "") || "").filter((W) => W),
    J = [...new Set(G.flatMap((W) => {
      if (!W.ruleContent) return [];
      let K = fq0(W.ruleContent) ?? W.ruleContent,
        {
          commandWithoutRedirections: V,
          redirections: F
        } = Hx(K);
      return F.length > 0 ? V : K
    }))],
    X = Z.length > 0,
    I = Y.length > 0,
    D = J.length > 0;
  if (I && !X && !D) {
    if (Y.length === 1) {
      let W = Y[0],
        K = W.split("/").pop() || W;
      return LY.default.createElement(C, null, "Yes, allow reading from ", LY.default.createElement(C, {
        bold: !0
      }, K), ne.sep, " from this project")
    }
    return LY.default.createElement(C, null, "Yes, allow reading from ", uuA(Y), " from this project")
  }
  if (X && !I && !D) {
    if (Z.length === 1) {
      let W = Z[0],
        K = W.split("/").pop() || W;
      return LY.default.createElement(C, null, "Yes, and always allow access to ", LY.default.createElement(C, {
        bold: !0
      }, K), ne.sep, " from this project")
    }
    return LY.default.createElement(C, null, "Yes, and always allow access to ", uuA(Z), " from this project")
  }
  if (D && !X && !I) return LY.default.createElement(C, null, "Yes, and don't ask again for ", HS0(J), " commands in", " ", LY.default.createElement(C, {
    bold: !0
  }, EQ()));
  if ((X || I) && !D) {
    let W = [...Z, ...Y];
    if (X && I) return LY.default.createElement(C, null, "Yes, and always allow access to ", uuA(W), " from this project")
  }
  if ((X || I) && D) {
    let W = [...Z, ...Y];
    if (W.length === 1 && J.length === 1) return LY.default.createElement(C, null, "Yes, and allow access to ", uuA(W), " and", " ", HS0(J), " commands");
    return LY.default.createElement(C, null, "Yes, and allow ", uuA(W), " access and", " ", HS0(J), " commands")
  }
  return null
}
// @from(Ln 446784, Col 0)
function xq7(A, Q) {
  let B = A.toLowerCase().trimEnd();
  return Q.some((G) => G.toLowerCase().trimEnd() === B)
}
// @from(Ln 446789, Col 0)
function YD9({
  suggestions: A = [],
  onRejectFeedbackChange: Q,
  onAcceptFeedbackChange: B,
  onClassifierDescriptionChange: G,
  classifierDescription: Z,
  existingAllowDescriptions: Y = [],
  yesInputMode: J = !1,
  noInputMode: X = !1
}) {
  let I = [];
  if (J) I.push({
    type: "input",
    label: "Yes",
    value: "yes",
    placeholder: "and tell Claude what to do next",
    onChange: B,
    allowEmptySubmit: !0
  });
  else I.push({
    label: "Yes",
    value: "yes"
  });
  if (A.length > 0) {
    let D = Sq7(A);
    if (D) I.push({
      label: D,
      value: "yes-apply-suggestions"
    })
  }
  if ($t() && G && !xq7(Z ?? "", Y)) I.push({
    type: "input",
    label: "Yes, and always allow Claude to",
    value: "yes-classifier-reviewed",
    placeholder: "describe what to allow...",
    initialValue: Z ?? "",
    onChange: G,
    allowEmptySubmit: !1,
    showLabelWithValue: !0,
    labelValueSeparator: ": "
  });
  if (X) I.push({
    type: "input",
    label: "No",
    value: "no",
    placeholder: "and tell Claude what to do differently",
    onChange: Q,
    allowEmptySubmit: !0
  });
  else I.push({
    label: "No",
    value: "no"
  });
  return I
}
// @from(Ln 446844, Col 4)
LY
// @from(Ln 446845, Col 4)
JD9 = w(() => {
  fA();
  C0();
  nK1();
  KU();
  LY = c(QA(), 1)
})
// @from(Ln 446853, Col 0)
function XD9(A) {
  switch (A.type) {
    case "rule":
      return `${I1.bold(S5(A.rule.ruleValue))} rule from ${z01(A.rule.source)}`;
    case "mode":
      return `${su(A.mode)} mode`;
    case "sandboxOverride":
      return "Requires permission to bypass sandbox";
    case "workingDir":
      return A.reason;
    case "other":
      return A.reason;
    case "permissionPromptTool":
      return `${I1.bold(A.permissionPromptToolName)} permission prompt tool`;
    case "hook":
      return A.reason ? `${I1.bold(A.hookName)} hook: ${A.reason}` : `${I1.bold(A.hookName)} hook`;
    case "asyncAgent":
      return A.reason;
    case "classifier":
      return `${I1.bold(A.classifier)} classifier: ${A.reason}`
  }
}
// @from(Ln 446876, Col 0)
function yq7({
  title: A,
  decisionReason: Q
}) {
  let [B] = oB();

  function G() {
    switch (Q.type) {
      case "subcommandResults":
        return O9.default.createElement(T, {
          flexDirection: "column"
        }, Array.from(Q.reasons.entries()).map(([Z, Y]) => {
          let J = Y.behavior === "allow" ? sQ("success", B)(tA.tick) : sQ("error", B)(tA.cross);
          return O9.default.createElement(T, {
            flexDirection: "column",
            key: Z
          }, O9.default.createElement(C, null, J, " ", Z), Y.decisionReason !== void 0 && Y.decisionReason.type !== "subcommandResults" && O9.default.createElement(C, null, "  ", "⎿", "  ", O9.default.createElement(M8, null, XD9(Y.decisionReason))), Y.behavior === "ask" && (() => {
            let X = ABA(Y.suggestions);
            return X.length > 0 ? O9.default.createElement(C, null, "  ", "⎿", "  ", "Suggested rules:", " ", O9.default.createElement(M8, null, X.map((I) => I1.bold(S5(I))).join(", "))) : null
          })())
        }));
      default:
        return O9.default.createElement(C, null, O9.default.createElement(M8, null, XD9(Q)))
    }
  }
  return O9.default.createElement(T, {
    flexDirection: "column"
  }, A && O9.default.createElement(C, null, A), G())
}
// @from(Ln 446906, Col 0)
function vq7(A) {
  if (!A) return [];
  return A.flatMap((Q) => {
    switch (Q.type) {
      case "addDirectories":
        return Q.directories;
      default:
        return []
    }
  })
}
// @from(Ln 446918, Col 0)
function kq7(A) {
  if (!A) return;
  for (let Q = A.length - 1; Q >= 0; Q--) {
    let B = A[Q];
    if (B?.type === "setMode") return B.mode
  }
  return
}
// @from(Ln 446927, Col 0)
function bq7({
  suggestions: A,
  width: Q
}) {
  if (!A || A.length === 0) return O9.default.createElement(T, {
    flexDirection: "row"
  }, O9.default.createElement(T, {
    justifyContent: "flex-end",
    minWidth: Q
  }, O9.default.createElement(C, {
    dimColor: !0
  }, "Suggestions ")), O9.default.createElement(C, null, "None"));
  let B = ABA(A),
    G = vq7(A),
    Z = kq7(A);
  if (B.length === 0 && G.length === 0 && !Z) return O9.default.createElement(T, {
    flexDirection: "row"
  }, O9.default.createElement(T, {
    justifyContent: "flex-end",
    minWidth: Q
  }, O9.default.createElement(C, {
    dimColor: !0
  }, "Suggestion ")), O9.default.createElement(C, null, "None"));
  return O9.default.createElement(T, {
    flexDirection: "column"
  }, O9.default.createElement(T, {
    flexDirection: "row"
  }, O9.default.createElement(T, {
    justifyContent: "flex-end",
    minWidth: Q
  }, O9.default.createElement(C, {
    dimColor: !0
  }, "Suggestions ")), O9.default.createElement(C, null, " ")), B.length > 0 && O9.default.createElement(T, {
    flexDirection: "row"
  }, O9.default.createElement(T, {
    justifyContent: "flex-end",
    minWidth: Q
  }, O9.default.createElement(C, {
    dimColor: !0
  }, " Rules ")), O9.default.createElement(T, {
    flexDirection: "column"
  }, B.map((Y, J) => O9.default.createElement(C, {
    key: J
  }, tA.bullet, " ", S5(Y))))), G.length > 0 && O9.default.createElement(T, {
    flexDirection: "row"
  }, O9.default.createElement(T, {
    justifyContent: "flex-end",
    minWidth: Q
  }, O9.default.createElement(C, {
    dimColor: !0
  }, " Directories ")), O9.default.createElement(T, {
    flexDirection: "column"
  }, G.map((Y, J) => O9.default.createElement(C, {
    key: J
  }, tA.bullet, " ", Y)))), Z && O9.default.createElement(T, {
    flexDirection: "row"
  }, O9.default.createElement(T, {
    justifyContent: "flex-end",
    minWidth: Q
  }, O9.default.createElement(C, {
    dimColor: !0
  }, " Mode ")), O9.default.createElement(C, null, su(Z))))
}
// @from(Ln 446991, Col 0)
function DD9({
  permissionResult: A,
  toolName: Q
}) {
  let [{
    toolPermissionContext: B
  }] = a0(), G = A.decisionReason, Z = "suggestions" in A ? A.suggestions : void 0, Y = ID9.useMemo(() => {
    let X = XB.isSandboxingEnabled() && XB.isAutoAllowBashIfSandboxedEnabled(),
      I = $VA(B, {
        sandboxAutoAllowEnabled: X
      }),
      D = ABA(Z);
    if (D.length > 0) return I.filter((W) => D.some((K) => K.toolName === W.rule.ruleValue.toolName && K.ruleContent === W.rule.ruleValue.ruleContent));
    if (Q) return I.filter((W) => W.rule.ruleValue.toolName === Q);
    return I
  }, [B, Q, Z]), J = 10;
  return O9.default.createElement(T, {
    flexDirection: "column"
  }, O9.default.createElement(T, {
    flexDirection: "row"
  }, O9.default.createElement(T, {
    justifyContent: "flex-end",
    minWidth: 10
  }, O9.default.createElement(C, {
    dimColor: !0
  }, "Behavior ")), O9.default.createElement(C, null, A.behavior)), A.behavior !== "allow" && O9.default.createElement(T, {
    flexDirection: "row"
  }, O9.default.createElement(T, {
    justifyContent: "flex-end",
    minWidth: 10
  }, O9.default.createElement(C, {
    dimColor: !0
  }, "Message ")), O9.default.createElement(C, null, A.message)), O9.default.createElement(T, {
    flexDirection: "row"
  }, O9.default.createElement(T, {
    justifyContent: "flex-end",
    minWidth: 10
  }, O9.default.createElement(C, {
    dimColor: !0
  }, "Reason ")), G === void 0 ? O9.default.createElement(C, null, "undefined") : O9.default.createElement(yq7, {
    decisionReason: G
  })), O9.default.createElement(bq7, {
    suggestions: Z,
    width: 10
  }), Y.length > 0 && O9.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, O9.default.createElement(C, {
    color: "warning"
  }, tA.warning, " Unreachable Rules (", Y.length, ")"), Y.map((X, I) => O9.default.createElement(T, {
    key: I,
    flexDirection: "column",
    marginLeft: 2
  }, O9.default.createElement(C, {
    color: "warning"
  }, S5(X.rule.ruleValue)), O9.default.createElement(C, {
    dimColor: !0
  }, "  ", X.reason), O9.default.createElement(C, {
    dimColor: !0
  }, "  ", "Fix: ", X.fix)))))
}
// @from(Ln 447052, Col 4)
O9
// @from(Ln 447052, Col 8)
ID9
// @from(Ln 447053, Col 4)
WD9 = w(() => {
  fA();
  YZ();
  Z3();
  B2();
  mL();
  dW();
  YI();
  hB();
  dZ1();
  NJ();
  O9 = c(QA(), 1), ID9 = c(QA(), 1)
})
// @from(Ln 447067, Col 0)
function fq7(A, Q) {
  if (!A) return null;
  switch (A.type) {
    case "rule":
      return {
        reasonString: `Permission rule ${I1.bold(S5(A.rule.ruleValue))} requires confirmation for this ${Q}.`, configString: A.rule.source === "policySettings" ? void 0 : "/permissions to update rules"
      };
    case "hook": {
      let B = A.reason ? `:
${A.reason}` : ".";
      return {
        reasonString: `Hook ${I1.bold(A.hookName)} requires confirmation for this ${Q}${B}`,
        configString: "/hooks to update"
      }
    }
    case "classifier":
      return {
        reasonString: `Classifier ${I1.bold(A.classifier)} requires confirmation for this ${Q}.
${A.reason}`, configString: void 0
      };
    default:
      return null
  }
}
// @from(Ln 447092, Col 0)
function Cw({
  permissionResult: A,
  toolType: Q
}) {
  let B = fq7(A?.decisionReason, Q);
  if (!B) return null;
  return muA.default.createElement(T, {
    marginBottom: 1,
    flexDirection: "column"
  }, muA.default.createElement(C, null, muA.default.createElement(M8, null, B.reasonString)), B.configString && muA.default.createElement(C, {
    dimColor: !0
  }, B.configString))
}
// @from(Ln 447105, Col 4)
muA
// @from(Ln 447106, Col 4)
ae = w(() => {
  fA();
  YZ();
  Z3();
  muA = c(QA(), 1)
})
// @from(Ln 447113, Col 0)
function q$A({
  options: A,
  onSelect: Q,
  onCancel: B,
  question: G = "Do you want to proceed?",
  toolAnalyticsContext: Z
}) {
  let [, Y] = a0(), [J, X] = OK.useState(""), [I, D] = OK.useState(""), [W, K] = OK.useState(!1), [V, F] = OK.useState(!1), [H, E] = OK.useState(null), [z, $] = OK.useState(!1), [O, L] = OK.useState(!1), _ = A.find((f) => f.value === H)?.feedbackConfig?.type, j = _ === "accept" && !W || _ === "reject" && !V, x = OK.useMemo(() => {
    return A.map((f) => {
      let {
        value: AA,
        label: n,
        feedbackConfig: y
      } = f;
      if (!y) return {
        label: n,
        value: AA
      };
      let {
        type: p,
        placeholder: GA
      } = y, WA = p === "accept" ? W : V, MA = p === "accept" ? X : D, TA = hq7[p];
      if (WA) return {
        type: "input",
        label: typeof n === "string" ? `${n},` : n,
        value: AA,
        placeholder: GA ?? TA,
        onChange: MA,
        allowEmptySubmit: !0
      };
      return {
        label: n,
        value: AA
      }
    })
  }, [A, W, V]), b = OK.useCallback((f) => {
    let AA = A.find((p) => p.value === f);
    if (!AA?.feedbackConfig) return;
    let {
      type: n
    } = AA.feedbackConfig, y = {
      toolName: Z?.toolName,
      isMcp: Z?.isMcp ?? !1
    };
    if (n === "accept")
      if (W) K(!1), l("tengu_accept_feedback_mode_collapsed", y);
      else K(!0), $(!0), l("tengu_accept_feedback_mode_entered", y);
    else if (n === "reject")
      if (V) F(!1), l("tengu_reject_feedback_mode_collapsed", y);
      else F(!0), L(!0), l("tengu_reject_feedback_mode_entered", y)
  }, [A, W, V, Z]), S = OK.useCallback((f) => {
    let AA = A.find((y) => y.value === f);
    if (!AA) return;
    let n;
    if (AA.feedbackConfig) {
      let p = (AA.feedbackConfig.type === "accept" ? J : I).trim();
      if (p) n = p;
      let GA = {
        toolName: Z?.toolName,
        isMcp: Z?.isMcp ?? !1,
        has_instructions: !!p,
        instructions_length: p?.length ?? 0,
        entered_feedback_mode: AA.feedbackConfig.type === "accept" ? z : O
      };
      if (AA.feedbackConfig.type === "accept") l("tengu_accept_submitted", GA);
      else if (AA.feedbackConfig.type === "reject") l("tengu_reject_submitted", GA)
    }
    Q(f, n)
  }, [A, J, I, Q, Z, z, O]), u = OK.useCallback(() => {
    l("tengu_permission_request_escape", {}), Y((f) => ({
      ...f,
      attribution: {
        ...f.attribution,
        escapeCount: f.attribution.escapeCount + 1
      }
    })), B?.()
  }, [B, Y]);
  return OK.default.createElement(T, {
    flexDirection: "column"
  }, typeof G === "string" ? OK.default.createElement(C, null, G) : G, OK.default.createElement(k0, {
    options: x,
    inlineDescriptions: !0,
    onChange: S,
    onCancel: u,
    onFocus: (f) => {
      let AA = A.find((n) => n.value === f);
      if (AA?.feedbackConfig?.type !== "accept" && W && !J.trim()) K(!1);
      if (AA?.feedbackConfig?.type !== "reject" && V && !I.trim()) F(!1);
      E(f)
    },
    onInputModeToggle: b
  }), OK.default.createElement(T, {
    marginTop: 1
  }, OK.default.createElement(C, {
    dimColor: !0
  }, "Esc to cancel", j && " · Tab to add additional instructions")))
}
// @from(Ln 447210, Col 4)
OK
// @from(Ln 447210, Col 8)
hq7
// @from(Ln 447211, Col 4)
m$1 = w(() => {
  fA();
  W8();
  Z0();
  hB();
  OK = c(QA(), 1), hq7 = {
    accept: "tell Claude what to do next",
    reject: "tell Claude what to do differently"
  }
})
// @from(Ln 447222, Col 0)
function KD9({
  toolUseConfirm: A,
  onDone: Q,
  onReject: B,
  serverName: G,
  toolName: Z,
  args: Y
}) {
  let J = `${G} - ${Z}`,
    X = `mcp__${G}__${Z}`,
    I = oe.useMemo(() => ({
      ...A,
      tool: {
        ...A.tool,
        name: X,
        isMcp: !0
      }
    }), [A, X]),
    D = oe.useMemo(() => ({
      completion_type: "tool_use_single",
      language_name: "none"
    }), []);
  yj(I, D);
  let W = oe.useCallback((E, z) => {
      switch (E) {
        case "yes":
          iJ({
            completion_type: "tool_use_single",
            event: "accept",
            metadata: {
              language_name: "none",
              message_id: I.assistantMessage.message.id,
              platform: l0.platform
            }
          }), I.onAllow(I.input, [], z), Q();
          break;
        case "yes-dont-ask-again": {
          iJ({
            completion_type: "tool_use_single",
            event: "accept",
            metadata: {
              language_name: "none",
              message_id: I.assistantMessage.message.id,
              platform: l0.platform
            }
          });
          let $ = I.permissionResult.behavior === "ask" ? I.permissionResult.suggestions || [] : [];
          if ($.length === 0) e(Error(`MCPCliPermissionRequest: No MCP suggestions found for ${G}/${Z}`)), I.onAllow(I.input, []);
          else I.onAllow(I.input, $);
          Q();
          break
        }
        case "no":
          iJ({
            completion_type: "tool_use_single",
            event: "reject",
            metadata: {
              language_name: "none",
              message_id: I.assistantMessage.message.id,
              platform: l0.platform
            }
          }), I.onReject(z), B(), Q();
          break
      }
    }, [I, Q, B, G, Z]),
    K = oe.useCallback(() => {
      iJ({
        completion_type: "tool_use_single",
        event: "reject",
        metadata: {
          language_name: "none",
          message_id: I.assistantMessage.message.id,
          platform: l0.platform
        }
      }), I.onReject(), B(), Q()
    }, [I, Q, B]),
    V = EQ(),
    F = oe.useMemo(() => {
      return [{
        label: "Yes",
        value: "yes",
        feedbackConfig: {
          type: "accept"
        }
      }, {
        label: kj.default.createElement(C, null, "Yes, and don't ask again for ", kj.default.createElement(C, {
          bold: !0
        }, J), " ", "commands in ", kj.default.createElement(C, {
          bold: !0
        }, V)),
        value: "yes-dont-ask-again"
      }, {
        label: "No",
        value: "no",
        feedbackConfig: {
          type: "reject"
        }
      }]
    }, [J, V]),
    H = oe.useMemo(() => ({
      toolName: k9(I.tool.name),
      isMcp: !0
    }), [I.tool.name]);
  return kj.default.createElement(VY, {
    title: "Tool use"
  }, kj.default.createElement(T, {
    flexDirection: "column",
    paddingX: 2,
    paddingY: 1
  }, kj.default.createElement(C, null, J, "(", Y || "{}", ")", kj.default.createElement(C, {
    dimColor: !0
  }, " (MCP)")), kj.default.createElement(C, {
    dimColor: !0
  }, I.description)), kj.default.createElement(T, {
    flexDirection: "column"
  }, kj.default.createElement(Cw, {
    permissionResult: I.permissionResult,
    toolType: "tool"
  }), kj.default.createElement(q$A, {
    options: F,
    onSelect: W,
    onCancel: K,
    toolAnalyticsContext: H
  })))
}
// @from(Ln 447347, Col 4)
kj
// @from(Ln 447347, Col 8)
oe
// @from(Ln 447348, Col 4)
VD9 = w(() => {
  fA();
  dN();
  le();
  p3();
  C0();
  O8A();
  ae();
  v1();
  m$1();
  hW();
  kj = c(QA(), 1), oe = c(QA(), 1)
})
// @from(Ln 447366, Col 0)
function FD9({
  sedInfo: A,
  ...Q
}) {
  let {
    filePath: B
  } = A, {
    oldContent: G,
    fileExists: Z
  } = duA.useMemo(() => {
    try {
      if (vA().existsSync(B)) return {
        oldContent: nK(B),
        fileExists: !0
      };
      return {
        oldContent: "",
        fileExists: !1
      }
    } catch {
      return {
        oldContent: "",
        fileExists: !1
      }
    }
  }, [B]), Y = duA.useMemo(() => {
    return PP2(G, A)
  }, [G, A]), J = duA.useMemo(() => {
    if (G === Y) return [];
    return [{
      old_string: G,
      new_string: Y,
      replace_all: !1
    }]
  }, [G, Y]), X = duA.useMemo(() => {
    if (!Z) return "File does not exist";
    return "Pattern did not match any content"
  }, [Z]), I = (D) => {
    return {
      ...o2.inputSchema.parse(D),
      _simulatedSedEdit: {
        filePath: B,
        newContent: Y
      }
    }
  };
  return N$A.default.createElement(Ih, {
    toolUseConfirm: Q.toolUseConfirm,
    toolUseContext: Q.toolUseContext,
    onDone: Q.onDone,
    onReject: Q.onReject,
    title: "Edit file",
    subtitle: uq7(o1(), B),
    question: N$A.default.createElement(C, null, "Do you want to make this edit to", " ", N$A.default.createElement(C, {
      bold: !0
    }, gq7(B)), "?"),
    content: J.length > 0 ? N$A.default.createElement(g$1, {
      file_path: B,
      edits: J
    }) : N$A.default.createElement(C, {
      dimColor: !0
    }, X),
    path: B,
    completionType: "str_replace_single",
    languageName: ge(B),
    parseInput: I
  })
}
// @from(Ln 447434, Col 4)
N$A
// @from(Ln 447434, Col 9)
duA
// @from(Ln 447435, Col 4)
HD9 = w(() => {
  fA();
  WS0();
  y9();
  U$A();
  V2();
  y9();
  DQ();
  ikA();
  YK();
  N$A = c(QA(), 1), duA = c(QA(), 1)
})
// @from(Ln 447448, Col 0)
function aq7(A) {
  if (typeof A === "string") return A;
  try {
    return eA(A, null, 2)
  } catch {
    return String(A)
  }
}
// @from(Ln 447457, Col 0)
function oq7(A, Q = 1000) {
  let B = A.filter((Y) => Y.type === "assistant").slice(-3),
    G = [],
    Z = 0;
  for (let Y of B.reverse()) {
    let J = Y.message.content.filter((X) => X.type === "text").map((X) => ("text" in X) ? X.text : "").join(" ");
    if (J && Z < Q) {
      let X = Q - Z,
        I = J.length > X ? J.slice(0, X) + "..." : J;
      G.unshift(I), Z += I.length
    }
  }
  return G.join(`

`)
}
// @from(Ln 447474, Col 0)
function ES0() {
  if (process.env.PERMISSION_EXPLAINER_ENABLED === "true") return L1().permissionExplainerEnabled !== !1;
  if (!ZZ("tengu_permission_explainer", !1)) return !1;
  return L1().permissionExplainerEnabled !== !1
}
// @from(Ln 447479, Col 0)
async function ED9({
  toolName: A,
  toolInput: Q,
  toolDescription: B,
  messages: G,
  signal: Z
}) {
  if (!ES0()) return null;
  let Y = Date.now();
  try {
    let J = aq7(Q),
      X = G?.length ? oq7(G) : "",
      I = `Tool: ${A}
${B?`Description: ${B}
`:""}
Input:
${J}
${X?`
Recent conversation context:
${X}`:""}

Explain this command in context.`,
      D = B5(),
      W = await sHA({
        model: D,
        system: lq7,
        messages: [{
          role: "user",
          content: I
        }],
        tools: [iq7],
        tool_choice: {
          type: "tool",
          name: "explain_command"
        },
        signal: Z
      }),
      K = Date.now() - Y;
    k(`Permission explainer: API returned in ${K}ms, stop_reason=${W.stop_reason}`);
    let V = W.content.find((F) => F.type === "tool_use");
    if (V && V.type === "tool_use") {
      k(`Permission explainer: tool input: ${eA(V.input).slice(0,500)}`);
      let F = nq7.safeParse(V.input);
      if (F.success) {
        let H = {
          riskLevel: F.data.riskLevel,
          explanation: F.data.explanation,
          reasoning: F.data.reasoning,
          risk: F.data.risk
        };
        return l("tengu_permission_explainer_generated", {
          tool_name: k9(A),
          risk_level: mq7[H.riskLevel],
          latency_ms: K
        }), k(`Permission explainer: ${H.riskLevel} risk for ${A} (${K}ms)`), H
      }
    }
    return l("tengu_permission_explainer_error", {
      tool_name: k9(A),
      error_type: dq7,
      latency_ms: K
    }), k("Permission explainer: no parsed output in response"), null
  } catch (J) {
    let X = Date.now() - Y;
    if (Z.aborted) return k(`Permission explainer: request aborted for ${A}`), null;
    return k(`Permission explainer error: ${J instanceof Error?J.message:String(J)}`), e(J instanceof Error ? J : Error(String(J))), l("tengu_permission_explainer_error", {
      tool_name: k9(A),
      error_type: J instanceof Error && J.name === "AbortError" ? cq7 : pq7,
      latency_ms: X
    }), null
  }
}
// @from(Ln 447551, Col 4)
mq7
// @from(Ln 447551, Col 9)
dq7 = 1
// @from(Ln 447552, Col 2)
cq7 = 2
// @from(Ln 447553, Col 2)
pq7 = 3
// @from(Ln 447554, Col 2)
lq7 = "Analyze shell commands and explain what they do, why you're running them, and potential risks."
// @from(Ln 447555, Col 2)
iq7
// @from(Ln 447555, Col 7)
nq7
// @from(Ln 447556, Col 4)
zD9 = w(() => {
  Z0();
  hW();
  v1();
  T1();
  w6();
  GQ();
  A0();
  l2();
  FK1();
  j9();
  mq7 = {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3
  }, iq7 = {
    name: "explain_command",
    description: "Provide an explanation of a shell command",
    input_schema: {
      type: "object",
      properties: {
        explanation: {
          type: "string",
          description: "What this command does (1-2 sentences)"
        },
        reasoning: {
          type: "string",
          description: 'Why YOU are running this command. Start with "I" - e.g. "I need to check the file contents"'
        },
        risk: {
          type: "string",
          description: "What could go wrong, under 15 words"
        },
        riskLevel: {
          type: "string",
          enum: ["LOW", "MEDIUM", "HIGH"],
          description: "LOW (safe dev workflows), MEDIUM (recoverable changes), HIGH (dangerous/irreversible)"
        }
      },
      required: ["explanation", "reasoning", "risk", "riskLevel"]
    }
  }, nq7 = m.object({
    riskLevel: m.enum(["LOW", "MEDIUM", "HIGH"]),
    explanation: m.string(),
    reasoning: m.string(),
    risk: m.string()
  })
})
// @from(Ln 447605, Col 0)
function rq7() {
  let A = $6A("responding", zS0, !0, !1, zS0.length + 10);
  return eF.default.createElement(C, null, zS0.split("").map((Q, B) => eF.default.createElement(ws, {
    key: B,
    char: Q,
    index: B,
    glimmerIndex: A,
    messageColor: "inactive",
    shimmerColor: "text"
  })))
}
// @from(Ln 447617, Col 0)
function sq7(A) {
  switch (A) {
    case "LOW":
      return "success";
    case "MEDIUM":
      return "warning";
    case "HIGH":
      return "error"
  }
}
// @from(Ln 447628, Col 0)
function tq7(A) {
  switch (A) {
    case "LOW":
      return "Low risk";
    case "MEDIUM":
      return "Med risk";
    case "HIGH":
      return "High risk"
  }
}
// @from(Ln 447639, Col 0)
function eq7(A) {
  return ED9({
    toolName: A.toolName,
    toolInput: A.toolInput,
    toolDescription: A.toolDescription,
    messages: A.messages,
    signal: new AbortController().signal
  }).catch(() => null)
}
// @from(Ln 447649, Col 0)
function $D9(A) {
  let Q = ES0(),
    [B, G] = M8A.useState(!1),
    [Z, Y] = M8A.useState(null);
  return J0((J, X) => {
    if (Q && X.ctrl && J === "e") {
      if (!B) {
        if (l("tengu_permission_explainer_shortcut_used", {}), !Z) Y(eq7(A))
      }
      G((I) => !I)
    }
  }), {
    visible: B,
    enabled: Q,
    promise: Z
  }
}
// @from(Ln 447667, Col 0)
function CD9({
  visible: A,
  enabled: Q
}) {
  if (!Q) return null;
  return eF.default.createElement(C, {
    dimColor: !0
  }, "ctrl+e to ", A ? "hide" : "explain")
}
// @from(Ln 447677, Col 0)
function AN7({
  promise: A
}) {
  let Q = M8A.use(A);
  if (!Q) return eF.default.createElement(T, {
    marginTop: 1
  }, eF.default.createElement(C, {
    dimColor: !0
  }, "Explanation unavailable"));
  return eF.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, eF.default.createElement(C, null, Q.explanation), eF.default.createElement(T, {
    marginTop: 1
  }, eF.default.createElement(C, null, Q.reasoning)), eF.default.createElement(T, {
    marginTop: 1
  }, eF.default.createElement(C, null, eF.default.createElement(C, {
    color: sq7(Q.riskLevel)
  }, tq7(Q.riskLevel), ":"), eF.default.createElement(C, null, " ", Q.risk))))
}
// @from(Ln 447698, Col 0)
function UD9({
  visible: A,
  promise: Q
}) {
  if (!A || !Q) return null;
  return eF.default.createElement(M8A.Suspense, {
    fallback: eF.default.createElement(T, {
      marginTop: 1
    }, eF.default.createElement(rq7, null))
  }, eF.default.createElement(AN7, {
    promise: Q
  }))
}
// @from(Ln 447711, Col 4)
eF
// @from(Ln 447711, Col 8)
M8A
// @from(Ln 447711, Col 13)
zS0 = "Loading explanation…"
// @from(Ln 447712, Col 4)
qD9 = w(() => {
  fA();
  zD9();
  Z0();
  WkA();
  xI1();
  eF = c(QA(), 1), M8A = c(QA(), 1)
})
// @from(Ln 447721, Col 0)
function ND9(A) {
  let {
    toolUseConfirm: Q,
    toolUseContext: B,
    onDone: G,
    onReject: Z,
    verbose: Y
  } = A, {
    command: J,
    description: X
  } = o2.inputSchema.parse(Q.input), I = e6A(J);
  if (I) {
    let {
      server: W,
      toolName: K,
      args: V
    } = I;
    return fX.default.createElement(KD9, {
      toolUseConfirm: Q,
      toolUseContext: B,
      onDone: G,
      verbose: Y,
      onReject: Z,
      serverName: W,
      toolName: K,
      args: V
    })
  }
  let D = HHA(J);
  if (D) return fX.default.createElement(FD9, {
    toolUseConfirm: Q,
    toolUseContext: B,
    onDone: G,
    onReject: Z,
    verbose: Y,
    sedInfo: D
  });
  return fX.default.createElement(QN7, {
    toolUseConfirm: Q,
    toolUseContext: B,
    onDone: G,
    onReject: Z,
    verbose: Y,
    command: J,
    description: X
  })
}
// @from(Ln 447769, Col 0)
function QN7({
  toolUseConfirm: A,
  toolUseContext: Q,
  onDone: B,
  onReject: G,
  verbose: Z,
  command: Y,
  description: J
}) {
  let [X] = oB(), [I, D] = a0(), W = $D9({
    toolName: A.tool.name,
    toolInput: A.input,
    toolDescription: A.description,
    messages: Q.messages
  }), [K, V] = S$.useState(!1), [F, H] = S$.useState(""), [E, z] = S$.useState(""), [$, O] = S$.useState(J || ""), {
    signal: L
  } = Q.abortController;
  S$.useEffect(() => {
    if (!$t()) return;
    Xd2(Y, J, L).then((OA) => {
      if (OA && !L.aborted) O(OA)
    }).catch(() => {})
  }, [Y, J, L]);
  let [M, _] = S$.useState(!1), [j, x] = S$.useState(!1), [b, S] = S$.useState("yes"), [u, f] = S$.useState(!1), [AA, n] = S$.useState(!1), y = XB.isSandboxingEnabled(), p = y && KEA(A.input), GA = S$.useMemo(() => ({
    completion_type: "tool_use_single",
    language_name: "none"
  }), []);
  yj(A, GA);
  let WA = S$.useMemo(() => oK1(I.toolPermissionContext), [I.toolPermissionContext]),
    MA = S$.useMemo(() => YD9({
      suggestions: A.permissionResult.behavior === "ask" ? A.permissionResult.suggestions : void 0,
      onRejectFeedbackChange: H,
      onAcceptFeedbackChange: z,
      onClassifierDescriptionChange: O,
      classifierDescription: $,
      existingAllowDescriptions: WA,
      yesInputMode: M,
      noInputMode: j
    }), [A, $, WA, M, j]);
  J0((OA, IA) => {
    if (IA.ctrl && OA === "d") V((HA) => !HA)
  });

  function TA(OA) {
    let IA = {
      toolName: k9(A.tool.name),
      isMcp: A.tool.isMcp ?? !1
    };
    if (OA === "yes")
      if (M) _(!1), l("tengu_accept_feedback_mode_collapsed", IA);
      else _(!0), f(!0), l("tengu_accept_feedback_mode_entered", IA);
    else if (OA === "no")
      if (j) x(!1), l("tengu_reject_feedback_mode_collapsed", IA);
      else x(!0), n(!0), l("tengu_reject_feedback_mode_entered", IA)
  }

  function bA(OA) {
    let IA = OA?.trim(),
      HA = !!IA;
    if (!HA) l("tengu_permission_request_escape", {}), D((ZA) => ({
      ...ZA,
      attribution: {
        ...ZA.attribution,
        escapeCount: ZA.attribution.escapeCount + 1
      }
    }));
    if (Sp("tool_use_single", A, "reject", HA), IA) A.onReject(IA);
    else A.onReject();
    G(), B()
  }

  function jA(OA) {
    l("tengu_permission_request_option_selected", {
      option_index: {
        yes: 1,
        "yes-apply-suggestions": 2,
        "yes-classifier-reviewed": 3,
        no: 4
      } [OA]
    });
    let HA = k9(A.tool.name);
    switch (OA) {
      case "yes": {
        let ZA = E.trim();
        Sp("tool_use_single", A, "accept"), l("tengu_accept_submitted", {
          toolName: HA,
          isMcp: A.tool.isMcp ?? !1,
          has_instructions: !!ZA,
          instructions_length: ZA.length,
          entered_feedback_mode: u
        }), A.onAllow(A.input, [], ZA || void 0), B();
        break
      }
      case "yes-apply-suggestions": {
        Sp("tool_use_single", A, "accept");
        let ZA = "suggestions" in A.permissionResult ? A.permissionResult.suggestions || [] : [];
        A.onAllow(A.input, ZA), B();
        break
      }
      case "yes-classifier-reviewed": {
        let ZA = $.trim();
        if (!ZA) return;
        Sp("tool_use_single", A, "accept");
        let zA = [{
          type: "addRules",
          rules: [{
            toolName: o2.name,
            ruleContent: aK1(ZA)
          }],
          behavior: "allow",
          destination: "session"
        }];
        A.onAllow(A.input, zA), B();
        break
      }
      case "no": {
        let ZA = F.trim();
        l("tengu_reject_submitted", {
          toolName: HA,
          isMcp: A.tool.isMcp ?? !1,
          has_instructions: !!ZA,
          instructions_length: ZA.length,
          entered_feedback_mode: AA
        }), bA(ZA || void 0);
        break
      }
    }
  }
  return fX.default.createElement(VY, {
    title: y && !p ? "Bash command (unsandboxed)" : "Bash command",
    titleRight: fX.default.createElement(CD9, {
      visible: W.visible,
      enabled: W.enabled
    })
  }, fX.default.createElement(T, {
    flexDirection: "column",
    paddingX: 2,
    paddingY: 1
  }, fX.default.createElement(C, {
    dimColor: W.visible
  }, o2.renderToolUseMessage({
    command: Y,
    description: J
  }, {
    theme: X,
    verbose: !0
  })), !W.visible && fX.default.createElement(C, {
    dimColor: !0
  }, A.description), fX.default.createElement(UD9, {
    visible: W.visible,
    promise: W.promise
  })), K ? fX.default.createElement(fX.default.Fragment, null, fX.default.createElement(DD9, {
    permissionResult: A.permissionResult,
    toolName: "Bash"
  }), A.toolUseContext.options.debug && fX.default.createElement(T, {
    justifyContent: "flex-end",
    marginTop: 1
  }, fX.default.createElement(C, {
    dimColor: !0
  }, "Ctrl-D to hide debug info"))) : fX.default.createElement(fX.default.Fragment, null, fX.default.createElement(T, {
    flexDirection: "column"
  }, fX.default.createElement(Cw, {
    permissionResult: A.permissionResult,
    toolType: "command"
  }), fX.default.createElement(C, null, "Do you want to proceed?"), fX.default.createElement(k0, {
    options: MA,
    inlineDescriptions: !0,
    onChange: jA,
    onCancel: () => bA(),
    onFocus: (OA) => {
      if (OA !== "yes" && M && !E.trim()) _(!1);
      if (OA !== "no" && j && !F.trim()) x(!1);
      S(OA)
    },
    onInputModeToggle: TA
  })), fX.default.createElement(T, {
    justifyContent: "space-between",
    marginTop: 1
  }, fX.default.createElement(C, {
    dimColor: !0
  }, "Esc to cancel", (b === "yes" && !M || b === "no" && !j) && " · Tab to add additional instructions"), A.toolUseContext.options.debug && fX.default.createElement(C, {
    dimColor: !0
  }, "Ctrl+d to show debug info"))))
}
// @from(Ln 447953, Col 4)
fX
// @from(Ln 447953, Col 8)
S$
// @from(Ln 447954, Col 4)
wD9 = w(() => {
  fA();
  YK();
  O8A();
  dN();
  FS0();
  W8();
  JD9();
  WD9();
  ae();
  NJ();
  VD9();
  $F();
  Z0();
  hW();
  ikA();
  HD9();
  hB();
  qD9();
  fX = c(QA(), 1), S$ = c(QA(), 1)
})
// @from(Ln 447976, Col 0)
function d$1({
  toolUseConfirm: A,
  onDone: Q,
  onReject: B,
  verbose: G
}) {
  let [Z] = oB(), Y = A.tool.userFacingName(A.input), J = Y.endsWith(" (MCP)") ? Y.slice(0, -6) : Y, X = R8A.useMemo(() => ({
    completion_type: "tool_use_single",
    language_name: "none"
  }), []);
  yj(A, X);
  let I = R8A.useCallback((F, H) => {
      switch (F) {
        case "yes":
          iJ({
            completion_type: "tool_use_single",
            event: "accept",
            metadata: {
              language_name: "none",
              message_id: A.assistantMessage.message.id,
              platform: l0.platform
            }
          }), A.onAllow(A.input, [], H), Q();
          break;
        case "yes-dont-ask-again": {
          iJ({
            completion_type: "tool_use_single",
            event: "accept",
            metadata: {
              language_name: "none",
              message_id: A.assistantMessage.message.id,
              platform: l0.platform
            }
          }), A.onAllow(A.input, [{
            type: "addRules",
            rules: [{
              toolName: A.tool.name
            }],
            behavior: "allow",
            destination: "localSettings"
          }]), Q();
          break
        }
        case "no":
          iJ({
            completion_type: "tool_use_single",
            event: "reject",
            metadata: {
              language_name: "none",
              message_id: A.assistantMessage.message.id,
              platform: l0.platform
            }
          }), A.onReject(H), B(), Q();
          break
      }
    }, [A, Q, B]),
    D = R8A.useCallback(() => {
      iJ({
        completion_type: "tool_use_single",
        event: "reject",
        metadata: {
          language_name: "none",
          message_id: A.assistantMessage.message.id,
          platform: l0.platform
        }
      }), A.onReject(), B(), Q()
    }, [A, Q, B]),
    W = EQ(),
    K = R8A.useMemo(() => {
      return [{
        label: "Yes",
        value: "yes",
        feedbackConfig: {
          type: "accept"
        }
      }, {
        label: bj.default.createElement(C, null, "Yes, and don't ask again for ", bj.default.createElement(C, {
          bold: !0
        }, J), " ", "commands in ", bj.default.createElement(C, {
          bold: !0
        }, W)),
        value: "yes-dont-ask-again"
      }, {
        label: "No",
        value: "no",
        feedbackConfig: {
          type: "reject"
        }
      }]
    }, [J, W]),
    V = R8A.useMemo(() => ({
      toolName: k9(A.tool.name),
      isMcp: A.tool.isMcp ?? !1
    }), [A.tool.name, A.tool.isMcp]);
  return bj.default.createElement(VY, {
    title: "Tool use"
  }, bj.default.createElement(T, {
    flexDirection: "column",
    paddingX: 2,
    paddingY: 1
  }, bj.default.createElement(C, null, J, "(", A.tool.renderToolUseMessage(A.input, {
    theme: Z,
    verbose: G
  }), ")", Y.endsWith(" (MCP)") ? bj.default.createElement(C, {
    dimColor: !0
  }, " (MCP)") : ""), bj.default.createElement(C, {
    dimColor: !0
  }, A.description)), bj.default.createElement(T, {
    flexDirection: "column"
  }, bj.default.createElement(Cw, {
    permissionResult: A.permissionResult,
    toolType: "tool"
  }), bj.default.createElement(q$A, {
    options: K,
    onSelect: I,
    onCancel: D,
    toolAnalyticsContext: V
  })))
}
// @from(Ln 448095, Col 4)
bj
// @from(Ln 448095, Col 8)
R8A
// @from(Ln 448096, Col 4)
$S0 = w(() => {
  fA();
  dN();
  le();
  p3();
  C0();
  O8A();
  ae();
  m$1();
  hW();
  bj = c(QA(), 1), R8A = c(QA(), 1)
})
// @from(Ln 448109, Col 0)
function BN7() {
  return Date.now() - wdA()
}
// @from(Ln 448113, Col 0)
function GN7(A) {
  return BN7() < A
}
// @from(Ln 448117, Col 0)
function ZN7(A) {
  return !GN7(A)
}
// @from(Ln 448121, Col 0)
function c$1(A, Q) {
  let B = Tk();
  CS0.useEffect(() => {
    YN7(), SCA()
  }, []), CS0.useEffect(() => {
    let G = !1,
      Z = setInterval(() => {
        if (ZN7(LD9) && !G) G = !0, Dc({
          message: A,
          notificationType: Q
        }, B)
      }, LD9);
    return () => clearInterval(Z)
  }, [A, Q, B])
}
// @from(Ln 448136, Col 4)
CS0
// @from(Ln 448136, Col 9)
LD9 = 6000
// @from(Ln 448137, Col 2)
YN7
// @from(Ln 448138, Col 4)
US0 = w(() => {
  nBA();
  MkA();
  Y9();
  C0();
  GQ();
  CS0 = c(QA(), 1);
  YN7 = W0(() => process.stdin.on("data", SCA))
})
// @from(Ln 448148, Col 0)
function OD9({
  file_path: A,
  content: Q
}) {
  let {
    columns: B
  } = ZB(), G = p$1.useMemo(() => vA().existsSync(A), [A]), Z = p$1.useMemo(() => {
    if (!G) return "";
    let I = RW(A);
    return vA().readFileSync(A, {
      encoding: I
    })
  }, [A, G]), Y = p$1.useMemo(() => {
    if (!G) return null;
    return xO({
      filePath: A,
      fileContents: Z,
      edits: [{
        old_string: Z,
        new_string: Q,
        replace_all: !1
      }]
    })
  }, [G, A, Z, Q]), J = Q.split(`
`)[0] ?? null, X = 1;
  return mx.createElement(T, {
    flexDirection: "column"
  }, mx.createElement(T, {
    borderDimColor: !0,
    borderColor: "subtle",
    borderStyle: "dashed",
    flexDirection: "column",
    borderLeft: !1,
    borderRight: !1,
    paddingX: 1
  }, Y ? rN(Y.map((I) => mx.createElement(sN, {
    key: I.newStart,
    patch: I,
    dim: !1,
    filePath: A,
    firstLine: J,
    width: B - 2
  })), (I) => mx.createElement(C, {
    dimColor: !0,
    key: `ellipsis-${I}`
  }, "...")) : mx.createElement(tN, {
    code: Q || "(No content)",
    filePath: A
  })))
}
// @from(Ln 448198, Col 4)
mx
// @from(Ln 448198, Col 8)
p$1
// @from(Ln 448199, Col 4)
MD9 = w(() => {
  ls();
  fA();
  y9();
  h6A();
  Lc();
  DQ();
  P4();
  mx = c(QA(), 1), p$1 = c(QA(), 1)
})
// @from(Ln 448214, Col 0)
function _D9(A) {
  let Q = (X) => {
      return X$.inputSchema.parse(X)
    },
    B = Q(A.toolUseConfirm.input),
    {
      file_path: G,
      content: Z
    } = B,
    Y = RD9.useMemo(() => vA().existsSync(G), [G]),
    J = Y ? "overwrite" : "create";
  return cuA.default.createElement(Ih, {
    toolUseConfirm: A.toolUseConfirm,
    toolUseContext: A.toolUseContext,
    onDone: A.onDone,
    onReject: A.onReject,
    title: Y ? "Overwrite file" : "Create file",
    subtitle: XN7(o1(), G),
    question: cuA.default.createElement(C, null, "Do you want to ", J, " ", cuA.default.createElement(C, {
      bold: !0
    }, JN7(G)), "?"),
    content: cuA.default.createElement(OD9, {
      file_path: G,
      content: Z
    }),
    path: G,
    completionType: "write_file_single",
    languageName: ge(G),
    parseInput: Q,
    ideDiffSupport: IN7
  })
}
// @from(Ln 448246, Col 4)
cuA
// @from(Ln 448246, Col 9)
RD9
// @from(Ln 448246, Col 14)
IN7
// @from(Ln 448247, Col 4)
jD9 = w(() => {
  fA();
  jc();
  MD9();
  y9();
  DQ();
  U$A();
  V2();
  cuA = c(QA(), 1), RD9 = c(QA(), 1), IN7 = {
    getConfig: (A) => {
      let B = vA().existsSync(A.file_path) ? nK(A.file_path) : "";
      return u$1(A.file_path, B, A.content, !1)
    },
    applyChanges: (A, Q) => {
      let B = Q[0];
      if (B) return {
        ...A,
        content: B.new_string
      };
      return A
    }
  }
})
// @from(Ln 448271, Col 0)
function DN7(A) {
  let Q = A.tool;
  if ("getPath" in Q && typeof Q.getPath === "function") try {
    return Q.getPath(A.input)
  } catch {
    return null
  }
  return null
}
// @from(Ln 448281, Col 0)
function TD9({
  toolUseConfirm: A,
  onDone: Q,
  onReject: B,
  verbose: G,
  toolUseContext: Z
}) {
  let [Y] = oB(), J = DN7(A), X = A.tool.userFacingName(A.input), I = A.tool.isReadOnly(A.input), W = `${I?"Read":"Edit"} file`, K = (F) => F;
  if (!J) return puA.default.createElement(d$1, {
    toolUseConfirm: A,
    toolUseContext: Z,
    onDone: Q,
    onReject: B,
    verbose: G
  });
  let V = puA.default.createElement(T, {
    flexDirection: "column",
    paddingX: 2,
    paddingY: 1
  }, puA.default.createElement(C, null, X, "(", A.tool.renderToolUseMessage(A.input, {
    theme: Y,
    verbose: G
  }), ")"));
  return puA.default.createElement(Ih, {
    toolUseConfirm: A,
    toolUseContext: Z,
    onDone: Q,
    onReject: B,
    title: W,
    content: V,
    path: J,
    parseInput: K,
    operationType: I ? "read" : "write",
    completionType: "tool_use_single",
    languageName: "none"
  })
}
// @from(Ln 448318, Col 4)
puA
// @from(Ln 448319, Col 4)
PD9 = w(() => {
  fA();
  $S0();
  U$A();
  puA = c(QA(), 1)
})
// @from(Ln 448326, Col 0)
function WN7(A) {
  try {
    let Q = hF.inputSchema.safeParse(A);
    if (!Q.success) return `input:${A.toString()}`;
    let {
      url: B
    } = Q.data;
    return `domain:${new URL(B).hostname}`
  } catch {
    return `input:${A.toString()}`
  }
}
// @from(Ln 448339, Col 0)
function xD9({
  toolUseConfirm: A,
  onDone: Q,
  onReject: B,
  verbose: G
}) {
  let [Z] = oB(), {
    url: Y
  } = A.input, J = new URL(Y).hostname, X = SD9.useMemo(() => ({
    completion_type: "tool_use_single",
    language_name: "none"
  }), []);
  yj(A, X);
  let I = [{
    label: "Yes",
    value: "yes"
  }, {
    label: YM.default.createElement(C, null, "Yes, and don't ask again for ", YM.default.createElement(C, {
      bold: !0
    }, J)),
    value: "yes-dont-ask-again-domain"
  }, {
    label: YM.default.createElement(C, null, "No, and tell Claude what to do differently ", YM.default.createElement(C, {
      bold: !0
    }, "(esc)")),
    value: "no"
  }];

  function D(W) {
    switch (W) {
      case "yes":
        Sp("tool_use_single", A, "accept"), A.onAllow(A.input, []), Q();
        break;
      case "yes-dont-ask-again-domain": {
        Sp("tool_use_single", A, "accept");
        let K = WN7(A.input),
          V = {
            toolName: A.tool.name,
            ruleContent: K
          };
        A.onAllow(A.input, [{
          type: "addRules",
          rules: [V],
          behavior: "allow",
          destination: "localSettings"
        }]), Q();
        break
      }
      case "no":
        Sp("tool_use_single", A, "reject"), A.onReject(), B(), Q();
        break
    }
  }
  return YM.default.createElement(VY, {
    title: "Fetch"
  }, YM.default.createElement(T, {
    flexDirection: "column",
    paddingX: 2,
    paddingY: 1
  }, YM.default.createElement(C, null, hF.renderToolUseMessage(A.input, {
    theme: Z,
    verbose: G
  })), YM.default.createElement(C, {
    dimColor: !0
  }, A.description)), YM.default.createElement(T, {
    flexDirection: "column"
  }, YM.default.createElement(Cw, {
    permissionResult: A.permissionResult,
    toolType: "tool"
  }), YM.default.createElement(C, null, "Do you want to allow Claude to fetch this content?"), YM.default.createElement(k0, {
    options: I,
    onChange: D,
    onCancel: () => D("no")
  })))
}
// @from(Ln 448414, Col 4)
YM
// @from(Ln 448414, Col 8)
SD9
// @from(Ln 448415, Col 4)
yD9 = w(() => {
  fA();
  iHA();
  O8A();
  dN();
  FS0();
  W8();
  ae();
  YM = c(QA(), 1), SD9 = c(QA(), 1)
})
// @from(Ln 448429, Col 0)
function vD9({
  notebook_path: A,
  cell_id: Q,
  new_source: B,
  cell_type: G,
  edit_mode: Z = "replace",
  verbose: Y,
  width: J
}) {
  let X = luA.useMemo(() => vA().existsSync(A), [A]),
    I = luA.useMemo(() => {
      if (!X) return null;
      try {
        let V = nK(A);
        return c5(V)
      } catch (V) {
        return null
      }
    }, [A, X]),
    D = luA.useMemo(() => {
      if (!I || !Q) return "";
      let V = nSA(Q);
      if (V !== void 0) {
        if (I.cells[V]) {
          let H = I.cells[V].source;
          return Array.isArray(H) ? H.join("") : H
        }
        return ""
      }
      let F = I.cells.find((H) => H.id === Q);
      if (!F) return "";
      return Array.isArray(F.source) ? F.source.join("") : F.source
    }, [I, Q]),
    W = luA.useMemo(() => {
      if (!X || Z === "insert" || Z === "delete") return null;
      return xO({
        filePath: A,
        fileContents: D,
        edits: [{
          old_string: D,
          new_string: B,
          replace_all: !1
        }],
        ignoreWhitespace: !1
      })
    }, [X, A, D, B, Z]),
    K;
  switch (Z) {
    case "insert":
      K = "Insert new cell";
      break;
    case "delete":
      K = "Delete cell";
      break;
    default:
      K = "Replace cell contents"
  }
  return nJ.createElement(T, {
    flexDirection: "column"
  }, nJ.createElement(T, {
    borderDimColor: !0,
    borderStyle: "round",
    flexDirection: "column",
    paddingX: 1
  }, nJ.createElement(T, {
    paddingBottom: 1,
    flexDirection: "column"
  }, nJ.createElement(C, {
    bold: !0
  }, Y ? A : KN7(o1(), A)), nJ.createElement(C, {
    dimColor: !0
  }, K, " for cell ", Q, G ? ` (${G})` : "")), Z === "delete" ? nJ.createElement(T, {
    flexDirection: "column",
    paddingLeft: 2
  }, nJ.createElement(tN, {
    code: D,
    filePath: A
  })) : Z === "insert" ? nJ.createElement(T, {
    flexDirection: "column",
    paddingLeft: 2
  }, nJ.createElement(tN, {
    code: B,
    filePath: G === "markdown" ? "file.md" : A
  })) : W ? rN(W.map((V) => nJ.createElement(sN, {
    key: V.newStart,
    patch: V,
    dim: !1,
    width: J,
    filePath: A,
    firstLine: B.split(`
`)[0] ?? null
  })), (V) => nJ.createElement(C, {
    dimColor: !0,
    key: `ellipsis-${V}`
  }, "...")) : nJ.createElement(tN, {
    code: B,
    filePath: G === "markdown" ? "file.md" : A
  })))
}
// @from(Ln 448528, Col 4)
nJ
// @from(Ln 448528, Col 8)
luA
// @from(Ln 448529, Col 4)
kD9 = w(() => {
  ls();
  fA();
  V2();
  h6A();
  Lc();
  y9();
  vI();
  DQ();
  G71();
  nJ = c(QA(), 1), luA = c(QA(), 1)
})
// @from(Ln 448545, Col 0)
function bD9(A) {
  let Q = (I) => {
      let D = qf.inputSchema.safeParse(I);
      if (!D.success) return e(Error(`Failed to parse notebook edit input: ${D.error.message}`)), {
        notebook_path: "",
        new_source: "",
        cell_id: ""
      };
      return D.data
    },
    B = Q(A.toolUseConfirm.input),
    {
      notebook_path: G,
      edit_mode: Z,
      cell_type: Y
    } = B,
    J = Y === "markdown" ? "markdown" : "python",
    X = Z === "insert" ? "insert this cell into" : Z === "delete" ? "delete this cell from" : "make this edit to";
  return iuA.default.createElement(Ih, {
    toolUseConfirm: A.toolUseConfirm,
    toolUseContext: A.toolUseContext,
    onDone: A.onDone,
    onReject: A.onReject,
    title: "Edit notebook",
    question: iuA.default.createElement(C, null, "Do you want to ", X, " ", iuA.default.createElement(C, {
      bold: !0
    }, VN7(G)), "?"),
    content: iuA.default.createElement(vD9, {
      notebook_path: B.notebook_path,
      cell_id: B.cell_id,
      new_source: B.new_source,
      cell_type: B.cell_type,
      edit_mode: B.edit_mode,
      verbose: A.verbose,
      width: A.verbose ? 120 : 80
    }),
    path: G,
    completionType: "tool_use_single",
    languageName: J,
    parseInput: Q
  })
}
// @from(Ln 448587, Col 4)
iuA
// @from(Ln 448588, Col 4)
fD9 = w(() => {
  fA();
  u6A();
  kD9();
  U$A();
  v1();
  iuA = c(QA(), 1)
})
// @from(Ln 448606, Col 0)
function l$1(A = "claude-prompt", Q = ".md") {
  let B = EN7();
  return FN7(HN7(), `${A}-${B}${Q}`)
}
// @from(Ln 448610, Col 4)
qS0 = () => {}
// @from(Ln 448612, Col 0)
function CN7(A) {
  let Q = A.split(" ")[0] ?? "";
  return $N7.some((B) => Q.includes(B))
}
// @from(Ln 448617, Col 0)
function NS0(A) {
  let Q = vA(),
    B = _k.get(process.stdout);
  if (!B) throw Error("Ink instance not found - cannot pause rendering");
  let G = Wp();
  if (!G) return {
    content: null
  };
  if (!Q.existsSync(A)) return {
    content: null
  };
  let Z = !CN7(G);
  try {
    if (B.pause(), B.suspendStdin(), Z) process.stdout.write("\x1B[?1049h\x1B[?1004l\x1B[0m\x1B[?25h\x1B[2J\x1B[H");
    let Y = zN7[G] ?? G;
    return ly(`${Y} "${A}"`, {
      stdio: "inherit"
    }), {
      content: Q.readFileSync(A, {
        encoding: "utf-8"
      })
    }
  } catch (Y) {
    if (typeof Y === "object" && Y !== null && "status" in Y && typeof Y.status === "number") {
      let J = Y.status;
      if (J !== 0) return {
        content: null,
        error: `${EK(G)} exited with code ${J}`
      }
    }
    return {
      content: null
    }
  } finally {
    if (Z) process.stdout.write("\x1B[?1049l\x1B[?1004h\x1B[?25l");
    B.resumeStdin(), B.resume()
  }
}
// @from(Ln 448656, Col 0)
function i$1(A) {
  let Q = vA(),
    B = l$1();
  try {
    bB(B, A, {
      encoding: "utf-8",
      flush: !0
    });
    let G = NS0(B);
    if (G.content === null) return G;
    if (G.content.endsWith(`
`) && !G.content.endsWith(`

`)) return {
      content: G.content.slice(0, -1)
    };
    return G
  } finally {
    try {
      if (Q.existsSync(B)) Q.unlinkSync(B)
    } catch {}
  }
}
// @from(Ln 448679, Col 4)
zN7
// @from(Ln 448679, Col 9)
$N7
// @from(Ln 448680, Col 4)
wS0 = w(() => {
  _lA();
  Kp();
  A0();
  DQ();
  qS0();
  m_A();
  TX();
  zN7 = {
    code: "code -w",
    subl: "subl --wait"
  }, $N7 = ["code", "subl", "atom", "gedit", "notepad++", "notepad"]
})
// @from(Ln 448694, Col 0)
function re(A, Q) {
  let B = [{
    type: "setMode",
    mode: A,
    destination: "session"
  }];
  if (Q && Q.length > 0) B.push({
    type: "addRules",
    rules: Q.map((G) => ({
      toolName: G.tool,
      ruleContent: aK1(G.prompt)
    })),
    behavior: "allow",
    destination: "session"
  });
  return B
}
// @from(Ln 448712, Col 0)
function hD9({
  toolUseConfirm: A,
  onDone: Q,
  onReject: B
}) {
  let [G, Z] = a0(), {
    addNotification: Y
  } = S4(), [J, X] = se.useState(""), [I, D] = se.useState(null), [W, K] = se.useState(3), V = A.tool.name === vd, F = V ? void 0 : A.input.plan, H = V ? dC() : void 0, E = A.input.allowedPrompts, z = F ?? AK(), $ = !z || z.trim() === "", [O, L] = se.useState(() => {
    if (F) return F;
    return AK() ?? "No plan found. Please write your plan to the plan file first."
  }), [M, _] = se.useState(!1);
  se.useEffect(() => {
    if (M) {
      let S = setTimeout(() => {
        _(!1)
      }, 5000);
      return () => clearTimeout(S)
    }
  }, [M]), J0((S, u) => {
    if (u.ctrl && S.toLowerCase() === "g")
      if (l("tengu_plan_external_editor_used", {}), V && H) {
        let f = NS0(H);
        if (f.error) Y({
          key: "external-editor-error",
          text: f.error,
          color: "warning",
          priority: "high"
        });
        if (f.content !== null) L(f.content), _(!0)
      } else {
        let f = i$1(O);
        if (f.error) Y({
          key: "external-editor-error",
          text: f.error,
          color: "warning",
          priority: "high"
        });
        if (f.content !== null && f.content !== O) L(f.content), _(!0)
      } if (u.shift && u.tab) {
      j("yes-accept-edits");
      return
    }
  });
  async function j(S) {
    let u = V ? {} : {
        plan: O
      },
      f = S === "yes-bypass-permissions-keep-context" || S === "yes-accept-edits-keep-context" || S === "yes-default-keep-context" || !1;
    if (S === "yes-bypass-permissions-keep-context") {
      l("tengu_plan_exit", {
        planLengthChars: O.length,
        outcome: S,
        clearContext: !1
      }), Iq(!0), lw(!0), Q(), A.onAllow(u, re("bypassPermissions", E));
      return
    }
    if (S === "yes-accept-edits-keep-context") {
      l("tengu_plan_exit", {
        planLengthChars: O.length,
        outcome: S,
        clearContext: !1
      }), Iq(!0), lw(!0), Q(), A.onAllow(u, re("acceptEdits", E));
      return
    }
    if (S === "yes-default-keep-context") {
      l("tengu_plan_exit", {
        planLengthChars: O.length,
        outcome: S,
        clearContext: !1
      }), Iq(!0), lw(!0), Q(), A.onAllow(u, re("default", E));
      return
    }
    if (S === "yes-bypass-permissions") l("tengu_plan_exit", {
      planLengthChars: O.length,
      outcome: S
    }), Iq(!0), lw(!0), Q(), A.onAllow(u, re("bypassPermissions", E));
    else if (S === "yes-accept-edits") l("tengu_plan_exit", {
      planLengthChars: O.length,
      outcome: S
    }), Iq(!0), lw(!0), Q(), A.onAllow(u, re("acceptEdits", E));
    else if (S === "yes-default") l("tengu_plan_exit", {
      planLengthChars: O.length,
      outcome: S
    }), Iq(!0), lw(!0), Q(), A.onAllow(u, re("default", E));
    else {
      let AA = J.trim();
      if (!AA) return;
      l("tengu_plan_exit", {
        planLengthChars: O.length,
        outcome: "no"
      }), Q(), B(), A.onReject(AA)
    }
  }
  let x = Wp(),
    b = x ? EK(x) : null;
  if ($) return uG.default.createElement(VY, {
    color: "planMode",
    title: "Exit plan mode?"
  }, uG.default.createElement(T, {
    flexDirection: "column",
    paddingX: 1,
    marginTop: 1
  }, uG.default.createElement(C, null, "Claude wants to exit plan mode"), uG.default.createElement(T, {
    marginTop: 1
  }, uG.default.createElement(k0, {
    options: [{
      label: "Yes",
      value: "yes"
    }, {
      label: "No",
      value: "no"
    }],
    onChange: function (u) {
      if (u === "yes") l("tengu_plan_exit", {
        planLengthChars: 0,
        outcome: "yes-default"
      }), Iq(!0), lw(!0), Q(), A.onAllow({}, [{
        type: "setMode",
        mode: "default",
        destination: "session"
      }]);
      else l("tengu_plan_exit", {
        planLengthChars: 0,
        outcome: "no"
      }), Q(), B(), A.onReject()
    },
    onCancel: () => {
      l("tengu_plan_exit", {
        planLengthChars: 0,
        outcome: "no"
      }), Q(), B(), A.onReject()
    }
  }))));
  return uG.default.createElement(uG.default.Fragment, null, uG.default.createElement(VY, {
    color: "planMode",
    title: "Ready to code?",
    innerPaddingX: 0
  }, uG.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, uG.default.createElement(T, {
    paddingX: 1
  }, uG.default.createElement(C, null, "Here is Claude's plan:")), uG.default.createElement(T, {
    borderDimColor: !0,
    borderColor: "subtle",
    borderStyle: "dashed",
    flexDirection: "column",
    borderLeft: !1,
    borderRight: !1,
    paddingX: 1,
    marginBottom: 1,
    overflow: "hidden"
  }, uG.default.createElement(JV, null, O)), uG.default.createElement(T, {
    flexDirection: "column",
    paddingX: 1
  }, uG.default.createElement(Cw, {
    permissionResult: A.permissionResult,
    toolType: "tool"
  }), E && E.length > 0 && uG.default.createElement(T, {
    flexDirection: "column",
    marginBottom: 1
  }, uG.default.createElement(C, {
    bold: !0
  }, "Requested permissions:"), E.map((S, u) => uG.default.createElement(C, {
    key: u,
    dimColor: !0
  }, "  ", "· ", S.tool, "(", Zd2, " ", S.prompt, ")"))), uG.default.createElement(C, {
    dimColor: !0
  }, "Would you like to proceed?"), uG.default.createElement(T, {
    marginTop: 1
  }, uG.default.createElement(k0, {
    options: [...G.toolPermissionContext.isBypassPermissionsModeAvailable ? [{
      label: "Yes, and bypass permissions",
      value: "yes-bypass-permissions"
    }] : [{
      label: "Yes, and auto-accept edits (shift+tab)",
      value: "yes-accept-edits"
    }], ...[], ...[], {
      label: "Yes, and manually approve edits",
      value: "yes-default"
    }, {
      type: "input",
      label: "No, keep planning",
      value: "no",
      placeholder: "Type here to tell Claude what to change",
      onChange: X
    }],
    onChange: (S) => j(S),
    onCancel: () => {
      l("tengu_plan_exit", {
        planLengthChars: O.length,
        outcome: "no"
      }), Q(), B(), A.onReject()
    },
    onFocus: D
  }))))), b && uG.default.createElement(T, {
    flexDirection: "row",
    gap: 1,
    paddingX: 1,
    marginTop: 1
  }, uG.default.createElement(T, null, uG.default.createElement(C, {
    dimColor: !0
  }, "ctrl-g to edit in "), uG.default.createElement(C, {
    bold: !0,
    dimColor: !0
  }, b), V && H && uG.default.createElement(C, {
    dimColor: !0
  }, " · ", k6(H))), M && uG.default.createElement(T, null, uG.default.createElement(C, {
    dimColor: !0
  }, " · "), uG.default.createElement(C, {
    color: "success"
  }, tA.tick, "Plan saved!"))))
}
// @from(Ln 448925, Col 4)
uG
// @from(Ln 448925, Col 8)
se
// @from(Ln 448926, Col 4)
LS0 = w(() => {
  fA();
  u8();
  dN();
  pb();
  ae();
  hB();
  HY();
  wS0();
  Z0();
  B2();
  Kp();
  TX();
  UF();
  y9();
  C0();
  tQ();
  uG = c(QA(), 1), se = c(QA(), 1)
})
// @from(Ln 448946, Col 0)
function gD9({
  toolUseConfirm: A,
  onDone: Q,
  onReject: B
}) {
  let [G] = a0();

  function Z(Y) {
    if (Y === "yes") Ty(G.toolPermissionContext.mode, "plan"), Q(), A.onAllow({}, [{
      type: "setMode",
      mode: "plan",
      destination: "session"
    }]);
    else Q(), B(), A.onReject()
  }
  return Uw.default.createElement(VY, {
    color: "planMode",
    title: "Enter plan mode?"
  }, Uw.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1,
    paddingX: 1
  }, Uw.default.createElement(C, null, "Claude wants to enter plan mode to explore and design an implementation approach."), Uw.default.createElement(T, {
    marginTop: 1,
    flexDirection: "column"
  }, Uw.default.createElement(C, {
    dimColor: !0
  }, "In plan mode, Claude will:"), Uw.default.createElement(C, {
    dimColor: !0
  }, " · Explore the codebase thoroughly"), Uw.default.createElement(C, {
    dimColor: !0
  }, " · Identify existing patterns"), Uw.default.createElement(C, {
    dimColor: !0
  }, " · Design an implementation strategy"), Uw.default.createElement(C, {
    dimColor: !0
  }, " · Present a plan for your approval")), Uw.default.createElement(T, {
    marginTop: 1
  }, Uw.default.createElement(C, {
    dimColor: !0
  }, "No code changes will be made until you approve the plan.")), Uw.default.createElement(T, {
    marginTop: 1
  }, Uw.default.createElement(k0, {
    options: [{
      label: "Yes, enter plan mode",
      value: "yes"
    }, {
      label: "No, start implementing now",
      value: "no"
    }],
    onChange: Z,
    onCancel: () => Z("no")
  }))))
}
// @from(Ln 448999, Col 4)
Uw
// @from(Ln 449000, Col 4)
uD9 = w(() => {
  fA();
  u8();
  dN();
  C0();
  hB();
  Uw = c(QA(), 1)
})
// @from(Ln 449009, Col 0)
function mD9(A) {
  let {
    toolUseConfirm: Q,
    onDone: B,
    onReject: G,
    verbose: Z
  } = A, J = ((H) => {
    let E = bs.inputSchema.safeParse(H);
    if (!E.success) return e(Error(`Failed to parse skill tool input: ${E.error.message}`)), "";
    return E.data.skill
  })(Q.input), X = Q.permissionResult.behavior === "ask" && Q.permissionResult.metadata && "command" in Q.permissionResult.metadata ? Q.permissionResult.metadata.command : void 0, I = _8A.useMemo(() => ({
    completion_type: "tool_use_single",
    language_name: "none"
  }), []);
  yj(Q, I);
  let D = EQ(),
    W = _8A.useMemo(() => {
      let H = [{
          label: "Yes",
          value: "yes",
          feedbackConfig: {
            type: "accept"
          }
        }],
        E = {
          label: qw.default.createElement(C, null, "Yes, and don't ask again for ", qw.default.createElement(C, {
            bold: !0
          }, J), " in", " ", qw.default.createElement(C, {
            bold: !0
          }, D)),
          value: "yes-exact"
        },
        z = J.indexOf(" "),
        $ = [];
      if (z > 0) {
        let L = J.substring(0, z);
        $.push({
          label: qw.default.createElement(C, null, "Yes, and don't ask again for", " ", qw.default.createElement(C, {
            bold: !0
          }, L + ":*"), " commands in", " ", qw.default.createElement(C, {
            bold: !0
          }, D)),
          value: "yes-prefix"
        })
      }
      let O = {
        label: "No",
        value: "no",
        feedbackConfig: {
          type: "reject"
        }
      };
      return [...H, E, ...$, O]
    }, [J, D]),
    K = _8A.useMemo(() => ({
      toolName: k9(Q.tool.name),
      isMcp: Q.tool.isMcp ?? !1
    }), [Q.tool.name, Q.tool.isMcp]),
    V = _8A.useCallback((H, E) => {
      switch (H) {
        case "yes":
          iJ({
            completion_type: "tool_use_single",
            event: "accept",
            metadata: {
              language_name: "none",
              message_id: Q.assistantMessage.message.id,
              platform: l0.platform
            }
          }), Q.onAllow(Q.input, [], E), B();
          break;
        case "yes-exact": {
          iJ({
            completion_type: "tool_use_single",
            event: "accept",
            metadata: {
              language_name: "none",
              message_id: Q.assistantMessage.message.id,
              platform: l0.platform
            }
          }), Q.onAllow(Q.input, [{
            type: "addRules",
            rules: [{
              toolName: kF,
              ruleContent: J
            }],
            behavior: "allow",
            destination: "localSettings"
          }]), B();
          break
        }
        case "yes-prefix": {
          iJ({
            completion_type: "tool_use_single",
            event: "accept",
            metadata: {
              language_name: "none",
              message_id: Q.assistantMessage.message.id,
              platform: l0.platform
            }
          });
          let z = J.indexOf(" "),
            $ = z > 0 ? J.substring(0, z) : J;
          Q.onAllow(Q.input, [{
            type: "addRules",
            rules: [{
              toolName: kF,
              ruleContent: `${$}:*`
            }],
            behavior: "allow",
            destination: "localSettings"
          }]), B();
          break
        }
        case "no":
          iJ({
            completion_type: "tool_use_single",
            event: "reject",
            metadata: {
              language_name: "none",
              message_id: Q.assistantMessage.message.id,
              platform: l0.platform
            }
          }), Q.onReject(E), G(), B();
          break
      }
    }, [Q, B, G, J]),
    F = _8A.useCallback(() => {
      iJ({
        completion_type: "tool_use_single",
        event: "reject",
        metadata: {
          language_name: "none",
          message_id: Q.assistantMessage.message.id,
          platform: l0.platform
        }
      }), Q.onReject(), G(), B()
    }, [Q, B, G]);
  return qw.default.createElement(VY, {
    title: `Use skill "${J}"?`
  }, qw.default.createElement(C, null, "Claude may use instructions, code, or files from this Skill."), qw.default.createElement(T, {
    flexDirection: "column",
    paddingX: 2,
    paddingY: 1
  }, qw.default.createElement(C, {
    dimColor: !0
  }, X?.description)), qw.default.createElement(T, {
    flexDirection: "column"
  }, qw.default.createElement(Cw, {
    permissionResult: Q.permissionResult,
    toolType: "tool"
  }), qw.default.createElement(q$A, {
    options: W,
    onSelect: V,
    onCancel: F,
    toolAnalyticsContext: K
  })))
}
// @from(Ln 449167, Col 4)
qw
// @from(Ln 449167, Col 8)
_8A
// @from(Ln 449168, Col 4)
dD9 = w(() => {
  fA();
  dN();
  le();
  p3();
  C0();
  O8A();
  ae();
  uD1();
  v1();
  m$1();
  hW();
  qw = c(QA(), 1), _8A = c(QA(), 1)
})
// @from(Ln 449183, Col 0)
function UN7(A, Q) {
  switch (Q.type) {
    case "next-question":
      return {
        ...A, currentQuestionIndex: A.currentQuestionIndex + 1, isInTextInput: !1
      };
    case "prev-question":
      return {
        ...A, currentQuestionIndex: Math.max(0, A.currentQuestionIndex - 1), isInTextInput: !1
      };
    case "update-question-state": {
      let B = A.questionStates[Q.questionText],
        G = {
          selectedValue: Q.updates.selectedValue ?? B?.selectedValue ?? (Q.isMultiSelect ? [] : void 0),
          textInputValue: Q.updates.textInputValue ?? B?.textInputValue ?? ""
        };
      return {
        ...A,
        questionStates: {
          ...A.questionStates,
          [Q.questionText]: G
        }
      }
    }
    case "set-answer": {
      let B = {
        ...A,
        answers: {
          ...A.answers,
          [Q.questionText]: Q.answer
        }
      };
      if (Q.shouldAdvance) return {
        ...B,
        currentQuestionIndex: B.currentQuestionIndex + 1,
        isInTextInput: !1
      };
      return B
    }
    case "set-text-input-mode":
      return {
        ...A, isInTextInput: Q.isInInput
      }
  }
}
// @from(Ln 449229, Col 0)
function cD9() {
  let [A, Q] = te.useReducer(UN7, qN7), B = te.useCallback(() => {
    Q({
      type: "next-question"
    })
  }, []), G = te.useCallback(() => {
    Q({
      type: "prev-question"
    })
  }, []), Z = te.useCallback((X, I, D) => {
    Q({
      type: "update-question-state",
      questionText: X,
      updates: I,
      isMultiSelect: D
    })
  }, []), Y = te.useCallback((X, I, D = !0) => {
    Q({
      type: "set-answer",
      questionText: X,
      answer: I,
      shouldAdvance: D
    })
  }, []), J = te.useCallback((X) => {
    Q({
      type: "set-text-input-mode",
      isInInput: X
    })
  }, []);
  return {
    currentQuestionIndex: A.currentQuestionIndex,
    answers: A.answers,
    questionStates: A.questionStates,
    isInTextInput: A.isInTextInput,
    nextQuestion: B,
    prevQuestion: G,
    updateQuestionState: Z,
    setAnswer: Y,
    setTextInputMode: J
  }
}
// @from(Ln 449270, Col 4)
te
// @from(Ln 449270, Col 8)
qN7
// @from(Ln 449271, Col 4)
pD9 = w(() => {
  te = c(QA(), 1);
  qN7 = {
    currentQuestionIndex: 0,
    answers: {},
    questionStates: {},
    isInTextInput: !1
  }
})
// @from(Ln 449281, Col 0)
function n$1({
  questions: A,
  currentQuestionIndex: Q,
  answers: B,
  hideSubmitTab: G = !1
}) {
  let {
    columns: Z
  } = ZB(), Y = lD9.useMemo(() => {
    let D = G ? "" : ` ${tA.tick} Submit `,
      W = 2,
      K = 2,
      V = A9("← ") + A9(" →") + A9(D),
      F = Z - V;
    if (F <= 0) return A.map((b, S) => {
      let u = b?.header || `Q${S+1}`;
      return S === Q ? u.slice(0, 3) : ""
    });
    let H = A.map((b, S) => b?.header || `Q${S+1}`);
    if (H.map((b) => 4 + A9(b)).reduce((b, S) => b + S, 0) <= F) return H;
    let $ = H[Q] || "",
      O = 4 + A9($),
      L = 6,
      M = Math.min(O, F / 2),
      _ = F - M,
      j = A.length - 1,
      x = Math.max(L, Math.floor(_ / Math.max(j, 1)));
    return H.map((b, S) => {
      if (S === Q) {
        let u = M - 2 - 2;
        if (A9(b) <= u) return b;
        let f = b;
        while (A9(f + "…") > u && f.length > 1) f = f.slice(0, -1);
        return f + "…"
      } else {
        let u = x - 2 - 2;
        if (A9(b) <= u) return b;
        let f = b;
        while (A9(f + "…") > u && f.length > 1) f = f.slice(0, -1);
        return f.length > 0 ? f + "…" : b[0] + "…"
      }
    })
  }, [A, Q, Z, G]), J = A.length === 1 && G;
  return Dh.default.createElement(T, {
    flexDirection: "row",
    marginBottom: 1
  }, !J && Dh.default.createElement(C, {
    color: Q === 0 ? "inactive" : void 0
  }, "←", " "), A.map((X, I) => {
    let D = I === Q,
      K = X?.question && !!B[X.question] ? tA.checkboxOn : tA.checkboxOff,
      V = Y[I] || X?.header || `Q${I+1}`;
    return Dh.default.createElement(T, {
      key: X?.question || `question-${I}`
    }, D ? Dh.default.createElement(C, {
      backgroundColor: "permission",
      color: "inverseText"
    }, " ", K, " ", V, " ") : Dh.default.createElement(C, null, " ", K, " ", V, " "))
  }), !G && Dh.default.createElement(T, {
    key: "submit"
  }, Q === A.length ? Dh.default.createElement(C, {
    backgroundColor: "permission",
    color: "inverseText"
  }, " ", tA.tick, " Submit", " ") : Dh.default.createElement(C, null, " ", tA.tick, " Submit ")), !J && Dh.default.createElement(C, {
    color: Q === A.length ? "inactive" : void 0
  }, " ", "→"))
}
// @from(Ln 449348, Col 4)
Dh
// @from(Ln 449348, Col 8)
lD9
// @from(Ln 449349, Col 4)
OS0 = w(() => {
  B2();
  fA();
  P4();
  UC();
  Dh = c(QA(), 1), lD9 = c(QA(), 1)
})
// @from(Ln 449357, Col 0)
function nD9({
  question: A,
  questions: Q,
  currentQuestionIndex: B,
  answers: G,
  questionStates: Z,
  hideSubmitTab: Y = !1,
  onUpdateQuestionState: J,
  onAnswer: X,
  onTextInputFocus: I,
  onCancel: D,
  onSubmit: W
}) {
  let K = iD9.useCallback(($) => {
      I($ === "__other__")
    }, [I]),
    V = A.options.map(($) => ({
      type: "text",
      value: $.label,
      label: $.label,
      description: $.description
    })),
    F = A.question,
    H = Z[F],
    E = {
      type: "input",
      value: "__other__",
      label: "Other",
      placeholder: A.multiSelect ? "Type something" : "Type something.",
      initialValue: H?.textInputValue ?? "",
      onChange: ($) => {
        J(F, {
          textInputValue: $
        }, A.multiSelect ?? !1)
      }
    },
    z = [...V, E];
  return JM.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, JM.default.createElement(K8, {
    dividerColor: "inactive"
  }), JM.default.createElement(T, {
    flexDirection: "column",
    paddingTop: 0
  }, JM.default.createElement(n$1, {
    questions: Q,
    currentQuestionIndex: B,
    answers: G,
    hideSubmitTab: Y
  }), JM.default.createElement(pFA, {
    title: A.question,
    color: "text"
  }), JM.default.createElement(T, {
    marginTop: 1
  }, A.multiSelect ? JM.default.createElement(qI1, {
    key: A.question,
    options: z,
    defaultValue: Z[A.question]?.selectedValue,
    onChange: ($) => {
      J(F, {
        selectedValue: $
      }, !0);
      let O = $.includes("__other__") ? Z[F]?.textInputValue : void 0,
        L = $.filter((M) => M !== "__other__").concat(O ? [O] : []);
      X(F, L, void 0, !1)
    },
    onFocus: K,
    onCancel: D,
    submitButtonText: B === Q.length - 1 ? "Submit" : "Next",
    onSubmit: W
  }) : JM.default.createElement(k0, {
    key: A.question,
    options: z,
    defaultValue: Z[A.question]?.selectedValue,
    onChange: ($) => {
      J(F, {
        selectedValue: $
      }, !1);
      let O = $ === "__other__" ? Z[F]?.textInputValue : void 0;
      X(F, $, O)
    },
    onFocus: K,
    onCancel: D,
    layout: "compact-vertical"
  })), JM.default.createElement(T, {
    marginTop: 1
  }, JM.default.createElement(C, {
    color: "inactive",
    dimColor: !0
  }, "Enter to select ·", " ", Q.length === 1 ? JM.default.createElement(JM.default.Fragment, null, tA.arrowUp, "/", tA.arrowDown, " to navigate") : "Tab/Arrow keys to navigate", " ", "· Esc to cancel"))))
}
// @from(Ln 449449, Col 4)
JM
// @from(Ln 449449, Col 8)
iD9
// @from(Ln 449450, Col 4)
aD9 = w(() => {
  B2();
  fA();
  u8();
  NI1();
  OS0();
  lD();
  JM = c(QA(), 1), iD9 = c(QA(), 1)
})
// @from(Ln 449460, Col 0)
function oD9({
  questions: A,
  currentQuestionIndex: Q,
  answers: B,
  allQuestionsAnswered: G,
  permissionResult: Z,
  onFinalResponse: Y
}) {
  return AH.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, AH.default.createElement(K8, {
    dividerColor: "inactive"
  }), AH.default.createElement(T, {
    flexDirection: "column",
    borderTop: !0,
    borderColor: "inactive",
    paddingTop: 0
  }, AH.default.createElement(n$1, {
    questions: A,
    currentQuestionIndex: Q,
    answers: B
  }), AH.default.createElement(pFA, {
    title: "Review your answers",
    color: "text"
  }), AH.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, !G && AH.default.createElement(T, {
    marginBottom: 1
  }, AH.default.createElement(C, {
    color: "warning"
  }, tA.warning, " You have not answered all questions")), Object.keys(B).length > 0 && AH.default.createElement(T, {
    flexDirection: "column",
    marginBottom: 1
  }, A.filter((J) => J?.question && B[J.question]).map((J) => {
    let X = B[J?.question];
    return AH.default.createElement(T, {
      key: J?.question || "answer",
      flexDirection: "column",
      marginLeft: 1
    }, AH.default.createElement(C, null, tA.bullet, " ", J?.question || "Question"), AH.default.createElement(T, {
      marginLeft: 2
    }, AH.default.createElement(C, {
      color: "success"
    }, tA.arrowRight, " ", X)))
  })), AH.default.createElement(Cw, {
    permissionResult: Z,
    toolType: "tool"
  }), AH.default.createElement(C, {
    color: "inactive"
  }, "Ready to submit your answers?"), AH.default.createElement(T, {
    marginTop: 1
  }, AH.default.createElement(k0, {
    options: [{
      type: "text",
      label: "Submit answers",
      value: "submit"
    }, {
      type: "text",
      label: "Cancel",
      value: "cancel"
    }],
    onChange: (J) => Y(J),
    onCancel: () => Y("cancel")
  })))))
}
// @from(Ln 449527, Col 4)
AH
// @from(Ln 449528, Col 4)
rD9 = w(() => {
  B2();
  fA();
  u8();
  NI1();
  ae();
  OS0();
  lD();
  AH = c(QA(), 1)
})
// @from(Ln 449539, Col 0)
function sD9({
  toolUseConfirm: A,
  onDone: Q,
  onReject: B
}) {
  let G = TU0.safeParse(A.input),
    Z = G.success ? G.data.questions || [] : [],
    Y = G.success ? G.data.metadata?.source : void 0,
    J = cD9(),
    {
      currentQuestionIndex: X,
      answers: I,
      questionStates: D,
      isInTextInput: W,
      nextQuestion: K,
      prevQuestion: V,
      updateQuestionState: F,
      setAnswer: H,
      setTextInputMode: E
    } = J,
    z = X < (Z?.length || 0) ? Z?.[X] : null,
    $ = X === (Z?.length || 0),
    O = Z?.every((b) => b?.question && !!I[b.question]) ?? !1,
    L = Z.length === 1 && !Z[0]?.multiSelect,
    M = a$1.useCallback(() => {
      if (Y) l("tengu_ask_user_question_rejected", {
        source: Y,
        questionCount: Z.length
      });
      Q(), B(), A.onReject()
    }, [Q, B, A, Y, Z.length]),
    _ = a$1.useCallback((b) => {
      if (Y) l("tengu_ask_user_question_accepted", {
        source: Y,
        questionCount: Z.length,
        answerCount: Object.keys(b).length
      });
      let S = {
        ...A.input,
        answers: b
      };
      Q(), A.onAllow(S, [])
    }, [A, Q, Y, Z.length]),
    j = a$1.useCallback((b, S, u, f = !0) => {
      let AA, n = Array.isArray(S);
      if (n) AA = S.join(", ");
      else AA = u || S;
      let y = Z.length === 1;
      if (!n && y && f) {
        let p = {
          ...I,
          [b]: AA
        };
        _(p);
        return
      }
      H(b, AA, f)
    }, [H, Z.length, I, _]);

  function x(b) {
    if (b === "cancel") {
      M();
      return
    }
    if (b === "submit") _(I)
  }
  if (J0((b, S) => {
      if (W && !$) return;
      if ((S.leftArrow || S.shift && S.tab) && X > 0) V();
      let u = L ? (Z?.length || 1) - 1 : Z?.length || 0;
      if ((S.rightArrow || S.tab && !S.shift) && X < u) K()
    }), z) return MS0.default.createElement(nD9, {
    question: z,
    questions: Z,
    currentQuestionIndex: X,
    answers: I,
    questionStates: D,
    hideSubmitTab: L,
    onUpdateQuestionState: F,
    onAnswer: j,
    onTextInputFocus: E,
    onCancel: M,
    onSubmit: K
  });
  if ($) return MS0.default.createElement(oD9, {
    questions: Z,
    currentQuestionIndex: X,
    answers: I,
    allQuestionsAnswered: O,
    permissionResult: A.permissionResult,
    onFinalResponse: x
  });
  return null
}
// @from(Ln 449633, Col 4)
MS0
// @from(Ln 449633, Col 9)
a$1
// @from(Ln 449634, Col 4)
tD9 = w(() => {
  fA();
  DK1();
  pD9();
  aD9();
  rD9();
  Z0();
  MS0 = c(QA(), 1), a$1 = c(QA(), 1)
})
// @from(Ln 449643, Col 4)
eD9 = "CollabSend"
// @from(Ln 449644, Col 4)
AW9 = "CollabRead"
// @from(Ln 449646, Col 0)
function QW9(A, Q) {
  NN7.set(Q, {
    handle: A,
    uid: Q,
    grantedAt: Date.now()
  })
}
// @from(Ln 449653, Col 4)
NN7
// @from(Ln 449654, Col 4)
BW9 = w(() => {
  NN7 = new Map
})
// @from(Ln 449658, Col 0)
function ZW9({
  toolUseConfirm: A,
  toolUseContext: Q,
  onDone: B,
  onReject: G
}) {
  let [Z, Y] = j8A.useState(null), [J, X] = j8A.useState(!0), I = A.input.handle ?? "", D = I.startsWith("@") ? I : `@${I}`;
  j8A.useEffect(() => {
    Q.getAppState().then((E) => {
      let z = E.presence?.users ?? [],
        $ = GW9(I).toLowerCase(),
        O = z.find((L) => GW9(L.handle).toLowerCase() === $);
      Y(O ?? null), X(!1)
    })
  }, [I, Q]);
  let W = (E) => {
      switch (E) {
        case "allow":
          if (J || !Z) return;
          iJ({
            completion_type: "tool_use_single",
            event: "accept",
            metadata: {
              language_name: "none",
              message_id: A.assistantMessage.message.id,
              platform: l0.platform
            }
          }), QW9(Z.handle, Z.uid), A.onAllow(A.input, []), B();
          break;
        case "deny":
          iJ({
            completion_type: "tool_use_single",
            event: "reject",
            metadata: {
              language_name: "none",
              message_id: A.assistantMessage.message.id,
              platform: l0.platform
            }
          }), A.onReject(), G(), B();
          break
      }
    },
    K = J || !Z,
    V = j8A.useMemo(() => [{
      label: K ? fU.default.createElement(C, {
        dimColor: !0
      }, "Allow (loading…)") : "Allow",
      value: "allow",
      disabled: K
    }, {
      label: fU.default.createElement(C, null, "Deny ", fU.default.createElement(C, {
        dimColor: !0
      }, "(esc)")),
      value: "deny"
    }], [K]),
    F = Z?.summary || Z?.branch,
    H = Z?.repo?.split("/").pop();
  return fU.default.createElement(VY, {
    title: "Collaborate"
  }, fU.default.createElement(T, {
    flexDirection: "column",
    paddingX: 1,
    paddingY: 1
  }, fU.default.createElement(C, null, "Collaborate with ", fU.default.createElement(C, {
    color: "suggestion"
  }, D), "?"), F && fU.default.createElement(C, {
    dimColor: !0
  }, "Working on: ", fU.default.createElement(C, null, F)), H && !F && fU.default.createElement(C, {
    dimColor: !0
  }, "In: ", fU.default.createElement(C, null, H), Z?.branch && fU.default.createElement(C, {
    dimColor: !0
  }, " (", Z.branch, ")"))), fU.default.createElement(T, {
    flexDirection: "column",
    paddingX: 1
  }, fU.default.createElement(k0, {
    options: V,
    onChange: W,
    onCancel: () => W("deny")
  })))
}
// @from(Ln 449739, Col 0)
function GW9(A) {
  return A.startsWith("@") ? A.slice(1) : A
}
// @from(Ln 449742, Col 4)
fU
// @from(Ln 449742, Col 8)
j8A
// @from(Ln 449743, Col 4)
YW9 = w(() => {
  fA();
  u8();
  dN();
  le();
  p3();
  BW9();
  fU = c(QA(), 1), j8A = c(QA(), 1)
})
// @from(Ln 449753, Col 0)
function wN7(A) {
  if (A.name === eD9 || A.name === AW9) return ZW9;
  switch (A) {
    case J$:
      return GD9;
    case X$:
      return _D9;
    case o2:
      return ND9;
    case hF:
      return xD9;
    case qf:
      return bD9;
    case V$:
      return hD9;
    case gbA:
      return gD9;
    case bs:
      return mD9;
    case IK1:
      return sD9;
    case as:
    case Tc:
    case v5:
      return TD9;
    default:
      return d$1
  }
}
// @from(Ln 449783, Col 0)
function LN7(A) {
  let Q = A.tool.userFacingName(A.input);
  if (A.tool === V$) return "Claude Code needs your approval for the plan";
  if (A.tool === gbA) return "Claude Code wants to enter plan mode";
  if (!Q || Q.trim() === "") return "Claude Code needs your attention";
  return `Claude needs your permission to use ${Q}`
}
// @from(Ln 449791, Col 0)
function JW9({
  toolUseConfirm: A,
  toolUseContext: Q,
  onDone: B,
  onReject: G,
  verbose: Z,
  workerBadge: Y
}) {
  H2("app:interrupt", () => {
    B(), G(), A.onReject()
  }, {
    context: "Confirmation"
  });
  let J = LN7(A);
  c$1(J, "permission_prompt");
  let X = wN7(A.tool);
  return RS0.createElement(X, {
    toolUseContext: Q,
    toolUseConfirm: A,
    onDone: B,
    onReject: G,
    verbose: Z,
    workerBadge: Y
  })
}
// @from(Ln 449816, Col 4)
RS0
// @from(Ln 449817, Col 4)
XW9 = w(() => {
  c6();
  is();
  jc();
  YK();
  ZD9();
  wD9();
  $S0();
  US0();
  jD9();
  PD9();
  u6A();
  UW1();
  HbA();
  T_();
  iHA();
  yD9();
  fD9();
  fbA();
  LS0();
  bU0();
  uD9();
  uD1();
  dD9();
  DK1();
  tD9();
  YW9();
  RS0 = c(QA(), 1)
})
// @from(Ln 449847, Col 0)
function o$1(A) {
  if ("oneOf" in A) return A.oneOf.map((Q) => Q.const);
  if ("enum" in A) return A.enum;
  return []
}
// @from(Ln 449853, Col 0)
function _S0(A) {
  if ("oneOf" in A) return A.oneOf.map((Q) => Q.title);
  if ("enum" in A) return ("enumNames" in A ? A.enumNames : void 0) ?? A.enum;
  return []
}
// @from(Ln 449859, Col 0)
function IW9(A, Q) {
  let B = o$1(A).indexOf(Q);
  return B >= 0 ? _S0(A)[B] ?? Q : Q
}
// @from(Ln 449864, Col 0)
function MN7(A) {
  if (nuA(A)) {
    let [Q, ...B] = o$1(A);
    if (!Q) return m.never();
    return m.enum([Q, ...B])
  }
  if (A.type === "string") {
    let Q = m.string();
    if (A.minLength !== void 0) Q = Q.min(A.minLength, {
      message: `Must be at least ${A.minLength} character${A.minLength===1?"":"s"}`
    });
    if (A.maxLength !== void 0) Q = Q.max(A.maxLength, {
      message: `Must be at most ${A.maxLength} character${A.maxLength===1?"":"s"}`
    });
    switch (A.format) {
      case "email":
        Q = Q.email({
          message: "Please enter a valid email address"
        });
        break;
      case "uri":
        Q = Q.url({
          message: "Please enter a valid URI"
        });
        break;
      case "date":
        Q = Q.date("Please enter a valid date (YYYY-MM-DD)");
        break;
      case "date-time":
        Q = Q.datetime({
          offset: !0,
          message: "Please enter a valid date-time (YYYY-MM-DDTHH:MM:SSZ)"
        });
        break;
      default:
        break
    }
    return Q
  }
  if (A.type === "number" || A.type === "integer") {
    let Q = m.coerce.number();
    if (A.type === "integer") Q = Q.int();
    if (A.minimum !== void 0) Q = Q.min(A.minimum, {
      message: `Must be at least ${A.minimum}`
    });
    if (A.maximum !== void 0) Q = Q.max(A.maximum, {
      message: `Must be at most ${A.maximum}`
    });
    return Q
  }
  if (A.type === "boolean") return m.coerce.boolean();
  throw Error(`Unsupported schema: ${eA(A)}`)
}
// @from(Ln 449918, Col 0)
function jS0(A, Q) {
  let G = MN7(Q).safeParse(A);
  if (G.success) return {
    value: G.data,
    isValid: !0
  };
  return {
    isValid: !1,
    error: G.error.issues.map((Z) => Z.message).join("; ")
  }
}
// @from(Ln 449930, Col 0)
function DW9(A) {
  if (A.type === "string") {
    if (!RN7(A)) return;
    let {
      description: Q,
      example: B
    } = ON7[A.format] || {};
    return `${Q}, e.g. ${B}`
  }
  if (A.type === "number" || A.type === "integer") {
    let Q = A.type === "integer",
      B = (G) => Number.isInteger(G) && !Q ? `${G}.0` : String(G);
    if (A.minimum !== void 0 && A.maximum !== void 0) return `(${A.type} between ${B(A.minimum)} and ${B(A.maximum)})`;
    else if (A.minimum !== void 0) return `(${A.type} >= ${B(A.minimum)})`;
    else if (A.maximum !== void 0) return `(${A.type} <= ${B(A.maximum)})`;
    else {
      let G = A.type === "integer" ? "42" : "3.14";
      return `(${A.type}, e.g. ${G})`
    }
  }
  return
}
// @from(Ln 449952, Col 4)
ON7
// @from(Ln 449952, Col 9)
nuA = (A) => {
    return A.type === "string" && (("enum" in A) || ("oneOf" in A))
  }
// @from(Ln 449955, Col 2)
RN7 = (A) => {
    return A.type === "string" && "format" in A && typeof A.format === "string"
  }
// @from(Ln 449958, Col 4)
WW9 = w(() => {
  j9();
  A0();
  ON7 = {
    email: {
      description: "email address",
      example: "user@example.com"
    },
    uri: {
      description: "URI",
      example: "https://example.com"
    },
    date: {
      description: "date",
      example: "2024-03-15"
    },
    "date-time": {
      description: "date-time",
      example: "2024-03-15T14:30:00Z"
    }
  }
})
// @from(Ln 449981, Col 0)
function r$1() {
  return n4.default.createElement(C, {
    italic: !0,
    dimColor: !0
  }, "<unset>")
}