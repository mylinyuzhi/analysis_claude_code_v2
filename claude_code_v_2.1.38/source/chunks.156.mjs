
// @from(Ln 400033, Col 4)
Pqq = ({
    isDisabled: A = !1,
    state: q
}) => {
    D8((K, Y) => {
        if (Y.downArrow || Y.ctrl && K === "n" || !Y.ctrl && !Y.shift && K === "j") q.focusNextOption();
        if (Y.upArrow || Y.ctrl && K === "p" || !Y.ctrl && !Y.shift && K === "k") q.focusPreviousOption();
        if (K === " ") q.toggleFocusedOption();
        if (Y.return) q.submit()
    }, {
        isActive: !A
    })
}
// @from(Ln 400046, Col 4)
Wqq = v(() => {
    m1()
})
// @from(Ln 400050, Col 0)
function PZ1(A) {
    let q = e(22),
        {
            isDisabled: K,
            visibleOptionCount: Y,
            highlightText: z,
            options: w,
            defaultValue: H,
            onChange: $,
            onSubmit: O
        } = A,
        _ = K === void 0 ? !1 : K,
        J = Y === void 0 ? 5 : Y,
        X;
    if (q[0] !== H || q[1] !== $ || q[2] !== O || q[3] !== w || q[4] !== J) X = {
        visibleOptionCount: J,
        options: w,
        defaultValue: H,
        onChange: $,
        onSubmit: O
    }, q[0] = H, q[1] = $, q[2] = O, q[3] = w, q[4] = J, q[5] = X;
    else X = q[5];
    let D = jqq(X),
        j;
    if (q[6] !== _ || q[7] !== D) j = {
        isDisabled: _,
        state: D
    }, q[6] = _, q[7] = D, q[8] = j;
    else j = q[8];
    Pqq(j);
    let M;
    if (q[9] !== z || q[10] !== _ || q[11] !== D.focusedValue || q[12] !== D.value || q[13] !== D.visibleOptions) {
        let W;
        if (q[15] !== z || q[16] !== _ || q[17] !== D.focusedValue || q[18] !== D.value) W = (G) => {
            let f = G.label;
            if (z && G.label.includes(z)) {
                let Z = G.label.indexOf(z);
                f = MZ1.default.createElement(MZ1.default.Fragment, null, G.label.slice(0, Z), MZ1.default.createElement(V, {
                    bold: !0
                }, z), G.label.slice(Z + z.length))
            }
            return MZ1.default.createElement(Oqq, {
                key: G.value,
                isFocused: !_ && D.focusedValue === G.value,
                isSelected: D.value.includes(G.value)
            }, f)
        }, q[15] = z, q[16] = _, q[17] = D.focusedValue, q[18] = D.value, q[19] = W;
        else W = q[19];
        M = D.visibleOptions.map(W), q[9] = z, q[10] = _, q[11] = D.focusedValue, q[12] = D.value, q[13] = D.visibleOptions, q[14] = M
    } else M = q[14];
    let P;
    if (q[20] !== M) P = MZ1.default.createElement(I, {
        flexDirection: "column"
    }, M), q[20] = M, q[21] = P;
    else P = q[21];
    return P
}
// @from(Ln 400107, Col 4)
MZ1
// @from(Ln 400108, Col 4)
kV6 = v(() => {
    i1();
    m1();
    _qq();
    Mqq();
    Wqq();
    MZ1 = o(X1(), 1)
})
// @from(Ln 400117, Col 0)
function SaY(A) {
    if (A.pending) return CN.default.createElement(V, null, "Press ", A.keyName, " again to exit");
    return CN.default.createElement(oA, null, CN.default.createElement(YA, {
        shortcut: "↑↓",
        action: "navigate"
    }), CN.default.createElement(YA, {
        shortcut: "Space",
        action: "toggle"
    }), CN.default.createElement(YA, {
        shortcut: "Enter",
        action: "confirm"
    }), CN.default.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    }))
}
// @from(Ln 400136, Col 0)
function Zqq(A) {
    let q = e(14),
        {
            onSubmit: K,
            defaultSelections: Y
        } = A,
        [z, w] = Gqq.useState(!1),
        H;
    if (q[0] !== K) H = (G) => {
        if (G.length === 0) {
            w(!0);
            return
        }
        w(!1), K(G)
    }, q[0] = K, q[1] = H;
    else H = q[1];
    let $ = H,
        O;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) O = () => {
        w(!1)
    }, q[2] = O;
    else O = q[2];
    let _ = O,
        J;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) J = () => {
        w(!0)
    }, q[3] = J;
    else J = q[3];
    let X = J,
        D;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) D = CN.default.createElement(I, null, CN.default.createElement(V, {
        dimColor: !0
    }, "More workflow examples (issue triage, CI fixes, etc.) at:", " ", CN.default.createElement(d7, {
        url: "https://github.com/anthropics/claude-code-action/blob/main/examples/"
    }, "https://github.com/anthropics/claude-code-action/blob/main/examples/"))), q[4] = D;
    else D = q[4];
    let j;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) j = CaY.map(haY), q[5] = j;
    else j = q[5];
    let M;
    if (q[6] !== Y || q[7] !== $) M = CN.default.createElement(PZ1, {
        options: j,
        defaultValue: Y,
        onSubmit: $,
        onChange: _
    }), q[6] = Y, q[7] = $, q[8] = M;
    else M = q[8];
    let P;
    if (q[9] !== z) P = z && CN.default.createElement(I, null, CN.default.createElement(V, {
        color: "error"
    }, "You must select at least one workflow to continue")), q[9] = z, q[10] = P;
    else P = q[10];
    let W;
    if (q[11] !== M || q[12] !== P) W = CN.default.createElement(w8, {
        title: "Select GitHub workflows to install",
        subtitle: "We'll create a workflow file in your repository for each one you select.",
        onCancel: X,
        inputGuide: SaY
    }, D, M, P), q[11] = M, q[12] = P, q[13] = W;
    else W = q[13];
    return W
}
// @from(Ln 400199, Col 0)
function haY(A) {
    return {
        label: A.label,
        value: A.value
    }
}
// @from(Ln 400205, Col 4)
CN
// @from(Ln 400205, Col 8)
Gqq
// @from(Ln 400205, Col 13)
CaY
// @from(Ln 400206, Col 4)
fqq = v(() => {
    i1();
    m1();
    Bq();
    kV6();
    wK();
    BK();
    HK();
    CN = o(X1(), 1), Gqq = o(X1(), 1), CaY = [{
        value: "claude",
        label: "@Claude Code - Tag @claude in issues and PR comments"
    }, {
        value: "claude-review",
        label: "Claude Code Review - Automated code review on new PRs"
    }]
})
// @from(Ln 400222, Col 0)
async function IaY(A, q, K, Y, z, w, H) {
    let $ = await IA("gh", ["api", `repos/${A}/contents/${K}`, "--jq", ".sha"]),
        O = null;
    if ($.code === 0) O = $.stdout.trim();
    let _ = Y;
    if (z === "CLAUDE_CODE_OAUTH_TOKEN") _ = Y.replace(/anthropic_api_key: \$\{\{ secrets\.ANTHROPIC_API_KEY \}\}/g, "claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}");
    else if (z !== "ANTHROPIC_API_KEY") _ = Y.replace(/anthropic_api_key: \$\{\{ secrets\.ANTHROPIC_API_KEY \}\}/g, `anthropic_api_key: \${{ secrets.${z} }}`);
    let J = Buffer.from(_).toString("base64"),
        X = ["api", "--method", "PUT", `repos/${A}/contents/${K}`, "-f", `message=${O?`"Update ${w}"`:`"${w}"`}`, "-f", `content=${J}`, "-f", `branch=${q}`];
    if (O) X.push("-f", `sha=${O}`);
    let D = await IA("gh", X);
    if (D.code !== 0) {
        if (D.stderr.includes("422") && D.stderr.includes("sha")) throw c("tengu_setup_github_actions_failed", {
            reason: "failed_to_create_workflow_file",
            exit_code: D.code,
            ...H
        }), Error(`Failed to create workflow file ${K}: A Claude workflow file already exists in this repository. Please remove it first or update it manually.`);
        c("tengu_setup_github_actions_failed", {
            reason: "failed_to_create_workflow_file",
            exit_code: D.code,
            ...H
        });
        let j = `

Need help? Common issues:
` + `• Permission denied → Run: gh auth refresh -h github.com -s repo,workflow
` + `• Not authorized → Ensure you have admin access to the repository
` + "• For manual setup → Visit: https://github.com/anthropics/claude-code-action";
        throw Error(`Failed to create workflow file ${K}: ${D.stderr}${j}`)
    }
}
// @from(Ln 400253, Col 0)
async function Vqq(A, q, K, Y, z = !1, w, H, $) {
    try {
        c("tengu_setup_github_actions_started", {
            skip_workflow: z,
            has_api_key: !!q,
            using_default_secret_name: K === "ANTHROPIC_API_KEY",
            selected_claude_workflow: w.includes("claude"),
            selected_claude_review_workflow: w.includes("claude-review"),
            ...$
        });
        let O = await IA("gh", ["api", `repos/${A}`, "--jq", ".id"]);
        if (O.code !== 0) throw c("tengu_setup_github_actions_failed", {
            reason: "repo_not_found",
            exit_code: O.code,
            ...$
        }), Error(`Failed to access repository ${A}`);
        let _ = await IA("gh", ["api", `repos/${A}`, "--jq", ".default_branch"]);
        if (_.code !== 0) throw c("tengu_setup_github_actions_failed", {
            reason: "failed_to_get_default_branch",
            exit_code: _.code,
            ...$
        }), Error(`Failed to get default branch: ${_.stderr}`);
        let J = _.stdout.trim(),
            X = await IA("gh", ["api", `repos/${A}/git/ref/heads/${J}`, "--jq", ".object.sha"]);
        if (X.code !== 0) throw c("tengu_setup_github_actions_failed", {
            reason: "failed_to_get_branch_sha",
            exit_code: X.code,
            ...$
        }), Error(`Failed to get branch SHA: ${X.stderr}`);
        let D = X.stdout.trim(),
            j = null;
        if (!z) {
            Y(), j = `add-claude-github-actions-${Date.now()}`;
            let M = await IA("gh", ["api", "--method", "POST", `repos/${A}/git/refs`, "-f", `ref=refs/heads/${j}`, "-f", `sha=${D}`]);
            if (M.code !== 0) throw c("tengu_setup_github_actions_failed", {
                reason: "failed_to_create_branch",
                exit_code: M.code,
                ...$
            }), Error(`Failed to create branch: ${M.stderr}`);
            Y();
            let P = [];
            if (w.includes("claude")) P.push({
                path: ".github/workflows/claude.yml",
                content: p4q,
                message: "Claude PR Assistant workflow"
            });
            if (w.includes("claude-review")) P.push({
                path: ".github/workflows/claude-code-review.yml",
                content: c4q,
                message: "Claude Code Review workflow"
            });
            for (let W of P) await IaY(A, j, W.path, W.content, K, W.message, $)
        }
        if (Y(), q) {
            let M = await IA("gh", ["secret", "set", K, "--body", q, "--repo", A]);
            if (M.code !== 0) {
                c("tengu_setup_github_actions_failed", {
                    reason: "failed_to_set_api_key_secret",
                    exit_code: M.code,
                    ...$
                });
                let P = `

Need help? Common issues:
` + `• Permission denied → Run: gh auth refresh -h github.com -s repo
` + `• Not authorized → Ensure you have admin access to the repository
` + "• For manual setup → Visit: https://github.com/anthropics/claude-code-action";
                throw Error(`Failed to set API key secret: ${M.stderr||"Unknown error"}${P}`)
            }
        }
        if (!z && j) {
            Y();
            let M = `https://github.com/${A}/compare/${J}...${j}?quick_pull=1&title=${encodeURIComponent(U4q)}&body=${encodeURIComponent(d4q)}`;
            await zY(M)
        }
        c("tengu_setup_github_actions_completed", {
            skip_workflow: z,
            has_api_key: !!q,
            auth_type: H,
            using_default_secret_name: K === "ANTHROPIC_API_KEY",
            selected_claude_workflow: w.includes("claude"),
            selected_claude_review_workflow: w.includes("claude-review"),
            ...$
        }), jA((M) => ({
            ...M,
            githubActionSetupCount: (M.githubActionSetupCount ?? 0) + 1
        }))
    } catch (O) {
        if (!O || !(O instanceof Error) || !O.message.includes("Failed to")) c("tengu_setup_github_actions_failed", {
            reason: "unexpected_error",
            ...$
        });
        if (O instanceof Error) K1(O);
        throw O
    }
}
// @from(Ln 400349, Col 4)
Nqq = v(() => {
    tq();
    Oj();
    u6();
    y6();
    cA()
})
// @from(Ln 400357, Col 0)
function vqq({
    onSuccess: A,
    onCancel: q
}) {
    let [K, Y] = OG.useState({
        state: "starting"
    }), [z] = OG.useState(() => new LF1), [w, H] = OG.useState(""), [$, O] = OG.useState(0), [_, J] = OG.useState(!1), [X, D] = OG.useState(!1), j = OG.useRef(new Set), M = Z8(), P = Math.max(50, M.columns - Tqq.length - 4);
    D8((Z, N) => {
        if (K.state === "error")
            if (N.return && K.toRetry) H(""), O(0), Y({
                state: "about_to_retry",
                nextState: K.toRetry
            });
            else q()
    });
    async function W(Z, N) {
        try {
            let [T, k] = Z.split("#");
            if (!T || !k) {
                Y({
                    state: "error",
                    message: "Invalid code. Please make sure the full code was copied",
                    toRetry: {
                        state: "waiting_for_login",
                        url: N
                    }
                });
                return
            }
            c("tengu_oauth_manual_entry", {}), z.handleManualAuthCodeInput({
                authorizationCode: T,
                state: k
            })
        } catch (T) {
            K1(T instanceof Error ? T : Error(String(T))), Y({
                state: "error",
                message: T.message,
                toRetry: {
                    state: "waiting_for_login",
                    url: N
                }
            })
        }
    }
    let G = OG.useCallback(async () => {
        j.current.forEach((Z) => clearTimeout(Z)), j.current.clear();
        try {
            let Z = await z.startOAuthFlow(async (k) => {
                Y({
                    state: "waiting_for_login",
                    url: k
                });
                let y = setTimeout(() => J(!0), 3000);
                j.current.add(y)
            }, {
                loginWithClaudeAi: !0,
                inferenceOnly: !0,
                expiresIn: 31536000
            });
            Y({
                state: "processing"
            });
            let N = DR1(Z);
            if (N.warning) c("tengu_oauth_storage_warning", {
                warning: N.warning
            });
            let T = setTimeout(() => {
                Y({
                    state: "success",
                    token: Z.accessToken
                });
                let k = setTimeout(() => {
                    A(Z.accessToken)
                }, 1000);
                j.current.add(k)
            }, 100);
            j.current.add(T)
        } catch (Z) {
            let N = Z.message;
            Y({
                state: "error",
                message: N,
                toRetry: {
                    state: "starting"
                }
            }), K1(Z instanceof Error ? Z : Error(String(Z))), c("tengu_oauth_error", {
                error: N
            })
        }
    }, [z, A]);
    OG.useEffect(() => {
        if (K.state === "starting") G()
    }, [K.state, G]), OG.useEffect(() => {
        if (K.state === "about_to_retry") {
            let Z = setTimeout(() => {
                if (K.nextState.state === "waiting_for_login") J(!0);
                else J(!1);
                Y(K.nextState)
            }, 500);
            j.current.add(Z)
        }
    }, [K]), OG.useEffect(() => {
        if (w === "c" && K.state === "waiting_for_login" && _ && !X) l0(K.url).then((Z) => {
            if (Z) D(!0), setTimeout(() => D(!1), 2000)
        }), H("")
    }, [w, K, _, X]), OG.useEffect(() => {
        let Z = j.current;
        return () => {
            z.cleanup(), Z.forEach((N) => clearTimeout(N)), Z.clear()
        }
    }, [z]);

    function f() {
        switch (K.state) {
            case "starting":
                return O9.default.createElement(I, null, O9.default.createElement(c4, null), O9.default.createElement(V, null, "Starting authentication…"));
            case "waiting_for_login":
                return O9.default.createElement(I, {
                    flexDirection: "column",
                    gap: 1
                }, !_ && O9.default.createElement(I, null, O9.default.createElement(c4, null), O9.default.createElement(V, null, "Opening browser to sign in with your Claude account…")), _ && O9.default.createElement(I, null, O9.default.createElement(V, null, Tqq), O9.default.createElement(k3, {
                    value: w,
                    onChange: H,
                    onSubmit: (Z) => W(Z, K.url),
                    cursorOffset: $,
                    onChangeCursorOffset: O,
                    columns: P
                })));
            case "processing":
                return O9.default.createElement(I, null, O9.default.createElement(c4, null), O9.default.createElement(V, null, "Processing authentication…"));
            case "success":
                return O9.default.createElement(I, {
                    flexDirection: "column",
                    gap: 1
                }, O9.default.createElement(V, {
                    color: "success"
                }, "✓ Authentication token created successfully!"), O9.default.createElement(V, {
                    dimColor: !0
                }, "Using token for GitHub Actions setup…"));
            case "error":
                return O9.default.createElement(I, {
                    flexDirection: "column",
                    gap: 1
                }, O9.default.createElement(V, {
                    color: "error"
                }, "OAuth error: ", K.message), K.toRetry ? O9.default.createElement(V, {
                    dimColor: !0
                }, "Press Enter to try again, or any other key to cancel") : O9.default.createElement(V, {
                    dimColor: !0
                }, "Press any key to return to API key selection"));
            case "about_to_retry":
                return O9.default.createElement(I, {
                    flexDirection: "column",
                    gap: 1
                }, O9.default.createElement(V, {
                    color: "permission"
                }, "Retrying…"));
            default:
                return null
        }
    }
    return O9.default.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, K.state === "starting" && O9.default.createElement(I, {
        flexDirection: "column",
        gap: 1,
        paddingBottom: 1
    }, O9.default.createElement(V, {
        bold: !0
    }, "Create Authentication Token"), O9.default.createElement(V, {
        dimColor: !0
    }, "Creating a long-lived token for GitHub Actions")), K.state !== "success" && K.state !== "starting" && K.state !== "processing" && O9.default.createElement(I, {
        key: "header",
        flexDirection: "column",
        gap: 1,
        paddingBottom: 1
    }, O9.default.createElement(V, {
        bold: !0
    }, "Create Authentication Token"), O9.default.createElement(V, {
        dimColor: !0
    }, "Creating a long-lived token for GitHub Actions")), K.state === "waiting_for_login" && _ && O9.default.createElement(I, {
        flexDirection: "column",
        key: "urlToCopy",
        gap: 1,
        paddingBottom: 1
    }, O9.default.createElement(I, {
        paddingX: 1
    }, O9.default.createElement(V, {
        dimColor: !0
    }, "Browser didn't open? Use the url below to sign in", " "), X ? O9.default.createElement(V, {
        color: "success"
    }, "(Copied!)") : O9.default.createElement(V, {
        dimColor: !0
    }, O9.default.createElement(YA, {
        shortcut: "c",
        action: "copy",
        parens: !0
    }))), O9.default.createElement(d7, {
        url: K.url
    }, O9.default.createElement(V, {
        dimColor: !0
    }, K.url))), O9.default.createElement(I, {
        paddingLeft: 1,
        flexDirection: "column",
        gap: 1
    }, f()))
}
// @from(Ln 400565, Col 4)
O9
// @from(Ln 400565, Col 8)
OG
// @from(Ln 400565, Col 12)
Tqq = "Paste code here if prompted > "
// @from(Ln 400566, Col 4)
Eqq = v(() => {
    m1();
    OB();
    wK();
    gO();
    wTA();
    J7();
    u6();
    x2();
    y6();
    mq();
    O9 = o(X1(), 1), OG = o(X1(), 1)
})
// @from(Ln 400579, Col 4)
kqq = {}
// @from(Ln 400584, Col 0)
function baY(A) {
    let [q] = J$.useState(() => Mk()), [K, Y] = J$.useState({
        ...xaY,
        useExistingKey: !!q,
        selectedApiKeyOption: q ? "existing" : MV() ? "oauth" : "new"
    });
    uq(), J$.default.useEffect(() => {
        c("tengu_install_github_app_started", {})
    }, []);
    let z = J$.useCallback(async () => {
        let k = [];
        if ((await XY("gh --version", {
                shell: !0,
                reject: !1
            })).exitCode !== 0) k.push({
            title: "GitHub CLI not found",
            message: "GitHub CLI (gh) does not appear to be installed or accessible.",
            instructions: ["Install GitHub CLI from https://cli.github.com/", "macOS: brew install gh", "Windows: winget install --id GitHub.cli", "Linux: See installation instructions at https://github.com/cli/cli#installation"]
        });
        let B = await XY("gh auth status -a", {
            shell: !0,
            reject: !1
        });
        if (B.exitCode !== 0) k.push({
            title: "GitHub CLI not authenticated",
            message: "GitHub CLI does not appear to be authenticated.",
            instructions: ["Run: gh auth login", "Follow the prompts to authenticate with GitHub", "Or set up authentication using environment variables or other methods"]
        });
        else {
            let m = B.stdout.match(/Token scopes:.*$/m);
            if (m) {
                let b = m[0],
                    g = [];
                if (!b.includes("repo")) g.push("repo");
                if (!b.includes("workflow")) g.push("workflow");
                if (g.length > 0) {
                    Y((U) => ({
                        ...U,
                        step: "error",
                        error: `GitHub CLI is missing required permissions: ${g.join(", ")}.`,
                        errorReason: "Missing required scopes",
                        errorInstructions: [`Your GitHub CLI authentication is missing the "${g.join('" and "')}" scope${g.length>1?"s":""} needed to manage GitHub Actions and secrets.`, "", "To fix this, run:", "  gh auth refresh -h github.com -s repo,workflow", "", "This will add the necessary permissions to manage workflows and secrets."]
                    }));
                    return
                }
            }
        }
        let S = await DH8() ?? "";
        c("tengu_install_github_app_step_completed", {
            step: "check-gh"
        }), Y((m) => ({
            ...m,
            warnings: k,
            currentRepo: S,
            selectedRepoName: S,
            useCurrentRepo: !!S,
            step: k.length > 0 ? "warnings" : "choose-repo"
        }))
    }, []);
    J$.default.useEffect(() => {
        if (K.step === "check-gh") z()
    }, [K.step, z]);
    let w = J$.useCallback(async (k, y) => {
        Y((B) => ({
            ...B,
            step: "creating",
            currentWorkflowInstallStep: 0
        }));
        try {
            await Vqq(K.selectedRepoName, k, y, () => {
                Y((B) => ({
                    ...B,
                    currentWorkflowInstallStep: B.currentWorkflowInstallStep + 1
                }))
            }, K.workflowAction === "skip", K.selectedWorkflows, K.authType, {
                useCurrentRepo: K.useCurrentRepo,
                workflowExists: K.workflowExists,
                secretExists: K.secretExists
            }), c("tengu_install_github_app_step_completed", {
                step: "creating"
            }), Y((B) => ({
                ...B,
                step: "success"
            }))
        } catch (B) {
            let S = B instanceof Error ? B.message : "Failed to set up GitHub Actions";
            if (S.includes("workflow file already exists")) c("tengu_install_github_app_error", {
                reason: "workflow_file_exists"
            }), Y((m) => ({
                ...m,
                step: "error",
                error: "A Claude workflow file already exists in this repository.",
                errorReason: "Workflow file conflict",
                errorInstructions: ["The file .github/workflows/claude.yml already exists", "You can either:", "  1. Delete the existing file and run this command again", "  2. Update the existing file manually using the template from:", `     ${zF}`]
            }));
            else c("tengu_install_github_app_error", {
                reason: "setup_github_actions_failed"
            }), Y((m) => ({
                ...m,
                step: "error",
                error: S,
                errorReason: "GitHub Actions setup failed",
                errorInstructions: []
            }))
        }
    }, [K.selectedRepoName, K.workflowAction, K.selectedWorkflows, K.useCurrentRepo, K.workflowExists, K.secretExists, K.authType]);
    async function H() {
        await zY("https://github.com/apps/claude")
    }
    async function $(k) {
        try {
            let y = await IA("gh", ["api", `repos/${k}`, "--jq", ".permissions.admin"]);
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
    async function O(k) {
        return (await IA("gh", ["api", `repos/${k}/contents/.github/workflows/claude.yml`, "--jq", ".sha"])).code === 0
    }
    async function _() {
        let k = await IA("gh", ["secret", "list", "--app", "actions", "--repo", K.selectedRepoName]);
        if (k.code === 0)
            if (k.stdout.split(`
`).some((S) => {
                    return /^ANTHROPIC_API_KEY\s+/.test(S)
                })) Y((S) => ({
                ...S,
                secretExists: !0,
                step: "check-existing-secret"
            }));
            else if (q) Y((S) => ({
            ...S,
            apiKeyOrOAuthToken: q,
            useExistingKey: !0
        })), await w(q, K.secretName);
        else Y((S) => ({
            ...S,
            step: "api-key"
        }));
        else if (q) Y((y) => ({
            ...y,
            apiKeyOrOAuthToken: q,
            useExistingKey: !0
        })), await w(q, K.secretName);
        else Y((y) => ({
            ...y,
            step: "api-key"
        }))
    }
    let J = async () => {
        if (K.step === "warnings") c("tengu_install_github_app_step_completed", {
            step: "warnings"
        }), Y((k) => ({
            ...k,
            step: "install-app"
        })), setTimeout(() => {
            H()
        }, 0);
        else if (K.step === "choose-repo") {
            let k = K.useCurrentRepo ? K.currentRepo : K.selectedRepoName;
            if (!k.trim()) return;
            let y = [];
            if (k.includes("github.com")) {
                let m = k.match(/github\.com[:/]([^/]+\/[^/]+)(\.git)?$/);
                if (!m) y.push({
                    title: "Invalid GitHub URL format",
                    message: "The repository URL format appears to be invalid.",
                    instructions: ["Use format: owner/repo or https://github.com/owner/repo", "Example: anthropics/claude-cli"]
                });
                else k = m[1]?.replace(/\.git$/, "") || ""
            }
            if (!k.includes("/")) y.push({
                title: "Repository format warning",
                message: 'Repository should be in format "owner/repo"',
                instructions: ["Use format: owner/repo", "Example: anthropics/claude-cli"]
            });
            let B = await $(k);
            if (B.error === "repository_not_found") y.push({
                title: "Repository not found",
                message: `Repository ${k} was not found or you don't have access.`,
                instructions: [`Check that the repository name is correct: ${k}`, "Ensure you have access to this repository", 'For private repositories, make sure your GitHub token has the "repo" scope', "You can add the repo scope with: gh auth refresh -h github.com -s repo,workflow"]
            });
            else if (!B.hasAccess) y.push({
                title: "Admin permissions required",
                message: `You might need admin permissions on ${k} to set up GitHub Actions.`,
                instructions: ["Repository admins can install GitHub Apps and set secrets", "Ask a repository admin to run this command if setup fails", "Alternatively, you can use the manual setup instructions"]
            });
            let S = await O(k);
            if (y.length > 0) {
                let m = [...K.warnings, ...y];
                Y((b) => ({
                    ...b,
                    selectedRepoName: k,
                    workflowExists: S,
                    warnings: m,
                    step: "warnings"
                }))
            } else c("tengu_install_github_app_step_completed", {
                step: "choose-repo"
            }), Y((m) => ({
                ...m,
                selectedRepoName: k,
                workflowExists: S,
                step: "install-app"
            })), setTimeout(() => {
                H()
            }, 0)
        } else if (K.step === "install-app")
            if (c("tengu_install_github_app_step_completed", {
                    step: "install-app"
                }), K.workflowExists) Y((k) => ({
                ...k,
                step: "check-existing-workflow"
            }));
            else Y((k) => ({
                ...k,
                step: "select-workflows"
            }));
        else if (K.step === "check-existing-workflow") return;
        else if (K.step === "select-workflows") return;
        else if (K.step === "check-existing-secret")
            if (c("tengu_install_github_app_step_completed", {
                    step: "check-existing-secret"
                }), K.useExistingSecret) await w(null, K.secretName);
            else await w(K.apiKeyOrOAuthToken, K.secretName);
        else if (K.step === "api-key") {
            if (K.selectedApiKeyOption === "oauth") return;
            let k = K.selectedApiKeyOption === "existing" ? q : K.apiKeyOrOAuthToken;
            if (!k) {
                c("tengu_install_github_app_error", {
                    reason: "api_key_missing"
                }), Y((B) => ({
                    ...B,
                    step: "error",
                    error: "API key is required"
                }));
                return
            }
            Y((B) => ({
                ...B,
                apiKeyOrOAuthToken: k,
                useExistingKey: K.selectedApiKeyOption === "existing"
            }));
            let y = await IA("gh", ["secret", "list", "--app", "actions", "--repo", K.selectedRepoName]);
            if (y.code === 0)
                if (y.stdout.split(`
`).some((m) => {
                        return /^ANTHROPIC_API_KEY\s+/.test(m)
                    })) c("tengu_install_github_app_step_completed", {
                    step: "api-key"
                }), Y((m) => ({
                    ...m,
                    secretExists: !0,
                    step: "check-existing-secret"
                }));
                else c("tengu_install_github_app_step_completed", {
                    step: "api-key"
                }), await w(k, K.secretName);
            else c("tengu_install_github_app_step_completed", {
                step: "api-key"
            }), await w(k, K.secretName)
        }
    }, X = (k) => {
        Y((y) => ({
            ...y,
            selectedRepoName: k
        }))
    }, D = (k) => {
        Y((y) => ({
            ...y,
            apiKeyOrOAuthToken: k
        }))
    }, j = (k) => {
        Y((y) => ({
            ...y,
            selectedApiKeyOption: k
        }))
    }, M = J$.useCallback(() => {
        c("tengu_install_github_app_step_completed", {
            step: "api-key"
        }), Y((k) => ({
            ...k,
            step: "oauth-flow"
        }))
    }, []), P = J$.useCallback((k) => {
        c("tengu_install_github_app_step_completed", {
            step: "oauth-flow"
        }), Y((y) => ({
            ...y,
            apiKeyOrOAuthToken: k,
            useExistingKey: !1,
            secretName: "CLAUDE_CODE_OAUTH_TOKEN",
            authType: "oauth_token"
        })), w(k, "CLAUDE_CODE_OAUTH_TOKEN")
    }, [w]), W = J$.useCallback(() => {
        Y((k) => ({
            ...k,
            step: "api-key"
        }))
    }, []), G = (k) => {
        if (k && !/^[a-zA-Z0-9_]+$/.test(k)) return;
        Y((y) => ({
            ...y,
            secretName: k
        }))
    }, f = (k) => {
        Y((y) => ({
            ...y,
            useCurrentRepo: k,
            selectedRepoName: k ? y.currentRepo : ""
        }))
    }, Z = (k) => {
        Y((y) => ({
            ...y,
            useExistingKey: k
        }))
    }, N = (k) => {
        Y((y) => ({
            ...y,
            useExistingSecret: k,
            secretName: k ? "ANTHROPIC_API_KEY" : ""
        }))
    }, T = async (k) => {
        if (k === "exit") {
            A.onDone("Installation cancelled by user");
            return
        }
        if (c("tengu_install_github_app_step_completed", {
                step: "check-existing-workflow"
            }), Y((y) => ({
                ...y,
                workflowAction: k
            })), k === "skip" || k === "update")
            if (q) await _();
            else Y((y) => ({
                ...y,
                step: "api-key"
            }))
    };
    switch (D8(() => {
            if (K.step === "success" || K.step === "error") {
                if (K.step === "success") c("tengu_install_github_app_completed", {});
                A.onDone(K.step === "success" ? "GitHub Actions setup complete!" : K.error ? `Couldn't install GitHub App: ${K.error}
For manual setup instructions, see: ${zF}` : `GitHub App installation failed
For manual setup instructions, see: ${zF}`)
            }
        }), K.step) {
        case "check-gh":
            return J$.default.createElement(m4q, null);
        case "warnings":
            return J$.default.createElement(wqq, {
                warnings: K.warnings,
                onContinue: J
            });
        case "choose-repo":
            return J$.default.createElement(Q4q, {
                currentRepo: K.currentRepo,
                useCurrentRepo: K.useCurrentRepo,
                repoUrl: K.selectedRepoName,
                onRepoUrlChange: X,
                onToggleUseCurrentRepo: f,
                onSubmit: J
            });
        case "install-app":
            return J$.default.createElement(l4q, {
                repoUrl: K.selectedRepoName,
                onSubmit: J
            });
        case "check-existing-workflow":
            return J$.default.createElement(Yqq, {
                repoName: K.selectedRepoName,
                onSelectAction: T
            });
        case "check-existing-secret":
            return J$.default.createElement(n4q, {
                useExistingSecret: K.useExistingSecret,
                secretName: K.secretName,
                onToggleUseExistingSecret: N,
                onSecretNameChange: G,
                onSubmit: J
            });
        case "api-key":
            return J$.default.createElement(o4q, {
                existingApiKey: q,
                useExistingKey: K.useExistingKey,
                apiKeyOrOAuthToken: K.apiKeyOrOAuthToken,
                onApiKeyChange: D,
                onToggleUseExistingKey: Z,
                onSubmit: J,
                onCreateOAuthToken: MV() ? M : void 0,
                selectedOption: K.selectedApiKeyOption,
                onSelectOption: j
            });
        case "creating":
            return J$.default.createElement(s4q, {
                currentWorkflowInstallStep: K.currentWorkflowInstallStep,
                secretExists: K.secretExists,
                useExistingSecret: K.useExistingSecret,
                secretName: K.secretName,
                skipWorkflow: K.workflowAction === "skip",
                selectedWorkflows: K.selectedWorkflows
            });
        case "success":
            return J$.default.createElement(e4q, {
                secretExists: K.secretExists,
                useExistingSecret: K.useExistingSecret,
                secretName: K.secretName,
                skipWorkflow: K.workflowAction === "skip"
            });
        case "error":
            return J$.default.createElement(qqq, {
                error: K.error,
                errorReason: K.errorReason,
                errorInstructions: K.errorInstructions
            });
        case "select-workflows":
            return J$.default.createElement(Zqq, {
                defaultSelections: K.selectedWorkflows,
                onSubmit: (k) => {
                    if (c("tengu_install_github_app_step_completed", {
                            step: "select-workflows"
                        }), Y((y) => ({
                            ...y,
                            selectedWorkflows: k
                        })), q) _();
                    else Y((y) => ({
                        ...y,
                        step: "api-key"
                    }))
                }
            });
        case "oauth-flow":
            return J$.default.createElement(vqq, {
                onSuccess: P,
                onCancel: W
            })
    }
}
// @from(Ln 401034, Col 0)
async function uaY(A) {
    return u8("github-app"), J$.default.createElement(baY, {
        onDone: A
    })
}
// @from(Ln 401039, Col 4)
J$
// @from(Ln 401039, Col 8)
xaY
// @from(Ln 401040, Col 4)
Lqq = v(() => {
    m1();
    J7();
    R2();
    tq();
    Bf();
    h9();
    Oj();
    F4q();
    g4q();
    i4q();
    r4q();
    a4q();
    t4q();
    Aqq();
    Kqq();
    zqq();
    Hqq();
    fqq();
    Nqq();
    Eqq();
    u6();
    v3();
    J$ = o(X1(), 1), xaY = {
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
// @from(Ln 401081, Col 4)
BaY
// @from(Ln 401081, Col 9)
Rqq
// @from(Ln 401082, Col 4)
yqq = v(() => {
    J7();
    BaY = {
        type: "local-jsx",
        name: "install-github-app",
        description: "Set up Claude GitHub Actions for a repository",
        isEnabled: () => !process.env.DISABLE_INSTALL_GITHUB_APP_COMMAND && !cC(),
        isHidden: !1,
        load: () => Promise.resolve().then(() => (Lqq(), kqq)),
        userFacingName() {
            return "install-github-app"
        }
    }, Rqq = BaY
})
// @from(Ln 401096, Col 4)
Sqq = {}
// @from(Ln 401100, Col 0)
async function maY() {
    if (u8("slack-app"), c("tengu_install_slack_app_clicked", {}), jA((q) => ({
            ...q,
            slackAppInstallCount: (q.slackAppInstallCount ?? 0) + 1
        })), await zY(Cqq)) return {
        type: "text",
        value: "Opening Slack app installation page in browser…"
    };
    else return {
        type: "text",
        value: `Couldn't open browser. Visit: ${Cqq}`
    }
}
// @from(Ln 401113, Col 4)
Cqq = "https://slack.com/marketplace/A08SF47R6P4-claude"
// @from(Ln 401114, Col 4)
hqq = v(() => {
    Oj();
    cA();
    u6();
    v3()
})
// @from(Ln 401120, Col 4)
FaY
// @from(Ln 401120, Col 9)
Iqq
// @from(Ln 401121, Col 4)
xqq = v(() => {
    FaY = {
        type: "local",
        name: "install-slack-app",
        description: "Install the Claude Slack app",
        isEnabled: () => !0,
        isHidden: !1,
        supportsNonInteractive: !1,
        load: () => Promise.resolve().then(() => (hqq(), Sqq)),
        userFacingName() {
            return "install-slack-app"
        }
    }, Iqq = FaY
})
// @from(Ln 401135, Col 4)
bqq = () => {}
// @from(Ln 401137, Col 0)
function Bqq(A) {
    switch (A) {
        case "project":
            return {
                label: "Project MCPs", path: KG(A)
            };
        case "user":
            return {
                label: "User MCPs", path: KG(A)
            };
        case "local":
            return {
                label: "Local MCPs", path: KG(A)
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
                label: A
            }
    }
}
// @from(Ln 401166, Col 0)
function QaY(A) {
    let q = new Map;
    for (let K of A) {
        let Y = K.scope;
        if (!q.has(Y)) q.set(Y, []);
        q.get(Y).push(K)
    }
    for (let [, K] of q) K.sort((Y, z) => Y.name.localeCompare(z.name));
    return q
}
// @from(Ln 401177, Col 0)
function MxA(A) {
    let q = e(76),
        {
            servers: K,
            agentServers: Y,
            onSelectServer: z,
            onSelectAgentServer: w,
            onComplete: H
        } = A,
        $;
    if (q[0] !== Y) $ = Y === void 0 ? [] : Y, q[0] = Y, q[1] = $;
    else $ = q[1];
    let O = $,
        [_] = T7(),
        [J, X] = o3.useState(0),
        D;
    if (q[2] !== K) {
        let R1 = K.filter(laY);
        D = QaY(R1), q[2] = K, q[3] = D
    } else D = q[3];
    let j = D,
        M;
    if (q[4] !== K) M = K.filter(caY).sort(daY), q[4] = K, q[5] = M;
    else M = q[5];
    let P = M,
        W;
    if (q[6] !== j) W = (j.get("dynamic") ?? []).sort(paY), q[6] = j, q[7] = W;
    else W = q[7];
    let G = W,
        f;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) f = Bqq("dynamic"), q[8] = f;
    else f = q[8];
    let Z = f,
        N;
    if (q[9] !== O || q[10] !== P || q[11] !== G || q[12] !== j) {
        N = [];
        for (let R1 of uqq) {
            let H1 = j.get(R1) ?? [];
            for (let y1 of H1) N.push({
                type: "server",
                server: y1
            })
        }
        for (let R1 of P) N.push({
            type: "server",
            server: R1
        });
        for (let R1 of O) N.push({
            type: "agent-server",
            agentServer: R1
        });
        for (let R1 of G) N.push({
            type: "server",
            server: R1
        });
        q[9] = O, q[10] = P, q[11] = G, q[12] = j, q[13] = N
    } else N = q[13];
    let T = N,
        k;
    if (q[14] !== H) k = () => {
        H("MCP dialog dismissed", {
            display: "system"
        })
    }, q[14] = H, q[15] = k;
    else k = q[15];
    let y = k,
        B;
    if (q[16] !== w || q[17] !== z || q[18] !== T || q[19] !== J) B = () => {
        let R1 = T[J];
        if (!R1) return;
        if (R1.type === "server") z(R1.server);
        else if (R1.type === "agent-server" && w) w(R1.agentServer)
    }, q[16] = w, q[17] = z, q[18] = T, q[19] = J, q[20] = B;
    else B = q[20];
    let S = B,
        m, b;
    if (q[21] !== T) b = () => X((R1) => R1 === 0 ? T.length - 1 : R1 - 1), m = () => X((R1) => R1 === T.length - 1 ? 0 : R1 + 1), q[21] = T, q[22] = m, q[23] = b;
    else m = q[22], b = q[23];
    let g;
    if (q[24] !== y || q[25] !== S || q[26] !== m || q[27] !== b) g = {
        "confirm:previous": b,
        "confirm:next": m,
        "confirm:yes": S,
        "confirm:no": y
    }, q[24] = y, q[25] = S, q[26] = m, q[27] = b, q[28] = g;
    else g = q[28];
    let U;
    if (q[29] === Symbol.for("react.memo_cache_sentinel")) U = {
        context: "Confirmation"
    }, q[29] = U;
    else U = q[29];
    c7(g, U);
    let x;
    if (q[30] !== T) x = (R1) => T.findIndex((H1) => H1.type === "server" && H1.server === R1), q[30] = T, q[31] = x;
    else x = q[31];
    let p = x,
        l;
    if (q[32] !== T) l = (R1) => T.findIndex((H1) => H1.type === "agent-server" && H1.agentServer === R1), q[32] = T, q[33] = l;
    else l = q[33];
    let r = l,
        s;
    if (q[34] === Symbol.for("react.memo_cache_sentinel")) s = Y21(), q[34] = s;
    else s = q[34];
    let O1 = s,
        T1;
    if (q[35] !== K) T1 = K.some(UaY), q[35] = K, q[36] = T1;
    else T1 = q[36];
    let N1 = T1;
    if (K.length === 0 && O.length === 0) return null;
    let j1;
    if (q[37] !== p || q[38] !== J || q[39] !== _) j1 = (R1) => {
        let H1 = p(R1),
            y1 = J === H1,
            B1, A6;
        if (R1.client.type === "disabled") B1 = k8("inactive", _)(l1.radioOff), A6 = "disabled";
        else if (R1.client.type === "connected") B1 = k8("success", _)(l1.tick), A6 = "connected";
        else if (R1.client.type === "pending") {
            B1 = k8("inactive", _)(l1.radioOff);
            let {
                reconnectAttempt: O6,
                maxReconnectAttempts: P6
            } = R1.client;
            if (O6 && P6) A6 = `reconnecting (${O6}/${P6})…`;
            else A6 = "connecting…"
        } else if (R1.client.type === "needs-auth") B1 = k8("warning", _)(l1.triangleUpOutline), A6 = "needs authentication";
        else B1 = k8("error", _)(l1.cross), A6 = "failed";
        return o3.default.createElement(I, {
            key: `${R1.name}-${H1}`
        }, o3.default.createElement(V, {
            color: y1 ? "suggestion" : void 0
        }, y1 ? `${l1.pointer} ` : "  "), o3.default.createElement(V, {
            color: y1 ? "suggestion" : void 0
        }, R1.name), o3.default.createElement(V, {
            dimColor: !y1
        }, " · ", B1, " "), o3.default.createElement(V, {
            dimColor: !y1
        }, A6))
    }, q[37] = p, q[38] = J, q[39] = _, q[40] = j1;
    else j1 = q[40];
    let q1 = j1,
        t;
    if (q[41] !== r || q[42] !== J || q[43] !== _) t = (R1) => {
        let H1 = r(R1),
            y1 = J === H1,
            B1 = R1.needsAuth ? k8("warning", _)(l1.triangleUpOutline) : k8("inactive", _)(l1.radioOff),
            A6 = R1.needsAuth ? "may need auth" : "agent-only";
        return o3.default.createElement(I, {
            key: `agent-${R1.name}-${H1}`
        }, o3.default.createElement(V, {
            color: y1 ? "suggestion" : void 0
        }, y1 ? `${l1.pointer} ` : "  "), o3.default.createElement(V, {
            color: y1 ? "suggestion" : void 0
        }, R1.name), o3.default.createElement(V, {
            dimColor: !y1
        }, " · ", B1, " "), o3.default.createElement(V, {
            dimColor: !y1
        }, A6))
    }, q[41] = r, q[42] = J, q[43] = _, q[44] = t;
    else t = q[44];
    let J1 = t,
        D1 = K.length + O.length,
        Z1;
    if (q[45] === Symbol.for("react.memo_cache_sentinel")) Z1 = o3.default.createElement(fV6, null), q[45] = Z1;
    else Z1 = q[45];
    let E1 = `${D1} server${D1===1?"":"s"}`,
        a;
    if (q[46] !== q1 || q[47] !== j) a = uqq.map((R1) => {
        let H1 = j.get(R1);
        if (!H1 || H1.length === 0) return null;
        let y1 = Bqq(R1);
        return o3.default.createElement(I, {
            key: R1,
            flexDirection: "column",
            marginBottom: 1
        }, o3.default.createElement(I, {
            paddingLeft: 2
        }, o3.default.createElement(V, {
            bold: !0
        }, y1.label), y1.path && o3.default.createElement(V, {
            dimColor: !0
        }, " (", y1.path, ")")), H1.map((B1) => q1(B1)))
    }), q[46] = q1, q[47] = j, q[48] = a;
    else a = q[48];
    let A1;
    if (q[49] !== P || q[50] !== q1) A1 = P.length > 0 && o3.default.createElement(I, {
        flexDirection: "column",
        marginBottom: 1
    }, o3.default.createElement(I, {
        paddingLeft: 2
    }, o3.default.createElement(V, {
        bold: !0
    }, "claude.ai")), P.map((R1) => q1(R1))), q[49] = P, q[50] = q1, q[51] = A1;
    else A1 = q[51];
    let M1;
    if (q[52] !== O || q[53] !== J1) M1 = O.length > 0 && o3.default.createElement(I, {
        flexDirection: "column",
        marginBottom: 1
    }, o3.default.createElement(I, {
        paddingLeft: 2
    }, o3.default.createElement(V, {
        bold: !0
    }, "Agent MCPs")), [...new Set(O.flatMap(gaY))].map((R1) => o3.default.createElement(I, {
        key: R1,
        flexDirection: "column",
        marginTop: 1
    }, o3.default.createElement(I, {
        paddingLeft: 2
    }, o3.default.createElement(V, {
        dimColor: !0
    }, "@", R1)), O.filter((H1) => H1.sourceAgents.includes(R1)).map((H1) => J1(H1))))), q[52] = O, q[53] = J1, q[54] = M1;
    else M1 = q[54];
    let z1;
    if (q[55] !== G || q[56] !== q1) z1 = G.length > 0 && o3.default.createElement(I, {
        flexDirection: "column",
        marginBottom: 1
    }, o3.default.createElement(I, {
        paddingLeft: 2
    }, o3.default.createElement(V, {
        bold: !0
    }, Z.label), Z.path && o3.default.createElement(V, {
        dimColor: !0
    }, " (", Z.path, ")")), G.map((R1) => q1(R1))), q[55] = G, q[56] = q1, q[57] = z1;
    else z1 = q[57];
    let Y1;
    if (q[58] !== N1) Y1 = N1 && o3.default.createElement(V, {
        dimColor: !0
    }, O1 ? "※ Error logs shown inline with --debug" : "※ Run claude --debug to see error logs"), q[58] = N1, q[59] = Y1;
    else Y1 = q[59];
    let _1;
    if (q[60] === Symbol.for("react.memo_cache_sentinel")) _1 = o3.default.createElement(V, {
        dimColor: !0
    }, o3.default.createElement(d7, {
        url: "https://code.claude.com/docs/en/mcp"
    }, "https://code.claude.com/docs/en/mcp"), " ", "for help"), q[60] = _1;
    else _1 = q[60];
    let $1;
    if (q[61] !== Y1) $1 = o3.default.createElement(I, {
        flexDirection: "column"
    }, Y1, _1), q[61] = Y1, q[62] = $1;
    else $1 = q[62];
    let G1;
    if (q[63] !== a || q[64] !== A1 || q[65] !== M1 || q[66] !== z1 || q[67] !== $1) G1 = o3.default.createElement(I, {
        flexDirection: "column"
    }, a, A1, M1, z1, $1), q[63] = a, q[64] = A1, q[65] = M1, q[66] = z1, q[67] = $1, q[68] = G1;
    else G1 = q[68];
    let L1;
    if (q[69] !== y || q[70] !== E1 || q[71] !== G1) L1 = o3.default.createElement(w8, {
        title: "Manage MCP servers",
        subtitle: E1,
        onCancel: y,
        hideInputGuide: !0
    }, G1), q[69] = y, q[70] = E1, q[71] = G1, q[72] = L1;
    else L1 = q[72];
    let x1;
    if (q[73] === Symbol.for("react.memo_cache_sentinel")) x1 = o3.default.createElement(I, {
        paddingX: 1
    }, o3.default.createElement(V, {
        dimColor: !0,
        italic: !0
    }, o3.default.createElement(oA, null, o3.default.createElement(YA, {
        shortcut: "↑↓",
        action: "navigate"
    }), o3.default.createElement(YA, {
        shortcut: "Enter",
        action: "confirm"
    }), o3.default.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    })))), q[73] = x1;
    else x1 = q[73];
    let f1;
    if (q[74] !== L1) f1 = o3.default.createElement(I, {
        flexDirection: "column"
    }, Z1, L1, x1), q[74] = L1, q[75] = f1;
    else f1 = q[75];
    return f1
}
// @from(Ln 401457, Col 0)
function gaY(A) {
    return A.sourceAgents
}
// @from(Ln 401461, Col 0)
function UaY(A) {
    return A.client.type === "failed"
}
// @from(Ln 401465, Col 0)
function paY(A, q) {
    return A.name.localeCompare(q.name)
}
// @from(Ln 401469, Col 0)
function daY(A, q) {
    return A.name.localeCompare(q.name)
}
// @from(Ln 401473, Col 0)
function caY(A) {
    return A.client.config.type === "claudeai-proxy"
}
// @from(Ln 401477, Col 0)
function laY(A) {
    return A.client.config.type !== "claudeai-proxy"
}
// @from(Ln 401480, Col 4)
o3
// @from(Ln 401480, Col 8)
uqq
// @from(Ln 401481, Col 4)
PxA = v(() => {
    i1();
    m1();
    K7();
    Z6();
    b7();
    qxA();
    Bq();
    wK();
    BK();
    HK();
    tX();
    o3 = o(X1(), 1), uqq = ["project", "local", "user", "enterprise"]
})
// @from(Ln 401496, Col 0)
function LV6(A) {
    let q = e(9),
        {
            serverToolsCount: K,
            serverPromptsCount: Y,
            serverResourcesCount: z
        } = A,
        w;
    if (q[0] !== Y || q[1] !== z || q[2] !== K) {
        if (w = [], K > 0) w.push("tools");
        if (z > 0) w.push("resources");
        if (Y > 0) w.push("prompts");
        q[0] = Y, q[1] = z, q[2] = K, q[3] = w
    } else w = q[3];
    let H;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) H = vp1.default.createElement(V, {
        bold: !0
    }, "Capabilities: "), q[4] = H;
    else H = q[4];
    let $;
    if (q[5] !== w) $ = w.length > 0 ? vp1.default.createElement(oA, null, w) : "none", q[5] = w, q[6] = $;
    else $ = q[6];
    let O;
    if (q[7] !== $) O = vp1.default.createElement(I, null, H, vp1.default.createElement(V, {
        color: "text"
    }, $)), q[7] = $, q[8] = O;
    else O = q[8];
    return O
}
// @from(Ln 401525, Col 4)
vp1
// @from(Ln 401526, Col 4)
WxA = v(() => {
    i1();
    m1();
    HK();
    vp1 = o(X1(), 1)
})
// @from(Ln 401533, Col 0)
function iaY(A) {
    return A.mode === "url" ? "url" : "form"
}
// @from(Ln 401537, Col 0)
function RV6(A, q, K) {
    A.setRequestHandler(vq1, async (Y, z) => {
        SA(q, `Received elicitation request: ${Q1(Y)}`);
        let w = iaY(Y.params);
        c("tengu_mcp_elicitation_shown", {
            mode: w
        });
        try {
            let H = new Promise(($) => {
                let O = () => {
                    $({
                        action: "cancel"
                    })
                };
                if (z.signal.aborted) {
                    O();
                    return
                }
                K((_) => ({
                    ..._,
                    elicitation: {
                        queue: [..._.elicitation.queue, {
                            serverName: q,
                            params: Y.params,
                            signal: z.signal,
                            respond: (J) => {
                                z.signal.removeEventListener("abort", O), c("tengu_mcp_elicitation_response", {
                                    mode: w,
                                    action: J.action
                                }), $(J)
                            }
                        }]
                    }
                })), z.signal.addEventListener("abort", O)
            });
            return SA(q, `Elicitation response: ${Q1(H)}`), H
        } catch (H) {
            return Kz(q, `Elicitation error: ${H}`), {
                action: "cancel"
            }
        }
    })
}
// @from(Ln 401580, Col 4)
mqq = v(() => {
    gD();
    u6();
    y6();
    m6()
})
// @from(Ln 401587, Col 0)
function Fqq(A) {
    let q = "plugin" in A ? A.plugin : "no-plugin";
    return `${A.type}:${A.source}:${q}`
}
// @from(Ln 401592, Col 0)
function Qqq(A, q) {
    if (q.length === 0) return;
    A((K) => {
        let Y = new Set(K.plugins.errors.map((w) => Fqq(w))),
            z = q.filter((w) => !Y.has(Fqq(w)));
        if (z.length === 0) return K;
        return {
            ...K,
            plugins: {
                ...K.plugins,
                errors: [...K.plugins.errors, ...z]
            }
        }
    })
}
// @from(Ln 401608, Col 0)
function gqq(A, q = !1, K) {
    let Y = v6((M) => M.mcp.clients),
        z = v6((M) => M.mcp.tools),
        w = v6((M) => M.mcp.resources),
        H = v6((M) => M.authVersion),
        $ = L7(),
        O = eZ.useRef(new Map),
        _ = eZ.useCallback(({
            tools: M,
            commands: P,
            resources: W,
            ...G
        }) => {
            if (G.type === "disabled" || G.type === "failed") M = M ?? [], P = P ?? [], W = W ?? [];
            $((f) => {
                let Z = Ql(G.name),
                    T = f.mcp.clients.findIndex((S) => S.name === G.name) === -1 ? [...f.mcp.clients, G] : f.mcp.clients.map((S) => S.name === G.name ? G : S),
                    k = M === void 0 ? f.mcp.tools : [...Cx(f.mcp.tools, (S) => S.name?.startsWith(Z)), ...M],
                    y = P === void 0 ? f.mcp.commands : [...Cx(f.mcp.commands, (S) => S.name?.startsWith(Z)), ...P],
                    B = W === void 0 ? f.mcp.resources : {
                        ...f.mcp.resources,
                        ...W.length > 0 ? {
                            [G.name]: W
                        } : w21(f.mcp.resources, G.name)
                    };
                return {
                    ...f,
                    mcp: {
                        ...f.mcp,
                        clients: T,
                        tools: k,
                        commands: y,
                        resources: B
                    }
                }
            })
        }, [$]),
        J = eZ.useCallback(({
            client: M,
            tools: P,
            commands: W,
            resources: G
        }) => {
            switch (_({
                    ...M,
                    tools: P,
                    commands: W,
                    resources: G
                }), M.type) {
                case "connected": {
                    if (M.client.onclose = () => {
                            let f = M.config.type ?? "stdio";
                            if (Fm(M.name, M.config).catch(() => {
                                    h(`Failed to invalidate the server cache: ${M.name}`)
                                }), dg1(M.name)) {
                                SA(M.name, "Server is disabled, skipping automatic reconnection");
                                return
                            }
                            if (f !== "stdio" && f !== "sdk") {
                                let Z = oaY(f);
                                SA(M.name, `${Z} transport closed/disconnected, attempting automatic reconnection`);
                                let N = O.current.get(M.name);
                                if (N) clearTimeout(N), O.current.delete(M.name);
                                (async () => {
                                    for (let k = 1; k <= WZ1; k++) {
                                        if (dg1(M.name)) {
                                            SA(M.name, "Server disabled during reconnection, stopping retry"), O.current.delete(M.name);
                                            return
                                        }
                                        _({
                                            ...M,
                                            type: "pending",
                                            reconnectAttempt: k,
                                            maxReconnectAttempts: WZ1
                                        });
                                        let y = Date.now();
                                        try {
                                            let S = await Qm(M.name, M.config),
                                                m = Date.now() - y;
                                            if (S.client.type === "connected") {
                                                SA(M.name, `${Z} reconnection successful after ${m}ms (attempt ${k})`), O.current.delete(M.name), J(S);
                                                return
                                            }
                                            if (SA(M.name, `${Z} reconnection attempt ${k} completed with status: ${S.client.type}`), k === WZ1) {
                                                SA(M.name, `Max reconnection attempts (${WZ1}) reached, giving up`), O.current.delete(M.name), J(S);
                                                return
                                            }
                                        } catch (S) {
                                            let m = Date.now() - y;
                                            if (Kz(M.name, `${Z} reconnection attempt ${k} failed after ${m}ms: ${S}`), k === WZ1) {
                                                SA(M.name, `Max reconnection attempts (${WZ1}) reached, giving up`), O.current.delete(M.name), _({
                                                    ...M,
                                                    type: "failed"
                                                });
                                                return
                                            }
                                        }
                                        let B = Math.min(naY * Math.pow(2, k - 1), raY);
                                        SA(M.name, `Scheduling reconnection attempt ${k+1} in ${B}ms`), await new Promise((S) => {
                                            let m = setTimeout(S, B);
                                            O.current.set(M.name, m)
                                        })
                                    }
                                })()
                            } else _({
                                ...M,
                                type: "failed"
                            })
                        }, M.capabilities?.tools?.listChanged) M.client.setNotificationHandler(nOA, async () => {
                        SA(M.name, "Received tools/list_changed notification, refreshing tools");
                        try {
                            let f = wI.cache.get(M);
                            wI.cache.delete(M);
                            let Z = await wI(M),
                                N = Z.length;
                            if (f) f.then((T) => {
                                c("tengu_mcp_list_changed", {
                                    type: "tools",
                                    previousCount: T.length,
                                    newCount: N
                                })
                            }, () => {
                                c("tengu_mcp_list_changed", {
                                    type: "tools",
                                    newCount: N
                                })
                            });
                            else c("tengu_mcp_list_changed", {
                                type: "tools",
                                newCount: N
                            });
                            _({
                                ...M,
                                tools: Z
                            })
                        } catch (f) {
                            Kz(M.name, `Failed to refresh tools after list_changed notification: ${f instanceof Error?f.message:String(f)}`)
                        }
                    });
                    if (M.capabilities?.prompts?.listChanged) M.client.setNotificationHandler(iOA, async () => {
                        SA(M.name, "Received prompts/list_changed notification, refreshing prompts"), c("tengu_mcp_list_changed", {
                            type: "prompts"
                        });
                        try {
                            HU1.cache.delete(M);
                            let f = await HU1(M);
                            _({
                                ...M,
                                commands: f
                            })
                        } catch (f) {
                            Kz(M.name, `Failed to refresh prompts after list_changed notification: ${f instanceof Error?f.message:String(f)}`)
                        }
                    });
                    if (M.capabilities?.resources?.listChanged) M.client.setNotificationHandler(gOA, async () => {
                        SA(M.name, "Received resources/list_changed notification, refreshing resources"), c("tengu_mcp_list_changed", {
                            type: "resources"
                        });
                        try {
                            wU1.cache.delete(M);
                            let f = await wU1(M);
                            _({
                                ...M,
                                resources: f
                            })
                        } catch (f) {
                            Kz(M.name, `Failed to refresh resources after list_changed notification: ${f instanceof Error?f.message:String(f)}`)
                        }
                    });
                    break
                }
                case "needs-auth":
                case "failed":
                case "pending":
                case "disabled":
                case "proxy":
                    break
            }
        }, [_]),
        X = U6();
    eZ.useEffect(() => {
        async function M() {
            let {
                servers: P,
                errors: W
            } = q ? {
                servers: {},
                errors: []
            } : await zG1(), G = {
                ...P,
                ...A
            };
            Qqq($, W), $((f) => {
                let Z = new Set(f.mcp.clients.map((T) => T.name)),
                    N = Object.entries(G).filter(([T]) => !Z.has(T)).map(([T, k]) => ({
                        name: T,
                        type: "pending",
                        config: k
                    }));
                if (N.length === 0) return f;
                return {
                    ...f,
                    mcp: {
                        ...f.mcp,
                        clients: [...f.mcp.clients, ...N]
                    }
                }
            })
        }
        M().catch((P) => {
            Kz("useManageMCPConnections", `Failed to initialize servers as pending: ${P instanceof Error?P.message:String(P)}`)
        })
    }, [q, A, $, X]), eZ.useEffect(() => {
        let M = !1;
        async function P() {
            En4();
            let {
                servers: W,
                errors: G
            } = q ? {
                servers: {},
                errors: []
            } : await zG1();
            if (M) return;
            Qqq($, G);
            let f = {
                ...W,
                ...A
            };
            sG6(J, f).catch((k) => {
                Kz("useManageMcpConnections", `Failed to get MCP resources: ${k instanceof Error?k.message:String(k)}`)
            });
            let Z = {};
            if (!q) {
                if (Z = await Qg1(), M) return;
                if (Object.keys(Z).length > 0) $((k) => {
                    let y = new Set(k.mcp.clients.map((S) => S.name)),
                        B = Object.entries(Z).filter(([S]) => !y.has(S)).map(([S, m]) => ({
                            name: S,
                            type: "pending",
                            config: m
                        }));
                    if (B.length === 0) return k;
                    return {
                        ...k,
                        mcp: {
                            ...k.mcp,
                            clients: [...k.mcp.clients, ...B]
                        }
                    }
                }), sG6(J, Z).catch((k) => {
                    Kz("useManageMcpConnections", `Failed to get claude.ai MCP resources: ${k instanceof Error?k.message:String(k)}`)
                })
            }
            let N = {
                    ...f,
                    ...Z
                },
                T = {
                    enterprise: 0,
                    global: 0,
                    project: 0,
                    user: 0,
                    plugin: 0,
                    claudeai: 0
                };
            for (let k of Object.values(N))
                if (k.scope === "enterprise") T.enterprise++;
                else if (k.scope === "user") T.global++;
            else if (k.scope === "project") T.project++;
            else if (k.scope === "local") T.user++;
            else if (k.scope === "dynamic") T.plugin++;
            else if (k.scope === "claudeai") T.claudeai++;
            c("tengu_mcp_servers", T)
        }
        return P(), () => {
            M = !0
        }
    }, [q, A, J, X, H, $]), eZ.useEffect(() => {
        let M = O.current;
        return () => {
            for (let P of M.values()) clearTimeout(P);
            M.clear()
        }
    }, []), eZ.useEffect(() => {
        if (xq1()) {
            for (let M of Y)
                if (M.type === "connected") RV6(M.client, M.name, $)
        }
    }, [Y, $]), eZ.useEffect(() => K?.updateClients(Y), [K, Y]), eZ.useEffect(() => K?.updateTools(z), [K, z]), eZ.useEffect(() => K?.updateResources(w), [K, w]);
    let D = eZ.useCallback(async (M) => {
            let P = Y.find((f) => f.name === M);
            if (!P) throw Error(`MCP server ${M} not found`);
            let W = O.current.get(M);
            if (W) clearTimeout(W), O.current.delete(M);
            let G = await Qm(M, P.config);
            if (xq1()) {
                if (G.client.type === "connected") RV6(G.client.client, G.client.name, $)
            }
            return J(G), G
        }, [Y, J, $]),
        j = eZ.useCallback(async (M) => {
            let P = Y.find((G) => G.name === M);
            if (!P) throw Error(`MCP server ${M} not found`);
            if (P.type !== "disabled") {
                let G = O.current.get(M);
                if (G) clearTimeout(G), O.current.delete(M);
                if (wG1(M, !1), P.type === "connected") await Fm(M, P.config);
                _({
                    name: M,
                    type: "disabled",
                    config: P.config
                })
            } else {
                wG1(M, !0), _({
                    name: M,
                    type: "pending",
                    config: P.config
                });
                let G = await Qm(M, P.config);
                if (xq1()) {
                    if (G.client.type === "connected") RV6(G.client.client, G.client.name, $)
                }
                J(G)
            }
        }, [Y, _, J, $]);
    return {
        reconnectMcpServer: D,
        toggleMcpServer: j
    }
}
// @from(Ln 401940, Col 0)
function oaY(A) {
    switch (A) {
        case "http":
            return "HTTP";
        case "ws":
        case "ws-ide":
            return "WebSocket";
        default:
            return "SSE"
    }
}
// @from(Ln 401951, Col 4)
eZ
// @from(Ln 401951, Col 8)
WZ1 = 5
// @from(Ln 401952, Col 4)
naY = 1000
// @from(Ln 401953, Col 4)
raY = 30000
// @from(Ln 401954, Col 4)
Uqq = v(() => {
    B6();
    SW();
    y6();
    gD();
    d8();
    dR6();
    cR6();
    nW();
    uyA();
    _T();
    Z6();
    u6();
    mqq();
    qXA();
    eZ = o(X1(), 1)
})
// @from(Ln 401972, Col 0)
function GZ1() {
    let A = R91.useContext(GxA);
    if (!A) throw Error("useMcpReconnect must be used within MCPConnectionManager");
    return A.reconnectMcpServer
}
// @from(Ln 401978, Col 0)
function Xe() {
    let A = R91.useContext(GxA);
    if (!A) throw Error("useMcpToggleEnabled must be used within MCPConnectionManager");
    return A.toggleMcpServer
}
// @from(Ln 401984, Col 0)
function yV6(A) {
    let q = e(6),
        {
            children: K,
            dynamicMcpConfig: Y,
            isStrictMcpConfig: z,
            mcpCliEndpoint: w
        } = A,
        {
            reconnectMcpServer: H,
            toggleMcpServer: $
        } = gqq(Y, z, w),
        O;
    if (q[0] !== H || q[1] !== $) O = {
        reconnectMcpServer: H,
        toggleMcpServer: $
    }, q[0] = H, q[1] = $, q[2] = O;
    else O = q[2];
    let _ = O,
        J;
    if (q[3] !== K || q[4] !== _) J = R91.default.createElement(GxA.Provider, {
        value: _
    }, K), q[3] = K, q[4] = _, q[5] = J;
    else J = q[5];
    return J
}
// @from(Ln 402010, Col 4)
R91
// @from(Ln 402010, Col 9)
GxA
// @from(Ln 402011, Col 4)
De = v(() => {
    i1();
    Uqq();
    R91 = o(X1(), 1), GxA = R91.createContext(null)
})
// @from(Ln 402017, Col 0)
function CV6(A, q) {
    switch (A.client.type) {
        case "connected":
            return {
                message: `Reconnected to ${q}.`, success: !0
            };
        case "needs-auth":
            return {
                message: `${q} requires authentication. Use the 'Authenticate' option.`, success: !1
            };
        case "failed":
            return {
                message: `Failed to reconnect to ${q}.`, success: !1
            };
        default:
            return {
                message: `Unknown result when reconnecting to ${q}.`, success: !1
            }
    }
}
// @from(Ln 402038, Col 0)
function Ep1(A, q) {
    let K = A instanceof Error ? A.message : String(A);
    return `Error reconnecting to ${q}: ${K}`
}
// @from(Ln 402043, Col 0)
function kp1({
    server: A,
    serverToolsCount: q,
    onViewTools: K,
    onCancel: Y,
    onComplete: z,
    borderless: w = !1
}) {
    let [H] = T7(), $ = uq(), O = v6((G) => G.mcp), _ = GZ1(), J = Xe(), [X, D] = $3.useState(!1), j = $3.default.useCallback(async () => {
        let G = A.client.type !== "disabled";
        try {
            await J(A.name), Y()
        } catch (f) {
            z(`Failed to ${G?"disable":"enable"} MCP server '${A.name}': ${f instanceof Error?f.message:String(f)}`)
        }
    }, [A.client.type, A.name, J, Y, z]), M = String(A.name).charAt(0).toUpperCase() + String(A.name).slice(1), P = ZG6(O.commands, A.name).length, W = [];
    if (A.client.type !== "disabled" && q > 0) W.push({
        label: "View tools",
        value: "tools"
    });
    if (A.client.type !== "disabled") W.push({
        label: "Reconnect",
        value: "reconnectMcpServer"
    });
    if (W.push({
            label: A.client.type !== "disabled" ? "Disable" : "Enable",
            value: "toggle-enabled"
        }), W.length === 0) W.push({
        label: "Back",
        value: "back"
    });
    if (X) return $3.default.createElement(I, {
        flexDirection: "column",
        gap: 1,
        padding: 1
    }, $3.default.createElement(V, {
        color: "text"
    }, "Reconnecting to ", $3.default.createElement(V, {
        bold: !0
    }, A.name)), $3.default.createElement(I, null, $3.default.createElement(c4, null), $3.default.createElement(V, null, " Restarting MCP server process")), $3.default.createElement(V, {
        dimColor: !0
    }, "This may take a few moments."));
    return $3.default.createElement(I, {
        flexDirection: "column"
    }, $3.default.createElement(I, {
        flexDirection: "column",
        paddingX: 1,
        borderStyle: w ? void 0 : "round"
    }, $3.default.createElement(I, {
        marginBottom: 1
    }, $3.default.createElement(V, {
        bold: !0
    }, M, " MCP Server")), $3.default.createElement(I, {
        flexDirection: "column",
        gap: 0
    }, $3.default.createElement(I, null, $3.default.createElement(V, {
        bold: !0
    }, "Status: "), A.client.type === "disabled" ? $3.default.createElement(V, null, k8("inactive", H)(l1.radioOff), " disabled") : A.client.type === "connected" ? $3.default.createElement(V, null, k8("success", H)(l1.tick), " connected") : A.client.type === "pending" ? $3.default.createElement($3.default.Fragment, null, $3.default.createElement(V, {
        dimColor: !0
    }, l1.radioOff), $3.default.createElement(V, null, " connecting…")) : $3.default.createElement(V, null, k8("error", H)(l1.cross), " failed")), $3.default.createElement(I, null, $3.default.createElement(V, {
        bold: !0
    }, "Command: "), $3.default.createElement(V, {
        dimColor: !0
    }, A.config.command)), A.config.args && A.config.args.length > 0 && $3.default.createElement(I, null, $3.default.createElement(V, {
        bold: !0
    }, "Args: "), $3.default.createElement(V, {
        dimColor: !0
    }, A.config.args.join(" "))), $3.default.createElement(I, null, $3.default.createElement(V, {
        bold: !0
    }, "Config location: "), $3.default.createElement(V, {
        dimColor: !0
    }, KG(lR(A.name)?.scope ?? "dynamic"))), A.client.type === "connected" && $3.default.createElement(LV6, {
        serverToolsCount: q,
        serverPromptsCount: P,
        serverResourcesCount: O.resources[A.name]?.length || 0
    }), A.client.type === "connected" && q > 0 && $3.default.createElement(I, null, $3.default.createElement(V, {
        bold: !0
    }, "Tools: "), $3.default.createElement(V, {
        dimColor: !0
    }, q, " tools"))), W.length > 0 && $3.default.createElement(I, {
        marginTop: 1
    }, $3.default.createElement(kA, {
        options: W,
        onChange: async (G) => {
            if (G === "tools") K();
            else if (G === "reconnectMcpServer") {
                D(!0);
                try {
                    let f = await _(A.name),
                        {
                            message: Z
                        } = CV6(f, A.name);
                    z?.(Z)
                } catch (f) {
                    z?.(Ep1(f, A.name))
                } finally {
                    D(!1)
                }
            } else if (G === "toggle-enabled") await j();
            else if (G === "back") Y()
        },
        onCancel: Y
    }))), $3.default.createElement(I, {
        marginTop: 1
    }, $3.default.createElement(V, {
        dimColor: !0,
        italic: !0
    }, $.pending ? $3.default.createElement($3.default.Fragment, null, "Press ", $.keyName, " again to exit") : $3.default.createElement(oA, null, $3.default.createElement(YA, {
        shortcut: "↑↓",
        action: "navigate"
    }), $3.default.createElement(YA, {
        shortcut: "Enter",
        action: "select"
    }), $3.default.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "back"
    })))))
}
// @from(Ln 402163, Col 4)
$3
// @from(Ln 402164, Col 4)
SV6 = v(() => {
    m1();
    wY();
    R2();
    HK();
    wK();
    BK();
    b7();
    d8();
    tX();
    nW();
    WxA();
    De();
    x2();
    $3 = o(X1(), 1)
})
// @from(Ln 402181, Col 0)
function y91({
    server: A,
    serverToolsCount: q,
    onViewTools: K,
    onCancel: Y,
    onComplete: z,
    borderless: w = !1
}) {
    let [H] = T7(), $ = uq(), [O, _] = z8.default.useState(!1), [J, X] = z8.default.useState(null), D = v6((a) => a.mcp), j = L7(), [M, P] = z8.default.useState(null), [W, G] = z8.useState(!1), [f, Z] = z8.useState(null), [N, T] = z8.useState(!1), [k, y] = z8.useState(null), [B, S] = z8.useState(!1), [m, b] = z8.useState(null), [g, U] = z8.useState(!1), [x, p] = z8.useState(!1), l = A.isAuthenticated || A.client.type === "connected" && q > 0, r = GZ1(), s = z8.default.useCallback(async () => {
        T(!1), y(null), G(!0);
        try {
            let a = await r(A.name),
                A1 = a.client.type === "connected";
            if (c("tengu_claudeai_mcp_auth_completed", {
                    success: A1
                }), A1) z?.(`Authentication successful. Connected to ${A.name}.`);
            else if (a.client.type === "needs-auth") z?.("Authentication successful, but server still requires authentication. You may need to manually restart Claude Code.");
            else z?.("Authentication successful, but server reconnection failed. You may need to manually restart Claude Code for the changes to take effect.")
        } catch (a) {
            c("tengu_claudeai_mcp_auth_completed", {
                success: !1
            }), z?.(Ep1(a, A.name))
        } finally {
            G(!1)
        }
    }, [r, A.name, z]), O1 = z8.default.useCallback(async () => {
        await Fm(A.name, {
            ...A.config,
            scope: A.scope
        }), j((a) => {
            let A1 = a.mcp.clients.map((_1) => _1.name === A.name ? {
                    ..._1,
                    type: "needs-auth"
                } : _1),
                M1 = QyA(a.mcp.tools, A.name),
                z1 = gyA(a.mcp.commands, A.name),
                Y1 = UyA(a.mcp.resources, A.name);
            return {
                ...a,
                mcp: {
                    clients: A1,
                    tools: M1,
                    commands: z1,
                    resources: Y1
                }
            }
        }), c("tengu_claudeai_mcp_clear_auth_completed", {}), z?.(`Disconnected from ${A.name}.`), S(!1), b(null), U(!1)
    }, [A.name, A.config, A.scope, j, z]);
    DA("confirm:no", () => {
        if (f) f.abort();
        _(!1), P(null), Z(null)
    }, {
        context: "Confirmation",
        isActive: O
    }), DA("confirm:no", () => {
        T(!1), y(null)
    }, {
        context: "Confirmation",
        isActive: N
    }), DA("confirm:no", () => {
        S(!1), b(null), U(!1)
    }, {
        context: "Confirmation",
        isActive: B
    }), D8((a, A1) => {
        if (A1.return && N) s();
        if (A1.return && B)
            if (g) O1();
            else {
                let M1 = P4(),
                    Y1 = `${new URL(M1.CLAUDE_AI_AUTHORIZE_URL).origin}/settings/connectors`;
                b(Y1), U(!0), zY(Y1)
            } if (a === "c" && !x) {
            let M1 = M || k || m;
            if (M1) l0(M1).then((z1) => {
                if (z1) p(!0), setTimeout(() => p(!1), 2000)
            })
        }
    });
    let T1 = String(A.name).charAt(0).toUpperCase() + String(A.name).slice(1),
        N1 = ZG6(D.commands, A.name).length,
        j1 = Xe(),
        q1 = z8.default.useCallback(async () => {
            let a = P4(),
                A1 = new URL(a.CLAUDE_AI_AUTHORIZE_URL).origin,
                z1 = u3()?.organizationUuid,
                Y1;
            if (z1 && A.config.type === "claudeai-proxy" && A.config.id) {
                let _1 = A.config.id.startsWith("mcprs") ? "mcpsrv" + A.config.id.slice(5) : A.config.id;
                Y1 = `${A1}/api/organizations/${z1}/mcp/start-auth/${_1}`
            } else Y1 = `${A1}/settings/connectors`;
            y(Y1), T(!0), c("tengu_claudeai_mcp_auth_started", {}), await zY(Y1)
        }, [A.config]),
        t = z8.default.useCallback(() => {
            S(!0), c("tengu_claudeai_mcp_clear_auth_started", {})
        }, []),
        J1 = z8.default.useCallback(async () => {
            let a = A.client.type !== "disabled";
            try {
                if (await j1(A.name), A.config.type === "claudeai-proxy") c("tengu_claudeai_mcp_toggle", {
                    new_state: a ? "disabled" : "enabled"
                });
                Y()
            } catch (A1) {
                z?.(`Failed to ${a?"disable":"enable"} MCP server '${A.name}': ${A1 instanceof Error?A1.message:String(A1)}`)
            }
        }, [A.client.type, A.config.type, A.name, j1, Y, z]),
        D1 = z8.default.useCallback(async () => {
            if (A.config.type === "claudeai-proxy") return;
            _(!0), X(null);
            let a = new AbortController;
            Z(a);
            try {
                if (A.isAuthenticated && A.config) await YCA(A.name, A.config);
                if (A.config) {
                    await xG6(A.name, A.config, P, a.signal), c("tengu_mcp_auth_config_authenticate", {
                        wasAuthenticated: A.isAuthenticated
                    });
                    let A1 = await r(A.name);
                    if (A1.client.type === "connected") {
                        let M1 = l ? `Authentication successful. Reconnected to ${A.name}.` : `Authentication successful. Connected to ${A.name}.`;
                        z?.(M1)
                    } else if (A1.client.type === "needs-auth") z?.("Authentication successful, but server still requires authentication. You may need to manually restart Claude Code.");
                    else SA(A.name, "Reconnection failed after authentication"), z?.("Authentication successful, but server reconnection failed. You may need to manually restart Claude Code for the changes to take effect.")
                }
            } catch (A1) {
                if (A1 instanceof Error && !(A1 instanceof OG1)) X(A1.message)
            } finally {
                _(!1), Z(null)
            }
        }, [A.isAuthenticated, A.config, A.name, z, r, l]),
        Z1 = async () => {
            if (A.config.type === "claudeai-proxy") return;
            if (A.config) await YCA(A.name, A.config), c("tengu_mcp_auth_config_clear", {}), await Fm(A.name, {
                ...A.config,
                scope: A.scope
            }), j((a) => {
                let A1 = a.mcp.clients.map((_1) => _1.name === A.name ? {
                        ..._1,
                        type: "failed"
                    } : _1),
                    M1 = QyA(a.mcp.tools, A.name),
                    z1 = gyA(a.mcp.commands, A.name),
                    Y1 = UyA(a.mcp.resources, A.name);
                return {
                    ...a,
                    mcp: {
                        clients: A1,
                        tools: M1,
                        commands: z1,
                        resources: Y1
                    }
                }
            }), z?.(`Authentication cleared for ${A.name}.`)
        };
    if (O) return z8.default.createElement(I, {
        flexDirection: "column",
        gap: 1,
        padding: 1
    }, z8.default.createElement(V, {
        color: "claude"
    }, "Authenticating with ", A.name, "…"), z8.default.createElement(I, null, z8.default.createElement(c4, null), z8.default.createElement(V, null, " A browser window will open for authentication")), M && z8.default.createElement(I, {
        flexDirection: "column"
    }, z8.default.createElement(I, null, z8.default.createElement(V, {
        dimColor: !0
    }, "If your browser doesn't open automatically, copy this URL manually", " "), x ? z8.default.createElement(V, {
        color: "success"
    }, "(Copied!)") : z8.default.createElement(V, {
        dimColor: !0
    }, z8.default.createElement(YA, {
        shortcut: "c",
        action: "copy",
        parens: !0
    }))), z8.default.createElement(d7, {
        url: M
    })), z8.default.createElement(I, {
        marginLeft: 3
    }, z8.default.createElement(V, {
        dimColor: !0
    }, "Return here after authenticating in your browser. Press Esc to go back.")));
    if (N) return z8.default.createElement(I, {
        flexDirection: "column",
        gap: 1,
        padding: 1
    }, z8.default.createElement(V, {
        color: "claude"
    }, "Authenticating with ", A.name, "…"), z8.default.createElement(I, null, z8.default.createElement(c4, null), z8.default.createElement(V, null, " A browser window will open for authentication")), k && z8.default.createElement(I, {
        flexDirection: "column"
    }, z8.default.createElement(I, null, z8.default.createElement(V, {
        dimColor: !0
    }, "If your browser doesn't open automatically, copy this URL manually", " "), x ? z8.default.createElement(V, {
        color: "success"
    }, "(Copied!)") : z8.default.createElement(V, {
        dimColor: !0
    }, z8.default.createElement(YA, {
        shortcut: "c",
        action: "copy",
        parens: !0
    }))), z8.default.createElement(d7, {
        url: k
    })), z8.default.createElement(I, {
        marginLeft: 3,
        flexDirection: "column"
    }, z8.default.createElement(V, {
        color: "permission"
    }, "Press ", z8.default.createElement(V, {
        bold: !0
    }, "Enter"), " after authenticating in your browser."), z8.default.createElement(V, {
        dimColor: !0,
        italic: !0
    }, z8.default.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "back"
    }))));
    if (B) return z8.default.createElement(I, {
        flexDirection: "column",
        gap: 1,
        padding: 1
    }, z8.default.createElement(V, {
        color: "claude"
    }, "Clear authentication for ", A.name), g ? z8.default.createElement(z8.default.Fragment, null, z8.default.createElement(V, null, 'Find the MCP server in the browser and click "Disconnect".'), m && z8.default.createElement(I, {
        flexDirection: "column"
    }, z8.default.createElement(I, null, z8.default.createElement(V, {
        dimColor: !0
    }, "If your browser didn't open automatically, copy this URL manually", " "), x ? z8.default.createElement(V, {
        color: "success"
    }, "(Copied!)") : z8.default.createElement(V, {
        dimColor: !0
    }, z8.default.createElement(YA, {
        shortcut: "c",
        action: "copy",
        parens: !0
    }))), z8.default.createElement(d7, {
        url: m
    })), z8.default.createElement(I, {
        marginLeft: 3,
        flexDirection: "column"
    }, z8.default.createElement(V, {
        color: "permission"
    }, "Press ", z8.default.createElement(V, {
        bold: !0
    }, "Enter"), " when done."), z8.default.createElement(V, {
        dimColor: !0,
        italic: !0
    }, z8.default.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "back"
    })))) : z8.default.createElement(z8.default.Fragment, null, z8.default.createElement(V, null, 'This will open claude.ai in the browser. Find the MCP server in the list and click "Disconnect".'), z8.default.createElement(I, {
        marginLeft: 3,
        flexDirection: "column"
    }, z8.default.createElement(V, {
        color: "permission"
    }, "Press ", z8.default.createElement(V, {
        bold: !0
    }, "Enter"), " to open the browser."), z8.default.createElement(V, {
        dimColor: !0,
        italic: !0
    }, z8.default.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "back"
    })))));
    if (W) return z8.default.createElement(I, {
        flexDirection: "column",
        gap: 1,
        padding: 1
    }, z8.default.createElement(V, {
        color: "text"
    }, "Connecting to ", z8.default.createElement(V, {
        bold: !0
    }, A.name), "…"), z8.default.createElement(I, null, z8.default.createElement(c4, null), z8.default.createElement(V, null, " Establishing connection to MCP server")), z8.default.createElement(V, {
        dimColor: !0
    }, "This may take a few moments."));
    let E1 = [];
    if (A.client.type === "disabled") E1.push({
        label: "Enable",
        value: "toggle-enabled"
    });
    if (A.client.type === "connected" && q > 0) E1.push({
        label: "View tools",
        value: "tools"
    });
    if (A.config.type === "claudeai-proxy") {
        if (A.client.type === "connected") E1.push({
            label: "Clear authentication",
            value: "claudeai-clear-auth"
        });
        else if (A.client.type !== "disabled") E1.push({
            label: "Authenticate",
            value: "claudeai-auth"
        })
    } else {
        if (l) E1.push({
            label: "Re-authenticate",
            value: "reauth"
        }), E1.push({
            label: "Clear authentication",
            value: "clear-auth"
        });
        if (!l) E1.push({
            label: "Authenticate",
            value: "auth"
        })
    }
    if (A.client.type !== "disabled") {
        if (A.client.type !== "needs-auth") E1.push({
            label: "Reconnect",
            value: "reconnectMcpServer"
        });
        E1.push({
            label: "Disable",
            value: "toggle-enabled"
        })
    }
    if (E1.length === 0) E1.push({
        label: "Back",
        value: "back"
    });
    return z8.default.createElement(I, {
        flexDirection: "column"
    }, z8.default.createElement(I, {
        flexDirection: "column",
        paddingX: 1,
        borderStyle: w ? void 0 : "round"
    }, z8.default.createElement(I, {
        marginBottom: 1
    }, z8.default.createElement(V, {
        bold: !0
    }, T1, " MCP Server")), z8.default.createElement(I, {
        flexDirection: "column",
        gap: 0
    }, z8.default.createElement(I, null, z8.default.createElement(V, {
        bold: !0
    }, "Status: "), A.client.type === "disabled" ? z8.default.createElement(V, null, k8("inactive", H)(l1.radioOff), " disabled") : A.client.type === "connected" ? z8.default.createElement(V, null, k8("success", H)(l1.tick), " connected") : A.client.type === "pending" ? z8.default.createElement(z8.default.Fragment, null, z8.default.createElement(V, {
        dimColor: !0
    }, l1.radioOff), z8.default.createElement(V, null, " connecting…")) : A.client.type === "needs-auth" ? z8.default.createElement(V, null, k8("warning", H)(l1.triangleUpOutline), " needs authentication") : z8.default.createElement(V, null, k8("error", H)(l1.cross), " failed")), A.transport !== "claudeai-proxy" && z8.default.createElement(I, null, z8.default.createElement(V, {
        bold: !0
    }, "Auth: "), l ? z8.default.createElement(V, null, k8("success", H)(l1.tick), " authenticated") : z8.default.createElement(V, null, k8("error", H)(l1.cross), " not authenticated")), z8.default.createElement(I, null, z8.default.createElement(V, {
        bold: !0
    }, "URL: "), z8.default.createElement(V, {
        dimColor: !0
    }, A.config.url)), z8.default.createElement(I, null, z8.default.createElement(V, {
        bold: !0
    }, "Config location: "), z8.default.createElement(V, {
        dimColor: !0
    }, KG(A.scope))), A.client.type === "connected" && z8.default.createElement(LV6, {
        serverToolsCount: q,
        serverPromptsCount: N1,
        serverResourcesCount: D.resources[A.name]?.length || 0
    }), A.client.type === "connected" && q > 0 && z8.default.createElement(I, null, z8.default.createElement(V, {
        bold: !0
    }, "Tools: "), z8.default.createElement(V, {
        dimColor: !0
    }, q, " tools"))), J && z8.default.createElement(I, {
        marginTop: 1
    }, z8.default.createElement(V, {
        color: "error"
    }, "Error: ", J)), E1.length > 0 && z8.default.createElement(I, {
        marginTop: 1
    }, z8.default.createElement(kA, {
        options: E1,
        onChange: async (a) => {
            switch (a) {
                case "tools":
                    K();
                    break;
                case "auth":
                case "reauth":
                    await D1();
                    break;
                case "clear-auth":
                    await Z1();
                    break;
                case "claudeai-auth":
                    await q1();
                    break;
                case "claudeai-clear-auth":
                    t();
                    break;
                case "reconnectMcpServer":
                    G(!0);
                    try {
                        let A1 = await r(A.name);
                        if (A.config.type === "claudeai-proxy") c("tengu_claudeai_mcp_reconnect", {
                            success: A1.client.type === "connected"
                        });
                        let {
                            message: M1
                        } = CV6(A1, A.name);
                        z?.(M1)
                    } catch (A1) {
                        if (A.config.type === "claudeai-proxy") c("tengu_claudeai_mcp_reconnect", {
                            success: !1
                        });
                        z?.(Ep1(A1, A.name))
                    } finally {
                        G(!1)
                    }
                    break;
                case "toggle-enabled":
                    await J1();
                    break;
                case "back":
                    Y();
                    break
            }
        },
        onCancel: Y
    }))), z8.default.createElement(I, {
        marginTop: 1
    }, z8.default.createElement(V, {
        dimColor: !0,
        italic: !0
    }, $.pending ? z8.default.createElement(z8.default.Fragment, null, "Press ", $.keyName, " again to exit") : z8.default.createElement(oA, null, z8.default.createElement(YA, {
        shortcut: "↑↓",
        action: "navigate"
    }), z8.default.createElement(YA, {
        shortcut: "Enter",
        action: "select"
    }), z8.default.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "back"
    })))))
}
// @from(Ln 402612, Col 4)
z8
// @from(Ln 402613, Col 4)
hV6 = v(() => {
    m1();
    K7();
    wY();
    u6();
    R2();
    HK();
    wK();
    BK();
    b7();
    g51();
    x2();
    SW();
    d8();
    y6();
    tX();
    WxA();
    m1();
    OB();
    De();
    Oj();
    Uz();
    J7();
    z8 = o(X1(), 1)
})
// @from(Ln 402639, Col 0)
function Lp1(A) {
    let q = e(19),
        {
            server: K,
            onSelectTool: Y,
            onBack: z
        } = A,
        w = v6(saY),
        H;
    A: {
        if (K.client.type !== "connected") {
            let P;
            if (q[0] === Symbol.for("react.memo_cache_sentinel")) P = [], q[0] = P;
            else P = q[0];
            H = P;
            break A
        }
        let M;
        if (q[1] !== w || q[2] !== K.name) M = Bm(w, K.name),
        q[1] = w,
        q[2] = K.name,
        q[3] = M;
        else M = q[3];H = M
    }
    let $ = H,
        O;
    if (q[4] !== K.name || q[5] !== $) {
        let M;
        if (q[7] !== K.name) M = (P, W) => {
            let G = Fn1(P.name, K.name),
                f = P.userFacingName ? P.userFacingName({}) : G,
                Z = Qn1(f),
                N = P.isReadOnly?.({}) ?? !1,
                T = P.isDestructive?.({}) ?? !1,
                k = P.isOpenWorld?.({}) ?? !1,
                y = [];
            if (N) y.push("read-only");
            if (T) y.push("destructive");
            if (k) y.push("open-world");
            return {
                label: Z,
                value: W.toString(),
                description: y.length > 0 ? y.join(", ") : void 0,
                descriptionColor: T ? "error" : N ? "success" : void 0
            }
        }, q[7] = K.name, q[8] = M;
        else M = q[8];
        O = $.map(M), q[4] = K.name, q[5] = $, q[6] = O
    } else O = q[6];
    let _ = O,
        J = `Tools for ${K.name}`,
        X = `${$.length} tool${$.length===1?"":"s"}`,
        D;
    if (q[9] !== z || q[10] !== Y || q[11] !== $ || q[12] !== _) D = $.length === 0 ? Dc.default.createElement(V, {
        dimColor: !0
    }, "No tools available") : Dc.default.createElement(kA, {
        options: _,
        onChange: (M) => {
            let P = parseInt(M),
                W = $[P];
            if (W) Y(W, P)
        },
        onCancel: z
    }), q[9] = z, q[10] = Y, q[11] = $, q[12] = _, q[13] = D;
    else D = q[13];
    let j;
    if (q[14] !== z || q[15] !== J || q[16] !== X || q[17] !== D) j = Dc.default.createElement(w8, {
        title: J,
        subtitle: X,
        onCancel: z,
        inputGuide: aaY
    }, D), q[14] = z, q[15] = J, q[16] = X, q[17] = D, q[18] = j;
    else j = q[18];
    return j
}