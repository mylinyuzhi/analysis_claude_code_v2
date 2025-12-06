
// @from(Start 14810102, End 14810460)
async function Iu3(A, Q, B) {
  if (!EG()) return "Code rewinding is not enabled for the SDK.";
  if (!c91(Q.fileHistory, A)) return `No code checkpoint found for message ${A}`;
  try {
    await iMA((G) => B((Z) => ({
      ...Z,
      fileHistory: G(Z.fileHistory)
    })), A)
  } catch (G) {
    return `Failed to rewind code: ${G.message}`
  }
  return
}
// @from(Start 14810462, End 14810983)
function Yu3(A, Q, B, G) {
  if (A.mode === "bypassPermissions" && kE9()) return G.enqueue({
    type: "control_response",
    response: {
      subtype: "error",
      request_id: Q,
      error: "Cannot set permission mode to bypassPermissions because it is disabled by settings or configuration"
    }
  }), B;
  return G.enqueue({
    type: "control_response",
    response: {
      subtype: "success",
      request_id: Q,
      response: {
        mode: A.mode
      }
    }
  }), {
    ...B,
    mode: A.mode
  }
}
// @from(Start 14810984, End 14813105)
async function Ju3(A, Q) {
  if (Q.continue) try {
    GA("tengu_continue_print", {});
    let B = await ki(void 0, void 0);
    if (B) {
      if (!Q.forkSession) {
        if (B.sessionId) zR(B.sessionId), await Fx()
      }
      return Ow9(B.fileHistorySnapshots, A), B.messages
    }
  } catch (B) {
    return AA(B instanceof Error ? B : Error(String(B))), l5(1), []
  }
  if (Q.teleport) try {
    GA("tengu_teleport_print", {});
    let B = typeof Q.teleport === "string" ? Q.teleport : null;
    await c61();
    let G = await xRA(B);
    return (await kRA(Pg(G.log), G.branch)).messages
  } catch (B) {
    return AA(B instanceof Error ? B : Error(String(B))), l5(1), []
  }
  if (Q.resume) try {
    GA("tengu_resume_print", {});
    let B = ww9(typeof Q.resume === "string" ? Q.resume : "");
    if (!B) {
      if (process.stderr.write(`Error: --resume requires a valid session ID when used with --print
`), process.stderr.write(`Usage: claude -p --resume <session-id>
`), typeof Q.resume === "string") process.stderr.write(`Session IDs must be in UUID format (e.g., 550e8400-e29b-41d4-a716-446655440000)
`), process.stderr.write(`Provided value "${Q.resume}" is not a valid UUID
`);
      return l5(1), []
    }
    if (B.isUrl && B.ingressUrl) await oE9(B.sessionId, B.ingressUrl);
    let G = await ki(B.sessionId, B.jsonlFile || void 0);
    if (!G)
      if (B.isUrl) return await wq("startup");
      else return process.stderr.write(`No conversation found with session ID: ${B.sessionId}
`), l5(1), [];
    if (Q.resumeSessionAt) {
      let Z = G.messages.findIndex((I) => I.uuid === Q.resumeSessionAt);
      if (Z < 0) return process.stderr.write(`No message found with message.uuid of: ${Q.resumeSessionAt}
`), l5(1), [];
      G.messages = Z >= 0 ? G.messages.slice(0, Z + 1) : []
    }
    if (!Q.forkSession && G.sessionId) zR(G.sessionId), await Fx();
    return Ow9(G.fileHistorySnapshots, A), G.messages
  } catch (B) {
    return AA(B instanceof Error ? B : Error(String(B))), process.stderr.write(`Failed to resume session with --print mode
`), l5(1), []
  }
  return await wq("startup")
}
// @from(Start 14813107, End 14813502)
function Wu3(A, Q) {
  let B;
  if (typeof A === "string")
    if (A.trim() !== "") B = LQ0([JSON.stringify({
      type: "user",
      session_id: "",
      message: {
        role: "user",
        content: A
      },
      parent_tool_use_id: null
    })]);
    else B = LQ0([]);
  else B = A;
  return Q.sdkUrl ? new RD0(Q.sdkUrl, B, Q.replayUserMessages) : new aSA(B, Q.replayUserMessages)
}
// @from(Start 14813503, End 14814120)
async function Xu3({
  message: A,
  setAppState: Q,
  onEnqueued: B
}) {
  if (A.response.subtype === "success" && A.response.response?.toolUseID && typeof A.response.response.toolUseID === "string") {
    let G = A.response.response,
      {
        toolUseID: Z
      } = G;
    if (!Z) return !1;
    let I = await Gz9(Z);
    if (I) return Q((Y) => ({
      ...Y,
      queuedCommands: [...Y.queuedCommands, {
        mode: "orphaned-permission",
        value: [],
        orphanedPermission: {
          permissionResult: G,
          assistantMessage: I
        }
      }]
    })), B?.(), !0
  }
  return !1
}
// @from(Start 14814122, End 14814231)
function Ow9(A, Q) {
  if (A && A.length > 0) xYA(A, (B) => Q((G) => ({
    ...G,
    fileHistory: B
  })))
}
// @from(Start 14814236, End 14814239)
Mw9
// @from(Start 14814245, End 14814618)
Tw9 = L(() => {
  MD0();
  Ew9();
  q0();
  V0();
  fP();
  RQA();
  g1();
  qV0();
  cjA();
  vYA();
  Sy();
  _i();
  XX0();
  kW();
  Uw9();
  E9A();
  $0A();
  AZ();
  LF();
  ND0();
  OZ();
  k1A();
  Gx();
  MB();
  tJA();
  gB();
  _0();
  eXA();
  qw9();
  S7();
  Ok();
  Lw9();
  dH();
  hYA();
  XJ1();
  QjA();
  t2();
  _0();
  sU();
  $J();
  Mw9 = new Set
})
// @from(Start 14814620, End 14827043)
async function jw9() {
  GA("tengu_update_check", {}), L9(`Current version: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.VERSION}
`), L9(`Checking for updates...
`), g("update: Starting update check"), g("update: Running diagnostic");
  let A = await YIA();
  if (g(`update: Installation type: ${A.installationType}`), g(`update: Config install method: ${A.configInstallMethod}`), A.multipleInstallations.length > 1) {
    L9(`
`), L9(tA.yellow("Warning: Multiple installations found") + `
`);
    for (let J of A.multipleInstallations) {
      let W = A.installationType === J.type ? " (currently running)" : "";
      L9(`- ${J.type} at ${J.path}${W}
`)
    }
  }
  if (A.warnings.length > 0) {
    L9(`
`);
    for (let J of A.warnings) g(`update: Warning detected: ${J.issue}`), g(`update: Showing warning: ${J.issue}`), L9(tA.yellow(`Warning: ${J.issue}
`)), L9(tA.bold(`Fix: ${J.fix}
`))
  }
  let Q = N1();
  if (!Q.installMethod && A.installationType !== "package-manager") {
    L9(`
`), L9(`Updating configuration to track installation method...
`);
    let J = "unknown";
    switch (A.installationType) {
      case "npm-local":
        J = "local";
        break;
      case "native":
        J = "native";
        break;
      case "npm-global":
        J = "global";
        break;
      default:
        J = "unknown"
    }
    c0({
      ...Q,
      installMethod: J
    }), L9(`Installation method set to: ${J}
`)
  }
  if (A.installationType === "development") L9(`
`), L9(tA.yellow("Warning: Cannot update development build") + `
`), await v6(1);
  if (A.installationType === "package-manager") {
    let J = IIA();
    if (L9(`
`), J === "homebrew") {
      L9(`Claude is managed by Homebrew.
`);
      let W = await bAA();
      if (W && !Pw9.gte({
          ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
          PACKAGE_URL: "@anthropic-ai/claude-code",
          README_URL: "https://code.claude.com/docs/en/overview",
          VERSION: "2.0.59",
          FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
        }.VERSION, W, {
          loose: !0
        })) L9(`Update available: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.VERSION} → ${W}
`), L9(`
`), L9(`To update, run:
`), L9(tA.bold("  brew upgrade claude-code") + `
`);
      else L9(`Claude is up to date!
`)
    } else L9(`Claude is managed by a package manager.
`), L9(`Please use your package manager to update.
`);
    await v6(0)
  }
  if (Q.installMethod && A.configInstallMethod !== "not set" && A.installationType !== "package-manager") {
    let {
      installationType: J,
      configInstallMethod: W
    } = A, V = {
      "npm-local": "local",
      "npm-global": "global",
      native: "native",
      development: "development",
      unknown: "unknown"
    } [J] || J;
    if (V !== W && W !== "unknown") L9(`
`), L9(tA.yellow("Warning: Configuration mismatch") + `
`), L9(`Config expects: ${W} installation
`), L9(`Currently running: ${J}
`), L9(tA.yellow(`Updating the ${J} installation you are currently using`) + `
`), c0({
      ...Q,
      installMethod: V
    }), L9(`Config updated to reflect current installation method: ${V}
`)
  }
  if (A.installationType === "native") {
    g("update: Detected native installation, using native updater");
    try {
      let J = await Wg();
      if (J.lockFailed) L9(tA.yellow("Another process is currently updating Claude. Please try again in a moment.") + `
`), await v6(0);
      if (!J.latestVersion) process.stderr.write(`Failed to check for updates
`), await v6(1);
      if (J.latestVersion === {
          ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
          PACKAGE_URL: "@anthropic-ai/claude-code",
          README_URL: "https://code.claude.com/docs/en/overview",
          VERSION: "2.0.59",
          FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
        }.VERSION) L9(tA.green(`Claude Code is up to date (${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.VERSION})`) + `
`);
      else if (J.wasUpdated) L9(tA.green(`Successfully updated from ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.VERSION} to version ${J.latestVersion}`) + `
`);
      else L9(tA.green(`Claude Code is up to date (${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.VERSION})`) + `
`);
      await v6(0)
    } catch (J) {
      process.stderr.write(`Error: Failed to install native update
`), process.stderr.write(String(J) + `
`), process.stderr.write(`Try running "claude doctor" for diagnostics
`), await v6(1)
    }
  }
  if (Q.installMethod !== "native") aTA();
  g("update: Checking npm registry for latest version"), g(`update: Package URL: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.PACKAGE_URL}`);
  let B = `npm view ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.PACKAGE_URL}@latest version`;
  g(`update: Running: ${B}`);
  let G = await bAA();
  if (g(`update: Latest version from npm: ${G||"FAILED"}`), !G) {
    if (g("update: Failed to get latest version from npm registry"), process.stderr.write(tA.red("Failed to check for updates") + `
`), process.stderr.write(`Unable to fetch latest version from npm registry
`), process.stderr.write(`
`), process.stderr.write(`Possible causes:
`), process.stderr.write(`  • Network connectivity issues
`), process.stderr.write(`  • npm registry is unreachable
`), process.stderr.write(`  • Corporate proxy/firewall blocking npm
`), {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.0.59",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
      }.PACKAGE_URL && !{
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.0.59",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
      }.PACKAGE_URL.startsWith("@anthropic")) process.stderr.write(`  • Internal/development build not published to npm
`);
    process.stderr.write(`
`), process.stderr.write(`Try:
`), process.stderr.write(`  • Check your internet connection
`), process.stderr.write(`  • Run with --debug flag for more details
`);
    let J = {
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.0.59",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
    }.PACKAGE_URL || "@anthropic-ai/claude-code";
    process.stderr.write(`  • Manually check: npm view ${J} version
`), process.stderr.write(`  • Check if you need to login: npm whoami
`), await v6(1)
  }
  if (G === {
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.0.59",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
    }.VERSION) L9(tA.green(`Claude Code is up to date (${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.VERSION})`) + `
`), await v6(0);
  L9(`New version available: ${G} (current: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.VERSION})
`), L9(`Installing update...
`);
  let Z = !1,
    I = "";
  switch (A.installationType) {
    case "npm-local":
      Z = !0, I = "local";
      break;
    case "npm-global":
      Z = !1, I = "global";
      break;
    case "unknown": {
      let J = bl();
      Z = J, I = J ? "local" : "global", L9(tA.yellow("Warning: Could not determine installation type") + `
`), L9(`Attempting ${I} update based on file detection...
`);
      break
    }
    default:
      process.stderr.write(`Error: Cannot update ${A.installationType} installation
`), await v6(1)
  }
  L9(`Using ${I} installation update method...
`), g(`update: Update method determined: ${I}`), g(`update: useLocalUpdate: ${Z}`);
  let Y;
  if (Z) g("update: Calling installOrUpdateClaudePackage() for local update"), Y = await lNA();
  else g("update: Calling installGlobalPackage() for global update"), Y = await nNA();
  switch (g(`update: Installation status: ${Y}`), Y) {
    case "success":
      L9(tA.green(`Successfully updated from ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.VERSION} to version ${G}`) + `
`);
      break;
    case "no_permissions":
      if (process.stderr.write(`Error: Insufficient permissions to install update
`), Z) process.stderr.write(`Try manually updating with:
`), process.stderr.write(`  cd ~/.claude/local && npm update ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.PACKAGE_URL}
`);
      else process.stderr.write(`Try running with sudo or fix npm permissions
`), process.stderr.write(`Or consider using native installation with: claude install
`);
      await v6(1);
      break;
    case "install_failed":
      if (process.stderr.write(`Error: Failed to install update
`), Z) process.stderr.write(`Try manually updating with:
`), process.stderr.write(`  cd ~/.claude/local && npm update ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.PACKAGE_URL}
`);
      else process.stderr.write(`Or consider using native installation with: claude install
`);
      await v6(1);
      break;
    case "in_progress":
      process.stderr.write(`Error: Another instance is currently performing an update
`), process.stderr.write(`Please wait and try again later
`), await v6(1);
      break
  }
  await v6(0)
}
// @from(Start 14827048, End 14827051)
Pw9
// @from(Start 14827057, End 14827178)
Sw9 = L(() => {
  q0();
  ZIA();
  w01();
  jQ();
  xAA();
  uy();
  Zh();
  F9();
  V0();
  kW();
  Pw9 = BA(KU(), 1)
})
// @from(Start 14827268, End 14827443)
function Ku3() {
  let A = d0.platform === "win32",
    Q = Vu3();
  if (A) return Fu3(Q, ".local", "bin", "claude.exe").replace(/\//g, "\\");
  return "~/.local/bin/claude"
}
// @from(Start 14827445, End 14827886)
function _w9({
  messages: A
}) {
  if (A.length === 0) return null;
  return x8.default.createElement(S, {
    flexDirection: "column",
    gap: 0,
    marginBottom: 1
  }, x8.default.createElement(S, null, x8.default.createElement($, {
    color: "warning"
  }, H1.warning, " Setup notes:")), A.map((Q, B) => x8.default.createElement(S, {
    key: B,
    marginLeft: 2
  }, x8.default.createElement($, {
    dimColor: !0
  }, "• ", Q))))
}
// @from(Start 14827888, End 14833152)
function Du3({
  onDone: A,
  force: Q,
  target: B
}) {
  let [G, Z] = x8.useState({
    type: "checking"
  });
  return x8.useEffect(() => {
    async function I() {
      try {
        g(`Install: Starting installation process (force=${Q}, target=${B})`), Z({
          type: "installing",
          version: B || "stable"
        }), g(`Install: Calling installLatest(force=true, target=${B}, forceReinstall=${Q})`);
        let J = await Wg(!0, B, Q);
        if (g(`Install: installLatest returned version=${J.latestVersion}, wasUpdated=${J.wasUpdated}, lockFailed=${J.lockFailed}`), J.lockFailed) throw Error("Could not install - another process is currently installing Claude. Please try again in a moment.");
        if (!J.latestVersion) g("Install: Failed to retrieve version information during install", {
          level: "error"
        });
        if (!J.wasUpdated) g("Install: Already up to date");
        Z({
          type: "setting-up"
        });
        let W = await gy(!0);
        if (g(`Install: Setup launcher completed with ${W.length} messages`), W.length > 0) W.forEach((H) => g(`Install: Setup message: ${H.message}`));
        g("Install: Cleaning up npm installations after successful install");
        let {
          removed: X,
          errors: V,
          warnings: F
        } = await rTA();
        if (X > 0) g(`Cleaned up ${X} npm installation(s)`);
        if (V.length > 0) g(`Cleanup errors: ${V.join(", ")}`);
        let K = sTA();
        if (K.length > 0) g(`Shell alias cleanup: ${K.map((H)=>H.message).join("; ")}`);
        GA("tengu_claude_install_command", {
          has_version: J.latestVersion ? 1 : 0,
          forced: Q ? 1 : 0
        });
        let D = [...F, ...K.map((H) => H.message)];
        if (W.length > 0) Z({
          type: "set-up",
          messages: W.map((H) => H.message)
        }), setTimeout(() => {
          Z({
            type: "success",
            version: J.latestVersion || "current",
            setupMessages: [...W.map((H) => H.message), ...D]
          })
        }, 2000);
        else g("Install: Shell PATH already configured"), Z({
          type: "success",
          version: J.latestVersion || "current",
          setupMessages: D.length > 0 ? D : void 0
        })
      } catch (Y) {
        g(`Install command failed: ${Y}`, {
          level: "error"
        }), Z({
          type: "error",
          message: Y instanceof Error ? Y.message : String(Y)
        })
      }
    }
    I()
  }, [Q, B]), x8.useEffect(() => {
    if (G.type === "success") setTimeout(() => {
      A("Claude Code installation completed successfully", {
        display: "system"
      })
    }, 2000);
    else if (G.type === "error") setTimeout(() => {
      A("Claude Code installation failed", {
        display: "system"
      })
    }, 3000)
  }, [G, A]), x8.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, G.type === "checking" && x8.default.createElement($, {
    color: "claude"
  }, "Checking installation status..."), G.type === "cleaning-npm" && x8.default.createElement($, {
    color: "warning"
  }, "Cleaning up old npm installations..."), G.type === "installing" && x8.default.createElement($, {
    color: "claude"
  }, "Installing Claude Code native build ", G.version, "..."), G.type === "setting-up" && x8.default.createElement($, {
    color: "claude"
  }, "Setting up launcher and shell integration..."), G.type === "set-up" && x8.default.createElement(_w9, {
    messages: G.messages
  }), G.type === "success" && x8.default.createElement(S, {
    flexDirection: "column",
    gap: 1
  }, x8.default.createElement(S, null, x8.default.createElement($, {
    color: "success"
  }, H1.tick, " "), x8.default.createElement($, {
    color: "success",
    bold: !0
  }, "Claude Code successfully installed!")), x8.default.createElement(S, {
    marginLeft: 2,
    flexDirection: "column",
    gap: 1
  }, G.version !== "current" && x8.default.createElement(S, null, x8.default.createElement($, {
    dimColor: !0
  }, "Version: "), x8.default.createElement($, {
    color: "claude"
  }, G.version)), x8.default.createElement(S, null, x8.default.createElement($, {
    dimColor: !0
  }, "Location: "), x8.default.createElement($, {
    color: "text"
  }, Ku3()))), x8.default.createElement(S, {
    marginLeft: 2,
    flexDirection: "column",
    gap: 1
  }, x8.default.createElement(S, {
    marginTop: 1
  }, x8.default.createElement($, {
    dimColor: !0
  }, "Next: Run "), x8.default.createElement($, {
    color: "claude",
    bold: !0
  }, "claude --help"), x8.default.createElement($, {
    dimColor: !0
  }, " to get started"))), G.setupMessages && x8.default.createElement(_w9, {
    messages: G.setupMessages
  })), G.type === "error" && x8.default.createElement(S, {
    flexDirection: "column",
    gap: 1
  }, x8.default.createElement(S, null, x8.default.createElement($, {
    color: "error"
  }, H1.cross, " "), x8.default.createElement($, {
    color: "error"
  }, "Installation failed")), x8.default.createElement($, {
    color: "error"
  }, G.message), x8.default.createElement(S, {
    marginTop: 1
  }, x8.default.createElement($, {
    dimColor: !0
  }, "Try running with --force to override checks"))))
}
// @from(Start 14833157, End 14833159)
x8
// @from(Start 14833161, End 14833164)
kw9
// @from(Start 14833170, End 14833732)
yw9 = L(() => {
  hA();
  hA();
  uy();
  V0();
  q0();
  V9();
  c5();
  x8 = BA(VA(), 1);
  kw9 = {
    type: "local-jsx",
    name: "install",
    description: "Install Claude Code native build",
    argumentHint: "[options]",
    async call(A, Q, B) {
      let G = B.includes("--force"),
        I = B.filter((J) => !J.startsWith("--"))[0],
        {
          unmount: Y
        } = await VG(x8.default.createElement(Du3, {
          onDone: (J, W) => {
            Y(), A(J, W)
          },
          force: G,
          target: I
        }))
    }
  }
})
// @from(Start 14833735, End 14835315)
function xw9({
  targetRepo: A,
  initialPaths: Q,
  onSelectPath: B,
  onCancel: G
}) {
  let [Z, I] = rW.useState(Q), [Y, J] = rW.useState(null), [W, X] = rW.useState(!1), V = rW.useCallback(async (K) => {
    if (K === "cancel") {
      G();
      return
    }
    if (X(!0), J(null), await XU9(K, A)) {
      B(K);
      return
    }
    VU9(A, K);
    let H = Z.filter((C) => C !== K);
    I(H), X(!1), J(`${Q5(K)} no longer contains the correct repository. Select another path.`)
  }, [A, Z, B, G]), F = [...Z.map((K) => ({
    label: `Use ${tA.bold(Q5(K))}`,
    value: K
  })), {
    label: "Cancel",
    value: "cancel"
  }];
  return rW.default.createElement(hD, {
    title: "Teleport to Repo",
    onCancel: G,
    color: "background",
    borderDimColor: !0
  }, Z.length > 0 ? rW.default.createElement(rW.default.Fragment, null, rW.default.createElement(S, {
    flexDirection: "column",
    gap: 1
  }, Y && rW.default.createElement($, {
    color: "error"
  }, Y), rW.default.createElement($, null, "Open Claude Code in ", rW.default.createElement($, {
    bold: !0
  }, A), ":")), W ? rW.default.createElement(S, null, rW.default.createElement(g4, null), rW.default.createElement($, null, " Validating repository…")) : rW.default.createElement(M0, {
    options: F,
    onChange: (K) => void V(K),
    onCancel: G
  })) : rW.default.createElement(S, {
    flexDirection: "column",
    gap: 1
  }, Y && rW.default.createElement($, {
    color: "error"
  }, Y), rW.default.createElement($, {
    dimColor: !0
  }, "Run claude --teleport from a checkout of ", A)))
}
// @from(Start 14835320, End 14835322)
rW
// @from(Start 14835328, End 14835422)
vw9 = L(() => {
  hA();
  Mi();
  J5();
  DY();
  R9();
  nJ1();
  F9();
  rW = BA(VA(), 1)
})
// @from(Start 14835425, End 14839577)
function fw9({
  onSelect: A,
  onCancel: Q,
  isEmbedded: B = !1
}) {
  let {
    rows: G
  } = WB(), [Z, I] = K4.useState([]), [Y, J] = K4.useState(null), [W, X] = K4.useState(!0), [V, F] = K4.useState(null), [K, D] = K4.useState(!1), [H, C] = K4.useState(!1), E = K4.useCallback(async () => {
    try {
      X(!0), F(null);
      let v = await DO();
      J(v), g(`Current repository: ${v||"not detected"}`);
      let x = await QP2(),
        p = x;
      if (v) p = x.filter((e) => {
        if (!e.repo) return !1;
        return `${e.repo.owner.login}/${e.repo.name}` === v
      }), g(`Filtered ${p.length} sessions for repo ${v} from ${x.length} total`);
      let u = [...p].sort((e, l) => {
        let k = new Date(e.updated_at);
        return new Date(l.updated_at).getTime() - k.getTime()
      });
      I(u)
    } catch (v) {
      let x = v instanceof Error ? v.message : String(v);
      g(`Error loading code sessions: ${x}`), F(Cu3(x))
    } finally {
      X(!1), D(!1)
    }
  }, []), U = () => {
    D(!0), E()
  };
  f1((v, x) => {
    if (x.escape || x.ctrl && v === "c") {
      Q();
      return
    }
    if (x.ctrl && v === "r" && V) {
      U();
      return
    }
    if (V !== null && x.return) {
      Q();
      return
    }
  });
  let q = K4.useCallback(() => {
    C(!0), E()
  }, [C, E]);
  if (!H) return K4.default.createElement(m61, {
    onComplete: q
  });
  if (W) return K4.default.createElement(S, {
    flexDirection: "column",
    padding: 1
  }, K4.default.createElement(S, {
    flexDirection: "row"
  }, K4.default.createElement(g4, null), K4.default.createElement($, {
    bold: !0
  }, "Loading Claude Code sessions…")), K4.default.createElement($, {
    dimColor: !0
  }, K ? "Retrying…" : "Fetching your Claude Code sessions…"));
  if (V) return K4.default.createElement(S, {
    flexDirection: "column",
    padding: 1
  }, K4.default.createElement($, {
    bold: !0,
    color: "error"
  }, "Error loading Claude Code sessions"), Eu3(V), K4.default.createElement($, {
    dimColor: !0
  }, "Press ", K4.default.createElement($, {
    bold: !0
  }, "Ctrl+R"), " to retry · Press ", K4.default.createElement($, {
    bold: !0
  }, "Esc"), " ", "to cancel"));
  if (Z.length === 0) return K4.default.createElement(S, {
    flexDirection: "column",
    padding: 1
  }, K4.default.createElement($, {
    bold: !0
  }, "No Claude Code sessions found", Y && K4.default.createElement($, null, " for ", Y)), K4.default.createElement(S, {
    marginTop: 1
  }, K4.default.createElement($, {
    dimColor: !0
  }, "Press ", K4.default.createElement($, {
    bold: !0
  }, "Esc"), " to cancel")));
  let w = Z.map((v) => ({
      ...v,
      timeString: yiA(new Date(v.updated_at))
    })),
    N = Math.max(bw9.length, ...w.map((v) => v.timeString.length)),
    R = w.map(({
      timeString: v,
      title: x,
      id: p
    }) => {
      return {
        label: `${v.padEnd(N," ")}  ${x}`,
        value: p
      }
    }),
    T = B ? Math.min(Z.length + 7, G - 6) : G - 1,
    y = B ? Math.min(Z.length, 12) : Math.min(Z.length, G - 6);
  return K4.default.createElement(S, {
    flexDirection: "column",
    padding: 1,
    height: T
  }, K4.default.createElement($, {
    bold: !0
  }, "Select a session to resume", Y && K4.default.createElement($, {
    dimColor: !0
  }, " (", Y, ")"), ":"), K4.default.createElement(S, {
    flexDirection: "column",
    marginY: 1,
    flexGrow: 1
  }, K4.default.createElement(S, {
    marginLeft: 2
  }, K4.default.createElement($, {
    bold: !0
  }, bw9.padEnd(N, " "), Hu3, "Session Title")), K4.default.createElement(M0, {
    visibleOptionCount: y,
    options: R,
    onCancel: () => {},
    onChange: (v) => {
      let x = Z.find((p) => p.id === v);
      if (x) A(x)
    }
  })), K4.default.createElement(S, {
    flexDirection: "row"
  }, K4.default.createElement($, {
    dimColor: !0
  }, K4.default.createElement(E4, {
    shortcut: "↑/↓",
    action: "select"
  }), " · ", K4.default.createElement(E4, {
    shortcut: "Enter",
    action: "confirm"
  }), " · ", K4.default.createElement(E4, {
    shortcut: "Esc",
    action: "cancel"
  }))))
}
// @from(Start 14839579, End 14840074)
function Cu3(A) {
  let Q = A.toLowerCase();
  if (Q.includes("fetch") || Q.includes("network") || Q.includes("timeout")) return "network";
  if (Q.includes("auth") || Q.includes("token") || Q.includes("permission") || Q.includes("oauth") || Q.includes("not authenticated") || Q.includes("/login") || Q.includes("console account") || Q.includes("403")) return "auth";
  if (Q.includes("api") || Q.includes("rate limit") || Q.includes("500") || Q.includes("529")) return "api";
  return "other"
}
// @from(Start 14840076, End 14841184)
function Eu3(A) {
  switch (A) {
    case "network":
      return K4.default.createElement(S, {
        marginY: 1,
        flexDirection: "column"
      }, K4.default.createElement($, {
        dimColor: !0
      }, "Check your internet connection"));
    case "auth":
      return K4.default.createElement(S, {
        marginY: 1,
        flexDirection: "column"
      }, K4.default.createElement($, {
        dimColor: !0
      }, "Teleport requires a Claude account"), K4.default.createElement($, {
        dimColor: !0
      }, "Run ", K4.default.createElement($, {
        bold: !0
      }, "/login"), ' and select "Claude account with subscription"'));
    case "api":
      return K4.default.createElement(S, {
        marginY: 1,
        flexDirection: "column"
      }, K4.default.createElement($, {
        dimColor: !0
      }, "Sorry, Claude encountered an error"));
    case "other":
      return K4.default.createElement(S, {
        marginY: 1,
        flexDirection: "row"
      }, K4.default.createElement($, {
        dimColor: !0
      }, "Sorry, Claude Code encountered an error"))
  }
}
// @from(Start 14841189, End 14841191)
K4
// @from(Start 14841193, End 14841208)
bw9 = "Updated"
// @from(Start 14841212, End 14841222)
Hu3 = "  "
// @from(Start 14841228, End 14841339)
hw9 = L(() => {
  hA();
  J5();
  DY();
  i8();
  V0();
  Y60();
  z0A();
  Fn();
  dF();
  K4 = BA(VA(), 1)
})
// @from(Start 14841342, End 14842121)
function gw9(A) {
  let [Q, B] = ABA.useState(!1), [G, Z] = ABA.useState(null), [I, Y] = ABA.useState(null), J = ABA.useCallback(async (X) => {
    B(!0), Z(null), Y(X), GA("tengu_teleport_resume_session", {
      source: A,
      session_id: X.id
    });
    try {
      let V = await yRA(X.id);
      return B(!1), V
    } catch (V) {
      let F = {
        message: V instanceof XI ? V.message : V instanceof Error ? V.message : String(V),
        formattedMessage: V instanceof XI ? V.formattedMessage : void 0,
        isOperationError: V instanceof XI
      };
      return Z(F), B(!1), null
    }
  }, [A]), W = ABA.useCallback(() => {
    Z(null)
  }, []);
  return {
    resumeSession: J,
    isResuming: Q,
    error: G,
    selectedSession: I,
    clearError: W
  }
}
// @from(Start 14842126, End 14842129)
ABA
// @from(Start 14842135, End 14842198)
uw9 = L(() => {
  $0A();
  RZ();
  q0();
  ABA = BA(VA(), 1)
})
// @from(Start 14842201, End 14843494)
function zu3({
  onComplete: A,
  onCancel: Q,
  onError: B,
  isEmbedded: G = !1,
  source: Z
}) {
  let {
    resumeSession: I,
    isResuming: Y,
    error: J,
    selectedSession: W
  } = gw9(Z), X = async (F) => {
    let K = await I(F);
    if (K) A(K);
    else if (J) {
      if (B) B(J.message, J.formattedMessage)
    }
  }, V = () => {
    GA("tengu_teleport_cancelled", {}), Q()
  };
  if (Y && W) return Kz.default.createElement(S, {
    flexDirection: "column",
    padding: 1
  }, Kz.default.createElement(S, {
    flexDirection: "row"
  }, Kz.default.createElement(g4, null), Kz.default.createElement($, {
    bold: !0
  }, "Resuming session…")), Kz.default.createElement($, {
    dimColor: !0
  }, 'Loading "', W.title, '"…'));
  if (J && !B) return Kz.default.createElement(S, {
    flexDirection: "column",
    padding: 1
  }, Kz.default.createElement($, {
    bold: !0,
    color: "error"
  }, "Failed to resume session"), Kz.default.createElement($, {
    dimColor: !0
  }, J.message), Kz.default.createElement(S, {
    marginTop: 1
  }, Kz.default.createElement($, {
    dimColor: !0
  }, "Press ", Kz.default.createElement($, {
    bold: !0
  }, "Esc"), " to cancel")));
  return Kz.default.createElement(fw9, {
    onSelect: X,
    onCancel: V,
    isEmbedded: G
  })
}
// @from(Start 14843495, End 14844012)
async function mw9() {
  return g("selectAndResumeTeleportTask: Starting teleport flow..."), new Promise(async (A) => {
    let {
      unmount: Q
    } = await VG(Kz.default.createElement(yG, null, Kz.default.createElement(zu3, {
      onComplete: (B) => {
        Q(), A(B)
      },
      onCancel: () => {
        Q(), A(null)
      },
      onError: (B, G) => {
        process.stderr.write(G ? G + `
` : `Error: ${B}
`), Q(), A(null)
      },
      source: "cliArg"
    })), {
      exitOnCtrlC: !1
    })
  })
}
// @from(Start 14844017, End 14844019)
Kz
// @from(Start 14844025, End 14844120)
dw9 = L(() => {
  hA();
  hw9();
  DY();
  uw9();
  q0();
  z9();
  V0();
  Kz = BA(VA(), 1)
})
// @from(Start 14844123, End 14844218)
function pw9() {
  if (process.env.CLAUDE_CODE_REMOTE === "true") return;
  cw9(xq), cw9(kWA)
}
// @from(Start 14844220, End 14845361)
function cw9(A) {
  try {
    jn.call({
      prompt: "Warmup",
      subagent_type: A.agentType,
      description: "Warmup"
    }, {
      options: {
        agentDefinitions: {
          allAgents: [A],
          activeAgents: [A]
        },
        commands: [],
        debug: !1,
        mainLoopModel: k3(),
        tools: [],
        verbose: !1,
        maxThinkingTokens: 1000,
        mcpClients: [],
        mcpResources: {},
        isNonInteractiveSession: !1,
        hasAppendSystemPrompt: !1
      },
      abortController: new AbortController,
      readFileState: new tm({
        max: 1000
      }),
      getAppState: async () => wp(),
      setAppState: async () => {},
      setMessages: async () => {},
      setInProgressToolUseIDs: async () => {},
      setResponseLength: async () => {},
      updateFileHistoryState: async () => {},
      agentId: "warmup",
      messages: []
    }, async () => ({
      behavior: "deny",
      message: "Warmup",
      decisionReason: {
        type: "other",
        reason: "Warmup"
      }
    }), uD({
      content: "Warmup"
    }), () => {}).catch(() => {})
  } catch {}
}
// @from(Start 14845366, End 14845443)
lw9 = L(() => {
  bbA();
  DTA();
  _WA();
  z9();
  cQ();
  t2();
  t51()
})
// @from(Start 14845564, End 14853468)
class PD0 {
  server = null;
  secret;
  port = null;
  mcpClients;
  availableTools;
  resources;
  constructor(A, Q) {
    this.mcpClients = A, this.availableTools = Q || [], this.resources = {}, this.secret = $u3(32).toString("hex")
  }
  async start() {
    if (this.server) throw Error("MCP CLI endpoint already started");
    return new Promise((A, Q) => {
      this.server = Uu3((B, G) => {
        this.handleRequest(B, G)
      }), this.server.on("error", (B) => {
        AA(B), Q(B)
      }), this.server.listen(0, "127.0.0.1", () => {
        let B = this.server.address();
        if (!B || typeof B === "string") {
          Q(Error("Failed to get server address"));
          return
        }
        this.port = B.port;
        let G = `http://127.0.0.1:${this.port}`;
        g(`[MCP CLI Endpoint] Started on ${G}`), A({
          port: this.port,
          url: G
        })
      })
    })
  }
  getSecret() {
    return this.secret
  }
  async handleRequest(A, Q) {
    if (A.setTimeout(30000), A.on("timeout", () => {
        g("[MCP CLI Endpoint] Request timeout"), Q.writeHead(408, {
          "Content-Type": "application/json"
        }), Q.end(JSON.stringify({
          error: "Request Timeout"
        }))
      }), A.method !== "POST" || A.url !== "/mcp") {
      Q.writeHead(404, {
        "Content-Type": "application/json"
      }), Q.end(JSON.stringify({
        error: "Not Found"
      }));
      return
    }
    let B = A.headers.authorization;
    if (!B?.startsWith("Bearer ")) {
      Q.writeHead(403, {
        "Content-Type": "application/json"
      }), Q.end(JSON.stringify({
        error: "Forbidden"
      }));
      return
    }
    let G = B.slice(7);
    if (!this.validateSecret(G)) {
      Q.writeHead(403, {
        "Content-Type": "application/json"
      }), Q.end(JSON.stringify({
        error: "Forbidden"
      }));
      return
    }
    let Z = 10485760,
      I = 0,
      Y = "";
    A.on("data", (J) => {
      if (I += J.length, I > Z) {
        g(`[MCP CLI Endpoint] Request too large: ${I} bytes`), Q.writeHead(413, {
          "Content-Type": "application/json"
        }), Q.end(JSON.stringify({
          error: "Payload Too Large"
        })), A.destroy();
        return
      }
      Y += J.toString()
    }), A.on("end", async () => {
      try {
        let J = JSON.parse(Y),
          W = mz9.parse(J),
          X = await this.handleCommand(W);
        Q.writeHead(200, {
          "Content-Type": "application/json"
        }), Q.end(JSON.stringify(X))
      } catch (J) {
        let W = 500;
        if (J instanceof SyntaxError) W = 400;
        else if (J && typeof J === "object" && "name" in J) {
          if (J.name === "ZodError") W = 400
        }
        Q.writeHead(W, {
          "Content-Type": "application/json"
        }), Q.end(JSON.stringify({
          error: J instanceof Error ? J.message : "Unknown error",
          type: J instanceof Error ? J.constructor.name : "Error"
        })), AA(J instanceof Error ? J : Error(String(J)))
      }
    }), A.on("error", (J) => {
      if (AA(J), !Q.headersSent) Q.writeHead(500, {
        "Content-Type": "application/json"
      }), Q.end(JSON.stringify({
        error: "Internal Server Error"
      }))
    })
  }
  validateSecret(A) {
    try {
      let Q = Buffer.from(A),
        B = Buffer.from(this.secret);
      if (Q.length !== B.length) return !1;
      return wu3(Q, B)
    } catch {
      return !1
    }
  }
  async handleCommand(A) {
    let Q = Date.now(),
      B = A.command === "call" ? `mcp__${A.params.server}__${A.params.tool}` : void 0;
    try {
      let {
        data: G,
        metadata: Z
      } = await this.executeCommand(A), I = Date.now() - Q;
      if (A.command === "call") GA("tengu_tool_use_success", {
        toolName: B,
        isMcp: !0,
        durationMs: I
      });
      return GA("tengu_mcp_cli_command_executed", {
        command: A.command,
        success: !0,
        duration_ms: I,
        ...Z
      }), G
    } catch (G) {
      let Z = G instanceof Error ? G : Error(String(G)),
        I = Date.now() - Q,
        Y = String(G).slice(0, 2000);
      if (A.command === "call") GA("tengu_tool_use_error", {
        toolName: B,
        isMcp: !0,
        error: Y,
        durationMs: I
      });
      throw GA("tengu_mcp_cli_command_executed", {
        command: A.command,
        success: !1,
        error_type: A.command === "call" ? "tool_execution_failed" : Z.constructor,
        duration_ms: Date.now() - Q
      }), G
    }
  }
  async executeCommand(A) {
    switch (A.command) {
      case "servers": {
        let Q = hJ1(this.mcpClients);
        return {
          data: Q,
          metadata: {
            server_count: Q.length
          }
        }
      }
      case "tools": {
        let Q = gJ1(this.availableTools, A.params);
        return {
          data: Q,
          metadata: {
            tool_count: Q.length,
            filtered: !!A.params?.server
          }
        }
      }
      case "info": {
        let Q = await uJ1(this.availableTools, A.params);
        if (!Q) {
          let B = gSA(this.mcpClients, A.params.server, this.getNormalizedNames()),
            G = tQA(A.params.server, B?.type);
          if (G) throw G;
          throw new TD0(`Tool '${A.params.toolName}' not found on server '${A.params.server}'`)
        }
        return {
          data: Q,
          metadata: {
            tool_found: !0
          }
        }
      }
      case "grep": {
        let Q = mJ1(this.availableTools, A.params);
        return {
          data: Q,
          metadata: {
            match_count: Q.length
          }
        }
      }
      case "resources": {
        let Q = dJ1(this.resources, A.params, this.getNormalizedNames());
        return {
          data: Q,
          metadata: {
            resource_count: Q.length,
            filtered: !!A.params?.server
          }
        }
      }
      case "call": {
        let {
          server: Q,
          tool: B
        } = A.params;
        return {
          data: await this.callTool(A.params),
          metadata: {
            tool_name: `mcp__${Q}__${B}`
          }
        }
      }
      case "read":
        return {
          data: await this.readResource(A.params), metadata: {
            server: A.params.server
          }
        };
      default: {
        let Q = A;
        throw Error("Unknown command")
      }
    }
  }
  getConnectedClient(A) {
    let Q = gSA(this.mcpClients, A, this.getNormalizedNames()),
      B = tQA(A, Q?.type);
    if (B) throw B;
    return Q
  }
  async callTool({
    server: A,
    tool: Q,
    args: B,
    timeoutMs: G
  }) {
    let Z = this.getConnectedClient(A),
      I = `mcp__${A}__${Q}`,
      Y = this.availableTools.find((X) => X.name === I);
    if (this.availableTools.length > 0 && !Y) throw new TD0(`Tool '${Q}' not found on server '${A}'`);
    let J = Y?.originalMcpToolName || Q;
    return await Z.client.request({
      method: "tools/call",
      params: {
        name: J,
        arguments: B
      }
    }, aT, G ? {
      signal: AbortSignal.timeout(G)
    } : void 0)
  }
  async readResource({
    server: A,
    uri: Q,
    timeoutMs: B
  }) {
    return await this.getConnectedClient(A).client.readResource({
      uri: Q
    }, B ? {
      signal: AbortSignal.timeout(B)
    } : void 0)
  }
  async stop() {
    if (!this.server) return;
    return new Promise((A, Q) => {
      this.server.close((B) => {
        if (B) Q(B);
        else g("[MCP CLI Endpoint] Stopped"), this.server = null, this.port = null, A()
      })
    })
  }
  updateClients(A) {
    this.mcpClients = A
  }
  updateTools(A) {
    this.availableTools = A
  }
  updateResources(A) {
    this.resources = A
  }
  getNormalizedNames() {
    let A = {};
    for (let Q of this.mcpClients) A[n7(Q.name)] = Q.name;
    return A
  }
}
// @from(Start 14853473, End 14853476)
TD0
// @from(Start 14853482, End 14853705)
iw9 = L(() => {
  SD();
  nK0();
  aK0();
  sK0();
  rK0();
  oK0();
  V0();
  g1();
  q0();
  tK0();
  TD0 = class TD0 extends Error {
    constructor(A) {
      super(A);
      this.name = "ToolNotFoundError"
    }
  }
})
// @from(Start 14853711, End 14853719)
ow9 = {}
// @from(Start 14854070, End 14854291)
function Mu3() {
  try {
    let A = OB("policySettings");
    if (A) {
      let Q = zz9(A);
      GA("tengu_managed_settings_loaded", {
        keyCount: Q.length,
        keys: Q.join(",")
      })
    }
  } catch {}
}
// @from(Start 14854293, End 14854572)
function Ou3() {
  try {
    let A = bZ(),
      Q = process.env.ENABLE_EXPERIMENTAL_MCP_CLI !== void 0 ? "external_env_var" : "external_default",
      B = !1;
    GA("tengu_mcp_cli_status", {
      enabled: A,
      source: Q,
      legacy_env_var_set: !1
    })
  } catch {}
}
// @from(Start 14854574, End 14854964)
function Ru3() {
  let A = ms(),
    Q = process.execArgv.some((G) => {
      if (A) return /--inspect(-brk)?/.test(G);
      else return /--inspect(-brk)?|--debug(-brk)?/.test(G)
    }),
    B = process.env.NODE_OPTIONS && /--inspect(-brk)?|--debug(-brk)?/.test(process.env.NODE_OPTIONS);
  try {
    return !!global.require("inspector").url() || Q || B
  } catch {
    return Q || B
  }
}
// @from(Start 14854966, End 14855403)
function sw9() {
  let A = N1();
  c0({
    ...A,
    hasCompletedOnboarding: !0,
    lastOnboardingVersion: {
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.0.59",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
    }.VERSION
  })
}
// @from(Start 14855404, End 14857999)
async function rw9(A, Q, B) {
  if (Y0(!1) || process.env.IS_DEMO) return !1;
  let G = N1(),
    Z = !1;
  if (!G.theme || !G.hasCompletedOnboarding) Z = !0, await kJ(), await new Promise(async (I) => {
    let {
      unmount: Y
    } = await VG(d3.default.createElement(yG, {
      onChangeAppState: Yu
    }, d3.default.createElement(aU9, {
      onDone: async () => {
        sw9(), Y(), await kJ(), I()
      }
    })), {
      exitOnCtrlC: !1
    })
  });
  if (A !== "bypassPermissions" && process.env.CLAUBBIT !== "true") {
    let I = TJ(!1);
    if (await new Promise(async (W) => {
        let {
          unmount: X
        } = await VG(d3.default.createElement(yG, null, d3.default.createElement(V$9, {
          commands: B,
          onDone: async () => {
            if (X(), !I) await kJ();
            W()
          }
        })), {
          exitOnCtrlC: !1
        })
      }), uzA()) KU9();
    I7A(), iD();
    let {
      errors: J
    } = wa();
    if (J.length === 0) await m$9();
    if (await nZ2()) await new Promise(async (W) => {
      let {
        unmount: X
      } = await VG(d3.default.createElement(yG, null, d3.default.createElement(gY1, {
        onDone: () => {
          X(), W()
        },
        isStandaloneDialog: !0
      })), {
        exitOnCtrlC: !1
      })
    })
  }
  if (await fYA()) await new Promise(async (I) => {
    let {
      unmount: Y
    } = await VG(d3.default.createElement(yG, null, d3.default.createElement(WJ1, {
      showIfAlreadyViewed: !1,
      location: Z ? "onboarding" : "policy_update_modal",
      onDone: async (J) => {
        if (J === "escape") {
          GA("tengu_grove_policy_exited", {}), l5(0);
          return
        }
        if (Y(), J !== "skip_rendering") await kJ();
        I()
      }
    })), {
      exitOnCtrlC: !1
    })
  });
  if (process.env.ANTHROPIC_API_KEY) {
    let I = dw(process.env.ANTHROPIC_API_KEY);
    if (TiA(I) === "new") await new Promise(async (J) => {
      let {
        unmount: W
      } = await VG(d3.default.createElement(yG, {
        onChangeAppState: Yu
      }, d3.default.createElement(oJ1, {
        customApiKeyTruncated: I,
        onDone: async () => {
          W(), await kJ(), J()
        }
      })), {
        exitOnCtrlC: !1
      })
    })
  }
  if (BD0(), (A === "bypassPermissions" || Q) && !N1().bypassPermissionsModeAccepted) await new Promise(async (I) => {
    let {
      unmount: Y
    } = await VG(d3.default.createElement(yG, null, d3.default.createElement(e$9, {
      onAccept: () => {
        Y(), I()
      }
    })))
  });
  return Z
}
// @from(Start 14858000, End 14858280)
async function aw9(A, Q) {
  try {
    let B = await ZYA(A, Q);
    if (B.type === "connected") return "✓ Connected";
    else if (B.type === "needs-auth") return "⚠ Needs authentication";
    else return "✗ Failed to connect"
  } catch (B) {
    return "✗ Connection error"
  }
}
// @from(Start 14858282, End 14858402)
function Tu3() {
  let A = N1();
  c0({
    ...A,
    numStartups: (A.numStartups ?? 0) + 1
  }), Pu3(), bE0()?.add(1)
}
// @from(Start 14858403, End 14858758)
async function Pu3() {
  let [A, Q] = await Promise.all([rw(), NUA()]);
  GA("tengu_startup_telemetry", {
    is_git: A,
    worktree_count: Q,
    sandbox_enabled: nQ.isSandboxingEnabled(),
    are_unsandboxed_commands_allowed: nQ.areUnsandboxedCommandsAllowed(),
    is_auto_bash_allowed_if_sandbox_enabled: nQ.isAutoAllowBashIfSandboxedEnabled()
  })
}
// @from(Start 14858760, End 14858814)
function ju3() {
  Bw9(), Zw9(), Ww9(), Vw9(), Yw9()
}
// @from(Start 14858816, End 14858892)
function Su3() {
  if (N6()) {
    iD();
    return
  }
  if (TJ(!0)) iD()
}
// @from(Start 14858893, End 14862006)
async function JW1(A, Q, B, G, Z) {
  let I = process.version.match(/^v(\d+)\./)?.[1];
  if (!I || parseInt(I) < 18) console.error(tA.bold.red("Error: Claude Code requires Node.js version 18 or higher.")), process.exit(1);
  if (Z) zR(Z);
  S00();
  let Y = jMB();
  if (Y.status === "restored") console.log(tA.yellow("Detected an interrupted iTerm2 setup. Your original settings have been restored. You may need to restart iTerm2 for the changes to take effect."));
  else if (Y.status === "failed") console.error(tA.red(`Failed to restore iTerm2 settings. Please manually restore your original settings with: defaults import com.googlecode.iterm2 ${Y.backupPath}.`));
  try {
    let V = await tsA();
    if (V.status === "restored") console.log(tA.yellow("Detected an interrupted Terminal.app setup. Your original settings have been restored. You may need to restart Terminal.app for the changes to take effect."));
    else if (V.status === "failed") console.error(tA.red(`Failed to restore Terminal.app settings. Please manually restore your original settings with: defaults import com.apple.Terminal ${V.backupPath}.`))
  } catch (V) {
    AA(V instanceof Error ? V : Error(String(V)))
  }
  if (Bq(A), LU9(), TU9(), SU9(), hX9(), uX9(), j$9(), CZ0(), EZ0(), M9("setup_before_prefetch"), CU9(), Z8B(), sE(), iI1(), _1A(), g89(), DK(), Su3(), r$9(), nb(), jCB(), s$9(), c4B(N6()), Y0(process.env.CLAUDE_CODE_USE_BEDROCK) && !Y0(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH)) l4B();
  j$A().catch((V) => AA(V)), UYA([], e1()), KOB(), M9("setup_after_prefetch");
  let {
    hasReleaseNotes: J
  } = SjA(N1().lastReleaseNotesSeen);
  if (J) await Z59();
  let W = o9();
  if (setTimeout(() => W.abort(), 3000), myA(W0(), W.signal, []), Q === "bypassPermissions" || B) {
    if (process.platform !== "win32" && typeof process.getuid === "function" && process.getuid() === 0 && !process.env.IS_SANDBOX) console.error("--dangerously-skip-permissions cannot be used with root/sudo privileges for security reasons"), process.exit(1)
  }
  let X = j5();
  if (X.lastCost !== void 0 && X.lastDuration !== void 0) GA("tengu_exit", {
    last_session_cost: X.lastCost,
    last_session_api_duration: X.lastAPIDuration,
    last_session_tool_duration: X.lastToolDuration,
    last_session_duration: X.lastDuration,
    last_session_lines_added: X.lastLinesAdded,
    last_session_lines_removed: X.lastLinesRemoved,
    last_session_total_input_tokens: X.lastTotalInputTokens,
    last_session_total_output_tokens: X.lastTotalOutputTokens,
    last_session_total_cache_creation_input_tokens: X.lastTotalCacheCreationInputTokens,
    last_session_total_cache_read_input_tokens: X.lastTotalCacheReadInputTokens,
    last_session_id: X.lastSessionId
  }), AY({
    ...X,
    lastCost: void 0,
    lastAPIDuration: void 0,
    lastToolDuration: void 0,
    lastDuration: void 0,
    lastLinesAdded: void 0,
    lastLinesRemoved: void 0,
    lastTotalInputTokens: void 0,
    lastTotalOutputTokens: void 0,
    lastTotalCacheCreationInputTokens: void 0,
    lastTotalCacheReadInputTokens: void 0,
    lastSessionId: void 0
  })
}
// @from(Start 14862008, End 14862693)
function _u3(A) {
  try {
    let Q = A.trim(),
      B = Q.startsWith("{") && Q.endsWith("}"),
      G;
    if (B) {
      if (!f7(Q)) process.stderr.write(tA.red(`Error: Invalid JSON provided to --settings
`)), process.exit(1);
      G = t31("claude-settings", ".json"), Lu3(G, Q, "utf8")
    } else {
      let {
        resolvedPath: Z
      } = fK(RA(), A);
      if (!YW1(Z)) process.stderr.write(tA.red(`Error: Settings file not found: ${Z}
`)), process.exit(1);
      G = Z
    }
    nE0(G), e7A()
  } catch (Q) {
    if (Q instanceof Error) AA(Q);
    process.stderr.write(tA.red(`Error processing settings: ${Q instanceof Error?Q.message:String(Q)}
`)), process.exit(1)
  }
}
// @from(Start 14862695, End 14862947)
function ku3(A) {
  try {
    let Q = vh0(A);
    Bz0(Q), e7A()
  } catch (Q) {
    if (Q instanceof Error) AA(Q);
    process.stderr.write(tA.red(`Error processing --setting-sources: ${Q instanceof Error?Q.message:String(Q)}
`)), process.exit(1)
  }
}
// @from(Start 14862949, End 14863378)
function yu3() {
  M9("eagerLoadSettings_start");
  let A = process.argv.findIndex((B) => B === "--settings");
  if (A !== -1 && A + 1 < process.argv.length) {
    let B = process.argv[A + 1];
    if (B) _u3(B)
  }
  let Q = process.argv.findIndex((B) => B === "--setting-sources");
  if (Q !== -1 && Q + 1 < process.argv.length) {
    let B = process.argv[Q + 1];
    if (B !== void 0) ku3(B)
  }
  M9("eagerLoadSettings_end")
}
// @from(Start 14863380, End 14863803)
function xu3(A) {
  if (process.env.CLAUDE_CODE_ENTRYPOINT) return;
  let Q = process.argv.slice(2),
    B = Q.indexOf("mcp");
  if (B !== -1 && Q[B + 1] === "serve") {
    process.env.CLAUDE_CODE_ENTRYPOINT = "mcp";
    return
  }
  if (Y0(process.env.CLAUDE_CODE_ACTION)) {
    process.env.CLAUDE_CODE_ENTRYPOINT = "claude-code-github-action";
    return
  }
  process.env.CLAUDE_CODE_ENTRYPOINT = A ? "sdk-cli" : "cli"
}
// @from(Start 14863804, End 14864953)
async function vu3() {
  M9("main_function_start"), process.env.NoDefaultCurrentDirectoryInExePath = "1", ez9(), process.on("exit", () => {
    uu3()
  }), process.on("SIGINT", () => {
    process.exit(0)
  }), M9("main_warning_handler_initialized");
  let A = process.argv.slice(2),
    Q = A.includes("-p") || A.includes("--print"),
    B = A.some((Y) => Y.startsWith("--sdk-url")),
    G = Q || B || !process.stdout.isTTY;
  lE0(!G), xu3(G);
  let I = (() => {
    if (process.env.GITHUB_ACTIONS === "true") return "github-action";
    if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-ts") return "sdk-typescript";
    if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-py") return "sdk-python";
    if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-cli") return "sdk-cli";
    if (process.env.CLAUDE_CODE_ENTRYPOINT === "claude-vscode") return "claude-vscode";
    if (process.env.CLAUDE_CODE_SESSION_ACCESS_TOKEN || process.env.CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR) return "remote";
    return "cli"
  })();
  iE0(I), M9("main_client_type_determined"), yu3(), M9("main_before_run"), process.title = "claude", await hu3(), M9("main_after_run")
}
// @from(Start 14864955, End 14865572)
function bu3(A) {
  let Q = 0,
    B = {
      exitOnCtrlC: A,
      onFlicker: (G, Z, I, Y) => {
        let J = Date.now();
        if (J - Q < 1000) GA("tengu_flicker", {
          desiredHeight: G,
          actualHeight: Z,
          ink2Enabled: I,
          reason: Y
        });
        Q = J
      }
    };
  if (!process.stdin.isTTY && !Y0(!1) && !process.argv.includes("mcp")) {
    if (GA("tengu_stdin_interactive", {}), process.platform !== "win32") try {
      let G = Nu3("/dev/tty", "r");
      B = {
        ...B,
        stdin: new qu3(G)
      }
    } catch (G) {
      AA(G)
    }
  }
  return B
}
// @from(Start 14865573, End 14865952)
async function fu3(A, Q) {
  if (!process.stdin.isTTY && !process.argv.includes("mcp")) {
    if (Q === "stream-json") return process.stdin;
    process.stdin.setEncoding("utf8");
    let B = "";
    return process.stdin.on("data", (G) => {
      B += G
    }), await new Promise((G) => {
      process.stdin.on("end", G)
    }), [A, B].filter(Boolean).join(`
`)
  }
  return A
}