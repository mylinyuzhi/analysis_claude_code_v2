
// @from(Start 12380257, End 12382603)
function fd2({
  question: A,
  questions: Q,
  currentQuestionIndex: B,
  answers: G,
  questionStates: Z,
  hideSubmitTab: I = !1,
  onUpdateQuestionState: Y,
  onAnswer: J,
  onTextInputFocus: W,
  onCancel: X,
  onSubmit: V
}) {
  let F = mq.useCallback((U) => {
      W(U === "__other__")
    }, [W]),
    K = A.options.map((U) => ({
      type: "text",
      value: U.label,
      label: U.label,
      description: U.description
    })),
    D = A.question,
    H = Z[D],
    C = {
      type: "input",
      value: "__other__",
      label: "Other",
      placeholder: A.multiSelect ? "Type something" : "Type something.",
      initialValue: H?.textInputValue ?? "",
      onChange: (U) => {
        Y(D, {
          textInputValue: U
        }, A.multiSelect ?? !1)
      }
    },
    E = [...K, C];
  return mq.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, mq.default.createElement(D3, {
    dividerColor: "inactive"
  }), mq.default.createElement(S, {
    flexDirection: "column",
    paddingTop: 0
  }, mq.default.createElement(W71, {
    questions: Q,
    currentQuestionIndex: B,
    answers: G,
    hideSubmitTab: I
  }), mq.default.createElement(xWA, {
    title: A.question,
    color: "text"
  }), mq.default.createElement(S, {
    marginTop: 1
  }, A.multiSelect ? mq.default.createElement(PQ0, {
    key: A.question,
    options: E,
    defaultValue: Z[A.question]?.selectedValue,
    onChange: (U) => {
      Y(D, {
        selectedValue: U
      }, !0);
      let q = U.includes("__other__") ? Z[D]?.textInputValue : void 0,
        w = U.filter((N) => N !== "__other__").concat(q ? [q] : []);
      J(D, w, void 0, !1)
    },
    onFocus: F,
    onCancel: X,
    submitButtonText: B === Q.length - 1 ? "Submit" : "Next",
    onSubmit: V
  }) : mq.default.createElement(M0, {
    key: A.question,
    options: E,
    defaultValue: Z[A.question]?.selectedValue,
    onChange: (U) => {
      Y(D, {
        selectedValue: U
      }, !1);
      let q = U === "__other__" ? Z[D]?.textInputValue : void 0;
      J(D, U, q)
    },
    onFocus: F,
    onCancel: X,
    layout: "compact-vertical"
  })), mq.default.createElement(S, {
    marginTop: 1
  }, mq.default.createElement($, {
    color: "inactive",
    dimColor: !0
  }, "Enter to select · Tab/Arrow keys to navigate · Esc to cancel"))))
}
// @from(Start 12382608, End 12382610)
mq
// @from(Start 12382616, End 12382695)
hd2 = L(() => {
  hA();
  J5();
  Z31();
  IZ0();
  BK();
  mq = BA(VA(), 1)
})
// @from(Start 12382698, End 12384633)
function gd2({
  questions: A,
  currentQuestionIndex: Q,
  answers: B,
  allQuestionsAnswered: G,
  permissionResult: Z,
  onFinalResponse: I
}) {
  return EK.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, EK.default.createElement(D3, {
    dividerColor: "inactive"
  }), EK.default.createElement(S, {
    flexDirection: "column",
    borderTop: !0,
    borderColor: "inactive",
    paddingTop: 0
  }, EK.default.createElement(W71, {
    questions: A,
    currentQuestionIndex: Q,
    answers: B
  }), EK.default.createElement(xWA, {
    title: "Review your answers",
    color: "text"
  }), EK.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, !G && EK.default.createElement(S, {
    marginBottom: 1
  }, EK.default.createElement($, {
    color: "warning"
  }, H1.warning, " You have not answered all questions")), Object.keys(B).length > 0 && EK.default.createElement(S, {
    flexDirection: "column",
    marginBottom: 1
  }, A.filter((Y) => Y?.question && B[Y.question]).map((Y) => {
    let J = B[Y?.question];
    return EK.default.createElement(S, {
      key: Y?.question || "answer",
      flexDirection: "column",
      marginLeft: 1
    }, EK.default.createElement($, null, H1.bullet, " ", Y?.question || "Question"), EK.default.createElement(S, {
      marginLeft: 2
    }, EK.default.createElement($, {
      color: "success"
    }, H1.arrowRight, " ", J)))
  })), EK.default.createElement(VC, {
    permissionResult: Z,
    toolType: "tool"
  }), EK.default.createElement($, {
    color: "inactive"
  }, "Ready to submit your answers?"), EK.default.createElement(S, {
    marginTop: 1
  }, EK.default.createElement(M0, {
    options: [{
      type: "text",
      label: "Submit answers",
      value: "submit"
    }, {
      type: "text",
      label: "Cancel",
      value: "cancel"
    }],
    onChange: (Y) => I(Y),
    onCancel: () => I("cancel")
  })))))
}
// @from(Start 12384638, End 12384640)
EK
// @from(Start 12384646, End 12384741)
ud2 = L(() => {
  V9();
  hA();
  J5();
  Z31();
  Gg();
  IZ0();
  BK();
  EK = BA(VA(), 1)
})
// @from(Start 12384744, End 12386766)
function md2({
  toolUseConfirm: A,
  onDone: Q,
  onReject: B
}) {
  let G = ZZ0.safeParse(A.input),
    Z = G.success ? G.data.questions || [] : [],
    I = vd2(),
    {
      currentQuestionIndex: Y,
      answers: J,
      questionStates: W,
      isInTextInput: X,
      nextQuestion: V,
      prevQuestion: F,
      updateQuestionState: K,
      setAnswer: D,
      setTextInputMode: H
    } = I,
    C = Y < (Z?.length || 0) ? Z?.[Y] : null,
    E = Y === (Z?.length || 0),
    U = Z?.every((y) => y?.question && !!J[y.question]) ?? !1,
    q = Z.length === 1 && !Z[0]?.multiSelect,
    w = c0A.useCallback(() => {
      Q(), B(), A.onReject()
    }, [Q, B, A]),
    N = c0A.useCallback((y) => {
      let v = {
        ...A.input,
        answers: y
      };
      Q(), A.onAllow(v, [])
    }, [A, Q]),
    R = c0A.useCallback((y, v, x, p = !0) => {
      let u, e = Array.isArray(v);
      if (e) u = v.join(", ");
      else u = x || v;
      let l = Z.length === 1;
      if (!e && l && p) {
        let k = {
          ...J,
          [y]: u
        };
        N(k);
        return
      }
      D(y, u, p)
    }, [D, Z.length, J, N]);

  function T(y) {
    if (y === "cancel") {
      w();
      return
    }
    if (y === "submit") N(J)
  }
  if (f1((y, v) => {
      if (X && !E) return;
      if (v.return) return;
      if ((v.leftArrow || v.shift && v.tab) && Y > 0) F();
      let x = q ? (Z?.length || 1) - 1 : Z?.length || 0;
      if ((v.rightArrow || v.tab && !v.shift) && Y < x) V()
    }), C) return c0A.default.createElement(fd2, {
    question: C,
    questions: Z,
    currentQuestionIndex: Y,
    answers: J,
    questionStates: W,
    hideSubmitTab: q,
    onUpdateQuestionState: K,
    onAnswer: R,
    onTextInputFocus: H,
    onCancel: w,
    onSubmit: V
  });
  if (E) return c0A.default.createElement(gd2, {
    questions: Z,
    currentQuestionIndex: Y,
    answers: J,
    allQuestionsAnswered: U,
    permissionResult: A.permissionResult,
    onFinalResponse: T
  });
  return null
}
// @from(Start 12386771, End 12386774)
c0A
// @from(Start 12386780, End 12386862)
dd2 = L(() => {
  hA();
  J71();
  bd2();
  hd2();
  ud2();
  c0A = BA(VA(), 1)
})
// @from(Start 12386865, End 12387302)
function Nt5(A) {
  switch (A) {
    case lD:
      return hf2;
    case QV:
      return ef2;
    case D9:
      return af2;
    case nV:
      return gm2;
    case kP:
      return cm2;
    case gq:
      return Gd2;
    case cTA:
      return Dd2;
    case ln:
      return Sd2;
    case nn:
      return kd2;
    case Y71:
      return md2;
    case zO:
    case Py:
    case n8:
      return Qh2;
    default:
      return F31
  }
}
// @from(Start 12387304, End 12387634)
function Lt5(A) {
  let Q = A.tool.userFacingName(A.input);
  if (A.tool === gq) return "Claude Code needs your approval for the plan";
  if (A.tool === cTA) return "Claude Code wants to enter plan mode";
  if (!Q || Q.trim() === "") return "Claude Code needs your attention";
  return `Claude needs your permission to use ${Q}`
}
// @from(Start 12387636, End 12388017)
function cd2({
  toolUseConfirm: A,
  toolUseContext: Q,
  onDone: B,
  onReject: G,
  verbose: Z
}) {
  f1((J, W) => {
    if (W.ctrl && J === "c") B(), G(), A.onReject()
  });
  let I = Lt5(A);
  K31(I, "permission_prompt");
  let Y = Nt5(A.tool);
  return YZ0.createElement(Y, {
    toolUseContext: Q,
    toolUseConfirm: A,
    onDone: B,
    onReject: G,
    verbose: Z
  })
}
// @from(Start 12388022, End 12388025)
YZ0
// @from(Start 12388031, End 12388307)
pd2 = L(() => {
  hA();
  zn();
  rh();
  pF();
  gf2();
  sf2();
  T70();
  j70();
  Ah2();
  Bh2();
  DWA();
  KTA();
  VTA();
  Dq();
  oWA();
  um2();
  pm2();
  dTA();
  Zd2();
  GZ0();
  Hd2();
  G71();
  I71();
  _d2();
  yd2();
  J71();
  dd2();
  YZ0 = BA(VA(), 1)
})
// @from(Start 12388310, End 12389769)
function Ot5(A) {
  if (lTA(A)) return j.enum(A.enum);
  if (A.type === "string") {
    let Q = j.string();
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
    let Q = j.coerce.number();
    if (A.type === "integer") Q = Q.int();
    if (A.minimum !== void 0) Q = Q.min(A.minimum, {
      message: `Must be at least ${A.minimum}`
    });
    if (A.maximum !== void 0) Q = Q.max(A.maximum, {
      message: `Must be at most ${A.maximum}`
    });
    return Q
  }
  if (A.type === "boolean") return j.coerce.boolean();
  throw Error(`Unsupported schema: ${JSON.stringify(A)}`)
}
// @from(Start 12389771, End 12389981)
function JZ0(A, Q) {
  let G = Ot5(Q).safeParse(A);
  if (G.success) return {
    value: G.data,
    isValid: !0
  };
  return {
    isValid: !1,
    error: G.error.errors.map((Z) => Z.message).join("; ")
  }
}
// @from(Start 12389983, End 12390713)
function ld2(A) {
  if (A.type === "string") {
    if (!Rt5(A)) return;
    let {
      description: Q,
      example: B
    } = Mt5[A.format] || {};
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
// @from(Start 12390718, End 12390721)
Mt5
// @from(Start 12390723, End 12390787)
lTA = (A) => {
    return A.type === "string" && "enum" in A
  }
// @from(Start 12390791, End 12390889)
Rt5 = (A) => {
    return A.type === "string" && "format" in A && typeof A.format === "string"
  }
// @from(Start 12390895, End 12391275)
id2 = L(() => {
  Q2();
  Mt5 = {
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
// @from(Start 12391278, End 12391384)
function X71() {
  return Z9.default.createElement($, {
    italic: !0,
    dimColor: !0
  }, "<unset>")
}
// @from(Start 12391386, End 12401207)
function ad2({
  serverName: A,
  request: Q,
  onResponse: B,
  signal: G
}) {
  let {
    message: Z,
    requestedSchema: I
  } = Q, [Y, J] = Z9.useState(null), [W, X] = Z9.useState(() => {
    let zA = {};
    if (I.properties) {
      for (let [NA, OA] of Object.entries(I.properties))
        if (typeof OA === "object" && OA !== null) {
          if (OA.default !== void 0) zA[NA] = OA.default
        }
    }
    return zA
  }), [V, F] = Z9.useState(() => {
    let zA = {};
    for (let [NA, OA] of Object.entries(I.properties))
      if (nd2(OA) && OA?.default !== void 0) {
        let mA = JZ0(String(OA.default), OA);
        if (!mA.isValid && mA.error) zA[NA] = mA.error
      } return zA
  });
  Z9.useEffect(() => {
    if (!G) return;
    let zA = () => {
      B("cancel")
    };
    if (G.aborted) {
      zA();
      return
    }
    return G.addEventListener("abort", zA), () => {
      G.removeEventListener("abort", zA)
    }
  }, [G, B]);
  let K = Z9.useMemo(() => {
      let zA = I.required ?? [];
      return Object.entries(I.properties).map(([NA, OA]) => ({
        name: NA,
        schema: OA,
        isRequired: zA.includes(NA)
      }))
    }, [I]),
    [D, H] = Z9.useState(0),
    [C, E] = Z9.useState(),
    [U, q] = Z9.useState(""),
    [w, N] = Z9.useState(0),
    {
      columns: R
    } = WB(),
    T = D !== void 0 ? K[D] : void 0,
    y = T && nd2(T.schema);
  EQ(), K31("Claude Code needs your input", "elicitation_dialog");

  function v(zA) {
    let NA = K.length + 2,
      OA = D ?? (Y === "accept" ? K.length : Y === "decline" ? K.length + 1 : void 0),
      mA = OA !== void 0 ? (OA + (zA === "up" ? NA - 1 : 1)) % NA : 0;
    if (mA < K.length) H(mA), J(null);
    else H(void 0), J(mA === K.length ? "accept" : "decline")
  }

  function x(zA, NA) {
    X((OA) => {
      let mA = {
        ...OA
      };
      if (NA === void 0) delete mA[zA];
      else mA[zA] = NA;
      return mA
    })
  }

  function p(zA, NA) {
    F((OA) => {
      let mA = {
        ...OA
      };
      if (NA) mA[zA] = NA;
      else delete mA[zA];
      return mA
    })
  }

  function u(zA) {
    if (!zA) return;
    x(zA, void 0), p(zA), E(void 0), q(""), N(0)
  }

  function e(zA) {
    if (!T) return;
    if (zA.trim() === "" && (T.schema.type !== "string" || ("format" in T.schema) && T.schema.format !== void 0)) {
      u(T.name), v("down");
      return
    }
    let OA = JZ0(zA, T.schema);
    x(T.name, OA.isValid ? OA.value : zA), p(T.name, OA.isValid ? void 0 : OA.error), E(void 0), q(""), N(0), v("down")
  }

  function l() {
    if (!T) return;
    E(void 0), q(""), N(0)
  }
  f1((zA, NA) => {
    if (T && C === T.name) {
      if (lTA(T?.schema)) return;
      if (y) {
        if (NA.escape && U === "") {
          l();
          return
        }
      }
    } else {
      if (NA.escape) {
        B("cancel");
        return
      }
      if (NA.return && Y === "accept") {
        if (k() && Object.keys(V).length === 0) B("accept", W);
        return
      }
      if (NA.return && Y === "decline") {
        B("decline");
        return
      }
      if (NA.upArrow || NA.downArrow) {
        v(NA.upArrow ? "up" : "down");
        return
      }
      if (T) {
        let {
          schema: OA,
          name: mA,
          isRequired: wA
        } = T, qA = W[mA];
        if (NA.backspace && !wA) {
          u(T.name);
          return
        }
        if (NA.return) {
          if (OA.type === "boolean") {
            x(mA, !(qA ?? !1)), v("down");
            return
          }
          if (E(mA), y) {
            let KA = qA !== void 0 ? String(qA) : "";
            q(KA), N(KA.length)
          }
        }
      }
    }
  }, {
    isActive: !0
  });
  let k = () => {
      let zA = I.required || [];
      for (let NA of zA) {
        let OA = W[NA];
        if (OA === void 0 || OA === null || OA === "") return !1
      }
      return !0
    },
    m = () => {
      if (!K.length) return null;
      return Z9.default.createElement(S, {
        flexDirection: "column",
        gap: 1
      }, K.map((zA, NA) => {
        let {
          name: OA,
          schema: mA,
          isRequired: wA
        } = zA, qA = NA === D && !Y, KA = W[OA], yA = (() => {
          if (!qA || C !== void 0) return null;
          let X1 = mA.type === "boolean" ? "toggle" : lTA(mA) ? "select" : "edit",
            WA = KA === void 0 || wA ? `(Press Enter to ${X1})` : `(Press Enter to ${X1}, Backspace to unset)`;
          return Z9.default.createElement($, {
            dimColor: !0
          }, " ", WA)
        })(), oA = (X1, WA) => {
          return Z9.default.createElement(S, {
            key: OA,
            flexDirection: "column"
          }, Z9.default.createElement(S, {
            gap: 1,
            paddingLeft: qA ? 0 : 2
          }, qA && Z9.default.createElement($, {
            color: "success"
          }, H1.pointer), Z9.default.createElement(S, {
            flexGrow: 1,
            flexDirection: "column"
          }, X1, mA.description && Z9.default.createElement(S, {
            marginLeft: 2
          }, Z9.default.createElement($, {
            dimColor: !0
          }, mA.description)), WA && Z9.default.createElement(S, {
            marginLeft: 2
          }, Z9.default.createElement($, {
            color: "error",
            bold: !0
          }, H1.warning, " ", WA)))))
        };
        if (lTA(mA)) {
          let X1 = mA.enum.map((WA, EA) => ({
            label: mA.enumNames?.[EA] ?? WA,
            value: WA
          }));
          if (qA && C === OA) return Z9.default.createElement(S, {
            key: OA,
            flexDirection: "column"
          }, Z9.default.createElement($, {
            color: "success"
          }, mA.title || OA, wA && Z9.default.createElement($, {
            color: "error"
          }, "*"), mA.description && Z9.default.createElement($, {
            dimColor: !0
          }, " - ", mA.description)), Z9.default.createElement(M0, {
            options: X1,
            defaultValue: KA !== void 0 ? KA : mA.default ?? mA.enum[0],
            onChange: (WA) => {
              x(OA, WA), E(void 0), v("down")
            },
            onCancel: () => {
              E(void 0)
            }
          }));
          else {
            let WA = mA.enum.findIndex((MA) => MA === KA),
              EA = KA !== void 0 ? WA >= 0 && mA.enumNames?.[WA] ? mA.enumNames[WA] : KA : Z9.default.createElement(X71, null);
            return oA(Z9.default.createElement($, {
              color: qA ? "success" : void 0
            }, mA.title || OA, wA && Z9.default.createElement($, {
              color: "error"
            }, "*"), ": ", EA, yA))
          }
        } else if (mA.type === "boolean") return oA(Z9.default.createElement($, {
          color: qA ? "success" : void 0
        }, mA.title || OA, wA && Z9.default.createElement($, {
          color: "error"
        }, "*"), ":", " ", KA !== void 0 ? KA ? `${H1.tick} Yes` : `${H1.cross} No` : Z9.default.createElement(X71, null), yA));
        else if (y) {
          let X1 = V[OA],
            WA = ld2(mA);
          if (qA && C === OA) return oA(Z9.default.createElement(S, {
            flexDirection: "column"
          }, Z9.default.createElement($, {
            color: "success"
          }, mA.title || OA, wA && Z9.default.createElement($, {
            color: "error"
          }, "*"), ":", WA && Z9.default.createElement($, {
            dimColor: !0
          }, ` ${WA}`)), Z9.default.createElement(S, {
            marginLeft: 2
          }, Z9.default.createElement(s4, {
            value: U,
            onChange: q,
            onSubmit: e,
            onExit: l,
            placeholder: `Enter ${mA.type}…`,
            columns: Math.min(R - 6, 80),
            cursorOffset: w,
            onChangeCursorOffset: N,
            focus: !0,
            showCursor: !0,
            multiline: mA.type === "string"
          }))));
          return oA(Z9.default.createElement($, {
            color: qA ? "success" : void 0
          }, mA.title || OA, wA && Z9.default.createElement($, {
            color: "error"
          }, "*"), ":", " ", KA === void 0 ? Z9.default.createElement(X71, null) : String(KA), yA), X1)
        } else return oA(Z9.default.createElement($, {
          color: qA ? "success" : void 0
        }, mA.title || OA, wA && Z9.default.createElement($, {
          color: "error"
        }, "*"), ":", " ", KA === void 0 ? Z9.default.createElement(X71, null) : String(KA), yA))
      }))
    },
    o = (zA) => {
      return I.properties[zA]?.title ?? zA
    },
    IA = Object.keys(V),
    FA = (I.required || []).filter((zA) => W[zA] === void 0);
  return Z9.default.createElement(S, {
    flexDirection: "column",
    gap: 1,
    padding: 1,
    borderStyle: "round",
    borderColor: "permission"
  }, Z9.default.createElement($, {
    bold: !0
  }, H1.info, " MCP Server “", A, "” requests your input"), Z9.default.createElement(S, {
    padding: 1
  }, Z9.default.createElement($, null, Z)), m(), K.length > 0 && Z9.default.createElement(Z9.default.Fragment, null, FA.length > 0 && Z9.default.createElement($, {
    color: "error"
  }, H1.warning, " Missing required fields:", " ", FA.map(o).join(", ")), IA.length > 0 && Z9.default.createElement($, {
    color: "error"
  }, H1.warning, " Validation errors in:", " ", IA.map(o).join(", ")), Z9.default.createElement($, {
    bold: !0,
    color: Y === "accept" ? "success" : void 0,
    inverse: Y === "accept"
  }, "Accept"), Z9.default.createElement($, {
    bold: !0,
    color: Y === "decline" ? "error" : void 0,
    inverse: Y === "decline"
  }, "Decline"), Z9.default.createElement($, {
    dimColor: !0
  }, "Press ↑↓ to navigate · Enter to edit · Esc to cancel / go back")))
}
// @from(Start 12401212, End 12401214)
Z9
// @from(Start 12401216, End 12401277)
nd2 = (A) => ["string", "number", "integer"].includes(A.type)
// @from(Start 12401283, End 12401386)
sd2 = L(() => {
  hA();
  V9();
  Q4();
  j70();
  S5();
  id2();
  ZY();
  i8();
  Z9 = BA(VA(), 1)
})
// @from(Start 12401389, End 12401583)
function F71(A) {
  let [Q, B] = V71.useState(!1);
  return V71.useEffect(() => {
    B(!1);
    let G = setTimeout(() => {
      B(!0)
    }, A);
    return () => clearTimeout(G)
  }, [A]), Q
}
// @from(Start 12401588, End 12401591)
V71
// @from(Start 12401597, End 12401635)
WZ0 = L(() => {
  V71 = BA(VA(), 1)
})
// @from(Start 12401715, End 12401802)
function rd2() {
  return process.env.XDG_STATE_HOME ?? D71(K71(), ".local", "state")
}
// @from(Start 12401804, End 12401882)
function od2() {
  return process.env.XDG_CACHE_HOME ?? D71(K71(), ".cache")
}
// @from(Start 12401884, End 12401970)
function td2() {
  return process.env.XDG_DATA_HOME ?? D71(K71(), ".local", "share")
}
// @from(Start 12401972, End 12402027)
function ed2() {
  return D71(K71(), ".local", "bin")
}
// @from(Start 12402032, End 12402046)
Ac2 = () => {}
// @from(Start 12402289, End 12403075)
async function yt5(A = "stable", Q, B) {
  let G = Date.now(),
    Z = Q === H71;
  try {
    let I = await YQ.get(`${Q}/${A}`, {
        timeout: 30000,
        responseType: "text",
        ...B
      }),
      Y = Date.now() - G;
    return GA("tengu_version_check_success", {
      latency_ms: Y,
      source_gcs: Z
    }), I.data.trim()
  } catch (I) {
    let Y = Date.now() - G,
      J = I instanceof Error ? I.message : String(I),
      W;
    if (YQ.isAxiosError(I) && I.response) W = I.response.status;
    throw GA("tengu_version_check_failure", {
      latency_ms: Y,
      http_status: W,
      source_gcs: Z,
      is_timeout: J.includes("timeout")
    }), AA(Error(`Failed to fetch version from ${Q}/${A}: ${J}`)), Error(`Failed to fetch version from ${A}: ${I}`)
  }
}
// @from(Start 12403076, End 12403341)
async function VZ0(A) {
  if (A && /^v?\d+\.\d+\.\d+(-\S+)?$/.test(A)) return A.startsWith("v") ? A.slice(1) : A;
  let Q = A || "stable";
  if (Q !== "stable" && Q !== "latest") throw Error(`Invalid channel: ${A}. Use 'stable' or 'latest'`);
  return yt5(Q, H71)
}
// @from(Start 12403342, End 12403704)
async function xt5(A, Q, B, G = {}) {
  let Z = await YQ.get(A, {
      timeout: 300000,
      responseType: "arraybuffer",
      ...G
    }),
    I = Tt5("sha256");
  I.update(Z.data);
  let Y = I.digest("hex");
  if (Y !== Q) throw Error(`Checksum mismatch: expected ${Q}, got ${Y}`);
  (await import("fs")).writeFileSync(B, Buffer.from(Z.data)), jt5(B, 493)
}
// @from(Start 12403705, End 12404504)
async function vt5(A) {
  let Q = Date.now(),
    B;
  try {
    B = _t5(XZ0(Pt5(), "claude-cdn-dark-read-")), await Bc2(A, B, Qc2);
    let G = Date.now() - Q;
    GA("tengu_native_cdn_dark_read_success", {
      latency_ms: G
    }), g(`CDN dark read succeeded for ${A}`)
  } catch (G) {
    let Z = Date.now() - Q,
      I = G instanceof Error ? G.message : String(G),
      Y;
    if (YQ.isAxiosError(G) && G.response) Y = G.response.status;
    GA("tengu_native_cdn_dark_read_failure", {
      latency_ms: Z,
      http_status: Y,
      is_timeout: I.includes("timeout"),
      is_checksum_mismatch: I.includes("Checksum mismatch")
    }), AA(Error(`CDN dark read failed for ${A}: ${I}`))
  } finally {
    if (B) try {
      let G = iTA(by());
      St5(XZ0(B, G)), kt5(B)
    } catch {}
  }
}
// @from(Start 12404505, End 12406279)
async function Bc2(A, Q, B, G) {
  let Z = RA(),
    I = B === Qc2,
    Y = B === H71;
  if (Z.existsSync(Q)) Z.rmSync(Q, {
    recursive: !0,
    force: !0
  });
  let J = by(),
    W = Date.now();
  GA("tengu_binary_download_attempt", {
    is_cdn: I,
    is_gcs: Y
  });
  let X;
  try {
    X = (await YQ.get(`${B}/${A}/manifest.json`, {
      timeout: 1e4,
      responseType: "json",
      ...G
    })).data
  } catch (C) {
    let E = Date.now() - W,
      U = C instanceof Error ? C.message : String(C),
      q;
    if (YQ.isAxiosError(C) && C.response) q = C.response.status;
    throw GA("tengu_binary_manifest_fetch_failure", {
      latency_ms: E,
      http_status: q,
      is_cdn: I,
      is_gcs: Y,
      is_timeout: U.includes("timeout")
    }), AA(Error(`Failed to fetch manifest from ${B}/${A}/manifest.json: ${U}`)), C
  }
  let V = X.platforms[J];
  if (!V) throw GA("tengu_binary_platform_not_found", {
    is_cdn: I,
    is_gcs: Y
  }), Error(`Platform ${J} not found in manifest for version ${A}`);
  let F = V.checksum,
    K = iTA(J),
    D = `${B}/${A}/${J}/${K}`;
  Z.mkdirSync(Q);
  let H = XZ0(Q, K);
  try {
    await xt5(D, F, H, G || {});
    let C = Date.now() - W;
    GA("tengu_binary_download_success", {
      latency_ms: C,
      is_cdn: I,
      is_gcs: Y
    })
  } catch (C) {
    let E = Date.now() - W,
      U = C instanceof Error ? C.message : String(C),
      q;
    if (YQ.isAxiosError(C) && C.response) q = C.response.status;
    throw GA("tengu_binary_download_failure", {
      latency_ms: E,
      http_status: q,
      is_cdn: I,
      is_gcs: Y,
      is_timeout: U.includes("timeout"),
      is_checksum_mismatch: U.includes("Checksum mismatch")
    }), AA(Error(`Failed to download binary from ${D}: ${U}`)), C
  }
}
// @from(Start 12406280, End 12406356)
async function Gc2(A, Q) {
  return vt5(A), await Bc2(A, Q, H71), "binary"
}
// @from(Start 12406361, End 12406417)
Qc2 = "https://downloads.claude.ai/claude-code-releases"
// @from(Start 12406421, End 12406534)
H71 = "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases"
// @from(Start 12406540, End 12406614)
Zc2 = L(() => {
  O3();
  AQ();
  _8();
  V0();
  q0();
  FZ0();
  g1()
})
// @from(Start 12406943, End 12407353)
function by() {
  let A = d0.platform,
    Q = process.arch === "x64" ? "x64" : process.arch === "arm64" ? "arm64" : null;
  if (!Q) {
    let B = Error(`Unsupported architecture: ${process.arch}`);
    throw g(`Native installer does not support architecture: ${process.arch}`, {
      level: "error"
    }), B
  }
  if (A === "linux" && WU.isMuslEnvironment()) return `linux-${Q}-musl`;
  return `${A}-${Q}`
}
// @from(Start 12407355, End 12407431)
function iTA(A) {
  return A.startsWith("win32") ? "claude.exe" : "claude"
}
// @from(Start 12407433, End 12407660)
function p0A() {
  let A = by(),
    Q = iTA(A);
  return {
    versions: dW(td2(), "claude", "versions"),
    staging: dW(od2(), "claude", "staging"),
    locks: dW(rd2(), "claude", "locks"),
    executable: dW(ed2(), Q)
  }
}
// @from(Start 12407662, End 12407873)
function eWA(A) {
  let Q = RA();
  if (!Q.existsSync(A)) return !1;
  let B = Q.statSync(A);
  if (!B.isFile() || B.size === 0) return !1;
  try {
    return ht5(A, ut5.X_OK), !0
  } catch {
    return !1
  }
}
// @from(Start 12407875, End 12408281)
function HZ0(A) {
  let Q = p0A(),
    B = RA();
  [Q.versions, Q.staging, Q.locks].forEach((Y) => {
    if (!B.existsSync(Y)) B.mkdirSync(Y)
  });
  let Z = fy(Q.executable);
  if (!B.existsSync(Z)) B.mkdirSync(Z);
  let I = dW(Q.versions, A);
  if (!B.existsSync(I)) B.writeFileSync(I, "", {
    flush: !0,
    encoding: "utf8"
  });
  return {
    stagingPath: dW(Q.staging, A),
    installPath: I
  }
}
// @from(Start 12408282, End 12409063)
async function KZ0(A, Q, B = 0) {
  let G = p0A(),
    Z = RA(),
    I = Wc2(G, A);
  if (!Z.existsSync(G.locks)) Z.mkdirSync(G.locks);
  let Y = null;
  try {
    try {
      Y = await DZ0.default.lock(A, {
        stale: 60000,
        retries: {
          retries: B,
          minTimeout: B > 0 ? 1000 : 100,
          maxTimeout: B > 0 ? 5000 : 500
        },
        lockfilePath: I,
        onCompromised: (J) => {
          g(`NON-FATAL: Version lock was compromised during operation: ${J.message}`, {
            level: "info"
          })
        }
      })
    } catch (J) {
      return Xc2(A, J), !1
    }
    try {
      return await Q(), !0
    } catch (J) {
      throw AA(J instanceof Error ? J : Error(String(J))), J
    }
  } finally {
    if (Y) await Y()
  }
}
// @from(Start 12409065, End 12409368)
function Jc2(A, Q) {
  let B = RA();
  if (!B.existsSync(fy(Q))) B.mkdirSync(fy(Q));
  let G = `${Q}.tmp.${process.pid}.${Date.now()}`;
  try {
    B.copyFileSync(A, G), gt5(G, 493), B.renameSync(G, Q)
  } catch (Z) {
    try {
      if (B.existsSync(G)) B.unlinkSync(G)
    } catch {}
    throw Z
  }
}
// @from(Start 12409370, End 12410420)
function it5(A, Q) {
  let B = RA();
  try {
    let G = dW(A, "node_modules", "@anthropic-ai"),
      I = B.readdirStringSync(G).find((J) => J.startsWith("claude-cli-native-"));
    if (!I) throw GA("tengu_native_install_package_failure", {
      stage_find_package: !0,
      error_package_not_found: !0
    }), Error("Could not find platform-specific native package");
    let Y = dW(G, I, "cli");
    if (!B.existsSync(Y)) throw GA("tengu_native_install_package_failure", {
      stage_binary_exists: !0,
      error_binary_not_found: !0
    }), Error(`Native binary not found at ${Y}`);
    Jc2(Y, Q), B.rmSync(A, {
      recursive: !0,
      force: !0
    }), GA("tengu_native_install_package_success", {})
  } catch (G) {
    let Z = G instanceof Error ? G.message : String(G);
    if (!Z.includes("Could not find platform-specific") && !Z.includes("Native binary not found")) GA("tengu_native_install_package_failure", {
      stage_atomic_move: !0,
      error_move_failed: !0
    });
    throw AA(G instanceof Error ? G : Error(Z)), G
  }
}
// @from(Start 12410422, End 12411118)
function nt5(A, Q) {
  let B = RA();
  try {
    let G = by(),
      Z = iTA(G),
      I = dW(A, Z);
    if (!B.existsSync(I)) throw GA("tengu_native_install_binary_failure", {
      stage_binary_exists: !0,
      error_binary_not_found: !0
    }), Error(`Staged binary not found at ${I}`);
    Jc2(I, Q), B.rmSync(A, {
      recursive: !0,
      force: !0
    }), GA("tengu_native_install_binary_success", {})
  } catch (G) {
    let Z = G instanceof Error ? G.message : String(G);
    if (!Z.includes("Staged binary not found")) GA("tengu_native_install_binary_failure", {
      stage_atomic_move: !0,
      error_move_failed: !0
    });
    throw AA(G instanceof Error ? G : Error(Z)), G
  }
}
// @from(Start 12411120, End 12411250)
function at5(A, Q) {
  let {
    stagingPath: B,
    installPath: G
  } = HZ0(A);
  if (Q === "npm") it5(B, G);
  else nt5(B, G)
}
// @from(Start 12411252, End 12411328)
function st5(A) {
  let {
    installPath: Q
  } = HZ0(A);
  return eWA(Q)
}
// @from(Start 12411329, End 12412202)
async function rt5(A, Q = !1) {
  let B = Date.now(),
    G = await VZ0(A),
    {
      installPath: Z,
      stagingPath: I
    } = HZ0(G);
  g(`Checking for native installer update to version ${G}`);
  let Y = !1,
    J = await KZ0(Z, async () => {
      if (!st5(G) || Q) {
        Y = !0, g(Q ? `Force reinstalling native installer version ${G}` : `Downloading native installer version ${G}`);
        let V = await Gc2(G, I);
        at5(G, V)
      } else g(`Version ${G} already installed, updating symlink`);
      let X = p0A();
      ot5(X.executable), tt5(X.executable, Z)
    }, 3),
    W = Date.now() - B;
  if (!J) return GA("tengu_native_update_lock_failed", {
    latency_ms: W
  }), !1;
  return GA("tengu_native_update_complete", {
    latency_ms: W,
    was_new_install: Y,
    was_force_reinstall: Q
  }), g(`Successfully updated to version ${G}`), !0
}
// @from(Start 12412204, End 12412507)
function ot5(A) {
  let Q = RA();
  try {
    if (Q.existsSync(A)) {
      if (Q.statSync(A).isDirectory()) {
        if (Q.readdirStringSync(A).length === 0) Q.rmdirSync(A), g(`Removed empty directory at ${A}`)
      }
    }
  } catch (B) {
    g(`Could not remove empty directory at ${A}: ${B}`)
  }
}
// @from(Start 12412509, End 12414214)
function tt5(A, Q) {
  let B = RA();
  if (by().startsWith("win32")) try {
    let J = fy(A);
    if (!B.existsSync(J)) B.mkdirSync(J);
    if (B.existsSync(A)) {
      try {
        let X = B.statSync(A),
          V = B.statSync(Q);
        if (X.size === V.size) return !1
      } catch {}
      let W = `${A}.old.${Date.now()}`;
      B.renameSync(A, W);
      try {
        B.copyFileSync(Q, A);
        try {
          B.unlinkSync(W)
        } catch {}
      } catch (X) {
        try {
          B.renameSync(W, A)
        } catch (V) {
          let F = Error(`Failed to restore old executable: ${V}`, {
            cause: X
          });
          throw AA(F), F
        }
        throw X
      }
    } else {
      if (!B.existsSync(Q)) throw Error(`Source file does not exist: ${Q}`);
      B.copyFileSync(Q, A)
    }
    return !0
  } catch (J) {
    return AA(Error(`Failed to copy executable from ${Q} to ${A}: ${J}`)), !1
  }
  let I = fy(A);
  if (!B.existsSync(I)) try {
    B.mkdirSync(I), g(`Created directory ${I} for symlink`)
  } catch (J) {
    return AA(Error(`Failed to create directory ${I}: ${J}`)), !1
  }
  try {
    if (B.existsSync(A)) {
      try {
        let J = B.readlinkSync(A),
          W = hy(fy(A), J),
          X = hy(Q);
        if (W === X) return !1
      } catch {}
      B.unlinkSync(A)
    }
  } catch (J) {
    AA(Error(`Failed to check/remove existing symlink: ${J}`))
  }
  let Y = `${A}.tmp.${process.pid}.${Date.now()}`;
  try {
    return B.symlinkSync(Q, Y), B.renameSync(Y, A), !0
  } catch (J) {
    try {
      if (B.existsSync(Y)) B.unlinkSync(Y)
    } catch {}
    return AA(Error(`Failed to create symlink from ${A} to ${Q}: ${J}`)), !1
  }
}
// @from(Start 12414215, End 12414336)
async function nTA() {
  if (N1().installMethod === "native") return !0;
  return await hX("tengu_native_installation")
}
// @from(Start 12414337, End 12416690)
async function gy(A = !1) {
  if (Y0(process.env.DISABLE_INSTALLATION_CHECKS)) return [];
  let Q = await Nk(),
    B = N1();
  if (!(A || Q === "native" || B.installMethod === "native")) return [];
  let Z = RA(),
    I = p0A(),
    Y = [],
    J = fy(I.executable),
    W = hy(J),
    V = by().startsWith("win32");
  if (!Z.existsSync(J)) Y.push({
    message: `installMethod is native, but directory ${J} does not exist`,
    userActionRequired: !0,
    type: "error"
  });
  if (!Z.existsSync(I.executable)) Y.push({
    message: `installMethod is native, but claude command not found at ${I.executable}`,
    userActionRequired: !0,
    type: "error"
  });
  else if (!V) try {
    let K = Z.readlinkSync(I.executable),
      D = hy(fy(I.executable), K);
    if (!Z.existsSync(D)) Y.push({
      message: `Claude symlink points to non-existent file: ${K}`,
      userActionRequired: !0,
      type: "error"
    });
    else if (!eWA(D)) Y.push({
      message: `Claude symlink points to invalid binary: ${K}`,
      userActionRequired: !0,
      type: "error"
    })
  } catch {
    if (!eWA(I.executable)) Y.push({
      message: `${I.executable} exists but is not a valid Claude binary`,
      userActionRequired: !0,
      type: "error"
    })
  } else if (!eWA(I.executable)) Y.push({
    message: `${I.executable} exists but is not a valid Claude binary`,
    userActionRequired: !0,
    type: "error"
  });
  if (!(process.env.PATH || "").split(bt5).some((K) => {
      try {
        let D = hy(K);
        if (V) return D.toLowerCase() === W.toLowerCase();
        return D === W
      } catch {
        return !1
      }
    }))
    if (V) {
      let K = J.replace(/\//g, "\\");
      Y.push({
        message: `Native installation exists but ${K} is not in your PATH. Add it by opening: System Properties → Environment Variables → Edit User PATH → New → Add the path above. Then restart your terminal.`,
        userActionRequired: !0,
        type: "path"
      })
    } else {
      let K = GIA(),
        H = fl()[K],
        C = H ? H.replace(Yc2(), "~") : "your shell config file";
      Y.push({
        message: `Native installation exists but ~/.local/bin is not in your PATH. Run:

echo 'export PATH="$HOME/.local/bin:$PATH"' >> ${C} && source ${C}`,
        userActionRequired: !0,
        type: "path"
      })
    } return Y
}
// @from(Start 12416691, End 12417323)
async function Wg(A = !1, Q, B = !1) {
  if (!A && !await nTA()) return {
    latestVersion: null,
    wasUpdated: !1
  };
  let G = await VZ0(Q),
    Z = await rt5(Q, B);
  if (!Z) return {
    latestVersion: null,
    wasUpdated: !1,
    lockFailed: !0
  };
  if (G || Z) {
    let I = N1();
    if (I.installMethod !== "native") c0({
      ...I,
      installMethod: "native",
      autoUpdates: !1,
      autoUpdatesProtectedForNative: !0
    }), g('Native installer: Set installMethod to "native" and disabled legacy auto-updater for protection')
  }
  return {
    latestVersion: G,
    wasUpdated: Z,
    lockFailed: !1
  }
}
// @from(Start 12417325, End 12417533)
function et5(A) {
  let Q = RA();
  try {
    if (Q.existsSync(A)) {
      let B = Q.readlinkSync(A),
        G = hy(fy(A), B);
      if (Q.existsSync(G) && eWA(G)) return G
    }
  } catch {}
  return null
}
// @from(Start 12417535, End 12417609)
function Wc2(A, Q) {
  let B = ft5(Q);
  return dW(A.locks, `${B}.lock`)
}
// @from(Start 12417610, End 12418530)
async function CZ0() {
  let A = p0A();
  if (!process.execPath.includes(A.versions)) return;
  try {
    let Q = hy(process.execPath),
      B = Wc2(A, Q),
      G = RA();
    if (!G.existsSync(A.locks)) G.mkdirSync(A.locks);
    if (!G.existsSync(Q)) {
      g(`Cannot lock current version - file does not exist: ${Q}`, {
        level: "info"
      });
      return
    }
    try {
      await DZ0.default.lock(Q, {
        stale: 60000,
        retries: 0,
        lockfilePath: B,
        onCompromised: (Z) => {
          g(`NON-FATAL: Lock on running version was compromised: ${Z.message}`, {
            level: "info"
          })
        }
      })
    } catch (Z) {
      Xc2(Q, Z);
      return
    }
    g(`Acquired lock on running version: ${Q}`)
  } catch (Q) {
    g(`NON-FATAL: Failed to lock current version during execution ${Q instanceof Error?Q.message:String(Q)}`, {
      level: "info"
    })
  }
}
// @from(Start 12418532, End 12418742)
function Xc2(A, Q) {
  let B = `NON-FATAL: Lock acquisition failed for ${A} (expected in multi-process scenarios)`,
    G = Q instanceof Error ? Error(B, {
      cause: Q
    }) : Error(`${B}: ${Q}`);
  AA(G)
}
// @from(Start 12418743, End 12421997)
async function EZ0() {
  if (await Promise.resolve(), !await nTA()) return;
  let A = RA(),
    Q = p0A();
  if (by().startsWith("win32")) try {
    let G = fy(Q.executable);
    if (A.existsSync(G)) {
      let I = A.readdirStringSync(G).filter((J) => J.startsWith("claude.exe.old.") && J.match(/claude\.exe\.old\.\d+$/)),
        Y = 0;
      for (let J of I) try {
        let W = dW(G, J);
        A.unlinkSync(W), Y++
      } catch {}
      if (Y > 0) g(`Cleaned up ${Y} old Windows executables on startup`)
    }
  } catch (G) {
    g(`Failed to clean up old Windows executables: ${G}`)
  }
  if (A.existsSync(Q.staging)) try {
    let G = A.readdirStringSync(Q.staging),
      Z = Date.now() - 3600000,
      I = 0;
    for (let Y of G) {
      let J = dW(Q.staging, Y);
      try {
        if (A.statSync(J).mtime.getTime() < Z) A.rmSync(J, {
          recursive: !0,
          force: !0
        }), I++, g(`Cleaned up old staging directory: ${Y}`)
      } catch {}
    }
    if (I > 0) g(`Cleaned up ${I} orphaned staging directories`), GA("tengu_native_staging_cleanup", {
      cleaned_count: I
    })
  } catch (G) {
    g(`Failed to clean up staging directories: ${G}`)
  }
  if (A.existsSync(Q.versions)) try {
    let G = A.readdirStringSync(Q.versions),
      Z = Date.now() - 3600000,
      I = 0;
    for (let Y of G)
      if (Y.match(/\.tmp\.\d+\.\d+$/)) {
        let J = dW(Q.versions, Y);
        try {
          if (A.statSync(J).mtime.getTime() < Z) A.unlinkSync(J), I++, g(`Cleaned up orphaned temp install file: ${Y}`)
        } catch {}
      } if (I > 0) g(`Cleaned up ${I} orphaned temp install files`), GA("tengu_native_temp_files_cleanup", {
      cleaned_count: I
    })
  } catch (G) {
    g(`Failed to clean up temp install files: ${G}`)
  }
  if (!A.existsSync(Q.versions)) return;
  try {
    let G = A.readdirStringSync(Q.versions).filter((F) => {
        let K = dW(Q.versions, F);
        try {
          let D = A.statSync(K);
          return D.isFile() && (D.size === 0 || eWA(K))
        } catch {
          return !1
        }
      }),
      Z = process.execPath,
      I = Z && Z.includes(Q.versions) ? hy(Z) : null,
      Y = new Set([...I ? [I] : []]),
      J = et5(Q.executable);
    if (J) Y.add(J);
    for (let F of G) {
      let K = hy(Q.versions, F);
      if (Y.has(K)) continue;
      if (!await KZ0(K, () => {})) Y.add(K), g(`Protecting locked version from cleanup: ${F}`)
    }
    let W = G.map((F) => {
        let K = hy(Q.versions, F);
        return {
          name: F,
          path: K,
          mtime: A.statSync(K).mtime
        }
      }).filter((F) => !Y.has(F.path)).sort((F, K) => K.mtime.getTime() - F.mtime.getTime()),
      X = W.slice(lt5);
    if (X.length === 0) return;
    let V = 0;
    for (let F of X) try {
      if (await KZ0(F.path, () => {
          A.unlinkSync(F.path)
        })) V++;
      else g(`Skipping deletion of ${F.name} - locked by another process`)
    } catch (K) {
      AA(Error(`Failed to delete version ${F.name}: ${K}`))
    }
    if (V > 0) GA("tengu_native_version_cleanup", {
      deleted_count: V,
      protected_count: Y.size,
      retained_count: W.length - V
    })
  } catch (G) {
    AA(Error(`Version cleanup failed: ${G}`))
  }
}
// @from(Start 12421999, End 12422131)
function Ae5(A) {
  let Q = A;
  if (dt5(A).isSymbolicLink()) Q = ct5(A);
  return Q.endsWith(".js") || Q.includes("node_modules")
}
// @from(Start 12422133, End 12422481)
function aTA() {
  let A = p0A();
  try {
    if (!mt5(A.executable)) return;
    if (Ae5(A.executable)) {
      g(`Skipping removal of ${A.executable} - appears to be npm-managed`);
      return
    }
    pt5(A.executable), g(`Removed claude symlink at ${A.executable}`)
  } catch (Q) {
    AA(Error(`Failed to remove claude symlink: ${Q}`))
  }
}
// @from(Start 12422483, End 12423081)
function sTA() {
  let A = [],
    Q = fl();
  for (let [B, G] of Object.entries(Q)) try {
    let Z = iNA(G);
    if (!Z) continue;
    let {
      filtered: I,
      hadAlias: Y
    } = C01(Z);
    if (Y) E01(G, I), A.push({
      message: `Removed claude alias from ${G}. Run: unalias claude`,
      userActionRequired: !0,
      type: "alias"
    }), g(`Cleaned up claude alias from ${B} config`)
  } catch (Z) {
    AA(Z instanceof Error ? Z : Error(String(Z))), A.push({
      message: `Failed to clean up ${G}: ${Z}`,
      userActionRequired: !1,
      type: "error"
    })
  }
  return A
}
// @from(Start 12423082, End 12424461)
async function Qe5(A) {
  try {
    let Q = await A3("npm", ["config", "get", "prefix"]);
    if (Q.code !== 0 || !Q.stdout) return {
      success: !1,
      error: "Failed to get npm global prefix"
    };
    let B = Q.stdout.trim(),
      G = RA(),
      Z = !1;
    if (by() === "windows") {
      let I = dW(B, "claude.cmd"),
        Y = dW(B, "claude.ps1"),
        J = dW(B, "claude");
      if (G.existsSync(I)) G.unlinkSync(I), g(`Manually removed bin script: ${I}`), Z = !0;
      if (G.existsSync(Y)) G.unlinkSync(Y), g(`Manually removed PowerShell script: ${Y}`), Z = !0;
      if (G.existsSync(J)) G.unlinkSync(J), g(`Manually removed bin executable: ${J}`), Z = !0
    } else {
      let I = dW(B, "bin", "claude");
      if (G.existsSync(I)) G.unlinkSync(I), g(`Manually removed bin symlink: ${I}`), Z = !0
    }
    if (Z) {
      g(`Successfully removed ${A} manually`);
      let I = by() === "windows" ? dW(B, "node_modules", A) : dW(B, "lib", "node_modules", A);
      return {
        success: !0,
        warning: `${A} executables removed, but node_modules directory was left intact for safety. You may manually delete it later at: ${I}`
      }
    } else return {
      success: !1
    }
  } catch (Q) {
    return g(`Manual removal failed: ${Q}`, {
      level: "error"
    }), {
      success: !1,
      error: `Manual removal failed: ${Q}`
    }
  }
}
// @from(Start 12424462, End 12425465)
async function Ic2(A) {
  let {
    code: Q,
    stderr: B
  } = await A3("npm", ["uninstall", "-g", A], {
    cwd: RA().cwd()
  });
  if (Q === 0) return g(`Removed global npm installation of ${A}`), {
    success: !0
  };
  else if (B && !B.includes("npm ERR! code E404")) {
    if (B.includes("npm error code ENOTEMPTY")) {
      g(`Failed to uninstall global npm package ${A}: ${B}`, {
        level: "error"
      }), g("Attempting manual removal due to ENOTEMPTY error");
      let G = await Qe5(A);
      if (G.success) return {
        success: !0,
        warning: G.warning
      };
      else if (G.error) return {
        success: !1,
        error: `Failed to remove global npm installation of ${A}: ${B}. Manual removal also failed: ${G.error}`
      }
    }
    return g(`Failed to uninstall global npm package ${A}: ${B}`, {
      level: "error"
    }), {
      success: !1,
      error: `Failed to remove global npm installation of ${A}: ${B}`
    }
  }
  return {
    success: !1
  }
}
// @from(Start 12425466, End 12427224)
async function rTA() {
  let A = [],
    Q = [],
    B = 0,
    G = await Ic2("@anthropic-ai/claude-code");
  if (G.success) {
    if (B++, G.warning) Q.push(G.warning)
  } else if (G.error) A.push(G.error);
  if ({
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.0.59",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
    }.PACKAGE_URL && {
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.0.59",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
    }.PACKAGE_URL !== "@anthropic-ai/claude-code") {
    let Y = await Ic2({
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.0.59",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
    }.PACKAGE_URL);
    if (Y.success) {
      if (B++, Y.warning) Q.push(Y.warning)
    } else if (Y.error) A.push(Y.error)
  }
  let Z = RA(),
    I = dW(Yc2(), ".claude", "local");
  if (Z.existsSync(I)) try {
    Z.rmSync(I, {
      recursive: !0,
      force: !0
    }), B++, g(`Removed local installation at ${I}`)
  } catch (Y) {
    A.push(`Failed to remove ${I}: ${Y}`), g(`Failed to remove local installation: ${Y}`, {
      level: "error"
    })
  }
  return {
    removed: B,
    errors: A,
    warnings: Q
  }
}
// @from(Start 12427229, End 12427232)
DZ0
// @from(Start 12427234, End 12427241)
lt5 = 2
// @from(Start 12427247, End 12427410)
FZ0 = L(() => {
  c5();
  It();
  AQ();
  _8();
  u2();
  g1();
  q0();
  V0();
  Ac2();
  jQ();
  z01();
  xAA();
  Zc2();
  Zh();
  hQ();
  DZ0 = BA(T4A(), 1)
})
// @from(Start 12427416, End 12427441)
uy = L(() => {
  FZ0()
})
// @from(Start 12427444, End 12427555)
function Vc2(A) {
  return `${AXA.major(A,{loose:!0})}.${AXA.minor(A,{loose:!0})}.${AXA.patch(A,{loose:!0})}`
}
// @from(Start 12427557, End 12428008)
function C71(A, Q = {
  ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
  PACKAGE_URL: "@anthropic-ai/claude-code",
  README_URL: "https://code.claude.com/docs/en/overview",
  VERSION: "2.0.59",
  FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
}.VERSION) {
  let [B, G] = Fc2.useState(() => Vc2(Q));
  if (!A) return null;
  let Z = Vc2(A);
  if (Z !== B) return G(Z), Z;
  return null
}
// @from(Start 12428013, End 12428016)
Fc2
// @from(Start 12428018, End 12428021)
AXA
// @from(Start 12428027, End 12428084)
zZ0 = L(() => {
  Fc2 = BA(VA(), 1), AXA = BA(KU(), 1)
})
// @from(Start 12428087, End 12432023)
function Dc2({
  isUpdating: A,
  onChangeIsUpdating: Q,
  onAutoUpdaterResult: B,
  autoUpdaterResult: G,
  showSuccessMessage: Z,
  verbose: I
}) {
  let [Y, J] = E71.useState({}), W = C71(G?.version), X = E3.useCallback(async () => {
    if (A) return;
    let V = {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.0.59",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
      }.VERSION,
      F = await bAA(),
      K = fb();
    if (J({
        global: V,
        latest: F
      }), !K && V && F && !Kc2.gte(V, F, {
        loose: !0
      })) {
      let D = Date.now();
      Q(!0);
      let H = N1();
      if (H.installMethod !== "native") aTA();
      let C = await Nk();
      if (g(`AutoUpdater: Detected installation type: ${C}`), C === "development") {
        g("AutoUpdater: Cannot auto-update development build"), Q(!1);
        return
      }
      let E, U;
      if (C === "npm-local") g("AutoUpdater: Using local update method"), U = "local", E = await lNA();
      else if (C === "npm-global") g("AutoUpdater: Using global update method"), U = "global", E = await nNA();
      else if (C === "native") {
        g("AutoUpdater: Unexpected native installation in non-native updater"), Q(!1);
        return
      } else {
        g("AutoUpdater: Unknown installation type, falling back to config");
        let q = H.installMethod === "local";
        if (U = q ? "local" : "global", q) E = await lNA();
        else E = await nNA()
      }
      if (Q(!1), E === "success") St(), GA("tengu_auto_updater_success", {
        fromVersion: V,
        toVersion: F,
        durationMs: Date.now() - D,
        wasMigrated: U === "local",
        installationType: C
      });
      else GA("tengu_auto_updater_fail", {
        fromVersion: V,
        attemptedVersion: F,
        status: E,
        durationMs: Date.now() - D,
        wasMigrated: U === "local",
        installationType: C
      });
      B({
        version: F,
        status: E
      })
    }
  }, [B]);
  if (E71.useEffect(() => {
      X()
    }, [X]), CI(X, 1800000), !G?.version && (!Y.global || !Y.latest)) return null;
  if (!G?.version && !A) return null;
  return E3.createElement(S, {
    flexDirection: "row",
    gap: 1
  }, I && E3.createElement($, {
    dimColor: !0
  }, "globalVersion: ", Y.global, " · latestVersion:", " ", Y.latest), A ? E3.createElement(E3.Fragment, null, E3.createElement(S, null, E3.createElement($, {
    color: "text",
    dimColor: !0,
    wrap: "end"
  }, "Auto-updating…"))) : G?.status === "success" && Z && W && E3.createElement($, {
    color: "success"
  }, "✓ Update installed · Restart to apply"), (G?.status === "install_failed" || G?.status === "no_permissions") && E3.createElement($, {
    color: "error"
  }, "✗ Auto-update failed · Try ", E3.createElement($, {
    bold: !0
  }, "claude doctor"), !bl() && E3.createElement(E3.Fragment, null, " ", "or ", E3.createElement($, {
    bold: !0
  }, "npm i -g ", {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.0.59",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
  }.PACKAGE_URL)), bl() && E3.createElement(E3.Fragment, null, " ", "or", " ", E3.createElement($, {
    bold: !0
  }, "cd ~/.claude/local && npm update ", {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.0.59",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
  }.PACKAGE_URL))))
}
// @from(Start 12432028, End 12432030)
E3
// @from(Start 12432032, End 12432035)
Kc2
// @from(Start 12432037, End 12432040)
E71
// @from(Start 12432046, End 12432212)
Hc2 = L(() => {
  hA();
  jQ();
  ZIA();
  xAA();
  uy();
  JE();
  u2();
  q0();
  zZ0();
  Zh();
  V0();
  E3 = BA(VA(), 1), Kc2 = BA(KU(), 1), E71 = BA(VA(), 1)
})
// @from(Start 12432215, End 12432729)
function Be5(A) {
  if (A.includes("timeout")) return "timeout";
  if (A.includes("Checksum mismatch")) return "checksum_mismatch";
  if (A.includes("ENOENT") || A.includes("not found")) return "not_found";
  if (A.includes("EACCES") || A.includes("permission")) return "permission_denied";
  if (A.includes("ENOSPC")) return "disk_full";
  if (A.includes("npm")) return "npm_error";
  if (A.includes("network") || A.includes("ECONNREFUSED") || A.includes("ENOTFOUND")) return "network_error";
  return "unknown"
}
// @from(Start 12432731, End 12435461)
function Cc2({
  isUpdating: A,
  onChangeIsUpdating: Q,
  onAutoUpdaterResult: B,
  autoUpdaterResult: G,
  showSuccessMessage: Z,
  verbose: I
}) {
  let [Y, J] = z71.useState({}), W = C71(G?.version), X = sV.useRef(!1), V = sV.useCallback(async () => {
    if (A || fb()) return;
    Q(!0);
    let F = Date.now();
    GA("tengu_native_auto_updater_start", {});
    try {
      let K = await Wg(),
        D = {
          ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
          PACKAGE_URL: "@anthropic-ai/claude-code",
          README_URL: "https://code.claude.com/docs/en/overview",
          VERSION: "2.0.59",
          FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
        }.VERSION,
        H = Date.now() - F;
      if (K.lockFailed) {
        GA("tengu_native_auto_updater_lock_contention", {
          latency_ms: H
        });
        return
      }
      if (J({
          current: D,
          latest: K.latestVersion
        }), K.wasUpdated) St(), GA("tengu_native_auto_updater_success", {
        latency_ms: H
      }), B({
        version: K.latestVersion,
        status: "success"
      });
      else GA("tengu_native_auto_updater_up_to_date", {
        latency_ms: H
      })
    } catch (K) {
      let D = Date.now() - F,
        H = K instanceof Error ? K.message : String(K);
      AA(K instanceof Error ? K : Error(String(K)));
      let C = Be5(H);
      GA("tengu_native_auto_updater_fail", {
        latency_ms: D,
        error_timeout: C === "timeout",
        error_checksum: C === "checksum_mismatch",
        error_not_found: C === "not_found",
        error_permission: C === "permission_denied",
        error_disk_full: C === "disk_full",
        error_npm: C === "npm_error",
        error_network: C === "network_error"
      }), B({
        version: null,
        status: "install_failed"
      })
    } finally {
      Q(!1)
    }
  }, [A, Q, B]);
  if (z71.useEffect(() => {
      if (!X.current) X.current = !0, V()
    }), CI(V, 1800000), !G?.version && (!Y.current || !Y.latest)) return null;
  if (!G?.version && !A) return null;
  return sV.createElement(S, {
    flexDirection: "row",
    gap: 1
  }, I && sV.createElement($, {
    dimColor: !0
  }, "current: ", Y.current, " · latest: ", Y.latest), A ? sV.createElement(S, null, sV.createElement($, {
    dimColor: !0,
    wrap: "end"
  }, "Checking for updates")) : G?.status === "success" && Z && W && sV.createElement($, {
    color: "success"
  }, "✓ Update installed · Restart to update"), G?.status === "install_failed" && sV.createElement($, {
    color: "error"
  }, "✗ Auto-update failed · Try ", sV.createElement($, {
    bold: !0
  }, "/status")))
}
// @from(Start 12435466, End 12435468)
sV
// @from(Start 12435470, End 12435473)
z71
// @from(Start 12435479, End 12435600)
Ec2 = L(() => {
  hA();
  jQ();
  uy();
  JE();
  u2();
  q0();
  g1();
  zZ0();
  sV = BA(VA(), 1), z71 = BA(VA(), 1)
})
// @from(Start 12435603, End 12437245)
function $c2({
  verbose: A
}) {
  let [Q, B] = Uc2.useState(!1), G = IIA(), Z = CC.useCallback(async () => {
    if (fb()) return;
    let Y = await bAA(),
      J = Y && !zc2.gte({
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.0.59",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
      }.VERSION, Y, {
        loose: !0
      });
    if (B(!!J), J) g(`PackageManagerAutoUpdater: Update available ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.VERSION} -> ${Y}`)
  }, []);
  if (CC.useEffect(() => {
      Z()
    }, [Z]), CI(Z, 1800000), !Q) return null;
  let I = G === "homebrew" ? "brew upgrade claude-code" : "your package manager update command";
  return CC.createElement(CC.Fragment, null, A && CC.createElement($, {
    dimColor: !0
  }, "currentVersion: ", {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.0.59",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
  }.VERSION), CC.createElement($, {
    color: "warning"
  }, "Update available! Run: ", CC.createElement($, {
    bold: !0
  }, I)))
}
// @from(Start 12437250, End 12437252)
CC
// @from(Start 12437254, End 12437257)
zc2
// @from(Start 12437259, End 12437262)
Uc2
// @from(Start 12437268, End 12437393)
wc2 = L(() => {
  hA();
  ZIA();
  JE();
  V0();
  w01();
  jQ();
  CC = BA(VA(), 1), zc2 = BA(KU(), 1), Uc2 = BA(VA(), 1)
})
// @from(Start 12437395, End 12437743)
async function U71() {
  let A = process.argv.includes("-p") || process.argv.includes("--print");
  if (await Nk() === "development") return !1;
  if (!await hX("auto_migrate_to_native")) return !1;
  if (Y0(!1) || !1 || A || Y0(process.env.DISABLE_AUTO_MIGRATE_TO_NATIVE)) return !1;
  if (N1().installMethod === "native") return !1;
  return !0
}
// @from(Start 12437744, End 12439559)
async function qc2() {
  GA("tengu_auto_migrate_to_native_attempt", {});
  try {
    let A = await Wg(!0),
      Q = [];
    if (A.latestVersion) {
      GA("tengu_auto_migrate_to_native_success", {}), g("✅ Upgraded to native installation. Future sessions will use the native version.");
      let {
        removed: G,
        errors: Z,
        warnings: I
      } = await rTA(), Y = [];
      if (Z.length > 0) Z.forEach((X) => {
        Y.push({
          message: X,
          userActionRequired: !1,
          type: "error"
        })
      });
      if (I.length > 0) I.forEach((X) => {
        Y.push({
          message: X,
          userActionRequired: !1,
          type: "info"
        })
      });
      if (G > 0) Y.push({
        message: `Cleaned up ${G} old npm installation(s)`,
        userActionRequired: !1,
        type: "info"
      });
      let J = sTA();
      Q = [...await gy(!0), ...J, ...Y]
    } else GA("tengu_auto_migrate_to_native_partial", {}), g("⚠️ Native installation setup encountered issues but cleanup completed."), Q = await gy(!0);
    let B = [];
    if (Q.length > 0) {
      let G = Q.filter((Z) => Z.userActionRequired);
      if (G.length > 0) {
        let Z = ["⚠️  Manual action required after migration to native installer:", ...G.map((I) => `• ${I.message}`)].join(`
`);
        B.push(Z)
      }
      g("Migration completed with the following notes:"), Q.forEach((Z) => {
        g(`  • [${Z.type}] ${Z.message}`)
      })
    }
    return {
      success: !0,
      version: A.latestVersion,
      notifications: B.length > 0 ? B : void 0
    }
  } catch (A) {
    return GA("tengu_auto_migrate_to_native_failure", {
      error: A instanceof Error ? A.message : String(A)
    }), AA(A instanceof Error ? A : Error(String(A))), {
      success: !1
    }
  }
}
// @from(Start 12439564, End 12439645)
UZ0 = L(() => {
  uy();
  u2();
  q0();
  g1();
  V0();
  hQ();
  Zh();
  jQ()
})
// @from(Start 12439648, End 12441455)
function Nc2({
  onMigrationComplete: A,
  onChangeIsUpdating: Q,
  onAutoUpdaterResult: B,
  verbose: G
}) {
  let [Z, I] = $71.useState("checking"), Y = Xg.useRef(!1);
  if ($71.useEffect(() => {
      async function J() {
        if (Y.current) return;
        Y.current = !0;
        try {
          if (!await U71()) {
            I("idle");
            return
          }
          if (G) g("Starting auto-migration from npm to native installation");
          GA("tengu_auto_migrate_to_native_ui_shown", {}), I("migrating"), Q?.(!0);
          let X = await qc2();
          if (X.success) I("success"), GA("tengu_auto_migrate_to_native_ui_success", {}), B?.({
            status: "success",
            version: X.version,
            notifications: X.notifications
          }), setTimeout(() => {
            I("idle"), Q?.(!1), A?.()
          }, 5000);
          else I("error"), GA("tengu_auto_migrate_to_native_ui_error", {}), B?.({
            status: "install_failed",
            version: null
          }), setTimeout(() => {
            I("idle"), Q?.(!1)
          }, 1e4)
        } catch (W) {
          AA(W instanceof Error ? W : Error(String(W))), I("error"), B?.({
            status: "install_failed",
            version: null
          }), setTimeout(() => {
            I("idle"), Q?.(!1)
          }, 1e4)
        }
      }
      J()
    }, [A, Q, B, G]), Z === "idle" || Z === "checking") return null;
  if (Z === "migrating") return Xg.createElement($, {
    dimColor: !0
  }, "Migrating to native installation…");
  if (Z === "success") return Xg.createElement($, {
    color: "success"
  }, H1.tick, " Migrated to native installation");
  if (Z === "error") return Xg.createElement($, {
    color: "error"
  }, "Migration failed · Run /doctor for details");
  return null
}
// @from(Start 12441460, End 12441462)
Xg
// @from(Start 12441464, End 12441467)
$71
// @from(Start 12441473, End 12441578)
Lc2 = L(() => {
  hA();
  V9();
  UZ0();
  q0();
  g1();
  V0();
  Xg = BA(VA(), 1), $71 = BA(VA(), 1)
})
// @from(Start 12441581, End 12442938)
function Mc2({
  isUpdating: A,
  onChangeIsUpdating: Q,
  onAutoUpdaterResult: B,
  autoUpdaterResult: G,
  showSuccessMessage: Z,
  verbose: I
}) {
  let [Y, J] = dq.useState(null), [W, X] = dq.useState(null), [V, F] = dq.useState(null);
  if (dq.useEffect(() => {
      async function D() {
        let H = await Nk(),
          C = H === "native",
          E = H === "package-manager";
        if (g(`AutoUpdaterWrapper: Installation type: ${H}`), J(C), X(E), !C && !E) {
          let U = await U71();
          F(U)
        } else F(!1)
      }
      D()
    }, []), Y === null || V === null || W === null) return null;
  if (W) return dq.createElement($c2, {
    verbose: I,
    onAutoUpdaterResult: B,
    autoUpdaterResult: G,
    isUpdating: A,
    onChangeIsUpdating: Q,
    showSuccessMessage: Z
  });
  if (!Y && V) return dq.createElement(Nc2, {
    onMigrationComplete: async () => {
      try {
        let H = await Nk() === "native";
        J(H), F(!1)
      } catch (D) {
        g(`Error checking installation type after migration: ${D}`), J(!0), F(!1)
      }
    },
    onChangeIsUpdating: Q,
    onAutoUpdaterResult: B,
    verbose: I
  });
  return dq.createElement(Y ? Cc2 : Dc2, {
    verbose: I,
    onAutoUpdaterResult: B,
    autoUpdaterResult: G,
    isUpdating: A,
    onChangeIsUpdating: Q,
    showSuccessMessage: Z
  })
}
// @from(Start 12442943, End 12442945)
dq
// @from(Start 12442951, End 12443049)
Oc2 = L(() => {
  Hc2();
  Ec2();
  wc2();
  Lc2();
  Zh();
  V0();
  UZ0();
  dq = BA(VA(), 1)
})
// @from(Start 12443055, End 12445085)
RO = z((jc2) => {
  Object.defineProperty(jc2, "__esModule", {
    value: !0
  });
  var Rc2 = Object.prototype.toString;

  function Ge5(A) {
    switch (Rc2.call(A)) {
      case "[object Error]":
      case "[object Exception]":
      case "[object DOMException]":
        return !0;
      default:
        return w71(A, Error)
    }
  }

  function QXA(A, Q) {
    return Rc2.call(A) === `[object ${Q}]`
  }

  function Ze5(A) {
    return QXA(A, "ErrorEvent")
  }

  function Ie5(A) {
    return QXA(A, "DOMError")
  }

  function Ye5(A) {
    return QXA(A, "DOMException")
  }

  function Je5(A) {
    return QXA(A, "String")
  }

  function Tc2(A) {
    return typeof A === "object" && A !== null && "__sentry_template_string__" in A && "__sentry_template_values__" in A
  }

  function We5(A) {
    return A === null || Tc2(A) || typeof A !== "object" && typeof A !== "function"
  }

  function Pc2(A) {
    return QXA(A, "Object")
  }

  function Xe5(A) {
    return typeof Event < "u" && w71(A, Event)
  }

  function Ve5(A) {
    return typeof Element < "u" && w71(A, Element)
  }

  function Fe5(A) {
    return QXA(A, "RegExp")
  }

  function Ke5(A) {
    return Boolean(A && A.then && typeof A.then === "function")
  }

  function De5(A) {
    return Pc2(A) && "nativeEvent" in A && "preventDefault" in A && "stopPropagation" in A
  }

  function He5(A) {
    return typeof A === "number" && A !== A
  }

  function w71(A, Q) {
    try {
      return A instanceof Q
    } catch (B) {
      return !1
    }
  }

  function Ce5(A) {
    return !!(typeof A === "object" && A !== null && (A.__isVue || A._isVue))
  }
  jc2.isDOMError = Ie5;
  jc2.isDOMException = Ye5;
  jc2.isElement = Ve5;
  jc2.isError = Ge5;
  jc2.isErrorEvent = Ze5;
  jc2.isEvent = Xe5;
  jc2.isInstanceOf = w71;
  jc2.isNaN = He5;
  jc2.isParameterizedString = Tc2;
  jc2.isPlainObject = Pc2;
  jc2.isPrimitive = We5;
  jc2.isRegExp = Fe5;
  jc2.isString = Je5;
  jc2.isSyntheticEvent = De5;
  jc2.isThenable = Ke5;
  jc2.isVueViewModel = Ce5
})
// @from(Start 12445091, End 12446454)
oTA = z((_c2) => {
  Object.defineProperty(_c2, "__esModule", {
    value: !0
  });
  var q71 = RO();

  function ke5(A, Q = 0) {
    if (typeof A !== "string" || Q === 0) return A;
    return A.length <= Q ? A : `${A.slice(0,Q)}...`
  }

  function ye5(A, Q) {
    let B = A,
      G = B.length;
    if (G <= 150) return B;
    if (Q > G) Q = G;
    let Z = Math.max(Q - 60, 0);
    if (Z < 5) Z = 0;
    let I = Math.min(Z + 140, G);
    if (I > G - 5) I = G;
    if (I === G) Z = Math.max(I - 140, 0);
    if (B = B.slice(Z, I), Z > 0) B = `'{snip} ${B}`;
    if (I < G) B += " {snip}";
    return B
  }

  function xe5(A, Q) {
    if (!Array.isArray(A)) return "";
    let B = [];
    for (let G = 0; G < A.length; G++) {
      let Z = A[G];
      try {
        if (q71.isVueViewModel(Z)) B.push("[VueViewModel]");
        else B.push(String(Z))
      } catch (I) {
        B.push("[value cannot be serialized]")
      }
    }
    return B.join(Q)
  }

  function Sc2(A, Q, B = !1) {
    if (!q71.isString(A)) return !1;
    if (q71.isRegExp(Q)) return Q.test(A);
    if (q71.isString(Q)) return B ? A === Q : A.includes(Q);
    return !1
  }

  function ve5(A, Q = [], B = !1) {
    return Q.some((G) => Sc2(A, G, B))
  }
  _c2.isMatchingPattern = Sc2;
  _c2.safeJoin = xe5;
  _c2.snipLine = ye5;
  _c2.stringMatchesSomePattern = ve5;
  _c2.truncate = ke5
})
// @from(Start 12446460, End 12448176)
vc2 = z((xc2) => {
  Object.defineProperty(xc2, "__esModule", {
    value: !0
  });
  var $Z0 = RO(),
    me5 = oTA();

  function de5(A, Q, B = 250, G, Z, I, Y) {
    if (!I.exception || !I.exception.values || !Y || !$Z0.isInstanceOf(Y.originalException, Error)) return;
    let J = I.exception.values.length > 0 ? I.exception.values[I.exception.values.length - 1] : void 0;
    if (J) I.exception.values = ce5(wZ0(A, Q, Z, Y.originalException, G, I.exception.values, J, 0), B)
  }

  function wZ0(A, Q, B, G, Z, I, Y, J) {
    if (I.length >= B + 1) return I;
    let W = [...I];
    if ($Z0.isInstanceOf(G[Z], Error)) {
      kc2(Y, J);
      let X = A(Q, G[Z]),
        V = W.length;
      yc2(X, Z, V, J), W = wZ0(A, Q, B, G[Z], Z, [X, ...W], X, V)
    }
    if (Array.isArray(G.errors)) G.errors.forEach((X, V) => {
      if ($Z0.isInstanceOf(X, Error)) {
        kc2(Y, J);
        let F = A(Q, X),
          K = W.length;
        yc2(F, `errors[${V}]`, K, J), W = wZ0(A, Q, B, X, Z, [F, ...W], F, K)
      }
    });
    return W
  }

  function kc2(A, Q) {
    A.mechanism = A.mechanism || {
      type: "generic",
      handled: !0
    }, A.mechanism = {
      ...A.mechanism,
      ...A.type === "AggregateError" && {
        is_exception_group: !0
      },
      exception_id: Q
    }
  }

  function yc2(A, Q, B, G) {
    A.mechanism = A.mechanism || {
      type: "generic",
      handled: !0
    }, A.mechanism = {
      ...A.mechanism,
      type: "chained",
      source: Q,
      exception_id: B,
      parent_id: G
    }
  }

  function ce5(A, Q) {
    return A.map((B) => {
      if (B.value) B.value = me5.truncate(B.value, Q);
      return B
    })
  }
  xc2.applyAggregateErrorsToEvent = de5
})
// @from(Start 12448182, End 12448823)
EC = z((bc2) => {
  Object.defineProperty(bc2, "__esModule", {
    value: !0
  });

  function N71(A) {
    return A && A.Math == Math ? A : void 0
  }
  var qZ0 = typeof globalThis == "object" && N71(globalThis) || typeof window == "object" && N71(window) || typeof self == "object" && N71(self) || typeof global == "object" && N71(global) || function() {
    return this
  }() || {};

  function le5() {
    return qZ0
  }

  function ie5(A, Q, B) {
    let G = B || qZ0,
      Z = G.__SENTRY__ = G.__SENTRY__ || {};
    return Z[A] || (Z[A] = Q())
  }
  bc2.GLOBAL_OBJ = qZ0;
  bc2.getGlobalObject = le5;
  bc2.getGlobalSingleton = ie5
})
// @from(Start 12448829, End 12451093)
NZ0 = z((fc2) => {
  Object.defineProperty(fc2, "__esModule", {
    value: !0
  });
  var re5 = RO(),
    oe5 = EC(),
    BXA = oe5.getGlobalObject(),
    te5 = 80;

  function ee5(A, Q = {}) {
    if (!A) return "<unknown>";
    try {
      let B = A,
        G = 5,
        Z = [],
        I = 0,
        Y = 0,
        J = " > ",
        W = J.length,
        X, V = Array.isArray(Q) ? Q : Q.keyAttrs,
        F = !Array.isArray(Q) && Q.maxStringLength || te5;
      while (B && I++ < G) {
        if (X = AA3(B, V), X === "html" || I > 1 && Y + Z.length * W + X.length >= F) break;
        Z.push(X), Y += X.length, B = B.parentNode
      }
      return Z.reverse().join(J)
    } catch (B) {
      return "<unknown>"
    }
  }

  function AA3(A, Q) {
    let B = A,
      G = [],
      Z, I, Y, J, W;
    if (!B || !B.tagName) return "";
    if (BXA.HTMLElement) {
      if (B instanceof HTMLElement && B.dataset && B.dataset.sentryComponent) return B.dataset.sentryComponent
    }
    G.push(B.tagName.toLowerCase());
    let X = Q && Q.length ? Q.filter((F) => B.getAttribute(F)).map((F) => [F, B.getAttribute(F)]) : null;
    if (X && X.length) X.forEach((F) => {
      G.push(`[${F[0]}="${F[1]}"]`)
    });
    else {
      if (B.id) G.push(`#${B.id}`);
      if (Z = B.className, Z && re5.isString(Z)) {
        I = Z.split(/\s+/);
        for (W = 0; W < I.length; W++) G.push(`.${I[W]}`)
      }
    }
    let V = ["aria-label", "type", "name", "title", "alt"];
    for (W = 0; W < V.length; W++)
      if (Y = V[W], J = B.getAttribute(Y), J) G.push(`[${Y}="${J}"]`);
    return G.join("")
  }

  function QA3() {
    try {
      return BXA.document.location.href
    } catch (A) {
      return ""
    }
  }

  function BA3(A) {
    if (BXA.document && BXA.document.querySelector) return BXA.document.querySelector(A);
    return null
  }

  function GA3(A) {
    if (!BXA.HTMLElement) return null;
    let Q = A,
      B = 5;
    for (let G = 0; G < B; G++) {
      if (!Q) return null;
      if (Q instanceof HTMLElement && Q.dataset.sentryComponent) return Q.dataset.sentryComponent;
      Q = Q.parentNode
    }
    return null
  }
  fc2.getComponentName = GA3;
  fc2.getDomElement = BA3;
  fc2.getLocationHref = QA3;
  fc2.htmlTreeAsString = ee5
})
// @from(Start 12451099, End 12451271)
my = z((hc2) => {
  Object.defineProperty(hc2, "__esModule", {
    value: !0
  });
  var WA3 = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__;
  hc2.DEBUG_BUILD = WA3
})
// @from(Start 12451277, End 12452451)
pP = z((uc2) => {
  Object.defineProperty(uc2, "__esModule", {
    value: !0
  });
  var VA3 = my(),
    LZ0 = EC(),
    FA3 = "Sentry Logger ",
    MZ0 = ["debug", "info", "warn", "error", "log", "assert", "trace"],
    OZ0 = {};

  function gc2(A) {
    if (!("console" in LZ0.GLOBAL_OBJ)) return A();
    let Q = LZ0.GLOBAL_OBJ.console,
      B = {},
      G = Object.keys(OZ0);
    G.forEach((Z) => {
      let I = OZ0[Z];
      B[Z] = Q[Z], Q[Z] = I
    });
    try {
      return A()
    } finally {
      G.forEach((Z) => {
        Q[Z] = B[Z]
      })
    }
  }

  function KA3() {
    let A = !1,
      Q = {
        enable: () => {
          A = !0
        },
        disable: () => {
          A = !1
        },
        isEnabled: () => A
      };
    if (VA3.DEBUG_BUILD) MZ0.forEach((B) => {
      Q[B] = (...G) => {
        if (A) gc2(() => {
          LZ0.GLOBAL_OBJ.console[B](`${FA3}[${B}]:`, ...G)
        })
      }
    });
    else MZ0.forEach((B) => {
      Q[B] = () => {
        return
      }
    });
    return Q
  }
  var DA3 = KA3();
  uc2.CONSOLE_LEVELS = MZ0;
  uc2.consoleSandbox = gc2;
  uc2.logger = DA3;
  uc2.originalConsoleMethods = OZ0
})
// @from(Start 12452457, End 12454584)
RZ0 = z((cc2) => {
  Object.defineProperty(cc2, "__esModule", {
    value: !0
  });
  var UA3 = my(),
    tTA = pP(),
    $A3 = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+)?)?@)([\w.-]+)(?::(\d+))?\/(.+)/;

  function wA3(A) {
    return A === "http" || A === "https"
  }

  function qA3(A, Q = !1) {
    let {
      host: B,
      path: G,
      pass: Z,
      port: I,
      projectId: Y,
      protocol: J,
      publicKey: W
    } = A;
    return `${J}://${W}${Q&&Z?`:${Z}`:""}@${B}${I?`:${I}`:""}/${G?`${G}/`:G}${Y}`
  }

  function mc2(A) {
    let Q = $A3.exec(A);
    if (!Q) {
      tTA.consoleSandbox(() => {
        console.error(`Invalid Sentry Dsn: ${A}`)
      });
      return
    }
    let [B, G, Z = "", I, Y = "", J] = Q.slice(1), W = "", X = J, V = X.split("/");
    if (V.length > 1) W = V.slice(0, -1).join("/"), X = V.pop();
    if (X) {
      let F = X.match(/^\d+/);
      if (F) X = F[0]
    }
    return dc2({
      host: I,
      pass: Z,
      path: W,
      projectId: X,
      port: Y,
      protocol: B,
      publicKey: G
    })
  }

  function dc2(A) {
    return {
      protocol: A.protocol,
      publicKey: A.publicKey || "",
      pass: A.pass || "",
      host: A.host,
      port: A.port || "",
      path: A.path || "",
      projectId: A.projectId
    }
  }

  function NA3(A) {
    if (!UA3.DEBUG_BUILD) return !0;
    let {
      port: Q,
      projectId: B,
      protocol: G
    } = A;
    if (["protocol", "publicKey", "host", "projectId"].find((Y) => {
        if (!A[Y]) return tTA.logger.error(`Invalid Sentry Dsn: ${Y} missing`), !0;
        return !1
      })) return !1;
    if (!B.match(/^\d+$/)) return tTA.logger.error(`Invalid Sentry Dsn: Invalid projectId ${B}`), !1;
    if (!wA3(G)) return tTA.logger.error(`Invalid Sentry Dsn: Invalid protocol ${G}`), !1;
    if (Q && isNaN(parseInt(Q, 10))) return tTA.logger.error(`Invalid Sentry Dsn: Invalid port ${Q}`), !1;
    return !0
  }

  function LA3(A) {
    let Q = typeof A === "string" ? mc2(A) : dc2(A);
    if (!Q || !NA3(Q)) return;
    return Q
  }
  cc2.dsnFromString = mc2;
  cc2.dsnToString = qA3;
  cc2.makeDsn = LA3
})
// @from(Start 12454590, End 12454931)
TZ0 = z((lc2) => {
  Object.defineProperty(lc2, "__esModule", {
    value: !0
  });
  class pc2 extends Error {
    constructor(A, Q = "warn") {
      super(A);
      this.message = A, this.name = new.target.prototype.constructor.name, Object.setPrototypeOf(this, new.target.prototype), this.logLevel = Q
    }
  }
  lc2.SentryError = pc2
})
// @from(Start 12454937, End 12458476)
TO = z((tc2) => {
  Object.defineProperty(tc2, "__esModule", {
    value: !0
  });
  var PA3 = NZ0(),
    jA3 = my(),
    GXA = RO(),
    SA3 = pP(),
    ic2 = oTA();

  function _A3(A, Q, B) {
    if (!(Q in A)) return;
    let G = A[Q],
      Z = B(G);
    if (typeof Z === "function") rc2(Z, G);
    A[Q] = Z
  }

  function sc2(A, Q, B) {
    try {
      Object.defineProperty(A, Q, {
        value: B,
        writable: !0,
        configurable: !0
      })
    } catch (G) {
      jA3.DEBUG_BUILD && SA3.logger.log(`Failed to add non-enumerable property "${Q}" to object`, A)
    }
  }

  function rc2(A, Q) {
    try {
      let B = Q.prototype || {};
      A.prototype = Q.prototype = B, sc2(A, "__sentry_original__", Q)
    } catch (B) {}
  }

  function kA3(A) {
    return A.__sentry_original__
  }

  function yA3(A) {
    return Object.keys(A).map((Q) => `${encodeURIComponent(Q)}=${encodeURIComponent(A[Q])}`).join("&")
  }

  function oc2(A) {
    if (GXA.isError(A)) return {
      message: A.message,
      name: A.name,
      stack: A.stack,
      ...ac2(A)
    };
    else if (GXA.isEvent(A)) {
      let Q = {
        type: A.type,
        target: nc2(A.target),
        currentTarget: nc2(A.currentTarget),
        ...ac2(A)
      };
      if (typeof CustomEvent < "u" && GXA.isInstanceOf(A, CustomEvent)) Q.detail = A.detail;
      return Q
    } else return A
  }

  function nc2(A) {
    try {
      return GXA.isElement(A) ? PA3.htmlTreeAsString(A) : Object.prototype.toString.call(A)
    } catch (Q) {
      return "<unknown>"
    }
  }

  function ac2(A) {
    if (typeof A === "object" && A !== null) {
      let Q = {};
      for (let B in A)
        if (Object.prototype.hasOwnProperty.call(A, B)) Q[B] = A[B];
      return Q
    } else return {}
  }

  function xA3(A, Q = 40) {
    let B = Object.keys(oc2(A));
    if (B.sort(), !B.length) return "[object has no keys]";
    if (B[0].length >= Q) return ic2.truncate(B[0], Q);
    for (let G = B.length; G > 0; G--) {
      let Z = B.slice(0, G).join(", ");
      if (Z.length > Q) continue;
      if (G === B.length) return Z;
      return ic2.truncate(Z, Q)
    }
    return ""
  }

  function vA3(A) {
    return PZ0(A, new Map)
  }

  function PZ0(A, Q) {
    if (bA3(A)) {
      let B = Q.get(A);
      if (B !== void 0) return B;
      let G = {};
      Q.set(A, G);
      for (let Z of Object.keys(A))
        if (typeof A[Z] < "u") G[Z] = PZ0(A[Z], Q);
      return G
    }
    if (Array.isArray(A)) {
      let B = Q.get(A);
      if (B !== void 0) return B;
      let G = [];
      return Q.set(A, G), A.forEach((Z) => {
        G.push(PZ0(Z, Q))
      }), G
    }
    return A
  }

  function bA3(A) {
    if (!GXA.isPlainObject(A)) return !1;
    try {
      let Q = Object.getPrototypeOf(A).constructor.name;
      return !Q || Q === "Object"
    } catch (Q) {
      return !0
    }
  }

  function fA3(A) {
    let Q;
    switch (!0) {
      case (A === void 0 || A === null):
        Q = new String(A);
        break;
      case (typeof A === "symbol" || typeof A === "bigint"):
        Q = Object(A);
        break;
      case GXA.isPrimitive(A):
        Q = new A.constructor(A);
        break;
      default:
        Q = A;
        break
    }
    return Q
  }
  tc2.addNonEnumerableProperty = sc2;
  tc2.convertToPlainObject = oc2;
  tc2.dropUndefinedKeys = vA3;
  tc2.extractExceptionKeysForMessage = xA3;
  tc2.fill = _A3;
  tc2.getOriginalFunction = kA3;
  tc2.markFunctionWrapped = rc2;
  tc2.objectify = fA3;
  tc2.urlEncode = yA3
})
// @from(Start 12458482, End 12460065)
L71 = z((Ap2) => {
  Object.defineProperty(Ap2, "__esModule", {
    value: !0
  });

  function ec2(A, Q = !1) {
    return !(Q || A && !A.startsWith("/") && !A.match(/^[A-Z]:/) && !A.startsWith(".") && !A.match(/^[a-zA-Z]([a-zA-Z0-9.\-+])*:\/\//)) && A !== void 0 && !A.includes("node_modules/")
  }

  function nA3(A) {
    let Q = /^\s*[-]{4,}$/,
      B = /at (?:async )?(?:(.+?)\s+\()?(?:(.+):(\d+):(\d+)?|([^)]+))\)?/;
    return (G) => {
      let Z = G.match(B);
      if (Z) {
        let I, Y, J, W, X;
        if (Z[1]) {
          J = Z[1];
          let K = J.lastIndexOf(".");
          if (J[K - 1] === ".") K--;
          if (K > 0) {
            I = J.slice(0, K), Y = J.slice(K + 1);
            let D = I.indexOf(".Module");
            if (D > 0) J = J.slice(D + 1), I = I.slice(0, D)
          }
          W = void 0
        }
        if (Y) W = I, X = Y;
        if (Y === "<anonymous>") X = void 0, J = void 0;
        if (J === void 0) X = X || "<anonymous>", J = W ? `${W}.${X}` : X;
        let V = Z[2] && Z[2].startsWith("file://") ? Z[2].slice(7) : Z[2],
          F = Z[5] === "native";
        if (V && V.match(/\/[A-Z]:/)) V = V.slice(1);
        if (!V && Z[5] && !F) V = Z[5];
        return {
          filename: V,
          module: A ? A(V) : void 0,
          function: J,
          lineno: parseInt(Z[3], 10) || void 0,
          colno: parseInt(Z[4], 10) || void 0,
          in_app: ec2(V, F)
        }
      }
      if (G.match(Q)) return {
        filename: G
      };
      return
    }
  }
  Ap2.filenameIsInApp = ec2;
  Ap2.node = nA3
})
// @from(Start 12460071, End 12461818)
M71 = z((Jp2) => {
  Object.defineProperty(Jp2, "__esModule", {
    value: !0
  });
  var Gp2 = L71(),
    Zp2 = 50,
    Qp2 = /\(error: (.*)\)/,
    Bp2 = /captureMessage|captureException/;

  function Ip2(...A) {
    let Q = A.sort((B, G) => B[0] - G[0]).map((B) => B[1]);
    return (B, G = 0) => {
      let Z = [],
        I = B.split(`
`);
      for (let Y = G; Y < I.length; Y++) {
        let J = I[Y];
        if (J.length > 1024) continue;
        let W = Qp2.test(J) ? J.replace(Qp2, "$1") : J;
        if (W.match(/\S*Error: /)) continue;
        for (let X of Q) {
          let V = X(W);
          if (V) {
            Z.push(V);
            break
          }
        }
        if (Z.length >= Zp2) break
      }
      return Yp2(Z)
    }
  }

  function rA3(A) {
    if (Array.isArray(A)) return Ip2(...A);
    return A
  }

  function Yp2(A) {
    if (!A.length) return [];
    let Q = Array.from(A);
    if (/sentryWrapped/.test(Q[Q.length - 1].function || "")) Q.pop();
    if (Q.reverse(), Bp2.test(Q[Q.length - 1].function || "")) {
      if (Q.pop(), Bp2.test(Q[Q.length - 1].function || "")) Q.pop()
    }
    return Q.slice(0, Zp2).map((B) => ({
      ...B,
      filename: B.filename || Q[Q.length - 1].filename,
      function: B.function || "?"
    }))
  }
  var jZ0 = "<anonymous>";

  function oA3(A) {
    try {
      if (!A || typeof A !== "function") return jZ0;
      return A.name || jZ0
    } catch (Q) {
      return jZ0
    }
  }

  function tA3(A) {
    return [90, Gp2.node(A)]
  }
  Jp2.filenameIsInApp = Gp2.filenameIsInApp;
  Jp2.createStackParser = Ip2;
  Jp2.getFunctionName = oA3;
  Jp2.nodeStackLineParser = tA3;
  Jp2.stackParserFromStackParserOptions = rA3;
  Jp2.stripSentryFramesAndReverse = Yp2
})
// @from(Start 12461824, End 12462615)
Vg = z((Xp2) => {
  Object.defineProperty(Xp2, "__esModule", {
    value: !0
  });
  var I13 = my(),
    Y13 = pP(),
    J13 = M71(),
    ZXA = {},
    Wp2 = {};

  function W13(A, Q) {
    ZXA[A] = ZXA[A] || [], ZXA[A].push(Q)
  }

  function X13() {
    Object.keys(ZXA).forEach((A) => {
      ZXA[A] = void 0
    })
  }

  function V13(A, Q) {
    if (!Wp2[A]) Q(), Wp2[A] = !0
  }

  function F13(A, Q) {
    let B = A && ZXA[A];
    if (!B) return;
    for (let G of B) try {
      G(Q)
    } catch (Z) {
      I13.DEBUG_BUILD && Y13.logger.error(`Error while triggering instrumentation handler.
Type: ${A}
Name: ${J13.getFunctionName(G)}
Error:`, Z)
    }
  }
  Xp2.addHandler = W13;
  Xp2.maybeInstrument = V13;
  Xp2.resetInstrumentationHandlers = X13;
  Xp2.triggerHandlers = F13
})
// @from(Start 12462621, End 12463474)
kZ0 = z((Vp2) => {
  Object.defineProperty(Vp2, "__esModule", {
    value: !0
  });
  var SZ0 = pP(),
    E13 = TO(),
    O71 = EC(),
    _Z0 = Vg();

  function z13(A) {
    _Z0.addHandler("console", A), _Z0.maybeInstrument("console", U13)
  }

  function U13() {
    if (!("console" in O71.GLOBAL_OBJ)) return;
    SZ0.CONSOLE_LEVELS.forEach(function(A) {
      if (!(A in O71.GLOBAL_OBJ.console)) return;
      E13.fill(O71.GLOBAL_OBJ.console, A, function(Q) {
        return SZ0.originalConsoleMethods[A] = Q,
          function(...B) {
            let G = {
              args: B,
              level: A
            };
            _Z0.triggerHandlers("console", G);
            let Z = SZ0.originalConsoleMethods[A];
            Z && Z.apply(O71.GLOBAL_OBJ.console, B)
          }
      })
    })
  }
  Vp2.addConsoleInstrumentationHandler = z13
})
// @from(Start 12463480, End 12466429)
eTA = z((Kp2) => {
  Object.defineProperty(Kp2, "__esModule", {
    value: !0
  });
  var w13 = TO(),
    yZ0 = oTA(),
    q13 = EC();

  function N13() {
    let A = q13.GLOBAL_OBJ,
      Q = A.crypto || A.msCrypto,
      B = () => Math.random() * 16;
    try {
      if (Q && Q.randomUUID) return Q.randomUUID().replace(/-/g, "");
      if (Q && Q.getRandomValues) B = () => {
        let G = new Uint8Array(1);
        return Q.getRandomValues(G), G[0]
      }
    } catch (G) {}
    return ([1e7] + 1000 + 4000 + 8000 + 100000000000).replace(/[018]/g, (G) => (G ^ (B() & 15) >> G / 4).toString(16))
  }

  function Fp2(A) {
    return A.exception && A.exception.values ? A.exception.values[0] : void 0
  }

  function L13(A) {
    let {
      message: Q,
      event_id: B
    } = A;
    if (Q) return Q;
    let G = Fp2(A);
    if (G) {
      if (G.type && G.value) return `${G.type}: ${G.value}`;
      return G.type || G.value || B || "<unknown>"
    }
    return B || "<unknown>"
  }

  function M13(A, Q, B) {
    let G = A.exception = A.exception || {},
      Z = G.values = G.values || [],
      I = Z[0] = Z[0] || {};
    if (!I.value) I.value = Q || "";
    if (!I.type) I.type = B || "Error"
  }

  function O13(A, Q) {
    let B = Fp2(A);
    if (!B) return;
    let G = {
        type: "generic",
        handled: !0
      },
      Z = B.mechanism;
    if (B.mechanism = {
        ...G,
        ...Z,
        ...Q
      }, Q && "data" in Q) {
      let I = {
        ...Z && Z.data,
        ...Q.data
      };
      B.mechanism.data = I
    }
  }
  var R13 = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

  function T13(A) {
    let Q = A.match(R13) || [],
      B = parseInt(Q[1], 10),
      G = parseInt(Q[2], 10),
      Z = parseInt(Q[3], 10);
    return {
      buildmetadata: Q[5],
      major: isNaN(B) ? void 0 : B,
      minor: isNaN(G) ? void 0 : G,
      patch: isNaN(Z) ? void 0 : Z,
      prerelease: Q[4]
    }
  }

  function P13(A, Q, B = 5) {
    if (Q.lineno === void 0) return;
    let G = A.length,
      Z = Math.max(Math.min(G - 1, Q.lineno - 1), 0);
    Q.pre_context = A.slice(Math.max(0, Z - B), Z).map((I) => yZ0.snipLine(I, 0)), Q.context_line = yZ0.snipLine(A[Math.min(G - 1, Z)], Q.colno || 0), Q.post_context = A.slice(Math.min(Z + 1, G), Z + 1 + B).map((I) => yZ0.snipLine(I, 0))
  }

  function j13(A) {
    if (A && A.__sentry_captured__) return !0;
    try {
      w13.addNonEnumerableProperty(A, "__sentry_captured__", !0)
    } catch (Q) {}
    return !1
  }

  function S13(A) {
    return Array.isArray(A) ? A : [A]
  }
  Kp2.addContextToFrame = P13;
  Kp2.addExceptionMechanism = O13;
  Kp2.addExceptionTypeValue = M13;
  Kp2.arrayify = S13;
  Kp2.checkOrSetAlreadyCaught = j13;
  Kp2.getEventDescription = L13;
  Kp2.parseSemver = T13;
  Kp2.uuid4 = N13
})
// @from(Start 12466435, End 12469440)
fZ0 = z((Ep2) => {
  Object.defineProperty(Ep2, "__esModule", {
    value: !0
  });
  var g13 = eTA(),
    R71 = TO(),
    u13 = EC(),
    xZ0 = Vg(),
    IXA = u13.GLOBAL_OBJ,
    m13 = 1000,
    Dp2, vZ0, bZ0;

  function d13(A) {
    xZ0.addHandler("dom", A), xZ0.maybeInstrument("dom", Cp2)
  }

  function Cp2() {
    if (!IXA.document) return;
    let A = xZ0.triggerHandlers.bind(null, "dom"),
      Q = Hp2(A, !0);
    IXA.document.addEventListener("click", Q, !1), IXA.document.addEventListener("keypress", Q, !1), ["EventTarget", "Node"].forEach((B) => {
      let G = IXA[B] && IXA[B].prototype;
      if (!G || !G.hasOwnProperty || !G.hasOwnProperty("addEventListener")) return;
      R71.fill(G, "addEventListener", function(Z) {
        return function(I, Y, J) {
          if (I === "click" || I == "keypress") try {
            let W = this,
              X = W.__sentry_instrumentation_handlers__ = W.__sentry_instrumentation_handlers__ || {},
              V = X[I] = X[I] || {
                refCount: 0
              };
            if (!V.handler) {
              let F = Hp2(A);
              V.handler = F, Z.call(this, I, F, J)
            }
            V.refCount++
          } catch (W) {}
          return Z.call(this, I, Y, J)
        }
      }), R71.fill(G, "removeEventListener", function(Z) {
        return function(I, Y, J) {
          if (I === "click" || I == "keypress") try {
            let W = this,
              X = W.__sentry_instrumentation_handlers__ || {},
              V = X[I];
            if (V) {
              if (V.refCount--, V.refCount <= 0) Z.call(this, I, V.handler, J), V.handler = void 0, delete X[I];
              if (Object.keys(X).length === 0) delete W.__sentry_instrumentation_handlers__
            }
          } catch (W) {}
          return Z.call(this, I, Y, J)
        }
      })
    })
  }

  function c13(A) {
    if (A.type !== vZ0) return !1;
    try {
      if (!A.target || A.target._sentryId !== bZ0) return !1
    } catch (Q) {}
    return !0
  }

  function p13(A, Q) {
    if (A !== "keypress") return !1;
    if (!Q || !Q.tagName) return !0;
    if (Q.tagName === "INPUT" || Q.tagName === "TEXTAREA" || Q.isContentEditable) return !1;
    return !0
  }

  function Hp2(A, Q = !1) {
    return (B) => {
      if (!B || B._sentryCaptured) return;
      let G = l13(B);
      if (p13(B.type, G)) return;
      if (R71.addNonEnumerableProperty(B, "_sentryCaptured", !0), G && !G._sentryId) R71.addNonEnumerableProperty(G, "_sentryId", g13.uuid4());
      let Z = B.type === "keypress" ? "input" : B.type;
      if (!c13(B)) A({
        event: B,
        name: Z,
        global: Q
      }), vZ0 = B.type, bZ0 = G ? G._sentryId : void 0;
      clearTimeout(Dp2), Dp2 = IXA.setTimeout(() => {
        bZ0 = void 0, vZ0 = void 0
      }, m13)
    }
  }

  function l13(A) {
    try {
      return A.target
    } catch (Q) {
      return null
    }
  }
  Ep2.addClickKeypressInstrumentationHandler = d13;
  Ep2.instrumentDOM = Cp2
})
// @from(Start 12469446, End 12471312)
uZ0 = z((zp2) => {
  Object.defineProperty(zp2, "__esModule", {
    value: !0
  });
  var a13 = my(),
    s13 = pP(),
    r13 = EC(),
    T71 = r13.getGlobalObject();

  function o13() {
    try {
      return new ErrorEvent(""), !0
    } catch (A) {
      return !1
    }
  }

  function t13() {
    try {
      return new DOMError(""), !0
    } catch (A) {
      return !1
    }
  }

  function e13() {
    try {
      return new DOMException(""), !0
    } catch (A) {
      return !1
    }
  }

  function gZ0() {
    if (!("fetch" in T71)) return !1;
    try {
      return new Request("http://www.example.com"), !0
    } catch (A) {
      return !1
    }
  }

  function hZ0(A) {
    return A && /^function fetch\(\)\s+\{\s+\[native code\]\s+\}$/.test(A.toString())
  }

  function A03() {
    if (typeof EdgeRuntime === "string") return !0;
    if (!gZ0()) return !1;
    if (hZ0(T71.fetch)) return !0;
    let A = !1,
      Q = T71.document;
    if (Q && typeof Q.createElement === "function") try {
      let B = Q.createElement("iframe");
      if (B.hidden = !0, Q.head.appendChild(B), B.contentWindow && B.contentWindow.fetch) A = hZ0(B.contentWindow.fetch);
      Q.head.removeChild(B)
    } catch (B) {
      a13.DEBUG_BUILD && s13.logger.warn("Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ", B)
    }
    return A
  }

  function Q03() {
    return "ReportingObserver" in T71
  }

  function B03() {
    if (!gZ0()) return !1;
    try {
      return new Request("_", {
        referrerPolicy: "origin"
      }), !0
    } catch (A) {
      return !1
    }
  }
  zp2.isNativeFetch = hZ0;
  zp2.supportsDOMError = t13;
  zp2.supportsDOMException = e13;
  zp2.supportsErrorEvent = o13;
  zp2.supportsFetch = gZ0;
  zp2.supportsNativeFetch = A03;
  zp2.supportsReferrerPolicy = B03;
  zp2.supportsReportingObserver = Q03
})
// @from(Start 12471318, End 12473151)
dZ0 = z((qp2) => {
  Object.defineProperty(qp2, "__esModule", {
    value: !0
  });
  var F03 = TO(),
    K03 = uZ0(),
    Up2 = EC(),
    APA = Vg();

  function D03(A) {
    APA.addHandler("fetch", A), APA.maybeInstrument("fetch", H03)
  }

  function H03() {
    if (!K03.supportsNativeFetch()) return;
    F03.fill(Up2.GLOBAL_OBJ, "fetch", function(A) {
      return function(...Q) {
        let {
          method: B,
          url: G
        } = wp2(Q), Z = {
          args: Q,
          fetchData: {
            method: B,
            url: G
          },
          startTimestamp: Date.now()
        };
        return APA.triggerHandlers("fetch", {
          ...Z
        }), A.apply(Up2.GLOBAL_OBJ, Q).then((I) => {
          let Y = {
            ...Z,
            endTimestamp: Date.now(),
            response: I
          };
          return APA.triggerHandlers("fetch", Y), I
        }, (I) => {
          let Y = {
            ...Z,
            endTimestamp: Date.now(),
            error: I
          };
          throw APA.triggerHandlers("fetch", Y), I
        })
      }
    })
  }

  function mZ0(A, Q) {
    return !!A && typeof A === "object" && !!A[Q]
  }

  function $p2(A) {
    if (typeof A === "string") return A;
    if (!A) return "";
    if (mZ0(A, "url")) return A.url;
    if (A.toString) return A.toString();
    return ""
  }

  function wp2(A) {
    if (A.length === 0) return {
      method: "GET",
      url: ""
    };
    if (A.length === 2) {
      let [B, G] = A;
      return {
        url: $p2(B),
        method: mZ0(G, "method") ? String(G.method).toUpperCase() : "GET"
      }
    }
    let Q = A[0];
    return {
      url: $p2(Q),
      method: mZ0(Q, "method") ? String(Q.method).toUpperCase() : "GET"
    }
  }
  qp2.addFetchInstrumentationHandler = D03;
  qp2.parseFetchArgs = wp2
})
// @from(Start 12473157, End 12473836)
lZ0 = z((Np2) => {
  Object.defineProperty(Np2, "__esModule", {
    value: !0
  });
  var cZ0 = EC(),
    pZ0 = Vg(),
    P71 = null;

  function z03(A) {
    pZ0.addHandler("error", A), pZ0.maybeInstrument("error", U03)
  }

  function U03() {
    P71 = cZ0.GLOBAL_OBJ.onerror, cZ0.GLOBAL_OBJ.onerror = function(A, Q, B, G, Z) {
      let I = {
        column: G,
        error: Z,
        line: B,
        msg: A,
        url: Q
      };
      if (pZ0.triggerHandlers("error", I), P71 && !P71.__SENTRY_LOADER__) return P71.apply(this, arguments);
      return !1
    }, cZ0.GLOBAL_OBJ.onerror.__SENTRY_INSTRUMENTED__ = !0
  }
  Np2.addGlobalErrorInstrumentationHandler = z03
})
// @from(Start 12473842, End 12474507)
aZ0 = z((Lp2) => {
  Object.defineProperty(Lp2, "__esModule", {
    value: !0
  });
  var iZ0 = EC(),
    nZ0 = Vg(),
    j71 = null;

  function w03(A) {
    nZ0.addHandler("unhandledrejection", A), nZ0.maybeInstrument("unhandledrejection", q03)
  }

  function q03() {
    j71 = iZ0.GLOBAL_OBJ.onunhandledrejection, iZ0.GLOBAL_OBJ.onunhandledrejection = function(A) {
      let Q = A;
      if (nZ0.triggerHandlers("unhandledrejection", Q), j71 && !j71.__SENTRY_LOADER__) return j71.apply(this, arguments);
      return !0
    }, iZ0.GLOBAL_OBJ.onunhandledrejection.__SENTRY_INSTRUMENTED__ = !0
  }
  Lp2.addGlobalUnhandledRejectionInstrumentationHandler = w03
})
// @from(Start 12474513, End 12474869)
sZ0 = z((Mp2) => {
  Object.defineProperty(Mp2, "__esModule", {
    value: !0
  });
  var L03 = EC(),
    S71 = L03.getGlobalObject();

  function M03() {
    let A = S71.chrome,
      Q = A && A.app && A.app.runtime,
      B = "history" in S71 && !!S71.history.pushState && !!S71.history.replaceState;
    return !Q && B
  }
  Mp2.supportsHistory = M03
})
// @from(Start 12474875, End 12476025)
rZ0 = z((Rp2) => {
  Object.defineProperty(Rp2, "__esModule", {
    value: !0
  });
  var Op2 = TO();
  my();
  pP();
  var R03 = EC(),
    T03 = sZ0(),
    k71 = Vg(),
    QPA = R03.GLOBAL_OBJ,
    _71;

  function P03(A) {
    k71.addHandler("history", A), k71.maybeInstrument("history", j03)
  }

  function j03() {
    if (!T03.supportsHistory()) return;
    let A = QPA.onpopstate;
    QPA.onpopstate = function(...B) {
      let G = QPA.location.href,
        Z = _71;
      _71 = G;
      let I = {
        from: Z,
        to: G
      };
      if (k71.triggerHandlers("history", I), A) try {
        return A.apply(this, B)
      } catch (Y) {}
    };

    function Q(B) {
      return function(...G) {
        let Z = G.length > 2 ? G[2] : void 0;
        if (Z) {
          let I = _71,
            Y = String(Z);
          _71 = Y;
          let J = {
            from: I,
            to: Y
          };
          k71.triggerHandlers("history", J)
        }
        return B.apply(this, G)
      }
    }
    Op2.fill(QPA.history, "pushState", Q), Op2.fill(QPA.history, "replaceState", Q)
  }
  Rp2.addHistoryInstrumentationHandler = P03
})