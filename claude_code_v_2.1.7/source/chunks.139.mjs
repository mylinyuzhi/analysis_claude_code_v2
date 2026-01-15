
// @from(Ln 410982, Col 0)
function UgA({
  server: A,
  serverToolsCount: Q,
  onViewTools: B,
  onCancel: G,
  onComplete: Z,
  borderless: Y = !1
}) {
  let [J] = oB(), X = MQ(), [I] = a0(), D = n3A(), W = Ke(), [K, V] = V6.useState(!1), F = V6.default.useCallback(async () => {
    let $ = A.client.type !== "disabled";
    try {
      await W(A.name), G()
    } catch (O) {
      Z(`Failed to ${$?"disable":"enable"} MCP server '${A.name}': ${O instanceof Error?O.message:String(O)}`)
    }
  }, [A.client.type, A.name, W, G, Z]), H = String(A.name).charAt(0).toUpperCase() + String(A.name).slice(1), E = uE1(I.mcp.commands, A.name).length, z = [];
  if (A.client.type !== "disabled" && Q > 0) z.push({
    label: "View tools",
    value: "tools"
  });
  if (A.client.type !== "disabled") z.push({
    label: "Reconnect",
    value: "reconnectMcpServer"
  });
  if (z.push({
      label: A.client.type !== "disabled" ? "Disable" : "Enable",
      value: "toggle-enabled"
    }), z.length === 0) z.push({
    label: "Back",
    value: "back"
  });
  if (K) return V6.default.createElement(T, {
    flexDirection: "column",
    gap: 1,
    padding: 1
  }, V6.default.createElement(C, {
    color: "text"
  }, "Reconnecting to ", V6.default.createElement(C, {
    bold: !0
  }, A.name)), V6.default.createElement(T, null, V6.default.createElement(W9, null), V6.default.createElement(C, null, " Restarting MCP server process")), V6.default.createElement(C, {
    dimColor: !0
  }, "This may take a few moments."));
  return V6.default.createElement(T, {
    flexDirection: "column"
  }, V6.default.createElement(T, {
    flexDirection: "column",
    paddingX: 1,
    borderStyle: Y ? void 0 : "round"
  }, V6.default.createElement(T, {
    marginBottom: 1
  }, V6.default.createElement(C, {
    bold: !0
  }, H, " MCP Server")), V6.default.createElement(T, {
    flexDirection: "column",
    gap: 0
  }, V6.default.createElement(T, null, V6.default.createElement(C, {
    bold: !0
  }, "Status: "), A.client.type === "disabled" ? V6.default.createElement(C, null, sQ("inactive", J)(tA.radioOff), " disabled") : A.client.type === "connected" ? V6.default.createElement(C, null, sQ("success", J)(tA.tick), " connected") : A.client.type === "pending" ? V6.default.createElement(V6.default.Fragment, null, V6.default.createElement(C, {
    dimColor: !0
  }, tA.radioOff), V6.default.createElement(C, null, " connecting…")) : V6.default.createElement(C, null, sQ("error", J)(tA.cross), " failed")), V6.default.createElement(T, null, V6.default.createElement(C, {
    bold: !0
  }, "Command: "), V6.default.createElement(C, {
    dimColor: !0
  }, A.config.command)), A.config.args && A.config.args.length > 0 && V6.default.createElement(T, null, V6.default.createElement(C, {
    bold: !0
  }, "Args: "), V6.default.createElement(C, {
    dimColor: !0
  }, A.config.args.join(" "))), V6.default.createElement(T, null, V6.default.createElement(C, {
    bold: !0
  }, "Config location: "), V6.default.createElement(C, {
    dimColor: !0
  }, N$(vs(A.name)?.scope ?? "dynamic"))), A.client.type === "connected" && V6.default.createElement(bE1, {
    serverToolsCount: Q,
    serverPromptsCount: E,
    serverResourcesCount: I.mcp.resources[A.name]?.length || 0
  }), A.client.type === "connected" && Q > 0 && V6.default.createElement(T, null, V6.default.createElement(C, {
    bold: !0
  }, "Tools: "), V6.default.createElement(C, {
    dimColor: !0
  }, Q, " tools"))), z.length > 0 && V6.default.createElement(T, {
    marginTop: 1
  }, V6.default.createElement(k0, {
    options: z,
    onChange: async ($) => {
      if ($ === "tools") B();
      else if ($ === "reconnectMcpServer") {
        V(!0);
        try {
          let O = await D(A.name),
            {
              message: L
            } = hE1(O, A.name);
          Z?.(L)
        } catch (O) {
          Z?.(CgA(O, A.name))
        } finally {
          V(!1)
        }
      } else if ($ === "toggle-enabled") await F();
      else if ($ === "back") G()
    },
    onCancel: G
  }))), V6.default.createElement(T, {
    marginTop: 1
  }, V6.default.createElement(C, {
    dimColor: !0,
    italic: !0
  }, X.pending ? V6.default.createElement(V6.default.Fragment, null, "Press ", X.keyName, " again to exit") : V6.default.createElement(vQ, null, V6.default.createElement(F0, {
    shortcut: "↑↓",
    action: "navigate"
  }), V6.default.createElement(F0, {
    shortcut: "Enter",
    action: "select"
  }), V6.default.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "back"
  })))))
}
// @from(Ln 411102, Col 4)
V6
// @from(Ln 411103, Col 4)
gE1 = w(() => {
  fA();
  u8();
  E9();
  K6();
  e9();
  I3();
  B2();
  hB();
  PJ();
  G$();
  Q_0();
  Hp();
  yG();
  V6 = c(QA(), 1)
})
// @from(Ln 411120, Col 0)
function a3A({
  server: A,
  serverToolsCount: Q,
  onViewTools: B,
  onCancel: G,
  onComplete: Z,
  borderless: Y = !1
}) {
  let [J] = oB(), X = MQ(), [I, D] = D2.default.useState(!1), [W, K] = D2.default.useState(null), [V, F] = a0(), [H, E] = D2.default.useState(null), [z, $] = D2.useState(!1), [O, L] = D2.useState(null), [M, _] = D2.useState(!1), [j, x] = D2.useState(null), [b, S] = D2.useState(!1), [u, f] = D2.useState(null), [AA, n] = D2.useState(!1), y = n3A(), p = D2.default.useCallback(async () => {
    _(!1), x(null), $(!0);
    try {
      let zA = await y(A.name),
        wA = zA.client.type === "connected";
      if (l("tengu_claudeai_mcp_auth_completed", {
          success: wA
        }), wA) Z?.(`Authentication successful. Connected to ${A.name}.`);
      else if (zA.client.type === "needs-auth") Z?.("Authentication successful, but server still requires authentication. You may need to manually restart Claude Code.");
      else Z?.("Authentication successful, but server reconnection failed. You may need to manually restart Claude Code for the changes to take effect.")
    } catch (zA) {
      l("tengu_claudeai_mcp_auth_completed", {
        success: !1
      }), Z?.(CgA(zA, A.name))
    } finally {
      $(!1)
    }
  }, [y, A.name, Z]), GA = D2.default.useCallback(async () => {
    await pc(A.name, {
      ...A.config,
      scope: A.scope
    }), F((zA) => {
      let wA = zA.mcp.clients.map((BA) => BA.name === A.name ? {
          ...BA,
          type: "needs-auth"
        } : BA),
        _A = G_0(zA.mcp.tools, A.name),
        s = Z_0(zA.mcp.commands, A.name),
        t = Y_0(zA.mcp.resources, A.name);
      return {
        ...zA,
        mcp: {
          clients: wA,
          tools: _A,
          commands: s,
          resources: t
        }
      }
    }), l("tengu_claudeai_mcp_clear_auth_completed", {}), Z?.(`Disconnected from ${A.name}.`), S(!1), f(null), n(!1)
  }, [A.name, A.config, A.scope, F, Z]);
  J0((zA, wA) => {
    if (wA.escape && I) {
      if (O) O.abort();
      D(!1), E(null), L(null)
    }
    if (wA.escape && M) _(!1), x(null);
    if (wA.return && M) p();
    if (wA.escape && b) S(!1), f(null), n(!1);
    if (wA.return && b)
      if (AA) GA();
      else {
        let _A = v9(),
          t = `${new URL(_A.CLAUDE_AI_AUTHORIZE_URL).origin}/settings/connectors`;
        f(t), n(!0), i7(t)
      }
  });
  let WA = String(A.name).charAt(0).toUpperCase() + String(A.name).slice(1),
    MA = uE1(V.mcp.commands, A.name).length,
    TA = Ke(),
    bA = D2.default.useCallback(async () => {
      let zA = v9(),
        wA = new URL(zA.CLAUDE_AI_AUTHORIZE_URL).origin,
        s = v3()?.organizationUuid,
        t;
      if (s && A.config.type === "claudeai-proxy" && A.config.id) {
        let BA = A.config.id.startsWith("mcprs") ? "mcpsrv" + A.config.id.slice(5) : A.config.id;
        t = `${wA}/api/organizations/${s}/mcp/start-auth/${BA}`
      } else t = `${wA}/settings/connectors`;
      x(t), _(!0), l("tengu_claudeai_mcp_auth_started", {}), await i7(t)
    }, [A.config]),
    jA = D2.default.useCallback(() => {
      S(!0), l("tengu_claudeai_mcp_clear_auth_started", {})
    }, []),
    OA = D2.default.useCallback(async () => {
      let zA = A.client.type !== "disabled";
      try {
        if (await TA(A.name), A.config.type === "claudeai-proxy") l("tengu_claudeai_mcp_toggle", {
          new_state: zA ? "disabled" : "enabled"
        });
        G()
      } catch (wA) {
        Z?.(`Failed to ${zA?"disable":"enable"} MCP server '${A.name}': ${wA instanceof Error?wA.message:String(wA)}`)
      }
    }, [A.client.type, A.config.type, A.name, TA, G, Z]),
    IA = D2.default.useCallback(async () => {
      if (A.config.type === "claudeai-proxy") return;
      D(!0), K(null);
      let zA = new AbortController;
      L(zA);
      try {
        if (A.isAuthenticated && A.config) await GI0(A.name, A.config);
        if (A.config) {
          await axA(A.name, A.config, E, zA.signal), l("tengu_mcp_auth_config_authenticate", {
            wasAuthenticated: A.isAuthenticated
          });
          let wA = await y(A.name);
          if (wA.client.type === "connected") {
            let _A = A.isAuthenticated ? `Authentication successful. Reconnected to ${A.name}.` : `Authentication successful. Connected to ${A.name}.`;
            Z?.(_A)
          } else if (wA.client.type === "needs-auth") Z?.("Authentication successful, but server still requires authentication. You may need to manually restart Claude Code.");
          else i0(A.name, "Reconnection failed after authentication"), Z?.("Authentication successful, but server reconnection failed. You may need to manually restart Claude Code for the changes to take effect.")
        }
      } catch (wA) {
        if (wA instanceof Error && !(wA instanceof X4A)) K(wA.message)
      } finally {
        D(!1), L(null)
      }
    }, [A.isAuthenticated, A.config, A.name, Z, y]),
    HA = async () => {
      if (A.config.type === "claudeai-proxy") return;
      if (A.config) await GI0(A.name, A.config), l("tengu_mcp_auth_config_clear", {}), await pc(A.name, {
        ...A.config,
        scope: A.scope
      }), F((zA) => {
        let wA = zA.mcp.clients.map((BA) => BA.name === A.name ? {
            ...BA,
            type: "failed"
          } : BA),
          _A = G_0(zA.mcp.tools, A.name),
          s = Z_0(zA.mcp.commands, A.name),
          t = Y_0(zA.mcp.resources, A.name);
        return {
          ...zA,
          mcp: {
            clients: wA,
            tools: _A,
            commands: s,
            resources: t
          }
        }
      }), Z?.(`Authentication cleared for ${A.name}.`)
    };
  if (I) return D2.default.createElement(T, {
    flexDirection: "column",
    gap: 1,
    padding: 1
  }, D2.default.createElement(C, {
    color: "claude"
  }, "Authenticating with ", A.name, "…"), D2.default.createElement(T, null, D2.default.createElement(W9, null), D2.default.createElement(C, null, " A browser window will open for authentication")), H && D2.default.createElement(T, {
    flexDirection: "column"
  }, D2.default.createElement(C, {
    dimColor: !0
  }, "If your browser doesn't open automatically, copy this URL manually:"), D2.default.createElement(i2, {
    url: H
  })), D2.default.createElement(T, {
    marginLeft: 3
  }, D2.default.createElement(C, {
    dimColor: !0
  }, "Return here after authenticating in your browser. Press Esc to go back.")));
  if (z) return D2.default.createElement(T, {
    flexDirection: "column",
    gap: 1,
    padding: 1
  }, D2.default.createElement(C, {
    color: "text"
  }, "Connecting to ", D2.default.createElement(C, {
    bold: !0
  }, A.name), "…"), D2.default.createElement(T, null, D2.default.createElement(W9, null), D2.default.createElement(C, null, " Establishing connection to MCP server")), D2.default.createElement(C, {
    dimColor: !0
  }, "This may take a few moments."));
  let ZA = [];
  if (A.client.type === "disabled") ZA.push({
    label: "Enable",
    value: "toggle-enabled"
  });
  if (A.client.type === "connected" && Q > 0) ZA.push({
    label: "View tools",
    value: "tools"
  });
  if (A.isAuthenticated) ZA.push({
    label: "Re-authenticate",
    value: "reauth"
  }), ZA.push({
    label: "Clear authentication",
    value: "clear-auth"
  });
  if (!A.isAuthenticated) ZA.push({
    label: "Authenticate",
    value: "auth"
  });
  if (A.client.type !== "disabled") {
    if (A.client.type !== "needs-auth") ZA.push({
      label: "Reconnect",
      value: "reconnectMcpServer"
    });
    ZA.push({
      label: "Disable",
      value: "toggle-enabled"
    })
  }
  if (ZA.length === 0) ZA.push({
    label: "Back",
    value: "back"
  });
  return D2.default.createElement(T, {
    flexDirection: "column"
  }, D2.default.createElement(T, {
    flexDirection: "column",
    paddingX: 1,
    borderStyle: Y ? void 0 : "round"
  }, D2.default.createElement(T, {
    marginBottom: 1
  }, D2.default.createElement(C, {
    bold: !0
  }, WA, " MCP Server")), D2.default.createElement(T, {
    flexDirection: "column",
    gap: 0
  }, D2.default.createElement(T, null, D2.default.createElement(C, {
    bold: !0
  }, "Status: "), A.client.type === "disabled" ? D2.default.createElement(C, null, sQ("inactive", J)(tA.radioOff), " disabled") : A.client.type === "connected" ? D2.default.createElement(C, null, sQ("success", J)(tA.tick), " connected") : A.client.type === "pending" ? D2.default.createElement(D2.default.Fragment, null, D2.default.createElement(C, {
    dimColor: !0
  }, tA.radioOff), D2.default.createElement(C, null, " connecting…")) : A.client.type === "needs-auth" ? D2.default.createElement(C, null, sQ("warning", J)(tA.triangleUpOutline), " needs authentication") : D2.default.createElement(C, null, sQ("error", J)(tA.cross), " failed")), A.transport !== "claudeai-proxy" && D2.default.createElement(T, null, D2.default.createElement(C, {
    bold: !0
  }, "Auth: "), A.isAuthenticated ? D2.default.createElement(C, null, sQ("success", J)(tA.tick), " authenticated") : D2.default.createElement(C, null, sQ("error", J)(tA.cross), " not authenticated")), D2.default.createElement(T, null, D2.default.createElement(C, {
    bold: !0
  }, "URL: "), D2.default.createElement(C, {
    dimColor: !0
  }, A.config.url)), D2.default.createElement(T, null, D2.default.createElement(C, {
    bold: !0
  }, "Config location: "), D2.default.createElement(C, {
    dimColor: !0
  }, N$(A.scope))), A.client.type === "connected" && D2.default.createElement(bE1, {
    serverToolsCount: Q,
    serverPromptsCount: MA,
    serverResourcesCount: V.mcp.resources[A.name]?.length || 0
  }), A.client.type === "connected" && Q > 0 && D2.default.createElement(T, null, D2.default.createElement(C, {
    bold: !0
  }, "Tools: "), D2.default.createElement(C, {
    dimColor: !0
  }, Q, " tools"))), W && D2.default.createElement(T, {
    marginTop: 1
  }, D2.default.createElement(C, {
    color: "error"
  }, "Error: ", W)), ZA.length > 0 && D2.default.createElement(T, {
    marginTop: 1
  }, D2.default.createElement(k0, {
    options: ZA,
    onChange: async (zA) => {
      switch (zA) {
        case "tools":
          B();
          break;
        case "auth":
        case "reauth":
          await IA();
          break;
        case "clear-auth":
          await HA();
          break;
        case "claudeai-auth":
          await bA();
          break;
        case "claudeai-clear-auth":
          jA();
          break;
        case "reconnectMcpServer":
          $(!0);
          try {
            let wA = await y(A.name);
            if (A.config.type === "claudeai-proxy") l("tengu_claudeai_mcp_reconnect", {
              success: wA.client.type === "connected"
            });
            let {
              message: _A
            } = hE1(wA, A.name);
            Z?.(_A)
          } catch (wA) {
            if (A.config.type === "claudeai-proxy") l("tengu_claudeai_mcp_reconnect", {
              success: !1
            });
            Z?.(CgA(wA, A.name))
          } finally {
            $(!1)
          }
          break;
        case "toggle-enabled":
          await OA();
          break;
        case "back":
          G();
          break
      }
    },
    onCancel: G
  }))), D2.default.createElement(T, {
    marginTop: 1
  }, D2.default.createElement(C, {
    dimColor: !0,
    italic: !0
  }, X.pending ? D2.default.createElement(D2.default.Fragment, null, "Press ", X.keyName, " again to exit") : D2.default.createElement(vQ, null, D2.default.createElement(F0, {
    shortcut: "↑↓",
    action: "navigate"
  }), D2.default.createElement(F0, {
    shortcut: "Enter",
    action: "select"
  }), D2.default.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "back"
  })))))
}
// @from(Ln 411430, Col 4)
D2
// @from(Ln 411431, Col 4)
mE1 = w(() => {
  fA();
  u8();
  Z0();
  E9();
  K6();
  e9();
  I3();
  B2();
  QVA();
  yG();
  jN();
  hB();
  v1();
  PJ();
  Q_0();
  fA();
  Hp();
  TN();
  JX();
  Q2();
  D2 = c(QA(), 1)
})
// @from(Ln 411455, Col 0)
function qgA({
  server: A,
  onSelectTool: Q,
  onBack: B
}) {
  let G = MQ(),
    [Z] = a0(),
    Y = yE.default.useMemo(() => {
      if (A.client.type !== "connected") return [];
      return o3A(Z.mcp.tools, A.name)
    }, [A, Z.mcp.tools]),
    J = Y.map((X, I) => {
      let D = cE1(X.name, A.name),
        W = X.userFacingName ? X.userFacingName({}) : D,
        K = pE1(W),
        V = X.isReadOnly?.({}) ?? !1,
        F = X.isDestructive?.({}) ?? !1,
        H = X.isOpenWorld?.({}) ?? !1,
        E = [];
      if (V) E.push("read-only");
      if (F) E.push("destructive");
      if (H) E.push("open-world");
      return {
        label: K,
        value: I.toString(),
        description: E.length > 0 ? E.join(", ") : void 0,
        descriptionColor: F ? "error" : V ? "success" : void 0
      }
    });
  return yE.default.createElement(T, {
    flexDirection: "column"
  }, yE.default.createElement(T, {
    flexDirection: "column",
    paddingX: 1,
    borderStyle: "round"
  }, yE.default.createElement(T, {
    marginBottom: 1
  }, yE.default.createElement(C, {
    bold: !0
  }, "Tools for ", A.name), yE.default.createElement(C, {
    dimColor: !0
  }, " (", Y.length, " tools)")), Y.length === 0 ? yE.default.createElement(C, {
    dimColor: !0
  }, "No tools available") : yE.default.createElement(k0, {
    options: J,
    onChange: (X) => {
      let I = parseInt(X),
        D = Y[I];
      if (D) Q(D, I)
    },
    onCancel: B
  })), yE.default.createElement(T, {
    marginLeft: 3
  }, yE.default.createElement(C, {
    dimColor: !0,
    italic: !0
  }, G.pending ? yE.default.createElement(yE.default.Fragment, null, "Press ", G.keyName, " again to exit") : yE.default.createElement(vQ, null, yE.default.createElement(F0, {
    shortcut: "↑↓",
    action: "navigate"
  }), yE.default.createElement(F0, {
    shortcut: "Enter",
    action: "select"
  }), yE.default.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "back"
  })))))
}
// @from(Ln 411524, Col 4)
yE
// @from(Ln 411525, Col 4)
dE1 = w(() => {
  fA();
  u8();
  PJ();
  hB();
  E9();
  K6();
  e9();
  I3();
  yE = c(QA(), 1)
})
// @from(Ln 411537, Col 0)
function NgA({
  tool: A,
  server: Q,
  onBack: B
}) {
  let G = MQ(),
    Z = J3("confirm:no", "Confirmation", "Esc"),
    [Y, J] = W7.default.useState("");
  H2("confirm:no", B, {
    context: "Confirmation"
  });
  let X = cE1(A.name, Q.name),
    I = A.userFacingName ? A.userFacingName({}) : X,
    D = pE1(I),
    W = A.isReadOnly?.({}) ?? !1,
    K = A.isDestructive?.({}) ?? !1,
    V = A.isOpenWorld?.({}) ?? !1;
  return W7.default.useEffect(() => {
    async function F() {
      try {
        let H = await A.description({}, {
          isNonInteractiveSession: !1,
          toolPermissionContext: {
            mode: "default",
            additionalWorkingDirectories: new Map,
            alwaysAllowRules: {},
            alwaysDenyRules: {},
            alwaysAskRules: {},
            isBypassPermissionsModeAvailable: !1
          },
          tools: []
        });
        J(H)
      } catch {
        J("Failed to load description")
      }
    }
    F()
  }, [A]), W7.default.createElement(T, {
    flexDirection: "column"
  }, W7.default.createElement(T, {
    flexDirection: "column",
    paddingX: 1,
    borderStyle: "round"
  }, W7.default.createElement(T, {
    marginBottom: 1
  }, W7.default.createElement(C, {
    bold: !0
  }, D, W7.default.createElement(C, {
    dimColor: !0
  }, " (", Q.name, ")"), W && W7.default.createElement(C, {
    color: "success"
  }, " [read-only]"), K && W7.default.createElement(C, {
    color: "error"
  }, " [destructive]"), V && W7.default.createElement(C, {
    dimColor: !0
  }, " [open-world]"))), W7.default.createElement(T, {
    flexDirection: "column"
  }, W7.default.createElement(T, null, W7.default.createElement(C, {
    bold: !0
  }, "Tool name: "), W7.default.createElement(C, {
    dimColor: !0
  }, X)), W7.default.createElement(T, null, W7.default.createElement(C, {
    bold: !0
  }, "Full name: "), W7.default.createElement(C, {
    dimColor: !0
  }, A.name)), Y && W7.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, W7.default.createElement(C, {
    bold: !0
  }, "Description:"), W7.default.createElement(C, {
    wrap: "wrap"
  }, Y)), A.inputJSONSchema && A.inputJSONSchema.properties && Object.keys(A.inputJSONSchema.properties).length > 0 && W7.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, W7.default.createElement(C, {
    bold: !0
  }, "Parameters:"), W7.default.createElement(T, {
    marginLeft: 2,
    flexDirection: "column"
  }, Object.entries(A.inputJSONSchema.properties).map(([F, H]) => {
    let z = A.inputJSONSchema?.required?.includes(F);
    return W7.default.createElement(C, {
      key: F
    }, "• ", F, z && W7.default.createElement(C, {
      dimColor: !0
    }, " (required)"), ":", " ", W7.default.createElement(C, {
      dimColor: !0
    }, typeof H === "object" && H && "type" in H ? String(H.type) : "unknown"), typeof H === "object" && H && "description" in H && W7.default.createElement(C, {
      dimColor: !0
    }, " ", "- ", String(H.description)))
  }))))), W7.default.createElement(T, {
    marginLeft: 3
  }, W7.default.createElement(C, {
    dimColor: !0
  }, G.pending ? W7.default.createElement(W7.default.Fragment, null, "Press ", G.keyName, " again to exit") : W7.default.createElement(W7.default.Fragment, null, Z, " to go back"))))
}
// @from(Ln 411635, Col 4)
W7
// @from(Ln 411636, Col 4)
lE1 = w(() => {
  fA();
  c6();
  E9();
  NX();
  PJ();
  W7 = c(QA(), 1)
})
// @from(Ln 411645, Col 0)
function J_0({
  agentServer: A,
  onCancel: Q,
  onComplete: B
}) {
  let [G] = oB(), Z = MQ(), [Y, J] = Ve.useState(!1), [X, I] = Ve.useState(null), [D, W] = Ve.useState(null), [K, V] = Ve.useState(null), F = Ve.useCallback(() => {
    if (Y) {
      if (K) K.abort();
      J(!1), W(null), V(null)
    }
  }, [Y, K]);
  H2("confirm:no", F, {
    context: "Confirmation",
    isActive: Y
  });
  let H = Ve.useCallback(async () => {
      if (!A.needsAuth || !A.url) return;
      J(!0), I(null);
      let $ = new AbortController;
      V($);
      try {
        let O = {
          type: A.transport,
          url: A.url
        };
        await axA(A.name, O, W, $.signal), B?.(`Authentication successful for ${A.name}. The server will connect when the agent runs.`)
      } catch (O) {
        if (O instanceof Error && !(O instanceof X4A)) I(O.message)
      } finally {
        J(!1), V(null)
      }
    }, [A, B]),
    E = String(A.name).charAt(0).toUpperCase() + String(A.name).slice(1);
  if (Y) return Z6.default.createElement(T, {
    flexDirection: "column",
    gap: 1,
    padding: 1
  }, Z6.default.createElement(C, {
    color: "claude"
  }, "Authenticating with ", A.name, "…"), Z6.default.createElement(T, null, Z6.default.createElement(W9, null), Z6.default.createElement(C, null, " A browser window will open for authentication")), D && Z6.default.createElement(T, {
    flexDirection: "column"
  }, Z6.default.createElement(C, {
    dimColor: !0
  }, "If your browser doesn't open automatically, copy this URL manually:"), Z6.default.createElement(i2, {
    url: D
  })), Z6.default.createElement(T, {
    marginLeft: 3
  }, Z6.default.createElement(C, {
    dimColor: !0
  }, "Return here after authenticating in your browser.", " ", Z6.default.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "go back"
  }))));
  let z = [];
  if (A.needsAuth) z.push({
    label: A.isAuthenticated ? "Re-authenticate" : "Authenticate",
    value: "auth"
  });
  return z.push({
    label: "Back",
    value: "back"
  }), Z6.default.createElement(Z6.default.Fragment, null, Z6.default.createElement(T, {
    flexDirection: "column",
    paddingX: 1,
    borderStyle: "round"
  }, Z6.default.createElement(T, {
    marginBottom: 1
  }, Z6.default.createElement(C, {
    bold: !0
  }, E, " MCP Server"), Z6.default.createElement(C, {
    dimColor: !0
  }, " (agent-only)")), Z6.default.createElement(T, {
    flexDirection: "column",
    gap: 0
  }, Z6.default.createElement(T, null, Z6.default.createElement(C, {
    bold: !0
  }, "Type: "), Z6.default.createElement(C, {
    dimColor: !0
  }, A.transport)), A.url && Z6.default.createElement(T, null, Z6.default.createElement(C, {
    bold: !0
  }, "URL: "), Z6.default.createElement(C, {
    dimColor: !0
  }, A.url)), A.command && Z6.default.createElement(T, null, Z6.default.createElement(C, {
    bold: !0
  }, "Command: "), Z6.default.createElement(C, {
    dimColor: !0
  }, A.command)), Z6.default.createElement(T, null, Z6.default.createElement(C, {
    bold: !0
  }, "Used by: "), Z6.default.createElement(C, {
    dimColor: !0
  }, A.sourceAgents.join(", "))), Z6.default.createElement(T, {
    marginTop: 1
  }, Z6.default.createElement(C, {
    bold: !0
  }, "Status: "), Z6.default.createElement(C, null, sQ("inactive", G)(tA.radioOff), " not connected (agent-only)")), A.needsAuth && Z6.default.createElement(T, null, Z6.default.createElement(C, {
    bold: !0
  }, "Auth: "), A.isAuthenticated ? Z6.default.createElement(C, null, sQ("success", G)(tA.tick), " authenticated") : Z6.default.createElement(C, null, sQ("warning", G)(tA.triangleUpOutline), " may need authentication"))), Z6.default.createElement(T, {
    marginTop: 1
  }, Z6.default.createElement(C, {
    dimColor: !0
  }, "This server connects only when running the agent.")), X && Z6.default.createElement(T, {
    marginTop: 1
  }, Z6.default.createElement(C, {
    color: "error"
  }, "Error: ", X)), Z6.default.createElement(T, {
    marginTop: 1
  }, Z6.default.createElement(k0, {
    options: z,
    onChange: async ($) => {
      switch ($) {
        case "auth":
          await H();
          break;
        case "back":
          Q();
          break
      }
    },
    onCancel: Q
  }))), Z6.default.createElement(T, {
    marginLeft: 3
  }, Z6.default.createElement(C, {
    dimColor: !0
  }, Z.pending ? Z6.default.createElement(Z6.default.Fragment, null, "Press ", Z.keyName, " again to exit") : Z6.default.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "go back"
  }))))
}
// @from(Ln 411777, Col 4)
Z6
// @from(Ln 411777, Col 8)
Ve
// @from(Ln 411778, Col 4)
X_0 = w(() => {
  fA();
  c6();
  I3();
  u8();
  E9();
  B2();
  QVA();
  yG();
  Z6 = c(QA(), 1), Ve = c(QA(), 1)
})
// @from(Ln 411790, Col 0)
function iE1({
  onComplete: A
}) {
  let [Q] = a0(), B = Q.mcp.clients, [G, Z] = MU.default.useState({
    type: "list"
  }), [Y, J] = MU.default.useState([]), X = MU.useMemo(() => w99(Q.agentDefinitions.allAgents), [Q.agentDefinitions.allAgents]), I = MU.default.useMemo(() => B.filter((D) => D.name !== "ide").sort((D, W) => D.name.localeCompare(W.name)), [B]);
  switch (MU.default.useEffect(() => {
      async function D() {
        let W = await Promise.all(I.map(async (K) => {
          let V = K.config.scope,
            F = K.config.type === "sse",
            H = K.config.type === "http",
            E = K.config.type === "claudeai-proxy",
            z = void 0;
          if (F || H) {
            let L = await new I4A(K.name, K.config).tokens();
            z = Boolean(L)
          }
          let $ = {
            name: K.name,
            client: K,
            scope: V
          };
          if (E) return {
            ...$,
            transport: "claudeai-proxy",
            isAuthenticated: !1,
            config: K.config
          };
          else if (F) return {
            ...$,
            transport: "sse",
            isAuthenticated: z,
            config: K.config
          };
          else if (H) return {
            ...$,
            transport: "http",
            isAuthenticated: z,
            config: K.config
          };
          else return {
            ...$,
            transport: "stdio",
            config: K.config
          }
        }));
        J(W)
      }
      D()
    }, [I]), MU.useEffect(() => {
      if (Y.length === 0 && I.length > 0) return;
      if (Y.length === 0 && X.length === 0) A("No MCP servers configured. Please run /doctor if this is unexpected. Otherwise, run `claude mcp --help` or visit https://code.claude.com/docs/en/mcp to learn more.")
    }, [Y.length, I.length, X.length, A]), G.type) {
    case "list":
      return MU.default.createElement(eR0, {
        servers: Y,
        agentServers: X,
        onSelectServer: (D) => Z({
          type: "server-menu",
          server: D
        }),
        onSelectAgentServer: (D) => Z({
          type: "agent-server-menu",
          agentServer: D
        }),
        onComplete: A,
        defaultTab: G.defaultTab
      });
    case "server-menu": {
      let D = o3A(Q.mcp.tools, G.server.name),
        W = G.server.transport === "claudeai-proxy" ? "claude.ai" : "Claude Code";
      if (G.server.transport === "stdio") return MU.default.createElement(UgA, {
        server: G.server,
        serverToolsCount: D.length,
        onViewTools: () => Z({
          type: "server-tools",
          server: G.server
        }),
        onCancel: () => Z({
          type: "list",
          defaultTab: W
        }),
        onComplete: A
      });
      else return MU.default.createElement(a3A, {
        server: G.server,
        serverToolsCount: D.length,
        onViewTools: () => Z({
          type: "server-tools",
          server: G.server
        }),
        onCancel: () => Z({
          type: "list",
          defaultTab: W
        }),
        onComplete: A
      })
    }
    case "server-tools":
      return MU.default.createElement(qgA, {
        server: G.server,
        onSelectTool: (D, W) => Z({
          type: "server-tool-detail",
          server: G.server,
          toolIndex: W
        }),
        onBack: () => Z({
          type: "server-menu",
          server: G.server
        })
      });
    case "server-tool-detail": {
      let W = o3A(Q.mcp.tools, G.server.name)[G.toolIndex];
      if (!W) return Z({
        type: "server-tools",
        server: G.server
      }), null;
      return MU.default.createElement(NgA, {
        tool: W,
        server: G.server,
        onBack: () => Z({
          type: "server-tools",
          server: G.server
        })
      })
    }
    case "agent-server-menu":
      return MU.default.createElement(J_0, {
        agentServer: G.agentServer,
        onCancel: () => Z({
          type: "list",
          defaultTab: "Agents"
        }),
        onComplete: A
      })
  }
}
// @from(Ln 411928, Col 4)
MU
// @from(Ln 411929, Col 4)
N99 = w(() => {
  QVA();
  hB();
  PJ();
  A_0();
  gE1();
  mE1();
  dE1();
  lE1();
  X_0();
  MU = c(QA(), 1)
})
// @from(Ln 411942, Col 0)
function I_0({
  serverName: A,
  onComplete: Q
}) {
  let [B] = oB(), [G] = a0(), Z = n3A(), [Y, J] = wgA.useState(!0), [X, I] = wgA.useState(null);
  if (wgA.useEffect(() => {
      async function D() {
        try {
          if (!G.mcp.clients.find((V) => V.name === A)) {
            I(`MCP server "${A}" not found`), J(!1);
            return
          }
          switch ((await Z(A)).client.type) {
            case "connected":
              Q(`Successfully reconnected to ${A}`);
              break;
            case "needs-auth":
              I(`${A} requires authentication`), J(!1), Q(`${A} requires authentication. Use /mcp to authenticate.`);
              break;
            case "pending":
            case "failed":
            case "disabled":
              I(`Failed to reconnect to ${A}`), J(!1), Q(`Failed to reconnect to ${A}`);
              break;
            case "proxy":
              Q(`${A} is a proxy server and does not require reconnection`);
              break
          }
        } catch (W) {
          let K = W instanceof Error ? W.message : String(W);
          I(K), J(!1), Q(`Error: ${K}`)
        }
      }
      D()
    }, [A, Z, G.mcp.clients, Q]), Y) return Oj.default.createElement(T, {
    flexDirection: "column",
    gap: 1,
    padding: 1
  }, Oj.default.createElement(C, {
    color: "text"
  }, "Reconnecting to ", Oj.default.createElement(C, {
    bold: !0
  }, A)), Oj.default.createElement(T, null, Oj.default.createElement(W9, null), Oj.default.createElement(C, null, " Establishing connection to MCP server")));
  if (X) return Oj.default.createElement(T, {
    flexDirection: "column",
    gap: 1,
    padding: 1
  }, Oj.default.createElement(T, null, Oj.default.createElement(C, null, sQ("error", B)(tA.cross), " "), Oj.default.createElement(C, {
    color: "error"
  }, "Failed to reconnect to ", A)), Oj.default.createElement(C, {
    dimColor: !0
  }, "Error: ", X));
  return null
}
// @from(Ln 411996, Col 4)
Oj
// @from(Ln 411996, Col 8)
wgA
// @from(Ln 411997, Col 4)
D_0 = w(() => {
  fA();
  yG();
  Hp();
  hB();
  fA();
  B2();
  Oj = c(QA(), 1), wgA = c(QA(), 1)
})
// @from(Ln 412006, Col 4)
L99 = w(() => {
  N99();
  A_0();
  gE1();
  mE1();
  X_0();
  dE1();
  lE1();
  D_0()
})
// @from(Ln 412023, Col 0)
function nE1(A) {
  let Q = A.trim(),
    B = vA(),
    G = Q.match(/^([a-zA-Z0-9._-]+@[^:]+:.+?(?:\.git)?)(#(.+))?$/);
  if (G?.[1]) {
    let Z = G[1],
      Y = G[3];
    return Y ? {
      source: "git",
      url: Z,
      ref: Y
    } : {
      source: "git",
      url: Z
    }
  }
  if (Q.startsWith("http://") || Q.startsWith("https://")) {
    let Z = Q.match(/^([^#]+)(#(.+))?$/),
      Y = Z?.[1] || Q,
      J = Z?.[3];
    if (Y.endsWith(".git")) return J ? {
      source: "git",
      url: Y,
      ref: J
    } : {
      source: "git",
      url: Y
    };
    let X;
    try {
      X = new URL(Y)
    } catch (I) {
      return {
        source: "url",
        url: Y
      }
    }
    if (X.hostname === "github.com" || X.hostname === "www.github.com") {
      if (X.pathname.match(/^\/([^/]+\/[^/]+?)(\/|\.git|$)/)?.[1]) {
        let D = Y.endsWith(".git") ? Y : `${Y}.git`;
        return J ? {
          source: "git",
          url: D,
          ref: J
        } : {
          source: "git",
          url: D
        }
      }
    }
    return {
      source: "url",
      url: Y
    }
  }
  if (Q.startsWith("./") || Q.startsWith("../") || Q.startsWith("/") || Q.startsWith("~")) {
    let Z = YX7(Q.startsWith("~") ? Q.replace(/^~/, JX7()) : Q);
    if (!B.existsSync(Z)) return {
      error: `Path does not exist: ${Z}`
    };
    let Y = B.statSync(Z);
    if (Y.isFile())
      if (Z.endsWith(".json")) return {
        source: "file",
        path: Z
      };
      else return {
        error: `File path must point to a .json file (marketplace.json), but got: ${Z}`
      };
    else if (Y.isDirectory()) return {
      source: "directory",
      path: Z
    };
    else return {
      error: `Path is neither a file nor a directory: ${Z}`
    }
  }
  if (Q.includes("/") && !Q.startsWith("@")) {
    if (Q.includes(":")) return null;
    let Z = Q.match(/^([^#]+)(#(.+))?$/),
      Y = Z?.[1] || Q,
      J = Z?.[3];
    return J ? {
      source: "github",
      repo: Y,
      ref: J
    } : {
      source: "github",
      repo: Y
    }
  }
  return null
}
// @from(Ln 412116, Col 4)
W_0 = w(() => {
  DQ()
})
// @from(Ln 412120, Col 0)
function O99({
  inputValue: A,
  setInputValue: Q,
  cursorOffset: B,
  setCursorOffset: G,
  error: Z,
  setError: Y,
  result: J,
  setResult: X,
  setViewState: I,
  onAddComplete: D,
  cliMode: W = !1
}) {
  let K = r3A.useRef(!1),
    [V, F] = r3A.useState(!1),
    [H, E] = r3A.useState(""),
    z = async () => {
      let $ = A.trim();
      if (!$) {
        Y("Please enter a marketplace source");
        return
      }
      let O = nE1($);
      if (!O) {
        Y("Invalid marketplace source format. Try: owner/repo, https://..., or ./path");
        return
      }
      if ("error" in O) {
        Y(O.error);
        return
      }
      Y(null);
      try {
        F(!0), E("");
        let {
          name: L
        } = await NS(O, (_) => {
          E(_)
        });
        NY();
        let M = O.source;
        if (O.source === "github") M = O.repo;
        if (l("tengu_marketplace_added", {
            source_type: M
          }), D) await D();
        if (E(""), F(!1), W) X(`Successfully added marketplace: ${L}`);
        else I({
          type: "browse-marketplace",
          targetMarketplace: L
        })
      } catch (L) {
        let M = L instanceof Error ? L : Error(String(L));
        if (e(M), Y(M.message), E(""), F(!1), W) X(`Error: ${M.message}`);
        else X(null)
      }
    };
  return r3A.useEffect(() => {
    if (A && !K.current && !Z && !J) K.current = !0, z()
  }, []), y4.createElement(T, {
    flexDirection: "column"
  }, y4.createElement(T, {
    flexDirection: "column",
    paddingX: 1,
    borderStyle: "round"
  }, y4.createElement(T, {
    marginBottom: 1
  }, y4.createElement(C, {
    bold: !0
  }, "Add Marketplace")), y4.createElement(T, {
    flexDirection: "column"
  }, y4.createElement(C, null, "Enter marketplace source:"), y4.createElement(C, {
    dimColor: !0
  }, "Examples:"), y4.createElement(C, {
    dimColor: !0
  }, " • owner/repo (GitHub)"), y4.createElement(C, {
    dimColor: !0
  }, " • git@github.com:owner/repo.git (SSH)"), y4.createElement(C, {
    dimColor: !0
  }, " • https://example.com/marketplace.json"), y4.createElement(C, {
    dimColor: !0
  }, " • ./path/to/marketplace"), y4.createElement(T, {
    marginTop: 1
  }, y4.createElement(p4, {
    value: A,
    onChange: Q,
    onSubmit: z,
    columns: 80,
    cursorOffset: B,
    onChangeCursorOffset: G,
    focus: !0,
    showCursor: !0
  }))), V && y4.createElement(T, {
    marginTop: 1
  }, y4.createElement(W9, null), y4.createElement(C, null, H || "Adding marketplace to configuration…")), Z && y4.createElement(T, {
    marginTop: 1
  }, y4.createElement(C, {
    color: "error"
  }, Z)), J && y4.createElement(T, {
    marginTop: 1
  }, y4.createElement(C, null, J))), y4.createElement(T, {
    marginLeft: 3
  }, y4.createElement(C, {
    dimColor: !0,
    italic: !0
  }, y4.createElement(vQ, null, y4.createElement(F0, {
    shortcut: "Enter",
    action: "add"
  }), y4.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "cancel"
  })))))
}
// @from(Ln 412234, Col 4)
y4
// @from(Ln 412234, Col 8)
r3A
// @from(Ln 412235, Col 4)
M99 = w(() => {
  fA();
  IY();
  K6();
  e9();
  I3();
  HI();
  Lx();
  Z0();
  W_0();
  yG();
  v1();
  y4 = c(QA(), 1), r3A = c(QA(), 1)
})
// @from(Ln 412250, Col 0)
function R99({
  setViewState: A,
  error: Q,
  setError: B,
  setResult: G,
  exitState: Z,
  onManageComplete: Y,
  targetMarketplace: J,
  action: X
}) {
  let [I, D] = RU.useState([]), [W, K] = RU.useState(!0), [V, F] = RU.useState(0), [H, E] = RU.useState(!1), [z, $] = RU.useState(null), [O, L] = RU.useState(null), [M, _] = RU.useState(null), [j, x] = RU.useState("list"), [b, S] = RU.useState(null), [u, f] = RU.useState(0), AA = RU.useRef(!1);
  RU.useEffect(() => {
    async function jA() {
      try {
        let OA = await D5(),
          {
            enabled: IA,
            disabled: HA
          } = await DG(),
          ZA = [...IA, ...HA],
          {
            marketplaces: zA,
            failures: wA
          } = await F4A(OA),
          _A = [];
        for (let {
            name: BA,
            config: DA,
            data: CA
          }
          of zA) {
          let FA = ZA.filter((xA) => xA.source.endsWith(`@${BA}`));
          _A.push({
            name: BA,
            source: exA(DA.source),
            lastUpdated: DA.lastUpdated,
            pluginCount: CA?.plugins.length,
            installedPlugins: FA,
            pendingUpdate: !1,
            pendingRemove: !1,
            autoUpdate: oxA(BA, DA)
          })
        }
        _A.sort((BA, DA) => {
          if (BA.name === "claude-plugin-directory") return -1;
          if (DA.name === "claude-plugin-directory") return 1;
          return BA.name.localeCompare(DA.name)
        }), D(_A);
        let s = zA.filter((BA) => BA.data !== null).length,
          t = DVA(wA, s);
        if (t)
          if (t.type === "warning") $(t.message);
          else throw Error(t.message);
        if (J && !AA.current && !Q) {
          AA.current = !0;
          let BA = _A.findIndex((DA) => DA.name === J);
          if (BA >= 0) {
            let DA = _A[BA];
            if (X) {
              F(BA + 1);
              let CA = [..._A];
              if (X === "update") CA[BA].pendingUpdate = !0;
              else if (X === "remove") CA[BA].pendingRemove = !0;
              D(CA), setTimeout(() => {
                p(CA)
              }, 100)
            } else if (DA) F(BA + 1), S(DA), x("details")
          } else if (B) B(`Marketplace not found: ${J}`)
        }
      } catch (OA) {
        if (B) B(OA instanceof Error ? OA.message : "Failed to load marketplaces");
        $(OA instanceof Error ? OA.message : "Failed to load marketplaces")
      } finally {
        K(!1)
      }
    }
    jA()
  }, [J, X, Q]);
  let n = () => {
      return I.some((jA) => jA.pendingUpdate || jA.pendingRemove)
    },
    y = () => {
      let jA = I.filter((IA) => IA.pendingUpdate).length,
        OA = I.filter((IA) => IA.pendingRemove).length;
      return {
        updateCount: jA,
        removeCount: OA
      }
    },
    p = async (jA) => {
      let OA = jA || I,
        IA = j === "details";
      E(!0), $(null), L(null), _(null);
      try {
        let HA = dB("userSettings"),
          ZA = 0,
          zA = 0;
        for (let FA of OA) {
          if (FA.pendingRemove) {
            if (FA.installedPlugins && FA.installedPlugins.length > 0) {
              let xA = {
                ...HA?.enabledPlugins
              };
              for (let mA of FA.installedPlugins) {
                let G1 = Mr(mA.name, FA.name);
                xA[G1] = !1
              }
              pB("userSettings", {
                enabledPlugins: xA
              })
            }
            await _Z1(FA.name), zA++, l("tengu_marketplace_removed", {
              marketplace_name: FA.name,
              plugins_uninstalled: FA.installedPlugins?.length || 0
            });
            continue
          }
          if (FA.pendingUpdate) await Rr(FA.name, (xA) => {
            _(xA)
          }), ZA++, l("tengu_marketplace_updated", {
            marketplace_name: FA.name
          })
        }
        if (NY(), Y) await Y();
        let wA = await D5(),
          {
            enabled: _A,
            disabled: s
          } = await DG(),
          t = [..._A, ...s],
          {
            marketplaces: BA
          } = await F4A(wA),
          DA = [];
        for (let {
            name: FA,
            config: xA,
            data: mA
          }
          of BA) {
          let G1 = t.filter((J1) => J1.source.endsWith(`@${FA}`));
          DA.push({
            name: FA,
            source: exA(xA.source),
            lastUpdated: xA.lastUpdated,
            pluginCount: mA?.plugins.length,
            installedPlugins: G1,
            pendingUpdate: !1,
            pendingRemove: !1,
            autoUpdate: oxA(FA, xA)
          })
        }
        if (DA.sort((FA, xA) => {
            if (FA.name === "claude-plugin-directory") return -1;
            if (xA.name === "claude-plugin-directory") return 1;
            return FA.name.localeCompare(xA.name)
          }), D(DA), IA && b) {
          let FA = DA.find((xA) => xA.name === b.name);
          if (FA) S(FA)
        }
        let CA = [];
        if (ZA > 0) CA.push(`Updated ${ZA} marketplace${ZA>1?"s":""}`);
        if (zA > 0) CA.push(`Removed ${zA} marketplace${zA>1?"s":""}`);
        if (CA.length > 0) {
          let FA = `${tA.tick} ${CA.join(", ")}`;
          if (IA) L(FA);
          else G(FA), setTimeout(() => {
            A({
              type: "menu"
            })
          }, 2000)
        } else if (!IA) A({
          type: "menu"
        })
      } catch (HA) {
        let ZA = HA instanceof Error ? HA.message : String(HA);
        if ($(ZA), B) B(ZA)
      } finally {
        E(!1), _(null)
      }
    }, GA = async () => {
      if (!b) return;
      let jA = I.map((OA) => OA.name === b.name ? {
        ...OA,
        pendingRemove: !0
      } : OA);
      D(jA), await p(jA)
    }, WA = (jA) => {
      if (!jA) return [];
      let OA = [{
        label: `Browse plugins (${jA.pluginCount??0})`,
        value: "browse"
      }, {
        label: "Update marketplace",
        secondaryLabel: jA.lastUpdated ? `(last updated ${new Date(jA.lastUpdated).toLocaleDateString()})` : void 0,
        value: "update"
      }];
      if (!aOA()) OA.push({
        label: jA.autoUpdate ? "Disable auto-update" : "Enable auto-update",
        value: "toggle-auto-update"
      });
      return OA.push({
        label: "Remove marketplace",
        value: "remove"
      }), OA
    }, MA = async (jA) => {
      let OA = !jA.autoUpdate;
      try {
        await I32(jA.name, OA), D((IA) => IA.map((HA) => HA.name === jA.name ? {
          ...HA,
          autoUpdate: OA
        } : HA)), S((IA) => IA ? {
          ...IA,
          autoUpdate: OA
        } : IA)
      } catch (IA) {
        $(IA instanceof Error ? IA.message : "Failed to update setting")
      }
    };
  if (J0((jA, OA) => {
      if (H) return;
      if (OA.escape) {
        if (j === "details" || j === "confirm-remove") {
          x("list"), f(0);
          return
        }
        if (n()) D((IA) => IA.map((HA) => ({
          ...HA,
          pendingUpdate: !1,
          pendingRemove: !1
        }))), F(0);
        else A({
          type: "menu"
        });
        return
      }
      if (j === "list") {
        let IA = I.length + 1,
          HA = V - 1;
        if (OA.upArrow || jA === "k") F((ZA) => Math.max(0, ZA - 1));
        else if (OA.downArrow || jA === "j") F((ZA) => Math.min(IA - 1, ZA + 1));
        else if (jA === "u" || jA === "U") {
          if (HA >= 0) D((ZA) => ZA.map((zA, wA) => wA === HA ? {
            ...zA,
            pendingUpdate: !zA.pendingUpdate,
            pendingRemove: zA.pendingUpdate ? zA.pendingRemove : !1
          } : zA))
        } else if (jA === "r" || jA === "R") {
          if (HA >= 0) {
            let ZA = I[HA];
            if (ZA) S(ZA), x("confirm-remove")
          }
        } else if (OA.return)
          if (V === 0) A({
            type: "add-marketplace"
          });
          else if (n()) p();
        else {
          let ZA = I[HA];
          if (ZA) S(ZA), x("details"), f(0)
        }
      } else if (j === "details") {
        let IA = WA(b),
          HA = IA.length - 1;
        if (OA.upArrow || jA === "k") f((ZA) => Math.max(0, ZA - 1));
        else if (OA.downArrow || jA === "j") f((ZA) => Math.min(HA, ZA + 1));
        else if (OA.return && b) {
          let ZA = IA[u];
          if (ZA?.value === "browse") A({
            type: "browse-marketplace",
            targetMarketplace: b.name
          });
          else if (ZA?.value === "update") {
            let zA = I.map((wA) => wA.name === b.name ? {
              ...wA,
              pendingUpdate: !0
            } : wA);
            D(zA), p(zA)
          } else if (ZA?.value === "toggle-auto-update") MA(b);
          else if (ZA?.value === "remove") x("confirm-remove")
        }
      } else if (j === "confirm-remove") {
        if (jA === "y" || jA === "Y") GA();
        else if (jA === "n" || jA === "N") x("list"), S(null)
      }
    }), W) return f1.createElement(C, null, "Loading marketplaces…");
  if (I.length === 0) return f1.createElement(T, {
    flexDirection: "column"
  }, f1.createElement(T, {
    marginBottom: 1
  }, f1.createElement(C, {
    bold: !0
  }, "Manage marketplaces")), f1.createElement(T, {
    flexDirection: "row",
    gap: 1
  }, f1.createElement(C, {
    color: "suggestion"
  }, tA.pointer, " +"), f1.createElement(C, {
    bold: !0,
    color: "suggestion"
  }, "Add Marketplace")), f1.createElement(T, {
    marginLeft: 3
  }, f1.createElement(C, {
    dimColor: !0,
    italic: !0
  }, Z.pending ? f1.createElement(f1.Fragment, null, "Press ", Z.keyName, " again to go back") : f1.createElement(vQ, null, f1.createElement(F0, {
    shortcut: "Enter",
    action: "select"
  }), f1.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "go back"
  })))));
  if (j === "confirm-remove" && b) {
    let jA = b.installedPlugins?.length || 0;
    return f1.createElement(T, {
      flexDirection: "column"
    }, f1.createElement(C, {
      bold: !0,
      color: "warning"
    }, "Remove marketplace ", f1.createElement(C, {
      italic: !0
    }, b.name), "?"), f1.createElement(T, {
      flexDirection: "column"
    }, jA > 0 && f1.createElement(T, {
      marginTop: 1
    }, f1.createElement(C, {
      color: "warning"
    }, "This will also uninstall ", jA, " plugin", jA !== 1 ? "s" : "", " from this marketplace:")), b.installedPlugins && b.installedPlugins.length > 0 && f1.createElement(T, {
      flexDirection: "column",
      marginTop: 1,
      marginLeft: 2
    }, b.installedPlugins.map((OA) => f1.createElement(C, {
      key: OA.name,
      dimColor: !0
    }, "• ", OA.name))), f1.createElement(T, {
      marginTop: 1
    }, f1.createElement(C, null, "Press ", f1.createElement(C, {
      bold: !0
    }, "y"), " to confirm or ", f1.createElement(C, {
      bold: !0
    }, "n"), " to cancel"))))
  }
  if (j === "details" && b) {
    let jA = b.pendingUpdate || H,
      OA = WA(b);
    return f1.createElement(T, {
      flexDirection: "column"
    }, f1.createElement(C, {
      bold: !0
    }, b.name), f1.createElement(C, {
      dimColor: !0
    }, b.source), f1.createElement(T, {
      marginTop: 1
    }, f1.createElement(C, null, b.pluginCount || 0, " available plugin", b.pluginCount !== 1 ? "s" : "")), b.installedPlugins && b.installedPlugins.length > 0 && f1.createElement(T, {
      flexDirection: "column",
      marginTop: 1
    }, f1.createElement(C, {
      bold: !0
    }, "Installed plugins (", b.installedPlugins.length, "):"), f1.createElement(T, {
      flexDirection: "column",
      marginLeft: 1
    }, b.installedPlugins.map((IA) => f1.createElement(T, {
      key: IA.name,
      flexDirection: "row",
      gap: 1
    }, f1.createElement(C, null, tA.bullet), f1.createElement(T, {
      flexDirection: "column"
    }, f1.createElement(C, null, IA.name), f1.createElement(C, {
      dimColor: !0
    }, IA.manifest.description)))))), jA && f1.createElement(T, {
      marginTop: 1,
      flexDirection: "column"
    }, f1.createElement(C, {
      color: "claude"
    }, "Updating marketplace…"), M && f1.createElement(C, {
      dimColor: !0
    }, M)), !jA && O && f1.createElement(T, {
      marginTop: 1
    }, f1.createElement(C, {
      color: "claude"
    }, O)), !jA && z && f1.createElement(T, {
      marginTop: 1
    }, f1.createElement(C, {
      color: "error"
    }, z)), !jA && f1.createElement(T, {
      flexDirection: "column",
      marginTop: 1
    }, OA.map((IA, HA) => {
      if (!IA) return null;
      let ZA = HA === u;
      return f1.createElement(T, {
        key: IA.value
      }, f1.createElement(C, {
        color: ZA ? "suggestion" : void 0
      }, ZA ? tA.pointer : " ", " ", IA.label), IA.secondaryLabel && f1.createElement(C, {
        dimColor: !0
      }, " ", IA.secondaryLabel))
    })), !jA && !aOA() && b.autoUpdate && f1.createElement(T, {
      marginTop: 1
    }, f1.createElement(C, {
      dimColor: !0
    }, "Auto-update enabled. Claude Code will automatically update this marketplace and its installed plugins.")), f1.createElement(T, {
      marginLeft: 3
    }, f1.createElement(C, {
      dimColor: !0,
      italic: !0
    }, jA ? f1.createElement(f1.Fragment, null, "Please wait…") : f1.createElement(vQ, null, f1.createElement(F0, {
      shortcut: "Enter",
      action: "select"
    }), f1.createElement(hQ, {
      action: "confirm:no",
      context: "Confirmation",
      fallback: "Esc",
      description: "go back"
    })))))
  }
  let {
    updateCount: TA,
    removeCount: bA
  } = y();
  return f1.createElement(T, {
    flexDirection: "column"
  }, f1.createElement(T, {
    marginBottom: 1
  }, f1.createElement(C, {
    bold: !0
  }, "Manage marketplaces")), f1.createElement(T, {
    flexDirection: "row",
    gap: 1,
    marginBottom: 1
  }, f1.createElement(C, {
    color: V === 0 ? "suggestion" : void 0
  }, V === 0 ? tA.pointer : " ", " +"), f1.createElement(C, {
    bold: !0,
    color: V === 0 ? "suggestion" : void 0
  }, "Add Marketplace")), f1.createElement(T, {
    flexDirection: "column"
  }, I.map((jA, OA) => {
    let IA = OA + 1 === V,
      HA = [];
    if (jA.pendingUpdate) HA.push("UPDATE");
    if (jA.pendingRemove) HA.push("REMOVE");
    return f1.createElement(T, {
      key: jA.name,
      flexDirection: "row",
      gap: 1,
      marginBottom: 1
    }, f1.createElement(C, {
      color: IA ? "suggestion" : void 0
    }, IA ? tA.pointer : " ", " ", jA.pendingRemove ? tA.cross : tA.bullet), f1.createElement(T, {
      flexDirection: "column",
      flexGrow: 1
    }, f1.createElement(T, {
      flexDirection: "row",
      gap: 1
    }, f1.createElement(C, {
      bold: !0,
      strikethrough: jA.pendingRemove,
      dimColor: jA.pendingRemove
    }, jA.name === "claude-plugins-official" && f1.createElement(C, {
      color: "claude"
    }, "✻ "), jA.name, jA.name === "claude-plugins-official" && f1.createElement(C, {
      color: "claude"
    }, " ✻")), HA.length > 0 && f1.createElement(C, {
      color: "warning"
    }, "[", HA.join(", "), "]")), f1.createElement(C, {
      dimColor: !0
    }, jA.source), f1.createElement(C, {
      dimColor: !0
    }, jA.pluginCount !== void 0 && f1.createElement(f1.Fragment, null, jA.pluginCount, " available"), jA.installedPlugins && jA.installedPlugins.length > 0 && f1.createElement(f1.Fragment, null, " • ", jA.installedPlugins.length, " installed"), jA.lastUpdated && f1.createElement(f1.Fragment, null, " ", "• Updated", " ", new Date(jA.lastUpdated).toLocaleDateString()))))
  })), n() && f1.createElement(T, {
    marginTop: 1,
    flexDirection: "column"
  }, f1.createElement(C, null, f1.createElement(C, {
    bold: !0
  }, "Pending changes:"), " ", f1.createElement(C, {
    dimColor: !0
  }, "Enter to apply")), TA > 0 && f1.createElement(C, null, "• Update ", TA, " marketplace", TA > 1 ? "s" : ""), bA > 0 && f1.createElement(C, {
    color: "warning"
  }, "• Remove ", bA, " marketplace", bA > 1 ? "s" : "")), H && f1.createElement(T, {
    marginTop: 1
  }, f1.createElement(C, {
    color: "claude"
  }, "Processing changes…")), z && f1.createElement(T, {
    marginTop: 1
  }, f1.createElement(C, {
    color: "error"
  }, z)), f1.createElement(XX7, {
    exitState: Z,
    hasPendingActions: n()
  }))
}
// @from(Ln 412745, Col 0)
function XX7({
  exitState: A,
  hasPendingActions: Q
}) {
  if (A.pending) return f1.createElement(T, {
    marginTop: 1
  }, f1.createElement(C, {
    dimColor: !0,
    italic: !0
  }, "Press ", A.keyName, " again to go back"));
  return f1.createElement(T, {
    marginTop: 1
  }, f1.createElement(C, {
    dimColor: !0,
    italic: !0
  }, f1.createElement(vQ, null, Q && f1.createElement(F0, {
    shortcut: "Enter",
    action: "apply changes"
  }), !Q && f1.createElement(F0, {
    shortcut: "Enter",
    action: "select"
  }), !Q && f1.createElement(F0, {
    shortcut: "u",
    action: "update"
  }), !Q && f1.createElement(F0, {
    shortcut: "r",
    action: "remove"
  }), f1.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: Q ? "cancel" : "go back"
  }))))
}
// @from(Ln 412779, Col 4)
f1
// @from(Ln 412779, Col 8)
RU
// @from(Ln 412780, Col 4)
_99 = w(() => {
  fA();
  fA();
  B2();
  K6();
  e9();
  I3();
  HI();
  Lx();
  Z0();
  GK();
  E4A();
  pz();
  GQ();
  GB();
  f1 = c(QA(), 1), RU = c(QA(), 1)
})
// @from(Ln 412798, Col 0)
function s3A({
  totalItems: A,
  maxVisible: Q = IX7,
  selectedIndex: B = 0
}) {
  let G = A > Q,
    Z = tO.useRef(0),
    Y = tO.useMemo(() => {
      if (!G) return 0;
      let O = Z.current;
      if (B < O) return Z.current = B, B;
      if (B >= O + Q) {
        let _ = B - Q + 1;
        return Z.current = _, _
      }
      let L = Math.max(0, A - Q),
        M = Math.min(O, L);
      return Z.current = M, M
    }, [B, Q, G, A]),
    J = Y,
    X = Math.min(Y + Q, A),
    I = tO.useCallback((O) => {
      if (!G) return O;
      return O.slice(J, X)
    }, [G, J, X]),
    D = tO.useCallback((O) => {
      return J + O
    }, [J]),
    W = tO.useCallback((O) => {
      return O >= J && O < X
    }, [J, X]),
    K = tO.useCallback((O) => {}, []),
    V = tO.useCallback(() => {}, []),
    F = tO.useCallback(() => {}, []),
    H = tO.useCallback((O, L) => {
      let M = Math.max(0, Math.min(O, A - 1));
      L(M)
    }, [A]),
    E = tO.useCallback((O, L) => {
      return !1
    }, []),
    z = Math.max(1, Math.ceil(A / Q));
  return {
    currentPage: Math.floor(Y / Q),
    totalPages: z,
    startIndex: J,
    endIndex: X,
    needsPagination: G,
    pageSize: Q,
    getVisibleItems: I,
    toActualIndex: D,
    isOnCurrentPage: W,
    goToPage: K,
    nextPage: V,
    prevPage: F,
    handleSelectionChange: H,
    handlePageNavigation: E,
    scrollPosition: {
      current: B + 1,
      total: A,
      canScrollUp: Y > 0,
      canScrollDown: Y + Q < A
    }
  }
}
// @from(Ln 412863, Col 4)
tO
// @from(Ln 412863, Col 8)
IX7 = 5
// @from(Ln 412864, Col 4)
LgA = w(() => {
  tO = c(QA(), 1)
})
// @from(Ln 412868, Col 0)
function mzA(A) {
  if (A.entry.source && typeof A.entry.source === "object" && "source" in A.entry.source && A.entry.source.source === "github" && typeof A.entry.source === "object" && "repo" in A.entry.source) return A.entry.source.repo;
  return null
}
// @from(Ln 412873, Col 0)
function dzA(A, Q) {
  let B = [{
    label: "Install for you (user scope)",
    action: "install-user"
  }, {
    label: "Install for all collaborators on this repository (project scope)",
    action: "install-project"
  }, {
    label: "Install for you, in this repo only (local scope)",
    action: "install-local"
  }];
  if (A) B.push({
    label: "Open homepage",
    action: "homepage"
  });
  if (Q) B.push({
    label: "View on GitHub",
    action: "github"
  });
  return B.push({
    label: "Back to plugin list",
    action: "back"
  }), B
}
// @from(Ln 412898, Col 0)
function j99({
  hasSelection: A
}) {
  return _U.createElement(T, {
    marginTop: 1
  }, _U.createElement(C, {
    dimColor: !0,
    italic: !0
  }, _U.createElement(vQ, null, A && _U.createElement(C, {
    bold: !0,
    color: "suggestion"
  }, "i to install"), _U.createElement(F0, {
    shortcut: "Space",
    action: "toggle"
  }), _U.createElement(F0, {
    shortcut: "Enter",
    action: "details"
  }), _U.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "back"
  }))))
}
// @from(Ln 412922, Col 4)
_U
// @from(Ln 412923, Col 4)
K_0 = w(() => {
  fA();
  K6();
  e9();
  I3();
  _U = c(QA(), 1)
})
// @from(Ln 412937, Col 0)
function S99() {
  return P99(zQ(), "plugins", WX7)
}
// @from(Ln 412941, Col 0)
function VX7() {
  let A = vA(),
    Q = S99();
  try {
    if (!A.existsSync(Q)) return k("Install counts cache does not exist"), null;
    let B = A.readFileSync(Q, {
        encoding: "utf-8"
      }),
      G = AQ(B);
    if (typeof G !== "object" || G === null || !("version" in G) || !("fetchedAt" in G) || !("counts" in G)) return k("Install counts cache has invalid structure"), null;
    let Z = G;
    if (Z.version !== V_0) return k(`Install counts cache version mismatch (got ${Z.version}, expected ${V_0})`), null;
    if (typeof Z.fetchedAt !== "string" || !Array.isArray(Z.counts)) return k("Install counts cache has invalid structure"), null;
    let Y = new Date(Z.fetchedAt).getTime();
    if (Number.isNaN(Y)) return k("Install counts cache has invalid fetchedAt timestamp"), null;
    if (!Z.counts.every((I) => typeof I === "object" && I !== null && typeof I.plugin === "string" && typeof I.unique_installs === "number")) return k("Install counts cache has malformed entries"), null;
    if (Date.now() - Y > KX7) return k("Install counts cache is stale (>24h old)"), null;
    return {
      version: Z.version,
      fetchedAt: Z.fetchedAt,
      counts: Z.counts
    }
  } catch (B) {
    return k(`Failed to load install counts cache: ${B instanceof Error?B.message:String(B)}`), null
  }
}
// @from(Ln 412968, Col 0)
function FX7(A) {
  let Q = vA(),
    B = S99(),
    G = `${B}.${DX7(8).toString("hex")}.tmp`;
  try {
    let Z = P99(zQ(), "plugins");
    Q.mkdirSync(Z);
    let Y = eA(A, null, 2);
    bB(G, Y, {
      encoding: "utf-8",
      mode: 384,
      flush: !0
    }), Q.renameSync(G, B), k("Install counts cache saved successfully")
  } catch (Z) {
    e(Z instanceof Error ? Z : Error(String(Z)));
    try {
      if (Q.existsSync(G)) Q.unlinkSync(G)
    } catch {}
  }
}
// @from(Ln 412988, Col 0)
async function HX7() {
  k(`Fetching install counts from ${T99}`);
  let A = await xQ.get(T99, {
    timeout: 1e4
  });
  if (!A.data?.plugins || !Array.isArray(A.data.plugins)) throw Error("Invalid response format from install counts API");
  return A.data.plugins
}
// @from(Ln 412996, Col 0)
async function aE1() {
  let A = VX7();
  if (A) {
    k("Using cached install counts");
    let Q = new Map;
    for (let B of A.counts) Q.set(B.plugin, B.unique_installs);
    return Q
  }
  try {
    let Q = await HX7(),
      B = {
        version: V_0,
        fetchedAt: new Date().toISOString(),
        counts: Q
      };
    FX7(B);
    let G = new Map;
    for (let Z of Q) G.set(Z.plugin, Z.unique_installs);
    return G
  } catch (Q) {
    return e(Q instanceof Error ? Q : Error(String(Q))), k(`Failed to fetch install counts: ${Q instanceof Error?Q.message:String(Q)}`), null
  }
}
// @from(Ln 413020, Col 0)
function oE1(A) {
  if (A < 1000) return String(A);
  if (A < 1e6) {
    let Z = (A / 1000).toFixed(1);
    return Z.endsWith(".0") ? `${Z.slice(0,-2)}K` : `${Z}K`
  }
  let B = (A / 1e6).toFixed(1);
  return B.endsWith(".0") ? `${B.slice(0,-2)}M` : `${B}M`
}
// @from(Ln 413029, Col 4)
V_0 = 1
// @from(Ln 413030, Col 2)
WX7 = "install-counts-cache.json"
// @from(Ln 413031, Col 2)
T99 = "https://raw.githubusercontent.com/anthropics/claude-plugins-official/refs/heads/stats/stats/plugin-installs.json"
// @from(Ln 413032, Col 2)
KX7 = 86400000
// @from(Ln 413033, Col 4)
F_0 = w(() => {
  j5();
  fQ();
  DQ();
  A0();
  T1();
  v1();
  A0()
})
// @from(Ln 413043, Col 0)
function x99({
  error: A,
  setError: Q,
  result: B,
  setResult: G,
  setViewState: Z,
  onInstallComplete: Y,
  targetMarketplace: J,
  targetPlugin: X
}) {
  let [I, D] = HV.useState("marketplace-list"), [W, K] = HV.useState(null), [V, F] = HV.useState(null), [H, E] = HV.useState([]), [z, $] = HV.useState([]), [O, L] = HV.useState(!0), [M, _] = HV.useState(null), [j, x] = HV.useState(0), [b, S] = HV.useState(new Set), [u, f] = HV.useState(new Set), AA = s3A({
    totalItems: z.length,
    selectedIndex: j
  }), [n, y] = HV.useState(0), [p, GA] = HV.useState(!1), [WA, MA] = HV.useState(null), [TA, bA] = HV.useState(null);
  HV.useEffect(() => {
    async function HA() {
      try {
        let ZA = await D5(),
          {
            marketplaces: zA,
            failures: wA
          } = await F4A(ZA),
          _A = [];
        for (let {
            name: BA,
            config: DA,
            data: CA
          }
          of zA)
          if (CA) {
            let FA = CA.plugins.filter((xA) => tC(Mr(xA.name, BA))).length;
            _A.push({
              name: BA,
              totalPlugins: CA.plugins.length,
              installedCount: FA,
              source: exA(DA.source)
            })
          } _A.sort((BA, DA) => {
          if (BA.name === "claude-plugin-directory") return -1;
          if (DA.name === "claude-plugin-directory") return 1;
          return 0
        }), E(_A);
        let s = zA.filter((BA) => BA.data !== null).length,
          t = DVA(wA, s);
        if (t)
          if (t.type === "warning") bA(t.message + ". Showing available marketplaces.");
          else throw Error(t.message);
        if (_A.length === 1 && !J && !X) {
          let BA = _A[0];
          if (BA) K(BA.name), D("plugin-list")
        }
        if (X) {
          let BA = null,
            DA = null;
          for (let [CA] of Object.entries(ZA)) {
            let FA = await rC(CA);
            if (FA) {
              let xA = FA.plugins.find((mA) => mA.name === X);
              if (xA) {
                let mA = Mr(xA.name, CA);
                BA = {
                  entry: xA,
                  marketplaceName: CA,
                  pluginId: mA,
                  isInstalled: tC(mA)
                }, DA = CA;
                break
              }
            }
          }
          if (BA && DA) {
            let CA = BA.pluginId;
            if (tC(CA)) Q(`Plugin '${CA}' is already installed. Use '/plugin' to manage existing plugins.`);
            else K(DA), F(BA), D("plugin-details")
          } else Q(`Plugin "${X}" not found in any marketplace`)
        } else if (J)
          if (_A.some((DA) => DA.name === J)) K(J), D("plugin-list");
          else Q(`Marketplace "${J}" not found`)
      } catch (ZA) {
        Q(ZA instanceof Error ? ZA.message : "Failed to load marketplaces")
      } finally {
        L(!1)
      }
    }
    HA()
  }, [Q, J, X]), HV.useEffect(() => {
    if (!W) return;
    async function HA(ZA) {
      L(!0);
      try {
        let zA = await rC(ZA);
        if (!zA) throw Error(`Failed to load marketplace: ${ZA}`);
        let wA = [];
        for (let _A of zA.plugins) {
          let s = Mr(_A.name, ZA);
          wA.push({
            entry: _A,
            marketplaceName: ZA,
            pluginId: s,
            isInstalled: tC(s)
          })
        }
        try {
          let _A = await aE1();
          if (_(_A), _A) wA.sort((s, t) => {
            let BA = _A.get(s.pluginId) ?? 0,
              DA = _A.get(t.pluginId) ?? 0;
            if (BA !== DA) return DA - BA;
            return s.entry.name.localeCompare(t.entry.name)
          });
          else wA.sort((s, t) => s.entry.name.localeCompare(t.entry.name))
        } catch (_A) {
          k(`Failed to fetch install counts: ${_A instanceof Error?_A.message:String(_A)}`), wA.sort((s, t) => s.entry.name.localeCompare(t.entry.name))
        }
        $(wA), x(0), S(new Set)
      } catch (zA) {
        Q(zA instanceof Error ? zA.message : "Failed to load plugins")
      } finally {
        L(!1)
      }
    }
    HA(W)
  }, [W, Q]);
  let jA = async () => {
    if (b.size === 0) return;
    let HA = z.filter((_A) => b.has(_A.pluginId));
    f(new Set(HA.map((_A) => _A.pluginId)));
    let ZA = 0,
      zA = 0,
      wA = [];
    for (let _A of HA) {
      let s = await ofA({
        pluginId: _A.pluginId,
        entry: _A.entry,
        marketplaceName: _A.marketplaceName,
        scope: "user"
      });
      if (s.success) ZA++;
      else zA++, wA.push({
        name: _A.entry.name,
        reason: s.error
      })
    }
    if (f(new Set), S(new Set), NY(), zA === 0) {
      let _A = `✓ Installed ${ZA} plugin${ZA!==1?"s":""}. Restart Claude Code to load new plugins.`;
      G(_A)
    } else if (ZA === 0) Q(`Failed to install: ${IVA(wA,!0)}`);
    else {
      let _A = `✓ Installed ${ZA} of ${ZA+zA} plugins. Failed: ${IVA(wA,!1)}. Restart Claude Code to load successfully installed plugins.`;
      G(_A)
    }
    if (ZA > 0) {
      if (Y) await Y()
    }
    Z({
      type: "menu"
    })
  }, OA = async (HA, ZA = "user") => {
    GA(!0), MA(null);
    let zA = await ofA({
      pluginId: HA.pluginId,
      entry: HA.entry,
      marketplaceName: HA.marketplaceName,
      scope: ZA
    });
    if (zA.success) {
      if (G(zA.message), Y) await Y();
      Z({
        type: "menu"
      })
    } else GA(!1), MA(zA.error)
  };
  if (HV.useEffect(() => {
      if (A) G(A)
    }, [A, G]), J0((HA, ZA) => {
      if (HA === "m" && (I === "marketplace-list" || I === "plugin-list")) {
        Z({
          type: "manage-marketplaces"
        });
        return
      }
      if (ZA.escape) {
        if (I === "plugin-list")
          if (J) Z({
            type: "manage-marketplaces",
            targetMarketplace: J
          });
          else D("marketplace-list"), K(null), S(new Set);
        else if (I === "plugin-details") D("plugin-list"), F(null);
        else Z({
          type: "menu"
        });
        return
      }
      if (I === "marketplace-list") {
        if ((ZA.upArrow || HA === "k") && j > 0) x(j - 1);
        else if ((ZA.downArrow || HA === "j") && j < H.length - 1) x(j + 1);
        else if (ZA.return) {
          let zA = H[j];
          if (zA) K(zA.name), D("plugin-list")
        }
      } else if (I === "plugin-list") {
        let zA = z.length;
        if (ZA.tab && H.length > 1 && W) {
          let wA = H.findIndex((BA) => BA.name === W),
            _A = ZA.shift ? -1 : 1,
            s = (wA + H.length + _A) % H.length,
            t = H[s];
          if (t) K(t.name), x(0), S(new Set), AA.goToPage(0);
          return
        }
        if ((ZA.upArrow || HA === "k") && j > 0) AA.handleSelectionChange(j - 1, x);
        else if ((ZA.downArrow || HA === "j") && j < zA - 1) AA.handleSelectionChange(j + 1, x);
        else if (HA === " ") {
          if (j < z.length) {
            let wA = z[j];
            if (wA && !wA.isInstalled) {
              let _A = new Set(b);
              if (_A.has(wA.pluginId)) _A.delete(wA.pluginId);
              else _A.add(wA.pluginId);
              S(_A)
            }
          }
        } else if (ZA.return) {
          if (j === z.length && b.size > 0) jA();
          else if (j < z.length) {
            let wA = z[j];
            if (wA)
              if (wA.isInstalled) Z({
                type: "manage-plugins",
                targetPlugin: wA.entry.name,
                targetMarketplace: wA.marketplaceName
              });
              else F(wA), D("plugin-details"), y(0), MA(null)
          }
        } else if (HA === "i" && b.size > 0) jA()
      } else if (I === "plugin-details" && V) {
        let zA = V.entry.homepage,
          wA = mzA(V),
          _A = dzA(zA, wA);
        if ((ZA.upArrow || HA === "k") && n > 0) y(n - 1);
        else if ((ZA.downArrow || HA === "j") && n < _A.length - 1) y(n + 1);
        else if (ZA.return) {
          let s = _A[n]?.action;
          if (s === "install-user") OA(V, "user");
          else if (s === "install-project") OA(V, "project");
          else if (s === "install-local") OA(V, "local");
          else if (s === "homepage" && zA) i7(zA);
          else if (s === "github" && wA) i7(`https://github.com/${wA}`);
          else if (s === "back") D("plugin-list"), F(null)
        }
      }
    }), O) return G0.createElement(C, null, "Loading…");
  if (A) return G0.createElement(C, {
    color: "error"
  }, A);
  if (I === "marketplace-list") {
    if (H.length === 0) return G0.createElement(T, {
      flexDirection: "column"
    }, G0.createElement(T, {
      marginBottom: 1
    }, G0.createElement(C, {
      bold: !0
    }, "Select marketplace")), G0.createElement(C, null, "No marketplaces configured."), G0.createElement(C, {
      dimColor: !0
    }, "Add a marketplace first using ", "'Add marketplace'", "."), G0.createElement(T, {
      marginTop: 1,
      paddingLeft: 1
    }, G0.createElement(C, {
      dimColor: !0
    }, G0.createElement(hQ, {
      action: "confirm:no",
      context: "Confirmation",
      fallback: "Esc",
      description: "go back"
    }))));
    return G0.createElement(T, {
      flexDirection: "column"
    }, G0.createElement(T, {
      marginBottom: 1
    }, G0.createElement(C, {
      bold: !0
    }, "Select marketplace")), TA && G0.createElement(T, {
      marginBottom: 1,
      flexDirection: "column"
    }, G0.createElement(C, {
      color: "warning"
    }, tA.warning, " ", TA)), H.map((HA, ZA) => G0.createElement(T, {
      key: HA.name,
      flexDirection: "column",
      marginBottom: ZA < H.length - 1 ? 1 : 0
    }, G0.createElement(T, null, G0.createElement(C, {
      color: j === ZA ? "suggestion" : void 0
    }, j === ZA ? tA.pointer : " ", " ", HA.name)), G0.createElement(T, {
      marginLeft: 2
    }, G0.createElement(C, {
      dimColor: !0
    }, HA.totalPlugins, " plugin", HA.totalPlugins !== 1 ? "s" : "", " available", HA.installedCount > 0 && ` · ${HA.installedCount} already installed`, HA.source && ` · ${HA.source}`)))), G0.createElement(T, {
      marginTop: 1
    }, G0.createElement(C, {
      dimColor: !0,
      italic: !0
    }, G0.createElement(vQ, null, G0.createElement(F0, {
      shortcut: "Enter",
      action: "select"
    }), G0.createElement(F0, {
      shortcut: "m",
      action: "manage marketplaces"
    }), G0.createElement(hQ, {
      action: "confirm:no",
      context: "Confirmation",
      fallback: "Esc",
      description: "go back"
    })))))
  }
  if (I === "plugin-details" && V) {
    let HA = V.entry.homepage,
      ZA = mzA(V),
      zA = dzA(HA, ZA);
    return G0.createElement(T, {
      flexDirection: "column"
    }, G0.createElement(T, {
      marginBottom: 1
    }, G0.createElement(C, {
      bold: !0
    }, "Plugin Details")), G0.createElement(T, {
      flexDirection: "column",
      marginBottom: 1
    }, G0.createElement(C, {
      bold: !0
    }, V.entry.name), V.entry.version && G0.createElement(C, {
      dimColor: !0
    }, "Version: ", V.entry.version), V.entry.description && G0.createElement(T, {
      marginTop: 1
    }, G0.createElement(C, null, V.entry.description)), V.entry.author && G0.createElement(T, {
      marginTop: 1
    }, G0.createElement(C, {
      dimColor: !0
    }, "By:", " ", typeof V.entry.author === "string" ? V.entry.author : V.entry.author.name))), G0.createElement(T, {
      flexDirection: "column",
      marginBottom: 1
    }, G0.createElement(C, {
      bold: !0
    }, "Will install:"), V.entry.commands && G0.createElement(C, {
      dimColor: !0
    }, "• Commands:", " ", Array.isArray(V.entry.commands) ? V.entry.commands.join(", ") : Object.keys(V.entry.commands).join(", ")), V.entry.agents && G0.createElement(C, {
      dimColor: !0
    }, "• Agents:", " ", Array.isArray(V.entry.agents) ? V.entry.agents.join(", ") : Object.keys(V.entry.agents).join(", ")), V.entry.hooks && G0.createElement(C, {
      dimColor: !0
    }, "• Hooks: ", Object.keys(V.entry.hooks).join(", ")), V.entry.mcpServers && G0.createElement(C, {
      dimColor: !0
    }, "• MCP Servers:", " ", Array.isArray(V.entry.mcpServers) ? V.entry.mcpServers.join(", ") : typeof V.entry.mcpServers === "object" ? Object.keys(V.entry.mcpServers).join(", ") : "configured"), !V.entry.commands && !V.entry.agents && !V.entry.hooks && !V.entry.mcpServers && G0.createElement(G0.Fragment, null, typeof V.entry.source === "object" && "source" in V.entry.source && (V.entry.source.source === "github" || V.entry.source.source === "url" || V.entry.source.source === "npm" || V.entry.source.source === "pip") ? G0.createElement(C, {
      dimColor: !0
    }, "• Component summary not available for remote plugin") : G0.createElement(C, {
      dimColor: !0
    }, "• Components will be discovered at installation"))), G0.createElement(T, {
      marginBottom: 1
    }, G0.createElement(C, {
      color: "claude"
    }, tA.warning, " "), G0.createElement(C, {
      dimColor: !0,
      italic: !0
    }, "Make sure you trust a plugin before installing, updating, or using it. Anthropic does not control what MCP servers, files, or other software are included in plugins and cannot verify that they will work as intended or that they won't change. See each plugin's homepage for more information.")), WA && G0.createElement(T, {
      marginBottom: 1
    }, G0.createElement(C, {
      color: "error"
    }, "Error: ", WA)), G0.createElement(T, {
      flexDirection: "column"
    }, zA.map((wA, _A) => G0.createElement(T, {
      key: wA.action
    }, n === _A && G0.createElement(C, null, "> "), n !== _A && G0.createElement(C, null, "  "), G0.createElement(C, {
      bold: n === _A
    }, p && wA.action === "install" ? "Installing…" : wA.label)))), G0.createElement(T, {
      marginTop: 1,
      paddingLeft: 1
    }, G0.createElement(C, {
      dimColor: !0
    }, G0.createElement(vQ, null, G0.createElement(F0, {
      shortcut: "Enter",
      action: "select"
    }), G0.createElement(hQ, {
      action: "confirm:no",
      context: "Confirmation",
      fallback: "Esc",
      description: "back"
    })))))
  }
  if (z.length === 0) return G0.createElement(T, {
    flexDirection: "column"
  }, G0.createElement(T, {
    marginBottom: 1
  }, G0.createElement(C, {
    bold: !0
  }, "Install plugins")), G0.createElement(C, {
    dimColor: !0
  }, "No new plugins available to install."), G0.createElement(C, {
    dimColor: !0
  }, "All plugins from this marketplace are already installed."), G0.createElement(T, {
    marginLeft: 3
  }, G0.createElement(C, {
    dimColor: !0,
    italic: !0
  }, G0.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "go back"
  }))));
  let IA = AA.getVisibleItems(z);
  return G0.createElement(T, {
    flexDirection: "column"
  }, G0.createElement(T, {
    marginBottom: 1
  }, G0.createElement(C, {
    bold: !0
  }, "Install Plugins")), AA.scrollPosition.canScrollUp && G0.createElement(T, null, G0.createElement(C, {
    dimColor: !0
  }, " ", tA.arrowUp, " more above")), IA.map((HA, ZA) => {
    let zA = AA.toActualIndex(ZA),
      wA = j === zA,
      _A = b.has(HA.pluginId),
      s = u.has(HA.pluginId),
      t = ZA === IA.length - 1;
    return G0.createElement(T, {
      key: HA.pluginId,
      flexDirection: "column",
      marginBottom: t && !A ? 0 : 1
    }, G0.createElement(T, null, G0.createElement(C, {
      color: wA ? "suggestion" : void 0
    }, wA ? tA.pointer : " ", " "), G0.createElement(C, {
      color: HA.isInstalled ? "success" : void 0
    }, HA.isInstalled ? tA.tick : s ? tA.ellipsis : _A ? tA.radioOn : tA.radioOff, " ", HA.entry.name, HA.entry.category && G0.createElement(C, {
      dimColor: !0
    }, " [", HA.entry.category, "]"), HA.entry.tags?.includes("community-managed") && G0.createElement(C, {
      dimColor: !0
    }, " [Community Managed]"), HA.isInstalled && G0.createElement(C, {
      dimColor: !0
    }, " (installed)"), M && G0.createElement(C, {
      dimColor: !0
    }, " · ", oE1(M.get(HA.pluginId) ?? 0), " ", "installs"))), HA.entry.description && G0.createElement(T, {
      marginLeft: 4
    }, G0.createElement(C, {
      dimColor: !0
    }, HA.entry.description.length > 60 ? HA.entry.description.substring(0, 57) + "..." : HA.entry.description), HA.entry.version && G0.createElement(C, {
      dimColor: !0
    }, " · v", HA.entry.version)))
  }), AA.scrollPosition.canScrollDown && G0.createElement(T, null, G0.createElement(C, {
    dimColor: !0
  }, " ", tA.arrowDown, " more below")), A && G0.createElement(T, {
    marginTop: 1
  }, G0.createElement(C, {
    color: "error"
  }, tA.cross, " ", A)), G0.createElement(j99, {
    hasSelection: b.size > 0
  }))
}
// @from(Ln 413499, Col 4)
G0
// @from(Ln 413499, Col 8)
HV
// @from(Ln 413500, Col 4)
y99 = w(() => {
  fA();
  fA();
  B2();
  K6();
  e9();
  I3();
  HI();
  E4A();
  Lx();
  T1();
  TN();
  cc();
  PN();
  LgA();
  K_0();
  F_0();
  G0 = c(QA(), 1), HV = c(QA(), 1)
})
// @from(Ln 413523, Col 0)
function v99({
  error: A,
  setError: Q,
  result: B,
  setResult: G,
  setViewState: Z,
  onInstallComplete: Y,
  targetPlugin: J
}) {
  let [X, I] = ID.useState("plugin-list"), [D, W] = ID.useState(null), [K, V] = ID.useState([]), [F, H] = ID.useState(!0), [E, z] = ID.useState(null), [$, O] = ID.useState(""), [L, M] = ID.useState(!1), _ = GN(), {
    columns: j
  } = ZB(), x = ID.useMemo(() => {
    if (!$) return K;
    let _A = $.toLowerCase();
    return K.filter((s) => s.entry.name.toLowerCase().includes(_A) || s.entry.description?.toLowerCase().includes(_A) || s.marketplaceName.toLowerCase().includes(_A))
  }, [K, $]), [b, S] = ID.useState(0), [u, f] = ID.useState(new Set), [AA, n] = ID.useState(new Set), y = s3A({
    totalItems: x.length,
    selectedIndex: b
  });
  ID.useEffect(() => {
    S(0)
  }, [$]);
  let [p, GA] = ID.useState(0), [WA, MA] = ID.useState(!1), [TA, bA] = ID.useState(null), [jA, OA] = ID.useState(null), [IA, HA] = ID.useState(null);
  ID.useEffect(() => {
    async function _A() {
      try {
        let s = await D5(),
          {
            marketplaces: t,
            failures: BA
          } = await F4A(s),
          DA = [];
        for (let {
            name: G1,
            data: J1
          }
          of t)
          if (J1)
            for (let SA of J1.plugins) {
              let A1 = Mr(SA.name, G1);
              DA.push({
                entry: SA,
                marketplaceName: G1,
                pluginId: A1,
                isInstalled: tC(A1)
              })
            }
        let CA = DA.filter((G1) => !G1.isInstalled);
        try {
          let G1 = await aE1();
          if (z(G1), G1) CA.sort((J1, SA) => {
            let A1 = G1.get(J1.pluginId) ?? 0,
              n1 = G1.get(SA.pluginId) ?? 0;
            if (A1 !== n1) return n1 - A1;
            return J1.entry.name.localeCompare(SA.entry.name)
          });
          else CA.sort((J1, SA) => J1.entry.name.localeCompare(SA.entry.name))
        } catch (G1) {
          k(`Failed to fetch install counts: ${G1 instanceof Error?G1.message:String(G1)}`), CA.sort((J1, SA) => J1.entry.name.localeCompare(SA.entry.name))
        }
        V(CA);
        let FA = Object.keys(s).length;
        if (CA.length === 0) {
          let G1 = await t62({
            configuredMarketplaceCount: FA,
            failedMarketplaceCount: BA.length
          });
          HA(G1)
        }
        let xA = t.filter((G1) => G1.data !== null).length,
          mA = DVA(BA, xA);
        if (mA)
          if (mA.type === "warning") OA(mA.message + ". Showing available plugins.");
          else throw Error(mA.message);
        if (J) {
          let G1 = DA.find((J1) => J1.entry.name === J);
          if (G1)
            if (G1.isInstalled) Q(`Plugin '${G1.pluginId}' is already installed. Use '/plugin' to manage existing plugins.`);
            else W(G1), I("plugin-details");
          else Q(`Plugin "${J}" not found in any marketplace`)
        }
      } catch (s) {
        Q(s instanceof Error ? s.message : "Failed to load plugins")
      } finally {
        H(!1)
      }
    }
    _A()
  }, [Q, J]);
  let ZA = async () => {
    if (u.size === 0) return;
    let _A = K.filter((DA) => u.has(DA.pluginId));
    n(new Set(_A.map((DA) => DA.pluginId)));
    let s = 0,
      t = 0,
      BA = [];
    for (let DA of _A) try {
      let CA;
      if (typeof DA.entry.source === "string" && DA.entry.source.startsWith("./")) {
        let mA = await NF(DA.pluginId);
        if (mA) CA = EX7(mA.marketplaceInstallLocation, DA.entry.source)
      }
      await dO(DA.pluginId, DA.entry, "user", void 0, CA);
      let xA = {
        ...dB("userSettings")?.enabledPlugins,
        [DA.pluginId]: !0
      };
      pB("userSettings", {
        enabledPlugins: xA
      }), s++, l("tengu_plugin_installed", {
        plugin_id: DA.pluginId,
        marketplace_name: DA.marketplaceName
      })
    } catch (CA) {
      t++;
      let FA = CA instanceof Error ? CA.message : String(CA);
      BA.push({
        name: DA.entry.name,
        reason: FA
      }), e(CA instanceof Error ? CA : Error(`Failed to install ${DA.entry.name}: ${CA}`))
    }
    if (n(new Set), f(new Set), NY(), t === 0) {
      let DA = `✓ Installed ${s} plugin${s!==1?"s":""}. Restart Claude Code to load new plugins.`;
      G(DA)
    } else if (s === 0) Q(`Failed to install: ${IVA(BA,!0)}`);
    else {
      let DA = `✓ Installed ${s} of ${s+t} plugins. Failed: ${IVA(BA,!1)}. Restart Claude Code to load successfully installed plugins.`;
      G(DA)
    }
    if (s > 0) {
      if (Y) await Y()
    }
    Z({
      type: "menu"
    })
  }, zA = async (_A, s = "user") => {
    MA(!0), bA(null);
    let t = await ofA({
      pluginId: _A.pluginId,
      entry: _A.entry,
      marketplaceName: _A.marketplaceName,
      scope: s
    });
    if (t.success) {
      if (G(t.message), Y) await Y();
      Z({
        type: "menu"
      })
    } else MA(!1), bA(t.error)
  };
  if (ID.useEffect(() => {
      if (A) G(A)
    }, [A, G]), J0((_A, s) => {
      let t = !s.ctrl && !s.meta;
      if (L) {
        if (s.escape)
          if ($.length > 0) O("");
          else M(!1);
        else if (s.return || s.downArrow) M(!1);
        else if (s.backspace || s.delete)
          if ($.length === 0) M(!1);
          else O((BA) => BA.slice(0, -1));
        else if (_A && t) O((BA) => BA + _A)
      } else if (_A === "/" && t) M(!0), O("");
      else if (t && _A.length > 0 && !/^\s+$/.test(_A) && _A !== "j" && _A !== "k" && _A !== "m" && _A !== "i") M(!0), O(_A)
    }, {
      isActive: X === "plugin-list" && !F
    }), J0((_A, s) => {
      if (L) return;
      if (_A === "m" && X === "plugin-list") {
        Z({
          type: "manage-marketplaces"
        });
        return
      }
      if (s.escape) {
        if (X === "plugin-details") I("plugin-list"), W(null);
        else Z({
          type: "menu"
        });
        return
      }
      if (X === "plugin-list") {
        let t = x.length;
        if ((s.upArrow || _A === "k") && b === 0) M(!0);
        else if ((s.upArrow || _A === "k") && b > 0) y.handleSelectionChange(b - 1, S);
        else if ((s.downArrow || _A === "j") && b < t - 1) y.handleSelectionChange(b + 1, S);
        else if (_A === " ") {
          if (b < x.length) {
            let BA = x[b];
            if (BA && !BA.isInstalled) {
              let DA = new Set(u);
              if (DA.has(BA.pluginId)) DA.delete(BA.pluginId);
              else DA.add(BA.pluginId);
              f(DA)
            }
          }
        } else if (s.return) {
          if (b === x.length && u.size > 0) ZA();
          else if (b < x.length) {
            let BA = x[b];
            if (BA)
              if (BA.isInstalled) Z({
                type: "manage-plugins",
                targetPlugin: BA.entry.name,
                targetMarketplace: BA.marketplaceName
              });
              else W(BA), I("plugin-details"), GA(0), bA(null)
          }
        } else if (_A === "i" && u.size > 0) ZA()
      } else if (X === "plugin-details" && D) {
        let t = D.entry.homepage,
          BA = mzA(D),
          DA = dzA(t, BA);
        if ((s.upArrow || _A === "k") && p > 0) GA(p - 1);
        else if ((s.downArrow || _A === "j") && p < DA.length - 1) GA(p + 1);
        else if (s.return) {
          let CA = DA[p]?.action;
          if (CA === "install-user") zA(D, "user");
          else if (CA === "install-project") zA(D, "project");
          else if (CA === "install-local") zA(D, "local");
          else if (CA === "homepage" && t) i7(t);
          else if (CA === "github" && BA) i7(`https://github.com/${BA}`);
          else if (CA === "back") I("plugin-list"), W(null)
        }
      }
    }), F) return B0.createElement(C, null, "Loading…");
  if (A) return B0.createElement(C, {
    color: "error"
  }, A);
  if (X === "plugin-details" && D) {
    let _A = D.entry.homepage,
      s = mzA(D),
      t = dzA(_A, s);
    return B0.createElement(T, {
      flexDirection: "column"
    }, B0.createElement(T, {
      marginBottom: 1
    }, B0.createElement(C, {
      bold: !0
    }, "Plugin details")), B0.createElement(T, {
      flexDirection: "column",
      marginBottom: 1
    }, B0.createElement(C, {
      bold: !0
    }, D.entry.name), B0.createElement(C, {
      dimColor: !0
    }, "from ", D.marketplaceName), D.entry.version && B0.createElement(C, {
      dimColor: !0
    }, "Version: ", D.entry.version), D.entry.description && B0.createElement(T, {
      marginTop: 1
    }, B0.createElement(C, null, D.entry.description)), D.entry.author && B0.createElement(T, {
      marginTop: 1
    }, B0.createElement(C, {
      dimColor: !0
    }, "By:", " ", typeof D.entry.author === "string" ? D.entry.author : D.entry.author.name))), B0.createElement(T, {
      marginBottom: 1
    }, B0.createElement(C, {
      color: "claude"
    }, tA.warning, " "), B0.createElement(C, {
      dimColor: !0,
      italic: !0
    }, "Make sure you trust a plugin before installing, updating, or using it. Anthropic does not control what MCP servers, files, or other software are included in plugins and cannot verify that they will work as intended or that they won't change. See each plugin's homepage for more information.")), TA && B0.createElement(T, {
      marginBottom: 1
    }, B0.createElement(C, {
      color: "error"
    }, "Error: ", TA)), B0.createElement(T, {
      flexDirection: "column"
    }, t.map((BA, DA) => B0.createElement(T, {
      key: BA.action
    }, p === DA && B0.createElement(C, null, "> "), p !== DA && B0.createElement(C, null, "  "), B0.createElement(C, {
      bold: p === DA
    }, WA && BA.action.startsWith("install-") ? "Installing…" : BA.label)))), B0.createElement(T, {
      marginTop: 1
    }, B0.createElement(C, {
      dimColor: !0
    }, B0.createElement(C, {
      bold: !0
    }, "Select:"), " Enter", " · ", B0.createElement(C, {
      bold: !0
    }, "Back:"), " Esc")))
  }
  if (K.length === 0) return B0.createElement(T, {
    flexDirection: "column"
  }, B0.createElement(T, {
    marginBottom: 1
  }, B0.createElement(C, {
    bold: !0
  }, "Discover plugins")), B0.createElement($X7, {
    reason: IA
  }), B0.createElement(T, {
    marginTop: 1
  }, B0.createElement(C, {
    dimColor: !0,
    italic: !0
  }, "Esc to go back")));
  let wA = y.getVisibleItems(x);
  return B0.createElement(T, {
    flexDirection: "column"
  }, B0.createElement(T, null, B0.createElement(C, {
    bold: !0
  }, "Discover plugins"), y.needsPagination && B0.createElement(C, {
    dimColor: !0
  }, " ", "(", y.scrollPosition.current, "/", y.scrollPosition.total, ")")), B0.createElement(T, {
    marginBottom: 1
  }, B0.createElement(Ap, {
    query: $,
    isFocused: L,
    isTerminalFocused: _,
    width: j - 4
  })), jA && B0.createElement(T, {
    marginBottom: 1
  }, B0.createElement(C, {
    color: "warning"
  }, tA.warning, " ", jA)), x.length === 0 && $ && B0.createElement(T, {
    marginBottom: 1
  }, B0.createElement(C, {
    dimColor: !0
  }, 'No plugins match "', $, '"')), y.scrollPosition.canScrollUp && B0.createElement(T, null, B0.createElement(C, {
    dimColor: !0
  }, " ", tA.arrowUp, " more above")), wA.map((_A, s) => {
    let t = y.toActualIndex(s),
      BA = b === t,
      DA = u.has(_A.pluginId),
      CA = AA.has(_A.pluginId),
      FA = s === wA.length - 1;
    return B0.createElement(T, {
      key: `${y.startIndex}-${_A.pluginId}`,
      flexDirection: "column",
      marginBottom: FA && !A ? 0 : 1
    }, B0.createElement(T, null, B0.createElement(C, {
      color: BA && !L ? "suggestion" : void 0
    }, BA && !L ? tA.pointer : " ", " "), B0.createElement(C, null, CA ? tA.ellipsis : DA ? tA.radioOn : tA.radioOff, " ", _A.entry.name, B0.createElement(C, {
      dimColor: !0
    }, " · ", _A.marketplaceName), _A.entry.tags?.includes("community-managed") && B0.createElement(C, {
      dimColor: !0
    }, " [Community Managed]"), E && B0.createElement(C, {
      dimColor: !0
    }, " · ", oE1(E.get(_A.pluginId) ?? 0), " ", "installs"))), _A.entry.description && B0.createElement(T, {
      marginLeft: 4
    }, B0.createElement(C, {
      dimColor: !0
    }, _A.entry.description.length > 60 ? _A.entry.description.substring(0, 57) + "..." : _A.entry.description)))
  }), y.scrollPosition.canScrollDown && B0.createElement(T, null, B0.createElement(C, {
    dimColor: !0
  }, " ", tA.arrowDown, " more below")), A && B0.createElement(T, {
    marginTop: 1
  }, B0.createElement(C, {
    color: "error"
  }, tA.cross, " ", A)), B0.createElement(zX7, {
    hasSelection: u.size > 0
  }))
}
// @from(Ln 413877, Col 0)
function zX7({
  hasSelection: A
}) {
  return B0.createElement(T, {
    marginTop: 1
  }, B0.createElement(C, {
    dimColor: !0,
    italic: !0
  }, B0.createElement(vQ, null, A && B0.createElement(C, {
    bold: !0,
    color: "suggestion"
  }, "i to install"), B0.createElement(C, null, "type to search"), B0.createElement(F0, {
    shortcut: "Space",
    action: "toggle"
  }), B0.createElement(F0, {
    shortcut: "Enter",
    action: "details"
  }), B0.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "back"
  }))))
}
// @from(Ln 413902, Col 0)
function $X7({
  reason: A
}) {
  switch (A) {
    case "git-not-installed":
      return B0.createElement(B0.Fragment, null, B0.createElement(C, {
        dimColor: !0
      }, "Git is required to install marketplaces."), B0.createElement(C, {
        dimColor: !0
      }, "Please install git and restart Claude Code."));
    case "all-blocked-by-policy":
      return B0.createElement(B0.Fragment, null, B0.createElement(C, {
        dimColor: !0
      }, "Your organization policy does not allow any external marketplaces."), B0.createElement(C, {
        dimColor: !0
      }, "Contact your administrator."));
    case "policy-restricts-sources":
      return B0.createElement(B0.Fragment, null, B0.createElement(C, {
        dimColor: !0
      }, "Your organization restricts which marketplaces can be added."), B0.createElement(C, {
        dimColor: !0
      }, "Switch to the Marketplaces tab to view allowed sources."));
    case "all-marketplaces-failed":
      return B0.createElement(B0.Fragment, null, B0.createElement(C, {
        dimColor: !0
      }, "Failed to load marketplace data."), B0.createElement(C, {
        dimColor: !0
      }, "Check your network connection."));
    case "all-plugins-installed":
      return B0.createElement(B0.Fragment, null, B0.createElement(C, {
        dimColor: !0
      }, "All available plugins are already installed."), B0.createElement(C, {
        dimColor: !0
      }, "Check for new plugins later or add more marketplaces."));
    case "no-marketplaces-configured":
    default:
      return B0.createElement(B0.Fragment, null, B0.createElement(C, {
        dimColor: !0
      }, "No plugins available."), B0.createElement(C, {
        dimColor: !0
      }, "Add a marketplace first using the Marketplaces tab."))
  }
}
// @from(Ln 413945, Col 4)
B0
// @from(Ln 413945, Col 8)
ID
// @from(Ln 413946, Col 4)
k99 = w(() => {
  fA();
  B2();
  P4();
  CzA();
  HI();
  E4A();
  GB();
  Lx();
  Z0();
  v1();
  T1();
  TN();
  cc();
  PN();
  LgA();
  K_0();
  F_0();
  K6();
  e9();
  I3();
  B0 = c(QA(), 1), ID = c(QA(), 1)
})
// @from(Ln 413974, Col 0)
function rE1(A) {
  if (!jU.includes(A)) throw Error(`Invalid scope "${A}". Must be one of: ${jU.join(", ")}`)
}
// @from(Ln 413978, Col 0)
function t3A(A) {
  return jU.includes(A)
}
// @from(Ln 413982, Col 0)
function He(A) {
  return A === "project" || A === "local" ? EQ() : void 0
}
// @from(Ln 413986, Col 0)
function UX7(A, Q, B) {
  let G = "";
  if (Object.keys(B?.enabledPlugins || {}).forEach((Z) => {
      if (Z === A || Z === Q.name || Z.startsWith(`${Q.name}@`)) G = Z
    }), !G) G = A.includes("@") ? A : Q.name;
  return G
}
// @from(Ln 413994, Col 0)
function b99(A, Q) {
  let {
    name: B,
    marketplace: G
  } = HVA(A);
  return Q.find((Z) => {
    if (Z.name === A || Z.name === B) return !0;
    if (G && Z.source) return Z.name === B && Z.source.includes(`@${G}`);
    return !1
  })
}
// @from(Ln 414006, Col 0)
function Fe(A) {
  let B = f_().plugins[A];
  if (!B || B.length === 0) return {
    scope: "user"
  };
  let G = EQ(),
    Z = B.find((X) => X.scope === "local" && X.projectPath === G);
  if (Z) return {
    scope: Z.scope,
    projectPath: Z.projectPath
  };
  let Y = B.find((X) => X.scope === "project" && X.projectPath === G);
  if (Y) return {
    scope: Y.scope,
    projectPath: Y.projectPath
  };
  let J = B.find((X) => X.scope === "user");
  if (J) return {
    scope: J.scope
  };
  return {
    scope: B[0].scope,
    projectPath: B[0].projectPath
  }
}
// @from(Ln 414032, Col 0)
function qX7(A, Q, B, G) {
  let Z = G || Fe(A),
    {
      scope: Y
    } = Z,
    J = Pb(Y),
    I = {
      ...dB(J)?.enabledPlugins
    };
  if (Object.keys(I).forEach((W) => {
      if (W === A || W === B.name || W.startsWith(`${B.name}@`)) I[W] = Q
    }), !(A in I)) I[A] = Q;
  let {
    error: D
  } = pB(J, {
    enabledPlugins: I
  });
  if (D) throw D;
  NY()
}
// @from(Ln 414052, Col 0)
async function f99(A, Q = "user") {
  rE1(Q);
  let {
    name: B,
    marketplace: G
  } = HVA(A), Z, Y, J;
  if (G) {
    let z = await NF(A);
    if (z) Z = z.entry, Y = G, J = z.marketplaceInstallLocation
  } else {
    let z = await D5();
    for (let [$, O] of Object.entries(z)) try {
      let M = (await rC($)).plugins.find((_) => _.name === B);
      if (M) {
        Z = M, Y = $, J = O.installLocation;
        break
      }
    } catch (L) {
      e(L instanceof Error ? L : Error(`Failed to load marketplace "${$}": ${L}`));
      continue
    }
  }
  if (!Z || !Y) {
    let z = G ? `marketplace "${G}"` : "any configured marketplace";
    return {
      success: !1,
      message: `Plugin "${B}" not found in ${z}`
    }
  }
  let X = Z,
    I = `${X.name}@${Y}`,
    D = He(Q),
    W, {
      source: K
    } = X;
  if (Tb(K)) {
    if (!J) return {
      success: !1,
      message: `Cannot install local plugin "${B}" without marketplace install location`
    };
    W = H_0(J, K)
  }
  await dO(I, X, Q, D, W);
  let V = Pb(Q),
    H = {
      ...dB(V)?.enabledPlugins,
      [I]: !0
    },
    {
      error: E
    } = pB(V, {
      enabledPlugins: H
    });
  if (E) return {
    success: !1,
    message: `Failed to update settings: ${E.message}`
  };
  return NY(), {
    success: !0,
    message: `Successfully installed plugin: ${I} (scope: ${Q})`,
    pluginId: I,
    pluginName: X.name,
    scope: Q
  }
}