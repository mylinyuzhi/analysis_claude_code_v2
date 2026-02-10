
// @from(Ln 320790, Col 0)
function UGY() {
    return Kx4.sample(["Got it.", "Good to know.", "Noted."])
}
// @from(Ln 320794, Col 0)
function Yx4(A) {
    let q = e(10),
        {
            text: K,
            addMargin: Y
        } = A,
        z;
    if (q[0] !== K) z = C4(K, "user-memory-input"), q[0] = K, q[1] = z;
    else z = q[1];
    let w = z,
        H;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) H = UGY(), q[2] = H;
    else H = q[2];
    let $ = H;
    if (!w) return null;
    let O = Y ? 1 : 0,
        _;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) _ = nv.createElement(V, {
        color: "remember",
        backgroundColor: "memoryBackgroundColor"
    }, "#"), q[3] = _;
    else _ = q[3];
    let J;
    if (q[4] !== w) J = nv.createElement(I, null, _, nv.createElement(V, {
        backgroundColor: "memoryBackgroundColor",
        color: "text"
    }, " ", w, " ")), q[4] = w, q[5] = J;
    else J = q[5];
    let X;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) X = nv.createElement(HA, {
        height: 1
    }, nv.createElement(V, {
        dimColor: !0
    }, $)), q[6] = X;
    else X = q[6];
    let D;
    if (q[7] !== O || q[8] !== J) D = nv.createElement(I, {
        flexDirection: "column",
        marginTop: O,
        width: "100%"
    }, J, X), q[7] = O, q[8] = J, q[9] = D;
    else D = q[9];
    return D
}
// @from(Ln 320838, Col 4)
nv
// @from(Ln 320838, Col 8)
Kx4
// @from(Ln 320839, Col 4)
zx4 = v(() => {
    i1();
    m1();
    N8();
    eq();
    nv = o(X1(), 1), Kx4 = o(qx4(), 1)
})
// @from(Ln 320847, Col 0)
function $Q1(A) {
    let q = e(10),
        {
            elapsedTimeSeconds: K,
            timeoutMs: Y
        } = A;
    if (K === void 0 && !Y) return null;
    let z;
    if (q[0] !== Y) z = Y ? Xz(Y, {
        hideTrailingZeros: !0
    }) : void 0, q[0] = Y, q[1] = z;
    else z = q[1];
    let w = z;
    if (K === void 0) {
        let X = `(timeout ${w})`,
            D;
        if (q[2] !== X) D = MM6.default.createElement(V, {
            dimColor: !0
        }, X), q[2] = X, q[3] = D;
        else D = q[3];
        return D
    }
    let H = K * 1000,
        $;
    if (q[4] !== H) $ = Xz(H), q[4] = H, q[5] = $;
    else $ = q[5];
    let O = $;
    if (w) {
        let X = `(${O} · timeout ${w})`,
            D;
        if (q[6] !== X) D = MM6.default.createElement(V, {
            dimColor: !0
        }, X), q[6] = X, q[7] = D;
        else D = q[7];
        return D
    }
    let _ = `(${O})`,
        J;
    if (q[8] !== _) J = MM6.default.createElement(V, {
        dimColor: !0
    }, _), q[8] = _, q[9] = J;
    else J = q[9];
    return J
}
// @from(Ln 320891, Col 4)
MM6
// @from(Ln 320892, Col 4)
kvA = v(() => {
    i1();
    m1();
    vq();
    MM6 = o(X1(), 1)
})
// @from(Ln 320899, Col 0)
function pGY(A) {
    if (!A.match(/<sandbox_violations>([\s\S]*?)<\/sandbox_violations>/)) return {
        cleanedStderr: A
    };
    return {
        cleanedStderr: Fw6(A).trim()
    }
}
// @from(Ln 320908, Col 0)
function dGY(A) {
    let q = A.match(wx4);
    if (!q) return {
        cleanedStderr: A,
        cwdResetWarning: null
    };
    let K = q[1] ?? null;
    return {
        cleanedStderr: A.replace(wx4, "").trim(),
        cwdResetWarning: K
    }
}
// @from(Ln 320921, Col 0)
function q51(A) {
    let q = e(34),
        {
            content: K,
            verbose: Y,
            timeoutMs: z
        } = A,
        {
            stdout: w,
            stderr: H,
            isImage: $,
            returnCodeInterpretation: O,
            noOutputExpected: _,
            backgroundTaskId: J
        } = K,
        X, D, j, M, P, W, G;
    if (q[0] !== $ || q[1] !== H || q[2] !== w || q[3] !== Y) {
        G = Symbol.for("react.early_return_sentinel");
        A: {
            let {
                cleanedStderr: k
            } = pGY(H);
            if ({
                    cleanedStderr: j,
                    cwdResetWarning: D
                } = dGY(k), $) {
                let y;
                if (q[11] === Symbol.for("react.memo_cache_sentinel")) y = QZ.default.createElement(HA, {
                    height: 1
                }, QZ.default.createElement(V, {
                    dimColor: !0
                }, "[Image data detected and sent to Claude]")), q[11] = y;
                else y = q[11];
                G = y;
                break A
            }
            if (X = I, M = "column", q[12] !== w || q[13] !== Y) P = w !== "" ? QZ.default.createElement(PB, {
                content: w,
                verbose: Y
            }) : null,
            q[12] = w,
            q[13] = Y,
            q[14] = P;
            else P = q[14];W = j.trim() !== "" ? QZ.default.createElement(PB, {
                content: j,
                verbose: Y,
                isError: !0
            }) : null
        }
        q[0] = $, q[1] = H, q[2] = w, q[3] = Y, q[4] = X, q[5] = D, q[6] = j, q[7] = M, q[8] = P, q[9] = W, q[10] = G
    } else X = q[4], D = q[5], j = q[6], M = q[7], P = q[8], W = q[9], G = q[10];
    if (G !== Symbol.for("react.early_return_sentinel")) return G;
    let f;
    if (q[15] !== D) f = D ? QZ.default.createElement(HA, null, QZ.default.createElement(V, {
        dimColor: !0
    }, D)) : null, q[15] = D, q[16] = f;
    else f = q[16];
    let Z;
    if (q[17] !== J || q[18] !== D || q[19] !== _ || q[20] !== O || q[21] !== j || q[22] !== w) Z = w === "" && j.trim() === "" && !D ? QZ.default.createElement(HA, {
        height: 1
    }, QZ.default.createElement(V, {
        dimColor: !0
    }, J ? QZ.default.createElement(QZ.default.Fragment, null, "Running in the background", " ", QZ.default.createElement(YA, {
        shortcut: "↓",
        action: "manage",
        parens: !0
    })) : O || (_ ? "Done" : "(No output)"))) : null, q[17] = J, q[18] = D, q[19] = _, q[20] = O, q[21] = j, q[22] = w, q[23] = Z;
    else Z = q[23];
    let N;
    if (q[24] !== z) N = z && QZ.default.createElement(HA, null, QZ.default.createElement($Q1, {
        timeoutMs: z
    })), q[24] = z, q[25] = N;
    else N = q[25];
    let T;
    if (q[26] !== X || q[27] !== M || q[28] !== P || q[29] !== W || q[30] !== f || q[31] !== Z || q[32] !== N) T = QZ.default.createElement(X, {
        flexDirection: M
    }, P, W, f, Z, N), q[26] = X, q[27] = M, q[28] = P, q[29] = W, q[30] = f, q[31] = Z, q[32] = N, q[33] = T;
    else T = q[33];
    return T
}
// @from(Ln 321001, Col 4)
QZ
// @from(Ln 321001, Col 8)
wx4
// @from(Ln 321002, Col 4)
PM6 = v(() => {
    i1();
    m1();
    H01();
    eq();
    wK();
    kvA();
    QZ = o(X1(), 1), wx4 = /(?:^|\n)(Shell cwd was reset to .+)$/
})
// @from(Ln 321012, Col 0)
function Hx4(A) {
    let q = e(10),
        {
            content: K,
            verbose: Y
        } = A,
        z;
    if (q[0] !== K) z = C4(K, "bash-stdout") ?? "", q[0] = K, q[1] = z;
    else z = q[1];
    let w = z,
        H;
    if (q[2] !== K) H = C4(K, "bash-stderr") ?? "", q[2] = K, q[3] = H;
    else H = q[3];
    let $ = H,
        O;
    if (q[4] !== $ || q[5] !== w) O = {
        stdout: w,
        stderr: $
    }, q[4] = $, q[5] = w, q[6] = O;
    else O = q[6];
    let _ = !!Y,
        J;
    if (q[7] !== O || q[8] !== _) J = LvA.createElement(q51, {
        content: O,
        verbose: _
    }), q[7] = O, q[8] = _, q[9] = J;
    else J = q[9];
    return J
}
// @from(Ln 321041, Col 4)
LvA
// @from(Ln 321042, Col 4)
$x4 = v(() => {
    i1();
    PM6();
    N8();
    LvA = o(X1(), 1)
})
// @from(Ln 321049, Col 0)
function _x4(A) {
    let q = e(4),
        {
            content: K
        } = A,
        Y, z;
    if (q[0] !== K) {
        z = Symbol.for("react.early_return_sentinel");
        A: {
            let w = C4(K, "local-command-stdout"),
                H = C4(K, "local-command-stderr");
            if (!w && !H) {
                let $;
                if (q[3] === Symbol.for("react.memo_cache_sentinel")) $ = zP.createElement(HA, null, zP.createElement(V, {
                    dimColor: !0
                }, iv)), q[3] = $;
                else $ = q[3];
                z = $;
                break A
            }
            if (Y = [], w?.trim()) Y.push(zP.createElement(Ox4, {
                key: "stdout"
            }, w.trim()));
            if (H?.trim()) Y.push(zP.createElement(Ox4, {
                key: "stderr",
                isError: !0
            }, H.trim()))
        }
        q[0] = K, q[1] = Y, q[2] = z
    } else Y = q[1], z = q[2];
    if (z !== Symbol.for("react.early_return_sentinel")) return z;
    return Y
}
// @from(Ln 321083, Col 0)
function Ox4(A) {
    let q = e(7),
        {
            children: K,
            isError: Y
        } = A,
        z = Y ? "error" : "text",
        w;
    if (q[0] !== z) w = zP.createElement(V, {
        color: z
    }, "  ⎿  "), q[0] = z, q[1] = w;
    else w = q[1];
    let H;
    if (q[2] !== K) H = zP.createElement(I, {
        flexDirection: "column",
        flexGrow: 1
    }, zP.createElement(TJ, null, K)), q[2] = K, q[3] = H;
    else H = q[3];
    let $;
    if (q[4] !== w || q[5] !== H) $ = zP.createElement(I, {
        flexDirection: "row"
    }, w, H), q[4] = w, q[5] = H, q[6] = $;
    else $ = q[6];
    return $
}
// @from(Ln 321108, Col 4)
zP
// @from(Ln 321109, Col 4)
Jx4 = v(() => {
    i1();
    N8();
    m1();
    eq();
    uh();
    zP = o(X1(), 1)
})
// @from(Ln 321118, Col 0)
function K51(A) {
    let q = e(8),
        {
            param: K,
            addMargin: Y
        } = A,
        {
            text: z
        } = K,
        w;
    if (q[0] !== z) w = C4(z, "background-task-input"), q[0] = z, q[1] = w;
    else w = q[1];
    let H = w;
    if (!H) return null;
    let $ = Y ? 1 : 0,
        O;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) O = kd.createElement(V, {
        color: "background"
    }, "&"), q[2] = O;
    else O = q[2];
    let _;
    if (q[3] !== H) _ = kd.createElement(I, null, O, kd.createElement(V, {
        dimColor: !0
    }, " ", H)), q[3] = H, q[4] = _;
    else _ = q[4];
    let J;
    if (q[5] !== $ || q[6] !== _) J = kd.createElement(I, {
        flexDirection: "column",
        marginTop: $,
        width: "100%"
    }, _), q[5] = $, q[6] = _, q[7] = J;
    else J = q[7];
    return J
}
// @from(Ln 321152, Col 4)
kd
// @from(Ln 321153, Col 4)
RvA = v(() => {
    i1();
    m1();
    N8();
    kd = o(X1(), 1)
})
// @from(Ln 321160, Col 0)
function Xx4(A) {
    let q = e(4),
        {
            content: K
        } = A,
        Y;
    if (q[0] !== K) Y = C4(K, "background-task-output") ?? "", q[0] = K, q[1] = Y;
    else Y = q[1];
    let z = Y,
        w;
    if (q[2] !== z) w = OQ1.createElement(HA, null, OQ1.createElement(V, {
        dimColor: !0
    }, z)), q[2] = z, q[3] = w;
    else w = q[3];
    return w
}
// @from(Ln 321176, Col 4)
OQ1
// @from(Ln 321177, Col 4)
Dx4 = v(() => {
    i1();
    m1();
    N8();
    eq();
    OQ1 = o(X1(), 1)
})
// @from(Ln 321185, Col 0)
function UP1() {
    return `claude-swarm-${process.pid}`
}
// @from(Ln 321188, Col 4)
K2 = "team-lead"
// @from(Ln 321189, Col 4)
WN = "claude-swarm"
// @from(Ln 321190, Col 4)
gP1 = "swarm-view"
// @from(Ln 321191, Col 4)
iW = "tmux"
// @from(Ln 321192, Col 4)
yvA = "claude-hidden"
// @from(Ln 321193, Col 4)
pP1 = "CLAUDE_CODE_TEAMMATE_COMMAND"
// @from(Ln 321194, Col 4)
jx4
// @from(Ln 321194, Col 9)
cGY
// @from(Ln 321194, Col 14)
Bow
// @from(Ln 321194, Col 19)
mow
// @from(Ln 321194, Col 24)
lGY
// @from(Ln 321194, Col 29)
Fow
// @from(Ln 321194, Col 34)
Qow
// @from(Ln 321194, Col 39)
iGY
// @from(Ln 321194, Col 44)
nGY
// @from(Ln 321194, Col 49)
rGY
// @from(Ln 321194, Col 54)
oGY
// @from(Ln 321194, Col 59)
Mx4
// @from(Ln 321194, Col 64)
aGY
// @from(Ln 321194, Col 69)
sGY
// @from(Ln 321194, Col 74)
gow
// @from(Ln 321194, Col 79)
Uow
// @from(Ln 321194, Col 84)
dP1
// @from(Ln 321194, Col 89)
CvA
// @from(Ln 321194, Col 94)
SvA
// @from(Ln 321194, Col 99)
hvA
// @from(Ln 321194, Col 104)
pow
// @from(Ln 321194, Col 109)
cP1
// @from(Ln 321194, Col 114)
tGY
// @from(Ln 321194, Col 119)
dow
// @from(Ln 321194, Col 124)
gZ
// @from(Ln 321194, Col 128)
eGY
// @from(Ln 321194, Col 133)
AZY
// @from(Ln 321194, Col 138)
qZY
// @from(Ln 321194, Col 143)
KZY
// @from(Ln 321194, Col 148)
YZY
// @from(Ln 321194, Col 153)
zZY
// @from(Ln 321194, Col 158)
wZY
// @from(Ln 321194, Col 163)
HZY
// @from(Ln 321194, Col 168)
$ZY
// @from(Ln 321194, Col 173)
OZY
// @from(Ln 321194, Col 178)
_ZY
// @from(Ln 321194, Col 183)
JZY
// @from(Ln 321194, Col 188)
XZY
// @from(Ln 321194, Col 193)
DZY
// @from(Ln 321194, Col 198)
jZY
// @from(Ln 321194, Col 203)
MZY
// @from(Ln 321194, Col 208)
PZY
// @from(Ln 321194, Col 213)
cow
// @from(Ln 321194, Col 218)
WZY
// @from(Ln 321194, Col 223)
GZY
// @from(Ln 321194, Col 228)
ZZY
// @from(Ln 321194, Col 233)
fZY
// @from(Ln 321194, Col 238)
VZY
// @from(Ln 321194, Col 243)
NZY
// @from(Ln 321194, Col 248)
TZY
// @from(Ln 321194, Col 253)
vZY
// @from(Ln 321194, Col 258)
EZY
// @from(Ln 321194, Col 263)
kZY
// @from(Ln 321194, Col 268)
LZY
// @from(Ln 321194, Col 273)
low
// @from(Ln 321194, Col 278)
iow
// @from(Ln 321194, Col 283)
now
// @from(Ln 321194, Col 288)
row
// @from(Ln 321194, Col 293)
RZY
// @from(Ln 321194, Col 298)
oow
// @from(Ln 321194, Col 303)
aow
// @from(Ln 321194, Col 308)
sow
// @from(Ln 321194, Col 313)
tow
// @from(Ln 321194, Col 318)
yZY
// @from(Ln 321194, Col 323)
CZY
// @from(Ln 321194, Col 328)
SZY
// @from(Ln 321194, Col 333)
oD
// @from(Ln 321194, Col 337)
Px4
// @from(Ln 321194, Col 342)
hZY
// @from(Ln 321194, Col 347)
IZY
// @from(Ln 321194, Col 352)
Wx4
// @from(Ln 321194, Col 357)
xZY
// @from(Ln 321194, Col 362)
bZY
// @from(Ln 321194, Col 367)
uZY
// @from(Ln 321194, Col 372)
eow
// @from(Ln 321194, Col 377)
Aaw
// @from(Ln 321194, Col 382)
Gx4
// @from(Ln 321194, Col 387)
BZY
// @from(Ln 321194, Col 392)
mZY
// @from(Ln 321194, Col 397)
FZY
// @from(Ln 321194, Col 402)
QZY
// @from(Ln 321194, Col 407)
gZY
// @from(Ln 321194, Col 412)
UZY
// @from(Ln 321194, Col 417)
pZY
// @from(Ln 321194, Col 422)
dZY
// @from(Ln 321194, Col 427)
cZY
// @from(Ln 321194, Col 432)
lZY
// @from(Ln 321194, Col 437)
iZY
// @from(Ln 321194, Col 442)
nZY
// @from(Ln 321194, Col 447)
rZY
// @from(Ln 321194, Col 452)
oZY
// @from(Ln 321194, Col 457)
aZY
// @from(Ln 321194, Col 462)
qaw
// @from(Ln 321195, Col 4)
Zx4 = v(() => {
    i7();
    jx4 = u.object({
        inputTokens: u.number(),
        outputTokens: u.number(),
        cacheReadInputTokens: u.number(),
        cacheCreationInputTokens: u.number(),
        webSearchRequests: u.number(),
        costUSD: u.number(),
        contextWindow: u.number(),
        maxOutputTokens: u.number()
    }), cGY = u.literal("json_schema"), Bow = u.object({
        type: cGY
    }), mow = u.object({
        type: u.literal("json_schema"),
        schema: u.record(u.string(), u.unknown())
    }), lGY = u.enum(["user", "project", "org", "temporary"]), Fow = u.enum(["local", "user", "project"]).describe("Config scope for settings."), Qow = u.literal("context-1m-2025-08-07"), iGY = u.object({
        type: u.literal("stdio").optional(),
        command: u.string(),
        args: u.array(u.string()).optional(),
        env: u.record(u.string(), u.string()).optional()
    }), nGY = u.object({
        type: u.literal("sse"),
        url: u.string(),
        headers: u.record(u.string(), u.string()).optional()
    }), rGY = u.object({
        type: u.literal("http"),
        url: u.string(),
        headers: u.record(u.string(), u.string()).optional()
    }), oGY = u.object({
        type: u.literal("sdk"),
        name: u.string()
    }), Mx4 = u.union([iGY, nGY, rGY, oGY]), aGY = u.object({
        type: u.literal("claudeai-proxy"),
        url: u.string(),
        id: u.string()
    }), sGY = u.union([Mx4, aGY]), gow = u.object({
        name: u.string().describe("Server name as configured"),
        status: u.enum(["connected", "failed", "needs-auth", "pending", "disabled"]).describe("Current connection status"),
        serverInfo: u.object({
            name: u.string(),
            version: u.string()
        }).optional().describe("Server information (available when connected)"),
        error: u.string().optional().describe("Error message (available when status is 'failed')"),
        config: sGY.optional().describe("Server configuration (includes URL for HTTP/SSE servers)"),
        scope: u.string().optional().describe("Configuration scope (e.g., project, user, local, claudeai, managed)"),
        tools: u.array(u.object({
            name: u.string(),
            description: u.string().optional(),
            annotations: u.object({
                readOnly: u.boolean().optional(),
                destructive: u.boolean().optional(),
                openWorld: u.boolean().optional()
            }).optional()
        })).optional().describe("Tools provided by this server (available when connected)")
    }).describe("Status information for an MCP server connection."), Uow = u.object({
        added: u.array(u.string()).describe("Names of servers that were added"),
        removed: u.array(u.string()).describe("Names of servers that were removed"),
        errors: u.record(u.string(), u.string()).describe("Map of server names to error messages for servers that failed to connect")
    }).describe("Result of a setMcpServers operation."), dP1 = u.enum(["userSettings", "projectSettings", "localSettings", "session", "cliArg"]), CvA = u.enum(["allow", "deny", "ask"]), SvA = u.object({
        toolName: u.string(),
        ruleContent: u.string().optional()
    }), hvA = u.discriminatedUnion("type", [u.object({
        type: u.literal("addRules"),
        rules: u.array(SvA),
        behavior: CvA,
        destination: dP1
    }), u.object({
        type: u.literal("replaceRules"),
        rules: u.array(SvA),
        behavior: CvA,
        destination: dP1
    }), u.object({
        type: u.literal("removeRules"),
        rules: u.array(SvA),
        behavior: CvA,
        destination: dP1
    }), u.object({
        type: u.literal("setMode"),
        mode: u.lazy(() => cP1),
        destination: dP1
    }), u.object({
        type: u.literal("addDirectories"),
        directories: u.array(u.string()),
        destination: dP1
    }), u.object({
        type: u.literal("removeDirectories"),
        directories: u.array(u.string()),
        destination: dP1
    })]), pow = u.union([u.object({
        behavior: u.literal("allow"),
        updatedInput: u.record(u.string(), u.unknown()).optional(),
        updatedPermissions: u.array(hvA).optional(),
        toolUseID: u.string().optional()
    }), u.object({
        behavior: u.literal("deny"),
        message: u.string(),
        interrupt: u.boolean().optional(),
        toolUseID: u.string().optional()
    })]), cP1 = u.enum(["default", "acceptEdits", "bypassPermissions", "plan", "delegate", "dontAsk"]).describe("Permission mode for controlling how tool executions are handled. 'default' - Standard behavior, prompts for dangerous operations. 'acceptEdits' - Auto-accept file edit operations. 'bypassPermissions' - Bypass all permission checks (requires allowDangerouslySkipPermissions). 'plan' - Planning mode, no actual tool execution. 'delegate' - Delegate mode, restricts team leader to only Teammate and Task tools. 'dontAsk' - Don't prompt for permissions, deny if not pre-approved."), tGY = ["PreToolUse", "PostToolUse", "PostToolUseFailure", "Notification", "UserPromptSubmit", "SessionStart", "SessionEnd", "Stop", "SubagentStart", "SubagentStop", "PreCompact", "PermissionRequest", "Setup", "TeammateIdle", "TaskCompleted"], dow = u.enum(tGY), gZ = u.object({
        session_id: u.string(),
        transcript_path: u.string(),
        cwd: u.string(),
        permission_mode: u.string().optional()
    }), eGY = gZ.and(u.object({
        hook_event_name: u.literal("PreToolUse"),
        tool_name: u.string(),
        tool_input: u.unknown(),
        tool_use_id: u.string()
    })), AZY = gZ.and(u.object({
        hook_event_name: u.literal("PermissionRequest"),
        tool_name: u.string(),
        tool_input: u.unknown(),
        permission_suggestions: u.array(hvA).optional()
    })), qZY = gZ.and(u.object({
        hook_event_name: u.literal("PostToolUse"),
        tool_name: u.string(),
        tool_input: u.unknown(),
        tool_response: u.unknown(),
        tool_use_id: u.string()
    })), KZY = gZ.and(u.object({
        hook_event_name: u.literal("PostToolUseFailure"),
        tool_name: u.string(),
        tool_input: u.unknown(),
        tool_use_id: u.string(),
        error: u.string(),
        is_interrupt: u.boolean().optional()
    })), YZY = gZ.and(u.object({
        hook_event_name: u.literal("Notification"),
        message: u.string(),
        title: u.string().optional(),
        notification_type: u.string()
    })), zZY = gZ.and(u.object({
        hook_event_name: u.literal("UserPromptSubmit"),
        prompt: u.string()
    })), wZY = gZ.and(u.object({
        hook_event_name: u.literal("SessionStart"),
        source: u.enum(["startup", "resume", "clear", "compact"]),
        agent_type: u.string().optional(),
        model: u.string().optional()
    })), HZY = gZ.and(u.object({
        hook_event_name: u.literal("Setup"),
        trigger: u.enum(["init", "maintenance"])
    })), $ZY = gZ.and(u.object({
        hook_event_name: u.literal("Stop"),
        stop_hook_active: u.boolean()
    })), OZY = gZ.and(u.object({
        hook_event_name: u.literal("SubagentStart"),
        agent_id: u.string(),
        agent_type: u.string()
    })), _ZY = gZ.and(u.object({
        hook_event_name: u.literal("SubagentStop"),
        stop_hook_active: u.boolean(),
        agent_id: u.string(),
        agent_transcript_path: u.string(),
        agent_type: u.string()
    })), JZY = gZ.and(u.object({
        hook_event_name: u.literal("PreCompact"),
        trigger: u.enum(["manual", "auto"]),
        custom_instructions: u.string().nullable()
    })), XZY = gZ.and(u.object({
        hook_event_name: u.literal("TeammateIdle"),
        teammate_name: u.string(),
        team_name: u.string()
    })), DZY = gZ.and(u.object({
        hook_event_name: u.literal("TaskCompleted"),
        task_id: u.string(),
        task_subject: u.string(),
        task_description: u.string().optional(),
        teammate_name: u.string().optional(),
        team_name: u.string().optional()
    })), jZY = ["clear", "logout", "prompt_input_exit", "other", "bypass_permissions_disabled"], MZY = u.enum(jZY), PZY = gZ.and(u.object({
        hook_event_name: u.literal("SessionEnd"),
        reason: MZY
    })), cow = u.union([eGY, qZY, KZY, YZY, zZY, wZY, PZY, $ZY, OZY, _ZY, JZY, AZY, HZY, XZY, DZY]), WZY = u.object({
        async: u.literal(!0),
        asyncTimeout: u.number().optional()
    }), GZY = u.object({
        hookEventName: u.literal("PreToolUse"),
        permissionDecision: u.enum(["allow", "deny", "ask"]).optional(),
        permissionDecisionReason: u.string().optional(),
        updatedInput: u.record(u.string(), u.unknown()).optional(),
        additionalContext: u.string().optional()
    }), ZZY = u.object({
        hookEventName: u.literal("UserPromptSubmit"),
        additionalContext: u.string().optional()
    }), fZY = u.object({
        hookEventName: u.literal("SessionStart"),
        additionalContext: u.string().optional()
    }), VZY = u.object({
        hookEventName: u.literal("Setup"),
        additionalContext: u.string().optional()
    }), NZY = u.object({
        hookEventName: u.literal("SubagentStart"),
        additionalContext: u.string().optional()
    }), TZY = u.object({
        hookEventName: u.literal("PostToolUse"),
        additionalContext: u.string().optional(),
        updatedMCPToolOutput: u.unknown().optional()
    }), vZY = u.object({
        hookEventName: u.literal("PostToolUseFailure"),
        additionalContext: u.string().optional()
    }), EZY = u.object({
        hookEventName: u.literal("Notification"),
        additionalContext: u.string().optional()
    }), kZY = u.object({
        hookEventName: u.literal("PermissionRequest"),
        decision: u.union([u.object({
            behavior: u.literal("allow"),
            updatedInput: u.record(u.string(), u.unknown()).optional(),
            updatedPermissions: u.array(hvA).optional()
        }), u.object({
            behavior: u.literal("deny"),
            message: u.string().optional(),
            interrupt: u.boolean().optional()
        })])
    }), LZY = u.object({
        continue: u.boolean().optional(),
        suppressOutput: u.boolean().optional(),
        stopReason: u.string().optional(),
        decision: u.enum(["approve", "block"]).optional(),
        systemMessage: u.string().optional(),
        reason: u.string().optional(),
        hookSpecificOutput: u.union([GZY, ZZY, fZY, VZY, NZY, TZY, vZY, EZY, kZY]).optional()
    }), low = u.union([WZY, LZY]), iow = u.object({
        name: u.string().describe("Skill name (without the leading slash)"),
        description: u.string().describe("Description of what the skill does"),
        argumentHint: u.string().describe('Hint for skill arguments (e.g., "<file>")')
    }).describe("Information about an available skill (invoked via /command syntax)."), now = u.object({
        value: u.string().describe("Model identifier to use in API calls"),
        displayName: u.string().describe("Human-readable display name"),
        description: u.string().describe("Description of the model's capabilities")
    }).describe("Information about an available model."), row = u.object({
        email: u.string().optional(),
        organization: u.string().optional(),
        subscriptionType: u.string().optional(),
        tokenSource: u.string().optional(),
        apiKeySource: u.string().optional()
    }).describe("Information about the logged in user's account."), RZY = u.union([u.string(), u.record(u.string(), Mx4)]), oow = u.object({
        description: u.string().describe("Natural language description of when to use this agent"),
        tools: u.array(u.string()).optional().describe("Array of allowed tool names. If omitted, inherits all tools from parent"),
        disallowedTools: u.array(u.string()).optional().describe("Array of tool names to explicitly disallow for this agent"),
        prompt: u.string().describe("The agent's system prompt"),
        model: u.enum(["sonnet", "opus", "haiku", "inherit"]).optional().describe("Model to use for this agent. If omitted or 'inherit', uses the main model"),
        mcpServers: u.array(RZY).optional(),
        criticalSystemReminder_EXPERIMENTAL: u.string().optional().describe("Experimental: Critical reminder added to system prompt"),
        skills: u.array(u.string()).optional().describe("Array of skill names to preload into the agent context"),
        maxTurns: u.number().int().positive().optional().describe("Maximum number of agentic turns (API round-trips) before stopping")
    }).describe("Definition for a custom subagent that can be invoked via the Task tool."), aow = u.enum(["user", "project", "local"]).describe("Source for loading filesystem-based settings. 'user' - Global user settings (~/.claude/settings.json). 'project' - Project settings (.claude/settings.json). 'local' - Local settings (.claude/settings.local.json)."), sow = u.object({
        type: u.literal("local").describe("Plugin type. Currently only 'local' is supported"),
        path: u.string().describe("Absolute or relative path to the plugin directory")
    }).describe("Configuration for loading a plugin."), tow = u.object({
        canRewind: u.boolean(),
        error: u.string().optional(),
        filesChanged: u.array(u.string()).optional(),
        insertions: u.number().optional(),
        deletions: u.number().optional()
    }).describe("Result of a rewindFiles operation."), yZY = u.unknown(), CZY = u.unknown(), SZY = u.unknown(), oD = u.string(), Px4 = u.unknown(), hZY = u.enum(["authentication_failed", "billing_error", "rate_limit", "invalid_request", "server_error", "unknown", "max_output_tokens"]), IZY = u.union([u.literal("compacting"), u.null()]), Wx4 = u.object({
        type: u.literal("user"),
        message: yZY,
        parent_tool_use_id: u.string().nullable(),
        isSynthetic: u.boolean().optional(),
        tool_use_result: u.unknown().optional()
    }), xZY = Wx4.extend({
        uuid: oD.optional(),
        session_id: u.string()
    }), bZY = Wx4.extend({
        uuid: oD,
        session_id: u.string(),
        isReplay: u.literal(!0)
    }), uZY = u.object({
        type: u.literal("assistant"),
        message: CZY,
        parent_tool_use_id: u.string().nullable(),
        error: hZY.optional(),
        uuid: oD,
        session_id: u.string()
    }), eow = u.object({
        type: u.literal("streamlined_text"),
        text: u.string().describe("Text content preserved from the assistant message"),
        session_id: u.string(),
        uuid: oD
    }).describe("@internal Streamlined text message - replaces SDKAssistantMessage in streamlined output. Text content preserved, thinking and tool_use blocks removed."), Aaw = u.object({
        type: u.literal("streamlined_tool_use_summary"),
        tool_summary: u.string().describe('Summary of tool calls (e.g., "Read 2 files, wrote 1 file")'),
        session_id: u.string(),
        uuid: oD
    }).describe("@internal Streamlined tool use summary - replaces tool_use blocks in streamlined output with a cumulative summary string."), Gx4 = u.object({
        tool_name: u.string(),
        tool_use_id: u.string(),
        tool_input: u.record(u.string(), u.unknown())
    }), BZY = u.object({
        type: u.literal("result"),
        subtype: u.literal("success"),
        duration_ms: u.number(),
        duration_api_ms: u.number(),
        is_error: u.boolean(),
        num_turns: u.number(),
        result: u.string(),
        stop_reason: u.string().nullable(),
        total_cost_usd: u.number(),
        usage: Px4,
        modelUsage: u.record(u.string(), jx4),
        permission_denials: u.array(Gx4),
        structured_output: u.unknown().optional(),
        uuid: oD,
        session_id: u.string()
    }), mZY = u.object({
        type: u.literal("result"),
        subtype: u.enum(["error_during_execution", "error_max_turns", "error_max_budget_usd", "error_max_structured_output_retries"]),
        duration_ms: u.number(),
        duration_api_ms: u.number(),
        is_error: u.boolean(),
        num_turns: u.number(),
        stop_reason: u.string().nullable(),
        total_cost_usd: u.number(),
        usage: Px4,
        modelUsage: u.record(u.string(), jx4),
        permission_denials: u.array(Gx4),
        errors: u.array(u.string()),
        uuid: oD,
        session_id: u.string()
    }), FZY = u.union([BZY, mZY]), QZY = u.object({
        type: u.literal("system"),
        subtype: u.literal("init"),
        agents: u.array(u.string()).optional(),
        apiKeySource: lGY,
        betas: u.array(u.string()).optional(),
        claude_code_version: u.string(),
        cwd: u.string(),
        tools: u.array(u.string()),
        mcp_servers: u.array(u.object({
            name: u.string(),
            status: u.string()
        })),
        model: u.string(),
        permissionMode: cP1,
        slash_commands: u.array(u.string()),
        output_style: u.string(),
        skills: u.array(u.string()),
        plugins: u.array(u.object({
            name: u.string(),
            path: u.string()
        })),
        uuid: oD,
        session_id: u.string()
    }), gZY = u.object({
        type: u.literal("stream_event"),
        event: SZY,
        parent_tool_use_id: u.string().nullable(),
        uuid: oD,
        session_id: u.string()
    }), UZY = u.object({
        type: u.literal("system"),
        subtype: u.literal("compact_boundary"),
        compact_metadata: u.object({
            trigger: u.enum(["manual", "auto"]),
            pre_tokens: u.number()
        }),
        uuid: oD,
        session_id: u.string()
    }), pZY = u.object({
        type: u.literal("system"),
        subtype: u.literal("status"),
        status: IZY,
        permissionMode: cP1.optional(),
        uuid: oD,
        session_id: u.string()
    }), dZY = u.object({
        type: u.literal("system"),
        subtype: u.literal("hook_started"),
        hook_id: u.string(),
        hook_name: u.string(),
        hook_event: u.string(),
        uuid: oD,
        session_id: u.string()
    }), cZY = u.object({
        type: u.literal("system"),
        subtype: u.literal("hook_progress"),
        hook_id: u.string(),
        hook_name: u.string(),
        hook_event: u.string(),
        stdout: u.string(),
        stderr: u.string(),
        output: u.string(),
        uuid: oD,
        session_id: u.string()
    }), lZY = u.object({
        type: u.literal("system"),
        subtype: u.literal("hook_response"),
        hook_id: u.string(),
        hook_name: u.string(),
        hook_event: u.string(),
        output: u.string(),
        stdout: u.string(),
        stderr: u.string(),
        exit_code: u.number().optional(),
        outcome: u.enum(["success", "error", "cancelled"]),
        uuid: oD,
        session_id: u.string()
    }), iZY = u.object({
        type: u.literal("tool_progress"),
        tool_use_id: u.string(),
        tool_name: u.string(),
        parent_tool_use_id: u.string().nullable(),
        elapsed_time_seconds: u.number(),
        uuid: oD,
        session_id: u.string()
    }), nZY = u.object({
        type: u.literal("auth_status"),
        isAuthenticating: u.boolean(),
        output: u.array(u.string()),
        error: u.string().optional(),
        uuid: oD,
        session_id: u.string()
    }), rZY = u.object({
        type: u.literal("system"),
        subtype: u.literal("files_persisted"),
        files: u.array(u.object({
            filename: u.string(),
            file_id: u.string()
        })),
        failed: u.array(u.object({
            filename: u.string(),
            error: u.string()
        })),
        processed_at: u.string(),
        uuid: oD,
        session_id: u.string()
    }), oZY = u.object({
        type: u.literal("system"),
        subtype: u.literal("task_notification"),
        task_id: u.string(),
        status: u.enum(["completed", "failed", "stopped"]),
        output_file: u.string(),
        summary: u.string(),
        uuid: oD,
        session_id: u.string()
    }), aZY = u.object({
        type: u.literal("tool_use_summary"),
        summary: u.string(),
        preceding_tool_use_ids: u.array(u.string()),
        uuid: oD,
        session_id: u.string()
    }), qaw = u.union([uZY, xZY, bZY, FZY, QZY, gZY, UZY, pZY, dZY, cZY, lZY, iZY, nZY, oZY, rZY, aZY])
})
// @from(Ln 321641, Col 4)
Lx4 = {}
// @from(Ln 321700, Col 0)
function as(A, q) {
    let K = q || i3() || "default",
        Y = i_1(K),
        z = i_1(A),
        w = IvA(QP(), Y, "inboxes"),
        H = IvA(w, `${z}.json`);
    return h(`[TeammateMailbox] getInboxPath: agent=${A}, team=${K}, fullPath=${H}`), H
}
// @from(Ln 321709, Col 0)
function tZY(A) {
    return as(A)
}
// @from(Ln 321713, Col 0)
function eZY(A) {
    let q = A || i3() || "default",
        K = i_1(q),
        Y = IvA(QP(), K, "inboxes");
    if (!Y51(Y)) sZY(Y, {
        recursive: !0
    }), h(`[TeammateMailbox] Created inbox directory: ${Y}`)
}
// @from(Ln 321722, Col 0)
function Ld(A, q) {
    let K = as(A, q);
    if (h(`[TeammateMailbox] readMailbox: path=${K}`), !Y51(K)) return h("[TeammateMailbox] readMailbox: file does not exist"), [];
    try {
        let Y = fx4(K, "utf-8"),
            z = _A(Y);
        return h(`[TeammateMailbox] readMailbox: read ${z.length} message(s)`), z
    } catch (Y) {
        return h(`Failed to read inbox for ${A}: ${Y}`), K1(Y instanceof Error ? Y : Error(String(Y))), []
    }
}
// @from(Ln 321734, Col 0)
function z51(A, q) {
    let K = Ld(A, q),
        Y = K.filter((z) => !z.read);
    return h(`[TeammateMailbox] readUnreadMessages: ${Y.length} unread of ${K.length} total`), Y
}
// @from(Ln 321740, Col 0)
function f9(A, q, K) {
    eZY(K);
    let Y = as(A, K),
        z = `${Y}.lock`;
    if (h(`[TeammateMailbox] writeToMailbox: recipient=${A}, from=${q.from}, path=${Y}`), !Y51(Y)) c8(Y, "[]", "utf-8"), h("[TeammateMailbox] writeToMailbox: created new inbox file");
    let w;
    try {
        w = _Q1.lockSync(Y, {
            lockfilePath: z
        });
        let H = Ld(A, K),
            $ = {
                ...q,
                read: !1
            };
        H.push($), c8(Y, Q1(H, null, 2), "utf-8"), h(`[TeammateMailbox] Wrote message to ${A}'s inbox from ${q.from}`)
    } catch (H) {
        h(`Failed to write to inbox for ${A}: ${H}`), K1(H instanceof Error ? H : Error(String(H)))
    } finally {
        if (w) w()
    }
}
// @from(Ln 321763, Col 0)
function JQ1(A, q, K) {
    let Y = as(A, q);
    if (h(`[TeammateMailbox] markMessageAsReadByIndex called: agentName=${A}, teamName=${q}, index=${K}, path=${Y}`), !Y51(Y)) {
        h(`[TeammateMailbox] markMessageAsReadByIndex: file does not exist at ${Y}`);
        return
    }
    let z = `${Y}.lock`,
        w;
    try {
        h("[TeammateMailbox] markMessageAsReadByIndex: acquiring lock..."), w = _Q1.lockSync(Y, {
            lockfilePath: z
        }), h("[TeammateMailbox] markMessageAsReadByIndex: lock acquired");
        let H = Ld(A, q);
        if (h(`[TeammateMailbox] markMessageAsReadByIndex: read ${H.length} messages after lock`), K < 0 || K >= H.length) {
            h(`[TeammateMailbox] markMessageAsReadByIndex: index ${K} out of bounds (${H.length} messages)`);
            return
        }
        let $ = H[K];
        if (!$ || $.read) {
            h("[TeammateMailbox] markMessageAsReadByIndex: message already read or missing");
            return
        }
        H[K] = {
            ...$,
            read: !0
        }, c8(Y, Q1(H, null, 2), "utf-8"), h(`[TeammateMailbox] markMessageAsReadByIndex: marked message at index ${K} as read`)
    } catch (H) {
        h(`[TeammateMailbox] markMessageAsReadByIndex FAILED for ${A}: ${H}`), K1(H instanceof Error ? H : Error(String(H)))
    } finally {
        if (w) w(), h("[TeammateMailbox] markMessageAsReadByIndex: lock released")
    }
}
// @from(Ln 321796, Col 0)
function XQ1(A, q) {
    let K = as(A, q);
    if (h(`[TeammateMailbox] markMessagesAsRead called: agentName=${A}, teamName=${q}, path=${K}`), !Y51(K)) {
        h(`[TeammateMailbox] markMessagesAsRead: file does not exist at ${K}`);
        return
    }
    let Y = `${K}.lock`,
        z;
    try {
        h("[TeammateMailbox] markMessagesAsRead: acquiring lock..."), z = _Q1.lockSync(K, {
            lockfilePath: Y
        }), h("[TeammateMailbox] markMessagesAsRead: lock acquired");
        let w = Ld(A, q);
        if (h(`[TeammateMailbox] markMessagesAsRead: read ${w.length} messages after lock`), w.length === 0) {
            h("[TeammateMailbox] markMessagesAsRead: no messages to mark");
            return
        }
        let H = w.filter((X) => !X.read).length;
        h(`[TeammateMailbox] markMessagesAsRead: ${H} unread of ${w.length} total`);
        let $ = w.map((X) => ({
            ...X,
            read: !0
        }));
        c8(K, Q1($, null, 2), "utf-8"), h(`[TeammateMailbox] markMessagesAsRead: WROTE ${H} message(s) as read to ${K}`);
        let O = fx4(K, "utf-8"),
            J = _A(O).filter((X) => !X.read).length;
        h(`[TeammateMailbox] markMessagesAsRead: VERIFY - ${J} still unread after write`)
    } catch (w) {
        h(`[TeammateMailbox] markMessagesAsRead FAILED for ${A}: ${w}`), K1(w instanceof Error ? w : Error(String(w)))
    } finally {
        if (z) z(), h("[TeammateMailbox] markMessagesAsRead: lock released")
    }
}
// @from(Ln 321830, Col 0)
function AfY(A, q) {
    let K = as(A, q);
    if (!Y51(K)) return;
    try {
        c8(K, "[]", "utf-8"), h(`[TeammateMailbox] Cleared inbox for ${A}`)
    } catch (Y) {
        h(`Failed to clear inbox for ${A}: ${Y}`), K1(Y instanceof Error ? Y : Error(String(Y)))
    }
}
// @from(Ln 321840, Col 0)
function qfY(A) {
    return A.map((q) => {
        let K = q.color ? ` color="${q.color}"` : "",
            Y = q.summary ? ` summary="${q.summary}"` : "";
        return `<${qJ} teammate_id="${q.from}"${K}${Y}>
${q.text}
</${qJ}>`
    }).join(`

`)
}
// @from(Ln 321852, Col 0)
function DQ1(A, q) {
    return {
        type: "idle_notification",
        from: A,
        timestamp: new Date().toISOString(),
        idleReason: q?.idleReason,
        summary: q?.summary,
        completedTaskId: q?.completedTaskId,
        completedStatus: q?.completedStatus,
        failureReason: q?.failureReason
    }
}
// @from(Ln 321865, Col 0)
function jQ1(A) {
    try {
        let q = _A(A);
        if (q && q.type === "idle_notification") return q
    } catch {}
    return null
}
// @from(Ln 321873, Col 0)
function KfY(A, q, K) {
    return {
        type: "task_completed",
        from: A,
        taskId: q,
        taskSubject: K,
        timestamp: new Date().toISOString()
    }
}
// @from(Ln 321883, Col 0)
function YfY(A) {
    try {
        let q = _A(A);
        if (q && q.type === "task_completed") return q
    } catch {}
    return null
}
// @from(Ln 321891, Col 0)
function xvA(A) {
    return {
        type: "permission_request",
        request_id: A.request_id,
        agent_id: A.agent_id,
        tool_name: A.tool_name,
        tool_use_id: A.tool_use_id,
        description: A.description,
        input: A.input,
        permission_suggestions: A.permission_suggestions || []
    }
}
// @from(Ln 321904, Col 0)
function bvA(A) {
    if (A.subtype === "error") return {
        type: "permission_response",
        request_id: A.request_id,
        subtype: "error",
        error: A.error || "Permission denied"
    };
    return {
        type: "permission_response",
        request_id: A.request_id,
        subtype: "success",
        response: {
            updated_input: A.updated_input,
            permission_updates: A.permission_updates
        }
    }
}
// @from(Ln 321922, Col 0)
function MQ1(A) {
    try {
        let q = _A(A);
        if (q && q.type === "permission_request") return q
    } catch {}
    return null
}
// @from(Ln 321930, Col 0)
function w51(A) {
    try {
        let q = _A(A);
        if (q && q.type === "permission_response") return q
    } catch {}
    return null
}
// @from(Ln 321938, Col 0)
function uvA(A) {
    return {
        type: "sandbox_permission_request",
        requestId: A.requestId,
        workerId: A.workerId,
        workerName: A.workerName,
        workerColor: A.workerColor,
        hostPattern: {
            host: A.host
        },
        createdAt: Date.now()
    }
}
// @from(Ln 321952, Col 0)
function BvA(A) {
    return {
        type: "sandbox_permission_response",
        requestId: A.requestId,
        host: A.host,
        allow: A.allow,
        timestamp: new Date().toISOString()
    }
}
// @from(Ln 321962, Col 0)
function WM6(A) {
    try {
        let q = _A(A);
        if (q && q.type === "sandbox_permission_request") return q
    } catch {}
    return null
}
// @from(Ln 321970, Col 0)
function PQ1(A) {
    try {
        let q = _A(A);
        if (q && q.type === "sandbox_permission_response") return q
    } catch {}
    return null
}
// @from(Ln 321978, Col 0)
function lP1(A) {
    return {
        type: "shutdown_request",
        requestId: A.requestId,
        from: A.from,
        reason: A.reason,
        timestamp: new Date().toISOString()
    }
}
// @from(Ln 321988, Col 0)
function mvA(A) {
    return {
        type: "shutdown_approved",
        requestId: A.requestId,
        from: A.from,
        timestamp: new Date().toISOString(),
        paneId: A.paneId,
        backendType: A.backendType
    }
}
// @from(Ln 321999, Col 0)
function FvA(A) {
    return {
        type: "shutdown_rejected",
        requestId: A.requestId,
        from: A.from,
        reason: A.reason,
        timestamp: new Date().toISOString()
    }
}
// @from(Ln 322009, Col 0)
function GM6(A, q, K) {
    let Y = q || i3(),
        z = g5() || K2,
        w = vP1("shutdown", A),
        H = lP1({
            requestId: w,
            from: z,
            reason: K
        });
    return f9(A, {
        from: z,
        text: Q1(H),
        timestamp: new Date().toISOString(),
        color: b$()
    }, Y), {
        requestId: w,
        target: A
    }
}
// @from(Ln 322029, Col 0)
function ss(A) {
    try {
        let q = Tx4.safeParse(_A(A));
        if (q.success) return q.data
    } catch {}
    return null
}
// @from(Ln 322037, Col 0)
function ZM6(A) {
    try {
        let q = Vx4.safeParse(_A(A));
        if (q.success) return q.data
    } catch {}
    return null
}
// @from(Ln 322045, Col 0)
function UZ(A) {
    try {
        let q = vx4.safeParse(_A(A));
        if (q.success) return q.data
    } catch {}
    return null
}
// @from(Ln 322053, Col 0)
function fM6(A) {
    try {
        let q = Ex4.safeParse(_A(A));
        if (q.success) return q.data
    } catch {}
    return null
}
// @from(Ln 322061, Col 0)
function iP1(A) {
    try {
        let q = Nx4.safeParse(_A(A));
        if (q.success) return q.data
    } catch {}
    return null
}
// @from(Ln 322069, Col 0)
function VM6(A) {
    try {
        let q = _A(A);
        if (q && q.type === "task_assignment") return q
    } catch {}
    return null
}
// @from(Ln 322077, Col 0)
function NM6(A) {
    try {
        let q = _A(A);
        if (q && q.type === "team_permission_update") return q
    } catch {}
    return null
}
// @from(Ln 322085, Col 0)
function TM6(A) {
    return {
        type: "mode_set_request",
        mode: A.mode,
        from: A.from
    }
}
// @from(Ln 322093, Col 0)
function vM6(A) {
    try {
        let q = kx4.safeParse(_A(A));
        if (q.success) return q.data
    } catch {}
    return null
}
// @from(Ln 322101, Col 0)
function EM6(A) {
    try {
        let q = _A(A);
        if (!q || typeof q !== "object" || !("type" in q)) return !1;
        let K = q.type;
        return K === "permission_request" || K === "permission_response" || K === "sandbox_permission_request" || K === "sandbox_permission_response" || K === "shutdown_request" || K === "shutdown_approved" || K === "team_permission_update" || K === "mode_set_request" || K === "plan_approval_request" || K === "plan_approval_response"
    } catch {
        return !1
    }
}
// @from(Ln 322112, Col 0)
function QvA(A, q, K) {
    let Y = as(A, K);
    if (!Y51(Y)) return;
    let z = `${Y}.lock`,
        w;
    try {
        w = _Q1.lockSync(Y, {
            lockfilePath: z
        });
        let H = Ld(A, K);
        if (H.length === 0) return;
        let $ = H.map((O) => !O.read && q(O) ? {
            ...O,
            read: !0
        } : O);
        c8(Y, Q1($, null, 2), "utf-8")
    } catch (H) {
        K1(H instanceof Error ? H : Error(String(H)))
    } finally {
        if (w) try {
            w()
        } catch {}
    }
}
// @from(Ln 322137, Col 0)
function WQ1(A) {
    for (let q = A.length - 1; q >= 0; q--) {
        let K = A[q];
        if (!K) continue;
        if (K.type === "user" && typeof K.message.content === "string") break;
        if (K.type !== "assistant") continue;
        for (let Y of K.message.content)
            if (Y.type === "tool_use" && Y.name === iB && typeof Y.input === "object" && Y.input !== null && "type" in Y.input && Y.input.type === "message" && "recipient" in Y.input && typeof Y.input.recipient === "string" && Y.input.recipient.toLowerCase() !== K2.toLowerCase()) {
                let z = Y.input.recipient,
                    w = "summary" in Y.input && typeof Y.input.summary === "string" ? Y.input.summary : ("content" in Y.input) && typeof Y.input.content === "string" ? Y.input.content.slice(0, 80) : void 0;
                if (w) return `[to ${z}] ${w}`
            }
    }
    return
}
// @from(Ln 322152, Col 4)
_Q1
// @from(Ln 322152, Col 9)
Vx4
// @from(Ln 322152, Col 14)
Nx4
// @from(Ln 322152, Col 19)
Tx4
// @from(Ln 322152, Col 24)
vx4
// @from(Ln 322152, Col 29)
Ex4
// @from(Ln 322152, Col 34)
kx4
// @from(Ln 322153, Col 4)
H$ = v(() => {
    m6();
    hA();
    i7();
    y6();
    vz();
    Z6();
    Cz();
    vw();
    Zx4();
    m6();
    _Q1 = o(NQ(), 1);
    Vx4 = u.object({
        type: u.literal("plan_approval_request"),
        from: u.string(),
        timestamp: u.string(),
        planFilePath: u.string(),
        planContent: u.string(),
        requestId: u.string()
    }), Nx4 = u.object({
        type: u.literal("plan_approval_response"),
        requestId: u.string(),
        approved: u.boolean(),
        feedback: u.string().optional(),
        timestamp: u.string(),
        permissionMode: cP1.optional()
    }), Tx4 = u.object({
        type: u.literal("shutdown_request"),
        requestId: u.string(),
        from: u.string(),
        reason: u.string().optional(),
        timestamp: u.string()
    }), vx4 = u.object({
        type: u.literal("shutdown_approved"),
        requestId: u.string(),
        from: u.string(),
        timestamp: u.string(),
        paneId: u.string().optional(),
        backendType: u.string().optional()
    }), Ex4 = u.object({
        type: u.literal("shutdown_rejected"),
        requestId: u.string(),
        from: u.string(),
        reason: u.string(),
        timestamp: u.string()
    });
    kx4 = u.object({
        type: u.literal("mode_set_request"),
        mode: cP1,
        from: u.string()
    })
})
// @from(Ln 322206, Col 0)
function zfY(A) {
    let q = e(7),
        {
            request: K
        } = A,
        Y;
    if (q[0] !== K.from) Y = Sz.createElement(I, {
        marginBottom: 1
    }, Sz.createElement(V, {
        color: "warning",
        bold: !0
    }, "Shutdown request from ", K.from)), q[0] = K.from, q[1] = Y;
    else Y = q[1];
    let z;
    if (q[2] !== K.reason) z = K.reason && Sz.createElement(I, null, Sz.createElement(V, null, "Reason: ", K.reason)), q[2] = K.reason, q[3] = z;
    else z = q[3];
    let w;
    if (q[4] !== Y || q[5] !== z) w = Sz.createElement(I, {
        flexDirection: "column",
        marginY: 1
    }, Sz.createElement(I, {
        borderStyle: "round",
        borderColor: "warning",
        flexDirection: "column",
        paddingX: 1,
        paddingY: 1
    }, Y, z)), q[4] = Y, q[5] = z, q[6] = w;
    else w = q[6];
    return w
}
// @from(Ln 322237, Col 0)
function wfY(A) {
    let q = e(8),
        {
            response: K
        } = A,
        Y;
    if (q[0] !== K.from) Y = Sz.createElement(V, {
        color: "subtle",
        bold: !0
    }, "Shutdown rejected by ", K.from), q[0] = K.from, q[1] = Y;
    else Y = q[1];
    let z;
    if (q[2] !== K.reason) z = Sz.createElement(I, {
        marginTop: 1,
        borderStyle: "dashed",
        borderColor: "subtle",
        borderLeft: !1,
        borderRight: !1,
        paddingX: 1
    }, Sz.createElement(V, null, "Reason: ", K.reason)), q[2] = K.reason, q[3] = z;
    else z = q[3];
    let w;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) w = Sz.createElement(I, {
        marginTop: 1
    }, Sz.createElement(V, {
        dimColor: !0
    }, "Teammate is continuing to work. You may request shutdown again later.")), q[4] = w;
    else w = q[4];
    let H;
    if (q[5] !== Y || q[6] !== z) H = Sz.createElement(I, {
        flexDirection: "column",
        marginY: 1
    }, Sz.createElement(I, {
        borderStyle: "round",
        borderColor: "subtle",
        flexDirection: "column",
        paddingX: 1,
        paddingY: 1
    }, Y, z, w)), q[5] = Y, q[6] = z, q[7] = H;
    else H = q[7];
    return H
}
// @from(Ln 322280, Col 0)
function Rx4(A) {
    let q = ss(A);
    if (q) return Sz.createElement(zfY, {
        request: q
    });
    if (UZ(A)) return null;
    let K = fM6(A);
    if (K) return Sz.createElement(wfY, {
        response: K
    });
    return null
}
// @from(Ln 322293, Col 0)
function yx4(A) {
    let q = ss(A);
    if (q) return `[Shutdown Request from ${q.from}]${q.reason?` ${q.reason}`:""}`;
    let K = UZ(A);
    if (K) return `[Shutdown Approved] ${K.from} is now exiting`;
    let Y = fM6(A);
    if (Y) return `[Shutdown Rejected] ${Y.from}: ${Y.reason}`;
    return null
}
// @from(Ln 322302, Col 4)
Sz
// @from(Ln 322303, Col 4)
gvA = v(() => {
    i1();
    m1();
    H$();
    Sz = o(X1(), 1)
})
// @from(Ln 322310, Col 0)
function HfY(A) {
    let q = e(11),
        {
            assignment: K
        } = A,
        Y;
    if (q[0] !== K.assignedBy || q[1] !== K.taskId) Y = aD.createElement(I, {
        marginBottom: 1
    }, aD.createElement(V, {
        color: "cyan_FOR_SUBAGENTS_ONLY",
        bold: !0
    }, "Task #", K.taskId, " assigned by ", K.assignedBy)), q[0] = K.assignedBy, q[1] = K.taskId, q[2] = Y;
    else Y = q[2];
    let z;
    if (q[3] !== K.subject) z = aD.createElement(I, null, aD.createElement(V, {
        bold: !0
    }, K.subject)), q[3] = K.subject, q[4] = z;
    else z = q[4];
    let w;
    if (q[5] !== K.description) w = K.description && aD.createElement(I, {
        marginTop: 1
    }, aD.createElement(V, {
        dimColor: !0
    }, K.description)), q[5] = K.description, q[6] = w;
    else w = q[6];
    let H;
    if (q[7] !== Y || q[8] !== z || q[9] !== w) H = aD.createElement(I, {
        flexDirection: "column",
        marginY: 1
    }, aD.createElement(I, {
        borderStyle: "round",
        borderColor: "cyan_FOR_SUBAGENTS_ONLY",
        flexDirection: "column",
        paddingX: 1,
        paddingY: 1
    }, Y, z, w)), q[7] = Y, q[8] = z, q[9] = w, q[10] = H;
    else H = q[10];
    return H
}
// @from(Ln 322350, Col 0)
function Cx4(A) {
    let q = VM6(A);
    if (q) return aD.createElement(HfY, {
        assignment: q
    });
    return null
}
// @from(Ln 322358, Col 0)
function Sx4(A) {
    let q = VM6(A);
    if (q) return `[Task Assigned] #${q.taskId} - ${q.subject}`;
    return null
}
// @from(Ln 322363, Col 4)
aD
// @from(Ln 322364, Col 4)
UvA = v(() => {
    i1();
    m1();
    H$();
    aD = o(X1(), 1)
})
// @from(Ln 322371, Col 0)
function $fY(A) {
    let q = e(10),
        {
            request: K
        } = A,
        Y;
    if (q[0] !== K.from) Y = G3.createElement(I, {
        marginBottom: 1
    }, G3.createElement(V, {
        color: "planMode",
        bold: !0
    }, "Plan Approval Request from ", K.from)), q[0] = K.from, q[1] = Y;
    else Y = q[1];
    let z;
    if (q[2] !== K.planContent) z = G3.createElement(I, {
        borderStyle: "dashed",
        borderColor: "subtle",
        borderLeft: !1,
        borderRight: !1,
        flexDirection: "column",
        paddingX: 1,
        marginBottom: 1
    }, G3.createElement(TJ, null, K.planContent)), q[2] = K.planContent, q[3] = z;
    else z = q[3];
    let w;
    if (q[4] !== K.planFilePath) w = G3.createElement(V, {
        dimColor: !0
    }, "Plan file: ", K.planFilePath), q[4] = K.planFilePath, q[5] = w;
    else w = q[5];
    let H;
    if (q[6] !== Y || q[7] !== z || q[8] !== w) H = G3.createElement(I, {
        flexDirection: "column",
        marginY: 1
    }, G3.createElement(I, {
        borderStyle: "round",
        borderColor: "planMode",
        flexDirection: "column",
        paddingX: 1
    }, Y, z, w)), q[6] = Y, q[7] = z, q[8] = w, q[9] = H;
    else H = q[9];
    return H
}
// @from(Ln 322414, Col 0)
function OfY(A) {
    let q = e(13),
        {
            response: K,
            senderName: Y
        } = A;
    if (K.approved) {
        let O;
        if (q[0] !== Y) O = G3.createElement(I, null, G3.createElement(V, {
            color: "success",
            bold: !0
        }, "✓ Plan Approved by ", Y)), q[0] = Y, q[1] = O;
        else O = q[1];
        let _;
        if (q[2] === Symbol.for("react.memo_cache_sentinel")) _ = G3.createElement(I, {
            marginTop: 1
        }, G3.createElement(V, null, "You can now proceed with implementation. Your plan mode restrictions have been lifted.")), q[2] = _;
        else _ = q[2];
        let J;
        if (q[3] !== O) J = G3.createElement(I, {
            flexDirection: "column",
            marginY: 1
        }, G3.createElement(I, {
            borderStyle: "round",
            borderColor: "success",
            flexDirection: "column",
            paddingX: 1,
            paddingY: 1
        }, O, _)), q[3] = O, q[4] = J;
        else J = q[4];
        return J
    }
    let z;
    if (q[5] !== Y) z = G3.createElement(I, null, G3.createElement(V, {
        color: "error",
        bold: !0
    }, "✗ Plan Rejected by ", Y)), q[5] = Y, q[6] = z;
    else z = q[6];
    let w;
    if (q[7] !== K.feedback) w = K.feedback && G3.createElement(I, {
        marginTop: 1,
        borderStyle: "dashed",
        borderColor: "subtle",
        borderLeft: !1,
        borderRight: !1,
        paddingX: 1
    }, G3.createElement(V, null, "Feedback: ", K.feedback)), q[7] = K.feedback, q[8] = w;
    else w = q[8];
    let H;
    if (q[9] === Symbol.for("react.memo_cache_sentinel")) H = G3.createElement(I, {
        marginTop: 1
    }, G3.createElement(V, {
        dimColor: !0
    }, "Please revise your plan based on the feedback and call ExitPlanMode again.")), q[9] = H;
    else H = q[9];
    let $;
    if (q[10] !== z || q[11] !== w) $ = G3.createElement(I, {
        flexDirection: "column",
        marginY: 1
    }, G3.createElement(I, {
        borderStyle: "round",
        borderColor: "error",
        flexDirection: "column",
        paddingX: 1,
        paddingY: 1
    }, z, w, H)), q[10] = z, q[11] = w, q[12] = $;
    else $ = q[12];
    return $
}
// @from(Ln 322484, Col 0)
function kM6(A, q) {
    let K = ZM6(A);
    if (K) return G3.createElement($fY, {
        request: K
    });
    let Y = iP1(A);
    if (Y) return G3.createElement(OfY, {
        response: Y,
        senderName: q
    });
    return null
}
// @from(Ln 322497, Col 0)
function _fY(A) {
    let q = ZM6(A);
    if (q) return `[Plan Approval Request from ${q.from}]`;
    let K = iP1(A);
    if (K)
        if (K.approved) return "[Plan Approved] You can now proceed with implementation";
        else return `[Plan Rejected] ${K.feedback||"Please revise your plan"}`;
    return null
}
// @from(Ln 322507, Col 0)
function JfY(A) {
    let q = ["Agent idle"];
    if (A.completedTaskId) {
        let K = A.completedStatus || "completed";
        q.push(`Task ${A.completedTaskId} ${K}`)
    }
    if (A.summary) q.push(`Last DM: ${A.summary}`);
    return q.join(" · ")
}
// @from(Ln 322517, Col 0)
function hx4(A) {
    let q = _fY(A);
    if (q) return q;
    let K = yx4(A);
    if (K) return K;
    let Y = jQ1(A);
    if (Y) return JfY(Y);
    let z = Sx4(A);
    if (z) return z;
    try {
        let w = _A(A);
        if (w?.type === "teammate_terminated" && w.message) return w.message
    } catch {}
    return A
}
// @from(Ln 322532, Col 4)
G3
// @from(Ln 322533, Col 4)
pvA = v(() => {
    i1();
    m1();
    uh();
    H$();
    m6();
    gvA();
    UvA();
    G3 = o(X1(), 1)
})
// @from(Ln 322544, Col 0)
function XfY(A) {
    let q = [],
        K = new RegExp(`<${qJ}\\s+teammate_id="([^"]+)"(?:\\s+color="([^"]+)")?(?:\\s+summary="([^"]+)")?>\\n?([\\s\\S]*?)\\n?<\\/${qJ}>`, "g");
    for (let Y of A.matchAll(K))
        if (Y[1] && Y[4]) q.push({
            teammateId: Y[1],
            color: Y[2],
            summary: Y[3],
            content: Y[4].trim()
        });
    return q
}
// @from(Ln 322557, Col 0)
function DfY(A) {
    if (A === "leader") return "leader";
    return A
}
// @from(Ln 322562, Col 0)
function Ix4({
    addMargin: A,
    param: {
        text: q
    },
    isTranscriptMode: K
}) {
    let Y = XfY(q).filter((z) => {
        if (UZ(z.content)) return !1;
        try {
            if (_A(z.content)?.type === "teammate_terminated") return !1
        } catch {}
        return !0
    });
    if (Y.length === 0) return null;
    return B5.createElement(I, {
        flexDirection: "column",
        marginTop: A ? 1 : 0,
        width: "100%"
    }, Y.map((z, w) => {
        let H = qP(z.color),
            $ = DfY(z.teammateId),
            O = kM6(z.content, $);
        if (O) return B5.createElement(B5.Fragment, {
            key: w
        }, O);
        let _ = Rx4(z.content);
        if (_) return B5.createElement(B5.Fragment, {
            key: w
        }, _);
        let J = Cx4(z.content);
        if (J) return B5.createElement(B5.Fragment, {
            key: w
        }, J);
        let X = null;
        try {
            X = _A(z.content)
        } catch {}
        if (X?.type === "idle_notification") return null;
        if (X?.type === "task_completed") {
            let D = X;
            return B5.createElement(I, {
                key: w,
                flexDirection: "column",
                marginTop: 1
            }, B5.createElement(V, {
                color: H
            }, `@${$}${l1.pointer}`), B5.createElement(HA, null, B5.createElement(V, {
                color: "success"
            }, "✓"), B5.createElement(V, null, " ", "Completed task #", D.taskId, D.taskSubject && B5.createElement(V, {
                dimColor: !0
            }, " (", D.taskSubject, ")"))))
        }
        return B5.createElement(jfY, {
            key: w,
            displayName: $,
            inkColor: H,
            content: z.content,
            summary: z.summary,
            isTranscriptMode: K
        })
    }))
}
// @from(Ln 322626, Col 0)
function jfY(A) {
    let q = e(14),
        {
            displayName: K,
            inkColor: Y,
            content: z,
            summary: w,
            isTranscriptMode: H
        } = A,
        $ = `@${K}${l1.pointer}`,
        O;
    if (q[0] !== Y || q[1] !== $) O = B5.createElement(V, {
        color: Y
    }, $), q[0] = Y, q[1] = $, q[2] = O;
    else O = q[2];
    let _;
    if (q[3] !== w) _ = w && B5.createElement(V, null, " ", w), q[3] = w, q[4] = _;
    else _ = q[4];
    let J;
    if (q[5] !== O || q[6] !== _) J = B5.createElement(I, null, O, _), q[5] = O, q[6] = _, q[7] = J;
    else J = q[7];
    let X;
    if (q[8] !== z || q[9] !== H) X = H && B5.createElement(I, {
        paddingLeft: 2
    }, B5.createElement(V, null, B5.createElement(W3, null, z))), q[8] = z, q[9] = H, q[10] = X;
    else X = q[10];
    let D;
    if (q[11] !== J || q[12] !== X) D = B5.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, J, X), q[11] = J, q[12] = X, q[13] = D;
    else D = q[13];
    return D
}
// @from(Ln 322660, Col 4)
B5
// @from(Ln 322661, Col 4)
xx4 = v(() => {
    i1();
    m1();
    b7();
    Zd();
    vz();
    m6();
    pvA();
    gvA();
    H$();
    UvA();
    eq();
    B5 = o(X1(), 1)
})
// @from(Ln 322676, Col 0)
function MfY(A) {
    switch (A) {
        case "completed":
            return "success";
        case "failed":
            return "error";
        case "killed":
            return "warning";
        default:
            return "text"
    }
}
// @from(Ln 322689, Col 0)
function bx4(A) {
    let q = e(12),
        {
            addMargin: K,
            param: Y
        } = A,
        {
            text: z
        } = Y,
        w;
    if (q[0] !== z) w = C4(z, "summary"), q[0] = z, q[1] = w;
    else w = q[1];
    let H = w;
    if (!H) return null;
    let $;
    if (q[2] !== z) {
        let j = C4(z, "status");
        $ = MfY(j), q[2] = z, q[3] = $
    } else $ = q[3];
    let O = $,
        _ = K ? 1 : 0,
        J;
    if (q[4] !== O) J = H51.createElement(V, {
        color: O
    }, gY), q[4] = O, q[5] = J;
    else J = q[5];
    let X;
    if (q[6] !== H || q[7] !== J) X = H51.createElement(V, null, J, " ", H), q[6] = H, q[7] = J, q[8] = X;
    else X = q[8];
    let D;
    if (q[9] !== _ || q[10] !== X) D = H51.createElement(I, {
        marginTop: _
    }, X), q[9] = _, q[10] = X, q[11] = D;
    else D = q[11];
    return D
}
// @from(Ln 322725, Col 4)
H51
// @from(Ln 322726, Col 4)
ux4 = v(() => {
    i1();
    m1();
    jW();
    N8();
    H51 = o(X1(), 1)
})
// @from(Ln 322734, Col 0)
function LM6(A) {
    let q = e(6),
        {
            addMargin: K,
            planContent: Y
        } = A,
        z = K ? 1 : 0,
        w;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) w = Rd.createElement(I, {
        marginBottom: 1
    }, Rd.createElement(V, {
        bold: !0,
        color: "planMode"
    }, "Plan to implement")), q[0] = w;
    else w = q[0];
    let H;
    if (q[1] !== Y) H = Rd.createElement(TJ, null, Y), q[1] = Y, q[2] = H;
    else H = q[2];
    let $;
    if (q[3] !== z || q[4] !== H) $ = Rd.createElement(I, {
        flexDirection: "column",
        borderStyle: "round",
        borderColor: "planMode",
        marginTop: z,
        paddingX: 1
    }, w, H), q[3] = z, q[4] = H, q[5] = $;
    else $ = q[5];
    return $
}
// @from(Ln 322763, Col 4)
Rd
// @from(Ln 322764, Col 4)
dvA = v(() => {
    i1();
    m1();
    uh();
    Rd = o(X1(), 1)
})
// @from(Ln 322771, Col 0)
function $51(A) {
    let q = e(34),
        {
            addMargin: K,
            param: Y,
            verbose: z,
            thinkingMetadata: w,
            planContent: H,
            isTranscriptMode: $
        } = A;
    if (Y.text.trim() === iv) return null;
    if (H) {
        let _;
        if (q[0] !== K || q[1] !== H) _ = Qw.createElement(LM6, {
            addMargin: K,
            planContent: H
        }), q[0] = K, q[1] = H, q[2] = _;
        else _ = q[2];
        return _
    }
    if (C4(Y.text, JC)) return null;
    if (Y.text.startsWith("<bash-stdout") || Y.text.startsWith("<bash-stderr")) {
        let _;
        if (q[3] !== Y.text || q[4] !== z) _ = Qw.createElement(Hx4, {
            content: Y.text,
            verbose: z
        }), q[3] = Y.text, q[4] = z, q[5] = _;
        else _ = q[5];
        return _
    }
    if (Y.text.startsWith("<background-task-output>")) {
        let _;
        if (q[6] !== Y.text) _ = Qw.createElement(Xx4, {
            content: Y.text
        }), q[6] = Y.text, q[7] = _;
        else _ = q[7];
        return _
    }
    if (Y.text.startsWith("<local-command-stdout") || Y.text.startsWith("<local-command-stderr")) {
        let _;
        if (q[8] !== Y.text) _ = Qw.createElement(_x4, {
            content: Y.text
        }), q[8] = Y.text, q[9] = _;
        else _ = q[9];
        return _
    }
    if (Y.text === ts || Y.text === YN) {
        let _;
        if (q[10] === Symbol.for("react.memo_cache_sentinel")) _ = Qw.createElement(HA, {
            height: 1
        }, Qw.createElement(MB, null)), q[10] = _;
        else _ = q[10];
        return _
    }
    if (Y.text.includes("<bash-input>")) {
        let _;
        if (q[11] !== K || q[12] !== Y) _ = Qw.createElement(jM6, {
            addMargin: K,
            param: Y
        }), q[11] = K, q[12] = Y, q[13] = _;
        else _ = q[13];
        return _
    }
    if (Y.text.includes("<background-task-input>")) {
        let _;
        if (q[14] !== K || q[15] !== Y) _ = Qw.createElement(K51, {
            addMargin: K,
            param: Y
        }), q[14] = K, q[15] = Y, q[16] = _;
        else _ = q[16];
        return _
    }
    if (Y.text.includes(`<${pP}>`)) {
        let _;
        if (q[17] !== K || q[18] !== Y) _ = Qw.createElement(iI4, {
            addMargin: K,
            param: Y
        }), q[17] = K, q[18] = Y, q[19] = _;
        else _ = q[19];
        return _
    }
    if (Y.text.includes("<user-memory-input>")) {
        let _;
        if (q[20] !== K || q[21] !== Y.text) _ = Qw.createElement(Yx4, {
            addMargin: K,
            text: Y.text
        }), q[20] = K, q[21] = Y.text, q[22] = _;
        else _ = q[22];
        return _
    }
    if (l8() && Y.text.includes(`<${qJ}`)) {
        let _;
        if (q[23] !== K || q[24] !== $ || q[25] !== Y) _ = Qw.createElement(Ix4, {
            addMargin: K,
            param: Y,
            isTranscriptMode: $
        }), q[23] = K, q[24] = $, q[25] = Y, q[26] = _;
        else _ = q[26];
        return _
    }
    if (Y.text.includes(`<${NO}`)) {
        let _;
        if (q[27] !== K || q[28] !== Y) _ = Qw.createElement(bx4, {
            addMargin: K,
            param: Y
        }), q[27] = K, q[28] = Y, q[29] = _;
        else _ = q[29];
        return _
    }
    let O;
    if (q[30] !== K || q[31] !== Y || q[32] !== w) O = Qw.createElement(eI4, {
        addMargin: K,
        param: Y,
        thinkingMetadata: w
    }), q[30] = K, q[31] = Y, q[32] = w, q[33] = O;
    else O = q[33];
    return O
}
// @from(Ln 322889, Col 4)
Qw
// @from(Ln 322890, Col 4)
RM6 = v(() => {
    i1();
    vvA();
    nI4();
    Ax4();
    zx4();
    Y01();
    N8();
    eq();
    $x4();
    Jx4();
    RvA();
    Dx4();
    S9();
    xx4();
    ux4();
    vz();
    dvA();
    N8();
    Qw = o(X1(), 1)
})
// @from(Ln 322915, Col 0)
function yM6(A) {
    let q = e(7),
        {
            imageId: K,
            addMargin: Y
        } = A,
        z = K ? `[Image #${K}]` : "[Image]",
        w;
    if (q[0] !== K || q[1] !== z) {
        let O = K ? Hw6(K) : null;
        w = O && Vv() ? qI.createElement(d7, {
            url: PfY(O).href
        }, qI.createElement(V, null, z)) : qI.createElement(V, null, z), q[0] = K, q[1] = z, q[2] = w
    } else w = q[2];
    let H = w;
    if (Y) {
        let O;
        if (q[3] !== H) O = qI.createElement(I, {
            marginTop: 1
        }, H), q[3] = H, q[4] = O;
        else O = q[4];
        return O
    }
    let $;
    if (q[5] !== H) $ = qI.createElement(HA, null, H), q[5] = H, q[6] = $;
    else $ = q[6];
    return $
}
// @from(Ln 322943, Col 4)
qI
// @from(Ln 322944, Col 4)
cvA = v(() => {
    i1();
    m1();
    VD1();
    po();
    xo();
    eq();
    qI = o(X1(), 1)
})
// @from(Ln 322954, Col 0)
function CM6(A) {
    let q = e(17),
        {
            param: K,
            addMargin: Y,
            isTranscriptMode: z,
            hideInTranscript: w
        } = A,
        {
            thinking: H
        } = K,
        $ = Y === void 0 ? !1 : Y,
        O = w === void 0 ? !1 : w,
        _ = RK("app:toggleTranscript", "Global", "ctrl+o"),
        J;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) J = !1, q[0] = J;
    else J = q[0];
    if (!H && !J) return null;
    if (O) return null;
    let D = z,
        j;
    if (q[1] !== H) j = "∴ Thinking", q[1] = H, q[2] = j;
    else j = q[2];
    let M = j;
    if (!D) {
        let Z = $ ? 1 : 0,
            N;
        if (q[3] !== _ || q[4] !== M) N = O51.default.createElement(V, {
            dimColor: !0,
            italic: !0
        }, M, " (", _, " to expand)"), q[3] = _, q[4] = M, q[5] = N;
        else N = q[5];
        let T;
        if (q[6] !== Z || q[7] !== N) T = O51.default.createElement(I, {
            marginTop: Z
        }, N), q[6] = Z, q[7] = N, q[8] = T;
        else T = q[8];
        return T
    }
    let P = $ ? 1 : 0,
        W;
    if (q[9] !== M) W = O51.default.createElement(V, {
        dimColor: !0,
        italic: !0
    }, M, "…"), q[9] = M, q[10] = W;
    else W = q[10];
    let G;
    if (q[11] !== H) G = O51.default.createElement(I, {
        paddingLeft: 2
    }, O51.default.createElement(TJ, {
        dimColor: !0
    }, H)), q[11] = H, q[12] = G;
    else G = q[12];
    let f;
    if (q[13] !== P || q[14] !== W || q[15] !== G) f = O51.default.createElement(I, {
        flexDirection: "column",
        gap: 1,
        marginTop: P,
        width: "100%"
    }, W, G), q[13] = P, q[14] = W, q[15] = G, q[16] = f;
    else f = q[16];
    return f
}
// @from(Ln 323017, Col 4)
O51
// @from(Ln 323018, Col 4)
lvA = v(() => {
    i1();
    m1();
    uh();
    s2();
    cA();
    O51 = o(X1(), 1)
})
// @from(Ln 323027, Col 0)
function Bx4(A) {
    let q = e(3),
        {
            addMargin: K
        } = A,
        z = (K === void 0 ? !1 : K) ? 1 : 0,
        w;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) w = ivA.default.createElement(V, {
        dimColor: !0,
        italic: !0
    }, "✻ Thinking…"), q[0] = w;
    else w = q[0];
    let H;
    if (q[1] !== z) H = ivA.default.createElement(I, {
        marginTop: z
    }, w), q[1] = z, q[2] = H;
    else H = q[2];
    return H
}
// @from(Ln 323046, Col 4)
ivA
// @from(Ln 323047, Col 4)
mx4 = v(() => {
    i1();
    m1();
    ivA = o(X1(), 1)
})
// @from(Ln 323056, Col 0)
function Fx4(A) {
    let q = e(14),
        {
            attachment: K,
            verbose: Y
        } = A,
        z = RK("app:toggleTranscript", "Global", "ctrl+o");
    if (K.files.length === 0) return null;
    let w;
    if (q[0] !== K.files) w = K.files.reduce(ffY, 0), q[0] = K.files, q[1] = w;
    else w = q[1];
    let H = w,
        $ = K.files.length;
    if (Y) {
        let O;
        if (q[2] !== K.files) O = K.files.map(GfY), q[2] = K.files, q[3] = O;
        else O = q[3];
        let _;
        if (q[4] !== O) _ = rv.default.createElement(I, {
            flexDirection: "column"
        }, O), q[4] = O, q[5] = _;
        else _ = q[5];
        return _
    } else {
        let O;
        if (q[6] !== H) O = rv.default.createElement(V, {
            bold: !0
        }, H), q[6] = H, q[7] = O;
        else O = q[7];
        let _ = H === 1 ? "issue" : "issues",
            J = $ === 1 ? "file" : "files",
            X;
        if (q[8] !== z || q[9] !== $ || q[10] !== O || q[11] !== _ || q[12] !== J) X = rv.default.createElement(HA, null, rv.default.createElement(V, {
            dimColor: !0,
            wrap: "wrap"
        }, "Found ", O, " new diagnostic", " ", _, " in ", $, " ", J, " (", z, " to expand)")), q[8] = z, q[9] = $, q[10] = O, q[11] = _, q[12] = J, q[13] = X;
        else X = q[13];
        return X
    }
}
// @from(Ln 323097, Col 0)
function GfY(A, q) {
    return rv.default.createElement(rv.default.Fragment, {
        key: q
    }, rv.default.createElement(HA, null, rv.default.createElement(V, {
        dimColor: !0,
        wrap: "wrap"
    }, rv.default.createElement(V, {
        bold: !0
    }, WfY(h6(), A.uri.replace("file://", "").replace("_claude_fs_right:", ""))), " ", rv.default.createElement(V, {
        dimColor: !0
    }, A.uri.startsWith("file://") ? "(file://)" : A.uri.startsWith("_claude_fs_right:") ? "(claude_fs_right)" : `(${A.uri.split(":")[0]})`), ":")), A.diagnostics.map(ZfY))
}
// @from(Ln 323110, Col 0)
function ZfY(A, q) {
    return rv.default.createElement(HA, {
        key: q
    }, rv.default.createElement(V, {
        dimColor: !0,
        wrap: "wrap"
    }, "  ", KI.getSeveritySymbol(A.severity), " [Line ", A.range.start.line + 1, ":", A.range.start.character + 1, "] ", A.message, A.code ? ` [${A.code}]` : "", A.source ? ` (${A.source})` : ""))
}
// @from(Ln 323119, Col 0)
function ffY(A, q) {
    return A + q.diagnostics.length
}
// @from(Ln 323122, Col 4)
rv
// @from(Ln 323123, Col 4)
Qx4 = v(() => {
    i1();
    m1();
    N7();
    eq();
    _51();
    s2();
    rv = o(X1(), 1)
})
// @from(Ln 323137, Col 0)
function gx4({
    attachment: A,
    addMargin: q,
    verbose: K,
    isTranscriptMode: Y
}) {
    let z = v6((w) => w.tasks);
    if (l8() && A.type === "teammate_mailbox") {
        let w = A.messages.filter((H) => {
            if (UZ(H.text)) return !1;
            try {
                let $ = _A(H.text);
                return $?.type !== "idle_notification" && $?.type !== "teammate_terminated"
            } catch {
                return !0
            }
        });
        if (w.length === 0) return null;
        return S4.default.createElement(I, {
            flexDirection: "column"
        }, w.map((H, $) => {
            let O = null;
            try {
                O = _A(H.text)
            } catch {}
            if (O?.type === "task_assignment") return S4.default.createElement(I, {
                key: $,
                paddingLeft: 2
            }, S4.default.createElement(V, null, gY, " "), S4.default.createElement(V, null, "Task assigned: "), S4.default.createElement(V, {
                bold: !0
            }, "#", O.taskId), S4.default.createElement(V, null, " - ", O.subject), S4.default.createElement(V, {
                dimColor: !0
            }, " (from ", O.assignedBy || H.from, ")"));
            let _ = kM6(H.text, H.from);
            if (_) return S4.default.createElement(S4.default.Fragment, {
                key: $
            }, _);
            let J = qP(H.color),
                X = hx4(H.text) ?? H.text;
            return S4.default.createElement(NfY, {
                key: $,
                displayName: H.from,
                inkColor: J,
                content: X,
                summary: H.summary,
                isTranscriptMode: Y
            })
        }))
    }
    switch (A.type) {
        case "directory":
            return S4.default.createElement(oX, null, "Listed directory", " ", S4.default.createElement(V, {
                bold: !0
            }, es(h6(), A.path) + VfY));
        case "file":
        case "already_read_file":
            if (A.content.type === "notebook") return S4.default.createElement(oX, null, "Read ", S4.default.createElement(V, {
                bold: !0
            }, es(h6(), A.filename)), " (", A.content.file.cells.length, " cells)");
            return S4.default.createElement(oX, null, "Read ", S4.default.createElement(V, {
                bold: !0
            }, es(h6(), A.filename)), " (", A.content.type === "text" ? `${A.content.file.numLines}${A.truncated?"+":""} lines` : L2(A.content.file.originalSize), ")");
        case "compact_file_reference":
            return S4.default.createElement(oX, null, "Referenced file", " ", S4.default.createElement(V, {
                bold: !0
            }, es(h6(), A.filename)));
        case "pdf_reference":
            return S4.default.createElement(oX, null, "Referenced PDF", " ", S4.default.createElement(V, {
                bold: !0
            }, es(h6(), A.filename)), " (", A.pageCount, " pages)");
        case "selected_lines_in_ide":
            return S4.default.createElement(oX, null, "⧉ Selected", " ", S4.default.createElement(V, {
                bold: !0
            }, A.lineEnd - A.lineStart + 1), " ", "lines from ", S4.default.createElement(V, {
                bold: !0
            }, es(h6(), A.filename)), " ", "in ", A.ideName);
        case "nested_memory":
            return S4.default.createElement(oX, null, "Loaded ", S4.default.createElement(V, {
                bold: !0
            }, es(h6(), A.path)));
        case "dynamic_skill": {
            let w = es(h6(), A.skillDir),
                H = A.skillNames.length;
            return S4.default.createElement(oX, null, "Loaded", " ", S4.default.createElement(V, {
                bold: !0
            }, H, " skill", H !== 1 ? "s" : ""), " ", "from ", S4.default.createElement(V, {
                bold: !0
            }, w))
        }
        case "skill_listing": {
            if (A.isInitial) return null;
            return S4.default.createElement(oX, null, S4.default.createElement(V, {
                bold: !0
            }, A.skillCount), " skill", A.skillCount !== 1 ? "s" : "", " available")
        }
        case "queued_command": {
            let w = typeof A.prompt === "string" ? A.prompt : J51(A.prompt) || "",
                H = A.imagePasteIds && A.imagePasteIds.length > 0;
            return S4.default.createElement(I, {
                flexDirection: "column"
            }, S4.default.createElement($51, {
                addMargin: q,
                param: {
                    text: w,
                    type: "text"
                },
                verbose: K
            }), H && A.imagePasteIds?.map(($) => S4.default.createElement(yM6, {
                key: $,
                imageId: $
            })))
        }
        case "todo":
            if (A.context === "post-compact") return S4.default.createElement(oX, null, "Todo list read (", A.itemCount, " ", A.itemCount === 1 ? "item" : "items", ")");
            return null;
        case "plan_file_reference":
            return S4.default.createElement(oX, null, "Plan file referenced (", L3(A.planFilePath), ")");
        case "invoked_skills": {
            if (A.skills.length === 0) return null;
            let w = A.skills.map((H) => H.name).join(", ");
            return S4.default.createElement(oX, null, "Skills restored (", w, ")")
        }
        case "diagnostics":
            return S4.default.createElement(Fx4, {
                attachment: A,
                verbose: K
            });
        case "mcp_resource":
            return S4.default.createElement(oX, null, "Read MCP resource ", S4.default.createElement(V, {
                bold: !0
            }, A.name), " from", " ", A.server);
        case "command_permissions":
            return null;
        case "async_hook_response": {
            if (A.hookEvent === "SessionStart" && !K) return null;
            if ((A.hookEvent === "PreToolUse" || A.hookEvent === "PostToolUse") && !Y) return null;
            return S4.default.createElement(oX, null, "Async hook ", S4.default.createElement(V, {
                bold: !0
            }, A.hookEvent), " completed")
        }
        case "hook_blocking_error": {
            if (A.hookEvent === "Stop" || A.hookEvent === "SubagentStop") return null;
            return S4.default.createElement(oX, {
                color: "error"
            }, A.hookName, " hook returned blocking error")
        }
        case "hook_non_blocking_error": {
            if (A.hookEvent === "Stop" || A.hookEvent === "SubagentStop") return null;
            return S4.default.createElement(oX, {
                color: "error"
            }, A.hookName, " hook error")
        }
        case "hook_error_during_execution":
            if (A.hookEvent === "Stop" || A.hookEvent === "SubagentStop") return null;
            return S4.default.createElement(oX, null, A.hookName, " hook warning");
        case "hook_success":
            return null;
        case "hook_stopped_continuation":
            if (A.hookEvent === "Stop" || A.hookEvent === "SubagentStop") return null;
            return S4.default.createElement(oX, {
                color: "warning"
            }, A.hookName, " hook stopped continuation: ", A.message);
        case "hook_system_message":
            return S4.default.createElement(oX, null, A.hookName, " says: ", A.content);
        case "hook_permission_decision": {
            let w = A.decision === "allow" ? "Allowed" : "Denied";
            return S4.default.createElement(oX, null, w, " by ", S4.default.createElement(V, {
                bold: !0
            }, A.hookEvent), " hook")
        }
        case "task_status": {
            if (KY() && A.status === "killed") return null;
            if (l8()) {
                let H = z[A.taskId];
                if (A.taskType === "in_process_teammate" && H?.type === "in_process_teammate") {
                    let $ = qP(H.identity.color),
                        O = A.status === "completed" ? "shut down gracefully" : A.status;
                    return S4.default.createElement(I, {
                        flexDirection: "row",
                        width: "100%",
                        marginTop: 1
                    }, S4.default.createElement(V, {
                        dimColor: !0
                    }, gY, " "), S4.default.createElement(V, {
                        dimColor: !0
                    }, "Teammate", " ", S4.default.createElement(V, {
                        color: $,
                        bold: !0,
                        dimColor: !1
                    }, "@", H.identity.agentName), " ", O))
                }
            }
            let w = A.status === "completed" ? "completed in background" : A.status === "killed" ? "stopped" : A.status;
            return S4.default.createElement(I, {
                flexDirection: "row",
                width: "100%",
                marginTop: 1
            }, S4.default.createElement(V, {
                dimColor: !0
            }, gY, " "), S4.default.createElement(V, {
                dimColor: !0
            }, 'Task "', S4.default.createElement(V, {
                bold: !0
            }, A.description), '"', " ", w))
        }
        case "task_progress":
            return null;
        case "teammate_shutdown_batch":
            return S4.default.createElement(I, {
                flexDirection: "row",
                width: "100%",
                marginTop: 1
            }, S4.default.createElement(V, {
                dimColor: !0
            }, gY, " "), S4.default.createElement(V, {
                dimColor: !0
            }, A.count, " teammate", A.count === 1 ? "" : "s", " shut down gracefully"));
        case "agent_mention":
        case "budget_usd":
        case "critical_system_reminder":
        case "delegate_mode":
        case "delegate_mode_exit":
        case "edited_image_file":
        case "edited_text_file":
        case "hook_additional_context":
        case "hook_cancelled":
        case "opened_file_in_ide":
        case "output_style":
        case "plan_mode":
        case "plan_mode_exit":
        case "plan_mode_reentry":
        case "structured_output":
        case "team_context":
        case "todo_reminder":
        case "ultramemory":
        case "token_usage":
            return null
    }
}
// @from(Ln 323377, Col 0)
function NfY(A) {
    let q = e(14),
        {
            displayName: K,
            inkColor: Y,
            content: z,
            summary: w,
            isTranscriptMode: H
        } = A,
        $ = `@${K}${l1.pointer}`,
        O;
    if (q[0] !== Y || q[1] !== $) O = S4.default.createElement(V, {
        color: Y
    }, $), q[0] = Y, q[1] = $, q[2] = O;
    else O = q[2];
    let _;
    if (q[3] !== w) _ = w && S4.default.createElement(V, null, " ", w), q[3] = w, q[4] = _;
    else _ = q[4];
    let J;
    if (q[5] !== O || q[6] !== _) J = S4.default.createElement(I, null, O, _), q[5] = O, q[6] = _, q[7] = J;
    else J = q[7];
    let X;
    if (q[8] !== z || q[9] !== H) X = H && S4.default.createElement(I, {
        paddingLeft: 2
    }, S4.default.createElement(V, null, S4.default.createElement(W3, null, z))), q[8] = z, q[9] = H, q[10] = X;
    else X = q[10];
    let D;
    if (q[11] !== J || q[12] !== X) D = S4.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, J, X), q[11] = J, q[12] = X, q[13] = D;
    else D = q[13];
    return D
}
// @from(Ln 323412, Col 0)
function oX(A) {
    let q = e(4),
        {
            dimColor: K,
            children: Y,
            color: z
        } = A,
        w = K === void 0 ? !0 : K,
        H;
    if (q[0] !== Y || q[1] !== z || q[2] !== w) H = S4.default.createElement(HA, null, S4.default.createElement(V, {
        color: z,
        dimColor: w,
        wrap: "wrap"
    }, Y)), q[0] = Y, q[1] = z, q[2] = w, q[3] = H;
    else H = q[3];
    return H
}
// @from(Ln 323429, Col 4)
S4
// @from(Ln 323430, Col 4)
Ux4 = v(() => {
    i1();
    m1();
    d8();
    wq();
    eq();
    N7();
    RM6();
    Qx4();
    N8();
    cvA();
    Zd();
    m6();
    S9();
    cM();
    pvA();
    jW();
    b7();
    H$();
    S4 = o(X1(), 1)
})
// @from(Ln 323452, Col 0)
function px4(A) {
    let q = e(18),
        {
            message: K
        } = A,
        {
            retryAttempt: Y,
            error: z,
            retryInMs: w,
            maxRetries: H
        } = K,
        [$, O] = SM6.useState(0),
        _;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) _ = () => O(TfY), q[0] = _;
    else _ = q[0];
    RX(_, 1000);
    let J, X;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) J = () => O(0), X = [], q[1] = J, q[2] = X;
    else J = q[1], X = q[2];
    if (SM6.useEffect(J, X), Y < 4) return null;
    let D;
    if (q[3] !== $ || q[4] !== w) D = Math.round((w - $) / 1000), q[3] = $, q[4] = w, q[5] = D;
    else D = q[5];
    let j = Math.max(0, D),
        M;
    if (q[6] !== z) M = Uz6(z), q[6] = z, q[7] = M;
    else M = q[7];
    let P;
    if (q[8] !== M) P = yd.createElement(V, {
        color: "error"
    }, M), q[8] = M, q[9] = P;
    else P = q[9];
    let W = j === 1 ? "second" : "seconds",
        G;
    if (q[10] !== H || q[11] !== Y || q[12] !== j || q[13] !== W) G = yd.createElement(V, {
        dimColor: !0
    }, "Retrying in ", j, " ", W, "… (attempt", " ", Y, "/", H, ")", process.env.API_TIMEOUT_MS ? ` · API_TIMEOUT_MS=${process.env.API_TIMEOUT_MS}ms, try increasing it` : ""), q[10] = H, q[11] = Y, q[12] = j, q[13] = W, q[14] = G;
    else G = q[14];
    let f;
    if (q[15] !== P || q[16] !== G) f = yd.createElement(HA, null, yd.createElement(I, {
        flexDirection: "column"
    }, P, G)), q[15] = P, q[16] = G, q[17] = f;
    else f = q[17];
    return f
}
// @from(Ln 323498, Col 0)
function TfY(A) {
    return A + 1000
}
// @from(Ln 323501, Col 4)
yd
// @from(Ln 323501, Col 8)
SM6
// @from(Ln 323502, Col 4)
dx4 = v(() => {
    i1();
    eq();
    m1();
    QU();
    XZ();
    yd = o(X1(), 1), SM6 = o(X1(), 1)
})
// @from(Ln 323511, Col 0)
function lx4(A) {
    let q = e(15),
        {
            message: K,
            addMargin: Y,
            verbose: z
        } = A;
    if (K.subtype === "turn_duration") {
        let X;
        if (q[0] !== Y || q[1] !== K) X = Z3.createElement(RfY, {
            message: K,
            addMargin: Y
        }), q[0] = Y, q[1] = K, q[2] = X;
        else X = q[2];
        return X
    }
    if (K.subtype === "thinking") return null;
    if (K.subtype !== "stop_hook_summary" && !z && K.level === "info") return null;
    if (K.subtype === "api_error") {
        let X;
        if (q[3] !== K) X = Z3.createElement(px4, {
            message: K
        }), q[3] = K, q[4] = X;
        else X = q[4];
        return X
    }
    if (K.subtype === "stop_hook_summary") {
        let X;
        if (q[5] !== Y || q[6] !== K || q[7] !== z) X = Z3.createElement(vfY, {
            message: K,
            addMargin: Y,
            verbose: z
        }), q[5] = Y, q[6] = K, q[7] = z, q[8] = X;
        else X = q[8];
        return X
    }
    let H = K.content,
        $ = K.level !== "info",
        O = K.level === "warning" ? "warning" : void 0,
        _ = K.level === "info",
        J;
    if (q[9] !== Y || q[10] !== H || q[11] !== $ || q[12] !== O || q[13] !== _) J = Z3.createElement(I, {
        flexDirection: "row",
        width: "100%"
    }, Z3.createElement(LfY, {
        content: H,
        addMargin: Y,
        dot: $,
        color: O,
        dimColor: _
    })), q[9] = Y, q[10] = H, q[11] = $, q[12] = O, q[13] = _, q[14] = J;
    else J = q[14];
    return J
}
// @from(Ln 323566, Col 0)
function vfY(A) {
    let q = e(23),
        {
            message: K,
            addMargin: Y,
            verbose: z
        } = A,
        {
            hookCount: w,
            hookInfos: H,
            hookErrors: $,
            preventedContinuation: O,
            stopReason: _
        } = K,
        {
            columns: J
        } = Z8();
    if ($.length === 0 && !O) return null;
    let X = Y ? 1 : 0,
        D;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) D = Z3.createElement(I, {
        minWidth: 2
    }, Z3.createElement(V, null, gY)), q[0] = D;
    else D = q[0];
    let j = J - 10,
        M;
    if (q[1] !== w) M = Z3.createElement(V, {
        bold: !0
    }, w), q[1] = w, q[2] = M;
    else M = q[2];
    let P = w === 1 ? "hook" : "hooks",
        W;
    if (q[3] !== M || q[4] !== P) W = Z3.createElement(V, null, "Ran ", M, " stop", " ", P), q[3] = M, q[4] = P, q[5] = W;
    else W = q[5];
    let G;
    if (q[6] !== H || q[7] !== z) G = z && H.length > 0 && H.map(kfY), q[6] = H, q[7] = z, q[8] = G;
    else G = q[8];
    let f;
    if (q[9] !== O || q[10] !== _) f = O && _ && Z3.createElement(V, null, "⎿  ", _), q[9] = O, q[10] = _, q[11] = f;
    else f = q[11];
    let Z;
    if (q[12] !== $) Z = $.length > 0 && $.map(EfY), q[12] = $, q[13] = Z;
    else Z = q[13];
    let N;
    if (q[14] !== j || q[15] !== W || q[16] !== G || q[17] !== f || q[18] !== Z) N = Z3.createElement(I, {
        flexDirection: "column",
        width: j
    }, W, G, f, Z), q[14] = j, q[15] = W, q[16] = G, q[17] = f, q[18] = Z, q[19] = N;
    else N = q[19];
    let T;
    if (q[20] !== X || q[21] !== N) T = Z3.createElement(I, {
        flexDirection: "row",
        marginTop: X,
        width: "100%"
    }, D, N), q[20] = X, q[21] = N, q[22] = T;
    else T = q[22];
    return T
}
// @from(Ln 323625, Col 0)
function EfY(A, q) {
    return Z3.createElement(V, {
        key: q
    }, "⎿  Stop hook error: ", A)
}
// @from(Ln 323631, Col 0)
function kfY(A, q) {
    return Z3.createElement(V, {
        key: `cmd-${q}`
    }, "⎿  ", A.command === "prompt" ? `prompt: ${A.promptText||""}` : `command: ${A.command}`)
}
// @from(Ln 323637, Col 0)
function LfY(A) {
    let q = e(17),
        {
            content: K,
            addMargin: Y,
            dot: z,
            color: w,
            dimColor: H
        } = A,
        {
            columns: $
        } = Z8(),
        O = Y ? 1 : 0,
        _;
    if (q[0] !== w || q[1] !== H || q[2] !== z) _ = z && Z3.createElement(I, {
        minWidth: 2
    }, Z3.createElement(V, {
        color: w,
        dimColor: H
    }, gY)), q[0] = w, q[1] = H, q[2] = z, q[3] = _;
    else _ = q[3];
    let J = $ - 10,
        X;
    if (q[4] !== K) X = K.trim(), q[4] = K, q[5] = X;
    else X = q[5];
    let D;
    if (q[6] !== w || q[7] !== H || q[8] !== X) D = Z3.createElement(V, {
        color: w,
        dimColor: H,
        wrap: "wrap"
    }, X), q[6] = w, q[7] = H, q[8] = X, q[9] = D;
    else D = q[9];
    let j;
    if (q[10] !== J || q[11] !== D) j = Z3.createElement(I, {
        flexDirection: "column",
        width: J
    }, D), q[10] = J, q[11] = D, q[12] = j;
    else j = q[12];
    let M;
    if (q[13] !== O || q[14] !== _ || q[15] !== j) M = Z3.createElement(I, {
        flexDirection: "row",
        marginTop: O,
        width: "100%"
    }, _, j), q[13] = O, q[14] = _, q[15] = j, q[16] = M;
    else M = q[16];
    return M
}
// @from(Ln 323685, Col 0)
function RfY(A) {
    let q = e(9),
        {
            message: K,
            addMargin: Y
        } = A,
        [z] = cx4.useState(yfY);
    if (!(f6().showTurnDuration ?? !0)) return null;
    let H;
    if (q[0] !== K.durationMs) H = Xz(K.durationMs), q[0] = K.durationMs, q[1] = H;
    else H = q[1];
    let $ = H,
        O = Y ? 1 : 0,
        _;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) _ = Z3.createElement(I, {
        minWidth: 2
    }, Z3.createElement(V, {
        dimColor: !0
    }, XC1)), q[2] = _;
    else _ = q[2];
    let J;
    if (q[3] !== $ || q[4] !== z) J = Z3.createElement(V, {
        dimColor: !0
    }, z, " for ", $), q[3] = $, q[4] = z, q[5] = J;
    else J = q[5];
    let X;
    if (q[6] !== O || q[7] !== J) X = Z3.createElement(I, {
        flexDirection: "row",
        marginTop: O,
        width: "100%"
    }, _, J), q[6] = O, q[7] = J, q[8] = X;
    else X = q[8];
    return X
}
// @from(Ln 323720, Col 0)
function yfY() {
    return pj(kP1) ?? "Worked"
}
// @from(Ln 323723, Col 4)
Z3
// @from(Ln 323723, Col 8)
cx4
// @from(Ln 323724, Col 4)
ix4 = v(() => {
    i1();
    m1();
    gl();
    jW();
    Lj6();
    mq();
    dx4();
    vq();
    cA();
    Z3 = o(X1(), 1), cx4 = o(X1(), 1)
})
// @from(Ln 323737, Col 0)
function nx4() {
    let A = e(2),
        q = RK("app:toggleTranscript", "Global", "ctrl+o"),
        K;
    if (A[0] !== q) K = GQ1.createElement(I, {
        marginY: 1
    }, GQ1.createElement(V, {
        dimColor: !0
    }, "✻ Conversation compacted (", q, " for history)")), A[0] = q, A[1] = K;
    else K = A[1];
    return K
}
// @from(Ln 323749, Col 4)
GQ1
// @from(Ln 323750, Col 4)
rx4 = v(() => {
    i1();
    m1();
    s2();
    GQ1 = o(X1(), 1)
})
// @from(Ln 323756, Col 4)
CfY
// @from(Ln 323757, Col 4)
ox4 = v(() => {
    i1();
    m1();
    jW();
    mq();
    CfY = o(X1(), 1)
})
// @from(Ln 323765, Col 0)
function ax4({
    message: A,
    tools: q,
    lookups: K,
    inProgressToolUseIDs: Y,
    shouldAnimate: z
}) {
    let w = q.find((_) => _.name === A.toolName);
    if (!w?.renderGroupedToolUse) return null;
    let H = new Map;
    for (let _ of A.results)
        for (let J of _.message.content)
            if (J.type === "tool_result") H.set(J.tool_use_id, {
                param: J,
                output: _.toolUseResult
            });
    let $ = A.messages.map((_) => {
            let J = _.message.content[0],
                X = H.get(J.id);
            return {
                param: J,
                isResolved: K.resolvedToolUseIDs.has(J.id),
                isError: K.erroredToolUseIDs.has(J.id),
                isInProgress: Y.has(J.id),
                progressMessages: go(K.progressMessagesByToolUseID.get(J.id) ?? []),
                result: X
            }
        }),
        O = $.some((_) => _.isInProgress);
    return w.renderGroupedToolUse($, {
        shouldAnimate: z && O,
        tools: q
    })
}
// @from(Ln 323799, Col 4)
sx4 = () => {}