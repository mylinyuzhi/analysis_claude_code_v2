
// @from(Start 11906008, End 11908827)
function if2({
  toolUseConfirm: A,
  onDone: Q,
  onReject: B,
  serverName: G,
  toolName: Z,
  args: I
}) {
  let Y = `${G} - ${Z}`,
    J = `mcp__${G}__${Z}`,
    W = F$.useMemo(() => ({
      ...A,
      tool: {
        ...A.tool,
        name: J,
        isMcp: !0
      }
    }), [A, J]),
    X = F$.useMemo(() => ({
      completion_type: "tool_use_single",
      language_name: "none"
    }), []);
  V$(W, X);
  let V = (D) => {
      switch (D) {
        case "yes":
          CY({
            completion_type: "tool_use_single",
            event: "accept",
            metadata: {
              language_name: "none",
              message_id: W.assistantMessage.message.id,
              platform: d0.platform
            }
          }), W.onAllow(W.input, []), Q();
          break;
        case "yes-dont-ask-again": {
          CY({
            completion_type: "tool_use_single",
            event: "accept",
            metadata: {
              language_name: "none",
              message_id: W.assistantMessage.message.id,
              platform: d0.platform
            }
          });
          let H = W.permissionResult.behavior === "ask" ? W.permissionResult.suggestions || [] : [];
          if (H.length === 0) AA(Error(`MCPCliPermissionRequest: No MCP suggestions found for ${G}/${Z}`)), W.onAllow(W.input, []);
          else W.onAllow(W.input, H);
          Q();
          break
        }
        case "no":
          CY({
            completion_type: "tool_use_single",
            event: "reject",
            metadata: {
              language_name: "none",
              message_id: W.assistantMessage.message.id,
              platform: d0.platform
            }
          }), W.onReject(), B(), Q();
          break
      }
    },
    F = uQ(),
    K = F$.useMemo(() => {
      return [{
        label: "Yes",
        value: "yes"
      }, {
        label: `Yes, and don't ask again for ${tA.bold(Y)} commands in ${tA.bold(F)}`,
        value: "yes-dont-ask-again"
      }, {
        label: `No, and tell Claude what to do differently ${tA.bold("(esc)")}`,
        value: "no"
      }]
    }, [Y, F]);
  return F$.default.createElement(uJ, {
    title: "Tool use"
  }, F$.default.createElement(S, {
    flexDirection: "column",
    paddingX: 2,
    paddingY: 1
  }, F$.default.createElement($, null, Y, "(", I || "{}", ")", F$.default.createElement($, {
    dimColor: !0
  }, " (MCP)")), F$.default.createElement($, {
    dimColor: !0
  }, W.description)), F$.default.createElement(S, {
    flexDirection: "column"
  }, F$.default.createElement(VC, {
    permissionResult: W.permissionResult,
    toolType: "tool"
  }), F$.default.createElement($, null, "Do you want to proceed?"), F$.default.createElement(M0, {
    options: K,
    onChange: V,
    onCancel: () => V("no")
  })))
}
// @from(Start 11908832, End 11908834)
F$
// @from(Start 11908840, End 11908957)
nf2 = L(() => {
  hA();
  J5();
  wO();
  xn();
  c5();
  _0();
  F9();
  vn();
  Gg();
  g1();
  F$ = BA(VA(), 1)
})
// @from(Start 11908960, End 11909644)
function af2(A) {
  let {
    toolUseConfirm: Q,
    toolUseContext: B,
    onDone: G,
    onReject: Z,
    verbose: I
  } = A, {
    command: Y,
    description: J
  } = D9.inputSchema.parse(Q.input), W = hAA(Y);
  if (W) {
    let {
      server: X,
      toolName: V,
      args: F
    } = W;
    return pG.default.createElement(if2, {
      toolUseConfirm: Q,
      toolUseContext: B,
      onDone: G,
      verbose: I,
      onReject: Z,
      serverName: X,
      toolName: V,
      args: F
    })
  }
  return pG.default.createElement(jn5, {
    toolUseConfirm: Q,
    toolUseContext: B,
    onDone: G,
    onReject: Z,
    verbose: I,
    command: Y,
    description: J
  })
}
// @from(Start 11909646, End 11912406)
function jn5({
  toolUseConfirm: A,
  toolUseContext: Q,
  onDone: B,
  onReject: G,
  verbose: Z,
  command: I,
  description: Y
}) {
  let [J] = qB(), [W, X] = pG.useState(!1), [V, F] = pG.useState(""), [K, D] = pG.useState(null), H = nQ.isSandboxingEnabled(), C = H && WIA(A.input), E = pG.useMemo(() => ({
    completion_type: "tool_use_single",
    language_name: "none"
  }), []);
  V$(A, E);
  let U = pG.useMemo(() => mf2({
    suggestions: A.permissionResult.behavior === "ask" ? A.permissionResult.suggestions : void 0,
    onRejectFeedbackChange: F
  }), [A]);
  f1((N, R) => {
    if (R.ctrl && N === "d") X((T) => !T)
  });

  function q(N) {
    let R = N?.trim();
    if (fn("tool_use_single", A, "reject", !!R), R) A.onReject(R);
    else A.onReject();
    G(), B()
  }

  function w(N) {
    switch (N) {
      case "yes":
        fn("tool_use_single", A, "accept"), A.onAllow(A.input, []), B();
        break;
      case "yes-apply-suggestions": {
        fn("tool_use_single", A, "accept");
        let T = A.permissionResult.behavior === "ask" ? A.permissionResult.suggestions || [] : [];
        A.onAllow(A.input, T), B();
        break
      }
      case "no": {
        if (V.trim() === "") {
          D("no");
          return
        }
        q(V);
        break
      }
    }
  }
  return pG.default.createElement(uJ, {
    title: H && !C ? "Bash command (unsandboxed)" : "Bash command"
  }, pG.default.createElement(S, {
    flexDirection: "column",
    paddingX: 2,
    paddingY: 1
  }, pG.default.createElement($, null, D9.renderToolUseMessage({
    command: I,
    description: Y
  }, {
    theme: J,
    verbose: !0
  })), pG.default.createElement($, {
    dimColor: !0
  }, A.description)), W ? pG.default.createElement(pG.default.Fragment, null, pG.default.createElement(pf2, {
    permissionResult: A.permissionResult
  }), A.toolUseContext.options.debug && pG.default.createElement(S, {
    justifyContent: "flex-end",
    marginTop: 1
  }, pG.default.createElement($, {
    dimColor: !0
  }, "Ctrl-D to hide debug info"))) : pG.default.createElement(pG.default.Fragment, null, pG.default.createElement(S, {
    flexDirection: "column"
  }, pG.default.createElement(VC, {
    permissionResult: A.permissionResult,
    toolType: "command"
  }), pG.default.createElement($, null, "Do you want to proceed?"), pG.default.createElement(M0, {
    options: U,
    onChange: w,
    onCancel: () => q(),
    onFocus: D,
    focusValue: K || void 0
  })), pG.default.createElement(S, {
    justifyContent: "space-between",
    marginTop: 1
  }, pG.default.createElement($, {
    dimColor: !0
  }, "Esc to exit"), A.toolUseContext.options.debug && pG.default.createElement($, {
    dimColor: !0
  }, "Ctrl+d to show debug info"))))
}
// @from(Start 11912411, End 11912413)
pG
// @from(Start 11912419, End 11912556)
sf2 = L(() => {
  hA();
  pF();
  vn();
  wO();
  R70();
  S5();
  df2();
  lf2();
  Gg();
  $J();
  nf2();
  dH();
  pG = BA(VA(), 1)
})
// @from(Start 11912559, End 11915278)
function F31({
  toolUseConfirm: A,
  onDone: Q,
  onReject: B,
  verbose: G
}) {
  let [Z] = qB(), I = A.tool.userFacingName(A.input), Y = I.endsWith(" (MCP)") ? I.slice(0, -6) : I, J = bq.useMemo(() => ({
    completion_type: "tool_use_single",
    language_name: "none"
  }), []);
  V$(A, J);
  let W = (F) => {
      switch (F) {
        case "yes":
          CY({
            completion_type: "tool_use_single",
            event: "accept",
            metadata: {
              language_name: "none",
              message_id: A.assistantMessage.message.id,
              platform: d0.platform
            }
          }), A.onAllow(A.input, []), Q();
          break;
        case "yes-dont-ask-again": {
          CY({
            completion_type: "tool_use_single",
            event: "accept",
            metadata: {
              language_name: "none",
              message_id: A.assistantMessage.message.id,
              platform: d0.platform
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
          CY({
            completion_type: "tool_use_single",
            event: "reject",
            metadata: {
              language_name: "none",
              message_id: A.assistantMessage.message.id,
              platform: d0.platform
            }
          }), A.onReject(), B(), Q();
          break
      }
    },
    X = uQ(),
    V = bq.useMemo(() => {
      return [{
        label: "Yes",
        value: "yes"
      }, {
        label: `Yes, and don't ask again for ${tA.bold(Y)} commands in ${tA.bold(X)}`,
        value: "yes-dont-ask-again"
      }, {
        label: `No, and tell Claude what to do differently ${tA.bold("(esc)")}`,
        value: "no"
      }]
    }, [Y, X]);
  return bq.default.createElement(uJ, {
    title: "Tool use"
  }, bq.default.createElement(S, {
    flexDirection: "column",
    paddingX: 2,
    paddingY: 1
  }, bq.default.createElement($, null, Y, "(", A.tool.renderToolUseMessage(A.input, {
    theme: Z,
    verbose: G
  }), ")", I.endsWith(" (MCP)") ? bq.default.createElement($, {
    dimColor: !0
  }, " (MCP)") : ""), bq.default.createElement($, {
    dimColor: !0
  }, A.description)), bq.default.createElement(S, {
    flexDirection: "column"
  }, bq.default.createElement(VC, {
    permissionResult: A.permissionResult,
    toolType: "tool"
  }), bq.default.createElement($, null, "Do you want to proceed?"), bq.default.createElement(M0, {
    options: V,
    onChange: W,
    onCancel: () => W("no")
  })))
}
// @from(Start 11915283, End 11915285)
bq
// @from(Start 11915291, End 11915400)
T70 = L(() => {
  hA();
  J5();
  wO();
  xn();
  c5();
  _0();
  F9();
  vn();
  Gg();
  bq = BA(VA(), 1)
})
// @from(Start 11915403, End 11915449)
function Sn5() {
  return Date.now() - zkA()
}
// @from(Start 11915451, End 11915489)
function _n5(A) {
  return Sn5() < A
}
// @from(Start 11915491, End 11915527)
function kn5(A) {
  return !_n5(A)
}
// @from(Start 11915529, End 11915836)
function K31(A, Q) {
  P70.useEffect(() => {
    yn5(), UFA()
  }, []), P70.useEffect(() => {
    let B = !1,
      G = setInterval(() => {
        if (kn5(rf2) && !B) B = !0, E0A({
          message: A,
          notificationType: Q
        })
      }, rf2);
    return () => clearTimeout(G)
  }, [A, Q])
}
// @from(Start 11915841, End 11915844)
P70
// @from(Start 11915846, End 11915856)
rf2 = 6000
// @from(Start 11915860, End 11915863)
yn5
// @from(Start 11915869, End 11915989)
j70 = L(() => {
  h61();
  l2();
  _0();
  jQ();
  P70 = BA(VA(), 1);
  yn5 = s1(() => process.stdin.on("data", UFA))
})
// @from(Start 11916052, End 11917114)
function of2({
  file_path: A,
  content: Q,
  verbose: B
}) {
  let G = D31.useMemo(() => RA().existsSync(A), [A]),
    Z = D31.useMemo(() => {
      if (!G) return "";
      let Y = CH(A);
      return RA().readFileSync(A, {
        encoding: Y
      })
    }, [A, G]),
    I = D31.useMemo(() => {
      if (!G) return null;
      return Uq({
        filePath: A,
        fileContents: Z,
        edits: [{
          old_string: Z,
          new_string: Q,
          replace_all: !1
        }]
      })
    }, [G, A, Z, Q]);
  return fq.createElement(S, {
    borderDimColor: !0,
    borderStyle: "round",
    flexDirection: "column",
    paddingX: 1
  }, fq.createElement(S, {
    paddingBottom: 1
  }, fq.createElement($, {
    bold: !0
  }, B ? A : vn5(W0(), A))), I ? dV(I.map((Y) => fq.createElement(J$, {
    key: Y.newStart,
    patch: Y,
    dim: !1,
    filePath: A
  })), (Y) => fq.createElement($, {
    dimColor: !0,
    key: `ellipsis-${Y}`
  }, "...")) : fq.createElement(CO, {
    code: Q || "(No content)",
    language: xn5(A).slice(1)
  }))
}
// @from(Start 11917119, End 11917121)
fq
// @from(Start 11917123, End 11917126)
D31
// @from(Start 11917132, End 11917245)
tf2 = L(() => {
  En();
  hA();
  U2();
  R9();
  FWA();
  Rh();
  AQ();
  fq = BA(VA(), 1), D31 = BA(VA(), 1)
})
// @from(Start 11917290, End 11918152)
function ef2(A) {
  let Q = (J) => {
      return QV.inputSchema.parse(J)
    },
    B = Q(A.toolUseConfirm.input),
    {
      file_path: G,
      content: Z
    } = B,
    I = x0A.useMemo(() => RA().existsSync(G), [G]),
    Y = I ? "overwrite" : "create";
  return x0A.default.createElement(bn, {
    toolUseConfirm: A.toolUseConfirm,
    toolUseContext: A.toolUseContext,
    onDone: A.onDone,
    onReject: A.onReject,
    title: I ? "Overwrite file" : "Create file",
    question: x0A.default.createElement($, null, "Do you want to ", Y, " ", x0A.default.createElement($, {
      bold: !0
    }, bn5(G)), "?"),
    content: x0A.default.createElement(of2, {
      file_path: G,
      content: Z,
      verbose: A.verbose
    }),
    path: G,
    completionType: "write_file_single",
    languageName: vWA(G),
    parseInput: Q,
    ideDiffSupport: fn5
  })
}
// @from(Start 11918157, End 11918160)
x0A
// @from(Start 11918162, End 11918165)
fn5
// @from(Start 11918171, End 11918564)
Ah2 = L(() => {
  hA();
  rh();
  tf2();
  R9();
  AQ();
  UTA();
  x0A = BA(VA(), 1), fn5 = {
    getConfig: (A) => {
      let B = RA().existsSync(A.file_path) ? _q(A.file_path) : "";
      return J31(A.file_path, B, A.content, !1)
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
// @from(Start 11918567, End 11918743)
function hn5(A) {
  let Q = A.tool;
  if ("getPath" in Q && typeof Q.getPath === "function") try {
    return Q.getPath(A.input)
  } catch {
    return null
  }
  return null
}
// @from(Start 11918745, End 11919664)
function Qh2({
  toolUseConfirm: A,
  onDone: Q,
  onReject: B,
  verbose: G,
  toolUseContext: Z
}) {
  let [I] = qB(), Y = hn5(A), J = A.tool.userFacingName(A.input), W = A.tool.isReadOnly(A.input), V = `${W?"Read":"Edit"} file`, F = (D) => D;
  if (!Y) return wTA.default.createElement(F31, {
    toolUseConfirm: A,
    toolUseContext: Z,
    onDone: Q,
    onReject: B,
    verbose: G
  });
  let K = wTA.default.createElement(S, {
    flexDirection: "column",
    paddingX: 2,
    paddingY: 1
  }, wTA.default.createElement($, null, J, "(", A.tool.renderToolUseMessage(A.input, {
    theme: I,
    verbose: G
  }), ")"));
  return wTA.default.createElement(bn, {
    toolUseConfirm: A,
    toolUseContext: Z,
    onDone: Q,
    onReject: B,
    title: V,
    content: K,
    path: Y,
    parseInput: F,
    operationType: W ? "read" : "write",
    completionType: "tool_use_single",
    languageName: "none"
  })
}
// @from(Start 11919669, End 11919672)
wTA
// @from(Start 11919678, End 11919742)
Bh2 = L(() => {
  hA();
  T70();
  UTA();
  wTA = BA(VA(), 1)
})
// @from(Start 11919748, End 11921106)
bWA = z((NJZ, Gh2) => {
  Gh2.exports = v0A;
  v0A.CAPTURING_PHASE = 1;
  v0A.AT_TARGET = 2;
  v0A.BUBBLING_PHASE = 3;

  function v0A(A, Q) {
    if (this.type = "", this.target = null, this.currentTarget = null, this.eventPhase = v0A.AT_TARGET, this.bubbles = !1, this.cancelable = !1, this.isTrusted = !1, this.defaultPrevented = !1, this.timeStamp = Date.now(), this._propagationStopped = !1, this._immediatePropagationStopped = !1, this._initialized = !0, this._dispatching = !1, A) this.type = A;
    if (Q)
      for (var B in Q) this[B] = Q[B]
  }
  v0A.prototype = Object.create(Object.prototype, {
    constructor: {
      value: v0A
    },
    stopPropagation: {
      value: function() {
        this._propagationStopped = !0
      }
    },
    stopImmediatePropagation: {
      value: function() {
        this._propagationStopped = !0, this._immediatePropagationStopped = !0
      }
    },
    preventDefault: {
      value: function() {
        if (this.cancelable) this.defaultPrevented = !0
      }
    },
    initEvent: {
      value: function(Q, B, G) {
        if (this._initialized = !0, this._dispatching) return;
        this._propagationStopped = !1, this._immediatePropagationStopped = !1, this.defaultPrevented = !1, this.isTrusted = !1, this.target = null, this.type = Q, this.bubbles = B, this.cancelable = G
      }
    }
  })
})
// @from(Start 11921112, End 11921489)
_70 = z((LJZ, Ih2) => {
  var Zh2 = bWA();
  Ih2.exports = S70;

  function S70() {
    Zh2.call(this), this.view = null, this.detail = 0
  }
  S70.prototype = Object.create(Zh2.prototype, {
    constructor: {
      value: S70
    },
    initUIEvent: {
      value: function(A, Q, B, G, Z) {
        this.initEvent(A, Q, B), this.view = G, this.detail = Z
      }
    }
  })
})
// @from(Start 11921495, End 11922882)
y70 = z((MJZ, Jh2) => {
  var Yh2 = _70();
  Jh2.exports = k70;

  function k70() {
    Yh2.call(this), this.screenX = this.screenY = this.clientX = this.clientY = 0, this.ctrlKey = this.altKey = this.shiftKey = this.metaKey = !1, this.button = 0, this.buttons = 1, this.relatedTarget = null
  }
  k70.prototype = Object.create(Yh2.prototype, {
    constructor: {
      value: k70
    },
    initMouseEvent: {
      value: function(A, Q, B, G, Z, I, Y, J, W, X, V, F, K, D, H) {
        switch (this.initEvent(A, Q, B, G, Z), this.screenX = I, this.screenY = Y, this.clientX = J, this.clientY = W, this.ctrlKey = X, this.altKey = V, this.shiftKey = F, this.metaKey = K, this.button = D, D) {
          case 0:
            this.buttons = 1;
            break;
          case 1:
            this.buttons = 4;
            break;
          case 2:
            this.buttons = 2;
            break;
          default:
            this.buttons = 0;
            break
        }
        this.relatedTarget = H
      }
    },
    getModifierState: {
      value: function(A) {
        switch (A) {
          case "Alt":
            return this.altKey;
          case "Control":
            return this.ctrlKey;
          case "Shift":
            return this.shiftKey;
          case "Meta":
            return this.metaKey;
          default:
            return !1
        }
      }
    }
  })
})
// @from(Start 11922888, End 11926313)
E31 = z((OJZ, Xh2) => {
  Xh2.exports = C31;
  var gn5 = 1,
    un5 = 3,
    mn5 = 4,
    dn5 = 5,
    cn5 = 7,
    pn5 = 8,
    ln5 = 9,
    in5 = 11,
    nn5 = 12,
    an5 = 13,
    sn5 = 14,
    rn5 = 15,
    on5 = 17,
    tn5 = 18,
    en5 = 19,
    Aa5 = 20,
    Qa5 = 21,
    Ba5 = 22,
    Ga5 = 23,
    Za5 = 24,
    Ia5 = 25,
    Ya5 = [null, "INDEX_SIZE_ERR", null, "HIERARCHY_REQUEST_ERR", "WRONG_DOCUMENT_ERR", "INVALID_CHARACTER_ERR", null, "NO_MODIFICATION_ALLOWED_ERR", "NOT_FOUND_ERR", "NOT_SUPPORTED_ERR", "INUSE_ATTRIBUTE_ERR", "INVALID_STATE_ERR", "SYNTAX_ERR", "INVALID_MODIFICATION_ERR", "NAMESPACE_ERR", "INVALID_ACCESS_ERR", null, "TYPE_MISMATCH_ERR", "SECURITY_ERR", "NETWORK_ERR", "ABORT_ERR", "URL_MISMATCH_ERR", "QUOTA_EXCEEDED_ERR", "TIMEOUT_ERR", "INVALID_NODE_TYPE_ERR", "DATA_CLONE_ERR"],
    Ja5 = [null, "INDEX_SIZE_ERR (1): the index is not in the allowed range", null, "HIERARCHY_REQUEST_ERR (3): the operation would yield an incorrect nodes model", "WRONG_DOCUMENT_ERR (4): the object is in the wrong Document, a call to importNode is required", "INVALID_CHARACTER_ERR (5): the string contains invalid characters", null, "NO_MODIFICATION_ALLOWED_ERR (7): the object can not be modified", "NOT_FOUND_ERR (8): the object can not be found here", "NOT_SUPPORTED_ERR (9): this operation is not supported", "INUSE_ATTRIBUTE_ERR (10): setAttributeNode called on owned Attribute", "INVALID_STATE_ERR (11): the object is in an invalid state", "SYNTAX_ERR (12): the string did not match the expected pattern", "INVALID_MODIFICATION_ERR (13): the object can not be modified in this way", "NAMESPACE_ERR (14): the operation is not allowed by Namespaces in XML", "INVALID_ACCESS_ERR (15): the object does not support the operation or argument", null, "TYPE_MISMATCH_ERR (17): the type of the object does not match the expected type", "SECURITY_ERR (18): the operation is insecure", "NETWORK_ERR (19): a network error occurred", "ABORT_ERR (20): the user aborted an operation", "URL_MISMATCH_ERR (21): the given URL does not match another URL", "QUOTA_EXCEEDED_ERR (22): the quota has been exceeded", "TIMEOUT_ERR (23): a timeout occurred", "INVALID_NODE_TYPE_ERR (24): the supplied node is invalid or has an invalid ancestor for this operation", "DATA_CLONE_ERR (25): the object can not be cloned."],
    Wh2 = {
      INDEX_SIZE_ERR: gn5,
      DOMSTRING_SIZE_ERR: 2,
      HIERARCHY_REQUEST_ERR: un5,
      WRONG_DOCUMENT_ERR: mn5,
      INVALID_CHARACTER_ERR: dn5,
      NO_DATA_ALLOWED_ERR: 6,
      NO_MODIFICATION_ALLOWED_ERR: cn5,
      NOT_FOUND_ERR: pn5,
      NOT_SUPPORTED_ERR: ln5,
      INUSE_ATTRIBUTE_ERR: 10,
      INVALID_STATE_ERR: in5,
      SYNTAX_ERR: nn5,
      INVALID_MODIFICATION_ERR: an5,
      NAMESPACE_ERR: sn5,
      INVALID_ACCESS_ERR: rn5,
      VALIDATION_ERR: 16,
      TYPE_MISMATCH_ERR: on5,
      SECURITY_ERR: tn5,
      NETWORK_ERR: en5,
      ABORT_ERR: Aa5,
      URL_MISMATCH_ERR: Qa5,
      QUOTA_EXCEEDED_ERR: Ba5,
      TIMEOUT_ERR: Ga5,
      INVALID_NODE_TYPE_ERR: Za5,
      DATA_CLONE_ERR: Ia5
    };

  function C31(A) {
    Error.call(this), Error.captureStackTrace(this, this.constructor), this.code = A, this.message = Ja5[A], this.name = Ya5[A]
  }
  C31.prototype.__proto__ = Error.prototype;
  for (qTA in Wh2) H31 = {
    value: Wh2[qTA]
  }, Object.defineProperty(C31, qTA, H31), Object.defineProperty(C31.prototype, qTA, H31);
  var H31, qTA
})
// @from(Start 11926319, End 11926392)
z31 = z((Wa5) => {
  Wa5.isApiWritable = !globalThis.__domino_frozen__
})
// @from(Start 11926398, End 11929343)
dJ = z((Fa5) => {
  var mJ = E31(),
    uW = mJ,
    Va5 = z31().isApiWritable;
  Fa5.NAMESPACE = {
    HTML: "http://www.w3.org/1999/xhtml",
    XML: "http://www.w3.org/XML/1998/namespace",
    XMLNS: "http://www.w3.org/2000/xmlns/",
    MATHML: "http://www.w3.org/1998/Math/MathML",
    SVG: "http://www.w3.org/2000/svg",
    XLINK: "http://www.w3.org/1999/xlink"
  };
  Fa5.IndexSizeError = function() {
    throw new mJ(uW.INDEX_SIZE_ERR)
  };
  Fa5.HierarchyRequestError = function() {
    throw new mJ(uW.HIERARCHY_REQUEST_ERR)
  };
  Fa5.WrongDocumentError = function() {
    throw new mJ(uW.WRONG_DOCUMENT_ERR)
  };
  Fa5.InvalidCharacterError = function() {
    throw new mJ(uW.INVALID_CHARACTER_ERR)
  };
  Fa5.NoModificationAllowedError = function() {
    throw new mJ(uW.NO_MODIFICATION_ALLOWED_ERR)
  };
  Fa5.NotFoundError = function() {
    throw new mJ(uW.NOT_FOUND_ERR)
  };
  Fa5.NotSupportedError = function() {
    throw new mJ(uW.NOT_SUPPORTED_ERR)
  };
  Fa5.InvalidStateError = function() {
    throw new mJ(uW.INVALID_STATE_ERR)
  };
  Fa5.SyntaxError = function() {
    throw new mJ(uW.SYNTAX_ERR)
  };
  Fa5.InvalidModificationError = function() {
    throw new mJ(uW.INVALID_MODIFICATION_ERR)
  };
  Fa5.NamespaceError = function() {
    throw new mJ(uW.NAMESPACE_ERR)
  };
  Fa5.InvalidAccessError = function() {
    throw new mJ(uW.INVALID_ACCESS_ERR)
  };
  Fa5.TypeMismatchError = function() {
    throw new mJ(uW.TYPE_MISMATCH_ERR)
  };
  Fa5.SecurityError = function() {
    throw new mJ(uW.SECURITY_ERR)
  };
  Fa5.NetworkError = function() {
    throw new mJ(uW.NETWORK_ERR)
  };
  Fa5.AbortError = function() {
    throw new mJ(uW.ABORT_ERR)
  };
  Fa5.UrlMismatchError = function() {
    throw new mJ(uW.URL_MISMATCH_ERR)
  };
  Fa5.QuotaExceededError = function() {
    throw new mJ(uW.QUOTA_EXCEEDED_ERR)
  };
  Fa5.TimeoutError = function() {
    throw new mJ(uW.TIMEOUT_ERR)
  };
  Fa5.InvalidNodeTypeError = function() {
    throw new mJ(uW.INVALID_NODE_TYPE_ERR)
  };
  Fa5.DataCloneError = function() {
    throw new mJ(uW.DATA_CLONE_ERR)
  };
  Fa5.nyi = function() {
    throw Error("NotYetImplemented")
  };
  Fa5.shouldOverride = function() {
    throw Error("Abstract function; should be overriding in subclass.")
  };
  Fa5.assert = function(A, Q) {
    if (!A) throw Error("Assertion failed: " + (Q || "") + `
` + Error().stack)
  };
  Fa5.expose = function(A, Q) {
    for (var B in A) Object.defineProperty(Q.prototype, B, {
      value: A[B],
      writable: Va5
    })
  };
  Fa5.merge = function(A, Q) {
    for (var B in Q) A[B] = Q[B]
  };
  Fa5.documentOrder = function(A, Q) {
    return 3 - (A.compareDocumentPosition(Q) & 6)
  };
  Fa5.toASCIILowerCase = function(A) {
    return A.replace(/[A-Z]+/g, function(Q) {
      return Q.toLowerCase()
    })
  };
  Fa5.toASCIIUpperCase = function(A) {
    return A.replace(/[a-z]+/g, function(Q) {
      return Q.toUpperCase()
    })
  }
})
// @from(Start 11929349, End 11934530)
x70 = z((PJZ, Fh2) => {
  var b0A = bWA(),
    da5 = y70(),
    ca5 = dJ();
  Fh2.exports = Vh2;

  function Vh2() {}
  Vh2.prototype = {
    addEventListener: function(Q, B, G) {
      if (!B) return;
      if (G === void 0) G = !1;
      if (!this._listeners) this._listeners = Object.create(null);
      if (!this._listeners[Q]) this._listeners[Q] = [];
      var Z = this._listeners[Q];
      for (var I = 0, Y = Z.length; I < Y; I++) {
        var J = Z[I];
        if (J.listener === B && J.capture === G) return
      }
      var W = {
        listener: B,
        capture: G
      };
      if (typeof B === "function") W.f = B;
      Z.push(W)
    },
    removeEventListener: function(Q, B, G) {
      if (G === void 0) G = !1;
      if (this._listeners) {
        var Z = this._listeners[Q];
        if (Z)
          for (var I = 0, Y = Z.length; I < Y; I++) {
            var J = Z[I];
            if (J.listener === B && J.capture === G) {
              if (Z.length === 1) this._listeners[Q] = void 0;
              else Z.splice(I, 1);
              return
            }
          }
      }
    },
    dispatchEvent: function(Q) {
      return this._dispatchEvent(Q, !1)
    },
    _dispatchEvent: function(Q, B) {
      if (typeof B !== "boolean") B = !1;

      function G(X, V) {
        var {
          type: F,
          eventPhase: K
        } = V;
        if (V.currentTarget = X, K !== b0A.CAPTURING_PHASE && X._handlers && X._handlers[F]) {
          var D = X._handlers[F],
            H;
          if (typeof D === "function") H = D.call(V.currentTarget, V);
          else {
            var C = D.handleEvent;
            if (typeof C !== "function") throw TypeError("handleEvent property of event handler object isnot a function.");
            H = C.call(D, V)
          }
          switch (V.type) {
            case "mouseover":
              if (H === !0) V.preventDefault();
              break;
            case "beforeunload":
            default:
              if (H === !1) V.preventDefault();
              break
          }
        }
        var E = X._listeners && X._listeners[F];
        if (!E) return;
        E = E.slice();
        for (var U = 0, q = E.length; U < q; U++) {
          if (V._immediatePropagationStopped) return;
          var w = E[U];
          if (K === b0A.CAPTURING_PHASE && !w.capture || K === b0A.BUBBLING_PHASE && w.capture) continue;
          if (w.f) w.f.call(V.currentTarget, V);
          else {
            var N = w.listener.handleEvent;
            if (typeof N !== "function") throw TypeError("handleEvent property of event listener object is not a function.");
            N.call(w.listener, V)
          }
        }
      }
      if (!Q._initialized || Q._dispatching) ca5.InvalidStateError();
      Q.isTrusted = B, Q._dispatching = !0, Q.target = this;
      var Z = [];
      for (var I = this.parentNode; I; I = I.parentNode) Z.push(I);
      Q.eventPhase = b0A.CAPTURING_PHASE;
      for (var Y = Z.length - 1; Y >= 0; Y--)
        if (G(Z[Y], Q), Q._propagationStopped) break;
      if (!Q._propagationStopped) Q.eventPhase = b0A.AT_TARGET, G(this, Q);
      if (Q.bubbles && !Q._propagationStopped) {
        Q.eventPhase = b0A.BUBBLING_PHASE;
        for (var J = 0, W = Z.length; J < W; J++)
          if (G(Z[J], Q), Q._propagationStopped) break
      }
      if (Q._dispatching = !1, Q.eventPhase = b0A.AT_TARGET, Q.currentTarget = null, B && !Q.defaultPrevented && Q instanceof da5) switch (Q.type) {
        case "mousedown":
          this._armed = {
            x: Q.clientX,
            y: Q.clientY,
            t: Q.timeStamp
          };
          break;
        case "mouseout":
        case "mouseover":
          this._armed = null;
          break;
        case "mouseup":
          if (this._isClick(Q)) this._doClick(Q);
          this._armed = null;
          break
      }
      return !Q.defaultPrevented
    },
    _isClick: function(A) {
      return this._armed !== null && A.type === "mouseup" && A.isTrusted && A.button === 0 && A.timeStamp - this._armed.t < 1000 && Math.abs(A.clientX - this._armed.x) < 10 && Math.abs(A.clientY - this._armed.Y) < 10
    },
    _doClick: function(A) {
      if (this._click_in_progress) return;
      this._click_in_progress = !0;
      var Q = this;
      while (Q && !Q._post_click_activation_steps) Q = Q.parentNode;
      if (Q && Q._pre_click_activation_steps) Q._pre_click_activation_steps();
      var B = this.ownerDocument.createEvent("MouseEvent");
      B.initMouseEvent("click", !0, !0, this.ownerDocument.defaultView, 1, A.screenX, A.screenY, A.clientX, A.clientY, A.ctrlKey, A.altKey, A.shiftKey, A.metaKey, A.button, null);
      var G = this._dispatchEvent(B, !0);
      if (Q) {
        if (G) {
          if (Q._post_click_activation_steps) Q._post_click_activation_steps(B)
        } else if (Q._cancelled_activation_steps) Q._cancelled_activation_steps()
      }
    },
    _setEventHandler: function(Q, B) {
      if (!this._handlers) this._handlers = Object.create(null);
      this._handlers[Q] = B
    },
    _getEventHandler: function(Q) {
      return this._handlers && this._handlers[Q] || null
    }
  }
})
// @from(Start 11934536, End 11935613)
v70 = z((jJZ, Kh2) => {
  var Zg = dJ(),
    qO = Kh2.exports = {
      valid: function(A) {
        return Zg.assert(A, "list falsy"), Zg.assert(A._previousSibling, "previous falsy"), Zg.assert(A._nextSibling, "next falsy"), !0
      },
      insertBefore: function(A, Q) {
        Zg.assert(qO.valid(A) && qO.valid(Q));
        var B = A,
          G = A._previousSibling,
          Z = Q,
          I = Q._previousSibling;
        B._previousSibling = I, G._nextSibling = Z, I._nextSibling = B, Z._previousSibling = G, Zg.assert(qO.valid(A) && qO.valid(Q))
      },
      replace: function(A, Q) {
        if (Zg.assert(qO.valid(A) && (Q === null || qO.valid(Q))), Q !== null) qO.insertBefore(Q, A);
        qO.remove(A), Zg.assert(qO.valid(A) && (Q === null || qO.valid(Q)))
      },
      remove: function(A) {
        Zg.assert(qO.valid(A));
        var Q = A._previousSibling;
        if (Q === A) return;
        var B = A._nextSibling;
        Q._nextSibling = B, B._previousSibling = Q, A._previousSibling = A._nextSibling = A, Zg.assert(qO.valid(A))
      }
    }
})
// @from(Start 11935619, End 11939053)
b70 = z((SJZ, wh2) => {
  wh2.exports = {
    serializeOne: ra5,
    ɵescapeMatchingClosingTag: zh2,
    ɵescapeClosingCommentTag: Uh2,
    ɵescapeProcessingInstructionContent: $h2
  };
  var Eh2 = dJ(),
    f0A = Eh2.NAMESPACE,
    Dh2 = {
      STYLE: !0,
      SCRIPT: !0,
      XMP: !0,
      IFRAME: !0,
      NOEMBED: !0,
      NOFRAMES: !0,
      PLAINTEXT: !0
    },
    pa5 = {
      area: !0,
      base: !0,
      basefont: !0,
      bgsound: !0,
      br: !0,
      col: !0,
      embed: !0,
      frame: !0,
      hr: !0,
      img: !0,
      input: !0,
      keygen: !0,
      link: !0,
      meta: !0,
      param: !0,
      source: !0,
      track: !0,
      wbr: !0
    },
    la5 = {},
    Hh2 = /[&<>\u00A0]/g,
    Ch2 = /[&"<>\u00A0]/g;

  function ia5(A) {
    if (!Hh2.test(A)) return A;
    return A.replace(Hh2, (Q) => {
      switch (Q) {
        case "&":
          return "&amp;";
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case " ":
          return "&nbsp;"
      }
    })
  }

  function na5(A) {
    if (!Ch2.test(A)) return A;
    return A.replace(Ch2, (Q) => {
      switch (Q) {
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case "&":
          return "&amp;";
        case '"':
          return "&quot;";
        case " ":
          return "&nbsp;"
      }
    })
  }

  function aa5(A) {
    var Q = A.namespaceURI;
    if (!Q) return A.localName;
    if (Q === f0A.XML) return "xml:" + A.localName;
    if (Q === f0A.XLINK) return "xlink:" + A.localName;
    if (Q === f0A.XMLNS)
      if (A.localName === "xmlns") return "xmlns";
      else return "xmlns:" + A.localName;
    return A.name
  }

  function zh2(A, Q) {
    let B = "</" + Q;
    if (!A.toLowerCase().includes(B)) return A;
    let G = [...A],
      Z = A.matchAll(new RegExp(B, "ig"));
    for (let I of Z) G[I.index] = "&lt;";
    return G.join("")
  }
  var sa5 = /--!?>/;

  function Uh2(A) {
    if (!sa5.test(A)) return A;
    return A.replace(/(--\!?)>/g, "$1&gt;")
  }

  function $h2(A) {
    return A.includes(">") ? A.replaceAll(">", "&gt;") : A
  }

  function ra5(A, Q) {
    var B = "";
    switch (A.nodeType) {
      case 1:
        var G = A.namespaceURI,
          Z = G === f0A.HTML,
          I = Z || G === f0A.SVG || G === f0A.MATHML ? A.localName : A.tagName;
        B += "<" + I;
        for (var Y = 0, J = A._numattrs; Y < J; Y++) {
          var W = A._attr(Y);
          if (B += " " + aa5(W), W.value !== void 0) B += '="' + na5(W.value) + '"'
        }
        if (B += ">", !(Z && pa5[I])) {
          var X = A.serialize();
          if (Dh2[I.toUpperCase()]) X = zh2(X, I);
          if (Z && la5[I] && X.charAt(0) === `
`) B += `
`;
          B += X, B += "</" + I + ">"
        }
        break;
      case 3:
      case 4:
        var V;
        if (Q.nodeType === 1 && Q.namespaceURI === f0A.HTML) V = Q.tagName;
        else V = "";
        if (Dh2[V] || V === "NOSCRIPT" && Q.ownerDocument._scripting_enabled) B += A.data;
        else B += ia5(A.data);
        break;
      case 8:
        B += "<!--" + Uh2(A.data) + "-->";
        break;
      case 7:
        let F = $h2(A.data);
        B += "<?" + A.target + " " + F + "?>";
        break;
      case 10:
        B += "<!DOCTYPE " + A.name, B += ">";
        break;
      default:
        Eh2.InvalidStateError()
    }
    return B
  }
})
// @from(Start 11939059, End 11953701)
nD = z((_JZ, Rh2) => {
  Rh2.exports = EY;
  var Oh2 = x70(),
    U31 = v70(),
    qh2 = b70(),
    y7 = dJ();

  function EY() {
    Oh2.call(this), this.parentNode = null, this._nextSibling = this._previousSibling = this, this._index = void 0
  }
  var K$ = EY.ELEMENT_NODE = 1,
    f70 = EY.ATTRIBUTE_NODE = 2,
    $31 = EY.TEXT_NODE = 3,
    oa5 = EY.CDATA_SECTION_NODE = 4,
    ta5 = EY.ENTITY_REFERENCE_NODE = 5,
    h70 = EY.ENTITY_NODE = 6,
    Nh2 = EY.PROCESSING_INSTRUCTION_NODE = 7,
    Lh2 = EY.COMMENT_NODE = 8,
    NTA = EY.DOCUMENT_NODE = 9,
    NO = EY.DOCUMENT_TYPE_NODE = 10,
    hn = EY.DOCUMENT_FRAGMENT_NODE = 11,
    g70 = EY.NOTATION_NODE = 12,
    u70 = EY.DOCUMENT_POSITION_DISCONNECTED = 1,
    m70 = EY.DOCUMENT_POSITION_PRECEDING = 2,
    d70 = EY.DOCUMENT_POSITION_FOLLOWING = 4,
    Mh2 = EY.DOCUMENT_POSITION_CONTAINS = 8,
    c70 = EY.DOCUMENT_POSITION_CONTAINED_BY = 16,
    p70 = EY.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32;
  EY.prototype = Object.create(Oh2.prototype, {
    baseURI: {
      get: y7.nyi
    },
    parentElement: {
      get: function() {
        return this.parentNode && this.parentNode.nodeType === K$ ? this.parentNode : null
      }
    },
    hasChildNodes: {
      value: y7.shouldOverride
    },
    firstChild: {
      get: y7.shouldOverride
    },
    lastChild: {
      get: y7.shouldOverride
    },
    isConnected: {
      get: function() {
        let A = this;
        while (A != null) {
          if (A.nodeType === EY.DOCUMENT_NODE) return !0;
          if (A = A.parentNode, A != null && A.nodeType === EY.DOCUMENT_FRAGMENT_NODE) A = A.host
        }
        return !1
      }
    },
    previousSibling: {
      get: function() {
        var A = this.parentNode;
        if (!A) return null;
        if (this === A.firstChild) return null;
        return this._previousSibling
      }
    },
    nextSibling: {
      get: function() {
        var A = this.parentNode,
          Q = this._nextSibling;
        if (!A) return null;
        if (Q === A.firstChild) return null;
        return Q
      }
    },
    textContent: {
      get: function() {
        return null
      },
      set: function(A) {}
    },
    innerText: {
      get: function() {
        return null
      },
      set: function(A) {}
    },
    _countChildrenOfType: {
      value: function(A) {
        var Q = 0;
        for (var B = this.firstChild; B !== null; B = B.nextSibling)
          if (B.nodeType === A) Q++;
        return Q
      }
    },
    _ensureInsertValid: {
      value: function(Q, B, G) {
        var Z = this,
          I, Y;
        if (!Q.nodeType) throw TypeError("not a node");
        switch (Z.nodeType) {
          case NTA:
          case hn:
          case K$:
            break;
          default:
            y7.HierarchyRequestError()
        }
        if (Q.isAncestor(Z)) y7.HierarchyRequestError();
        if (B !== null || !G) {
          if (B.parentNode !== Z) y7.NotFoundError()
        }
        switch (Q.nodeType) {
          case hn:
          case NO:
          case K$:
          case $31:
          case Nh2:
          case Lh2:
            break;
          default:
            y7.HierarchyRequestError()
        }
        if (Z.nodeType === NTA) switch (Q.nodeType) {
          case $31:
            y7.HierarchyRequestError();
            break;
          case hn:
            if (Q._countChildrenOfType($31) > 0) y7.HierarchyRequestError();
            switch (Q._countChildrenOfType(K$)) {
              case 0:
                break;
              case 1:
                if (B !== null) {
                  if (G && B.nodeType === NO) y7.HierarchyRequestError();
                  for (Y = B.nextSibling; Y !== null; Y = Y.nextSibling)
                    if (Y.nodeType === NO) y7.HierarchyRequestError()
                }
                if (I = Z._countChildrenOfType(K$), G) {
                  if (I > 0) y7.HierarchyRequestError()
                } else if (I > 1 || I === 1 && B.nodeType !== K$) y7.HierarchyRequestError();
                break;
              default:
                y7.HierarchyRequestError()
            }
            break;
          case K$:
            if (B !== null) {
              if (G && B.nodeType === NO) y7.HierarchyRequestError();
              for (Y = B.nextSibling; Y !== null; Y = Y.nextSibling)
                if (Y.nodeType === NO) y7.HierarchyRequestError()
            }
            if (I = Z._countChildrenOfType(K$), G) {
              if (I > 0) y7.HierarchyRequestError()
            } else if (I > 1 || I === 1 && B.nodeType !== K$) y7.HierarchyRequestError();
            break;
          case NO:
            if (B === null) {
              if (Z._countChildrenOfType(K$)) y7.HierarchyRequestError()
            } else
              for (Y = Z.firstChild; Y !== null; Y = Y.nextSibling) {
                if (Y === B) break;
                if (Y.nodeType === K$) y7.HierarchyRequestError()
              }
            if (I = Z._countChildrenOfType(NO), G) {
              if (I > 0) y7.HierarchyRequestError()
            } else if (I > 1 || I === 1 && B.nodeType !== NO) y7.HierarchyRequestError();
            break
        } else if (Q.nodeType === NO) y7.HierarchyRequestError()
      }
    },
    insertBefore: {
      value: function(Q, B) {
        var G = this;
        G._ensureInsertValid(Q, B, !0);
        var Z = B;
        if (Z === Q) Z = Q.nextSibling;
        return G.doc.adoptNode(Q), Q._insertOrReplace(G, Z, !1), Q
      }
    },
    appendChild: {
      value: function(A) {
        return this.insertBefore(A, null)
      }
    },
    _appendChild: {
      value: function(A) {
        A._insertOrReplace(this, null, !1)
      }
    },
    removeChild: {
      value: function(Q) {
        var B = this;
        if (!Q.nodeType) throw TypeError("not a node");
        if (Q.parentNode !== B) y7.NotFoundError();
        return Q.remove(), Q
      }
    },
    replaceChild: {
      value: function(Q, B) {
        var G = this;
        if (G._ensureInsertValid(Q, B, !1), Q.doc !== G.doc) G.doc.adoptNode(Q);
        return Q._insertOrReplace(G, B, !0), B
      }
    },
    contains: {
      value: function(Q) {
        if (Q === null) return !1;
        if (this === Q) return !0;
        return (this.compareDocumentPosition(Q) & c70) !== 0
      }
    },
    compareDocumentPosition: {
      value: function(Q) {
        if (this === Q) return 0;
        if (this.doc !== Q.doc || this.rooted !== Q.rooted) return u70 + p70;
        var B = [],
          G = [];
        for (var Z = this; Z !== null; Z = Z.parentNode) B.push(Z);
        for (Z = Q; Z !== null; Z = Z.parentNode) G.push(Z);
        if (B.reverse(), G.reverse(), B[0] !== G[0]) return u70 + p70;
        Z = Math.min(B.length, G.length);
        for (var I = 1; I < Z; I++)
          if (B[I] !== G[I])
            if (B[I].index < G[I].index) return d70;
            else return m70;
        if (B.length < G.length) return d70 + c70;
        else return m70 + Mh2
      }
    },
    isSameNode: {
      value: function(Q) {
        return this === Q
      }
    },
    isEqualNode: {
      value: function(Q) {
        if (!Q) return !1;
        if (Q.nodeType !== this.nodeType) return !1;
        if (!this.isEqual(Q)) return !1;
        for (var B = this.firstChild, G = Q.firstChild; B && G; B = B.nextSibling, G = G.nextSibling)
          if (!B.isEqualNode(G)) return !1;
        return B === null && G === null
      }
    },
    cloneNode: {
      value: function(A) {
        var Q = this.clone();
        if (A)
          for (var B = this.firstChild; B !== null; B = B.nextSibling) Q._appendChild(B.cloneNode(!0));
        return Q
      }
    },
    lookupPrefix: {
      value: function(Q) {
        var B;
        if (Q === "" || Q === null || Q === void 0) return null;
        switch (this.nodeType) {
          case K$:
            return this._lookupNamespacePrefix(Q, this);
          case NTA:
            return B = this.documentElement, B ? B.lookupPrefix(Q) : null;
          case h70:
          case g70:
          case hn:
          case NO:
            return null;
          case f70:
            return B = this.ownerElement, B ? B.lookupPrefix(Q) : null;
          default:
            return B = this.parentElement, B ? B.lookupPrefix(Q) : null
        }
      }
    },
    lookupNamespaceURI: {
      value: function(Q) {
        if (Q === "" || Q === void 0) Q = null;
        var B;
        switch (this.nodeType) {
          case K$:
            return y7.shouldOverride();
          case NTA:
            return B = this.documentElement, B ? B.lookupNamespaceURI(Q) : null;
          case h70:
          case g70:
          case NO:
          case hn:
            return null;
          case f70:
            return B = this.ownerElement, B ? B.lookupNamespaceURI(Q) : null;
          default:
            return B = this.parentElement, B ? B.lookupNamespaceURI(Q) : null
        }
      }
    },
    isDefaultNamespace: {
      value: function(Q) {
        if (Q === "" || Q === void 0) Q = null;
        var B = this.lookupNamespaceURI(null);
        return B === Q
      }
    },
    index: {
      get: function() {
        var A = this.parentNode;
        if (this === A.firstChild) return 0;
        var Q = A.childNodes;
        if (this._index === void 0 || Q[this._index] !== this) {
          for (var B = 0; B < Q.length; B++) Q[B]._index = B;
          y7.assert(Q[this._index] === this)
        }
        return this._index
      }
    },
    isAncestor: {
      value: function(A) {
        if (this.doc !== A.doc) return !1;
        if (this.rooted !== A.rooted) return !1;
        for (var Q = A; Q; Q = Q.parentNode)
          if (Q === this) return !0;
        return !1
      }
    },
    ensureSameDoc: {
      value: function(A) {
        if (A.ownerDocument === null) A.ownerDocument = this.doc;
        else if (A.ownerDocument !== this.doc) y7.WrongDocumentError()
      }
    },
    removeChildren: {
      value: y7.shouldOverride
    },
    _insertOrReplace: {
      value: function(Q, B, G) {
        var Z = this,
          I, Y;
        if (Z.nodeType === hn && Z.rooted) y7.HierarchyRequestError();
        if (Q._childNodes) {
          if (I = B === null ? Q._childNodes.length : B.index, Z.parentNode === Q) {
            var J = Z.index;
            if (J < I) I--
          }
        }
        if (G) {
          if (B.rooted) B.doc.mutateRemove(B);
          B.parentNode = null
        }
        var W = B;
        if (W === null) W = Q.firstChild;
        var X = Z.rooted && Q.rooted;
        if (Z.nodeType === hn) {
          var V = [0, G ? 1 : 0],
            F;
          for (var K = Z.firstChild; K !== null; K = F) F = K.nextSibling, V.push(K), K.parentNode = Q;
          var D = V.length;
          if (G) U31.replace(W, D > 2 ? V[2] : null);
          else if (D > 2 && W !== null) U31.insertBefore(V[2], W);
          if (Q._childNodes) {
            V[0] = B === null ? Q._childNodes.length : B._index, Q._childNodes.splice.apply(Q._childNodes, V);
            for (Y = 2; Y < D; Y++) V[Y]._index = V[0] + (Y - 2)
          } else if (Q._firstChild === B) {
            if (D > 2) Q._firstChild = V[2];
            else if (G) Q._firstChild = null
          }
          if (Z._childNodes) Z._childNodes.length = 0;
          else Z._firstChild = null;
          if (Q.rooted) {
            Q.modify();
            for (Y = 2; Y < D; Y++) Q.doc.mutateInsert(V[Y])
          }
        } else {
          if (B === Z) return;
          if (X) Z._remove();
          else if (Z.parentNode) Z.remove();
          if (Z.parentNode = Q, G) {
            if (U31.replace(W, Z), Q._childNodes) Z._index = I, Q._childNodes[I] = Z;
            else if (Q._firstChild === B) Q._firstChild = Z
          } else {
            if (W !== null) U31.insertBefore(Z, W);
            if (Q._childNodes) Z._index = I, Q._childNodes.splice(I, 0, Z);
            else if (Q._firstChild === B) Q._firstChild = Z
          }
          if (X) Q.modify(), Q.doc.mutateMove(Z);
          else if (Q.rooted) Q.modify(), Q.doc.mutateInsert(Z)
        }
      }
    },
    lastModTime: {
      get: function() {
        if (!this._lastModTime) this._lastModTime = this.doc.modclock;
        return this._lastModTime
      }
    },
    modify: {
      value: function() {
        if (this.doc.modclock) {
          var A = ++this.doc.modclock;
          for (var Q = this; Q; Q = Q.parentElement)
            if (Q._lastModTime) Q._lastModTime = A
        }
      }
    },
    doc: {
      get: function() {
        return this.ownerDocument || this
      }
    },
    rooted: {
      get: function() {
        return !!this._nid
      }
    },
    normalize: {
      value: function() {
        var A;
        for (var Q = this.firstChild; Q !== null; Q = A) {
          if (A = Q.nextSibling, Q.normalize) Q.normalize();
          if (Q.nodeType !== EY.TEXT_NODE) continue;
          if (Q.nodeValue === "") {
            this.removeChild(Q);
            continue
          }
          var B = Q.previousSibling;
          if (B === null) continue;
          else if (B.nodeType === EY.TEXT_NODE) B.appendData(Q.nodeValue), this.removeChild(Q)
        }
      }
    },
    serialize: {
      value: function() {
        if (this._innerHTML) return this._innerHTML;
        var A = "";
        for (var Q = this.firstChild; Q !== null; Q = Q.nextSibling) A += qh2.serializeOne(Q, this);
        return A
      }
    },
    outerHTML: {
      get: function() {
        return qh2.serializeOne(this, {
          nodeType: 0
        })
      },
      set: y7.nyi
    },
    ELEMENT_NODE: {
      value: K$
    },
    ATTRIBUTE_NODE: {
      value: f70
    },
    TEXT_NODE: {
      value: $31
    },
    CDATA_SECTION_NODE: {
      value: oa5
    },
    ENTITY_REFERENCE_NODE: {
      value: ta5
    },
    ENTITY_NODE: {
      value: h70
    },
    PROCESSING_INSTRUCTION_NODE: {
      value: Nh2
    },
    COMMENT_NODE: {
      value: Lh2
    },
    DOCUMENT_NODE: {
      value: NTA
    },
    DOCUMENT_TYPE_NODE: {
      value: NO
    },
    DOCUMENT_FRAGMENT_NODE: {
      value: hn
    },
    NOTATION_NODE: {
      value: g70
    },
    DOCUMENT_POSITION_DISCONNECTED: {
      value: u70
    },
    DOCUMENT_POSITION_PRECEDING: {
      value: m70
    },
    DOCUMENT_POSITION_FOLLOWING: {
      value: d70
    },
    DOCUMENT_POSITION_CONTAINS: {
      value: Mh2
    },
    DOCUMENT_POSITION_CONTAINED_BY: {
      value: c70
    },
    DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: {
      value: p70
    }
  })
})
// @from(Start 11953707, End 11953937)
Ph2 = z((kJZ, Th2) => {
  Th2.exports = class extends Array {
    constructor(Q) {
      super(Q && Q.length || 0);
      if (Q)
        for (var B in Q) this[B] = Q[B]
    }
    item(Q) {
      return this[Q] || null
    }
  }
})
// @from(Start 11953943, End 11954112)
Sh2 = z((yJZ, jh2) => {
  function ea5(A) {
    return this[A] || null
  }

  function As5(A) {
    if (!A) A = [];
    return A.item = ea5, A
  }
  jh2.exports = As5
})
// @from(Start 11954118, End 11954235)
h0A = z((xJZ, _h2) => {
  var l70;
  try {
    l70 = Ph2()
  } catch (A) {
    l70 = Sh2()
  }
  _h2.exports = l70
})
// @from(Start 11954241, End 11955911)
w31 = z((vJZ, xh2) => {
  xh2.exports = yh2;
  var kh2 = nD(),
    Qs5 = h0A();

  function yh2() {
    kh2.call(this), this._firstChild = this._childNodes = null
  }
  yh2.prototype = Object.create(kh2.prototype, {
    hasChildNodes: {
      value: function() {
        if (this._childNodes) return this._childNodes.length > 0;
        return this._firstChild !== null
      }
    },
    childNodes: {
      get: function() {
        return this._ensureChildNodes(), this._childNodes
      }
    },
    firstChild: {
      get: function() {
        if (this._childNodes) return this._childNodes.length === 0 ? null : this._childNodes[0];
        return this._firstChild
      }
    },
    lastChild: {
      get: function() {
        var A = this._childNodes,
          Q;
        if (A) return A.length === 0 ? null : A[A.length - 1];
        if (Q = this._firstChild, Q === null) return null;
        return Q._previousSibling
      }
    },
    _ensureChildNodes: {
      value: function() {
        if (this._childNodes) return;
        var A = this._firstChild,
          Q = A,
          B = this._childNodes = new Qs5;
        if (A)
          do B.push(Q), Q = Q._nextSibling; while (Q !== A);
        this._firstChild = null
      }
    },
    removeChildren: {
      value: function() {
        var Q = this.rooted ? this.ownerDocument : null,
          B = this.firstChild,
          G;
        while (B !== null) {
          if (G = B, B = G.nextSibling, Q) Q.mutateRemove(G);
          G.parentNode = null
        }
        if (this._childNodes) this._childNodes.length = 0;
        else this._firstChild = null;
        this.modify()
      }
    }
  })
})
// @from(Start 11955917, End 11957330)
q31 = z((Vs5) => {
  Vs5.isValidName = Ws5;
  Vs5.isValidQName = Xs5;
  var Bs5 = /^[_:A-Za-z][-.:\w]+$/,
    Gs5 = /^([_A-Za-z][-.\w]+|[_A-Za-z][-.\w]+:[_A-Za-z][-.\w]+)$/,
    LTA = "_A-Za-zÀ-ÖØ-öø-˿Ͱ-ͽͿ-῿‌-‍⁰-↏Ⰰ-⿯、-퟿豈-﷏ﷰ-�",
    MTA = "-._A-Za-z0-9·À-ÖØ-öø-˿̀-ͽͿ-῿‌‍‿⁀⁰-↏Ⰰ-⿯、-퟿豈-﷏ﷰ-�",
    g0A = "[" + LTA + "][" + MTA + "]*",
    i70 = LTA + ":",
    n70 = MTA + ":",
    Zs5 = new RegExp("^[" + i70 + "][" + n70 + "]*$"),
    Is5 = new RegExp("^(" + g0A + "|" + g0A + ":" + g0A + ")$"),
    vh2 = /[\uD800-\uDB7F\uDC00-\uDFFF]/,
    bh2 = /[\uD800-\uDB7F\uDC00-\uDFFF]/g,
    fh2 = /[\uD800-\uDB7F][\uDC00-\uDFFF]/g;
  LTA += "\uD800-\uDB7F\uDC00-\uDFFF";
  MTA += "\uD800-\uDB7F\uDC00-\uDFFF";
  g0A = "[" + LTA + "][" + MTA + "]*";
  i70 = LTA + ":";
  n70 = MTA + ":";
  var Ys5 = new RegExp("^[" + i70 + "][" + n70 + "]*$"),
    Js5 = new RegExp("^(" + g0A + "|" + g0A + ":" + g0A + ")$");

  function Ws5(A) {
    if (Bs5.test(A)) return !0;
    if (Zs5.test(A)) return !0;
    if (!vh2.test(A)) return !1;
    if (!Ys5.test(A)) return !1;
    var Q = A.match(bh2),
      B = A.match(fh2);
    return B !== null && 2 * B.length === Q.length
  }

  function Xs5(A) {
    if (Gs5.test(A)) return !0;
    if (Is5.test(A)) return !0;
    if (!vh2.test(A)) return !1;
    if (!Js5.test(A)) return !1;
    var Q = A.match(bh2),
      B = A.match(fh2);
    return B !== null && 2 * B.length === Q.length
  }
})
// @from(Start 11957336, End 11960474)
a70 = z((Hs5) => {
  var hh2 = dJ();
  Hs5.property = function(A) {
    if (Array.isArray(A.type)) {
      var Q = Object.create(null);
      A.type.forEach(function(Z) {
        Q[Z.value || Z] = Z.alias || Z
      });
      var B = A.missing;
      if (B === void 0) B = null;
      var G = A.invalid;
      if (G === void 0) G = B;
      return {
        get: function() {
          var Z = this._getattr(A.name);
          if (Z === null) return B;
          if (Z = Q[Z.toLowerCase()], Z !== void 0) return Z;
          if (G !== null) return G;
          return Z
        },
        set: function(Z) {
          this._setattr(A.name, Z)
        }
      }
    } else if (A.type === Boolean) return {
      get: function() {
        return this.hasAttribute(A.name)
      },
      set: function(Z) {
        if (Z) this._setattr(A.name, "");
        else this.removeAttribute(A.name)
      }
    };
    else if (A.type === Number || A.type === "long" || A.type === "unsigned long" || A.type === "limited unsigned long with fallback") return Ds5(A);
    else if (!A.type || A.type === String) return {
      get: function() {
        return this._getattr(A.name) || ""
      },
      set: function(Z) {
        if (A.treatNullAsEmptyString && Z === null) Z = "";
        this._setattr(A.name, Z)
      }
    };
    else if (typeof A.type === "function") return A.type(A.name, A);
    throw Error("Invalid attribute definition")
  };

  function Ds5(A) {
    var Q;
    if (typeof A.default === "function") Q = A.default;
    else if (typeof A.default === "number") Q = function() {
      return A.default
    };
    else Q = function() {
      hh2.assert(!1, typeof A.default)
    };
    var B = A.type === "unsigned long",
      G = A.type === "long",
      Z = A.type === "limited unsigned long with fallback",
      I = A.min,
      Y = A.max,
      J = A.setmin;
    if (I === void 0) {
      if (B) I = 0;
      if (G) I = -2147483648;
      if (Z) I = 1
    }
    if (Y === void 0) {
      if (B || G || Z) Y = 2147483647
    }
    return {
      get: function() {
        var W = this._getattr(A.name),
          X = A.float ? parseFloat(W) : parseInt(W, 10);
        if (W === null || !isFinite(X) || I !== void 0 && X < I || Y !== void 0 && X > Y) return Q.call(this);
        if (B || G || Z) {
          if (!/^[ \t\n\f\r]*[-+]?[0-9]/.test(W)) return Q.call(this);
          X = X | 0
        }
        return X
      },
      set: function(W) {
        if (!A.float) W = Math.floor(W);
        if (J !== void 0 && W < J) hh2.IndexSizeError(A.name + " set to " + W);
        if (B) W = W < 0 || W > 2147483647 ? Q.call(this) : W | 0;
        else if (Z) W = W < 1 || W > 2147483647 ? Q.call(this) : W | 0;
        else if (G) W = W < -2147483648 || W > 2147483647 ? Q.call(this) : W | 0;
        this._setattr(A.name, String(W))
      }
    }
  }
  Hs5.registerChangeHandler = function(A, Q, B) {
    var G = A.prototype;
    if (!Object.prototype.hasOwnProperty.call(G, "_attributeChangeHandlers")) G._attributeChangeHandlers = Object.create(G._attributeChangeHandlers || null);
    G._attributeChangeHandlers[Q] = B
  }
})
// @from(Start 11960480, End 11962024)
mh2 = z((hJZ, uh2) => {
  uh2.exports = gh2;
  var zs5 = nD();

  function gh2(A, Q) {
    this.root = A, this.filter = Q, this.lastModTime = A.lastModTime, this.done = !1, this.cache = [], this.traverse()
  }
  gh2.prototype = Object.create(Object.prototype, {
    length: {
      get: function() {
        if (this.checkcache(), !this.done) this.traverse();
        return this.cache.length
      }
    },
    item: {
      value: function(A) {
        if (this.checkcache(), !this.done && A >= this.cache.length) this.traverse();
        return this.cache[A]
      }
    },
    checkcache: {
      value: function() {
        if (this.lastModTime !== this.root.lastModTime) {
          for (var A = this.cache.length - 1; A >= 0; A--) this[A] = void 0;
          this.cache.length = 0, this.done = !1, this.lastModTime = this.root.lastModTime
        }
      }
    },
    traverse: {
      value: function(A) {
        if (A !== void 0) A++;
        var Q;
        while ((Q = this.next()) !== null)
          if (this[this.cache.length] = Q, this.cache.push(Q), A && this.cache.length === A) return;
        this.done = !0
      }
    },
    next: {
      value: function() {
        var A = this.cache.length === 0 ? this.root : this.cache[this.cache.length - 1],
          Q;
        if (A.nodeType === zs5.DOCUMENT_NODE) Q = A.documentElement;
        else Q = A.nextElement(this.root);
        while (Q) {
          if (this.filter(Q)) return Q;
          Q = Q.nextElement(this.root)
        }
        return null
      }
    }
  })
})
// @from(Start 11962030, End 11965186)
r70 = z((gJZ, ph2) => {
  var s70 = dJ();
  ph2.exports = ch2;

  function ch2(A, Q) {
    this._getString = A, this._setString = Q, this._length = 0, this._lastStringValue = "", this._update()
  }
  Object.defineProperties(ch2.prototype, {
    length: {
      get: function() {
        return this._length
      }
    },
    item: {
      value: function(A) {
        var Q = fWA(this);
        if (A < 0 || A >= Q.length) return null;
        return Q[A]
      }
    },
    contains: {
      value: function(A) {
        A = String(A);
        var Q = fWA(this);
        return Q.indexOf(A) > -1
      }
    },
    add: {
      value: function() {
        var A = fWA(this);
        for (var Q = 0, B = arguments.length; Q < B; Q++) {
          var G = OTA(arguments[Q]);
          if (A.indexOf(G) < 0) A.push(G)
        }
        this._update(A)
      }
    },
    remove: {
      value: function() {
        var A = fWA(this);
        for (var Q = 0, B = arguments.length; Q < B; Q++) {
          var G = OTA(arguments[Q]),
            Z = A.indexOf(G);
          if (Z > -1) A.splice(Z, 1)
        }
        this._update(A)
      }
    },
    toggle: {
      value: function(Q, B) {
        if (Q = OTA(Q), this.contains(Q)) {
          if (B === void 0 || B === !1) return this.remove(Q), !1;
          return !0
        } else {
          if (B === void 0 || B === !0) return this.add(Q), !0;
          return !1
        }
      }
    },
    replace: {
      value: function(Q, B) {
        if (String(B) === "") s70.SyntaxError();
        Q = OTA(Q), B = OTA(B);
        var G = fWA(this),
          Z = G.indexOf(Q);
        if (Z < 0) return !1;
        var I = G.indexOf(B);
        if (I < 0) G[Z] = B;
        else if (Z < I) G[Z] = B, G.splice(I, 1);
        else G.splice(Z, 1);
        return this._update(G), !0
      }
    },
    toString: {
      value: function() {
        return this._getString()
      }
    },
    value: {
      get: function() {
        return this._getString()
      },
      set: function(A) {
        this._setString(A), this._update()
      }
    },
    _update: {
      value: function(A) {
        if (A) dh2(this, A), this._setString(A.join(" ").trim());
        else dh2(this, fWA(this));
        this._lastStringValue = this._getString()
      }
    }
  });

  function dh2(A, Q) {
    var B = A._length,
      G;
    A._length = Q.length;
    for (G = 0; G < Q.length; G++) A[G] = Q[G];
    for (; G < B; G++) A[G] = void 0
  }

  function OTA(A) {
    if (A = String(A), A === "") s70.SyntaxError();
    if (/[ \t\r\n\f]/.test(A)) s70.InvalidCharacterError();
    return A
  }

  function Us5(A) {
    var Q = A._length,
      B = Array(Q);
    for (var G = 0; G < Q; G++) B[G] = A[G];
    return B
  }

  function fWA(A) {
    var Q = A._getString();
    if (Q === A._lastStringValue) return Us5(A);
    var B = Q.replace(/(^[ \t\r\n\f]+)|([ \t\r\n\f]+$)/g, "");
    if (B === "") return [];
    else {
      var G = Object.create(null);
      return B.split(/[ \t\r\n\f]+/g).filter(function(Z) {
        var I = "$" + Z;
        if (G[I]) return !1;
        return G[I] = !0, !0
      })
    }
  }
})
// @from(Start 11965192, End 11982977)
O31 = z((uWA, rh2) => {
  var N31 = Object.create(null, {
      location: {
        get: function() {
          throw Error("window.location is not supported.")
        }
      }
    }),
    $s5 = function(A, Q) {
      return A.compareDocumentPosition(Q)
    },
    ws5 = function(A, Q) {
      return $s5(A, Q) & 2 ? 1 : -1
    },
    M31 = function(A) {
      while ((A = A.nextSibling) && A.nodeType !== 1);
      return A
    },
    gWA = function(A) {
      while ((A = A.previousSibling) && A.nodeType !== 1);
      return A
    },
    qs5 = function(A) {
      if (A = A.firstChild)
        while (A.nodeType !== 1 && (A = A.nextSibling));
      return A
    },
    Ns5 = function(A) {
      if (A = A.lastChild)
        while (A.nodeType !== 1 && (A = A.previousSibling));
      return A
    },
    hWA = function(A) {
      if (!A.parentNode) return !1;
      var Q = A.parentNode.nodeType;
      return Q === 1 || Q === 9
    },
    lh2 = function(A) {
      if (!A) return A;
      var Q = A[0];
      if (Q === '"' || Q === "'") {
        if (A[A.length - 1] === Q) A = A.slice(1, -1);
        else A = A.slice(1);
        return A.replace($4.str_escape, function(B) {
          var G = /^\\(?:([0-9A-Fa-f]+)|([\r\n\f]+))/.exec(B);
          if (!G) return B.slice(1);
          if (G[2]) return "";
          var Z = parseInt(G[1], 16);
          return String.fromCodePoint ? String.fromCodePoint(Z) : String.fromCharCode(Z)
        })
      } else if ($4.ident.test(A)) return gn(A);
      else return A
    },
    gn = function(A) {
      return A.replace($4.escape, function(Q) {
        var B = /^\\([0-9A-Fa-f]+)/.exec(Q);
        if (!B) return Q[1];
        var G = parseInt(B[1], 16);
        return String.fromCodePoint ? String.fromCodePoint(G) : String.fromCharCode(G)
      })
    },
    Ls5 = function() {
      if (Array.prototype.indexOf) return Array.prototype.indexOf;
      return function(A, Q) {
        var B = this.length;
        while (B--)
          if (this[B] === Q) return B;
        return -1
      }
    }(),
    nh2 = function(A, Q) {
      var B = $4.inside.source.replace(/</g, A).replace(/>/g, Q);
      return new RegExp(B)
    },
    D$ = function(A, Q, B) {
      return A = A.source, A = A.replace(Q, B.source || B), new RegExp(A)
    },
    ih2 = function(A, Q) {
      return A.replace(/^(?:\w+:\/\/|\/+)/, "").replace(/(?:\/+|\/*#.*?)$/, "").split("/", Q).join("/")
    },
    Ms5 = function(A, Q) {
      var B = A.replace(/\s+/g, ""),
        G;
      if (B === "even") B = "2n+0";
      else if (B === "odd") B = "2n+1";
      else if (B.indexOf("n") === -1) B = "0n" + B;
      return G = /^([+-])?(\d+)?n([+-])?(\d+)?$/.exec(B), {
        group: G[1] === "-" ? -(G[2] || 1) : +(G[2] || 1),
        offset: G[4] ? G[3] === "-" ? -G[4] : +G[4] : 0
      }
    },
    o70 = function(A, Q, B) {
      var G = Ms5(A),
        Z = G.group,
        I = G.offset,
        Y = !B ? qs5 : Ns5,
        J = !B ? M31 : gWA;
      return function(W) {
        if (!hWA(W)) return;
        var X = Y(W.parentNode),
          V = 0;
        while (X) {
          if (Q(X, W)) V++;
          if (X === W) return V -= I, Z && V ? V % Z === 0 && V < 0 === Z < 0 : !V;
          X = J(X)
        }
      }
    },
    HK = {
      "*": function() {
        return function() {
          return !0
        }
      }(),
      type: function(A) {
        return A = A.toLowerCase(),
          function(Q) {
            return Q.nodeName.toLowerCase() === A
          }
      },
      attr: function(A, Q, B, G) {
        return Q = ah2[Q],
          function(Z) {
            var I;
            switch (A) {
              case "for":
                I = Z.htmlFor;
                break;
              case "class":
                if (I = Z.className, I === "" && Z.getAttribute("class") == null) I = null;
                break;
              case "href":
              case "src":
                I = Z.getAttribute(A, 2);
                break;
              case "title":
                I = Z.getAttribute("title") || null;
                break;
              case "id":
              case "lang":
              case "dir":
              case "accessKey":
              case "hidden":
              case "tabIndex":
              case "style":
                if (Z.getAttribute) {
                  I = Z.getAttribute(A);
                  break
                }
              default:
                if (Z.hasAttribute && !Z.hasAttribute(A)) break;
                I = Z[A] != null ? Z[A] : Z.getAttribute && Z.getAttribute(A);
                break
            }
            if (I == null) return;
            if (I = I + "", G) I = I.toLowerCase(), B = B.toLowerCase();
            return Q(I, B)
          }
      },
      ":first-child": function(A) {
        return !gWA(A) && hWA(A)
      },
      ":last-child": function(A) {
        return !M31(A) && hWA(A)
      },
      ":only-child": function(A) {
        return !gWA(A) && !M31(A) && hWA(A)
      },
      ":nth-child": function(A, Q) {
        return o70(A, function() {
          return !0
        }, Q)
      },
      ":nth-last-child": function(A) {
        return HK[":nth-child"](A, !0)
      },
      ":root": function(A) {
        return A.ownerDocument.documentElement === A
      },
      ":empty": function(A) {
        return !A.firstChild
      },
      ":not": function(A) {
        var Q = e70(A);
        return function(B) {
          return !Q(B)
        }
      },
      ":first-of-type": function(A) {
        if (!hWA(A)) return;
        var Q = A.nodeName;
        while (A = gWA(A))
          if (A.nodeName === Q) return;
        return !0
      },
      ":last-of-type": function(A) {
        if (!hWA(A)) return;
        var Q = A.nodeName;
        while (A = M31(A))
          if (A.nodeName === Q) return;
        return !0
      },
      ":only-of-type": function(A) {
        return HK[":first-of-type"](A) && HK[":last-of-type"](A)
      },
      ":nth-of-type": function(A, Q) {
        return o70(A, function(B, G) {
          return B.nodeName === G.nodeName
        }, Q)
      },
      ":nth-last-of-type": function(A) {
        return HK[":nth-of-type"](A, !0)
      },
      ":checked": function(A) {
        return !!(A.checked || A.selected)
      },
      ":indeterminate": function(A) {
        return !HK[":checked"](A)
      },
      ":enabled": function(A) {
        return !A.disabled && A.type !== "hidden"
      },
      ":disabled": function(A) {
        return !!A.disabled
      },
      ":target": function(A) {
        return A.id === N31.location.hash.substring(1)
      },
      ":focus": function(A) {
        return A === A.ownerDocument.activeElement
      },
      ":is": function(A) {
        return e70(A)
      },
      ":matches": function(A) {
        return HK[":is"](A)
      },
      ":nth-match": function(A, Q) {
        var B = A.split(/\s*,\s*/),
          G = B.shift(),
          Z = e70(B.join(","));
        return o70(G, Z, Q)
      },
      ":nth-last-match": function(A) {
        return HK[":nth-match"](A, !0)
      },
      ":links-here": function(A) {
        return A + "" === N31.location + ""
      },
      ":lang": function(A) {
        return function(Q) {
          while (Q) {
            if (Q.lang) return Q.lang.indexOf(A) === 0;
            Q = Q.parentNode
          }
        }
      },
      ":dir": function(A) {
        return function(Q) {
          while (Q) {
            if (Q.dir) return Q.dir === A;
            Q = Q.parentNode
          }
        }
      },
      ":scope": function(A, Q) {
        var B = Q || A.ownerDocument;
        if (B.nodeType === 9) return A === B.documentElement;
        return A === B
      },
      ":any-link": function(A) {
        return typeof A.href === "string"
      },
      ":local-link": function(A) {
        if (A.nodeName) return A.href && A.host === N31.location.host;
        var Q = +A + 1;
        return function(B) {
          if (!B.href) return;
          var G = N31.location + "",
            Z = B + "";
          return ih2(G, Q) === ih2(Z, Q)
        }
      },
      ":default": function(A) {
        return !!A.defaultSelected
      },
      ":valid": function(A) {
        return A.willValidate || A.validity && A.validity.valid
      },
      ":invalid": function(A) {
        return !HK[":valid"](A)
      },
      ":in-range": function(A) {
        return A.value > A.min && A.value <= A.max
      },
      ":out-of-range": function(A) {
        return !HK[":in-range"](A)
      },
      ":required": function(A) {
        return !!A.required
      },
      ":optional": function(A) {
        return !A.required
      },
      ":read-only": function(A) {
        if (A.readOnly) return !0;
        var Q = A.getAttribute("contenteditable"),
          B = A.contentEditable,
          G = A.nodeName.toLowerCase();
        return G = G !== "input" && G !== "textarea", (G || A.disabled) && Q == null && B !== "true"
      },
      ":read-write": function(A) {
        return !HK[":read-only"](A)
      },
      ":hover": function() {
        throw Error(":hover is not supported.")
      },
      ":active": function() {
        throw Error(":active is not supported.")
      },
      ":link": function() {
        throw Error(":link is not supported.")
      },
      ":visited": function() {
        throw Error(":visited is not supported.")
      },
      ":column": function() {
        throw Error(":column is not supported.")
      },
      ":nth-column": function() {
        throw Error(":nth-column is not supported.")
      },
      ":nth-last-column": function() {
        throw Error(":nth-last-column is not supported.")
      },
      ":current": function() {
        throw Error(":current is not supported.")
      },
      ":past": function() {
        throw Error(":past is not supported.")
      },
      ":future": function() {
        throw Error(":future is not supported.")
      },
      ":contains": function(A) {
        return function(Q) {
          var B = Q.innerText || Q.textContent || Q.value || "";
          return B.indexOf(A) !== -1
        }
      },
      ":has": function(A) {
        return function(Q) {
          return sh2(A, Q).length > 0
        }
      }
    },
    ah2 = {
      "-": function() {
        return !0
      },
      "=": function(A, Q) {
        return A === Q
      },
      "*=": function(A, Q) {
        return A.indexOf(Q) !== -1
      },
      "~=": function(A, Q) {
        var B, G, Z, I;
        for (G = 0;; G = B + 1) {
          if (B = A.indexOf(Q, G), B === -1) return !1;
          if (Z = A[B - 1], I = A[B + Q.length], (!Z || Z === " ") && (!I || I === " ")) return !0
        }
      },
      "|=": function(A, Q) {
        var B = A.indexOf(Q),
          G;
        if (B !== 0) return;
        return G = A[B + Q.length], G === "-" || !G
      },
      "^=": function(A, Q) {
        return A.indexOf(Q) === 0
      },
      "$=": function(A, Q) {
        var B = A.lastIndexOf(Q);
        return B !== -1 && B + Q.length === A.length
      },
      "!=": function(A, Q) {
        return A !== Q
      }
    },
    RTA = {
      " ": function(A) {
        return function(Q) {
          while (Q = Q.parentNode)
            if (A(Q)) return Q
        }
      },
      ">": function(A) {
        return function(Q) {
          if (Q = Q.parentNode) return A(Q) && Q
        }
      },
      "+": function(A) {
        return function(Q) {
          if (Q = gWA(Q)) return A(Q) && Q
        }
      },
      "~": function(A) {
        return function(Q) {
          while (Q = gWA(Q))
            if (A(Q)) return Q
        }
      },
      noop: function(A) {
        return function(Q) {
          return A(Q) && Q
        }
      },
      ref: function(A, Q) {
        var B;

        function G(Z) {
          var I = Z.ownerDocument,
            Y = I.getElementsByTagName("*"),
            J = Y.length;
          while (J--)
            if (B = Y[J], G.test(Z)) return B = null, !0;
          B = null
        }
        return G.combinator = function(Z) {
          if (!B || !B.getAttribute) return;
          var I = B.getAttribute(Q) || "";
          if (I[0] === "#") I = I.substring(1);
          if (I === Z.id && A(B)) return B
        }, G
      }
    },
    $4 = {
      escape: /\\(?:[^0-9A-Fa-f\r\n]|[0-9A-Fa-f]{1,6}[\r\n\t ]?)/g,
      str_escape: /(escape)|\\(\n|\r\n?|\f)/g,
      nonascii: /[\u00A0-\uFFFF]/,
      cssid: /(?:(?!-?[0-9])(?:escape|nonascii|[-_a-zA-Z0-9])+)/,
      qname: /^ *(cssid|\*)/,
      simple: /^(?:([.#]cssid)|pseudo|attr)/,
      ref: /^ *\/(cssid)\/ */,
      combinator: /^(?: +([^ \w*.#\\]) +|( )+|([^ \w*.#\\]))(?! *$)/,
      attr: /^\[(cssid)(?:([^\w]?=)(inside))?\]/,
      pseudo: /^(:cssid)(?:\((inside)\))?/,
      inside: /(?:"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|<[^"'>]*>|\\["'>]|[^"'>])*/,
      ident: /^(cssid)$/
    };
  $4.cssid = D$($4.cssid, "nonascii", $4.nonascii);
  $4.cssid = D$($4.cssid, "escape", $4.escape);
  $4.qname = D$($4.qname, "cssid", $4.cssid);
  $4.simple = D$($4.simple, "cssid", $4.cssid);
  $4.ref = D$($4.ref, "cssid", $4.cssid);
  $4.attr = D$($4.attr, "cssid", $4.cssid);
  $4.pseudo = D$($4.pseudo, "cssid", $4.cssid);
  $4.inside = D$($4.inside, `[^"'>]*`, $4.inside);
  $4.attr = D$($4.attr, "inside", nh2("\\[", "\\]"));
  $4.pseudo = D$($4.pseudo, "inside", nh2("\\(", "\\)"));
  $4.simple = D$($4.simple, "pseudo", $4.pseudo);
  $4.simple = D$($4.simple, "attr", $4.attr);
  $4.ident = D$($4.ident, "cssid", $4.cssid);
  $4.str_escape = D$($4.str_escape, "escape", $4.escape);
  var TTA = function(A) {
      var Q = A.replace(/^\s+|\s+$/g, ""),
        B, G = [],
        Z = [],
        I, Y, J, W, X;
      while (Q) {
        if (J = $4.qname.exec(Q)) Q = Q.substring(J[0].length), Y = gn(J[1]), Z.push(L31(Y, !0));
        else if (J = $4.simple.exec(Q)) Q = Q.substring(J[0].length), Y = "*", Z.push(L31(Y, !0)), Z.push(L31(J));
        else throw SyntaxError("Invalid selector.");
        while (J = $4.simple.exec(Q)) Q = Q.substring(J[0].length), Z.push(L31(J));
        if (Q[0] === "!") Q = Q.substring(1), I = Rs5(), I.qname = Y, Z.push(I.simple);
        if (J = $4.ref.exec(Q)) {
          Q = Q.substring(J[0].length), X = RTA.ref(t70(Z), gn(J[1])), G.push(X.combinator), Z = [];
          continue
        }
        if (J = $4.combinator.exec(Q)) {
          if (Q = Q.substring(J[0].length), W = J[1] || J[2] || J[3], W === ",") {
            G.push(RTA.noop(t70(Z)));
            break
          }
        } else W = "noop";
        if (!RTA[W]) throw SyntaxError("Bad combinator.");
        G.push(RTA[W](t70(Z))), Z = []
      }
      if (B = Os5(G), B.qname = Y, B.sel = Q, I) I.lname = B.qname, I.test = B, I.qname = I.qname, I.sel = B.sel, B = I;
      if (X) X.test = B, X.qname = B.qname, X.sel = B.sel, B = X;
      return B
    },
    L31 = function(A, Q) {
      if (Q) return A === "*" ? HK["*"] : HK.type(A);
      if (A[1]) return A[1][0] === "." ? HK.attr("class", "~=", gn(A[1].substring(1)), !1) : HK.attr("id", "=", gn(A[1].substring(1)), !1);
      if (A[2]) return A[3] ? HK[gn(A[2])](lh2(A[3])) : HK[gn(A[2])];
      if (A[4]) {
        var B = A[6],
          G = /["'\s]\s*I$/i.test(B);
        if (G) B = B.replace(/\s*I$/i, "");
        return HK.attr(gn(A[4]), A[5] || "-", lh2(B), G)
      }
      throw SyntaxError("Unknown Selector.")
    },
    t70 = function(A) {
      var Q = A.length,
        B;
      if (Q < 2) return A[0];
      return function(G) {
        if (!G) return;
        for (B = 0; B < Q; B++)
          if (!A[B](G)) return;
        return !0
      }
    },
    Os5 = function(A) {
      if (A.length < 2) return function(Q) {
        return !!A[0](Q)
      };
      return function(Q) {
        var B = A.length;
        while (B--)
          if (!(Q = A[B](Q))) return;
        return !0
      }
    },
    Rs5 = function() {
      var A;

      function Q(B) {
        var G = B.ownerDocument,
          Z = G.getElementsByTagName(Q.lname),
          I = Z.length;
        while (I--)
          if (Q.test(Z[I]) && A === B) return A = null, !0;
        A = null
      }
      return Q.simple = function(B) {
        return A = B, !0
      }, Q
    },
    e70 = function(A) {
      var Q = TTA(A),
        B = [Q];
      while (Q.sel) Q = TTA(Q.sel), B.push(Q);
      if (B.length < 2) return Q;
      return function(G) {
        var Z = B.length,
          I = 0;
        for (; I < Z; I++)
          if (B[I](G)) return !0
      }
    },
    sh2 = function(A, Q) {
      var B = [],
        G = TTA(A),
        Z = Q.getElementsByTagName(G.qname),
        I = 0,
        Y;
      while (Y = Z[I++])
        if (G(Y)) B.push(Y);
      if (G.sel) {
        while (G.sel) {
          G = TTA(G.sel), Z = Q.getElementsByTagName(G.qname), I = 0;
          while (Y = Z[I++])
            if (G(Y) && Ls5.call(B, Y) === -1) B.push(Y)
        }
        B.sort(ws5)
      }
      return B
    };
  rh2.exports = uWA = function(A, Q) {
    var B, G;
    if (Q.nodeType !== 11 && A.indexOf(" ") === -1) {
      if (A[0] === "#" && Q.rooted && /^#[A-Z_][-A-Z0-9_]*$/i.test(A)) {
        if (Q.doc._hasMultipleElementsWithId) {
          if (B = A.substring(1), !Q.doc._hasMultipleElementsWithId(B)) return G = Q.doc.getElementById(B), G ? [G] : []
        }
      }
      if (A[0] === "." && /^\.\w+$/.test(A)) return Q.getElementsByClassName(A.substring(1));
      if (/^\w+$/.test(A)) return Q.getElementsByTagName(A)
    }
    return sh2(A, Q)
  };
  uWA.selectors = HK;
  uWA.operators = ah2;
  uWA.combinators = RTA;
  uWA.matches = function(A, Q) {
    var B = {
      sel: Q
    };
    do
      if (B = TTA(B.sel), B(A)) return !0; while (B.sel);
    return !1
  }
})
// @from(Start 11982983, End 11985345)
R31 = z((uJZ, oh2) => {
  var Ts5 = nD(),
    Ps5 = v70(),
    AG0 = function(A, Q) {
      var B = A.createDocumentFragment();
      for (var G = 0; G < Q.length; G++) {
        var Z = Q[G],
          I = Z instanceof Ts5;
        B.appendChild(I ? Z : A.createTextNode(String(Z)))
      }
      return B
    },
    js5 = {
      after: {
        value: function() {
          var Q = Array.prototype.slice.call(arguments),
            B = this.parentNode,
            G = this.nextSibling;
          if (B === null) return;
          while (G && Q.some(function(I) {
              return I === G
            })) G = G.nextSibling;
          var Z = AG0(this.doc, Q);
          B.insertBefore(Z, G)
        }
      },
      before: {
        value: function() {
          var Q = Array.prototype.slice.call(arguments),
            B = this.parentNode,
            G = this.previousSibling;
          if (B === null) return;
          while (G && Q.some(function(Y) {
              return Y === G
            })) G = G.previousSibling;
          var Z = AG0(this.doc, Q),
            I = G ? G.nextSibling : B.firstChild;
          B.insertBefore(Z, I)
        }
      },
      remove: {
        value: function() {
          if (this.parentNode === null) return;
          if (this.doc) {
            if (this.doc._preremoveNodeIterators(this), this.rooted) this.doc.mutateRemove(this)
          }
          this._remove(), this.parentNode = null
        }
      },
      _remove: {
        value: function() {
          var Q = this.parentNode;
          if (Q === null) return;
          if (Q._childNodes) Q._childNodes.splice(this.index, 1);
          else if (Q._firstChild === this)
            if (this._nextSibling === this) Q._firstChild = null;
            else Q._firstChild = this._nextSibling;
          Ps5.remove(this), Q.modify()
        }
      },
      replaceWith: {
        value: function() {
          var Q = Array.prototype.slice.call(arguments),
            B = this.parentNode,
            G = this.nextSibling;
          if (B === null) return;
          while (G && Q.some(function(I) {
              return I === G
            })) G = G.nextSibling;
          var Z = AG0(this.doc, Q);
          if (this.parentNode === B) B.replaceChild(Z, this);
          else B.insertBefore(Z, G)
        }
      }
    };
  oh2.exports = js5
})
// @from(Start 11985351, End 11985993)
QG0 = z((mJZ, eh2) => {
  var th2 = nD(),
    Ss5 = {
      nextElementSibling: {
        get: function() {
          if (this.parentNode) {
            for (var A = this.nextSibling; A !== null; A = A.nextSibling)
              if (A.nodeType === th2.ELEMENT_NODE) return A
          }
          return null
        }
      },
      previousElementSibling: {
        get: function() {
          if (this.parentNode) {
            for (var A = this.previousSibling; A !== null; A = A.previousSibling)
              if (A.nodeType === th2.ELEMENT_NODE) return A
          }
          return null
        }
      }
    };
  eh2.exports = Ss5
})
// @from(Start 11985999, End 11987004)
BG0 = z((dJZ, Qg2) => {
  Qg2.exports = Ag2;
  var mWA = dJ();

  function Ag2(A) {
    this.element = A
  }
  Object.defineProperties(Ag2.prototype, {
    length: {
      get: mWA.shouldOverride
    },
    item: {
      value: mWA.shouldOverride
    },
    getNamedItem: {
      value: function(Q) {
        return this.element.getAttributeNode(Q)
      }
    },
    getNamedItemNS: {
      value: function(Q, B) {
        return this.element.getAttributeNodeNS(Q, B)
      }
    },
    setNamedItem: {
      value: mWA.nyi
    },
    setNamedItemNS: {
      value: mWA.nyi
    },
    removeNamedItem: {
      value: function(Q) {
        var B = this.element.getAttributeNode(Q);
        if (B) return this.element.removeAttribute(Q), B;
        mWA.NotFoundError()
      }
    },
    removeNamedItemNS: {
      value: function(Q, B) {
        var G = this.element.getAttributeNodeNS(Q, B);
        if (G) return this.element.removeAttributeNS(Q, B), G;
        mWA.NotFoundError()
      }
    }
  })
})