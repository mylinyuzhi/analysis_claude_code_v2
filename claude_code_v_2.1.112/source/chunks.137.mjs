
// @from(Ln 344652, Col 0)
async function VwK(q, K, _, z, Y) {
    let A = Date.now();
    try {
        E(`[teleport] Starting fetch for session: ${q}`), z?.("fetching_logs");
        let O = Date.now(),
            w;
        if ($36()) {
            let {
                readStoredTrustedDeviceToken: X
            } = await Promise.resolve().then(() => (kJ6(), oo1));
            w = X()
        }
        let $ = await oOK(q, _, K, w);
        if ($ === null) E("[teleport] v2 endpoint returned null, trying session-ingress"), $ = await rOK(q, _, K);
        if (E(`[teleport] Session logs fetched in ${Date.now()-O}ms`), $ === null) throw Error("Failed to fetch session logs");
        let j = Date.now(),
            H = $.filter((X) => ul(X) && !X.isSidechain);
        E(`[teleport] Filtered ${$.length} entries to ${H.length} messages in ${Date.now()-j}ms`), z?.("fetching_branch");
        let J = Y ? Mu8(Y) : void 0;
        if (J) E(`[teleport] Found branch: ${J}`);
        return E(`[teleport] Total teleportFromSessionsAPI time: ${Date.now()-A}ms`), {
            log: H,
            branch: J
        }
    } catch (O) {
        if (O instanceof dj) throw O;
        let w = r1(O);
        if (Z1.isAxiosError(O) && O.response?.status === 404) throw d("tengu_teleport_error_session_not_found_404", {
            sessionId: q
        }), new dj(`${q} not found.
Run /status in Claude Code to check your account.`, `${q} not found.
${Y8.dim("Run /status in Claude Code to check your account.")}`);
        throw j6(w), Error(`Failed to fetch session from Sessions API: ${w.message}`)
    }
}
// @from(Ln 344687, Col 0)
async function YK8(q, K = null, _) {
    await _Y();
    let z = o7()?.accessToken;
    if (!z) throw Error("No access token for polling");
    let Y = await zD();
    if (!Y) throw Error("No org UUID for polling");
    let A = {
            ...bA(z),
            "anthropic-beta": "ccr-byoc-2025-07-29",
            "x-organization-uuid": Y
        },
        O = `${r7().BASE_API_URL}/v1/sessions/${q}/events`,
        w = 50,
        $ = [],
        j = K;
    for (let X = 0; X < w; X++) {
        let M = await Xu8(O, {
            headers: A,
            params: j ? {
                after_id: j
            } : void 0,
            timeout: 30000
        });
        if (M.status !== 200) throw Error(`Failed to fetch session events: ${M.statusText}`);
        let P = M.data;
        if (!P?.data || !Array.isArray(P.data)) throw Error("Invalid events response");
        for (let W of P.data)
            if (W && typeof W === "object" && "type" in W) {
                if (W.type === "env_manager_log" || W.type === "control_response") continue;
                if ("session_id" in W) $.push(W)
            } if (!P.last_id) break;
        if (j = P.last_id, !P.has_more) break
    }
    if (_?.skipMetadata) return {
        newEvents: $,
        lastEventId: j
    };
    let H, J;
    try {
        let X = await w36(q);
        H = Mu8(X), J = X.session_status
    } catch (X) {
        E(`teleport: failed to fetch session ${q} metadata: ${X}`, {
            level: "debug"
        })
    }
    return {
        newEvents: $,
        lastEventId: j,
        branch: H,
        sessionStatus: J
    }
}
// @from(Ln 344740, Col 0)
async function CF(q) {
    let {
        initialMessage: K,
        signal: _
    } = q;
    try {
        await _Y();
        let z = o7()?.accessToken;
        if (!z) return j6(Error("No access token found for remote session creation")), null;
        let Y = await zD();
        if (!Y) return j6(Error("Unable to get organization UUID for remote session creation")), null;
        if (q.environmentId) {
            let F = `${r7().BASE_API_URL}/v1/sessions`,
                U = {
                    ...bA(z),
                    "anthropic-beta": "ccr-byoc-2025-07-29",
                    "x-organization-uuid": Y
                },
                g = {
                    CLAUDE_CODE_OAUTH_TOKEN: z,
                    ...q.environmentVariables ?? {}
                },
                c = null,
                n = null;
            if (q.useBundle) {
                let e = await O77({
                    oauthToken: z,
                    sessionId: I8(),
                    baseUrl: r7().BASE_API_URL
                }, {
                    signal: _,
                    baseRef: q.bundleBaseRef
                });
                if (!e.success) {
                    if (j6(Error(`Bundle upload failed: ${e.error}`)), e.failReason !== "too_large") q.onBundleFail?.(e.error, "bundle");
                    return null
                }
                n = e.fileId, d("tengu_teleport_bundle_mode", {
                    size_bytes: e.bundleSizeBytes,
                    scope: e.scope,
                    has_wip: e.hasWip,
                    reason: "explicit_env_bundle"
                })
            } else {
                let e = await oN();
                if (e) c = {
                    type: "git_repository",
                    url: `https://${e.host}/${e.owner}/${e.name}`,
                    revision: q.branchName
                }
            }
            let l = {
                title: q.title || q.description || "Remote task",
                events: [],
                session_context: {
                    sources: c ? [c] : [],
                    ...n && {
                        seed_bundle_file_id: n
                    },
                    outcomes: [],
                    environment_variables: g
                },
                environment_id: q.environmentId,
                ...q.tags && {
                    tags: q.tags
                }
            };
            E(`[teleportToRemote] explicit env ${q.environmentId}, ${Object.keys(g).length} env vars, ${n?`bundle=${n}`:`source=${c?.url??"none"}@${q.branchName??"default"}`}`);
            let z6 = await Z1.post(F, l, {
                headers: U,
                signal: _
            });
            if (z6.status !== 200 && z6.status !== 201) return j6(Error(`CreateSession ${z6.status}: ${I6(z6.data)}`)), null;
            let A6 = z6.data;
            if (!A6 || typeof A6.id !== "string") return j6(Error(`No session id in response: ${I6(z6.data)}`)), null;
            return TwK(A6.id, q.source), {
                id: A6.id,
                title: A6.title || l.title
            }
        }
        let A = await AF();
        if (A.length === 0) try {
            A = [await bR6(void 0, _)], E("[teleportToRemote] Auto-created default cloud env")
        } catch (F) {
            return E(`[teleportToRemote] auto-create env failed: ${b6(F)}`, {
                level: "warn"
            }), q.onBundleFail?.("Could not create a cloud environment. Set one up at https://claude.ai/code/onboarding?magic=env-setup", "env_create"), null
        }
        E(`Available environments: ${A.map((F)=>`${F.environment_id} (${F.name}, ${F.kind})`).join(", ")}`);
        let w = y7()?.remote?.defaultEnvironmentId,
            $ = w ? A.find((F) => F.environment_id === w) : void 0,
            j = A.find((F) => F.kind === "anthropic_cloud");
        if (q.useDefaultEnvironment && !$ && !j) {
            if (E(`No configured default or anthropic_cloud in env list (${A.length} envs); retrying fetchEnvironments`), A = await AF(), $ = w ? A.find((F) => F.environment_id === w) : void 0, j = A.find((F) => F.kind === "anthropic_cloud"), !$ && !j) return j6(Error(`No configured default or anthropic_cloud environment available after retry (got: ${A.map((F)=>`${F.name} (${F.kind})`).join(", ")}${w?`; configured default ${w} not in list`:""}). Silent byoc fallthrough would launch into a dead env — fail fast instead.`)), null
        }
        let H = $ || j || A.find((F) => F.kind !== "bridge") || A[0];
        if (!H) return j6(Error("No environments available for session creation")), null;
        if (w) {
            let F = H.environment_id === w;
            E(F ? `Using configured default environment: ${w}` : `Configured default environment ${w} not found, using first available`)
        }
        let J = H.environment_id;
        E(`Selected environment: ${J} (${H.name}, ${H.kind})`);
        let X = null,
            M = null,
            P = null,
            W = await oN(),
            D, Z;
        if (q.title && q.reuseOutcomeBranch) D = q.title, Z = q.reuseOutcomeBranch;
        else {
            let F = await A7Y(q.description || K || "Background task", _);
            D = q.title || F.title, Z = q.reuseOutcomeBranch || F.branchName
        }
        let G = !1,
            f = "no_git_at_all",
            v = ez(b8()),
            V = !q.skipBundle && S6(process.env.CCR_FORCE_BUNDLE),
            k = !q.skipBundle && v !== null && (S6(process.env.CCR_ENABLE_BUNDLE) || await gv("tengu_ccr_bundle_seed_enabled"));
        if (W && !V)
            if (W.host === "github.com") G = await TJ6(W.owner, W.name, _), f = G ? "github_preflight_ok" : "github_preflight_failed";
            else G = !0, f = "ghes_optimistic";
        else if (V) f = "forced_bundle";
        else if (v) f = "no_github_remote";
        if (!G && !k && W) G = !0;
        if (G && W) {
            let {
                host: F,
                owner: U,
                name: g
            } = W, c = q.branchName ?? await UZ() ?? void 0;
            E(`[teleportToRemote] Git source: ${F}/${U}/${g}, revision: ${c??"none"}`), X = {
                type: "git_repository",
                url: `https://${F}/${U}/${g}`,
                revision: c,
                ...q.reuseOutcomeBranch && {
                    allow_unrestricted_git_push: !0
                }
            }, M = {
                type: "git_repository",
                git_info: {
                    type: "github",
                    repo: `${U}/${g}`,
                    branches: [Z]
                }
            }
        }
        if (!X && k) {
            E(`[teleportToRemote] Bundling (reason: ${f})`);
            let F = await O77({
                oauthToken: z,
                sessionId: I8(),
                baseUrl: r7().BASE_API_URL
            }, {
                signal: _
            });
            if (!F.success) {
                j6(Error(`Bundle upload failed: ${F.error}`));
                let U = W ? ". Please setup GitHub on https://claude.ai/code" : "",
                    g;
                switch (F.failReason) {
                    case "empty_repo":
                        g = 'Repository has no commits — run `git add . && git commit -m "initial"` then retry';
                        break;
                    case "too_large":
                        g = `Repo is too large to teleport${U}`;
                        break;
                    case "git_error":
                        g = `Failed to create git bundle (${F.error})${U}`;
                        break;
                    case "stash_failed":
                    case "no_changes":
                        g = F.error;
                        break;
                    case void 0:
                        g = `Bundle upload failed: ${F.error}${U}`;
                        break;
                    default: {
                        let c = F.failReason;
                        g = `Bundle upload failed: ${F.error}`
                    }
                }
                return q.onBundleFail?.(g, "bundle"), null
            }
            P = F.fileId, d("tengu_teleport_bundle_mode", {
                size_bytes: F.bundleSizeBytes,
                scope: F.scope,
                has_wip: F.hasWip,
                reason: f
            })
        }
        if (d("tengu_teleport_source_decision", {
                reason: f,
                path: X ? "github" : P ? "bundle" : "empty"
            }), !X && !P) E("[teleportToRemote] No repository detected — session will have an empty sandbox");
        let N = `${r7().BASE_API_URL}/v1/sessions`,
            R = {
                ...bA(z),
                "anthropic-beta": "ccr-byoc-2025-07-29",
                "x-organization-uuid": Y
            },
            h = {
                sources: X ? [X] : [],
                ...P && {
                    seed_bundle_file_id: P
                },
                outcomes: M ? [M] : [],
                model: q.model ?? G5(),
                ...q.reuseOutcomeBranch && {
                    reuse_outcome_branches: !0
                },
                ...q.githubPr && {
                    github_pr: q.githubPr
                }
            },
            C = [];
        if (q.permissionMode) C.push({
            type: "event",
            data: {
                type: "control_request",
                request_id: `set-mode-${vwK()}`,
                request: {
                    subtype: "set_permission_mode",
                    mode: q.permissionMode,
                    ultraplan: q.ultraplan
                }
            }
        });
        if (K) C.push({
            type: "event",
            data: {
                uuid: vwK(),
                session_id: "",
                type: "user",
                parent_tool_use_id: null,
                message: {
                    role: "user",
                    content: K
                }
            }
        });
        let x = {
            title: q.ultraplan ? `ultraplan: ${D}` : D,
            events: C,
            session_context: h,
            environment_id: J,
            ...q.tags && {
                tags: q.tags
            }
        };
        E(`Creating session with payload: ${I6(x,null,2)}`);
        let B = await Z1.post(N, x, {
            headers: R,
            signal: _,
            validateStatus: (F) => F < 500
        });
        if (!(B.status === 200 || B.status === 201)) return j6(Error(`API request failed with status ${B.status}: ${B.statusText}

Response data: ${I6(B.data,null,2)}`)), q.onCreateFail?.(`${B.status} ${B.statusText}: ${I6(B.data)}`), null;
        let S = B.data;
        if (!S || typeof S.id !== "string") return j6(Error(`Cannot determine session ID from API response: ${I6(B.data)}`)), null;
        return E(`Successfully created remote session: ${S.id}`), TwK(S.id, q.source), {
            id: S.id,
            title: S.title || x.title
        }
    } catch (z) {
        let Y = r1(z);
        return j6(Y), null
    }
}
// @from(Ln 345009, Col 0)
async function ak(q, K = 1e4) {
    let _ = o7()?.accessToken;
    if (!_) return;
    let z = await zD();
    if (!z) return;
    let Y = {
            ...bA(_),
            "anthropic-beta": "ccr-byoc-2025-07-29",
            "x-organization-uuid": z
        },
        A = `${r7().BASE_API_URL}/v1/sessions/${q}/archive`;
    try {
        let O = await Z1.post(A, {}, {
            headers: Y,
            timeout: K,
            validateStatus: (w) => w < 500
        });
        if (O.status === 200 || O.status === 409) E(`[archiveRemoteSession] archived ${q}`);
        else E(`[archiveRemoteSession] ${q} failed ${O.status}: ${I6(O.data)}`)
    } catch (O) {
        j6(O)
    }
}
// @from(Ln 345032, Col 4)
eF8
// @from(Ln 345032, Col 9)
Y7Y = `You are coming up with a succinct title and git branch name for a coding session based on the provided description. The title should be clear, concise, and accurately reflect the content of the coding task.
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
// @from(Ln 345048, Col 4)
sk = L(() => {
    CK();
    Y3();
    y8();
    B1();
    C8();
    J2();
    p7();
    aR();
    i17();
    z3();
    ql();
    O2();
    QF8();
    YD();
    JF();
    T7();
    xR6();
    IX6();
    n7();
    K8();
    gZ();
    Q8();
    m8();
    Q4();
    c7();
    pK();
    mO();
    U8();
    _7();
    Sq();
    g4();
    a1();
    e8();
    VX();
    IR6();
    w77();
    eF8 = K6(P6(), 1)
})
// @from(Ln 345088, Col 0)
function J7Y(q) {
    return H7Y.includes(q ?? "")
}
// @from(Ln 345091, Col 0)
async function M7Y(q) {
    try {
        await P77(q.taskId, q)
    } catch (K) {
        E(`persistRemoteAgentMetadata failed: ${String(K)}`)
    }
}
// @from(Ln 345098, Col 0)
async function dt(q) {
    try {
        await AK8(q)
    } catch (K) {
        E(`removeRemoteAgentMetadata failed: ${String(K)}`)
    }
}
// @from(Ln 345105, Col 0)
async function W96({
    skipBundle: q = !1
} = {}) {
    let K = await pd4({
        skipBundle: q
    });
    if (K.length > 0) return {
        eligible: !1,
        errors: K
    };
    return {
        eligible: !0
    }
}
// @from(Ln 345120, Col 0)
function ml(q) {
    switch (q.type) {
        case "not_logged_in":
            return "Please run /login and sign in with your Claude.ai account (not Console).";
        case "not_in_git_repo":
            return "Background tasks require a git repository. Initialize git or run from a git repository.";
        case "no_git_remote":
            return "Background tasks require a GitHub remote. Add one with `git remote add origin REPO_URL`.";
        case "github_app_not_installed":
            return `The Claude GitHub app must be installed on this repository first.
https://github.com/apps/claude/installations/new`;
        case "policy_blocked":
            return "Remote sessions are disabled by your organization's policy. Contact your organization admin to enable them."
    }
}
// @from(Ln 345136, Col 0)
function J77(q, K, _, z, Y) {
    if (!X77(q, z)) return;
    let A = _ === "completed" ? "completed successfully" : _ === "failed" ? "failed" : "was stopped",
        O = Y ? `
<${lC}>${Y}</${lC}>` : "",
        w = $A(q),
        $ = `<${TA}>
<${hW}>${q}</${hW}>${O}
<${V16}>remote_agent</${V16}>
<${nC}>${w}</${nC}>
<${rX}>${_}</${rX}>
<${Mw}>Remote task "${K}" ${A}</${Mw}>
</${TA}>`;
    LY({
        value: $,
        mode: "task-notification",
        priority: "next"
    })
}
// @from(Ln 345156, Col 0)
function X77(q, K) {
    let _ = !1;
    return K.update(q, (z) => {
        if (z.notified) return z;
        return _ = !0, {
            ...z,
            notified: !0
        }
    }), _
}
// @from(Ln 345167, Col 0)
function P7Y(q) {
    for (let Y = q.length - 1; Y >= 0; Y--) {
        let A = q[Y];
        if (A?.type === "system" && (A.subtype === "hook_progress" || A.subtype === "hook_response")) {
            let O = vK(A.stdout, vA6);
            if (O?.trim()) return O.trim()
        }
    }
    for (let Y = q.length - 1; Y >= 0; Y--) {
        let A = q[Y];
        if (A?.type !== "assistant") continue;
        let O = s5(A.message.content, `
`),
            w = vK(O, vA6);
        if (w?.trim()) return w.trim()
    }
    let K = q.filter((Y) => Y.type === "system" && (Y.subtype === "hook_progress" || Y.subtype === "hook_response")).map((Y) => Y.stdout).join(""),
        _ = vK(K, vA6);
    if (_?.trim()) return _.trim();
    return q.filter((Y) => Y.type === "assistant").map((Y) => s5(Y.message.content, `
`)).join(`
`).trim() || null
}
// @from(Ln 345191, Col 0)
function W7Y(q) {
    for (let z = q.length - 1; z >= 0; z--) {
        let Y = q[z];
        if (Y?.type === "system" && (Y.subtype === "hook_progress" || Y.subtype === "hook_response")) {
            let A = vK(Y.stdout, vA6);
            if (A?.trim()) return A.trim()
        }
    }
    for (let z = q.length - 1; z >= 0; z--) {
        let Y = q[z];
        if (Y?.type !== "assistant") continue;
        let A = s5(Y.message.content, `
`),
            O = vK(A, vA6);
        if (O?.trim()) return O.trim()
    }
    let K = q.filter((z) => z.type === "system" && (z.subtype === "hook_progress" || z.subtype === "hook_response")).map((z) => z.stdout).join(""),
        _ = vK(K, vA6);
    if (_?.trim()) return _.trim();
    return null
}
// @from(Ln 345213, Col 0)
function D7Y(q, K, _) {
    if (!X77(q, _)) return;
    let z = `<${TA}>
<${hW}>${q}</${hW}>
<${V16}>remote_agent</${V16}>
<${rX}>completed</${rX}>
<${Mw}>Remote review completed</${Mw}>
</${TA}>
The remote review produced the following findings:

${K}`;
    LY({
        value: z,
        mode: "task-notification",
        priority: "next"
    })
}
// @from(Ln 345231, Col 0)
function kwK(q, K, _) {
    if (!X77(q, _)) return;
    let z = `<${TA}>
<${hW}>${q}</${hW}>
<${V16}>remote_agent</${V16}>
<${rX}>failed</${rX}>
<${Mw}>Remote review failed: ${K}</${Mw}>
</${TA}>
Remote review did not produce output (${K}). Tell the user to retry /ultrareview, or use /review for a local review instead.`;
    LY({
        value: z,
        mode: "task-notification",
        priority: "next"
    })
}
// @from(Ln 345247, Col 0)
function Z7Y(q) {
    let K = q.findLast((Y) => Y.type === "assistant" && Y.message.content.some((A) => A.type === "tool_use" && A.name === YF.name));
    if (!K) return [];
    let _ = K.message.content.find((Y) => Y.type === "tool_use" && Y.name === YF.name)?.input;
    if (!_) return [];
    let z = YF.inputSchema.safeParse(_);
    if (!z.success) return [];
    return z.data.todos
}
// @from(Ln 345257, Col 0)
function D96(q) {
    let {
        remoteTaskType: K,
        session: _,
        command: z,
        context: Y,
        toolUseId: A,
        isRemoteReview: O,
        isUltraplan: w,
        isLongRunning: $,
        remoteTaskMetadata: j
    } = q, H = cR("remote_agent");
    Kg8(H);
    let J = {
        ...cf(H, "remote_agent", _.title, A),
        type: "remote_agent",
        remoteTaskType: K,
        status: "running",
        sessionId: _.id,
        command: z,
        title: _.title,
        todoList: [],
        log: [],
        isRemoteReview: O,
        isUltraplan: w,
        isLongRunning: $,
        pollStartedAt: Date.now(),
        remoteTaskMetadata: j
    };
    Y.taskRegistry.register(J), M7Y({
        taskId: H,
        remoteTaskType: K,
        sessionId: _.id,
        title: _.title,
        command: z,
        spawnedAt: Date.now(),
        toolUseId: A,
        isUltraplan: w,
        isRemoteReview: O,
        isLongRunning: $,
        remoteTaskMetadata: j
    });
    let X = NwK(H, Y);
    return {
        taskId: H,
        sessionId: _.id,
        cleanup: X
    }
}
// @from(Ln 345306, Col 0)
async function M77(q) {
    try {
        await f7Y(q)
    } catch (K) {
        E(`restoreRemoteAgentTasks failed: ${String(K)}`)
    }
}
// @from(Ln 345313, Col 0)
async function f7Y(q) {
    let K = await W77();
    if (K.length === 0) return;
    for (let _ of K) {
        let z;
        try {
            z = (await w36(_.sessionId)).session_status
        } catch (A) {
            if (A instanceof Error && A.message.startsWith("Session not found:")) E(`restoreRemoteAgentTasks: dropping ${_.taskId} (404: ${String(A)})`), dt(_.taskId);
            else E(`restoreRemoteAgentTasks: skipping ${_.taskId} (recoverable: ${String(A)})`);
            continue
        }
        if (z === "archived") {
            dt(_.taskId);
            continue
        }
        let Y = {
            ...cf(_.taskId, "remote_agent", _.title, _.toolUseId),
            type: "remote_agent",
            remoteTaskType: J7Y(_.remoteTaskType) ? _.remoteTaskType : "remote-agent",
            status: "running",
            sessionId: _.sessionId,
            command: _.command,
            title: _.title,
            todoList: [],
            log: [],
            isRemoteReview: _.isRemoteReview,
            isUltraplan: _.isUltraplan,
            isLongRunning: _.isLongRunning,
            startTime: _.spawnedAt,
            pollStartedAt: Date.now(),
            remoteTaskMetadata: _.remoteTaskMetadata
        };
        q.taskRegistry.register(Y), Kg8(_.taskId), NwK(_.taskId, q)
    }
}
// @from(Ln 345350, Col 0)
function NwK(q, K) {
    let _ = !0,
        z = 1000,
        Y = 1800000,
        A = 5,
        O = 0,
        w = null,
        $ = [],
        j = null,
        H = async () => {
            if (!_) return;
            try {
                let J = K.taskRegistry.get(q);
                if (!J || J.status !== "running") return;
                let X = await YK8(J.sessionId, w);
                w = X.lastEventId;
                let M = X.newEvents.length > 0;
                if (M) {
                    $ = [...$, ...X.newEvents];
                    let h = X.newEvents.map((C) => {
                        if (C.type === "assistant") return C.message.content.filter((x) => x.type === "text").map((x) => ("text" in x) ? x.text : "").join(`
`);
                        return I6(C)
                    }).join(`
`);
                    if (h) EwK(q, h + `
`)
                }
                if (X.sessionStatus === "archived") {
                    K.taskRegistry.update(q, (h) => h.status === "running" ? {
                        ...h,
                        status: "completed",
                        endTime: Date.now()
                    } : h), J77(q, J.title, "completed", K.taskRegistry, J.toolUseId), n2(q), dt(q);
                    return
                }
                let P = X7Y.get(J.remoteTaskType);
                if (P) {
                    let h = await P(J.remoteTaskMetadata);
                    if (h !== null) {
                        K.taskRegistry.update(q, (C) => C.status === "running" ? {
                            ...C,
                            status: "completed",
                            endTime: Date.now()
                        } : C), J77(q, h, "completed", K.taskRegistry, J.toolUseId), n2(q), dt(q);
                        return
                    }
                }
                let W = J.isUltraplan || J.isLongRunning ? void 0 : $.findLast((h) => h.type === "result");
                if (J.isRemoteReview && M && j === null) j = W7Y(X.newEvents);
                let D;
                if (J.isRemoteReview && M) {
                    let h = `<${WY1}>`,
                        C = `</${WY1}>`;
                    for (let x of X.newEvents)
                        if (x.type === "system" && (x.subtype === "hook_progress" || x.subtype === "hook_response")) {
                            let B = x.stdout,
                                m = B.lastIndexOf(C),
                                S = m === -1 ? -1 : B.lastIndexOf(h, m);
                            if (S !== -1 && m > S) try {
                                let F = JSON.parse(B.slice(S + h.length, m));
                                D = {
                                    stage: F.stage,
                                    bugsFound: F.bugs_found ?? 0,
                                    bugsVerified: F.bugs_verified ?? 0,
                                    bugsRefuted: F.bugs_refuted ?? 0
                                }
                            } catch {}
                        }
                }
                let Z = $.some((h) => h.type === "assistant" || J.isRemoteReview && h.type === "system" && (h.subtype === "hook_progress" || h.subtype === "hook_response"));
                if (X.sessionStatus === "idle" && !M && Z) O++;
                else O = 0;
                let G = O >= A,
                    f = $.some((h) => h.type === "system" && (h.subtype === "hook_started" || h.subtype === "hook_progress" || h.subtype === "hook_response") && h.hook_event === "SessionStart"),
                    v = $.some((h) => h.type === "assistant"),
                    V = J.isRemoteReview && (j !== null || !f && G && v),
                    k = J.isRemoteReview && Date.now() - J.pollStartedAt > Y,
                    N = W ? W.subtype === "success" ? "completed" : "failed" : V || k ? "completed" : $.length > 0 ? "running" : "starting",
                    R = !1;
                if (K.taskRegistry.update(q, (h) => {
                        if (h.status !== "running") return R = !0, h;
                        if (!M && (N === "running" || N === "starting")) return h;
                        return {
                            ...h,
                            status: N === "starting" ? "running" : N,
                            log: $,
                            todoList: M ? Z7Y($) : h.todoList,
                            reviewProgress: D ?? h.reviewProgress,
                            endTime: W || V || k ? Date.now() : void 0
                        }
                    }), R) return;
                if (W || V || k) {
                    let h = W && W.subtype !== "success" ? "failed" : "completed";
                    if (J.isRemoteReview) {
                        let C = j ?? P7Y($);
                        if (C && h === "completed") {
                            D7Y(q, C, K.taskRegistry), n2(q), dt(q);
                            return
                        }
                        K.taskRegistry.update(q, (B) => ({
                            ...B,
                            status: "failed"
                        }));
                        let x = W && W.subtype !== "success" ? "remote session returned an error" : k && !V ? "remote session exceeded 30 minutes" : "no review output — orchestrator may have exited early";
                        kwK(q, x, K.taskRegistry), n2(q), dt(q);
                        return
                    }
                    J77(q, J.title, h, K.taskRegistry, J.toolUseId), n2(q), dt(q);
                    return
                }
            } catch (J) {
                j6(J), O = 0;
                try {
                    let X = K.taskRegistry.get(q);
                    if (X?.isRemoteReview && X.status === "running" && Date.now() - X.pollStartedAt > Y) {
                        K.taskRegistry.update(q, (M) => ({
                            ...M,
                            status: "failed",
                            endTime: Date.now()
                        })), kwK(q, "remote session exceeded 30 minutes", K.taskRegistry), n2(q), dt(q);
                        return
                    }
                } catch {}
            }
            if (_) setTimeout(H, z)
        };
    return H(), () => {
        _ = !1
    }
}
// @from(Ln 345482, Col 0)
function BX6(q) {
    return g2(q, process.env.SESSION_INGRESS_URL)
}
// @from(Ln 345485, Col 4)
H7Y
// @from(Ln 345485, Col 9)
X7Y
// @from(Ln 345485, Col 14)
mX6
// @from(Ln 345486, Col 4)
Bl = L(() => {
    rA();
    C8();
    $T();
    O78();
    Fd4();
    K8();
    U8();
    b$();
    _7();
    BP();
    g4();
    e8();
    EH();
    VX();
    sk();
    H7Y = ["remote-agent", "ultraplan", "ultrareview", "autofix-pr", "background-pr"];
    X7Y = new Map;
    mX6 = {
        name: "RemoteAgentTask",
        type: "remote_agent",
        async kill(q, K, _) {
            let z, Y, A, O = !1,
                w = 0,
                $ = !1;
            if (K.update(q, (j) => {
                    if (j.status !== "running") return j;
                    return z = j.toolUseId, Y = j.description, A = j.sessionId, O = j.isUltraplan ?? !1, w = j.pollStartedAt, $ = !0, {
                        ...j,
                        status: "killed",
                        notified: !0,
                        endTime: Date.now()
                    }
                }), $) {
                if (I$(q, "stopped", {
                        toolUseId: z,
                        summary: Y
                    }), A) ak(A).catch((j) => E(`RemoteAgentTask archive failed: ${String(j)}`));
                if (O) d("tengu_ultraplan_stopped", {
                    duration_ms: Date.now() - w
                }), _((j) => j.ultraplanSessionUrl || j.ultraplanPendingChoice ? {
                    ...j,
                    ultraplanSessionUrl: void 0,
                    ultraplanPendingChoice: void 0
                } : j)
            }
            n2(q), dt(q), E(`RemoteAgentTask ${q} killed, archiving session ${A??"unknown"}`)
        }
    }
})
// @from(Ln 345537, Col 0)
function D77() {
    return "inherit"
}
// @from(Ln 345541, Col 0)
function BC6(q, K, _, z) {
    if (process.env.CLAUDE_CODE_SUBAGENT_MODEL) return K5(process.env.CLAUDE_CODE_SUBAGENT_MODEL);
    let Y = tD8(K),
        A = ($, j) => {
            if (Y && YM($) === "bedrock") {
                if (tD8(j)) return $;
                return MT6($, Y)
            }
            return $
        };
    if (_) {
        if (LwK(_, K)) return K;
        let $ = ywK(K5(_));
        return A($, _)
    }
    let O = q ?? D77();
    if (O === "inherit") return HB({
        permissionMode: z ?? "default",
        mainLoopModel: K,
        exceeds200kTokens: !1
    });
    if (LwK(O, K)) return K;
    let w = ywK(K5(O));
    return A(w, O)
}
// @from(Ln 345567, Col 0)
function ywK(q) {
    let K = o5(q);
    if (YX() && !DP(q) && (K.includes("opus-4-7") || K.includes("opus-4-6"))) return q + "[1m]";
    return q
}
// @from(Ln 345573, Col 0)
function LwK(q, K) {
    let _ = o5(K);
    switch (q.toLowerCase()) {
        case "opus":
            return _.includes("opus");
        case "sonnet":
            return _.includes("sonnet");
        case "haiku":
            return _.includes("haiku");
        default:
            return !1
    }
}
// @from(Ln 345587, Col 0)
function _g8(q) {
    if (!q) return "Inherit from parent (default)";
    if (q === "inherit") return "Inherit from parent";
    return zv(q)
}
// @from(Ln 345593, Col 0)
function hwK() {
    return [{
        value: "sonnet",
        label: "Sonnet",
        description: "Balanced performance - best for most agents"
    }, {
        value: "opus",
        label: "Opus",
        description: "Most capable for complex reasoning tasks"
    }, {
        value: "haiku",
        label: "Haiku",
        description: "Fast and efficient for simple tasks"
    }, {
        value: "inherit",
        label: "Inherit from parent",
        description: "Use the same model as the main conversation"
    }]
}
// @from(Ln 345612, Col 4)
SZ2
// @from(Ln 345613, Col 4)
Z96 = L(() => {
    AJ();
    IT6();
    n76();
    Sq();
    x9();
    SZ2 = [...Yw6, "inherit"]
})
// @from(Ln 345622, Col 0)
function ax({
    mainThreadAgentDefinition: q,
    toolUseContext: K,
    customSystemPrompt: _,
    defaultSystemPrompt: z,
    appendSystemPrompt: Y,
    overrideSystemPrompt: A
}) {
    if (A) return sK([A]);
    let O = q ? Vj(q) ? q.getSystemPrompt({
        toolUseContext: {
            options: K.options
        }
    }) : q.getSystemPrompt() : void 0;
    if (q?.memory) d("tengu_agent_memory_loaded", {
        ...!1,
        scope: q.memory,
        source: "main-thread"
    });
    return sK([...O ? [O] : typeof _ === "string" ? [_] : Array.isArray(_) ? _ : z, ...Y ? [Y] : []])
}
// @from(Ln 345643, Col 4)
pC6 = L(() => {
    C8();
    cP();
    Q8()
})
// @from(Ln 345649, Col 0)
function zg8(q) {
    return q.replace(/<sandbox_violations>[\s\S]*?<\/sandbox_violations>/g, "")
}
// @from(Ln 345653, Col 0)
function V3(q, K, _) {
    let z = lv(),
        Y = z?.getDisplayText(q, K),
        A = Y === void 0,
        O = z ? "action_not_found" : "no_context",
        w = Yg8.useRef(!1);
    return Yg8.useEffect(() => {
        if (A && !w.current) w.current = !0, d("tengu_keybinding_fallback_used", {
            action: q,
            context: K,
            fallback: _,
            reason: O
        })
    }, [A, q, K, _, O]), A ? _ : Y
}
// @from(Ln 345668, Col 4)
Yg8
// @from(Ln 345669, Col 4)
RM = L(() => {
    C8();
    jp();
    Yg8 = K6(P6(), 1)
})
// @from(Ln 345675, Col 0)
function d$(q) {
    let K = s(25),
        {
            result: _,
            verbose: z
        } = q,
        Y = V3("app:toggleTranscript", "Global", "ctrl+o"),
        A, O, w, $, j, H, J;
    if (K[0] !== _ || K[1] !== z) {
        let D;
        if (typeof _ !== "string") D = "Tool execution failed";
        else {
            let Z = vK(_, "tool_use_error") ?? _,
                v = zg8(Z).replace(/<\/?error>/g, "").trim();
            if (!z && v.includes("InputValidationError: ")) D = "Invalid tool parameters";
            else if (v.startsWith("Error: ") || v.startsWith("Cancelled: ")) D = v;
            else D = `Error: ${v}`
        }
        $ = tz(D, `
`) + 1 - RwK, w = _1, O = u, J = "column", A = T, j = "error", H = pR8(z ? D : D.split(`
`).slice(0, RwK).join(`
`)), K[0] = _, K[1] = z, K[2] = A, K[3] = O, K[4] = w, K[5] = $, K[6] = j, K[7] = H, K[8] = J
    } else A = K[2], O = K[3], w = K[4], $ = K[5], j = K[6], H = K[7], J = K[8];
    let X;
    if (K[9] !== A || K[10] !== j || K[11] !== H) X = _G.createElement(A, {
        color: j
    }, H), K[9] = A, K[10] = j, K[11] = H, K[12] = X;
    else X = K[12];
    let M;
    if (K[13] !== $ || K[14] !== Y || K[15] !== z) M = !z && $ > 0 && _G.createElement(u, null, _G.createElement(T, {
        dimColor: !0
    }, "… +", $, " ", $ === 1 ? "line" : "lines", " ("), _G.createElement(T, {
        dimColor: !0,
        bold: !0
    }, Y), _G.createElement(T, null, " "), _G.createElement(T, {
        dimColor: !0
    }, "to see all)")), K[13] = $, K[14] = Y, K[15] = z, K[16] = M;
    else M = K[16];
    let P;
    if (K[17] !== O || K[18] !== J || K[19] !== X || K[20] !== M) P = _G.createElement(O, {
        flexDirection: J
    }, X, M), K[17] = O, K[18] = J, K[19] = X, K[20] = M, K[21] = P;
    else P = K[21];
    let W;
    if (K[22] !== w || K[23] !== P) W = _G.createElement(w, null, P), K[22] = w, K[23] = P, K[24] = W;
    else W = K[24];
    return W
}
// @from(Ln 345723, Col 4)
_G
// @from(Ln 345723, Col 8)
RwK = 10
// @from(Ln 345724, Col 4)
ny = L(() => {
    o6();
    Bj6();
    _7();
    g6();
    RM();
    GK();
    _G = K6(P6(), 1)
})
// @from(Ln 345734, Col 0)
function zG({
    children: q
}) {
    let K = FC6.useContext(CK6),
        [_, {
            isVisible: z
        }] = m46(),
        Y = FC6.useRef(q);
    if (z || K) Y.current = q;
    return FC6.default.createElement(u, {
        ref: _
    }, Y.current)
}
// @from(Ln 345747, Col 4)
FC6
// @from(Ln 345748, Col 4)
f96 = L(() => {
    $s6();
    g6();
    wy();
    FC6 = K6(P6(), 1)
})
// @from(Ln 345755, Col 0)
function pX6(q) {
    let K = s(10),
        {
            elapsedTimeSeconds: _,
            timeoutMs: z
        } = q;
    if (_ === void 0 && !z) return null;
    let Y;
    if (K[0] !== z) Y = z ? C5(z, {
        hideTrailingZeros: !0
    }) : void 0, K[0] = z, K[1] = Y;
    else Y = K[1];
    let A = Y;
    if (_ === void 0) {
        let J = `(timeout ${A})`,
            X;
        if (K[2] !== J) X = Ag8.default.createElement(T, {
            dimColor: !0
        }, J), K[2] = J, K[3] = X;
        else X = K[3];
        return X
    }
    let O = _ * 1000,
        w;
    if (K[4] !== O) w = C5(O), K[4] = O, K[5] = w;
    else w = K[5];
    let $ = w;
    if (A) {
        let J = `(${$} · timeout ${A})`,
            X;
        if (K[6] !== J) X = Ag8.default.createElement(T, {
            dimColor: !0
        }, J), K[6] = J, K[7] = X;
        else X = K[7];
        return X
    }
    let j = `(${$})`,
        H;
    if (K[8] !== j) H = Ag8.default.createElement(T, {
        dimColor: !0
    }, j), K[8] = j, K[9] = H;
    else H = K[9];
    return H
}
// @from(Ln 345799, Col 4)
Ag8
// @from(Ln 345800, Col 4)
Og8 = L(() => {
    o6();
    g6();
    c7();
    Ag8 = K6(P6(), 1)
})
// @from(Ln 345807, Col 0)
function gC6(q) {
    let K = s(30),
        {
            output: _,
            fullOutput: z,
            elapsedTimeSeconds: Y,
            totalLines: A,
            totalBytes: O,
            timeoutMs: w,
            verbose: $
        } = q,
        j;
    if (K[0] !== z) j = MO(z.trim()), K[0] = z, K[1] = j;
    else j = K[1];
    let H = j,
        J, X;
    if (K[2] !== _ || K[3] !== H || K[4] !== $) J = MO(_.trim()).split(`
`).filter(v7Y), X = $ ? H : J.slice(-5).join(`
`), K[2] = _, K[3] = H, K[4] = $, K[5] = J, K[6] = X;
    else J = K[5], X = K[6];
    let M = X;
    if (!J.length) {
        let R;
        if (K[7] === Symbol.for("react.memo_cache_sentinel")) R = iy.default.createElement(T, {
            dimColor: !0
        }, "Running… "), K[7] = R;
        else R = K[7];
        let h;
        if (K[8] !== Y || K[9] !== w) h = iy.default.createElement(_1, null, iy.default.createElement(zG, null, R, iy.default.createElement(pX6, {
            elapsedTimeSeconds: Y,
            timeoutMs: w
        }))), K[8] = Y, K[9] = w, K[10] = h;
        else h = K[10];
        return h
    }
    let P = A ? Math.max(0, A - 5) : 0,
        W = "";
    if (!$ && O && A) W = `~${A} lines`;
    else if (!$ && P > 0) W = `+${P} lines`;
    let D = $ ? void 0 : Math.min(5, J.length),
        Z;
    if (K[11] !== M) Z = iy.default.createElement(T, {
        dimColor: !0
    }, M), K[11] = M, K[12] = Z;
    else Z = K[12];
    let G;
    if (K[13] !== D || K[14] !== Z) G = iy.default.createElement(u, {
        height: D,
        flexDirection: "column",
        overflow: "hidden"
    }, Z), K[13] = D, K[14] = Z, K[15] = G;
    else G = K[15];
    let f;
    if (K[16] !== W) f = W ? iy.default.createElement(T, {
        dimColor: !0
    }, W) : null, K[16] = W, K[17] = f;
    else f = K[17];
    let v;
    if (K[18] !== Y || K[19] !== w) v = iy.default.createElement(pX6, {
        elapsedTimeSeconds: Y,
        timeoutMs: w
    }), K[18] = Y, K[19] = w, K[20] = v;
    else v = K[20];
    let V;
    if (K[21] !== O) V = O ? iy.default.createElement(T, {
        dimColor: !0
    }, o4(O)) : null, K[21] = O, K[22] = V;
    else V = K[22];
    let k;
    if (K[23] !== f || K[24] !== v || K[25] !== V) k = iy.default.createElement(u, {
        flexDirection: "row",
        gap: 1
    }, f, v, V), K[23] = f, K[24] = v, K[25] = V, K[26] = k;
    else k = K[26];
    let N;
    if (K[27] !== G || K[28] !== k) N = iy.default.createElement(_1, null, iy.default.createElement(zG, null, iy.default.createElement(u, {
        flexDirection: "column"
    }, G, k))), K[27] = G, K[28] = k, K[29] = N;
    else N = K[29];
    return N
}
// @from(Ln 345889, Col 0)
function v7Y(q) {
    return q
}
// @from(Ln 345892, Col 4)
iy
// @from(Ln 345893, Col 4)
wg8 = L(() => {
    o6();
    mN();
    g6();
    c7();
    GK();
    f96();
    Og8();
    iy = K6(P6(), 1)
})
// @from(Ln 345904, Col 0)
function EX() {
    let q = H9();
    return SwK.useMemo(() => Uk(() => q.getState(), q.setState), [q])
}
// @from(Ln 345908, Col 4)
SwK
// @from(Ln 345909, Col 4)
$S = L(() => {
    bc();
    N7();
    SwK = K6(P6(), 1)
})
// @from(Ln 345915, Col 0)
function T7Y(q) {
    if (!q.match(/<sandbox_violations>([\s\S]*?)<\/sandbox_violations>/)) return {
        cleanedStderr: q
    };
    return {
        cleanedStderr: zg8(q).trim()
    }
}
// @from(Ln 345924, Col 0)
function V7Y(q) {
    let K = q.match(CwK);
    if (!K) return {
        cleanedStderr: q,
        cwdResetWarning: null
    };
    let _ = K[1] ?? null;
    return {
        cleanedStderr: q.replace(CwK, "").trim(),
        cwdResetWarning: _
    }
}
// @from(Ln 345937, Col 0)
function FX6(q) {
    let K = s(34),
        {
            content: _,
            verbose: z,
            timeoutMs: Y
        } = q,
        {
            stdout: A,
            stderr: O,
            isImage: w,
            returnCodeInterpretation: $,
            noOutputExpected: j,
            backgroundTaskId: H
        } = _,
        J = A === void 0 ? "" : A,
        X = O === void 0 ? "" : O,
        M, P, W, D, Z, G, f;
    if (K[0] !== w || K[1] !== X || K[2] !== J || K[3] !== z) {
        f = Symbol.for("react.early_return_sentinel");
        q: {
            let {
                cleanedStderr: R
            } = T7Y(X);
            if ({
                    cleanedStderr: W,
                    cwdResetWarning: P
                } = V7Y(R), w) {
                let h;
                if (K[11] === Symbol.for("react.memo_cache_sentinel")) h = tk.default.createElement(_1, {
                    height: 1
                }, tk.default.createElement(T, {
                    dimColor: !0
                }, "[Image data detected and sent to Claude]")), K[11] = h;
                else h = K[11];
                f = h;
                break q
            }
            if (M = u, D = "column", K[12] !== J || K[13] !== z) Z = J !== "" ? tk.default.createElement(LR, {
                content: J,
                verbose: z
            }) : null,
            K[12] = J,
            K[13] = z,
            K[14] = Z;
            else Z = K[14];G = W.trim() !== "" ? tk.default.createElement(LR, {
                content: W,
                verbose: z,
                isError: !0
            }) : null
        }
        K[0] = w, K[1] = X, K[2] = J, K[3] = z, K[4] = M, K[5] = P, K[6] = W, K[7] = D, K[8] = Z, K[9] = G, K[10] = f
    } else M = K[4], P = K[5], W = K[6], D = K[7], Z = K[8], G = K[9], f = K[10];
    if (f !== Symbol.for("react.early_return_sentinel")) return f;
    let v;
    if (K[15] !== P) v = P ? tk.default.createElement(_1, null, tk.default.createElement(T, {
        dimColor: !0
    }, P)) : null, K[15] = P, K[16] = v;
    else v = K[16];
    let V;
    if (K[17] !== H || K[18] !== P || K[19] !== j || K[20] !== $ || K[21] !== W || K[22] !== J) V = J === "" && W.trim() === "" && !P ? tk.default.createElement(_1, {
        height: 1
    }, tk.default.createElement(T, {
        dimColor: !0
    }, H ? tk.default.createElement(tk.default.Fragment, null, "Running in the background", " ", tk.default.createElement(A8, {
        chord: "down",
        action: "manage",
        parens: !0
    })) : $ || (j ? "Done" : "(No output)"))) : null, K[17] = H, K[18] = P, K[19] = j, K[20] = $, K[21] = W, K[22] = J, K[23] = V;
    else V = K[23];
    let k;
    if (K[24] !== Y) k = Y && tk.default.createElement(_1, null, tk.default.createElement(pX6, {
        timeoutMs: Y
    })), K[24] = Y, K[25] = k;
    else k = K[25];
    let N;
    if (K[26] !== M || K[27] !== k || K[28] !== D || K[29] !== Z || K[30] !== G || K[31] !== v || K[32] !== V) N = tk.default.createElement(M, {
        flexDirection: D
    }, Z, G, v, V, k), K[26] = M, K[27] = k, K[28] = D, K[29] = Z, K[30] = G, K[31] = v, K[32] = V, K[33] = N;
    else N = K[33];
    return N
}
// @from(Ln 346019, Col 4)
tk
// @from(Ln 346019, Col 8)
CwK
// @from(Ln 346020, Col 4)
$g8 = L(() => {
    o6();
    u7();
    GK();
    Bj6();
    Og8();
    g6();
    tk = K6(P6(), 1), CwK = /(?:^|\n)(Shell cwd was reset to .+)$/
})
// @from(Ln 346033, Col 0)
function UC6(q) {
    let K = XM(q.trim());
    if (K[0] !== "sed") return null;
    let _ = K.slice(1),
        z = !1,
        Y = !1,
        A = null,
        O = null,
        w = 0;
    while (w < _.length) {
        let D = _[w];
        if (D === "-i" || D === "--in-place") {
            if (z = !0, w++, w < _.length) {
                let Z = _[w];
                if (typeof Z === "string" && !Z.startsWith("-") && (Z === "" || Z.startsWith("."))) w++
            }
            continue
        }
        if (D.startsWith("-i")) {
            z = !0, w++;
            continue
        }
        if (D === "-E" || D === "-r" || D === "--regexp-extended") {
            Y = !0, w++;
            continue
        }
        if (D === "-e" || D === "--expression") {
            if (w + 1 < _.length && typeof _[w + 1] === "string") {
                if (A !== null) return null;
                A = _[w + 1], w += 2;
                continue
            }
            return null
        }
        if (D.startsWith("--expression=")) {
            if (A !== null) return null;
            A = D.slice(13), w++;
            continue
        }
        if (D.startsWith("-")) return null;
        if (A === null) A = D;
        else if (O === null) O = D;
        else return null;
        w++
    }
    if (!z || !A || !O) return null;
    if (!A.match(/^s\//)) return null;
    let j = A.slice(2),
        H = "",
        J = "",
        X = "",
        M = "pattern",
        P = 0;
    while (P < j.length) {
        let D = j[P];
        if (D === "\\" && P + 1 < j.length) {
            if (M === "pattern") H += D + j[P + 1];
            else if (M === "replacement") J += D + j[P + 1];
            else X += D + j[P + 1];
            P += 2;
            continue
        }
        if (D === "/") {
            if (M === "pattern") M = "replacement";
            else if (M === "replacement") M = "flags";
            else return null;
            P++;
            continue
        }
        if (M === "pattern") H += D;
        else if (M === "replacement") J += D;
        else X += D;
        P++
    }
    if (M !== "flags") return null;
    if (!/^[gpimIM1-9]*$/.test(X)) return null;
    return {
        filePath: O,
        pattern: H,
        replacement: J,
        flags: X,
        extendedRegex: Y
    }
}
// @from(Ln 346118, Col 0)
function pwK(q, K) {
    let _ = "";
    if (K.flags.includes("g")) _ += "g";
    if (K.flags.includes("i") || K.flags.includes("I")) _ += "i";
    if (K.flags.includes("m") || K.flags.includes("M")) _ += "m";
    let z = K.pattern.replace(/\\\//g, "/");
    if (!K.extendedRegex) z = z.replace(/\\\\/g, bwK).replace(/\\\+/g, IwK).replace(/\\\?/g, xwK).replace(/\\\|/g, uwK).replace(/\\\(/g, mwK).replace(/\\\)/g, BwK).replace(/\+/g, "\\+").replace(/\?/g, "\\?").replace(/\|/g, "\\|").replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(N7Y, "\\\\").replace(E7Y, "+").replace(y7Y, "?").replace(L7Y, "|").replace(h7Y, "(").replace(R7Y, ")");
    let A = `___ESCAPED_AMPERSAND_${k7Y(8).toString("hex")}___`,
        O = K.replacement.replace(/\\\//g, "/").replace(/\\&/g, A).replace(/&/g, "$$&").replace(new RegExp(A, "g"), "&");
    try {
        let w = new RegExp(z, _);
        return q.replace(w, O)
    } catch {
        return q
    }
}
// @from(Ln 346134, Col 4)
bwK = "\x00BACKSLASH\x00"
// @from(Ln 346135, Col 4)
IwK = "\x00PLUS\x00"
// @from(Ln 346136, Col 4)
xwK = "\x00QUESTION\x00"
// @from(Ln 346137, Col 4)
uwK = "\x00PIPE\x00"
// @from(Ln 346138, Col 4)
mwK = "\x00LPAREN\x00"
// @from(Ln 346139, Col 4)
BwK = "\x00RPAREN\x00"
// @from(Ln 346140, Col 4)
N7Y
// @from(Ln 346140, Col 9)
E7Y
// @from(Ln 346140, Col 14)
y7Y
// @from(Ln 346140, Col 19)
L7Y
// @from(Ln 346140, Col 24)
h7Y
// @from(Ln 346140, Col 29)
R7Y
// @from(Ln 346141, Col 4)
OK8 = L(() => {
    vD();
    N7Y = new RegExp(bwK, "g"), E7Y = new RegExp(IwK, "g"), y7Y = new RegExp(xwK, "g"), L7Y = new RegExp(uwK, "g"), h7Y = new RegExp(mwK, "g"), R7Y = new RegExp(BwK, "g")
})
// @from(Ln 346146, Col 0)
function G96(q) {
    let K = s(10),
        _;
    if (K[0] !== q) _ = q === void 0 ? {} : q, K[0] = q, K[1] = _;
    else _ = K[1];
    let {
        onBackground: z
    } = _, Y = R7(), A = EX(), O;
    if (K[2] !== z || K[3] !== Y || K[4] !== A) O = () => {
        jg8(A, () => gD(Y)), z?.()
    }, K[2] = z, K[3] = Y, K[4] = A, K[5] = O;
    else O = K[5];
    let w = O,
        $;
    if (K[6] === Symbol.for("react.memo_cache_sentinel")) $ = {
        context: "Task"
    }, K[6] = $;
    else $ = K[6];
    G1("task:background", w, $);
    let j = V3("task:background", "Task", "ctrl+b"),
        H = X7.terminal === "tmux" && j === "ctrl+b" ? "ctrl+b ctrl+b (twice)" : j;
    if (S6(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS)) return null;
    let J;
    if (K[7] === Symbol.for("react.memo_cache_sentinel")) J = {
        keyCase: "lower"
    }, K[7] = J;
    else J = K[7];
    let X;
    if (K[8] !== H) X = bJ.createElement(u, {
        paddingLeft: 5
    }, bJ.createElement(T, {
        dimColor: !0
    }, bJ.createElement(A8, {
        chord: H,
        action: "run in background",
        parens: !0,
        format: J
    }))), K[8] = H, K[9] = X;
    else X = K[9];
    return X
}
// @from(Ln 346188, Col 0)
function gwK(q, {
    verbose: K,
    theme: _
}) {
    let {
        command: z,
        rerun: Y
    } = q;
    if (!z) return Y ? `rerun ${Y}` : null;
    let A = UC6(z);
    if (A) return K ? A.filePath : S3(A.filePath);
    if (!K) {
        let O = z.split(`
`);
        if (lq()) {
            let j = wR8(z);
            if (j) return j.length > wK8 ? j.slice(0, wK8) + "…" : j
        }
        let w = O.length > FwK,
            $ = z.length > wK8;
        if (w || $) {
            let j = z;
            if (w) j = O.slice(0, FwK).join(`
`);
            if (j.length > wK8) j = j.slice(0, wK8);
            return bJ.createElement(T, null, j.trim(), "…")
        }
    }
    return z
}
// @from(Ln 346219, Col 0)
function UwK(q, {
    verbose: K,
    tools: _,
    terminalSize: z,
    inProgressToolCallCount: Y
}) {
    let A = q.at(-1);
    if (!A || !A.data) return bJ.createElement(_1, {
        height: 1
    }, bJ.createElement(T, {
        dimColor: !0
    }, "Running…"));
    let O = A.data;
    return bJ.createElement(gC6, {
        fullOutput: O.fullOutput,
        output: O.output,
        elapsedTimeSeconds: O.elapsedTimeSeconds,
        totalLines: O.totalLines,
        totalBytes: O.totalBytes,
        timeoutMs: O.timeoutMs,
        taskId: O.taskId,
        verbose: K
    })
}
// @from(Ln 346244, Col 0)
function QwK() {
    return bJ.createElement(_1, {
        height: 1
    }, bJ.createElement(T, {
        dimColor: !0
    }, "Waiting…"))
}
// @from(Ln 346252, Col 0)
function dwK(q, K, {
    verbose: _,
    theme: z,
    tools: Y,
    style: A
}) {
    let w = K.at(-1)?.data?.timeoutMs;
    return bJ.createElement(FX6, {
        content: q,
        verbose: _,
        timeoutMs: w
    })
}
// @from(Ln 346266, Col 0)
function cwK(q, {
    verbose: K,
    progressMessagesForMessage: _,
    tools: z
}) {
    return bJ.createElement(d$, {
        result: q,
        verbose: K
    })
}
// @from(Ln 346276, Col 4)
bJ
// @from(Ln 346276, Col 8)
FwK = 2
// @from(Ln 346277, Col 4)
wK8 = 160
// @from(Ln 346278, Col 4)
$K8 = L(() => {
    o6();
    u7();
    ny();
    GK();
    wg8();
    g6();
    C7();
    RM();
    jt();
    N7();
    $S();
    pl();
    D_();
    Q8();
    eK();
    nO();
    $g8();
    OK8();
    bJ = K6(P6(), 1)
})
// @from(Ln 346300, Col 0)
function A5(q) {
    return q.map((K) => {
        let _ = String(K);
        if (_ === "") return "''";
        if (/^[A-Za-z0-9_./:=@+,-]+$/.test(_)) return _;
        return "'" + _.replaceAll("'", `'"'"'`) + "'"
    }).join(" ")
}
// @from(Ln 346308, Col 4)
G77 = {}
// @from(Ln 346317, Col 0)
function S7Y(q) {
    jK8 = q
}
// @from(Ln 346321, Col 0)
function Z77() {
    return jK8
}
// @from(Ln 346325, Col 0)
function f77(q) {
    jK8 = null, gX6 = q, E(`[TeammateModeSnapshot] CLI override cleared, new mode: ${q}`)
}
// @from(Ln 346329, Col 0)
function lwK() {
    if (jK8) gX6 = jK8, E(`[TeammateModeSnapshot] Captured from CLI override: ${gX6}`);
    else gX6 = H8().teammateMode ?? "auto", E(`[TeammateModeSnapshot] Captured from config: ${gX6}`)
}
// @from(Ln 346334, Col 0)
function UX6() {
    if (gX6 === null) j6(Error("getTeammateModeFromSnapshot called before capture - this indicates an initialization bug")), lwK();
    return gX6 ?? "auto"
}
// @from(Ln 346338, Col 4)
gX6 = null
// @from(Ln 346339, Col 4)
jK8 = null
// @from(Ln 346340, Col 4)
QX6 = L(() => {
    h1();
    K8();
    U8()
})
// @from(Ln 346348, Col 0)
async function nwK() {
    if ((await w1("which", ["uv"])).code === 0) return E("[it2Setup] Found uv (will use uv tool install)"), "uvx";
    if ((await w1("which", ["pipx"])).code === 0) return E("[it2Setup] Found pipx package manager"), "pipx";
    if ((await w1("which", ["pip"])).code === 0) return E("[it2Setup] Found pip package manager"), "pip";
    if ((await w1("which", ["pip3"])).code === 0) return E("[it2Setup] Found pip3 package manager"), "pip";
    return E("[it2Setup] No Python package manager found"), null
}
// @from(Ln 346355, Col 0)
async function C7Y() {
    return (await w1("which", ["it2"])).code === 0
}
// @from(Ln 346358, Col 0)
async function iwK(q) {
    E(`[it2Setup] Installing it2 using ${q}`);
    let K;
    switch (q) {
        case "uvx":
            K = await M7("uv", ["tool", "install", "it2"], {
                cwd: Hg8()
            });
            break;
        case "pipx":
            K = await M7("pipx", ["install", "it2"], {
                cwd: Hg8()
            });
            break;
        case "pip":
            if (K = await M7("pip", ["install", "--user", "it2"], {
                    cwd: Hg8()
                }), K.code !== 0) K = await M7("pip3", ["install", "--user", "it2"], {
                cwd: Hg8()
            });
            break
    }
    if (K.code !== 0) {
        let _ = K.stderr || "Unknown installation error";
        return j6(Error(`[it2Setup] Failed to install it2: ${_}`)), {
            success: !1,
            error: _,
            packageManager: q
        }
    }
    return E("[it2Setup] it2 installed successfully"), {
        success: !0,
        packageManager: q
    }
}
// @from(Ln 346393, Col 0)
async function rwK() {
    if (E("[it2Setup] Verifying it2 setup..."), !await C7Y()) return {
        success: !1,
        error: "it2 CLI is not installed or not in PATH"
    };
    let K = await w1("it2", ["session", "list"]);
    if (K.code !== 0) {
        let _ = K.stderr.toLowerCase();
        if (_.includes("api") || _.includes("python") || _.includes("connection refused") || _.includes("not enabled")) return E("[it2Setup] Python API not enabled in iTerm2"), {
            success: !1,
            error: "Python API not enabled in iTerm2 preferences",
            needsPythonApiEnabled: !0
        };
        return {
            success: !1,
            error: K.stderr || "Failed to communicate with iTerm2"
        }
    }
    return E("[it2Setup] it2 setup verified successfully"), {
        success: !0
    }
}
// @from(Ln 346416, Col 0)
function owK() {
    return ["Almost done! Enable the Python API in iTerm2:", "", "  iTerm2 → Settings → General → Magic → Enable Python API", "", "After enabling, you may need to restart iTerm2."]
}
// @from(Ln 346420, Col 0)
function awK() {
    if (H8().iterm2It2SetupComplete !== !0) d8((K) => ({
        ...K,
        iterm2It2SetupComplete: !0
    })), E("[it2Setup] Marked it2 setup as complete")
}
// @from(Ln 346427, Col 0)
function swK(q) {
    if (H8().preferTmuxOverIterm2 !== q) d8((_) => ({
        ..._,
        preferTmuxOverIterm2: q
    })), E(`[it2Setup] Set preferTmuxOverIterm2 = ${q}`)
}
// @from(Ln 346434, Col 0)
function twK() {
    return H8().preferTmuxOverIterm2 === !0
}
// @from(Ln 346437, Col 4)
v77 = L(() => {
    h1();
    K8();
    Q4();
    U8()
})
// @from(Ln 346444, Col 0)
function ewK(q) {
    let K = s(60),
        {
            onDone: _,
            tmuxAvailable: z
        } = q,
        [Y, A] = dK.useState("initial"),
        [O, w] = dK.useState(null),
        [$, j] = dK.useState(null),
        H = $3(),
        J, X;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) J = () => {
        nwK().then((n) => {
            w(n)
        })
    }, X = [], K[0] = J, K[1] = X;
    else J = K[0], X = K[1];
    dK.useEffect(J, X);
    let M;
    if (K[2] !== _) M = () => {
        _("cancelled")
    }, K[2] = _, K[3] = M;
    else M = K[3];
    let P = M,
        W = Y !== "installing" && Y !== "verifying",
        D;
    if (K[4] !== W) D = {
        context: "Confirmation",
        isActive: W
    }, K[4] = W, K[5] = D;
    else D = K[5];
    G1("confirm:no", P, D);
    let Z;
    if (K[6] !== _) Z = function() {
        A("verifying"), rwK().then((l) => {
            if (l.success) awK(), A("success"), setTimeout(_, 1500, "installed");
            else j(l.error || "Verification failed"), A("failed")
        })
    }, K[6] = _, K[7] = Z;
    else Z = K[7];
    let G = Z,
        f;
    if (K[8] !== G || K[9] !== Y) f = function(l) {
        if (Y === "api-instructions" && l.key === "return") l.preventDefault(), G()
    }, K[8] = G, K[9] = Y, K[10] = f;
    else f = K[10];
    let v = f,
        V;
    if (K[11] !== O) V = async function() {
        if (!O) {
            j("No Python package manager found (uvx, pipx, or pip)"), A("failed");
            return
        }
        A("installing");
        let l = await iwK(O);
        if (l.success) A("api-instructions");
        else j(l.error || "Installation failed"), A("install-failed")
    }, K[11] = O, K[12] = V;
    else V = K[12];
    let k = V,
        N;
    if (K[13] !== _) N = function() {
        swK(!0), _("use-tmux")
    }, K[13] = _, K[14] = N;
    else N = K[14];
    let R = N,
        h;
    if (K[15] === Symbol.for("react.memo_cache_sentinel")) h = dK.default.createElement(T, {
        bold: !0,
        color: "permission"
    }, "iTerm2 Split Pane Setup"), K[15] = h;
    else h = K[15];
    let C;
    if (K[16] !== P || K[17] !== k || K[18] !== R || K[19] !== O || K[20] !== Y || K[21] !== z) C = Y === "initial" && dK.default.createElement(b7Y, {
        packageManager: O,
        tmuxAvailable: z,
        onInstall: k,
        onUseTmux: R,
        onCancel: P
    }), K[16] = P, K[17] = k, K[18] = R, K[19] = O, K[20] = Y, K[21] = z, K[22] = C;
    else C = K[22];
    let x;
    if (K[23] !== O || K[24] !== Y) x = Y === "installing" && dK.default.createElement(I7Y, {
        packageManager: O
    }), K[23] = O, K[24] = Y, K[25] = x;
    else x = K[25];
    let B;
    if (K[26] !== $ || K[27] !== P || K[28] !== k || K[29] !== R || K[30] !== O || K[31] !== Y || K[32] !== z) B = Y === "install-failed" && dK.default.createElement(x7Y, {
        error: $,
        packageManager: O,
        tmuxAvailable: z,
        onRetry: k,
        onUseTmux: R,
        onCancel: P
    }), K[26] = $, K[27] = P, K[28] = k, K[29] = R, K[30] = O, K[31] = Y, K[32] = z, K[33] = B;
    else B = K[33];
    let m;
    if (K[34] !== Y) m = Y === "api-instructions" && dK.default.createElement(u7Y, null), K[34] = Y, K[35] = m;
    else m = K[35];
    let S;
    if (K[36] !== Y) S = Y === "verifying" && dK.default.createElement(B7Y, null), K[36] = Y, K[37] = S;
    else S = K[37];
    let F;
    if (K[38] !== Y) F = Y === "success" && dK.default.createElement(p7Y, null), K[38] = Y, K[39] = F;
    else F = K[39];
    let U;
    if (K[40] !== $ || K[41] !== P || K[42] !== R || K[43] !== G || K[44] !== Y || K[45] !== z) U = Y === "failed" && dK.default.createElement(F7Y, {
        error: $,
        tmuxAvailable: z,
        onRetry: G,
        onUseTmux: R,
        onCancel: P
    }), K[40] = $, K[41] = P, K[42] = R, K[43] = G, K[44] = Y, K[45] = z, K[46] = U;
    else U = K[46];
    let g;
    if (K[47] !== H || K[48] !== Y) g = Y !== "installing" && Y !== "verifying" && Y !== "success" && dK.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, H.pending ? dK.default.createElement(dK.default.Fragment, null, "Press ", H.keyName, " again to exit") : dK.default.createElement(A8, {
        chord: "escape",
        action: "cancel"
    })), K[47] = H, K[48] = Y, K[49] = g;
    else g = K[49];
    let c;
    if (K[50] !== v || K[51] !== C || K[52] !== x || K[53] !== B || K[54] !== m || K[55] !== S || K[56] !== F || K[57] !== U || K[58] !== g) c = dK.default.createElement(A_, {
        color: "permission"
    }, dK.default.createElement(u, {
        flexDirection: "column",
        gap: 1,
        paddingBottom: 1,
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: v
    }, h, C, x, B, m, S, F, U, g)), K[50] = v, K[51] = C, K[52] = x, K[53] = B, K[54] = m, K[55] = S, K[56] = F, K[57] = U, K[58] = g, K[59] = c;
    else c = K[59];
    return c
}
// @from(Ln 346582, Col 0)
function b7Y(q) {
    let K = s(17),
        {
            packageManager: _,
            tmuxAvailable: z,
            onInstall: Y,
            onUseTmux: A,
            onCancel: O
        } = q,
        w = _ ? `Uses ${_} to install the it2 CLI tool` : "Requires Python (uvx, pipx, or pip)",
        $;
    if (K[0] !== w) $ = {
        label: "Install it2 now",
        value: "install",
        description: w
    }, K[0] = w, K[1] = $;
    else $ = K[1];
    let j;
    if (K[2] !== $ || K[3] !== z) {
        if (j = [$], z) {
            let W;
            if (K[5] === Symbol.for("react.memo_cache_sentinel")) W = {
                label: "Use tmux instead",
                value: "tmux",
                description: "Opens teammates in a separate tmux session"
            }, K[5] = W;
            else W = K[5];
            j.push(W)
        }
        let P;
        if (K[6] === Symbol.for("react.memo_cache_sentinel")) P = {
            label: "Cancel",
            value: "cancel",
            description: "Skip teammate spawning for now"
        }, K[6] = P;
        else P = K[6];
        j.push(P), K[2] = $, K[3] = z, K[4] = j
    } else j = K[4];
    let H, J;
    if (K[7] === Symbol.for("react.memo_cache_sentinel")) H = dK.default.createElement(T, null, "To use native iTerm2 split panes for teammates, you need the", " ", dK.default.createElement(T, {
        bold: !0
    }, "it2"), " CLI tool."), J = dK.default.createElement(T, {
        dimColor: !0
    }, "This enables teammates to appear as split panes within your current window."), K[7] = H, K[8] = J;
    else H = K[7], J = K[8];
    let X;
    if (K[9] !== O || K[10] !== Y || K[11] !== A) X = (P) => {
        q: switch (P) {
            case "install": {
                Y();
                break q
            }
            case "tmux": {
                A();
                break q
            }
            case "cancel":
                O()
        }
    }, K[9] = O, K[10] = Y, K[11] = A, K[12] = X;
    else X = K[12];
    let M;
    if (K[13] !== O || K[14] !== j || K[15] !== X) M = dK.default.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, H, J, dK.default.createElement(u, {
        marginTop: 1
    }, dK.default.createElement(A1, {
        options: j,
        onChange: X,
        onCancel: O
    }))), K[13] = O, K[14] = j, K[15] = X, K[16] = M;
    else M = K[16];
    return M
}
// @from(Ln 346658, Col 0)
function I7Y(q) {
    let K = s(6),
        {
            packageManager: _
        } = q,
        z;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) z = dK.default.createElement(Y5, null), K[0] = z;
    else z = K[0];
    let Y;
    if (K[1] !== _) Y = dK.default.createElement(u, null, z, dK.default.createElement(T, null, " Installing it2 using ", _, "…")), K[1] = _, K[2] = Y;
    else Y = K[2];
    let A;
    if (K[3] === Symbol.for("react.memo_cache_sentinel")) A = dK.default.createElement(T, {
        dimColor: !0
    }, "This may take a moment."), K[3] = A;
    else A = K[3];
    let O;
    if (K[4] !== Y) O = dK.default.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, Y, A), K[4] = Y, K[5] = O;
    else O = K[5];
    return O
}
// @from(Ln 346683, Col 0)
function x7Y(q) {
    let K = s(22),
        {
            error: _,
            packageManager: z,
            tmuxAvailable: Y,
            onRetry: A,
            onUseTmux: O,
            onCancel: w
        } = q,
        $;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) $ = {
        label: "Try again",
        value: "retry",
        description: "Retry the installation"
    }, K[0] = $;
    else $ = K[0];
    let j;
    if (K[1] !== Y) {
        if (j = [$], Y) {
            let G;
            if (K[3] === Symbol.for("react.memo_cache_sentinel")) G = {
                label: "Use tmux instead",
                value: "tmux",
                description: "Falls back to tmux for teammate panes"
            }, K[3] = G;
            else G = K[3];
            j.push(G)
        }
        let Z;
        if (K[4] === Symbol.for("react.memo_cache_sentinel")) Z = {
            label: "Cancel",
            value: "cancel",
            description: "Skip teammate spawning for now"
        }, K[4] = Z;
        else Z = K[4];
        j.push(Z), K[1] = Y, K[2] = j
    } else j = K[2];
    let H;
    if (K[5] === Symbol.for("react.memo_cache_sentinel")) H = dK.default.createElement(T, {
        color: "error"
    }, "Installation failed"), K[5] = H;
    else H = K[5];
    let J;
    if (K[6] !== _) J = _ && dK.default.createElement(T, {
        dimColor: !0
    }, _), K[6] = _, K[7] = J;
    else J = K[7];
    let X = z === "uvx" ? "uv tool install it2" : z === "pipx" ? "pipx install it2" : "pip install --user it2",
        M;
    if (K[8] !== X) M = dK.default.createElement(T, {
        dimColor: !0
    }, "You can try installing manually:", " ", X), K[8] = X, K[9] = M;
    else M = K[9];
    let P;
    if (K[10] !== w || K[11] !== A || K[12] !== O) P = (Z) => {
        q: switch (Z) {
            case "retry": {
                A();
                break q
            }
            case "tmux": {
                O();
                break q
            }
            case "cancel":
                w()
        }
    }, K[10] = w, K[11] = A, K[12] = O, K[13] = P;
    else P = K[13];
    let W;
    if (K[14] !== w || K[15] !== j || K[16] !== P) W = dK.default.createElement(u, {
        marginTop: 1
    }, dK.default.createElement(A1, {
        options: j,
        onChange: P,
        onCancel: w
    })), K[14] = w, K[15] = j, K[16] = P, K[17] = W;
    else W = K[17];
    let D;
    if (K[18] !== J || K[19] !== M || K[20] !== W) D = dK.default.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, H, J, M, W), K[18] = J, K[19] = M, K[20] = W, K[21] = D;
    else D = K[21];
    return D
}
// @from(Ln 346771, Col 0)
function u7Y() {
    let q = s(6),
        K, _, z, Y, A;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) {
        let w = owK();
        K = u, _ = "column", z = 1, Y = dK.default.createElement(T, {
            color: "success"
        }, dK.default.createElement(D4, {
            status: "success",
            withSpace: !0
        }), "it2 installed successfully"), A = dK.default.createElement(u, {
            flexDirection: "column",
            marginTop: 1
        }, w.map(m7Y)), q[0] = K, q[1] = _, q[2] = z, q[3] = Y, q[4] = A
    } else K = q[0], _ = q[1], z = q[2], Y = q[3], A = q[4];
    let O;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) O = dK.default.createElement(K, {
        flexDirection: _,
        gap: z
    }, Y, A, dK.default.createElement(u, {
        marginTop: 1
    }, dK.default.createElement(T, {
        dimColor: !0
    }, "Press Enter when ready to verify…"))), q[5] = O;
    else O = q[5];
    return O
}
// @from(Ln 346799, Col 0)
function m7Y(q, K) {
    return dK.default.createElement(T, {
        key: K
    }, q)
}
// @from(Ln 346805, Col 0)
function B7Y() {
    let q = s(1),
        K;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) K = dK.default.createElement(u, null, dK.default.createElement(Y5, null), dK.default.createElement(T, null, " Verifying it2 can communicate with iTerm2…")), q[0] = K;
    else K = q[0];
    return K
}
// @from(Ln 346813, Col 0)
function p7Y() {
    let q = s(1),
        K;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) K = dK.default.createElement(u, {
        flexDirection: "column"
    }, dK.default.createElement(T, {
        color: "success"
    }, dK.default.createElement(D4, {
        status: "success",
        withSpace: !0
    }), "iTerm2 split pane support is ready"), dK.default.createElement(T, {
        dimColor: !0
    }, "Teammates will now appear as split panes.")), q[0] = K;
    else K = q[0];
    return K
}
// @from(Ln 346830, Col 0)
function F7Y(q) {
    let K = s(21),
        {
            error: _,
            tmuxAvailable: z,
            onRetry: Y,
            onUseTmux: A,
            onCancel: O
        } = q,
        w;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) w = {
        label: "Try again",
        value: "retry",
        description: "Verify the connection again"
    }, K[0] = w;
    else w = K[0];
    let $;
    if (K[1] !== z) {
        if ($ = [w], z) {
            let Z;
            if (K[3] === Symbol.for("react.memo_cache_sentinel")) Z = {
                label: "Use tmux instead",
                value: "tmux",
                description: "Falls back to tmux for teammate panes"
            }, K[3] = Z;
            else Z = K[3];
            $.push(Z)
        }
        let D;
        if (K[4] === Symbol.for("react.memo_cache_sentinel")) D = {
            label: "Cancel",
            value: "cancel",
            description: "Skip teammate spawning for now"
        }, K[4] = D;
        else D = K[4];
        $.push(D), K[1] = z, K[2] = $
    } else $ = K[2];
    let j;
    if (K[5] === Symbol.for("react.memo_cache_sentinel")) j = dK.default.createElement(T, {
        color: "error"
    }, "Verification failed"), K[5] = j;
    else j = K[5];
    let H;
    if (K[6] !== _) H = _ && dK.default.createElement(T, {
        dimColor: !0
    }, _), K[6] = _, K[7] = H;
    else H = K[7];
    let J;
    if (K[8] === Symbol.for("react.memo_cache_sentinel")) J = dK.default.createElement(T, null, "Make sure:"), K[8] = J;
    else J = K[8];
    let X;
    if (K[9] === Symbol.for("react.memo_cache_sentinel")) X = dK.default.createElement(u, {
        flexDirection: "column",
        paddingLeft: 2
    }, dK.default.createElement(T, null, "· Python API is enabled in iTerm2 preferences"), dK.default.createElement(T, null, "· You may need to restart iTerm2 after enabling")), K[9] = X;
    else X = K[9];
    let M;
    if (K[10] !== O || K[11] !== Y || K[12] !== A) M = (D) => {
        q: switch (D) {
            case "retry": {
                Y();
                break q
            }
            case "tmux": {
                A();
                break q
            }
            case "cancel":
                O()
        }
    }, K[10] = O, K[11] = Y, K[12] = A, K[13] = M;
    else M = K[13];
    let P;
    if (K[14] !== O || K[15] !== $ || K[16] !== M) P = dK.default.createElement(u, {
        marginTop: 1
    }, dK.default.createElement(A1, {
        options: $,
        onChange: M,
        onCancel: O
    })), K[14] = O, K[15] = $, K[16] = M, K[17] = P;
    else P = K[17];
    let W;
    if (K[18] !== H || K[19] !== P) W = dK.default.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, j, H, J, X, P), K[18] = H, K[19] = P, K[20] = W;
    else W = K[20];
    return W
}
// @from(Ln 346919, Col 4)
dK
// @from(Ln 346920, Col 4)
q2K = L(() => {
    o6();
    g_();
    u7();
    DJ();
    Y2();
    Ej();
    C$();
    g6();
    C7();
    v77();
    dK = K6(P6(), 1)
})
// @from(Ln 346934, Col 0)
function K2K() {
    if (process.env[Uh6]) return process.env[Uh6];
    return v$() ? process.execPath : process.argv[1]
}
// @from(Ln 346939, Col 0)
function _2K(q) {
    let K = [],
        {
            planModeRequired: _,
            permissionMode: z
        } = q || {};
    if (_);
    else if (z === "bypassPermissions") K.push("--dangerously-skip-permissions");
    else if (z === "acceptEdits") K.push("--permission-mode acceptEdits");
    else if (z === "auto") K.push("--permission-mode auto");
    let Y = qm();
    if (Y) K.push(`--model ${A5([Y])}`);
    let A = L86();
    if (A) K.push(`--settings ${A5([A])}`);
    let O = cg();
    for (let j of O) K.push(`--plugin-dir ${A5([j])}`);
    let w = UX6();
    K.push(`--teammate-mode ${w}`);
    let $ = eB6();
    if ($ === !0) K.push("--chrome");
    else if ($ === !1) K.push("--no-chrome");
    return K.join(" ")
}
// @from(Ln 346963, Col 0)
function HK8() {
    let q = ["CLAUDECODE=1", "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1"];
    for (let K of g7Y) {
        let _ = process.env[K];
        if (_ !== void 0 && _ !== "") q.push(`${K}=${A5([_])}`)
    }
    return q.join(" ")
}
// @from(Ln 346971, Col 4)
g7Y
// @from(Ln 346972, Col 4)
T77 = L(() => {
    y8();
    QX6();
    g7Y = ["CLAUDE_CODE_USE_BEDROCK", "CLAUDE_CODE_USE_VERTEX", "CLAUDE_CODE_USE_FOUNDRY", "CLAUDE_CODE_USE_ANTHROPIC_AWS", "CLAUDE_CODE_USE_MANTLE", "ANTHROPIC_AWS_WORKSPACE_ID", "ANTHROPIC_AWS_BASE_URL", "ANTHROPIC_AWS_API_KEY", "CLAUDE_CODE_SKIP_ANTHROPIC_AWS_AUTH", "AWS_BEARER_TOKEN_BEDROCK", "ANTHROPIC_BEDROCK_MANTLE_BASE_URL", "CLAUDE_CODE_SKIP_MANTLE_AUTH", "AWS_REGION", "ANTHROPIC_BASE_URL", "CLAUDE_CONFIG_DIR", "CLAUDE_CODE_REMOTE", "CLAUDE_CODE_REMOTE_MEMORY_DIR", "HTTPS_PROXY", "https_proxy", "HTTP_PROXY", "http_proxy", "NO_PROXY", "no_proxy", "SSL_CERT_FILE", "NODE_EXTRA_CA_CERTS", "REQUESTS_CA_BUNDLE", "CURL_CA_BUNDLE"]
})
// @from(Ln 346977, Col 0)
async function V77() {
    return (await v96()).backend
}
// @from(Ln 346980, Col 0)
async function z2K() {
    let {
        isInsideTmux: q
    } = await Promise.resolve().then(() => (yx(), hi1));
    return q()
}
// @from(Ln 346986, Col 0)
async function Y2K(q, K) {
    return (await V77()).createTeammatePaneInSwarmView(q, K)
}
// @from(Ln 346989, Col 0)
async function A2K(q, K = !1) {
    return (await V77()).enablePaneBorderStatus(q, K)
}
// @from(Ln 346992, Col 0)
async function O2K(q, K, _ = !1) {
    return (await V77()).sendCommandToPane(q, K, _)
}
// @from(Ln 346995, Col 4)
w2K = L(() => {
    sx()
})
// @from(Ln 346999, Col 0)
function JK8() {
    return ZO().opus47
}
// @from(Ln 347002, Col 4)
k77 = L(() => {
    jQ()
})
// @from(Ln 347006, Col 0)
function $2K(q) {
    let K = H8().teammateDefaultModel;
    if (K === null) return q ?? JK8();
    if (K !== void 0) return K5(K);
    return JK8()
}
// @from(Ln 347013, Col 0)
function N77(q, K) {
    if (q === "inherit") return K ?? $2K(K);
    return q ?? $2K(K)
}
// @from(Ln 347017, Col 0)
async function U7Y(q) {
    return (await w1(mD, ["has-session", "-t", q])).code === 0
}
// @from(Ln 347020, Col 0)
async function Q7Y(q) {
    if (!await U7Y(q)) {
        let _ = await w1(mD, ["new-session", "-d", "-s", q]);
        if (_.code !== 0) throw Error(`Failed to create tmux session '${q}': ${_.stderr||"Unknown error"}`)
    }
}
// @from(Ln 347027, Col 0)
function J2K() {
    if (process.env[Uh6]) return process.env[Uh6];
    return v$() ? process.execPath : process.argv[1]
}
// @from(Ln 347032, Col 0)
function X2K(q) {
    let K = [],
        {
            planModeRequired: _,
            permissionMode: z
        } = q || {};
    if (_);
    else if (z === "bypassPermissions") K.push("--dangerously-skip-permissions");
    else if (z === "acceptEdits") K.push("--permission-mode acceptEdits");
    else if (z === "auto") K.push("--permission-mode auto");
    let Y = qm();
    if (Y) K.push(`--model ${A5([Y])}`);
    let A = L86();
    if (A) K.push(`--settings ${A5([A])}`);
    let O = cg();
    for (let $ of O) K.push(`--plugin-dir ${A5([$])}`);
    let w = eB6();
    if (w === !0) K.push("--chrome");
    else if (w === !1) K.push("--no-chrome");
    return K.join(" ")
}
// @from(Ln 347053, Col 0)
async function E77(q, K, _, z, Y) {
    let A = await QC6(K, ($) => {
        let j = d7Y(q, $),
            H = op(j, K),
            J = z.assign(H);
        return $.members.push({
            agentId: H,
            name: j,
            color: J,
            joinedAt: Date.now(),
            tmuxPaneId: "",
            subscriptions: [],
            ..._
        }), {
            sanitizedName: j,
            teammateId: H,
            teammateColor: J
        }
    });
    if (!A) throw Error("reserveTeammateIdentity: updateTeamFile returned undefined");
    let O = !1,
        w;
    try {
        return await Y(A, () => {
            O = !0
        }, ($) => {
            w = $
        })
    } catch ($) {
        if (!O) {
            if (w) try {
                await w()
            } catch (j) {
                E(`[spawnTeammate] pane cleanup failed for ${A.teammateId}: ${b6(j)}`)
            }
            await C77(K, A.teammateId)
        } else E(`[spawnTeammate] post-commit failure for ${A.teammateId}; entry kept (agent already running): ${b6($)}`);
        throw $
    }
}
// @from(Ln 347093, Col 0)
async function y77(q, K, _) {
    await QC6(q, (z) => {
        let Y = z.members.find((A) => A.agentId === K);
        if (!Y) return !1;
        Y.tmuxPaneId = _.tmuxPaneId, Y.backendType = _.backendType
    })
}
// @from(Ln 347101, Col 0)
function d7Y(q, K) {
    let _ = S77(q),
        z = new Set(K.members.map((A) => A.name.toLowerCase()));
    if (!z.has(_.toLowerCase())) return _;
    let Y = 2;
    while (z.has(`${_}-${Y}`.toLowerCase())) Y++;
    return `${_}-${Y}`
}
// @from(Ln 347109, Col 0)
async function c7Y(q, K) {
    let {
        setAppState: _,
        getAppState: z
    } = K, {
        name: Y,
        prompt: A,
        agent_type: O,
        cwd: w,
        plan_mode_required: $
    } = q, j = N77(q.model, z().mainLoopModel);
    if (!Y || !A) throw Error("name and prompt are required for spawn operation");
    let H = z(),
        J = q.team_name || H.teamContext?.teamName;
    if (!J) throw Error("team_name is required for spawn operation. Either provide team_name in input or call spawnTeam first to establish team context.");
    let X = w || b8();
    return E77(Y, J, {
        agentType: O,
        model: j,
        prompt: A,
        planModeRequired: $,
        cwd: X
    }, K.teammateColors, async ({
        sanitizedName: M,
        teammateId: P,
        teammateColor: W
    }, D, Z) => {
        let G = await v96();
        if (G.needsIt2Setup && K.setToolJSX) {
            let S = await r56(),
                F = await new Promise((U) => {
                    K.setToolJSX({
                        jsx: H2K.default.createElement(ewK, {
                            onDone: U,
                            tmuxAvailable: S
                        }),
                        shouldHidePromptInput: !0
                    })
                });
            if (K.setToolJSX(null), F === "cancelled") throw Error("Teammate spawn cancelled - iTerm2 setup required");
            if (F === "installed" || F === "use-tmux") R77(), G = await v96()
        }
        let f = await z2K(),
            {
                paneId: v,
                isFirstTeammate: V
            } = await Y2K(M, W);
        if (Z(() => G.backend.killPane(v, !f)), await y77(J, P, {
                tmuxPaneId: v,
                backendType: G.backend.type
            }), V && f) await A2K();
        let k = J2K(),
            N = [`--agent-id ${A5([P])}`, `--agent-name ${A5([M])}`, `--team-name ${A5([J])}`, `--agent-color ${A5([W])}`, `--parent-session-id ${A5([I8()])}`, $ ? "--plan-mode-required" : "", O ? `--agent-type ${A5([O])}` : ""].filter(Boolean).join(" "),
            R = X2K({
                planModeRequired: $,
                permissionMode: H.toolPermissionContext.mode
            });
        if (j) R = R.split(" ").filter((S, F, U) => S !== "--model" && U[F - 1] !== "--model").join(" "), R = R ? `${R} --model ${A5([j])}` : `--model ${A5([j])}`;
        let h = R ? ` ${R}` : "",
            C = HK8(),
            x = `cd ${A5([X])} && env ${C} ${A5([k])} ${N}${h}`;
        await O18(M, J), await F_(M, {
            from: Mz,
            text: A,
            timestamp: new Date().toISOString()
        }, J), await O2K(v, x, !f), D();
        let B = f ? "current" : Ny,
            m = f ? "current" : "swarm-view";
        return _((S) => ({
            ...S,
            teamContext: {
                ...S.teamContext,
                teamName: J ?? S.teamContext?.teamName ?? "default",
                teamFilePath: S.teamContext?.teamFilePath ?? "",
                leadAgentId: S.teamContext?.leadAgentId ?? "",
                teammates: {
                    ...S.teamContext?.teammates || {},
                    [P]: {
                        name: M,
                        agentType: O,
                        color: W,
                        tmuxSessionName: B,
                        tmuxPaneId: v,
                        cwd: X,
                        spawnedAt: Date.now()
                    }
                }
            }
        })), M2K(K.taskRegistry, {
            teammateId: P,
            sanitizedName: M,
            teamName: J,
            teammateColor: W,
            prompt: A,
            plan_mode_required: $,
            paneId: v,
            insideTmux: f,
            backendType: G.backend.type,
            toolUseId: K.toolUseId,
            cwd: X
        }), {
            data: {
                teammate_id: P,
                agent_id: P,
                agent_type: O,
                model: j,
                name: M,
                color: W,
                tmux_session_name: B,
                tmux_window_name: m,
                tmux_pane_id: v,
                team_name: J,
                is_splitpane: !0,
                plan_mode_required: $
            }
        }
    })
}
// @from(Ln 347227, Col 0)
async function l7Y(q, K) {
    let {
        setAppState: _,
        getAppState: z
    } = K, {
        name: Y,
        prompt: A,
        agent_type: O,
        cwd: w,
        plan_mode_required: $
    } = q, j = N77(q.model, z().mainLoopModel);
    if (!Y || !A) throw Error("name and prompt are required for spawn operation");
    let H = z(),
        J = q.team_name || H.teamContext?.teamName;
    if (!J) throw Error("team_name is required for spawn operation. Either provide team_name in input or call spawnTeam first to establish team context.");
    let X = w || b8();
    return E77(Y, J, {
        agentType: O,
        model: j,
        prompt: A,
        planModeRequired: $,
        cwd: X
    }, K.teammateColors, async ({
        sanitizedName: M,
        teammateId: P,
        teammateColor: W
    }, D, Z) => {
        let G = `teammate-${T96(M)}`;
        await Q7Y(Ny);
        let f = await w1(mD, ["new-window", "-t", Ny, "-n", G, "-P", "-F", "#{pane_id}"]);
        if (f.code !== 0) throw Error(`Failed to create tmux window: ${f.stderr}`);
        let v = f.stdout.trim();
        Z(() => w1(mD, ["kill-pane", "-t", v])), await y77(J, P, {
            tmuxPaneId: v,
            backendType: "tmux"
        });
        let V = J2K(),
            k = [`--agent-id ${A5([P])}`, `--agent-name ${A5([M])}`, `--team-name ${A5([J])}`, `--agent-color ${A5([W])}`, `--parent-session-id ${A5([I8()])}`, $ ? "--plan-mode-required" : "", O ? `--agent-type ${A5([O])}` : ""].filter(Boolean).join(" "),
            N = X2K({
                planModeRequired: $,
                permissionMode: H.toolPermissionContext.mode
            });
        if (j) N = N.split(" ").filter((B, m, S) => B !== "--model" && S[m - 1] !== "--model").join(" "), N = N ? `${N} --model ${A5([j])}` : `--model ${A5([j])}`;
        let R = N ? ` ${N}` : "",
            h = HK8(),
            C = `cd ${A5([X])} && env ${h} ${A5([V])} ${k}${R}`;
        await O18(M, J), await F_(M, {
            from: Mz,
            text: A,
            timestamp: new Date().toISOString()
        }, J);
        let x = await w1(mD, ["send-keys", "-t", `${Ny}:${G}`, C, "Enter"]);
        if (x.code !== 0) throw Error(`Failed to send command to tmux window: ${x.stderr}`);
        return D(), _((B) => ({
            ...B,
            teamContext: {
                ...B.teamContext,
                teamName: J ?? B.teamContext?.teamName ?? "default",
                teamFilePath: B.teamContext?.teamFilePath ?? "",
                leadAgentId: B.teamContext?.leadAgentId ?? "",
                teammates: {
                    ...B.teamContext?.teammates || {},
                    [P]: {
                        name: M,
                        agentType: O,
                        color: W,
                        tmuxSessionName: Ny,
                        tmuxPaneId: v,
                        cwd: X,
                        spawnedAt: Date.now()
                    }
                }
            }
        })), M2K(K.taskRegistry, {
            teammateId: P,
            sanitizedName: M,
            teamName: J,
            teammateColor: W,
            prompt: A,
            plan_mode_required: $,
            paneId: v,
            insideTmux: !1,
            backendType: "tmux",
            toolUseId: K.toolUseId,
            cwd: X
        }), {
            data: {
                teammate_id: P,
                agent_id: P,
                agent_type: O,
                model: j,
                name: M,
                color: W,
                tmux_session_name: Ny,
                tmux_window_name: G,
                tmux_pane_id: v,
                team_name: J,
                is_splitpane: !1,
                plan_mode_required: $
            }
        }
    })
}
// @from(Ln 347331, Col 0)
function M2K(q, {
    teammateId: K,
    sanitizedName: _,
    teamName: z,
    teammateColor: Y,
    prompt: A,
    plan_mode_required: O,
    paneId: w,
    insideTmux: $,
    backendType: j,
    toolUseId: H,
    cwd: J
}) {
    let X = cR("in_process_teammate"),
        M = `${_}: ${A.substring(0,50)}${A.length>50?"...":""}`,
        P = new AbortController,
        W = {
            ...cf(X, "in_process_teammate", M, H),
            type: "in_process_teammate",
            status: "running",
            cwd: J,
            identity: {
                agentId: K,
                agentName: _,
                teamName: z,
                color: Y,
                planModeRequired: O ?? !1,
                parentSessionId: I8()
            },
            prompt: A,
            abortController: P,
            awaitingPlanApproval: !1,
            permissionMode: O ? "plan" : "default",
            isIdle: !1,
            shutdownRequested: !1,
            lastReportedToolCount: 0,
            lastReportedTokenCount: 0,
            pendingUserMessages: []
        };
    q.register(W), P.signal.addEventListener("abort", () => {
        if (zJ6(j)) dX6(j).killPane(w, !$)
    }, {
        once: !0
    })
}
// @from(Ln 347376, Col 0)
async function j2K(q, K) {
    let {
        setAppState: _,
        getAppState: z
    } = K, {
        name: Y,
        prompt: A,
        agent_type: O,
        plan_mode_required: w
    } = q, $ = N77(q.model, z().mainLoopModel);
    if (!Y || !A) throw Error("name and prompt are required for spawn operation");
    let j = z(),
        H = q.team_name || j.teamContext?.teamName;
    if (!H) throw Error("team_name is required for spawn operation. Either provide team_name in input or call spawnTeam first to establish team context.");
    return E77(Y, H, {
        agentType: O,
        model: $,
        prompt: A,
        planModeRequired: w,
        cwd: b8()
    }, K.teammateColors, async ({
        sanitizedName: J,
        teammateId: X,
        teammateColor: M
    }, P) => {
        await y77(H, X, {
            tmuxPaneId: "in-process",
            backendType: "in-process"
        });
        let W;
        if (O) {
            let N = K.options.agentDefinitions.activeAgents.find((R) => R.agentType === O);
            if (N && v88(N)) W = N;
            E(`[handleSpawnInProcess] agent_type=${O}, found=${!!W}`)
        }
        let D = {
            name: J,
            teamName: H,
            prompt: A,
            color: M,
            planModeRequired: w ?? !1,
            model: $
        };
        await O18(J, H);
        let Z = await cI8(D, K);
        if (!Z.success) throw Error(Z.error ?? "Failed to spawn in-process teammate");
        if (P(), E(`[handleSpawnInProcess] spawn result: taskId=${Z.taskId}, hasContext=${!!Z.teammateContext}, hasAbort=${!!Z.abortController}`), Z.taskId && Z.teammateContext && Z.abortController) Jg8({
            identity: {
                agentId: X,
                agentName: J,
                teamName: H,
                color: M,
                planModeRequired: w ?? !1,
                parentSessionId: Z.teammateContext.parentSessionId
            },
            taskId: Z.taskId,
            prompt: A,
            description: q.description,
            model: $,
            agentDefinition: W,
            teammateContext: Z.teammateContext,
            toolUseContext: {
                ...K,
                messages: []
            },
            abortController: Z.abortController,
            invokingRequestId: q.invokingRequestId
        }), E(`[handleSpawnInProcess] Started agent execution for ${X}`);
        let G = z().teamContext?.leadAgentId,
            f = !G,
            v = G ?? op(Mz, H),
            V = f ? K.teammateColors.assign(v) : void 0;
        return _((k) => {
            let N = k.teamContext?.teammates || {},
                R = f ? {
                    [v]: {
                        name: Mz,
                        agentType: Mz,
                        color: V,
                        tmuxSessionName: "in-process",
                        tmuxPaneId: "leader",
                        cwd: b8(),
                        spawnedAt: Date.now()
                    }
                } : {};
            return {
                ...k,
                teamContext: {
                    ...k.teamContext,
                    teamName: H ?? k.teamContext?.teamName ?? "default",
                    teamFilePath: k.teamContext?.teamFilePath ?? "",
                    leadAgentId: v,
                    teammates: {
                        ...N,
                        ...R,
                        [X]: {
                            name: J,
                            agentType: O,
                            color: M,
                            tmuxSessionName: "in-process",
                            tmuxPaneId: "in-process",
                            cwd: b8(),
                            spawnedAt: Date.now()
                        }
                    }
                }
            }
        }), {
            data: {
                teammate_id: X,
                agent_id: X,
                agent_type: O,
                model: $,
                name: J,
                color: M,
                tmux_session_name: "in-process",
                tmux_window_name: "in-process",
                tmux_pane_id: "in-process",
                team_name: H,
                is_splitpane: !1,
                plan_mode_required: w
            }
        }
    })
}
// @from(Ln 347501, Col 0)
async function n7Y(q, K) {
    if (bF()) return j2K(q, K);
    try {
        await v96()
    } catch (z) {
        if (UX6() !== "auto") throw z;
        return E(`[handleSpawn] No pane backend available, falling back to in-process: ${b6(z)}`), h77(), j2K(q, K)
    }
    if (q.use_splitpane !== !1) return c7Y(q, K);
    return l7Y(q, K)
}
// @from(Ln 347512, Col 0)
async function P2K(q, K) {
    return n7Y(q, K)
}
// @from(Ln 347515, Col 4)
H2K
// @from(Ln 347516, Col 4)
W2K = L(() => {
    y8();
    $T();
    h1();
    n7();
    K8();
    m8();
    Q4();
    Sq();
    yx();
    sx();
    QX6();
    q2K();
    L77();
    D18();
    T77();
    BD();
    w2K();
    k77();
    ZX();
    cP();
    H2K = K6(P6(), 1)
})
// @from(Ln 347540, Col 0)
function Xg8(q) {
    return typeof q === "string" && q.length > 0 ? tz(q, `
`) + 1 : 0
}
// @from(Ln 347545, Col 0)
function Pg8(q, K) {
    if (typeof K !== "object" || K === null) return {
        added: 0,
        removed: 0
    };
    let _ = K;
    if (q === J4) return {
        added: Xg8(_.new_string),
        removed: Xg8(_.old_string)
    };
    if (q === IK) return {
        added: Xg8(_.content),
        removed: 0
    };
    if (q === HJ) return {
        added: Xg8(_.new_source),
        removed: 0
    };
    return {
        added: 0,
        removed: 0
    }
}
// @from(Ln 347568, Col 4)
Mg8
// @from(Ln 347569, Col 4)
b77 = L(() => {
    u$();
    Mg8 = new Set([J4, IK, HJ])
})
// @from(Ln 347573, Col 4)
dC6 = "LSP"
// @from(Ln 347574, Col 4)
I77 = `Interact with Language Server Protocol (LSP) servers to get code intelligence features.

Supported operations:
- goToDefinition: Find where a symbol is defined
- findReferences: Find all references to a symbol
- hover: Get hover information (documentation, type info) for a symbol
- documentSymbol: Get all symbols (functions, classes, variables) in a document
- workspaceSymbol: Search for symbols across the entire workspace
- goToImplementation: Find implementations of an interface or abstract method
- prepareCallHierarchy: Get call hierarchy item at a position (functions/methods)
- incomingCalls: Find all functions/methods that call the function at a position
- outgoingCalls: Find all functions/methods called by the function at a position

All operations require:
- filePath: The file to operate on
- line: The line number (1-based, as shown in editors)
- character: The character offset (1-based, as shown in editors)

Note: LSP servers must be configured for the file type. If no server is available, an error will be returned.`
// @from(Ln 347593, Col 4)
D2K = "ReadMcpResourceTool"
// @from(Ln 347594, Col 4)
Z2K = `
Reads a specific resource from an MCP server.
- server: The name of the MCP server to read from
- uri: The URI of the resource to read

Usage examples:
- Read a resource from a server: \`readMcpResource({ server: "myserver", uri: "my-resource-uri" })\`
`
// @from(Ln 347602, Col 4)
f2K = `
Reads a specific resource from an MCP server, identified by server name and resource URI.

Parameters:
- server (required): The name of the MCP server from which to read the resource
- uri (required): The URI of the resource to read
`
// @from(Ln 347610, Col 0)
function G2K(q, K) {
    let _ = q.find((z) => z.type === "tool_use" && z.name === K);
    if (!_ || _.type !== "tool_use") return null;
    return _
}
// @from(Ln 347616, Col 0)
function v2K(q, K) {
    let _ = K.safeParse(q.input);
    if (!_.success) return null;
    return _.data
}