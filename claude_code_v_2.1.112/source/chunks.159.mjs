
// @from(Ln 410172, Col 4)
aF = L(() => {
    p7();
    _s();
    BJ8();
    Vy6();
    B1();
    C8();
    q2();
    Nk();
    wc();
    ol();
    gq();
    n7();
    Q8();
    m8();
    eK();
    LU8();
    c7();
    Yq();
    CI();
    U8();
    UI6();
    _7();
    Jk();
    Sq();
    qQ8();
    b9();
    $i1();
    rk8();
    Sz();
    NK6();
    Ph6();
    X58();
    e8();
    HI8();
    Rz();
    UyK();
    MDY = new Set(["/dev/zero", "/dev/random", "/dev/urandom", "/dev/full", "/dev/stdin", "/dev/tty", "/dev/console", "/dev/stdout", "/dev/stderr", "/dev/fd/0", "/dev/fd/1", "/dev/fd/2"]);
    WDY = String.fromCharCode(8239);
    Pc8 = class Pc8 extends Error {
        tokenCount;
        maxTokens;
        constructor(q, K) {
            super(`File content (${q} tokens) exceeds maximum allowed tokens (${K}). Use offset and limit parameters to read specific portions of the file, or search for specific content instead of reading the whole file.`);
            this.tokenCount = q;
            this.maxTokens = K;
            this.name = "MaxFileReadTokenExceededError"
        }
    };
    cyK = new Set(["png", "jpg", "jpeg", "gif", "webp"]);
    fDY = C6(() => y.strictObject({
        file_path: y.string().describe("The absolute path to the file to read"),
        offset: qL(y.number().int().nonnegative().optional()).describe(u8("tengu_slate_reef", !1) ? "The line number to start reading from. Provide with `limit` to read a specific line range, or alone when the file is too large to read at once." : "The line number to start reading from. Only provide if the file is too large to read at once"),
        limit: qL(y.number().int().positive().optional()).describe(u8("tengu_slate_reef", !1) ? "ONLY include with offset to read a specific slice. OMIT to read the whole file (harness truncates oversized files automatically)." : "The number of lines to read. Only provide if the file is too large to read at once."),
        pages: y.string().optional().describe(`Page range for PDF files (e.g., "1-5", "3", "10-20"). Only applicable to PDF files. Maximum ${r$6} pages per request.`)
    })), GDY = C6(() => {
        let q = y.enum(["image/jpeg", "image/png", "image/gif", "image/webp"]);
        return y.discriminatedUnion("type", [y.object({
            type: y.literal("text"),
            file: y.object({
                filePath: y.string().describe("The path to the file that was read"),
                content: y.string().describe("The content of the file"),
                numLines: y.number().describe("Number of lines in the returned content"),
                startLine: y.number().describe("The starting line number"),
                totalLines: y.number().describe("Total number of lines in the file")
            })
        }), y.object({
            type: y.literal("image"),
            file: y.object({
                base64: y.string().describe("Base64-encoded image data"),
                type: q.describe("The MIME type of the image"),
                originalSize: y.number().describe("Original file size in bytes"),
                dimensions: y.object({
                    originalWidth: y.number().optional().describe("Original image width in pixels"),
                    originalHeight: y.number().optional().describe("Original image height in pixels"),
                    displayWidth: y.number().optional().describe("Displayed image width in pixels (after resizing)"),
                    displayHeight: y.number().optional().describe("Displayed image height in pixels (after resizing)")
                }).optional().describe("Image dimension info for coordinate mapping")
            })
        }), y.object({
            type: y.literal("notebook"),
            file: y.object({
                filePath: y.string().describe("The path to the notebook file"),
                cells: y.array(y.any()).describe("Array of notebook cells")
            })
        }), y.object({
            type: y.literal("pdf"),
            file: y.object({
                filePath: y.string().describe("The path to the PDF file"),
                base64: y.string().describe("Base64-encoded PDF data"),
                originalSize: y.number().describe("Original file size in bytes")
            })
        }), y.object({
            type: y.literal("parts"),
            file: y.object({
                filePath: y.string().describe("The path to the PDF file"),
                originalSize: y.number().describe("Original file size in bytes"),
                count: y.number().describe("Number of pages extracted"),
                outputDir: y.string().describe("Directory containing extracted page images")
            })
        }), y.object({
            type: y.literal("file_unchanged"),
            file: y.object({
                filePath: y.string().describe("The path to the file")
            })
        })])
    }), Kz = Iq({
        name: xq,
        searchHint: "read files, images, PDFs, notebooks",
        maxResultSizeChars: 1 / 0,
        strict: !0,
        async description() {
            return O44
        },
        async prompt() {
            let q = as(),
                K = q.includeMaxSizeInPrompt ? `. Files larger than ${o4(q.maxSizeBytes)} will return an error; use offset and limit for larger files` : "",
                _ = q.targetedRangeNudge ? j44 : $44;
            return H44(vDY(), K, _)
        },
        get inputSchema() {
            return fDY()
        },
        get outputSchema() {
            return GDY()
        },
        userFacingName: gyK,
        getToolUseSummary: n_7,
        getActivityDescription(q) {
            let K = n_7(q);
            return K ? `Reading ${K}` : "Reading file"
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        toAutoClassifierInput(q) {
            return q.file_path
        },
        isSearchOrReadCommand() {
            return {
                isSearch: !1,
                isRead: !0
            }
        },
        getPath({
            file_path: q
        }) {
            return q || b8()
        },
        backfillObservableInput(q) {
            if (typeof q.file_path === "string") q.file_path = Wq(q.file_path)
        },
        async preparePermissionMatcher({
            file_path: q
        }) {
            return (K) => Vk(K, q)
        },
        async checkPermissions(q, K) {
            let _ = K.getAppState();
            return l96(Kz, q, _.toolPermissionContext)
        },
        renderToolUseMessage: myK,
        renderToolUseTag: ByK,
        renderToolResultMessage: pyK,
        extractSearchText() {
            return ""
        },
        stripForStorage(q) {
            if (typeof q !== "object" || q === null) return q;
            switch (q.type) {
                case "text":
                    if (q.file.content === "") return q;
                    return {
                        ...q, file: {
                            ...q.file,
                            content: ""
                        }
                    };
                case "image":
                    if (q.file.base64 === "") return q;
                    return {
                        ...q, file: {
                            ...q.file,
                            base64: ""
                        }
                    };
                case "pdf":
                    if (q.file.base64 === "") return q;
                    return {
                        ...q, file: {
                            ...q.file,
                            base64: ""
                        }
                    };
                case "notebook": {
                    let {
                        cells: K
                    } = q.file;
                    if (K.length === 0 || K[0] == null) return q;
                    return {
                        ...q,
                        file: {
                            ...q.file,
                            cells: Array(K.length)
                        }
                    }
                }
                default:
                    return q
            }
        },
        renderToolUseErrorMessage: FyK,
        async validateInput({
            file_path: q,
            pages: K
        }, _) {
            if (K !== void 0) {
                let $ = Lb1(K);
                if (!$) return {
                    result: !1,
                    message: `Invalid pages parameter: "${K}". Use formats like "1-5", "3", or "10-20". Pages are 1-indexed.`,
                    errorCode: 7
                };
                if (($.lastPage === 1 / 0 ? r$6 + 1 : $.lastPage - $.firstPage + 1) > r$6) return {
                    result: !1,
                    message: `Page range "${K}" exceeds maximum of ${r$6} pages per request. Please use a smaller range.`,
                    errorCode: 8
                }
            }
            let z = Wq(q),
                Y = _.getAppState();
            if (ZJ(z, Y.toolPermissionContext, "read", "deny") !== null) return {
                result: !1,
                message: "File is in a directory that is denied by your permission settings.",
                errorCode: 1
            };
            if (z.startsWith("\\\\") || z.startsWith("//")) return {
                result: !0
            };
            let w = OP6.extname(z).toLowerCase();
            if (PQ6(z) && !ek6(w) && !cyK.has(w.slice(1))) return {
                result: !1,
                message: `This tool cannot read binary files. The file appears to be a binary ${w} file. Please use appropriate tools for binary file analysis.`,
                errorCode: 4
            };
            if (PDY(z)) return {
                result: !1,
                message: `Cannot read '${q}': this device file would block or produce infinite output.`,
                errorCode: 9
            };
            return {
                result: !0
            }
        },
        async call({
            file_path: q,
            offset: K = 1,
            limit: _ = void 0,
            pages: z
        }, Y, A, O) {
            let {
                readFileState: w,
                fileReadingLimits: $
            } = Y, j = as(), H = $?.maxSizeBytes ?? j.maxSizeBytes, J = $?.maxTokens ?? j.maxTokens;
            if ($ !== void 0) d("tengu_file_read_limits_override", {
                hasMaxTokens: $.maxTokens !== void 0,
                hasMaxSizeBytes: $.maxSizeBytes !== void 0
            });
            let X = OP6.extname(q).toLowerCase().slice(1),
                M = Wq(q),
                P = w.get(M);
            if (P) d("tengu_file_read_reread", {
                priorOp: P.offset === void 0 ? "edit_write" : "read"
            });
            let D = u8("tengu_read_dedup_killswitch", !1) ? void 0 : w.get(M);
            if (D && !D.isPartialView && D.offset !== void 0) {
                if (D.offset === K && D.limit === _) try {
                    if (await RA6(M) === D.timestamp) {
                        let v = $46(M);
                        return d("tengu_file_read_dedup", {
                            ...v !== void 0 && {
                                ext: v
                            }
                        }), {
                            data: {
                                type: "file_unchanged",
                                file: {
                                    filePath: q
                                }
                            }
                        }
                    }
                } catch {}
            }
            let Z = b8();
            if (!S6(process.env.CLAUDE_CODE_SIMPLE)) {
                let G = await vb6([M], Z);
                if (G.length > 0) {
                    for (let f of G) Y.dynamicSkillDirTriggers?.add(f);
                    Tb6(G).catch(() => {})
                }
                Vb6([M], Z)
            }
            try {
                return await dyK(q, M, M, X, K, _, z, H, J, w, Y, O?.message.id)
            } catch (G) {
                if (Q1(G) === "ENOENT") {
                    let v = DDY(M);
                    if (v) try {
                        return await dyK(q, M, v, X, K, _, z, H, J, w, Y, O?.message.id)
                    } catch (R) {
                        if (!t1(R)) throw R
                    }
                    let V = GJ8(M),
                        k = await C16(M),
                        N = `File does not exist. ${Ov} ${b8()}.`;
                    if (k) N += ` Did you mean ${k}?`;
                    else if (V) N += ` Did you mean ${V}?`;
                    throw Error(N)
                }
                throw G
            }
        },
        mapToolResultToToolResultBlockParam(q, K) {
            switch (q.type) {
                case "image":
                    return {
                        tool_use_id: K, type: "tool_result", content: [{
                            type: "image",
                            source: {
                                type: "base64",
                                data: q.file.base64,
                                media_type: q.file.type
                            }
                        }]
                    };
                case "notebook":
                    return OWK(q.file.cells, K);
                case "pdf":
                    return {
                        tool_use_id: K, type: "tool_result", content: `PDF file read: ${q.file.filePath} (${o4(q.file.originalSize)})`
                    };
                case "parts":
                    return {
                        tool_use_id: K, type: "tool_result", content: `PDF pages extracted: ${q.file.count} page(s) from ${q.file.filePath} (${o4(q.file.originalSize)})`
                    };
                case "file_unchanged":
                    return {
                        tool_use_id: K, type: "tool_result", content: A44()
                    };
                case "text": {
                    let _;
                    if (q.file.content) _ = EDY(q) + TDY(q.file) + (NDY() ? VDY : "");
                    else _ = q.file.totalLines === 0 ? "<system-reminder>Warning: the file exists but the contents are empty.</system-reminder>" : `<system-reminder>Warning: the file exists but is shorter than the provided offset (${q.file.startLine}). The file has ${q.file.totalLines} lines.</system-reminder>`;
                    return {
                        tool_use_id: K,
                        type: "tool_result",
                        content: _
                    }
                }
            }
        }
    });
    kDY = [/claude-3-opus/, /claude-3-sonnet/, /claude-3-haiku/, /claude-3-5-sonnet/, /claude-3-5-haiku/, /claude-3-7-sonnet/, /claude-sonnet-4(?:$|[-@]\d{8}|[^-@\d])/, /claude-sonnet-4-5/, /claude-opus-4(?:$|[-@]\d{8}|[^-@\d])/, /claude-opus-4-1/, /claude-opus-4-5/, /claude-haiku-4-5/];
    lyK = new WeakMap
})
// @from(Ln 410541, Col 4)
iyK
// @from(Ln 410542, Col 4)
ryK = L(() => {
    iyK = ["User", "Project", "Local", "Managed", "AutoMem"]
})
// @from(Ln 410546, Col 0)
function Ar1(q) {
    return q.map((K) => {
        if (K.type !== "user") return K;
        let _ = K.message.content;
        if (!Array.isArray(_)) return K;
        let z = !1,
            Y = _.flatMap((A) => {
                if (A.type === "image") return z = !0, [{
                    type: "text",
                    text: "[image]"
                }];
                if (A.type === "document") return z = !0, [{
                    type: "text",
                    text: "[document]"
                }];
                if (A.type === "tool_result" && Array.isArray(A.content)) {
                    let O = !1,
                        w = A.content.map(($) => {
                            if ($.type === "image") return O = !0, {
                                type: "text",
                                text: "[image]"
                            };
                            if ($.type === "document") return O = !0, {
                                type: "text",
                                text: "[document]"
                            };
                            return $
                        });
                    if (O) return z = !0, [{
                        ...A,
                        content: w
                    }]
                }
                return [A]
            });
        if (!z) return K;
        return {
            ...K,
            message: {
                ...K.message,
                content: Y
            }
        }
    })
}
// @from(Ln 410592, Col 0)
function Gx8(q) {
    return q
}
// @from(Ln 410596, Col 0)
function SDY(q) {
    return q.filter((K) => K.type !== "attachment" || K.attachment.type === "queued_command")
}
// @from(Ln 410600, Col 0)
function eyK(q) {
    if (q.length <= oyK) return q;
    let K = oyK,
        _ = q.charCodeAt(K - 1);
    if (_ >= 55296 && _ <= 56319) K--;
    return `${q.slice(0,K)}…[truncated, original ${q.length} chars]`
}
// @from(Ln 410608, Col 0)
function i_7(q) {
    if (typeof q === "string") return eyK(q);
    if (Array.isArray(q)) {
        let K = q.map(i_7);
        return K.some((_, z) => _ !== q[z]) ? K : q
    }
    if (typeof q === "object" && q !== null) {
        let K = q,
            _ = !1,
            z = {};
        for (let [Y, A] of Object.entries(K)) {
            let O = i_7(A);
            if (O !== A) _ = !0;
            z[Y] = O
        }
        return _ ? z : q
    }
    return q
}
// @from(Ln 410628, Col 0)
function CDY(q) {
    return q.map((K) => {
        if (K.type === "assistant") {
            let _ = K.message.content;
            if (!Array.isArray(_)) return K;
            let z = _.some(c38),
                Y = (z ? _.filter((A) => !c38(A)) : _).map((A) => {
                    if (A.type !== "tool_use") return A;
                    let O = i_7(A.input);
                    if (O === A.input) return A;
                    return z = !0, {
                        ...A,
                        input: O
                    }
                });
            if (!z) return K;
            return {
                ...K,
                message: {
                    ...K.message,
                    content: Y
                }
            }
        }
        if (K.type === "user") {
            let _ = K.message.content;
            if (!Array.isArray(_)) return K;
            let z = !1,
                Y = _.map((A) => {
                    if (A.type !== "tool_result") return A;
                    let O = typeof A.content === "string" ? A.content : Array.isArray(A.content) ? A.content.map(($) => $.type === "text" ? $.text : "").join("") : "",
                        w = eyK(O);
                    if (A.content === w) return A;
                    return z = !0, {
                        ...A,
                        content: w
                    }
                });
            if (!z) return K;
            return {
                ...K,
                message: {
                    ...K.message,
                    content: Y
                }
            }
        }
        return K
    })
}
// @from(Ln 410679, Col 0)
function KLK(q, K) {
    let _ = q[0]?.type === "user" && q[0].isMeta && q[0].message.content === ayK ? q.slice(1) : q,
        z = AR6(_);
    if (z.length < 2) return null;
    let Y = Rh8(K),
        A;
    if (Y !== void 0) {
        let w = 0;
        A = 0;
        for (let $ of z)
            if (w += qT($), A++, w >= Y) break
    } else A = Math.max(1, Math.floor(z.length * 0.2));
    if (A = Math.min(A, z.length - 1), A < 1) return null;
    let O = z.slice(A).flat();
    if (O[0]?.type === "assistant") return [t8({
        content: ayK,
        isMeta: !0
    }), ...O];
    return O
}
// @from(Ln 410700, Col 0)
function ec8(q, K, _) {
    if (!q.blockedBy) return;
    if (E(`Compaction blocked by PreCompact hook: ${q.blockedBy}`, {
            level: "warn"
        }), !_?.suppressNotification) K.addNotification?.({
        key: "compaction-blocked-by-hook",
        text: "compaction blocked by PreCompact hook",
        priority: "immediate",
        color: "warning"
    });
    throw new be(`${GI6}: ${q.blockedBy}`)
}
// @from(Ln 410713, Col 0)
function Yt(q) {
    return [q.boundaryMarker, ...q.summaryMessages, ...q.messagesToKeep ?? [], ...q.attachments, ...q.hookResults]
}
// @from(Ln 410717, Col 0)
function Zr1(q, K, _) {
    let z = _ ?? [];
    if (z.length === 0) return q;
    return {
        ...q,
        compactMetadata: {
            ...q.compactMetadata,
            preservedSegment: {
                headUuid: z[0].uuid,
                anchorUuid: K,
                tailUuid: z.at(-1).uuid
            }
        }
    }
}
// @from(Ln 410733, Col 0)
function r_7(q, K) {
    if (!K) return q || void 0;
    if (!q) return K;
    return `${q}

${K}`
}
// @from(Ln 410740, Col 0)
async function vI6(q, K, _, z, Y, A = !1, O, w = !1) {
    let $, j, H, J = performance.now();
    try {
        if (q.length === 0) throw Error(QI6);
        j = vJ(q);
        let X = K.getAppState();
        _R6(X.toolPermissionContext, "summary"), K.onCompactProgress?.({
            type: "hooks_start",
            hookType: "pre_compact"
        }), K.setSDKStatus?.("compacting");
        let M = await oc({
            trigger: A ? "auto" : "manual",
            customInstructions: Y ?? null
        }, K.abortController.signal);
        ec8(M, K, {
            suppressNotification: A
        }), Y = r_7(Y, M.newCustomInstructions);
        let P = M.userDisplayMessage;
        K.setStreamMode?.("requesting"), K.resetResponseLength?.(), K.onCompactProgress?.({
            type: "compact_start"
        });
        let W = !w && u8("tengu_compact_cache_prefix", !0),
            D = fx8(Y),
            Z = t8({
                content: D
            }),
            G = q,
            f = _,
            v, V, k = 0;
        for (;;) {
            if (v = await ALK({
                    messages: G,
                    summaryRequest: Z,
                    appState: X,
                    context: K,
                    preCompactTokenCount: j,
                    cacheSafeParams: f,
                    stripNonEssential: w
                }), V = MJ6(v), !V?.startsWith(cI)) break;
            k++;
            let $6 = k <= qLK ? KLK(G, v) : null;
            if (!$6) throw d("tengu_compact_failed", {
                reason: "prompt_too_long",
                preCompactTokenCount: j,
                promptCacheSharingEnabled: W,
                ptlAttempts: k
            }), Error(_LK);
            d("tengu_compact_ptl_retry", {
                attempt: k,
                droppedMessages: G.length - $6.length,
                remainingMessages: $6.length
            }), G = $6, f = {
                ...f,
                forkContextMessages: $6
            }
        }
        if (!V) throw E(`Compact failed: no summary text in response. Response: ${I6(v)}`, {
            level: "error"
        }), d("tengu_compact_failed", {
            reason: "no_summary",
            preCompactTokenCount: j,
            promptCacheSharingEnabled: W
        }), Error("Failed to generate conversation summary - response did not contain valid text content");
        else if (fp(V)) throw d("tengu_compact_failed", {
            reason: "api_error",
            preCompactTokenCount: j,
            promptCacheSharingEnabled: W
        }), Error(V);
        let N = pe6(K.readFileState);
        K.readFileState.clear(), K.loadedNestedMemoryPaths?.clear(), sj6(K.memorySelector);
        let [R, h] = await Promise.all([Nx8(N, K, kx8), hx8(K)]), C = [...R, ...h], x = Ex8(K.agentId);
        if (x) C.push(x);
        let B = await Lx8(K);
        if (B) C.push(B);
        let m = yx8(K.agentId);
        if (m) C.push(m);
        for (let $6 of MR6(K.options.tools, K.options.mainLoopModel, [], {
                callSite: "compact_full"
            })) C.push(Y4($6));
        for (let $6 of PR6(K, [])) C.push(Y4($6));
        for (let $6 of WR6(K.options.mcpClients, K.options.tools, K.options.mainLoopModel, [])) C.push(Y4($6));
        K.onCompactProgress?.({
            type: "hooks_start",
            hookType: "session_start"
        });
        let S = await lR("compact", {
                model: K.options.mainLoopModel
            }),
            F = Math.round(performance.now() - J),
            U = p18(A ? "auto" : "manual", j ?? 0, q.at(-1)?.uuid),
            g = rc(q);
        if (g.size > 0) U.compactMetadata.preCompactDiscoveredTools = [...g].sort();
        let c = bY(),
            n = JJ() && Oa6(K.getAppState().replContexts, K.agentId),
            l = [t8({
                content: b18(V, z, c, void 0, n),
                isCompactSummary: !0,
                isVisibleInTranscriptOnly: !0
            })],
            z6 = sI([v]),
            A6 = qT([U, ...l, ...C, ...S]);
        U.compactMetadata.postTokens = A6, U.compactMetadata.durationMs = F, H = A6;
        let e = aI(v),
            i = O?.querySource ?? K.options.querySource ?? "unknown";
        if (d("tengu_compact", {
                preCompactTokenCount: j,
                stripNonEssential: w,
                postCompactTokenCount: z6,
                truePostCompactTokenCount: A6,
                autoCompactThreshold: O?.autoCompactThreshold ?? -1,
                willRetriggerNextTurn: O !== void 0 && A6 >= O.autoCompactThreshold,
                isAutoCompact: A,
                querySource: i,
                queryChainId: K.queryTracking?.chainId ?? "",
                queryDepth: K.queryTracking?.depth ?? -1,
                isRecompactionInChain: O?.isRecompactionInChain ?? !1,
                turnsSincePreviousCompact: O?.turnsSincePreviousCompact ?? -1,
                previousCompactTurnId: O?.previousCompactTurnId ?? "",
                compactionInputTokens: e?.input_tokens,
                compactionOutputTokens: e?.output_tokens,
                compactionCacheReadTokens: e?.cache_read_input_tokens ?? 0,
                compactionCacheCreationTokens: e?.cache_creation_input_tokens ?? 0,
                compactionTotalTokens: e ? e.input_tokens + (e.cache_creation_input_tokens ?? 0) + (e.cache_read_input_tokens ?? 0) + e.output_tokens : 0,
                promptCacheSharingEnabled: W,
                ...(() => {
                    try {
                        return Kx8(qx8(q))
                    } catch ($6) {
                        return j6($6), {}
                    }
                })()
            }), iI()) Ne6(K.options.querySource ?? "compact", K.agentId);
        GD6(), DR6(), K.onCompactProgress?.({
            type: "hooks_start",
            hookType: "post_compact"
        });
        let O6 = await K36({
                trigger: A ? "auto" : "manual",
                compactSummary: V
            }, K.abortController.signal),
            J6 = [P, O6.userDisplayMessage].filter(Boolean).join(`
`);
        return {
            boundaryMarker: U,
            summaryMessages: l,
            attachments: C,
            hookResults: S,
            userDisplayMessage: J6 || void 0,
            preCompactTokenCount: j,
            postCompactTokenCount: z6,
            truePostCompactTokenCount: A6,
            compactionUsage: e
        }
    } catch (X) {
        if ($ = X instanceof Error ? X.message : "compaction failed", !A) YLK(X, K);
        throw X
    } finally {
        K.setStreamMode?.("requesting"), K.resetResponseLength?.(), K.onCompactProgress?.({
            type: "compact_end"
        }), aK6({
            trigger: A ? "auto" : "manual",
            success: !$,
            durationMs: performance.now() - J,
            preTokens: j,
            postTokens: H,
            error: $
        }), K.setSDKStatus?.(null, {
            compactResult: $ ? "failed" : "success",
            ...$ && {
                compactError: $
            }
        })
    }
}
// @from(Ln 410914, Col 0)
async function zLK(q, K, _, z, Y, A = "from") {
    let O, w, $, j = performance.now();
    try {
        let H = A === "up_to" ? q.slice(0, K) : q.slice(K),
            J = A === "up_to" ? q.slice(K).filter((O6) => O6.type !== "progress" && !RJ(O6) && !(O6.type === "user" && O6.isCompactSummary)) : q.slice(0, K).filter((O6) => O6.type !== "progress");
        if (H.length === 0) throw Error(A === "up_to" ? "Nothing to summarize before the selected message." : "Nothing to summarize after the selected message.");
        let X = vJ(q);
        w = X, _.onCompactProgress?.({
            type: "hooks_start",
            hookType: "pre_compact"
        }), _.setSDKStatus?.("compacting");
        let M = await oc({
            trigger: "manual",
            customInstructions: null
        }, _.abortController.signal);
        ec8(M, _);
        let P;
        if (M.newCustomInstructions && Y) P = `${M.newCustomInstructions}

User context: ${Y}`;
        else if (M.newCustomInstructions) P = M.newCustomInstructions;
        else if (Y) P = `User context: ${Y}`;
        _.setStreamMode?.("requesting"), _.resetResponseLength?.(), _.onCompactProgress?.({
            type: "compact_start"
        });
        let W = CI4(P, A),
            D = t8({
                content: W
            }),
            Z = {
                preCompactTokenCount: X,
                direction: A,
                messagesSummarized: H.length
            },
            G = A === "up_to" ? H : q,
            f = A === "up_to" ? {
                ...z,
                forkContextMessages: H
            } : z,
            v, V, k = 0;
        for (;;) {
            if (v = await ALK({
                    messages: G,
                    summaryRequest: D,
                    appState: _.getAppState(),
                    context: _,
                    preCompactTokenCount: X,
                    cacheSafeParams: f
                }), V = MJ6(v), !V?.startsWith(cI)) break;
            k++;
            let O6 = k <= qLK ? KLK(G, v) : null;
            if (!O6) throw d("tengu_partial_compact_failed", {
                reason: "prompt_too_long",
                ...Z,
                ptlAttempts: k
            }), Error(_LK);
            d("tengu_compact_ptl_retry", {
                attempt: k,
                droppedMessages: G.length - O6.length,
                remainingMessages: O6.length,
                path: "partial"
            }), G = O6, f = {
                ...f,
                forkContextMessages: O6
            }
        }
        if (!V) throw d("tengu_partial_compact_failed", {
            reason: "no_summary",
            ...Z
        }), Error("Failed to generate conversation summary - response did not contain valid text content");
        else if (fp(V)) throw d("tengu_partial_compact_failed", {
            reason: "api_error",
            ...Z
        }), Error(V);
        let N = pe6(_.readFileState);
        _.readFileState.clear(), _.loadedNestedMemoryPaths?.clear(), sj6(_.memorySelector);
        let [R, h] = await Promise.all([Nx8(N, _, kx8, J), hx8(_)]), C = [...R, ...h], x = Ex8(_.agentId);
        if (x) C.push(x);
        let B = await Lx8(_);
        if (B) C.push(B);
        let m = yx8(_.agentId);
        if (m) C.push(m);
        for (let O6 of MR6(_.options.tools, _.options.mainLoopModel, J, {
                callSite: "compact_partial"
            })) C.push(Y4(O6));
        for (let O6 of PR6(_, J)) C.push(Y4(O6));
        for (let O6 of WR6(_.options.mcpClients, _.options.tools, _.options.mainLoopModel, J)) C.push(Y4(O6));
        _.onCompactProgress?.({
            type: "hooks_start",
            hookType: "session_start"
        });
        let S = await lR("compact", {
                model: _.options.mainLoopModel
            }),
            F = sI([v]),
            U = aI(v);
        d("tengu_partial_compact", {
            preCompactTokenCount: X,
            postCompactTokenCount: F,
            messagesKept: J.length,
            messagesSummarized: H.length,
            direction: A,
            hasUserFeedback: !!Y,
            trigger: "message_selector",
            compactionInputTokens: U?.input_tokens,
            compactionOutputTokens: U?.output_tokens,
            compactionCacheReadTokens: U?.cache_read_input_tokens ?? 0,
            compactionCacheCreationTokens: U?.cache_creation_input_tokens ?? 0
        });
        let g = A === "up_to" ? q.slice(0, K).findLast((O6) => O6.type !== "progress")?.uuid : J.at(-1)?.uuid,
            c = p18("manual", X ?? 0, g, Y, H.length),
            n = rc(q);
        if (n.size > 0) c.compactMetadata.preCompactDiscoveredTools = [...n].sort();
        c.compactMetadata.durationMs = Math.round(performance.now() - j);
        let l = bY(),
            z6 = JJ() && Oa6(_.getAppState().replContexts, _.agentId),
            A6 = [t8({
                content: b18(V, !1, l, void 0, z6),
                isCompactSummary: !0,
                ...J.length > 0 ? {
                    summarizeMetadata: {
                        messagesSummarized: H.length,
                        userContext: Y,
                        direction: A
                    }
                } : {
                    isVisibleInTranscriptOnly: !0
                }
            })];
        if (iI()) Ne6(_.options.querySource ?? "compact", _.agentId);
        GD6(), DR6(), _.onCompactProgress?.({
            type: "hooks_start",
            hookType: "post_compact"
        });
        let e = await K36({
            trigger: "manual",
            compactSummary: V
        }, _.abortController.signal);
        $ = qT([c, ...A6, ...J ?? [], ...C, ...S]), c.compactMetadata.postTokens = $;
        let i = A === "up_to" ? A6.at(-1)?.uuid ?? c.uuid : c.uuid;
        return {
            boundaryMarker: Zr1(c, i, J),
            summaryMessages: A6,
            messagesToKeep: J,
            attachments: C,
            hookResults: S,
            userDisplayMessage: e.userDisplayMessage,
            preCompactTokenCount: X,
            postCompactTokenCount: F,
            compactionUsage: U
        }
    } catch (H) {
        throw O = H instanceof Error ? H.message : "partial compaction failed", YLK(H, _), H
    } finally {
        _.setStreamMode?.("requesting"), _.resetResponseLength?.(), _.onCompactProgress?.({
            type: "compact_end"
        }), aK6({
            trigger: "manual",
            success: !O,
            durationMs: performance.now() - j,
            preTokens: w,
            postTokens: $,
            error: O
        }), _.setSDKStatus?.(null, {
            compactResult: O ? "failed" : "success",
            ...O && {
                compactError: O
            }
        })
    }
}
// @from(Ln 411086, Col 0)
function YLK(q, K) {
    if (!p86(q, at) && !p86(q, QI6) && !b6(q).startsWith(GI6)) K.addNotification?.({
        key: "error-compacting-conversation",
        text: "Error compacting conversation",
        priority: "immediate",
        color: "error"
    }), sv({
        type: "system",
        subtype: "notification",
        key: "error-compacting-conversation",
        text: "Error compacting conversation",
        priority: "immediate",
        color: "error"
    })
}
// @from(Ln 411102, Col 0)
function Or1() {
    return async () => ({
        behavior: "deny",
        message: "Tool use is not allowed during compaction",
        decisionReason: {
            type: "other",
            reason: "compaction agent should only produce text summary"
        }
    })
}
// @from(Ln 411112, Col 0)
async function ALK({
    messages: q,
    summaryRequest: K,
    appState: _,
    context: z,
    preCompactTokenCount: Y,
    cacheSafeParams: A,
    stripNonEssential: O = !1
}) {
    let w = !O && u8("tengu_compact_cache_prefix", !0),
        $ = AkK() ? setInterval((j) => {
            YkK(), j?.("compacting")
        }, 30000, z.setSDKStatus) : void 0;
    try {
        if (w) try {
            let f = await rP({
                    promptMessages: [K],
                    cacheSafeParams: A,
                    canUseTool: Or1(),
                    querySource: "compact",
                    forkLabel: "compact",
                    maxTurns: 1,
                    maxOutputTokens: Math.min(Po6, lc(z.options.mainLoopModel)),
                    skipCacheWrite: !0,
                    skipTranscript: !0,
                    overrides: {
                        abortController: z.abortController
                    }
                }),
                v = fM(f.messages),
                V = v ? MJ6(v) : null;
            if (v && V && !v.isApiErrorMessage) {
                if (!V.startsWith(cI)) d("tengu_compact_cache_sharing_success", {
                    preCompactTokenCount: Y,
                    outputTokens: f.totalUsage.output_tokens,
                    cacheReadInputTokens: f.totalUsage.cache_read_input_tokens,
                    cacheCreationInputTokens: f.totalUsage.cache_creation_input_tokens,
                    cacheHitRate: f.totalUsage.cache_read_input_tokens > 0 ? f.totalUsage.cache_read_input_tokens / (f.totalUsage.cache_read_input_tokens + f.totalUsage.cache_creation_input_tokens + f.totalUsage.input_tokens) : 0
                });
                return v
            }
            E(`Compact cache sharing: no text in response, falling back. Response: ${I6(v)}`, {
                level: "warn"
            }), d("tengu_compact_cache_sharing_fallback", {
                reason: "no_text_response",
                preCompactTokenCount: Y
            })
        } catch (f) {
            j6(f), d("tengu_compact_cache_sharing_fallback", {
                reason: "error",
                preCompactTokenCount: Y
            })
        }
        let j = !1,
            H;
        z.resetResponseLength?.();
        let X = !O && await l38(z.options.mainLoopModel, z.options.tools, async () => _.toolPermissionContext, z.options.agentDefinitions.activeAgents, "compact") ? j2([Kz, r58, ...z.options.tools.filter((f) => f.isMcp)], "name") : [Kz],
            M = [...H2(q), K],
            P = Ar1(Gx8(O ? SDY(M) : M)),
            W = O ? CDY(P) : P,
            Z = eb6({
                messages: K0(W, O ? [] : z.options.tools),
                systemPrompt: sK(["You are a helpful AI assistant tasked with summarizing conversations."]),
                thinkingConfig: {
                    type: "disabled"
                },
                tools: O ? [] : X,
                signal: z.abortController.signal,
                options: {
                    async getToolPermissionContext() {
                        return z.getAppState().toolPermissionContext
                    },
                    model: z.options.mainLoopModel,
                    toolChoice: void 0,
                    isNonInteractiveSession: z.options.isNonInteractiveSession,
                    hasAppendSystemPrompt: !!z.options.appendSystemPrompt,
                    maxOutputTokensOverride: Math.min(Po6, lc(z.options.mainLoopModel)),
                    querySource: "compact",
                    agents: z.options.agentDefinitions.activeAgents,
                    mcpTools: [],
                    effortValue: _.effortValue,
                    enablePromptCaching: !1
                }
            })[Symbol.asyncIterator](),
            G = await Z.next();
        while (!G.done) {
            let f = G.value;
            if (!j && f.type === "stream_event" && f.event.type === "content_block_start" && f.event.content_block.type === "text") j = !0, z.setStreamMode?.("responding");
            if (f.type === "stream_event" && f.event.type === "content_block_delta" && f.event.delta.type === "text_delta") {
                let v = f.event.delta.text.length;
                z.addResponseLength?.(v)
            }
            if (f.type === "assistant") H = f;
            G = await Z.next()
        }
        if (H) return H;
        throw E(`Compact streaming failed. hasStartedStreaming=${j}`, {
            level: "error"
        }), d("tengu_compact_failed", {
            reason: "no_streaming_response",
            preCompactTokenCount: Y,
            hasStartedStreaming: j,
            promptCacheSharingEnabled: w
        }), Error(ql8)
    } finally {
        clearInterval($)
    }
}
// @from(Ln 411220, Col 0)
async function Nx8(q, K, _, z = []) {
    let Y = bDY(z),
        A = Object.entries(q).map(([$, j]) => ({
            filename: $,
            ...j
        })).filter(($) => !xDY($.filename, K.agentId) && !Y.has(Wq($.filename))).sort(($, j) => j.timestamp - $.timestamp).slice(0, _),
        O = await Promise.all(A.map(async ($) => {
            let j = await p97($.filename, {
                ...K,
                fileReadingLimits: {
                    maxTokens: LDY
                }
            }, "tengu_post_compact_file_restore_success", "tengu_post_compact_file_restore_error", "compact");
            return j ? Y4(j) : null
        })),
        w = 0;
    return O.filter(($) => {
        if ($ === null) return !1;
        let j = w_(I6($));
        if (w + j <= yDY) return w += j, !0;
        return !1
    })
}
// @from(Ln 411244, Col 0)
function Ex8(q) {
    let K = lP(q);
    if (!K) return null;
    let _ = eW(q);
    return Y4({
        type: "plan_file_reference",
        planFilePath: _,
        planContent: K
    })
}
// @from(Ln 411255, Col 0)
function yx8(q) {
    let K = g81(q);
    if (K.size === 0) return null;
    let _ = 0,
        z = Array.from(K.values()).sort((Y, A) => A.invokedAt - Y.invokedAt).map((Y) => ({
            name: Y.skillName,
            path: Y.skillPath,
            content: IDY(Y.content, hDY)
        })).filter((Y) => {
            let A = w_(Y.content);
            if (_ + A > RDY) return !1;
            return _ += A, !0
        });
    if (z.length === 0) return null;
    return Y4({
        type: "invoked_skills",
        skills: z
    })
}
// @from(Ln 411274, Col 0)
async function Lx8(q) {
    if (q.getAppState().toolPermissionContext.mode !== "plan") return null;
    let _ = eW(q.agentId),
        z = lP(q.agentId) !== null;
    return Y4({
        type: "plan_mode",
        reminderType: "full",
        isSubAgent: !!q.agentId,
        planFilePath: _,
        planExists: z
    })
}
// @from(Ln 411286, Col 0)
async function hx8(q) {
    let K = q.getAppState();
    return Object.values(K.tasks).filter((z) => z.type === "local_agent").flatMap((z) => {
        if (z.retrieved || z.status === "pending" || z.agentId === q.agentId) return [];
        return [Y4({
            type: "task_status",
            taskId: z.agentId,
            taskType: "local_agent",
            description: z.description,
            status: z.status,
            deltaSummary: z.status === "running" ? z.progress?.summary ?? null : z.error ?? null,
            outputFilePath: $A(z.agentId)
        })]
    })
}
// @from(Ln 411302, Col 0)
function bDY(q) {
    let K = new Set;
    for (let z of q) {
        if (z.type !== "user" || !Array.isArray(z.message.content)) continue;
        for (let Y of z.message.content)
            if (Y.type === "tool_result" && typeof Y.content === "string" && ak8(Y.content)) K.add(Y.tool_use_id)
    }
    let _ = new Set;
    for (let z of q) {
        if (z.type !== "assistant" || !Array.isArray(z.message.content)) continue;
        for (let Y of z.message.content) {
            if (Y.type !== "tool_use" || Y.name !== xq || K.has(Y.id)) continue;
            let A = Y.input;
            if (A && typeof A === "object" && "file_path" in A && typeof A.file_path === "string") _.add(Wq(A.file_path))
        }
    }
    return _
}
// @from(Ln 411321, Col 0)
function IDY(q, K) {
    if (w_(q) <= K) return q;
    let _ = K * 4 - syK.length;
    return q.slice(0, _) + syK
}
// @from(Ln 411327, Col 0)
function xDY(q, K) {
    let _ = Wq(q);
    try {
        let z = Wq(eW(K));
        if (_ === z) return !0
    } catch {}
    try {
        if (new Set(iyK.map((Y) => Wq(H$6(Y)))).has(_)) return !0
    } catch {}
    return !1
}
// @from(Ln 411338, Col 4)
kx8 = 5
// @from(Ln 411339, Col 4)
yDY = 50000
// @from(Ln 411340, Col 4)
LDY = 5000
// @from(Ln 411341, Col 4)
hDY = 5000
// @from(Ln 411342, Col 4)
RDY = 25000
// @from(Ln 411343, Col 4)
oyK = 100
// @from(Ln 411344, Col 4)
QI6 = "Not enough messages to compact."
// @from(Ln 411345, Col 4)
qLK = 3
// @from(Ln 411346, Col 4)
ayK = "[earlier conversation truncated for compaction retry]"
// @from(Ln 411347, Col 4)
_LK = "Conversation too long. Press esc twice to go up a few messages and try again."
// @from(Ln 411348, Col 4)
at = "API Error: Request was aborted."
// @from(Ln 411349, Col 4)
GI6 = "Compaction blocked by PreCompact hook"
// @from(Ln 411350, Col 4)
ql8 = "Compaction interrupted · This may be due to network issues — please try again."
// @from(Ln 411351, Col 4)
be
// @from(Ln 411351, Col 8)
syK = `

[... skill content truncated for compaction; use Read on the skill path if you need the full text]`
// @from(Ln 411354, Col 4)
ep = L(() => {
    tI();
    y8();
    y8();
    aF();
    Rz();
    EP();
    Gd8();
    ZM();
    h1();
    AJ();
    Bi1();
    K8();
    m8();
    FP();
    lf();
    K9();
    U8();
    ryK();
    _7();
    b9();
    NJ();
    BP();
    DI6();
    a56();
    g4();
    e8();
    EH();
    uf();
    kD();
    Ix();
    B1();
    C8();
    O2();
    rv();
    FK6();
    Ox8();
    Nk();
    wc();
    Yr1();
    be = class be extends Error {}
})
// @from(Ln 411397, Col 0)
function s_7(q) {
    let K = q.trim().toLowerCase(),
        _;
    if (K.endsWith("m")) _ = parseFloat(K) * 1e6;
    else if (K.endsWith("k")) _ = parseFloat(K) * 1000;
    else {
        let z = parseInt(K, 10);
        _ = z >= 100 && z <= 1000 ? z * 1000 : z
    }
    if (!Number.isFinite(_) || _ < o_7 || _ > $LK) return;
    return Math.round(_)
}
// @from(Ln 411410, Col 0)
function Jn(q, K) {
    let _ = ff(q, eM());
    if (process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW) {
        let Y = Lp("CLAUDE_CODE_AUTO_COMPACT_WINDOW", process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW, o_7, $LK);
        if (Y.status !== "invalid") {
            let A = Math.max(o_7, Y.effective);
            return {
                window: Math.min(_, A),
                configured: A,
                source: "env"
            }
        }
    }
    if (K !== void 0) return {
        window: Math.min(_, K),
        configured: K,
        source: "settings"
    };
    let z = z0() ? u8("tengu_amber_redwood", "") : "";
    if (z) {
        let Y = s_7(z);
        if (Y !== void 0) return {
            window: Math.min(_, Y),
            configured: Y,
            source: "experiment"
        }
    }
    return {
        window: _,
        configured: _,
        source: "model"
    }
}
// @from(Ln 411444, Col 0)
function Z38(q, K) {
    let {
        source: _
    } = Jn(q, K);
    return _ === "env" || _ === "settings"
}
// @from(Ln 411451, Col 0)
function Yn(q, K) {
    let _ = Math.min(lc(q), uDY),
        z = z0() ? K : void 0,
        {
            window: Y
        } = Jn(q, z);
    return Y - _
}
// @from(Ln 411460, Col 0)
function FDY() {
    return Date.now() - AV() >= pDY
}
// @from(Ln 411464, Col 0)
function v38(q, K) {
    let _ = Yn(q, K),
        z = _ - t_7,
        Y = process.env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE;
    if (Y) {
        let A = parseFloat(Y);
        if (!isNaN(A) && A > 0 && A <= 100) {
            let O = Math.floor(_ * (A / 100));
            return Math.min(O, z)
        }
    }
    return z
}
// @from(Ln 411478, Col 0)
function UM6(q, K, _) {
    let z = z0(),
        Y = z ? _ : void 0,
        A = v38(K, Y),
        O = z ? A : Yn(K, Y),
        w = Math.max(0, Math.round((O - q) / O * 100)),
        $ = O - mDY,
        j = O - BDY,
        H = q >= $,
        J = q >= j,
        X = z && q >= A,
        P = Yn(K, Y) - e_7,
        W = process.env.CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE,
        D = W ? parseInt(W, 10) : NaN,
        Z = !isNaN(D) && D > 0 ? D : P,
        G = q >= Z;
    return {
        percentLeft: w,
        isAboveWarningThreshold: H,
        isAboveErrorThreshold: J,
        isAboveAutoCompactThreshold: X,
        isAtBlockingLimit: G
    }
}
// @from(Ln 411503, Col 0)
function z0() {
    if (S6(process.env.DISABLE_COMPACT)) return !1;
    if (S6(process.env.DISABLE_AUTO_COMPACT)) return !1;
    return H8().autoCompactEnabled
}
// @from(Ln 411508, Col 0)
async function gDY(q, K, _, z, Y = 0) {
    if (z === "session_memory" || z === "compact") return !1;
    if (!z0()) return !1;
    if (bx() && !Z38(K, _)) return !1;
    let A = vJ(q) - Y,
        O = v38(K, _),
        w = Yn(K, _);
    E(`autocompact: tokens=${A} threshold=${O} effectiveWindow=${w}`);
    let {
        isAboveAutoCompactThreshold: $
    } = UM6(A, K, _);
    return $
}
// @from(Ln 411521, Col 0)
async function QkK(q, K, _, z, Y, A) {
    if (S6(process.env.DISABLE_COMPACT)) return {
        wasCompacted: !1
    };
    if (Y?.consecutiveFailures !== void 0 && Y.consecutiveFailures >= wLK) return {
        wasCompacted: !1
    };
    let O = K.options.mainLoopModel,
        w = K.getAppState().autoCompactWindow;
    if (!await gDY(q, O, w, z, A)) return {
        wasCompacted: !1
    };
    let H = Y?.compacted === !0 && Y.turnCounter < a_7 ? (Y?.consecutiveRapidRefills ?? 0) + 1 : 0;
    if (H >= jLK) return E(`autocompact: rapid-refill breaker tripped — ${H} consecutive refills within <${a_7} turns each (last was ${Y?.turnCounter} turns)`, {
        level: "warn"
    }), {
        wasCompacted: !1,
        rapidRefillBreakerTripped: !0
    };
    let J = {
            isRecompactionInChain: Y?.compacted === !0,
            turnsSincePreviousCompact: Y?.turnCounter ?? -1,
            previousCompactTurnId: Y?.turnId,
            autoCompactThreshold: v38(O, w),
            querySource: z
        },
        X = FDY() && u8("tengu_cold_compact", !1);
    try {
        let M = await vI6(q, K, _, !0, void 0, !0, J, X);
        return UDY(K, O, w), bs(void 0), _F(z, K.setAppState, K.resultDedupState), {
            wasCompacted: !0,
            compactionResult: M,
            consecutiveFailures: 0,
            consecutiveRapidRefills: H
        }
    } catch (M) {
        if (b6(M).startsWith(GI6)) return {
            wasCompacted: !1
        };
        if (!p86(M, at)) j6(M);
        let W = (Y?.consecutiveFailures ?? 0) + 1;
        if (W >= wLK) E(`autocompact: circuit breaker tripped after ${W} consecutive failures — skipping future attempts this session`, {
            level: "warn"
        });
        return {
            wasCompacted: !1,
            consecutiveFailures: W
        }
    }
}
// @from(Ln 411572, Col 0)
function UDY(q, K, _) {
    let {
        source: z,
        configured: Y
    } = Jn(K, _);
    if (z !== "experiment") return;
    q.addNotification?.({
        key: "autocompact-experiment-hint",
        text: `compacted at ${h3(Y)} · override with CLAUDE_CODE_AUTO_COMPACT_WINDOW=1000000`,
        priority: "medium"
    })
}
// @from(Ln 411584, Col 4)
uDY = 20000
// @from(Ln 411585, Col 4)
o_7 = 1e5
// @from(Ln 411586, Col 4)
$LK = 1e6
// @from(Ln 411587, Col 4)
t_7 = 13000
// @from(Ln 411588, Col 4)
mDY = 20000
// @from(Ln 411589, Col 4)
BDY = 20000
// @from(Ln 411590, Col 4)
e_7 = 3000
// @from(Ln 411591, Col 4)
wLK = 3
// @from(Ln 411592, Col 4)
a_7 = 3
// @from(Ln 411593, Col 4)
jLK = 3
// @from(Ln 411594, Col 4)
okK
// @from(Ln 411594, Col 9)
pDY = 5400000
// @from(Ln 411595, Col 4)
rR = L(() => {
    y8();
    h1();
    AJ();
    K8();
    Q8();
    ty6();
    m8();
    c7();
    U8();
    kD();
    B1();
    O2();
    re6();
    ep();
    JR6();
    XR6();
    okK = `Autocompact is thrashing: the context refilled to the limit within ${a_7} turns of the previous compact, ${jLK} times in a row. A file being read or a tool output is likely too large for the context window. Try reading in smaller chunks, or use /clear to start fresh.`
})
// @from(Ln 411614, Col 0)
async function dI6(q, K) {
    try {
        let _ = await n38(q, K);
        if (_ !== null) return _;
        E(`countTokensWithFallback: API returned null, trying haiku fallback (${K.length} tools)`)
    } catch (_) {
        E(`countTokensWithFallback: API failed: ${b6(_)}`), j6(_)
    }
    try {
        let _ = await JLK(q, K);
        if (_ === null) E(`countTokensWithFallback: haiku fallback also returned null (${K.length} tools)`);
        return _
    } catch (_) {
        return E(`countTokensWithFallback: haiku fallback failed: ${b6(_)}`), j6(_), null
    }
}
// @from(Ln 411630, Col 0)
async function Z_6(q, K, _, z) {
    let Y = await Promise.all(q.map((O) => Al8(O, {
            getToolPermissionContext: K,
            tools: q,
            agents: _?.activeAgents ?? [],
            model: z
        }))),
        A = await dI6([], Y);
    if (A === null || A === 0) {
        let O = q.map((w) => w.name).join(", ");
        E(`countToolDefinitionTokens returned ${A} for ${q.length} tools: ${O.slice(0,100)}${O.length>100?"...":""}`)
    }
    return A ?? 0
}
// @from(Ln 411645, Col 0)
function QDY(q) {
    let K = q.match(/^#+\s+(.+)$/m);
    if (K) return K[1].trim();
    let _ = q.split(`
`).find((z) => z.trim().length > 0) ?? "";
    return _.length > 40 ? _.slice(0, 40) + "…" : _
}
// @from(Ln 411652, Col 0)
async function dDY(q, K, _) {
    let z = await fj(),
        Y = _ ? {} : z,
        A = [...q.filter((H) => H.length > 0 && H !== F16).map((H) => ({
            name: QDY(H),
            content: H
        })), ...Object.entries(Y).filter(([, H]) => H.length > 0).map(([H, J]) => ({
            name: H,
            content: J
        }))],
        O = 0;
    if (_) {
        let H = await Yl8(K),
            J = [...Object.values(z), ...Object.values(H)].filter((X) => X.length > 0).join(`
`);
        if (J.length > 0) O = await dI6([{
            role: "user",
            content: J
        }], []) || 0
    }
    if (A.length < 1) return {
        systemPromptTokens: 0,
        systemPromptSections: [],
        redirectedContextTokens: O
    };
    let w = await Promise.all(A.map(({
            content: H
        }) => dI6([{
            role: "user",
            content: H
        }], []))),
        $ = A.map((H, J) => ({
            name: H.name,
            tokens: w[J] || 0
        }));
    return {
        systemPromptTokens: w.reduce((H, J) => H + (J || 0), 0),
        systemPromptSections: $,
        redirectedContextTokens: O
    }
}
// @from(Ln 411693, Col 0)
async function cDY() {
    if (S6(process.env.CLAUDE_CODE_SIMPLE)) return {
        memoryFileDetails: [],
        claudeMdTokens: 0
    };
    let q = Qe6(await GJ()),
        K = [],
        _ = 0;
    if (q.length < 1) return {
        memoryFileDetails: [],
        claudeMdTokens: 0
    };
    let z = await Promise.all(q.map(async (Y) => {
        let A = await dI6([{
            role: "user",
            content: Y.content
        }], []);
        return {
            file: Y,
            tokens: A || 0
        }
    }));
    for (let {
            file: Y,
            tokens: A
        }
        of z) _ += A, K.push({
        path: Y.path,
        type: Y.type,
        tokens: A
    });
    return {
        claudeMdTokens: _,
        memoryFileDetails: K
    }
}
// @from(Ln 411729, Col 0)
async function lDY(q, K, _, z, Y) {
    let A = q.filter((D) => !D.isMcp);
    if (A.length < 1) return {
        builtInToolTokens: 0,
        deferredBuiltinDetails: [],
        deferredBuiltinTokens: 0,
        systemToolDetails: []
    };
    let {
        isToolSearchEnabled: O
    } = await Promise.resolve().then(() => (Ix(), _z7)), {
        isDeferredTool: w
    } = await Promise.resolve().then(() => (Kc(), GU1)), $ = await O(z ?? "", q, K, _?.activeAgents ?? [], "analyzeBuiltIn"), j = A.filter((D) => !w(D)), H = A.filter((D) => w(D)), J = j.length > 0 ? await Z_6(j, K, _, z) : 0, X = [], M = [], P = 0, W = 0;
    if (H.length > 0 && $) {
        let D = new Set;
        if (Y) {
            let G = new Set(H.map((f) => f.name));
            for (let f of Y)
                if (f.type === "assistant") {
                    for (let v of f.message.content)
                        if ("type" in v && v.type === "tool_use" && "name" in v && typeof v.name === "string" && G.has(v.name)) D.add(v.name)
                }
        }
        let Z = await Promise.all(H.map((G) => Z_6([G], K, _, z)));
        for (let [G, f] of H.entries()) {
            let v = Math.max(0, (Z[G] || 0) - Kl8),
                V = D.has(f.name);
            if (M.push({
                    name: f.name,
                    tokens: v,
                    isLoaded: V
                }), W += v, V) P += v
        }
    } else if (H.length > 0) {
        let D = await Z_6(H, K, _, z);
        return {
            builtInToolTokens: J + D,
            deferredBuiltinDetails: [],
            deferredBuiltinTokens: 0,
            systemToolDetails: X
        }
    }
    return {
        builtInToolTokens: J + P,
        deferredBuiltinDetails: M,
        deferredBuiltinTokens: W - P,
        systemToolDetails: X
    }
}
// @from(Ln 411779, Col 0)
function HLK(q) {
    return rK(q, VH)
}
// @from(Ln 411782, Col 0)
async function nDY(q, K, _) {
    let z = await qn1(b8()),
        Y = HLK(q);
    if (!Y) return {
        slashCommandTokens: 0,
        commandInfo: {
            totalCommands: 0,
            includedCommands: 0
        }
    };
    return {
        slashCommandTokens: await Z_6([Y], K, _),
        commandInfo: {
            totalCommands: z.totalCommands,
            includedCommands: z.includedCommands
        }
    }
}
// @from(Ln 411800, Col 0)
async function iDY(q, K, _) {
    try {
        let z = await Kn1(b8()),
            Y = HLK(q);
        if (!Y) return {
            skillTokens: 0,
            skillInfo: {
                totalSkills: 0,
                includedSkills: 0,
                skillFrontmatter: []
            }
        };
        let A = await Z_6([Y], K, _),
            O = z.map((w) => ({
                name: y_(w),
                source: w.type === "prompt" ? w.source : "plugin",
                tokens: U38(w)
            }));
        return {
            skillTokens: A,
            skillInfo: {
                totalSkills: z.length,
                includedSkills: z.length,
                skillFrontmatter: O
            }
        }
    } catch (z) {
        return j6(r1(z)), {
            skillTokens: 0,
            skillInfo: {
                totalSkills: 0,
                includedSkills: 0,
                skillFrontmatter: []
            }
        }
    }
}
// @from(Ln 411837, Col 0)
async function rDY(q, K, _, z, Y) {
    let A = q.filter((G) => G.isMcp),
        O = [],
        w = await Z_6(A, K, _, z),
        $ = Math.max(0, (w || 0) - Kl8),
        j = await Promise.all(A.map(async (G) => w_(I6({
            name: G.name,
            description: await G.prompt({
                getToolPermissionContext: K,
                tools: q,
                agents: _?.activeAgents ?? []
            }),
            input_schema: G.inputJSONSchema ?? {}
        })))),
        H = j.reduce((G, f) => G + f, 0) || 1,
        J = j.map((G) => Math.round(G / H * $)),
        {
            isToolSearchEnabled: X
        } = await Promise.resolve().then(() => (Ix(), _z7)),
        {
            isDeferredTool: M
        } = await Promise.resolve().then(() => (Kc(), GU1)),
        P = await X(z, q, K, _?.activeAgents ?? [], "analyzeMcp"),
        W = new Set;
    if (P && Y) {
        let G = new Set(A.map((f) => f.name));
        for (let f of Y)
            if (f.type === "assistant") {
                for (let v of f.message.content)
                    if ("type" in v && v.type === "tool_use" && "name" in v && typeof v.name === "string" && G.has(v.name)) W.add(v.name)
            }
    }
    for (let [G, f] of A.entries()) O.push({
        name: f.name,
        serverName: f.name.split("__")[1] || "unknown",
        tokens: J[G],
        isLoaded: W.has(f.name) || !M(f)
    });
    let D = 0,
        Z = 0;
    for (let G of O)
        if (G.isLoaded) D += G.tokens;
        else if (P) Z += G.tokens;
    return {
        mcpToolTokens: P ? D : $,
        mcpToolDetails: O,
        deferredToolTokens: Z,
        loadedMcpToolNames: W
    }
}
// @from(Ln 411887, Col 0)
async function oDY(q) {
    let K = q.activeAgents.filter((A) => A.source !== "built-in"),
        _ = [],
        z = 0,
        Y = await Promise.all(K.map((A) => dI6([{
            role: "user",
            content: [A.agentType, A.whenToUse].join(" ")
        }], [])));
    for (let [A, O] of K.entries()) {
        let w = Y[A] || 0;
        z += w || 0, _.push({
            agentType: O.agentType,
            source: O.source,
            tokens: w || 0
        })
    }
    return {
        agentTokens: z,
        agentDetails: _
    }
}
// @from(Ln 411909, Col 0)
function aDY(q, K) {
    for (let _ of q.message.content) {
        let z = I6(_),
            Y = w_(z);
        if ("type" in _ && _.type === "tool_use") {
            K.toolCallTokens += Y;
            let A = ("name" in _ ? _.name : void 0) || "unknown";
            K.toolCallsByType.set(A, (K.toolCallsByType.get(A) || 0) + Y)
        } else K.assistantMessageTokens += Y
    }
}
// @from(Ln 411921, Col 0)
function sDY(q, K, _) {
    if (typeof q.message.content === "string") {
        let z = w_(q.message.content);
        K.userMessageTokens += z;
        return
    }
    for (let z of q.message.content) {
        let Y = I6(z),
            A = w_(Y);
        if ("type" in z && z.type === "tool_result") {
            K.toolResultTokens += A;
            let O = "tool_use_id" in z ? z.tool_use_id : void 0,
                w = (O ? _.get(O) : void 0) || "unknown";
            K.toolResultsByType.set(w, (K.toolResultsByType.get(w) || 0) + A)
        } else K.userMessageTokens += A
    }
}
// @from(Ln 411939, Col 0)
function tDY(q, K) {
    let _ = I6(q.attachment),
        z = w_(_);
    K.attachmentTokens += z;
    let Y = q.attachment.type || "unknown";
    K.attachmentsByType.set(Y, (K.attachmentsByType.get(Y) || 0) + z)
}
// @from(Ln 411946, Col 0)
async function eDY(q) {
    let K = await _c(q),
        _ = {
            totalTokens: 0,
            toolCallTokens: 0,
            toolResultTokens: 0,
            attachmentTokens: 0,
            assistantMessageTokens: 0,
            userMessageTokens: 0,
            toolCallsByType: new Map,
            toolResultsByType: new Map,
            attachmentsByType: new Map
        },
        z = new Map;
    for (let A of K.messages)
        if (A.type === "assistant") {
            for (let O of A.message.content)
                if ("type" in O && O.type === "tool_use") {
                    let w = "id" in O ? O.id : void 0,
                        $ = ("name" in O ? O.name : void 0) || "unknown";
                    if (w) z.set(w, $)
                }
        } for (let A of K.messages)
        if (A.type === "assistant") aDY(A, _);
        else if (A.type === "user") sDY(A, _, z);
    else if (A.type === "attachment") tDY(A, _);
    let Y = await dI6(K0(K.messages).map((A) => {
        if (A.type === "assistant") return {
            role: "assistant",
            content: A.message.content
        };
        return A.message
    }), []);
    return _.totalTokens = Y ?? 0, _
}
// @from(Ln 411981, Col 0)
async function _l8(q, K, _, z, Y, A, O, w, $, j, H) {
    let J = HB({
            permissionMode: (await _()).mode,
            mainLoopModel: K
        }),
        X = z0() ? j : void 0,
        {
            window: M,
            source: P
        } = Jn(J, X),
        W = await j0(z, J, void 0, {
            excludeDynamicSections: H
        }),
        D = ax({
            mainThreadAgentDefinition: w,
            toolUseContext: O ?? {
                options: {}
            },
            customSystemPrompt: O?.options.customSystemPrompt,
            defaultSystemPrompt: W,
            appendSystemPrompt: O?.options.appendSystemPrompt
        }),
        [{
            systemPromptTokens: Z,
            systemPromptSections: G,
            redirectedContextTokens: f
        }, {
            claudeMdTokens: v,
            memoryFileDetails: V
        }, {
            builtInToolTokens: k,
            deferredBuiltinDetails: N,
            deferredBuiltinTokens: R,
            systemToolDetails: h
        }, {
            mcpToolTokens: C,
            mcpToolDetails: x,
            deferredToolTokens: B
        }, {
            agentTokens: m,
            agentDetails: S
        }, {
            slashCommandTokens: F,
            commandInfo: U
        }, g] = await Promise.all([dDY(D, J, H && O?.options.customSystemPrompt === void 0), cDY(), lDY(z, _, Y, J, q), rDY(z, _, Y, J, q), oDY(Y), nDY(z, _, Y), eDY(q)]),
        n = (await iDY(z, _, Y)).skillInfo,
        l = n.skillFrontmatter.reduce((w8, x8) => w8 + x8.tokens, 0),
        z6 = g.totalTokens + f,
        A6 = z0(),
        e = A6 ? Yn(K, X) - t_7 : void 0,
        i = [];
    if (Z > 0) i.push({
        name: "System prompt",
        tokens: Z,
        color: "promptBorder"
    });
    let O6 = k - l;
    if (O6 > 0) i.push({
        name: "System tools",
        tokens: O6,
        color: "inactive"
    });
    if (C > 0) i.push({
        name: "MCP tools",
        tokens: C,
        color: "cyan_FOR_SUBAGENTS_ONLY"
    });
    if (B > 0) i.push({
        name: "MCP tools (deferred)",
        tokens: B,
        color: "inactive",
        isDeferred: !0
    });
    if (R > 0) i.push({
        name: "System tools (deferred)",
        tokens: R,
        color: "inactive",
        isDeferred: !0
    });
    if (m > 0) i.push({
        name: "Custom agents",
        tokens: m,
        color: "permission"
    });
    if (v > 0) i.push({
        name: "Memory files",
        tokens: v,
        color: "claude"
    });
    if (l > 0) i.push({
        name: "Skills",
        tokens: l,
        color: "warning"
    });
    let J6 = ce6($ ?? q),
        $6 = J6 ? J6.input_tokens + J6.cache_creation_input_tokens + J6.cache_read_input_tokens : null,
        H6 = 0,
        q6;
    if (!(bx() && P !== "env" && P !== "settings")) {
        if (A6 && e !== void 0) H6 = M - e, q6 = qz7;
        else if (!A6) H6 = e_7, q6 = Kz7
    }
    if ($6 !== null) {
        let w8 = i.reduce((a6, D8) => a6 + (D8.isDeferred ? 0 : D8.tokens), 0),
            x8 = M - w8 - H6;
        z6 = Math.max(z6, Math.min($6 - w8, x8))
    }
    let _6 = Math.max(0, z6 - g.toolCallTokens - g.toolResultTokens - g.attachmentTokens - g.assistantMessageTokens - g.userMessageTokens - f);
    if (z6 > 0) i.push({
        name: "Messages",
        tokens: z6,
        color: "purple_FOR_SUBAGENTS_ONLY"
    });
    let r = i.reduce((w8, x8) => w8 + (x8.isDeferred ? 0 : x8.tokens), 0);
    if (q6) i.push({
        name: q6,
        tokens: H6,
        color: "inactive"
    });
    let t = Math.max(0, M - r - H6);
    i.push({
        name: "Free space",
        tokens: t,
        color: "promptBorder"
    });
    let Y6 = $6 ?? r,
        X6 = A && A < 80,
        M6 = M >= 1e6 ? X6 ? 5 : 20 : X6 ? 5 : 10,
        W6 = M >= 1e6 ? 10 : X6 ? 5 : 10,
        V6 = M6 * W6,
        G6 = i.filter((w8) => !w8.isDeferred).map((w8) => ({
            ...w8,
            squares: w8.name === "Free space" ? Math.round(w8.tokens / M * V6) : Math.max(1, Math.round(w8.tokens / M * V6)),
            percentageOfTotal: Math.round(w8.tokens / M * 100)
        }));

    function k6(w8) {
        let x8 = [],
            a6 = w8.tokens / M * V6,
            D8 = Math.floor(a6),
            Q6 = a6 - D8;
        for (let W8 = 0; W8 < w8.squares; W8++) {
            let G8 = 1;
            if (W8 === D8 && Q6 > 0) G8 = Q6;
            x8.push({
                color: w8.color,
                isFilled: !0,
                categoryName: w8.name,
                tokens: w8.tokens,
                percentage: w8.percentageOfTotal,
                squareFullness: G8
            })
        }
        return x8
    }
    let T6 = [],
        v6 = G6.find((w8) => w8.name === qz7 || w8.name === Kz7),
        L6 = G6.filter((w8) => w8.name !== qz7 && w8.name !== Kz7 && w8.name !== "Free space");
    for (let w8 of L6) {
        let x8 = k6(w8);
        for (let a6 of x8)
            if (T6.length < V6) T6.push(a6)
    }
    let y6 = v6 ? v6.squares : 0,
        c6 = i.find((w8) => w8.name === "Free space"),
        Z8 = V6 - y6;
    while (T6.length < Z8) T6.push({
        color: "promptBorder",
        isFilled: !0,
        categoryName: "Free space",
        tokens: c6?.tokens || 0,
        percentage: c6 ? Math.round(c6.tokens / M * 100) : 0,
        squareFullness: 1
    });
    if (v6) {
        let w8 = k6(v6);
        for (let x8 of w8)
            if (T6.length < V6) T6.push(x8)
    }
    let N8 = [];
    for (let w8 = 0; w8 < W6; w8++) N8.push(T6.slice(w8 * M6, (w8 + 1) * M6));
    let R6 = new Map;
    for (let [w8, x8] of g.toolCallsByType.entries()) {
        let a6 = R6.get(w8) || {
            callTokens: 0,
            resultTokens: 0
        };
        R6.set(w8, {
            ...a6,
            callTokens: x8
        })
    }
    for (let [w8, x8] of g.toolResultsByType.entries()) {
        let a6 = R6.get(w8) || {
            callTokens: 0,
            resultTokens: 0
        };
        R6.set(w8, {
            ...a6,
            resultTokens: x8
        })
    }
    let p6 = Array.from(R6.entries()).map(([w8, {
            callTokens: x8,
            resultTokens: a6
        }]) => ({
            name: w8,
            callTokens: x8,
            resultTokens: a6
        })).sort((w8, x8) => x8.callTokens + x8.resultTokens - (w8.callTokens + w8.resultTokens)),
        q8 = Array.from(g.attachmentsByType.entries()).map(([w8, x8]) => ({
            name: w8,
            tokens: x8
        })).sort((w8, x8) => x8.tokens - w8.tokens),
        L8 = {
            toolCallTokens: g.toolCallTokens,
            toolResultTokens: g.toolResultTokens,
            attachmentTokens: g.attachmentTokens,
            assistantMessageTokens: g.assistantMessageTokens,
            userMessageTokens: g.userMessageTokens,
            redirectedContextTokens: f,
            unattributedTokens: _6,
            toolCallsByType: p6,
            attachmentsByType: q8
        };
    return {
        categories: i,
        totalTokens: Y6,
        maxTokens: M,
        rawMaxTokens: M,
        autocompactSource: P,
        percentage: Math.round(Y6 / M * 100),
        gridRows: N8,
        model: J,
        memoryFiles: V,
        mcpTools: x,
        deferredBuiltinTools: void 0,
        systemTools: void 0,
        systemPromptSections: void 0,
        agents: S,
        slashCommands: F > 0 ? {
            totalCommands: U.totalCommands,
            includedCommands: U.includedCommands,
            tokens: F
        } : void 0,
        skills: l > 0 ? {
            totalSkills: n.totalSkills,
            includedSkills: n.includedSkills,
            tokens: l,
            skillFrontmatter: n.skillFrontmatter
        } : void 0,
        autoCompactThreshold: e,
        isAutoCompactEnabled: A6,
        messageBreakdown: L8,
        apiUsage: J6
    }
}
// @from(Ln 412238, Col 4)
qz7 = "Autocompact buffer"
// @from(Ln 412239, Col 4)
Kz7 = "Compact buffer"
// @from(Ln 412240, Col 4)
Kl8 = 500
// @from(Ln 412241, Col 4)
zl8 = L(() => {
    sy();
    $y();
    CA();
    hk();
    rR();
    XR6();
    Nk();
    wc();
    ol();
    gq();
    Mh6();
    cM6();
    PM();
    n7();
    K8();
    Q8();
    m8();
    U8();
    _7();
    Sq();
    e8();
    pC6();
    kD()
})
// @from(Ln 412267, Col 0)
function f_6(q) {
    let K = XLK.get(q);
    if (K) return K;
    let _ = zr(q);
    return XLK.set(q, _), _
}
// @from(Ln 412273, Col 4)
XLK
// @from(Ln 412274, Col 4)
Ol8 = L(() => {
    p7();
    XLK = new WeakMap
})
// @from(Ln 412278, Col 4)
_z7 = {}
// @from(Ln 412291, Col 0)
function MLK(q) {
    if (!q.startsWith("auto:")) return null;
    let K = q.slice(5),
        _ = parseInt(K, 10);
    if (isNaN(_)) return E(`Invalid ENABLE_TOOL_SEARCH value "${q}": expected auto:N where N is a number.`), null;
    return Math.max(0, Math.min(100, _))
}
// @from(Ln 412299, Col 0)
function qZY(q) {
    if (!q) return !1;
    return q === "auto" || q.startsWith("auto:")
}
// @from(Ln 412304, Col 0)
function Yz7() {
    let q = process.env.ENABLE_TOOL_SEARCH;
    if (!q) return zz7;
    if (q === "auto") return zz7;
    let K = MLK(q);
    if (K !== null) return K;
    return zz7
}
// @from(Ln 412313, Col 0)
function PLK(q) {
    let K = DV8(q),
        _ = ff(q, K),
        z = Yz7() / 100;
    return Math.floor(_ * z)
}
// @from(Ln 412320, Col 0)
function WLK(q) {
    return Math.floor(PLK(q) * KZY)
}
// @from(Ln 412324, Col 0)
function Az7() {
    if (S6(process.env.CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS)) return "standard";
    let q = process.env.ENABLE_TOOL_SEARCH,
        K = q ? MLK(q) : null;
    if (K === 0) return "tst";
    if (K === 100) return "standard";
    if (qZY(q)) return "tst-auto";
    if (S6(q)) return "tst";
    if (c5(process.env.ENABLE_TOOL_SEARCH)) return "standard";
    return "tst"
}
// @from(Ln 412336, Col 0)
function YZY() {
    try {
        let q = u8("tengu_tool_search_unsupported_models", null);
        if (Array.isArray(q)) return q
    } catch {}
    return zZY
}
// @from(Ln 412344, Col 0)
function k38(q) {
    let K = q.toLowerCase(),
        _ = YZY();
    for (let z of _)
        if (K.includes(z.toLowerCase())) return !1;
    return !0
}
// @from(Ln 412352, Col 0)
function GS() {
    let q = Az7();
    if (q === "standard") {
        if (!cI6) cI6 = !0, E(`[ToolSearch:optimistic] mode=${q}, ENABLE_TOOL_SEARCH=${process.env.ENABLE_TOOL_SEARCH}, result=false`);
        return !1
    }
    if (!process.env.ENABLE_TOOL_SEARCH && pq() === "firstParty" && !Aj()) {
        if (!cI6) cI6 = !0, E(`[ToolSearch:optimistic] disabled: ANTHROPIC_BASE_URL=${process.env.ANTHROPIC_BASE_URL} is not a first-party Anthropic host. Set ENABLE_TOOL_SEARCH=true (or auto / auto:N) if your proxy forwards tool_reference blocks.`);
        return !1
    }
    if (!cI6) cI6 = !0, E(`[ToolSearch:optimistic] mode=${q}, ENABLE_TOOL_SEARCH=${process.env.ENABLE_TOOL_SEARCH}, result=true`);
    return !0
}
// @from(Ln 412366, Col 0)
function BM6(q) {
    return q.some((K) => e3(K, Zj))
}
// @from(Ln 412369, Col 0)
async function AZY(q, K, _) {
    let z = q.filter((A) => nI(A));
    if (z.length === 0) return 0;
    return (await Promise.all(z.map(async (A) => {
        let O = await A.prompt({
                getToolPermissionContext: K,
                tools: q,
                agents: _
            }),
            w = A.inputJSONSchema ? I6(A.inputJSONSchema) : A.inputSchema ? I6(f_6(A.inputSchema)) : "";
        return A.name.length + O.length + w.length
    }))).reduce((A, O) => A + O, 0)
}
// @from(Ln 412382, Col 0)
async function l38(q, K, _, z, Y) {
    let A = w7(K, ($) => $.isMcp);

    function O($, j, H, J) {
        d("tengu_tool_search_mode_decision", {
            enabled: $,
            mode: j,
            reason: H,
            checkedModel: q,
            mcpToolCount: A,
            mcpNonBlocking: S6(process.env.MCP_CONNECTION_NONBLOCKING),
            userType: "external",
            ...J
        })
    }
    if (!k38(q)) return E(`Tool search disabled for model '${q}': model does not support tool_reference blocks. This feature is only available on Claude Sonnet 4+, Opus 4+, and newer models.`), O(!1, "standard", "model_unsupported"), !1;
    if (!BM6(K)) return E("Tool search disabled: ToolSearchTool is not available (may have been disallowed via disallowedTools)."), O(!1, "standard", "mcp_search_unavailable"), !1;
    let w = Az7();
    switch (w) {
        case "tst":
            return O(!0, w, "tst_enabled"), !0;
        case "tst-auto": {
            let {
                enabled: $,
                debugDescription: j,
                metrics: H
            } = await $ZY(K, _, z, q);
            if ($) return E(`Auto tool search enabled: ${j}` + (Y ? ` [source: ${Y}]` : "")), O(!0, w, "auto_above_threshold", H), !0;
            return E(`Auto tool search disabled: ${j}` + (Y ? ` [source: ${Y}]` : "")), O(!1, w, "auto_below_threshold", H), !1
        }
        case "standard":
            return O(!1, w, "standard_mode"), !1
    }
}
// @from(Ln 412417, Col 0)
function Kg(q) {
    return typeof q === "object" && q !== null && "type" in q && q.type === "tool_reference"
}
// @from(Ln 412421, Col 0)
function OZY(q) {
    return Kg(q) && "tool_name" in q && typeof q.tool_name === "string"
}
// @from(Ln 412425, Col 0)
function wZY(q) {
    return typeof q === "object" && q !== null && "type" in q && q.type === "tool_result" && "content" in q && Array.isArray(q.content)
}
// @from(Ln 412429, Col 0)
function rc(q) {
    let K = new Set,
        _ = 0;
    for (let z of q) {
        if (z.type === "system" && z.subtype === "compact_boundary") {
            let A = z.compactMetadata?.preCompactDiscoveredTools;
            if (A) {
                for (let O of A) K.add(O);
                _ += A.length
            }
            continue
        }
        if (z.type !== "user") continue;
        let Y = z.message?.content;
        if (!Array.isArray(Y)) continue;
        for (let A of Y)
            if (wZY(A)) {
                for (let O of A.content)
                    if (OZY(O)) K.add(O.tool_name)
            }
    }
    if (K.size > 0) E(`Dynamic tool loading: found ${K.size} discovered tools in message history` + (_ > 0 ? ` (${_} carried from compact boundary)` : ""));
    return K
}
// @from(Ln 412454, Col 0)
function g97(q, K, _) {
    let z = new Set,
        Y = 0,
        A = 0,
        O = new Set;
    for (let X of K) {
        if (X.type !== "attachment") continue;
        if (Y++, O.add(X.attachment.type), X.attachment.type !== "deferred_tools_delta") continue;
        A++;
        for (let M of X.attachment.addedNames) z.add(M);
        for (let M of X.attachment.removedNames) z.delete(M)
    }
    let w = q.filter(nI),
        $ = new Set(w.map((X) => X.name)),
        j = new Set(q.map((X) => X.name)),
        H = w.filter((X) => !z.has(X.name)),
        J = [];
    for (let X of z) {
        if ($.has(X)) continue;
        if (!j.has(X)) J.push(X)
    }
    if (H.length === 0 && J.length === 0) return null;
    return d("tengu_deferred_tools_pool_change", {
        addedCount: H.length,
        removedCount: J.length,
        priorAnnouncedCount: z.size,
        messagesLength: K.length,
        attachmentCount: Y,
        dtdCount: A,
        callSite: _?.callSite ?? "unknown",
        querySource: _?.querySource ?? "unknown",
        attachmentTypesSeen: [...O].sort().join(",")
    }), {
        addedNames: H.map((X) => X.name).sort(),
        addedLines: H.map(fU1).sort(),
        removedNames: J.sort()
    }
}
// @from(Ln 412492, Col 0)
async function $ZY(q, K, _, z) {
    let Y = await _ZY(q, K, _, z);
    if (Y !== null) {
        let w = PLK(z);
        return {
            enabled: Y >= w,
            debugDescription: `${Y} tokens (threshold: ${w}, ${Yz7()}% of context)`,
            metrics: {
                deferredToolTokens: Y,
                threshold: w
            }
        }
    }
    let A = await AZY(q, K, _),
        O = WLK(z);
    return {
        enabled: A >= O,
        debugDescription: `${A} chars (threshold: ${O}, ${Yz7()}% of context) (char fallback)`,
        metrics: {
            deferredToolDescriptionChars: A,
            charThreshold: O
        }
    }
}
// @from(Ln 412516, Col 4)
zz7 = 10
// @from(Ln 412517, Col 4)
KZY = 2.5
// @from(Ln 412518, Col 4)
_ZY
// @from(Ln 412518, Col 9)
zZY
// @from(Ln 412518, Col 14)
cI6 = !1
// @from(Ln 412519, Col 4)
Ix = L(() => {
    U4();
    B1();
    C8();
    gq();
    Kc();
    zl8();
    pv();
    AJ();
    K8();
    Q8();
    x9();
    e8();
    Ol8();
    _ZY = P1(async (q, K, _, z) => {
        let Y = q.filter((A) => nI(A));
        if (Y.length === 0) return 0;
        try {
            let A = await Z_6(Y, K, {
                activeAgents: _,
                allAgents: _
            }, z);
            if (A === 0) return null;
            return Math.max(0, A - Kl8)
        } catch {
            return null
        }
    }, (q) => q.filter((K) => nI(K)).map((K) => K.name).join(","));
    zZY = ["haiku"]
})
// @from(Ln 412563, Col 0)
function wz7() {
    return !1
}
// @from(Ln 412566, Col 0)
async function HZY(q, K, _) {
    if (!wz7()) return await _();
    let z = ZLK("sha1").update(I6(q)).digest("hex").slice(0, 12),
        Y = VLK(process.env.CLAUDE_CODE_TEST_FIXTURES_ROOT ?? b8(), `fixtures/${K}-${z}.json`);
    try {
        return n8(await GLK(Y, {
            encoding: "utf8"
        }))
    } catch (O) {
        if (Q1(O) !== "ENOENT") throw O
    }
    if ((X7.isCI || !1) && !S6(process.env.VCR_RECORD)) throw Error(`Fixture missing: ${Y}. Re-run tests with VCR_RECORD=1, then commit the result.`);
    let A = await _();
    return await fLK(TLK(Y), {
        recursive: !0
    }), await vLK(Y, I6(A, null, 2), {
        encoding: "utf8"
    }), A
}
// @from(Ln 412585, Col 0)
async function $l8(q, K) {
    if (!wz7()) return await K();
    let _ = K0(q.filter((O) => {
            if (O.type !== "user") return !0;
            if (O.isMeta) return !1;
            return !0
        })),
        z = XZY(_.map((O) => O.message.content), Oz7),
        Y = VLK(process.env.CLAUDE_CODE_TEST_FIXTURES_ROOT ?? b8(), `fixtures/${z.map((O)=>ZLK("sha1").update(I6(O)).digest("hex").slice(0,6)).join("-")}.json`);
    try {
        let O = n8(await GLK(Y, {
            encoding: "utf8"
        }));
        return O.output.forEach(JZY), O.output.map((w, $) => DLK(w, WZY, $, jZY()))
    } catch (O) {
        if (Q1(O) !== "ENOENT") throw O
    }
    if (X7.isCI && !S6(process.env.VCR_RECORD)) throw Error(`Anthropic API fixture missing: ${Y}. Re-run tests with VCR_RECORD=1, then commit the result. Input messages:
${I6(z,null,2)}`);
    let A = await K();
    if (X7.isCI && !S6(process.env.VCR_RECORD)) return A;
    return await fLK(TLK(Y), {
        recursive: !0
    }), await vLK(Y, I6({
        input: z,
        output: A.map((O, w) => DLK(O, Oz7, w))
    }, null, 2), {
        encoding: "utf8"
    }), A
}
// @from(Ln 412616, Col 0)
function JZY(q) {
    if (q.type === "stream_event") return;
    let K = q.message.model,
        _ = q.message.usage,
        z = qq6(K, _);
    Lh6(z, _, K)
}
// @from(Ln 412624, Col 0)
function XZY(q, K) {
    return q.map((_) => {
        if (typeof _ === "string") return K(_);
        return _.map((z) => {
            switch (z.type) {
                case "tool_result":
                    if (typeof z.content === "string") return {
                        ...z,
                        content: K(z.content)
                    };
                    if (Array.isArray(z.content)) return {
                        ...z,
                        content: z.content.map((Y) => {
                            switch (Y.type) {
                                case "text":
                                    return {
                                        ...Y, text: K(Y.text)
                                    };
                                case "image":
                                    return Y;
                                default:
                                    return
                            }
                        })
                    };
                    return z;
                case "text":
                    return {
                        ...z, text: K(z.text)
                    };
                case "tool_use":
                    return {
                        ...z, input: wl8(z.input, K)
                    };
                case "image":
                    return MZY(z);
                default:
                    return
            }
        })
    })
}
// @from(Ln 412667, Col 0)
function MZY(q) {
    if (q.source.type !== "base64") return q;
    return {
        ...q,
        source: {
            ...q.source,
            data: "[IMAGE_DATA]"
        }
    }
}
// @from(Ln 412678, Col 0)
function wl8(q, K) {
    return c0(q, (_, z) => {
        if (Array.isArray(_)) return _.map((Y) => wl8(Y, K));
        if (Lf6(_)) return wl8(_, K);
        return K(_, z, q)
    })
}
// @from(Ln 412686, Col 0)
function PZY(q, K, _, z) {
    return {
        uuid: z ?? `UUID-${_}`,
        requestId: "REQUEST_ID",
        timestamp: q.timestamp,
        message: {
            ...q.message,
            content: q.message.content.map((Y) => {
                switch (Y.type) {
                    case "text":
                        return {
                            ...Y, text: K(Y.text), citations: Y.citations || []
                        };
                    case "tool_use":
                        return {
                            ...Y, input: wl8(Y.input, K)
                        };
                    default:
                        return Y
                }
            }).filter(Boolean)
        },
        type: "assistant"
    }
}
// @from(Ln 412712, Col 0)
function DLK(q, K, _, z) {
    if (q.type === "assistant") return PZY(q, K, _, z);
    else return q
}
// @from(Ln 412717, Col 0)
function Oz7(q) {
    if (typeof q !== "string") return q;
    let K = b8(),
        _ = A7(),
        z = q.replace(/num_files="\d+"/g, 'num_files="[NUM]"').replace(/duration_ms="\d+"/g, 'duration_ms="[DURATION]"').replace(/cost_usd="\d+"/g, 'cost_usd="[COST]"').replaceAll(_, "[CONFIG_HOME]").replaceAll(K, "[CWD]").replace(/Available commands:.+/, "Available commands: [COMMANDS]");
    if (process.platform === "win32") {
        let Y = K.replaceAll("\\", "/"),
            A = _.replaceAll("\\", "/"),
            O = I6(K).slice(1, -1),
            w = I6(_).slice(1, -1);
        z = z.replaceAll(O, "[CWD]").replaceAll(w, "[CONFIG_HOME]").replaceAll(Y, "[CWD]").replaceAll(A, "[CONFIG_HOME]")
    }
    if (z = z.replace(/\[CWD\][^\s"'<>]*/g, (Y) => Y.replaceAll("\\\\", "/").replaceAll("\\", "/")).replace(/\[CONFIG_HOME\][^\s"'<>]*/g, (Y) => Y.replaceAll("\\\\", "/").replaceAll("\\", "/")), z.includes("Files modified by user:")) return "Files modified by user: [FILES]";
    return z
}
// @from(Ln 412733, Col 0)
function WZY(q) {
    if (typeof q !== "string") return q;
    return q.replaceAll("[NUM]", "1").replaceAll("[DURATION]", "100").replaceAll("[CONFIG_HOME]", A7()).replaceAll("[CWD]", b8())
}
// @from(Ln 412737, Col 0)
async function* $z7(q, K) {
    if (!wz7()) return yield* K();
    let _ = [],
        z = await $l8(q, async () => {
            for await (let Y of K()) _.push(Y);
            return _
        });
    if (z.length > 0) {
        yield* z;
        return
    }
    yield* _
}
// @from(Ln 412750, Col 0)
async function jz7(q, K, _) {
    let z = b8().replace(/[^a-zA-Z0-9]/g, "-"),
        Y = Oz7(I6({
            messages: q,
            tools: K
        })).replaceAll(z, "[CWD_SLUG]").replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, "[UUID]").replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?/g, "[TIMESTAMP]");
    return (await HZY(Y, "token-count", async () => ({
        tokenCount: await _()
    }))).tokenCount
}
// @from(Ln 412760, Col 4)
Hz7 = L(() => {
    YJ8();
    G16();
    Tx();
    fo();
    n7();
    D_();
    Q8();
    m8();
    _7();
    e8()
})
// @from(Ln 412773, Col 0)
function NLK(q) {
    for (let K of q)
        if (K.role === "assistant" && Array.isArray(K.content)) {
            for (let _ of K.content)
                if (typeof _ === "object" && _ !== null && "type" in _ && (_.type === "thinking" || _.type === "redacted_thinking")) return !0
        } return !1
}
// @from(Ln 412781, Col 0)
function DZY(q) {
    return q.map((K) => {
        if (!Array.isArray(K.content)) return K;
        let _ = K.content.map((z) => {
            if (z.type === "tool_use") {
                let Y = z;
                return {
                    type: "tool_use",
                    id: Y.id,
                    name: Y.name,
                    input: Y.input
                }
            }
            if (z.type === "tool_result") {
                let Y = z;
                if (Array.isArray(Y.content)) {
                    let A = Y.content.filter((O) => !Kg(O));
                    if (A.length === 0) return {
                        ...Y,
                        content: [{
                            type: "text",
                            text: "[tool references]"
                        }]
                    };
                    if (A.length !== Y.content.length) return {
                        ...Y,
                        content: A
                    }
                }
            }
            return z
        });
        return {
            ...K,
            content: _
        }
    })
}
// @from(Ln 412819, Col 0)
async function nyK(q) {
    if (!q) return 0;
    return n38([{
        role: "user",
        content: q
    }], [])
}
// @from(Ln 412826, Col 0)
async function n38(q, K) {
    return jz7(q, K, async () => {
        try {
            let _ = G5(),
                z = KR(_),
                Y = NLK(q),
                A = YM(_);
            if (A === "bedrock") return fZY({
                model: Of(_),
                messages: q,
                tools: K,
                betas: z,
                containsThinking: Y
            });
            let O = await qR({
                    maxRetries: 1,
                    model: _,
                    source: "count_tokens"
                }),
                w = A === "vertex" ? z.filter((j) => rv1.has(j)) : z,
                $ = await O.beta.messages.countTokens({
                    model: Of(_),
                    messages: q.length > 0 ? q : [{
                        role: "user",
                        content: "foo"
                    }],
                    tools: K,
                    ...w.length > 0 && {
                        betas: w
                    },
                    ...Y && {
                        thinking: {
                            type: "enabled",
                            budget_tokens: Jz7
                        }
                    }
                });
            if (typeof $.input_tokens !== "number") return null;
            return $.input_tokens
        } catch (_) {
            return j6(_), null
        }
    })
}
// @from(Ln 412870, Col 0)
async function JLK(q, K) {
    return jz7(q, K, async () => {
        let _ = NLK(q),
            z = S6(process.env.CLAUDE_CODE_USE_VERTEX) && uD6(OM()) === "global",
            Y = S6(process.env.CLAUDE_CODE_USE_BEDROCK) && _,
            A = S6(process.env.CLAUDE_CODE_USE_VERTEX) && _,
            O = z || Y || A ? Af() : OM(),
            w = await qR({
                maxRetries: 1,
                model: O,
                source: "count_tokens"
            }),
            $ = DZY(q),
            j = $.length > 0 ? $ : [{
                role: "user",
                content: "count"
            }],
            H = KR(O),
            J = YM(O) === "vertex" ? H.filter((Z) => rv1.has(Z)) : H,
            M = (await w.beta.messages.create({
                model: Of(O),
                max_tokens: _ ? kLK : 1,
                messages: j,
                tools: K.length > 0 ? K : void 0,
                ...J.length > 0 && {
                    betas: J
                },
                metadata: fK6(),
                ...ct(),
                ..._ && {
                    thinking: {
                        type: "enabled",
                        budget_tokens: Jz7
                    }
                }
            })).usage,
            P = M.input_tokens,
            W = M.cache_creation_input_tokens || 0,
            D = M.cache_read_input_tokens || 0;
        return P + W + D
    })
}
// @from(Ln 412913, Col 0)
function qT(q) {
    let K = 0;
    for (let _ of q) K += ZZY(_);
    return K
}
// @from(Ln 412919, Col 0)
function ZZY(q) {
    if ((q.type === "assistant" || q.type === "user") && q.message?.content) return gy6(q.message?.content);
    if (q.type === "attachment" && q.attachment) {
        let K = Xz7(q.attachment),
            _ = 0;
        for (let z of K) _ += gy6(z.message.content);
        return _
    }
    return 0
}
// @from(Ln 412929, Col 0)
async function fZY({
    model: q,
    messages: K,
    tools: _,
    betas: z,
    containsThinking: Y
}) {
    try {
        let A = await AMq(),
            O = hf1(q) ? q : await sD8(q);
        if (!O) return null;
        let w = {
                anthropic_version: "bedrock-2023-05-31",
                messages: K.length > 0 ? K : [{
                    role: "user",
                    content: "foo"
                }],
                max_tokens: Y ? kLK : 1,
                ..._.length > 0 && {
                    tools: _
                },
                ...z.length > 0 && {
                    anthropic_beta: z
                },
                ...Y && {
                    thinking: {
                        type: "enabled",
                        budget_tokens: Jz7
                    }
                }
            },
            {
                CountTokensCommand: $
            } = await Promise.resolve().then(() => K6(aD8(), 1)),
            j = {
                modelId: O,
                input: {
                    invokeModel: {
                        body: new TextEncoder().encode(I6(w))
                    }
                }
            };
        return (await A.send(new $(j))).inputTokens ?? null
    } catch (A) {
        return j6(A), null
    }
}
// @from(Ln 412976, Col 4)
Jz7 = 1024
// @from(Ln 412977, Col 4)
kLK = 2048
// @from(Ln 412978, Col 4)
wc = L(() => {
    x9();
    e76();
    pv();
    Q8();
    U8();
    _7();
    n76();
    Sq();
    e8();
    Ix();
    O2();
    Pk6();
    Nk();
    Hz7()
})
// @from(Ln 412995, Col 0)
function jl8() {
    let q = process.env.MAX_MCP_OUTPUT_TOKENS;
    if (q) {
        let z = parseInt(q, 10);
        if (Number.isFinite(z) && z > 0) return z
    }
    let _ = u8("tengu_satin_quoll", {})?.mcp_tool;
    if (typeof _ === "number" && Number.isFinite(_) && _ > 0) return _;
    return vZY
}
// @from(Ln 413006, Col 0)
function i38(q) {
    if (!q || typeof q === "string" || !Array.isArray(q)) return q;
    let K = q,
        _ = !1;
    for (let z of K)
        if (z.type === "text" && "_meta" in z && z._meta) {
            _ = !0;
            break
        } if (!_) return q;
    return K.map((z) => {
        if (z.type === "text" && "_meta" in z && z._meta) {
            let {
                _meta: Y,
                ...A
            } = z;
            return A
        }
        return z
    })
}
// @from(Ln 413027, Col 0)
function yLK(q) {
    return q.type === "text"
}
// @from(Ln 413031, Col 0)
function LLK(q) {
    return q.type === "image"
}
// @from(Ln 413035, Col 0)
function r38(q) {
    if (!q) return 0;
    if (typeof q === "string") return w_(q);
    if (!Array.isArray(q)) return 0;
    return q.reduce((K, _) => {
        if (yLK(_)) return K + w_(_.text);
        else if (LLK(_)) return K + ELK;
        return K
    }, 0)
}
// @from(Ln 413046, Col 0)
function TZY() {
    return jl8() * 4
}
// @from(Ln 413050, Col 0)
function VZY() {
    return `

[OUTPUT TRUNCATED - exceeded ${jl8()} token limit]

The tool output was truncated. If this MCP server provides pagination or filtering tools, use them to retrieve specific portions of the data. If pagination is not available, inform the user that you are working with truncated output and results may be incomplete.`
}
// @from(Ln 413058, Col 0)
function kZY(q, K) {
    if (q.length <= K) return q;
    return q.slice(0, K)
}
// @from(Ln 413062, Col 0)
async function NZY(q, K) {
    let _ = [],
        z = 0;
    for (let Y of q)
        if (yLK(Y)) {
            let A = K - z;
            if (A <= 0) break;
            if (Y.text.length <= A) _.push(Y), z += Y.text.length;
            else {
                let O = {
                    type: "text",
                    text: Y.text.slice(0, A)
                };
                if (Y._meta) O._meta = Y._meta;
                _.push(O);
                break
            }
        } else if (LLK(Y)) {
        let A = ELK * 4;
        if (z + A <= K) _.push(Y), z += A;
        else {
            let O = K - z;
            if (O > 0) {
                let w = Math.floor(O * 0.75);
                try {
                    let $ = await m24(Y, w);
                    if (_.push($), $.source.type === "base64") z += $.source.data.length;
                    else z += A
                } catch {}
            }
        }
    } else _.push(Y);
    return _
}
// @from(Ln 413096, Col 0)
async function Mz7(q) {
    if (!q) return !1;
    if (r38(q) <= jl8() * GZY) return !1;
    try {
        let z = await n38(typeof q === "string" ? [{
            role: "user",
            content: q
        }] : [{
            role: "user",
            content: q
        }], []);
        return !!(z && z > jl8())
    } catch (_) {
        return j6(_), !1
    }
}
// @from(Ln 413112, Col 0)
async function EZY(q) {
    if (!q) return q;
    let K = TZY(),
        _ = VZY();
    if (typeof q === "string") return kZY(q, K) + _;
    else {
        let z = await NZY(q, K);
        return z.push({
            type: "text",
            text: _
        }), z
    }
}
// @from(Ln 413125, Col 0)
async function Pz7(q) {
    if (!await Mz7(q)) return q;
    return await EZY(q)
}
// @from(Ln 413129, Col 4)
GZY = 0.5
// @from(Ln 413130, Col 4)
ELK = 1600
// @from(Ln 413131, Col 4)
vZY = 25000
// @from(Ln 413132, Col 4)
Hl8 = L(() => {
    B1();
    Nk();
    wc();
    CI();
    U8()
})
// @from(Ln 413139, Col 4)
hLK = ""
// @from(Ln 413140, Col 4)
RLK = ""
// @from(Ln 413142, Col 0)
function wP6(q) {
    let K = s(13),
        {
            ratio: _,
            width: z,
            fillColor: Y,
            emptyColor: A
        } = q,
        O = Math.min(1, Math.max(0, _)),
        w = Math.floor(O * z),
        $;
    if (K[0] !== w) $ = o38[o38.length - 1].repeat(w), K[0] = w, K[1] = $;
    else $ = K[1];
    let j;
    if (K[2] !== O || K[3] !== $ || K[4] !== w || K[5] !== z) {
        if (j = [$], w < z) {
            let X = O * z - w,
                M = Math.floor(X * o38.length);
            j.push(o38[M]);
            let P = z - w - 1;
            if (P > 0) {
                let W;
                if (K[7] !== P) W = o38[0].repeat(P), K[7] = P, K[8] = W;
                else W = K[8];
                j.push(W)
            }
        }
        K[2] = O, K[3] = $, K[4] = w, K[5] = z, K[6] = j
    } else j = K[6];
    let H = j.join(""),
        J;
    if (K[9] !== A || K[10] !== Y || K[11] !== H) J = SLK.default.createElement(T, {
        color: Y,
        backgroundColor: A
    }, H), K[9] = A, K[10] = Y, K[11] = H, K[12] = J;
    else J = K[12];
    return J
}
// @from(Ln 413180, Col 4)
SLK
// @from(Ln 413180, Col 9)
o38
// @from(Ln 413181, Col 4)
Jl8 = L(() => {
    o6();
    g6();
    SLK = K6(P6(), 1), o38 = [" ", "▏", "▎", "▍", "▌", "▋", "▊", "▉", "█"]
})
// @from(Ln 413186, Col 4)
yZY
// @from(Ln 413187, Col 4)
CLK = L(() => {
    o6();
    I4();
    g6();
    GK();
    w58();
    yZY = K6(P6(), 1)
})