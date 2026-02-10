
// @from(Ln 489988, Col 0)
async function PGz(A, q) {
    if (q.cowork) $T(!0);
    c("tengu_plugin_update_command", {});
    let K = "user";
    if (q.scope) {
        if (!h91.includes(q.scope)) process.stderr.write(`Invalid scope "${q.scope}". Valid scopes: ${h91.join(", ")}
`), process.exit(1);
        K = q.scope
    }
    if (q.cowork && K !== "user") console.error("--cowork can only be used with user scope"), process.exit(1);
    await EDq(A, K)
}
// @from(Ln 490000, Col 4)
Sy = v(() => {
    b7();
    m6();
    u6();
    y6();
    mxA();
    p$();
    Xa();
    mM();
    tR();
    mV6();
    TxA();
    eFA();
    mM();
    VJ();
    UO6();
    B6()
})
// @from(Ln 490018, Col 4)
IRq = {}
// @from(Ln 490029, Col 0)
function ZGz() {
    let A = xA.platform === "win32",
        q = WGz();
    if (A) return GGz(q, ".local", "bin", "claude.exe").replace(/\//g, "\\");
    return "~/.local/bin/claude"
}
// @from(Ln 490036, Col 0)
function hRq(A) {
    let q = e(5),
        {
            messages: K
        } = A;
    if (K.length === 0) return null;
    let Y;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = v9.default.createElement(I, null, v9.default.createElement(V, {
        color: "warning"
    }, v9.default.createElement(ZE, {
        status: "warning",
        withSpace: !0
    }), "Setup notes:")), q[0] = Y;
    else Y = q[0];
    let z;
    if (q[1] !== K) z = K.map(fGz), q[1] = K, q[2] = z;
    else z = q[2];
    let w;
    if (q[3] !== z) w = v9.default.createElement(I, {
        flexDirection: "column",
        gap: 0,
        marginBottom: 1
    }, Y, z), q[3] = z, q[4] = w;
    else w = q[4];
    return w
}
// @from(Ln 490063, Col 0)
function fGz(A, q) {
    return v9.default.createElement(I, {
        key: q,
        marginLeft: 2
    }, v9.default.createElement(V, {
        dimColor: !0
    }, "• ", A))
}
// @from(Ln 490072, Col 0)
function VGz({
    onDone: A,
    force: q,
    target: K
}) {
    let [Y, z] = Hl1.useState({
        type: "checking"
    });
    return Hl1.useEffect(() => {
        async function w() {
            try {
                h(`Install: Starting installation process (force=${q}, target=${K})`);
                let H = K || l4()?.autoUpdatesChannel || "latest";
                z({
                    type: "installing",
                    version: H
                }), h(`Install: Calling installLatest(channelOrVersion=${H}, forceReinstall=${q})`);
                let $ = await _c(H, q);
                if (h(`Install: installLatest returned version=${$.latestVersion}, wasUpdated=${$.wasUpdated}, lockFailed=${$.lockFailed}`), $.lockFailed) throw Error("Could not install - another process is currently installing Claude. Please try again in a moment.");
                if (!$.latestVersion) h("Install: Failed to retrieve version information during install", {
                    level: "error"
                });
                if (!$.wasUpdated) h("Install: Already up to date");
                z({
                    type: "setting-up"
                });
                let O = await tm(!0);
                if (h(`Install: Setup launcher completed with ${O.length} messages`), O.length > 0) O.forEach((M) => h(`Install: Setup message: ${M.message}`));
                h("Install: Cleaning up npm installations after successful install");
                let {
                    removed: _,
                    errors: J,
                    warnings: X
                } = await Xp1();
                if (_ > 0) h(`Cleaned up ${_} npm installation(s)`);
                if (J.length > 0) h(`Cleanup errors: ${J.join(", ")}`);
                let D = Jp1();
                if (D.length > 0) h(`Shell alias cleanup: ${D.map((M)=>M.message).join("; ")}`);
                if (c("tengu_claude_install_command", {
                        has_version: $.latestVersion ? 1 : 0,
                        forced: q ? 1 : 0
                    }), K === "latest" || K === "stable") Z7("userSettings", {
                    autoUpdatesChannel: K
                }), h(`Install: Saved autoUpdatesChannel=${K} to user settings`);
                let j = [...X, ...D.map((M) => M.message)];
                if (O.length > 0) z({
                    type: "set-up",
                    messages: O.map((M) => M.message)
                }), setTimeout(() => {
                    z({
                        type: "success",
                        version: $.latestVersion || "current",
                        setupMessages: [...O.map((M) => M.message), ...j]
                    })
                }, 2000);
                else h("Install: Shell PATH already configured"), z({
                    type: "success",
                    version: $.latestVersion || "current",
                    setupMessages: j.length > 0 ? j : void 0
                })
            } catch (H) {
                h(`Install command failed: ${H}`, {
                    level: "error"
                }), z({
                    type: "error",
                    message: H instanceof Error ? H.message : String(H)
                })
            }
        }
        w()
    }, [q, K]), Hl1.useEffect(() => {
        if (Y.type === "success") setTimeout(() => {
            A("Claude Code installation completed successfully", {
                display: "system"
            })
        }, 2000);
        else if (Y.type === "error") setTimeout(() => {
            A("Claude Code installation failed", {
                display: "system"
            })
        }, 3000)
    }, [Y, A]), v9.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, Y.type === "checking" && v9.default.createElement(V, {
        color: "claude"
    }, "Checking installation status..."), Y.type === "cleaning-npm" && v9.default.createElement(V, {
        color: "warning"
    }, "Cleaning up old npm installations..."), Y.type === "installing" && v9.default.createElement(V, {
        color: "claude"
    }, "Installing Claude Code native build ", Y.version, "..."), Y.type === "setting-up" && v9.default.createElement(V, {
        color: "claude"
    }, "Setting up launcher and shell integration..."), Y.type === "set-up" && v9.default.createElement(hRq, {
        messages: Y.messages
    }), Y.type === "success" && v9.default.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, v9.default.createElement(I, null, v9.default.createElement(ZE, {
        status: "success",
        withSpace: !0
    }), v9.default.createElement(V, {
        color: "success",
        bold: !0
    }, "Claude Code successfully installed!")), v9.default.createElement(I, {
        marginLeft: 2,
        flexDirection: "column",
        gap: 1
    }, Y.version !== "current" && v9.default.createElement(I, null, v9.default.createElement(V, {
        dimColor: !0
    }, "Version: "), v9.default.createElement(V, {
        color: "claude"
    }, Y.version)), v9.default.createElement(I, null, v9.default.createElement(V, {
        dimColor: !0
    }, "Location: "), v9.default.createElement(V, {
        color: "text"
    }, ZGz()))), v9.default.createElement(I, {
        marginLeft: 2,
        flexDirection: "column",
        gap: 1
    }, v9.default.createElement(I, {
        marginTop: 1
    }, v9.default.createElement(V, {
        dimColor: !0
    }, "Next: Run "), v9.default.createElement(V, {
        color: "claude",
        bold: !0
    }, "claude --help"), v9.default.createElement(V, {
        dimColor: !0
    }, " to get started"))), Y.setupMessages && v9.default.createElement(hRq, {
        messages: Y.setupMessages
    })), Y.type === "error" && v9.default.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, v9.default.createElement(I, null, v9.default.createElement(ZE, {
        status: "error",
        withSpace: !0
    }), v9.default.createElement(V, {
        color: "error"
    }, "Installation failed")), v9.default.createElement(V, {
        color: "error"
    }, Y.message), v9.default.createElement(I, {
        marginTop: 1
    }, v9.default.createElement(V, {
        dimColor: !0
    }, "Try running with --force to override checks"))))
}
// @from(Ln 490218, Col 4)
v9
// @from(Ln 490218, Col 8)
Hl1
// @from(Ln 490218, Col 13)
NGz
// @from(Ln 490219, Col 4)
xRq = v(() => {
    i1();
    m1();
    m1();
    BI();
    Z6();
    u6();
    p8();
    iV6();
    G5();
    v9 = o(X1(), 1), Hl1 = o(X1(), 1);
    NGz = {
        type: "local-jsx",
        name: "install",
        description: "Install Claude Code native build",
        argumentHint: "[options]",
        async call(A, q, K) {
            let Y = K.includes("--force"),
                w = K.filter(($) => !$.startsWith("--"))[0],
                {
                    unmount: H
                } = await _Z(v9.default.createElement(VGz, {
                    onDone: ($, O) => {
                        H(), A($, O)
                    },
                    force: Y,
                    target: w
                }))
        }
    }
})
// @from(Ln 490250, Col 4)
FE6 = {}
// @from(Ln 490259, Col 0)
async function vGz() {
    c("tengu_setup_token_command", {}), await AR7();
    let A = !MV(),
        {
            ConsoleOAuthFlow: q
        } = await Promise.resolve().then(() => (sF1(), iC4));
    await new Promise(async (K) => {
        let {
            unmount: Y
        } = await _Z(kP.default.createElement(u_, {
            onChangeAppState: K11
        }, kP.default.createElement(dX, null, kP.default.createElement(I, {
            flexDirection: "column",
            gap: 1
        }, kP.default.createElement(Jv6, null), A && kP.default.createElement(I, {
            flexDirection: "column"
        }, kP.default.createElement(V, {
            color: "warning"
        }, "Warning: You already have authentication configured via environment variable or API key helper."), kP.default.createElement(V, {
            color: "warning"
        }, "The setup-token command will create a new OAuth token which you can use instead.")), kP.default.createElement(q, {
            onDone: () => {
                Y(), K()
            },
            mode: "setup-token",
            startingMessage: "This will guide you through long-lived (1-year) auth token setup for your Claude account. Claude subscription required."
        })))))
    }), process.exit(0)
}
// @from(Ln 490289, Col 0)
function kGz(A) {
    let q = e(2),
        {
            onDone: K
        } = A;
    GE6();
    let Y;
    if (q[0] !== K) Y = kP.default.createElement(kP.default.Suspense, {
        fallback: null
    }, kP.default.createElement(EGz, {
        onDone: K
    })), q[0] = K, q[1] = Y;
    else Y = q[1];
    return Y
}
// @from(Ln 490304, Col 0)
async function LGz() {
    c("tengu_doctor_command", {}), await new Promise(async (A) => {
        let {
            unmount: q
        } = await _Z(kP.default.createElement(u_, null, kP.default.createElement(dX, null, kP.default.createElement(yV6, {
            dynamicMcpConfig: void 0,
            isStrictMcpConfig: !1
        }, kP.default.createElement(kGz, {
            onDone: () => {
                q(), A()
            }
        })))), js(!1))
    }), process.exit(0)
}
// @from(Ln 490318, Col 0)
async function RGz(A, q) {
    let {
        setup: K
    } = await Promise.resolve().then(() => (jv6(), Dv6));
    await K(TGz(), "default", !1, !1, void 0, !1);
    let {
        install: Y
    } = await Promise.resolve().then(() => (xRq(), IRq));
    await new Promise((z) => {
        let w = [];
        if (A) w.push(A);
        if (q.force) w.push("--force");
        Y.call((H) => {
            z(), process.exit(H.includes("failed") ? 1 : 0)
        }, {}, w)
    })
}
// @from(Ln 490335, Col 4)
kP
// @from(Ln 490335, Col 8)
EGz
// @from(Ln 490336, Col 4)
QE6 = v(() => {
    i1();
    m1();
    Hm1();
    d8();
    qd();
    De();
    TQA();
    Av6();
    tgA();
    u6();
    J7();
    w01();
    kP = o(X1(), 1);
    EGz = kP.default.lazy(() => Promise.resolve().then(() => (wxA(), U7q)).then((A) => ({
        default: A.Doctor
    })))
})
// @from(Ln 490354, Col 4)
bRq = {}
// @from(Ln 490358, Col 0)
async function yGz() {
    c("tengu_update_check", {}), Q4(`Current version: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.VERSION}
`);
    let A = l4()?.autoUpdatesChannel ?? "latest";
    Q4(`Checking for updates to ${A} version...
`), h("update: Starting update check"), h("update: Running diagnostic");
    let q = await W91();
    if (h(`update: Installation type: ${q.installationType}`), h(`update: Config install method: ${q.configInstallMethod}`), q.multipleInstallations.length > 1) {
        Q4(`
`), Q4(H6.yellow("Warning: Multiple installations found") + `
`);
        for (let _ of q.multipleInstallations) {
            let J = q.installationType === _.type ? " (currently running)" : "";
            Q4(`- ${_.type} at ${_.path}${J}
`)
        }
    }
    if (q.warnings.length > 0) {
        Q4(`
`);
        for (let _ of q.warnings) h(`update: Warning detected: ${_.issue}`), h(`update: Showing warning: ${_.issue}`), Q4(H6.yellow(`Warning: ${_.issue}
`)), Q4(H6.bold(`Fix: ${_.fix}
`))
    }
    let K = f6();
    if (!K.installMethod && q.installationType !== "package-manager") {
        Q4(`
`), Q4(`Updating configuration to track installation method...
`);
        let _ = "unknown";
        switch (q.installationType) {
            case "npm-local":
                _ = "local";
                break;
            case "native":
                _ = "native";
                break;
            case "npm-global":
                _ = "global";
                break;
            default:
                _ = "unknown"
        }
        jA((J) => ({
            ...J,
            installMethod: _
        })), Q4(`Installation method set to: ${_}
`)
    }
    if (q.installationType === "development") Q4(`
`), Q4(H6.yellow("Warning: Cannot update development build") + `
`), await nK(1);
    if (q.installationType === "package-manager") {
        let _ = await qZ1();
        if (Q4(`
`), _ === "homebrew") {
            Q4(`Claude is managed by Homebrew.
`);
            let J = await M91(A);
            if (J && !gE6.gte({
                    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                    PACKAGE_URL: "@anthropic-ai/claude-code",
                    README_URL: "https://code.claude.com/docs/en/overview",
                    VERSION: "2.1.38",
                    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                    BUILD_TIME: "2026-02-10T00:04:56Z"
                }.VERSION, J, {
                    loose: !0
                })) Q4(`Update available: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.VERSION} → ${J}
`), Q4(`
`), Q4(`To update, run:
`), Q4(H6.bold("  brew upgrade claude-code") + `
`);
            else Q4(`Claude is up to date!
`)
        } else if (_ === "winget") {
            Q4(`Claude is managed by winget.
`);
            let J = await M91(A);
            if (J && !gE6.gte({
                    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                    PACKAGE_URL: "@anthropic-ai/claude-code",
                    README_URL: "https://code.claude.com/docs/en/overview",
                    VERSION: "2.1.38",
                    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                    BUILD_TIME: "2026-02-10T00:04:56Z"
                }.VERSION, J, {
                    loose: !0
                })) Q4(`Update available: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.VERSION} → ${J}
`), Q4(`
`), Q4(`To update, run:
`), Q4(H6.bold("  winget upgrade Anthropic.ClaudeCode") + `
`);
            else Q4(`Claude is up to date!
`)
        } else if (_ === "apk") {
            Q4(`Claude is managed by apk.
`);
            let J = await M91(A);
            if (J && !gE6.gte({
                    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                    PACKAGE_URL: "@anthropic-ai/claude-code",
                    README_URL: "https://code.claude.com/docs/en/overview",
                    VERSION: "2.1.38",
                    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                    BUILD_TIME: "2026-02-10T00:04:56Z"
                }.VERSION, J, {
                    loose: !0
                })) Q4(`Update available: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.VERSION} → ${J}
`), Q4(`
`), Q4(`To update, run:
`), Q4(H6.bold("  apk upgrade claude-code") + `
`);
            else Q4(`Claude is up to date!
`)
        } else Q4(`Claude is managed by a package manager.
`), Q4(`Please use your package manager to update.
`);
        await nK(0)
    }
    if (K.installMethod && q.configInstallMethod !== "not set" && q.installationType !== "package-manager") {
        let {
            installationType: _,
            configInstallMethod: J
        } = q, D = {
            "npm-local": "local",
            "npm-global": "global",
            native: "native",
            development: "development",
            unknown: "unknown"
        } [_] || _;
        if (D !== J && J !== "unknown") Q4(`
`), Q4(H6.yellow("Warning: Configuration mismatch") + `
`), Q4(`Config expects: ${J} installation
`), Q4(`Currently running: ${_}
`), Q4(H6.yellow(`Updating the ${_} installation you are currently using`) + `
`), jA((j) => ({
            ...j,
            installMethod: D
        })), Q4(`Config updated to reflect current installation method: ${D}
`)
    }
    if (q.installationType === "native") {
        h("update: Detected native installation, using native updater");
        try {
            let _ = await _c(A, !0);
            if (_.lockFailed) {
                let J = _.lockHolderPid ? ` (PID ${_.lockHolderPid})` : "";
                Q4(H6.yellow(`Another Claude process${J} is currently running. Please try again in a moment.`) + `
`), await nK(0)
            }
            if (!_.latestVersion) process.stderr.write(`Failed to check for updates
`), await nK(1);
            if (_.latestVersion === {
                    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                    PACKAGE_URL: "@anthropic-ai/claude-code",
                    README_URL: "https://code.claude.com/docs/en/overview",
                    VERSION: "2.1.38",
                    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                    BUILD_TIME: "2026-02-10T00:04:56Z"
                }.VERSION) Q4(H6.green(`Claude Code is up to date (${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.VERSION})`) + `
`);
            else Q4(H6.green(`Successfully updated from ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.VERSION} to version ${_.latestVersion}`) + `
`), await L$A();
            await nK(0)
        } catch (_) {
            process.stderr.write(`Error: Failed to install native update
`), process.stderr.write(String(_) + `
`), process.stderr.write(`Try running "claude doctor" for diagnostics
`), await nK(1)
        }
    }
    if (K.installMethod !== "native") await _p1();
    h("update: Checking npm registry for latest version"), h(`update: Package URL: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.PACKAGE_URL}`);
    let Y = A === "stable" ? "stable" : "latest",
        z = `npm view ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.PACKAGE_URL}@${Y} version`;
    h(`update: Running: ${z}`);
    let w = await M91(A);
    if (h(`update: Latest version from npm: ${w||"FAILED"}`), !w) {
        if (h("update: Failed to get latest version from npm registry"), process.stderr.write(H6.red("Failed to check for updates") + `
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
                VERSION: "2.1.38",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-02-10T00:04:56Z"
            }.PACKAGE_URL && !{
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.38",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-02-10T00:04:56Z"
            }.PACKAGE_URL.startsWith("@anthropic")) process.stderr.write(`  • Internal/development build not published to npm
`);
        process.stderr.write(`
`), process.stderr.write(`Try:
`), process.stderr.write(`  • Check your internet connection
`), process.stderr.write(`  • Run with --debug flag for more details
`);
        let _ = {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.38",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-02-10T00:04:56Z"
        }.PACKAGE_URL || "@anthropic-ai/claude-code";
        process.stderr.write(`  • Manually check: npm view ${_} version
`), process.stderr.write(`  • Check if you need to login: npm whoami
`), await nK(1)
    }
    if (w === {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.38",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-02-10T00:04:56Z"
        }.VERSION) Q4(H6.green(`Claude Code is up to date (${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.VERSION})`) + `
`), await nK(0);
    Q4(`New version available: ${w} (current: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.VERSION})
`), Q4(`Installing update...
`);
    let H = !1,
        $ = "";
    switch (q.installationType) {
        case "npm-local":
            H = !0, $ = "local";
            break;
        case "npm-global":
            H = !1, $ = "global";
            break;
        case "unknown": {
            let _ = Ye();
            H = _, $ = _ ? "local" : "global", Q4(H6.yellow("Warning: Could not determine installation type") + `
`), Q4(`Attempting ${$} update based on file detection...
`);
            break
        }
        default:
            process.stderr.write(`Error: Cannot update ${q.installationType} installation
`), await nK(1)
    }
    Q4(`Using ${$} installation update method...
`), h(`update: Update method determined: ${$}`), h(`update: useLocalUpdate: ${H}`);
    let O;
    if (H) h("update: Calling installOrUpdateClaudePackage() for local update"), O = await Ap1(A);
    else h("update: Calling installGlobalPackage() for global update"), O = await Yp1();
    switch (h(`update: Installation status: ${O}`), O) {
        case "success":
            Q4(H6.green(`Successfully updated from ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.VERSION} to version ${w}`) + `
`), await L$A();
            break;
        case "no_permissions":
            if (process.stderr.write(`Error: Insufficient permissions to install update
`), H) process.stderr.write(`Try manually updating with:
`), process.stderr.write(`  cd ~/.claude/local && npm update ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.PACKAGE_URL}
`);
            else process.stderr.write(`Try running with sudo or fix npm permissions
`), process.stderr.write(`Or consider using native installation with: claude install
`);
            await nK(1);
            break;
        case "install_failed":
            if (process.stderr.write(`Error: Failed to install update
`), H) process.stderr.write(`Try manually updating with:
`), process.stderr.write(`  cd ~/.claude/local && npm update ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.PACKAGE_URL}
`);
            else process.stderr.write(`Or consider using native installation with: claude install
`);
            await nK(1);
            break;
        case "in_progress":
            process.stderr.write(`Error: Another instance is currently performing an update
`), process.stderr.write(`Please wait and try again later
`), await nK(1);
            break
    }
    await nK(0)
}
// @from(Ln 490646, Col 4)
gE6
// @from(Ln 490647, Col 4)
uRq = v(() => {
    u6();
    we();
    sf6();
    cA();
    D91();
    BI();
    am();
    q3();
    Z6();
    w$();
    p8();
    R$A();
    gE6 = o(GS(), 1)
})
// @from(Ln 490662, Col 4)
URq = {}
// @from(Ln 490680, Col 0)
function xGz() {
    try {
        let A = y7("policySettings");
        if (A) {
            let q = ji8(A);
            c("tengu_managed_settings_loaded", {
                keyCount: q.length,
                keys: q.join(",")
            })
        }
    } catch {}
}
// @from(Ln 490693, Col 0)
function bGz() {
    if (process.env.ENABLE_TOOL_SEARCH !== void 0) return "external_tool_search_env_var";
    if (process.env.ENABLE_EXPERIMENTAL_MCP_CLI !== void 0) return "external_mcp_cli_env_var";
    return "external_default"
}
// @from(Ln 490699, Col 0)
function uGz() {
    try {
        let A = O$(),
            q = bGz(),
            K = !1;
        c("tengu_mcp_cli_status", {
            enabled: A,
            source: q,
            legacy_env_var_set: !1
        })
    } catch {}
}
// @from(Ln 490712, Col 0)
function BGz() {
    let A = s21(),
        q = process.execArgv.some((Y) => {
            if (A) return /--inspect(-brk)?/.test(Y);
            else return /--inspect(-brk)?|--debug(-brk)?/.test(Y)
        }),
        K = process.env.NODE_OPTIONS && /--inspect(-brk)?|--debug(-brk)?/.test(process.env.NODE_OPTIONS);
    try {
        return !!global.require("inspector").url() || q || K
    } catch {
        return q || K
    }
}
// @from(Ln 490726, Col 0)
function QRq() {
    jA((A) => ({
        ...A,
        hasCompletedOnboarding: !0,
        lastOnboardingVersion: {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.38",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-02-10T00:04:56Z"
        }.VERSION
    }))
}
// @from(Ln 490741, Col 0)
function mGz(A, q) {
    return new Promise((K) => {
        let Y = (z) => void K(z);
        A.render(q(Y))
    })
}
// @from(Ln 490748, Col 0)
function LF(A, q, K) {
    return mGz(A, (Y) => wO.default.createElement(u_, {
        onChangeAppState: K?.onChangeAppState
    }, wO.default.createElement(dX, null, q(Y))))
}
// @from(Ln 490753, Col 0)
async function $l1(A, q) {
    A.render(q), RUA(), await A.waitUntilExit(), await nK(0)
}
// @from(Ln 490756, Col 0)
async function gRq(A, q, K, Y, z) {
    if (J6(!1) || process.env.IS_DEMO) return !1;
    let w = f6(),
        H = !1;
    if (!w.theme || !w.hasCompletedOnboarding) {
        H = !0;
        let [, {
            Onboarding: $
        }] = await Promise.all([Dt(), Promise.resolve().then(() => (Q0q(), F0q))]);
        await LF(A, (O) => wO.default.createElement($, {
            onDone: () => {
                QRq(), O()
            }
        }), {
            onChangeAppState: K11
        })
    }
    if (q !== "bypassPermissions" && !J6(process.env.CLAUBBIT)) {
        let {
            TrustDialog: $
        } = await Promise.resolve().then(() => (qjq(), Ajq));
        await LF(A, (_) => wO.default.createElement($, {
            commands: Y,
            onDone: _
        })), QT6(), Of1(), l$();
        let {
            errors: O
        } = Jc();
        if (O.length === 0) await dDq(A);
        if (await Wp7()) {
            let _ = su1();
            await LF(A, (J) => wO.default.createElement(OV6, {
                onDone: J,
                isStandaloneDialog: !0,
                externalIncludes: _
            }))
        }
    }
    if (H0q(), q11(), dFA(), await NM1()) {
        if (await LF(A, (O) => wO.default.createElement(RN6, {
                showIfAlreadyViewed: !1,
                location: H ? "onboarding" : "policy_update_modal",
                onDone: O
            })) === "escape") return c("tengu_grove_policy_exited", {}), w3(0), !1
    }
    if (process.env.ANTHROPIC_API_KEY) {
        let $ = cT(process.env.ANTHROPIC_API_KEY);
        if (bT6($) === "new") await LF(A, (_) => wO.default.createElement(sT6, {
            customApiKeyTruncated: $,
            onDone: _
        }), {
            onChangeAppState: K11
        })
    }
    if ((q === "bypassPermissions" || K) && !f6().bypassPermissionsModeAccepted) await LF(A, ($) => wO.default.createElement(hDq, {
        onAccept: $
    }));
    if (z && !f6().hasCompletedClaudeInChromeOnboarding) await LF(A, ($) => wO.default.createElement(xDq, {
        onDone: $
    }));
    return H
}
// @from(Ln 490819, Col 0)
function FGz() {
    jA((A) => ({
        ...A,
        numStartups: (A.numStartups ?? 0) + 1
    })), gGz(), rDq(h6()), yL6()?.add(1)
}
// @from(Ln 490826, Col 0)
function QGz() {
    let A = {};
    if (process.env.NODE_EXTRA_CA_CERTS) A.has_node_extra_ca_certs = !0;
    if (process.env.CLAUDE_CODE_CLIENT_CERT) A.has_client_cert = !0;
    if (NR6("--use-system-ca")) A.has_use_system_ca = !0;
    if (NR6("--use-openssl-ca")) A.has_use_openssl_ca = !0;
    return A
}
// @from(Ln 490834, Col 0)
async function gGz() {
    let [A, q] = await Promise.all([aj(), Bv1()]);
    c("tengu_startup_telemetry", {
        is_git: A,
        worktree_count: q,
        sandbox_enabled: b8.isSandboxingEnabled(),
        are_unsandboxed_commands_allowed: b8.areUnsandboxedCommandsAllowed(),
        is_auto_bash_allowed_if_sandbox_enabled: b8.isAutoAllowBashIfSandboxedEnabled(),
        auto_updater_disabled: xc(),
        prefers_reduced_motion: l4().prefersReducedMotion ?? !1,
        ...QGz()
    })
}
// @from(Ln 490848, Col 0)
function UGz() {
    T0q(), E0q(), C0q(), R0q(), d5q().catch(() => {})
}
// @from(Ln 490852, Col 0)
function pGz() {
    if (w4()) {
        H8("info", "prefetch_system_context_non_interactive"), l$();
        return
    }
    if ($H(!0)) H8("info", "prefetch_system_context_has_trust"), l$();
    else H8("info", "prefetch_system_context_skipped_no_trust")
}
// @from(Ln 490861, Col 0)
function RUA() {
    if (J6(process.env.CLAUDE_CODE_EXIT_AFTER_FIRST_RENDER)) return;
    if (oJq(), i$(), pGz(), zv6(), J6(process.env.CLAUDE_CODE_USE_BEDROCK) && !J6(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH)) Ai8();
    let A = Aq();
    setTimeout(() => A.abort(), 3000), Va1(h6(), A.signal, []), CDq(), zX.initialize(), Df1.initialize()
}
// @from(Ln 490868, Col 0)
function dGz(A) {
    try {
        let q = A.trim(),
            K = q.startsWith("{") && q.endsWith("}"),
            Y;
        if (K) {
            if (!j9(q)) process.stderr.write(H6.red(`Error: Invalid JSON provided to --settings
`)), process.exit(1);
            Y = eT6("claude-settings", ".json"), c8(Y, q, "utf8")
        } else {
            let {
                resolvedPath: z
            } = QH(b1(), A);
            if (!FRq(z)) process.stderr.write(H6.red(`Error: Settings file not found: ${z}
`)), process.exit(1);
            Y = z
        }
        BL6(Y), GO()
    } catch (q) {
        if (q instanceof Error) K1(q);
        process.stderr.write(H6.red(`Error processing settings: ${q instanceof Error?q.message:String(q)}
`)), process.exit(1)
    }
}
// @from(Ln 490893, Col 0)
function cGz(A) {
    try {
        let q = vz8(A);
        cL6(q), GO()
    } catch (q) {
        if (q instanceof Error) K1(q);
        process.stderr.write(H6.red(`Error processing --setting-sources: ${q instanceof Error?q.message:String(q)}
`)), process.exit(1)
    }
}
// @from(Ln 490904, Col 0)
function lGz() {
    EK("eagerLoadSettings_start");
    let A = DQA("--settings");
    if (A) dGz(A);
    let q = DQA("--setting-sources");
    if (q !== void 0) cGz(q);
    EK("eagerLoadSettings_end")
}
// @from(Ln 490913, Col 0)
function iGz(A) {
    if (process.env.CLAUDE_CODE_ENTRYPOINT) return;
    let q = process.argv.slice(2),
        K = q.indexOf("mcp");
    if (K !== -1 && q[K + 1] === "serve") {
        process.env.CLAUDE_CODE_ENTRYPOINT = "mcp";
        return
    }
    if (J6(process.env.CLAUDE_CODE_ACTION)) {
        process.env.CLAUDE_CODE_ENTRYPOINT = "claude-code-github-action";
        return
    }
    process.env.CLAUDE_CODE_ENTRYPOINT = A ? "sdk-cli" : "cli"
}
// @from(Ln 490927, Col 0)
async function nGz() {
    EK("main_function_start"), process.env.NoDefaultCurrentDirectoryInExePath = "1", _Dq(), process.on("exit", () => {
        tGz()
    }), process.on("SIGINT", () => {
        process.exit(0)
    }), EK("main_warning_handler_initialized");
    let A = process.argv.slice(2),
        q = A.includes("-p") || A.includes("--print"),
        K = A.includes("--init-only"),
        Y = A.some(($) => $.startsWith("--sdk-url")),
        z = q || K || Y || !process.stdout.isTTY;
    if (z) yr();
    bL6(!z), iGz(z);
    let H = (() => {
        if (process.env.GITHUB_ACTIONS === "true") return "github-action";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-ts") return "sdk-typescript";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-py") return "sdk-python";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-cli") return "sdk-cli";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "claude-vscode") return "claude-vscode";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "local-agent") return "local-agent";
        let $ = process.env.CLAUDE_CODE_SESSION_ACCESS_TOKEN || process.env.CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR;
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "remote" || $) return "remote";
        return "cli"
    })();
    uL6(H), EK("main_client_type_determined"), lGz(), EK("main_before_run"), process.title = "claude", await aGz(), EK("main_after_run")
}
// @from(Ln 490954, Col 0)
function rGz(A) {
    let q = 0,
        K = js(A);
    if (K.stdin) c("tengu_stdin_interactive", {});
    let Y = new _QA;
    return {
        getFpsMetrics: () => Y.getMetrics(),
        renderOptions: {
            ...K,
            onFrame: (z) => {
                if (Y.record(z.durationMs), Tv7()) return;
                for (let w of z.flickers) {
                    if (w.reason === "resize") continue;
                    let H = Date.now();
                    if (H - q < 1000) c("tengu_flicker", {
                        desiredHeight: w.desiredHeight,
                        actualHeight: w.availableHeight,
                        reason: w.reason
                    });
                    q = H
                }
            }
        }
    }
}
// @from(Ln 490979, Col 0)
async function oGz(A, q) {
    if (!process.stdin.isTTY && !process.argv.includes("mcp")) {
        if (u8("piping"), q === "stream-json") return process.stdin;
        process.stdin.setEncoding("utf8");
        let K = "";
        return process.stdin.on("data", (Y) => {
            K += Y
        }), await new Promise((Y) => {
            process.stdin.on("end", Y)
        }), [A, K].filter(Boolean).join(`
`)
    }
    return A
}
// @from(Ln 490993, Col 0)
async function aGz() {
    EK("run_function_start");

    function A() {
        let w = (H) => H.long?.replace(/^--/, "") ?? H.short?.replace(/^-/, "") ?? "";
        return Object.assign({
            sortSubcommands: !0,
            sortOptions: !0
        }, {
            compareOptions: (H, $) => w(H).localeCompare(w($))
        })
    }
    let q = new UT6().configureHelp(A()).enablePositionalOptions();
    EK("run_commander_initialized"), q.hook("preAction", async () => {
        EK("preAction_start");
        let w = KDq();
        if (w instanceof Promise) await w;
        EK("preAction_after_init"), Rp7(), UGz(), EK("preAction_after_migrations"), M_4(), Dv7(), EK("preAction_after_remote_settings"), EK("preAction_after_settings_sync")
    }), q.name("claude").description("Claude Code - starts an interactive session by default, use -p/--print for non-interactive output").argument("[prompt]", "Your prompt", String).helpOption("-h, --help", "Display help for command").option("-d, --debug [filter]", 'Enable debug mode with optional category filtering (e.g., "api,hooks" or "!1p,!file")', (w) => {
        return !0
    }).addOption(new J5("-d2e, --debug-to-stderr", "Enable debug mode (to stderr)").argParser(Boolean).hideHelp()).option("--debug-file <path>", "Write debug logs to a specific file path (implicitly enables debug mode)", () => !0).option("--verbose", "Override verbose mode setting from config", () => !0).option("-p, --print", "Print response and exit (useful for pipes). Note: The workspace trust dialog is skipped when Claude is run with the -p mode. Only use this flag in directories you trust.", () => !0).addOption(new J5("--init", "Run Setup hooks with init trigger, then continue").hideHelp()).addOption(new J5("--init-only", "Run Setup and SessionStart:startup hooks, then exit").hideHelp()).addOption(new J5("--maintenance", "Run Setup hooks with maintenance trigger, then continue").hideHelp()).addOption(new J5("--output-format <format>", 'Output format (only works with --print): "text" (default), "json" (single result), or "stream-json" (realtime streaming)').choices(["text", "json", "stream-json"])).addOption(new J5("--json-schema <schema>", 'JSON Schema for structured output validation. Example: {"type":"object","properties":{"name":{"type":"string"}},"required":["name"]}').argParser(String)).option("--include-partial-messages", "Include partial message chunks as they arrive (only works with --print and --output-format=stream-json)", () => !0).addOption(new J5("--input-format <format>", 'Input format (only works with --print): "text" (default), or "stream-json" (realtime streaming input)').choices(["text", "stream-json"])).option("--mcp-debug", "[DEPRECATED. Use --debug instead] Enable MCP debug mode (shows MCP server errors)", () => !0).option("--dangerously-skip-permissions", "Bypass all permission checks. Recommended only for sandboxes with no internet access.", () => !0).option("--allow-dangerously-skip-permissions", "Enable bypassing all permission checks as an option, without it being enabled by default. Recommended only for sandboxes with no internet access.", () => !0).addOption(new J5("--max-thinking-tokens <tokens>", "Maximum number of thinking tokens (only works with --print)").argParser(Number).hideHelp()).addOption(new J5("--max-turns <turns>", "Maximum number of agentic turns in non-interactive mode. This will early exit the conversation after the specified number of turns. (only works with --print)").argParser(Number).hideHelp()).addOption(new J5("--max-budget-usd <amount>", "Maximum dollar amount to spend on API calls (only works with --print)").argParser((w) => {
        let H = Number(w);
        if (isNaN(H) || H <= 0) throw Error("--max-budget-usd must be a positive number greater than 0");
        return H
    })).option("--replay-user-messages", "Re-emit user messages from stdin back on stdout for acknowledgment (only works with --input-format=stream-json and --output-format=stream-json)", () => !0).addOption(new J5("--enable-auth-status", "Enable auth status messages in SDK mode").default(!1).hideHelp()).option("--allowedTools, --allowed-tools <tools...>", 'Comma or space-separated list of tool names to allow (e.g. "Bash(git:*) Edit")').option("--tools <tools...>", 'Specify the list of available tools from the built-in set. Use "" to disable all tools, "default" to use all tools, or specify tool names (e.g. "Bash,Edit,Read").').option("--disallowedTools, --disallowed-tools <tools...>", 'Comma or space-separated list of tool names to deny (e.g. "Bash(git:*) Edit")').option("--mcp-config <configs...>", "Load MCP servers from JSON files or strings (space-separated)").addOption(new J5("--permission-prompt-tool <tool>", "MCP tool to use for permission prompts (only works with --print)").argParser(String).hideHelp()).addOption(new J5("--system-prompt <prompt>", "System prompt to use for the session").argParser(String)).addOption(new J5("--system-prompt-file <file>", "Read system prompt from a file").argParser(String).hideHelp()).addOption(new J5("--append-system-prompt <prompt>", "Append a system prompt to the default system prompt").argParser(String)).addOption(new J5("--append-system-prompt-file <file>", "Read system prompt from a file and append to the default system prompt").argParser(String).hideHelp()).addOption(new J5("--permission-mode <mode>", "Permission mode to use for the session").argParser(String).choices(ox)).option("-c, --continue", "Continue the most recent conversation in the current directory", () => !0).option("-r, --resume [value]", "Resume a conversation by session ID, or open interactive picker with optional search term", (w) => w || !0).option("--fork-session", "When resuming, create a new session ID instead of reusing the original (use with --resume or --continue)", () => !0).option("--from-pr [value]", "Resume a session linked to a PR by PR number/URL, or open interactive picker with optional search term", (w) => w || !0).option("--no-session-persistence", "Disable session persistence - sessions will not be saved to disk and cannot be resumed (only works with --print)").addOption(new J5("--resume-session-at <message id>", "When resuming, only messages up to and including the assistant message with <message.id> (use with --resume in print mode)").argParser(String).hideHelp()).addOption(new J5("--rewind-files <user-message-id>", "Restore files to state at the specified user message and exit (requires --resume)").hideHelp()).option("--model <model>", "Model for the current session. Provide an alias for the latest model (e.g. 'sonnet' or 'opus') or a model's full name (e.g. 'claude-sonnet-4-5-20250929').").addOption(new J5("--effort <level>", "Effort level for the current session (low, medium, high)").argParser((w) => {
        let H = ["low", "medium", "high", "max"];
        if (!H.includes(w)) throw new kXq(`It must be one of: ${H.join(", ")}`);
        return w
    })).option("--agent <agent>", "Agent for the current session. Overrides the 'agent' setting.").option("--betas <betas...>", "Beta headers to include in API requests (API key users only)").option("--fallback-model <model>", "Enable automatic fallback to specified model when default model is overloaded (only works with --print)").option("--settings <file-or-json>", "Path to a settings JSON file or a JSON string to load additional settings from").option("--add-dir <directories...>", "Additional directories to allow tool access to").option("--ide", "Automatically connect to IDE on startup if exactly one valid IDE is available", () => !0).option("--strict-mcp-config", "Only use MCP servers from --mcp-config, ignoring all other MCP configurations", () => !0).option("--session-id <uuid>", "Use a specific session ID for the conversation (must be a valid UUID)").option("--agents <json>", `JSON object defining custom agents (e.g. '{"reviewer": {"description": "Reviews code", "prompt": "You are a code reviewer"}}')`).option("--setting-sources <sources>", "Comma-separated list of setting sources to load (user, project, local).").option("--plugin-dir <paths...>", "Load plugins from directories for this session only (repeatable)").option("--disable-slash-commands", "Disable all skills", () => !0).option("--chrome", "Enable Claude in Chrome integration").option("--no-chrome", "Disable Claude in Chrome integration").option("--file <specs...>", "File resources to download at startup. Format: file_id:relative_path (e.g., --file file_abc:doc.txt file_def:img.png)").action(async (w, H) => {
        if (EK("action_handler_start"), w === "code") c("tengu_code_prompt_ignored", {}), console.warn(H6.yellow("Tip: You can launch Claude Code with just `claude`")), w = void 0;
        if (w && typeof w === "string" && !/\s/.test(w) && w.length > 0) c("tengu_single_word_prompt", {
            length: w.length
        });
        let {
            debug: $ = !1,
            debugToStderr: O = !1,
            dangerouslySkipPermissions: _,
            allowDangerouslySkipPermissions: J = !1,
            tools: X = [],
            allowedTools: D = [],
            disallowedTools: j = [],
            mcpConfig: M = [],
            permissionMode: P,
            addDir: W = [],
            fallbackModel: G,
            betas: f = [],
            ide: Z = !1,
            sessionId: N,
            includePartialMessages: T,
            pluginDir: k = []
        } = H, y, B = H.agents, S = H.agent;
        if (k.length > 0) lL6(k), Sv();
        let {
            outputFormat: m,
            inputFormat: b
        } = H, g = H.verbose ?? f6().verbose, U = H.print, x = H.init ?? !1, p = H.initOnly ?? !1, l = H.maintenance ?? !1, r = H.disableSlashCommands || !1, s = !1, O1 = s ? typeof s === "string" ? s : a7A : void 0, T1 = void 0, N1 = typeof T1 === "string" ? T1 : void 0, j1 = T1 !== void 0, q1;
        if (N1) {
            let TA = N1.match(/^https?:\/\/github\.com\/[^/]+\/[^/]+\/pull\/(\d+)\/?(?:[?#].*)?$/i),
                F7 = N1.match(/^#(\d+)$/),
                f8 = TA?.[1] ?? F7?.[1];
            if (f8) q1 = parseInt(f8, 10), N1 = void 0
        }
        let t = !1;
        if (t) {
            if (!j1) process.stderr.write(H6.red(`Error: --tmux requires --worktree
`)), process.exit(1);
            if (eA() === "windows") process.stderr.write(H6.red(`Error: --tmux is not supported on Windows
`)), process.exit(1);
            if (!await Bc4()) process.stderr.write(H6.red(`Error: tmux is not installed.
${mc4()}
`)), process.exit(1)
        }
        let J1;
        if (l8()) {
            let TA = eGz(H);
            J1 = TA;
            let F7 = TA.agentId || TA.agentName || TA.teamName,
                f8 = TA.agentId && TA.agentName && TA.teamName;
            if (F7 && !f8) process.stderr.write(H6.red(`Error: --agent-id, --agent-name, and --team-name must all be provided together
`)), process.exit(1);
            if (TA.agentId && TA.agentName && TA.teamName) mRq().setDynamicTeamContext?.({
                agentId: TA.agentId,
                agentName: TA.agentName,
                teamName: TA.teamName,
                color: TA.agentColor,
                planModeRequired: TA.planModeRequired ?? !1,
                parentSessionId: TA.parentSessionId
            });
            if (TA.teammateMode) SGz().setCliTeammateModeOverride?.(TA.teammateMode)
        }
        let D1 = H.sdkUrl ?? void 0,
            Z1 = T || J6(process.env.CLAUDE_CODE_INCLUDE_PARTIAL_MESSAGES);
        if (D1) {
            if (!b) b = "stream-json";
            if (!m) m = "stream-json";
            if (H.verbose === void 0) g = !0;
            if (!H.print) U = !0
        }
        let E1 = H.teleport ?? null,
            a = H.remote,
            A1 = a === !0 ? "" : a ?? null;
        if (N) {
            if ((H.continue || H.resume) && !H.forkSession) process.stderr.write(H6.red(`Error: --session-id can only be used with --continue or --resume if --fork-session is also specified.
`)), process.exit(1);
            if (!D1) {
                let TA = xv(N);
                if (!TA) process.stderr.write(H6.red(`Error: Invalid session ID. Must be a valid UUID.
`)), process.exit(1);
                if (zm1(TA)) process.stderr.write(H6.red(`Error: Session ID ${TA} is already in use.
`)), process.exit(1)
            }
        }
        let M1 = H.file;
        if (M1 && M1.length > 0) {
            let TA = nV();
            if (!TA) process.stderr.write(H6.red(`Error: Session token required for file downloads. CLAUDE_CODE_SESSION_ACCESS_TOKEN must be set.
`)), process.exit(1);
            let F7 = process.env.CLAUDE_CODE_REMOTE_SESSION_ID || U6(),
                f8 = jDq(M1);
            if (f8.length > 0) {
                let oq = {
                    baseUrl: process.env.ANTHROPIC_BASE_URL || P4().BASE_API_URL,
                    oauthToken: TA,
                    sessionId: F7
                };
                y = DDq(f8, oq)
            }
        }
        let z1 = w4();
        if (G && H.model && G === H.model) process.stderr.write(H6.red(`Error: Fallback model cannot be the same as the main model. Please specify a different model for --fallback-model.
`)), process.exit(1);
        if (H.effort === "max" && (!z1 || i8())) {
            let TA = !z1 ? 'Effort level "max" is not available in interactive mode.' : 'Effort level "max" is not available for Claude.ai subscribers.';
            process.stderr.write(H6.red(`Error: ${TA} Please use "low", "medium", or "high".
`)), process.exit(1)
        }
        let Y1 = H.systemPrompt;
        if (H.systemPromptFile) {
            if (H.systemPrompt) process.stderr.write(H6.red(`Error: Cannot use both --system-prompt and --system-prompt-file. Please use only one.
`)), process.exit(1);
            try {
                let TA = UE6(H.systemPromptFile);
                Y1 = BRq(TA, "utf8")
            } catch (TA) {
                if (TA.code === "ENOENT") process.stderr.write(H6.red(`Error: System prompt file not found: ${UE6(H.systemPromptFile)}
`)), process.exit(1);
                process.stderr.write(H6.red(`Error reading system prompt file: ${TA instanceof Error?TA.message:String(TA)}
`)), process.exit(1)
            }
        }
        let _1 = H.appendSystemPrompt;
        if (H.appendSystemPromptFile) {
            if (H.appendSystemPrompt) process.stderr.write(H6.red(`Error: Cannot use both --append-system-prompt and --append-system-prompt-file. Please use only one.
`)), process.exit(1);
            try {
                let TA = UE6(H.appendSystemPromptFile);
                if (!FRq(TA)) process.stderr.write(H6.red(`Error: Append system prompt file not found: ${TA}
`)), process.exit(1);
                _1 = BRq(TA, "utf8")
            } catch (TA) {
                process.stderr.write(H6.red(`Error reading append system prompt file: ${TA instanceof Error?TA.message:String(TA)}
`)), process.exit(1)
            }
        }
        if (l8() && J1?.agentId && J1?.agentName && J1?.teamName) {
            let TA = CGz().TEAMMATE_SYSTEM_PROMPT_ADDENDUM;
            _1 = _1 ? `${_1}

${TA}` : TA
        }
        let $1 = void 0,
            {
                mode: G1,
                notification: L1
            } = qJq({
                permissionModeCli: P,
                dangerouslySkipPermissions: _,
                ...{}
            });
        iL6(G1 === "bypassPermissions");
        let x1 = {};
        if (M && M.length > 0) {
            let TA = M.map((oq) => oq.trim()).filter((oq) => oq.length > 0),
                F7 = {},
                f8 = [];
            for (let oq of TA) {
                let j5 = null,
                    N4 = [],
                    E9 = j9(oq);
                if (E9) {
                    let W4 = Ug1({
                        configObject: E9,
                        filePath: "command line",
                        expandVars: !0,
                        scope: "dynamic"
                    });
                    if (W4.config) j5 = W4.config.mcpServers;
                    else N4 = W4.errors
                } else {
                    let W4 = UE6(oq),
                        F1 = YG1({
                            filePath: W4,
                            expandVars: !0,
                            scope: "dynamic"
                        });
                    if (F1.config) j5 = F1.config.mcpServers;
                    else N4 = F1.errors
                }
                if (N4.length > 0) f8.push(...N4);
                else if (j5) F7 = {
                    ...F7,
                    ...j5
                }
            }
            if (f8.length > 0) {
                let oq = f8.map((j5) => `${j5.path?j5.path+": ":""}${j5.message}`).join(`
`);
                throw Error(`Invalid MCP configuration:
${oq}`)
            }
            if (Object.keys(F7).length > 0) {
                if (Object.keys(F7).some(KG1)) throw Error(`Invalid MCP configuration: "${qy}" is a reserved MCP name.`);
                let oq = G61(F7, (j5) => ({
                    ...j5,
                    scope: "dynamic"
                }));
                x1 = {
                    ...x1,
                    ...oq
                }
            }
        }
        let R1 = UN6(H.chrome) && i8(),
            H1 = !R1 && cZ1();
        if (R1) {
            let TA = eA();
            try {
                c("tengu_claude_in_chrome_setup", {
                    platform: TA
                });
                let {
                    mcpConfig: F7,
                    allowedTools: f8,
                    systemPrompt: oq
                } = HBA();
                if (x1 = {
                        ...x1,
                        ...F7
                    }, D.push(...f8), oq) _1 = _1 ? `${oq}

${_1}` : oq
            } catch (F7) {
                c("tengu_claude_in_chrome_setup_failed", {
                    platform: TA
                }), h(`[Claude in Chrome] Error: ${F7}`), K1(F7 instanceof Error ? F7 : Error(String(F7))), console.error("Error: Failed to run with Claude in Chrome."), process.exit(1)
            }
        } else if (H1) try {
            let {
                mcpConfig: TA
            } = HBA();
            x1 = {
                ...x1,
                ...TA
            }, _1 = _1 ? `${_1}

${zBA}` : zBA
        } catch (TA) {
            h(`[Claude in Chrome] Error (auto-enable): ${TA}`)
        }
        let y1 = H.strictMcpConfig || !1;
        if (pg1()) {
            if (y1) process.stderr.write(H6.red("You cannot use --strict-mcp-config when an enterprise MCP config is present")), process.exit(1);
            if (x1 && !hn4(x1)) process.stderr.write(H6.red("You cannot dynamically configure MCP servers when an enterprise MCP config is present")), process.exit(1)
        }
        WN1(W);
        let B1 = KJq({
                allowedToolsCli: D,
                disallowedToolsCli: j,
                baseToolsCli: X,
                permissionMode: G1,
                allowDangerouslySkipPermissions: J,
                addDirs: W
            }),
            A6 = B1.toolPermissionContext,
            {
                warnings: O6,
                dangerousPermissions: P6
            } = B1;
        O6.forEach((TA) => {
            console.error(TA)
        }), W8q(), h("[STARTUP] Loading MCP configs...");
        let V6 = Date.now(),
            q6 = y1 ? Promise.resolve({
                servers: {}
            }) : z1 ? um() : zG1();
        if (b && b !== "text" && b !== "stream-json") console.error(`Error: Invalid input format "${b}".`), process.exit(1);
        if (b === "stream-json" && m !== "stream-json") console.error("Error: --input-format=stream-json requires output-format=stream-json."), process.exit(1);
        if (D1) {
            if (b !== "stream-json" || m !== "stream-json") console.error("Error: --sdk-url requires both --input-format=stream-json and --output-format=stream-json."), process.exit(1)
        }
        if (H.replayUserMessages) {
            if (b !== "stream-json" || m !== "stream-json") console.error("Error: --replay-user-messages requires both --input-format=stream-json and --output-format=stream-json."), process.exit(1)
        }
        if (Z1) {
            if (!z1 || m !== "stream-json") yl("Error: --include-partial-messages requires --print and --output-format=stream-json."), process.exit(1)
        }
        if (H.sessionPersistence === !1 && !z1) yl("Error: --no-session-persistence can only be used with --print mode."), process.exit(1);
        let K6 = await oGz(w || "", b ?? "text");
        EK("action_after_input_prompt");
        let j6 = tD(A6);
        EK("action_tools_loaded");
        let M6;
        if (ip7({
                isNonInteractiveSession: z1
            }) && H.jsonSchema) M6 = _A(H.jsonSchema);
        if (M6) {
            let TA = k_6(M6);
            if (TA) j6 = [...j6, TA], c("tengu_structured_output_enabled", {
                schema_property_count: Object.keys(M6.properties || {}).length,
                has_required_fields: Boolean(M6.required)
            });
            else c("tengu_structured_output_failure", {
                error: "Invalid JSON schema"
            })
        }
        EK("action_before_setup"), h("[STARTUP] Running setup()...");
        let N6 = Date.now(),
            {
                setup: F6
            } = await Promise.resolve().then(() => (jv6(), Dv6));
        await F6(IGz(), G1, J, j1, N1, t, N ? xv(N) : void 0, q1), h(`[STARTUP] setup() completed in ${Date.now()-N6}ms`), EK("action_after_setup");
        let P1 = H.model === "default" ? ML() : H.model,
            k1 = G === "default" ? ML() : G,
            o1 = h6();
        h("[STARTUP] Loading commands and agents...");
        let _6 = Date.now(),
            [z6, w6] = await Promise.all([cZ(o1), TB1(o1)]);
        h(`[STARTUP] Commands and agents loaded in ${Date.now()-_6}ms`), EK("action_commands_loaded");
        let r6 = [];
        if (B) try {
            let TA = j9(B);
            if (TA) r6 = fJ6(TA, "flagSettings")
        } catch (TA) {
            K1(TA instanceof Error ? TA : Error(String(TA)))
        }
        let G6 = [...w6.allAgents, ...r6],
            L6 = {
                ...w6,
                allAgents: G6,
                activeAgents: hh(G6)
            },
            OA = S ?? l4().agent,
            bA;
        if (OA) {
            if (bA = L6.activeAgents.find((TA) => TA.agentType === OA), !bA) h(`Warning: agent "${OA}" not found. Available agents: ${L6.activeAgents.map((TA)=>TA.agentType).join(", ")}. Using default behavior.`)
        }
        if (AC(bA?.agentType), bA) c("tengu_agent_flag", {
            agentType: iD(bA) ? bA.agentType : "custom",
            ...S && {
                source: "cli"
            }
        });
        if (bA?.agentType) emA(U6(), bA.agentType);
        if (z1 && bA && !Y1 && !iD(bA)) {
            let TA = bA.getSystemPrompt();
            if (TA) Y1 = TA
        }
        let lA = P1;
        if (!lA && bA?.model && bA.model !== "inherit") lA = t9(bA.model);
        CG(lA), kL6(Fq6() || null);
        let E7 = YN1(),
            V4 = t9(E7 ?? ML());
        if (l8() && J1?.agentId && J1?.agentName && J1?.teamName && J1?.agentType) {
            let TA = L6.activeAgents.find((F7) => F7.agentType === J1.agentType);
            if (TA) {
                let F7;
                if (TA.source === "built-in") h(`[teammate] Built-in agent ${J1.agentType} - skipping custom prompt (not supported)`);
                else F7 = TA.getSystemPrompt();
                if (TA.memory) c("tengu_agent_memory_loaded", {
                    ...{},
                    scope: TA.memory,
                    source: "teammate"
                });
                if (F7) {
                    let f8 = `
# Custom Agent Instructions
${F7}`;
                    _1 = _1 ? `${_1}

${f8}` : f8
                }
            } else h(`[teammate] Custom agent ${J1.agentType} not found in available agents`)
        }
        let RA, O7;
        if (!z1) {
            let TA = rGz(!1);
            O7 = TA.getFpsMetrics;
            let {
                createRoot: F7
            } = await Promise.resolve().then(() => (m1(), WE7));
            RA = await F7(TA.renderOptions), h("[STARTUP] Running showSetupScreens()...");
            let f8 = Date.now(),
                oq = await gRq(RA, G1, J, z6, R1);
            if (h(`[STARTUP] showSetupScreens() completed in ${Date.now()-f8}ms`), oq && w?.trim().toLowerCase() === "/login") w = "";
            if (oq) rX6(), T26()
        }
        if (process.exitCode !== void 0) {
            h("Graceful shutdown initiated, skipping further initialization");
            return
        }
        if (KF4(), !z1) {
            let {
                errors: TA
            } = E81(), F7 = TA.filter((f8) => !f8.mcpErrorMetadata);
            if (F7.length > 0) await LF(RA, (f8) => wO.default.createElement(GDq, {
                settingsErrors: F7,
                onContinue: f8,
                onExit: () => w3(1)
            }))
        }
        GV7().catch((TA) => K1(TA)), F17(), S9q(), Lq6(), nDq();
        let {
            servers: tK
        } = await q6;
        h(`[STARTUP] MCP configs loaded in ${Date.now()-V6}ms`);
        let gq = {
                ...tK,
                ...x1
            },
            xq = {},
            U8 = {};
        for (let [TA, F7] of Object.entries(gq)) {
            let f8 = F7;
            if (f8.type === "sdk") xq[TA] = f8;
            else U8[TA] = f8
        }
        EK("action_mcp_configs_loaded");
        let R4 = tG6(U8),
            O3 = p || x || l || z1 ? null : PP("startup", {
                agentType: bA?.agentType,
                model: V4
            }),
            HY = (K6 || z1) && !J6(process.env.MCP_CONNECTION_NONBLOCKING),
            _4 = HY ? void 0 : R4,
            Az, Wz;
        if (HY && O3)[Az, Wz] = await Promise.all([R4, O3]);
        else if (HY) Az = await R4, Wz = [];
        else Az = {
            clients: [],
            tools: [],
            commands: []
        }, Wz = [];
        let {
            clients: ZY,
            tools: $Y,
            commands: OY
        } = Az, fY;
        if (bc()) fY = new ZQA(ZY, $Y), fY.start().then(({
            url: TA
        }) => {
            let F7 = fY.getSecret();
            _f1({
                url: TA,
                key: F7
            }), h(`[MCP CLI Endpoint] Started at ${TA}`)
        }).catch((TA) => {
            K1(TA instanceof Error ? TA : Error(String(TA)))
        }), Tq(async () => {
            await fY?.stop()
        });
        if (H8("info", "started"), Tq(async () => {
                H8("info", "exited")
            }), sGz({
                hasInitialPrompt: Boolean(w),
                hasStdin: Boolean(K6),
                verbose: g,
                debug: $,
                debugToStderr: O,
                print: U ?? !1,
                outputFormat: m ?? "text",
                inputFormat: b ?? "text",
                numAllowedTools: D.length,
                numDisallowedTools: j.length,
                mcpClientCount: Object.keys(gq).length,
                worktreeEnabled: j1,
                skipWebFetchPreflight: l4().skipWebFetchPreflight,
                githubActionInputs: process.env.GITHUB_ACTION_INPUTS,
                dangerouslySkipPermissionsPassed: _ ?? !1,
                permissionMode: G1,
                modeIsBypass: G1 === "bypassPermissions",
                allowDangerouslySkipPermissionsPassed: J,
                systemPromptFlag: Y1 ? H.systemPromptFile ? "file" : "flag" : void 0,
                appendSystemPromptFlag: _1 ? H.appendSystemPromptFile ? "file" : "flag" : void 0
            }), L1q(U8, A6), DZ6(null, "initialization"), xGz(), uGz(), z1) await SXA(), EK("action_after_plugins_init"), kyA();
        else SXA().then(() => {
            EK("action_after_plugins_init"), kyA()
        });
        let J2 = p || x ? "init" : l ? "maintenance" : null;
        if (p) {
            q11(), await FW6("init", {
                forceSyncExecution: !0
            }), await PP("startup", {
                forceSyncExecution: !0
            }), w3(0);
            return
        }
        if (z1) {
            if (u8("headless-mode"), m === "stream-json" || m === "json") YiA(!0);
            q11(), dFA();
            let TA = r ? [] : z6.filter((N4) => N4.type === "prompt" && !N4.disableNonInteractive || N4.type === "local" && N4.supportsNonInteractive),
                F7 = gG1(),
                f8 = {
                    ...F7,
                    mcp: {
                        ...F7.mcp,
                        clients: ZY,
                        commands: OY,
                        tools: $Y
                    },
                    toolPermissionContext: A6,
                    effortValue: uK1(H.effort) ?? qPA(),
                    ...i4() ? {
                        fastMode: _7A(lA ?? null)
                    } : {}
                },
                oq = Gf6(f8, K11);
            if (A6.mode === "bypassPermissions" || J) YJq(A6);
            if (H.sessionPersistence === !1) oL6(!0);
            LL6(E$8(f)), RUA(), Promise.resolve().then(() => (hQA(), sjq)).then((N4) => N4.startBackgroundHousekeeping());
            let {
                runHeadless: j5
            } = await Promise.resolve().then(() => (pMq(), UMq));
            j5(K6, async () => oq.getState(), oq.setState, TA, j6, xq, L6.activeAgents, {
                continue: H.continue,
                resume: H.resume,
                verbose: g,
                outputFormat: m,
                jsonSchema: M6,
                permissionPromptToolName: H.permissionPromptTool,
                allowedTools: D,
                maxThinkingTokens: H.maxThinkingTokens,
                maxTurns: H.maxTurns,
                maxBudgetUsd: H.maxBudgetUsd,
                systemPrompt: Y1,
                appendSystemPrompt: _1,
                userSpecifiedModel: P1,
                fallbackModel: k1,
                teleport: E1,
                sdkUrl: D1,
                replayUserMessages: H.replayUserMessages,
                includePartialMessages: Z1,
                forkSession: H.forkSession || !1,
                resumeSessionAt: H.resumeSessionAt || void 0,
                rewindFiles: H.rewindFiles,
                enableAuthStatus: H.enableAuthStatus,
                agent: S,
                setupTrigger: J2 ?? void 0,
                mcpDeferredPromise: _4
            });
            return
        }
        c("tengu_startup_manual_model_config", {
            cli_flag: H.model,
            env_var: process.env.ANTHROPIC_MODEL,
            settings_file: (l4() || {}).model,
            subscriptionType: dK(),
            agent: OA
        });
        let o5 = H.model || process.env.ANTHROPIC_MODEL || l4().model;
        if (i8() && !tk() && o5 !== void 0 && mq6(o5)) {
            let TA = dC() ? "turn on /extra-usage or " : "";
            console.error(H6.yellow(`Your plan doesn't include Opus in Claude Code. You can ${TA}/upgrade to Max to access it. The current model is now Sonnet.`))
        }
        let g2 = tT6(V4),
            W$ = [];
        if (L1) W$.push({
            key: "permission-mode-notification",
            text: L1,
            priority: "high"
        });
        if (g2) W$.push({
            key: "model-deprecation-warning",
            text: g2,
            color: "warning",
            priority: "high"
        });
        let c9 = U6(),
            C3 = {
                ...A6,
                mode: l8() && mRq().isPlanModeRequired() ? "plan" : A6.mode
            },
            Gz = {
                settings: l4(),
                tasks: {},
                verbose: g ?? f6().verbose ?? !1,
                mainLoopModel: E7,
                mainLoopModelForSession: null,
                expandedView: f6().showSpinnerTree ? "teammates" : f6().showExpandedTodos ? "tasks" : "none",
                showTeammateMessagePreview: l8() ? !1 : void 0,
                selectedIPAgentIndex: -1,
                viewSelectionMode: "none",
                toolPermissionContext: C3,
                agent: bA?.agentType,
                agentDefinitions: L6,
                mcp: {
                    clients: [],
                    tools: [],
                    commands: [],
                    resources: {}
                },
                plugins: {
                    enabled: [],
                    disabled: [],
                    commands: [],
                    agents: [],
                    errors: [],
                    installationStatus: {
                        marketplaces: [],
                        plugins: []
                    },
                    needsRefresh: !1
                },
                statusLineText: void 0,
                remoteSessionUrl: void 0,
                notifications: {
                    current: null,
                    queue: W$
                },
                elicitation: {
                    queue: []
                },
                todos: {
                    [c9]: UB(c9)
                },
                fileHistory: {
                    snapshots: [],
                    trackedFiles: new Set
                },
                attribution: Zw6(),
                thinkingEnabled: fw6(),
                promptSuggestionEnabled: Wf6(),
                feedbackSurvey: {
                    timeLastShown: null,
                    submitCountAtLastAppearance: null
                },
                sessionHooks: {},
                inbox: {
                    messages: []
                },
                promptSuggestion: {
                    text: null,
                    promptId: null,
                    shownAt: 0,
                    acceptedAt: 0,
                    generationRequestId: null
                },
                speculation: Y91,
                speculationSessionTimeSavedMs: 0,
                promptCoaching: {
                    tip: null,
                    shownAt: 0
                },
                queuedCommands: [],
                workerSandboxPermissions: {
                    queue: [],
                    selectedIndex: 0
                },
                pendingWorkerRequest: null,
                pendingSandboxRequest: null,
                gitDiff: {
                    stats: null,
                    perFileStats: new Map,
                    hunks: new Map,
                    lastUpdated: 0
                },
                prStatus: {
                    number: null,
                    url: null,
                    reviewState: null,
                    lastUpdated: 0
                },
                authVersion: 0,
                initialMessage: K6 ? {
                    message: c6({
                        content: String(K6)
                    })
                } : null,
                effortValue: uK1(H.effort) ?? qPA(),
                fastMode: _7A(V4),
                teamContext: PDq?.()
            };
        if (K6) _q1(String(K6));
        let Oq = $Y;
        FGz();
        let {
            REPL: vK
        } = await Promise.resolve().then(() => (vUA(), WRq)), l9 = {
            debug: $ || O,
            commands: [...z6, ...OY],
            initialTools: Oq,
            mcpClients: ZY,
            autoConnectIdeFlag: Z,
            mainThreadAgentDefinition: bA,
            disableSlashCommands: r,
            dynamicMcpConfig: x1,
            mcpCliEndpoint: fY,
            strictMcpConfig: y1,
            systemPrompt: Y1,
            appendSystemPrompt: _1,
            taskListId: O1
        }, _3 = {
            modeApi: hGz,
            mainThreadAgentDefinition: bA,
            agentDefinitions: L6,
            currentCwd: o1,
            cliAgents: r6,
            initialState: Gz
        };
        if (H.continue) try {
            c("tengu_continue", {}), u8("continue-session");
            let {
                clearSessionCaches: TA
            } = await Promise.resolve().then(() => (Bf6(), WIA));
            TA();
            let F7 = await yt(void 0, void 0);
            if (!F7) console.error("No conversation found to continue"), process.exit(1);
            let f8 = await MQA(F7, {
                forkSession: !!H.forkSession,
                includeAttribution: !0
            }, _3);
            if (f8.restoredAgentDef) bA = f8.restoredAgentDef;
            if (LkA(f8.messages)) Dt();
            LUA(H), await $l1(RA, wO.default.createElement(Pf1, {
                getFpsMetrics: O7,
                initialState: f8.initialState
            }, wO.default.createElement(vK, {
                ...l9,
                mainThreadAgentDefinition: f8.restoredAgentDef ?? bA,
                initialMessages: f8.messages,
                initialFileHistorySnapshots: f8.fileHistorySnapshots,
                initialAgentName: f8.agentName,
                initialAgentColor: f8.agentColor
            })))
        } catch (TA) {
            K1(TA instanceof Error ? TA : Error(String(TA))), process.exit(1)
        } else if (H.resume || H.fromPr || E1 || A1 !== null) {
            let {
                clearSessionCaches: TA
            } = await Promise.resolve().then(() => (Bf6(), WIA));
            TA();
            let F7 = null,
                f8 = void 0,
                oq = xv(H.resume),
                j5 = void 0,
                N4 = null,
                E9 = void 0;
            if (H.fromPr) {
                if (H.fromPr === !0) E9 = !0;
                else if (typeof H.fromPr === "string") E9 = H.fromPr
            }
            if (H.resume && typeof H.resume === "string" && !oq) {
                let F1 = H.resume.trim();
                if (F1) {
                    let c1 = await $F(F1, {
                        exact: !0
                    });
                    if (c1.length === 1) N4 = c1[0], oq = Xw(N4) ?? null;
                    else j5 = F1
                }
            }
            if (A1 !== null || E1) {
                if (await Jv7(), !p0("allow_remote_sessions")) process.stderr.write(H6.red(`Error: Remote sessions are disabled by your organization's policy.
`)), await nK(1), process.exit(1)
            }
            if (A1 !== null) {
                let F1 = A1.length > 0,
                    c1 = x8("tengu_remote_backend", !1);
                if (!c1 && !F1) process.stderr.write(H6.red(`Error: --remote requires a description.
Usage: claude --remote "your task description"
`)), await nK(1), process.exit(1);
                c("tengu_remote_create_session", {
                    has_initial_prompt: String(F1)
                });
                let X6 = await sj(),
                    T6 = await ui4(RA, F1 ? A1 : null, new AbortController().signal, X6 || void 0);
                if (!T6) c("tengu_remote_create_session_error", {
                    error: "unable_to_create_session"
                }), process.stderr.write(H6.red(`Error: Unable to create remote session
`)), await nK(1), process.exit(1);
                if (c("tengu_remote_create_session_success", {
                        session_id: T6.id
                    }), !c1) process.stdout.write(`Created remote session: ${T6.title}
`), process.stdout.write(`View: https://claude.ai/code/${T6.id}?m=0
`), process.stdout.write(`Resume with: claude --teleport ${T6.id}
`), await nK(0), process.exit(0);
                $R6(!0), mP(Yj(T6.id));
                let l6;
                try {
                    l6 = await PN()
                } catch (I7) {
                    K1(I7 instanceof Error ? I7 : Error("Failed to authenticate for remote session")), process.stderr.write(H6.red(`Error: ${I7 instanceof Error?I7.message:"Failed to authenticate"}
`)), await nK(1), process.exit(1)
                }
                let fA = x0q(T6.id, l6.accessToken, l6.orgUUID, F1),
                    aA = `https://claude.ai/code/${T6.id}?m=0`,
                    nA = WP(`Remote session: ${T6.title}
Use /session for QR code and link to open on claude.ai`, "info"),
                    V8 = F1 ? c6({
                        content: A1
                    }) : null,
                    K8 = {
                        ...Gz,
                        remoteSessionUrl: aA
                    },
                    $8 = yOq(z6);
                await $l1(RA, wO.default.createElement(Pf1, {
                    getFpsMetrics: O7,
                    initialState: K8
                }, wO.default.createElement(vK, {
                    debug: $ || O,
                    commands: $8,
                    initialTools: [],
                    initialMessages: V8 ? [nA, V8] : [nA],
                    mcpClients: [],
                    autoConnectIdeFlag: Z,
                    mainThreadAgentDefinition: bA,
                    disableSlashCommands: r,
                    remoteSessionConfig: fA
                })));
                return
            } else if (E1) {
                if (E1 === !0 || E1 === "") {
                    c("tengu_teleport_interactive_mode", {}), h("selectAndResumeTeleportTask: Starting teleport flow...");
                    let F1 = await LF(RA, (X6) => wO.default.createElement(f0q, {
                        onComplete: X6,
                        onCancel: () => X6(null),
                        source: "cliArg"
                    }));
                    if (!F1) await nK(0), process.exit(0);
                    let {
                        branchError: c1
                    } = await aW1(F1.branch);
                    F7 = oW1(F1.log, c1)
                } else if (typeof E1 === "string") {
                    c("tengu_teleport_resume_session", {
                        mode: "direct"
                    });
                    try {
                        let F1 = await KQ1(E1),
                            c1 = await GyA(F1);
                        if (c1.status === "mismatch" || c1.status === "not_in_repo") {
                            let T6 = c1.sessionRepo;
                            if (T6) {
                                let l6 = $0q(T6),
                                    fA = O0q(l6);
                                if (fA.length > 0) {
                                    let aA = await LF(RA, (nA) => wO.default.createElement(X0q, {
                                        targetRepo: T6,
                                        initialPaths: fA,
                                        onSelectPath: nA,
                                        onCancel: () => nA(null)
                                    }));
                                    if (aA) process.chdir(aA), lZ(aA), _n1(aA);
                                    else await nK(0)
                                } else throw new vD(`You must run claude --teleport ${E1} from a checkout of ${T6}.`, H6.red(`You must run claude --teleport ${E1} from a checkout of ${H6.bold(T6)}.
`))
                            }
                        } else if (c1.status === "error") throw new vD(c1.errorMessage || "Failed to validate session", H6.red(`Error: ${c1.errorMessage||"Failed to validate session"}
`));
                        await nW6();
                        let X6 = await K0q(RA, E1);
                        jN1({
                            sessionId: E1
                        }), F7 = X6.messages
                    } catch (F1) {
                        if (F1 instanceof vD) process.stderr.write(F1.formattedMessage + `
`);
                        else K1(F1 instanceof Error ? F1 : Error(String(F1))), process.stderr.write(H6.red(`Error: ${F1 instanceof Error?F1.message:String(F1)}
`));
                        await nK(1)
                    }
                }
            }
            if (oq) {
                let F1 = oq;
                try {
                    let c1 = await yt(N4 ?? F1, void 0);
                    if (!c1) console.error(`No conversation found with session ID: ${F1}`), process.exit(1);
                    c("tengu_session_resumed", {
                        entrypoint: "cli_flag"
                    });
                    let X6 = N4?.fullPath ?? c1.fullPath;
                    if (f8 = await MQA(c1, {
                            forkSession: !!H.forkSession,
                            sessionIdOverride: F1,
                            transcriptPath: X6
                        }, _3), f8.restoredAgentDef) bA = f8.restoredAgentDef
                } catch (c1) {
                    K1(c1 instanceof Error ? c1 : Error(String(c1))), console.error(`Failed to resume session ${F1}`), process.exit(1)
                }
            }
            if (y) try {
                let F1 = await y,
                    c1 = F1.filter((X6) => !X6.success).length;
                if (c1 > 0) process.stderr.write(H6.yellow(`Warning: ${c1}/${F1.length} file(s) failed to download.
`))
            } catch (F1) {
                process.stderr.write(H6.red(`Error downloading files: ${F1 instanceof Error?F1.message:String(F1)}
`)), process.exit(1)
            }
            let W4 = f8 ?? (Array.isArray(F7) ? {
                messages: F7,
                fileHistorySnapshots: void 0,
                agentName: void 0,
                agentColor: void 0,
                restoredAgentDef: bA,
                initialState: Gz
            } : void 0);
            if (W4) {
                if (LkA(W4.messages)) Dt();
                LUA(H), await $l1(RA, wO.default.createElement(Pf1, {
                    getFpsMetrics: O7,
                    initialState: W4.initialState
                }, wO.default.createElement(vK, {
                    ...l9,
                    mainThreadAgentDefinition: W4.restoredAgentDef ?? bA,
                    initialMessages: W4.messages,
                    initialFileHistorySnapshots: W4.fileHistorySnapshots,
                    initialAgentName: W4.agentName,
                    initialAgentColor: W4.agentColor
                })))
            } else {
                let [F1, {
                    ResumeConversation: c1
                }] = await Promise.all([jc(y8()), Promise.resolve().then(() => (ZRq(), GRq))]);
                await $l1(RA, wO.default.createElement(Pf1, {
                    getFpsMetrics: O7,
                    initialState: Gz
                }, wO.default.createElement(dX, null, wO.default.createElement(c1, {
                    ...l9,
                    worktreePaths: F1,
                    initialSearchQuery: j5,
                    forkSession: H.forkSession,
                    filterByPr: E9
                }))))
            }
        } else {
            if (O3 && Wz.length === 0) Wz = await O3;
            EK("action_after_hooks"), LUA(H), await $l1(RA, wO.default.createElement(Pf1, {
                getFpsMetrics: O7,
                initialState: Gz
            }, wO.default.createElement(vK, {
                ...l9,
                initialMessages: Wz
            })))
        }
    }).version(`${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.VERSION} (Claude Code)`, "-v, --version", "Output the version number"), q.addOption(new J5("--agent-id <id>", "Teammate agent ID").hideHelp()), q.addOption(new J5("--agent-name <name>", "Teammate display name").hideHelp()), q.addOption(new J5("--team-name <name>", "Team name for swarm coordination").hideHelp()), q.addOption(new J5("--agent-color <color>", "Teammate UI color").hideHelp()), q.addOption(new J5("--plan-mode-required", "Require plan mode before implementation").hideHelp()), q.addOption(new J5("--parent-session-id <id>", "Parent session ID for analytics correlation").hideHelp()), q.addOption(new J5("--teammate-mode <mode>", 'How to spawn teammates: "tmux", "in-process", or "auto"').choices(["auto", "tmux", "in-process"]).hideHelp()), q.addOption(new J5("--agent-type <type>", "Custom agent type for this teammate").hideHelp()), q.addOption(new J5("--sdk-url <url>", "Use remote WebSocket endpoint for SDK I/O streaming (only with -p and stream-json format)").hideHelp()), q.addOption(new J5("--teleport [session]", "Resume a teleport session, optionally specify session ID").hideHelp()), q.addOption(new J5("--remote [description]", "Create a remote session with the given description").hideHelp());
    let K = q.command("mcp").description("Configure and manage MCP servers").helpOption("-h, --help", "Display help for command").configureHelp(A()).enablePositionalOptions();
    K.command("serve").description("Start the Claude Code MCP server").helpOption("-h, --help", "Display help for command").option("-d, --debug", "Enable debug mode", () => !0).option("--verbose", "Override verbose mode setting from config", () => !0).action(async ({
        debug: w,
        verbose: H
    }) => {
        let {
            mcpServeHandler: $
        } = await Promise.resolve().then(() => (Z11(), G11));
        await $({
            debug: w,
            verbose: H
        })
    }), aDq(K), K.command("remove <name>").description("Remove an MCP server").option("-s, --scope <scope>", "Configuration scope (local, user, or project) - if not specified, removes from whichever scope it exists in").helpOption("-h, --help", "Display help for command").action(async (w, H) => {
        let {
            mcpRemoveHandler: $
        } = await Promise.resolve().then(() => (Z11(), G11));
        await $(w, H)
    }), K.command("list").description("List configured MCP servers").helpOption("-h, --help", "Display help for command").action(async () => {
        let {
            mcpListHandler: w
        } = await Promise.resolve().then(() => (Z11(), G11));
        await w()
    }), K.command("get <name>").description("Get details about an MCP server").helpOption("-h, --help", "Display help for command").action(async (w) => {
        let {
            mcpGetHandler: H
        } = await Promise.resolve().then(() => (Z11(), G11));
        await H(w)
    }), K.command("add-json <name> <json>").description("Add an MCP server (stdio or SSE) with a JSON string").option("-s, --scope <scope>", "Configuration scope (local, user, or project)", "local").option("--client-secret", "Prompt for OAuth client secret (or set MCP_CLIENT_SECRET env var)").helpOption("-h, --help", "Display help for command").action(async (w, H, $) => {
        let {
            mcpAddJsonHandler: O
        } = await Promise.resolve().then(() => (Z11(), G11));
        await O(w, H, $)
    }), K.command("add-from-claude-desktop").description("Import MCP servers from Claude Desktop (Mac and WSL only)").option("-s, --scope <scope>", "Configuration scope (local, user, or project)", "local").helpOption("-h, --help", "Display help for command").action(async (w) => {
        let {
            mcpAddFromDesktopHandler: H
        } = await Promise.resolve().then(() => (Z11(), G11));
        await H(w)
    }), K.command("reset-project-choices").description("Reset all approved and rejected project-scoped (.mcp.json) servers within this project").helpOption("-h, --help", "Display help for command").action(async () => {
        let {
            mcpResetChoicesHandler: w
        } = await Promise.resolve().then(() => (Z11(), G11));
        await w()
    });
    let Y = q.command("plugin").description("Manage Claude Code plugins").helpOption("-h, --help", "Display help for command").configureHelp(A());
    Y.command("validate <path>").description("Validate a plugin or marketplace manifest").addOption(new J5("--cowork", "Use cowork_plugins directory").hideHelp()).helpOption("-h, --help", "Display help for command").action(async (w, H) => {
        let {
            pluginValidateHandler: $
        } = await Promise.resolve().then(() => (Sy(), Cy));
        $(w, H)
    }), Y.command("list").description("List installed plugins").option("--json", "Output as JSON").option("--available", "Include available plugins from marketplaces (requires --json)").addOption(new J5("--cowork", "Use cowork_plugins directory").hideHelp()).helpOption("-h, --help", "Display help for command").action(async (w) => {
        let {
            pluginListHandler: H
        } = await Promise.resolve().then(() => (Sy(), Cy));
        await H(w)
    });
    let z = Y.command("marketplace").description("Manage Claude Code marketplaces").helpOption("-h, --help", "Display help for command").configureHelp(A());
    return z.command("add <source>").description("Add a marketplace from a URL, path, or GitHub repo").addOption(new J5("--cowork", "Use cowork_plugins directory").hideHelp()).helpOption("-h, --help", "Display help for command").action(async (w, H) => {
        let {
            marketplaceAddHandler: $
        } = await Promise.resolve().then(() => (Sy(), Cy));
        await $(w, H)
    }), z.command("list").description("List all configured marketplaces").option("--json", "Output as JSON").addOption(new J5("--cowork", "Use cowork_plugins directory").hideHelp()).helpOption("-h, --help", "Display help for command").action(async (w) => {
        let {
            marketplaceListHandler: H
        } = await Promise.resolve().then(() => (Sy(), Cy));
        await H(w)
    }), z.command("remove <name>").alias("rm").description("Remove a configured marketplace").addOption(new J5("--cowork", "Use cowork_plugins directory").hideHelp()).helpOption("-h, --help", "Display help for command").action(async (w, H) => {
        let {
            marketplaceRemoveHandler: $
        } = await Promise.resolve().then(() => (Sy(), Cy));
        await $(w, H)
    }), z.command("update [name]").description("Update marketplace(s) from their source - updates all if no name specified").addOption(new J5("--cowork", "Use cowork_plugins directory").hideHelp()).helpOption("-h, --help", "Display help for command").action(async (w, H) => {
        let {
            marketplaceUpdateHandler: $
        } = await Promise.resolve().then(() => (Sy(), Cy));
        await $(w, H)
    }), Y.command("install <plugin>").alias("i").description("Install a plugin from available marketplaces (use plugin@marketplace for specific marketplace)").option("-s, --scope <scope>", "Installation scope: user, project, or local", "user").addOption(new J5("--cowork", "Use cowork_plugins directory").hideHelp()).helpOption("-h, --help", "Display help for command").action(async (w, H) => {
        let {
            pluginInstallHandler: $
        } = await Promise.resolve().then(() => (Sy(), Cy));
        await $(w, H)
    }), Y.command("uninstall <plugin>").alias("remove").alias("rm").description("Uninstall an installed plugin").option("-s, --scope <scope>", "Uninstall from scope: user, project, or local", "user").addOption(new J5("--cowork", "Use cowork_plugins directory").hideHelp()).helpOption("-h, --help", "Display help for command").action(async (w, H) => {
        let {
            pluginUninstallHandler: $
        } = await Promise.resolve().then(() => (Sy(), Cy));
        await $(w, H)
    }), Y.command("enable <plugin>").description("Enable a disabled plugin").option("-s, --scope <scope>", `Installation scope: ${ZP.join(", ")} (default: user)`).addOption(new J5("--cowork", "Use cowork_plugins directory").hideHelp()).helpOption("-h, --help", "Display help for command").action(async (w, H) => {
        let {
            pluginEnableHandler: $
        } = await Promise.resolve().then(() => (Sy(), Cy));
        await $(w, H)
    }), Y.command("disable [plugin]").description("Disable an enabled plugin").option("-a, --all", "Disable all enabled plugins").option("-s, --scope <scope>", `Installation scope: ${ZP.join(", ")} (default: user)`).addOption(new J5("--cowork", "Use cowork_plugins directory").hideHelp()).helpOption("-h, --help", "Display help for command").action(async (w, H) => {
        let {
            pluginDisableHandler: $
        } = await Promise.resolve().then(() => (Sy(), Cy));
        await $(w, H)
    }), Y.command("update <plugin>").description("Update a plugin to the latest version (restart required to apply)").option("-s, --scope <scope>", `Installation scope: ${h91.join(", ")} (default: user)`).addOption(new J5("--cowork", "Use cowork_plugins directory").hideHelp()).helpOption("-h, --help", "Display help for command").action(async (w, H) => {
        let {
            pluginUpdateHandler: $
        } = await Promise.resolve().then(() => (Sy(), Cy));
        await $(w, H)
    }), q.command("setup-token").description("Set up a long-lived authentication token (requires Claude subscription)").helpOption("-h, --help", "Display help for command").action(async () => {
        let {
            setupTokenHandler: w
        } = await Promise.resolve().then(() => (QE6(), FE6));
        await w()
    }), q.command("doctor").description("Check the health of your Claude Code auto-updater").helpOption("-h, --help", "Display help for command").action(async () => {
        let {
            doctorHandler: w
        } = await Promise.resolve().then(() => (QE6(), FE6));
        await w()
    }), q.command("update").alias("upgrade").description("Check for updates and install if available").helpOption("-h, --help", "Display help for command").action(async () => {
        let {
            update: w
        } = await Promise.resolve().then(() => (uRq(), bRq));
        await w()
    }), q.command("install [target]").description("Install Claude Code native build. Use [target] to specify version (stable, latest, or specific version)").option("--force", "Force installation even if already installed").helpOption("-h, --help", "Display help for command").action(async (w, H) => {
        let {
            installHandler: $
        } = await Promise.resolve().then(() => (QE6(), FE6));
        await $(w, H)
    }), EK("run_before_parse"), await q.parseAsync(process.argv), EK("run_after_parse"), EK("main_after_run"), CR6(), q
}
// @from(Ln 492073, Col 0)
async function sGz({
    hasInitialPrompt: A,
    hasStdin: q,
    verbose: K,
    debug: Y,
    debugToStderr: z,
    print: w,
    outputFormat: H,
    inputFormat: $,
    numAllowedTools: O,
    numDisallowedTools: _,
    mcpClientCount: J,
    worktreeEnabled: X,
    skipWebFetchPreflight: D,
    githubActionInputs: j,
    dangerouslySkipPermissionsPassed: M,
    permissionMode: P,
    modeIsBypass: W,
    allowDangerouslySkipPermissionsPassed: G,
    systemPromptFlag: f,
    appendSystemPromptFlag: Z
}) {
    try {
        let N = await xs1();
        c("tengu_init", {
            entrypoint: "claude",
            hasInitialPrompt: A,
            hasStdin: q,
            verbose: K,
            debug: Y,
            debugToStderr: z,
            print: w,
            outputFormat: H,
            inputFormat: $,
            numAllowedTools: O,
            numDisallowedTools: _,
            mcpClientCount: J,
            worktree: X,
            skipWebFetchPreflight: D,
            ...j && {
                githubActionInputs: j
            },
            dangerouslySkipPermissionsPassed: M,
            permissionMode: P,
            modeIsBypass: W,
            allowDangerouslySkipPermissionsPassed: G,
            ...f && {
                systemPromptFlag: f
            },
            ...Z && {
                appendSystemPromptFlag: Z
            },
            ...N && {
                rh: N
            },
            is_coordinator: void 0
        })
    } catch (N) {
        K1(N instanceof Error ? N : Error(String(N)))
    }
}
// @from(Ln 492135, Col 0)
function LUA(A) {}
// @from(Ln 492137, Col 0)
function tGz() {
    (process.stderr.isTTY ? process.stderr : process.stdout.isTTY ? process.stdout : void 0)?.write(PS)
}