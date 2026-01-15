
// @from(Ln 414117, Col 0)
async function sE1(A, Q = "user") {
  rE1(Q);
  let {
    enabled: B,
    disabled: G
  } = await DG(), Z = [...B, ...G], Y = b99(A, Z);
  if (!Y) return {
    success: !1,
    message: `Plugin "${A}" not found in installed plugins`
  };
  let J = Pb(Q),
    X = dB(J),
    I = UX7(A, Y, X),
    D = He(Q),
    K = f_().plugins[I],
    V = K?.find(($) => $.scope === Q && $.projectPath === D);
  if (!V) {
    let {
      scope: $
    } = Fe(I);
    if ($ !== Q && K && K.length > 0) return {
      success: !1,
      message: `Plugin "${A}" is installed in ${$} scope, not ${Q}. Use --scope ${$} to uninstall.`
    };
    return {
      success: !1,
      message: `Plugin "${A}" is not installed in ${Q} scope. Use --scope to specify the correct scope.`
    }
  }
  let F = V.installPath,
    H = {
      ...X?.enabledPlugins
    };
  H[I] = void 0, pB(J, {
    enabledPlugins: H
  }), NY(), F32(I, Q, D);
  let z = f_().plugins[I];
  if ((!z || z.length === 0) && F) NF1(F);
  return {
    success: !0,
    message: `Successfully uninstalled plugin: ${Y.name} (scope: ${Q})`,
    pluginId: I,
    pluginName: Y.name,
    scope: Q
  }
}
// @from(Ln 414163, Col 0)
async function h99(A, Q, B) {
  let G = Q ? "enable" : "disable";
  if (B) rE1(B);
  let {
    enabled: Z,
    disabled: Y
  } = await DG(), X = b99(A, Q ? Y : Z);
  if (!X) return {
    success: !1,
    message: `Plugin "${A}" not found in ${Q?"disabled":"enabled"} plugins`
  };
  let I = A.includes("@") ? A : `${X.name}@${X.source?.split("@")[1]||"unknown"}`,
    D;
  if (B) {
    let W = He(B);
    D = {
      scope: B,
      projectPath: W
    };
    let K = Fe(I);
    if (K.scope !== B) return {
      success: !1,
      message: `Plugin "${A}" is installed at ${K.scope} scope, not ${B}. Use --scope ${K.scope} or omit --scope to auto-detect.`
    }
  } else D = Fe(I);
  if (!t3A(D.scope)) return {
    success: !1,
    message: `Managed plugins cannot be ${G}d. They can only be updated.`
  };
  try {
    qX7(I, Q, X, D)
  } catch (W) {
    return {
      success: !1,
      message: W instanceof Error ? W.message : `Failed to ${G} plugin`
    }
  }
  return {
    success: !0,
    message: `Successfully ${G}d plugin: ${X.name} (scope: ${D.scope})`,
    pluginId: I,
    pluginName: X.name,
    scope: D.scope
  }
}
// @from(Ln 414208, Col 0)
async function e3A(A, Q) {
  return h99(A, !0, Q)
}
// @from(Ln 414211, Col 0)
async function MgA(A, Q) {
  return h99(A, !1, Q)
}
// @from(Ln 414214, Col 0)
async function czA(A, Q) {
  let {
    name: B,
    marketplace: G
  } = HVA(A), Z = G ? `${B}@${G}` : A, Y = await NF(A);
  if (!Y) return {
    success: !1,
    message: `Plugin "${B}" not found`,
    pluginId: Z,
    scope: Q
  };
  let {
    entry: J,
    marketplaceInstallLocation: X
  } = Y, D = jr().plugins[Z];
  if (!D || D.length === 0) return {
    success: !1,
    message: `Plugin "${B}" is not installed`,
    pluginId: Z,
    scope: Q
  };
  let W = He(Q),
    K = D.find((V) => V.scope === Q && V.projectPath === W);
  if (!K) {
    let V = W ? `${Q} (${W})` : Q;
    return {
      success: !1,
      message: `Plugin "${B}" is not installed at scope ${V}`,
      pluginId: Z,
      scope: Q
    }
  }
  return NX7({
    pluginId: Z,
    pluginName: B,
    entry: J,
    marketplaceInstallLocation: X,
    installation: K,
    scope: Q,
    projectPath: W
  })
}
// @from(Ln 414256, Col 0)
async function NX7({
  pluginId: A,
  pluginName: Q,
  entry: B,
  marketplaceInstallLocation: G,
  installation: Z,
  scope: Y,
  projectPath: J
}) {
  let X = vA(),
    I = Z.version,
    D, W, K = !1;
  if (typeof B.source !== "string") {
    let V = await $3A(B.source, {
      manifest: {
        name: B.name
      }
    });
    D = V.path, K = !0, W = await Od(A, B.source, V.manifest, V.path, B.version)
  } else {
    if (!X.existsSync(G)) return {
      success: !1,
      message: `Marketplace directory not found at ${G}`,
      pluginId: A,
      scope: Y
    };
    let V = X.statSync(G).isDirectory() ? G : CX7(G);
    if (D = H_0(V, B.source), !X.existsSync(D)) return {
      success: !1,
      message: `Plugin source not found at ${D}`,
      pluginId: A,
      scope: Y
    };
    let F, H = H_0(D, ".claude-plugin", "plugin.json");
    try {
      F = LF1(H, B.name, B.source)
    } catch {}
    W = await Od(A, B.source, F, D, B.version)
  }
  try {
    let V = xb(A, W);
    if (Z.version === W || Z.installPath === V) return {
      success: !0,
      message: `${Q} is already at the latest version (${W}).`,
      pluginId: A,
      newVersion: W,
      oldVersion: I,
      alreadyUpToDate: !0,
      scope: Y
    };
    if (!X.existsSync(V)) await wF1(D, A, W, B);
    let H = Z.installPath;
    if (H32(A, Y, J, V, W), H && H !== V) {
      let $ = jr();
      if (!Object.values($.plugins).some((L) => L.some((M) => M.installPath === H)) && X.existsSync(H)) NF1(H)
    }
    let E = J ? `${Y} (${J})` : Y;
    return {
      success: !0,
      message: `Plugin "${Q}" updated from ${I||"unknown"} to ${W} for scope ${E}. Restart to apply changes.`,
      pluginId: A,
      newVersion: W,
      oldVersion: I,
      scope: Y
    }
  } finally {
    if (K && D !== xb(A, W)) X.rmSync(D, {
      recursive: !0,
      force: !0
    })
  }
}
// @from(Ln 414328, Col 4)
jU
// @from(Ln 414328, Col 8)
OgA
// @from(Ln 414329, Col 4)
pzA = w(() => {
  GK();
  PN();
  cc();
  HI();
  pz();
  GB();
  Lx();
  z4A();
  C0();
  jZ1();
  DQ();
  v1();
  jU = ["user", "project", "local"], OgA = ["user", "project", "local", "managed"]
})
// @from(Ln 414345, Col 0)
function g99({
  pluginName: A,
  serverName: Q,
  configSchema: B,
  onSave: G,
  onCancel: Z
}) {
  let Y = Object.keys(B),
    [J, X] = tE1.useState(0),
    [I, D] = tE1.useState({}),
    [W, K] = tE1.useState(""),
    V = Y[J],
    F = V ? B[V] : null,
    H = MQ(Z);
  if (J0((O, L) => {
      if (L.escape) {
        Z();
        return
      }
      if (L.tab && J < Y.length - 1) {
        if (V) D({
          ...I,
          [V]: W
        });
        X(J + 1), K("");
        return
      }
      if (L.return) {
        if (V) {
          let M = {
            ...I,
            [V]: W
          };
          if (J === Y.length - 1) {
            let _ = {};
            for (let j of Y) {
              let x = M[j] || "",
                b = B[j];
              if (b?.type === "number") {
                let S = Number(x);
                _[j] = isNaN(S) ? x : S
              } else if (b?.type === "boolean") _[j] = x.toLowerCase() === "true" || x === "1";
              else _[j] = x
            }
            G(_)
          } else D(M), X(J + 1), K("")
        }
        return
      }
      if (L.backspace || L.delete) {
        K(W.slice(0, -1));
        return
      }
      if (O && !L.ctrl && !L.meta) K(W + O)
    }), !F || !V) return null;
  let E = F.sensitive === !0,
    z = F.required === !0,
    $ = E ? "*".repeat(W.length) : W;
  return YJ.default.createElement(T, {
    flexDirection: "column"
  }, YJ.default.createElement(T, {
    flexDirection: "column",
    gap: 1,
    padding: 1,
    borderStyle: "round"
  }, YJ.default.createElement(C, {
    bold: !0
  }, "Configure ", Q), YJ.default.createElement(T, {
    marginLeft: 1
  }, YJ.default.createElement(C, {
    dimColor: !0
  }, "Plugin: ", A)), YJ.default.createElement(T, {
    marginTop: 1,
    flexDirection: "column"
  }, YJ.default.createElement(C, {
    bold: !0
  }, F.title || V, z && YJ.default.createElement(C, {
    color: "error"
  }, " *")), F.description && YJ.default.createElement(C, {
    dimColor: !0
  }, F.description), YJ.default.createElement(T, {
    marginTop: 1
  }, YJ.default.createElement(C, null, tA.pointerSmall, " "), YJ.default.createElement(C, null, $), YJ.default.createElement(C, null, "█"))), YJ.default.createElement(T, {
    marginTop: 1
  }, YJ.default.createElement(C, {
    dimColor: !0
  }, "Field ", J + 1, " of ", Y.length)), J < Y.length - 1 && YJ.default.createElement(T, null, YJ.default.createElement(C, {
    dimColor: !0
  }, "Tab: Next field · Enter: Save and continue")), J === Y.length - 1 && YJ.default.createElement(T, null, YJ.default.createElement(C, {
    dimColor: !0
  }, "Enter: Save configuration"))), YJ.default.createElement(T, {
    marginLeft: 3
  }, YJ.default.createElement(C, {
    dimColor: !0
  }, H.pending ? YJ.default.createElement(YJ.default.Fragment, null, "Press ", H.keyName, " again to exit") : YJ.default.createElement(YJ.default.Fragment, null, "Esc to cancel"))))
}
// @from(Ln 414441, Col 4)
YJ
// @from(Ln 414441, Col 8)
tE1
// @from(Ln 414442, Col 4)
u99 = w(() => {
  fA();
  E9();
  B2();
  YJ = c(QA(), 1), tE1 = c(QA(), 1)
})
// @from(Ln 414449, Col 0)
function m99({
  item: A,
  isSelected: Q
}) {
  let [B] = oB();
  if (A.type === "plugin") {
    let Y, J;
    if (A.pendingToggle) Y = sQ("suggestion", B)(tA.arrowRight), J = A.pendingToggle === "will-enable" ? "will enable" : "will disable";
    else if (A.errorCount > 0) Y = sQ("error", B)(tA.cross), J = `${A.errorCount} error${A.errorCount!==1?"s":""}`;
    else if (!A.isEnabled) Y = sQ("inactive", B)(tA.radioOff), J = "disabled";
    else Y = sQ("success", B)(tA.tick), J = "enabled";
    return M6.createElement(T, null, M6.createElement(C, {
      color: Q ? "suggestion" : void 0
    }, Q ? `${tA.pointer} ` : "  "), M6.createElement(C, {
      color: Q ? "suggestion" : void 0
    }, A.name), M6.createElement(C, {
      dimColor: !Q
    }, " ", M6.createElement(C, {
      backgroundColor: "userMessageBackground"
    }, "Plugin")), M6.createElement(C, {
      dimColor: !0
    }, " · ", A.marketplace), M6.createElement(C, {
      dimColor: !Q
    }, " · ", Y, " "), M6.createElement(C, {
      dimColor: !Q
    }, J))
  }
  let G, Z;
  if (A.status === "connected") G = sQ("success", B)(tA.tick), Z = "connected";
  else if (A.status === "disabled") G = sQ("inactive", B)(tA.radioOff), Z = "disabled";
  else if (A.status === "pending") G = sQ("inactive", B)(tA.radioOff), Z = "connecting…";
  else if (A.status === "needs-auth") G = sQ("warning", B)(tA.triangleUpOutline), Z = "needs auth";
  else G = sQ("error", B)(tA.cross), Z = "failed";
  if (A.indented) return M6.createElement(T, null, M6.createElement(C, {
    color: Q ? "suggestion" : void 0
  }, Q ? `${tA.pointer} ` : "  "), M6.createElement(C, {
    dimColor: !Q
  }, "└ "), M6.createElement(C, {
    color: Q ? "suggestion" : void 0
  }, A.name), M6.createElement(C, {
    dimColor: !Q
  }, " ", M6.createElement(C, {
    backgroundColor: "userMessageBackground"
  }, "MCP")), M6.createElement(C, {
    dimColor: !Q
  }, " · ", G, " "), M6.createElement(C, {
    dimColor: !Q
  }, Z));
  return M6.createElement(T, null, M6.createElement(C, {
    color: Q ? "suggestion" : void 0
  }, Q ? `${tA.pointer} ` : "  "), M6.createElement(C, {
    color: Q ? "suggestion" : void 0
  }, A.name), M6.createElement(C, {
    dimColor: !Q
  }, " ", M6.createElement(C, {
    backgroundColor: "userMessageBackground"
  }, "MCP")), M6.createElement(C, {
    dimColor: !Q
  }, " · ", G, " "), M6.createElement(C, {
    dimColor: !Q
  }, Z))
}
// @from(Ln 414511, Col 4)
M6
// @from(Ln 414512, Col 4)
d99 = w(() => {
  fA();
  B2();
  M6 = c(QA(), 1)
})
// @from(Ln 414518, Col 0)
function p99(A) {
  switch (A.type) {
    case "path-not-found":
      return `${A.component} path not found: ${A.path}`;
    case "git-auth-failed":
      return `Git ${A.authType.toUpperCase()} authentication failed for ${A.gitUrl}`;
    case "git-timeout":
      return `Git ${A.operation} timed out for ${A.gitUrl}`;
    case "network-error":
      return `Network error accessing ${A.url}${A.details?`: ${A.details}`:""}`;
    case "manifest-parse-error":
      return `Failed to parse manifest at ${A.manifestPath}: ${A.parseError}`;
    case "manifest-validation-error":
      return `Invalid manifest at ${A.manifestPath}: ${A.validationErrors.join(", ")}`;
    case "plugin-not-found":
      return `Plugin '${A.pluginId}' not found in marketplace '${A.marketplace}'`;
    case "marketplace-not-found":
      return `Marketplace '${A.marketplace}' not found`;
    case "marketplace-load-failed":
      return `Failed to load marketplace '${A.marketplace}': ${A.reason}`;
    case "repository-scan-failed":
      return `Failed to scan repository at ${A.repositoryPath}: ${A.reason}`;
    case "mcp-config-invalid":
      return `Invalid MCP server config for '${A.serverName}': ${A.validationError}`;
    case "hook-load-failed":
      return `Failed to load hooks from ${A.hookPath}: ${A.reason}`;
    case "component-load-failed":
      return `Failed to load ${A.component} from ${A.path}: ${A.reason}`;
    case "mcpb-download-failed":
      return `Failed to download MCPB from ${A.url}: ${A.reason}`;
    case "mcpb-extract-failed":
      return `Failed to extract MCPB ${A.mcpbPath}: ${A.reason}`;
    case "mcpb-invalid-manifest":
      return `MCPB manifest invalid at ${A.mcpbPath}: ${A.validationError}`;
    case "marketplace-blocked-by-policy":
      return A.blockedByBlocklist ? `Marketplace '${A.marketplace}' is blocked by enterprise policy` : `Marketplace '${A.marketplace}' is not in the allowed marketplace list`;
    case "generic-error":
      return A.error;
    default:
      return "Unknown error"
  }
}
// @from(Ln 414561, Col 0)
function l99(A) {
  switch (A.type) {
    case "path-not-found":
      return "Check that the path in your manifest or marketplace config is correct";
    case "git-auth-failed":
      return A.authType === "ssh" ? "Configure SSH keys or use HTTPS URL instead" : "Configure credentials or use SSH URL instead";
    case "git-timeout":
    case "network-error":
      return "Check your internet connection and try again";
    case "manifest-parse-error":
      return "Check manifest file syntax in the plugin directory";
    case "manifest-validation-error":
      return "Check manifest file follows the required schema";
    case "plugin-not-found":
      return `Plugin may not exist in marketplace '${A.marketplace}'`;
    case "marketplace-not-found":
      return A.availableMarketplaces.length > 0 ? `Available marketplaces: ${A.availableMarketplaces.join(", ")}` : "Add the marketplace first using /plugin marketplace add";
    case "mcp-config-invalid":
      return "Check MCP server configuration in .mcp.json or manifest";
    case "hook-load-failed":
      return "Check hooks.json file syntax and structure";
    case "component-load-failed":
      return `Check ${A.component} directory structure and file permissions`;
    case "mcpb-download-failed":
      return "Check your internet connection and URL accessibility";
    case "mcpb-extract-failed":
      return "Verify the MCPB file is valid and not corrupted";
    case "mcpb-invalid-manifest":
      return "Contact the plugin author about the invalid manifest";
    case "marketplace-blocked-by-policy":
      if (A.blockedByBlocklist) return "This marketplace source is explicitly blocked by your administrator";
      return A.allowedSources.length > 0 ? `Allowed sources: ${A.allowedSources.join(", ")}` : "Contact your administrator to configure allowed marketplace sources";
    case "repository-scan-failed":
    case "marketplace-load-failed":
    case "generic-error":
      return null;
    default:
      return null
  }
}
// @from(Ln 414601, Col 4)
c99
// @from(Ln 414601, Col 9)
wX7
// @from(Ln 414602, Col 4)
i99 = w(() => {
  fA();
  hB();
  LgA();
  I3();
  c99 = c(QA(), 1), wX7 = c(QA(), 1)
})
// @from(Ln 414611, Col 0)
async function n99(A) {
  try {
    return (await Q8A.readdir(A, {
      withFileTypes: !0
    })).filter((B) => B.isFile() && B.name.endsWith(".md")).map((B) => {
      return A8A.basename(B.name, ".md")
    })
  } catch (Q) {
    let B = Q instanceof Error ? Q.message : String(Q);
    return k(`Failed to read plugin components from ${A}: ${B}`, {
      level: "error"
    }), e(Q instanceof Error ? Q : Error(`Failed to read plugin components: ${B}`)), []
  }
}
// @from(Ln 414625, Col 0)
async function LX7(A) {
  try {
    let Q = await Q8A.readdir(A, {
        withFileTypes: !0
      }),
      B = [];
    for (let G of Q)
      if (G.isDirectory() || G.isSymbolicLink()) {
        let Z = A8A.join(A, G.name, "SKILL.md");
        try {
          await Q8A.access(Z), B.push(G.name)
        } catch {}
      } return B
  } catch (Q) {
    let B = Q instanceof Error ? Q.message : String(Q);
    return k(`Failed to read skill directories from ${A}: ${B}`, {
      level: "error"
    }), e(Q instanceof Error ? Q : Error(`Failed to read skill directories: ${B}`)), []
  }
}
// @from(Ln 414646, Col 0)
function OX7({
  plugin: A,
  marketplace: Q
}) {
  let [B, G] = dJ.useState(null), [Z, Y] = dJ.useState(!0), [J, X] = dJ.useState(null);
  if (dJ.useEffect(() => {
      async function D() {
        try {
          let K = (await rC(Q)).plugins.find((V) => V.name === A.name);
          if (K) {
            let V = [];
            if (A.commandsPath) V.push(A.commandsPath);
            if (A.commandsPaths) V.push(...A.commandsPaths);
            let F = [];
            for (let M of V)
              if (typeof M === "string") {
                let _ = await n99(M);
                F.push(..._)
              } let H = [];
            if (A.agentsPath) H.push(A.agentsPath);
            if (A.agentsPaths) H.push(...A.agentsPaths);
            let E = [];
            for (let M of H)
              if (typeof M === "string") {
                let _ = await n99(M);
                E.push(..._)
              } let z = [];
            if (A.skillsPath) z.push(A.skillsPath);
            if (A.skillsPaths) z.push(...A.skillsPaths);
            let $ = [];
            for (let M of z)
              if (typeof M === "string") {
                let _ = await LX7(M);
                $.push(..._)
              } let O = [];
            if (A.hooksConfig) O.push(Object.keys(A.hooksConfig));
            if (K.hooks) O.push(K.hooks);
            let L = [];
            if (A.mcpServers) L.push(Object.keys(A.mcpServers));
            if (K.mcpServers) L.push(K.mcpServers);
            G({
              commands: F.length > 0 ? F : null,
              agents: E.length > 0 ? E : null,
              skills: $.length > 0 ? $ : null,
              hooks: O.length > 0 ? O : null,
              mcpServers: L.length > 0 ? L : null
            })
          } else X(`Plugin ${A.name} not found in marketplace`)
        } catch (W) {
          X(W instanceof Error ? W.message : "Failed to load components")
        } finally {
          Y(!1)
        }
      }
      D()
    }, [A.name, A.commandsPath, A.commandsPaths, A.agentsPath, A.agentsPaths, A.skillsPath, A.skillsPaths, A.hooksConfig, A.mcpServers, Q]), Z) return null;
  if (J) return U0.createElement(T, {
    flexDirection: "column",
    marginBottom: 1
  }, U0.createElement(C, {
    bold: !0
  }, "Components:"), U0.createElement(C, {
    dimColor: !0
  }, "Error: ", J));
  if (!B) return null;
  if (!(B.commands || B.agents || B.skills || B.hooks || B.mcpServers)) return null;
  return U0.createElement(T, {
    flexDirection: "column",
    marginBottom: 1
  }, U0.createElement(C, {
    bold: !0
  }, "Installed components:"), B.commands ? U0.createElement(C, {
    dimColor: !0
  }, "• Commands:", " ", typeof B.commands === "string" ? B.commands : Array.isArray(B.commands) ? B.commands.join(", ") : Object.keys(B.commands).join(", ")) : null, B.agents ? U0.createElement(C, {
    dimColor: !0
  }, "• Agents:", " ", typeof B.agents === "string" ? B.agents : Array.isArray(B.agents) ? B.agents.join(", ") : Object.keys(B.agents).join(", ")) : null, B.skills ? U0.createElement(C, {
    dimColor: !0
  }, "• Skills:", " ", typeof B.skills === "string" ? B.skills : Array.isArray(B.skills) ? B.skills.join(", ") : Object.keys(B.skills).join(", ")) : null, B.hooks ? U0.createElement(C, {
    dimColor: !0
  }, "• Hooks:", " ", typeof B.hooks === "string" ? B.hooks : Array.isArray(B.hooks) ? B.hooks.map(String).join(", ") : typeof B.hooks === "object" && B.hooks !== null ? Object.keys(B.hooks).join(", ") : String(B.hooks)) : null, B.mcpServers ? U0.createElement(C, {
    dimColor: !0
  }, "• MCP Servers:", " ", typeof B.mcpServers === "string" ? B.mcpServers : Array.isArray(B.mcpServers) ? B.mcpServers.map(String).join(", ") : typeof B.mcpServers === "object" && B.mcpServers !== null ? Object.keys(B.mcpServers).join(", ") : String(B.mcpServers)) : null)
}
// @from(Ln 414729, Col 0)
async function a99(A, Q) {
  let G = (await rC(Q))?.plugins.find((Z) => Z.name === A);
  if (G && typeof G.source === "string") return `Local plugins cannot be updated remotely. To update, modify the source at: ${G.source}`;
  return null
}
// @from(Ln 414735, Col 0)
function o99({
  setViewState: A,
  setResult: Q,
  onManageComplete: B,
  targetPlugin: G,
  targetMarketplace: Z,
  action: Y
}) {
  let [J] = a0(), [X, I] = dJ.useState("plugin-list"), [D, W] = dJ.useState(null), [K, V] = dJ.useState([]), [F, H] = dJ.useState([]), [E, z] = dJ.useState(!0), [$, O] = dJ.useState(!1), [L, M] = dJ.useState(new Map), _ = Ke(), j = (ZA) => {
    if (ZA.type === "connected") return "connected";
    if (ZA.type === "disabled") return "disabled";
    if (ZA.type === "pending") return "pending";
    if (ZA.type === "needs-auth") return "needs-auth";
    if (ZA.type === "proxy") return "connected";
    return "failed"
  }, x = dJ.useMemo(() => {
    let ZA = jQ(),
      zA = J.plugins.errors,
      wA = new Map;
    for (let FA of J.mcp.clients)
      if (FA.name.startsWith("plugin:")) {
        let xA = FA.name.split(":");
        if (xA.length >= 3) {
          let mA = xA[1],
            G1 = xA.slice(2).join(":"),
            J1 = wA.get(mA) || [];
          J1.push({
            displayName: G1,
            client: FA
          }), wA.set(mA, J1)
        }
      } let _A = [];
    for (let FA of F) {
      let xA = `${FA.plugin.name}@${FA.marketplace}`,
        mA = ZA?.enabledPlugins?.[xA] !== !1,
        G1 = zA.filter((J1) => ("plugin" in J1) && J1.plugin === FA.plugin.name || J1.source === xA || J1.source.startsWith(`${FA.plugin.name}@`));
      _A.push({
        item: {
          type: "plugin",
          id: xA,
          name: FA.plugin.name,
          description: FA.plugin.manifest.description,
          marketplace: FA.marketplace,
          scope: FA.scope || "user",
          isEnabled: mA,
          errorCount: G1.length,
          errors: G1,
          plugin: FA.plugin,
          pendingEnable: FA.pendingEnable,
          pendingUpdate: FA.pendingUpdate,
          pendingToggle: L.get(xA)
        },
        childMcps: wA.get(FA.plugin.name) || []
      })
    }
    let s = [];
    for (let FA of J.mcp.clients) {
      if (FA.name === "ide") continue;
      if (FA.name.startsWith("plugin:")) continue;
      s.push({
        type: "mcp",
        id: `mcp:${FA.name}`,
        name: FA.name,
        description: void 0,
        scope: FA.config.scope,
        status: j(FA),
        client: FA
      })
    }
    let t = {
        project: 0,
        local: 1,
        user: 2,
        enterprise: 3,
        managed: 4,
        dynamic: 5
      },
      BA = [],
      DA = new Map;
    for (let {
        item: FA,
        childMcps: xA
      }
      of _A) {
      let mA = FA.scope;
      if (!DA.has(mA)) DA.set(mA, []);
      DA.get(mA).push(FA);
      for (let {
          displayName: G1,
          client: J1
        }
        of xA) {
        let SA = FA.scope;
        if (!DA.has(SA)) DA.set(SA, []);
        DA.get(SA).push({
          type: "mcp",
          id: `mcp:${J1.name}`,
          name: G1,
          description: void 0,
          scope: SA,
          status: j(J1),
          client: J1,
          indented: !0
        })
      }
    }
    for (let FA of s) {
      let xA = FA.scope;
      if (!DA.has(xA)) DA.set(xA, []);
      DA.get(xA).push(FA)
    }
    let CA = [...DA.keys()].sort((FA, xA) => (t[FA] ?? 99) - (t[xA] ?? 99));
    for (let FA of CA) {
      let xA = DA.get(FA),
        mA = [],
        G1 = [],
        J1 = 0;
      while (J1 < xA.length) {
        let SA = xA[J1];
        if (SA.type === "plugin") {
          let A1 = [SA];
          J1++;
          let n1 = xA[J1];
          while (n1?.type === "mcp" && n1.indented) A1.push(n1), J1++, n1 = xA[J1];
          mA.push(A1)
        } else if (SA.type === "mcp" && !SA.indented) G1.push(SA), J1++;
        else J1++
      }
      mA.sort((SA, A1) => SA[0].name.localeCompare(A1[0].name)), G1.sort((SA, A1) => SA.name.localeCompare(A1.name));
      for (let SA of mA) BA.push(...SA);
      BA.push(...G1)
    }
    return BA
  }, [F, J.mcp.clients, J.plugins.errors, L]), [b, S] = dJ.useState(0), u = s3A({
    totalItems: x.length,
    selectedIndex: b,
    maxVisible: 8
  }), [f, AA] = dJ.useState(0), [n, y] = dJ.useState(!1), [p, GA] = dJ.useState(null), [WA, MA] = dJ.useState(null), [TA, bA] = dJ.useState(!1), [jA, OA] = dJ.useState(!1);
  dJ.useEffect(() => {
    if (!D) {
      OA(!1);
      return
    }
    async function ZA() {
      let zA = D.plugin.manifest.mcpServers,
        wA = !1;
      if (zA) wA = typeof zA === "string" && Hj(zA) || Array.isArray(zA) && zA.some((_A) => typeof _A === "string" && Hj(_A));
      if (!wA) try {
        let _A = A8A.join(D.plugin.path, ".."),
          s = A8A.join(_A, ".claude-plugin", "marketplace.json"),
          t = await Q8A.readFile(s, "utf-8"),
          DA = AQ(t).plugins?.find((CA) => CA.name === D.plugin.name);
        if (DA?.mcpServers) {
          let CA = DA.mcpServers;
          wA = typeof CA === "string" && Hj(CA) || Array.isArray(CA) && CA.some((FA) => typeof FA === "string" && Hj(FA))
        }
      } catch (_A) {
        k(`Failed to read raw marketplace.json: ${_A}`)
      }
      OA(wA)
    }
    ZA()
  }, [D]), dJ.useEffect(() => {
    async function ZA() {
      z(!0);
      try {
        let {
          enabled: zA,
          disabled: wA
        } = await DG(), _A = [...zA, ...wA], s = jQ(), t = {};
        for (let CA of _A) {
          let FA = CA.source.split("@")[1] || "local";
          if (!t[FA]) t[FA] = [];
          t[FA].push(CA)
        }
        let BA = [];
        for (let [CA, FA] of Object.entries(t)) {
          let xA = FA.filter((G1) => {
              let J1 = `${G1.name}@${CA}`;
              return s?.enabledPlugins?.[J1] !== !1
            }).length,
            mA = FA.length - xA;
          BA.push({
            name: CA,
            installedPlugins: FA,
            enabledCount: xA,
            disabledCount: mA
          })
        }
        BA.sort((CA, FA) => {
          if (CA.name === "claude-plugin-directory") return -1;
          if (FA.name === "claude-plugin-directory") return 1;
          return CA.name.localeCompare(FA.name)
        }), V(BA);
        let DA = [];
        for (let CA of BA)
          for (let FA of CA.installedPlugins) {
            let xA = `${FA.name}@${CA.name}`,
              {
                scope: mA
              } = Fe(xA);
            DA.push({
              plugin: FA,
              marketplace: CA.name,
              scope: mA,
              pendingEnable: void 0,
              pendingUpdate: !1
            })
          }
        H(DA), S(0)
      } finally {
        z(!1)
      }
    }
    ZA()
  }, []), dJ.useEffect(() => {
    if (G && K.length > 0 && !E) {
      let ZA = Z ? K.filter((zA) => zA.name === Z) : K;
      for (let zA of ZA) {
        let wA = zA.installedPlugins.find((_A) => _A.name === G);
        if (wA) {
          let _A = `${wA.name}@${zA.name}`,
            {
              scope: s
            } = Fe(_A),
            t = {
              plugin: wA,
              marketplace: zA.name,
              scope: s,
              pendingEnable: void 0,
              pendingUpdate: !1
            };
          W(t), I("plugin-details");
          break
        }
      }
    }
  }, [G, Z, K, E]);
  let IA = async (ZA) => {
    if (!D) return;
    let zA = D.scope || "user";
    if (!t3A(zA) && ZA !== "update") {
      GA("Managed plugins can only be updated, not enabled, disabled, or uninstalled.");
      return
    }
    y(!0), GA(null);
    try {
      let wA = `${D.plugin.name}@${D.marketplace}`,
        _A = He(zA);
      switch (ZA) {
        case "enable": {
          if (!t3A(zA)) break;
          if (!tC(wA)) {
            let DA = await NF(wA);
            if (DA) {
              let {
                entry: CA,
                marketplaceInstallLocation: FA
              } = DA, xA = Tb(CA.source) ? A8A.join(FA, CA.source) : void 0;
              await dO(wA, CA, zA, _A, xA)
            }
          }
          let BA = await e3A(wA, zA);
          if (!BA.success) throw Error(BA.message);
          break
        }
        case "disable": {
          if (!t3A(zA)) break;
          let BA = await MgA(wA, zA);
          if (!BA.success) throw Error(BA.message);
          break
        }
        case "uninstall": {
          if (!t3A(zA)) break;
          let BA = await sE1(wA, zA);
          if (!BA.success) throw Error(BA.message);
          break
        }
        case "update": {
          let BA = await czA(wA, zA);
          if (!BA.success) throw Error(BA.message);
          if (BA.alreadyUpToDate) {
            if (Q(`${D.plugin.name} is already at the latest version (${BA.newVersion}).`), B) await B();
            A({
              type: "menu"
            });
            return
          }
          break
        }
      }
      NY();
      let t = `✓ ${ZA==="enable"?"Enabled":ZA==="disable"?"Disabled":ZA==="update"?"Updated":"Uninstalled"} ${D.plugin.name}. Restart Claude Code to apply changes.`;
      if (Q(t), B) await B();
      A({
        type: "menu"
      })
    } catch (wA) {
      y(!1);
      let _A = wA instanceof Error ? wA.message : String(wA);
      GA(`Failed to ${ZA}: ${_A}`), e(wA instanceof Error ? wA : Error(`Failed to ${ZA} plugin: ${String(wA)}`))
    }
  };
  if (J0((ZA, zA) => {
      if (zA.escape) {
        if (X === "plugin-details") I("plugin-list"), W(null), GA(null);
        else if (X === "configuring") I("plugin-details"), MA(null);
        else if (typeof X === "object" && X.type === "mcp-detail") I("plugin-list"), GA(null);
        else if (typeof X === "object" && X.type === "mcp-tools") I({
          type: "mcp-detail",
          client: X.client
        });
        else if (typeof X === "object" && X.type === "mcp-tool-detail") I({
          type: "mcp-tools",
          client: X.client
        });
        else A({
          type: "menu"
        });
        return
      }
      if (X === "plugin-list") {
        if ((zA.upArrow || ZA === "k" || zA.ctrl && ZA === "p") && b > 0) u.handleSelectionChange(b - 1, S);
        else if ((zA.downArrow || ZA === "j" || zA.ctrl && ZA === "n") && b < x.length - 1) u.handleSelectionChange(b + 1, S);
        else if (zA.return && b < x.length) {
          let wA = x[b];
          if (wA?.type === "plugin") {
            let _A = F.find((s) => s.plugin.name === wA.plugin.name && s.marketplace === wA.marketplace);
            if (_A) W(_A), I("plugin-details"), AA(0), GA(null)
          } else if (wA?.type === "mcp") I({
            type: "mcp-detail",
            client: wA.client
          }), GA(null)
        } else if (ZA === " " && b < x.length) {
          let wA = x[b];
          if (wA?.type === "plugin") {
            let _A = `${wA.plugin.name}@${wA.marketplace}`,
              s = jQ(),
              t = L.get(_A),
              BA = s?.enabledPlugins?.[_A] !== !1,
              DA = wA.scope || "user";
            if (t3A(DA)) {
              let CA = new Map(L);
              if (t) CA.delete(_A);
              else CA.set(_A, BA ? "will-disable" : "will-enable"), (async () => {
                try {
                  if (BA) await MgA(_A, DA);
                  else await e3A(_A, DA);
                  NY(), O(!0)
                } catch (FA) {
                  e(FA instanceof Error ? FA : Error(String(FA)))
                }
              })();
              M(CA)
            }
          } else if (wA?.type === "mcp") _(wA.client.name)
        }
      } else if (X === "plugin-details" && D) {
        let wA = jQ(),
          _A = `${D.plugin.name}@${D.marketplace}`,
          s = wA?.enabledPlugins?.[_A] !== !1,
          t = [];
        if (t.push({
            label: s ? "Disable plugin" : "Enable plugin",
            action: () => void IA(s ? "disable" : "enable")
          }), t.push({
            label: D.pendingUpdate ? "Unmark for update" : "Mark for update",
            action: async () => {
              try {
                let BA = await a99(D.plugin.name, D.marketplace);
                if (BA) {
                  GA(BA);
                  return
                }
                let DA = [...F],
                  CA = DA.findIndex((FA) => FA.plugin.name === D.plugin.name && FA.marketplace === D.marketplace);
                if (CA !== -1) DA[CA].pendingUpdate = !D.pendingUpdate, H(DA), W({
                  ...D,
                  pendingUpdate: !D.pendingUpdate
                })
              } catch (BA) {
                GA(BA instanceof Error ? BA.message : "Failed to check plugin update availability")
              }
            }
          }), jA) t.push({
          label: "Configure",
          action: async () => {
            bA(!0);
            try {
              let BA = D.plugin.manifest.mcpServers,
                DA = null;
              if (typeof BA === "string" && Hj(BA)) DA = BA;
              else if (Array.isArray(BA)) {
                for (let xA of BA)
                  if (typeof xA === "string" && Hj(xA)) {
                    DA = xA;
                    break
                  }
              }
              if (!DA) {
                GA("No MCPB file found in plugin"), bA(!1);
                return
              }
              let CA = `${D.plugin.name}@${D.marketplace}`,
                FA = await lfA(DA, D.plugin.path, CA, void 0, void 0, !0);
              if ("status" in FA && FA.status === "needs-config") MA(FA), I("configuring");
              else GA("Failed to load MCPB for configuration")
            } catch (BA) {
              let DA = BA instanceof Error ? BA.message : String(BA);
              GA(`Failed to load configuration: ${DA}`)
            } finally {
              bA(!1)
            }
          }
        });
        if (t.push({
            label: "Update now",
            action: () => void IA("update")
          }), t.push({
            label: "Uninstall",
            action: () => void IA("uninstall")
          }), D.plugin.manifest.homepage) t.push({
          label: "Open homepage",
          action: () => void i7(D.plugin.manifest.homepage)
        });
        if (D.plugin.manifest.repository) t.push({
          label: "View on GitHub",
          action: () => void i7(D.plugin.manifest.repository)
        });
        if (t.push({
            label: "Back to plugin list",
            action: () => {
              I("plugin-list"), W(null), GA(null)
            }
          }), (zA.upArrow || ZA === "k" || zA.ctrl && ZA === "p") && f > 0) AA(f - 1);
        else if ((zA.downArrow || ZA === "j" || zA.ctrl && ZA === "n") && f < t.length - 1) AA(f + 1);
        else if (zA.return && t[f]) t[f].action()
      }
    }), E) return U0.createElement(C, null, "Loading installed plugins…");
  if (x.length === 0) return U0.createElement(T, {
    flexDirection: "column"
  }, U0.createElement(T, {
    marginBottom: 1
  }, U0.createElement(C, {
    bold: !0
  }, "Manage plugins")), U0.createElement(C, null, "No plugins or MCP servers installed."), U0.createElement(T, {
    marginTop: 1
  }, U0.createElement(C, {
    dimColor: !0
  }, "Esc to go back")));
  if (X === "configuring" && WA && D) {
    let wA = function () {
        MA(null), I("plugin-details")
      },
      ZA = `${D.plugin.name}@${D.marketplace}`;
    async function zA(_A) {
      if (!WA || !D) return;
      try {
        let s = D.plugin.manifest.mcpServers,
          t = null;
        if (typeof s === "string" && Hj(s)) t = s;
        else if (Array.isArray(s)) {
          for (let BA of s)
            if (typeof BA === "string" && Hj(BA)) {
              t = BA;
              break
            }
        }
        if (!t) {
          GA("No MCPB file found"), I("plugin-details");
          return
        }
        await lfA(t, D.plugin.path, ZA, void 0, _A), GA(null), MA(null), I("plugin-details"), Q("Configuration saved. Restart Claude Code for changes to take effect.")
      } catch (s) {
        let t = s instanceof Error ? s.message : String(s);
        GA(`Failed to save configuration: ${t}`), I("plugin-details")
      }
    }
    return U0.createElement(g99, {
      pluginName: D.plugin.name,
      serverName: WA.manifest.name,
      configSchema: WA.configSchema,
      onSave: zA,
      onCancel: wA
    })
  }
  if (X === "plugin-details" && D) {
    let ZA = jQ(),
      zA = `${D.plugin.name}@${D.marketplace}`,
      wA = ZA?.enabledPlugins?.[zA] !== !1,
      _A = [];
    if (_A.push({
        label: wA ? "Disable plugin" : "Enable plugin",
        action: () => void IA(wA ? "disable" : "enable")
      }), _A.push({
        label: D.pendingUpdate ? "Unmark for update" : "Mark for update",
        action: async () => {
          try {
            let BA = await a99(D.plugin.name, D.marketplace);
            if (BA) {
              GA(BA);
              return
            }
            let DA = [...F],
              CA = DA.findIndex((FA) => FA.plugin.name === D.plugin.name && FA.marketplace === D.marketplace);
            if (CA !== -1) DA[CA].pendingUpdate = !D.pendingUpdate, H(DA), W({
              ...D,
              pendingUpdate: !D.pendingUpdate
            })
          } catch (BA) {
            GA(BA instanceof Error ? BA.message : "Failed to check plugin update availability")
          }
        }
      }), jA) _A.push({
      label: "Configure",
      action: () => {}
    });
    if (_A.push({
        label: "Update now",
        action: () => void IA("update")
      }), _A.push({
        label: "Uninstall",
        action: () => void IA("uninstall")
      }), D.plugin.manifest.homepage) _A.push({
      label: "Open homepage",
      action: () => void i7(D.plugin.manifest.homepage)
    });
    if (D.plugin.manifest.repository) _A.push({
      label: "View on GitHub",
      action: () => void i7(D.plugin.manifest.repository)
    });
    _A.push({
      label: "Back to plugin list",
      action: () => {
        I("plugin-list"), W(null), GA(null)
      }
    });
    let s = J.plugins.errors.filter((BA) => ("plugin" in BA) && BA.plugin === D.plugin.name || BA.source === zA || BA.source.startsWith(`${D.plugin.name}@`)),
      t = s.length === 0 ? null : U0.createElement(T, {
        flexDirection: "column",
        marginBottom: 1
      }, U0.createElement(C, {
        bold: !0,
        color: "error"
      }, s.length, " error", s.length !== 1 ? "s" : "", ":"), s.map((BA, DA) => {
        let CA = l99(BA);
        return U0.createElement(T, {
          key: DA,
          flexDirection: "column",
          marginLeft: 2
        }, U0.createElement(C, {
          color: "error"
        }, p99(BA)), CA && U0.createElement(C, {
          dimColor: !0,
          italic: !0
        }, tA.arrowRight, " ", CA))
      }));
    return U0.createElement(T, {
      flexDirection: "column"
    }, U0.createElement(T, null, U0.createElement(C, {
      bold: !0
    }, D.plugin.name, " @ ", D.marketplace)), U0.createElement(T, null, U0.createElement(C, {
      dimColor: !0
    }, "Scope: "), U0.createElement(C, null, D.scope || "user")), D.plugin.manifest.version && U0.createElement(T, null, U0.createElement(C, {
      dimColor: !0
    }, "Version: "), U0.createElement(C, null, D.plugin.manifest.version)), D.plugin.manifest.description && U0.createElement(T, {
      marginBottom: 1
    }, U0.createElement(C, null, D.plugin.manifest.description)), D.plugin.manifest.author && U0.createElement(T, null, U0.createElement(C, {
      dimColor: !0
    }, "Author: "), U0.createElement(C, null, D.plugin.manifest.author.name)), U0.createElement(T, {
      marginBottom: 1
    }, U0.createElement(C, {
      dimColor: !0
    }, "Status: "), U0.createElement(C, {
      color: wA ? "success" : "warning"
    }, wA ? "Enabled" : "Disabled"), D.pendingUpdate && U0.createElement(C, {
      color: "suggestion"
    }, " · Marked for update")), U0.createElement(OX7, {
      plugin: D.plugin,
      marketplace: D.marketplace
    }), t, U0.createElement(T, {
      marginTop: 1,
      flexDirection: "column"
    }, _A.map((BA, DA) => {
      let CA = DA === f;
      return U0.createElement(T, {
        key: DA
      }, CA && U0.createElement(C, null, tA.pointer, " "), !CA && U0.createElement(C, null, "  "), U0.createElement(C, {
        bold: CA,
        color: BA.label.includes("Uninstall") ? "error" : BA.label.includes("Update") ? "suggestion" : void 0
      }, BA.label))
    })), n && U0.createElement(T, {
      marginTop: 1
    }, U0.createElement(C, null, "Processing…")), p && U0.createElement(T, {
      marginTop: 1
    }, U0.createElement(C, {
      color: "error"
    }, p)), U0.createElement(T, {
      marginTop: 1
    }, U0.createElement(C, {
      dimColor: !0,
      italic: !0
    }, U0.createElement(vQ, null, U0.createElement(F0, {
      shortcut: "↑↓",
      action: "navigate"
    }), U0.createElement(F0, {
      shortcut: "Enter",
      action: "select"
    }), U0.createElement(hQ, {
      action: "confirm:no",
      context: "Confirmation",
      fallback: "Esc",
      description: "back"
    })))))
  }
  if (typeof X === "object" && X.type === "mcp-detail") {
    let ZA = X.client,
      zA = o3A(J.mcp.tools, ZA.name).length,
      wA = () => {
        I({
          type: "mcp-tools",
          client: ZA
        })
      },
      _A = () => {
        I("plugin-list")
      },
      s = (DA) => {
        if (DA) Q(DA);
        I("plugin-list")
      },
      t = ZA.config.scope,
      BA = ZA.config.type;
    if (BA === "stdio") {
      let DA = {
        name: ZA.name,
        client: ZA,
        scope: t,
        transport: "stdio",
        config: ZA.config
      };
      return U0.createElement(UgA, {
        server: DA,
        serverToolsCount: zA,
        onViewTools: wA,
        onCancel: _A,
        onComplete: s,
        borderless: !0
      })
    } else if (BA === "sse") {
      let DA = {
        name: ZA.name,
        client: ZA,
        scope: t,
        transport: "sse",
        isAuthenticated: void 0,
        config: ZA.config
      };
      return U0.createElement(a3A, {
        server: DA,
        serverToolsCount: zA,
        onViewTools: wA,
        onCancel: _A,
        onComplete: s,
        borderless: !0
      })
    } else if (BA === "http") {
      let DA = {
        name: ZA.name,
        client: ZA,
        scope: t,
        transport: "http",
        isAuthenticated: void 0,
        config: ZA.config
      };
      return U0.createElement(a3A, {
        server: DA,
        serverToolsCount: zA,
        onViewTools: wA,
        onCancel: _A,
        onComplete: s,
        borderless: !0
      })
    } else if (BA === "claudeai-proxy") {
      let DA = {
        name: ZA.name,
        client: ZA,
        scope: t,
        transport: "claudeai-proxy",
        isAuthenticated: void 0,
        config: ZA.config
      };
      return U0.createElement(a3A, {
        server: DA,
        serverToolsCount: zA,
        onViewTools: wA,
        onCancel: _A,
        onComplete: s,
        borderless: !0
      })
    }
    return I("plugin-list"), null
  }
  if (typeof X === "object" && X.type === "mcp-tools") {
    let ZA = X.client,
      zA = ZA.config.scope,
      wA = ZA.config.type,
      _A;
    if (wA === "stdio") _A = {
      name: ZA.name,
      client: ZA,
      scope: zA,
      transport: "stdio",
      config: ZA.config
    };
    else if (wA === "sse") _A = {
      name: ZA.name,
      client: ZA,
      scope: zA,
      transport: "sse",
      isAuthenticated: void 0,
      config: ZA.config
    };
    else if (wA === "http") _A = {
      name: ZA.name,
      client: ZA,
      scope: zA,
      transport: "http",
      isAuthenticated: void 0,
      config: ZA.config
    };
    else _A = {
      name: ZA.name,
      client: ZA,
      scope: zA,
      transport: "claudeai-proxy",
      isAuthenticated: void 0,
      config: ZA.config
    };
    return U0.createElement(qgA, {
      server: _A,
      onSelectTool: (s) => {
        I({
          type: "mcp-tool-detail",
          client: ZA,
          tool: s
        })
      },
      onBack: () => I({
        type: "mcp-detail",
        client: ZA
      })
    })
  }
  if (typeof X === "object" && X.type === "mcp-tool-detail") {
    let {
      client: ZA,
      tool: zA
    } = X, wA = ZA.config.scope, _A = ZA.config.type, s;
    if (_A === "stdio") s = {
      name: ZA.name,
      client: ZA,
      scope: wA,
      transport: "stdio",
      config: ZA.config
    };
    else if (_A === "sse") s = {
      name: ZA.name,
      client: ZA,
      scope: wA,
      transport: "sse",
      isAuthenticated: void 0,
      config: ZA.config
    };
    else if (_A === "http") s = {
      name: ZA.name,
      client: ZA,
      scope: wA,
      transport: "http",
      isAuthenticated: void 0,
      config: ZA.config
    };
    else s = {
      name: ZA.name,
      client: ZA,
      scope: wA,
      transport: "claudeai-proxy",
      isAuthenticated: void 0,
      config: ZA.config
    };
    return U0.createElement(NgA, {
      tool: zA,
      server: s,
      onBack: () => I({
        type: "mcp-tools",
        client: ZA
      })
    })
  }
  let HA = u.getVisibleItems(x);
  return U0.createElement(T, {
    flexDirection: "column"
  }, u.scrollPosition.canScrollUp && U0.createElement(T, null, U0.createElement(C, {
    dimColor: !0
  }, " ", tA.arrowUp, " more above")), HA.map((ZA, zA) => {
    let _A = u.toActualIndex(zA) === b,
      s = zA > 0 ? HA[zA - 1] : null,
      t = !s || s.scope !== ZA.scope,
      BA = (DA) => {
        switch (DA) {
          case "project":
            return "Project";
          case "local":
            return "Local";
          case "user":
            return "User";
          case "enterprise":
            return "Enterprise";
          case "managed":
            return "Managed";
          case "dynamic":
            return "Built-in";
          default:
            return DA
        }
      };
    return U0.createElement(U0.Fragment, {
      key: ZA.id
    }, t && U0.createElement(T, {
      marginTop: zA > 0 ? 1 : 0,
      paddingLeft: 2
    }, U0.createElement(C, {
      dimColor: !0
    }, BA(ZA.scope))), U0.createElement(m99, {
      item: ZA,
      isSelected: _A
    }))
  }), u.scrollPosition.canScrollDown && U0.createElement(T, null, U0.createElement(C, {
    dimColor: !0
  }, " ", tA.arrowDown, " more below")), U0.createElement(T, {
    marginTop: 1,
    marginLeft: 1
  }, U0.createElement(C, {
    dimColor: !0,
    italic: !0
  }, U0.createElement(vQ, null, U0.createElement(F0, {
    shortcut: "Space",
    action: "toggle"
  }), U0.createElement(F0, {
    shortcut: "Enter",
    action: "details"
  }), U0.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "back"
  })))), $ && U0.createElement(T, {
    marginLeft: 1
  }, U0.createElement(C, {
    dimColor: !0,
    italic: !0
  }, "Restart to apply plugin changes")))
}
// @from(Ln 415598, Col 4)
U0
// @from(Ln 415598, Col 8)
dJ
// @from(Ln 415599, Col 4)
r99 = w(() => {
  fA();
  fA();
  B2();
  GK();
  HI();
  pz();
  GB();
  Lx();
  TN();
  v1();
  T1();
  PN();
  cc();
  pzA();
  u99();
  ow0();
  LgA();
  A0();
  hB();
  d99();
  gE1();
  mE1();
  dE1();
  lE1();
  PJ();
  i99();
  Hp();
  K6();
  e9();
  I3();
  U0 = c(QA(), 1), dJ = c(QA(), 1)
})
// @from(Ln 415632, Col 0)
async function s99() {
  let A = jQ(),
    Q = new Map;
  if (A.extraKnownMarketplaces)
    for (let [B, G] of Object.entries(A.extraKnownMarketplaces)) Q.set(B, G);
  return Q
}
// @from(Ln 415639, Col 0)
async function t99(A) {
  try {
    let Q = await D5(),
      B = [];
    for (let [G] of A)
      if (!Q[G]) B.push(G);
    return B
  } catch (Q) {
    return e(Q instanceof Error ? Q : Error(String(Q))), []
  }
}
// @from(Ln 415650, Col 4)
e99 = w(() => {
  GB();
  HI();
  v1();
  A0()
})
// @from(Ln 415659, Col 0)
async function E_0() {
  let A = jQ(),
    Q = [];
  if (A.enabledPlugins) {
    for (let [B, G] of Object.entries(A.enabledPlugins))
      if (B.includes("@") && G) Q.push(B)
  }
  return Q
}
// @from(Ln 415669, Col 0)
function A49() {
  let A = new Map,
    Q = [{
      scope: "managed",
      source: "policySettings"
    }, {
      scope: "user",
      source: "userSettings"
    }, {
      scope: "project",
      source: "projectSettings"
    }, {
      scope: "local",
      source: "localSettings"
    }, {
      scope: "flag",
      source: "flagSettings"
    }];
  for (let {
      scope: B,
      source: G
    }
    of Q) {
    let Z = dB(G);
    if (!Z?.enabledPlugins) continue;
    for (let [Y, J] of Object.entries(Z.enabledPlugins)) {
      if (!Y.includes("@")) continue;
      if (J === !0) A.set(Y, B);
      else if (J === !1) A.delete(Y)
    }
  }
  return k(`Found ${A.size} enabled plugins with scopes: ${Array.from(A.entries()).map(([B,G])=>`${B}(${G})`).join(", ")}`), A
}
// @from(Ln 415702, Col 0)
async function z_0() {
  wI0().catch((B) => {
    e(B instanceof Error ? B : Error(String(B)))
  });
  let A = qI0(),
    Q = Object.keys(A.plugins);
  return k(`Found ${Q.length} installed plugins (V2 format)`), Q
}
// @from(Ln 415710, Col 0)
async function Q49(A) {
  try {
    let Q = await z_0(),
      B = [];
    for (let G of A)
      if (!Q.includes(G)) try {
        if (await NF(G)) B.push(G)
      } catch (Z) {
        k(`Failed to check plugin ${G} in marketplace: ${Z}`)
      }
    return B
  } catch (Q) {
    return e(Q instanceof Error ? Q : Error(String(Q))), []
  }
}
// @from(Ln 415725, Col 0)
async function B49(A, Q, B = "user") {
  let G = B !== "user" ? o1() : void 0,
    Z = Pb(B),
    Y = dB(Z),
    J = {
      ...Y?.enabledPlugins
    },
    X = [],
    I = [];
  for (let D = 0; D < A.length; D++) {
    let W = A[D];
    if (!W) continue;
    if (Q) Q(W, D + 1, A.length);
    try {
      let K = await NF(W);
      if (!K) {
        I.push({
          name: W,
          error: "Plugin not found in any marketplace"
        });
        continue
      }
      let {
        entry: V,
        marketplaceInstallLocation: F
      } = K;
      if (!Tb(V.source)) await dO(W, V, B, G);
      else mo2({
        pluginId: W,
        installPath: MX7(F, V.source),
        version: V.version
      }, B, G);
      J[W] = !0, X.push(W)
    } catch (K) {
      let V = K instanceof Error ? K.message : String(K);
      I.push({
        name: W,
        error: V
      }), e(K instanceof Error ? K : Error(String(K)))
    }
  }
  return pB(Z, {
    ...Y,
    enabledPlugins: J
  }), {
    installed: X,
    failed: I
  }
}
// @from(Ln 415774, Col 4)
$_0 = w(() => {
  GB();
  HI();
  v1();
  T1();
  GK();
  GB();
  DQ();
  pz();
  cc();
  z4A();
  V2();
  PN()
})
// @from(Ln 415792, Col 0)
function C_0(A, Q, B, G) {
  A((Z) => ({
    ...Z,
    plugins: {
      ...Z.plugins,
      installationStatus: {
        ...Z.plugins.installationStatus,
        marketplaces: Z.plugins.installationStatus.marketplaces.map((Y) => Y.name === Q ? {
          ...Y,
          status: B,
          error: G
        } : Y)
      }
    }
  }))
}
// @from(Ln 415809, Col 0)
function U_0(A, Q, B, G) {
  A((Z) => ({
    ...Z,
    plugins: {
      ...Z.plugins,
      installationStatus: {
        ...Z.plugins.installationStatus,
        plugins: Z.plugins.installationStatus.plugins.map((Y) => Y.id === Q ? {
          ...Y,
          status: B,
          error: G
        } : Y)
      }
    }
  }))
}
// @from(Ln 415825, Col 0)
async function _X7(A, Q, B) {
  let G = [],
    Z = [];
  for (let Y of A) {
    let J = Q.get(Y);
    if (!J) continue;
    C_0(B, Y, "installing");
    try {
      await NS(J.source), G.push(Y), C_0(B, Y, "installed"), RZ1(), Bt(), await jX7(Y, B)
    } catch (X) {
      let I = X instanceof Error ? X.message : String(X);
      Z.push({
        name: Y,
        error: I
      }), C_0(B, Y, "failed", I), e(X instanceof Error ? X : Error(String(X)))
    }
  }
  return {
    installed: G,
    failed: Z
  }
}
// @from(Ln 415847, Col 0)
async function jX7(A, Q) {
  try {
    let G = (await E_0()).filter((Z) => Z.endsWith(`@${A}`));
    if (G.length > 0) {
      let Z = await Q49(G);
      if (Z.length > 0) k(`Installing ${Z.length} plugins from newly installed marketplace ${A}`), await G49(Z, Q)
    }
  } catch (B) {
    e(B instanceof Error ? B : Error(String(B)))
  }
}
// @from(Ln 415858, Col 0)
async function G49(A, Q) {
  let B = [],
    G = [],
    Z = A49(),
    Y = new Map;
  for (let J of A) {
    U_0(Q, J, "installing");
    try {
      let X = await NF(J);
      if (!X) throw Error("Plugin not found in any marketplace");
      let I = Z.get(J),
        {
          entry: D,
          marketplaceInstallLocation: W
        } = X,
        K = Tb(D.source) ? RX7(W, D.source) : void 0;
      if (I === "flag") {
        let V = K ?? D.source;
        await $3A(V, {
          manifest: D
        })
      } else {
        let V = I || "user",
          F = He(V);
        if (await dO(J, D, V, F, K), V !== "managed") {
          if (jQ().enabledPlugins?.[J] !== !0) {
            let z = Y.get(V) ?? {};
            z[J] = !0, Y.set(V, z)
          }
        }
      }
      B.push(J), U_0(Q, J, "installed")
    } catch (X) {
      let I = X instanceof Error ? X.message : String(X);
      G.push({
        name: J,
        error: I
      }), U_0(Q, J, "failed", I), e(X instanceof Error ? X : Error(String(X)))
    }
  }
  for (let [J, X] of Y)
    if (Object.keys(X).length > 0) {
      let I = Pb(J),
        D = dB(I);
      pB(I, {
        ...D,
        enabledPlugins: {
          ...D?.enabledPlugins,
          ...X
        }
      })
    } return {
    installed: B,
    failed: G
  }
}
// @from(Ln 415914, Col 0)
async function eE1(A) {
  k("performBackgroundPluginInstallations called");
  try {
    let Q = [],
      B = [],
      G = await D5(),
      Z = await s99();
    if (Z.size > 0) {
      k(`Found ${Z.size} extra marketplaces in settings`);
      let X = await t99(Z);
      if (X.length > 0) {
        k(`Installing ${X.length} marketplaces automatically`);
        for (let I of X) {
          let D = Z.get(I);
          if (D) Q.push({
            name: I,
            marketplace: D
          })
        }
      }
    }
    let Y = await E_0(),
      J = [];
    if (Y.length > 0) {
      k(`Found ${Y.length} enabled plugins`);
      let X = await z_0(),
        I = Y.filter((W) => !X.includes(W));
      k(`Found ${I.length} missing plugins (not installed): ${I.join(", ")}`);
      let D = [];
      for (let W of I) {
        let [, K] = W.split("@");
        if (!K) D.push(W);
        else if (K in G || Z.has(K) || Q.some((V) => V.name === K)) D.push(W);
        else J.push(W)
      }
      if (J.length > 0) {
        let W = [...new Set(J.map((K) => K.split("@")[1]))];
        k(`Cannot install ${J.length} plugins because their marketplaces are not installed or configured: ${W.join(", ")}`), k(`Uninstallable plugins: ${J.join(", ")}`)
      }
      if (D.length > 0) k(`Installing ${D.length} plugins automatically`), B.push(...D)
    }
    if (k(`Setting installation status: ${Q.length} marketplaces, ${B.length} installable plugins, ${J.length} uninstallable plugins`), A((X) => ({
        ...X,
        plugins: {
          ...X.plugins,
          installationStatus: {
            marketplaces: Q.map(({
              name: I
            }) => ({
              name: I,
              status: "pending"
            })),
            plugins: [...B.map((I) => {
              let [D] = I.split("@");
              return {
                id: I,
                name: D || I,
                status: "pending"
              }
            }), ...J.map((I) => {
              let [D, W] = I.split("@");
              return {
                id: I,
                name: D || I,
                status: "failed",
                error: `Marketplace '${W}' is not installed or configured`
              }
            })]
          }
        }
      })), Q.length > 0) _X7(Q.map((X) => X.name), Z, A).catch((X) => {
      e(X instanceof Error ? X : Error(String(X)))
    });
    if (B.length > 0) {
      let X = B.filter((I) => {
        let [, D] = I.split("@");
        return !Q.some((W) => W.name === D)
      });
      if (X.length > 0) G49(X, A).catch((I) => {
        e(I instanceof Error ? I : Error(String(I)))
      })
    }
  } catch (Q) {
    e(Q instanceof Error ? Q : Error(String(Q)))
  }
}
// @from(Ln 416000, Col 4)
q_0 = w(() => {
  T1();
  v1();
  e99();
  $_0();
  z4A();
  pzA();
  HI();
  HI();
  GK();
  cc();
  pz();
  GB()
})
// @from(Ln 416015, Col 0)
function TX7(A) {
  switch (A.type) {
    case "path-not-found":
      return `${A.component} path not found: ${A.path}`;
    case "git-auth-failed":
      return `Git ${A.authType.toUpperCase()} authentication failed for ${A.gitUrl}`;
    case "git-timeout":
      return `Git ${A.operation} timed out for ${A.gitUrl}`;
    case "network-error":
      return `Network error accessing ${A.url}${A.details?`: ${A.details}`:""}`;
    case "manifest-parse-error":
      return `Failed to parse manifest at ${A.manifestPath}: ${A.parseError}`;
    case "manifest-validation-error":
      return `Invalid manifest at ${A.manifestPath}: ${A.validationErrors.join(", ")}`;
    case "plugin-not-found":
      return `Plugin '${A.pluginId}' not found in marketplace '${A.marketplace}'`;
    case "marketplace-not-found":
      return `Marketplace '${A.marketplace}' not found`;
    case "marketplace-load-failed":
      return `Failed to load marketplace '${A.marketplace}': ${A.reason}`;
    case "repository-scan-failed":
      return `Failed to scan repository at ${A.repositoryPath}: ${A.reason}`;
    case "mcp-config-invalid":
      return `Invalid MCP server config for '${A.serverName}': ${A.validationError}`;
    case "hook-load-failed":
      return `Failed to load hooks from ${A.hookPath}: ${A.reason}`;
    case "component-load-failed":
      return `Failed to load ${A.component} from ${A.path}: ${A.reason}`;
    case "mcpb-download-failed":
      return `Failed to download MCPB from ${A.url}: ${A.reason}`;
    case "mcpb-extract-failed":
      return `Failed to extract MCPB ${A.mcpbPath}: ${A.reason}`;
    case "mcpb-invalid-manifest":
      return `MCPB manifest invalid at ${A.mcpbPath}: ${A.validationError}`;
    case "marketplace-blocked-by-policy":
      return A.blockedByBlocklist ? `Marketplace '${A.marketplace}' is blocked by enterprise policy` : `Marketplace '${A.marketplace}' is not in the allowed marketplace list`;
    case "generic-error":
      return A.error;
    default:
      return "Unknown error"
  }
}
// @from(Ln 416058, Col 0)
function Z49(A) {
  switch (A.type) {
    case "path-not-found":
      return "→ Check that the path in your manifest or marketplace config is correct";
    case "git-auth-failed":
      return A.authType === "ssh" ? "→ Configure SSH keys or use HTTPS URL instead" : "→ Configure credentials or use SSH URL instead";
    case "git-timeout":
    case "network-error":
      return "→ Check your internet connection and try again";
    case "manifest-parse-error":
      return "→ Check manifest file syntax in the plugin directory";
    case "manifest-validation-error":
      return "→ Check manifest file follows the required schema";
    case "plugin-not-found":
      return `→ Plugin may not exist in marketplace '${A.marketplace}'`;
    case "marketplace-not-found":
      return A.availableMarketplaces.length > 0 ? `→ Available marketplaces: ${A.availableMarketplaces.join(", ")}` : "→ Add the marketplace first using /plugin marketplace add";
    case "mcp-config-invalid":
      return "→ Check MCP server configuration in .mcp.json or manifest";
    case "hook-load-failed":
      return "→ Check hooks.json file syntax and structure";
    case "component-load-failed":
      return `→ Check ${A.component} directory structure and file permissions`;
    case "mcpb-download-failed":
      return "→ Check your internet connection and URL accessibility";
    case "mcpb-extract-failed":
      return "→ Verify the MCPB file is valid and not corrupted";
    case "mcpb-invalid-manifest":
      return "→ Contact the plugin author about the invalid manifest";
    case "marketplace-blocked-by-policy":
      if (A.blockedByBlocklist) return "→ This marketplace source is explicitly blocked by your administrator";
      return A.allowedSources.length > 0 ? `→ Allowed sources: ${A.allowedSources.join(", ")}` : "→ Contact your administrator to configure allowed marketplace sources";
    case "repository-scan-failed":
    case "marketplace-load-failed":
    case "generic-error":
      return null;
    default:
      return null
  }
}
// @from(Ln 416099, Col 0)
function J49({
  onComplete: A
}) {
  let [Q, B] = a0(), {
    installationStatus: G,
    errors: Z
  } = Q.plugins;
  MQ();
  let Y = Y49.useCallback(() => {
    B((K) => ({
      ...K,
      plugins: {
        ...K.plugins,
        installationStatus: {
          marketplaces: K.plugins.installationStatus.marketplaces.map((V) => V.status === "failed" ? {
            ...V,
            status: "pending"
          } : V),
          plugins: K.plugins.installationStatus.plugins.map((V) => V.status === "failed" ? {
            ...V,
            status: "pending"
          } : V)
        }
      }
    })), eE1(B)
  }, [B]);
  J0((K, V) => {
    if (V.escape) A();
    else if (K === "r" || K === "R") Y()
  });
  let J = {
      pending: G.marketplaces.filter((K) => K.status === "pending").length,
      installing: G.marketplaces.filter((K) => K.status === "installing").length,
      installed: G.marketplaces.filter((K) => K.status === "installed").length,
      failed: G.marketplaces.filter((K) => K.status === "failed").length
    },
    X = {
      pending: G.plugins.filter((K) => K.status === "pending").length,
      installing: G.plugins.filter((K) => K.status === "installing").length,
      installed: G.plugins.filter((K) => K.status === "installed").length,
      failed: G.plugins.filter((K) => K.status === "failed").length
    },
    I = J.installing > 0 || X.installing > 0 || J.pending > 0 || X.pending > 0,
    D = Z.length > 0,
    W = G.marketplaces.length > 0 || G.plugins.length > 0;
  return v0.createElement(T, {
    flexDirection: "column"
  }, v0.createElement(T, {
    marginBottom: 1
  }, v0.createElement(C, {
    bold: !0
  }, D && !W ? "Plugin Loading Errors" : "Plugin Status")), G.marketplaces.length > 0 && v0.createElement(v0.Fragment, null, v0.createElement(T, {
    marginBottom: 1
  }, v0.createElement(C, {
    dimColor: !0
  }, "Marketplaces:")), G.marketplaces.map((K) => v0.createElement(T, {
    key: K.name,
    marginLeft: 2
  }, K.status === "installing" && v0.createElement(v0.Fragment, null, v0.createElement(W9, null), v0.createElement(T, {
    marginLeft: 1
  }, v0.createElement(C, null, K.name), v0.createElement(C, {
    dimColor: !0
  }, " · Installing…"))), K.status === "pending" && v0.createElement(C, null, v0.createElement(C, {
    dimColor: !0
  }, tA.circle || "○", " "), K.name, v0.createElement(C, {
    dimColor: !0
  }, " · Pending")), K.status === "installed" && v0.createElement(C, null, v0.createElement(C, {
    color: "success"
  }, tA.tick || "✓", " "), K.name, v0.createElement(C, {
    dimColor: !0
  }, " · Installed")), K.status === "failed" && v0.createElement(T, {
    flexDirection: "column"
  }, v0.createElement(C, null, v0.createElement(C, {
    color: "error"
  }, tA.cross || "✗", " "), K.name, v0.createElement(C, {
    color: "error"
  }, " · Failed")), K.error && v0.createElement(T, {
    marginLeft: 3
  }, v0.createElement(C, {
    color: "error",
    dimColor: !0
  }, K.error)))))), G.plugins.length > 0 && v0.createElement(v0.Fragment, null, v0.createElement(T, {
    marginTop: 1,
    marginBottom: 1
  }, v0.createElement(C, {
    dimColor: !0
  }, "Plugins:")), G.plugins.map((K) => v0.createElement(T, {
    key: K.id,
    marginLeft: 2
  }, K.status === "installing" && v0.createElement(v0.Fragment, null, v0.createElement(W9, null), v0.createElement(T, {
    marginLeft: 1
  }, v0.createElement(C, null, K.name), v0.createElement(C, {
    dimColor: !0
  }, " · Installing…"))), K.status === "pending" && v0.createElement(C, null, v0.createElement(C, {
    dimColor: !0
  }, tA.circle || "○", " "), K.name, v0.createElement(C, {
    dimColor: !0
  }, " · Pending")), K.status === "installed" && v0.createElement(C, null, v0.createElement(C, {
    color: "success"
  }, tA.tick || "✓", " "), K.name, v0.createElement(C, {
    dimColor: !0
  }, " · Installed")), K.status === "failed" && v0.createElement(T, {
    flexDirection: "column"
  }, v0.createElement(C, null, v0.createElement(C, {
    color: "error"
  }, tA.cross || "✗", " "), K.name, v0.createElement(C, {
    color: "error"
  }, " · Failed")), K.error && v0.createElement(T, {
    marginLeft: 3
  }, v0.createElement(C, {
    color: "error",
    dimColor: !0
  }, K.error)))))), G.marketplaces.length === 0 && G.plugins.length === 0 && Z.length === 0 && v0.createElement(T, {
    marginTop: 1
  }, v0.createElement(C, {
    dimColor: !0
  }, "No pending installations or errors")), Z.length > 0 && v0.createElement(v0.Fragment, null, v0.createElement(T, {
    marginTop: 1,
    marginBottom: 1
  }, v0.createElement(C, {
    dimColor: !0
  }, "Plugin Loading Errors:")), Z.map((K, V) => {
    let F = "plugin" in K ? K.plugin : void 0;
    return v0.createElement(T, {
      key: V,
      marginLeft: 2,
      flexDirection: "column"
    }, v0.createElement(C, null, v0.createElement(C, {
      color: "error"
    }, tA.cross || "✗", " "), F ? v0.createElement(v0.Fragment, null, "Plugin ", v0.createElement(C, {
      bold: !0
    }, F), " from", " ", v0.createElement(C, {
      dimColor: !0
    }, K.source)) : v0.createElement(C, {
      dimColor: !0
    }, K.source)), v0.createElement(T, {
      marginLeft: 3
    }, v0.createElement(C, {
      color: "error",
      dimColor: !0
    }, TX7(K))), Z49(K) && v0.createElement(T, {
      marginLeft: 3,
      marginTop: 1
    }, v0.createElement(C, {
      dimColor: !0,
      italic: !0
    }, Z49(K))))
  })), v0.createElement(T, {
    marginTop: 2
  }, v0.createElement(C, {
    dimColor: !0
  }, I ? "Installing…" : v0.createElement(v0.Fragment, null, "Press", " ", J.failed > 0 || X.failed > 0 ? v0.createElement(v0.Fragment, null, v0.createElement(C, {
    bold: !0
  }, "r"), " to retry failed installations ·", " ") : null, v0.createElement(C, {
    bold: !0
  }, "Esc"), " to return"))))
}
// @from(Ln 416256, Col 4)
v0
// @from(Ln 416256, Col 8)
Y49
// @from(Ln 416257, Col 4)
X49 = w(() => {
  fA();
  E9();
  hB();
  q_0();
  yG();
  B2();
  v0 = c(QA(), 1), Y49 = c(QA(), 1)
})
// @from(Ln 416269, Col 0)
function PX7(A) {
  let Q = Mj.basename(A),
    B = Mj.basename(Mj.dirname(A));
  if (Q === "plugin.json") return "plugin";
  if (Q === "marketplace.json") return "marketplace";
  if (B === ".claude-plugin") return "plugin";
  return "unknown"
}
// @from(Ln 416278, Col 0)
function I49(A) {
  return A.issues.map((Q) => ({
    path: Q.path.join(".") || "root",
    message: Q.message,
    code: Q.code
  }))
}
// @from(Ln 416286, Col 0)
function RgA(A, Q, B) {
  if (A.includes("..")) B.push({
    path: Q,
    message: `Path contains ".." which could be a path traversal attempt: ${A}`
  })
}
// @from(Ln 416293, Col 0)
function N_0(A) {
  let Q = [],
    B = [],
    G = Mj.resolve(A);
  if (!TU.existsSync(G)) return {
    success: !1,
    errors: [{
      path: "file",
      message: `File not found: ${G}`
    }],
    warnings: [],
    filePath: G,
    fileType: "plugin"
  };
  if (!TU.statSync(G).isFile()) return {
    success: !1,
    errors: [{
      path: "file",
      message: `Path is not a file: ${G}`
    }],
    warnings: [],
    filePath: G,
    fileType: "plugin"
  };
  let Y;
  try {
    Y = TU.readFileSync(G, {
      encoding: "utf-8"
    })
  } catch (I) {
    return {
      success: !1,
      errors: [{
        path: "file",
        message: `Failed to read file: ${I instanceof Error?I.message:String(I)}`
      }],
      warnings: [],
      filePath: G,
      fileType: "plugin"
    }
  }
  let J;
  try {
    J = AQ(Y)
  } catch (I) {
    return {
      success: !1,
      errors: [{
        path: "json",
        message: `Invalid JSON syntax: ${I instanceof Error?I.message:String(I)}`
      }],
      warnings: [],
      filePath: G,
      fileType: "plugin"
    }
  }
  if (J && typeof J === "object") {
    let I = J;
    if (I.commands)(Array.isArray(I.commands) ? I.commands : [I.commands]).forEach((W, K) => {
      if (typeof W === "string") RgA(W, `commands[${K}]`, Q)
    });
    if (I.agents)(Array.isArray(I.agents) ? I.agents : [I.agents]).forEach((W, K) => {
      if (typeof W === "string") RgA(W, `agents[${K}]`, Q)
    });
    if (I.skills)(Array.isArray(I.skills) ? I.skills : [I.skills]).forEach((W, K) => {
      if (typeof W === "string") RgA(W, `skills[${K}]`, Q)
    })
  }
  let X = V4A.safeParse(J);
  if (!X.success) Q.push(...I49(X.error));
  if (X.success) {
    let I = X.data;
    if (!I.version) B.push({
      path: "version",
      message: 'No version specified. Consider adding a version following semver (e.g., "1.0.0")'
    });
    if (!I.description) B.push({
      path: "description",
      message: "No description provided. Adding a description helps users understand what your plugin does"
    });
    if (!I.author) B.push({
      path: "author",
      message: "No author information provided. Consider adding author details for plugin attribution"
    })
  }
  return {
    success: Q.length === 0,
    errors: Q,
    warnings: B,
    filePath: G,
    fileType: "plugin"
  }
}
// @from(Ln 416387, Col 0)
function w_0(A) {
  let Q = [],
    B = [],
    G = Mj.resolve(A);
  if (!TU.existsSync(G)) return {
    success: !1,
    errors: [{
      path: "file",
      message: `File not found: ${G}`
    }],
    warnings: [],
    filePath: G,
    fileType: "marketplace"
  };
  if (!TU.statSync(G).isFile()) return {
    success: !1,
    errors: [{
      path: "file",
      message: `Path is not a file: ${G}`
    }],
    warnings: [],
    filePath: G,
    fileType: "marketplace"
  };
  let Y;
  try {
    Y = TU.readFileSync(G, {
      encoding: "utf-8"
    })
  } catch (I) {
    return {
      success: !1,
      errors: [{
        path: "file",
        message: `Failed to read file: ${I instanceof Error?I.message:String(I)}`
      }],
      warnings: [],
      filePath: G,
      fileType: "marketplace"
    }
  }
  let J;
  try {
    J = AQ(Y)
  } catch (I) {
    return {
      success: !1,
      errors: [{
        path: "json",
        message: `Invalid JSON syntax: ${I instanceof Error?I.message:String(I)}`
      }],
      warnings: [],
      filePath: G,
      fileType: "marketplace"
    }
  }
  if (J && typeof J === "object") {
    let I = J;
    if (Array.isArray(I.plugins)) I.plugins.forEach((D, W) => {
      if (D && typeof D === "object" && "source" in D) {
        let K = D.source;
        if (typeof K === "string") RgA(K, `plugins[${W}].source`, Q);
        if (K && typeof K === "object" && "path" in K && typeof K.path === "string") RgA(K.path, `plugins[${W}].source.path`, Q)
      }
    })
  }
  let X = JVA.safeParse(J);
  if (!X.success) Q.push(...I49(X.error));
  if (X.success) {
    let I = X.data;
    if (!I.plugins || I.plugins.length === 0) B.push({
      path: "plugins",
      message: "Marketplace has no plugins defined"
    });
    if (I.plugins) I.plugins.forEach((D, W) => {
      if (typeof D.source === "object" && D.source.source === "npm") B.push({
        path: `plugins[${W}].source`,
        message: `Plugin "${D.name}" uses npm source which is not yet fully implemented`
      });
      if (I.plugins.filter((V) => V.name === D.name).length > 1) Q.push({
        path: `plugins[${W}].name`,
        message: `Duplicate plugin name "${D.name}" found in marketplace`
      })
    });
    if (!I.metadata?.description) B.push({
      path: "metadata.description",
      message: "No marketplace description provided. Adding a description helps users understand what this marketplace offers"
    })
  }
  return {
    success: Q.length === 0,
    errors: Q,
    warnings: B,
    filePath: G,
    fileType: "marketplace"
  }
}
// @from(Ln 416485, Col 0)
function Az1(A) {
  let Q = Mj.resolve(A);
  if (TU.existsSync(Q) && TU.statSync(Q).isDirectory()) {
    let G = Mj.join(Q, ".claude-plugin", "marketplace.json"),
      Z = Mj.join(Q, ".claude-plugin", "plugin.json");
    if (TU.existsSync(G)) return w_0(G);
    else if (TU.existsSync(Z)) return N_0(Z);
    else return {
      success: !1,
      errors: [{
        path: "directory",
        message: "No manifest found in directory. Expected .claude-plugin/marketplace.json or .claude-plugin/plugin.json"
      }],
      warnings: [],
      filePath: Q,
      fileType: "plugin"
    }
  }
  switch (PX7(A)) {
    case "plugin":
      return N_0(A);
    case "marketplace":
      return w_0(A);
    case "unknown": {
      if (!TU.existsSync(Q)) return {
        success: !1,
        errors: [{
          path: "file",
          message: `File not found: ${Q}`
        }],
        warnings: [],
        filePath: Q,
        fileType: "plugin"
      };
      try {
        let G = TU.readFileSync(Q, {
            encoding: "utf-8"
          }),
          Z = AQ(G);
        if (Array.isArray(Z.plugins)) return w_0(A)
      } catch {}
      return N_0(A)
    }
  }
}
// @from(Ln 416530, Col 4)
L_0 = w(() => {
  pz();
  A0()
})
// @from(Ln 416535, Col 0)
function W49({
  onComplete: A,
  path: Q
}) {
  return D49.useEffect(() => {
    async function B() {
      if (!Q) {
        A(`Usage: /plugin validate <path>

Validate a plugin or marketplace manifest file or directory.

Examples:
  /plugin validate .claude-plugin/plugin.json
  /plugin validate /path/to/plugin-directory
  /plugin validate .

When given a directory, automatically validates .claude-plugin/marketplace.json
or .claude-plugin/plugin.json (prefers marketplace if both exist).

Or from the command line:
  claude plugin validate <path>`);
        return
      }
      try {
        let G = Az1(Q),
          Z = "";
        if (Z += `Validating ${G.fileType} manifest: ${G.filePath}

`, G.errors.length > 0) Z += `${tA.cross} Found ${G.errors.length} error${G.errors.length===1?"":"s"}:

`, G.errors.forEach((Y) => {
          Z += `  ${tA.pointer} ${Y.path}: ${Y.message}
`
        }), Z += `
`;
        if (G.warnings.length > 0) Z += `${tA.warning} Found ${G.warnings.length} warning${G.warnings.length===1?"":"s"}:

`, G.warnings.forEach((Y) => {
          Z += `  ${tA.pointer} ${Y.path}: ${Y.message}
`
        }), Z += `
`;
        if (G.success) {
          if (G.warnings.length > 0) Z += `${tA.tick} Validation passed with warnings
`;
          else Z += `${tA.tick} Validation passed
`;
          process.exitCode = 0
        } else Z += `${tA.cross} Validation failed
`, process.exitCode = 1;
        A(Z)
      } catch (G) {
        process.exitCode = 2, e(G instanceof Error ? G : Error(String(G))), A(`${tA.cross} Unexpected error during validation: ${G instanceof Error?G.message:String(G)}`)
      }
    }
    B()
  }, [A, Q]), _gA.createElement(T, {
    flexDirection: "column"
  }, _gA.createElement(C, null, "Running validation..."))
}
// @from(Ln 416595, Col 4)
_gA
// @from(Ln 416595, Col 9)
D49
// @from(Ln 416596, Col 4)
K49 = w(() => {
  fA();
  L_0();
  B2();
  v1();
  _gA = c(QA(), 1), D49 = c(QA(), 1)
})
// @from(Ln 416604, Col 0)
function V49(A) {
  if (!A) return {
    type: "menu"
  };
  let Q = A.trim().split(/\s+/);
  switch (Q[0]?.toLowerCase()) {
    case "help":
    case "--help":
    case "-h":
      return {
        type: "help"
      };
    case "install":
    case "i": {
      let G = Q[1];
      if (!G) return {
        type: "install"
      };
      if (G.includes("@")) {
        let [Y, J] = G.split("@");
        return {
          type: "install",
          plugin: Y,
          marketplace: J
        }
      }
      if (G.startsWith("http://") || G.startsWith("https://") || G.startsWith("file://") || G.includes("/") || G.includes("\\")) return {
        type: "install",
        marketplace: G
      };
      return {
        type: "install",
        plugin: G
      }
    }
    case "manage":
      return {
        type: "manage"
      };
    case "uninstall":
      return {
        type: "uninstall", plugin: Q[1]
      };
    case "enable":
      return {
        type: "enable", plugin: Q[1]
      };
    case "disable":
      return {
        type: "disable", plugin: Q[1]
      };
    case "validate":
      return {
        type: "validate", path: Q.slice(1).join(" ").trim() || void 0
      };
    case "marketplace":
    case "market": {
      let G = Q[1]?.toLowerCase(),
        Z = Q.slice(2).join(" ");
      switch (G) {
        case "add":
          return {
            type: "marketplace", action: "add", target: Z
          };
        case "remove":
        case "rm":
          return {
            type: "marketplace", action: "remove", target: Z
          };
        case "update":
          return {
            type: "marketplace", action: "update", target: Z
          };
        case "list":
          return {
            type: "marketplace", action: "list"
          };
        default:
          return {
            type: "marketplace"
          }
      }
    }
    default:
      return {
        type: "menu"
      }
  }
}
// @from(Ln 416694, Col 0)
function SX7({
  onComplete: A
}) {
  return L$.useEffect(() => {
    async function Q() {
      try {
        let B = await D5(),
          G = Object.keys(B);
        if (G.length === 0) A("No marketplaces configured");
        else A(`Configured marketplaces:
${G.map((Z)=>`  • ${Z}`).join(`
`)}`)
      } catch (B) {
        A(`Error loading marketplaces: ${B instanceof Error?B.message:String(B)}`)
      }
    }
    Q()
  }, [A]), rQ.createElement(C, null, "Loading marketplaces...")
}
// @from(Ln 416714, Col 0)
function xX7() {
  return null
}
// @from(Ln 416718, Col 0)
function yX7(A) {
  switch (A.type) {
    case "help":
      return {
        type: "help"
      };
    case "validate":
      return {
        type: "validate", path: A.path
      };
    case "install":
      if (A.marketplace) return {
        type: "browse-marketplace",
        targetMarketplace: A.marketplace,
        targetPlugin: A.plugin
      };
      if (A.plugin) return {
        type: "discover-plugins",
        targetPlugin: A.plugin
      };
      return {
        type: "discover-plugins"
      };
    case "manage":
      return {
        type: "manage-plugins"
      };
    case "uninstall":
      return {
        type: "manage-plugins", targetPlugin: A.plugin, action: "uninstall"
      };
    case "enable":
      return {
        type: "manage-plugins", targetPlugin: A.plugin, action: "enable"
      };
    case "disable":
      return {
        type: "manage-plugins", targetPlugin: A.plugin, action: "disable"
      };
    case "marketplace":
      if (A.action === "list") return {
        type: "marketplace-list"
      };
      if (A.action === "add") return {
        type: "add-marketplace",
        initialValue: A.target
      };
      if (A.action === "remove") return {
        type: "manage-marketplaces",
        targetMarketplace: A.target,
        action: "remove"
      };
      if (A.action === "update") return {
        type: "manage-marketplaces",
        targetMarketplace: A.target,
        action: "update"
      };
      return {
        type: "marketplace-menu"
      };
    case "menu":
    default:
      return {
        type: "discover-plugins"
      }
  }
}
// @from(Ln 416786, Col 0)
function vX7(A) {
  if (A.type === "manage-plugins") return "installed";
  if (A.type === "manage-marketplaces") return "marketplaces";
  return "discover"
}
// @from(Ln 416792, Col 0)
function F49({
  onComplete: A,
  args: Q,
  showMcpRedirectMessage: B
}) {
  let G = V49(Q),
    Z = yX7(G),
    [Y, J] = L$.useState(Z),
    [X, I] = L$.useState(vX7(Z)),
    [D, W] = L$.useState(Y.type === "add-marketplace" ? Y.initialValue || "" : ""),
    [K, V] = L$.useState(0),
    [F, H] = L$.useState(null),
    [E, z] = L$.useState(null),
    [, $] = a0(),
    O = MQ(),
    L = G.type === "marketplace" && G.action === "add" && G.target !== void 0,
    M = L$.useCallback(async () => {
      let {
        enabled: j,
        disabled: x,
        errors: b
      } = await DG(), [S, u] = await Promise.all([z3A(), O4A()]);
      $((f) => {
        let AA = f.plugins.errors.filter((GA) => GA.source === "lsp-manager" || GA.source.startsWith("plugin:")),
          n = new Set(b.map((GA) => GA.type === "generic-error" ? `generic-error:${GA.source}:${GA.error}` : `${GA.type}:${GA.source}`)),
          p = [...AA.filter((GA) => {
            let WA = GA.type === "generic-error" ? `generic-error:${GA.source}:${GA.error}` : `${GA.type}:${GA.source}`;
            return !n.has(WA)
          }), ...b];
        return {
          ...f,
          plugins: {
            ...f.plugins,
            enabled: j,
            disabled: x,
            commands: S,
            agents: u,
            errors: p
          }
        }
      })
    }, [$]),
    _ = L$.useCallback((j) => {
      let x = j;
      switch (I(x), H(null), x) {
        case "discover":
          J({
            type: "discover-plugins"
          });
          break;
        case "installed":
          J({
            type: "manage-plugins"
          });
          break;
        case "marketplaces":
          J({
            type: "manage-marketplaces"
          });
          break
      }
    }, []);
  if (L$.useEffect(() => {
      if (Y.type === "menu") A()
    }, [Y.type, A]), L$.useEffect(() => {
      if (Y.type === "browse-marketplace" && X !== "discover") I("discover")
    }, [Y.type, X]), J0((j, x) => {
      if (x.escape) {
        if (Y.type === "add-marketplace") I("marketplaces"), J({
          type: "manage-marketplaces"
        }), W(""), H(null)
      }
    }), L$.useEffect(() => {
      if (E) A(E)
    }, [E, A]), L$.useEffect(() => {
      if (Y.type === "help") A()
    }, [Y.type, A]), Y.type === "help") return rQ.createElement(T, {
    flexDirection: "column"
  }, rQ.createElement(C, {
    bold: !0
  }, "Plugin Command Usage:"), rQ.createElement(C, null, " "), rQ.createElement(C, {
    dimColor: !0
  }, "Installation:"), rQ.createElement(C, null, " /plugin install - Browse and install plugins"), rQ.createElement(C, null, " ", "/plugin install <marketplace> - Install from specific marketplace"), rQ.createElement(C, null, " /plugin install <plugin> - Install specific plugin"), rQ.createElement(C, null, " ", "/plugin install <plugin>@<market> - Install plugin from marketplace"), rQ.createElement(C, null, " "), rQ.createElement(C, {
    dimColor: !0
  }, "Management:"), rQ.createElement(C, null, " /plugin manage - Manage installed plugins"), rQ.createElement(C, null, " /plugin enable <plugin> - Enable a plugin"), rQ.createElement(C, null, " /plugin disable <plugin> - Disable a plugin"), rQ.createElement(C, null, " /plugin uninstall <plugin> - Uninstall a plugin"), rQ.createElement(C, null, " "), rQ.createElement(C, {
    dimColor: !0
  }, "Marketplaces:"), rQ.createElement(C, null, " /plugin marketplace - Marketplace management menu"), rQ.createElement(C, null, " /plugin marketplace add - Add a marketplace"), rQ.createElement(C, null, " ", "/plugin marketplace add <path/url> - Add marketplace directly"), rQ.createElement(C, null, " /plugin marketplace update - Update marketplaces"), rQ.createElement(C, null, " ", "/plugin marketplace update <name> - Update specific marketplace"), rQ.createElement(C, null, " /plugin marketplace remove - Remove a marketplace"), rQ.createElement(C, null, " ", "/plugin marketplace remove <name> - Remove specific marketplace"), rQ.createElement(C, null, " /plugin marketplace list - List all marketplaces"), rQ.createElement(C, null, " "), rQ.createElement(C, {
    dimColor: !0
  }, "Validation:"), rQ.createElement(C, null, " ", "/plugin validate <path> - Validate a manifest file or directory"), rQ.createElement(C, null, " "), rQ.createElement(C, {
    dimColor: !0
  }, "Other:"), rQ.createElement(C, null, " /plugin - Main plugin menu"), rQ.createElement(C, null, " /plugin help - Show this help"), rQ.createElement(C, null, " /plugins - Alias for /plugin"));
  if (Y.type === "validate") return rQ.createElement(W49, {
    onComplete: A,
    path: Y.path
  });
  if (Y.type === "marketplace-menu") return J({
    type: "menu"
  }), null;
  if (Y.type === "marketplace-list") return rQ.createElement(SX7, {
    onComplete: A
  });
  if (Y.type === "add-marketplace") return rQ.createElement(O99, {
    inputValue: D,
    setInputValue: W,
    cursorOffset: K,
    setCursorOffset: V,
    error: F,
    setError: H,
    result: E,
    setResult: z,
    setViewState: J,
    onAddComplete: M,
    cliMode: L
  });
  if (Y.type === "installation-status") return rQ.createElement(J49, {
    onComplete: () => J({
      type: "menu"
    })
  });
  return rQ.createElement(Nj, {
    title: "Plugins",
    selectedTab: X,
    onTabChange: _,
    color: "suggestion",
    banner: B && X === "installed" ? rQ.createElement(xX7, null) : void 0
  }, rQ.createElement(kX, {
    id: "discover",
    title: "Discover"
  }, Y.type === "browse-marketplace" ? rQ.createElement(x99, {
    error: F,
    setError: H,
    result: E,
    setResult: z,
    setViewState: J,
    onInstallComplete: M,
    targetMarketplace: Y.targetMarketplace,
    targetPlugin: Y.targetPlugin
  }) : rQ.createElement(v99, {
    error: F,
    setError: H,
    result: E,
    setResult: z,
    setViewState: J,
    onInstallComplete: M,
    targetPlugin: Y.type === "discover-plugins" ? Y.targetPlugin : void 0
  })), rQ.createElement(kX, {
    id: "installed",
    title: "Installed"
  }, rQ.createElement(o99, {
    setViewState: J,
    setResult: z,
    onManageComplete: M,
    targetPlugin: Y.type === "manage-plugins" ? Y.targetPlugin : void 0,
    targetMarketplace: Y.type === "manage-plugins" ? Y.targetMarketplace : void 0,
    action: Y.type === "manage-plugins" ? Y.action : void 0
  })), rQ.createElement(kX, {
    id: "marketplaces",
    title: "Marketplaces"
  }, rQ.createElement(R99, {
    setViewState: J,
    error: F,
    setError: H,
    setResult: z,
    exitState: O,
    onManageComplete: M,
    targetMarketplace: Y.type === "manage-marketplaces" ? Y.targetMarketplace : void 0,
    action: Y.type === "manage-marketplaces" ? Y.action : void 0
  })))
}
// @from(Ln 416961, Col 4)
rQ
// @from(Ln 416961, Col 8)
L$
// @from(Ln 416962, Col 4)
O_0 = w(() => {
  fA();
  E9();
  GK();
  hB();
  afA();
  LyA();
  v3A();
  M99();
  _99();
  y99();
  k99();
  r99();
  X49();
  K49();
  HI();
  rQ = c(QA(), 1), L$ = c(QA(), 1)
})
// @from(Ln 416981, Col 0)
function kX7({
  action: A,
  target: Q,
  onComplete: B
}) {
  let [G] = a0(), Z = Ke(), Y = Qz1.useRef(!1);
  return Qz1.useEffect(() => {
    if (Y.current) return;
    Y.current = !0;
    let J = A === "enable",
      X = G.mcp.clients.filter((D) => D.name !== "ide"),
      I = Q === "all" ? X.filter((D) => J ? D.type === "disabled" : D.type !== "disabled") : X.filter((D) => D.name === Q);
    if (I.length === 0) {
      B(Q === "all" ? `All MCP servers are already ${J?"enabled":"disabled"}` : `MCP server "${Q}" not found`);
      return
    }
    for (let D of I) Z(D.name);
    B(Q === "all" ? `${J?"Enabled":"Disabled"} ${I.length} MCP server(s)` : `MCP server "${Q}" ${J?"enabled":"disabled"}`)
  }, [A, Q, G.mcp.clients, Z, B]), null
}
// @from(Ln 417001, Col 4)
jgA
// @from(Ln 417001, Col 9)
Qz1
// @from(Ln 417001, Col 14)
bX7
// @from(Ln 417001, Col 19)
H49
// @from(Ln 417002, Col 4)
E49 = w(() => {
  L99();
  D_0();
  Hp();
  hB();
  O_0();
  jgA = c(QA(), 1), Qz1 = c(QA(), 1);
  bX7 = {
    type: "local-jsx",
    name: "mcp",
    description: "Manage MCP servers",
    isEnabled: () => !0,
    isHidden: !1,
    argumentHint: "[enable|disable [server-name]]",
    async call(A, Q, B) {
      if (B) {
        let G = B.trim().split(/\s+/);
        if (G[0] === "no-redirect") return jgA.default.createElement(iE1, {
          onComplete: A
        });
        if (G[0] === "reconnect" && G[1]) return jgA.default.createElement(I_0, {
          serverName: G.slice(1).join(" "),
          onComplete: A
        });
        if (G[0] === "enable" || G[0] === "disable") return jgA.default.createElement(kX7, {
          action: G[0],
          target: G.length > 1 ? G.slice(1).join(" ") : "all",
          onComplete: A
        })
      }
      return jgA.default.createElement(iE1, {
        onComplete: A
      })
    },
    userFacingName() {
      return "mcp"
    }
  }, H49 = bX7
})
// @from(Ln 417041, Col 4)
M_0 = U((RlY, z49) => {
  z49.exports = function () {
    return typeof Promise === "function" && Promise.prototype && Promise.prototype.then
  }
})
// @from(Ln 417046, Col 4)
Ee = U((hX7) => {
  var R_0, fX7 = [0, 26, 44, 70, 100, 134, 172, 196, 242, 292, 346, 404, 466, 532, 581, 655, 733, 815, 901, 991, 1085, 1156, 1258, 1364, 1474, 1588, 1706, 1828, 1921, 2051, 2185, 2323, 2465, 2611, 2761, 2876, 3034, 3196, 3362, 3532, 3706];
  hX7.getSymbolSize = function (Q) {
    if (!Q) throw Error('"version" cannot be null or undefined');
    if (Q < 1 || Q > 40) throw Error('"version" should be in range from 1 to 40');
    return Q * 4 + 17
  };
  hX7.getSymbolTotalCodewords = function (Q) {
    return fX7[Q]
  };
  hX7.getBCHDigit = function (A) {
    let Q = 0;
    while (A !== 0) Q++, A >>>= 1;
    return Q
  };
  hX7.setToSJISFunction = function (Q) {
    if (typeof Q !== "function") throw Error('"toSJISFunc" is not a valid function.');
    R_0 = Q
  };
  hX7.isKanjiModeEnabled = function () {
    return typeof R_0 < "u"
  };
  hX7.toSJIS = function (Q) {
    return R_0(Q)
  }
})
// @from(Ln 417072, Col 4)
Bz1 = U((iX7) => {
  iX7.L = {
    bit: 1
  };
  iX7.M = {
    bit: 0
  };
  iX7.Q = {
    bit: 3
  };
  iX7.H = {
    bit: 2
  };

  function lX7(A) {
    if (typeof A !== "string") throw Error("Param is not a string");
    switch (A.toLowerCase()) {
      case "l":
      case "low":
        return iX7.L;
      case "m":
      case "medium":
        return iX7.M;
      case "q":
      case "quartile":
        return iX7.Q;
      case "h":
      case "high":
        return iX7.H;
      default:
        throw Error("Unknown EC Level: " + A)
    }
  }
  iX7.isValid = function (Q) {
    return Q && typeof Q.bit < "u" && Q.bit >= 0 && Q.bit < 4
  };
  iX7.from = function (Q, B) {
    if (iX7.isValid(Q)) return Q;
    try {
      return lX7(Q)
    } catch (G) {
      return B
    }
  }
})
// @from(Ln 417117, Col 4)
O49 = U((TlY, L49) => {
  function w49() {
    this.buffer = [], this.length = 0
  }
  w49.prototype = {
    get: function (A) {
      let Q = Math.floor(A / 8);
      return (this.buffer[Q] >>> 7 - A % 8 & 1) === 1
    },
    put: function (A, Q) {
      for (let B = 0; B < Q; B++) this.putBit((A >>> Q - B - 1 & 1) === 1)
    },
    getLengthInBits: function () {
      return this.length
    },
    putBit: function (A) {
      let Q = Math.floor(this.length / 8);
      if (this.buffer.length <= Q) this.buffer.push(0);
      if (A) this.buffer[Q] |= 128 >>> this.length % 8;
      this.length++
    }
  };
  L49.exports = w49
})
// @from(Ln 417141, Col 4)
R49 = U((PlY, M49) => {
  function TgA(A) {
    if (!A || A < 1) throw Error("BitMatrix size must be defined and greater than 0");
    this.size = A, this.data = new Uint8Array(A * A), this.reservedBit = new Uint8Array(A * A)
  }
  TgA.prototype.set = function (A, Q, B, G) {
    let Z = A * this.size + Q;
    if (this.data[Z] = B, G) this.reservedBit[Z] = !0
  };
  TgA.prototype.get = function (A, Q) {
    return this.data[A * this.size + Q]
  };
  TgA.prototype.xor = function (A, Q, B) {
    this.data[A * this.size + Q] ^= B
  };
  TgA.prototype.isReserved = function (A, Q) {
    return this.reservedBit[A * this.size + Q]
  };
  M49.exports = TgA
})
// @from(Ln 417161, Col 4)
j49 = U((oX7) => {
  var aX7 = Ee().getSymbolSize;
  oX7.getRowColCoords = function (Q) {
    if (Q === 1) return [];
    let B = Math.floor(Q / 7) + 2,
      G = aX7(Q),
      Z = G === 145 ? 26 : Math.ceil((G - 13) / (2 * B - 2)) * 2,
      Y = [G - 7];
    for (let J = 1; J < B - 1; J++) Y[J] = Y[J - 1] - Z;
    return Y.push(6), Y.reverse()
  };
  oX7.getPositions = function (Q) {
    let B = [],
      G = oX7.getRowColCoords(Q),
      Z = G.length;
    for (let Y = 0; Y < Z; Y++)
      for (let J = 0; J < Z; J++) {
        if (Y === 0 && J === 0 || Y === 0 && J === Z - 1 || Y === Z - 1 && J === 0) continue;
        B.push([G[Y], G[J]])
      }
    return B
  }
})
// @from(Ln 417184, Col 4)
T49 = U((tX7) => {
  var sX7 = Ee().getSymbolSize;
  tX7.getPositions = function (Q) {
    let B = sX7(Q);
    return [
      [0, 0],
      [B - 7, 0],
      [0, B - 7]
    ]
  }
})
// @from(Ln 417195, Col 4)
k49 = U((QI7) => {
  QI7.Patterns = {
    PATTERN000: 0,
    PATTERN001: 1,
    PATTERN010: 2,
    PATTERN011: 3,
    PATTERN100: 4,
    PATTERN101: 5,
    PATTERN110: 6,
    PATTERN111: 7
  };
  var B8A = {
    N1: 3,
    N2: 3,
    N3: 40,
    N4: 10
  };
  QI7.isValid = function (Q) {
    return Q != null && Q !== "" && !isNaN(Q) && Q >= 0 && Q <= 7
  };
  QI7.from = function (Q) {
    return QI7.isValid(Q) ? parseInt(Q, 10) : void 0
  };
  QI7.getPenaltyN1 = function (Q) {
    let B = Q.size,
      G = 0,
      Z = 0,
      Y = 0,
      J = null,
      X = null;
    for (let I = 0; I < B; I++) {
      Z = Y = 0, J = X = null;
      for (let D = 0; D < B; D++) {
        let W = Q.get(I, D);
        if (W === J) Z++;
        else {
          if (Z >= 5) G += B8A.N1 + (Z - 5);
          J = W, Z = 1
        }
        if (W = Q.get(D, I), W === X) Y++;
        else {
          if (Y >= 5) G += B8A.N1 + (Y - 5);
          X = W, Y = 1
        }
      }
      if (Z >= 5) G += B8A.N1 + (Z - 5);
      if (Y >= 5) G += B8A.N1 + (Y - 5)
    }
    return G
  };
  QI7.getPenaltyN2 = function (Q) {
    let B = Q.size,
      G = 0;
    for (let Z = 0; Z < B - 1; Z++)
      for (let Y = 0; Y < B - 1; Y++) {
        let J = Q.get(Z, Y) + Q.get(Z, Y + 1) + Q.get(Z + 1, Y) + Q.get(Z + 1, Y + 1);
        if (J === 4 || J === 0) G++
      }
    return G * B8A.N2
  };
  QI7.getPenaltyN3 = function (Q) {
    let B = Q.size,
      G = 0,
      Z = 0,
      Y = 0;
    for (let J = 0; J < B; J++) {
      Z = Y = 0;
      for (let X = 0; X < B; X++) {
        if (Z = Z << 1 & 2047 | Q.get(J, X), X >= 10 && (Z === 1488 || Z === 93)) G++;
        if (Y = Y << 1 & 2047 | Q.get(X, J), X >= 10 && (Y === 1488 || Y === 93)) G++
      }
    }
    return G * B8A.N3
  };
  QI7.getPenaltyN4 = function (Q) {
    let B = 0,
      G = Q.data.length;
    for (let Y = 0; Y < G; Y++) B += Q.data[Y];
    return Math.abs(Math.ceil(B * 100 / G / 5) - 10) * B8A.N4
  };

  function AI7(A, Q, B) {
    switch (A) {
      case QI7.Patterns.PATTERN000:
        return (Q + B) % 2 === 0;
      case QI7.Patterns.PATTERN001:
        return Q % 2 === 0;
      case QI7.Patterns.PATTERN010:
        return B % 3 === 0;
      case QI7.Patterns.PATTERN011:
        return (Q + B) % 3 === 0;
      case QI7.Patterns.PATTERN100:
        return (Math.floor(Q / 2) + Math.floor(B / 3)) % 2 === 0;
      case QI7.Patterns.PATTERN101:
        return Q * B % 2 + Q * B % 3 === 0;
      case QI7.Patterns.PATTERN110:
        return (Q * B % 2 + Q * B % 3) % 2 === 0;
      case QI7.Patterns.PATTERN111:
        return (Q * B % 3 + (Q + B) % 2) % 2 === 0;
      default:
        throw Error("bad maskPattern:" + A)
    }
  }
  QI7.applyMask = function (Q, B) {
    let G = B.size;
    for (let Z = 0; Z < G; Z++)
      for (let Y = 0; Y < G; Y++) {
        if (B.isReserved(Y, Z)) continue;
        B.xor(Y, Z, AI7(Q, Y, Z))
      }
  };
  QI7.getBestMask = function (Q, B) {
    let G = Object.keys(QI7.Patterns).length,
      Z = 0,
      Y = 1 / 0;
    for (let J = 0; J < G; J++) {
      B(J), QI7.applyMask(J, Q);
      let X = QI7.getPenaltyN1(Q) + QI7.getPenaltyN2(Q) + QI7.getPenaltyN3(Q) + QI7.getPenaltyN4(Q);
      if (QI7.applyMask(J, Q), X < Y) Y = X, Z = J
    }
    return Z
  }
})
// @from(Ln 417318, Col 4)
j_0 = U((ZI7) => {
  var ze = Bz1(),
    Gz1 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 2, 4, 1, 2, 4, 4, 2, 4, 4, 4, 2, 4, 6, 5, 2, 4, 6, 6, 2, 5, 8, 8, 4, 5, 8, 8, 4, 5, 8, 11, 4, 8, 10, 11, 4, 9, 12, 16, 4, 9, 16, 16, 6, 10, 12, 18, 6, 10, 17, 16, 6, 11, 16, 19, 6, 13, 18, 21, 7, 14, 21, 25, 8, 16, 20, 25, 8, 17, 23, 25, 9, 17, 23, 34, 9, 18, 25, 30, 10, 20, 27, 32, 12, 21, 29, 35, 12, 23, 34, 37, 12, 25, 34, 40, 13, 26, 35, 42, 14, 28, 38, 45, 15, 29, 40, 48, 16, 31, 43, 51, 17, 33, 45, 54, 18, 35, 48, 57, 19, 37, 51, 60, 19, 38, 53, 63, 20, 40, 56, 66, 21, 43, 59, 70, 22, 45, 62, 74, 24, 47, 65, 77, 25, 49, 68, 81],
    Zz1 = [7, 10, 13, 17, 10, 16, 22, 28, 15, 26, 36, 44, 20, 36, 52, 64, 26, 48, 72, 88, 36, 64, 96, 112, 40, 72, 108, 130, 48, 88, 132, 156, 60, 110, 160, 192, 72, 130, 192, 224, 80, 150, 224, 264, 96, 176, 260, 308, 104, 198, 288, 352, 120, 216, 320, 384, 132, 240, 360, 432, 144, 280, 408, 480, 168, 308, 448, 532, 180, 338, 504, 588, 196, 364, 546, 650, 224, 416, 600, 700, 224, 442, 644, 750, 252, 476, 690, 816, 270, 504, 750, 900, 300, 560, 810, 960, 312, 588, 870, 1050, 336, 644, 952, 1110, 360, 700, 1020, 1200, 390, 728, 1050, 1260, 420, 784, 1140, 1350, 450, 812, 1200, 1440, 480, 868, 1290, 1530, 510, 924, 1350, 1620, 540, 980, 1440, 1710, 570, 1036, 1530, 1800, 570, 1064, 1590, 1890, 600, 1120, 1680, 1980, 630, 1204, 1770, 2100, 660, 1260, 1860, 2220, 720, 1316, 1950, 2310, 750, 1372, 2040, 2430];
  ZI7.getBlocksCount = function (Q, B) {
    switch (B) {
      case ze.L:
        return Gz1[(Q - 1) * 4 + 0];
      case ze.M:
        return Gz1[(Q - 1) * 4 + 1];
      case ze.Q:
        return Gz1[(Q - 1) * 4 + 2];
      case ze.H:
        return Gz1[(Q - 1) * 4 + 3];
      default:
        return
    }
  };
  ZI7.getTotalCodewordsCount = function (Q, B) {
    switch (B) {
      case ze.L:
        return Zz1[(Q - 1) * 4 + 0];
      case ze.M:
        return Zz1[(Q - 1) * 4 + 1];
      case ze.Q:
        return Zz1[(Q - 1) * 4 + 2];
      case ze.H:
        return Zz1[(Q - 1) * 4 + 3];
      default:
        return
    }
  }
})
// @from(Ln 417351, Col 4)
b49 = U((XI7) => {
  var PgA = new Uint8Array(512),
    Yz1 = new Uint8Array(256);
  (function () {
    let Q = 1;
    for (let B = 0; B < 255; B++)
      if (PgA[B] = Q, Yz1[Q] = B, Q <<= 1, Q & 256) Q ^= 285;
    for (let B = 255; B < 512; B++) PgA[B] = PgA[B - 255]
  })();
  XI7.log = function (Q) {
    if (Q < 1) throw Error("log(" + Q + ")");
    return Yz1[Q]
  };
  XI7.exp = function (Q) {
    return PgA[Q]
  };
  XI7.mul = function (Q, B) {
    if (Q === 0 || B === 0) return 0;
    return PgA[Yz1[Q] + Yz1[B]]
  }
})