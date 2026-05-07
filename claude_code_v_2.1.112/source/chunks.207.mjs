
// @from(Ln 542074, Col 0)
function vt8(q) {
    let K = H8(),
        _ = K.tipsHistory?.[q];
    if (!_) return 1 / 0;
    return K.numStartups - _
}
// @from(Ln 542080, Col 4)
lP7 = L(() => {
    h1()
})
// @from(Ln 542084, Col 0)
function nP7() {
    return Fv("tengu_desktop_upsell", PAA)
}
// @from(Ln 542088, Col 0)
function WAA() {
    return process.platform === "darwin" || process.platform === "win32" && process.arch === "x64"
}
// @from(Ln 542092, Col 0)
function FY5() {
    if (!WAA()) return !1;
    if (!nP7().enable_startup_dialog) return !1;
    let q = H8();
    if (q.desktopUpsellDismissed) return !1;
    if ((q.desktopUpsellSeenCount ?? 0) >= 3) return !1;
    return !0
}
// @from(Ln 542101, Col 0)
function gY5(q) {
    let K = s(14),
        {
            onDone: _
        } = q,
        [z, Y] = Tt8.useState(!1),
        A;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) A = [], K[0] = A;
    else A = K[0];
    if (Tt8.useEffect(ZAA, A), z) {
        let W;
        if (K[1] !== _) W = tS.createElement(gn8, {
            onDone: () => _()
        }), K[1] = _, K[2] = W;
        else W = K[2];
        return W
    }
    let O;
    if (K[3] !== _) O = function(D) {
        switch (D) {
            case "try": {
                Y(!0);
                return
            }
            case "never": {
                d8(DAA), _();
                return
            }
            case "not-now": {
                _();
                return
            }
        }
    }, K[3] = _, K[4] = O;
    else O = K[4];
    let w = O,
        $;
    if (K[5] === Symbol.for("react.memo_cache_sentinel")) $ = {
        label: "Open in Claude Code Desktop",
        value: "try"
    }, K[5] = $;
    else $ = K[5];
    let j;
    if (K[6] === Symbol.for("react.memo_cache_sentinel")) j = {
        label: "Not now",
        value: "not-now"
    }, K[6] = j;
    else j = K[6];
    let H;
    if (K[7] === Symbol.for("react.memo_cache_sentinel")) H = [$, j, {
        label: "Don't ask again",
        value: "never"
    }], K[7] = H;
    else H = K[7];
    let J = H,
        X;
    if (K[8] === Symbol.for("react.memo_cache_sentinel")) X = tS.createElement(u, {
        marginBottom: 1
    }, tS.createElement(T, null, "Same Claude Code with visual diffs, live app preview, parallel sessions, and more.")), K[8] = X;
    else X = K[8];
    let M;
    if (K[9] !== w) M = () => w("not-now"), K[9] = w, K[10] = M;
    else M = K[10];
    let P;
    if (K[11] !== w || K[12] !== M) P = tS.createElement(IY, {
        title: "Try Claude Code Desktop"
    }, tS.createElement(u, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1
    }, X, tS.createElement(A1, {
        options: J,
        onChange: w,
        onCancel: M
    }))), K[11] = w, K[12] = M, K[13] = P;
    else P = K[13];
    return P
}
// @from(Ln 542180, Col 0)
function DAA(q) {
    if (q.desktopUpsellDismissed) return q;
    return {
        ...q,
        desktopUpsellDismissed: !0
    }
}
// @from(Ln 542188, Col 0)
function ZAA() {
    let q = (H8().desktopUpsellSeenCount ?? 0) + 1;
    d8((K) => {
        if ((K.desktopUpsellSeenCount ?? 0) >= q) return K;
        return {
            ...K,
            desktopUpsellSeenCount: q
        }
    }), d("tengu_desktop_upsell_shown", {
        seen_count: q
    })
}
// @from(Ln 542200, Col 4)
tS
// @from(Ln 542200, Col 8)
Tt8
// @from(Ln 542200, Col 13)
PAA
// @from(Ln 542201, Col 4)
iP7 = L(() => {
    o6();
    g6();
    B1();
    C8();
    h1();
    gK();
    UA7();
    pD();
    tS = K6(P6(), 1), Tt8 = K6(P6(), 1), PAA = {
        enable_shortcut_tip: !1,
        enable_startup_dialog: !1
    }
})
// @from(Ln 542215, Col 0)
async function fAA() {
    if (Vt8 !== void 0) return Vt8;
    let q = await O56();
    return Vt8 = WM in q, Vt8
}
// @from(Ln 542220, Col 0)
async function UY5(q, K, _) {
    if (!await fAA()) return !1;
    if (Hu(`${q}@${WM}`)) return !1;
    let {
        bashTools: z
    } = K ?? {};
    if (_.cli && z?.size) {
        if (_.cli.some((Y) => z.has(Y))) return !0
    }
    if (_.filePath && K?.readFileState) {
        if (gK6(K.readFileState).some((A) => _.filePath.test(A))) return !0
    }
    return !1
}
// @from(Ln 542235, Col 0)
function TAA() {
    let K = v7().spinnerTipsOverride;
    if (!K?.tips?.length) return [];
    return K.tips.map((_, z) => ({
        id: `custom-tip-${z}`,
        content: async () => _,
        cooldownSessions: 0,
        isRelevant: async () => !0
    }))
}
// @from(Ln 542245, Col 0)
async function kt8(q) {
    let _ = v7().spinnerTipsOverride,
        z = TAA();
    if (_?.excludeDefault && z.length > 0) return z;
    let Y = [...GAA, ...vAA],
        A = await Promise.all(Y.map((w) => w.isRelevant(q)));
    return [...Y.filter((w, $) => A[$]).filter((w) => vt8(w.id) >= w.cooldownSessions), ...z]
}
// @from(Ln 542253, Col 4)
Vt8
// @from(Ln 542253, Col 9)
GAA
// @from(Ln 542253, Col 14)
vAA
// @from(Ln 542254, Col 4)
rP7 = L(() => {
    Y3();
    K8();
    cy();
    a1();
    o$6();
    iP7();
    u$6();
    d27();
    r98();
    zp();
    QR();
    T7();
    wf();
    h1();
    hf();
    D_();
    Q8();
    FP();
    nO();
    pK();
    kj();
    Sq();
    NK();
    yD();
    m$();
    qH6();
    g4();
    __6();
    B1();
    Fg8();
    a_6();
    lP7();
    GAA = [{
        id: "new-user-warmup",
        content: async () => "Start with small features or bug fixes, tell Claude to propose a plan, and verify its suggested edits",
        cooldownSessions: 3,
        async isRelevant() {
            return H8().numStartups < 10
        }
    }, {
        id: "plan-mode-for-complex-tasks",
        content: async () => `Use Plan Mode to prepare for a complex request before making changes. Press ${WJ("chat:cycleMode","Chat","shift+tab")} twice to enable.`,
        cooldownSessions: 5,
        isRelevant: async () => {
            let q = H8();
            return (q.lastPlanModeUse ? (Date.now() - q.lastPlanModeUse) / 86400000 : 1 / 0) > 7
        }
    }, {
        id: "default-permission-mode-config",
        content: async () => "Use /config to change your default permission mode (including Plan Mode)",
        cooldownSessions: 10,
        isRelevant: async () => {
            try {
                let q = H8(),
                    K = y7(),
                    _ = Boolean(q.lastPlanModeUse),
                    z = Boolean(K?.permissions?.defaultMode);
                return _ && !z
            } catch (q) {
                return E(`Failed to check default-permission-mode-config tip relevance: ${q}`, {
                    level: "warn"
                }), !1
            }
        }
    }, {
        id: "git-worktrees",
        content: async () => "Use git worktrees to run multiple Claude sessions in parallel.",
        cooldownSessions: 10,
        isRelevant: async () => {
            try {
                let q = H8();
                return await rf6() <= 1 && q.numStartups > 50
            } catch (q) {
                return !1
            }
        }
    }, {
        id: "color-when-multi-clauding",
        content: async () => "Running multiple Claude sessions? Use /color and /rename to tell them apart at a glance.",
        cooldownSessions: 10,
        isRelevant: async () => {
            if (bH7()) return !1;
            return await aZ8() >= 2
        }
    }, {
        id: "terminal-setup",
        content: async () => X7.terminal === "Apple_Terminal" ? "Run /terminal-setup to enable convenient terminal integration like Option + Enter for new line and more" : "Run /terminal-setup to enable convenient terminal integration like Shift + Enter for new line and more",
        cooldownSessions: 10,
        async isRelevant() {
            let q = H8();
            if (X7.terminal === "Apple_Terminal") return !q.optionAsMetaKeyInstalled;
            return !q.shiftEnterKeyBindingInstalled
        }
    }, {
        id: "shift-enter",
        content: async () => X7.terminal === "Apple_Terminal" ? "Press Option+Enter to send a multi-line message" : "Press Shift+Enter to send a multi-line message",
        cooldownSessions: 10,
        async isRelevant() {
            let q = H8();
            return Boolean((X7.terminal === "Apple_Terminal" ? q.optionAsMetaKeyInstalled : q.shiftEnterKeyBindingInstalled) && q.numStartups > 3)
        }
    }, {
        id: "shift-enter-setup",
        content: async () => X7.terminal === "Apple_Terminal" ? "Run /terminal-setup to enable Option+Enter for new lines" : "Run /terminal-setup to enable Shift+Enter for new lines",
        cooldownSessions: 10,
        async isRelevant() {
            if (!LE6()) return !1;
            let q = H8();
            return !(X7.terminal === "Apple_Terminal" ? q.optionAsMetaKeyInstalled : q.shiftEnterKeyBindingInstalled)
        }
    }, {
        id: "memory-command",
        content: async () => "Use /memory to view and manage Claude memory",
        cooldownSessions: 15,
        async isRelevant() {
            return H8().memoryUsageCount <= 0
        }
    }, {
        id: "theme-command",
        content: async () => "Use /theme to change the color theme",
        cooldownSessions: 20,
        isRelevant: async () => !0
    }, {
        id: "colorterm-truecolor",
        content: async () => "Try setting environment variable COLORTERM=truecolor for richer colors",
        cooldownSessions: 30,
        isRelevant: async () => !process.env.COLORTERM && Y8.level < 3
    }, {
        id: "powershell-tool-env",
        content: async () => "Set CLAUDE_CODE_USE_POWERSHELL_TOOL=1 to enable the PowerShell tool (preview)",
        cooldownSessions: 10,
        isRelevant: async () => y1() === "windows" && process.env.CLAUDE_CODE_USE_POWERSHELL_TOOL === void 0
    }, {
        id: "status-line",
        content: async () => "Use /statusline to set up a custom status line that will display beneath the input box",
        cooldownSessions: 25,
        isRelevant: async () => y7().statusLine === void 0
    }, {
        id: "prompt-queue",
        content: async () => "Hit Enter to queue up additional messages while Claude is working.",
        cooldownSessions: 5,
        async isRelevant() {
            return H8().promptQueueUseCount <= 3
        }
    }, {
        id: "enter-to-steer-in-relatime",
        content: async () => "Send messages to Claude while it works to steer Claude in real-time",
        cooldownSessions: 20,
        isRelevant: async () => !0
    }, {
        id: "todo-list",
        content: async () => "Ask Claude to create a todo list when working on complex tasks to track progress and remain on track",
        cooldownSessions: 20,
        isRelevant: async () => !0
    }, {
        id: "vscode-command-install",
        content: async () => `Open the Command Palette (Cmd+Shift+P) and run "Shell Command: Install '${X7.terminal==="vscode"?"code":X7.terminal}' command in PATH" to enable IDE integration`,
        cooldownSessions: 0,
        async isRelevant() {
            if (!C88()) return !1;
            if (y1() !== "macos") return !1;
            switch (X7.terminal) {
                case "vscode":
                    return !await KS4();
                case "cursor":
                    return !await eR4();
                case "windsurf":
                    return !await qS4();
                default:
                    return !1
            }
        }
    }, {
        id: "ide-upsell-external-terminal",
        content: async () => "Connect Claude to your IDE · /ide",
        cooldownSessions: 4,
        async isRelevant() {
            if (q0()) return !1;
            if ((await ib8()).length !== 0) return !1;
            return (await _S4()).length > 0
        }
    }, {
        id: "install-github-app",
        content: async () => "Run /install-github-app to tag @claude right from your Github issues and PRs",
        cooldownSessions: 10,
        isRelevant: async () => !H8().githubActionSetupCount
    }, {
        id: "install-slack-app",
        content: async () => "Run /install-slack-app to use Claude in Slack",
        cooldownSessions: 10,
        isRelevant: async () => !H8().slackAppInstallCount
    }, {
        id: "permissions",
        content: async () => "Use /permissions to pre-approve and pre-deny bash, edit, and MCP tools",
        cooldownSessions: 10,
        async isRelevant() {
            return H8().numStartups > 10
        }
    }, {
        id: "drag-and-drop-images",
        content: async () => "Did you know you can drag and drop image files into your terminal?",
        cooldownSessions: 10,
        isRelevant: async () => !X7.isSSH()
    }, {
        id: "paste-images-mac",
        content: async () => "Paste images into Claude Code using control+v (not cmd+v!)",
        cooldownSessions: 10,
        isRelevant: async () => y1() === "macos"
    }, {
        id: "double-esc",
        content: async () => "Double-tap esc to rewind the conversation to a previous point in time",
        cooldownSessions: 10,
        isRelevant: async () => !kO()
    }, {
        id: "double-esc-code-restore",
        content: async () => "Double-tap esc to rewind the code and/or conversation to a previous point in time",
        cooldownSessions: 10,
        isRelevant: async () => kO()
    }, {
        id: "continue",
        content: async () => "Run claude --continue or claude --resume to resume a conversation",
        cooldownSessions: 10,
        isRelevant: async () => !0
    }, {
        id: "rename-conversation",
        content: async () => "Name your conversations with /rename to find them easily in /resume later",
        cooldownSessions: 15,
        isRelevant: async () => K66() && H8().numStartups > 10
    }, {
        id: "custom-commands",
        content: async () => "Create skills by adding .md files to .claude/skills/ in your project or ~/.claude/skills/ for skills that work in any project",
        cooldownSessions: 15,
        async isRelevant() {
            return H8().numStartups > 10
        }
    }, {
        id: "shift-tab",
        content: async () => `Hit ${WJ("chat:cycleMode","Chat","shift+tab")} to cycle between default mode, auto-accept edit mode, and plan mode`,
        cooldownSessions: 10,
        isRelevant: async () => !0
    }, {
        id: "image-paste",
        content: async () => `Use ${WJ("chat:imagePaste","Chat","ctrl+v")} to paste images from your clipboard`,
        cooldownSessions: 20,
        isRelevant: async () => !0
    }, {
        id: "custom-agents",
        content: async () => "Use /agents to optimize specific tasks. Eg. Software Architect, Code Writer, Code Reviewer",
        cooldownSessions: 15,
        async isRelevant() {
            return H8().numStartups > 5
        }
    }, {
        id: "agent-flag",
        content: async () => "Use --agent <agent_name> to directly start a conversation with a subagent",
        cooldownSessions: 15,
        async isRelevant() {
            return H8().numStartups > 5
        }
    }, {
        id: "desktop-app",
        content: async () => "Run Claude Code locally or remotely using the Claude desktop app: clau.de/desktop",
        cooldownSessions: 15,
        isRelevant: async () => y1() !== "linux"
    }, {
        id: "desktop-shortcut",
        content: async (q) => {
            return `Continue your session in Claude Code Desktop with ${d7("suggestion",q.theme)("/desktop")}`
        },
        cooldownSessions: 15,
        isRelevant: async () => {
            if (!nP7().enable_shortcut_tip) return !1;
            return process.platform === "darwin" || process.platform === "win32" && process.arch === "x64"
        }
    }, {
        id: "web-app",
        content: async () => "Run tasks in the cloud while you keep coding locally · clau.de/web",
        cooldownSessions: 15,
        isRelevant: async () => !0
    }, {
        id: "mobile-app",
        content: async () => "/mobile to use Claude Code from the Claude app on your phone",
        cooldownSessions: 15,
        isRelevant: async () => !0
    }, {
        id: "voice-mode",
        content: async () => "Use /voice to enable push-to-talk dictation",
        cooldownSessions: 10,
        isRelevant: async () => SM6() && v7().voiceEnabled === void 0 && !CZ() && !S6(process.env.CLAUDE_CODE_REMOTE) && !X7.isSSH()
    }, {
        id: "no-flicker",
        content: async () => "Try flicker-free rendering, now with mouse support · /tui fullscreen",
        cooldownSessions: 10,
        isRelevant: async () => !lq() && Q27()
    }, {
        id: "opusplan-mode-reminder",
        content: async () => `Your default model setting is Opus Plan Mode. Press ${WJ("chat:cycleMode","Chat","shift+tab")} twice to activate Plan Mode and plan with Claude Opus.`,
        cooldownSessions: 2,
        async isRelevant() {
            let q = H8(),
                _ = Ub() === "opusplan",
                z = q.lastPlanModeUse ? (Date.now() - q.lastPlanModeUse) / 86400000 : 1 / 0;
            return _ && z > 3
        }
    }, {
        id: "frontend-design-plugin",
        content: async (q) => {
            return `Working with HTML/CSS? Install the frontend-design plugin:
${d7("suggestion",q.theme)(`/plugin install frontend-design@${WM}`)}`
        },
        cooldownSessions: 3,
        isRelevant: async (q) => UY5("frontend-design", q, {
            filePath: /\.(html|css|htm)$/i
        })
    }, {
        id: "vercel-plugin",
        content: async (q) => {
            return `Working with Vercel? Install the vercel plugin:
${d7("suggestion",q.theme)(`/plugin install vercel@${WM}`)}`
        },
        cooldownSessions: 3,
        isRelevant: async (q) => UY5("vercel", q, {
            filePath: /(?:^|[/\\])vercel\.json$/i,
            cli: ["vercel"]
        })
    }, {
        id: "effort-high-nudge",
        content: async (q) => {
            let _ = d7("suggestion", q.theme)("/effort high");
            return u8("tengu_tide_elm", "off") === "copy_b" ? `Use ${_} for better one-shot answers. Claude thinks it through first.` : `Working on something tricky? ${_} gives better first answers`
        },
        cooldownSessions: 3,
        isRelevant: async () => {
            if (!x26()) return !1;
            if (!QI(G5())) return !1;
            if (E1("policySettings")?.effortLevel !== void 0) return !1;
            if (Zj6() !== void 0) return !1;
            let q = v7().effortLevel;
            if (q === "high" || q === "xhigh" || q === "max") return !1;
            return u8("tengu_tide_elm", "off") !== "off"
        }
    }, {
        id: "subagent-fanout-nudge",
        content: async (q) => {
            let K = d7("suggestion", q.theme);
            return u8("tengu_tern_alloy", "off") === "copy_b" ? `For big tasks, tell Claude to ${K("use subagents")}. They work in parallel and keep your main thread clean.` : `Say ${K('"fan out subagents"')} and Claude sends a team. Each one digs deep so nothing gets missed.`
        },
        cooldownSessions: 3,
        isRelevant: async () => {
            if (!x26()) return !1;
            return u8("tengu_tern_alloy", "off") !== "off"
        }
    }, {
        id: "loop-command-nudge",
        content: async (q) => {
            let K = d7("suggestion", q.theme);
            return u8("tengu_timber_lark", "off") === "copy_b" ? `Use ${K("/loop 5m check the deploy")} to run any prompt on a schedule. Set it and forget it.` : `${K("/loop")} runs any prompt on a recurring schedule. Great for monitoring deploys, babysitting PRs, or polling status.`
        },
        cooldownSessions: 3,
        isRelevant: async () => {
            if (!x26()) return !1;
            if (!uD()) return !1;
            return u8("tengu_timber_lark", "off") !== "off"
        }
    }, {
        id: "guest-passes",
        content: async (q) => {
            let K = d7("claude", q.theme),
                _ = o_6();
            return _ ? `Share Claude Code and earn ${K(r_6(_))} of extra usage · ${K("/passes")}` : `You have free guest passes to share · ${K("/passes")}`
        },
        cooldownSessions: 3,
        isRelevant: async () => {
            if (H8().hasVisitedPasses) return !1;
            let {
                eligible: K
            } = sx6();
            return K
        }
    }, {
        id: "overage-credit",
        content: async (q) => {
            let K = d7("claude", q.theme),
                _ = rX6(),
                z = _ ? oC6(_) : null;
            if (!z) return "";
            return `${K(`${z} in extra usage, on us`)} · third-party apps · ${K("/extra-usage")}`
        },
        cooldownSessions: 3,
        isRelevant: async () => $O7()
    }, {
        id: "feedback-command",
        content: async () => "Use /feedback to help us improve!",
        cooldownSessions: 15,
        async isRelevant() {
            return H8().numStartups > 5
        }
    }], vAA = []
})
// @from(Ln 542655, Col 0)
function VAA(q) {
    if (q.length === 0) return;
    if (q.length === 1) return q[0];
    let K = q.map((_) => ({
        tip: _,
        sessions: vt8(_.id)
    }));
    return K.sort((_, z) => z.sessions - _.sessions), K[0]?.tip
}
// @from(Ln 542664, Col 0)
async function QY5(q) {
    if (y7().spinnerTipsEnabled === !1) return;
    let K = await kt8(q);
    if (K.length === 0) return;
    return VAA(K)
}
// @from(Ln 542671, Col 0)
function dY5(q) {
    pY5(q.id), d("tengu_tip_shown", {
        tipIdLength: q.id,
        cooldownSessions: q.cooldownSessions
    })
}
// @from(Ln 542677, Col 4)
cY5 = L(() => {
    a1();
    C8();
    lP7();
    rP7()
})
// @from(Ln 542683, Col 4)
kAA
// @from(Ln 542683, Col 9)
NAA
// @from(Ln 542683, Col 14)
EAA
// @from(Ln 542683, Col 19)
VNH
// @from(Ln 542683, Col 24)
yAA
// @from(Ln 542683, Col 29)
LAA
// @from(Ln 542683, Col 34)
hAA
// @from(Ln 542683, Col 39)
RAA
// @from(Ln 542683, Col 44)
SAA
// @from(Ln 542683, Col 49)
CAA
// @from(Ln 542683, Col 54)
bAA
// @from(Ln 542683, Col 59)
kNH
// @from(Ln 542683, Col 64)
IAA
// @from(Ln 542683, Col 69)
xAA
// @from(Ln 542683, Col 74)
uAA
// @from(Ln 542683, Col 79)
NNH
// @from(Ln 542683, Col 84)
mAA
// @from(Ln 542683, Col 89)
ENH
// @from(Ln 542683, Col 94)
BAA
// @from(Ln 542683, Col 99)
yNH
// @from(Ln 542683, Col 104)
pAA
// @from(Ln 542683, Col 109)
FAA
// @from(Ln 542683, Col 114)
gAA
// @from(Ln 542683, Col 119)
UAA
// @from(Ln 542683, Col 124)
LNH
// @from(Ln 542683, Col 129)
QAA
// @from(Ln 542683, Col 134)
hNH
// @from(Ln 542683, Col 139)
dAA
// @from(Ln 542683, Col 144)
cAA
// @from(Ln 542683, Col 149)
lAA
// @from(Ln 542683, Col 154)
nAA
// @from(Ln 542683, Col 159)
iAA
// @from(Ln 542683, Col 164)
RNH
// @from(Ln 542683, Col 169)
rAA
// @from(Ln 542683, Col 174)
lY5
// @from(Ln 542683, Col 179)
oAA
// @from(Ln 542683, Col 184)
nY5
// @from(Ln 542683, Col 189)
aAA
// @from(Ln 542683, Col 194)
iY5
// @from(Ln 542683, Col 199)
sAA
// @from(Ln 542683, Col 204)
oP7
// @from(Ln 542683, Col 209)
tAA
// @from(Ln 542683, Col 214)
eAA
// @from(Ln 542683, Col 219)
rY5
// @from(Ln 542683, Col 224)
qOA
// @from(Ln 542683, Col 229)
oY5
// @from(Ln 542683, Col 234)
KOA
// @from(Ln 542683, Col 239)
aY5
// @from(Ln 542683, Col 244)
SNH
// @from(Ln 542684, Col 4)
sY5 = L(() => {
    p7();
    fi1();
    kAA = C6(() => y.unknown()), NAA = C6(() => y.object({
        matcher: y.string().optional(),
        hookCallbackIds: y.array(y.string()),
        timeout: y.number().optional()
    }).describe("Configuration for matching and routing hook callbacks.")), EAA = C6(() => y.object({
        subtype: y.literal("initialize"),
        hooks: y.record(dC4(), y.array(NAA())).optional(),
        sdkMcpServers: y.array(y.string()).optional(),
        jsonSchema: y.record(y.string(), y.unknown()).optional(),
        systemPrompt: y.array(y.string()).optional(),
        appendSystemPrompt: y.string().optional(),
        appendSubagentSystemPrompt: y.string().optional().describe("@internal Additional system prompt appended to every Task-tool subagent (and propagated to nested subagents). Gated by CLAUDE_CODE_ENABLE_APPEND_SUBAGENT_PROMPT."),
        excludeDynamicSections: y.boolean().optional().describe("When true, omit per-user dynamic sections (working directory, auto-memory path) from the cached system prompt and re-inject them as the first user message. Lets cross-user prompt caching hit on a static system prompt prefix. Tradeoff: the model sees this context slightly later in the prompt, so steering on the working directory and memory location is marginally less authoritative. Has no effect when a custom (non-preset) system prompt is in use."),
        agents: y.record(y.string(), iC4()).optional(),
        promptSuggestions: y.boolean().optional(),
        agentProgressSummaries: y.boolean().optional()
    }).describe("Initializes the SDK session with hooks, MCP servers, and agent configuration.")), VNH = C6(() => y.object({
        commands: y.array(Pi1()),
        agents: y.array(Wi1()),
        output_style: y.string(),
        available_output_styles: y.array(y.string()),
        models: y.array(lC4()),
        account: nC4(),
        pid: y.number().optional().describe("@internal CLI process PID for tmux socket isolation"),
        fast_mode_state: K18().optional()
    }).describe("Response from session initialization with available commands, models, and account info.")), yAA = C6(() => y.object({
        subtype: y.literal("interrupt")
    }).describe("Interrupts the currently running conversation turn.")), LAA = C6(() => y.object({
        subtype: y.literal("can_use_tool"),
        tool_name: y.string(),
        input: y.record(y.string(), y.unknown()),
        permission_suggestions: y.array(q18()).optional(),
        blocked_path: y.string().optional(),
        decision_reason: y.string().optional(),
        title: y.string().optional(),
        display_name: y.string().optional(),
        tool_use_id: y.string(),
        agent_id: y.string().optional(),
        description: y.string().optional()
    }).describe("Requests permission to use a tool with the given input.")), hAA = C6(() => y.object({
        subtype: y.literal("set_permission_mode"),
        mode: ss(),
        ultraplan: y.boolean().optional().describe("@internal CCR ultraplan session marker.")
    }).describe("Sets the permission mode for tool execution handling.")), RAA = C6(() => y.object({
        subtype: y.literal("set_model"),
        model: y.string().optional()
    }).describe("Sets the model to use for subsequent conversation turns.")), SAA = C6(() => y.object({
        subtype: y.literal("set_max_thinking_tokens"),
        max_thinking_tokens: y.number().nullable()
    }).describe("Sets the maximum number of thinking tokens for extended thinking.")), CAA = C6(() => y.object({
        subtype: y.literal("rename_session"),
        title: y.string()
    }).describe("Sets the user-facing title for the current session.")), bAA = C6(() => y.object({
        subtype: y.literal("mcp_status")
    }).describe("Requests the current status of all MCP server connections.")), kNH = C6(() => y.object({
        mcpServers: y.array(Mi1())
    }).describe("Response containing the current status of all MCP server connections.")), IAA = C6(() => y.object({
        subtype: y.literal("get_context_usage")
    }).describe("Requests a breakdown of current context window usage by category.")), xAA = C6(() => y.object({
        name: y.string(),
        tokens: y.number(),
        color: y.string(),
        isDeferred: y.boolean().optional()
    })), uAA = C6(() => y.object({
        color: y.string(),
        isFilled: y.boolean(),
        categoryName: y.string(),
        tokens: y.number(),
        percentage: y.number(),
        squareFullness: y.number()
    })), NNH = C6(() => y.object({
        categories: y.array(xAA()),
        totalTokens: y.number(),
        maxTokens: y.number(),
        rawMaxTokens: y.number(),
        percentage: y.number(),
        gridRows: y.array(y.array(uAA())),
        model: y.string(),
        memoryFiles: y.array(y.object({
            path: y.string(),
            type: y.string(),
            tokens: y.number()
        })),
        mcpTools: y.array(y.object({
            name: y.string(),
            serverName: y.string(),
            tokens: y.number(),
            isLoaded: y.boolean().optional()
        })),
        deferredBuiltinTools: y.array(y.object({
            name: y.string(),
            tokens: y.number(),
            isLoaded: y.boolean()
        })).optional(),
        systemTools: y.array(y.object({
            name: y.string(),
            tokens: y.number()
        })).optional(),
        systemPromptSections: y.array(y.object({
            name: y.string(),
            tokens: y.number()
        })).optional(),
        agents: y.array(y.object({
            agentType: y.string(),
            source: y.string(),
            tokens: y.number()
        })),
        slashCommands: y.object({
            totalCommands: y.number(),
            includedCommands: y.number(),
            tokens: y.number()
        }).optional(),
        skills: y.object({
            totalSkills: y.number(),
            includedSkills: y.number(),
            tokens: y.number(),
            skillFrontmatter: y.array(y.object({
                name: y.string(),
                source: y.string(),
                tokens: y.number()
            }))
        }).optional(),
        autoCompactThreshold: y.number().optional(),
        isAutoCompactEnabled: y.boolean(),
        messageBreakdown: y.object({
            toolCallTokens: y.number(),
            toolResultTokens: y.number(),
            attachmentTokens: y.number(),
            assistantMessageTokens: y.number(),
            userMessageTokens: y.number(),
            redirectedContextTokens: y.number(),
            unattributedTokens: y.number(),
            toolCallsByType: y.array(y.object({
                name: y.string(),
                callTokens: y.number(),
                resultTokens: y.number()
            })),
            attachmentsByType: y.array(y.object({
                name: y.string(),
                tokens: y.number()
            }))
        }).optional(),
        apiUsage: y.object({
            input_tokens: y.number(),
            output_tokens: y.number(),
            cache_creation_input_tokens: y.number(),
            cache_read_input_tokens: y.number()
        }).nullable()
    }).describe("Breakdown of current context window usage by category (system prompt, tools, messages, etc.).")), mAA = C6(() => y.object({
        subtype: y.literal("rewind_files"),
        user_message_id: y.string(),
        dry_run: y.boolean().optional()
    }).describe("Rewinds file changes made since a specific user message.")), ENH = C6(() => y.object({
        canRewind: y.boolean(),
        error: y.string().optional(),
        filesChanged: y.array(y.string()).optional(),
        insertions: y.number().optional(),
        deletions: y.number().optional()
    }).describe("Result of a rewindFiles operation.")), BAA = C6(() => y.object({
        subtype: y.literal("cancel_async_message"),
        message_uuid: y.string()
    }).describe("Drops a pending async user message from the command queue by uuid. No-op if already dequeued for execution.")), yNH = C6(() => y.object({
        cancelled: y.boolean()
    }).describe("Result of a cancel_async_message operation. cancelled=false means the message was not in the queue (already dequeued or never enqueued).")), pAA = C6(() => y.object({
        subtype: y.literal("seed_read_state"),
        path: y.string(),
        mtime: y.number()
    }).describe("Seeds the readFileState cache with a path+mtime entry. Use when a prior Read was removed from context so Edit validation would fail despite the client having observed the Read. The mtime lets the CLI detect if the file changed since the seeded Read — same staleness check as the normal path.")), FAA = C6(() => y.object({
        subtype: y.literal("hook_callback"),
        callback_id: y.string(),
        input: cC4(),
        tool_use_id: y.string().optional()
    }).describe("Delivers a hook callback with its input data.")), gAA = C6(() => y.object({
        subtype: y.literal("mcp_message"),
        server_name: y.string(),
        message: kAA()
    }).describe("Sends a JSON-RPC message to a specific MCP server.")), UAA = C6(() => y.object({
        subtype: y.literal("mcp_set_servers"),
        servers: y.record(y.string(), LI8())
    }).describe("Replaces the set of dynamically managed MCP servers.")), LNH = C6(() => y.object({
        added: y.array(y.string()),
        removed: y.array(y.string()),
        errors: y.record(y.string(), y.string())
    }).describe("Result of replacing the set of dynamically managed MCP servers.")), QAA = C6(() => y.object({
        subtype: y.literal("reload_plugins")
    }).describe("Reloads plugins from disk and returns the refreshed session components.")), hNH = C6(() => y.object({
        commands: y.array(Pi1()),
        agents: y.array(Wi1()),
        plugins: y.array(y.object({
            name: y.string(),
            path: y.string(),
            source: y.string().optional()
        })),
        mcpServers: y.array(Mi1()),
        error_count: y.number()
    }).describe("Refreshed commands, agents, plugins, and MCP server status after reload.")), dAA = C6(() => y.object({
        subtype: y.literal("mcp_reconnect"),
        serverName: y.string()
    }).describe("Reconnects a disconnected or failed MCP server.")), cAA = C6(() => y.object({
        subtype: y.literal("mcp_toggle"),
        serverName: y.string(),
        enabled: y.boolean()
    }).describe("Enables or disables an MCP server.")), lAA = C6(() => y.object({
        subtype: y.literal("stop_task"),
        task_id: y.string()
    }).describe("Stops a running task.")), nAA = C6(() => y.object({
        subtype: y.literal("apply_flag_settings"),
        settings: y.record(y.string(), y.unknown())
    }).describe("Merges the provided settings into the flag settings layer, updating the active configuration.")), iAA = C6(() => y.object({
        subtype: y.literal("get_settings")
    }).describe("Returns the effective merged settings and the raw per-source settings.")), RNH = C6(() => y.object({
        effective: y.record(y.string(), y.unknown()),
        sources: y.array(y.object({
            source: y.enum(["userSettings", "projectSettings", "localSettings", "flagSettings", "policySettings"]),
            settings: y.record(y.string(), y.unknown())
        })).describe("Ordered low-to-high priority — later entries override earlier ones."),
        applied: y.object({
            model: y.string(),
            effort: y.enum(["low", "medium", "high", "xhigh", "max"]).nullable()
        }).optional().describe("Runtime-resolved values after env overrides, session state, and model-specific defaults are applied. Unlike `effective` (disk merge), these reflect what will actually be sent to the API."),
        errors: y.array(tC4()).optional().describe("Settings parse and validation errors. When non-empty, the listed files were skipped during the merge above — their settings are not reflected in `effective` or `sources`.")
    }).describe("Effective merged settings plus raw per-source settings in merge order.")), rAA = C6(() => y.object({
        subtype: y.literal("elicitation"),
        mcp_server_name: y.string(),
        message: y.string(),
        mode: y.enum(["form", "url"]).optional(),
        url: y.string().optional(),
        elicitation_id: y.string().optional(),
        requested_schema: y.record(y.string(), y.unknown()).optional(),
        title: y.string().optional().describe("Permission-display title from the MCP server's _meta['anthropic/permissionDisplay']. Mirrors can_use_tool.title so SDK consumers can render elicitation-driven permission prompts with structured headers instead of parsing `message`."),
        display_name: y.string().optional().describe("Short tool/server label from _meta['anthropic/permissionDisplay'].displayName. Mirrors can_use_tool.display_name."),
        description: y.string().optional().describe("Permission-display subtitle from _meta['anthropic/permissionDisplay'].description. Mirrors can_use_tool.description.")
    }).describe("Requests the SDK consumer to handle an MCP elicitation (user input request).")), lY5 = C6(() => y.object({
        action: y.enum(["accept", "decline", "cancel"]),
        content: y.record(y.string(), y.unknown()).optional()
    }).describe("Response from the SDK consumer for an elicitation request.")), oAA = C6(() => y.object({
        subtype: y.literal("request_user_dialog"),
        dialog_kind: y.string().describe('Identifier for the dialog the host should render. Open string union — known kinds include "it2_setup" and "computer_use_approval"; new kinds may be added without bumping the protocol.'),
        payload: y.record(y.string(), y.unknown()).describe("Dialog-specific data passed to the host renderer. Shape is defined per dialog_kind; the protocol transports it opaquely."),
        tool_use_id: y.string().optional()
    }).describe("Requests the SDK consumer to render a tool-driven blocking dialog and return the user choice. Used by tools that previously rendered Ink JSX via setToolJSX with an onDone callback.")), nY5 = C6(() => y.object({
        behavior: y.enum(["completed", "cancelled"]),
        result: y.unknown().optional().describe("Dialog-specific result payload. Opaque to the protocol; the caller and dialog renderer agree on the shape per dialog_kind.")
    }).describe("Response from the SDK consumer for a request_user_dialog request.")), aAA = C6(() => y.object({
        subtype: y.literal("oauth_token_refresh")
    }).describe("@internal Request from the CLI subprocess to the SDK host for a fresh OAuth access token after a 401 with no local refresh token.")), iY5 = C6(() => y.object({
        accessToken: y.string().nullable()
    }).describe("@internal Fresh OAuth access token returned by the SDK host getOAuthToken callback, or null when the host has no token available.")), sAA = C6(() => y.union([yAA(), LAA(), EAA(), hAA(), RAA(), SAA(), CAA(), bAA(), IAA(), FAA(), gAA(), mAA(), BAA(), pAA(), UAA(), QAA(), dAA(), cAA(), aAA(), lAA(), nAA(), iAA(), rAA(), oAA()])), oP7 = C6(() => y.object({
        type: y.literal("control_request"),
        request_id: y.string(),
        request: sAA()
    })), tAA = C6(() => y.object({
        subtype: y.literal("success"),
        request_id: y.string(),
        response: y.record(y.string(), y.unknown()).optional()
    })), eAA = C6(() => y.object({
        subtype: y.literal("error"),
        request_id: y.string(),
        error: y.string(),
        pending_permission_requests: y.array(y.lazy(() => oP7())).optional()
    })), rY5 = C6(() => y.object({
        type: y.literal("control_response"),
        response: y.union([tAA(), eAA()])
    })), qOA = C6(() => y.object({
        type: y.literal("control_cancel_request"),
        request_id: y.string()
    }).describe("Cancels a currently open control request.")), oY5 = C6(() => y.object({
        type: y.literal("keep_alive")
    }).describe("Keep-alive message to maintain WebSocket connection.")), KOA = C6(() => y.object({
        type: y.literal("update_environment_variables"),
        variables: y.record(y.string(), y.string())
    }).describe("Updates environment variables at runtime.")), aY5 = C6(() => y.union([Kb4(), eC4(), qb4(), rY5(), oP7(), qOA(), oY5()])), SNH = C6(() => y.union([Zi1(), oP7(), rY5(), oY5(), KOA()]))
})
// @from(Ln 542961, Col 0)
function Rm6(q, K, _, z) {
    let Y = {
        type: "permissionPromptTool",
        permissionPromptToolName: K.name,
        toolResult: q
    };
    if (q.behavior === "allow") {
        let A = q.updatedPermissions;
        if (A) z.setToolPermissionContext((w) => Ky(w, A)), Hp(A);
        let O = Object.keys(q.updatedInput).length > 0 ? q.updatedInput : _;
        return {
            ...q,
            updatedInput: O,
            decisionReason: Y
        }
    } else if (q.behavior === "deny" && q.interrupt) E(`SDK permission prompt deny+interrupt: tool=${K.name} message=${q.message}`), z.abortController.abort();
    return {
        ...q,
        decisionReason: Y
    }
}
// @from(Ln 542982, Col 4)
BNH
// @from(Ln 542982, Col 9)
tY5
// @from(Ln 542982, Col 14)
_OA
// @from(Ln 542982, Col 19)
zOA
// @from(Ln 542982, Col 24)
uY8
// @from(Ln 542983, Col 4)
aP7 = L(() => {
    p7();
    K8();
    MH();
    rI8();
    BNH = C6(() => fK.object({
        tool_name: fK.string().describe("The name of the tool requesting permission"),
        input: fK.record(fK.string(), fK.unknown()).describe("The input for the tool"),
        tool_use_id: fK.string().optional().describe("The unique tool use request ID")
    })), tY5 = C6(() => fK.enum(["user_temporary", "user_permanent", "user_reject"]).optional().catch(void 0)), _OA = C6(() => fK.object({
        behavior: fK.literal("allow"),
        updatedInput: fK.record(fK.string(), fK.unknown()),
        updatedPermissions: fK.array(oh6()).optional().catch((q) => {
            E(`Malformed updatedPermissions from SDK host ignored: ${q.error.issues[0]?.message??"unknown"}`, {
                level: "warn"
            });
            return
        }),
        toolUseID: fK.string().optional(),
        decisionClassification: tY5()
    })), zOA = C6(() => fK.object({
        behavior: fK.literal("deny"),
        message: fK.string(),
        interrupt: fK.boolean().optional(),
        toolUseID: fK.string().optional(),
        decisionClassification: tY5()
    })), uY8 = C6(() => fK.union([_OA(), zOA()]))
})
// @from(Ln 543012, Col 0)
function AOA(q) {
    let K = {};
    for (let [_, z] of Object.entries(q)) K[_] = YOA.test(_) ? "[REDACTED]" : z;
    return K
}
// @from(Ln 543018, Col 0)
function eY5(q, K = 200) {
    let _ = Y58(JSON.stringify(AOA(q)));
    return _.length > K ? _.slice(0, K - 3) + "..." : _
}
// @from(Ln 543022, Col 4)
YOA
// @from(Ln 543023, Col 4)
qA5 = L(() => {
    Zb6();
    YOA = /api[_-]?key|secret|token|password|passwd|credential|bearer|authorization|auth[_-]?header|cookie|session[_-]?(id|key)|connection[_-]?string|private[_-]?key|client[_-]?secret/i
})
// @from(Ln 543027, Col 0)
class mY8 {
    onStateChanged;
    onMetadataChanged;
    onPermissionModeChanged;
    currentState = "idle";
    hasPendingAction = !1;
    getState() {
        return this.currentState
    }
    notifyStateChanged(q, K) {
        if (this.currentState = q, this.onStateChanged?.(q, K), q === "requires_action" && K) this.hasPendingAction = !0, this.onMetadataChanged?.({
            pending_action: K
        });
        else if (this.hasPendingAction) this.hasPendingAction = !1, this.onMetadataChanged?.({
            pending_action: null
        });
        if (q === "running") this.onMetadataChanged?.({
            post_turn_summary: null
        });
        if (q === "idle") this.onMetadataChanged?.({
            task_summary: null
        });
        if (S6(process.env.CLAUDE_CODE_EMIT_SESSION_STATE_EVENTS)) sv({
            type: "system",
            subtype: "session_state_changed",
            state: q
        })
    }
    notifyMetadataChanged(q) {
        this.onMetadataChanged?.(q)
    }
    notifyPermissionModeChanged(q) {
        this.onPermissionModeChanged?.(q)
    }
}
// @from(Ln 543062, Col 4)
sP7 = L(() => {
    Q8();
    BP()
})
// @from(Ln 543067, Col 0)
function wOA(q) {
    return q.replace(OOA, (K) => K === "\u2028" ? "\\u2028" : "\\u2029")
}
// @from(Ln 543071, Col 0)
function Nt8(q) {
    return wOA(I6(q))
}
// @from(Ln 543074, Col 4)
OOA
// @from(Ln 543075, Col 4)
tP7 = L(() => {
    e8();
    OOA = /\u2028|\u2029/g
})
// @from(Ln 543083, Col 0)
function jOA(q) {
    if (!q) return;
    if (q.type === "classifier") return q.reason;
    switch (q.type) {
        case "rule":
        case "mode":
        case "subcommandResults":
        case "permissionPromptTool":
            return;
        case "hook":
        case "asyncAgent":
        case "sandboxOverride":
        case "workingDir":
        case "safetyCheck":
        case "other":
            return q.reason
    }
}
// @from(Ln 543102, Col 0)
function HOA(q, K, _, z) {
    let Y;
    try {
        Y = q.getToolUseSummary?.(K) ?? q.getActivityDescription?.(K) ?? q.userFacingName(K)
    } catch (O) {
        E(`buildRequiresActionDetails: description failed: ${O}`, {
            level: "error"
        }), Y = q.name
    }
    let A;
    try {
        if (q.name === S7 || q.name === I5) A = typeof K.command === "string" ? K.command : void 0;
        else if (q.isMcp) A = eY5(K)
    } catch (O) {
        E(`buildRequiresActionDetails: rawCommand failed: ${O}`, {
            level: "error"
        }), A = void 0
    }
    return {
        tool_name: q.name,
        action_description: Y,
        raw_command: A,
        tool_use_id: _,
        request_id: z,
        input: K
    }
}
// @from(Ln 543129, Col 0)
class BY8 {
    input;
    replayUserMessages;
    structuredInput;
    pendingRequests = new Map;
    restoredWorkerState = Promise.resolve(null);
    inputClosed = !1;
    unexpectedResponseCallback;
    resolvedToolUseIds = new Set;
    prependedLines = [];
    stallTimer;
    stallFired = !1;
    createdAt = Date.now();
    onControlRequestSent;
    onControlRequestResolved;
    onCommandLifecycle;
    sessionState;
    outbound = new w38;
    constructor(q, K, _) {
        this.input = q;
        this.replayUserMessages = K;
        this.input = q, this.sessionState = _ ?? new mY8, this.structuredInput = this.read()
    }
    trackResolvedToolUseId(q) {
        if (q.request.subtype === "can_use_tool") {
            if (this.resolvedToolUseIds.add(q.request.tool_use_id), this.resolvedToolUseIds.size > JOA) {
                let K = this.resolvedToolUseIds.values().next().value;
                if (K !== void 0) this.resolvedToolUseIds.delete(K)
            }
        }
    }
    flushInternalEvents() {
        return Promise.resolve()
    }
    flushDeliveryAcks() {
        return Promise.resolve()
    }
    get internalEventsPending() {
        return 0
    }
    prependUserMessage(q) {
        this.prependedLines.push(I6({
            type: "user",
            session_id: "",
            message: {
                role: "user",
                content: q
            },
            parent_tool_use_id: null
        }) + `
`)
    }
    async * read() {
        let q = "",
            K = async function*() {
                for (;;) {
                    if (this.prependedLines.length > 0) q = this.prependedLines.join("") + q, this.prependedLines = [];
                    let _ = q.indexOf(`
`);
                    if (_ === -1) break;
                    let z = q.slice(0, _);
                    q = q.slice(_ + 1);
                    let Y = await this.processLine(z);
                    if (Y) j1("info", "cli_stdin_message_parsed", {
                        type: Y.type
                    }), yield Y
                }
            }.bind(this);
        yield* K();
        for await (let _ of this.input) q += _, yield* K();
        if (q) {
            let _ = await this.processLine(q);
            if (_) yield _
        }
        this.inputClosed = !0;
        for (let _ of this.pendingRequests.values()) _.reject(Error("Tool permission stream closed before response received"))
    }
    getPendingPermissionRequests() {
        return Array.from(this.pendingRequests.values()).map((q) => q.request).filter((q) => q.request.subtype === "can_use_tool")
    }
    setUnexpectedResponseCallback(q) {
        this.unexpectedResponseCallback = q
    }
    injectControlResponse(q) {
        let K = q.response?.request_id;
        if (!K) return;
        let _ = this.pendingRequests.get(K);
        if (!_) return;
        if (this.trackResolvedToolUseId(_.request), this.pendingRequests.delete(K), this.write({
                type: "control_cancel_request",
                request_id: K
            }), q.response.subtype === "error") _.reject(Error(q.response.error));
        else {
            let z = q.response.response;
            if (_.schema) try {
                _.resolve(_.schema.parse(z))
            } catch (Y) {
                _.reject(Y)
            } else _.resolve({})
        }
    }
    setOnControlRequestSent(q) {
        this.onControlRequestSent = q
    }
    setOnControlRequestResolved(q) {
        this.onControlRequestResolved = q
    }
    async processLine(q) {
        if (!q) return;
        try {
            let K = na8(n8(q));
            if (K.type === "keep_alive") return;
            if (K.type === "update_environment_variables") {
                let _ = Object.keys(K.variables);
                for (let [z, Y] of Object.entries(K.variables)) process.env[z] = Y;
                E(`[structuredIO] applied update_environment_variables: ${_.join(", ")}`);
                return
            }
            if (K.type === "control_response") {
                let _ = "uuid" in K && typeof K.uuid === "string" ? K.uuid : void 0;
                if (_) this.onCommandLifecycle?.(_, "completed");
                let z = this.pendingRequests.get(K.response.request_id);
                if (!z) {
                    let O = (K.response.subtype === "success" ? K.response.response : void 0)?.toolUseID;
                    if (typeof O === "string" && this.resolvedToolUseIds.has(O)) {
                        E(`Ignoring duplicate control_response for already-resolved toolUseID=${O} request_id=${K.response.request_id}`);
                        return
                    }
                    if (this.unexpectedResponseCallback) await this.unexpectedResponseCallback(K);
                    return
                }
                if (this.trackResolvedToolUseId(z.request), this.pendingRequests.delete(K.response.request_id), z.request.request.subtype === "can_use_tool" && this.onControlRequestResolved) this.onControlRequestResolved(K.response.request_id);
                if (K.response.subtype === "error") {
                    z.reject(Error(K.response.error));
                    return
                }
                let Y = K.response.response;
                if (z.schema) try {
                    z.resolve(z.schema.parse(Y))
                } catch (A) {
                    z.reject(A)
                } else z.resolve({});
                if (this.replayUserMessages) return K;
                return
            }
            if (K.type !== "user" && K.type !== "control_request" && K.type !== "assistant" && K.type !== "system") {
                E(`Ignoring unknown message type: ${K.type}`, {
                    level: "warn"
                });
                return
            }
            if (K.type === "control_request") {
                if (!K.request) qW7("Error: Missing request on control_request");
                return K
            }
            if (K.type === "assistant" || K.type === "system") return K;
            if (K.message.role !== "user") qW7(`Error: Expected message role 'user', got '${K.message.role}'`);
            return K
        } catch (K) {
            qW7(`Error parsing streaming input line: ${q}: ${K}`)
        }
    }
    trackWrite(q) {
        if (this.stallTimer) clearTimeout(this.stallTimer);
        if (!this.stallFired) this.stallTimer = setTimeout((K) => {
            this.stallFired = !0, d("tengu_sdk_stall", {
                session_age_ms: Date.now() - this.createdAt,
                session_state: this.sessionState.getState(),
                last_message_type: K,
                pending_control_requests: this.pendingRequests.size
            })
        }, MOA, q.type), this.stallTimer.unref();
        if (q.type !== "system" && Math.random() < POA) {
            let K = aY5().safeParse(q);
            if (!K.success) d("tengu_sdk_schema_violation", {
                message_type: q.type,
                error_path: K.error.issues[0]?.path.join(".") ?? ""
            })
        }
    }
    async write(q) {
        this.trackWrite(q), f4(Nt8(q) + `
`)
    }
    async sendRequest(q, K, _, z = eP7()) {
        let Y = {
            type: "control_request",
            request_id: z,
            request: q
        };
        if (this.inputClosed) throw Error("Stream closed");
        if (_?.aborted) throw Error("Request aborted");
        if (this.outbound.enqueue(Y), q.subtype === "can_use_tool" && this.onControlRequestSent) this.onControlRequestSent(Y);
        let A = () => {
            this.outbound.enqueue({
                type: "control_cancel_request",
                request_id: z
            });
            let w = this.pendingRequests.get(z);
            if (w) this.trackResolvedToolUseId(w.request), w.reject(new sz)
        };
        if (_) _.addEventListener("abort", A, {
            once: !0
        });
        let O = Date.now();
        try {
            return await new Promise((w, $) => {
                this.pendingRequests.set(z, {
                    request: {
                        type: "control_request",
                        request_id: z,
                        request: q
                    },
                    resolve: (j) => {
                        w(j)
                    },
                    reject: $,
                    schema: K
                })
            })
        } finally {
            if (d("tengu_sdk_control_roundtrip", {
                    subtype: q.subtype,
                    duration_ms: Date.now() - O,
                    aborted: _?.aborted ?? !1
                }), _) _.removeEventListener("abort", A);
            this.pendingRequests.delete(z)
        }
    }
    createCanUseTool(q) {
        return async (K, _, z, Y, A, O) => {
            let w = O ?? await LX(K, _, z, Y, A);
            if (w.behavior === "allow" || w.behavior === "deny") return w;
            let $ = new AbortController,
                j = z.abortController.signal,
                H = () => $.abort();
            j.addEventListener("abort", H, {
                once: !0
            });
            try {
                let J = WOA(K, A, _, z, w.suggestions).then((W) => ({
                        source: "hook",
                        decision: W
                    })),
                    X = eP7();
                q?.(HOA(K, _, A, X));
                let M = this.sendRequest({
                        subtype: "can_use_tool",
                        tool_name: K.name,
                        display_name: uz8(K.name),
                        input: _,
                        permission_suggestions: w.suggestions,
                        blocked_path: w.blockedPath,
                        decision_reason: jOA(w.decisionReason),
                        tool_use_id: A,
                        agent_id: z.agentId
                    }, uY8(), $.signal, X).then((W) => ({
                        source: "sdk",
                        result: W
                    })),
                    P = await Promise.race([J, M]);
                if (P.source === "hook") {
                    if (P.decision) return M.catch(() => {}), $.abort(), P.decision;
                    let W = await M;
                    return Rm6(W.result, K, _, z)
                }
                return Rm6(P.result, K, _, z)
            } catch (J) {
                return Rm6({
                    behavior: "deny",
                    message: `Tool permission request failed: ${J}`,
                    toolUseID: A
                }, K, _, z)
            } finally {
                if (this.getPendingPermissionRequests().length === 0) this.sessionState.notifyStateChanged("running");
                j.removeEventListener("abort", H)
            }
        }
    }
    createHookCallback(q, K) {
        return {
            type: "callback",
            timeout: K,
            callback: async (_, z, Y) => {
                try {
                    return await this.sendRequest({
                        subtype: "hook_callback",
                        callback_id: q,
                        input: _,
                        tool_use_id: z || void 0
                    }, xu6(), Y)
                } catch (A) {
                    return console.error(`Error in hook callback ${q}:`, A), {}
                }
            }
        }
    }
    async handleElicitation(q, K, _, z, Y, A, O, w) {
        try {
            return await this.sendRequest({
                subtype: "elicitation",
                mcp_server_name: q,
                message: K,
                mode: Y,
                url: A,
                elicitation_id: O,
                requested_schema: _,
                title: w?.title,
                display_name: w?.displayName,
                description: w?.description
            }, lY5(), z)
        } catch {
            return {
                action: "cancel"
            }
        }
    }
    async requestUserDialog(q, K, _) {
        try {
            return await this.sendRequest({
                subtype: "request_user_dialog",
                dialog_kind: q,
                payload: K,
                tool_use_id: _?.toolUseId
            }, nY5(), _?.signal)
        } catch {
            return {
                behavior: "cancelled"
            }
        }
    }
    createSandboxAskCallback() {
        return async (q) => {
            try {
                return (await this.sendRequest({
                    subtype: "can_use_tool",
                    tool_name: Et8,
                    display_name: uz8(Et8),
                    input: {
                        host: q.host
                    },
                    tool_use_id: eP7(),
                    description: `Allow network connection to ${q.host}?`
                }, uY8())).behavior === "allow"
            } catch {
                return !1
            }
        }
    }
    async sendMcpMessage(q, K) {
        return (await this.sendRequest({
            subtype: "mcp_message",
            server_name: q,
            message: K
        }, y.object({
            mcp_response: y.any()
        }))).mcp_response
    }
    async requestOAuthTokenRefresh() {
        return (await this.sendRequest({
            subtype: "oauth_token_refresh"
        }, iY5(), AbortSignal.timeout(XOA))).accessToken
    }
}
// @from(Ln 543494, Col 0)
function qW7(q) {
    console.error(q), process.exit(1)
}
// @from(Ln 543497, Col 0)
async function WOA(q, K, _, z, Y) {
    let O = z.getAppState().toolPermissionContext.mode,
        w = Be(q.name, K, _, z, O, Y, z.abortController.signal);
    for await (let $ of w) if ($.permissionRequestResult && ($.permissionRequestResult.behavior === "allow" || $.permissionRequestResult.behavior === "deny")) {
        let j = $.permissionRequestResult;
        if (j.behavior === "allow") {
            let H = j.updatedInput || _;
            if (j.updatedInput) {
                let X = y98(await yM6(q, H, z), q.name);
                if (X) return X.behavior === "ask" ? {
                    behavior: "deny",
                    message: X.message,
                    decisionReason: X.decisionReason ?? {
                        type: "other",
                        reason: "ask rule on hook-rewritten input"
                    }
                } : X
            }
            let J = j.updatedPermissions ?? [];
            if (J.length > 0) Hp(J), z.setToolPermissionContext((X) => Ky(X, J));
            return {
                behavior: "allow",
                updatedInput: H,
                userModified: !1,
                decisionReason: {
                    type: "hook",
                    hookName: "PermissionRequest"
                }
            }
        } else return {
            behavior: "deny",
            message: j.message || "Permission denied by PermissionRequest hook",
            decisionReason: {
                type: "hook",
                hookName: "PermissionRequest"
            }
        }
    }
    return
}
// @from(Ln 543537, Col 4)
Et8 = "SandboxNetworkAccess"
// @from(Ln 543538, Col 4)
JOA = 1000
// @from(Ln 543539, Col 4)
XOA = 30000
// @from(Ln 543540, Col 4)
MOA = 300000
// @from(Ln 543541, Col 4)
POA = 0.01
// @from(Ln 543542, Col 4)
yt8 = L(() => {
    sY5();
    C8();
    sH7();
    K8();
    VA();
    m8();
    aP7();
    g$();
    qA5();
    e8();
    p7();
    WX7();
    K9();
    MH();
    sP7();
    e8();
    K97();
    tP7()
})
// @from(Ln 543563, Col 0)
function KA5(q, K) {
    let _ = Lt8.useRef(!1);
    Lt8.useEffect(() => {
        if (!kO() || _.current) return;
        if (_.current = !0, q) iF8(q, K)
    }, [q, K])
}
// @from(Ln 543570, Col 4)
Lt8
// @from(Ln 543571, Col 4)
_A5 = L(() => {
    cy();
    Lt8 = K6(P6(), 1)
})
// @from(Ln 543576, Col 0)
function KW7(q) {
    let K = s(22),
        {
            hostPattern: _,
            onUserResponse: z
        } = q,
        {
            host: Y
        } = _,
        A;
    if (K[0] !== z) A = function(V) {
        q: switch (V) {
            case "yes": {
                z({
                    allow: !0,
                    persistToSettings: !1
                });
                break q
            }
            case "yes-dont-ask-again": {
                z({
                    allow: !0,
                    persistToSettings: !0
                });
                break q
            }
            case "no":
                z({
                    allow: !1,
                    persistToSettings: !1
                })
        }
    }, K[0] = z, K[1] = A;
    else A = K[1];
    let O = A,
        w;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) w = jj6(), K[2] = w;
    else w = K[2];
    let $ = w,
        j;
    if (K[3] === Symbol.for("react.memo_cache_sentinel")) j = {
        label: "Yes",
        value: "yes"
    }, K[3] = j;
    else j = K[3];
    let H;
    if (K[4] !== Y) H = !$ ? [{
        label: A$.createElement(T, null, "Yes, and don't ask again for ", A$.createElement(T, {
            bold: !0
        }, Y)),
        value: "yes-dont-ask-again"
    }] : [], K[4] = Y, K[5] = H;
    else H = K[5];
    let J;
    if (K[6] === Symbol.for("react.memo_cache_sentinel")) J = {
        label: A$.createElement(T, null, "No, and tell Claude what to do differently ", A$.createElement(T, {
            bold: !0
        }, "(esc)")),
        value: "no"
    }, K[6] = J;
    else J = K[6];
    let X;
    if (K[7] !== H) X = [j, ...H, J], K[7] = H, K[8] = X;
    else X = K[8];
    let M = X,
        P;
    if (K[9] === Symbol.for("react.memo_cache_sentinel")) P = A$.createElement(T, {
        dimColor: !0
    }, "Host:"), K[9] = P;
    else P = K[9];
    let W;
    if (K[10] !== Y) W = A$.createElement(u, null, P, A$.createElement(T, null, " ", Y)), K[10] = Y, K[11] = W;
    else W = K[11];
    let D;
    if (K[12] === Symbol.for("react.memo_cache_sentinel")) D = A$.createElement(u, {
        marginTop: 1
    }, A$.createElement(T, null, "Do you want to allow this connection?")), K[12] = D;
    else D = K[12];
    let Z;
    if (K[13] !== z) Z = () => {
        z({
            allow: !1,
            persistToSettings: !1
        })
    }, K[13] = z, K[14] = Z;
    else Z = K[14];
    let G;
    if (K[15] !== O || K[16] !== M || K[17] !== Z) G = A$.createElement(u, null, A$.createElement(A1, {
        options: M,
        onChange: O,
        onCancel: Z
    })), K[15] = O, K[16] = M, K[17] = Z, K[18] = G;
    else G = K[18];
    let f;
    if (K[19] !== G || K[20] !== W) f = A$.createElement(IY, {
        title: "Network request outside of sandbox"
    }, A$.createElement(u, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1
    }, W, D, G)), K[19] = G, K[20] = W, K[21] = f;
    else f = K[21];
    return f
}
// @from(Ln 543680, Col 4)
A$
// @from(Ln 543681, Col 4)
zA5 = L(() => {
    o6();
    g6();
    yY();
    gK();
    pD();
    A$ = K6(P6(), 1)
})
// @from(Ln 543690, Col 0)
function DOA(q) {
    let K = q.getHours() % 12 || 12,
        _ = String(q.getMinutes()).padStart(2, "0"),
        z = String(q.getSeconds()).padStart(2, "0"),
        Y = q.getHours() < 12 ? "am" : "pm";
    return `${K}:${_}:${z}${Y}`
}
// @from(Ln 543698, Col 0)
function _W7() {
    let q = s(15),
        K;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) K = [], q[0] = K;
    else K = q[0];
    let [_, z] = pY8.useState(K), [Y, A] = pY8.useState(0), O, w;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) O = () => {
        let P = Z7.getSandboxViolationStore();
        return P.subscribe((D) => {
            z(D.slice(-10)), A(P.getTotalCount())
        })
    }, w = [], q[1] = O, q[2] = w;
    else O = q[1], w = q[2];
    if (pY8.useEffect(O, w), !Z7.isSandboxingEnabled() || y1() === "linux") return null;
    if (Y === 0) return null;
    let $ = Y === 1 ? "operation" : "operations",
        j;
    if (q[3] !== $ || q[4] !== Y) j = TN.createElement(u, {
        marginLeft: 0
    }, TN.createElement(T, {
        color: "permission"
    }, "⧈ Sandbox blocked ", Y, " total", " ", $)), q[3] = $, q[4] = Y, q[5] = j;
    else j = q[5];
    let H;
    if (q[6] !== _) H = _.map(ZOA), q[6] = _, q[7] = H;
    else H = q[7];
    let J = Math.min(10, _.length),
        X;
    if (q[8] !== J || q[9] !== Y) X = TN.createElement(u, {
        paddingLeft: 2
    }, TN.createElement(T, {
        dimColor: !0
    }, "… showing last ", J, " of ", Y)), q[8] = J, q[9] = Y, q[10] = X;
    else X = q[10];
    let M;
    if (q[11] !== j || q[12] !== H || q[13] !== X) M = TN.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, j, H, X), q[11] = j, q[12] = H, q[13] = X, q[14] = M;
    else M = q[14];
    return M
}
// @from(Ln 543741, Col 0)
function ZOA(q, K) {
    return TN.createElement(u, {
        key: `${q.timestamp.getTime()}-${K}`,
        paddingLeft: 2
    }, TN.createElement(T, {
        dimColor: !0
    }, DOA(q.timestamp), q.command ? ` ${q.command}:` : "", " ", q.line))
}
// @from(Ln 543749, Col 4)
TN
// @from(Ln 543749, Col 8)
pY8
// @from(Ln 543750, Col 4)
YA5 = L(() => {
    o6();
    g6();
    yY();
    NK();
    TN = K6(P6(), 1), pY8 = K6(P6(), 1)
})
// @from(Ln 543758, Col 0)
function OA5(q) {
    let K = s(4),
        {
            mcpClients: _
        } = q,
        z = _ === void 0 ? fOA : _,
        {
            addNotification: Y
        } = EK(),
        A, O;
    if (K[0] !== Y || K[1] !== z) A = () => {
        if (nK()) return;
        let w = z.filter(VOA),
            $ = z.filter(TOA),
            j = z.filter(vOA),
            H = z.filter(GOA);
        if (w.length === 0 && $.length === 0 && j.length === 0 && H.length === 0) return;
        if (w.length > 0) Y({
            key: "mcp-failed",
            jsx: WA.createElement(WA.Fragment, null, WA.createElement(T, {
                color: "error"
            }, w.length, " MCP", " ", w.length === 1 ? "server" : "servers", " failed"), WA.createElement(T, {
                dimColor: !0
            }, " · /mcp")),
            priority: "medium"
        });
        if ($.length > 0) Y({
            key: "mcp-claudeai-failed",
            jsx: WA.createElement(WA.Fragment, null, WA.createElement(T, {
                color: "error"
            }, $.length, " claude.ai", " ", $.length === 1 ? "connector" : "connectors", " ", "unavailable"), WA.createElement(T, {
                dimColor: !0
            }, " · /mcp")),
            priority: "medium"
        });
        if (j.length > 0) Y({
            key: "mcp-needs-auth",
            jsx: WA.createElement(WA.Fragment, null, WA.createElement(T, {
                color: "warning"
            }, j.length, " MCP", " ", j.length === 1 ? "server needs" : "servers need", " ", "auth"), WA.createElement(T, {
                dimColor: !0
            }, " · /mcp")),
            priority: "medium"
        });
        if (H.length > 0) Y({
            key: "mcp-claudeai-needs-auth",
            jsx: WA.createElement(WA.Fragment, null, WA.createElement(T, {
                color: "warning"
            }, H.length, " claude.ai", " ", H.length === 1 ? "connector needs" : "connectors need", " ", "auth"), WA.createElement(T, {
                dimColor: !0
            }, " · /mcp")),
            priority: "medium"
        })
    }, O = [Y, z], K[0] = Y, K[1] = z, K[2] = A, K[3] = O;
    else A = K[2], O = K[3];
    AA5.useEffect(A, O)
}
// @from(Ln 543816, Col 0)
function GOA(q) {
    return q.type === "needs-auth" && q.config.type === "claudeai-proxy" && l87(q.name)
}
// @from(Ln 543820, Col 0)
function vOA(q) {
    return q.type === "needs-auth" && q.config.type !== "claudeai-proxy"
}
// @from(Ln 543824, Col 0)
function TOA(q) {
    return q.type === "failed" && q.config.type === "claudeai-proxy" && l87(q.name)
}
// @from(Ln 543828, Col 0)
function VOA(q) {
    return q.type === "failed" && q.config.type !== "sse-ide" && q.config.type !== "ws-ide" && q.config.type !== "claudeai-proxy"
}
// @from(Ln 543831, Col 4)
WA
// @from(Ln 543831, Col 8)
AA5
// @from(Ln 543831, Col 13)
fOA
// @from(Ln 543832, Col 4)
wA5 = L(() => {
    o6();
    kY();
    y8();
    g6();
    tS6();
    WA = K6(P6(), 1), AA5 = K6(P6(), 1), fOA = []
})
// @from(Ln 543841, Col 0)
function $A5() {
    let {
        addNotification: q
    } = EK(), K = M8((A) => A.toolPermissionContext.mode), _ = M8((A) => A.toolPermissionContext.isAutoModeAvailable), z = FY8.useRef(!1), Y = FY8.useRef(K);
    FY8.useEffect(() => {
        let A = Y.current;
        if (Y.current = K, nK()) return;
        if (z.current) return;
        if (!(K === "default" && A !== "default" && A !== "auto" && !_ && VU())) return;
        let w = ge();
        if (!w) return;
        z.current = !0, q({
            key: "auto-mode-unavailable",
            text: E_6(w),
            color: "warning",
            priority: "medium"
        })
    }, [K, _, q])
}
// @from(Ln 543860, Col 4)
FY8
// @from(Ln 543861, Col 4)
jA5 = L(() => {
    kY();
    y8();
    N7();
    vX();
    a1();
    FY8 = K6(P6(), 1)
})
// @from(Ln 543870, Col 0)
function HA5() {
    let q = s(10),
        {
            addNotification: K
        } = EK(),
        _ = R7(),
        [z, Y] = oT.useState(EOA),
        A;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) A = new Set, q[0] = A;
    else A = q[0];
    let O = oT.useRef(A),
        w;
    if (q[1] !== K || q[2] !== _) w = (M, P) => {
        let W = `${M}:${P}`;
        if (O.current.has(W)) return;
        O.current.add(W), E(`LSP error: ${M} - ${P}`), _((Z) => {
            let G = new Set(Z.plugins.errors.map(NOA)),
                f = `generic-error:${M}:${P}`;
            if (G.has(f)) return Z;
            return {
                ...Z,
                plugins: {
                    ...Z.plugins,
                    errors: [...Z.plugins.errors, {
                        type: "generic-error",
                        source: M,
                        error: P
                    }]
                }
            }
        });
        let D = M.startsWith("plugin:") ? M.split(":")[1] ?? M : M;
        K({
            key: `lsp-error-${M}`,
            jsx: oT.createElement(oT.Fragment, null, oT.createElement(T, {
                color: "error"
            }, "LSP for ", D, " failed"), oT.createElement(T, {
                dimColor: !0
            }, " · /plugin for details")),
            priority: "medium",
            timeoutMs: 8000
        })
    }, q[1] = K, q[2] = _, q[3] = w;
    else w = q[3];
    let $ = w,
        j;
    if (q[4] !== $) j = () => {
        if (nK()) return;
        if (MY6()) return;
        let M = Db6();
        if (M.status === "failed") {
            $("lsp-manager", M.error.message), Y(!1);
            return
        }
        if (M.status === "pending" || M.status === "not-started") return;
        let P = F96();
        if (P) {
            let W = P.getAllServers();
            for (let [D, Z] of W)
                if (Z.state === "error" && Z.lastError) $(D, Z.lastError.message)
        }
    }, q[4] = $, q[5] = j;
    else j = q[5];
    let H = j;
    fD(H, z ? kOA : null);
    let J, X;
    if (q[6] !== H || q[7] !== z) J = () => {
        if (nK() || !z) return;
        H()
    }, X = [H, z], q[6] = H, q[7] = z, q[8] = J, q[9] = X;
    else J = q[8], X = q[9];
    oT.useEffect(J, X)
}
// @from(Ln 543944, Col 0)
function NOA(q) {
    if (q.type === "generic-error") return `generic-error:${q.source}:${q.error}`;
    return `${q.type}:${q.source}`
}
// @from(Ln 543949, Col 0)
function EOA() {
    return S6("true")
}
// @from(Ln 543952, Col 4)
oT
// @from(Ln 543952, Col 8)
kOA = 5000
// @from(Ln 543953, Col 4)
JA5 = L(() => {
    o6();
    wk();
    y8();
    kY();
    g6();
    nl();
    N7();
    K8();
    Q8();
    oT = K6(P6(), 1)
})
// @from(Ln 543965, Col 0)
async function MA5(q) {
    if (!q || !q.trim()) return E("[binaryCheck] Empty command provided, returning false"), !1;
    let K = q.trim();
    if (!yOA.test(K)) return E(`[binaryCheck] Rejected command with unsafe characters: '${K}'`), !1;
    let _ = XA5.get(K);
    if (_ !== void 0) return E(`[binaryCheck] Cache hit for '${K}': ${_}`), _;
    let z = !1;
    if (await oA(K).catch(() => null)) z = !0;
    return XA5.set(K, z), E(`[binaryCheck] Binary '${K}' ${z?"found":"not found"}`), z
}
// @from(Ln 543975, Col 4)
XA5
// @from(Ln 543975, Col 9)
yOA
// @from(Ln 543976, Col 4)
PA5 = L(() => {
    K8();
    NK();
    n0();
    XA5 = new Map, yOA = y1() === "windows" ? /^[A-Za-z0-9/\\][A-Za-z0-9_.+:\\?/-]*$/ : /^[A-Za-z0-9/][A-Za-z0-9_.+/-]*$/
})
// @from(Ln 543986, Col 0)
function ROA(q) {
    return vU.has(q.toLowerCase())
}
// @from(Ln 543990, Col 0)
function SOA(q) {
    if (!q) return null;
    if (typeof q === "string") return E("[lspRecommendation] Skipping string path lspServers (not readable from marketplace)"), null;
    if (Array.isArray(q)) {
        for (let K of q) {
            if (typeof K === "string") continue;
            let _ = DA5(K);
            if (_) return _
        }
        return null
    }
    return DA5(q)
}
// @from(Ln 544004, Col 0)
function WA5(q) {
    return typeof q === "object" && q !== null
}
// @from(Ln 544008, Col 0)
function DA5(q) {
    let K = new Set,
        _ = null;
    for (let [z, Y] of Object.entries(q)) {
        if (!WA5(Y)) continue;
        if (!_ && typeof Y.command === "string") _ = Y.command;
        let A = Y.extensionToLanguage;
        if (WA5(A))
            for (let O of Object.keys(A)) K.add(O.toLowerCase())
    }
    if (!_ || K.size === 0) return null;
    return {
        extensions: K,
        command: _
    }
}
// @from(Ln 544024, Col 0)
async function COA() {
    let q = new Map;
    try {
        let K = await Dz();
        for (let _ of Object.keys(K)) try {
            let z = await xf(_),
                Y = ROA(_);
            for (let A of z.plugins) {
                if (!A.lspServers) continue;
                let O = SOA(A.lspServers);
                if (!O) continue;
                let w = `${A.name}@${_}`;
                q.set(w, {
                    entry: A,
                    marketplaceName: _,
                    extensions: O.extensions,
                    command: O.command,
                    isOfficial: Y
                })
            }
        } catch (z) {
            E(`[lspRecommendation] Failed to load marketplace ${_}: ${z}`)
        }
    } catch (K) {
        E(`[lspRecommendation] Failed to load marketplaces config: ${K}`)
    }
    return q
}
// @from(Ln 544052, Col 0)
async function ZA5(q) {
    if (bOA()) return E("[lspRecommendation] Recommendations are disabled"), [];
    let K = LOA(q).toLowerCase();
    if (!K) return E("[lspRecommendation] No file extension found"), [];
    E(`[lspRecommendation] Looking for LSP plugins for ${K}`);
    let _ = await COA(),
        Y = H8().lspRecommendationNeverPlugins ?? [],
        A = [];
    for (let [w, $] of _) {
        if (!$.extensions.has(K)) continue;
        if (Y.includes(w)) {
            E(`[lspRecommendation] Skipping ${w} (in never suggest list)`);
            continue
        }
        if (Hu(w)) {
            E(`[lspRecommendation] Skipping ${w} (already installed)`);
            continue
        }
        A.push({
            info: $,
            pluginId: w
        })
    }
    let O = [];
    for (let {
            info: w,
            pluginId: $
        }
        of A)
        if (await MA5(w.command)) O.push({
            info: w,
            pluginId: $
        }), E(`[lspRecommendation] Binary '${w.command}' found for ${$}`);
        else E(`[lspRecommendation] Skipping ${$} (binary '${w.command}' not found)`);
    return O.sort((w, $) => {
        if (w.info.isOfficial && !$.info.isOfficial) return -1;
        if (!w.info.isOfficial && $.info.isOfficial) return 1;
        return 0
    }), O.map(({
        info: w,
        pluginId: $
    }) => ({
        pluginId: $,
        pluginName: w.entry.name,
        marketplaceName: w.marketplaceName,
        description: w.entry.description,
        isOfficial: w.isOfficial,
        extensions: Array.from(w.extensions),
        command: w.command
    }))
}
// @from(Ln 544104, Col 0)
function fA5(q) {
    d8((K) => {
        let _ = K.lspRecommendationNeverPlugins ?? [];
        if (_.includes(q)) return K;
        return {
            ...K,
            lspRecommendationNeverPlugins: [..._, q]
        }
    }), E(`[lspRecommendation] Added ${q} to never suggest`)
}
// @from(Ln 544115, Col 0)
function GA5() {
    d8((q) => {
        let K = (q.lspRecommendationIgnoredCount ?? 0) + 1;
        return {
            ...q,
            lspRecommendationIgnoredCount: K
        }
    }), E("[lspRecommendation] Incremented ignored count")
}
// @from(Ln 544125, Col 0)
function bOA() {
    let q = H8();
    return q.lspRecommendationDisabled === !0 || (q.lspRecommendationIgnoredCount ?? 0) >= hOA
}
// @from(Ln 544129, Col 4)
hOA = 5
// @from(Ln 544130, Col 4)
vA5 = L(() => {
    PA5();
    h1();
    K8();
    yD();
    m$();
    Hv()
})
// @from(Ln 544139, Col 0)
function ht8() {
    let q = s(6),
        [K, _] = kg.useState(null),
        z = kg.useRef(!1),
        Y;
    if (q[0] !== K) Y = (j) => {
        if (nK()) return;
        if (K) return;
        if (z.current) return;
        z.current = !0, j().then((H) => {
            if (H) _(H)
        }).catch(j6).finally(() => {
            z.current = !1
        })
    }, q[0] = K, q[1] = Y;
    else Y = q[1];
    let A = Y,
        O;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) O = () => _(null), q[2] = O;
    else O = q[2];
    let w = O,
        $;
    if (q[3] !== K || q[4] !== A) $ = {
        recommendation: K,
        clearRecommendation: w,
        tryResolve: A
    }, q[3] = K, q[4] = A, q[5] = $;
    else $ = q[5];
    return $
}
// @from(Ln 544169, Col 0)
async function Rt8(q, K, _, z, Y) {
    try {
        let A = await mf(q);
        if (!A) throw Error(`Plugin ${q} not found in marketplace`);
        await Y(A), z({
            key: `${_}-installed`,
            jsx: kg.createElement(T, {
                color: "success"
            }, kg.createElement(D4, {
                status: "success",
                withSpace: !0
            }), K, " installed · restart to apply"),
            priority: "immediate",
            timeoutMs: 5000
        })
    } catch (A) {
        j6(A), z({
            key: `${_}-install-failed`,
            jsx: kg.createElement(T, {
                color: "error"
            }, "Failed to install ", K),
            priority: "immediate",
            timeoutMs: 5000
        })
    }
}
// @from(Ln 544195, Col 4)
kg
// @from(Ln 544196, Col 4)
zW7 = L(() => {
    o6();
    y8();
    Y2();
    g6();
    U8();
    m$();
    kg = K6(P6(), 1)
})
// @from(Ln 544210, Col 0)
function TA5() {
    let q = s(12),
        K = M8(BOA),
        {
            addNotification: _
        } = EK(),
        z;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) z = new Set, q[0] = z;
    else z = q[0];
    let Y = St8.useRef(z),
        {
            recommendation: A,
            clearRecommendation: O,
            tryResolve: w
        } = ht8(),
        $, j;
    if (q[1] !== K || q[2] !== w) $ = () => {
        w(async () => {
            if (B81()) return null;
            let M = [];
            for (let P of K)
                if (!Y.current.has(P)) Y.current.add(P), M.push(P);
            for (let P of M) try {
                let D = (await ZA5(P))[0];
                if (D) return E(`[useLspPluginRecommendation] Found match: ${D.pluginName} for ${P}`), p81(!0), {
                    pluginId: D.pluginId,
                    pluginName: D.pluginName,
                    pluginDescription: D.description,
                    fileExtension: IOA(P),
                    shownAt: Date.now()
                }
            } catch (W) {
                j6(W)
            }
            return null
        })
    }, j = [K, w], q[1] = K, q[2] = w, q[3] = $, q[4] = j;
    else $ = q[3], j = q[4];
    St8.useEffect($, j);
    let H;
    if (q[5] !== _ || q[6] !== O || q[7] !== A) H = (M) => {
        if (!A) return;
        let {
            pluginId: P,
            pluginName: W,
            shownAt: D
        } = A;
        E(`[useLspPluginRecommendation] User response: ${M} for ${W}`);
        q: switch (M) {
            case "yes": {
                Rt8(P, W, "lsp-plugin", _, async (Z) => {
                    E(`[useLspPluginRecommendation] Installing plugin: ${P}`);
                    let G = typeof Z.entry.source === "string" ? xOA(Z.marketplaceInstallLocation, Z.entry.source) : void 0;
                    await Z68(P, Z.entry, "user", void 0, G);
                    let f = E1("userSettings");
                    P7("userSettings", {
                        enabledPlugins: {
                            ...f?.enabledPlugins,
                            [P]: !0
                        }
                    }), E(`[useLspPluginRecommendation] Plugin installed: ${P}`)
                });
                break q
            }
            case "no": {
                let Z = Date.now() - D;
                if (Z >= uOA) E(`[useLspPluginRecommendation] Timeout detected (${Z}ms), incrementing ignored count`), GA5();
                break q
            }
            case "never": {
                fA5(P);
                break q
            }
            case "disable":
                d8(mOA)
        }
        O()
    }, q[5] = _, q[6] = O, q[7] = A, q[8] = H;
    else H = q[8];
    let J = H,
        X;
    if (q[9] !== J || q[10] !== A) X = {
        recommendation: A,
        handleResponse: J
    }, q[9] = J, q[10] = A, q[11] = X;
    else X = q[11];
    return X
}
// @from(Ln 544299, Col 0)
function mOA(q) {
    if (q.lspRecommendationDisabled) return q;
    return {
        ...q,
        lspRecommendationDisabled: !0
    }
}
// @from(Ln 544307, Col 0)
function BOA(q) {
    return q.fileHistory.trackedFiles
}
// @from(Ln 544310, Col 4)
St8
// @from(Ln 544310, Col 9)
uOA = 28000
// @from(Ln 544311, Col 4)
VA5 = L(() => {
    o6();
    y8();
    kY();
    N7();
    h1();
    K8();
    U8();
    vA5();
    Y56();
    a1();
    zW7();
    St8 = K6(P6(), 1)
})
// @from(Ln 544326, Col 0)
function kA5(q) {
    let K = s(36),
        {
            pluginName: _,
            pluginDescription: z,
            fileExtension: Y,
            onResponse: A
        } = q,
        O = M9.useRef(A),
        w;
    if (K[0] !== A) w = () => {
        O.current = A
    }, K[0] = A, K[1] = w;
    else w = K[1];
    M9.useEffect(w);
    let $, j;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) $ = () => {
        let B = setTimeout(FOA, pOA, O);
        return () => clearTimeout(B)
    }, j = [], K[2] = $, K[3] = j;
    else $ = K[2], j = K[3];
    M9.useEffect($, j);
    let H;
    if (K[4] !== A) H = function(m) {
        q: switch (m) {
            case "yes": {
                A("yes");
                break q
            }
            case "no": {
                A("no");
                break q
            }
            case "never": {
                A("never");
                break q
            }
            case "disable":
                A("disable")
        }
    }, K[4] = A, K[5] = H;
    else H = K[5];
    let J = H,
        X;
    if (K[6] !== _) X = {
        label: M9.createElement(T, null, "Yes, install ", M9.createElement(T, {
            bold: !0
        }, _)),
        value: "yes"
    }, K[6] = _, K[7] = X;
    else X = K[7];
    let M;
    if (K[8] === Symbol.for("react.memo_cache_sentinel")) M = {
        label: "No, not now",
        value: "no"
    }, K[8] = M;
    else M = K[8];
    let P;
    if (K[9] !== _) P = {
        label: M9.createElement(T, null, "Never for ", M9.createElement(T, {
            bold: !0
        }, _)),
        value: "never"
    }, K[9] = _, K[10] = P;
    else P = K[10];
    let W;
    if (K[11] === Symbol.for("react.memo_cache_sentinel")) W = {
        label: "Disable all LSP recommendations",
        value: "disable"
    }, K[11] = W;
    else W = K[11];
    let D;
    if (K[12] !== X || K[13] !== P) D = [X, M, P, W], K[12] = X, K[13] = P, K[14] = D;
    else D = K[14];
    let Z = D,
        G;
    if (K[15] === Symbol.for("react.memo_cache_sentinel")) G = M9.createElement(u, {
        marginBottom: 1
    }, M9.createElement(T, {
        dimColor: !0
    }, "LSP provides code intelligence like go-to-definition and error checking")), K[15] = G;
    else G = K[15];
    let f;
    if (K[16] === Symbol.for("react.memo_cache_sentinel")) f = M9.createElement(T, {
        dimColor: !0
    }, "Plugin:"), K[16] = f;
    else f = K[16];
    let v;
    if (K[17] !== _) v = M9.createElement(u, null, f, M9.createElement(T, null, " ", _)), K[17] = _, K[18] = v;
    else v = K[18];
    let V;
    if (K[19] !== z) V = z && M9.createElement(u, null, M9.createElement(T, {
        dimColor: !0
    }, z)), K[19] = z, K[20] = V;
    else V = K[20];
    let k;
    if (K[21] === Symbol.for("react.memo_cache_sentinel")) k = M9.createElement(T, {
        dimColor: !0
    }, "Triggered by:"), K[21] = k;
    else k = K[21];
    let N;
    if (K[22] !== Y) N = M9.createElement(u, null, k, M9.createElement(T, null, " ", Y, " files")), K[22] = Y, K[23] = N;
    else N = K[23];
    let R;
    if (K[24] === Symbol.for("react.memo_cache_sentinel")) R = M9.createElement(u, {
        marginTop: 1
    }, M9.createElement(T, null, "Would you like to install this LSP plugin?")), K[24] = R;
    else R = K[24];
    let h;
    if (K[25] !== A) h = () => A("no"), K[25] = A, K[26] = h;
    else h = K[26];
    let C;
    if (K[27] !== J || K[28] !== Z || K[29] !== h) C = M9.createElement(u, null, M9.createElement(A1, {
        options: Z,
        onChange: J,
        onCancel: h
    })), K[27] = J, K[28] = Z, K[29] = h, K[30] = C;
    else C = K[30];
    let x;
    if (K[31] !== v || K[32] !== V || K[33] !== N || K[34] !== C) x = M9.createElement(IY, {
        title: "LSP Plugin Recommendation"
    }, M9.createElement(u, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1
    }, G, v, V, N, R, C)), K[31] = v, K[32] = V, K[33] = N, K[34] = C, K[35] = x;
    else x = K[35];
    return x
}
// @from(Ln 544456, Col 0)
function FOA(q) {
    return q.current("no")
}
// @from(Ln 544459, Col 4)
M9
// @from(Ln 544459, Col 8)
pOA = 30000
// @from(Ln 544460, Col 4)
NA5 = L(() => {
    o6();
    g6();
    gK();
    pD();
    M9 = K6(P6(), 1)
})
// @from(Ln 544468, Col 0)
function EA5() {
    let q = s(11),
        K = Ct8.useSyncExternalStore(nZ4, MQ1),
        {
            addNotification: _
        } = EK(),
        {
            recommendation: z,
            clearRecommendation: Y,
            tryResolve: A
        } = ht8(),
        O, w;
    if (q[0] !== K || q[1] !== A) O = () => {
        if (!K) return;
        A(async () => {
            let J = await GEK(K);
            if (J) E(`[useClaudeCodeHintRecommendation] surfacing ${J.pluginId} from ${J.sourceCommand}`), lZ4();
            if (MQ1() === K) cZ4();
            return J
        })
    }, w = [K, A], q[0] = K, q[1] = A, q[2] = O, q[3] = w;
    else O = q[2], w = q[3];
    Ct8.useEffect(O, w);
    let $;
    if (q[4] !== _ || q[5] !== Y || q[6] !== z) $ = (J) => {
        if (!z) return;
        vEK(z.pluginId), d("tengu_plugin_hint_response", {
            _PROTO_plugin_name: z.pluginName,
            _PROTO_marketplace_name: z.marketplaceName,
            response: J
        });
        q: switch (J) {
            case "yes": {
                let {
                    pluginId: X,
                    pluginName: M,
                    marketplaceName: P
                } = z;
                Rt8(X, M, "hint-plugin", _, async (W) => {
                    let D = await z56({
                        pluginId: X,
                        entry: W.entry,
                        marketplaceName: P,
                        scope: "user",
                        trigger: "hint"
                    });
                    if (!D.success) throw Error(D.error)
                });
                break q
            }
            case "disable": {
                TEK();
                break q
            }
            case "no":
        }
        Y()
    }, q[4] = _, q[5] = Y, q[6] = z, q[7] = $;
    else $ = q[7];
    let j = $,
        H;
    if (q[8] !== j || q[9] !== z) H = {
        recommendation: z,
        handleResponse: j
    }, q[8] = j, q[9] = z, q[10] = H;
    else H = q[10];
    return H
}
// @from(Ln 544536, Col 4)
Ct8
// @from(Ln 544537, Col 4)
yA5 = L(() => {
    o6();
    kY();
    C8();
    q68();
    K8();
    Rc8();
    Y56();
    zW7();
    Ct8 = K6(P6(), 1)
})
// @from(Ln 544549, Col 0)
function LA5(q) {
    let K = s(35),
        {
            pluginName: _,
            pluginDescription: z,
            marketplaceName: Y,
            sourceCommand: A,
            onResponse: O
        } = q,
        w = F9.useRef(O),
        $;
    if (K[0] !== O) $ = () => {
        w.current = O
    }, K[0] = O, K[1] = $;
    else $ = K[1];
    F9.useEffect($);
    let j, H;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) j = () => {
        let B = setTimeout(UOA, gOA, w);
        return () => clearTimeout(B)
    }, H = [], K[2] = j, K[3] = H;
    else j = K[2], H = K[3];
    F9.useEffect(j, H);
    let J;
    if (K[4] !== O) J = function(m) {
        q: switch (m) {
            case "yes": {
                O("yes");
                break q
            }
            case "disable": {
                O("disable");
                break q
            }
            default:
                O("no")
        }
    }, K[4] = O, K[5] = J;
    else J = K[5];
    let X = J,
        M;
    if (K[6] !== _) M = {
        label: F9.createElement(T, null, "Yes, install ", F9.createElement(T, {
            bold: !0
        }, _)),
        value: "yes"
    }, K[6] = _, K[7] = M;
    else M = K[7];
    let P, W;
    if (K[8] === Symbol.for("react.memo_cache_sentinel")) P = {
        label: "No",
        value: "no"
    }, W = {
        label: "No, and don't show plugin installation hints again",
        value: "disable"
    }, K[8] = P, K[9] = W;
    else P = K[8], W = K[9];
    let D;
    if (K[10] !== M) D = [M, P, W], K[10] = M, K[11] = D;
    else D = K[11];
    let Z = D,
        G;
    if (K[12] !== A) G = F9.createElement(u, {
        marginBottom: 1
    }, F9.createElement(T, {
        dimColor: !0
    }, "The ", F9.createElement(T, {
        bold: !0
    }, A), " command suggests installing a plugin.")), K[12] = A, K[13] = G;
    else G = K[13];
    let f;
    if (K[14] === Symbol.for("react.memo_cache_sentinel")) f = F9.createElement(T, {
        dimColor: !0
    }, "Plugin:"), K[14] = f;
    else f = K[14];
    let v;
    if (K[15] !== _) v = F9.createElement(u, null, f, F9.createElement(T, null, " ", _)), K[15] = _, K[16] = v;
    else v = K[16];
    let V;
    if (K[17] === Symbol.for("react.memo_cache_sentinel")) V = F9.createElement(T, {
        dimColor: !0
    }, "Marketplace:"), K[17] = V;
    else V = K[17];
    let k;
    if (K[18] !== Y) k = F9.createElement(u, null, V, F9.createElement(T, null, " ", Y)), K[18] = Y, K[19] = k;
    else k = K[19];
    let N;
    if (K[20] !== z) N = z && F9.createElement(u, null, F9.createElement(T, {
        dimColor: !0
    }, z)), K[20] = z, K[21] = N;
    else N = K[21];
    let R;
    if (K[22] === Symbol.for("react.memo_cache_sentinel")) R = F9.createElement(u, {
        marginTop: 1
    }, F9.createElement(T, null, "Would you like to install it?")), K[22] = R;
    else R = K[22];
    let h;
    if (K[23] !== O) h = () => O("no"), K[23] = O, K[24] = h;
    else h = K[24];
    let C;
    if (K[25] !== X || K[26] !== Z || K[27] !== h) C = F9.createElement(u, null, F9.createElement(A1, {
        options: Z,
        onChange: X,
        onCancel: h
    })), K[25] = X, K[26] = Z, K[27] = h, K[28] = C;
    else C = K[28];
    let x;
    if (K[29] !== v || K[30] !== k || K[31] !== N || K[32] !== C || K[33] !== G) x = F9.createElement(IY, {
        title: "Plugin Recommendation"
    }, F9.createElement(u, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1
    }, G, v, k, N, R, C)), K[29] = v, K[30] = k, K[31] = N, K[32] = C, K[33] = G, K[34] = x;
    else x = K[34];
    return x
}
// @from(Ln 544667, Col 0)
function UOA(q) {
    return q.current("no")
}
// @from(Ln 544670, Col 4)
F9
// @from(Ln 544670, Col 8)
gOA = 30000
// @from(Ln 544671, Col 4)
hA5 = L(() => {
    o6();
    g6();
    gK();
    pD();
    F9 = K6(P6(), 1)
})
// @from(Ln 544679, Col 0)
function SA5() {
    let q = s(20),
        {
            addNotification: K
        } = EK(),
        _ = M8(cOA),
        z;
    q: {
        if (!_) {
            let W;
            if (q[0] === Symbol.for("react.memo_cache_sentinel")) W = {
                totalFailed: 0,
                failedMarketplacesCount: 0,
                failedPluginsCount: 0
            }, q[0] = W;
            else W = q[0];
            z = W;
            break q
        }
        let j;
        if (q[1] !== _.marketplaces) j = _.marketplaces.filter(dOA),
        q[1] = _.marketplaces,
        q[2] = j;
        else j = q[2];
        let H = j,
            J;
        if (q[3] !== _.plugins) J = _.plugins.filter(QOA),
        q[3] = _.plugins,
        q[4] = J;
        else J = q[4];
        let X = J,
            M = H.length + X.length,
            P;
        if (q[5] !== H.length || q[6] !== X.length || q[7] !== M) P = {
            totalFailed: M,
            failedMarketplacesCount: H.length,
            failedPluginsCount: X.length
        },
        q[5] = H.length,
        q[6] = X.length,
        q[7] = M,
        q[8] = P;
        else P = q[8];z = P
    }
    let {
        totalFailed: Y,
        failedMarketplacesCount: A,
        failedPluginsCount: O
    } = z, w;
    if (q[9] !== K || q[10] !== A || q[11] !== O || q[12] !== _ || q[13] !== Y) w = () => {
        if (nK()) return;
        if (!_) {
            E("No installation status to monitor");
            return
        }
        if (Y === 0) return;
        if (E(`Plugin installation status: ${A} failed marketplaces, ${O} failed plugins`), Y === 0) return;
        E(`Adding notification for ${Y} failed installations`), K({
            key: "plugin-install-failed",
            jsx: an.createElement(an.Fragment, null, an.createElement(T, {
                color: "error"
            }, Y, " ", O7(Y, "plugin"), " failed to install"), an.createElement(T, {
                dimColor: !0
            }, " · /plugin for details")),
            priority: "medium"
        })
    }, q[9] = K, q[10] = A, q[11] = O, q[12] = _, q[13] = Y, q[14] = w;
    else w = q[14];
    let $;
    if (q[15] !== K || q[16] !== A || q[17] !== O || q[18] !== Y) $ = [K, Y, A, O], q[15] = K, q[16] = A, q[17] = O, q[18] = Y, q[19] = $;
    else $ = q[19];
    RA5.useEffect(w, $)
}
// @from(Ln 544753, Col 0)
function QOA(q) {
    return q.status === "failed"
}
// @from(Ln 544757, Col 0)
function dOA(q) {
    return q.status === "failed"
}
// @from(Ln 544761, Col 0)
function cOA(q) {
    return q.plugins.installationStatus
}
// @from(Ln 544764, Col 4)
an
// @from(Ln 544764, Col 8)
RA5
// @from(Ln 544765, Col 4)
CA5 = L(() => {
    o6();
    y8();
    kY();
    g6();
    N7();
    K8();
    an = K6(P6(), 1), RA5 = K6(P6(), 1)
})
// @from(Ln 544775, Col 0)
function bA5() {
    let q = s(7),
        {
            addNotification: K
        } = EK(),
        _;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) _ = [], q[0] = _;
    else _ = q[0];
    let [z, Y] = gY8.useState(_), A, O;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) A = () => {
        if (nK()) return;
        return qFK((H) => {
            E(`Plugin autoupdate notification: ${H.length} plugin(s) updated`), Y(H)
        })
    }, O = [], q[1] = A, q[2] = O;
    else A = q[1], O = q[2];
    gY8.useEffect(A, O);
    let w, $;
    if (q[3] !== K || q[4] !== z) w = () => {
        if (nK()) return;
        if (z.length === 0) return;
        let j = z.map(lOA),
            H = j.length <= 2 ? j.join(" and ") : `${j.length} plugins`;
        K({
            key: "plugin-autoupdate-restart",
            jsx: sn.createElement(sn.Fragment, null, sn.createElement(T, {
                color: "success"
            }, j.length === 1 ? "Plugin" : "Plugins", " updated:", " ", H), sn.createElement(T, {
                dimColor: !0
            }, " · Run /reload-plugins to apply")),
            priority: "low",
            timeoutMs: 1e4
        }), E(`Showing plugin autoupdate notification for: ${j.join(", ")}`)
    }, $ = [z, K], q[3] = K, q[4] = z, q[5] = w, q[6] = $;
    else w = q[5], $ = q[6];
    gY8.useEffect(w, $)
}
// @from(Ln 544813, Col 0)
function lOA(q) {
    let K = q.indexOf("@");
    return K > 0 ? q.substring(0, K) : q
}
// @from(Ln 544817, Col 4)
sn
// @from(Ln 544817, Col 8)
gY8
// @from(Ln 544818, Col 4)
IA5 = L(() => {
    o6();
    y8();
    kY();
    g6();
    K8();
    gi8();
    sn = K6(P6(), 1), gY8 = K6(P6(), 1)
})
// @from(Ln 544832, Col 0)
function YW7(q, K, _) {
    let z = [],
        Y = [],
        A = [];
    for (let [O, w] of Object.entries(q)) {
        let $ = K[O],
            j = xA5(w.source, _?.projectRoot);
        if (!$) z.push(O);
        else if (w.sourceIsFallback) A.push(O);
        else if (!f$(j, $.source)) Y.push({
            name: O,
            declaredSource: j,
            materializedSource: $.source
        });
        else A.push(O)
    }
    return {
        missing: z,
        sourceChanged: Y,
        upToDate: A
    }
}