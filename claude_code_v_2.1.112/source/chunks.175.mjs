
// @from(Ln 449388, Col 0)
function AIY(q) {
    let [K] = K$.useState(() => FV()), [_, z] = K$.useState({
        ...YIY,
        useExistingKey: !!K,
        selectedApiKeyOption: K ? "existing" : jX() ? "oauth" : "new"
    });
    $3(), K$.default.useEffect(() => {
        d("tengu_install_github_app_started", {})
    }, []);
    let Y = K$.useCallback(async () => {
        let N = [];
        if ((await ij("gh --version", {
                reject: !1
            })).exitCode !== 0) N.push({
            title: "GitHub CLI not found",
            message: "GitHub CLI (gh) does not appear to be installed or accessible.",
            instructions: ["Install GitHub CLI from https://cli.github.com/", "macOS: brew install gh", "Windows: winget install --id GitHub.cli", "Linux: See installation instructions at https://github.com/cli/cli#installation"]
        });
        let h = await ij("gh auth status -a", {
            reject: !1
        });
        if (h.exitCode !== 0) N.push({
            title: "GitHub CLI not authenticated",
            message: "GitHub CLI does not appear to be authenticated.",
            instructions: ["Run: gh auth login", "Follow the prompts to authenticate with GitHub", "Or set up authentication using environment variables or other methods"]
        });
        else {
            let x = h.stdout.match(/Token scopes:.*$/m);
            if (x) {
                let B = x[0],
                    m = [];
                if (!B.includes("repo")) m.push("repo");
                if (!B.includes("workflow")) m.push("workflow");
                if (m.length > 0) {
                    z((S) => ({
                        ...S,
                        step: "error",
                        error: `GitHub CLI is missing required permissions: ${m.join(", ")}.`,
                        errorReason: "Missing required scopes",
                        errorInstructions: [`Your GitHub CLI authentication is missing the "${m.join('" and "')}" ${O7(m.length,"scope")} needed to manage GitHub Actions and secrets.`, "", "To fix this, run:", "  gh auth refresh -h github.com -s repo,workflow", "", "This will add the necessary permissions to manage workflows and secrets."]
                    }));
                    return
                }
            }
        }
        let C = await mA6() ?? "";
        d("tengu_install_github_app_step_completed", {
            step: "check-gh"
        }), z((x) => ({
            ...x,
            warnings: N,
            currentRepo: C,
            selectedRepoName: C,
            useCurrentRepo: !!C,
            step: N.length > 0 ? "warnings" : "choose-repo"
        }))
    }, []);
    K$.default.useEffect(() => {
        if (_.step === "check-gh") Y()
    }, [_.step, Y]);
    let A = K$.useCallback(async (N, R) => {
        z((h) => ({
            ...h,
            step: "creating",
            currentWorkflowInstallStep: 0
        }));
        try {
            await wpK(_.selectedRepoName, N, R, () => {
                z((h) => ({
                    ...h,
                    currentWorkflowInstallStep: h.currentWorkflowInstallStep + 1
                }))
            }, _.workflowAction === "skip", _.selectedWorkflows, _.authType, {
                useCurrentRepo: _.useCurrentRepo,
                workflowExists: _.workflowExists,
                secretExists: _.secretExists
            }), d("tengu_install_github_app_step_completed", {
                step: "creating"
            }), z((h) => ({
                ...h,
                step: "success"
            }))
        } catch (h) {
            let C = h instanceof Error ? h.message : "Failed to set up GitHub Actions";
            if (C.includes("workflow file already exists")) d("tengu_install_github_app_error", {
                reason: "workflow_file_exists"
            }), z((x) => ({
                ...x,
                step: "error",
                error: "A Claude workflow file already exists in this repository.",
                errorReason: "Workflow file conflict",
                errorInstructions: ["The file .github/workflows/claude.yml already exists", "You can either:", "  1. Delete the existing file and run this command again", "  2. Update the existing file manually using the template from:", `     ${Vn}`]
            }));
            else d("tengu_install_github_app_error", {
                reason: "setup_github_actions_failed"
            }), z((x) => ({
                ...x,
                step: "error",
                error: C,
                errorReason: "GitHub Actions setup failed",
                errorInstructions: []
            }))
        }
    }, [_.selectedRepoName, _.workflowAction, _.selectedWorkflows, _.useCurrentRepo, _.workflowExists, _.secretExists, _.authType]);
    async function O() {
        await J3("https://github.com/apps/claude")
    }
    async function w(N) {
        try {
            let R = await w1("gh", ["api", `repos/${N}`, "--jq", ".permissions.admin"]);
            if (R.code === 0) return {
                hasAccess: R.stdout.trim() === "true"
            };
            if (R.stderr.includes("404") || R.stderr.includes("Not Found")) return {
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
    async function $(N) {
        return (await w1("gh", ["api", `repos/${N}/contents/.github/workflows/claude.yml`, "--jq", ".sha"])).code === 0
    }
    async function j() {
        let N = await w1("gh", ["secret", "list", "--app", "actions", "--repo", _.selectedRepoName]);
        if (N.code === 0)
            if (N.stdout.split(`
`).some((C) => {
                    return /^ANTHROPIC_API_KEY\s+/.test(C)
                })) z((C) => ({
                ...C,
                secretExists: !0,
                step: "check-existing-secret"
            }));
            else if (K) z((C) => ({
            ...C,
            apiKeyOrOAuthToken: K,
            useExistingKey: !0
        })), await A(K, _.secretName);
        else z((C) => ({
            ...C,
            step: "api-key"
        }));
        else if (K) z((R) => ({
            ...R,
            apiKeyOrOAuthToken: K,
            useExistingKey: !0
        })), await A(K, _.secretName);
        else z((R) => ({
            ...R,
            step: "api-key"
        }))
    }
    let H = async () => {
        if (_.step === "warnings") d("tengu_install_github_app_step_completed", {
            step: "warnings"
        }), z((N) => ({
            ...N,
            step: "install-app"
        })), setTimeout(O, 0);
        else if (_.step === "choose-repo") {
            let N = _.useCurrentRepo ? _.currentRepo : _.selectedRepoName;
            if (!N.trim()) return;
            let R = [];
            if (N.includes("github.com")) {
                let x = N.match(/github\.com[:/]([^/]+\/[^/]+)(\.git)?$/);
                if (!x) R.push({
                    title: "Invalid GitHub URL format",
                    message: "The repository URL format appears to be invalid.",
                    instructions: ["Use format: owner/repo or https://github.com/owner/repo", "Example: anthropics/claude-cli"]
                });
                else N = x[1]?.replace(/\.git$/, "") || ""
            }
            if (!N.includes("/")) R.push({
                title: "Repository format warning",
                message: 'Repository should be in format "owner/repo"',
                instructions: ["Use format: owner/repo", "Example: anthropics/claude-cli"]
            });
            let h = await w(N);
            if (h.error === "repository_not_found") R.push({
                title: "Repository not found",
                message: `Repository ${N} was not found or you don't have access.`,
                instructions: [`Check that the repository name is correct: ${N}`, "Ensure you have access to this repository", 'For private repositories, make sure your GitHub token has the "repo" scope', "You can add the repo scope with: gh auth refresh -h github.com -s repo,workflow"]
            });
            else if (!h.hasAccess) R.push({
                title: "Admin permissions required",
                message: `You might need admin permissions on ${N} to set up GitHub Actions.`,
                instructions: ["Repository admins can install GitHub Apps and set secrets", "Ask a repository admin to run this command if setup fails", "Alternatively, you can use the manual setup instructions"]
            });
            let C = await $(N);
            if (R.length > 0) {
                let x = [..._.warnings, ...R];
                z((B) => ({
                    ...B,
                    selectedRepoName: N,
                    workflowExists: C,
                    warnings: x,
                    step: "warnings"
                }))
            } else d("tengu_install_github_app_step_completed", {
                step: "choose-repo"
            }), z((x) => ({
                ...x,
                selectedRepoName: N,
                workflowExists: C,
                step: "install-app"
            })), setTimeout(O, 0)
        } else if (_.step === "install-app")
            if (d("tengu_install_github_app_step_completed", {
                    step: "install-app"
                }), _.workflowExists) z((N) => ({
                ...N,
                step: "check-existing-workflow"
            }));
            else z((N) => ({
                ...N,
                step: "select-workflows"
            }));
        else if (_.step === "check-existing-workflow") return;
        else if (_.step === "select-workflows") return;
        else if (_.step === "check-existing-secret")
            if (d("tengu_install_github_app_step_completed", {
                    step: "check-existing-secret"
                }), _.useExistingSecret) await A(null, _.secretName);
            else await A(_.apiKeyOrOAuthToken, _.secretName);
        else if (_.step === "api-key") {
            if (_.selectedApiKeyOption === "oauth") return;
            let N = _.selectedApiKeyOption === "existing" ? K : _.apiKeyOrOAuthToken;
            if (!N) {
                d("tengu_install_github_app_error", {
                    reason: "api_key_missing"
                }), z((h) => ({
                    ...h,
                    step: "error",
                    error: "API key is required"
                }));
                return
            }
            z((h) => ({
                ...h,
                apiKeyOrOAuthToken: N,
                useExistingKey: _.selectedApiKeyOption === "existing"
            }));
            let R = await w1("gh", ["secret", "list", "--app", "actions", "--repo", _.selectedRepoName]);
            if (R.code === 0)
                if (R.stdout.split(`
`).some((x) => {
                        return /^ANTHROPIC_API_KEY\s+/.test(x)
                    })) d("tengu_install_github_app_step_completed", {
                    step: "api-key"
                }), z((x) => ({
                    ...x,
                    secretExists: !0,
                    step: "check-existing-secret"
                }));
                else d("tengu_install_github_app_step_completed", {
                    step: "api-key"
                }), await A(N, _.secretName);
            else d("tengu_install_github_app_step_completed", {
                step: "api-key"
            }), await A(N, _.secretName)
        }
    }, J = (N) => {
        z((R) => ({
            ...R,
            selectedRepoName: N
        }))
    }, X = (N) => {
        z((R) => ({
            ...R,
            apiKeyOrOAuthToken: N
        }))
    }, M = (N) => {
        z((R) => ({
            ...R,
            selectedApiKeyOption: N
        }))
    }, P = K$.useCallback(() => {
        d("tengu_install_github_app_step_completed", {
            step: "api-key"
        }), z((N) => ({
            ...N,
            step: "oauth-flow"
        }))
    }, []), W = K$.useCallback((N) => {
        d("tengu_install_github_app_step_completed", {
            step: "oauth-flow"
        }), z((R) => ({
            ...R,
            apiKeyOrOAuthToken: N,
            useExistingKey: !1,
            secretName: "CLAUDE_CODE_OAUTH_TOKEN",
            authType: "oauth_token"
        })), A(N, "CLAUDE_CODE_OAUTH_TOKEN")
    }, [A]), D = K$.useCallback(() => {
        z((N) => ({
            ...N,
            step: "api-key"
        }))
    }, []), Z = (N) => {
        if (N && !/^[a-zA-Z0-9_]+$/.test(N)) return;
        z((R) => ({
            ...R,
            secretName: N
        }))
    }, G = (N) => {
        z((R) => ({
            ...R,
            useCurrentRepo: N,
            selectedRepoName: N ? R.currentRepo : ""
        }))
    }, f = (N) => {
        z((R) => ({
            ...R,
            useExistingKey: N
        }))
    }, v = (N) => {
        z((R) => ({
            ...R,
            useExistingSecret: N,
            secretName: N ? "ANTHROPIC_API_KEY" : ""
        }))
    }, V = async (N) => {
        if (N === "exit") {
            q.onDone("Installation cancelled by user");
            return
        }
        if (d("tengu_install_github_app_step_completed", {
                step: "check-existing-workflow"
            }), z((R) => ({
                ...R,
                workflowAction: N
            })), N === "skip" || N === "update")
            if (K) await j();
            else z((R) => ({
                ...R,
                step: "api-key"
            }))
    };

    function k(N) {
        if (N.preventDefault(), _.step === "success") d("tengu_install_github_app_completed", {});
        q.onDone(_.step === "success" ? "GitHub Actions setup complete!" : _.error ? `Couldn't install GitHub App: ${_.error}
For manual setup instructions, see: ${Vn}` : `GitHub App installation failed
For manual setup instructions, see: ${Vn}`)
    }
    switch (_.step) {
        case "check-gh":
            return K$.default.createElement(cBK, null);
        case "warnings":
            return K$.default.createElement(jpK, {
                warnings: _.warnings,
                onContinue: H
            });
        case "choose-repo":
            return K$.default.createElement(nBK, {
                currentRepo: _.currentRepo,
                useCurrentRepo: _.useCurrentRepo,
                repoUrl: _.selectedRepoName,
                onRepoUrlChange: J,
                onToggleUseCurrentRepo: G,
                onSubmit: H
            });
        case "install-app":
            return K$.default.createElement(qpK, {
                repoUrl: _.selectedRepoName,
                onSubmit: H
            });
        case "check-existing-workflow":
            return K$.default.createElement(tBK, {
                repoName: _.selectedRepoName,
                onSelectAction: V
            });
        case "check-existing-secret":
            return K$.default.createElement(UBK, {
                useExistingSecret: _.useExistingSecret,
                secretName: _.secretName,
                onToggleUseExistingSecret: v,
                onSecretNameChange: Z,
                onSubmit: H
            });
        case "api-key":
            return K$.default.createElement(FBK, {
                existingApiKey: K,
                useExistingKey: _.useExistingKey,
                apiKeyOrOAuthToken: _.apiKeyOrOAuthToken,
                onApiKeyChange: X,
                onToggleUseExistingKey: f,
                onSubmit: H,
                onCreateOAuthToken: jX() ? P : void 0,
                selectedOption: _.selectedApiKeyOption,
                onSelectOption: M
            });
        case "creating":
            return K$.default.createElement(rBK, {
                currentWorkflowInstallStep: _.currentWorkflowInstallStep,
                secretExists: _.secretExists,
                useExistingSecret: _.useExistingSecret,
                secretName: _.secretName,
                skipWorkflow: _.workflowAction === "skip",
                selectedWorkflows: _.selectedWorkflows
            });
        case "success":
            return K$.default.createElement(u, {
                tabIndex: 0,
                autoFocus: !0,
                onKeyDown: k
            }, K$.default.createElement(ApK, {
                secretExists: _.secretExists,
                useExistingSecret: _.useExistingSecret,
                secretName: _.secretName,
                skipWorkflow: _.workflowAction === "skip"
            }));
        case "error":
            return K$.default.createElement(u, {
                tabIndex: 0,
                autoFocus: !0,
                onKeyDown: k
            }, K$.default.createElement(aBK, {
                error: _.error,
                errorReason: _.errorReason,
                errorInstructions: _.errorInstructions
            }));
        case "select-workflows":
            return K$.default.createElement(IBK, {
                defaultSelections: _.selectedWorkflows,
                onSubmit: (N) => {
                    if (d("tengu_install_github_app_step_completed", {
                            step: "select-workflows"
                        }), z((R) => ({
                            ...R,
                            selectedWorkflows: N
                        })), K) j();
                    else z((R) => ({
                        ...R,
                        step: "api-key"
                    }))
                }
            });
        case "oauth-flow":
            return K$.default.createElement(zpK, {
                onSuccess: W,
                onCancel: D
            })
    }
}
// @from(Ln 449840, Col 0)
async function OIY(q) {
    return K$.default.createElement(AIY, {
        onDone: q
    })
}
// @from(Ln 449845, Col 4)
K$
// @from(Ln 449845, Col 8)
YIY
// @from(Ln 449846, Col 4)
XpK = L(() => {
    C8();
    xBK();
    C$();
    g6();
    T7();
    Nj();
    Q4();
    pK();
    NV();
    gBK();
    QBK();
    lBK();
    iBK();
    oBK();
    sBK();
    eBK();
    KpK();
    YpK();
    OpK();
    $pK();
    HpK();
    K$ = K6(P6(), 1), YIY = {
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
    }
})
// @from(Ln 449886, Col 4)
wIY
// @from(Ln 449886, Col 9)
MpK
// @from(Ln 449887, Col 4)
PpK = L(() => {
    Q8();
    wIY = {
        type: "local-jsx",
        name: "install-github-app",
        description: "Set up Claude GitHub Actions for a repository",
        availability: ["claude-ai", "console"],
        isEnabled: () => !S6(process.env.DISABLE_INSTALL_GITHUB_APP_COMMAND),
        load: () => Promise.resolve().then(() => (XpK(), JpK))
    }, MpK = wIY
})
// @from(Ln 449898, Col 4)
DpK = {}
// @from(Ln 449902, Col 0)
async function $IY() {
    if (d("tengu_install_slack_app_clicked", {}), d8((K) => ({
            ...K,
            slackAppInstallCount: (K.slackAppInstallCount ?? 0) + 1
        })), await J3(WpK)) return {
        type: "text",
        value: "Opening Slack app installation page in browser…"
    };
    else return {
        type: "text",
        value: `Couldn't open browser. Visit: ${WpK}`
    }
}
// @from(Ln 449915, Col 4)
WpK = "https://slack.com/marketplace/A08SF47R6P4-claude"
// @from(Ln 449916, Col 4)
ZpK = L(() => {
    C8();
    Nj();
    h1()
})
// @from(Ln 449921, Col 4)
jIY
// @from(Ln 449921, Col 9)
fpK
// @from(Ln 449922, Col 4)
GpK = L(() => {
    jIY = {
        type: "local",
        name: "install-slack-app",
        description: "Install the Claude Slack app",
        availability: ["claude-ai"],
        supportsNonInteractive: !1,
        load: () => Promise.resolve().then(() => (ZpK(), DpK))
    }, fpK = jIY
})
// @from(Ln 449932, Col 4)
vpK
// @from(Ln 449933, Col 4)
TpK = L(() => {
    vpK = {
        isEnabled: () => !1,
        isHidden: !0,
        name: "stub"
    }
})
// @from(Ln 449941, Col 0)
function cO7({
    agentServer: q,
    onCancel: K,
    onComplete: _
}) {
    let [z] = Zq(), [Y, A] = R5.useState(!1), [O, w] = R5.useState(null), [$, j] = R5.useState(null), H = R5.useRef(null);
    R5.useEffect(() => () => H.current?.abort(), []);
    let J = R5.useCallback(() => {
        if (Y) H.current?.abort(), H.current = null, A(!1), j(null)
    }, [Y]);
    G1("confirm:no", J, {
        context: "Confirmation",
        isActive: Y
    });
    let X = R5.useCallback(async () => {
            if (!q.needsAuth || !q.url) return;
            A(!0), w(null);
            let W = new AbortController;
            H.current = W;
            try {
                let D = {
                    type: q.transport,
                    url: q.url
                };
                await T_6(q.name, D, j, W.signal), _?.(`Authentication successful for ${q.name}. The server will connect when the agent runs.`)
            } catch (D) {
                if (D instanceof Error && !(D instanceof Xu)) w(D.message)
            } finally {
                A(!1), H.current = null
            }
        }, [q, _]),
        M = zv(String(q.name));
    if (Y) return R5.default.createElement(u, {
        flexDirection: "column",
        gap: 1,
        padding: 1
    }, R5.default.createElement(T, {
        color: "claude"
    }, "Authenticating with ", q.name, "…"), R5.default.createElement(u, null, R5.default.createElement(Y5, null), R5.default.createElement(T, null, " A browser window will open for authentication")), $ && R5.default.createElement(u, {
        flexDirection: "column"
    }, R5.default.createElement(T, {
        dimColor: !0
    }, "If your browser doesn't open automatically, copy this URL manually:"), R5.default.createElement(yq, {
        url: $
    })), R5.default.createElement(u, {
        marginLeft: 3
    }, R5.default.createElement(T, {
        dimColor: !0
    }, "Return here after authenticating in your browser.", " ", R5.default.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    }))));
    let P = [];
    if (q.needsAuth) P.push({
        label: q.isAuthenticated ? "Re-authenticate" : "Authenticate",
        value: "auth"
    });
    return P.push({
        label: "Back",
        value: "back"
    }), R5.default.createElement(R1, {
        title: `${M} MCP Server`,
        subtitle: "agent-only",
        onCancel: K,
        inputGuide: (W) => W.pending ? R5.default.createElement(T, null, "Press ", W.keyName, " again to exit") : R5.default.createElement(z1, null, R5.default.createElement(A8, {
            chord: ["up", "down"],
            format: {
                arrowSep: ""
            },
            action: "navigate"
        }), R5.default.createElement(A8, {
            chord: "enter",
            action: "confirm"
        }), R5.default.createElement(v1, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "go back"
        }))
    }, R5.default.createElement(u, {
        flexDirection: "column",
        gap: 0
    }, R5.default.createElement(u, null, R5.default.createElement(T, {
        bold: !0
    }, "Type: "), R5.default.createElement(T, {
        dimColor: !0
    }, q.transport)), q.url && R5.default.createElement(u, null, R5.default.createElement(T, {
        bold: !0
    }, "URL: "), R5.default.createElement(T, {
        dimColor: !0
    }, q.url)), q.command && R5.default.createElement(u, null, R5.default.createElement(T, {
        bold: !0
    }, "Command: "), R5.default.createElement(T, {
        dimColor: !0
    }, q.command)), R5.default.createElement(u, null, R5.default.createElement(T, {
        bold: !0
    }, "Used by: "), R5.default.createElement(T, {
        dimColor: !0
    }, q.sourceAgents.join(", "))), R5.default.createElement(u, {
        marginTop: 1
    }, R5.default.createElement(T, {
        bold: !0
    }, "Status: "), R5.default.createElement(T, null, d7("inactive", z)(e6.radioOff), " not connected (agent-only)")), q.needsAuth && R5.default.createElement(u, null, R5.default.createElement(T, {
        bold: !0
    }, "Auth: "), q.isAuthenticated ? R5.default.createElement(T, null, d7("success", z)(e6.tick), " authenticated") : R5.default.createElement(T, null, d7("warning", z)(e6.triangleUpOutline), " may need authentication"))), R5.default.createElement(u, null, R5.default.createElement(T, {
        dimColor: !0
    }, "This server connects only when running the agent.")), O && R5.default.createElement(u, null, R5.default.createElement(T, {
        color: "error"
    }, "Error: ", O)), R5.default.createElement(u, null, R5.default.createElement(A1, {
        options: P,
        onChange: async (W) => {
            switch (W) {
                case "auth":
                    await X();
                    break;
                case "back":
                    K();
                    break
            }
        },
        onCancel: K
    })))
}
// @from(Ln 450066, Col 4)
R5
// @from(Ln 450067, Col 4)
lO7 = L(() => {
    Qq();
    g6();
    C7();
    me();
    bK();
    g_();
    Nq();
    S4();
    u7();
    Ej();
    R5 = K6(P6(), 1)
})
// @from(Ln 450081, Col 0)
function kpK(q) {
    switch (q) {
        case "project":
            return {
                label: "Project MCPs", path: rk(q)
            };
        case "user":
            return {
                label: "User MCPs", path: rk(q)
            };
        case "local":
            return {
                label: "Local MCPs", path: rk(q)
            };
        case "enterprise":
            return {
                label: "Enterprise MCPs"
            };
        case "dynamic":
            return {
                label: "Built-in MCPs", path: "always available"
            };
        default:
            return {
                label: q
            }
    }
}
// @from(Ln 450110, Col 0)
function HIY(q) {
    let K = new Map;
    for (let _ of q) {
        let z = _.scope;
        if (!K.has(z)) K.set(z, []);
        K.get(z).push(_)
    }
    for (let [, _] of K) _.sort((z, Y) => z.name.localeCompare(Y.name));
    return K
}
// @from(Ln 450121, Col 0)
function nO7(q) {
    let K = s(78),
        {
            servers: _,
            agentServers: z,
            onSelectServer: Y,
            onSelectAgentServer: A,
            onComplete: O
        } = q,
        w;
    if (K[0] !== z) w = z === void 0 ? [] : z, K[0] = z, K[1] = w;
    else w = K[1];
    let $ = w,
        [j] = Zq(),
        [H, J] = B9.useState(0),
        X;
    if (K[2] !== _) {
        let k6 = _.filter(DIY);
        X = HIY(k6), K[2] = _, K[3] = X
    } else X = K[3];
    let M = X,
        P;
    if (K[4] !== _) P = _.filter(WIY).sort(PIY), K[4] = _, K[5] = P;
    else P = K[5];
    let W = P,
        D;
    if (K[6] !== M) D = (M.get("dynamic") ?? []).sort(MIY), K[6] = M, K[7] = D;
    else D = K[7];
    let Z = D,
        G;
    if (K[8] === Symbol.for("react.memo_cache_sentinel")) G = kpK("dynamic"), K[8] = G;
    else G = K[8];
    let f = G,
        v;
    if (K[9] !== $ || K[10] !== W || K[11] !== Z || K[12] !== M) {
        v = [];
        for (let k6 of VpK) {
            let T6 = M.get(k6) ?? [];
            for (let v6 of T6) v.push({
                type: "server",
                server: v6
            })
        }
        for (let k6 of W) v.push({
            type: "server",
            server: k6
        });
        for (let k6 of $) v.push({
            type: "agent-server",
            agentServer: k6
        });
        for (let k6 of Z) v.push({
            type: "server",
            server: k6
        });
        K[9] = $, K[10] = W, K[11] = Z, K[12] = M, K[13] = v
    } else v = K[13];
    let V = v,
        k;
    if (K[14] !== O) k = () => {
        O("MCP dialog dismissed", {
            display: "system"
        })
    }, K[14] = O, K[15] = k;
    else k = K[15];
    let N = k,
        R;
    if (K[16] !== A || K[17] !== Y || K[18] !== V || K[19] !== H) R = () => {
        let k6 = V[H];
        if (!k6) return;
        if (k6.type === "server") Y(k6.server);
        else if (k6.type === "agent-server" && A) A(k6.agentServer)
    }, K[16] = A, K[17] = Y, K[18] = V, K[19] = H, K[20] = R;
    else R = K[20];
    let h = R,
        C, x;
    if (K[21] !== V) x = () => J((k6) => k6 === 0 ? V.length - 1 : k6 - 1), C = () => J((k6) => k6 === V.length - 1 ? 0 : k6 + 1), K[21] = V, K[22] = C, K[23] = x;
    else C = K[22], x = K[23];
    let B;
    if (K[24] !== N || K[25] !== h || K[26] !== C || K[27] !== x) B = {
        "confirm:previous": x,
        "confirm:next": C,
        "confirm:yes": h,
        "confirm:no": N
    }, K[24] = N, K[25] = h, K[26] = C, K[27] = x, K[28] = B;
    else B = K[28];
    let m;
    if (K[29] === Symbol.for("react.memo_cache_sentinel")) m = {
        context: "Confirmation"
    }, K[29] = m;
    else m = K[29];
    L7(B, m);
    let S;
    if (K[30] !== V) S = (k6) => V.findIndex((T6) => T6.type === "server" && T6.server === k6), K[30] = V, K[31] = S;
    else S = K[31];
    let F = S,
        U;
    if (K[32] !== V) U = (k6) => V.findIndex((T6) => T6.type === "agent-server" && T6.agentServer === k6), K[32] = V, K[33] = U;
    else U = K[33];
    let g = U,
        c;
    if (K[34] === Symbol.for("react.memo_cache_sentinel")) c = MV(), K[34] = c;
    else c = K[34];
    let n = c,
        l;
    if (K[35] !== _) l = _.some(XIY), K[35] = _, K[36] = l;
    else l = K[36];
    let z6 = l;
    if (_.length === 0 && $.length === 0) return null;
    let A6;
    if (K[37] !== F || K[38] !== H || K[39] !== j) A6 = (k6) => {
        let T6 = F(k6),
            v6 = H === T6,
            L6, y6;
        if (k6.client.type === "disabled") L6 = d7("inactive", j)(e6.radioOff), y6 = "disabled";
        else if (k6.client.type === "connected") L6 = d7("success", j)(e6.tick), y6 = "connected";
        else if (k6.client.type === "pending") {
            L6 = d7("inactive", j)(e6.radioOff);
            let {
                reconnectAttempt: c6,
                maxReconnectAttempts: Z8
            } = k6.client;
            if (c6 && Z8) y6 = `reconnecting (${c6}/${Z8})…`;
            else y6 = "connecting…"
        } else if (k6.client.type === "needs-auth") L6 = d7("warning", j)(e6.triangleUpOutline), y6 = "needs authentication";
        else L6 = d7("error", j)(e6.cross), y6 = "failed";
        return B9.default.createElement(u, {
            key: `${k6.name}-${T6}`
        }, B9.default.createElement(T, {
            color: v6 ? "suggestion" : void 0
        }, v6 ? `${e6.pointer} ` : "  "), B9.default.createElement(T, {
            color: v6 ? "suggestion" : void 0
        }, k6.name), B9.default.createElement(T, {
            dimColor: !v6
        }, " · ", L6, " "), B9.default.createElement(T, {
            dimColor: !v6
        }, y6))
    }, K[37] = F, K[38] = H, K[39] = j, K[40] = A6;
    else A6 = K[40];
    let e = A6,
        i;
    if (K[41] !== g || K[42] !== H || K[43] !== j) i = (k6) => {
        let T6 = g(k6),
            v6 = H === T6,
            L6 = k6.needsAuth ? d7("warning", j)(e6.triangleUpOutline) : d7("inactive", j)(e6.radioOff),
            y6 = k6.needsAuth ? "may need auth" : "agent-only";
        return B9.default.createElement(u, {
            key: `agent-${k6.name}-${T6}`
        }, B9.default.createElement(T, {
            color: v6 ? "suggestion" : void 0
        }, v6 ? `${e6.pointer} ` : "  "), B9.default.createElement(T, {
            color: v6 ? "suggestion" : void 0
        }, k6.name), B9.default.createElement(T, {
            dimColor: !v6
        }, " · ", L6, " "), B9.default.createElement(T, {
            dimColor: !v6
        }, y6))
    }, K[41] = g, K[42] = H, K[43] = j, K[44] = i;
    else i = K[44];
    let O6 = i,
        J6 = _.length + $.length,
        $6;
    if (K[45] === Symbol.for("react.memo_cache_sentinel")) $6 = B9.default.createElement(Pi8, null), K[45] = $6;
    else $6 = K[45];
    let H6;
    if (K[46] !== J6) H6 = O7(J6, "server"), K[46] = J6, K[47] = H6;
    else H6 = K[47];
    let q6 = `${J6} ${H6}`,
        o;
    if (K[48] !== e || K[49] !== M) o = VpK.map((k6) => {
        let T6 = M.get(k6);
        if (!T6 || T6.length === 0) return null;
        let v6 = kpK(k6);
        return B9.default.createElement(u, {
            key: k6,
            flexDirection: "column",
            marginBottom: 1
        }, B9.default.createElement(u, {
            paddingLeft: 2
        }, B9.default.createElement(T, {
            bold: !0
        }, v6.label), v6.path && B9.default.createElement(T, {
            dimColor: !0
        }, " (", v6.path, ")")), T6.map((L6) => e(L6)))
    }), K[48] = e, K[49] = M, K[50] = o;
    else o = K[50];
    let _6;
    if (K[51] !== W || K[52] !== e) _6 = W.length > 0 && B9.default.createElement(u, {
        flexDirection: "column",
        marginBottom: 1
    }, B9.default.createElement(u, {
        paddingLeft: 2
    }, B9.default.createElement(T, {
        bold: !0
    }, "claude.ai")), W.map((k6) => e(k6))), K[51] = W, K[52] = e, K[53] = _6;
    else _6 = K[53];
    let r;
    if (K[54] !== $ || K[55] !== O6) r = $.length > 0 && B9.default.createElement(u, {
        flexDirection: "column",
        marginBottom: 1
    }, B9.default.createElement(u, {
        paddingLeft: 2
    }, B9.default.createElement(T, {
        bold: !0
    }, "Agent MCPs")), F4($.flatMap(JIY)).map((k6) => B9.default.createElement(u, {
        key: k6,
        flexDirection: "column",
        marginTop: 1
    }, B9.default.createElement(u, {
        paddingLeft: 2
    }, B9.default.createElement(T, {
        dimColor: !0
    }, "@", k6)), $.filter((T6) => T6.sourceAgents.includes(k6)).map((T6) => O6(T6))))), K[54] = $, K[55] = O6, K[56] = r;
    else r = K[56];
    let t;
    if (K[57] !== Z || K[58] !== e) t = Z.length > 0 && B9.default.createElement(u, {
        flexDirection: "column",
        marginBottom: 1
    }, B9.default.createElement(u, {
        paddingLeft: 2
    }, B9.default.createElement(T, {
        bold: !0
    }, f.label), f.path && B9.default.createElement(T, {
        dimColor: !0
    }, " (", f.path, ")")), Z.map((k6) => e(k6))), K[57] = Z, K[58] = e, K[59] = t;
    else t = K[59];
    let Y6;
    if (K[60] !== z6) Y6 = z6 && B9.default.createElement(T, {
        dimColor: !0
    }, n ? "※ Error logs shown inline with --debug" : "※ Run claude --debug to see error logs"), K[60] = z6, K[61] = Y6;
    else Y6 = K[61];
    let X6;
    if (K[62] === Symbol.for("react.memo_cache_sentinel")) X6 = B9.default.createElement(T, {
        dimColor: !0
    }, B9.default.createElement(yq, {
        url: "https://code.claude.com/docs/en/mcp"
    }, "https://code.claude.com/docs/en/mcp"), " ", "for help"), K[62] = X6;
    else X6 = K[62];
    let M6;
    if (K[63] !== Y6) M6 = B9.default.createElement(u, {
        flexDirection: "column"
    }, Y6, X6), K[63] = Y6, K[64] = M6;
    else M6 = K[64];
    let W6;
    if (K[65] !== o || K[66] !== _6 || K[67] !== r || K[68] !== t || K[69] !== M6) W6 = B9.default.createElement(u, {
        flexDirection: "column"
    }, o, _6, r, t, M6), K[65] = o, K[66] = _6, K[67] = r, K[68] = t, K[69] = M6, K[70] = W6;
    else W6 = K[70];
    let V6;
    if (K[71] !== N || K[72] !== q6 || K[73] !== W6) V6 = B9.default.createElement(R1, {
        title: "Manage MCP servers",
        subtitle: q6,
        onCancel: N,
        hideInputGuide: !0
    }, W6), K[71] = N, K[72] = q6, K[73] = W6, K[74] = V6;
    else V6 = K[74];
    let f6;
    if (K[75] === Symbol.for("react.memo_cache_sentinel")) f6 = B9.default.createElement(u, {
        paddingX: 1
    }, B9.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, B9.default.createElement(z1, null, B9.default.createElement(A8, {
        chord: ["up", "down"],
        format: {
            arrowSep: ""
        },
        action: "navigate"
    }), B9.default.createElement(A8, {
        chord: "enter",
        action: "confirm"
    }), B9.default.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    })))), K[75] = f6;
    else f6 = K[75];
    let G6;
    if (K[76] !== V6) G6 = B9.default.createElement(u, {
        flexDirection: "column"
    }, $6, V6, f6), K[76] = V6, K[77] = G6;
    else G6 = K[77];
    return G6
}
// @from(Ln 450407, Col 0)
function JIY(q) {
    return q.sourceAgents
}
// @from(Ln 450411, Col 0)
function XIY(q) {
    return q.client.type === "failed"
}
// @from(Ln 450415, Col 0)
function MIY(q, K) {
    return q.name.localeCompare(K.name)
}
// @from(Ln 450419, Col 0)
function PIY(q, K) {
    return q.name.localeCompare(K.name)
}
// @from(Ln 450423, Col 0)
function WIY(q) {
    return q.client.config.type === "claudeai-proxy"
}
// @from(Ln 450427, Col 0)
function DIY(q) {
    return q.client.config.type !== "claudeai-proxy"
}
// @from(Ln 450430, Col 4)
B9
// @from(Ln 450430, Col 8)
VpK
// @from(Ln 450431, Col 4)
iO7 = L(() => {
    o6();
    Qq();
    g6();
    C7();
    iD();
    K8();
    bK();
    Nq();
    S4();
    u7();
    hO7();
    B9 = K6(P6(), 1), VpK = ["project", "local", "user", "enterprise"]
})
// @from(Ln 450446, Col 0)
function ZIY(q, K) {
    return QC(q, Pl8(xN(K)))
}
// @from(Ln 450449, Col 4)
rO7
// @from(Ln 450450, Col 4)
NpK = L(() => {
    N86();
    Gz7();
    Xf6();
    rO7 = ZIY
})
// @from(Ln 450456, Col 4)
EpK = {}
// @from(Ln 450463, Col 0)
function ki8() {
    let q = u8("tengu_harbor_ledger", []),
        K = fIY().safeParse(q);
    return K.success ? K.data : []
}
// @from(Ln 450469, Col 0)
function mP6() {
    return u8("tengu_harbor", !1)
}
// @from(Ln 450473, Col 0)
function oO7(q) {
    if (!q) return !1;
    let {
        name: K,
        marketplace: _
    } = Z4(q);
    if (!_) return !1;
    return ki8().some((z) => z.plugin === K && z.marketplace === _)
}
// @from(Ln 450482, Col 4)
fIY
// @from(Ln 450483, Col 4)
__8 = L(() => {
    p7();
    aW();
    B1();
    fIY = C6(() => y.array(y.object({
        marketplace: y.string(),
        plugin: y.string()
    })))
})
// @from(Ln 450493, Col 0)
function Y_8(q, K, _) {
    let z = Object.entries(_ ?? {}).filter(([Y]) => GIY.test(Y)).map(([Y, A]) => ` ${Y}="${O_(A)}"`).join("");
    return `<${Tf6} source="${O_(q)}"${z}>
${K}
</${Tf6}>`
}
// @from(Ln 450500, Col 0)
function sO7(q, K) {
    if ((q === "team" || q === "enterprise") && K) return {
        entries: K,
        source: "org"
    };
    return {
        entries: ki8(),
        source: "ledger"
    }
}
// @from(Ln 450511, Col 0)
function BP6(q, K) {
    let _ = q.split(":");
    return K.find((z) => z.kind === "server" ? q === z.name : _[0] === "plugin" && _[1] === z.name)
}
// @from(Ln 450516, Col 0)
function A_8(q, K, _) {
    if (!K?.experimental?.["claude/channel"]) return {
        action: "skip",
        kind: "capability",
        reason: "server did not declare claude/channel capability"
    };
    if (!mP6()) return {
        action: "skip",
        kind: "disabled",
        reason: "channels feature is not currently available"
    };
    if (!o7()?.accessToken) return {
        action: "skip",
        kind: "auth",
        reason: "channels requires claude.ai authentication (run /login)"
    };
    let z = MK(),
        Y = z === "team" || z === "enterprise",
        A = Y ? E1("policySettings") : void 0;
    if (Y && A?.channelsEnabled !== !0) return {
        action: "skip",
        kind: "policy",
        reason: "channels not enabled by org policy (set channelsEnabled: true in managed settings)"
    };
    let O = BP6(q, qj());
    if (!O) return {
        action: "skip",
        kind: "session",
        reason: `server ${q} not in --channels list for this session`
    };
    if (O.kind === "plugin") {
        let w = _ ? Z4(_).marketplace : void 0;
        if (w !== O.marketplace) return {
            action: "skip",
            kind: "marketplace",
            reason: `you asked for plugin:${O.name}@${O.marketplace} but the installed ${O.name} plugin is from ${w??"an unknown source"}`
        };
        if (!O.dev) {
            let {
                entries: $,
                source: j
            } = sO7(z, A?.allowedChannelPlugins);
            if (!$.some((H) => H.plugin === O.name && H.marketplace === O.marketplace)) return {
                action: "skip",
                kind: "allowlist",
                reason: j === "org" ? `plugin ${O.name}@${O.marketplace} is not on your org's approved channels list (set allowedChannelPlugins in managed settings)` : `plugin ${O.name}@${O.marketplace} is not on the approved channels allowlist (use --dangerously-load-development-channels for local dev)`
            }
        }
    } else if (!O.dev) return {
        action: "skip",
        kind: "allowlist",
        reason: `server ${O.name} is not on the approved channels allowlist (use --dangerously-load-development-channels for local dev)`
    };
    return {
        action: "register"
    }
}
// @from(Ln 450573, Col 4)
z_8
// @from(Ln 450573, Col 9)
aO7 = "notifications/claude/channel/permission"
// @from(Ln 450574, Col 4)
ypK
// @from(Ln 450574, Col 9)
LpK = "notifications/claude/channel/permission_request"
// @from(Ln 450575, Col 4)
GIY
// @from(Ln 450576, Col 4)
O_8 = L(() => {
    p7();
    y8();
    rA();
    T7();
    aW();
    a1();
    __8();
    z_8 = C6(() => y.object({
        method: y.literal("notifications/claude/channel"),
        params: y.object({
            content: y.string(),
            meta: y.record(y.string(), y.string()).optional()
        })
    })), ypK = C6(() => y.object({
        method: y.literal(aO7),
        params: y.object({
            request_id: y.string(),
            behavior: y.enum(["allow", "deny"])
        })
    })), GIY = /^[a-zA-Z_][a-zA-Z0-9_]*$/
})
// @from(Ln 450599, Col 0)
function RpK() {
    return u8("tengu_harbor_permissions", !1)
}
// @from(Ln 450603, Col 0)
function hpK(q) {
    let K = 2166136261;
    for (let z = 0; z < q.length; z++) K ^= q.charCodeAt(z), K = Math.imul(K, 16777619);
    K = K >>> 0;
    let _ = "";
    for (let z = 0; z < 5; z++) _ += vIY[K % 25], K = Math.floor(K / 25);
    return _
}
// @from(Ln 450612, Col 0)
function SpK(q) {
    let K = hpK(q);
    for (let _ = 0; _ < 10; _++) {
        if (!TIY.some((z) => K.includes(z))) return K;
        K = hpK(`${q}:${_}`)
    }
    return K
}
// @from(Ln 450621, Col 0)
function CpK(q) {
    try {
        let K = I6(q);
        return K.length > 200 ? K.slice(0, 200) + "…" : K
    } catch {
        return "(unserializable)"
    }
}
// @from(Ln 450630, Col 0)
function bpK(q, K) {
    return q.filter((_) => _.type === "connected" && K(_.name) && _.capabilities?.experimental?.["claude/channel"] !== void 0 && _.capabilities?.experimental?.["claude/channel/permission"] !== void 0)
}
// @from(Ln 450634, Col 0)
function IpK() {
    let q = new Map;
    return {
        onResponse(K, _) {
            let z = K.toLowerCase();
            return q.set(z, _), () => {
                q.delete(z)
            }
        },
        resolve(K, _, z) {
            let Y = K.toLowerCase(),
                A = q.get(Y);
            if (!A) return !1;
            return q.delete(Y), A({
                behavior: _,
                fromServer: z
            }), !0
        }
    }
}
// @from(Ln 450654, Col 4)
vIY = "abcdefghijkmnopqrstuvwxyz"
// @from(Ln 450655, Col 4)
TIY
// @from(Ln 450656, Col 4)
tO7 = L(() => {
    e8();
    B1();
    TIY = ["fuck", "shit", "cunt", "cock", "dick", "twat", "piss", "crap", "bitch", "whore", "ass", "tit", "cum", "fag", "dyke", "nig", "kike", "rape", "nazi", "damn", "poo", "pee", "wank", "anus"]
})
// @from(Ln 450662, Col 0)
function xpK(q) {
    let K = "plugin" in q ? q.plugin : "no-plugin";
    return `${q.type}:${q.source}:${K}`
}
// @from(Ln 450667, Col 0)
function upK(q, K) {
    if (K.length === 0) return;
    q((_) => {
        let z = new Set(_.plugins.errors.map((A) => xpK(A))),
            Y = K.filter((A) => !z.has(xpK(A)));
        if (Y.length === 0) return _;
        return {
            ..._,
            plugins: {
                ..._.plugins,
                errors: [..._.plugins.errors, ...Y]
            }
        }
    })
}
// @from(Ln 450683, Col 0)
function mpK(q, K = !1) {
    let _ = H9(),
        z = M8((v) => v.authVersion),
        Y = M8((v) => v.mcp.pluginReconnectKey),
        A = R7(),
        O = wZ.useRef(new Map),
        w = wZ.useRef(new Set),
        $ = wZ.useRef(new Set),
        j = wZ.useRef(null);
    if (j.current === null) j.current = IpK();
    wZ.useEffect(() => {
        {
            let v = j.current;
            if (!v) return;
            if (!RpK()) return;
            return A((V) => {
                if (V.channelPermissionCallbacks === v) return V;
                return {
                    ...V,
                    channelPermissionCallbacks: v
                }
            }), () => {
                A((V) => {
                    if (V.channelPermissionCallbacks === void 0) return V;
                    return {
                        ...V,
                        channelPermissionCallbacks: void 0
                    }
                })
            }
        }
    }, [A]);
    let {
        addNotification: H
    } = EK(), J = 16, X = wZ.useRef([]), M = wZ.useRef(null), P = wZ.useCallback(() => {
        M.current = null;
        let v = X.current;
        if (v.length === 0) return;
        X.current = [], A((V) => {
            let k = V.mcp;
            for (let N of v) {
                let {
                    tools: R,
                    commands: h,
                    resources: C,
                    resourceTemplates: x,
                    ...B
                } = N, m = B.type === "disabled" || B.type === "failed" ? R ?? [] : R, S = B.type === "disabled" || B.type === "failed" ? h ?? [] : h, F = B.type === "disabled" || B.type === "failed" ? C ?? [] : C, U = B.type === "disabled" || B.type === "failed" ? x ?? [] : x, g = Zh(B.name), n = k.clients.findIndex((i) => i.name === B.name) === -1 ? [...k.clients, B] : k.clients.map((i) => i.name === B.name ? B : i), l = m === void 0 ? k.tools : [...PG(k.tools, (i) => i.name?.startsWith(g)), ...m], z6 = S === void 0 ? k.commands : [...PG(k.commands, (i) => hl(i, B.name)), ...S], A6 = F === void 0 ? k.resources : {
                    ...k.resources,
                    ...F.length > 0 ? {
                        [B.name]: F
                    } : gF(k.resources, B.name)
                }, e = U === void 0 ? k.resourceTemplates : U.length > 0 ? {
                    ...k.resourceTemplates,
                    [B.name]: U
                } : gF(k.resourceTemplates, B.name);
                k = {
                    ...k,
                    clients: n,
                    tools: l,
                    commands: z6,
                    resources: A6,
                    resourceTemplates: e
                }
            }
            return {
                ...V,
                mcp: k
            }
        })
    }, [A]), W = wZ.useCallback((v) => {
        if (X.current.push(v), M.current === null) M.current = setTimeout(P, J)
    }, [P]), D = wZ.useCallback(({
        client: v,
        tools: V,
        commands: k,
        resources: N,
        resourceTemplates: R
    }) => {
        switch (W({
                ...v,
                tools: V,
                commands: k,
                resources: N,
                resourceTemplates: R
            }), v.type) {
            case "connected": {
                BhK(v.client, v.name, A), v.client.onclose = () => {
                    let h = v.config.type ?? "stdio";
                    if (WG(v.name, v.config).catch(() => {
                            E(`Failed to invalidate the server cache: ${v.name}`)
                        }), ZT(v.name)) {
                        i8(v.name, "Server is disabled, skipping automatic reconnection");
                        return
                    }
                    if (h !== "stdio" && h !== "sdk") {
                        let C = EIY(h);
                        i8(v.name, `${C} transport closed/disconnected, attempting automatic reconnection`);
                        let x = O.current.get(v.name);
                        if (x) clearTimeout(x), O.current.delete(v.name);
                        (async () => {
                            for (let m = 1; m <= kx6; m++) {
                                if (ZT(v.name)) {
                                    i8(v.name, "Server disabled during reconnection, stopping retry"), O.current.delete(v.name);
                                    return
                                }
                                W({
                                    ...v,
                                    type: "pending",
                                    reconnectAttempt: m,
                                    maxReconnectAttempts: kx6
                                });
                                let S = Date.now();
                                try {
                                    let U = await _g(v.name, v.config),
                                        g = Date.now() - S;
                                    if (U.client.type === "connected") {
                                        i8(v.name, `${C} reconnection successful after ${g}ms (attempt ${m})`), O.current.delete(v.name), D(U);
                                        return
                                    }
                                    if (i8(v.name, `${C} reconnection attempt ${m} completed with status: ${U.client.type}`), m === kx6) {
                                        i8(v.name, `Max reconnection attempts (${kx6}) reached, giving up`), O.current.delete(v.name), D(U);
                                        return
                                    }
                                } catch (U) {
                                    let g = Date.now() - S;
                                    if (yz(v.name, `${C} reconnection attempt ${m} failed after ${g}ms: ${U}`), m === kx6) {
                                        i8(v.name, `Max reconnection attempts (${kx6}) reached, giving up`), O.current.delete(v.name), W({
                                            ...v,
                                            type: "failed"
                                        });
                                        return
                                    }
                                }
                                let F = Math.min(kIY * Math.pow(2, m - 1), NIY);
                                i8(v.name, `Scheduling reconnection attempt ${m+1} in ${F}ms`), await new Promise((U) => {
                                    let g = setTimeout(U, F);
                                    O.current.set(v.name, g)
                                })
                            }
                        })()
                    } else $.current.delete(v.name), W({
                        ...v,
                        type: "failed"
                    })
                };
                {
                    let h = A_8(v.name, v.capabilities, v.config.pluginSource),
                        C = BP6(v.name, qj()),
                        x = C?.kind === "plugin" ? `${C.name}@${C.marketplace}` : void 0,
                        B = !1,
                        m = () => {
                            if ($.current.add(v.name), v.client.setNotificationHandler(z_8(), async (S) => {
                                    let {
                                        content: F,
                                        meta: U
                                    } = S.params;
                                    i8(v.name, `notifications/claude/channel: ${F.slice(0,80)}`), d("tengu_mcp_channel_message", {
                                        content_length: F.length,
                                        meta_key_count: Object.keys(U ?? {}).length,
                                        entry_kind: C?.kind,
                                        is_dev: C?.dev ?? !1,
                                        plugin: x
                                    }), Dj({
                                        mode: "prompt",
                                        value: Y_8(v.name, F, U),
                                        priority: "next",
                                        isMeta: !0,
                                        origin: {
                                            kind: "channel",
                                            server: v.name
                                        },
                                        skipSlashCommands: !0
                                    })
                                }), v.capabilities?.experimental?.["claude/channel/permission"] !== void 0) v.client.setNotificationHandler(ypK(), async (S) => {
                                let {
                                    request_id: F,
                                    behavior: U
                                } = S.params, g = j.current?.resolve(F, U, v.name) ?? !1;
                                i8(v.name, `notifications/claude/channel/permission: ${F} → ${U} (${g?"matched pending":"no pending entry — stale or unknown ID"})`)
                            })
                        };
                    switch (h.action) {
                        case "register":
                            i8(v.name, "Channel notifications registered"), m(), B = !0;
                            break;
                        case "skip": {
                            let S = h.kind === "auth" || h.kind === "disabled" || h.kind === "capability",
                                F = $.current.has(v.name);
                            if (S) $.current.delete(v.name), v.client.removeNotificationHandler("notifications/claude/channel"), v.client.removeNotificationHandler(aO7);
                            else if (F) {
                                i8(v.name, `Channel gate says skip:${h.kind} but was previously registered — preserving handler`), m(), B = !0;
                                break
                            }
                            if (i8(v.name, `Channel notifications skipped: ${h.reason}`), h.kind !== "capability" && h.kind !== "session" && !w.current.has(h.kind) && (h.kind === "marketplace" || h.kind === "allowlist" || C !== void 0)) {
                                w.current.add(h.kind);
                                let U = h.kind === "disabled" ? "Channels are not currently available" : h.kind === "auth" ? "Channels require claude.ai authentication · run /login" : h.kind === "policy" ? "Channels are not enabled for your org · have an administrator set channelsEnabled: true in managed settings" : h.reason;
                                H({
                                    key: `channels-blocked-${h.kind}`,
                                    priority: "high",
                                    text: U,
                                    color: "warning",
                                    timeoutMs: 12000
                                })
                            }
                            break
                        }
                    }
                    if (B || h.action === "skip" && h.kind !== "capability") d("tengu_mcp_channel_gate", {
                        registered: B,
                        skip_kind: h.action === "skip" ? h.kind : void 0,
                        entry_kind: C?.kind,
                        is_dev: C?.dev ?? !1,
                        plugin: x
                    })
                }
                if (v.capabilities?.tools?.listChanged) v.client.setNotificationHandler(Ig6, async () => {
                    i8(v.name, "Received tools/list_changed notification, refreshing tools");
                    try {
                        let h = NS.cache.get(v.name);
                        NS.cache.delete(v.name);
                        let C = await NS(v),
                            x = C.length;
                        if (h) h.then((B) => {
                            d("tengu_mcp_list_changed", {
                                type: "tools",
                                previousCount: B.length,
                                newCount: x
                            })
                        }, () => {
                            d("tengu_mcp_list_changed", {
                                type: "tools",
                                newCount: x
                            })
                        });
                        else d("tengu_mcp_list_changed", {
                            type: "tools",
                            newCount: x
                        });
                        W({
                            ...v,
                            tools: C
                        })
                    } catch (h) {
                        yz(v.name, `Failed to refresh tools after list_changed notification: ${b6(h)}`)
                    }
                });
                if (v.capabilities?.prompts?.listChanged) v.client.setNotificationHandler(Cg6, async () => {
                    i8(v.name, "Received prompts/list_changed notification, refreshing prompts"), d("tengu_mcp_list_changed", {
                        type: "prompts"
                    });
                    try {
                        JP6.cache.delete(v.name);
                        let [h, C] = await Promise.all([JP6(v), Promise.resolve([])]);
                        W({
                            ...v,
                            commands: [...h, ...C]
                        }), VIY?.()
                    } catch (h) {
                        yz(v.name, `Failed to refresh prompts after list_changed notification: ${b6(h)}`)
                    }
                });
                if (v.capabilities?.resources?.listChanged) v.client.setNotificationHandler(Rg6, async () => {
                    i8(v.name, "Received resources/list_changed notification, refreshing resources"), d("tengu_mcp_list_changed", {
                        type: "resources"
                    });
                    try {
                        Es.cache.delete(v.name), HP6.cache.delete(v.name);
                        {
                            let [h, C] = await Promise.all([Es(v), HP6(v)]);
                            W({
                                ...v,
                                resources: h,
                                resourceTemplates: C
                            })
                        }
                    } catch (h) {
                        yz(v.name, `Failed to refresh resources after list_changed notification: ${b6(h)}`)
                    }
                });
                break
            }
            case "needs-auth":
            case "failed":
            case "pending":
            case "disabled":
                break
        }
    }, [W]), Z = I8();
    wZ.useEffect(() => {
        async function v() {
            let {
                servers: V,
                errors: k
            } = K ? {
                servers: {},
                errors: []
            } : await ZX6(q), N = {
                ...V,
                ...q
            };
            upK(A, k), A((R) => {
                let {
                    stale: h,
                    ...C
                } = P_K(R.mcp, N);
                for (let m of h) {
                    let S = O.current.get(m.name);
                    if (S) clearTimeout(S), O.current.delete(m.name);
                    if ($.current.delete(m.name), m.type === "connected") m.client.onclose = void 0, WG(m.name, m.config).catch(() => {})
                }
                let x = new Set(C.clients.map((m) => m.name)),
                    B = Object.entries(N).filter(([m]) => !x.has(m)).map(([m, S]) => ({
                        name: m,
                        type: ZT(m) ? "disabled" : "pending",
                        config: S
                    }));
                if (B.length === 0 && h.length === 0) return R;
                return {
                    ...R,
                    mcp: {
                        ...R.mcp,
                        ...C,
                        clients: [...C.clients, ...B]
                    }
                }
            })
        }
        v().catch((V) => {
            yz("useManageMCPConnections", `Failed to initialize servers as pending: ${b6(V)}`)
        })
    }, [K, q, A, Z, Y]), wZ.useEffect(() => {
        let v = !1;
        async function V() {
            let k;
            if (K || e36()) k = Promise.resolve({});
            else X_K(), k = DX6();
            let {
                servers: N,
                errors: R
            } = K ? {
                servers: {},
                errors: []
            } : await ZX6(q);
            if (v) return;
            upK(A, R);
            let h = {
                    ...N,
                    ...q
                },
                C = rO7(h, (F, U) => ZT(U));
            XP6(D, C).catch((F) => {
                yz("useManageMcpConnections", `Failed to get MCP resources: ${b6(F)}`)
            });
            let x = {};
            if (!K) {
                if (x = s36(await k).allowed, v) return;
                if (Object.keys(x).length > 0) {
                    let {
                        servers: F
                    } = Y48(x, h);
                    x = F
                }
                if (Object.keys(x).length > 0) {
                    A((U) => {
                        let g = new Set(U.mcp.clients.map((n) => n.name)),
                            c = Object.entries(x).filter(([n]) => !g.has(n)).map(([n, l]) => ({
                                name: n,
                                type: ZT(n) ? "disabled" : "pending",
                                config: l
                            }));
                        if (c.length === 0) return U;
                        return {
                            ...U,
                            mcp: {
                                ...U.mcp,
                                clients: [...U.mcp.clients, ...c]
                            }
                        }
                    });
                    let F = rO7(x, (U, g) => ZT(g));
                    XP6(D, F).catch((U) => {
                        yz("useManageMcpConnections", `Failed to get claude.ai MCP resources: ${b6(U)}`)
                    })
                }
            }
            let B = {
                    ...h,
                    ...x
                },
                m = {
                    enterprise: 0,
                    global: 0,
                    project: 0,
                    user: 0,
                    plugin: 0,
                    claudeai: 0
                },
                S = [];
            for (let [F, U] of Object.entries(B))
                if (U.scope === "enterprise") m.enterprise++;
                else if (U.scope === "user") m.global++;
            else if (U.scope === "project") m.project++;
            else if (U.scope === "local") m.user++;
            else if (U.scope === "dynamic") m.plugin++;
            else if (U.scope === "claudeai") m.claudeai++;
            d("tengu_mcp_servers", {
                ...m,
                ...!1
            })
        }
        return V(), () => {
            v = !0
        }
    }, [K, q, D, A, z, Z, Y]), wZ.useEffect(() => {
        let v = O.current;
        return () => {
            for (let V of v.values()) clearTimeout(V);
            if (v.clear(), M.current !== null) clearTimeout(M.current), M.current = null, P()
        }
    }, [P]);
    let G = wZ.useCallback(async (v) => {
            let V = _.getState().mcp.clients.find((R) => R.name === v);
            if (!V) throw Error(`MCP server ${v} not found`);
            let k = O.current.get(v);
            if (k) clearTimeout(k), O.current.delete(v);
            let N = await _g(v, V.config);
            return D(N), N
        }, [_, D]),
        f = wZ.useCallback(async (v) => {
            let V = _.getState().mcp.clients.find((N) => N.name === v);
            if (!V) throw Error(`MCP server ${v} not found`);
            if (V.type !== "disabled") {
                let N = O.current.get(v);
                if (N) clearTimeout(N), O.current.delete(v);
                if (YC6(v, !1), $.current.delete(v), V.type === "connected") await WG(v, V.config);
                W({
                    name: v,
                    type: "disabled",
                    config: V.config
                })
            } else {
                YC6(v, !0), W({
                    name: v,
                    type: "pending",
                    config: V.config
                });
                let N = await _g(v, V.config);
                D(N)
            }
        }, [_, W, D]);
    return {
        reconnectMcpServer: G,
        toggleMcpServer: f
    }
}
// @from(Ln 451140, Col 0)
function EIY(q) {
    switch (q) {
        case "http":
            return "HTTP";
        case "ws":
        case "ws-ide":
            return "WebSocket";
        default:
            return "SSE"
    }
}
// @from(Ln 451151, Col 4)
wZ
// @from(Ln 451151, Col 8)
VIY = null
// @from(Ln 451152, Col 4)
kx6 = 5
// @from(Ln 451153, Col 4)
kIY = 1000
// @from(Ln 451154, Col 4)
NIY = 30000
// @from(Ln 451155, Col 4)
BpK = L(() => {
    y8();
    oW();
    _P();
    jU8();
    NpK();
    Wl8();
    C8();
    rD();
    K8();
    y8();
    kY();
    N7();
    m8();
    U8();
    b$();
    O_8();
    tO7();
    tS6();
    dl8();
    fh();
    iD();
    wZ = K6(P6(), 1)
})
// @from(Ln 451180, Col 0)
function Nx6() {
    let q = pP6.useContext(eO7);
    if (!q) throw Error("useMcpReconnect must be used within MCPConnectionManager");
    return q.reconnectMcpServer
}
// @from(Ln 451186, Col 0)
function m_6() {
    let q = pP6.useContext(eO7);
    if (!q) throw Error("useMcpToggleEnabled must be used within MCPConnectionManager");
    return q.toggleMcpServer
}
// @from(Ln 451192, Col 0)
function Ni8(q) {
    let K = s(6),
        {
            children: _,
            dynamicMcpConfig: z,
            isStrictMcpConfig: Y
        } = q,
        {
            reconnectMcpServer: A,
            toggleMcpServer: O
        } = mpK(z, Y),
        w;
    if (K[0] !== A || K[1] !== O) w = {
        reconnectMcpServer: A,
        toggleMcpServer: O
    }, K[0] = A, K[1] = O, K[2] = w;
    else w = K[2];
    let $ = w,
        j;
    if (K[3] !== _ || K[4] !== $) j = pP6.default.createElement(eO7.Provider, {
        value: $
    }, _), K[3] = _, K[4] = $, K[5] = j;
    else j = K[5];
    return j
}
// @from(Ln 451217, Col 4)
pP6
// @from(Ln 451217, Col 9)
eO7
// @from(Ln 451218, Col 4)
B_6 = L(() => {
    o6();
    BpK();
    pP6 = K6(P6(), 1), eO7 = pP6.createContext(null)
})
// @from(Ln 451224, Col 0)
function qw7(q) {
    let K = s(25),
        {
            serverName: _,
            onComplete: z
        } = q,
        [Y] = Zq(),
        A = H9(),
        O = Nx6(),
        [w, $] = GG.useState(!0),
        [j, H] = GG.useState(null),
        J, X;
    if (K[0] !== z || K[1] !== O || K[2] !== _ || K[3] !== A) J = () => {
        (async function() {
            try {
                if (!A.getState().mcp.clients.find((Z) => Z.name === _)) {
                    H(`MCP server "${_}" not found`), $(!1), z(`MCP server "${_}" not found`);
                    return
                }
                let D = await O(_);
                q: switch (D.client.type) {
                    case "connected": {
                        $(!1), z(`Successfully reconnected to ${_}`);
                        break q
                    }
                    case "needs-auth": {
                        H(`${_} requires authentication`), $(!1), z(`${_} requires authentication. Use /mcp to authenticate.`);
                        break q
                    }
                    case "pending":
                    case "failed":
                    case "disabled":
                        H(`Failed to reconnect to ${_}`), $(!1), z(`Failed to reconnect to ${_}`)
                }
            } catch (W) {
                let D = W,
                    Z = D instanceof Error ? D.message : String(D);
                H(Z), $(!1), z(`Error: ${Z}`)
            }
        })()
    }, X = [_, O, A, z], K[0] = z, K[1] = O, K[2] = _, K[3] = A, K[4] = J, K[5] = X;
    else J = K[4], X = K[5];
    if (GG.useEffect(J, X), w) {
        let M;
        if (K[6] !== _) M = GG.default.createElement(T, {
            color: "text"
        }, "Reconnecting to ", GG.default.createElement(T, {
            bold: !0
        }, _)), K[6] = _, K[7] = M;
        else M = K[7];
        let P;
        if (K[8] === Symbol.for("react.memo_cache_sentinel")) P = GG.default.createElement(u, null, GG.default.createElement(Y5, null), GG.default.createElement(T, null, " Establishing connection to MCP server")), K[8] = P;
        else P = K[8];
        let W;
        if (K[9] !== M) W = GG.default.createElement(u, {
            flexDirection: "column",
            gap: 1,
            padding: 1
        }, M, P), K[9] = M, K[10] = W;
        else W = K[10];
        return W
    }
    if (j) {
        let M;
        if (K[11] !== Y) M = d7("error", Y)(e6.cross), K[11] = Y, K[12] = M;
        else M = K[12];
        let P;
        if (K[13] !== M) P = GG.default.createElement(T, null, M, " "), K[13] = M, K[14] = P;
        else P = K[14];
        let W;
        if (K[15] !== _) W = GG.default.createElement(T, {
            color: "error"
        }, "Failed to reconnect to ", _), K[15] = _, K[16] = W;
        else W = K[16];
        let D;
        if (K[17] !== P || K[18] !== W) D = GG.default.createElement(u, null, P, W), K[17] = P, K[18] = W, K[19] = D;
        else D = K[19];
        let Z;
        if (K[20] !== j) Z = GG.default.createElement(T, {
            dimColor: !0
        }, "Error: ", j), K[20] = j, K[21] = Z;
        else Z = K[21];
        let G;
        if (K[22] !== D || K[23] !== Z) G = GG.default.createElement(u, {
            flexDirection: "column",
            gap: 1,
            padding: 1
        }, D, Z), K[22] = D, K[23] = Z, K[24] = G;
        else G = K[24];
        return G
    }
    return null
}
// @from(Ln 451317, Col 4)
GG
// @from(Ln 451318, Col 4)
Kw7 = L(() => {
    o6();
    Qq();
    g6();
    B_6();
    N7();
    Ej();
    GG = K6(P6(), 1)
})
// @from(Ln 451328, Col 0)
function Ei8(q) {
    let K = s(9),
        {
            serverToolsCount: _,
            serverPromptsCount: z,
            serverResourcesCount: Y
        } = q,
        A;
    if (K[0] !== z || K[1] !== Y || K[2] !== _) {
        if (A = [], _ > 0) A.push("tools");
        if (Y > 0) A.push("resources");
        if (z > 0) A.push("prompts");
        K[0] = z, K[1] = Y, K[2] = _, K[3] = A
    } else A = K[3];
    let O;
    if (K[4] === Symbol.for("react.memo_cache_sentinel")) O = w_8.default.createElement(T, {
        bold: !0
    }, "Capabilities: "), K[4] = O;
    else O = K[4];
    let w;
    if (K[5] !== A) w = A.length > 0 ? w_8.default.createElement(z1, null, A) : "none", K[5] = A, K[6] = w;
    else w = K[6];
    let $;
    if (K[7] !== w) $ = w_8.default.createElement(u, null, O, w_8.default.createElement(T, {
        color: "text"
    }, w)), K[7] = w, K[8] = $;
    else $ = K[8];
    return $
}
// @from(Ln 451357, Col 4)
w_8
// @from(Ln 451358, Col 4)
_w7 = L(() => {
    o6();
    g6();
    Nq();
    w_8 = K6(P6(), 1)
})
// @from(Ln 451365, Col 0)
function yi8(q, K, _) {
    switch (q.client.type) {
        case "connected":
            return {
                message: `Reconnected to ${K}.`, success: !0
            };
        case "needs-auth":
            return {
                message: _?.hasHeadersHelper ? `${K} requires authentication. Check that the headersHelper script returns valid credentials, then use the 'Reconnect' option.` : `${K} requires authentication. Use the 'Authenticate' option.`, success: !1
            };
        case "failed":
            return {
                message: `Failed to reconnect to ${K}.`, success: !1
            };
        default:
            return {
                message: `Unknown result when reconnecting to ${K}.`, success: !1
            }
    }
}
// @from(Ln 451386, Col 0)
function $_8(q, K) {
    let _ = q instanceof Error ? q.message : String(q);
    return `Error reconnecting to ${K}: ${_}`
}
// @from(Ln 451391, Col 0)
function FP6({
    server: q,
    serverToolsCount: K,
    onViewTools: _,
    onCancel: z,
    onComplete: Y,
    borderless: A = !1
}) {
    let [O] = Zq(), w = $3(), {
        columns: $
    } = s1(), [j, H] = H7.default.useState(!1), [J, X] = H7.default.useState(null), M = M8((f6) => f6.mcp), P = R7(), [W, D] = H7.default.useState(null), [Z, G] = H7.useState(!1), f = H7.useRef(null), [v, V] = H7.useState(!1), [k, N] = H7.useState(null), [R, h] = H7.useState(!1), [C, x] = H7.useState(null), [B, m] = H7.useState(!1), [S, F] = H7.useState(!1), U = H7.useRef(void 0), g = H7.useRef(!1), [c, n] = H7.useState(""), [l, z6] = H7.useState(0), [A6, e] = H7.useState(null);
    H7.useEffect(() => () => {
        if (g.current = !0, f.current?.abort(), U.current !== void 0) clearTimeout(U.current)
    }, []);
    let i = q.isAuthenticated || q.client.type === "connected" && K > 0,
        O6 = Nx6(),
        J6 = H7.default.useCallback(async () => {
            V(!1), N(null), G(!0);
            try {
                let f6 = await O6(q.name),
                    G6 = f6.client.type === "connected";
                if (d("tengu_claudeai_mcp_auth_completed", {
                        success: G6
                    }), G6) Y?.(`Authentication successful. Connected to ${q.name}.`);
                else if (f6.client.type === "needs-auth") Y?.("Authentication successful, but server still requires authentication. You may need to manually restart Claude Code.");
                else Y?.("Authentication successful, but server reconnection failed. You may need to manually restart Claude Code for the changes to take effect.")
            } catch (f6) {
                d("tengu_claudeai_mcp_auth_completed", {
                    success: !1
                }), Y?.($_8(f6, q.name))
            } finally {
                G(!1)
            }
        }, [O6, q.name, Y]),
        $6 = H7.default.useCallback(async () => {
            await WG(q.name, {
                ...q.config,
                scope: q.scope
            }), P((f6) => {
                let G6 = f6.mcp.clients.map((L6) => L6.name === q.name ? {
                        ...L6,
                        type: "needs-auth"
                    } : L6),
                    k6 = bp8(f6.mcp.tools, q.name),
                    T6 = eS6(f6.mcp.commands, q.name),
                    v6 = qC6(f6.mcp.resources, q.name);
                return {
                    ...f6,
                    mcp: {
                        ...f6.mcp,
                        clients: G6,
                        tools: k6,
                        commands: T6,
                        resources: v6
                    }
                }
            }), d("tengu_claudeai_mcp_clear_auth_completed", {}), Y?.(`Disconnected from ${q.name}.`), h(!1), x(null), m(!1)
        }, [q.name, q.config, q.scope, P, Y]);
    G1("confirm:no", () => {
        f.current?.abort(), f.current = null, H(!1), D(null)
    }, {
        context: "Confirmation",
        isActive: j
    }), G1("confirm:no", () => {
        V(!1), N(null)
    }, {
        context: "Confirmation",
        isActive: v
    }), G1("confirm:no", () => {
        h(!1), x(null), m(!1)
    }, {
        context: "Confirmation",
        isActive: R
    });

    function H6(f6) {
        if (f6.key === "return" && v) f6.preventDefault(), J6();
        if (f6.key === "return" && R)
            if (f6.preventDefault(), B) $6();
            else {
                let G6 = `${r7().CLAUDE_AI_ORIGIN}/settings/connectors`;
                x(G6), m(!0), J3(G6)
            } if (f6.key === "c" && !f6.ctrl && !f6.meta && !S) {
            let G6 = W || k || C;
            if (G6) f6.preventDefault(), hP(G6).then((k6) => {
                if (g.current) return;
                if (k6) process.stdout.write(k6);
                if (F(!0), U.current !== void 0) clearTimeout(U.current);
                U.current = setTimeout(F, 2000, !1)
            })
        }
    }
    let q6 = zv(String(q.name)),
        o = Cp8(M.commands, q.name).length,
        _6 = m_6(),
        r = H7.default.useCallback(async () => {
            let f6 = r7().CLAUDE_AI_ORIGIN,
                k6 = k_()?.organizationUuid,
                T6;
            if (k6 && q.config.type === "claudeai-proxy" && q.config.id) {
                let v6 = q.config.id.startsWith("mcprs") ? "mcpsrv" + q.config.id.slice(5) : q.config.id,
                    L6 = encodeURIComponent(process.env.CLAUDE_CODE_ENTRYPOINT || "cli");
                T6 = `${f6}/api/organizations/${k6}/mcp/start-auth/${v6}?product_surface=${L6}`
            } else T6 = `${f6}/settings/connectors`;
            N(T6), V(!0), d("tengu_claudeai_mcp_auth_started", {}), await J3(T6)
        }, [q.config]),
        t = H7.default.useCallback(() => {
            h(!0), d("tengu_claudeai_mcp_clear_auth_started", {})
        }, []),
        Y6 = H7.default.useCallback(async () => {
            let f6 = q.client.type !== "disabled";
            try {
                if (await _6(q.name), q.config.type === "claudeai-proxy") d("tengu_claudeai_mcp_toggle", {
                    new_state: f6 ? "disabled" : "enabled"
                });
                z()
            } catch (G6) {
                Y?.(`Failed to ${f6?"disable":"enable"} MCP server '${q.name}': ${b6(G6)}`)
            }
        }, [q.client.type, q.config.type, q.name, _6, z, Y]),
        X6 = H7.default.useCallback(async () => {
            if (q.config.type === "claudeai-proxy") return;
            H(!0), X(null);
            let f6 = new AbortController;
            f.current = f6;
            try {
                if (q.isAuthenticated && q.config) await q98(q.name, q.config, {
                    preserveStepUpState: !0
                });
                if (q.config) {
                    await T_6(q.name, q.config, D, f6.signal, {
                        onWaitingForCallback: (k6) => {
                            e(() => k6)
                        }
                    }), d("tengu_mcp_auth_config_authenticate", {
                        wasAuthenticated: q.isAuthenticated
                    });
                    let G6 = await O6(q.name);
                    if (G6.client.type === "connected") {
                        let k6 = i ? `Authentication successful. Reconnected to ${q.name}.` : `Authentication successful. Connected to ${q.name}.`;
                        Y?.(k6)
                    } else if (G6.client.type === "needs-auth") Y?.("Authentication successful, but server still requires authentication. You may need to manually restart Claude Code.");
                    else i8(q.name, "Reconnection failed after authentication"), Y?.("Authentication successful, but server reconnection failed. You may need to manually restart Claude Code for the changes to take effect.")
                }
            } catch (G6) {
                if (G6 instanceof Error && !(G6 instanceof Xu)) X(G6.message)
            } finally {
                H(!1), f.current = null, e(null), n("")
            }
        }, [q.isAuthenticated, q.config, q.name, Y, O6, i]),
        M6 = async () => {
            if (q.config.type === "claudeai-proxy") return;
            if (q.config) await q98(q.name, q.config), d("tengu_mcp_auth_config_clear", {}), await WG(q.name, {
                ...q.config,
                scope: q.scope
            }), P((f6) => {
                let G6 = f6.mcp.clients.map((L6) => L6.name === q.name ? {
                        ...L6,
                        type: "failed"
                    } : L6),
                    k6 = bp8(f6.mcp.tools, q.name),
                    T6 = eS6(f6.mcp.commands, q.name),
                    v6 = qC6(f6.mcp.resources, q.name);
                return {
                    ...f6,
                    mcp: {
                        ...f6.mcp,
                        clients: G6,
                        tools: k6,
                        commands: T6,
                        resources: v6
                    }
                }
            }), Y?.(`Authentication cleared for ${q.name}.`)
        };
    if (j) {
        let f6 = q.config.type !== "claudeai-proxy" && q.config.oauth?.xaa ? " Authenticating via your identity provider" : " A browser window will open for authentication";
        return H7.default.createElement(u, {
            flexDirection: "column",
            gap: 1,
            padding: 1,
            tabIndex: 0,
            autoFocus: !0,
            onKeyDown: H6
        }, H7.default.createElement(T, {
            color: "claude"
        }, "Authenticating with ", q.name, "…"), H7.default.createElement(u, null, H7.default.createElement(Y5, null), H7.default.createElement(T, null, f6)), W && H7.default.createElement(u, {
            flexDirection: "column"
        }, H7.default.createElement(u, null, H7.default.createElement(T, {
            dimColor: !0
        }, "If your browser doesn't open automatically, copy this URL manually", " "), S ? H7.default.createElement(T, {
            color: "success"
        }, "(Copied!)") : H7.default.createElement(T, {
            dimColor: !0
        }, H7.default.createElement(A8, {
            chord: "c",
            action: "copy",
            parens: !0
        }))), H7.default.createElement(yq, {
            url: W
        })), j && W && A6 && H7.default.createElement(u, {
            flexDirection: "column",
            marginTop: 1
        }, H7.default.createElement(T, {
            dimColor: !0
        }, "If the redirect page shows a connection error, paste the URL from your browser's address bar:"), H7.default.createElement(u, null, H7.default.createElement(T, {
            dimColor: !0
        }, "URL ", ">", " "), H7.default.createElement(l4, {
            value: c,
            onChange: n,
            onSubmit: (G6) => {
                A6(G6.trim()), n("")
            },
            cursorOffset: l,
            onChangeCursorOffset: z6,
            columns: $ - 8
        }))), H7.default.createElement(u, {
            marginLeft: 3
        }, H7.default.createElement(T, {
            dimColor: !0
        }, "Return here after authenticating in your browser. Press", " ", H7.default.createElement(A8, {
            chord: "escape",
            action: "go back"
        }), ".")))
    }
    if (v) return H7.default.createElement(u, {
        flexDirection: "column",
        gap: 1,
        padding: 1,
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: H6
    }, H7.default.createElement(T, {
        color: "claude"
    }, "Authenticating with ", q.name, "…"), H7.default.createElement(u, null, H7.default.createElement(Y5, null), H7.default.createElement(T, null, " A browser window will open for authentication")), k && H7.default.createElement(u, {
        flexDirection: "column"
    }, H7.default.createElement(u, null, H7.default.createElement(T, {
        dimColor: !0
    }, "If your browser doesn't open automatically, copy this URL manually", " "), S ? H7.default.createElement(T, {
        color: "success"
    }, "(Copied!)") : H7.default.createElement(T, {
        dimColor: !0
    }, H7.default.createElement(A8, {
        chord: "c",
        action: "copy",
        parens: !0
    }))), H7.default.createElement(yq, {
        url: k
    })), H7.default.createElement(u, {
        marginLeft: 3,
        flexDirection: "column"
    }, H7.default.createElement(T, {
        color: "permission"
    }, "Press ", H7.default.createElement(T, {
        bold: !0
    }, "Enter"), " after authenticating in your browser."), H7.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, H7.default.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "back"
    }))));
    if (R) return H7.default.createElement(u, {
        flexDirection: "column",
        gap: 1,
        padding: 1,
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: H6
    }, H7.default.createElement(T, {
        color: "claude"
    }, "Clear authentication for ", q.name), B ? H7.default.createElement(H7.default.Fragment, null, H7.default.createElement(T, null, 'Find the MCP server in the browser and click "Disconnect".'), C && H7.default.createElement(u, {
        flexDirection: "column"
    }, H7.default.createElement(u, null, H7.default.createElement(T, {
        dimColor: !0
    }, "If your browser didn't open automatically, copy this URL manually", " "), S ? H7.default.createElement(T, {
        color: "success"
    }, "(Copied!)") : H7.default.createElement(T, {
        dimColor: !0
    }, H7.default.createElement(A8, {
        chord: "c",
        action: "copy",
        parens: !0
    }))), H7.default.createElement(yq, {
        url: C
    })), H7.default.createElement(u, {
        marginLeft: 3,
        flexDirection: "column"
    }, H7.default.createElement(T, {
        color: "permission"
    }, "Press ", H7.default.createElement(T, {
        bold: !0
    }, "Enter"), " when done."), H7.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, H7.default.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "back"
    })))) : H7.default.createElement(H7.default.Fragment, null, H7.default.createElement(T, null, 'This will open claude.ai in the browser. Find the MCP server in the list and click "Disconnect".'), H7.default.createElement(u, {
        marginLeft: 3,
        flexDirection: "column"
    }, H7.default.createElement(T, {
        color: "permission"
    }, "Press", " ", H7.default.createElement(A8, {
        chord: "enter",
        action: "open the browser",
        bold: !0
    }), "."), H7.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, H7.default.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "back"
    })))));
    if (Z) return H7.default.createElement(u, {
        flexDirection: "column",
        gap: 1,
        padding: 1
    }, H7.default.createElement(T, {
        color: "text"
    }, "Connecting to ", H7.default.createElement(T, {
        bold: !0
    }, q.name), "…"), H7.default.createElement(u, null, H7.default.createElement(Y5, null), H7.default.createElement(T, null, " Establishing connection to MCP server")), H7.default.createElement(T, {
        dimColor: !0
    }, "This may take a few moments."));
    let W6 = [];
    if (q.client.type === "disabled") W6.push({
        label: "Enable",
        value: "toggle-enabled"
    });
    if (q.client.type === "connected" && K > 0) W6.push({
        label: "View tools",
        value: "tools"
    });
    if (q.config.type === "claudeai-proxy") {
        if (q.client.type === "connected") W6.push({
            label: "Clear authentication",
            value: "claudeai-clear-auth"
        });
        else if (q.client.type !== "disabled") W6.push({
            label: "Authenticate",
            value: "claudeai-auth"
        })
    } else if (!q.config.headersHelper) {
        if (i) W6.push({
            label: "Re-authenticate",
            value: "reauth"
        }), W6.push({
            label: "Clear authentication",
            value: "clear-auth"
        });
        if (!i) W6.push({
            label: "Authenticate",
            value: "auth"
        })
    }
    let V6 = q.config.type !== "claudeai-proxy" && !!q.config.headersHelper;
    if (q.client.type !== "disabled") {
        if (q.client.type !== "needs-auth" || V6) W6.push({
            label: "Reconnect",
            value: "reconnectMcpServer"
        });
        W6.push({
            label: "Disable",
            value: "toggle-enabled"
        })
    }
    if (W6.length === 0) W6.push({
        label: "Back",
        value: "back"
    });
    return H7.default.createElement(u, {
        flexDirection: "column"
    }, H7.default.createElement(u, {
        flexDirection: "column",
        paddingX: 1,
        borderStyle: A ? void 0 : "round"
    }, H7.default.createElement(u, {
        marginBottom: 1
    }, H7.default.createElement(T, {
        bold: !0
    }, q6, " MCP Server")), H7.default.createElement(u, {
        flexDirection: "column",
        gap: 0
    }, H7.default.createElement(u, null, H7.default.createElement(T, {
        bold: !0
    }, "Status: "), q.client.type === "disabled" ? H7.default.createElement(T, null, d7("inactive", O)(e6.radioOff), " disabled") : q.client.type === "connected" ? H7.default.createElement(T, null, d7("success", O)(e6.tick), " connected") : q.client.type === "pending" ? H7.default.createElement(H7.default.Fragment, null, H7.default.createElement(T, {
        dimColor: !0
    }, e6.radioOff), H7.default.createElement(T, null, " connecting…")) : q.client.type === "needs-auth" ? H7.default.createElement(T, null, d7("warning", O)(e6.triangleUpOutline), " needs authentication") : H7.default.createElement(T, null, d7("error", O)(e6.cross), " failed")), q.transport !== "claudeai-proxy" && H7.default.createElement(u, null, H7.default.createElement(T, {
        bold: !0
    }, "Auth: "), i ? H7.default.createElement(T, null, d7("success", O)(e6.tick), " authenticated") : H7.default.createElement(T, null, d7("error", O)(e6.cross), " not authenticated")), H7.default.createElement(u, null, H7.default.createElement(T, {
        bold: !0
    }, "URL: "), H7.default.createElement(T, {
        dimColor: !0
    }, q.config.url)), H7.default.createElement(u, null, H7.default.createElement(T, {
        bold: !0
    }, "Config location: "), H7.default.createElement(T, {
        dimColor: !0
    }, rk(q.scope))), q.client.type === "connected" && H7.default.createElement(Ei8, {
        serverToolsCount: K,
        serverPromptsCount: o,
        serverResourcesCount: M.resources[q.name]?.length || 0
    }), q.client.type === "connected" && K > 0 && H7.default.createElement(u, null, H7.default.createElement(T, {
        bold: !0
    }, "Tools: "), H7.default.createElement(T, {
        dimColor: !0
    }, K, " tools"))), J && H7.default.createElement(u, {
        marginTop: 1
    }, H7.default.createElement(T, {
        color: "error"
    }, "Error: ", J)), W6.length > 0 && H7.default.createElement(u, {
        marginTop: 1
    }, H7.default.createElement(A1, {
        options: W6,
        onChange: async (f6) => {
            switch (f6) {
                case "tools":
                    _();
                    break;
                case "auth":
                case "reauth":
                    await X6();
                    break;
                case "clear-auth":
                    await M6();
                    break;
                case "claudeai-auth":
                    await r();
                    break;
                case "claudeai-clear-auth":
                    t();
                    break;
                case "reconnectMcpServer":
                    G(!0);
                    try {
                        let G6 = await O6(q.name);
                        if (q.config.type === "claudeai-proxy") d("tengu_claudeai_mcp_reconnect", {
                            success: G6.client.type === "connected"
                        });
                        let {
                            message: k6
                        } = yi8(G6, q.name, {
                            hasHeadersHelper: V6
                        });
                        Y?.(k6)
                    } catch (G6) {
                        if (q.config.type === "claudeai-proxy") d("tengu_claudeai_mcp_reconnect", {
                            success: !1
                        });
                        Y?.($_8(G6, q.name))
                    } finally {
                        G(!1)
                    }
                    break;
                case "toggle-enabled":
                    await Y6();
                    break;
                case "back":
                    z();
                    break
            }
        },
        onCancel: z
    }))), H7.default.createElement(u, {
        marginTop: 1
    }, H7.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, w.pending ? H7.default.createElement(H7.default.Fragment, null, "Press ", w.keyName, " again to exit") : H7.default.createElement(z1, null, H7.default.createElement(A8, {
        chord: ["up", "down"],
        format: {
            arrowSep: ""
        },
        action: "navigate"
    }), H7.default.createElement(A8, {
        chord: "enter",
        action: "select"
    }), H7.default.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "back"
    })))))
}
// @from(Ln 451881, Col 4)
H7
// @from(Ln 451882, Col 4)
Li8 = L(() => {
    Qq();
    C8();
    z3();
    C$();
    I4();
    HX();
    g6();
    C7();
    me();
    oW();
    B_6();
    iD();
    N7();
    T7();
    Nj();
    m8();
    U8();
    bK();
    g_();
    Nq();
    u7();
    Ej();
    NY();
    _w7();
    H7 = K6(P6(), 1)
})
// @from(Ln 451910, Col 0)
function j_8({
    server: q,
    serverToolsCount: K,
    onViewTools: _,
    onCancel: z,
    onComplete: Y,
    borderless: A = !1
}) {
    let [O] = Zq(), w = $3(), $ = M8((Z) => Z.mcp), j = Nx6(), H = m_6(), [J, X] = M3.useState(!1), M = M3.default.useCallback(async () => {
        let Z = q.client.type !== "disabled";
        try {
            await H(q.name), z()
        } catch (G) {
            Y(`Failed to ${Z?"disable":"enable"} MCP server '${q.name}': ${b6(G)}`)
        }
    }, [q.client.type, q.name, H, z, Y]), P = zv(String(q.name)), W = Cp8($.commands, q.name).length, D = [];
    if (q.client.type !== "disabled" && K > 0) D.push({
        label: "View tools",
        value: "tools"
    });
    if (q.client.type !== "disabled") D.push({
        label: "Reconnect",
        value: "reconnectMcpServer"
    });
    if (D.push({
            label: q.client.type !== "disabled" ? "Disable" : "Enable",
            value: "toggle-enabled"
        }), D.length === 0) D.push({
        label: "Back",
        value: "back"
    });
    if (J) return M3.default.createElement(u, {
        flexDirection: "column",
        gap: 1,
        padding: 1
    }, M3.default.createElement(T, {
        color: "text"
    }, "Reconnecting to ", M3.default.createElement(T, {
        bold: !0
    }, q.name)), M3.default.createElement(u, null, M3.default.createElement(Y5, null), M3.default.createElement(T, null, " Restarting MCP server process")), M3.default.createElement(T, {
        dimColor: !0
    }, "This may take a few moments."));
    return M3.default.createElement(u, {
        flexDirection: "column"
    }, M3.default.createElement(u, {
        flexDirection: "column",
        paddingX: 1,
        borderStyle: A ? void 0 : "round"
    }, M3.default.createElement(u, {
        marginBottom: 1
    }, M3.default.createElement(T, {
        bold: !0
    }, P, " MCP Server")), M3.default.createElement(u, {
        flexDirection: "column",
        gap: 0
    }, M3.default.createElement(Wn, {
        box: "plain",
        columns: [{
            bold: !0
        }, {}]
    }, M3.default.createElement(Wn.Row, null, M3.default.createElement(M3.default.Fragment, null, "Status:"), q.client.type === "disabled" ? M3.default.createElement(T, null, d7("inactive", O)(e6.radioOff), " disabled") : q.client.type === "connected" ? M3.default.createElement(T, null, d7("success", O)(e6.tick), " connected") : q.client.type === "pending" ? M3.default.createElement(T, null, M3.default.createElement(T, {
        dimColor: !0
    }, e6.radioOff), " connecting…") : M3.default.createElement(T, null, d7("error", O)(e6.cross), " failed")), M3.default.createElement(Wn.Row, null, M3.default.createElement(M3.default.Fragment, null, "Command:"), M3.default.createElement(T, {
        dimColor: !0
    }, q.config.command)), q.config.args && q.config.args.length > 0 && M3.default.createElement(Wn.Row, null, M3.default.createElement(M3.default.Fragment, null, "Args:"), M3.default.createElement(T, {
        dimColor: !0
    }, q.config.args.join(" "))), M3.default.createElement(Wn.Row, null, M3.default.createElement(M3.default.Fragment, null, "Config location:"), M3.default.createElement(T, {
        dimColor: !0
    }, rk(my(q.name)?.scope ?? "dynamic")))), q.client.type === "connected" && M3.default.createElement(Ei8, {
        serverToolsCount: K,
        serverPromptsCount: W,
        serverResourcesCount: $.resources[q.name]?.length || 0
    }), q.client.type === "connected" && K > 0 && M3.default.createElement(u, null, M3.default.createElement(T, {
        bold: !0
    }, "Tools: "), M3.default.createElement(T, {
        dimColor: !0
    }, K, " tools"))), D.length > 0 && M3.default.createElement(u, {
        marginTop: 1
    }, M3.default.createElement(A1, {
        options: D,
        onChange: async (Z) => {
            if (Z === "tools") _();
            else if (Z === "reconnectMcpServer") {
                X(!0);
                try {
                    let G = await j(q.name),
                        {
                            message: f
                        } = yi8(G, q.name);
                    Y?.(f)
                } catch (G) {
                    Y?.($_8(G, q.name))
                } finally {
                    X(!1)
                }
            } else if (Z === "toggle-enabled") await M();
            else if (Z === "back") z()
        },
        onCancel: z
    }))), M3.default.createElement(u, {
        marginTop: 1
    }, M3.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, w.pending ? M3.default.createElement(M3.default.Fragment, null, "Press ", w.keyName, " again to exit") : M3.default.createElement(z1, null, M3.default.createElement(A8, {
        chord: ["up", "down"],
        format: {
            arrowSep: ""
        },
        action: "navigate"
    }), M3.default.createElement(A8, {
        chord: "enter",
        action: "select"
    }), M3.default.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "back"
    })))))
}
// @from(Ln 452030, Col 4)
M3
// @from(Ln 452031, Col 4)
hi8 = L(() => {
    Qq();
    C$();
    g6();
    rD();
    B_6();
    iD();
    N7();
    m8();
    bK();
    g_();
    Nq();
    u7();
    aA7();
    Ej();
    _w7();
    M3 = K6(P6(), 1)
})