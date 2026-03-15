
// @from(Ln 333757, Col 0)
function kNY() {
    let A = process.env.ITERM_SESSION_ID;
    if (!A) return null;
    let q = A.indexOf(":");
    if (q === -1) return null;
    return A.slice(q + 1)
}
// @from(Ln 333764, Col 0)
class Xu8 {
    type = "iterm2";
    displayName = "iTerm2";
    supportsHideShow = !1;
    async isAvailable() {
        let A = V66();
        if (k(`[ITermBackend] isAvailable check: inITerm2=${A}`), !A) return k("[ITermBackend] isAvailable: false (not in iTerm2)"), !1;
        let q = await tc6();
        return k(`[ITermBackend] isAvailable: ${q} (it2 CLI ${q?"found":"not found"})`), q
    }
    async isRunningInside() {
        let A = V66();
        return k(`[ITermBackend] isRunningInside: ${A}`), A
    }
    async createTeammatePaneInSwarmView(A, q) {
        k(`[ITermBackend] createTeammatePaneInSwarmView called for ${A} with color ${q}`);
        let K = await NNY();
        try {
            let Y = !xi4;
            k(`[ITermBackend] Creating pane: isFirstTeammate=${Y}, existingPanes=${pN1.length}`);
            let z;
            if (Y) {
                let O = kNY();
                if (O) z = ["session", "split", "-v", "-s", O], k(`[ITermBackend] First split from leader session: ${O}`);
                else z = ["session", "split", "-v"], k("[ITermBackend] First split from active session (no leader ID)")
            } else {
                let O = pN1[pN1.length - 1];
                if (O) z = ["session", "split", "-s", O], k(`[ITermBackend] Subsequent split from teammate session: ${O}`);
                else z = ["session", "split"], k("[ITermBackend] Subsequent split from active session (no teammate ID)")
            }
            let _ = await Du8(z);
            if (_.code !== 0) throw Error(`Failed to create iTerm2 split pane: ${_.stderr}`);
            if (Y) xi4 = !0;
            let w = VNY(_.stdout);
            if (!w) throw Error(`Failed to parse session ID from split output: ${_.stdout}`);
            return k(`[ITermBackend] Created teammate pane for ${A}: ${w}`), pN1.push(w), {
                paneId: w,
                isFirstTeammate: Y
            }
        } finally {
            K()
        }
    }
    async sendCommandToPane(A, q, K) {
        let z = await Du8(A ? ["session", "run", "-s", A, q] : ["session", "run", q]);
        if (z.code !== 0) throw Error(`Failed to send command to iTerm2 pane ${A}: ${z.stderr}`)
    }
    async setPaneBorderColor(A, q, K) {}
    async setPaneTitle(A, q, K, Y) {}
    async enablePaneBorderStatus(A, q) {}
    async rebalancePanes(A, q) {
        k("[ITermBackend] Pane rebalancing not implemented for iTerm2")
    }
    async killPane(A, q) {
        return (await Du8(["session", "close", "-s", A])).code === 0
    }
    async hidePane(A, q) {
        return k("[ITermBackend] hidePane not supported in iTerm2"), !1
    }
    async showPane(A, q, K) {
        return k("[ITermBackend] showPane not supported in iTerm2"), !1
    }
}
// @from(Ln 333827, Col 4)
pN1
// @from(Ln 333827, Col 9)
xi4 = !1
// @from(Ln 333828, Col 4)
ui4
// @from(Ln 333829, Col 4)
Bi4 = E(() => {
    Eq();
    H1();
    ig();
    wh();
    pN1 = [], ui4 = Promise.resolve();
    Pu8(Xu8)
})
// @from(Ln 333837, Col 4)
pi4 = {}
// @from(Ln 333850, Col 0)
async function ENY() {
    if (Wu8) return;
    await Promise.resolve().then(() => (bi4(), Ii4)), await Promise.resolve().then(() => (Bi4(), mi4)), Wu8 = !0
}
// @from(Ln 333855, Col 0)
function Mu8(A) {
    Zu8 = A
}
// @from(Ln 333859, Col 0)
function Pu8(A) {
    k(`[registry] registerITermBackend called, class=${A?.name||"undefined"}`), Gu8 = A
}
// @from(Ln 333863, Col 0)
function dN1() {
    if (!Zu8) throw Error("TmuxBackend not registered. Import TmuxBackend.ts before using the registry.");
    return new Zu8
}
// @from(Ln 333868, Col 0)
function gi4() {
    if (!Gu8) throw Error("ITermBackend not registered. Import ITermBackend.ts before using the registry.");
    return new Gu8
}
// @from(Ln 333872, Col 0)
async function k66() {
    if (await ENY(), Oh) return k(`[BackendRegistry] Using cached backend: ${Oh.backend.type}`), Oh;
    k("[BackendRegistry] Starting backend detection...");
    let A = await yb(),
        q = V66();
    if (k(`[BackendRegistry] Environment: insideTmux=${A}, inITerm2=${q}`), A) {
        k("[BackendRegistry] Selected: tmux (running inside tmux session)");
        let Y = dN1();
        return gf6 = Y, Oh = {
            backend: Y,
            isNative: !0,
            needsIt2Setup: !1
        }, Oh
    }
    if (q) {
        if (Li4()) k("[BackendRegistry] User prefers tmux over iTerm2, skipping iTerm2 detection");
        else {
            let _ = await tc6();
            if (k(`[BackendRegistry] iTerm2 detected, it2 CLI available: ${_}`), _) {
                k("[BackendRegistry] Selected: iterm2 (native iTerm2 with it2 CLI)");
                let w = gi4();
                return gf6 = w, Oh = {
                    backend: w,
                    isNative: !0,
                    needsIt2Setup: !1
                }, Oh
            }
        }
        let z = await N66();
        if (k(`[BackendRegistry] it2 not available, tmux available: ${z}`), z) {
            k("[BackendRegistry] Selected: tmux (fallback in iTerm2, it2 setup recommended)");
            let _ = dN1();
            return gf6 = _, Oh = {
                backend: _,
                isNative: !1,
                needsIt2Setup: !0
            }, Oh
        }
        throw k("[BackendRegistry] ERROR: iTerm2 detected but no it2 CLI and no tmux"), Error("iTerm2 detected but it2 CLI not installed. Install it2 with: pip install it2")
    }
    let K = await N66();
    if (k(`[BackendRegistry] Not in tmux or iTerm2, tmux available: ${K}`), K) {
        k("[BackendRegistry] Selected: tmux (external session mode)");
        let Y = dN1();
        return gf6 = Y, Oh = {
            backend: Y,
            isNative: !1,
            needsIt2Setup: !1
        }, Oh
    }
    throw k("[BackendRegistry] ERROR: No pane backend available"), Error(yNY())
}
// @from(Ln 333925, Col 0)
function yNY() {
    switch (y8()) {
        case "macos":
            return `To use agent swarms, install tmux:
  brew install tmux
Then start a tmux session with: tmux new-session -s claude`;
        case "linux":
        case "wsl":
            return `To use agent swarms, install tmux:
  sudo apt install tmux    # Ubuntu/Debian
  sudo dnf install tmux    # Fedora/RHEL
Then start a tmux session with: tmux new-session -s claude`;
        case "windows":
            return `To use agent swarms, you need tmux which requires WSL (Windows Subsystem for Linux).
Install WSL first, then inside WSL run:
  sudo apt install tmux
Then start a tmux session with: tmux new-session -s claude`;
        default:
            return `To use agent swarms, install tmux using your system's package manager.
Then start a tmux session with: tmux new-session -s claude`
    }
}
// @from(Ln 333948, Col 0)
function fu8(A) {
    switch (A) {
        case "tmux":
            return dN1();
        case "iterm2":
            return gi4()
    }
}
// @from(Ln 333957, Col 0)
function Ff6() {
    return gf6
}
// @from(Ln 333961, Col 0)
function LNY() {
    return Al6()
}
// @from(Ln 333965, Col 0)
function Rb() {
    if (q7()) return k("[BackendRegistry] isInProcessEnabled: true (non-interactive session)"), !0;
    let A = LNY(),
        q;
    if (A === "in-process") q = !0;
    else if (A === "tmux") q = !1;
    else q = !uN1();
    return k(`[BackendRegistry] isInProcessEnabled: ${q} (mode=${A}, insideTmux=${uN1()})`), q
}
// @from(Ln 333975, Col 0)
function Tu8() {
    return Rb() ? "in-process" : "tmux"
}
// @from(Ln 333979, Col 0)
function Fi4() {
    if (!QN1) QN1 = Di4();
    return QN1
}
// @from(Ln 333983, Col 0)
async function RNY(A = !1) {
    if (A && Rb()) return k("[BackendRegistry] Using in-process executor"), Fi4();
    return k("[BackendRegistry] Using pane backend executor"), hNY()
}
// @from(Ln 333987, Col 0)
async function hNY() {
    if (!UN1) {
        let A = await k66();
        UN1 = vi4(A.backend), k(`[BackendRegistry] Created PaneBackendExecutor wrapping ${A.backend.type}`)
    }
    return UN1
}
// @from(Ln 333995, Col 0)
function SNY() {
    gf6 = null, Oh = null, QN1 = null, UN1 = null, Wu8 = !1
}
// @from(Ln 333998, Col 4)
gf6 = null
// @from(Ln 333999, Col 4)
Oh = null
// @from(Ln 334000, Col 4)
Wu8 = !1
// @from(Ln 334001, Col 4)
QN1 = null
// @from(Ln 334002, Col 4)
UN1 = null
// @from(Ln 334003, Col 4)
Zu8 = null
// @from(Ln 334004, Col 4)
Gu8 = null
// @from(Ln 334005, Col 4)
wh = E(() => {
    Xi4();
    Ni4();
    ig();
    H1();
    ju8();
    YK();
    Bf6();
    T1()
})
// @from(Ln 334015, Col 0)
async function ku8() {
    if (!vu8) vu8 = await k66();
    return vu8.backend
}
// @from(Ln 334020, Col 0)
function Pl(A) {
    let q = Nu8.get(A);
    if (q) return q;
    let K = s$[Vu8 % s$.length];
    return Nu8.set(A, K), Vu8++, K
}
// @from(Ln 334027, Col 0)
function Qi4() {
    Nu8.clear(), Vu8 = 0
}
// @from(Ln 334030, Col 0)
async function Ui4() {
    let {
        isInsideTmux: A
    } = await Promise.resolve().then(() => (ig(), Wi4));
    return A()
}
// @from(Ln 334036, Col 0)
async function di4(A, q) {
    return (await ku8()).createTeammatePaneInSwarmView(A, q)
}
// @from(Ln 334039, Col 0)
async function ci4(A, q = !1) {
    return (await ku8()).enablePaneBorderStatus(A, q)
}
// @from(Ln 334042, Col 0)
async function li4(A, q, K = !1) {
    return (await ku8()).sendCommandToPane(A, q, K)
}
// @from(Ln 334045, Col 4)
Nu8
// @from(Ln 334045, Col 9)
Vu8 = 0
// @from(Ln 334046, Col 4)
vu8 = null
// @from(Ln 334047, Col 4)
Kl6 = E(() => {
    H0();
    wh();
    Nu8 = new Map
})
// @from(Ln 334053, Col 0)
function ii4(A) {
    let q = A6(44),
        {
            onDone: K,
            tmuxAvailable: Y
        } = A,
        [z, _] = pf6.useState("initial"),
        [w, O] = pf6.useState(null),
        [$, H] = pf6.useState(null),
        j = IK(),
        J, M;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) J = () => {
        Vi4().then((U) => {
            O(U)
        })
    }, M = [], q[0] = J, q[1] = M;
    else J = q[0], M = q[1];
    pf6.useEffect(J, M);
    let D;
    if (q[2] !== K) D = () => {
        K("cancelled")
    }, q[2] = K, q[3] = D;
    else D = q[3];
    let X = D,
        P = z !== "installing" && z !== "verifying",
        W;
    if (q[4] !== P) W = {
        context: "Confirmation",
        isActive: P
    }, q[4] = P, q[5] = W;
    else W = q[5];
    D8("confirm:no", X, W);
    let Z;
    if (q[6] !== K || q[7] !== z) Z = (U, r) => {
        if (z === "api-instructions" && r.return) _("verifying"), $u8().then((e) => {
            if (e.success) Hu8(), _("success"), setTimeout(K, 1500, "installed");
            else H(e.error || "Verification failed"), _("failed")
        })
    }, q[6] = K, q[7] = z, q[8] = Z;
    else Z = q[8];
    jA(Z);
    let G;
    if (q[9] !== w) G = async function() {
        if (!w) {
            H("No Python package manager found (uvx, pipx, or pip)"), _("failed");
            return
        }
        _("installing");
        let r = await ki4(w);
        if (r.success) _("api-instructions");
        else H(r.error || "Installation failed"), _("install-failed")
    }, q[9] = w, q[10] = G;
    else G = q[10];
    let f = G,
        v;
    if (q[11] !== K) v = function() {
        yi4(!0), K("use-tmux")
    }, q[11] = K, q[12] = v;
    else v = q[12];
    let N = v,
        V, L, h, R, u, I, g, B;
    if (q[13] !== $ || q[14] !== f || q[15] !== N || q[16] !== K || q[17] !== w || q[18] !== z || q[19] !== Y) {
        let r = function() {
                let X6 = [{
                    label: "Install it2 now",
                    value: "install",
                    description: w ? `Uses ${w} to install the it2 CLI tool` : "Requires Python (uvx, pipx, or pip)"
                }];
                if (Y) X6.push({
                    label: "Use tmux instead",
                    value: "tmux",
                    description: "Opens teammates in a separate tmux session"
                });
                return X6.push({
                    label: "Cancel",
                    value: "cancel",
                    description: "Skip teammate spawning for now"
                }), q5.default.createElement(m, {
                    flexDirection: "column",
                    gap: 1
                }, q5.default.createElement(T, null, "To use native iTerm2 split panes for teammates, you need the", " ", q5.default.createElement(T, {
                    bold: !0
                }, "it2"), " CLI tool."), q5.default.createElement(T, {
                    dimColor: !0
                }, "This enables teammates to appear as split panes within your current window."), q5.default.createElement(m, {
                    marginTop: 1
                }, q5.default.createElement(T8, {
                    options: X6,
                    onChange: (z6) => {
                        A: switch (z6) {
                            case "install": {
                                f();
                                break A
                            }
                            case "tmux": {
                                N();
                                break A
                            }
                            case "cancel":
                                K("cancelled")
                        }
                    },
                    onCancel: () => K("cancelled")
                })))
            },
            e = function() {
                return q5.default.createElement(m, {
                    flexDirection: "column",
                    gap: 1
                }, q5.default.createElement(m, null, q5.default.createElement(Wq, null), q5.default.createElement(T, null, " Installing it2 using ", w, "…")), q5.default.createElement(T, {
                    dimColor: !0
                }, "This may take a moment."))
            },
            Y6 = function() {
                let X6 = [{
                    label: "Try again",
                    value: "retry",
                    description: "Retry the installation"
                }];
                if (Y) X6.push({
                    label: "Use tmux instead",
                    value: "tmux",
                    description: "Falls back to tmux for teammate panes"
                });
                return X6.push({
                    label: "Cancel",
                    value: "cancel",
                    description: "Skip teammate spawning for now"
                }), q5.default.createElement(m, {
                    flexDirection: "column",
                    gap: 1
                }, q5.default.createElement(T, {
                    color: "error"
                }, "Installation failed"), $ && q5.default.createElement(T, {
                    dimColor: !0
                }, $), q5.default.createElement(T, {
                    dimColor: !0
                }, "You can try installing manually:", " ", w === "uvx" ? "uv tool install it2" : w === "pipx" ? "pipx install it2" : "pip install --user it2"), q5.default.createElement(m, {
                    marginTop: 1
                }, q5.default.createElement(T8, {
                    options: X6,
                    onChange: (z6) => {
                        A: switch (z6) {
                            case "retry": {
                                f();
                                break A
                            }
                            case "tmux": {
                                N();
                                break A
                            }
                            case "cancel":
                                K("cancelled")
                        }
                    },
                    onCancel: () => K("cancelled")
                })))
            },
            H6 = function() {
                let X6 = Ei4();
                return q5.default.createElement(m, {
                    flexDirection: "column",
                    gap: 1
                }, q5.default.createElement(T, {
                    color: "success"
                }, "✓ it2 installed successfully"), q5.default.createElement(m, {
                    flexDirection: "column",
                    marginTop: 1
                }, X6.map(CNY)), q5.default.createElement(m, {
                    marginTop: 1
                }, q5.default.createElement(T, {
                    dimColor: !0
                }, "Press Enter when ready to verify…")))
            },
            J6 = function() {
                return q5.default.createElement(m, null, q5.default.createElement(Wq, null), q5.default.createElement(T, null, " Verifying it2 can communicate with iTerm2…"))
            },
            K6 = function() {
                return q5.default.createElement(m, {
                    flexDirection: "column"
                }, q5.default.createElement(T, {
                    color: "success"
                }, "✓ iTerm2 split pane support is ready"), q5.default.createElement(T, {
                    dimColor: !0
                }, "Teammates will now appear as split panes."))
            },
            s = function() {
                let X6 = [{
                    label: "Try again",
                    value: "retry",
                    description: "Verify the connection again"
                }];
                if (Y) X6.push({
                    label: "Use tmux instead",
                    value: "tmux",
                    description: "Falls back to tmux for teammate panes"
                });
                return X6.push({
                    label: "Cancel",
                    value: "cancel",
                    description: "Skip teammate spawning for now"
                }), q5.default.createElement(m, {
                    flexDirection: "column",
                    gap: 1
                }, q5.default.createElement(T, {
                    color: "error"
                }, "Verification failed"), $ && q5.default.createElement(T, {
                    dimColor: !0
                }, $), q5.default.createElement(T, null, "Make sure:"), q5.default.createElement(m, {
                    flexDirection: "column",
                    paddingLeft: 2
                }, q5.default.createElement(T, null, "• Python API is enabled in iTerm2 preferences"), q5.default.createElement(T, null, "• You may need to restart iTerm2 after enabling")), q5.default.createElement(m, {
                    marginTop: 1
                }, q5.default.createElement(T8, {
                    options: X6,
                    onChange: (z6) => {
                        A: switch (z6) {
                            case "retry": {
                                _("verifying"), $u8().then((N6) => {
                                    if (N6.success) Hu8(), _("success"), setTimeout(K, 1500, "installed");
                                    else H(N6.error || "Verification failed"), _("failed")
                                });
                                break A
                            }
                            case "tmux": {
                                N();
                                break A
                            }
                            case "cancel":
                                K("cancelled")
                        }
                    },
                    onCancel: () => K("cancelled")
                })))
            },
            U = () => {
                switch (z) {
                    case "initial":
                        return r();
                    case "installing":
                        return e();
                    case "install-failed":
                        return Y6();
                    case "api-instructions":
                        return H6();
                    case "verifying":
                        return J6();
                    case "success":
                        return K6();
                    case "failed":
                        return s();
                    default:
                        return null
                }
            };
        if (L = S3, g = "permission", V = m, B = "column", h = 1, R = 1, q[28] === Symbol.for("react.memo_cache_sentinel")) u = q5.default.createElement(T, {
            bold: !0,
            color: "permission"
        }, "iTerm2 Split Pane Setup"), q[28] = u;
        else u = q[28];
        I = U(), q[13] = $, q[14] = f, q[15] = N, q[16] = K, q[17] = w, q[18] = z, q[19] = Y, q[20] = V, q[21] = L, q[22] = h, q[23] = R, q[24] = u, q[25] = I, q[26] = g, q[27] = B
    } else V = q[20], L = q[21], h = q[22], R = q[23], u = q[24], I = q[25], g = q[26], B = q[27];
    let b;
    if (q[29] !== j || q[30] !== z) b = z !== "installing" && z !== "verifying" && z !== "success" && q5.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, j.pending ? q5.default.createElement(q5.default.Fragment, null, "Press ", j.keyName, " again to exit") : q5.default.createElement(q5.default.Fragment, null, "Esc to cancel")), q[29] = j, q[30] = z, q[31] = b;
    else b = q[31];
    let p;
    if (q[32] !== V || q[33] !== h || q[34] !== R || q[35] !== u || q[36] !== I || q[37] !== b || q[38] !== B) p = q5.default.createElement(V, {
        flexDirection: B,
        gap: h,
        paddingBottom: R
    }, u, I, b), q[32] = V, q[33] = h, q[34] = R, q[35] = u, q[36] = I, q[37] = b, q[38] = B, q[39] = p;
    else p = q[39];
    let Q;
    if (q[40] !== L || q[41] !== g || q[42] !== p) Q = q5.default.createElement(L, {
        color: g
    }, p), q[40] = L, q[41] = g, q[42] = p, q[43] = Q;
    else Q = q[43];
    return Q
}
// @from(Ln 334336, Col 0)
function CNY(A, q) {
    return q5.default.createElement(T, {
        key: q
    }, A)
}
// @from(Ln 334341, Col 4)
q5
// @from(Ln 334341, Col 8)
pf6
// @from(Ln 334342, Col 4)
ni4 = E(() => {
    e6();
    i6();
    PO();
    _7();
    o9();
    LO();
    FJ();
    ju8();
    q5 = t(P6(), 1), pf6 = t(P6(), 1)
})
// @from(Ln 334362, Col 0)
function ri4() {
    return wJ6[QA()]
}
// @from(Ln 334366, Col 0)
function yu8(A, q) {
    if (A === "inherit") return q ?? ri4();
    return A ?? ri4()
}
// @from(Ln 334370, Col 0)
async function uNY(A) {
    return (await z8(yZ, ["has-session", "-t", A])).code === 0
}
// @from(Ln 334373, Col 0)
async function mNY(A) {
    if (!await uNY(A)) {
        let K = await z8(yZ, ["new-session", "-d", "-s", A]);
        if (K.code !== 0) throw Error(`Failed to create tmux session '${A}': ${K.stderr||"Unknown error"}`)
    }
}
// @from(Ln 334380, Col 0)
function ai4(A) {
    return A.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()
}
// @from(Ln 334384, Col 0)
function Lu8(A) {
    return A.replace(/@/g, "-")
}
// @from(Ln 334388, Col 0)
function si4() {
    if (process.env[Df6]) return process.env[Df6];
    return rY() ? process.execPath : process.argv[1]
}
// @from(Ln 334393, Col 0)
function ti4(A) {
    let q = [],
        {
            planModeRequired: K,
            permissionMode: Y
        } = A || {};
    if (K);
    else if (Y === "bypassPermissions" || qA6()) q.push("--dangerously-skip-permissions");
    else if (Y === "acceptEdits") q.push("--permission-mode acceptEdits");
    else if (Y === "auto") q.push("--permission-mode auto");
    let z = HS();
    if (z) q.push(`--model ${j4([z])}`);
    let _ = kn();
    if (_) q.push(`--settings ${j4([_])}`);
    let w = AA6();
    for (let $ of w) q.push(`--plugin-dir ${j4([$])}`);
    let O = Qk6();
    if (O === !0) q.push("--chrome");
    else if (O === !1) q.push("--no-chrome");
    return q.join(" ")
}
// @from(Ln 334415, Col 0)
function ei4(A) {
    return Eu8(YG(), ai4(A))
}
// @from(Ln 334418, Col 0)
async function Kz6(A) {
    let q = Eu8(ei4(A), "config.json");
    try {
        let K = await INY(q, "utf-8");
        return i1(K)
    } catch (K) {
        if (K.code === "ENOENT") return null;
        return k(`[spawnTeammate] Failed to read team file for ${A}: ${_1(K)}`), null
    }
}
// @from(Ln 334428, Col 0)
async function Ru8(A, q) {
    let K = ei4(A);
    await bNY(K, {
        recursive: !0
    });
    let Y = Eu8(K, "config.json");
    await xNY(Y, B6(q, null, 2))
}
// @from(Ln 334436, Col 0)
async function hu8(A, q) {
    if (!q) return A;
    let K = await Kz6(q);
    if (!K) return A;
    let Y = new Set(K.members.map((_) => _.name.toLowerCase()));
    if (!Y.has(A.toLowerCase())) return A;
    let z = 2;
    while (Y.has(`${A}-${z}`.toLowerCase())) z++;
    return `${A}-${z}`
}
// @from(Ln 334446, Col 0)
async function BNY(A, q) {
    let {
        setAppState: K,
        getAppState: Y
    } = q, {
        name: z,
        prompt: _,
        agent_type: w,
        cwd: O,
        plan_mode_required: $
    } = A, H = yu8(A.model, Y().mainLoopModel);
    if (!z || !_) throw Error("name and prompt are required for spawn operation");
    let j = Y(),
        J = A.team_name || j.teamContext?.teamName;
    if (!J) throw Error("team_name is required for spawn operation. Either provide team_name in input or call spawnTeam first to establish team context.");
    let M = await hu8(z, J),
        D = Lu8(M),
        X = ak(D, J),
        P = O || G1(),
        W = await k66();
    if (W.needsIt2Setup && q.setToolJSX) {
        let b = await N66(),
            p = await new Promise((Q) => {
                q.setToolJSX({
                    jsx: oi4.default.createElement(ii4, {
                        onDone: Q,
                        tmuxAvailable: b
                    }),
                    shouldHidePromptInput: !0
                })
            });
        if (q.setToolJSX(null), p === "cancelled") throw Error("Teammate spawn cancelled - iTerm2 setup required");
        if (p === "installed") {
            let {
                resetBackendDetection: Q
            } = await Promise.resolve().then(() => (wh(), pi4));
            Q()
        }
    }
    let Z = await Ui4(),
        G = Pl(X),
        {
            paneId: f,
            isFirstTeammate: v
        } = await di4(D, G);
    if (v && Z) await ci4();
    let N = si4(),
        V = [`--agent-id ${j4([X])}`, `--agent-name ${j4([D])}`, `--team-name ${j4([J])}`, `--agent-color ${j4([G])}`, `--parent-session-id ${j4([R1()])}`, $ ? "--plan-mode-required" : "", w ? `--agent-type ${j4([w])}` : ""].filter(Boolean).join(" "),
        L = ti4({
            planModeRequired: $,
            permissionMode: j.toolPermissionContext.mode
        });
    if (H) L = L.split(" ").filter((b, p, Q) => b !== "--model" && Q[p - 1] !== "--model").join(" "), L = L ? `${L} --model ${j4([H])}` : `--model ${j4([H])}`;
    let h = L ? ` ${L}` : "",
        R = ql6(),
        u = `cd ${j4([P])} && env ${R} ${j4([N])} ${V}${h}`;
    await li4(f, u, !Z);
    let I = Z ? "current" : $N,
        g = Z ? "current" : "swarm-view";
    K((b) => ({
        ...b,
        teamContext: {
            ...b.teamContext,
            teamName: J ?? b.teamContext?.teamName ?? "default",
            teamFilePath: b.teamContext?.teamFilePath ?? "",
            leadAgentId: b.teamContext?.leadAgentId ?? "",
            teammates: {
                ...b.teamContext?.teammates || {},
                [X]: {
                    name: D,
                    agentType: w,
                    color: G,
                    tmuxSessionName: I,
                    tmuxPaneId: f,
                    cwd: P,
                    spawnedAt: Date.now()
                }
            }
        }
    })), An4(K, {
        teammateId: X,
        sanitizedName: D,
        teamName: J,
        teammateColor: G,
        prompt: _,
        plan_mode_required: $,
        paneId: f,
        insideTmux: Z,
        toolUseId: q.toolUseId
    });
    let B = await Kz6(J);
    if (!B) throw Error(`Team "${J}" does not exist. Call spawnTeam first to create the team.`);
    return B.members.push({
        agentId: X,
        name: D,
        agentType: w,
        model: H,
        prompt: _,
        color: G,
        planModeRequired: $,
        joinedAt: Date.now(),
        tmuxPaneId: f,
        cwd: P,
        subscriptions: [],
        backendType: W.backend.type
    }), await Ru8(J, B), await x3(D, {
        from: BY,
        text: _,
        timestamp: new Date().toISOString()
    }, J), {
        data: {
            teammate_id: X,
            agent_id: X,
            agent_type: w,
            model: H,
            name: D,
            color: G,
            tmux_session_name: I,
            tmux_window_name: g,
            tmux_pane_id: f,
            team_name: J,
            is_splitpane: !0,
            plan_mode_required: $
        }
    }
}
// @from(Ln 334572, Col 0)
async function gNY(A, q) {
    let {
        setAppState: K,
        getAppState: Y
    } = q, {
        name: z,
        prompt: _,
        agent_type: w,
        cwd: O,
        plan_mode_required: $
    } = A, H = yu8(A.model, Y().mainLoopModel);
    if (!z || !_) throw Error("name and prompt are required for spawn operation");
    let j = Y(),
        J = A.team_name || j.teamContext?.teamName;
    if (!J) throw Error("team_name is required for spawn operation. Either provide team_name in input or call spawnTeam first to establish team context.");
    let M = await hu8(z, J),
        D = Lu8(M),
        X = ak(D, J),
        P = `teammate-${ai4(D)}`,
        W = O || G1();
    await mNY($N);
    let Z = Pl(X),
        G = await z8(yZ, ["new-window", "-t", $N, "-n", P, "-P", "-F", "#{pane_id}"]);
    if (G.code !== 0) throw Error(`Failed to create tmux window: ${G.stderr}`);
    let f = G.stdout.trim(),
        v = si4(),
        N = [`--agent-id ${j4([X])}`, `--agent-name ${j4([D])}`, `--team-name ${j4([J])}`, `--agent-color ${j4([Z])}`, `--parent-session-id ${j4([R1()])}`, $ ? "--plan-mode-required" : "", w ? `--agent-type ${j4([w])}` : ""].filter(Boolean).join(" "),
        V = ti4({
            planModeRequired: $,
            permissionMode: j.toolPermissionContext.mode
        });
    if (H) V = V.split(" ").filter((g, B, b) => g !== "--model" && b[B - 1] !== "--model").join(" "), V = V ? `${V} --model ${j4([H])}` : `--model ${j4([H])}`;
    let L = V ? ` ${V}` : "",
        h = ql6(),
        R = `cd ${j4([W])} && env ${h} ${j4([v])} ${N}${L}`,
        u = await z8(yZ, ["send-keys", "-t", `${$N}:${P}`, R, "Enter"]);
    if (u.code !== 0) throw Error(`Failed to send command to tmux window: ${u.stderr}`);
    K((g) => ({
        ...g,
        teamContext: {
            ...g.teamContext,
            teamName: J ?? g.teamContext?.teamName ?? "default",
            teamFilePath: g.teamContext?.teamFilePath ?? "",
            leadAgentId: g.teamContext?.leadAgentId ?? "",
            teammates: {
                ...g.teamContext?.teammates || {},
                [X]: {
                    name: D,
                    agentType: w,
                    color: Z,
                    tmuxSessionName: $N,
                    tmuxPaneId: f,
                    cwd: W,
                    spawnedAt: Date.now()
                }
            }
        }
    })), An4(K, {
        teammateId: X,
        sanitizedName: D,
        teamName: J,
        teammateColor: Z,
        prompt: _,
        plan_mode_required: $,
        paneId: f,
        insideTmux: !1,
        toolUseId: q.toolUseId
    });
    let I = await Kz6(J);
    if (!I) throw Error(`Team "${J}" does not exist. Call spawnTeam first to create the team.`);
    return I.members.push({
        agentId: X,
        name: D,
        agentType: w,
        model: H,
        prompt: _,
        color: Z,
        planModeRequired: $,
        joinedAt: Date.now(),
        tmuxPaneId: f,
        cwd: W,
        subscriptions: [],
        backendType: "tmux"
    }), await Ru8(J, I), await x3(D, {
        from: BY,
        text: _,
        timestamp: new Date().toISOString()
    }, J), {
        data: {
            teammate_id: X,
            agent_id: X,
            agent_type: w,
            model: H,
            name: D,
            color: Z,
            tmux_session_name: $N,
            tmux_window_name: P,
            tmux_pane_id: f,
            team_name: J,
            is_splitpane: !1,
            plan_mode_required: $
        }
    }
}
// @from(Ln 334677, Col 0)
function An4(A, {
    teammateId: q,
    sanitizedName: K,
    teamName: Y,
    teammateColor: z,
    prompt: _,
    plan_mode_required: w,
    paneId: O,
    insideTmux: $,
    toolUseId: H
}) {
    let j = oV("in_process_teammate"),
        J = `${K}: ${_.substring(0,50)}${_.length>50?"...":""}`,
        M = new AbortController,
        D = {
            ...RG(j, "in_process_teammate", J, H),
            type: "in_process_teammate",
            status: "running",
            identity: {
                agentId: q,
                agentName: K,
                teamName: Y,
                color: z,
                planModeRequired: w ?? !1,
                parentSessionId: R1()
            },
            prompt: _,
            abortController: M,
            awaitingPlanApproval: !1,
            permissionMode: w ? "plan" : "default",
            isIdle: !1,
            shutdownRequested: !1,
            lastReportedToolCount: 0,
            lastReportedTokenCount: 0,
            pendingUserMessages: []
        };
    Zf(D, A), M.signal.addEventListener("abort", () => {
        let P = !$ ? ["-L", Mf6(), "kill-pane", "-t", O] : ["kill-pane", "-t", O];
        z8(yZ, P)
    })
}
// @from(Ln 334718, Col 0)
async function FNY(A, q) {
    let {
        setAppState: K,
        getAppState: Y
    } = q, {
        name: z,
        prompt: _,
        agent_type: w,
        plan_mode_required: O
    } = A, $ = yu8(A.model, Y().mainLoopModel);
    if (!z || !_) throw Error("name and prompt are required for spawn operation");
    let H = Y(),
        j = A.team_name || H.teamContext?.teamName;
    if (!j) throw Error("team_name is required for spawn operation. Either provide team_name in input or call spawnTeam first to establish team context.");
    let J = await hu8(z, j),
        M = Lu8(J),
        D = ak(M, j),
        X = Pl(D),
        P;
    if (w) {
        let v = q.options.agentDefinitions.activeAgents.find((N) => N.agentType === w);
        if (v && YQ6(v)) P = v;
        k(`[handleSpawnInProcess] agent_type=${w}, found=${!!P}`)
    }
    let Z = await mZ6({
        name: M,
        teamName: j,
        prompt: _,
        color: X,
        planModeRequired: O ?? !1,
        model: $
    }, q);
    if (!Z.success) throw Error(Z.error ?? "Failed to spawn in-process teammate");
    if (k(`[handleSpawnInProcess] spawn result: taskId=${Z.taskId}, hasContext=${!!Z.teammateContext}, hasAbort=${!!Z.abortController}`), Z.taskId && Z.teammateContext && Z.abortController) xN1({
        identity: {
            agentId: D,
            agentName: M,
            teamName: j,
            color: X,
            planModeRequired: O ?? !1,
            parentSessionId: Z.teammateContext.parentSessionId
        },
        taskId: Z.taskId,
        prompt: _,
        description: A.description,
        model: $,
        agentDefinition: P,
        teammateContext: Z.teammateContext,
        toolUseContext: {
            ...q,
            messages: []
        },
        abortController: Z.abortController
    }), k(`[handleSpawnInProcess] Started agent execution for ${D}`);
    K((f) => {
        let v = !f.teamContext?.leadAgentId,
            N = v ? ak(BY, j) : f.teamContext.leadAgentId,
            V = f.teamContext?.teammates || {},
            L = v ? {
                [N]: {
                    name: BY,
                    agentType: BY,
                    color: Pl(N),
                    tmuxSessionName: "in-process",
                    tmuxPaneId: "leader",
                    cwd: G1(),
                    spawnedAt: Date.now()
                }
            } : {};
        return {
            ...f,
            teamContext: {
                ...f.teamContext,
                teamName: j ?? f.teamContext?.teamName ?? "default",
                teamFilePath: f.teamContext?.teamFilePath ?? "",
                leadAgentId: N,
                teammates: {
                    ...V,
                    ...L,
                    [D]: {
                        name: M,
                        agentType: w,
                        color: X,
                        tmuxSessionName: "in-process",
                        tmuxPaneId: "in-process",
                        cwd: G1(),
                        spawnedAt: Date.now()
                    }
                }
            }
        }
    });
    let G = await Kz6(j);
    if (!G) throw Error(`Team "${j}" does not exist. Call spawnTeam first to create the team.`);
    return G.members.push({
        agentId: D,
        name: M,
        agentType: w,
        model: $,
        prompt: _,
        color: X,
        planModeRequired: O,
        joinedAt: Date.now(),
        tmuxPaneId: "in-process",
        cwd: G1(),
        subscriptions: [],
        backendType: "in-process"
    }), await Ru8(j, G), {
        data: {
            teammate_id: D,
            agent_id: D,
            agent_type: w,
            model: $,
            name: M,
            color: X,
            tmux_session_name: "in-process",
            tmux_window_name: "in-process",
            tmux_pane_id: "in-process",
            team_name: j,
            is_splitpane: !1,
            plan_mode_required: O
        }
    }
}
// @from(Ln 334842, Col 0)
async function pNY(A, q) {
    if (Rb()) return FNY(A, q);
    if (A.use_splitpane !== !1) return BNY(A, q);
    return gNY(A, q)
}
// @from(Ln 334847, Col 0)
async function qn4(A, q) {
    return pNY(A, q)
}
// @from(Ln 334850, Col 4)
oi4
// @from(Ln 334851, Col 4)
Su8 = E(() => {
    A8();
    Kl6();
    Eq();
    RJ();
    lA();
    qH();
    H1();
    wh();
    xZ1();
    Yu8();
    Ou8();
    ig();
    ni4();
    T1();
    T31();
    Nz();
    g1();
    J0();
    qL();
    O0();
    s8();
    oi4 = t(P6(), 1)
})
// @from(Ln 334875, Col 4)
$n4 = {}
// @from(Ln 334910, Col 0)
async function cNY(A) {
    await Cu8(A, {
        recursive: !0
    })
}
// @from(Ln 334915, Col 0)
async function lNY(A, q, K) {
    for (let Y of K) {
        if (Or(Y)) {
            k(`Skipping symlink for "${Y}": path traversal detected`, {
                level: "warn"
            });
            continue
        }
        let z = ME(A, Y),
            _ = ME(q, Y);
        try {
            await QNY(z, _, "dir"), k(`Symlinked ${Y} from main repository to worktree to avoid disk bloat`)
        } catch (w) {
            let O = w,
                $ = O.code;
            if ($ !== "ENOENT" && $ !== "EEXIST") k(`Failed to symlink ${Y} (${$??"unknown"}): ${O.message}`, {
                level: "warn"
            })
        }
    }
}
// @from(Ln 334937, Col 0)
function S0() {
    return $h
}
// @from(Ln 334941, Col 0)
function Iu8(A, q) {
    return `${Yn4(A)}_${q}`.replace(/[/.]/g, "_")
}
// @from(Ln 334945, Col 0)
function cN1(A) {
    return ME(A, ".claude", "worktrees")
}
// @from(Ln 334949, Col 0)
function bu8(A) {
    return `worktree-${A}`
}
// @from(Ln 334952, Col 0)
async function xu8(A, q, K) {
    let Y = ME(cN1(A), q),
        z = bu8(q),
        _ = await s57(Y);
    if (_) return {
        worktreePath: Y,
        worktreeBranch: z,
        headCommit: _,
        existed: !0
    };
    await Cu8(cN1(A), {
        recursive: !0
    });
    let w = {
            ...process.env,
            ...iNY
        },
        O, $ = null;
    if (K?.prNumber) {
        let {
            code: X,
            stderr: P
        } = await RA(hA(), ["fetch", "origin", `pull/${K.prNumber}/head`], {
            cwd: A,
            stdin: "ignore",
            env: w
        });
        if (X !== 0) throw Error(`Failed to fetch PR #${K.prNumber}: ${P.trim()||'PR may not exist or the repository may not have a remote named "origin"'}`);
        O = "FETCH_HEAD"
    } else {
        let [X, P] = await Promise.all([oT(), rT(A)]), W = `origin/${X}`, Z = P ? await Eo(P, `refs/remotes/origin/${X}`) : null;
        if (Z) O = W, $ = Z;
        else {
            let {
                code: G
            } = await RA(hA(), ["fetch", "origin", X], {
                cwd: A,
                stdin: "ignore",
                env: w
            });
            O = G === 0 ? W : "HEAD"
        }
    }
    let H = RA(hA(), ["branch", "-D", z], {
        cwd: A
    });
    if (!$) {
        let [{
            stdout: X,
            code: P
        }] = await Promise.all([RA(hA(), ["rev-parse", O], {
            cwd: A
        }), H]);
        if (P !== 0) throw Error(`Failed to resolve base branch "${O}": git rev-parse failed`);
        $ = X.trim()
    } else await H;
    let j = mA().worktree?.sparsePaths,
        J = ["worktree", "add"];
    if (j?.length) J.push("--no-checkout");
    J.push("-b", z, Y, O);
    let {
        code: M,
        stderr: D
    } = await RA(hA(), J, {
        cwd: A
    });
    if (M !== 0) throw Error(`Failed to create worktree: ${D}`);
    if (j?.length) {
        let X = async (f) => {
            throw await RA(hA(), ["worktree", "remove", "--force", Y], {
                cwd: A
            }), Error(f)
        }, {
            code: P,
            stderr: W
        } = await RA(hA(), ["sparse-checkout", "set", "--cone", "--", ...j], {
            cwd: Y
        });
        if (P !== 0) await X(`Failed to configure sparse-checkout: ${W}`);
        let {
            code: Z,
            stderr: G
        } = await RA(hA(), ["checkout", "HEAD"], {
            cwd: Y
        });
        if (Z !== 0) await X(`Failed to checkout sparse worktree: ${G}`)
    }
    return {
        worktreePath: Y,
        worktreeBranch: z,
        headCommit: $,
        baseBranch: O,
        existed: !1
    }
}
// @from(Ln 335047, Col 0)
async function On4(A, q) {
    let K;
    try {
        K = await UNY(ME(A, ".worktreeinclude"), "utf-8")
    } catch {
        return []
    }
    let Y = K.split(/\r?\n/).map((J) => J.trim()).filter((J) => J.length > 0 && !J.startsWith("#"));
    if (Y.length === 0) return [];
    let z = await RA(hA(), ["ls-files", "--others", "--ignored", "--exclude-standard", "--directory"], {
        cwd: A
    });
    if (z.code !== 0 || !z.stdout.trim()) return [];
    let _ = z.stdout.trim().split(`
`).filter(Boolean),
        w = wn4.default().add(K),
        O = _.filter((J) => J.endsWith("/")),
        $ = _.filter((J) => !J.endsWith("/") && w.ignores(J)),
        H = O.filter((J) => {
            if (Y.some((M) => {
                    let D = M.startsWith("/") ? M.slice(1) : M;
                    if (D.startsWith(J)) return !0;
                    let X = D.search(/[*?[]/);
                    if (X > 0) {
                        let P = D.slice(0, X);
                        if (J.startsWith(P)) return !0
                    }
                    return !1
                })) return !0;
            if (w.ignores(J.slice(0, -1))) return !0;
            return !1
        });
    if (H.length > 0) {
        let J = await RA(hA(), ["ls-files", "--others", "--ignored", "--exclude-standard", "--", ...H], {
            cwd: A
        });
        if (J.code === 0 && J.stdout.trim()) {
            for (let M of J.stdout.trim().split(`
`).filter(Boolean))
                if (w.ignores(M)) $.push(M)
        }
    }
    let j = [];
    for (let J of $) {
        let M = ME(A, J),
            D = ME(q, J);
        try {
            await Cu8(Kn4(D), {
                recursive: !0
            }), await zn4(M, D), j.push(J)
        } catch (X) {
            k(`Failed to copy ${J} to worktree: ${X.message}`, {
                level: "warn"
            })
        }
    }
    if (j.length > 0) k(`Copied ${j.length} files from .worktreeinclude: ${j.join(", ")}`);
    return j
}
// @from(Ln 335106, Col 0)
async function uu8(A, q) {
    let K = Yz6("localSettings"),
        Y = ME(A, K);
    try {
        let H = ME(q, K);
        await cNY(Kn4(H)), await zn4(Y, H), k(`Copied settings.local.json to worktree: ${H}`)
    } catch (H) {
        if (H.code !== "ENOENT") k(`Failed to copy settings.local.json: ${H.message}`, {
            level: "warn"
        })
    }
    let z = ME(A, ".husky"),
        _ = ME(A, ".git", "hooks"),
        w = null;
    for (let H of [z, _]) try {
        if ((await _n4(H)).isDirectory()) {
            w = H;
            break
        }
    } catch {}
    if (w) {
        let {
            code: H,
            stderr: j
        } = await RA(hA(), ["config", "core.hooksPath", w], {
            cwd: q
        });
        if (H === 0) k(`Configured worktree to use hooks from main repository: ${w}`);
        else k(`Failed to configure hooks path: ${j}`, {
            level: "error"
        })
    }
    let $ = mA().worktree?.symlinkDirectories ?? [];
    if ($.length > 0) await lNY(A, q, $);
    await On4(A, q)
}
// @from(Ln 335143, Col 0)
function lN1(A) {
    let q = A.match(/^https?:\/\/[^/]+\/[^/]+\/[^/]+\/pull\/(\d+)\/?(?:[?#].*)?$/i);
    if (q?.[1]) return parseInt(q[1], 10);
    let K = A.match(/^#(\d+)$/);
    if (K?.[1]) return parseInt(K[1], 10);
    return null
}
// @from(Ln 335150, Col 0)
async function mu8() {
    let {
        code: A
    } = await z8("tmux", ["-V"]);
    return A === 0
}
// @from(Ln 335157, Col 0)
function Bu8() {
    switch (y8()) {
        case "macos":
            return "Install tmux with: brew install tmux";
        case "linux":
        case "wsl":
            return "Install tmux with: sudo apt install tmux (Debian/Ubuntu) or sudo dnf install tmux (Fedora/RHEL)";
        case "windows":
            return "tmux is not natively available on Windows. Consider using WSL or Cygwin.";
        default:
            return "Install tmux using your system package manager."
    }
}
// @from(Ln 335170, Col 0)
async function gu8(A, q) {
    let {
        code: K,
        stderr: Y
    } = await z8("tmux", ["new-session", "-d", "-s", A, "-c", q]);
    if (K !== 0) return {
        created: !1,
        error: Y
    };
    return {
        created: !0
    }
}
// @from(Ln 335183, Col 0)
async function Qf6(A) {
    let {
        code: q
    } = await z8("tmux", ["kill-session", "-t", A]);
    return q === 0
}
// @from(Ln 335189, Col 0)
async function Yl6(A, q, K, Y) {
    let z = G1();
    if (iN1()) {
        let _ = await nN1(q);
        k(`Created hook-based worktree at: ${_.worktreePath}`), $h = {
            originalCwd: z,
            worktreePath: _.worktreePath,
            worktreeName: q,
            sessionId: A,
            tmuxSessionName: K,
            hookBased: !0
        }
    } else {
        let _ = H_(G1());
        if (!_) throw Error("Cannot create a worktree: not in a git repository and no WorktreeCreate hooks are configured. Configure WorktreeCreate/WorktreeRemove hooks in settings.json to use worktree isolation with other VCS systems.");
        let w = await kj(),
            O = Date.now(),
            {
                worktreePath: $,
                worktreeBranch: H,
                headCommit: j,
                existed: J
            } = await xu8(_, q, Y),
            M;
        if (J) k(`Resuming existing worktree at: ${$}`);
        else k(`Created worktree at: ${$} on branch: ${H}`), await uu8(_, $), M = Date.now() - O;
        $h = {
            originalCwd: z,
            worktreePath: $,
            worktreeName: q,
            worktreeBranch: H,
            originalBranch: w,
            originalHeadCommit: j,
            sessionId: A,
            tmuxSessionName: K,
            creationDurationMs: M,
            usedSparsePaths: (mA().worktree?.sparsePaths?.length ?? 0) > 0
        }
    }
    return c2((_) => ({
        ..._,
        activeWorktreeSession: $h ?? void 0
    })), $h
}
// @from(Ln 335233, Col 0)
async function Uf6() {
    if (!$h) return;
    try {
        let {
            worktreePath: A,
            originalCwd: q,
            worktreeBranch: K
        } = $h;
        process.chdir(q), $h = null, c2((Y) => ({
            ...Y,
            activeWorktreeSession: void 0
        })), k(`Linked worktree preserved at: ${A}${K?` on branch: ${K}`:""}`), k(`You can continue working there by running: cd ${A}`)
    } catch (A) {
        k(`Error keeping worktree: ${A}`, {
            level: "error"
        })
    }
}
// @from(Ln 335251, Col 0)
async function df6() {
    if (!$h) return;
    try {
        let {
            worktreePath: A,
            originalCwd: q,
            worktreeBranch: K,
            hookBased: Y
        } = $h;
        if (process.chdir(q), Y)
            if (await rN1(A)) k(`Removed hook-based worktree at: ${A}`);
            else k(`No WorktreeRemove hook configured, hook-based worktree left at: ${A}`, {
                level: "warn"
            });
        else {
            let {
                code: z,
                stderr: _
            } = await RA(hA(), ["worktree", "remove", "--force", A], {
                cwd: q
            });
            if (z !== 0) k(`Failed to remove linked worktree: ${_}`, {
                level: "error"
            });
            else k(`Removed linked worktree at: ${A}`)
        }
        if ($h = null, c2((z) => ({
                ...z,
                activeWorktreeSession: void 0
            })), !Y && K) {
            await new Promise((w) => setTimeout(w, 100));
            let {
                code: z,
                stderr: _
            } = await RA(hA(), ["branch", "-D", K], {
                cwd: q
            });
            if (z !== 0) k(`Could not delete worktree branch: ${_}`, {
                level: "error"
            });
            else k(`Deleted worktree branch: ${K}`)
        }
        k("Linked worktree cleaned up completely")
    } catch (A) {
        k(`Error cleaning up worktree: ${A}`, {
            level: "error"
        })
    }
}
// @from(Ln 335300, Col 0)
async function zl6(A) {
    if (iN1()) {
        let w = await nN1(A);
        return k(`Created hook-based agent worktree at: ${w.worktreePath}`), {
            worktreePath: w.worktreePath,
            hookBased: !0
        }
    }
    let q = LJ(G1());
    if (!q) throw Error("Cannot create agent worktree: not in a git repository and no WorktreeCreate hooks are configured. Configure WorktreeCreate/WorktreeRemove hooks in settings.json to use worktree isolation with other VCS systems.");
    let {
        worktreePath: K,
        worktreeBranch: Y,
        headCommit: z,
        existed: _
    } = await xu8(q, A);
    if (!_) k(`Created agent worktree at: ${K} on branch: ${Y}`), await uu8(q, K);
    else k(`Resuming existing agent worktree at: ${K}`);
    return {
        worktreePath: K,
        worktreeBranch: Y,
        headCommit: z,
        gitRoot: q
    }
}
// @from(Ln 335325, Col 0)
async function E66(A, q, K, Y) {
    if (Y) {
        let $ = await rN1(A);
        if ($) k(`Removed hook-based agent worktree at: ${A}`);
        else k(`No WorktreeRemove hook configured, hook-based agent worktree left at: ${A}`, {
            level: "warn"
        });
        return $
    }
    if (!K) return k("Cannot remove agent worktree: no git root provided", {
        level: "error"
    }), !1;
    let {
        code: z,
        stderr: _
    } = await RA(hA(), ["worktree", "remove", "--force", A], {
        cwd: K
    });
    if (z !== 0) return k(`Failed to remove agent worktree: ${_}`, {
        level: "error"
    }), !1;
    if (k(`Removed agent worktree at: ${A}`), !q) return !0;
    let {
        code: w,
        stderr: O
    } = await RA(hA(), ["branch", "-D", q], {
        cwd: K
    });
    if (w !== 0) k(`Could not delete agent worktree branch: ${O}`, {
        level: "error"
    });
    return !0
}
// @from(Ln 335358, Col 0)
async function Fu8(A) {
    let q = LJ(G1());
    if (!q) return 0;
    let K = cN1(q),
        Y;
    try {
        Y = await dNY(K)
    } catch {
        return 0
    }
    let z = A.getTime(),
        _ = $h?.worktreePath,
        w = 0;
    for (let O of Y) {
        if (!nNY.some((M) => M.test(O))) continue;
        let $ = ME(K, O);
        if (_ === $) continue;
        let H;
        try {
            H = (await _n4($)).mtimeMs
        } catch {
            continue
        }
        if (H >= z) continue;
        let [j, J] = await Promise.all([RA(hA(), ["--no-optional-locks", "status", "--porcelain", "-uno"], {
            cwd: $
        }), RA(hA(), ["rev-list", "--max-count=1", "HEAD", "--not", "--remotes"], {
            cwd: $
        })]);
        if (j.code !== 0 || j.stdout.trim().length > 0) continue;
        if (J.code !== 0 || J.stdout.trim().length > 0) continue;
        if (await E66($, bu8(O), q)) w++
    }
    if (w > 0) await RA(hA(), ["worktree", "prune"], {
        cwd: q
    }), k(`cleanupStaleAgentWorktrees: removed ${w} stale worktree(s)`);
    return w
}
// @from(Ln 335396, Col 0)
async function pu8(A, q) {
    let {
        code: K,
        stdout: Y
    } = await RA(hA(), ["status", "--porcelain"], {
        cwd: A
    });
    if (K !== 0) return !0;
    if (Y.trim().length > 0) return !0;
    let {
        code: z,
        stdout: _
    } = await RA(hA(), ["rev-list", "--count", `${q}..HEAD`], {
        cwd: A
    });
    if (z !== 0) return !0;
    if (parseInt(_.trim(), 10) > 0) return !0;
    return !1
}
// @from(Ln 335415, Col 0)
async function rNY(A) {
    if (process.platform === "win32") return {
        handled: !1,
        error: "Error: --tmux is not supported on Windows"
    };
    if (If("tmux", ["-V"], {
            encoding: "utf-8"
        }).status !== 0) return {
        handled: !1,
        error: `Error: tmux is not installed. ${process.platform==="darwin"?"Install tmux with: brew install tmux":"Install tmux with: sudo apt install tmux"}`
    };
    let K, Y = !1;
    for (let h = 0; h < A.length; h++) {
        let R = A[h];
        if (!R) continue;
        if (R === "-w" || R === "--worktree") {
            let u = A[h + 1];
            if (u && !u.startsWith("-")) K = u
        } else if (R.startsWith("--worktree=")) K = R.slice(11);
        else if (R === "--tmux=classic") Y = !0
    }
    let z = null;
    if (K) {
        if (z = lN1(K), z !== null) K = `pr-${z}`
    }
    if (!K) {
        let h = ["swift", "bright", "calm", "keen", "bold"],
            R = ["fox", "owl", "elm", "oak", "ray"],
            u = h[Math.floor(Math.random() * h.length)],
            I = R[Math.floor(Math.random() * R.length)],
            g = Math.random().toString(36).slice(2, 6);
        K = `${u}-${I}-${g}`
    }
    let _ = LJ(G1());
    if (!_) return {
        handled: !1,
        error: "Error: --worktree requires a git repository"
    };
    let w = Yn4(_),
        O = ME(cN1(_), K),
        $ = bu8(K),
        H = `${w}_${$}`.replace(/[/.]/g, "_");
    try {
        let h = await xu8(_, K, z !== null ? {
            prNumber: z
        } : void 0);
        if (!h.existed) console.log(`Created worktree: ${O} (based on ${h.baseBranch})`), await uu8(_, O)
    } catch (h) {
        return {
            handled: !1,
            error: `Error: ${_1(h)}`
        }
    }
    let j = [];
    for (let h = 0; h < A.length; h++) {
        let R = A[h];
        if (!R) continue;
        if (R === "--tmux" || R === "--tmux=classic") continue;
        if (R === "-w" || R === "--worktree") {
            let u = A[h + 1];
            if (u && !u.startsWith("-")) h++;
            continue
        }
        if (R.startsWith("--worktree=")) continue;
        j.push(R)
    }
    let J = "C-b",
        M = If("tmux", ["show-options", "-g", "prefix"], {
            encoding: "utf-8"
        });
    if (M.status === 0 && M.stdout) {
        let h = M.stdout.match(/prefix\s+(\S+)/);
        if (h?.[1]) J = h[1]
    }
    let X = ["C-b", "C-c", "C-d", "C-t", "C-o", "C-r", "C-s", "C-g", "C-e"].includes(J),
        P = {
            ...process.env,
            CLAUDE_CODE_TMUX_SESSION: H,
            CLAUDE_CODE_TMUX_PREFIX: J,
            CLAUDE_CODE_TMUX_PREFIX_CONFLICTS: X ? "1" : ""
        },
        Z = If("tmux", ["has-session", "-t", H], {
            encoding: "utf-8"
        }).status === 0,
        G = Boolean(process.env.TMUX),
        f = V66() && !Y && !G,
        v = f ? ["-CC"] : [];
    if (f && !Z) {
        let h = O1.yellow;
        console.log(`
${h("╭─ iTerm2 Tip ────────────────────────────────────────────────────────╮")}
${h("│")} To open as a tab instead of a new window:                           ${h("│")}
${h("│")} iTerm2 > Settings > General > tmux > "Tabs in attaching window"     ${h("│")}
${h("╰─────────────────────────────────────────────────────────────────────╯")}
`)
    }
    if (!1)
        if (If("tmux", ["new-session", "-d", "-s", H, "-c", O, "--", process.execPath, ...j], {
                cwd: O,
                env: P
            }), If("tmux", ["split-window", "-h", "-t", H, "-c", O], {
                cwd: O
            }), If("tmux", ["send-keys", "-t", H, "bun run watch", "Enter"], {
                cwd: O
            }), If("tmux", ["split-window", "-v", "-t", H, "-c", O], {
                cwd: O
            }), If("tmux", ["send-keys", "-t", H, "bun run start"], {
                cwd: O
            }), If("tmux", ["select-pane", "-t", `${H}:0.0`], {
                cwd: O
            }), G) If("tmux", ["switch-client", "-t", H], {
            stdio: "inherit"
        });
        else If("tmux", [...v, "attach-session", "-t", H], {
            stdio: "inherit",
            cwd: O
        });
    else if (G)
        if (Z) If("tmux", ["switch-client", "-t", H], {
            stdio: "inherit"
        });
        else If("tmux", ["new-session", "-d", "-s", H, "-c", O, "--", process.execPath, ...j], {
            cwd: O,
            env: P
        }), If("tmux", ["switch-client", "-t", H], {
            stdio: "inherit"
        });
    else {
        let h = [...v, "new-session", "-A", "-s", H, "-c", O, "--", process.execPath, ...j];
        If("tmux", h, {
            stdio: "inherit",
            cwd: O,
            env: P
        })
    }
    return {
        handled: !0
    }
}
// @from(Ln 335554, Col 4)
wn4
// @from(Ln 335554, Col 9)
$h = null
// @from(Ln 335555, Col 4)
iNY
// @from(Ln 335555, Col 9)
nNY
// @from(Ln 335556, Col 4)
jN = E(() => {
    Eq();
    aK();
    lA();
    $5();
    yo();
    H1();
    hw();
    k8();
    i8();
    YK();
    ig();
    F9();
    s8();
    wn4 = t(Kq6(), 1);
    iNY = {
        GIT_TERMINAL_PROMPT: "0",
        GIT_ASKPASS: ""
    };
    nNY = [/^agent-a[0-9a-f]{7}$/, /^wf-\d+$/, /^bridge-[A-Za-z0-9_-]+$/]
})
// @from(Ln 335577, Col 0)
async function C0(A, {
    sessionId: q,
    agentType: K,
    model: Y,
    forceSyncExecution: z
} = {}) {
    let _ = [],
        w = [];
    if (GL()) k("Skipping plugin hooks - allowManagedHooksOnly is enabled");
    else try {
        await nB()
    } catch ($) {
        let H = $ instanceof Error ? Error(`Failed to load plugin hooks during ${A}: ${$.message}`) : Error(`Failed to load plugin hooks during ${A}: ${String($)}`);
        if ($ instanceof Error && $.stack) H.stack = $.stack;
        _6(H);
        let j = $ instanceof Error ? $.message : String($),
            J = "";
        if (j.includes("Failed to clone") || j.includes("network") || j.includes("ETIMEDOUT") || j.includes("ENOTFOUND")) J = "This appears to be a network issue. Check your internet connection and try again.";
        else if (j.includes("Permission denied") || j.includes("EACCES") || j.includes("EPERM")) J = "This appears to be a permissions issue. Check file permissions on ~/.claude/plugins/";
        else if (j.includes("Invalid") || j.includes("parse") || j.includes("JSON") || j.includes("schema")) J = "This appears to be a configuration issue. Check your plugin settings in .claude/settings.json";
        else J = "Please fix the plugin configuration or remove problematic plugins from your settings.";
        k(`Warning: Failed to load plugin hooks. SessionStart hooks from plugins will not execute. Error: ${j}. ${J}`, {
            level: "warn"
        })
    }
    let O = K ?? Pp();
    for await (let $ of Qu8(A, q, O, Y, void 0, void 0, z)) {
        if ($.message) _.push($.message);
        if ($.additionalContexts && $.additionalContexts.length > 0) w.push(...$.additionalContexts)
    }
    if (w.length > 0) {
        let $ = f4({
            type: "hook_additional_context",
            content: w,
            hookName: "SessionStart",
            toolUseID: "SessionStart",
            hookEvent: "SessionStart"
        });
        _.push($)
    }
    return _
}
// @from(Ln 335619, Col 0)
async function oN1(A, {
    forceSyncExecution: q
} = {}) {
    let K = [],
        Y = [];
    if (GL()) k("Skipping plugin hooks - allowManagedHooksOnly is enabled");
    else try {
        await nB()
    } catch (z) {
        let _ = z instanceof Error ? z.message : String(z);
        k(`Warning: Failed to load plugin hooks. Setup hooks from plugins will not execute. Error: ${_}`, {
            level: "warn"
        })
    }
    for await (let z of Uu8(A, void 0, void 0, q)) {
        if (z.message) K.push(z.message);
        if (z.additionalContexts && z.additionalContexts.length > 0) Y.push(...z.additionalContexts)
    }
    if (Y.length > 0) {
        let z = f4({
            type: "hook_additional_context",
            content: Y,
            hookName: "Setup",
            toolUseID: "Setup",
            hookEvent: "Setup"
        });
        K.push(z)
    }
    return K
}
// @from(Ln 335649, Col 4)
y66 = E(() => {
    hw();
    O96();
    k1();
    H1();
    M0();
    tI6();
    T1()
})
// @from(Ln 335659, Col 0)
function oNY() {
    let A = w8("tengu_auto_mode_config", {})?.enabled;
    return A === "enabled" || A === "disabled" || A === "opt-in" ? A : void 0
}
// @from(Ln 335664, Col 0)
function L66(A, q, K) {
    return
}
// @from(Ln 335668, Col 0)
function jn4(A) {
    let q = A.find((K) => K.name === "claude-vscode");
    if (q && q.type === "connected") {
        Hn4 = q, q.client.setNotificationHandler(aNY(), async (z) => {
            let {
                eventName: _,
                eventData: w
            } = z.params;
            d(`tengu_vscode_${_}`, w)
        });
        let K = {
                tengu_vscode_review_upsell: jY("tengu_vscode_review_upsell"),
                tengu_vscode_onboarding: jY("tengu_vscode_onboarding"),
                tengu_quiet_fern: w8("tengu_quiet_fern", !1),
                tengu_slate_ridge: w8("tengu_slate_ridge", !1)
            },
            Y = oNY();
        if (Y !== void 0) K.tengu_auto_mode_state = Y;
        q.client.notification({
            method: "experiment_gates",
            params: {
                gates: K
            }
        })
    }
}
// @from(Ln 335694, Col 4)
aNY
// @from(Ln 335694, Col 9)
Hn4 = null
// @from(Ln 335695, Col 4)
cf6 = E(() => {
    K7();
    V1();
    HA();
    H1();
    aNY = F6(() => C.object({
        method: C.literal("log_event"),
        params: C.object({
            eventName: C.string(),
            eventData: C.object({}).passthrough()
        })
    }))
})
// @from(Ln 335729, Col 0)
function iz() {
    if (q7()) return YVY();
    return X1().fileCheckpointingEnabled !== !1 && !t6(process.env.CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING)
}
// @from(Ln 335734, Col 0)
function YVY() {
    return t6(process.env.CLAUDE_CODE_ENABLE_SDK_FILE_CHECKPOINTING) && !t6(process.env.CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING)
}
// @from(Ln 335737, Col 0)
async function R66(A, q, K) {
    if (!iz()) return;
    A((Y) => {
        try {
            let z = Y.snapshots.at(-1);
            if (!z) return _6(Error("FileHistory: Missing most recent snapshot")), d("tengu_file_history_track_edit_failed", {}), Y;
            let _ = fn4(q);
            if (z.trackedFileBackups[_]) return Y;
            let w = Y.trackedFiles.has(_) ? Y.trackedFiles : new Set(Y.trackedFiles).add(_),
                $ = !$1().existsSync(q),
                H = $ ? du8(null, 1) : du8(q, 1),
                j = rw6(z);
            j.trackedFileBackups[_] = H;
            let J = {
                ...Y,
                snapshots: [...Y.snapshots.slice(0, -1), j],
                trackedFiles: w
            };
            return Tn4(J), _l6(K, j, !0).catch((M) => {
                _6(Error(`FileHistory: Failed to record snapshot: ${M}`))
            }), d("tengu_file_history_track_edit_success", {
                isNewFile: $,
                version: H.version
            }), k(`FileHistory: Tracked file modification for ${q}`), J
        } catch (z) {
            return _6(z), d("tengu_file_history_track_edit_failed", {}), Y
        }
    })
}
// @from(Ln 335766, Col 0)
async function lf6(A, q) {
    if (!iz()) return;
    A((K) => {
        try {
            let Y = $1(),
                z = new Date,
                _ = {},
                w = K.snapshots.at(-1);
            if (w) {
                k(`FileHistory: Making snapshot for message ${q}`);
                for (let j of K.trackedFiles) try {
                    let J = AV1(j);
                    if (!Y.existsSync(J)) {
                        let M = w.trackedFileBackups[j],
                            D = M ? M.version + 1 : 1;
                        _[j] = {
                            backupFileName: null,
                            version: D,
                            backupTime: new Date
                        }, d("tengu_file_history_backup_deleted_file", {
                            version: D
                        }), k(`FileHistory: Missing tracked file: ${j}`)
                    } else {
                        let M = w.trackedFileBackups[j];
                        if (M && M.backupFileName !== null && !cu8(J, M.backupFileName)) {
                            _[j] = M;
                            continue
                        }
                        let D = M ? M.version + 1 : 1,
                            X = du8(J, D);
                        _[j] = X
                    }
                } catch (J) {
                    _6(J), d("tengu_file_history_backup_file_failed", {})
                }
            }
            let O = {
                    messageId: q,
                    trackedFileBackups: _,
                    timestamp: z
                },
                $ = [...K.snapshots, O],
                H = {
                    ...K,
                    snapshots: $.length > Jn4 ? $.slice(-Jn4) : $,
                    snapshotSequence: (K.snapshotSequence ?? 0) + 1
                };
            return Tn4(H), wVY(K, H), _l6(q, O, !1).catch((j) => {
                _6(Error(`FileHistory: Failed to record snapshot: ${j}`))
            }), k(`FileHistory: Added snapshot for ${q}, tracking ${K.trackedFiles.size} files`), d("tengu_file_history_snapshot_success", {
                trackedFilesCount: K.trackedFiles.size,
                snapshotCount: H.snapshots.length
            }), H
        } catch (Y) {
            return _6(Y), d("tengu_file_history_snapshot_failed", {}), K
        }
    })
}
// @from(Ln 335824, Col 0)
async function sN1(A, q) {
    if (!iz()) return;
    let K = null;
    if (A((Y) => {
            let z = Y;
            try {
                let _ = Y.snapshots.findLast((O) => O.messageId === q);
                if (!_) return _6(Error(`FileHistory: Snapshot for ${q} not found`)), d("tengu_file_history_rewind_failed", {
                    trackedFilesCount: z.trackedFiles.size,
                    snapshotFound: !1
                }), K = Error("The selected snapshot was not found"), z;
                k(`FileHistory: [Rewind] Rewinding to snapshot for ${q}`);
                let w = Zn4(z, _, !1);
                k(`FileHistory: [Rewind] Finished rewinding to ${q}`), d("tengu_file_history_rewind_success", {
                    trackedFilesCount: z.trackedFiles.size,
                    filesChangedCount: w?.filesChanged?.length
                })
            } catch (_) {
                K = _, _6(_), d("tengu_file_history_rewind_failed", {
                    trackedFilesCount: z.trackedFiles.size,
                    snapshotFound: !0
                })
            }
            return z
        }), K) throw K
}
// @from(Ln 335851, Col 0)
function tN1(A, q) {
    if (!iz()) return !1;
    return A.snapshots.some((K) => K.messageId === q)
}
// @from(Ln 335856, Col 0)
function eN1(A, q) {
    if (!iz()) return;
    let K = A.snapshots.findLast((Y) => Y.messageId === q);
    if (!K) return;
    return Zn4(A, K, !0)
}
// @from(Ln 335863, Col 0)
function Wn4(A, q) {
    if (!iz()) return !1;
    let K = A.snapshots.findLast((z) => z.messageId === q);
    if (!K) return !1;
    let Y = $1();
    for (let z of A.trackedFiles) try {
        let _ = AV1(z),
            w = K.trackedFileBackups[z],
            O = w ? w.backupFileName : Gn4(z, A);
        if (O === void 0) continue;
        if (O === null) {
            if (Y.existsSync(_)) return !0;
            continue
        }
        if (cu8(_, O)) return !0
    } catch (_) {
        _6(_)
    }
    return !1
}
// @from(Ln 335884, Col 0)
function Zn4(A, q, K) {
    let Y = $1(),
        z = [],
        _ = 0,
        w = 0;
    for (let O of A.trackedFiles) try {
        let $ = AV1(O),
            H = q.trackedFileBackups[O],
            j = H ? H.backupFileName : Gn4(O, A);
        if (j === void 0) _6(Error("FileHistory: Error finding the backup file to apply")), d("tengu_file_history_rewind_restore_file_failed", {
            dryRun: K
        });
        else if (j === null) {
            if (Y.existsSync($)) {
                if (K) {
                    let J = Mn4($, void 0);
                    _ += J?.insertions || 0, w += J?.deletions || 0
                } else Y.unlinkSync($), k(`FileHistory: [Rewind] Deleted ${$}`);
                z.push($)
            }
        } else if (K) {
            let J = Mn4($, j);
            if (_ += J?.insertions || 0, w += J?.deletions || 0, J?.insertions || J?.deletions) z.push($)
        } else if (cu8($, j)) _VY($, j), k(`FileHistory: [Rewind] Restored ${$} from ${j}`), z.push($)
    } catch ($) {
        _6($), d("tengu_file_history_rewind_restore_file_failed", {
            dryRun: K
        })
    }
    return {
        filesChanged: z,
        insertions: _,
        deletions: w
    }
}
// @from(Ln 335920, Col 0)
function cu8(A, q) {
    let K = $1(),
        Y = zz6(q),
        z = null;
    try {
        z = K.statSync(A)
    } catch (w) {
        if (w.code !== "ENOENT") return !0
    }
    let _ = null;
    try {
        _ = K.statSync(Y)
    } catch (w) {
        if (w.code !== "ENOENT") return !0
    }
    if (z === null !== (_ === null)) return !0;
    if (z === null || _ === null) return !1;
    if (z.mode !== _.mode || z.size !== _.size) return !0;
    if (z.mtimeMs < _.mtimeMs) return !1;
    try {
        let w = K.readFileSync(A, {
                encoding: "utf-8"
            }),
            O = K.readFileSync(Y, {
                encoding: "utf-8"
            });
        return w !== O
    } catch {
        return !0
    }
}
// @from(Ln 335952, Col 0)
function Mn4(A, q) {
    let K = [],
        Y = 0,
        z = 0;
    try {
        let _ = $1(),
            w = q && zz6(q),
            O = _.existsSync(A),
            $ = w && _.existsSync(w);
        if (!O && !$) return {
            filesChanged: K,
            insertions: Y,
            deletions: z
        };
        K.push(A);
        let H = O ? _.readFileSync(A, {
                encoding: "utf-8"
            }) : "",
            j = $ ? _.readFileSync(w, {
                encoding: "utf-8"
            }) : "";
        na(H, j).forEach((M) => {
            if (M.added) Y += M.count || 0;
            if (M.removed) z += M.count || 0
        })
    } catch (_) {
        _6(Error(`FileHistory: Error generating diffStats: ${_}`))
    }
    return {
        filesChanged: K,
        insertions: Y,
        deletions: z
    }
}
// @from(Ln 335987, Col 0)
function zVY(A, q) {
    return `${sNY("sha256").update(A).digest("hex").slice(0,16)}@v${q}`
}
// @from(Ln 335991, Col 0)
function zz6(A, q) {
    let K = c8();
    return aN1(K, "file-history", q || R1(), A)
}
// @from(Ln 335996, Col 0)
function du8(A, q) {
    let K = A !== null ? zVY(A, q) : null;
    if (A && K) {
        let Y = $1(),
            z = zz6(K),
            _ = Dn4(z);
        if (!Y.existsSync(_)) Y.mkdirSync(_);
        let w = Y.readFileSync(A, {
            encoding: "utf-8"
        });
        fz(z, w, {
            encoding: "utf-8",
            flush: !0
        });
        let O = Y.statSync(A),
            $ = O.mode;
        Pn4(z, $), d("tengu_file_history_backup_file_created", {
            version: q,
            fileSize: O.size
        })
    }
    return {
        backupFileName: K,
        version: q,
        backupTime: new Date
    }
}
// @from(Ln 336024, Col 0)
function _VY(A, q) {
    let K = $1(),
        Y = zz6(q);
    if (!K.existsSync(Y)) {
        d("tengu_file_history_rewind_restore_file_failed", {}), _6(Error(`FileHistory: [Rewind] Backup file not found: ${Y}`));
        return
    }
    let z = K.readFileSync(Y, {
            encoding: "utf-8"
        }),
        _ = Dn4(A);
    if (!K.existsSync(_)) K.mkdirSync(_);
    fz(A, z, {
        encoding: "utf-8",
        flush: !0
    });
    let w = K.statSync(Y).mode;
    Pn4(A, w)
}
// @from(Ln 336044, Col 0)
function Gn4(A, q) {
    for (let K of q.snapshots) {
        let Y = K.trackedFileBackups[A];
        if (Y !== void 0 && Y.version === 1) return Y.backupFileName
    }
    return
}
// @from(Ln 336052, Col 0)
function fn4(A) {
    if (!Xn4(A)) return A;
    let q = AA();
    if (A.startsWith(q)) return tNY(q, A);
    return A
}
// @from(Ln 336059, Col 0)
function AV1(A) {
    if (Xn4(A)) return A;
    return aN1(AA(), A)
}
// @from(Ln 336064, Col 0)
function qV1(A, q) {
    if (!iz()) return;
    let K = [],
        Y = new Set;
    for (let z of A) {
        let _ = {};
        for (let [w, O] of Object.entries(z.trackedFileBackups)) {
            let $ = fn4(w);
            Y.add($), _[$] = O
        }
        K.push({
            ...z,
            trackedFileBackups: _
        })
    }
    q({
        snapshots: K,
        trackedFiles: Y,
        snapshotSequence: K.length
    })
}
// @from(Ln 336085, Col 0)
async function KV1(A) {
    if (!iz()) return;
    let q = A.fileHistorySnapshots;
    if (!q || A.messages.length === 0) return;
    let Y = A.messages[A.messages.length - 1]?.sessionId;
    if (!Y) {
        _6(Error("FileHistory: Failed to copy backups on restore (no previous session id)"));
        return
    }
    let z = R1();
    if (Y === z) {
        k(`FileHistory: No need to copy file history for resuming with same session id: ${z}`);
        return
    }
    try {
        let _ = aN1(c8(), "file-history", z);
        await KVY(_, {
            recursive: !0
        });
        let w = 0;
        if (await Promise.allSettled(q.map(async (O) => {
                let $ = Object.values(O.trackedFileBackups).filter((J) => J.backupFileName !== null);
                if (!(await Promise.allSettled($.map(async ({
                        backupFileName: J
                    }) => {
                        let M = zz6(J, Y),
                            D = aN1(_, J);
                        try {
                            await qVY(M, D)
                        } catch (X) {
                            let P = X.code;
                            if (P === "EEXIST") return;
                            if (P === "ENOENT") throw _6(Error(`FileHistory: Failed to copy backup ${J} on restore (backup file does not exist in ${Y})`)), X;
                            _6(Error("FileHistory: Error hard linking backup file from previous session"));
                            try {
                                await AVY(M, D)
                            } catch (W) {
                                throw _6(Error("FileHistory: Error copying over backup from previous session")), W
                            }
                        }
                        k(`FileHistory: Copied backup ${J} from session ${Y} to ${z}`)
                    }))).some((J) => J.status === "rejected")) _l6(O.messageId, O, !1).catch((J) => {
                    _6(Error("FileHistory: Failed to record copy backup snapshot"))
                });
                else w++
            })), w > 0) d("tengu_file_history_resume_copy_failed", {
            numSnapshots: q.length,
            failedSnapshots: w
        })
    } catch (_) {
        _6(_)
    }
}
// @from(Ln 336139, Col 0)
function wVY(A, q) {
    let K = A.snapshots.at(-1),
        Y = q.snapshots.at(-1);
    if (!Y) return;
    let z = $1();
    for (let _ of q.trackedFiles) {
        let w = AV1(_),
            O = K?.trackedFileBackups[_],
            $ = Y.trackedFileBackups[_];
        if (O?.backupFileName === $?.backupFileName && O?.version === $?.version) continue;
        let H = null;
        if (O?.backupFileName) try {
            let J = zz6(O.backupFileName);
            if (z.existsSync(J)) H = z.readFileSync(J, {
                encoding: "utf-8"
            })
        } catch {}
        let j = null;
        if ($?.backupFileName) try {
            let J = zz6($.backupFileName);
            if (z.existsSync(J)) j = z.readFileSync(J, {
                encoding: "utf-8"
            })
        } catch {} else if ($?.backupFileName === null) j = null;
        if (H !== j) L66(w, H, j)
    }
}
// @from(Ln 336167, Col 0)
function Tn4(A) {
    if (OVY) console.error(eNY(A, !1, 5))
}
// @from(Ln 336170, Col 4)
Jn4 = 100
// @from(Ln 336171, Col 4)
OVY = !1
// @from(Ln 336172, Col 4)
JN = E(() => {
    SA();
    g1();
    H1();
    T1();
    g1();
    k1();
    Oq();
    A8();
    ED6();
    V1();
    k8();
    cf6()
})
// @from(Ln 336193, Col 0)
function JVY(A) {
    if (A.type !== "attachment") return A;
    let q = A.attachment;
    if (q.type === "new_file") return {
        ...A,
        attachment: {
            ...q,
            type: "file",
            displayPath: lu8(G1(), q.filename)
        }
    };
    if (q.type === "new_directory") return {
        ...A,
        attachment: {
            ...q,
            type: "directory",
            displayPath: lu8(G1(), q.path)
        }
    };
    if (!("displayPath" in q)) {
        let K = "filename" in q ? q.filename : ("path" in q) ? q.path : ("skillDir" in q) ? q.skillDir : void 0;
        if (K) return {
            ...A,
            attachment: {
                ...q,
                displayPath: lu8(G1(), K)
            }
        }
    }
    return A
}
// @from(Ln 336225, Col 0)
function zV1(A) {
    return Nn4(A).messages
}
// @from(Ln 336229, Col 0)
function Nn4(A) {
    try {
        let q = A.map(JVY),
            K = new Set(CW);
        for (let H of q)
            if (H.type === "user" && H.permissionMode !== void 0 && !K.has(H.permissionMode)) H.permissionMode = void 0;
        let Y = _V1(q),
            z = $l6(Y),
            _ = Ol6(z),
            w = MVY(_),
            O;
        if (w.kind === "interrupted_turn") {
            let [H] = JM([p1({
                content: "Continue from where you left off.",
                isMeta: !0
            })]);
            _.push(H), O = {
                kind: "interrupted_prompt",
                message: H
            }
        } else O = w;
        let $ = -1;
        for (let H = _.length - 1; H >= 0; H--) {
            let j = _[H];
            if (j.type !== "system" && j.type !== "progress") {
                $ = H;
                break
            }
        }
        if ($ !== -1 && _[$].type === "user") _.splice($ + 1, 0, $Z({
            content: N36
        }));
        return {
            messages: _,
            turnInterruptionState: O
        }
    } catch (q) {
        throw _6(q), q
    }
}
// @from(Ln 336270, Col 0)
function MVY(A) {
    if (A.length === 0) return {
        kind: "none"
    };
    let q, K = -1;
    for (let Y = A.length - 1; Y >= 0; Y--) {
        let z = A[Y];
        if (z.type !== "system" && z.type !== "progress") {
            q = z, K = Y;
            break
        }
    }
    if (!q) return {
        kind: "none"
    };
    if (q.type === "assistant") return {
        kind: "none"
    };
    if (q.type === "user") {
        if (q.isMeta || q.isCompactSummary) return {
            kind: "none"
        };
        if (wl6(q)) {
            if (DVY(q, A, K)) return {
                kind: "none"
            };
            return {
                kind: "interrupted_turn"
            }
        }
        return {
            kind: "interrupted_prompt",
            message: q
        }
    }
    if (q.type === "attachment") return {
        kind: "interrupted_turn"
    };
    return {
        kind: "none"
    }
}
// @from(Ln 336313, Col 0)
function DVY(A, q, K) {
    let Y = A.message.content;
    if (!Array.isArray(Y)) return !1;
    let z = Y[0];
    if (z?.type !== "tool_result") return !1;
    let _ = z.tool_use_id;
    for (let w = K - 1; w >= 0; w--) {
        let O = q[w];
        if (O.type !== "assistant") continue;
        for (let $ of O.message.content)
            if ($.type === "tool_use" && $.id === _) return $.name === $VY || $.name === HVY || $.name === jVY
    }
    return !1
}
// @from(Ln 336328, Col 0)
function XVY(A) {
    for (let q of A) {
        if (q.type !== "attachment") continue;
        if (q.attachment.type === "invoked_skills") {
            for (let K of q.attachment.skills)
                if (K.name && K.path && K.content) Uw6(K.name, K.path, K.content, null)
        }
        if (q.attachment.type === "skill_listing") Vn4()
    }
}
// @from(Ln 336338, Col 0)
async function h66(A, q) {
    try {
        let K = null,
            Y = null,
            z;
        if (A === void 0) K = await iu8(0);
        else if (q) {
            Y = [];
            for (let O of await x$6(q)) {
                if (O.type === "assistant" || O.type === "user") {
                    let $ = PVY(O);
                    if ($) Y.push($)
                }
                z = O.session_id
            }
        } else if (typeof A === "string") K = await Hl6(A), z = A;
        else K = A;
        if (!K && !Y) return null;
        if (K) {
            if (Hh(K)) K = await hb(K);
            if (!z) z = n_(K);
            if (z) await EP1(K, eJ(z));
            KV1(K), Y = K.messages
        }
        XVY(Y);
        let _ = Nn4(Y);
        Y = _.messages;
        let w = await C0("resume", {
            sessionId: z
        });
        return Y.push(...w), {
            messages: Y,
            turnInterruptionState: _.turnInterruptionState,
            fileHistorySnapshots: K?.fileHistorySnapshots,
            attributionSnapshots: K?.attributionSnapshots,
            contentReplacements: K?.contentReplacements,
            contextCollapseCommits: K?.contextCollapseCommits,
            contextCollapseSnapshot: K?.contextCollapseSnapshot,
            sessionId: z,
            agentName: K?.agentName,
            agentColor: K?.agentColor,
            agentSetting: K?.agentSetting,
            customTitle: K?.customTitle,
            tag: K?.tag,
            mode: K?.mode,
            prNumber: K?.prNumber,
            prUrl: K?.prUrl,
            prRepository: K?.prRepository,
            fullPath: K?.fullPath
        }
    } catch (K) {
        throw _6(K), K
    }
}
// @from(Ln 336393, Col 0)
function PVY(A) {
    if (A.type === "assistant") return {
        type: A.type,
        message: A.message,
        uuid: vn4(),
        timestamp: new Date().toISOString(),
        requestId: void 0
    };
    else if (A.type === "user") return {
        type: A.type,
        message: A.message,
        uuid: vn4(),
        timestamp: new Date().toISOString()
    };
    return
}
// @from(Ln 336409, Col 4)
$VY
// @from(Ln 336409, Col 9)
HVY
// @from(Ln 336409, Col 14)
jVY = null
// @from(Ln 336410, Col 4)
if6 = E(() => {
    k1();
    lA();
    Oq();
    JA();
    rH();
    EC6();
    K_();
    y66();
    JN();
    T1();
    M0();
    $VY = (gu(), k4(UQ)).BRIEF_TOOL_NAME, HVY = (gu(), k4(UQ)).LEGACY_BRIEF_TOOL_NAME
})
// @from(Ln 336425, Col 0)
function kn4({
    onStashAndContinue: A,
    onCancel: q
}) {
    let [K, Y] = _z6.useState(null), z = K !== null ? [...K.tracked, ...K.untracked] : [], [_, w] = _z6.useState(!0), [O, $] = _z6.useState(!1), [H, j] = _z6.useState(null);
    _z6.useEffect(() => {
        (async () => {
            try {
                let P = await d31();
                Y(P)
            } catch (P) {
                let W = P instanceof Error ? P.message : String(P);
                k(`Error getting changed files: ${W}`, {
                    level: "error"
                }), j("Failed to get changed files")
            } finally {
                w(!1)
            }
        })()
    }, []);
    let J = async () => {
        $(!0);
        try {
            if (k("Stashing changes before teleport..."), await L58("Teleport auto-stash")) k("Successfully stashed changes"), A();
            else j("Failed to stash changes")
        } catch (X) {
            let P = X instanceof Error ? X.message : String(X);
            k(`Error stashing changes: ${P}`, {
                level: "error"
            }), j("Failed to stash changes")
        } finally {
            $(!1)
        }
    }, M = (X) => {
        if (X === "stash") J();
        else q()
    };
    if (_) return wj.default.createElement(m, {
        flexDirection: "column",
        padding: 1
    }, wj.default.createElement(m, {
        marginBottom: 1
    }, wj.default.createElement(Wq, null), wj.default.createElement(T, null, " Checking git status", a6.ellipsis)));
    if (H) return wj.default.createElement(m, {
        flexDirection: "column",
        padding: 1
    }, wj.default.createElement(T, {
        bold: !0,
        color: "error"
    }, "Error: ", H), wj.default.createElement(m, {
        marginTop: 1
    }, wj.default.createElement(T, {
        dimColor: !0
    }, "Press "), wj.default.createElement(T, {
        bold: !0
    }, "Escape"), wj.default.createElement(T, {
        dimColor: !0
    }, " to cancel")));
    let D = z.length > 8;
    return wj.default.createElement(m8, {
        title: "Working Directory Has Changes",
        onCancel: q
    }, wj.default.createElement(T, null, "Teleport will switch git branches. The following changes were found:"), wj.default.createElement(m, {
        flexDirection: "column",
        paddingLeft: 2
    }, z.length > 0 ? D ? wj.default.createElement(T, null, z.length, " files changed") : z.map((X, P) => wj.default.createElement(T, {
        key: P
    }, X)) : wj.default.createElement(T, {
        dimColor: !0
    }, "No changes detected")), wj.default.createElement(T, null, "Would you like to stash these changes and continue with teleport?"), O ? wj.default.createElement(m, null, wj.default.createElement(Wq, null), wj.default.createElement(T, null, " Stashing changes...")) : wj.default.createElement(T8, {
        options: [{
            label: "Stash changes and continue",
            value: "stash"
        }, {
            label: "Exit",
            value: "exit"
        }],
        onChange: M
    }))
}
// @from(Ln 336505, Col 4)
wj
// @from(Ln 336505, Col 8)
_z6
// @from(Ln 336506, Col 4)
En4 = E(() => {
    i6();
    $5();
    H1();
    LO();
    o9();
    b7();
    wq();
    wj = t(P6(), 1), _z6 = t(P6(), 1)
})
// @from(Ln 336516, Col 0)
async function jl6() {
    let A = sA()?.accessToken;
    if (!A) throw Error("Claude Code web sessions require authentication with a Claude.ai account. API key authentication is not sufficient. Please run /login to authenticate, or check your authentication status with /status.");
    let q = await mR();
    if (!q) throw Error("Unable to get organization UUID");
    let K = `${P7().BASE_API_URL}/v1/environment_providers`;
    try {
        let Y = {
                ...zj(A),
                "x-organization-uuid": q
            },
            z = await X8.get(K, {
                headers: Y,
                timeout: 15000
            });
        if (z.status !== 200) throw Error(`Failed to fetch environments: ${z.status} ${z.statusText}`);
        return z.data.environments
    } catch (Y) {
        let z = Y instanceof Error ? Y : Error(String(Y));
        throw _6(z), Error(`Failed to fetch environments: ${z.message}`)
    }
}
// @from(Ln 336538, Col 4)
wV1 = E(() => {
    kK();
    F5();
    fA();
    W0();
    k1();
    EZ()
})
// @from(Ln 336546, Col 0)
async function nu8() {
    if (!iA()) return !1;
    return dz()
}
// @from(Ln 336550, Col 0)
async function yn4() {
    return await Ro({
        ignoreUntracked: !0
    })
}
// @from(Ln 336555, Col 4)
ru8 = E(() => {
    $5();
    fA();
    yG();
    wV1();
    W0();
    F5();
    EZ();
    H1();
    s8()
})
// @from(Ln 336567, Col 0)
function OV1(A) {
    let q = A6(18),
        {
            onComplete: K,
            errorsToIgnore: Y
        } = A,
        z = Y === void 0 ? WVY : Y,
        [_, w] = DE.useState(null),
        [O, $] = DE.useState(!1),
        H;
    if (q[0] !== z || q[1] !== K) H = async () => {
        let V = await ou8(),
            L = new Set(Array.from(V).filter((h) => !z.has(h)));
        if (L.size === 0) {
            K();
            return
        }
        if (L.has("needsLogin")) w("needsLogin");
        else if (L.has("needsGitStash")) w("needsGitStash")
    }, q[0] = z, q[1] = K, q[2] = H;
    else H = q[2];
    let j = H,
        J, M;
    if (q[3] !== j) J = () => {
        j()
    }, M = [j], q[3] = j, q[4] = J, q[5] = M;
    else J = q[4], M = q[5];
    DE.useEffect(J, M);
    let D = ZVY,
        X;
    if (q[6] !== j) X = () => {
        $(!1), j()
    }, q[6] = j, q[7] = X;
    else X = q[7];
    let P = X,
        W;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) W = () => {
        $(!0)
    }, q[8] = W;
    else W = q[8];
    let Z = W,
        G;
    if (q[9] === Symbol.for("react.memo_cache_sentinel")) G = (V) => {
        if (V === "login") Z();
        else D()
    }, q[9] = G;
    else G = q[9];
    let f = G,
        v;
    if (q[10] !== j) v = () => {
        j()
    }, q[10] = j, q[11] = v;
    else v = q[11];
    let N = v;
    if (!_) return null;
    switch (_) {
        case "needsGitStash": {
            let V;
            if (q[12] !== N) V = DE.default.createElement(kn4, {
                onStashAndContinue: N,
                onCancel: D
            }), q[12] = N, q[13] = V;
            else V = q[13];
            return V
        }
        case "needsLogin": {
            if (O) {
                let h;
                if (q[14] !== P) h = DE.default.createElement(uY6, {
                    onDone: P,
                    mode: "login",
                    forceLoginMethod: "claudeai"
                }), q[14] = P, q[15] = h;
                else h = q[15];
                return h
            }
            let V;
            if (q[16] === Symbol.for("react.memo_cache_sentinel")) V = DE.default.createElement(m, {
                flexDirection: "column"
            }, DE.default.createElement(T, {
                dimColor: !0
            }, "Teleport requires a Claude.ai account."), DE.default.createElement(T, {
                dimColor: !0
            }, "Your Claude Pro/Max subscription will be used by Claude Code.")), q[16] = V;
            else V = q[16];
            let L;
            if (q[17] === Symbol.for("react.memo_cache_sentinel")) L = DE.default.createElement(m8, {
                title: "Log in to Claude",
                onCancel: D
            }, V, DE.default.createElement(T8, {
                options: [{
                    label: "Login with Claude account",
                    value: "login"
                }, {
                    label: "Exit",
                    value: "exit"
                }],
                onChange: f
            })), q[17] = L;
            else L = q[17];
            return L
        }
    }
}
// @from(Ln 336672, Col 0)
function ZVY() {
    fK(0)
}
// @from(Ln 336675, Col 0)
async function ou8() {
    let A = new Set,
        [q, K] = await Promise.all([nu8(), yn4()]);
    if (q) A.add("needsLogin");
    if (!K) A.add("needsGitStash");
    return A
}
// @from(Ln 336682, Col 4)
DE
// @from(Ln 336682, Col 8)
WVY
// @from(Ln 336683, Col 4)
au8 = E(() => {
    e6();
    i6();
    wq();
    o9();
    $c6();
    En4();
    c_();
    ru8();
    DE = t(P6(), 1), WVY = new Set
})
// @from(Ln 336695, Col 0)
function fVY(A) {
    let q = su8.get(A);
    if (!q) q = Bu(async (K, Y, z) => await TVY(A, K, Y, z)), su8.set(A, q);
    return q
}
// @from(Ln 336700, Col 0)
async function TVY(A, q, K, Y) {
    for (let z = 1; z <= $V1; z++) {
        try {
            let w = wz6.get(A),
                O = {
                    ...Y
                };
            if (w) O["Last-Uuid"] = w;
            let $ = await X8.put(K, q, {
                headers: O,
                validateStatus: (H) => H < 500
            });
            if ($.status === 200 || $.status === 201) return wz6.set(A, q.uuid), k(`Successfully persisted session log entry for session ${A}`), !0;
            if ($.status === 409) {
                let H = $.headers["x-last-uuid"];
                if (H === q.uuid) return wz6.set(A, q.uuid), k(`Session entry ${q.uuid} already present on server, recovering from stale state`), U1("info", "session_persist_recovered_from_409"), !0;
                if (H) wz6.set(A, H), k(`Session 409: adopting server lastUuid=${H} from header, retrying entry ${q.uuid}`);
                else {
                    let j = await tu8(A, K, Y),
                        J = vVY(j);
                    if (J) wz6.set(A, J), k(`Session 409: re-fetched ${j.length} entries, adopting lastUuid=${J}, retrying entry ${q.uuid}`);
                    else {
                        let D = $.data.error?.message || "Concurrent modification detected";
                        return _6(Error(`Session persistence conflict: UUID mismatch for session ${A}, entry ${q.uuid}. ${D}`)), U1("error", "session_persist_fail_concurrent_modification"), !1
                    }
                }
                U1("info", "session_persist_409_adopt_server_uuid");
                continue
            }
            if ($.status === 401) return k("Session token expired or invalid"), U1("error", "session_persist_fail_bad_token"), !1;
            k(`Failed to persist session log: ${$.status} ${$.statusText}`), U1("error", "session_persist_fail_status", {
                status: $.status,
                attempt: z
            })
        } catch (w) {
            let O = w;
            _6(Error(`Error persisting session log: ${O.message}`)), U1("error", "session_persist_fail_status", {
                status: O.status,
                attempt: z
            })
        }
        if (z === $V1) return k(`Remote persistence failed after ${$V1} attempts`), U1("error", "session_persist_error_retries_exhausted", {
            attempt: z
        }), !1;
        let _ = Math.min(GVY * Math.pow(2, z - 1), 8000);
        k(`Remote persistence attempt ${z}/${$V1} failed, retrying in ${_}ms…`), await new Promise((w) => setTimeout(w, _))
    }
    return !1
}
// @from(Ln 336749, Col 0)
async function Ln4(A, q, K) {
    let Y = UW();
    if (!Y) return k("No session token available for session persistence"), U1("error", "session_persist_fail_jwt_no_token"), !1;
    let z = {
        Authorization: `Bearer ${Y}`,
        "Content-Type": "application/json"
    };
    return await fVY(A)(q, K, z)
}
// @from(Ln 336758, Col 0)
async function Rn4(A, q) {
    let K = UW();
    if (!K) return k("No session token available for fetching session logs"), U1("error", "session_get_fail_no_token"), null;
    let Y = {
            Authorization: `Bearer ${K}`
        },
        z = await tu8(A, q, Y);
    if (z && z.length > 0) {
        let _ = z[z.length - 1];
        if (_ && "uuid" in _ && _.uuid) wz6.set(A, _.uuid)
    }
    return z
}
// @from(Ln 336771, Col 0)
async function hn4(A, q, K) {
    let Y = `${P7().BASE_API_URL}/v1/session_ingress/session/${A}`;
    k(`[session-ingress] Fetching session logs from: ${Y}`);
    let z = {
        ...zj(q),
        "x-organization-uuid": K
    };
    return await tu8(A, Y, z)
}
// @from(Ln 336780, Col 0)
async function Sn4(A, q, K) {
    let Y = `${P7().BASE_API_URL}/v1/code/sessions/${A}/teleport-events`,
        z = {
            ...zj(q),
            "x-organization-uuid": K
        };
    k(`[teleport] Fetching events from: ${Y}`);
    let _ = [],
        w, O = 0,
        $ = 100;
    while (O < $) {
        let H = {
            limit: 1000
        };
        if (w !== void 0) H.cursor = w;
        let j;
        try {
            j = await X8.get(Y, {
                headers: z,
                params: H,
                timeout: 20000,
                validateStatus: (D) => D < 500
            })
        } catch (D) {
            return _6(Error(`Teleport events fetch failed: ${D.message}`)), U1("error", "teleport_events_fetch_fail"), null
        }
        if (j.status === 404) return k(`[teleport] Session ${A} not found (page ${O})`), U1("warn", "teleport_events_not_found"), O === 0 ? null : _;
        if (j.status === 401) throw U1("error", "teleport_events_bad_token"), Error("Your session has expired. Please run /login to sign in again.");
        if (j.status !== 200) return _6(Error(`Teleport events returned ${j.status}: ${B6(j.data)}`)), U1("error", "teleport_events_bad_status"), null;
        let {
            data: J,
            next_cursor: M
        } = j.data;
        if (!Array.isArray(J)) return _6(Error(`Teleport events invalid response shape: ${B6(j.data)}`)), U1("error", "teleport_events_invalid_shape"), null;
        for (let D of J)
            if (D.payload !== null) _.push(D.payload);
        if (O++, M == null) break;
        w = M
    }
    if (O >= $) _6(Error(`Teleport events hit page cap (${$}) for ${A}`)), U1("warn", "teleport_events_page_cap");
    return k(`[teleport] Fetched ${_.length} events over ${O} page(s) for ${A}`), _
}
// @from(Ln 336822, Col 0)
async function tu8(A, q, K) {
    try {
        let Y = await X8.get(q, {
            headers: K,
            timeout: 20000,
            validateStatus: (z) => z < 500,
            params: t6(process.env.CLAUDE_AFTER_LAST_COMPACT) ? {
                after_last_compact: !0
            } : void 0
        });
        if (Y.status === 200) {
            let z = Y.data;
            if (!z || typeof z !== "object" || !Array.isArray(z.loglines)) return _6(Error(`Invalid session logs response format: ${B6(z)}`)), U1("error", "session_get_fail_invalid_response"), null;
            let _ = z.loglines;
            return k(`Fetched ${_.length} session logs for session ${A}`), _
        }
        if (Y.status === 404) return k(`No existing logs for session ${A}`), U1("warn", "session_get_no_logs_for_session"), [];
        if (Y.status === 401) throw k("Auth token expired or invalid"), U1("error", "session_get_fail_bad_token"), Error("Your session has expired. Please run /login to sign in again.");
        return k(`Failed to fetch session logs: ${Y.status} ${Y.statusText}`), U1("error", "session_get_fail_status", {
            status: Y.status
        }), null
    } catch (Y) {
        let z = Y;
        return _6(Error(`Error fetching session logs: ${z.message}`)), U1("error", "session_get_fail_status", {
            status: z.status
        }), null
    }
}