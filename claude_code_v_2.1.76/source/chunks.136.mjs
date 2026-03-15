
// @from(Ln 336851, Col 0)
function vVY(A) {
    if (!A) return;
    for (let q = A.length - 1; q >= 0; q--) {
        let K = A[q];
        if (K && "uuid" in K && K.uuid) return K.uuid
    }
    return
}
// @from(Ln 336860, Col 0)
function Cn4() {
    wz6.clear(), su8.clear()
}
// @from(Ln 336863, Col 4)
wz6
// @from(Ln 336863, Col 9)
$V1 = 10
// @from(Ln 336864, Col 4)
GVY = 500
// @from(Ln 336865, Col 4)
su8
// @from(Ln 336866, Col 4)
HV1 = E(() => {
    kK();
    k1();
    H1();
    gL();
    F5();
    EZ();
    u_();
    g1();
    A8();
    wz6 = new Map, su8 = new Map
})
// @from(Ln 336878, Col 4)
bn4 = {}
// @from(Ln 336894, Col 0)
function kVY(A) {
    if (A === null) return P$("Session resumed", "suggestion");
    let q = A instanceof yM ? A.formattedMessage : A.message;
    return P$(`Session resumed without branch: ${q}`, "warning")
}
// @from(Ln 336900, Col 0)
function EVY() {
    return p1({
        content: `This session is being continued from another machine. Application state may have changed. The updated working directory is ${AA()}`,
        isMeta: !0
    })
}
// @from(Ln 336906, Col 0)
async function LVY(A, q) {
    let K = jq(A, 75),
        Y = "claude/task";
    try {
        let z = yVY.replace("{description}", A),
            w = (await WX({
                systemPrompt: uq([]),
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
        if (w?.type !== "text") return {
            title: K,
            branchName: "claude/task"
        };
        let O = WK(w.text.trim()),
            $ = C.object({
                title: C.string(),
                branch: C.string()
            }).safeParse(O);
        if ($.success) return {
            title: $.data.title || K,
            branchName: $.data.branch || "claude/task"
        };
        return {
            title: K,
            branchName: "claude/task"
        }
    } catch (z) {
        return _6(Error(`Error generating title and branch: ${z}`)), {
            title: K,
            branchName: "claude/task"
        }
    }
}
// @from(Ln 336963, Col 0)
async function eu8() {
    if (!await Ro({
            ignoreUntracked: !0
        })) throw d("tengu_teleport_error_git_not_clean", {}), new yM("Git working directory is not clean. Please commit or stash your changes before using --teleport.", O1.red(`Error: Git working directory is not clean. Please commit or stash your changes before using --teleport.
`))
}
// @from(Ln 336969, Col 0)
async function RVY(A) {
    let q = A ? ["fetch", "origin", `${A}:${A}`] : ["fetch", "origin"],
        {
            code: K,
            stderr: Y
        } = await z8(hA(), q);
    if (K !== 0)
        if (A && Y.includes("refspec")) {
            k(`Specific branch fetch failed, trying to fetch ref: ${A}`);
            let {
                code: z,
                stderr: _
            } = await z8(hA(), ["fetch", "origin", A]);
            if (z !== 0) _6(Error(`Failed to fetch from remote origin: ${_}`))
        } else _6(Error(`Failed to fetch from remote origin: ${Y}`))
}
// @from(Ln 336985, Col 0)
async function hVY(A) {
    let {
        code: q
    } = await z8(hA(), ["rev-parse", "--abbrev-ref", `${A}@{upstream}`]);
    if (q === 0) {
        k(`Branch '${A}' already has upstream set`);
        return
    }
    let {
        code: K
    } = await z8(hA(), ["rev-parse", "--verify", `origin/${A}`]);
    if (K === 0) {
        k(`Setting upstream for '${A}' to 'origin/${A}'`);
        let {
            code: Y,
            stderr: z
        } = await z8(hA(), ["branch", "--set-upstream-to", `origin/${A}`, A]);
        if (Y !== 0) k(`Failed to set upstream for '${A}': ${z}`);
        else k(`Successfully set upstream for '${A}'`)
    } else k(`Remote branch 'origin/${A}' does not exist, skipping upstream setup`)
}
// @from(Ln 337006, Col 0)
async function SVY(A) {
    let {
        code: q,
        stderr: K
    } = await z8(hA(), ["checkout", A]);
    if (q !== 0) {
        k(`Local checkout failed, trying to checkout from origin: ${K}`);
        let Y = await z8(hA(), ["checkout", "-b", A, "--track", `origin/${A}`]);
        if (q = Y.code, K = Y.stderr, q !== 0) {
            k(`Remote checkout with -b failed, trying without -b: ${K}`);
            let z = await z8(hA(), ["checkout", "--track", `origin/${A}`]);
            q = z.code, K = z.stderr
        }
    }
    if (q !== 0) throw d("tengu_teleport_error_branch_checkout_failed", {}), new yM(`Failed to checkout branch '${A}': ${K}`, O1.red(`Failed to checkout branch '${A}'
`));
    await hVY(A)
}
// @from(Ln 337024, Col 0)
async function jV1() {
    let {
        stdout: A
    } = await z8(hA(), ["branch", "--show-current"]);
    return A.trim()
}
// @from(Ln 337031, Col 0)
function Jl6(A, q) {
    return [...zV1(A), EVY(), kVY(q)]
}
// @from(Ln 337034, Col 0)
async function Ml6(A) {
    try {
        let q = await jV1();
        if (k(`Current branch before teleport: '${q}'`), A) {
            k(`Switching to branch '${A}'...`), await RVY(A), await SVY(A);
            let Y = await jV1();
            k(`Branch after checkout: '${Y}'`)
        } else k("No branch specified, staying on current branch");
        return {
            branchName: await jV1(),
            branchError: null
        }
    } catch (q) {
        let K = await jV1(),
            Y = q instanceof Error ? q : Error(String(q));
        return {
            branchName: K,
            branchError: Y
        }
    }
}
// @from(Ln 337055, Col 0)
async function MV1(A) {
    let q = await uC6(),
        K = q ? `${q.owner}/${q.name}` : null,
        Y = A.session_context.sources.find((H) => H.type === "git_repository");
    if (!Y?.url) return k(K ? "Session has no associated repository, proceeding without validation" : "Session has no repo requirement and not in git directory, proceeding"), {
        status: "no_repo_required"
    };
    let z = BC6(Y.url),
        _ = z ? `${z.owner}/${z.name}` : m46(Y.url);
    if (!_) return {
        status: "no_repo_required"
    };
    if (k(`Session is for repository: ${_}, current repo: ${K??"none"}`), !K) return {
        status: "not_in_repo",
        sessionRepo: _,
        sessionHost: z?.host,
        currentRepo: null
    };
    let w = (H) => H.replace(/:\d+$/, ""),
        O = K.toLowerCase() === _.toLowerCase(),
        $ = !q || !z || w(q.host.toLowerCase()) === w(z.host.toLowerCase());
    if (O && $) return {
        status: "match",
        sessionRepo: _,
        currentRepo: K
    };
    return {
        status: "mismatch",
        sessionRepo: _,
        currentRepo: K,
        sessionHost: z?.host,
        currentHost: q?.host
    }
}
// @from(Ln 337089, Col 0)
async function Oz6(A, q) {
    if (!qD("allow_remote_sessions")) throw Error("Remote sessions are disabled by your organization's policy.");
    k(`Resuming code session ID: ${A}`);
    try {
        let K = sA()?.accessToken;
        if (!K) throw d("tengu_teleport_resume_error", {
            error_type: "no_access_token"
        }), Error("Claude Code web sessions require authentication with a Claude.ai account. API key authentication is not sufficient. Please run /login to authenticate, or check your authentication status with /status.");
        let Y = await mR();
        if (!Y) throw d("tengu_teleport_resume_error", {
            error_type: "no_org_uuid"
        }), Error("Unable to get organization UUID for constructing session URL");
        q?.("validating");
        let z = await jf6(A),
            _ = await MV1(z);
        switch (_.status) {
            case "match":
            case "no_repo_required":
                break;
            case "not_in_repo": {
                d("tengu_teleport_error_repo_not_in_git_dir_sessions_api", {
                    sessionId: A
                });
                let w = _.sessionHost && _.sessionHost.toLowerCase() !== "github.com" ? `${_.sessionHost}/${_.sessionRepo}` : _.sessionRepo;
                throw new yM(`You must run claude --teleport ${A} from a checkout of ${w}.`, O1.red(`You must run claude --teleport ${A} from a checkout of ${O1.bold(w)}.
`))
            }
            case "mismatch": {
                d("tengu_teleport_error_repo_mismatch_sessions_api", {
                    sessionId: A
                });
                let w = _.sessionHost && _.currentHost && _.sessionHost.replace(/:\d+$/, "").toLowerCase() !== _.currentHost.replace(/:\d+$/, "").toLowerCase(),
                    O = w ? `${_.sessionHost}/${_.sessionRepo}` : _.sessionRepo,
                    $ = w ? `${_.currentHost}/${_.currentRepo}` : _.currentRepo;
                throw new yM(`You must run claude --teleport ${A} from a checkout of ${O}.
This repo is ${$}.`, O1.red(`You must run claude --teleport ${A} from a checkout of ${O1.bold(O)}.
This repo is ${O1.bold($)}.
`))
            }
            case "error":
                throw new yM(_.errorMessage || "Failed to validate session repository", O1.red(`Error: ${_.errorMessage||"Failed to validate session repository"}
`));
            default: {
                let w = _.status;
                throw Error(`Unhandled repo validation status: ${w}`)
            }
        }
        return await In4(A, Y, K, q, z)
    } catch (K) {
        if (K instanceof yM) throw K;
        let Y = K instanceof Error ? K : Error(String(K));
        throw _6(Y), d("tengu_teleport_resume_error", {
            error_type: "resume_session_id_catch"
        }), new yM(Y.message, O1.red(`Error: ${Y.message}
`))
    }
}
// @from(Ln 337146, Col 0)
async function CVY(A, q) {
    let K = await ou8();
    if (K.size > 0) d("tengu_teleport_errors_detected", {
        error_types: Array.from(K).join(","),
        errors_ignored: Array.from(q || []).join(",")
    }), await new Promise((Y) => {
        A.render(JV1.default.createElement(Yj, null, JV1.default.createElement(aj, null, JV1.default.createElement(OV1, {
            errorsToIgnore: q,
            onComplete: () => {
                d("tengu_teleport_errors_resolved", {
                    error_types: Array.from(K).join(",")
                }), Y()
            }
        }))))
    })
}
// @from(Ln 337162, Col 0)
async function Am8(A, q, K, Y) {
    return await CVY(A, new Set(["needsGitStash"])), DV1({
        initialMessage: q,
        signal: K,
        branchName: Y
    })
}
// @from(Ln 337169, Col 0)
async function In4(A, q, K, Y, z) {
    let _ = Date.now();
    try {
        k(`[teleport] Starting fetch for session: ${A}`), Y?.("fetching_logs");
        let w = Date.now(),
            O = await Sn4(A, K, q);
        if (O === null) k("[teleport] v2 endpoint returned null, trying session-ingress"), O = await hn4(A, K, q);
        if (k(`[teleport] Session logs fetched in ${Date.now()-w}ms`), O === null) throw Error("Failed to fetch session logs");
        let $ = Date.now(),
            H = O.filter((J) => Wl(J) && !J.isSidechain);
        k(`[teleport] Filtered ${O.length} entries to ${H.length} messages in ${Date.now()-$}ms`), Y?.("fetching_branch");
        let j = z ? mv1(z) : void 0;
        if (j) k(`[teleport] Found branch: ${j}`);
        return k(`[teleport] Total teleportFromSessionsAPI time: ${Date.now()-_}ms`), {
            log: H,
            branch: j
        }
    } catch (w) {
        let O = w instanceof Error ? w : Error(String(w));
        if (X8.isAxiosError(w) && w.response?.status === 404) throw d("tengu_teleport_error_session_not_found_404", {
            sessionId: A
        }), new yM(`${A} not found.`, `${A} not found.
${O1.dim("Run /status in Claude Code to check your account.")}`);
        throw _6(O), Error(`Failed to fetch session from Sessions API: ${O.message}`)
    }
}
// @from(Ln 337195, Col 0)
async function qm8(A) {
    let q = sA()?.accessToken;
    if (!q) throw Error("No access token for polling");
    let K = await mR();
    if (!K) throw Error("No org UUID for polling");
    let Y = zj(q),
        z = `${P7().BASE_API_URL}/v1/sessions/${A}/events`,
        _ = await X8.get(z, {
            headers: {
                ...Y,
                "anthropic-beta": "ccr-byoc-2025-07-29",
                "x-organization-uuid": K
            },
            timeout: 30000
        });
    if (_.status !== 200) throw Error(`Failed to fetch session events: ${_.statusText}`);
    let w = _.data;
    if (!w?.data || !Array.isArray(w.data)) throw Error("Invalid events response");
    let O = [];
    for (let j of w.data)
        if (j && typeof j === "object" && "type" in j) {
            if (j.type === "env_manager_log" || j.type === "control_response") continue;
            if ("session_id" in j) O.push(j)
        } let $, H;
    try {
        let j = await jf6(A);
        $ = mv1(j), H = j.session_status
    } catch {}
    return {
        log: O,
        branch: $,
        sessionStatus: H
    }
}
// @from(Ln 337229, Col 0)
async function DV1(A) {
    let {
        initialMessage: q,
        description: K,
        signal: Y
    } = A;
    try {
        await dz();
        let z = sA()?.accessToken;
        if (!z) return _6(Error("No access token found for remote session creation")), null;
        let _ = await mR();
        if (!_) return _6(Error("Unable to get organization UUID for remote session creation")), null;
        let w = await uC6(),
            O = null,
            $ = null,
            {
                title: H,
                branchName: j
            } = await LVY(K || q || "Background task", Y);
        if (w) {
            let {
                host: h,
                owner: R,
                name: u
            } = w, I = A.branchName ?? await oT() ?? void 0;
            k(`[teleportToRemote] Git source: ${h}/${R}/${u}, revision: ${I??"none"}`), O = {
                type: "git_repository",
                url: `https://${h}/${R}/${u}`,
                revision: I
            }, $ = {
                type: "git_repository",
                git_info: {
                    type: "github",
                    repo: `${R}/${u}`,
                    branches: [j]
                }
            }
        } else k("[teleportToRemote] No repository detected — session will have an empty sandbox");
        let J = await jl6();
        if (!J || J.length === 0) return _6(Error("No environments available for session creation")), null;
        k(`Available environments: ${J.map((h)=>`${h.environment_id} (${h.name}, ${h.kind})`).join(", ")}`);
        let M = PA(),
            D = A.useDefaultEnvironment ? void 0 : M?.remote?.defaultEnvironmentId,
            X = D && J.find((h) => h.environment_id === D) || J.find((h) => h.kind === "anthropic_cloud") || J.find((h) => h.kind !== "bridge") || J[0];
        if (!X) return _6(Error("No environments available for session creation")), null;
        if (D) {
            let h = X.environment_id === D;
            k(h ? `Using configured default environment: ${D}` : `Configured default environment ${D} not found, using first available`)
        }
        let P = X.environment_id;
        k(`Selected environment: ${P} (${X.name}, ${X.kind})`);
        let W = `${P7().BASE_API_URL}/v1/sessions`,
            Z = {
                ...zj(z),
                "anthropic-beta": "ccr-byoc-2025-07-29",
                "x-organization-uuid": _
            },
            G = {
                sources: O ? [O] : [],
                outcomes: $ ? [$] : [],
                model: cK()
            },
            f = q ? [{
                type: "event",
                data: {
                    uuid: VVY(),
                    session_id: "",
                    type: "user",
                    parent_tool_use_id: null,
                    message: {
                        role: "user",
                        content: q
                    }
                }
            }] : [],
            v = {
                title: H,
                events: f,
                session_context: G,
                environment_id: P
            };
        k(`Creating session with payload: ${B6(v,null,2)}`);
        let N = await X8.post(W, v, {
            headers: Z,
            signal: Y
        });
        if (!(N.status === 200 || N.status === 201)) return _6(Error(`API request failed with status ${N.status}: ${N.statusText}

Response data: ${B6(N.data,null,2)}`)), null;
        let L = N.data;
        if (!L || typeof L.id !== "string") return _6(Error(`Cannot determine session ID from API response: ${B6(N.data)}`)), null;
        return k(`Successfully created remote session: ${L.id}`), {
            id: L.id,
            title: L.title || H
        }
    } catch (z) {
        let _ = z instanceof Error ? z : Error(String(z));
        return _6(_), null
    }
}
// @from(Ln 337329, Col 4)
JV1
// @from(Ln 337329, Col 9)
yVY = `You are coming up with a succinct title and git branch name for a coding session based on the provided description. The title should be clear, concise, and accurately reflect the content of the coding task.
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
// @from(Ln 337345, Col 4)
S66 = E(() => {
    Eq();
    $5();
    if6();
    aK();
    s8();
    H1();
    K_();
    K7();
    k1();
    NA();
    au8();
    fA();
    W0();
    kK();
    F5();
    fA();
    yG();
    gw();
    M4();
    z4();
    V1();
    JA();
    T1();
    AN();
    EZ();
    wV1();
    i8();
    HV1();
    Oq();
    g1();
    Mg();
    JV1 = t(P6(), 1)
})
// @from(Ln 337379, Col 4)
xn4 = E(() => {
    ru8();
    yG();
    AN()
})
// @from(Ln 337385, Col 0)
function IVY(A, q) {
    return A?.includes("_staging_") === !0 || q?.includes("staging") === !0
}
// @from(Ln 337389, Col 0)
function PV1(A, q) {
    return A?.includes("_local_") === !0 || q?.includes("localhost") === !0
}
// @from(Ln 337393, Col 0)
function WV1(A, q) {
    if (PV1(A, q)) return "http://localhost:4000";
    if (IVY(A, q)) return "https://claude-ai.staging.ant.dev";
    return "https://claude.ai"
}
// @from(Ln 337399, Col 0)
function hZ(A, q) {
    return `${WV1(A,q)}/code/${A}`
}
// @from(Ln 337402, Col 4)
XV1 = "https://claude.com/claude-code"
// @from(Ln 337407, Col 0)
function BVY(A) {
    if (typeof A !== "object" || A === null || !("type" in A)) return !1;
    return typeof A.type === "string"
}
// @from(Ln 337411, Col 0)
class Dl6 {
    sessionId;
    orgUuid;
    accessToken;
    callbacks;
    ws = null;
    state = "closed";
    reconnectAttempts = 0;
    pingInterval = null;
    reconnectTimer = null;
    constructor(A, q, K, Y) {
        this.sessionId = A;
        this.orgUuid = q;
        this.accessToken = K;
        this.callbacks = Y
    }
    async connect() {
        if (this.state === "connecting") {
            k("[SessionsWebSocket] Already connecting");
            return
        }
        this.state = "connecting";
        let q = `${P7().BASE_API_URL.replace("https://","wss://")}/v1/sessions/ws/${this.sessionId}/subscribe?organization_uuid=${this.orgUuid}`;
        k(`[SessionsWebSocket] Connecting to ${q}`);
        let K = {
            Authorization: `Bearer ${this.accessToken}`,
            "anthropic-version": "2023-06-01"
        };
        if (typeof Bun < "u") {
            let Y = new globalThis.WebSocket(q, {
                headers: K,
                proxy: mQ(q),
                tls: iS() || void 0
            });
            this.ws = Y, Y.addEventListener("open", () => {
                k("[SessionsWebSocket] Connection opened, authenticated via headers"), this.state = "connected", this.reconnectAttempts = 0, this.startPingInterval(), this.callbacks.onConnected?.()
            }), Y.addEventListener("message", (z) => {
                let _ = typeof z.data === "string" ? z.data : String(z.data);
                this.handleMessage(_)
            }), Y.addEventListener("error", () => {
                let z = Error("[SessionsWebSocket] WebSocket error");
                _6(z), this.callbacks.onError?.(z)
            }), Y.addEventListener("close", (z) => {
                k(`[SessionsWebSocket] Closed: code=${z.code} reason=${z.reason}`), this.handleClose(z.code)
            }), Y.addEventListener("pong", () => {
                k("[SessionsWebSocket] Pong received")
            })
        } else {
            let {
                default: Y
            } = await Promise.resolve().then(() => (VO6(), V61)), z = new Y(q, {
                headers: K,
                agent: uQ(q),
                ...iS()
            });
            this.ws = z, z.on("open", () => {
                k("[SessionsWebSocket] Connection opened, authenticated via headers"), this.state = "connected", this.reconnectAttempts = 0, this.startPingInterval(), this.callbacks.onConnected?.()
            }), z.on("message", (_) => {
                this.handleMessage(_.toString())
            }), z.on("error", (_) => {
                _6(Error(`[SessionsWebSocket] Error: ${_.message}`)), this.callbacks.onError?.(_)
            }), z.on("close", (_, w) => {
                k(`[SessionsWebSocket] Closed: code=${_} reason=${w.toString()}`), this.handleClose(_)
            }), z.on("pong", () => {
                k("[SessionsWebSocket] Pong received")
            })
        }
    }
    handleMessage(A) {
        try {
            let q = i1(A);
            if (BVY(q)) this.callbacks.onMessage(q);
            else k(`[SessionsWebSocket] Ignoring message type: ${typeof q==="object"&&q!==null&&"type"in q?String(q.type):"unknown"}`)
        } catch (q) {
            _6(Error(`[SessionsWebSocket] Failed to parse message: ${_1(q)}`))
        }
    }
    handleClose(A) {
        if (this.stopPingInterval(), this.state === "closed") return;
        this.ws = null;
        let q = this.state;
        if (this.state = "closed", mVY.has(A)) {
            k(`[SessionsWebSocket] Permanent close code ${A}, not reconnecting`), this.callbacks.onClose?.();
            return
        }
        if (q === "connected" && this.reconnectAttempts < un4) this.reconnectAttempts++, k(`[SessionsWebSocket] Scheduling reconnect (attempt ${this.reconnectAttempts}/${un4})`), this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null, this.connect()
        }, xVY);
        else k("[SessionsWebSocket] Not reconnecting"), this.callbacks.onClose?.()
    }
    startPingInterval() {
        this.stopPingInterval(), this.pingInterval = setInterval(() => {
            if (this.ws && this.state === "connected") try {
                this.ws.ping?.()
            } catch {}
        }, uVY)
    }
    stopPingInterval() {
        if (this.pingInterval) clearInterval(this.pingInterval), this.pingInterval = null
    }
    sendControlResponse(A) {
        if (!this.ws || this.state !== "connected") {
            _6(Error("[SessionsWebSocket] Cannot send: not connected"));
            return
        }
        k("[SessionsWebSocket] Sending control response"), this.ws.send(B6(A))
    }
    sendControlRequest(A) {
        if (!this.ws || this.state !== "connected") {
            _6(Error("[SessionsWebSocket] Cannot send: not connected"));
            return
        }
        let q = {
            type: "control_request",
            request_id: bVY(),
            request: A
        };
        k(`[SessionsWebSocket] Sending control request: ${A.subtype}`), this.ws.send(B6(q))
    }
    isConnected() {
        return this.state === "connected"
    }
    close() {
        if (k("[SessionsWebSocket] Closing connection"), this.state = "closed", this.stopPingInterval(), this.reconnectTimer) clearTimeout(this.reconnectTimer), this.reconnectTimer = null;
        if (this.ws) this.ws.close(), this.ws = null
    }
    reconnect() {
        k("[SessionsWebSocket] Force reconnecting"), this.reconnectAttempts = 0, this.close(), this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null, this.connect()
        }, 500)
    }
}
// @from(Ln 337543, Col 4)
xVY = 2000
// @from(Ln 337544, Col 4)
un4 = 5
// @from(Ln 337545, Col 4)
uVY = 30000
// @from(Ln 337546, Col 4)
mVY
// @from(Ln 337547, Col 4)
Km8 = E(() => {
    H1();
    k1();
    dV();
    Mu();
    F5();
    g1();
    s8();
    mVY = new Set([4001, 4003])
})
// @from(Ln 337561, Col 0)
function C66(A, q) {
    return {
        type: "assistant",
        uuid: gVY(),
        message: {
            id: `remote-${q}`,
            type: "message",
            role: "assistant",
            content: [{
                type: "tool_use",
                id: A.tool_use_id,
                name: A.tool_name,
                input: A.input
            }],
            model: "",
            stop_reason: null,
            stop_sequence: null,
            container: null,
            context_management: null,
            usage: {
                input_tokens: 0,
                output_tokens: 0,
                cache_creation_input_tokens: 0,
                cache_read_input_tokens: 0
            }
        },
        requestId: void 0,
        timestamp: new Date().toISOString()
    }
}
// @from(Ln 337592, Col 0)
function I66(A) {
    return {
        name: A,
        inputSchema: {},
        isEnabled: () => !0,
        userFacingName: () => A,
        renderToolUseMessage: (q) => {
            let K = Object.entries(q);
            if (K.length === 0) return "";
            return K.slice(0, 3).map(([Y, z]) => {
                let _ = typeof z === "string" ? z : B6(z);
                return `${Y}: ${_}`
            }).join(", ")
        },
        call: async () => ({
            data: ""
        }),
        description: async () => "",
        prompt: () => "",
        isReadOnly: () => !1,
        isMcp: !1,
        needsPermissions: () => !0
    }
}
// @from(Ln 337616, Col 4)
Xl6 = E(() => {
    g1()
})
// @from(Ln 337620, Col 0)
function mn4(A) {
    let {
        sessionId: q,
        orgUUID: K,
        accessToken: Y,
        taskTitle: z,
        setPermissionMode: _
    } = A, w = new Map, O = new Dl6(q, K, Y, {
        onMessage(J) {
            if (J.type === "control_request") $(J)
        },
        onConnected() {
            if (_) k(`[RemoteAgentTask] Setting remote permission mode to ${_}`), O.sendControlRequest({
                subtype: "set_permission_mode",
                mode: _
            })
        },
        onClose() {
            k("[RemoteAgentTask] Control WebSocket closed")
        },
        onError(J) {
            k(`[RemoteAgentTask] Control WebSocket error: ${J.message}`)
        }
    });

    function $(J) {
        let M = J.request;
        if (M.subtype === "can_use_tool") H(M, J.request_id);
        else O.sendControlResponse({
            type: "control_response",
            response: {
                subtype: "error",
                request_id: J.request_id,
                error: `RemoteAgentTask does not handle control_request subtype: ${M.subtype}`
            }
        })
    }

    function H(J, M) {
        if (FVY.has(J.tool_name)) {
            k(`[RemoteAgentTask] Auto-approving ${J.tool_name} (safe, local flow handles approval)`), j(M, {
                behavior: "allow",
                updatedInput: J.input
            });
            return
        }
        let D = Dl();
        if (!D) {
            k("[RemoteAgentTask] No leader ToolUseConfirmQueue registered — denying permission request"), j(M, {
                behavior: "deny",
                message: "No local REPL available to approve permission"
            });
            return
        }
        w.set(M, J.tool_use_id);
        let X = dK(ng(), J.tool_name) ?? I66(J.tool_name),
            P = J.description ?? `${J.tool_name} requires permission`,
            W = {
                assistantMessage: C66(J, M),
                tool: X,
                description: P,
                input: J.input,
                toolUseContext: {},
                toolUseID: J.tool_use_id,
                permissionResult: {
                    behavior: "ask",
                    message: P,
                    suggestions: J.permission_suggestions,
                    blockedPath: J.blocked_path
                },
                permissionPromptStartTimeMs: Date.now(),
                workerBadge: {
                    name: z,
                    color: "magenta"
                },
                onUserInteraction() {},
                onAbort() {
                    w.delete(M), j(M, {
                        behavior: "deny",
                        message: "User aborted"
                    }), D((Z) => Z.filter((G) => G.toolUseID !== J.tool_use_id))
                },
                onAllow(Z) {
                    w.delete(M), j(M, {
                        behavior: "allow",
                        updatedInput: Z
                    }), D((G) => G.filter((f) => f.toolUseID !== J.tool_use_id))
                },
                onReject(Z) {
                    w.delete(M), j(M, {
                        behavior: "deny",
                        message: Z ?? "User denied permission"
                    }), D((G) => G.filter((f) => f.toolUseID !== J.tool_use_id))
                },
                async recheckPermission() {}
            };
        k(`[RemoteAgentTask] Forwarding permission request for ${J.tool_name} to local REPL`), D((Z) => [...Z, W])
    }

    function j(J, M) {
        let D = {
            type: "control_response",
            response: {
                subtype: "success",
                request_id: J,
                response: M.behavior === "allow" ? {
                    behavior: "allow",
                    updatedInput: M.updatedInput
                } : {
                    behavior: "deny",
                    message: M.message
                }
            }
        };
        O.sendControlResponse(D)
    }
    return O.connect(),
        function() {
            let M = new Set(w.values());
            for (let D of w.keys()) j(D, {
                behavior: "deny",
                message: "Remote task cleanup"
            });
            if (w.clear(), M.size > 0) Dl()?.((D) => D.filter((X) => !M.has(X.toolUseID)));
            O.close()
        }
}
// @from(Ln 337747, Col 4)
FVY
// @from(Ln 337748, Col 4)
Bn4 = E(() => {
    Km8();
    Xl6();
    IX();
    H1();
    FVY = new Set([aJ])
})
// @from(Ln 337759, Col 0)
function QVY(A, q, K, Y, z) {
    if (!Ym8(A, Y)) return;
    let _ = K === "completed" ? "completed successfully" : K === "failed" ? "failed" : "was stopped",
        w = z ? `
<${NV}>${z}</${NV}>` : "",
        O = g2(A),
        $ = `<${EH}>
<${JG}>${A}</${JG}>${w}
<${V$6}>remote_agent</${V$6}>
<${VV}>${O}</${VV}>
<${uD}>${K}</${uD}>
<${mD}>Remote task "${q}" ${_}</${mD}>
</${EH}>
Read the output file to retrieve the result: ${O}`;
    w0({
        value: $,
        mode: "task-notification"
    })
}
// @from(Ln 337779, Col 0)
function Ym8(A, q) {
    let K = !1;
    return i9(A, q, (Y) => {
        if (Y.notified) return Y;
        return K = !0, {
            ...Y,
            notified: !0
        }
    }), K
}
// @from(Ln 337790, Col 0)
function UVY(A) {
    for (let q = A.length - 1; q >= 0; q--) {
        let K = A[q];
        if (K?.type !== "assistant") continue;
        let Y = K.message.content.filter((_) => _.type === "text").map((_) => _.text).join(`
`),
            z = d4(Y, aHA);
        if (z?.trim()) return z.trim()
    }
    return null
}
// @from(Ln 337802, Col 0)
function gn4(A, q, K, Y) {
    if (!Ym8(A, Y)) return;
    let z = ZV1(q),
        _ = `<${EH}>
<${JG}>${A}</${JG}>
<${V$6}>remote_agent</${V$6}>
<${uD}>failed</${uD}>
<${mD}>Ultraplan failed: ${K}</${mD}>
</${EH}>
The remote Ultraplan session did not produce a plan (${K}). Inspect the session at ${z} and tell the user to retry locally with plan mode.`;
    w0({
        value: _,
        mode: "task-notification"
    })
}
// @from(Ln 337818, Col 0)
function dVY(A) {
    let q = A.findLast((z) => z.type === "assistant" && z.message.content.some((_) => _.type === "tool_use" && _.name === xv.name));
    if (!q) return [];
    let K = q.message.content.find((z) => z.type === "tool_use" && z.name === xv.name)?.input;
    if (!K) return [];
    let Y = xv.inputSchema.safeParse(K);
    if (!Y.success) return [];
    return Y.data.todos
}
// @from(Ln 337828, Col 0)
function cVY(A) {
    let {
        session: q,
        command: K,
        context: Y,
        toolUseId: z,
        isUltraplan: _
    } = A, w = oV("remote_agent");
    _38(w);
    let O = {
        ...RG(w, "remote_agent", q.title, z),
        type: "remote_agent",
        status: "running",
        sessionId: q.id,
        command: K,
        title: q.title,
        todoList: [],
        log: [],
        isUltraplan: _
    };
    Zf(O, Y.setAppState);
    let $, H = !1;
    if (_) k0().then(({
        accessToken: J,
        orgUUID: M
    }) => {
        if (H) return;
        $ = mn4({
            sessionId: q.id,
            orgUUID: M,
            accessToken: J,
            taskTitle: q.title,
            setPermissionMode: "plan"
        })
    }).catch((J) => {
        k(`[RemoteAgentTask] Could not start permission forwarder: ${J instanceof Error?J.message:String(J)}`)
    });
    let j = lVY(w, Y, () => {
        H = !0, $?.(), $ = void 0
    });
    return {
        taskId: w,
        sessionId: q.id,
        cleanup: () => {
            H = !0, j(), $?.()
        }
    }
}
// @from(Ln 337877, Col 0)
function lVY(A, q, K) {
    let Y = !0,
        z = 1000,
        _ = 3600000,
        w = 5,
        O = 0,
        $ = 0,
        H = async () => {
            if (!Y) return;
            try {
                let J = q.getAppState().tasks?.[A];
                if (!J || J.status !== "running") {
                    K?.();
                    return
                }
                let M = await qm8(J.sessionId),
                    D = M.log.find((V) => V.type === "result"),
                    X = J.isUltraplan ? UVY(M.log) : null,
                    P = M.log.some((V) => V.type === "assistant"),
                    W = M.log.length > $;
                if ($ = M.log.length, M.sessionStatus === "idle" && !W && P) O++;
                else O = 0;
                let Z = J.isUltraplan && (X !== null || O >= w),
                    G = J.isUltraplan && Date.now() - J.startTime > _,
                    f = D ? D.subtype === "success" ? "completed" : "failed" : Z || G ? "completed" : M.log.length > 0 ? "running" : "starting",
                    v = M.log.slice(J.log.length);
                if (v.length > 0) {
                    let V = v.map((L) => {
                        if (L.type === "assistant") return L.message.content.filter((h) => h.type === "text").map((h) => ("text" in h) ? h.text : "").join(`
`);
                        return B6(L)
                    }).join(`
`);
                    if (V) W97(A, V + `
`)
                }
                let N = !1;
                if (i9(A, q.setAppState, (V) => {
                        if (V.status !== "running") return N = !0, V;
                        if (!W && (f === "running" || f === "starting")) return V;
                        return {
                            ...V,
                            status: f === "starting" ? "running" : f,
                            log: M.log,
                            todoList: W ? dVY(M.log) : V.todoList,
                            endTime: D || Z || G ? Date.now() : void 0
                        }
                    }), N) {
                    K?.();
                    return
                }
                if (D || Z || G) {
                    let V = D && D.subtype !== "success" ? "failed" : "completed";
                    if (J.isUltraplan) {
                        if (X && V === "completed") {
                            if (!Ym8(A, q.setAppState)) {
                                K?.();
                                return
                            }
                            try {
                                await pVY(Fj(), X, "utf-8")
                            } catch {}
                            q.setAppState((h) => ({
                                ...h,
                                toolPermissionContext: {
                                    ...h.toolPermissionContext,
                                    mode: "plan",
                                    prePlanMode: "ultraplan"
                                }
                            })), w0({
                                value: `Ultraplan completed. Call ${aJ} now.`,
                                mode: "task-notification"
                            }), $O(A), K?.();
                            return
                        }
                        i9(A, q.setAppState, (h) => ({
                            ...h,
                            status: "failed"
                        }));
                        let L = D && D.subtype !== "success" ? "remote session returned an error" : G && !Z ? "remote session exceeded 60 minutes" : "no <ultraplan> block in remote output — session may have stalled on a permission prompt";
                        gn4(A, J.sessionId, L, q.setAppState), $O(A), K?.();
                        return
                    }
                    QVY(A, J.title, V, q.setAppState, J.toolUseId), $O(A), K?.();
                    return
                }
            } catch (j) {
                _6(j), O = 0;
                try {
                    let M = q.getAppState().tasks?.[A];
                    if (M?.isUltraplan && M.status === "running" && M.startTime && Date.now() - M.startTime > _) {
                        i9(A, q.setAppState, (D) => ({
                            ...D,
                            status: "failed",
                            endTime: Date.now()
                        })), gn4(A, M.sessionId, "remote session exceeded 60 minutes", q.setAppState), $O(A), K?.();
                        return
                    }
                } catch {}
            }
            if (Y) setTimeout(H, z)
        };
    return H(), () => {
        Y = !1
    }
}
// @from(Ln 337984, Col 0)
function ZV1(A) {
    return hZ(A, process.env.SESSION_INGRESS_URL)
}
// @from(Ln 337987, Col 4)
Zl
// @from(Ln 337987, Col 8)
Fn4
// @from(Ln 337988, Col 4)
GV1 = E(() => {
    i6();
    qL();
    k1();
    H1();
    aH();
    O0();
    SM();
    S66();
    R06();
    xn4();
    g1();
    vz();
    rH();
    JA();
    Bn4();
    EZ();
    Zl = t(P6(), 1);
    Fn4 = {
        name: "RemoteAgentTask",
        type: "remote_agent",
        async spawn(A, q) {
            let {
                command: K,
                title: Y,
                toolUseId: z
            } = A, {
                abortController: _
            } = q;
            k(`RemoteAgentTask spawning: ${Y}`);
            let w = await DV1({
                initialMessage: K,
                description: Y,
                signal: _.signal
            });
            if (!w) throw Error("Failed to create remote session");
            let {
                taskId: O,
                cleanup: $
            } = cVY({
                session: {
                    id: w.id,
                    title: w.title || Y
                },
                command: K,
                context: q,
                toolUseId: z
            });
            return {
                taskId: O,
                cleanup: $
            }
        },
        async kill(A, q) {
            i9(A, q.setAppState, (K) => {
                if (K.status !== "running") return K;
                return {
                    ...K,
                    status: "killed",
                    endTime: Date.now()
                }
            }), $O(A), k(`RemoteAgentTask ${A} marked as killed (local only)`)
        },
        renderStatus(A) {
            let q = A,
                K = q.status,
                Y = q.title;
            return Zl.createElement(m, null, Zl.createElement(T, {
                color: K === "running" ? "warning" : K === "completed" ? "success" : K === "failed" ? "error" : "inactive"
            }, "[", K, "] ", Y))
        },
        renderOutput(A) {
            return Zl.createElement(m, null, Zl.createElement(T, null, A))
        }
    }
})
// @from(Ln 338068, Col 0)
function oVY() {
    if (t6(process.env.CLAUDE_AUTO_BACKGROUND_TASKS) || w8("tengu_auto_background_agents", !1)) return 120000;
    return 0
}
// @from(Ln 338073, Col 0)
function AkY(A) {
    let q = 0;
    for (let K of A)
        if (K.type === "assistant") {
            for (let Y of K.message.content)
                if (Y.type === "tool_use") q++
        } return q
}
// @from(Ln 338082, Col 0)
function pn4(A) {
    for (let q = A.length - 1; q >= 0; q--) {
        let K = A[q];
        if (K.type !== "assistant") continue;
        let Y = K.message.content.filter((z) => z.type === "text");
        if (Y.length > 0) return Y.map((z) => z.text).join(`
`)
    }
    return
}
// @from(Ln 338093, Col 0)
function zm8(A, q, K) {
    let {
        prompt: Y,
        resolvedAgentModel: z,
        isBuiltInAgent: _,
        startTime: w,
        agentType: O,
        isAsync: $
    } = K, H = bX(A);
    if (H === void 0) throw Error("No assistant messages found");
    let j = H.message.content.filter((D) => D.type === "text");
    if (j.length === 0)
        for (let D = A.length - 1; D >= 0; D--) {
            let X = A[D];
            if (X.type !== "assistant") continue;
            let P = X.message.content.filter((W) => W.type === "text");
            if (P.length > 0) {
                j = P;
                break
            }
        }
    let J = fF6(H.message.usage),
        M = AkY(A);
    return d("tengu_agent_tool_completed", {
        agent_type: O,
        model: z,
        prompt_char_count: Y.length,
        response_char_count: j.length,
        assistant_message_count: A.length,
        total_tool_uses: M,
        duration_ms: Date.now() - w,
        total_tokens: J,
        is_built_in_agent: _,
        is_async: $
    }), {
        agentId: q,
        content: j,
        totalDurationMs: Date.now() - w,
        totalTokens: J,
        totalToolUseCount: M,
        usage: H.message.usage
    }
}
// @from(Ln 338136, Col 0)
async function _m8({
    agentMessages: A,
    tools: q,
    toolPermissionContext: K,
    abortSignal: Y,
    subagentType: z,
    totalToolUseCount: _
}) {
    {
        if (K.mode !== "auto") return null;
        if (!Ul4(A, q)) return null;
        let O = await EN1(A, {
                role: "user",
                content: [{
                    type: "text",
                    text: "Sub-agent has finished and is handing back control to the main agent. Review the sub-agent's work based on the block rules and let the main agent know if any file is dangerous (the main agent will see the reason)."
                }]
            }, q, K, Y),
            $ = O.unavailable ? "unavailable" : O.shouldBlock ? "blocked" : "allowed";
        if (d("tengu_auto_mode_decision", {
                decision: $,
                toolName: I46,
                classifierModel: O.model,
                agentType: z,
                toolUseCount: _,
                isHandoff: !0,
                classifierStage: O.stage,
                classifierStage1RequestId: O.stage1RequestId,
                classifierStage2RequestId: O.stage2RequestId
            }), O.shouldBlock) {
            if (O.unavailable) return k("Handoff classifier unavailable, allowing sub-agent output with warning", {
                level: "warn"
            }), "Note: The safety classifier was unavailable when reviewing this sub-agent's work. Please carefully verify the sub-agent's actions and output before acting on them.";
            return k(`Handoff classifier flagged sub-agent output: ${O.reason}`, {
                level: "warn"
            }), `SECURITY WARNING: This sub-agent performed actions that may violate security policy. Reason: ${O.reason}. Review the sub-agent's actions carefully before acting on its output.`
        }
    }
    return null
}
// @from(Ln 338177, Col 0)
function qkY(A, q) {
    if (!E7()) return;
    return A.team_name || q.teamContext?.teamName
}
// @from(Ln 338182, Col 0)
function wm8(A) {
    if (A.type !== "assistant") return;
    for (let q = A.message.content.length - 1; q >= 0; q--) {
        let K = A.message.content[q];
        if (K.type === "tool_use") return K.name
    }
    return
}
// @from(Ln 338191, Col 0)
function Om8(A, q, K, Y, z, _) {
    let w = v66(A);
    c36({
        type: "system",
        subtype: "task_progress",
        task_id: q,
        tool_use_id: K,
        description: w.lastActivity?.activityDescription ?? Y,
        usage: {
            total_tokens: w.tokenCount,
            tool_uses: w.toolUseCount,
            duration_ms: Date.now() - z
        },
        last_tool_name: _
    })
}
// @from(Ln 338207, Col 4)
Jm8
// @from(Ln 338207, Col 9)
nVY = null
// @from(Ln 338208, Col 4)
rVY = 2000
// @from(Ln 338209, Col 4)
fV1
// @from(Ln 338209, Col 9)
aVY
// @from(Ln 338209, Col 14)
sVY
// @from(Ln 338209, Col 19)
xx8
// @from(Ln 338209, Col 24)
tVY
// @from(Ln 338209, Col 29)
eVY
// @from(Ln 338209, Col 34)
QW6
// @from(Ln 338210, Col 4)
S01 = E(() => {
    K7();
    rD();
    Bj();
    JA();
    J_4();
    H0();
    A96();
    Fv();
    s8();
    A8();
    HA();
    Qz();
    V1();
    nY6();
    AZ();
    JA();
    wN1();
    Vb();
    Fc6();
    SM();
    O0();
    $e();
    J0();
    Yc();
    b01();
    jE();
    pc6();
    J_();
    dx8();
    xI();
    Oq();
    ix8();
    H1();
    lc6();
    jE();
    P66();
    T1();
    il4();
    zz();
    Su8();
    qZ();
    IX();
    lA();
    jN();
    Vp6();
    GV1();
    S66();
    Jm8 = t(P6(), 1), fV1 = t6(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS);
    aVY = F6(() => C.object({
        description: C.string().describe("A short (3-5 word) description of the task"),
        prompt: C.string().describe("The task for the agent to perform"),
        subagent_type: C.string().optional().describe("The type of specialized agent to use for this task"),
        model: C.enum(["sonnet", "opus", "haiku"]).optional().describe("Optional model override for this agent. Takes precedence over the agent definition's model frontmatter. If omitted, uses the agent definition's model, or inherits from the parent."),
        resume: C.string().optional().describe("Optional agent ID to resume from. If provided, the agent will continue from the previous execution transcript."),
        run_in_background: C.boolean().optional().describe("Set to true to run this agent in the background. You will be notified when it completes.")
    })), sVY = F6(() => {
        let A = C.object({
            name: C.string().optional().describe("Name for the spawned agent. Makes it addressable via SendMessage({to: name}) while running."),
            team_name: C.string().optional().describe("Team name for spawning. Uses current team context if omitted."),
            mode: X57().optional().describe('Permission mode for spawned teammate (e.g., "plan" to require plan approval).')
        });
        return aVY().merge(A).extend({
            isolation: C.enum(["worktree"]).optional().describe('Isolation mode. "worktree" creates a temporary git worktree so the agent works on an isolated copy of the repo.'),
            cwd: C.string().optional().describe('Absolute path to run the agent in. Overrides the working directory for all filesystem and shell operations within this agent. Mutually exclusive with isolation: "worktree".')
        })
    }), xx8 = F6(() => {
        let A = sVY().omit({
            cwd: !0
        });
        return fV1 || sH() ? A.omit({
            run_in_background: !0
        }) : A
    }), tVY = F6(() => C.object({
        agentId: C.string(),
        content: C.array(C.object({
            type: C.literal("text"),
            text: C.string()
        })),
        totalToolUseCount: C.number(),
        totalDurationMs: C.number(),
        totalTokens: C.number(),
        usage: C.object({
            input_tokens: C.number(),
            output_tokens: C.number(),
            cache_creation_input_tokens: C.number().nullable(),
            cache_read_input_tokens: C.number().nullable(),
            server_tool_use: C.object({
                web_search_requests: C.number(),
                web_fetch_requests: C.number()
            }).nullable(),
            service_tier: C.enum(["standard", "priority", "batch"]).nullable(),
            cache_creation: C.object({
                ephemeral_1h_input_tokens: C.number(),
                ephemeral_5m_input_tokens: C.number()
            }).nullable()
        })
    })), eVY = F6(() => {
        let A = tVY().extend({
                status: C.literal("completed"),
                prompt: C.string()
            }),
            q = C.object({
                status: C.literal("async_launched"),
                agentId: C.string().describe("The ID of the async agent"),
                description: C.string().describe("The description of the task"),
                prompt: C.string().describe("The prompt for the agent"),
                outputFile: C.string().describe("Path to the output file for checking agent progress"),
                canReadOutputFile: C.boolean().optional().describe("Whether the calling agent has Read/Bash tools to check progress")
            }),
            K = C.object({
                status: C.literal("queued_to_running"),
                agentId: C.string().describe("The ID of the running agent"),
                prompt: C.string().describe("The prompt that was queued")
            });
        return C.union([A, q, K])
    });
    QW6 = {
        async prompt({
            agents: A,
            tools: q,
            getToolPermissionContext: K,
            allowedAgentTypes: Y
        }) {
            let z = await K(),
                _ = [];
            for (let H of q)
                if (H.name?.startsWith("mcp__")) {
                    let J = H.name.split("__")[1];
                    if (J && !_.includes(J)) _.push(J)
                } let w = zE8(A, _),
                O = jm8(w, z, r4);
            return await j_4(O, !1, Y)
        },
        name: r4,
        searchHint: "delegate work to a subagent",
        aliases: [I46],
        maxResultSizeChars: 1e5,
        async description() {
            return "Launch a new agent"
        },
        get inputSchema() {
            return xx8()
        },
        get outputSchema() {
            return eVY()
        },
        async call({
            prompt: A,
            subagent_type: q,
            description: K,
            model: Y,
            resume: z,
            run_in_background: _,
            name: w,
            team_name: O,
            mode: $,
            isolation: H,
            cwd: j
        }, J, M, D, X) {
            let P = Date.now(),
                W = e2() ? void 0 : Y,
                Z = J.getAppState(),
                G = Z.toolPermissionContext.mode;
            if (O && !E7()) throw Error("Agent Teams is not yet available on your plan.");
            let f = qkY({
                team_name: O
            }, Z);
            if ($Y() && f && w) throw Error("Teammates cannot spawn other teammates — the team roster is flat. To spawn a subagent instead, omit the `name` parameter.");
            if (eP() && f && _ === !0) throw Error("In-process teammates cannot spawn background agents. Use run_in_background=false for synchronous subagents.");
            if (f && w) {
                let n = q ? J.options.agentDefinitions.activeAgents.find((i) => i.agentType === q) : void 0;
                if (n?.color) t36(q, n.color);
                let o = await qn4({
                    name: w,
                    prompt: A,
                    description: K,
                    team_name: f,
                    use_splitpane: !0,
                    plan_mode_required: $ === "plan",
                    model: W ?? n?.model,
                    agent_type: q
                }, J);
                return {
                    data: {
                        status: "teammate_spawned",
                        prompt: A,
                        ...o.data
                    }
                }
            }
            let v, N, V;
            if (z) {
                let n = Z.tasks[z];
                if (Sf(n) && !Ef6(n) && n.status === "running") return NV1(z, A, J.setAppStateForTasks ?? J.setAppState), {
                    data: {
                        status: "queued_to_running",
                        agentId: z,
                        prompt: A
                    }
                };
                let o = await hf6(X$(z));
                if (!o) throw Error(`No transcript found for agent ID: ${z}`);
                v = Ol6($l6(_V1(o)));
                let a = await Mm8(X$(z));
                if (!q) N = a?.agentType;
                let i = a?.worktreePath;
                if (i) try {
                    await iVY.access(i), V = i
                } catch (l) {
                    let q6 = l.code;
                    if (q6 === "ENOENT" || q6 === "EACCES" || q6 === "EPERM") k(`Resumed worktree ${i} no longer exists; falling back to parent cwd`);
                    else throw l
                }
            }
            let L = q ?? (N !== void 0 && N !== pW6.agentType ? N : sH() && !z ? void 0 : q96.agentType),
                h = L === void 0,
                R, u = !1;
            if (h) {
                if (J.options.querySource === `agent:builtin:${pW6.agentType}` || O_4(J.messages)) throw Error("Fork is not available inside a forked worker. Complete your task directly using your tools.");
                R = pW6
            } else if (N === pW6.agentType) R = pW6, u = !0;
            else {
                let n = J.options.agentDefinitions.activeAgents,
                    {
                        allowedAgentTypes: o
                    } = J.options.agentDefinitions,
                    a = jm8(o ? n.filter((l) => o.includes(l.agentType)) : n, Z.toolPermissionContext, r4),
                    i = a.find((l) => l.agentType === L);
                if (!i) {
                    if (n.find((q6) => q6.agentType === L)) {
                        let q6 = cn4(Z.toolPermissionContext, r4, L);
                        throw Error(`Agent type '${L}' has been denied by permission rule '${r4}(${L})' from ${q6?.source??"settings"}.`)
                    }
                    throw Error(`Agent type '${L}' not found. Available agents: ${a.map((q6)=>q6.agentType).join(", ")}`)
                }
                R = i
            }
            let I = R.requiredMcpServers;
            if (I?.length) {
                let n = Z.mcp.clients.some((i) => i.type === "pending" && I.some((l) => i.name.toLowerCase().includes(l.toLowerCase()))),
                    o = Z;
                if (n) {
                    let q6 = Date.now() + 30000;
                    while (Date.now() < q6) {
                        if (await new Promise((L6) => setTimeout(L6, 500)), o = J.getAppState(), o.mcp.clients.some((L6) => L6.type === "failed" && I.some((y6) => L6.name.toLowerCase().includes(y6.toLowerCase())))) break;
                        if (!o.mcp.clients.some((L6) => L6.type === "pending" && I.some((y6) => L6.name.toLowerCase().includes(y6.toLowerCase())))) break
                    }
                }
                let a = [];
                for (let i of o.mcp.tools)
                    if (i.name?.startsWith("mcp__")) {
                        let q6 = i.name.split("__")[1];
                        if (q6 && !a.includes(q6)) a.push(q6)
                    } if (!HW1(R, a)) {
                    let i = I.filter((l) => !a.some((q6) => q6.toLowerCase().includes(l.toLowerCase())));
                    throw Error(`Agent '${R.agentType}' requires MCP servers matching: ${i.join(", ")}. MCP servers with tools: ${a.length>0?a.join(", "):"none"}. Use /mcp to configure and authenticate the required MCP servers.`)
                }
            }
            if (R.color) t36(R.agentType, R.color);
            let g = C01(R.model, J.options.mainLoopModel, h || u ? void 0 : W, G);
            d("tengu_agent_tool_selected", {
                agent_type: R.agentType,
                model: g,
                source: R.source,
                color: R.color,
                is_built_in_agent: Qj(R),
                is_resume: !!z,
                is_async: _ === !0 || R.background === !0,
                is_fork: h
            });
            let B = H ?? R.isolation,
                b, p, Q;
            if (h || u) {
                if (J.renderedSystemPrompt) p = J.renderedSystemPrompt;
                else {
                    let n = Z.agent ? Z.agentDefinitions.activeAgents.find((i) => i.agentType === Z.agent) : void 0,
                        o = Array.from(Z.toolPermissionContext.additionalWorkingDirectories.keys()),
                        a = await R0(J.options.tools, J.options.mainLoopModel, o, J.options.mcpClients);
                    p = cg({
                        mainThreadAgentDefinition: n,
                        toolUseContext: J,
                        customSystemPrompt: J.options.customSystemPrompt,
                        defaultSystemPrompt: a,
                        appendSystemPrompt: J.options.appendSystemPrompt
                    })
                }
                Q = h ? $_4(A, D) : [p1({
                    content: A
                })]
            } else {
                try {
                    let n = Array.from(Z.toolPermissionContext.additionalWorkingDirectories.keys()),
                        o = R.getSystemPrompt({
                            toolUseContext: J
                        });
                    if (R.memory) d("tengu_agent_memory_loaded", {
                        ...{},
                        scope: R.memory,
                        source: "subagent"
                    });
                    b = await mc6([o], g, n)
                } catch (n) {
                    k(`Failed to get system prompt for agent ${R.agentType}: ${_1(n)}`)
                }
                Q = [p1({
                    content: A
                })]
            }
            let U = {
                    prompt: A,
                    resolvedAgentModel: g,
                    isBuiltInAgent: Qj(R),
                    startTime: P,
                    agentType: R.agentType,
                    isAsync: _ === !0 || R.background === !0
                },
                r = !1,
                e = sH(),
                Y6 = (_ === !0 || R.background === !0 || r || e || (nVY?.isProactiveActive() ?? !1)) && !fV1,
                H6 = {
                    ...Z.toolPermissionContext,
                    mode: R.permissionMode ?? "acceptEdits"
                },
                J6 = u66(H6, Z.mcp.tools),
                K6 = z || bI(),
                s = null;
            if (B === "worktree") {
                let n = `agent-${K6.slice(0,8)}`;
                s = await zl6(n)
            }
            if (h && s) Q.push(p1({
                content: H_4(G1(), s.worktreePath)
            }));
            let X6 = {
                    agentDefinition: R,
                    promptMessages: v ? [...v, ...Q] : Q,
                    toolUseContext: J,
                    canUseTool: M,
                    isAsync: Y6,
                    querySource: J.options.querySource ?? _l4(R.agentType, Qj(R)),
                    model: h || u ? void 0 : W,
                    override: h || u ? {
                        systemPrompt: p
                    } : b && !s && !j && !V ? {
                        systemPrompt: uq(b)
                    } : void 0,
                    availableTools: h ? J.options.tools : J6,
                    forkContextMessages: v ? void 0 : h ? J.messages : void 0,
                    ...(h || u) && {
                        useExactTools: !0
                    },
                    worktreePath: s?.worktreePath ?? V
                },
                z6 = j ?? s?.worktreePath ?? V,
                N6 = (n) => z6 ? dHA(z6, n) : n(),
                $6 = async () => {
                    if (!s) return {};
                    let {
                        worktreePath: n,
                        worktreeBranch: o,
                        headCommit: a,
                        gitRoot: i,
                        hookBased: l
                    } = s;
                    if (s = null, l) return k(`Hook-based agent worktree kept at: ${n}`), {
                        worktreePath: n
                    };
                    if (a) {
                        if (!await pu8(n, a)) return await E66(n, o, i), gc6(X$(K6), {
                            agentType: R.agentType
                        }).catch((w6) => k(`Failed to clear worktree metadata: ${w6}`)), {}
                    }
                    return k(`Agent worktree has changes, keeping: ${n}`), {
                        worktreePath: n,
                        worktreeBranch: o
                    }
                };
            if (Y6) {
                let n = K6,
                    o = Qn4({
                        agentId: n,
                        description: K,
                        prompt: A,
                        selectedAgent: R,
                        setAppState: J.setAppState,
                        toolUseId: J.toolUseId
                    });
                if (w)(J.setAppStateForTasks ?? J.setAppState)((q6) => {
                    let w6 = new Map(q6.agentNameRegistry);
                    return w6.set(w, X$(n)), {
                        ...q6,
                        agentNameRegistry: w6
                    }
                });
                let a = {
                    agentId: n,
                    parentSessionId: Zt(),
                    agentType: "subagent",
                    subagentName: R.agentType,
                    isBuiltIn: Qj(R)
                };
                X66(a, () => N6(async () => {
                    let l, q6 = [];
                    try {
                        let w6 = xf6(),
                            O6 = uf6(J.options.tools);
                        for await (let R6 of qh({
                            ...X6,
                            override: {
                                ...X6.override,
                                agentId: X$(o.agentId),
                                abortController: o.abortController
                            },
                            onCacheSafeParams: r || sH() || Nn() ? (T6) => {
                                let {
                                    stop: D6
                                } = hN1(o.agentId, X$(o.agentId), T6, J.setAppState);
                                l = D6
                            } : void 0
                        })) {
                            q6.push(R6), Az6(w6, R6, O6, J.options.tools), TV1(o.agentId, v66(w6), J.setAppState);
                            let T6 = wm8(R6);
                            if (T6) Om8(w6, o.agentId, J.toolUseId, K, P, T6)
                        }
                        l?.();
                        let L6 = zm8(q6, o.agentId, U),
                            y6 = L6.content.filter((R6) => R6.type === "text").map((R6) => R6.text).join(`
`);
                        {
                            let R6 = await _m8({
                                agentMessages: q6,
                                tools: J.options.tools,
                                toolPermissionContext: J.getAppState().toolPermissionContext,
                                abortSignal: o.abortController.signal,
                                subagentType: R.agentType,
                                totalToolUseCount: L6.totalToolUseCount
                            });
                            if (R6) y6 = `${R6}

${y6}`
                        }
                        let G6 = await $6();
                        $m8(L6, J.setAppState), $z6({
                            taskId: o.agentId,
                            description: K,
                            status: "completed",
                            setAppState: J.setAppState,
                            finalMessage: y6,
                            usage: {
                                totalTokens: vV1(w6),
                                toolUses: L6.totalToolUseCount,
                                durationMs: L6.totalDurationMs
                            },
                            toolUseId: J.toolUseId,
                            ...G6
                        }), VR(o.agentId, J.setAppState)
                    } catch (w6) {
                        l?.();
                        let O6 = await $6();
                        if (w6 instanceof oY) {
                            if (d("tengu_agent_tool_terminated", {
                                    agent_type: U.agentType,
                                    model: U.resolvedAgentModel,
                                    duration_ms: Date.now() - U.startTime,
                                    is_async: !0,
                                    is_built_in_agent: U.isBuiltInAgent,
                                    reason: "user_kill_async"
                                }), x66(o.agentId, J.setAppState)) {
                                let G6 = pn4(q6);
                                $z6({
                                    taskId: o.agentId,
                                    description: K,
                                    status: "killed",
                                    setAppState: J.setAppState,
                                    toolUseId: J.toolUseId,
                                    finalMessage: G6,
                                    ...O6
                                }), setTimeout(VR.bind(null, o.agentId, J.setAppState), mB)
                            }
                            return
                        }
                        let L6 = w6 instanceof Error ? w6.message : String(w6);
                        Hm8(o.agentId, L6, J.setAppState), $z6({
                            taskId: o.agentId,
                            description: K,
                            status: "failed",
                            error: L6,
                            setAppState: J.setAppState,
                            toolUseId: J.toolUseId,
                            ...O6
                        }), VR(o.agentId, J.setAppState)
                    } finally {
                        zA6(n), XW1(n)
                    }
                }));
                let i = J.options.tools.some((l) => z3(l, s7) || z3(l, Q7));
                return {
                    data: {
                        isAsync: !0,
                        status: "async_launched",
                        agentId: o.agentId,
                        description: K,
                        prompt: A,
                        outputFile: g2(o.agentId),
                        canReadOutputFile: i
                    }
                }
            } else {
                let n = X$(K6),
                    o = {
                        agentId: n,
                        parentSessionId: Zt(),
                        agentType: "subagent",
                        subagentName: R.agentType,
                        isBuiltIn: Qj(R)
                    };
                return X66(o, () => N6(async () => {
                    let a = [],
                        i = Date.now(),
                        l = xf6(),
                        q6 = uf6(J.options.tools);
                    if (Q.length > 0) {
                        let V6 = JM(Q).find((b6) => b6.type === "user");
                        if (V6 && V6.type === "user" && X) X({
                            toolUseID: `agent_${D.message.id}`,
                            data: {
                                message: V6,
                                type: "agent_progress",
                                prompt: A,
                                resume: z,
                                agentId: n
                            }
                        })
                    }
                    let w6, O6, L6;
                    if (!fV1) {
                        let o6 = Un4({
                            agentId: n,
                            description: K,
                            prompt: A,
                            selectedAgent: R,
                            setAppState: J.setAppState,
                            toolUseId: J.toolUseId,
                            autoBackgroundMs: oVY() || void 0
                        });
                        w6 = o6.taskId, O6 = o6.backgroundSignal.then(() => ({
                            type: "background"
                        })), L6 = o6.cancelAutoBackground
                    }
                    let y6 = !1,
                        G6 = !1,
                        R6, T6 = w6,
                        D6 = qh({
                            ...X6,
                            override: {
                                ...X6.override,
                                agentId: n
                            },
                            onCacheSafeParams: T6 && Nn() ? (o6) => {
                                let {
                                    stop: V6
                                } = hN1(T6, n, o6, J.setAppState);
                                R6 = V6
                            } : void 0
                        })[Symbol.asyncIterator](),
                        Q6, k6 = !1,
                        Z6 = {};
                    try {
                        while (!0) {
                            let o6 = Date.now() - i;
                            if (!fV1 && !y6 && o6 >= rVY && J.setToolJSX) y6 = !0, J.setToolJSX({
                                jsx: Jm8.createElement(TN1, null),
                                shouldHidePromptInput: !1,
                                shouldContinueAnimation: !0,
                                showSpinner: !0
                            });
                            let V6 = D6.next(),
                                b6 = O6 ? await Promise.race([V6.then((K1) => ({
                                    type: "message",
                                    result: K1
                                })), O6]) : {
                                    type: "message",
                                    result: await V6
                                };
                            if (b6.type === "background" && w6) {
                                let j6 = J.getAppState().tasks[w6];
                                if (Sf(j6) && j6.isBackgrounded) {
                                    let W6 = w6;
                                    G6 = !0, R6?.(), X66(o, async () => {
                                        let d6;
                                        try {
                                            await Promise.race([D6.return(void 0).catch(() => {}), new Promise((K8) => setTimeout(K8, 1000))]);
                                            let S6 = xf6(),
                                                g6 = uf6(J.options.tools);
                                            for (let K8 of a) Az6(S6, K8, g6, J.options.tools);
                                            for await (let K8 of qh({
                                                ...X6,
                                                isAsync: !0,
                                                override: {
                                                    ...X6.override,
                                                    agentId: X$(W6),
                                                    abortController: j6.abortController
                                                },
                                                onCacheSafeParams: Nn() ? (e8) => {
                                                    let {
                                                        stop: n8
                                                    } = hN1(W6, X$(W6), e8, J.setAppState);
                                                    d6 = n8
                                                } : void 0
                                            })) {
                                                a.push(K8), Az6(S6, K8, g6, J.options.tools), TV1(W6, v66(S6), J.setAppState);
                                                let e8 = wm8(K8);
                                                if (e8) Om8(S6, W6, J.toolUseId, K, P, e8)
                                            }
                                            let D1 = zm8(a, W6, U),
                                                J1 = D1.content.filter((K8) => K8.type === "text").map((K8) => K8.text).join(`
`);
                                            {
                                                let K8 = J.getAppState(),
                                                    e8 = await _m8({
                                                        agentMessages: a,
                                                        tools: J.options.tools,
                                                        toolPermissionContext: K8.toolPermissionContext,
                                                        abortSignal: j6.abortController.signal,
                                                        subagentType: R.agentType,
                                                        totalToolUseCount: D1.totalToolUseCount
                                                    });
                                                if (e8) J1 = `${e8}

${J1}`
                                            }
                                            let E1 = await $6();
                                            $m8(D1, J.setAppState), $z6({
                                                taskId: W6,
                                                description: K,
                                                status: "completed",
                                                setAppState: J.setAppState,
                                                finalMessage: J1,
                                                usage: {
                                                    totalTokens: vV1(S6),
                                                    toolUses: D1.totalToolUseCount,
                                                    durationMs: D1.totalDurationMs
                                                },
                                                toolUseId: J.toolUseId,
                                                ...E1
                                            }), VR(W6, J.setAppState)
                                        } catch (S6) {
                                            let g6 = await $6();
                                            if (S6 instanceof oY) {
                                                if (d("tengu_agent_tool_terminated", {
                                                        agent_type: U.agentType,
                                                        model: U.resolvedAgentModel,
                                                        duration_ms: Date.now() - U.startTime,
                                                        is_async: !0,
                                                        is_built_in_agent: U.isBuiltInAgent,
                                                        reason: "user_cancel_background"
                                                    }), x66(W6, J.setAppState)) {
                                                    let E1 = pn4(a);
                                                    $z6({
                                                        taskId: W6,
                                                        description: K,
                                                        status: "killed",
                                                        setAppState: J.setAppState,
                                                        toolUseId: J.toolUseId,
                                                        finalMessage: E1,
                                                        ...g6
                                                    }), setTimeout(VR.bind(null, W6, J.setAppState), mB)
                                                }
                                                return
                                            }
                                            let D1 = S6 instanceof Error ? S6.message : String(S6);
                                            Hm8(W6, D1, J.setAppState), $z6({
                                                taskId: W6,
                                                description: K,
                                                status: "failed",
                                                error: D1,
                                                setAppState: J.setAppState,
                                                toolUseId: J.toolUseId,
                                                ...g6
                                            }), VR(W6, J.setAppState)
                                        } finally {
                                            d6?.(), zA6(n), XW1(n)
                                        }
                                    });
                                    let n6 = J.options.tools.some((d6) => z3(d6, s7) || z3(d6, Q7));
                                    return {
                                        data: {
                                            isAsync: !0,
                                            status: "async_launched",
                                            agentId: W6,
                                            description: K,
                                            prompt: A,
                                            outputFile: g2(W6),
                                            canReadOutputFile: n6
                                        }
                                    }
                                }
                            }
                            if (b6.type !== "message") continue;
                            let {
                                result: E6
                            } = b6;
                            if (E6.done) break;
                            let U6 = E6.value;
                            if (a.push(U6), Az6(l, U6, q6, J.options.tools), w6) {
                                let K1 = wm8(U6);
                                if (K1) {
                                    if (Om8(l, w6, J.toolUseId, K, i, K1), Nn()) TV1(w6, v66(l), J.setAppState)
                                }
                            }
                            if (U6.type === "progress" && (U6.data.type === "bash_progress" || U6.data.type === "powershell_progress") && X) X({
                                toolUseID: U6.toolUseID,
                                data: U6.data
                            });
                            if (U6.type !== "assistant" && U6.type !== "user") continue;
                            if (U6.type === "assistant") {
                                let K1 = QD1(U6);
                                if (K1 > 0) J.setResponseLength((j6) => j6 + K1)
                            }
                            let c6 = JM([U6]);
                            for (let K1 of c6)
                                for (let j6 of K1.message.content) {
                                    if (j6.type !== "tool_use" && j6.type !== "tool_result") continue;
                                    if (X) X({
                                        toolUseID: `agent_${D.message.id}`,
                                        data: {
                                            message: K1,
                                            type: "agent_progress",
                                            prompt: "",
                                            resume: void 0,
                                            agentId: n
                                        }
                                    })
                                }
                        }
                    } catch (o6) {
                        if (o6 instanceof oY) throw k6 = !0, d("tengu_agent_tool_terminated", {
                            agent_type: U.agentType,
                            model: U.resolvedAgentModel,
                            duration_ms: Date.now() - U.startTime,
                            is_async: !1,
                            is_built_in_agent: U.isBuiltInAgent,
                            reason: "user_cancel_sync"
                        }), o6;
                        k(`Sync agent error: ${_1(o6)}`, {
                            level: "error"
                        }), Q6 = o6 instanceof Error ? o6 : Error(String(o6))
                    } finally {
                        if (J.setToolJSX) J.setToolJSX(null);
                        if (R6?.(), w6) {
                            if (dn4(w6, J.setAppState), !G6) {
                                let o6 = v66(l);
                                c36({
                                    type: "system",
                                    subtype: "task_notification",
                                    task_id: w6,
                                    tool_use_id: J.toolUseId,
                                    status: Q6 ? "failed" : k6 ? "stopped" : "completed",
                                    output_file: "",
                                    summary: K,
                                    usage: {
                                        total_tokens: o6.tokenCount,
                                        tool_uses: o6.toolUseCount,
                                        duration_ms: Date.now() - i
                                    }
                                })
                            }
                        }
                        if (zA6(n), !G6) XW1(n);
                        if (L6?.(), !G6) Z6 = await $6()
                    }
                    let u6 = a.findLast((o6) => o6.type !== "system" && o6.type !== "progress");
                    if (u6 && Hz6(u6)) throw d("tengu_agent_tool_terminated", {
                        agent_type: U.agentType,
                        model: U.resolvedAgentModel,
                        duration_ms: Date.now() - U.startTime,
                        is_async: !1,
                        is_built_in_agent: U.isBuiltInAgent,
                        reason: "user_cancel_sync"
                    }), new oY;
                    if (Q6) {
                        if (!a.some((V6) => V6.type === "assistant")) throw Q6;
                        k(`Sync agent recovering from error with ${a.length} messages`)
                    }
                    let C6 = zm8(a, n, U);
                    {
                        let o6 = J.getAppState(),
                            V6 = await _m8({
                                agentMessages: a,
                                tools: J.options.tools,
                                toolPermissionContext: o6.toolPermissionContext,
                                abortSignal: J.abortController.signal,
                                subagentType: R.agentType,
                                totalToolUseCount: C6.totalToolUseCount
                            });
                        if (V6) C6.content = [{
                            type: "text",
                            text: V6
                        }, ...C6.content]
                    }
                    return {
                        data: {
                            status: "completed",
                            prompt: A,
                            ...C6,
                            ...Z6
                        }
                    }
                }))
            }
        },
        isReadOnly() {
            return !0
        },
        toAutoClassifierInput(A) {
            let q = A;
            return `${q.subagent_type?`(${q.subagent_type}): `:": "}${q.prompt}`
        },
        isConcurrencySafe() {
            return !0
        },
        isEnabled() {
            return !0
        },
        userFacingName: Ix8,
        userFacingNameBackgroundColor: bx8,
        getActivityDescription(A) {
            return A?.description ?? "Running task"
        },
        async checkPermissions(A, q) {
            let K = q.getAppState();
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        mapToolResultToToolResultBlockParam(A, q) {
            let K = A;
            if (typeof K === "object" && K !== null && "status" in K && K.status === "teammate_spawned") {
                let Y = K;
                return {
                    tool_use_id: q,
                    type: "tool_result",
                    content: [{
                        type: "text",
                        text: `Spawned successfully.
agent_id: ${Y.teammate_id}
name: ${Y.name}
team_name: ${Y.team_name}
The agent is now running and will receive instructions via mailbox.`
                    }]
                }
            }
            if ("status" in K && K.status === "remote_launched") {
                let Y = K;
                return {
                    tool_use_id: q,
                    type: "tool_result",
                    content: [{
                        type: "text",
                        text: `Remote agent launched in CCR.
taskId: ${Y.taskId}
session_url: ${Y.sessionUrl}
output_file: ${Y.outputFile}
The agent is running remotely. You will be notified automatically when it completes.
Briefly tell the user what you launched and end your response.`
                    }]
                }
            }
            if (A.status === "queued_to_running") return {
                tool_use_id: q,
                type: "tool_result",
                content: [{
                    type: "text",
                    text: `Prompt queued for running agent ${A.agentId}. It will see this at its next tool-round boundary.
You will be notified when the agent completes. Briefly tell the user what you queued and end your response.`
                }]
            };
            if (A.status === "async_launched") {
                let Y = `Async agent launched successfully.
agentId: ${A.agentId} (internal ID - do not mention to user. Use to resume later if needed.)
The agent is working in the background. You will be notified automatically when it completes.`,
                    z = A.canReadOutputFile ? `Do not duplicate this agent's work — avoid working with the same files or topics it is using. Work on non-overlapping tasks, or briefly tell the user what you launched and end your response.
output_file: ${A.outputFile}
If asked, you can check progress before completion by using ${s7} or ${Q7} tail on the output file.` : "Briefly tell the user what you launched and end your response. Do not generate any other text — agent results will arrive in a subsequent message.",
                    _ = `${Y}
${z}`;
                return {
                    tool_use_id: q,
                    type: "tool_result",
                    content: [{
                        type: "text",
                        text: _
                    }]
                }
            }
            if (A.status === "completed") {
                let Y = A,
                    z = Y.worktreePath ? `
worktreePath: ${Y.worktreePath}
worktreeBranch: ${Y.worktreeBranch}` : "",
                    _ = A.content.length > 0 ? A.content : [{
                        type: "text",
                        text: "(Subagent completed but returned no output.)"
                    }];
                return {
                    tool_use_id: q,
                    type: "tool_result",
                    content: [..._, {
                        type: "text",
                        text: `agentId: ${A.agentId} (for resuming to continue this agent's work if needed)${z}
<usage>total_tokens: ${A.totalTokens}
tool_uses: ${A.totalToolUseCount}
duration_ms: ${A.totalDurationMs}</usage>`
                    }]
                }
            }
            throw Error(`Unexpected agent tool result status: ${A.status}`)
        },
        renderToolResultMessage: hc4,
        renderToolUseMessage: Sc4,
        renderToolUseTag: Cc4,
        renderToolUseProgressMessage: ff6,
        renderToolUseRejectedMessage: Ic4,
        renderToolUseErrorMessage: bc4,
        renderGroupedToolUse: xc4
    }
})
// @from(Ln 339140, Col 0)
function ln4(A) {
    if ("status" in A && A.status === "forked") return O3.createElement(t1, {
        height: 1
    }, O3.createElement(T, null, O3.createElement(C8, null, ["Done"])));
    let q = ["Successfully loaded skill"];
    if ("allowedTools" in A && A.allowedTools && A.allowedTools.length > 0) {
        let K = A.allowedTools.length;
        q.push(`${K} tool${K===1?"":"s"} allowed`)
    }
    if ("model" in A && A.model) q.push(A.model);
    return O3.createElement(t1, {
        height: 1
    }, O3.createElement(T, null, O3.createElement(C8, null, q)))
}
// @from(Ln 339155, Col 0)
function in4({
    skill: A
}, {
    commands: q
}) {
    if (!A) return null;
    return q?.find((z) => z.name === A)?.loadedFrom === "commands_DEPRECATED" ? `/${A}` : A
}
// @from(Ln 339164, Col 0)
function VV1(A, {
    tools: q,
    verbose: K
}) {
    if (!A.length) return O3.createElement(t1, {
        height: 1
    }, O3.createElement(T, {
        dimColor: !0
    }, YkY));
    let Y = K ? A : A.slice(-KkY),
        z = A.length - Y.length,
        {
            inProgressToolUseIDs: _
        } = Ic6(A.map((w) => w.data));
    return O3.createElement(t1, null, O3.createElement(m, {
        flexDirection: "column"
    }, O3.createElement(Hp6, null, Y.map((w) => O3.createElement(m, {
        key: w.uuid,
        height: 1,
        overflow: "hidden"
    }, O3.createElement(tR, {
        message: w.data.message,
        lookups: Hl,
        addMargin: !1,
        tools: q,
        commands: [],
        verbose: K,
        inProgressToolUseIDs: _,
        progressMessagesForMessage: [],
        shouldAnimate: !1,
        shouldShowDot: !1,
        style: "condensed",
        isTranscriptMode: !1,
        isStatic: !0
    })))), z > 0 && O3.createElement(T, {
        dimColor: !0
    }, "+", z, " more tool ", z === 1 ? "use" : "uses")))
}
// @from(Ln 339203, Col 0)
function nn4(A, {
    progressMessagesForMessage: q,
    tools: K,
    verbose: Y
}) {
    return O3.createElement(O3.Fragment, null, VV1(q, {
        tools: K,
        verbose: Y
    }), O3.createElement(T3, null))
}
// @from(Ln 339214, Col 0)
function rn4(A, {
    progressMessagesForMessage: q,
    tools: K,
    verbose: Y
}) {
    return O3.createElement(O3.Fragment, null, VV1(q, {
        tools: K,
        verbose: Y
    }), O3.createElement(eK, {
        result: A,
        verbose: Y
    }))
}
// @from(Ln 339227, Col 4)
O3
// @from(Ln 339227, Col 8)
KkY = 3
// @from(Ln 339228, Col 4)
YkY = "Initializing…"
// @from(Ln 339229, Col 4)
on4 = E(() => {
    i6();
    kO();
    gj();
    iq();
    Xq();
    Gf6();
    GR();
    JA();
    O3 = t(P6(), 1)
})
// @from(Ln 339241, Col 0)
function an4(A, q) {
    if (!q) return A;
    return A.map((K) => {
        if (K.type === "user") return {
            ...K,
            sourceToolUseID: q
        };
        return K
    })
}
// @from(Ln 339252, Col 0)
function sn4(A, q) {
    let K = A.message.content.find((Y) => Y.type === "tool_use" && Y.name === q);
    return K && K.type === "tool_use" ? K.id : void 0
}
// @from(Ln 339256, Col 0)
async function zkY(A, q, K, Y, z, _, w) {
    let O = Date.now(),
        $ = bI(),
        H = Qg().has(q),
        j = tn4(A),
        J = A.source === "bundled";
    d("tengu_skill_tool_invocation", {
        command_name: H || J || j ? q : "custom",
        execution_context: "fork",
        ...{},
        ...!1,
        ...A.pluginInfo && {
            plugin_name: j ? A.pluginInfo.pluginManifest.name : "third-party",
            plugin_repository: j ? A.pluginInfo.repository : "third-party"
        }
    });
    let {
        modifiedGetAppState: X,
        baseAgent: P,
        promptMessages: W,
        skillContent: Z
    } = await DN1(A, K || "", Y), G = [];
    k(`SkillTool executing forked skill ${q} with agent ${P.agentType}`);
    try {
        for await (let N of qh({
            agentDefinition: P,
            promptMessages: W,
            toolUseContext: {
                ...Y,
                getAppState: X
            },
            canUseTool: z,
            isAsync: !1,
            querySource: "agent:custom",
            model: A.model,
            availableTools: Y.options.tools,
            override: {
                agentId: $
            }
        })) if (G.push(N), (N.type === "assistant" || N.type === "user") && w) {
            let V = JM([N]);
            for (let L of V)
                if (L.message.content.some((R) => R.type === "tool_use" || R.type === "tool_result")) w({
                    toolUseID: `skill_${_.message.id}`,
                    data: {
                        message: L,
                        type: "skill_progress",
                        prompt: Z,
                        agentId: $
                    }
                })
        }
        let f = XN1(G, "Skill execution completed");
        G.length = 0;
        let v = Date.now() - O;
        return k(`SkillTool forked skill ${q} completed in ${v}ms`), {
            data: {
                success: !0,
                commandName: q,
                status: "forked",
                agentId: $,
                result: f
            }
        }
    } finally {
        zA6($)
    }
}
// @from(Ln 339325, Col 0)
function $kY(A) {
    for (let q of Object.keys(A)) {
        if (OkY.has(q)) continue;
        let K = A[q];
        if (K === void 0 || K === null) continue;
        if (Array.isArray(K) && K.length === 0) continue;
        if (typeof K === "object" && !Array.isArray(K) && Object.keys(K).length === 0) continue;
        return !1
    }
    return !0
}
// @from(Ln 339337, Col 0)
function tn4(A) {
    if (A.source !== "plugin" || !A.pluginInfo?.repository) return !1;
    let q = A.pluginInfo.repository.lastIndexOf("@");
    if (q <= 0) return !1;
    let K = A.pluginInfo.repository.slice(q + 1);
    return nV.has(K)
}
// @from(Ln 339344, Col 4)
_kY
// @from(Ln 339344, Col 9)
wkY
// @from(Ln 339344, Col 14)
m66
// @from(Ln 339344, Col 19)
OkY