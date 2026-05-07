
// @from(Ln 421372, Col 0)
function wY7(q, K, _, z, Y) {
    if (_ === "monitor") return () => {};
    let A = $A(q),
        O = 0,
        w = Date.now(),
        $ = !1,
        j = setInterval(() => {
            TTY(A).then((H) => {
                if (H.size > O) {
                    O = H.size, w = Date.now();
                    return
                }
                if (Date.now() - w < kTY) return;
                RC(A, NTY).then(({
                    content: J
                }) => {
                    if ($) return;
                    if (!yTY(J)) {
                        w = Date.now();
                        return
                    }
                    $ = !0, clearInterval(j);
                    let X = z ? `
<${lC}>${z}</${lC}>` : "",
                        M = `${eI6}"${K}" appears to be waiting for interactive input`,
                        P = `<${TA}>
<${hW}>${q}</${hW}>${X}
<${nC}>${A}</${nC}>
<${Mw}>${fJ(M)}</${Mw}>
</${TA}>
Last output:
${J.trimEnd()}

The command is likely blocked on an interactive prompt. Kill this task and re-run with piped input (e.g., \`echo y | command\`) or a non-interactive flag if one exists.`;
                    LY({
                        value: P,
                        mode: "task-notification",
                        priority: "next",
                        agentId: Y
                    })
                }, () => {})
            }, () => {})
        }, VTY);
    return j.unref(), () => {
        $ = !0, clearInterval(j)
    }
}
// @from(Ln 421420, Col 0)
function $Y7(q, K, _, z, Y, A, O, w = "bash", $) {
    let j = !1;
    if (Y.update(q, (P) => {
            if (P.notified) return P;
            return j = !0, {
                ...P,
                notified: !0
            }
        }), !j) return;
    A?.();
    let H;
    if (w === "monitor") switch (_) {
        case "completed":
            H = `Monitor "${K}" stream ended`;
            break;
        case "failed":
            H = `Monitor "${K}" script failed${z!==void 0?` (exit ${z})`:""}`;
            break;
        case "killed":
            H = `Monitor "${K}" stopped`;
            break
    } else switch (_) {
        case "completed":
            H = `${eI6}"${K}" completed${z!==void 0?` (exit code ${z})`:""}`;
            break;
        case "failed":
            H = `${eI6}"${K}" failed${z!==void 0?` with exit code ${z}`:""}`;
            break;
        case "killed":
            H = `${eI6}"${K}" was stopped`;
            break
    }
    let J = $A(q),
        X = O ? `
<${lC}>${O}</${lC}>` : "",
        M = `<${TA}>
<${hW}>${q}</${hW}>${X}
<${nC}>${J}</${nC}>
<${rX}>${_}</${rX}>
<${Mw}>${fJ(H)}</${Mw}>
</${TA}>`;
    LY({
        value: M,
        mode: "task-notification",
        priority: "next",
        agentId: $
    })
}
// @from(Ln 421468, Col 0)
async function Y_6(q, K) {
    let {
        command: _,
        description: z,
        shellCommand: Y,
        toolUseId: A,
        agentId: O,
        kind: w
    } = q, {
        taskRegistry: $,
        abortSpeculation: j
    } = K, {
        taskOutput: H
    } = Y, J = H.taskId, X = eq(async () => {
        z_6(J, $)
    }), M = {
        ...cf(J, "local_bash", z, A),
        type: "local_bash",
        status: "running",
        command: _,
        cwd: b8(),
        completionStatusSentInAttachment: !1,
        shellCommand: Y,
        unregisterCleanup: X,
        lastReportedTotalLines: 0,
        isBackgrounded: !0,
        agentId: O,
        kind: w
    };
    $.register(M), Y.background(J);
    let P = wY7(J, z, w, A, O);
    return Y.result.then(async (W) => {
        P(), await HY7(Y);
        let D = !1;
        $.update(J, (Z) => {
            if (Z.status === "killed") return D = !0, Z;
            if (Z.notified) return Z;
            return {
                ...Z,
                status: MP6(W),
                result: {
                    code: W.code,
                    interrupted: W.interrupted
                },
                shellCommand: null,
                unregisterCleanup: void 0,
                endTime: Date.now()
            }
        }), $Y7(J, z, D ? "killed" : MP6(W), W.code, $, j, A, w, O), n2(J)
    }), {
        taskId: J,
        cleanup: () => {
            X()
        }
    }
}
// @from(Ln 421525, Col 0)
function dc8(q, K, _) {
    let {
        command: z,
        description: Y,
        shellCommand: A,
        agentId: O
    } = q, w = A.taskOutput.taskId, $ = eq(async () => {
        z_6(w, K)
    }), j = {
        ...cf(w, "local_bash", Y, _),
        type: "local_bash",
        status: "running",
        command: z,
        cwd: b8(),
        completionStatusSentInAttachment: !1,
        shellCommand: A,
        unregisterCleanup: $,
        lastReportedTotalLines: 0,
        isBackgrounded: !1,
        agentId: O
    };
    return K.register(j), w
}
// @from(Ln 421549, Col 0)
function LTY(q, K, _) {
    let z = K.get(q);
    if (!WS(z) || z.isBackgrounded || !z.shellCommand) return !1;
    let {
        shellCommand: Y,
        description: A
    } = z, {
        toolUseId: O,
        kind: w,
        agentId: $
    } = z;
    if (!Y.background(q)) return !1;
    K.update(q, (H) => {
        if (H.isBackgrounded) return H;
        return {
            ...H,
            isBackgrounded: !0
        }
    });
    let j = wY7(q, A, w, O, $);
    return Y.result.then(async (H) => {
        j(), await HY7(Y);
        let J = !1,
            X;
        K.update(q, (M) => {
            if (M.status === "killed") return J = !0, M;
            if (M.notified) return M;
            return X = M.unregisterCleanup, {
                ...M,
                status: MP6(H),
                result: {
                    code: H.code,
                    interrupted: H.interrupted
                },
                shellCommand: null,
                unregisterCleanup: void 0,
                endTime: Date.now()
            }
        }), X?.(), $Y7(q, A, J ? "killed" : MP6(H), H.code, K, _, O, w, $), n2(q)
    }), !0
}
// @from(Ln 421591, Col 0)
function jY7(q) {
    return Object.values(q.tasks).some((K) => {
        if (WS(K) && !K.isBackgrounded && K.shellCommand) return !0;
        if (sD(K) && !K.isBackgrounded && !Fd8(K)) return !0;
        return !1
    })
}
// @from(Ln 421599, Col 0)
function jg8(q, K) {
    let _ = q.all(),
        z = Object.keys(_).filter((A) => {
            let O = _[A];
            return WS(O) && !O.isBackgrounded && O.shellCommand
        });
    for (let A of z) LTY(A, q, K);
    let Y = Object.keys(_).filter((A) => {
        let O = _[A];
        return sD(O) && !O.isBackgrounded
    });
    for (let A of Y) qSK(A, q)
}
// @from(Ln 421613, Col 0)
function cc8(q, K, _, z, Y, A) {
    if (!K.background(q)) return !1;
    let O;
    z.update(q, ($) => {
        if ($.isBackgrounded) return $;
        return O = $.agentId, {
            ...$,
            isBackgrounded: !0
        }
    });
    let w = wY7(q, _, void 0, A, O);
    return K.result.then(async ($) => {
        w(), await HY7(K);
        let j = !1,
            H;
        z.update(q, (J) => {
            if (J.status === "killed") return j = !0, J;
            if (J.notified) return J;
            return H = J.unregisterCleanup, {
                ...J,
                status: MP6($),
                result: {
                    code: $.code,
                    interrupted: $.interrupted
                },
                shellCommand: null,
                unregisterCleanup: void 0,
                endTime: Date.now()
            }
        }), H?.(), $Y7(q, _, j ? "killed" : MP6($), $.code, z, Y, A, void 0, O), n2(q)
    }), !0
}
// @from(Ln 421646, Col 0)
function lc8(q, K, _) {
    let z, Y = !1;
    return _.update(q, (A) => {
        if (A.notified) return A;
        return z = A.unregisterCleanup, Y = !0, {
            ...A,
            notified: !0,
            status: MP6(K),
            result: {
                code: K.code,
                interrupted: K.interrupted
            },
            shellCommand: null,
            unregisterCleanup: void 0,
            endTime: Date.now()
        }
    }), z?.(), Y
}
// @from(Ln 421665, Col 0)
function nc8(q, K, _) {
    let z = _.get(q);
    if (!WS(z) || z.isBackgrounded || z.notified) return;
    let Y = z.unregisterCleanup;
    _.remove(q), Y?.(), I$(q, K, {
        toolUseId: z.toolUseId,
        summary: z.description
    })
}
// @from(Ln 421675, Col 0)
function FI6(q) {
    if (q.interrupted) return "stopped";
    return q.code === 0 ? "completed" : "failed"
}
// @from(Ln 421680, Col 0)
function MP6(q) {
    if (q.interrupted) return "killed";
    return q.code === 0 ? "completed" : "failed"
}
// @from(Ln 421684, Col 0)
async function HY7(q) {
    try {
        await q.taskOutput.flush(), q.cleanup()
    } catch (K) {
        j6(K)
    }
}
// @from(Ln 421691, Col 4)
eI6 = "Background command "
// @from(Ln 421692, Col 4)
VTY = 5000
// @from(Ln 421693, Col 4)
kTY = 45000
// @from(Ln 421694, Col 4)
NTY = 1024
// @from(Ln 421695, Col 4)
ETY
// @from(Ln 421695, Col 9)
nQ8
// @from(Ln 421696, Col 4)
pl = L(() => {
    rA();
    $T();
    R9();
    n7();
    Yq();
    U8();
    b$();
    BP();
    EH();
    vM();
    gd8();
    Sd8();
    ETY = [/\(y\/n\)/i, /\[y\/n\]/i, /\(yes\/no\)/i, /\b(?:Do you|Would you|Shall I|Are you sure|Ready to)\b.*\? *$/i, /Press (any key|Enter)/i, /Continue\?/i, /Overwrite\?/i];
    nQ8 = {
        name: "LocalShellTask",
        type: "local_bash",
        async kill(q, K) {
            z_6(q, K)
        }
    }
})
// @from(Ln 421719, Col 0)
function STY(q) {
    let K = bTY(q),
        _ = RTY.get(K);
    return _ !== void 0 ? _ : hTY
}
// @from(Ln 421725, Col 0)
function CTY(q) {
    return q.trim().split(/\s+/)[0] || ""
}
// @from(Ln 421729, Col 0)
function bTY(q) {
    let _ = TO(q).at(-1) || q;
    return CTY(_)
}
// @from(Ln 421734, Col 0)
function KSK(q, K, _, z) {
    let A = STY(q)(K, _, z);
    return {
        isError: A.isError,
        message: A.message
    }
}
// @from(Ln 421741, Col 4)
hTY = (q, K, _) => ({
        isError: q !== 0,
        message: q !== 0 ? `Command failed with exit code ${q}` : void 0
    })
// @from(Ln 421745, Col 4)
RTY
// @from(Ln 421746, Col 4)
_SK = L(() => {
    vD();
    RTY = new Map([
        ["grep", (q, K, _) => ({
            isError: q >= 2,
            message: q === 1 ? "No matches found" : void 0
        })],
        ["rg", (q, K, _) => ({
            isError: q >= 2,
            message: q === 1 ? "No matches found" : void 0
        })],
        ["find", (q, K, _) => ({
            isError: q >= 2,
            message: q === 1 ? "Some directories were inaccessible" : void 0
        })],
        ["diff", (q, K, _) => ({
            isError: q >= 2,
            message: q === 1 ? "Files differ" : void 0
        })],
        ["test", (q, K, _) => ({
            isError: q >= 2,
            message: q === 1 ? "Condition is false" : void 0
        })],
        ["[", (q, K, _) => ({
            isError: q >= 2,
            message: q === 1 ? "Condition is false" : void 0
        })]
    ])
})
// @from(Ln 421776, Col 0)
function mTY(q) {
    if (/[|<>]/.test(q)) return [];
    let K;
    try {
        K = TO(q)
    } catch {
        return []
    }
    if (K.length === 0) return [];
    let _ = [];
    for (let z of K) {
        let Y = BTY(z) ?? pTY(z);
        if (Y) _.push(Y);
        else if (K.length > 1 && !uTY.test(z)) return []
    }
    return _
}
// @from(Ln 421794, Col 0)
function BTY(q) {
    let K;
    try {
        K = XM(q)
    } catch {
        return null
    }
    if (K[0] !== "sed") return null;
    let _ = !1,
        z = null,
        Y = null;
    for (let w = 1; w < K.length; w++) {
        let $ = K[w];
        if ($.startsWith("-")) {
            if ($.startsWith("--")) {
                if ($ === "--in-place" || $.startsWith("--in-place=")) return null;
                if ($ === "--expression") return null;
                if ($ === "--quiet" || $ === "--silent") _ = !0
            } else {
                if ($.includes("i")) return null;
                if ($ === "-e") return null;
                if ($.includes("n")) _ = !0
            }
            continue
        }
        if (z === null) z = $;
        else if (Y === null) Y = $;
        else return null
    }
    if (!_ || z === null || Y === null) return null;
    let A = ITY.exec(z);
    if (A) return {
        filePath: Y,
        startLine: Number(A[1]),
        endLine: Number(A[2])
    };
    let O = xTY.exec(z);
    if (O) {
        let w = Number(O[1]);
        return {
            filePath: Y,
            startLine: w,
            endLine: w
        }
    }
    return null
}
// @from(Ln 421842, Col 0)
function pTY(q) {
    let K;
    try {
        K = XM(q)
    } catch {
        return null
    }
    if (K[0] !== "cat") return null;
    let _ = null;
    for (let z = 1; z < K.length; z++) {
        let Y = K[z];
        if (Y.startsWith("-")) {
            if (Y !== "-n" && Y !== "--number") return null;
            continue
        }
        if (_ !== null) return null;
        _ = Y
    }
    if (_ === null || _ === "-") return null;
    return {
        filePath: _,
        startLine: void 0,
        endLine: void 0
    }
}
// @from(Ln 421867, Col 0)
async function zSK(q, K, _) {
    let z = mTY(q);
    if (z.length === 0) return;
    let Y = V8();
    await Promise.all(z.map(async (A) => {
        let O = Wq(A.filePath);
        if (K.has(O)) return;
        try {
            let w = await Y.stat(O);
            if (w.size > 10485760) return;
            if (_.aborted) return;
            let $ = await Y.readFile(O, {
                    encoding: "utf8"
                }),
                j, H, J;
            if (A.startLine === void 0) j = $;
            else {
                let X = $.split(`
`),
                    M = Math.max(1, A.startLine),
                    P = Math.max(M, A.endLine ?? M);
                if (M > X.length) return;
                j = X.slice(M - 1, P).join(`
`), H = M, J = P - M + 1
            }
            K.set(O, {
                content: j,
                timestamp: Math.floor(w.mtimeMs),
                offset: H,
                limit: J
            })
        } catch {}
    }))
}
// @from(Ln 421901, Col 4)
ITY
// @from(Ln 421901, Col 9)
xTY
// @from(Ln 421901, Col 14)
uTY
// @from(Ln 421902, Col 4)
YSK = L(() => {
    vD();
    Yq();
    b9();
    ITY = /^(\d+),(\d+)p$/, xTY = /^(\d+)p$/, uTY = /^\s*(echo|printf|true|:)\b/
})
// @from(Ln 421908, Col 4)
FTY
// @from(Ln 421908, Col 9)
ASK
// @from(Ln 421908, Col 14)
OSK
// @from(Ln 421908, Col 19)
wSK
// @from(Ln 421909, Col 4)
$SK = L(() => {
    p7();
    FTY = C6(() => y.object({
        entries: y.record(y.string(), y.string()),
        entryChecksums: y.record(y.string(), y.string()).optional(),
        deletedEntries: y.record(y.string(), y.number()).optional()
    })), ASK = C6(() => y.object({
        organizationId: y.string(),
        repo: y.string(),
        version: y.number(),
        lastModified: y.string(),
        checksum: y.string(),
        content: FTY()
    })), OSK = C6(() => y.object({
        error: y.object({
            details: y.object({
                error_code: y.literal("team_memory_too_many_entries"),
                max_entries: y.number().int().positive(),
                received_entries: y.number().int().positive()
            })
        })
    })), wSK = C6(() => y.object({
        error: y.object({
            type: y.string().optional(),
            message: y.string().optional(),
            details: y.object({
                error_code: y.string().optional()
            }).optional()
        }).optional()
    }))
})
// @from(Ln 421957, Col 0)
function JSK(q) {
    return {
        repoSlug: q,
        lastKnownChecksum: null,
        serverChecksums: new Map,
        serverMaxEntries: null,
        pulled: !1,
        tombstonedKeys: new Set
    }
}
// @from(Ln 421968, Col 0)
function aTY(q) {
    return "sha256:" + gTY("sha256").update(q, "utf8").digest("hex")
}
// @from(Ln 421972, Col 0)
function WY7() {
    if (pq() !== "firstParty" || !Aj()) return !1;
    let q = o7();
    return Boolean(q?.accessToken && q.scopes?.includes(dC) && q.scopes.includes(fA6))
}
// @from(Ln 421978, Col 0)
function DY7(q) {
    return `${process.env.TEAM_MEMORY_SYNC_URL||r7().BASE_API_URL}/api/claude_code/team_memory?repo=${encodeURIComponent(q)}`
}
// @from(Ln 421982, Col 0)
function ZY7() {
    let q = o7();
    if (q?.accessToken) return {
        headers: {
            Authorization: `Bearer ${q.accessToken}`,
            "anthropic-beta": eJ,
            "User-Agent": yA()
        }
    };
    return {
        error: "No OAuth token available for team memory sync"
    }
}
// @from(Ln 421996, Col 0)
function XY7(q) {
    return q.length > jSK ? q.slice(0, jSK) : q
}
// @from(Ln 422000, Col 0)
function fY7(q) {
    if (!Z1.isAxiosError(q)) return {};
    return XSK(q.response?.data)
}
// @from(Ln 422005, Col 0)
function XSK(q) {
    if (q === void 0 || q === null) return {};
    let K = wSK().safeParse(q);
    if (!K.success) return {};
    let _ = K.data.error;
    if (!_) return {};
    return {
        ..._.message !== void 0 && {
            serverMessage: XY7(_.message)
        },
        ..._.type !== void 0 && {
            serverErrorType: XY7(_.type)
        },
        ..._.details?.error_code !== void 0 && {
            serverErrorCode: XY7(_.details.error_code)
        }
    }
}
// @from(Ln 422023, Col 0)
async function sTY(q, K, _) {
    try {
        await _Y();
        let z = ZY7();
        if (z.error) return {
            success: !1,
            error: z.error,
            skipRetry: !0,
            errorType: "auth"
        };
        let Y = {
            ...z.headers
        };
        if (_) Y["If-None-Match"] = `"${_.replaceAll('"',"")}"`;
        let A = DY7(K),
            O = await Z1.get(A, {
                headers: Y,
                timeout: PY7,
                validateStatus: (j) => j === 200 || j === 304 || j === 404
            });
        if (O.status === 304) return E("team-memory-sync: not modified (304)", {
            level: "debug"
        }), {
            success: !0,
            notModified: !0,
            checksum: _ ?? void 0
        };
        if (O.status === 404) {
            let {
                serverErrorCode: j
            } = XSK(O.data);
            return E(`team-memory-sync: no remote data (404, code=${j??"none"})`, {
                level: "debug"
            }), q.lastKnownChecksum = null, {
                success: !0,
                isEmpty: !0,
                serverErrorCode: j
            }
        }
        let w = ASK().safeParse(O.data);
        if (!w.success) return E("team-memory-sync: invalid response format", {
            level: "warn"
        }), {
            success: !1,
            error: "Invalid team memory response format",
            skipRetry: !0,
            errorType: "parse"
        };
        let $ = w.data.checksum || O.headers.etag?.replace(/^"|"$/g, "") || void 0;
        if ($) q.lastKnownChecksum = $;
        return E(`team-memory-sync: fetched successfully (checksum: ${$??"none"})`, {
            level: "debug"
        }), {
            success: !0,
            data: w.data,
            isEmpty: !1,
            checksum: $
        }
    } catch (z) {
        let {
            kind: Y,
            status: A,
            message: O
        } = LC(z), w = Z1.isAxiosError(z) ? JSON.stringify(z.response?.data ?? "") : "";
        if (Y !== "other") E(`team-memory-sync: fetch error ${A}: ${w}`, {
            level: "warn"
        });
        let $ = fY7(z);
        switch (Y) {
            case "auth":
                return {
                    success: !1, error: A === 403 ? `Forbidden by server policy: ${w}` : `Not authorized for team memory sync: ${w}`, skipRetry: !0, errorType: A === 403 ? "forbidden" : "auth", httpStatus: A, ...$
                };
            case "timeout":
                return {
                    success: !1, error: "Team memory sync request timeout", errorType: "timeout"
                };
            case "network":
                return {
                    success: !1, error: "Cannot connect to server", errorType: "network"
                };
            default:
                return {
                    success: !1, error: O, errorType: "unknown", httpStatus: A, ...$
                }
        }
    }
}
// @from(Ln 422111, Col 0)
async function tTY(q, K) {
    try {
        await _Y();
        let _ = ZY7();
        if (_.error) return {
            success: !1,
            error: _.error,
            errorType: "auth"
        };
        let z = DY7(K) + "&view=hashes",
            Y = await Z1.get(z, {
                headers: _.headers,
                timeout: PY7,
                validateStatus: ($) => $ === 200 || $ === 404
            });
        if (Y.status === 404) return q.lastKnownChecksum = null, {
            success: !0,
            entryChecksums: {}
        };
        let A = Y.data?.checksum || Y.headers.etag?.replace(/^"|"$/g, ""),
            O = Y.data?.entryChecksums;
        if (!O || typeof O !== "object") return {
            success: !1,
            error: "Server did not return entryChecksums (?view=hashes unsupported)",
            errorType: "parse"
        };
        if (A) q.lastKnownChecksum = A;
        let w = Y.data?.deletedEntries && typeof Y.data.deletedEntries === "object" ? Y.data.deletedEntries : void 0;
        return {
            success: !0,
            version: Y.data?.version,
            checksum: A,
            entryChecksums: O,
            deletedEntries: w
        }
    } catch (_) {
        let {
            kind: z,
            status: Y,
            message: A
        } = LC(_), O = fY7(_);
        switch (z) {
            case "auth":
                return {
                    success: !1, error: Y === 403 ? "Forbidden by server policy" : "Not authorized", errorType: Y === 403 ? "forbidden" : "auth", httpStatus: Y, ...O
                };
            case "timeout":
                return {
                    success: !1, error: "Timeout", errorType: "timeout"
                };
            case "network":
                return {
                    success: !1, error: "Network error", errorType: "network"
                };
            default:
                return {
                    success: !1, error: A, errorType: "unknown", httpStatus: Y, ...O
                }
        }
    }
}
// @from(Ln 422172, Col 0)
async function eTY(q, K, _) {
    let z = null;
    for (let Y = 1; Y <= JY7 + 1; Y++) {
        if (z = await sTY(q, K, _), z.success || z.skipRetry) return z;
        if (Y > JY7) return z;
        let A = Kl(Y);
        E(`team-memory-sync: retry ${Y}/${JY7}`, {
            level: "debug"
        }), await l7(A)
    }
    return z
}
// @from(Ln 422185, Col 0)
function qVY(q) {
    let K = Object.keys(q).sort();
    if (K.length === 0) return [];
    let _ = Buffer.byteLength('{"entries":{}}', "utf8"),
        z = (w, $) => Buffer.byteLength(I6(w), "utf8") + Buffer.byteLength(I6($), "utf8") + 2,
        Y = [],
        A = {},
        O = _;
    for (let w of K) {
        let $ = z(w, q[w]);
        if (O + $ > oTY && Object.keys(A).length > 0) Y.push(A), A = {}, O = _;
        A[w] = q[w], O += $
    }
    return Y.push(A), Y
}
// @from(Ln 422200, Col 0)
async function KVY(q, K, _, z, Y) {
    try {
        await _Y();
        let A = ZY7();
        if (A.error) return {
            success: !1,
            error: A.error,
            errorType: "auth"
        };
        let O = {
            ...A.headers,
            "Content-Type": "application/json"
        };
        if (z) O["If-Match"] = `"${z.replaceAll('"',"")}"`;
        let w = {
            entries: _
        };
        if (Y && Y.length > 0) w.soft_delete_keys = [...Y];
        let $ = DY7(K),
            j = await Z1.put($, w, {
                headers: O,
                timeout: PY7,
                validateStatus: (X) => X === 200 || X === 412
            });
        if (j.status === 412) return E("team-memory-sync: conflict (412 Precondition Failed)", {
            level: "info"
        }), {
            success: !1,
            conflict: !0,
            error: "ETag mismatch"
        };
        let H = j.data?.checksum;
        if (H) q.lastKnownChecksum = H;
        let J = Y && Y.length > 0 ? `, soft-deleted ${Y.length}` : "";
        return E(`team-memory-sync: uploaded ${Object.keys(_).length} entries${J} (checksum: ${H??"none"})`, {
            level: "debug"
        }), {
            success: !0,
            checksum: H,
            lastModified: j.data?.lastModified
        }
    } catch (A) {
        let O = Z1.isAxiosError(A) ? JSON.stringify(A.response?.data ?? "") : "";
        E(`team-memory-sync: upload failed: ${A instanceof Error?A.message:""} ${O}`, {
            level: "warn"
        });
        let {
            kind: w,
            status: $,
            message: j
        } = LC(A), H = $ === 403 ? "forbidden" : w === "http" || w === "other" ? "unknown" : w, J = fY7(A), X, M;
        if ($ === 413 && Z1.isAxiosError(A)) {
            let P = OSK().safeParse(A.response?.data);
            if (P.success) X = P.data.error.details.max_entries, M = P.data.error.details.received_entries
        }
        return {
            success: !1,
            error: j,
            errorType: H,
            httpStatus: $,
            ...J,
            ...X !== void 0 && {
                serverMaxEntries: X
            },
            ...M !== void 0 && {
                serverReceivedEntries: M
            }
        }
    }
}
// @from(Ln 422270, Col 0)
async function _VY(q) {
    let K = vp(),
        _ = {},
        z = new Set,
        Y = [],
        A = !0;
    async function O($) {
        try {
            let j = await QTY($, {
                withFileTypes: !0
            });
            await Promise.all(j.map(async (H) => {
                let J = nTY($, H.name);
                if (H.isDirectory()) await O(J);
                else if (H.isFile()) {
                    if (H.name.startsWith(".") || !(H.name.endsWith(".md") || H.name.endsWith(".txt"))) return;
                    let X = iTY(K, J).replaceAll("\\", "/");
                    z.add(X);
                    try {
                        let M = await dTY(J);
                        if (M.size > MY7) {
                            E(`team-memory-sync: skipping oversized file ${H.name} (${M.size} > ${MY7} bytes)`, {
                                level: "info"
                            });
                            return
                        }
                        let P = await HSK(J, "utf8"),
                            W = W47(P);
                        if (W.length > 0) {
                            let D = W[0];
                            Y.push({
                                path: X,
                                ruleId: D.ruleId,
                                label: D.label
                            }), E(`team-memory-sync: skipping "${X}" — detected ${D.label}`, {
                                level: "warn"
                            });
                            return
                        }
                        _[X] = P
                    } catch {}
                }
            }))
        } catch (j) {
            let H = Q1(j);
            if (H === "EACCES" || H === "EPERM") A = !1;
            if (H !== "ENOENT" && H !== "EACCES" && H !== "EPERM") throw j
        }
    }
    await O(K);
    let w = Object.keys(_).sort();
    if (q !== null && w.length > q) {
        let $ = w.slice(q);
        E(`team-memory-sync: ${w.length} local entries exceeds server cap of ${q}; ${$.length} file(s) will NOT sync: ${$.join(", ")}. Consider consolidating or removing some team memory files.`, {
            level: "warn"
        }), d("tengu_team_mem_entries_capped", {
            total_entries: w.length,
            dropped_count: $.length,
            max_entries: q
        });
        let j = {};
        for (let H of w.slice(0, q)) j[H] = _[H];
        return {
            entries: j,
            diskKeys: z,
            diskTrusted: A,
            skippedSecrets: Y
        }
    }
    return {
        entries: _,
        diskKeys: z,
        diskTrusted: A,
        skippedSecrets: Y
    }
}
// @from(Ln 422346, Col 0)
async function zVY(q) {
    let K = await Promise.all(Object.entries(q).map(async ([Y, A]) => {
            let O;
            try {
                O = await JR8(Y)
            } catch ($) {
                if ($ instanceof TD) return E(`team-memory-sync: ${$.message}`, {
                    level: "warn"
                }), {
                    relPath: Y,
                    outcome: "failed"
                };
                throw $
            }
            if (Buffer.byteLength(A, "utf8") > MY7) return E(`team-memory-sync: skipping oversized remote entry "${Y}"`, {
                level: "info"
            }), {
                relPath: Y,
                outcome: "failed"
            };
            try {
                if (await HSK(O, "utf8") === A) return {
                    relPath: Y,
                    outcome: "matched"
                }
            } catch ($) {
                let j = Q1($);
                if (j !== void 0 && j !== "ENOENT" && j !== "ENOTDIR") E(`team-memory-sync: unexpected read error for "${Y}": ${j}`, {
                    level: "debug"
                })
            }
            try {
                let $ = O.substring(0, O.lastIndexOf(rTY));
                return await UTY($, {
                    recursive: !0
                }), await lTY(O, A, "utf8"), {
                    relPath: Y,
                    outcome: "written"
                }
            } catch ($) {
                return E(`team-memory-sync: failed to write "${Y}": ${$}`, {
                    level: "warn"
                }), {
                    relPath: Y,
                    outcome: "failed"
                }
            }
        })),
        _ = w7(K, (Y) => Y.outcome === "written"),
        z = new Set(K.filter((Y) => Y.outcome === "failed").map((Y) => Y.relPath));
    return {
        filesWritten: _,
        unwrittenKeys: z
    }
}
// @from(Ln 422401, Col 0)
async function YVY(q) {
    let K = Object.keys(q);
    if (K.length === 0) return 0;
    let _ = await Promise.all(K.map(async (z) => {
        let Y;
        try {
            Y = await JR8(z)
        } catch {
            return !1
        }
        try {
            return await cTY(Y), !0
        } catch (A) {
            let O = Q1(A);
            if (O !== "ENOENT") E(`team-memory-sync: failed to reap tombstoned "${z}": ${O}`, {
                level: "warn"
            });
            return !1
        }
    }));
    return w7(_, Boolean)
}
// @from(Ln 422424, Col 0)
function MSK() {
    return WY7()
}
// @from(Ln 422427, Col 0)
async function PSK(q, K) {
    let _ = K?.skipEtagCache ?? !1,
        z = Date.now();
    if (!WY7()) return G98(z, {
        success: !1,
        errorType: "no_oauth"
    }), {
        success: !1,
        filesWritten: 0,
        filesReaped: 0,
        entryCount: 0,
        error: "OAuth not available"
    };
    let Y = _ ? null : q.lastKnownChecksum,
        A = await eTY(q, q.repoSlug, Y);
    if (!A.success) {
        if (A.errorType === "forbidden") yD6("not-available");
        return G98(z, {
            success: !1,
            errorType: A.errorType,
            status: A.httpStatus,
            serverMessage: A.serverMessage,
            serverErrorCode: A.serverErrorCode,
            serverErrorType: A.serverErrorType
        }), {
            success: !1,
            filesWritten: 0,
            filesReaped: 0,
            entryCount: 0,
            error: A.error
        }
    }
    if (A.notModified) return q.pulled = !0, G98(z, {
        success: !0,
        notModified: !0
    }), {
        success: !0,
        filesWritten: 0,
        filesReaped: 0,
        entryCount: 0,
        notModified: !0
    };
    if (A.isEmpty || !A.data) return q.serverChecksums.clear(), q.tombstonedKeys.clear(), q.pulled = !0, yD6(A.serverErrorCode === AVY ? "not-available" : "empty"), G98(z, {
        success: !0
    }), {
        success: !0,
        filesWritten: 0,
        filesReaped: 0,
        entryCount: 0
    };
    let O = A.data.content.entries,
        w = A.data.content.entryChecksums,
        $ = A.data.content.deletedEntries ?? {};
    if (q.tombstonedKeys = new Set(Object.keys($)), q.serverChecksums.clear(), w)
        for (let [M, P] of Object.entries(w)) q.serverChecksums.set(M, P);
    else E("team-memory-sync: server response missing entryChecksums (pre-#283027 deploy) — next push will be full, not delta", {
        level: "debug"
    });
    let {
        filesWritten: j,
        unwrittenKeys: H
    } = await zVY(O), J = await YVY($);
    if (j > 0 || J > 0) {
        let {
            clearMemoryFileCaches: M
        } = await Promise.resolve().then(() => (PM(), qZ4));
        M()
    }
    for (let M of H) q.serverChecksums.delete(M);
    q.pulled = !0;
    let X = Object.keys(O).length;
    return yD6(X > 0 ? "has-content" : "empty"), E(`team-memory-sync: pulled ${j} files` + (J > 0 ? `, reaped ${J} tombstoned` : "") + (H.size > 0 ? ` (${H.size} entries skipped)` : ""), {
        level: "info"
    }), G98(z, {
        success: !0,
        filesWritten: j,
        filesReaped: J
    }), {
        success: !0,
        filesWritten: j,
        filesReaped: J,
        entryCount: X
    }
}
// @from(Ln 422511, Col 0)
async function GY7(q) {
    let K = Date.now(),
        _ = 0;
    if (!WY7()) return PP6(K, {
        success: !1,
        errorType: "no_oauth"
    }), {
        success: !1,
        filesUploaded: 0,
        error: "OAuth not available",
        errorType: "no_oauth"
    };
    let z = q.repoSlug,
        Y = await _VY(q.serverMaxEntries),
        A = Y.entries,
        O = Y.diskKeys,
        w = Y.diskTrusted,
        $ = Y.skippedSecrets,
        j = [];
    if (q.pulled && w) {
        for (let P of q.serverChecksums.keys())
            if (!O.has(P)) j.push(P)
    } else if (q.pulled && !w) E("team-memory-sync: team dir inaccessible — suppressing soft-delete", {
        level: "warn"
    });
    if ($.length > 0) {
        let P = $.map((W) => `"${W.path}" (${W.label})`).join(", ");
        E(`team-memory-sync: ${$.length} file(s) skipped due to detected secrets: ${P}. Remove the secret(s) to enable sync for these files.`, {
            level: "warn"
        }), d("tengu_team_mem_secret_skipped", {
            file_count: $.length,
            rule_ids: $.map((W) => W.ruleId).join(",")
        })
    }
    let H = new Map;
    for (let [P, W] of Object.entries(A)) {
        if (q.tombstonedKeys.has(P)) continue;
        H.set(P, aTY(W))
    }
    let J = !1,
        X = 0,
        M = 0;
    for (let P = 0; P <= Kn8; P++) {
        let W = {};
        for (let [V, k] of H)
            if (q.serverChecksums.get(V) !== k) W[V] = A[V];
        if (Object.keys(W).length === 0 && j.length === 0) return PP6(K, {
            success: !0,
            filesUploaded: X,
            ...M > 0 && {
                filesSoftDeleted: M
            },
            conflict: J,
            conflictRetries: _
        }), {
            success: !0,
            filesUploaded: X,
            ...M > 0 && {
                filesSoftDeleted: M
            },
            ...$.length > 0 && {
                skippedSecrets: $
            }
        };
        let Z = qVY(W);
        if (Z.length === 0) Z.push({});
        let G;
        for (let V = 0; V < Z.length; V++) {
            let k = Z[V],
                N = V === 0 ? j : void 0;
            if (G = await KVY(q, z, k, q.lastKnownChecksum, N), !G.success) break;
            for (let R of Object.keys(k)) q.serverChecksums.set(R, H.get(R));
            if (X += Object.keys(k).length, N && N.length > 0) {
                for (let R of N) q.serverChecksums.delete(R);
                M += N.length, j.length = 0
            }
        }
        if (G = G, G.success) {
            if (H.size > 0) yD6("has-content");
            let V = M > 0 ? `${X} of ${H.size} files, soft-deleted ${M}` : `${X} of ${H.size} files`;
            return E(Z.length > 1 ? `team-memory-sync: pushed ${V} in ${Z.length} batches` : `team-memory-sync: pushed ${V} (delta)`, {
                level: "info"
            }), PP6(K, {
                success: !0,
                filesUploaded: X,
                ...M > 0 && {
                    filesSoftDeleted: M
                },
                conflict: J,
                conflictRetries: _,
                putBatches: Z.length > 1 ? Z.length : void 0
            }), {
                success: !0,
                filesUploaded: X,
                ...M > 0 && {
                    filesSoftDeleted: M
                },
                checksum: G.checksum,
                ...$.length > 0 && {
                    skippedSecrets: $
                }
            }
        }
        if (!G.conflict) {
            if (G.serverMaxEntries !== void 0) q.serverMaxEntries = G.serverMaxEntries, E(`team-memory-sync: learned server max_entries=${G.serverMaxEntries} from 413; next push will truncate to this`, {
                level: "warn"
            });
            return PP6(K, {
                success: !1,
                filesUploaded: X,
                ...M > 0 && {
                    filesSoftDeleted: M
                },
                conflictRetries: _,
                putBatches: Z.length > 1 ? Z.length : void 0,
                errorType: G.errorType,
                status: G.httpStatus,
                errorCode: G.serverErrorCode,
                serverMaxEntries: G.serverMaxEntries,
                serverReceivedEntries: G.serverReceivedEntries,
                serverMessage: G.serverMessage,
                serverErrorCode: G.serverErrorCode,
                serverErrorType: G.serverErrorType
            }), {
                success: !1,
                filesUploaded: X,
                ...M > 0 && {
                    filesSoftDeleted: M
                },
                error: G.error,
                errorType: G.errorType,
                httpStatus: G.httpStatus,
                serverMessage: G.serverMessage,
                serverErrorCode: G.serverErrorCode,
                serverErrorType: G.serverErrorType
            }
        }
        if (J = !0, P >= Kn8) return E(`team-memory-sync: giving up after ${Kn8} conflict retries`, {
            level: "warn"
        }), PP6(K, {
            success: !1,
            filesUploaded: X,
            ...M > 0 && {
                filesSoftDeleted: M
            },
            conflict: !0,
            conflictRetries: _,
            errorType: "conflict"
        }), {
            success: !1,
            filesUploaded: X,
            ...M > 0 && {
                filesSoftDeleted: M
            },
            conflict: !0,
            error: "Conflict resolution failed after retries"
        };
        _++, E(`team-memory-sync: conflict (412), probing server hashes (attempt ${P+1}/${Kn8})`, {
            level: "info"
        });
        let f = await tTY(q, z);
        if (!f.success || !f.entryChecksums) {
            let V = f.errorType === "parse" ? void 0 : f.errorType;
            return PP6(K, {
                success: !1,
                filesUploaded: X,
                ...M > 0 && {
                    filesSoftDeleted: M
                },
                conflict: !0,
                conflictRetries: _,
                errorType: V ?? "conflict",
                status: f.httpStatus,
                serverMessage: f.serverMessage,
                serverErrorCode: f.serverErrorCode,
                serverErrorType: f.serverErrorType
            }), {
                success: !1,
                filesUploaded: X,
                ...M > 0 && {
                    filesSoftDeleted: M
                },
                conflict: !0,
                error: `Conflict resolution hashes probe failed: ${f.error}`,
                ...V !== void 0 && {
                    errorType: V
                },
                ...f.httpStatus !== void 0 && {
                    httpStatus: f.httpStatus
                },
                ...f.serverMessage !== void 0 && {
                    serverMessage: f.serverMessage
                },
                ...f.serverErrorCode !== void 0 && {
                    serverErrorCode: f.serverErrorCode
                },
                ...f.serverErrorType !== void 0 && {
                    serverErrorType: f.serverErrorType
                }
            }
        }
        let v = new Set(q.serverChecksums.keys());
        q.serverChecksums.clear();
        for (let [V, k] of Object.entries(f.entryChecksums))
            if (v.has(V) || O.has(V)) q.serverChecksums.set(V, k);
        for (let V of Object.keys(f.deletedEntries ?? {})) H.delete(V), q.tombstonedKeys.add(V)
    }
    return PP6(K, {
        success: !1,
        filesUploaded: X,
        ...M > 0 && {
            filesSoftDeleted: M
        },
        conflictRetries: _
    }), {
        success: !1,
        filesUploaded: X,
        ...M > 0 && {
            filesSoftDeleted: M
        },
        error: "Unexpected end of conflict resolution loop"
    }
}
// @from(Ln 422735, Col 0)
function G98(q, K) {
    d("tengu_team_mem_sync_pull", {
        success: K.success,
        files_written: K.filesWritten ?? 0,
        not_modified: K.notModified ?? !1,
        duration_ms: Date.now() - q,
        ...K.filesReaped && {
            files_reaped: K.filesReaped
        },
        ...K.errorType && {
            errorType: K.errorType
        },
        ...K.status && {
            status: K.status
        },
        ...K.serverMessage !== void 0 && {
            server_message: K.serverMessage
        },
        ...K.serverErrorCode !== void 0 && {
            server_error_code: K.serverErrorCode
        },
        ...K.serverErrorType !== void 0 && {
            server_error_type: K.serverErrorType
        }
    })
}
// @from(Ln 422762, Col 0)
function PP6(q, K) {
    d("tengu_team_mem_sync_push", {
        success: K.success,
        files_uploaded: K.filesUploaded ?? 0,
        conflict: K.conflict ?? !1,
        conflict_retries: K.conflictRetries ?? 0,
        duration_ms: Date.now() - q,
        ...K.filesSoftDeleted && {
            files_soft_deleted: K.filesSoftDeleted
        },
        ...K.errorType && {
            errorType: K.errorType
        },
        ...K.status && {
            status: K.status
        },
        ...K.putBatches && {
            put_batches: K.putBatches
        },
        ...K.errorCode && {
            error_code: K.errorCode
        },
        ...K.serverMaxEntries !== void 0 && {
            server_max_entries: K.serverMaxEntries
        },
        ...K.serverReceivedEntries !== void 0 && {
            server_received_entries: K.serverReceivedEntries
        },
        ...K.serverErrorCode !== void 0 && {
            server_error_code: K.serverErrorCode
        },
        ...K.serverMessage !== void 0 && {
            server_message: K.serverMessage
        },
        ...K.serverErrorType !== void 0 && {
            server_error_type: K.serverErrorType
        }
    })
}
// @from(Ln 422801, Col 4)
PY7 = 30000
// @from(Ln 422802, Col 4)
MY7 = 250000
// @from(Ln 422803, Col 4)
oTY = 200000
// @from(Ln 422804, Col 4)
JY7 = 3
// @from(Ln 422805, Col 4)
Kn8 = 2
// @from(Ln 422806, Col 4)
jSK = 256
// @from(Ln 422807, Col 4)
AVY = "team_memory_feature_unavailable"
// @from(Ln 422808, Col 4)
WSK = L(() => {
    CK();
    y8();
    z3();
    ev();
    T7();
    K8();
    m8();
    x9();
    Zb6();
    e8();
    C8();
    Z36();
    $SK()
})
// @from(Ln 422823, Col 4)
VY7 = {}
// @from(Ln 422844, Col 0)
function DSK(q) {
    if (q.errorType === "no_oauth") return !0;
    if (q.httpStatus !== void 0 && q.httpStatus >= 400 && q.httpStatus < 500 && q.httpStatus !== 409 && q.httpStatus !== 429) return !0;
    return !1
}
// @from(Ln 422849, Col 0)
async function JVY() {
    if (!k_6) return;
    _n8 = !0;
    try {
        let q = await GY7(k_6);
        if (q.success) zn8 = !1;
        if (q.success && q.filesUploaded > 0) E(`team-memory-watcher: pushed ${q.filesUploaded} files`, {
            level: "info"
        });
        else if (!q.success) {
            if (E(`team-memory-watcher: push failed: ${q.error}`, {
                    level: "warn"
                }), DSK(q) && LS === null) {
                if (LS = q.serverErrorCode ?? (q.httpStatus !== void 0 ? `http_${q.httpStatus}` : q.errorType ?? "unknown"), q.serverErrorCode === "team_memory_group_acl_denied" || q.serverErrorCode === "team_memory_group_acl_unconfigured") E(`team-memory-watcher: ${q.serverMessage||"Team memory is restricted to specific groups for your organization."} Contact your administrator for access.`, {
                    level: "warn"
                });
                let K = TY7.has(LS) ? " (recoverable via file deletion)" : "";
                E(`team-memory-watcher: suppressing retry for the rest of this session (${LS})${K}`, {
                    level: "warn"
                }), d("tengu_team_mem_push_suppressed", {
                    reason: LS,
                    ...q.httpStatus && {
                        status: q.httpStatus
                    },
                    ...q.serverMessage !== void 0 && {
                        server_message: q.serverMessage
                    },
                    ...q.serverErrorCode !== void 0 && {
                        server_error_code: q.serverErrorCode
                    },
                    ...q.serverErrorType !== void 0 && {
                        server_error_type: q.serverErrorType
                    }
                })
            }
        }
    } catch (q) {
        E(`team-memory-watcher: push error: ${b6(q)}`, {
            level: "warn"
        })
    } finally {
        _n8 = !1, T98 = null
    }
}
// @from(Ln 422894, Col 0)
function v98() {
    if (LS !== null) return;
    if (zn8 = !0, WP6) clearTimeout(WP6);
    WP6 = setTimeout(() => {
        if (_n8) {
            v98();
            return
        }
        T98 = JVY()
    }, HVY)
}
// @from(Ln 422905, Col 0)
async function ZSK(q) {
    if (vY7) return;
    vY7 = !0;
    try {
        await wVY(q, {
            recursive: !0
        }), qx6 = OVY(q, {
            persistent: !0,
            recursive: !0
        }, (K, _) => {
            if (_ === null) {
                v98();
                return
            }
            if (LS !== null) {
                if (!TY7.has(LS)) return;
                $VY(jVY(q, _)).catch((z) => {
                    if (z.code !== "ENOENT") return;
                    if (LS !== null) E(`team-memory-watcher: unlink cleared suppression (was: ${LS})`, {
                        level: "info"
                    }), LS = null;
                    v98()
                });
                return
            }
            v98()
        }), qx6.on("error", (K) => {
            E(`team-memory-watcher: fs.watch error: ${b6(K)}`, {
                level: "warn"
            })
        }), E(`team-memory-watcher: watching ${q}`, {
            level: "debug"
        })
    } catch (K) {
        E(`team-memory-watcher: failed to watch ${q}: ${b6(K)}`, {
            level: "warn"
        })
    }
    eq(async () => fSK())
}
// @from(Ln 422945, Col 0)
async function XVY() {
    if (!Ye6() || !MSK()) return;
    let q = await mA6();
    if (!q) {
        E("team-memory-watcher: no github.com remote, skipping sync", {
            level: "debug"
        });
        return
    }
    k_6 = JSK(q);
    let K = !1,
        _ = 0,
        z = 0,
        Y = !1;
    try {
        let A = await PSK(k_6);
        if (K = A.success, Y = A.entryCount > 0, A.success && (A.filesWritten > 0 || A.filesReaped > 0)) _ = A.filesWritten, z = A.filesReaped, E(`team-memory-watcher: initial pull got ${A.filesWritten} files` + (A.filesReaped > 0 ? `, reaped ${A.filesReaped} tombstoned` : ""), {
            level: "info"
        })
    } catch (A) {
        E(`team-memory-watcher: initial pull failed: ${b6(A)}`, {
            level: "warn"
        })
    }
    await ZSK(vp()), d("tengu_team_mem_sync_started", {
        initial_pull_success: K,
        initial_files_pulled: _,
        initial_files_reaped: z,
        watcher_started: !0,
        server_has_content: Y
    })
}
// @from(Ln 422977, Col 0)
async function MVY() {
    if (!k_6) return;
    v98()
}
// @from(Ln 422981, Col 0)
async function fSK() {
    if (WP6) clearTimeout(WP6), WP6 = null;
    if (qx6) qx6.close(), qx6 = null;
    if (T98) try {
        await T98
    } catch {}
    if (zn8 && k_6 && LS === null) try {
        await GY7(k_6)
    } catch {}
}
// @from(Ln 422992, Col 0)
function PVY(q) {
    qx6 = null, WP6 = null, _n8 = !1, zn8 = !1, T98 = null, vY7 = q?.skipWatcher ?? !1, LS = q?.pushSuppressedReason ?? null, k_6 = q?.syncState ?? null
}
// @from(Ln 422996, Col 0)
function WVY(q) {
    return ZSK(q)
}
// @from(Ln 422999, Col 4)
HVY = 2000
// @from(Ln 423000, Col 4)
qx6 = null
// @from(Ln 423001, Col 4)
WP6 = null
// @from(Ln 423002, Col 4)
_n8 = !1
// @from(Ln 423003, Col 4)
zn8 = !1
// @from(Ln 423004, Col 4)
T98 = null
// @from(Ln 423005, Col 4)
vY7 = !1
// @from(Ln 423006, Col 4)
LS = null
// @from(Ln 423007, Col 4)
TY7
// @from(Ln 423007, Col 9)
k_6 = null
// @from(Ln 423008, Col 4)
kY7 = L(() => {
    ev();
    R9();
    K8();
    m8();
    pK();
    C8();
    WSK();
    TY7 = new Set(["http_413", "team_memory_too_many_entries"])
})
// @from(Ln 423018, Col 4)
kSK = {}
// @from(Ln 423024, Col 0)
function TSK(q, K) {
    switch (q) {
        case xq: {
            let _ = Kz.inputSchema.safeParse(K);
            return _.success ? _.data.file_path : null
        }
        case J4: {
            let _ = CU8().safeParse(K);
            return _.success ? _.data.file_path : null
        }
        case IK: {
            let _ = hX.inputSchema.safeParse(K);
            return _.success ? _.data.file_path : null
        }
        default:
            return null
    }
}
// @from(Ln 423043, Col 0)
function VSK(q, K) {
    switch (q) {
        case xq: {
            let _ = Kz.inputSchema.safeParse(K);
            if (!_.success) return null;
            return Q38(_.data.file_path)
        }
        case a5: {
            let _ = _N.inputSchema.safeParse(K);
            if (!_.success) return null;
            if (_.data.path) {
                let z = Q38(_.data.path);
                if (z) return z
            }
            if (_.data.glob) {
                let z = ac8(_.data.glob);
                if (z) return z
            }
            return null
        }
        case T9: {
            let _ = Au.inputSchema.safeParse(K);
            if (!_.success) return null;
            if (_.data.path) {
                let Y = Q38(_.data.path);
                if (Y) return Y
            }
            let z = ac8(_.data.pattern);
            if (z) return z;
            return null
        }
        default:
            return null
    }
}
// @from(Ln 423079, Col 0)
function NY7(q, K) {
    if (VSK(q, K) === "session_memory") return !0;
    let _ = TSK(q, K);
    if (_ && (YP6(_) || vSK.isTeamMemFile(_))) return !0;
    return !1
}
// @from(Ln 423085, Col 0)
async function DVY(q, K, _) {
    if (q.hook_event_name !== "PostToolUse") return {};
    let z = VSK(q.tool_name, q.tool_input),
        Y = r74(),
        A = Y ? {
            subagent_name: Y
        } : {};
    if (z === "session_memory") d("tengu_session_memory_accessed", {
        ...A
    });
    else if (z === "session_transcript") d("tengu_transcript_accessed", {
        ...A
    });
    let O = TSK(q.tool_name, q.tool_input);
    if (O && YP6(O)) switch (d("tengu_memdir_accessed", {
            tool: q.tool_name,
            ...A
        }), q.tool_name) {
        case xq:
            d("tengu_memdir_file_read", {
                ...A
            });
            break;
        case J4:
            d("tengu_memdir_file_edit", {
                ...A
            });
            break;
        case IK:
            d("tengu_memdir_file_write", {
                ...A
            });
            break
    }
    if (O && vSK.isTeamMemFile(O)) switch (d("tengu_team_mem_accessed", {
            tool: q.tool_name,
            ...A
        }), q.tool_name) {
        case xq:
            d("tengu_team_mem_file_read", {
                ...A
            });
            break;
        case J4:
            d("tengu_team_mem_file_edit", {
                ...A
            }), GSK?.notifyTeamMemoryWrite();
            break;
        case IK:
            d("tengu_team_mem_file_write", {
                ...A
            }), GSK?.notifyTeamMemoryWrite();
            break
    }
    return {}
}
// @from(Ln 423142, Col 0)
function ZVY() {
    let q = {
        type: "callback",
        callback: DVY,
        timeout: 1,
        internal: !0
    };
    Ii({
        PostToolUse: [{
            matcher: xq,
            hooks: [q]
        }, {
            matcher: a5,
            hooks: [q]
        }, {
            matcher: T9,
            hooks: [q]
        }, {
            matcher: J4,
            hooks: [q]
        }, {
            matcher: IK,
            hooks: [q]
        }]
    })
}
// @from(Ln 423168, Col 4)
vSK
// @from(Ln 423168, Col 9)
GSK
// @from(Ln 423169, Col 4)
EY7 = L(() => {
    y8();
    C8();
    A58();
    aF();
    Rz();
    rl();
    u$();
    yb6();
    c96();
    jJ();
    UI6();
    mB();
    vSK = (ev(), B7(Tp)), GSK = (kY7(), B7(VY7))
})
// @from(Ln 423185, Col 0)
function NSK() {
    return !1
}
// @from(Ln 423188, Col 4)
DP6 = L(() => {
    sR();
    h1();
    Q8()
})
// @from(Ln 423197, Col 0)
function Kx6() {
    if (ED6() === "remote") {
        let O = process.env.CLAUDE_CODE_REMOTE_SESSION_ID;
        if (O) {
            let w = process.env.SESSION_INGRESS_URL;
            if (!Me6(O, w)) {
                let $ = g2(O, w);
                return {
                    commit: $,
                    pr: $
                }
            }
        }
        return {
            commit: "",
            pr: ""
        }
    }
    let q = G5(),
        K = _q6(q) !== null,
        _ = uc4() || K ? zT1(q) : "Claude Opus 4.7",
        z = `\uD83E\uDD16 Generated with [Claude Code](${uj6})`,
        Y = `Co-Authored-By: ${_} <noreply@anthropic.com>`,
        A = v7();
    if (A.attribution) return {
        commit: A.attribution.commit ?? Y,
        pr: A.attribution.pr ?? z
    };
    if (A.includeCoAuthoredBy === !1) return {
        commit: "",
        pr: ""
    };
    return {
        commit: Y,
        pr: z
    }
}
// @from(Ln 423235, Col 0)
function ESK(q) {
    for (let K of Cu7)
        if (q.includes(`<${K}>`)) return !0;
    return !1
}
// @from(Ln 423241, Col 0)
function GVY(q) {
    let K = 0;
    for (let _ of q) {
        if (_.type !== "user") continue;
        let z = _.message?.content;
        if (!z) continue;
        let Y = !1;
        if (typeof z === "string") {
            if (ESK(z)) continue;
            Y = z.trim().length > 0
        } else if (Array.isArray(z)) Y = z.some((A) => {
            if (!A || typeof A !== "object" || !("type" in A)) return !1;
            return A.type === "text" && typeof A.text === "string" && !ESK(A.text) || A.type === "image" || A.type === "document"
        });
        if (Y) K++
    }
    return K
}
// @from(Ln 423260, Col 0)
function vVY(q) {
    let K = q.filter((_) => _.type === "user" && !(("isSidechain" in _) && _.isSidechain));
    return GVY(K)
}
// @from(Ln 423264, Col 0)
async function TVY(q) {
    let K = q.attribution;
    if (!K) return null;
    let _ = K.fileStates,
        Y = _ instanceof Map ? Array.from(_.keys()) : Object.keys(_);
    if (Y.length === 0) return null;
    try {
        return await Na1([K], Y)
    } catch (A) {
        return j6(A), null
    }
}
// @from(Ln 423277, Col 0)
function kVY(q) {
    let K = 0;
    for (let _ of q) {
        if (_.type !== "assistant") continue;
        let z = _.message?.content;
        if (!Array.isArray(z)) continue;
        for (let Y of z) {
            if (Y.type !== "tool_use" || !VVY.has(Y.name)) continue;
            if (NY7(Y.name, Y.input)) K++
        }
    }
    return K
}
// @from(Ln 423290, Col 0)
async function NVY() {
    try {
        let q = bY(),
            K = (await fVY(q)).size,
            z = (await pm7(q, K)).postBoundaryBuf,
            Y = Nr(z),
            A = Y.findLastIndex((w) => w.type === "system" && ("subtype" in w) && w.subtype === "compact_boundary"),
            O = A >= 0 ? Y.slice(A + 1) : Y;
        return {
            promptCount: vVY(O),
            memoryAccessCount: kVY(O)
        }
    } catch {
        return {
            promptCount: 0,
            memoryAccessCount: 0
        }
    }
}
// @from(Ln 423309, Col 0)
async function ySK(q) {
    if (ED6() === "remote") {
        let M = process.env.CLAUDE_CODE_REMOTE_SESSION_ID;
        if (M) {
            let P = process.env.SESSION_INGRESS_URL;
            if (!Me6(M, P)) return g2(M, P)
        }
        return ""
    }
    let K = v7();
    if (K.attribution?.pr) return K.attribution.pr;
    if (K.includeCoAuthoredBy === !1) return "";
    let _ = `\uD83E\uDD16 Generated with [Claude Code](${uj6})`,
        z = q();
    if (E(`PR Attribution: appState.attribution exists: ${!!z.attribution}`), z.attribution) {
        let M = z.attribution.fileStates,
            W = M instanceof Map ? M.size : Object.keys(M).length;
        E(`PR Attribution: fileStates count: ${W}`)
    }
    let [Y, {
        promptCount: A,
        memoryAccessCount: O
    }, w] = await Promise.all([TVY(z), NVY(), Fu8()]), $ = Y?.summary.claudePercent ?? 0;
    E(`PR Attribution: claudePercent: ${$}, promptCount: ${A}, memoryAccessCount: ${O}`);
    let j = o5(G5()),
        H = w ? j : mc4(j);
    if ($ === 0 && A === 0 && O === 0) return E("PR Attribution: returning default (no data)"), _;
    let J = O > 0 ? `, ${O} ${O===1?"memory":"memories"} recalled` : "",
        X = `\uD83E\uDD16 Generated with [Claude Code](${uj6}) (${$}% ${A}-shotted by ${H}${J})`;
    return E(`PR Attribution: returning summary: ${X}`), X
}
// @from(Ln 423340, Col 4)
VVY
// @from(Ln 423341, Col 4)
An8 = L(() => {
    y8();
    rA();
    Rz();
    u$();
    jJ();
    sR();
    K8();
    mO();
    U8();
    Sq();
    EY7();
    g4();
    hm();
    a1();
    DP6();
    VVY = new Set([xq, a5, T9, J4, IK])
})
// @from(Ln 423360, Col 0)
function On8() {
    return BI6()
}
// @from(Ln 423364, Col 0)
function V98() {
    return gc8()
}
// @from(Ln 423368, Col 0)
function yVY() {
    if (S6(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS)) return null;
    return "You can use the `run_in_background` parameter to run the command in the background. Only use this if you don't need the result immediately and are OK being notified when the command completes later. You do not need to check the output right away - you'll be notified when it finishes. You do not need to use '&' at the end of the command when using this parameter."
}
// @from(Ln 423373, Col 0)
function LSK() {
    if (!$S8()) return "";
    let {
        commit: K,
        pr: _
    } = Kx6();
    return `# Committing changes with git

Only create commits when requested by the user. If unclear, ask first. When the user asks you to create a new git commit, follow these steps carefully:

You can call multiple tools in a single response. When multiple independent pieces of information are requested and all commands are likely to succeed, run multiple tool calls in parallel for optimal performance. The numbered steps below indicate which commands should be batched in parallel.

Git Safety Protocol:
- NEVER update the git config
- NEVER run destructive git commands (push --force, reset --hard, checkout ., restore ., clean -f, branch -D) unless the user explicitly requests these actions. Taking unauthorized destructive actions is unhelpful and can result in lost work, so it's best to ONLY run these commands when given direct instructions 
- NEVER skip hooks (--no-verify, --no-gpg-sign, etc) unless the user explicitly requests it
- NEVER run force push to main/master, warn the user if they request it
- CRITICAL: Always create NEW commits rather than amending, unless the user explicitly requests a git amend. When a pre-commit hook fails, the commit did NOT happen — so --amend would modify the PREVIOUS commit, which may result in destroying work or losing previous changes. Instead, after hook failure, fix the issue, re-stage, and create a NEW commit
- When staging files, prefer adding specific files by name rather than using "git add -A" or "git add .", which can accidentally include sensitive files (.env, credentials) or large binaries
- NEVER commit changes unless the user explicitly asks you to. It is VERY IMPORTANT to only commit when explicitly asked, otherwise the user will feel that you are being too proactive

1. Run the following bash commands in parallel, each using the ${S7} tool:
  - Run a git status command to see all untracked files. IMPORTANT: Never use the -uall flag as it can cause memory issues on large repos.
  - Run a git diff command to see both staged and unstaged changes that will be committed.
  - Run a git log command to see recent commit messages, so that you can follow this repository's commit message style.
2. Analyze all staged changes (both previously staged and newly added) and draft a commit message:
  - Summarize the nature of the changes (eg. new feature, enhancement to an existing feature, bug fix, refactoring, test, docs, etc.). Ensure the message accurately reflects the changes and their purpose (i.e. "add" means a wholly new feature, "update" means an enhancement to an existing feature, "fix" means a bug fix, etc.).
  - Do not commit files that likely contain secrets (.env, credentials.json, etc). Warn the user if they specifically request to commit those files
  - Draft a concise (1-2 sentences) commit message that focuses on the "why" rather than the "what"
  - Ensure it accurately reflects the changes and their purpose
3. Run the following commands in parallel:
   - Add relevant untracked files to the staging area.
   - Create the commit with a message${K?` ending with:
   ${K}`:"."}
   - Run git status after the commit completes to verify success.
   Note: git status depends on the commit completing, so run it sequentially after the commit.
4. If the commit fails due to pre-commit hook: fix the issue and create a NEW commit

Important notes:
- NEVER run additional commands to read or explore code, besides git bash commands
- NEVER use the ${YF.name} or ${T4} tools
- DO NOT push to the remote repository unless the user explicitly asks you to do so
- IMPORTANT: Never use git commands with the -i flag (like git rebase -i or git add -i) since they require interactive input which is not supported.
- IMPORTANT: Do not use --no-edit with git rebase commands, as the --no-edit flag is not a valid option for git rebase.
- If there are no changes to commit (i.e., no untracked files and no modifications), do not create an empty commit
- In order to ensure good formatting, ALWAYS pass the commit message via a HEREDOC, a la this example:
<example>
git commit -m "$(cat <<'EOF'
   Commit message here.${K?`

   ${K}`:""}
   EOF
   )"
</example>

# Creating pull requests
Use the gh command via the Bash tool for ALL GitHub-related tasks including working with issues, pull requests, checks, and releases. If given a Github URL use the gh command to get the information needed.

IMPORTANT: When the user asks you to create a pull request, follow these steps carefully:

1. Run the following bash commands in parallel using the ${S7} tool, in order to understand the current state of the branch since it diverged from the main branch:
   - Run a git status command to see all untracked files (never use -uall flag)
   - Run a git diff command to see both staged and unstaged changes that will be committed
   - Check if the current branch tracks a remote branch and is up to date with the remote, so you know if you need to push to the remote
   - Run a git log command and \`git diff [base-branch]...HEAD\` to understand the full commit history for the current branch (from the time it diverged from the base branch)
2. Analyze all changes that will be included in the pull request, making sure to look at all relevant commits (NOT just the latest commit, but ALL commits that will be included in the pull request!!!), and draft a pull request title and summary:
   - Keep the PR title short (under 70 characters)
   - Use the description/body for details, not the title
3. Run the following commands in parallel:
   - Create new branch if needed
   - Push to remote with -u flag if needed
   - Create PR using gh pr create with the format below. Use a HEREDOC to pass the body to ensure correct formatting.
<example>
gh pr create --title "the pr title" --body "$(cat <<'EOF'
## Summary
<1-3 bullet points>

## Test plan
[Bulleted markdown checklist of TODOs for testing the pull request...]${_?`

${_}`:""}
EOF
)"
</example>

Important:
- DO NOT use the ${YF.name} or ${T4} tools
- Return the PR URL when you're done, so the user can see it

# Other common operations
- View comments on a Github PR: gh api repos/foo/bar/pulls/123/comments`
}
// @from(Ln 423466, Col 0)
function _x6(q) {
    if (!q || q.length === 0) return q;
    return F4(q)
}
// @from(Ln 423471, Col 0)
function LVY() {
    if (!Z7.isSandboxingEnabled()) return "";
    let q = Z7.getFsReadConfig(),
        K = Z7.getFsWriteConfig(),
        _ = Z7.getNetworkRestrictionConfig(),
        z = Z7.getAllowUnixSockets(),
        Y = Z7.getIgnoreViolations(),
        A = Z7.areUnsandboxedCommandsAllowed(),
        O = iv(),
        w = (M) => F4(M).map((P) => P === O ? "$TMPDIR" : P),
        $ = {
            read: {
                denyOnly: _x6(q.denyOnly),
                ...q.allowWithinDeny && {
                    allowWithinDeny: _x6(q.allowWithinDeny)
                }
            },
            write: {
                allowOnly: w(K.allowOnly),
                denyWithinAllow: _x6(K.denyWithinAllow)
            }
        },
        j = {
            ..._?.allowedHosts && {
                allowedHosts: _x6(_.allowedHosts)
            },
            ..._?.deniedHosts && {
                deniedHosts: _x6(_.deniedHosts)
            },
            ...z && {
                allowUnixSockets: _x6(z)
            }
        },
        H = [];
    if (Object.keys($).length > 0) H.push(`Filesystem: ${I6($)}`);
    if (Object.keys(j).length > 0) H.push(`Network: ${I6(j)}`);
    if (Y) H.push(`Ignored violations: ${I6(Y)}`);
    let X = [...A ? ["You should always default to running commands within the sandbox. Do NOT attempt to set `dangerouslyDisableSandbox: true` unless:", ["The user *explicitly* asks you to bypass sandbox", "A specific command just failed and you see evidence of sandbox restrictions causing the failure. Note that commands can fail for many reasons unrelated to the sandbox (missing files, wrong arguments, network issues, etc.)."], "Evidence of sandbox-caused failures includes:", ['"Operation not permitted" errors for file/network operations', "Access denied to specific paths outside allowed directories", "Network connection failures to non-whitelisted hosts", "Unix socket connection errors"], "When you see evidence of sandbox-caused failure:", ["Immediately retry with `dangerouslyDisableSandbox: true` (don't ask, just do it)", "Briefly explain what sandbox restriction likely caused the failure. Be sure to mention that the user can use the `/sandbox` command to manage restrictions.", "This will prompt the user for permission"], "Treat each command you execute with `dangerouslyDisableSandbox: true` individually. Even if you have recently run a command with this setting, you should default to running future commands within the sandbox.", "Do not suggest adding sensitive paths like ~/.bashrc, ~/.zshrc, ~/.ssh/*, or credential files to the sandbox allowlist."] : ["All commands MUST run in sandbox mode - the `dangerouslyDisableSandbox` parameter is disabled by policy.", "Commands cannot run outside the sandbox under any circumstances.", "If a command fails due to sandbox restrictions, work with the user to adjust sandbox settings instead."], "For temporary files, always use the `$TMPDIR` environment variable. TMPDIR is automatically set to the correct sandbox-writable directory in sandbox mode. Do NOT use `/tmp` directly - use `$TMPDIR` instead."];
    return ["", "## Command sandbox", "By default, your command will be run in a sandbox. This sandbox controls which directories and network hosts commands may access or modify without an explicit override.", "", "The sandbox has the following restrictions:", H.join(`
`), "", ...Yg(X)].join(`
`)
}
// @from(Ln 423514, Col 0)
function hSK() {
    let q = $H(),
        K = [...q ? [] : [`File search: Use ${T9} (NOT find or ls)`, `Content search: Use ${a5} (NOT grep or rg)`], `Read files: Use ${xq} (NOT cat/head/tail)`, `Edit files: Use ${J4} (NOT sed/awk)`, `Write files: Use ${IK} (NOT echo >/cat <<EOF)`, "Communication: Output text directly (NOT echo/printf)"],
        _ = q ? "`cat`, `head`, `tail`, `sed`, `awk`, or `echo`" : "`find`, `grep`, `cat`, `head`, `tail`, `sed`, `awk`, or `echo`",
        z = u8("tengu_relay_chain_v1", !1) ? [] : ["When issuing multiple commands:", [`If the commands are independent and can run in parallel, make multiple ${S7} tool calls in a single message. Example: if you need to run "git status" and "git diff", send a single message with two ${S7} tool calls in parallel.`, `If the commands depend on each other and must run sequentially, use a single ${S7} call with '&&' to chain them together.`, "Use ';' only when you need to run commands sequentially but don't care if earlier commands fail.", "DO NOT use newlines to separate commands (newlines are ok in quoted strings)."]],
        Y = ["Prefer to create a new commit rather than amending an existing commit.", "Before running destructive operations (e.g., git reset --hard, git push --force, git checkout --), consider whether there is a safer alternative that achieves the same goal. Only use destructive operations when they are truly the best approach.", "Never skip hooks (--no-verify) or bypass signing (--no-gpg-sign, -c commit.gpgsign=false) unless the user has explicitly asked for it. If a hook fails, investigate and fix the underlying issue."],
        A = ["Do not sleep between commands that can run immediately — just run them.", ...KF() ? ['Use the Monitor tool to stream events from a background process (each stdout line is a notification). For one-shot "wait until done," use Bash with run_in_background instead.'] : [], "If your command is long running and you would like to be notified when it finishes — use `run_in_background`. No sleep needed.", "Do not retry failing commands in a sleep loop — diagnose the root cause.", "If waiting for a background task you started with `run_in_background`, you will be notified when it completes — do not poll.", ...KF() ? ["Long leading `sleep` commands are blocked. To poll until a condition is met, use Monitor with an until-loop (e.g. `until <check>; do sleep 2; done`) — you get a notification when the loop exits. Do not chain shorter sleeps to work around the block."] : ["If you must poll an external process, use a check command (e.g. `gh run view`) rather than sleeping first.", "If you must sleep, keep the duration short to avoid blocking the user."]],
        O = yVY(),
        w = A36() ? "To rerun a prior command exactly, emit {rerun:'bN'} from the result footer instead of retyping the command." : null,
        $ = [...w !== null ? [w] : [], "If your command will create new directories or files, first use this tool to run `ls` to verify the parent directory exists and is the correct location.", 'Always quote file paths that contain spaces with double quotes in your command (e.g., cd "path with spaces/file.txt")', "Try to maintain your current working directory throughout the session by using absolute paths and avoiding usage of `cd`. You may use `cd` if the User explicitly requests it.", `You may specify an optional timeout in milliseconds (up to ${V98()}ms / ${V98()/60000} minutes). By default, your command will timeout after ${On8()}ms (${On8()/60000} minutes).`, ...O !== null ? [O] : [], ...z, "For git commands:", Y, "Avoid unnecessary `sleep` commands:", A, ...q ? ["When using `find -regex` with alternation, put the longest alternative first. Example: use `'.*\\.\\(tsx\\|ts\\)'` not `'.*\\.\\(ts\\|tsx\\)'` — the second form silently skips `.tsx` files."] : []];
    return ["Executes a given bash command and returns its output.", "", "The working directory persists between commands, but shell state does not. The shell environment is initialized from the user's profile (bash or zsh).", "", `IMPORTANT: Avoid using this tool to run ${_} commands, unless explicitly instructed or after you have verified that a dedicated tool cannot accomplish your task. Instead, use the appropriate dedicated tool as this will provide a much better experience for the user:`, "", ...Yg(K), `While the ${S7} tool can do similar things, it’s better to use the built-in tools as they provide a better user experience and make it easier to review tool calls and give permission.`, "", "# Instructions", ...Yg($), LVY(), ...LSK() ? ["", LSK()] : []].join(`
`)
}
// @from(Ln 423527, Col 4)
RSK = L(() => {
    sy();
    B1();
    An8();
    pB();
    Q8();
    qQ1();
    Sz();
    yY();
    e8();
    DP6();
    sY();
    Rz();
    u$();
    jJ();
    zt();
    O78();
    hR6()
})
// @from(Ln 423556, Col 0)
function FVY(q) {
    let K = TO(q);
    if (K.length === 0) return {
        isSearch: !1,
        isRead: !1,
        isList: !1
    };
    let _ = !1,
        z = !1,
        Y = !1,
        A = !1;
    for (let O of K) {
        let w = O.trim().split(/\s+/)[0];
        if (!w || BVY.has(w)) continue;
        A = !0;
        let $ = xVY.has(w),
            j = uVY.has(w),
            H = mVY.has(w);
        if (!$ && !j && !H) return {
            isSearch: !1,
            isRead: !1,
            isList: !1
        };
        if ($) _ = !0;
        if (j) z = !0;
        if (H) Y = !0
    }
    if (!A) return {
        isSearch: !1,
        isRead: !1,
        isList: !1
    };
    return {
        isSearch: _,
        isRead: z,
        isList: Y
    }
}
// @from(Ln 423595, Col 0)
function gVY(q) {
    let K = TO(q);
    if (K.length === 0) return !1;
    let _ = !1;
    for (let z of K) {
        let Y = z.trim().split(/\s+/)[0];
        if (!Y) continue;
        if (_ = !0, !pVY.has(Y)) return !1
    }
    return _
}
// @from(Ln 423607, Col 0)
function yY7(q) {
    let K = TO(q);
    if (K.length === 0) return "other";
    for (let _ of K) {
        let z = i5(_, " ");
        if (QVY.includes(z)) return z
    }
    return "other"
}
// @from(Ln 423617, Col 0)
function cVY(q) {
    let K = TO(q);
    if (K.length === 0) return !0;
    let _ = K[0]?.trim().split(/\s+/)[0];
    if (!_) return !0;
    return !UVY.includes(_)
}
// @from(Ln 423625, Col 0)
function lVY(q) {
    let K = TO(q);
    if (K.length === 0) return null;
    let _ = K[0]?.trim() ?? "",
        z = /^sleep\s+(\d+(?:\.\d*)?)\s*$/.exec(_);
    if (!z) return null;
    let Y = parseFloat(z[1]);
    if (Y < iU8) return null;
    let A = K.slice(1).join(" ").trim();
    return A ? `sleep ${Y} followed by: ${A}` : `standalone sleep ${Y}`
}
// @from(Ln 423636, Col 0)
async function nVY(q, K, _) {
    let {
        filePath: z,
        newContent: Y
    } = q, A = Wq(z), O = V8(), w = fJ8(A), $;
    try {
        $ = await O.readFile(A, {
            encoding: w
        })
    } catch (H) {
        if (t1(H)) return {
            data: {
                stdout: "",
                stderr: `sed: ${z}: No such file or directory
Exit code 1`,
                interrupted: !1
            }
        };
        throw H
    }
    if (kO() && _) await M96(K.getFileHistoryState, K.applyFileHistoryOp, A, _.uuid);
    let j = im7(A);
    return S16(A, Y, w, j), EK6(A, $, Y), K.readFileState.set(A, {
        content: Y,
        timestamp: Av(A),
        offset: void 0,
        limit: void 0
    }), {
        data: {
            stdout: "",
            stderr: "",
            interrupted: !1
        }
    }
}
// @from(Ln 423671, Col 0)
async function rVY(q, K, _) {
    if (!iVY.test(q)) return [];
    let z = [];
    return await Promise.all(Array.from(K.entries(), ([Y, A]) => RA6(Y).then((O) => {
        if (O > _ && O > A.timestamp) z.push(Y)
    }).catch(() => {}))), z
}
// @from(Ln 423678, Col 0)
async function* oVY({
    input: q,
    abortController: K,
    taskRegistry: _,
    abortSpeculation: z,
    setToolJSX: Y,
    emitToolProgress: A,
    preventCwdChanges: O,
    isMainThread: w,
    toolUseId: $,
    agentId: j,
    sessionEnvVars: H,
    tmuxSocket: J
}) {
    let {
        command: X,
        description: M,
        timeout: P,
        run_in_background: W
    } = q, D = Math.min(P || On8(), V98()), Z = "", G = "", f = 0, v = 0, V = void 0, k = !1, N = null;

    function R() {
        return new Promise((g) => {
            N = () => g(null)
        })
    }
    let h = !k98 && cVY(X),
        C = await al(X, K.signal, "bash", {
            timeout: D,
            onProgress(g, c, n, l, z6) {
                G = g, Z = c, f = n, v = z6 ? l : 0;
                let A6 = N;
                if (A6) N = null, A6()
            },
            preventCwdChanges: O,
            shouldUseSandbox: AL(q),
            shouldAutoBackground: h,
            sessionEnvVars: H,
            tmuxSocket: J
        }),
        x = C.result;
    async function B() {
        return (await Y_6({
            command: X,
            description: M || X,
            shellCommand: C,
            toolUseId: $,
            agentId: j
        }, {
            abortController: K,
            taskRegistry: _,
            abortSpeculation: z
        })).taskId
    }

    function m(g, c) {
        if (F) {
            if (!cc8(F, C, M || X, _, z, $)) return;
            V = F, d(g, {
                command_type: yY7(X)
            }), c?.(F);
            return
        }
        B().then((n) => {
            V = n;
            let l = N;
            if (l) N = null, l();
            if (d(g, {
                    command_type: yY7(X)
                }), c) c(n)
        })
    }
    if (C.onTimeout && h) C.onTimeout((g) => {
        m("tengu_bash_command_timeout_backgrounded", g)
    });
    if (W === !0 && !k98) {
        let g = await B();
        return d("tengu_bash_command_explicitly_backgrounded", {
            command_type: yY7(X)
        }), {
            stdout: "",
            stderr: "",
            code: 0,
            interrupted: !1,
            backgroundTaskId: g
        }
    }
    let S = Date.now(),
        F = void 0;
    {
        let g = await Promise.race([x, new Promise((c) => {
            setTimeout((l) => l(null), bSK, c).unref()
        })]);
        if (g !== null) return C.cleanup(), g;
        if (V) return {
            stdout: "",
            stderr: "",
            code: 0,
            interrupted: !1,
            backgroundTaskId: V,
            assistantAutoBackgrounded: k
        }
    }
    uw.startPolling(C.taskOutput.taskId);
    let U = null;
    try {
        while (!0) {
            let g = R(),
                c = await Promise.race([x, g]);
            if (c !== null) {
                if (U = c, c.backgroundTaskId !== void 0) {
                    if (lc8(c.backgroundTaskId, c, _)) I$(c.backgroundTaskId, FI6(c), {
                        toolUseId: $,
                        summary: M || X
                    });
                    let z6 = {
                            ...c,
                            backgroundTaskId: void 0
                        },
                        {
                            taskOutput: A6
                        } = C;
                    if (A6.stdoutToFile && !A6.outputFileRedundant) z6.outputFilePath = A6.path, z6.outputFileSize = A6.outputFileSize, z6.outputTaskId = A6.taskId;
                    return z6
                }
                return c
            }
            if (V) return {
                stdout: "",
                stderr: "",
                code: 0,
                interrupted: !1,
                backgroundTaskId: V,
                assistantAutoBackgrounded: k
            };
            if (F) {
                if (C.status === "backgrounded") return {
                    stdout: "",
                    stderr: "",
                    code: 0,
                    interrupted: !1,
                    backgroundTaskId: F,
                    backgroundedByUser: !0
                }
            }
            let n = Date.now() - S,
                l = Math.floor(n / 1000);
            if (!k98 && V === void 0 && l >= bSK / 1000) {
                if (!F) F = dc8({
                    command: X,
                    description: M || X,
                    shellCommand: C,
                    agentId: j
                }, _, $);
                if (Y?.({
                        jsx: LY7.createElement(G96, null),
                        shouldHidePromptInput: !1,
                        shouldContinueAnimation: !0,
                        showSpinner: !0
                    }), $) A?.({
                    kind: "background_hint",
                    toolUseId: $
                })
            }
            yield {
                type: "progress",
                fullOutput: Z,
                output: G,
                elapsedTimeSeconds: l,
                totalLines: f,
                totalBytes: v,
                taskId: C.taskOutput.taskId,
                ...P ? {
                    timeoutMs: D
                } : void 0
            }
        }
    } finally {
        if (uw.stopPolling(C.taskOutput.taskId), !V && C.status !== "backgrounded") {
            if (F) nc8(F, U ? FI6(U) : "stopped", _);
            C.cleanup()
        }
    }
}
// @from(Ln 423862, Col 4)
LY7
// @from(Ln 423862, Col 9)
CSK = `
`
// @from(Ln 423864, Col 4)
bSK = 2000
// @from(Ln 423865, Col 4)
IVY = 15000
// @from(Ln 423866, Col 4)
xVY
// @from(Ln 423866, Col 9)
uVY
// @from(Ln 423866, Col 14)
mVY
// @from(Ln 423866, Col 19)
BVY
// @from(Ln 423866, Col 24)
pVY
// @from(Ln 423866, Col 29)
UVY
// @from(Ln 423866, Col 34)
k98
// @from(Ln 423866, Col 39)
wn8
// @from(Ln 423866, Col 44)
ISK
// @from(Ln 423866, Col 49)
QVY
// @from(Ln 423866, Col 54)
dVY
// @from(Ln 423866, Col 59)
iVY
// @from(Ln 423866, Col 64)
KK