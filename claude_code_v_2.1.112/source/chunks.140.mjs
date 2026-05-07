
// @from(Ln 353450, Col 0)
function xjK({
    attachment: q,
    addMargin: K,
    verbose: _,
    isTranscriptMode: z,
    messageUuid: Y
}) {
    let A = If();
    if (z4() && q.type === "teammate_mailbox") {
        let O = q.messages.filter((w) => {
            if (Qk(w.text)) return !1;
            try {
                let $ = n8(w.text);
                return $?.type !== "idle_notification" && $?.type !== "teammate_terminated"
            } catch {
                return !0
            }
        });
        if (O.length === 0) return null;
        return Lq.default.createElement(u, {
            flexDirection: "column"
        }, O.map((w, $) => {
            let j = null;
            try {
                j = n8(w.text)
            } catch {}
            if (j?.type === "task_assignment") return Lq.default.createElement(u, {
                key: $,
                paddingLeft: 2
            }, Lq.default.createElement(T, null, $9, " "), Lq.default.createElement(T, null, "Task assigned: "), Lq.default.createElement(T, {
                bold: !0
            }, "#", j.taskId), Lq.default.createElement(T, null, " - ", j.subject), Lq.default.createElement(T, {
                dimColor: !0
            }, " (from ", j.assignedBy || w.from, ")"));
            let H = ig8(w.text, w.from);
            if (H) return Lq.default.createElement(Lq.default.Fragment, {
                key: $
            }, H);
            let J = KG(w.color),
                X = t$K(w.text) ?? w.text;
            return Lq.default.createElement(Xq7, {
                key: $,
                displayName: w.from,
                inkColor: J,
                content: X,
                summary: w.summary,
                isTranscriptMode: z
            })
        }))
    }
    switch (q.type) {
        case "directory":
            return Lq.default.createElement(LH, null, "Listed directory ", Lq.default.createElement(T, {
                bold: !0
            }, q.displayPath + x4Y));
        case "file":
        case "already_read_file":
            if (q.content.type === "notebook") return Lq.default.createElement(LH, null, "Read ", Lq.default.createElement(T, {
                bold: !0
            }, q.displayPath), " (", q.content.file.cells.length, " cells)");
            if (q.content.type === "file_unchanged") return Lq.default.createElement(LH, null, "Read ", Lq.default.createElement(T, {
                bold: !0
            }, q.displayPath), " (unchanged)");
            return Lq.default.createElement(LH, null, "Read ", Lq.default.createElement(T, {
                bold: !0
            }, q.displayPath), " (", q.content.type === "text" ? `${q.content.file.numLines}${q.truncated?"+":""} lines` : o4(q.content.file.originalSize), ")");
        case "compact_file_reference":
            return Lq.default.createElement(LH, null, "Referenced file ", Lq.default.createElement(T, {
                bold: !0
            }, q.displayPath));
        case "pdf_reference":
            return Lq.default.createElement(LH, null, "Referenced PDF ", Lq.default.createElement(T, {
                bold: !0
            }, q.displayPath), " (", q.pageCount, " pages)");
        case "selected_lines_in_ide":
            return Lq.default.createElement(LH, null, "⧉ Selected", " ", Lq.default.createElement(T, {
                bold: !0
            }, q.lineEnd - q.lineStart + 1), " ", "lines from ", Lq.default.createElement(T, {
                bold: !0
            }, q.displayPath), " in", " ", q.ideName);
        case "nested_memory":
            return Lq.default.createElement(LH, null, "Loaded ", Lq.default.createElement(T, {
                bold: !0
            }, q.displayPath));
        case "relevant_memories":
            if (wH() && jq7(q.memories)) return Lq.default.createElement(AjK, {
                memories: q.memories,
                messageUuid: Y,
                addMargin: K,
                bg: A,
                isTranscriptMode: z
            });
            return Lq.default.createElement(u, {
                flexDirection: "column",
                marginTop: K ? 1 : 0,
                backgroundColor: A
            }, Lq.default.createElement(u, {
                flexDirection: "row"
            }, Lq.default.createElement(u, {
                minWidth: 2
            }), Lq.default.createElement(T, {
                dimColor: !0
            }, "Recalled ", Lq.default.createElement(T, {
                bold: !0
            }, q.memories.length), " ", q.memories.length === 1 ? "memory" : "memories", !z && Lq.default.createElement(Lq.default.Fragment, null, " ", Lq.default.createElement(U2, null)))), (_ || z) && q.memories.map((O) => Lq.default.createElement(u, {
                key: O.path,
                flexDirection: "column"
            }, Lq.default.createElement(_1, null, Lq.default.createElement(T, {
                dimColor: !0
            }, Lq.default.createElement(YG, {
                filePath: O.path
            }, I4Y(O.path)))), z && Lq.default.createElement(u, {
                paddingLeft: 5
            }, Lq.default.createElement(T, null, Lq.default.createElement(v5, null, O.content))))));
        case "dynamic_skill": {
            let O = q.skillNames.length;
            return Lq.default.createElement(LH, null, "Loaded", " ", Lq.default.createElement(T, {
                bold: !0
            }, O, " ", O7(O, "skill")), " ", "from ", Lq.default.createElement(T, {
                bold: !0
            }, q.displayPath))
        }
        case "skill_listing": {
            if (q.isInitial) return null;
            return Lq.default.createElement(LH, null, Lq.default.createElement(T, {
                bold: !0
            }, q.skillCount), " ", O7(q.skillCount, "skill"), " available")
        }
        case "agent_listing_delta": {
            if (q.isInitial || q.addedTypes.length === 0) return null;
            let O = q.addedTypes.length;
            return Lq.default.createElement(LH, null, Lq.default.createElement(T, {
                bold: !0
            }, O), " agent ", O7(O, "type"), " available")
        }
        case "queued_command": {
            let O = typeof q.prompt === "string" ? q.prompt : qu(q.prompt) || "",
                w = q.imagePasteIds && q.imagePasteIds.length > 0;
            return Lq.default.createElement(u, {
                flexDirection: "column"
            }, Lq.default.createElement(qM6, {
                addMargin: K,
                param: {
                    text: O,
                    type: "text"
                },
                verbose: _,
                isTranscriptMode: z
            }), w && q.imagePasteIds?.map(($) => Lq.default.createElement(og8, {
                key: $,
                imageId: $
            })))
        }
        case "plan_file_reference":
            return Lq.default.createElement(LH, null, "Plan file referenced (", S3(q.planFilePath), ")");
        case "invoked_skills": {
            if (q.skills.length === 0) return null;
            let O = q.skills.map((w) => w.name).join(", ");
            return Lq.default.createElement(LH, null, "Skills restored (", O, ")")
        }
        case "diagnostics":
            return Lq.default.createElement(l$K, {
                attachment: q,
                verbose: _
            });
        case "mcp_resource":
            return Lq.default.createElement(LH, null, "Read MCP resource ", Lq.default.createElement(T, {
                bold: !0
            }, q.name), " from", " ", q.server);
        case "command_permissions":
            return null;
        case "async_hook_response": {
            if (q.hookEvent === "SessionStart" && !_) return null;
            if (!_ && !z) return null;
            return Lq.default.createElement(LH, null, "Async hook ", Lq.default.createElement(T, {
                bold: !0
            }, q.hookEvent), " completed")
        }
        case "hook_blocking_error": {
            if (q.hookEvent === "Stop" || q.hookEvent === "SubagentStop") return null;
            let O = q.blockingError.blockingError.trim();
            return Lq.default.createElement(Lq.default.Fragment, null, Lq.default.createElement(LH, {
                color: "error"
            }, q.hookName, " hook returned blocking error"), O ? Lq.default.createElement(LH, {
                color: "error"
            }, O) : null)
        }
        case "hook_non_blocking_error": {
            if (q.hookEvent === "Stop" || q.hookEvent === "SubagentStop") return null;
            let O = B4Y(q.stderr, q.stdout);
            return Lq.default.createElement(Lq.default.Fragment, null, Lq.default.createElement(LH, {
                color: "error"
            }, q.hookName, " hook error"), O ? Lq.default.createElement(LH, {
                color: "error"
            }, O) : null)
        }
        case "hook_error_during_execution":
            if (q.hookEvent === "Stop" || q.hookEvent === "SubagentStop") return null;
            return Lq.default.createElement(LH, null, q.hookName, " hook warning");
        case "hook_success":
            return null;
        case "hook_stopped_continuation":
            if (q.hookEvent === "Stop" || q.hookEvent === "SubagentStop") return null;
            return Lq.default.createElement(LH, {
                color: "warning"
            }, q.hookName, " hook stopped continuation: ", q.message);
        case "hook_deferred_tool":
            return Lq.default.createElement(LH, {
                color: "warning"
            }, q.hookName, " deferred ", q.toolName, " · resume with -p --resume to continue");
        case "hook_system_message":
            return Lq.default.createElement(LH, null, q.hookName, " says: ", q.content);
        case "hook_permission_decision": {
            let O = q.decision === "allow" ? "Allowed" : "Denied";
            return Lq.default.createElement(LH, null, O, " by ", Lq.default.createElement(T, {
                bold: !0
            }, q.hookEvent), " hook")
        }
        case "task_status":
            return Lq.default.createElement(u4Y, {
                attachment: q
            });
        case "teammate_shutdown_batch":
            return Lq.default.createElement(u, {
                flexDirection: "row",
                width: "100%",
                marginTop: 1,
                backgroundColor: A
            }, Lq.default.createElement(T, {
                dimColor: !0
            }, $9, " "), Lq.default.createElement(T, {
                dimColor: !0
            }, q.count, " ", O7(q.count, "teammate"), " shut down gracefully"));
        default:
            return q.type, null
    }
}
// @from(Ln 353688, Col 0)
function u4Y(q) {
    let K = s(4),
        {
            attachment: _
        } = q;
    if (z4() && _.taskType === "in_process_teammate") {
        let Y;
        if (K[0] !== _) Y = Lq.default.createElement(m4Y, {
            attachment: _
        }), K[0] = _, K[1] = Y;
        else Y = K[1];
        return Y
    }
    let z;
    if (K[2] !== _) z = Lq.default.createElement(ujK, {
        attachment: _
    }), K[2] = _, K[3] = z;
    else z = K[3];
    return z
}
// @from(Ln 353709, Col 0)
function ujK(q) {
    let K = s(9),
        {
            attachment: _
        } = q,
        z = If(),
        Y = _.status === "completed" ? "completed in background" : _.status === "killed" ? "stopped" : _.status === "running" ? "still running in background" : _.status,
        A;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) A = Lq.default.createElement(T, {
        dimColor: !0
    }, $9, " "), K[0] = A;
    else A = K[0];
    let O;
    if (K[1] !== _.description) O = Lq.default.createElement(T, {
        bold: !0
    }, _.description), K[1] = _.description, K[2] = O;
    else O = K[2];
    let w;
    if (K[3] !== Y || K[4] !== O) w = Lq.default.createElement(T, {
        dimColor: !0
    }, 'Task "', O, '" ', Y), K[3] = Y, K[4] = O, K[5] = w;
    else w = K[5];
    let $;
    if (K[6] !== z || K[7] !== w) $ = Lq.default.createElement(u, {
        flexDirection: "row",
        width: "100%",
        marginTop: 1,
        backgroundColor: z
    }, A, w), K[6] = z, K[7] = w, K[8] = $;
    else $ = K[8];
    return $
}
// @from(Ln 353742, Col 0)
function m4Y(q) {
    let K = s(16),
        {
            attachment: _
        } = q,
        z = If(),
        Y;
    if (K[0] !== _.taskId) Y = (M) => M.tasks[_.taskId], K[0] = _.taskId, K[1] = Y;
    else Y = K[1];
    let A = M8(Y);
    if (A?.type !== "in_process_teammate") {
        let M;
        if (K[2] !== _) M = Lq.default.createElement(ujK, {
            attachment: _
        }), K[2] = _, K[3] = M;
        else M = K[3];
        return M
    }
    let O;
    if (K[4] !== A.identity.color) O = KG(A.identity.color), K[4] = A.identity.color, K[5] = O;
    else O = K[5];
    let w = O,
        $ = _.status === "completed" ? "shut down gracefully" : _.status,
        j;
    if (K[6] === Symbol.for("react.memo_cache_sentinel")) j = Lq.default.createElement(T, {
        dimColor: !0
    }, $9, " "), K[6] = j;
    else j = K[6];
    let H;
    if (K[7] !== w || K[8] !== A.identity.agentName) H = Lq.default.createElement(T, {
        color: w,
        bold: !0,
        dimColor: !1
    }, "@", A.identity.agentName), K[7] = w, K[8] = A.identity.agentName, K[9] = H;
    else H = K[9];
    let J;
    if (K[10] !== $ || K[11] !== H) J = Lq.default.createElement(T, {
        dimColor: !0
    }, "Teammate", " ", H, " ", $), K[10] = $, K[11] = H, K[12] = J;
    else J = K[12];
    let X;
    if (K[13] !== z || K[14] !== J) X = Lq.default.createElement(u, {
        flexDirection: "row",
        width: "100%",
        marginTop: 1,
        backgroundColor: z
    }, j, J), K[13] = z, K[14] = J, K[15] = X;
    else X = K[15];
    return X
}
// @from(Ln 353793, Col 0)
function B4Y(q, K) {
    let _ = q?.trim() ? q : K?.trim() ? K : "";
    if (!_) return "";
    let z = i5(_, `

Expected schema:`).trim(),
        Y = 0,
        A = z.indexOf(`
`);
    while (A !== -1) {
        let w = z.slice(Y, A).trim();
        if (w) return w.length > 200 ? w.slice(0, 200) + "…" : w;
        Y = A + 1, A = z.indexOf(`
`, Y)
    }
    let O = z.slice(Y).trim();
    return O.length > 200 ? O.slice(0, 200) + "…" : O
}
// @from(Ln 353812, Col 0)
function LH(q) {
    let K = s(7),
        {
            dimColor: _,
            children: z,
            color: Y
        } = q,
        A = _ === void 0 ? !0 : _,
        O = If(),
        w;
    if (K[0] !== z || K[1] !== Y || K[2] !== A) w = Lq.default.createElement(_1, null, Lq.default.createElement(T, {
        color: Y,
        dimColor: A,
        wrap: "wrap"
    }, z)), K[0] = z, K[1] = Y, K[2] = A, K[3] = w;
    else w = K[3];
    let $;
    if (K[4] !== O || K[5] !== w) $ = Lq.default.createElement(u, {
        backgroundColor: O
    }, w), K[4] = O, K[5] = w, K[6] = $;
    else $ = K[6];
    return $
}
// @from(Ln 353835, Col 4)
Lq
// @from(Ln 353836, Col 4)
mjK = L(() => {
    o6();
    eK();
    c7();
    _7();
    A3();
    g6();
    VY();
    N7();
    fO();
    pt();
    e8();
    ZX();
    kk();
    n$K();
    S96();
    GK();
    wy();
    wq7();
    Hq7();
    Jq7();
    Mq7();
    eg8();
    Lq = K6(P6(), 1)
})
// @from(Ln 353862, Col 0)
function BjK(q, K) {
    let [_, z] = eC6.useState(q), Y = eC6.useRef(0);
    return eC6.useEffect(() => {
        let A = Date.now() - Y.current;
        if (A >= K) {
            Y.current = Date.now(), z(q);
            return
        }
        let O = setTimeout((w, $, j) => {
            w.current = Date.now(), $(j)
        }, K - A, Y, z, q);
        return () => clearTimeout(O)
    }, [q, K]), _
}
// @from(Ln 353876, Col 4)
eC6
// @from(Ln 353877, Col 4)
pjK = L(() => {
    eC6 = K6(P6(), 1)
})
// @from(Ln 353881, Col 0)
function qU8(q) {
    let K = s(21),
        {
            number: _,
            url: z,
            reviewState: Y,
            bold: A
        } = q,
        O;
    if (K[0] !== Y) O = p4Y(Y), K[0] = Y, K[1] = O;
    else O = K[1];
    let w = O,
        $ = !w && !A,
        j;
    if (K[2] !== A || K[3] !== _ || K[4] !== w || K[5] !== $) j = qb6.default.createElement(T, {
        color: w,
        dimColor: $,
        bold: A
    }, "#", _), K[2] = A, K[3] = _, K[4] = w, K[5] = $, K[6] = j;
    else j = K[6];
    let H = j,
        J = !A,
        X;
    if (K[7] !== J) X = qb6.default.createElement(T, {
        dimColor: J
    }, "PR"), K[7] = J, K[8] = X;
    else X = K[8];
    let M = !w && !A,
        P;
    if (K[9] !== A || K[10] !== _ || K[11] !== w || K[12] !== M) P = qb6.default.createElement(T, {
        color: w,
        dimColor: M,
        underline: !0,
        bold: A
    }, "#", _), K[9] = A, K[10] = _, K[11] = w, K[12] = M, K[13] = P;
    else P = K[13];
    let W;
    if (K[14] !== H || K[15] !== P || K[16] !== z) W = qb6.default.createElement(yq, {
        url: z,
        fallback: H
    }, P), K[14] = H, K[15] = P, K[16] = z, K[17] = W;
    else W = K[17];
    let D;
    if (K[18] !== X || K[19] !== W) D = qb6.default.createElement(T, null, X, " ", W), K[18] = X, K[19] = W, K[20] = D;
    else D = K[20];
    return D
}
// @from(Ln 353929, Col 0)
function p4Y(q) {
    switch (q) {
        case "approved":
            return "success";
        case "changes_requested":
            return "error";
        case "pending":
            return "warning";
        case "merged":
            return "merged";
        default:
            return
    }
}
// @from(Ln 353943, Col 4)
qb6
// @from(Ln 353944, Col 4)
Tq7 = L(() => {
    o6();
    g6();
    qb6 = K6(P6(), 1)
})
// @from(Ln 353949, Col 4)
FjK = {}
// @from(Ln 353955, Col 0)
function F4Y(q) {
    return (q.teamMemorySearchCount ?? 0) > 0 || (q.teamMemoryReadCount ?? 0) > 0 || (q.teamMemoryWriteCount ?? 0) > 0
}
// @from(Ln 353959, Col 0)
function g4Y(q) {
    let K = s(23),
        {
            message: _,
            isActiveGroup: z,
            hasPrecedingParts: Y
        } = q,
        A = _.teamMemoryReadCount ?? 0,
        O = _.teamMemorySearchCount ?? 0,
        w = _.teamMemoryWriteCount ?? 0;
    if (A === 0 && O === 0 && w === 0) return null;
    let $;
    if (K[0] !== Y || K[1] !== z || K[2] !== A || K[3] !== O || K[4] !== w) {
        let j = [],
            H = Y ? 1 : 0;
        if (A > 0) {
            let J = z ? H === 0 ? "Recalling" : "recalling" : H === 0 ? "Recalled" : "recalled";
            if (H > 0) {
                let W;
                if (K[6] === Symbol.for("react.memo_cache_sentinel")) W = BF.default.createElement(T, {
                    key: "comma-tmr"
                }, ", "), K[6] = W;
                else W = K[6];
                j.push(W)
            }
            let X;
            if (K[7] !== A) X = BF.default.createElement(T, {
                bold: !0
            }, A), K[7] = A, K[8] = X;
            else X = K[8];
            let M = A === 1 ? "memory" : "memories",
                P;
            if (K[9] !== X || K[10] !== M || K[11] !== J) P = BF.default.createElement(T, {
                key: "team-mem-read"
            }, J, " ", X, " team", " ", M), K[9] = X, K[10] = M, K[11] = J, K[12] = P;
            else P = K[12];
            j.push(P), H++
        }
        if (O > 0) {
            let J = z ? H === 0 ? "Searching" : "searching" : H === 0 ? "Searched" : "searched";
            if (H > 0) {
                let P;
                if (K[13] === Symbol.for("react.memo_cache_sentinel")) P = BF.default.createElement(T, {
                    key: "comma-tms"
                }, ", "), K[13] = P;
                else P = K[13];
                j.push(P)
            }
            let X = `${J} team memories`,
                M;
            if (K[14] !== X) M = BF.default.createElement(T, {
                key: "team-mem-search"
            }, X), K[14] = X, K[15] = M;
            else M = K[15];
            j.push(M), H++
        }
        if (w > 0) {
            let J = z ? H === 0 ? "Writing" : "writing" : H === 0 ? "Wrote" : "wrote";
            if (H > 0) {
                let W;
                if (K[16] === Symbol.for("react.memo_cache_sentinel")) W = BF.default.createElement(T, {
                    key: "comma-tmw"
                }, ", "), K[16] = W;
                else W = K[16];
                j.push(W)
            }
            let X;
            if (K[17] !== w) X = BF.default.createElement(T, {
                bold: !0
            }, w), K[17] = w, K[18] = X;
            else X = K[18];
            let M = w === 1 ? "memory" : "memories",
                P;
            if (K[19] !== X || K[20] !== M || K[21] !== J) P = BF.default.createElement(T, {
                key: "team-mem-write"
            }, J, " ", X, " team", " ", M), K[19] = X, K[20] = M, K[21] = J, K[22] = P;
            else P = K[22];
            j.push(P)
        }
        $ = BF.default.createElement(BF.default.Fragment, null, j), K[0] = Y, K[1] = z, K[2] = A, K[3] = O, K[4] = w, K[5] = $
    } else $ = K[5];
    return $
}
// @from(Ln 354042, Col 4)
BF
// @from(Ln 354043, Col 4)
gjK = L(() => {
    o6();
    g6();
    BF = K6(P6(), 1)
})
// @from(Ln 354052, Col 0)
function d4Y(q) {
    let K = s(24),
        {
            content: _,
            tools: z,
            lookups: Y,
            inProgressToolUseIDs: A,
            shouldAnimate: O,
            theme: w
        } = q,
        $ = If(),
        j, H;
    if (K[0] !== $ || K[1] !== _.id || K[2] !== _.input || K[3] !== _.name || K[4] !== A || K[5] !== Y || K[6] !== O || K[7] !== w || K[8] !== z) {
        H = Symbol.for("react.early_return_sentinel");
        q: {
            let J = rK(z, _.name) ?? rK(I96(), _.name);
            if (!J || J.isTransparentWrapper?.()) {
                H = null;
                break q
            }
            let X;
            if (K[11] !== _.id || K[12] !== Y.resolvedToolUseIDs) X = Y.resolvedToolUseIDs.has(_.id),
            K[11] = _.id,
            K[12] = Y.resolvedToolUseIDs,
            K[13] = X;
            else X = K[13];
            let M = X,
                P;
            if (K[14] !== _.id || K[15] !== Y.erroredToolUseIDs) P = Y.erroredToolUseIDs.has(_.id),
            K[14] = _.id,
            K[15] = Y.erroredToolUseIDs,
            K[16] = P;
            else P = K[16];
            let W = P,
                D;
            if (K[17] !== _.id || K[18] !== A) D = A.has(_.id),
            K[17] = _.id,
            K[18] = A,
            K[19] = D;
            else D = K[19];
            let Z = D,
                G = Y.toolResultByToolUseID.get(_.id),
                f = G?.type === "user" ? G.toolUseResult : void 0,
                v = J.outputSchema?.safeParse(f),
                V = v?.success ? v.data : void 0,
                k = J.inputSchema.safeParse(_.input),
                N = k.success ? k.data : void 0,
                R = J.userFacingName(N),
                h = N ? J.renderToolUseMessage(N, {
                    theme: w,
                    verbose: !0
                }) : null,
                C = O && Z,
                x = !M,
                B;
            if (K[20] !== W || K[21] !== C || K[22] !== x) B = Uq.default.createElement(xF, {
                shouldAnimate: C,
                isUnresolved: x,
                isError: W
            }),
            K[20] = W,
            K[21] = C,
            K[22] = x,
            K[23] = B;
            else B = K[23];j = Uq.default.createElement(u, {
                key: _.id,
                flexDirection: "column",
                marginTop: 1,
                backgroundColor: $
            }, Uq.default.createElement(u, {
                flexDirection: "row"
            }, B, Uq.default.createElement(T, null, Uq.default.createElement(T, {
                bold: !0
            }, R), h && Uq.default.createElement(T, null, "(", h, ")")), N && J.renderToolUseTag?.(N)), M && !W && V !== void 0 && Uq.default.createElement(u, null, J.renderToolResultMessage?.(V, [], {
                verbose: !0,
                tools: z,
                theme: w
            })))
        }
        K[0] = $, K[1] = _.id, K[2] = _.input, K[3] = _.name, K[4] = A, K[5] = Y, K[6] = O, K[7] = w, K[8] = z, K[9] = j, K[10] = H
    } else j = K[9], H = K[10];
    if (H !== Symbol.for("react.early_return_sentinel")) return H;
    return j
}
// @from(Ln 354137, Col 0)
function QjK({
    message: q,
    inProgressToolUseIDs: K,
    shouldAnimate: _,
    verbose: z,
    tools: Y,
    lookups: A,
    isActiveGroup: O
}) {
    let w = If(),
        {
            searchCount: $,
            readCount: j,
            listCount: H,
            replCount: J,
            memorySearchCount: X,
            memoryReadCount: M,
            memoryWriteCount: P,
            messages: W
        } = q,
        [D] = Zq(),
        Z = Kb6(q),
        G = Z.some((_6) => A.erroredToolUseIDs.has(_6)),
        f = X > 0 || M > 0 || P > 0,
        v = UjK.checkHasTeamMemOps(q),
        V = Uq.useRef(0),
        k = Uq.useRef(0),
        N = Uq.useRef(0),
        R = Uq.useRef(0),
        h = Uq.useRef(0);
    V.current = Math.max(V.current, j), k.current = Math.max(k.current, $), N.current = Math.max(N.current, H), R.current = Math.max(R.current, q.mcpCallCount ?? 0), h.current = Math.max(h.current, q.bashCount ?? 0);
    let C = q.otherToolCount ?? 0,
        x = q.editFileCount ?? 0,
        B = q.frameCount ?? 0,
        m = q.linesAdded ?? 0,
        S = q.linesRemoved ?? 0,
        F = V.current,
        U = k.current,
        g = N.current,
        c = R.current,
        n = q.gitOpBashCount ?? 0,
        l = lq() ? Math.max(0, h.current - n) : 0,
        z6 = U > 0 || F > 0 || g > 0 || J > 0 || c > 0 || l > 0 || n > 0 || C > 0 || x > 0 || B > 0,
        A6 = q.readFilePaths,
        e = q.searchArgs,
        i = q.latestDisplayHint;
    if (i === void 0) {
        let _6 = e?.at(-1),
            r = _6 !== void 0 ? `"${_6}"` : void 0,
            t = A6?.at(-1);
        i = t !== void 0 ? S3(t) : r
    }
    if (O)
        for (let _6 of Z) {
            if (!K.has(_6)) continue;
            let r = A.progressMessagesByToolUseID.get(_6)?.at(-1)?.data;
            if (r?.type === "repl_tool_call" && r.phase === "start") {
                let t = r.toolInput;
                i = t.file_path ?? (t.pattern ? `"${t.pattern}"` : void 0) ?? t.command ?? r.toolName
            }
        }
    let O6 = BjK(i, Q4Y);
    if (z) {
        let _6 = [];
        for (let r of W)
            if (r.type === "assistant") _6.push(r);
            else if (r.type === "grouped_tool_use") _6.push(...r.messages);
        return Uq.default.createElement(u, {
            flexDirection: "column"
        }, _6.map((r) => {
            let t = r.message.content[0];
            if (t?.type !== "tool_use") return null;
            return Uq.default.createElement(d4Y, {
                key: t.id,
                content: t,
                tools: Y,
                lookups: A,
                inProgressToolUseIDs: K,
                shouldAnimate: _,
                theme: D
            })
        }), q.hookInfos && q.hookInfos.length > 0 && Uq.default.createElement(Uq.default.Fragment, null, Uq.default.createElement(T, {
            dimColor: !0
        }, "  ⎿  ", "Ran ", q.hookCount, " PreToolUse", " ", q.hookCount === 1 ? "hook" : "hooks", " (", z28(q.hookTotalMs ?? 0), ")"), q.hookInfos.map((r, t) => Uq.default.createElement(T, {
            key: `hook-${t}`,
            dimColor: !0
        }, "     ⎿ ", r.command, " (", z28(r.durationMs ?? 0), ")"))), q.relevantMemories?.map((r) => Uq.default.createElement(u, {
            key: r.path,
            flexDirection: "column",
            marginTop: 1
        }, Uq.default.createElement(T, {
            dimColor: !0
        }, "  ⎿  ", "Recalled ", U4Y(r.path)), Uq.default.createElement(u, {
            paddingLeft: 5
        }, Uq.default.createElement(T, null, Uq.default.createElement(v5, null, r.content))))))
    }
    if (!f && !v && !z6) return null;
    let J6 = "";
    if (lq() && O) {
        let _6, r = 0;
        for (let t of Z) {
            if (!K.has(t)) continue;
            let Y6 = A.progressMessagesByToolUseID.get(t)?.at(-1)?.data;
            if (Y6?.type !== "bash_progress" && Y6?.type !== "powershell_progress") continue;
            if (_6 === void 0 || Y6.elapsedTimeSeconds > _6) _6 = Y6.elapsedTimeSeconds, r = Y6.totalLines
        }
        if (_6 !== void 0 && _6 >= 2) {
            let t = C5(_6 * 1000);
            J6 = r > 0 ? ` (${t} · ${r} ${r===1?"line":"lines"})` : ` (${t})`
        }
    }
    let $6 = [];
    if (x > 0) {
        let _6 = O ? "Editing" : "Edited";
        $6.push(Uq.default.createElement(T, {
            key: "edit"
        }, _6, " ", Uq.default.createElement(T, {
            bold: !0
        }, x), " ", x === 1 ? "file" : "files", m > 0 && Uq.default.createElement(Uq.default.Fragment, null, " ", Uq.default.createElement(T, {
            color: "diffAddedWord"
        }, "+", m)), S > 0 && Uq.default.createElement(Uq.default.Fragment, null, " ", Uq.default.createElement(T, {
            color: "diffRemovedWord"
        }, "-", S))))
    }

    function H6(_6, r, t) {
        let Y6 = $6.length === 0;
        if (!Y6) $6.push(Uq.default.createElement(T, {
            key: `comma-${_6}`
        }, ", "));
        $6.push(Uq.default.createElement(T, {
            key: _6
        }, Y6 ? r[0].toUpperCase() + r.slice(1) : r, " ", t))
    }
    if (lq() && q.commits?.length) {
        let _6 = {
            committed: "committed",
            amended: "amended commit",
            "cherry-picked": "cherry-picked"
        };
        for (let r of ["committed", "amended", "cherry-picked"]) {
            let t = q.commits.filter((Y6) => Y6.kind === r).map((Y6) => Y6.sha);
            if (t.length) H6(r, _6[r], Uq.default.createElement(T, {
                bold: !0
            }, t.join(", ")))
        }
    }
    if (lq() && q.pushes?.length) {
        let _6 = F4(q.pushes.map((r) => r.branch));
        H6("push", "pushed to", Uq.default.createElement(T, {
            bold: !0
        }, _6.join(", ")))
    }
    if (lq() && q.branches?.length) {
        let _6 = {
            merged: "merged",
            rebased: "rebased onto"
        };
        for (let r of q.branches) H6(`br-${r.action}-${r.ref}`, _6[r.action], Uq.default.createElement(T, {
            bold: !0
        }, r.ref))
    }
    if (lq() && q.prs?.length) {
        let _6 = {
            created: "created",
            edited: "edited",
            merged: "merged",
            commented: "commented on",
            closed: "closed",
            ready: "marked ready"
        };
        for (let r of q.prs) H6(`pr-${r.action}-${r.number}`, _6[r.action], r.url ? Uq.default.createElement(qU8, {
            number: r.number,
            url: r.url,
            bold: !0
        }) : Uq.default.createElement(T, {
            bold: !0
        }, "PR #", r.number))
    }
    if (U > 0) {
        let _6 = $6.length === 0,
            r = O ? _6 ? "Searching for" : "searching for" : _6 ? "Searched for" : "searched for";
        if (!_6) $6.push(Uq.default.createElement(T, {
            key: "comma-s"
        }, ", "));
        $6.push(Uq.default.createElement(T, {
            key: "search"
        }, r, " ", Uq.default.createElement(T, {
            bold: !0
        }, U), " ", U === 1 ? "pattern" : "patterns"))
    }
    if (F > 0) {
        let _6 = $6.length === 0,
            r = O ? _6 ? "Reading" : "reading" : _6 ? "Read" : "read";
        if (!_6) $6.push(Uq.default.createElement(T, {
            key: "comma-r"
        }, ", "));
        $6.push(Uq.default.createElement(T, {
            key: "read"
        }, r, " ", Uq.default.createElement(T, {
            bold: !0
        }, F), " ", F === 1 ? "file" : "files"))
    }
    if (g > 0) {
        let _6 = $6.length === 0,
            r = O ? _6 ? "Listing" : "listing" : _6 ? "Listed" : "listed";
        if (!_6) $6.push(Uq.default.createElement(T, {
            key: "comma-l"
        }, ", "));
        $6.push(Uq.default.createElement(T, {
            key: "list"
        }, r, " ", Uq.default.createElement(T, {
            bold: !0
        }, g), " ", g === 1 ? "directory" : "directories"))
    }
    if (J > 0) {
        let _6 = O ? "REPL'ing" : "REPL'd";
        if ($6.length > 0) $6.push(Uq.default.createElement(T, {
            key: "comma-repl"
        }, ", "));
        $6.push(Uq.default.createElement(T, {
            key: "repl"
        }, _6, " ", Uq.default.createElement(T, {
            bold: !0
        }, J), " ", J === 1 ? "time" : "times"))
    }
    if (c > 0) {
        let _6 = q.mcpServerNames?.map((Y6) => Y6.replace(/^claude\.ai /, "")).join(", ") || "MCP",
            r = $6.length === 0,
            t = O ? r ? "Calling" : "calling" : r ? "Called" : "called";
        if (!r) $6.push(Uq.default.createElement(T, {
            key: "comma-mcp"
        }, ", "));
        $6.push(Uq.default.createElement(T, {
            key: "mcp"
        }, t, " ", _6, c > 1 && Uq.default.createElement(Uq.default.Fragment, null, " ", Uq.default.createElement(T, {
            bold: !0
        }, c), " times")))
    }
    if (C > 0) {
        let _6 = $6.length === 0,
            r = O ? _6 ? "Calling" : "calling" : _6 ? "Called" : "called";
        if (!_6) $6.push(Uq.default.createElement(T, {
            key: "comma-other"
        }, ", "));
        $6.push(Uq.default.createElement(T, {
            key: "other"
        }, r, " ", Uq.default.createElement(T, {
            bold: !0
        }, C), " ", C === 1 ? "tool" : "tools"))
    }
    if (lq() && l > 0) {
        let _6 = $6.length === 0,
            r = O ? _6 ? "Running" : "running" : _6 ? "Ran" : "ran";
        if (!_6) $6.push(Uq.default.createElement(T, {
            key: "comma-bash"
        }, ", "));
        $6.push(Uq.default.createElement(T, {
            key: "bash"
        }, r, " ", Uq.default.createElement(T, {
            bold: !0
        }, l), " bash", " ", l === 1 ? "command" : "commands"))
    }
    let q6 = $6.length > 0,
        o = [];
    if (M > 0) {
        let _6 = !q6 && o.length === 0,
            r = O ? _6 ? "Recalling" : "recalling" : _6 ? "Recalled" : "recalled";
        if (!_6) o.push(Uq.default.createElement(T, {
            key: "comma-mr"
        }, ", "));
        o.push(Uq.default.createElement(T, {
            key: "mem-read"
        }, r, " ", Uq.default.createElement(T, {
            bold: !0
        }, M), " ", M === 1 ? "memory" : "memories"))
    }
    if (X > 0) {
        let _6 = !q6 && o.length === 0,
            r = O ? _6 ? "Searching" : "searching" : _6 ? "Searched" : "searched";
        if (!_6) o.push(Uq.default.createElement(T, {
            key: "comma-ms"
        }, ", "));
        o.push(Uq.default.createElement(T, {
            key: "mem-search"
        }, `${r} memories`))
    }
    if (P > 0) {
        let _6 = !q6 && o.length === 0,
            r = O ? _6 ? "Writing" : "writing" : _6 ? "Wrote" : "wrote";
        if (!_6) o.push(Uq.default.createElement(T, {
            key: "comma-mw"
        }, ", "));
        o.push(Uq.default.createElement(T, {
            key: "mem-write"
        }, r, " ", Uq.default.createElement(T, {
            bold: !0
        }, P), " ", P === 1 ? "memory" : "memories"))
    }
    return Uq.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1,
        backgroundColor: w
    }, Uq.default.createElement(u, {
        flexDirection: "row"
    }, O ? Uq.default.createElement(xF, {
        shouldAnimate: !0,
        isUnresolved: !0,
        isError: G
    }) : Uq.default.createElement(u, {
        minWidth: 2
    }), Uq.default.createElement(T, {
        dimColor: !O
    }, $6, o, UjK.TeamMemCountParts({
        message: q,
        isActiveGroup: O,
        hasPrecedingParts: q6 || o.length > 0
    }), O && Uq.default.createElement(T, {
        key: "ellipsis"
    }, "…"), " ", Uq.default.createElement(U2, null))), O && O6 !== void 0 && Uq.default.createElement(u, {
        flexDirection: "row"
    }, Uq.default.createElement(u, {
        width: 5,
        flexShrink: 0
    }, Uq.default.createElement(T, {
        dimColor: !0
    }, "  ⎿  ")), Uq.default.createElement(u, {
        flexDirection: "column",
        flexGrow: 1
    }, O6.split(`
`).map((_6, r, t) => Uq.default.createElement(T, {
        key: `hint-${r}`,
        dimColor: !0
    }, _6, r === t.length - 1 && J6)))), q.hookTotalMs !== void 0 && q.hookTotalMs > 0 && Uq.default.createElement(T, {
        dimColor: !0
    }, "  ⎿  ", "Ran ", q.hookCount, " PreToolUse", " ", q.hookCount === 1 ? "hook" : "hooks", " (", z28(q.hookTotalMs), ")"), O && q.pendingText && Uq.default.createElement(u, {
        flexDirection: "row",
        marginTop: 1
    }, Uq.default.createElement(u, {
        width: 2,
        flexShrink: 0
    }, Uq.default.createElement(T, {
        dimColor: !0
    }, $9)), Uq.default.createElement(T, {
        dimColor: !0
    }, q.pendingText)))
}
// @from(Ln 354484, Col 4)
Uq
// @from(Ln 354484, Col 8)
UjK
// @from(Ln 354484, Col 13)
Q4Y = 700
// @from(Ln 354485, Col 4)
djK = L(() => {
    o6();
    A3();
    pjK();
    g6();
    gq();
    bK8();
    Bt();
    eK();
    c7();
    nO();
    kk();
    wy();
    Tq7();
    lC6();
    Uq = K6(P6(), 1), UjK = (gjK(), B7(FjK))
})
// @from(Ln 354503, Col 0)
function cjK() {
    let q = s(2),
        K = V3("app:toggleTranscript", "Global", "ctrl+o"),
        _;
    if (q[0] !== K) _ = IK8.createElement(u, {
        marginY: 1
    }, IK8.createElement(T, {
        dimColor: !0
    }, "✻ Conversation compacted (", K, " for history)")), q[0] = K, q[1] = _;
    else _ = q[1];
    return _
}
// @from(Ln 354515, Col 4)
IK8
// @from(Ln 354516, Col 4)
ljK = L(() => {
    o6();
    g6();
    RM();
    IK8 = K6(P6(), 1)
})
// @from(Ln 354523, Col 0)
function njK({
    message: q,
    tools: K,
    lookups: _,
    inProgressToolUseIDs: z,
    shouldAnimate: Y
}) {
    let A = rK(K, q.toolName);
    if (!A?.renderGroupedToolUse) return null;
    let O = new Map;
    for (let j of q.results)
        for (let H of j.message.content)
            if (H.type === "tool_result") O.set(H.tool_use_id, {
                param: H,
                output: j.toolUseResult
            });
    let w = q.messages.map((j) => {
            let H = j.message.content[0],
                J = O.get(H.id);
            return {
                param: H,
                isResolved: _.resolvedToolUseIDs.has(H.id),
                isError: _.erroredToolUseIDs.has(H.id),
                isInProgress: z.has(H.id),
                progressMessages: W46(_.progressMessagesByToolUseID.get(H.id) ?? []),
                result: J
            }
        }),
        $ = w.some((j) => j.isInProgress);
    return A.renderGroupedToolUse(w, {
        shouldAnimate: Y && $,
        tools: K
    })
}
// @from(Ln 354557, Col 4)
ijK = L(() => {
    gq()
})
// @from(Ln 354561, Col 0)
function ajK(q) {
    let K = s(36),
        {
            message: _,
            verbose: z
        } = q,
        {
            retryAttempt: Y,
            error: A,
            retryInMs: O,
            maxRetries: w
        } = _,
        $ = yh8(A),
        j = $?.resetsAt ? Q86($.resetsAt) : void 0,
        H = Y < w && !xM4(A) && !Zp(A)?.isSSLError && !$,
        [J, X] = ojK.useState(0),
        M = Math.max(0, O - J),
        P = M > 60000 ? 60000 : 1000,
        W;
    if (K[0] !== P) W = () => X((U) => U + P), K[0] = P, K[1] = W;
    else W = K[1];
    fD(W, M === 0 ? null : P);
    let D;
    if (K[2] !== M) D = C5(M, {
        mostSignificantOnly: !0
    }), K[2] = M, K[3] = D;
    else D = K[3];
    let Z = D,
        G = j ? ` (${j})` : "",
        f;
    if (K[4] !== w || K[5] !== G || K[6] !== Y || K[7] !== Z) f = bM.createElement(T, {
        dimColor: !0
    }, "Retrying in ", Z, G, " · attempt ", Y, "/", w, process.env.API_TIMEOUT_MS ? ` · API_TIMEOUT_MS=${process.env.API_TIMEOUT_MS}ms, try increasing it` : ""), K[4] = w, K[5] = G, K[6] = Y, K[7] = Z, K[8] = f;
    else f = K[8];
    let v = f;
    if (H) {
        let U;
        if (K[9] !== v) U = bM.createElement(_1, null, v), K[9] = v, K[10] = U;
        else U = K[10];
        return U
    }
    if ($) {
        let U = $.rateLimitType ? RM4($.rateLimitType) : "usage limit",
            g;
        if (K[11] === Symbol.for("react.memo_cache_sentinel")) g = !1, K[11] = g;
        else g = K[11];
        return bM.createElement(_1, null, bM.createElement(u, {
            flexDirection: "column"
        }, bM.createElement(T, null, bM.createElement(T, {
            color: "error"
        }, U[0]?.toUpperCase(), U.slice(1), " reached"), g), v))
    }
    let V, k, N, R, h, C, x;
    if (K[12] !== A || K[13] !== z) {
        let U = fj6(A);
        x = !z && U.length > rjK, N = _1, k = u, C = "column", V = T, R = "error", h = x ? U.slice(0, rjK) + "…" : U, K[12] = A, K[13] = z, K[14] = V, K[15] = k, K[16] = N, K[17] = R, K[18] = h, K[19] = C, K[20] = x
    } else V = K[14], k = K[15], N = K[16], R = K[17], h = K[18], C = K[19], x = K[20];
    let B;
    if (K[21] !== V || K[22] !== R || K[23] !== h) B = bM.createElement(V, {
        color: R
    }, h), K[21] = V, K[22] = R, K[23] = h, K[24] = B;
    else B = K[24];
    let m;
    if (K[25] !== x) m = x && bM.createElement(U2, null), K[25] = x, K[26] = m;
    else m = K[26];
    let S;
    if (K[27] !== k || K[28] !== v || K[29] !== C || K[30] !== B || K[31] !== m) S = bM.createElement(k, {
        flexDirection: C
    }, B, m, v), K[27] = k, K[28] = v, K[29] = C, K[30] = B, K[31] = m, K[32] = S;
    else S = K[32];
    let F;
    if (K[33] !== N || K[34] !== S) F = bM.createElement(N, null, S), K[33] = N, K[34] = S, K[35] = F;
    else F = K[35];
    return F
}
// @from(Ln 354636, Col 4)
bM
// @from(Ln 354636, Col 8)
ojK
// @from(Ln 354636, Col 13)
rjK = 1000
// @from(Ln 354637, Col 4)
sjK = L(() => {
    o6();
    g6();
    Ws();
    dI();
    Jy6();
    c7();
    wk();
    kk();
    GK();
    bM = K6(P6(), 1), ojK = K6(P6(), 1)
})
// @from(Ln 354650, Col 0)
function xK8(q) {
    let K = q[0];
    if (!K) return null;
    let _ = q.length;
    if (q.every((z) => z.type === K.type)) switch (K.type) {
        case "local_bash": {
            let z = w7(q, (O) => O.type === "local_bash" && O.kind === "monitor"),
                Y = _ - z,
                A = [];
            if (Y > 0) A.push(Y === 1 ? "1 shell" : `${Y} shells`);
            if (z > 0) A.push(z === 1 ? "1 monitor" : `${z} monitors`);
            return A.join(", ")
        }
        case "in_process_teammate": {
            let z = new Set(q.map((Y) => Y.type === "in_process_teammate" ? Y.identity.teamName : "")).size;
            return z === 1 ? "1 team" : `${z} teams`
        }
        case "local_agent":
            return _ === 1 ? "1 local agent" : `${_} local agents`;
        case "remote_agent": {
            if (_ === 1 && K.isUltraplan) switch (K.ultraplanPhase) {
                case "plan_ready":
                    return `${dZ} ultraplan ready`;
                case "needs_input":
                    return `${eH} ultraplan needs your input`;
                default:
                    return `${eH} ultraplan`
            }
            return _ === 1 ? `${eH} 1 cloud session` : `${eH} ${_} cloud sessions`
        }
        case "local_workflow":
            return _ === 1 ? "1 background workflow" : `${_} background workflows`;
        case "monitor_mcp":
            return _ === 1 ? "1 monitor" : `${_} monitors`;
        case "dream":
            return "dreaming"
    }
    return `${_} background ${_===1?"task":"tasks"}`
}
// @from(Ln 354690, Col 0)
function tjK(q) {
    if (q.length !== 1) return !1;
    let K = q[0];
    return K.type === "remote_agent" && K.isUltraplan === !0 && K.ultraplanPhase !== void 0
}
// @from(Ln 354695, Col 4)
KU8 = L(() => {
    A3()
})
// @from(Ln 354698, Col 4)
ejK = {}
// @from(Ln 354703, Col 0)
function c4Y(q) {
    let K = q.teamCount ?? 0;
    if (K === 0) return null;
    return {
        segment: `${K} team ${K===1?"memory":"memories"}`,
        count: K
    }
}
// @from(Ln 354715, Col 0)
function qHK(q) {
    let K = s(53),
        {
            message: _,
            addMargin: z,
            verbose: Y,
            isTranscriptMode: A
        } = q,
        O = If();
    if (_.subtype === "turn_duration") {
        let M;
        if (K[0] !== z || K[1] !== _) M = K7.createElement(e4Y, {
            message: _,
            addMargin: z
        }), K[0] = z, K[1] = _, K[2] = M;
        else M = K[2];
        return M
    }
    if (_.subtype === "memory_saved") {
        let M = Y || !!A,
            P;
        if (K[3] !== z || K[4] !== _ || K[5] !== M) P = K7.createElement(_KY, {
            message: _,
            addMargin: z,
            verbose: M
        }), K[3] = z, K[4] = _, K[5] = M, K[6] = P;
        else P = K[6];
        return P
    }
    if (_.subtype === "away_summary") {
        let M = z ? 1 : 0,
            P;
        if (K[7] === Symbol.for("react.memo_cache_sentinel")) P = K7.createElement(u, {
            minWidth: 2
        }, K7.createElement(T, {
            dimColor: !0
        }, zg7)), K[7] = P;
        else P = K[7];
        let W;
        if (K[8] === Symbol.for("react.memo_cache_sentinel")) W = K7.createElement(T, {
            dimColor: !0,
            bold: !0
        }, "recap:", " "), K[8] = W;
        else W = K[8];
        let D;
        if (K[9] !== _.content) D = K7.createElement(T, null, W, K7.createElement(T, {
            dimColor: !0,
            italic: !0
        }, _.content)), K[9] = _.content, K[10] = D;
        else D = K[10];
        let Z;
        if (K[11] !== O || K[12] !== M || K[13] !== D) Z = K7.createElement(u, {
            flexDirection: "row",
            marginTop: M,
            backgroundColor: O,
            width: "100%"
        }, P, D), K[11] = O, K[12] = M, K[13] = D, K[14] = Z;
        else Z = K[14];
        return Z
    }
    if (_.subtype === "agents_killed") {
        let M = z ? 1 : 0,
            P, W;
        if (K[15] === Symbol.for("react.memo_cache_sentinel")) P = K7.createElement(u, {
            minWidth: 2
        }, K7.createElement(T, {
            color: "error"
        }, $9)), W = K7.createElement(T, {
            dimColor: !0
        }, "All background agents stopped"), K[15] = P, K[16] = W;
        else P = K[15], W = K[16];
        let D;
        if (K[17] !== O || K[18] !== M) D = K7.createElement(u, {
            flexDirection: "row",
            marginTop: M,
            backgroundColor: O,
            width: "100%"
        }, P, W), K[17] = O, K[18] = M, K[19] = D;
        else D = K[19];
        return D
    }
    if (_.subtype === "thinking") return null;
    if (_.subtype === "bridge_status") {
        let M;
        if (K[20] !== z || K[21] !== _) M = K7.createElement(AKY, {
            message: _,
            addMargin: z
        }), K[20] = z, K[21] = _, K[22] = M;
        else M = K[22];
        return M
    }
    if (_.subtype === "scheduled_task_fire") {
        let M = z ? 1 : 0,
            P;
        if (K[23] !== _.content) P = K7.createElement(T, {
            dimColor: !0
        }, EV, " ", _.content), K[23] = _.content, K[24] = P;
        else P = K[24];
        let W;
        if (K[25] !== O || K[26] !== M || K[27] !== P) W = K7.createElement(u, {
            marginTop: M,
            backgroundColor: O,
            width: "100%"
        }, P), K[25] = O, K[26] = M, K[27] = P, K[28] = W;
        else W = K[28];
        return W
    }
    if (_.subtype === "permission_retry") {
        let M = z ? 1 : 0,
            P, W;
        if (K[29] === Symbol.for("react.memo_cache_sentinel")) P = K7.createElement(T, {
            dimColor: !0
        }, EV, " "), W = K7.createElement(T, null, "Allowed "), K[29] = P, K[30] = W;
        else P = K[29], W = K[30];
        let D;
        if (K[31] !== _.commands) D = _.commands.join(", "), K[31] = _.commands, K[32] = D;
        else D = K[32];
        let Z;
        if (K[33] !== D) Z = K7.createElement(T, {
            bold: !0
        }, D), K[33] = D, K[34] = Z;
        else Z = K[34];
        let G;
        if (K[35] !== O || K[36] !== M || K[37] !== Z) G = K7.createElement(u, {
            marginTop: M,
            backgroundColor: O,
            width: "100%"
        }, P, W, Z), K[35] = O, K[36] = M, K[37] = Z, K[38] = G;
        else G = K[38];
        return G
    }
    if (_.subtype !== "stop_hook_summary" && !Y && _.level === "info") return null;
    if (_.subtype === "api_error") {
        let M;
        if (K[39] !== _ || K[40] !== Y) M = K7.createElement(ajK, {
            message: _,
            verbose: Y
        }), K[39] = _, K[40] = Y, K[41] = M;
        else M = K[41];
        return M
    }
    if (_.subtype === "stop_hook_summary") {
        let M;
        if (K[42] !== z || K[43] !== A || K[44] !== _ || K[45] !== Y) M = K7.createElement(r4Y, {
            message: _,
            addMargin: z,
            verbose: Y,
            isTranscriptMode: A
        }), K[42] = z, K[43] = A, K[44] = _, K[45] = Y, K[46] = M;
        else M = K[46];
        return M
    }
    let $ = _.content;
    if (typeof $ !== "string") return null;
    let j = _.level !== "info",
        H = _.level === "warning" ? "warning" : void 0,
        J = _.level === "info",
        X;
    if (K[47] !== z || K[48] !== $ || K[49] !== j || K[50] !== H || K[51] !== J) X = K7.createElement(u, {
        flexDirection: "row",
        width: "100%"
    }, K7.createElement(t4Y, {
        content: $,
        addMargin: z,
        dot: j,
        color: H,
        dimColor: J
    })), K[47] = z, K[48] = $, K[49] = j, K[50] = H, K[51] = J, K[52] = X;
    else X = K[52];
    return X
}
// @from(Ln 354887, Col 0)
function r4Y(q) {
    let K = s(47),
        {
            message: _,
            addMargin: z,
            verbose: Y,
            isTranscriptMode: A
        } = q,
        O = If(),
        {
            hookCount: w,
            hookInfos: $,
            hookErrors: j,
            preventedContinuation: H,
            stopReason: J
        } = _,
        {
            columns: X
        } = s1(),
        M;
    if (K[0] !== $ || K[1] !== _.totalDurationMs) M = _.totalDurationMs ?? $.reduce(s4Y, 0), K[0] = $, K[1] = _.totalDurationMs, K[2] = M;
    else M = K[2];
    let P = M;
    if (j.length === 0 && !H && !_.hookLabel) return null;
    let W;
    if (K[3] !== P) W = "", K[3] = P, K[4] = W;
    else W = K[4];
    let D = W;
    if (_.hookLabel) {
        let S = w === 1 ? "hook" : "hooks",
            F;
        if (K[5] !== w || K[6] !== _.hookLabel || K[7] !== S || K[8] !== D) F = K7.createElement(T, {
            dimColor: !0
        }, "  ⎿  ", "Ran ", w, " ", _.hookLabel, " ", S, D), K[5] = w, K[6] = _.hookLabel, K[7] = S, K[8] = D, K[9] = F;
        else F = K[9];
        let U;
        if (K[10] !== $ || K[11] !== A) U = A && $.map(a4Y), K[10] = $, K[11] = A, K[12] = U;
        else U = K[12];
        let g;
        if (K[13] !== F || K[14] !== U) g = K7.createElement(u, {
            flexDirection: "column",
            width: "100%"
        }, F, U), K[13] = F, K[14] = U, K[15] = g;
        else g = K[15];
        return g
    }
    let Z = z ? 1 : 0,
        G;
    if (K[16] === Symbol.for("react.memo_cache_sentinel")) G = K7.createElement(u, {
        minWidth: 2
    }, K7.createElement(T, null, $9)), K[16] = G;
    else G = K[16];
    let f = X - 10,
        v;
    if (K[17] !== w) v = K7.createElement(T, {
        bold: !0
    }, w), K[17] = w, K[18] = v;
    else v = K[18];
    let V = _.hookLabel ?? "stop",
        k = w === 1 ? "hook" : "hooks",
        N;
    if (K[19] !== $ || K[20] !== Y) N = !Y && $.length > 0 && K7.createElement(K7.Fragment, null, " ", K7.createElement(U2, null)), K[19] = $, K[20] = Y, K[21] = N;
    else N = K[21];
    let R;
    if (K[22] !== v || K[23] !== V || K[24] !== k || K[25] !== N || K[26] !== D) R = K7.createElement(T, null, "Ran ", v, " ", V, " ", k, D, N), K[22] = v, K[23] = V, K[24] = k, K[25] = N, K[26] = D, K[27] = R;
    else R = K[27];
    let h;
    if (K[28] !== $ || K[29] !== Y) h = Y && $.length > 0 && $.map(o4Y), K[28] = $, K[29] = Y, K[30] = h;
    else h = K[30];
    let C;
    if (K[31] !== H || K[32] !== J) C = H && J && K7.createElement(T, null, K7.createElement(T, {
        dimColor: !0
    }, "⎿  "), J), K[31] = H, K[32] = J, K[33] = C;
    else C = K[33];
    let x;
    if (K[34] !== j || K[35] !== _.hookLabel) x = j.length > 0 && j.map((S, F) => K7.createElement(T, {
        key: F
    }, K7.createElement(T, {
        dimColor: !0
    }, "⎿  "), _.hookLabel ?? "Stop", " hook error: ", S)), K[34] = j, K[35] = _.hookLabel, K[36] = x;
    else x = K[36];
    let B;
    if (K[37] !== R || K[38] !== h || K[39] !== C || K[40] !== x || K[41] !== f) B = K7.createElement(u, {
        flexDirection: "column",
        width: f
    }, R, h, C, x), K[37] = R, K[38] = h, K[39] = C, K[40] = x, K[41] = f, K[42] = B;
    else B = K[42];
    let m;
    if (K[43] !== O || K[44] !== B || K[45] !== Z) m = K7.createElement(u, {
        flexDirection: "row",
        marginTop: Z,
        backgroundColor: O,
        width: "100%"
    }, G, B), K[43] = O, K[44] = B, K[45] = Z, K[46] = m;
    else m = K[46];
    return m
}
// @from(Ln 354985, Col 0)
function o4Y(q, K) {
    return K7.createElement(T, {
        key: `cmd-${K}`,
        dimColor: !0
    }, "⎿  ", q.command === "prompt" ? `prompt: ${q.promptText||""}` : q.command, "")
}
// @from(Ln 354992, Col 0)
function a4Y(q, K) {
    return K7.createElement(T, {
        key: `cmd-${K}`,
        dimColor: !0
    }, "     ⎿ ", q.command === "prompt" ? `prompt: ${q.promptText||""}` : q.command, "")
}
// @from(Ln 354999, Col 0)
function s4Y(q, K) {
    return q + (K.durationMs ?? 0)
}
// @from(Ln 355003, Col 0)
function t4Y(q) {
    let K = s(18),
        {
            content: _,
            addMargin: z,
            dot: Y,
            color: A,
            dimColor: O
        } = q,
        {
            columns: w
        } = s1(),
        $ = If(),
        j = z ? 1 : 0,
        H;
    if (K[0] !== A || K[1] !== O || K[2] !== Y) H = Y && K7.createElement(u, {
        minWidth: 2
    }, K7.createElement(T, {
        color: A,
        dimColor: O
    }, $9)), K[0] = A, K[1] = O, K[2] = Y, K[3] = H;
    else H = K[3];
    let J = w - 10,
        X;
    if (K[4] !== _) X = _.trim(), K[4] = _, K[5] = X;
    else X = K[5];
    let M;
    if (K[6] !== A || K[7] !== O || K[8] !== X) M = K7.createElement(T, {
        color: A,
        dimColor: O,
        wrap: "wrap"
    }, X), K[6] = A, K[7] = O, K[8] = X, K[9] = M;
    else M = K[9];
    let P;
    if (K[10] !== J || K[11] !== M) P = K7.createElement(u, {
        flexDirection: "column",
        width: J
    }, M), K[10] = J, K[11] = M, K[12] = P;
    else P = K[12];
    let W;
    if (K[13] !== $ || K[14] !== j || K[15] !== H || K[16] !== P) W = K7.createElement(u, {
        flexDirection: "row",
        marginTop: j,
        backgroundColor: $,
        width: "100%"
    }, H, P), K[13] = $, K[14] = j, K[15] = H, K[16] = P, K[17] = W;
    else W = K[17];
    return W
}
// @from(Ln 355053, Col 0)
function e4Y(q) {
    let K = s(17),
        {
            message: _,
            addMargin: z
        } = q,
        Y = If(),
        [A] = _U8.useState(qKY),
        O = H9(),
        w;
    if (K[0] !== O) w = () => {
        let k = O.getState().tasks,
            N = Object.values(k ?? {}).filter(yH);
        return N.length > 0 ? xK8(N) : null
    }, K[0] = O, K[1] = w;
    else w = K[1];
    let [$] = _U8.useState(w), j;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) j = H8().showTurnDuration ?? !0, K[2] = j;
    else j = K[2];
    let H = j,
        J;
    if (K[3] !== _.durationMs) J = C5(_.durationMs), K[3] = _.durationMs, K[4] = J;
    else J = K[4];
    let X = J,
        M = _.budgetLimit !== void 0,
        P;
    q: {
        if (!M) {
            P = "";
            break q
        }
        let {
            budgetTokens: k,
            budgetLimit: N
        } = _,
        R;
        if (K[5] !== N || K[6] !== k) R = k >= N ? `${iK(k)} used (${iK(N)} min ${e6.tick})` : `${iK(k)} / ${iK(N)} (${Math.round(k/N*100)}%)`,
        K[5] = N,
        K[6] = k,
        K[7] = R;
        else R = K[7];
        let h = R,
            C = _.budgetNudges > 0 ? ` · ${_.budgetNudges} ${_.budgetNudges===1?"nudge":"nudges"}` : "";P = `${H?" · ":""}${h}${C}`
    }
    let W = P;
    if (!H && !M) return null;
    let D = z ? 1 : 0,
        Z;
    if (K[8] === Symbol.for("react.memo_cache_sentinel")) Z = K7.createElement(u, {
        minWidth: 2
    }, K7.createElement(T, {
        dimColor: !0
    }, EV)), K[8] = Z;
    else Z = K[8];
    let G = H && `${A} for ${X}`,
        f = $ && ` · ${$} still running`,
        v;
    if (K[9] !== W || K[10] !== G || K[11] !== f) v = K7.createElement(T, {
        dimColor: !0
    }, G, W, f), K[9] = W, K[10] = G, K[11] = f, K[12] = v;
    else v = K[12];
    let V;
    if (K[13] !== Y || K[14] !== D || K[15] !== v) V = K7.createElement(u, {
        flexDirection: "row",
        marginTop: D,
        backgroundColor: Y,
        width: "100%"
    }, Z, v), K[13] = Y, K[14] = D, K[15] = v, K[16] = V;
    else V = K[16];
    return V
}
// @from(Ln 355125, Col 0)
function qKY() {
    return LJ(nh6) ?? "Worked"
}
// @from(Ln 355129, Col 0)
function _KY(q) {
    let K = s(22),
        {
            message: _,
            addMargin: z,
            verbose: Y
        } = q,
        A = If(),
        {
            writtenPaths: O
        } = _,
        w;
    if (K[0] !== _) w = i4Y.teamMemSavedPart(_), K[0] = _, K[1] = w;
    else w = K[1];
    let $ = w,
        j = O.length - ($?.count ?? 0),
        H = j > 0 ? `${j} ${j===1?"memory":"memories"}` : null,
        J = $?.segment,
        X;
    if (K[2] !== H || K[3] !== J) X = [H, J].filter(Boolean), K[2] = H, K[3] = J, K[4] = X;
    else X = K[4];
    let M = X,
        P;
    if (K[5] !== Y || K[6] !== O) P = Y ? O : O.slice(0, KKY), K[5] = Y, K[6] = O, K[7] = P;
    else P = K[7];
    let W = P,
        D = O.length - W.length,
        Z = z ? 1 : 0,
        G;
    if (K[8] === Symbol.for("react.memo_cache_sentinel")) G = K7.createElement(u, {
        minWidth: 2
    }, K7.createElement(T, {
        dimColor: !0
    }, $9)), K[8] = G;
    else G = K[8];
    let f = _.verb ?? "Saved",
        v = M.join(" · "),
        V;
    if (K[9] !== f || K[10] !== v) V = K7.createElement(u, {
        flexDirection: "row"
    }, G, K7.createElement(T, null, f, " ", v)), K[9] = f, K[10] = v, K[11] = V;
    else V = K[11];
    let k;
    if (K[12] !== W) k = W.map(zKY), K[12] = W, K[13] = k;
    else k = K[13];
    let N;
    if (K[14] !== D) N = D > 0 && K7.createElement(_1, null, K7.createElement(T, {
        dimColor: !0
    }, "+", D, " more ", K7.createElement(U2, null))), K[14] = D, K[15] = N;
    else N = K[15];
    let R;
    if (K[16] !== A || K[17] !== V || K[18] !== k || K[19] !== N || K[20] !== Z) R = K7.createElement(u, {
        flexDirection: "column",
        marginTop: Z,
        backgroundColor: A
    }, V, k, N), K[16] = A, K[17] = V, K[18] = k, K[19] = N, K[20] = Z, K[21] = R;
    else R = K[21];
    return R
}
// @from(Ln 355189, Col 0)
function zKY(q) {
    return K7.createElement(YKY, {
        key: q,
        path: q
    })
}
// @from(Ln 355196, Col 0)
function YKY(q) {
    let K = s(16),
        {
            path: _
        } = q,
        [z, Y] = _U8.useState(!1),
        A;
    if (K[0] !== _) A = () => void lS6(_), K[0] = _, K[1] = A;
    else A = K[1];
    let O, w;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) O = () => Y(!0), w = () => Y(!1), K[2] = O, K[3] = w;
    else O = K[2], w = K[3];
    let $ = !z,
        j;
    if (K[4] !== _) j = n4Y(_), K[4] = _, K[5] = j;
    else j = K[5];
    let H;
    if (K[6] !== _ || K[7] !== j) H = K7.createElement(YG, {
        filePath: _
    }, j), K[6] = _, K[7] = j, K[8] = H;
    else H = K[8];
    let J;
    if (K[9] !== z || K[10] !== $ || K[11] !== H) J = K7.createElement(T, {
        dimColor: $,
        underline: z
    }, H), K[9] = z, K[10] = $, K[11] = H, K[12] = J;
    else J = K[12];
    let X;
    if (K[13] !== A || K[14] !== J) X = K7.createElement(_1, null, K7.createElement(u, {
        onClick: A,
        onMouseEnter: O,
        onMouseLeave: w
    }, J)), K[13] = A, K[14] = J, K[15] = X;
    else X = K[15];
    return X
}
// @from(Ln 355233, Col 0)
function AKY(q) {
    let K = s(12),
        {
            message: _,
            addMargin: z
        } = q,
        Y = If(),
        A = z ? 1 : 0,
        O;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) O = K7.createElement(u, {
        minWidth: 2
    }), K[0] = O;
    else O = K[0];
    let w;
    if (K[1] !== _.url) w = K7.createElement(T, null, "/remote-control is active", K7.createElement(T, {
        dimColor: !0
    }, " · Code in CLI or at ", K7.createElement(yq, {
        url: _.url
    }, _.url))), K[1] = _.url, K[2] = w;
    else w = K[2];
    let $;
    if (K[3] !== _.upgradeNudge) $ = _.upgradeNudge && K7.createElement(u, {
        flexDirection: "row"
    }, K7.createElement(T, {
        dimColor: !0
    }, "⎿  "), K7.createElement(T, {
        dimColor: !0
    }, _.upgradeNudge)), K[3] = _.upgradeNudge, K[4] = $;
    else $ = K[4];
    let j;
    if (K[5] !== w || K[6] !== $) j = K7.createElement(u, {
        flexDirection: "column"
    }, w, $), K[5] = w, K[6] = $, K[7] = j;
    else j = K[7];
    let H;
    if (K[8] !== Y || K[9] !== A || K[10] !== j) H = K7.createElement(u, {
        flexDirection: "row",
        marginTop: A,
        backgroundColor: Y,
        width: 999
    }, O, j), K[8] = Y, K[9] = A, K[10] = j, K[11] = H;
    else H = K[11];
    return H
}
// @from(Ln 355277, Col 4)
K7
// @from(Ln 355277, Col 8)
_U8
// @from(Ln 355277, Col 13)
i4Y
// @from(Ln 355277, Col 18)
KKY = 3
// @from(Ln 355278, Col 4)
KHK = L(() => {
    o6();
    g6();
    uc();
    A3();
    Qq();
    GK();
    S96();
    Nj();
    FI8();
    I4();
    sjK();
    c7();
    h1();
    kk();
    N7();
    KU8();
    wy();
    K7 = K6(P6(), 1), _U8 = K6(P6(), 1), i4Y = B7(ejK)
})
// @from(Ln 355299, Col 0)
function _HK() {
    let q = s(1),
        K;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) K = uK8.createElement(_1, {
        height: 1
    }, uK8.createElement(gl, null)), q[0] = K;
    else K = q[0];
    return K
}
// @from(Ln 355308, Col 4)
uK8
// @from(Ln 355309, Col 4)
zHK = L(() => {
    o6();
    cC6();
    GK();
    uK8 = K6(P6(), 1)
})
// @from(Ln 355316, Col 0)
function zU8(q) {
    let K = s(3),
        {
            plan: _
        } = q,
        z;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) z = pF.createElement(T, {
        color: "subtle"
    }, "User rejected Claude's plan:"), K[0] = z;
    else z = K[0];
    let Y;
    if (K[1] !== _) Y = pF.createElement(_1, null, pF.createElement(u, {
        flexDirection: "column"
    }, z, pF.createElement(u, {
        borderStyle: "round",
        borderColor: "planMode",
        paddingX: 1,
        overflow: "hidden"
    }, pF.createElement(xw, null, _)))), K[1] = _, K[2] = Y;
    else Y = K[2];
    return Y
}
// @from(Ln 355338, Col 4)
pF
// @from(Ln 355339, Col 4)
kq7 = L(() => {
    o6();
    ry();
    GK();
    g6();
    pF = K6(P6(), 1)
})
// @from(Ln 355347, Col 0)
function YHK() {
    let q = s(1),
        K;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) K = mK8.createElement(_1, {
        height: 1
    }, mK8.createElement(T, {
        dimColor: !0
    }, "Tool use rejected")), q[0] = K;
    else K = q[0];
    return K
}
// @from(Ln 355358, Col 4)
mK8
// @from(Ln 355359, Col 4)
AHK = L(() => {
    o6();
    g6();
    GK();
    mK8 = K6(P6(), 1)
})
// @from(Ln 355366, Col 0)
function OHK(q) {
    let K = s(14),
        {
            progressMessagesForMessage: _,
            tool: z,
            tools: Y,
            param: A,
            verbose: O,
            isTranscriptMode: w
        } = q;
    if (typeof A.content === "string" && A.content.includes(of)) {
        let j;
        if (K[0] === Symbol.for("react.memo_cache_sentinel")) j = KN.createElement(_1, {
            height: 1
        }, KN.createElement(gl, null)), K[0] = j;
        else j = K[0];
        return j
    }
    if (typeof A.content === "string" && A.content.startsWith(Nq7)) {
        let j;
        if (K[1] !== A.content) j = A.content.substring(Nq7.length), K[1] = A.content, K[2] = j;
        else j = K[2];
        let H = j,
            J;
        if (K[3] !== H) J = KN.createElement(zU8, {
            plan: H
        }), K[3] = H, K[4] = J;
        else J = K[4];
        return J
    }
    if (typeof A.content === "string" && A.content.startsWith(YU8)) {
        let j;
        if (K[5] === Symbol.for("react.memo_cache_sentinel")) j = KN.createElement(YHK, null), K[5] = j;
        else j = K[5];
        return j
    }
    if (typeof A.content === "string" && $HK(A.content)) {
        let j;
        if (K[6] === Symbol.for("react.memo_cache_sentinel")) j = KN.createElement(_1, {
            height: 1
        }, KN.createElement(T, {
            dimColor: !0
        }, "Denied by auto mode classifier ", iF7, " /feedback if incorrect")), K[6] = j;
        else j = K[6];
        return j
    }
    let $;
    if (K[7] !== w || K[8] !== A.content || K[9] !== _ || K[10] !== z || K[11] !== Y || K[12] !== O) $ = z?.renderToolUseErrorMessage?.(A.content, {
        progressMessagesForMessage: W46(_),
        tools: Y,
        verbose: O,
        isTranscriptMode: w
    }) ?? KN.createElement(d$, {
        result: A.content,
        verbose: O
    }), K[7] = w, K[8] = A.content, K[9] = _, K[10] = z, K[11] = Y, K[12] = O, K[13] = $;
    else $ = K[13];
    return $
}
// @from(Ln 355425, Col 4)
KN
// @from(Ln 355426, Col 4)
wHK = L(() => {
    o6();
    A3();
    g6();
    gq();
    _7();
    ny();
    cC6();
    GK();
    kq7();
    AHK();
    KN = K6(P6(), 1)
})
// @from(Ln 355440, Col 0)
function jHK(q) {
    let K = s(13),
        {
            input: _,
            progressMessagesForMessage: z,
            style: Y,
            tool: A,
            tools: O,
            verbose: w,
            isTranscriptMode: $
        } = q,
        {
            columns: j
        } = s1(),
        [H] = Zq();
    if (!A || !A.renderToolUseRejectedMessage) {
        let P;
        if (K[0] === Symbol.for("react.memo_cache_sentinel")) P = KM6.createElement(Ul, null), K[0] = P;
        else P = K[0];
        return P
    }
    let J = A.inputSchema,
        X, M;
    if (K[1] !== j || K[2] !== _ || K[3] !== $ || K[4] !== z || K[5] !== Y || K[6] !== H || K[7] !== A || K[8] !== O || K[9] !== w) {
        M = Symbol.for("react.early_return_sentinel");
        q: {
            let P = J.safeParse(_);
            if (!P.success) {
                let W;
                if (K[12] === Symbol.for("react.memo_cache_sentinel")) W = KM6.createElement(Ul, null), K[12] = W;
                else W = K[12];
                M = W;
                break q
            }
            X = A.renderToolUseRejectedMessage(P.data, {
                columns: j,
                messages: [],
                tools: O,
                verbose: w,
                progressMessagesForMessage: W46(z),
                style: Y,
                theme: H,
                isTranscriptMode: $
            }) ?? KM6.createElement(Ul, null)
        }
        K[1] = j, K[2] = _, K[3] = $, K[4] = z, K[5] = Y, K[6] = H, K[7] = A, K[8] = O, K[9] = w, K[10] = X, K[11] = M
    } else X = K[10], M = K[11];
    if (M !== Symbol.for("react.early_return_sentinel")) return M;
    return X
}
// @from(Ln 355490, Col 4)
KM6
// @from(Ln 355491, Col 4)
HHK = L(() => {
    o6();
    I4();
    g6();
    gq();
    GK8();
    KM6 = K6(P6(), 1)
})
// @from(Ln 355500, Col 0)
function JHK({
    message: q,
    lookups: K,
    toolUseID: _,
    progressMessagesForMessage: z,
    style: Y,
    tool: A,
    tools: O,
    verbose: w,
    width: $,
    isTranscriptMode: j
}) {
    let [H] = Zq(), J = M8((f) => f.isBriefOnly), X = H9(), [M] = aD.useState(() => uI4(X.getState(), _)), [P] = aD.useState(() => BI4(X.getState(), _));
    if (aD.useEffect(() => {
            FI4(qF(X.setState), _)
        }, [X, _]), !q.toolUseResult || !A) return null;
    if (A.isTransparentWrapper?.()) return null;
    let W = A.outputSchema?.safeParse(q.toolUseResult);
    if (W && !W.success) return null;
    let D = W?.data ?? q.toolUseResult,
        Z = A.renderToolResultMessage?.(D, W46(z), {
            style: Y,
            theme: H,
            tools: O,
            verbose: w,
            isTranscriptMode: j,
            isBriefOnly: J,
            input: K.toolUseByToolUseID.get(_)?.input
        }) ?? null;
    if (Z === null) return null;
    let G = A.userFacingName(void 0) === "";
    return aD.createElement(u, {
        flexDirection: "column"
    }, aD.createElement(u, {
        flexDirection: "column",
        width: G ? void 0 : $
    }, Z, null, P && aD.createElement(_1, {
        height: 1
    }, aD.createElement(T, {
        dimColor: !0
    }, "Allowed by auto mode classifier"))), aD.createElement(oX6, null, aD.createElement(ng8, {
        hookEvent: "PostToolUse",
        lookups: K,
        toolUseID: _,
        verbose: w,
        isTranscriptMode: j
    })))
}
// @from(Ln 355548, Col 4)
aD
// @from(Ln 355549, Col 4)
XHK = L(() => {
    lg8();
    g6();
    N7();
    gq();
    GK();
    Yq7();
    aD = K6(P6(), 1)
})
// @from(Ln 355559, Col 0)
function MHK(q, K, _) {
    let z = s(7),
        Y;
    if (z[0] !== _.toolUseByToolUseID || z[1] !== q || z[2] !== K) {
        q: {
            let A = _.toolUseByToolUseID.get(q);
            if (!A) {
                Y = null;
                break q
            }
            let O = rK(K, A.name);
            if (!O) {
                Y = null;
                break q
            }
            let w;
            if (z[4] !== O || z[5] !== A) w = {
                tool: O,
                toolUse: A
            },
            z[4] = O,
            z[5] = A,
            z[6] = w;
            else w = z[6];Y = w
        }
        z[0] = _.toolUseByToolUseID,
        z[1] = q,
        z[2] = K,
        z[3] = Y
    }
    else Y = z[3];
    return Y
}
// @from(Ln 355592, Col 4)
PHK = L(() => {
    o6();
    gq()
})
// @from(Ln 355597, Col 0)
function DHK(q) {
    let K = s(47),
        {
            param: _,
            message: z,
            lookups: Y,
            progressMessagesForMessage: A,
            style: O,
            tools: w,
            verbose: $,
            width: j,
            isTranscriptMode: H
        } = q,
        J = MHK(_.tool_use_id, w, Y),
        X = ug8(),
        M = xg8(),
        P = AU8.useContext(dl),
        W;
    if (K[0] !== Y.assistantUuidByToolUseID || K[1] !== _.tool_use_id) W = Y.assistantUuidByToolUseID.get(_.tool_use_id), K[0] = Y.assistantUuidByToolUseID, K[1] = _.tool_use_id, K[2] = W;
    else W = K[2];
    let D = W,
        Z = y96(D),
        [G, f] = AU8.useState(!1);
    if (!J) return null;
    let v;
    if (typeof _.content === "string" && _.content.startsWith(_M6)) {
        let C;
        if (K[3] === Symbol.for("react.memo_cache_sentinel")) C = FF.createElement(_HK, null), K[3] = C;
        else C = K[3];
        v = C
    } else if (typeof _.content === "string" && _.content.startsWith(zM6) || _.content === of) {
        let C = J.toolUse.input,
            x;
        if (K[4] !== H || K[5] !== Y || K[6] !== A || K[7] !== O || K[8] !== C || K[9] !== J.tool || K[10] !== w || K[11] !== $) x = FF.createElement(jHK, {
            input: C,
            progressMessagesForMessage: A,
            tool: J.tool,
            tools: w,
            lookups: Y,
            style: O,
            verbose: $,
            isTranscriptMode: H
        }), K[4] = H, K[5] = Y, K[6] = A, K[7] = O, K[8] = C, K[9] = J.tool, K[10] = w, K[11] = $, K[12] = x;
        else x = K[12];
        v = x
    } else if (_.is_error) {
        let C;
        if (K[13] !== H || K[14] !== _ || K[15] !== A || K[16] !== J.tool || K[17] !== w || K[18] !== $) C = FF.createElement(OHK, {
            progressMessagesForMessage: A,
            tool: J.tool,
            tools: w,
            param: _,
            verbose: $,
            isTranscriptMode: H
        }), K[13] = H, K[14] = _, K[15] = A, K[16] = J.tool, K[17] = w, K[18] = $, K[19] = C;
        else C = K[19];
        v = C
    } else {
        let C;
        if (K[20] !== H || K[21] !== Y || K[22] !== z || K[23] !== A || K[24] !== O || K[25] !== J.tool || K[26] !== J.toolUse.id || K[27] !== w || K[28] !== $ || K[29] !== j) C = FF.createElement(JHK, {
            message: z,
            lookups: Y,
            toolUseID: J.toolUse.id,
            progressMessagesForMessage: A,
            style: O,
            tool: J.tool,
            tools: w,
            verbose: $,
            width: j,
            isTranscriptMode: H
        }), K[20] = H, K[21] = Y, K[22] = z, K[23] = A, K[24] = O, K[25] = J.tool, K[26] = J.toolUse.id, K[27] = w, K[28] = $, K[29] = j, K[30] = C;
        else C = K[30];
        v = C
    }
    let V = M === _.tool_use_id,
        k;
    if (K[31] !== _.tool_use_id || K[32] !== X) k = void 0, K[31] = _.tool_use_id, K[32] = X, K[33] = k;
    else k = K[33];
    let N;
    if (K[34] !== X) N = void 0, K[34] = X, K[35] = N;
    else N = K[35];
    let R;
    if (K[36] !== G || K[37] !== D || K[38] !== V || K[39] !== P || K[40] !== Z) R = null, K[36] = G, K[37] = D, K[38] = V, K[39] = P, K[40] = Z, K[41] = R;
    else R = K[41];
    let h;
    if (K[42] !== v || K[43] !== k || K[44] !== N || K[45] !== R) h = FF.createElement(u, {
        flexDirection: "column",
        onMouseEnter: k,
        onMouseLeave: N
    }, v, R), K[42] = v, K[43] = k, K[44] = N, K[45] = R, K[46] = h;
    else h = K[46];
    return h
}
// @from(Ln 355690, Col 4)
FF
// @from(Ln 355690, Col 8)
AU8
// @from(Ln 355691, Col 4)
ZHK = L(() => {
    o6();
    A3();
    g6();
    nO();
    _7();
    iC6();
    zHK();
    wHK();
    HHK();
    XHK();
    PHK();
    FF = K6(P6(), 1), AU8 = K6(P6(), 1)
})
// @from(Ln 355706, Col 0)
function OKY(q) {
    let K = s(95),
        {
            message: _,
            lookups: z,
            containerWidth: Y,
            addMargin: A,
            tools: O,
            commands: w,
            verbose: $,
            inProgressToolUseIDs: j,
            progressMessagesForMessage: H,
            shouldAnimate: J,
            shouldShowDot: X,
            style: M,
            width: P,
            isTranscriptMode: W,
            onOpenRateLimitOptions: D,
            isActiveCollapsedGroup: Z,
            isUserContinuation: G,
            lastThinkingBlockId: f,
            latestBashOutputUUID: v
        } = q,
        V = G === void 0 ? !1 : G;
    switch (_.type) {
        case "attachment": {
            let k;
            if (K[0] !== A || K[1] !== W || K[2] !== _.attachment || K[3] !== _.uuid || K[4] !== $) k = N9.createElement(xjK, {
                addMargin: A,
                attachment: _.attachment,
                verbose: $,
                isTranscriptMode: W,
                messageUuid: _.uuid
            }), K[0] = A, K[1] = W, K[2] = _.attachment, K[3] = _.uuid, K[4] = $, K[5] = k;
            else k = K[5];
            return k
        }
        case "assistant": {
            let k = Y ?? "100%",
                N;
            if (K[6] !== A || K[7] !== w || K[8] !== j || K[9] !== W || K[10] !== f || K[11] !== z || K[12] !== _.advisorModel || K[13] !== _.message.content || K[14] !== _.uuid || K[15] !== D || K[16] !== H || K[17] !== J || K[18] !== X || K[19] !== O || K[20] !== $ || K[21] !== P) {
                let h;
                if (K[23] !== A || K[24] !== w || K[25] !== j || K[26] !== W || K[27] !== f || K[28] !== z || K[29] !== _.advisorModel || K[30] !== _.uuid || K[31] !== D || K[32] !== H || K[33] !== J || K[34] !== X || K[35] !== O || K[36] !== $ || K[37] !== P) h = (C, x) => N9.createElement($KY, {
                    key: x,
                    param: C,
                    addMargin: A,
                    tools: O,
                    commands: w,
                    verbose: $,
                    inProgressToolUseIDs: j,
                    progressMessagesForMessage: H,
                    shouldAnimate: J,
                    shouldShowDot: X,
                    width: P,
                    inProgressToolCallCount: j.size,
                    isTranscriptMode: W,
                    lookups: z,
                    onOpenRateLimitOptions: D,
                    thinkingBlockId: `${_.uuid}:${x}`,
                    lastThinkingBlockId: f,
                    advisorModel: _.advisorModel,
                    messageUuid: _.uuid
                }), K[23] = A, K[24] = w, K[25] = j, K[26] = W, K[27] = f, K[28] = z, K[29] = _.advisorModel, K[30] = _.uuid, K[31] = D, K[32] = H, K[33] = J, K[34] = X, K[35] = O, K[36] = $, K[37] = P, K[38] = h;
                else h = K[38];
                N = _.message.content.map(h), K[6] = A, K[7] = w, K[8] = j, K[9] = W, K[10] = f, K[11] = z, K[12] = _.advisorModel, K[13] = _.message.content, K[14] = _.uuid, K[15] = D, K[16] = H, K[17] = J, K[18] = X, K[19] = O, K[20] = $, K[21] = P, K[22] = N
            } else N = K[22];
            let R;
            if (K[39] !== k || K[40] !== N) R = N9.createElement(u, {
                flexDirection: "column",
                width: k
            }, N), K[39] = k, K[40] = N, K[41] = R;
            else R = K[41];
            return R
        }
        case "user": {
            if (_.isCompactSummary) {
                let m = W ? "transcript" : "prompt",
                    S;
                if (K[42] !== _ || K[43] !== m) S = N9.createElement(q$K, {
                    message: _,
                    screen: m
                }), K[42] = _, K[43] = m, K[44] = S;
                else S = K[44];
                return S
            }
            let k;
            if (K[45] !== _.imagePasteIds || K[46] !== _.message.content) {
                k = [];
                let m = 0;
                for (let S of _.message.content)
                    if (S.type === "image") {
                        let F = _.imagePasteIds?.[m];
                        m++, k.push(F ?? m)
                    } else k.push(m);
                K[45] = _.imagePasteIds, K[46] = _.message.content, K[47] = k
            } else k = K[47];
            let N = v === _.uuid,
                R = Y ?? "100%",
                h;
            if (K[48] !== A || K[49] !== k || K[50] !== W || K[51] !== V || K[52] !== z || K[53] !== _ || K[54] !== H || K[55] !== M || K[56] !== O || K[57] !== $) h = _.message.content.map((m, S) => N9.createElement(wKY, {
                key: S,
                message: _,
                addMargin: A,
                tools: O,
                progressMessagesForMessage: H,
                param: m,
                style: M,
                verbose: $,
                imageIndex: k[S],
                isUserContinuation: V,
                lookups: z,
                isTranscriptMode: W
            })), K[48] = A, K[49] = k, K[50] = W, K[51] = V, K[52] = z, K[53] = _, K[54] = H, K[55] = M, K[56] = O, K[57] = $, K[58] = h;
            else h = K[58];
            let C;
            if (K[59] !== R || K[60] !== h) C = N9.createElement(u, {
                flexDirection: "column",
                width: R
            }, h), K[59] = R, K[60] = h, K[61] = C;
            else C = K[61];
            let x = C,
                B;
            if (K[62] !== x || K[63] !== N) B = N ? N9.createElement(A04, null, x) : x, K[62] = x, K[63] = N, K[64] = B;
            else B = K[64];
            return B
        }
        case "system": {
            if (_.subtype === "compact_boundary") {
                if (lq()) return null;
                let N;
                if (K[65] === Symbol.for("react.memo_cache_sentinel")) N = N9.createElement(cjK, null), K[65] = N;
                else N = K[65];
                return N
            }
            if (_.subtype === "microcompact_boundary") return null;
            if (_.subtype === "local_command") {
                let N;
                if (K[69] !== _.content) N = {
                    type: "text",
                    text: _.content
                }, K[69] = _.content, K[70] = N;
                else N = K[70];
                let R;
                if (K[71] !== A || K[72] !== W || K[73] !== N || K[74] !== $) R = N9.createElement(qM6, {
                    addMargin: A,
                    param: N,
                    verbose: $,
                    isTranscriptMode: W
                }), K[71] = A, K[72] = W, K[73] = N, K[74] = $, K[75] = R;
                else R = K[75];
                return R
            }
            let k;
            if (K[76] !== A || K[77] !== W || K[78] !== _ || K[79] !== $) k = N9.createElement(qHK, {
                message: _,
                addMargin: A,
                verbose: $,
                isTranscriptMode: W
            }), K[76] = A, K[77] = W, K[78] = _, K[79] = $, K[80] = k;
            else k = K[80];
            return k
        }
        case "grouped_tool_use": {
            let k;
            if (K[81] !== j || K[82] !== z || K[83] !== _ || K[84] !== J || K[85] !== O) k = N9.createElement(njK, {
                message: _,
                tools: O,
                lookups: z,
                inProgressToolUseIDs: j,
                shouldAnimate: J
            }), K[81] = j, K[82] = z, K[83] = _, K[84] = J, K[85] = O, K[86] = k;
            else k = K[86];
            return k
        }
        case "collapsed_read_search": {
            let k = $ || W,
                N;
            if (K[87] !== j || K[88] !== Z || K[89] !== z || K[90] !== _ || K[91] !== J || K[92] !== k || K[93] !== O) N = N9.createElement(zG, null, N9.createElement(QjK, {
                message: _,
                inProgressToolUseIDs: j,
                shouldAnimate: J,
                verbose: k,
                tools: O,
                lookups: z,
                isActiveGroup: Z
            })), K[87] = j, K[88] = Z, K[89] = z, K[90] = _, K[91] = J, K[92] = k, K[93] = O, K[94] = N;
            else N = K[94];
            return N
        }
    }
}
// @from(Ln 355898, Col 0)
function wKY(q) {
    let K = s(20),
        {
            message: _,
            addMargin: z,
            tools: Y,
            progressMessagesForMessage: A,
            param: O,
            style: w,
            verbose: $,
            imageIndex: j,
            isUserContinuation: H,
            lookups: J,
            isTranscriptMode: X
        } = q,
        {
            columns: M
        } = s1();
    switch (O.type) {
        case "text": {
            let P;
            if (K[0] !== z || K[1] !== X || K[2] !== _.planContent || K[3] !== _.timestamp || K[4] !== O || K[5] !== $) P = N9.createElement(qM6, {
                addMargin: z,
                param: O,
                verbose: $,
                planContent: _.planContent,
                isTranscriptMode: X,
                timestamp: _.timestamp
            }), K[0] = z, K[1] = X, K[2] = _.planContent, K[3] = _.timestamp, K[4] = O, K[5] = $, K[6] = P;
            else P = K[6];
            return P
        }
        case "image": {
            let P = z && !H,
                W;
            if (K[7] !== j || K[8] !== P) W = N9.createElement(og8, {
                imageId: j,
                addMargin: P
            }), K[7] = j, K[8] = P, K[9] = W;
            else W = K[9];
            return W
        }
        case "tool_result": {
            let P = M - 5,
                W;
            if (K[10] !== X || K[11] !== J || K[12] !== _ || K[13] !== O || K[14] !== A || K[15] !== w || K[16] !== P || K[17] !== Y || K[18] !== $) W = N9.createElement(DHK, {
                param: O,
                message: _,
                lookups: J,
                progressMessagesForMessage: A,
                style: w,
                tools: Y,
                verbose: $,
                width: P,
                isTranscriptMode: X
            }), K[10] = X, K[11] = J, K[12] = _, K[13] = O, K[14] = A, K[15] = w, K[16] = P, K[17] = Y, K[18] = $, K[19] = W;
            else W = K[19];
            return W
        }
        default:
            return
    }
}
// @from(Ln 355962, Col 0)
function $KY(q) {
    let K = s(48),
        {
            param: _,
            addMargin: z,
            tools: Y,
            commands: A,
            verbose: O,
            inProgressToolUseIDs: w,
            progressMessagesForMessage: $,
            shouldAnimate: j,
            shouldShowDot: H,
            width: J,
            inProgressToolCallCount: X,
            isTranscriptMode: M,
            lookups: P,
            onOpenRateLimitOptions: W,
            thinkingBlockId: D,
            lastThinkingBlockId: Z,
            advisorModel: G,
            messageUuid: f
        } = q;
    switch (_.type) {
        case "tool_use": {
            let v;
            if (K[10] !== z || K[11] !== A || K[12] !== X || K[13] !== w || K[14] !== M || K[15] !== P || K[16] !== f || K[17] !== _ || K[18] !== $ || K[19] !== j || K[20] !== H || K[21] !== Y || K[22] !== O) v = N9.createElement(d$K, {
                param: _,
                addMargin: z,
                tools: Y,
                commands: A,
                verbose: O,
                inProgressToolUseIDs: w,
                progressMessagesForMessage: $,
                shouldAnimate: j,
                shouldShowDot: H,
                inProgressToolCallCount: X,
                lookups: P,
                isTranscriptMode: M,
                messageUuid: f
            }), K[10] = z, K[11] = A, K[12] = X, K[13] = w, K[14] = M, K[15] = P, K[16] = f, K[17] = _, K[18] = $, K[19] = j, K[20] = H, K[21] = Y, K[22] = O, K[23] = v;
            else v = K[23];
            return v
        }
        case "text": {
            let v;
            if (K[24] !== z || K[25] !== f || K[26] !== W || K[27] !== _ || K[28] !== H || K[29] !== O || K[30] !== J) v = N9.createElement(m$K, {
                param: _,
                addMargin: z,
                shouldShowDot: H,
                verbose: O,
                width: J,
                onOpenRateLimitOptions: W,
                messageUuid: f
            }), K[24] = z, K[25] = f, K[26] = W, K[27] = _, K[28] = H, K[29] = O, K[30] = J, K[31] = v;
            else v = K[31];
            return v
        }
        case "redacted_thinking": {
            if (!M && !O) return null;
            let v;
            if (K[32] !== z) v = N9.createElement(O$K, {
                addMargin: z
            }), K[32] = z, K[33] = v;
            else v = K[33];
            return v
        }
        case "thinking": {
            if (!M && !O) return null;
            let V = M && !(!Z || D === Z),
                k;
            if (K[34] !== z || K[35] !== M || K[36] !== _ || K[37] !== V || K[38] !== O) k = N9.createElement(cg8, {
                addMargin: z,
                param: _,
                isTranscriptMode: M,
                verbose: O,
                hideInTranscript: V
            }), K[34] = z, K[35] = M, K[36] = _, K[37] = V, K[38] = O, K[39] = k;
            else k = K[39];
            return k
        }
        case "server_tool_use":
        case "advisor_tool_result": {
            if (cH6(_)) {
                let v = O || M,
                    V;
                if (K[40] !== z || K[41] !== G || K[42] !== P.erroredToolUseIDs || K[43] !== P.resolvedToolUseIDs || K[44] !== _ || K[45] !== j || K[46] !== v) V = N9.createElement(Y$K, {
                    block: _,
                    addMargin: z,
                    resolvedToolUseIDs: P.resolvedToolUseIDs,
                    erroredToolUseIDs: P.erroredToolUseIDs,
                    shouldAnimate: j,
                    verbose: v,
                    advisorModel: G
                }), K[40] = z, K[41] = G, K[42] = P.erroredToolUseIDs, K[43] = P.resolvedToolUseIDs, K[44] = _, K[45] = j, K[46] = v, K[47] = V;
                else V = K[47];
                return V
            }
            return j6(Error(`Unable to render server tool block: ${_.type}`)), null
        }
        default:
            return j6(Error(`Unable to render message type: ${_.type}`)), null
    }
}
// @from(Ln 356066, Col 0)
function yq7(q) {
    if (q.type !== "assistant" || !q.message) return !1;
    return q.message.content.some((K) => K.type === "thinking" || K.type === "redacted_thinking")
}
// @from(Ln 356071, Col 0)
function jKY(q, K) {
    if (q.message.uuid !== K.message.uuid) return !1;
    if (q.lastThinkingBlockId !== K.lastThinkingBlockId && yq7(K.message)) return !1;
    if (q.verbose !== K.verbose) return !1;
    let _ = q.latestBashOutputUUID === q.message.uuid,
        z = K.latestBashOutputUUID === K.message.uuid;
    if (_ !== z) return !1;
    if (q.isTranscriptMode !== K.isTranscriptMode) return !1;
    if (q.containerWidth !== K.containerWidth) return !1;
    if (q.isStatic && K.isStatic) return !0;
    return !1
}
// @from(Ln 356083, Col 4)
N9
// @from(Ln 356083, Col 8)
Ku
// @from(Ln 356084, Col 4)
_b6 = L(() => {
    o6();
    I4();
    g6();
    is();
    nO();
    U8();
    K$K();
    A$K();
    w$K();
    B$K();
    zq7();
    c$K();
    mjK();
    djK();
    ljK();
    ijK();
    KHK();
    Jq7();
    eg8();
    ZHK();
    f96();
    JU1();
    N9 = K6(P6(), 1);
    Ku = N9.memo(OKY, jKY)
})
// @from(Ln 356111, Col 0)
function VT(q) {
    if (!("message" in q)) return !1;
    let K = q.message;
    return K != null && typeof K === "object" && "type" in K
}
// @from(Ln 356117, Col 0)
function VHK(q, K, _) {
    if (!VT(q.data)) return null;
    let z = q.data.message;
    if (z.type === "assistant") return pK8(z.message.content[0], K);
    if (z.type === "user") {
        let Y = z.message.content[0];
        if (Y?.type === "tool_result") {
            let A = _.get(Y.tool_use_id);
            if (A) return pK8(A, K)
        }
    }
    return null
}
// @from(Ln 356131, Col 0)
function HKY(q, K, _) {
    return q.filter(($) => VT($.data) && $.data.message.type !== "user").map(($) => ({
        type: "original",
        message: $
    }));

    function A($) {
        if (Y && (Y.searchCount > 0 || Y.readCount > 0 || Y.replCount > 0)) z.push({
            type: "summary",
            searchCount: Y.searchCount,
            readCount: Y.readCount,
            replCount: Y.replCount,
            uuid: `summary-${Y.startUuid}`,
            isActive: $
        });
        Y = null
    }
}
// @from(Ln 356150, Col 0)
function BK8(q) {
    let K = s(3),
        {
            prompt: _,
            dim: z
        } = q,
        Y;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) Y = x1.createElement(T, {
        color: "success",
        bold: !0
    }, "Prompt:"), K[0] = Y;
    else Y = K[0];
    let A;
    if (K[1] !== _) A = x1.createElement(u, {
        flexDirection: "column"
    }, Y, x1.createElement(u, {
        paddingLeft: 2
    }, x1.createElement(xw, null, _))), K[1] = _, K[2] = A;
    else A = K[2];
    return A
}
// @from(Ln 356172, Col 0)
function Lq7(q) {
    let K = s(5),
        {
            content: _
        } = q,
        z;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) z = x1.createElement(T, {
        color: "success",
        bold: !0
    }, "Response:"), K[0] = z;
    else z = K[0];
    let Y;
    if (K[1] !== _) Y = _.map(MKY), K[1] = _, K[2] = Y;
    else Y = K[2];
    let A;
    if (K[3] !== Y) A = x1.createElement(u, {
        flexDirection: "column"
    }, z, Y), K[3] = Y, K[4] = A;
    else A = K[4];
    return A
}
// @from(Ln 356194, Col 0)
function MKY(q, K) {
    return x1.createElement(u, {
        key: K,
        paddingLeft: 2,
        marginTop: K === 0 ? 0 : 1
    }, x1.createElement(xw, null, q.text))
}
// @from(Ln 356202, Col 0)
function PKY(q) {
    let K = s(15),
        {
            progressMessages: _,
            tools: z,
            verbose: Y
        } = q,
        A;
    if (K[0] !== _) A = gK8(_.filter(ZKY).map(DKY)), K[0] = _, K[1] = A;
    else A = K[1];
    let {
        lookups: O,
        inProgressToolUseIDs: w
    } = A, $;
    if (K[2] !== O || K[3] !== w || K[4] !== _ || K[5] !== z || K[6] !== Y) {
        let H = _.filter(WKY),
            J;
        if (K[8] !== O || K[9] !== w || K[10] !== z || K[11] !== Y) J = (X) => x1.createElement(_1, {
            key: X.uuid,
            height: 1
        }, x1.createElement(Ku, {
            message: X.data.message,
            lookups: O,
            addMargin: !1,
            tools: z,
            commands: [],
            verbose: Y,
            inProgressToolUseIDs: w,
            progressMessagesForMessage: [],
            shouldAnimate: !1,
            shouldShowDot: !1,
            isTranscriptMode: !1,
            isStatic: !0
        })), K[8] = O, K[9] = w, K[10] = z, K[11] = Y, K[12] = J;
        else J = K[12];
        $ = H.map(J), K[2] = O, K[3] = w, K[4] = _, K[5] = z, K[6] = Y, K[7] = $
    } else $ = K[7];
    let j;
    if (K[13] !== $) j = x1.createElement(x1.Fragment, null, $), K[13] = $, K[14] = j;
    else j = K[14];
    return j
}
// @from(Ln 356245, Col 0)
function WKY(q) {
    if (!VT(q.data)) return !1;
    let K = q.data.message;
    if (K.type === "user" && K.toolUseResult === void 0) return !1;
    return !0
}
// @from(Ln 356252, Col 0)
function DKY(q) {
    return q.data
}
// @from(Ln 356256, Col 0)
function ZKY(q) {
    return VT(q.data)
}
// @from(Ln 356260, Col 0)
function kHK(q, K, {
    tools: _,
    verbose: z,
    theme: Y,
    isTranscriptMode: A = !1
}) {
    let O = q;
    if (O.status === "remote_launched") return x1.createElement(u, {
        flexDirection: "column"
    }, x1.createElement(_1, {
        height: 1
    }, x1.createElement(T, null, "Remote agent launched", " ", x1.createElement(T, {
        dimColor: !0
    }, "· ", O.taskId, " · ", O.sessionUrl))));
    if (q.status === "async_launched") {
        let {
            prompt: Z
        } = q;
        return x1.createElement(u, {
            flexDirection: "column"
        }, x1.createElement(_1, {
            height: 1
        }, x1.createElement(T, null, "Backgrounded agent", !A && x1.createElement(T, {
            dimColor: !0
        }, " (", x1.createElement(z1, null, x1.createElement(A8, {
            chord: "down",
            action: "manage"
        }), Z && x1.createElement(v1, {
            action: "app:toggleTranscript",
            context: "Global",
            fallback: "ctrl+o",
            description: "expand"
        })), ")"))), A && Z && x1.createElement(_1, null, x1.createElement(BK8, {
            prompt: Z,
            theme: Y
        })))
    }
    if (q.status !== "completed") return null;
    let {
        agentId: w,
        totalDurationMs: $,
        totalToolUseCount: j,
        totalTokens: H,
        usage: J,
        content: X,
        prompt: M
    } = q, W = `Done (${[j===1?"1 tool use":`${j} tool uses`,iK(H)+" tokens",C5($)].join(" · ")})`, D = yj({
        content: W,
        usage: {
            ...J,
            inference_geo: null,
            iterations: null,
            speed: null
        }
    });
    return x1.createElement(u, {
        flexDirection: "column"
    }, !1, A && M && x1.createElement(_1, null, x1.createElement(BK8, {
        prompt: M,
        theme: Y
    })), A ? x1.createElement(We6, null, x1.createElement(PKY, {
        progressMessages: K,
        tools: _,
        verbose: z
    })) : null, A && X && X.length > 0 && x1.createElement(_1, null, x1.createElement(Lq7, {
        content: X,
        theme: Y
    })), x1.createElement(_1, {
        height: 1
    }, x1.createElement(Ku, {
        message: D,
        lookups: Ke,
        addMargin: !1,
        tools: _,
        commands: [],
        verbose: z,
        inProgressToolUseIDs: new Set,
        progressMessagesForMessage: [],
        shouldAnimate: !1,
        shouldShowDot: !1,
        isTranscriptMode: !1,
        isStatic: !0
    })), !A && x1.createElement(T, {
        dimColor: !0
    }, "  ", x1.createElement(U2, null)))
}
// @from(Ln 356347, Col 0)
function NHK({
    description: q,
    prompt: K
}) {
    if (!q || !K) return null;
    return q
}
// @from(Ln 356355, Col 0)
function EHK(q) {
    let K = [];
    if (q.model) {
        let _ = G5(),
            z = K5(q.model);
        if (z !== _) K.push(x1.createElement(u, {
            key: "model",
            flexWrap: "nowrap",
            marginLeft: 1
        }, x1.createElement(T, {
            dimColor: !0
        }, YJ(z))))
    }
    if (K.length === 0) return null;
    return x1.createElement(x1.Fragment, null, K)
}