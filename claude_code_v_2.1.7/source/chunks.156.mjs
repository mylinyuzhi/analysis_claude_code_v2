
// @from(Ln 467846, Col 0)
async function jR7(A, Q) {
  let B = !cAA();
  if (Q.continue) try {
    l("tengu_continue_print", {});
    let G = await Zt(void 0, void 0);
    if (G) {
      if (!Q.forkSession) {
        if (G.sessionId) {
          if (pw(lz(G.sessionId)), B) await wj()
        }
      }
      return fw9(G.fileHistorySnapshots, A), G.messages
    }
  } catch (G) {
    return e(G instanceof Error ? G : Error(String(G))), f6(1), []
  }
  if (Q.teleport) try {
    if (l("tengu_teleport_print", {}), typeof Q.teleport !== "string") throw Error("No session ID provided for teleport");
    await _K1();
    let G = await Yt(Q.teleport),
      {
        branchError: Z
      } = await BEA(G.branch);
    return QEA(G.log, Z)
  } catch (G) {
    return e(G instanceof Error ? G : Error(String(G))), f6(1), []
  }
  if (Q.resume) try {
    l("tengu_resume_print", {});
    let G = vw9(typeof Q.resume === "string" ? Q.resume : "");
    if (!G) {
      if (process.stderr.write(`Error: --resume requires a valid session ID when used with --print
`), process.stderr.write(`Usage: claude -p --resume <session-id>
`), typeof Q.resume === "string") process.stderr.write(`Session IDs must be in UUID format (e.g., 550e8400-e29b-41d4-a716-446655440000)
`), process.stderr.write(`Provided value "${Q.resume}" is not a valid UUID
`);
      return f6(1), []
    }
    if (G.isUrl && G.ingressUrl) await uJ9(G.sessionId, G.ingressUrl);
    let Z = await Zt(G.sessionId, G.jsonlFile || void 0);
    if (!Z)
      if (G.isUrl) return await WU("startup");
      else return process.stderr.write(`No conversation found with session ID: ${G.sessionId}
`), f6(1), [];
    if (Q.resumeSessionAt) {
      let Y = Z.messages.findIndex((J) => J.uuid === Q.resumeSessionAt);
      if (Y < 0) return process.stderr.write(`No message found with message.uuid of: ${Q.resumeSessionAt}
`), f6(1), [];
      Z.messages = Y >= 0 ? Z.messages.slice(0, Y + 1) : []
    }
    if (!Q.forkSession && Z.sessionId) {
      if (pw(lz(Z.sessionId)), B) await wj()
    }
    return fw9(Z.fileHistorySnapshots, A), Z.messages
  } catch (G) {
    return e(G instanceof Error ? G : Error(String(G))), process.stderr.write(`Failed to resume session with --print mode
`), f6(1), []
  }
  return await WU("startup")
}
// @from(Ln 467907, Col 0)
function TR7(A, Q) {
  let B;
  if (typeof A === "string")
    if (A.trim() !== "") B = oI0([eA({
      type: "user",
      session_id: "",
      message: {
        role: "user",
        content: A
      },
      parent_tool_use_id: null
    })]);
    else B = oI0([]);
  else B = A;
  return Q.sdkUrl ? new Fy0(Q.sdkUrl, B, Q.replayUserMessages) : new wmA(B, Q.replayUserMessages)
}
// @from(Ln 467923, Col 0)
async function PR7({
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
    let Y = await iJ9(Z);
    if (Y) return Q((J) => ({
      ...J,
      queuedCommands: [...J.queuedCommands, {
        mode: "orphaned-permission",
        value: [],
        orphanedPermission: {
          permissionResult: G,
          assistantMessage: Y
        }
      }]
    })), B?.(), !0
  }
  return !1
}
// @from(Ln 467950, Col 0)
function fw9(A, Q) {
  if (A && A.length > 0) RHA(A, (B) => Q((G) => ({
    ...G,
    fileHistory: B
  })))
}
// @from(Ln 467957, Col 0)
function Hy0(A) {
  return {
    ...A,
    scope: "dynamic"
  }
}
// @from(Ln 467963, Col 0)
async function SR7(A, Q, B, G) {
  let Z = {},
    Y = {};
  for (let [H, E] of Object.entries(A))
    if (E.type === "sdk") Z[H] = E;
    else Y[H] = E;
  let J = new Set(Object.keys(Q.configs)),
    X = new Set(Object.keys(Z)),
    I = [],
    D = [],
    W = {
      ...Q.configs
    },
    K = [...Q.clients],
    V = [...Q.tools];
  for (let H of J)
    if (!X.has(H)) {
      let E = K.find(($) => $.name === H);
      if (E && E.type === "connected") await E.cleanup();
      K = K.filter(($) => $.name !== H);
      let z = `mcp__${H}__`;
      V = V.filter(($) => !$.name.startsWith(z)), delete W[H], D.push(H)
    } for (let [H, E] of Object.entries(Z))
    if (!J.has(H)) {
      W[H] = E;
      let z = {
        type: "pending",
        name: H,
        config: {
          ...E,
          scope: "dynamic"
        }
      };
      K = [...K, z], I.push(H)
    } let F = await xR7(Y, B, G);
  return {
    response: {
      added: [...I, ...F.response.added],
      removed: [...D, ...F.response.removed],
      errors: F.response.errors
    },
    newSdkState: {
      configs: W,
      clients: K,
      tools: V
    },
    newDynamicState: F.newState,
    sdkServersChanged: I.length > 0 || D.length > 0
  }
}
// @from(Ln 468013, Col 0)
async function xR7(A, Q, B) {
  let G = new Set(Object.keys(Q.configs)),
    Z = new Set(Object.keys(A)),
    Y = [...G].filter((z) => !Z.has(z)),
    J = [...Z].filter((z) => !G.has(z)),
    I = [...G].filter((z) => Z.has(z)).filter((z) => {
      let $ = Q.configs[z],
        O = A[z];
      if (!$ || !O) return !0;
      let L = Hy0(O);
      return !Hr2($, L)
    }),
    D = [],
    W = [],
    K = {},
    V = [...Q.clients],
    F = [...Q.tools];
  for (let z of [...Y, ...I]) {
    let $ = V.find((M) => M.name === z),
      O = Q.configs[z];
    if ($ && O) {
      if ($.type === "connected") try {
        await $.cleanup()
      } catch (M) {
        e(M instanceof Error ? M : Error(String(M)))
      }
      await pc(z, O)
    }
    let L = `mcp__${z}__`;
    if (F = F.filter((M) => !M.name.startsWith(L)), V = V.filter((M) => M.name !== z), Y.includes(z)) D.push(z)
  }
  for (let z of [...J, ...I]) {
    let $ = A[z];
    if (!$) continue;
    let O = Hy0($);
    if ($.type === "sdk") {
      W.push(z);
      continue
    }
    try {
      let L = await SO(z, O);
      if (V.push(L), L.type === "connected") {
        let M = await Ax(L);
        F.push(...M)
      } else if (L.type === "failed") K[z] = L.error || "Connection failed";
      W.push(z)
    } catch (L) {
      let M = L instanceof Error ? L.message : String(L);
      K[z] = M, e(L instanceof Error ? L : Error(M))
    }
  }
  let H = {};
  for (let z of Z) {
    let $ = A[z];
    if ($) H[z] = Hy0($)
  }
  let E = {
    clients: V,
    tools: F,
    configs: H
  };
  return B((z) => {
    let $ = new Set([...Object.keys(Q.configs), ...Object.keys(H)]),
      O = z.mcp.tools.filter((M) => {
        for (let _ of $)
          if (M.name.startsWith(`mcp__${_}__`)) return !1;
        return !0
      }),
      L = z.mcp.clients.filter((M) => {
        return !$.has(M.name)
      });
    return {
      ...z,
      mcp: {
        ...z.mcp,
        tools: [...O, ...F],
        clients: [...L, ...V]
      }
    }
  }), {
    response: {
      added: W,
      removed: D,
      errors: K
    },
    newState: E
  }
}
// @from(Ln 468101, Col 4)
bw9
// @from(Ln 468102, Col 4)
uw9 = w(() => {
  Ky0();
  Pw9();
  WV();
  az();
  Z0();
  T1();
  _S();
  VO();
  v1();
  ZM0();
  ghA();
  eHA();
  d_();
  gr();
  bH1();
  yJ();
  xw9();
  V2();
  KGA();
  Jt();
  YZ();
  vI();
  Dy0();
  iZ();
  DyA();
  Gt();
  Cf();
  GB();
  ys();
  Q2();
  C0();
  Pr();
  kw9();
  d4();
  jN();
  OHA();
  $F();
  sVA();
  fz1();
  aj0();
  l2();
  C0();
  oN();
  NJ();
  xhA();
  A0();
  bw9 = new Set
})
// @from(Ln 468151, Col 0)
async function mw9() {
  l("tengu_update_check", {}), J9(`Current version: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.VERSION}
`);
  let A = r3()?.autoUpdatesChannel ?? "latest";
  J9(`Checking for updates to ${A} version...
`), k("update: Starting update check"), k("update: Running diagnostic");
  let Q = await zt();
  if (k(`update: Installation type: ${Q.installationType}`), k(`update: Config install method: ${Q.configInstallMethod}`), Q.multipleInstallations.length > 1) {
    J9(`
`), J9(I1.yellow("Warning: Multiple installations found") + `
`);
    for (let D of Q.multipleInstallations) {
      let W = Q.installationType === D.type ? " (currently running)" : "";
      J9(`- ${D.type} at ${D.path}${W}
`)
    }
  }
  if (Q.warnings.length > 0) {
    J9(`
`);
    for (let D of Q.warnings) k(`update: Warning detected: ${D.issue}`), k(`update: Showing warning: ${D.issue}`), J9(I1.yellow(`Warning: ${D.issue}
`)), J9(I1.bold(`Fix: ${D.fix}
`))
  }
  let B = L1();
  if (!B.installMethod && Q.installationType !== "package-manager") {
    J9(`
`), J9(`Updating configuration to track installation method...
`);
    let D = "unknown";
    switch (Q.installationType) {
      case "npm-local":
        D = "local";
        break;
      case "native":
        D = "native";
        break;
      case "npm-global":
        D = "global";
        break;
      default:
        D = "unknown"
    }
    S0((W) => ({
      ...W,
      installMethod: D
    })), J9(`Installation method set to: ${D}
`)
  }
  if (Q.installationType === "development") J9(`
`), J9(I1.yellow("Warning: Cannot update development build") + `
`), await w3(1);
  if (Q.installationType === "package-manager") {
    let D = IEA();
    if (J9(`
`), D === "homebrew") {
      J9(`Claude is managed by Homebrew.
`);
      let W = await Ht(A);
      if (W && !Ey0.gte({
          ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
          PACKAGE_URL: "@anthropic-ai/claude-code",
          README_URL: "https://code.claude.com/docs/en/overview",
          VERSION: "2.1.7",
          FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
          BUILD_TIME: "2026-01-13T22:55:21Z"
        }.VERSION, W, {
          loose: !0
        })) J9(`Update available: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.VERSION} → ${W}
`), J9(`
`), J9(`To update, run:
`), J9(I1.bold("  brew upgrade claude-code") + `
`);
      else J9(`Claude is up to date!
`)
    } else if (D === "winget") {
      J9(`Claude is managed by winget.
`);
      let W = await Ht(A);
      if (W && !Ey0.gte({
          ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
          PACKAGE_URL: "@anthropic-ai/claude-code",
          README_URL: "https://code.claude.com/docs/en/overview",
          VERSION: "2.1.7",
          FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
          BUILD_TIME: "2026-01-13T22:55:21Z"
        }.VERSION, W, {
          loose: !0
        })) J9(`Update available: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.VERSION} → ${W}
`), J9(`
`), J9(`To update, run:
`), J9(I1.bold("  winget upgrade Anthropic.ClaudeCode") + `
`);
      else J9(`Claude is up to date!
`)
    } else J9(`Claude is managed by a package manager.
`), J9(`Please use your package manager to update.
`);
    await w3(0)
  }
  if (B.installMethod && Q.configInstallMethod !== "not set" && Q.installationType !== "package-manager") {
    let {
      installationType: D,
      configInstallMethod: W
    } = Q, V = {
      "npm-local": "local",
      "npm-global": "global",
      native: "native",
      development: "development",
      unknown: "unknown"
    } [D] || D;
    if (V !== W && W !== "unknown") J9(`
`), J9(I1.yellow("Warning: Configuration mismatch") + `
`), J9(`Config expects: ${W} installation
`), J9(`Currently running: ${D}
`), J9(I1.yellow(`Updating the ${D} installation you are currently using`) + `
`), S0((F) => ({
      ...F,
      installMethod: V
    })), J9(`Config updated to reflect current installation method: ${V}
`)
  }
  if (Q.installationType === "native") {
    k("update: Detected native installation, using native updater");
    try {
      let D = await sf(A);
      if (D.lockFailed) {
        let W = D.lockHolderPid ? ` (PID ${D.lockHolderPid})` : "";
        J9(I1.yellow(`Another Claude process${W} is currently running. Please try again in a moment.`) + `
`), await w3(0)
      }
      if (!D.latestVersion) process.stderr.write(`Failed to check for updates
`), await w3(1);
      if (D.latestVersion === {
          ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
          PACKAGE_URL: "@anthropic-ai/claude-code",
          README_URL: "https://code.claude.com/docs/en/overview",
          VERSION: "2.1.7",
          FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
          BUILD_TIME: "2026-01-13T22:55:21Z"
        }.VERSION) J9(I1.green(`Claude Code is up to date (${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.VERSION})`) + `
`);
      else J9(I1.green(`Successfully updated from ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.VERSION} to version ${D.latestVersion}`) + `
`);
      await w3(0)
    } catch (D) {
      process.stderr.write(`Error: Failed to install native update
`), process.stderr.write(String(D) + `
`), process.stderr.write(`Try running "claude doctor" for diagnostics
`), await w3(1)
    }
  }
  if (B.installMethod !== "native") await GgA();
  k("update: Checking npm registry for latest version"), k(`update: Package URL: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.PACKAGE_URL}`);
  let G = A === "stable" ? "stable" : "latest",
    Z = `npm view ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.PACKAGE_URL}@${G} version`;
  k(`update: Running: ${Z}`);
  let Y = await Ht(A);
  if (k(`update: Latest version from npm: ${Y||"FAILED"}`), !Y) {
    if (k("update: Failed to get latest version from npm registry"), process.stderr.write(I1.red("Failed to check for updates") + `
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
        VERSION: "2.1.7",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-01-13T22:55:21Z"
      }.PACKAGE_URL && !{
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.7",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-01-13T22:55:21Z"
      }.PACKAGE_URL.startsWith("@anthropic")) process.stderr.write(`  • Internal/development build not published to npm
`);
    process.stderr.write(`
`), process.stderr.write(`Try:
`), process.stderr.write(`  • Check your internet connection
`), process.stderr.write(`  • Run with --debug flag for more details
`);
    let D = {
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.1.7",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
      BUILD_TIME: "2026-01-13T22:55:21Z"
    }.PACKAGE_URL || "@anthropic-ai/claude-code";
    process.stderr.write(`  • Manually check: npm view ${D} version
`), process.stderr.write(`  • Check if you need to login: npm whoami
`), await w3(1)
  }
  if (Y === {
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.1.7",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
      BUILD_TIME: "2026-01-13T22:55:21Z"
    }.VERSION) J9(I1.green(`Claude Code is up to date (${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.VERSION})`) + `
`), await w3(0);
  J9(`New version available: ${Y} (current: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.VERSION})
`), J9(`Installing update...
`);
  let J = !1,
    X = "";
  switch (Q.installationType) {
    case "npm-local":
      J = !0, X = "local";
      break;
    case "npm-global":
      J = !1, X = "global";
      break;
    case "unknown": {
      let D = kc();
      J = D, X = D ? "local" : "global", J9(I1.yellow("Warning: Could not determine installation type") + `
`), J9(`Attempting ${X} update based on file detection...
`);
      break
    }
    default:
      process.stderr.write(`Error: Cannot update ${Q.installationType} installation
`), await w3(1)
  }
  J9(`Using ${X} installation update method...
`), k(`update: Update method determined: ${X}`), k(`update: useLocalUpdate: ${J}`);
  let I;
  if (J) k("update: Calling installOrUpdateClaudePackage() for local update"), I = await ZEA(A);
  else k("update: Calling installGlobalPackage() for global update"), I = await XEA();
  switch (k(`update: Installation status: ${I}`), I) {
    case "success":
      J9(I1.green(`Successfully updated from ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.VERSION} to version ${Y}`) + `
`);
      break;
    case "no_permissions":
      if (process.stderr.write(`Error: Insufficient permissions to install update
`), J) process.stderr.write(`Try manually updating with:
`), process.stderr.write(`  cd ~/.claude/local && npm update ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.PACKAGE_URL}
`);
      else process.stderr.write(`Try running with sudo or fix npm permissions
`), process.stderr.write(`Or consider using native installation with: claude install
`);
      await w3(1);
      break;
    case "install_failed":
      if (process.stderr.write(`Error: Failed to install update
`), J) process.stderr.write(`Try manually updating with:
`), process.stderr.write(`  cd ~/.claude/local && npm update ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.PACKAGE_URL}
`);
      else process.stderr.write(`Or consider using native installation with: claude install
`);
      await w3(1);
      break;
    case "in_progress":
      process.stderr.write(`Error: Another instance is currently performing an update
`), process.stderr.write(`Please wait and try again later
`), await w3(1);
      break
  }
  await w3(0)
}
// @from(Ln 468419, Col 4)
Ey0
// @from(Ln 468420, Col 4)
dw9 = w(() => {
  Z0();
  bc();
  mK1();
  GQ();
  Vt();
  xx();
  jf();
  Z3();
  T1();
  yJ();
  GB();
  Ey0 = c(xP(), 1)
})
// @from(Ln 468434, Col 4)
cw9 = w(() => {
  Z0();
  bc();
  xx();
  jf();
  T1();
  yJ();
  Vt();
  GB()
})
// @from(Ln 468451, Col 0)
function kR7() {
  let A = l0.platform === "win32",
    Q = yR7();
  if (A) return vR7(Q, ".local", "bin", "claude.exe").replace(/\//g, "\\");
  return "~/.local/bin/claude"
}
// @from(Ln 468458, Col 0)
function pw9({
  messages: A
}) {
  if (A.length === 0) return null;
  return w5.default.createElement(T, {
    flexDirection: "column",
    gap: 0,
    marginBottom: 1
  }, w5.default.createElement(T, null, w5.default.createElement(C, {
    color: "warning"
  }, tA.warning, " Setup notes:")), A.map((Q, B) => w5.default.createElement(T, {
    key: B,
    marginLeft: 2
  }, w5.default.createElement(C, {
    dimColor: !0
  }, "• ", Q))))
}
// @from(Ln 468476, Col 0)
function bR7({
  onDone: A,
  force: Q,
  target: B
}) {
  let [G, Z] = OmA.useState({
    type: "checking"
  });
  return OmA.useEffect(() => {
    async function Y() {
      try {
        k(`Install: Starting installation process (force=${Q}, target=${B})`);
        let J = B || r3()?.autoUpdatesChannel || "latest";
        Z({
          type: "installing",
          version: J
        }), k(`Install: Calling installLatest(channelOrVersion=${J}, force=true, forceReinstall=${Q})`);
        let X = await sf(J, !0, Q);
        if (k(`Install: installLatest returned version=${X.latestVersion}, wasUpdated=${X.wasUpdated}, lockFailed=${X.lockFailed}`), X.lockFailed) throw Error("Could not install - another process is currently installing Claude. Please try again in a moment.");
        if (!X.latestVersion) k("Install: Failed to retrieve version information during install", {
          level: "error"
        });
        if (!X.wasUpdated) k("Install: Already up to date");
        Z({
          type: "setting-up"
        });
        let I = await rf(!0);
        if (k(`Install: Setup launcher completed with ${I.length} messages`), I.length > 0) I.forEach((H) => k(`Install: Setup message: ${H.message}`));
        k("Install: Cleaning up npm installations after successful install");
        let {
          removed: D,
          errors: W,
          warnings: K
        } = await YgA();
        if (D > 0) k(`Cleaned up ${D} npm installation(s)`);
        if (W.length > 0) k(`Cleanup errors: ${W.join(", ")}`);
        let V = ZgA();
        if (V.length > 0) k(`Shell alias cleanup: ${V.map((H)=>H.message).join("; ")}`);
        if (l("tengu_claude_install_command", {
            has_version: X.latestVersion ? 1 : 0,
            forced: Q ? 1 : 0
          }), B === "latest" || B === "stable") pB("userSettings", {
          autoUpdatesChannel: B
        }), k(`Install: Saved autoUpdatesChannel=${B} to user settings`);
        let F = [...K, ...V.map((H) => H.message)];
        if (I.length > 0) Z({
          type: "set-up",
          messages: I.map((H) => H.message)
        }), setTimeout(() => {
          Z({
            type: "success",
            version: X.latestVersion || "current",
            setupMessages: [...I.map((H) => H.message), ...F]
          })
        }, 2000);
        else k("Install: Shell PATH already configured"), Z({
          type: "success",
          version: X.latestVersion || "current",
          setupMessages: F.length > 0 ? F : void 0
        })
      } catch (J) {
        k(`Install command failed: ${J}`, {
          level: "error"
        }), Z({
          type: "error",
          message: J instanceof Error ? J.message : String(J)
        })
      }
    }
    Y()
  }, [Q, B]), OmA.useEffect(() => {
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
  }, [G, A]), w5.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, G.type === "checking" && w5.default.createElement(C, {
    color: "claude"
  }, "Checking installation status..."), G.type === "cleaning-npm" && w5.default.createElement(C, {
    color: "warning"
  }, "Cleaning up old npm installations..."), G.type === "installing" && w5.default.createElement(C, {
    color: "claude"
  }, "Installing Claude Code native build ", G.version, "..."), G.type === "setting-up" && w5.default.createElement(C, {
    color: "claude"
  }, "Setting up launcher and shell integration..."), G.type === "set-up" && w5.default.createElement(pw9, {
    messages: G.messages
  }), G.type === "success" && w5.default.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, w5.default.createElement(T, null, w5.default.createElement(C, {
    color: "success"
  }, tA.tick, " "), w5.default.createElement(C, {
    color: "success",
    bold: !0
  }, "Claude Code successfully installed!")), w5.default.createElement(T, {
    marginLeft: 2,
    flexDirection: "column",
    gap: 1
  }, G.version !== "current" && w5.default.createElement(T, null, w5.default.createElement(C, {
    dimColor: !0
  }, "Version: "), w5.default.createElement(C, {
    color: "claude"
  }, G.version)), w5.default.createElement(T, null, w5.default.createElement(C, {
    dimColor: !0
  }, "Location: "), w5.default.createElement(C, {
    color: "text"
  }, kR7()))), w5.default.createElement(T, {
    marginLeft: 2,
    flexDirection: "column",
    gap: 1
  }, w5.default.createElement(T, {
    marginTop: 1
  }, w5.default.createElement(C, {
    dimColor: !0
  }, "Next: Run "), w5.default.createElement(C, {
    color: "claude",
    bold: !0
  }, "claude --help"), w5.default.createElement(C, {
    dimColor: !0
  }, " to get started"))), G.setupMessages && w5.default.createElement(pw9, {
    messages: G.setupMessages
  })), G.type === "error" && w5.default.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, w5.default.createElement(T, null, w5.default.createElement(C, {
    color: "error"
  }, tA.cross, " "), w5.default.createElement(C, {
    color: "error"
  }, "Installation failed")), w5.default.createElement(C, {
    color: "error"
  }, G.message), w5.default.createElement(T, {
    marginTop: 1
  }, w5.default.createElement(C, {
    dimColor: !0
  }, "Try running with --force to override checks"))))
}
// @from(Ln 468620, Col 4)
w5
// @from(Ln 468620, Col 8)
OmA
// @from(Ln 468620, Col 13)
lw9
// @from(Ln 468621, Col 4)
iw9 = w(() => {
  fA();
  fA();
  xx();
  T1();
  Z0();
  GB();
  B2();
  p3();
  w5 = c(QA(), 1), OmA = c(QA(), 1);
  lw9 = {
    type: "local-jsx",
    name: "install",
    description: "Install Claude Code native build",
    argumentHint: "[options]",
    async call(A, Q, B) {
      let G = B.includes("--force"),
        Y = B.filter((X) => !X.startsWith("--"))[0],
        {
          unmount: J
        } = await Y5(w5.default.createElement(bR7, {
          onDone: (X, I) => {
            J(), A(X, I)
          },
          force: G,
          target: Y
        }))
    }
  }
})
// @from(Ln 468655, Col 0)
async function nw9() {
  try {
    let A = await aS();
    if (!A) {
      k("Not in a GitHub repository, skipping path mapping update");
      return
    }
    let Q;
    try {
      Q = fR7(EQ())
    } catch {
      Q = EQ()
    }
    let B = A.toLowerCase(),
      Z = L1().githubRepoPaths?.[B] ?? [];
    if (Z.includes(Q)) {
      k(`Path ${Q} already tracked for repo ${B}`);
      return
    }
    let Y = [Q, ...Z];
    S0((J) => ({
      ...J,
      githubRepoPaths: {
        ...J.githubRepoPaths,
        [B]: Y
      }
    })), k(`Added ${Q} to tracked paths for repo ${B}`)
  } catch (A) {
    k(`Error updating repo path mapping: ${A}`)
  }
}
// @from(Ln 468687, Col 0)
function aw9(A) {
  let Q = L1(),
    B = A.toLowerCase();
  return Q.githubRepoPaths?.[B] ?? []
}
// @from(Ln 468693, Col 0)
function ow9(A) {
  return A.filter((Q) => hR7(Q))
}
// @from(Ln 468696, Col 0)
async function rw9(A, Q) {
  try {
    let {
      stdout: B,
      code: G
    } = await J2("git", ["remote", "get-url", "origin"], {
      cwd: A,
      preserveOutputOnError: !1
    });
    if (G !== 0 || !B) return !1;
    let Z = w6A(B.trim());
    if (!Z) return !1;
    return Z.toLowerCase() === Q.toLowerCase()
  } catch {
    return !1
  }
}
// @from(Ln 468714, Col 0)
function sw9(A, Q) {
  let B = L1(),
    G = A.toLowerCase(),
    Z = B.githubRepoPaths?.[G] ?? [],
    Y = Z.filter((X) => X !== Q);
  if (Y.length === Z.length) return;
  let J = {
    ...B.githubRepoPaths
  };
  if (Y.length === 0) delete J[G];
  else J[G] = Y;
  S0((X) => ({
    ...X,
    githubRepoPaths: J
  })), k(`Removed ${Q} from tracked paths for repo ${G}`)
}
// @from(Ln 468730, Col 4)
zy0 = w(() => {
  L6A();
  GQ();
  C0();
  T1();
  t4()
})
// @from(Ln 468738, Col 0)
function tw9({
  targetRepo: A,
  initialPaths: Q,
  onSelectPath: B,
  onCancel: G
}) {
  let [Z, Y] = g$A.useState(Q), [J, X] = g$A.useState(null), [I, D] = g$A.useState(!1), W = g$A.useCallback(async (V) => {
    if (V === "cancel") {
      G();
      return
    }
    if (D(!0), X(null), await rw9(V, A)) {
      B(V);
      return
    }
    sw9(A, V);
    let H = Z.filter((E) => E !== V);
    Y(H), D(!1), X(`${k6(V)} no longer contains the correct repository. Select another path.`)
  }, [A, Z, B, G]), K = [...Z.map((V) => ({
    label: gE.default.createElement(C, null, "Use ", gE.default.createElement(C, {
      bold: !0
    }, k6(V))),
    value: V
  })), {
    label: "Cancel",
    value: "cancel"
  }];
  return gE.default.createElement(o9, {
    title: "Teleport to Repo",
    onCancel: G,
    color: "background",
    borderDimColor: !0
  }, Z.length > 0 ? gE.default.createElement(gE.default.Fragment, null, gE.default.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, J && gE.default.createElement(C, {
    color: "error"
  }, J), gE.default.createElement(C, null, "Open Claude Code in ", gE.default.createElement(C, {
    bold: !0
  }, A), ":")), I ? gE.default.createElement(T, null, gE.default.createElement(W9, null), gE.default.createElement(C, null, " Validating repository…")) : gE.default.createElement(k0, {
    options: K,
    onChange: (V) => void W(V)
  })) : gE.default.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, J && gE.default.createElement(C, {
    color: "error"
  }, J), gE.default.createElement(C, {
    dimColor: !0
  }, "Run claude --teleport from a checkout of ", A)))
}
// @from(Ln 468789, Col 4)
gE
// @from(Ln 468789, Col 8)
g$A
// @from(Ln 468790, Col 4)
ew9 = w(() => {
  fA();
  rY();
  u8();
  yG();
  y9();
  zy0();
  gE = c(QA(), 1), g$A = c(QA(), 1)
})
// @from(Ln 468800, Col 0)
function gR7({
  currentStep: A,
  sessionId: Q
}) {
  let [B, G] = Cy0.useState(0);
  XZ(() => {
    G((Y) => (Y + 1) % $y0.length)
  }, 100);
  let Z = AL9.findIndex((Y) => Y.key === A);
  return MY.createElement(T, {
    flexDirection: "column",
    paddingX: 1,
    paddingY: 1
  }, MY.createElement(T, {
    marginBottom: 1
  }, MY.createElement(C, {
    bold: !0,
    color: "claude"
  }, $y0[B], " Teleporting session…")), Q && MY.createElement(T, {
    marginBottom: 1
  }, MY.createElement(C, {
    dimColor: !0
  }, Q)), MY.createElement(T, {
    flexDirection: "column",
    marginLeft: 2
  }, AL9.map((Y, J) => {
    let X = J < Z,
      I = J === Z,
      D = J > Z,
      W, K;
    if (X) W = tA.tick, K = "green";
    else if (I) W = $y0[B], K = "claude";
    else W = tA.circle, K = void 0;
    return MY.createElement(T, {
      key: Y.key,
      flexDirection: "row"
    }, MY.createElement(T, {
      width: 2
    }, MY.createElement(C, {
      color: K,
      dimColor: D
    }, W)), MY.createElement(C, {
      dimColor: D,
      bold: I
    }, Y.label))
  })))
}
// @from(Ln 468847, Col 0)
async function QL9(A) {
  let Q = () => {};

  function B() {
    let [Z, Y] = Cy0.useState("validating");
    return Q = Y, MY.createElement(gR7, {
      currentStep: Z,
      sessionId: A
    })
  }
  let {
    unmount: G
  } = await Y5(MY.createElement(b5, null, MY.createElement(B, null)), FY(!1));
  try {
    let Z = await Yt(A, Q);
    Q("checking_out");
    let {
      branchName: Y,
      branchError: J
    } = await BEA(Z.branch);
    return {
      messages: QEA(Z.log, J),
      branchName: Y
    }
  } finally {
    G()
  }
}
// @from(Ln 468875, Col 4)
MY
// @from(Ln 468875, Col 8)
Cy0
// @from(Ln 468875, Col 13)
$y0
// @from(Ln 468875, Col 18)
AL9
// @from(Ln 468876, Col 4)
BL9 = w(() => {
  fA();
  oK();
  B2();
  hB();
  Jt();
  Kf();
  MY = c(QA(), 1), Cy0 = c(QA(), 1), $y0 = ["◐", "◓", "◑", "◒"], AL9 = [{
    key: "validating",
    label: "Validating session"
  }, {
    key: "fetching_logs",
    label: "Fetching session logs"
  }, {
    key: "fetching_branch",
    label: "Getting branch info"
  }, {
    key: "checking_out",
    label: "Checking out branch"
  }]
})
// @from(Ln 468898, Col 0)
function ZL9({
  onSelect: A,
  onCancel: Q,
  isEmbedded: B = !1
}) {
  let {
    rows: G
  } = ZB(), [Z, Y] = v4.useState([]), [J, X] = v4.useState(null), [I, D] = v4.useState(!0), [W, K] = v4.useState(null), [V, F] = v4.useState(!1), [H, E] = v4.useState(!1), z = J3("confirm:no", "Confirmation", "Esc"), $ = v4.useCallback(async () => {
    try {
      D(!0), K(null);
      let S = await aS();
      X(S), k(`Current repository: ${S||"not detected"}`);
      let u = await rj2(),
        f = u;
      if (S) f = u.filter((n) => {
        if (!n.repo) return !1;
        return `${n.repo.owner.login}/${n.repo.name}` === S
      }), k(`Filtered ${f.length} sessions for repo ${S} from ${u.length} total`);
      let AA = [...f].sort((n, y) => {
        let p = new Date(n.updated_at);
        return new Date(y.updated_at).getTime() - p.getTime()
      });
      Y(AA)
    } catch (S) {
      let u = S instanceof Error ? S.message : String(S);
      k(`Error loading code sessions: ${u}`), K(mR7(u))
    } finally {
      D(!1), F(!1)
    }
  }, []), O = () => {
    F(!0), $()
  };
  H2("confirm:no", Q, {
    context: "Confirmation"
  }), J0((S, u) => {
    if (u.ctrl && S === "c") {
      Q();
      return
    }
    if (u.ctrl && S === "r" && W) {
      O();
      return
    }
    if (W !== null && u.return) {
      Q();
      return
    }
  });
  let L = v4.useCallback(() => {
    E(!0), $()
  }, [E, $]);
  if (!H) return v4.default.createElement(NK1, {
    onComplete: L
  });
  if (I) return v4.default.createElement(T, {
    flexDirection: "column",
    padding: 1
  }, v4.default.createElement(T, {
    flexDirection: "row"
  }, v4.default.createElement(W9, null), v4.default.createElement(C, {
    bold: !0
  }, "Loading Claude Code sessions…")), v4.default.createElement(C, {
    dimColor: !0
  }, V ? "Retrying…" : "Fetching your Claude Code sessions…"));
  if (W) return v4.default.createElement(T, {
    flexDirection: "column",
    padding: 1
  }, v4.default.createElement(C, {
    bold: !0,
    color: "error"
  }, "Error loading Claude Code sessions"), dR7(W), v4.default.createElement(C, {
    dimColor: !0
  }, "Press ", v4.default.createElement(C, {
    bold: !0
  }, "Ctrl+R"), " to retry · Press", " ", v4.default.createElement(C, {
    bold: !0
  }, z), " to cancel"));
  if (Z.length === 0) return v4.default.createElement(T, {
    flexDirection: "column",
    padding: 1
  }, v4.default.createElement(C, {
    bold: !0
  }, "No Claude Code sessions found", J && v4.default.createElement(C, null, " for ", J)), v4.default.createElement(T, {
    marginTop: 1
  }, v4.default.createElement(C, {
    dimColor: !0
  }, "Press ", v4.default.createElement(C, {
    bold: !0
  }, z), " to cancel")));
  let M = Z.map((S) => ({
      ...S,
      timeString: aeA(new Date(S.updated_at))
    })),
    _ = Math.max(GL9.length, ...M.map((S) => S.timeString.length)),
    j = M.map(({
      timeString: S,
      title: u,
      id: f
    }) => {
      return {
        label: `${S.padEnd(_," ")}  ${u}`,
        value: f
      }
    }),
    x = B ? Math.min(Z.length + 7, G - 6) : G - 1,
    b = B ? Math.min(Z.length, 12) : Math.min(Z.length, G - 6);
  return v4.default.createElement(T, {
    flexDirection: "column",
    padding: 1,
    height: x
  }, v4.default.createElement(C, {
    bold: !0
  }, "Select a session to resume", J && v4.default.createElement(C, {
    dimColor: !0
  }, " (", J, ")"), ":"), v4.default.createElement(T, {
    flexDirection: "column",
    marginY: 1,
    flexGrow: 1
  }, v4.default.createElement(T, {
    marginLeft: 2
  }, v4.default.createElement(C, {
    bold: !0
  }, GL9.padEnd(_, " "), uR7, "Session Title")), v4.default.createElement(k0, {
    visibleOptionCount: b,
    options: j,
    onChange: (S) => {
      let u = Z.find((f) => f.id === S);
      if (u) A(u)
    }
  })), v4.default.createElement(T, {
    flexDirection: "row"
  }, v4.default.createElement(C, {
    dimColor: !0
  }, v4.default.createElement(vQ, null, v4.default.createElement(F0, {
    shortcut: "↑/↓",
    action: "select"
  }), v4.default.createElement(F0, {
    shortcut: "Enter",
    action: "confirm"
  }), v4.default.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "cancel"
  })))))
}
// @from(Ln 469045, Col 0)
function mR7(A) {
  let Q = A.toLowerCase();
  if (Q.includes("fetch") || Q.includes("network") || Q.includes("timeout")) return "network";
  if (Q.includes("auth") || Q.includes("token") || Q.includes("permission") || Q.includes("oauth") || Q.includes("not authenticated") || Q.includes("/login") || Q.includes("console account") || Q.includes("403")) return "auth";
  if (Q.includes("api") || Q.includes("rate limit") || Q.includes("500") || Q.includes("529")) return "api";
  return "other"
}
// @from(Ln 469053, Col 0)
function dR7(A) {
  switch (A) {
    case "network":
      return v4.default.createElement(T, {
        marginY: 1,
        flexDirection: "column"
      }, v4.default.createElement(C, {
        dimColor: !0
      }, "Check your internet connection"));
    case "auth":
      return v4.default.createElement(T, {
        marginY: 1,
        flexDirection: "column"
      }, v4.default.createElement(C, {
        dimColor: !0
      }, "Teleport requires a Claude account"), v4.default.createElement(C, {
        dimColor: !0
      }, "Run ", v4.default.createElement(C, {
        bold: !0
      }, "/login"), ' and select "Claude account with subscription"'));
    case "api":
      return v4.default.createElement(T, {
        marginY: 1,
        flexDirection: "column"
      }, v4.default.createElement(C, {
        dimColor: !0
      }, "Sorry, Claude encountered an error"));
    case "other":
      return v4.default.createElement(T, {
        marginY: 1,
        flexDirection: "row"
      }, v4.default.createElement(C, {
        dimColor: !0
      }, "Sorry, Claude Code encountered an error"))
  }
}
// @from(Ln 469089, Col 4)
v4
// @from(Ln 469089, Col 8)
GL9 = "Updated"
// @from(Ln 469090, Col 2)
uR7 = "  "
// @from(Ln 469091, Col 4)
YL9 = w(() => {
  fA();
  c6();
  u8();
  yG();
  P4();
  T1();
  Jq0();
  L6A();
  zf();
  e9();
  I3();
  NX();
  K6();
  v4 = c(QA(), 1)
})
// @from(Ln 469108, Col 0)
function JL9(A) {
  let [Q, B] = c8A.useState(!1), [G, Z] = c8A.useState(null), [Y, J] = c8A.useState(null), X = c8A.useCallback(async (D) => {
    B(!0), Z(null), J(D), l("tengu_teleport_resume_session", {
      source: A,
      session_id: D.id
    });
    try {
      let W = await Yt(D.id);
      return PdA({
        sessionId: D.id
      }), B(!1), W
    } catch (W) {
      let K = {
        message: W instanceof uK ? W.message : W instanceof Error ? W.message : String(W),
        formattedMessage: W instanceof uK ? W.formattedMessage : void 0,
        isOperationError: W instanceof uK
      };
      return Z(K), B(!1), null
    }
  }, [A]), I = c8A.useCallback(() => {
    Z(null)
  }, []);
  return {
    resumeSession: X,
    isResuming: Q,
    error: G,
    selectedSession: Y,
    clearError: I
  }
}
// @from(Ln 469138, Col 4)
c8A
// @from(Ln 469139, Col 4)
XL9 = w(() => {
  Jt();
  XX();
  Z0();
  C0();
  c8A = c(QA(), 1)
})
// @from(Ln 469147, Col 0)
function cR7({
  onComplete: A,
  onCancel: Q,
  onError: B,
  isEmbedded: G = !1,
  source: Z
}) {
  let {
    resumeSession: Y,
    isResuming: J,
    error: X,
    selectedSession: I
  } = JL9(Z);
  IL9.useEffect(() => {
    l("tengu_teleport_started", {
      source: Z
    })
  }, [Z]);
  let D = async (K) => {
    let V = await Y(K);
    if (V) A(V);
    else if (X) {
      if (B) B(X.message, X.formattedMessage)
    }
  }, W = () => {
    l("tengu_teleport_cancelled", {}), Q()
  };
  if (J && I) return dU.default.createElement(T, {
    flexDirection: "column",
    padding: 1
  }, dU.default.createElement(T, {
    flexDirection: "row"
  }, dU.default.createElement(W9, null), dU.default.createElement(C, {
    bold: !0
  }, "Resuming session…")), dU.default.createElement(C, {
    dimColor: !0
  }, 'Loading "', I.title, '"…'));
  if (X && !B) return dU.default.createElement(T, {
    flexDirection: "column",
    padding: 1
  }, dU.default.createElement(C, {
    bold: !0,
    color: "error"
  }, "Failed to resume session"), dU.default.createElement(C, {
    dimColor: !0
  }, X.message), dU.default.createElement(T, {
    marginTop: 1
  }, dU.default.createElement(C, {
    dimColor: !0
  }, "Press ", dU.default.createElement(C, {
    bold: !0
  }, "Esc"), " to cancel")));
  return dU.default.createElement(ZL9, {
    onSelect: D,
    onCancel: W,
    isEmbedded: G
  })
}
// @from(Ln 469205, Col 0)
async function DL9() {
  return k("selectAndResumeTeleportTask: Starting teleport flow..."), new Promise(async (A) => {
    let {
      unmount: Q
    } = await Y5(dU.default.createElement(b5, null, dU.default.createElement(cR7, {
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
    })), FY(!1))
  })
}
// @from(Ln 469225, Col 4)
dU
// @from(Ln 469225, Col 8)
IL9
// @from(Ln 469226, Col 4)
WL9 = w(() => {
  fA();
  YL9();
  yG();
  XL9();
  Z0();
  hB();
  T1();
  Kf();
  dU = c(QA(), 1), IL9 = c(QA(), 1)
})
// @from(Ln 469238, Col 0)
function KL9(A) {
  A.command("add <name> <commandOrUrl> [args...]").description(`Add an MCP server to Claude Code.

Examples:
  # Add HTTP server:
  claude mcp add --transport http sentry https://mcp.sentry.dev/mcp

  # Add HTTP server with headers:
  claude mcp add --transport http corridor https://app.corridor.dev/api/mcp --header "Authorization: Bearer ..."

  # Add stdio server with environment variables:
  claude mcp add -e API_KEY=xxx my-server -- npx my-mcp-server

  # Add stdio server with subprocess flags:
  claude mcp add my-server -- my-command --some-flag arg1`).option("-s, --scope <scope>", "Configuration scope (local, user, or project)", "local").option("-t, --transport <transport>", "Transport type (stdio, sse, http). Defaults to stdio if not specified.").option("-e, --env <env...>", "Set environment variables (e.g. -e KEY=value)").option("-H, --header <header...>", 'Set WebSocket headers (e.g. -H "X-Api-Key: abc123" -H "X-Custom: value")').helpOption("-h, --help", "Display help for command").action(async (Q, B, G, Z) => {
    let Y = B,
      J = G;
    if (!Q) console.error("Error: Server name is required."), console.error("Usage: claude mcp add <name> <command> [args...]"), process.exit(1);
    else if (!Y) console.error("Error: Command is required when server name is provided."), console.error("Usage: claude mcp add <name> <command> [args...]"), process.exit(1);
    try {
      let X = z$A(Z.scope),
        I = qX9(Z.transport),
        D = Z.transport !== void 0,
        W = Y.startsWith("http://") || Y.startsWith("https://") || Y.startsWith("localhost") || Y.endsWith("/sse") || Y.endsWith("/mcp");
      if (l("tengu_mcp_add", {
          type: I,
          scope: X,
          source: "command",
          transport: I,
          transportExplicit: D,
          looksLikeUrl: W
        }), I === "sse") {
        if (!Y) console.error("Error: URL is required for SSE transport."), process.exit(1);
        let K = Z.header ? SP0(Z.header) : void 0;
        if (uf(Q, {
            type: "sse",
            url: Y,
            headers: K
          }, X), process.stdout.write(`Added SSE MCP server ${Q} with URL: ${Y} to ${X} config
`), K) process.stdout.write(`Headers: ${eA(K,null,2)}
`)
      } else if (I === "http") {
        if (!Y) console.error("Error: URL is required for HTTP transport."), process.exit(1);
        let K = Z.header ? SP0(Z.header) : void 0;
        if (uf(Q, {
            type: "http",
            url: Y,
            headers: K
          }, X), process.stdout.write(`Added HTTP MCP server ${Q} with URL: ${Y} to ${X} config
`), K) process.stdout.write(`Headers: ${eA(K,null,2)}
`)
      } else {
        if (!D && W) process.stderr.write(`
Warning: The command "${Y}" looks like a URL, but is being interpreted as a stdio server as --transport was not specified.
`), process.stderr.write(`If this is an HTTP server, use: claude mcp add --transport http ${Q} ${Y}
`), process.stderr.write(`If this is an SSE server, use: claude mcp add --transport sse ${Q} ${Y}
`);
        let K = qf0(Z.env);
        uf(Q, {
          type: "stdio",
          command: Y,
          args: J,
          env: K
        }, X), process.stdout.write(`Added stdio MCP server ${Q} with command: ${Y} ${J.join(" ")} to ${X} config
`)
      }
      process.stdout.write(`File modified: ${N$(X)}
`), process.exit(0)
    } catch (X) {
      console.error(X.message), process.exit(1)
    }
  })
}
// @from(Ln 469311, Col 4)
VL9 = w(() => {
  G$();
  PJ();
  fQ();
  A0();
  Z0()
})
// @from(Ln 469319, Col 0)
function Uy0(A, Q = process.argv) {
  for (let B = 0; B < Q.length; B++) {
    let G = Q[B];
    if (G?.startsWith(`${A}=`)) return G.slice(A.length + 1);
    if (G === A && B + 1 < Q.length) return Q[B + 1]
  }
  return
}
// @from(Ln 469327, Col 4)
FL9 = w(() => {
  KuA();
  $$A();
  P$1();
  T1()
})
// @from(Ln 469333, Col 4)
CL9 = {}
// @from(Ln 469351, Col 0)
function lR7() {
  try {
    let A = dB("policySettings");
    if (A) {
      let Q = UX9(A);
      l("tengu_managed_settings_loaded", {
        keyCount: Q.length,
        keys: Q.join(",")
      })
    }
  } catch {}
}
// @from(Ln 469364, Col 0)
function iR7() {
  if (process.env.ENABLE_TOOL_SEARCH !== void 0) return "external_tool_search_env_var";
  if (process.env.ENABLE_EXPERIMENTAL_MCP_CLI !== void 0) return "external_mcp_cli_env_var";
  return "external_default"
}
// @from(Ln 469370, Col 0)
function nR7() {
  try {
    let A = jJ(),
      Q = iR7(),
      B = !1;
    l("tengu_mcp_cli_status", {
      enabled: A,
      source: Q,
      legacy_env_var_set: !1
    })
  } catch {}
}
// @from(Ln 469383, Col 0)
function aR7() {
  let A = G1A(),
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
// @from(Ln 469397, Col 0)
function zL9() {
  S0((A) => ({
    ...A,
    hasCompletedOnboarding: !0,
    lastOnboardingVersion: {
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.1.7",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
      BUILD_TIME: "2026-01-13T22:55:21Z"
    }.VERSION
  }))
}
// @from(Ln 469411, Col 0)
async function $L9(A, Q, B, G) {
  if (a1(!1) || process.env.IS_DEMO) return !1;
  let Z = L1(),
    Y = !1;
  if (!Z.theme || !Z.hasCompletedOnboarding) Y = !0, await Promise.all([sI(), c$0()]), await new Promise(async (J) => {
    let {
      unmount: X
    } = await Y5(K3.default.createElement(b5, {
      onChangeAppState: dp
    }, K3.default.createElement(vJ, null, K3.default.createElement(hq9, {
      onDone: async () => {
        zL9(), X(), await sI(), J()
      }
    }))), FY(!1))
  });
  if (A !== "bypassPermissions" && process.env.CLAUBBIT !== "true") {
    let J = eZ(!1);
    await new Promise(async (I) => {
      let {
        unmount: D
      } = await Y5(K3.default.createElement(b5, null, K3.default.createElement(vJ, null, K3.default.createElement(BN9, {
        commands: B,
        onDone: async () => {
          if (D(), !J) await sI();
          I()
        }
      }))), FY(!1))
    }), R11(), RXA(), OF();
    let {
      errors: X
    } = kP();
    if (X.length === 0) await cN9();
    if (await J52()) {
      let I = qyA();
      await new Promise(async (D) => {
        let {
          unmount: W
        } = await Y5(K3.default.createElement(b5, null, K3.default.createElement(vJ, null, K3.default.createElement(LE1, {
          onDone: () => {
            W(), D()
          },
          isStandaloneDialog: !0,
          externalIncludes: I
        }))), FY(!1))
      })
    }
  }
  if (nw9(), L8A(), IS0(), await rVA()) await new Promise(async (J) => {
    let {
      unmount: X
    } = await Y5(K3.default.createElement(b5, null, K3.default.createElement(vJ, null, K3.default.createElement(bz1, {
      showIfAlreadyViewed: !1,
      location: Y ? "onboarding" : "policy_update_modal",
      onDone: async (I) => {
        if (I === "escape") {
          l("tengu_grove_policy_exited", {}), f6(0);
          return
        }
        if (X(), I !== "skip_rendering") await sI();
        J()
      }
    }))), FY(!1))
  });
  if (process.env.ANTHROPIC_API_KEY) {
    let J = TL(process.env.ANTHROPIC_API_KEY);
    if (iA1(J) === "new") await new Promise(async (I) => {
      let {
        unmount: D
      } = await Y5(K3.default.createElement(b5, {
        onChangeAppState: dp
      }, K3.default.createElement(vJ, null, K3.default.createElement(eC1, {
        customApiKeyTruncated: J,
        onDone: async () => {
          D(), await sI(), I()
        }
      }))), FY(!1))
    })
  }
  if ((A === "bypassPermissions" || Q) && !L1().bypassPermissionsModeAccepted) await new Promise(async (J) => {
    let {
      unmount: X
    } = await Y5(K3.default.createElement(b5, null, K3.default.createElement(vJ, null, K3.default.createElement(Xw9, {
      onAccept: () => {
        X(), J()
      }
    }))), FY(!1))
  });
  if (G && !L1().hasCompletedClaudeInChromeOnboarding) await new Promise(async (J) => {
    let {
      unmount: X
    } = await Y5(K3.default.createElement(b5, null, K3.default.createElement(vJ, null, K3.default.createElement(Dw9, {
      onDone: () => {
        X(), J()
      }
    }))), FY(!1))
  });
  return Y
}
// @from(Ln 469509, Col 0)
async function EL9(A, Q) {
  try {
    let B = await SO(A, Q);
    if (B.type === "connected") return "✓ Connected";
    else if (B.type === "needs-auth") return "⚠ Needs authentication";
    else return "✗ Failed to connect"
  } catch (B) {
    return "✗ Connection error"
  }
}
// @from(Ln 469520, Col 0)
function oR7() {
  S0((A) => ({
    ...A,
    numStartups: (A.numStartups ?? 0) + 1
  })), rR7(), fb0()?.add(1)
}
// @from(Ln 469526, Col 0)
async function rR7() {
  let [A, Q] = await Promise.all([nq(), pOA()]);
  l("tengu_startup_telemetry", {
    is_git: A,
    worktree_count: Q,
    sandbox_enabled: XB.isSandboxingEnabled(),
    are_unsandboxed_commands_allowed: XB.areUnsandboxedCommandsAllowed(),
    is_auto_bash_allowed_if_sandbox_enabled: XB.isAutoAllowBashIfSandboxedEnabled(),
    auto_updater_disabled: Su()
  })
}
// @from(Ln 469538, Col 0)
function sR7() {
  Vw9(), Hw9(), Cw9(), qw9(), ww9(), zw9(), Ow9(), x39().catch(() => {})
}
// @from(Ln 469542, Col 0)
function tR7() {
  if (p2()) {
    OB("info", "prefetch_system_context_non_interactive"), OF();
    return
  }
  if (eZ(!0)) OB("info", "prefetch_system_context_has_trust"), OF();
  else OB("info", "prefetch_system_context_skipped_no_trust")
}
// @from(Ln 469550, Col 0)
async function IU1(A, Q, B, G, Z, Y) {
  OB("info", "setup_started");
  let J = process.version.match(/^v(\d+)\./)?.[1];
  if (!J || parseInt(J) < 18) console.error(I1.bold.red("Error: Claude Code requires Node.js version 18 or higher.")), process.exit(1);
  if (Y) pw(lz(Y));
  let X = Date.now();
  fI0(), OB("info", "setup_hooks_captured", {
    duration_ms: Date.now() - X
  });
  try {
    let K = await X91();
    if (K.status === "restored") console.log(I1.yellow("Detected an interrupted Terminal.app setup. Your original settings have been restored. You may need to restart Terminal.app for the changes to take effect."));
    else if (K.status === "failed") console.error(I1.red(`Failed to restore Terminal.app settings. Please manually restore your original settings with: defaults import com.apple.Terminal ${K.backupPath}.`))
  } catch (K) {
    e(K instanceof Error ? K : Error(String(K)))
  }
  if (DO(A), OB("info", "setup_background_jobs_starting"), SI9(), uG9(), wI9(), MI9(), rA9(), A19(), xN9(), HY9(), LR0(), OR0(), pU9(), aJ9(QV(EQ())), OB("info", "setup_background_jobs_launched"), x9("setup_before_prefetch"), OB("info", "setup_prefetch_starting"), CI9(), G2B(), Aj(Xq()), fC1(), Qt(), ju2(), wN9(), ZV(), tR7(), Zw9(), tN9(), Ru(), UeQ(), sN9(), SBB(p2()), a1(process.env.CLAUDE_CODE_USE_BEDROCK) && !a1(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH)) xBB();
  iSA().catch((K) => e(K)), d9A([], q0()), x9("setup_after_prefetch");
  let {
    hasReleaseNotes: I
  } = hgA(L1().lastReleaseNotesSeen);
  if (I) await D89();
  let D = c9();
  if (setTimeout(() => D.abort(), 3000), YpA(o1(), D.signal, []), Q === "bypassPermissions" || B) {
    if (process.platform !== "win32" && typeof process.getuid === "function" && process.getuid() === 0 && process.env.IS_SANDBOX !== "1" && process.env.CLAUDE_CODE_BUBBLEWRAP !== "1") console.error("--dangerously-skip-permissions cannot be used with root/sudo privileges for security reasons"), process.exit(1)
  }
  let W = JG();
  if (W.lastCost !== void 0 && W.lastDuration !== void 0) l("tengu_exit", {
    last_session_cost: W.lastCost,
    last_session_api_duration: W.lastAPIDuration,
    last_session_tool_duration: W.lastToolDuration,
    last_session_duration: W.lastDuration,
    last_session_lines_added: W.lastLinesAdded,
    last_session_lines_removed: W.lastLinesRemoved,
    last_session_total_input_tokens: W.lastTotalInputTokens,
    last_session_total_output_tokens: W.lastTotalOutputTokens,
    last_session_total_cache_creation_input_tokens: W.lastTotalCacheCreationInputTokens,
    last_session_total_cache_read_input_tokens: W.lastTotalCacheReadInputTokens,
    last_session_id: W.lastSessionId
  })
}
// @from(Ln 469592, Col 0)
function eR7(A) {
  try {
    let Q = A.trim(),
      B = Q.startsWith("{") && Q.endsWith("}"),
      G;
    if (B) {
      if (!c5(Q)) process.stderr.write(I1.red(`Error: Invalid JSON provided to --settings
`)), process.exit(1);
      G = l$1("claude-settings", ".json"), bB(G, Q, "utf8")
    } else {
      let {
        resolvedPath: Z
      } = xI(vA(), A);
      if (!XU1(Z)) process.stderr.write(I1.red(`Error: Settings file not found: ${Z}
`)), process.exit(1);
      G = Z
    }
    pb0(G), vP()
  } catch (Q) {
    if (Q instanceof Error) e(Q);
    process.stderr.write(I1.red(`Error processing settings: ${Q instanceof Error?Q.message:String(Q)}
`)), process.exit(1)
  }
}
// @from(Ln 469617, Col 0)
function A_7(A) {
  try {
    let Q = xFB(A);
    tb0(Q), vP()
  } catch (Q) {
    if (Q instanceof Error) e(Q);
    process.stderr.write(I1.red(`Error processing --setting-sources: ${Q instanceof Error?Q.message:String(Q)}
`)), process.exit(1)
  }
}
// @from(Ln 469628, Col 0)
function Q_7() {
  x9("eagerLoadSettings_start");
  let A = Uy0("--settings");
  if (A) eR7(A);
  let Q = Uy0("--setting-sources");
  if (Q !== void 0) A_7(Q);
  x9("eagerLoadSettings_end")
}
// @from(Ln 469637, Col 0)
function B_7(A) {
  if (process.env.CLAUDE_CODE_ENTRYPOINT) return;
  let Q = process.argv.slice(2),
    B = Q.indexOf("mcp");
  if (B !== -1 && Q[B + 1] === "serve") {
    process.env.CLAUDE_CODE_ENTRYPOINT = "mcp";
    return
  }
  if (a1(process.env.CLAUDE_CODE_ACTION)) {
    process.env.CLAUDE_CODE_ENTRYPOINT = "claude-code-github-action";
    return
  }
  process.env.CLAUDE_CODE_ENTRYPOINT = A ? "sdk-cli" : "cli"
}
// @from(Ln 469651, Col 0)
async function G_7() {
  x9("main_function_start"), process.env.NoDefaultCurrentDirectoryInExePath = "1", II9(), process.on("exit", () => {
    I_7()
  }), process.on("SIGINT", () => {
    process.exit(0)
  }), x9("main_warning_handler_initialized");
  let A = process.argv.slice(2),
    Q = A.includes("-p") || A.includes("--print"),
    B = A.some((J) => J.startsWith("--sdk-url")),
    G = Q || B || !process.stdout.isTTY;
  db0(!G), B_7(G);
  let Y = (() => {
    if (process.env.GITHUB_ACTIONS === "true") return "github-action";
    if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-ts") return "sdk-typescript";
    if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-py") return "sdk-python";
    if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-cli") return "sdk-cli";
    if (process.env.CLAUDE_CODE_ENTRYPOINT === "claude-vscode") return "claude-vscode";
    if (process.env.CLAUDE_CODE_ENTRYPOINT === "local-agent") return "local-agent";
    if (process.env.CLAUDE_CODE_SESSION_ACCESS_TOKEN || process.env.CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR) return "remote";
    return "cli"
  })();
  cb0(Y), x9("main_client_type_determined"), Q_7(), x9("main_before_run"), process.title = "claude", await J_7(), x9("main_after_run")
}
// @from(Ln 469675, Col 0)
function Z_7(A) {
  let Q = 0,
    B = FY(A);
  if (B.stdin) l("tengu_stdin_interactive", {});
  return {
    ...B,
    onFlicker: (G, Z, Y, J) => {
      if (J === "resize") return;
      let X = Date.now();
      if (X - Q < 1000) l("tengu_flicker", {
        desiredHeight: G,
        actualHeight: Z,
        ink2Enabled: Y,
        reason: J
      });
      Q = X
    }
  }
}
// @from(Ln 469694, Col 0)
async function Y_7(A, Q) {
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