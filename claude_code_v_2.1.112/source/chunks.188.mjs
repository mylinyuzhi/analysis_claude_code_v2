
// @from(Ln 486257, Col 0)
async function PW6(q) {
    E("refreshActivePlugins: clearing all plugin caches"), YO(), yPK();
    let K = await sW();
    qWK();
    let [_, z] = await Promise.all([iM6(), FR(Y7())]), {
        enabled: Y,
        disabled: A,
        errors: O
    } = K, [w, $] = await Promise.all([Promise.all(Y.map(async (M) => {
        if (M.mcpServers) return Object.keys(M.mcpServers).length;
        let P = await yl(M, O);
        if (P) M.mcpServers = P;
        return P ? Object.keys(P).length : 0
    })), Promise.all(Y.map(async (M) => {
        if (M.lspServers) return Object.keys(M.lspServers).length;
        let P = await $M6(M, O);
        if (P) M.lspServers = P;
        return P ? Object.keys(P).length : 0
    }))]), j = w.reduce((M, P) => M + P, 0), H = $.reduce((M, P) => M + P, 0);
    q((M) => ({
        ...M,
        plugins: {
            ...M.plugins,
            enabled: Y,
            disabled: A,
            commands: _,
            errors: AiY(M.plugins.errors, O),
            needsRefresh: !1
        },
        agentDefinitions: z,
        mcp: {
            ...M.mcp,
            pluginReconnectKey: M.mcp.pluginReconnectKey + 1
        }
    })), EU8();
    let J = !1;
    try {
        await pc()
    } catch (M) {
        J = !0, j6(M), E(`refreshActivePlugins: loadPluginHooks failed: ${b6(M)}`)
    }
    let X = Y.reduce((M, P) => {
        if (!P.hooksConfig) return M;
        return M + Object.values(P.hooksConfig).reduce((W, D) => W + (D?.reduce((Z, G) => Z + G.hooks.length, 0) ?? 0), 0)
    }, 0);
    return To8.emit(), E(`refreshActivePlugins: ${Y.length} enabled, ${_.length} commands, ${z.allAgents.length} agents, ${X} hooks, ${j} MCP, ${H} LSP`), {
        enabled_count: Y.length,
        disabled_count: A.length,
        command_count: _.length,
        agent_count: z.allAgents.length,
        hook_count: X,
        mcp_count: j,
        lsp_count: H,
        error_count: O.length + (J ? 1 : 0),
        agentDefinitions: z,
        pluginCommands: _
    }
}
// @from(Ln 486316, Col 0)
function AiY(q, K) {
    let _ = q.filter((A) => A.source === "lsp-manager" || A.source.startsWith("plugin:")),
        z = new Set(K.map(coK));
    return [..._.filter((A) => !z.has(coK(A))), ...K]
}
// @from(Ln 486322, Col 0)
function coK(q) {
    return q.type === "generic-error" ? `generic-error:${q.source}:${q.error}` : `${q.type}:${q.source}`
}
// @from(Ln 486325, Col 4)
Vo8 = L(() => {
    y8();
    nl();
    cP();
    K8();
    m8();
    U8();
    $G();
    kj7();
    uR();
    E38();
    HJ6();
    aK8();
    WX6();
    J58();
    vH()
})
// @from(Ln 486342, Col 4)
loK = {}
// @from(Ln 486347, Col 0)
function WW6(q, K) {
    return `${q} ${O7(q,K)}`
}
// @from(Ln 486350, Col 4)
OiY = async (q, K) => {
    let _ = await PW6(K.setAppState),
        Y = `Reloaded: ${[WW6(_.enabled_count,"plugin"),WW6(_.command_count,"skill"),WW6(_.agent_count,"agent"),WW6(_.hook_count,"hook"),WW6(_.mcp_count,"plugin MCP server"),WW6(_.lsp_count,"plugin LSP server")].join(" · ")}`;
    if (_.error_count > 0) Y += `
${WW6(_.error_count,"error")} during load. Run /doctor for details.`;
    return {
        type: "text",
        value: Y
    }
}
// @from(Ln 486360, Col 4)
noK = L(() => {
    y8();
    Vj7();
    Q8();
    Vo8();
    zK6()
})
// @from(Ln 486367, Col 4)
wiY
// @from(Ln 486367, Col 9)
Nj7
// @from(Ln 486368, Col 4)
ioK = L(() => {
    wiY = {
        type: "local",
        name: "reload-plugins",
        description: "Activate pending plugin changes in the current session",
        supportsNonInteractive: !1,
        load: () => Promise.resolve().then(() => (noK(), loK))
    }, Nj7 = wiY
})
// @from(Ln 486377, Col 4)
roK = {}
// @from(Ln 486381, Col 0)
async function $iY(q, K) {
    if (K.openMessageSelector) K.openMessageSelector();
    return {
        type: "skip"
    }
}
// @from(Ln 486387, Col 4)
jiY
// @from(Ln 486387, Col 9)
ooK
// @from(Ln 486388, Col 4)
aoK = L(() => {
    jiY = {
        description: "Restore the code and/or conversation to a previous point",
        name: "rewind",
        aliases: ["checkpoint", "undo"],
        argumentHint: "",
        type: "local",
        supportsNonInteractive: !1,
        load: () => Promise.resolve().then(() => roK)
    }, ooK = jiY
})
// @from(Ln 486419, Col 0)
async function GiY(q, K = 0) {
    let _ = process.memoryUsage(),
        z = fiY(),
        Y = process.resourceUsage(),
        A = process.uptime(),
        O;
    try {
        O = ZiY()
    } catch {}
    let w = process._getActiveHandles().length,
        $ = process._getActiveRequests().length,
        j;
    try {
        j = (await XiY("/proc/self/fd")).length
    } catch {}
    let H;
    try {
        H = await MiY("/proc/self/smaps_rollup", "utf8")
    } catch {}
    let J;
    if (typeof Bun < "u") try {
        let {
            heapStats: D
        } = await import("bun:jsc");
        J = D().objectTypeCounts
    } catch {}
    let X = _.rss - _.heapUsed,
        M = A > 0 ? _.rss / A : 0,
        P = M * 3600 / 1048576,
        W = [];
    if (z.number_of_detached_contexts > 0) W.push(`${z.number_of_detached_contexts} detached context(s) - possible iframe/context leak`);
    if (w > 100) W.push(`${w} active handles - possible timer/socket leak`);
    if (X > _.heapUsed) W.push("Native memory > heap - leak may be in native addons (node-pty, sharp, etc.)");
    if (P > 100) W.push(`High memory growth rate: ${P.toFixed(1)} MB/hour`);
    if (j && j > 500) W.push(`${j} open file descriptors - possible file/socket leak`);
    return {
        timestamp: new Date().toISOString(),
        sessionId: I8(),
        trigger: q,
        dumpNumber: K,
        uptimeSeconds: A,
        memoryUsage: {
            heapUsed: _.heapUsed,
            heapTotal: _.heapTotal,
            external: _.external,
            arrayBuffers: _.arrayBuffers,
            rss: _.rss
        },
        memoryGrowthRate: {
            bytesPerSecond: M,
            mbPerHour: P
        },
        v8HeapStats: {
            heapSizeLimit: z.heap_size_limit,
            mallocedMemory: z.malloced_memory,
            peakMallocedMemory: z.peak_malloced_memory,
            detachedContexts: z.number_of_detached_contexts,
            nativeContexts: z.number_of_native_contexts
        },
        v8HeapSpaces: O?.map((D) => ({
            name: D.space_name,
            size: D.space_size,
            used: D.space_used_size,
            available: D.space_available_size
        })),
        resourceUsage: {
            maxRSS: Y.maxRSS * (y1() === "macos" ? 1 : 1024),
            userCPUTime: Y.userCPUTime,
            systemCPUTime: Y.systemCPUTime
        },
        activeHandles: w,
        activeRequests: $,
        openFileDescriptors: j,
        analysis: {
            potentialLeaks: W,
            recommendation: W.length > 0 ? `WARNING: ${W.length} potential leak indicator(s) found. See potentialLeaks array.` : "No obvious leak indicators. Check heap snapshot for retained objects."
        },
        smapsRollup: H,
        objectTypeCounts: J,
        platform: process.platform,
        nodeVersion: process.version,
        ccVersion: {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.112",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-04-16T18:33:19Z"
        }.VERSION
    }
}
// @from(Ln 486510, Col 0)
async function toK(q = "manual", K = 0) {
    try {
        let _ = I8(),
            z = await GiY(q, K),
            Y = (J) => (J / 1024 / 1024 / 1024).toFixed(3);
        E(`[HeapDump] Memory state:
  heapUsed: ${Y(z.memoryUsage.heapUsed)} GB (in snapshot)
  external: ${Y(z.memoryUsage.external)} GB (NOT in snapshot)
  rss: ${Y(z.memoryUsage.rss)} GB (total process)
  ${z.analysis.recommendation}`);
        let A = am7();
        await V8().mkdir(A);
        let O = K > 0 ? `-dump${K}` : "",
            w = `${_}${O}.heapsnapshot`,
            $ = `${_}${O}-diagnostics.json`,
            j = soK(A, w),
            H = soK(A, $);
        return await PiY(H, I6(z, null, 2), {
            mode: 384
        }), E(`[HeapDump] Diagnostics written to ${H}`), await viY(j), E(`[HeapDump] Heap dump written to ${j}`), d("tengu_heap_dump", {
            triggerManual: q === "manual",
            triggerAuto15GB: q === "auto-1.5GB",
            dumpNumber: K,
            success: !0
        }), {
            success: !0,
            heapPath: j,
            diagPath: H,
            diagnostics: z
        }
    } catch (_) {
        let z = r1(_);
        return j6(z), d("tengu_heap_dump", {
            triggerManual: q === "manual",
            triggerAuto15GB: q === "auto-1.5GB",
            dumpNumber: K,
            success: !1
        }), {
            success: !1,
            error: z.message
        }
    }
}
// @from(Ln 486553, Col 0)
async function viY(q) {
    if (typeof Bun < "u") {
        JiY(q, Bun.generateHeapSnapshot("v8", "arraybuffer"), {
            mode: 384
        }), Bun.gc(!0);
        return
    }
    let K = HiY(q, {
            mode: 384
        }),
        _ = DiY();
    await WiY(_, K)
}
// @from(Ln 486566, Col 4)
eoK = L(() => {
    y8();
    C8();
    K8();
    m8();
    eK();
    Yq();
    U8();
    NK();
    e8()
})
// @from(Ln 486577, Col 4)
qaK = {}
// @from(Ln 486581, Col 0)
async function TiY() {
    let q = await toK();
    if (!q.success || !q.heapPath || !q.diagPath) return {
        type: "text",
        value: `Failed to create heap dump: ${q.error}`
    };
    let K = [q.heapPath, q.diagPath];
    if (q.diagnostics) K.push("", ViY(q.diagnostics));
    return K.push("", "Open the .heapsnapshot in Chrome DevTools → Memory → Load to inspect retainers."), {
        type: "text",
        value: K.join(`
`)
    }
}
// @from(Ln 486596, Col 0)
function ViY(q) {
    let {
        memoryUsage: K,
        resourceUsage: _,
        analysis: z
    } = q, Y = K.external - K.arrayBuffers, A = Math.max(0, K.rss - K.heapTotal - K.external), O = K.heapTotal > K.external + A ? "— most memory is JS heap (inspect the .heapsnapshot)" : "— most memory is native (NOT in the .heapsnapshot)", w = z.potentialLeaks.length ? z.potentialLeaks.map(($) => `  ⚠ ${$}`).join(`
`) : "  (no obvious leak indicators)";
    return [`RSS ${Vu6(K.rss)} (peak ${Vu6(_.maxRSS)}) ${O}`, `  JS heap        ${Vu6(K.heapTotal).padStart(8)}  in snapshot`, `  array buffers  ${Vu6(K.arrayBuffers).padStart(8)}  not in snapshot`, `  other external ${Vu6(Y).padStart(8)}  not in snapshot`, `  unaccounted    ${Vu6(A).padStart(8)}  not in snapshot (code/JIT/stacks/allocator)`, w].join(`
`)
}
// @from(Ln 486607, Col 0)
function Vu6(q) {
    return `${(q/1073741824).toFixed(2)} GB`
}
// @from(Ln 486610, Col 4)
KaK = L(() => {
    eoK()
})
// @from(Ln 486613, Col 4)
kiY
// @from(Ln 486613, Col 9)
_aK
// @from(Ln 486614, Col 4)
zaK = L(() => {
    kiY = {
        type: "local",
        name: "heapdump",
        description: "Dump the JS heap to ~/Desktop",
        isHidden: !0,
        supportsNonInteractive: !0,
        load: () => Promise.resolve().then(() => (KaK(), qaK))
    }, _aK = kiY
})
// @from(Ln 486624, Col 4)
YaK
// @from(Ln 486625, Col 4)
AaK = L(() => {
    YaK = {
        isEnabled: () => !1,
        isHidden: !0,
        name: "stub"
    }
})
// @from(Ln 486633, Col 0)
function ZL(q, K) {
    if (!q || !EiY.test(q)) throw Error(`Invalid ${K}: contains unsafe characters`);
    return q
}
// @from(Ln 486638, Col 0)
function Ej7(q) {
    function K(w) {
        q.onDebug?.(w)
    }
    let _ = 0,
        z = 100;

    function Y(w) {
        let $ = {
                Authorization: `Bearer ${w}`,
                "Content-Type": "application/json",
                "anthropic-version": "2023-06-01",
                "anthropic-beta": NiY,
                "x-environment-runner-version": q.runnerVersion
            },
            j = q.getTrustedDeviceToken?.();
        if (j) $["X-Trusted-Device-Token"] = j;
        return $
    }

    function A() {
        let w = q.getAccessToken();
        if (!w) throw Error(Ou6);
        return w
    }
    async function O(w, $) {
        let j = A(),
            H = await w(j);
        if (H.status !== 401) return H;
        if (!q.onAuth401) return K(`[bridge:api] ${$}: 401 received, no refresh handler`), H;
        if (K(`[bridge:api] ${$}: 401 received, attempting token refresh`), await q.onAuth401(j)) {
            K(`[bridge:api] ${$}: Token refreshed, retrying request`);
            let X = A(),
                M = await w(X);
            if (M.status !== 401) return M;
            K(`[bridge:api] ${$}: Retry after refresh also got 401`)
        } else K(`[bridge:api] ${$}: Token refresh failed`);
        return H
    }
    return {
        async registerBridgeEnvironment(w) {
            K(`[bridge:api] POST /v1/environments/bridge bridgeId=${w.bridgeId}`);
            let $ = await O((j) => Z1.post(`${q.baseUrl}/v1/environments/bridge`, {
                machine_name: w.machineName,
                directory: w.dir,
                branch: w.branch,
                git_repo_url: w.gitRepoUrl,
                max_sessions: w.maxSessions,
                metadata: {
                    worker_type: w.workerType
                },
                ...w.reuseEnvironmentId && {
                    environment_id: w.reuseEnvironmentId
                }
            }, {
                headers: Y(j),
                timeout: 15000,
                validateStatus: (H) => H < 500
            }), "Registration");
            return w66($.status, $.data, "Registration"), K(`[bridge:api] POST /v1/environments/bridge -> ${$.status} environment_id=${$.data.environment_id}`), K(`[bridge:api] >>> ${Mx6({machine_name:w.machineName,directory:w.dir,branch:w.branch,git_repo_url:nf6(w.gitRepoUrl),max_sessions:w.maxSessions,metadata:{worker_type:w.workerType}})}`), K(`[bridge:api] <<< ${Mx6($.data)}`), $.data
        },
        async pollForWork(w, $, j, H) {
            ZL(w, "environmentId");
            let J = _;
            _ = 0;
            let X = await Z1.get(`${q.baseUrl}/v1/environments/${w}/work/poll`, {
                headers: Y($),
                params: H !== void 0 ? {
                    reclaim_older_than_ms: H
                } : void 0,
                timeout: 1e4,
                signal: j,
                validateStatus: (M) => M < 500
            });
            if (w66(X.status, X.data, "Poll"), !X.data) {
                if (_ = J + 1, _ === 1 || _ % z === 0) K(`[bridge:api] GET .../work/poll -> ${X.status} (no work, ${_} consecutive empty polls)`);
                return null
            }
            return K(`[bridge:api] GET .../work/poll -> ${X.status} workId=${X.data.id} type=${X.data.data?.type}${X.data.data?.id?` sessionId=${X.data.data.id}`:""}`), K(`[bridge:api] <<< ${Mx6(X.data)}`), X.data
        },
        async acknowledgeWork(w, $, j) {
            ZL(w, "environmentId"), ZL($, "workId"), K(`[bridge:api] POST .../work/${$}/ack`);
            let H = await Z1.post(`${q.baseUrl}/v1/environments/${w}/work/${$}/ack`, {}, {
                headers: Y(j),
                timeout: 1e4,
                validateStatus: (J) => J < 500
            });
            w66(H.status, H.data, "Acknowledge"), K(`[bridge:api] POST .../work/${$}/ack -> ${H.status}`)
        },
        async stopWork(w, $, j) {
            ZL(w, "environmentId"), ZL($, "workId"), K(`[bridge:api] POST .../work/${$}/stop force=${j}`);
            let H = await O((J) => Z1.post(`${q.baseUrl}/v1/environments/${w}/work/${$}/stop`, {
                force: j
            }, {
                headers: Y(J),
                timeout: 1e4,
                validateStatus: (X) => X < 500
            }), "StopWork");
            w66(H.status, H.data, "StopWork"), K(`[bridge:api] POST .../work/${$}/stop -> ${H.status}`)
        },
        async deregisterEnvironment(w) {
            ZL(w, "environmentId"), K(`[bridge:api] DELETE /v1/environments/bridge/${w}`);
            let $ = await O((j) => Z1.delete(`${q.baseUrl}/v1/environments/bridge/${w}`, {
                headers: Y(j),
                timeout: 1e4,
                validateStatus: (H) => H < 500
            }), "Deregister");
            w66($.status, $.data, "Deregister"), K(`[bridge:api] DELETE /v1/environments/bridge/${w} -> ${$.status}`)
        },
        async archiveSession(w) {
            ZL(w, "sessionId"), K(`[bridge:api] POST /v1/sessions/${w}/archive`);
            let $ = await O((j) => Z1.post(`${q.baseUrl}/v1/sessions/${w}/archive`, {}, {
                headers: Y(j),
                timeout: 1e4,
                validateStatus: (H) => H < 500
            }), "ArchiveSession");
            if ($.status === 409) {
                K(`[bridge:api] POST /v1/sessions/${w}/archive -> 409 (already archived)`);
                return
            }
            w66($.status, $.data, "ArchiveSession"), K(`[bridge:api] POST /v1/sessions/${w}/archive -> ${$.status}`)
        },
        async reconnectSession(w, $) {
            ZL(w, "environmentId"), ZL($, "sessionId"), K(`[bridge:api] POST /v1/environments/${w}/bridge/reconnect session_id=${$}`);
            let j = await O((H) => Z1.post(`${q.baseUrl}/v1/environments/${w}/bridge/reconnect`, {
                session_id: $
            }, {
                headers: Y(H),
                timeout: 1e4,
                validateStatus: (J) => J < 500
            }), "ReconnectSession");
            w66(j.status, j.data, "ReconnectSession"), K(`[bridge:api] POST .../bridge/reconnect -> ${j.status}`)
        },
        async heartbeatWork(w, $, j) {
            ZL(w, "environmentId"), ZL($, "workId"), K(`[bridge:api] POST .../work/${$}/heartbeat`);
            let H = await Z1.post(`${q.baseUrl}/v1/environments/${w}/work/${$}/heartbeat`, {}, {
                headers: Y(j),
                timeout: 1e4,
                validateStatus: (J) => J < 500
            });
            return w66(H.status, H.data, "Heartbeat"), K(`[bridge:api] POST .../work/${$}/heartbeat -> ${H.status} lease_extended=${H.data.lease_extended} state=${H.data.state}`), H.data
        },
        async sendPermissionResponseEvent(w, $, j) {
            ZL(w, "sessionId"), K(`[bridge:api] POST /v1/sessions/${w}/events type=${$.type}`);
            let H = await Z1.post(`${q.baseUrl}/v1/sessions/${w}/events`, {
                events: [$]
            }, {
                headers: Y(j),
                timeout: 1e4,
                validateStatus: (J) => J < 500
            });
            w66(H.status, H.data, "SendPermissionResponseEvent"), K(`[bridge:api] POST /v1/sessions/${w}/events -> ${H.status}`), K(`[bridge:api] >>> ${Mx6({events:[$]})}`), K(`[bridge:api] <<< ${Mx6(H.data)}`)
        }
    }
}
// @from(Ln 486794, Col 0)
function w66(q, K, _) {
    if (q === 200 || q === 204) return;
    let z = Du(K),
        Y = yiY(K);
    switch (q) {
        case 401:
            throw new Cu(`${_}: Authentication failed (401)${z?`: ${z}`:""}. ${Ou6}`, 401, Y);
        case 403:
            throw new Cu(ko8(Y) ? "Remote Control session has expired. Please restart with `claude remote-control` or /remote-control." : `${_}: Access denied (403)${z?`: ${z}`:""}. Check your organization permissions.`, 403, Y);
        case 404:
            throw new Cu(z ?? `${_}: Not found (404). Remote Control may not be available for this organization.`, 404, Y);
        case 410:
            throw new Cu(z ?? "Remote Control session has expired. Please restart with `claude remote-control` or /remote-control.", 410, Y ?? "environment_expired");
        case 429:
            throw Error(`${_}: Rate limited (429). Polling too frequently.`);
        default:
            throw Error(`${_}: Failed with status ${q}${z?`: ${z}`:""}`)
    }
}
// @from(Ln 486814, Col 0)
function ko8(q) {
    if (!q) return !1;
    return q.includes("expired") || q.includes("lifetime")
}
// @from(Ln 486819, Col 0)
function yj7(q) {
    if (q.status !== 403) return !1;
    return q.message.includes("external_poll_sessions") || q.message.includes("environments:manage")
}
// @from(Ln 486824, Col 0)
function yiY(q) {
    if (q && typeof q === "object") {
        if ("error" in q && q.error && typeof q.error === "object" && "type" in q.error && typeof q.error.type === "string") return q.error.type
    }
    return
}
// @from(Ln 486830, Col 4)
NiY = "environments-2025-11-01"
// @from(Ln 486831, Col 4)
EiY
// @from(Ln 486831, Col 9)
Cu
// @from(Ln 486832, Col 4)
Lj7 = L(() => {
    CK();
    pK();
    Qe();
    EiY = /^[a-zA-Z0-9_-]+$/;
    Cu = class Cu extends Error {
        status;
        errorType;
        constructor(q, K, _) {
            super(q);
            this.name = "BridgeFatalError", this.status = K, this.errorType = _
        }
    }
})
// @from(Ln 486847, Col 0)
function OaK() {
    return LiY
}
// @from(Ln 486850, Col 4)
LiY = null
// @from(Ln 486851, Col 4)
waK = L(() => {
    K8();
    Lj7()
})
// @from(Ln 486855, Col 4)
hj7 = `/bridge-kick <subcommand>
  close <code>              fire ws_closed with the given code (e.g. 1002)
  poll <status> [type]      next poll throws BridgeFatalError(status, type)
  poll transient            next poll throws axios-style rejection (5xx/net)
  register fail [N]         next N registers transient-fail (default 1)
  register fatal            next register 403s (terminal)
  reconnect-session fail    next POST /bridge/reconnect fails
  heartbeat <status>        next heartbeat throws BridgeFatalError(status)
  reconnect                 call reconnectEnvironmentWithSession directly
  status                    print bridge state`
// @from(Ln 486865, Col 4)
hiY = async (q) => {
        let K = OaK();
        if (!K) return {
            type: "text",
            value: "No bridge debug handle registered. Remote Control must be connected (USER_TYPE=ant)."
        };
        let [_, z, Y] = q.trim().split(/\s+/);
        switch (_) {
            case "close": {
                let A = Number(z);
                if (!Number.isFinite(A)) return {
                    type: "text",
                    value: `close: need a numeric code
${hj7}`
                };
                return K.fireClose(A), {
                    type: "text",
                    value: `Fired transport close(${A}). Watch debug.log for [bridge:repl] recovery.`
                }
            }
            case "poll": {
                if (z === "transient") return K.injectFault({
                    method: "pollForWork",
                    kind: "transient",
                    status: 503,
                    count: 1
                }), K.wakePollLoop(), {
                    type: "text",
                    value: "Next poll will throw a transient (axios rejection). Poll loop woken."
                };
                let A = Number(z);
                if (!Number.isFinite(A)) return {
                    type: "text",
                    value: `poll: need 'transient' or a status code
${hj7}`
                };
                let O = Y ?? (A === 404 ? "not_found_error" : "authentication_error");
                return K.injectFault({
                    method: "pollForWork",
                    kind: "fatal",
                    status: A,
                    errorType: O,
                    count: 1
                }), K.wakePollLoop(), {
                    type: "text",
                    value: `Next poll will throw BridgeFatalError(${A}, ${O}). Poll loop woken.`
                }
            }
            case "register": {
                if (z === "fatal") return K.injectFault({
                    method: "registerBridgeEnvironment",
                    kind: "fatal",
                    status: 403,
                    errorType: "permission_error",
                    count: 1
                }), {
                    type: "text",
                    value: "Next registerBridgeEnvironment will 403. Trigger with close/reconnect."
                };
                let A = Number(Y) || 1;
                return K.injectFault({
                    method: "registerBridgeEnvironment",
                    kind: "transient",
                    status: 503,
                    count: A
                }), {
                    type: "text",
                    value: `Next ${A} registerBridgeEnvironment call(s) will transient-fail. Trigger with close/reconnect.`
                }
            }
            case "reconnect-session":
                return K.injectFault({
                    method: "reconnectSession",
                    kind: "fatal",
                    status: 404,
                    errorType: "not_found_error",
                    count: 2
                }), {
                    type: "text",
                    value: "Next 2 POST /bridge/reconnect calls will 404. doReconnect Strategy 1 falls through to Strategy 2."
                };
            case "heartbeat": {
                let A = Number(z) || 401;
                return K.injectFault({
                    method: "heartbeatWork",
                    kind: "fatal",
                    status: A,
                    errorType: A === 401 ? "authentication_error" : "not_found_error",
                    count: 1
                }), {
                    type: "text",
                    value: `Next heartbeat will ${A}. Watch for onHeartbeatFatal → work-state teardown.`
                }
            }
            case "reconnect":
                return K.forceReconnect(), {
                    type: "text",
                    value: "Called reconnectEnvironmentWithSession(). Watch debug.log."
                };
            case "status":
                return {
                    type: "text", value: K.describe()
                };
            default:
                return {
                    type: "text", value: hj7
                }
        }
    }
// @from(Ln 486973, Col 7)
RiY
// @from(Ln 486973, Col 12)
$aK
// @from(Ln 486974, Col 4)
jaK = L(() => {
    waK();
    RiY = {
        type: "local",
        name: "bridge-kick",
        description: "Inject bridge failure states for manual recovery testing",
        isEnabled: () => !1,
        supportsNonInteractive: !1,
        load: () => Promise.resolve({
            call: hiY
        })
    }, $aK = RiY
})
// @from(Ln 486987, Col 4)
SiY = async () => {
    return {
        type: "text",
        value: {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.112",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-04-16T18:33:19Z"
        }.BUILD_TIME ? `${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.VERSION} (built ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.BUILD_TIME})` : {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.112",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-04-16T18:33:19Z"
        }.VERSION
    }
}
// @from(Ln 487006, Col 3)
CiY
// @from(Ln 487006, Col 8)
Rj7
// @from(Ln 487007, Col 4)
HaK = L(() => {
    CiY = {
        type: "local",
        name: "version",
        description: "Print the version this session is running (not what autoupdate downloaded)",
        isEnabled: () => !1,
        supportsNonInteractive: !0,
        load: () => Promise.resolve({
            call: SiY
        })
    }, Rj7 = CiY
})
// @from(Ln 487019, Col 4)
No8
// @from(Ln 487020, Col 4)
JaK = L(() => {
    No8 = {
        isEnabled: () => !1,
        isHidden: !0,
        name: "stub"
    }
})
// @from(Ln 487027, Col 4)
XaK
// @from(Ln 487027, Col 9)
MaK
// @from(Ln 487027, Col 14)
Sj7
// @from(Ln 487028, Col 4)
PaK = L(() => {
    XaK = {
        isEnabled: () => !1,
        isHidden: !0,
        name: "stub"
    }, MaK = XaK, Sj7 = XaK
})
// @from(Ln 487035, Col 4)
WaK
// @from(Ln 487036, Col 4)
DaK = L(() => {
    WaK = {
        isEnabled: () => !1,
        isHidden: !0,
        name: "stub"
    }
})
// @from(Ln 487043, Col 4)
ZaK
// @from(Ln 487044, Col 4)
faK = L(() => {
    ZaK = {
        isEnabled: () => !1,
        isHidden: !0,
        name: "stub"
    }
})
// @from(Ln 487051, Col 4)
GaK
// @from(Ln 487052, Col 4)
vaK = L(() => {
    GaK = {
        isEnabled: () => !1,
        isHidden: !0,
        name: "stub"
    }
})
// @from(Ln 487060, Col 0)
function TaK() {
    let q = s(3),
        K = Z7.isSandboxingEnabled(),
        _;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) {
        let A = Z7.checkDependencies();
        _ = A.warnings.length > 0 ? U5.createElement(u, {
            marginTop: 1,
            flexDirection: "column"
        }, A.warnings.map(biY)) : null, q[0] = _
    } else _ = q[0];
    let z = _;
    if (!K) {
        let A;
        if (q[1] === Symbol.for("react.memo_cache_sentinel")) A = U5.createElement(u, {
            flexDirection: "column",
            paddingY: 1
        }, U5.createElement(T, {
            color: "subtle"
        }, "Sandbox is not enabled"), z), q[1] = A;
        else A = q[1];
        return A
    }
    let Y;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) {
        let A = Z7.getFsReadConfig(),
            O = Z7.getFsWriteConfig(),
            w = Z7.getNetworkRestrictionConfig(),
            $ = Z7.getAllowUnixSockets(),
            j = Z7.getExcludedCommands(),
            H = Z7.getLinuxGlobPatternWarnings();
        Y = U5.createElement(u, {
            flexDirection: "column",
            paddingY: 1
        }, U5.createElement(u, {
            flexDirection: "column"
        }, U5.createElement(T, {
            bold: !0,
            color: "permission"
        }, "Excluded Commands:"), U5.createElement(T, {
            dimColor: !0
        }, j.length > 0 ? j.join(", ") : "None")), A.denyOnly.length > 0 && U5.createElement(u, {
            marginTop: 1,
            flexDirection: "column"
        }, U5.createElement(T, {
            bold: !0,
            color: "permission"
        }, "Filesystem Read Restrictions:"), U5.createElement(T, {
            dimColor: !0
        }, "Denied: ", A.denyOnly.join(", ")), A.allowWithinDeny && A.allowWithinDeny.length > 0 && U5.createElement(T, {
            dimColor: !0
        }, "Allowed within denied: ", A.allowWithinDeny.join(", "))), O.allowOnly.length > 0 && U5.createElement(u, {
            marginTop: 1,
            flexDirection: "column"
        }, U5.createElement(T, {
            bold: !0,
            color: "permission"
        }, "Filesystem Write Restrictions:"), U5.createElement(T, {
            dimColor: !0
        }, "Allowed: ", O.allowOnly.join(", ")), O.denyWithinAllow.length > 0 && U5.createElement(T, {
            dimColor: !0
        }, "Denied within allowed: ", O.denyWithinAllow.join(", "))), (w.allowedHosts && w.allowedHosts.length > 0 || w.deniedHosts && w.deniedHosts.length > 0) && U5.createElement(u, {
            marginTop: 1,
            flexDirection: "column"
        }, U5.createElement(T, {
            bold: !0,
            color: "permission"
        }, "Network Restrictions", jj6() ? " (Managed)" : "", ":"), w.allowedHosts && w.allowedHosts.length > 0 && U5.createElement(T, {
            dimColor: !0
        }, "Allowed: ", w.allowedHosts.join(", ")), w.deniedHosts && w.deniedHosts.length > 0 && U5.createElement(T, {
            dimColor: !0
        }, "Denied: ", w.deniedHosts.join(", "))), $ && $.length > 0 && U5.createElement(u, {
            marginTop: 1,
            flexDirection: "column"
        }, U5.createElement(T, {
            bold: !0,
            color: "permission"
        }, "Allowed Unix Sockets:"), U5.createElement(T, {
            dimColor: !0
        }, $.join(", "))), H.length > 0 && U5.createElement(u, {
            marginTop: 1,
            flexDirection: "column"
        }, U5.createElement(T, {
            bold: !0,
            color: "warning"
        }, "⚠ Warning: Glob patterns not fully supported on Linux"), U5.createElement(T, {
            dimColor: !0
        }, "The following patterns will be ignored:", " ", H.slice(0, 3).join(", "), H.length > 3 && ` (${H.length-3} more)`)), z), q[2] = Y
    } else Y = q[2];
    return Y
}
// @from(Ln 487152, Col 0)
function biY(q, K) {
    return U5.createElement(T, {
        key: K,
        dimColor: !0
    }, q)
}
// @from(Ln 487158, Col 4)
U5
// @from(Ln 487159, Col 4)
VaK = L(() => {
    o6();
    g6();
    yY();
    U5 = K6(P6(), 1)
})
// @from(Ln 487166, Col 0)
function Cj7(q) {
    let K = s(24),
        {
            depCheck: _
        } = q,
        z;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) z = y1(), K[0] = z;
    else z = K[0];
    let A = z === "macos",
        O;
    if (K[1] !== _.errors) O = _.errors.some(BiY), K[1] = _.errors, K[2] = O;
    else O = K[2];
    let w = O,
        $;
    if (K[3] !== _.errors) $ = _.errors.some(miY), K[3] = _.errors, K[4] = $;
    else $ = K[4];
    let j = $,
        H;
    if (K[5] !== _.errors) H = _.errors.some(uiY), K[5] = _.errors, K[6] = H;
    else H = K[6];
    let J = H,
        X = _.warnings.length > 0,
        M;
    if (K[7] !== j || K[8] !== _.errors || K[9] !== w || K[10] !== X || K[11] !== J) {
        let P = _.errors.filter(xiY),
            W = A ? "brew install ripgrep" : "apt install ripgrep",
            D;
        if (K[13] === Symbol.for("react.memo_cache_sentinel")) D = A && jO.default.createElement(u, {
            flexDirection: "column"
        }, jO.default.createElement(T, null, "seatbelt: ", jO.default.createElement(T, {
            color: "success"
        }, "built-in (macOS)"))), K[13] = D;
        else D = K[13];
        let Z, G;
        if (K[14] !== w) Z = jO.default.createElement(T, null, "ripgrep (rg):", " ", w ? jO.default.createElement(T, {
            color: "error"
        }, "not found") : jO.default.createElement(T, {
            color: "success"
        }, "found")), G = w && jO.default.createElement(T, {
            dimColor: !0
        }, "  ", "· ", W), K[14] = w, K[15] = Z, K[16] = G;
        else Z = K[15], G = K[16];
        let f;
        if (K[17] !== Z || K[18] !== G) f = jO.default.createElement(u, {
            flexDirection: "column"
        }, Z, G), K[17] = Z, K[18] = G, K[19] = f;
        else f = K[19];
        let v;
        if (K[20] !== j || K[21] !== X || K[22] !== J) v = !A && jO.default.createElement(jO.default.Fragment, null, jO.default.createElement(u, {
            flexDirection: "column"
        }, jO.default.createElement(T, null, "bubblewrap (bwrap):", " ", j ? jO.default.createElement(T, {
            color: "error"
        }, "not installed") : jO.default.createElement(T, {
            color: "success"
        }, "installed")), j && jO.default.createElement(T, {
            dimColor: !0
        }, "  ", "· apt install bubblewrap")), jO.default.createElement(u, {
            flexDirection: "column"
        }, jO.default.createElement(T, null, "socat:", " ", J ? jO.default.createElement(T, {
            color: "error"
        }, "not installed") : jO.default.createElement(T, {
            color: "success"
        }, "installed")), J && jO.default.createElement(T, {
            dimColor: !0
        }, "  ", "· apt install socat")), jO.default.createElement(u, {
            flexDirection: "column"
        }, jO.default.createElement(T, null, "seccomp filter:", " ", X ? jO.default.createElement(T, {
            color: "warning"
        }, "not installed") : jO.default.createElement(T, {
            color: "success"
        }, "installed"), X && jO.default.createElement(T, {
            dimColor: !0
        }, " (required to block unix domain sockets)")), X && jO.default.createElement(u, {
            flexDirection: "column"
        }, jO.default.createElement(T, {
            dimColor: !0
        }, "  ", "· npm install -g @anthropic-ai/sandbox-runtime"), jO.default.createElement(T, {
            dimColor: !0
        }, "  ", "· or copy vendor/seccomp/* from sandbox-runtime and set"), jO.default.createElement(T, {
            dimColor: !0
        }, "    ", "sandbox.seccomp.bpfPath and applyPath in settings.json")))), K[20] = j, K[21] = X, K[22] = J, K[23] = v;
        else v = K[23];
        M = jO.default.createElement(u, {
            flexDirection: "column",
            paddingY: 1,
            gap: 1
        }, D, f, v, P.map(IiY)), K[7] = j, K[8] = _.errors, K[9] = w, K[10] = X, K[11] = J, K[12] = M
    } else M = K[12];
    return M
}
// @from(Ln 487257, Col 0)
function IiY(q) {
    return jO.default.createElement(T, {
        key: q,
        color: "error"
    }, q)
}
// @from(Ln 487264, Col 0)
function xiY(q) {
    return !q.includes("ripgrep") && !q.includes("bwrap") && !q.includes("socat")
}
// @from(Ln 487268, Col 0)
function uiY(q) {
    return q.includes("socat")
}
// @from(Ln 487272, Col 0)
function miY(q) {
    return q.includes("bwrap")
}
// @from(Ln 487276, Col 0)
function BiY(q) {
    return q.includes("ripgrep")
}
// @from(Ln 487279, Col 4)
jO
// @from(Ln 487280, Col 4)
kaK = L(() => {
    o6();
    g6();
    NK();
    jO = K6(P6(), 1)
})
// @from(Ln 487287, Col 0)
function NaK(q) {
    let K = s(5),
        {
            onComplete: _
        } = q,
        z = Z7.isSandboxingEnabled(),
        Y = Z7.areSandboxSettingsLockedByPolicy(),
        A = Z7.areUnsandboxedCommandsAllowed();
    if (!z) {
        let w;
        if (K[0] === Symbol.for("react.memo_cache_sentinel")) w = V0.default.createElement(u, {
            flexDirection: "column",
            paddingY: 1
        }, V0.default.createElement(T, {
            color: "subtle"
        }, "Sandbox is not enabled. Enable sandbox to configure override settings.")), K[0] = w;
        else w = K[0];
        return w
    }
    if (Y) {
        let w;
        if (K[1] === Symbol.for("react.memo_cache_sentinel")) w = V0.default.createElement(T, {
            color: "subtle"
        }, "Override settings are managed by a higher-priority configuration and cannot be changed locally."), K[1] = w;
        else w = K[1];
        let $;
        if (K[2] === Symbol.for("react.memo_cache_sentinel")) $ = V0.default.createElement(u, {
            flexDirection: "column",
            paddingY: 1
        }, w, V0.default.createElement(u, {
            marginTop: 1
        }, V0.default.createElement(T, {
            dimColor: !0
        }, "Current setting:", " ", A ? "Allow unsandboxed fallback" : "Strict sandbox mode"))), K[2] = $;
        else $ = K[2];
        return $
    }
    let O;
    if (K[3] !== _) O = V0.default.createElement(piY, {
        onComplete: _,
        currentMode: A ? "open" : "closed"
    }), K[3] = _, K[4] = O;
    else O = K[4];
    return O
}
// @from(Ln 487333, Col 0)
function piY(q) {
    let K = s(25),
        {
            onComplete: _,
            currentMode: z
        } = q,
        [Y] = Zq(),
        {
            headerFocused: A,
            focusHeader: O
        } = uX(),
        w;
    if (K[0] !== Y) w = d7("success", Y)("(current)"), K[0] = Y, K[1] = w;
    else w = K[1];
    let $ = w,
        j = z === "open" ? `Allow unsandboxed fallback ${$}` : "Allow unsandboxed fallback",
        H;
    if (K[2] !== j) H = {
        label: j,
        value: "open"
    }, K[2] = j, K[3] = H;
    else H = K[3];
    let J = z === "closed" ? `Strict sandbox mode ${$}` : "Strict sandbox mode",
        X;
    if (K[4] !== J) X = {
        label: J,
        value: "closed"
    }, K[4] = J, K[5] = X;
    else X = K[5];
    let M;
    if (K[6] !== H || K[7] !== X) M = [H, X], K[6] = H, K[7] = X, K[8] = M;
    else M = K[8];
    let P = M,
        W;
    if (K[9] !== _) W = async function(h) {
        let C = h;
        await Z7.setSandboxSettings({
            allowUnsandboxedCommands: C === "open"
        }), _(C === "open" ? "✓ Unsandboxed fallback allowed - commands can run outside sandbox when necessary" : "✓ Strict sandbox mode - all commands must run in sandbox or be excluded via the `excludedCommands` option")
    }, K[9] = _, K[10] = W;
    else W = K[10];
    let D = W,
        Z;
    if (K[11] === Symbol.for("react.memo_cache_sentinel")) Z = V0.default.createElement(u, {
        marginBottom: 1
    }, V0.default.createElement(T, {
        bold: !0
    }, "Configure Overrides:")), K[11] = Z;
    else Z = K[11];
    let G;
    if (K[12] !== _) G = () => _(void 0, {
        display: "skip"
    }), K[12] = _, K[13] = G;
    else G = K[13];
    let f;
    if (K[14] !== O || K[15] !== D || K[16] !== A || K[17] !== P || K[18] !== G) f = V0.default.createElement(A1, {
        options: P,
        onChange: D,
        onCancel: G,
        onUpFromFirstItem: O,
        isDisabled: A
    }), K[14] = O, K[15] = D, K[16] = A, K[17] = P, K[18] = G, K[19] = f;
    else f = K[19];
    let v;
    if (K[20] === Symbol.for("react.memo_cache_sentinel")) v = V0.default.createElement(T, {
        dimColor: !0
    }, V0.default.createElement(T, {
        bold: !0,
        dimColor: !0
    }, "Allow unsandboxed fallback:"), " ", "When a command fails due to sandbox restrictions, Claude can retry with dangerouslyDisableSandbox to run outside the sandbox (falling back to default permissions)."), K[20] = v;
    else v = K[20];
    let V;
    if (K[21] === Symbol.for("react.memo_cache_sentinel")) V = V0.default.createElement(T, {
        dimColor: !0
    }, V0.default.createElement(T, {
        bold: !0,
        dimColor: !0
    }, "Strict sandbox mode:"), " ", "All bash commands invoked by the model must run in the sandbox unless they are explicitly listed in excludedCommands."), K[21] = V;
    else V = K[21];
    let k;
    if (K[22] === Symbol.for("react.memo_cache_sentinel")) k = V0.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1,
        gap: 1
    }, v, V, V0.default.createElement(T, {
        dimColor: !0
    }, "Learn more:", " ", V0.default.createElement(yq, {
        url: "https://code.claude.com/docs/en/sandboxing#configure-sandboxing"
    }, "code.claude.com/docs/en/sandboxing#configure-sandboxing"))), K[22] = k;
    else k = K[22];
    let N;
    if (K[23] !== f) N = V0.default.createElement(u, {
        flexDirection: "column",
        paddingY: 1
    }, Z, f, k), K[23] = f, K[24] = N;
    else N = K[24];
    return N
}
// @from(Ln 487431, Col 4)
V0
// @from(Ln 487432, Col 4)
EaK = L(() => {
    o6();
    g6();
    yY();
    gK();
    BT();
    V0 = K6(P6(), 1)
})
// @from(Ln 487441, Col 0)
function yaK(q) {
    let K = s(34),
        {
            onComplete: _,
            depCheck: z
        } = q,
        [Y] = Zq(),
        A = Z7.isSandboxingEnabled(),
        O = Z7.isAutoAllowBashIfSandboxedEnabled(),
        w = z.warnings.length > 0,
        $;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) $ = y7(), K[0] = $;
    else $ = K[0];
    let H = $.sandbox?.network?.allowAllUnixSockets,
        J = w && !H,
        M = (() => {
            if (!A) return "disabled";
            if (O) return "auto-allow";
            return "regular"
        })(),
        P;
    if (K[1] !== Y) P = d7("success", Y)("(current)"), K[1] = Y, K[2] = P;
    else P = K[2];
    let W = P,
        D = M === "auto-allow" ? `Sandbox BashTool, with auto-allow ${W}` : "Sandbox BashTool, with auto-allow",
        Z;
    if (K[3] !== D) Z = {
        label: D,
        value: "auto-allow"
    }, K[3] = D, K[4] = Z;
    else Z = K[4];
    let G = M === "regular" ? `Sandbox BashTool, with regular permissions ${W}` : "Sandbox BashTool, with regular permissions",
        f;
    if (K[5] !== G) f = {
        label: G,
        value: "regular"
    }, K[5] = G, K[6] = f;
    else f = K[6];
    let v = M === "disabled" ? `No Sandbox ${W}` : "No Sandbox",
        V;
    if (K[7] !== v) V = {
        label: v,
        value: "disabled"
    }, K[7] = v, K[8] = V;
    else V = K[8];
    let k;
    if (K[9] !== Z || K[10] !== f || K[11] !== V) k = [Z, f, V], K[9] = Z, K[10] = f, K[11] = V, K[12] = k;
    else k = K[12];
    let N = k,
        R;
    if (K[13] !== _) R = async function(e) {
        let i = e;
        q: switch (i) {
            case "auto-allow": {
                await Z7.setSandboxSettings({
                    enabled: !0,
                    autoAllowBashIfSandboxed: !0
                }), _("✓ Sandbox enabled with auto-allow for bash commands");
                break q
            }
            case "regular": {
                await Z7.setSandboxSettings({
                    enabled: !0,
                    autoAllowBashIfSandboxed: !1
                }), _("✓ Sandbox enabled with regular bash permissions");
                break q
            }
            case "disabled":
                await Z7.setSandboxSettings({
                    enabled: !1,
                    autoAllowBashIfSandboxed: !1
                }), _("○ Sandbox disabled")
        }
    }, K[13] = _, K[14] = R;
    else R = K[14];
    let h = R,
        C;
    if (K[15] !== _) C = {
        "confirm:no": () => _(void 0, {
            display: "skip"
        })
    }, K[15] = _, K[16] = C;
    else C = K[16];
    let x;
    if (K[17] === Symbol.for("react.memo_cache_sentinel")) x = {
        context: "Settings"
    }, K[17] = x;
    else x = K[17];
    L7(C, x);
    let B;
    if (K[18] !== h || K[19] !== _ || K[20] !== N || K[21] !== J) B = IH.default.createElement($O, {
        key: "mode",
        title: "Mode"
    }, IH.default.createElement(FiY, {
        showSocketWarning: J,
        options: N,
        onSelect: h,
        onComplete: _
    })), K[18] = h, K[19] = _, K[20] = N, K[21] = J, K[22] = B;
    else B = K[22];
    let m = B,
        S;
    if (K[23] !== _) S = IH.default.createElement($O, {
        key: "overrides",
        title: "Overrides"
    }, IH.default.createElement(NaK, {
        onComplete: _
    })), K[23] = _, K[24] = S;
    else S = K[24];
    let F = S,
        U;
    if (K[25] === Symbol.for("react.memo_cache_sentinel")) U = IH.default.createElement($O, {
        key: "config",
        title: "Config"
    }, IH.default.createElement(TaK, null)), K[25] = U;
    else U = K[25];
    let g = U,
        c = z.errors.length > 0,
        n;
    if (K[26] !== z || K[27] !== c || K[28] !== w || K[29] !== m || K[30] !== F) n = c ? [IH.default.createElement($O, {
        key: "dependencies",
        title: "Dependencies"
    }, IH.default.createElement(Cj7, {
        depCheck: z
    }))] : [m, ...w ? [IH.default.createElement($O, {
        key: "dependencies",
        title: "Dependencies"
    }, IH.default.createElement(Cj7, {
        depCheck: z
    }))] : [], F, g], K[26] = z, K[27] = c, K[28] = w, K[29] = m, K[30] = F, K[31] = n;
    else n = K[31];
    let l = n,
        z6;
    if (K[32] !== l) z6 = IH.default.createElement(A_, {
        color: "permission"
    }, IH.default.createElement(JL, {
        title: "Sandbox:",
        color: "permission",
        defaultTab: "Mode"
    }, l)), K[32] = l, K[33] = z6;
    else z6 = K[33];
    return z6
}
// @from(Ln 487585, Col 0)
function FiY(q) {
    let K = s(16),
        {
            showSocketWarning: _,
            options: z,
            onSelect: Y,
            onComplete: A
        } = q,
        {
            headerFocused: O,
            focusHeader: w
        } = uX(),
        $;
    if (K[0] !== _) $ = _ && IH.default.createElement(u, {
        marginBottom: 1
    }, IH.default.createElement(T, {
        color: "warning"
    }, "Cannot block unix domain sockets (see Dependencies tab)")), K[0] = _, K[1] = $;
    else $ = K[1];
    let j;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) j = IH.default.createElement(u, {
        marginBottom: 1
    }, IH.default.createElement(T, {
        bold: !0
    }, "Configure Mode:")), K[2] = j;
    else j = K[2];
    let H;
    if (K[3] !== A) H = () => A(void 0, {
        display: "skip"
    }), K[3] = A, K[4] = H;
    else H = K[4];
    let J;
    if (K[5] !== w || K[6] !== O || K[7] !== Y || K[8] !== z || K[9] !== H) J = IH.default.createElement(A1, {
        options: z,
        onChange: Y,
        onCancel: H,
        onUpFromFirstItem: w,
        isDisabled: O
    }), K[5] = w, K[6] = O, K[7] = Y, K[8] = z, K[9] = H, K[10] = J;
    else J = K[10];
    let X;
    if (K[11] === Symbol.for("react.memo_cache_sentinel")) X = IH.default.createElement(T, {
        dimColor: !0
    }, IH.default.createElement(T, {
        bold: !0,
        dimColor: !0
    }, "Auto-allow mode:"), " ", "Commands will try to run in the sandbox automatically, and attempts to run outside of the sandbox fallback to regular permissions. Explicit ask/deny rules are always respected."), K[11] = X;
    else X = K[11];
    let M;
    if (K[12] === Symbol.for("react.memo_cache_sentinel")) M = IH.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1,
        gap: 1
    }, X, IH.default.createElement(T, {
        dimColor: !0
    }, "Learn more:", " ", IH.default.createElement(yq, {
        url: "https://code.claude.com/docs/en/sandboxing"
    }, "code.claude.com/docs/en/sandboxing"))), K[12] = M;
    else M = K[12];
    let P;
    if (K[13] !== $ || K[14] !== J) P = IH.default.createElement(u, {
        flexDirection: "column",
        paddingY: 1
    }, $, j, J, M), K[13] = $, K[14] = J, K[15] = P;
    else P = K[15];
    return P
}
// @from(Ln 487652, Col 4)
IH
// @from(Ln 487653, Col 4)
LaK = L(() => {
    o6();
    g6();
    C7();
    yY();
    a1();
    gK();
    DJ();
    BT();
    VaK();
    kaK();
    EaK();
    IH = K6(P6(), 1)
})
// @from(Ln 487667, Col 4)
RaK = {}
// @from(Ln 487674, Col 0)
async function UiY(q, K, _) {
    let Y = y7().theme || "light",
        A = y1();
    if (!Z7.isSupportedPlatform()) {
        let $ = A === "wsl" ? "Error: Sandboxing requires WSL2. WSL1 is not supported." : "Error: Sandboxing is currently only supported on macOS, Linux, and WSL2.",
            j = d7("error", Y)($);
        return q(j), null
    }
    let O = Z7.checkDependencies();
    if (!Z7.isPlatformInEnabledList()) {
        let $ = d7("error", Y)(`Error: Sandboxing is disabled for this platform (${A}) via the enabledPlatforms setting.`);
        return q($), null
    }
    if (Z7.areSandboxSettingsLockedByPolicy()) {
        let $ = d7("error", Y)("Error: Sandbox settings are overridden by a higher-priority configuration and cannot be changed locally.");
        return q($), null
    }
    let w = _?.trim() || "";
    if (!w) return haK.default.createElement(yaK, {
        onComplete: q,
        depCheck: O
    });
    if (w) {
        let j = w.split(" ")[0];
        if (j === "exclude") {
            let H = w.slice(8).trim();
            if (!H) {
                let W = d7("error", Y)('Error: Please provide a command pattern to exclude (e.g., /sandbox exclude "npm run test:*")');
                return q(W), null
            }
            let J = H.replace(/^["']|["']$/g, "");
            Zp1(J);
            let X = Ww("localSettings"),
                M = X ? giY(tu(), X) : ".claude/settings.local.json",
                P = d7("success", Y)(`Added "${J}" to excluded commands in ${M}`);
            return q(P), null
        } else {
            let H = d7("error", Y)(`Error: Unknown subcommand "${j}". Available subcommand: exclude`);
            return q(H), null
        }
    }
    return null
}
// @from(Ln 487717, Col 4)
haK
// @from(Ln 487718, Col 4)
SaK = L(() => {
    y8();
    LaK();
    g6();
    NK();
    yY();
    a1();
    haK = K6(P6(), 1)
})
// @from(Ln 487727, Col 4)
QiY
// @from(Ln 487727, Col 9)
CaK
// @from(Ln 487728, Col 4)
baK = L(() => {
    Qq();
    yY();
    QiY = {
        name: "sandbox",
        get description() {
            let q = Z7.isSandboxingEnabled(),
                K = Z7.isAutoAllowBashIfSandboxedEnabled(),
                _ = Z7.areUnsandboxedCommandsAllowed(),
                z = Z7.areSandboxSettingsLockedByPolicy(),
                Y = Z7.checkDependencies().errors.length === 0,
                A;
            if (!Y) A = e6.warning;
            else A = q ? e6.tick : e6.circle;
            let O = "sandbox disabled";
            if (q) O = K ? "sandbox enabled (auto-allow)" : "sandbox enabled", O += _ ? ", fallback allowed" : "";
            if (z) O += " (managed)";
            return `${A} ${O} (⏎ to configure)`
        },
        argumentHint: 'exclude "command pattern"',
        get isHidden() {
            return !Z7.isSupportedPlatform() || !Z7.isPlatformInEnabledList()
        },
        immediate: !0,
        type: "local-jsx",
        load: () => Promise.resolve().then(() => (SaK(), RaK))
    }, CaK = QiY
})
// @from(Ln 487763, Col 0)
function liY() {
    return [ciY]
}
// @from(Ln 487766, Col 0)
async function niY(q, K) {
    if (q.length === 0) return K?.("[Claude in Chrome] No browser paths to check"), {
        isInstalled: !1,
        browser: null
    };
    let _ = liY();
    for (let {
            browser: z,
            path: Y
        }
        of q) {
        let A = [];
        try {
            A = await IaK(Y, {
                withFileTypes: !0
            })
        } catch (w) {
            if (D5(w)) continue;
            throw w
        }
        let O = A.filter((w) => w.isDirectory()).filter((w) => w.name === "Default" || w.name.startsWith("Profile ")).map((w) => w.name);
        if (O.length > 0) K?.(`[Claude in Chrome] Found ${z} profiles: ${O.join(", ")}`);
        for (let w of O)
            for (let $ of _) {
                let j = diY(Y, w, "Extensions", $);
                try {
                    return await IaK(j), K?.(`[Claude in Chrome] Extension ${$} found in ${z} ${w}`), {
                        isInstalled: !0,
                        browser: z
                    }
                } catch {}
            }
    }
    return K?.("[Claude in Chrome] Extension not found in any browser"), {
        isInstalled: !1,
        browser: null
    }
}
// @from(Ln 487804, Col 0)
async function xaK(q, K) {
    return (await niY(q, K)).isInstalled
}
// @from(Ln 487807, Col 4)
ciY = "fcoeoabgfenejglbffodgkkbkcdhcgfn"
// @from(Ln 487808, Col 4)
uaK = L(() => {
    m8()
})
// @from(Ln 487827, Col 0)
function yo8(q) {
    if (I7() && q !== !0) return !1;
    if (q === !0) return !0;
    if (q === !1) return !1;
    if (S6(process.env.CLAUDE_CODE_ENABLE_CFC)) return !0;
    if (c5(process.env.CLAUDE_CODE_ENABLE_CFC)) return !1;
    let K = H8();
    if (K.claudeInChromeDefaultEnabled !== void 0) return K.claudeInChromeDefaultEnabled;
    return !1
}
// @from(Ln 487838, Col 0)
function ku6() {
    if (Eo8 !== void 0) return Eo8;
    return Eo8 = wV() && eiY() && u8("tengu_chrome_auto_enable", !1), Eo8
}
// @from(Ln 487843, Col 0)
function Ij7() {
    let q = v$(),
        K = ri.map((Y) => `mcp__claude-in-chrome__${Y.name}`),
        _ = {};
    if (C81()) _.CLAUDE_CHROME_PERMISSION_MODE = "skip_all_permission_checks";
    let z = Object.keys(_).length > 0;
    if (q) {
        let Y = `"${process.execPath}" --chrome-native-host`;
        return paK(Y).then((A) => BaK(A)).catch((A) => E(`[Claude in Chrome] Failed to install native host: ${A}`, {
            level: "error"
        })), {
            mcpConfig: {
                [Ex]: {
                    type: "stdio",
                    command: process.execPath,
                    args: ["--claude-in-chrome-mcp"],
                    scope: "dynamic",
                    ...z && {
                        env: _
                    }
                }
            },
            allowedTools: K,
            systemPrompt: qi1()
        }
    } else {
        let Y = oiY(import.meta.url),
            A = $66(Y, ".."),
            O = $66(A, "cli.js");
        return paK(`"${process.execPath}" "${O}" --chrome-native-host`).then(($) => BaK($)).catch(($) => E(`[Claude in Chrome] Failed to install native host: ${$}`, {
            level: "error"
        })), {
            mcpConfig: {
                [Ex]: {
                    type: "stdio",
                    command: process.execPath,
                    args: [`${O}`, "--claude-in-chrome-mcp"],
                    scope: "dynamic",
                    ...z && {
                        env: _
                    }
                }
            },
            allowedTools: K,
            systemPrompt: qi1()
        }
    }
}
// @from(Ln 487892, Col 0)
function siY() {
    if (y1() === "windows") {
        let K = riY(),
            _ = process.env.APPDATA || $66(K, "AppData", "Local");
        return [$66(_, "Claude Code", "ChromeNativeHost")]
    }
    return qC4().map(({
        path: K
    }) => K)
}
// @from(Ln 487902, Col 0)
async function BaK(q) {
    let K = siY();
    if (K.length === 0) throw Error("Claude in Chrome Native Host not supported on this platform");
    let _ = {
            name: bj7,
            description: "Claude Code Browser Extension Native Host",
            path: q,
            type: "stdio",
            allowed_origins: ["chrome-extension://fcoeoabgfenejglbffodgkkbkcdhcgfn/", ...[]]
        },
        z = I6(_, null, 2),
        Y = !1;
    for (let A of K) {
        let O = $66(A, maK);
        if (await gaK(O, "utf-8").catch(() => null) === z) continue;
        try {
            await FaK(A, {
                recursive: !0
            }), await UaK(O, z), E(`[Claude in Chrome] Installed native host manifest at: ${O}`), Y = !0
        } catch ($) {
            E(`[Claude in Chrome] Failed to install manifest at ${O}: ${$}`)
        }
    }
    if (y1() === "windows") {
        let A = $66(K[0], maK);
        tiY(A)
    }
    if (Y) j66().then((A) => {
        if (A) E("[Claude in Chrome] First-time install detected, opening reconnect page in browser"), WI8(aiY).catch(j6);
        else E("[Claude in Chrome] First-time install detected, but extension not installed, skipping reconnect")
    }).catch((A) => E(`[Claude in Chrome] Failed to check extension installation during manifest install: ${A}`, {
        level: "error"
    }))
}
// @from(Ln 487937, Col 0)
function tiY(q) {
    let K = KC4();
    for (let {
            browser: _,
            key: z
        }
        of K) {
        let Y = `${z}\\${bj7}`;
        M7("reg", ["add", Y, "/ve", "/t", "REG_SZ", "/d", q, "/f"]).then((A) => {
            if (A.code === 0) E(`[Claude in Chrome] Registered native host for ${_} in Windows registry: ${Y}`);
            else E(`[Claude in Chrome] Failed to register native host for ${_} in Windows registry: ${A.stderr}`)
        })
    }
}
// @from(Ln 487951, Col 0)
async function paK(q) {
    let K = y1(),
        _ = $66(A7(), "chrome"),
        z = K === "windows" ? $66(_, "chrome-native-host.bat") : $66(_, "chrome-native-host"),
        Y = K === "windows" ? `@echo off
REM Chrome native host wrapper script
REM Generated by Claude Code - do not edit manually
${q}
` : `#!/bin/sh
# Chrome native host wrapper script
# Generated by Claude Code - do not edit manually
exec ${q}
`;
    if (await gaK(z, "utf-8").catch(() => null) === Y) return z;
    if (await FaK(_, {
            recursive: !0
        }), await UaK(z, Y), K !== "windows") await iiY(z, 493);
    return E(`[Claude in Chrome] Created Chrome native host wrapper script: ${z}`), z
}
// @from(Ln 487971, Col 0)
function eiY() {
    return j66().then((K) => {
        if (!K) return;
        if (H8().cachedChromeExtensionInstalled !== K) d8((z) => ({
            ...z,
            cachedChromeExtensionInstalled: K
        }))
    }).catch((K) => E(`[Claude in Chrome] Failed to check extension installation during cache refresh: ${K}`, {
        level: "error"
    })), H8().cachedChromeExtensionInstalled ?? !1
}
// @from(Ln 487982, Col 0)
async function j66() {
    let q = eS4();
    if (q.length === 0) return E(`[Claude in Chrome] Unsupported platform for extension detection: ${y1()}`), !1;
    return xaK(q, E)
}
// @from(Ln 487987, Col 4)
aiY = "https://clau.de/chrome/reconnect"
// @from(Ln 487988, Col 4)
bj7 = "com.anthropic.claude_code_browser_extension"
// @from(Ln 487989, Col 4)
maK
// @from(Ln 487989, Col 9)
Eo8 = void 0
// @from(Ln 487990, Col 4)
DW6 = L(() => {
    jU6();
    y8();
    B1();
    h1();
    K8();
    Q8();
    Q4();
    U8();
    NK();
    e8();
    ip();
    uaK();
    maK = `${bj7}.json`
})
// @from(Ln 488005, Col 4)
QaK = {}
// @from(Ln 488010, Col 0)
function zrY(q) {
    let K = s(41),
        {
            onDone: _,
            isExtensionInstalled: z,
            configEnabled: Y,
            isClaudeAISubscriber: A,
            isWSL: O
        } = q,
        w = M8($rY),
        [$, j] = fz.useState(0),
        [H, J] = fz.useState(Y ?? !1),
        [X, M] = fz.useState(!1),
        [P, W] = fz.useState(z),
        D;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) D = !1, K[0] = D;
    else D = K[0];
    let Z = D,
        G;
    if (K[1] !== w) G = w.find(wrY), K[1] = w, K[2] = G;
    else G = K[2];
    let v = G?.type === "connected",
        V;
    if (K[3] === Symbol.for("react.memo_cache_sentinel")) V = function(l) {
        if (Z) J3(l);
        else WI8(l).catch(j6)
    }, K[3] = V;
    else V = K[3];
    let k = V,
        N;
    if (K[4] !== H) N = function(l) {
        q: switch (l) {
            case "install-extension": {
                j(OrY), M(!0), k(qrY);
                break q
            }
            case "reconnect": {
                j(ArY), j66().then((z6) => {
                    if (W(z6), z6) M(!1)
                }).catch(j6), k(_rY);
                break q
            }
            case "manage-permissions": {
                j(YrY), k(KrY);
                break q
            }
            case "toggle-default": {
                let z6 = !H;
                d8((A6) => ({
                    ...A6,
                    claudeInChromeDefaultEnabled: z6
                })), J(z6)
            }
        }
    }, K[4] = H, K[5] = N;
    else N = K[5];
    let R = N,
        h;
    if (K[6] !== H || K[7] !== P) {
        h = [];
        let n = P ? "" : " (requires extension)";
        if (!P && !Z) {
            let J6;
            if (K[9] === Symbol.for("react.memo_cache_sentinel")) J6 = {
                label: "Install Chrome extension",
                value: "install-extension"
            }, K[9] = J6;
            else J6 = K[9];
            h.push(J6)
        }
        let l;
        if (K[10] === Symbol.for("react.memo_cache_sentinel")) l = fz.default.createElement(T, null, "Manage permissions"), K[10] = l;
        else l = K[10];
        let z6;
        if (K[11] !== n) z6 = {
            label: fz.default.createElement(fz.default.Fragment, null, l, fz.default.createElement(T, {
                dimColor: !0
            }, n)),
            value: "manage-permissions"
        }, K[11] = n, K[12] = z6;
        else z6 = K[12];
        let A6;
        if (K[13] === Symbol.for("react.memo_cache_sentinel")) A6 = fz.default.createElement(T, null, "Reconnect extension"), K[13] = A6;
        else A6 = K[13];
        let e;
        if (K[14] !== n) e = {
            label: fz.default.createElement(fz.default.Fragment, null, A6, fz.default.createElement(T, {
                dimColor: !0
            }, n)),
            value: "reconnect"
        }, K[14] = n, K[15] = e;
        else e = K[15];
        let i = `Enabled by default: ${H?"Yes":"No"}`,
            O6;
        if (K[16] !== i) O6 = {
            label: i,
            value: "toggle-default"
        }, K[16] = i, K[17] = O6;
        else O6 = K[17];
        h.push(z6, e, O6), K[6] = H, K[7] = P, K[8] = h
    } else h = K[8];
    let C = O || !A,
        x;
    if (K[18] !== _) x = () => _(), K[18] = _, K[19] = x;
    else x = K[19];
    let B;
    if (K[20] === Symbol.for("react.memo_cache_sentinel")) B = fz.default.createElement(T, null, "Claude in Chrome works with the Chrome extension to let you control your browser directly from Claude Code. Navigate websites, fill forms, capture screenshots, record GIFs, and debug with console logs and network requests."), K[20] = B;
    else B = K[20];
    let m;
    if (K[21] !== O) m = O && fz.default.createElement(T, {
        color: "error"
    }, "Claude in Chrome is not supported in WSL at this time."), K[21] = O, K[22] = m;
    else m = K[22];
    let S;
    if (K[23] !== A) S = !A && fz.default.createElement(T, {
        color: "error"
    }, "Claude in Chrome requires a claude.ai subscription."), K[23] = A, K[24] = S;
    else S = K[24];
    let F;
    if (K[25] !== R || K[26] !== v || K[27] !== C || K[28] !== P || K[29] !== h || K[30] !== $ || K[31] !== X) F = !C && fz.default.createElement(fz.default.Fragment, null, !Z && fz.default.createElement(u, {
        flexDirection: "column"
    }, fz.default.createElement(T, null, "Status:", " ", v ? fz.default.createElement(T, {
        color: "success"
    }, "Enabled") : fz.default.createElement(T, {
        color: "inactive"
    }, "Disabled")), fz.default.createElement(T, null, "Extension:", " ", P ? fz.default.createElement(T, {
        color: "success"
    }, "Installed") : fz.default.createElement(T, {
        color: "warning"
    }, "Not detected"))), fz.default.createElement(A1, {
        key: $,
        options: h,
        onChange: R,
        hideIndexes: !0
    }), X && fz.default.createElement(T, {
        color: "warning"
    }, "Once installed, select ", '"Reconnect extension"', " to connect."), fz.default.createElement(T, null, fz.default.createElement(T, {
        dimColor: !0
    }, "Usage: "), fz.default.createElement(T, null, "claude --chrome"), fz.default.createElement(T, {
        dimColor: !0
    }, " or "), fz.default.createElement(T, null, "claude --no-chrome")), fz.default.createElement(T, {
        dimColor: !0
    }, "Site-level permissions are inherited from the Chrome extension. Manage permissions in the Chrome extension settings to control which sites Claude can browse, click, and type on.")), K[25] = R, K[26] = v, K[27] = C, K[28] = P, K[29] = h, K[30] = $, K[31] = X, K[32] = F;
    else F = K[32];
    let U;
    if (K[33] === Symbol.for("react.memo_cache_sentinel")) U = fz.default.createElement(T, {
        dimColor: !0
    }, "Learn more: https://code.claude.com/docs/en/chrome"), K[33] = U;
    else U = K[33];
    let g;
    if (K[34] !== m || K[35] !== S || K[36] !== F) g = fz.default.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, B, m, S, F, U), K[34] = m, K[35] = S, K[36] = F, K[37] = g;
    else g = K[37];
    let c;
    if (K[38] !== g || K[39] !== x) c = fz.default.createElement(R1, {
        title: "Claude in Chrome (Beta)",
        onCancel: x,
        color: "chromeYellow"
    }, g), K[38] = g, K[39] = x, K[40] = c;
    else c = K[40];
    return c
}
// @from(Ln 488175, Col 0)
function YrY(q) {
    return q + 1
}
// @from(Ln 488179, Col 0)
function ArY(q) {
    return q + 1
}
// @from(Ln 488183, Col 0)
function OrY(q) {
    return q + 1
}
// @from(Ln 488187, Col 0)
function wrY(q) {
    return q.name === Ex
}
// @from(Ln 488191, Col 0)
function $rY(q) {
    return q.mcp.clients
}
// @from(Ln 488194, Col 4)
fz
// @from(Ln 488194, Col 8)
qrY = "https://claude.ai/chrome"
// @from(Ln 488195, Col 4)
KrY = "https://clau.de/chrome/permissions"
// @from(Ln 488196, Col 4)
_rY = "https://clau.de/chrome/reconnect"
// @from(Ln 488197, Col 4)
jrY = async function(q) {
        let K = await j66().catch((A) => {
                return j6(A), !1
            }),
            _ = H8(),
            z = i7(),
            Y = X7.isWslEnvironment();
        return fz.default.createElement(zrY, {
            onDone: q,
            isExtensionInstalled: K,
            configEnabled: _.claudeInChromeDefaultEnabled,
            isClaudeAISubscriber: z,
            isWSL: Y
        })
    }
// @from(Ln 488212, Col 4)
daK = L(() => {
    o6();
    gK();
    S4();
    g6();
    N7();
    T7();
    Nj();
    ip();
    DW6();
    h1();
    D_();
    Q8();
    U8();
    fz = K6(P6(), 1)
})
// @from(Ln 488228, Col 4)
HrY
// @from(Ln 488228, Col 9)
caK
// @from(Ln 488229, Col 4)
laK = L(() => {
    y8();
    HrY = {
        name: "chrome",
        description: "Claude in Chrome (Beta) settings",
        availability: ["claude-ai"],
        isEnabled: () => !I7(),
        type: "local-jsx",
        load: () => Promise.resolve().then(() => (daK(), QaK))
    }, caK = HrY
})
// @from(Ln 488240, Col 4)
naK = {}
// @from(Ln 488244, Col 0)
async function JrY() {
    if (await J3("https://www.stickermule.com/claudecode")) return {
        type: "text",
        value: "Opening sticker page in browser…"
    };
    else return {
        type: "text",
        value: "Failed to open browser. Visit: https://www.stickermule.com/claudecode"
    }
}
// @from(Ln 488254, Col 4)
iaK = L(() => {
    Nj()
})
// @from(Ln 488257, Col 4)
XrY
// @from(Ln 488257, Col 9)
raK
// @from(Ln 488258, Col 4)
oaK = L(() => {
    XrY = {
        type: "local",
        name: "stickers",
        description: "Order Claude Code stickers",
        supportsNonInteractive: !1,
        load: () => Promise.resolve().then(() => (iaK(), naK))
    }, raK = XrY
})
// @from(Ln 488267, Col 4)
eaK = {}
// @from(Ln 488274, Col 0)
function MrY({
    onDone: q
}) {
    let K = M8((H) => H.mainLoopModel),
        _ = M8((H) => H.mainLoopModelForSession),
        z = M8((H) => H.fastMode),
        Y = R7(),
        [A, O] = saK.useState(null);

    function w() {
        d("tengu_model_command_menu", {
            action: "cancel"
        });
        let H = fL(K);
        q(`Kept model as ${Y8.bold(H)}`, {
            display: "system"
        })
    }

    function $(H, J) {
        if (eu() > 0 && aaK(H) !== aaK(_ ?? K)) {
            O({
                model: H,
                effort: J
            });
            return
        }
        j(H, J)
    }

    function j(H, J) {
        d("tengu_model_command_menu", {
            action: H,
            from_model: K,
            to_model: H
        }), Y((P) => ({
            ...P,
            mainLoopModel: H,
            mainLoopModelForSession: null
        }));
        let X = `Set model to ${Y8.bold(fL(H))}`;
        if (J !== void 0) X += ` with ${Y8.bold(J)} effort`;
        let M = void 0;
        if (q5()) {
            if (zw6(), !zX(H) && z) Y((P) => ({
                ...P,
                fastMode: !1
            })), M = !1;
            else if (zX(H) && AM() && z) X += " · Fast mode ON", M = !0
        }
        if (NP6(H, M === !0, YX())) X += " · Billed as extra usage";
        if (M === !1) X += " · Fast mode OFF";
        q(X)
    }
    if (A) return gJ.createElement(taK, {
        toModel: A.model,
        onConfirm: () => j(A.model, A.effort),
        onCancel: () => O(null)
    });
    return gJ.createElement(kP6, {
        initial: K,
        sessionModel: _,
        onSelect: $,
        onCancel: w,
        isStandaloneCommand: !0,
        showFastModeNotice: q5() && z && zX(K) && AM()
    })
}
// @from(Ln 488343, Col 0)
function PrY({
    args: q,
    onDone: K
}) {
    let _ = M8((A) => A.fastMode),
        z = R7(),
        Y = q === "default" ? null : q;
    return gJ.useEffect(() => {
        async function A() {
            if (Y && !Kq6(Y)) {
                K(`Model '${Y}' is not available. Your organization restricts model selection.`, {
                    display: "system"
                });
                return
            }
            if (Y && DrY(Y)) {
                K("Opus with 1M context is not available for your account. Learn more: https://code.claude.com/docs/en/model-config#extended-context-with-1m", {
                    display: "system"
                });
                return
            }
            if (Y && ZrY(Y)) {
                K("Sonnet 4.6 with 1M context is not available for your account. Learn more: https://code.claude.com/docs/en/model-config#extended-context-with-1m", {
                    display: "system"
                });
                return
            }
            if (!Y) {
                O(null);
                return
            }
            if (WrY(Y)) {
                O(Y);
                return
            }
            try {
                let {
                    valid: w,
                    error: $
                } = await wI6(Y);
                if (w) O(Y);
                else K($ || `Model '${Y}' not found`, {
                    display: "system"
                })
            } catch (w) {
                K(`Failed to validate model: ${b6(w)}`, {
                    display: "system"
                })
            }
        }

        function O(w) {
            z((H) => ({
                ...H,
                mainLoopModel: w,
                mainLoopModelForSession: null
            }));
            let $ = `Set model to ${Y8.bold(fL(w))}`,
                j = void 0;
            if (q5()) {
                if (zw6(), !zX(w) && _) z((H) => ({
                    ...H,
                    fastMode: !1
                })), j = !1;
                else if (zX(w) && _) $ += " · Fast mode ON", j = !0
            }
            if (NP6(w, j === !0, YX())) $ += " · Billed as extra usage";
            if (j === !1) $ += " · Fast mode OFF";
            K($)
        }
        A()
    }, [Y, K, z]), null
}
// @from(Ln 488417, Col 0)
function taK(q) {
    let K = s(24),
        {
            toModel: _,
            onConfirm: z,
            onCancel: Y
        } = q,
        A;
    if (K[0] !== _) A = fL(_), K[0] = _, K[1] = A;
    else A = K[1];
    let O;
    if (K[2] !== A) O = gJ.createElement(T, null, "This conversation is cached for the current model. Switching to", " ", gJ.createElement(T, {
        bold: !0
    }, A), " means the full history gets re-read on your next message."), K[2] = A, K[3] = O;
    else O = K[3];
    let w;
    if (K[4] !== _) w = fL(_), K[4] = _, K[5] = w;
    else w = K[5];
    let $ = `Yes, switch to ${w}`,
        j;
    if (K[6] !== $) j = {
        label: $,
        value: "yes"
    }, K[6] = $, K[7] = j;
    else j = K[7];
    let H;
    if (K[8] === Symbol.for("react.memo_cache_sentinel")) H = {
        label: "No, go back",
        value: "no"
    }, K[8] = H;
    else H = K[8];
    let J;
    if (K[9] !== j) J = [j, H], K[9] = j, K[10] = J;
    else J = K[10];
    let X;
    if (K[11] !== Y || K[12] !== z) X = (D) => D === "yes" ? z() : Y(), K[11] = Y, K[12] = z, K[13] = X;
    else X = K[13];
    let M;
    if (K[14] !== Y || K[15] !== J || K[16] !== X) M = gJ.createElement(A1, {
        options: J,
        onChange: X,
        onCancel: Y
    }), K[14] = Y, K[15] = J, K[16] = X, K[17] = M;
    else M = K[17];
    let P;
    if (K[18] !== O || K[19] !== M) P = gJ.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, O, M), K[18] = O, K[19] = M, K[20] = P;
    else P = K[20];
    let W;
    if (K[21] !== Y || K[22] !== P) W = gJ.createElement(R1, {
        title: "Switch model?",
        subtitle: "Your next response will be slower and use more tokens",
        color: "warning",
        onCancel: Y,
        hideInputGuide: !0
    }, P), K[21] = Y, K[22] = P, K[23] = W;
    else W = K[23];
    return W
}
// @from(Ln 488479, Col 0)
function aaK(q) {
    return K5(q ?? hv())
}
// @from(Ln 488483, Col 0)
function WrY(q) {
    return Yw6.includes(q.toLowerCase().trim())
}
// @from(Ln 488487, Col 0)
function DrY(q) {
    let K = q.toLowerCase();
    return !Ql() && !YX() && K.includes("opus") && K.includes("[1m]")
}
// @from(Ln 488492, Col 0)
function ZrY(q) {
    let K = q.toLowerCase();
    return !rt() && (K.includes("sonnet[1m]") || K.includes("sonnet-4-6[1m]"))
}
// @from(Ln 488497, Col 0)
function frY(q) {
    let {
        onDone: K
    } = q, _ = M8(TrY), z = M8(vrY), Y = M8(GrY), A = fL(_), O = Y !== void 0 ? ` (effort: ${Y})` : "";
    if (z) K(`Current model: ${Y8.bold(fL(z))} (session override from plan mode)
Base model: ${A}${O}`);
    else K(`Current model: ${A}${O}`);
    return null
}
// @from(Ln 488507, Col 0)
function GrY(q) {
    return q.effortValue
}
// @from(Ln 488511, Col 0)
function vrY(q) {
    return q.mainLoopModelForSession
}
// @from(Ln 488515, Col 0)
function TrY(q) {
    return q.mainLoopModel
}
// @from(Ln 488519, Col 0)
function fL(q) {
    let K = Hn6(q ?? hv());
    return q === null ? `${K} (default)` : K
}
// @from(Ln 488523, Col 4)
gJ
// @from(Ln 488523, Col 8)
saK
// @from(Ln 488523, Col 13)
VrY = async (q, K, _) => {
    if (_ = _?.trim() || "", xu7.includes(_)) return d("tengu_model_command_inline_help", {
        args: _
    }), gJ.createElement(frY, {
        onDone: q
    });
    if (Iu7.includes(_)) {
        q("Run /model to open the model selection menu, or /model [modelName] to set the model.", {
            display: "system"
        });
        return
    }
    if (_) return d("tengu_model_command_inline", {
        args: _
    }), gJ.createElement(PrY, {
        args: _,
        onDone: q
    });
    return gJ.createElement(MrY, {
        onDone: q
    })
}
// @from(Ln 488545, Col 4)
xj7 = L(() => {
    o6();
    Y3();
    y8();
    gK();
    S4();
    in8();
    rA();
    g6();
    C8();
    N7();
    m8();
    rn8();
    zf();
    IT6();
    bg8();
    Sq();
    jn6();
    kd8();
    gJ = K6(P6(), 1), saK = K6(P6(), 1)
})
// @from(Ln 488566, Col 4)
zsK = {}
// @from(Ln 488571, Col 0)
function _sK(q, K, _) {
    if (d("tengu_advisor_command", {
            advisor: q
        }), q === "off") return _((w) => w.advisorModel === void 0 ? w : {
        ...w,
        advisorModel: void 0
    }), P7("userSettings", {
        advisorModel: void 0
    }), "Advisor disabled";
    let z = Of(q);
    _((w) => w.advisorModel === z ? w : {
        ...w,
        advisorModel: z
    }), P7("userSettings", {
        advisorModel: z
    });
    let Y = fL(z),
        A = fL(K),
        O = `Advisor set to ${Y}`;
    if (!Nh6(K)) O += `
Note: the current main model (${A}) does not support the advisor. It will activate when you switch to a supported main model.`;
    return O
}
// @from(Ln 488595, Col 0)
function krY(q) {
    let K = s(33),
        {
            onDone: _
        } = q,
        z = M8(yrY),
        Y = s2(),
        A = R7(),
        O;
    if (K[0] !== z) O = z ? LrY(z) : void 0, K[0] = z, K[1] = O;
    else O = K[1];
    let w = O,
        $;
    if (K[2] !== z || K[3] !== w) $ = z && !w ? {
        label: fL(z),
        value: z
    } : void 0, K[2] = z, K[3] = w, K[4] = $;
    else $ = K[4];
    let j = $,
        H;
    if (K[5] !== j) {
        let R;
        if (K[7] === Symbol.for("react.memo_cache_sentinel")) R = {
            label: "No advisor",
            value: "off"
        }, K[7] = R;
        else R = K[7];
        H = [...Eh6.map(ErY), ...j ? [j] : [], R], K[5] = j, K[6] = H
    } else H = K[6];
    let J = H,
        X = j ? j.value : w ?? "off",
        M;
    if (K[8] === Symbol.for("react.memo_cache_sentinel")) M = [], K[8] = M;
    else M = K[8];
    z$.useEffect(NrY, M);
    let P;
    if (K[9] !== _) P = () => _(void 0, {
        display: "skip"
    }), K[9] = _, K[10] = P;
    else P = K[10];
    let W, D;
    if (K[11] === Symbol.for("react.memo_cache_sentinel")) W = z$.createElement(T, null, "When Claude needs stronger judgment — a complex decision, an ambiguous failure, a problem it's circling without progress — it escalates to the advisor model for guidance, then resumes. The advisor runs server-side and uses additional tokens."), D = z$.createElement(T, null, "For certain workloads, pairing Sonnet as the main model with Opus as the advisor gives you near-Opus performance with reduced token usage."), K[11] = W, K[12] = D;
    else W = K[11], D = K[12];
    let Z;
    if (K[13] !== Y) Z = !Nh6(Y) && z$.createElement(T, {
        color: "warning"
    }, "The current main model (", fL(Y), ") does not support the advisor."), K[13] = Y, K[14] = Z;
    else Z = K[14];
    let G;
    if (K[15] !== Y || K[16] !== _ || K[17] !== A) G = (R) => _(_sK(R, Y, A)), K[15] = Y, K[16] = _, K[17] = A, K[18] = G;
    else G = K[18];
    let f;
    if (K[19] !== _) f = () => _(void 0, {
        display: "skip"
    }), K[19] = _, K[20] = f;
    else f = K[20];
    let v;
    if (K[21] !== X || K[22] !== J || K[23] !== f || K[24] !== G) v = z$.createElement(A1, {
        options: J,
        defaultValue: X,
        defaultFocusValue: X,
        onChange: G,
        onCancel: f
    }), K[21] = X, K[22] = J, K[23] = f, K[24] = G, K[25] = v;
    else v = K[25];
    let V;
    if (K[26] === Symbol.for("react.memo_cache_sentinel")) V = qsK !== "" && z$.createElement(T, null, "Learn more: ", qsK), K[26] = V;
    else V = K[26];
    let k;
    if (K[27] !== v || K[28] !== Z) k = z$.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, W, D, Z, v, V), K[27] = v, K[28] = Z, K[29] = k;
    else k = K[29];
    let N;
    if (K[30] !== k || K[31] !== P) N = z$.createElement(R1, {
        title: "Advisor Tool",
        onCancel: P
    }, k), K[30] = k, K[31] = P, K[32] = N;
    else N = K[32];
    return N
}
// @from(Ln 488678, Col 0)
function NrY() {
    d("tengu_advisor_dialog_shown", {})
}
// @from(Ln 488682, Col 0)
function ErY(q) {
    return {
        label: fL(q),
        value: q
    }
}
// @from(Ln 488689, Col 0)
function yrY(q) {
    return q.advisorModel
}
// @from(Ln 488693, Col 0)
function LrY(q) {
    let K = q.toLowerCase();
    return Eh6.find((_) => K.includes(_))
}
// @from(Ln 488698, Col 0)
function KsK({
    choice: q,
    onDone: K
}) {
    let _ = R7(),
        z = s2(),
        Y = z$.useRef(z);
    Y.current = z;
    let A = z$.useRef(!1);
    return z$.useEffect(() => {
        if (A.current) return;
        A.current = !0;
        let O = setTimeout((w, $, j, H) => {
            w(_sK($, j.current, H))
        }, 0, K, q, Y, _);
        return () => clearTimeout(O)
    }, [q, _, K]), null
}
// @from(Ln 488716, Col 4)
z$
// @from(Ln 488716, Col 8)
qsK = ""
// @from(Ln 488717, Col 4)
hrY = async (q, K, _) => {
        let z = _.trim().toLowerCase();
        if (!z) return z$.createElement(krY, {
            onDone: q
        });
        if (z === "off" || z === "unset") return z$.createElement(KsK, {
            choice: "off",
            onDone: q
        });
        let Y = K5(z),
            {
                valid: A,
                error: O
            } = await wI6(Y);
        if (!A || !b88(Y)) return q(O ? `Invalid advisor model: ${O}` : `${z} cannot be used as an advisor. Valid options: ${Eh6.join(", ")}, off`), null;
        return z$.createElement(KsK, {
            choice: z,
            onDone: q
        })
    }
// @from(Ln 488737, Col 4)
YsK = L(() => {
    o6();
    gK();
    S4();
    oy();
    g6();
    C8();
    N7();
    is();
    Sq();
    kd8();
    a1();
    xj7();
    z$ = K6(P6(), 1)
})
// @from(Ln 488752, Col 4)
AsK
// @from(Ln 488753, Col 4)
OsK = L(() => {
    is();
    AsK = {
        type: "local-jsx",
        name: "advisor",
        description: "Configure the Advisor Tool to consult a stronger model for guidance at key moments during a task",
        argumentHint: `[${[...Eh6,"off"].join("|")}]`,
        isEnabled: () => vx(),
        get isHidden() {
            return !vx()
        },
        load: () => Promise.resolve().then(() => (YsK(), zsK))
    }
})
// @from(Ln 488782, Col 0)
function MA(q) {
    let {
        files: K
    } = q, _, z = q.getPromptForCommand;
    if (K && Object.keys(K).length > 0) {
        _ = HsK(q.name);
        let A, O = q.getPromptForCommand;
        z = async (w, $) => {
            A ??= urY(q.name, K);
            let j = await A,
                H = await O(w, $);
            if (j === null) return H;
            return UrY(H, j)
        }
    }
    let Y = {
        type: "prompt",
        name: q.name,
        description: q.description,
        aliases: q.aliases,
        hasUserSpecifiedDescription: !0,
        allowedTools: q.allowedTools ?? [],
        argumentHint: q.argumentHint,
        whenToUse: q.whenToUse,
        model: q.model,
        disableModelInvocation: q.disableModelInvocation ?? !1,
        userInvocable: q.userInvocable ?? !0,
        contentLength: 0,
        source: "bundled",
        loadedFrom: "bundled",
        hooks: q.hooks,
        skillRoot: _,
        context: q.context,
        agent: q.agent,
        isEnabled: q.isEnabled,
        isHidden: !(q.userInvocable ?? !0),
        progressMessage: "running",
        getPromptForCommand: z
    };
    $sK.push(Y)
}
// @from(Ln 488824, Col 0)
function jsK() {
    return [...$sK]
}
// @from(Ln 488828, Col 0)
function HsK(q) {
    return wsK(uj7(), q)
}
// @from(Ln 488831, Col 0)
async function urY(q, K) {
    let _ = HsK(q);
    try {
        return await mrY(_, K), _
    } catch (z) {
        return E(`Failed to extract bundled skill '${q}' to ${_}: ${z instanceof Error?z.message:String(z)}`), null
    }
}
// @from(Ln 488839, Col 0)
async function mrY(q, K) {
    let _ = new Map;
    for (let [z, Y] of Object.entries(K)) {
        let A = grY(q, z),
            O = CrY(A),
            w = [A, Y],
            $ = _.get(O);
        if ($) $.push(w);
        else _.set(O, [w])
    }
    await Promise.all([..._].map(async ([z, Y]) => {
        await RrY(z, {
            recursive: !0,
            mode: 448
        }), await Promise.all(Y.map(([A, O]) => FrY(A, O)))
    }))
}
// @from(Ln 488856, Col 0)
async function FrY(q, K) {
    let _ = await SrY(q, prY, 384);
    try {
        await _.writeFile(K, "utf8")
    } finally {
        await _.close()
    }
}
// @from(Ln 488865, Col 0)
function grY(q, K) {
    let _ = IrY(K);
    if (brY(_) || _.split(xrY).includes("..") || _.split("/").includes("..")) throw Error(`bundled skill file path escapes skill dir: ${K}`);
    return wsK(q, _)
}
// @from(Ln 488871, Col 0)
function UrY(q, K) {
    let _ = `Base directory for this skill: ${K}

`;
    if (q.length > 0 && q[0].type === "text") return [{
        type: "text",
        text: _ + q[0].text
    }, ...q.slice(1)];
    return [{
        type: "text",
        text: _
    }, ...q]
}
// @from(Ln 488884, Col 4)
$sK
// @from(Ln 488884, Col 9)
BrY
// @from(Ln 488884, Col 14)
prY
// @from(Ln 488885, Col 4)
k0 = L(() => {
    K8();
    Sz();
    $sK = [];
    BrY = Lo8.O_NOFOLLOW ?? 0, prY = process.platform === "win32" ? "wx" : Lo8.O_WRONLY | Lo8.O_CREAT | Lo8.O_EXCL | BrY
})
// @from(Ln 488891, Col 4)
JsK
// @from(Ln 488892, Col 4)
XsK = L(() => {
    JsK = {
        isEnabled: () => !1,
        isHidden: !0,
        name: "stub"
    }
})
// @from(Ln 488900, Col 0)
function MsK(q) {
    let K = s(21),
        {
            items: _,
            onExit: z,
            onCancel: Y
        } = q,
        A;
    if (K[0] !== _.length) A = function(G) {
        d("tengu_exit_background_work_prompt", {
            item_count: _.length,
            chose_exit: G
        })
    }, K[0] = _.length, K[1] = A;
    else A = K[1];
    let O = A,
        w;
    if (K[2] !== O || K[3] !== Y || K[4] !== z) w = function(G) {
        if (O(G === "exit"), G === "exit") z();
        else Y()
    }, K[2] = O, K[3] = Y, K[4] = z, K[5] = w;
    else w = K[5];
    let $ = w,
        j;
    if (K[6] !== O || K[7] !== Y) j = function() {
        O(!1), Y()
    }, K[6] = O, K[7] = Y, K[8] = j;
    else j = K[8];
    let H = j,
        J;
    if (K[9] !== _) J = _.map(QrY), K[9] = _, K[10] = J;
    else J = K[10];
    let X;
    if (K[11] !== J) X = ZW6.default.createElement(u, {
        flexDirection: "column",
        gap: 0
    }, J), K[11] = J, K[12] = X;
    else X = K[12];
    let M;
    if (K[13] === Symbol.for("react.memo_cache_sentinel")) M = {
        label: "Exit anyway",
        value: "exit"
    }, K[13] = M;
    else M = K[13];
    let P;
    if (K[14] === Symbol.for("react.memo_cache_sentinel")) P = [M, {
        label: "Stay",
        value: "stay"
    }], K[14] = P;
    else P = K[14];
    let W;
    if (K[15] !== $) W = ZW6.default.createElement(A1, {
        options: P,
        onChange: $
    }), K[15] = $, K[16] = W;
    else W = K[16];
    let D;
    if (K[17] !== H || K[18] !== X || K[19] !== W) D = ZW6.default.createElement(R1, {
        title: "Background work is running",
        subtitle: "The following will stop when you exit:",
        onCancel: H
    }, X, W), K[17] = H, K[18] = X, K[19] = W, K[20] = D;
    else D = K[20];
    return D
}
// @from(Ln 488966, Col 0)
function QrY(q, K) {
    return ZW6.default.createElement(u, {
        key: K,
        flexDirection: "row"
    }, ZW6.default.createElement(T, {
        bold: !0
    }, q.label), q.detail ? ZW6.default.createElement(T, {
        dimColor: !0
    }, " · ", q.detail) : null)
}
// @from(Ln 488976, Col 4)
ZW6
// @from(Ln 488977, Col 4)
PsK = L(() => {
    o6();
    g6();
    C8();
    gK();
    S4();
    ZW6 = K6(P6(), 1)
})
// @from(Ln 488986, Col 0)
function WsK() {
    return g4(), B7(Ub8)
}
// @from(Ln 488990, Col 0)
function drY() {
    WsK().saveWorktreeState(null)
}
// @from(Ln 488994, Col 0)
function qz8(q) {
    process.chdir(q), l$(q), drY(), aO.cache.clear?.()
}
// @from(Ln 488998, Col 0)
function DsK({
    onDone: q,
    onCancel: K
}) {
    let [_, z] = RG.useState("loading"), [Y, A] = RG.useState([]), [O, w] = RG.useState(0), [$, j] = RG.useState(), H = sO(), J = WsK().getCurrentSessionTitle(I8());
    if (RG.useEffect(() => {
            async function k() {
                if (H?.enteredExisting) {
                    await hM6(), qz8(H.originalCwd), j(`Returned to ${H.originalCwd} (worktree at ${H.worktreePath} left in place)`), z("done");
                    return
                }
                let N = [],
                    R = await w1("git", ["status", "--porcelain"]);
                if (R.stdout) N = R.stdout.split(`
`).filter((h) => h.trim() !== ""), A(N);
                if (H) {
                    let {
                        stdout: h
                    } = await w1("git", ["rev-list", "--count", `${H.originalHeadCommit}..HEAD`]), C = parseInt(h.trim()) || 0;
                    if (w(C), N.length === 0 && C === 0 && !J) {
                        z("removing-clean"), OI6().then(() => {
                            d("tengu_worktree_removed", {
                                source: "exit_dialog",
                                commits: 0,
                                changed_files: 0
                            }), qz8(H.originalCwd), j("Worktree removed (no changes)")
                        }).catch((x) => {
                            E(`Failed to clean up worktree: ${x}`, {
                                level: "error"
                            }), j("Worktree cleanup failed, exiting anyway")
                        }).then(() => {
                            z("done")
                        });
                        return
                    } else z("asking")
                }
            }
            k()
        }, [H, J]), RG.useEffect(() => {
            if (_ === "done") q($)
        }, [_, q, $]), !H) return q("No active worktree session found", {
        display: "system"
    }), null;
    if (_ === "loading" || _ === "done") return null;
    async function X(k) {
        if (!H) return;
        let N = Boolean(H.tmuxSessionName);
        if (k === "keep" || k === "keep-with-tmux") {
            if (z("keeping"), d("tengu_worktree_kept", {
                    commits: O,
                    changed_files: Y.length
                }), await hM6(), qz8(H.originalCwd), N) j(`Worktree kept. Your work is saved at ${H.worktreePath} on branch ${H.worktreeBranch}. Reattach to tmux session with: tmux attach -t ${H.tmuxSessionName}`);
            else j(`Worktree kept. Your work is saved at ${H.worktreePath} on branch ${H.worktreeBranch}`);
            z("done")
        } else if (k === "keep-kill-tmux") {
            if (z("keeping"), d("tengu_worktree_kept", {
                    commits: O,
                    changed_files: Y.length
                }), H.tmuxSessionName) await AI6(H.tmuxSessionName);
            await hM6(), qz8(H.originalCwd), j(`Worktree kept at ${H.worktreePath} on branch ${H.worktreeBranch}. Tmux session terminated.`), z("done")
        } else if (k === "remove" || k === "remove-with-tmux") {
            if (z("removing"), d("tengu_worktree_removed", {
                    source: "exit_dialog",
                    commits: O,
                    changed_files: Y.length
                }), H.tmuxSessionName) await AI6(H.tmuxSessionName);
            try {
                await OI6(), qz8(H.originalCwd)
            } catch (h) {
                E(`Failed to clean up worktree: ${h}`, {
                    level: "error"
                }), j("Worktree cleanup failed, exiting anyway"), z("done");
                return
            }
            let R = N ? " Tmux session terminated." : "";
            if (O > 0 && Y.length > 0) j(`Worktree removed. ${O} ${O===1?"commit":"commits"} and uncommitted changes were discarded.${R}`);
            else if (O > 0) j(`Worktree removed. ${O} ${O===1?"commit":"commits"} on ${H.worktreeBranch} ${O===1?"was":"were"} discarded.${R}`);
            else if (Y.length > 0) j(`Worktree removed. Uncommitted changes were discarded.${R}`);
            else j(`Worktree removed.${R}`);
            z("done")
        }
    }
    if (_ === "keeping") return RG.default.createElement(u, {
        flexDirection: "row",
        marginY: 1
    }, RG.default.createElement(Y5, null), RG.default.createElement(T, null, "Keeping worktree…"));
    if (_ === "removing-clean" || _ === "removing") return RG.default.createElement(u, {
        flexDirection: "row",
        marginY: 1
    }, RG.default.createElement(Y5, null), RG.default.createElement(T, null, _ === "removing-clean" ? "Cleaning up worktree (no pending changes)…" : "Removing worktree…"));
    let M = H.worktreeBranch,
        P = Y.length > 0,
        W = O > 0,
        D = "";
    if (P && W) D = `You have ${Y.length} uncommitted ${Y.length===1?"file":"files"} and ${O} ${O===1?"commit":"commits"} on ${M}. All will be lost if you remove.`;
    else if (P) D = `You have ${Y.length} uncommitted ${Y.length===1?"file":"files"}. These will be lost if you remove the worktree.`;
    else if (W) D = `You have ${O} ${O===1?"commit":"commits"} on ${M}. The branch will be deleted if you remove the worktree.`;
    else if (J) D = `This session was named "${J}". Keep the worktree to resume it later, or remove it to clean up.`;
    else D = "You are working in a worktree. Keep it to continue working there, or remove it to clean up.";

    function Z() {
        if (K) {
            K();
            return
        }
        X("keep")
    }
    let G = P || W ? "All changes and commits will be lost." : "Clean up the worktree directory.",
        f = Boolean(H.tmuxSessionName),
        v = f ? [{
            label: "Keep worktree and tmux session",
            value: "keep-with-tmux",
            description: `Stays at ${H.worktreePath}. Reattach with: tmux attach -t ${H.tmuxSessionName}`
        }, {
            label: "Keep worktree, kill tmux session",
            value: "keep-kill-tmux",
            description: `Keeps worktree at ${H.worktreePath}, terminates tmux session.`
        }, {
            label: "Remove worktree and tmux session",
            value: "remove-with-tmux",
            description: G
        }] : [{
            label: "Keep worktree",
            value: "keep",
            description: `Stays at ${H.worktreePath}`
        }, {
            label: "Remove worktree",
            value: "remove",
            description: G
        }];
    return RG.default.createElement(R1, {
        title: "Exiting worktree session",
        subtitle: D,
        onCancel: Z
    }, RG.default.createElement(A1, {
        defaultFocusValue: f ? "keep-with-tmux" : "keep",
        options: v,
        onChange: X
    }))
}
// @from(Ln 489138, Col 4)
RG
// @from(Ln 489139, Col 4)
ZsK = L(() => {
    C8();
    K8();
    y8();
    g6();
    Q4();
    NJ();
    $G();
    tD();
    gK();
    S4();
    Ej();
    RG = K6(P6(), 1)
})
// @from(Ln 489154, Col 0)
function lrY() {
    return LJ(crY) ?? "Goodbye!"
}
// @from(Ln 489158, Col 0)
function ho8(q) {
    let K = s(11),
        {
            showWorktree: _,
            backgroundItems: z,
            onDone: Y,
            onCancel: A
        } = q,
        O;
    if (K[0] !== Y) O = async function(j) {
        Y(j ?? lrY()), await WK(0, "prompt_input_exit")
    }, K[0] = Y, K[1] = O;
    else O = K[1];
    let w = O;
    if (_) {
        let $;
        if (K[2] !== A || K[3] !== w) $ = mj7.default.createElement(DsK, {
            onDone: w,
            onCancel: A
        }), K[2] = A, K[3] = w, K[4] = $;
        else $ = K[4];
        return $
    }
    if (z && z.length > 0) {
        let $;
        if (K[5] !== w) $ = () => void w(), K[5] = w, K[6] = $;
        else $ = K[6];
        let j = A ?? nrY,
            H;
        if (K[7] !== z || K[8] !== $ || K[9] !== j) H = mj7.default.createElement(MsK, {
            items: z,
            onExit: $,
            onCancel: j
        }), K[7] = z, K[8] = $, K[9] = j, K[10] = H;
        else H = K[10];
        return H
    }
    return null
}
// @from(Ln 489198, Col 0)
function nrY() {}
// @from(Ln 489199, Col 4)
mj7
// @from(Ln 489199, Col 9)
crY
// @from(Ln 489200, Col 4)
Bj7 = L(() => {
    o6();
    uc();
    CY();
    PsK();
    ZsK();
    mj7 = K6(P6(), 1), crY = ["Goodbye!", "See ya!", "Bye!", "Catch you later!"]
})
// @from(Ln 489209, Col 0)
function Ro8() {
    let q = [];
    for (let K of nL()) q.push({
        label: "scheduled task",
        detail: `${Np(K.cron)} · ${w5(K.prompt,irY,!0)}`
    });
    return q
}
// @from(Ln 489217, Col 4)
irY = 50
// @from(Ln 489218, Col 4)
pj7 = L(() => {
    y8();
    KU8();
    Uj6();
    U86()
})
// @from(Ln 489224, Col 4)
fsK = {}
// @from(Ln 489229, Col 0)
function orY() {
    return LJ(rrY) ?? "Goodbye!"
}
// @from(Ln 489232, Col 0)
async function arY(q) {
    let K = sO() !== null,
        _ = Ro8();
    if (K || _.length > 0) return Fj7.createElement(ho8, {
        showWorktree: K,
        backgroundItems: _,
        onDone: q,
        onCancel: () => q()
    });
    return q(orY()), await WK(0, "prompt_input_exit"), null
}
// @from(Ln 489243, Col 4)
Fj7
// @from(Ln 489243, Col 9)
rrY
// @from(Ln 489244, Col 4)
GsK = L(() => {
    uc();
    Bj7();
    wf();
    pj7();
    CY();
    tD();
    Fj7 = K6(P6(), 1), rrY = ["Goodbye!", "See ya!", "Bye!", "Catch you later!"]
})
// @from(Ln 489253, Col 4)
vsK = {}
// @from(Ln 489257, Col 0)
async function srY() {
    return await WK(0, "prompt_input_exit"), {
        type: "skip"
    }
}
// @from(Ln 489262, Col 4)
TsK = L(() => {
    wf();
    CY()
})
// @from(Ln 489266, Col 4)
trY
// @from(Ln 489266, Col 9)
VsK
// @from(Ln 489266, Col 14)
Kz8