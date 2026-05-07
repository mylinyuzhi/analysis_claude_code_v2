
// @from(Ln 535773, Col 0)
function Y_5(q) {
    let K = q.startsWith(`${yL}://`) ? q : q.startsWith(`${yL}:`) ? q.replace(`${yL}:`, `${yL}://`) : null;
    if (!K) throw Error(`Invalid deep link: expected ${yL}:// scheme, got "${q}"`);
    let _;
    try {
        _ = new URL(K)
    } catch {
        throw Error(`Invalid deep link URL: "${q}"`)
    }
    if (_.hostname !== "open") throw Error(`Unknown deep link action: "${_.hostname}"`);
    let z = _.searchParams.get("cwd") ?? void 0,
        Y = _.searchParams.get("repo") ?? void 0,
        A = _.searchParams.get("q");
    if (z && !z.startsWith("/") && !/^[a-zA-Z]:[/\\]/.test(z)) throw Error(`Invalid cwd in deep link: must be an absolute path, got "${z}"`);
    if (z && K_5(z)) throw Error("Deep link cwd contains disallowed control characters");
    if (z && z.length > z_5) throw Error(`Deep link cwd exceeds ${z_5} characters (got ${z.length})`);
    if (Y && !MzA.test(Y)) throw Error(`Invalid repo in deep link: expected "owner/repo", got "${Y}"`);
    let O;
    if (A && A.trim().length > 0) {
        if (O = pz7(A.trim()).replace(/\r\n?/g, `
`), K_5(O, {
                allowNewlineAndTab: !0
            })) throw Error("Deep link query contains disallowed control characters");
        if (O.length > __5) throw Error(`Deep link query exceeds ${__5} characters (got ${O.length})`)
    }
    return {
        query: O,
        cwd: z,
        repo: Y
    }
}
// @from(Ln 535804, Col 4)
yL = "claude-cli"
// @from(Ln 535805, Col 4)
MzA
// @from(Ln 535805, Col 9)
__5 = 5000
// @from(Ln 535806, Col 4)
z_5 = 4096
// @from(Ln 535807, Col 4)
WP7 = L(() => {
    MzA = /^[\w.-]+\/[\w.-]+$/
})
// @from(Ln 535810, Col 4)
M_5 = {}
// @from(Ln 535823, Col 0)
function ts8() {
    return Tg.join(aS6(), "applications", O_5)
}
// @from(Ln 535827, Col 0)
function $_5(q) {
    return `Exec="${q}" --handle-uri %u`
}
// @from(Ln 535831, Col 0)
function j_5(q) {
    return `"${q}" --handle-uri "%1"`
}
// @from(Ln 535834, Col 0)
async function DzA(q) {
    let K = Tg.join(MY8, "Contents");
    try {
        await oS.rm(MY8, {
            recursive: !0
        })
    } catch (Y) {
        if (Q1(Y) !== "ENOENT") throw Y
    }
    await oS.mkdir(Tg.dirname(DP7), {
        recursive: !0
    });
    let _ = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleIdentifier</key>
  <string>${es8}</string>
  <key>CFBundleName</key>
  <string>${fP7}</string>
  <key>CFBundleExecutable</key>
  <string>claude</string>
  <key>CFBundleVersion</key>
  <string>1.0</string>
  <key>CFBundlePackageType</key>
  <string>APPL</string>
  <key>LSBackgroundOnly</key>
  <true/>
  <key>CFBundleURLTypes</key>
  <array>
    <dict>
      <key>CFBundleURLName</key>
      <string>Claude Code Deep Link</string>
      <key>CFBundleURLSchemes</key>
      <array>
        <string>${yL}</string>
      </array>
    </dict>
  </array>
</dict>
</plist>`;
    await oS.writeFile(Tg.join(K, "Info.plist"), _), await oS.symlink(q, DP7), await w1("/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister", ["-R", MY8], {
        useCwd: !1
    }), E(`Registered ${yL}:// protocol handler at ${MY8}`)
}
// @from(Ln 535879, Col 0)
async function ZzA(q) {
    await oS.mkdir(Tg.dirname(ts8()), {
        recursive: !0
    });
    let K = `[Desktop Entry]
Name=${fP7}
Comment=Handle ${yL}:// deep links for Claude Code
${$_5(q)}
Type=Application
NoDisplay=true
MimeType=x-scheme-handler/${yL};
`;
    await oS.writeFile(ts8(), K);
    let _ = await oA("xdg-mime");
    if (_) {
        let {
            code: z
        } = await w1(_, ["default", O_5, `x-scheme-handler/${yL}`], {
            useCwd: !1
        });
        if (z !== 0) throw Object.assign(Error(`xdg-mime exited with code ${z}`), {
            code: "XDG_MIME_FAILED"
        })
    }
    E(`Registered ${yL}:// protocol handler at ${ts8()}`)
}
// @from(Ln 535905, Col 0)
async function fzA(q) {
    for (let K of [
            ["add", ZP7, "/ve", "/d", `URL:${fP7}`, "/f"],
            ["add", ZP7, "/v", "URL Protocol", "/d", "", "/f"],
            ["add", w_5, "/ve", "/d", j_5(q), "/f"]
        ]) {
        let {
            code: _
        } = await w1("reg", K, {
            useCwd: !1
        });
        if (_ !== 0) throw Object.assign(Error(`reg add exited with code ${_}`), {
            code: "REG_FAILED"
        })
    }
    E(`Registered ${yL}:// protocol handler in Windows registry`)
}
// @from(Ln 535922, Col 0)
async function H_5(q) {
    let K = q ?? await J_5();
    switch (process.platform) {
        case "darwin":
            await DzA(K);
            break;
        case "linux":
            await ZzA(K);
            break;
        case "win32":
            await fzA(K);
            break;
        default:
            throw Error(`Unsupported platform: ${process.platform}`)
    }
}
// @from(Ln 535938, Col 0)
async function J_5() {
    let q = process.platform === "win32" ? "claude.exe" : "claude",
        K = Tg.join(sS6(), q);
    try {
        return await oS.realpath(K), K
    } catch {
        return process.execPath
    }
}
// @from(Ln 535947, Col 0)
async function X_5(q) {
    try {
        switch (process.platform) {
            case "darwin":
                return await oS.readlink(DP7) === q;
            case "linux":
                return (await oS.readFile(ts8(), "utf8")).includes($_5(q));
            case "win32": {
                let {
                    stdout: K,
                    code: _
                } = await w1("reg", ["query", w_5, "/ve"], {
                    useCwd: !1
                });
                return _ === 0 && K.includes(j_5(q))
            }
            default:
                return !1
        }
    } catch {
        return !1
    }
}
// @from(Ln 535970, Col 0)
async function GzA() {
    if (v7().disableDeepLinkRegistration === "disable") return;
    if (!u8("tengu_lodestone_enabled", !1)) return;
    let q = await J_5();
    if (await X_5(q)) return;
    let K = Tg.join(A7(), ".deep-link-register-failed");
    try {
        let _ = await oS.stat(K);
        if (Date.now() - _.mtimeMs < WzA) return
    } catch {}
    try {
        await H_5(q), d("tengu_deep_link_registered", {
            success: !0
        }), E("Auto-registered claude-cli:// deep link protocol handler"), await oS.rm(K, {
            force: !0
        }).catch(() => {})
    } catch (_) {
        let z = Q1(_);
        if (d("tengu_deep_link_registered", {
                success: !1,
                error_code: z
            }), E(`Failed to auto-register deep link protocol handler: ${_ instanceof Error?_.message:String(_)}`, {
                level: "warn"
            }), z === "EACCES" || z === "ENOSPC") await oS.writeFile(K, "").catch(() => {})
    }
}
// @from(Ln 535996, Col 4)
es8 = "com.anthropic.claude-code-url-handler"
// @from(Ln 535997, Col 4)
fP7 = "Claude Code URL Handler"
// @from(Ln 535998, Col 4)
O_5 = "claude-code-url-handler.desktop"
// @from(Ln 535999, Col 4)
PzA = "Claude Code URL Handler.app"
// @from(Ln 536000, Col 4)
MY8
// @from(Ln 536000, Col 9)
DP7
// @from(Ln 536000, Col 14)
ZP7
// @from(Ln 536000, Col 19)
w_5
// @from(Ln 536000, Col 24)
WzA = 86400000
// @from(Ln 536001, Col 4)
GP7 = L(() => {
    B1();
    C8();
    K8();
    Q8();
    m8();
    Q4();
    a1();
    n0();
    aq8();
    WP7();
    MY8 = Tg.join(A_5.homedir(), "Applications", PzA), DP7 = Tg.join(MY8, "Contents", "MacOS", "claude");
    ZP7 = `HKEY_CURRENT_USER\\Software\\Classes\\${yL}`, w_5 = `${ZP7}\\shell\\open\\command`
})
// @from(Ln 536015, Col 4)
P_5 = {}
// @from(Ln 536020, Col 0)
function TP7() {
    if (vzA.initExtractMemories(), DW4(), IkK(), KFK(), wV()) TzA.ensureDeepLinkProtocolRegistered();
    let q = !0;
    async function K() {
        if (wV() && AV() > Date.now() - 60000) {
            setTimeout(K, vP7).unref();
            return
        }
        if (q) q = !1, await e95();
        if (wV() && AV() > Date.now() - 60000) {
            setTimeout(K, vP7).unref();
            return
        }
        await eq8()
    }
    setTimeout(K, vP7).unref()
}
// @from(Ln 536037, Col 4)
vzA
// @from(Ln 536037, Col 9)
TzA
// @from(Ln 536037, Col 14)
vP7 = 600000
// @from(Ln 536038, Col 4)
VP7 = L(() => {
    Vy6();
    P97();
    y8();
    q_5();
    El();
    gi8();
    vzA = (M38(), B7(Kc8)), TzA = (GP7(), B7(M_5))
})
// @from(Ln 536048, Col 0)
function D_5(q) {
    W_5.useEffect(() => {
        if (Ew().lastGracefulShutdown !== !1) u2((_) => ({
            ..._,
            lastGracefulShutdown: !1
        }));
        let K = () => {
            if (AZ8()) process.stdout.write(`
` + qI8() + `
`);
            B88(q?.())
        };
        return process.on("exit", K), () => {
            if (rs()) B88(q?.());
            process.off("exit", K)
        }
    }, [])
}
// @from(Ln 536066, Col 4)
W_5
// @from(Ln 536067, Col 4)
Z_5 = L(() => {
    Tx();
    HQ();
    h1();
    CY();
    W_5 = K6(P6(), 1)
})
// @from(Ln 536075, Col 0)
function G_5() {
    f_5.useEffect(() => {}, [])
}
// @from(Ln 536078, Col 4)
f_5
// @from(Ln 536079, Col 4)
v_5 = L(() => {
    Q8();
    f_5 = K6(P6(), 1)
})
// @from(Ln 536084, Col 0)
function T_5(q, K) {
    let _ = eW6.useRef(q ?? null),
        z = eW6.useRef(!q);
    return eW6.useEffect(() => {
        let Y = _.current;
        if (!Y) return;
        let A = !1;
        return Y.then((O) => {
            if (A) return;
            if (z.current = !0, _.current = null, O.length > 0) K((w) => [...O, ...w])
        }), () => {
            A = !0
        }
    }, [K]), eW6.useCallback(async () => {
        if (z.current || !_.current) return;
        let Y = await _.current;
        if (z.current) return;
        if (z.current = !0, _.current = null, Y.length > 0) K((A) => [...Y, ...A])
    }, [K])
}
// @from(Ln 536104, Col 4)
eW6
// @from(Ln 536105, Col 4)
V_5 = L(() => {
    eW6 = K6(P6(), 1)
})
// @from(Ln 536109, Col 0)
function k_5() {
    let [q, K] = PY8.useState(() => {
        if (!jX() || i7()) return "valid";
        let {
            key: A,
            source: O
        } = Vw({
            skipRetrievingKeyFromApiKeyHelper: !0
        });
        if (A || O === "apiKeyHelper") return "loading";
        return "missing"
    }), [_, z] = PY8.useState(null), Y = PY8.useCallback(async () => {
        if (!jX() || i7()) {
            K("valid");
            return
        }
        await Wk6(I7());
        let {
            key: A,
            source: O
        } = Vw();
        if (!A) {
            if (O === "apiKeyHelper") {
                K("error"), z(Error("API key helper did not return a valid key"));
                return
            }
            K("missing");
            return
        }
        try {
            let $ = await a85(A, !1) ? "valid" : "invalid";
            K($);
            return
        } catch (w) {
            z(w), K("error");
            return
        }
    }, []);
    return {
        status: q,
        reverify: Y,
        error: _
    }
}
// @from(Ln 536153, Col 4)
PY8
// @from(Ln 536154, Col 4)
N_5 = L(() => {
    y8();
    O2();
    T7();
    PY8 = K6(P6(), 1)
})
// @from(Ln 536160, Col 4)
E_5 = L(() => {
    y8();
    Yk();
    R9();
    n7();
    K8()
})
// @from(Ln 536168, Col 0)
function kP7({
    screen: q,
    setScreen: K,
    showAllInTranscript: _,
    setShowAllInTranscript: z,
    messageCount: Y,
    onEnterTranscript: A,
    onExitTranscript: O,
    virtualScrollActive: w,
    searchBarOpen: $ = !1
}) {
    let j = M8((v) => v.expandedView),
        H = R7(),
        J = yz6.useCallback(() => {
            d("tengu_toggle_todos", {
                is_expanded: j === "tasks"
            }), H((v) => {
                let {
                    getAllInProcessTeammateTasks: V
                } = (hx(), B7(Sb4));
                if (w7(V(v.tasks), (N) => N.status === "running") > 0) switch (v.expandedView) {
                    case "none":
                        return {
                            ...v, expandedView: "tasks"
                        };
                    case "tasks":
                        return {
                            ...v, expandedView: "teammates"
                        };
                    case "teammates":
                        return {
                            ...v, expandedView: "none"
                        }
                }
                return {
                    ...v,
                    expandedView: v.expandedView === "tasks" ? "none" : "tasks"
                }
            })
        }, [j, H]),
        X = M8((v) => v.isBriefOnly),
        M = yz6.useCallback(() => {
            {
                let {
                    isBriefEnabled: V
                } = (rF(), B7(Xe));
                if (!V() && X && q !== "transcript") {
                    H((k) => {
                        if (!k.isBriefOnly) return k;
                        return {
                            ...k,
                            isBriefOnly: !1
                        }
                    });
                    return
                }
            }
            let v = q !== "transcript";
            if (d("tengu_toggle_transcript", {
                    is_entering: v,
                    show_all: _,
                    message_count: Y
                }), K((V) => V === "transcript" ? "prompt" : "transcript"), z(!1), v && A) A();
            if (!v && O) O()
        }, [q, K, X, _, z, Y, H, A, O]),
        P = yz6.useCallback(() => {
            d("tengu_transcript_toggle_show_all", {
                is_expanding: !_,
                message_count: Y
            }), z((v) => !v)
        }, [_, z, Y]),
        W = yz6.useCallback(() => {
            if (d("tengu_transcript_exit", {
                    show_all: _,
                    message_count: Y
                }), K("prompt"), z(!1), O) O()
        }, [K, _, z, Y, O]),
        D = yz6.useCallback(() => {
            {
                let {
                    isBriefEnabled: v
                } = (rF(), B7(Xe));
                if (!v() && !X) return;
                let V = !X;
                d("tengu_brief_mode_toggled", {
                    enabled: V,
                    gated: !1,
                    source: "keybinding"
                }), H((k) => {
                    if (k.isBriefOnly === V) return k;
                    return {
                        ...k,
                        isBriefOnly: V
                    }
                })
            }
        }, [X, H]);
    G1("app:toggleTodos", J, {
        context: "Global"
    }), G1("app:toggleTranscript", M, {
        context: "Global"
    }), G1("app:toggleBrief", D, {
        context: "Global"
    }), G1("app:toggleTeammatePreview", () => {
        H((v) => ({
            ...v,
            showTeammateMessagePreview: !v.showTeammateMessagePreview
        }))
    }, {
        context: "Global"
    });
    let Z = yz6.useCallback(() => {}, []);
    G1("app:toggleTerminal", Z, {
        context: "Global"
    });
    let G = yz6.useCallback(() => {
        KO.get(process.stdout)?.forceRedraw()
    }, []);
    G1("app:redraw", G, {
        context: "Global"
    });
    let f = q === "transcript";
    return G1("transcript:toggleShowAll", P, {
        context: "Transcript",
        isActive: f && !w
    }), G1("transcript:exit", W, {
        context: "Transcript",
        isActive: f && !$
    }), null
}
// @from(Ln 536298, Col 4)
yz6
// @from(Ln 536299, Col 4)
y_5 = L(() => {
    kY();
    Yk();
    C7();
    B1();
    C8();
    N7();
    E_5();
    yz6 = K6(P6(), 1)
})
// @from(Ln 536310, Col 0)
function NP7(q) {
    let K = s(8),
        {
            onSubmit: _,
            isActive: z
        } = q,
        Y = z === void 0 ? !0 : z,
        A = lv(),
        O = o46(),
        w;
    q: {
        if (!A) {
            let P;
            if (K[0] === Symbol.for("react.memo_cache_sentinel")) P = new Set, K[0] = P;
            else P = K[0];
            w = P;
            break q
        }
        let M;
        if (K[1] !== A.bindings) {
            M = new Set;
            for (let P of A.bindings)
                if (P.action?.startsWith("command:")) M.add(P.action);
            K[1] = A.bindings, K[2] = M
        } else M = K[2];w = M
    }
    let $ = w,
        j;
    if (K[3] !== $ || K[4] !== _) {
        j = {};
        for (let M of $) {
            let P = M.slice(8);
            j[M] = () => {
                _(`/${P}`, VzA, void 0, {
                    fromKeybinding: !0
                })
            }
        }
        K[3] = $, K[4] = _, K[5] = j
    } else j = K[5];
    let H = j,
        J = Y && !O,
        X;
    if (K[6] !== J) X = {
        context: "Chat",
        isActive: J
    }, K[6] = J, K[7] = X;
    else X = K[7];
    return L7(H, X), null
}
// @from(Ln 536360, Col 4)
VzA
// @from(Ln 536361, Col 4)
L_5 = L(() => {
    o6();
    CP();
    jp();
    C7();
    VzA = {
        setCursorOffset: () => {},
        clearBuffer: () => {},
        resetHistory: () => {}
    }
})
// @from(Ln 536373, Col 0)
function EP7(q) {
    let {
        setToolUseConfirmQueue: K,
        onCancel: _,
        onAgentsKilled: z,
        isMessageSelectorVisible: Y,
        screen: A,
        abortSignal: O,
        popCommandFromQueue: w,
        isLocalJSXCommand: $,
        isInputOverlayActive: j,
        inputMode: H,
        isInputEmpty: J
    } = q, X = H9(), M = R7(), P = EX(), W = cn().length, {
        addNotification: D,
        removeNotification: Z
    } = EK(), G = q06.useRef(0), f = M8((U) => U.viewSelectionMode), v = q06.useCallback(() => {
        let U = {
            source: "escape",
            streamMode: AS.getState().mode
        };
        if (O !== void 0 && !O.aborted) {
            d("tengu_cancel", U), K(() => []), _();
            return
        }
        if (qe6()) {
            if (w) {
                w();
                return
            }
        }
        d("tengu_cancel", U), K(() => []), _()
    }, [O, w, K, _]), V = e$4(), k = O !== void 0 && !O.aborted, N = W > 0, R = H !== void 0 && H !== "prompt" && J, h = f === "viewing-agent", C = A !== "transcript" && !Y && !$ && !V && !j, x = C && (k || N) && !R && !h, B = C && (k || N || h);
    G1("chat:cancel", v, {
        context: "Chat",
        isActive: x
    });
    let m = q06.useCallback(() => {
            let U = X.getState().tasks,
                g = Object.entries(U).filter(([, l]) => l.type === "local_agent" && l.status === "running");
            if (g.length === 0) return !1;
            tRK(U, P);
            let c = [];
            for (let [l, z6] of g) eRK(l, P), c.push(z6.description), I$(l, "stopped", {
                toolUseId: z6.toolUseId,
                summary: z6.description
            });
            let n = c.length === 1 ? `Background agent "${c[0]}" was stopped by the user.` : `${c.length} background agents were stopped by the user: ${c.map((l)=>`"${l}"`).join(", ")}.`;
            return LY({
                value: n,
                mode: "task-notification"
            }), z(), !0
        }, [X, z, P]),
        S = q06.useCallback(() => {
            if (h) m(), kG(M);
            if (k || N) v()
        }, [h, m, M, k, N, v]);
    G1("app:interrupt", S, {
        context: "Global",
        isActive: B
    });
    let F = q06.useCallback(() => {
        let U = X.getState().tasks;
        if (!Object.values(U).some((z6) => z6.type === "local_agent" && z6.status === "running")) {
            D({
                key: "kill-agents-none",
                text: "No background agents running",
                priority: "immediate",
                timeoutMs: 2000
            });
            return
        }
        let c = Date.now();
        if (c - G.current <= h_5) {
            G.current = 0, Z("kill-agents-confirm"), d("tengu_cancel", {
                source: "kill_agents"
            }), qW4(), m();
            return
        }
        G.current = c;
        let l = WJ("chat:killAgents", "Chat", "ctrl+x ctrl+k");
        D({
            key: "kill-agents-confirm",
            text: `Press ${l} again to stop background agents`,
            priority: "immediate",
            timeoutMs: h_5
        })
    }, [X, D, Z, m]);
    return G1("chat:killAgents", F, {
        context: "Chat"
    }), null
}
// @from(Ln 536465, Col 4)
q06
// @from(Ln 536465, Col 9)
h_5 = 3000
// @from(Ln 536466, Col 4)
R_5 = L(() => {
    C8();
    N7();
    $S();
    p48();
    kY();
    CP();
    Pm6();
    zp();
    C7();
    Ru();
    vM();
    b$();
    BP();
    q06 = K6(P6(), 1)
})
// @from(Ln 536483, Col 0)
function kzA(q, K) {
    K((_) => {
        let z = qt(_.tasks).length;
        if (z === 0) return _;
        if (_.expandedView !== "teammates") return {
            ..._,
            expandedView: "teammates",
            viewSelectionMode: "selecting-agent",
            selectedIPAgentIndex: -1
        };
        let Y = z,
            A = _.selectedIPAgentIndex,
            O = q === 1 ? A >= Y ? -1 : A + 1 : A <= -1 ? Y : A - 1;
        return {
            ..._,
            selectedIPAgentIndex: O,
            viewSelectionMode: "selecting-agent"
        }
    })
}
// @from(Ln 536504, Col 0)
function S_5(q) {
    let K = M8((M) => M.tasks),
        _ = M8((M) => M.viewSelectionMode),
        z = M8((M) => M.viewingAgentTaskId),
        Y = M8((M) => M.selectedIPAgentIndex),
        A = R7(),
        O = EX(),
        w = qt(K),
        $ = w.length,
        j = Object.values(K).some((M) => yH(M) && M.type !== "in_process_teammate"),
        H = Kt8.useRef($);
    Kt8.useEffect(() => {
        let M = H.current;
        H.current = $, A((P) => {
            let D = qt(P.tasks).length;
            if (D === 0 && M > 0 && P.selectedIPAgentIndex !== -1) {
                if (P.viewSelectionMode === "viewing-agent") return {
                    ...P,
                    selectedIPAgentIndex: -1
                };
                return {
                    ...P,
                    selectedIPAgentIndex: -1,
                    viewSelectionMode: "none"
                }
            }
            let Z = P.expandedView === "teammates" ? D : D - 1;
            if (D > 0 && P.selectedIPAgentIndex > Z) return {
                ...P,
                selectedIPAgentIndex: Z
            };
            return P
        })
    }, [$, A]);
    let J = () => {
        if ($ === 0) return null;
        let P = w[Y];
        if (!P) return null;
        return {
            taskId: P.id,
            task: P
        }
    };
    return {
        handleKeyDown: (M) => {
            if (M.key === "escape" && _ === "viewing-agent") {
                M.preventDefault();
                let P = z;
                if (P) {
                    let W = K[P];
                    if (EJ(W) && W.status === "running") {
                        W.currentWorkAbortController?.abort();
                        return
                    }
                }
                kG(A);
                return
            }
            if (M.key === "escape" && _ === "selecting-agent") {
                M.preventDefault(), A((P) => ({
                    ...P,
                    viewSelectionMode: "none",
                    selectedIPAgentIndex: -1
                }));
                return
            }
            if (M.shift && (M.key === "up" || M.key === "down")) {
                if (M.preventDefault(), $ > 0) kzA(M.key === "down" ? 1 : -1, A);
                else if (j) q?.onOpenBackgroundTasks?.();
                return
            }
            if (M.key === "f" && !M.ctrl && !M.meta && _ === "selecting-agent" && $ > 0) {
                M.preventDefault();
                let P = J();
                if (P) VG(P.taskId, A);
                return
            }
            if (M.key === "return" && _ === "selecting-agent") {
                if (M.preventDefault(), Y === -1) kG(A);
                else if (Y >= $) A((P) => ({
                    ...P,
                    expandedView: "none",
                    viewSelectionMode: "none",
                    selectedIPAgentIndex: -1
                }));
                else {
                    let P = J();
                    if (P) VG(P.taskId, A)
                }
                return
            }
            if (M.key === "k" && !M.ctrl && !M.meta && _ === "selecting-agent" && Y >= 0) {
                M.preventDefault();
                let P = J();
                if (P && P.task.status === "running") Z18.kill(P.taskId, O, A);
                return
            }
        }
    }
}
// @from(Ln 536604, Col 4)
Kt8
// @from(Ln 536605, Col 4)
C_5 = L(() => {
    N7();
    Ru();
    $S();
    hx();
    Kt8 = K6(P6(), 1)
})
// @from(Ln 536613, Col 0)
function b_5() {
    let q = Mn6();
    if (!q?.teamName || !q?.agentName) {
        E("[Reconnection] computeInitialTeamContext: No teammate context set (not a teammate)");
        return
    }
    let {
        teamName: K,
        agentId: _,
        agentName: z
    } = q, Y = uM(K);
    if (!Y) {
        j6(Error(`[computeInitialTeamContext] Could not read team file for ${K}`));
        return
    }
    let A = oF(K),
        O = !_;
    return E(`[Reconnection] Computed initial team context for ${O?"leader":`teammate ${z}`} in team ${K}`), {
        teamName: K,
        teamFilePath: A,
        leadAgentId: Y.leadAgentId,
        selfAgentId: _,
        selfAgentName: z,
        isLeader: O,
        teammates: {}
    }
}
// @from(Ln 536641, Col 0)
function I_5(q, K, _) {
    let z = uM(K);
    if (!z) {
        j6(Error(`[initializeTeammateContextFromSession] Could not read team file for ${K} (agent: ${_})`));
        return
    }
    let Y = z.members.find((w) => w.name === _);
    if (!Y) E(`[Reconnection] Member ${_} not found in team ${K} - may have been removed`);
    let A = Y?.agentId,
        O = oF(K);
    q((w) => ({
        ...w,
        teamContext: {
            teamName: K,
            teamFilePath: O,
            leadAgentId: z.leadAgentId,
            selfAgentId: A,
            selfAgentName: _,
            isLeader: !1,
            teammates: {}
        }
    })), E(`[Reconnection] Initialized agent context from session for ${_} in team ${K}`)
}
// @from(Ln 536664, Col 4)
yP7 = L(() => {
    K8();
    U8();
    zY();
    BD()
})
// @from(Ln 536671, Col 0)
function LP7(q, K, _) {
    let {
        teamName: z,
        agentId: Y,
        agentName: A
    } = _, O = uM(z);
    if (!O) {
        E(`[TeammateInit] Team file not found for team: ${z}`);
        return
    }
    let w = O.leadAgentId;
    if (O.teamAllowedPaths && O.teamAllowedPaths.length > 0) {
        E(`[TeammateInit] Found ${O.teamAllowedPaths.length} team-wide allowed path(s)`);
        for (let H of O.teamAllowedPaths) {
            let J = H.path.startsWith("/") ? `/${H.path}/**` : `${H.path}/**`;
            E(`[TeammateInit] Applying team permission: ${H.toolName} allowed in ${H.path} (rule: ${J})`), q((X) => ({
                ...X,
                toolPermissionContext: EY(X.toolPermissionContext, {
                    type: "addRules",
                    rules: [{
                        toolName: H.toolName,
                        ruleContent: J
                    }],
                    behavior: "allow",
                    destination: "session"
                })
            }))
        }
    }
    let j = O.members.find((H) => H.agentId === w)?.name || "team-lead";
    if (Y === w) {
        E("[TeammateInit] This agent is the team leader - skipping idle notification hook");
        return
    }
    E(`[TeammateInit] Registering Stop hook for teammate ${A} to notify leader ${j}`), nK8(q, K, "Stop", "", async (H, J) => {
        V38(z, A, !1);
        let X = w18(A, {
            idleReason: "available",
            summary: J18(H)
        });
        return await F_(j, {
            from: A,
            text: I6(X),
            timestamp: new Date().toISOString(),
            color: KH()
        }), E(`[TeammateInit] Sent idle notification to leader ${j}`), !0
    }, "Failed to send idle notification to team leader", {
        timeout: 1e4
    })
}
// @from(Ln 536721, Col 4)
x_5 = L(() => {
    K8();
    ty();
    MH();
    e8();
    zY();
    ZX();
    BD()
})
// @from(Ln 536731, Col 0)
function m_5(q, K, {
    enabled: _ = !0
} = {}) {
    u_5.useEffect(() => {
        if (!_) return;
        if (z4()) {
            let z = K?.[0],
                Y = z && "teamName" in z ? z.teamName : void 0,
                A = z && "agentName" in z ? z.agentName : void 0;
            if (Y && A) {
                I_5(q, Y, A);
                let w = uM(Y)?.members.find(($) => $.name === A);
                if (w) LP7(q, I8(), {
                    teamName: Y,
                    agentId: w.agentId,
                    agentName: A
                })
            } else {
                let O = Mn6?.();
                if (O?.teamName && O?.agentId && O?.agentName) LP7(q, I8(), {
                    teamName: O.teamName,
                    agentId: O.agentId,
                    agentName: O.agentName
                })
            }
        }
    }, [q, K, _])
}
// @from(Ln 536759, Col 4)
u_5
// @from(Ln 536760, Col 4)
B_5 = L(() => {
    y8();
    fO();
    yP7();
    BD();
    x_5();
    zY();
    u_5 = K6(P6(), 1)
})
// @from(Ln 536770, Col 0)
function F_5() {
    let q = R7(),
        K = M8((w) => w.viewingAgentTaskId),
        _ = M8((w) => w.viewingAgentTaskId ? w.tasks[w.viewingAgentTaskId] : void 0),
        z = _ && EJ(_) ? _ : void 0,
        Y = z?.status,
        A = z?.error,
        O = _ !== void 0;
    p_5.useEffect(() => {
        if (!K) return;
        if (!O) {
            kG(q);
            return
        }
        if (!z) return;
        if (Y === "killed" || Y === "failed" || A || Y !== "running" && Y !== "completed" && Y !== "pending") {
            kG(q);
            return
        }
    }, [K, O, z, Y, A, q])
}
// @from(Ln 536791, Col 4)
p_5
// @from(Ln 536792, Col 4)
g_5 = L(() => {
    N7();
    Ru();
    p_5 = K6(P6(), 1)
})
// @from(Ln 536797, Col 0)
async function U_5(q) {
    let {
        ctx: K,
        updatedInput: _,
        suggestions: z,
        permissionMode: Y
    } = q;
    try {
        let A = await K.runHooks(Y, z, _);
        if (A && !("reprompted" in A)) return A;
        let O = null;
        if (O) return O
    } catch (A) {
        if (A instanceof Error) j6(A);
        else j6(Error(`Automated permission check failed: ${String(A)}`))
    }
    return null
}
// @from(Ln 536815, Col 4)
Q_5 = L(() => {
    U8()
})
// @from(Ln 536822, Col 0)
function d_5(q, K) {
    let {
        ctx: _,
        description: z,
        result: Y,
        awaitAutomatedChecksBeforeDialog: A,
        bridgeCallbacks: O,
        channelCallbacks: w
    } = q, {
        resolve: $,
        isResolved: j,
        claim: H
    } = ga8(K), J = !1, X, M, P = O ? NzA() : void 0, W, D, Z = Date.now(), G = Y.updatedInput ?? _.input, {
        setClassifierApprovals: f
    } = _.toolUseContext, v = Y.decisionReason, V = G;

    function k() {}
    if (_.pushToQueue({
            assistantMessage: _.assistantMessage,
            tool: _.tool,
            description: z,
            input: G,
            toolUseContext: _.toolUseContext,
            toolUseID: _.toolUseID,
            permissionResult: Y,
            permissionPromptStartTimeMs: Z,
            ...{},
            onUserInteraction() {
                if (Date.now() - Z < 200) return;
                J = !0, _t(f, _.toolUseID), k()
            },
            onDismissCheckmark() {
                if (X) {
                    if (clearTimeout(X), X = void 0, M) _.toolUseContext.abortController.signal.removeEventListener("abort", M), M = void 0;
                    _.removeFromQueue()
                }
            },
            onAbort() {
                if (!H()) return;
                if (O && P) O.sendResponse(P, {
                    behavior: "deny",
                    message: "User aborted"
                }), O.cancelRequest(P);
                W?.(), D?.(), _.logCancelled(), _.logDecision({
                    decision: "reject",
                    source: {
                        type: "user_abort"
                    }
                }, {
                    permissionPromptStartTimeMs: Z,
                    input: V
                }), $(_.cancelAndAbort(void 0, !0))
            },
            onAllow(N, R, h, C) {
                if (!H()) return;
                if (O && P) O.sendResponse(P, {
                    behavior: "allow",
                    updatedInput: N,
                    updatedPermissions: R
                }), O.cancelRequest(P);
                W?.(), D?.(), $(_.handleUserAllow(N, R, h, Z, C, v))
            },
            onReject(N, R) {
                if (!H()) return;
                if (O && P) O.sendResponse(P, {
                    behavior: "deny",
                    message: N ?? "User denied permission"
                }), O.cancelRequest(P);
                W?.(), D?.(), _.logDecision({
                    decision: "reject",
                    source: {
                        type: "user_reject",
                        hasFeedback: !!N
                    }
                }, {
                    permissionPromptStartTimeMs: Z,
                    input: V
                }), $(_.cancelAndAbort(N, void 0, R))
            },
            async recheckPermission() {
                if (j()) return;
                let N = await LX(_.tool, _.input, _.toolUseContext, _.assistantMessage, _.toolUseID);
                if (N.behavior === "allow") {
                    if (!H()) return;
                    if (O && P) O.cancelRequest(P);
                    W?.(), D?.(), _.removeFromQueue(), _.logDecision({
                        decision: "accept",
                        source: "config"
                    }), $(_.buildAllow(N.updatedInput ?? _.input))
                }
            }
        }), O && P) {
        O.sendRequest(P, _.tool.name, G, _.toolUseID, z, Y.suggestions, Y.blockedPath);
        let N = _.toolUseContext.abortController.signal;
        W = O.onResponse(P, (R) => {
            if (!H()) return;
            if (W) N.removeEventListener("abort", W);
            if (_t(f, _.toolUseID), k(), _.removeFromQueue(), D?.(), R.behavior === "allow") {
                if (R.updatedPermissions?.length) _.persistPermissions(R.updatedPermissions);
                _.logDecision({
                    decision: "accept",
                    source: {
                        type: "user",
                        permanent: !!R.updatedPermissions?.length
                    }
                }, {
                    permissionPromptStartTimeMs: Z
                }), $(_.buildAllow(R.updatedInput ?? G))
            } else _.logDecision({
                decision: "reject",
                source: {
                    type: "user_reject",
                    hasFeedback: !!R.message
                }
            }, {
                permissionPromptStartTimeMs: Z
            }), $(_.cancelAndAbort(R.message))
        }), N.addEventListener("abort", W, {
            once: !0
        })
    }
    if (w && !_.tool.requiresUserInteraction?.()) {
        let N = SpK(_.toolUseID),
            R = qj(),
            h = bpK(_.toolUseContext.getAppState().mcp.clients, (C) => BP6(C, R) !== void 0);
        if (h.length > 0) {
            let C = {
                request_id: N,
                tool_name: _.tool.name,
                description: z,
                input_preview: CpK(G)
            };
            for (let m of h) {
                if (m.type !== "connected") continue;
                m.client.notification({
                    method: LpK,
                    params: C
                }).catch((S) => {
                    E(`Channel permission_request failed for ${m.name}: ${b6(S)}`, {
                        level: "error"
                    })
                })
            }
            let x = _.toolUseContext.abortController.signal,
                B = w.onResponse(N, (m) => {
                    if (!H()) return;
                    if (D?.(), _t(f, _.toolUseID), k(), _.removeFromQueue(), O && P) O.cancelRequest(P);
                    if (W?.(), m.behavior === "allow") _.logDecision({
                        decision: "accept",
                        source: {
                            type: "user",
                            permanent: !1
                        }
                    }, {
                        permissionPromptStartTimeMs: Z
                    }), $(_.buildAllow(G));
                    else _.logDecision({
                        decision: "reject",
                        source: {
                            type: "user_reject",
                            hasFeedback: !1
                        }
                    }, {
                        permissionPromptStartTimeMs: Z
                    }), $(_.cancelAndAbort(`Denied via channel ${m.fromServer}`))
                });
            D = () => {
                B(), x.removeEventListener("abort", D)
            }, x.addEventListener("abort", D, {
                once: !0
            })
        }
    }
    if (!A)(async () => {
        if (j()) return;
        let N = _.toolUseContext.getAppState(),
            R = await _.runHooks(N.toolPermissionContext.mode, Y.suggestions, Y.updatedInput, Z);
        if (R && "reprompted" in R) {
            if (j()) return;
            if (J = !0, _t(f, _.toolUseID), k(), O && P) O.cancelRequest(P), P = void 0;
            W?.(), D?.(), v = R.reprompted.decisionReason, V = R.finalInput;
            return
        }
        if (!R || !H()) return;
        if (O && P) O.cancelRequest(P);
        W?.(), D?.(), _.removeFromQueue(), $(R)
    })()
}
// @from(Ln 537010, Col 4)
c_5 = L(() => {
    K8();
    y8();
    uN6();
    O_8();
    tO7();
    MT();
    m8();
    g$();
    xz8()
})
// @from(Ln 537021, Col 0)
async function l_5(q) {
    if (!z4() || !G18()) return null;
    let {
        ctx: K,
        description: _,
        updatedInput: z,
        suggestions: Y
    } = q, A = null;
    if (A) return A;
    try {
        let O = () => K.toolUseContext.setAppState(($) => ({
            ...$,
            pendingWorkerRequest: null
        }));
        return await new Promise(($) => {
            let {
                resolve: j,
                claim: H
            } = ga8($), J = oI8({
                toolName: K.tool.name,
                toolUseId: K.toolUseID,
                input: K.input,
                description: _,
                permissionSuggestions: Y
            });
            eI8({
                requestId: J.id,
                toolUseId: K.toolUseID,
                onAllow(X, M, P, W) {
                    if (!H()) return;
                    O();
                    let D = X && Object.keys(X).length > 0 ? X : K.input;
                    j(K.handleUserAllow(D, M, P, void 0, W))
                },
                onReject(X, M) {
                    if (!H()) return;
                    O(), K.logDecision({
                        decision: "reject",
                        source: {
                            type: "user_reject",
                            hasFeedback: !!X
                        }
                    }), j(K.cancelAndAbort(X, void 0, M))
                }
            }), aI8(J), K.toolUseContext.setAppState((X) => ({
                ...X,
                pendingWorkerRequest: {
                    toolName: K.tool.name,
                    toolUseId: K.toolUseID,
                    description: _
                }
            })), K.toolUseContext.abortController.signal.addEventListener("abort", () => {
                if (!H()) return;
                O(), K.logCancelled(), j(K.cancelAndAbort(void 0, !0))
            }, {
                once: !0
            })
        })
    } catch (O) {
        return j6(r1(O)), null
    }
}
// @from(Ln 537083, Col 4)
n_5 = L(() => {
    fO();
    m8();
    U8();
    ah6();
    qR6();
    xz8()
})
// @from(Ln 537092, Col 0)
function EzA(q, K) {
    let _ = s(4),
        {
            recordDenial: z
        } = Mu6(),
        Y;
    if (_[0] !== z || _[1] !== K || _[2] !== q) Y = async (A, O, w, $, j, H) => {
        let {
            setClassifierApprovals: J
        } = w;
        return new Promise((X) => {
            let M = o75(A, O, w, $, j, K, s75(q));
            if (M.resolveIfAborted(X)) return;
            return (H !== void 0 ? Promise.resolve(H) : LX(A, O, w, $, j)).then(async (W) => {
                if (W.behavior === "allow") {
                    if (M.resolveIfAborted(X)) return;
                    if (W.decisionReason?.type === "classifier" && W.decisionReason.classifier === "auto-mode") mI4(J, j, W.decisionReason.reason);
                    M.logDecision({
                        decision: "accept",
                        source: "config"
                    }), X(M.buildAllow(W.updatedInput ?? O, {
                        decisionReason: W.decisionReason
                    }));
                    return
                }
                let D = w.getAppState(),
                    Z = await A.description(O, {
                        isNonInteractiveSession: w.options.isNonInteractiveSession,
                        toolPermissionContext: D.toolPermissionContext,
                        tools: w.options.tools
                    });
                if (M.resolveIfAborted(X)) return;
                switch (W.behavior) {
                    case "deny": {
                        if (Ou8({
                                tool: A,
                                input: O,
                                toolUseContext: w,
                                messageId: M.messageId,
                                toolUseID: j
                            }, {
                                decision: "reject",
                                source: "config"
                            }), W.decisionReason?.type === "classifier" && W.decisionReason.classifier === "auto-mode") z({
                            toolName: A.name,
                            display: Z,
                            reason: W.decisionReason.reason ?? "",
                            timestamp: Date.now()
                        }), w.addNotification?.({
                            key: "auto-mode-denied",
                            priority: "immediate",
                            jsx: rn.createElement(rn.Fragment, null, rn.createElement(T, {
                                color: "error"
                            }, A.userFacingName(O).toLowerCase(), " denied by auto mode"), rn.createElement(T, {
                                dimColor: !0
                            }, " · /permissions"))
                        });
                        X(W);
                        return
                    }
                    case "ask": {
                        if (D.toolPermissionContext.awaitAutomatedChecksBeforeDialog) {
                            let f = await U_5({
                                ctx: M,
                                ...{},
                                updatedInput: W.updatedInput,
                                suggestions: W.suggestions,
                                permissionMode: D.toolPermissionContext.mode
                            });
                            if (f) {
                                X(f);
                                return
                            }
                        }
                        if (M.resolveIfAborted(X)) return;
                        let G = await l_5({
                            ctx: M,
                            description: Z,
                            ...{},
                            updatedInput: W.updatedInput,
                            suggestions: W.suggestions
                        });
                        if (G) {
                            X(G);
                            return
                        }
                        d_5({
                            ctx: M,
                            description: Z,
                            result: W,
                            awaitAutomatedChecksBeforeDialog: D.toolPermissionContext.awaitAutomatedChecksBeforeDialog,
                            bridgeCallbacks: D.replBridgePermissionCallbacks,
                            channelCallbacks: D.channelPermissionCallbacks
                        }, X);
                        return
                    }
                }
            }).catch((W) => {
                if (W instanceof sz || W instanceof r_) E(`Permission check threw ${W.constructor.name} for tool=${A.name}: ${W.message}`), M.logCancelled(), X(M.cancelAndAbort(void 0, !0));
                else j6(W), X(M.cancelAndAbort(void 0, !0))
            }).finally(() => {
                _t(J, j)
            })
        })
    }, _[0] = z, _[1] = K, _[2] = q, _[3] = Y;
    else Y = _[3];
    return Y
}
// @from(Ln 537200, Col 4)
rn
// @from(Ln 537200, Col 8)
i_5
// @from(Ln 537201, Col 4)
r_5 = L(() => {
    o6();
    eG();
    i_8();
    g6();
    MT();
    K8();
    m8();
    U8();
    g$();
    Q_5();
    c_5();
    n_5();
    xz8();
    wu8();
    rn = K6(P6(), 1);
    i_5 = EzA
})
// @from(Ln 537219, Col 4)
o_5 = L(() => {
    O2();
    gq();
    U8();
    _7();
    Sq()
})
// @from(Ln 537227, Col 0)
function a_5(q) {
    let K = q.toLowerCase();
    return /\b(wtf|wth|ffs|omfg|shit(ty|tiest)?|dumbass|horrible|awful|piss(ed|ing)? off|piece of (shit|crap|junk)|what the (fuck|hell)|fucking? (broken|useless|terrible|awful|horrible)|fuck you|screw (this|you)|so frustrating|this sucks|damn it)\b/.test(K)
}
// @from(Ln 537232, Col 0)
function s_5(q) {
    let K = q.toLowerCase().trim();
    if (K === "continue") return !0;
    return /\b(keep going|go on)\b/.test(K)
}
// @from(Ln 537241, Col 0)
function t_5(q, K, _, z, Y, A, O) {
    let w = yzA();
    jp6(w);
    let $ = typeof q === "string" ? q : q.find((M) => M.type === "text")?.text || "",
        j = typeof q === "string" ? q : q.findLast((M) => M.type === "text")?.text || "";
    if (j) Xz("user_prompt", {
        prompt_length: String(j.length),
        prompt: NS8(j),
        "prompt.id": w
    });
    let H = a_5($),
        J = s_5($);
    if (d("tengu_input_prompt", {
            is_negative: H,
            is_keep_going: J
        }), K.length > 0) {
        let M = typeof q === "string" ? q.trim() ? [{
            type: "text",
            text: q
        }] : [] : q;
        return {
            messages: [t8({
                content: [...M, ...K],
                uuid: Y,
                imagePasteIds: _.length > 0 ? _ : void 0,
                permissionMode: A,
                isMeta: O || void 0
            }), ...z],
            shouldQuery: !0
        }
    }
    return {
        messages: [t8({
            content: q,
            uuid: Y,
            permissionMode: A,
            isMeta: O || void 0
        }), ...z],
        shouldQuery: !0
    }
}
// @from(Ln 537282, Col 4)
e_5 = L(() => {
    y8();
    C8();
    _7();
    uf()
})
// @from(Ln 537289, Col 0)
function WY8(q) {
    let K = s(8),
        {
            input: _,
            progress: z,
            verbose: Y
        } = q,
        A = `<bash-input>${_}</bash-input>`,
        O;
    if (K[0] !== A) O = zt8.default.createElement(ag8, {
        addMargin: !1,
        param: {
            text: A,
            type: "text"
        }
    }), K[0] = A, K[1] = O;
    else O = K[1];
    let w;
    if (K[2] !== z || K[3] !== Y) w = z ? zt8.default.createElement(gC6, {
        fullOutput: z.fullOutput,
        output: z.output,
        elapsedTimeSeconds: z.elapsedTimeSeconds,
        totalLines: z.totalLines,
        verbose: Y
    }) : KK.renderToolUseProgressMessage?.([], {
        verbose: Y,
        tools: [],
        terminalSize: void 0
    }), K[2] = z, K[3] = Y, K[4] = w;
    else w = K[4];
    let $;
    if (K[5] !== O || K[6] !== w) $ = zt8.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, O, w), K[5] = O, K[6] = w, K[7] = $;
    else $ = K[7];
    return $
}
// @from(Ln 537327, Col 4)
zt8
// @from(Ln 537328, Col 4)
hP7 = L(() => {
    o6();
    g6();
    AZ();
    Pq7();
    wg8();
    zt8 = K6(P6(), 1)
})
// @from(Ln 537337, Col 0)
function qz5() {
    return v7().defaultShell ?? "bash"
}
// @from(Ln 537340, Col 4)
Kz5 = L(() => {
    a1()
})
// @from(Ln 537343, Col 4)
zz5 = {}
// @from(Ln 537350, Col 0)
async function LzA(q, K, _, z) {
    let Y = ly6() && qz5() === "powershell";
    d("tengu_input_bash", {
        powershell: Y
    });
    let A = t8({
            content: JS({
                inputString: `<bash-input>${q}</bash-input>`,
                precedingInputBlocks: K
            })
        }),
        O, w = _z5(),
        {
            emitToolProgress: $
        } = _;
    $?.({
        kind: "bash_mode_progress",
        toolUseId: w,
        input: q,
        progress: null,
        verbose: _.options.verbose
    }), z({
        jsx: on.createElement(WY8, {
            input: q,
            progress: null,
            verbose: _.options.verbose
        }),
        shouldHidePromptInput: !1
    });
    try {
        let j = {
                ..._,
                toolUseId: `${w}:inner`,
                setToolJSX: (G) => {
                    O = G?.jsx
                }
            },
            H = (G) => {
                $?.({
                    kind: "bash_mode_progress",
                    toolUseId: w,
                    input: q,
                    progress: G.data,
                    verbose: _.options.verbose
                }), z({
                    jsx: on.createElement(on.Fragment, null, on.createElement(WY8, {
                        input: q,
                        progress: G.data,
                        verbose: _.options.verbose
                    }), O),
                    shouldHidePromptInput: !1,
                    showSpinner: !1
                })
            },
            J = null;
        if (Y) J = (PI6(), B7(Qd8)).PowerShellTool;
        let X = J ?? KK,
            P = (J ? await J.call({
                command: q,
                dangerouslyDisableSandbox: !0
            }, j, void 0, void 0, H) : await KK.call({
                command: q,
                dangerouslyDisableSandbox: !0
            }, j, void 0, void 0, H)).data;
        if (!P) throw Error("No result received from shell command");
        let W = P.stderr,
            D = await zL6(X, {
                ...P,
                stderr: ""
            }, _z5()),
            Z = typeof D.content === "string" ? D.content : fJ(P.stdout);
        return {
            messages: [zu(), A, t8({
                content: `<bash-stdout>${Z}</bash-stdout><bash-stderr>${fJ(W)}</bash-stderr>`
            })],
            shouldQuery: !1
        }
    } catch (j) {
        if (j instanceof JV) {
            if (j.interrupted) return {
                messages: [zu(), A, _e({
                    toolUse: !1
                })],
                shouldQuery: !1
            };
            return {
                messages: [zu(), A, t8({
                    content: `<bash-stdout>${fJ(j.stdout)}</bash-stdout><bash-stderr>${fJ(j.stderr)}</bash-stderr>`
                })],
                shouldQuery: !1
            }
        }
        return {
            messages: [zu(), A, t8({
                content: `<bash-stderr>Command failed: ${fJ(b6(j))}</bash-stderr>`
            })],
            shouldQuery: !1
        }
    } finally {
        $?.({
            kind: "clear",
            toolUseId: w
        }), z(null)
    }
}
// @from(Ln 537455, Col 4)
on
// @from(Ln 537456, Col 4)
Yz5 = L(() => {
    hP7();
    AZ();
    C8();
    m8();
    _7();
    Kz5();
    uK6();
    ND();
    on = K6(P6(), 1)
})
// @from(Ln 537470, Col 0)
async function At8({
    input: q,
    preExpansionInput: K,
    mode: _,
    setToolJSX: z,
    context: Y,
    pastedContents: A,
    ideSelection: O,
    messages: w,
    setUserInputOnProcessing: $,
    uuid: j,
    isAlreadyProcessing: H,
    querySource: J,
    canUseTool: X,
    skipSlashCommands: M,
    bridgeOrigin: P,
    isMeta: W,
    skipAttachments: D,
    shouldQuery: Z
}) {
    let G = typeof q === "string" ? q : null;
    if (_ === "prompt" && G !== null && !W) $?.(G);
    Y9("query_process_user_input_base_start");
    let f = Y.getAppState(),
        v = await RzA(q, _, z, Y, A, O, w, j, H, J, X, f.toolPermissionContext.mode, M, P, W, D, K);
    if (Y9("query_process_user_input_base_end"), Z === !1) v.shouldQuery = !1;
    if (!v.shouldQuery) return v;
    Y9("query_hooks_start");
    let V = qu(q) || "",
        k;
    for await (let N of Tz8(V, f.toolPermissionContext.mode, Y, Y.requestPrompt)) {
        if (N.message?.type === "progress") continue;
        if (N.blockingError) {
            let R = YJ7(N.blockingError);
            return {
                messages: [eO(`${R}

Original prompt: ${q}`, "warning")],
                shouldQuery: !1,
                allowedTools: v.allowedTools
            }
        }
        if (N.preventContinuation) {
            let R = N.stopReason ? `Operation stopped by hook: ${N.stopReason}` : "Operation stopped by hook";
            return v.messages.push(t8({
                content: R
            })), v.shouldQuery = !1, v
        }
        if (N.sessionTitle) k = N.sessionTitle;
        if (N.additionalContexts && N.additionalContexts.length > 0) v.messages.push(Y4({
            type: "hook_additional_context",
            content: N.additionalContexts,
            hookName: "UserPromptSubmit",
            toolUseID: `hook-${hzA()}`,
            hookEvent: "UserPromptSubmit"
        }));
        if (N.message) switch (N.message.attachment.type) {
            case "hook_success":
                if (!N.message.attachment.content) break;
                v.messages.push(N.message);
                break;
            default:
                v.messages.push(N.message);
                break
        }
    }
    if (k) await Ma8(k);
    return Y9("query_hooks_end"), v
}
// @from(Ln 537539, Col 0)
async function RzA(q, K, _, z, Y, A, O, w, $, j, H, J, X, M, P, W, D) {
    let Z = null,
        G = [],
        f = [],
        v = vO(z.options.mainLoopModel),
        V = q;
    if (typeof q === "string") Z = q;
    else if (q.length > 0) {
        Y9("query_image_processing_start");
        let g = [];
        for (let n of q)
            if (n.type === "image") {
                let l = await I24(n, v);
                if (l.dimensions) {
                    let z6 = GE6(l.dimensions);
                    if (z6) f.push(z6)
                }
                g.push(l.block)
            } else g.push(n);
        V = g, Y9("query_image_processing_end");
        let c = g.at(-1);
        if (c?.type === "text") Z = c.text, G = g.slice(0, -1);
        else G = g
    }
    if (Z === null && K !== "prompt") throw Error(`Mode: ${K} requires a string input.`);
    let k = Y ? Object.values(Y).filter(dH6) : [],
        N = k.map((g) => g.id),
        R = Y ? await Fq5(Y, z.setAppState) : new Map;
    Y9("query_pasted_image_processing_start");
    let h = await Promise.all(k.map(async (g) => {
            return d("tengu_pasted_image_resize_attempt", {
                original_size_bytes: g.content.length
            }), {
                resized: await sE({
                    data: g.content,
                    mediaType: g.mediaType,
                    limits: v
                }),
                originalDimensions: g.dimensions,
                sourcePath: g.sourcePath ?? R.get(g.id)
            }
        })),
        C = [];
    for (let {
            resized: g,
            originalDimensions: c,
            sourcePath: n
        }
        of h) {
        if (g.dimensions) {
            let l = GE6(g.dimensions, n);
            if (l) f.push(l)
        } else if (c) {
            let l = GE6(c, n);
            if (l) f.push(l)
        } else if (n) f.push(`[Image source: ${n}]`);
        C.push(g.block)
    }
    Y9("query_pasted_image_processing_end");
    let x = X,
        B = z,
        m = Z;
    if (M && Z !== null && Z.startsWith("/")) {
        let g = HU8(Z),
            c = g ? ll(g.commandName, z.options.commands) : void 0;
        if (c)
            if (PH7(c)) x = !1;
            else {
                let n = WH7(c);
                if (n) x = !1, m = Z.replace(/^\/\S+/, `/${n.name}`), B = {
                    ...z,
                    options: {
                        ...z.options,
                        commands: [n, ...z.options.commands]
                    }
                };
                else {
                    let l = `/${y_(c)} isn't available over Remote Control.`;
                    return {
                        messages: [t8({
                            content: Z,
                            uuid: w
                        }), kT(`<local-command-stdout>${l}</local-command-stdout>`)],
                        shouldQuery: !1,
                        resultText: l
                    }
                }
            }
    }
    if (hn() && K === "prompt" && !z.options.isNonInteractiveSession && Z !== null && !x && !Z.startsWith("/") && !z.getAppState().ultraplanSessionUrl && !z.getAppState().ultraplanLaunching && TlK(D ?? Z)) {
        d("tengu_ultraplan_keyword", {});
        let g = Fr8(Z).trim(),
            {
                processSlashCommand: c
            } = await Promise.resolve().then(() => (oK8(), rK8)),
            n = await c(`/ultraplan ${g}`, G, C, [], z, _, w, $, H);
        return Yt8(n, f)
    }
    if (Z !== null && K === "bash") {
        let {
            processBashCommand: g
        } = await Promise.resolve().then(() => (Yz5(), zz5));
        return Yt8(await g(Z, G, z, _), f)
    }
    let S = !W && (K !== "prompt" || x || !Z?.startsWith("/"));
    Y9("query_attachment_loading_start");
    let F = S ? await Ru8(Ob6(Z, z, A ?? null, [], O, j)) : [];
    if (Y9("query_attachment_loading_end"), m !== null && !x && m.startsWith("/")) {
        let {
            processSlashCommand: g
        } = await Promise.resolve().then(() => (oK8(), rK8)), c = await g(m, G, C, F, B, _, w, $, H);
        return Yt8(c, f)
    }
    if (Z !== null && K === "prompt") {
        let g = Z.trim(),
            c = F.find((n) => n.attachment.type === "agent_mention");
        if (c) {
            let n = `@agent-${c.attachment.agentType}`,
                l = g === n,
                z6 = g.startsWith(n) && !l;
            d("tengu_subagent_at_mention", {
                is_subagent_only: l,
                is_prefix: z6
            })
        }
    }
    let U = Yt8(t_5(V, C, N, F, w, J, P), f);
    if (K === "prompt" && !P && z.options.customSystemPrompt === void 0 && z.options.thinkingConfig?.type !== "disabled" && fJ7(z.options.mainLoopModel) && O?.some((g) => g.type === "assistant")) U.messages.push(t8({
        content: G85,
        isMeta: !0
    }));
    return U
}
// @from(Ln 537673, Col 0)
function Yt8(q, K) {
    if (K.length > 0) q.messages.push(t8({
        content: K.map((_) => ({
            type: "text",
            text: _
        })),
        isMeta: !0
    }));
    return q
}
// @from(Ln 537683, Col 4)
RP7 = L(() => {
    C8();
    _7();
    CA();
    sy();
    ZM();
    EJ6();
    K9();
    o_5();
    CI();
    Km6();
    _7();
    Jk();
    pM6();
    d_8();
    gr8();
    e_5()
})
// @from(Ln 537702, Col 0)
function SzA() {
    j5(0)
}
// @from(Ln 537705, Col 0)
async function Ot8(q) {
    let {
        helpers: K,
        queryGuard: _,
        isExternalLoading: z = !1,
        commands: Y,
        onInputChange: A,
        setPastedContents: O,
        setToolJSX: w,
        getToolUseContext: $,
        messages: j,
        mainLoopModel: H,
        ideSelection: J,
        setUserInputOnProcessing: X,
        setAbortController: M,
        onQuery: P,
        getAppState: W,
        setAppState: D,
        onBeforeQuery: Z,
        canUseTool: G,
        queuedCommands: f,
        uuid: v,
        skipSlashCommands: V
    } = q, {
        setCursorOffset: k,
        clearBuffer: N,
        resetHistory: R
    } = K;
    if (f?.length) {
        J38(), await Az5({
            queuedCommands: f,
            messages: j,
            mainLoopModel: H,
            ideSelection: J,
            querySource: q.querySource,
            commands: Y,
            queryGuard: _,
            setToolJSX: w,
            getToolUseContext: $,
            setUserInputOnProcessing: X,
            setAbortController: M,
            onQuery: P,
            getAppState: W,
            setAppState: D,
            onBeforeQuery: Z,
            resetHistory: R,
            canUseTool: G,
            onInputChange: A
        });
        return
    }
    let h = q.input ?? "",
        C = q.mode ?? "prompt",
        x = q.pastedContents ?? {},
        B = new Set(md(h).map((l) => l.id)),
        m = QC(x, (l) => l.type !== "image" || B.has(l.id)),
        S = Object.values(m).some(dH6);
    if (h.trim() === "") return;
    if (!V && ["exit", "quit", ":q", ":q!", ":wq", ":wq!"].includes(h.trim())) {
        if (Y.find((z6) => z6.name === "exit")) Ot8({
            ...q,
            input: "/exit"
        });
        else SzA();
        return
    }
    let F = RE6(h, m),
        U = md(h).filter((l) => m[l.id]?.type === "text"),
        g = U.length,
        c = U.reduce((l, z6) => l + (m[z6.id]?.content.length ?? 0), 0);
    if (d("tengu_paste_text", {
            pastedTextCount: g,
            pastedTextBytes: c
        }), !V && F.trim().startsWith("/")) {
        let l = F.trim(),
            z6 = l.indexOf(" "),
            A6 = z6 === -1 ? l.slice(1) : l.slice(1, z6),
            e = z6 === -1 ? "" : l.slice(z6 + 1).trim(),
            i = Y.find((O6) => O6.immediate && X66(O6) && (O6.name === A6 || O6.aliases?.includes(A6) || y_(O6) === A6));
        if (i && i.type === "local-jsx" && (_.isActive || z)) {
            d("tengu_immediate_command_executed", {
                commandName: i.name
            }), A(""), k(0), O({}), N();
            let O6 = $(j, [], F5(), H),
                J6 = !1,
                $6 = (o, _6) => {
                    if (J6 = !0, w({
                            jsx: null,
                            shouldHidePromptInput: !1,
                            clearLocalJSX: !0
                        }), o && _6?.display !== "skip" && q.addNotification) q.addNotification({
                        key: `immediate-${i.name}`,
                        text: o,
                        priority: "immediate"
                    });
                    if (_6?.nextInput)
                        if (_6.submitNextInput) Dj({
                            value: _6.nextInput,
                            mode: "prompt"
                        });
                        else A(_6.nextInput)
                },
                q6 = await (await i.load()).call($6, O6, e);
            if (q6 && !J6) w({
                jsx: q6,
                shouldHidePromptInput: !1,
                isLocalJSXCommand: !0,
                isImmediate: !0
            });
            return
        }
    }
    if (_.isActive || z) {
        if (C !== "prompt" && C !== "bash") return;
        if (q.hasInterruptibleToolInProgress) E(`[interrupt] Aborting current turn: streamMode=${q.streamMode}`), d("tengu_cancel", {
            source: "interrupt_on_submit",
            streamMode: q.streamMode
        }), q.abortController?.abort("interrupt");
        Dj({
            value: F.trim(),
            preExpansionValue: h.trim(),
            mode: C,
            pastedContents: S ? m : void 0,
            skipSlashCommands: V,
            uuid: v
        }), A(""), k(0), O({}), R(), N();
        return
    }
    J38(), await Az5({
        queuedCommands: [{
            value: F,
            preExpansionValue: h,
            mode: C,
            pastedContents: S ? m : void 0,
            skipSlashCommands: V,
            uuid: v
        }],
        messages: j,
        mainLoopModel: H,
        ideSelection: J,
        querySource: q.querySource,
        commands: Y,
        queryGuard: _,
        setToolJSX: w,
        getToolUseContext: $,
        setUserInputOnProcessing: X,
        setAbortController: M,
        onQuery: P,
        getAppState: W,
        setAppState: D,
        onBeforeQuery: Z,
        resetHistory: R,
        canUseTool: G,
        onInputChange: A
    })
}
// @from(Ln 537861, Col 0)
async function Az5(q) {
    let {
        messages: K,
        mainLoopModel: _,
        ideSelection: z,
        querySource: Y,
        queryGuard: A,
        setToolJSX: O,
        getToolUseContext: w,
        setUserInputOnProcessing: $,
        setAbortController: j,
        onQuery: H,
        getAppState: J,
        setAppState: X,
        onBeforeQuery: M,
        resetHistory: P,
        canUseTool: W,
        queuedCommands: D
    } = q, Z = F5();
    j(Z);

    function G() {
        return w(K, [], Z, _)
    }
    try {
        A.reserve(), Y9("query_process_user_input_start");
        let f = [],
            v = !1,
            V, k, N, R, h, C = D ?? [],
            x = C[0]?.workload,
            B = x !== void 0 && C.every((F) => F.workload === x) ? x : void 0,
            m = C[0]?.value,
            S = typeof m === "string" ? m : m ? s5(m, `
`) : "";
        await gV8(B, () => jx8(S, async () => {
            for (let F = 0; F < C.length; F++) {
                let U = C[F],
                    g = F === 0,
                    c = await At8({
                        input: U.value,
                        preExpansionInput: U.preExpansionValue,
                        mode: U.mode,
                        setToolJSX: O,
                        context: G(),
                        pastedContents: U.pastedContents,
                        messages: K,
                        setUserInputOnProcessing: g ? $ : void 0,
                        isAlreadyProcessing: !g,
                        querySource: Y,
                        canUseTool: W,
                        uuid: U.uuid,
                        ideSelection: g ? z : void 0,
                        skipSlashCommands: U.skipSlashCommands,
                        bridgeOrigin: U.bridgeOrigin,
                        isMeta: U.isMeta,
                        skipAttachments: !g
                    }),
                    n = U.origin ?? (U.mode === "task-notification" ? {
                        kind: "task-notification"
                    } : void 0);
                if (n) {
                    for (let l of c.messages)
                        if (l.type === "user") l.origin = n
                }
                if (f.push(...c.messages), g) v = c.shouldQuery, V = c.allowedTools, k = c.model, N = c.effort, R = c.nextInput, h = c.submitNextInput
            }
            if (Y9("query_process_user_input_end"), kO()) Y9("query_file_history_snapshot_start"), f.filter(IW6).forEach((F) => {
                IC6(() => J().fileHistory, (U) => X((g) => {
                    let c = bX6(g.fileHistory, U);
                    if (c === g.fileHistory) return g;
                    return {
                        ...g,
                        fileHistory: c
                    }
                }), F.uuid)
            }), Y9("query_file_history_snapshot_end");
            if (f.length) {
                P(), O({
                    jsx: null,
                    shouldHidePromptInput: !1,
                    clearLocalJSX: !0
                });
                let F = C[0],
                    U = F?.mode ?? "prompt",
                    g = F && typeof F.value === "string" ? F.value : void 0,
                    c = U === "prompt",
                    n = C.some((l) => l.stopHookActive) ? !0 : void 0;
                await H(f, Z, v, V ?? [], k ? Xn6(k, _) : _, c ? M : void 0, g, N, n)
            } else A.cancelReservation(), O({
                jsx: null,
                shouldHidePromptInput: !1,
                clearLocalJSX: !0
            }), P(), j(null), Uc();
            if (R)
                if (h) Dj({
                    value: R,
                    mode: "prompt"
                });
                else q.onInputChange(R)
        }))
    } finally {
        A.cancelReservation(), $(void 0), Uc()
    }
}
// @from(Ln 537965, Col 4)
Oz5 = L(() => {
    Xf6();
    C8();
    CA();
    aa8();
    II();
    x$();
    K8();
    cy();
    CY();
    b$();
    _7();
    Sq();
    RP7();
    pM6();
    Qc();
    m26()
})
// @from(Ln 537984, Col 0)
function wz5(q) {
    if (typeof q.value === "string") return q.value.trim().startsWith("/");
    for (let K of q.value)
        if (K.type === "text") return K.text.trim().startsWith("/");
    return !1
}
// @from(Ln 537991, Col 0)
function $z5({
    executeInput: q
}) {
    let K = (A) => A.agentId === void 0,
        _ = Lj6(K);
    if (!_) return {
        processed: !1
    };
    if (wz5(_) || _.mode === "bash") {
        let A = Ke6(K);
        return q([A]), {
            processed: !0
        }
    }
    let z = _.mode,
        Y = Ty6((A) => K(A) && !wz5(A) && A.mode === z);
    if (Y.length === 0) return {
        processed: !1
    };
    return q(Y), {
        processed: !0
    }
}
// @from(Ln 538014, Col 4)
jz5 = L(() => {
    b$()
})
// @from(Ln 538018, Col 0)
function Hz5({
    executeQueuedInput: q,
    hasActiveLocalJsxUI: K,
    queryGuard: _
}) {
    let z = DY8.useSyncExternalStore(_.subscribe, _.getSnapshot),
        Y = DY8.useSyncExternalStore(yj6, zR8);
    DY8.useEffect(() => {
        if (z) return;
        if (K) return;
        if (Y.length === 0) return;
        $z5({
            executeInput: q
        })
    }, [Y, z, q, K, _])
}
// @from(Ln 538034, Col 4)
DY8
// @from(Ln 538035, Col 4)
Jz5 = L(() => {
    b$();
    jz5();
    DY8 = K6(P6(), 1)
})
// @from(Ln 538041, Col 0)
function Xz5({
    isLoading: q,
    onSubmitMessage: K
}) {
    let _ = Yc4(),
        z = Lz6.useMemo(() => _.subscribe.bind(_), [_]),
        Y = Lz6.useCallback(() => _.revision, [_]),
        A = Lz6.useSyncExternalStore(z, Y);
    Lz6.useEffect(() => {
        if (q) return;
        let O = _.poll();
        if (O) K(O.content)
    }, [q, A, _, K])
}
// @from(Ln 538055, Col 4)
Lz6
// @from(Ln 538056, Col 4)
Mz5 = L(() => {
    Ka1();
    Lz6 = K6(P6(), 1)
})
// @from(Ln 538061, Col 0)
function wt8(q, K) {
    if (q && K && K.length > 0) return j2([...q, ...K], "name");
    return q || []
}
// @from(Ln 538066, Col 0)
function Wz5(q, K) {
    return Pz5.useMemo(() => wt8(q, K), [q, K])
}
// @from(Ln 538069, Col 4)
Pz5
// @from(Ln 538070, Col 4)
Dz5 = L(() => {
    tI();
    Pz5 = K6(P6(), 1)
})
// @from(Ln 538075, Col 0)
function SP7(q, K) {
    return Zz5.useMemo(() => {
        if (K.length > 0) return j2([...q, ...K], "name");
        return q
    }, [q, K])
}
// @from(Ln 538081, Col 4)
Zz5
// @from(Ln 538082, Col 4)
fz5 = L(() => {
    tI();
    Zz5 = K6(P6(), 1)
})
// @from(Ln 538088, Col 0)
function mzA(q) {
    let K = q?.stabilityThreshold ?? CzA,
        _ = q?.pollInterval ?? bzA,
        z = q?.reloadDebounce ?? IzA,
        Y = q?.chokidarInterval ?? xzA,
        A = l5(),
        O = To8.subscribe(() => A.emit()),
        w = null,
        $ = null,
        j = new Set,
        H = !1,
        J = !1,
        X = null,
        M = null;
    async function P() {
        if (H || J) return;
        if (H = !0, !X) X = hyK(() => {
            $t(), A.emit()
        });
        let G = await BzA();
        if (G.length === 0) return;
        E(`Watching for changes in skill/command directories: ${G.join(", ")}...`), w = oa.watch(G, {
            persistent: !0,
            ignoreInitial: !0,
            depth: 2,
            awaitWriteFinish: {
                stabilityThreshold: K,
                pollInterval: _
            },
            ignored: (v, V) => {
                if (V && !V.isFile() && !V.isDirectory()) return !0;
                return v.split(/[/\\]/).some((k) => k === ".git")
            },
            ignorePermissionErrors: !0,
            usePolling: uzA,
            interval: Y,
            atomic: !0
        }), w.on("add", D), w.on("change", D), w.on("unlink", D);
        let f = w;
        await new Promise((v) => f.once("ready", () => v())), M = eq(async () => {
            await W()
        })
    }

    function W() {
        if (J = !0, M) M(), M = null;
        if (X) X(), X = null;
        let G = Promise.resolve();
        if (w) G = w.close(), w = null;
        if ($) clearTimeout($), $ = null;
        return j.clear(), O(), A.clear(), G
    }

    function D(G) {
        E(`Detected skill change: ${G}`), d("tengu_skill_file_changed", {
            source: "chokidar"
        }), Z(G)
    }

    function Z(G) {
        if (j.add(G), $) clearTimeout($);
        $ = setTimeout(async () => {
            $ = null;
            let f = [...j];
            j.clear();
            let v = await KK6("skills", f[0]);
            if (UE6(v)) {
                E(`ConfigChange hook blocked skill reload (${f.length} paths)`);
                return
            }
            rc8(), On(), EI6(), A.emit()
        }, z)
    }
    return {
        initialize: P,
        dispose: W,
        subscribe: A.subscribe
    }
}
// @from(Ln 538167, Col 0)
async function BzA() {
    let q = V8(),
        K = [],
        _ = g38("userSettings", "skills");
    if (_) try {
        await q.stat(_), K.push(_)
    } catch {}
    let z = g38("userSettings", "commands");
    if (z) try {
        await q.stat(z), K.push(z)
    } catch {}
    let Y = g38("projectSettings", "skills");
    if (Y) try {
        let O = ZY8.resolve(Y);
        await q.stat(O), K.push(O)
    } catch {}
    let A = g38("projectSettings", "commands");
    if (A) try {
        let O = ZY8.resolve(A);
        await q.stat(O), K.push(O)
    } catch {}
    for (let O of tG()) {
        let w = ZY8.join(O, ".claude", "skills");
        try {
            await q.stat(w), K.push(w)
        } catch {}
    }
    return K
}
// @from(Ln 538196, Col 4)
CzA = 1000
// @from(Ln 538197, Col 4)
bzA = 500
// @from(Ln 538198, Col 4)
IzA = 300
// @from(Ln 538199, Col 4)
xzA = 2000
// @from(Ln 538200, Col 4)
uzA
// @from(Ln 538200, Col 9)
Em6
// @from(Ln 538201, Col 4)
$t8 = L(() => {
    AE6();
    y8();
    CA();
    C8();
    ol();
    ZM();
    R9();
    K8();
    Yq();
    K9();
    nH();
    kj7();
    uzA = typeof Bun < "u";
    Em6 = mzA()
})
// @from(Ln 538218, Col 0)
function Gz5(q, K) {
    let _ = ym6.useCallback(async () => {
        if (!q) return;
        try {
            On();
            let Y = await eD(q);
            K(Y)
        } catch (Y) {
            if (Y instanceof Error) j6(Y)
        }
    }, [q, K]);
    ym6.useEffect(() => Em6.subscribe(_), [_]);
    let z = ym6.useCallback(async () => {
        if (!q) return;
        try {
            $t();
            let Y = await eD(q);
            K(Y)
        } catch (Y) {
            if (Y instanceof Error) j6(Y)
        }
    }, [q, K]);
    ym6.useEffect(() => A$6(z), [z])
}
// @from(Ln 538242, Col 4)
ym6
// @from(Ln 538243, Col 4)
vz5 = L(() => {
    CA();
    B1();
    U8();
    $t8();
    ym6 = K6(P6(), 1)
})
// @from(Ln 538251, Col 0)
function pzA(q, K, _) {
    let z = new Set(K.plugins.map((O) => O.name)),
        Y = `@${_}`,
        A = [];
    for (let O of Object.keys(q.plugins)) {
        if (!O.endsWith(Y)) continue;
        let w = O.slice(0, -Y.length);
        if (!z.has(w)) A.push(O)
    }
    return A
}
// @from(Ln 538262, Col 0)
async function jt8() {
    await AFK();
    let q = OZ(),
        K = xx6(),
        _ = await O56(),
        z = [];
    for (let Y of Object.keys(_)) try {
        let A = await xf(Y);
        if (!A.forceRemoveDeletedPlugins) continue;
        let O = pzA(q, A, Y);
        for (let w of O) {
            if (w in K) continue;
            let $ = q.plugins[w] ?? [];
            if (!$.some((H) => H.scope === "user" || H.scope === "project" || H.scope === "local")) continue;
            for (let H of $) {
                let {
                    scope: J
                } = H;
                if (J !== "user" && J !== "project" && J !== "local") continue;
                try {
                    await ie(w, J)
                } catch (X) {
                    E(`Failed to auto-uninstall delisted plugin ${w} from ${J}: ${b6(X)}`, {
                        level: "error"
                    })
                }
            }
            await OFK(w), z.push(w)
        }
    } catch (A) {
        E(`Failed to check for delisted plugins in "${Y}": ${b6(A)}`, {
            level: "warn"
        })
    }
    return z
}
// @from(Ln 538298, Col 4)
CP7 = L(() => {
    Ix6();
    K8();
    m8();
    yD();
    m$();
    di8()
})
// @from(Ln 538307, Col 0)
function Ht8({
    enabled: q = !0
} = {}) {
    let K = R7(),
        _ = M8((A) => A.plugins.needsRefresh),
        {
            addNotification: z
        } = EK(),
        Y = fY8.useCallback(async () => {
            try {
                let {
                    enabled: A,
                    disabled: O,
                    errors: w
                } = await sW();
                await jt8();
                let $ = xx6();
                if (Object.keys($).length > 0) z({
                    key: "plugin-delisted-flagged",
                    text: "Plugins flagged. Check /plugins",
                    color: "warning",
                    priority: "high"
                });
                let j = [],
                    H = [];
                try {
                    j = await iM6()
                } catch (D) {
                    let Z = D instanceof Error ? D.message : String(D);
                    w.push({
                        type: "generic-error",
                        source: "plugin-commands",
                        error: `Failed to load plugin commands: ${Z}`
                    })
                }
                try {
                    H = await D88()
                } catch (D) {
                    let Z = D instanceof Error ? D.message : String(D);
                    w.push({
                        type: "generic-error",
                        source: "plugin-agents",
                        error: `Failed to load plugin agents: ${Z}`
                    })
                }
                try {
                    await pc()
                } catch (D) {
                    let Z = D instanceof Error ? D.message : String(D);
                    w.push({
                        type: "generic-error",
                        source: "plugin-hooks",
                        error: `Failed to load plugin hooks: ${Z}`
                    })
                }
                let X = (await Promise.all(A.map(async (D) => {
                        if (D.mcpServers) return Object.keys(D.mcpServers).length;
                        let Z = await yl(D, w);
                        if (Z) D.mcpServers = Z;
                        return Z ? Object.keys(Z).length : 0
                    }))).reduce((D, Z) => D + Z, 0),
                    P = (await Promise.all(A.map(async (D) => {
                        if (D.lspServers) return Object.keys(D.lspServers).length;
                        let Z = await $M6(D, w);
                        if (Z) D.lspServers = Z;
                        return Z ? Object.keys(Z).length : 0
                    }))).reduce((D, Z) => D + Z, 0);
                EU8(), K((D) => {
                    let Z = D.plugins.errors.filter((V) => V.source === "lsp-manager" || V.source.startsWith("plugin:")),
                        G = new Set(w.map((V) => V.type === "generic-error" ? `generic-error:${V.source}:${V.error}` : `${V.type}:${V.source}`)),
                        v = [...Z.filter((V) => {
                            let k = V.type === "generic-error" ? `generic-error:${V.source}:${V.error}` : `${V.type}:${V.source}`;
                            return !G.has(k)
                        }), ...w];
                    return {
                        ...D,
                        plugins: {
                            ...D.plugins,
                            enabled: A,
                            disabled: O,
                            commands: j,
                            errors: v
                        }
                    }
                }), E(`Loaded plugins - Enabled: ${A.length}, Disabled: ${O.length}, Commands: ${j.length}, Agents: ${H.length}, Errors: ${w.length}`);
                let W = A.reduce((D, Z) => {
                    if (!Z.hooksConfig) return D;
                    return D + Object.values(Z.hooksConfig).reduce((G, f) => G + (f?.reduce((v, V) => v + V.hooks.length, 0) ?? 0), 0)
                }, 0);
                return {
                    enabled_count: A.length,
                    disabled_count: O.length,
                    inline_count: w7(A, (D) => D.source.endsWith("@inline")),
                    marketplace_count: w7(A, (D) => !D.source.endsWith("@inline")),
                    error_count: w.length,
                    skill_count: j.length,
                    agent_count: H.length,
                    hook_count: W,
                    mcp_count: X,
                    lsp_count: P,
                    ant_enabled_names: void 0
                }
            } catch (A) {
                let O = r1(A);
                return j6(O), E(`Error loading plugins: ${A}`), K((w) => {
                    let $ = w.plugins.errors.filter((H) => H.source === "lsp-manager" || H.source.startsWith("plugin:")),
                        j = {
                            type: "generic-error",
                            source: "plugin-system",
                            error: O.message
                        };
                    return {
                        ...w,
                        plugins: {
                            ...w.plugins,
                            enabled: [],
                            disabled: [],
                            commands: [],
                            errors: [...$, j]
                        }
                    }
                }), {
                    enabled_count: 0,
                    disabled_count: 0,
                    inline_count: 0,
                    marketplace_count: 0,
                    error_count: 1,
                    skill_count: 0,
                    agent_count: 0,
                    hook_count: 0,
                    mcp_count: 0,
                    lsp_count: 0,
                    load_failed: !0,
                    ant_enabled_names: void 0
                }
            }
        }, [K, z]);
    fY8.useEffect(() => {
        if (!q) return;
        Y().then((A) => {
            let {
                ant_enabled_names: O,
                ...w
            } = A, $ = {
                ...w,
                has_custom_plugin_cache_dir: !!process.env.CLAUDE_CODE_PLUGIN_CACHE_DIR
            };
            d("tengu_plugins_loaded", {
                ...$,
                ...O !== void 0 && {
                    enabled_names: O
                }
            }), j1("info", "tengu_plugins_loaded", $)
        })
    }, [Y, q]), fY8.useEffect(() => {
        if (!q || !_) return;
        z({
            key: "plugin-reload-pending",
            text: "Plugins changed. Run /reload-plugins to activate.",
            color: "suggestion",
            priority: "low"
        })
    }, [q, _, z])
}
// @from(Ln 538471, Col 4)
fY8
// @from(Ln 538472, Col 4)
bP7 = L(() => {
    kY();
    C8();
    nl();
    N7();
    K8();
    VA();
    m8();
    U8();
    yb8();
    E38();
    HJ6();
    aK8();
    WX6();
    CP7();
    di8();
    vH();
    fY8 = K6(P6(), 1)
})
// @from(Ln 538492, Col 0)
function gzA(q, K) {
    let _ = K.manifest.userConfig ? ID(uH6(K)) : void 0,
        z = (Y) => {
            let A = fx(Y, K);
            if (_) A = I56(A, _);
            return o36(A).expanded
        };
    return {
        name: q.name,
        command: z(q.command),
        description: q.description,
        when: q.when,
        pluginName: K.name,
        pluginRoot: K.path
    }
}
// @from(Ln 538509, Col 0)
function UzA(q) {
    let K = [];
    for (let _ of q) {
        let z = _.monitors;
        if (!z) continue;
        for (let Y of z) try {
            K.push(gzA(Y, _))
        } catch (A) {
            E(`plugin ${_.name}: failed to resolve monitor "${Y.name}": ${A}`, {
                level: "error"
            })
        }
    }
    return K
}
// @from(Ln 538525, Col 0)
function QzA(q, K, _ = IM6, z = xd8(bd8, K38)) {
    let Y = 0;

    function A() {
        if (Y === 0) return;
        _(q.description, `[plugin monitor "${q.name}" suppressed ${Y} events — output rate exceeded]`, K.id), Y = 0
    }
    return {
        onBatch: (O) => {
            if (!z.tryConsume()) {
                Y++;
                return
            }
            A(), _(q.description, O, K.id)
        },
        onExit: A
    }
}
// @from(Ln 538543, Col 0)
async function dzA(q, K) {
    if (Kt()) return;
    if (Z66()) {
        E(`Skipping plugin monitor ${q.pluginName}:${q.name} - workspace trust not accepted`);
        return
    }
    let _ = {},
        z = QzA(q, _),
        Y = Id8(z.onBatch),
        A = await al(q.command, K.abortController.signal, "bash", {
            preventCwdChanges: !0,
            shouldUseSandbox: !1,
            onStdout: Y.onData
        });
    return _.id = A.taskOutput.taskId, await Y_6({
        command: q.command,
        description: q.description,
        shellCommand: A,
        toolUseId: void 0,
        agentId: void 0,
        kind: "monitor"
    }, K), A.result.then(() => {
        Y.flush(!0), z.onExit()
    }), _.id
}
// @from(Ln 538568, Col 0)
async function IP7(q, K, _, z = dzA, Y = FzA) {
    if (!KF()) return;
    if (I7()) return;
    for (let A of UzA(q)) {
        if (!K(A)) continue;
        let O = `${A.pluginName}:${A.name}`;
        if (Y.has(O)) continue;
        Y.add(O);
        try {
            if (await z(A, _) === void 0) Y.delete(O)
        } catch (w) {
            Y.delete(O), E(`plugin monitor ${O}: failed to arm: ${w}`, {
                level: "error"
            })
        }
    }
}
// @from(Ln 538585, Col 4)
FzA
// @from(Ln 538586, Col 4)
Tz5 = L(() => {
    y8();
    pl();
    p37();
    zt();
    K8();
    Bc();
    K9();
    $G();
    Gx();
    FzA = new Set
})
// @from(Ln 538599, Col 0)
function kz5({
    enabled: q
}) {
    let K = H9(),
        _ = R7(),
        z = EX(),
        Y = M8((A) => A.plugins.enabled);
    Vz5.useEffect(() => {
        if (!q) return;
        let A = () => ({
            abortController: new AbortController,
            taskRegistry: z
        });
        return IP7(Y, (O) => O.when === "always", A()), sn1.subscribe((O) => {
            IP7(K.getState().plugins.enabled, (w) => w.when === `on-skill-invoke:${O}`, A())
        })
    }, [q, Y, K, _, z])
}
// @from(Ln 538617, Col 4)
Vz5
// @from(Ln 538618, Col 4)
Nz5 = L(() => {
    N7();
    $S();
    Tz5();
    Ih6();
    Vz5 = K6(P6(), 1)
})
// @from(Ln 538626, Col 0)
function Ez5() {
    let q = s(14),
        K = M8(czA);
    if (!K) return null;
    let _;
    if (q[0] !== K.identity.color) _ = KG(K.identity.color), q[0] = K.identity.color, q[1] = _;
    else _ = q[1];
    let z = _,
        Y;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) Y = mG.createElement(T, null, "Viewing "), q[2] = Y;
    else Y = q[2];
    let A;
    if (q[3] !== z || q[4] !== K.identity.agentName) A = mG.createElement(T, {
        color: z,
        bold: !0
    }, "@", K.identity.agentName), q[3] = z, q[4] = K.identity.agentName, q[5] = A;
    else A = q[5];
    let O;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) O = mG.createElement(T, {
        dimColor: !0
    }, " · ", mG.createElement(A8, {
        chord: "escape",
        action: "return",
        format: {
            keyCase: "lower"
        }
    })), q[6] = O;
    else O = q[6];
    let w;
    if (q[7] !== A) w = mG.createElement(u, null, Y, A, O), q[7] = A, q[8] = w;
    else w = q[8];
    let $;
    if (q[9] !== K.prompt) $ = mG.createElement(T, {
        dimColor: !0
    }, K.prompt), q[9] = K.prompt, q[10] = $;
    else $ = q[10];
    let j;
    if (q[11] !== w || q[12] !== $) j = mG.createElement(zG, null, mG.createElement(u, {
        flexDirection: "column",
        marginBottom: 1
    }, w, $)), q[11] = w, q[12] = $, q[13] = j;
    else j = q[13];
    return j
}
// @from(Ln 538671, Col 0)
function czA(q) {
    return dp(q)
}
// @from(Ln 538674, Col 4)
mG
// @from(Ln 538675, Col 4)
yz5 = L(() => {
    o6();
    g6();
    N7();
    kh6();
    pt();
    u7();
    f96();
    mG = K6(P6(), 1)
})
// @from(Ln 538686, Col 0)
function Lz5(q, K) {
    let _ = GY8.useRef(!1),
        z = GY8.useRef(null);
    GY8.useEffect(() => {
        let Y = ky(q);
        if (z.current !== (Y ?? null)) _.current = !1, z.current = Y || null, K({
            lineCount: 0,
            lineStart: void 0,
            text: void 0,
            filePath: void 0
        });
        if (_.current || !Y) return;
        let A = (O) => {
            if (O.selection?.start && O.selection?.end) {
                let {
                    start: w,
                    end: $
                } = O.selection, j = $.line - w.line + 1;
                if ($.character === 0) j--;
                let H = {
                    lineCount: j,
                    lineStart: w.line,
                    text: O.text,
                    filePath: O.filePath
                };
                K(H)
            }
        };
        Y.client.setNotificationHandler(lzA(), (O) => {
            if (z.current !== Y) return;
            try {
                let w = O.params;
                if (w.selection && w.selection.start && w.selection.end) A(w);
                else if (w.text !== void 0) A({
                    selection: null,
                    text: w.text,
                    filePath: w.filePath
                })
            } catch (w) {
                j6(w)
            }
        }), _.current = !0
    }, [q, K])
}
// @from(Ln 538730, Col 4)
GY8
// @from(Ln 538730, Col 9)
lzA
// @from(Ln 538731, Col 4)
hz5 = L(() => {
    U8();
    p7();
    kj();
    GY8 = K6(P6(), 1), lzA = C6(() => y.object({
        method: y.literal("selection_changed"),
        params: y.object({
            selection: y.object({
                start: y.object({
                    line: y.number(),
                    character: y.number()
                }),
                end: y.object({
                    line: y.number(),
                    character: y.number()
                })
            }).nullable().optional(),
            text: y.string().optional(),
            filePath: y.string().optional()
        })
    }))
})
// @from(Ln 538754, Col 0)
function Rz5(q, K) {
    switch (q.kind) {
        case "background_hint":
            return vY8.background_hint(q, K);
        case "bash_mode_progress":
            return vY8.bash_mode_progress(q, K);
        case "it2_setup_prompt":
            return vY8.it2_setup_prompt(q, K);
        case "computer_use_approval":
            return vY8.computer_use_approval(q, K);
        case "agent_progress":
            return vY8.agent_progress(q, K);
        default: {
            let _ = q;
            return null
        }
    }
}
// @from(Ln 538772, Col 4)
TY8
// @from(Ln 538772, Col 9)
vY8
// @from(Ln 538773, Col 4)
Sz5 = L(() => {
    hP7();
    FK8();
    $K8();
    TY8 = K6(P6(), 1), vY8 = {
        background_hint: () => TY8.createElement(G96, null),
        bash_mode_progress: (q) => TY8.createElement(WY8, {
            input: q.input,
            progress: q.progress,
            verbose: q.verbose
        }),
        agent_progress: (q, {
            tools: K,
            verbose: _
        }) => x96(q.progressMessages, {
            tools: K,
            verbose: _
        }),
        it2_setup_prompt: () => null,
        computer_use_approval: () => null
    }
})
// @from(Ln 538795, Col 4)
Cz5 = L(() => {
    y8();
    sR()
})
// @from(Ln 538799, Col 4)
bz5 = L(() => {
    y8();
    Cz5();
    sR();
    K8();
    Q4();
    sC();
    pK();
    U8()
})
// @from(Ln 538810, Col 0)
function nzA() {
    return {
        fileContentCache: new Map,
        turnBaselines: new Map,
        dirtyAttributions: new Map,
        gitStatusInFlight: new Map,
        hooksRegistered: !1
    }
}
// @from(Ln 538819, Col 4)
PfH
// @from(Ln 538820, Col 4)
xP7 = L(() => {
    y8();
    BJ8();
    AZ();
    A58();
    Q56();
    rl();
    u$();
    DM6();
    R9();
    sR();
    K8();
    Q8();
    Q4();
    pK();
    Sq();
    bz5();
    g4();
    PfH = nzA()
})
// @from(Ln 538840, Col 4)
mz5 = {}
// @from(Ln 538859, Col 0)
function uz5() {
    if (aS.filePath !== null) return aS.filePath;
    return null
}
// @from(Ln 538864, Col 0)
function azA() {
    aS.filePath = null, aS.timestamp = 0
}
// @from(Ln 538868, Col 0)
function szA() {
    let q = I8(),
        K = m66(A7(), "projects"),
        _ = m66(K, AP(Y7()));
    try {
        let z = V8().readdirSync(_);
        return (typeof z[0] === "string" ? z : z.map((O) => O.name)).filter((O) => O.startsWith(q) && O.endsWith(".cast")).sort().map((O) => m66(_, O))
    } catch {
        return []
    }
}
// @from(Ln 538879, Col 0)
async function kY8() {
    let q = aS.filePath;
    if (!q || aS.timestamp === 0) return;
    let K = m66(A7(), "projects"),
        _ = m66(K, AP(Y7())),
        z = m66(_, `${I8()}-${aS.timestamp}.cast`);
    if (q === z) return;
    await VY8?.flush();
    let Y = Iz5(q),
        A = Iz5(z);
    try {
        await rzA(q, z), aS.filePath = z, E(`[asciicast] Renamed recording: ${Y} → ${A}`)
    } catch {
        E(`[asciicast] Failed to rename recording from ${Y} to ${A}`)
    }
}
// @from(Ln 538896, Col 0)
function xz5() {
    let q = process.stdout.columns || 80,
        K = process.stdout.rows || 24;
    return {
        cols: q,
        rows: K
    }
}
// @from(Ln 538904, Col 0)
async function tzA() {
    await VY8?.flush()
}
// @from(Ln 538908, Col 0)
function ezA() {
    let q = uz5();
    if (!q) return;
    let {
        cols: K,
        rows: _
    } = xz5(), z = performance.now(), Y = I6({
        version: 2,
        width: K,
        height: _,
        timestamp: Math.floor(Date.now() / 1000),
        env: {
            SHELL: process.env.SHELL || "",
            TERM: process.env.TERM || ""
        }
    });
    try {
        V8().mkdirSync(ozA(q))
    } catch {}
    V8().appendFileSync(q, Y + `
`, {
        mode: 384
    });
    let A = Promise.resolve(),
        O = bD6({
            writeFn(j) {
                let H = aS.filePath;
                if (!H) return;
                A = A.then(() => izA(H, j)).catch(() => {})
            },
            flushIntervalMs: 500,
            maxBufferSize: 50,
            maxBufferBytes: 10485760
        }),
        w = process.stdout.write.bind(process.stdout);
    process.stdout.write = function(j, H, J) {
        let X = (performance.now() - z) / 1000,
            M = typeof j === "string" ? j : Buffer.from(j).toString("utf-8");
        if (O.write(I6([X, "o", M]) + `
`), typeof H === "function") return w(j, H);
        return w(j, H, J)
    };

    function $() {
        let j = (performance.now() - z) / 1000,
            {
                cols: H,
                rows: J
            } = xz5();
        O.write(I6([j, "r", `${H}x${J}`]) + `
`)
    }
    process.stdout.on("resize", $), VY8 = {
        async flush() {
            O.flush(), await A
        },
        async dispose() {
            O.dispose(), await A, process.stdout.removeListener("resize", $), process.stdout.write = w
        }
    }, eq(async () => {
        await VY8?.dispose(), VY8 = null
    }), E(`[asciicast] Recording to ${q}`)
}
// @from(Ln 538971, Col 4)
aS
// @from(Ln 538971, Col 8)
VY8 = null
// @from(Ln 538972, Col 4)
NY8 = L(() => {
    y8();
    B1();
    R9();
    K8();
    Q8();
    Yq();
    b9();
    e8();
    aS = {
        filePath: null,
        timestamp: 0
    }
})
// @from(Ln 538990, Col 0)
function KYA(q) {
    for (let K = q.length - 1; K >= 0; K--) {
        let _ = q[K];
        if (_?.type !== "assistant") continue;
        let z = _.message.content.find((O) => O.type === "tool_use" && O.name === Vy);
        if (!z || z.type !== "tool_use") continue;
        let Y = z.input;
        if (Y === null || typeof Y !== "object") return [];
        let A = SR6().safeParse(Y.todos);
        return A.success ? A.data : []
    }
    return []
}
// @from(Ln 539004, Col 0)
function EY8(q, K) {
    if (q.fileHistorySnapshots && q.fileHistorySnapshots.length > 0) iF8(q.fileHistorySnapshots, (_) => {
        K((z) => ({
            ...z,
            fileHistory: _
        }))
    });
    if (!kJ() && q.messages && q.messages.length > 0) {
        let _ = KYA(q.messages);
        if (_.length > 0) {
            let z = I8();
            K((Y) => ({
                ...Y,
                todos: {
                    ...Y.todos,
                    [z]: _
                }
            }))
        }
    }
}
// @from(Ln 539026, Col 0)
function _YA(q) {
    return
}
// @from(Ln 539030, Col 0)
function yY8(q, K) {
    if (!q && !K) return;
    return {
        name: q ?? "",
        color: K === "default" ? void 0 : K
    }
}
// @from(Ln 539038, Col 0)
function _06(q, K, _) {
    if (K) return {
        agentDefinition: K,
        agentType: void 0
    };
    if (!q) return _m(void 0), {
        agentDefinition: void 0,
        agentType: void 0
    };
    let z = _.activeAgents.find((Y) => Y.agentType === q);
    if (!z) return E(`Resumed session had agent "${q}" but it is no longer available. Using default behavior.`), _m(void 0), {
        agentDefinition: void 0,
        agentType: void 0
    };
    if (_m(z.agentType), !qm() && z.model && z.model !== "inherit") kW(K5(z.model));
    return {
        agentDefinition: z,
        agentType: z.agentType
    }
}
// @from(Ln 539059, Col 0)
function zYA(q, K) {
    if (K || !q) return;
    let _ = yV(q);
    if (_ === "default" && q !== "default") return;
    if (_ === "plan" || _ === "bypassPermissions") return;
    if (_ === "default") return;
    if (_ === "auto") {
        let {
            isAutoModeGateEnabled: z
        } = (vX(), B7(P37)), {
            setAutoModeActive: Y
        } = (Kn(), B7(Pe));
        if (!z()) return;
        Y(!0)
    }
    return _
}
// @from(Ln 539076, Col 0)
async function YYA(q, K, _, z) {
    return z
}
// @from(Ln 539080, Col 0)
function LY8(q, K) {
    let _ = sO();
    if (_) {
        zL(_);
        return
    }
    if (!q) {
        if (q === null) return;
        if (!K || b8() === K) return;
        try {
            process.chdir(K)
        } catch {
            return
        }
        l$(K), dL(b8()), Lk(), nc(), aO.cache.clear?.();
        return
    }
    try {
        process.chdir(q.worktreePath)
    } catch {
        zL(null);
        return
    }
    l$(q.worktreePath), dL(b8()), fa8(q), Lk(), nc(), aO.cache.clear?.()
}