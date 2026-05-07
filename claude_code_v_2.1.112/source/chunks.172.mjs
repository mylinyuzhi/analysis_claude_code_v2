
// @from(Ln 440718, Col 4)
WRY
// @from(Ln 440718, Col 9)
ZRY
// @from(Ln 440718, Col 14)
TRY
// @from(Ln 440718, Col 19)
ERY
// @from(Ln 440718, Col 24)
yRY
// @from(Ln 440719, Col 4)
YuK = L(() => {
    n5();
    _uK();
    GO7 = de * RP6, WRY = DRY();
    ZRY = fRY();
    TRY = {
        9617: 0.25,
        9618: 0.5,
        9619: 0.75,
        9608: 1
    };
    ERY = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), yRY = LRY()
})
// @from(Ln 440740, Col 0)
async function OuK(q, K) {
    try {
        let _ = AuK(z2(), "claude-code-screenshots");
        await SRY(_, {
            recursive: !0
        });
        let z = AuK(_, `screenshot-${Date.now()}.png`),
            Y = zuK(q, K);
        await bRY(z, Y);
        let A = await IRY(z);
        try {
            await CRY(z)
        } catch {}
        return A
    } catch (_) {
        return j6(_), {
            success: !1,
            message: `Failed to copy screenshot: ${_ instanceof Error?_.message:"Unknown error"}`
        }
    }
}
// @from(Ln 440761, Col 0)
async function IRY(q) {
    let K = y1();
    if (K === "macos") {
        let z = `set the clipboard to (read (POSIX file "${q.replaceAll("\\","\\\\").replaceAll('"',"\\\"")}") as «class PNGf»)`,
            Y = await M7("osascript", ["-e", z], {
                timeout: 5000
            });
        if (Y.code === 0) return {
            success: !0,
            message: "Screenshot copied to clipboard"
        };
        return {
            success: !1,
            message: `Failed to copy to clipboard: ${Y.stderr}`
        }
    }
    if (K === "linux") {
        if ((await M7("xclip", ["-selection", "clipboard", "-t", "image/png", "-i", q], {
                timeout: 5000
            })).code === 0) return {
            success: !0,
            message: "Screenshot copied to clipboard"
        };
        if ((await M7("xsel", ["--clipboard", "--input", "--type", "image/png"], {
                timeout: 5000
            })).code === 0) return {
            success: !0,
            message: "Screenshot copied to clipboard"
        };
        return {
            success: !1,
            message: "Failed to copy to clipboard. Please install xclip or xsel: sudo apt install xclip"
        }
    }
    if (K === "windows") {
        let _ = `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Clipboard]::SetImage([System.Drawing.Image]::FromFile('${q.replaceAll("'","''")}'))`,
            z = await M7("powershell", ["-NoProfile", "-Command", _], {
                timeout: 5000
            });
        if (z.code === 0) return {
            success: !0,
            message: "Screenshot copied to clipboard"
        };
        return {
            success: !1,
            message: `Failed to copy to clipboard: ${z.stderr}`
        }
    }
    return {
        success: !1,
        message: `Screenshot to clipboard is not supported on ${K}`
    }
}
// @from(Ln 440814, Col 4)
wuK = L(() => {
    YuK();
    Q4();
    U8();
    NK();
    cW()
})
// @from(Ln 440829, Col 0)
async function Ai8(q, K = {}) {
    let {
        fromDate: _,
        toDate: z
    } = K, Y = V8(), A = new Map, O = new Map, w = [], $ = new Map, j = 0, H = 0, J = {}, X = void 0, M = new Set, P = 20;
    for (let W = 0; W < q.length; W += P) {
        let D = q.slice(W, W + P),
            Z = await Promise.all(D.map(async (G) => {
                try {
                    if (_) {
                        let v = 0;
                        try {
                            let V = await Y.stat(G),
                                k = $g(V.mtime);
                            if (Gx6(k, _)) return {
                                sessionFile: G,
                                entries: null,
                                error: null,
                                skipped: !0
                            };
                            v = V.size
                        } catch {}
                        if (v > 65536) {
                            let V = await QRY(G);
                            if (V && Gx6(V, _)) return {
                                sessionFile: G,
                                entries: null,
                                error: null,
                                skipped: !0
                            }
                        }
                    }
                    let f = await eJ8(G);
                    return {
                        sessionFile: G,
                        entries: f,
                        error: null,
                        skipped: !1
                    }
                } catch (f) {
                    return {
                        sessionFile: G,
                        entries: null,
                        error: f,
                        skipped: !1
                    }
                }
            }));
        for (let {
                sessionFile: G,
                entries: f,
                error: v,
                skipped: V
            }
            of Z) {
            if (V) continue;
            if (v || !f) {
                E(`Failed to read session file ${G}: ${b6(v)}`);
                continue
            }
            let k = uRY(G, ".jsonl"),
                N = [];
            for (let U of f)
                if (ul(U)) N.push(U);
                else if (U.type === "speculation-accept") H += U.timeSavedMs;
            if (N.length === 0) continue;
            let R = G.includes(`${$uK}subagents${$uK}`),
                h = R ? N : N.filter((U) => !U.isSidechain);
            if (h.length === 0) continue;
            let C = h[0],
                x = h.at(-1),
                B = new Date(C.timestamp),
                m = new Date(x.timestamp);
            if (isNaN(B.getTime()) || isNaN(m.getTime())) {
                E(`Skipping session with invalid timestamp: ${G}`);
                continue
            }
            let S = $g(B);
            if (_ && Gx6(S, _)) continue;
            if (z && Gx6(z, S)) continue;
            let F = A.get(S) || {
                date: S,
                messageCount: 0,
                sessionCount: 0,
                toolCallCount: 0
            };
            if (!R) {
                let U = m.getTime() - B.getTime();
                w.push({
                    sessionId: k,
                    duration: U,
                    messageCount: h.length,
                    timestamp: C.timestamp
                }), j += h.length, F.sessionCount++, F.messageCount += h.length;
                let g = B.getHours();
                $.set(g, ($.get(g) || 0) + 1)
            }
            if (!R || A.has(S)) A.set(S, F);
            for (let U of h)
                if (U.type === "assistant") {
                    let g = U.message?.content;
                    if (Array.isArray(g)) {
                        for (let c of g)
                            if (c.type === "tool_use") {
                                let n = A.get(S);
                                if (n) n.toolCallCount++
                            }
                    }
                    if (U.message?.usage) {
                        let c = U.message.usage,
                            n = U.message.model || "unknown";
                        if (n === $c) continue;
                        if (!J[n]) J[n] = {
                            inputTokens: 0,
                            outputTokens: 0,
                            cacheReadInputTokens: 0,
                            cacheCreationInputTokens: 0,
                            webSearchRequests: 0,
                            costUSD: 0,
                            contextWindow: 0,
                            maxOutputTokens: 0
                        };
                        J[n].inputTokens += c.input_tokens || 0, J[n].outputTokens += c.output_tokens || 0, J[n].cacheReadInputTokens += c.cache_read_input_tokens || 0, J[n].cacheCreationInputTokens += c.cache_creation_input_tokens || 0;
                        let l = (c.input_tokens || 0) + (c.output_tokens || 0);
                        if (l > 0) {
                            let z6 = O.get(S) || {};
                            z6[n] = (z6[n] || 0) + l, O.set(S, z6)
                        }
                    }
                }
        }
    }
    return {
        dailyActivity: Array.from(A.values()).sort((W, D) => W.date.localeCompare(D.date)),
        dailyModelTokens: Array.from(O.entries()).map(([W, D]) => ({
            date: W,
            tokensByModel: D
        })).sort((W, D) => W.date.localeCompare(D.date)),
        modelUsage: J,
        sessionStats: w,
        hourCounts: Object.fromEntries($),
        totalMessages: j,
        totalSpeculationTimeSavedMs: H,
        ...{}
    }
}
// @from(Ln 440975, Col 0)
async function juK() {
    let q = jg(),
        K = V8(),
        _;
    try {
        _ = await K.readdir(q)
    } catch (A) {
        if (t1(A)) return [];
        throw A
    }
    let z = _.filter((A) => A.isDirectory()).map((A) => zi8(q, A.name));
    return (await Promise.all(z.map(async (A) => {
        try {
            let O = await K.readdir(A),
                w = O.filter((H) => H.isFile() && H.name.endsWith(".jsonl")).map((H) => zi8(A, H.name)),
                $ = O.filter((H) => H.isDirectory()),
                j = await Promise.all($.map(async (H) => {
                    let J = zi8(A, H.name, "subagents");
                    try {
                        return (await K.readdir(J)).filter((M) => M.isFile() && M.name.endsWith(".jsonl") && M.name.startsWith("agent-")).map((M) => zi8(J, M.name))
                    } catch {
                        return []
                    }
                }));
            return [...w, ...j.flat()]
        } catch (O) {
            return E(`Failed to read project directory ${A}: ${b6(O)}`), []
        }
    }))).flat()
}
// @from(Ln 441006, Col 0)
function mRY(q, K) {
    let _ = new Map;
    for (let f of q.dailyActivity) _.set(f.date, {
        ...f
    });
    if (K)
        for (let f of K.dailyActivity) {
            let v = _.get(f.date);
            if (v) v.messageCount += f.messageCount, v.sessionCount += f.sessionCount, v.toolCallCount += f.toolCallCount;
            else _.set(f.date, {
                ...f
            })
        }
    let z = new Map;
    for (let f of q.dailyModelTokens) z.set(f.date, {
        ...f.tokensByModel
    });
    if (K)
        for (let f of K.dailyModelTokens) {
            let v = z.get(f.date);
            if (v)
                for (let [V, k] of Object.entries(f.tokensByModel)) v[V] = (v[V] || 0) + k;
            else z.set(f.date, {
                ...f.tokensByModel
            })
        }
    let Y = {
        ...q.modelUsage
    };
    if (K)
        for (let [f, v] of Object.entries(K.modelUsage))
            if (Y[f]) Y[f] = {
                inputTokens: Y[f].inputTokens + v.inputTokens,
                outputTokens: Y[f].outputTokens + v.outputTokens,
                cacheReadInputTokens: Y[f].cacheReadInputTokens + v.cacheReadInputTokens,
                cacheCreationInputTokens: Y[f].cacheCreationInputTokens + v.cacheCreationInputTokens,
                webSearchRequests: Y[f].webSearchRequests + v.webSearchRequests,
                costUSD: Y[f].costUSD + v.costUSD,
                contextWindow: Math.max(Y[f].contextWindow, v.contextWindow),
                maxOutputTokens: Math.max(Y[f].maxOutputTokens, v.maxOutputTokens)
            };
            else Y[f] = {
                ...v
            };
    let A = new Map;
    for (let [f, v] of Object.entries(q.hourCounts)) A.set(parseInt(f, 10), v);
    if (K)
        for (let [f, v] of Object.entries(K.hourCounts)) {
            let V = parseInt(f, 10);
            A.set(V, (A.get(V) || 0) + v)
        }
    let O = Array.from(_.values()).sort((f, v) => f.date.localeCompare(v.date)),
        w = HuK(O),
        $ = Array.from(z.entries()).map(([f, v]) => ({
            date: f,
            tokensByModel: v
        })).sort((f, v) => f.date.localeCompare(v.date)),
        j = q.totalSessions + (K?.sessionStats.length || 0),
        H = q.totalMessages + (K?.totalMessages || 0),
        J = q.longestSession;
    if (K) {
        for (let f of K.sessionStats)
            if (!J || f.duration > J.duration) J = f
    }
    let X = q.firstSessionDate,
        M = null;
    if (K)
        for (let f of K.sessionStats) {
            if (!X || f.timestamp < X) X = f.timestamp;
            if (!M || f.timestamp > M) M = f.timestamp
        }
    if (!M && O.length > 0) M = O.at(-1).date;
    let P = O.length > 0 ? O.reduce((f, v) => v.messageCount > f.messageCount ? v : f).date : null,
        W = A.size > 0 ? Array.from(A.entries()).reduce((f, [v, V]) => V > f[1] ? [v, V] : f)[0] : null,
        D = X && M ? Math.ceil((new Date(M).getTime() - new Date(X).getTime()) / 86400000) + 1 : 0,
        Z = q.totalSpeculationTimeSavedMs + (K?.totalSpeculationTimeSavedMs || 0);
    return {
        totalSessions: j,
        totalMessages: H,
        totalDays: D,
        activeDays: _.size,
        streaks: w,
        dailyActivity: O,
        dailyModelTokens: $,
        longestSession: J,
        modelUsage: Y,
        firstSessionDate: X,
        lastSessionDate: M,
        peakActivityDay: P,
        peakActivityHour: W,
        totalSpeculationTimeSavedMs: Z
    }
}
// @from(Ln 441099, Col 0)
async function BRY() {
    let q = await juK();
    if (q.length === 0) return JuK();
    let K = await rxK(async () => {
            let Y = await axK(),
                A = sxK(),
                O = Y;
            if (!Y.lastComputedDate) {
                E("Stats cache empty, processing all historical data");
                let w = await Ai8(q, {
                    toDate: A
                });
                if (w.sessionStats.length > 0 || w.dailyActivity.length > 0) O = PO7(Y, w, A), await o98(O)
            } else if (Gx6(Y.lastComputedDate, A)) {
                let w = FRY(Y.lastComputedDate);
                E(`Stats cache stale (${Y.lastComputedDate}), processing ${w} to ${A}`);
                let $ = await Ai8(q, {
                    fromDate: w,
                    toDate: A
                });
                if ($.sessionStats.length > 0 || $.dailyActivity.length > 0) O = PO7(Y, $, A), await o98(O);
                else O = {
                    ...Y,
                    lastComputedDate: A
                }, await o98(O)
            }
            return O
        }),
        _ = WO7(),
        z = await Ai8(q, {
            fromDate: _,
            toDate: _
        });
    return mRY(K, z)
}
// @from(Ln 441134, Col 0)
async function vO7(q) {
    if (q === "all") return BRY();
    let K = await juK();
    if (K.length === 0) return JuK();
    let _ = new Date,
        z = q === "7d" ? 7 : 30,
        Y = new Date(_);
    Y.setDate(_.getDate() - z + 1);
    let A = $g(Y),
        O = await Ai8(K, {
            fromDate: A
        });
    return pRY(O)
}
// @from(Ln 441149, Col 0)
function pRY(q) {
    let K = q.dailyActivity.slice().sort((X, M) => X.date.localeCompare(M.date)),
        _ = q.dailyModelTokens.slice().sort((X, M) => X.date.localeCompare(M.date)),
        z = HuK(K),
        Y = null;
    for (let X of q.sessionStats)
        if (!Y || X.duration > Y.duration) Y = X;
    let A = null,
        O = null;
    for (let X of q.sessionStats) {
        if (!A || X.timestamp < A) A = X.timestamp;
        if (!O || X.timestamp > O) O = X.timestamp
    }
    let w = K.length > 0 ? K.reduce((X, M) => M.messageCount > X.messageCount ? M : X).date : null,
        $ = Object.entries(q.hourCounts),
        j = $.length > 0 ? parseInt($.reduce((X, [M, P]) => P > parseInt(X[1].toString()) ? [M, P] : X)[0], 10) : null,
        H = A && O ? Math.ceil((new Date(O).getTime() - new Date(A).getTime()) / 86400000) + 1 : 0;
    return {
        totalSessions: q.sessionStats.length,
        totalMessages: q.totalMessages,
        totalDays: H,
        activeDays: q.dailyActivity.length,
        streaks: z,
        dailyActivity: K,
        dailyModelTokens: _,
        longestSession: Y,
        modelUsage: q.modelUsage,
        firstSessionDate: A,
        lastSessionDate: O,
        peakActivityDay: w,
        peakActivityHour: j,
        totalSpeculationTimeSavedMs: q.totalSpeculationTimeSavedMs
    }
}
// @from(Ln 441184, Col 0)
function FRY(q) {
    let K = new Date(q);
    return K.setUTCDate(K.getUTCDate() + 1), $g(K)
}
// @from(Ln 441189, Col 0)
function gRY(q) {
    let K = new Date(q);
    return K.setUTCDate(K.getUTCDate() - 1), $g(K)
}
// @from(Ln 441194, Col 0)
function HuK(q) {
    if (q.length === 0) return {
        currentStreak: 0,
        longestStreak: 0,
        currentStreakStart: null,
        longestStreakStart: null,
        longestStreakEnd: null
    };
    let K = 0,
        _ = null,
        z = WO7(),
        Y = new Set(q.map((j) => j.date));
    while (Y.has(z)) K++, _ = z, z = gRY(z);
    let A = 0,
        O = null,
        w = null,
        $ = Array.from(Y).sort();
    if ($.length > 0) {
        let j = 1,
            H = $[0];
        for (let J = 1; J < $.length; J++) {
            let X = new Date($[J - 1]),
                M = new Date($[J]);
            if (Math.round((M.getTime() - X.getTime()) / 86400000) === 1) j++;
            else {
                if (j > A) A = j, O = H, w = $[J - 1];
                j = 1, H = $[J]
            }
        }
        if (j > A) A = j, O = H, w = $.at(-1)
    }
    return {
        currentStreak: K,
        longestStreak: A,
        currentStreakStart: _,
        longestStreakStart: O,
        longestStreakEnd: w
    }
}
// @from(Ln 441233, Col 0)
async function QRY(q) {
    try {
        let K = await xRY(q, "r");
        try {
            let _ = Buffer.allocUnsafe(4096),
                {
                    bytesRead: z
                } = await K.read(_, 0, _.length, 0);
            if (z === 0) return null;
            let Y = _.toString("utf8", 0, z),
                A = Y.lastIndexOf(`
`);
            if (A < 0) return null;
            for (let O of Y.slice(0, A).split(`
`)) {
                if (!O) continue;
                let w;
                try {
                    w = n8(O)
                } catch {
                    continue
                }
                if (typeof w.type !== "string") continue;
                if (!URY.has(w.type)) continue;
                if (w.isSidechain === !0) continue;
                if (typeof w.timestamp !== "string") return null;
                let $ = new Date(w.timestamp);
                if (Number.isNaN($.getTime())) return null;
                return $g($)
            }
            return null
        } finally {
            await K.close()
        }
    } catch {
        return null
    }
}
// @from(Ln 441272, Col 0)
function JuK() {
    return {
        totalSessions: 0,
        totalMessages: 0,
        totalDays: 0,
        activeDays: 0,
        streaks: {
            currentStreak: 0,
            longestStreak: 0,
            currentStreakStart: null,
            longestStreakStart: null,
            longestStreakEnd: null
        },
        dailyActivity: [],
        dailyModelTokens: [],
        longestSession: null,
        modelUsage: {},
        firstSessionDate: null,
        lastSessionDate: null,
        peakActivityDay: null,
        peakActivityHour: null,
        totalSpeculationTimeSavedMs: 0
    }
}
// @from(Ln 441296, Col 4)
URY
// @from(Ln 441297, Col 4)
XuK = L(() => {
    K8();
    m8();
    Yq();
    mO();
    _7();
    g4();
    uK6();
    e8();
    DO7();
    URY = new Set(["user", "assistant", "attachment", "system", "progress"])
})
// @from(Ln 441310, Col 0)
function dRY(q) {
    return new Date(q).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    })
}
// @from(Ln 441317, Col 0)
function cRY(q) {
    let K = Oi8.indexOf(q);
    return Oi8[(K + 1) % Oi8.length]
}
// @from(Ln 441322, Col 0)
function lRY() {
    return vO7("all").then((q) => {
        if (!q || q.totalSessions === 0) return {
            type: "empty"
        };
        return {
            type: "success",
            data: q
        }
    }).catch((q) => {
        return {
            type: "error",
            message: q instanceof Error ? q.message : "Failed to load stats"
        }
    })
}
// @from(Ln 441339, Col 0)
function DuK(q) {
    let K = s(4),
        {
            onClose: _
        } = q,
        z;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) z = lRY(), K[0] = z;
    else z = K[0];
    let Y = z,
        A;
    if (K[1] === Symbol.for("react.memo_cache_sentinel")) A = f7.default.createElement(u, {
        marginTop: 1
    }, f7.default.createElement(Y5, null), f7.default.createElement(T, null, " Loading your Claude Code stats…")), K[1] = A;
    else A = K[1];
    let O;
    if (K[2] !== _) O = f7.default.createElement(f7.Suspense, {
        fallback: A
    }, f7.default.createElement(nRY, {
        allTimePromise: Y,
        onClose: _
    })), K[2] = _, K[3] = O;
    else O = K[3];
    return O
}
// @from(Ln 441364, Col 0)
function nRY(q) {
    let K = s(47),
        {
            allTimePromise: _,
            onClose: z
        } = q,
        Y = f7.use(_),
        [A, O] = f7.useState("all"),
        w;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) w = {}, K[0] = w;
    else w = K[0];
    let [$, j] = f7.useState(w), [H, J] = f7.useState(!1), [X, M] = f7.useState("Overview"), [P, W] = f7.useState(null), D, Z;
    if (K[1] !== A || K[2] !== $) D = () => {
        if (A === "all") return;
        if ($[A]) return;
        let n = !1;
        return J(!0), vO7(A).then((l) => {
            if (!n) j((z6) => ({
                ...z6,
                [A]: l
            })), J(!1)
        }).catch(() => {
            if (!n) J(!1)
        }), () => {
            n = !0
        }
    }, Z = [A, $], K[1] = A, K[2] = $, K[3] = D, K[4] = Z;
    else D = K[3], Z = K[4];
    f7.useEffect(D, Z);
    let G = A === "all" ? Y.type === "success" ? Y.data : null : $[A] ?? (Y.type === "success" ? Y.data : null),
        f = Y.type === "success" ? Y.data : null,
        v;
    if (K[5] !== z) v = () => {
        z("Stats dialog dismissed", {
            display: "system"
        })
    }, K[5] = z, K[6] = v;
    else v = K[6];
    let V = v,
        k;
    if (K[7] === Symbol.for("react.memo_cache_sentinel")) k = {
        context: "Settings"
    }, K[7] = k;
    else k = K[7];
    G1("confirm:no", V, k);
    let {
        headerFocused: N,
        focusHeader: R
    } = uX(), h;
    if (K[8] !== X || K[9] !== A || K[10] !== G || K[11] !== R) h = function(l) {
        if (l.key === "up") {
            l.preventDefault(), R();
            return
        }
        if (l.key === "r" && !l.ctrl && !l.meta) {
            l.preventDefault(), O(cRY(A));
            return
        }
        if (l.ctrl && l.key === "s" && G) l.preventDefault(), zSY(G, X, W)
    }, K[8] = X, K[9] = A, K[10] = G, K[11] = R, K[12] = h;
    else h = K[12];
    let C = h;
    if (Y.type === "error") {
        let n;
        if (K[13] !== Y.message) n = f7.default.createElement(T, {
            color: "error"
        }, "Failed to load stats: ", Y.message), K[13] = Y.message, K[14] = n;
        else n = K[14];
        let l;
        if (K[15] !== C || K[16] !== n) l = f7.default.createElement(u, {
            marginTop: 1,
            tabIndex: 0,
            autoFocus: !0,
            onKeyDown: C
        }, n), K[15] = C, K[16] = n, K[17] = l;
        else l = K[17];
        return l
    }
    if (Y.type === "empty") {
        let n;
        if (K[18] === Symbol.for("react.memo_cache_sentinel")) n = f7.default.createElement(T, {
            color: "warning"
        }, "No stats available yet. Start using Claude Code!"), K[18] = n;
        else n = K[18];
        let l;
        if (K[19] !== C) l = f7.default.createElement(u, {
            marginTop: 1,
            tabIndex: 0,
            autoFocus: !0,
            onKeyDown: C
        }, n), K[19] = C, K[20] = l;
        else l = K[20];
        return l
    }
    if (!G || !f) {
        let n, l;
        if (K[21] === Symbol.for("react.memo_cache_sentinel")) n = f7.default.createElement(Y5, null), l = f7.default.createElement(T, null, " Loading stats…"), K[21] = n, K[22] = l;
        else n = K[21], l = K[22];
        let z6;
        if (K[23] !== C) z6 = f7.default.createElement(u, {
            marginTop: 1,
            tabIndex: 0,
            autoFocus: !0,
            onKeyDown: C
        }, n, l), K[23] = C, K[24] = z6;
        else z6 = K[24];
        return z6
    }
    let x;
    if (K[25] === Symbol.for("react.memo_cache_sentinel")) x = (n) => M(n), K[25] = x;
    else x = K[25];
    let B;
    if (K[26] !== f || K[27] !== A || K[28] !== G || K[29] !== H) B = f7.default.createElement($O, {
        title: "Overview"
    }, f7.default.createElement(iRY, {
        stats: G,
        allTimeStats: f,
        dateRange: A,
        isLoading: H
    })), K[26] = f, K[27] = A, K[28] = G, K[29] = H, K[30] = B;
    else B = K[30];
    let m;
    if (K[31] !== A || K[32] !== G || K[33] !== H) m = f7.default.createElement($O, {
        title: "Models"
    }, f7.default.createElement(aRY, {
        stats: G,
        dateRange: A,
        isLoading: H
    })), K[31] = A, K[32] = G, K[33] = H, K[34] = m;
    else m = K[34];
    let S;
    if (K[35] !== X || K[36] !== N || K[37] !== B || K[38] !== m) S = f7.default.createElement(u, {
        flexDirection: "row",
        gap: 1,
        marginBottom: 1
    }, f7.default.createElement(JL, {
        initialHeaderFocused: !0,
        title: "",
        color: "claude",
        selectedTab: X,
        onTabChange: x,
        disableNavigation: N
    }, B, m)), K[35] = X, K[36] = N, K[37] = B, K[38] = m, K[39] = S;
    else S = K[39];
    let F = N ? "↓ stats" : "↑ tabs",
        U = P ? ` · ${P}` : "",
        g;
    if (K[40] !== F || K[41] !== U) g = f7.default.createElement(u, {
        paddingLeft: 2
    }, f7.default.createElement(T, {
        dimColor: !0
    }, F, " · r to cycle dates · ctrl+s to copy", U)), K[40] = F, K[41] = U, K[42] = g;
    else g = K[42];
    let c;
    if (K[43] !== C || K[44] !== S || K[45] !== g) c = f7.default.createElement(u, {
        flexDirection: "column",
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: C
    }, S, g), K[43] = C, K[44] = S, K[45] = g, K[46] = c;
    else c = K[46];
    return c
}
// @from(Ln 441528, Col 0)
function ZuK(q) {
    let K = s(9),
        {
            dateRange: _,
            isLoading: z
        } = q,
        Y;
    if (K[0] !== _) Y = Oi8.map(($, j) => f7.default.createElement(T, {
        key: $
    }, j > 0 && f7.default.createElement(T, {
        dimColor: !0
    }, " · "), $ === _ ? f7.default.createElement(T, {
        bold: !0,
        color: "claude"
    }, MuK[$]) : f7.default.createElement(T, {
        dimColor: !0
    }, MuK[$]))), K[0] = _, K[1] = Y;
    else Y = K[1];
    let A;
    if (K[2] !== Y) A = f7.default.createElement(u, null, Y), K[2] = Y, K[3] = A;
    else A = K[3];
    let O;
    if (K[4] !== z) O = z && f7.default.createElement(Y5, null), K[4] = z, K[5] = O;
    else O = K[5];
    let w;
    if (K[6] !== A || K[7] !== O) w = f7.default.createElement(u, {
        marginBottom: 1,
        gap: 1
    }, A, O), K[6] = A, K[7] = O, K[8] = w;
    else w = K[8];
    return w
}
// @from(Ln 441561, Col 0)
function iRY({
    stats: q,
    allTimeStats: K,
    dateRange: _,
    isLoading: z
}) {
    let {
        columns: Y
    } = s1(), A = Object.entries(q.modelUsage).sort(([, J], [, X]) => X.inputTokens + X.outputTokens - (J.inputTokens + J.outputTokens)), O = A[0], w = A.reduce((J, [, X]) => J + X.inputTokens + X.outputTokens, 0), $ = f7.useMemo(() => fuK(q, w), [q, w]), j = _ === "7d" ? 7 : _ === "30d" ? 30 : q.totalDays, H = null;
    return f7.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, K.dailyActivity.length > 0 && f7.default.createElement(u, {
        flexDirection: "column",
        marginBottom: 1
    }, f7.default.createElement(v5, null, ZO7(K.dailyActivity, {
        terminalWidth: Y
    }))), f7.default.createElement(ZuK, {
        dateRange: _,
        isLoading: z
    }), f7.default.createElement(u, {
        flexDirection: "row",
        gap: 4,
        marginBottom: 1
    }, f7.default.createElement(u, {
        flexDirection: "column",
        width: 28
    }, O && f7.default.createElement(T, {
        wrap: "truncate"
    }, "Favorite model:", " ", f7.default.createElement(T, {
        color: "claude",
        bold: !0
    }, YJ(O[0])))), f7.default.createElement(u, {
        flexDirection: "column",
        width: 28
    }, f7.default.createElement(T, {
        wrap: "truncate"
    }, "Total tokens:", " ", f7.default.createElement(T, {
        color: "claude"
    }, iK(w))))), f7.default.createElement(u, {
        flexDirection: "row",
        gap: 4
    }, f7.default.createElement(u, {
        flexDirection: "column",
        width: 28
    }, f7.default.createElement(T, {
        wrap: "truncate"
    }, "Sessions:", " ", f7.default.createElement(T, {
        color: "claude"
    }, iK(q.totalSessions)))), f7.default.createElement(u, {
        flexDirection: "column",
        width: 28
    }, q.longestSession && f7.default.createElement(T, {
        wrap: "truncate"
    }, "Longest session:", " ", f7.default.createElement(T, {
        color: "claude"
    }, C5(q.longestSession.duration))))), f7.default.createElement(u, {
        flexDirection: "row",
        gap: 4
    }, f7.default.createElement(u, {
        flexDirection: "column",
        width: 28
    }, f7.default.createElement(T, {
        wrap: "truncate"
    }, "Active days: ", f7.default.createElement(T, {
        color: "claude"
    }, q.activeDays), f7.default.createElement(T, {
        color: "subtle"
    }, "/", j))), f7.default.createElement(u, {
        flexDirection: "column",
        width: 28
    }, f7.default.createElement(T, {
        wrap: "truncate"
    }, "Longest streak:", " ", f7.default.createElement(T, {
        color: "claude",
        bold: !0
    }, q.streaks.longestStreak), " ", q.streaks.longestStreak === 1 ? "day" : "days"))), f7.default.createElement(u, {
        flexDirection: "row",
        gap: 4
    }, f7.default.createElement(u, {
        flexDirection: "column",
        width: 28
    }, q.peakActivityDay && f7.default.createElement(T, {
        wrap: "truncate"
    }, "Most active day:", " ", f7.default.createElement(T, {
        color: "claude"
    }, dRY(q.peakActivityDay)))), f7.default.createElement(u, {
        flexDirection: "column",
        width: 28
    }, f7.default.createElement(T, {
        wrap: "truncate"
    }, "Current streak:", " ", f7.default.createElement(T, {
        color: "claude",
        bold: !0
    }, K.streaks.currentStreak), " ", K.streaks.currentStreak === 1 ? "day" : "days"))), !1, H && f7.default.createElement(f7.default.Fragment, null, f7.default.createElement(u, {
        marginTop: 1
    }, f7.default.createElement(T, null, "Shot distribution")), f7.default.createElement(u, {
        flexDirection: "row",
        gap: 4
    }, f7.default.createElement(u, {
        flexDirection: "column",
        width: 28
    }, f7.default.createElement(T, {
        wrap: "truncate"
    }, H.buckets[0].label, ":", " ", f7.default.createElement(T, {
        color: "claude"
    }, H.buckets[0].count), f7.default.createElement(T, {
        color: "subtle"
    }, " (", H.buckets[0].pct, "%)"))), f7.default.createElement(u, {
        flexDirection: "column",
        width: 28
    }, f7.default.createElement(T, {
        wrap: "truncate"
    }, H.buckets[1].label, ":", " ", f7.default.createElement(T, {
        color: "claude"
    }, H.buckets[1].count), f7.default.createElement(T, {
        color: "subtle"
    }, " (", H.buckets[1].pct, "%)")))), f7.default.createElement(u, {
        flexDirection: "row",
        gap: 4
    }, f7.default.createElement(u, {
        flexDirection: "column",
        width: 28
    }, f7.default.createElement(T, {
        wrap: "truncate"
    }, H.buckets[2].label, ":", " ", f7.default.createElement(T, {
        color: "claude"
    }, H.buckets[2].count), f7.default.createElement(T, {
        color: "subtle"
    }, " (", H.buckets[2].pct, "%)"))), f7.default.createElement(u, {
        flexDirection: "column",
        width: 28
    }, f7.default.createElement(T, {
        wrap: "truncate"
    }, H.buckets[3].label, ":", " ", f7.default.createElement(T, {
        color: "claude"
    }, H.buckets[3].count), f7.default.createElement(T, {
        color: "subtle"
    }, " (", H.buckets[3].pct, "%)")))), f7.default.createElement(u, {
        flexDirection: "row",
        gap: 4
    }, f7.default.createElement(u, {
        flexDirection: "column",
        width: 28
    }, f7.default.createElement(T, {
        wrap: "truncate"
    }, "Avg/session:", " ", f7.default.createElement(T, {
        color: "claude"
    }, H.avgShots))))), $ && f7.default.createElement(u, {
        marginTop: 1
    }, f7.default.createElement(T, {
        color: "suggestion"
    }, $)))
}
// @from(Ln 441716, Col 0)
function fuK(q, K) {
    let _ = [];
    if (K > 0) {
        let Y = rRY.filter((A) => K >= A.tokens);
        for (let A of Y) {
            let O = K / A.tokens;
            if (O >= 2) _.push(`You've used ~${Math.floor(O)}x more tokens than ${A.name}`);
            else _.push(`You've used the same number of tokens as ${A.name}`)
        }
    }
    if (q.longestSession) {
        let Y = q.longestSession.duration / 60000;
        for (let A of oRY) {
            let O = Y / A.minutes;
            if (O >= 2) _.push(`Your longest session is ~${Math.floor(O)}x longer than ${A.name}`)
        }
    }
    if (_.length === 0) return "";
    let z = Math.floor(Math.random() * _.length);
    return _[z]
}
// @from(Ln 441738, Col 0)
function aRY(q) {
    let K = s(61),
        {
            stats: _,
            dateRange: z,
            isLoading: Y
        } = q,
        {
            headerFocused: A,
            focusHeader: O
        } = uX(),
        [w, $] = f7.useState(0),
        {
            columns: j
        } = s1(),
        H, J, X, M, P, W, D, Z, G, f, v, V, k, N, R, h, C, x, B, m, S;
    if (K[0] !== z || K[1] !== O || K[2] !== A || K[3] !== Y || K[4] !== w || K[5] !== _.dailyModelTokens || K[6] !== _.modelUsage || K[7] !== j) {
        k = Symbol.for("react.early_return_sentinel");
        q: {
            W = Object.entries(_.modelUsage).sort(KSY);
            let n = function($6) {
                if (A) return;
                if ($6.key === "down" && w < W.length - 4) {
                    $6.preventDefault(), $((H6) => Math.min(H6 + 2, W.length - 4));
                    return
                }
                if ($6.key === "up")
                    if ($6.preventDefault(), w > 0) $(qSY);
                    else O()
            };
            if (W.length === 0) {
                let J6;
                if (K[29] === Symbol.for("react.memo_cache_sentinel")) J6 = f7.default.createElement(u, null, f7.default.createElement(T, {
                    color: "subtle"
                }, "No model usage data available")), K[29] = J6;
                else J6 = K[29];
                k = J6;
                break q
            }
            let l = W.reduce(eRY, 0),
                z6 = GuK(_.dailyModelTokens, W.map(tRY), j),
                A6 = W.slice(w, w + 4),
                e = Math.ceil(A6.length / 2),
                i = A6.slice(0, e),
                O6 = A6.slice(e);
            if (P = w > 0, M = w < W.length - 4, D = W.length > 4, X = u, B = "column", m = 1, S = 0, G = !0, f = n, v = z6 && f7.default.createElement(u, {
                    flexDirection: "column",
                    marginBottom: 1
                }, f7.default.createElement(T, {
                    bold: !0
                }, "Tokens per Day"), f7.default.createElement(v5, null, z6.chart), f7.default.createElement(T, {
                    color: "subtle"
                }, z6.xAxisLabels), f7.default.createElement(u, null, z6.legend.map(sRY))), K[30] !== z || K[31] !== Y) V = f7.default.createElement(ZuK, {
                dateRange: z,
                isLoading: Y
            }),
            K[30] = z,
            K[31] = Y,
            K[32] = V;
            else V = K[32];J = u,
            h = "row",
            C = 4,
            x = f7.default.createElement(u, {
                flexDirection: "column",
                width: 36
            }, i.map((J6) => {
                let [$6, H6] = J6;
                return f7.default.createElement(PuK, {
                    key: $6,
                    model: $6,
                    usage: H6,
                    totalTokens: l
                })
            })),
            H = u,
            Z = "column",
            N = 36,
            R = O6.map((J6) => {
                let [$6, H6] = J6;
                return f7.default.createElement(PuK, {
                    key: $6,
                    model: $6,
                    usage: H6,
                    totalTokens: l
                })
            })
        }
        K[0] = z, K[1] = O, K[2] = A, K[3] = Y, K[4] = w, K[5] = _.dailyModelTokens, K[6] = _.modelUsage, K[7] = j, K[8] = H, K[9] = J, K[10] = X, K[11] = M, K[12] = P, K[13] = W, K[14] = D, K[15] = Z, K[16] = G, K[17] = f, K[18] = v, K[19] = V, K[20] = k, K[21] = N, K[22] = R, K[23] = h, K[24] = C, K[25] = x, K[26] = B, K[27] = m, K[28] = S
    } else H = K[8], J = K[9], X = K[10], M = K[11], P = K[12], W = K[13], D = K[14], Z = K[15], G = K[16], f = K[17], v = K[18], V = K[19], k = K[20], N = K[21], R = K[22], h = K[23], C = K[24], x = K[25], B = K[26], m = K[27], S = K[28];
    if (k !== Symbol.for("react.early_return_sentinel")) return k;
    let F;
    if (K[33] !== H || K[34] !== Z || K[35] !== N || K[36] !== R) F = f7.default.createElement(H, {
        flexDirection: Z,
        width: N
    }, R), K[33] = H, K[34] = Z, K[35] = N, K[36] = R, K[37] = F;
    else F = K[37];
    let U;
    if (K[38] !== J || K[39] !== F || K[40] !== h || K[41] !== C || K[42] !== x) U = f7.default.createElement(J, {
        flexDirection: h,
        gap: C
    }, x, F), K[38] = J, K[39] = F, K[40] = h, K[41] = C, K[42] = x, K[43] = U;
    else U = K[43];
    let g;
    if (K[44] !== M || K[45] !== P || K[46] !== W || K[47] !== w || K[48] !== D) g = D && f7.default.createElement(u, {
        marginTop: 1
    }, f7.default.createElement(T, {
        color: "subtle"
    }, P ? e6.arrowUp : " ", " ", M ? e6.arrowDown : " ", " ", w + 1, "-", Math.min(w + 4, W.length), " of", " ", W.length, " models", " ", f7.default.createElement(A8, {
        chord: ["up", "down"],
        action: "scroll",
        format: {
            arrowSep: ""
        },
        parens: !0
    }))), K[44] = M, K[45] = P, K[46] = W, K[47] = w, K[48] = D, K[49] = g;
    else g = K[49];
    let c;
    if (K[50] !== X || K[51] !== G || K[52] !== f || K[53] !== v || K[54] !== V || K[55] !== U || K[56] !== g || K[57] !== B || K[58] !== m || K[59] !== S) c = f7.default.createElement(X, {
        flexDirection: B,
        marginTop: m,
        tabIndex: S,
        autoFocus: G,
        onKeyDown: f
    }, v, V, U, g), K[50] = X, K[51] = G, K[52] = f, K[53] = v, K[54] = V, K[55] = U, K[56] = g, K[57] = B, K[58] = m, K[59] = S, K[60] = c;
    else c = K[60];
    return c
}
// @from(Ln 441866, Col 0)
function sRY(q, K) {
    return f7.default.createElement(T, {
        key: q.model
    }, K > 0 ? " · " : "", f7.default.createElement(v5, null, q.coloredBullet), " ", q.model)
}
// @from(Ln 441872, Col 0)
function tRY(q) {
    let [K] = q;
    return K
}
// @from(Ln 441877, Col 0)
function eRY(q, K) {
    let [, _] = K;
    return q + _.inputTokens + _.outputTokens
}
// @from(Ln 441882, Col 0)
function qSY(q) {
    return Math.max(q - 2, 0)
}
// @from(Ln 441886, Col 0)
function KSY(q, K) {
    let [, _] = q, [, z] = K;
    return z.inputTokens + z.outputTokens - (_.inputTokens + _.outputTokens)
}
// @from(Ln 441891, Col 0)
function PuK(q) {
    let K = s(21),
        {
            model: _,
            usage: z,
            totalTokens: Y
        } = q,
        O = (z.inputTokens + z.outputTokens) / Y * 100,
        w;
    if (K[0] !== O) w = O.toFixed(1), K[0] = O, K[1] = w;
    else w = K[1];
    let $ = w,
        j;
    if (K[2] !== _) j = YJ(_), K[2] = _, K[3] = j;
    else j = K[3];
    let H;
    if (K[4] !== j) H = f7.default.createElement(T, {
        bold: !0
    }, j), K[4] = j, K[5] = H;
    else H = K[5];
    let J;
    if (K[6] !== $) J = f7.default.createElement(T, {
        color: "subtle"
    }, "(", $, "%)"), K[6] = $, K[7] = J;
    else J = K[7];
    let X;
    if (K[8] !== H || K[9] !== J) X = f7.default.createElement(T, null, e6.bullet, " ", H, " ", J), K[8] = H, K[9] = J, K[10] = X;
    else X = K[10];
    let M;
    if (K[11] !== z.inputTokens) M = iK(z.inputTokens), K[11] = z.inputTokens, K[12] = M;
    else M = K[12];
    let P;
    if (K[13] !== z.outputTokens) P = iK(z.outputTokens), K[13] = z.outputTokens, K[14] = P;
    else P = K[14];
    let W;
    if (K[15] !== M || K[16] !== P) W = f7.default.createElement(T, {
        color: "subtle"
    }, "  ", "In: ", M, " · Out:", " ", P), K[15] = M, K[16] = P, K[17] = W;
    else W = K[17];
    let D;
    if (K[18] !== X || K[19] !== W) D = f7.default.createElement(u, {
        flexDirection: "column"
    }, X, W), K[18] = X, K[19] = W, K[20] = D;
    else D = K[20];
    return D
}
// @from(Ln 441938, Col 0)
function GuK(q, K, _) {
    if (q.length < 2 || K.length === 0) return null;
    let z = 7,
        Y = _ - z,
        A = Math.min(52, Math.max(20, Y)),
        O;
    if (q.length >= A) O = q.slice(-A);
    else {
        let P = Math.floor(A / q.length);
        O = [];
        for (let W of q)
            for (let D = 0; D < P; D++) O.push(W)
    }
    let w = DD(Ad(H8().theme)),
        $ = [SE8(w.suggestion), SE8(w.success), SE8(w.warning)],
        j = [],
        H = [],
        J = K.slice(0, 3);
    for (let P = 0; P < J.length; P++) {
        let W = J[P],
            D = O.map((Z) => Z.tokensByModel[W] || 0);
        if (D.some((Z) => Z > 0)) {
            j.push(D);
            let Z = [w.suggestion, w.success, w.warning];
            H.push({
                model: YJ(W),
                coloredBullet: Ba(e6.bullet, Z[P % Z.length])
            })
        }
    }
    if (j.length === 0) return null;
    let X = WuK.plot(j, {
            height: 8,
            colors: $.slice(0, j.length),
            format: (P) => {
                let W;
                if (P >= 1e6) W = (P / 1e6).toFixed(1) + "M";
                else if (P >= 1000) W = (P / 1000).toFixed(0) + "k";
                else W = P.toFixed(0);
                return W.padStart(6)
            }
        }),
        M = _SY(O, O.length, z);
    return {
        chart: X,
        legend: H,
        xAxisLabels: M
    }
}
// @from(Ln 441988, Col 0)
function _SY(q, K, _) {
    if (q.length === 0) return "";
    let z = Math.min(4, Math.max(2, Math.floor(q.length / 8))),
        Y = q.length - 6,
        A = Math.floor(Y / (z - 1)) || 1,
        O = [];
    for (let j = 0; j < z; j++) {
        let H = Math.min(j * A, q.length - 1),
            X = new Date(q[H].date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
            });
        O.push({
            pos: H,
            label: X
        })
    }
    let w = " ".repeat(_),
        $ = 0;
    for (let {
            pos: j,
            label: H
        }
        of O) {
        let J = Math.max(1, j - $);
        w += " ".repeat(J) + H, $ = j + H.length
    }
    return w
}
// @from(Ln 442017, Col 0)
async function zSY(q, K, _) {
    _("copying…");
    let z = YSY(q, K),
        Y = await OuK(z);
    _(Y.success ? "copied!" : "copy failed"), setTimeout(_, 2000, null)
}
// @from(Ln 442024, Col 0)
function YSY(q, K) {
    let _ = [];
    if (K === "Overview") _.push(...ASY(q));
    else _.push(...OSY(q));
    while (_.length > 0 && MO(_.at(-1)).trim() === "") _.pop();
    if (_.length > 0) {
        let z = _.at(-1),
            Y = N1(z),
            A = K === "Overview" ? 70 : 80,
            O = "/stats",
            w = Math.max(2, A - Y - 6);
        _[_.length - 1] = z + " ".repeat(w) + Y8.gray("/stats")
    }
    return _.join(`
`)
}
// @from(Ln 442041, Col 0)
function ASY(q) {
    let K = [],
        _ = DD(Ad(H8().theme)),
        z = (D) => Ba(D, _.claude),
        Y = 18,
        A = 40,
        O = 18,
        w = (D, Z, G, f) => {
            let v = (D + ":").padEnd(18),
                V = v.length + Z.length,
                k = Math.max(2, 40 - V),
                N = (G + ":").padEnd(18);
            return v + z(Z) + " ".repeat(k) + N + z(f)
        };
    if (q.dailyActivity.length > 0) K.push(ZO7(q.dailyActivity, {
        terminalWidth: 56
    })), K.push("");
    let $ = Object.entries(q.modelUsage).sort(([, D], [, Z]) => Z.inputTokens + Z.outputTokens - (D.inputTokens + D.outputTokens)),
        j = $[0],
        H = $.reduce((D, [, Z]) => D + Z.inputTokens + Z.outputTokens, 0);
    if (j) K.push(w("Favorite model", YJ(j[0]), "Total tokens", iK(H)));
    K.push(""), K.push(w("Sessions", iK(q.totalSessions), "Longest session", q.longestSession ? C5(q.longestSession.duration) : "N/A"));
    let J = `${q.streaks.currentStreak} ${q.streaks.currentStreak===1?"day":"days"}`,
        X = `${q.streaks.longestStreak} ${q.streaks.longestStreak===1?"day":"days"}`;
    K.push(w("Current streak", J, "Longest streak", X));
    let M = `${q.activeDays}/${q.totalDays}`,
        P = q.peakActivityHour !== null ? `${q.peakActivityHour}:00-${q.peakActivityHour+1}:00` : "N/A";
    K.push(w("Active days", M, "Peak hour", P)), K.push("");
    let W = fuK(q, H);
    return K.push(z(W)), K.push(Y8.gray(`Stats from the last ${q.totalDays} days`)), K
}
// @from(Ln 442073, Col 0)
function OSY(q) {
    let K = [],
        _ = Object.entries(q.modelUsage).sort(([, w], [, $]) => $.inputTokens + $.outputTokens - (w.inputTokens + w.outputTokens));
    if (_.length === 0) return K.push(Y8.gray("No model usage data available")), K;
    let z = _[0],
        Y = _.reduce((w, [, $]) => w + $.inputTokens + $.outputTokens, 0),
        A = GuK(q.dailyModelTokens, _.map(([w]) => w), 80);
    if (A) {
        K.push(Y8.bold("Tokens per Day")), K.push(A.chart), K.push(Y8.gray(A.xAxisLabels));
        let w = A.legend.map(($) => `${$.coloredBullet} ${$.model}`).join(" · ");
        K.push(w), K.push("")
    }
    K.push(`${e6.star} Favorite: ${Y8.magenta.bold(YJ(z?.[0]||""))} · ${e6.circle} Total: ${Y8.magenta(iK(Y))} tokens`), K.push("");
    let O = _.slice(0, 3);
    for (let [w, $] of O) {
        let H = (($.inputTokens + $.outputTokens) / Y * 100).toFixed(1);
        K.push(`${e6.bullet} ${Y8.bold(YJ(w))} ${Y8.gray(`(${H}%)`)}`), K.push(Y8.dim(`  In: ${iK($.inputTokens)} · Out: ${iK($.outputTokens)}`))
    }
    return K
}
// @from(Ln 442093, Col 4)
WuK
// @from(Ln 442093, Col 9)
f7
// @from(Ln 442093, Col 13)
MuK
// @from(Ln 442093, Col 18)
Oi8
// @from(Ln 442093, Col 23)
rRY
// @from(Ln 442093, Col 28)
oRY
// @from(Ln 442094, Col 4)
vuK = L(() => {
    o6();
    Y3();
    Qq();
    I4();
    G$6();
    n5();
    mN();
    g6();
    C7();
    h1();
    c7();
    txK();
    Sq();
    wuK();
    XuK();
    tB();
    u7();
    BT();
    Ej();
    WuK = K6(nxK(), 1), f7 = K6(P6(), 1);
    MuK = {
        "7d": "Last 7 days",
        "30d": "Last 30 days",
        all: "All time"
    }, Oi8 = ["all", "7d", "30d"];
    rRY = [{
        name: "The Little Prince",
        tokens: 22000
    }, {
        name: "The Old Man and the Sea",
        tokens: 35000
    }, {
        name: "A Christmas Carol",
        tokens: 37000
    }, {
        name: "Animal Farm",
        tokens: 39000
    }, {
        name: "Fahrenheit 451",
        tokens: 60000
    }, {
        name: "The Great Gatsby",
        tokens: 62000
    }, {
        name: "Slaughterhouse-Five",
        tokens: 64000
    }, {
        name: "Brave New World",
        tokens: 83000
    }, {
        name: "The Catcher in the Rye",
        tokens: 95000
    }, {
        name: "Harry Potter and the Philosopher's Stone",
        tokens: 103000
    }, {
        name: "The Hobbit",
        tokens: 123000
    }, {
        name: "1984",
        tokens: 123000
    }, {
        name: "To Kill a Mockingbird",
        tokens: 130000
    }, {
        name: "Pride and Prejudice",
        tokens: 156000
    }, {
        name: "Dune",
        tokens: 244000
    }, {
        name: "Moby-Dick",
        tokens: 268000
    }, {
        name: "Crime and Punishment",
        tokens: 274000
    }, {
        name: "A Game of Thrones",
        tokens: 381000
    }, {
        name: "Anna Karenina",
        tokens: 468000
    }, {
        name: "Don Quixote",
        tokens: 520000
    }, {
        name: "The Lord of the Rings",
        tokens: 576000
    }, {
        name: "The Count of Monte Cristo",
        tokens: 603000
    }, {
        name: "Les Misérables",
        tokens: 689000
    }, {
        name: "War and Peace",
        tokens: 730000
    }], oRY = [{
        name: "a TED talk",
        minutes: 18
    }, {
        name: "an episode of The Office",
        minutes: 22
    }, {
        name: "listening to Abbey Road",
        minutes: 47
    }, {
        name: "a yoga class",
        minutes: 60
    }, {
        name: "a World Cup soccer match",
        minutes: 90
    }, {
        name: "a half marathon (average time)",
        minutes: 120
    }, {
        name: "the movie Inception",
        minutes: 148
    }, {
        name: "watching Titanic",
        minutes: 195
    }, {
        name: "a transatlantic flight",
        minutes: 420
    }, {
        name: "a full night of sleep",
        minutes: 480
    }]
})
// @from(Ln 442225, Col 0)
function b_6(q) {
    let K = s(28),
        {
            onClose: _,
            context: z,
            defaultTab: Y
        } = q,
        [A, O] = C_6.useState(Y),
        [w, $] = C_6.useState(!1),
        [j, H] = C_6.useState(!1),
        [J, X] = C_6.useState(!1),
        M = bP(),
        {
            rows: P
        } = Fd(s1()),
        W = M ? P + 1 : Math.max(15, Math.min(Math.floor(P * 0.8), 30)),
        [D] = C_6.useState(wSY);
    $3();
    let Z;
    if (K[0] !== _ || K[1] !== w) Z = () => {
        if (w) return;
        _("Status dialog dismissed", {
            display: "system"
        })
    }, K[0] = _, K[1] = w, K[2] = Z;
    else Z = K[2];
    let G = Z,
        f = !w && !(A === "Config" && j) && !(A === "Gates" && J) && A !== "Stats",
        v;
    if (K[3] !== f) v = {
        context: "Settings",
        isActive: f
    }, K[3] = f, K[4] = v;
    else v = K[4];
    G1("confirm:no", G, v);
    let V;
    if (K[5] !== z || K[6] !== D) V = pJ.createElement($O, {
        key: "status",
        title: "Status"
    }, pJ.createElement(wxK, {
        context: z,
        diagnosticsPromise: D
    })), K[5] = z, K[6] = D, K[7] = V;
    else V = K[7];
    let k;
    if (K[8] !== W || K[9] !== z || K[10] !== _) k = pJ.createElement($O, {
        key: "config",
        title: "Config"
    }, pJ.createElement(C_6.Suspense, {
        fallback: null
    }, pJ.createElement(SxK, {
        context: z,
        onClose: _,
        setTabsHidden: $,
        onIsSearchModeChange: H,
        contentHeight: W
    }))), K[8] = W, K[9] = z, K[10] = _, K[11] = k;
    else k = K[11];
    let N;
    if (K[12] === Symbol.for("react.memo_cache_sentinel")) N = pJ.createElement($O, {
        key: "usage",
        title: "Usage"
    }, pJ.createElement(cxK, null)), K[12] = N;
    else N = K[12];
    let R;
    if (K[13] !== _) R = pJ.createElement($O, {
        key: "stats",
        title: "Stats"
    }, pJ.createElement(DuK, {
        onClose: _
    })), K[13] = _, K[14] = R;
    else R = K[14];
    let h;
    if (K[15] !== W) h = [], K[15] = W, K[16] = h;
    else h = K[16];
    let C;
    if (K[17] !== V || K[18] !== k || K[19] !== R || K[20] !== h) C = [V, k, N, R, ...h], K[17] = V, K[18] = k, K[19] = R, K[20] = h, K[21] = C;
    else C = K[21];
    let x = C,
        B = Y !== "Config" && Y !== "Gates",
        m = w || M ? void 0 : W,
        S;
    if (K[22] !== A || K[23] !== B || K[24] !== m || K[25] !== x || K[26] !== w) S = pJ.createElement(A_, {
        color: "permission"
    }, pJ.createElement(JL, {
        color: "permission",
        selectedTab: A,
        onTabChange: O,
        hidden: w,
        initialHeaderFocused: B,
        contentHeight: m
    }, x)), K[22] = A, K[23] = B, K[24] = m, K[25] = x, K[26] = w, K[27] = S;
    else S = K[27];
    return S
}
// @from(Ln 442321, Col 0)
function wSY() {
    return OxK().catch($SY)
}
// @from(Ln 442325, Col 0)
function $SY() {
    return []
}
// @from(Ln 442328, Col 4)
pJ
// @from(Ln 442328, Col 8)
C_6
// @from(Ln 442329, Col 4)
a98 = L(() => {
    o6();
    C7();
    C$();
    I4();
    Mk();
    DJ();
    BT();
    $xK();
    CxK();
    lxK();
    vuK();
    pJ = K6(P6(), 1), C_6 = K6(P6(), 1)
})
// @from(Ln 442343, Col 4)
TuK = {}
// @from(Ln 442347, Col 4)
TO7
// @from(Ln 442347, Col 9)
jSY = async (q, K) => {
    return TO7.createElement(b_6, {
        onClose: q,
        context: K,
        defaultTab: "Config"
    })
}
// @from(Ln 442354, Col 4)
VuK = L(() => {
    a98();
    TO7 = K6(P6(), 1)
})
// @from(Ln 442358, Col 4)
HSY
// @from(Ln 442358, Col 9)
kuK
// @from(Ln 442359, Col 4)
NuK = L(() => {
    HSY = {
        aliases: ["settings"],
        type: "local-jsx",
        name: "config",
        description: "Open config panel",
        load: () => Promise.resolve().then(() => (VuK(), TuK))
    }, kuK = HSY
})
// @from(Ln 442369, Col 0)
function LuK(q) {
    let K = [];
    return PSY(q, K), WSY(q, K), ZSY(q, K), fSY(q, K), GSY(q, K), K.sort((_, z) => {
        if (_.severity !== z.severity) return _.severity === "warning" ? -1 : 1;
        return (z.savingsTokens ?? 0) - (_.savingsTokens ?? 0)
    }), K
}
// @from(Ln 442377, Col 0)
function PSY(q, K) {
    if (q.percentage >= yuK) K.push({
        severity: "warning",
        title: `Context is ${q.percentage}% full`,
        detail: q.isAutoCompactEnabled ? "Autocompact will trigger soon, which discards older messages. Use /compact now to control what gets kept." : S6(process.env.DISABLE_COMPACT) ? "Compaction is disabled." : "Autocompact is disabled. Use /compact to free space, or enable autocompact in /config."
    })
}
// @from(Ln 442385, Col 0)
function WSY(q, K) {
    if (!q.messageBreakdown) return;
    for (let _ of q.messageBreakdown.toolCallsByType) {
        let z = _.callTokens + _.resultTokens,
            Y = z / q.rawMaxTokens * 100;
        if (Y < EuK || z < VO7) continue;
        let A = DSY(_.name, z, Y);
        if (A) K.push(A)
    }
}
// @from(Ln 442396, Col 0)
function DSY(q, K, _) {
    let z = h3(K);
    switch (q) {
        case S7:
            return {
                severity: "warning", title: `Bash results using ${z} tokens (${_.toFixed(0)}%)`, detail: "Pipe output through head, tail, or grep to reduce result size. Avoid cat on large files — use Read with offset/limit instead.", savingsTokens: Math.floor(K * 0.5)
            };
        case xq:
            return {
                severity: "info", title: `Read results using ${z} tokens (${_.toFixed(0)}%)`, detail: "Use offset and limit parameters to read only the sections you need. Avoid re-reading entire files when you only need a few lines.", savingsTokens: Math.floor(K * 0.3)
            };
        case a5:
            return {
                severity: "info", title: `Grep results using ${z} tokens (${_.toFixed(0)}%)`, detail: "Add more specific patterns or use the glob or type parameter to narrow file types. Consider Glob for file discovery instead of Grep.", savingsTokens: Math.floor(K * 0.3)
            };
        case PH:
            return {
                severity: "info", title: `WebFetch results using ${z} tokens (${_.toFixed(0)}%)`, detail: "Web page content can be very large. Consider extracting only the specific information needed.", savingsTokens: Math.floor(K * 0.4)
            };
        default:
            if (_ >= 20) return {
                severity: "info",
                title: `${q} using ${z} tokens (${_.toFixed(0)}%)`,
                detail: "This tool is consuming a significant portion of context.",
                savingsTokens: Math.floor(K * 0.2)
            };
            return null
    }
}
// @from(Ln 442426, Col 0)
function ZSY(q, K) {
    if (!q.messageBreakdown) return;
    let z = q.messageBreakdown.toolCallsByType.find((w) => w.name === xq);
    if (!z) return;
    let Y = z.callTokens + z.resultTokens,
        A = Y / q.rawMaxTokens * 100,
        O = z.resultTokens / q.rawMaxTokens * 100;
    if (A >= EuK && Y >= VO7) return;
    if (O >= JSY && z.resultTokens >= VO7) K.push({
        severity: "info",
        title: `File reads using ${h3(z.resultTokens)} tokens (${O.toFixed(0)}%)`,
        detail: "If you are re-reading files, consider referencing earlier reads. Use offset/limit for large files.",
        savingsTokens: Math.floor(z.resultTokens * 0.3)
    })
}
// @from(Ln 442442, Col 0)
function fSY(q, K) {
    let _ = q.memoryFiles.reduce((Y, A) => Y + A.tokens, 0),
        z = _ / q.rawMaxTokens * 100;
    if (z >= XSY && _ >= MSY) {
        let Y = [...q.memoryFiles].sort((A, O) => O.tokens - A.tokens).slice(0, 3).map((A) => {
            return `${S3(A.path)} (${h3(A.tokens)})`
        }).join(", ");
        K.push({
            severity: "info",
            title: `Memory files using ${h3(_)} tokens (${z.toFixed(0)}%)`,
            detail: `Largest: ${Y}. Use /memory to review and prune stale entries.`,
            savingsTokens: Math.floor(_ * 0.3)
        })
    }
}
// @from(Ln 442458, Col 0)
function GSY(q, K) {
    if (!q.isAutoCompactEnabled && !S6(process.env.DISABLE_COMPACT) && q.percentage >= 50 && q.percentage < yuK) K.push({
        severity: "info",
        title: "Autocompact is disabled",
        detail: "Without autocompact, you will hit context limits and lose the conversation. Enable it in /config or use /compact manually."
    })
}
// @from(Ln 442465, Col 4)
EuK = 15
// @from(Ln 442466, Col 4)
VO7 = 1e4
// @from(Ln 442467, Col 4)
JSY = 5
// @from(Ln 442468, Col 4)
yuK = 80
// @from(Ln 442469, Col 4)
XSY = 5
// @from(Ln 442470, Col 4)
MSY = 5000
// @from(Ln 442471, Col 4)
huK = L(() => {
    Rz();
    jJ();
    Q8();
    eK();
    c7()
})
// @from(Ln 442479, Col 0)
function RuK(q) {
    let K = s(5),
        {
            suggestions: _
        } = q;
    if (_.length === 0) return null;
    let z;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) z = M0.createElement(T, {
        bold: !0
    }, "Suggestions"), K[0] = z;
    else z = K[0];
    let Y;
    if (K[1] !== _) Y = _.map(vSY), K[1] = _, K[2] = Y;
    else Y = K[2];
    let A;
    if (K[3] !== Y) A = M0.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, z, Y), K[3] = Y, K[4] = A;
    else A = K[4];
    return A
}
// @from(Ln 442502, Col 0)
function vSY(q, K) {
    return M0.createElement(u, {
        key: K,
        flexDirection: "column",
        marginTop: K === 0 ? 0 : 1
    }, M0.createElement(u, null, M0.createElement(D4, {
        status: q.severity,
        withSpace: !0
    }), M0.createElement(T, {
        bold: !0
    }, q.title), q.savingsTokens ? M0.createElement(T, {
        dimColor: !0
    }, " ", e6.arrowRight, " save ~", h3(q.savingsTokens)) : null), M0.createElement(u, {
        marginLeft: 2
    }, M0.createElement(T, {
        dimColor: !0
    }, q.detail)))
}
// @from(Ln 442520, Col 4)
M0
// @from(Ln 442521, Col 4)
SuK = L(() => {
    o6();
    Qq();
    g6();
    c7();
    Y2();
    M0 = K6(P6(), 1)
})
// @from(Ln 442530, Col 0)
function wi8(q) {
    let K = s(7),
        {
            connectors: _,
            children: z
        } = q,
        Y;
    if (K[0] !== _) Y = _.length > 0 && bj.createElement(PJ, {
        fromLeftEdge: !0,
        flexShrink: 0,
        flexDirection: "row"
    }, _.map(VSY)), K[0] = _, K[1] = Y;
    else Y = K[1];
    let A;
    if (K[2] !== z) A = bj.createElement(u, {
        flexGrow: 1,
        flexShrink: 1
    }, z), K[2] = z, K[3] = A;
    else A = K[3];
    let O;
    if (K[4] !== Y || K[5] !== A) O = bj.createElement(u, {
        flexDirection: "row"
    }, Y, A), K[4] = Y, K[5] = A, K[6] = O;
    else O = K[6];
    return O
}
// @from(Ln 442557, Col 0)
function VSY(q, K) {
    return bj.createElement(u, {
        key: K,
        width: 2
    }, bj.createElement(T, {
        dimColor: !0
    }, TSY[q]))
}
// @from(Ln 442566, Col 0)
function buK(q) {
    let K = Gn.Children.toArray(q);
    return K.map((_, z) => bj.createElement(CuK.Provider, {
        key: z,
        value: z === K.length - 1
    }, _))
}
// @from(Ln 442574, Col 0)
function kSY(q) {
    let K = s(10),
        {
            children: _,
            variant: z
        } = q,
        Y = z === void 0 ? "outline" : z,
        A;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) A = [], K[0] = A;
    else A = K[0];
    let O;
    if (K[1] !== Y) O = {
        variant: Y,
        ancestors: A
    }, K[1] = Y, K[2] = O;
    else O = K[2];
    let w;
    if (K[3] !== _) w = buK(_), K[3] = _, K[4] = w;
    else w = K[4];
    let $;
    if (K[5] !== w) $ = bj.createElement(u, {
        flexDirection: "column"
    }, w), K[5] = w, K[6] = $;
    else $ = K[6];
    let j;
    if (K[7] !== O || K[8] !== $) j = bj.createElement(kO7.Provider, {
        value: O
    }, $), K[7] = O, K[8] = $, K[9] = j;
    else j = K[9];
    return j
}
// @from(Ln 442606, Col 0)
function NSY(q) {
    let K = s(19),
        {
            label: _,
            children: z,
            dimColor: Y,
            color: A
        } = q,
        {
            variant: O,
            ancestors: w
        } = Gn.useContext(kO7),
        $ = Gn.useContext(CuK),
        j = O === "outline" ? "last" : $ ? "last" : "branch",
        H = O === "outline" ? "space" : $ ? "space" : "pipe",
        J = _ != null && _ !== !1,
        X = J ? _ : z,
        M;
    if (K[0] !== w || K[1] !== j) M = [...w, j], K[0] = w, K[1] = j, K[2] = M;
    else M = K[2];
    let P;
    if (K[3] !== A || K[4] !== Y || K[5] !== X) P = Gn.isValidElement(X) ? X : bj.createElement(T, {
        dimColor: Y,
        color: A
    }, X), K[3] = A, K[4] = Y, K[5] = X, K[6] = P;
    else P = K[6];
    let W;
    if (K[7] !== M || K[8] !== P) W = bj.createElement(wi8, {
        connectors: M
    }, P), K[7] = M, K[8] = P, K[9] = W;
    else W = K[9];
    let D;
    if (K[10] !== w || K[11] !== z || K[12] !== H || K[13] !== J || K[14] !== O) D = J && bj.createElement(kO7.Provider, {
        value: {
            variant: O,
            ancestors: [...w, H]
        }
    }, buK(z)), K[10] = w, K[11] = z, K[12] = H, K[13] = J, K[14] = O, K[15] = D;
    else D = K[15];
    let Z;
    if (K[16] !== W || K[17] !== D) Z = bj.createElement(u, {
        flexDirection: "column"
    }, W, D), K[16] = W, K[17] = D, K[18] = Z;
    else Z = K[18];
    return Z
}
// @from(Ln 442652, Col 4)
bj
// @from(Ln 442652, Col 8)
Gn
// @from(Ln 442652, Col 12)
TSY
// @from(Ln 442652, Col 17)
kO7
// @from(Ln 442652, Col 22)
CuK
// @from(Ln 442652, Col 27)
uK
// @from(Ln 442653, Col 4)
vx6 = L(() => {
    o6();
    A3();
    g6();
    bj = K6(P6(), 1), Gn = K6(P6(), 1), TSY = {
        branch: fU.branch,
        last: fU.last,
        pipe: fU.pipe,
        space: ""
    };
    kO7 = Gn.createContext({
        variant: "outline",
        ancestors: []
    }), CuK = Gn.createContext(!0);
    uK = Object.assign(kSY, {
        Node: NSY
    })
})
// @from(Ln 442672, Col 0)
function ESY() {
    let q = s(2);
    return null
}
// @from(Ln 442677, Col 0)
function IuK(q) {
    let K = new Map;
    for (let z of q) {
        let Y = sf6(z.source),
            A = K.get(Y) || [];
        A.push(z), K.set(Y, A)
    }
    for (let [z, Y] of K.entries()) K.set(z, Y.sort((A, O) => O.tokens - A.tokens));
    let _ = new Map;
    for (let z of ySY) {
        let Y = K.get(z);
        if (Y) _.set(z, Y)
    }
    return _
}
// @from(Ln 442693, Col 0)
function xuK(q) {
    let K = s(98),
        {
            data: _
        } = q,
        {
            categories: z,
            totalTokens: Y,
            rawMaxTokens: A,
            autocompactSource: O,
            percentage: w,
            gridRows: $,
            model: j,
            memoryFiles: H,
            mcpTools: J,
            deferredBuiltinTools: X,
            systemTools: M,
            systemPromptSections: P,
            agents: W,
            skills: D,
            messageBreakdown: Z
        } = _,
        G, f, v, V, k, N, R, h, C, x, B;
    if (K[0] !== O || K[1] !== z || K[2] !== $ || K[3] !== J || K[4] !== j || K[5] !== w || K[6] !== A || K[7] !== M || K[8] !== X || K[9] !== Y) {
        let A6 = X === void 0 ? [] : X,
            e = z.filter(nSY),
            i;
        if (K[21] !== z) i = z.some(lSY), K[21] = z, K[22] = i;
        else i = K[22];
        let O6 = i,
            J6 = A6.length > 0,
            $6 = z.find(cSY);
        if (f = u, C = "column", x = 1, K[23] === Symbol.for("react.memo_cache_sentinel")) B = d1.createElement(T, {
            bold: !0
        }, "Context Usage"), K[23] = B;
        else B = K[23];
        let H6;
        if (K[24] !== $) H6 = $.map(QSY), K[24] = $, K[25] = H6;
        else H6 = K[25];
        let q6;
        if (K[26] !== H6) q6 = d1.createElement(u, {
            flexDirection: "column",
            flexShrink: 0
        }, H6), K[26] = H6, K[27] = q6;
        else q6 = K[27];
        let o;
        if (K[28] !== j) o = _q6(j) && d1.createElement(T, null, _q6(j)), K[28] = j, K[29] = o;
        else o = K[29];
        let _6;
        if (K[30] !== j) _6 = d1.createElement(T, {
            dimColor: !0
        }, j), K[30] = j, K[31] = _6;
        else _6 = K[31];
        let r;
        if (K[32] !== Y) r = h3(Y), K[32] = Y, K[33] = r;
        else r = K[33];
        let t;
        if (K[34] !== A) t = h3(A), K[34] = A, K[35] = t;
        else t = K[35];
        let Y6;
        if (K[36] !== w || K[37] !== r || K[38] !== t) Y6 = d1.createElement(T, {
            dimColor: !0
        }, r, "/", t, " tokens (", w, "%)"), K[36] = w, K[37] = r, K[38] = t, K[39] = Y6;
        else Y6 = K[39];
        let X6, M6, W6;
        if (K[40] === Symbol.for("react.memo_cache_sentinel")) X6 = d1.createElement(ESY, null), M6 = d1.createElement(T, null, " "), W6 = d1.createElement(T, {
            dimColor: !0,
            italic: !0
        }, "Estimated usage by category"), K[40] = X6, K[41] = M6, K[42] = W6;
        else X6 = K[40], M6 = K[41], W6 = K[42];
        let V6;
        if (K[43] !== A) V6 = (v6, L6) => {
            let y6 = h3(v6.tokens),
                c6 = v6.isDeferred ? "N/A" : `${(v6.tokens/A*100).toFixed(1)}%`,
                Z8 = v6.name === $i8,
                N8 = v6.name,
                R6 = v6.isDeferred ? " " : Z8 ? "⛝" : "⛁";
            return d1.createElement(u, {
                key: L6
            }, d1.createElement(T, {
                color: v6.color
            }, R6), d1.createElement(T, null, " ", N8, ": "), d1.createElement(T, {
                dimColor: !0
            }, y6, " tokens (", c6, ")"))
        }, K[43] = A, K[44] = V6;
        else V6 = K[44];
        let f6 = e.map(V6),
            G6;
        if (K[45] !== z || K[46] !== A) G6 = (z.find(USY)?.tokens ?? 0) > 0 && d1.createElement(u, null, d1.createElement(T, {
            dimColor: !0
        }, "⛶"), d1.createElement(T, null, " Free space: "), d1.createElement(T, {
            dimColor: !0
        }, h3(z.find(gSY)?.tokens || 0), " ", "(", ((z.find(FSY)?.tokens || 0) / A * 100).toFixed(1), "%)")), K[45] = z, K[46] = A, K[47] = G6;
        else G6 = K[47];
        let k6 = $6 && $6.tokens > 0 && d1.createElement(u, null, d1.createElement(T, {
                color: $6.color
            }, "⛝"), d1.createElement(T, {
                dimColor: !0
            }, " ", $6.name, ": "), d1.createElement(T, {
                dimColor: !0
            }, h3($6.tokens), " tokens (", ($6.tokens / A * 100).toFixed(1), "%)")),
            T6;
        if (K[48] !== o || K[49] !== _6 || K[50] !== Y6 || K[51] !== f6 || K[52] !== G6 || K[53] !== k6) T6 = d1.createElement(u, {
            flexDirection: "column",
            gap: 0,
            flexShrink: 0
        }, o, _6, Y6, X6, M6, W6, f6, G6, k6), K[48] = o, K[49] = _6, K[50] = Y6, K[51] = f6, K[52] = G6, K[53] = k6, K[54] = T6;
        else T6 = K[54];
        if (K[55] !== q6 || K[56] !== T6) v = d1.createElement(u, {
            flexDirection: "row",
            gap: 2
        }, q6, T6), K[55] = q6, K[56] = T6, K[57] = v;
        else v = K[57];
        if (G = u, V = "column", k = -1, K[58] !== O || K[59] !== A) N = O !== "model" && d1.createElement(u, {
            marginTop: 1
        }, d1.createElement(T, {
            bold: !0
        }, "Auto-compact window: "), d1.createElement(T, {
            dimColor: !0
        }, h3(A), " tokens · /autocompact")), K[58] = O, K[59] = A, K[60] = N;
        else N = K[60];
        if (K[61] !== O6 || K[62] !== J) R = J.length > 0 && d1.createElement(u, {
            flexDirection: "column",
            marginTop: 1
        }, d1.createElement(u, null, d1.createElement(T, {
            bold: !0
        }, "MCP tools"), d1.createElement(T, {
            dimColor: !0
        }, " ", "· /mcp", O6 ? " (loaded on-demand)" : "")), J.some(pSY) && d1.createElement(u, {
            flexDirection: "column",
            marginTop: 1
        }, d1.createElement(T, {
            dimColor: !0
        }, "Loaded"), d1.createElement(uK, null, J.filter(BSY).map(mSY))), O6 && J.some(uSY) && d1.createElement(u, {
            flexDirection: "column",
            marginTop: 1
        }, d1.createElement(T, {
            dimColor: !0
        }, "Available"), d1.createElement(uK, null, J.filter(xSY).map(ISY))), !O6 && d1.createElement(uK, null, J.map(bSY))), K[61] = O6, K[62] = J, K[63] = R;
        else R = K[63];
        h = (M && M.length > 0 || J6) && !1, K[0] = O, K[1] = z, K[2] = $, K[3] = J, K[4] = j, K[5] = w, K[6] = A, K[7] = M, K[8] = X, K[9] = Y, K[10] = G, K[11] = f, K[12] = v, K[13] = V, K[14] = k, K[15] = N, K[16] = R, K[17] = h, K[18] = C, K[19] = x, K[20] = B
    } else G = K[10], f = K[11], v = K[12], V = K[13], k = K[14], N = K[15], R = K[16], h = K[17], C = K[18], x = K[19], B = K[20];
    let m;
    if (K[64] !== P) m = P && P.length > 0 && !1, K[64] = P, K[65] = m;
    else m = K[65];
    let S;
    if (K[66] !== W) S = W.length > 0 && d1.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, d1.createElement(u, null, d1.createElement(T, {
        bold: !0
    }, "Custom agents"), d1.createElement(T, {
        dimColor: !0
    }, " · /agents")), Array.from(IuK(W).entries()).map(SSY)), K[66] = W, K[67] = S;
    else S = K[67];
    let F;
    if (K[68] !== H) F = H.length > 0 && d1.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, d1.createElement(u, null, d1.createElement(T, {
        bold: !0
    }, "Memory files"), d1.createElement(T, {
        dimColor: !0
    }, " · /memory")), d1.createElement(uK, null, H.map(RSY))), K[68] = H, K[69] = F;
    else F = K[69];
    let U;
    if (K[70] !== D) U = D && D.tokens > 0 && d1.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, d1.createElement(u, null, d1.createElement(T, {
        bold: !0
    }, "Skills"), d1.createElement(T, {
        dimColor: !0
    }, " · /skills")), Array.from(IuK(D.skillFrontmatter).entries()).map(LSY)), K[70] = D, K[71] = U;
    else U = K[71];
    let g;
    if (K[72] !== Z) g = Z && !1, K[72] = Z, K[73] = g;
    else g = K[73];
    let c;
    if (K[74] !== G || K[75] !== m || K[76] !== S || K[77] !== F || K[78] !== U || K[79] !== g || K[80] !== V || K[81] !== k || K[82] !== N || K[83] !== R || K[84] !== h) c = d1.createElement(G, {
        flexDirection: V,
        marginLeft: k
    }, N, R, h, m, S, F, U, g), K[74] = G, K[75] = m, K[76] = S, K[77] = F, K[78] = U, K[79] = g, K[80] = V, K[81] = k, K[82] = N, K[83] = R, K[84] = h, K[85] = c;
    else c = K[85];
    let n;
    if (K[86] !== _) n = LuK(_), K[86] = _, K[87] = n;
    else n = K[87];
    let l;
    if (K[88] !== n) l = d1.createElement(RuK, {
        suggestions: n
    }), K[88] = n, K[89] = l;
    else l = K[89];
    let z6;
    if (K[90] !== f || K[91] !== v || K[92] !== c || K[93] !== l || K[94] !== C || K[95] !== x || K[96] !== B) z6 = d1.createElement(f, {
        flexDirection: C,
        paddingLeft: x
    }, B, v, c, l), K[90] = f, K[91] = v, K[92] = c, K[93] = l, K[94] = C, K[95] = x, K[96] = B, K[97] = z6;
    else z6 = K[97];
    return z6
}
// @from(Ln 442894, Col 0)
function LSY(q) {
    let [K, _] = q;
    return d1.createElement(u, {
        key: K,
        flexDirection: "column",
        marginTop: 1
    }, d1.createElement(T, {
        dimColor: !0
    }, K), d1.createElement(uK, null, _.map(hSY)))
}
// @from(Ln 442905, Col 0)
function hSY(q, K) {
    return d1.createElement(uK.Node, {
        key: K
    }, d1.createElement(T, null, q.name, ":", " ", d1.createElement(T, {
        dimColor: !0
    }, h3(q.tokens), " tokens")))
}
// @from(Ln 442913, Col 0)
function RSY(q, K) {
    return d1.createElement(uK.Node, {
        key: K
    }, d1.createElement(T, null, S3(q.path), ":", " ", d1.createElement(T, {
        dimColor: !0
    }, h3(q.tokens), " tokens")))
}
// @from(Ln 442921, Col 0)
function SSY(q) {
    let [K, _] = q;
    return d1.createElement(u, {
        key: K,
        flexDirection: "column",
        marginTop: 1
    }, d1.createElement(T, {
        dimColor: !0
    }, K), d1.createElement(uK, null, _.map(CSY)))
}
// @from(Ln 442932, Col 0)
function CSY(q, K) {
    return d1.createElement(uK.Node, {
        key: K
    }, d1.createElement(T, null, q.agentType, ":", " ", d1.createElement(T, {
        dimColor: !0
    }, h3(q.tokens), " tokens")))
}
// @from(Ln 442940, Col 0)
function bSY(q, K) {
    return d1.createElement(uK.Node, {
        key: K
    }, d1.createElement(T, null, q.name, ":", " ", d1.createElement(T, {
        dimColor: !0
    }, h3(q.tokens), " tokens")))
}
// @from(Ln 442948, Col 0)
function ISY(q, K) {
    return d1.createElement(uK.Node, {
        key: K,
        dimColor: !0
    }, q.name)
}
// @from(Ln 442955, Col 0)
function xSY(q) {
    return !q.isLoaded
}
// @from(Ln 442959, Col 0)
function uSY(q) {
    return !q.isLoaded
}
// @from(Ln 442963, Col 0)
function mSY(q, K) {
    return d1.createElement(uK.Node, {
        key: K
    }, d1.createElement(T, null, q.name, ":", " ", d1.createElement(T, {
        dimColor: !0
    }, h3(q.tokens), " tokens")))
}
// @from(Ln 442971, Col 0)
function BSY(q) {
    return q.isLoaded
}
// @from(Ln 442975, Col 0)
function pSY(q) {
    return q.isLoaded
}
// @from(Ln 442979, Col 0)
function FSY(q) {
    return q.name === "Free space"
}
// @from(Ln 442983, Col 0)
function gSY(q) {
    return q.name === "Free space"
}
// @from(Ln 442987, Col 0)
function USY(q) {
    return q.name === "Free space"
}
// @from(Ln 442991, Col 0)
function QSY(q, K) {
    return d1.createElement(u, {
        key: K,
        flexDirection: "row",
        marginLeft: -1
    }, q.map(dSY))
}
// @from(Ln 442999, Col 0)
function dSY(q, K) {
    if (q.categoryName === "Free space") return d1.createElement(T, {
        key: K,
        dimColor: !0
    }, "⛶ ");
    if (q.categoryName === $i8) return d1.createElement(T, {
        key: K,
        color: q.color
    }, "⛝ ");
    return d1.createElement(T, {
        key: K,
        color: q.color
    }, q.squareFullness >= 0.7 ? "⛁ " : "⛀ ")
}
// @from(Ln 443014, Col 0)
function cSY(q) {
    return q.name === $i8
}
// @from(Ln 443018, Col 0)
function lSY(q) {
    return q.isDeferred && q.name.includes("MCP")
}
// @from(Ln 443022, Col 0)
function nSY(q) {
    return q.tokens > 0 && q.name !== "Free space" && q.name !== $i8 && !q.isDeferred
}
// @from(Ln 443025, Col 4)
d1
// @from(Ln 443025, Col 8)
$i8 = "Autocompact buffer"
// @from(Ln 443026, Col 4)
ySY
// @from(Ln 443027, Col 4)
uuK = L(() => {
    o6();
    g6();
    huK();
    eK();
    c7();
    Sq();
    aY();
    SuK();
    vx6();
    d1 = K6(P6(), 1);
    ySY = ["Project", "User", "Managed", "Plugin", "Built-in"]
})
// @from(Ln 443040, Col 4)
muK = {}
// @from(Ln 443045, Col 0)
function iSY(q) {
    return H2(q)
}
// @from(Ln 443048, Col 0)
async function rSY(q, K) {
    let {
        messages: _,
        getAppState: z,
        options: {
            mainLoopModel: Y,
            tools: A
        }
    } = K, O = iSY(_), {
        messages: w
    } = await _c(O), $ = process.stdout.columns || 80, j = z(), H = await _l8(w, Y, async () => j.toolPermissionContext, A, j.agentDefinitions, $, K, void 0, O, j.autoCompactWindow), J = await gq8(NO7.createElement(xuK, {
        data: H
    }));
    return q(J), null
}
// @from(Ln 443063, Col 4)
NO7
// @from(Ln 443064, Col 4)
BuK = L(() => {
    uuK();
    $y();
    zl8();
    _7();
    yt();
    NO7 = K6(P6(), 1)
})
// @from(Ln 443072, Col 4)
puK = {}
// @from(Ln 443077, Col 0)
async function ji8(q) {
    let {
        messages: K,
        getAppState: _,
        options: {
            mainLoopModel: z,
            tools: Y,
            agentDefinitions: A,
            customSystemPrompt: O,
            appendSystemPrompt: w,
            excludeDynamicSections: $
        }
    } = q, j = H2(K), {
        messages: H
    } = await _c(j), J = _();
    return _l8(H, z, async () => J.toolPermissionContext, Y, A, void 0, {
        options: {
            customSystemPrompt: O,
            appendSystemPrompt: w
        }
    }, void 0, j, J.autoCompactWindow, $)
}
// @from(Ln 443099, Col 0)
async function aSY(q, K) {
    let _ = await ji8(K);
    return {
        type: "text",
        value: sSY(_)
    }
}
// @from(Ln 443107, Col 0)
function sSY(q) {
    let {
        categories: K,
        totalTokens: _,
        rawMaxTokens: z,
        percentage: Y,
        model: A,
        memoryFiles: O,
        mcpTools: w,
        agents: $,
        skills: j,
        messageBreakdown: H,
        systemTools: J,
        systemPromptSections: X
    } = q, M = `## Context Usage

`;
    M += `**Model:** ${A}  
`, M += `**Tokens:** ${h3(_)} / ${h3(z)} (${Y}%)
`, M += `
`;
    let P = K.filter((W) => W.tokens > 0 && W.name !== "Free space" && W.name !== "Autocompact buffer");
    if (P.length > 0) {
        M += `### Estimated usage by category

`, M += `| Category | Tokens | Percentage |
`, M += `|----------|--------|------------|
`;
        for (let Z of P) {
            let G = (Z.tokens / z * 100).toFixed(1);
            M += `| ${Z.name} | ${h3(Z.tokens)} | ${G}% |
`
        }
        let W = K.find((Z) => Z.name === "Free space");
        if (W && W.tokens > 0) {
            let Z = (W.tokens / z * 100).toFixed(1);
            M += `| Free space | ${h3(W.tokens)} | ${Z}% |
`
        }
        let D = K.find((Z) => Z.name === "Autocompact buffer");
        if (D && D.tokens > 0) {
            let Z = (D.tokens / z * 100).toFixed(1);
            M += `| Autocompact buffer | ${h3(D.tokens)} | ${Z}% |
`
        }
        M += `
`
    }
    if (w.length > 0) {
        M += `### MCP Tools

`, M += `| Tool | Server | Tokens |
`, M += `|------|--------|--------|
`;
        for (let W of w) M += `| ${W.name} | ${W.serverName} | ${h3(W.tokens)} |
`;
        M += `
`
    }
    if (J && J.length > 0, X && X.length > 0, $.length > 0) {
        M += `### Custom Agents

`, M += `| Agent Type | Source | Tokens |
`, M += `|------------|--------|--------|
`;
        for (let W of $) {
            let D;
            switch (W.source) {
                case "projectSettings":
                    D = "Project";
                    break;
                case "userSettings":
                    D = "User";
                    break;
                case "localSettings":
                    D = "Local";
                    break;
                case "flagSettings":
                    D = "Flag";
                    break;
                case "policySettings":
                    D = "Policy";
                    break;
                case "plugin":
                    D = "Plugin";
                    break;
                case "built-in":
                    D = "Built-in";
                    break;
                default:
                    D = String(W.source)
            }
            M += `| ${W.agentType} | ${D} | ${h3(W.tokens)} |
`
        }
        M += `
`
    }
    if (O.length > 0) {
        M += `### Memory Files

`, M += `| Type | Path | Tokens |
`, M += `|------|------|--------|
`;
        for (let W of O) M += `| ${W.type} | ${W.path} | ${h3(W.tokens)} |
`;
        M += `
`
    }
    if (j && j.tokens > 0 && j.skillFrontmatter.length > 0) {
        M += `### Skills

`, M += `| Skill | Source | Tokens |
`, M += `|-------|--------|--------|
`;
        for (let W of j.skillFrontmatter) M += `| ${W.name} | ${sf6(W.source)} | ${h3(W.tokens)} |
`;
        M += `
`
    }
    return M
}
// @from(Ln 443229, Col 4)
EO7 = L(() => {
    $y();
    zl8();
    c7();
    _7();
    aY()
})
// @from(Ln 443236, Col 4)
FuK
// @from(Ln 443236, Col 9)
yO7
// @from(Ln 443237, Col 4)
guK = L(() => {
    y8();
    FuK = {
        name: "context",
        description: "Visualize current context usage as a colored grid",
        isEnabled: () => !I7(),
        type: "local-jsx",
        load: () => Promise.resolve().then(() => (BuK(), muK))
    }, yO7 = {
        type: "local",
        name: "context",
        supportsNonInteractive: !0,
        description: "Show current context usage",
        get isHidden() {
            return !I7()
        },
        isEnabled() {
            return I7()
        },
        load: () => Promise.resolve().then(() => (EO7(), puK))
    }
})
// @from(Ln 443259, Col 4)
UuK = {}
// @from(Ln 443263, Col 4)
tSY = async () => {
    if (i7()) {
        let q;
        if (Zk.isUsingOverage) q = "You are currently using your overages to power your Claude Code usage. We will automatically switch you back to your subscription rate limits when they reset";
        else q = "You are currently using your subscription to power your Claude Code usage";
        if (u8("tengu_amber_lark", !1)) {
            let K = GS4();
            if (K) q += `

${Y8.dim(K)}`
        }
        return {
            type: "text",
            value: q
        }
    }
    return {
        type: "text",
        value: MO(qI8())
    }
}
// @from(Ln 443284, Col 4)
QuK = L(() => {
    Y3();
    Tx();
    mN();
    B1();
    dI();
    T7()
})
// @from(Ln 443292, Col 4)
eSY
// @from(Ln 443292, Col 9)
Hi8
// @from(Ln 443293, Col 4)
duK = L(() => {
    T7();
    eSY = {
        type: "local",
        name: "cost",
        description: "Show the total cost and duration of the current session",
        get isHidden() {
            return i7()
        },
        supportsNonInteractive: !0,
        load: () => Promise.resolve().then(() => (QuK(), UuK))
    }, Hi8 = eSY
})
// @from(Ln 443307, Col 0)
function cuK() {
    let [q, K] = I_6.useState(null), [_, z] = I_6.useState(new Map), [Y, A] = I_6.useState(!0);
    return I_6.useEffect(() => {
        let O = !1;
        async function w() {
            try {
                let [$, j] = await Promise.all([CMK(), bMK()]);
                if (!O) K($), z(j), A(!1)
            } catch ($) {
                if (!O) K(null), z(new Map), A(!1)
            }
        }
        return w(), () => {
            O = !0
        }
    }, []), I_6.useMemo(() => {
        if (!q) return {
            stats: null,
            files: [],
            hunks: new Map,
            loading: Y
        };
        let {
            stats: O,
            perFileStats: w
        } = q, $ = [];
        for (let [j, H] of w) {
            let J = _.get(j),
                X = H.isUntracked ?? !1,
                M = !H.isBinary && !X && !J,
                P = H.added + H.removed,
                W = !M && !H.isBinary && P > qCY;
            $.push({
                path: j,
                linesAdded: H.added,
                linesRemoved: H.removed,
                isBinary: H.isBinary,
                isLargeFile: M,
                isTruncated: W,
                isUntracked: X
            })
        }
        return $.sort((j, H) => j.path.localeCompare(H.path)), {
            stats: O,
            files: $,
            hunks: _,
            loading: !1
        }
    }, [q, _, Y])
}
// @from(Ln 443357, Col 4)
I_6
// @from(Ln 443357, Col 9)
qCY = 400
// @from(Ln 443358, Col 4)
luK = L(() => {
    SU8();
    I_6 = K6(P6(), 1)
})
// @from(Ln 443363, Col 0)
function KCY(q) {
    if (!q || typeof q !== "object") return !1;
    let K = q,
        _ = typeof K.filePath === "string",
        z = Array.isArray(K.structuredPatch) && K.structuredPatch.length > 0,
        Y = K.type === "create" && typeof K.content === "string";
    return _ && (z || Y)
}
// @from(Ln 443372, Col 0)
function _CY(q) {
    return "type" in q && (q.type === "create" || q.type === "update")
}
// @from(Ln 443376, Col 0)
function zCY(q) {
    let K = 0,
        _ = 0;
    for (let z of q)
        for (let Y of z.lines)
            if (Y.startsWith("+")) K++;
            else if (Y.startsWith("-")) _++;
    return {
        added: K,
        removed: _
    }
}
// @from(Ln 443389, Col 0)
function YCY(q) {
    if (q.type !== "user") return "";
    let K = q.message.content,
        _ = typeof K === "string" ? K : "";
    if (_.length <= 30) return _;
    return _.slice(0, 29) + "…"
}
// @from(Ln 443397, Col 0)
function nuK(q) {
    let K = 0,
        _ = 0;
    for (let z of q.files.values()) K += z.linesAdded, _ += z.linesRemoved;
    q.stats = {
        filesChanged: q.files.size,
        linesAdded: K,
        linesRemoved: _
    }
}
// @from(Ln 443408, Col 0)
function iuK(q) {
    let K = Ji8.useRef({
        completedTurns: [],
        currentTurn: null,
        lastProcessedIndex: 0,
        lastTurnIndex: 0
    });
    return Ji8.useMemo(() => {
        let _ = K.current;
        if (q.length < _.lastProcessedIndex) _.completedTurns = [], _.currentTurn = null, _.lastProcessedIndex = 0, _.lastTurnIndex = 0;
        for (let Y = _.lastProcessedIndex; Y < q.length; Y++) {
            let A = q[Y];
            if (!A || A.type !== "user") continue;
            if (!(A.toolUseResult || Array.isArray(A.message.content) && A.message.content[0]?.type === "tool_result") && !A.isMeta) {
                if (_.currentTurn && _.currentTurn.files.size > 0) nuK(_.currentTurn), _.completedTurns.push(_.currentTurn);
                _.lastTurnIndex++, _.currentTurn = {
                    turnIndex: _.lastTurnIndex,
                    userPromptPreview: YCY(A),
                    timestamp: A.timestamp,
                    files: new Map,
                    stats: {
                        filesChanged: 0,
                        linesAdded: 0,
                        linesRemoved: 0
                    }
                }
            } else if (_.currentTurn && A.toolUseResult) {
                let w = A.toolUseResult;
                if (KCY(w)) {
                    let {
                        filePath: $,
                        structuredPatch: j
                    } = w, H = "type" in w && w.type === "create", J = _.currentTurn.files.get($);
                    if (!J) J = {
                        filePath: $,
                        hunks: [],
                        isNewFile: H,
                        linesAdded: 0,
                        linesRemoved: 0
                    }, _.currentTurn.files.set($, J);
                    if (H && j.length === 0 && _CY(w)) {
                        let M = w.content.split(`
`),
                            P = {
                                oldStart: 0,
                                oldLines: 0,
                                newStart: 1,
                                newLines: M.length,
                                lines: M.map((W) => "+" + W)
                            };
                        J.hunks.push(P), J.linesAdded += M.length
                    } else {
                        J.hunks.push(...j);
                        let {
                            added: X,
                            removed: M
                        } = zCY(j);
                        J.linesAdded += X, J.linesRemoved += M
                    }
                    if (H) J.isNewFile = !0
                }
            }
        }
        _.lastProcessedIndex = q.length;
        let z = [..._.completedTurns];
        if (_.currentTurn && _.currentTurn.files.size > 0) nuK(_.currentTurn), z.push(_.currentTurn);
        return z.reverse()
    }, [q])
}
// @from(Ln 443477, Col 4)
Ji8
// @from(Ln 443478, Col 4)
ruK = L(() => {
    Ji8 = K6(P6(), 1)
})
// @from(Ln 443482, Col 0)
function CP6(q) {
    let K = s(2),
        {
            children: _,
            when: z
        } = q;
    if (!(z === void 0 ? !0 : z)) return null;
    let A;
    if (K[0] !== _) A = ouK.default.createElement(T, {
        dimColor: !0
    }, " (", _, ")"), K[0] = _, K[1] = A;
    else A = K[1];
    return A
}
// @from(Ln 443496, Col 4)
ouK
// @from(Ln 443497, Col 4)
Xi8 = L(() => {
    o6();
    g6();
    ouK = K6(P6(), 1)
})
// @from(Ln 443506, Col 0)
function auK(q) {
    let K = s(53),
        {
            filePath: _,
            hunks: z,
            isLargeFile: Y,
            isBinary: A,
            isTruncated: O,
            isUntracked: w
        } = q,
        {
            columns: $
        } = s1(),
        j;
    q: {
        if (!_) {
            let h;
            if (K[0] === Symbol.for("react.memo_cache_sentinel")) h = {
                firstLine: null,
                fileContent: void 0
            }, K[0] = h;
            else h = K[0];
            j = h;
            break q
        }
        let V, k;
        if (K[1] !== _) {
            let h = ACY(b8(), _);
            V = nm7(h), k = V != null ? oY(V) : null, K[1] = _, K[2] = V, K[3] = k
        } else V = K[2],
        k = K[3];
        let N = V ?? void 0,
            R;
        if (K[4] !== k || K[5] !== N) R = {
            firstLine: k,
            fileContent: N
        },
        K[4] = k,
        K[5] = N,
        K[6] = R;
        else R = K[6];j = R
    }
    let {
        firstLine: H,
        fileContent: J
    } = j;
    if (w) {
        let V;
        if (K[7] !== _) V = Yw.default.createElement(T, {
            bold: !0
        }, _), K[7] = _, K[8] = V;
        else V = K[8];
        let k;
        if (K[9] === Symbol.for("react.memo_cache_sentinel")) k = Yw.default.createElement(CP6, null, "untracked"), K[9] = k;
        else k = K[9];
        let N;
        if (K[10] !== V) N = Yw.default.createElement(u, null, V, k), K[10] = V, K[11] = N;
        else N = K[11];
        let R;
        if (K[12] === Symbol.for("react.memo_cache_sentinel")) R = Yw.default.createElement(zA, {
            padding: 4
        }), K[12] = R;
        else R = K[12];
        let h;
        if (K[13] === Symbol.for("react.memo_cache_sentinel")) h = Yw.default.createElement(T, {
            dimColor: !0,
            italic: !0
        }, "New file not yet staged."), K[13] = h;
        else h = K[13];
        let C;
        if (K[14] !== _) C = Yw.default.createElement(u, {
            flexDirection: "column"
        }, h, Yw.default.createElement(T, {
            dimColor: !0,
            italic: !0
        }, "Run `git add ", _, "` to see line counts.")), K[14] = _, K[15] = C;
        else C = K[15];
        let x;
        if (K[16] !== N || K[17] !== C) x = Yw.default.createElement(u, {
            flexDirection: "column",
            width: "100%"
        }, N, R, C), K[16] = N, K[17] = C, K[18] = x;
        else x = K[18];
        return x
    }
    if (A) {
        let V;
        if (K[19] !== _) V = Yw.default.createElement(u, null, Yw.default.createElement(T, {
            bold: !0
        }, _)), K[19] = _, K[20] = V;
        else V = K[20];
        let k;
        if (K[21] === Symbol.for("react.memo_cache_sentinel")) k = Yw.default.createElement(zA, {
            padding: 4
        }), K[21] = k;
        else k = K[21];
        let N;
        if (K[22] === Symbol.for("react.memo_cache_sentinel")) N = Yw.default.createElement(u, {
            flexDirection: "column"
        }, Yw.default.createElement(T, {
            dimColor: !0,
            italic: !0
        }, "Binary file - cannot display diff")), K[22] = N;
        else N = K[22];
        let R;
        if (K[23] !== V) R = Yw.default.createElement(u, {
            flexDirection: "column",
            width: "100%"
        }, V, k, N), K[23] = V, K[24] = R;
        else R = K[24];
        return R
    }
    if (Y) {
        let V;
        if (K[25] !== _) V = Yw.default.createElement(u, null, Yw.default.createElement(T, {
            bold: !0
        }, _)), K[25] = _, K[26] = V;
        else V = K[26];
        let k;
        if (K[27] === Symbol.for("react.memo_cache_sentinel")) k = Yw.default.createElement(zA, {
            padding: 4
        }), K[27] = k;
        else k = K[27];
        let N;
        if (K[28] === Symbol.for("react.memo_cache_sentinel")) N = Yw.default.createElement(u, {
            flexDirection: "column"
        }, Yw.default.createElement(T, {
            dimColor: !0,
            italic: !0
        }, "Large file - diff exceeds 1 MB limit")), K[28] = N;
        else N = K[28];
        let R;
        if (K[29] !== V) R = Yw.default.createElement(u, {
            flexDirection: "column",
            width: "100%"
        }, V, k, N), K[29] = V, K[30] = R;
        else R = K[30];
        return R
    }
    let X;
    if (K[31] !== _) X = Yw.default.createElement(T, {
        bold: !0
    }, _), K[31] = _, K[32] = X;
    else X = K[32];
    let M = O ?? !1,
        P;
    if (K[33] !== M) P = Yw.default.createElement(CP6, {
        when: M
    }, "truncated"), K[33] = M, K[34] = P;
    else P = K[34];
    let W;
    if (K[35] !== X || K[36] !== P) W = Yw.default.createElement(u, null, X, P), K[35] = X, K[36] = P, K[37] = W;
    else W = K[37];
    let D;
    if (K[38] === Symbol.for("react.memo_cache_sentinel")) D = Yw.default.createElement(zA, {
        padding: 4
    }), K[38] = D;
    else D = K[38];
    let Z;
    if (K[39] !== $ || K[40] !== J || K[41] !== _ || K[42] !== H || K[43] !== z) Z = z.length === 0 ? Yw.default.createElement(T, {
        dimColor: !0
    }, "No diff content") : z.map((V, k) => Yw.default.createElement(il, {
        key: k,
        patch: V,
        filePath: _,
        firstLine: H,
        fileContent: J,
        dim: !1,
        width: $ - 2 - 2
    })), K[39] = $, K[40] = J, K[41] = _, K[42] = H, K[43] = z, K[44] = Z;
    else Z = K[44];
    let G;
    if (K[45] !== Z) G = Yw.default.createElement(u, {
        flexDirection: "column"
    }, Z), K[45] = Z, K[46] = G;
    else G = K[46];
    let f;
    if (K[47] !== O) f = O && Yw.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, "… diff truncated (exceeded 400 line limit)"), K[47] = O, K[48] = f;
    else f = K[48];
    let v;
    if (K[49] !== W || K[50] !== G || K[51] !== f) v = Yw.default.createElement(u, {
        flexDirection: "column",
        width: "100%"
    }, W, D, G, f), K[49] = W, K[50] = G, K[51] = f, K[52] = v;
    else v = K[52];
    return v
}
// @from(Ln 443696, Col 4)
Yw
// @from(Ln 443697, Col 4)
suK = L(() => {
    o6();
    I4();
    g6();
    n7();
    eK();
    Xi8();
    VR();
    fb6();
    Yw = K6(P6(), 1)
})
// @from(Ln 443709, Col 0)
function tuK(q) {
    let K = s(36),
        {
            files: _,
            selectedIndex: z
        } = q,
        {
            columns: Y
        } = s1(),
        A;
    q: {
        if (_.length === 0 || _.length <= s98) {
            let f;
            if (K[0] !== _.length) f = {
                startIndex: 0,
                endIndex: _.length
            }, K[0] = _.length, K[1] = f;
            else f = K[1];
            A = f;
            break q
        }
        let D = Math.max(0, z - Math.floor(s98 / 2)),
            Z = D + s98;
        if (Z > _.length) Z = _.length,
        D = Math.max(0, Z - s98);
        let G;
        if (K[2] !== Z || K[3] !== D) G = {
            startIndex: D,
            endIndex: Z
        },
        K[2] = Z,
        K[3] = D,
        K[4] = G;
        else G = K[4];A = G
    }
    let {
        startIndex: O,
        endIndex: w
    } = A;
    if (_.length === 0) {
        let D;
        if (K[5] === Symbol.for("react.memo_cache_sentinel")) D = fG.default.createElement(T, {
            dimColor: !0
        }, "No changed files"), K[5] = D;
        else D = K[5];
        return D
    }
    let $, j, H, J, X, M;
    if (K[6] !== Y || K[7] !== w || K[8] !== _ || K[9] !== z || K[10] !== O) {
        let D = _.slice(O, w),
            Z = O > 0;
        j = w < _.length, H = _.length > s98;
        let G = Math.max(20, Y - 16 - 3 - 4);
        if ($ = u, J = "column", K[17] !== Z || K[18] !== H || K[19] !== O) X = H && fG.default.createElement(T, {
            dimColor: !0
        }, Z ? ` ↑ ${O} more ${O7(O,"file")}` : " "), K[17] = Z, K[18] = H, K[19] = O, K[20] = X;
        else X = K[20];
        let f;
        if (K[21] !== G || K[22] !== z || K[23] !== O) f = (v, V) => fG.default.createElement(OCY, {
            key: v.path,
            file: v,
            isSelected: O + V === z,
            maxPathWidth: G
        }), K[21] = G, K[22] = z, K[23] = O, K[24] = f;
        else f = K[24];
        M = D.map(f), K[6] = Y, K[7] = w, K[8] = _, K[9] = z, K[10] = O, K[11] = $, K[12] = j, K[13] = H, K[14] = J, K[15] = X, K[16] = M
    } else $ = K[11], j = K[12], H = K[13], J = K[14], X = K[15], M = K[16];
    let P;
    if (K[25] !== w || K[26] !== _.length || K[27] !== j || K[28] !== H) P = H && fG.default.createElement(T, {
        dimColor: !0
    }, j ? ` ↓ ${_.length-w} more ${O7(_.length-w,"file")}` : " "), K[25] = w, K[26] = _.length, K[27] = j, K[28] = H, K[29] = P;
    else P = K[29];
    let W;
    if (K[30] !== $ || K[31] !== J || K[32] !== X || K[33] !== M || K[34] !== P) W = fG.default.createElement($, {
        flexDirection: J
    }, X, M, P), K[30] = $, K[31] = J, K[32] = X, K[33] = M, K[34] = P, K[35] = W;
    else W = K[35];
    return W
}