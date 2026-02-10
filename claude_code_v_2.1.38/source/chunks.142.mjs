
// @from(Ln 360095, Col 0)
async function _yA(A, q) {
    let {
        getAppState: K,
        setAppState: Y,
        signal: z,
        timeoutMs: w = MP
    } = q || {}, H = {
        ...aX(void 0),
        hook_event_name: "SessionEnd",
        reason: A
    }, $ = await AyA({
        getAppState: K,
        hookInput: H,
        matchQuery: A,
        signal: z,
        timeoutMs: w
    });
    for (let O of $)
        if (!O.succeeded && O.output) process.stderr.write(`SessionEnd hook [${O.command}] failed: ${O.output}
`);
    if (Y) {
        let O = U6();
        iD1(Y, O)
    }
}
// @from(Ln 360120, Col 0)
async function* I51(A, q, K, Y, z, w, H, $ = MP) {
    h(`executePermissionRequestHooks called for tool: ${A}`);
    let O = {
        ...aX(z),
        hook_event_name: "PermissionRequest",
        tool_name: A,
        tool_input: K,
        permission_suggestions: w
    };
    yield* NI({
        hookInput: O,
        toolUseID: q,
        matchQuery: A,
        signal: H,
        timeoutMs: $,
        toolUseContext: Y
    })
}
// @from(Ln 360138, Col 0)
async function JyA(A, q, K = 5000) {
    let Y = C8(),
        z = Y?.statusLine;
    if (Y?.disableAllHooks === !0) return;
    if (!z || z.type !== "command") return;
    let w = q || AbortSignal.timeout(K);
    try {
        let H = Q1(A),
            $ = await BW6(z, "StatusLine", "statusLine", H, w, zE());
        if ($.aborted) return;
        if ($.status === 0) {
            let O = $.stdout.trim().split(`
`).flatMap((_) => _.trim() || []).join(`
`);
            if (O) return O
        }
        return
    } catch (H) {
        h(`Status hook failed: ${H}`, {
            level: "error"
        });
        return
    }
}
// @from(Ln 360162, Col 0)
async function XyA(A, q, K = 5000) {
    let Y = C8();
    if (Y?.disableAllHooks === !0) return [];
    let z = Y?.fileSuggestion;
    if (!z || z.type !== "command") return [];
    let w = q || AbortSignal.timeout(K);
    try {
        let H = Q1(A),
            $ = {
                type: "command",
                command: z.command
            },
            O = await BW6($, "FileSuggestion", "FileSuggestion", H, w, zE());
        if (O.aborted || O.status !== 0) return [];
        return O.stdout.split(`
`).map((_) => _.trim()).filter(Boolean)
    } catch (H) {
        return h(`File suggestion helper failed: ${H}`, {
            level: "error"
        }), []
    }
}
// @from(Ln 360184, Col 0)
async function XhY({
    hook: A,
    messages: q,
    hookName: K,
    toolUseID: Y,
    hookEvent: z,
    timeoutMs: w,
    signal: H
}) {
    let $ = A.timeout ?? w,
        {
            signal: O,
            cleanup: _
        } = fR(AbortSignal.timeout($), H);
    try {
        if (O.aborted) return _(), {
            outcome: "cancelled",
            hook: A
        };
        let J = await new Promise((X, D) => {
            let j = () => D(Error("Function hook cancelled"));
            O.addEventListener("abort", j), Promise.resolve(A.callback(q, O)).then((M) => {
                O.removeEventListener("abort", j), X(M)
            }).catch((M) => {
                O.removeEventListener("abort", j), D(M)
            })
        });
        if (_(), J) return {
            outcome: "success",
            hook: A
        };
        return {
            blockingError: {
                blockingError: A.errorMessage,
                command: "function"
            },
            outcome: "blocking",
            hook: A
        }
    } catch (J) {
        if (_(), J instanceof Error && (J.message === "Function hook cancelled" || J.name === "AbortError")) return {
            outcome: "cancelled",
            hook: A
        };
        return K1(J instanceof Error ? J : Error(String(J))), {
            message: kq({
                type: "hook_error_during_execution",
                hookName: K,
                toolUseID: Y,
                hookEvent: z,
                content: J instanceof Error ? J.message : "Function hook execution error"
            }),
            outcome: "non_blocking_error",
            hook: A
        }
    }
}
// @from(Ln 360241, Col 0)
async function DhY({
    toolUseID: A,
    hook: q,
    hookEvent: K,
    hookInput: Y,
    signal: z,
    hookIndex: w,
    toolUseContext: H
}) {
    let $ = H ? {
            getAppState: H.getAppState,
            setAppState: H.setAppState
        } : void 0,
        O = await q.callback(Y, A, z, w, $);
    if (SK1(O)) return {
        outcome: "success",
        hook: q
    };
    return {
        ...Gi4({
            json: O,
            command: "callback",
            hookName: `${K}:Callback`,
            toolUseID: A,
            hookEvent: K,
            expectedHookEvent: K,
            stdout: void 0,
            stderr: void 0,
            exitCode: void 0
        }),
        outcome: "success",
        hook: q
    }
}
// @from(Ln 360276, Col 0)
function Mi4(A) {
    return A.map(({
        hook: q
    }) => {
        if (q.type === "command") return {
            type: "command",
            command: q.command
        };
        else if (q.type === "prompt") return {
            type: "prompt",
            prompt: q.prompt
        };
        else if (q.type === "function") return {
            type: "function",
            name: "function"
        };
        else if (q.type === "callback") return {
            type: "callback",
            name: "callback"
        };
        return {
            type: "unknown"
        }
    })
}
// @from(Ln 360301, Col 4)
MP = 600000
// @from(Ln 360302, Col 4)
aM = v(() => {
    bjA();
    N7();
    ujA();
    g_6();
    x3();
    B6();
    cA();
    jq1();
    lq();
    p8();
    u6();
    aa();
    N0();
    As();
    gMA();
    q3();
    XB();
    Z6();
    y6();
    WB1();
    OJ6();
    $J6();
    FW();
    hK1();
    Wn7();
    Di4();
    eU();
    m6()
})
// @from(Ln 360332, Col 0)
async function PP(A, {
    sessionId: q,
    agentType: K,
    model: Y,
    forceSyncExecution: z
} = {}) {
    let w = [],
        H = [];
    if (Ap()) h("Skipping plugin hooks - allowManagedHooksOnly is enabled");
    else try {
        await pa()
    } catch (O) {
        let _ = O instanceof Error ? Error(`Failed to load plugin hooks during ${A}: ${O.message}`) : Error(`Failed to load plugin hooks during ${A}: ${String(O)}`);
        if (O instanceof Error && O.stack) _.stack = O.stack;
        K1(_);
        let J = O instanceof Error ? O.message : String(O),
            X = "";
        if (J.includes("Failed to clone") || J.includes("network") || J.includes("ETIMEDOUT") || J.includes("ENOTFOUND")) X = "This appears to be a network issue. Check your internet connection and try again.";
        else if (J.includes("Permission denied") || J.includes("EACCES") || J.includes("EPERM")) X = "This appears to be a permissions issue. Check file permissions on ~/.claude/plugins/";
        else if (J.includes("Invalid") || J.includes("parse") || J.includes("JSON") || J.includes("schema")) X = "This appears to be a configuration issue. Check your plugin settings in .claude/settings.json";
        else X = "Please fix the plugin configuration or remove problematic plugins from your settings.";
        h(`Warning: Failed to load plugin hooks. SessionStart hooks from plugins will not execute. Error: ${J}. ${X}`, {
            level: "warn"
        })
    }
    let $ = K ?? PN1();
    for await (let O of $yA(A, q, $, Y, void 0, void 0, z)) {
        if (O.message) w.push(O.message);
        if (O.additionalContexts && O.additionalContexts.length > 0) H.push(...O.additionalContexts)
    }
    if (H.length > 0) {
        let O = kq({
            type: "hook_additional_context",
            content: H,
            hookName: "SessionStart",
            toolUseID: "SessionStart",
            hookEvent: "SessionStart"
        });
        w.push(O)
    }
    return w
}
// @from(Ln 360374, Col 0)
async function FW6(A, {
    forceSyncExecution: q
} = {}) {
    let K = [],
        Y = [];
    if (Ap()) h("Skipping plugin hooks - allowManagedHooksOnly is enabled");
    else try {
        await pa()
    } catch (z) {
        let w = z instanceof Error ? z.message : String(z);
        h(`Warning: Failed to load plugin hooks. Setup hooks from plugins will not execute. Error: ${w}`, {
            level: "warn"
        })
    }
    for await (let z of OyA(A, void 0, void 0, q)) {
        if (z.message) K.push(z.message);
        if (z.additionalContexts && z.additionalContexts.length > 0) Y.push(...z.additionalContexts)
    }
    if (Y.length > 0) {
        let z = kq({
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
// @from(Ln 360404, Col 4)
Rt = v(() => {
    aM();
    pu1();
    y6();
    Z6();
    FW();
    jq1();
    B6()
})
// @from(Ln 360417, Col 0)
function jhY(A) {
    if (A.type !== "attachment") return A;
    let q = A.attachment;
    if (q.type === "new_file") return {
        ...A,
        attachment: {
            ...q,
            type: "file"
        }
    };
    if (q.type === "new_directory") return {
        ...A,
        attachment: {
            ...q,
            type: "directory"
        }
    };
    return A
}
// @from(Ln 360437, Col 0)
function Ig1(A) {
    try {
        let q = A.map(jhY),
            K = new Set(ox);
        for (let $ of q)
            if ($.type === "user" && $.permissionMode !== void 0 && !K.has($.permissionMode)) $.permissionMode = void 0;
        let Y = wP6(q),
            z = mQ1(Y),
            w = BQ1(z);
        if (w[w.length - 1]?.type === "user") w.push(qR({
            content: Kq1
        }));
        return w
    } catch (q) {
        throw K1(q), q
    }
}
// @from(Ln 360455, Col 0)
function MhY(A) {
    for (let q of A) {
        if (q.type !== "attachment") continue;
        if (q.attachment.type !== "invoked_skills") continue;
        for (let K of q.attachment.skills)
            if (K.name && K.path && K.content) MN1(K.name, K.path, K.content)
    }
}
// @from(Ln 360463, Col 0)
async function yt(A, q) {
    try {
        let K = null,
            Y = null,
            z;
        if (A === void 0) K = await jyA(0);
        else if (q) {
            Y = [];
            for (let H of await ZQ(q)) {
                if (H.type === "assistant" || H.type === "user") {
                    let $ = PhY(H);
                    if ($) Y.push($)
                }
                z = H.session_id
            }
        } else if (typeof A === "string") K = await DyA(A), z = A;
        else K = A;
        if (!K && !Y) return null;
        if (K) {
            if (sR(K)) K = await TI(K);
            if (!z) z = Xw(K);
            if (await Y_6(K), z) await A_6(K, Yj(z));
            CP6(K), Y = K.messages
        }
        MhY(Y), Y = Ig1(Y);
        let w = await PP("resume", {
            sessionId: z
        });
        return Y.push(...w), {
            messages: Y,
            fileHistorySnapshots: K?.fileHistorySnapshots,
            attributionSnapshots: K?.attributionSnapshots,
            sessionId: z,
            agentName: K?.agentName,
            agentColor: K?.agentColor,
            agentSetting: K?.agentSetting,
            customTitle: K?.customTitle,
            tag: K?.tag,
            mode: K?.mode,
            fullPath: K?.fullPath
        }
    } catch (K) {
        throw K1(K), K
    }
}
// @from(Ln 360509, Col 0)
function PhY(A) {
    if (A.type === "assistant") return {
        type: A.type,
        message: A.message,
        uuid: fi4(),
        timestamp: new Date().toISOString(),
        requestId: void 0
    };
    else if (A.type === "user") return {
        type: A.type,
        message: A.message,
        uuid: fi4(),
        timestamp: new Date().toISOString()
    };
    return
}
// @from(Ln 360525, Col 4)
nW1 = v(() => {
    y6();
    lq();
    N8();
    pB();
    mX();
    em6();
    AH();
    Rt();
    ZN();
    B6()
})
// @from(Ln 360538, Col 0)
function Vi4({
    onStashAndContinue: A,
    onCancel: q
}) {
    let [K, Y] = x51.useState(null), z = K !== null ? [...K.tracked, ...K.untracked] : [], [w, H] = x51.useState(!0), [$, O] = x51.useState(!1), [_, J] = x51.useState(null);
    x51.useEffect(() => {
        (async () => {
            try {
                let P = await _F6();
                Y(P)
            } catch (P) {
                let W = P instanceof Error ? P.message : String(P);
                h(`Error getting changed files: ${W}`, {
                    level: "error"
                }), J("Failed to get changed files")
            } finally {
                H(!1)
            }
        })()
    }, []);
    let X = async () => {
        O(!0);
        try {
            if (h("Stashing changes before teleport..."), await JH8("Teleport auto-stash")) h("Successfully stashed changes"), A();
            else J("Failed to stash changes")
        } catch (M) {
            let P = M instanceof Error ? M.message : String(M);
            h(`Error stashing changes: ${P}`, {
                level: "error"
            }), J("Failed to stash changes")
        } finally {
            O(!1)
        }
    }, D = (M) => {
        if (M === "stash") X();
        else q()
    };
    if (w) return g_.default.createElement(I, {
        flexDirection: "column",
        padding: 1
    }, g_.default.createElement(I, {
        marginBottom: 1
    }, g_.default.createElement(c4, null), g_.default.createElement(V, null, " Checking git status", l1.ellipsis)));
    if (_) return g_.default.createElement(I, {
        flexDirection: "column",
        padding: 1
    }, g_.default.createElement(V, {
        bold: !0,
        color: "error"
    }, "Error: ", _), g_.default.createElement(I, {
        marginTop: 1
    }, g_.default.createElement(V, {
        dimColor: !0
    }, "Press "), g_.default.createElement(V, {
        bold: !0
    }, "Escape"), g_.default.createElement(V, {
        dimColor: !0
    }, " to cancel")));
    let j = z.length > 8;
    return g_.default.createElement(w8, {
        title: "Working Directory Has Changes",
        onCancel: q,
        borderDimColor: !0
    }, g_.default.createElement(V, null, "Teleport will switch git branches. The following changes were found:"), g_.default.createElement(I, {
        flexDirection: "column",
        paddingLeft: 2
    }, z.length > 0 ? j ? g_.default.createElement(V, null, z.length, " files changed") : z.map((M, P) => g_.default.createElement(V, {
        key: P
    }, M)) : g_.default.createElement(V, {
        dimColor: !0
    }, "No changes detected")), g_.default.createElement(V, null, "Would you like to stash these changes and continue with teleport?"), $ ? g_.default.createElement(I, null, g_.default.createElement(c4, null), g_.default.createElement(V, null, " Stashing changes...")) : g_.default.createElement(kA, {
        options: [{
            label: "Stash changes and continue",
            value: "stash"
        }, {
            label: "Exit",
            value: "exit"
        }],
        onChange: D
    }))
}
// @from(Ln 360619, Col 4)
g_
// @from(Ln 360619, Col 8)
x51
// @from(Ln 360620, Col 4)
Ni4 = v(() => {
    m1();
    h9();
    Z6();
    x2();
    wY();
    b7();
    Bq();
    g_ = o(X1(), 1), x51 = o(X1(), 1)
})
// @from(Ln 360630, Col 0)
async function rW1() {
    let A = a4()?.accessToken;
    if (!A) throw Error("Claude Code web sessions require authentication with a Claude.ai account. API key authentication is not sufficient. Please run /login to authenticate, or check your authentication status with /status.");
    let q = await Kb();
    if (!q) throw Error("Unable to get organization UUID");
    let K = `${P4().BASE_API_URL}/v1/environment_providers`;
    try {
        let Y = {
                ...rX(A),
                "x-organization-uuid": q
            },
            z = await sA.get(K, {
                headers: Y,
                timeout: 15000
            });
        if (z.status !== 200) throw Error(`Failed to fetch environments: ${z.status} ${z.statusText}`);
        return z.data.environments
    } catch (Y) {
        let z = Y instanceof Error ? Y : Error(String(Y));
        throw K1(z), Error(`Failed to fetch environments: ${z.message}`)
    }
}
// @from(Ln 360652, Col 4)
QW6 = v(() => {
    y5();
    Uz();
    J7();
    Pk();
    y6();
    UR()
})
// @from(Ln 360660, Col 0)
async function gW6() {
    if (!i8()) return !1;
    return XM()
}
// @from(Ln 360664, Col 0)
async function Ti4() {
    return await HA1({
        ignoreUntracked: !0
    })
}
// @from(Ln 360669, Col 0)
async function vi4() {
    try {
        return (await rW1()).length > 0
    } catch (A) {
        return h(`checkHasRemoteEnvironment failed: ${A instanceof Error?A.message:String(A)}`), !1
    }
}
// @from(Ln 360676, Col 0)
async function Ei4() {
    return await AI() !== null
}
// @from(Ln 360679, Col 0)
async function ki4(A, q) {
    try {
        let K = a4()?.accessToken;
        if (!K) return h("checkGithubAppInstalled: No access token found, assuming app not installed"), !1;
        let Y = await Kb();
        if (!Y) return h("checkGithubAppInstalled: No org UUID found, assuming app not installed"), !1;
        let z = `${P4().BASE_API_URL}/api/oauth/organizations/${Y}/code/repos/${A}/${q}`,
            w = {
                ...rX(K),
                "x-organization-uuid": Y
            };
        h(`Checking GitHub app installation for ${A}/${q}`);
        let H = await sA.get(z, {
            headers: w,
            timeout: 15000
        });
        if (H.status === 200) {
            if (H.data.status) {
                let $ = H.data.status.app_installed;
                return h(`GitHub app ${$?"is":"is not"} installed on ${A}/${q}`), $
            }
            return h(`GitHub app is not installed on ${A}/${q} (status is null)`), !1
        }
        return h(`checkGithubAppInstalled: Unexpected response status ${H.status}`), !1
    } catch (K) {
        if (sA.isAxiosError(K)) {
            let Y = K.response?.status;
            if (Y && Y >= 400 && Y < 500) return h(`checkGithubAppInstalled: Got ${Y} error, app likely not installed on ${A}/${q}`), !1
        }
        return h(`checkGithubAppInstalled error: ${K instanceof Error?K.message:String(K)}`), !1
    }
}
// @from(Ln 360711, Col 4)
MyA = v(() => {
    h9();
    J7();
    t31();
    QW6();
    Pk();
    Uz();
    UR();
    y5();
    Z6()
})
// @from(Ln 360723, Col 0)
function UW6({
    onComplete: A,
    errorsToIgnore: q = new Set
}) {
    let [K, Y] = sX.useState(null), [z, w] = sX.useState(!1), H = sX.useCallback(async () => {
        let D = await PyA(),
            j = new Set(Array.from(D).filter((M) => !q.has(M)));
        if (j.size === 0) {
            A();
            return
        }
        if (j.has("needsLogin")) Y("needsLogin");
        else if (j.has("needsGitStash")) Y("needsGitStash")
    }, [A, q]);
    sX.useEffect(() => {
        H()
    }, [H]);
    let $ = sX.useCallback(() => {
            w3(0)
        }, []),
        O = sX.useCallback(() => {
            w(!1), H()
        }, [H]),
        _ = sX.useCallback(() => {
            w(!0)
        }, [w]),
        J = sX.useCallback((D) => {
            if (D === "login") _();
            else $()
        }, [_, $]),
        X = sX.useCallback(() => {
            H()
        }, [H]);
    if (!K) return null;
    switch (K) {
        case "needsGitStash":
            return sX.default.createElement(Vi4, {
                onStashAndContinue: X,
                onCancel: $
            });
        case "needsLogin": {
            if (z) return sX.default.createElement(r31, {
                onDone: O,
                mode: "login",
                forceLoginMethod: "claudeai"
            });
            return sX.default.createElement(w8, {
                title: "Log in to Claude",
                onCancel: $,
                borderDimColor: !0
            }, sX.default.createElement(I, {
                flexDirection: "column"
            }, sX.default.createElement(V, {
                dimColor: !0
            }, "Teleport requires a Claude.ai account."), sX.default.createElement(V, {
                dimColor: !0
            }, "Your Claude Pro/Max subscription will be used by Claude Code.")), sX.default.createElement(kA, {
                options: [{
                    label: "Login with Claude account",
                    value: "login"
                }, {
                    label: "Exit",
                    value: "exit"
                }],
                onChange: J
            }))
        }
    }
}
// @from(Ln 360792, Col 0)
async function PyA() {
    let A = new Set,
        [q, K] = await Promise.all([gW6(), Ti4()]);
    if (q) A.add("needsLogin");
    if (!K) A.add("needsGitStash");
    return A
}
// @from(Ln 360799, Col 4)
sX
// @from(Ln 360800, Col 4)
WyA = v(() => {
    m1();
    Bq();
    wY();
    sF1();
    Ni4();
    w$();
    MyA();
    sX = o(X1(), 1)
})
// @from(Ln 360811, Col 0)
function Ri4(A) {
    let q = Li4.get(A);
    if (!q) q = rb(async (K, Y, z) => await GhY(A, K, Y, z)), Li4.set(A, q);
    return q
}
// @from(Ln 360816, Col 0)
async function GhY(A, q, K, Y) {
    for (let z = 1; z <= pW6; z++) {
        try {
            let H = dW6.get(A),
                $ = {
                    ...Y
                };
            if (H) $["Last-Uuid"] = H;
            let O = await sA.put(K, q, {
                headers: $,
                validateStatus: (_) => _ < 500
            });
            if (O.status === 200 || O.status === 201) return dW6.set(A, q.uuid), h(`Successfully persisted session log entry for session ${A}`), !0;
            if (O.status === 409) {
                if (O.headers["x-last-uuid"] === q.uuid) return dW6.set(A, q.uuid), h(`Session entry ${q.uuid} already present on server, recovering from stale state`), H8("info", "session_persist_recovered_from_409"), !0;
                let X = O.data.error?.message || "Concurrent modification detected";
                return K1(Error(`Session persistence conflict: UUID mismatch for session ${A}, entry ${q.uuid}. ${X}`)), H8("error", "session_persist_fail_concurrent_modification"), !1
            }
            if (O.status === 401) return h("Session token expired or invalid"), H8("error", "session_persist_fail_bad_token"), !1;
            h(`Failed to persist session log: ${O.status} ${O.statusText}`), H8("error", "session_persist_fail_status", {
                status: O.status,
                attempt: z
            })
        } catch (H) {
            let $ = H;
            K1(Error(`Error persisting session log: ${$.message}`)), H8("error", "session_persist_fail_status", {
                status: $.status,
                attempt: z
            })
        }
        if (z === pW6) return h(`Remote persistence failed after ${pW6} attempts`), H8("error", "session_persist_error_retries_exhausted", {
            attempt: z
        }), !1;
        let w = Math.min(WhY * Math.pow(2, z - 1), 8000);
        h(`Remote persistence attempt ${z}/${pW6} failed, retrying in ${w}ms…`), await new Promise((H) => setTimeout(H, w))
    }
    return !1
}
// @from(Ln 360854, Col 0)
async function yi4(A, q, K) {
    let Y = nV();
    if (!Y) return h("No session token available for session persistence"), H8("error", "session_persist_fail_jwt_no_token"), !1;
    let z = {
        Authorization: `Bearer ${Y}`,
        "Content-Type": "application/json"
    };
    return await Ri4(A)(q, K, z)
}
// @from(Ln 360863, Col 0)
async function Ci4(A, q) {
    try {
        let {
            accessToken: K,
            orgUUID: Y
        } = await PN(), z = `${P4().BASE_API_URL}/v1/session_ingress/session/${A}`, w = {
            ...rX(K),
            "x-organization-uuid": Y
        };
        return await Ri4(A)(q, z, w)
    } catch (K) {
        return h(`Failed to get OAuth credentials: ${K instanceof Error?K.message:String(K)}`), H8("error", "session_persist_fail_oauth_no_token"), !1
    }
}
// @from(Ln 360877, Col 0)
async function Si4(A, q) {
    let K = nV();
    if (!K) return h("No session token available for fetching session logs"), H8("error", "session_get_fail_no_token"), null;
    let Y = {
            Authorization: `Bearer ${K}`
        },
        z = await Ii4(A, q, Y);
    if (z && z.length > 0) {
        let w = z[z.length - 1];
        if (w && "uuid" in w && w.uuid) dW6.set(A, w.uuid)
    }
    return z
}
// @from(Ln 360890, Col 0)
async function hi4(A, q, K) {
    let Y = `${P4().BASE_API_URL}/v1/session_ingress/session/${A}`;
    h(`[session-ingress] Fetching session logs from: ${Y}`);
    let z = {
        ...rX(q),
        "x-organization-uuid": K
    };
    return await Ii4(A, Y, z)
}
// @from(Ln 360899, Col 0)
async function Ii4(A, q, K) {
    try {
        let Y = await sA.get(q, {
            headers: K,
            timeout: 20000,
            validateStatus: (z) => z < 500
        });
        if (Y.status === 200) {
            let z = Y.data;
            if (!z || typeof z !== "object" || !Array.isArray(z.loglines)) return K1(Error(`Invalid session logs response format: ${Q1(z)}`)), H8("error", "session_get_fail_invalid_response"), null;
            let w = z.loglines;
            return h(`Fetched ${w.length} session logs for session ${A}`), w
        }
        if (Y.status === 404) return h(`No existing logs for session ${A}`), H8("warn", "session_get_no_logs_for_session"), [];
        if (Y.status === 401) throw h("Auth token expired or invalid"), H8("error", "session_get_fail_bad_token"), Error("Your session has expired. Please run /login to sign in again.");
        return h(`Failed to fetch session logs: ${Y.status} ${Y.statusText}`), H8("error", "session_get_fail_status", {
            status: Y.status
        }), null
    } catch (Y) {
        let z = Y;
        return K1(Error(`Error fetching session logs: ${z.message}`)), H8("error", "session_get_fail_status", {
            status: z.status
        }), null
    }
}
// @from(Ln 360924, Col 4)
dW6
// @from(Ln 360924, Col 9)
pW6 = 10
// @from(Ln 360925, Col 4)
WhY = 500
// @from(Ln 360926, Col 4)
Li4
// @from(Ln 360927, Col 4)
cW6 = v(() => {
    y5();
    y6();
    Z6();
    Oa();
    Uz();
    UR();
    f0();
    m6();
    dW6 = new Map, Li4 = new Map
})
// @from(Ln 360942, Col 0)
function VhY(A) {
    if (A === null) return WP("Session resumed", "suggestion");
    let q = A instanceof vD ? A.formattedMessage : A.message;
    return WP(`Session resumed without branch: ${q}`, "warning")
}
// @from(Ln 360948, Col 0)
function NhY() {
    return c6({
        content: `This session is being continued from another machine. Application state may have changed. The updated working directory is ${y8()}`,
        isMeta: !0
    })
}
// @from(Ln 360954, Col 0)
async function xi4(A, q) {
    let K = K3(A, 75),
        Y = "claude/task";
    try {
        let z = ThY.replace("{description}", A),
            H = (await SX({
                systemPrompt: [],
                userPrompt: z,
                outputFormat: {
                    type: "json_schema",
                    schema: {
                        type: "object",
                        properties: {
                            title: {
                                type: "string"
                            },
                            branch: {
                                type: "string"
                            }
                        },
                        required: ["title", "branch"],
                        additionalProperties: !1
                    }
                },
                signal: q,
                options: {
                    querySource: "teleport_generate_title",
                    agents: [],
                    isNonInteractiveSession: !1,
                    hasAppendSystemPrompt: !1,
                    mcpTools: []
                }
            })).message.content[0];
        if (H?.type !== "text") return {
            title: K,
            branchName: "claude/task"
        };
        let $ = j9(H.text.trim()),
            O = u.object({
                title: u.string(),
                branch: u.string()
            }).safeParse($);
        if (O.success) return {
            title: O.data.title || K,
            branchName: O.data.branch || "claude/task"
        };
        return {
            title: K,
            branchName: "claude/task"
        }
    } catch (z) {
        return K1(Error(`Error generating title and branch: ${z}`)), {
            title: K,
            branchName: "claude/task"
        }
    }
}
// @from(Ln 361011, Col 0)
async function bi4(A, q) {
    let {
        title: K
    } = await xi4(A, q);
    return K
}
// @from(Ln 361017, Col 0)
async function nW6() {
    if (!await HA1({
            ignoreUntracked: !0
        })) throw c("tengu_teleport_error_git_not_clean", {}), new vD("Git working directory is not clean. Please commit or stash your changes before using --teleport.", H6.red(`Error: Git working directory is not clean. Please commit or stash your changes before using --teleport.
`))
}
// @from(Ln 361023, Col 0)
async function vhY(A) {
    let q = A ? ["fetch", "origin", `${A}:${A}`] : ["fetch", "origin"],
        {
            code: K,
            stderr: Y
        } = await IA(pq(), q);
    if (K !== 0)
        if (A && Y.includes("refspec")) {
            h(`Specific branch fetch failed, trying to fetch ref: ${A}`);
            let {
                code: z,
                stderr: w
            } = await IA(pq(), ["fetch", "origin", A]);
            if (z !== 0) K1(Error(`Failed to fetch from remote origin: ${w}`))
        } else K1(Error(`Failed to fetch from remote origin: ${Y}`))
}
// @from(Ln 361039, Col 0)
async function EhY(A) {
    let {
        code: q
    } = await IA(pq(), ["rev-parse", "--abbrev-ref", `${A}@{upstream}`]);
    if (q === 0) {
        h(`Branch '${A}' already has upstream set`);
        return
    }
    let {
        code: K
    } = await IA(pq(), ["rev-parse", "--verify", `origin/${A}`]);
    if (K === 0) {
        h(`Setting upstream for '${A}' to 'origin/${A}'`);
        let {
            code: Y,
            stderr: z
        } = await IA(pq(), ["branch", "--set-upstream-to", `origin/${A}`, A]);
        if (Y !== 0) h(`Failed to set upstream for '${A}': ${z}`);
        else h(`Successfully set upstream for '${A}'`)
    } else h(`Remote branch 'origin/${A}' does not exist, skipping upstream setup`)
}
// @from(Ln 361060, Col 0)
async function khY(A) {
    let {
        code: q,
        stderr: K
    } = await IA(pq(), ["checkout", A]);
    if (q !== 0) {
        h(`Local checkout failed, trying to checkout from origin: ${K}`);
        let Y = await IA(pq(), ["checkout", "-b", A, "--track", `origin/${A}`]);
        if (q = Y.code, K = Y.stderr, q !== 0) {
            h(`Remote checkout with -b failed, trying without -b: ${K}`);
            let z = await IA(pq(), ["checkout", "--track", `origin/${A}`]);
            q = z.code, K = z.stderr
        }
    }
    if (q !== 0) throw c("tengu_teleport_error_branch_checkout_failed", {}), new vD(`Failed to checkout branch '${A}': ${K}`, H6.red(`Failed to checkout branch '${A}'
`));
    await EhY(A)
}
// @from(Ln 361078, Col 0)
async function lW6() {
    let {
        stdout: A
    } = await IA(pq(), ["branch", "--show-current"]);
    return A.trim()
}
// @from(Ln 361085, Col 0)
function oW1(A, q) {
    return [...Ig1(A), NhY(), VhY(q)]
}
// @from(Ln 361088, Col 0)
async function aW1(A) {
    try {
        let q = await lW6();
        if (h(`Current branch before teleport: '${q}'`), A) {
            h(`Switching to branch '${A}'...`), await vhY(A), await khY(A);
            let Y = await lW6();
            h(`Branch after checkout: '${Y}'`)
        } else h("No branch specified, staying on current branch");
        return {
            branchName: await lW6(),
            branchError: null
        }
    } catch (q) {
        let K = await lW6(),
            Y = q instanceof Error ? q : Error(String(q));
        return {
            branchName: K,
            branchError: Y
        }
    }
}
// @from(Ln 361109, Col 0)
async function GyA(A) {
    let q = await AI(),
        K = A.session_context.sources.find((z) => z.type === "git_repository");
    if (!K?.url) return h(q ? "Session has no associated repository, proceeding without validation" : "Session has no repo requirement and not in git directory, proceeding"), {
        status: "no_repo_required"
    };
    let Y = s31(K.url);
    if (!Y) return {
        status: "no_repo_required"
    };
    if (h(`Session is for repository: ${Y}, current repo: ${q??"none"}`), !q) return {
        status: "not_in_repo",
        sessionRepo: Y,
        currentRepo: null
    };
    if (q.toLowerCase() === Y.toLowerCase()) return {
        status: "match",
        sessionRepo: Y,
        currentRepo: q
    };
    return {
        status: "mismatch",
        sessionRepo: Y,
        currentRepo: q
    }
}
// @from(Ln 361135, Col 0)
async function Ct(A, q) {
    if (!p0("allow_remote_sessions")) throw Error("Remote sessions are disabled by your organization's policy.");
    h(`Resuming code session ID: ${A}`);
    try {
        let K = a4()?.accessToken;
        if (!K) throw c("tengu_teleport_resume_error", {
            error_type: "no_access_token"
        }), Error("Claude Code web sessions require authentication with a Claude.ai account. API key authentication is not sufficient. Please run /login to authenticate, or check your authentication status with /status.");
        let Y = await Kb();
        if (!Y) throw c("tengu_teleport_resume_error", {
            error_type: "no_org_uuid"
        }), Error("Unable to get organization UUID for constructing session URL");
        q?.("validating");
        let z = await KQ1(A),
            w = await GyA(z);
        switch (w.status) {
            case "match":
            case "no_repo_required":
                break;
            case "not_in_repo":
                throw c("tengu_teleport_error_repo_not_in_git_dir_sessions_api", {
                    sessionId: A
                }), new vD(`You must run claude --teleport ${A} from a checkout of ${w.sessionRepo}.`, H6.red(`You must run claude --teleport ${A} from a checkout of ${H6.bold(w.sessionRepo)}.
`));
            case "mismatch":
                throw c("tengu_teleport_error_repo_mismatch_sessions_api", {
                    sessionId: A
                }), new vD(`You must run claude --teleport ${A} from a checkout of ${w.sessionRepo}.
This repo is ${w.currentRepo}.`, H6.red(`You must run claude --teleport ${A} from a checkout of ${H6.bold(w.sessionRepo)}.
This repo is ${H6.bold(w.currentRepo)}.
`));
            case "error":
                throw new vD(w.errorMessage || "Failed to validate session repository", H6.red(`Error: ${w.errorMessage||"Failed to validate session repository"}
`));
            default: {
                let H = w.status;
                throw Error(`Unhandled repo validation status: ${H}`)
            }
        }
        return await RhY(A, Y, K, q, z)
    } catch (K) {
        if (K instanceof vD) throw K;
        let Y = K instanceof Error ? K : Error(String(K));
        throw K1(Y), c("tengu_teleport_resume_error", {
            error_type: "resume_session_id_catch"
        }), new vD(Y.message, H6.red(`Error: ${Y.message}
`))
    }
}
// @from(Ln 361184, Col 0)
async function LhY(A, q) {
    let K = await PyA();
    if (K.size > 0) c("tengu_teleport_errors_detected", {
        error_types: Array.from(K).join(","),
        errors_ignored: Array.from(q || []).join(",")
    }), await new Promise((Y) => {
        A.render(iW6.default.createElement(u_, null, iW6.default.createElement(dX, null, iW6.default.createElement(UW6, {
            errorsToIgnore: q,
            onComplete: () => {
                c("tengu_teleport_errors_resolved", {
                    error_types: Array.from(K).join(",")
                }), Y()
            }
        }))))
    })
}
// @from(Ln 361200, Col 0)
async function ui4(A, q, K, Y) {
    return await LhY(A, new Set(["needsGitStash"])), b51({
        initialMessage: q,
        signal: K,
        branchName: Y
    })
}
// @from(Ln 361207, Col 0)
async function RhY(A, q, K, Y, z) {
    let w = Date.now();
    try {
        h(`[teleport] Starting fetch for session: ${A}`), Y?.("fetching_logs");
        let H = Date.now(),
            $ = await hi4(A, K, q);
        if (h(`[teleport] Session logs fetched in ${Date.now()-H}ms`), $ === null) throw Error("Failed to fetch session logs");
        let O = Date.now(),
            _ = $.filter((X) => vI(X) && !X.isSidechain);
        h(`[teleport] Filtered ${$.length} entries to ${_.length} messages in ${Date.now()-O}ms`), Y?.("fetching_branch");
        let J = z ? VvA(z) : void 0;
        if (J) h(`[teleport] Found branch: ${J}`);
        return h(`[teleport] Total teleportFromSessionsAPI time: ${Date.now()-w}ms`), {
            log: _,
            branch: J
        }
    } catch (H) {
        let $ = H instanceof Error ? H : Error(String(H));
        if (sA.isAxiosError(H) && H.response?.status === 404) throw c("tengu_teleport_error_session_not_found_404", {
            sessionId: A
        }), new vD(`${A} not found.`, `${A} not found.
${H6.dim("Run /status in Claude Code to check your account.")}`);
        throw K1($), Error(`Failed to fetch session from Sessions API: ${$.message}`)
    }
}
// @from(Ln 361232, Col 0)
async function Bi4(A) {
    let q = a4()?.accessToken;
    if (!q) throw Error("No access token for polling");
    let K = await Kb();
    if (!K) throw Error("No org UUID for polling");
    let Y = rX(q),
        z = `${P4().BASE_API_URL}/v1/sessions/${A}/events`,
        w = await sA.get(z, {
            headers: {
                ...Y,
                "x-organization-uuid": K
            },
            timeout: 30000
        });
    if (w.status !== 200) throw Error(`Failed to fetch session events: ${w.statusText}`);
    let H = w.data;
    if (!H?.data || !Array.isArray(H.data)) throw Error("Invalid events response");
    let $ = [];
    for (let _ of H.data)
        if (_ && typeof _ === "object" && "type" in _) {
            if (_.type === "env_manager_log" || _.type === "control_response") continue;
            if ("session_id" in _) $.push(_)
        } let O;
    try {
        let _ = await KQ1(A);
        O = VvA(_)
    } catch {}
    return {
        log: $,
        branch: O
    }
}
// @from(Ln 361264, Col 0)
async function b51(A) {
    if (!p0("allow_remote_sessions")) throw Error("Remote sessions are disabled by your organization's policy.");
    let {
        initialMessage: q,
        description: K,
        signal: Y
    } = A;
    try {
        await XM();
        let z = a4()?.accessToken;
        if (!z) return K1(Error("No access token found for remote session creation")), null;
        let w = await Kb();
        if (!w) return K1(Error("Unable to get organization UUID for remote session creation")), null;
        let H = await AI(),
            $ = null,
            O = null,
            {
                title: _,
                branchName: J
            } = await xi4(K || q || "Background task", Y);
        if (H) {
            let [B, S] = H.split("/");
            if (B && S) {
                let m = A.branchName ?? await tj() ?? void 0;
                h(`[teleportToRemote] Git source: ${B}/${S}, revision: ${m??"none"}`), $ = {
                    type: "git_repository",
                    url: `https://github.com/${B}/${S}`,
                    revision: m
                }, O = {
                    type: "git_repository",
                    git_info: {
                        type: "github",
                        repo: `${B}/${S}`,
                        branches: [J]
                    }
                }
            } else K1(Error(`Invalid repository format: ${H} - expected 'owner/name'`))
        } else h("[teleportToRemote] No repository detected — session will have an empty sandbox");
        let X = await rW1();
        if (!X || X.length === 0) return K1(Error("No environments available for session creation")), null;
        let j = C8()?.remote?.defaultEnvironmentId,
            M = j && X.find((B) => B.environment_id === j) || X[0];
        if (!M) return K1(Error("No environments available for session creation")), null;
        if (j) {
            let B = M.environment_id === j;
            h(B ? `Using configured default environment: ${j}` : `Configured default environment ${j} not found, using first available`)
        }
        let P = M.environment_id;
        h(`Selected environment: ${P} (${M.name})`);
        let W = `${P4().BASE_API_URL}/v1/sessions`,
            G = {
                ...rX(z),
                "x-organization-uuid": w
            },
            f = {
                sources: $ ? [$] : [],
                outcomes: O ? [O] : [],
                model: l3()
            },
            Z = q ? [{
                type: "event",
                data: {
                    uuid: fhY(),
                    session_id: "",
                    type: "user",
                    parent_tool_use_id: null,
                    message: {
                        role: "user",
                        content: q
                    }
                }
            }] : [],
            N = {
                title: _,
                events: Z,
                session_context: f,
                environment_id: P
            };
        h(`Creating session with payload: ${Q1(N,null,2)}`);
        let T = await sA.post(W, N, {
            headers: G,
            signal: Y
        });
        if (!(T.status === 200 || T.status === 201)) return K1(Error(`API request failed with status ${T.status}: ${T.statusText}

Response data: ${Q1(T.data,null,2)}`)), null;
        let y = T.data;
        if (!y || typeof y.id !== "string") return K1(Error(`Cannot determine session ID from API response: ${Q1(T.data)}`)), null;
        return h(`Successfully created remote session: ${y.id}`), {
            id: y.id,
            title: y.title || _
        }
    } catch (z) {
        let w = z instanceof Error ? z : Error(String(z));
        return K1(w), null
    }
}
// @from(Ln 361361, Col 4)
iW6
// @from(Ln 361361, Col 9)
ThY = `You are coming up with a succinct title and git branch name for a coding session based on the provided description. The title should be clear, concise, and accurately reflect the content of the coding task.
You should keep it short and simple, ideally no more than 6 words. Avoid using jargon or overly technical terms unless absolutely necessary. The title should be easy to understand for anyone reading it.
Use sentence case for the title (capitalize only the first word and proper nouns), not Title Case.

The branch name should be clear, concise, and accurately reflect the content of the coding task.
You should keep it short and simple, ideally no more than 4 words. The branch should always start with "claude/" and should be all lower case, with words separated by dashes.

Return a JSON object with "title" and "branch" fields.

Example 1: {"title": "Fix login button not working on mobile", "branch": "claude/fix-mobile-login-button"}
Example 2: {"title": "Update README with installation instructions", "branch": "claude/update-readme"}
Example 3: {"title": "Improve performance of data processing script", "branch": "claude/improve-data-processing"}

Here is the session description:
<description>{description}</description>
Please generate a title and branch name for this session.`
// @from(Ln 361377, Col 4)
Im = v(() => {
    tq();
    h9();
    nW1();
    q3();
    qH();
    Z6();
    AH();
    i7();
    y6();
    d8();
    WyA();
    J7();
    Pk();
    y5();
    Uz();
    J7();
    t31();
    yw();
    vq();
    e7();
    u6();
    N8();
    B6();
    mV();
    UR();
    QW6();
    p8();
    cW6();
    lq();
    m6();
    qd();
    iW6 = o(X1(), 1)
})
// @from(Ln 361411, Col 0)
async function mi4() {
    let A = [];
    if (!p0("allow_remote_sessions")) return A.push({
        type: "policy_blocked"
    }), A;
    let [q, K, Y, z] = await Promise.all([gW6(), vi4(), Ei4(), AI()]);
    if (q) A.push({
        type: "not_logged_in"
    });
    if (!K) A.push({
        type: "no_remote_environment"
    });
    if (!Y) A.push({
        type: "not_in_git_repo"
    });
    if (z) {
        let [w, H] = z.split("/");
        if (w && H) {
            if (!await ki4(w, H)) A.push({
                type: "github_app_not_installed"
            })
        }
    }
    return A
}
// @from(Ln 361436, Col 4)
Fi4 = v(() => {
    MyA();
    t31();
    mV()
})
// @from(Ln 361441, Col 0)
async function rW6() {
    let A = await mi4();
    if (A.length > 0) return {
        eligible: !1,
        errors: A
    };
    return {
        eligible: !0
    }
}
// @from(Ln 361452, Col 0)
function oW6(A) {
    switch (A.type) {
        case "not_logged_in":
            return "Please run /login and sign in with your Claude.ai account (not Console).";
        case "no_remote_environment":
            return "No environments available, please ensure you've gone through onboarding at claude.ai/code";
        case "not_in_git_repo":
            return "Background tasks require a git repository. Initialize git or run from a git repository.";
        case "github_app_not_installed":
            return `The Claude GitHub app must be installed on this repository first.
https://github.com/apps/claude/installations/new`;
        case "policy_blocked":
            return "Remote sessions are disabled by your organization's policy."
    }
}
// @from(Ln 361468, Col 0)
function yhY(A, q, K, Y) {
    let z = K === "completed" ? "completed successfully" : K === "failed" ? "failed" : "was stopped",
        w = ww(A),
        H = `<${NO}>
<${dP}>${A}</${dP}>
<${so1}>remote_agent</${so1}>
<${WT}>${w}</${WT}>
<${ND}>${K}</${ND}>
<${TD}>Remote task "${q}" ${z}</${TD}>
</${NO}>
Read the output file to retrieve the result: ${w}`;
    WR({
        value: H,
        mode: "task-notification"
    }), c5(A, Y, ($) => ({
        ...$,
        notified: !0
    }))
}
// @from(Ln 361488, Col 0)
function ChY(A) {
    let q = A.findLast((z) => z.type === "assistant" && z.message.content.some((w) => w.type === "tool_use" && w.name === bO.name));
    if (!q) return [];
    let K = q.message.content.find((z) => z.type === "tool_use" && z.name === bO.name)?.input;
    if (!K) return [];
    let Y = bO.inputSchema.safeParse(K);
    if (!Y.success) return [];
    return Y.data.todos
}
// @from(Ln 361497, Col 0)
async function ShY(A, q) {
    try {
        let K = await SX({
                systemPrompt: ["You are given a few messages from a conversation, as well as a summary of the conversation so far. Your task is to summarize the new messages in the conversation based on the summary so far. Aim for 1-2 sentences at most, focusing on the most important details. The summary MUST be in <summary>summary goes here</summary> tags. If there is no new information, return an empty string: <summary></summary>."],
                userPrompt: `Summary so far: ${q}

New messages: ${Q1(A)}`,
                signal: new AbortController().signal,
                options: {
                    querySource: "background_task_summarize_delta",
                    agents: [],
                    isNonInteractiveSession: !1,
                    hasAppendSystemPrompt: !1,
                    mcpTools: []
                }
            }),
            Y = B51(K);
        if (!Y) return null;
        return C4(Y, "summary")
    } catch (K) {
        return K1(K instanceof Error ? K : Error(String(K))), null
    }
}
// @from(Ln 361521, Col 0)
function vg1(A) {
    let {
        session: q,
        command: K,
        context: Y
    } = A, z = `r${q.id.substring(0,6)}`;
    hj1(z);
    let w = {
        ...IZ(z, "remote_agent", q.title),
        type: "remote_agent",
        status: "running",
        sessionId: q.id,
        command: K,
        title: q.title,
        todoList: [],
        log: [],
        deltaSummarySinceLastFlushToAttachment: null
    };
    bZ(w, Y.setAppState);
    let H = hhY(z, Y);
    return {
        taskId: z,
        cleanup: H
    }
}
// @from(Ln 361547, Col 0)
function hhY(A, q) {
    let K = !0,
        Y = 1000,
        z = async () => {
            if (!K) return;
            try {
                let H = (await q.getAppState()).tasks?.[A];
                if (!H || H.status !== "running") return;
                let $ = await Bi4(H.sessionId),
                    O = $.log.find((D) => D.type === "result"),
                    _ = O ? O.subtype === "success" ? "completed" : "failed" : $.log.length > 0 ? "running" : "starting",
                    J = $.log.slice(H.log.length),
                    X = null;
                if (J.length > 0) {
                    let D = H.deltaSummarySinceLastFlushToAttachment;
                    X = await ShY(J, D);
                    let j = J.map((M) => {
                        if (M.type === "assistant") return M.message.content.filter((P) => P.type === "text").map((P) => ("text" in P) ? P.text : "").join(`
`);
                        return Q1(M)
                    }).join(`
`);
                    if (j) ZK1(A, j + `
`)
                }
                if (c5(A, q.setAppState, (D) => ({
                        ...D,
                        status: _ === "starting" ? "running" : _,
                        log: $.log,
                        todoList: ChY($.log),
                        deltaSummarySinceLastFlushToAttachment: X,
                        endTime: O ? Date.now() : void 0
                    })), O) {
                    let D = O.subtype === "success" ? "completed" : "failed";
                    yhY(A, H.title, D, q.setAppState);
                    return
                }
            } catch (w) {
                K1(w instanceof Error ? w : Error(String(w)))
            }
            if (K) setTimeout(z, Y)
        };
    return z(), () => {
        K = !1
    }
}
// @from(Ln 361594, Col 0)
function u51(A) {
    return bw6(A, process.env.SESSION_INGRESS_URL)
}
// @from(Ln 361598, Col 0)
function gi4(A) {
    return `claude --teleport ${A}`
}
// @from(Ln 361601, Col 4)
nd
// @from(Ln 361601, Col 8)
Qi4
// @from(Ln 361602, Col 4)
pW1 = v(() => {
    m1();
    fK1();
    y6();
    Z6();
    AN();
    GR();
    hZ();
    Im();
    yw();
    N8();
    r_1();
    Fi4();
    m6();
    vz();
    nd = o(X1(), 1);
    Qi4 = {
        name: "RemoteAgentTask",
        type: "remote_agent",
        async spawn(A, q) {
            let {
                command: K,
                title: Y
            } = A, {
                abortController: z
            } = q;
            h(`RemoteAgentTask spawning: ${Y}`);
            let w = await b51({
                initialMessage: K,
                description: Y,
                signal: z.signal
            });
            if (!w) throw Error("Failed to create remote session");
            let {
                taskId: H,
                cleanup: $
            } = vg1({
                session: {
                    id: w.id,
                    title: w.title || Y
                },
                command: K,
                context: q
            });
            return {
                taskId: H,
                cleanup: $
            }
        },
        async kill(A, q) {
            c5(A, q.setAppState, (K) => {
                if (K.status !== "running") return K;
                return {
                    ...K,
                    status: "killed",
                    endTime: Date.now()
                }
            }), h(`RemoteAgentTask ${A} marked as killed (local only)`)
        },
        renderStatus(A) {
            let q = A,
                K = q.status,
                Y = q.title;
            return nd.createElement(I, null, nd.createElement(V, {
                color: K === "running" ? "warning" : K === "completed" ? "success" : K === "failed" ? "error" : "inactive"
            }, "[", K, "] ", Y))
        },
        renderOutput(A) {
            return nd.createElement(I, null, nd.createElement(V, null, A))
        },
        getProgressMessage(A) {
            let K = A.deltaSummarySinceLastFlushToAttachment;
            if (!K) return null;
            return `Remote task ${A.id} progress: ${K}. Read ${A.outputFile} to see full output.`
        }
    }
})
// @from(Ln 361680, Col 0)
function IhY() {
    return [gj1, B_6, Qi4]
}
// @from(Ln 361684, Col 0)
function Vg1(A) {
    return IhY().find((q) => q.type === A)
}
// @from(Ln 361687, Col 4)
jRA = v(() => {
    kK1();
    ra();
    pW1()
})
// @from(Ln 361693, Col 0)
function c5(A, q, K) {
    q((Y) => {
        let z = Y.tasks?.[A];
        if (!z) return Y;
        return {
            ...Y,
            tasks: {
                ...Y.tasks,
                [A]: K(z)
            }
        }
    })
}
// @from(Ln 361707, Col 0)
function bZ(A, q) {
    q((K) => ({
        ...K,
        tasks: {
            ...K.tasks,
            [A.id]: A
        }
    }))
}
// @from(Ln 361717, Col 0)
function Ui4(A) {
    let q = A.tasks ?? {};
    return Object.values(q).filter((K) => K.status === "running")
}
// @from(Ln 361722, Col 0)
function pi4(A) {
    if (A.type === "local_bash") {
        let q = A;
        return {
            ...q,
            lastReportedStdoutLines: q.stdoutLineCount,
            lastReportedStderrLines: q.stderrLineCount
        }
    }
    if (A.type === "local_agent") {
        let q = A;
        return {
            ...q,
            lastReportedToolCount: q.progress?.toolUseCount ?? 0,
            lastReportedTokenCount: q.progress?.tokenCount ?? 0
        }
    }
    return A
}
// @from(Ln 361742, Col 0)
function di4(A) {
    let q = [],
        K = [],
        Y = {},
        z = A.tasks ?? {};
    for (let w of Object.values(z)) {
        if (w.notified && w.status !== "running") continue;
        let H = null;
        if (w.status === "running") {
            let $ = WjA(w.id, w.outputOffset);
            if ($.content) {
                let {
                    content: J
                } = Ng1($.content, w.id);
                H = J, Y[w.id] = {
                    ...w,
                    outputOffset: $.newOffset
                }
            }
            let _ = Vg1(w.type)?.getProgressMessage(w) ?? null;
            if (_) K.push({
                type: "task_progress",
                taskId: w.id,
                taskType: w.type,
                message: _
            })
        }
        if (w.status !== "running" && w.status !== "pending" && !w.notified) {
            let $ = WjA(w.id, w.outputOffset);
            if ($.content) {
                let {
                    content: O
                } = Ng1($.content, w.id);
                H = O
            }
            q.push({
                type: "task_status",
                taskId: w.id,
                taskType: w.type,
                status: w.status,
                description: w.description,
                deltaSummary: H
            }), Y[w.id] = {
                ...Y[w.id] ?? w,
                notified: !0,
                outputOffset: $.newOffset
            }
        }
    }
    return {
        attachments: q,
        progressAttachments: K,
        updatedTasks: Y
    }
}
// @from(Ln 361797, Col 4)
GR = v(() => {
    hZ();
    AN();
    jRA();
    MRA();
    vz()
})
// @from(Ln 361815, Col 0)
async function li4(A) {
    try {
        let Y = (await b1().stat(A)).size;
        if (Y === 0) return {
            success: !1,
            error: {
                reason: "empty",
                message: `PDF file is empty: ${A}`
            }
        };
        if (Y > zD1) return {
            success: !1,
            error: {
                reason: "too_large",
                message: `PDF file exceeds maximum allowed size of ${L2(zD1)}.`
            }
        };
        let z = (await BhY(A)).toString("base64");
        return {
            success: !0,
            data: {
                type: "pdf",
                file: {
                    filePath: A,
                    base64: z,
                    originalSize: Y
                }
            }
        }
    } catch (q) {
        return {
            success: !1,
            error: {
                reason: "unknown",
                message: q instanceof Error ? q.message : String(q)
            }
        }
    }
}
// @from(Ln 361854, Col 0)
async function sW6(A) {
    let {
        code: q,
        stdout: K
    } = await IA("pdfinfo", [A], {
        timeout: 1e4,
        useCwd: !1
    });
    if (q !== 0) return null;
    let Y = /^Pages:\s+(\d+)/m.exec(K);
    if (!Y) return null;
    let z = parseInt(Y[1], 10);
    return isNaN(z) ? null : z
}
// @from(Ln 361868, Col 0)
async function mhY() {
    if (aW6 !== void 0) return aW6;
    let {
        code: A,
        stderr: q
    } = await IA("pdftoppm", ["-v"], {
        timeout: 5000,
        useCwd: !1
    });
    return aW6 = A === 0 || q.length > 0, aW6
}
// @from(Ln 361879, Col 0)
async function ZyA(A, q) {
    try {
        let z = (await b1().stat(A)).size;
        if (z === 0) return {
            success: !1,
            error: {
                reason: "empty",
                message: `PDF file is empty: ${A}`
            }
        };
        if (z > kHA) return {
            success: !1,
            error: {
                reason: "too_large",
                message: `PDF file exceeds maximum allowed size for text extraction (${L2(kHA)}).`
            }
        };
        if (!await mhY()) return {
            success: !1,
            error: {
                reason: "unavailable",
                message: "pdftoppm is not installed. Install poppler-utils (e.g. `brew install poppler` or `apt-get install poppler-utils`) to enable PDF page rendering."
            }
        };
        let H = xhY(),
            $ = ci4(l01(), `pdf-${H}`);
        await bhY($, {
            recursive: !0
        });
        let O = ci4($, "page"),
            _ = ["-jpeg", "-r", "100"];
        if (q?.firstPage) _.push("-f", String(q.firstPage));
        if (q?.lastPage && q.lastPage !== 1 / 0) _.push("-l", String(q.lastPage));
        _.push(A, O);
        let {
            code: J,
            stderr: X
        } = await IA("pdftoppm", _, {
            timeout: 120000,
            useCwd: !1
        });
        if (J !== 0) {
            if (/password/i.test(X)) return {
                success: !1,
                error: {
                    reason: "password_protected",
                    message: "PDF is password-protected. Please provide an unprotected version."
                }
            };
            if (/damaged|corrupt|invalid/i.test(X)) return {
                success: !1,
                error: {
                    reason: "corrupted",
                    message: "PDF file is corrupted or invalid."
                }
            };
            return {
                success: !1,
                error: {
                    reason: "unknown",
                    message: `pdftoppm failed: ${X}`
                }
            }
        }
        let j = (await uhY($)).filter((W) => W.endsWith(".jpg")).sort();
        if (j.length === 0) return {
            success: !1,
            error: {
                reason: "corrupted",
                message: "pdftoppm produced no output pages. The PDF may be invalid."
            }
        };
        let P = j.length;
        return {
            success: !0,
            data: {
                type: "parts",
                file: {
                    filePath: A,
                    originalSize: z,
                    outputDir: $,
                    count: P
                }
            }
        }
    } catch (K) {
        return {
            success: !1,
            error: {
                reason: "unknown",
                message: K instanceof Error ? K.message : String(K)
            }
        }
    }
}
// @from(Ln 361974, Col 4)
aW6
// @from(Ln 361975, Col 4)
fyA = v(() => {
    _8();
    wq();
    Pp();
    tq();
    o41()
})
// @from(Ln 361990, Col 0)
async function phY(A, q, K, Y, z, w) {
    if (J6(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS)) return [];
    let H = Aq();
    setTimeout(() => {
        H.abort()
    }, 1000);
    let $ = {
            ...q,
            abortController: H
        },
        O = !q.agentId,
        _ = A ? [gw("at_mentioned_files", () => KIY(A, $)), gw("mcp_resources", () => zIY(A, $)), gw("agent_mentions", () => Promise.resolve(YIY(A, q.options.agentDefinitions.activeAgents)))] : [],
        J = await Promise.all(_),
        X = [gw("changed_files", () => wIY($)), gw("nested_memory", () => HIY($)), gw("dynamic_skill", () => $IY($)), gw("skill_listing", () => OIY($)), gw("ultra_claude_md", async () => thY(z)), gw("plan_mode", () => ihY(z, q)), gw("plan_mode_exit", () => nhY(q)), gw("delegate_mode", () => rhY(q)), gw("delegate_mode_exit", () => Promise.resolve(ohY())), gw("todo_reminders", () => jH() ? NIY(z, q) : fIY(z, q)), ...l8() ? [...w === "session_memory" ? [] : [gw("teammate_mailbox", async () => kIY(q))], gw("team_context", async () => LIY(z ?? []))] : [], gw("critical_system_reminder", () => Promise.resolve(ahY(q))), ...[]],
        D = O ? [gw("ide_selection", async () => ehY(K, q)), gw("ide_opened_file", async () => qIY(K, q)), gw("output_style", async () => Promise.resolve(shY())), gw("diagnostics", async () => PIY(q)), gw("lsp_diagnostics", async () => WIY(q)), gw("unified_tasks", async () => vIY(q, z)), gw("async_hook_responses", async () => EIY()), gw("token_usage", async () => Promise.resolve(RIY(z ?? [], q.options.mainLoopModel))), gw("budget_usd", async () => Promise.resolve(yIY(q.options.maxBudgetUsd))), gw("verify_plan_reminder", async () => SIY(z, q)), gw("queued_commands", async () => Promise.resolve(dhY(Y)))] : [],
        [j, M] = await Promise.all([Promise.all(X), Promise.all(D)]);
    return [...J.flat(), ...j.flat(), ...M.flat()]
}
// @from(Ln 362008, Col 0)
async function gw(A, q) {
    let K = Date.now();
    try {
        let Y = await q(),
            z = Date.now() - K,
            w = Y.reduce((H, $) => {
                return H + Q1($).length
            }, 0);
        if (Math.random() < 0.05) c("tengu_attachment_compute_duration", {
            label: A,
            duration_ms: z,
            attachment_size_bytes: w,
            attachment_count: Y.length
        });
        return Y
    } catch (Y) {
        let z = Date.now() - K;
        if (Math.random() < 0.05) c("tengu_attachment_compute_duration", {
            label: A,
            duration_ms: z,
            error: !0
        });
        return K1(Y), Yk(`Attachment error in ${A}`, Y), []
    }
}
// @from(Ln 362034, Col 0)
function dhY(A) {
    if (!A) return [];
    return A.filter((q) => q.mode === "prompt").map((q) => ({
        type: "queued_command",
        prompt: q.value,
        source_uuid: q.uuid,
        imagePasteIds: q.imagePasteIds
    }))
}
// @from(Ln 362044, Col 0)
function chY(A) {
    let q = 0,
        K = !1;
    for (let Y = A.length - 1; Y >= 0; Y--) {
        let z = A[Y];
        if (z?.type === "assistant") {
            if (bg1(z)) continue;
            q++
        } else if (z?.type === "attachment" && (z.attachment.type === "plan_mode" || z.attachment.type === "plan_mode_reentry")) {
            K = !0;
            break
        }
    }
    return {
        turnCount: q,
        foundPlanModeAttachment: K
    }
}
// @from(Ln 362063, Col 0)
function lhY(A) {
    let q = 0;
    for (let K = A.length - 1; K >= 0; K--) {
        let Y = A[K];
        if (Y?.type === "attachment") {
            if (Y.attachment.type === "plan_mode_exit") break;
            if (Y.attachment.type === "plan_mode") q++
        }
    }
    return q
}
// @from(Ln 362074, Col 0)
async function ihY(A, q) {
    if ((await q.getAppState()).toolPermissionContext.mode !== "plan") return [];
    if (A && A.length > 0) {
        let {
            turnCount: _,
            foundPlanModeAttachment: J
        } = chY(A);
        if (J && _ < ii4.TURNS_BETWEEN_ATTACHMENTS) return []
    }
    let z = uW(q.agentId),
        w = pD(q.agentId),
        H = [];
    if (aL6() && w !== null) H.push({
        type: "plan_mode_reentry",
        planFilePath: z
    }), OT(!1);
    let O = (lhY(A ?? []) + 1) % ii4.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1 ? "full" : "sparse";
    return H.push({
        type: "plan_mode",
        reminderType: O,
        isSubAgent: !!q.agentId,
        planFilePath: z,
        planExists: w !== null
    }), H
}
// @from(Ln 362099, Col 0)
async function nhY(A) {
    if (!sL6()) return [];
    if ((await A.getAppState()).toolPermissionContext.mode === "plan") return kx(!1), [];
    kx(!1);
    let K = uW(A.agentId),
        Y = pD(A.agentId) !== null;
    return [{
        type: "plan_mode_exit",
        planFilePath: K,
        planExists: Y
    }]
}
// @from(Ln 362111, Col 0)
async function rhY(A) {
    let q = await A.getAppState();
    if (q.toolPermissionContext.mode !== "delegate") return [];
    if (!q.teamContext) return [];
    let Y = `${O8()}/tasks/${q.teamContext.teamName}/`;
    return [{
        type: "delegate_mode",
        teamName: q.teamContext.teamName,
        taskListPath: Y
    }]
}
// @from(Ln 362123, Col 0)
function ohY() {
    if (!eL6()) return [];
    return XN1(!1), [{
        type: "delegate_mode_exit"
    }]
}
// @from(Ln 362130, Col 0)
function ahY(A) {
    let q = A.criticalSystemReminder_EXPERIMENTAL;
    if (!q) return [];
    return [{
        type: "critical_system_reminder",
        content: q
    }]
}
// @from(Ln 362139, Col 0)
function shY() {
    let q = C8()?.outputStyle || "default";
    if (q === "default") return [];
    return [{
        type: "output_style",
        style: q
    }]
}
// @from(Ln 362148, Col 0)
function thY(A) {
    return []
}
// @from(Ln 362151, Col 0)
async function ehY(A, q) {
    let K = T$6(q.options.mcpClients);
    if (!K || A?.lineStart === void 0 || !A.text || !A.filePath) return [];
    let Y = await q.getAppState();
    if (sW1(A.filePath, Y.toolPermissionContext)) return [];
    return [{
        type: "selected_lines_in_ide",
        ideName: K,
        lineStart: A.lineStart,
        lineEnd: A.lineStart + A.lineCount - 1,
        filename: A.filePath,
        content: A.text
    }]
}
// @from(Ln 362166, Col 0)
function AIY(A, q) {
    let K = VyA(ni4(A)),
        Y = [],
        z = K;
    while (z !== q && z !== tW6(z).root) {
        if (z.startsWith(q)) Y.push(z);
        z = VyA(z)
    }
    Y.reverse();
    let w = [];
    z = q;
    while (z !== tW6(z).root) w.push(z), z = VyA(z);
    return w.reverse(), {
        nestedDirs: Y,
        cwdLevelDirs: w
    }
}
// @from(Ln 362184, Col 0)
function NyA(A, q) {
    let K = [];
    for (let Y of A)
        if (!q.readFileState.has(Y.path)) K.push({
            type: "nested_memory",
            path: Y.path,
            content: Y
        }), q.readFileState.set(Y.path, {
            content: Y.content,
            timestamp: Date.now(),
            offset: void 0,
            limit: void 0
        });
    return K
}
// @from(Ln 362200, Col 0)
function ri4(A, q, K) {
    let Y = [];
    try {
        if (!EI(A, K.toolPermissionContext)) return Y;
        let z = new Set,
            w = y8(),
            H = jp7(A, z);
        Y.push(...NyA(H, q));
        let {
            nestedDirs: $,
            cwdLevelDirs: O
        } = AIY(A, w);
        for (let _ of $) {
            let J = Mp7(_, A, z);
            Y.push(...NyA(J, q))
        }
        for (let _ of O) {
            let J = Pp7(_, A, z);
            Y.push(...NyA(J, q))
        }
    } catch (z) {
        K1(z)
    }
    return Y
}
// @from(Ln 362225, Col 0)
async function qIY(A, q) {
    if (!A?.filePath || A.text) return [];
    let K = await q.getAppState();
    if (sW1(A.filePath, K.toolPermissionContext)) return [];
    return [...ri4(A.filePath, q, K), {
        type: "opened_file_in_ide",
        filename: A.filePath
    }]
}
// @from(Ln 362234, Col 0)
async function KIY(A, q) {
    let K = _IY(A);
    if (K.length > 0) u8("at-mentions");
    let Y = await q.getAppState();
    return (await Promise.all(K.map(async (w) => {
        try {
            let {
                filename: H,
                lineStart: $,
                lineEnd: O
            } = DIY(w), _ = g4(H);
            if (sW1(_, Y.toolPermissionContext)) return null;
            try {
                if (b1().statSync(_).isDirectory()) try {
                    let X = await qq.call({
                        command: `ls ${R7([_])}`,
                        description: `Lists files in ${_}`
                    }, q);
                    c("tengu_at_mention_extracting_directory_success", {});
                    let D = X.data.stdout;
                    return {
                        type: "directory",
                        path: _,
                        content: D
                    }
                } catch {
                    return null
                }
            } catch {}
            return await TyA(_, q, "tengu_at_mention_extracting_filename_success", "tengu_at_mention_extracting_filename_error", "at-mention", {
                offset: $,
                limit: O && $ ? O - $ + 1 : void 0
            })
        } catch {
            c("tengu_at_mention_extracting_filename_error", {})
        }
    }))).filter(Boolean)
}
// @from(Ln 362273, Col 0)
function YIY(A, q) {
    let K = XIY(A);
    if (K.length === 0) return [];
    return K.map((z) => {
        let w = z.replace("agent-", ""),
            H = q.find(($) => $.agentType === w);
        if (!H) return c("tengu_at_mention_agent_not_found", {}), null;
        return c("tengu_at_mention_agent_success", {}), {
            type: "agent_mention",
            agentType: H.agentType
        }
    }).filter((z) => z !== null)
}
// @from(Ln 362286, Col 0)
async function zIY(A, q) {
    let K = JIY(A);
    if (K.length === 0) return [];
    let Y = q.options.mcpClients || [];
    return (await Promise.all(K.map(async (w) => {
        try {
            let [H, ...$] = w.split(":"), O = $.join(":");
            if (!H || !O) return c("tengu_at_mention_mcp_resource_error", {}), null;
            let _ = Y.find((D) => D.name === H);
            if (!_ || _.type !== "connected") return c("tengu_at_mention_mcp_resource_error", {}), null;
            let X = (q.options.mcpResources?.[H] || []).find((D) => D.uri === O);
            if (!X) return c("tengu_at_mention_mcp_resource_error", {}), null;
            try {
                let D = await _.client.readResource({
                    uri: O
                });
                return c("tengu_at_mention_mcp_resource_success", {}), {
                    type: "mcp_resource",
                    server: H,
                    uri: O,
                    name: X.name || O,
                    description: X.description,
                    content: D
                }
            } catch (D) {
                return c("tengu_at_mention_mcp_resource_error", {}), K1(D), null
            }
        } catch {
            return c("tengu_at_mention_mcp_resource_error", {}), null
        }
    }))).filter((w) => w !== null)
}
// @from(Ln 362318, Col 0)
async function wIY(A) {
    let q = await A.getAppState();
    return (await Promise.all(Th(A.readFileState).map(async (Y) => {
        let z = A.readFileState.get(Y);
        if (!z) return null;
        if (z.offset !== void 0 || z.limit !== void 0) return null;
        let w = g4(Y);
        if (sW1(w, q.toolPermissionContext)) return null;
        try {
            if (aW(w) <= z.timestamp) return null;
            let H = {
                file_path: w
            };
            if (!(await i5.validateInput(H, A)).result) return null;
            let O = await i5.call(H, A),
                _ = A.agentId ?? U6();
            if (w === Lp(_)) {
                if (!A.options.tools.some((X) => X.name === cg)) return null;
                let J = UB(_);
                return {
                    type: "todo",
                    content: J,
                    itemCount: J.length,
                    context: "file-watch"
                }
            }
            if (O.data.type === "text") {
                if (DjA(z.content, O.data.file.content) === "") return null;
                return {
                    type: "edited_text_file",
                    filename: w,
                    snippet: DjA(z.content, O.data.file.content)
                }
            }
            if (O.data.type === "image") try {
                let J = await vyA(w);
                return {
                    type: "edited_image_file",
                    filename: w,
                    content: J
                }
            } catch (J) {
                return K1(J), c("tengu_watched_file_compression_failed", {
                    file: w
                }), null
            }
        } catch {
            return c("tengu_watched_file_stat_error", {}), null
        }
    }))).filter((Y) => Y !== null)
}
// @from(Ln 362369, Col 0)
async function HIY(A) {
    let q = await A.getAppState(),
        K = [];
    if (A.nestedMemoryAttachmentTriggers && A.nestedMemoryAttachmentTriggers.size > 0) {
        for (let Y of A.nestedMemoryAttachmentTriggers) {
            let z = ri4(Y, A, q);
            K.push(...z)
        }
        A.nestedMemoryAttachmentTriggers.clear()
    }
    return K
}
// @from(Ln 362381, Col 0)
async function $IY(A) {
    let q = [];
    if (A.dynamicSkillDirTriggers && A.dynamicSkillDirTriggers.size > 0) {
        let K = b1();
        for (let Y of A.dynamicSkillDirTriggers) {
            let z = [];
            try {
                let w = K.readdirSync(Y);
                for (let H of w)
                    if (H.isDirectory() || H.isSymbolicLink()) {
                        let $ = ni4(Y, H.name, "SKILL.md");
                        try {
                            K.statSync($), z.push(H.name)
                        } catch {}
                    }
            } catch {}
            if (z.length > 0) q.push({
                type: "dynamic_skill",
                skillDir: Y,
                skillNames: z
            })
        }
        A.dynamicSkillDirTriggers.clear()
    }
    return q
}
// @from(Ln 362408, Col 0)
function rd() {
    xg1.clear()
}
// @from(Ln 362411, Col 0)
async function OIY(A) {
    let q = ZO(),
        Y = (await hv(q)).filter(($) => !xg1.has($.name));
    if (Y.length === 0) return [];
    let z = xg1.size === 0;
    for (let $ of Y) xg1.add($.name);
    h(`Sending ${Y.length} skills via attachment (${z?"initial":"dynamic"}, ${xg1.size} total sent)`);
    let w = yG(A.options.mainLoopModel, FP());
    return [{
        type: "skill_listing",
        content: BU7(Y, w),
        skillCount: Y.length,
        isInitial: z
    }]
}
// @from(Ln 362427, Col 0)
function _IY(A) {
    let q = /(^|\s)@"([^"]+)"/g,
        K = /(^|\s)@([^\s]+)\b/g,
        Y = [],
        z = [],
        w;
    while ((w = q.exec(A)) !== null)
        if (w[2] && !w[2].endsWith(" (agent)")) Y.push(w[2]);
    return (A.match(K) || []).forEach(($) => {
        let O = $.slice($.indexOf("@") + 1);
        if (!O.startsWith('"')) z.push(O)
    }), [...new Set([...Y, ...z])]
}
// @from(Ln 362441, Col 0)
function JIY(A) {
    let q = /(^|\s)@([^\s]+:[^\s]+)\b/g,
        K = A.match(q) || [];
    return [...new Set(K.map((Y) => Y.slice(Y.indexOf("@") + 1)))]
}
// @from(Ln 362447, Col 0)
function XIY(A) {
    let q = [],
        K = /(^|\s)@"([\w:.@-]+) \(agent\)"/g,
        Y;
    while ((Y = K.exec(A)) !== null)
        if (Y[2]) q.push(Y[2]);
    let z = /(^|\s)@(agent-[\w:.@-]+)/g,
        w = A.match(z) || [];
    for (let H of w) q.push(H.slice(H.indexOf("@") + 1));
    return [...new Set(q)]
}
// @from(Ln 362459, Col 0)
function DIY(A) {
    let q = A.match(/^([^#]+)(?:#L(\d+)(?:-(\d+))?)?$/);
    if (!q) return {
        filename: A
    };
    let [, K, Y, z] = q, w = Y ? parseInt(Y, 10) : void 0, H = z ? parseInt(z, 10) : w;
    return {
        filename: K ?? A,
        lineStart: w,
        lineEnd: H
    }
}
// @from(Ln 362472, Col 0)
function jIY(A) {
    let q = 0,
        K = !1;
    for (let Y = A.length - 1; Y >= 0; Y--) {
        let z = A[Y];
        if (z?.type === "attachment" && z.attachment.type === "ultramemory") {
            K = !0;
            break
        }
        if (z?.type === "assistant") q += XOA(z)
    }
    return K ? q : null
}
// @from(Ln 362486, Col 0)
function MIY(A) {
    if (!A || A.length === 0) return !0;
    let q = jIY(A);
    if (q === null) return !0;
    return q >= QhY.TOKEN_COOLDOWN
}
// @from(Ln 362492, Col 0)
async function PIY(A) {
    let q = await Fd.getNewDiagnostics();
    if (q.length === 0) return [];
    return [{
        type: "diagnostics",
        files: q,
        isNew: !0
    }]
}
// @from(Ln 362501, Col 0)
async function WIY(A) {
    h("LSP Diagnostics: getLSPDiagnosticAttachments called");
    try {
        let q = sm4();
        if (q.length === 0) return [];
        h(`LSP Diagnostics: Found ${q.length} pending diagnostic set(s)`);
        let K = q.map(({
            files: Y
        }) => ({
            type: "diagnostics",
            files: Y,
            isNew: !0
        }));
        if (q.length > 0) tm4(), h(`LSP Diagnostics: Cleared ${q.length} delivered diagnostic(s) from registry`);
        return h(`LSP Diagnostics: Returning ${K.length} diagnostic attachment(s)`), K
    } catch (q) {
        let K = q instanceof Error ? q : Error(String(q));
        return K1(Error(`Failed to get LSP diagnostic attachments: ${K.message}`)), []
    }
}
// @from(Ln 362521, Col 0)
async function* oP1(A, q, K, Y, z, w) {
    let H = await phY(A, q, K, Y, z, w);
    if (H.length === 0) return;
    c("tengu_attachments", {
        attachment_types: H.map(($) => $.type)
    });
    for (let $ of H) yield kq($)
}
// @from(Ln 362529, Col 0)
async function GIY(A) {
    let q = tW6(A).ext.toLowerCase();
    if (!s81(q)) return null;
    try {
        let K = b1().statSync(A),
            Y = await sW6(A),
            z = Y ?? Math.ceil(K.size / 102400);
        if (z > gz6) return c("tengu_pdf_reference_attachment", {
            pageCount: z,
            fileSize: K.size,
            hadPdfinfo: Y !== null
        }), {
            type: "pdf_reference",
            filename: A,
            pageCount: z,
            fileSize: K.size
        }
    } catch {}
    return null
}
// @from(Ln 362549, Col 0)
async function TyA(A, q, K, Y, z, w) {
    let {
        offset: H,
        limit: $
    } = w ?? {}, O = await q.getAppState();
    if (sW1(A, O.toolPermissionContext)) return null;
    if (z === "at-mention" && !KG6(A)) {
        let J = tW6(A).ext.toLowerCase();
        if (!s81(J)) try {
            let X = b1().statSync(A);
            return c("tengu_attachment_file_too_large", {
                size_bytes: X.size,
                mode: z
            }), null
        } catch {}
    }
    if (z === "at-mention") {
        let J = await GIY(A);
        if (J) return J
    }
    let _ = q.readFileState.get(A);
    if (_ && z === "at-mention") try {
        let J = aW(A);
        if (_.timestamp <= J && J === _.timestamp) return c(K, {}), {
            type: "already_read_file",
            filename: A,
            content: {
                type: "text",
                file: {
                    filePath: A,
                    content: _.content,
                    numLines: _.content.split(`
`).length,
                    startLine: H ?? 1,
                    totalLines: _.content.split(`
`).length
                }
            }
        }
    } catch {}
    try {
        let J = {
            file_path: A,
            offset: H,
            limit: $
        };
        async function X() {
            if (z === "compact") return {
                type: "compact_file_reference",
                filename: A
            };
            let j = await q.getAppState();
            if (sW1(A, j.toolPermissionContext)) return null;
            try {
                let M = {
                        file_path: A,
                        offset: H ?? 1,
                        limit: AC1
                    },
                    P = await i5.call(M, q);
                return c(K, {}), {
                    type: "file",
                    filename: A,
                    content: P.data,
                    truncated: !0
                }
            } catch {
                return c(Y, {}), null
            }
        }
        let D = await i5.validateInput(J, q);
        if (!D.result) {
            if (D.meta?.fileSize) return await X();
            return null
        }
        try {
            let j = await i5.call(J, q);
            return c(K, {}), {
                type: "file",
                filename: A,
                content: j.data
            }
        } catch (j) {
            if (j instanceof qG6) return await X();
            throw j
        }
    } catch {
        return c(Y, {}), null
    }
}
// @from(Ln 362640, Col 0)
function kq(A) {
    return {
        attachment: A,
        type: "attachment",
        uuid: FhY(),
        timestamp: new Date().toISOString()
    }
}
// @from(Ln 362649, Col 0)
function ZIY(A) {
    let q = -1,
        K = -1,
        Y = 0,
        z = 0;
    for (let w = A.length - 1; w >= 0; w--) {
        let H = A[w];
        if (H?.type === "assistant") {
            if (bg1(H)) continue;
            if (q === -1 && "message" in H && Array.isArray(H.message?.content) && H.message.content.some(($) => $.type === "tool_use" && $.name === "TodoWrite")) q = w;
            if (q === -1) Y++;
            if (K === -1) z++
        } else if (K === -1 && H?.type === "attachment" && H.attachment.type === "todo_reminder") K = w;
        if (q !== -1 && K !== -1) break
    }
    return {
        turnsSinceLastTodoWrite: Y,
        turnsSinceLastReminder: z
    }
}
// @from(Ln 362669, Col 0)
async function fIY(A, q) {
    if (!q.options.tools.some((z) => z.name === cg)) return [];
    if (!A || A.length === 0) return [];
    let {
        turnsSinceLastTodoWrite: K,
        turnsSinceLastReminder: Y
    } = ZIY(A);
    if (K >= eW6.TURNS_SINCE_WRITE && Y >= eW6.TURNS_BETWEEN_REMINDERS) {
        let z = UB(q.agentId ?? U6());
        return [{
            type: "todo_reminder",
            content: z,
            itemCount: z.length
        }]
    }
    return []
}
// @from(Ln 362687, Col 0)
function VIY(A) {
    let q = -1,
        K = -1,
        Y = 0,
        z = 0;
    for (let w = A.length - 1; w >= 0; w--) {
        let H = A[w];
        if (H?.type === "assistant") {
            if (bg1(H)) continue;
            if (q === -1 && "message" in H && Array.isArray(H.message?.content) && H.message.content.some(($) => $.type === "tool_use" && ($.name === Nh || $.name === DR))) q = w;
            if (q === -1) Y++;
            if (K === -1) z++
        } else if (K === -1 && H?.type === "attachment" && H.attachment.type === "task_reminder") K = w;
        if (q !== -1 && K !== -1) break
    }
    return {
        turnsSinceLastTaskManagement: Y,
        turnsSinceLastReminder: z
    }
}
// @from(Ln 362707, Col 0)
async function NIY(A, q) {
    if (!jH()) return [];
    if (!q.options.tools.some((z) => z.name === DR)) return [];
    if (!A || A.length === 0) return [];
    let {
        turnsSinceLastTaskManagement: K,
        turnsSinceLastReminder: Y
    } = VIY(A);
    if (K >= eW6.TURNS_SINCE_WRITE && Y >= eW6.TURNS_BETWEEN_REMINDERS) {
        let z = WX(WM());
        return [{
            type: "task_reminder",
            content: z,
            itemCount: z.length
        }]
    }
    return []
}
// @from(Ln 362726, Col 0)
function TIY(A) {
    let q = new Map;
    if (!A || A.length === 0) return q;
    let K = new Set,
        Y = 0;
    for (let z = A.length - 1; z >= 0; z--) {
        let w = A[z];
        if (w?.type === "assistant" && !bg1(w)) Y++;
        else if (w?.type === "attachment" && w.attachment.type === "task_progress") {
            let H = w.attachment.taskId;
            if (!K.has(H)) q.set(H, Y), K.add(H)
        }
    }
    return q
}
// @from(Ln 362741, Col 0)
async function vIY(A, q) {
    let K = await A.getAppState(),
        {
            attachments: Y,
            progressAttachments: z,
            updatedTasks: w
        } = di4(K),
        H = TIY(q),
        $ = z.filter((J) => {
            return (H.get(J.taskId) ?? 1 / 0) >= ghY
        });
    for (let J of $) {
        let X = w[J.taskId] ?? K.tasks?.[J.taskId];
        if (X) w[J.taskId] = pi4(X)
    }
    if (Object.keys(w).length > 0) A.setAppState((J) => ({
        ...J,
        tasks: {
            ...J.tasks,
            ...w
        }
    }));
    let O = Y.map((J) => ({
            type: "task_status",
            taskId: J.taskId,
            taskType: J.taskType,
            status: J.status,
            description: J.description,
            deltaSummary: J.deltaSummary
        })),
        _ = $.map((J) => ({
            type: "task_progress",
            taskId: J.taskId,
            taskType: J.taskType,
            message: J.message
        }));
    return [...O, ..._]
}
// @from(Ln 362779, Col 0)
async function EIY() {
    let A = await Jn7();
    if (A.length === 0) return [];
    h(`Hooks: getAsyncHookResponseAttachments found ${A.length} responses`);
    let q = A.map(({
        processId: K,
        response: Y,
        hookName: z,
        hookEvent: w,
        toolName: H,
        stdout: $,
        stderr: O,
        exitCode: _
    }) => {
        return h(`Hooks: Creating attachment for ${K} (${z}): ${Q1(Y)}`), {
            type: "async_hook_response",
            processId: K,
            hookName: z,
            hookEvent: w,
            toolName: H,
            response: Y,
            stdout: $,
            stderr: O,
            exitCode: _
        }
    });
    if (A.length > 0) {
        let K = A.map((Y) => Y.processId);
        Xn7(K), h(`Hooks: Removed ${K.length} delivered hooks from registry`)
    }
    return h(`Hooks: getAsyncHookResponseAttachments found ${q.length} attachments`), q
}
// @from(Ln 362811, Col 0)
async function kIY(A) {
    if (!l8()) return [];
    return []
}
// @from(Ln 362816, Col 0)
function LIY(A) {
    let q = i3(),
        K = ID(),
        Y = g5();
    if (!q || !K) return [];
    if (A.some((O) => O.type === "assistant")) return [];
    let w = O8(),
        H = `${w}/teams/${q}/config.json`,
        $ = `${w}/tasks/${q}/`;
    return [{
        type: "team_context",
        agentId: K,
        agentName: Y || K,
        teamName: q,
        teamConfigPath: H,
        taskListPath: $
    }]
}
// @from(Ln 362835, Col 0)
function RIY(A, q) {
    if (!J6(process.env.CLAUDE_CODE_ENABLE_TOKEN_USAGE_ATTACHMENT)) return [];
    let K = m51(q),
        Y = PZ(A);
    return [{
        type: "token_usage",
        used: Y,
        total: K,
        remaining: K - Y
    }]
}
// @from(Ln 362847, Col 0)
function yIY(A) {
    if (A === void 0) return [];
    let q = W0(),
        K = A - q;
    return [{
        type: "budget_usd",
        used: q,
        total: A,
        remaining: K
    }]
}
// @from(Ln 362859, Col 0)
function CIY(A) {
    let q = 0;
    for (let K = A.length - 1; K >= 0; K--) {
        let Y = A[K];
        if (Y?.type === "user" && !(("isMeta" in Y) && Y.isMeta)) q++;
        if (Y?.type === "attachment" && Y.attachment.type === "plan_mode_exit") return q
    }
    return 0
}
// @from(Ln 362868, Col 0)
async function SIY(A, q) {
    return []
}
// @from(Ln 362872, Col 0)
function sW1(A, q) {
    return Gj(A, q, "read", "deny") !== null
}
// @from(Ln 362875, Col 4)
eW6
// @from(Ln 362875, Col 9)
ii4
// @from(Ln 362875, Col 14)
QhY
// @from(Ln 362875, Col 19)
ghY = 3
// @from(Ln 362876, Col 4)
UhY
// @from(Ln 362876, Col 9)
xg1
// @from(Ln 362877, Col 4)
FW = v(() => {
    u6();
    YE();
    Ez();
    _8();
    pB();
    vw();
    mX();
    q$();
    dD();
    MK1();
    y6();
    vv();
    Z6();
    _51();
    p8();
    WK1();
    M_();
    c$();
    B6();
    du1();
    hf();
    _H();
    pM();
    G2();
    wq();
    E2();
    GR();
    B6();
    i0();
    v3();
    OJ6();
    lQ1();
    Z6();
    N8();
    hA();
    RW();
    xd();
    U4();
    m6();
    Vq6();
    fyA();
    o41();
    S9();
    H$();
    Cz();
    Yv();
    XN();
    vw();
    eW6 = {
        TURNS_SINCE_WRITE: 10,
        TURNS_BETWEEN_REMINDERS: 10
    }, ii4 = {
        TURNS_BETWEEN_ATTACHMENTS: 5,
        FULL_REMINDER_EVERY_N_ATTACHMENTS: 5
    }, QhY = {
        TOKEN_COOLDOWN: 5000
    }, UhY = {
        TURNS_BETWEEN_REMINDERS: 10
    };
    xg1 = new Set
})
// @from(Ln 362950, Col 0)
function BIY() {
    Sv(), dO6(), hU7(), rO6(), p0A()
}
// @from(Ln 362954, Col 0)
function Uw() {
    BIY(), bm(), QU7(), rd()
}
// @from(Ln 362958, Col 0)
function tW1(A) {
    try {
        c8(LyA(A), `${Date.now()}`, {
            encoding: "utf-8"
        })
    } catch (q) {
        h(`Failed to write .orphaned_at: ${A}: ${q}`)
    }
}
// @from(Ln 362967, Col 0)
async function kyA() {
    try {
        let A = FIY();
        if (!A) return;
        let q = Uq1();
        if (!EyA(q)) return;
        let K = Date.now();
        for (let Y of A) mIY(Y);
        for (let Y of zG6(q)) {
            let z = YG6(q, Y);
            for (let w of zG6(z)) {
                let H = YG6(z, w);
                for (let $ of zG6(H)) {
                    let O = YG6(H, $);
                    if (A.has(O)) continue;
                    QIY(O, K)
                }
                oi4(H)
            }
            oi4(z)
        }
    } catch (A) {
        h(`Plugin cache cleanup failed: ${A}`)
    }
}
// @from(Ln 362993, Col 0)
function LyA(A) {
    return YG6(A, bIY)
}
// @from(Ln 362997, Col 0)
function mIY(A) {
    let q = LyA(A);
    if (EyA(q)) try {
        xIY(q)
    } catch (K) {
        h(`Failed to remove .orphaned_at: ${A}: ${K}`)
    }
}
// @from(Ln 363006, Col 0)
function FIY() {
    try {
        let A = new Set,
            q = ja();
        for (let K of Object.values(q.plugins))
            for (let Y of K) A.add(Y.installPath);
        return A
    } catch (A) {
        return h(`Failed to load installed plugins: ${A}`), null
    }
}
// @from(Ln 363018, Col 0)
function QIY(A, q) {
    let K = LyA(A);
    if (!EyA(K)) {
        tW1(A);
        return
    }
    try {
        let Y = IIY(K).mtimeMs;
        if (q - Y > uIY) ai4(A, {
            recursive: !0,
            force: !0
        })
    } catch (Y) {
        h(`Failed to delete orphaned version: ${A}: ${Y}`)
    }
}
// @from(Ln 363035, Col 0)
function oi4(A) {
    if (zG6(A).length === 0) try {
        ai4(A, {
            recursive: !0,
            force: !0
        })
    } catch (q) {
        h(`Failed to remove empty dir: ${A}: ${q}`)
    }
}
// @from(Ln 363046, Col 0)
function zG6(A) {
    try {
        return hIY(A, {
            withFileTypes: !0
        }).filter((q) => q.isDirectory()).map((q) => q.name)
    } catch {
        return []
    }
}
// @from(Ln 363055, Col 4)
bIY = ".orphaned_at"
// @from(Ln 363056, Col 4)
uIY = 604800000
// @from(Ln 363057, Col 4)
tR = v(() => {
    m6();
    VJ();
    Bu1();
    Uu1();
    pu1();
    oO6();
    c$();
    mM();
    Z6();
    du1();
    FW()
})
// @from(Ln 363076, Col 0)
function $G6() {
    return iZ(Lv(), "known_marketplaces.json")
}
// @from(Ln 363080, Col 0)
function ei4() {
    return iZ(Lv(), "marketplaces")
}
// @from(Ln 363084, Col 0)
function AG1() {
    NZ.cache?.clear?.()
}
// @from(Ln 363087, Col 0)
async function n5() {
    let A = b1(),
        q = $G6();
    if (!A.existsSync(q)) return {};
    try {
        let K = A.readFileSync(q, {
                encoding: "utf-8"
            }),
            Y = _A(K),
            z = HF6.safeParse(Y);
        if (!z.success) {
            let w = `Marketplace configuration file is corrupted: ${z.error.issues.map((H)=>`${H.path.join(".")}: ${H.message}`).join(", ")}`;
            throw h(w, {
                level: "error"
            }), new hG(w, q, Y)
        }
        return z.data
    } catch (K) {
        if (K instanceof hG) throw K;
        let Y = `Failed to load marketplace configuration: ${K instanceof Error?K.message:String(K)}`;
        throw h(Y, {
            level: "error"
        }), Error(Y)
    }
}
// @from(Ln 363112, Col 0)
async function qG1(A) {
    let q = HF6.safeParse(A),
        K = $G6();
    if (!q.success) throw new hG(`Invalid marketplace config: ${q.error.message}`, K, A);
    let Y = b1(),
        z = iZ(K, "..");
    Y.mkdirSync(z), c8(K, Q1(q.data, null, 2), {
        encoding: "utf-8",
        flush: !0
    })
}
// @from(Ln 363123, Col 0)
async function gIY(A, q, K) {
    let Y = {
            ...process.env,
            ...An4
        },
        z = K?.disableCredentialHelper ? ["-c", "credential.helper="] : [];
    if (q) {
        let H = await d4(pq(), [...z, "fetch", "origin", q], {
            cwd: A,
            timeout: 30000,
            stdin: "ignore",
            env: Y
        });
        if (H.code !== 0) return wG6(H);
        let $ = await d4(pq(), [...z, "checkout", q], {
            cwd: A,
            timeout: 30000,
            stdin: "ignore",
            env: Y
        });
        if ($.code !== 0) return wG6($);
        let O = await d4(pq(), [...z, "pull", "origin", "HEAD"], {
            cwd: A,
            timeout: 30000,
            stdin: "ignore",
            env: Y
        });
        return wG6(O)
    }
    let w = await d4(pq(), [...z, "pull", "origin", "HEAD"], {
        cwd: A,
        timeout: 30000,
        stdin: "ignore",
        env: Y
    });
    return wG6(w)
}
// @from(Ln 363161, Col 0)
function wG6(A) {
    if (A.code !== 0 && A.stderr) {
        if (A.stderr.includes("Permission denied (publickey)") || A.stderr.includes("Could not read from remote repository")) return {
            ...A,
            stderr: `SSH authentication failed while updating marketplace. Please ensure your SSH keys are configured.

Original error: ${A.stderr}`
        };
        if (A.stderr.includes("timed out") || A.stderr.includes("Could not resolve host")) return {
            ...A,
            stderr: `Network error while updating marketplace. Please check your internet connection.

Original error: ${A.stderr}`
        }
    }
    return A
}
// @from(Ln 363178, Col 0)
async function UIY() {
    try {
        let A = await IA("ssh", ["-T", "-o", "BatchMode=yes", "-o", "ConnectTimeout=2", "-o", "StrictHostKeyChecking=accept-new", "git@github.com"], {
            timeout: 3000
        });
        return A.code === 1 && (A.stderr?.includes("successfully authenticated") || A.stdout?.includes("successfully authenticated"))
    } catch (A) {
        return h(`SSH configuration check failed: ${A instanceof Error?A.message:String(A)}`, {
            level: "warn"
        }), !1
    }
}
// @from(Ln 363191, Col 0)
function pIY(A) {
    return A.includes("Authentication failed") || A.includes("could not read Username") || A.includes("terminal prompts disabled") || A.includes("403") || A.includes("401")
}
// @from(Ln 363194, Col 0)
async function dIY(A, q, K) {
    let Y = ["-c", "core.sshCommand=ssh -o BatchMode=yes -o StrictHostKeyChecking=accept-new", "clone", "--depth", "1", "--recurse-submodules", "--shallow-submodules"];
    if (K) Y.push("--branch", K);
    Y.push(A, q);
    let z = await IA(pq(), Y, {
        timeout: 30000,
        stdin: "ignore",
        env: {
            ...process.env,
            ...An4
        }
    });
    if (z.code === 0) return z;
    if (z.stderr) {
        if (z.stderr.includes("Permission denied (publickey)") || z.stderr.includes("Could not read from remote repository")) return {
            ...z,
            stderr: `SSH authentication failed. Please ensure your SSH keys are configured for GitHub, or use an HTTPS URL instead.

Original error: ${z.stderr}`
        };
        if (pIY(z.stderr)) return {
            ...z,
            stderr: `HTTPS authentication failed. Please ensure your credential helper is configured (e.g., gh auth login).

Original error: ${z.stderr}`
        };
        if (z.stderr.includes("timed out") || z.stderr.includes("timeout") || z.stderr.includes("Could not resolve host")) return {
            ...z,
            stderr: `Network error or timeout while cloning repository. Please check your internet connection and try again.

Original error: ${z.stderr}`
        }
    }
    return z
}
// @from(Ln 363230, Col 0)
function eR(A, q) {
    if (!A) return;
    try {
        A(q)
    } catch (K) {
        h(`Progress callback error: ${K instanceof Error?K.message:String(K)}`, {
            level: "warn"
        })
    }
}
// @from(Ln 363240, Col 0)
async function eW1(A, q, K, Y, z) {
    let w = b1();
    if (w.existsSync(q)) {
        if (!w.existsSync(iZ(q, ".git"))) throw Error(`Cache directory exists at ${q} but is not a git repository. Please remove it manually and try again.`);
        eR(Y, "Updating existing marketplace cache…");
        let O = await gIY(q, K, {
            disableCredentialHelper: z?.disableCredentialHelper
        });
        if (O.code !== 0) {
            h(`Failed to update marketplace cache: ${O.stderr}`, {
                level: "error"
            }), eR(Y, "Update failed, cleaning up and re-cloning…");
            try {
                w.rmSync(q, {
                    recursive: !0,
                    force: !0
                })
            } catch (_) {
                let J = _ instanceof Error ? _.message : String(_);
                throw Error(`Failed to clean up existing marketplace directory. Please manually delete the directory at ${q} and try again.

Technical details: ${J}`)
            }
        } else return
    }
    let H = K ? ` (ref: ${K})` : "";
    eR(Y, `Cloning repository: ${A}${H}`);
    let $ = await dIY(A, q, K);
    if ($.code !== 0) throw Error(`Failed to clone marketplace repository: ${$.stderr}`);
    eR(Y, "Clone complete, validating marketplace…")
}
// @from(Ln 363272, Col 0)
function cIY(A) {
    return Object.fromEntries(Object.entries(A).map(([q]) => [q, "***REDACTED***"]))
}