
// @from(Ln 165020, Col 0)
async function Tk8(q = {}) {
    let K = q.model ? String(q.model) : G5(),
        _ = typeof q.betas === "string" ? q.betas : KR(K).join(","),
        [z, Y] = await Promise.all([zE_(), nJ8()]),
        A = YE_();
    return {
        model: K,
        sessionId: I8(),
        userType: "external",
        ..._.length > 0 && {
            betas: _
        },
        envContext: z,
        ...process.env.CLAUDE_CODE_ENTRYPOINT && {
            entrypoint: process.env.CLAUDE_CODE_ENTRYPOINT
        },
        ...process.env.CLAUDE_AGENT_SDK_VERSION && {
            agentSdkVersion: process.env.CLAUDE_AGENT_SDK_VERSION
        },
        isInteractive: String(wV()),
        clientType: ED6(),
        ...A && {
            processMetrics: A
        },
        sweBenchRunId: process.env.SWE_BENCH_RUN_ID || "",
        sweBenchInstanceId: process.env.SWE_BENCH_INSTANCE_ID || "",
        sweBenchTaskId: process.env.SWE_BENCH_TASK_ID || "",
        ...KE_(),
        ...MK() && {
            subscriptionType: MK()
        },
        ...{},
        ...Y && {
            rh: Y
        }
    }
}
// @from(Ln 165058, Col 0)
function e74(q, K, _ = {}) {
    let {
        envContext: z,
        processMetrics: Y,
        rh: A,
        kairosActive: O,
        skillMode: w,
        coachMode: $,
        observerMode: j,
        ...H
    } = q, J = {
        platform: z.platform,
        platform_raw: z.platformRaw,
        arch: z.arch,
        node_version: z.nodeVersion,
        terminal: z.terminal || "unknown",
        package_managers: z.packageManagers,
        runtimes: z.runtimes,
        is_running_with_bun: z.isRunningWithBun,
        is_ci: z.isCi,
        is_claubbit: z.isClaubbit,
        is_claude_code_remote: z.isClaudeCodeRemote,
        is_local_agent_mode: z.isLocalAgentMode,
        is_conductor: z.isConductor,
        is_github_action: z.isGithubAction,
        is_claude_code_action: z.isClaudeCodeAction,
        is_claude_ai_auth: z.isClaudeAiAuth,
        version: z.version,
        build_time: z.buildTime,
        deployment_environment: z.deploymentEnvironment
    };
    if (z.remoteEnvironmentType) J.remote_environment_type = z.remoteEnvironmentType;
    if (z.claudeCodeContainerId) J.claude_code_container_id = z.claudeCodeContainerId;
    if (z.claudeCodeRemoteSessionId) J.claude_code_remote_session_id = z.claudeCodeRemoteSessionId;
    if (z.tags) J.tags = z.tags.split(",").map((P) => P.trim()).filter(Boolean);
    if (z.githubEventName) J.github_event_name = z.githubEventName;
    if (z.githubActionsRunnerEnvironment) J.github_actions_runner_environment = z.githubActionsRunnerEnvironment;
    if (z.githubActionsRunnerOs) J.github_actions_runner_os = z.githubActionsRunnerOs;
    if (z.githubActionRef) J.github_action_ref = z.githubActionRef;
    if (z.wslVersion) J.wsl_version = z.wslVersion;
    if (z.linuxDistroId) J.linux_distro_id = z.linuxDistroId;
    if (z.linuxDistroVersion) J.linux_distro_version = z.linuxDistroVersion;
    if (z.linuxKernel) J.linux_kernel = z.linuxKernel;
    if (z.vcs) J.vcs = z.vcs;
    if (z.versionBase) J.version_base = z.versionBase;
    let X = {
        session_id: H.sessionId,
        model: H.model,
        user_type: H.userType,
        is_interactive: H.isInteractive === "true",
        client_type: H.clientType
    };
    if (H.betas) X.betas = H.betas;
    if (H.entrypoint) X.entrypoint = H.entrypoint;
    if (H.agentSdkVersion) X.agent_sdk_version = H.agentSdkVersion;
    if (H.sweBenchRunId) X.swe_bench_run_id = H.sweBenchRunId;
    if (H.sweBenchInstanceId) X.swe_bench_instance_id = H.sweBenchInstanceId;
    if (H.sweBenchTaskId) X.swe_bench_task_id = H.sweBenchTaskId;
    if (H.agentId) X.agent_id = H.agentId;
    if (H.parentSessionId) X.parent_session_id = H.parentSessionId;
    if (H.agentType) X.agent_type = H.agentType;
    if (H.teamName) X.team_name = H.teamName;
    if (K.githubActionsMetadata) {
        let P = K.githubActionsMetadata;
        J.github_actions_metadata = {
            actor_id: P.actorId,
            repository_id: P.repositoryId,
            repository_owner_id: P.repositoryOwnerId
        }
    }
    let M;
    if (K.accountUuid || K.organizationUuid) M = {
        account_uuid: K.accountUuid,
        organization_uuid: K.organizationUuid
    };
    return {
        env: J,
        ...Y && {
            process: Buffer.from(I6(Y)).toString("base64")
        },
        ...M && {
            auth: M
        },
        core: X,
        additional: {
            ...A && {
                rh: A
            },
            ...O && {
                is_assistant_mode: !0
            },
            ...w && {
                skill_mode: w
            },
            ...$ && {
                coach_mode: $
            },
            ...j && {
                observer_mode: j
            },
            ..._
        }
    }
}
// @from(Ln 165162, Col 4)
rC1
// @from(Ln 165162, Col 9)
rN_ = 512
// @from(Ln 165163, Col 4)
oN_ = 128
// @from(Ln 165164, Col 4)
o74 = 4096
// @from(Ln 165165, Col 4)
Zk8 = 20
// @from(Ln 165166, Col 4)
aN_ = 2
// @from(Ln 165167, Col 4)
sN_ = 10
// @from(Ln 165168, Col 4)
tN_
// @from(Ln 165168, Col 9)
eN_
// @from(Ln 165168, Col 14)
qE_
// @from(Ln 165168, Col 19)
_E_
// @from(Ln 165168, Col 24)
zE_
// @from(Ln 165168, Col 29)
fk8 = null
// @from(Ln 165169, Col 4)
nC1 = null
// @from(Ln 165170, Col 4)
q2 = L(() => {
    U4();
    D_();
    w46();
    pv();
    Sq();
    y8();
    Q8();
    dC1();
    Va();
    T7();
    pK();
    NK();
    mB();
    e8();
    zY();
    rC1 = new Set([QE]);
    tN_ = new Set(["rm", "mv", "cp", "touch", "mkdir", "chmod", "chown", "cat", "head", "tail", "sort", "stat", "diff", "wc", "grep", "rg", "sed"]), eN_ = /\s*(?:&&|\|\||[;|])\s*/, qE_ = /\s+/;
    _E_ = P1(() => {
        let q = {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.112",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-04-16T18:33:19Z"
        }.VERSION.match(/^\d+\.\d+\.\d+(?:-[a-z]+)?/);
        return q ? q[0] : void 0
    }), zE_ = P1(async () => {
        let [q, K, _, z] = await Promise.all([X7.getPackageManagers(), X7.getRuntimes(), Tm7(), km7()]);
        return {
            platform: ef6(),
            platformRaw: process.env.CLAUDE_CODE_HOST_PLATFORM || process.platform,
            arch: X7.arch,
            nodeVersion: X7.nodeVersion,
            terminal: UE.terminal,
            packageManagers: q.join(","),
            runtimes: K.join(","),
            isRunningWithBun: X7.isRunningWithBun(),
            isCi: S6(!1),
            isClaubbit: S6(process.env.CLAUBBIT),
            isClaudeCodeRemote: S6(process.env.CLAUDE_CODE_REMOTE),
            isLocalAgentMode: process.env.CLAUDE_CODE_ENTRYPOINT === "local-agent",
            isConductor: X7.isConductor(),
            ...process.env.CLAUDE_CODE_REMOTE_ENVIRONMENT_TYPE && {
                remoteEnvironmentType: process.env.CLAUDE_CODE_REMOTE_ENVIRONMENT_TYPE
            },
            ...process.env.CLAUDE_CODE_CONTAINER_ID && {
                claudeCodeContainerId: process.env.CLAUDE_CODE_CONTAINER_ID
            },
            ...process.env.CLAUDE_CODE_REMOTE_SESSION_ID && {
                claudeCodeRemoteSessionId: process.env.CLAUDE_CODE_REMOTE_SESSION_ID
            },
            ...process.env.CLAUDE_CODE_TAGS && {
                tags: process.env.CLAUDE_CODE_TAGS
            },
            isGithubAction: S6(process.env.GITHUB_ACTIONS),
            isClaudeCodeAction: S6(process.env.CLAUDE_CODE_ACTION),
            isClaudeAiAuth: i7(),
            version: {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.112",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-04-16T18:33:19Z"
            }.VERSION,
            versionBase: _E_(),
            buildTime: {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.112",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-04-16T18:33:19Z"
            }.BUILD_TIME,
            deploymentEnvironment: X7.detectDeploymentEnvironment(),
            ...S6(process.env.GITHUB_ACTIONS) && {
                githubEventName: process.env.GITHUB_EVENT_NAME,
                githubActionsRunnerEnvironment: process.env.RUNNER_ENVIRONMENT,
                githubActionsRunnerOs: process.env.RUNNER_OS,
                githubActionRef: process.env.GITHUB_ACTION_PATH?.includes("claude-code-action/") ? process.env.GITHUB_ACTION_PATH.split("claude-code-action/")[1] : void 0
            },
            ...EA6() && {
                wslVersion: EA6()
            },
            ..._ ?? {},
            ...z.length > 0 && {
                vcs: z.join(",")
            }
        }
    })
})
// @from(Ln 165275, Col 0)
function do6() {
    return Vk8.join(A7(), "telemetry")
}
// @from(Ln 165278, Col 0)
class aC1 {
    endpoint;
    timeout;
    maxBatchSize;
    skipAuth;
    batchDelayMs;
    baseBackoffDelayMs;
    maxBackoffDelayMs;
    maxAttempts;
    isKilled;
    pendingExports = [];
    isShutdown = !1;
    schedule;
    cancelBackoff = null;
    attempts = 0;
    isRetrying = !1;
    lastExportErrorContext;
    constructor(q = {}) {
        let K = q.baseUrl || (process.env.ANTHROPIC_BASE_URL === "https://api-staging.anthropic.com" ? "https://api-staging.anthropic.com" : "https://api.anthropic.com");
        this.endpoint = `${K}${q.path||"/api/event_logging/batch"}`, this.timeout = q.timeout || 1e4, this.maxBatchSize = q.maxBatchSize || 200, this.skipAuth = q.skipAuth ?? !1, this.batchDelayMs = q.batchDelayMs || 100, this.baseBackoffDelayMs = q.baseBackoffDelayMs || 500, this.maxBackoffDelayMs = q.maxBackoffDelayMs || 30000, this.maxAttempts = q.maxAttempts ?? 8, this.isKilled = q.isKilled ?? (() => !1), this.schedule = q.schedule ?? ((_, z) => {
            let Y = setTimeout(_, z);
            return () => clearTimeout(Y)
        }), this.retryPreviousBatches()
    }
    async getQueuedEventCount() {
        return (await this.loadEventsFromCurrentBatch()).length
    }
    getCurrentBatchFilePath() {
        return Vk8.join(do6(), `${zq4}${I8()}.${_q4}.json`)
    }
    async loadEventsFromFile(q) {
        try {
            return await eJ8(q)
        } catch {
            return []
        }
    }
    async loadEventsFromCurrentBatch() {
        return this.loadEventsFromFile(this.getCurrentBatchFilePath())
    }
    async saveEventsToFile(q, K) {
        try {
            if (K.length === 0) try {
                await Kq4(q)
            } catch {} else {
                await qq4(do6(), {
                    recursive: !0
                });
                let _ = K.map((z) => I6(z)).join(`
`) + `
`;
                await $E_(q, _, "utf8")
            }
        } catch (_) {
            j6(_)
        }
    }
    async appendEventsToFile(q, K) {
        if (K.length === 0) return;
        try {
            await qq4(do6(), {
                recursive: !0
            });
            let _ = K.map((z) => I6(z)).join(`
`) + `
`;
            await OE_(q, _, "utf8")
        } catch (_) {
            j6(_)
        }
    }
    async deleteFile(q) {
        try {
            await Kq4(q)
        } catch {}
    }
    async retryPreviousBatches() {
        try {
            let q = `${zq4}${I8()}.`,
                K;
            try {
                K = (await wE_(do6())).filter((_) => _.startsWith(q) && _.endsWith(".json")).filter((_) => !_.includes(_q4))
            } catch (_) {
                if (D5(_)) return;
                throw _
            }
            for (let _ of K) {
                let z = Vk8.join(do6(), _);
                this.retryFileInBackground(z)
            }
        } catch (q) {
            j6(q)
        }
    }
    async retryFileInBackground(q) {
        if (this.attempts >= this.maxAttempts) {
            await this.deleteFile(q);
            return
        }
        let K = await this.loadEventsFromFile(q);
        if (K.length === 0) {
            await this.deleteFile(q);
            return
        }
        let _ = await this.sendEventsInBatches(K);
        if (_.length === 0) await this.deleteFile(q);
        else await this.saveEventsToFile(q, _)
    }
    async export (q, K) {
        if (this.isShutdown) {
            K({
                code: j46.ExportResultCode.FAILED,
                error: Error("Exporter has been shutdown")
            });
            return
        }
        let _ = this.doExport(q, K);
        this.pendingExports.push(_), _.finally(() => {
            let z = this.pendingExports.indexOf(_);
            if (z > -1) this.pendingExports.splice(z, 1)
        })
    }
    async doExport(q, K) {
        try {
            let _ = q.filter((A) => A.instrumentationScope?.name === "com.anthropic.claude_code.events");
            if (_.length === 0) {
                K({
                    code: j46.ExportResultCode.SUCCESS
                });
                return
            }
            let z = this.transformLogsToEvents(_).events;
            if (z.length === 0) {
                K({
                    code: j46.ExportResultCode.SUCCESS
                });
                return
            }
            if (this.attempts >= this.maxAttempts) {
                K({
                    code: j46.ExportResultCode.FAILED,
                    error: Error(`Dropped ${z.length} events: max attempts (${this.maxAttempts}) reached`)
                });
                return
            }
            let Y = await this.sendEventsInBatches(z);
            if (this.attempts++, Y.length > 0) {
                await this.queueFailedEvents(Y), this.scheduleBackoffRetry();
                let A = this.lastExportErrorContext ? ` (${this.lastExportErrorContext})` : "";
                K({
                    code: j46.ExportResultCode.FAILED,
                    error: Error(`Failed to export ${Y.length} events${A}`)
                });
                return
            }
            if (this.resetBackoff(), await this.getQueuedEventCount() > 0 && !this.isRetrying) this.retryFailedEvents();
            K({
                code: j46.ExportResultCode.SUCCESS
            })
        } catch (_) {
            j6(_), K({
                code: j46.ExportResultCode.FAILED,
                error: r1(_)
            })
        }
    }
    async sendEventsInBatches(q) {
        let K = [];
        for (let Y = 0; Y < q.length; Y += this.maxBatchSize) K.push(q.slice(Y, Y + this.maxBatchSize));
        let _ = [],
            z;
        for (let Y = 0; Y < K.length; Y++) {
            let A = K[Y];
            try {
                await this.sendBatchWithRetry({
                    events: A
                })
            } catch (O) {
                z = jE_(O);
                for (let w = Y; w < K.length; w++) _.push(...K[w]);
                break
            }
            if (Y < K.length - 1 && this.batchDelayMs > 0) await l7(this.batchDelayMs)
        }
        if (_.length > 0 && z) this.lastExportErrorContext = z;
        return _
    }
    async queueFailedEvents(q) {
        let K = this.getCurrentBatchFilePath();
        await this.appendEventsToFile(K, q);
        let _ = this.lastExportErrorContext ? ` (${this.lastExportErrorContext})` : "";
        E(`1P event logging: ${q.length} events failed to export${_}`, {
            level: "error"
        })
    }
    scheduleBackoffRetry() {
        if (this.cancelBackoff || this.isRetrying || this.isShutdown) return;
        let q = Math.min(this.baseBackoffDelayMs * this.attempts * this.attempts, this.maxBackoffDelayMs);
        this.cancelBackoff = this.schedule(async () => {
            this.cancelBackoff = null, await this.retryFailedEvents()
        }, q)
    }
    async retryFailedEvents() {
        let q = this.getCurrentBatchFilePath();
        while (!this.isShutdown) {
            let K = await this.loadEventsFromFile(q);
            if (K.length === 0) break;
            if (this.attempts >= this.maxAttempts) {
                await this.deleteFile(q), this.resetBackoff();
                return
            }
            this.isRetrying = !0, await this.deleteFile(q);
            let _ = await this.sendEventsInBatches(K);
            if (this.attempts++, this.isRetrying = !1, _.length > 0) {
                await this.saveEventsToFile(q, _), this.scheduleBackoffRetry();
                return
            }
            this.resetBackoff()
        }
    }
    resetBackoff() {
        if (this.attempts = 0, this.cancelBackoff) this.cancelBackoff(), this.cancelBackoff = null
    }
    async sendBatchWithRetry(q) {
        if (this.isKilled()) throw Error("firstParty sink killswitch active");
        let K = {
                "Content-Type": "application/json",
                "User-Agent": yA(),
                "x-service-name": "claude-code"
            },
            _ = EA() || I7(),
            z = this.skipAuth || !_;
        if (!z && i7()) {
            let w = o7();
            if (!AD()) z = !0;
            else if (w && XQ(w.expiresAt)) z = !0
        }
        let Y = z ? {
                headers: {},
                error: "trust not established or Oauth token expired"
            } : OH(),
            A = !Y.error,
            O = A ? {
                ...K,
                ...Y.headers
            } : K;
        try {
            let w = await Z1.post(this.endpoint, q, {
                timeout: this.timeout,
                headers: O
            });
            this.logSuccess(q.events.length, A, w.data);
            return
        } catch (w) {
            if (A && Z1.isAxiosError(w) && w.response?.status === 401) {
                let $ = await Z1.post(this.endpoint, q, {
                    timeout: this.timeout,
                    headers: K
                });
                this.logSuccess(q.events.length, !1, $.data);
                return
            }
            throw w
        }
    }
    logSuccess(q, K, _) {}
    hrTimeToDate(q) {
        let [K, _] = q;
        return new Date(K * 1000 + _ / 1e6)
    }
    transformLogsToEvents(q) {
        let K = [];
        for (let _ of q) {
            let z = _.attributes || {};
            if (z.event_type === "GrowthbookExperimentEvent") {
                let W = this.hrTimeToDate(_.hrTime),
                    D = z.account_uuid,
                    Z = z.organization_uuid;
                K.push({
                    event_type: "GrowthbookExperimentEvent",
                    event_data: FC1.toJSON({
                        event_id: z.event_id,
                        timestamp: W,
                        experiment_id: z.experiment_id,
                        variation_id: z.variation_id,
                        environment: z.environment,
                        user_attributes: z.user_attributes,
                        experiment_metadata: z.experiment_metadata,
                        device_id: z.device_id,
                        session_id: z.session_id,
                        auth: D || Z ? {
                            account_uuid: D,
                            organization_uuid: Z
                        } : void 0
                    })
                });
                continue
            }
            let Y = z.event_name || _.body || "unknown",
                A = z.core_metadata,
                O = z.user_metadata,
                w = z.event_metadata || {};
            if (!A) {
                K.push({
                    event_type: "ClaudeCodeInternalEvent",
                    event_data: Wk8.toJSON({
                        event_id: z.event_id,
                        event_name: Y,
                        client_timestamp: this.hrTimeToDate(_.hrTime),
                        session_id: I8(),
                        additional_metadata: Buffer.from(I6({
                            transform_error: "core_metadata attribute is missing"
                        })).toString("base64")
                    })
                });
                continue
            }
            let $ = e74(A, O, w),
                {
                    _PROTO_skill_name: j,
                    _PROTO_plugin_name: H,
                    _PROTO_marketplace_name: J,
                    _PROTO_code: X,
                    ...M
                } = $.additional,
                P = Kw8(M);
            K.push({
                event_type: "ClaudeCodeInternalEvent",
                event_data: Wk8.toJSON({
                    event_id: z.event_id,
                    event_name: Y,
                    client_timestamp: this.hrTimeToDate(_.hrTime),
                    device_id: z.user_id,
                    email: O?.email,
                    auth: $.auth,
                    ...$.core,
                    env: $.env,
                    process: $.process,
                    skill_name: typeof j === "string" ? j : void 0,
                    plugin_name: typeof H === "string" ? H : void 0,
                    marketplace_name: typeof J === "string" ? J : void 0,
                    repl_code: typeof X === "string" ? X : void 0,
                    additional_metadata: Object.keys(P).length > 0 ? Buffer.from(I6(P)).toString("base64") : void 0
                })
            })
        }
        return {
            events: K
        }
    }
    async shutdown() {
        this.isShutdown = !0, this.resetBackoff(), await this.forceFlush()
    }
    async forceFlush() {
        await Promise.all(this.pendingExports)
    }
}
// @from(Ln 165636, Col 0)
function jE_(q) {
    if (!Z1.isAxiosError(q)) return b6(q);
    let K = [],
        _ = q.response?.headers?.["request-id"];
    if (_) K.push(`request-id=${_}`);
    if (q.response?.status) K.push(`status=${q.response.status}`);
    if (q.code) K.push(`code=${q.code}`);
    if (q.message) K.push(q.message);
    return K.join(", ")
}
// @from(Ln 165646, Col 4)
j46
// @from(Ln 165646, Col 9)
_q4
// @from(Ln 165646, Col 14)
zq4 = "1p_failed_events."
// @from(Ln 165647, Col 4)
Yq4 = L(() => {
    CK();
    y8();
    p74();
    F74();
    T7();
    h1();
    K8();
    Q8();
    m8();
    Zf();
    mO();
    U8();
    e8();
    YD();
    C8();
    q2();
    j46 = K6(t_(), 1), _q4 = AE_()
})
// @from(Ln 165667, Col 0)
function Qk6(q) {
    return Fv(HE_, {})?.[q] === !0
}
// @from(Ln 165670, Col 4)
HE_ = "tengu_frond_boric"
// @from(Ln 165671, Col 4)
sC1 = L(() => {
    B1()
})
// @from(Ln 165674, Col 4)
qb1 = {}
// @from(Ln 165689, Col 0)
function wq4() {
    return Fv(JE_, {})
}
// @from(Ln 165693, Col 0)
function tC1(q) {
    let _ = wq4()[q];
    if (!_) return null;
    let z = _.sample_rate;
    if (typeof z !== "number" || z < 0 || z > 1) return null;
    if (z >= 1) return null;
    if (z <= 0) return 0;
    return Math.random() < z ? z : 0
}
// @from(Ln 165703, Col 0)
function $q4() {
    return Fv(XE_, {})
}
// @from(Ln 165706, Col 0)
async function ka() {
    if (!H46) return;
    try {
        await H46.shutdown()
    } catch {}
}
// @from(Ln 165713, Col 0)
function Na() {
    return !A46()
}
// @from(Ln 165716, Col 0)
async function ME_(q, K, _ = {}) {
    try {
        let z = await Tk8({
                model: _.model,
                betas: _.betas
            }),
            Y = {
                event_name: K,
                event_id: Oq4(),
                core_metadata: z,
                user_metadata: Sk6(!0),
                event_metadata: _
            },
            A = $I();
        if (A) Y.user_id = A;
        q.emit({
            body: K,
            attributes: Y
        })
    } catch (z) {}
}
// @from(Ln 165738, Col 0)
function co6(q, K = {}) {
    if (!Na()) return;
    if (!J46 || Qk6("firstParty")) return;
    ME_(J46, q, K)
}
// @from(Ln 165744, Col 0)
function PE_() {
    return "production"
}
// @from(Ln 165748, Col 0)
function eC1(q) {
    if (!Na()) return;
    if (!J46 || Qk6("firstParty")) return;
    let K = $I(),
        {
            accountUuid: _,
            organizationUuid: z
        } = Sk6(!0),
        Y = {
            event_type: "GrowthbookExperimentEvent",
            event_id: Oq4(),
            experiment_id: q.experimentId,
            variation_id: q.variationId,
            ...K && {
                device_id: K
            },
            ..._ && {
                account_uuid: _
            },
            ...z && {
                organization_uuid: z
            },
            ...q.userAttributes && {
                session_id: q.userAttributes.sessionId,
                user_attributes: I6(q.userAttributes)
            },
            ...q.experimentMetadata && {
                experiment_metadata: I6(q.experimentMetadata)
            },
            environment: PE_()
        };
    J46.emit({
        body: "growthbook_experiment",
        attributes: Y
    })
}
// @from(Ln 165785, Col 0)
function Hq4() {
    if (XK("1p_event_logging_start"), !Na()) return;
    let K = $q4();
    jq4 = K, XK("1p_event_after_growthbook_config");
    let _ = K.scheduledDelayMillis || ui(process.env.OTEL_LOGS_EXPORT_INTERVAL, WE_),
        z = K.maxExportBatchSize || DE_,
        Y = K.maxQueueSize || ZE_,
        A = y1(),
        O = {
            [Nk8.ATTR_SERVICE_NAME]: "claude-code",
            [Nk8.ATTR_SERVICE_VERSION]: {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.112",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-04-16T18:33:19Z"
            }.VERSION
        };
    if (A === "wsl") {
        let j = EA6();
        if (j) O["wsl.version"] = j
    }
    let w = Aq4.resourceFromAttributes(O),
        $ = new aC1({
            maxBatchSize: z,
            skipAuth: K.skipAuth,
            maxAttempts: K.maxAttempts,
            path: K.path,
            baseUrl: K.baseUrl,
            isKilled: () => Qk6("firstParty")
        });
    H46 = new kk8.LoggerProvider({
        resource: w,
        processors: [new kk8.BatchLogRecordProcessor($, {
            scheduledDelayMillis: _,
            maxExportBatchSize: z,
            maxQueueSize: Y
        })]
    }), J46 = H46.getLogger("com.anthropic.claude_code.events", {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.112",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-04-16T18:33:19Z"
    }.VERSION)
}
// @from(Ln 165833, Col 0)
async function fE_() {
    if (!Na() || !H46) return;
    let q = $q4();
    if (f$(q, jq4)) return;
    let K = H46,
        _ = J46;
    J46 = null;
    try {
        await K.forceFlush()
    } catch {}
    H46 = null;
    try {
        Hq4()
    } catch (z) {
        H46 = K, J46 = _, j6(z);
        return
    }
    K.shutdown().catch(() => {})
}
// @from(Ln 165852, Col 4)
Aq4
// @from(Ln 165852, Col 9)
kk8
// @from(Ln 165852, Col 14)
Nk8
// @from(Ln 165852, Col 19)
JE_ = "tengu_event_sampling_config"
// @from(Ln 165853, Col 4)
XE_ = "tengu_1p_event_batch_config"
// @from(Ln 165854, Col 4)
J46 = null
// @from(Ln 165855, Col 4)
H46 = null
// @from(Ln 165856, Col 4)
jq4 = null
// @from(Ln 165857, Col 4)
WE_ = 1e4
// @from(Ln 165858, Col 4)
DE_ = 200
// @from(Ln 165859, Col 4)
ZE_ = 8192
// @from(Ln 165860, Col 4)
BB = L(() => {
    v16();
    h1();
    K8();
    Q8();
    U8();
    NK();
    e8();
    ag();
    B26();
    O46();
    Yq4();
    B1();
    q2();
    sC1();
    Aq4 = K6(Bk6(), 1), kk8 = K6(uC1(), 1), Nk8 = K6(i26(), 1)
})
// @from(Ln 165877, Col 4)
vq4 = {}
// @from(Ln 165902, Col 0)
function Jq4(q) {
    try {
        Promise.resolve(q()).catch((K) => {
            j6(K)
        })
    } catch (K) {
        j6(K)
    }
}
// @from(Ln 165912, Col 0)
function A$6(q) {
    let K = !0,
        _ = lk6.subscribe(() => Jq4(q));
    if (WI.size > 0) queueMicrotask(() => {
        if (K && WI.size > 0) Jq4(q)
    });
    return () => {
        K = !1, _()
    }
}
// @from(Ln 165923, Col 0)
function nk6() {
    if (!_b1) _b1 = !0;
    return Xq4
}
// @from(Ln 165928, Col 0)
function GE_(q) {
    let K = nk6();
    return K !== null && q in K
}
// @from(Ln 165933, Col 0)
function ik6() {
    return
}
// @from(Ln 165937, Col 0)
function vE_() {
    if (WI.size > 0) return Object.fromEntries(WI);
    return H8().cachedGrowthBookFeatures ?? {}
}
// @from(Ln 165942, Col 0)
function TE_() {
    return ik6() ?? {}
}
// @from(Ln 165946, Col 0)
function VE_(q, K) {
    return
}
// @from(Ln 165950, Col 0)
function kE_() {
    return
}
// @from(Ln 165954, Col 0)
function ro6(q) {
    if (Kb1.has(q)) return;
    let K = Y$6.get(q);
    if (K) Kb1.add(q), eC1({
        experimentId: K.experimentId,
        variationId: K.variationId,
        userAttributes: Dq4(),
        experimentMetadata: {
            feature_id: q
        }
    })
}
// @from(Ln 165966, Col 0)
async function Mq4(q) {
    let K = q.getPayload();
    if (!K?.features || Object.keys(K.features).length === 0) return !1;
    Y$6.clear();
    let _ = {};
    for (let [z, Y] of Object.entries(K.features)) {
        let A = Y;
        if ("value" in A && !("defaultValue" in A)) _[z] = {
            ...A,
            defaultValue: A.value
        };
        else _[z] = A;
        if (A.source === "experiment" && A.experimentResult) {
            let {
                experimentResult: O,
                experiment: w
            } = A;
            if (w?.key && O.variationId !== void 0) Y$6.set(z, {
                experimentId: w.key,
                variationId: O.variationId
            })
        }
    }
    await q.setPayload({
        ...K,
        features: _
    }), WI.clear();
    for (let [z, Y] of Object.entries(_)) {
        let A = "value" in Y ? Y.value : Y.defaultValue;
        if (A !== void 0) WI.set(z, A)
    }
    return !0
}
// @from(Ln 166000, Col 0)
function Pq4() {
    let q = Object.fromEntries(WI),
        K = H8();
    if (f$(K.cachedGrowthBookFeatures, q)) return;
    d8((_) => ({
        ..._,
        cachedGrowthBookFeatures: q
    }))
}
// @from(Ln 166010, Col 0)
function ya() {
    return Na()
}
// @from(Ln 166014, Col 0)
function Wq4() {
    let q = process.env.ANTHROPIC_BASE_URL;
    if (!q) return;
    try {
        let K = new URL(q).host;
        if (K === "api.anthropic.com") return;
        return K
    } catch {
        return
    }
}
// @from(Ln 166026, Col 0)
function Dq4() {
    let q = lUq(),
        K = q.email,
        _ = Wq4();
    return {
        id: q.deviceId,
        sessionId: q.sessionId,
        deviceID: q.deviceId,
        platform: q.platform,
        ..._ && {
            apiBaseUrlHost: _
        },
        ...q.organizationUuid && {
            organizationUUID: q.organizationUuid
        },
        ...q.accountUuid && {
            accountUUID: q.accountUuid
        },
        ...q.userType && {
            userType: q.userType
        },
        ...q.subscriptionType && {
            subscriptionType: q.subscriptionType
        },
        ...q.rateLimitTier && {
            rateLimitTier: q.rateLimitTier
        },
        ...q.firstTokenTime && {
            firstTokenTime: q.firstTokenTime
        },
        ...K && {
            email: K
        },
        ...q.appVersion && {
            appVersion: q.appVersion
        },
        ...q.githubActionsMetadata && {
            githubActionsMetadata: q.githubActionsMetadata
        }
    }
}
// @from(Ln 166067, Col 0)
async function Zq4(q, K, _) {
    let z = nk6();
    if (z && q in z) return z[q];
    let Y = ik6();
    if (Y && q in Y) return Y[q];
    if (!ya()) return K;
    let A = await DI();
    if (!A) return K;
    let O;
    if (WI.has(q)) O = WI.get(q);
    else O = A.getFeatureValue(q, K);
    if (_) ro6(q);
    return O
}
// @from(Ln 166081, Col 0)
async function Ek8(q, K) {
    return Zq4(q, K, !0)
}
// @from(Ln 166085, Col 0)
function u8(q, K) {
    let _ = nk6();
    if (_ && q in _) return _[q];
    let z = ik6();
    if (z && q in z) return z[q];
    if (!ya()) return K;
    if (Y$6.has(q)) ro6(q);
    else ck6.add(q);
    if (WI.has(q)) return WI.get(q);
    try {
        let Y = H8().cachedGrowthBookFeatures?.[q];
        return Y !== void 0 ? Y : K
    } catch {
        return K
    }
}
// @from(Ln 166102, Col 0)
function XD(q, K, _) {
    return u8(q, K)
}
// @from(Ln 166106, Col 0)
function Tw(q) {
    let K = nk6();
    if (K && q in K) return Boolean(K[q]);
    let _ = ik6();
    if (_ && q in _) return Boolean(_[q]);
    if (!ya()) return !1;
    if (Y$6.has(q)) ro6(q);
    else ck6.add(q);
    let z = H8(),
        Y = z.cachedGrowthBookFeatures?.[q];
    if (Y !== void 0) return Boolean(Y);
    return z.cachedStatsigGates?.[q] ?? !1
}
// @from(Ln 166119, Col 0)
async function Ab1(q) {
    let K = nk6();
    if (K && q in K) return Boolean(K[q]);
    let _ = ik6();
    if (_ && q in _) return Boolean(_[q]);
    if (!ya()) return !1;
    if (io6) await io6;
    let z = H8(),
        Y = z.cachedStatsigGates?.[q];
    if (Y !== void 0) return Boolean(Y);
    let A = z.cachedGrowthBookFeatures?.[q];
    if (A !== void 0) return Boolean(A);
    return !1
}
// @from(Ln 166133, Col 0)
async function gv(q) {
    let K = nk6();
    if (K && q in K) return Boolean(K[q]);
    let _ = ik6();
    if (_ && q in _) return Boolean(_[q]);
    if (!ya()) return !1;
    if (H8().cachedGrowthBookFeatures?.[q] === !0) {
        if (Y$6.has(q)) ro6(q);
        else ck6.add(q);
        return !0
    }
    return Zq4(q, !1, !0)
}
// @from(Ln 166147, Col 0)
function O$6() {
    if (!ya()) return;
    try {
        oo6(), lk6.emit(), io6 = DI().catch((q) => {
            return j6(r1(q)), null
        }).finally(() => {
            io6 = null
        })
    } catch (q) {
        j6(r1(q))
    }
}
// @from(Ln 166160, Col 0)
function oo6() {
    if (Ob1(), lo6) process.off("beforeExit", lo6), lo6 = null;
    if (no6) process.off("exit", no6), no6 = null;
    Ea?.destroy(), Ea = null, Yb1 = !1, io6 = null, Y$6.clear(), ck6.clear(), Kb1.clear(), WI.clear(), zb1.cache?.clear?.(), DI.cache?.clear?.(), Xq4 = null, _b1 = !1
}
// @from(Ln 166166, Col 0)
function NE_() {
    return 21600000
}
// @from(Ln 166169, Col 0)
async function fq4() {
    if (!ya()) return;
    try {
        let q = await DI();
        if (!q) return;
        if (await q.refreshFeatures({
                skipCache: !0
            }), q !== Ea) return;
        let K = await Mq4(q);
        if (q !== Ea) return;
        if (K) Pq4(), lk6.emit()
    } catch (q) {
        j6(r1(q))
    }
}
// @from(Ln 166185, Col 0)
function Gq4() {
    if (!ya()) return;
    if (z$6) clearInterval(z$6);
    if (z$6 = setInterval(() => {
            fq4()
        }, NE_()), z$6.unref?.(), !dk6) dk6 = () => {
        Ob1()
    }, process.once("beforeExit", dk6)
}
// @from(Ln 166195, Col 0)
function Ob1() {
    if (z$6) clearInterval(z$6), z$6 = null;
    if (dk6) process.removeListener("beforeExit", dk6), dk6 = null
}
// @from(Ln 166199, Col 0)
async function Kd(q, K) {
    return Ek8(q, K)
}
// @from(Ln 166203, Col 0)
function Fv(q, K) {
    return u8(q, K)
}
// @from(Ln 166206, Col 4)
Ea = null
// @from(Ln 166207, Col 4)
lo6 = null
// @from(Ln 166208, Col 4)
no6 = null
// @from(Ln 166209, Col 4)
Yb1 = !1
// @from(Ln 166210, Col 4)
Y$6
// @from(Ln 166210, Col 9)
WI
// @from(Ln 166210, Col 13)
ck6
// @from(Ln 166210, Col 18)
Kb1
// @from(Ln 166210, Col 23)
io6 = null
// @from(Ln 166211, Col 4)
lk6
// @from(Ln 166211, Col 9)
Xq4 = null
// @from(Ln 166212, Col 4)
_b1 = !1
// @from(Ln 166213, Col 4)
zb1
// @from(Ln 166213, Col 9)
DI
// @from(Ln 166213, Col 13)
z$6 = null
// @from(Ln 166214, Col 4)
dk6 = null
// @from(Ln 166215, Col 4)
B1 = L(() => {
    wu7();
    v16();
    y8();
    h1();
    K8();
    m8();
    Zf();
    U8();
    nH();
    e8();
    B26();
    BB();
    Y$6 = new Map, WI = new Map, ck6 = new Set, Kb1 = new Set, lk6 = l5();
    zb1 = P1(() => {
        if (!ya()) return null;
        let q = Dq4(),
            K = Hu7(),
            _ = "https://api.anthropic.com/",
            Y = EA() || hD6() || I7() ? OH() : {
                headers: {},
                error: "trust not established"
            },
            A = !Y.error;
        Yb1 = A;
        let O = new gH8({
            apiHost: _,
            clientKey: K,
            attributes: q,
            remoteEval: !0,
            cacheKeyAttributes: ["id", "organizationUUID"],
            ...!Y.error && {
                apiHostRequestHeaders: Y.headers
            },
            ...!1
        });
        if (Ea = O, !A) return {
            client: O,
            initialized: Promise.resolve()
        };
        let w = O.init({
            timeout: 5000
        }).then(async ($) => {
            if (Ea !== O) return;
            let j = await Mq4(O);
            if (Ea !== O) return;
            if (j) {
                for (let H of ck6) ro6(H);
                ck6.clear(), Pq4(), lk6.emit()
            }
        }).catch(($) => {});
        return lo6 = () => Ea?.destroy(), no6 = () => Ea?.destroy(), process.on("beforeExit", lo6), process.on("exit", no6), {
            client: O,
            initialized: w
        }
    }), DI = P1(async () => {
        let q = zb1();
        if (!q) return null;
        if (!Yb1) {
            if (EA() || hD6() || I7()) {
                if (!OH().error) {
                    if (oo6(), q = zb1(), !q) return null
                }
            }
        }
        return await q.initialized, Gq4(), q.client
    })
})
// @from(Ln 166293, Col 0)
function x3() {
    if (Qg()) return !1;
    let q = process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY;
    if (S6(q)) return !1;
    if (c5(q)) return !0;
    if (S6(process.env.CLAUDE_CODE_SIMPLE)) return !1;
    if (S6(process.env.CLAUDE_CODE_REMOTE) && !process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) return !1;
    let K = v7();
    if (K.autoMemoryEnabled !== void 0) return K.autoMemoryEnabled;
    return !0
}
// @from(Ln 166305, Col 0)
function Lk8() {
    if (!u8("tengu_passport_quail", !1)) return !1;
    return !I7() || u8("tengu_slate_thimble", !1)
}
// @from(Ln 166310, Col 0)
function X46() {
    if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) return process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR;
    return A7()
}
// @from(Ln 166315, Col 0)
function RE_() {
    return wH() ? hE_ : LE_
}
// @from(Ln 166319, Col 0)
function wH() {
    return u8("tengu_billiard_aviary", !1)
}
// @from(Ln 166323, Col 0)
function Vq4(q, K) {
    if (!q) return;
    let _ = q;
    if (K && (_.startsWith("~/") || _.startsWith("~\\"))) {
        let Y = _.slice(2),
            A = wb1(Y || ".");
        if (A === "." || A === "..") return;
        _ = yk8(EE_(), Y)
    }
    let z = wb1(_).replace(/[/\\]+$/, "");
    if (!yE_(z) || z.length < 3 || /^[A-Za-z]:$/.test(z) || z.startsWith("\\\\") || z.startsWith("//") || z.includes("\x00")) return;
    return (z + Tq4).normalize("NFC")
}
// @from(Ln 166337, Col 0)
function kq4() {
    return Vq4(process.env.CLAUDE_COWORK_MEMORY_PATH_OVERRIDE, !1)
}
// @from(Ln 166341, Col 0)
function CE_() {
    let q = E1("policySettings")?.autoMemoryDirectory ?? E1("flagSettings")?.autoMemoryDirectory ?? E1("localSettings")?.autoMemoryDirectory ?? E1("userSettings")?.autoMemoryDirectory;
    return Vq4(q, !0)
}
// @from(Ln 166346, Col 0)
function hk8() {
    return kq4() !== void 0
}
// @from(Ln 166350, Col 0)
function bE_() {
    return zj(c9()) ?? c9()
}
// @from(Ln 166354, Col 0)
function Rk8() {
    return yk8(Nw(), SE_)
}
// @from(Ln 166358, Col 0)
function YR(q) {
    return wb1(q).startsWith(Nw())
}
// @from(Ln 166361, Col 4)
LE_ = "memory"
// @from(Ln 166362, Col 4)
hE_ = "tiny_memory"
// @from(Ln 166363, Col 4)
SE_ = "MEMORY.md"
// @from(Ln 166364, Col 4)
Nw
// @from(Ln 166365, Col 4)
VY = L(() => {
    U4();
    y8();
    B1();
    Q8();
    pK();
    b9();
    a1();
    Nw = P1(() => {
        let q = kq4() ?? CE_();
        if (q) return q;
        let K = yk8(X46(), "projects");
        return (yk8(K, AP(bE_()), RE_()) + Tq4).normalize("NFC")
    }, () => `${c9()}|${wH()}`)
})
// @from(Ln 166380, Col 4)
Sk8
// @from(Ln 166380, Col 9)
Ck8
// @from(Ln 166380, Col 14)
Nq4
// @from(Ln 166381, Col 4)
$b1 = L(() => {
    Sk8 = ["auto", "iterm2", "iterm2_with_bell", "terminal_bell", "kitty", "ghostty", "notifications_disabled"], Ck8 = ["normal", "vim"], Nq4 = ["auto", "tmux", "in-process"]
})
// @from(Ln 166384, Col 4)
P46 = {}
// @from(Ln 166432, Col 0)
function La() {
    return {
        numStartups: 0,
        installMethod: void 0,
        autoUpdates: void 0,
        theme: "dark",
        preferredNotifChannel: "auto",
        verbose: !1,
        editorMode: "normal",
        autoCompactEnabled: !0,
        autoScrollEnabled: !0,
        showTurnDuration: !0,
        externalEditorContext: !1,
        hasSeenTasksHint: !1,
        hasUsedStash: !1,
        hasUsedBackgroundTask: !1,
        queuedCommandUpHintCount: 0,
        diffTool: "auto",
        customApiKeyResponses: {
            approved: [],
            rejected: []
        },
        env: {},
        tipsHistory: {},
        memoryUsageCount: 0,
        promptQueueUseCount: 0,
        btwUseCount: 0,
        todoFeatureEnabled: !0,
        showExpandedTodos: !1,
        briefTranscript: !1,
        messageIdleNotifThresholdMs: 60000,
        autoConnectIde: !1,
        autoInstallIdeExtension: !0,
        fileCheckpointingEnabled: !0,
        terminalProgressBarEnabled: !0,
        cachedStatsigGates: {},
        cachedDynamicConfigs: {},
        cachedGrowthBookFeatures: {},
        respectGitignore: !0,
        copyFullResponse: !1,
        unpinOpus47LaunchEffort: !1
    }
}
// @from(Ln 166476, Col 0)
function mE_(q) {
    return Lq4.includes(q)
}
// @from(Ln 166480, Col 0)
function BE_() {
    Rq4 = !1
}
// @from(Ln 166484, Col 0)
function EA() {
    return Rq4 ||= pE_()
}
// @from(Ln 166488, Col 0)
function pE_() {
    if (S6(process.env.CLAUDE_CODE_SANDBOXED)) return !0;
    if (hD6()) return !0;
    if (BT6()) return !0;
    let q = H8(),
        K = Bk8();
    if (q.projects?.[K]?.hasTrustDialogAccepted) return !0;
    let z = R16(b8());
    while (!0) {
        if (q.projects?.[z]?.hasTrustDialogAccepted) return !0;
        let A = R16(so6(z, ".."));
        if (A === z) break;
        z = A
    }
    return !1
}
// @from(Ln 166505, Col 0)
function FE_(q) {
    let K = H8(),
        _ = R16(so6(q));
    while (!0) {
        if (K.projects?.[_]?.hasTrustDialogAccepted) return !0;
        let z = R16(so6(_, ".."));
        if (z === _) return !1;
        _ = z
    }
}
// @from(Ln 166516, Col 0)
function gE_(q) {
    let K = R16(so6(q));
    d8((_) => {
        if (_.projects?.[K]?.hasTrustDialogAccepted) return _;
        return {
            ..._,
            projects: {
                ..._.projects,
                [K]: {
                    ..._.projects?.[K] ?? rk6,
                    hasTrustDialogAccepted: !0
                }
            }
        }
    })
}
// @from(Ln 166533, Col 0)
function UE_(q) {
    return hq4.includes(q)
}
// @from(Ln 166537, Col 0)
function mk8(q) {
    let K = _d.config;
    if (!K) return !1;
    let _ = K.oauthAccount !== void 0 && q.oauthAccount === void 0,
        z = K.hasCompletedOnboarding === !0 && q.hasCompletedOnboarding !== !0;
    return _ || z
}
// @from(Ln 166545, Col 0)
function d8(q) {
    let K = null;
    try {
        if (Cq4(QZ(), La, (z) => {
                let Y = q(z);
                if (Y === z) return z;
                return K = Ik8({
                    ...Y,
                    projects: Eq4(z.projects)
                }), K
            }) && K) xk8(K)
    } catch (_) {
        E(`Failed to save config with lock: ${_}`, {
            level: "error"
        });
        let z = w$6(QZ(), La);
        if (mk8(z)) {
            E("saveGlobalConfig fallback: re-read config is missing auth that cache has; refusing to write. See GH #3117.", {
                level: "error"
            }), d("tengu_config_auth_loss_prevented", {});
            return
        }
        let Y = q(z);
        if (Y === z) return;
        K = Ik8({
            ...Y,
            projects: Eq4(z.projects)
        }), Sq4(QZ(), K, uk8), xk8(K)
    }
}
// @from(Ln 166576, Col 0)
function QE_() {
    let q = ao6 + bk8;
    if (q > 0) d("tengu_config_cache_stats", {
        cache_hits: ao6,
        cache_misses: bk8,
        hit_rate: ao6 / q
    });
    ao6 = 0, bk8 = 0
}
// @from(Ln 166586, Col 0)
function Xb1(q) {
    if (q.installMethod !== void 0) return q;
    let K = q,
        _ = "unknown",
        z = q.autoUpdates ?? !0;
    switch (K.autoUpdaterStatus) {
        case "migrated":
            _ = "local";
            break;
        case "installed":
            _ = "native";
            break;
        case "disabled":
            z = !1;
            break;
        case "enabled":
        case "no_permissions":
        case "not_configured":
            _ = "global";
            break;
        case void 0:
            break
    }
    return {
        ...q,
        installMethod: _,
        autoUpdates: z
    }
}
// @from(Ln 166616, Col 0)
function Ik8(q) {
    let K = q;
    if (K.opus1mMergeNoticeSeenCount === void 0 && K.voiceNoticeSeenCount === void 0) return q;
    let {
        opus1mMergeNoticeSeenCount: _,
        voiceNoticeSeenCount: z,
        ...Y
    } = K;
    return Y
}
// @from(Ln 166627, Col 0)
function Eq4(q) {
    if (!q) return q;
    let K = {},
        _ = !1;
    for (let [z, Y] of Object.entries(q)) {
        let A = Y;
        if (A.history !== void 0) {
            _ = !0;
            let {
                history: O,
                ...w
            } = A;
            K[z] = w
        } else K[z] = Y
    }
    return _ ? K : q
}
// @from(Ln 166645, Col 0)
function cE_() {
    if (Hb1) return;
    Hb1 = !0;
    let q = QZ();
    uE_(q, {
        interval: dE_,
        persistent: !1
    }, (K) => {
        if (K.mtimeMs <= _d.mtime) return;
        V8().readFile(q, {
            encoding: "utf-8"
        }).then((_) => {
            if (K.mtimeMs <= _d.mtime) return;
            let z = k5(XU(_));
            if (z === null || typeof z !== "object") return;
            _d = {
                config: Xb1({
                    ...La(),
                    ...z
                }),
                mtime: K.mtimeMs
            }, M46 = {
                mtime: K.mtimeMs,
                size: K.size
            }
        }).catch(() => {})
    }), eq(async () => {
        xE_(q), Hb1 = !1
    })
}
// @from(Ln 166676, Col 0)
function xk8(q) {
    _d = {
        config: q,
        mtime: Date.now()
    }, M46 = null
}
// @from(Ln 166683, Col 0)
function H8() {
    if (_d.config) return ao6++, _d.config;
    bk8++;
    try {
        let q = null;
        try {
            q = V8().statSync(QZ())
        } catch {}
        let K = Xb1(w$6(QZ(), La));
        return _d = {
            config: K,
            mtime: q?.mtimeMs ?? Date.now()
        }, M46 = q ? {
            mtime: q.mtimeMs,
            size: q.size
        } : null, cE_(), K
    } catch {
        return Xb1(w$6(QZ(), La))
    }
}
// @from(Ln 166704, Col 0)
function zd() {
    let q = H8().remoteControlAtStartup;
    if (q !== void 0) return q;
    return !1
}
// @from(Ln 166710, Col 0)
function to6(q) {
    let K = H8();
    if (K.customApiKeyResponses?.approved?.includes(q)) return "approved";
    if (K.customApiKeyResponses?.rejected?.includes(q)) return "rejected";
    return "new"
}
// @from(Ln 166717, Col 0)
function Sq4(q, K, _) {
    let z = Wb1(q);
    V8().mkdirSync(z);
    let A = QC(K, (O, w) => I6(O) !== I6(_[w]));
    Uf6(q, I6(A, null, 2), {
        encoding: "utf-8",
        mode: 384
    })
}
// @from(Ln 166727, Col 0)
function Cq4(q, K, _) {
    let z = K(),
        Y = Wb1(q),
        A = V8();
    A.mkdirSync(Y);
    let O;
    try {
        let w = `${q}.lock`,
            $ = Date.now();
        O = DUq(q, {
            lockfilePath: w,
            onCompromised: (M) => {
                E(`Config lock compromised: ${M}`, {
                    level: "error"
                })
            }
        });
        let j = Date.now() - $;
        if (j > 100) E("Lock acquisition took longer than expected - another Claude instance may be running"), d("tengu_config_lock_contention", {
            lock_time_ms: j
        });
        if (M46 && q === QZ()) try {
            let M = A.statSync(q);
            if (M.mtimeMs !== M46.mtime || M.size !== M46.size) d("tengu_config_stale_write", {
                read_mtime: M46.mtime,
                write_mtime: M.mtimeMs,
                read_size: M46.size,
                write_size: M.size
            })
        } catch (M) {
            if (Q1(M) !== "ENOENT") throw M
        }
        let H = w$6(q, K);
        if (q === QZ() && mk8(H)) return E("saveConfigWithLock: re-read config is missing auth that cache has; refusing to write to avoid wiping ~/.claude.json. See GH #3117.", {
            level: "error"
        }), d("tengu_config_auth_loss_prevented", {}), !1;
        let J = _(H);
        if (J === H) return !1;
        let X = QC(J, (M, P) => I6(M) !== I6(z[P]));
        try {
            let M = Pb1(q),
                P = Db1();
            try {
                A.mkdirSync(P)
            } catch (k) {
                if (Q1(k) !== "EEXIST") throw k
            }
            let W = 60000,
                D = A.readdirStringSync(P).filter((k) => k.startsWith(`${M}.backup.`)).sort().reverse(),
                Z = D[0],
                G = Z ? Number(Z.split(".backup.").pop()) : 0,
                f = Number.isNaN(G) || Date.now() - G >= W;
            if (f) {
                let k = AR(P, `${M}.backup.${Date.now()}`);
                A.copyFileSync(q, k)
            }
            let v = 5,
                V = f ? A.readdirStringSync(P).filter((k) => k.startsWith(`${M}.backup.`)).sort().reverse() : D;
            for (let k of V.slice(v)) try {
                A.unlinkSync(AR(P, k))
            } catch {}
        } catch (M) {
            if (Q1(M) !== "ENOENT") E(`Failed to backup config: ${M}`, {
                level: "error"
            })
        }
        return Uf6(q, I6(X, null, 2), {
            encoding: "utf-8",
            mode: 384
        }), !0
    } finally {
        if (O) O()
    }
}
// @from(Ln 166802, Col 0)
function $$6() {
    if (Mb1) return;
    let q = Date.now();
    j1("info", "enable_configs_started"), Mb1 = !0, w$6(QZ(), La, !0), j1("info", "enable_configs_completed", {
        duration_ms: Date.now() - q
    })
}
// @from(Ln 166810, Col 0)
function Db1() {
    return AR(A7(), "backups")
}
// @from(Ln 166814, Col 0)
function yq4(q) {
    let K = V8(),
        _ = Pb1(q),
        z = Db1();
    try {
        let O = K.readdirStringSync(z).filter((w) => w.startsWith(`${_}.backup.`)).sort().at(-1);
        if (O) return AR(z, O)
    } catch {}
    let Y = Wb1(q);
    try {
        let O = K.readdirStringSync(Y).filter(($) => $.startsWith(`${_}.backup.`)).sort().at(-1);
        if (O) return AR(Y, O);
        let w = `${q}.backup`;
        try {
            return K.statSync(w), w
        } catch {}
    } catch {}
    return null
}
// @from(Ln 166834, Col 0)
function w$6(q, K, _) {
    if (!Mb1) throw Error("Config accessed before allowed.");
    let z = V8();
    try {
        let Y = z.readFileSync(q, {
            encoding: "utf-8"
        });
        try {
            let A = n8(XU(Y));
            return {
                ...K(),
                ...A
            }
        } catch (A) {
            let O = A instanceof Error ? A.message : String(A);
            throw new HV(O, q, K())
        }
    } catch (Y) {
        if (Q1(Y) === "ENOENT") {
            let O = yq4(q);
            if (O) process.stderr.write(`
Claude configuration file not found at: ${q}
A backup file exists at: ${O}
You can manually restore it by running: cp "${O}" "${q}"

`);
            return K()
        }
        if (Y instanceof HV && _) throw Y;
        if (Y instanceof HV) {
            if (E(`Config file corrupted, resetting to defaults: ${Y.message}`, {
                    level: "error"
                }), !jb1) {
                jb1 = !0;
                try {
                    j6(Y);
                    let M = !1;
                    try {
                        z.statSync(`${q}.backup`), M = !0
                    } catch {}
                    d("tengu_config_parse_error", {
                        has_backup: M
                    })
                } finally {
                    jb1 = !1
                }
            }
            process.stderr.write(`
Claude configuration file at ${q} is corrupted: ${Y.message}
`);
            let O = Pb1(q),
                w = Db1();
            try {
                z.mkdirSync(w)
            } catch (M) {
                if (Q1(M) !== "EEXIST") throw M
            }
            let $ = z.readdirStringSync(w).filter((M) => M.startsWith(`${O}.corrupted.`)),
                j, H = !1,
                J = z.readFileSync(q, {
                    encoding: "utf-8"
                });
            for (let M of $) try {
                let P = z.readFileSync(AR(w, M), {
                    encoding: "utf-8"
                });
                if (J === P) {
                    H = !0;
                    break
                }
            } catch {}
            if (!H) {
                j = AR(w, `${O}.corrupted.${Date.now()}`);
                try {
                    z.copyFileSync(q, j), E(`Corrupted config backed up to: ${j}`, {
                        level: "error"
                    })
                } catch {}
            }
            let X = yq4(q);
            if (j) process.stderr.write(`The corrupted file has been backed up to: ${j}
`);
            else if (H) process.stderr.write(`The corrupted file has already been backed up.
`);
            if (X) process.stderr.write(`A backup file exists at: ${X}
You can manually restore it by running: cp "${X}" "${q}"

`);
            else process.stderr.write(`
`)
        }
        return K()
    }
}
// @from(Ln 166929, Col 0)
function Ew() {
    let q = Bk8(),
        K = H8();
    if (!K.projects) return rk6;
    let _ = K.projects[q] ?? rk6;
    if (typeof _.allowedTools === "string") _.allowedTools = k5(_.allowedTools) ?? [];
    return _
}
// @from(Ln 166938, Col 0)
function u2(q) {
    let K = Bk8(),
        _ = null;
    try {
        if (Cq4(QZ(), La, (Y) => {
                let A = Y.projects?.[K] ?? rk6,
                    O = q(A);
                if (O === A) return Y;
                return _ = Ik8({
                    ...Y,
                    projects: {
                        ...Y.projects,
                        [K]: O
                    }
                }), _
            }) && _) xk8(_)
    } catch (z) {
        E(`Failed to save config with lock: ${z}`, {
            level: "error"
        });
        let Y = w$6(QZ(), La);
        if (mk8(Y)) {
            E("saveCurrentProjectConfig fallback: re-read config is missing auth that cache has; refusing to write. See GH #3117.", {
                level: "error"
            }), d("tengu_config_auth_loss_prevented", {});
            return
        }
        let A = Y.projects?.[K] ?? rk6,
            O = q(A);
        if (O === A) return;
        _ = Ik8({
            ...Y,
            projects: {
                ...Y.projects,
                [K]: O
            }
        }), Sq4(QZ(), _, uk8), xk8(_)
    }
}
// @from(Ln 166978, Col 0)
function Yd() {
    return j$6() !== null
}
// @from(Ln 166982, Col 0)
function ok6() {
    return Yd() && !S6(process.env.FORCE_AUTOUPDATE_PLUGINS)
}
// @from(Ln 166986, Col 0)
function eo6(q) {
    switch (q.type) {
        case "development":
            return "development build";
        case "env":
            return `set by env: ${q.envVar}`;
        case "config":
            return "config"
    }
}
// @from(Ln 166997, Col 0)
function j$6() {
    if (S6(process.env.DISABLE_AUTOUPDATER)) return {
        type: "env",
        envVar: "DISABLE_AUTOUPDATER"
    };
    let q = du7();
    if (q) return {
        type: "env",
        envVar: q
    };
    let K = H8();
    if (K.autoUpdates === !1 && (K.installMethod !== "native" || K.autoUpdatesProtectedForNative !== !0)) return {
        type: "config"
    };
    return null
}
// @from(Ln 167014, Col 0)
function $I() {
    let q = H8();
    if (q.userID) return q.userID;
    if (Jb1) return Jb1;
    let K = IE_(32).toString("hex");
    Jb1 = K;
    try {
        d8((_) => ({
            ..._,
            userID: K
        }))
    } catch (_) {
        E(`getOrCreateUserID: could not persist userID: ${_}`, {
            level: "error"
        })
    }
    return K
}
// @from(Ln 167033, Col 0)
function Zb1() {
    if (!H8().firstStartTime) {
        let K = new Date().toISOString();
        d8((_) => ({
            ..._,
            firstStartTime: _.firstStartTime ?? K
        }))
    }
}
// @from(Ln 167043, Col 0)
function H$6(q) {
    let K = Y7();
    switch (q) {
        case "User":
            return AR(A7(), "CLAUDE.md");
        case "Local":
            return AR(K, "CLAUDE.local.md");
        case "Project":
            return AR(K, "CLAUDE.md");
        case "Managed":
            return AR(SW(), "CLAUDE.md");
        case "AutoMem":
            return Rk8()
    }
}
// @from(Ln 167059, Col 0)
function pk8() {
    return AR(SW(), ".claude", "rules")
}
// @from(Ln 167063, Col 0)
function Fk8() {
    return AR(A7(), "rules")
}
// @from(Ln 167067, Col 0)
function iE_(q) {
    _d.config = q, _d.mtime = q ? Date.now() : 0
}
// @from(Ln 167070, Col 4)
jb1 = !1
// @from(Ln 167071, Col 4)
rk6
// @from(Ln 167071, Col 9)
uk8
// @from(Ln 167071, Col 14)
Lq4
// @from(Ln 167071, Col 19)
hq4
// @from(Ln 167071, Col 24)
Rq4 = !1
// @from(Ln 167072, Col 4)
bsO
// @from(Ln 167072, Col 9)
IsO
// @from(Ln 167072, Col 14)
_d
// @from(Ln 167072, Col 18)
M46 = null
// @from(Ln 167073, Col 4)
ao6 = 0
// @from(Ln 167074, Col 4)
bk8 = 0
// @from(Ln 167075, Col 4)
dE_ = 1000
// @from(Ln 167076, Col 4)
Hb1 = !1
// @from(Ln 167077, Col 4)
Mb1 = !1
// @from(Ln 167078, Col 4)
Bk8
// @from(Ln 167078, Col 9)
Jb1 = null
// @from(Ln 167079, Col 4)
lE_
// @from(Ln 167079, Col 9)
nE_
// @from(Ln 167080, Col 4)
h1 = L(() => {
    U4();
    Xf6();
    y8();
    VY();
    C8();
    n7();
    R9();
    wf();
    K8();
    VA();
    D_();
    Q8();
    m8();
    eK();
    Yq();
    pK();
    mO();
    U8();
    b9();
    G$();
    Rm();
    e8();
    $b1();
    rk6 = {
        allowedTools: [],
        mcpContextUris: [],
        mcpServers: {},
        enabledMcpjsonServers: [],
        disabledMcpjsonServers: [],
        hasTrustDialogAccepted: !1,
        projectOnboardingSeenCount: 0,
        hasClaudeMdExternalIncludesApproved: !1,
        hasClaudeMdExternalIncludesWarningShown: !1
    };
    uk8 = La(), Lq4 = ["apiKeyHelper", "installMethod", "autoUpdates", "autoUpdatesProtectedForNative", "theme", "verbose", "preferredNotifChannel", "shiftEnterKeyBindingInstalled", "editorMode", "hasUsedBackslashReturn", "autoCompactEnabled", "autoScrollEnabled", "showTurnDuration", "externalEditorContext", "diffTool", "env", "tipsHistory", "todoFeatureEnabled", "showExpandedTodos", "briefTranscript", "messageIdleNotifThresholdMs", "autoConnectIde", "autoInstallIdeExtension", "fileCheckpointingEnabled", "terminalProgressBarEnabled", "showStatusInTerminalTab", "taskCompleteNotifEnabled", "inputNeededNotifEnabled", "agentPushNotifEnabled", "respectGitignore", "claudeInChromeDefaultEnabled", "hasCompletedClaudeInChromeOnboarding", "lspRecommendationDisabled", "lspRecommendationNeverPlugins", "lspRecommendationIgnoredCount", "copyFullResponse", "copyOnSelect", "permissionExplainerEnabled", "prStatusFooterEnabled", "remoteControlAtStartup", "remoteDialogSeen", "loopAutoEnabled"];
    hq4 = ["allowedTools", "hasTrustDialogAccepted", "hasCompletedProjectOnboarding"];
    bsO = {
        ...uk8,
        autoUpdates: !1
    }, IsO = {
        ...rk6
    };
    _d = {
        config: null,
        mtime: 0
    };
    eq(async () => {
        QE_()
    });
    Bk8 = P1(() => {
        let q = Y7(),
            K = zj(q);
        if (K) return R16(K);
        return R16(so6(q))
    });
    lE_ = w$6, nE_ = mk8
})
// @from(Ln 167138, Col 4)
xq4 = {}
// @from(Ln 167148, Col 0)
function bq4(q) {
    return q.replace(/[A-Z]/g, (K) => `_${K.toLowerCase()}`)
}
// @from(Ln 167151, Col 0)
async function fb1() {
    if (qa6.length === 0) return;
    let q = qa6;
    qa6 = [];
    try {
        await Z1.post(oE_, q, {
            headers: {
                "Content-Type": "application/json",
                "DD-API-KEY": aE_
            },
            timeout: eE_
        })
    } catch (K) {
        j6(K)
    }
}
// @from(Ln 167168, Col 0)
function _y_() {
    if (ha) return;
    ha = setTimeout(() => {
        ha = null, fb1()
    }, Ay_()).unref()
}
// @from(Ln 167174, Col 0)
async function Ra() {
    if (ha) clearTimeout(ha), ha = null;
    await fb1()
}
// @from(Ln 167178, Col 0)
async function Gb1(q, K) {
    if (pq() !== "firstParty") return;
    let _ = gk8;
    if (_ === null) _ = await Iq4();
    if (!_ || !qy_.has(q)) return;
    try {
        let z = await Tk8({
                model: K.model,
                betas: K.betas
            }),
            {
                envContext: Y,
                ...A
            } = z,
            O = {
                ...A,
                ...Y,
                ...K,
                userBucket: Yy_()
            };
        if (typeof O.toolName === "string" && O.toolName.startsWith("mcp__")) O.toolName = "mcp";
        if (typeof O.model === "string") {
            let H = o5(O.model.replace(/\[1m]$/i, ""));
            O.model = H in gZ8 ? H : "other"
        }
        if (typeof O.version === "string") O.version = O.version.replace(/^(\d+\.\d+\.\d+-dev\.\d{8})\.t\d+\.sha[a-f0-9]+$/, "$1");
        if (O.status !== void 0 && O.status !== null) {
            let H = String(O.status);
            O.http_status = H;
            let J = H.charAt(0);
            if (J >= "1" && J <= "5") O.http_status_range = `${J}xx`;
            delete O.status
        }
        let w = O,
            j = {
                ddsource: "nodejs",
                ddtags: [`event:${q}`, ...Ky_.filter((H) => w[H] !== void 0 && w[H] !== null).map((H) => `${bq4(H)}:${w[H]}`)].join(","),
                message: q,
                service: "claude-code",
                hostname: "claude-code",
                env: "external"
            };
        for (let [H, J] of Object.entries(O))
            if (J !== void 0 && J !== null) j[bq4(H)] = J;
        if (qa6.push(j), qa6.length >= tE_) {
            if (ha) clearTimeout(ha), ha = null;
            fb1()
        } else _y_()
    } catch (z) {
        j6(z)
    }
}
// @from(Ln 167231, Col 0)
function Ay_() {
    return parseInt(process.env.CLAUDE_CODE_DATADOG_FLUSH_INTERVAL_MS || "", 10) || sE_
}
// @from(Ln 167234, Col 4)
oE_ = "https://http-intake.logs.us5.datadoghq.com/api/v2/logs"
// @from(Ln 167235, Col 4)
aE_ = "pubea5604404508cdd34afb69e6f42a05bc"
// @from(Ln 167236, Col 4)
sE_ = 15000
// @from(Ln 167237, Col 4)
tE_ = 100
// @from(Ln 167238, Col 4)
eE_ = 5000
// @from(Ln 167239, Col 4)
qy_
// @from(Ln 167239, Col 9)
Ky_
// @from(Ln 167239, Col 14)
qa6
// @from(Ln 167239, Col 19)
ha = null
// @from(Ln 167240, Col 4)
gk8 = null
// @from(Ln 167241, Col 4)
Iq4
// @from(Ln 167241, Col 9)
zy_ = 30
// @from(Ln 167242, Col 4)
Yy_
// @from(Ln 167243, Col 4)
J$6 = L(() => {
    CK();
    U4();
    h1();
    U8();
    Sq();
    x9();
    fo();
    O46();
    q2();
    qy_ = new Set(["chrome_bridge_connection_succeeded", "chrome_bridge_connection_failed", "chrome_bridge_disconnected", "chrome_bridge_tool_call_completed", "chrome_bridge_tool_call_error", "chrome_bridge_tool_call_started", "chrome_bridge_tool_call_timeout", "tengu_api_error", "tengu_api_success", "tengu_brief_mode_enabled", "tengu_brief_mode_toggled", "tengu_brief_send", "tengu_cancel", "tengu_compact_failed", "tengu_exit", "tengu_flicker", "tengu_headless_mcp_prewait", "tengu_init", "tengu_mcp_tools_refreshed_mid_turn", "tengu_model_fallback_triggered", "tengu_oauth_error", "tengu_oauth_success", "tengu_oauth_token_refresh_failure", "tengu_oauth_token_refresh_success", "tengu_oauth_token_refresh_lock_acquiring", "tengu_oauth_token_refresh_lock_acquired", "tengu_oauth_token_refresh_starting", "tengu_oauth_token_refresh_completed", "tengu_oauth_token_refresh_lock_releasing", "tengu_oauth_token_refresh_lock_released", "tengu_query_error", "tengu_sdk_control_roundtrip", "tengu_sdk_init_handshake", "tengu_sdk_result", "tengu_sdk_schema_violation", "tengu_sdk_session_crash", "tengu_sdk_stall", "tengu_sdk_ttft", "tengu_session_file_read", "tengu_started", "tengu_tool_use_error", "tengu_tool_use_granted_in_prompt_permanent", "tengu_tool_use_granted_in_prompt_temporary", "tengu_tool_use_rejected_in_prompt", "tengu_tool_use_success", "tengu_uncaught_exception", "tengu_unhandled_rejection", "tengu_voice_recording_started", "tengu_voice_toggled", "tengu_vscode_sdk_stream_ended_no_result", "tengu_team_mem_sync_pull", "tengu_team_mem_sync_push", "tengu_team_mem_sync_started", "tengu_team_mem_entries_capped", "tengu_timer"]), Ky_ = ["arch", "clientType", "entrypoint", "errorType", "http_status_range", "http_status", "kairosActive", "model", "platform", "provider", "skillMode", "coachMode", "subscriptionType", "toolName", "userBucket", "userType", "version", "versionBase"];
    qa6 = [];
    Iq4 = P1(async () => {
        if (A46()) return gk8 = !1, !1;
        try {
            return gk8 = !0, !0
        } catch (q) {
            return j6(q), gk8 = !1, !1
        }
    });
    Yy_ = P1(() => {
        let q = $I(),
            K = rE_("sha256").update(q).digest("hex");
        return parseInt(K.slice(0, 8), 16) % zy_
    })
})
// @from(Ln 167270, Col 0)
function Oy_() {
    if (Qk6("datadog")) return !1;
    if (vb1 !== void 0) return vb1;
    try {
        return Tw(uq4)
    } catch {
        return !1
    }
}
// @from(Ln 167280, Col 0)
function mq4(q, K) {
    let _ = tC1(q);
    if (_ === 0) return;
    let z = _ !== null ? {
        ...K,
        sample_rate: _
    } : K;
    if (Oy_()) Gb1(q, Kw8(z));
    co6(q, z)
}
// @from(Ln 167291, Col 0)
function wy_(q, K) {
    return mq4(q, K), Promise.resolve()
}
// @from(Ln 167295, Col 0)
function Bq4() {
    vb1 = Tw(uq4)
}
// @from(Ln 167299, Col 0)
function ak6() {
    of7({
        logEvent: mq4,
        logEventAsync: wy_
    })
}
// @from(Ln 167305, Col 4)
uq4 = "tengu_log_datadog_events"
// @from(Ln 167306, Col 4)
vb1 = void 0
// @from(Ln 167307, Col 4)
Ka6 = L(() => {
    J$6();
    BB();
    B1();
    C8();
    sC1()
})
// @from(Ln 167315, Col 0)
function Qk8(q) {
    if (pq() === "vertex") return Tb1;
    if (q?.isNonInteractive) {
        if (q.hasAppendSystemPrompt) return pq4;
        return Fq4
    }
    return Tb1
}
// @from(Ln 167324, Col 0)
function dk8(q) {
    if (c5(process.env.CLAUDE_CODE_ATTRIBUTION_HEADER)) return "";
    let K = `${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.VERSION}.${q}`,
        _ = process.env.CLAUDE_CODE_ENTRYPOINT ?? "unknown",
        z = pq(),
        A = !(z === "bedrock" || z === "anthropicAws" || z === "mantle") ? " cch=00000;" : "",
        O = FV8(),
        w = O ? ` cc_workload=${O};` : "",
        $ = `x-anthropic-billing-header: cc_version=${K}; cc_entrypoint=${_};${A}${w}`;
    return E(`attribution header ${$}`), $
}
// @from(Ln 167335, Col 4)
Tb1 = "You are Claude Code, Anthropic's official CLI for Claude."
// @from(Ln 167336, Col 4)
pq4 = "You are Claude Code, Anthropic's official CLI for Claude, running within the Claude Agent SDK."
// @from(Ln 167337, Col 4)
Fq4 = "You are a Claude agent, built on Anthropic's Claude Agent SDK."
// @from(Ln 167338, Col 4)
$y_
// @from(Ln 167338, Col 9)
Uk8
// @from(Ln 167339, Col 4)
ck8 = L(() => {
    K8();
    Q8();
    x9();
    m26();
    $y_ = [Tb1, pq4, Fq4], Uk8 = new Set($y_)
})
// @from(Ln 167347, Col 0)
function W46(q) {
    return q.filter((K) => K.data?.type !== "hook_progress")
}
// @from(Ln 167351, Col 0)
function e3(q, K) {
    return q.name === K || (q.aliases?.includes(K) ?? !1)
}
// @from(Ln 167355, Col 0)
function rK(q, K) {
    return q.find((_) => e3(_, K))
}
// @from(Ln 167359, Col 0)
function Iq(q) {
    return Object.defineProperties({
        ...jy_,
        userFacingName: () => q.name
    }, Object.getOwnPropertyDescriptors(q))
}
// @from(Ln 167365, Col 4)
MD = () => ({
        mode: "default",
        additionalWorkingDirectories: new Map,
        alwaysAllowRules: {},
        alwaysDenyRules: {},
        alwaysAskRules: {},
        isBypassPermissionsModeAvailable: !1
    })
// @from(Ln 167373, Col 4)
jy_
// @from(Ln 167374, Col 4)
gq = L(() => {
    jy_ = {
        isEnabled: () => !0,
        isConcurrencySafe: (q) => !1,
        isReadOnly: (q) => !1,
        isDestructive: (q) => !1,
        checkPermissions: (q, K) => Promise.resolve({
            behavior: "allow",
            updatedInput: q
        }),
        toAutoClassifierInput: (q) => "",
        userFacingName: (q) => ""
    }
})
// @from(Ln 167388, Col 4)
X$6 = p((AtO, ik8) => {
    function Qq4(q) {
        return Array.isArray(q) ? q : [q]
    }
    var Hy_ = void 0,
        kb1 = "",
        gq4 = " ",
        Vb1 = "\\",
        Jy_ = /^\s+$/,
        Xy_ = /(?:[^\\]|^)\\$/,
        My_ = /^\\!/,
        Py_ = /^\\#/,
        Wy_ = /\r?\n/g,
        Dy_ = /^\.{0,2}\/|^\.{1,2}$/,
        Zy_ = /\/$/,
        sk6 = "/",
        dq4 = "node-ignore";
    if (typeof Symbol < "u") dq4 = Symbol.for("node-ignore");
    var cq4 = dq4,
        tk6 = (q, K, _) => {
            return Object.defineProperty(q, K, {
                value: _
            }), _
        },
        fy_ = /([0-z])-([0-z])/g,
        lq4 = () => !1,
        Gy_ = (q) => q.replace(fy_, (K, _, z) => _.charCodeAt(0) <= z.charCodeAt(0) ? K : kb1),
        vy_ = (q) => {
            let {
                length: K
            } = q;
            return q.slice(0, K - K % 2)
        },
        Ty_ = [
            [/^\uFEFF/, () => kb1],
            [/((?:\\\\)*?)(\\?\s+)$/, (q, K, _) => K + (_.indexOf("\\") === 0 ? gq4 : kb1)],
            [/(\\+?)\s/g, (q, K) => {
                let {
                    length: _
                } = K;
                return K.slice(0, _ - _ % 2) + gq4
            }],
            [/[\\$.|*+(){^]/g, (q) => `\\${q}`],
            [/(?!\\)\?/g, () => "[^/]"],
            [/^\//, () => "^"],
            [/\//g, () => "\\/"],
            [/^\^*\\\*\\\*\\\//, () => "^(?:.*\\/)?"],
            [/^(?=[^^])/, function() {
                return !/\/(?!$)/.test(this) ? "(?:^|\\/)" : "^"
            }],
            [/\\\/\\\*\\\*(?=\\\/|$)/g, (q, K, _) => K + 6 < _.length ? "(?:\\/[^\\/]+)*" : "\\/.+"],
            [/(^|[^\\]+)(\\\*)+(?=.+)/g, (q, K, _) => {
                let z = _.replace(/\\\*/g, "[^\\/]*");
                return K + z
            }],
            [/\\\\\\(?=[$.|*+(){^])/g, () => Vb1],
            [/\\\\/g, () => Vb1],
            [/(\\)?\[([^\]/]*?)(\\*)($|\])/g, (q, K, _, z, Y) => K === Vb1 ? `\\[${_}${vy_(z)}${Y}` : Y === "]" ? z.length % 2 === 0 ? `[${Gy_(_)}${z}]` : "[]" : "[]"],
            [/(?:[^*])$/, (q) => /\/$/.test(q) ? `${q}$` : `${q}(?=$|\\/$)`]
        ],
        Vy_ = /(^|\\\/)?\\\*$/,
        _a6 = "regex",
        lk8 = "checkRegex",
        Uq4 = "_",
        ky_ = {
            [_a6](q, K) {
                return `${K?`${K}[^/]+`:"[^/]*"}(?=$|\\/$)`
            },
            [lk8](q, K) {
                return `${K?`${K}[^/]*`:"[^/]*"}(?=$|\\/$)`
            }
        },
        Ny_ = (q) => Ty_.reduce((K, [_, z]) => K.replace(_, z.bind(q)), q),
        nk8 = (q) => typeof q === "string",
        Ey_ = (q) => q && nk8(q) && !Jy_.test(q) && !Xy_.test(q) && q.indexOf("#") !== 0,
        yy_ = (q) => q.split(Wy_).filter(Boolean);
    class nq4 {
        constructor(q, K, _, z, Y, A) {
            this.pattern = q, this.mark = K, this.negative = Y, tk6(this, "body", _), tk6(this, "ignoreCase", z), tk6(this, "regexPrefix", A)
        }
        get regex() {
            let q = Uq4 + _a6;
            if (this[q]) return this[q];
            return this._make(_a6, q)
        }
        get checkRegex() {
            let q = Uq4 + lk8;
            if (this[q]) return this[q];
            return this._make(lk8, q)
        }
        _make(q, K) {
            let _ = this.regexPrefix.replace(Vy_, ky_[q]),
                z = this.ignoreCase ? new RegExp(_, "i") : new RegExp(_);
            return tk6(this, K, z)
        }
    }
    var Ly_ = ({
        pattern: q,
        mark: K
    }, _) => {
        let z = !1,
            Y = q;
        if (Y.indexOf("!") === 0) z = !0, Y = Y.substr(1);
        Y = Y.replace(My_, "!").replace(Py_, "#");
        let A = Ny_(Y);
        return new nq4(q, K, Y, _, z, A)
    };
    class iq4 {
        constructor(q) {
            this._ignoreCase = q, this._rules = []
        }
        _add(q) {
            if (q && q[cq4]) {
                this._rules = this._rules.concat(q._rules._rules), this._added = !0;
                return
            }
            if (nk8(q)) q = {
                pattern: q
            };
            if (Ey_(q.pattern)) {
                let K = Ly_(q, this._ignoreCase);
                this._added = !0, this._rules.push(K)
            }
        }
        add(q) {
            return this._added = !1, Qq4(nk8(q) ? yy_(q) : q).forEach(this._add, this), this._added
        }
        test(q, K, _) {
            let z = !1,
                Y = !1,
                A;
            this._rules.forEach((w) => {
                let {
                    negative: $
                } = w;
                if (Y === $ && z !== Y || $ && !z && !Y && !K) return;
                if (!w[_].test(q)) return;
                z = !$, Y = $, A = $ ? Hy_ : w
            });
            let O = {
                ignored: z,
                unignored: Y
            };
            if (A) O.rule = A;
            return O
        }
    }
    var hy_ = (q, K) => {
            throw new K(q)
        },
        Sa = (q, K, _) => {
            if (!nk8(q)) return _(`path must be a string, but got \`${K}\``, TypeError);
            if (!q) return _("path must not be empty", TypeError);
            if (Sa.isNotRelative(q)) return _(`path should be a \`path.relative()\`d string, but got "${K}"`, RangeError);
            return !0
        },
        rq4 = (q) => Dy_.test(q);
    Sa.isNotRelative = rq4;
    Sa.convert = (q) => q;
    class oq4 {
        constructor({
            ignorecase: q = !0,
            ignoreCase: K = q,
            allowRelativePaths: _ = !1
        } = {}) {
            tk6(this, cq4, !0), this._rules = new iq4(K), this._strictPathCheck = !_, this._initCache()
        }
        _initCache() {
            this._ignoreCache = Object.create(null), this._testCache = Object.create(null)
        }
        add(q) {
            if (this._rules.add(q)) this._initCache();
            return this
        }
        addPattern(q) {
            return this.add(q)
        }
        _test(q, K, _, z) {
            let Y = q && Sa.convert(q);
            return Sa(Y, q, this._strictPathCheck ? hy_ : lq4), this._t(Y, K, _, z)
        }
        checkIgnore(q) {
            if (!Zy_.test(q)) return this.test(q);
            let K = q.split(sk6).filter(Boolean);
            if (K.pop(), K.length) {
                let _ = this._t(K.join(sk6) + sk6, this._testCache, !0, K);
                if (_.ignored) return _
            }
            return this._rules.test(q, !1, lk8)
        }
        _t(q, K, _, z) {
            if (q in K) return K[q];
            if (!z) z = q.split(sk6).filter(Boolean);
            if (z.pop(), !z.length) return K[q] = this._rules.test(q, _, _a6);
            let Y = this._t(z.join(sk6) + sk6, K, _, z);
            return K[q] = Y.ignored ? Y : this._rules.test(q, _, _a6)
        }
        ignores(q) {
            return this._test(q, this._ignoreCache, !1).ignored
        }
        createFilter() {
            return (q) => !this.ignores(q)
        }
        filter(q) {
            return Qq4(q).filter(this.createFilter())
        }
        test(q) {
            return this._test(q, this._testCache, !0)
        }
    }
    var Nb1 = (q) => new oq4(q),
        Ry_ = (q) => Sa(q && Sa.convert(q), q, lq4),
        aq4 = () => {
            let q = (_) => /^\\\\\?\\/.test(_) || /["<>|\u0000-\u001F]+/u.test(_) ? _ : _.replace(/\\/g, "/");
            Sa.convert = q;
            let K = /^[a-z]:\//i;
            Sa.isNotRelative = (_) => K.test(_) || rq4(_)
        };
    if (typeof process < "u" && process.platform === "win32") aq4();
    ik8.exports = Nb1;
    Nb1.default = Nb1;
    ik8.exports.isPathValid = Ry_;
    tk6(ik8.exports, Symbol.for("setupWindows"), aq4)
})
// @from(Ln 167612, Col 4)
_44 = p((OtO, K44) => {
    var q44 = d6("child_process"),
        sq4 = q44.spawn,
        Sy_ = q44.exec;
    K44.exports = function(q, K, _) {
        if (typeof K === "function" && _ === void 0) _ = K, K = void 0;
        if (q = parseInt(q), Number.isNaN(q))
            if (_) return _(Error("pid must be a number"));
            else throw Error("pid must be a number");
        var z = {},
            Y = {};
        switch (z[q] = [], Y[q] = 1, process.platform) {
            case "win32":
                Sy_("taskkill /pid " + q + " /T /F", _);
                break;
            case "darwin":
                Eb1(q, z, Y, function(A) {
                    return sq4("pgrep", ["-P", A])
                }, function() {
                    tq4(z, K, _)
                });
                break;
            default:
                Eb1(q, z, Y, function(A) {
                    return sq4("ps", ["-o", "pid", "--no-headers", "--ppid", A])
                }, function() {
                    tq4(z, K, _)
                });
                break
        }
    };

    function tq4(q, K, _) {
        var z = {};
        try {
            Object.keys(q).forEach(function(Y) {
                if (q[Y].forEach(function(A) {
                        if (!z[A]) eq4(A, K), z[A] = 1
                    }), !z[Y]) eq4(Y, K), z[Y] = 1
            })
        } catch (Y) {
            if (_) return _(Y);
            else throw Y
        }
        if (_) return _()
    }

    function eq4(q, K) {
        try {
            process.kill(parseInt(q, 10), K)
        } catch (_) {
            if (_.code !== "ESRCH") throw _
        }
    }

    function Eb1(q, K, _, z, Y) {
        var A = z(q),
            O = "";
        A.stdout.on("data", function(j) {
            var j = j.toString("ascii");
            O += j
        });
        var w = function($) {
            if (delete _[q], $ != 0) {
                if (Object.keys(_).length == 0) Y();
                return
            }
            O.match(/\d+/g).forEach(function(j) {
                j = parseInt(j, 10), K[q].push(j), K[j] = [], _[j] = 1, Eb1(j, K, _, z, Y)
            })
        };
        A.on("close", w)
    }
})
// @from(Ln 167686, Col 4)
S7 = "Bash"
// @from(Ln 167688, Col 0)
function yb1() {
    return `A powerful search tool built on ripgrep

  Usage:
  - ALWAYS use ${a5} for search tasks. NEVER invoke \`grep\` or \`rg\` as a ${S7} command. The ${a5} tool has been optimized for correct permissions and access.
  - Supports full regex syntax (e.g., "log.*Error", "function\\s+\\w+")
  - Filter files with glob parameter (e.g., "*.js", "**/*.tsx") or type parameter (e.g., "js", "py", "rust")
  - Output modes: "content" shows matching lines, "files_with_matches" shows only file paths (default), "count" shows match counts
  - Use ${T4} tool for open-ended searches requiring multiple rounds
  - Pattern syntax: Uses ripgrep (not grep) - literal braces need escaping (use \`interface\\{\\}\` to find \`interface{}\` in Go code)
  - Multiline matching: By default patterns match within single lines only. For cross-line patterns like \`struct \\{[\\s\\S]*?field\`, use \`multiline: true\`
`
}
// @from(Ln 167701, Col 4)
a5 = "Grep"
// @from(Ln 167702, Col 4)
jJ = L(() => {
    sY()
})
// @from(Ln 167706, Col 0)
function Lb1(q) {
    let K = q.trim();
    if (!K) return null;
    if (K.endsWith("-")) {
        let A = parseInt(K.slice(0, -1), 10);
        if (isNaN(A) || A < 1) return null;
        return {
            firstPage: A,
            lastPage: 1 / 0
        }
    }
    let _ = K.indexOf("-");
    if (_ === -1) {
        let A = parseInt(K, 10);
        if (isNaN(A) || A < 1) return null;
        return {
            firstPage: A,
            lastPage: A
        }
    }
    let z = parseInt(K.slice(0, _), 10),
        Y = parseInt(K.slice(_ + 1), 10);
    if (isNaN(z) || isNaN(Y) || z < 1 || Y < 1 || Y < z) return null;
    return {
        firstPage: z,
        lastPage: Y
    }
}
// @from(Ln 167735, Col 0)
function za6() {
    return !G5().toLowerCase().includes("claude-3-haiku")
}
// @from(Ln 167739, Col 0)
function ek6(q) {
    let K = q.startsWith(".") ? q.slice(1) : q;
    return Cy_.has(K.toLowerCase())
}
// @from(Ln 167743, Col 4)
Cy_
// @from(Ln 167744, Col 4)
rk8 = L(() => {
    Sq();
    Cy_ = new Set(["pdf"])
})
// @from(Ln 167749, Col 0)
function qN6() {
    return u8("tengu_noreread_q7m_velvet", !1)
}
// @from(Ln 167753, Col 0)
function A44() {
    return qN6() ? Y44 : z44
}
// @from(Ln 167757, Col 0)
function ak8(q) {
    return q.startsWith(z44) || q.startsWith(Y44)
}
// @from(Ln 167761, Col 0)
function Iy_() {
    return ""
}
// @from(Ln 167765, Col 0)
function H44(q, K, _) {
    return `Reads a file from the local filesystem. You can access any file directly by using this tool.
Assume this tool is able to read all files on the machine. If the User provides a path to a file assume that path is valid. It is okay to read a file that does not exist; an error will be returned.

Usage:
- The file_path parameter must be an absolute path, not a relative path
- By default, it reads up to ${Ya6} lines starting from the beginning of the file${K}
${_}
${q}
- This tool allows Claude Code to read images (eg PNG, JPG, etc). When reading an image file the contents are presented visually as Claude Code is a multimodal LLM.${za6()?`
- This tool can read PDF files (.pdf). For large PDFs (more than 10 pages), you MUST provide the pages parameter to read specific page ranges (e.g., pages: "1-5"). Reading a large PDF without the pages parameter will fail. Maximum 20 pages per request.`:""}
- This tool can read Jupyter notebooks (.ipynb files) and returns all cells with their outputs, combining code, text, and visualizations.
- This tool can only read files, not directories. To read a directory, use an ls command via the ${S7} tool.
- You will regularly be asked to read screenshots. If the user provides a path to a screenshot, ALWAYS use this tool to view the file at the path. This tool will work with all temporary file paths.
- If you read a file that exists but has empty contents you will receive a system reminder warning in place of file contents.${qN6()?by_:""}${Iy_()}`
}
// @from(Ln 167781, Col 4)
xq = "Read"
// @from(Ln 167782, Col 4)
by_ = `
- Do NOT re-read a file you just edited to verify — Edit/Write would have errored if the change failed, and the harness tracks file state for you.`
// @from(Ln 167784, Col 4)
ok8 = " (file state is current in your context — no need to Read it back)"
// @from(Ln 167785, Col 4)
z44 = "File unchanged since last read. The content from the earlier Read tool_result in this conversation is still current — refer to that instead of re-reading."
// @from(Ln 167786, Col 4)
Y44 = "Wasted call — file unchanged since your last Read. Refer to that earlier tool_result instead."
// @from(Ln 167787, Col 4)
Ya6 = 2000
// @from(Ln 167788, Col 4)
O44 = "Read a file from the local filesystem."
// @from(Ln 167789, Col 4)
w44 = "- Results are returned using cat -n format, with line numbers starting at 1"
// @from(Ln 167790, Col 4)
$44 = "- You can optionally specify a line offset and limit (especially handy for long files), but it's recommended to read the whole file by not providing these parameters"
// @from(Ln 167791, Col 4)
j44 = "- When you already know which part of the file you need, only read that part. This can be important for larger files."
// @from(Ln 167792, Col 4)
Rz = L(() => {
    B1();
    rk8()
})
// @from(Ln 167796, Col 4)
T9 = "Glob"
// @from(Ln 167797, Col 4)
hb1 = `- Fast file pattern matching tool that works with any codebase size
- Supports glob patterns like "**/*.js" or "src/**/*.ts"
- Returns matching file paths sorted by modification time
- Use this tool when you need to find files by name patterns
- When you are doing an open ended search that may require multiple rounds of globbing and grepping, use the Agent tool instead`
// @from(Ln 167802, Col 4)
HJ = "NotebookEdit"
// @from(Ln 167804, Col 0)
function J44() {
    return process.env.CLAUDE_REPL_VARIANT
}
// @from(Ln 167808, Col 0)
function Oa6(q, K) {
    return (q ?? {})[K ?? Aa6] !== void 0
}
// @from(Ln 167812, Col 0)
function JJ() {
    if (!m16()) return !1;
    if (c5(process.env.CLAUDE_CODE_REPL)) return !1;
    if (S6(process.env.CLAUDE_CODE_REPL)) return !0;
    let q = process.env.CLAUDE_CODE_ENTRYPOINT;
    if (q === "cli" || q === "remote") return u8("tengu_slate_harbor", !1);
    return !1
}
// @from(Ln 167820, Col 4)
GO = "REPL"
// @from(Ln 167821, Col 4)
Aa6 = "main"
// @from(Ln 167822, Col 4)
KN6
// @from(Ln 167823, Col 4)
EP = L(() => {
    B1();
    Q8();
    Rz();
    jJ();
    KN6 = new Set([xq, T9, a5, S7, HJ])
})
// @from(Ln 167831, Col 0)
function $H() {
    if (!S6(process.env.EMBEDDED_SEARCH_TOOLS)) return !1;
    let q = process.env.CLAUDE_CODE_ENTRYPOINT;
    return q !== "sdk-ts" && q !== "sdk-py" && q !== "sdk-cli" && q !== "local-agent"
}
// @from(Ln 167836, Col 4)
pB = L(() => {
    Q8()
})
// @from(Ln 167843, Col 0)
function M44(q) {
    let K = new Map;
    if (!q) return K;
    try {
        let _ = n8(q);
        if (_ && typeof _ === "object") {
            for (let [z, Y] of Object.entries(_))
                if (typeof Y === "string") K.set(z, Y)
        }
    } catch (_) {
        E(`[repo-checkouts] Failed to parse env map: ${b6(_)}`, {
            level: "error"
        })
    }
    return K
}
// @from(Ln 167860, Col 0)
function Rb1() {
    if (_N6) return _N6;
    let q = process.env.CLAUDE_CODE_REPO_CHECKOUTS;
    if (!q) return _N6 = new Map([
        ["", b8()]
    ]), _N6;
    return _N6 = M44(q), _N6
}
// @from(Ln 167869, Col 0)
function P44() {
    if (sk8) return sk8;
    return sk8 = M44(process.env.CLAUDE_CODE_BASE_REFS), sk8
}
// @from(Ln 167874, Col 0)
function W44(q) {
    for (let [K, _] of Rb1())
        if (q === _ || q.startsWith(_ + xy_)) return K;
    return
}
// @from(Ln 167879, Col 0)
async function Z44(q) {
    D44 = q;
    for (let [, K] of Rb1()) await RA1(K);
    SA1(() => void Sb1())
}
// @from(Ln 167884, Col 0)
async function Sb1() {
    let q = Rb1();
    if (q.size === 0) return;
    let K = {};
    for (let [_, z] of q) {
        let Y = await CA1(z);
        if (Y !== void 0) K[_] = Y
    }
    if (f$(K, X44)) return;
    X44 = K, D44?.({
        current_branches: K
    })
}
// @from(Ln 167897, Col 4)
_N6 = null
// @from(Ln 167898, Col 4)
sk8 = null
// @from(Ln 167899, Col 4)
D44 = null
// @from(Ln 167900, Col 4)
X44
// @from(Ln 167901, Col 4)
tk8 = L(() => {
    JU();
    n7();
    K8();
    m8();
    sC();
    e8();
    X44 = {}
})