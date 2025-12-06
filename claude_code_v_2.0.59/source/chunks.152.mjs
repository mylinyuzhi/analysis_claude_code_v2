
// @from(Start 14379076, End 14380849)
function FC9({
  onComplete: A,
  path: Q
}) {
  return VC9.useEffect(() => {
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
        let G = qJ1(Q),
          Z = "";
        if (Z += `Validating ${G.fileType} manifest: ${G.filePath}

`, G.errors.length > 0) Z += `${H1.cross} Found ${G.errors.length} error${G.errors.length===1?"":"s"}:

`, G.errors.forEach((I) => {
          Z += `  ${H1.pointer} ${I.path}: ${I.message}
`
        }), Z += `
`;
        if (G.warnings.length > 0) Z += `${H1.warning} Found ${G.warnings.length} warning${G.warnings.length===1?"":"s"}:

`, G.warnings.forEach((I) => {
          Z += `  ${H1.pointer} ${I.path}: ${I.message}
`
        }), Z += `
`;
        if (G.success) {
          if (G.warnings.length > 0) Z += `${H1.tick} Validation passed with warnings
`;
          else Z += `${H1.tick} Validation passed
`;
          process.exitCode = 0
        } else Z += `${H1.cross} Validation failed
`, process.exitCode = 1;
        A(Z)
      } catch (G) {
        process.exitCode = 2, AA(G instanceof Error ? G : Error(String(G))), A(`${H1.cross} Unexpected error during validation: ${G instanceof Error?G.message:String(G)}`)
      }
    }
    B()
  }, [A, Q]), OSA.createElement(S, {
    flexDirection: "column"
  }, OSA.createElement($, null, "Running validation..."))
}
// @from(Start 14380854, End 14380857)
OSA
// @from(Start 14380859, End 14380862)
VC9
// @from(Start 14380868, End 14380958)
KC9 = L(() => {
  hA();
  YK0();
  V9();
  g1();
  OSA = BA(VA(), 1), VC9 = BA(VA(), 1)
})
// @from(Start 14380961, End 14382913)
function DC9(A) {
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
        let [I, Y] = G.split("@");
        return {
          type: "install",
          plugin: I,
          marketplace: Y
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
// @from(Start 14382915, End 14383406)
function px3({
  onComplete: A
}) {
  return iO.useEffect(() => {
    async function Q() {
      try {
        let B = await pZ(),
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
  }, [A]), GB.createElement($, null, "Loading marketplaces...")
}
// @from(Start 14383408, End 14384919)
function lx3(A) {
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
      if (A.marketplace || A.plugin) return {
        type: "browse-marketplace",
        targetMarketplace: A.marketplace,
        targetPlugin: A.plugin
      };
      return {
        type: "browse-marketplace"
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
        type: "menu"
      }
  }
}
// @from(Start 14384921, End 14389923)
function HC9({
  onComplete: A,
  args: Q
}) {
  let B = DC9(Q),
    [G, Z] = iO.useState(lx3(B)),
    [I, Y] = iO.useState(G.type === "add-marketplace" ? G.initialValue || "" : ""),
    [J, W] = iO.useState(0),
    [X, V] = iO.useState(null),
    [F, K] = iO.useState(null),
    [, D] = OQ(),
    H = EQ(),
    C = B.type === "marketplace" && B.action === "add" && B.target !== void 0,
    E = iO.useCallback(async () => {
      let {
        enabled: U,
        disabled: q,
        errors: w
      } = await l7(), [N, R] = await Promise.all([PQA(), _0A()]);
      D((T) => ({
        ...T,
        plugins: {
          ...T.plugins,
          enabled: U,
          disabled: q,
          commands: N,
          agents: R,
          errors: w
        }
      }))
    }, [D]);
  if (f1((U, q) => {
      if (q.escape) {
        if (G.type === "add-marketplace") Z({
          type: "menu"
        }), Y(""), V(null);
        else if (G.type === "manage-marketplaces") Z({
          type: "menu"
        }), V(null), K(null);
        else if (G.type === "browse-marketplace") Z({
          type: "menu"
        });
        return
      }
    }), iO.useEffect(() => {
      if (F) A(F)
    }, [F, A]), iO.useEffect(() => {
      if (G.type === "help") A()
    }, [G.type, A]), G.type === "help") return GB.createElement(S, {
    flexDirection: "column"
  }, GB.createElement($, {
    bold: !0
  }, "Plugin Command Usage:"), GB.createElement($, null, " "), GB.createElement($, {
    dimColor: !0
  }, "Installation:"), GB.createElement($, null, " /plugin install - Browse and install plugins"), GB.createElement($, null, " ", "/plugin install <marketplace> - Install from specific marketplace"), GB.createElement($, null, " /plugin install <plugin> - Install specific plugin"), GB.createElement($, null, " ", "/plugin install <plugin>@<market> - Install plugin from marketplace"), GB.createElement($, null, " "), GB.createElement($, {
    dimColor: !0
  }, "Management:"), GB.createElement($, null, " /plugin manage - Manage installed plugins"), GB.createElement($, null, " /plugin enable <plugin> - Enable a plugin"), GB.createElement($, null, " /plugin disable <plugin> - Disable a plugin"), GB.createElement($, null, " /plugin uninstall <plugin> - Uninstall a plugin"), GB.createElement($, null, " "), GB.createElement($, {
    dimColor: !0
  }, "Marketplaces:"), GB.createElement($, null, " /plugin marketplace - Marketplace management menu"), GB.createElement($, null, " /plugin marketplace add - Add a marketplace"), GB.createElement($, null, " ", "/plugin marketplace add <path/url> - Add marketplace directly"), GB.createElement($, null, " /plugin marketplace update - Update marketplaces"), GB.createElement($, null, " ", "/plugin marketplace update <name> - Update specific marketplace"), GB.createElement($, null, " /plugin marketplace remove - Remove a marketplace"), GB.createElement($, null, " ", "/plugin marketplace remove <name> - Remove specific marketplace"), GB.createElement($, null, " /plugin marketplace list - List all marketplaces"), GB.createElement($, null, " "), GB.createElement($, {
    dimColor: !0
  }, "Validation:"), GB.createElement($, null, " ", "/plugin validate <path> - Validate a manifest file or directory"), GB.createElement($, null, " "), GB.createElement($, {
    dimColor: !0
  }, "Other:"), GB.createElement($, null, " /plugin - Main plugin menu"), GB.createElement($, null, " /plugin help - Show this help"), GB.createElement($, null, " /plugins - Alias for /plugin"));
  if (G.type === "validate") return GB.createElement(FC9, {
    onComplete: A,
    path: G.path
  });
  if (G.type === "marketplace-menu") return Z({
    type: "menu"
  }), null;
  if (G.type === "marketplace-list") return GB.createElement(px3, {
    onComplete: A
  });
  if (G.type === "add-marketplace") return GB.createElement(aH9, {
    inputValue: I,
    setInputValue: Y,
    cursorOffset: J,
    setCursorOffset: W,
    error: X,
    setError: V,
    result: F,
    setResult: K,
    setViewState: Z,
    onAddComplete: E,
    cliMode: C
  });
  if (G.type === "manage-marketplaces") return GB.createElement(rH9, {
    setViewState: Z,
    error: X,
    setError: V,
    setResult: K,
    exitState: H,
    onManageComplete: E,
    targetMarketplace: G.targetMarketplace,
    action: G.action
  });
  if (G.type === "browse-marketplace") return GB.createElement(tH9, {
    error: X,
    setError: V,
    result: F,
    setResult: K,
    setViewState: Z,
    onInstallComplete: E,
    targetMarketplace: G.targetMarketplace,
    targetPlugin: G.targetPlugin
  });
  if (G.type === "manage-plugins") return GB.createElement(GC9, {
    setViewState: Z,
    setResult: K,
    onManageComplete: E,
    targetPlugin: G.targetPlugin,
    action: G.action
  });
  if (G.type === "installation-status") return GB.createElement(JC9, {
    onComplete: () => Z({
      type: "menu"
    })
  });
  return GB.createElement(cH9, {
    setViewState: Z,
    onComplete: A,
    exitState: H
  })
}
// @from(Start 14389928, End 14389930)
GB
// @from(Start 14389932, End 14389934)
iO
// @from(Start 14389940, End 14390116)
CC9 = L(() => {
  hA();
  Q4();
  fV();
  z9();
  TjA();
  ETA();
  pH9();
  sH9();
  oH9();
  eH9();
  ZC9();
  WC9();
  KC9();
  oH();
  GB = BA(VA(), 1), iO = BA(VA(), 1)
})
// @from(Start 14390122, End 14390125)
JK0
// @from(Start 14390127, End 14390130)
ix3
// @from(Start 14390132, End 14390135)
EC9
// @from(Start 14390141, End 14390556)
zC9 = L(() => {
  CC9();
  JK0 = BA(VA(), 1), ix3 = {
    type: "local-jsx",
    name: "plugin",
    aliases: ["plugins", "marketplace"],
    description: "Manage Claude Code plugins",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A, Q, B) {
      return JK0.createElement(HC9, {
        onComplete: A,
        args: B
      })
    },
    userFacingName() {
      return "plugin"
    }
  }, EC9 = ix3
})
// @from(Start 14390562, End 14390565)
nx3
// @from(Start 14390567, End 14390570)
UC9
// @from(Start 14390576, End 14391028)
$C9 = L(() => {
  nx3 = {
    description: "Restore the code and/or conversation to a previous point",
    name: "rewind",
    aliases: ["checkpoint"],
    userFacingName: () => "rewind",
    argumentHint: "",
    isEnabled: () => !0,
    type: "local",
    isHidden: !1,
    supportsNonInteractive: !1,
    async call(A, Q) {
      if (Q.openMessageSelector) Q.openMessageSelector();
      return {
        type: "skip"
      }
    }
  }, UC9 = nx3
})
// @from(Start 14391034, End 14391059)
wC9 = L(() => {
  R9()
})
// @from(Start 14391065, End 14391068)
ax3
// @from(Start 14391070, End 14391073)
sx3
// @from(Start 14391079, End 14391161)
qC9 = L(() => {
  hA();
  J5();
  lbA();
  ax3 = BA(VA(), 1), sx3 = BA(VA(), 1)
})
// @from(Start 14391167, End 14391170)
rx3
// @from(Start 14391176, End 14391303)
NC9 = L(() => {
  NX();
  hA();
  Pi();
  gB();
  V0();
  AE();
  g1();
  J5();
  nV0();
  BK();
  _0();
  rx3 = BA(VA(), 1)
})
// @from(Start 14391309, End 14391323)
LC9 = () => {}
// @from(Start 14391326, End 14393882)
function MC9() {
  if (!nQ.isSandboxingEnabled()) return y4.createElement(S, {
    flexDirection: "column",
    paddingY: 1
  }, y4.createElement($, {
    color: "subtle"
  }, "Sandbox is not enabled"));
  let Q = nQ.getFsReadConfig(),
    B = nQ.getFsWriteConfig(),
    G = nQ.getNetworkRestrictionConfig(),
    Z = nQ.getAllowUnixSockets(),
    I = nQ.getExcludedCommands(),
    Y = nQ.getLinuxGlobPatternWarnings();
  return y4.createElement(S, {
    flexDirection: "column",
    paddingY: 1
  }, y4.createElement(S, {
    flexDirection: "column"
  }, y4.createElement($, {
    bold: !0,
    color: "permission"
  }, "Excluded Commands:"), y4.createElement($, {
    dimColor: !0
  }, I.length > 0 ? I.join(", ") : "None")), Q.denyOnly.length > 0 && y4.createElement(S, {
    marginTop: 1,
    flexDirection: "column"
  }, y4.createElement($, {
    bold: !0,
    color: "permission"
  }, "Filesystem Read Restrictions:"), y4.createElement($, {
    dimColor: !0
  }, "Denied: ", Q.denyOnly.join(", "))), B.allowOnly.length > 0 && y4.createElement(S, {
    marginTop: 1,
    flexDirection: "column"
  }, y4.createElement($, {
    bold: !0,
    color: "permission"
  }, "Filesystem Write Restrictions:"), y4.createElement($, {
    dimColor: !0
  }, "Allowed: ", B.allowOnly.join(", ")), B.denyWithinAllow.length > 0 && y4.createElement($, {
    dimColor: !0
  }, "Denied within allowed: ", B.denyWithinAllow.join(", "))), (G.allowedHosts && G.allowedHosts.length > 0 || G.deniedHosts && G.deniedHosts.length > 0) && y4.createElement(S, {
    marginTop: 1,
    flexDirection: "column"
  }, y4.createElement($, {
    bold: !0,
    color: "permission"
  }, "Network Restrictions:"), G.allowedHosts && G.allowedHosts.length > 0 && y4.createElement($, {
    dimColor: !0
  }, "Allowed: ", G.allowedHosts.join(", ")), G.deniedHosts && G.deniedHosts.length > 0 && y4.createElement($, {
    dimColor: !0
  }, "Denied: ", G.deniedHosts.join(", "))), Z && Z.length > 0 && y4.createElement(S, {
    marginTop: 1,
    flexDirection: "column"
  }, y4.createElement($, {
    bold: !0,
    color: "permission"
  }, "Allowed Unix Sockets:"), y4.createElement($, {
    dimColor: !0
  }, Z.join(", "))), Y.length > 0 && y4.createElement(S, {
    marginTop: 1,
    flexDirection: "column"
  }, y4.createElement($, {
    bold: !0,
    color: "warning"
  }, "⚠ Warning: Glob patterns not fully supported on Linux"), y4.createElement($, {
    dimColor: !0
  }, "The following patterns will be ignored:", " ", Y.slice(0, 3).join(", "), Y.length > 3 && ` (${Y.length-3} more)`)))
}
// @from(Start 14393887, End 14393889)
y4
// @from(Start 14393895, End 14393948)
OC9 = L(() => {
  hA();
  $J();
  y4 = BA(VA(), 1)
})
// @from(Start 14393951, End 14396724)
function RC9({
  onComplete: A
}) {
  let [Q] = qB(), B = nQ.isSandboxingEnabled(), G = nQ.areUnsandboxedCommandsAllowed(), Z = nQ.areSandboxSettingsLockedByPolicy(), I = G ? "open" : "closed", Y = ZB("success", Q)("(current)"), J = [{
    label: I === "open" ? `Allow unsandboxed fallback ${Y}` : "Allow unsandboxed fallback",
    value: "open"
  }, {
    label: I === "closed" ? `Strict sandbox mode ${Y}` : "Strict sandbox mode",
    value: "closed"
  }];
  async function W(X) {
    let V = X;
    await nQ.setSandboxSettings({
      allowUnsandboxedCommands: V === "open"
    }), A(V === "open" ? "✓ Unsandboxed fallback allowed - commands can run outside sandbox when necessary" : "✓ Strict sandbox mode - all commands must run in sandbox or be excluded via the `excludedCommands` option")
  }
  if (f1((X, V) => {
      if (V.escape) A()
    }), !B) return RK.default.createElement(S, {
    flexDirection: "column",
    paddingY: 1
  }, RK.default.createElement($, {
    color: "subtle"
  }, "Sandbox is not enabled. Enable sandbox to configure override settings."));
  if (Z) return RK.default.createElement(S, {
    flexDirection: "column",
    paddingY: 1
  }, RK.default.createElement($, {
    color: "subtle"
  }, "Override settings are managed by a higher-priority configuration and cannot be changed locally."), RK.default.createElement(S, {
    marginTop: 1
  }, RK.default.createElement($, {
    dimColor: !0
  }, "Current setting:", " ", I === "closed" ? "Strict sandbox mode" : "Allow unsandboxed fallback")));
  return RK.default.createElement(S, {
    flexDirection: "column",
    paddingY: 1
  }, RK.default.createElement(S, {
    marginBottom: 1
  }, RK.default.createElement($, {
    bold: !0
  }, "Configure Overrides:")), RK.default.createElement(M0, {
    options: J,
    onChange: W,
    onCancel: () => A()
  }), RK.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1,
    gap: 1
  }, RK.default.createElement($, {
    dimColor: !0
  }, RK.default.createElement($, {
    bold: !0,
    dimColor: !0
  }, "Allow unsandboxed fallback:"), " ", "When a command fails due to sandbox restrictions, Claude can retry with dangerouslyDisableSandbox to run outside the sandbox (falling back to default permissions)."), RK.default.createElement($, {
    dimColor: !0
  }, RK.default.createElement($, {
    bold: !0,
    dimColor: !0
  }, "Strict sandbox mode:"), " ", "All bash commands invoked by the model must run in the sandbox unless they are explicitly listed in excludedCommands."), RK.default.createElement($, {
    dimColor: !0
  }, "Learn more:", " ", RK.default.createElement(h4, {
    url: "https://code.claude.com/docs/en/sandboxing#configure-sandboxing"
  }, "code.claude.com/docs/en/sandboxing#configure-sandboxing"))))
}
// @from(Start 14396729, End 14396731)
RK
// @from(Start 14396737, End 14396806)
TC9 = L(() => {
  hA();
  S5();
  $J();
  hA();
  RK = BA(VA(), 1)
})
// @from(Start 14396809, End 14399818)
function PC9({
  onComplete: A
}) {
  let [Q] = qB(), B = nQ.isSandboxingEnabled(), G = nQ.isAutoAllowBashIfSandboxedEnabled(), I = (() => {
    if (!B) return "disabled";
    if (G) return "auto-allow";
    return "regular"
  })(), Y = ZB("success", Q)("(current)"), J = [{
    label: I === "auto-allow" ? `Sandbox BashTool, with auto-allow in accept edits mode ${Y}` : "Sandbox BashTool, with auto-allow in accept edits mode",
    value: "auto-allow"
  }, {
    label: I === "regular" ? `Sandbox BashTool, with regular permissions ${Y}` : "Sandbox BashTool, with regular permissions",
    value: "regular"
  }, {
    label: I === "disabled" ? `No Sandbox ${Y}` : "No Sandbox",
    value: "disabled"
  }];
  async function W(X) {
    switch (X) {
      case "auto-allow":
        await nQ.setSandboxSettings({
          enabled: !0,
          autoAllowBashIfSandboxed: !0
        }), A("✓ Sandbox enabled with auto-allow for bash commands when in accept-edits mode");
        break;
      case "regular":
        await nQ.setSandboxSettings({
          enabled: !0,
          autoAllowBashIfSandboxed: !1
        }), A("✓ Sandbox enabled with regular bash permissions");
        break;
      case "disabled":
        await nQ.setSandboxSettings({
          enabled: !1,
          autoAllowBashIfSandboxed: !1
        }), A("○ Sandbox disabled");
        break
    }
  }
  return f1((X, V) => {
    if (V.escape) A()
  }), QF.default.createElement(S, {
    flexDirection: "column"
  }, QF.default.createElement(D3, {
    dividerColor: "permission",
    dividerDimColor: !0
  }), QF.default.createElement(S, {
    marginX: 1
  }, QF.default.createElement(Na, {
    title: "Sandbox:",
    color: "permission",
    defaultTab: "Mode"
  }, QF.default.createElement(eD, {
    key: "mode",
    title: "Mode"
  }, QF.default.createElement(S, {
    flexDirection: "column",
    paddingY: 1
  }, QF.default.createElement(S, {
    marginBottom: 1
  }, QF.default.createElement($, {
    bold: !0
  }, "Configure Mode:")), QF.default.createElement(M0, {
    options: J,
    onChange: W,
    onCancel: () => A()
  }), QF.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1,
    gap: 1
  }, QF.default.createElement($, {
    dimColor: !0
  }, QF.default.createElement($, {
    bold: !0,
    dimColor: !0
  }, "Auto-allow mode:"), " ", "When in accept-edits mode, commands will try to run in the sandbox automatically, and attempts to run outside of the sandbox fallback to regular permissions. Explicit ask/deny rules are always respected."), QF.default.createElement($, {
    dimColor: !0
  }, "Learn more:", " ", QF.default.createElement(h4, {
    url: "https://code.claude.com/docs/en/sandboxing"
  }, "code.claude.com/docs/en/sandboxing"))))), QF.default.createElement(eD, {
    key: "overrides",
    title: "Overrides"
  }, QF.default.createElement(RC9, {
    onComplete: A
  })), QF.default.createElement(eD, {
    key: "config",
    title: "Config"
  }, QF.default.createElement(MC9, null)))))
}
// @from(Start 14399823, End 14399825)
QF
// @from(Start 14399831, End 14399935)
jC9 = L(() => {
  hA();
  S5();
  $J();
  FSA();
  BK();
  hA();
  OC9();
  TC9();
  QF = BA(VA(), 1)
})
// @from(Start 14399966, End 14401467)
async function ox3(A, Q, B) {
  let Z = l0().theme || "light";
  if (!nQ.isSupportedPlatform(dQ())) {
    let Y = ZB("error", Z)("Error: Sandboxing is currently only supported on macOS and Linux");
    return A(Y), null
  }
  if (!nQ.checkDependencies()) {
    let J = dQ() === "linux" ? "Error: Sandbox requires socat and bubblewrap. Please install these packages." : "Error: Sandbox dependencies are not available on this system.",
      W = ZB("error", Z)(J);
    return A(W), null
  }
  if (nQ.areSandboxSettingsLockedByPolicy()) {
    let Y = ZB("error", Z)("Error: Sandbox settings are overridden by a higher-priority configuration and cannot be changed locally.");
    return A(Y), null
  }
  let I = B?.trim() || "";
  if (!I) return _C9.default.createElement(PC9, {
    onComplete: A
  });
  if (I) {
    let J = I.split(" ")[0];
    if (J === "exclude") {
      let W = I.slice(8).trim();
      if (!W) {
        let D = ZB("error", Z)('Error: Please provide a command pattern to exclude (e.g., /sandbox exclude "npm run test:*")');
        return A(D), null
      }
      let X = W.replace(/^["']|["']$/g, "");
      Ac0(X);
      let V = Gw("localSettings"),
        F = V ? SC9.relative(I2A(), V) : ".claude/settings.local.json",
        K = ZB("success", Z)(`Added "${X}" to excluded commands in ${F}`);
      return A(K), null
    } else {
      let W = ZB("error", Z)(`Error: Unknown subcommand "${J}". Available subcommand: exclude`);
      return A(W), null
    }
  }
  return null
}
// @from(Start 14401472, End 14401475)
_C9
// @from(Start 14401477, End 14401480)
tx3
// @from(Start 14401482, End 14401485)
kC9
// @from(Start 14401491, End 14402296)
yC9 = L(() => {
  $J();
  hA();
  MB();
  $J();
  MB();
  _0();
  jC9();
  Q3();
  _C9 = BA(VA(), 1);
  tx3 = {
    name: "sandbox",
    get description() {
      let A = nQ.isSandboxingEnabled(),
        Q = nQ.isAutoAllowBashIfSandboxedEnabled(),
        B = nQ.areUnsandboxedCommandsAllowed(),
        G = nQ.areSandboxSettingsLockedByPolicy(),
        Z = A ? "✓" : "○",
        I = "sandbox disabled";
      if (A) I = Q ? "sandbox enabled (auto-allow)" : "sandbox enabled", I += B ? ", fallback allowed" : "";
      if (G) I += " (managed)";
      return `${Z} ${I} (⏎ to configure)`
    },
    argumentHint: 'exclude "command pattern"',
    isEnabled: () => !0,
    isHidden: !nQ.isSupportedPlatform(dQ()),
    type: "local-jsx",
    userFacingName: () => "sandbox",
    call: ox3
  }, kC9 = tx3
})
// @from(Start 14402302, End 14402305)
ex3
// @from(Start 14402307, End 14402310)
xC9
// @from(Start 14402316, End 14402898)
vC9 = L(() => {
  gM();
  ex3 = {
    type: "local",
    name: "stickers",
    description: "Order Claude Code stickers",
    isEnabled: () => !0,
    isHidden: !1,
    supportsNonInteractive: !1,
    async call() {
      if (await cZ("https://www.stickermule.com/claudecode")) return {
        type: "text",
        value: "Opening sticker page in browser…"
      };
      else return {
        type: "text",
        value: "Failed to open browser. Visit: https://www.stickermule.com/claudecode"
      }
    },
    userFacingName() {
      return "stickers"
    }
  }, xC9 = ex3
})
// @from(Start 14402975, End 14403031)
function WK0(A) {
  return /^skill\.md$/i.test(NJ1(A))
}
// @from(Start 14403033, End 14403454)
function Qv3(A) {
  let Q = new Map;
  for (let G of A) {
    let Z = RSA(G.filePath),
      I = Q.get(Z) ?? [];
    I.push(G), Q.set(Z, I)
  }
  let B = [];
  for (let [G, Z] of Q) {
    let I = Z.filter((Y) => WK0(Y.filePath));
    if (I.length > 0) {
      let Y = I[0];
      if (I.length > 1) g(`Multiple skill files found in ${G}, using ${NJ1(Y.filePath)}`);
      B.push(Y)
    } else B.push(...Z)
  }
  return B
}
// @from(Start 14403456, End 14403626)
function bC9(A, Q) {
  let B = Q.endsWith("/") ? Q.slice(0, -1) : Q;
  if (A === B) return "";
  let G = A.slice(B.length + 1);
  return G ? G.split(Av3).join(":") : ""
}
// @from(Start 14403628, End 14403748)
function Bv3(A, Q) {
  let B = RSA(A),
    G = RSA(B),
    Z = NJ1(B),
    I = bC9(G, Q);
  return I ? `${I}:${Z}` : Z
}
// @from(Start 14403750, End 14403886)
function Gv3(A, Q) {
  let B = NJ1(A),
    G = RSA(A),
    Z = B.replace(/\.md$/, ""),
    I = bC9(G, Q);
  return I ? `${I}:${Z}` : Z
}
// @from(Start 14403888, End 14403990)
function Zv3(A) {
  return WK0(A.filePath) ? Bv3(A.filePath, A.baseDir) : Gv3(A.filePath, A.baseDir)
}
// @from(Start 14403995, End 14403998)
fC9
// @from(Start 14404004, End 14406652)
hC9 = L(() => {
  l2();
  g1();
  V0();
  OjA();
  _y();
  LV();
  hQ();
  t2();
  fC9 = s1(async () => {
    try {
      let A = await _n("commands");
      return Qv3(A).map(({
        baseDir: G,
        filePath: Z,
        frontmatter: I,
        content: Y,
        source: J
      }) => {
        try {
          let W = I.description ?? Wx(Y, "Custom command"),
            X = UO(I["allowed-tools"]),
            V = I["argument-hint"],
            F = I.when_to_use,
            K = I.version,
            D = Y0(I["disable-model-invocation"] ?? void 0),
            H = I.model === "inherit" ? void 0 : I.model ? UD(I.model) : void 0,
            C = WK0(Z),
            E = C ? RSA(Z) : void 0,
            U = Zv3({
              baseDir: G,
              filePath: Z,
              frontmatter: I,
              content: Y,
              source: J
            }),
            q = `${W} (${Pm(J)})`;
          return {
            type: "prompt",
            name: U,
            description: q,
            hasUserSpecifiedDescription: !!I.description,
            allowedTools: X,
            argumentHint: V,
            whenToUse: F,
            version: K,
            model: H,
            isSkill: C,
            disableModelInvocation: D,
            isEnabled: () => !0,
            isHidden: !1,
            progressMessage: C ? "loading" : "running",
            userFacingName() {
              return U
            },
            source: J,
            async getPromptForCommand(w, N) {
              let R = Y;
              if (C && E) R = `Base directory for this skill: ${E}

${R}`;
              if (w)
                if (R.includes("$ARGUMENTS")) R = R.replaceAll("$ARGUMENTS", w);
                else R = R + `

ARGUMENTS: ${w}`;
              return R = await Fa(R, {
                ...N,
                async getAppState() {
                  let T = await N.getAppState();
                  return {
                    ...T,
                    toolPermissionContext: {
                      ...T.toolPermissionContext,
                      alwaysAllowRules: {
                        ...T.toolPermissionContext.alwaysAllowRules,
                        command: X
                      }
                    }
                  }
                }
              }, `/${U}`), [{
                type: "text",
                text: R
              }]
            }
          }
        } catch (W) {
          return AA(W instanceof Error ? W : Error(String(W))), null
        }
      }).filter((G) => G !== null)
    } catch (A) {
      return AA(A instanceof Error ? A : Error(String(A))), []
    }
  })
})
// @from(Start 14406692, End 14406866)
function Iv3(A, Q) {
  let B = RA();
  try {
    let G = B.statSync(A),
      Z = B.statSync(Q);
    return G.ino === Z.ino && G.dev === Z.dev
  } catch {
    return !1
  }
}
// @from(Start 14406867, End 14409273)
async function XK0(A, Q) {
  let B = RA(),
    G = [];
  try {
    if (!B.existsSync(A)) return [];
    let Z = B.readdirSync(A);
    for (let I of Z) {
      if (!I.isDirectory() && !I.isSymbolicLink()) continue;
      let Y = tg(A, I.name),
        J = tg(Y, "SKILL.md");
      if (B.existsSync(J)) try {
        let W = B.readFileSync(J, {
            encoding: "utf-8"
          }),
          {
            frontmatter: X,
            content: V
          } = NV(W),
          F = I.name,
          K = X.description ?? Wx(V, "Skill"),
          D = UO(X["allowed-tools"]),
          H = X["argument-hint"],
          C = X.when_to_use,
          E = X.version,
          U = X.name,
          q = X["disable-model-invocation"],
          w = q === void 0 ? !1 : Y0(q),
          N = X.model === "inherit" ? void 0 : X.model,
          R = `${K} (${Pm(Q)})`;
        G.push({
          type: "prompt",
          name: F,
          description: R,
          hasUserSpecifiedDescription: !!X.description,
          allowedTools: D,
          argumentHint: H,
          whenToUse: C,
          version: E,
          model: N,
          isSkill: !0,
          disableModelInvocation: w,
          isEnabled: () => !0,
          isHidden: !0,
          progressMessage: "running",
          userFacingName() {
            return U || F
          },
          source: Q,
          async getPromptForCommand(T, y) {
            let v = `Base directory for this skill: ${Y}

${V}`;
            if (T)
              if (v.includes("$ARGUMENTS")) v = v.replaceAll("$ARGUMENTS", T);
              else v = v + `

ARGUMENTS: ${T}`;
            return v = await Fa(v, {
              ...y,
              async getAppState() {
                let x = await y.getAppState();
                return {
                  ...x,
                  toolPermissionContext: {
                    ...x.toolPermissionContext,
                    alwaysAllowRules: {
                      ...x.toolPermissionContext.alwaysAllowRules,
                      command: D
                    }
                  }
                }
              }
            }, `/${F}`), [{
              type: "text",
              text: v
            }]
          }
        })
      } catch (W) {
        AA(W instanceof Error ? W : Error(String(W)))
      }
    }
  } catch (Z) {
    AA(Z instanceof Error ? Z : Error(String(Z)))
  }
  return G
}
// @from(Start 14409275, End 14409316)
function gC9() {
  VK0.cache?.clear?.()
}
// @from(Start 14409321, End 14409324)
VK0
// @from(Start 14409330, End 14410663)
uC9 = L(() => {
  l2();
  g1();
  V0();
  OjA();
  _y();
  LV();
  hQ();
  AQ();
  hQ();
  U2();
  MB();
  LV();
  VK0 = s1(async () => {
    let A = tg(MQ(), "skills"),
      Q = tg(W0(), ".claude", "skills"),
      B = tg(iw(), ".claude", "skills");
    g(`Loading skills from directories: managed=${B}, user=${A}, project=${Q}`);
    let [G, Z, I] = await Promise.all([XK0(B, "policySettings"), EH("userSettings") ? XK0(A, "userSettings") : Promise.resolve([]), EH("projectSettings") ? XK0(Q, "projectSettings") : Promise.resolve([])]), Y = [...G, ...Z, ...I], J = [], W = new Map;
    for (let X of Y) {
      if (X.type !== "prompt") continue;
      let V = X.source === "policySettings" ? tg(iw(), ".claude", "skills", X.name) : X.source === "userSettings" ? tg(MQ(), "skills", X.name) : tg(W0(), ".claude", "skills", X.name),
        F = tg(V, "SKILL.md"),
        K = W.get(X.name);
      if (K && Iv3(K, F)) {
        g(`Skipping duplicate skill '${X.name}' from ${X.source} (same file as earlier source)`);
        continue
      }
      W.set(X.name, F), J.push(X)
    }
    if (J.length < Y.length) g(`Deduplicated ${Y.length-J.length} duplicate skills`);
    return g(`Loaded ${J.length} unique skills (managed: ${G.length}, user: ${Z.length}, project: ${I.length}, duplicates removed: ${Y.length-J.length})`), J
  })
})
// @from(Start 14410704, End 14413753)
function mC9({
  content: A,
  defaultFilename: Q,
  onDone: B
}) {
  let [, G] = NZ.useState(null), [Z, I] = NZ.useState(Q), [Y, J] = NZ.useState(Q.length), [W, X] = NZ.useState(!1), V = EQ();
  return f1((H, C) => {
    if (C.escape)
      if (W) X(!1), G(null);
      else B({
        success: !1,
        message: "Export cancelled"
      })
  }), NZ.default.createElement(S, {
    width: "100%",
    flexDirection: "column"
  }, NZ.default.createElement(S, {
    borderStyle: "round",
    borderColor: "permission",
    flexDirection: "column",
    padding: 1,
    width: "100%"
  }, NZ.default.createElement(S, null, NZ.default.createElement($, {
    color: "permission",
    bold: !0
  }, "Export Conversation")), !W ? NZ.default.createElement(NZ.default.Fragment, null, NZ.default.createElement(S, {
    marginTop: 1
  }, NZ.default.createElement($, {
    dimColor: !0
  }, "Select export method:")), NZ.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, NZ.default.createElement(M0, {
    options: [{
      label: "Copy to clipboard",
      value: "clipboard",
      description: "Copy the conversation to your system clipboard"
    }, {
      label: "Save to file",
      value: "file",
      description: "Save the conversation to a file in the current directory"
    }],
    onChange: async (H) => {
      if (H === "clipboard")
        if (await La(A)) B({
          success: !0,
          message: "Conversation copied to clipboard"
        });
        else B({
          success: !1,
          message: ZJ1()
        });
      else if (H === "file") G("file"), X(!0)
    },
    onCancel: () => B({
      success: !1,
      message: "Export cancelled"
    })
  }))) : NZ.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, NZ.default.createElement($, null, "Enter filename:"), NZ.default.createElement(S, {
    flexDirection: "row",
    gap: 1,
    marginTop: 1
  }, NZ.default.createElement($, null, ">"), NZ.default.createElement(s4, {
    value: Z,
    onChange: I,
    onSubmit: () => {
      let H = Z.endsWith(".txt") ? Z : Z.replace(/\.[^.]+$/, "") + ".txt",
        C = Yv3(W0(), H);
      try {
        RA().writeFileSync(C, A, {
          encoding: "utf-8",
          flush: !0
        }), B({
          success: !0,
          message: `Conversation exported to: ${H}`
        })
      } catch (E) {
        B({
          success: !1,
          message: `Failed to export conversation: ${E instanceof Error?E.message:"Unknown error"}`
        })
      }
    },
    focus: !0,
    showCursor: !0,
    columns: process.stdout.columns || 80,
    cursorOffset: Y,
    onChangeCursorOffset: J
  })))), NZ.default.createElement(S, {
    marginLeft: 2
  }, W ? NZ.default.createElement($, {
    dimColor: !0
  }, "Enter to save · Esc to go back") : NZ.default.createElement(NZ.default.Fragment, null, V.pending ? NZ.default.createElement($, {
    dimColor: !0
  }, "Press ", V.keyName, " again to exit") : NZ.default.createElement($, {
    dimColor: !0
  }, "Esc to cancel"))))
}
// @from(Start 14413758, End 14413760)
NZ
// @from(Start 14413766, End 14413860)
dC9 = L(() => {
  hA();
  S5();
  ZY();
  Q4();
  U2();
  AQ();
  $SA();
  NZ = BA(VA(), 1)
})
// @from(Start 14413862, End 14414352)
async function cC9(A, Q = []) {
  return UVA(LJ1.default.createElement(() => LJ1.default.createElement(yG, null, LJ1.default.createElement(_QA, {
    messages: A,
    normalizedMessageHistory: [],
    tools: Q,
    verbose: !1,
    toolJSX: null,
    toolUseConfirmQueue: [],
    inProgressToolUseIDs: new Set,
    isMessageSelectorVisible: !1,
    conversationId: "export",
    screen: "prompt",
    screenToggleId: 0,
    streamingToolUses: [],
    showAllInTranscript: !0
  })), null))
}
// @from(Start 14414357, End 14414360)
LJ1
// @from(Start 14414366, End 14414430)
FK0 = L(() => {
  DSA();
  _I1();
  z9();
  LJ1 = BA(VA(), 1)
})
// @from(Start 14414471, End 14414798)
function Wv3(A) {
  let Q = A.getFullYear(),
    B = String(A.getMonth() + 1).padStart(2, "0"),
    G = String(A.getDate()).padStart(2, "0"),
    Z = String(A.getHours()).padStart(2, "0"),
    I = String(A.getMinutes()).padStart(2, "0"),
    Y = String(A.getSeconds()).padStart(2, "0");
  return `${Q}-${B}-${G}-${Z}${I}${Y}`
}
// @from(Start 14414800, End 14415206)
function Xv3(A) {
  let Q = A.find((Z) => Z.type === "user");
  if (!Q || Q.type !== "user") return "";
  let B = Q.message?.content,
    G = "";
  if (typeof B === "string") G = B.trim();
  else if (Array.isArray(B)) {
    let Z = B.find((I) => I.type === "text");
    if (Z && "text" in Z) G = Z.text.trim()
  }
  if (G = G.split(`
`)[0] || "", G.length > 50) G = G.substring(0, 50) + "...";
  return G
}
// @from(Start 14415208, End 14415344)
function Vv3(A) {
  return A.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
}
// @from(Start 14415345, End 14415431)
async function Fv3(A) {
  let Q = A.options.tools || [];
  return cC9(A.messages, Q)
}
// @from(Start 14415436, End 14415439)
pC9
// @from(Start 14415441, End 14415444)
Kv3
// @from(Start 14415446, End 14415449)
lC9
// @from(Start 14415455, End 14416708)
iC9 = L(() => {
  dC9();
  FK0();
  U2();
  AQ();
  pC9 = BA(VA(), 1);
  Kv3 = {
    type: "local-jsx",
    name: "export",
    description: "Export the current conversation to a file or clipboard",
    isEnabled: () => !0,
    isHidden: !1,
    argumentHint: "[filename]",
    async call(A, Q, B) {
      let G = await Fv3(Q);
      if (B.trim()) {
        let J = B.trim(),
          W = J.endsWith(".txt") ? J : J.replace(/\.[^.]+$/, "") + ".txt",
          X = Jv3(W0(), W);
        try {
          return RA().writeFileSync(X, G, {
            encoding: "utf-8",
            flush: !0
          }), A(`Conversation exported to: ${W}`), null
        } catch (V) {
          return A(`Failed to export conversation: ${V instanceof Error?V.message:"Unknown error"}`), null
        }
      }
      let Z = Xv3(Q.messages),
        I = Wv3(new Date),
        Y;
      if (Z) {
        let J = Vv3(Z);
        Y = J ? `${I.substring(0,10)}-${J}.txt` : `conversation-${I}.txt`
      } else Y = `conversation-${I}.txt`;
      return pC9.default.createElement(mC9, {
        content: G,
        defaultFilename: Y,
        onDone: (J) => {
          A(J.message)
        }
      })
    },
    userFacingName() {
      return "export"
    }
  }, lC9 = Kv3
})
// @from(Start 14416710, End 14417555)
async function aC9(A) {
  let Q = A.trim();
  if (!Q) return {
    valid: !1,
    error: "Model name cannot be empty"
  };
  let B = Q.toLowerCase();
  if (Y7A.includes(B)) return {
    valid: !0
  };
  if (nC9.has(Q)) return {
    valid: !0
  };
  try {
    let G = Dw(Q);
    return await (await Kq({
      model: Q,
      maxRetries: 0
    })).beta.messages.create({
      model: ac(Q),
      max_tokens: 1,
      messages: [{
        role: "user",
        content: [{
          type: "text",
          text: "Hi",
          cache_control: {
            type: "ephemeral"
          }
        }]
      }],
      system: [{
        type: "text",
        text: rnA()
      }],
      metadata: Rl(),
      ...G.length > 0 ? {
        betas: G
      } : {}
    }), nC9.set(Q, !0), {
      valid: !0
    }
  } catch (G) {
    return Dv3(G, Q)
  }
}
// @from(Start 14417557, End 14418398)
function Dv3(A, Q) {
  if (A instanceof Ir) return {
    valid: !1,
    error: `Model '${Q}' not found`
  };
  if (A instanceof n2) {
    if (A instanceof Zr) return {
      valid: !1,
      error: "Authentication failed. Please check your API credentials."
    };
    if (A instanceof cC) return {
      valid: !1,
      error: "Network error. Please check your internet connection."
    };
    let G = A.error;
    if (G && typeof G === "object" && "type" in G && G.type === "not_found_error" && "message" in G && typeof G.message === "string" && G.message.includes("model:")) return {
      valid: !1,
      error: `Model '${Q}' not found`
    };
    return {
      valid: !1,
      error: `API error: ${A.message}`
    }
  }
  return {
    valid: !1,
    error: `Unable to validate model: ${A instanceof Error?A.message:String(A)}`
  }
}
// @from(Start 14418403, End 14418406)
nC9
// @from(Start 14418412, End 14418504)
sC9 = L(() => {
  oZA();
  Eh1();
  fZ();
  t2();
  CS();
  t2();
  p_();
  nC9 = new Map
})
// @from(Start 14418510, End 14418513)
MJ1
// @from(Start 14418515, End 14418518)
OJ1
// @from(Start 14418524, End 14418701)
KK0 = L(() => {
  MJ1 = ["help", "-h", "--help"], OJ1 = ["list", "show", "display", "current", "view", "get", "check", "describe", "print", "version", "about", "status", "?"]
})
// @from(Start 14418704, End 14419432)
function Hv3({
  onDone: A
}) {
  let [{
    mainLoopModel: Q,
    mainLoopModelForSession: B
  }, G] = OQ();
  f1((I, Y) => {
    if (Y.escape) {
      GA("tengu_model_command_menu", {
        action: "cancel"
      });
      let J = Q ?? ic().label;
      A(`Kept model as ${tA.bold(J)}`, {
        display: "system"
      });
      return
    }
  });

  function Z(I) {
    GA("tengu_model_command_menu", {
      action: I,
      from_model: Q,
      to_model: I
    }), G((Y) => ({
      ...Y,
      mainLoopModel: I,
      mainLoopModelForSession: null
    })), A(`Set model to ${tA.bold(YM(I))}`)
  }
  return Yj.createElement(hY1, {
    initial: Q,
    sessionModel: B,
    onSelect: Z,
    isStandaloneCommand: !0
  })
}
// @from(Start 14419434, End 14420429)
function Cv3({
  args: A,
  onDone: Q
}) {
  let [B, G] = OQ(), Z = A === "default" ? null : A;
  return Yj.useEffect(() => {
    async function I() {
      if (Z && zv3(Z)) {
        Q("Your plan doesn't include Opus in Claude Code. Turn on /extra-usage or /upgrade to Max to access it.", {
          display: "system"
        });
        return
      }
      if (!Z) {
        Y(null);
        return
      }
      if (Ev3(Z)) {
        Y(Z);
        return
      }
      try {
        let {
          valid: J,
          error: W
        } = await aC9(Z);
        if (J) Y(Z);
        else Q(W || `Model '${Z}' not found`, {
          display: "system"
        })
      } catch (J) {
        Q(`Failed to validate model: ${J.message}`, {
          display: "system"
        })
      }
    }

    function Y(J) {
      G((W) => ({
        ...W,
        mainLoopModel: J,
        mainLoopModelForSession: null
      })), Q(`Set model to ${tA.bold(YM(J))}`)
    }
    I()
  }, [Z, Q, G]), null
}
// @from(Start 14420431, End 14420496)
function Ev3(A) {
  return Y7A.includes(A.toLowerCase().trim())
}
// @from(Start 14420498, End 14420576)
function zv3(A) {
  return BB() && !pw() && A.toLowerCase().includes("opus")
}
// @from(Start 14420578, End 14420853)
function Uv3({
  onDone: A
}) {
  let [{
    mainLoopModel: Q,
    mainLoopModelForSession: B
  }] = OQ(), G = Q ?? ic().label;
  if (B) A(`Current model: ${tA.bold(YM(B))} (session override from plan mode)
Base model: ${G}`);
  else A(`Current model: ${G}`);
  return null
}
// @from(Start 14420858, End 14420860)
Yj
// @from(Start 14420862, End 14420865)
rC9
// @from(Start 14420871, End 14421827)
oC9 = L(() => {
  cV0();
  z9();
  t2();
  sC9();
  hA();
  q0();
  F9();
  gB();
  KK0();
  Yj = BA(VA(), 1);
  rC9 = {
    type: "local-jsx",
    name: "model",
    userFacingName() {
      return "model"
    },
    description: "Set the AI model for Claude Code",
    isEnabled: () => !0,
    isHidden: !1,
    argumentHint: "[model]",
    async call(A, Q, B) {
      if (B = B?.trim() || "", OJ1.includes(B)) return GA("tengu_model_command_inline_help", {
        args: B
      }), Yj.createElement(Uv3, {
        onDone: A
      });
      if (MJ1.includes(B)) {
        A("Run /model to open the model selection menu, or /model [modelName] to set the model.", {
          display: "system"
        });
        return
      }
      if (B) return GA("tengu_model_command_inline", {
        args: B
      }), Yj.createElement(Cv3, {
        args: B,
        onDone: A
      });
      return Yj.createElement(Hv3, {
        onDone: A
      })
    }
  }
})
// @from(Start 14421830, End 14422561)
function $v3({
  onDone: A
}) {
  let B = Sg().outputStyle ?? wK;
  f1((I, Y) => {
    if (Y.escape) {
      GA("tengu_output_style_command_menu", {
        action: "cancel"
      }), A(`Kept output style as ${tA.bold(B)}`, {
        display: "system"
      });
      return
    }
  });

  function G(I) {
    GA("tengu_output_style_command_menu", {
      action: I,
      from_style: B,
      to_style: I
    }), cB("localSettings", {
      outputStyle: I
    }), A(`Set output style to ${tA.bold(I)}`)
  }

  function Z() {
    A(`Kept output style as ${tA.bold(B)}`, {
      display: "system"
    })
  }
  return eg.createElement(uY1, {
    initialStyle: B,
    onComplete: G,
    onCancel: Z,
    isStandaloneCommand: !0
  })
}
// @from(Start 14422563, End 14422723)
function wv3(A, Q) {
  if (A in Q) return A;
  let B = A.toLowerCase();
  for (let G of Object.keys(Q))
    if (G.toLowerCase() === B) return G;
  return null
}
// @from(Start 14422725, End 14422998)
function qv3({
  args: A,
  onDone: Q
}) {
  return cQA().then((B) => {
    let G = wv3(A, B);
    if (!G) {
      Q(`Invalid output style: ${A}`);
      return
    }
    cB("localSettings", {
      outputStyle: G
    }), Q(`Set output style to ${tA.bold(G)}`)
  }), null
}
// @from(Start 14423000, End 14423112)
function Nv3({
  onDone: A
}) {
  let Q = Sg();
  return A(`Current output style: ${Q.outputStyle??wK}`), null
}
// @from(Start 14423117, End 14423119)
eg
// @from(Start 14423121, End 14423124)
tC9
// @from(Start 14423130, End 14424156)
eC9 = L(() => {
  lV0();
  hA();
  q0();
  F9();
  MB();
  BjA();
  Gx();
  KK0();
  eg = BA(VA(), 1);
  tC9 = {
    type: "local-jsx",
    name: "output-style",
    userFacingName() {
      return "output-style"
    },
    description: "Set the output style directly or from a selection menu",
    isEnabled: () => !0,
    isHidden: !1,
    argumentHint: "[style]",
    async call(A, Q, B) {
      if (B = B?.trim() || "", OJ1.includes(B)) return GA("tengu_output_style_command_inline_help", {
        args: B
      }), eg.createElement(Nv3, {
        onDone: A
      });
      if (MJ1.includes(B)) {
        A("Run /output-style to open the output style selection menu, or /output-style [styleName] to set the output style.", {
          display: "system"
        });
        return
      }
      if (B) return GA("tengu_output_style_command_inline", {
        args: B
      }), eg.createElement(qv3, {
        args: B,
        onDone: A
      });
      return eg.createElement($v3, {
        onDone: A
      })
    }
  }
})
// @from(Start 14424158, End 14424847)
async function AE9() {
  let A = await nJA();
  if (A.length === 0) return {
    availableEnvironments: [],
    selectedEnvironment: null,
    selectedEnvironmentSource: null
  };
  let B = l0()?.remote?.defaultEnvironmentId,
    G = A[0],
    Z = null;
  if (B) {
    let I = A.find((Y) => Y.environment_id === B);
    if (I) {
      G = I;
      for (let Y = iN.length - 1; Y >= 0; Y--) {
        let J = iN[Y];
        if (!J || J === "flagSettings") continue;
        if (OB(J)?.remote?.defaultEnvironmentId === B) {
          Z = J;
          break
        }
      }
    }
  }
  return {
    availableEnvironments: A,
    selectedEnvironment: G,
    selectedEnvironmentSource: Z
  }
}
// @from(Start 14424852, End 14424894)
QE9 = L(() => {
  MB();
  LV();
  g61()
})
// @from(Start 14424897, End 14426609)
function BE9({
  onDone: A
}) {
  let [Q, B] = Ta.useState("loading"), [G, Z] = Ta.useState([]), [I, Y] = Ta.useState(null), [J, W] = Ta.useState(null), [X, V] = Ta.useState(null);
  Ta.useEffect(() => {
    async function K() {
      try {
        let D = await AE9();
        Z(D.availableEnvironments), Y(D.selectedEnvironment), W(D.selectedEnvironmentSource), B(null)
      } catch (D) {
        let H = D instanceof Error ? D.message : String(D);
        AA(D instanceof Error ? D : Error(H)), V(H), B(null)
      }
    }
    K()
  }, []);

  function F(K) {
    if (K === "cancel") {
      A();
      return
    }
    B("updating");
    let D = G.find((H) => H.environment_id === K);
    if (!D) {
      A("Error: Selected environment not found");
      return
    }
    cB("localSettings", {
      remote: {
        defaultEnvironmentId: D.environment_id
      }
    }), A(`Set default remote environment to ${tA.bold(D.name)} (${D.environment_id})`)
  }
  if (Q === "loading") return O8.createElement(hD, {
    title: TSA,
    onCancel: A,
    hideInputGuide: !0
  }, O8.createElement(GE9, {
    message: "Loading environments…"
  }));
  if (X) return O8.createElement(hD, {
    title: TSA,
    onCancel: A
  }, O8.createElement($, {
    color: "error"
  }, "Error: ", X));
  if (!I) return O8.createElement(hD, {
    title: TSA,
    subtitle: DK0,
    onCancel: A
  }, O8.createElement($, null, "No remote environments available."));
  if (G.length === 1) return O8.createElement(Mv3, {
    environment: I,
    onDone: A
  });
  return O8.createElement(Ov3, {
    environments: G,
    selectedEnvironment: I,
    selectedEnvironmentSource: J,
    loadingState: Q,
    onSelect: F,
    onCancel: A
  })
}
// @from(Start 14426611, End 14426764)
function GE9({
  message: A
}) {
  return O8.createElement(S, {
    flexDirection: "row"
  }, O8.createElement(g4, null), O8.createElement($, null, A))
}
// @from(Start 14426766, End 14426986)
function Lv3({
  environment: A
}) {
  return O8.createElement($, null, H1.tick, " Using ", O8.createElement($, {
    bold: !0
  }, A.name), " ", O8.createElement($, {
    dimColor: !0
  }, "(", A.environment_id, ")"))
}
// @from(Start 14426988, End 14427219)
function Mv3({
  environment: A,
  onDone: Q
}) {
  return f1((B, G) => {
    if (G.return) Q()
  }), O8.createElement(hD, {
    title: TSA,
    subtitle: DK0,
    onCancel: Q
  }, O8.createElement(Lv3, {
    environment: A
  }))
}
// @from(Start 14427221, End 14428096)
function Ov3({
  environments: A,
  selectedEnvironment: Q,
  selectedEnvironmentSource: B,
  loadingState: G,
  onSelect: Z,
  onCancel: I
}) {
  let Y = `Currently using: ${tA.bold(Q.name)}`;
  if (B && B !== "localSettings") {
    let J = Pm(B);
    Y += ` (from ${J} settings)`
  }
  return O8.createElement(hD, {
    title: TSA,
    subtitle: Y,
    onCancel: I,
    hideInputGuide: !0
  }, O8.createElement($, {
    dimColor: !0
  }, DK0), G === "updating" ? O8.createElement(GE9, {
    message: "Updating…"
  }) : O8.createElement(M0, {
    options: A.map((J) => ({
      label: `${J.name} ${tA.dim(`(${J.environment_id})`)}`,
      value: J.environment_id
    })),
    defaultValue: Q.environment_id,
    onChange: Z,
    onCancel: () => Z("cancel"),
    layout: "compact-vertical"
  }), O8.createElement($, {
    dimColor: !0
  }, "Enter to select · Esc to exit"))
}
// @from(Start 14428101, End 14428103)
O8
// @from(Start 14428105, End 14428107)
Ta
// @from(Start 14428109, End 14428142)
TSA = "Select Remote Environment"
// @from(Start 14428146, End 14428203)
DK0 = "Configure environments at: https://claude.ai/code"
// @from(Start 14428209, End 14428345)
ZE9 = L(() => {
  hA();
  Mi();
  S5();
  V9();
  DY();
  QE9();
  MB();
  g1();
  F9();
  LV();
  O8 = BA(VA(), 1), Ta = BA(VA(), 1)
})
// @from(Start 14428351, End 14428354)
HK0
// @from(Start 14428356, End 14428359)
IE9
// @from(Start 14428365, End 14428782)
YE9 = L(() => {
  ZE9();
  gB();
  HK0 = BA(VA(), 1), IE9 = {
    type: "local-jsx",
    name: "remote-env",
    userFacingName() {
      return "remote-env"
    },
    description: "Configure the default remote environment for teleport sessions",
    isEnabled: () => !0,
    get isHidden() {
      return !BB()
    },
    async call(A) {
      return HK0.createElement(BE9, {
        onDone: A
      })
    }
  }
})
// @from(Start 14428788, End 14428791)
CK0
// @from(Start 14428793, End 14428796)
Rv3
// @from(Start 14428798, End 14428801)
PSA
// @from(Start 14428807, End 14430394)
EK0 = L(() => {
  g1();
  gB();
  gM();
  ZI1();
  kDA();
  CK0 = BA(VA(), 1), Rv3 = {
    type: "local-jsx",
    name: "upgrade",
    description: "Upgrade to Max for higher rate limits and more Opus",
    isEnabled: () => !process.env.DISABLE_UPGRADE_COMMAND && !N_() && f4() !== "enterprise",
    isHidden: !1,
    async call(A, Q) {
      try {
        if (BB()) {
          let G = M6(),
            Z = !1;
          if (G?.subscriptionType && G?.rateLimitTier) Z = G.subscriptionType === "max" && G.rateLimitTier === "default_claude_max_20x";
          else if (G?.accessToken) {
            let I = await k4A(G.accessToken);
            Z = I?.organization?.organization_type === "claude_max" && I?.organization?.rate_limit_tier === "default_claude_max_20x"
          }
          if (Z) return setTimeout(() => {
            A("You are already on the highest Max subscription plan. For additional usage, run /login to switch to an API usage-billed account.")
          }, 0), null
        }
        return await cZ("https://claude.ai/upgrade/max"), CK0.createElement(KjA, {
          startingMessage: "Starting new login following /upgrade. Exit with Ctrl-C to use existing account.",
          onDone: (G) => {
            Q.onChangeAPIKey(), A(G ? "Login successful" : "Login interrupted")
          }
        })
      } catch (B) {
        AA(B), setTimeout(() => {
          A("Failed to open browser. Please visit https://claude.ai/upgrade/max to upgrade.")
        }, 0)
      }
      return null
    },
    userFacingName() {
      return "upgrade"
    }
  }, PSA = Rv3
})
// @from(Start 14430397, End 14432271)
function Tv3({
  onDone: A,
  context: Q
}) {
  let [B, G] = OQ(), [Z, I] = Au.useState(null), Y = f4(), J = yc(), W = t6()?.hasExtraUsageEnabled === !0, X = Q.options.mainLoopModel, F = Y === "pro" && KT(X) && o2("tengu_backstage_only"), D = Y === "max" && J === "default_claude_max_20x", H = Au.useMemo(() => {
    let U = [{
      label: "Stop and wait for limit to reset",
      value: "cancel"
    }];
    if (F) U.unshift({
      label: "Switch to Sonnet",
      value: "use-sonnet"
    });
    if (Yx.isEnabled()) U.push({
      label: W ? "Add funds to continue with extra usage" : "Switch to extra usage",
      value: "extra-usage"
    });
    if (!D && PSA.isEnabled()) U.push({
      label: "Upgrade your plan",
      value: "upgrade"
    });
    return U
  }, [D, F, W]);

  function C() {
    GA("tengu_rate_limit_options_menu_cancel", {}), A(void 0, {
      display: "skip"
    })
  }

  function E(U) {
    if (U === "upgrade") GA("tengu_rate_limit_options_menu_select_upgrade", {}), PSA.call(A, Q).then((q) => {
      if (q) I(q)
    });
    else if (U === "extra-usage") GA("tengu_rate_limit_options_menu_select_extra_usage", {}), Yx.call(A, Q).then((q) => {
      if (q) I(q)
    });
    else if (U === "use-sonnet") {
      let q = XU();
      GA("tengu_rate_limit_options_menu_select_use_sonnet", {}), G((w) => ({
        ...w,
        mainLoopModel: q,
        mainLoopModelForSession: null
      })), A(`Set model to ${YM(q)}`)
    } else if (U === "cancel") C()
  }
  if (Z) return Z;
  return Au.default.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    borderColor: "suggestion",
    paddingLeft: 1,
    paddingRight: 1,
    gap: 1
  }, Au.default.createElement($, null, "What do you want to do?"), Au.default.createElement(M0, {
    options: H,
    onChange: E,
    onCancel: C,
    visibleOptionCount: H.length
  }))
}
// @from(Start 14432276, End 14432278)
Au
// @from(Start 14432280, End 14432283)
JE9
// @from(Start 14432289, End 14432821)
WE9 = L(() => {
  hA();
  S5();
  q0();
  gB();
  EK0();
  DjA();
  t2();
  z9();
  u2();
  Au = BA(VA(), 1), JE9 = {
    type: "local-jsx",
    name: "rate-limit-options",
    userFacingName() {
      return "rate-limit-options"
    },
    description: "Show options when rate limit is reached",
    isEnabled: () => {
      let A = f4();
      return A === "pro" || A === "max"
    },
    isHidden: !0,
    async call(A, Q) {
      return Au.default.createElement(Tv3, {
        onDone: A,
        context: Q
      })
    }
  }
})
// @from(Start 14432827, End 14432830)
Pv3
// @from(Start 14432832, End 14432835)
XE9
// @from(Start 14432841, End 14433519)
VE9 = L(() => {
  Pv3 = {
    type: "prompt",
    description: "Set up Claude Code's status line UI",
    aliases: [],
    isEnabled: () => !0,
    isHidden: !1,
    name: "statusline",
    progressMessage: "setting up statusLine",
    allowedTools: ["Task", "Read(~/**)", "Edit(~/.claude/settings.json)"],
    source: "builtin",
    disableNonInteractive: !0,
    async getPromptForCommand(A) {
      return [{
        type: "text",
        text: `Create a Task with subagent_type "statusline-setup" and the prompt "${A.trim()||"Configure my statusLine from my shell PS1 configuration"}"`
      }]
    },
    userFacingName() {
      return "statusline"
    }
  }, XE9 = Pv3
})
// @from(Start 14433525, End 14433559)
FE9 = L(() => {
  u60();
  MB()
})
// @from(Start 14433561, End 14433675)
async function jv3() {
  try {
    return (await xjA())?.eligible ? [CD9] : []
  } catch (A) {
    return []
  }
}
// @from(Start 14433676, End 14434481)
async function Sv3() {
  try {
    let [A, Q] = await Promise.all([VK0().catch((B) => {
      return AA(B instanceof Error ? B : Error("Failed to load skill directory commands")), g("Skill directory commands failed to load, continuing without them"), []
    }), iW0().catch((B) => {
      return AA(B instanceof Error ? B : Error("Failed to load plugin skills")), g("Plugin skills failed to load, continuing without them"), []
    })]);
    return g(`getSkills returning: ${A.length} skill dir commands, ${Q.length} plugin skills`), {
      skillDirCommands: A,
      pluginSkills: Q
    }
  } catch (A) {
    return AA(A instanceof Error ? A : Error("Unexpected error loading skills")), g("Unexpected error in getSkills, returning empty"), {
      skillDirCommands: [],
      pluginSkills: []
    }
  }
}
// @from(Start 14434483, End 14434588)
function nH9() {
  sE.cache?.clear?.(), OWA.cache?.clear?.(), n51.cache?.clear?.(), zI1(), f69(), gC9()
}
// @from(Start 14434590, End 14434702)
function ph(A, Q) {
  return Q.some((B) => B.name === A || B.userFacingName() === A || B.aliases?.includes(A))
}
// @from(Start 14434704, End 14435054)
function Pq(A, Q) {
  let B = Q.find((G) => G.name === A || G.userFacingName() === A || G.aliases?.includes(A));
  if (!B) throw ReferenceError(`Command ${A} not found. Available commands: ${Q.map((G)=>{let Z=G.userFacingName();return G.aliases?`${Z} (aliases: ${G.aliases.join(", ")})`:Z}).sort((G,Z)=>G.localeCompare(Z)).join(", ")}`);
  return B
}
// @from(Start 14435059, End 14435062)
KE9
// @from(Start 14435064, End 14435066)
Ny
// @from(Start 14435068, End 14435070)
sE
// @from(Start 14435072, End 14435075)
OWA
// @from(Start 14435077, End 14435080)
Z71
// @from(Start 14435082, End 14435085)
n51
// @from(Start 14435091, End 14437100)
cE = L(() => {
  _Y1();
  wV9();
  NV9();
  MV9();
  RV9();
  oV9();
  BF9();
  ZF9();
  IF9();
  zF9();
  LF9();
  OF9();
  yF9();
  uF9();
  dF9();
  ZI1();
  D61();
  LK9();
  SK9();
  _K9();
  kK9();
  xK9();
  fK9();
  gK9();
  nK9();
  jF0();
  aK9();
  rK9();
  tK9();
  eK9();
  BD9();
  ZD9();
  r7A();
  YD9();
  WD9();
  VD9();
  KD9();
  ED9();
  vjA();
  ND9();
  nD9();
  sD9();
  dH9();
  zC9();
  $C9();
  wC9();
  qC9();
  NC9();
  LC9();
  yC9();
  vC9();
  g1();
  V0();
  hC9();
  uC9();
  TjA();
  l2();
  gB();
  KX0();
  iC9();
  oC9();
  eC9();
  YE9();
  EK0();
  DjA();
  WE9();
  VE9();
  FE9();
  KE9 = s1(() => [KV9, mH9, LV9, OV9, rV9, QF9, GF9, EF9, hI1, aD9, kF9, gF9, mF9, NK9, jK9, MF9, rC9, tC9, IE9, EC9, yK9, bK9, hK9, iK9, sK9, XE9, xC9, QD9, qV9, JJ1, UC9, GD9, Ep, PSA, Yx, JE9, ID9, JD9, XD9, FD9, qD9, iD9, lC9, kC9, ...!N_() ? [FO2, d49()] : [], oK9, ...[]]), Ny = s1(() => new Set(KE9().map((A) => A.name)));
  sE = s1(async () => {
    let [A, {
      skillDirCommands: Q,
      pluginSkills: B
    }, G, Z] = await Promise.all([fC9(), Sv3(), PQA(), jv3()]);
    return [...A, ...Q, ...G, ...B, ...Z, ...KE9()].filter((I) => I.isEnabled())
  });
  OWA = s1(async () => {
    return (await sE()).filter((Q) => Q.type === "prompt" && Q.isSkill === !0 && !Q.disableModelInvocation && Q.source !== "builtin" && (Q.hasUserSpecifiedDescription || Q.whenToUse))
  }), Z71 = s1(async () => {
    return (await sE()).filter((Q) => Q.type === "prompt" && Q.isSkill !== !0 && !Q.disableModelInvocation && Q.source !== "builtin" && (Q.hasUserSpecifiedDescription || Q.whenToUse))
  }), n51 = s1(async () => {
    try {
      return (await sE()).filter((Q) => Q.type === "prompt" && Q.source !== "builtin" && (Q.hasUserSpecifiedDescription || Q.whenToUse) && (Q.isSkill || Q.disableModelInvocation))
    } catch (A) {
      return AA(A instanceof Error ? A : Error("Failed to load slash command skills")), g("Returning empty skills array due to load failure"), []
    }
  })
})
// @from(Start 14437103, End 14437751)
function kv3() {
  let A = BZ("tengu_effort_exp", "tengu_effort_level", "");
  if (!A) return "";
  let Q = _v3[A.toLowerCase()];
  if (Q === void 0) return "";
  return `
<reasoning_effort>${Q}</reasoning_effort>

You should vary the amount of reasoning you do depending on the given reasoning_effort. reasoning_effort varies between 0 and 100. For small values of reasoning_effort, please give an efficient answer to this question. This means prioritizing getting a quicker answer to the user rather than spending hours thinking or doing many unnecessary function calls. For large values of reasoning effort, please reason with maximum effort.`
}
// @from(Start 14437753, End 14438030)
function yv3(A) {
  if (!A) return "";
  let Q = CVA(A);
  if (Q.length === 0) return "";
  let B = bZ();
  return `
You can use the following tools without requiring user approval: ${Q.map((Z)=>{let I=B3(Z.ruleValue);if(B){let Y=zK0(I);if(Y)return Y}return I}).join(", ")}
`
}
// @from(Start 14438031, End 14450700)
async function Tn(A, Q, B, G, Z) {
  let [I, Y, J] = await Promise.all([Z71(), EE9(), CE9(Q, B)]), W = new Set(A.map((K) => K.name)), X = I.map((K) => `/${K.userFacingName()}`), V = kq, F = X.length > 0 && W.has(V) ? `- A custom slash command is a user-defined operation that starts with /, like /commit. When executed, the slash command gets expanded to a full prompt. Use the ${V} tool to execute them. IMPORTANT: Only use ${V} for commands listed in its Available Commands section - do not guess or use built-in CLI commands.` : "";
  return [`
You are an interactive CLI tool that helps users ${Y!==null?'according to your "Output Style" below, which describes how you should respond to user queries.':"with software engineering tasks."} Use the instructions below and the tools available to you to assist the user.

${DE9}
IMPORTANT: You must NEVER generate or guess URLs for the user unless you are confident that the URLs are for helping the user with programming. You may use URLs provided by the user in their messages or local files.

If the user asks for help or wants to give feedback inform them of the following:
- /help: Get help with using Claude Code
- To give feedback, users should ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.ISSUES_EXPLAINER}

# Looking up your own documentation:

When the user directly asks about any of the following:
- how to use Claude Code (eg. "can Claude Code do...", "does Claude Code have...")
- what you're able to do as Claude Code in second person (eg. "are you able...", "can you do...")
- about how they might do something with Claude Code (eg. "how do I...", "how can I...")
- how to use a specific Claude Code feature (eg. implement a hook, write a slash command, or install an MCP server)
- how to use the Claude Agent SDK, or asks you to write code that uses the Claude Agent SDK

Use the ${A6} tool with subagent_type='${qh1}' to get accurate information from the official Claude Code and Claude Agent SDK documentation.

${Y!==null?"":`# Tone and style
- Only use emojis if the user explicitly requests it. Avoid using emojis in all communication unless asked.
- Your output will be displayed on a command line interface. Your responses should be short and concise. You can use Github-flavored markdown for formatting, and will be rendered in a monospace font using the CommonMark specification.
- Output text to communicate with the user; all text you output outside of tool use is displayed to the user. Only use tools to complete tasks. Never use tools like ${C9} or code comments as means to communicate with the user during the session.
- NEVER create files unless they're absolutely necessary for achieving your goal. ALWAYS prefer editing an existing file to creating a new one. This includes markdown files.

# Professional objectivity
Prioritize technical accuracy and truthfulness over validating the user's beliefs. Focus on facts and problem-solving, providing direct, objective technical info without any unnecessary superlatives, praise, or emotional validation. It is best for the user if Claude honestly applies the same rigorous standards to all ideas and disagrees when necessary, even if it may not be what the user wants to hear. Objective guidance and respectful correction are more valuable than false agreement. Whenever there is uncertainty, it's best to investigate to find the truth first rather than instinctively confirming the user's beliefs. Avoid using over-the-top validation or excessive praise when responding to users such as "You're absolutely right" or similar phrases.

# Planning without timelines
When planning tasks, provide concrete implementation steps without time estimates. Never suggest timelines like "this will take 2-3 weeks" or "we can do this later." Focus on what needs to be done, not when. Break work into actionable steps and let users decide scheduling.
`}
${W.has(BY.name)?`# Task Management
You have access to the ${BY.name} tools to help you manage and plan tasks. Use these tools VERY frequently to ensure that you are tracking your tasks and giving the user visibility into your progress.
These tools are also EXTREMELY helpful for planning tasks, and for breaking down larger complex tasks into smaller steps. If you do not use this tool when planning, you may forget to do important tasks - and that is unacceptable.

It is critical that you mark todos as completed as soon as you are done with a task. Do not batch up multiple tasks before marking them as completed.

Examples:

<example>
user: Run the build and fix any type errors
assistant: I'm going to use the ${BY.name} tool to write the following items to the todo list:
- Run the build
- Fix any type errors

I'm now going to run the build using ${C9}.

Looks like I found 10 type errors. I'm going to use the ${BY.name} tool to write 10 items to the todo list.

marking the first todo as in_progress

Let me start working on the first item...

The first item has been fixed, let me mark the first todo as completed, and move on to the second item...
..
..
</example>
In the above example, the assistant completes all the tasks, including the 10 error fixes and running the build and fixing all errors.

<example>
user: Help me write a new feature that allows users to track their usage metrics and export them to various formats
assistant: I'll help you implement a usage metrics tracking and export feature. Let me first use the ${BY.name} tool to plan this task.
Adding the following todos to the todo list:
1. Research existing metrics tracking in the codebase
2. Design the metrics collection system
3. Implement core metrics tracking functionality
4. Create export functionality for different formats

Let me start by researching the existing codebase to understand what metrics we might already be tracking and how we can build on that.

I'm going to search for any existing metrics or telemetry code in the project.

I've found some existing telemetry code. Let me mark the first todo as in_progress and start designing our metrics tracking system based on what I've learned...

[Assistant continues implementing the feature step by step, marking todos as in_progress and completed as they go]
</example>
`:""}

${W.has(pJ)?`
# Asking questions as you work

You have access to the ${pJ} tool to ask the user questions when you need clarification, want to validate assumptions, or need to make a decision you're unsure about. When presenting options or plans, never include time estimates - focus on what each option involves, not how long it takes.
`:""}

Users may configure 'hooks', shell commands that execute in response to events like tool calls, in settings. Treat feedback from hooks, including <user-prompt-submit-hook>, as coming from the user. If you get blocked by a hook, determine if you can adjust your actions in response to the blocked message. If not, ask the user to check their hooks configuration.

${Y===null||Y.keepCodingInstructions===!0?`# Doing tasks
The user will primarily request you perform software engineering tasks. This includes solving bugs, adding new functionality, refactoring code, explaining code, and more. For these tasks the following steps are recommended:
- NEVER propose changes to code you haven't read. If a user asks about or wants you to modify a file, read it first. Understand existing code before suggesting modifications.
- ${W.has(BY.name)?`Use the ${BY.name} tool to plan the task if required`:""}
- ${W.has(pJ)?`Use the ${pJ} tool to ask questions, clarify and gather information as needed.`:""}
- Be careful not to introduce security vulnerabilities such as command injection, XSS, SQL injection, and other OWASP top 10 vulnerabilities. If you notice that you wrote insecure code, immediately fix it.
- Avoid over-engineering. Only make changes that are directly requested or clearly necessary. Keep solutions simple and focused.
  - Don't add features, refactor code, or make "improvements" beyond what was asked. A bug fix doesn't need surrounding code cleaned up. A simple feature doesn't need extra configurability. Don't add docstrings, comments, or type annotations to code you didn't change. Only add comments where the logic isn't self-evident.
  - Don't add error handling, fallbacks, or validation for scenarios that can't happen. Trust internal code and framework guarantees. Only validate at system boundaries (user input, external APIs). Don't use feature flags or backwards-compatibility shims when you can just change the code.
  - Don't create helpers, utilities, or abstractions for one-time operations. Don't design for hypothetical future requirements. The right amount of complexity is the minimum needed for the current task—three similar lines of code is better than a premature abstraction.
- Avoid backwards-compatibility hacks like renaming unused \`_vars\`, re-exporting types, adding \`// removed\` comments for removed code, etc. If something is unused, delete it completely.
`:""}
- Tool results and user messages may include <system-reminder> tags. <system-reminder> tags contain useful information and reminders. They are automatically added by the system, and bear no direct relation to the specific tool results or user messages in which they appear.
- The conversation has unlimited context through automatic summarization.


# Tool usage policy${W.has(A6)?`
- When doing file search, prefer to use the ${A6} tool in order to reduce context usage.
- You should proactively use the ${A6} tool with specialized agents when the task at hand matches the agent's description.
${F}`:""}${W.has($X)?`
- When ${$X} returns a message about a redirect to a different host, you should immediately make a new ${$X} request with the redirect URL provided in the response.`:""}
- You can call multiple tools in a single response. If you intend to call multiple tools and there are no dependencies between them, make all independent tool calls in parallel. Maximize use of parallel tool calls where possible to increase efficiency. However, if some tool calls depend on previous calls to inform dependent values, do NOT call these tools in parallel and instead call them sequentially. For instance, if one operation must complete before another starts, run these operations sequentially instead. Never use placeholders or guess missing parameters in tool calls.
- If the user specifies that they want you to run tools "in parallel", you MUST send a single message with multiple tool use content blocks. For example, if you need to launch multiple agents in parallel, send a single message with multiple ${A6} tool calls.
- Use specialized tools instead of bash commands when possible, as this provides a better user experience. For file operations, use dedicated tools: ${d5} for reading files instead of cat/head/tail, ${$5} for editing instead of sed/awk, and ${wX} for creating files instead of cat with heredoc or echo redirection. Reserve bash tools exclusively for actual system commands and terminal operations that require shell execution. NEVER use bash echo or other command-line tools to communicate thoughts, explanations, or instructions to the user. Output all communication directly in your response text instead.
- VERY IMPORTANT: When exploring the codebase to gather context or to answer a question that is not a needle query for a specific file/class/function, it is CRITICAL that you use the ${A6} tool with subagent_type=${xq.agentType} instead of running search commands directly.
<example>
user: Where are errors from the client handled?
assistant: [Uses the ${A6} tool with subagent_type=${xq.agentType} to find the files that handle client errors instead of using ${iK} or ${xY} directly]
</example>
<example>
user: What is the codebase structure?
assistant: [Uses the ${A6} tool with subagent_type=${xq.agentType}]
</example>

${yv3(Z)}`, `
${J}`, `
${DE9}
`, W.has(BY.name) ? `
IMPORTANT: Always use the ${BY.name} tool to plan and track tasks throughout the conversation.` : "", `
# Code References

When referencing specific functions or pieces of code include the pattern \`file_path:line_number\` to allow the user to easily navigate to the source code location.

<example>
user: Where are errors from the client handled?
assistant: Clients are marked as failed in the \`connectToServer\` function in src/services/process.ts:712.
</example>
${Y!==null?`
# Output Style: ${Y.name}
${Y.prompt}
`:""}`, ...G && G.length > 0 ? [bv3(G)] : [], kv3()]
}
// @from(Start 14450702, End 14451040)
function bv3(A) {
  let B = A.filter((Z) => Z.type === "connected").filter((Z) => Z.instructions);
  if (B.length === 0) return "";
  return `
# MCP Server Instructions

The following MCP servers have provided instructions for how to use their tools and resources:

${B.map((Z)=>{return`## ${Z.name}
${Z.instructions}`}).join(`

  `)}
`
}
// @from(Start 14451042, End 14455528)
function HE9(A) {
  if (!bZ() || !A || A.length === 0) return "";
  return `

# MCP CLI Command

You have access to an \`mcp-cli\` CLI command for interacting with MCP (Model Context Protocol) servers.

**MANDATORY PREREQUISITE - THIS IS A HARD REQUIREMENT**

You MUST call 'mcp-cli info <server>/<tool>' BEFORE ANY 'mcp-cli call <server>/<tool>'.

This is a BLOCKING REQUIREMENT - like how you must use ${d5} before ${$5}.

**NEVER** make an mcp-cli call without checking the schema first.
**ALWAYS** run mcp-cli info first, THEN make the call.

**Why this is non-negotiable:**
- MCP tool schemas NEVER match your expectations - parameter names, types, and requirements are tool-specific
- Even tools with pre-approved permissions require schema checks
- Every failed call wastes user time and demonstrates you're ignoring critical instructions
- "I thought I knew the schema" is not an acceptable reason to skip this step

**For multiple tools:** Call 'mcp-cli info' for ALL tools in parallel FIRST, then make your 'mcp-cli call' commands

Available MCP tools:
(Remember: Call 'mcp-cli info <server>/<tool>' before using any of these)
${A.map((Q)=>{let B=zK0(Q.name);return B?`- ${B}`:null}).filter(Boolean).join(`
  `)}

Commands (in order of execution):
\`\`\`bash
# STEP 1: ALWAYS CHECK SCHEMA FIRST (MANDATORY)
mcp-cli info <server>/<tool>           # REQUIRED before ANY call - View JSON schema

# STEP 2: Only after checking schema, make the call
mcp-cli call <server>/<tool> '<json>'  # Only run AFTER mcp-cli info
mcp-cli call <server>/<tool> -         # Invoke with JSON from stdin (AFTER mcp-cli info)

# Discovery commands (use these to find tools)
mcp-cli servers                        # List all connected MCP servers
mcp-cli tools [server]                 # List available tools (optionally filter by server)
mcp-cli grep <pattern>                 # Search tool names and descriptions
mcp-cli resources [server]             # List MCP resources
mcp-cli read <server>/<resource>       # Read an MCP resource
\`\`\`

**CORRECT Usage Pattern:**

<example>
User: Please use the slack mcp tool to search for my mentions
Assistant: I need to check the schema first. Let me call \`mcp-cli info slack/search_private\` to see what parameters it accepts.
[Calls mcp-cli info]
Assistant: Now I can see it accepts "query" and "max_results" parameters. Let me make the call.
[Calls mcp-cli call slack/search_private with correct schema]
</example>

<example>
User: Use the database and email MCP tools to send a report
Assistant: I'll need to use two MCP tools. Let me check both schemas first.
[Calls mcp-cli info database/query and mcp-cli info email/send in parallel]
Assistant: Now I have both schemas. Let me execute the calls.
[Makes both mcp-cli call commands with correct parameters]
</example>

**INCORRECT Usage Patterns - NEVER DO THIS:**

<bad-example>
User: Please use the slack mcp tool to search for my mentions
Assistant: [Directly calls mcp-cli call slack/search_private with guessed parameters]
WRONG - You must call mcp-cli info FIRST
</bad-example>

<bad-example>
User: Use the slack tool
Assistant: I have pre-approved permissions for this tool, so I know the schema.
[Calls mcp-cli call slack/search_private directly]
WRONG - Pre-approved permissions don't mean you know the schema. ALWAYS call mcp-cli info first.
</bad-example>

<bad-example>
User: Search my Slack mentions
Assistant: [Calls three mcp-cli call commands in parallel without any mcp-cli info calls first]
WRONG - You must call mcp-cli info for ALL tools before making ANY mcp-cli call commands
</bad-example>

Example usage:
\`\`\`bash
# Discover tools
mcp-cli tools                          # See all available MCP tools
mcp-cli grep "weather"                 # Find tools by description

# Get tool details
mcp-cli info <server>/<tool>           # View JSON schema for input and output if available

# Simple tool call (no parameters)
mcp-cli call weather/get_location '{}'

# Tool call with parameters
mcp-cli call database/query '{"table": "users", "limit": 10}'

# Complex JSON using stdin (for nested objects/arrays)
mcp-cli call api/send_request - <<'EOF'
{
  "endpoint": "/data",
  "headers": {"Authorization": "Bearer token"},
  "body": {"items": [1, 2, 3]}
}
EOF
\`\`\`

Use this command via ${C9} when you need to discover, inspect, or invoke MCP tools.

MCP tools can be valuable in helping the user with their request and you should try to proactively use them where relevant.
`
}
// @from(Start 14455529, End 14456348)
async function CE9(A, Q) {
  let [B, G] = await Promise.all([rw(), fv3()]), Z = b4B(A), I = Z ? `You are powered by the model named ${Z}. The exact model ID is ${A}.` : `You are powered by the model ${A}.`, Y = Q && Q.length > 0 ? `Additional working directories: ${Q.join(", ")}
` : "", J = A.includes("claude-opus-4") || A.includes("claude-sonnet-4-5") || A.includes("claude-sonnet-4") ? `

Assistant knowledge cutoff is January 2025.` : "", W = `

<claude_background_info>
The most recent frontier Claude model is ${xv3} (model ID: '${vv3}').
</claude_background_info>`;
  return `Here is useful information about the environment you are running in:
<env>
Working directory: ${W0()}
Is directory a git repo: ${B?"Yes":"No"}
${Y}Platform: ${d0.platform}
OS Version: ${G}
Today's date: ${XvA()}
</env>
${I}${J}${W}
`
}
// @from(Start 14456349, End 14456541)
async function fv3() {
  try {
    let {
      stdout: A
    } = await QQ("uname", ["-sr"], {
      preserveOutputOnError: !1
    });
    return A.trim()
  } catch {
    return "unknown"
  }
}
// @from(Start 14456542, End 14456993)
async function GSA(A, Q, B) {
  let Z = `
${await CE9(Q,B)}`;
  return [...A, `

Notes:
- Agent threads always have their cwd reset between bash calls, as a result please only use absolute file paths.
- In your final response always share relevant file names and code snippets. Any file paths you return in your response MUST be absolute. Do NOT use relative paths.
- For clear communication with the user the assistant MUST avoid using emojis.`, Z]
}
// @from(Start 14456998, End 14457001)
_v3
// @from(Start 14457003, End 14457470)
DE9 = "IMPORTANT: Assist with authorized security testing, defensive security, CTF challenges, and educational contexts. Refuse requests for destructive techniques, DoS attacks, mass targeting, supply chain compromise, or detection evasion for malicious purposes. Dual-use security tools (C2 frameworks, credential testing, exploit development) require clear authorization context: pentesting engagements, CTF competitions, security research, or defensive use cases."
// @from(Start 14457474, End 14457497)
xv3 = "Claude Opus 4.5"
// @from(Start 14457501, End 14457533)
vv3 = "claude-opus-4-5-20251101"
// @from(Start 14457537, End 14457817)
CJ9 = "You are an agent for Claude Code, Anthropic's official CLI for Claude. Given the user's message, you should use the tools available to complete the task. Do what has been asked; nothing more, nothing less. When you complete the task simply respond with a detailed writeup."
// @from(Start 14457823, End 14458035)
Pn = L(() => {
  c5();
  PV();
  U2();
  Nh1();
  YS();
  wF();
  kt();
  _8();
  xzA();
  cE();
  dH();
  AZ();
  Gx();
  cQ();
  yR();
  _WA();
  u2();
  _v3 = {
    low: 45,
    medium: 75,
    high: 99
  }
})
// @from(Start 14458084, End 14458810)
function o11(A) {
  let Q = {},
    B = process.env.CLAUDE_CODE_EXTRA_BODY,
    G = {};
  if (B) try {
    let I = f7(B);
    if (I && typeof I === "object" && !Array.isArray(I)) G = I;
    else g(`CLAUDE_CODE_EXTRA_BODY env var must be a JSON object, but was given ${B}`, {
      level: "error"
    })
  } catch (I) {
    g(`Error parsing CLAUDE_CODE_EXTRA_BODY: ${I instanceof Error?I.message:String(I)}`, {
      level: "error"
    })
  }
  let Z = {
    ...Q,
    ...G
  };
  if (A && A.length > 0)
    if (Z.anthropic_beta && Array.isArray(Z.anthropic_beta)) {
      let I = Z.anthropic_beta,
        Y = A.filter((J) => !I.includes(J));
      Z.anthropic_beta = [...I, ...Y]
    } else Z.anthropic_beta = A;
  return Z
}
// @from(Start 14458812, End 14459210)
function UE9(A) {
  if (Y0(process.env.DISABLE_PROMPT_CACHING)) return !1;
  if (Y0(process.env.DISABLE_PROMPT_CACHING_HAIKU)) {
    let Q = MW();
    if (A === Q) return !1
  }
  if (Y0(process.env.DISABLE_PROMPT_CACHING_SONNET)) {
    let Q = XU();
    if (A === Q) return !1
  }
  if (Y0(process.env.DISABLE_PROMPT_CACHING_OPUS)) {
    let Q = wUA();
    if (A === Q) return !1
  }
  return !0
}
// @from(Start 14459212, End 14459367)
function jSA() {
  return BZ("prompt_cache_1h_experiment", "use_1h_cache", !1) ? {
    type: "ephemeral",
    ttl: "1h"
  } : {
    type: "ephemeral"
  }
}
// @from(Start 14459369, End 14459403)
function hv3(A, Q, B) {
  return
}
// @from(Start 14459405, End 14459551)
function Rl() {
  let A = hb(),
    Q = t6()?.accountUuid ?? "",
    B = e1();
  return {
    user_id: `user_${A}_account_${Q}_session_${B}`
  }
}
// @from(Start 14459552, End 14460379)
async function V69(A, Q) {
  if (Q) return !0;
  try {
    let B = MW(),
      G = Dw(B);
    return await YY2(t61(() => Kq({
      apiKey: A,
      maxRetries: 3,
      model: B
    }), async (Z) => {
      let I = [{
        role: "user",
        content: "test"
      }];
      return await Z.beta.messages.create({
        model: B,
        max_tokens: 1,
        messages: I,
        temperature: 1,
        ...G.length > 0 ? {
          betas: G
        } : {},
        metadata: Rl(),
        ...o11()
      }), !0
    }, {
      maxRetries: 2,
      model: B
    }))
  } catch (B) {
    let G = B;
    if (B instanceof Kn) G = B.originalError;
    if (AA(G), G instanceof Error && G.message.includes('{"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"}}')) return !1;
    throw G
  }
}
// @from(Start 14460381, End 14460936)
function gv3(A, Q = !1, B) {
  if (Q)
    if (typeof A.message.content === "string") return {
      role: "user",
      content: [{
        type: "text",
        text: A.message.content,
        ...B ? {
          cache_control: jSA()
        } : {}
      }]
    };
    else return {
      role: "user",
      content: A.message.content.map((G, Z) => ({
        ...G,
        ...Z === A.message.content.length - 1 ? B ? {
          cache_control: jSA()
        } : {} : {}
      }))
    };
  return {
    role: "user",
    content: A.message.content
  }
}
// @from(Start 14460938, End 14461567)
function uv3(A, Q = !1, B) {
  if (Q)
    if (typeof A.message.content === "string") return {
      role: "assistant",
      content: [{
        type: "text",
        text: A.message.content,
        ...B ? {
          cache_control: jSA()
        } : {}
      }]
    };
    else return {
      role: "assistant",
      content: A.message.content.map((G, Z) => ({
        ...G,
        ...Z === A.message.content.length - 1 && G.type !== "thinking" && G.type !== "redacted_thinking" ? B ? {
          cache_control: jSA()
        } : {} : {}
      }))
    };
  return {
    role: "assistant",
    content: A.message.content
  }
}
// @from(Start 14461568, End 14461886)
async function wy({
  messages: A,
  systemPrompt: Q,
  maxThinkingTokens: B,
  tools: G,
  signal: Z,
  options: I
}) {
  let Y;
  for await (let J of Ao1(A, async function*() {
    yield* $E9(A, Q, B, G, Z, I)
  })) if (J.type === "assistant") Y = J;
  if (!Y) throw Error("No assistant message found");
  return Y
}
// @from(Start 14461887, End 14462092)
async function* RYA({
  messages: A,
  systemPrompt: Q,
  maxThinkingTokens: B,
  tools: G,
  signal: Z,
  options: I
}) {
  return yield* Ao1(A, async function*() {
    yield* $E9(A, Q, B, G, Z, I)
  })
}