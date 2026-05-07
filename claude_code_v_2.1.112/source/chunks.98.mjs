
// @from(Ln 258668, Col 4)
kj = L(() => {
    cb8();
    U4();
    C8();
    y8();
    oW();
    h1();
    D_();
    Q8();
    Q4();
    Yq();
    Ow6();
    Dn1();
    U8();
    NK();
    NV();
    cW();
    x$();
    K8();
    w46();
    m8();
    Zn1();
    e8();
    vh6 = {
        cursor: {
            ideKind: "vscode",
            displayName: "Cursor",
            processKeywordsMac: ["Cursor Helper", "Cursor.app"],
            processKeywordsWindows: ["cursor.exe"],
            processKeywordsLinux: ["cursor"]
        },
        windsurf: {
            ideKind: "vscode",
            displayName: "Windsurf",
            processKeywordsMac: ["Windsurf Helper", "Windsurf.app"],
            processKeywordsWindows: ["windsurf.exe"],
            processKeywordsLinux: ["windsurf"]
        },
        vscode: {
            ideKind: "vscode",
            displayName: "VS Code",
            processKeywordsMac: ["Visual Studio Code", "Code Helper"],
            processKeywordsWindows: ["code.exe"],
            processKeywordsLinux: ["code"]
        },
        intellij: {
            ideKind: "jetbrains",
            displayName: "IntelliJ IDEA",
            processKeywordsMac: ["IntelliJ IDEA"],
            processKeywordsWindows: ["idea64.exe"],
            processKeywordsLinux: ["idea", "intellij"]
        },
        pycharm: {
            ideKind: "jetbrains",
            displayName: "PyCharm",
            processKeywordsMac: ["PyCharm"],
            processKeywordsWindows: ["pycharm64.exe"],
            processKeywordsLinux: ["pycharm"]
        },
        webstorm: {
            ideKind: "jetbrains",
            displayName: "WebStorm",
            processKeywordsMac: ["WebStorm"],
            processKeywordsWindows: ["webstorm64.exe"],
            processKeywordsLinux: ["webstorm"]
        },
        phpstorm: {
            ideKind: "jetbrains",
            displayName: "PhpStorm",
            processKeywordsMac: ["PhpStorm"],
            processKeywordsWindows: ["phpstorm64.exe"],
            processKeywordsLinux: ["phpstorm"]
        },
        rubymine: {
            ideKind: "jetbrains",
            displayName: "RubyMine",
            processKeywordsMac: ["RubyMine"],
            processKeywordsWindows: ["rubymine64.exe"],
            processKeywordsLinux: ["rubymine"]
        },
        clion: {
            ideKind: "jetbrains",
            displayName: "CLion",
            processKeywordsMac: ["CLion"],
            processKeywordsWindows: ["clion64.exe"],
            processKeywordsLinux: ["clion"]
        },
        goland: {
            ideKind: "jetbrains",
            displayName: "GoLand",
            processKeywordsMac: ["GoLand"],
            processKeywordsWindows: ["goland64.exe"],
            processKeywordsLinux: ["goland"]
        },
        rider: {
            ideKind: "jetbrains",
            displayName: "Rider",
            processKeywordsMac: ["Rider"],
            processKeywordsWindows: ["rider64.exe"],
            processKeywordsLinux: ["rider"]
        },
        datagrip: {
            ideKind: "jetbrains",
            displayName: "DataGrip",
            processKeywordsMac: ["DataGrip"],
            processKeywordsWindows: ["datagrip64.exe"],
            processKeywordsLinux: ["datagrip"]
        },
        appcode: {
            ideKind: "jetbrains",
            displayName: "AppCode",
            processKeywordsMac: ["AppCode"],
            processKeywordsWindows: ["appcode.exe"],
            processKeywordsLinux: ["appcode"]
        },
        dataspell: {
            ideKind: "jetbrains",
            displayName: "DataSpell",
            processKeywordsMac: ["DataSpell"],
            processKeywordsWindows: ["dataspell64.exe"],
            processKeywordsLinux: ["dataspell"]
        },
        aqua: {
            ideKind: "jetbrains",
            displayName: "Aqua",
            processKeywordsMac: [],
            processKeywordsWindows: ["aqua64.exe"],
            processKeywordsLinux: []
        },
        gateway: {
            ideKind: "jetbrains",
            displayName: "Gateway",
            processKeywordsMac: [],
            processKeywordsWindows: ["gateway64.exe"],
            processKeywordsLinux: []
        },
        fleet: {
            ideKind: "jetbrains",
            displayName: "Fleet",
            processKeywordsMac: [],
            processKeywordsWindows: ["fleet.exe"],
            processKeywordsLinux: []
        },
        androidstudio: {
            ideKind: "jetbrains",
            displayName: "Android Studio",
            processKeywordsMac: ["Android Studio"],
            processKeywordsWindows: ["studio64.exe"],
            processKeywordsLinux: ["android-studio"]
        }
    };
    C88 = P1(() => {
        return nb8(X7.terminal)
    }), Th6 = P1(() => {
        return Up(UE.terminal)
    }), q0 = P1(() => {
        return C88() || Th6() || Boolean(process.env.FORCE_CODE_TERMINAL)
    });
    uXz = P1(async () => {
        if (process.env.USERPROFILE) return process.env.USERPROFILE;
        let {
            stdout: q,
            code: K
        } = await w1("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", "$env:USERPROFILE"]);
        if (K === 0 && q.trim()) return q.trim();
        E("Unable to get Windows USERPROFILE via PowerShell - IDE detection may be incomplete");
        return
    });
    iR4 = {
        code: "VS Code",
        cursor: "Cursor",
        windsurf: "Windsurf",
        antigravity: "Antigravity",
        vi: "Vim",
        vim: "Vim",
        nano: "nano",
        notepad: "Notepad",
        "start /wait notepad": "Notepad",
        emacs: "Emacs",
        subl: "Sublime Text",
        atom: "Atom"
    };
    AS4 = P1(async (q, K) => {
        if (process.env.CLAUDE_CODE_IDE_HOST_OVERRIDE) return process.env.CLAUDE_CODE_IDE_HOST_OVERRIDE;
        if (y1() !== "wsl" || !q) return "127.0.0.1";
        try {
            let _ = await ij("ip route show | grep -i default", {
                reject: !1
            });
            if (_.exitCode === 0 && _.stdout) {
                let z = _.stdout.match(/default via (\d+\.\d+\.\d+\.\d+)/);
                if (z) {
                    let Y = z[1];
                    if (await Vn1(Y, K)) return Y
                }
            }
        } catch (_) {}
        return "127.0.0.1"
    }, (q, K) => `${q}:${K}`)
})
// @from(Ln 258869, Col 0)
function EJ(q) {
    return typeof q === "object" && q !== null && "type" in q && q.type === "in_process_teammate"
}
// @from(Ln 258873, Col 0)
function QH6(q, K) {
    if (q === void 0 || q.length === 0) return [K];
    if (q.length >= OS4) {
        let _ = q.slice(-(OS4 - 1));
        return _.push(K), _
    }
    return [...q, K]
}
// @from(Ln 258881, Col 4)
OS4 = 50
// @from(Ln 258883, Col 0)
function dp(q) {
    let {
        viewingAgentTaskId: K,
        tasks: _
    } = q;
    if (!K) return;
    let z = _[K];
    if (!z) return;
    if (!EJ(z)) return;
    return z
}
// @from(Ln 258895, Col 0)
function ab8(q) {
    let K = dp(q);
    if (K) return {
        type: "viewed",
        task: K
    };
    let {
        viewingAgentTaskId: _,
        tasks: z
    } = q;
    if (_) {
        let Y = z[_];
        if (Y?.type === "local_agent") return {
            type: "named_agent",
            task: Y
        }
    }
    return {
        type: "leader"
    }
}
// @from(Ln 258916, Col 4)
kh6 = () => {}
// @from(Ln 258918, Col 0)
function dH6(q) {
    return q.type === "image" && q.content.length > 0
}
// @from(Ln 258922, Col 0)
function wS4(q) {
    if (!q) return;
    let K = Object.values(q).filter(dH6).map((_) => _.id);
    return K.length > 0 ? K : void 0
}
// @from(Ln 258928, Col 0)
function cH6(q) {
    return q.type === "advisor_tool_result" || q.type === "server_tool_use" && q.name === "advisor"
}
// @from(Ln 258932, Col 0)
function vx() {
    if (S6(process.env.CLAUDE_CODE_DISABLE_ADVISOR_TOOL)) return !1;
    if (pq() !== "firstParty" || !ja()) return !1;
    if (S6(process.env.CLAUDE_CODE_ENABLE_EXPERIMENTAL_ADVISOR_TOOL)) return !0;
    return u8("tengu_sage_compass2", {}).enabled ?? !1
}
// @from(Ln 258939, Col 0)
function Nh6(q) {
    let K = q.toLowerCase();
    return K.includes("opus-4-7") || K.includes("opus-4-6") || K.includes("sonnet-4-6") || !1
}
// @from(Ln 258944, Col 0)
function b88(q) {
    let K = q.toLowerCase();
    return K.includes("opus-4-7") || K.includes("opus-4-6") || K.includes("sonnet-4-6") || !1
}
// @from(Ln 258949, Col 0)
function $S4(q, K) {
    if (!vx() || !q) return;
    let _ = Of(K5(q));
    if (!Nh6(K)) {
        E(`[AdvisorTool] Skipping advisor - base model ${K} does not support advisor`);
        return
    }
    if (!b88(_)) {
        E(`[AdvisorTool] Skipping advisor - ${_} is not a valid advisor model`);
        return
    }
    return E(`[AdvisorTool] Server-side tool enabled with ${_} as the advisor model`), _
}
// @from(Ln 258963, Col 0)
function jS4() {
    if (!vx()) return;
    return v7().advisorModel
}
// @from(Ln 258968, Col 0)
function HS4(q) {
    let K = q.iterations;
    if (!K) return [];
    return K.filter((_) => _.type === "advisor_message")
}
// @from(Ln 258973, Col 4)
Eh6
// @from(Ln 258973, Col 9)
JS4 = `# Advisor Tool

You have access to an \`advisor\` tool backed by a stronger reviewer model. It takes NO parameters -- when you call advisor(), your entire conversation history is automatically forwarded. They see the task, every tool call you've made, every result you've seen.

Call advisor BEFORE substantive work -- before writing, before committing to an interpretation, before building on an assumption. If the task requires orientation first (finding files, fetching a source, seeing what's there), do that, then call advisor. Orientation is not substantive work. Writing, editing, and declaring an answer are.

Also call advisor:
- When you believe the task is complete. BEFORE this call, make your deliverable durable: write the file, save the result, commit the change. The advisor call takes time; if the session ends during it, a durable result persists and an unwritten one doesn't.
- When stuck -- errors recurring, approach not converging, results that don't fit.
- When considering a change of approach.

On tasks longer than a few steps, call advisor at least once before committing to an approach and once before declaring done. On short reactive tasks where the next action is dictated by tool output you just read, you don't need to keep calling -- the advisor adds most of its value on the first call, before the approach crystallizes.

Give the advice serious weight. If you follow a step and it fails empirically, or you have primary-source evidence that contradicts a specific claim (the file says X, the paper states Y), adapt. A passing self-test is not evidence the advice is wrong -- it's evidence your test doesn't check what the advice is checking.

If you've already retrieved data pointing one way and the advisor points another: don't silently switch. Surface the conflict in one more advisor call -- "I found X, you suggest Y, which constraint breaks the tie?" The advisor saw your evidence but may have underweighted it; a reconcile call is cheaper than committing to the wrong branch.`
// @from(Ln 258989, Col 4)
is = L(() => {
    B1();
    pv();
    K8();
    Q8();
    Sq();
    x9();
    a1();
    Eh6 = ["opus", "sonnet"]
})
// @from(Ln 259003, Col 0)
function XS4(q) {
    return cXz("sha256").update(q).digest("hex").slice(0, 12)
}
// @from(Ln 259007, Col 0)
function lXz(q) {
    return q.slice(0, 500).replace(/https?:\/\/\S+/gi, "<url>").replace(/[A-Za-z]:\\[^\s"']*/g, "<path>").replace(/\\\\[^\s"']+/g, "<path>").replace(/(?:[^\s"'\\]+\\){2,}[^\s"']+/g, "<path>").replace(/(?:\/[^\s"':]+){2,}/g, "<path>").replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, "<id>").replace(/\b[0-9a-fA-F]{16,}\b/g, "<id>").replace(/\b\d{4,}\b/g, "<num>")
}
// @from(Ln 259011, Col 0)
function nXz(q, K = 5) {
    let _ = [];
    for (let z of q.slice(0, 4000).split(`
`)) {
        let Y = z.trim();
        if (!Y.startsWith("at ")) continue;
        let A = Y.slice(3),
            O = A.indexOf(" (");
        if (O !== -1) A = A.slice(0, O);
        if (A = A.replace(/^async\s+/, "").replace(/^new\s+/, ""), A.includes("/") || A.includes("\\") || /:\d/.test(A)) continue;
        if (A) _.push(A);
        if (_.length >= K) break
    }
    return _
}
// @from(Ln 259027, Col 0)
function iXz(q) {
    try {
        return String(q)
    } catch {
        return "[unstringifiable]"
    }
}
// @from(Ln 259035, Col 0)
function Ln1(q) {
    try {
        let K = iXz(q instanceof Error ? q.message : q),
            _ = {
                error_message_hash: XS4(lXz(K))
            },
            z = q?.code;
        if (typeof z === "string" && /^[A-Z][A-Z0-9_]*$/.test(z)) _.error_code = z;
        if (q instanceof Error) {
            let Y = q.constructor?.name;
            if (typeof Y === "string") _.error_constructor = Y;
            if (typeof q.stack === "string") {
                let A = nXz(q.stack);
                if (A.length > 0) _.error_stack_hash = XS4(A.join("|"))
            }
        }
        return _
    } catch {
        return {}
    }
}
// @from(Ln 259056, Col 4)
MS4 = () => {}
// @from(Ln 259058, Col 0)
function sO() {
    return I88
}
// @from(Ln 259062, Col 0)
function Rn1(q) {
    if (I88 = q, q && !q.enteredExisting) hn1 = q.worktreeName
}
// @from(Ln 259066, Col 0)
function PS4() {
    if (I88) return I88.enteredExisting ? null : I88.worktreeName;
    return hn1
}
// @from(Ln 259071, Col 0)
function WS4() {
    hn1 = null
}
// @from(Ln 259074, Col 4)
I88 = null
// @from(Ln 259075, Col 4)
hn1 = null
// @from(Ln 259080, Col 0)
function u88() {
    if (!process.stdout.isTTY) return;
    try {
        gR(1, da);
        let q = KO.get(process.stdout);
        if (q?.isAltScreenActive) try {
            q.unmount()
        } catch {
            gR(1, bN6)
        }
        if (q?.drainStdin(), q?.detachForShutdown(), gR(1, W$6), gR(1, ba), gR(1, R$6), gR(1, SN6), gR(1, RN6), gR(1, aB), gR(1, ON8), Ia()) gR(1, LP(wN6));
        if (!S6(process.env.CLAUDE_CODE_DISABLE_TERMINAL_TITLE))
            if (process.platform === "win32") process.title = "";
            else gR(1, KK4)
    } catch {}
}
// @from(Ln 259097, Col 0)
function Cn1() {
    if (Sn1) return;
    if (process.stdout.isTTY && wV() && !uN()) try {
        let q = I8();
        if (!m88(q)) return;
        let K = NH(q),
            _;
        if (K) _ = `"${K.replaceAll("\\","\\\\").replaceAll('"',"\\\"")}"`;
        else _ = q;
        let z = PS4(),
            Y = z ? `--worktree ${z} ` : "";
        gR(1, Y8.dim(`
Resume this session with:
claude ${Y}--resume ${_}
`)), Sn1 = !0
    } catch {}
}
// @from(Ln 259115, Col 0)
function bn1(q) {
    if (x88 !== void 0) clearTimeout(x88), x88 = void 0;
    try {
        KO.get(process.stdout)?.drainStdin()
    } catch {}
    try {
        process.exit(q)
    } catch (K) {
        process.kill(process.pid, "SIGKILL")
    }
    throw Error("unreachable")
}
// @from(Ln 259128, Col 0)
function j5(q = 0, K = "other", _) {
    process.exitCode = q, rXz = WK(q, K, _).catch((z) => {
        E(`Graceful shutdown failed: ${z}`, {
            level: "error"
        }), u88(), Cn1(), bn1(q)
    }).catch(() => {})
}
// @from(Ln 259136, Col 0)
function rs() {
    return sb8
}
// @from(Ln 259140, Col 0)
function oXz() {
    if (yh6 !== void 0) clearInterval(yh6), yh6 = void 0
}
// @from(Ln 259144, Col 0)
function ZS4() {
    sb8 = !0, oXz()
}
// @from(Ln 259147, Col 0)
async function WK(q = 0, K = "other", _) {
    if (sb8) return;
    if (sb8 = !0, _?.suppressResumeHint) Sn1 = !0;
    let {
        executeSessionEndHooks: z,
        getSessionEndHookTimeoutMs: Y
    } = await Promise.resolve().then(() => (K9(), tb8)), A = Y();
    x88 = setTimeout(($) => {
        u88(), Cn1(), bn1($)
    }, Math.max(5000, A + 3500), q), x88.unref(), process.exitCode = q, u88(), Cn1();
    let O;
    try {
        let $ = (async () => {
            try {
                await _w8()
            } catch {}
        })();
        await Promise.race([$, new Promise((j, H) => {
            O = setTimeout((J) => J(new fS4), 2000, H)
        })]), clearTimeout(O)
    } catch {
        clearTimeout(O)
    }
    try {
        await z(K, {
            ..._,
            signal: AbortSignal.timeout(A)
        })
    } catch {}
    try {
        jF6()
    } catch {}
    let w = UB6();
    if (w) d("tengu_cache_eviction_hint", {
        scope: "session_end",
        last_request_id: w
    });
    try {
        let [{
            shutdown1PEventLogging: $
        }, {
            shutdownDatadog: j
        }] = await Promise.all([Promise.resolve().then(() => (BB(), qb1)), Promise.resolve().then(() => (J$6(), xq4))]);
        await Promise.race([Promise.all([$(), j()]), l7(500)])
    } catch {}
    if (_?.finalMessage) try {
        gR(2, _.finalMessage + `
`)
    } catch {}
    bn1(q)
}
// @from(Ln 259198, Col 4)
Sn1 = !1
// @from(Ln 259199, Col 4)
DS4
// @from(Ln 259199, Col 9)
sb8 = !1
// @from(Ln 259200, Col 4)
x88
// @from(Ln 259200, Col 9)
yh6
// @from(Ln 259200, Col 14)
rXz
// @from(Ln 259200, Col 19)
fS4
// @from(Ln 259201, Col 4)
CY = L(() => {
    Y3();
    U4();
    jQ6();
    y8();
    Yk();
    GI();
    R46();
    HX();
    C8();
    R9();
    K8();
    VA();
    Q8();
    MS4();
    g4();
    ag();
    DS4 = P1(() => {
        if (b16(() => {}), process.on("SIGINT", () => {
                if (process.argv.includes("-p") || process.argv.includes("--print")) return;
                j1("info", "shutdown_signal", {
                    signal: "SIGINT"
                }), WK(0)
            }), process.on("SIGTERM", () => {
                j1("info", "shutdown_signal", {
                    signal: "SIGTERM"
                }), WK(143)
            }), process.platform !== "win32") {
            if (process.on("SIGHUP", () => {
                    j1("info", "shutdown_signal", {
                        signal: "SIGHUP"
                    }), WK(129)
                }), process.stdin.isTTY) yh6 = setInterval(() => {
                if (MY6()) return;
                if (!process.stdout.writable || !process.stdin.readable) clearInterval(yh6), j1("info", "shutdown_signal", {
                    signal: "orphan_detected"
                }), WK(129)
            }, 30000), yh6.unref()
        }
        process.on("uncaughtException", (q) => {
            j1("error", "uncaught_exception", {
                error_name: q.name,
                error_message: q.message.slice(0, 2000)
            }), d("tengu_uncaught_exception", {
                error_name: q.name,
                ...Ln1(q)
            })
        }), process.on("unhandledRejection", (q) => {
            let K = q instanceof Error ? q.name : typeof q === "string" ? "string" : "unknown",
                _ = q instanceof Error ? {
                    error_name: q.name,
                    error_message: q.message.slice(0, 2000),
                    error_stack: q.stack?.slice(0, 4000)
                } : {
                    error_message: String(q).slice(0, 2000)
                };
            j1("error", "unhandled_rejection", _), d("tengu_unhandled_rejection", {
                error_name: K,
                ...Ln1(q)
            })
        })
    });
    fS4 = class fS4 extends Error {
        constructor() {
            super("Cleanup timeout")
        }
    }
})
// @from(Ln 259270, Col 0)
function In1(q) {
    let K = Ew();
    if (K.lastSessionId !== q) return;
    let _;
    if (K.lastModelUsage) _ = c0(K.lastModelUsage, (z, Y) => ({
        ...z,
        contextWindow: ff(Y, eM()),
        maxOutputTokens: wa(Y).default
    }));
    return {
        totalCostUSD: K.lastCost ?? 0,
        totalAPIDuration: K.lastAPIDuration ?? 0,
        totalAPIDurationWithoutRetries: K.lastAPIDurationWithoutRetries ?? 0,
        totalToolDuration: K.lastToolDuration ?? 0,
        totalLinesAdded: K.lastLinesAdded ?? 0,
        totalLinesRemoved: K.lastLinesRemoved ?? 0,
        lastDuration: K.lastDuration,
        modelUsage: _
    }
}
// @from(Ln 259291, Col 0)
function eb8(q) {
    let K = In1(q);
    if (!K) return !1;
    return lB6(K), !0
}
// @from(Ln 259297, Col 0)
function B88(q) {
    u2((K) => ({
        ...K,
        lastCost: nX(),
        lastAPIDuration: VW(),
        lastAPIDurationWithoutRetries: R61(),
        lastToolDuration: S61(),
        lastDuration: fD6(),
        lastLinesAdded: HY6(),
        lastLinesRemoved: JY6(),
        lastTotalInputTokens: XY6(),
        lastTotalOutputTokens: eu(),
        lastTotalCacheCreationInputTokens: gB6(),
        lastTotalCacheReadInputTokens: FB6(),
        lastTotalWebSearchRequests: m61(),
        lastFpsAverage: q?.averageFps,
        lastFpsLow1Pct: q?.low1PctFps,
        lastGracefulShutdown: rs(),
        lastModelUsage: c0(OV(), (_) => ({
            inputTokens: _.inputTokens,
            outputTokens: _.outputTokens,
            cacheReadInputTokens: _.cacheReadInputTokens,
            cacheCreationInputTokens: _.cacheCreationInputTokens,
            webSearchRequests: _.webSearchRequests,
            costUSD: _.costUSD
        })),
        lastSessionId: I8()
    }))
}
// @from(Ln 259327, Col 0)
function p88(q, K = 4) {
    return `$${q>0.5?tXz(q,100).toFixed(2):q.toFixed(K)}`
}
// @from(Ln 259331, Col 0)
function aXz() {
    let q = OV();
    if (Object.keys(q).length === 0) return "Usage:                 0 input, 0 output, 0 cache read, 0 cache write";
    let K = {};
    for (let [z, Y] of Object.entries(q)) {
        let A = o5(z);
        if (!K[A]) K[A] = {
            inputTokens: 0,
            outputTokens: 0,
            cacheReadInputTokens: 0,
            cacheCreationInputTokens: 0,
            webSearchRequests: 0,
            costUSD: 0,
            contextWindow: 0,
            maxOutputTokens: 0
        };
        let O = K[A];
        O.inputTokens += Y.inputTokens, O.outputTokens += Y.outputTokens, O.cacheReadInputTokens += Y.cacheReadInputTokens, O.cacheCreationInputTokens += Y.cacheCreationInputTokens, O.webSearchRequests += Y.webSearchRequests, O.costUSD += Y.costUSD
    }
    let _ = "Usage by model:";
    for (let [z, Y] of Object.entries(K)) {
        let A = `  ${iK(Y.inputTokens)} input, ${iK(Y.outputTokens)} output, ${iK(Y.cacheReadInputTokens)} cache read, ${iK(Y.cacheCreationInputTokens)} cache write` + (Y.webSearchRequests > 0 ? `, ${iK(Y.webSearchRequests)} web search` : "") + ` (${p88(Y.costUSD)})`;
        _ += `
` + `${z}:`.padStart(21) + A
    }
    return _
}
// @from(Ln 259359, Col 0)
function sXz(q) {
    if (q.includes("opus")) return "opus";
    if (q.includes("sonnet")) return "sonnet";
    if (q.includes("haiku")) return "haiku";
    return q
}
// @from(Ln 259366, Col 0)
function GS4() {
    let q = OV(),
        K = Object.entries(q);
    if (K.length === 0) return null;
    let _ = {},
        z = 0,
        Y = 0,
        A = 0,
        O = 0;
    for (let [j, H] of K) {
        let J = sXz(o5(j));
        _[J] = (_[J] ?? 0) + H.costUSD, z += H.costUSD, Y += H.inputTokens, A += H.cacheReadInputTokens, O += H.cacheCreationInputTokens
    }
    let w = [];
    if (z > 0)
        for (let [j, H] of Object.entries(_).sort((J, X) => X[1] - J[1])) w.push(`${j}: ${Math.round(H/z*100)}%`);
    let $ = Y + A + O;
    if ($ > 0) w.push(`cache hit: ${Math.round(A/$*100)}%`);
    return w.length > 0 ? `breakdown · ${w.join(" · ")}` : null
}
// @from(Ln 259387, Col 0)
function qI8() {
    let q = p88(nX()) + (F61() ? " (costs may be inaccurate due to usage of unknown models)" : ""),
        K = aXz();
    return Y8.dim(`Total cost:            ${q}
Total duration (API):  ${C5(VW())}
Total duration (wall): ${C5(fD6())}
Total code changes:    ${HY6()} ${HY6()===1?"line":"lines"} added, ${JY6()} ${JY6()===1?"line":"lines"} removed
${K}`)
}
// @from(Ln 259397, Col 0)
function tXz(q, K) {
    return Math.round(q * K) / K
}
// @from(Ln 259401, Col 0)
function eXz(q, K, _) {
    let z = r61(_) ?? {
        inputTokens: 0,
        outputTokens: 0,
        cacheReadInputTokens: 0,
        cacheCreationInputTokens: 0,
        webSearchRequests: 0,
        costUSD: 0,
        contextWindow: 0,
        maxOutputTokens: 0
    };
    return z.inputTokens += K.input_tokens, z.outputTokens += K.output_tokens, z.cacheReadInputTokens += K.cache_read_input_tokens ?? 0, z.cacheCreationInputTokens += K.cache_creation_input_tokens ?? 0, z.webSearchRequests += K.server_tool_use?.web_search_requests ?? 0, z.costUSD += q, z.contextWindow = ff(_, eM()), z.maxOutputTokens = wa(_).default, z
}
// @from(Ln 259415, Col 0)
function Lh6(q, K, _) {
    let z = eXz(q, K, _);
    h61(q, z, _);
    let Y = q5() && K.speed === "fast" ? {
        model: _,
        speed: "fast"
    } : {
        model: _
    };
    K81()?.add(q, Y), ND6()?.add(K.input_tokens, {
        ...Y,
        type: "input"
    }), ND6()?.add(K.output_tokens, {
        ...Y,
        type: "output"
    }), ND6()?.add(K.cache_read_input_tokens ?? 0, {
        ...Y,
        type: "cacheRead"
    }), ND6()?.add(K.cache_creation_input_tokens ?? 0, {
        ...Y,
        type: "cacheCreation"
    });
    let A = q;
    for (let O of HS4(K)) {
        let w = qq6(O.model, O);
        d("tengu_advisor_tool_token_usage", {
            advisor_model: O.model,
            input_tokens: O.input_tokens,
            output_tokens: O.output_tokens,
            cache_read_input_tokens: O.cache_read_input_tokens ?? 0,
            cache_creation_input_tokens: O.cache_creation_input_tokens ?? 0,
            cost_usd_micros: Math.round(w * 1e6)
        }), A += Lh6(w, O, O.model)
    }
    return A
}
// @from(Ln 259451, Col 4)
Tx = L(() => {
    Y3();
    v16();
    y8();
    C8();
    is();
    h1();
    AJ();
    zf();
    c7();
    CY();
    Sq();
    fo()
})
// @from(Ln 259466, Col 0)
function _I8(q, K) {
    if (K === 0) return q;
    return q.map((_) => ({
        ..._,
        oldStart: _.oldStart + K,
        newStart: _.newStart + K
    }))
}
// @from(Ln 259475, Col 0)
function F88(q) {
    return q.replaceAll("&", vS4).replaceAll("$", TS4)
}
// @from(Ln 259479, Col 0)
function VS4(q) {
    return q.replaceAll(vS4, "&").replaceAll(TS4, "$")
}
// @from(Ln 259483, Col 0)
function g88(q, K) {
    let _ = 0,
        z = 0;
    if (q.length === 0 && K) _ = (K.match(/\n/g)?.length ?? 0) + 1;
    else _ = q.reduce((Y, A) => Y + w7(A.lines, (O) => O.startsWith("+")), 0), z = q.reduce((Y, A) => Y + w7(A.lines, (O) => O.startsWith("-")), 0);
    uO8(_, z), FO8()?.add(_, {
        type: "added"
    }), FO8()?.add(z, {
        type: "removed"
    }), d("tengu_file_changed", {
        lines_added: _,
        lines_removed: z
    })
}
// @from(Ln 259498, Col 0)
function U56({
    filePath: q,
    oldContent: K,
    newContent: _,
    ignoreWhitespace: z = !1,
    singleHunk: Y = !1,
    convertTabs: A = !1
}) {
    let O = A ? ($) => F88(PU($)) : F88,
        w = BK6(q, q, O(K), O(_), void 0, void 0, {
            ignoreWhitespace: z,
            context: Y ? 1e5 : hh6,
            timeout: KI8
        });
    if (!w) return [];
    return w.hunks.map(($) => ({
        ...$,
        lines: $.lines.map(VS4)
    }))
}
// @from(Ln 259519, Col 0)
function Vx({
    filePath: q,
    fileContents: K,
    edits: _,
    ignoreWhitespace: z = !1
}) {
    let Y = F88(PU(K)),
        A = BK6(q, q, Y, _.reduce((O, w) => {
            let {
                old_string: $,
                new_string: j
            } = w, H = "replace_all" in w ? w.replace_all : !1, J = F88(PU($)), X = F88(PU(j));
            if (H) return O.replaceAll(J, () => X);
            else return O.replace(J, () => X)
        }, Y), void 0, void 0, {
            context: hh6,
            ignoreWhitespace: z,
            timeout: KI8
        });
    if (!A) return [];
    return A.hunks.map((O) => ({
        ...O,
        lines: O.lines.map(VS4)
    }))
}
// @from(Ln 259544, Col 4)
hh6 = 3
// @from(Ln 259545, Col 4)
KI8 = 5000
// @from(Ln 259546, Col 4)
vS4 = "<<:AMPERSAND_TOKEN:>>"
// @from(Ln 259547, Col 4)
TS4 = "<<:DOLLAR_TOKEN:>>"
// @from(Ln 259548, Col 4)
Rc = L(() => {
    pK6();
    C8();
    y8();
    Tx();
    eK()
})
// @from(Ln 259555, Col 0)
class kS4 {
    cache = new Map;
    maxCacheSize = 1000;
    readFile(q) {
        let K = V8(),
            _;
        try {
            _ = K.statSync(q)
        } catch (w) {
            throw this.cache.delete(q), w
        }
        let z = q,
            Y = this.cache.get(z);
        if (Y && Y.mtime === _.mtimeMs) return {
            content: Y.content,
            encoding: Y.encoding
        };
        let A = fJ8(q),
            O = K.readFileSync(q, {
                encoding: A
            }).replaceAll(`\r
`, `
`);
        if (this.cache.set(z, {
                content: O,
                encoding: A,
                mtime: _.mtimeMs
            }), this.cache.size > this.maxCacheSize) {
            let w = this.cache.keys().next().value;
            if (w) this.cache.delete(w)
        }
        return {
            content: O,
            encoding: A
        }
    }
    clear() {
        this.cache.clear()
    }
    invalidate(q) {
        this.cache.delete(q)
    }
    getStats() {
        return {
            size: this.cache.size,
            entries: Array.from(this.cache.keys())
        }
    }
}
// @from(Ln 259605, Col 0)
function xn1(q) {
    let {
        content: K
    } = qMz.readFile(q);
    return K
}
// @from(Ln 259611, Col 4)
qMz
// @from(Ln 259612, Col 4)
NS4 = L(() => {
    eK();
    Yq();
    qMz = new kS4
})
// @from(Ln 259618, Col 0)
function ES4(q) {
    return q.replaceAll(mn1, "'").replaceAll(zI8, "'").replaceAll(Bn1, '"').replaceAll(pn1, '"')
}
// @from(Ln 259622, Col 0)
function Fn1(q) {
    let K = q.split(/(\r\n|\n|\r)/),
        _ = "";
    for (let z = 0; z < K.length; z++) {
        let Y = K[z];
        if (Y !== void 0)
            if (z % 2 === 0) _ += Y.replace(/\s+$/, "");
            else _ += Y
    }
    return _
}
// @from(Ln 259634, Col 0)
function lH6(q, K) {
    if (q.includes(K)) return K;
    let _ = ES4(K),
        Y = ES4(q).indexOf(_);
    if (Y !== -1) return q.substring(Y, Y + K.length);
    return null
}
// @from(Ln 259642, Col 0)
function Rh6(q, K, _) {
    if (q === K) return _;
    let z = K.includes(Bn1) || K.includes(pn1),
        Y = K.includes(mn1) || K.includes(zI8);
    if (!z && !Y) return _;
    let A = _;
    if (z) A = KMz(A);
    if (Y) A = _Mz(A);
    return A
}
// @from(Ln 259653, Col 0)
function yS4(q, K) {
    if (K === 0) return !0;
    let _ = q[K - 1];
    return _ === " " || _ === "\t" || _ === `
` || _ === "\r" || _ === "(" || _ === "[" || _ === "{" || _ === "—" || _ === "–"
}
// @from(Ln 259660, Col 0)
function KMz(q) {
    let K = [...q],
        _ = [];
    for (let z = 0; z < K.length; z++)
        if (K[z] === '"') _.push(yS4(K, z) ? Bn1 : pn1);
        else _.push(K[z]);
    return _.join("")
}
// @from(Ln 259669, Col 0)
function _Mz(q) {
    let K = [...q],
        _ = [];
    for (let z = 0; z < K.length; z++)
        if (K[z] === "'") {
            let Y = z > 0 ? K[z - 1] : void 0,
                A = z < K.length - 1 ? K[z + 1] : void 0,
                O = Y !== void 0 && /\p{L}/u.test(Y),
                w = A !== void 0 && /\p{L}/u.test(A);
            if (O && w) _.push(zI8);
            else _.push(yS4(K, z) ? mn1 : zI8)
        } else _.push(K[z]);
    return _.join("")
}
// @from(Ln 259684, Col 0)
function LS4(q, K, _, z = !1) {
    let Y = z ? (O, w, $) => O.replaceAll(w, () => $) : (O, w, $) => O.replace(w, () => $);
    if (_ !== "") return Y(q, K, _);
    return !K.endsWith(`
`) && q.includes(K + `
`) ? Y(q, K + `
`, _) : Y(q, K, _)
}
// @from(Ln 259693, Col 0)
function Q88({
    filePath: q,
    fileContents: K,
    oldString: _,
    newString: z,
    replaceAll: Y = !1
}) {
    return U88({
        filePath: q,
        fileContents: K,
        edits: [{
            old_string: _,
            new_string: z,
            replace_all: Y
        }]
    })
}
// @from(Ln 259711, Col 0)
function U88({
    filePath: q,
    fileContents: K,
    edits: _
}) {
    let z = K,
        Y = [];
    if (!K && _.length === 1 && _[0] && _[0].old_string === "" && _[0].new_string === "") return {
        patch: Vx({
            filePath: q,
            fileContents: K,
            edits: [{
                old_string: K,
                new_string: z,
                replace_all: !1
            }]
        }),
        updatedFile: ""
    };
    for (let O of _) {
        let w = O.old_string.replace(/\n+$/, "");
        for (let j of Y)
            if (w !== "" && j.includes(w)) throw Error("Cannot edit file: old_string is a substring of a new_string from a previous edit.");
        let $ = z;
        if (z = O.old_string === "" ? O.new_string : LS4(z, O.old_string, O.new_string, O.replace_all), z === $) throw Error("String not found in file. Failed to apply edit.");
        Y.push(O.new_string)
    }
    if (z === K) throw Error("Original and edited file match exactly. Failed to apply edit.");
    return {
        patch: U56({
            filePath: q,
            oldContent: PU(K),
            newContent: PU(z)
        }),
        updatedFile: z
    }
}
// @from(Ln 259749, Col 0)
function hS4(q, K) {
    let _ = BK6("file.txt", "file.txt", q, K, void 0, void 0, {
        context: 8,
        timeout: KI8
    });
    if (!_) return "";
    let z = _.hunks.map((w) => ({
        startLine: w.oldStart,
        content: w.lines.filter(($) => !$.startsWith("-") && !$.startsWith("\\")).map(($) => $.slice(1)).join(`
`)
    })).map(vJ8).join(`
...
`);
    if (z.length <= un1) return z;
    let Y = z.lastIndexOf(`
`, un1),
        A = Y > 0 ? z.slice(0, Y) : z.slice(0, un1),
        O = tz(z, `
`, A.length) + 1;
    return `${A}

... [${O} lines truncated] ...`
}
// @from(Ln 259773, Col 0)
function RS4(q) {
    return q.map((K) => {
        let _ = [],
            z = [],
            Y = [];
        for (let A of K.lines)
            if (A.startsWith(" ")) _.push(A.slice(1)), z.push(A.slice(1)), Y.push(A.slice(1));
            else if (A.startsWith("-")) z.push(A.slice(1));
        else if (A.startsWith("+")) Y.push(A.slice(1));
        return {
            old_string: z.join(`
`),
            new_string: Y.join(`
`),
            replace_all: !1
        }
    })
}
// @from(Ln 259792, Col 0)
function YMz(q) {
    let K = q,
        _ = [];
    for (let [z, Y] of Object.entries(zMz)) {
        let A = K;
        if (K = K.replaceAll(z, Y), A !== K) _.push({
            from: z,
            to: Y
        })
    }
    return {
        result: K,
        appliedReplacements: _
    }
}
// @from(Ln 259808, Col 0)
function SS4({
    file_path: q,
    edits: K
}) {
    if (K.length === 0) return {
        file_path: q,
        edits: K
    };
    let _ = /\.(md|mdx)$/i.test(q);
    try {
        let z = Wq(q),
            Y = xn1(z);
        return {
            file_path: q,
            edits: K.map(({
                old_string: A,
                new_string: O,
                replace_all: w
            }) => {
                let $ = _ ? O : Fn1(O);
                if (Y.includes(A)) return {
                    old_string: A,
                    new_string: $,
                    replace_all: w
                };
                let {
                    result: j,
                    appliedReplacements: H
                } = YMz(A);
                if (Y.includes(j)) {
                    let J = $;
                    for (let {
                            from: X,
                            to: M
                        }
                        of H) J = J.replaceAll(X, M);
                    return {
                        old_string: j,
                        new_string: J,
                        replace_all: w
                    }
                }
                return {
                    old_string: A,
                    new_string: $,
                    replace_all: w
                }
            })
        }
    } catch (z) {
        if (!t1(z)) j6(z)
    }
    return {
        file_path: q,
        edits: K
    }
}
// @from(Ln 259866, Col 0)
function AMz(q, K, _) {
    if (q.length === K.length && q.every((w, $) => {
            let j = K[$];
            return j !== void 0 && w.old_string === j.old_string && w.new_string === j.new_string && w.replace_all === j.replace_all
        })) return !0;
    let z = null,
        Y = null,
        A = null,
        O = null;
    try {
        z = U88({
            filePath: "temp",
            fileContents: _,
            edits: q
        })
    } catch (w) {
        Y = b6(w)
    }
    try {
        A = U88({
            filePath: "temp",
            fileContents: _,
            edits: K
        })
    } catch (w) {
        O = b6(w)
    }
    if (Y !== null && O !== null) return Y === O;
    if (Y !== null || O !== null) return !1;
    return z.updatedFile === A.updatedFile
}
// @from(Ln 259898, Col 0)
function CS4(q, K) {
    if (q.file_path !== K.file_path) return !1;
    if (q.edits.length === K.edits.length && q.edits.every((z, Y) => {
            let A = K.edits[Y];
            return A !== void 0 && z.old_string === A.old_string && z.new_string === A.new_string && z.replace_all === A.replace_all
        })) return !0;
    let _ = "";
    try {
        _ = xn1(q.file_path)
    } catch (z) {
        if (!t1(z)) throw z
    }
    return AMz(q.edits, K.edits, _)
}
// @from(Ln 259912, Col 4)
mn1 = "‘"
// @from(Ln 259913, Col 4)
zI8 = "’"
// @from(Ln 259914, Col 4)
Bn1 = "“"
// @from(Ln 259915, Col 4)
pn1 = "”"
// @from(Ln 259916, Col 4)
un1 = 8192
// @from(Ln 259917, Col 4)
zMz
// @from(Ln 259918, Col 4)
Q56 = L(() => {
    pK6();
    U8();
    b9();
    Rc();
    m8();
    eK();
    NS4();
    zMz = {
        "<fnr>": "<function_results>",
        "<n>": "<name>",
        "</n>": "</name>",
        "<o>": "<output>",
        "</o>": "</output>",
        "<e>": "<error>",
        "</e>": "</error>",
        "<s>": "<system>",
        "</s>": "</system>",
        "<r>": "<result>",
        "</r>": "</result>",
        "< META_START >": "<META_START>",
        "< META_END >": "<META_END>",
        "< EOT >": "<EOT>",
        "< META >": "<META>",
        "< SOS >": "<SOS>",
        "\n\nH:": `

Human:`,
        "\n\nA:": `

Assistant:`
    }
})
// @from(Ln 259951, Col 4)
d56 = "EnterPlanMode"
// @from(Ln 259952, Col 4)
AO = "AskUserQuestion"
// @from(Ln 259953, Col 4)
bS4 = 12
// @from(Ln 259954, Col 4)
IS4 = "Asks the user multiple choice questions to gather information, clarify ambiguity, understand preferences, make decisions or offer them choices."
// @from(Ln 259955, Col 4)
xS4
// @from(Ln 259955, Col 9)
gn1
// @from(Ln 259956, Col 4)
cp = L(() => {
    xS4 = {
        markdown: `
Preview feature:
Use the optional \`preview\` field on options when presenting concrete artifacts that users need to visually compare:
- ASCII mockups of UI layouts or components
- Code snippets showing different implementations
- Diagram variations
- Configuration examples

Preview content is rendered as markdown in a monospace box. Multi-line text with newlines is supported. When any option has a preview, the UI switches to a side-by-side layout with a vertical option list on the left and preview on the right. Do not use previews for simple preference questions where labels and descriptions suffice. Note: previews are only supported for single-select questions (not multiSelect).
`,
        html: `
Preview feature:
Use the optional \`preview\` field on options when presenting concrete artifacts that users need to visually compare:
- HTML mockups of UI layouts or components
- Formatted code snippets showing different implementations
- Visual comparisons or diagrams

Preview content must be a self-contained HTML fragment (no <html>/<body> wrapper, no <script> or <style> tags — use inline style attributes instead). Do not use previews for simple preference questions where labels and descriptions suffice. Note: previews are only supported for single-select questions (not multiSelect).
`
    }, gn1 = `Use this tool when you need to ask the user questions during execution. This allows you to:
1. Gather user preferences or requirements
2. Clarify ambiguous instructions
3. Get decisions on implementation choices as you work
4. Offer choices to the user about what direction to take.

Usage notes:
- Users will always be able to select "Other" to provide custom text input
- Use multiSelect: true to allow multiple answers to be selected for a question
- If you recommend a specific option, make that the first option in the list and add "(Recommended)" at the end of the label

Plan mode note: In plan mode, use this tool to clarify requirements or choose between approaches BEFORE finalizing your plan. Do NOT use this tool to ask "Is my plan ready?" or "Should I proceed?" - use ${Fk} for plan approval. IMPORTANT: Do not reference "the plan" in your questions (e.g., "Do you have feedback about the plan?", "Does the plan look good?") because the user cannot see the plan in the UI until you call ${Fk}. If you need plan approval, use ${Fk} instead.
`
})
// @from(Ln 259991, Col 4)
Sc = "TaskGet"
// @from(Ln 259992, Col 4)
xD = "TaskList"
// @from(Ln 259993, Col 4)
YI8 = "EnterWorktree"
// @from(Ln 259994, Col 4)
AI8 = "ExitWorktree"
// @from(Ln 259995, Col 4)
mS4 = {}
// @from(Ln 260011, Col 0)
function uD() {
    return !S6(process.env.CLAUDE_CODE_DISABLE_CRON) && XD("tengu_kairos_cron", !0, uS4)
}
// @from(Ln 260015, Col 0)
function os() {
    return XD("tengu_kairos_cron_durable", !0, uS4)
}
// @from(Ln 260019, Col 0)
function Un1(q) {
    return q ? "Schedule a prompt to run at a future time — either recurring on a cron schedule, or once at a specific time. Pass durable: true to persist to .claude/scheduled_tasks.json; otherwise session-only." : "Schedule a prompt to run at a future time within this Claude session — either recurring on a cron schedule, or once at a specific time."
}
// @from(Ln 260023, Col 0)
function Qn1(q) {
    return `Schedule a prompt to be enqueued at a future time. Use for both recurring schedules and one-shot reminders.

Uses standard 5-field cron in the user's local timezone: minute hour day-of-month month day-of-week. "0 9 * * *" means 9am local — no timezone conversion needed.

## One-shot tasks (recurring: false)

For "remind me at X" or "at <time>, do Y" requests — fire once then auto-delete.
Pin minute/hour/day-of-month/month to specific values:
  "remind me at 2:30pm today to check the deploy" → cron: "30 14 <today_dom> <today_month> *", recurring: false
  "tomorrow morning, run the smoke test" → cron: "57 8 <tomorrow_dom> <tomorrow_month> *", recurring: false

## Recurring jobs (recurring: true, the default)

For "every N minutes" / "every hour" / "weekdays at 9am" requests:
  "*/5 * * * *" (every 5 min), "0 * * * *" (hourly), "0 9 * * 1-5" (weekdays at 9am local)

## Avoid the :00 and :30 minute marks when the task allows it

Every user who asks for "9am" gets \`0 9\`, and every user who asks for "hourly" gets \`0 *\` — which means requests from across the planet land on the API at the same instant. When the user's request is approximate, pick a minute that is NOT 0 or 30:
  "every morning around 9" → "57 8 * * *" or "3 9 * * *" (not "0 9 * * *")
  "hourly" → "7 * * * *" (not "0 * * * *")
  "in an hour or so, remind me to..." → pick whatever minute you land on, don't round

Only use minute 0 or 30 when the user names that exact time and clearly means it ("at 9:00 sharp", "at half past", coordinating with a meeting). When in doubt, nudge a few minutes early or late — the user will not notice, and the fleet will.

${q?`## Durability

By default (durable: false) the job lives only in this Claude session — nothing is written to disk, and the job is gone when Claude exits. Pass durable: true to write to .claude/scheduled_tasks.json so the job survives restarts. Only use durable: true when the user explicitly asks for the task to persist ("keep doing this every day", "set this up permanently"). Most "remind me in 5 minutes" / "check back in an hour" requests should stay session-only.`:`## Session-only

Jobs live only in this Claude session — nothing is written to disk, and the job is gone when Claude exits.`}

## Runtime behavior

Jobs only fire while the REPL is idle (not mid-query). ${q?"Durable jobs persist to .claude/scheduled_tasks.json and survive session restarts — on next launch they resume automatically. One-shot durable tasks that were missed while the REPL was closed are surfaced for catch-up. Session-only jobs die with the process. ":""}The scheduler adds a small deterministic jitter on top of whatever you pick: recurring tasks fire up to 10% of their period late (max 15 min); one-shot tasks landing on :00 or :30 fire up to 90 s early. Picking an off-minute is still the bigger lever.

Recurring tasks auto-expire after ${UR} days — they fire one final time, then are deleted. This bounds session lifetime. Tell the user about the ${UR}-day limit when scheduling recurring jobs.

Returns a job ID you can pass to ${wT}.`
}
// @from(Ln 260064, Col 0)
function cn1(q) {
    return q ? `Cancel a cron job previously scheduled with ${DX}. Removes it from .claude/scheduled_tasks.json (durable jobs) or the in-memory session store (session-only jobs).` : `Cancel a cron job previously scheduled with ${DX}. Removes it from the in-memory session store.`
}
// @from(Ln 260068, Col 0)
function nn1(q) {
    return q ? `List all cron jobs scheduled via ${DX}, both durable (.claude/scheduled_tasks.json) and session-only.` : `List all cron jobs scheduled via ${DX} in this session.`
}
// @from(Ln 260071, Col 4)
uS4 = 300000
// @from(Ln 260072, Col 4)
UR
// @from(Ln 260072, Col 8)
DX = "CronCreate"
// @from(Ln 260073, Col 4)
wT = "CronDelete"
// @from(Ln 260074, Col 4)
nH6 = "CronList"
// @from(Ln 260075, Col 4)
dn1 = "Cancel a scheduled cron job by ID"
// @from(Ln 260076, Col 4)
ln1 = "List scheduled cron jobs"
// @from(Ln 260077, Col 4)
QR = L(() => {
    B1();
    yp();
    Q8();
    UR = Ep.recurringMaxAgeMs / 86400000
})
// @from(Ln 260083, Col 4)
c56
// @from(Ln 260083, Col 9)
in1
// @from(Ln 260083, Col 14)
wI8
// @from(Ln 260083, Col 19)
BS4
// @from(Ln 260083, Col 24)
pS4
// @from(Ln 260084, Col 4)
Sh6 = L(() => {
    sY();
    cp();
    Rz();
    cy6();
    jJ();
    uK6();
    u$();
    Kc();
    td();
    EP();
    QR();
    c56 = new Set([tN, dP, d56, T4, AO, RV]), in1 = new Set([...c56]), wI8 = new Set([xq, hR, Vy, a5, PH, T9, ...dj6, J4, IK, HJ, VH, iW, Zj, YI8, AI8, GO, ...[]]), BS4 = new Set([YT, Sc, xD, gk, tW, DX, wT, nH6]), pS4 = new Set([T4, RV, tW, iW, ...[], ...[]])
})
// @from(Ln 260098, Col 4)
FS4 = L(() => {
    B1();
    Q8()
})
// @from(Ln 260102, Col 4)
lp = "TeamCreate"
// @from(Ln 260103, Col 4)
Cc = "TeamDelete"
// @from(Ln 260105, Col 0)
function Ch6() {
    return !1
}
// @from(Ln 260108, Col 4)
d88 = L(() => {
    Sh6();
    B1();
    C8();
    sY();
    Rz();
    FS4();
    td();
    Q8()
})
// @from(Ln 260122, Col 0)
function kx() {
    return !1
}
// @from(Ln 260126, Col 0)
function US4(q) {
    return q.some((K) => {
        if (K.type !== "user") return !1;
        let _ = K.message.content;
        if (!Array.isArray(_)) return !1;
        return _.some((z) => z.type === "text" && z.text.includes(`<${iH8}>`))
    })
}
// @from(Ln 260135, Col 0)
function QS4(q, K) {
    let _ = {
            ...K,
            uuid: OMz(),
            message: {
                ...K.message,
                content: [...K.message.content]
            }
        },
        z = K.message.content.filter((O) => O.type === "tool_use");
    if (z.length === 0) return E(`No tool_use blocks found in assistant message for fork directive: ${q.slice(0,50)}...`, {
        level: "error"
    }), [t8({
        content: [{
            type: "text",
            text: gS4(q)
        }]
    })];
    let Y = z.map((O) => ({
            type: "tool_result",
            tool_use_id: O.id,
            content: [{
                type: "text",
                text: $Mz
            }]
        })),
        A = t8({
            content: [...Y, {
                type: "text",
                text: gS4(q)
            }]
        });
    return [_, A]
}
// @from(Ln 260170, Col 0)
function gS4(q) {
    return `<${iH8}>
You are a worker fork. The transcript above is the parent's history — inherited reference, not your situation. You are NOT a continuation of that agent. Execute ONE directive, then stop.

Hard rules:
- Do NOT spawn sub-agents. The "default to forking" guidance in your system prompt is for the parent; you ARE the fork, execute directly.
- One shot: report once and stop. No follow-up questions, no proposed next steps, no waiting for the user.

Guidelines (your directive may override any of these):
- Stay in scope. Other forks may be handling adjacent work; if you spot something outside your directive, note it in a sentence and move on.
- Open with one line restating your task, so the parent can spot scope drift at a glance.
- Be concise — as short as the answer allows, no shorter. Plain text, no preamble, no meta-commentary.
- If you committed changes, list the paths and commit hashes in your report.
</${iH8}>

${bu7}${q}`
}
// @from(Ln 260188, Col 0)
function dS4(q, K) {
    return `You've inherited the conversation context above from a parent agent working in ${q}. You are operating in an isolated git worktree at ${K} — same repository, same relative file structure, separate working copy. Paths in the inherited context refer to the parent's working directory; translate them to your worktree root. Re-read files before editing if the parent may have modified them since they appear in the context. Your changes stay in this worktree and will not affect the parent's files.`
}
// @from(Ln 260191, Col 4)
wMz = "fork"
// @from(Ln 260192, Col 4)
bh6
// @from(Ln 260192, Col 9)
$Mz = "Fork started — processing in background"
// @from(Ln 260193, Col 4)
c88 = L(() => {
    y8();
    rA();
    d88();
    K8();
    _7();
    bh6 = {
        agentType: wMz,
        whenToUse: "Implicit fork — inherits full conversation context. Not selectable via subagent_type; triggered by omitting subagent_type when the fork experiment is active.",
        tools: ["*"],
        maxTurns: 200,
        model: "inherit",
        permissionMode: "bubble",
        source: "built-in",
        baseDir: "built-in",
        getSystemPrompt: () => ""
    }
})
// @from(Ln 260212, Col 0)
function jMz(q) {
    let {
        tools: K,
        disallowedTools: _
    } = q, z = K && K.length > 0, Y = _ && _.length > 0;
    if (z && Y) {
        let A = new Set(_),
            O = K.filter((w) => !A.has(w));
        if (O.length === 0) return "None";
        return O.join(", ")
    } else if (z) return K.join(", ");
    else if (Y) return `All tools except ${_.join(", ")}`;
    return "All tools"
}
// @from(Ln 260227, Col 0)
function rn1(q) {
    let K = jMz(q);
    return `- ${q.agentType}: ${q.whenToUse} (Tools: ${K})`
}
// @from(Ln 260232, Col 0)
function on1() {
    if (S6(process.env.CLAUDE_CODE_AGENT_LIST_IN_MESSAGES)) return !0;
    if (c5(process.env.CLAUDE_CODE_AGENT_LIST_IN_MESSAGES)) return !1;
    return u8("tengu_agent_list_attach", !1)
}
// @from(Ln 260238, Col 0)
function an1() {
    if (S6(process.env.CLAUDE_CODE_AGENT_COST_STEER)) return !0;
    if (c5(process.env.CLAUDE_CODE_AGENT_COST_STEER)) return !1;
    if (MK() !== "pro") return !1;
    return u8("tengu_willow_prism", !1)
}
// @from(Ln 260244, Col 0)
async function cS4(q, K, _) {
    let z = _ ? q.filter((D) => _.includes(D.agentType)) : q,
        Y = kx(),
        A = Y ? `

## When to fork

Fork yourself (omit \`subagent_type\`) when the intermediate tool output isn't worth keeping in your context. The criterion is qualitative — "will I need this output again" — not task size. Fork open-ended questions. If research can be broken into independent questions, launch parallel forks in one message. A fork beats a fresh subagent for this — it inherits context and shares your cache.

Forks are cheap because they share your prompt cache.

**Don't peek.** The tool result includes an \`output_file\` path — do not Read or tail it. You get a completion notification; trust it. Reading the transcript mid-flight pulls the fork's tool noise into your context, which defeats the point of forking.

**Don't race.** After launching, you know nothing about what the fork found. Never fabricate or predict fork results in any format — not as prose, summary, or structured output. The notification arrives as a user-role message in a later turn; it is never something you write yourself. If the user asks a follow-up before the notification lands, tell them the fork is still running — give status, not a guess.

**Writing a fork prompt.** Since the fork inherits your context, the prompt is a *directive* — what to do, not what the situation is. Be specific about scope: what's in, what's out, what another agent is handling. Don't re-explain background.
` : "",
        O = `

## Writing the prompt

${Y?"When spawning a fresh agent (with a `subagent_type`), it starts with zero context. ":""}Brief the agent like a smart colleague who just walked into the room — it hasn't seen this conversation, doesn't know what you've tried, doesn't understand why this task matters.
- Explain what you're trying to accomplish and why.
- Describe what you've already learned or ruled out.
- Give enough context about the surrounding problem that the agent can make judgment calls rather than just following a narrow instruction.
- If you need a short response, say so ("report in under 200 words").
- Lookups: hand over the exact command. Investigations: hand over the question — prescribed steps become dead weight when the premise is wrong.

${Y?"For fresh agents, terse":"Terse"} command-style prompts produce shallow, generic work.

**Never delegate understanding.** Don't write "based on your findings, fix the bug" or "based on the research, implement it." Those phrases push synthesis onto the agent instead of doing it yourself. Write prompts that prove you understood: include file paths, line numbers, what specifically to change.`,
        w = `Example usage:

<example>
user: "What's left on this branch before we can ship?"
assistant: <thinking>Forking this — it's a survey question. I want the punch list, not the git output in my context.</thinking>
${T4}({
  name: "ship-audit",
  description: "Branch ship-readiness audit",
  prompt: "Audit what's left before this branch can ship. Check: uncommitted changes, commits ahead of main, whether tests exist, whether the GrowthBook gate is wired up, whether CI-relevant files changed. Report a punch list — done vs. missing. Under 200 words."
})
assistant: Ship-readiness audit running.
<commentary>
Turn ends here. The coordinator knows nothing about the findings yet. What follows is a SEPARATE turn — the notification arrives from outside, as a user-role message. It is not something the coordinator writes.
</commentary>
[later turn — notification arrives as user message]
assistant: Audit's back. Three blockers: no tests for the new prompt path, GrowthBook gate wired but not in build_flags.yaml, and one uncommitted file.
</example>

<example>
user: "so is the gate wired up or not"
<commentary>
User asks mid-wait. The audit fork was launched to answer exactly this, and it hasn't returned. The coordinator does not have this answer. Give status, not a fabricated result.
</commentary>
assistant: Still waiting on the audit — that's one of the things it's checking. Should land shortly.
</example>

<example>
user: "Can you get a second opinion on whether this migration is safe?"
assistant: <thinking>I'll ask the code-reviewer agent — it won't see my analysis, so it can give an independent read.</thinking>
<commentary>
A subagent_type is specified, so the agent starts fresh. It needs full context in the prompt. The briefing explains what to assess and why.
</commentary>
${T4}({
  name: "migration-review",
  description: "Independent migration review",
  subagent_type: "code-reviewer",
  prompt: "Review migration 0042_user_schema.sql for safety. Context: we're adding a NOT NULL column to a 50M-row table. Existing rows get a backfill default. I want a second opinion on whether the backfill approach is safe under concurrent writes — I've checked locking behavior but want independent verification. Report: is this safe, and if not, what specifically breaks?"
})
</example>
`,
        $ = `Example usage:

<example>
user: "What's left on this branch before we can ship?"
assistant: <thinking>A survey question across git state, tests, and config. I'll delegate it and ask for a short report so the raw command output stays out of my context.</thinking>
${T4}({
  description: "Branch ship-readiness audit",
  prompt: "Audit what's left before this branch can ship. Check: uncommitted changes, commits ahead of main, whether tests exist, whether the GrowthBook gate is wired up, whether CI-relevant files changed. Report a punch list — done vs. missing. Under 200 words."
})
<commentary>
The prompt is self-contained: it states the goal, lists what to check, and caps the response length. The agent's report comes back as the tool result; relay the findings to the user.
</commentary>
</example>

<example>
user: "Can you get a second opinion on whether this migration is safe?"
assistant: <thinking>I'll ask the code-reviewer agent — it won't see my analysis, so it can give an independent read.</thinking>
${T4}({
  description: "Independent migration review",
  subagent_type: "code-reviewer",
  prompt: "Review migration 0042_user_schema.sql for safety. Context: we're adding a NOT NULL column to a 50M-row table. Existing rows get a backfill default. I want a second opinion on whether the backfill approach is safe under concurrent writes — I've checked locking behavior but want independent verification. Report: is this safe, and if not, what specifically breaks?"
})
<commentary>
The agent starts with no context from this conversation, so the prompt briefs it: what to assess, the relevant background, and what form the answer should take.
</commentary>
</example>
`,
        j = on1(),
        H = j ? "Available agent types are listed in <system-reminder> messages in the conversation." : `Available agent types and the tools they have access to:
${z.map((D)=>rn1(D)).join(`
`)}`,
        J = an1() ? `

**Do not spawn agents unless the user asks.** Each spawn starts cold and re-derives context you already have — it's the expensive path on this plan. A task with "multiple angles," "thorough," or several parts is not a request to spawn; handle it inline with your own tools. Only use this tool when the user explicitly says to use a subagent, or names one of the agent types above.` : "",
        X = `Launch a new agent to handle complex, multi-step tasks. Each agent type has specific capabilities and tools available to it.

${H}${J}

${Y?`When using the ${T4} tool, specify a subagent_type to use a specialized agent, or omit it to fork yourself — a fork inherits your full conversation context.`:`When using the ${T4} tool, specify a subagent_type parameter to select which agent type to use. If omitted, the general-purpose agent is used.`}`;
    if (K) return X;
    let M = $H() ? "`grep` via the Bash tool" : `the ${a5} tool`,
        P = Y ? "" : `
## When not to use

If the target is already known, use the direct tool: ${xq} for a known path, ${M} for a specific symbol or string. Reserve this tool for open-ended questions that span the codebase, or tasks that match an available agent type.
`,
        W = !j && MK() !== "pro" && !J ? `
- When you launch multiple agents for independent work, send them in a single message with multiple tool uses so they run concurrently` : "";
    return `${X}
${P}
## Usage notes

- Always include a short description summarizing what the agent will do${W}
- When the agent is done, it will return a single message back to you. The result returned by the agent is not visible to the user. To show the user the result, you should send a text message back to the user with a concise summary of the result.
- Trust but verify: an agent's summary describes what it intended to do, not necessarily what it did. When an agent writes or edits code, check the actual changes before reporting the work as done.${!S6(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS)&&!$D()&&!Y?`
- You can optionally run agents in the background using the run_in_background parameter. When an agent runs in the background, you will be automatically notified when it completes — do NOT sleep, poll, or proactively check on its progress. Continue with other work or respond to the user instead.
- **Foreground vs background**: Use foreground (default) when you need the agent's results before you can proceed — e.g., research agents whose findings inform your next steps. Use background when you have genuinely independent work to do in parallel.`:""}
- To continue a previously spawned agent, use ${tW} with the agent's ID or name as the \`to\` field — that resumes it with full context. A new ${T4} call${Y?" with a subagent_type":""} starts a fresh agent with no memory of prior runs, so the prompt must be self-contained.
- Clearly tell the agent whether you expect it to write code or just to do research (search, file reads, web fetches, etc.)${Y?"":", since it is not aware of the user's intent"}
- If the agent description mentions that it should be used proactively, then you should try your best to use it without the user having to ask for it first.
- If the user specifies that they want you to run agents "in parallel", you MUST send a single message with multiple ${T4} tool use content blocks. For example, if you need to launch both a build-validator agent and a test-runner agent in parallel, send a single message with both tool calls.
- With \`isolation: "worktree"\`, the worktree is automatically cleaned up if the agent makes no changes; otherwise the path and branch are returned in the result.${$D()?`
- The run_in_background, name, team_name, and mode parameters are not available in this context. Only synchronous subagents are supported.`:Lz()?`
- The name, team_name, and mode parameters are not available in this context — teammates cannot spawn other teammates. Omit them to spawn a subagent.`:""}${A}${O}

${Y?w:$}`
}
// @from(Ln 260382, Col 4)
$I8 = L(() => {
    B1();
    T7();
    pB();
    Q8();
    zY();
    Rv();
    Rz();
    jJ();
    sY();
    c88()
})
// @from(Ln 260395, Col 0)
function jI8(q) {
    sn1.emit(q);
    let K = Date.now(),
        _ = lS4.get(q);
    if (_ !== void 0 && K - _ < HMz) return;
    lS4.set(q, K), d8((z) => {
        let Y = z.skillUsage?.[q];
        return {
            ...z,
            skillUsage: {
                ...z.skillUsage,
                [q]: {
                    usageCount: (Y?.usageCount ?? 0) + 1,
                    lastUsedAt: K
                }
            }
        }
    })
}
// @from(Ln 260415, Col 0)
function l88(q) {
    let _ = H8().skillUsage?.[q];
    if (!_) return 0;
    let z = (Date.now() - _.lastUsedAt) / 86400000,
        Y = Math.pow(0.5, z / 7);
    return _.usageCount * Math.max(Y, 0.1)
}
// @from(Ln 260422, Col 4)
HMz = 60000
// @from(Ln 260423, Col 4)
sn1
// @from(Ln 260423, Col 9)
lS4
// @from(Ln 260424, Col 4)
Ih6 = L(() => {
    h1();
    nH();
    sn1 = l5(), lS4 = new Map
})
// @from(Ln 260430, Col 0)
function XMz() {
    let q = process.env.CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS;
    if (q) {
        let K = parseInt(q, 10);
        if (!isNaN(K) && K > 0) return K
    }
    return
}
// @from(Ln 260438, Col 4)
JMz = 25000
// @from(Ln 260439, Col 4)
as
// @from(Ln 260440, Col 4)
HI8 = L(() => {
    U4();
    B1();
    eK();
    as = P1(() => {
        let q = u8("tengu_amber_wren", {}),
            K = typeof q?.maxSizeBytes === "number" && Number.isFinite(q.maxSizeBytes) && q.maxSizeBytes > 0 ? q.maxSizeBytes : uY1,
            z = XMz() ?? (typeof q?.maxTokens === "number" && Number.isFinite(q.maxTokens) && q.maxTokens > 0 ? q.maxTokens : JMz),
            Y = typeof q?.includeMaxSizeInPrompt === "boolean" ? q.includeMaxSizeInPrompt : void 0,
            A = typeof q?.targetedRangeNudge === "boolean" ? q.targetedRangeNudge : void 0;
        return {
            maxSizeBytes: K,
            maxTokens: z,
            includeMaxSizeInPrompt: Y,
            targetedRangeNudge: A
        }
    })
})
// @from(Ln 260459, Col 0)
function yJ(q) {
    return q.name?.startsWith("mcp__") || q.isMcp === !0
}
// @from(Ln 260463, Col 0)
function iH6(q) {
    return q.mcpInfo?.serverName ?? (q.name?.startsWith("mcp__") ? q.name.split("__")[1] : void 0)
}
// @from(Ln 260467, Col 0)
function Uk(q, K) {
    return {
        register(_) {
            WMz(_, K)
        },
        update(_, z) {
            MMz(_, K, z)
        },
        remove(_) {
            K((z) => {
                if (!(_ in z.tasks)) return z;
                let {
                    [_]: Y, ...A
                } = z.tasks;
                return {
                    ...z,
                    tasks: A
                }
            })
        },
        evictTerminal(_) {
            DMz(_, K)
        },
        applyOffsetsAndEvict(_, z) {
            ZMz(K, _, z)
        },
        get(_) {
            return q().tasks[_]
        },
        all() {
            return q().tasks
        }
    }
}
// @from(Ln 260502, Col 0)
function MMz(q, K, _) {
    let z = null;
    if (K((Y) => {
            let A = Y.tasks?.[q];
            if (!A) return Y;
            let O = _(A);
            if (O === A) return Y;
            return z = PMz(A, O), {
                ...Y,
                tasks: {
                    ...Y.tasks,
                    [q]: O
                }
            }
        }), z !== null) sv({
        type: "system",
        subtype: "task_updated",
        task_id: q,
        patch: z
    })
}
// @from(Ln 260524, Col 0)
function PMz(q, K) {
    let _ = {};
    if (K.status !== q.status) _.status = K.status;
    if (K.description !== q.description) _.description = K.description;
    if (K.endTime !== q.endTime) _.end_time = K.endTime;
    if (K.totalPausedMs !== q.totalPausedMs) _.total_paused_ms = K.totalPausedMs;
    let z = "error" in q ? q.error : void 0,
        Y = "error" in K ? K.error : void 0;
    if (Y !== z && Y !== void 0) _.error = Y;
    let A = "isBackgrounded" in q ? q.isBackgrounded : void 0,
        O = "isBackgrounded" in K ? K.isBackgrounded : void 0;
    if (O !== A && O !== void 0) _.is_backgrounded = O;
    return Object.keys(_).length > 0 ? _ : null
}
// @from(Ln 260539, Col 0)
function WMz(q, K) {
    let _ = !1;
    if (K((z) => {
            let Y = z.tasks[q.id];
            _ = Y !== void 0;
            let A = Y && "retain" in Y ? {
                ...q,
                retain: Y.retain,
                startTime: Y.startTime,
                messages: Y.messages,
                diskLoaded: Y.diskLoaded,
                pendingMessages: Y.pendingMessages
            } : q;
            return {
                ...z,
                tasks: {
                    ...z.tasks,
                    [q.id]: A
                }
            }
        }), _) return;
    sv({
        type: "system",
        subtype: "task_started",
        task_id: q.id,
        tool_use_id: q.toolUseId,
        description: q.description,
        task_type: q.type,
        workflow_name: "workflowName" in q ? q.workflowName : void 0,
        prompt: "prompt" in q ? q.prompt : void 0,
        skip_transcript: q.skipTranscript
    })
}
// @from(Ln 260573, Col 0)
function DMz(q, K) {
    K((_) => {
        let z = _.tasks?.[q];
        if (!z) return _;
        if (!np(z.status)) return _;
        if (!z.notified) return _;
        if ("retain" in z && (z.evictAfter ?? 1 / 0) > Date.now()) return _;
        let {
            [q]: Y, ...A
        } = _.tasks;
        return {
            ..._,
            tasks: A
        }
    })
}
// @from(Ln 260590, Col 0)
function XI8(q) {
    let K = q.tasks ?? {};
    return Object.values(K).filter((_) => _.status === "running")
}
// @from(Ln 260594, Col 0)
async function iS4(q) {
    let K = [],
        _ = {},
        z = [];
    for (let Y of Object.values(q)) {
        if (Y.notified) switch (Y.status) {
            case "completed":
            case "failed":
            case "killed":
                z.push(Y.id);
                continue;
            case "pending":
                continue;
            case "running":
                break
        }
        if (Y.status === "running") {
            let A = await rS4(Y.id, Y.outputOffset);
            if (A.content) _[Y.id] = A.newOffset
        }
    }
    return {
        attachments: K,
        updatedTaskOffsets: _,
        evictedTaskIds: z
    }
}
// @from(Ln 260622, Col 0)
function ZMz(q, K, _) {
    let z = Object.keys(K);
    if (z.length === 0 && _.length === 0) return;
    q((Y) => {
        let A = !1,
            O = {
                ...Y.tasks
            };
        for (let w of z) {
            let $ = O[w];
            if ($?.status === "running") O[w] = {
                ...$,
                outputOffset: K[w]
            }, A = !0
        }
        for (let w of _) {
            let $ = O[w];
            if (!$ || !np($.status) || !$.notified) continue;
            if ("retain" in $ && ($.evictAfter ?? 1 / 0) > Date.now()) continue;
            delete O[w], A = !0
        }
        return A ? {
            ...Y,
            tasks: O
        } : Y
    })
}
// @from(Ln 260649, Col 4)
nS4 = 3000
// @from(Ln 260650, Col 4)
JI8 = 30000
// @from(Ln 260651, Col 4)
bc = L(() => {
    rA();
    $T();
    b$();
    BP();
    EH()
})
// @from(Ln 260659, Col 0)
function oS4(q, K, _) {
    let z = new Set,
        Y = 0,
        A = 0;
    for (let J of K) {
        if (J.type !== "attachment") continue;
        if (Y++, J.attachment.type !== "mcp_instructions_delta") continue;
        A++;
        for (let X of J.attachment.addedNames) z.add(X);
        for (let X of J.attachment.removedNames) z.delete(X)
    }
    let O = q.filter((J) => J.type === "connected"),
        w = new Set(O.map((J) => J.name)),
        $ = new Map;
    for (let J of O)
        if (J.instructions) $.set(J.name, `## ${J.name}
${J.instructions}`);
    for (let J of _) {
        if (!w.has(J.serverName)) continue;
        let X = $.get(J.serverName);
        $.set(J.serverName, X ? `${X}

${J.block}` : `## ${J.serverName}
${J.block}`)
    }
    let j = [];
    for (let [J, X] of $)
        if (!z.has(J)) j.push({
            name: J,
            block: X
        });
    let H = [];
    for (let J of z)
        if (!w.has(J)) H.push(J);
    if (j.length === 0 && H.length === 0) return null;
    return d("tengu_mcp_instructions_pool_change", {
        addedCount: j.length,
        removedCount: H.length,
        priorAnnouncedCount: z.size,
        clientSideCount: _.length,
        messagesLength: K.length,
        attachmentCount: Y,
        midCount: A
    }), j.sort((J, X) => J.name.localeCompare(X.name)), {
        addedNames: j.map((J) => J.name),
        addedBlocks: j.map((J) => J.block),
        removedNames: H.sort()
    }
}
// @from(Ln 260708, Col 4)
aS4 = L(() => {
    C8()
})
// @from(Ln 260726, Col 0)
function eS4() {
    let q = y1(),
        K = tn1(),
        _ = [];
    for (let z of PI8) {
        let Y = n88[z],
            A;
        switch (q) {
            case "macos":
                A = Y.macos.dataPath;
                break;
            case "linux":
            case "wsl":
                A = Y.linux.dataPath;
                break;
            case "windows": {
                if (Y.windows.dataPath.length > 0) {
                    let O = Y.windows.useRoaming ? Nx(K, "AppData", "Roaming") : Nx(K, "AppData", "Local");
                    _.push({
                        browser: z,
                        path: Nx(O, ...Y.windows.dataPath)
                    })
                }
                continue
            }
        }
        if (A && A.length > 0) _.push({
            browser: z,
            path: Nx(K, ...A)
        })
    }
    return _
}
// @from(Ln 260760, Col 0)
function qC4() {
    let q = y1(),
        K = tn1(),
        _ = [];
    for (let z of PI8) {
        let Y = n88[z];
        switch (q) {
            case "macos":
                if (Y.macos.nativeMessagingPath.length > 0) _.push({
                    browser: z,
                    path: Nx(K, ...Y.macos.nativeMessagingPath)
                });
                break;
            case "linux":
            case "wsl":
                if (Y.linux.nativeMessagingPath.length > 0) _.push({
                    browser: z,
                    path: Nx(K, ...Y.linux.nativeMessagingPath)
                });
                break;
            case "windows":
                break
        }
    }
    return _
}
// @from(Ln 260787, Col 0)
function KC4() {
    let q = [];
    for (let K of PI8) {
        let _ = n88[K];
        if (_.windows.registryKey) q.push({
            browser: K,
            key: _.windows.registryKey
        })
    }
    return q
}
// @from(Ln 260798, Col 0)
async function vMz() {
    let q = y1();
    for (let K of PI8) {
        let _ = n88[K];
        switch (q) {
            case "macos": {
                let z = `/Applications/${_.macos.appName}.app`;
                try {
                    if ((await sS4(z)).isDirectory()) return E(`[Claude in Chrome] Detected browser: ${_.name}`), K
                } catch (Y) {
                    if (!D5(Y)) throw Y
                }
                break
            }
            case "wsl":
            case "linux": {
                for (let z of _.linux.binaries)
                    if (await oA(z).catch(() => null)) return E(`[Claude in Chrome] Detected browser: ${_.name}`), K;
                break
            }
            case "windows": {
                let z = tn1();
                if (_.windows.dataPath.length > 0) {
                    let Y = _.windows.useRoaming ? Nx(z, "AppData", "Roaming") : Nx(z, "AppData", "Local"),
                        A = Nx(Y, ..._.windows.dataPath);
                    try {
                        if ((await sS4(A)).isDirectory()) return E(`[Claude in Chrome] Detected browser: ${_.name}`), K
                    } catch (O) {
                        if (!D5(O)) throw O
                    }
                }
                break
            }
        }
    }
    return null
}
// @from(Ln 260836, Col 0)
function rH6(q) {
    return Pw(q) === Ex
}
// @from(Ln 260840, Col 0)
function _C4(q) {
    if (MI8.size >= TMz && !MI8.has(q)) MI8.clear();
    MI8.add(q)
}
// @from(Ln 260844, Col 0)
async function WI8(q) {
    let K = y1(),
        _ = await vMz();
    if (!_) return E("[Claude in Chrome] No compatible browser found"), !1;
    let z = n88[_];
    switch (K) {
        case "macos": {
            let {
                code: Y
            } = await w1("open", ["-a", z.macos.appName, q]);
            return Y === 0
        }
        case "windows": {
            let {
                code: Y
            } = await w1("rundll32", ["url,OpenURL", q]);
            return Y === 0
        }
        case "wsl":
        case "linux": {
            for (let Y of z.linux.binaries) {
                let {
                    code: A
                } = await w1(Y, [q]);
                if (A === 0) return !0
            }
            return !1
        }
        default:
            return !1
    }
}
// @from(Ln 260877, Col 0)
function i88() {
    return `/tmp/claude-mcp-browser-bridge-${en1()}`
}
// @from(Ln 260881, Col 0)
function DI8() {
    if (tS4() === "win32") return `\\\\.\\pipe\\${YC4()}`;
    return Nx(i88(), `${process.pid}.sock`)
}
// @from(Ln 260886, Col 0)
function zC4() {
    if (tS4() === "win32") return [`\\\\.\\pipe\\${YC4()}`];
    let q = [],
        K = i88();
    try {
        let A = fMz(K);
        for (let O of A)
            if (O.endsWith(".sock")) q.push(Nx(K, O))
    } catch {}
    let _ = `claude-mcp-browser-bridge-${en1()}`,
        z = Nx(z2(), _),
        Y = `/tmp/${_}`;
    if (!q.includes(z)) q.push(z);
    if (z !== Y && !q.includes(Y)) q.push(Y);
    return q
}
// @from(Ln 260903, Col 0)
function YC4() {
    return `claude-mcp-browser-bridge-${en1()}`
}
// @from(Ln 260907, Col 0)
function en1() {
    try {
        return GMz().username || "default"
    } catch {
        return process.env.USER || process.env.USERNAME || "default"
    }
}
// @from(Ln 260914, Col 4)
Ex = "claude-in-chrome"
// @from(Ln 260915, Col 4)
n88
// @from(Ln 260915, Col 9)
PI8
// @from(Ln 260915, Col 14)
TMz = 200
// @from(Ln 260916, Col 4)
MI8
// @from(Ln 260917, Col 4)
ip = L(() => {
    K8();
    m8();
    Q4();
    NK();
    cW();
    n0();
    n88 = {
        chrome: {
            name: "Google Chrome",
            macos: {
                appName: "Google Chrome",
                dataPath: ["Library", "Application Support", "Google", "Chrome"],
                nativeMessagingPath: ["Library", "Application Support", "Google", "Chrome", "NativeMessagingHosts"]
            },
            linux: {
                binaries: ["google-chrome", "google-chrome-stable"],
                dataPath: [".config", "google-chrome"],
                nativeMessagingPath: [".config", "google-chrome", "NativeMessagingHosts"]
            },
            windows: {
                dataPath: ["Google", "Chrome", "User Data"],
                registryKey: "HKCU\\Software\\Google\\Chrome\\NativeMessagingHosts"
            }
        },
        brave: {
            name: "Brave",
            macos: {
                appName: "Brave Browser",
                dataPath: ["Library", "Application Support", "BraveSoftware", "Brave-Browser"],
                nativeMessagingPath: ["Library", "Application Support", "BraveSoftware", "Brave-Browser", "NativeMessagingHosts"]
            },
            linux: {
                binaries: ["brave-browser", "brave"],
                dataPath: [".config", "BraveSoftware", "Brave-Browser"],
                nativeMessagingPath: [".config", "BraveSoftware", "Brave-Browser", "NativeMessagingHosts"]
            },
            windows: {
                dataPath: ["BraveSoftware", "Brave-Browser", "User Data"],
                registryKey: "HKCU\\Software\\BraveSoftware\\Brave-Browser\\NativeMessagingHosts"
            }
        },
        arc: {
            name: "Arc",
            macos: {
                appName: "Arc",
                dataPath: ["Library", "Application Support", "Arc", "User Data"],
                nativeMessagingPath: ["Library", "Application Support", "Arc", "User Data", "NativeMessagingHosts"]
            },
            linux: {
                binaries: [],
                dataPath: [],
                nativeMessagingPath: []
            },
            windows: {
                dataPath: ["Arc", "User Data"],
                registryKey: "HKCU\\Software\\ArcBrowser\\Arc\\NativeMessagingHosts"
            }
        },
        chromium: {
            name: "Chromium",
            macos: {
                appName: "Chromium",
                dataPath: ["Library", "Application Support", "Chromium"],
                nativeMessagingPath: ["Library", "Application Support", "Chromium", "NativeMessagingHosts"]
            },
            linux: {
                binaries: ["chromium", "chromium-browser"],
                dataPath: [".config", "chromium"],
                nativeMessagingPath: [".config", "chromium", "NativeMessagingHosts"]
            },
            windows: {
                dataPath: ["Chromium", "User Data"],
                registryKey: "HKCU\\Software\\Chromium\\NativeMessagingHosts"
            }
        },
        edge: {
            name: "Microsoft Edge",
            macos: {
                appName: "Microsoft Edge",
                dataPath: ["Library", "Application Support", "Microsoft Edge"],
                nativeMessagingPath: ["Library", "Application Support", "Microsoft Edge", "NativeMessagingHosts"]
            },
            linux: {
                binaries: ["microsoft-edge", "microsoft-edge-stable"],
                dataPath: [".config", "microsoft-edge"],
                nativeMessagingPath: [".config", "microsoft-edge", "NativeMessagingHosts"]
            },
            windows: {
                dataPath: ["Microsoft", "Edge", "User Data"],
                registryKey: "HKCU\\Software\\Microsoft\\Edge\\NativeMessagingHosts"
            }
        },
        vivaldi: {
            name: "Vivaldi",
            macos: {
                appName: "Vivaldi",
                dataPath: ["Library", "Application Support", "Vivaldi"],
                nativeMessagingPath: ["Library", "Application Support", "Vivaldi", "NativeMessagingHosts"]
            },
            linux: {
                binaries: ["vivaldi", "vivaldi-stable"],
                dataPath: [".config", "vivaldi"],
                nativeMessagingPath: [".config", "vivaldi", "NativeMessagingHosts"]
            },
            windows: {
                dataPath: ["Vivaldi", "User Data"],
                registryKey: "HKCU\\Software\\Vivaldi\\NativeMessagingHosts"
            }
        },
        opera: {
            name: "Opera",
            macos: {
                appName: "Opera",
                dataPath: ["Library", "Application Support", "com.operasoftware.Opera"],
                nativeMessagingPath: ["Library", "Application Support", "com.operasoftware.Opera", "NativeMessagingHosts"]
            },
            linux: {
                binaries: ["opera"],
                dataPath: [".config", "opera"],
                nativeMessagingPath: [".config", "opera", "NativeMessagingHosts"]
            },
            windows: {
                dataPath: ["Opera Software", "Opera Stable"],
                registryKey: "HKCU\\Software\\Opera Software\\Opera Stable\\NativeMessagingHosts",
                useRoaming: !0
            }
        }
    }, PI8 = ["chrome", "brave", "arc", "edge", "chromium", "vivaldi", "opera"];
    MI8 = new Set
})
// @from(Ln 261049, Col 0)
function qi1() {
    return `# Claude in Chrome browser automation

You have access to browser automation tools (mcp__claude-in-chrome__*) for interacting with web pages in Chrome. Follow these guidelines for effective browser automation.

## GIF recording

When performing multi-step browser interactions that the user may want to review or share, use mcp__claude-in-chrome__gif_creator to record them.

You must ALWAYS:
* Capture extra frames before and after taking actions to ensure smooth playback
* Name the file meaningfully to help the user identify it later (e.g., "login_process.gif")

## Console log debugging

You can use mcp__claude-in-chrome__read_console_messages to read console output. Console output may be verbose. If you are looking for specific log entries, use the 'pattern' parameter with a regex-compatible pattern. This filters results efficiently and avoids overwhelming output. For example, use pattern: "[MyApp]" to filter for application-specific logs rather than reading all console output.

## Alerts and dialogs

IMPORTANT: Do not trigger JavaScript alerts, confirms, prompts, or browser modal dialogs through your actions. These browser dialogs block all further browser events and will prevent the extension from receiving any subsequent commands. Instead, when possible, use console.log for debugging and then use the mcp__claude-in-chrome__read_console_messages tool to read those log messages. If a page has dialog-triggering elements:
1. Avoid clicking buttons or links that may trigger alerts (e.g., "Delete" buttons with confirmation dialogs)
2. If you must interact with such elements, warn the user first that this may interrupt the session
3. Use mcp__claude-in-chrome__javascript_tool to check for and dismiss any existing dialogs before proceeding

If you accidentally trigger a dialog and lose responsiveness, inform the user they need to manually dismiss it in the browser.

## Avoid rabbit holes and loops

When using browser automation tools, stay focused on the specific task. If you encounter any of the following, stop and ask the user for guidance:
- Unexpected complexity or tangential browser exploration
- Browser tool calls failing or returning errors after 2-3 attempts
- No response from the browser extension
- Page elements not responding to clicks or input
- Pages not loading or timing out
- Unable to complete the browser task despite multiple approaches

Explain what you attempted, what went wrong, and ask how the user would like to proceed. Do not keep retrying the same failing browser action or explore unrelated pages without checking in first.

## Tab context and session startup

IMPORTANT: At the start of each browser automation session, call mcp__claude-in-chrome__tabs_context_mcp first to get information about the user's current browser tabs. Use this context to understand what the user might want to work with before creating new tabs.

Never reuse tab IDs from a previous/other session. Follow these guidelines:
1. Only reuse an existing tab if the user explicitly asks to work with it
2. Otherwise, create a new tab with mcp__claude-in-chrome__tabs_create_mcp
3. If a tool returns an error indicating the tab doesn't exist or is invalid, call tabs_context_mcp to get fresh tab IDs
4. When a tab is closed by the user or a navigation error occurs, call tabs_context_mcp to see what tabs are available`
}
// @from(Ln 261097, Col 4)
AC4 = `# Claude in Chrome browser automation

You have access to browser automation tools (mcp__claude-in-chrome__*) for interacting with web pages in Chrome. Follow these guidelines for effective browser automation.

## GIF recording

When performing multi-step browser interactions that the user may want to review or share, use mcp__claude-in-chrome__gif_creator to record them.

You must ALWAYS:
* Capture extra frames before and after taking actions to ensure smooth playback
* Name the file meaningfully to help the user identify it later (e.g., "login_process.gif")

## Console log debugging

You can use mcp__claude-in-chrome__read_console_messages to read console output. Console output may be verbose. If you are looking for specific log entries, use the 'pattern' parameter with a regex-compatible pattern. This filters results efficiently and avoids overwhelming output. For example, use pattern: "[MyApp]" to filter for application-specific logs rather than reading all console output.

## Alerts and dialogs

IMPORTANT: Do not trigger JavaScript alerts, confirms, prompts, or browser modal dialogs through your actions. These browser dialogs block all further browser events and will prevent the extension from receiving any subsequent commands. Instead, when possible, use console.log for debugging and then use the mcp__claude-in-chrome__read_console_messages tool to read those log messages. If a page has dialog-triggering elements:
1. Avoid clicking buttons or links that may trigger alerts (e.g., "Delete" buttons with confirmation dialogs)
2. If you must interact with such elements, warn the user first that this may interrupt the session
3. Use mcp__claude-in-chrome__javascript_tool to check for and dismiss any existing dialogs before proceeding

If you accidentally trigger a dialog and lose responsiveness, inform the user they need to manually dismiss it in the browser.

## Avoid rabbit holes and loops

When using browser automation tools, stay focused on the specific task. If you encounter any of the following, stop and ask the user for guidance:
- Unexpected complexity or tangential browser exploration
- Browser tool calls failing or returning errors after 2-3 attempts
- No response from the browser extension
- Page elements not responding to clicks or input
- Pages not loading or timing out
- Unable to complete the browser task despite multiple approaches

Explain what you attempted, what went wrong, and ask how the user would like to proceed. Do not keep retrying the same failing browser action or explore unrelated pages without checking in first.

## Tab context and session startup

IMPORTANT: At the start of each browser automation session, call mcp__claude-in-chrome__tabs_context_mcp first to get information about the user's current browser tabs. Use this context to understand what the user might want to work with before creating new tabs.

Never reuse tab IDs from a previous/other session. Follow these guidelines:
1. Only reuse an existing tab if the user explicitly asks to work with it
2. Otherwise, create a new tab with mcp__claude-in-chrome__tabs_create_mcp
3. If a tool returns an error indicating the tab doesn't exist or is invalid, call tabs_context_mcp to get fresh tab IDs
4. When a tab is closed by the user or a navigation error occurs, call tabs_context_mcp to see what tabs are available`
// @from(Ln 261143, Col 4)
OC4 = `**IMPORTANT: Before using any chrome browser tools, you MUST first load them using ToolSearch.**

Chrome browser tools are MCP tools that require loading before use. Before calling any mcp__claude-in-chrome__* tool:
1. Use ToolSearch with \`select:mcp__claude-in-chrome__<tool_name>\` to load the specific tool
2. Then call the tool

For example, to get tab context:
1. First: ToolSearch with query "select:mcp__claude-in-chrome__tabs_context_mcp"
2. Then: Call mcp__claude-in-chrome__tabs_context_mcp`
// @from(Ln 261152, Col 4)
wC4 = '**Browser Automation**: Chrome browser tools are available via the "claude-in-chrome" skill. CRITICAL: Before using any mcp__claude-in-chrome__* tools, invoke the skill by calling the Skill tool with skill: "claude-in-chrome". The skill provides browser automation instructions and enables the tools.'
// @from(Ln 261153, Col 4)
$C4 = `You have a computer-use MCP available (tools named \`mcp__computer-use__*\`). It lets you take screenshots of the user's desktop and control it with mouse clicks, keyboard input, and scrolling.

**Pick the right tool for the app.** Each tier trades speed/precision against coverage:

1. **Dedicated MCP for the app** — if the task is in an app that has its own MCP (Slack, Gmail, Calendar, Linear, etc.) and that MCP is connected, use it. API-backed tools are fast and precise.
2. **Chrome MCP** (\`mcp__claude-in-chrome__*\`) — if the target is a web app and there's no dedicated MCP for it, use the browser tools. DOM-aware, much faster than clicking pixels. If the Chrome extension isn't connected, ask the user to install it rather than falling through to computer use.
3. **Computer use** — for native desktop apps (Maps, Notes, Finder, Photos, System Settings, any third-party native app) and cross-app workflows. Computer use IS the right tool here — don't decline a native-app task just because there's no dedicated MCP for it.

This is about what's available, not error handling — if a dedicated MCP tool errors, debug or report it rather than silently retrying via a slower tier.

**Look before you assert.** If the user asks about app state (what's open, what's connected, what an app can do), take a screenshot and check before answering. Don't answer from memory — the user's setup or app version may differ from what you expect. If you're about to say an app doesn't support an action, that claim should be grounded in what you just saw on screen, not general knowledge. Similarly, \`list_granted_applications\` or a fresh \`screenshot\` is cheaper than a wrong assertion about what's running.

**Loading via ToolSearch — load in bulk, not one-by-one:** if computer-use tools are in the deferred list, load them ALL in a single ToolSearch call: \`{ query: "computer-use", max_results: 30 }\`. The keyword search matches the server-name substring in every tool name, so one query returns the entire toolkit. Don't use \`select:\` for individual tools — that's one round-trip per tool.

**Access flow:** before any computer-use action you must call \`request_access\` with the list of applications you need. The user approves each application explicitly, and you may need to call it again mid-task if you discover you need another application.

**Tiered apps:** some apps are granted at a restricted tier based on their category — the tier is displayed in the approval dialog and returned in the \`request_access\` response:
- **Browsers** (Safari, Chrome, Firefox, Edge, Arc, etc.) → tier **"read"**: visible in screenshots, but clicks and typing are blocked. You can read what's already on screen. For navigation, clicking, or form-filling, use the claude-in-chrome MCP (tools named \`mcp__claude-in-chrome__*\`; load via ToolSearch if deferred).
- **Terminals and IDEs** (Terminal, iTerm, VS Code, JetBrains, etc.) → tier **"click"**: visible and left-clickable, but typing, key presses, right-click, modifier-clicks, and drag-drop are blocked. You can click a Run button or scroll test output, but cannot type into the editor or integrated terminal, cannot right-click (the context menu has Paste), and cannot drag text onto them. For shell commands, use the Bash tool.
- **Everything else** → tier **"full"**: no restrictions.

The tier is enforced by the frontmost-app check: if a tier-"read" app is in front, \`left_click\` returns an error; if a tier-"click" app is in front, \`type\` and \`right_click\` return errors. The error tells you what tier the app has and what to do instead. \`open_application\` works at any tier — bringing an app forward is a read-level operation.

**Link safety — treat links in emails and messages as suspicious by default.**
- **Never click web links with computer-use tools.** If you encounter a link in a native app (Mail, Messages, a PDF, etc.), do NOT \`left_click\` it. Open the URL via the claude-in-chrome MCP instead.
- **See the full URL before following any link.** Visible link text can be misleading — hover or inspect to get the real destination.
- **Links from emails, messages, or unknown-sender documents are suspicious by default.** If the destination URL is at all unfamiliar or looks off, ask the user for confirmation before proceeding.
- **Inside the Chrome extension** you can click links with the extension's tools, but the suspicion check still applies — verify unfamiliar URLs with the user.

**Financial actions - do not execute trades or move money.** Budgeting and accounting apps (Quicken, YNAB, QuickBooks, etc.) are granted at full tier so you can categorize transactions, generate reports, and help the user organize their finances. But never execute a trade, place an order, send money, or initiate a transfer on the user's behalf - always ask the user to perform those actions themselves.`
// @from(Ln 261192, Col 0)
async function Ki1() {
    let q = fI8(A7(), "session-env", I8());
    return await VMz(q, {
        recursive: !0
    }), q
}
// @from(Ln 261198, Col 0)
async function XC4(q, K) {
    let _ = q.toLowerCase();
    return fI8(await Ki1(), `${_}-hook-${K}.sh`)
}
// @from(Ln 261202, Col 0)
async function MC4() {
    try {
        let q = await Ki1(),
            K = await JC4(q);
        await Promise.all(K.filter((_) => (_.startsWith("filechanged-hook-") || _.startsWith("cwdchanged-hook-")) && ZI8.test(_)).map((_) => kMz(fI8(q, _), "")))
    } catch (q) {
        if (Q1(q) !== "ENOENT") E(`Failed to clear cwd env files: ${b6(q)}`)
    }
}
// @from(Ln 261212, Col 0)
function xh6() {
    E("Invalidating session environment cache"), l56 = void 0
}
// @from(Ln 261215, Col 0)
async function PC4() {
    if (l56 !== void 0) return l56;
    let q = [],
        K = process.env.CLAUDE_ENV_FILE;
    if (K) try {
        let z = (await jC4(K, "utf8")).trim();
        if (z) q.push(z), E(`Session environment loaded from CLAUDE_ENV_FILE: ${K} (${z.length} chars)`)
    } catch (z) {
        if (Q1(z) !== "ENOENT") E(`Failed to read CLAUDE_ENV_FILE: ${b6(z)}`)
    }
    let _ = await Ki1();
    try {
        let Y = (await JC4(_)).filter((A) => ZI8.test(A)).sort(NMz);
        for (let A of Y) {
            let O = fI8(_, A);
            try {
                let w = (await jC4(O, "utf8")).trim();
                if (w) q.push(w)
            } catch (w) {
                if (Q1(w) !== "ENOENT") E(`Failed to read hook file ${O}: ${b6(w)}`)
            }
        }
        if (Y.length > 0) E(`Session environment loaded from ${Y.length} hook file(s)`)
    } catch (z) {
        if (Q1(z) !== "ENOENT") E(`Failed to load session environment from hooks: ${b6(z)}`)
    }
    if (q.length === 0) return E("No session environment scripts found"), l56 = null, l56;
    return l56 = q.join(`
`), E(`Session environment script ready (${l56.length} chars total)`), l56
}
// @from(Ln 261246, Col 0)
function NMz(q, K) {
    let _ = q.match(ZI8),
        z = K.match(ZI8),
        Y = _?.[1] || "",
        A = z?.[1] || "";
    if (Y !== A) return (HC4[Y] ?? 99) - (HC4[A] ?? 99);
    let O = parseInt(_?.[2] || "0", 10),
        w = parseInt(z?.[2] || "0", 10);
    return O - w
}
// @from(Ln 261256, Col 4)
l56 = void 0
// @from(Ln 261257, Col 4)
HC4
// @from(Ln 261257, Col 9)
ZI8
// @from(Ln 261258, Col 4)
oH6 = L(() => {
    y8();
    K8();
    Q8();
    m8();
    HC4 = {
        setup: 0,
        sessionstart: 1,
        cwdchanged: 2,
        filechanged: 3
    }, ZI8 = /^(setup|sessionstart|cwdchanged|filechanged)-hook-(\d+)\.sh$/
})
// @from(Ln 261271, Col 0)
function DC4(q) {
    if (_i1 = q, q && r88.length > 0)
        for (let K of r88.splice(0)) q(K)
}
// @from(Ln 261276, Col 0)
function zi1(q) {
    if (_i1) _i1(q);
    else if (r88.push(q), r88.length > yMz) r88.shift()
}
// @from(Ln 261281, Col 0)
function GI8(q) {
    if (EMz.includes(q)) return !0;
    return WC4 && hV.includes(q)
}
// @from(Ln 261286, Col 0)
function Yi1(q, K, _) {
    if (!GI8(_)) return;
    zi1({
        type: "started",
        hookId: q,
        hookName: K,
        hookEvent: _
    })
}
// @from(Ln 261296, Col 0)
function LMz(q) {
    if (!GI8(q.hookEvent)) return;
    zi1({
        type: "progress",
        ...q
    })
}
// @from(Ln 261304, Col 0)
function vI8(q) {
    if (!GI8(q.hookEvent)) return () => {};
    let K = "",
        _ = setInterval(() => {
            q.getOutput().then(({
                stdout: z,
                stderr: Y,
                output: A
            }) => {
                if (A === K) return;
                K = A, LMz({
                    hookId: q.hookId,
                    hookName: q.hookName,
                    hookEvent: q.hookEvent,
                    stdout: z,
                    stderr: Y,
                    output: A
                })
            })
        }, q.intervalMs ?? 1000);
    return _.unref(), () => clearInterval(_)
}
// @from(Ln 261327, Col 0)
function df(q) {
    let K = q.stdout || q.stderr || q.output;
    if (K) E(`Hook ${q.hookName} (${q.hookEvent}) ${q.outcome}:
${K}`);
    if (!GI8(q.hookEvent)) return;
    zi1({
        type: "response",
        ...q
    })
}
// @from(Ln 261338, Col 0)
function ZC4(q) {
    WC4 = q
}
// @from(Ln 261341, Col 4)
EMz
// @from(Ln 261341, Col 9)
yMz = 100
// @from(Ln 261342, Col 4)
r88
// @from(Ln 261342, Col 9)
_i1 = null
// @from(Ln 261343, Col 4)
WC4 = !1
// @from(Ln 261344, Col 4)
o88 = L(() => {
    HX8();
    K8();
    EMz = ["SessionStart", "Setup"], r88 = []
})