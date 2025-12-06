
// @from(Start 14092253, End 14107407)
function Gx3(A) {
  let [Q] = RI.useState(() => Kw()), [B, G] = RI.useState({
    ...Bx3,
    useExistingKey: !!Q,
    selectedApiKeyOption: Q ? "existing" : JU() ? "oauth" : "new"
  });
  EQ(), RI.default.useEffect(() => {
    GA("tengu_install_github_app_started", {})
  }, []);
  let Z = RI.useCallback(async () => {
    let T = [];
    try {
      aY1("gh --version", {
        stdio: "ignore"
      })
    } catch {
      T.push({
        title: "GitHub CLI not found",
        message: "GitHub CLI (gh) does not appear to be installed or accessible.",
        instructions: ["Install GitHub CLI from https://cli.github.com/", "macOS: brew install gh", "Windows: winget install --id GitHub.cli", "Linux: See installation instructions at https://github.com/cli/cli#installation"]
      })
    }
    try {
      let x = aY1("gh auth status -a", {
        encoding: "utf8"
      }).match(/Token scopes:.*$/m);
      if (x) {
        let p = x[0],
          u = [];
        if (!p.includes("repo")) u.push("repo");
        if (!p.includes("workflow")) u.push("workflow");
        if (u.length > 0) {
          G((e) => ({
            ...e,
            step: "error",
            error: `GitHub CLI is missing required permissions: ${u.join(", ")}.`,
            errorReason: "Missing required scopes",
            errorInstructions: [`Your GitHub CLI authentication is missing the "${u.join('" and "')}" scope${u.length>1?"s":""} needed to manage GitHub Actions and secrets.`, "", "To fix this, run:", "  gh auth refresh -h github.com -s repo,workflow", "", "This will add the necessary permissions to manage workflows and secrets."]
          }));
          return
        }
      }
    } catch {
      T.push({
        title: "GitHub CLI not authenticated",
        message: "GitHub CLI does not appear to be authenticated.",
        instructions: ["Run: gh auth login", "Follow the prompts to authenticate with GitHub", "Or set up authentication using environment variables or other methods"]
      })
    }
    let y = "";
    try {
      aY1("git rev-parse --is-inside-work-tree", {
        stdio: "ignore"
      });
      let x = aY1("git remote get-url origin", {
        encoding: "utf8"
      }).trim().match(/github\.com[:/]([^/]+\/[^/]+)(\.git)?$/);
      if (x) y = x[1]?.replace(/\.git$/, "") || ""
    } catch {}
    GA("tengu_install_github_app_step_completed", {
      step: "check-gh"
    }), G((v) => ({
      ...v,
      warnings: T,
      currentRepo: y,
      selectedRepoName: y,
      useCurrentRepo: !!y,
      step: T.length > 0 ? "warnings" : "choose-repo"
    }))
  }, []);
  RI.default.useEffect(() => {
    if (B.step === "check-gh") Z()
  }, [B.step, Z]);
  let I = RI.useCallback(async (T, y) => {
    G((v) => ({
      ...v,
      step: "creating",
      currentWorkflowInstallStep: 0
    }));
    try {
      await zK9(B.selectedRepoName, T, y, () => {
        G((v) => ({
          ...v,
          currentWorkflowInstallStep: v.currentWorkflowInstallStep + 1
        }))
      }, B.workflowAction === "skip", B.selectedWorkflows, B.authType, {
        useCurrentRepo: B.useCurrentRepo,
        workflowExists: B.workflowExists,
        secretExists: B.secretExists
      }), GA("tengu_install_github_app_step_completed", {
        step: "creating"
      }), G((v) => ({
        ...v,
        step: "success"
      }))
    } catch (v) {
      let x = v instanceof Error ? v.message : "Failed to set up GitHub Actions";
      if (x.includes("workflow file already exists")) GA("tengu_install_github_app_error", {
        reason: "workflow_file_exists"
      }), G((p) => ({
        ...p,
        step: "error",
        error: "A Claude workflow file already exists in this repository.",
        errorReason: "Workflow file conflict",
        errorInstructions: ["The file .github/workflows/claude.yml already exists", "You can either:", "  1. Delete the existing file and run this command again", "  2. Update the existing file manually using the template from:", `     ${Cx}`]
      }));
      else GA("tengu_install_github_app_error", {
        reason: "setup_github_actions_failed"
      }), G((p) => ({
        ...p,
        step: "error",
        error: x,
        errorReason: "GitHub Actions setup failed",
        errorInstructions: []
      }))
    }
  }, [B.selectedRepoName, B.workflowAction, B.selectedWorkflows, B.useCurrentRepo, B.workflowExists, B.secretExists, B.authType]);
  async function Y() {
    await cZ("https://github.com/apps/claude")
  }
  async function J(T) {
    try {
      let y = await QQ("gh", ["api", `repos/${T}`, "--jq", ".permissions.admin"]);
      if (y.code === 0) return {
        hasAccess: y.stdout.trim() === "true"
      };
      if (y.stderr.includes("404") || y.stderr.includes("Not Found")) return {
        hasAccess: !1,
        error: "repository_not_found"
      };
      return {
        hasAccess: !1
      }
    } catch {
      return {
        hasAccess: !1
      }
    }
  }
  async function W(T) {
    return (await QQ("gh", ["api", `repos/${T}/contents/.github/workflows/claude.yml`, "--jq", ".sha"])).code === 0
  }
  async function X() {
    let T = await QQ("gh", ["secret", "list", "--app", "actions", "--repo", B.selectedRepoName]);
    if (T.code === 0)
      if (T.stdout.split(`
`).some((x) => {
          return /^ANTHROPIC_API_KEY\s+/.test(x)
        })) G((x) => ({
        ...x,
        secretExists: !0,
        step: "check-existing-secret"
      }));
      else if (Q) G((x) => ({
      ...x,
      apiKeyOrOAuthToken: Q,
      useExistingKey: !0
    })), await I(Q, B.secretName);
    else G((x) => ({
      ...x,
      step: "api-key"
    }));
    else if (Q) G((y) => ({
      ...y,
      apiKeyOrOAuthToken: Q,
      useExistingKey: !0
    })), await I(Q, B.secretName);
    else G((y) => ({
      ...y,
      step: "api-key"
    }))
  }
  let V = async () => {
    if (B.step === "warnings") GA("tengu_install_github_app_step_completed", {
      step: "warnings"
    }), G((T) => ({
      ...T,
      step: "install-app"
    })), setTimeout(() => {
      Y()
    }, 0);
    else if (B.step === "choose-repo") {
      let T = B.useCurrentRepo ? B.currentRepo : B.selectedRepoName;
      if (!T.trim()) return;
      let y = [];
      if (T.includes("github.com")) {
        let p = T.match(/github\.com[:/]([^/]+\/[^/]+)(\.git)?$/);
        if (!p) y.push({
          title: "Invalid GitHub URL format",
          message: "The repository URL format appears to be invalid.",
          instructions: ["Use format: owner/repo or https://github.com/owner/repo", "Example: anthropics/claude-cli"]
        });
        else T = p[1]?.replace(/\.git$/, "") || ""
      }
      if (!T.includes("/")) y.push({
        title: "Repository format warning",
        message: 'Repository should be in format "owner/repo"',
        instructions: ["Use format: owner/repo", "Example: anthropics/claude-cli"]
      });
      let v = await J(T);
      if (v.error === "repository_not_found") y.push({
        title: "Repository not found",
        message: `Repository ${T} was not found or you don't have access.`,
        instructions: [`Check that the repository name is correct: ${T}`, "Ensure you have access to this repository", 'For private repositories, make sure your GitHub token has the "repo" scope', "You can add the repo scope with: gh auth refresh -h github.com -s repo,workflow"]
      });
      else if (!v.hasAccess) y.push({
        title: "Admin permissions required",
        message: `You might need admin permissions on ${T} to set up GitHub Actions.`,
        instructions: ["Repository admins can install GitHub Apps and set secrets", "Ask a repository admin to run this command if setup fails", "Alternatively, you can use the manual setup instructions"]
      });
      let x = await W(T);
      if (y.length > 0) {
        let p = [...B.warnings, ...y];
        G((u) => ({
          ...u,
          selectedRepoName: T,
          workflowExists: x,
          warnings: p,
          step: "warnings"
        }))
      } else GA("tengu_install_github_app_step_completed", {
        step: "choose-repo"
      }), G((p) => ({
        ...p,
        selectedRepoName: T,
        workflowExists: x,
        step: "install-app"
      })), setTimeout(() => {
        Y()
      }, 0)
    } else if (B.step === "install-app")
      if (GA("tengu_install_github_app_step_completed", {
          step: "install-app"
        }), B.workflowExists) G((T) => ({
        ...T,
        step: "check-existing-workflow"
      }));
      else G((T) => ({
        ...T,
        step: "select-workflows"
      }));
    else if (B.step === "check-existing-workflow") return;
    else if (B.step === "select-workflows") return;
    else if (B.step === "check-existing-secret")
      if (GA("tengu_install_github_app_step_completed", {
          step: "check-existing-secret"
        }), B.useExistingSecret) await I(null, B.secretName);
      else await I(B.apiKeyOrOAuthToken, B.secretName);
    else if (B.step === "api-key") {
      if (B.selectedApiKeyOption === "oauth") return;
      let T = B.selectedApiKeyOption === "existing" ? Q : B.apiKeyOrOAuthToken;
      if (!T) {
        GA("tengu_install_github_app_error", {
          reason: "api_key_missing"
        }), G((v) => ({
          ...v,
          step: "error",
          error: "API key is required"
        }));
        return
      }
      G((v) => ({
        ...v,
        apiKeyOrOAuthToken: T,
        useExistingKey: B.selectedApiKeyOption === "existing"
      }));
      let y = await QQ("gh", ["secret", "list", "--app", "actions", "--repo", B.selectedRepoName]);
      if (y.code === 0)
        if (y.stdout.split(`
`).some((p) => {
            return /^ANTHROPIC_API_KEY\s+/.test(p)
          })) GA("tengu_install_github_app_step_completed", {
          step: "api-key"
        }), G((p) => ({
          ...p,
          secretExists: !0,
          step: "check-existing-secret"
        }));
        else GA("tengu_install_github_app_step_completed", {
          step: "api-key"
        }), await I(T, B.secretName);
      else GA("tengu_install_github_app_step_completed", {
        step: "api-key"
      }), await I(T, B.secretName)
    }
  }, F = (T) => {
    G((y) => ({
      ...y,
      selectedRepoName: T
    }))
  }, K = (T) => {
    G((y) => ({
      ...y,
      apiKeyOrOAuthToken: T
    }))
  }, D = (T) => {
    G((y) => ({
      ...y,
      selectedApiKeyOption: T
    }))
  }, H = RI.useCallback(() => {
    GA("tengu_install_github_app_step_completed", {
      step: "api-key"
    }), G((T) => ({
      ...T,
      step: "oauth-flow"
    }))
  }, []), C = RI.useCallback((T) => {
    GA("tengu_install_github_app_step_completed", {
      step: "oauth-flow"
    }), G((y) => ({
      ...y,
      apiKeyOrOAuthToken: T,
      useExistingKey: !1,
      secretName: "CLAUDE_CODE_OAUTH_TOKEN",
      authType: "oauth_token"
    })), I(T, "CLAUDE_CODE_OAUTH_TOKEN")
  }, [I]), E = RI.useCallback(() => {
    G((T) => ({
      ...T,
      step: "api-key"
    }))
  }, []), U = (T) => {
    if (T && !/^[a-zA-Z0-9_]+$/.test(T)) return;
    G((y) => ({
      ...y,
      secretName: T
    }))
  }, q = (T) => {
    G((y) => ({
      ...y,
      useCurrentRepo: T,
      selectedRepoName: T ? y.currentRepo : ""
    }))
  }, w = (T) => {
    G((y) => ({
      ...y,
      useExistingKey: T
    }))
  }, N = (T) => {
    G((y) => ({
      ...y,
      useExistingSecret: T,
      secretName: T ? "ANTHROPIC_API_KEY" : ""
    }))
  }, R = async (T) => {
    if (T === "exit") {
      A.onDone("Installation cancelled by user");
      return
    }
    if (GA("tengu_install_github_app_step_completed", {
        step: "check-existing-workflow"
      }), G((y) => ({
        ...y,
        workflowAction: T
      })), T === "skip" || T === "update")
      if (Q) await X();
      else G((y) => ({
        ...y,
        step: "api-key"
      }))
  };
  switch (f1(() => {
      if (B.step === "success" || B.step === "error") {
        if (B.step === "success") GA("tengu_install_github_app_completed", {});
        A.onDone(B.step === "success" ? "GitHub Actions setup complete!" : B.error ? `Couldn't install GitHub App: ${B.error}
For manual setup instructions, see: ${Cx}` : `GitHub App installation failed
For manual setup instructions, see: ${Cx}`)
      }
    }), B.step) {
    case "check-gh":
      return RI.default.createElement(pF9, null);
    case "warnings":
      return RI.default.createElement(DK9, {
        warnings: B.warnings,
        onContinue: V
      });
    case "choose-repo":
      return RI.default.createElement(iF9, {
        currentRepo: B.currentRepo,
        useCurrentRepo: B.useCurrentRepo,
        repoUrl: B.selectedRepoName,
        onRepoUrlChange: F,
        onToggleUseCurrentRepo: q,
        onSubmit: V
      });
    case "install-app":
      return RI.default.createElement(eF9, {
        repoUrl: B.selectedRepoName,
        onSubmit: V
      });
    case "check-existing-workflow":
      return RI.default.createElement(FK9, {
        repoName: B.selectedRepoName,
        onSelectAction: R
      });
    case "check-existing-secret":
      return RI.default.createElement(QK9, {
        useExistingSecret: B.useExistingSecret,
        secretName: B.secretName,
        onToggleUseExistingSecret: N,
        onSecretNameChange: U,
        onSubmit: V
      });
    case "api-key":
      return RI.default.createElement(GK9, {
        existingApiKey: Q,
        useExistingKey: B.useExistingKey,
        apiKeyOrOAuthToken: B.apiKeyOrOAuthToken,
        onApiKeyChange: K,
        onToggleUseExistingKey: w,
        onSubmit: V,
        onCreateOAuthToken: JU() ? H : void 0,
        selectedOption: B.selectedApiKeyOption,
        onSelectOption: D
      });
    case "creating":
      return RI.default.createElement(IK9, {
        currentWorkflowInstallStep: B.currentWorkflowInstallStep,
        secretExists: B.secretExists,
        useExistingSecret: B.useExistingSecret,
        secretName: B.secretName,
        skipWorkflow: B.workflowAction === "skip",
        selectedWorkflows: B.selectedWorkflows
      });
    case "success":
      return RI.default.createElement(JK9, {
        secretExists: B.secretExists,
        useExistingSecret: B.useExistingSecret,
        secretName: B.secretName,
        skipWorkflow: B.workflowAction === "skip"
      });
    case "error":
      return RI.default.createElement(XK9, {
        error: B.error,
        errorReason: B.errorReason,
        errorInstructions: B.errorInstructions
      });
    case "select-workflows":
      return RI.default.createElement(CK9, {
        defaultSelections: B.selectedWorkflows,
        onSubmit: (T) => {
          if (GA("tengu_install_github_app_step_completed", {
              step: "select-workflows"
            }), G((y) => ({
              ...y,
              selectedWorkflows: T
            })), Q) X();
          else G((y) => ({
            ...y,
            step: "api-key"
          }))
        }
      });
    case "oauth-flow":
      return RI.default.createElement(wK9, {
        onSuccess: C,
        onCancel: E
      })
  }
}
// @from(Start 14107412, End 14107414)
RI
// @from(Start 14107416, End 14107419)
Bx3
// @from(Start 14107421, End 14107424)
Zx3
// @from(Start 14107426, End 14107429)
NK9
// @from(Start 14107435, End 14108473)
LK9 = L(() => {
  hA();
  gB();
  Q4();
  _8();
  gM();
  lF9();
  nF9();
  AK9();
  BK9();
  ZK9();
  YK9();
  WK9();
  VK9();
  KK9();
  HK9();
  EK9();
  UK9();
  qK9();
  q0();
  RI = BA(VA(), 1), Bx3 = {
    step: "check-gh",
    selectedRepoName: "",
    currentRepo: "",
    useCurrentRepo: !1,
    apiKeyOrOAuthToken: "",
    useExistingKey: !0,
    currentWorkflowInstallStep: 0,
    warnings: [],
    secretExists: !1,
    secretName: "ANTHROPIC_API_KEY",
    useExistingSecret: !0,
    workflowExists: !1,
    selectedWorkflows: ["claude", "claude-review"],
    selectedApiKeyOption: "new",
    authType: "api_key"
  };
  Zx3 = {
    type: "local-jsx",
    name: "install-github-app",
    description: "Set up Claude GitHub Actions for a repository",
    isEnabled: () => !process.env.DISABLE_INSTALL_GITHUB_APP_COMMAND && !N_(),
    isHidden: !1,
    async call(A) {
      return RI.default.createElement(Gx3, {
        onDone: A
      })
    },
    userFacingName() {
      return "install-github-app"
    }
  }, NK9 = Zx3
})
// @from(Start 14108476, End 14111772)
function XF0({
  servers: A,
  onSelectServer: Q,
  onComplete: B
}) {
  let [G] = qB(), Z = EQ();
  if (A.length === 0) return null;
  let I = F2A(),
    Y = A.some((W) => W.client.type === "failed"),
    J = A.map((W) => {
      let X = "",
        V = "",
        F = "";
      if (W.client.type === "disabled") V = ZB("inactive", G)(H1.radioOff), X = "disabled · Enter to view details", F = `${V} ${X}`;
      else if (W.client.type === "connected") V = ZB("success", G)(H1.tick), X = "connected · Enter to view details", F = `${V} ${X}`;
      else if (W.client.type === "pending") {
        V = ZB("inactive", G)(H1.radioOff);
        let {
          reconnectAttempt: K,
          maxReconnectAttempts: D
        } = W.client;
        if (K && D) X = `reconnecting (${K}/${D})…`;
        else X = "connecting…";
        F = `${V} ${X}`
      } else if (W.client.type === "needs-auth") V = ZB("warning", G)(H1.triangleUpOutline), X = "needs authentication · Enter to login", F = `${V} ${X}`;
      else if (W.client.type === "failed") V = ZB("error", G)(H1.cross), X = "failed · Enter to view details", F = `${V} ${X}`;
      else V = ZB("error", G)(H1.cross), X = "failed", F = `${V} ${X}`;
      return {
        label: tA.bold(W.name),
        value: W.name,
        description: F,
        dimDescription: !1
      }
    });
  return $Y.default.createElement(S, {
    flexDirection: "column"
  }, $Y.default.createElement(lY1, null), $Y.default.createElement(S, {
    flexDirection: "column",
    paddingX: 1,
    borderStyle: "round",
    borderDimColor: !0
  }, $Y.default.createElement(S, {
    marginBottom: 1
  }, $Y.default.createElement($, {
    bold: !0
  }, "Manage MCP servers")), $Y.default.createElement(M0, {
    options: J,
    onChange: (W) => {
      let X = A.find((V) => V.name === W);
      if (X) Q(X)
    },
    onCancel: () => B("MCP dialog dismissed", {
      display: "system"
    })
  }), Y && $Y.default.createElement(S, {
    marginTop: 1
  }, $Y.default.createElement($, {
    dimColor: !0
  }, "※ Tip:", " ", I ? `Error logs will be shown inline. Log files are also saved in
  ${mj.baseLogs()}` : `Run claude --debug to see logs inline, or view log files in
  ${mj.baseLogs()}`)), $Y.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, $Y.default.createElement($, {
    dimColor: !0
  }, "MCP Config locations (by scope):"), ["user", "project", "local"].map((W) => $Y.default.createElement(S, {
    key: W,
    flexDirection: "column",
    marginLeft: 1
  }, $Y.default.createElement($, {
    dimColor: !0
  }, "• ", iQA(W), ":"), $Y.default.createElement(S, {
    marginLeft: 2
  }, $Y.default.createElement($, {
    dimColor: !0
  }, "• ", YN(W)))))), $Y.default.createElement(S, {
    marginTop: 1,
    marginLeft: 0
  }, $Y.default.createElement($, {
    dimColor: !0
  }, "For help configuring MCP servers, see:", " ", $Y.default.createElement(h4, {
    url: "https://code.claude.com/docs/en/mcp"
  }, "https://code.claude.com/docs/en/mcp")))), $Y.default.createElement(S, {
    marginLeft: 3
  }, $Y.default.createElement($, {
    dimColor: !0
  }, Z.pending ? $Y.default.createElement($Y.default.Fragment, null, "Press ", Z.keyName, " again to exit") : $Y.default.createElement($Y.default.Fragment, null, "Esc to exit"))))
}
// @from(Start 14111777, End 14111779)
$Y
// @from(Start 14111785, End 14111903)
VF0 = L(() => {
  hA();
  R9();
  V0();
  J5();
  Q4();
  V9();
  F9();
  eV0();
  nX();
  hA();
  $Y = BA(VA(), 1)
})
// @from(Start 14111906, End 14112317)
function rY1({
  serverToolsCount: A,
  serverPromptsCount: Q,
  serverResourcesCount: B
}) {
  let G = [];
  if (A > 0) G.push("tools");
  if (B > 0) G.push("resources");
  if (Q > 0) G.push("prompts");
  return sY1.default.createElement(S, null, sY1.default.createElement($, {
    bold: !0
  }, "Capabilities: "), sY1.default.createElement($, {
    color: "text"
  }, G.length > 0 ? G.join(" · ") : "none"))
}
// @from(Start 14112322, End 14112325)
sY1
// @from(Start 14112331, End 14112377)
FF0 = L(() => {
  hA();
  sY1 = BA(VA(), 1)
})
// @from(Start 14112380, End 14112886)
function oY1(A, Q) {
  switch (A.client.type) {
    case "connected":
      return {
        message: `Reconnected to ${Q}.`, success: !0
      };
    case "needs-auth":
      return {
        message: `${Q} requires authentication. Use the 'Authenticate' option.`, success: !1
      };
    case "failed":
      return {
        message: `Failed to reconnect to ${Q}.`, success: !1
      };
    default:
      return {
        message: `Unknown result when reconnecting to ${Q}.`, success: !1
      }
  }
}
// @from(Start 14112888, End 14113008)
function tY1(A, Q) {
  let B = A instanceof Error ? A.message : String(A);
  return `Error reconnecting to ${Q}: ${B}`
}
// @from(Start 14113010, End 14117272)
function KF0({
  server: A,
  serverToolsCount: Q,
  onViewTools: B,
  onCancel: G,
  onComplete: Z
}) {
  let [I] = qB(), Y = EQ(), [J] = OQ(), W = gXA(), X = uXA(), [V, F] = k4.useState(!1), K = k4.default.useCallback(async () => {
    let E = A.client.type !== "disabled";
    try {
      await X(A.name), G()
    } catch (U) {
      Z(`Failed to ${E?"disable":"enable"} MCP server '${A.name}': ${U instanceof Error?U.message:String(U)}`)
    }
  }, [A.client.type, A.name, X, G, Z]), D = String(A.name).charAt(0).toUpperCase() + String(A.name).slice(1), H = eY1(J.mcp.commands, A.name).length, C = [];
  if (A.client.type !== "disabled" && Q > 0) C.push({
    label: "View tools",
    value: "tools"
  });
  if (A.client.type !== "disabled") C.push({
    label: "Reconnect",
    value: "reconnectMcpServer"
  });
  if (C.push({
      label: A.client.type !== "disabled" ? "Disable" : "Enable",
      value: "toggle-enabled"
    }), C.length === 0) C.push({
    label: "Back",
    value: "back"
  });
  if (V) return k4.default.createElement(S, {
    flexDirection: "column",
    gap: 1,
    padding: 1
  }, k4.default.createElement($, {
    color: "text"
  }, "Reconnecting to ", k4.default.createElement($, {
    bold: !0
  }, A.name)), k4.default.createElement(S, null, k4.default.createElement(g4, null), k4.default.createElement($, null, " Restarting MCP server process")), k4.default.createElement($, {
    dimColor: !0
  }, "This may take a few moments."));
  return k4.default.createElement(k4.default.Fragment, null, k4.default.createElement(S, {
    flexDirection: "column",
    paddingX: 1,
    borderStyle: "round"
  }, k4.default.createElement(S, {
    marginBottom: 1
  }, k4.default.createElement($, {
    bold: !0
  }, D, " MCP Server")), k4.default.createElement(S, {
    flexDirection: "column",
    gap: 0
  }, k4.default.createElement(S, null, k4.default.createElement($, {
    bold: !0
  }, "Status: "), A.client.type === "disabled" ? k4.default.createElement($, null, ZB("inactive", I)(H1.radioOff), " disabled") : A.client.type === "connected" ? k4.default.createElement($, null, ZB("success", I)(H1.tick), " connected") : A.client.type === "pending" ? k4.default.createElement(k4.default.Fragment, null, k4.default.createElement($, {
    dimColor: !0
  }, H1.radioOff), k4.default.createElement($, null, " connecting…")) : k4.default.createElement($, null, ZB("error", I)(H1.cross), " failed")), k4.default.createElement(S, null, k4.default.createElement($, {
    bold: !0
  }, "Command: "), k4.default.createElement($, {
    dimColor: !0
  }, A.config.command)), A.config.args && A.config.args.length > 0 && k4.default.createElement(S, null, k4.default.createElement($, {
    bold: !0
  }, "Args: "), k4.default.createElement($, {
    dimColor: !0
  }, A.config.args.join(" "))), k4.default.createElement(S, null, k4.default.createElement($, {
    bold: !0
  }, "Config location: "), k4.default.createElement($, {
    dimColor: !0
  }, YN(GYA(A.name)?.scope ?? "dynamic"))), A.client.type === "connected" && k4.default.createElement(rY1, {
    serverToolsCount: Q,
    serverPromptsCount: H,
    serverResourcesCount: J.mcp.resources[A.name]?.length || 0
  }), A.client.type === "connected" && Q > 0 && k4.default.createElement(S, null, k4.default.createElement($, {
    bold: !0
  }, "Tools: "), k4.default.createElement($, {
    dimColor: !0
  }, Q, " tools"))), C.length > 0 && k4.default.createElement(S, {
    marginTop: 1
  }, k4.default.createElement(M0, {
    options: C,
    onChange: async (E) => {
      if (E === "tools") B();
      else if (E === "reconnectMcpServer") {
        F(!0);
        try {
          let U = await W(A.name),
            {
              message: q
            } = oY1(U, A.name);
          Z?.(q)
        } catch (U) {
          Z?.(tY1(U, A.name))
        } finally {
          F(!1)
        }
      } else if (E === "toggle-enabled") await K();
      else if (E === "back") G()
    },
    onCancel: G
  }))), k4.default.createElement(S, {
    marginLeft: 3
  }, k4.default.createElement($, {
    dimColor: !0
  }, Y.pending ? k4.default.createElement(k4.default.Fragment, null, "Press ", Y.keyName, " again to exit") : k4.default.createElement(k4.default.Fragment, null, "Esc to go back"))))
}
// @from(Start 14117277, End 14117279)
k4
// @from(Start 14117285, End 14117404)
DF0 = L(() => {
  hA();
  J5();
  Q4();
  V9();
  z9();
  nX();
  tM();
  FF0();
  $QA();
  DY();
  k4 = BA(VA(), 1)
})
// @from(Start 14117407, End 14125399)
function HF0({
  server: A,
  serverToolsCount: Q,
  onViewTools: B,
  onCancel: G,
  onComplete: Z
}) {
  let [I] = qB(), Y = EQ(), [J, W] = L2.default.useState(!1), [X, V] = L2.default.useState(null), [F, K] = OQ(), [D, H] = L2.default.useState(null), [C, E] = L2.useState(!1), [U, q] = L2.useState(null);
  f1((u, e) => {
    if (e.escape && J) {
      if (U) U.abort();
      W(!1), H(null), q(null)
    }
  });
  let w = String(A.name).charAt(0).toUpperCase() + String(A.name).slice(1),
    N = eY1(F.mcp.commands, A.name).length,
    R = gXA(),
    T = uXA(),
    y = L2.default.useCallback(async () => {
      let u = A.client.type !== "disabled";
      try {
        await T(A.name), G()
      } catch (e) {
        Z?.(`Failed to ${u?"disable":"enable"} MCP server '${A.name}': ${e instanceof Error?e.message:String(e)}`)
      }
    }, [A.client.type, A.name, T, G, Z]),
    v = L2.default.useCallback(async () => {
      W(!0), V(null);
      let u = new AbortController;
      q(u);
      try {
        if (A.isAuthenticated && A.config) await Te1(A.name, A.config);
        if (A.config) {
          await M22(A.name, A.config, H, u.signal), GA("tengu_mcp_auth_config_authenticate", {
            wasAuthenticated: A.isAuthenticated
          });
          let e = await R(A.name);
          if (e.client.type === "connected") {
            let l = A.isAuthenticated ? `Authentication successful. Reconnected to ${A.name}.` : `Authentication successful. Connected to ${A.name}.`;
            Z?.(l)
          } else if (e.client.type === "needs-auth") Z?.("Authentication successful, but server still requires authentication. You may need to manually restart Claude Code.");
          else y0(A.name, "Reconnection failed after authentication"), Z?.("Authentication successful, but server reconnection failed. You may need to manually restart Claude Code for the changes to take effect.")
        }
      } catch (e) {
        if (e instanceof Error && !(e instanceof sQ1)) V(e.message)
      } finally {
        W(!1), q(null)
      }
    }, [A.isAuthenticated, A.config, A.name, Z, R, H]),
    x = async () => {
      if (A.config) await Te1(A.name, A.config), GA("tengu_mcp_auth_config_clear", {}), await IYA(A.name, {
        ...A.config,
        scope: A.scope
      }), K((u) => {
        let e = u.mcp.clients.map((o) => o.name === A.name ? {
            ...o,
            type: "failed"
          } : o),
          l = MK9(u.mcp.tools, A.name),
          k = OK9(u.mcp.commands, A.name),
          m = RK9(u.mcp.resources, A.name);
        return {
          ...u,
          mcp: {
            clients: e,
            tools: l,
            commands: k,
            resources: m
          }
        }
      }), Z?.(`Authentication cleared for ${A.name}.`)
    };
  if (J) return L2.default.createElement(S, {
    flexDirection: "column",
    gap: 1,
    padding: 1
  }, L2.default.createElement($, {
    color: "claude"
  }, "Authenticating with ", A.name, "…"), L2.default.createElement(S, null, L2.default.createElement(g4, null), L2.default.createElement($, null, " A browser window will open for authentication")), D && L2.default.createElement(S, {
    flexDirection: "column"
  }, L2.default.createElement($, {
    dimColor: !0
  }, "If your browser doesn't open automatically, copy this URL manually:"), L2.default.createElement(h4, {
    url: D
  })), L2.default.createElement(S, {
    marginLeft: 3
  }, L2.default.createElement($, {
    dimColor: !0
  }, "Return here after authenticating in your browser. Press Esc to go back.")));
  if (C) return L2.default.createElement(S, {
    flexDirection: "column",
    gap: 1,
    padding: 1
  }, L2.default.createElement($, {
    color: "text"
  }, "Reconnecting to ", L2.default.createElement($, {
    bold: !0
  }, A.name), "…"), L2.default.createElement(S, null, L2.default.createElement(g4, null), L2.default.createElement($, null, " Establishing connection to MCP server")), L2.default.createElement($, {
    dimColor: !0
  }, "This may take a few moments."));
  let p = [];
  if (A.client.type === "connected" && Q > 0) p.push({
    label: "View tools",
    value: "tools"
  });
  if (A.isAuthenticated) p.push({
    label: "Re-authenticate",
    value: "reauth"
  }), p.push({
    label: "Clear authentication",
    value: "clear-auth"
  });
  if (!A.isAuthenticated) p.push({
    label: "Authenticate",
    value: "auth"
  });
  if (A.client.type !== "needs-auth" && A.client.type !== "disabled") p.push({
    label: "Reconnect",
    value: "reconnectMcpServer"
  });
  if (p.push({
      label: A.client.type !== "disabled" ? "Disable" : "Enable",
      value: "toggle-enabled"
    }), p.length === 0) p.push({
    label: "Back",
    value: "back"
  });
  return L2.default.createElement(L2.default.Fragment, null, L2.default.createElement(S, {
    flexDirection: "column",
    paddingX: 1,
    borderStyle: "round"
  }, L2.default.createElement(S, {
    marginBottom: 1
  }, L2.default.createElement($, {
    bold: !0
  }, w, " MCP Server")), L2.default.createElement(S, {
    flexDirection: "column",
    gap: 0
  }, L2.default.createElement(S, null, L2.default.createElement($, {
    bold: !0
  }, "Status: "), A.client.type === "disabled" ? L2.default.createElement($, null, ZB("inactive", I)(H1.radioOff), " disabled") : A.client.type === "connected" ? L2.default.createElement(L2.default.Fragment, null, L2.default.createElement($, null, ZB("success", I)(H1.tick), " connected"), A.isAuthenticated && L2.default.createElement($, null, "  ", ZB("success", I)(H1.tick), " authenticated")) : A.client.type === "pending" ? L2.default.createElement(L2.default.Fragment, null, L2.default.createElement($, {
    dimColor: !0
  }, H1.radioOff), L2.default.createElement($, null, " connecting…")) : A.client.type === "needs-auth" ? L2.default.createElement($, null, ZB("warning", I)(H1.triangleUpOutline), " needs authentication") : L2.default.createElement($, null, ZB("error", I)(H1.cross), " failed")), L2.default.createElement(S, null, L2.default.createElement($, {
    bold: !0
  }, "URL: "), L2.default.createElement($, {
    dimColor: !0
  }, A.config.url)), L2.default.createElement(S, null, L2.default.createElement($, {
    bold: !0
  }, "Config location: "), L2.default.createElement($, {
    dimColor: !0
  }, YN(GYA(A.name)?.scope ?? "dynamic"))), A.client.type === "connected" && L2.default.createElement(rY1, {
    serverToolsCount: Q,
    serverPromptsCount: N,
    serverResourcesCount: F.mcp.resources[A.name]?.length || 0
  }), A.client.type === "connected" && Q > 0 && L2.default.createElement(S, null, L2.default.createElement($, {
    bold: !0
  }, "Tools: "), L2.default.createElement($, {
    dimColor: !0
  }, Q, " tools"))), X && L2.default.createElement(S, {
    marginTop: 1
  }, L2.default.createElement($, {
    color: "error"
  }, "Error: ", X)), p.length > 0 && L2.default.createElement(S, {
    marginTop: 1
  }, L2.default.createElement(M0, {
    options: p,
    onChange: async (u) => {
      switch (u) {
        case "tools":
          B();
          break;
        case "auth":
        case "reauth":
          await v();
          break;
        case "clear-auth":
          await x();
          break;
        case "reconnectMcpServer":
          E(!0);
          try {
            let e = await R(A.name),
              {
                message: l
              } = oY1(e, A.name);
            Z?.(l)
          } catch (e) {
            Z?.(tY1(e, A.name))
          } finally {
            E(!1)
          }
          break;
        case "toggle-enabled":
          await y();
          break;
        case "back":
          G();
          break
      }
    },
    onCancel: G
  }))), L2.default.createElement(S, {
    marginLeft: 3
  }, L2.default.createElement($, {
    dimColor: !0
  }, Y.pending ? L2.default.createElement(L2.default.Fragment, null, "Press ", Y.keyName, " again to exit") : L2.default.createElement(L2.default.Fragment, null, "Esc to go back"))))
}
// @from(Start 14125404, End 14125406)
L2
// @from(Start 14125412, End 14125572)
CF0 = L(() => {
  hA();
  J5();
  q0();
  Q4();
  V9();
  rQ1();
  DY();
  Ok();
  z9();
  g1();
  nX();
  tM();
  FF0();
  hA();
  $QA();
  L2 = BA(VA(), 1)
})
// @from(Start 14125575, End 14127327)
function EF0({
  server: A,
  onSelectTool: Q,
  onBack: B
}) {
  let G = EQ(),
    [Z] = OQ(),
    I = Yz.default.useMemo(() => {
      if (A.client.type !== "connected") return [];
      return zSA(Z.mcp.tools, A.name)
    }, [A, Z.mcp.tools]),
    Y = I.map((J, W) => {
      let X = AJ1(J.name, A.name),
        V = J.userFacingName ? J.userFacingName({}) : X,
        F = QJ1(V),
        K = J.isReadOnly?.({}) ?? !1,
        D = J.isDestructive?.({}) ?? !1,
        H = J.isOpenWorld?.({}) ?? !1,
        C = [];
      if (K) C.push("read-only");
      if (D) C.push("destructive");
      if (H) C.push("open-world");
      return {
        label: F,
        value: W.toString(),
        description: C.length > 0 ? C.join(", ") : void 0,
        descriptionColor: D ? "error" : K ? "success" : void 0
      }
    });
  return Yz.default.createElement(S, {
    flexDirection: "column"
  }, Yz.default.createElement(S, {
    flexDirection: "column",
    paddingX: 1,
    borderStyle: "round"
  }, Yz.default.createElement(S, {
    marginBottom: 1
  }, Yz.default.createElement($, {
    bold: !0
  }, "Tools for ", A.name), Yz.default.createElement($, {
    dimColor: !0
  }, " (", I.length, " tools)")), I.length === 0 ? Yz.default.createElement($, {
    dimColor: !0
  }, "No tools available") : Yz.default.createElement(M0, {
    options: Y,
    onChange: (J) => {
      let W = parseInt(J),
        X = I[W];
      if (X) Q(X, W)
    },
    onCancel: B
  })), Yz.default.createElement(S, {
    marginLeft: 3
  }, Yz.default.createElement($, {
    dimColor: !0
  }, G.pending ? Yz.default.createElement(Yz.default.Fragment, null, "Press ", G.keyName, " again to exit") : Yz.default.createElement(Yz.default.Fragment, null, "Esc to go back"))))
}
// @from(Start 14127332, End 14127334)
Yz
// @from(Start 14127340, End 14127417)
zF0 = L(() => {
  hA();
  J5();
  nX();
  z9();
  Q4();
  Yz = BA(VA(), 1)
})
// @from(Start 14127420, End 14130689)
function UF0({
  tool: A,
  server: Q,
  onBack: B
}) {
  let G = EQ(),
    [Z, I] = $3.default.useState("");
  f1((K, D) => {
    if (D.escape) B()
  });
  let Y = AJ1(A.name, Q.name),
    J = A.userFacingName ? A.userFacingName({}) : Y,
    W = QJ1(J),
    X = A.isReadOnly?.({}) ?? !1,
    V = A.isDestructive?.({}) ?? !1,
    F = A.isOpenWorld?.({}) ?? !1;
  return $3.default.useEffect(() => {
    async function K() {
      try {
        let D = await A.description({}, {
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
        I(D)
      } catch {
        I("Failed to load description")
      }
    }
    K()
  }, [A]), $3.default.createElement(S, {
    flexDirection: "column"
  }, $3.default.createElement(S, {
    flexDirection: "column",
    paddingX: 1,
    borderStyle: "round"
  }, $3.default.createElement(S, {
    marginBottom: 1
  }, $3.default.createElement($, {
    bold: !0
  }, W, $3.default.createElement($, {
    dimColor: !0
  }, " (", Q.name, ")"), X && $3.default.createElement($, {
    color: "success"
  }, " [read-only]"), V && $3.default.createElement($, {
    color: "error"
  }, " [destructive]"), F && $3.default.createElement($, {
    dimColor: !0
  }, " [open-world]"))), $3.default.createElement(S, {
    flexDirection: "column"
  }, $3.default.createElement(S, null, $3.default.createElement($, {
    bold: !0
  }, "Tool name: "), $3.default.createElement($, {
    dimColor: !0
  }, Y)), $3.default.createElement(S, null, $3.default.createElement($, {
    bold: !0
  }, "Full name: "), $3.default.createElement($, {
    dimColor: !0
  }, A.name)), Z && $3.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, $3.default.createElement($, {
    bold: !0
  }, "Description:"), $3.default.createElement($, {
    wrap: "wrap"
  }, Z)), A.inputJSONSchema && A.inputJSONSchema.properties && Object.keys(A.inputJSONSchema.properties).length > 0 && $3.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, $3.default.createElement($, {
    bold: !0
  }, "Parameters:"), $3.default.createElement(S, {
    marginLeft: 2,
    flexDirection: "column"
  }, Object.entries(A.inputJSONSchema.properties).map(([K, D]) => {
    let C = A.inputJSONSchema?.required?.includes(K);
    return $3.default.createElement($, {
      key: K
    }, "• ", K, C && $3.default.createElement($, {
      dimColor: !0
    }, " (required)"), ":", " ", $3.default.createElement($, {
      dimColor: !0
    }, typeof D === "object" && D && "type" in D ? String(D.type) : "unknown"), typeof D === "object" && D && "description" in D && $3.default.createElement($, {
      dimColor: !0
    }, " ", "- ", String(D.description)))
  }))))), $3.default.createElement(S, {
    marginLeft: 3
  }, $3.default.createElement($, {
    dimColor: !0
  }, G.pending ? $3.default.createElement($3.default.Fragment, null, "Press ", G.keyName, " again to exit") : $3.default.createElement($3.default.Fragment, null, "Esc to go back"))))
}
// @from(Start 14130694, End 14130696)
$3
// @from(Start 14130702, End 14130771)
$F0 = L(() => {
  hA();
  hA();
  Q4();
  nX();
  $3 = BA(VA(), 1)
})
// @from(Start 14130774, End 14133986)
function wF0({
  onComplete: A
}) {
  let [Q] = OQ(), B = Q.mcp.clients, [G, Z] = gO.default.useState({
    type: "list"
  }), [I, Y] = gO.default.useState([]), J = gO.default.useMemo(() => B.filter((W) => W.name !== "ide").sort((W, X) => W.name.localeCompare(X.name)), [B]);
  switch (gO.default.useEffect(() => {
      async function W() {
        let X = await Promise.all(J.map(async (V) => {
          let F = V.config.scope,
            K = V.config.type === "sse",
            D = V.config.type === "http",
            H = void 0;
          if (K || D) {
            let U = await new lAA(V.name, V.config).tokens();
            H = Boolean(U)
          }
          let C = {
            name: V.name,
            client: V,
            scope: F
          };
          if (K) return {
            ...C,
            transport: "sse",
            isAuthenticated: H,
            config: V.config
          };
          else if (D) return {
            ...C,
            transport: "http",
            isAuthenticated: H,
            config: V.config
          };
          else return {
            ...C,
            transport: "stdio",
            config: V.config
          }
        }));
        Y(X)
      }
      W()
    }, [J]), gO.useEffect(() => {
      if (I.length === 0 && J.length > 0) return;
      if (I.length === 0) A("No MCP servers configured. Please run /doctor if this is unexpected. Otherwise, run `claude mcp` or visit https://code.claude.com/docs/en/mcp to learn more.")
    }, [I.length, J.length, A]), G.type) {
    case "list":
      return gO.default.createElement(XF0, {
        servers: I,
        onSelectServer: (W) => Z({
          type: "server-menu",
          server: W
        }),
        onComplete: A
      });
    case "server-menu": {
      let W = zSA(Q.mcp.tools, G.server.name);
      if (G.server.transport === "stdio") return gO.default.createElement(KF0, {
        server: G.server,
        serverToolsCount: W.length,
        onViewTools: () => Z({
          type: "server-tools",
          server: G.server
        }),
        onCancel: () => Z({
          type: "list"
        }),
        onComplete: A
      });
      else return gO.default.createElement(HF0, {
        server: G.server,
        serverToolsCount: W.length,
        onViewTools: () => Z({
          type: "server-tools",
          server: G.server
        }),
        onCancel: () => Z({
          type: "list"
        }),
        onComplete: A
      })
    }
    case "server-tools":
      return gO.default.createElement(EF0, {
        server: G.server,
        onSelectTool: (W, X) => Z({
          type: "server-tool-detail",
          server: G.server,
          toolIndex: X
        }),
        onBack: () => Z({
          type: "server-menu",
          server: G.server
        })
      });
    case "server-tool-detail": {
      let X = zSA(Q.mcp.tools, G.server.name)[G.toolIndex];
      if (!X) return Z({
        type: "server-tools",
        server: G.server
      }), null;
      return gO.default.createElement(UF0, {
        tool: X,
        server: G.server,
        onBack: () => Z({
          type: "server-tools",
          server: G.server
        })
      })
    }
  }
}
// @from(Start 14133991, End 14133993)
gO
// @from(Start 14133999, End 14134106)
TK9 = L(() => {
  rQ1();
  z9();
  nX();
  VF0();
  DF0();
  CF0();
  zF0();
  $F0();
  gO = BA(VA(), 1)
})
// @from(Start 14134109, End 14135930)
function qF0({
  serverName: A,
  onComplete: Q
}) {
  let [B] = qB(), [G] = OQ(), Z = gXA(), [I, Y] = QH.useState(!0), [J, W] = QH.useState(null);
  if (QH.useEffect(() => {
      async function X() {
        try {
          if (!G.mcp.clients.find((K) => K.name === A)) {
            W(`MCP server "${A}" not found`), Y(!1);
            return
          }
          switch ((await Z(A)).client.type) {
            case "connected":
              Q(`Successfully reconnected to ${A}`);
              break;
            case "needs-auth":
              W(`${A} requires authentication`), Y(!1), Q(`${A} requires authentication. Use /mcp to authenticate.`);
              break;
            case "pending":
            case "failed":
            case "disabled":
              W(`Failed to reconnect to ${A}`), Y(!1), Q(`Failed to reconnect to ${A}`);
              break
          }
        } catch (V) {
          let F = V instanceof Error ? V.message : String(V);
          W(F), Y(!1), Q(`Error: ${F}`)
        }
      }
      X()
    }, [A, Z, G.mcp.clients, Q]), I) return QH.default.createElement(S, {
    flexDirection: "column",
    gap: 1,
    padding: 1
  }, QH.default.createElement($, {
    color: "text"
  }, "Reconnecting to ", QH.default.createElement($, {
    bold: !0
  }, A)), QH.default.createElement(S, null, QH.default.createElement(g4, null), QH.default.createElement($, null, " Establishing connection to MCP server")));
  if (J) return QH.default.createElement(S, {
    flexDirection: "column",
    gap: 1,
    padding: 1
  }, QH.default.createElement(S, null, QH.default.createElement($, null, ZB("error", B)(H1.cross), " "), QH.default.createElement($, {
    color: "error"
  }, "Failed to reconnect to ", A)), QH.default.createElement($, {
    dimColor: !0
  }, "Error: ", J));
  return null
}
// @from(Start 14135935, End 14135937)
QH
// @from(Start 14135943, End 14136029)
NF0 = L(() => {
  hA();
  DY();
  $QA();
  z9();
  hA();
  V9();
  QH = BA(VA(), 1)
})
// @from(Start 14136035, End 14136115)
PK9 = L(() => {
  TK9();
  VF0();
  DF0();
  CF0();
  zF0();
  $F0();
  NF0()
})
// @from(Start 14136121, End 14136124)
LF0
// @from(Start 14136126, End 14136129)
Ix3
// @from(Start 14136131, End 14136134)
jK9
// @from(Start 14136140, End 14136819)
SK9 = L(() => {
  PK9();
  NF0();
  LF0 = BA(VA(), 1), Ix3 = {
    type: "local-jsx",
    name: "mcp",
    description: "Manage MCP servers",
    isEnabled: () => !0,
    isHidden: !1,
    argumentHint: "[reconnect <server-name>]",
    async call(A, Q, B) {
      if (B) {
        let G = B.trim().split(/\s+/);
        if (G[0] === "reconnect" && G[1]) {
          let Z = G.slice(1).join(" ");
          return LF0.default.createElement(qF0, {
            serverName: Z,
            onComplete: A
          })
        }
      }
      return LF0.default.createElement(wF0, {
        onComplete: A
      })
    },
    userFacingName() {
      return "mcp"
    }
  }, jK9 = Ix3
})
// @from(Start 14136825, End 14136839)
_K9 = () => {}
// @from(Start 14136845, End 14136859)
kK9 = () => {}
// @from(Start 14136865, End 14136868)
yK9
// @from(Start 14136874, End 14138706)
xK9 = L(() => {
  yK9 = {
    type: "prompt",
    name: "pr-comments",
    description: "Get comments from a GitHub pull request",
    progressMessage: "fetching PR comments",
    useSmallFastModel: !0,
    isEnabled: () => !0,
    isHidden: !1,
    userFacingName() {
      return "pr-comments"
    },
    source: "builtin",
    async getPromptForCommand(A) {
      return [{
        type: "text",
        text: `You are an AI assistant integrated into a git-based version control system. Your task is to fetch and display comments from a GitHub pull request.

Follow these steps:

1. Use \`gh pr view --json number,headRepository\` to get the PR number and repository info
2. Use \`gh api /repos/{owner}/{repo}/issues/{number}/comments\` to get PR-level comments
3. Use \`gh api /repos/{owner}/{repo}/pulls/{number}/comments\` to get review comments. Pay particular attention to the following fields: \`body\`, \`diff_hunk\`, \`path\`, \`line\`, etc. If the comment references some code, consider fetching it using eg \`gh api /repos/{owner}/{repo}/contents/{path}?ref={branch} | jq .content -r | base64 -d\`
4. Parse and format all comments in a readable way
5. Return ONLY the formatted comments, with no additional text

Format the comments as:

## Comments

[For each comment thread:]
- @author file.ts#line:
  \`\`\`diff
  [diff_hunk from the API response]
  \`\`\`
  > quoted comment text
  
  [any replies indented]

If there are no comments, return "No comments found."

Remember:
1. Only show the actual comments, no explanatory text
2. Include both PR-level and code review comments
3. Preserve the threading/nesting of comment replies
4. Show the file and line number context for code review comments
5. Use jq to parse the JSON responses from the GitHub API

${A?"Additional user input: "+A:""}
`
      }]
    }
  }
})
// @from(Start 14138709, End 14138869)
function vK9(A) {
  return A.map(([Q, B]) => {
    let G = `Version ${Q}:`,
      Z = B.map((I) => `• ${I}`).join(`
`);
    return `${G}
${Z}`
  }).join(`

`)
}
// @from(Start 14138874, End 14138877)
Yx3
// @from(Start 14138879, End 14138882)
bK9
// @from(Start 14138888, End 14139680)
fK9 = L(() => {
  tXA();
  Yx3 = {
    description: "View release notes",
    isEnabled: () => !0,
    isHidden: !1,
    name: "release-notes",
    userFacingName() {
      return "release-notes"
    },
    type: "local",
    supportsNonInteractive: !0,
    async call() {
      let A = [];
      try {
        let B = new Promise((G, Z) => {
          setTimeout(() => Z(Error("Timeout")), 500)
        });
        await Promise.race([eW0(), B]), A = AX0(SQA())
      } catch {}
      if (A.length > 0) return {
        type: "text",
        value: vK9(A)
      };
      let Q = AX0();
      if (Q.length > 0) return {
        type: "text",
        value: vK9(Q)
      };
      return {
        type: "text",
        value: `See the full changelog at: ${t69}`
      }
    }
  }, bK9 = Yx3
})
// @from(Start 14139686, End 14139689)
Jx3
// @from(Start 14139691, End 14139694)
hK9
// @from(Start 14139700, End 14140320)
gK9 = L(() => {
  S7();
  _0();
  Jx3 = {
    type: "local",
    name: "rename",
    description: "Rename the current conversation",
    isEnabled: () => !1,
    isHidden: !1,
    supportsNonInteractive: !1,
    argumentHint: "<name>",
    async call(A) {
      if (!A || A.trim() === "") return {
        type: "text",
        value: "Please provide a name for the session. Usage: /rename <name>"
      };
      let Q = e1();
      return await BJ1(Q, A.trim()), {
        type: "text",
        value: `Session renamed to: ${A.trim()}`
      }
    },
    userFacingName() {
      return "rename"
    }
  }, hK9 = Jx3
})
// @from(Start 14140323, End 14143273)
function uK9({
  nodes: A,
  onSelect: Q,
  onCancel: B,
  onFocus: G,
  focusNodeId: Z,
  visibleOptionCount: I,
  layout: Y = "expanded",
  isDisabled: J = !1,
  hideIndexes: W = !1,
  isNodeExpanded: X,
  onExpand: V,
  onCollapse: F,
  getParentPrefix: K,
  getChildPrefix: D
}) {
  let [H, C] = RC.default.useState(new Set), E = RC.default.useRef(!1), U = RC.default.useRef(null), q = RC.default.useCallback((m) => {
    if (X) return X(m);
    return H.has(m)
  }, [X, H]), w = RC.default.useMemo(() => {
    let m = [];

    function o(IA, FA, zA) {
      let NA = !!IA.children && IA.children.length > 0,
        OA = q(IA.id);
      if (m.push({
          node: IA,
          depth: FA,
          isExpanded: OA,
          hasChildren: NA,
          parentId: zA
        }), NA && OA && IA.children)
        for (let mA of IA.children) o(mA, FA + 1, IA.id)
    }
    for (let IA of A) o(IA, 0);
    return m
  }, [A, q]), N = RC.default.useCallback((m) => m ? "▼ " : "▶ ", []), R = RC.default.useCallback((m) => "  ▸ ", []), T = K ?? N, y = D ?? R, v = RC.default.useCallback((m) => {
    let o = "";
    if (m.hasChildren) o = T(m.isExpanded);
    else if (m.depth > 0) o = y(m.depth);
    return o + m.node.label
  }, [T, y]), x = RC.default.useMemo(() => {
    return w.map((m) => ({
      label: v(m),
      description: m.node.description,
      dimDescription: m.node.dimDescription ?? !0,
      value: m.node.id
    }))
  }, [w, v]), p = RC.default.useMemo(() => {
    let m = new Map;
    return w.forEach((o) => m.set(o.node.id, o.node)), m
  }, [w]), u = RC.default.useCallback((m) => {
    return w.find((o) => o.node.id === m)
  }, [w]), e = RC.default.useCallback((m, o) => {
    let IA = u(m);
    if (!IA || !IA.hasChildren) return;
    if (o)
      if (V) V(m);
      else C((FA) => new Set([...FA, m]));
    else if (F) F(m);
    else C((FA) => {
      let zA = new Set(FA);
      return zA.delete(m), zA
    })
  }, [u, V, F]);
  f1((m, o) => {
    if (!Z || J) return;
    let IA = u(Z);
    if (!IA) return;
    if (o.rightArrow && IA.hasChildren) e(Z, !0);
    else if (o.leftArrow) {
      if (IA.hasChildren && IA.isExpanded) e(Z, !1);
      else if (IA.parentId !== void 0) {
        if (E.current = !0, e(IA.parentId, !1), G) {
          let FA = p.get(IA.parentId);
          if (FA) G(FA)
        }
      }
    }
  }, {
    isActive: !J
  });
  let l = RC.default.useCallback((m) => {
      let o = p.get(m);
      if (!o) return;
      Q(o)
    }, [p, Q]),
    k = RC.default.useCallback((m) => {
      if (E.current) {
        E.current = !1;
        return
      }
      if (U.current === m) return;
      if (U.current = m, G) {
        let o = p.get(m);
        if (o) G(o)
      }
    }, [G, p]);
  return RC.default.createElement(M0, {
    options: x,
    onChange: l,
    onFocus: k,
    onCancel: B,
    focusValue: Z,
    visibleOptionCount: I,
    layout: Y,
    isDisabled: J,
    hideIndexes: W
  })
}
// @from(Start 14143278, End 14143280)
RC
// @from(Start 14143286, End 14143339)
mK9 = L(() => {
  S5();
  hA();
  RC = BA(VA(), 1)
})
// @from(Start 14143342, End 14144459)
function dK9({
  log: A,
  onExit: Q,
  onSelect: B
}) {
  let G = A.messages[0]?.sessionId || "",
    Z = wY1();
  return f1((I, Y) => {
    if (Y.escape || Y.ctrl && I === "c") Q();
    else if (Y.return) B(A)
  }, {
    isActive: !0
  }), qVA.default.createElement(S, {
    flexDirection: "column"
  }, qVA.default.createElement(_QA, {
    messages: A.messages,
    normalizedMessageHistory: [],
    tools: Z,
    verbose: !0,
    toolJSX: null,
    toolUseConfirmQueue: [],
    inProgressToolUseIDs: new Set,
    isMessageSelectorVisible: !1,
    conversationId: G,
    screen: "transcript",
    screenToggleId: 1,
    streamingToolUses: [],
    showAllInTranscript: !0
  }), qVA.default.createElement(S, {
    flexShrink: 0,
    flexDirection: "column",
    borderTopDimColor: !0,
    borderBottom: !1,
    borderLeft: !1,
    borderRight: !1,
    borderStyle: "single",
    paddingLeft: 2
  }, qVA.default.createElement($, null, Yt(A.modified), " · ", A.messageCount, " messages", A.gitBranch ? ` · ${A.gitBranch}` : ""), qVA.default.createElement($, {
    dimColor: !0
  }, "Enter to resume · Esc to exit")))
}
// @from(Start 14144464, End 14144467)
qVA
// @from(Start 14144473, End 14144536)
cK9 = L(() => {
  hA();
  _I1();
  yq();
  qVA = BA(VA(), 1)
})
// @from(Start 14144539, End 14144669)
function pK9(A, Q) {
  let B = A.replace(/\s+/g, " ").trim();
  if (B.length <= Q) return B;
  return B.slice(0, Q).trim() + "…"
}
// @from(Start 14144671, End 14145004)
function MF0(A, Q, B) {
  let {
    isGroupHeader: G = !1,
    isChild: Z = !1,
    forkCount: I = 0
  } = B || {}, Y = G && I > 0 ? Wx3 : Z ? Xx3 : 0, J = G && I > 0 ? ` (+${I} other ${I===1?"session":"sessions"})` : "", W = A.isSidechain ? " (sidechain)" : "", X = Q - Y - W.length - J.length;
  return `${pK9(PFA(A),X)}${W}${J}`
}
// @from(Start 14145006, End 14145205)
function OF0(A, Q) {
  let {
    isChild: B = !1,
    showProjectPath: G = !1
  } = Q || {}, Z = B ? "    " : "", I = mzA(A), Y = G && A.projectPath ? ` · ${A.projectPath}` : "";
  return Z + I + Y
}
// @from(Start 14145207, End 14154585)
function USA({
  logs: A,
  maxHeight: Q = 1 / 0,
  forceWidth: B,
  onCancel: G,
  onSelect: Z,
  onLogsChanged: I,
  initialSearchQuery: Y,
  showAllProjects: J = !1,
  onToggleAllProjects: W
}) {
  let X = WB(),
    V = B === void 0 ? X.columns : B,
    F = EQ(G),
    {
      isFocused: K,
      filterFocusSequences: D
    } = HrA(),
    H = ug(),
    [C, E] = G8.default.useState(null),
    [U, q] = G8.default.useState(!1),
    [w, N] = G8.default.useState(Y || ""),
    [R, T] = G8.default.useState(""),
    [y, v] = G8.default.useState(0),
    [x, p] = G8.default.useState(new Set),
    [u, e] = G8.default.useState(null),
    [l, k] = G8.default.useState(Y ? "search" : "list"),
    [m, o] = G8.default.useState(null),
    IA = G8.default.useRef(null);
  G8.default.useEffect(() => {
    sb().then((DA) => E(DA))
  }, []);
  let FA = G8.default.useMemo(() => {
      let DA = A;
      if (H) DA = A.filter(($A) => {
        let TA = e1(),
          rA = TA && $A.messages[0]?.sessionId === TA,
          iA = RF0($A.messages);
        return rA || iA
      });
      if (U && C) DA = DA.filter(($A) => $A.gitBranch === C);
      if (w) {
        let $A = w.toLowerCase();
        DA = DA.filter((TA) => {
          let rA = PFA(TA).toLowerCase(),
            iA = (TA.gitBranch || "").toLowerCase();
          return rA.includes($A) || iA.includes($A)
        })
      }
      return DA
    }, [A, H, U, C, w]),
    zA = Math.max(30, V - 4),
    NA = G8.default.useMemo(() => {
      if (!H) return [];
      let DA = Vx3(FA);
      return Array.from(DA.entries()).map(([$A, TA]) => {
        let rA = TA[0],
          iA = FA.indexOf(rA);
        if (TA.length === 1) return {
          id: `log:${$A}:0`,
          value: {
            log: rA,
            indexInFiltered: iA
          },
          label: MF0(rA, zA),
          description: OF0(rA, {
            showProjectPath: J
          }),
          dimDescription: !0
        };
        let J1 = TA.length - 1,
          w1 = TA.slice(1).map((jA, eA) => {
            let t1 = FA.indexOf(jA);
            return {
              id: `log:${$A}:${eA+1}`,
              value: {
                log: jA,
                indexInFiltered: t1
              },
              label: MF0(jA, zA, {
                isChild: !0
              }),
              description: OF0(jA, {
                isChild: !0,
                showProjectPath: J
              }),
              dimDescription: !0
            }
          });
        return {
          id: `group:${$A}`,
          value: {
            log: rA,
            indexInFiltered: iA
          },
          label: MF0(rA, zA, {
            isGroupHeader: !0,
            forkCount: J1
          }),
          description: OF0(rA, {
            showProjectPath: J
          }),
          dimDescription: !0,
          children: w1
        }
      })
    }, [H, FA, zA, J]),
    OA = G8.default.useMemo(() => {
      if (H) return [];
      return FA.map((DA, $A) => {
        let rA = PFA(DA) + (DA.isSidechain ? " (sidechain)" : ""),
          iA = pK9(rA, zA),
          J1 = mzA(DA),
          w1 = J && DA.projectPath ? ` · ${DA.projectPath}` : "";
        return {
          label: iA,
          description: J1 + w1,
          dimDescription: !0,
          value: $A.toString()
        }
      })
    }, [H, FA, zA, J]),
    mA = u?.value.log ?? null,
    wA = () => {
      if (!H || !mA) return "";
      let DA = mA.messages[0]?.sessionId;
      if (!DA) return "";
      let $A = FA.filter((J1) => J1.messages[0]?.sessionId === DA);
      if (!($A.length > 1)) return "";
      let rA = x.has(DA);
      if ($A.indexOf(mA) > 0) return " · ← to collapse";
      return rA ? " · ← to collapse" : " · → to expand"
    },
    qA = G8.default.useCallback(async () => {
      let DA = mA?.messages[0];
      if (!mA || !DA) {
        k("list"), T("");
        return
      }
      if (R.trim()) {
        let $A = DA.sessionId;
        if (await BJ1($A, R.trim()), H && I) I()
      }
      k("list"), T("")
    }, [mA, R, I, H]),
    KA = G8.default.useCallback((DA) => {
      let $A = parseInt(DA, 10),
        TA = FA[$A];
      if (!TA || IA.current === $A.toString()) return;
      IA.current = $A.toString(), e({
        id: $A.toString(),
        value: {
          log: TA,
          indexInFiltered: $A
        },
        label: ""
      })
    }, [FA]),
    yA = G8.default.useCallback((DA) => {
      e(DA)
    }, []);
  if (f1((DA, $A) => {
      if (l === "preview") return;
      if (l === "rename") {
        if ($A.escape) k("list"), T("")
      } else if (l === "search")
        if ($A.escape || $A.return) k("list"), GA("tengu_session_search_toggled", {
          enabled: !1
        });
        else if ($A.backspace || $A.delete) N((TA) => TA.slice(0, -1));
      else {
        let TA = D(DA, $A);
        if (TA && !$A.ctrl && !$A.meta) N((rA) => rA + TA)
      } else {
        let TA = !$A.ctrl && !$A.meta,
          rA = DA.toLowerCase();
        if (rA === "a" && TA && W) W(), GA("tengu_session_all_projects_toggled", {
          enabled: !J
        });
        else if (rA === "b" && TA) {
          let iA = !U;
          q(iA), GA("tengu_session_branch_filter_toggled", {
            enabled: iA
          })
        } else if (rA === "/" && TA) k("search"), GA("tengu_session_search_toggled", {
          enabled: !0
        });
        else if (rA === "r" && TA && mA && H) k("rename"), T(""), GA("tengu_session_rename_started", {});
        else if (rA === "p" && TA && mA && H) o(mA), k("preview"), GA("tengu_session_preview_opened", {
          messageCount: mA.messageCount
        })
      }
    }, {
      isActive: !0
    }), A.length === 0) return null;
  if (l === "preview" && m && H) return G8.default.createElement(dK9, {
    log: m,
    onExit: () => {
      k("list"), o(null)
    },
    onSelect: Z
  });
  let oA = [];
  if (U && C) oA.push(C);
  if (w && l !== "search") oA.push(`/${w}`);
  let X1 = oA.length > 0 || l === "search",
    WA = 5 + (X1 ? 1 : 0),
    EA = 2,
    MA = Math.max(1, Math.floor((Q - WA - EA) / 3));
  return G8.default.createElement(S, {
    flexDirection: "column",
    height: Q - 1
  }, G8.default.createElement(S, {
    flexShrink: 0
  }, G8.default.createElement($, {
    color: "suggestion"
  }, "─".repeat(V))), G8.default.createElement(S, {
    flexShrink: 0
  }, G8.default.createElement($, null, " ")), G8.default.createElement(S, {
    flexShrink: 0
  }, G8.default.createElement($, {
    bold: !0,
    color: "suggestion"
  }, "Resume Session", J ? " (All Projects)" : "")), X1 && G8.default.createElement(S, {
    flexShrink: 0,
    paddingLeft: 2
  }, l === "search" ? G8.default.createElement($, null, oA.length > 0 && G8.default.createElement($, {
    dimColor: !0
  }, oA.join(" · "), " · "), "/", G8.default.createElement($, {
    bold: !0
  }, w), K && G8.default.createElement($, {
    dimColor: !0
  }, "█")) : G8.default.createElement($, {
    dimColor: !0
  }, oA.join(" · "))), G8.default.createElement(S, {
    flexShrink: 0
  }, G8.default.createElement($, null, " ")), l === "rename" && mA ? G8.default.createElement(S, {
    paddingLeft: 2,
    flexDirection: "column"
  }, G8.default.createElement($, {
    bold: !0
  }, "Rename session:"), G8.default.createElement(S, {
    paddingTop: 1
  }, G8.default.createElement(s4, {
    value: R,
    onChange: T,
    onSubmit: qA,
    placeholder: PFA(mA, "Enter new session name"),
    columns: V,
    cursorOffset: y,
    onChangeCursorOffset: v,
    showCursor: !0
  }))) : H ? G8.default.createElement(uK9, {
    nodes: NA,
    onSelect: (DA) => {
      Z(DA.value.log)
    },
    onFocus: yA,
    onCancel: G,
    focusNodeId: u?.id,
    visibleOptionCount: MA,
    layout: "expanded",
    isDisabled: l === "search",
    hideIndexes: !1,
    isNodeExpanded: (DA) => {
      if (l === "search" || U) return !0;
      let $A = typeof DA === "string" && DA.startsWith("group:") ? DA.substring(6) : null;
      return $A ? x.has($A) : !1
    },
    onExpand: (DA) => {
      let $A = typeof DA === "string" && DA.startsWith("group:") ? DA.substring(6) : null;
      if ($A) p((TA) => new Set([...TA, $A])), GA("tengu_session_group_expanded", {})
    },
    onCollapse: (DA) => {
      let $A = typeof DA === "string" && DA.startsWith("group:") ? DA.substring(6) : null;
      if ($A) p((TA) => {
        let rA = new Set(TA);
        return rA.delete($A), rA
      })
    }
  }) : G8.default.createElement(M0, {
    options: OA,
    onChange: (DA) => {
      let $A = parseInt(DA, 10),
        TA = FA[$A];
      if (TA) Z(TA)
    },
    visibleOptionCount: MA,
    onCancel: G,
    onFocus: KA,
    focusValue: u?.id.toString(),
    layout: "expanded",
    isDisabled: l === "search"
  }), G8.default.createElement(S, {
    paddingLeft: 2
  }, F.pending ? G8.default.createElement($, {
    dimColor: !0
  }, "Press ", F.keyName, " again to exit") : l === "rename" ? G8.default.createElement($, {
    dimColor: !0
  }, "Enter to save · Esc to cancel") : l === "search" ? G8.default.createElement($, {
    dimColor: !0
  }, "Enter or Esc to finish · type to filter") : G8.default.createElement($, {
    dimColor: !0
  }, (W ? `A to show ${J?"current dir":"all projects"} · ` : "") + (C ? "B to toggle branch · " : "") + (H ? "P to preview · R to rename · " : "") + "/ to search · Esc to exit" + wA())))
}
// @from(Start 14154587, End 14154890)
function Vx3(A) {
  let Q = A.reduce((B, G) => {
    let Z = G.messages[0]?.sessionId;
    if (Z) {
      let I = B.get(Z) || [];
      B.set(Z, [...I, G])
    }
    return B
  }, new Map);
  return Q.forEach((B) => B.sort((G, Z) => new Date(Z.modified).getTime() - new Date(G.modified).getTime())), Q
}
// @from(Start 14154895, End 14154897)
G8
// @from(Start 14154899, End 14154906)
Wx3 = 2
// @from(Start 14154910, End 14154917)
Xx3 = 4
// @from(Start 14154923, End 14155067)
GJ1 = L(() => {
  hA();
  i8();
  S5();
  mK9();
  Q4();
  PV();
  CrA();
  ZY();
  S7();
  _0();
  q0();
  cK9();
  g1();
  G8 = BA(VA(), 1)
})
// @from(Start 14155069, End 14155591)
async function La(A) {
  let Q = dQ(),
    G = {
      macos: ["pbcopy"],
      linux: ["xclip -selection clipboard", "wl-copy"],
      wsl: ["clip.exe"],
      windows: ["clip"],
      unknown: ["xclip -selection clipboard", "wl-copy"]
    } [Q];
  for (let Z of G) try {
    return await us(Z, {
      input: A,
      shell: !0,
      reject: !0
    }), !0
  } catch (I) {
    AA(Error(`Failed to execute clipboard command "${Z}": ${I}`));
    continue
  }
  return AA(Error(`Failed to copy to clipboard on ${Q}`)), !1
}
// @from(Start 14155593, End 14156241)
function ZJ1() {
  let A = dQ();
  return {
    macos: "Failed to copy to clipboard. Make sure the `pbcopy` command is available on your system and try again.",
    windows: "Failed to copy to clipboard. Make sure the `clip` command is available on your system and try again.",
    wsl: "Failed to copy to clipboard. Make sure the `clip.exe` command is available in your WSL environment and try again.",
    linux: "Failed to copy to clipboard. Make sure `xclip` or `wl-copy` is installed on your system and try again.",
    unknown: "Failed to copy to clipboard. Make sure `xclip` or `wl-copy` is installed on your system and try again."
  } [A]
}
// @from(Start 14156246, End 14156288)
$SA = L(() => {
  sFA();
  g1();
  Q3()
})
// @from(Start 14156291, End 14156628)
function IJ1(A, Q) {
  let B = uQ();
  if (Q && A.projectPath && A.projectPath !== B) {
    let G = A.messages.find((I) => I.sessionId)?.sessionId;
    return {
      isCrossProject: !0,
      command: `cd ${z8([A.projectPath])} && claude --resume ${G}`,
      projectPath: A.projectPath
    }
  }
  return {
    isCrossProject: !1
  }
}
// @from(Start 14156633, End 14156666)
TF0 = L(() => {
  _0();
  dK()
})
// @from(Start 14156669, End 14156947)
function lK9(A) {
  switch (A.resultType) {
    case "sessionNotFound":
      return `Session ${tA.bold(A.arg)} was not found.`;
    case "multipleMatches":
      return `Found ${A.count} sessions matching ${tA.bold(A.arg)}. Please use /resume to pick a specific session.`
  }
}
// @from(Start 14156949, End 14157286)
function PF0({
  message: A,
  args: Q,
  onDone: B
}) {
  return s5.useEffect(() => {
    let G = setTimeout(B, 0);
    return () => clearTimeout(G)
  }, [B]), s5.createElement(S, {
    flexDirection: "column"
  }, s5.createElement($, {
    dimColor: !0
  }, "> /resume ", Q), s5.createElement(S0, null, s5.createElement($, null, A)))
}
// @from(Start 14157288, End 14158771)
function Fx3({
  onDone: A,
  onResume: Q
}) {
  let [B, G] = s5.useState([]), [Z, I] = s5.useState(!0), [Y, J] = s5.useState(!1), {
    rows: W
  } = WB(), X = s5.useCallback(async (H) => {
    try {
      let C = H ? await YJ1() : await eP();
      if (C.length === 0) {
        A("No conversations found to resume");
        return
      }
      G(C)
    } catch (C) {
      A("Failed to load conversations")
    } finally {
      I(!1)
    }
  }, [A]);
  s5.useEffect(() => {
    I(!0), G([]), X(Y)
  }, [Y]);
  let V = s5.useCallback(() => {
    J((H) => !H)
  }, []);
  async function F(H) {
    let C = nE(VP(H));
    if (!C) {
      A("Failed to resume conversation");
      return
    }
    let E = IJ1(H, Y);
    if (E.isCrossProject) {
      await La(E.command);
      let U = ["", "This conversation is from a different directory.", "", "To resume, run:", `  ${E.command}`, "", "(Command copied to clipboard)", ""].join(`
`);
      A(U, {
        display: "user"
      });
      return
    }
    Q(C, H, "slash_command_picker")
  }

  function K() {
    A("Resume cancelled", {
      display: "system"
    })
  }
  if (Z) return s5.createElement(S, null, s5.createElement(g4, null), s5.createElement($, null, " Loading conversations…"));
  let D = B.filter((H) => !H.isSidechain);
  return s5.createElement(USA, {
    logs: D,
    maxHeight: W - 2,
    onCancel: K,
    onSelect: F,
    onLogsChanged: () => X(Y),
    showAllProjects: Y,
    onToggleAllProjects: V
  })
}
// @from(Start 14158776, End 14158778)
s5
// @from(Start 14158780, End 14158783)
Kx3
// @from(Start 14158785, End 14158788)
iK9
// @from(Start 14158794, End 14160688)
nK9 = L(() => {
  F9();
  hA();
  DY();
  GJ1();
  q8();
  S7();
  Sy();
  i8();
  $SA();
  TF0();
  s5 = BA(VA(), 1);
  Kx3 = {
    type: "local-jsx",
    name: "resume",
    description: "Resume a conversation",
    get argumentHint() {
      return ug() ? "[session-id or title]" : "[session-id]"
    },
    isEnabled: () => !0,
    isHidden: !1,
    async call(A, Q, B) {
      let G = async (W, X, V) => {
        await Q.resume?.(W, X, V), A(void 0, {
          display: "skip"
        })
      }, Z = B?.trim();
      if (!Z) return s5.createElement(Fx3, {
        key: Date.now(),
        onDone: A,
        onResume: G
      });
      let I = await eP();
      if (I.length === 0) return s5.createElement(PF0, {
        message: "No conversations found to resume.",
        args: Z,
        onDone: () => A("No conversations found to resume.")
      });
      let Y = nE(Z);
      if (Y) {
        let W = I.filter((X) => VP(X) === Y).sort((X, V) => V.modified.getTime() - X.modified.getTime());
        if (W.length > 0) return G(Y, W[0], "slash_command_session_id"), null
      }
      if (ug()) {
        let W = await mXA(Z, {
          exact: !0
        });
        if (W.length === 1) {
          let X = W[0],
            V = VP(X);
          if (V) return G(V, X, "slash_command_title"), null
        }
        if (W.length > 1) {
          let X = lK9({
            resultType: "multipleMatches",
            arg: Z,
            count: W.length
          });
          return s5.createElement(PF0, {
            message: X,
            args: Z,
            onDone: () => A(X)
          })
        }
      }
      let J = lK9({
        resultType: "sessionNotFound",
        arg: Z
      });
      return s5.createElement(PF0, {
        message: J,
        args: Z,
        onDone: () => A(J)
      })
    },
    userFacingName() {
      return "resume"
    }
  }, iK9 = Kx3
})
// @from(Start 14160694, End 14160697)
JJ1
// @from(Start 14160703, End 14161967)
jF0 = L(() => {
  pF();
  JJ1 = {
    type: "prompt",
    name: "review",
    description: "Review a pull request",
    isEnabled: () => !0,
    isHidden: !1,
    progressMessage: "reviewing pull request",
    userFacingName() {
      return "review"
    },
    source: "builtin",
    async getPromptForCommand(A) {
      return [{
        type: "text",
        text: `
      You are an expert code reviewer. Follow these steps:

      1. If no PR number is provided in the args, use ${D9.name}("gh pr list") to show open PRs
      2. If a PR number is provided, use ${D9.name}("gh pr view <number>") to get PR details
      3. Use ${D9.name}("gh pr diff <number>") to get the diff
      4. Analyze the changes and provide a thorough code review that includes:
         - Overview of what the PR does
         - Analysis of code quality and style
         - Specific suggestions for improvements
         - Any potential issues or risks
      
      Keep your review concise but thorough. Focus on:
      - Code correctness
      - Following project conventions
      - Performance implications
      - Test coverage
      - Security considerations

      Format your review with clear sections and bullet points.

      PR number: ${A}
    `
      }]
    }
  }
})
// @from(Start 14161973, End 14161987)
aK9 = () => {}
// @from(Start 14161993, End 14161996)
SF0
// @from(Start 14161998, End 14162001)
Dx3
// @from(Start 14162003, End 14162006)
sK9
// @from(Start 14162012, End 14162481)
rK9 = L(() => {
  dY1();
  SF0 = BA(VA(), 1), Dx3 = {
    type: "local-jsx",
    name: "status",
    description: "Show Claude Code status including version, model, account, API connectivity, and tool statuses",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A, Q) {
      return SF0.createElement(zVA, {
        onClose: A,
        context: Q,
        defaultTab: "Status"
      })
    },
    userFacingName() {
      return "status"
    }
  }, sK9 = Dx3
})
// @from(Start 14162487, End 14162490)
_F0
// @from(Start 14162492, End 14162495)
Hx3
// @from(Start 14162497, End 14162500)
oK9
// @from(Start 14162506, End 14162912)
tK9 = L(() => {
  fW0();
  _F0 = BA(VA(), 1), Hx3 = {
    type: "local-jsx",
    name: "tasks",
    aliases: ["bashes"],
    description: "List and manage background tasks",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A, Q) {
      return _F0.createElement(WI1, {
        toolUseContext: Q,
        onDone: A
      })
    },
    userFacingName() {
      return "tasks"
    }
  }, oK9 = Hx3
})
// @from(Start 14162918, End 14162932)
eK9 = () => {}
// @from(Start 14162935, End 14163427)
function AD9() {
  let A = e1(),
    Q = Nh(A);
  if (Q.length === 0) return Zj.default.createElement($, null, "No todos currently tracked");
  return Zj.default.createElement(S, {
    flexDirection: "column"
  }, Zj.default.createElement($, null, Zj.default.createElement($, {
    bold: !0
  }, Q.length, " ", Q.length === 1 ? "todo" : "todos"), Zj.default.createElement($, null, ":")), Zj.default.createElement(S, {
    marginTop: 1
  }, Zj.default.createElement(Yn, {
    todos: Q
  })))
}
// @from(Start 14163432, End 14163434)
Zj
// @from(Start 14163436, End 14163439)
Cx3
// @from(Start 14163441, End 14163444)
QD9
// @from(Start 14163450, End 14164056)
BD9 = L(() => {
  Ti();
  _0();
  hA();
  DSA();
  HRA();
  Zj = BA(VA(), 1);
  Cx3 = {
    type: "local-jsx",
    name: "todos",
    description: "List current todo items",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A, {
      options: {
        isNonInteractiveSession: Q
      }
    }) {
      if (Q) {
        let B = await UVA(Zj.default.createElement(AD9, null));
        return A(B), null
      }
      return Zj.default.createElement($VA, {
        onComplete: A
      }, Zj.default.createElement(AD9, null))
    },
    userFacingName() {
      return "todos"
    }
  }, QD9 = Cx3
})
// @from(Start 14164062, End 14174947)
Ex3 = `---
allowed-tools: Bash(git diff:*), Bash(git status:*), Bash(git log:*), Bash(git show:*), Bash(git remote show:*), Read, Glob, Grep, LS, Task
description: Complete a security review of the pending changes on the current branch
---

You are a senior security engineer conducting a focused security review of the changes on this branch.

GIT STATUS:

\`\`\`
!\`git status\`
\`\`\`

FILES MODIFIED:

\`\`\`
!\`git diff --name-only origin/HEAD...\`
\`\`\`

COMMITS:

\`\`\`
!\`git log --no-decorate origin/HEAD...\`
\`\`\`

DIFF CONTENT:

\`\`\`
!\`git diff --merge-base origin/HEAD\`
\`\`\`

Review the complete diff above. This contains all code changes in the PR.


OBJECTIVE:
Perform a security-focused code review to identify HIGH-CONFIDENCE security vulnerabilities that could have real exploitation potential. This is not a general code review - focus ONLY on security implications newly added by this PR. Do not comment on existing security concerns.

CRITICAL INSTRUCTIONS:
1. MINIMIZE FALSE POSITIVES: Only flag issues where you're >80% confident of actual exploitability
2. AVOID NOISE: Skip theoretical issues, style concerns, or low-impact findings
3. FOCUS ON IMPACT: Prioritize vulnerabilities that could lead to unauthorized access, data breaches, or system compromise
4. EXCLUSIONS: Do NOT report the following issue types:
   - Denial of Service (DOS) vulnerabilities, even if they allow service disruption
   - Secrets or sensitive data stored on disk (these are handled by other processes)
   - Rate limiting or resource exhaustion issues

SECURITY CATEGORIES TO EXAMINE:

**Input Validation Vulnerabilities:**
- SQL injection via unsanitized user input
- Command injection in system calls or subprocesses
- XXE injection in XML parsing
- Template injection in templating engines
- NoSQL injection in database queries
- Path traversal in file operations

**Authentication & Authorization Issues:**
- Authentication bypass logic
- Privilege escalation paths
- Session management flaws
- JWT token vulnerabilities
- Authorization logic bypasses

**Crypto & Secrets Management:**
- Hardcoded API keys, passwords, or tokens
- Weak cryptographic algorithms or implementations
- Improper key storage or management
- Cryptographic randomness issues
- Certificate validation bypasses

**Injection & Code Execution:**
- Remote code execution via deseralization
- Pickle injection in Python
- YAML deserialization vulnerabilities
- Eval injection in dynamic code execution
- XSS vulnerabilities in web applications (reflected, stored, DOM-based)

**Data Exposure:**
- Sensitive data logging or storage
- PII handling violations
- API endpoint data leakage
- Debug information exposure

Additional notes:
- Even if something is only exploitable from the local network, it can still be a HIGH severity issue

ANALYSIS METHODOLOGY:

Phase 1 - Repository Context Research (Use file search tools):
- Identify existing security frameworks and libraries in use
- Look for established secure coding patterns in the codebase
- Examine existing sanitization and validation patterns
- Understand the project's security model and threat model

Phase 2 - Comparative Analysis:
- Compare new code changes against existing security patterns
- Identify deviations from established secure practices
- Look for inconsistent security implementations
- Flag code that introduces new attack surfaces

Phase 3 - Vulnerability Assessment:
- Examine each modified file for security implications
- Trace data flow from user inputs to sensitive operations
- Look for privilege boundaries being crossed unsafely
- Identify injection points and unsafe deserialization

REQUIRED OUTPUT FORMAT:

You MUST output your findings in markdown. The markdown output should contain the file, line number, severity, category (e.g. \`sql_injection\` or \`xss\`), description, exploit scenario, and fix recommendation. 

For example:

# Vuln 1: XSS: \`foo.py:42\`

* Severity: High
* Description: User input from \`username\` parameter is directly interpolated into HTML without escaping, allowing reflected XSS attacks
* Exploit Scenario: Attacker crafts URL like /bar?q=<script>alert(document.cookie)</script> to execute JavaScript in victim's browser, enabling session hijacking or data theft
* Recommendation: Use Flask's escape() function or Jinja2 templates with auto-escaping enabled for all user inputs rendered in HTML

SEVERITY GUIDELINES:
- **HIGH**: Directly exploitable vulnerabilities leading to RCE, data breach, or authentication bypass
- **MEDIUM**: Vulnerabilities requiring specific conditions but with significant impact
- **LOW**: Defense-in-depth issues or lower-impact vulnerabilities

CONFIDENCE SCORING:
- 0.9-1.0: Certain exploit path identified, tested if possible
- 0.8-0.9: Clear vulnerability pattern with known exploitation methods
- 0.7-0.8: Suspicious pattern requiring specific conditions to exploit
- Below 0.7: Don't report (too speculative)

FINAL REMINDER:
Focus on HIGH and MEDIUM findings only. Better to miss some theoretical issues than flood the report with false positives. Each finding should be something a security engineer would confidently raise in a PR review.

FALSE POSITIVE FILTERING:

> You do not need to run commands to reproduce the vulnerability, just read the code to determine if it is a real vulnerability. Do not use the bash tool or write to any files.
>
> HARD EXCLUSIONS - Automatically exclude findings matching these patterns:
> 1. Denial of Service (DOS) vulnerabilities or resource exhaustion attacks.
> 2. Secrets or credentials stored on disk if they are otherwise secured.
> 3. Rate limiting concerns or service overload scenarios.
> 4. Memory consumption or CPU exhaustion issues.
> 5. Lack of input validation on non-security-critical fields without proven security impact.
> 6. Input sanitization concerns for GitHub Action workflows unless they are clearly triggerable via untrusted input.
> 7. A lack of hardening measures. Code is not expected to implement all security best practices, only flag concrete vulnerabilities.
> 8. Race conditions or timing attacks that are theoretical rather than practical issues. Only report a race condition if it is concretely problematic.
> 9. Vulnerabilities related to outdated third-party libraries. These are managed separately and should not be reported here.
> 10. Memory safety issues such as buffer overflows or use-after-free-vulnerabilities are impossible in rust. Do not report memory safety issues in rust or any other memory safe languages.
> 11. Files that are only unit tests or only used as part of running tests.
> 12. Log spoofing concerns. Outputting un-sanitized user input to logs is not a vulnerability.
> 13. SSRF vulnerabilities that only control the path. SSRF is only a concern if it can control the host or protocol.
> 14. Including user-controlled content in AI system prompts is not a vulnerability.
> 15. Regex injection. Injecting untrusted content into a regex is not a vulnerability.
> 16. Regex DOS concerns.
> 16. Insecure documentation. Do not report any findings in documentation files such as markdown files.
> 17. A lack of audit logs is not a vulnerability.
> 
> PRECEDENTS -
> 1. Logging high value secrets in plaintext is a vulnerability. Logging URLs is assumed to be safe.
> 2. UUIDs can be assumed to be unguessable and do not need to be validated.
> 3. Environment variables and CLI flags are trusted values. Attackers are generally not able to modify them in a secure environment. Any attack that relies on controlling an environment variable is invalid.
> 4. Resource management issues such as memory or file descriptor leaks are not valid.
> 5. Subtle or low impact web vulnerabilities such as tabnabbing, XS-Leaks, prototype pollution, and open redirects should not be reported unless they are extremely high confidence.
> 6. React and Angular are generally secure against XSS. These frameworks do not need to sanitize or escape user input unless it is using dangerouslySetInnerHTML, bypassSecurityTrustHtml, or similar methods. Do not report XSS vulnerabilities in React or Angular components or tsx files unless they are using unsafe methods.
> 7. Most vulnerabilities in github action workflows are not exploitable in practice. Before validating a github action workflow vulnerability ensure it is concrete and has a very specific attack path.
> 8. A lack of permission checking or authentication in client-side JS/TS code is not a vulnerability. Client-side code is not trusted and does not need to implement these checks, they are handled on the server-side. The same applies to all flows that send untrusted data to the backend, the backend is responsible for validating and sanitizing all inputs.
> 9. Only include MEDIUM findings if they are obvious and concrete issues.
> 10. Most vulnerabilities in ipython notebooks (*.ipynb files) are not exploitable in practice. Before validating a notebook vulnerability ensure it is concrete and has a very specific attack path where untrusted input can trigger the vulnerability.
> 11. Logging non-PII data is not a vulnerability even if the data may be sensitive. Only report logging vulnerabilities if they expose sensitive information such as secrets, passwords, or personally identifiable information (PII).
> 12. Command injection vulnerabilities in shell scripts are generally not exploitable in practice since shell scripts generally do not run with untrusted user input. Only report command injection vulnerabilities in shell scripts if they are concrete and have a very specific attack path for untrusted input.
> 
> SIGNAL QUALITY CRITERIA - For remaining findings, assess:
> 1. Is there a concrete, exploitable vulnerability with a clear attack path?
> 2. Does this represent a real security risk vs theoretical best practice?
> 3. Are there specific code locations and reproduction steps?
> 4. Would this finding be actionable for a security team?
> 
> For each finding, assign a confidence score from 1-10:
> - 1-3: Low confidence, likely false positive or noise
> - 4-6: Medium confidence, needs investigation
> - 7-10: High confidence, likely true vulnerability

START ANALYSIS:

Begin your analysis now. Do this in 3 steps:

1. Use a sub-task to identify vulnerabilities. Use the repository exploration tools to understand the codebase context, then analyze the PR changes for security implications. In the prompt for this sub-task, include all of the above.
2. Then for each vulnerability identified by the above sub-task, create a new sub-task to filter out false-positives. Launch these sub-tasks as parallel sub-tasks. In the prompt for these sub-tasks, include everything in the "FALSE POSITIVE FILTERING" instructions.
3. Filter out any vulnerabilities where the sub-task reported a confidence less than 8.

Your final reply must contain the markdown report and nothing else.`
// @from(Start 14174951, End 14174954)
GD9
// @from(Start 14174960, End 14175974)
ZD9 = L(() => {
  OjA();
  _y();
  GD9 = {
    type: "prompt",
    name: "security-review",
    description: "Complete a security review of the pending changes on the current branch",
    isEnabled: () => !0,
    isHidden: !1,
    progressMessage: "analyzing code changes for security risks",
    userFacingName() {
      return "security-review"
    },
    source: "builtin",
    async getPromptForCommand(A, Q) {
      let B = NV(Ex3),
        G = UO(B.frontmatter["allowed-tools"]);
      return [{
        type: "text",
        text: await Fa(B.content, {
          ...Q,
          async getAppState() {
            let I = await Q.getAppState();
            return {
              ...I,
              toolPermissionContext: {
                ...I.toolPermissionContext,
                alwaysAllowRules: {
                  ...I.toolPermissionContext.alwaysAllowRules,
                  command: G
                }
              }
            }
          }
        }, "security-review")
      }]
    }
  }
})
// @from(Start 14175980, End 14175983)
kF0
// @from(Start 14175985, End 14175988)
ID9
// @from(Start 14175994, End 14176377)
YD9 = L(() => {
  dY1();
  kF0 = BA(VA(), 1), ID9 = {
    type: "local-jsx",
    name: "usage",
    description: "Show plan usage limits",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A, Q) {
      return kF0.createElement(zVA, {
        onClose: A,
        context: Q,
        defaultTab: "Usage"
      })
    },
    userFacingName() {
      return "usage"
    }
  }
})
// @from(Start 14176380, End 14176850)
function zx3() {
  let A = N1(),
    Q = A.editorMode || "normal";
  if (Q === "emacs") Q = "normal";
  let B = Q === "normal" ? "vim" : "normal";
  return c0({
    ...A,
    editorMode: B
  }), GA("tengu_editor_mode_changed", {
    mode: B,
    source: "command"
  }), Promise.resolve({
    type: "text",
    value: `Editor mode set to ${B}. ${B==="vim"?"Use Escape key to toggle between INSERT and NORMAL modes.":"Using standard (readline) keyboard bindings."}`
  })
}
// @from(Start 14176855, End 14176858)
Ux3
// @from(Start 14176860, End 14176863)
JD9
// @from(Start 14176869, End 14177150)
WD9 = L(() => {
  jQ();
  q0();
  Ux3 = {
    name: "vim",
    description: "Toggle between Vim and Normal editing modes",
    isEnabled: () => !0,
    isHidden: !1,
    supportsNonInteractive: !1,
    type: "local",
    userFacingName: () => "vim",
    call: zx3
  }, JD9 = Ux3
})
// @from(Start 14177156, End 14177159)
yF0
// @from(Start 14177161, End 14177164)
$x3
// @from(Start 14177166, End 14177169)
XD9
// @from(Start 14177175, End 14177579)
VD9 = L(() => {
  fV0();
  yF0 = BA(VA(), 1), $x3 = {
    type: "local-jsx",
    name: "permissions",
    aliases: ["allowed-tools"],
    description: "Manage allow & deny tool permission rules",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A) {
      return yF0.createElement(kY1, {
        onExit: A
      })
    },
    userFacingName() {
      return "permissions"
    }
  }, XD9 = $x3
})
// @from(Start 14177582, End 14178140)
function wx3({
  planContent: A,
  planPath: Q,
  editorName: B
}) {
  return QJ.createElement(S, {
    flexDirection: "column"
  }, QJ.createElement($, {
    bold: !0
  }, "Current Plan"), QJ.createElement($, {
    dimColor: !0
  }, Q), QJ.createElement(S, {
    marginTop: 1
  }, QJ.createElement($, null, A)), B && QJ.createElement(S, {
    marginTop: 1
  }, QJ.createElement($, {
    dimColor: !0
  }, '"/plan open"'), QJ.createElement($, {
    dimColor: !0
  }, " to edit this plan in "), QJ.createElement($, {
    bold: !0,
    dimColor: !0
  }, B)))
}
// @from(Start 14178145, End 14178147)
QJ
// @from(Start 14178149, End 14178152)
qx3
// @from(Start 14178154, End 14178157)
FD9
// @from(Start 14178163, End 14179251)
KD9 = L(() => {
  hA();
  _0();
  NE();
  pn();
  nY();
  DSA();
  QJ = BA(VA(), 1);
  qx3 = {
    type: "local-jsx",
    name: "plan",
    description: "View or open the current session plan",
    argumentHint: "[open]",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A, {
      options: {
        isNonInteractiveSession: Q
      }
    }, B) {
      let G = e1(),
        Z = xU(G),
        I = yU(G);
      if (!Z) return A("No plan found for current session"), null;
      if (B.trim().split(/\s+/)[0] === "open") try {
        return await cn(I), A(`Opened plan in editor: ${I}`), null
      } catch (V) {
        return A(`Failed to open plan in editor: ${V}`), null
      }
      let J = Jg(),
        W = J ? aF(J) : void 0,
        X = QJ.createElement(wx3, {
          planContent: Z,
          planPath: I,
          editorName: W
        });
      if (Q) {
        let V = await UVA(X);
        return A(V), null
      }
      return QJ.createElement($VA, {
        onComplete: A
      }, X)
    },
    userFacingName() {
      return "plan"
    }
  }, FD9 = qx3
})
// @from(Start 14179254, End 14182929)
function DD9({
  onDone: A
}) {
  let [Q, B] = nQA.useState(!0), [G, Z] = nQA.useState([]), [I, Y] = nQA.useState(!1), [J, W] = nQA.useState(null), X = EQ(() => A("Guest passes dialog dismissed", {
    display: "system"
  }));
  if (f1((D, H) => {
      if (H.escape) A("Guest passes dialog dismissed", {
        display: "system"
      });
      if (H.return && J)(async () => {
        if (await La(J)) A("Referral link copied to clipboard!");
        else A(ZJ1(), {
          display: "system"
        })
      })()
    }), nQA.useEffect(() => {
      async function D() {
        try {
          let H = await xjA();
          if (!H || !H.eligible) {
            Y(!1), B(!1);
            return
          }
          if (Y(!0), H.referral_code_details?.referral_link) W(H.referral_code_details.referral_link);
          let C;
          try {
            C = await w59()
          } catch (w) {
            AA(w), Y(!1), B(!1);
            return
          }
          let E = C.redemptions || [],
            U = C.limit || 3,
            q = [];
          for (let w = 0; w < U; w++) {
            let N = E[w];
            q.push({
              passNumber: w + 1,
              isAvailable: !N
            })
          }
          Z(q), B(!1)
        } catch (H) {
          AA(H), Y(!1), B(!1)
        }
      }
      D()
    }, []), Q) return SB.createElement(S, {
    flexDirection: "column",
    marginTop: 1,
    gap: 1
  }, SB.createElement($, {
    dimColor: !0
  }, "Loading guest pass information…"), SB.createElement($, {
    dimColor: !0,
    italic: !0
  }, X.pending ? SB.createElement(SB.Fragment, null, "Press ", X.keyName, " again to exit") : SB.createElement(SB.Fragment, null, "Esc to exit")));
  if (!I) return SB.createElement(S, {
    flexDirection: "column",
    marginTop: 1,
    gap: 1
  }, SB.createElement($, null, "Guest passes are not currently available."), SB.createElement($, {
    dimColor: !0,
    italic: !0
  }, X.pending ? SB.createElement(SB.Fragment, null, "Press ", X.keyName, " again to exit") : SB.createElement(SB.Fragment, null, "Esc to exit")));
  let V = G.filter((D) => D.isAvailable).length,
    F = [...G].sort((D, H) => +H.isAvailable - +D.isAvailable),
    K = (D) => {
      if (!D.isAvailable) return SB.createElement(S, {
        key: D.passNumber,
        flexDirection: "column",
        marginRight: 1
      }, SB.createElement($, {
        dimColor: !0
      }, "┌─────────╱"), SB.createElement($, {
        dimColor: !0
      }, " ) CC ✻ ┊╱"), SB.createElement($, {
        dimColor: !0
      }, "└───────╱"));
      return SB.createElement(S, {
        key: D.passNumber,
        flexDirection: "column",
        marginRight: 1
      }, SB.createElement($, null, "┌─────────┐"), SB.createElement($, null, " ) CC ", SB.createElement($, {
        color: "claude"
      }, "✻"), " ┊( "), SB.createElement($, null, "└─────────┘"))
    };
  return SB.createElement(S, {
    flexDirection: "column",
    marginTop: 1,
    gap: 1
  }, SB.createElement($, {
    color: "permission"
  }, "Guest passes · ", V, " left"), SB.createElement(S, {
    flexDirection: "row",
    marginLeft: 2
  }, F.map((D) => K(D))), J && SB.createElement(S, {
    marginLeft: 2
  }, SB.createElement($, null, J)), SB.createElement(S, {
    flexDirection: "column",
    marginLeft: 2
  }, SB.createElement($, {
    dimColor: !0
  }, "Share a free week of Claude Code with friends.")), SB.createElement(S, null, SB.createElement($, {
    dimColor: !0,
    italic: !0
  }, X.pending ? SB.createElement(SB.Fragment, null, "Press ", X.keyName, " again to exit") : SB.createElement(SB.Fragment, null, "Enter to copy link · Esc to exit"))))
}
// @from(Start 14182934, End 14182936)
SB
// @from(Start 14182938, End 14182941)
nQA
// @from(Start 14182947, End 14183045)
HD9 = L(() => {
  hA();
  vjA();
  g1();
  $SA();
  Q4();
  SB = BA(VA(), 1), nQA = BA(VA(), 1)
})
// @from(Start 14183051, End 14183054)
xF0
// @from(Start 14183056, End 14183059)
CD9
// @from(Start 14183065, End 14183631)
ED9 = L(() => {
  HD9();
  jQ();
  q0();
  xF0 = BA(VA(), 1), CD9 = {
    type: "local-jsx",
    name: "passes",
    description: "Share a free week of Claude Code with friends",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A) {
      let Q = N1(),
        B = !Q.hasVisitedPasses;
      if (B) c0({
        ...Q,
        hasVisitedPasses: !0
      });
      return GA("tengu_guest_passes_visited", {
        is_first_visit: B
      }), xF0.createElement(DD9, {
        onDone: A
      })
    },
    userFacingName() {
      return "passes"
    }
  }
})
// @from(Start 14183634, End 14184083)
function zD9(A, Q, B) {
  if (A !== null && A.grove_enabled !== null) return !1;
  if (B) return !0;
  if (Q !== null && !Q.notice_is_grace_period) return !0;
  let Z = Q?.notice_reminder_frequency;
  if (Z !== null && Z !== void 0 && A?.grove_notice_viewed_at) return Math.floor((Date.now() - new Date(A.grove_notice_viewed_at).getTime()) / 86400000) >= Z;
  else {
    let I = A?.grove_notice_viewed_at;
    return I === null || I === void 0
  }
}
// @from(Start 14184085, End 14185932)
function Lx3() {
  return _Q.default.createElement(_Q.default.Fragment, null, _Q.default.createElement(S, {
    flexDirection: "column"
  }, _Q.default.createElement($, {
    bold: !0,
    color: "professionalBlue"
  }, "Updates to Consumer Terms and Policies"), _Q.default.createElement($, null, "An update to our Consumer Terms and Privacy Policy will take effect on", " ", _Q.default.createElement($, {
    bold: !0
  }, "October 8, 2025"), ". You can accept the updated terms today.")), _Q.default.createElement(S, {
    flexDirection: "column"
  }, _Q.default.createElement($, null, "What's changing?"), _Q.default.createElement(S, {
    paddingLeft: 1
  }, _Q.default.createElement($, null, _Q.default.createElement($, null, "• "), _Q.default.createElement($, {
    bold: !0
  }, "You can help improve Claude "), _Q.default.createElement($, null, "— Allow the use of your chats and coding sessions to train and improve Anthropic AI models. Change anytime in your Privacy Settings (", _Q.default.createElement(h4, {
    url: "https://claude.ai/settings/data-privacy-controls"
  }), ")."))), _Q.default.createElement(S, {
    paddingLeft: 1
  }, _Q.default.createElement($, null, _Q.default.createElement($, null, "• "), _Q.default.createElement($, {
    bold: !0
  }, "Updates to data retention "), _Q.default.createElement($, null, "— To help us improve our AI models and safety protections, we're extending data retention to 5 years.")))), _Q.default.createElement($, null, "Learn more (", _Q.default.createElement(h4, {
    url: "https://www.anthropic.com/news/updates-to-our-consumer-terms"
  }), ") or read the updated Consumer Terms (", _Q.default.createElement(h4, {
    url: "https://anthropic.com/legal/terms"
  }), ") and Privacy Policy (", _Q.default.createElement(h4, {
    url: "https://anthropic.com/legal/privacy"
  }), ")"))
}
// @from(Start 14185934, End 14187578)
function Mx3() {
  return _Q.default.createElement(_Q.default.Fragment, null, _Q.default.createElement(S, {
    flexDirection: "column"
  }, _Q.default.createElement($, {
    bold: !0,
    color: "professionalBlue"
  }, "Updates to Consumer Terms and Policies"), _Q.default.createElement($, null, "We've updated our Consumer Terms and Privacy Policy.")), _Q.default.createElement(S, {
    flexDirection: "column",
    gap: 1
  }, _Q.default.createElement($, null, "What's changing?"), _Q.default.createElement(S, {
    flexDirection: "column"
  }, _Q.default.createElement($, {
    bold: !0
  }, "Help improve Claude"), _Q.default.createElement($, null, "Allow the use of your chats and coding sessions to train and improve Anthropic AI models. You can change this anytime in Privacy Settings"), _Q.default.createElement(h4, {
    url: "https://claude.ai/settings/data-privacy-controls"
  })), _Q.default.createElement(S, {
    flexDirection: "column"
  }, _Q.default.createElement($, {
    bold: !0
  }, "How this affects data retention"), _Q.default.createElement($, null, "Turning ON the improve Claude setting extends data retention from 30 days to 5 years. Turning it OFF keeps the default 30-day data retention. Delete data anytime."))), _Q.default.createElement($, null, "Learn more (", _Q.default.createElement(h4, {
    url: "https://www.anthropic.com/news/updates-to-our-consumer-terms"
  }), ") or read the updated Consumer Terms (", _Q.default.createElement(h4, {
    url: "https://anthropic.com/legal/terms"
  }), ") and Privacy Policy (", _Q.default.createElement(h4, {
    url: "https://anthropic.com/legal/privacy"
  }), ")"))
}