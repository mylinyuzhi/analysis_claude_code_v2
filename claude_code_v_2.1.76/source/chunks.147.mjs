
// @from(Ln 372672, Col 0)
async function _uY(A, q, K, Y, z, _) {
    if (t6(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || t6(process.env.CLAUDE_CODE_SIMPLE)) return [];
    let w = sK(),
        O = setTimeout((W) => W.abort(), 1000, w),
        $ = {
            ...q,
            abortController: w
        },
        H = !q.agentId,
        j = A ? [Hz("at_mentioned_files", () => RuY(A, $)), Hz("mcp_resources", () => SuY(A, $)), Hz("agent_mentions", () => Promise.resolve(huY(A, q.options.agentDefinitions.activeAgents))), ...[]] : [],
        J = await Promise.all(j),
        M = [Hz("date_change", () => Promise.resolve(fuY())), Hz("ultrathink_effort", () => Promise.resolve(TuY(A))), Hz("deferred_tools_delta", () => Promise.resolve(xE1(q.options.tools, q.options.mainLoopModel, z))), Hz("mcp_instructions_delta", () => Promise.resolve(uE1(q.options.mcpClients, q.options.tools, q.options.mainLoopModel, z))), Hz("changed_files", () => CuY($)), Hz("nested_memory", () => IuY($)), Hz("dynamic_skill", () => BuY($)), Hz("skill_listing", () => guY($)), Hz("ultra_claude_md", async () => VuY(z)), Hz("plan_mode", () => DuY(z, q)), Hz("plan_mode_exit", () => XuY(q)), Hz("auto_mode", () => ZuY(z, q)), Hz("auto_mode_exit", () => GuY(q)), Hz("todo_reminders", () => r$() ? auY(z, q) : ruY(z, q)), ...E7() ? [..._ === "session_memory" ? [] : [Hz("teammate_mailbox", async () => euY(q))], Hz("team_context", async () => AmY(z ?? []))] : [], Hz("agent_pending_messages", async () => $uY(q)), Hz("critical_system_reminder", () => Promise.resolve(vuY(q)))],
        D = H ? [Hz("ide_selection", async () => kuY(K, q)), Hz("ide_opened_file", async () => LuY(K, q)), Hz("output_style", async () => Promise.resolve(NuY())), Hz("diagnostics", async () => cuY(q)), Hz("lsp_diagnostics", async () => luY(q)), Hz("unified_tasks", async () => suY(q)), Hz("async_hook_responses", async () => tuY()), Hz("token_usage", async () => Promise.resolve(qmY(z ?? [], q.options.mainLoopModel))), Hz("budget_usd", async () => Promise.resolve(YmY(q.options.maxBudgetUsd))), Hz("output_token_usage", async () => Promise.resolve(KmY())), Hz("verify_plan_reminder", async () => _mY(z, q)), Hz("queued_commands", () => OuY(Y))] : [],
        [X, P] = await Promise.all([Promise.all(M), Promise.all(D)]);
    return clearTimeout(O), [...J.flat(), ...X.flat(), ...P.flat()].filter((W) => W !== void 0 && W !== null)
}
// @from(Ln 372688, Col 0)
async function Hz(A, q) {
    let K = Date.now();
    try {
        let Y = await q(),
            z = Date.now() - K;
        if (Math.random() < 0.05) {
            let _ = Y.filter((w) => w !== void 0 && w !== null).reduce((w, O) => {
                return w + B6(O).length
            }, 0);
            d("tengu_attachment_compute_duration", {
                label: A,
                duration_ms: z,
                attachment_size_bytes: _,
                attachment_count: Y.length
            })
        }
        return Y
    } catch (Y) {
        let z = Date.now() - K;
        if (Math.random() < 0.05) d("tengu_attachment_compute_duration", {
            label: A,
            duration_ms: z,
            error: !0
        });
        return _6(Y), jV(`Attachment error in ${A}`, Y), []
    }
}
// @from(Ln 372715, Col 0)
async function OuY(A) {
    if (!A) return [];
    let q = A.filter((K) => wuY.has(K.mode));
    return Promise.all(q.map(async (K) => {
        let Y = await juY(K.pastedContents),
            z = K.value;
        if (Y.length > 0) z = [{
            type: "text",
            text: typeof K.value === "string" ? K.value : HuY(K.value)
        }, ...Y];
        return {
            type: "queued_command",
            prompt: z,
            source_uuid: K.uuid,
            imagePasteIds: n94(K.pastedContents),
            commandMode: K.mode,
            origin: K.origin,
            isMeta: K.isMeta
        }
    }))
}
// @from(Ln 372737, Col 0)
function $uY(A) {
    let q = A.agentId;
    if (!q) return [];
    return Q4q(q, A.getAppState, A.setAppStateForTasks ?? A.setAppState).map((Y) => ({
        type: "queued_command",
        prompt: Y,
        origin: {
            kind: "coordinator"
        },
        isMeta: !0
    }))
}
// @from(Ln 372750, Col 0)
function HuY(A) {
    return A.filter((q) => q.type === "text").map((q) => q.text).join(`
`)
}
// @from(Ln 372754, Col 0)
async function juY(A) {
    if (!A) return [];
    let q = Object.values(A).filter((Y) => Y.type === "image");
    if (q.length === 0) return [];
    return await Promise.all(q.map(async (Y) => {
        let z = {
            type: "image",
            source: {
                type: "base64",
                media_type: Y.mediaType || "image/png",
                data: Y.content
            }
        };
        return (await Qd(z)).block
    }))
}
// @from(Ln 372771, Col 0)
function JuY(A) {
    let q = 0,
        K = !1;
    for (let Y = A.length - 1; Y >= 0; Y--) {
        let z = A[Y];
        if (z?.type === "assistant") {
            if (Ei6(z)) continue;
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
// @from(Ln 372790, Col 0)
function MuY(A) {
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
// @from(Ln 372801, Col 0)
async function DuY(A, q) {
    let Y = q.getAppState().toolPermissionContext;
    if (Y.mode !== "plan") return [];
    if (A && A.length > 0) {
        let {
            turnCount: H,
            foundPlanModeAttachment: j
        } = JuY(A);
        if (j && H < t4q.TURNS_BETWEEN_ATTACHMENTS) return []
    }
    let z = Fj(q.agentId),
        _ = sJ(q.agentId),
        w = [];
    if (Y.prePlanMode === "ultraplan") return w.push({
        type: "plan_mode",
        reminderType: "ultraplan-complete",
        isSubAgent: !!q.agentId,
        planFilePath: z,
        planExists: _ !== null
    }), w;
    if (nk6() && _ !== null) w.push({
        type: "plan_mode_reentry",
        planFilePath: z
    }), HV(!1);
    let $ = (MuY(A ?? []) + 1) % t4q.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1 ? "full" : "sparse";
    return w.push({
        type: "plan_mode",
        reminderType: $,
        isSubAgent: !!q.agentId,
        planFilePath: z,
        planExists: _ !== null
    }), w
}
// @from(Ln 372834, Col 0)
async function XuY(A) {
    if (!Fu1()) return [];
    if (A.getAppState().toolPermissionContext.mode === "plan") return JS(!1), [];
    JS(!1);
    let K = Fj(A.agentId),
        Y = sJ(A.agentId) !== null;
    return [{
        type: "plan_mode_exit",
        planFilePath: K,
        planExists: Y
    }]
}
// @from(Ln 372847, Col 0)
function PuY(A) {
    let q = 0,
        K = !1;
    for (let Y = A.length - 1; Y >= 0; Y--) {
        let z = A[Y];
        if (z?.type === "assistant") {
            if (Ei6(z)) continue;
            q++
        } else if (z?.type === "attachment" && z.attachment.type === "auto_mode") {
            K = !0;
            break
        } else if (z?.type === "attachment" && z.attachment.type === "auto_mode_exit") break
    }
    return {
        turnCount: q,
        foundAutoModeAttachment: K
    }
}
// @from(Ln 372866, Col 0)
function WuY(A) {
    let q = 0;
    for (let K = A.length - 1; K >= 0; K--) {
        let Y = A[K];
        if (Y?.type === "attachment") {
            if (Y.attachment.type === "auto_mode_exit") break;
            if (Y.attachment.type === "auto_mode") q++
        }
    }
    return q
}
// @from(Ln 372877, Col 0)
async function ZuY(A, q) {
    if (q.getAppState().toolPermissionContext.mode !== "auto") return [];
    if (A && A.length > 0) {
        let {
            turnCount: w,
            foundAutoModeAttachment: O
        } = PuY(A);
        if (O && w < e4q.TURNS_BETWEEN_ATTACHMENTS) return []
    }
    return [{
        type: "auto_mode",
        reminderType: (WuY(A ?? []) + 1) % e4q.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1 ? "full" : "sparse"
    }]
}
// @from(Ln 372891, Col 0)
async function GuY(A) {
    if (!pu1()) return [];
    if (A.getAppState().toolPermissionContext.mode === "auto") return MS(!1), [];
    return MS(!1), [{
        type: "auto_mode_exit"
    }]
}
// @from(Ln 372899, Col 0)
function fuY() {
    let A = GD6(),
        q = tu1();
    if (q === null) return dw6(A), [];
    if (A === q) return [];
    return a2.cache.clear?.(), dw6(A), [{
        type: "date_change",
        newDate: A
    }]
}
// @from(Ln 372910, Col 0)
function TuY(A) {
    if (!GU() || !A || !pG7(A)) return [];
    return d("tengu_ultrathink", {}), [{
        type: "ultrathink_effort",
        level: "high"
    }]
}
// @from(Ln 372918, Col 0)
function xE1(A, q, K) {
    if (!ki6()) return [];
    if (!dk()) return [];
    if (!Vi6(q)) return [];
    if (!bz6(A)) return [];
    let Y = eF8(A, K ?? []);
    if (!Y) return [];
    return [{
        type: "deferred_tools_delta",
        ...Y
    }]
}
// @from(Ln 372931, Col 0)
function uE1(A, q, K, Y) {
    if (!iT6()) return [];
    let z = [];
    if (dk() && Vi6(K) && bz6(q)) z.push({
        serverName: lv,
        block: kE1
    });
    let _ = c4q(A, Y ?? [], z);
    if (!_) return [];
    return [{
        type: "mcp_instructions_delta",
        ..._
    }]
}
// @from(Ln 372946, Col 0)
function vuY(A) {
    let q = A.criticalSystemReminder_EXPERIMENTAL;
    if (!q) return [];
    return [{
        type: "critical_system_reminder",
        content: q
    }]
}
// @from(Ln 372955, Col 0)
function NuY() {
    let q = PA()?.outputStyle || "default";
    if (q === "default") return [];
    return [{
        type: "output_style",
        style: q
    }]
}
// @from(Ln 372964, Col 0)
function VuY(A) {
    return []
}
// @from(Ln 372967, Col 0)
async function kuY(A, q) {
    let K = R$1(q.options.mcpClients);
    if (!K || A?.lineStart === void 0 || !A.text || !A.filePath) return [];
    let Y = q.getAppState();
    if (rT6(A.filePath, Y.toolPermissionContext)) return [];
    return [{
        type: "selected_lines_in_ide",
        ideName: K,
        lineStart: A.lineStart,
        lineEnd: A.lineStart + A.lineCount - 1,
        filename: A.filePath,
        content: A.text,
        displayPath: Bl(G1(), A.filePath)
    }]
}
// @from(Ln 372983, Col 0)
function EuY(A, q) {
    let K = aF8(Kqq(A)),
        Y = [],
        z = K;
    while (z !== q && z !== SE1(z).root) {
        if (z.startsWith(q)) Y.push(z);
        z = aF8(z)
    }
    Y.reverse();
    let _ = [];
    z = q;
    while (z !== SE1(z).root) _.push(z), z = aF8(z);
    return _.reverse(), {
        nestedDirs: Y,
        cwdLevelDirs: _
    }
}
// @from(Ln 373001, Col 0)
function yuY(A) {
    return A === "User" || A === "Project" || A === "Local" || A === "Managed"
}
// @from(Ln 373005, Col 0)
function sF8(A, q, K) {
    let Y = [],
        z = WF6();
    for (let _ of A)
        if (!q.readFileState.has(_.path)) {
            if (Y.push({
                    type: "nested_memory",
                    path: _.path,
                    content: _,
                    displayPath: Bl(G1(), _.path)
                }), q.readFileState.set(_.path, {
                    content: _.contentDiffersFromDisk ? _.rawContent ?? _.content : _.content,
                    timestamp: Date.now(),
                    offset: void 0,
                    limit: void 0,
                    isPartialView: _.contentDiffersFromDisk
                }), z && yuY(_.type)) {
                let w = _.globs ? "path_glob_match" : _.parent ? "include" : "nested_traversal";
                ZF6(_.path, _.type, w, {
                    globs: _.globs,
                    triggerFilePath: K,
                    parentFilePath: _.parent
                })
            }
        } return Y
}
// @from(Ln 373032, Col 0)
function Yqq(A, q, K) {
    let Y = [];
    try {
        if (!kI(A, K.toolPermissionContext)) return Y;
        let z = new Set,
            _ = AA(),
            w = if8(A, z);
        Y.push(...sF8(w, q, A));
        let {
            nestedDirs: O,
            cwdLevelDirs: $
        } = EuY(A, _), H = w8("tengu_paper_halyard", !1);
        for (let j of O) {
            let J = nf8(j, A, z).filter((M) => !H || M.type !== "Project" && M.type !== "Local");
            Y.push(...sF8(J, q, A))
        }
        for (let j of $) {
            let J = rf8(j, A, z).filter((M) => !H || M.type !== "Project" && M.type !== "Local");
            Y.push(...sF8(J, q, A))
        }
    } catch (z) {
        _6(z)
    }
    return Y
}
// @from(Ln 373057, Col 0)
async function LuY(A, q) {
    if (!A?.filePath || A.text) return [];
    let K = q.getAppState();
    if (rT6(A.filePath, K.toolPermissionContext)) return [];
    return [...Yqq(A.filePath, q, K), {
        type: "opened_file_in_ide",
        filename: A.filePath
    }]
}
// @from(Ln 373066, Col 0)
async function RuY(A, q) {
    let K = FuY(A);
    if (K.length === 0) return [];
    let Y = q.getAppState();
    return (await Promise.all(K.map(async (_) => {
        try {
            let {
                filename: w,
                lineStart: O,
                lineEnd: $
            } = QuY(_), H = L4(w);
            if (rT6(H, Y.toolPermissionContext)) return null;
            try {
                if ((await qqq(H)).isDirectory()) try {
                    let J = await Aqq(H, {
                            withFileTypes: !0
                        }),
                        M = 1000,
                        D = J.length > 1000,
                        X = J.slice(0, 1000).map((W) => W.name);
                    if (D) X.push(`… and ${J.length-1000} more entries`);
                    let P = X.join(`
`);
                    return d("tengu_at_mention_extracting_directory_success", {}), {
                        type: "directory",
                        path: H,
                        content: P,
                        displayPath: Bl(G1(), H)
                    }
                } catch {
                    return null
                }
            } catch {}
            return await tF8(H, q, "tengu_at_mention_extracting_filename_success", "tengu_at_mention_extracting_filename_error", "at-mention", {
                offset: O,
                limit: $ && O ? $ - O + 1 : void 0
            })
        } catch {
            d("tengu_at_mention_extracting_filename_error", {})
        }
    }))).filter(Boolean)
}
// @from(Ln 373109, Col 0)
function huY(A, q) {
    let K = wqq(A);
    if (K.length === 0) return [];
    return K.map((z) => {
        let _ = z.replace("agent-", ""),
            w = q.find((O) => O.agentType === _);
        if (!w) return d("tengu_at_mention_agent_not_found", {}), null;
        return d("tengu_at_mention_agent_success", {}), {
            type: "agent_mention",
            agentType: w.agentType
        }
    }).filter((z) => z !== null)
}
// @from(Ln 373122, Col 0)
async function SuY(A, q) {
    let K = puY(A);
    if (K.length === 0) return [];
    let Y = q.options.mcpClients || [];
    return (await Promise.all(K.map(async (_) => {
        try {
            let [w, ...O] = _.split(":"), $ = O.join(":");
            if (!w || !$) return d("tengu_at_mention_mcp_resource_error", {}), null;
            let H = Y.find((M) => M.name === w);
            if (!H || H.type !== "connected") return d("tengu_at_mention_mcp_resource_error", {}), null;
            let J = (q.options.mcpResources?.[w] || []).find((M) => M.uri === $);
            if (!J) return d("tengu_at_mention_mcp_resource_error", {}), null;
            try {
                let M = await H.client.readResource({
                    uri: $
                });
                return d("tengu_at_mention_mcp_resource_success", {}), {
                    type: "mcp_resource",
                    server: w,
                    uri: $,
                    name: J.name || $,
                    description: J.description,
                    content: M
                }
            } catch (M) {
                return d("tengu_at_mention_mcp_resource_error", {}), _6(M), null
            }
        } catch {
            return d("tengu_at_mention_mcp_resource_error", {}), null
        }
    }))).filter((_) => _ !== null)
}
// @from(Ln 373154, Col 0)
async function CuY(A) {
    let q = jB(A.readFileState);
    if (q.length === 0) return [];
    let K = A.getAppState();
    return (await Promise.all(q.map(async (z) => {
        let _ = A.readFileState.get(z);
        if (!_) return null;
        if (_.offset !== void 0 || _.limit !== void 0) return null;
        let w = L4(z);
        if (rT6(w, K.toolPermissionContext)) return null;
        try {
            if (Jh(w) <= _.timestamp) return null;
            let O = {
                file_path: w
            };
            if (!(await L9.validateInput(O, A)).result) return null;
            let H = await L9.call(O, A);
            if (H.data.type === "text") {
                let j = Bf7(_.content, H.data.file.content);
                if (j === "") return null;
                return {
                    type: "edited_text_file",
                    filename: w,
                    snippet: j
                }
            }
            if (H.data.type === "image") try {
                let j = await XV8(w);
                return {
                    type: "edited_image_file",
                    filename: w,
                    content: j
                }
            } catch (j) {
                return _6(j), d("tengu_watched_file_compression_failed", {
                    file: w
                }), null
            }
        } catch {
            return A.readFileState.delete(z), null
        }
    }))).filter((z) => z !== null)
}
// @from(Ln 373197, Col 0)
async function IuY(A) {
    if (!A.nestedMemoryAttachmentTriggers || A.nestedMemoryAttachmentTriggers.size === 0) return [];
    let q = A.getAppState(),
        K = [];
    for (let Y of A.nestedMemoryAttachmentTriggers) {
        let z = Yqq(Y, A, q);
        K.push(...z)
    }
    return A.nestedMemoryAttachmentTriggers.clear(), K
}
// @from(Ln 373207, Col 0)
async function buY(A, q, K, Y) {
    let z = AbortSignal.timeout(5000),
        _ = wqq(A).flatMap((j) => {
            let J = j.replace("agent-", ""),
                M = q.find((D) => D.agentType === J);
            return M?.memory ? [GW6(J, M.memory)] : []
        }),
        w = _.length > 0 ? _ : [uH()],
        $ = (await Promise.all(w.map((j) => a4q(A, j, z, Y).catch(() => [])))).flat().filter((j) => !K.has(j.path)).slice(0, 5),
        H = (await Promise.all($.map(async ({
            path: j,
            mtimeMs: J
        }) => {
            try {
                let M = await h36(j, 0, hE1, void 0, z),
                    D = M.totalLines > hE1,
                    X = D ? M.content + `

> This memory file was truncated to the first ${hE1} lines. Use the ${s7} tool to view the complete file at: ${j}` : M.content;
                return K.set(j, {
                    content: X,
                    timestamp: Date.now(),
                    offset: void 0,
                    limit: D ? hE1 : void 0
                }), {
                    path: j,
                    content: X,
                    mtimeMs: J
                }
            } catch {
                return null
            }
        }))).filter((j) => j !== null);
    if (H.length === 0) return [];
    return [{
        type: "relevant_memories",
        memories: H
    }]
}
// @from(Ln 373247, Col 0)
function zqq(A, q) {
    if (!Z3() || !w8("tengu_moth_copse", !1)) return;
    let K = A.findLast((z) => z.type === "user" && !z.isMeta);
    if (!K) return;
    let Y = Fg(K);
    if (!Y || !/\s/.test(Y.trim())) return;
    return buY(Y, q.options.agentDefinitions.activeAgents, q.readFileState, uuY(A, K)).catch((z) => {
        return _6(z), []
    })
}
// @from(Ln 373258, Col 0)
function xuY(A) {
    return typeof A === "object" && A !== null && A.type === "tool_result" && typeof A.tool_use_id === "string"
}
// @from(Ln 373262, Col 0)
function uuY(A, q) {
    let K = new Map,
        Y = new Map;
    for (let w = A.length - 1; w >= 0; w--) {
        let O = A[w];
        if (!O) continue;
        if (O.type === "user" && !O.isMeta && O !== q) break;
        if (O.type === "assistant" && typeof O.message.content !== "string") {
            for (let $ of O.message.content)
                if ($.type === "tool_use") K.set($.id, $.name)
        } else if (O.type === "user" && "message" in O && Array.isArray(O.message.content)) {
            for (let $ of O.message.content)
                if (xuY($)) Y.set($.tool_use_id, $.is_error === !0)
        }
    }
    let z = new Set,
        _ = new Set;
    for (let [w, O] of K) {
        let $ = Y.get(w);
        if ($ === void 0) continue;
        if ($) z.add(O);
        else _.add(O)
    }
    return [..._].filter((w) => !z.has(w))
}
// @from(Ln 373288, Col 0)
function muY(A) {
    return typeof A === "object" && A !== null && "file_path" in A && typeof A.file_path === "string"
}
// @from(Ln 373292, Col 0)
function _qq(A, q) {
    let K = new Set(q.filter((Y) => z3(Y, s7)).map((Y) => muY(Y.input) ? Y.input.file_path : void 0).filter((Y) => Y !== void 0));
    if (K.size === 0) return A;
    return A.map((Y) => {
        if (Y.type !== "relevant_memories") return Y;
        let z = Y.memories.filter((_) => !K.has(_.path));
        return z.length > 0 ? {
            ...Y,
            memories: z
        } : null
    }).filter((Y) => Y !== null)
}
// @from(Ln 373304, Col 0)
async function BuY(A) {
    let q = [];
    if (A.dynamicSkillDirTriggers && A.dynamicSkillDirTriggers.size > 0) {
        let K = await Promise.all(Array.from(A.dynamicSkillDirTriggers).map(async (Y) => {
            try {
                let _ = (await Aqq(Y, {
                        withFileTypes: !0
                    })).filter((O) => O.isDirectory() || O.isSymbolicLink()).map((O) => O.name),
                    w = await Promise.all(_.map(async (O) => {
                        try {
                            return await qqq(Kqq(Y, O, "SKILL.md")), O
                        } catch {
                            return null
                        }
                    }));
                return {
                    skillDir: Y,
                    skillNames: w.filter((O) => O !== null)
                }
            } catch {
                return {
                    skillDir: Y,
                    skillNames: []
                }
            }
        }));
        for (let {
                skillDir: Y,
                skillNames: z
            }
            of K)
            if (z.length > 0) q.push({
                type: "dynamic_skill",
                skillDir: Y,
                skillNames: z,
                displayPath: Bl(G1(), Y)
            });
        A.dynamicSkillDirTriggers.clear()
    }
    return q
}
// @from(Ln 373346, Col 0)
function Oc() {
    nT6.clear(), bE1 = !1
}
// @from(Ln 373350, Col 0)
function Vn4() {
    bE1 = !0
}
// @from(Ln 373353, Col 0)
async function guY(A) {
    if (!A.options.tools.some((O) => z3(O, oH))) return [];
    let q = qY(),
        K = await NR(q);
    if (bE1) {
        bE1 = !1;
        for (let O of K) nT6.add(O.name);
        return []
    }
    let Y = K.filter((O) => !nT6.has(O.name));
    if (Y.length === 0) return [];
    let z = nT6.size === 0;
    for (let O of Y) nT6.add(O.name);
    k(`Sending ${Y.length} skills via attachment (${z?"initial":"dynamic"}, ${nT6.size} total sent)`);
    let _ = uM(A.options.mainLoopModel, Zj());
    return [{
        type: "skill_listing",
        content: fV8(Y, _),
        skillCount: Y.length,
        isInitial: z
    }]
}
// @from(Ln 373376, Col 0)
function FuY(A) {
    let q = /(^|\s)@"([^"]+)"/g,
        K = /(^|\s)@([^\s]+)\b/g,
        Y = [],
        z = [],
        _;
    while ((_ = q.exec(A)) !== null)
        if (_[2] && !_[2].endsWith(" (agent)")) Y.push(_[2]);
    return (A.match(K) || []).forEach((O) => {
        let $ = O.slice(O.indexOf("@") + 1);
        if (!$.startsWith('"')) z.push($)
    }), [...new Set([...Y, ...z])]
}
// @from(Ln 373390, Col 0)
function puY(A) {
    let q = /(^|\s)@([^\s]+:[^\s]+)\b/g,
        K = A.match(q) || [];
    return [...new Set(K.map((Y) => Y.slice(Y.indexOf("@") + 1)))]
}
// @from(Ln 373396, Col 0)
function wqq(A) {
    let q = [],
        K = /(^|\s)@"([\w:.@-]+) \(agent\)"/g,
        Y;
    while ((Y = K.exec(A)) !== null)
        if (Y[2]) q.push(Y[2]);
    let z = /(^|\s)@(agent-[\w:.@-]+)/g,
        _ = A.match(z) || [];
    for (let w of _) q.push(w.slice(w.indexOf("@") + 1));
    return [...new Set(q)]
}
// @from(Ln 373408, Col 0)
function QuY(A) {
    let q = A.match(/^([^#]+)(?:#L(\d+)(?:-(\d+))?)?(?:#[^#]*)?$/);
    if (!q) return {
        filename: A
    };
    let [, K, Y, z] = q, _ = Y ? parseInt(Y, 10) : void 0, w = z ? parseInt(z, 10) : _;
    return {
        filename: K ?? A,
        lineStart: _,
        lineEnd: w
    }
}
// @from(Ln 373421, Col 0)
function UuY(A) {
    let q = 0,
        K = !1;
    for (let Y = A.length - 1; Y >= 0; Y--) {
        let z = A[Y];
        if (z?.type === "attachment" && z.attachment.type === "ultramemory") {
            K = !0;
            break
        }
        if (z?.type === "assistant") q += Ap8(z)
    }
    return K ? q : null
}
// @from(Ln 373435, Col 0)
function duY(A) {
    if (!A || A.length === 0) return !0;
    let q = UuY(A);
    if (q === null) return !0;
    return q >= YuY.TOKEN_COOLDOWN
}
// @from(Ln 373441, Col 0)
async function cuY(A) {
    if (!A.options.tools.some((K) => z3(K, Q7))) return [];
    let q = await Nl.getNewDiagnostics();
    if (q.length === 0) return [];
    return [{
        type: "diagnostics",
        files: q,
        isNew: !0
    }]
}
// @from(Ln 373451, Col 0)
async function luY(A) {
    if (!A.options.tools.some((q) => z3(q, Q7))) return [];
    k("LSP Diagnostics: getLSPDiagnosticAttachments called");
    try {
        let q = _a4();
        if (q.length === 0) return [];
        k(`LSP Diagnostics: Found ${q.length} pending diagnostic set(s)`);
        let K = q.map(({
            files: Y
        }) => ({
            type: "diagnostics",
            files: Y,
            isNew: !0
        }));
        if (q.length > 0) wa4(), k(`LSP Diagnostics: Cleared ${q.length} delivered diagnostic(s) from registry`);
        return k(`LSP Diagnostics: Returning ${K.length} diagnostic attachment(s)`), K
    } catch (q) {
        let K = q instanceof Error ? q : Error(String(q));
        return _6(Error(`Failed to get LSP diagnostic attachments: ${K.message}`)), []
    }
}
// @from(Ln 373472, Col 0)
async function* Vf6(A, q, K, Y, z, _) {
    let w = await _uY(A, q, K, Y, z, _);
    if (w.length === 0) return;
    d("tengu_attachments", {
        attachment_types: w.map((O) => O.type)
    });
    for (let O of w) yield f4(O)
}
// @from(Ln 373480, Col 0)
async function iuY(A) {
    let q = SE1(A).ext.toLowerCase();
    if (!JD6(q)) return null;
    try {
        let [K, Y] = await Promise.all([$1().stat(A), GP1(A)]), z = Y ?? Math.ceil(K.size / 102400);
        if (z > TX1) return d("tengu_pdf_reference_attachment", {
            pageCount: z,
            fileSize: K.size,
            hadPdfinfo: Y !== null
        }), {
            type: "pdf_reference",
            filename: A,
            pageCount: z,
            fileSize: K.size,
            displayPath: Bl(G1(), A)
        }
    } catch {}
    return null
}
// @from(Ln 373499, Col 0)
async function tF8(A, q, K, Y, z, _) {
    let {
        offset: w,
        limit: O
    } = _ ?? {}, $ = q.getAppState();
    if (rT6(A, $.toolPermissionContext)) return null;
    if (z === "at-mention" && !Oqq(A, S36().maxSizeBytes)) {
        let j = SE1(A).ext.toLowerCase();
        if (!JD6(j)) try {
            let J = await $1().stat(A);
            return d("tengu_attachment_file_too_large", {
                size_bytes: J.size,
                mode: z
            }), null
        } catch {}
    }
    if (z === "at-mention") {
        let j = await iuY(A);
        if (j) return j
    }
    let H = q.readFileState.get(A);
    if (H && z === "at-mention") try {
        let j = Jh(A);
        if (H.timestamp <= j && j === H.timestamp) return d(K, {}), {
            type: "already_read_file",
            filename: A,
            displayPath: Bl(G1(), A),
            content: {
                type: "text",
                file: {
                    filePath: A,
                    content: H.content,
                    numLines: H.content.split(`
`).length,
                    startLine: w ?? 1,
                    totalLines: H.content.split(`
`).length
                }
            }
        }
    } catch {}
    try {
        let j = {
            file_path: A,
            offset: w,
            limit: O
        };
        async function J() {
            if (z === "compact") return {
                type: "compact_file_reference",
                filename: A,
                displayPath: Bl(G1(), A)
            };
            let D = q.getAppState();
            if (rT6(A, D.toolPermissionContext)) return null;
            try {
                let X = {
                        file_path: A,
                        offset: w ?? 1,
                        limit: Lx6
                    },
                    P = await L9.call(X, q);
                return d(K, {}), {
                    type: "file",
                    filename: A,
                    content: P.data,
                    truncated: !0,
                    displayPath: Bl(G1(), A)
                }
            } catch {
                return d(Y, {}), null
            }
        }
        if (!(await L9.validateInput(j, q)).result) return null;
        try {
            let D = await L9.call(j, q);
            return d(K, {}), {
                type: "file",
                filename: A,
                content: D.data,
                displayPath: Bl(G1(), A)
            }
        } catch (D) {
            if (D instanceof xP1 || D instanceof tF6) return await J();
            throw D
        }
    } catch {
        return d(Y, {}), null
    }
}
// @from(Ln 373590, Col 0)
function f4(A) {
    return {
        attachment: A,
        type: "attachment",
        uuid: KuY(),
        timestamp: new Date().toISOString()
    }
}
// @from(Ln 373599, Col 0)
function nuY(A) {
    let q = -1,
        K = -1,
        Y = 0,
        z = 0;
    for (let _ = A.length - 1; _ >= 0; _--) {
        let w = A[_];
        if (w?.type === "assistant") {
            if (Ei6(w)) continue;
            if (q === -1 && "message" in w && Array.isArray(w.message?.content) && w.message.content.some((O) => O.type === "tool_use" && O.name === "TodoWrite")) q = _;
            if (q === -1) Y++;
            if (K === -1) z++
        } else if (K === -1 && w?.type === "attachment" && w.attachment.type === "todo_reminder") K = _;
        if (q !== -1 && K !== -1) break
    }
    return {
        turnsSinceLastTodoWrite: Y,
        turnsSinceLastReminder: z
    }
}
// @from(Ln 373619, Col 0)
async function ruY(A, q) {
    if (!q.options.tools.some((z) => z3(z, MB))) return [];
    if (CE1 && q.options.tools.some((z) => z3(z, CE1))) return [];
    if (!A || A.length === 0) return [];
    let {
        turnsSinceLastTodoWrite: K,
        turnsSinceLastReminder: Y
    } = nuY(A);
    if (K >= IE1.TURNS_SINCE_WRITE && Y >= IE1.TURNS_BETWEEN_REMINDERS) {
        let z = q.agentId ?? R1(),
            w = q.getAppState().todos[z] ?? [];
        return [{
            type: "todo_reminder",
            content: w,
            itemCount: w.length
        }]
    }
    return []
}
// @from(Ln 373639, Col 0)
function ouY(A) {
    let q = -1,
        K = -1,
        Y = 0,
        z = 0;
    for (let _ = A.length - 1; _ >= 0; _--) {
        let w = A[_];
        if (w?.type === "assistant") {
            if (Ei6(w)) continue;
            if (q === -1 && "message" in w && Array.isArray(w.message?.content) && w.message.content.some((O) => O.type === "tool_use" && (O.name === TR || O.name === ck))) q = _;
            if (q === -1) Y++;
            if (K === -1) z++
        } else if (K === -1 && w?.type === "attachment" && w.attachment.type === "task_reminder") K = _;
        if (q !== -1 && K !== -1) break
    }
    return {
        turnsSinceLastTaskManagement: Y,
        turnsSinceLastReminder: z
    }
}
// @from(Ln 373659, Col 0)
async function auY(A, q) {
    if (!r$()) return [];
    if (CE1 && q.options.tools.some((z) => z3(z, CE1))) return [];
    if (!q.options.tools.some((z) => z3(z, ck))) return [];
    if (!A || A.length === 0) return [];
    let {
        turnsSinceLastTaskManagement: K,
        turnsSinceLastReminder: Y
    } = ouY(A);
    if (K >= IE1.TURNS_SINCE_WRITE && Y >= IE1.TURNS_BETWEEN_REMINDERS) {
        let z = await DX(jf());
        return [{
            type: "task_reminder",
            content: z,
            itemCount: z.length
        }]
    }
    return []
}
// @from(Ln 373678, Col 0)
async function suY(A) {
    let q = A.getAppState(),
        {
            attachments: K,
            updatedTaskOffsets: Y,
            evictedTaskIds: z
        } = await wY4(q);
    return OY4(A.setAppState, Y, z), K.map((_) => ({
        type: "task_status",
        taskId: _.taskId,
        taskType: _.taskType,
        status: _.status,
        description: _.description,
        deltaSummary: _.deltaSummary
    }))
}
// @from(Ln 373694, Col 0)
async function tuY() {
    let A = await r4q();
    if (A.length === 0) return [];
    k(`Hooks: getAsyncHookResponseAttachments found ${A.length} responses`);
    let q = A.map(({
        processId: K,
        response: Y,
        hookName: z,
        hookEvent: _,
        toolName: w,
        pluginId: O,
        stdout: $,
        stderr: H,
        exitCode: j
    }) => {
        return k(`Hooks: Creating attachment for ${K} (${z}): ${B6(Y)}`), {
            type: "async_hook_response",
            processId: K,
            hookName: z,
            hookEvent: _,
            toolName: w,
            response: Y,
            stdout: $,
            stderr: H,
            exitCode: j
        }
    });
    if (A.length > 0) {
        let K = A.map((Y) => Y.processId);
        o4q(K), k(`Hooks: Removed ${K.length} delivered hooks from registry`)
    }
    return k(`Hooks: getAsyncHookResponseAttachments found ${q.length} attachments`), q
}
// @from(Ln 373727, Col 0)
async function euY(A) {
    if (!E7()) return [];
    return []
}
// @from(Ln 373732, Col 0)
function AmY(A) {
    let q = l5(),
        K = nM(),
        Y = i3();
    if (!q || !K) return [];
    if (A.some(($) => $.type === "assistant")) return [];
    let _ = c8(),
        w = `${_}/teams/${q}/config.json`,
        O = `${_}/tasks/${q}/`;
    return [{
        type: "team_context",
        agentId: K,
        agentName: Y || K,
        teamName: q,
        teamConfigPath: w,
        taskListPath: O
    }]
}
// @from(Ln 373751, Col 0)
function qmY(A, q) {
    if (!t6(process.env.CLAUDE_CODE_ENABLE_TOKEN_USAGE_ATTACHMENT)) return [];
    let K = OF(q),
        Y = Ck(A);
    return [{
        type: "token_usage",
        used: Y,
        total: K,
        remaining: K - Y
    }]
}
// @from(Ln 373763, Col 0)
function KmY() {
    return []
}
// @from(Ln 373767, Col 0)
function YmY(A) {
    if (A === void 0) return [];
    let q = LD(),
        K = A - q;
    return [{
        type: "budget_usd",
        used: q,
        total: A,
        remaining: K
    }]
}
// @from(Ln 373779, Col 0)
function zmY(A) {
    let q = 0;
    for (let K = A.length - 1; K >= 0; K--) {
        let Y = A[K];
        if (Y?.type === "user" && !(("isMeta" in Y) && Y.isMeta)) q++;
        if (Y?.type === "attachment" && Y.attachment.type === "plan_mode_exit") return q
    }
    return 0
}
// @from(Ln 373788, Col 0)
async function _mY(A, q) {
    return []
}
// @from(Ln 373792, Col 0)
function rT6(A, q) {
    return ZX(A, q, "read", "deny") !== null
}
// @from(Ln 373795, Col 4)
CE1
// @from(Ln 373795, Col 9)
IE1
// @from(Ln 373795, Col 14)
t4q
// @from(Ln 373795, Col 19)
e4q
// @from(Ln 373795, Col 24)
YuY
// @from(Ln 373795, Col 29)
hE1 = 200
// @from(Ln 373796, Col 4)
zuY
// @from(Ln 373796, Col 9)
wuY
// @from(Ln 373796, Col 14)
nT6
// @from(Ln 373796, Col 19)
bE1 = !1
// @from(Ln 373797, Col 4)
M0 = E(() => {
    V1();
    RI();
    eF6();
    F9();
    SA();
    Bw();
    rH();
    Sw();
    lM();
    lA();
    p36();
    k1();
    Hf();
    H1();
    iY6();
    i8();
    tq6();
    jR();
    D$();
    T1();
    Q36();
    xJ();
    J_();
    uN8();
    tP();
    U$();
    Z7();
    RY();
    O0();
    Vb();
    T1();
    fR();
    VE1();
    SR();
    RE1();
    AT6();
    H1();
    JA();
    A8();
    jm();
    AZ();
    Xl();
    HA();
    hw();
    g1();
    L21();
    bv();
    dN8();
    Qz();
    s4q();
    mH();
    yI();
    qH();
    zz();
    qZ();
    vf();
    Bw();
    CE1 = (gu(), k4(UQ)).BRIEF_TOOL_NAME, IE1 = {
        TURNS_SINCE_WRITE: 10,
        TURNS_BETWEEN_REMINDERS: 10
    }, t4q = {
        TURNS_BETWEEN_ATTACHMENTS: 5,
        FULL_REMINDER_EVERY_N_ATTACHMENTS: 5
    }, e4q = {
        TURNS_BETWEEN_ATTACHMENTS: 5,
        FULL_REMINDER_EVERY_N_ATTACHMENTS: 5
    }, YuY = {
        TOKEN_COOLDOWN: 5000
    }, zuY = {
        TURNS_BETWEEN_REMINDERS: 10
    };
    wuY = new Set(["prompt", "task-notification"]);
    nT6 = new Set
})
// @from(Ln 373873, Col 0)
function qp8(A) {
    if (A === "Local") return "project (local)";
    if (A === "AutoMem") return "auto memory";
    if (A === "TeamMem") return "team memory";
    return A.toLowerCase()
}
// @from(Ln 373879, Col 4)
$qq
// @from(Ln 373880, Col 4)
Kp8 = E(() => {
    $qq = ["User", "Project", "Local", "Managed", "ExperimentalUltraClaudeMd", "AutoMem", "TeamMem"]
})
// @from(Ln 373884, Col 0)
function jqq(A) {
    let q = {
            toolRequests: new Map,
            toolResults: new Map,
            humanMessages: 0,
            assistantMessages: 0,
            localCommandOutputs: 0,
            other: 0,
            attachments: new Map,
            duplicateFileReads: new Map,
            total: 0
        },
        K = new Map,
        Y = new Map,
        z = new Map;
    return A.forEach((w) => {
        if (w.type === "attachment") {
            let O = w.attachment.type || "unknown";
            q.attachments.set(O, (q.attachments.get(O) || 0) + 1)
        }
    }), cM(A).forEach((w) => {
        let {
            content: O
        } = w.message;
        if (typeof O === "string") {
            let $ = j5(O);
            if (q.total += $, w.type === "user" && O.includes("local-command-stdout")) q.localCommandOutputs += $;
            else q[w.type === "user" ? "humanMessages" : "assistantMessages"] += $
        } else O.forEach(($) => OmY($, w, q, K, Y, z))
    }), z.forEach((w, O) => {
        if (w.count > 1) {
            let H = Math.floor(w.totalTokens / w.count) * (w.count - 1);
            q.duplicateFileReads.set(O, {
                count: w.count,
                tokens: H
            })
        }
    }), q
}
// @from(Ln 373924, Col 0)
function OmY(A, q, K, Y, z, _) {
    let w = j5(B6(A));
    switch (K.total += w, A.type) {
        case "text":
            if (q.type === "user" && "text" in A && A.text.includes("local-command-stdout")) K.localCommandOutputs += w;
            else K[q.type === "user" ? "humanMessages" : "assistantMessages"] += w;
            break;
        case "tool_use": {
            if ("name" in A && "id" in A) {
                let O = A.name || "unknown";
                if (Hqq(K.toolRequests, O, w), Y.set(A.id, O), O === "Read" && "input" in A && A.input && typeof A.input === "object" && "file_path" in A.input) {
                    let $ = String(A.input.file_path);
                    z.set(A.id, $)
                }
            }
            break
        }
        case "tool_result": {
            if ("tool_use_id" in A) {
                let O = Y.get(A.tool_use_id) || "unknown";
                if (Hqq(K.toolResults, O, w), O === "Read") {
                    let $ = z.get(A.tool_use_id);
                    if ($) {
                        let H = _.get($) || {
                            count: 0,
                            totalTokens: 0
                        };
                        _.set($, {
                            count: H.count + 1,
                            totalTokens: H.totalTokens + w
                        })
                    }
                }
            }
            break
        }
        case "image":
        case "server_tool_use":
        case "web_search_tool_result":
        case "search_result":
        case "document":
        case "thinking":
        case "redacted_thinking":
        case "code_execution_tool_result":
        case "mcp_tool_use":
        case "mcp_tool_result":
        case "container_upload":
        case "web_fetch_tool_result":
        case "bash_code_execution_tool_result":
        case "text_editor_code_execution_tool_result":
        case "tool_search_tool_result":
        case "compaction":
            K.other += w;
            break
    }
}
// @from(Ln 373981, Col 0)
function Hqq(A, q, K) {
    A.set(q, (A.get(q) || 0) + K)
}
// @from(Ln 373985, Col 0)
function Jqq(A) {
    let q = {
        total_tokens: A.total,
        human_message_tokens: A.humanMessages,
        assistant_message_tokens: A.assistantMessages,
        local_command_output_tokens: A.localCommandOutputs,
        other_tokens: A.other
    };
    A.attachments.forEach((Y, z) => {
        q[`attachment_${z}_count`] = Y
    }), A.toolRequests.forEach((Y, z) => {
        q[`tool_request_${z}_tokens`] = Y
    }), A.toolResults.forEach((Y, z) => {
        q[`tool_result_${z}_tokens`] = Y
    });
    let K = [...A.duplicateFileReads.values()].reduce((Y, z) => Y + z.tokens, 0);
    if (q.duplicate_read_tokens = K, q.duplicate_read_file_count = A.duplicateFileReads.size, A.total > 0) {
        q.human_message_percent = Math.round(A.humanMessages / A.total * 100), q.assistant_message_percent = Math.round(A.assistantMessages / A.total * 100), q.local_command_output_percent = Math.round(A.localCommandOutputs / A.total * 100), q.duplicate_read_percent = Math.round(K / A.total * 100);
        let Y = [...A.toolRequests.values()].reduce((_, w) => _ + w, 0),
            z = [...A.toolResults.values()].reduce((_, w) => _ + w, 0);
        q.tool_request_percent = Math.round(Y / A.total * 100), q.tool_result_percent = Math.round(z / A.total * 100), A.toolRequests.forEach((_, w) => {
            q[`tool_request_${w}_percent`] = Math.round(_ / A.total * 100)
        }), A.toolResults.forEach((_, w) => {
            q[`tool_result_${w}_percent`] = Math.round(_ / A.total * 100)
        })
    }
    return q
}
// @from(Ln 374013, Col 4)
Mqq = E(() => {
    Hf();
    JA();
    g1()
})
// @from(Ln 374019, Col 0)
function JmY(A) {
    return A.map((q) => {
        if (q.type !== "user") return q;
        let K = q.message.content;
        if (!Array.isArray(K)) return q;
        let Y = !1,
            z = K.flatMap((_) => {
                if (_.type === "image") return Y = !0, [{
                    type: "text",
                    text: "[image]"
                }];
                if (_.type === "document") return Y = !0, [{
                    type: "text",
                    text: "[document]"
                }];
                if (_.type === "tool_result" && Array.isArray(_.content)) {
                    let w = !1,
                        O = _.content.map(($) => {
                            if ($.type === "image") return w = !0, {
                                type: "text",
                                text: "[image]"
                            };
                            if ($.type === "document") return w = !0, {
                                type: "text",
                                text: "[document]"
                            };
                            return $
                        });
                    if (w) return Y = !0, [{
                        ..._,
                        content: O
                    }]
                }
                return [_]
            });
        if (!Y) return q;
        return {
            ...q,
            message: {
                ...q.message,
                content: z
            }
        }
    })
}
// @from(Ln 374065, Col 0)
function jl(A) {
    return [A.boundaryMarker, ...A.summaryMessages, ...A.messagesToKeep ?? [], ...A.attachments, ...A.hookResults]
}
// @from(Ln 374069, Col 0)
function Yp8(A, q, K) {
    let Y = K ?? [];
    if (Y.length === 0) return A;
    return {
        ...A,
        compactMetadata: {
            ...A.compactMetadata,
            preservedSegment: {
                headUuid: Y[0].uuid,
                anchorUuid: q,
                tailUuid: Y[Y.length - 1].uuid
            }
        }
    }
}
// @from(Ln 374085, Col 0)
function zp8(A, q) {
    if (!q) return A || void 0;
    if (!A) return q;
    return `${A}

${q}`
}
// @from(Ln 374092, Col 0)
async function mf6(A, q, K, Y, z, _ = !1, w) {
    try {
        if (A.length === 0) throw Error(aT6);
        let O = eW(A),
            $ = jqq(A),
            H = {};
        try {
            H = Jqq($)
        } catch (Y6) {
            _6(Y6)
        }
        let j = q.getAppState();
        QP1(j.toolPermissionContext, "summary"), q.onCompactProgress?.({
            type: "hooks_start",
            hookType: "pre_compact"
        }), q.setSDKStatus?.("compacting");
        let J = await sT6({
            trigger: _ ? "auto" : "manual",
            customInstructions: z ?? null
        }, q.abortController.signal);
        z = zp8(z, J.newCustomInstructions);
        let M = J.userDisplayMessage;
        q.setStreamMode?.("requesting"), q.setResponseLength?.(() => 0), q.onCompactProgress?.({
            type: "compact_start"
        });
        let D = w8("tengu_compact_cache_prefix", !1),
            X = C54(z),
            P = p1({
                content: X
            }),
            W = await Gqq({
                messages: A,
                summaryRequest: P,
                appState: j,
                context: q,
                preCompactTokenCount: O,
                cacheSafeParams: K
            }),
            Z = BE1(W);
        if (!Z) throw k(`Compact failed: no summary text in response. Response: ${B6(W)}`, {
            level: "error"
        }), d("tengu_compact_failed", {
            reason: "no_summary",
            preCompactTokenCount: O,
            promptCacheSharingEnabled: D
        }), Error("Failed to generate conversation summary - response did not contain valid text content");
        else if (Z.startsWith(j$)) throw d("tengu_compact_failed", {
            reason: "api_error",
            preCompactTokenCount: O,
            promptCacheSharingEnabled: D
        }), Error(Z);
        else if (Z.startsWith(EB)) throw d("tengu_compact_failed", {
            reason: "prompt_too_long",
            preCompactTokenCount: O,
            promptCacheSharingEnabled: D
        }), Error(Pqq);
        let G = mf8(q.readFileState);
        q.readFileState.clear(), Oc();
        let [f, v] = await Promise.all([fqq(G, q, Xqq), Nqq(q)]), N = [...f, ...v], V = mE1(q.agentId);
        if (V) N.push(V);
        let L = await vqq(q);
        if (L) N.push(L);
        let h = Tqq(q.agentId);
        if (h) N.push(h);
        for (let Y6 of xE1(q.options.tools, q.options.mainLoopModel, [])) N.push(f4(Y6));
        for (let Y6 of uE1(q.options.mcpClients, q.options.tools, q.options.mainLoopModel, [])) N.push(f4(Y6));
        q.onCompactProgress?.({
            type: "hooks_start",
            hookType: "session_start"
        });
        let R = await C0("compact", {
                model: q.options.mainLoopModel
            }),
            u = Ri6(_ ? "auto" : "manual", O ?? 0, A[A.length - 1]?.uuid),
            I = zF(A);
        if (I.size > 0) u.compactMetadata.preCompactDiscoveredTools = [...I].sort();
        let g = Cz(),
            B = [p1({
                content: sF6(Z, Y, g),
                isCompactSummary: !0,
                isVisibleInTranscriptOnly: !0
            })],
            b = Ck([W]),
            p = GF6([u, ...B, ...N, ...R]),
            Q = Rd(W),
            U = w?.querySource ?? q.options.querySource ?? "unknown";
        d("tengu_compact", {
            preCompactTokenCount: O,
            postCompactTokenCount: b,
            truePostCompactTokenCount: p,
            autoCompactThreshold: w?.autoCompactThreshold ?? -1,
            willRetriggerNextTurn: w !== void 0 && p >= w.autoCompactThreshold,
            isAutoCompact: _,
            querySource: U,
            queryChainId: q.queryTracking?.chainId ?? "",
            queryDepth: q.queryTracking?.depth ?? -1,
            isRecompactionInChain: w?.isRecompactionInChain ?? !1,
            turnsSincePreviousCompact: w?.turnsSincePreviousCompact ?? -1,
            previousCompactTurnId: w?.previousCompactTurnId ?? "",
            compactionInputTokens: Q?.input_tokens,
            compactionOutputTokens: Q?.output_tokens,
            compactionCacheReadTokens: Q?.cache_read_input_tokens ?? 0,
            compactionCacheCreationTokens: Q?.cache_creation_input_tokens ?? 0,
            compactionTotalTokens: Q ? Q.input_tokens + (Q.cache_creation_input_tokens ?? 0) + (Q.cache_read_input_tokens ?? 0) + Q.output_tokens : 0,
            promptCacheSharingEnabled: D,
            ...H
        }), gE1(), q.onCompactProgress?.({
            type: "hooks_start",
            hookType: "post_compact"
        });
        let r = await FE1({
                trigger: _ ? "auto" : "manual",
                compactSummary: Z
            }, q.abortController.signal),
            e = [M, r.userDisplayMessage].filter(Boolean).join(`
`);
        return {
            boundaryMarker: u,
            summaryMessages: B,
            attachments: N,
            hookResults: R,
            userDisplayMessage: e || void 0,
            preCompactTokenCount: O,
            postCompactTokenCount: b,
            truePostCompactTokenCount: p,
            compactionUsage: Q
        }
    } catch (O) {
        if (!_) Zqq(O, q);
        throw O
    } finally {
        q.setStreamMode?.("requesting"), q.setResponseLength?.(() => 0), q.onCompactProgress?.({
            type: "compact_end"
        }), q.setSDKStatus?.(null)
    }
}
// @from(Ln 374228, Col 0)
async function Wqq(A, q, K, Y, z) {
    try {
        let _ = A.slice(q),
            w = A.slice(0, q);
        if (_.length === 0) throw Error("Nothing to summarize after the selected message.");
        let O = eW(A);
        K.onCompactProgress?.({
            type: "hooks_start",
            hookType: "pre_compact"
        }), K.setSDKStatus?.("compacting");
        let $ = await sT6({
                trigger: "manual",
                customInstructions: null
            }, K.abortController.signal),
            H;
        if ($.newCustomInstructions && z) H = `${$.newCustomInstructions}

User context: ${z}`;
        else if ($.newCustomInstructions) H = $.newCustomInstructions;
        else if (z) H = `User context: ${z}`;
        K.setStreamMode?.("requesting"), K.setResponseLength?.(() => 0), K.onCompactProgress?.({
            type: "compact_start"
        });
        let j = S54(H),
            J = p1({
                content: j
            }),
            M = await Gqq({
                messages: A,
                summaryRequest: J,
                appState: K.getAppState(),
                context: K,
                preCompactTokenCount: O,
                cacheSafeParams: Y
            }),
            D = BE1(M);
        if (!D) throw d("tengu_partial_compact_failed", {
            reason: "no_summary",
            preCompactTokenCount: O
        }), Error("Failed to generate conversation summary - response did not contain valid text content");
        else if (D.startsWith(j$)) throw d("tengu_partial_compact_failed", {
            reason: "api_error",
            preCompactTokenCount: O
        }), Error(D);
        else if (D.startsWith(EB)) throw d("tengu_partial_compact_failed", {
            reason: "prompt_too_long",
            preCompactTokenCount: O
        }), Error(Pqq);
        let X = mf8(K.readFileState);
        K.readFileState.clear(), Oc();
        let [P, W] = await Promise.all([fqq(X, K, Xqq), Nqq(K)]), Z = [...P, ...W], G = mE1(K.agentId);
        if (G) Z.push(G);
        let f = await vqq(K);
        if (f) Z.push(f);
        let v = Tqq(K.agentId);
        if (v) Z.push(v);
        for (let B of xE1(K.options.tools, K.options.mainLoopModel, w)) Z.push(f4(B));
        for (let B of uE1(K.options.mcpClients, K.options.tools, K.options.mainLoopModel, w)) Z.push(f4(B));
        K.onCompactProgress?.({
            type: "hooks_start",
            hookType: "session_start"
        });
        let N = await C0("compact", {
                model: K.options.mainLoopModel
            }),
            V = Ck([M]),
            L = Rd(M);
        d("tengu_partial_compact", {
            preCompactTokenCount: O,
            postCompactTokenCount: V,
            messagesKept: w.length,
            messagesSummarized: _.length,
            trigger: "message_selector",
            compactionInputTokens: L?.input_tokens,
            compactionOutputTokens: L?.output_tokens,
            compactionCacheReadTokens: L?.cache_read_input_tokens ?? 0,
            compactionCacheCreationTokens: L?.cache_creation_input_tokens ?? 0
        });
        let h = Ri6("manual", O ?? 0, w[w.length - 1]?.uuid, z, _.length),
            R = zF(A);
        if (R.size > 0) h.compactMetadata.preCompactDiscoveredTools = [...R].sort();
        let u = Cz(),
            I = [p1({
                content: sF6(D, !1, u),
                isCompactSummary: !0,
                ...w.length > 0 ? {
                    summarizeMetadata: {
                        messagesSummarized: _.length,
                        userContext: z
                    }
                } : {
                    isVisibleInTranscriptOnly: !0
                }
            })];
        gE1(), K.onCompactProgress?.({
            type: "hooks_start",
            hookType: "post_compact"
        });
        let g = await FE1({
            trigger: "manual",
            compactSummary: D
        }, K.abortController.signal);
        return {
            boundaryMarker: Yp8(h, h.uuid, w),
            summaryMessages: I,
            messagesToKeep: w,
            attachments: Z,
            hookResults: N,
            userDisplayMessage: g.userDisplayMessage,
            preCompactTokenCount: O,
            postCompactTokenCount: V,
            compactionUsage: L
        }
    } catch (_) {
        throw Zqq(_, K), _
    } finally {
        K.setStreamMode?.("requesting"), K.setResponseLength?.(() => 0), K.onCompactProgress?.({
            type: "compact_end"
        }), K.setSDKStatus?.(null)
    }
}
// @from(Ln 374350, Col 0)
function Zqq(A, q) {
    if (!$r(A, zl) && !$r(A, aT6)) q.addNotification?.({
        key: "error-compacting-conversation",
        text: "Error compacting conversation",
        priority: "immediate",
        color: "error"
    })
}
// @from(Ln 374359, Col 0)
function MmY() {
    return async () => ({
        behavior: "deny",
        message: "Tool use is not allowed during compaction",
        decisionReason: {
            type: "other",
            reason: "compaction agent should only produce text summary"
        }
    })
}
// @from(Ln 374369, Col 0)
async function Gqq({
    messages: A,
    summaryRequest: q,
    appState: K,
    context: Y,
    preCompactTokenCount: z,
    cacheSafeParams: _
}) {
    let w = w8("tengu_compact_cache_prefix", !1),
        O = v4q() ? setInterval(() => {
            T4q()
        }, 50000) : void 0;
    try {
        if (w) try {
            let j = await av({
                    promptMessages: [q],
                    cacheSafeParams: _,
                    canUseTool: MmY(),
                    querySource: "compact",
                    forkLabel: "compact",
                    maxTurns: 1,
                    skipCacheWrite: !0
                }),
                J = bX(j.messages);
            if (J && BE1(J)) return d("tengu_compact_cache_sharing_success", {
                preCompactTokenCount: z,
                outputTokens: j.totalUsage.output_tokens,
                cacheReadInputTokens: j.totalUsage.cache_read_input_tokens,
                cacheCreationInputTokens: j.totalUsage.cache_creation_input_tokens,
                cacheHitRate: j.totalUsage.cache_read_input_tokens > 0 ? j.totalUsage.cache_read_input_tokens / (j.totalUsage.cache_read_input_tokens + j.totalUsage.cache_creation_input_tokens + j.totalUsage.input_tokens) : 0
            }), J;
            k(`Compact cache sharing: no text in response, falling back. Response: ${B6(J)}`, {
                level: "warn"
            }), d("tengu_compact_cache_sharing_fallback", {
                reason: "no_text_response",
                preCompactTokenCount: z
            })
        } catch (j) {
            _6(j), d("tengu_compact_cache_sharing_fallback", {
                reason: "error",
                preCompactTokenCount: z
            })
        }
        let $ = w8("tengu_compact_streaming_retry", !1),
            H = $ ? jmY : 1;
        for (let j = 1; j <= H; j++) {
            let J = !1,
                M;
            Y.setResponseLength?.(() => 0);
            let X = await yi6(Y.options.mainLoopModel, Y.options.tools, async () => K.toolPermissionContext, Y.options.agentDefinitions.activeAgents, "compact") ? K0([L9, Tp6, ...K.mcp.tools], "name") : [L9],
                W = NT6({
                    messages: cM(JmY([...fN(A), q])),
                    systemPrompt: uq(["You are a helpful AI assistant tasked with summarizing conversations."]),
                    thinkingConfig: {
                        type: "disabled"
                    },
                    tools: X,
                    signal: Y.abortController.signal,
                    options: {
                        async getToolPermissionContext() {
                            return Y.getAppState().toolPermissionContext
                        },
                        model: Y.options.mainLoopModel,
                        toolChoice: void 0,
                        isNonInteractiveSession: Y.options.isNonInteractiveSession,
                        hasAppendSystemPrompt: !!Y.options.appendSystemPrompt,
                        maxOutputTokensOverride: Math.min(Vqq, Li6(Y.options.mainLoopModel)),
                        querySource: "compact",
                        agents: Y.options.agentDefinitions.activeAgents,
                        mcpTools: [],
                        effortValue: K.effortValue
                    }
                })[Symbol.asyncIterator](),
                Z = await W.next();
            while (!Z.done) {
                let G = Z.value;
                if (!J && G.type === "stream_event" && G.event.type === "content_block_start" && G.event.content_block.type === "text") J = !0, Y.setStreamMode?.("responding");
                if (G.type === "stream_event" && G.event.type === "content_block_delta" && G.event.delta.type === "text_delta") {
                    let f = G.event.delta.text.length;
                    Y.setResponseLength?.((v) => v + f)
                }
                if (G.type === "assistant") M = G;
                Z = await W.next()
            }
            if (M) return M;
            if (j < H) {
                d("tengu_compact_streaming_retry", {
                    attempt: j,
                    preCompactTokenCount: z,
                    hasStartedStreaming: J
                }), await uk(VI(j), Y.abortController.signal);
                continue
            }
            throw k(`Compact streaming failed after ${j} attempts. hasStartedStreaming=${J}`, {
                level: "error"
            }), d("tengu_compact_failed", {
                reason: "no_streaming_response",
                preCompactTokenCount: z,
                hasStartedStreaming: J,
                retryEnabled: $,
                attempts: j,
                promptCacheSharingEnabled: !1
            }), Error(oT6)
        }
        throw Error(oT6)
    } finally {
        clearInterval(O)
    }
}
// @from(Ln 374478, Col 0)
async function fqq(A, q, K) {
    let Y = Object.entries(A).map(([w, O]) => ({
            filename: w,
            ...O
        })).filter((w) => !DmY(w.filename, q.agentId)).sort((w, O) => O.timestamp - w.timestamp).slice(0, K),
        z = await Promise.all(Y.map(async (w) => {
            let O = await tF8(w.filename, {
                ...q,
                fileReadingLimits: {
                    maxTokens: HmY
                }
            }, "tengu_post_compact_file_restore_success", "tengu_post_compact_file_restore_error", "compact");
            return O ? f4(O) : null
        })),
        _ = 0;
    return z.filter((w) => {
        if (w === null) return !1;
        let O = j5(B6(w));
        if (_ + O <= $mY) return _ += O, !0;
        return !1
    })
}
// @from(Ln 374501, Col 0)
function mE1(A) {
    let q = sJ(A);
    if (!q) return null;
    let K = Fj(A);
    return f4({
        type: "plan_file_reference",
        planFilePath: K,
        planContent: q
    })
}
// @from(Ln 374512, Col 0)
function Tqq(A) {
    let q = St6(A);
    if (q.size === 0) return null;
    let K = Array.from(q.values()).sort((Y, z) => z.invokedAt - Y.invokedAt).map((Y) => ({
        name: Y.skillName,
        path: Y.skillPath,
        content: Y.content
    }));
    return f4({
        type: "invoked_skills",
        skills: K
    })
}
// @from(Ln 374525, Col 0)
async function vqq(A) {
    if (A.getAppState().toolPermissionContext.mode !== "plan") return null;
    let K = Fj(A.agentId),
        Y = sJ(A.agentId) !== null;
    return f4({
        type: "plan_mode",
        reminderType: "full",
        isSubAgent: !!A.agentId,
        planFilePath: K,
        planExists: Y
    })
}
// @from(Ln 374537, Col 0)
async function Nqq(A) {
    let q = A.getAppState();
    return Object.values(q.tasks).filter((Y) => Y.type === "local_agent").flatMap((Y) => {
        if (Y.retrieved) return [];
        let {
            status: z
        } = Y;
        if (z === "completed" || z === "failed" || z === "killed") return [f4({
            type: "task_status",
            taskId: Y.agentId,
            taskType: "local_agent",
            description: Y.description,
            status: z,
            deltaSummary: Y.error ?? null
        })];
        return []
    })
}
// @from(Ln 374556, Col 0)
function DmY(A, q) {
    let K = L4(A);
    try {
        let Y = L4(Fj(q));
        if (K === Y) return !0
    } catch {}
    try {
        if (new Set($qq.map((z) => L4(PI(z)))).has(K)) return !0
    } catch {}
    return !1
}
// @from(Ln 374567, Col 4)
Xqq = 5
// @from(Ln 374568, Col 4)
$mY = 50000
// @from(Ln 374569, Col 4)
HmY = 5000
// @from(Ln 374570, Col 4)
jmY = 2
// @from(Ln 374571, Col 4)
aT6 = "Not enough messages to compact."
// @from(Ln 374572, Col 4)
Pqq = "Conversation too long. Press esc twice to go up a few messages and try again."
// @from(Ln 374573, Col 4)
zl = "API Error: Request was aborted."
// @from(Ln 374574, Col 4)
oT6 = "Compaction interrupted · This may be due to network issues — please try again."
// @from(Ln 374575, Col 4)
_l = E(() => {
    dd();
    gw();
    bt();
    yB();
    JA();
    V1();
    vN8();
    s8();
    AZ();
    RI();
    pP1();
    fR();
    tP();
    ZV8();
    M0();
    k8();
    rH();
    F9();
    Kp8();
    xJ();
    Hf();
    Mqq();
    k1();
    H1();
    HA();
    Ud();
    uv();
    hw();
    FT6();
    y66();
    T1();
    Oq();
    g1();
    gR()
})
// @from(Ln 374612, Col 0)
function Lqq() {
    return kqq
}
// @from(Ln 374616, Col 0)
function K16(A) {
    kqq = A
}
// @from(Ln 374620, Col 0)
function Rqq() {
    pE1 = Date.now()
}
// @from(Ln 374624, Col 0)
function hqq() {
    pE1 = void 0
}
// @from(Ln 374627, Col 0)
async function Sqq() {
    let A = Date.now();
    while (pE1) {
        if (Date.now() - pE1 > PmY) return;
        if (Date.now() - A > XmY) return;
        await new Promise((K) => setTimeout(K, 1000))
    }
}
// @from(Ln 374635, Col 0)
async function QE1() {
    let A = $1(),
        q = Av6();
    try {
        let K = await A.readFile(q, {
            encoding: "utf-8"
        });
        return d("tengu_session_memory_loaded", {
            content_length: K.length
        }), K
    } catch (K) {
        let Y = K.code;
        if (Y === "ENOENT" || Y === "EACCES" || Y === "EPERM") return null;
        throw K
    }
}
// @from(Ln 374652, Col 0)
function Cqq(A) {
    tT6 = {
        ...tT6,
        ...A
    }
}
// @from(Ln 374659, Col 0)
function Iqq() {
    return {
        ...tT6
    }
}
// @from(Ln 374665, Col 0)
function bqq(A) {
    Eqq = A
}
// @from(Ln 374669, Col 0)
function xqq() {
    return yqq
}
// @from(Ln 374673, Col 0)
function uqq() {
    yqq = !0
}
// @from(Ln 374677, Col 0)
function mqq(A) {
    return A >= tT6.minimumMessageTokensToInit
}
// @from(Ln 374681, Col 0)
function Bqq(A) {
    return A - Eqq >= tT6.minimumTokensBetweenUpdate
}
// @from(Ln 374685, Col 0)
function gqq() {
    return tT6.toolCallsBetweenUpdates
}
// @from(Ln 374688, Col 4)
XmY = 15000
// @from(Ln 374689, Col 4)
PmY = 60000
// @from(Ln 374690, Col 4)
hi6
// @from(Ln 374690, Col 9)
tT6
// @from(Ln 374690, Col 14)
kqq
// @from(Ln 374690, Col 19)
pE1
// @from(Ln 374690, Col 24)
Eqq = 0
// @from(Ln 374691, Col 4)
yqq = !1
// @from(Ln 374692, Col 4)
eT6 = E(() => {
    SA();
    RY();
    V1();
    hi6 = {
        minimumMessageTokensToInit: 1e4,
        minimumTokensBetweenUpdate: 5000,
        toolCallsBetweenUpdates: 3
    }, tT6 = {
        ...hi6
    }
})
// @from(Ln 374711, Col 0)
function Qqq() {
    return `IMPORTANT: This message and these instructions are NOT part of the actual user conversation. Do NOT include any references to "note-taking", "session notes extraction", or these update instructions in the notes content.

Based on the user conversation above (EXCLUDING this note-taking instruction message as well as system prompt, claude.md entries, or any past session summaries), update the session notes file.

The file {{notesPath}} has already been read for you. Here are its current contents:
<current_notes_content>
{{currentNotes}}
</current_notes_content>

Your ONLY task is to use the Edit tool to update the notes file, then stop. You can make multiple edits (update every section as needed) - make all Edit tool calls in parallel in a single message. Do not call any other tools.

CRITICAL RULES FOR EDITING:
- The file must maintain its exact structure with all sections, headers, and italic descriptions intact
-- NEVER modify, delete, or add section headers (the lines starting with '#' like # Task specification)
-- NEVER modify or delete the italic _section description_ lines (these are the lines in italics immediately following each header - they start and end with underscores)
-- The italic _section descriptions_ are TEMPLATE INSTRUCTIONS that must be preserved exactly as-is - they guide what content belongs in each section
-- ONLY update the actual content that appears BELOW the italic _section descriptions_ within each existing section
-- Do NOT add any new sections, summaries, or information outside the existing structure
- Do NOT reference this note-taking process or instructions anywhere in the notes
- It's OK to skip updating a section if there are no substantial new insights to add. Do not add filler content like "No info yet", just leave sections blank/unedited if appropriate.
- Write DETAILED, INFO-DENSE content for each section - include specifics like file paths, function names, error messages, exact commands, technical details, etc.
- For "Key results", include the complete, exact output the user requested (e.g., full table, full answer, etc.)
- Do not include information that's already in the CLAUDE.md files included in the context
- Keep each section under ~${UE1} tokens/words - if a section is approaching this limit, condense it by cycling out less important details while preserving the most critical information
- Focus on actionable, specific information that would help someone understand or recreate the work discussed in the conversation
- IMPORTANT: Always update "Current State" to reflect the most recent work - this is critical for continuity after compaction

Use the Edit tool with file_path: {{notesPath}}

STRUCTURE PRESERVATION REMINDER:
Each section has TWO parts that must be preserved exactly as they appear in the current file:
1. The section header (line starting with #)
2. The italic description line (the _italicized text_ immediately after the header - this is a template instruction)

You ONLY update the actual content that comes AFTER these two preserved lines. The italic description lines starting and ending with underscores are part of the template structure, NOT content to be edited or removed.

REMEMBER: Use the Edit tool in parallel and stop. Do not continue after the edits. Only include insights from the actual user conversation, never from these note-taking instructions. Do not delete or change section headers or italic _section descriptions_.`
}
// @from(Ln 374750, Col 0)
async function _p8() {
    let A = dqq(c8(), "session-memory", "config", "template.md");
    try {
        return await cqq(A, {
            encoding: "utf-8"
        })
    } catch (q) {
        if (q.code === "ENOENT") return pqq;
        return _6(q instanceof Error ? q : Error(`Failed to load custom session memory template: ${q}`)), pqq
    }
}
// @from(Ln 374761, Col 0)
async function WmY() {
    let A = dqq(c8(), "session-memory", "config", "prompt.md");
    try {
        return await cqq(A, {
            encoding: "utf-8"
        })
    } catch (q) {
        if (q.code === "ENOENT") return Qqq();
        return _6(q instanceof Error ? q : Error(`Failed to load custom session memory prompt: ${q}`)), Qqq()
    }
}
// @from(Ln 374773, Col 0)
function ZmY(A) {
    let q = {},
        K = A.split(`
`),
        Y = "",
        z = [];
    for (let _ of K)
        if (_.startsWith("# ")) {
            if (Y && z.length > 0) {
                let w = z.join(`
`).trim();
                q[Y] = j5(w)
            }
            Y = _, z = []
        } else z.push(_);
    if (Y && z.length > 0) {
        let _ = z.join(`
`).trim();
        q[Y] = j5(_)
    }
    return q
}
// @from(Ln 374796, Col 0)
function GmY(A, q) {
    let K = q > Fqq,
        Y = Object.entries(A).filter(([_, w]) => w > UE1).sort(([, _], [, w]) => w - _).map(([_, w]) => `- "${_}" is ~${w} tokens (limit: ${UE1})`);
    if (Y.length === 0 && !K) return "";
    let z = [];
    if (K) z.push(`

CRITICAL: The session memory file is currently ~${q} tokens, which exceeds the maximum of ${Fqq} tokens. You MUST condense the file to fit within this budget. Aggressively shorten oversized sections by removing less important details, merging related items, and summarizing older entries. Prioritize keeping "Current State" and "Errors & Corrections" accurate and detailed.`);
    if (Y.length > 0) z.push(`

${K?"Oversized sections to condense":"IMPORTANT: The following sections exceed the per-section limit and MUST be condensed"}:
${Y.join(`
`)}`);
    return z.join("")
}
// @from(Ln 374812, Col 0)
function fmY(A, q) {
    return A.replace(/\{\{(\w+)\}\}/g, (K, Y) => Object.prototype.hasOwnProperty.call(q, Y) ? q[Y] : K)
}
// @from(Ln 374815, Col 0)
async function lqq(A) {
    let q = await _p8();
    return A.trim() === q.trim()
}
// @from(Ln 374819, Col 0)
async function iqq(A, q) {
    let K = await WmY(),
        Y = ZmY(A),
        z = j5(A),
        _ = GmY(Y, z);
    return fmY(K, {
        currentNotes: A,
        notesPath: q
    }) + _
}
// @from(Ln 374830, Col 0)
function nqq(A) {
    let q = A.split(`
`),
        K = UE1 * 4,
        Y = [],
        z = [],
        _ = "",
        w = !1;
    for (let $ of q)
        if ($.startsWith("# ")) {
            let H = Uqq(_, z, K);
            Y.push(...H.lines), w = w || H.wasTruncated, _ = $, z = []
        } else z.push($);
    let O = Uqq(_, z, K);
    return Y.push(...O.lines), w = w || O.wasTruncated, {
        truncatedContent: Y.join(`
`),
        wasTruncated: w
    }
}
// @from(Ln 374851, Col 0)
function Uqq(A, q, K) {
    if (!A) return {
        lines: q,
        wasTruncated: !1
    };
    if (q.join(`
`).length <= K) return {
        lines: [A, ...q],
        wasTruncated: !1
    };
    let z = 0,
        _ = [A];
    for (let w of q) {
        if (z + w.length + 1 > K) break;
        _.push(w), z += w.length + 1
    }
    return _.push(`
[... section truncated for length ...]`), {
        lines: _,
        wasTruncated: !0
    }
}
// @from(Ln 374873, Col 4)
UE1 = 2000
// @from(Ln 374874, Col 4)
Fqq = 12000
// @from(Ln 374875, Col 4)
pqq = `
# Session Title
_A short and distinctive 5-10 word descriptive title for the session. Super info dense, no filler_

# Current State
_What is actively being worked on right now? Pending tasks not yet completed. Immediate next steps._

# Task specification
_What did the user ask to build? Any design decisions or other explanatory context_

# Files and Functions
_What are the important files? In short, what do they contain and why are they relevant?_

# Workflow
_What bash commands are usually run and in what order? How to interpret their output if not obvious?_

# Errors & Corrections
_Errors encountered and how they were fixed. What did the user correct? What approaches failed and should not be tried again?_

# Codebase and System Documentation
_What are the important system components? How do they work/fit together?_

# Learnings
_What has worked well? What has not? What to avoid? Do not duplicate items from other sections_

# Key results
_If the user asked a specific output such as an answer to a question, a table, or other document, repeat the exact result here_

# Worklog
_Step by step, what was attempted, done? Very terse summary for each step_
`
// @from(Ln 374906, Col 4)
wp8 = E(() => {
    A8();
    k1();
    Hf()
})
// @from(Ln 374912, Col 0)
function TmY(A) {
    $p8 = {
        ...$p8,
        ...A
    }
}
// @from(Ln 374919, Col 0)
function vmY() {
    return {
        ...$p8
    }
}
// @from(Ln 374924, Col 0)
async function NmY() {
    if (rqq) return;
    rqq = !0;
    let A = await rR("tengu_sm_compact_config", {}),
        q = {
            minTokens: A.minTokens && A.minTokens > 0 ? A.minTokens : dE1.minTokens,
            minTextBlockMessages: A.minTextBlockMessages && A.minTextBlockMessages > 0 ? A.minTextBlockMessages : dE1.minTextBlockMessages,
            maxTokens: A.maxTokens && A.maxTokens > 0 ? A.maxTokens : dE1.maxTokens
        };
    TmY(q)
}
// @from(Ln 374936, Col 0)
function oqq(A) {
    if (A.type === "assistant") return A.message.content.some((K) => K.type === "text");
    if (A.type === "user") {
        let q = A.message.content;
        if (typeof q === "string") return q.length > 0;
        if (Array.isArray(q)) return q.some((K) => K.type === "text")
    }
    return !1
}
// @from(Ln 374946, Col 0)
function VmY(A) {
    if (A.type !== "user") return [];
    let q = A.message.content;
    if (!Array.isArray(q)) return [];
    let K = [];
    for (let Y of q)
        if (Y.type === "tool_result") K.push(Y.tool_use_id);
    return K
}
// @from(Ln 374956, Col 0)
function kmY(A, q) {
    if (A.type !== "assistant") return !1;
    let K = A.message.content;
    if (!Array.isArray(K)) return !1;
    return K.some((Y) => Y.type === "tool_use" && q.has(Y.id))
}
// @from(Ln 374963, Col 0)
function Op8(A, q) {
    if (q <= 0 || q >= A.length) return q;
    let K = q,
        Y = [];
    for (let _ = q; _ < A.length; _++) Y.push(...VmY(A[_]));
    if (Y.length > 0) {
        let _ = new Set;
        for (let O = K; O < A.length; O++) {
            let $ = A[O];
            if ($.type === "assistant" && Array.isArray($.message.content)) {
                for (let H of $.message.content)
                    if (H.type === "tool_use") _.add(H.id)
            }
        }
        let w = new Set(Y.filter((O) => !_.has(O)));
        for (let O = K - 1; O >= 0 && w.size > 0; O--) {
            let $ = A[O];
            if (kmY($, w)) {
                if (K = O, $.type === "assistant" && Array.isArray($.message.content)) {
                    for (let H of $.message.content)
                        if (H.type === "tool_use" && w.has(H.id)) w.delete(H.id)
                }
            }
        }
    }
    let z = new Set;
    for (let _ = K; _ < A.length; _++) {
        let w = A[_];
        if (w.type === "assistant" && w.message.id) z.add(w.message.id)
    }
    for (let _ = K - 1; _ >= 0; _--) {
        let w = A[_];
        if (w.type === "assistant" && w.message.id && z.has(w.message.id)) K = _
    }
    return K
}
// @from(Ln 375000, Col 0)
function EmY(A, q) {
    if (A.length === 0) return 0;
    let K = vmY(),
        Y = q >= 0 ? q + 1 : A.length,
        z = 0,
        _ = 0;
    for (let O = Y; O < A.length; O++) {
        let $ = A[O];
        if (z += Nf6([$]), oqq($)) _++
    }
    if (z >= K.maxTokens) return Op8(A, Y);
    if (z >= K.minTokens && _ >= K.minTextBlockMessages) return Op8(A, Y);
    let w = 0;
    for (let O = A.length - 1; O >= 0; O--)
        if (RZ(A[O])) {
            w = O + 1;
            break
        } for (let O = Y - 1; O >= w; O--) {
        let $ = A[O],
            H = Nf6([$]);
        if (z += H, oqq($)) _++;
        if (Y = O, z >= K.maxTokens) break;
        if (z >= K.minTokens && _ >= K.minTextBlockMessages) break
    }
    return Op8(A, Y)
}
// @from(Ln 375027, Col 0)
function cE1() {
    if (t6(process.env.ENABLE_CLAUDE_CODE_SM_COMPACT)) return !0;
    if (t6(process.env.DISABLE_CLAUDE_CODE_SM_COMPACT)) return !1;
    let A = w8("tengu_session_memory", !1),
        q = w8("tengu_sm_compact", !1);
    return A && q
}
// @from(Ln 375035, Col 0)
function ymY(A, q, K, Y, z, _) {
    let w = Ck(A),
        O = Ri6("auto", w ?? 0, A[A.length - 1]?.uuid),
        $ = zF(A);
    if ($.size > 0) O.compactMetadata.preCompactDiscoveredTools = [...$].sort();
    let {
        truncatedContent: H,
        wasTruncated: j
    } = nqq(q), J = sF6(H, !0, z, !0);
    if (j) {
        let P = Av6();
        J += `

Some session memory sections were truncated for length. The full session memory can be viewed at: ${P}`
    }
    let M = [p1({
            content: J,
            isCompactSummary: !0,
            isVisibleInTranscriptOnly: !0
        })],
        D = mE1(_),
        X = D ? [D] : [];
    return {
        boundaryMarker: Yp8(O, M[M.length - 1].uuid, K),
        summaryMessages: M,
        attachments: X,
        hookResults: Y,
        messagesToKeep: K,
        preCompactTokenCount: w,
        postCompactTokenCount: Nf6(M),
        truePostCompactTokenCount: Nf6(M)
    }
}
// @from(Ln 375068, Col 0)
async function lE1(A, q, K) {
    if (!cE1()) return null;
    await NmY(), await Sqq();
    let Y = Lqq(),
        z = await QE1();
    if (!z) return d("tengu_sm_compact_no_session_memory", {}), null;
    if (await lqq(z)) return d("tengu_sm_compact_empty_template", {}), null;
    try {
        let _;
        if (Y) {
            if (_ = A.findIndex((D) => D.uuid === Y), _ === -1) return d("tengu_sm_compact_summarized_id_not_found", {}), null
        } else _ = A.length - 1, d("tengu_sm_compact_resumed_session", {});
        let w = EmY(A, _),
            O = A.slice(w).filter((D) => !RZ(D)),
            $ = await C0("compact", {
                model: cK()
            }),
            H = Cz(),
            j = ymY(A, z, O, $, H, q),
            J = jl(j),
            M = Nf6(J);
        if (K !== void 0 && M >= K) return d("tengu_sm_compact_threshold_exceeded", {
            postCompactTokenCount: M,
            autoCompactThreshold: K
        }), null;
        return {
            ...j,
            postCompactTokenCount: M,
            truePostCompactTokenCount: M
        }
    } catch (_) {
        return d("tengu_sm_compact_error", {}), null
    }
}
// @from(Ln 375102, Col 4)
dE1
// @from(Ln 375102, Col 9)
$p8
// @from(Ln 375102, Col 14)
rqq = !1
// @from(Ln 375103, Col 4)
iE1 = E(() => {
    _l();
    AZ();
    JA();
    fR();
    vN8();
    eT6();
    RY();
    wp8();
    HA();
    HA();
    V1();
    eR();
    y66();
    Oq();
    z4();
    H1();
    A8();
    s8();
    dE1 = {
        minTokens: 1e4,
        minTextBlockMessages: 5,
        maxTokens: 40000
    }, $p8 = {
        ...dE1
    }
})
// @from(Ln 375131, Col 0)
function gl(A) {
    W66(), RT6(), wW4(), rE1(), cf8(), Oc(), Lz4(), Hp8()
}
// @from(Ln 375134, Col 4)
nE1 = E(() => {
    eR();
    Yi6();
    M0();
    Ve();
    JZ();
    lM();
    up6();
    Oq()
})
// @from(Ln 375145, Col 0)
function OF(A) {
    let q = Math.min(Li6(A), RmY),
        K = uM(A, Zj()),
        Y = process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW;
    if (Y) {
        let z = parseInt(Y, 10);
        if (!isNaN(z) && z > 0) K = Math.min(K, z)
    }
    return K - q
}
// @from(Ln 375156, Col 0)
function oc6(A) {
    let q = OF(A),
        K = q - Jp8,
        Y = process.env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE;
    if (Y) {
        let z = parseFloat(Y);
        if (!isNaN(z) && z > 0 && z <= 100) {
            let _ = Math.floor(q * (z / 100));
            return Math.min(_, K)
        }
    }
    return K
}
// @from(Ln 375170, Col 0)
function mz6(A, q) {
    let K = oc6(q),
        Y = Xh() ? K : OF(q),
        z = Math.max(0, Math.round((Y - A) / Y * 100)),
        _ = Y - hmY,
        w = Y - SmY,
        O = A >= _,
        $ = A >= w,
        H = Xh() && A >= K,
        J = OF(q) - Mp8,
        M = process.env.CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE,
        D = M ? parseInt(M, 10) : NaN,
        X = !isNaN(D) && D > 0 ? D : J,
        P = A >= X;
    return {
        percentLeft: z,
        isAboveWarningThreshold: O,
        isAboveErrorThreshold: $,
        isAboveAutoCompactThreshold: H,
        isAtBlockingLimit: P
    }
}
// @from(Ln 375193, Col 0)
function Xh() {
    if (t6(process.env.DISABLE_COMPACT)) return !1;
    if (t6(process.env.DISABLE_AUTO_COMPACT)) return !1;
    return X1().autoCompactEnabled
}
// @from(Ln 375198, Col 0)
async function CmY(A, q, K, Y = 0) {
    if (K === "session_memory" || K === "compact") return !1;
    if (!Xh()) return !1;
    let z = eW(A) - Y,
        _ = oc6(q),
        w = OF(q);
    k(`autocompact: tokens=${z} threshold=${_} effectiveWindow=${w}${Y>0?` snipFreed=${Y}`:""}`);
    let {
        isAboveAutoCompactThreshold: O
    } = mz6(z, q);
    return O
}
// @from(Ln 375210, Col 0)
async function sqq(A, q, K, Y, z, _) {
    if (t6(process.env.DISABLE_COMPACT)) return {
        wasCompacted: !1
    };
    if (z?.consecutiveFailures !== void 0 && z.consecutiveFailures >= aqq) return {
        wasCompacted: !1
    };
    let w = q.options.mainLoopModel;
    if (!await CmY(A, w, Y, _)) return {
        wasCompacted: !1
    };
    let $ = {
            isRecompactionInChain: z?.compacted === !0,
            turnsSincePreviousCompact: z?.turnCounter ?? -1,
            previousCompactTurnId: z?.turnId,
            autoCompactThreshold: oc6(w),
            querySource: Y
        },
        H = await lE1(A, q.agentId, $.autoCompactThreshold);
    if (H) return K16(void 0), gl(), {
        wasCompacted: !0,
        compactionResult: H
    };
    try {
        let j = await mf6(A, q, K, !0, void 0, !0, $);
        return K16(void 0), gl(), {
            wasCompacted: !0,
            compactionResult: j,
            consecutiveFailures: 0
        }
    } catch (j) {
        if (!$r(j, zl)) _6(j);
        let M = (z?.consecutiveFailures ?? 0) + 1;
        if (M >= aqq) k(`autocompact: circuit breaker tripped after ${M} consecutive failures — skipping future attempts this session`, {
            level: "warn"
        });
        return {
            wasCompacted: !1,
            consecutiveFailures: M
        }
    }
}
// @from(Ln 375252, Col 4)
RmY = 20000
// @from(Ln 375253, Col 4)
Jp8 = 13000
// @from(Ln 375254, Col 4)
hmY = 20000
// @from(Ln 375255, Col 4)
SmY = 20000
// @from(Ln 375256, Col 4)
Mp8 = 3000
// @from(Ln 375257, Col 4)
aqq = 3
// @from(Ln 375258, Col 4)
Xl = E(() => {
    AZ();
    _l();
    k1();
    H1();
    k8();
    s8();
    gw();
    xJ();
    T1();
    A8();
    iE1();
    eT6();
    nE1();
    bt();
    HA()
})
// @from(Ln 375275, Col 4)
tqq = 344
// @from(Ln 375276, Col 0)
async function AKq({
    tools: A,
    signal: q,
    isNonInteractiveSession: K,
    lastAssistantText: Y
}) {
    if (A.length === 0) return null;
    try {
        let z = A.map(($) => {
                let H = eqq($.input, 300),
                    j = eqq($.output, 300);
                return `Tool: ${$.name}
Input: ${H}
Output: ${j}`
            }).join(`

`),
            _ = Y ? `User's intent (from assistant's last message): ${Y.slice(0,200)}

` : "";
        return (await WX({
            systemPrompt: uq([ImY]),
            userPrompt: `${_}Tools completed:

${z}

Provide a brief summary of what was accomplished:`,
            signal: q,
            options: {
                querySource: "tool_use_summary_generation",
                enablePromptCaching: !0,
                agents: [],
                isNonInteractiveSession: K,
                hasAppendSystemPrompt: !1,
                mcpTools: []
            }
        })).message.content.filter(($) => $.type === "text").map(($) => $.type === "text" ? $.text : "").join("").trim() || null
    } catch (z) {
        let _ = z instanceof Error ? z : Error(String(z));
        return _.cause = {
            errorId: tqq
        }, _6(_), null
    }
}
// @from(Ln 375321, Col 0)
function eqq(A, q) {
    try {
        let K = B6(A);
        if (K.length <= q) return K;
        return K.slice(0, q - 3) + "..."
    } catch {
        return "[unable to serialize]"
    }
}
// @from(Ln 375330, Col 4)
ImY = `You summarize what was accomplished by a coding assistant.
Given the tools executed and their results, provide a brief summary.

Rules:
- Use past tense (e.g., "Read package.json", "Fixed type error in utils.ts")
- Be specific about what was done
- Keep under 8 words
- Do not include phrases like "I did" or "The assistant" - just describe what happened
- Focus on the user-visible outcome, not implementation details

Examples:
- "Searched codebase for authentication code"
- "Read and analyzed Message.tsx component"
- "Fixed null pointer exception in data processor"
- "Created new user registration endpoint"
- "Ran tests and fixed 3 failing assertions"`
// @from(Ln 375346, Col 4)
qKq = E(() => {
    gw();
    g1();
    k1()
})
// @from(Ln 375352, Col 0)
function YKq(A) {
    KKq = A
}
// @from(Ln 375356, Col 0)
function pb(A, q) {
    KKq?.(A, q)
}
// @from(Ln 375359, Col 4)
KKq = null
// @from(Ln 375361, Col 0)
function aE1() {
    if (!Dp8) Dp8 = x6("perf_hooks").performance;
    return Dp8
}
// @from(Ln 375366, Col 0)
function xmY() {
    let A = aE1(),
        q = A.getEntriesByType("mark");
    for (let K of q)
        if (K.name.startsWith(Ci6)) A.clearMarks(K.name)
}
// @from(Ln 375373, Col 0)
function Pp8() {
    if (!q7()) return;
    if (!Xp8) return;
    if (Si6++, xmY(), aE1().mark(`${Ci6}turn_start`), oE1) k(`[headlessProfiler] Started turn ${Si6}`)
}
// @from(Ln 375379, Col 0)
function Bz6(A) {
    if (!q7()) return;
    if (!Xp8) return;
    let q = aE1();
    if (q.mark(`${Ci6}${A}`), oE1) k(`[headlessProfiler] Checkpoint: ${A} at ${q.now().toFixed(1)}ms`)
}
// @from(Ln 375386, Col 0)
function Wp8() {
    if (!q7()) return;
    if (!Xp8) return;
    let K = aE1().getEntriesByType("mark").filter((j) => j.name.startsWith(Ci6));
    if (K.length === 0) return;
    let Y = new Map;
    for (let j of K) {
        let J = j.name.slice(Ci6.length);
        Y.set(J, j.startTime)
    }
    let z = Y.get("turn_start");
    if (z === void 0) return;
    let _ = {
            turn_number: Si6
        },
        w = Y.get("system_message_yielded");
    if (w !== void 0 && Si6 === 0) _.time_to_system_message_ms = Math.round(w);
    let O = Y.get("query_started");
    if (O !== void 0) _.time_to_query_start_ms = Math.round(O - z);
    let $ = Y.get("first_chunk");
    if ($ !== void 0) _.time_to_first_response_ms = Math.round($ - z);
    let H = Y.get("api_request_sent");
    if (O !== void 0 && H !== void 0) _.query_overhead_ms = Math.round(H - O);
    if (_.checkpoint_count = K.length, process.env.CLAUDE_CODE_ENTRYPOINT) _.entrypoint = process.env.CLAUDE_CODE_ENTRYPOINT;
    if (zKq) d("tengu_headless_latency", _);
    if (oE1) k(`[headlessProfiler] Turn ${Si6} metrics: ${B6(_)}`)
}
// @from(Ln 375413, Col 4)
oE1
// @from(Ln 375413, Col 9)
bmY = 0.05
// @from(Ln 375414, Col 4)
zKq
// @from(Ln 375414, Col 9)
Xp8
// @from(Ln 375414, Col 14)
Dp8 = null
// @from(Ln 375415, Col 4)
Ci6 = "headless_"
// @from(Ln 375416, Col 4)
Si6 = -1
// @from(Ln 375417, Col 4)
Ii6 = E(() => {
    H1();
    V1();
    T1();
    g1();
    oE1 = process.env.CLAUDE_CODE_PROFILE_STARTUP === "1", zKq = Math.random() < bmY, Xp8 = oE1 || zKq
})
// @from(Ln 375424, Col 4)
gz6 = "Sleep"
// @from(Ln 375425, Col 4)
MzO
// @from(Ln 375426, Col 4)
bi6 = E(() => {
    vz();
    MzO = `Wait for a specified duration. The user can interrupt the sleep at any time.

Use this when the user tells you to sleep or rest, when you have nothing to do, or when you're waiting for something.

You may receive <${vV}> prompts — these are periodic check-ins. Look for useful work to do before sleeping.

You can call this concurrently with other tools — it won't interfere with them.

Prefer this over \`Bash(sleep ...)\` — it doesn't hold a shell process.

Each wake-up costs an API call, but the prompt cache expires after 5 minutes of inactivity — balance accordingly.`
})
// @from(Ln 375441, Col 0)
function wKq(A) {
    _Kq.push(A)
}
// @from(Ln 375444, Col 0)
async function OKq(A, q, K, Y, z, _) {
    let w = {
        messages: A,
        systemPrompt: q,
        userContext: K,
        systemContext: Y,
        toolUseContext: z,
        querySource: _
    };
    for (let O of _Kq) try {
        await O(w)
    } catch ($) {
        _6($ instanceof Error ? $ : Error(`Post-sampling hook failed: ${$}`))
    }
}
// @from(Ln 375459, Col 4)
_Kq
// @from(Ln 375460, Col 4)
xi6 = E(() => {
    k1();
    _Kq = []
})