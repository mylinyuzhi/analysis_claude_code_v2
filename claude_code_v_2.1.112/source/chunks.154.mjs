
// @from(Ln 396690, Col 4)
TkK = L(() => {
    VY();
    Rz();
    u$();
    jJ()
})
// @from(Ln 396696, Col 4)
Kc8 = {}
// @from(Ln 396707, Col 0)
function J97(q) {
    return q.type === "user" || q.type === "assistant"
}
// @from(Ln 396711, Col 0)
function aJY(q, K) {
    if (K === null || K === void 0) return w7(q, J97);
    let _ = !1,
        z = 0;
    for (let Y of q) {
        if (!_) {
            if (Y.uuid === K) _ = !0;
            continue
        }
        if (J97(Y)) z++
    }
    if (!_) return w7(q, J97);
    return z
}
// @from(Ln 396726, Col 0)
function sJY(q, K) {
    let _ = K === void 0;
    for (let z of q) {
        if (!_) {
            if (z.uuid === K) _ = !0;
            continue
        }
        if (z.type !== "assistant") continue;
        let Y = z.message.content;
        if (!Array.isArray(Y)) continue;
        for (let A of Y) {
            let O = ykK(A);
            if (O !== void 0 && YR(O)) return !0
        }
    }
    return !1
}
// @from(Ln 396744, Col 0)
function NkK(q) {
    return w7(q.split(/\s+/), Boolean)
}
// @from(Ln 396748, Col 0)
function EkK(q) {
    if (q.type !== "user" || q.isMeta) return !1;
    let K = q.message.content;
    if (typeof K === "string") return NkK(K) >= kkK;
    if (!Array.isArray(K)) return !1;
    return K.some((_) => _.type === "text" && NkK(_.text) >= kkK)
}
// @from(Ln 396756, Col 0)
function tJY(q, K) {
    let _ = K === void 0;
    for (let z of q) {
        if (!_) {
            if (z.uuid === K) _ = !0;
            continue
        }
        if (EkK(z)) return !0
    }
    if (!_) return q.some(EkK);
    return !1
}
// @from(Ln 396769, Col 0)
function ed8(q, K) {
    return E(`[autoMem] denied ${q.name}: ${K}`), d("tengu_auto_mem_tool_denied", {
        tool_name: PK(q.name)
    }), {
        behavior: "deny",
        message: K,
        decisionReason: {
            type: "other",
            reason: K
        }
    }
}
// @from(Ln 396781, Col 0)
async function eJY(q) {
    let K = await Py6(q);
    if (K.kind !== "simple") return !1;
    if (K.commands.length !== 1) return !1;
    let _ = K.commands[0];
    if (!_) return !1;
    if (_.argv[0] !== "rm") return !1;
    if (_.redirects.length > 0) return !1;
    if (_.envVars.length > 0) return !1;
    let z = 0,
        Y = !1;
    for (let A = 1; A < _.argv.length; A++) {
        let O = _.argv[A];
        if (O === void 0) continue;
        if (!Y) {
            if (O === "--") {
                Y = !0;
                continue
            }
            if (O.startsWith("-")) {
                if (O === "--recursive" || /^-[a-zA-Z]*[rR]/.test(O)) return !1;
                continue
            }
        }
        if (/[*?[]/.test(O)) return !1;
        if (!O.startsWith("/") || !O.endsWith(".md")) return !1;
        if (!YR(O)) return !1;
        z++
    }
    return z > 0
}
// @from(Ln 396813, Col 0)
function qc8(q) {
    return async (K, _) => {
        if (Qg()) return ed8(K, "Memory is toggled off. Run /toggle-memory to re-enable automemory.");
        if (K.name === GO) return {
            behavior: "allow",
            updatedInput: _
        };
        if (K.name === xq || K.name === a5 || K.name === T9) return {
            behavior: "allow",
            updatedInput: _
        };
        if (K.name === S7) {
            let z = K.inputSchema.safeParse(_);
            if (z.success) {
                if (K.isReadOnly(z.data)) return {
                    behavior: "allow",
                    updatedInput: _
                };
                let Y = z.data.command;
                if (typeof Y === "string" && await eJY(Y)) return {
                    behavior: "allow",
                    updatedInput: _
                }
            }
            return ed8(K, `Only read-only shell commands and rm with all paths inside ${q} are permitted in this context (ls, find, grep, cat, stat, wc, head, tail, and similar)`)
        }
        if ((K.name === J4 || K.name === IK) && "file_path" in _) {
            if (K.name === J4 && wH()) return ed8(K, `${J4} is not permitted in tiny memory mode — memories are immutable, so delete via Bash rm and rewrite via ${IK}.`);
            let z = _.file_path;
            if (typeof z === "string" && YR(z)) return {
                behavior: "allow",
                updatedInput: _
            }
        }
        return ed8(K, `only ${xq}, ${a5}, ${T9}, read-only ${S7}, and ${J4}/${IK} within ${q} are allowed`)
    }
}
// @from(Ln 396851, Col 0)
function ykK(q) {
    if (q.type !== "tool_use" || q.name !== J4 && q.name !== IK) return;
    let K = q.input;
    if (typeof K === "object" && K !== null && "file_path" in K) {
        let _ = K.file_path;
        return typeof _ === "string" ? _ : void 0
    }
    return
}
// @from(Ln 396861, Col 0)
function qXY(q) {
    let K = [];
    for (let _ of q) {
        if (_.type !== "assistant") continue;
        let z = _.message.content;
        if (!Array.isArray(z)) continue;
        for (let Y of z) {
            let A = ykK(Y);
            if (A !== void 0) K.push(A)
        }
    }
    return F4(K)
}
// @from(Ln 396875, Col 0)
function KXY() {
    let q = new Set,
        K, _ = !1,
        z = !1,
        Y = 0,
        A;
    async function O({
        context: $,
        appendSystemMessage: j,
        isTrailingRun: H
    }) {
        let {
            messages: J
        } = $, X = Nw(), M = aJY(J, K);
        if (sJY(J, K)) {
            E("[extractMemories] skipping — conversation already wrote to memory files");
            let f = J.at(-1);
            if (f?.uuid) K = f.uuid;
            d("tengu_extract_memories_skipped_direct_write", {
                message_count: M
            });
            return
        }
        if (!tJY(J, K)) {
            E("[extractMemories] skipping — no user prose since last extraction");
            let f = J.at(-1);
            if (f?.uuid) K = f.uuid;
            d("tengu_extract_memories_skipped_no_prose", {
                message_count: M
            });
            return
        }
        let P = VkK.isTeamMemoryEnabled(),
            W = u8("tengu_bramble_lintel", null) ?? 1,
            D = qc8(X),
            Z = nR($);
        if (!H) {
            if (Y++, Y < W) return
        }
        Y = 0, z = !0;
        let G = Date.now();
        try {
            E(`[extractMemories] starting — ${M} new messages, memoryDir=${X}`);
            let f = e88(await t88(X, F5().signal)),
                v = vkK(M, f, P),
                V = await rP({
                    promptMessages: [t8({
                        content: v
                    })],
                    cacheSafeParams: Z,
                    canUseTool: D,
                    querySource: "extract_memories",
                    forkLabel: "extract_memories",
                    skipTranscript: !0,
                    maxTurns: 5
                }),
                k = J.at(-1);
            if (k?.uuid) K = k.uuid;
            let N = qXY(V.messages),
                R = w7(V.messages, (m) => m.type === "assistant"),
                h = V.totalUsage.input_tokens + V.totalUsage.cache_creation_input_tokens + V.totalUsage.cache_read_input_tokens,
                C = h > 0 ? (V.totalUsage.cache_read_input_tokens / h * 100).toFixed(1) : "0.0";
            if (E(`[extractMemories] finished — ${N.length} files written, cache: read=${V.totalUsage.cache_read_input_tokens} create=${V.totalUsage.cache_creation_input_tokens} input=${V.totalUsage.input_tokens} (${C}% hit)`), N.length > 0) E(`[extractMemories] memories saved: ${N.join(", ")}`);
            else E("[extractMemories] no memories saved this run");
            let x = N.filter((m) => oJY(m) !== YW),
                B = w7(x, VkK.isTeamMemPath);
            if (d("tengu_extract_memories_extraction", {
                    input_tokens: V.totalUsage.input_tokens,
                    output_tokens: V.totalUsage.output_tokens,
                    cache_read_input_tokens: V.totalUsage.cache_read_input_tokens,
                    cache_creation_input_tokens: V.totalUsage.cache_creation_input_tokens,
                    message_count: M,
                    turn_count: R,
                    files_written: N.length,
                    memories_saved: x.length,
                    team_memories_saved: B,
                    duration_ms: Date.now() - G
                }), E(`[extractMemories] writtenPaths=${N.length} memoryPaths=${x.length} appendSystemMessage defined=${j!=null}`), x.length > 0) {
                let m = _c8(x);
                m.teamCount = B, j?.(m)
            }
        } catch (f) {
            E(`[extractMemories] error: ${f}`), d("tengu_extract_memories_error", {
                duration_ms: Date.now() - G
            })
        } finally {
            z = !1;
            let f = A;
            if (A = void 0, f && W <= 1) E("[extractMemories] running trailing extraction for stashed context"), await O({
                context: f.context,
                appendSystemMessage: f.appendSystemMessage,
                isTrailingRun: !0
            })
        }
    }
    async function w($, j) {
        if ($.toolUseContext.agentId) return;
        if (!u8("tengu_passport_quail", !1)) return;
        if (!x3()) return;
        if (nK()) return;
        if (z) {
            E("[extractMemories] extraction in progress — stashing for trailing run"), d("tengu_extract_memories_coalesced", {}), A = {
                context: $,
                appendSystemMessage: j
            };
            return
        }
        await O({
            context: $,
            appendSystemMessage: j
        })
    }
    LkK = async ($, j) => {
        let H = w($, j);
        q.add(H);
        try {
            await H
        } finally {
            q.delete(H)
        }
    }, hkK = async ($ = 60000) => {
        if (q.size === 0) return;
        await Promise.race([Promise.all(q).catch(() => {}), new Promise((j) => setTimeout(j, $).unref())])
    }
}
// @from(Ln 397000, Col 0)
async function _XY(q, K) {
    await LkK?.(q, K)
}
// @from(Ln 397003, Col 0)
async function zXY(q) {
    await hkK(q)
}
// @from(Ln 397006, Col 4)
VkK
// @from(Ln 397006, Col 9)
kkK = 3
// @from(Ln 397007, Col 4)
LkK = null
// @from(Ln 397008, Col 4)
hkK = async () => {}
// @from(Ln 397009, Col 4)
M38 = L(() => {
    y8();
    Hi1();
    VY();
    Rz();
    u$();
    jJ();
    EP();
    x$();
    Wy6();
    K8();
    lf();
    _7();
    B1();
    C8();
    q2();
    TkK();
    VkK = (ev(), B7(Tp))
})
// @from(Ln 397029, Col 0)
function AXY() {
    return !1
}
// @from(Ln 397033, Col 0)
function RkK() {
    if (!AXY()) return "";
    return `
${OXY.join(`
`)}
`
}
// @from(Ln 397040, Col 4)
OXY
// @from(Ln 397041, Col 4)
SkK = L(() => {
    B1();
    OXY = []
})
// @from(Ln 397046, Col 0)
function P38(q, K, _, z = !1) {
    return `# Dream: Memory Consolidation

You are performing a dream — a reflective pass over your memory files. Synthesize what you've learned recently into durable, well-organized memories so that future sessions can orient quickly.

Memory directory: \`${q}\`
${FM6}

Session transcripts: \`${K}\` (large JSONL files — grep narrowly, don't read whole files)
${z?`
${wXY}
`:""}
---

## Phase 1 — Orient

- \`ls\` the memory directory to see what already exists
- Read \`${YW}\` to understand the current index
- Skim existing topic files so you improve them rather than creating duplicates
- If \`logs/\` or \`sessions/\` subdirectories exist (assistant-mode layout), review recent entries there

## Phase 2 — Gather recent signal

Look for new information worth persisting. Sources in rough priority order:

1. **Daily logs** (\`logs/YYYY/MM/YYYY-MM-DD.md\`) if present — these are the append-only stream
2. **Existing memories that drifted** — facts that contradict something you see in the codebase now
3. **Transcript search** — if you need specific context (e.g., "what was the error message from yesterday's build failure?"), grep the JSONL transcripts for narrow terms:
   \`grep -rn "<narrow term>" ${K}/ --include="*.jsonl" | tail -50\`

Don't exhaustively read transcripts. Look only for things you already suspect matter.
${RkK()}
## Phase 3 — Consolidate

For each thing worth remembering, write or update a memory file at the top level of the memory directory. Use the memory file format and type conventions from your system prompt's auto-memory section — it's the source of truth for what to save, how to structure it, and what NOT to save.

Focus on:
- Merging new signal into existing topic files rather than creating near-duplicates
- Converting relative dates ("yesterday", "last week") to absolute dates so they remain interpretable after time passes
- Deleting contradicted facts — if today's investigation disproves an old memory, fix it at the source

## Phase 4 — Prune and index

Update \`${YW}\` so it stays under ${Ve} lines AND under ~25KB. It's an **index**, not a dump — each entry should be one line under ~150 characters: \`- [Title](file.md) — one-line hook\`. Never write memory content directly into it.

- Remove pointers to memories that are now stale, wrong, or superseded
- Demote verbose entries: if an index line is over ~200 chars, it's carrying content that belongs in the topic file — shorten the line, move the detail
- Add pointers to newly important memories
- Resolve contradictions — if two files disagree, fix the wrong one

---

Return a brief summary of what you consolidated, updated, or pruned. If nothing changed (memories are already tight), say so.${_?`

## Additional context

${_}`:""}`
}
// @from(Ln 397104, Col 4)
wXY = "## Team memory (`team/` subdirectory)\n\nThe `team/` subdirectory holds memories shared across everyone working in this repo. Other teammates' Claude sessions write here too — treat it differently from your personal files:\n\n- **Phase 1:** `ls team/` and skim it alongside your personal files. A teammate may have already captured something you'd otherwise duplicate.\n- **Phase 3:** Merge near-duplicates *within* `team/` the same way you would personal memories. If a personal memory restates a team memory, delete the personal one.\n- **Phase 4 — be conservative pruning `team/`:**\n  - DO delete or fix a team memory that is clearly contradicted by the current code, or that a newer team memory marks as superseded.\n  - DO NOT delete a team memory just because you don't recognize it or it isn't relevant to *your* recent sessions — a teammate may rely on it.\n  - When unsure, leave it. A stale team memory costs little; deleting a teammate's load-bearing note costs a lot.\n\nDo not promote personal memories into `team/` during a dream — that's a deliberate choice the user makes via `/remember`, not something to do reflexively."
// @from(Ln 397105, Col 4)
X97 = L(() => {
    SkK()
})
// @from(Ln 397109, Col 0)
function HXY() {
    let q = u8("tengu_onyx_plover", null);
    return {
        minHours: typeof q?.minHours === "number" && Number.isFinite(q.minHours) && q.minHours > 0 ? q.minHours : CkK.minHours,
        minSessions: typeof q?.minSessions === "number" && Number.isFinite(q.minSessions) && q.minSessions > 0 ? q.minSessions : CkK.minSessions
    }
}
// @from(Ln 397117, Col 0)
function JXY() {
    if (aG()) return !1;
    if (nK()) return !1;
    if (!x3()) return !1;
    return X38()
}
// @from(Ln 397124, Col 0)
function XXY() {
    return !1
}
// @from(Ln 397128, Col 0)
function IkK() {
    let q = 0;
    bkK = async function(_, z) {
        let Y = HXY(),
            A = XXY();
        if (!A && !JXY()) return;
        let O;
        try {
            O = await UQ8()
        } catch (Z) {
            E(`[autoDream] readLastConsolidatedAt failed: ${b6(Z)}`);
            return
        }
        let w = (Date.now() - O) / 3600000;
        if (!A && w < Y.minHours) return;
        let $ = Date.now() - q;
        if (!A && $ < jXY) {
            E(`[autoDream] scan throttle — time-gate passed but last scan was ${Math.round($/1000)}s ago`);
            return
        }
        q = Date.now();
        let j;
        try {
            j = await KfK(O)
        } catch (Z) {
            E(`[autoDream] listSessionsTouchedSince failed: ${b6(Z)}`);
            return
        }
        let H = I8();
        if (j = j.filter((Z) => Z !== H), !A && j.length < Y.minSessions) {
            E(`[autoDream] skip — ${j.length} sessions since last consolidation, need ${Y.minSessions}`), d("tengu_auto_dream_skipped", {
                reason: "sessions",
                session_count: j.length,
                min_required: Y.minSessions
            });
            return
        }
        let J;
        if (A) J = O;
        else {
            try {
                J = await qfK()
            } catch (Z) {
                E(`[autoDream] lock acquire failed: ${b6(Z)}`);
                return
            }
            if (J === null) {
                d("tengu_auto_dream_skipped", {
                    reason: "lock"
                });
                return
            }
        }
        let X = $XY?.isTeamMemoryEnabled() ?? !1;
        E(`[autoDream] firing — ${w.toFixed(1)}h since last, ${j.length} sessions to review`), d("tengu_auto_dream_fired", {
            hours_since: Math.round(w),
            sessions_since: j.length,
            team_memory_enabled: X
        });
        let {
            taskRegistry: M
        } = _.toolUseContext, P = new AbortController, W = zfK(M, {
            sessionsReviewing: j.length,
            priorMtime: J,
            abortController: P
        }), D = "fork";
        try {
            let Z = Nw(),
                G = e2(Y7()),
                f = wH(),
                v = f ? `

**Tool constraints for this run:** Bash is restricted to read-only commands (\`ls\`, \`find\`, \`grep\`, \`cat\`, \`stat\`, \`wc\`, \`head\`, \`tail\`, and similar) plus \`rm\` for \`.md\` paths inside the memory directory. ${J4} is not permitted — memories are immutable, so use rm + ${IK} to replace, never edit in place. Plan your exploration with this in mind — no need to probe.` : `

**Tool constraints for this run:** Bash is restricted to read-only commands (\`ls\`, \`find\`, \`grep\`, \`cat\`, \`stat\`, \`wc\`, \`head\`, \`tail\`, and similar) plus \`rm\` for \`.md\` paths inside the memory directory. Anything else that writes, redirects to a file, or modifies state will be denied. Plan your exploration with this in mind — no need to probe.

Sessions since last consolidation (${j.length}):
${j.map((B)=>`- ${B}`).join(`
`)}`,
                V = f ? fkK(Z, v, X) : P38(Z, G, v, X),
                k = !1,
                N = null,
                R = await rP({
                    promptMessages: [t8({
                        content: V
                    })],
                    cacheSafeParams: nR(_),
                    canUseTool: qc8(Z),
                    querySource: "auto_dream",
                    forkLabel: "auto_dream",
                    skipTranscript: !0,
                    overrides: {
                        abortController: P
                    },
                    onMessage: MXY(W, M)
                });
            D = "completion", AfK(W, M);
            let h = _.toolUseContext.getAppState().tasks?.[W],
                C = m57(h) ? h.filesTouched.length : 0;
            if (z && m57(h) && h.filesTouched.length > 0) z({
                ..._c8(h.filesTouched),
                verb: "Improved"
            });
            E(`[autoDream] completed — cache: read=${R.totalUsage.cache_read_input_tokens} created=${R.totalUsage.cache_creation_input_tokens}`);
            let x = null;
            d("tengu_auto_dream_completed", {
                cache_read: R.totalUsage.cache_read_input_tokens,
                cache_created: R.totalUsage.cache_creation_input_tokens,
                output: R.totalUsage.output_tokens,
                sessions_reviewed: j.length,
                files_touched_count: C,
                team_memory_enabled: X,
                ...x
            })
        } catch (Z) {
            if (P.signal.aborted) {
                E("[autoDream] aborted by user");
                return
            }
            if (E(`[autoDream] ${D} failed: ${b6(Z)}`), d("tengu_auto_dream_failed", {
                    phase: D,
                    error_class: r1(Z).name
                }), D === "fork") OfK(W, M), await QQ8(J)
        }
    }
}
// @from(Ln 397255, Col 0)
function MXY(q, K) {
    return (_) => {
        if (_.type !== "assistant") return;
        let z = "",
            Y = 0,
            A = [];
        for (let O of _.message.content)
            if (O.type === "text") z += O.text;
            else if (O.type === "tool_use") {
            if (Y++, O.name === J4 || O.name === IK) {
                let w = O.input;
                if (typeof w.file_path === "string") A.push(w.file_path)
            } else if (O.name === S7) {
                let w = O.input;
                if (typeof w.command === "string" && /^\s*rm\b/.test(w.command))
                    for (let $ of w.command.matchAll(/\/\S+\.md\b/g)) A.push($[0])
            }
        }
        YfK(q, {
            text: z.trim(),
            toolUseCount: Y
        }, A, K)
    }
}
// @from(Ln 397279, Col 0)
async function xkK(q, K) {
    await bkK?.(q, K)
}
// @from(Ln 397282, Col 4)
$XY
// @from(Ln 397282, Col 9)
jXY = 600000
// @from(Ln 397283, Col 4)
CkK
// @from(Ln 397283, Col 9)
bkK = null
// @from(Ln 397284, Col 4)
P97 = L(() => {
    lf();
    _7();
    K8();
    m8();
    C8();
    B1();
    VY();
    w97();
    j97();
    g4();
    y8();
    M38();
    X97();
    F58();
    cQ8();
    u$();
    $XY = (ev(), B7(Tp)), CkK = {
        minHours: 24,
        minSessions: 5
    }
})
// @from(Ln 397306, Col 0)
async function* ukK(q, K, _, z, Y, A, O, w, $) {
    let j = Date.now(),
        H = {
            messages: [...q, ...K],
            systemPrompt: _,
            userContext: z,
            systemContext: Y,
            toolUseContext: A,
            querySource: O
        };
    if (O.startsWith("repl_main_thread") || O === "sdk") RI4(nR(H));
    if (!S9()) {
        if (!c5(process.env.CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION)) Lc4(H);
        if (!A.agentId && Lk8()) PXY.executeExtractMemories(H, A.appendSystemMessage);
        if (!A.agentId) xkK(H, A.appendSystemMessage)
    }
    if (!A.agentId) await i18(A).catch(() => {});
    let J = null;
    if (O.startsWith("repl_main_thread") && WXY?.isBriefEnabled() && ke && !A.agentId && A.options.tools.some((X) => e3(X, ke.BRIEF_TOOL_NAME))) try {
        let X = q.findLastIndex((Z) => Z.type === "user" && !Z.isMeta && !Z.toolUseResult),
            M = q.slice(X + 1),
            W = M.some((Z) => Z.type === "assistant" && Z.message.content.some((G) => G.type === "tool_use" && (G.name === ke.BRIEF_TOOL_NAME || G.name === ke.LEGACY_BRIEF_TOOL_NAME))) || K.some((Z) => Z.message.content.some((G) => G.type === "tool_use" && (G.name === ke.BRIEF_TOOL_NAME || G.name === ke.LEGACY_BRIEF_TOOL_NAME))),
            D = !W && M.some((Z) => Z.type === "user" && Z.isMeta && typeof Z.message.content === "string" && Z.message.content.includes(ke.BRIEF_ENFORCE_SENTINEL));
        if (!W && !D) J = t8({
            content: zc8({
                blockingError: `You ended the turn without calling ${ke.BRIEF_TOOL_NAME}. ${ke.BRIEF_ENFORCE_SENTINEL}`,
                command: "brief-mode-enforce"
            }),
            isMeta: !0
        }), yield J
    } catch (X) {
        E(`Brief mode enforcement failed: ${b6(X)}`, {
            level: "error"
        })
    }
    try {
        let X = [];
        if (J) X.push(J);
        let P = A.getAppState().toolPermissionContext.mode,
            W = w_6(P, A.abortController.signal, void 0, w ?? !1, A.agentId, A, H.messages, A.agentType),
            D = "",
            Z = 0,
            G = !1,
            f = "",
            v = !1,
            V = [],
            k = [];
        for await (let N of W) {
            if (N.message) {
                if (yield N.message, N.message.type === "progress" && N.message.toolUseID) {
                    D = N.message.toolUseID, Z++;
                    let R = N.message.data;
                    if (R.command) k.push({
                        command: R.command,
                        promptText: R.promptText
                    })
                }
                if (N.message.type === "attachment") {
                    let R = N.message.attachment;
                    if ("hookEvent" in R && (R.hookEvent === "Stop" || R.hookEvent === "SubagentStop")) {
                        if (R.type === "hook_non_blocking_error") V.push(R.stderr || `Exit code ${R.exitCode}`), v = !0;
                        else if (R.type === "hook_error_during_execution") V.push(R.content), v = !0;
                        else if (R.type === "hook_success") {
                            if (R.stdout && R.stdout.trim() || R.stderr && R.stderr.trim()) v = !0
                        }
                        if ("durationMs" in R && "command" in R) {
                            let h = k.find((C) => C.command === R.command && C.durationMs === void 0);
                            if (h) h.durationMs = R.durationMs
                        }
                    }
                }
            }
            if (N.blockingError) {
                let R = t8({
                    content: zc8(N.blockingError),
                    isMeta: !0
                });
                X.push(R), yield R, v = !0, V.push(N.blockingError.blockingError)
            }
            if (N.preventContinuation) G = !0, f = N.stopReason || "Stop hook prevented continuation", yield Y4({
                type: "hook_stopped_continuation",
                message: f,
                hookName: "Stop",
                toolUseID: D,
                hookEvent: "Stop"
            });
            if (A.abortController.signal.aborted) return d("tengu_pre_stop_hooks_cancelled", {
                queryChainId: A.queryTracking?.chainId,
                queryDepth: A.queryTracking?.depth
            }), yield _e({
                toolUse: !1
            }), {
                blockingErrors: [],
                preventContinuation: !0
            }
        }
        if (Z > 0) {
            if (yield BkK(Z, k, V, G, f, v, "suggestion", D), V.length > 0) {
                let N = WJ("app:toggleTranscript", "Global", "ctrl+o");
                if (A.addNotification?.({
                        key: "stop-hook-error",
                        text: `Stop hook error occurred · ${N} to see`,
                        priority: "immediate"
                    }), !w) sv({
                    type: "system",
                    subtype: "notification",
                    key: "stop-hook-error",
                    text: "Stop hook error occurred",
                    priority: "immediate"
                })
            }
        }
        if (G) return {
            blockingErrors: [],
            preventContinuation: !0
        };
        if (X.length > 0) return {
            blockingErrors: X,
            preventContinuation: !1
        };
        if (Lz()) {
            let N = T_() ?? "",
                R = Z9() ?? "",
                h = [],
                C = !1,
                x, B = "",
                m = AT(),
                F = (await Qf(m)).filter((g) => g.status === "in_progress" && g.owner === N);
            for (let g of F) {
                let c = CM6(g.id, g.subject, g.description, N, R, P, A.abortController.signal, void 0, A);
                for await (let n of c) {
                    if (n.message) {
                        if (n.message.type === "progress" && n.message.toolUseID) B = n.message.toolUseID;
                        yield n.message
                    }
                    if (n.blockingError) {
                        let l = t8({
                            content: q38(n.blockingError),
                            isMeta: !0
                        });
                        h.push(l), yield l
                    }
                    if (n.preventContinuation) C = !0, x = n.stopReason || "TaskCompleted hook prevented continuation", yield Y4({
                        type: "hook_stopped_continuation",
                        message: x,
                        hookName: "TaskCompleted",
                        toolUseID: B,
                        hookEvent: "TaskCompleted"
                    });
                    if (A.abortController.signal.aborted) return {
                        blockingErrors: [],
                        preventContinuation: !0
                    }
                }
            }
            let U = W38(N, R, P, A.abortController.signal);
            for await (let g of U) {
                if (g.message) {
                    if (g.message.type === "progress" && g.message.toolUseID) B = g.message.toolUseID;
                    yield g.message
                }
                if (g.blockingError) {
                    let c = t8({
                        content: W97(g.blockingError),
                        isMeta: !0
                    });
                    h.push(c), yield c
                }
                if (g.preventContinuation) C = !0, x = g.stopReason || "TeammateIdle hook prevented continuation", yield Y4({
                    type: "hook_stopped_continuation",
                    message: x,
                    hookName: "TeammateIdle",
                    toolUseID: B,
                    hookEvent: "TeammateIdle"
                });
                if (A.abortController.signal.aborted) return {
                    blockingErrors: [],
                    preventContinuation: !0
                }
            }
            if (C) return {
                blockingErrors: [],
                preventContinuation: !0
            };
            if (h.length > 0) return {
                blockingErrors: h,
                preventContinuation: !1
            }
        }
        return {
            blockingErrors: [],
            preventContinuation: !1
        }
    } catch (X) {
        let M = Date.now() - j;
        return d("tengu_stop_hook_error", {
            duration: M,
            queryChainId: A.queryTracking?.chainId,
            queryDepth: A.queryTracking?.depth
        }), yield eO(`Stop hook failed: ${b6(X)}`, "warning"), {
            blockingErrors: J ? [J] : [],
            preventContinuation: !1
        }
    }
}
// @from(Ln 397511, Col 4)
PXY
// @from(Ln 397511, Col 9)
WXY
// @from(Ln 397511, Col 14)
ke
// @from(Ln 397512, Col 4)
mkK = L(() => {
    zp();
    VY();
    C8();
    $T();
    gq();
    ZM();
    lr1();
    K8();
    m8();
    K9();
    _7();
    BP();
    PX();
    zY();
    y8();
    B1();
    P97();
    LJ6();
    wf();
    Q8();
    lf();
    PXY = (M38(), B7(Kc8)), WXY = (rF(), B7(Xe)), ke = (vh(), B7(TU))
})
// @from(Ln 397537, Col 0)
function pkK() {
    return {
        sessionId: I8(),
        gates: {
            streamingToolExecution: Tw("tengu_streaming_tool_execution2"),
            emitToolUseSummaries: S6(process.env.CLAUDE_CODE_EMIT_TOOL_USE_SUMMARIES),
            isAnt: !1,
            fastModeEnabled: !S6(process.env.CLAUDE_CODE_DISABLE_FAST_MODE)
        }
    }
}
// @from(Ln 397548, Col 4)
FkK = L(() => {
    y8();
    B1();
    Q8()
})
// @from(Ln 397557, Col 0)
function gkK() {
    return {
        callModel: eb6,
        microcompact: _c,
        autocompact: QkK,
        uuid: DXY
    }
}
// @from(Ln 397565, Col 4)
UkK = L(() => {
    O2();
    rR();
    $y()
})
// @from(Ln 397570, Col 4)
ZXY
// @from(Ln 397570, Col 9)
Z_$
// @from(Ln 397571, Col 4)
Yc8 = L(() => {
    IZ();
    ZXY = /\b(?:use|spend)\s+(\d+(?:\.\d+)?)\s*(k|m|b)\s*tokens?\b/i, Z_$ = new RegExp(ZXY.source, "gi")
})
// @from(Ln 397575, Col 4)
dkK = L(() => {
    Yc8()
})
// @from(Ln 397579, Col 0)
function* lkK(q, K) {
    for (let _ of q) {
        let z = _.message.content.filter((Y) => Y.type === "tool_use");
        for (let Y of z) yield t8({
            content: [{
                type: "tool_result",
                content: K,
                is_error: !0,
                tool_use_id: Y.id
            }],
            toolUseResult: K,
            sourceToolAssistantUUID: _.uuid
        })
    }
}
// @from(Ln 397595, Col 0)
function nkK(q) {
    return q?.type === "assistant" && q.apiError === "max_output_tokens"
}
// @from(Ln 397598, Col 0)
async function* yy(q) {
    let K = [],
        _ = yield* vXY(q, K);
    for (let z of K) q.toolUseContext.onCommandLifecycle?.(z, "completed");
    return _
}
// @from(Ln 397604, Col 0)
async function* vXY(q, K) {
    let D = [];
    try {
        let {
            systemPrompt: _,
            userContext: z,
            systemContext: Y,
            canUseTool: A,
            fallbackModel: O,
            querySource: w,
            maxTurns: $,
            skipCacheWrite: j
        } = q;
        let H = q.deps ?? gkK();
        let J = {
            messages: q.messages,
            toolUseContext: q.toolUseContext,
            maxOutputTokensOverride: q.maxOutputTokensOverride,
            autoCompactTracking: void 0,
            stopHookActive: q.stopHookActive,
            maxOutputTokensRecoveryCount: 0,
            hasAttemptedReactiveCompact: !1,
            turnCount: 1,
            pendingToolUseSummary: void 0,
            transition: void 0
        };
        let X = null;
        let M = void 0;
        let P = pkK();
        const W = rz(D, ikK(J.messages, J.toolUseContext, w), 0);
        while (!0) {
            let {
                toolUseContext: v
            } = J, {
                messages: V,
                autoCompactTracking: k,
                maxOutputTokensRecoveryCount: N,
                hasAttemptedReactiveCompact: R,
                maxOutputTokensOverride: h,
                pendingToolUseSummary: C,
                stopHookActive: x,
                turnCount: B
            } = J, m = D97?.startSkillDiscoveryPrefetch(null, V, v);
            if (yield {
                    type: "stream_request_start"
                }, Y9("query_fn_entry"), !v.agentId) GM("query_started");
            let S = v.queryTracking ? {
                    chainId: v.queryTracking.chainId,
                    depth: v.queryTracking.depth + 1
                } : {
                    chainId: H.uuid(),
                    depth: 0
                },
                F = S.chainId;
            v = {
                ...v,
                queryTracking: S
            };
            let U = [...H2(V)],
                g = k,
                c = w.startsWith("agent:") || w.startsWith("repl_main_thread");
            U = await FZ4(U, v.contentReplacementState, c ? (a6) => void dM6(a6, v.agentId).catch(j6) : void 0, new Set(v.options.tools.filter((a6) => !Number.isFinite(a6.maxResultSizeChars)).map((a6) => a6.name)));
            let n = 0;
            Y9("query_microcompact_start"), U = (await H.microcompact(U, v, w)).messages;
            let z6 = void 0;
            Y9("query_microcompact_end");
            let A6 = sK(skK(_, Y));
            Y9("query_autocompact_start");
            let {
                compactionResult: e,
                consecutiveFailures: i,
                consecutiveRapidRefills: O6,
                rapidRefillBreakerTripped: J6
            } = await H.autocompact(U, v, {
                systemPrompt: _,
                userContext: z,
                systemContext: Y,
                toolUseContext: v,
                forkContextMessages: U
            }, w, g, n);
            if (Y9("query_autocompact_end"), J6) return d("tengu_auto_compact_rapid_refill_breaker", {
                consecutiveRapidRefills: g?.consecutiveRapidRefills ?? 0,
                turnsSincePreviousCompact: g?.turnCounter ?? -1,
                queryChainId: F,
                queryDepth: S.depth
            }), yield _9({
                content: okK,
                error: "invalid_request"
            }), {
                reason: "rapid_refill_breaker"
            };
            if (e) {
                let {
                    preCompactTokenCount: a6,
                    postCompactTokenCount: D8,
                    truePostCompactTokenCount: Q6,
                    compactionUsage: W8
                } = e;
                if (d("tengu_auto_compact_succeeded", {
                        originalMessageCount: V.length,
                        compactedMessageCount: e.summaryMessages.length + e.attachments.length + e.hookResults.length,
                        preCompactTokenCount: a6,
                        postCompactTokenCount: D8,
                        truePostCompactTokenCount: Q6,
                        compactionInputTokens: W8?.input_tokens,
                        compactionOutputTokens: W8?.output_tokens,
                        compactionCacheReadTokens: W8?.cache_read_input_tokens ?? 0,
                        compactionCacheCreationTokens: W8?.cache_creation_input_tokens ?? 0,
                        compactionTotalTokens: W8 ? W8.input_tokens + (W8.cache_creation_input_tokens ?? 0) + (W8.cache_read_input_tokens ?? 0) + W8.output_tokens : 0,
                        queryChainId: F,
                        queryDepth: S.depth
                    }), q.taskBudget) {
                    let s6 = jS8(U);
                    M = Math.max(0, (M ?? q.taskBudget.total) - s6)
                }
                g = {
                    compacted: !0,
                    turnId: H.uuid(),
                    turnCounter: 0,
                    consecutiveFailures: 0,
                    consecutiveRapidRefills: O6
                };
                let G8 = Yt(e);
                for (let s6 of G8) yield s6;
                U = G8
            } else if (i !== void 0) g = {
                ...g ?? {
                    compacted: !1,
                    turnId: "",
                    turnCounter: 0
                },
                consecutiveFailures: i
            };
            v = {
                ...v,
                messages: U,
                turnStartIndex: TXY(U)
            };
            let $6 = [],
                H6 = [],
                q6 = [],
                o = !1,
                _6 = null;
            Y9("query_setup_start");
            let t = P.gates.streamingToolExecution ? new j38(v.options.tools, A, v) : null,
                Y6 = v.getAppState(),
                X6 = Y6.toolPermissionContext.mode,
                M6 = HB({
                    permissionMode: X6,
                    mainLoopModel: v.options.mainLoopModel,
                    exceeds200kTokens: X6 === "plan" && le6(U)
                });
            Y9("query_setup_end");
            let W6 = P.gates.isAnt ? wu4(v.agentId ?? P.sessionId) : void 0,
                V6 = !1,
                f6 = bx(),
                G6 = bx() && z0() && !Z38(v.options.mainLoopModel, v.getAppState().autoCompactWindow);
            if (!e && w !== "compact" && w !== "session_memory" && !G6 && !V6) {
                let {
                    isAtBlockingLimit: a6
                } = UM6(vJ(U) - n, v.options.mainLoopModel, v.getAppState().autoCompactWindow);
                if (a6) return yield _9({
                    content: cI,
                    error: "invalid_request"
                }), {
                    reason: "blocking_limit"
                }
            }
            let k6 = !0;
            Y9("query_api_loop_start");
            try {
                while (k6) {
                    k6 = !1;
                    try {
                        let a6 = !1,
                            D8 = [];
                        Y9("query_api_streaming_start");
                        for await (let Q6 of H.callModel({
                            messages: Ac8(U, z),
                            systemPrompt: A6,
                            thinkingConfig: v.options.thinkingConfig,
                            tools: v.options.tools,
                            signal: v.abortController.signal,
                            options: {
                                async getToolPermissionContext() {
                                    return v.getAppState().toolPermissionContext
                                },
                                model: M6,
                                ...P.gates.fastModeEnabled && {
                                    fastMode: Y6.fastMode
                                },
                                toolChoice: void 0,
                                isNonInteractiveSession: v.options.isNonInteractiveSession,
                                fallbackModel: O,
                                onStreamingFallback: () => {
                                    a6 = !0
                                },
                                onHintCleared: (W8) => {
                                    v.applyHintClears?.(W8), U = tR8(U, W8)
                                },
                                querySource: w,
                                agents: v.options.agentDefinitions.activeAgents,
                                allowedAgentTypes: v.options.agentDefinitions.allowedAgentTypes,
                                hasAppendSystemPrompt: !!v.options.appendSystemPrompt,
                                maxOutputTokensOverride: h,
                                fetchOverride: W6,
                                mcpTools: Y6.mcp.tools,
                                hasPendingMcpServers: Y6.mcp.clients.some((W8) => W8.type === "pending"),
                                queryTracking: S,
                                effortValue: Y6.effortValue,
                                advisorModel: Y6.advisorModel,
                                skipCacheWrite: j,
                                agentId: v.agentId,
                                addNotification: v.addNotification,
                                ...q.taskBudget && {
                                    taskBudget: {
                                        total: q.taskBudget.total,
                                        ...M !== void 0 && {
                                            remaining: M
                                        }
                                    }
                                }
                            }
                        })) {
                            if (a6) {
                                for (let s6 of $6) yield {
                                    type: "tombstone",
                                    message: s6
                                };
                                if (d("tengu_orphaned_messages_tombstoned", {
                                        orphanedMessageCount: $6.length,
                                        queryChainId: F,
                                        queryDepth: S.depth
                                    }), $6.length = 0, H6.length = 0, q6.length = 0, D8.length = 0, o = !1, t) t.discard(), t = new j38(v.options.tools, A, v)
                            }
                            let W8 = Q6;
                            if (Q6.type === "assistant") {
                                let s6;
                                for (let u6 = 0; u6 < Q6.message.content.length; u6++) {
                                    let h6 = Q6.message.content[u6];
                                    if (h6.type === "tool_use" && typeof h6.input === "object" && h6.input !== null) {
                                        let _8 = rK(v.options.tools, h6.name);
                                        if (_8?.backfillObservableInput) {
                                            let R8 = h6.input,
                                                x6 = {
                                                    ...R8
                                                };
                                            if (_8.backfillObservableInput(x6), Object.keys(x6).some((v8) => !(v8 in R8))) s6 ??= [...Q6.message.content], s6[u6] = {
                                                ...h6,
                                                input: x6
                                            }
                                        }
                                    }
                                }
                                if (s6) W8 = {
                                    ...Q6,
                                    message: {
                                        ...Q6.message,
                                        content: s6
                                    }
                                }, D8.push({
                                    src: Q6.message,
                                    dst: W8.message
                                })
                            }
                            if (Q6.type === "stream_event" && Q6.event.type === "message_delta") {
                                _6 = Q6.event.delta.stop_reason;
                                for (let {
                                        src: s6,
                                        dst: u6
                                    }
                                    of D8) u6.usage = s6.usage, u6.stop_reason = s6.stop_reason;
                                D8.length = 0
                            }
                            let G8 = !1;
                            if (tI4(Q6)) G8 = !0;
                            if (f6 && Wr1(Q6)) G8 = !0;
                            if (nkK(Q6)) G8 = !0;
                            if (!G8) yield W8;
                            if (Q6.type === "assistant") {
                                $6.push(Q6);
                                let s6 = Q6.message.content.filter((u6) => u6.type === "tool_use");
                                if (s6.length > 0) q6.push(...s6), o = !0;
                                if (t && !v.abortController.signal.aborted)
                                    for (let u6 of s6) t.addTool(u6, Q6)
                            }
                            if (t && !v.abortController.signal.aborted) {
                                for (let s6 of t.getCompletedResults())
                                    if (s6.message) {
                                        if (yield s6.message, !D38(s6.message)) {
                                            let u6 = K0([s6.message], v.options.tools);
                                            Rt6(u6, vO(v.options.mainLoopModel).maxBase64Size), H6.push(...u6.filter((h6) => h6.type === "user"))
                                        }
                                    }
                            }
                        }
                        Y9("query_api_streaming_end")
                    } catch (a6) {
                        if (a6 instanceof QM6 && O) {
                            M6 = O, k6 = !0;
                            for (let D8 of $6) yield {
                                type: "tombstone",
                                message: D8
                            };
                            if ($6.length = 0, H6.length = 0, q6.length = 0, o = !1, t) t.discard(), t = new j38(v.options.tools, A, v);
                            v.options.mainLoopModel = O, d("tengu_model_fallback_triggered", {
                                original_model: a6.originalModel,
                                fallback_model: O,
                                entrypoint: "cli",
                                queryChainId: F,
                                queryDepth: S.depth
                            }), yield eO(`Switched to ${YJ(a6.fallbackModel)} due to high demand for ${YJ(a6.originalModel)}`, "warning");
                            continue
                        }
                        throw a6
                    }
                }
            } catch (a6) {
                j6(a6);
                let D8 = a6 instanceof Error ? a6.message : String(a6);
                if (d("tengu_query_error", {
                        assistantMessages: $6.length,
                        toolUses: $6.flatMap((Q6) => Q6.message.content.filter((W8) => W8.type === "tool_use")).length,
                        queryChainId: F,
                        queryDepth: S.depth
                    }), a6 instanceof Ay6 || a6 instanceof xd) return yield _9({
                    content: a6.message
                }), {
                    reason: "image_error"
                };
                return yield* lkK($6, D8), yield _9({
                    content: D8
                }), Kh("Query error", a6), {
                    reason: "model_error",
                    error: a6
                }
            }
            if ($6.length > 0) zu4([...U, ...$6], _, z, Y, v, w);
            if (v.abortController.signal.aborted) {
                if (t) {
                    for await (let a6 of t.getRemainingResults()) if (a6.message) yield a6.message
                } else yield* lkK($6, "Interrupted by user");
                if (!v.agentId) await i18(v).catch(() => {});
                if (v.abortController.signal.reason !== "interrupt") yield _e({
                    toolUse: !1
                });
                return {
                    reason: "aborted_streaming"
                }
            }
            if (C) {
                let a6 = await C;
                if (a6) yield a6
            }
            if (!o) {
                let a6 = $6.at(-1),
                    D8 = a6?.type === "assistant" && a6.isApiErrorMessage && vj6(a6),
                    Q6 = f6 && Wr1(a6);
                if (D8 || Q6) {
                    let G8 = await eI4({
                        hasAttempted: R,
                        querySource: w,
                        aborted: v.abortController.signal.aborted,
                        messages: U,
                        cacheSafeParams: {
                            systemPrompt: _,
                            userContext: z,
                            systemContext: Y,
                            toolUseContext: v,
                            forkContextMessages: U
                        }
                    });
                    if (G8) {
                        if (q.taskBudget) {
                            let _8 = jS8(U);
                            M = Math.max(0, (M ?? q.taskBudget.total) - _8)
                        }
                        let u6 = Yt(G8);
                        for (let _8 of u6) yield _8;
                        J = {
                            messages: u6,
                            toolUseContext: v,
                            autoCompactTracking: void 0,
                            maxOutputTokensRecoveryCount: N,
                            hasAttemptedReactiveCompact: !0,
                            maxOutputTokensOverride: void 0,
                            pendingToolUseSummary: void 0,
                            stopHookActive: x,
                            turnCount: B,
                            transition: {
                                reason: "reactive_compact_retry"
                            }
                        };
                        continue
                    }
                    let s6 = Q6 ? "image_error" : "prompt_too_long";
                    return d("tengu_ptl_surfaced_to_user", {
                        reason: s6,
                        querySource: w,
                        wasGatedByPriorAttempt: R
                    }), yield a6, gM6(a6, v), {
                        reason: s6
                    }
                }
                if (nkK(a6)) {
                    if (u8("tengu_otk_slot_v1", !1) && h === void 0) {
                        let s6 = v.options.mainLoopModel,
                            u6 = lc(s6);
                        if (u6 > Z97(s6)) {
                            d("tengu_max_tokens_escalate", {
                                escalatedTo: u6
                            }), J = {
                                messages: U,
                                toolUseContext: v,
                                autoCompactTracking: g,
                                maxOutputTokensRecoveryCount: N,
                                hasAttemptedReactiveCompact: R,
                                maxOutputTokensOverride: u6,
                                pendingToolUseSummary: void 0,
                                stopHookActive: x,
                                turnCount: B,
                                transition: {
                                    reason: "max_output_tokens_escalate"
                                }
                            };
                            continue
                        }
                    }
                    if (N < GXY) {
                        let s6 = t8({
                            content: "Output token limit hit. Resume directly — no apology, no recap of what you were doing. " + "Pick up mid-thought if that is where the cut happened. Break remaining work into smaller pieces.",
                            isMeta: !0
                        });
                        J = {
                            messages: [...U, ...$6, s6],
                            toolUseContext: v,
                            autoCompactTracking: g,
                            maxOutputTokensRecoveryCount: N + 1,
                            hasAttemptedReactiveCompact: R,
                            maxOutputTokensOverride: void 0,
                            pendingToolUseSummary: void 0,
                            stopHookActive: x,
                            turnCount: B,
                            transition: {
                                reason: "max_output_tokens_recovery",
                                attempt: N + 1
                            }
                        };
                        continue
                    }
                    yield a6
                }
                if ((a6?.message.stop_reason ?? _6) === "tool_use" && q6.length === 0 && !a6?.isApiErrorMessage) {
                    let G8 = J.transition?.reason !== "malformed_tool_use_retry";
                    if (d("tengu_malformed_tool_use_response", {
                            will_retry: G8,
                            model: M6
                        }), G8) {
                        let u6 = t8({
                            content: "Your tool call was malformed and could not be parsed. Please retry.",
                            isMeta: !0
                        });
                        yield u6, J = {
                            messages: [...U, ...$6, u6],
                            toolUseContext: v,
                            autoCompactTracking: g,
                            maxOutputTokensRecoveryCount: 0,
                            hasAttemptedReactiveCompact: !1,
                            maxOutputTokensOverride: void 0,
                            pendingToolUseSummary: void 0,
                            stopHookActive: x,
                            turnCount: B,
                            transition: {
                                reason: "malformed_tool_use_retry"
                            }
                        };
                        continue
                    }
                    let s6 = _9({
                        content: "The model's tool call could not be parsed (retry also failed)."
                    });
                    return yield s6, gM6(s6, v), {
                        reason: "completed"
                    }
                }
                if (a6?.isApiErrorMessage) return gM6(a6, v), {
                    reason: "completed"
                };
                let W8 = yield* ukK(U, $6, _, z, Y, v, w, x, fXY);
                if (W8.preventContinuation) return {
                    reason: "stop_hook_prevented"
                };
                if (W8.blockingErrors.length > 0) {
                    let G8 = B + 1;
                    if ($ && G8 > $) return yield Y4({
                        type: "max_turns_reached",
                        maxTurns: $,
                        turnCount: G8
                    }), {
                        reason: "max_turns",
                        turnCount: G8
                    };
                    J = {
                        messages: [...U, ...$6, ...W8.blockingErrors],
                        toolUseContext: v,
                        autoCompactTracking: g,
                        maxOutputTokensRecoveryCount: 0,
                        hasAttemptedReactiveCompact: R,
                        maxOutputTokensOverride: void 0,
                        pendingToolUseSummary: void 0,
                        stopHookActive: !0,
                        turnCount: G8,
                        transition: {
                            reason: "stop_hook_blocking"
                        }
                    };
                    continue
                }
                return {
                    reason: "completed"
                }
            }
            let T6 = !1,
                v6 = !1,
                L6 = v;
            if (Y9("query_tool_execution_start"), t) d("tengu_streaming_tool_execution_used", {
                tool_count: q6.length,
                queryChainId: F,
                queryDepth: S.depth
            });
            else d("tengu_streaming_tool_execution_not_used", {
                tool_count: q6.length,
                queryChainId: F,
                queryDepth: S.depth
            });
            let y6 = t ? t.getRemainingResults() : P78(q6, $6, A, v);
            for await (let a6 of y6) {
                if (a6.message) {
                    if (yield a6.message, a6.message.type === "attachment" && a6.message.attachment.type === "hook_stopped_continuation") T6 = !0;
                    if (a6.message.type === "attachment" && a6.message.attachment.type === "hook_deferred_tool") v6 = !0;
                    if (!D38(a6.message)) {
                        let D8 = K0([a6.message], v.options.tools);
                        Rt6(D8, vO(v.options.mainLoopModel).maxBase64Size), H6.push(...D8.filter((Q6) => Q6.type === "user"))
                    }
                }
                if (a6.newContext) L6 = {
                    ...a6.newContext,
                    queryTracking: S
                }
            }
            Y9("query_tool_execution_end");
            let c6;
            if (P.gates.emitToolUseSummaries && q6.length > 0 && !v.abortController.signal.aborted && !v.agentId) {
                let a6 = $6.at(-1),
                    D8;
                if (a6) {
                    let G8 = a6.message.content.filter((s6) => s6.type === "text");
                    if (G8.length > 0) {
                        let s6 = G8.at(-1);
                        if (s6 && "text" in s6) D8 = s6.text
                    }
                }
                let Q6 = q6.map((G8) => G8.id),
                    W8 = q6.map((G8) => {
                        let s6 = H6.find((h6) => h6.type === "user" && Array.isArray(h6.message.content) && h6.message.content.some((_8) => _8.type === "tool_result" && _8.tool_use_id === G8.id)),
                            u6 = s6?.type === "user" && Array.isArray(s6.message.content) ? s6.message.content.find((h6) => h6.type === "tool_result" && h6.tool_use_id === G8.id) : void 0;
                        return {
                            name: G8.name,
                            input: G8.input,
                            output: u6 && "content" in u6 ? u6.content : null
                        }
                    });
                c6 = _x4({
                    tools: W8,
                    signal: v.abortController.signal,
                    isNonInteractiveSession: v.options.isNonInteractiveSession,
                    lastAssistantText: D8
                }).then((G8) => {
                    if (G8) return akK(G8, Q6);
                    return null
                }).catch(() => null)
            }
            if (v.abortController.signal.aborted) {
                if (!v.agentId) await i18(v).catch(() => {});
                if (v.abortController.signal.reason !== "interrupt") yield _e({
                    toolUse: !0
                });
                let a6 = B + 1;
                if ($ && a6 > $) yield Y4({
                    type: "max_turns_reached",
                    maxTurns: $,
                    turnCount: a6
                });
                return {
                    reason: "aborted_tools"
                }
            }
            if (v6) return {
                reason: "tool_deferred"
            };
            if (T6) return {
                reason: "hook_stopped"
            };
            if (g?.compacted) g.turnCounter++, d("tengu_post_autocompact_turn", {
                turnId: g.turnId,
                turnCounter: g.turnCounter,
                queryChainId: F,
                queryDepth: S.depth
            });
            d("tengu_query_before_attachments", {
                messagesForQueryCount: U.length,
                assistantMessagesCount: $6.length,
                toolResultsCount: H6.length,
                queryChainId: F,
                queryDepth: S.depth
            });
            let Z8 = w.startsWith("repl_main_thread") || w === "sdk",
                N8 = v.agentId,
                R6 = AR8("next").filter((a6) => {
                    if (_W4(a6)) return !1;
                    if (Z8) return a6.agentId === void 0;
                    return a6.mode === "task-notification" && a6.agentId === N8
                });
            for await (let a6 of Ob6(null, L6, null, R6, [...U, ...$6, ...H6], w)) yield a6, H6.push(a6);
            let p6 = R6.filter((a6) => a6.mode === "prompt" || a6.mode === "task-notification");
            if (p6.length > 0) {
                for (let a6 of p6)
                    if (a6.uuid) K.push(a6.uuid), v.onCommandLifecycle?.(a6.uuid, "started");
                tP4(p6)
            }
            if (W && W.settledAt !== null && W.consumedOnIteration === -1) {
                let a6 = rkK(await W.promise, v.readFileState);
                for (let D8 of a6) {
                    let Q6 = Y4(D8);
                    yield Q6, H6.push(Q6)
                }
                W.consumedOnIteration = B - 1
            }
            if (D97 && m) {
                let a6 = await D97.collectSkillDiscoveryPrefetch(m);
                for (let D8 of a6) {
                    let Q6 = Y4(D8);
                    yield Q6, H6.push(Q6)
                }
            }
            let q8 = w7(H6, (a6) => a6.type === "attachment" && a6.attachment.type === "edited_text_file");
            if (d("tengu_query_after_attachments", {
                    totalToolResultsCount: H6.length,
                    fileChangeAttachmentCount: q8,
                    queryChainId: F,
                    queryDepth: S.depth
                }), L6.options.refreshTools) {
                let a6 = L6.options.refreshTools();
                if (a6 !== L6.options.tools) {
                    let D8 = w7(L6.options.tools, (W8) => !!W8.mcpInfo),
                        Q6 = w7(a6, (W8) => !!W8.mcpInfo);
                    if (D8 !== Q6) d("tengu_mcp_tools_refreshed_mid_turn", {
                        oldMcpCount: D8,
                        newMcpCount: Q6,
                        recovered: D8 === 0 && Q6 > 0
                    });
                    L6 = {
                        ...L6,
                        options: {
                            ...L6.options,
                            tools: a6
                        }
                    }
                }
            }
            let L8 = {
                    ...L6,
                    queryTracking: S
                },
                w8 = B + 1;
            if ($ && w8 > $) return yield Y4({
                type: "max_turns_reached",
                maxTurns: $,
                turnCount: w8
            }), {
                reason: "max_turns",
                turnCount: w8
            };
            Y9("query_recursive_call"), J = {
                messages: [...U, ...$6, ...H6],
                toolUseContext: L8,
                autoCompactTracking: g,
                turnCount: w8,
                maxOutputTokensRecoveryCount: 0,
                hasAttemptedReactiveCompact: !1,
                pendingToolUseSummary: c6,
                maxOutputTokensOverride: void 0,
                stopHookActive: x,
                transition: {
                    reason: "next_turn"
                }
            }
        }
    } catch (Z) {
        var G = Z,
            f = 1
    } finally {
        oz(D, G, f)
    }
}
// @from(Ln 398310, Col 0)
function TXY(q) {
    for (let K = q.length - 1; K >= 0; K--) {
        let _ = q[K];
        if (_.type === "user" && !_.isMeta && !_.toolUseResult && !_.isCompactSummary) return K
    }
    return 0
}
// @from(Ln 398317, Col 4)
D97 = null
// @from(Ln 398318, Col 4)
ckK = null
// @from(Ln 398319, Col 4)
fXY
// @from(Ln 398319, Col 9)
GXY = 3
// @from(Ln 398320, Col 4)
s56 = L(() => {
    Z36();
    rR();
    ep();
    $y();
    XR6();
    C8();
    Th8();
    CI();
    gq();
    U8();
    rv();
    K8();
    _7();
    zx4();
    cM6();
    ZM();
    lr1();
    y8();
    wf();
    b$();
    a18();
    Sq();
    Jk();
    kD();
    O2();
    B1();
    or1();
    K9();
    _36();
    YR6();
    HkK();
    pM6();
    Ha1();
    ND();
    g4();
    mkK();
    FkK();
    UkK();
    y8();
    dkK();
    fXY = ckK ? ckK.createClassifierJobState() : null
})
// @from(Ln 398364, Col 0)
function tkK(q, K, _, z, Y = !1) {
    if (!_ || Object.keys(_).length === 0) return;
    let A = 0;
    for (let O of hV) {
        let w = _[O];
        if (!w || w.length === 0) continue;
        let $ = O;
        if (Y && O === "Stop") $ = "SubagentStop", E(`Converting Stop hook to SubagentStop for ${z} (subagents trigger SubagentStop)`);
        for (let j of w) {
            let H = j.matcher ?? "",
                J = j.hooks;
            if (!J || J.length === 0) continue;
            for (let X of J) q.add(K, $, H, X), A++
        }
    }
    if (A > 0) E(`Registered ${A} frontmatter hook(s) from ${z} for session ${K}`)
}
// @from(Ln 398381, Col 4)
ekK = L(() => {
    pA6();
    K8()
})
// @from(Ln 398388, Col 0)
async function VXY(q, K) {
    if (!q.mcpServers?.length) return {
        clients: K,
        tools: [],
        cleanup: async () => {}
    };
    let _ = T18(q.source);
    if (HT("mcp") && !_) return E(`[Agent: ${q.agentType}] Skipping MCP servers: strictPluginOnlyCustomization locks MCP to plugin-only (agent source: ${q.source})`), {
        clients: K,
        tools: [],
        cleanup: async () => {}
    };
    let z = [],
        Y = [],
        A = [];
    for (let w of q.mcpServers) {
        let $ = null,
            j, H = !1;
        if (typeof w === "string") {
            if (j = w, $ = my(w), !$) {
                E(`[Agent: ${q.agentType}] MCP server not found: ${w}`, {
                    level: "warn"
                });
                continue
            }
        } else {
            let X = Object.entries(w);
            if (X.length !== 1) {
                E(`[Agent: ${q.agentType}] Invalid MCP server spec: expected exactly one key`, {
                    level: "warn"
                });
                continue
            }
            let [M, P] = X[0];
            j = M, $ = {
                ...P,
                scope: "dynamic"
            }, H = !0
        }
        let J = await OL(j, $);
        if (z.push(J), H) Y.push(J);
        if (J.type === "connected") {
            let X = await NS(J);
            A.push(...X), E(`[Agent: ${q.agentType}] Connected to MCP server '${j}' with ${X.length} tools`)
        } else E(`[Agent: ${q.agentType}] Failed to connect to MCP server '${j}': ${J.type}`, {
            level: "warn"
        })
    }
    let O = async () => {
        for (let w of Y)
            if (w.type === "connected") try {
                await w.cleanup()
            } catch ($) {
                E(`[Agent: ${q.agentType}] Error cleaning up MCP server '${w.name}': ${$}`, {
                    level: "warn"
                })
            }
    };
    return {
        clients: [...K, ...z],
        tools: A,
        cleanup: O
    }
}
// @from(Ln 398453, Col 0)
function kXY(q) {
    return q.type === "assistant" || q.type === "user" || q.type === "progress" || q.type === "system" && "subtype" in q && q.subtype === "compact_boundary"
}
// @from(Ln 398456, Col 0)
async function* _u({
    agentDefinition: q,
    promptMessages: K,
    toolUseContext: _,
    canUseTool: z,
    isAsync: Y,
    canShowPermissionPrompts: A,
    forkContextMessages: O,
    querySource: w,
    override: $,
    model: j,
    maxTurns: H,
    preserveToolUseResults: J,
    availableTools: X,
    allowedTools: M,
    onCacheSafeParams: P,
    contentReplacementState: W,
    useExactTools: D,
    worktreePath: Z,
    description: G,
    transcriptSubdir: f,
    onQueryProgress: v,
    isTeammate: V = !1
}) {
    let k = _.getAppState(),
        N = k.toolPermissionContext.mode,
        R = BC6(q.model, _.options.mainLoopModel, j, N),
        h = $?.agentId ? $.agentId : tp();
    if (f) f97(h, f);
    if (es()) {
        let y6 = _.agentId ?? I8();
        dI8(h, q.agentType, y6)
    }
    let x = [...O ? xo1(O) : [], ...K],
        B = O !== void 0 ? Cs(_.readFileState) : CR(oI),
        [m, S] = await Promise.all([$?.userContext ?? $2(), $?.systemContext ?? fj(_.getAppState().cacheBreakerPhrase)]),
        F = q.omitClaudeMd && !$?.userContext && u8("tengu_slim_subagent_claudemd", !0),
        {
            claudeMd: U,
            ...g
        } = m,
        c = F ? g : m,
        {
            gitStatus: n,
            ...l
        } = S,
        z6 = q.agentType === "Explore" || q.agentType === "Plan" ? l : S,
        A6 = q.permissionMode,
        e, i;

    function O6(y6) {
        if (y6 === e && i) return i;
        e = y6;
        let c6 = y6;
        if (A6 && y6.mode !== "bypassPermissions" && y6.mode !== "acceptEdits" && y6.mode !== "auto") c6 = {
            ...c6,
            mode: A6
        };
        let Z8 = A !== void 0 ? !A : A6 === "bubble" ? !1 : Y;
        if (Z8) c6 = {
            ...c6,
            shouldAvoidPermissionPrompts: !0
        };
        if (Y && !Z8) c6 = {
            ...c6,
            awaitAutomatedChecksBeforeDialog: !0
        };
        if (M !== void 0) c6 = {
            ...c6,
            alwaysAllowRules: {
                cliArg: y6.alwaysAllowRules.cliArg,
                session: [...M]
            }
        };
        if (Z && !c6.additionalWorkingDirectories.has(Z)) c6 = {
            ...c6,
            additionalWorkingDirectories: new Map([...c6.additionalWorkingDirectories, [Z, {
                path: Z,
                source: "session"
            }]])
        };
        return i = c6, c6
    }
    let J6 = () => {
            let y6 = _.getAppState(),
                c6 = O6(y6.toolPermissionContext),
                Z8 = q.effort ?? y6.effortValue;
            if (c6 === y6.toolPermissionContext && Z8 === y6.effortValue) return y6;
            return {
                ...y6,
                toolPermissionContext: c6,
                effortValue: Z8
            }
        },
        $6 = D ? X : lt(q, X, Y).resolvedTools,
        H6 = !D && c2K(V) ? $6.filter((y6) => !d2K.has(y6.name)) : $6,
        q6 = Array.from(k.toolPermissionContext.additionalWorkingDirectories.keys()),
        o = $?.systemPrompt ? $.systemPrompt : sK(await NXY(q, _, R, q6, H6)),
        _6 = !D && S6(process.env.CLAUDE_CODE_ENABLE_APPEND_SUBAGENT_PROMPT) && _.options.appendSubagentSystemPrompt ? sK([...o, _.options.appendSubagentSystemPrompt]) : o,
        r = $?.abortController ? $.abortController : Y ? new AbortController : _.abortController,
        t = [];
    for await (let y6 of f38(h, q.agentType, r.signal)) if (y6.additionalContexts && y6.additionalContexts.length > 0) t.push(...y6.additionalContexts);
    if (t.length > 0) {
        let y6 = Y4({
            type: "hook_additional_context",
            content: t,
            hookName: "SubagentStart",
            toolUseID: KNK(),
            hookEvent: "SubagentStart"
        });
        x.push(y6)
    }
    let Y6 = !HT("hooks") || T18(q.source);
    if (q.hooks && Y6) tkK(_.sessionHooksRegistry, h, q.hooks, `agent '${q.agentType}'`, !0);
    let X6 = q.skills ?? [];
    if (X6.length > 0) {
        let y6 = await Ty(c9()),
            c6 = [];
        for (let R6 of X6) {
            let p6 = EXY(R6, y6, q);
            if (!p6) {
                E(`[Agent: ${q.agentType}] Warning: Skill '${R6}' specified in frontmatter was not found`, {
                    level: "warn"
                });
                continue
            }
            let q8 = $b6(p6, y6);
            if (q8.type !== "prompt") {
                E(`[Agent: ${q.agentType}] Warning: Skill '${R6}' is not a prompt-based skill`, {
                    level: "warn"
                });
                continue
            }
            c6.push({
                skillName: R6,
                skill: q8
            })
        }
        let {
            formatSkillLoadingMetadata: Z8
        } = await Promise.resolve().then(() => (oK8(), rK8)), N8 = await Promise.all(c6.map(async ({
            skillName: R6,
            skill: p6
        }) => ({
            skillName: R6,
            skill: p6,
            content: await p6.getPromptForCommand("", _)
        })));
        for (let {
                skillName: R6,
                skill: p6,
                content: q8
            }
            of N8) {
            E(`[Agent: ${q.agentType}] Preloaded skill '${R6}'`);
            let L8 = Z8(R6, p6.progressMessage);
            x.push(t8({
                content: [{
                    type: "text",
                    text: L8
                }, ...q8],
                isMeta: !0
            }))
        }
    }
    let {
        clients: M6,
        tools: W6,
        cleanup: V6
    } = await VXY(q, _.options.mcpClients), f6 = W6.length > 0 ? j2([...H6, ...W6], "name") : H6, G6 = {
        isNonInteractiveSession: D ? _.options.isNonInteractiveSession : Y ? !0 : _.options.isNonInteractiveSession ?? !1,
        appendSystemPrompt: _.options.appendSystemPrompt,
        appendSubagentSystemPrompt: _.options.appendSubagentSystemPrompt,
        tools: f6,
        commands: [],
        debug: _.options.debug,
        verbose: _.options.verbose,
        mainLoopModel: R,
        thinkingConfig: D ? _.options.thinkingConfig : {
            type: "disabled"
        },
        mcpClients: M6,
        mcpResources: _.options.mcpResources,
        agentDefinitions: _.options.agentDefinitions,
        ...D && {
            querySource: w
        }
    }, k6 = C18(_, {
        options: G6,
        agentId: h,
        agentType: q.agentType,
        messages: x,
        readFileState: B,
        abortController: r,
        getAppState: J6,
        shareSetAppState: !Y,
        shareSetResponseLength: !0,
        criticalSystemReminder_EXPERIMENTAL: q.criticalSystemReminder_EXPERIMENTAL,
        contentReplacementState: W
    });
    if ($?.replHydration) k6.replHydration = $.replHydration;
    if (J) k6.preserveToolUseResults = !0;
    if (P) P({
        systemPrompt: _6,
        userContext: c,
        systemContext: z6,
        toolUseContext: k6,
        forkContextMessages: x
    });
    cc(x, h).catch((y6) => E(`Failed to record sidechain transcript: ${y6}`)), dK8(h, {
        agentType: q.agentType,
        ...Z && {
            worktreePath: Z
        },
        ...G && {
            description: G
        }
    }).catch((y6) => E(`Failed to write agent metadata: ${y6}`));
    let T6 = x.at(-1)?.uuid ?? null,
        v6 = !1,
        L6;
    try {
        for await (let y6 of yy({
            messages: x,
            systemPrompt: _6,
            userContext: c,
            systemContext: z6,
            canUseTool: z,
            toolUseContext: k6,
            querySource: w,
            maxTurns: H ?? q.maxTurns
        })) {
            if (v?.(), y6.type === "attachment" && "hookEvent" in y6.attachment && y6.attachment.hookEvent === "SubagentStop" || y6.type === "progress" && y6.data?.type === "hook_progress" && y6.data.hookEvent === "SubagentStop") v6 = !0;
            if (y6.type === "stream_event" && y6.event.type === "message_start" && y6.ttftMs != null) {
                L6 = KNK(), _.pushApiMetricsEntry?.({
                    type: "start",
                    ttftMs: y6.ttftMs,
                    id: L6
                });
                continue
            }
            if (y6.type === "stream_event" && y6.event.type === "message_delta" && y6.event.usage.output_tokens != null && L6 != null) _.pushApiMetricsEntry?.({
                type: "end",
                outputTokens: y6.event.usage.output_tokens,
                id: L6
            }), L6 = void 0;
            if (y6.type === "attachment") {
                if (y6.attachment.type === "max_turns_reached") {
                    E(`[Agent
: $
{
  agentDefinition.agentType
}
] Reached max turns limit ($
{
  message.attachment.maxTurns
}
)`);
                    break
                }
                yield y6;
                continue
            }
            if (kXY(y6)) {
                if (await cc([y6], h, T6).catch((c6) => E(`Failed to record sidechain transcript: ${c6}`)), y6.type !== "progress") T6 = y6.uuid;
                yield y6
            }
        }
        if (v6 = !0, r.signal.aborted) throw new sz;
        if (Vj(q) && q.callback) q.callback()
    } finally {
        if (!v6) try {
            for await (let c6 of w_6(void 0, void 0, 5000, !1, h, k6, void 0, q.agentType));
        } catch (c6) {
            E(`[runAgent] SubagentStop on interrupted query failed: ${c6}`)
        }
        if (await V6(), q.hooks) _.sessionHooksRegistry.clear(h);
        if (iI()) r04(h);
        k6.readFileState.clear(), x.length = 0, OJ6(h), G97(h), _.agentLifecycle.clearTodos(h);
        let y6 = _.getAppState().replContexts[h];
        if (y6) y6.clearAllTimers(), _.setReplContext(h, void 0);
        aTK(h, _.taskRegistry)
    }
}
// @from(Ln 398741, Col 0)
function xo1(q) {
    let K = new Set;
    for (let _ of q)
        if (_?.type === "user") {
            let Y = _.message.content;
            if (Array.isArray(Y)) {
                for (let A of Y)
                    if (A.type === "tool_result" && A.tool_use_id) K.add(A.tool_use_id)
            }
        } return q.filter((_) => {
        if (_?.type === "assistant") {
            let Y = _.message.content;
            if (Array.isArray(Y)) return !Y.some((O) => O.type === "tool_use" && O.id && !K.has(O.id))
        }
        return !0
    })
}
// @from(Ln 398758, Col 0)
async function NXY(q, K, _, z, Y) {
    let A = new Set(Y.map((O) => O.name));
    try {
        let w = [q.getSystemPrompt({
            toolUseContext: K
        })];
        return await lK8(w, _, z, A)
    } catch (O) {
        return lK8([_NK], _, z, A)
    }
}
// @from(Ln 398770, Col 0)
function EXY(q, K, _) {
    if (wM6(q, K)) return q;
    let z = i5(_.agentType, ":");
    if (z) {
        let O = `${z}:${q}`;
        if (wM6(O, K)) return O
    }
    let Y = `:${q}`,
        A = K.find((O) => O.name.endsWith(Y));
    if (A) return A.name;
    return null
}
// @from(Ln 398782, Col 4)
vJ6 = L(() => {
    tI();
    K8();
    y8();
    CA();
    sy();
    hk();
    s56();
    B1();
    _36();
    FK6();
    oW();
    rD();
    Sd8();
    ZM();
    Q8();
    m8();
    eK();
    FP();
    lf();
    ekK();
    K9();
    _7();
    Z96();
    g4();
    jJ6();
    ih6();
    dc();
    k96();
    cP()
})
// @from(Ln 398814, Col 0)
function zNK(q) {
    v97 = q
}
// @from(Ln 398818, Col 0)
function fI6() {
    return v97
}
// @from(Ln 398822, Col 0)
function YNK() {
    v97 = null
}
// @from(Ln 398826, Col 0)
function ANK(q) {
    T97 = q
}
// @from(Ln 398830, Col 0)
function ONK() {
    return T97
}
// @from(Ln 398834, Col 0)
function wNK() {
    T97 = null
}
// @from(Ln 398837, Col 4)
v97 = null
// @from(Ln 398838, Col 4)
T97 = null
// @from(Ln 398839, Col 4)
$NK = {}
// @from(Ln 398843, Col 4)
V97 = `
# Agent Teammate Communication

IMPORTANT: You are running as an agent in a team. To communicate with anyone on your team:
- Use the SendMessage tool with \`to: "<name>"\` to send messages to specific teammates
- Use the SendMessage tool with \`to: "*"\` sparingly for team-wide broadcasts

Just writing a response in text is not visible to others on your team - you MUST use the SendMessage tool.

The user interacts primarily with the team lead. Your work is coordinated through the task system and teammate messaging.
`
// @from(Ln 398855, Col 0)
function LXY(q, K, _) {
    return async (z, Y, A, O, w, $) => {
        let j = $ ?? await LX(z, Y, A, O, w);
        if (j.behavior !== "ask") return j;
        if (K.signal.aborted) return {
            behavior: "ask",
            message: tF
        };
        let H = A.getAppState(),
            J = await z.description(Y, {
                isNonInteractiveSession: A.options.isNonInteractiveSession,
                toolPermissionContext: H.toolPermissionContext,
                tools: A.options.tools
            });
        if (K.signal.aborted) return {
            behavior: "ask",
            message: tF
        };
        let X = fI6();
        if (X) return new Promise((M) => {
            let P = !1,
                W = Date.now(),
                D = () => {
                    _?.(Date.now() - W)
                },
                Z = () => {
                    if (P) return;
                    P = !0, D(), M({
                        behavior: "ask",
                        message: tF
                    }), X((G) => G.filter((f) => f.toolUseID !== w))
                };
            K.signal.addEventListener("abort", Z, {
                once: !0
            }), X((G) => [...G, {
                assistantMessage: O,
                tool: z,
                description: J,
                input: Y,
                toolUseContext: A,
                toolUseID: w,
                permissionResult: j,
                permissionPromptStartTimeMs: W,
                workerBadge: q.color ? {
                    name: q.agentName,
                    color: q.color
                } : void 0,
                onUserInteraction() {},
                onAbort() {
                    if (P) return;
                    P = !0, K.signal.removeEventListener("abort", Z), D(), M({
                        behavior: "ask",
                        message: tF
                    })
                },
                async onAllow(f, v, V, k) {
                    if (P) return;
                    if (P = !0, K.signal.removeEventListener("abort", Z), D(), Hp(v), v.length > 0) {
                        let R = ONK();
                        if (R) {
                            let h = A.getAppState(),
                                C = Ky(h.toolPermissionContext, v);
                            R(C, {
                                preserveMode: !0
                            })
                        }
                    }
                    let N = V?.trim();
                    M({
                        behavior: "allow",
                        updatedInput: f,
                        userModified: !1,
                        acceptFeedback: N || void 0,
                        ...k && k.length > 0 && {
                            contentBlocks: k
                        }
                    })
                },
                onReject(f, v) {
                    if (P) return;
                    P = !0, K.signal.removeEventListener("abort", Z), D();
                    let V = f ? `${G38}${f}` : tF;
                    M({
                        behavior: "ask",
                        message: V,
                        contentBlocks: v
                    })
                },
                async recheckPermission() {
                    if (P) return;
                    let f = await LX(z, Y, A, O, w);
                    if (f.behavior === "allow") P = !0, K.signal.removeEventListener("abort", Z), D(), X((v) => v.filter((V) => V.toolUseID !== w)), M({
                        ...f,
                        updatedInput: Y,
                        userModified: !1
                    })
                }
            }])
        });
        return new Promise((M) => {
            let P = oI8({
                toolName: z.name,
                toolUseId: w,
                input: Y,
                description: J,
                permissionSuggestions: j.suggestions,
                workerId: q.agentId,
                workerName: q.agentName,
                workerColor: q.color,
                teamName: q.teamName
            });
            eI8({
                requestId: P.id,
                toolUseId: w,
                onAllow(G, f, v, V) {
                    Z(), Hp(f);
                    let k = G && Object.keys(G).length > 0 ? G : Y;
                    M({
                        behavior: "allow",
                        updatedInput: k,
                        userModified: !1,
                        ...V && V.length > 0 && {
                            contentBlocks: V
                        }
                    })
                },
                onReject(G, f) {
                    Z();
                    let v = G ? `${G38}${G}` : tF;
                    M({
                        behavior: "ask",
                        message: v,
                        contentBlocks: f
                    })
                }
            }), aI8(P);
            let W = setInterval(async (G, f, v, V, k) => {
                    if (G.signal.aborted) {
                        f(), v({
                            behavior: "ask",
                            message: tF
                        });
                        return
                    }
                    let N = await ts(V.agentName, V.teamName);
                    for (let R = 0; R < N.length; R++) {
                        let h = N[R];
                        if (h && !h.read) {
                            let C = KJ6(h.text);
                            if (C && C.request_id === k.id) {
                                if (await Y18(V.agentName, V.teamName, R), C.subtype === "success") eh6({
                                    requestId: C.request_id,
                                    decision: "approved",
                                    updatedInput: C.response?.updated_input,
                                    permissionUpdates: C.response?.permission_updates
                                });
                                else eh6({
                                    requestId: C.request_id,
                                    decision: "rejected",
                                    feedback: C.error
                                });
                                return
                            }
                        }
                    }
                }, yXY, K, Z, M, q, P),
                D = () => {
                    Z(), M({
                        behavior: "ask",
                        message: tF
                    })
                };
            K.signal.addEventListener("abort", D, {
                once: !0
            });

            function Z() {
                clearInterval(W), ub4(P.id), K.signal.removeEventListener("abort", D)
            }
        })
    }
}
// @from(Ln 399038, Col 0)
function k97(q, K, _, z) {
    let Y = _ ? ` color="${_}"` : "",
        A = z ? ` summary="${z}"` : "";
    return `<${oX} teammate_id="${q}"${Y}${A}>
${K}
</${oX}>`
}
// @from(Ln 399046, Col 0)
function sF(q, K, _) {
    _((z) => {
        let Y = z.tasks[q];
        if (!Y || Y.type !== "in_process_teammate") return z;
        let A = K(Y);
        if (A === Y) return z;
        return {
            ...z,
            tasks: {
                ...z.tasks,
                [q]: A
            }
        }
    })
}
// @from(Ln 399061, Col 0)
async function hXY(q, K, _, z) {
    await F_(Mz, {
        from: q,
        text: K,
        timestamp: new Date().toISOString(),
        color: _
    }, z)
}
// @from(Ln 399069, Col 0)
async function jNK(q, K, _, z) {
    let Y = w18(q, z);
    await hXY(q, I6(Y), K, _)
}
// @from(Ln 399074, Col 0)
function RXY(q) {
    let K = new Set(q.filter((_) => _.status !== "completed").map((_) => _.id));
    return q.find((_) => {
        if (_.status !== "pending") return !1;
        if (_.owner) return !1;
        return _.blockedBy.every((z) => !K.has(z))
    })
}
// @from(Ln 399083, Col 0)
function SXY(q) {
    let K = `Complete all open tasks. Start with task #${q.id}: 

 ${q.subject}`;
    if (q.description) K += `

${q.description}`;
    return K
}
// @from(Ln 399092, Col 0)
async function HNK(q, K) {
    try {
        let _ = await Qf(q),
            z = RXY(_);
        if (!z) return;
        let Y = await HR4(q, z.id, K);
        if (!Y.success) {
            E(`[inProcessRunner] Failed to claim task #${z.id}: ${Y.reason}`);
            return
        }
        return await ns(q, z.id, {
            status: "in_progress"
        }), E(`[inProcessRunner] Claimed task #${z.id}: ${z.subject}`), SXY(z)
    } catch (_) {
        E(`[inProcessRunner] Error checking task list: ${_}`);
        return
    }
}
// @from(Ln 399110, Col 0)
async function CXY(q, K, _, z, Y, A) {
    E(`[inProcessRunner] ${q.agentName} starting poll loop (abort=${K.signal.aborted})`);
    let w = 0;
    while (!K.signal.aborted) {
        let j = z().tasks[_];
        if (j && j.type === "in_process_teammate" && j.pendingUserMessages.length > 0) {
            let J = j.pendingUserMessages[0];
            return Y((X) => {
                let M = X.tasks[_];
                if (!M || M.type !== "in_process_teammate") return X;
                return {
                    ...X,
                    tasks: {
                        ...X.tasks,
                        [_]: {
                            ...M,
                            pendingUserMessages: M.pendingUserMessages.slice(1)
                        }
                    }
                }
            }), E(`[inProcessRunner] ${q.agentName} found pending user message (poll #${w})`), {
                type: "new_message",
                message: J,
                from: "user"
            }
        }
        if (w > 0) await l7(500);
        if (w++, K.signal.aborted) return E(`[inProcessRunner] ${q.agentName} aborted while waiting (poll #${w})`), {
            type: "aborted"
        };
        E(`[inProcessRunner] ${q.agentName} poll #${w}: checking mailbox`);
        try {
            let J = await ts(q.agentName, q.teamName),
                X = -1,
                M = null;
            for (let W = 0; W < J.length; W++) {
                let D = J[W];
                if (D && !D.read) {
                    let Z = i56(D.text);
                    if (Z) {
                        X = W, M = Z;
                        break
                    }
                }
            }
            if (X !== -1) {
                let W = J[X],
                    D = w7(J.slice(0, X), (Z) => !Z.read);
                return E(`[inProcessRunner] ${q.agentName} received shutdown request from ${M?.from} (prioritized over ${D} unread messages)`), await Y18(q.agentName, q.teamName, X), {
                    type: "shutdown_request",
                    request: M,
                    originalMessage: W.text
                }
            }
            let P = -1;
            for (let W = 0; W < J.length; W++) {
                let D = J[W];
                if (D && !D.read && D.from === Mz) {
                    P = W;
                    break
                }
            }
            if (P === -1) P = J.findIndex((W) => !W.read);
            if (P !== -1) {
                let W = J[P];
                if (W) return E(`[inProcessRunner] ${q.agentName} received new message from ${W.from} (index ${P})`), await Y18(q.agentName, q.teamName, P), {
                    type: "new_message",
                    message: W.text,
                    from: W.from,
                    color: W.color,
                    summary: W.summary
                }
            }
        } catch (J) {
            E(`[inProcessRunner] ${q.agentName} poll error: ${J}`)
        }
        let H = await HNK(A, q.agentName);
        if (H) return {
            type: "new_message",
            message: H,
            from: "task-list"
        }
    }
    return E(`[inProcessRunner] ${q.agentName} exiting poll loop (abort=${K.signal.aborted}, polls=${w})`), {
        type: "aborted"
    }
}