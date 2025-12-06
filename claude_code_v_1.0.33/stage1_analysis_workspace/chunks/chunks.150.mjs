
// @from(Start 14187580, End 14190819)
function WJ1({
  showIfAlreadyViewed: A,
  location: Q,
  onDone: B
}) {
  let [G, Z] = _Q.useState(null), [I, Y] = _Q.useState(null), J = EQ();
  if (_Q.useEffect(() => {
      async function V() {
        let [F, K] = await Promise.all([bYA(), yi()]);
        Y(K);
        let D = zD9(F, K, A);
        if (Z(D), !D) {
          B("skip_rendering");
          return
        }
        _Q0(), GA("tengu_grove_policy_viewed", {
          location: Q,
          dismissable: K?.notice_is_grace_period
        })
      }
      V()
    }, [A, Q, B]), G === null) return null;
  if (!G) return null;
  async function W(V) {
    switch (V) {
      case "accept_opt_in": {
        await i91(!0), GA("tengu_grove_policy_submitted", {
          state: !0,
          dismissable: I?.notice_is_grace_period
        });
        break
      }
      case "accept_opt_out": {
        await i91(!1), GA("tengu_grove_policy_submitted", {
          state: !1,
          dismissable: I?.notice_is_grace_period
        });
        break
      }
      case "defer":
        GA("tengu_grove_policy_dismissed", {
          state: !0
        });
        break;
      case "escape":
        GA("tengu_grove_policy_escaped", {});
        break
    }
    B(V)
  }
  let X = I?.domain_excluded ? [{
    label: "Accept terms • Help improve Claude: OFF (for emails with your domain)",
    value: "accept_opt_out"
  }] : [{
    label: "Accept terms • Help improve Claude: ON",
    value: "accept_opt_in"
  }, {
    label: "Accept terms • Help improve Claude: OFF",
    value: "accept_opt_out"
  }];
  return _Q.default.createElement(_Q.default.Fragment, null, _Q.default.createElement(S, {
    flexDirection: "column",
    width: 100,
    gap: 1,
    paddingTop: 1,
    paddingLeft: 1,
    paddingRight: 1,
    borderStyle: "round",
    borderColor: "professionalBlue"
  }, _Q.default.createElement(S, {
    flexDirection: "row"
  }, _Q.default.createElement(S, {
    flexDirection: "column",
    gap: 1,
    flexGrow: 1
  }, I?.notice_is_grace_period ? _Q.default.createElement(Lx3, null) : _Q.default.createElement(Mx3, null)), _Q.default.createElement(S, {
    flexShrink: 0
  }, _Q.default.createElement($, {
    color: "professionalBlue"
  }, Nx3))), _Q.default.createElement(S, {
    flexDirection: "column",
    gap: 1,
    padding: 1,
    borderStyle: "round",
    borderColor: "professionalBlue"
  }, _Q.default.createElement(S, {
    flexDirection: "column"
  }, _Q.default.createElement($, {
    bold: !0
  }, "Please select how you'd like to continue"), _Q.default.createElement($, null, "Your choice takes effect immediately upon confirmation.")), _Q.default.createElement(M0, {
    options: [...X, ...I?.notice_is_grace_period ? [{
      label: "Not now",
      value: "defer"
    }] : []],
    onChange: (V) => W(V),
    onCancel: () => {
      if (I?.notice_is_grace_period) {
        W("defer");
        return
      }
      W("escape")
    }
  }))), _Q.default.createElement(S, {
    marginLeft: 1
  }, _Q.default.createElement($, {
    dimColor: !0
  }, J.pending ? _Q.default.createElement(_Q.default.Fragment, null, "Press ", J.keyName, " again to exit") : _Q.default.createElement(_Q.default.Fragment, null, "Enter to confirm · Esc to exit"))))
}
// @from(Start 14190821, End 14192758)
function UD9({
  settings: A,
  domainExcluded: Q,
  onDone: B
}) {
  let G = EQ(),
    [Z, I] = _Q.useState(A.grove_enabled);
  _Q.default.useEffect(() => {
    GA("tengu_grove_privacy_settings_viewed", {})
  }, []), f1(async (J, W) => {
    if (W.escape) B();
    if (!Q && (W.tab || W.return || J === " ")) {
      let X = !Z;
      I(X), await i91(X)
    }
  });
  let Y = _Q.default.createElement($, {
    color: "error"
  }, "false");
  if (Q) Y = _Q.default.createElement($, {
    color: "error"
  }, "false (for emails with your domain)");
  else if (Z) Y = _Q.default.createElement($, {
    color: "success"
  }, "true");
  return _Q.default.createElement(_Q.default.Fragment, null, _Q.default.createElement(S, {
    flexDirection: "column",
    gap: 1,
    padding: 1,
    borderStyle: "round",
    borderColor: "professionalBlue"
  }, _Q.default.createElement(S, {
    flexDirection: "column",
    gap: 1
  }, _Q.default.createElement($, {
    bold: !0,
    color: "professionalBlue"
  }, "Data Privacy"), _Q.default.createElement($, null, "Review and manage your privacy settings at", " ", _Q.default.createElement(h4, {
    url: "https://claude.ai/settings/data-privacy-controls"
  })), _Q.default.createElement(S, null, _Q.default.createElement(S, {
    width: 44
  }, _Q.default.createElement($, {
    bold: !0
  }, "Help improve Claude")), _Q.default.createElement(S, null, Y)))), _Q.default.createElement(S, {
    marginLeft: 1
  }, Q ? _Q.default.createElement($, {
    dimColor: !0
  }, G.pending ? _Q.default.createElement(_Q.default.Fragment, null, "Press ", G.keyName, " again to exit") : _Q.default.createElement(_Q.default.Fragment, null, "Esc to exit")) : _Q.default.createElement($, {
    dimColor: !0
  }, G.pending ? _Q.default.createElement(_Q.default.Fragment, null, "Press ", G.keyName, " again to exit") : _Q.default.createElement(_Q.default.Fragment, null, "Enter/Tab/Space to toggle · Esc to exit"))))
}
// @from(Start 14192759, End 14193336)
async function $D9() {
  let [A, Q] = await Promise.all([bYA(), yi()]);
  if (zD9(A, Q, !1))
    if (GA("tengu_grove_print_viewed", {
        dismissable: Q?.notice_is_grace_period
      }), Q === null || Q.notice_is_grace_period) Sj(`
An update to our Consumer Terms and Privacy Policy will take effect on October 8, 2025. Run \`claude\` to review the updated terms.

`), await _Q0();
    else Sj(`
[ACTION REQUIRED] An update to our Consumer Terms and Privacy Policy has taken effect on October 8, 2025. You must run \`claude\` to review the updated terms.

`), await v6(1)
}
// @from(Start 14193341, End 14193343)
_Q
// @from(Start 14193345, End 14193550)
Nx3 = ` _____________
 |          \\  \\
 | NEW TERMS \\__\\
 |              |
 |  ----------  |
 |  ----------  |
 |  ----------  |
 |  ----------  |
 |  ----------  |
 |              |
 |______________|`
// @from(Start 14193556, End 14193650)
XJ1 = L(() => {
  hA();
  J5();
  q0();
  Q4();
  hYA();
  kW();
  hA();
  _Q = BA(VA(), 1)
})
// @from(Start 14193656, End 14193659)
wSA
// @from(Start 14193661, End 14193760)
wD9 = "Review and manage your privacy settings at https://claude.ai/settings/data-privacy-controls"
// @from(Start 14193764, End 14193767)
Ox3
// @from(Start 14193769, End 14193772)
qD9
// @from(Start 14193778, End 14195310)
ND9 = L(() => {
  XJ1();
  hYA();
  q0();
  gB();
  wSA = BA(VA(), 1), Ox3 = {
    type: "local-jsx",
    name: "privacy-settings",
    description: "View and update your privacy settings",
    isEnabled: () => {
      return OiA()
    },
    isHidden: !1,
    async call(A) {
      if (!await fYA()) return A(wD9), null;
      let [B, G] = await Promise.all([bYA(), yi()]);
      if (B === null) return A(wD9), null;
      async function Z(Y) {
        if (Y === "escape" || Y === "defer") {
          A("Privacy settings dialog dismissed", {
            display: "system"
          });
          return
        }
        await I()
      }
      async function I() {
        let Y = await bYA();
        if (Y === null) {
          A("Unable to retrieve updated privacy settings", {
            display: "system"
          });
          return
        }
        let J = Y.grove_enabled ? "true" : "false";
        if (A(`"Help improve Claude" set to ${J}.`), B !== null && B.grove_enabled !== null && B.grove_enabled !== Y.grove_enabled) GA("tengu_grove_policy_toggled", {
          state: Y.grove_enabled,
          location: "settings"
        })
      }
      if (B.grove_enabled !== null) return wSA.createElement(UD9, {
        settings: B,
        domainExcluded: G?.domain_excluded,
        onDone: I
      });
      return wSA.createElement(WJ1, {
        showIfAlreadyViewed: !0,
        onDone: Z,
        location: "settings"
      })
    },
    userFacingName() {
      return "privacy-settings"
    }
  }, qD9 = Ox3
})
// @from(Start 14195313, End 14197026)
function LD9({
  event: A,
  eventSummary: Q,
  config: B,
  matcher: G,
  onSuccess: Z,
  onCancel: I
}) {
  let [Y, J] = vF0.useState(!1), [W, X] = vF0.useState(null), V = HYA.map(R00), F = async (K) => {
    J(!0), X(null);
    try {
      await MZ2(A, B, G, K), Z()
    } catch (D) {
      X(D instanceof Error ? D.message : "Failed to add hook"), J(!1)
    }
  };
  if (Y) return m3.createElement(S, {
    flexDirection: "column",
    gap: 1
  }, m3.createElement(S, {
    flexDirection: "row",
    gap: 1
  }, m3.createElement(g4, null), m3.createElement($, null, "Adding hook configuration...")));
  if (W) return m3.createElement(S, {
    flexDirection: "column",
    gap: 1,
    borderStyle: "round",
    paddingLeft: 1,
    paddingRight: 1,
    borderColor: "error"
  }, m3.createElement($, {
    bold: !0,
    color: "error"
  }, "Failed to add hook"), m3.createElement($, null, W), m3.createElement(M0, {
    options: [{
      label: "OK",
      value: "ok"
    }],
    onChange: I,
    onCancel: I
  }));
  return m3.createElement(S, {
    flexDirection: "column",
    gap: 1,
    borderStyle: "round",
    paddingLeft: 1,
    paddingRight: 1,
    borderColor: "success"
  }, m3.createElement($, {
    bold: !0,
    color: "success"
  }, "Save hook configuration"), m3.createElement(S, {
    flexDirection: "column",
    marginX: 2
  }, m3.createElement($, null, "Event: ", A, " - ", Q), m3.createElement($, null, "Matcher: ", G), m3.createElement($, null, B.type === "command" ? "Command" : "Prompt", ":", " ", hE(B))), m3.createElement($, null, "Where should this hook be saved?"), m3.createElement(M0, {
    options: V,
    onChange: (K) => F(K),
    onCancel: I,
    visibleOptionCount: 3
  }))
}
// @from(Start 14197031, End 14197033)
m3
// @from(Start 14197035, End 14197038)
vF0
// @from(Start 14197044, End 14197141)
MD9 = L(() => {
  hA();
  dk();
  S5();
  DY();
  a21();
  m3 = BA(VA(), 1), vF0 = BA(VA(), 1)
})
// @from(Start 14197144, End 14200556)
function OD9({
  hookEventMetadata: A,
  exitStatePending: Q,
  exitStateKeyName: B,
  configDifference: G,
  restrictedByPolicy: Z,
  onSelectEvent: I
}) {
  return XB.createElement(XB.Fragment, null, XB.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    paddingLeft: 1,
    paddingRight: 1,
    borderColor: "warning"
  }, XB.createElement(S, {
    flexDirection: "column",
    marginBottom: 1
  }, XB.createElement(S, null, XB.createElement($, {
    bold: !0,
    color: "warning"
  }, "Hook Configuration")), XB.createElement(S, {
    flexDirection: "column"
  }, XB.createElement(S, {
    marginY: 1
  }, XB.createElement($, null, tA.bold("Hooks"), " are shell commands you can register to run during Claude Code processing.", " ", XB.createElement(h4, {
    url: "https://code.claude.com/docs/en/hooks"
  }, "Docs"))), XB.createElement(S, {
    flexDirection: "column",
    paddingTop: 1
  }, XB.createElement($, null, "• Each hook event has its own input and output behavior"), XB.createElement($, null, "• Multiple hooks can be registered per event, executed in parallel"), XB.createElement($, null, "• Any changes to hooks outside of /hooks require a restart"), XB.createElement($, null, "• Timeout: 60 seconds"))), XB.createElement(S, {
    flexDirection: "column",
    marginY: 1
  }, XB.createElement($, null, H1.warning, " Hooks execute shell commands with your full user permissions. This can pose security risks, so only use hooks from trusted sources."), XB.createElement($, {
    dimColor: !0
  }, "Learn more:", " ", XB.createElement(h4, {
    url: "https://code.claude.com/docs/en/hooks"
  }, "https://code.claude.com/docs/en/hooks"))), Z && XB.createElement(S, {
    borderStyle: "round",
    borderColor: "suggestion",
    paddingX: 1,
    marginY: 1
  }, XB.createElement(S, {
    flexDirection: "column"
  }, XB.createElement($, {
    bold: !0,
    color: "suggestion"
  }, H1.info, " Hooks Restricted by Policy"), XB.createElement($, null, "Only hooks from managed settings can run. User-defined hooks from ~/.claude/settings.json, .claude/settings.json, and .claude/settings.local.json are blocked."))), G && XB.createElement(S, {
    borderStyle: "round",
    borderColor: "warning",
    paddingX: 1,
    marginY: 1
  }, XB.createElement(S, {
    flexDirection: "column"
  }, XB.createElement($, {
    bold: !0,
    color: "warning"
  }, H1.warning, " Settings Changed"), XB.createElement($, null, "Hook settings have been modified outside of this menu. Review the following changes carefully:"), XB.createElement($, {
    dimColor: !0
  }, G)))), XB.createElement(S, {
    flexDirection: "column"
  }, XB.createElement($, {
    bold: !0
  }, "Select hook event:"), XB.createElement(M0, {
    onChange: (Y) => {
      if (Y === "disable-all") I("disable-all");
      else I(Y)
    },
    onCancel: () => {},
    options: [...Object.entries(A).map(([Y, J]) => ({
      label: `${Y} - ${J.summary}`,
      value: Y
    })), {
      label: tA.red("Disable all hooks"),
      value: "disable-all"
    }]
  }))), XB.createElement(S, {
    marginLeft: 3
  }, XB.createElement($, {
    dimColor: !0
  }, Q ? XB.createElement(XB.Fragment, null, "Press ", B, " again to exit") : XB.createElement(XB.Fragment, null, XB.createElement(E4, {
    shortcut: "Enter",
    action: "select"
  }), " · ", XB.createElement(E4, {
    shortcut: "Esc",
    action: "exit"
  })))))
}
// @from(Start 14200561, End 14200563)
XB
// @from(Start 14200569, End 14200654)
RD9 = L(() => {
  hA();
  S5();
  F9();
  V9();
  hA();
  dF();
  XB = BA(VA(), 1)
})
// @from(Start 14200657, End 14202310)
function TD9({
  selectedEvent: A,
  matchersForSelectedEvent: Q,
  hooksByEventAndMatcher: B,
  eventDescription: G,
  onSelect: Z,
  onCancel: I
}) {
  let Y = K7.useMemo(() => {
    return Q.map((J) => {
      let W = B[A]?.[J] || [],
        X = Array.from(new Set(W.map((V) => V.source)));
      return {
        matcher: J,
        sources: X,
        hookCount: W.length
      }
    })
  }, [Q, B, A]);
  return K7.createElement(K7.Fragment, null, K7.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    paddingLeft: 1,
    paddingRight: 1,
    borderColor: "suggestion"
  }, K7.createElement($, {
    bold: !0,
    color: "suggestion"
  }, A, " - Tool Matchers"), G && K7.createElement(S, {
    marginTop: 1
  }, K7.createElement($, {
    dimColor: !0
  }, G)), K7.createElement(S, {
    marginY: 1
  }, K7.createElement(M0, {
    options: [{
      label: `+ Add new matcher${H1.ellipsis}`,
      value: "add-new"
    }, ...Y.map((J) => {
      return {
        label: `[${J.sources.map(TZ2).join(", ")}] ${J.matcher}`,
        value: J.matcher,
        description: `${J.hookCount} hook${J.hookCount!==1?"s":""}`
      }
    })],
    onChange: (J) => {
      if (J === "add-new") Z(null);
      else Z(J)
    },
    onCancel: I
  }), Q.length === 0 && K7.createElement(S, {
    marginLeft: 2
  }, K7.createElement($, {
    dimColor: !0
  }, "No matchers configured yet")))), K7.createElement(S, {
    marginLeft: 3
  }, K7.createElement($, {
    dimColor: !0
  }, K7.createElement(E4, {
    shortcut: "Enter",
    action: "select"
  }), " · ", K7.createElement(E4, {
    shortcut: "Esc",
    action: "go back"
  }))))
}
// @from(Start 14202315, End 14202317)
K7
// @from(Start 14202323, End 14202400)
PD9 = L(() => {
  hA();
  V9();
  dk();
  S5();
  dF();
  K7 = BA(VA(), 1)
})
// @from(Start 14202403, End 14204028)
function jD9({
  selectedEvent: A,
  newMatcher: Q,
  onChangeNewMatcher: B,
  eventDescription: G,
  matcherMetadata: Z
}) {
  let [I, Y] = y8.useState(Q.length);
  return y8.createElement(y8.Fragment, null, y8.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    paddingLeft: 1,
    paddingRight: 1,
    borderColor: "success",
    gap: 1
  }, y8.createElement($, {
    bold: !0,
    color: "success"
  }, "Add new matcher for ", A), G && y8.createElement(S, {
    marginBottom: 1
  }, y8.createElement($, {
    dimColor: !0
  }, G)), y8.createElement(S, {
    flexDirection: "column",
    gap: 1
  }, y8.createElement($, null, "Possible matcher values for field ", Z.fieldToMatch, ":"), y8.createElement($, {
    dimColor: !0
  }, Z.values.join(", "))), y8.createElement(S, {
    flexDirection: "column"
  }, y8.createElement($, null, "Tool matcher:"), y8.createElement(S, {
    borderStyle: "round",
    borderDimColor: !0,
    paddingLeft: 1,
    paddingRight: 1
  }, y8.createElement(s4, {
    value: Q,
    onChange: B,
    columns: 78,
    showCursor: !0,
    cursorOffset: I,
    onChangeCursorOffset: Y
  }))), y8.createElement(S, {
    flexDirection: "column",
    gap: 1
  }, y8.createElement($, {
    dimColor: !0
  }, "Example Matchers:", `
`, "• Write (single tool)", `
`, "• Write|Edit (multiple tools)", `
`, "• Web.* (regex pattern)"))), y8.createElement(S, {
    marginLeft: 3
  }, y8.createElement($, {
    dimColor: !0
  }, y8.createElement(E4, {
    shortcut: "Enter",
    action: "confirm"
  }), " · ", y8.createElement(E4, {
    shortcut: "Esc",
    action: "cancel"
  }))))
}
// @from(Start 14204033, End 14204035)
y8
// @from(Start 14204041, End 14204102)
SD9 = L(() => {
  hA();
  ZY();
  dF();
  y8 = BA(VA(), 1)
})
// @from(Start 14204105, End 14206871)
function _D9({
  selectedEvent: A,
  selectedMatcher: Q,
  eventDescription: B,
  fullDescription: G,
  supportsMatcher: Z,
  command: I,
  onChangeCommand: Y
}) {
  let [J, W] = f2.useState(I.length), {
    columns: X
  } = WB(), V = I.trim().split(/\s+/)[0] || "", F = V && !V.startsWith("/") && !V.startsWith("~") && V.includes("/"), K = /\bsudo\b/.test(I);
  return f2.createElement(f2.Fragment, null, f2.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    paddingLeft: 1,
    paddingRight: 1,
    borderColor: "success",
    gap: 1
  }, f2.createElement($, {
    bold: !0,
    color: "success"
  }, "Add new hook"), f2.createElement(S, {
    flexDirection: "column"
  }, f2.createElement($, null, H1.warning, " Hooks execute shell commands with your full user permissions. This can pose security risks, so only use hooks from trusted sources."), f2.createElement($, {
    dimColor: !0
  }, "Learn more:", " ", f2.createElement(h4, {
    url: "https://code.claude.com/docs/en/hooks"
  }, "https://code.claude.com/docs/en/hooks"))), f2.createElement($, null, "Event: ", f2.createElement($, {
    bold: !0
  }, A), " - ", B), G && f2.createElement(S, null, f2.createElement($, {
    dimColor: !0
  }, G)), Z && f2.createElement($, null, "Matcher: ", f2.createElement($, {
    bold: !0
  }, Q)), f2.createElement($, null, "Command:"), f2.createElement(S, {
    borderStyle: "round",
    borderDimColor: !0,
    paddingLeft: 1,
    paddingRight: 1
  }, f2.createElement(s4, {
    value: I,
    onChange: Y,
    columns: X - 8,
    showCursor: !0,
    cursorOffset: J,
    onChangeCursorOffset: W,
    multiline: !0
  })), (F || K) && f2.createElement(S, {
    flexDirection: "column",
    gap: 0
  }, F && f2.createElement($, {
    color: "warning"
  }, H1.warning, " Warning: Using a relative path for the executable may be insecure. Consider using an absolute path instead."), K && f2.createElement($, {
    color: "warning"
  }, H1.warning, " Warning: Using sudo in hooks can be dangerous and may expose your system to security risks.")), f2.createElement($, {
    dimColor: !0
  }, "Examples:", f2.createElement(bF, null), `• jq -r '.tool_input.file_path | select(endswith(".go"))' | xargs -r gofmt -w`, f2.createElement(bF, null), `• jq -r '"\\(.tool_input.command) - \\(.tool_input.description // "No description")"' >> ~/.claude/bash-command-log.txt`, f2.createElement(bF, null), "• /usr/local/bin/security_check.sh", f2.createElement(bF, null), "• python3 ~/hooks/validate_changes.py")), f2.createElement(S, {
    marginLeft: 3
  }, f2.createElement($, {
    dimColor: !0
  }, f2.createElement(E4, {
    shortcut: "Enter",
    action: "confirm"
  }), " · ", f2.createElement(E4, {
    shortcut: "Esc",
    action: "cancel"
  }))))
}
// @from(Start 14206876, End 14206878)
f2
// @from(Start 14206884, End 14206969)
kD9 = L(() => {
  hA();
  ZY();
  V9();
  hA();
  i8();
  dF();
  f2 = BA(VA(), 1)
})
// @from(Start 14206972, End 14208048)
function yD9({
  selectedMatcher: A,
  selectedEvent: Q,
  onDelete: B,
  onCancel: G
}) {
  return iG.createElement(iG.Fragment, null, iG.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    paddingLeft: 1,
    paddingRight: 1,
    borderColor: "error",
    gap: 1
  }, iG.createElement($, {
    bold: !0,
    color: "error"
  }, "Delete matcher?"), iG.createElement(S, {
    flexDirection: "column",
    marginX: 2
  }, iG.createElement($, {
    bold: !0
  }, A), iG.createElement($, {
    color: "text"
  }, "Event: ", Q)), iG.createElement($, null, "This matcher has no hooks configured. Delete it?"), iG.createElement(M0, {
    onChange: (Z) => Z === "yes" ? B() : G(),
    onCancel: G,
    options: [{
      label: "Yes",
      value: "yes"
    }, {
      label: "No",
      value: "no"
    }]
  })), iG.createElement(S, {
    marginLeft: 3
  }, iG.createElement($, {
    dimColor: !0
  }, iG.createElement(E4, {
    shortcut: "Enter",
    action: "confirm"
  }), " · ", iG.createElement(E4, {
    shortcut: "Esc",
    action: "cancel"
  }))))
}
// @from(Start 14208053, End 14208055)
iG
// @from(Start 14208061, End 14208122)
xD9 = L(() => {
  hA();
  S5();
  dF();
  iG = BA(VA(), 1)
})
// @from(Start 14208125, End 14209758)
function vD9({
  selectedEvent: A,
  selectedMatcher: Q,
  hooksForSelectedMatcher: B,
  hookEventMetadata: G,
  onSelect: Z,
  onCancel: I
}) {
  return e7.createElement(e7.Fragment, null, e7.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    paddingLeft: 1,
    paddingRight: 1,
    borderColor: "success"
  }, e7.createElement($, {
    bold: !0,
    color: "success"
  }, A, G.matcherMetadata !== void 0 ? ` - Matcher: ${Q}` : ""), G.description && e7.createElement(S, {
    marginTop: 1
  }, e7.createElement($, {
    dimColor: !0
  }, G.description)), e7.createElement(S, {
    marginY: 1
  }, e7.createElement(M0, {
    options: [{
      label: `+ Add new hook${H1.ellipsis}`,
      value: "add-new"
    }, ...B.map((Y, J) => ({
      label: Y.source === "pluginHook" ? `${hE(Y.config)} (read-only)` : hE(Y.config),
      value: J.toString(),
      description: Y.source === "pluginHook" ? `${T00(Y.source)} - disable ${Y.pluginName?Y.pluginName:"plugin"} to remove` : T00(Y.source),
      disabled: Y.source === "pluginHook"
    }))],
    onChange: (Y) => {
      if (Y === "add-new") Z(null);
      else {
        let J = parseInt(Y, 10),
          W = B[J];
        if (W) Z(W)
      }
    },
    onCancel: I
  }), B.length === 0 && e7.createElement(S, {
    marginLeft: 2
  }, e7.createElement($, {
    dimColor: !0
  }, "No hooks configured yet")))), e7.createElement(S, {
    marginLeft: 3
  }, e7.createElement($, {
    dimColor: !0
  }, e7.createElement(E4, {
    shortcut: "Enter",
    action: "select"
  }), " · ", e7.createElement(E4, {
    shortcut: "Esc",
    action: "go back"
  }))))
}
// @from(Start 14209763, End 14209765)
e7
// @from(Start 14209771, End 14209848)
bD9 = L(() => {
  V9();
  hA();
  dk();
  S5();
  dF();
  e7 = BA(VA(), 1)
})
// @from(Start 14209851, End 14211089)
function fD9({
  selectedHook: A,
  eventSupportsMatcher: Q,
  onDelete: B,
  onCancel: G
}) {
  return D7.createElement(D7.Fragment, null, D7.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    paddingLeft: 1,
    paddingRight: 1,
    borderColor: "error",
    gap: 1
  }, D7.createElement($, {
    bold: !0,
    color: "error"
  }, "Delete hook?"), D7.createElement(S, {
    flexDirection: "column",
    marginX: 2
  }, D7.createElement($, {
    bold: !0
  }, hE(A.config)), D7.createElement($, {
    dimColor: !0
  }, "Event: ", A.event), Q && D7.createElement($, {
    dimColor: !0
  }, "Matcher: ", A.matcher), D7.createElement($, {
    dimColor: !0
  }, RZ2(A.source))), D7.createElement($, null, "This will remove the hook configuration from your settings."), D7.createElement(M0, {
    onChange: (Z) => Z === "yes" ? B() : G(),
    onCancel: G,
    options: [{
      label: "Yes",
      value: "yes"
    }, {
      label: "No",
      value: "no"
    }]
  })), D7.createElement(S, {
    marginLeft: 3
  }, D7.createElement($, {
    dimColor: !0
  }, D7.createElement(E4, {
    shortcut: "Enter",
    action: "confirm"
  }), " · ", D7.createElement(E4, {
    shortcut: "Esc",
    action: "cancel"
  }))))
}
// @from(Start 14211094, End 14211096)
D7
// @from(Start 14211102, End 14211171)
hD9 = L(() => {
  hA();
  dk();
  S5();
  dF();
  D7 = BA(VA(), 1)
})
// @from(Start 14211174, End 14212284)
function gD9(A, Q) {
  let B = {
      PreToolUse: {},
      PostToolUse: {},
      PostToolUseFailure: {},
      Notification: {},
      UserPromptSubmit: {},
      SessionStart: {},
      SessionEnd: {},
      Stop: {},
      SubagentStart: {},
      SubagentStop: {},
      PreCompact: {},
      PermissionRequest: {}
    },
    G = qSA(Q);
  LZ2(A).forEach((I) => {
    let Y = B[I.event];
    if (Y) {
      let J = G[I.event].matcherMetadata !== void 0 ? I.matcher || "" : "";
      if (!Y[J]) Y[J] = [];
      Y[J].push(I)
    }
  });
  let Z = MkA();
  if (Z)
    for (let [I, Y] of Object.entries(Z)) {
      let J = I,
        W = B[J];
      if (!W) continue;
      for (let X of Y) {
        let V = X.matcher || "";
        if (!W[V]) W[V] = [];
        for (let F of X.hooks)
          if (F.type === "callback") W[V].push({
            event: J,
            config: {
              type: "command",
              command: "[Plugin Hook]"
            },
            matcher: X.matcher,
            source: "pluginHook",
            pluginName: X.pluginName
          })
      }
    }
  return B
}
// @from(Start 14212286, End 14212365)
function uD9(A, Q) {
  let B = Object.keys(A[Q] || {});
  return PZ2(B, A, Q)
}
// @from(Start 14212367, End 14212436)
function mD9(A, Q, B) {
  let G = B ?? "";
  return A[Q]?.[G] ?? []
}
// @from(Start 14212438, End 14212494)
function sg(A, Q) {
  return qSA(Q)[A].matcherMetadata
}
// @from(Start 14212496, End 14212545)
function dD9(A, Q) {
  return qSA(Q)[A].summary
}
// @from(Start 14212550, End 14212553)
qSA
// @from(Start 14212559, End 14217271)
cD9 = L(() => {
  l2();
  dk();
  _0();
  qSA = s1(function(A) {
    return {
      PreToolUse: {
        summary: "Before tool execution",
        description: `Input to command is JSON of tool call arguments.
Exit code 0 - stdout/stderr not shown
Exit code 2 - show stderr to model and block tool call
Other exit codes - show stderr to user only but continue with tool call`,
        matcherMetadata: {
          fieldToMatch: "tool_name",
          values: A
        }
      },
      PostToolUse: {
        summary: "After tool execution",
        description: `Input to command is JSON with fields "inputs" (tool call arguments) and "response" (tool call response).
Exit code 0 - stdout shown in transcript mode (ctrl+o)
Exit code 2 - show stderr to model immediately
Other exit codes - show stderr to user only`,
        matcherMetadata: {
          fieldToMatch: "tool_name",
          values: A
        }
      },
      PostToolUseFailure: {
        summary: "After tool execution fails",
        description: `Input to command is JSON with tool_name, tool_input, tool_use_id, error, error_type, is_interrupt, and is_timeout.
Exit code 0 - stdout shown in transcript mode (ctrl+o)
Exit code 2 - show stderr to model immediately
Other exit codes - show stderr to user only`,
        matcherMetadata: {
          fieldToMatch: "tool_name",
          values: A
        }
      },
      Notification: {
        summary: "When notifications are sent",
        description: `Input to command is JSON with notification message and type.
Exit code 0 - stdout/stderr not shown
Other exit codes - show stderr to user only`,
        matcherMetadata: {
          fieldToMatch: "notification_type",
          values: ["permission_prompt", "idle_prompt", "auth_success", "elicitation_dialog"]
        }
      },
      UserPromptSubmit: {
        summary: "When the user submits a prompt",
        description: `Input to command is JSON with original user prompt text.
Exit code 0 - stdout shown to Claude
Exit code 2 - block processing, erase original prompt, and show stderr to user only
Other exit codes - show stderr to user only`
      },
      SessionStart: {
        summary: "When a new session is started",
        description: `Input to command is JSON with session start source.
Exit code 0 - stdout shown to Claude
Blocking errors are ignored
Other exit codes - show stderr to user only`,
        matcherMetadata: {
          fieldToMatch: "source",
          values: ["startup", "resume", "clear", "compact"]
        }
      },
      Stop: {
        summary: "Right before Claude concludes its response",
        description: `Exit code 0 - stdout/stderr not shown
Exit code 2 - show stderr to model and continue conversation
Other exit codes - show stderr to user only`
      },
      SubagentStart: {
        summary: "When a subagent (Task tool call) is started",
        description: `Input to command is JSON with agent_id and agent_type.
Exit code 0 - stdout shown to subagent
Blocking errors are ignored
Other exit codes - show stderr to user only`,
        matcherMetadata: {
          fieldToMatch: "agent_type",
          values: []
        }
      },
      SubagentStop: {
        summary: "Right before a subagent (Task tool call) concludes its response",
        description: `Exit code 0 - stdout/stderr not shown
Exit code 2 - show stderr to subagent and continue having it run
Other exit codes - show stderr to user only`
      },
      PreCompact: {
        summary: "Before conversation compaction",
        description: `Input to command is JSON with compaction details.
Exit code 0 - stdout appended as custom compact instructions
Exit code 2 - block compaction
Other exit codes - show stderr to user only but continue with compaction`,
        matcherMetadata: {
          fieldToMatch: "trigger",
          values: ["manual", "auto"]
        }
      },
      SessionEnd: {
        summary: "When a session is ending",
        description: `Input to command is JSON with session end reason.
Exit code 0 - command completes successfully
Other exit codes - show stderr to user only`,
        matcherMetadata: {
          fieldToMatch: "reason",
          values: ["clear", "logout", "prompt_input_exit", "other"]
        }
      },
      PermissionRequest: {
        summary: "When a permission dialog is displayed",
        description: `Input to command is JSON with tool_name, tool_input, and tool_use_id.
Output JSON with hookSpecificOutput containing decision to allow or deny.
Exit code 0 - use hook decision if provided
Other exit codes - show stderr to user only`,
        matcherMetadata: {
          fieldToMatch: "tool_name",
          values: A
        }
      }
    }
  })
})
// @from(Start 14217274, End 14228912)
function pD9({
  toolNames: A,
  onExit: Q
}) {
  let [B, G] = rJ.useState([]), [Z, I] = rJ.useState({
    mode: "select-event"
  }), [Y, J] = rJ.useState(0), [W, X] = rJ.useState(() => {
    return l0()?.disableAllHooks === !0 && OB("policySettings")?.disableAllHooks === !0
  }), [V, F] = rJ.useState(() => {
    return OB("policySettings")?.allowManagedHooksOnly === !0
  });
  t7A((NA) => {
    if (NA === "policySettings") {
      let mA = l0()?.disableAllHooks === !0;
      X(mA && OB("policySettings")?.disableAllHooks === !0), F(OB("policySettings")?.allowManagedHooksOnly === !0)
    }
  });
  let [K, D] = rJ.useState(""), [H, C] = rJ.useState(""), E = Z.mode, U = "event" in Z ? Z.event : "PreToolUse", q = "matcher" in Z ? Z.matcher : null, [w] = OQ(), {
    mcp: N
  } = w, R = rJ.useMemo(() => [...A, ...N.tools.map((NA) => NA.name)], [A, N.tools]), T = rJ.useMemo(() => gD9(w, R), [R, Y, w]), y = rJ.useMemo(() => uD9(T, U), [T, U]), v = rJ.useMemo(() => mD9(T, U, q), [T, U, q]), x = EQ();
  f1((NA, OA) => {
    if (E === "save-hook") return;
    if (OA.escape) {
      switch (E) {
        case "select-event":
          if (B.length > 0) Q(B.join(`
`));
          else Q("Hooks dialog dismissed", {
            display: "system"
          });
          break;
        case "select-matcher":
          I({
            mode: "select-event"
          });
          break;
        case "add-matcher":
          if ("event" in Z) I({
            mode: "select-matcher",
            event: Z.event,
            matcherMetadata: Z.matcherMetadata
          });
          C("");
          break;
        case "delete-matcher":
          if ("event" in Z) I({
            mode: "select-matcher",
            event: Z.event,
            matcherMetadata: Z.matcherMetadata
          });
          break;
        case "select-hook":
          if ("event" in Z) {
            let mA = sg(Z.event, R);
            if (mA !== void 0) I({
              mode: "select-matcher",
              event: Z.event,
              matcherMetadata: mA
            });
            else I({
              mode: "select-event"
            })
          }
          break;
        case "add-hook":
          if ("event" in Z && "matcher" in Z) I({
            mode: "select-hook",
            event: Z.event,
            matcher: Z.matcher
          });
          D("");
          break;
        case "delete-hook":
          if ("event" in Z && Z.mode === "delete-hook") {
            let {
              hook: mA
            } = Z;
            I({
              mode: "select-hook",
              event: Z.event,
              matcher: mA.matcher || ""
            })
          }
          break
      }
      return
    }
    switch (E) {
      case "select-event":
        if (OA.return) {
          let mA = U,
            wA = sg(mA, R);
          if (wA !== void 0) I({
            mode: "select-matcher",
            event: mA,
            matcherMetadata: wA
          });
          else I({
            mode: "select-hook",
            event: mA,
            matcher: ""
          })
        }
        break;
      case "add-matcher":
        if (OA.return && H.trim() && "event" in Z) I({
          mode: "select-hook",
          event: Z.event,
          matcher: H.trim()
        });
        break;
      case "add-hook":
        if (OA.return && K.trim() && "event" in Z && "matcher" in Z) {
          let mA = {
            event: Z.event,
            config: {
              type: "command",
              command: K.trim()
            },
            matcher: sg(Z.event, R) !== void 0 ? Z.matcher : ""
          };
          I({
            mode: "save-hook",
            event: Z.event,
            hookToSave: mA
          })
        }
        break;
      case "delete-matcher":
      case "delete-hook":
      case "select-matcher":
      case "select-hook":
        break
    }
  });
  let p = rJ.useCallback(() => {
      if (Z.mode === "save-hook") {
        let {
          hookToSave: NA
        } = Z;
        G((OA) => [...OA, `Added ${NA.event} hook: ${tA.bold(hE(NA.config))}`]), I({
          mode: "select-hook",
          event: NA.event,
          matcher: NA.matcher
        })
      }
      D(""), J((NA) => NA + 1)
    }, [Z]),
    u = rJ.useCallback(() => {
      if (Z.mode === "save-hook") {
        let {
          hookToSave: NA
        } = Z;
        I({
          mode: "select-hook",
          event: NA.event,
          matcher: NA.matcher
        })
      }
      D("")
    }, [Z]),
    e = rJ.useCallback(async () => {
      if (Z.mode !== "delete-hook") return;
      let {
        hook: NA,
        event: OA
      } = Z;
      await OZ2(NA), G((qA) => [...qA, `Deleted ${NA.event} hook: ${tA.bold(hE(NA.config))}`]), J((qA) => qA + 1);
      let mA = NA.matcher || "",
        wA = T[OA]?.[mA]?.filter((qA) => !SMA(qA.config, NA.config));
      if (!wA || wA.length === 0) {
        let qA = sg(OA, R);
        if (qA !== void 0) I({
          mode: "select-matcher",
          event: OA,
          matcherMetadata: qA
        });
        else I({
          mode: "select-event"
        })
      } else I({
        mode: "select-hook",
        event: OA,
        matcher: mA
      })
    }, [Z, T, R]),
    l = rJ.useCallback(() => {
      if (Z.mode === "delete-matcher") {
        let {
          matcher: NA,
          event: OA
        } = Z;
        G((mA) => [...mA, `Deleted matcher: ${tA.bold(NA)}`]), I({
          mode: "select-matcher",
          event: OA,
          matcherMetadata: Z.matcherMetadata
        })
      }
    }, [Z]),
    k = qSA(R),
    m = jZ2();
  rJ.useEffect(() => {
    _MA()
  }, []);
  let IA = l0()?.disableAllHooks === !0,
    FA = rJ.useCallback(() => {
      Q(B.length > 0 ? B.join(`
`) : "Hooks dialog dismissed", {
        display: B.length === 0 ? "system" : void 0
      })
    }, [B, Q]),
    zA = rJ.useMemo(() => Object.values(T).reduce((NA, OA) => {
      return NA + Object.values(OA).reduce((mA, wA) => mA + wA.length, 0)
    }, 0), [T]);
  if (IA) return k9.createElement(k9.Fragment, null, k9.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    paddingLeft: 1,
    paddingRight: 1,
    borderColor: "warning"
  }, k9.createElement(S, {
    flexDirection: "column",
    marginBottom: 1
  }, k9.createElement(S, null, k9.createElement($, {
    bold: !0,
    color: "warning"
  }, "Hook Configuration - Disabled")), k9.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, k9.createElement($, null, "All hooks are currently ", tA.red("disabled"), W && " by a managed settings file", ". You have", " ", tA.bold(zA), " configured hook", zA !== 1 ? "s" : "", " that", " ", zA !== 1 ? "are" : "is", " not running."), k9.createElement(S, {
    marginTop: 1
  }, k9.createElement($, null, "When hooks are disabled:")), k9.createElement($, null, "• No hook commands will execute"), k9.createElement($, null, "• StatusLine will not be displayed"), k9.createElement($, null, "• Tool operations will proceed without hook validation"))), !W && k9.createElement(S, {
    flexDirection: "column"
  }, k9.createElement($, {
    bold: !0
  }, "Options:"), k9.createElement(M0, {
    options: [{
      label: "Re-enable all hooks",
      value: "enable"
    }, {
      label: "Exit",
      value: "exit"
    }],
    onChange: (NA) => {
      if (NA === "enable") cB("localSettings", {
        disableAllHooks: !1
      }), Q("Re-enabled all hooks");
      else FA()
    },
    onCancel: FA
  }))), k9.createElement(S, {
    marginLeft: 3
  }, k9.createElement($, {
    dimColor: !0
  }, W ? "Esc to exit" : "Enter to select · Esc to exit")));
  switch (Z.mode) {
    case "save-hook":
      return k9.createElement(LD9, {
        event: Z.hookToSave.event,
        eventSummary: k[Z.hookToSave.event].summary,
        config: Z.hookToSave.config,
        matcher: Z.hookToSave.matcher,
        onSuccess: p,
        onCancel: u
      });
    case "select-event":
      return k9.createElement(OD9, {
        hookEventMetadata: k,
        exitStatePending: x.pending,
        exitStateKeyName: x.keyName || void 0,
        configDifference: m,
        restrictedByPolicy: V,
        onSelectEvent: (NA) => {
          if (NA === "disable-all") cB("localSettings", {
            disableAllHooks: !0
          }), Q("All hooks have been disabled");
          else {
            let OA = sg(NA, R);
            if (OA !== void 0) I({
              mode: "select-matcher",
              event: NA,
              matcherMetadata: OA
            });
            else I({
              mode: "select-hook",
              event: NA,
              matcher: ""
            })
          }
        }
      });
    case "select-matcher":
      return k9.createElement(TD9, {
        selectedEvent: Z.event,
        matchersForSelectedEvent: y,
        hooksByEventAndMatcher: T,
        eventDescription: k[Z.event].description,
        onSelect: (NA) => {
          if (NA === null) I({
            mode: "add-matcher",
            event: Z.event,
            matcherMetadata: Z.matcherMetadata
          });
          else if ((T[Z.event]?.[NA] || []).length === 0) I({
            mode: "delete-matcher",
            event: Z.event,
            matcher: NA,
            matcherMetadata: Z.matcherMetadata
          });
          else I({
            mode: "select-hook",
            event: Z.event,
            matcher: NA
          })
        },
        onCancel: () => {
          I({
            mode: "select-event"
          })
        }
      });
    case "add-matcher":
      return k9.createElement(jD9, {
        selectedEvent: Z.event,
        newMatcher: H,
        onChangeNewMatcher: C,
        eventDescription: k[Z.event].description,
        matcherMetadata: Z.matcherMetadata
      });
    case "delete-matcher":
      return k9.createElement(yD9, {
        selectedMatcher: Z.matcher,
        selectedEvent: Z.event,
        onDelete: l,
        onCancel: () => I({
          mode: "select-matcher",
          event: Z.event,
          matcherMetadata: Z.matcherMetadata
        })
      });
    case "select-hook":
      return k9.createElement(vD9, {
        selectedEvent: Z.event,
        selectedMatcher: Z.matcher,
        hooksForSelectedMatcher: v,
        hookEventMetadata: k[Z.event],
        onSelect: (NA) => {
          if (NA === null) I({
            mode: "add-hook",
            event: Z.event,
            matcher: Z.matcher
          });
          else I({
            mode: "delete-hook",
            event: Z.event,
            hook: NA
          })
        },
        onCancel: () => {
          let NA = sg(Z.event, R);
          if (NA !== void 0) I({
            mode: "select-matcher",
            event: Z.event,
            matcherMetadata: NA
          });
          else I({
            mode: "select-event"
          })
        }
      });
    case "add-hook":
      return k9.createElement(_D9, {
        selectedEvent: Z.event,
        selectedMatcher: Z.matcher,
        eventDescription: dD9(Z.event, R),
        fullDescription: k[Z.event].description,
        supportsMatcher: sg(Z.event, R) !== void 0,
        command: K,
        onChangeCommand: D
      });
    case "delete-hook":
      return k9.createElement(fD9, {
        selectedHook: Z.hook,
        eventSupportsMatcher: sg(Z.event, R) !== void 0,
        onDelete: e,
        onCancel: () => {
          let {
            event: NA,
            hook: OA
          } = Z;
          I({
            mode: "select-hook",
            event: NA,
            matcher: OA.matcher || ""
          })
        }
      })
  }
}
// @from(Start 14228917, End 14228919)
k9
// @from(Start 14228921, End 14228923)
rJ
// @from(Start 14228929, End 14229139)
lD9 = L(() => {
  F9();
  hA();
  Q4();
  dk();
  MD9();
  RD9();
  PD9();
  SD9();
  kD9();
  xD9();
  bD9();
  hD9();
  J5();
  cD9();
  CYA();
  z9();
  MB();
  YrA();
  k9 = BA(VA(), 1), rJ = BA(VA(), 1)
})
// @from(Start 14229145, End 14229148)
bF0
// @from(Start 14229150, End 14229153)
Rx3
// @from(Start 14229155, End 14229158)
iD9
// @from(Start 14229164, End 14229657)
nD9 = L(() => {
  lD9();
  yq();
  bF0 = BA(VA(), 1), Rx3 = {
    type: "local-jsx",
    name: "hooks",
    description: "Manage hook configurations for tool events",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A, Q) {
      let G = (await Q.getAppState()).toolPermissionContext,
        Z = LC(G).map((I) => I.name);
      return bF0.createElement(pD9, {
        toolNames: Z,
        onExit: A
      })
    },
    userFacingName() {
      return "hooks"
    }
  }, iD9 = Rx3
})
// @from(Start 14229705, End 14229708)
Px3
// @from(Start 14229710, End 14229713)
aD9
// @from(Start 14229719, End 14230305)
sD9 = L(() => {
  U2();
  vM();
  Px3 = {
    type: "local",
    name: "files",
    description: "List all files currently in context",
    isEnabled: () => !1,
    isHidden: !1,
    supportsNonInteractive: !0,
    async call(A, Q) {
      let B = Q.readFileState ? _l(Q.readFileState) : [];
      if (B.length === 0) return {
        type: "text",
        value: "No files in context"
      };
      return {
        type: "text",
        value: `Files in context:
${B.map((Z)=>Tx3(W0(),Z)).join(`
`)}`
      }
    },
    userFacingName() {
      return "files"
    }
  }, aD9 = Px3
})
// @from(Start 14230311, End 14230313)
Ex
// @from(Start 14230319, End 14230403)
rD9 = L(() => {
  Ex = {
    FOLDER_NAME: ".claude",
    AGENTS_DIR: "agents"
  }
})
// @from(Start 14230443, End 14230734)
function oD9(A, Q, B, G, Z, I) {
  let Y = Q.replace(/\n/g, "\\n"),
    W = B === void 0 || B.length === 1 && B[0] === "*" ? "" : `
tools: ${B.join(", ")}`,
    X = I ? `
model: ${I}` : "",
    V = Z ? `
color: ${Z}` : "";
  return `---
name: ${A}
description: ${Y}${W}${X}${V}
---

${G}
`
}
// @from(Start 14230736, End 14231168)
function VJ1(A) {
  switch (A) {
    case "flagSettings":
      throw Error(`Cannot get directory path for ${A} agents`);
    case "userSettings":
      return rg(MQ(), Ex.AGENTS_DIR);
    case "projectSettings":
      return rg(W0(), Ex.FOLDER_NAME, Ex.AGENTS_DIR);
    case "policySettings":
      return rg(iw(), Ex.FOLDER_NAME, Ex.AGENTS_DIR);
    case "localSettings":
      return rg(W0(), Ex.FOLDER_NAME, Ex.AGENTS_DIR)
  }
}
// @from(Start 14231170, End 14231322)
function tD9(A) {
  switch (A) {
    case "projectSettings":
      return rg(".", Ex.FOLDER_NAME, Ex.AGENTS_DIR);
    default:
      return VJ1(A)
  }
}
// @from(Start 14231324, End 14231404)
function fF0(A) {
  let Q = VJ1(A.source);
  return rg(Q, `${A.agentType}.md`)
}
// @from(Start 14231406, End 14231645)
function FJ1(A) {
  if (A.source === "built-in") return "Built-in";
  if (A.source === "plugin") throw Error("Cannot get file path for plugin agents");
  let Q = VJ1(A.source),
    B = A.filename || A.agentType;
  return rg(Q, `${B}.md`)
}
// @from(Start 14231647, End 14231777)
function eD9(A) {
  if (A.source === "built-in") return "Built-in";
  let Q = tD9(A.source);
  return rg(Q, `${A.agentType}.md`)
}
// @from(Start 14231779, End 14231971)
function AH9(A) {
  if ($O(A)) return "Built-in";
  if (e51(A)) return `Plugin: ${A.plugin||"Unknown"}`;
  let Q = tD9(A.source),
    B = A.filename || A.agentType;
  return rg(Q, `${B}.md`)
}
// @from(Start 14231973, End 14232075)
function jx3(A) {
  let Q = VJ1(A),
    B = RA();
  if (!B.existsSync(Q)) B.mkdirSync(Q);
  return Q
}
// @from(Start 14232076, End 14232456)
async function hF0(A, Q, B, G, Z, I = !0, Y, J) {
  if (A === "built-in") throw Error("Cannot save built-in agents");
  jx3(A);
  let W = fF0({
      source: A,
      agentType: Q
    }),
    X = RA();
  if (I && X.existsSync(W)) throw Error(`Agent file already exists: ${W}`);
  let V = oD9(Q, B, G, Z, Y, J);
  X.writeFileSync(W, V, {
    encoding: "utf-8",
    flush: !0
  })
}
// @from(Start 14232457, End 14232715)
async function QH9(A, Q, B, G, Z, I) {
  if (A.source === "built-in") throw Error("Cannot update built-in agents");
  let Y = RA(),
    J = FJ1(A),
    W = oD9(A.agentType, Q, B, G, Z, I);
  Y.writeFileSync(J, W, {
    encoding: "utf-8",
    flush: !0
  })
}
// @from(Start 14232716, End 14232889)
async function BH9(A) {
  if (A.source === "built-in") throw Error("Cannot delete built-in agents");
  let Q = RA(),
    B = FJ1(A);
  if (Q.existsSync(B)) Q.unlinkSync(B)
}
// @from(Start 14232894, End 14232960)
NVA = L(() => {
  AQ();
  U2();
  hQ();
  fP();
  rD9();
  MB()
})
// @from(Start 14232963, End 14233453)
function Ma({
  title: A,
  titleColor: Q = "text",
  borderColor: B = "suggestion",
  children: G,
  subtitle: Z
}) {
  return Ij.createElement(S, {
    borderStyle: "round",
    borderColor: B,
    flexDirection: "column"
  }, Ij.createElement(S, {
    flexDirection: "column",
    paddingX: 1
  }, Ij.createElement($, {
    bold: !0,
    color: Q
  }, A), Z && Ij.createElement($, {
    dimColor: !0
  }, Z)), Ij.createElement(S, {
    paddingX: 1,
    flexDirection: "column"
  }, G))
}
// @from(Start 14233458, End 14233460)
Ij
// @from(Start 14233466, End 14233511)
gF0 = L(() => {
  hA();
  Ij = BA(VA(), 1)
})
// @from(Start 14233514, End 14233685)
function LVA(A) {
  if (A === "all") return "Agents";
  if (A === "built-in") return "Built-in agents";
  if (A === "plugin") return "Plugin agents";
  return IKA(Pm(A))
}
// @from(Start 14233690, End 14233724)
KJ1 = L(() => {
  WH1();
  LV()
})
// @from(Start 14233727, End 14239291)
function GH9({
  source: A,
  agents: Q,
  onBack: B,
  onSelect: G,
  onCreateNew: Z,
  changes: I
}) {
  let [Y, J] = RQ.useState(null), [W, X] = RQ.useState(!0), V = (q) => {
    return {
      isOverridden: !!q.overriddenBy,
      overriddenBy: q.overriddenBy || null
    }
  }, F = () => {
    return RQ.createElement(S, null, RQ.createElement($, {
      color: W ? "suggestion" : void 0
    }, W ? `${H1.pointer} ` : "  "), RQ.createElement($, {
      color: W ? "suggestion" : void 0
    }, "Create new agent"))
  }, K = (q) => {
    let w = q.source === "built-in",
      N = !w && !W && Y?.agentType === q.agentType && Y?.source === q.source,
      {
        isOverridden: R,
        overriddenBy: T
      } = V(q),
      y = w || R,
      v = !w && N ? "suggestion" : void 0,
      x = q.model || Jh1;
    return RQ.createElement(S, {
      key: `${q.agentType}-${q.source}`
    }, RQ.createElement($, {
      dimColor: y && !N,
      color: v
    }, w ? "" : N ? `${H1.pointer} ` : "  "), RQ.createElement($, {
      dimColor: y && !N,
      color: v
    }, q.agentType), x && RQ.createElement($, {
      dimColor: !0,
      color: v
    }, " · ", x === "inherit" ? "inherit" : x), T && RQ.createElement($, {
      dimColor: !N,
      color: N ? "warning" : void 0
    }, " ", H1.warning, " overridden by ", T))
  }, D = RQ.useMemo(() => {
    let q = Q.filter((w) => w.source !== "built-in");
    if (A === "all") return [...q.filter((w) => w.source === "userSettings"), ...q.filter((w) => w.source === "projectSettings"), ...q.filter((w) => w.source === "policySettings")];
    return q
  }, [Q, A]);
  RQ.useEffect(() => {
    if (!Y && !W && D.length > 0)
      if (Z) X(!0);
      else J(D[0] || null)
  }, [D, Y, W, Z]), f1((q, w) => {
    if (w.escape) {
      B();
      return
    }
    if (w.return) {
      if (W && Z) Z();
      else if (Y) G(Y);
      return
    }
    if (!w.upArrow && !w.downArrow) return;
    let N = !!Z,
      R = D.length + (N ? 1 : 0);
    if (R === 0) return;
    let T = 0;
    if (!W && Y) {
      let v = D.findIndex((x) => x.agentType === Y.agentType && x.source === Y.source);
      if (v >= 0) T = N ? v + 1 : v
    }
    let y = w.upArrow ? T === 0 ? R - 1 : T - 1 : T === R - 1 ? 0 : T + 1;
    if (N && y === 0) X(!0), J(null);
    else {
      let v = N ? y - 1 : y,
        x = D[v];
      if (x) X(!1), J(x)
    }
  });
  let H = (q = "Built-in (always available):") => {
      let w = Q.filter((N) => N.source === "built-in");
      return RQ.createElement(S, {
        flexDirection: "column",
        marginBottom: 1,
        paddingLeft: 2
      }, RQ.createElement($, {
        bold: !0,
        dimColor: !0
      }, q), w.map(K))
    },
    C = (q, w) => {
      if (!w.length) return null;
      let N = w[0]?.baseDir;
      return RQ.createElement(S, {
        flexDirection: "column",
        marginBottom: 1
      }, RQ.createElement(S, {
        paddingLeft: 2
      }, RQ.createElement($, {
        bold: !0,
        dimColor: !0
      }, q), N && RQ.createElement($, {
        dimColor: !0
      }, " (", N, ")")), w.map((R) => K(R)))
    },
    E = LVA(A);
  if (!Q.length || A !== "built-in" && !Q.some((q) => q.source !== "built-in")) return RQ.createElement(Ma, {
    title: E,
    subtitle: "No agents found"
  }, Z && RQ.createElement(S, {
    marginY: 1
  }, F()), RQ.createElement($, {
    dimColor: !0
  }, "No agents found. Create specialized subagents that Claude can delegate to."), RQ.createElement($, {
    dimColor: !0
  }, "Each subagent has its own context window, custom system prompt, and specific tools."), RQ.createElement($, {
    dimColor: !0
  }, "Try creating: Code Reviewer, Code Simplifier, Security Reviewer, Tech Lead, or UX Reviewer."), A !== "built-in" && Q.some((q) => q.source === "built-in") && RQ.createElement(RQ.Fragment, null, RQ.createElement(S, {
    marginTop: 1
  }, RQ.createElement(D3, null)), H()));
  return RQ.createElement(Ma, {
    title: E,
    subtitle: `${Q.filter((q)=>!q.overriddenBy).length} agents`
  }, I && I.length > 0 && RQ.createElement(S, {
    marginTop: 1
  }, RQ.createElement($, {
    dimColor: !0
  }, I[I.length - 1])), RQ.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, Z && RQ.createElement(S, {
    marginBottom: 1
  }, F()), A === "all" ? RQ.createElement(RQ.Fragment, null, C("User agents", Q.filter((q) => q.source === "userSettings")), C("Project agents", Q.filter((q) => q.source === "projectSettings")), C("Managed agents", Q.filter((q) => q.source === "policySettings")), C("Plugin agents", Q.filter((q) => q.source === "plugin")), C("CLI arg agents", Q.filter((q) => q.source === "flagSettings")), (() => {
    let q = Q.filter((w) => w.source === "built-in");
    return q.length > 0 ? RQ.createElement(S, {
      flexDirection: "column",
      marginBottom: 1,
      paddingLeft: 2
    }, RQ.createElement($, {
      dimColor: !0
    }, RQ.createElement($, {
      bold: !0
    }, "Built-in agents"), " (always available)"), q.map(K)) : null
  })()) : A === "built-in" ? RQ.createElement(RQ.Fragment, null, RQ.createElement($, {
    dimColor: !0,
    italic: !0
  }, "Built-in agents are provided by default and cannot be modified."), RQ.createElement(S, {
    marginTop: 1,
    flexDirection: "column"
  }, Q.map((q) => K(q)))) : RQ.createElement(RQ.Fragment, null, Q.filter((q) => q.source !== "built-in").map((q) => K(q)), Q.some((q) => q.source === "built-in") && RQ.createElement(RQ.Fragment, null, RQ.createElement(S, {
    marginTop: 1
  }, RQ.createElement(D3, null)), H()))))
}
// @from(Start 14239296, End 14239298)
RQ
// @from(Start 14239304, End 14239399)
ZH9 = L(() => {
  hA();
  hA();
  V9();
  BK();
  gF0();
  t2();
  KJ1();
  RQ = BA(VA(), 1)
})
// @from(Start 14239402, End 14240874)
function mF0({
  steps: A,
  initialData: Q = {},
  onComplete: B,
  onCancel: G,
  children: Z,
  title: I,
  showStepCounter: Y = !0
}) {
  let [J, W] = VV.useState(0), [X, V] = VV.useState(Q), [F, K] = VV.useState(!1), [D, H] = VV.useState([]);
  EQ(), VV.useEffect(() => {
    if (F) H([]), B(X)
  }, [F, X, B]);
  let C = VV.useCallback(() => {
      if (J < A.length - 1) {
        if (D.length > 0) H((T) => [...T, J]);
        W((T) => T + 1)
      } else K(!0)
    }, [J, A.length, D]),
    E = VV.useCallback(() => {
      if (D.length > 0) {
        let T = D[D.length - 1];
        if (T !== void 0) H((y) => y.slice(0, -1)), W(T)
      } else if (J > 0) W((T) => T - 1);
      else if (G) G()
    }, [J, D, G]),
    U = VV.useCallback((T) => {
      if (T >= 0 && T < A.length) H((y) => [...y, J]), W(T)
    }, [J, A.length]),
    q = VV.useCallback(() => {
      if (H([]), G) G()
    }, [G]),
    w = VV.useCallback((T) => {
      V((y) => ({
        ...y,
        ...T
      }))
    }, []),
    N = VV.useMemo(() => ({
      currentStepIndex: J,
      totalSteps: A.length,
      wizardData: X,
      setWizardData: V,
      updateWizardData: w,
      goNext: C,
      goBack: E,
      goToStep: U,
      cancel: q,
      title: I,
      showStepCounter: Y
    }), [J, A.length, X, w, C, E, U, q, I, Y]),
    R = A[J];
  if (!R || F) return null;
  return VV.default.createElement(uF0.Provider, {
    value: N
  }, Z || VV.default.createElement(R, null))
}
// @from(Start 14240879, End 14240881)
VV
// @from(Start 14240883, End 14240886)
uF0
// @from(Start 14240892, End 14240967)
dF0 = L(() => {
  Q4();
  VV = BA(VA(), 1), uF0 = VV.createContext(null)
})
// @from(Start 14240970, End 14241102)
function TI() {
  let A = IH9.useContext(uF0);
  if (!A) throw Error("useWizard must be used within a WizardProvider");
  return A
}
// @from(Start 14241107, End 14241110)
IH9
// @from(Start 14241116, End 14241163)
cF0 = L(() => {
  dF0();
  IH9 = BA(VA(), 1)
})
// @from(Start 14241166, End 14241697)
function pF0({
  instructions: A = Oa.default.createElement(Oa.default.Fragment, null, Oa.default.createElement(E4, {
    shortcut: "↑↓",
    action: "navigate"
  }), " · ", Oa.default.createElement(E4, {
    shortcut: "Enter",
    action: "select"
  }), " · ", Oa.default.createElement(E4, {
    shortcut: "Esc",
    action: "go back"
  }))
}) {
  let Q = EQ();
  return Oa.default.createElement(S, {
    marginLeft: 3
  }, Oa.default.createElement($, {
    dimColor: !0
  }, Q.pending ? `Press ${Q.keyName} again to exit` : A))
}
// @from(Start 14241702, End 14241704)
Oa
// @from(Start 14241710, End 14241771)
lF0 = L(() => {
  hA();
  Q4();
  dF();
  Oa = BA(VA(), 1)
})
// @from(Start 14241774, End 14242580)
function oJ({
  title: A,
  titleColor: Q = "text",
  borderColor: B = "suggestion",
  children: G,
  subtitle: Z,
  footerText: I
}) {
  let {
    currentStepIndex: Y,
    totalSteps: J,
    title: W,
    showStepCounter: X
  } = TI();
  return og.default.createElement(og.default.Fragment, null, og.default.createElement(S, {
    borderStyle: "round",
    borderColor: B,
    flexDirection: "column"
  }, og.default.createElement(S, {
    flexDirection: "column",
    paddingX: 1
  }, og.default.createElement($, {
    bold: !0,
    color: Q
  }, A || W || "Wizard", X !== !1 && ` (${Y+1}/${J})`), Z && og.default.createElement($, {
    dimColor: !0
  }, Z)), og.default.createElement(S, {
    paddingX: 1,
    flexDirection: "column"
  }, G)), og.default.createElement(pF0, {
    instructions: I
  }))
}
// @from(Start 14242585, End 14242587)
og
// @from(Start 14242593, End 14242655)
uO = L(() => {
  hA();
  cF0();
  lF0();
  og = BA(VA(), 1)
})
// @from(Start 14242661, End 14242712)
WN = L(() => {
  dF0();
  cF0();
  uO();
  lF0()
})
// @from(Start 14242715, End 14243356)
function YH9() {
  let {
    goNext: A,
    updateWizardData: Q,
    cancel: B
  } = TI();
  return DJ1.default.createElement(oJ, {
    subtitle: "Choose location",
    footerText: "Press ↑↓ to navigate · Enter to select · Esc to cancel"
  }, DJ1.default.createElement(S, {
    marginTop: 1
  }, DJ1.default.createElement(M0, {
    key: "location-select",
    options: [{
      label: "Project (.claude/agents/)",
      value: "projectSettings"
    }, {
      label: "Personal (~/.claude/agents/)",
      value: "userSettings"
    }],
    onChange: (Z) => {
      Q({
        location: Z
      }), A()
    },
    onCancel: () => B()
  })))
}
// @from(Start 14243361, End 14243364)
DJ1
// @from(Start 14243370, End 14243440)
JH9 = L(() => {
  hA();
  S5();
  uO();
  WN();
  DJ1 = BA(VA(), 1)
})
// @from(Start 14243443, End 14244188)
function WH9() {
  let {
    goNext: A,
    goBack: Q,
    updateWizardData: B,
    goToStep: G
  } = TI();
  return HJ1.default.createElement(oJ, {
    subtitle: "Creation method",
    footerText: "Press ↑↓ to navigate · Enter to select · Esc to go back"
  }, HJ1.default.createElement(S, {
    marginTop: 1
  }, HJ1.default.createElement(M0, {
    key: "method-select",
    options: [{
      label: "Generate with Claude (recommended)",
      value: "generate"
    }, {
      label: "Manual configuration",
      value: "manual"
    }],
    onChange: (I) => {
      let Y = I;
      if (B({
          method: Y,
          wasGenerated: Y === "generate"
        }), Y === "generate") A();
      else G(3)
    },
    onCancel: () => Q()
  })))
}
// @from(Start 14244193, End 14244196)
HJ1
// @from(Start 14244202, End 14244272)
XH9 = L(() => {
  hA();
  S5();
  uO();
  WN();
  HJ1 = BA(VA(), 1)
})
// @from(Start 14244274, End 14245641)
async function VH9(A, Q, B, G) {
  let Z = B.length > 0 ? `

IMPORTANT: The following identifiers already exist and must NOT be used: ${B.join(", ")}` : "",
    I = `Create an agent configuration based on this request: "${A}".${Z}
  Return ONLY the JSON object, no other text.`,
    Y = R0({
      content: I
    }),
    J = await DK(),
    W = gQA([Y], J),
    F = (await wy({
      messages: WZ(W),
      systemPrompt: [Sx3],
      maxThinkingTokens: 0,
      tools: [],
      signal: G,
      options: {
        getToolPermissionContext: async () => ZE(),
        model: Q,
        toolChoice: void 0,
        agents: [],
        isNonInteractiveSession: !1,
        hasAppendSystemPrompt: !1,
        querySource: "agent_creation",
        mcpTools: [],
        agentIdOrSessionId: e1()
      }
    })).message.content.filter((D) => D.type === "text").map((D) => D.text).join(`
`),
    K;
  try {
    K = JSON.parse(F.trim())
  } catch {
    let D = F.match(/\{[\s\S]*\}/);
    if (!D) throw Error("No JSON object found in response");
    K = JSON.parse(D[0])
  }
  if (!K.identifier || !K.whenToUse || !K.systemPrompt) throw Error("Invalid agent configuration generated");
  return GA("tengu_agent_definition_generated", {
    agent_identifier: K.identifier
  }), {
    identifier: K.identifier,
    whenToUse: K.whenToUse,
    systemPrompt: K.systemPrompt
  }
}
// @from(Start 14245646, End 14245649)
Sx3
// @from(Start 14245655, End 14250740)
FH9 = L(() => {
  fZ();
  cQ();
  Ty();
  q0();
  th();
  _0();
  Sx3 = `You are an elite AI agent architect specializing in crafting high-performance agent configurations. Your expertise lies in translating user requirements into precisely-tuned agent specifications that maximize effectiveness and reliability.

**Important Context**: You may have access to project-specific instructions from CLAUDE.md files and other context that may include coding standards, project structure, and custom requirements. Consider this context when creating agents to ensure they align with the project's established patterns and practices.

When a user describes what they want an agent to do, you will:

1. **Extract Core Intent**: Identify the fundamental purpose, key responsibilities, and success criteria for the agent. Look for both explicit requirements and implicit needs. Consider any project-specific context from CLAUDE.md files. For agents that are meant to review code, you should assume that the user is asking to review recently written code and not the whole codebase, unless the user has explicitly instructed you otherwise.

2. **Design Expert Persona**: Create a compelling expert identity that embodies deep domain knowledge relevant to the task. The persona should inspire confidence and guide the agent's decision-making approach.

3. **Architect Comprehensive Instructions**: Develop a system prompt that:
   - Establishes clear behavioral boundaries and operational parameters
   - Provides specific methodologies and best practices for task execution
   - Anticipates edge cases and provides guidance for handling them
   - Incorporates any specific requirements or preferences mentioned by the user
   - Defines output format expectations when relevant
   - Aligns with project-specific coding standards and patterns from CLAUDE.md

4. **Optimize for Performance**: Include:
   - Decision-making frameworks appropriate to the domain
   - Quality control mechanisms and self-verification steps
   - Efficient workflow patterns
   - Clear escalation or fallback strategies

5. **Create Identifier**: Design a concise, descriptive identifier that:
   - Uses lowercase letters, numbers, and hyphens only
   - Is typically 2-4 words joined by hyphens
   - Clearly indicates the agent's primary function
   - Is memorable and easy to type
   - Avoids generic terms like "helper" or "assistant"

6 **Example agent descriptions**:
  - in the 'whenToUse' field of the JSON object, you should include examples of when this agent should be used.
  - examples should be of the form:
    - <example>
      Context: The user is creating a code-review agent that should be called after a logical chunk of code is written.
      user: "Please write a function that checks if a number is prime"
      assistant: "Here is the relevant function: "
      <function call omitted for brevity only for this example>
      <commentary>
      Since the user is greeting, use the ${A6} tool to launch the greeting-responder agent to respond with a friendly joke. 
      </commentary>
      assistant: "Now let me use the code-reviewer agent to review the code"
    </example>
    - <example>
      Context: User is creating an agent to respond to the word "hello" with a friendly jok.
      user: "Hello"
      assistant: "I'm going to use the ${A6} tool to launch the greeting-responder agent to respond with a friendly joke"
      <commentary>
      Since the user is greeting, use the greeting-responder agent to respond with a friendly joke. 
      </commentary>
    </example>
  - If the user mentioned or implied that the agent should be used proactively, you should include examples of this.
- NOTE: Ensure that in the examples, you are making the assistant use the Agent tool and not simply respond directly to the task.

Your output must be a valid JSON object with exactly these fields:
{
  "identifier": "A unique, descriptive identifier using lowercase letters, numbers, and hyphens (e.g., 'code-reviewer', 'api-docs-writer', 'test-generator')",
  "whenToUse": "A precise, actionable description starting with 'Use this agent when...' that clearly defines the triggering conditions and use cases. Ensure you include examples as described above.",
  "systemPrompt": "The complete system prompt that will govern the agent's behavior, written in second person ('You are...', 'You will...') and structured for maximum clarity and effectiveness"
}

Key principles for your system prompts:
- Be specific rather than generic - avoid vague instructions
- Include concrete examples when they would clarify behavior
- Balance comprehensiveness with clarity - every instruction should add value
- Ensure the agent has enough context to handle variations of the core task
- Make the agent proactive in seeking clarification when needed
- Build in quality assurance and self-correction mechanisms

Remember: The agents you create should be autonomous experts capable of handling their designated tasks with minimal additional guidance. Your system prompts are their complete operational manual.
`
})
// @from(Start 14250743, End 14253158)
function KH9() {
  let {
    updateWizardData: A,
    goBack: Q,
    goToStep: B,
    wizardData: G
  } = TI(), [Z, I] = BH.useState(G.generationPrompt || ""), [Y, J] = BH.useState(!1), [W, X] = BH.useState(null), [V, F] = BH.useState(Z.length), K = Ja(), D = BH.useRef(null);
  f1((E, U) => {
    if (U.escape) {
      if (Y && D.current) D.current.abort(), D.current = null, J(!1), X("Generation cancelled");
      else if (!Y) A({
        generationPrompt: "",
        agentType: "",
        systemPrompt: "",
        whenToUse: "",
        generatedAgent: void 0,
        wasGenerated: !1
      }), I(""), X(null), Q()
    }
  });
  let H = async () => {
    let E = Z.trim();
    if (!E) {
      X("Please describe what the agent should do");
      return
    }
    X(null), J(!0), A({
      generationPrompt: E,
      isGenerating: !0
    });
    let U = o9();
    D.current = U;
    try {
      let q = await VH9(E, K, [], U.signal);
      A({
        agentType: q.identifier,
        whenToUse: q.whenToUse,
        systemPrompt: q.systemPrompt,
        generatedAgent: q,
        isGenerating: !1,
        wasGenerated: !0
      }), B(6)
    } catch (q) {
      if (q instanceof Error && !q.message.includes("No assistant message found")) X(q.message || "Failed to generate agent");
      A({
        isGenerating: !1
      })
    } finally {
      J(!1), D.current = null
    }
  }, C = "Describe what this agent should do and when it should be used (be comprehensive for best results)";
  if (Y) return BH.default.createElement(oJ, {
    subtitle: C,
    footerText: "Esc to cancel"
  }, BH.default.createElement(S, {
    marginTop: 1,
    flexDirection: "row",
    alignItems: "center"
  }, BH.default.createElement(g4, null), BH.default.createElement($, {
    color: "suggestion"
  }, " Generating agent from description...")));
  return BH.default.createElement(oJ, {
    subtitle: C,
    footerText: "Press Enter to submit · Esc to go back"
  }, BH.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, W && BH.default.createElement(S, {
    marginBottom: 1
  }, BH.default.createElement($, {
    color: "error"
  }, W)), BH.default.createElement(s4, {
    value: Z,
    onChange: I,
    onSubmit: H,
    placeholder: "e.g., Help me write unit tests for my code...",
    columns: 80,
    cursorOffset: V,
    onChangeCursorOffset: F,
    focus: !0,
    showCursor: !0
  })))
}
// @from(Start 14253163, End 14253165)
BH
// @from(Start 14253171, End 14253282)
DH9 = L(() => {
  hA();
  hA();
  ZY();
  uO();
  WN();
  DY();
  FH9();
  ePA();
  OZ();
  BH = BA(VA(), 1)
})
// @from(Start 14253285, End 14253683)
function iF0(A) {
  if (!A) return "Agent type is required";
  if (!/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/.test(A)) return "Agent type must start and end with alphanumeric characters and contain only letters, numbers, and hyphens";
  if (A.length < 3) return "Agent type must be at least 3 characters long";
  if (A.length > 50) return "Agent type must be less than 50 characters";
  return null
}
// @from(Start 14253685, End 14255020)
function HH9(A, Q, B) {
  let G = [],
    Z = [];
  if (!A.agentType) G.push("Agent type is required");
  else {
    let Y = iF0(A.agentType);
    if (Y) G.push(Y);
    let J = B.find((W) => W.agentType === A.agentType && W.source !== A.source);
    if (J) G.push(`Agent type "${A.agentType}" already exists in ${LVA(J.source)}`)
  }
  if (!A.whenToUse) G.push("Description (description) is required");
  else if (A.whenToUse.length < 10) Z.push("Description should be more descriptive (at least 10 characters)");
  else if (A.whenToUse.length > 5000) Z.push("Description is very long (over 5000 characters)");
  if (A.tools !== void 0 && !Array.isArray(A.tools)) G.push("Tools must be an array");
  else {
    if (A.tools === void 0) Z.push("Agent has access to all tools");
    else if (A.tools.length === 0) Z.push("No tools selected - agent will have very limited capabilities");
    let Y = Sn(A, Q, !1);
    if (Y.invalidTools.length > 0) G.push(`Invalid tools: ${Y.invalidTools.join(", ")}`)
  }
  let I = A.getSystemPrompt();
  if (!I) G.push("System prompt is required");
  else if (I.length < 20) G.push("System prompt is too short (minimum 20 characters)");
  else if (I.length > 1e4) Z.push("System prompt is very long (over 10,000 characters)");
  return {
    isValid: G.length === 0,
    errors: G,
    warnings: Z
  }
}
// @from(Start 14255025, End 14255060)
nF0 = L(() => {
  S0A();
  KJ1()
})
// @from(Start 14255063, End 14256215)
function CH9(A) {
  let {
    goNext: Q,
    goBack: B,
    updateWizardData: G,
    wizardData: Z
  } = TI(), [I, Y] = mO.useState(Z.agentType || ""), [J, W] = mO.useState(null), [X, V] = mO.useState(I.length);
  return f1((K, D) => {
    if (D.escape) B()
  }), mO.default.createElement(oJ, {
    subtitle: "Agent type (identifier)",
    footerText: "Type to enter text · Enter to continue · Esc to go back"
  }, mO.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, mO.default.createElement($, null, "Enter a unique identifier for your agent:"), mO.default.createElement(S, {
    marginTop: 1
  }, mO.default.createElement(s4, {
    value: I,
    onChange: Y,
    onSubmit: (K) => {
      let D = K.trim(),
        H = iF0(D);
      if (H) {
        W(H);
        return
      }
      W(null), G({
        agentType: D
      }), Q()
    },
    placeholder: "e.g., code-reviewer, tech-lead, etc",
    columns: 60,
    cursorOffset: X,
    onChangeCursorOffset: V,
    focus: !0,
    showCursor: !0
  })), J && mO.default.createElement(S, {
    marginTop: 1
  }, mO.default.createElement($, {
    color: "error"
  }, J))))
}
// @from(Start 14256220, End 14256222)
mO
// @from(Start 14256228, End 14256314)
EH9 = L(() => {
  hA();
  hA();
  ZY();
  uO();
  WN();
  nF0();
  mO = BA(VA(), 1)
})
// @from(Start 14256317, End 14257561)
function zH9() {
  let {
    goNext: A,
    goBack: Q,
    updateWizardData: B,
    wizardData: G
  } = TI(), [Z, I] = XN.useState(G.systemPrompt || ""), [Y, J] = XN.useState(Z.length), [W, X] = XN.useState(null);
  return f1((F, K) => {
    if (K.escape) Q()
  }), XN.default.createElement(oJ, {
    subtitle: "System prompt",
    footerText: "Type to enter text · Enter to continue · Esc to go back"
  }, XN.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, XN.default.createElement($, null, "Enter the system prompt for your agent:"), XN.default.createElement($, {
    dimColor: !0
  }, "Be comprehensive for best results"), XN.default.createElement(S, {
    marginTop: 1
  }, XN.default.createElement(s4, {
    value: Z,
    onChange: I,
    onSubmit: () => {
      let F = Z.trim();
      if (!F) {
        X("System prompt is required");
        return
      }
      X(null), B({
        systemPrompt: F
      }), A()
    },
    placeholder: "You are a helpful code reviewer who...",
    columns: 80,
    cursorOffset: Y,
    onChangeCursorOffset: J,
    focus: !0,
    showCursor: !0
  })), W && XN.default.createElement(S, {
    marginTop: 1
  }, XN.default.createElement($, {
    color: "error"
  }, W))))
}
// @from(Start 14257566, End 14257568)
XN
// @from(Start 14257574, End 14257651)
UH9 = L(() => {
  hA();
  hA();
  ZY();
  uO();
  WN();
  XN = BA(VA(), 1)
})
// @from(Start 14257654, End 14258847)
function $H9() {
  let {
    goNext: A,
    goBack: Q,
    updateWizardData: B,
    wizardData: G
  } = TI(), [Z, I] = dO.useState(G.whenToUse || ""), [Y, J] = dO.useState(Z.length), [W, X] = dO.useState(null);
  return f1((F, K) => {
    if (K.escape) Q()
  }), dO.default.createElement(oJ, {
    subtitle: "Description (tell Claude when to use this agent)",
    footerText: "Type to enter text · Enter to continue · Esc to go back"
  }, dO.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, dO.default.createElement($, null, "When should Claude use this agent?"), dO.default.createElement(S, {
    marginTop: 1
  }, dO.default.createElement(s4, {
    value: Z,
    onChange: I,
    onSubmit: (F) => {
      let K = F.trim();
      if (!K) {
        X("Description is required");
        return
      }
      X(null), B({
        whenToUse: K
      }), A()
    },
    placeholder: "e.g., use this agent after you're done writing code...",
    columns: 80,
    cursorOffset: Y,
    onChangeCursorOffset: J,
    focus: !0,
    showCursor: !0
  })), W && dO.default.createElement(S, {
    marginTop: 1
  }, dO.default.createElement($, {
    color: "error"
  }, W))))
}
// @from(Start 14258852, End 14258854)
dO
// @from(Start 14258860, End 14258937)
wH9 = L(() => {
  hA();
  hA();
  ZY();
  uO();
  WN();
  dO = BA(VA(), 1)
})
// @from(Start 14258940, End 14259319)
function _x3(A) {
  let Q = new Map;
  return A.forEach((B) => {
    if (lg(B)) {
      let G = mU(B.name);
      if (G?.serverName) {
        let Z = Q.get(G.serverName) || [];
        Z.push(B), Q.set(G.serverName, Z)
      }
    }
  }), Array.from(Q.entries()).map(([B, G]) => ({
    serverName: B,
    tools: G
  })).sort((B, G) => B.serverName.localeCompare(G.serverName))
}
// @from(Start 14259321, End 14264681)
function CJ1({
  tools: A,
  initialTools: Q,
  onComplete: B,
  onCancel: G
}) {
  let Z = FV.useMemo(() => w70({
      tools: A,
      isBuiltIn: !1,
      isAsync: !1
    }), [A]),
    I = !Q || Q.includes("*") ? Z.map((x) => x.name) : Q,
    [Y, J] = FV.useState(I),
    [W, X] = FV.useState(0),
    [V, F] = FV.useState(!1),
    K = FV.useMemo(() => {
      let x = new Set(Z.map((p) => p.name));
      return Y.filter((p) => x.has(p))
    }, [Y, Z]),
    D = new Set(K),
    H = K.length === Z.length && Z.length > 0,
    C = (x) => {
      if (!x) return;
      J((p) => p.includes(x) ? p.filter((u) => u !== x) : [...p, x])
    },
    E = (x, p) => {
      J((u) => {
        if (p) {
          let e = x.filter((l) => !u.includes(l));
          return [...u, ...e]
        } else return u.filter((e) => !x.includes(e))
      })
    },
    U = () => {
      let x = Z.map((e) => e.name),
        u = K.length === x.length && x.every((e) => K.includes(e)) ? void 0 : K;
      B(u)
    },
    q = FV.useMemo(() => {
      let x = qH9(),
        p = {
          readOnly: [],
          edit: [],
          execution: [],
          mcp: [],
          other: []
        };
      return Z.forEach((u) => {
        if (lg(u)) p.mcp.push(u);
        else if (x.READ_ONLY.toolNames.has(u.name)) p.readOnly.push(u);
        else if (x.EDIT.toolNames.has(u.name)) p.edit.push(u);
        else if (x.EXECUTION.toolNames.has(u.name)) p.execution.push(u);
        else if (u.name !== A6) p.other.push(u)
      }), p
    }, [Z]),
    w = (x) => {
      let u = x.filter((e) => D.has(e.name)).length < x.length;
      return () => {
        let e = x.map((l) => l.name);
        E(e, u)
      }
    },
    N = [];
  N.push({
    id: "continue",
    label: "Continue",
    action: U,
    isContinue: !0
  }), N.push({
    id: "bucket-all",
    label: `${H?H1.checkboxOn:H1.checkboxOff} All tools`,
    action: () => {
      let x = Z.map((p) => p.name);
      E(x, !H)
    }
  });
  let R = qH9();
  [{
    id: "bucket-readonly",
    name: R.READ_ONLY.name,
    tools: q.readOnly
  }, {
    id: "bucket-edit",
    name: R.EDIT.name,
    tools: q.edit
  }, {
    id: "bucket-execution",
    name: R.EXECUTION.name,
    tools: q.execution
  }, {
    id: "bucket-mcp",
    name: R.MCP.name,
    tools: q.mcp
  }, {
    id: "bucket-other",
    name: R.OTHER.name,
    tools: q.other
  }].forEach(({
    id: x,
    name: p,
    tools: u
  }) => {
    if (u.length === 0) return;
    let l = u.filter((k) => D.has(k.name)).length === u.length;
    N.push({
      id: x,
      label: `${l?H1.checkboxOn:H1.checkboxOff} ${p}`,
      action: w(u)
    })
  });
  let y = N.length;
  N.push({
    id: "toggle-individual",
    label: V ? "Hide advanced options" : "Show advanced options",
    action: () => {
      if (F(!V), V && W > y) X(y)
    },
    isToggle: !0
  });
  let v = FV.useMemo(() => _x3(Z), [Z]);
  if (V) {
    if (v.length > 0) N.push({
      id: "mcp-servers-header",
      label: "MCP Servers:",
      action: () => {},
      isHeader: !0
    }), v.forEach(({
      serverName: x,
      tools: p
    }) => {
      let e = p.filter((l) => D.has(l.name)).length === p.length;
      N.push({
        id: `mcp-server-${x}`,
        label: `${e?H1.checkboxOn:H1.checkboxOff} ${x} (${p.length} tool${p.length===1?"":"s"})`,
        action: () => {
          let l = p.map((k) => k.name);
          E(l, !e)
        }
      })
    }), N.push({
      id: "tools-header",
      label: "Individual Tools:",
      action: () => {},
      isHeader: !0
    });
    Z.forEach((x) => {
      let p = x.name;
      if (x.name.startsWith("mcp__")) {
        let u = mU(x.name);
        p = u ? `${u.toolName} (${u.serverName})` : x.name
      }
      N.push({
        id: `tool-${x.name}`,
        label: `${D.has(x.name)?H1.checkboxOn:H1.checkboxOff} ${p}`,
        action: () => C(x.name)
      })
    })
  }
  return f1((x, p) => {
    if (p.return) {
      let u = N[W];
      if (u && !u.isHeader) u.action()
    } else if (p.escape)
      if (G) G();
      else B(Q);
    else if (p.upArrow) {
      let u = W - 1;
      while (u > 0 && N[u]?.isHeader) u--;
      X(Math.max(0, u))
    } else if (p.downArrow) {
      let u = W + 1;
      while (u < N.length - 1 && N[u]?.isHeader) u++;
      X(Math.min(N.length - 1, u))
    }
  }), FV.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, FV.default.createElement($, {
    color: W === 0 ? "suggestion" : void 0,
    bold: W === 0
  }, W === 0 ? `${H1.pointer} ` : "  ", "[ Continue ]"), FV.default.createElement($, {
    dimColor: !0
  }, "─".repeat(40)), N.slice(1).map((x, p) => {
    let u = p + 1 === W,
      e = x.isToggle,
      l = x.isHeader;
    return FV.default.createElement(FV.default.Fragment, {
      key: x.id
    }, e && FV.default.createElement($, {
      dimColor: !0
    }, "─".repeat(40)), l && p > 0 && FV.default.createElement(S, {
      marginTop: 1
    }), FV.default.createElement($, {
      color: l ? void 0 : u ? "suggestion" : void 0,
      dimColor: l,
      bold: e && u
    }, l ? "" : u ? `${H1.pointer} ` : "  ", e ? `[ ${x.label} ]` : x.label))
  }), FV.default.createElement(S, {
    marginTop: 1,
    flexDirection: "column"
  }, FV.default.createElement($, {
    dimColor: !0
  }, H ? "All tools selected" : `${D.size} of ${Z.length} tools selected`)))
}
// @from(Start 14264686, End 14264688)
FV
// @from(Start 14264690, End 14265219)
qH9 = () => ({
  READ_ONLY: {
    name: "Read-only tools",
    toolNames: new Set([zO.name, Py.name, gq.name, n8.name, nV.name, BY.name, ZSA.name, HY1.name, CY1.name, Wh.name, Xh.name])
  },
  EDIT: {
    name: "Edit tools",
    toolNames: new Set([lD.name, QV.name, kP.name])
  },
  EXECUTION: {
    name: "Execution tools",
    toolNames: new Set([D9.name, void 0].filter(Boolean))
  },
  MCP: {
    name: "MCP tools",
    toolNames: new Set,
    isMcp: !0
  },
  OTHER: {
    name: "Other tools",
    toolNames: new Set
  }
})
// @from(Start 14265225, End 14265433)
aF0 = L(() => {
  hA();
  hA();
  V9();
  nX();
  KTA();
  VTA();
  dTA();
  Dq();
  oWA();
  kt();
  JV0();
  ZV0();
  YV0();
  fQ1();
  hQ1();
  zn();
  rh();
  DWA();
  pF();
  S0A();
  FV = BA(VA(), 1)
})
// @from(Start 14265436, End 14265912)
function NH9({
  tools: A
}) {
  let {
    goNext: Q,
    goBack: B,
    updateWizardData: G,
    wizardData: Z
  } = TI(), I = (J) => {
    G({
      selectedTools: J
    }), Q()
  }, Y = Z.selectedTools;
  return sF0.default.createElement(oJ, {
    subtitle: "Select tools",
    footerText: "Press Enter to toggle selection · ↑↓ to navigate · Esc to go back"
  }, sF0.default.createElement(CJ1, {
    tools: A,
    initialTools: Y,
    onComplete: I,
    onCancel: B
  }))
}
// @from(Start 14265917, End 14265920)
sF0
// @from(Start 14265926, End 14265989)
LH9 = L(() => {
  aF0();
  uO();
  WN();
  sF0 = BA(VA(), 1)
})
// @from(Start 14265992, End 14266587)
function EJ1({
  initialModel: A,
  onComplete: Q,
  onCancel: B
}) {
  let G = cO.useMemo(() => qCB(), []),
    Z = cO.useMemo(() => {
      if (A && G.some((I) => I.value === A)) return A;
      return "sonnet"
    }, [A, G]);
  return cO.createElement(S, {
    flexDirection: "column"
  }, cO.createElement(S, {
    marginBottom: 1
  }, cO.createElement($, {
    dimColor: !0
  }, "Model determines the agent's reasoning capabilities and speed.")), cO.createElement(M0, {
    options: G,
    defaultValue: Z,
    onChange: (I) => {
      Q(I)
    },
    onCancel: () => B ? B() : Q(A)
  }))
}
// @from(Start 14266592, End 14266594)
cO
// @from(Start 14266600, End 14266661)
rF0 = L(() => {
  hA();
  S5();
  t2();
  cO = BA(VA(), 1)
})
// @from(Start 14266664, End 14267095)
function MH9() {
  let {
    goNext: A,
    goBack: Q,
    updateWizardData: B,
    wizardData: G
  } = TI(), Z = (I) => {
    B({
      selectedModel: I
    }), A()
  };
  return oF0.default.createElement(oJ, {
    subtitle: "Select model",
    footerText: "Press ↑↓ to navigate · Enter to select · Esc to go back"
  }, oF0.default.createElement(EJ1, {
    initialModel: G.selectedModel,
    onComplete: Z,
    onCancel: Q
  }))
}
// @from(Start 14267100, End 14267103)
oF0
// @from(Start 14267109, End 14267172)
OH9 = L(() => {
  rF0();
  uO();
  WN();
  oF0 = BA(VA(), 1)
})
// @from(Start 14267175, End 14268662)
function zJ1({
  agentName: A,
  currentColor: Q = "automatic",
  onConfirm: B
}) {
  let [G, Z] = Jz.useState(Math.max(0, MVA.findIndex((Y) => Y === Q)));
  f1((Y, J) => {
    if (J.upArrow) Z((W) => W > 0 ? W - 1 : MVA.length - 1);
    else if (J.downArrow) Z((W) => W < MVA.length - 1 ? W + 1 : 0);
    else if (J.return) {
      let W = MVA[G];
      B(W === "automatic" ? void 0 : W)
    }
  });
  let I = MVA[G];
  return Jz.default.createElement(S, {
    flexDirection: "column",
    gap: 1
  }, Jz.default.createElement(S, {
    flexDirection: "column"
  }, MVA.map((Y, J) => {
    let W = J === G;
    return Jz.default.createElement(S, {
      key: Y,
      flexDirection: "row",
      gap: 1
    }, Jz.default.createElement($, {
      color: W ? "suggestion" : void 0
    }, W ? H1.pointer : " "), Y === "automatic" ? Jz.default.createElement($, {
      bold: W
    }, "Automatic color") : Jz.default.createElement(S, {
      gap: 1
    }, Jz.default.createElement($, {
      backgroundColor: HTA[Y],
      color: "inverseText"
    }, " "), Jz.default.createElement($, {
      bold: W
    }, Y.charAt(0).toUpperCase() + Y.slice(1))))
  })), Jz.default.createElement(S, {
    marginTop: 1
  }, Jz.default.createElement($, null, "Preview: "), I === void 0 || I === "automatic" ? Jz.default.createElement($, {
    inverse: !0,
    bold: !0
  }, " ", A, " ") : Jz.default.createElement($, {
    backgroundColor: HTA[I],
    color: "inverseText",
    bold: !0
  }, " ", A, " ")))
}
// @from(Start 14268667, End 14268669)
Jz
// @from(Start 14268671, End 14268674)
MVA
// @from(Start 14268680, End 14268770)
tF0 = L(() => {
  hA();
  jy();
  V9();
  Jz = BA(VA(), 1), MVA = ["automatic", ...j0A]
})
// @from(Start 14268773, End 14269668)
function RH9() {
  let {
    goNext: A,
    goBack: Q,
    updateWizardData: B,
    wizardData: G
  } = TI();
  f1((I, Y) => {
    if (Y.escape) Q()
  });
  let Z = (I) => {
    B({
      selectedColor: I,
      finalAgent: {
        agentType: G.agentType,
        whenToUse: G.whenToUse,
        getSystemPrompt: () => G.systemPrompt,
        tools: G.selectedTools,
        ...G.selectedModel ? {
          model: G.selectedModel
        } : {},
        ...I ? {
          color: I
        } : {},
        source: G.location
      }
    }), A()
  };
  return UJ1.default.createElement(oJ, {
    subtitle: "Choose background color",
    footerText: "Press ↑↓ to navigate · Enter to select · Esc to go back"
  }, UJ1.default.createElement(S, {
    marginTop: 1
  }, UJ1.default.createElement(zJ1, {
    agentName: G.agentType || "agent",
    currentColor: "automatic",
    onConfirm: Z
  })))
}
// @from(Start 14269673, End 14269676)
UJ1
// @from(Start 14269682, End 14269761)
TH9 = L(() => {
  hA();
  hA();
  tF0();
  uO();
  WN();
  UJ1 = BA(VA(), 1)
})
// @from(Start 14269764, End 14272850)
function PH9({
  tools: A,
  existingAgents: Q,
  onSave: B,
  onSaveAndEdit: G,
  error: Z
}) {
  let {
    goBack: I,
    wizardData: Y
  } = TI();
  f1((V, F) => {
    if (F.escape) I();
    else if (V === "s" || F.return) B();
    else if (V === "e") G()
  });
  let J = Y.finalAgent,
    W = HH9(J, A, Q),
    X = (V) => {
      if (V === void 0) return "All tools";
      if (V.length === 0) return "None";
      if (V.length === 1) return V[0] || "None";
      if (V.length === 2) return V.join(" and ");
      return `${V.slice(0,-1).join(", ")}, and ${V[V.length-1]}`
    };
  return w3.default.createElement(oJ, {
    subtitle: "Confirm and save",
    footerText: "Press s/Enter to save · e to edit in your editor · Esc to cancel"
  }, w3.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, w3.default.createElement($, null, w3.default.createElement($, {
    bold: !0
  }, "Name"), ": ", J.agentType), w3.default.createElement($, null, w3.default.createElement($, {
    bold: !0
  }, "Location"), ":", " ", eD9({
    source: Y.location,
    agentType: J.agentType
  })), w3.default.createElement($, null, w3.default.createElement($, {
    bold: !0
  }, "Tools"), ": ", X(J.tools)), w3.default.createElement($, null, w3.default.createElement($, {
    bold: !0
  }, "Model"), ": ", nnA(J.model)), w3.default.createElement(S, {
    marginTop: 1
  }, w3.default.createElement($, null, w3.default.createElement($, {
    bold: !0
  }, "Description"), " (tells Claude when to use this agent):")), w3.default.createElement(S, {
    marginLeft: 2,
    marginTop: 1
  }, w3.default.createElement($, null, J.whenToUse.length > 240 ? J.whenToUse.slice(0, 240) + "…" : J.whenToUse)), w3.default.createElement(S, {
    marginTop: 1
  }, w3.default.createElement($, null, w3.default.createElement($, {
    bold: !0
  }, "System prompt"), ":")), w3.default.createElement(S, {
    marginLeft: 2,
    marginTop: 1
  }, w3.default.createElement($, null, (() => {
    let V = J.getSystemPrompt();
    return V.length > 240 ? V.slice(0, 240) + "…" : V
  })())), W.warnings.length > 0 && w3.default.createElement(S, {
    marginTop: 1,
    flexDirection: "column"
  }, w3.default.createElement($, {
    color: "warning"
  }, "Warnings:"), W.warnings.map((V, F) => w3.default.createElement($, {
    key: F,
    dimColor: !0
  }, " ", "• ", V))), W.errors.length > 0 && w3.default.createElement(S, {
    marginTop: 1,
    flexDirection: "column"
  }, w3.default.createElement($, {
    color: "error"
  }, "Errors:"), W.errors.map((V, F) => w3.default.createElement($, {
    key: F,
    color: "error"
  }, " ", "• ", V))), Z && w3.default.createElement(S, {
    marginTop: 1
  }, w3.default.createElement($, {
    color: "error"
  }, Z)), w3.default.createElement(S, {
    marginTop: 2
  }, w3.default.createElement($, {
    color: "success"
  }, "Press ", w3.default.createElement($, {
    bold: !0
  }, "s"), " or ", w3.default.createElement($, {
    bold: !0
  }, "Enter"), " to save,", " ", w3.default.createElement($, {
    bold: !0
  }, "e"), " to save and edit"))))
}
// @from(Start 14272855, End 14272857)
w3
// @from(Start 14272863, End 14272958)
jH9 = L(() => {
  hA();
  hA();
  uO();
  WN();
  nF0();
  NVA();
  t2();
  w3 = BA(VA(), 1)
})
// @from(Start 14272961, End 14275558)
function SH9({
  tools: A,
  existingAgents: Q,
  onComplete: B
}) {
  let {
    wizardData: G
  } = TI(), [Z, I] = aQA.useState(null), [, Y] = OQ(), J = aQA.useCallback(async () => {
    if (!G?.finalAgent) return;
    try {
      await hF0(G.location, G.finalAgent.agentType, G.finalAgent.whenToUse, G.finalAgent.tools, G.finalAgent.getSystemPrompt(), !0, G.finalAgent.color, G.finalAgent.model), Y((X) => {
        if (!G.finalAgent) return X;
        let V = X.agentDefinitions.allAgents.concat(G.finalAgent);
        return {
          ...X,
          agentDefinitions: {
            ...X.agentDefinitions,
            activeAgents: ky(V),
            allAgents: V
          }
        }
      }), GA("tengu_agent_created", {
        agent_type: G.finalAgent.agentType,
        generation_method: G.wasGenerated ? "generated" : "manual",
        source: G.location,
        tool_count: G.finalAgent.tools?.length ?? "all",
        has_custom_model: !!G.finalAgent.model,
        has_custom_color: !!G.finalAgent.color
      }), B(`Created agent: ${tA.bold(G.finalAgent.agentType)}`)
    } catch (X) {
      I(X instanceof Error ? X.message : "Failed to save agent")
    }
  }, [G, B, Y]), W = aQA.useCallback(async () => {
    if (!G?.finalAgent) return;
    try {
      await hF0(G.location, G.finalAgent.agentType, G.finalAgent.whenToUse, G.finalAgent.tools, G.finalAgent.getSystemPrompt(), !0, G.finalAgent.color, G.finalAgent.model), Y((V) => {
        if (!G.finalAgent) return V;
        let F = V.agentDefinitions.allAgents.concat(G.finalAgent);
        return {
          ...V,
          agentDefinitions: {
            ...V.agentDefinitions,
            activeAgents: ky(F),
            allAgents: F
          }
        }
      });
      let X = fF0({
        source: G.location,
        agentType: G.finalAgent.agentType
      });
      await cn(X), GA("tengu_agent_created", {
        agent_type: G.finalAgent.agentType,
        generation_method: G.wasGenerated ? "generated" : "manual",
        source: G.location,
        tool_count: G.finalAgent.tools?.length ?? "all",
        has_custom_model: !!G.finalAgent.model,
        has_custom_color: !!G.finalAgent.color,
        opened_in_editor: !0
      }), B(`Created agent: ${tA.bold(G.finalAgent.agentType)} and opened in editor. If you made edits, restart to load the latest version.`)
    } catch (X) {
      I(X instanceof Error ? X.message : "Failed to save agent")
    }
  }, [G, B, Y]);
  return aQA.default.createElement(PH9, {
    tools: A,
    existingAgents: Q,
    onSave: J,
    onSaveAndEdit: W,
    error: Z
  })
}
// @from(Start 14275563, End 14275566)
aQA
// @from(Start 14275572, End 14275676)
_H9 = L(() => {
  F9();
  WN();
  jH9();
  NVA();
  fP();
  pn();
  q0();
  z9();
  aQA = BA(VA(), 1)
})
// @from(Start 14275679, End 14276219)
function kH9({
  tools: A,
  existingAgents: Q,
  onComplete: B,
  onCancel: G
}) {
  return NSA.default.createElement(mF0, {
    steps: [YH9, WH9, KH9, () => NSA.default.createElement(CH9, {
      existingAgents: Q
    }), zH9, $H9, () => NSA.default.createElement(NH9, {
      tools: A
    }), MH9, RH9, () => NSA.default.createElement(SH9, {
      tools: A,
      existingAgents: Q,
      onComplete: B
    })],
    initialData: {},
    onComplete: () => {},
    onCancel: G,
    title: "Create new agent",
    showStepCounter: !1
  })
}
// @from(Start 14276224, End 14276227)
NSA
// @from(Start 14276233, End 14276369)
yH9 = L(() => {
  WN();
  JH9();
  XH9();
  DH9();
  EH9();
  UH9();
  wH9();
  LH9();
  OH9();
  TH9();
  _H9();
  NSA = BA(VA(), 1)
})
// @from(Start 14276372, End 14279784)
function xH9({
  agent: A,
  tools: Q,
  onSaved: B,
  onBack: G
}) {
  let [, Z] = OQ(), [I, Y] = pO.useState("menu"), [J, W] = pO.useState(0), [X, V] = pO.useState(null), [F, K] = pO.useState(A.color), D = pO.useCallback(async () => {
    try {
      let w = FJ1(A);
      await cn(w), B(`Opened ${A.agentType} in editor. If you made edits, restart to load the latest version.`)
    } catch (w) {
      V(w instanceof Error ? w.message : "Failed to open editor")
    }
  }, [A, B]), H = pO.useCallback(async (w = {}) => {
    let {
      tools: N,
      color: R,
      model: T
    } = w, y = R ?? F, v = N !== void 0, x = T !== void 0, p = y !== A.color;
    if (!v && !x && !p) return !1;
    try {
      if (!Ff2(A) && !e51(A)) return !1;
      if (await QH9(A, A.whenToUse, N ?? A.tools, A.getSystemPrompt(), y, T ?? A.model), p && y) jWA(A.agentType, y);
      return Z((u) => {
        let e = u.agentDefinitions.allAgents.map((l) => l.agentType === A.agentType ? {
          ...l,
          tools: N ?? l.tools,
          color: y,
          model: T ?? l.model
        } : l);
        return {
          ...u,
          agentDefinitions: {
            ...u.agentDefinitions,
            activeAgents: ky(e),
            allAgents: e
          }
        }
      }), B(`Updated agent: ${tA.bold(A.agentType)}`), !0
    } catch (u) {
      return V(u instanceof Error ? u.message : "Failed to save agent"), !1
    }
  }, [A, F, B, Z]), C = pO.useMemo(() => [{
    label: "Open in editor",
    action: D
  }, {
    label: "Edit tools",
    action: () => Y("edit-tools")
  }, {
    label: "Edit model",
    action: () => Y("edit-model")
  }, {
    label: "Edit color",
    action: () => Y("edit-color")
  }], [D]), E = pO.useCallback(() => {
    if (V(null), I === "menu") G();
    else Y("menu")
  }, [I, G]), U = pO.useCallback((w) => {
    if (w.upArrow) W((N) => Math.max(0, N - 1));
    else if (w.downArrow) W((N) => Math.min(C.length - 1, N + 1));
    else if (w.return) {
      let N = C[J];
      if (N) N.action()
    }
  }, [C, J]);
  f1((w, N) => {
    if (N.escape) {
      E();
      return
    }
    if (I === "menu") U(N)
  });
  let q = () => eV.createElement(S, {
    flexDirection: "column"
  }, eV.createElement($, {
    dimColor: !0
  }, "Source: ", LVA(A.source)), eV.createElement(S, {
    marginTop: 1,
    flexDirection: "column"
  }, C.map((w, N) => eV.createElement($, {
    key: w.label,
    color: N === J ? "suggestion" : void 0
  }, N === J ? `${H1.pointer} ` : "  ", w.label))), X && eV.createElement(S, {
    marginTop: 1
  }, eV.createElement($, {
    color: "error"
  }, X)));
  switch (I) {
    case "menu":
      return q();
    case "edit-tools":
      return eV.createElement(CJ1, {
        tools: Q,
        initialTools: A.tools,
        onComplete: async (w) => {
          Y("menu"), await H({
            tools: w
          })
        }
      });
    case "edit-color":
      return eV.createElement(zJ1, {
        agentName: A.agentType,
        currentColor: F || A.color || "automatic",
        onConfirm: async (w) => {
          K(w), Y("menu"), await H({
            color: w
          })
        }
      });
    case "edit-model":
      return eV.createElement(EJ1, {
        initialModel: A.model,
        onComplete: async (w) => {
          Y("menu"), await H({
            model: w
          })
        }
      });
    default:
      return null
  }
}
// @from(Start 14279789, End 14279791)
eV
// @from(Start 14279793, End 14279795)
pO
// @from(Start 14279801, End 14279957)
vH9 = L(() => {
  hA();
  F9();
  fP();
  aF0();
  tF0();
  rF0();
  NVA();
  pn();
  jy();
  V9();
  KJ1();
  z9();
  eV = BA(VA(), 1), pO = BA(VA(), 1)
})
// @from(Start 14279960, End 14281702)
function bH9({
  agent: A,
  tools: Q,
  onBack: B
}) {
  let [G] = qB(), Z = Sn(A, Q, !1), I = AH9(A), Y = PWA(A.agentType);
  f1((W, X) => {
    if (X.escape || X.return) B()
  });

  function J() {
    if (Z.hasWildcard) return a2.createElement($, null, "All tools");
    if (!A.tools || A.tools.length === 0) return a2.createElement($, null, "None");
    return a2.createElement(a2.Fragment, null, Z.validTools.length > 0 && a2.createElement($, null, Z.validTools.join(", ")), Z.invalidTools.length > 0 && a2.createElement($, {
      color: "warning"
    }, H1.warning, " Unrecognized:", " ", Z.invalidTools.join(", ")))
  }
  return a2.createElement(S, {
    flexDirection: "column",
    gap: 1
  }, a2.createElement($, {
    dimColor: !0
  }, I), a2.createElement(S, {
    flexDirection: "column"
  }, a2.createElement($, null, a2.createElement($, {
    bold: !0
  }, "Description"), " (tells Claude when to use this agent):"), a2.createElement(S, {
    marginLeft: 2
  }, a2.createElement($, null, A.whenToUse))), a2.createElement(S, null, a2.createElement($, null, a2.createElement($, {
    bold: !0
  }, "Tools"), ":", " "), J()), a2.createElement($, null, a2.createElement($, {
    bold: !0
  }, "Model"), ": ", nnA(A.model)), Y && a2.createElement(S, null, a2.createElement($, null, a2.createElement($, {
    bold: !0
  }, "Color"), ":", " ", a2.createElement($, {
    backgroundColor: Y,
    color: "inverseText"
  }, " ", A.agentType, " "))), !$O(A) && a2.createElement(a2.Fragment, null, a2.createElement(S, null, a2.createElement($, null, a2.createElement($, {
    bold: !0
  }, "System prompt"), ":")), a2.createElement(S, {
    marginLeft: 2,
    marginRight: 2
  }, a2.createElement($, null, fD(A.getSystemPrompt(), G)))))
}
// @from(Start 14281707, End 14281709)
a2
// @from(Start 14281715, End 14281818)
fH9 = L(() => {
  hA();
  V9();
  fP();
  S0A();
  wh();
  NVA();
  jy();
  t2();
  a2 = BA(VA(), 1)
})
// @from(Start 14281821, End 14282089)
function OVA({
  instructions: A = "Press ↑↓ to navigate · Enter to select · Esc to go back"
}) {
  let Q = EQ();
  return LSA.createElement(S, {
    marginLeft: 3
  }, LSA.createElement($, {
    dimColor: !0
  }, Q.pending ? `Press ${Q.keyName} again to exit` : A))
}
// @from(Start 14282094, End 14282097)
LSA