
// @from(Ln 494638, Col 0)
async function osY(q) {
    try {
        let [K, _] = await Promise.all([F_7(q).catch((A) => {
            return j6(r1(A)), E("Skill directory commands failed to load, continuing without them"), []
        }), l97().catch((A) => {
            return j6(r1(A)), E("Plugin skills failed to load, continuing without them"), []
        })]), z = jsK(), Y = _f4();
        return E(`getSkills returning: ${K.length} skill dir commands, ${_.length} plugin skills, ${z.length} bundled skills, ${Y.length} builtin plugin skills`), {
            skillDirCommands: K,
            pluginSkills: _,
            bundledSkills: z,
            builtinPluginSkills: Y
        }
    } catch (K) {
        return j6(r1(K)), E("Unexpected error in getSkills, returning empty"), {
            skillDirCommands: [],
            pluginSkills: [],
            bundledSkills: [],
            builtinPluginSkills: []
        }
    }
}
// @from(Ln 494661, Col 0)
function GeK(q) {
    if (!q.availability) return !0;
    for (let K of q.availability) switch (K) {
        case "claude-ai":
            if (i7()) return !0;
            break;
        case "console":
            if (!i7() && !z46() && Aj()) return !0;
            break;
        default: {
            let _ = K;
            break
        }
    }
    return !1
}
// @from(Ln 494677, Col 0)
async function eD(q) {
    let K = await veK(q),
        _ = RyK(),
        z = K.filter(($) => GeK($) && X66($));
    if (_.length === 0) return z;
    let Y = new Set(z.map(($) => $.name)),
        A = _.filter(($) => !Y.has($.name) && GeK($) && X66($));
    if (A.length === 0) return z;
    let O = new Set(XH7().map(($) => $.name)),
        w = z.findIndex(($) => O.has($.name));
    if (w === -1) return [...z, ...A];
    return [...z.slice(0, w), ...A, ...z.slice(w)]
}
// @from(Ln 494691, Col 0)
function $t() {
    veK.cache?.clear?.(), Ty.cache?.clear?.(), pH6.cache?.clear?.(), isY?.()
}
// @from(Ln 494695, Col 0)
function On() {
    $t(), fc8(), rNK(), rc8()
}
// @from(Ln 494699, Col 0)
function dNK(q) {
    return []
}
// @from(Ln 494703, Col 0)
function u56(q) {
    return "on"
}
// @from(Ln 494707, Col 0)
function asY(q) {
    let K = u56(q);
    return K === "user-invocable-only" || K === "off"
}
// @from(Ln 494712, Col 0)
function co8(q) {
    return u56(q) === "off"
}
// @from(Ln 494716, Col 0)
function ssY(q) {
    return q.type === "prompt" && !q.disableModelInvocation && !asY(q) && (q.source === "builtin" || q.loadedFrom === "bundled" || q.loadedFrom === "skills" || q.loadedFrom === "commands_DEPRECATED" || q.hasUserSpecifiedDescription || !!q.whenToUse)
}
// @from(Ln 494720, Col 0)
function PH7(q) {
    if (q.type === "local-jsx") return !1;
    if (q.type === "prompt") return !0;
    return TeK.has(q)
}
// @from(Ln 494726, Col 0)
function WH7(q) {
    if (q.type !== "local-jsx") return;
    for (let K of TeK)
        if (K.name === q.name && K.type === "local") return K;
    return
}
// @from(Ln 494733, Col 0)
function VeK(q) {
    return PH7(q) || WH7(q) !== void 0
}
// @from(Ln 494737, Col 0)
function keK(q) {
    return q.filter((K) => MH7.has(K))
}
// @from(Ln 494741, Col 0)
function yu6(q) {
    return q.filter((K) => K.type === "prompt" && !K.disableNonInteractive || K.type === "local" && K.supportsNonInteractive)
}
// @from(Ln 494745, Col 0)
function ll(q, K) {
    return K.find((_) => _.name === q || y_(_) === q || _.aliases?.includes(q))
}
// @from(Ln 494749, Col 0)
function wM6(q, K) {
    return ll(q, K) !== void 0
}
// @from(Ln 494753, Col 0)
function $b6(q, K) {
    let _ = ll(q, K);
    if (!_) throw ReferenceError(`Command ${q} not found. Available commands: ${K.map((z)=>{let Y=y_(z);return z.aliases?`${Y} (aliases: ${z.aliases.join(", ")})`:Y}).sort((z,Y)=>z.localeCompare(Y)).join(", ")}`);
    return _
}
// @from(Ln 494759, Col 0)
function IP6(q) {
    if (q.type !== "prompt") return q.description;
    if (q.kind === "workflow") return `${q.description} (workflow)`;
    if (q.source === "plugin") {
        let K = q.pluginInfo?.pluginManifest.name;
        if (K) return `(${K}) ${q.description}`;
        return `${q.description} (plugin)`
    }
    if (q.source === "builtin" || q.source === "mcp" || q.source === "bundled") return q.description;
    return `${q.description} (${u16(q.source)})`
}
// @from(Ln 494770, Col 4)
nsY = null
// @from(Ln 494771, Col 4)
AeK
// @from(Ln 494771, Col 9)
OeK
// @from(Ln 494771, Col 14)
weK = null
// @from(Ln 494772, Col 4)
$eK
// @from(Ln 494772, Col 9)
jeK = null
// @from(Ln 494773, Col 4)
Qo8
// @from(Ln 494773, Col 9)
HeK = null
// @from(Ln 494774, Col 4)
JeK
// @from(Ln 494774, Col 9)
isY = null
// @from(Ln 494775, Col 4)
XeK = null
// @from(Ln 494776, Col 4)
MeK = null
// @from(Ln 494777, Col 4)
PeK
// @from(Ln 494777, Col 9)
do8 = null
// @from(Ln 494778, Col 4)
WeK = null
// @from(Ln 494779, Col 4)
DeK = null
// @from(Ln 494780, Col 4)
ZeK = null
// @from(Ln 494781, Col 4)
rsY
// @from(Ln 494781, Col 9)
fbj
// @from(Ln 494781, Col 14)
XH7
// @from(Ln 494781, Col 19)
UF
// @from(Ln 494781, Col 23)
feK = null
// @from(Ln 494782, Col 4)
veK
// @from(Ln 494782, Col 9)
Ty
// @from(Ln 494782, Col 13)
pH6
// @from(Ln 494782, Col 18)
MH7
// @from(Ln 494782, Col 23)
TeK
// @from(Ln 494783, Col 4)
CA = L(() => {
    wJ4();
    EbK();
    RbK();
    CbK();
    cbK();
    lbK();
    nbK();
    zIK();
    ZIK();
    vIK();
    kIK();
    bIK();
    UIK();
    lIK();
    aIK();
    KxK();
    NuK();
    guK();
    duK();
    AmK();
    wmK();
    RmK();
    nmK();
    amK();
    $BK();
    fBK();
    vBK();
    VBK();
    hBK();
    SBK();
    bBK();
    PpK();
    GpK();
    TpK();
    yFK();
    xUK();
    mUK();
    KQK();
    WQK();
    VQK();
    ocK();
    qlK();
    AlK();
    k$7();
    plK();
    glK();
    ilK();
    slK();
    RnK();
    gnK();
    dnK();
    lnK();
    nnK();
    $W6();
    onK();
    tnK();
    _iK();
    TiK();
    EiK();
    SiK();
    miK();
    UiK();
    jrK();
    WrK();
    krK();
    yrK();
    hrK();
    poK();
    QoK();
    ioK();
    aoK();
    zaK();
    AaK();
    jaK();
    HaK();
    JaK();
    PaK();
    DaK();
    faK();
    vaK();
    baK();
    laK();
    oaK();
    OsK();
    U8();
    m8();
    K8();
    ol();
    k0();
    z68();
    E38();
    U4();
    T7();
    x9();
    XsK();
    gj7();
    LsK();
    usK();
    BsK();
    lsK();
    oj7();
    aC6();
    asK();
    tsK();
    AtK();
    wtK();
    HtK();
    XtK();
    PtK();
    aY();
    a1();
    AeK = (ZtK(), B7(DtK)).default, OeK = (NtK(), B7(ktK)).default, $eK = (mtK(), B7(utK)).default, Qo8 = (ptK(), B7(BtK)).default, JeK = (ltK(), B7(ctK)).default, PeK = ($z8(), B7(Bo8)).default, rsY = {
        type: "prompt",
        name: "insights",
        description: "Generate a report analyzing your Claude Code sessions",
        contentLength: 0,
        progressMessage: "analyzing your sessions",
        source: "builtin",
        disableModelInvocation: !0,
        async getPromptForCommand(q, K) {
            let _ = (await Promise.resolve().then(() => (YeK(), zeK))).default;
            if (_.type !== "prompt") throw Error("unreachable");
            return _.getPromptForCommand(q, K)
        }
    }, fbj = [qxK, iA7, SbK, vpK, cnK, VIK, cIK, OmK, TA7, VA7, TBK, ...jeK ? [jeK] : [], YaK, $aK, Rj7, ...XeK ? [XeK] : [], ...MeK ? [MeK] : [], MaK, Sj7, uUK, FlK, No8, WaK, ZaK, GaK, JsK, JtK, MtK, nsY].filter(Boolean), XH7 = P1(() => [OJ4, AsK, BoK, LrK, dbK, caK, Bn8, mA7, Un8, kuK, pA7, gIK, FuK, yO7, Hi8, YmK, ...WeK ? [WeK] : [], uO7, YtK, Kz8, RiK, Ao8, OtK, _aK, QO7, ZBK, GBK, LBK, MpK, fpK, EFK, lmK, W27, omK, msK, csK, UoK, k27, Nj7, TQK, rcK, ecK, YlK, N$7, nlK, ej7, alK, ssK, raK, c$7, KiK, RA7, dr8, ulK, hlK, ooK, QnK, U$7, ysK, jz6, L96, b$K, osK, d$7, rsY, ...JeK ? [JeK] : [], ...DeK ? [DeK] : [], ...ZeK ? [ZeK] : [], ...AeK ? [AeK] : [], ...OeK ? [OeK] : [], ...weK ? [weK] : [], ...$eK ? [$eK] : [], ...Qo8 ? [Qo8] : [], viK, NiK, qQK, Yj7, $rK, PrK, VrK, dj7, CaK, RBK(), ...!z46() ? [CBK] : [], uiK, ...do8 ? [do8] : [], hnK, NbK, ...hbK, FnK, ...HeK ? [HeK] : [], ...PeK ? [PeK] : [], ...[]]), UF = P1(() => new Set(XH7().flatMap((q) => [q.name, ...q.aliases ?? []])));
    veK = P1(async (q) => {
        let [{
            skillDirCommands: K,
            pluginSkills: _,
            bundledSkills: z,
            builtinPluginSkills: Y
        }, A, O] = await Promise.all([osY(q), iM6(), feK ? feK(q) : Promise.resolve([])]);
        return [...z, ...Y, ...K, ...O, ...A, ..._, ...XH7()]
    });
    Ty = P1(async (q) => {
        return (await eD(q)).filter(ssY)
    }), pH6 = P1(async (q) => {
        try {
            return (await eD(q)).filter((_) => _.type === "prompt" && _.source !== "builtin" && !co8(_) && (_.hasUserSpecifiedDescription || _.whenToUse) && (_.loadedFrom === "skills" || _.loadedFrom === "plugin" || _.loadedFrom === "bundled" || _.disableModelInvocation))
        } catch (K) {
            return j6(r1(K)), E("Returning empty skills array due to load failure"), []
        }
    }), MH7 = new Set([N$7, Kz8, QO7, c$7, mA7, d$7, pA7, RA7, TA7, VA7, W27, k27, dj7, uO7, U$7, Yj7, ej7, Bn8, Hi8, Un8, Ao8, No8, Rj7]), TeK = new Set([Un8, iA7, Bn8, Hi8, yO7, No8, Ao8, VsK, Sj7, ...Qo8 ? [Qo8] : [], ...do8 ? [do8] : [], Nj7])
})
// @from(Ln 494928, Col 4)
Ub8 = {}
// @from(Ln 495055, Col 0)
function ul(q) {
    return q.type === "user" || q.type === "assistant" || q.type === "attachment" || q.type === "system"
}
// @from(Ln 495059, Col 0)
function Jz6(q) {
    return q.type !== "progress"
}
// @from(Ln 495063, Col 0)
function Jz8(q, K, _) {
    if (!_) return q.length;
    for (let z = K; z < q.length; z++) {
        let Y = q[z];
        if (Y.type === "assistant" && Y.message.stop_reason === null) return z
    }
    return q.length
}
// @from(Ln 495072, Col 0)
function YtY(q) {
    return typeof q === "object" && q !== null && "type" in q && q.type === "progress" && "uuid" in q && typeof q.uuid === "string"
}
// @from(Ln 495076, Col 0)
function TH7(q) {
    return typeof q === "string" && AtY.has(q)
}
// @from(Ln 495080, Col 0)
function jg() {
    return CG(A7(), "projects")
}
// @from(Ln 495084, Col 0)
function bY() {
    let q = E86() ?? e2(Y7());
    return CG(q, `${I8()}.jsonl`)
}
// @from(Ln 495089, Col 0)
function xT(q) {
    if (q === I8()) return bY();
    let K = e2(Y7());
    return CG(K, `${q}.jsonl`)
}
// @from(Ln 495095, Col 0)
function f97(q, K) {
    VH7.set(q, K)
}
// @from(Ln 495099, Col 0)
function G97(q) {
    VH7.delete(q)
}
// @from(Ln 495103, Col 0)
function X0(q) {
    let K = E86() ?? e2(Y7()),
        _ = I8(),
        z = VH7.get(q),
        Y = z ? CG(K, _, "subagents", z) : CG(K, _, "subagents");
    return CG(Y, `agent-${q}.jsonl`)
}
// @from(Ln 495111, Col 0)
function beK(q) {
    return X0(q).replace(/\.jsonl$/, ".meta.json")
}
// @from(Ln 495114, Col 0)
async function dK8(q, K) {
    let _ = beK(q);
    await Ru6(Hz8(_), {
        recursive: !0
    }), await vH7(_, JSON.stringify(K));
    let z = _.replace(/\.meta\.json$/, ".jsonl");
    x_().fireMirror(z, [{
        type: "agent_metadata",
        agentType: K.agentType,
        ...K.worktreePath && {
            worktreePath: K.worktreePath
        },
        ...K.description && {
            description: K.description
        }
    }])
}
// @from(Ln 495131, Col 0)
async function o37(q) {
    let K = beK(q);
    try {
        let _ = await bu6(K, "utf-8");
        return JSON.parse(_)
    } catch (_) {
        if (D5(_)) return null;
        throw _
    }
}
// @from(Ln 495142, Col 0)
function IeK() {
    let q = E86() ?? e2(Y7());
    return CG(q, I8(), "remote-agents")
}
// @from(Ln 495147, Col 0)
function kH7(q) {
    return CG(IeK(), `remote-agent-${q}.meta.json`)
}
// @from(Ln 495150, Col 0)
async function P77(q, K) {
    let _ = kH7(q);
    await Ru6(Hz8(_), {
        recursive: !0
    }), await vH7(_, JSON.stringify(K))
}
// @from(Ln 495156, Col 0)
async function OtY(q) {
    let K = kH7(q);
    try {
        let _ = await bu6(K, "utf-8");
        return JSON.parse(_)
    } catch (_) {
        if (D5(_)) return null;
        throw _
    }
}
// @from(Ln 495166, Col 0)
async function AK8(q) {
    let K = kH7(q);
    try {
        await qtY(K)
    } catch (_) {
        if (D5(_)) return;
        throw _
    }
}
// @from(Ln 495175, Col 0)
async function W77() {
    let q = IeK(),
        K;
    try {
        K = await Cu6(q, {
            withFileTypes: !0
        })
    } catch (z) {
        if (D5(z)) return [];
        throw z
    }
    let _ = [];
    for (let z of K) {
        if (!z.isFile() || !z.name.endsWith(".meta.json")) continue;
        try {
            let Y = await bu6(CG(q, z.name), "utf-8");
            _.push(JSON.parse(Y))
        } catch (Y) {
            E(`listRemoteAgentMetadata: skipping ${z.name}: ${String(Y)}`)
        }
    }
    return _
}
// @from(Ln 495199, Col 0)
function m88(q) {
    let K = E86() ?? e2(Y7()),
        _ = CG(K, `${q}.jsonl`),
        z = V8();
    try {
        return z.statSync(_), !0
    } catch {
        return !1
    }
}
// @from(Ln 495210, Col 0)
function xeK() {
    return "production"
}
// @from(Ln 495214, Col 0)
function ueK() {
    let q = S6(process.env.TEST_ENABLE_SESSION_PERSISTENCE);
    return xeK() === "test" && !q || uN() || S6(process.env.CLAUDE_CODE_SKIP_PROMPT_HISTORY)
}
// @from(Ln 495219, Col 0)
function lo8() {
    return "external"
}
// @from(Ln 495223, Col 0)
function meK() {
    return process.env.CLAUDE_CODE_ENTRYPOINT
}
// @from(Ln 495227, Col 0)
function K66() {
    return !0
}
// @from(Ln 495231, Col 0)
function x_() {
    if (!fW6) {
        if (fW6 = new BeK, !EeK) eq(async () => {
            await fW6?.flush();
            try {
                fW6?.reAppendSessionMetadata()
            } catch {}
        }), EeK = !0
    }
    return fW6
}
// @from(Ln 495243, Col 0)
function wtY() {
    fW6?._resetFlushState()
}
// @from(Ln 495247, Col 0)
function $tY() {
    fW6 = null
}
// @from(Ln 495251, Col 0)
function jtY(q) {
    x_().sessionFile = q
}
// @from(Ln 495255, Col 0)
function HtY() {
    return x_().sessionFile
}
// @from(Ln 495259, Col 0)
function Xz8(q) {
    x_().setInternalEventWriter(q)
}
// @from(Ln 495263, Col 0)
function NH7() {
    x_().clearInternalEventWriter()
}
// @from(Ln 495267, Col 0)
function EH7(q) {
    x_().addMirror(q)
}
// @from(Ln 495271, Col 0)
function Ta1(q, K) {
    x_().fireMirror(q, K)
}
// @from(Ln 495275, Col 0)
function Va1(q) {
    return x_().trackExternalWrite(q)
}
// @from(Ln 495279, Col 0)
function yH7(q, K) {
    x_().setInternalEventReader(q), x_().setInternalSubagentEventReader(K)
}
// @from(Ln 495283, Col 0)
function JtY(q) {
    x_().setRemoteIngressUrl(q)
}
// @from(Ln 495286, Col 0)
class BeK {
    currentSessionTag;
    currentSessionTitle;
    currentSessionAgentName;
    currentSessionAgentColor;
    currentSessionLastPrompt;
    currentSessionAgentSetting;
    currentSessionMode;
    currentSessionPermissionMode;
    currentSessionWorktree;
    currentSessionPrNumber;
    currentSessionPrUrl;
    currentSessionPrRepository;
    sessionFile = null;
    pendingEntries = [];
    remoteIngressUrl = null;
    internalEventWriter = null;
    internalEventReader = null;
    internalSubagentEventReader = null;
    mirrors = [];
    pendingWriteCount = 0;
    flushResolvers = [];
    writeQueues = new Map;
    flushTimer = null;
    activeDrain = null;
    FLUSH_INTERVAL_MS = 100;
    MAX_CHUNK_BYTES = 104857600;
    bytesSinceMetadataReAppend = 0;
    constructor() {}
    _resetFlushState() {
        if (this.pendingWriteCount = 0, this.bytesSinceMetadataReAppend = 0, this.flushResolvers = [], this.flushTimer) clearTimeout(this.flushTimer);
        this.flushTimer = null, this.activeDrain = null, this.writeQueues = new Map, this.mirrors = []
    }
    addMirror(q) {
        this.mirrors.push(q)
    }
    fireMirror(q, K) {
        for (let _ of this.mirrors) try {
            _(q, K)
        } catch (z) {
            E(`[SessionMirror] mirror failed for ${q}: ${z}`, {
                level: "error"
            })
        }
    }
    incrementPendingWrites() {
        this.pendingWriteCount++
    }
    decrementPendingWrites() {
        if (this.pendingWriteCount--, this.pendingWriteCount === 0) {
            for (let q of this.flushResolvers) q();
            this.flushResolvers = []
        }
    }
    async trackWrite(q) {
        this.incrementPendingWrites();
        try {
            return await q()
        } finally {
            this.decrementPendingWrites()
        }
    }
    trackExternalWrite(q) {
        return this.trackWrite(q)
    }
    enqueueWrite(q, K) {
        return new Promise((_) => {
            let z = this.writeQueues.get(q);
            if (!z) z = [], this.writeQueues.set(q, z);
            z.push({
                entry: K,
                resolve: _
            }), this.scheduleDrain()
        })
    }
    scheduleDrain() {
        if (this.flushTimer) return;
        this.flushTimer = setTimeout(async () => {
            if (this.flushTimer = null, this.activeDrain = this.drainWriteQueue(), await this.activeDrain, this.activeDrain = null, this.writeQueues.size > 0) this.scheduleDrain()
        }, this.FLUSH_INTERVAL_MS)
    }
    async appendToFile(q, K) {
        try {
            await NeK(q, K, {
                mode: 384
            })
        } catch {
            await Ru6(Hz8(q), {
                recursive: !0,
                mode: 448
            }), await NeK(q, K, {
                mode: 384
            })
        }
        if (q === this.sessionFile) this.bytesSinceMetadataReAppend += Buffer.byteLength(K, "utf8")
    }
    async drainWriteQueue() {
        for (let [q, K] of this.writeQueues) {
            if (K.length === 0) continue;
            let _ = K.splice(0),
                z = 0;
            try {
                let Y = "",
                    A = 0,
                    w = this.mirrors.length > 0 ? [] : void 0;
                for (let $ = 0; $ < _.length; $++) {
                    let {
                        entry: j
                    } = _[$], H = I6(j) + `
`;
                    if (Y.length + H.length >= this.MAX_CHUNK_BYTES) {
                        if (await this.appendToFile(q, Y), w) this.fireMirror(q, w.slice()), w.length = 0;
                        for (let J = A; J < $; J++) _[J].resolve();
                        z = $, A = $, Y = ""
                    }
                    Y += H, w?.push(j)
                }
                if (Y.length > 0) {
                    if (await this.appendToFile(q, Y), w) this.fireMirror(q, w);
                    for (let $ = A; $ < _.length; $++) _[$].resolve();
                    z = _.length
                }
            } catch (Y) {
                j6(Y);
                for (let A = z; A < _.length; A++) _[A].resolve()
            }
        }
        for (let [q, K] of this.writeQueues)
            if (K.length === 0) this.writeQueues.delete(q);
        if (this.bytesSinceMetadataReAppend >= Tr / 2) try {
            this.reAppendSessionMetadata()
        } catch (q) {
            j6(q)
        }
    }
    resetSessionFile() {
        this.sessionFile = null, this.pendingEntries = [], this.bytesSinceMetadataReAppend = 0
    }
    reAppendSessionMetadata(q = !1) {
        if (!this.sessionFile) return;
        let K = I8();
        if (!K) return;
        this.bytesSinceMetadataReAppend = 0;
        let z = TtY(this.sessionFile).split(`
`);
        if (!q) {
            let A = z.findLast((O) => O.startsWith('{"type":"custom-title"'));
            if (A) {
                let O = kV(A, "customTitle");
                if (O !== void 0) this.currentSessionTitle = O || void 0
            }
        }
        let Y = z.findLast((A) => A.startsWith('{"type":"tag"'));
        if (Y) {
            let A = kV(Y, "tag");
            if (A !== void 0) this.currentSessionTag = A || void 0
        }
        if (this.currentSessionLastPrompt) lT(this.sessionFile, {
            type: "last-prompt",
            lastPrompt: this.currentSessionLastPrompt,
            sessionId: K
        });
        if (this.currentSessionTitle) lT(this.sessionFile, {
            type: "custom-title",
            customTitle: this.currentSessionTitle,
            sessionId: K
        });
        if (this.currentSessionTag) lT(this.sessionFile, {
            type: "tag",
            tag: this.currentSessionTag,
            sessionId: K
        });
        if (this.currentSessionAgentName) lT(this.sessionFile, {
            type: "agent-name",
            agentName: this.currentSessionAgentName,
            sessionId: K
        });
        if (this.currentSessionAgentColor) lT(this.sessionFile, {
            type: "agent-color",
            agentColor: this.currentSessionAgentColor,
            sessionId: K
        });
        if (this.currentSessionAgentSetting) lT(this.sessionFile, {
            type: "agent-setting",
            agentSetting: this.currentSessionAgentSetting,
            sessionId: K
        });
        if (this.currentSessionMode) lT(this.sessionFile, {
            type: "mode",
            mode: this.currentSessionMode,
            sessionId: K
        });
        if (this.currentSessionPermissionMode) lT(this.sessionFile, {
            type: "permission-mode",
            permissionMode: this.currentSessionPermissionMode,
            sessionId: K
        });
        if (this.currentSessionWorktree !== void 0) lT(this.sessionFile, {
            type: "worktree-state",
            worktreeSession: this.currentSessionWorktree,
            sessionId: K
        });
        if (this.currentSessionPrNumber !== void 0 && this.currentSessionPrUrl && this.currentSessionPrRepository) lT(this.sessionFile, {
            type: "pr-link",
            sessionId: K,
            prNumber: this.currentSessionPrNumber,
            prUrl: this.currentSessionPrUrl,
            prRepository: this.currentSessionPrRepository,
            timestamp: new Date().toISOString()
        })
    }
    async flush() {
        if (this.flushTimer) clearTimeout(this.flushTimer), this.flushTimer = null;
        if (this.activeDrain) await this.activeDrain;
        if (await this.drainWriteQueue(), this.pendingWriteCount === 0) return;
        return new Promise((q) => {
            this.flushResolvers.push(q)
        })
    }
    async removeMessageByUuid(q) {
        return this.trackWrite(async () => {
            if (this.sessionFile === null) return;
            try {
                let K = 0,
                    _ = await esY(this.sessionFile, "r+");
                try {
                    let {
                        size: A
                    } = await _.stat();
                    if (K = A, A === 0) return;
                    let O = Math.min(A, Tr),
                        w = A - O,
                        $ = Buffer.allocUnsafe(O),
                        {
                            bytesRead: j
                        } = await _.read($, 0, O, w),
                        H = $.subarray(0, j),
                        J = `"uuid":"${q}"`,
                        X = H.lastIndexOf(J);
                    if (X >= 0) {
                        let M = H.lastIndexOf(10, X);
                        if (M >= 0 || w === 0) {
                            let P = M + 1,
                                W = H.indexOf(10, X + J.length),
                                D = W >= 0 ? W + 1 : j,
                                Z = w + P,
                                G = j - D;
                            if (await _.truncate(Z), G > 0) await _.write(H, D, G, Z);
                            return
                        }
                    }
                } finally {
                    await _.close()
                }
                if (K > ztY) {
                    E(`Skipping tombstone removal: session file too large (${o4(K)})`, {
                        level: "warn"
                    });
                    return
                }
                let Y = (await bu6(this.sessionFile, {
                    encoding: "utf-8"
                })).split(`
`).filter((A) => {
                    if (!A.trim()) return !0;
                    try {
                        return n8(A).uuid !== q
                    } catch {
                        return !0
                    }
                });
                await vH7(this.sessionFile, Y.join(`
`), {
                    encoding: "utf8"
                })
            } catch {}
        })
    }
    shouldSkipPersistence() {
        return ueK()
    }
    async materializeSessionFile() {
        if (this.shouldSkipPersistence()) return;
        if (this.ensureCurrentSessionFile(), this.reAppendSessionMetadata(), this.pendingEntries.length > 0) {
            let q = this.pendingEntries;
            this.pendingEntries = [];
            for (let K of q) await this.appendEntry(K)
        }
    }
    async insertMessageChain(q, K = !1, _, z, Y) {
        return this.trackWrite(async () => {
            let A = z ?? null;
            if (this.sessionFile === null && q.some((j) => j.type === "user" || j.type === "assistant")) await this.materializeSessionFile();
            let O;
            try {
                O = await rj()
            } catch {
                O = void 0
            }
            Sb1();
            let w = I8(),
                $ = h86().get(w);
            for (let j of q) {
                let H = RJ(j),
                    J = A;
                if (j.type === "user" && "sourceToolAssistantUUID" in j && j.sourceToolAssistantUUID) J = j.sourceToolAssistantUUID;
                if (J === j.uuid) d("tengu_chain_self_reference_write", {});
                let X = {
                    parentUuid: H ? null : J,
                    logicalParentUuid: H ? A : void 0,
                    isSidechain: K,
                    teamName: Y?.teamName,
                    agentName: Y?.agentName,
                    promptId: j.type === "user" ? $p6() ?? void 0 : void 0,
                    agentId: _,
                    ...j,
                    sessionKind: oZ8(),
                    userType: lo8(),
                    entrypoint: meK(),
                    cwd: b8(),
                    sessionId: w,
                    version: _tY,
                    gitBranch: O,
                    slug: $
                };
                if (X.type === "user" && X.toolUseResult != null) X.toolUseResult = iCK(X.toolUseResult);
                if (await this.appendEntry(X), Jz6(j)) A = j.uuid
            }
            if (!K) {
                let j = U_8(q);
                if (j) {
                    let H = j.replaceAll(`
`, " ").trim();
                    this.currentSessionLastPrompt = H.length > 200 ? H.slice(0, 200).trim() + "…" : H
                }
            }
        })
    }
    async insertFileHistorySnapshot(q, K, _) {
        return this.trackWrite(async () => {
            let z = {
                type: "file-history-snapshot",
                messageId: q,
                snapshot: K,
                isSnapshotUpdate: _
            };
            await this.appendEntry(z)
        })
    }
    async insertQueueOperation(q) {
        return this.trackWrite(async () => {
            await this.appendEntry(q)
        })
    }
    async insertAttributionSnapshot(q) {
        return this.trackWrite(async () => {
            await this.appendEntry(q)
        })
    }
    async insertContentReplacement(q, K) {
        return this.trackWrite(async () => {
            let _ = {
                type: "content-replacement",
                sessionId: I8(),
                agentId: K,
                replacements: q
            };
            await this.appendEntry(_)
        })
    }
    async appendEntry(q, K = I8()) {
        if (this.shouldSkipPersistence()) return;
        let _ = I8(),
            z = K === _,
            Y;
        if (z) {
            if (this.sessionFile === null) {
                this.pendingEntries.push(q);
                return
            }
            Y = this.sessionFile
        } else {
            let A = await this.getExistingSessionFile(K);
            if (!A) {
                j6(Error(`appendEntry: session file not found for other session ${K}`));
                return
            }
            Y = A
        }
        switch (CeK[q.type]) {
            case "always": {
                this.enqueueWrite(Y, q);
                return
            }
            case "route-by-agent": {
                let A = q.type === "content-replacement" && q.agentId ? X0(q.agentId) : Y;
                this.enqueueWrite(A, q);
                return
            }
            case "dedup-transcript": {
                if (q.type !== "progress" && !ul(q)) {
                    j6(Error(`appendEntry invariant: dedup-transcript policy on non-transcript type '${q.type}'`));
                    return
                }
                let A = await Su6(K),
                    O = q.isSidechain && q.agentId !== void 0,
                    w = O ? X0(w2(q.agentId)) : Y,
                    $ = !A.has(q.uuid);
                if (O || $) {
                    if (this.enqueueWrite(w, q), !O) {
                        if (A.add(q.uuid), ul(q)) await this.persistToRemote(K, q)
                    }
                }
                return
            }
        }
    }
    ensureCurrentSessionFile() {
        if (this.sessionFile === null) this.sessionFile = bY();
        return this.sessionFile
    }
    existingSessionFiles = new Map;
    async getExistingSessionFile(q) {
        let K = this.existingSessionFiles.get(q);
        if (K) return K;
        let _ = xT(q);
        try {
            return await GH7(_), this.existingSessionFiles.set(q, _), _
        } catch (z) {
            if (D5(z)) return null;
            throw z
        }
    }
    async persistToRemote(q, K) {
        if (rs()) return;
        if (this.internalEventWriter) {
            try {
                await this.internalEventWriter("transcript", K, {
                    ...RJ(K) && {
                        isCompaction: !0
                    },
                    ...K.agentId && {
                        agentId: K.agentId
                    }
                })
            } catch {
                d("tengu_session_persistence_failed", {}), E("Failed to write transcript as internal event")
            }
            return
        }
        if (!S6("true") || !this.remoteIngressUrl) return;
        if (!await nOK(q, K, this.remoteIngressUrl)) d("tengu_session_persistence_failed", {}), j5(1, "other")
    }
    setRemoteIngressUrl(q) {
        if (this.remoteIngressUrl = q, E(`Remote persistence enabled with URL: ${q}`), q) this.FLUSH_INTERVAL_MS = yeK
    }
    setInternalEventWriter(q) {
        this.internalEventWriter = q, E("CCR v2 internal event writer registered for transcript persistence"), this.FLUSH_INTERVAL_MS = yeK
    }
    clearInternalEventWriter() {
        if (!this.internalEventWriter) return;
        this.internalEventWriter = null, E("CCR v2 internal event writer cleared")
    }
    setInternalEventReader(q) {
        this.internalEventReader = q, E("CCR v2 internal event reader registered for session resume")
    }
    setInternalSubagentEventReader(q) {
        this.internalSubagentEventReader = q, E("CCR v2 subagent event reader registered for session resume")
    }
    getInternalEventReader() {
        return this.internalEventReader
    }
    getInternalSubagentEventReader() {
        return this.internalSubagentEventReader
    }
}
// @from(Ln 495762, Col 0)
async function HF(q, K, _, z) {
    let Y = Wz8(q, z),
        A = I8(),
        O = await Su6(A),
        w = [],
        $ = _,
        j = !1;
    for (let J of Y)
        if (O.has(J.uuid)) {
            if (!j && Jz6(J)) $ = J.uuid
        } else w.push(J), j = !0;
    if (w.length > 0) await x_().insertMessageChain(w, !1, void 0, $, K);
    return w.findLast(Jz6)?.uuid ?? $ ?? null
}
// @from(Ln 495776, Col 0)
async function cc(q, K, _) {
    await x_().insertMessageChain(Wz8(q), !0, K, _)
}
// @from(Ln 495779, Col 0)
async function Ng1(q) {
    await x_().insertQueueOperation(q)
}
// @from(Ln 495782, Col 0)
async function LH7(q) {
    await x_().removeMessageByUuid(q)
}
// @from(Ln 495785, Col 0)
async function i48(q, K, _) {
    await x_().insertFileHistorySnapshot(q, K, _)
}
// @from(Ln 495788, Col 0)
async function peK(q) {
    await x_().insertAttributionSnapshot(q)
}
// @from(Ln 495791, Col 0)
async function dM6(q, K) {
    await x_().insertContentReplacement(q, K)
}
// @from(Ln 495794, Col 0)
async function Gu() {
    x_().resetSessionFile()
}
// @from(Ln 495798, Col 0)
function bn() {
    let q = x_();
    q.sessionFile = bY(), q.reAppendSessionMetadata(!0)
}
// @from(Ln 495802, Col 0)
async function XtY(q) {
    let K = I8();
    if (!K) return;
    await x_().appendEntry({
        type: "marble-origami-commit",
        sessionId: K,
        ...q
    })
}
// @from(Ln 495811, Col 0)
async function MtY(q) {
    let K = I8();
    if (!K) return;
    await x_().appendEntry({
        type: "marble-origami-snapshot",
        sessionId: K,
        ...q
    })
}
// @from(Ln 495820, Col 0)
async function mT() {
    await x_().flush()
}
// @from(Ln 495823, Col 0)
async function hH7(q, K) {
    SZ(pP(q));
    let _ = x_();
    try {
        let z = await iOK(q, K) || [],
            Y = e2(Y7());
        await Ru6(Y, {
            recursive: !0,
            mode: 448
        });
        let A = xT(q);
        return await WJ8(A, z), E(`Hydrated ${z.length} entries from remote`), z.length > 0
    } catch (z) {
        return E(`Error hydrating session from remote: ${z}`), j1("error", "hydrate_remote_session_fail"), !1
    } finally {
        _.setRemoteIngressUrl(K)
    }
}
// @from(Ln 495841, Col 0)
async function RH7(q) {
    let K = Date.now();
    SZ(pP(q));
    let _ = x_(),
        z = _.getInternalEventReader();
    if (!z) return E("No internal event reader registered for CCR v2 resume"), !1;
    try {
        let Y = await z();
        if (!Y) return E("Failed to read internal events for resume"), j1("error", "hydrate_ccr_v2_read_fail"), !1;
        let A = e2(Y7());
        await Ru6(A, {
            recursive: !0,
            mode: 448
        });
        let O = xT(q);
        await WJ8(O, Y.map((j) => j.payload)), E(`Hydrated ${Y.length} foreground entries from CCR v2 internal events`);
        let w = 0,
            $ = _.getInternalSubagentEventReader();
        if ($) {
            let j = await $();
            if (j && j.length > 0) {
                w = j.length;
                let H = new Map;
                for (let J of j) {
                    let X = J.agent_id || "";
                    if (!X) continue;
                    let M = H.get(X);
                    if (!M) M = [], H.set(X, M);
                    M.push(J.payload)
                }
                for (let [J, X] of H) {
                    let M = X0(w2(J));
                    await Ru6(Hz8(M), {
                        recursive: !0,
                        mode: 448
                    }), await WJ8(M, X)
                }
                E(`Hydrated ${j.length} subagent entries across ${H.size} agents`)
            }
        }
        return j1("info", "hydrate_ccr_v2_completed", {
            duration_ms: Date.now() - K,
            event_count: Y.length,
            subagent_event_count: w
        }), Y.length > 0
    } catch (Y) {
        if (Y instanceof Error && Y.message === "CCRClient: Epoch mismatch (409)") throw Y;
        return E(`Error hydrating session from CCR v2: ${Y}`), j1("error", "hydrate_ccr_v2_fail"), !1
    }
}
// @from(Ln 495892, Col 0)
function SH7(q) {
    let K = U_8(q);
    if (K) {
        let _ = K.replaceAll(`
`, " ").trim();
        if (_.length > 200) _ = _.slice(0, 200).trim() + "…";
        return _
    }
    return "No prompt"
}
// @from(Ln 495903, Col 0)
function U_8(q) {
    for (let K of q) {
        if (K.type !== "user" || K.isMeta) continue;
        if ("isCompactSummary" in K && K.isCompactSummary) continue;
        let _ = K.message?.content;
        if (!_) continue;
        let z = [];
        if (typeof _ === "string") z.push(_);
        else if (Array.isArray(_)) {
            for (let Y of _)
                if (Y.type === "text" && Y.text) z.push(Y.text)
        }
        for (let Y of z) {
            if (!Y) continue;
            let A = vK(Y, TV);
            if (A) {
                let w = A.replace(/^\//, "");
                if (UF().has(w)) continue;
                else {
                    let $ = vK(Y, "command-args")?.trim();
                    if (!$) continue;
                    return `${A} ${$}`
                }
            }
            let O = vK(Y, "bash-input");
            if (O) return `! ${O}`;
            if (SeK.test(Y)) continue;
            return Y
        }
    }
    return
}
// @from(Ln 495936, Col 0)
function xC6(q) {
    return q.map((K) => {
        let {
            isSidechain: _,
            parentUuid: z,
            ...Y
        } = K;
        return Y
    })
}
// @from(Ln 495947, Col 0)
function LeK(q) {
    let K, _ = -1,
        z = -1,
        Y = new Map,
        A = 0;
    for (let j of q.values()) {
        if (Y.set(j.uuid, A), RJ(j)) {
            z = A;
            let H = j.compactMetadata?.preservedSegment;
            if (H) K = H, _ = A
        }
        A++
    }
    if (!K) return;
    let O = _ === z,
        w = new Set;
    if (O) {
        let j = new Set,
            H = q.get(K.tailUuid),
            J = !1;
        while (H && !j.has(H.uuid)) {
            if (j.add(H.uuid), w.add(H.uuid), H.uuid === K.headUuid) {
                J = !0;
                break
            }
            H = H.parentUuid ? q.get(H.parentUuid) : void 0
        }
        if (!J) {
            d("tengu_relink_walk_broken", {
                tailInTranscript: q.has(K.tailUuid),
                headInTranscript: q.has(K.headUuid),
                anchorInTranscript: q.has(K.anchorUuid),
                walkSteps: j.size,
                transcriptSize: q.size
            });
            return
        }
    }
    if (O) {
        let j = q.get(K.headUuid);
        if (j) q.set(K.headUuid, {
            ...j,
            parentUuid: K.anchorUuid
        });
        for (let [H, J] of q)
            if (J.parentUuid === K.anchorUuid && H !== K.headUuid) q.set(H, {
                ...J,
                parentUuid: K.tailUuid
            });
        for (let H of w) {
            let J = q.get(H);
            if (J?.type !== "assistant") continue;
            q.set(H, {
                ...J,
                message: {
                    ...J.message,
                    usage: {
                        ...J.message.usage,
                        input_tokens: 0,
                        output_tokens: 0,
                        cache_creation_input_tokens: 0,
                        cache_read_input_tokens: 0
                    }
                }
            })
        }
    }
    let $ = [];
    for (let [j] of q) {
        let H = Y.get(j);
        if (H !== void 0 && H < z && !w.has(j)) $.push(j)
    }
    for (let j of $) q.delete(j)
}
// @from(Ln 496022, Col 0)
function no8(q, K) {
    let _, z = -1 / 0;
    for (let Y of q) {
        if (!K(Y)) continue;
        let A = Date.parse(Y.timestamp);
        if (A > z) z = A, _ = Y
    }
    return _
}
// @from(Ln 496032, Col 0)
function P96(q, K) {
    let _ = [],
        z = new Set,
        Y = K;
    while (Y) {
        if (z.has(Y.uuid)) {
            j6(Error(`Cycle detected in parentUuid chain at message ${Y.uuid}. Returning partial transcript.`)), d("tengu_chain_parent_cycle", {});
            break
        }
        z.add(Y.uuid), _.push(Y);
        let A = Y.parentUuid;
        if (!A) break;
        let O = q.get(A);
        if (!O || z.has(O.uuid)) {
            if (O = WtY(q, Y, z), O) d("tengu_chain_timestamp_fallback", {})
        }
        Y = O
    }
    return _.reverse(), DtY(q, _, z)
}
// @from(Ln 496053, Col 0)
function WtY(q, K, _) {
    let z = new Date(K.timestamp).getTime();
    if (Number.isNaN(z)) return;
    let Y, A = 1 / 0;
    for (let O of q.values()) {
        if (_.has(O.uuid)) continue;
        if (O.isSidechain !== K.isSidechain) continue;
        let w = new Date(O.timestamp).getTime();
        if (Number.isNaN(w)) continue;
        let $ = z - w;
        if ($ >= 0 && $ <= PtY && $ < A) A = $, Y = O
    }
    return Y
}
// @from(Ln 496068, Col 0)
function DtY(q, K, _) {
    let z = K.filter((J) => J.type === "assistant");
    if (z.length === 0) return K;
    let Y = new Map;
    for (let J of z)
        if (J.message.id) Y.set(J.message.id, J);
    let A = new Map,
        O = new Map;
    for (let J of q.values())
        if (J.type === "assistant" && J.message.id) {
            let X = A.get(J.message.id);
            if (X) X.push(J);
            else A.set(J.message.id, [J])
        } else if (J.type === "user" && J.parentUuid && Array.isArray(J.message.content) && J.message.content.some((X) => X.type === "tool_result")) {
        let X = O.get(J.parentUuid);
        if (X) X.push(J);
        else O.set(J.parentUuid, [J])
    }
    let w = new Set,
        $ = new Map,
        j = 0;
    for (let J of z) {
        let X = J.message.id;
        if (!X || w.has(X)) continue;
        w.add(X);
        let M = A.get(X) ?? [J],
            P = M.filter((G) => !_.has(G.uuid)),
            W = [];
        for (let G of M) {
            let f = O.get(G.uuid);
            if (!f) continue;
            for (let v of f)
                if (!_.has(v.uuid)) W.push(v)
        }
        if (P.length === 0 && W.length === 0) continue;
        P.sort((G, f) => G.timestamp.localeCompare(f.timestamp)), W.sort((G, f) => G.timestamp.localeCompare(f.timestamp));
        let D = Y.get(X),
            Z = [...P, ...W];
        for (let G of Z) _.add(G.uuid);
        j += Z.length, $.set(D.uuid, Z)
    }
    if (j === 0) return K;
    d("tengu_chain_parallel_tr_recovered", {
        recovered_count: j
    });
    let H = [];
    for (let J of K) {
        H.push(J);
        let X = $.get(J.uuid);
        if (X) H.push(...X)
    }
    return H
}
// @from(Ln 496122, Col 0)
function _77(q) {
    for (let K = q.length - 1; K >= 0; K--) {
        let _ = q[K];
        if (_.type !== "system" || _.subtype !== "turn_duration") continue;
        let z = _.messageCount;
        if (z === void 0) return;
        let Y = K;
        d("tengu_resume_consistency_delta", {
            expected: z,
            actual: Y,
            delta: Y - z,
            chain_length: q.length,
            checkpoint_age_entries: q.length - 1 - K
        });
        return
    }
}
// @from(Ln 496140, Col 0)
function io8(q, K) {
    let _ = [],
        z = new Map;
    for (let Y of K) {
        let A = q.get(Y.uuid);
        if (!A) continue;
        let {
            snapshot: O,
            isSnapshotUpdate: w
        } = A, $ = w ? z.get(O.messageId) : void 0;
        if ($ === void 0) z.set(O.messageId, _.length), _.push(O);
        else _[$] = O
    }
    return _
}
// @from(Ln 496156, Col 0)
function ro8(q, K) {
    return Array.from(q.values())
}
// @from(Ln 496159, Col 0)
async function ZtY(q) {
    if (q.endsWith(".jsonl")) {
        let {
            messages: Y,
            summaries: A,
            customTitles: O,
            tags: w,
            fileHistorySnapshots: $,
            attributionSnapshots: j,
            contextCollapseCommits: H,
            contextCollapseSnapshot: J,
            leafUuids: X,
            contentReplacements: M,
            worktreeStates: P
        } = await Ut(q);
        if (Y.size === 0) throw Error("No messages found in JSONL file");
        let W = no8(Y.values(), (V) => X.has(V.uuid));
        if (!W) throw Error("No valid conversation chain found in JSONL file");
        let D = P96(Y, W),
            Z = A.get(W.uuid),
            G = O.get(W.sessionId),
            f = w.get(W.sessionId),
            v = W.sessionId;
        return {
            ...DH7(D, 0, Z, G, io8($, D), f, q, ro8(j, D), void 0, M.get(v) ?? []),
            contextCollapseCommits: H.filter((V) => V.sessionId === v),
            contextCollapseSnapshot: J?.sessionId === v ? J : void 0,
            worktreeSession: P.has(v) ? P.get(v) : void 0
        }
    }
    let K = await bu6(q, {
            encoding: "utf-8"
        }),
        _;
    try {
        _ = n8(K)
    } catch (Y) {
        throw Error(`Invalid JSON in transcript file: ${Y}`)
    }
    let z;
    if (Array.isArray(_)) z = _;
    else if (_ && typeof _ === "object" && "messages" in _) {
        if (!Array.isArray(_.messages)) throw Error("Transcript messages must be an array");
        z = _.messages
    } else throw Error("Transcript must be an array of messages or an object with a messages array");
    if (z.length === 0) throw Error("No messages found in JSON file");
    return DH7(z, 0, void 0, void 0, void 0, void 0, q)
}
// @from(Ln 496208, Col 0)
function ftY(q) {
    if (q.type !== "user") return !1;
    if (q.isMeta) return !1;
    let K = q.message?.content;
    if (!K) return !1;
    if (typeof K === "string") return K.trim().length > 0;
    if (Array.isArray(K)) return K.some((_) => _.type === "text" || _.type === "image" || _.type === "document");
    return !1
}
// @from(Ln 496218, Col 0)
function GtY(q) {
    if (q.type !== "assistant") return !1;
    let K = q.message?.content;
    if (!K || !Array.isArray(K)) return !1;
    return K.some((_) => _.type === "text" && typeof _.text === "string" && _.text.trim().length > 0)
}
// @from(Ln 496225, Col 0)
function CH7(q) {
    let K = 0;
    for (let _ of q) switch (_.type) {
        case "user":
            if (ftY(_)) K++;
            break;
        case "assistant":
            if (GtY(_)) K++;
            break;
        case "attachment":
        case "system":
        case "progress":
            break
    }
    return K
}
// @from(Ln 496242, Col 0)
function DH7(q, K = 0, _, z, Y, A, O, w, $, j) {
    let H = q.at(-1),
        J = q[0],
        X = SH7(q),
        M = new Date(J.timestamp),
        P = new Date(H.timestamp);
    return {
        date: H.timestamp,
        messages: xC6(q),
        fullPath: O,
        value: K,
        created: M,
        modified: P,
        firstPrompt: X,
        messageCount: CH7(q),
        isSidechain: J.isSidechain,
        teamName: J.teamName,
        sessionKind: J.sessionKind,
        agentName: J.agentName,
        agentSetting: $,
        leafUuid: H.uuid,
        summary: _,
        customTitle: z,
        tag: A,
        fileHistorySnapshots: Y,
        attributionSnapshots: w,
        contentReplacements: j,
        gitBranch: H.gitBranch,
        projectPath: J.cwd
    }
}
// @from(Ln 496273, Col 0)
async function vtY(q) {
    let K = new Map,
        _ = 0;
    for (let O of q) {
        let w = xY(O);
        if (w) {
            let $ = (K.get(w) || 0) + 1;
            K.set(w, $), _ = Math.max($, _)
        }
    }
    if (_ <= 1) return;
    let z = Array.from(K.values()).filter((O) => O > 1),
        Y = z.length,
        A = z.reduce((O, w) => O + w, 0);
    d("tengu_session_forked_branches_fetched", {
        total_sessions: K.size,
        sessions_with_branches: Y,
        max_branches_per_session: Math.max(...z),
        avg_branches_per_session: Math.round(A / Y),
        total_transcript_count: q.length
    })
}
// @from(Ln 496295, Col 0)
async function FeK(q) {
    let K = e2(Y7()),
        _ = await hu6(K, q, Y7());
    return await vtY(_), _
}
// @from(Ln 496301, Col 0)
function lT(q, K) {
    let _ = V8(),
        z = I6(K) + `
`;
    try {
        _.appendFileSync(q, z, {
            mode: 384
        })
    } catch {
        _.mkdirSync(Hz8(q), {
            mode: 448
        }), _.appendFileSync(q, z, {
            mode: 384
        })
    }
    x_().fireMirror(q, [K])
}
// @from(Ln 496319, Col 0)
function TtY(q) {
    let K;
    try {
        K = fH7(q, "r");
        let _ = tsY(K),
            z = Math.max(0, _.size - Tr),
            Y = Buffer.allocUnsafe(Math.min(Tr, _.size - z)),
            A = Lu6(K, Y, 0, Y.length, z);
        return Y.toString("utf8", 0, A)
    } catch {
        return ""
    } finally {
        if (K !== void 0) try {
            ZH7(K)
        } catch {}
    }
}
// @from(Ln 496336, Col 0)
async function AN(q, K, _, z = "user") {
    let Y = _ ?? xT(q);
    if (lT(Y, {
            type: "custom-title",
            customTitle: K,
            sessionId: q
        }), q === I8()) x_().currentSessionTitle = K, uH7.emit();
    d("tengu_session_renamed", {
        source: z
    })
}
// @from(Ln 496348, Col 0)
function oo8(q, K) {
    lT(xT(q), {
        type: "ai-title",
        aiTitle: K,
        sessionId: q
    })
}
// @from(Ln 496355, Col 0)
async function VtY(q, K, _, z, Y) {
    let A = Y ?? xT(q);
    if (lT(A, {
            type: "pr-link",
            sessionId: q,
            prNumber: K,
            prUrl: _,
            prRepository: z,
            timestamp: new Date().toISOString()
        }), q === I8()) {
        let O = x_();
        O.currentSessionPrNumber = K, O.currentSessionPrUrl = _, O.currentSessionPrRepository = z
    }
    d("tengu_session_linked_to_pr", {
        prNumber: K
    })
}
// @from(Ln 496373, Col 0)
function NH(q) {
    if (q === I8()) return x_().currentSessionTitle;
    return
}
// @from(Ln 496378, Col 0)
function bH7() {
    return x_().currentSessionAgentColor
}
// @from(Ln 496382, Col 0)
function IH7() {
    return x_().currentSessionAgentName
}
// @from(Ln 496386, Col 0)
function In(q) {
    let K = x_();
    if (q.customTitle) K.currentSessionTitle ??= q.customTitle;
    if (q.tag !== void 0) K.currentSessionTag = q.tag || void 0;
    if (q.agentName) K.currentSessionAgentName = q.agentName;
    if (q.agentColor) K.currentSessionAgentColor = q.agentColor;
    if (q.agentSetting) K.currentSessionAgentSetting = q.agentSetting;
    if (q.mode) K.currentSessionMode = q.mode;
    if (q.permissionMode) K.currentSessionPermissionMode = q.permissionMode;
    if (q.worktreeSession !== void 0) K.currentSessionWorktree = q.worktreeSession;
    if (q.prNumber !== void 0) K.currentSessionPrNumber = q.prNumber;
    if (q.prUrl) K.currentSessionPrUrl = q.prUrl;
    if (q.prRepository) K.currentSessionPrRepository = q.prRepository
}
// @from(Ln 496401, Col 0)
function Q98() {
    let q = x_();
    q.currentSessionTitle = void 0, q.currentSessionTag = void 0, q.currentSessionAgentName = void 0, q.currentSessionAgentColor = void 0, q.currentSessionLastPrompt = void 0, q.currentSessionAgentSetting = void 0, q.currentSessionMode = void 0, q.currentSessionPermissionMode = void 0, q.currentSessionWorktree = void 0, q.currentSessionPrNumber = void 0, q.currentSessionPrUrl = void 0, q.currentSessionPrRepository = void 0
}
// @from(Ln 496406, Col 0)
function DR6() {
    x_().reAppendSessionMetadata()
}
// @from(Ln 496409, Col 0)
async function oP6(q, K, _, z = "user") {
    let Y = _ ?? xT(q);
    if (lT(Y, {
            type: "agent-name",
            agentName: K,
            sessionId: q
        }), q === I8()) x_().currentSessionAgentName = K, NQ(K), geK.emit();
    d("tengu_agent_name_set", {
        source: z
    })
}
// @from(Ln 496420, Col 0)
async function pn8(q, K, _) {
    let z = _ ?? xT(q);
    if (lT(z, {
            type: "agent-color",
            agentColor: K,
            sessionId: q
        }), q === I8()) x_().currentSessionAgentColor = K;
    d("tengu_agent_color_set", {})
}
// @from(Ln 496430, Col 0)
function Mz8(q) {
    x_().currentSessionAgentSetting = q
}
// @from(Ln 496434, Col 0)
function BH7(q) {
    x_().currentSessionTitle = q, uH7.emit()
}
// @from(Ln 496438, Col 0)
function ktY(q) {
    x_().currentSessionMode = q
}
// @from(Ln 496442, Col 0)
function pH7(q) {
    x_().currentSessionPermissionMode = q
}
// @from(Ln 496446, Col 0)
function zL(q) {
    let K = q ? {
            originalCwd: q.originalCwd,
            worktreePath: q.worktreePath,
            worktreeName: q.worktreeName,
            worktreeBranch: q.worktreeBranch,
            originalBranch: q.originalBranch,
            originalHeadCommit: q.originalHeadCommit,
            sessionId: q.sessionId,
            tmuxSessionName: q.tmuxSessionName,
            hookBased: q.hookBased,
            enteredExisting: q.enteredExisting
        } : null,
        _ = x_();
    if (_.currentSessionWorktree = K, _.sessionFile) lT(_.sessionFile, {
        type: "worktree-state",
        worktreeSession: K,
        sessionId: I8()
    })
}
// @from(Ln 496467, Col 0)
function xY(q) {
    if (q.sessionId) return q.sessionId;
    return q.messages[0]?.sessionId
}
// @from(Ln 496472, Col 0)
function SF(q) {
    return q.messages.length === 0 && q.sessionId !== void 0
}
// @from(Ln 496475, Col 0)
async function gt(q) {
    if (!SF(q)) return q;
    let K = q.fullPath;
    if (!K) return q;
    try {
        let {
            messages: _,
            summaries: z,
            customTitles: Y,
            tags: A,
            agentNames: O,
            agentColors: w,
            agentSettings: $,
            prNumbers: j,
            prUrls: H,
            prRepositories: J,
            modes: X,
            permissionModes: M,
            worktreeStates: P,
            fileHistorySnapshots: W,
            attributionSnapshots: D,
            contentReplacements: Z,
            contextCollapseCommits: G,
            contextCollapseSnapshot: f,
            leafUuids: v
        } = await Ut(K);
        if (_.size === 0) return q;
        let V = no8(_.values(), (R) => v.has(R.uuid) && (R.type === "user" || R.type === "assistant"));
        if (!V) return q;
        let k = P96(_, V),
            N = V.sessionId;
        return {
            ...q,
            messages: xC6(k),
            firstPrompt: SH7(k),
            messageCount: CH7(k),
            summary: V ? z.get(V.uuid) : q.summary,
            customTitle: N ? Y.get(N) : q.customTitle,
            tag: N ? A.get(N) : q.tag,
            agentName: N ? O.get(N) : q.agentName,
            agentColor: N ? w.get(N) : q.agentColor,
            agentSetting: N ? $.get(N) : q.agentSetting,
            mode: N ? X.get(N) : q.mode,
            permissionMode: N ? M.get(N) : q.permissionMode,
            worktreeSession: N && P.has(N) ? P.get(N) : q.worktreeSession,
            prNumber: N ? j.get(N) : q.prNumber,
            prUrl: N ? H.get(N) : q.prUrl,
            prRepository: N ? J.get(N) : q.prRepository,
            gitBranch: V?.gitBranch ?? q.gitBranch,
            isSidechain: k[0]?.isSidechain ?? q.isSidechain,
            teamName: k[0]?.teamName ?? q.teamName,
            sessionKind: k[0]?.sessionKind ?? q.sessionKind,
            leafUuid: V?.uuid ?? q.leafUuid,
            fileHistorySnapshots: io8(W, k),
            attributionSnapshots: ro8(D, k),
            contentReplacements: N ? Z.get(N) ?? [] : q.contentReplacements,
            contextCollapseCommits: N ? G.filter((R) => R.sessionId === N) : void 0,
            contextCollapseSnapshot: N && f?.sessionId === N ? f : void 0
        }
    } catch {
        return q
    }
}
// @from(Ln 496538, Col 0)
async function Zu(q, K) {
    let {
        limit: _,
        exact: z
    } = K || {}, Y = await OW6(Y7()), A = await QeK(Y), {
        logs: O
    } = await vW6(A, 0, A.length), w = q.toLowerCase().trim(), $ = O.filter((J) => {
        let X = J.customTitle?.toLowerCase().trim();
        if (!X) return !1;
        return z ? X === w : X.includes(w)
    }), j = new Map;
    for (let J of $) {
        let X = xY(J);
        if (X) {
            let M = j.get(X);
            if (!M || J.modified > M.modified) j.set(X, J)
        }
    }
    let H = Array.from(j.values());
    if (H.sort((J, X) => X.modified.getTime() - J.modified.getTime()), _) return H.slice(0, _);
    return H
}
// @from(Ln 496561, Col 0)
function NtY(q, K, _) {
    let w = 0,
        $ = !1,
        j = !1,
        H = 0;
    for (let J = K; H < _.length; J++) {
        if (J === _[H]) {
            if (w === 1 && !$) return _[H];
            H++
        }
        let X = q[J];
        if (j) j = !1;
        else if ($) {
            if (X === 92) j = !0;
            else if (X === 34) $ = !1
        } else if (X === 34) $ = !0;
        else if (X === 123) w++;
        else if (X === 125) w--
    }
    return _.at(-1)
}
// @from(Ln 496583, Col 0)
function EtY(q) {
    let Y = Buffer.from('{"parentUuid":'),
        A = Buffer.from('"uuid":"'),
        O = Buffer.from('"isSidechain":true'),
        w = 36,
        $ = Buffer.from('","timestamp":"'),
        j = $.length,
        H = Y.length,
        J = A.length,
        X = [],
        M = [],
        P = new Map,
        W = 0,
        D = q.length;
    while (W < D) {
        let R = q.indexOf(10, W),
            h = R === -1 ? D : R + 1;
        if (h - W > H && q[W] === 123 && q.compare(Y, 0, H, W, W + H) === 0) {
            let C = q[W + H] === 34 ? W + H + 1 : -1,
                x = -1,
                B = -1,
                m, S = W;
            for (;;) {
                let U = q.indexOf(A, S);
                if (U < 0 || U >= h) break;
                if (x < 0) x = U;
                let g = U + J + 36;
                if (g + j <= h && q.compare($, 0, j, g, g + j) === 0)
                    if (B < 0) B = U;
                    else(m ??= [B]).push(U);
                S = U + J
            }
            let F = m ? NtY(q, W, m) : B >= 0 ? B : x;
            if (F >= 0) {
                let U = F + J,
                    g = q.toString("latin1", U, U + 36);
                P.set(g, X.length), X.push(W, h, C)
            } else M.push(W, h)
        } else M.push(W, h);
        W = h
    }
    let Z = -1;
    for (let R = X.length - 3; R >= 0; R -= 3) {
        let h = q.indexOf(O, X[R]);
        if (h === -1 || h >= X[R + 1]) {
            Z = R;
            break
        }
    }
    if (Z < 0) return q;
    let G = new Set,
        f = new Set,
        v = 0,
        V = Z;
    while (V !== void 0) {
        if (G.has(V)) break;
        G.add(V), f.add(X[V]), v += X[V + 1] - X[V];
        let R = X[V + 2];
        if (R < 0) break;
        let h = q.toString("latin1", R, R + 36);
        V = P.get(h)
    }
    if (D - v < D >> 1) return q;
    let k = [],
        N = 0;
    for (let R = 0; R < X.length; R += 3) {
        let h = X[R];
        while (N < M.length && M[N] < h) k.push(q.subarray(M[N], M[N + 1])), N += 2;
        if (f.has(h)) k.push(q.subarray(h, X[R + 1]))
    }
    while (N < M.length) k.push(q.subarray(M[N], M[N + 1])), N += 2;
    return Buffer.concat(k)
}
// @from(Ln 496657, Col 0)
function ytY(q, K, _, z) {
    let O = Buffer.from('{"type":"attribution-snapshot"'),
        w = Buffer.from('"compact_boundary"'),
        $ = Buffer.allocUnsafe(1048576),
        j = Buffer.allocUnsafe(O.length),
        H = fH7(q, "r"),
        J = -1,
        X = 0,
        M = -1,
        P = 0,
        W = (D, Z, G, f) => {
            if (G >= O.length && D.compare(O, 0, O.length, Z, Z + O.length) === 0) {
                J = f, X = G;
                return
            }
            let v = D.toString("utf8", Z, Z + G);
            if (D.includes(w, Z) && D.indexOf(w, Z) < Z + G) {
                let k = n8(v);
                if (k?.type === "system" && k.subtype === "compact_boundary") {
                    if (!k.compactMetadata?.preservedSegment) z(), J = -1, X = 0
                }
            }
            let V = n8(v);
            if (V) _(V)
        };
    try {
        while (P < K) {
            let D = Lu6(H, $, 0, 1048576, P);
            if (D === 0) break;
            let Z = 0;
            for (let G = 0; G < D; G++)
                if ($[G] === 10) {
                    if (M >= 0) {
                        let f = P + G - M,
                            v = Math.min(O.length, f);
                        if (Lu6(H, j, 0, v, M), v === O.length && j.compare(O, 0, O.length, 0, O.length) === 0) J = M, X = f;
                        else {
                            let V = Buffer.allocUnsafe(f);
                            Lu6(H, V, 0, f, M), W(V, 0, f, M)
                        }
                        M = -1
                    } else if (G > Z) W($, Z, G - Z, P + Z);
                    Z = G + 1
                } if (Z < D && M < 0) M = P + Z;
            P += D
        }
        if (M >= 0) {
            let D = K - M,
                Z = Buffer.allocUnsafe(D);
            Lu6(H, Z, 0, D, M), W(Z, 0, D, M)
        }
    } finally {
        ZH7(H)
    }
    return {
        lastAttributionOffset: J,
        lastAttributionLength: X
    }
}
// @from(Ln 496717, Col 0)
function LtY(q, K, _) {
    if (K < 0 || _ <= 0) return null;
    let z = fH7(q, "r");
    try {
        let Y = Buffer.allocUnsafe(_);
        return Lu6(z, Y, 0, _, K), n8(Y.toString("utf8"))
    } finally {
        ZH7(z)
    }
}
// @from(Ln 496727, Col 0)
async function Ut(q, K) {
    let _ = new Map,
        z = new Map,
        Y = new Map,
        A = new Map,
        O = new Map,
        w = new Map,
        $ = new Map,
        j = new Map,
        H = new Map,
        J = new Map,
        X = new Map,
        M = new Map,
        P = new Map,
        W = new Map,
        D = new Map,
        Z = new Map,
        G = new Map,
        f = [],
        v, V, k = new Map,
        N = (h) => {
            if (YtY(h)) {
                let C = h.parentUuid;
                k.set(h.uuid, C && k.has(C) ? k.get(C) ?? null : C);
                return
            }
            if (ul(h)) {
                if (h.parentUuid && k.has(h.parentUuid)) h.parentUuid = k.get(h.parentUuid) ?? null;
                if (_.set(h.uuid, h), !h.isSidechain) V = h.uuid;
                if (RJ(h)) f.length = 0, v = void 0
            } else if (h.type === "summary" && h.leafUuid) z.set(h.leafUuid, h.summary);
            else if (h.type === "custom-title" && h.sessionId) Y.set(h.sessionId, h.customTitle);
            else if (h.type === "tag" && h.sessionId) A.set(h.sessionId, h.tag);
            else if (h.type === "agent-name" && h.sessionId) O.set(h.sessionId, h.agentName);
            else if (h.type === "agent-color" && h.sessionId) w.set(h.sessionId, h.agentColor);
            else if (h.type === "agent-setting" && h.sessionId) $.set(h.sessionId, h.agentSetting);
            else if (h.type === "mode" && h.sessionId) X.set(h.sessionId, h.mode);
            else if (h.type === "permission-mode" && h.sessionId) M.set(h.sessionId, h.permissionMode);
            else if (h.type === "worktree-state" && h.sessionId) P.set(h.sessionId, h.worktreeSession);
            else if (h.type === "pr-link" && h.sessionId) j.set(h.sessionId, h.prNumber), H.set(h.sessionId, h.prUrl), J.set(h.sessionId, h.prRepository);
            else if (h.type === "file-history-snapshot") W.set(h.messageId, h);
            else if (h.type === "attribution-snapshot") D.clear(), D.set(h.messageId, h);
            else if (h.type === "content-replacement")
                if (h.agentId) {
                    let C = G.get(h.agentId) ?? [];
                    G.set(h.agentId, C), C.push(...h.replacements)
                } else {
                    let C = Z.get(h.sessionId) ?? [];
                    Z.set(h.sessionId, C), C.push(...h.replacements)
                }
            else if (h.type === "marble-origami-commit") f.push(h);
            else if (h.type === "marble-origami-snapshot") v = h
        };
    try {
        if (!S6(process.env.CLAUDE_CODE_DISABLE_PRECOMPACT_SKIP)) {
            let {
                size: C
            } = await GH7(q);
            if (C > AQ6) {
                let x = ytY(q, C, N, () => {
                        _.clear(), W.clear(), k.clear()
                    }),
                    B = LtY(q, x.lastAttributionOffset, x.lastAttributionLength);
                if (B) D.set(B.messageId, B);
                return LeK(_), R()
            }
        }
        let h = await bu6(q);
        if (!K?.keepAllLeaves && h.length > AQ6) h = EtY(h);
        for (let C of Nr(h)) N(C)
    } catch {}
    return LeK(_), R();

    function R() {
        let h = [..._.values()],
            C = new Set(h.map((S) => S.parentUuid).filter((S) => S !== null)),
            x = h.filter((S) => !C.has(S.uuid)),
            B = new Set,
            m = !1;
        if (u8("tengu_pebble_leaf_prune", !1)) {
            let S = new Set;
            for (let F of h)
                if (F.parentUuid && (F.type === "user" || F.type === "assistant")) S.add(F.parentUuid);
            for (let F of x) {
                let U = new Set,
                    g = F;
                while (g) {
                    if (U.has(g.uuid)) {
                        m = !0;
                        break
                    }
                    if (U.add(g.uuid), g.type === "user" || g.type === "assistant") {
                        if (!S.has(g.uuid)) B.add(g.uuid);
                        break
                    }
                    g = g.parentUuid ? _.get(g.parentUuid) : void 0
                }
            }
        } else
            for (let S of x) {
                let F = new Set,
                    U = S;
                while (U) {
                    if (F.has(U.uuid)) {
                        m = !0;
                        break
                    }
                    if (F.add(U.uuid), U.type === "user" || U.type === "assistant") {
                        B.add(U.uuid);
                        break
                    }
                    U = U.parentUuid ? _.get(U.parentUuid) : void 0
                }
            }
        if (m) d("tengu_transcript_parent_cycle", {});
        if (!K?.keepAllLeaves && B.size > 1 && V && _.has(V)) {
            let S = new Set,
                F = _.get(V);
            while (F) {
                if (S.has(F.uuid)) break;
                if (S.add(F.uuid), F.type === "user" || F.type === "assistant") {
                    B.clear(), B.add(F.uuid);
                    break
                }
                F = F.parentUuid ? _.get(F.parentUuid) : void 0
            }
        }
        return {
            messages: _,
            summaries: z,
            customTitles: Y,
            tags: A,
            agentNames: O,
            agentColors: w,
            agentSettings: $,
            prNumbers: j,
            prUrls: H,
            prRepositories: J,
            modes: X,
            permissionModes: M,
            worktreeStates: P,
            fileHistorySnapshots: W,
            attributionSnapshots: D,
            contentReplacements: Z,
            agentContentReplacements: G,
            contextCollapseCommits: f,
            contextCollapseSnapshot: v,
            leafUuids: B
        }
    }
}
// @from(Ln 496878, Col 0)
async function UeK(q) {
    let K = CG(E86() ?? e2(Y7()), `${q}.jsonl`);
    return Ut(K)
}
// @from(Ln 496883, Col 0)
function Pr1() {
    Su6.cache.clear?.()
}
// @from(Ln 496886, Col 0)
async function FH7(q, K) {
    return (await Su6(q)).has(K)
}
// @from(Ln 496889, Col 0)
async function KK8(q) {
    let {
        messages: K,
        summaries: _,
        customTitles: z,
        tags: Y,
        agentNames: A,
        agentColors: O,
        agentSettings: w,
        prNumbers: $,
        prUrls: j,
        prRepositories: H,
        modes: J,
        permissionModes: X,
        worktreeStates: M,
        fileHistorySnapshots: P,
        attributionSnapshots: W,
        contentReplacements: D,
        contextCollapseCommits: Z,
        contextCollapseSnapshot: G,
        leafUuids: f
    } = await UeK(q);
    if (K.size === 0) return null;
    if (!Su6.cache.has(q)) Su6.cache.set(q, Promise.resolve(new Set(K.keys())));
    let v = no8(K.values(), (x) => f.has(x.uuid) && !x.isSidechain && (x.type === "user" || x.type === "assistant"));
    if (!v) return null;
    let V = P96(K, v),
        k = _.get(v.uuid),
        N = z.get(v.sessionId),
        R = Y.get(v.sessionId),
        h = w.get(q),
        C = DH7(V, 0, k, N, io8(P, V), R, xT(q), ro8(W, V), h, D.get(q) ?? []);
    return {
        ...C,
        agentName: A.get(q) ?? C.agentName,
        agentColor: O.get(q),
        mode: J.get(q),
        permissionMode: X.get(q),
        prNumber: $.get(q),
        prUrl: j.get(q),
        prRepository: H.get(q),
        worktreeSession: M.get(q),
        contextCollapseCommits: Z.filter((x) => x.sessionId === q),
        contextCollapseSnapshot: G?.sessionId === q ? G : void 0
    }
}
// @from(Ln 496935, Col 0)
async function uC6(q) {
    let K = await FeK(q),
        {
            logs: _
        } = await vW6(K, 0, K.length),
        z = Vf6(_);
    return z.forEach((Y, A) => {
        Y.value = A
    }), z
}
// @from(Ln 496945, Col 0)
async function M$7(q, K) {
    if (K?.skipIndex) return htY(q);
    return (await ao8(q, K?.initialEnrichCount ?? qa8)).logs
}
// @from(Ln 496949, Col 0)
async function htY(q) {
    let K = jg(),
        _;
    try {
        _ = await Cu6(K, {
            withFileTypes: !0
        })
    } catch {
        return []
    }
    let z = _.filter(($) => $.isDirectory()).map(($) => CG(K, $.name)),
        A = (await Promise.all(z.map(($) => btY($, q)))).flat(),
        O = new Map;
    for (let $ of A) {
        let j = `${$.sessionId??""}:${$.leafUuid??""}`,
            H = O.get(j);
        if (!H || $.modified.getTime() > H.modified.getTime()) O.set(j, $)
    }
    let w = Vf6([...O.values()]);
    return w.forEach(($, j) => {
        $.value = j
    }), w
}
// @from(Ln 496972, Col 0)
async function ao8(q, K = qa8) {
    let _ = jg(),
        z;
    try {
        z = await Cu6(_, {
            withFileTypes: !0
        })
    } catch {
        return {
            logs: [],
            allStatLogs: [],
            nextIndex: 0
        }
    }
    let Y = z.filter((j) => j.isDirectory()).map((j) => CG(_, j.name)),
        A = await Promise.all(Y.map((j) => hu6(j, q))),
        O = deK(A.flat()),
        {
            logs: w,
            nextIndex: $
        } = await vW6(O, 0, K);
    return w.forEach((j, H) => {
        j.value = H
    }), {
        logs: w,
        allStatLogs: O,
        nextIndex: $
    }
}
// @from(Ln 497001, Col 0)
async function Ir8(q, K, _ = qa8) {
    return (await Pz8(q, K, _)).logs
}
// @from(Ln 497004, Col 0)
async function Pz8(q, K, _ = qa8) {
    E(`/resume: loading sessions for cwd=${Y7()}, worktrees=[${q.join(", ")}]`);
    let z = await QeK(q, K);
    E(`/resume: found ${z.length} session files on disk`);
    let {
        logs: Y,
        nextIndex: A
    } = await vW6(z, 0, _);
    return Y.forEach((O, w) => {
        O.value = w
    }), {
        logs: Y,
        allStatLogs: z,
        nextIndex: A
    }
}
// @from(Ln 497020, Col 0)
async function QeK(q, K) {
    let _ = jg();
    if (q.length <= 1) {
        let j = Y7(),
            H = e2(j);
        return hu6(H, void 0, j)
    }
    let z = process.platform === "win32",
        Y = q.map((j) => {
            let H = AP(j);
            return {
                path: j,
                prefix: z ? H.toLowerCase() : H
            }
        });
    Y.sort((j, H) => H.prefix.length - j.prefix.length);
    let A = new Set,
        O;
    try {
        O = await Cu6(_, {
            withFileTypes: !0
        })
    } catch (j) {
        E(`Failed to read projects dir ${_}, falling back to current project: ${j}`);
        let H = e2(Y7());
        return hu6(H, K, Y7())
    }
    let w = [];
    for (let j of O) {
        if (!j.isDirectory()) continue;
        let H = z ? j.name.toLowerCase() : j.name;
        if (A.has(H)) continue;
        for (let {
                path: J,
                prefix: X
            }
            of Y)
            if (H === X || H.startsWith(X + "-")) {
                A.add(H), w.push({
                    projectDir: CG(_, j.name),
                    wtPath: J
                });
                break
            }
    }
    let $ = await Promise.all(w.map(({
        projectDir: j,
        wtPath: H
    }) => hu6(j, void 0, H)));
    return deK($.flat())
}
// @from(Ln 497071, Col 0)
async function O36(q) {
    let K = X0(q);
    try {
        let {
            messages: _,
            agentContentReplacements: z
        } = await Ut(K), Y = Array.from(_.values()).filter((j) => j.agentId === q && j.isSidechain);
        if (Y.length === 0) return null;
        let A = new Set(Y.map((j) => j.parentUuid)),
            O = no8(Y, (j) => !A.has(j.uuid));
        if (!O) return null;
        return {
            messages: P96(_, O).filter((j) => j.agentId === q).map(({
                isSidechain: j,
                parentUuid: H,
                ...J
            }) => J),
            contentReplacements: z.get(q) ?? []
        }
    } catch {
        return null
    }
}
// @from(Ln 497095, Col 0)
function gH7(q) {
    let K = [];
    for (let _ of q)
        if (_.type === "progress" && _.data && typeof _.data === "object" && "type" in _.data && (_.data.type === "agent_progress" || _.data.type === "skill_progress") && "agentId" in _.data && typeof _.data.agentId === "string") K.push(_.data.agentId);
    return F4(K)
}
// @from(Ln 497102, Col 0)
function yA7(q) {
    let K = {};
    for (let _ of Object.values(q))
        if (_.type === "in_process_teammate" && _.identity?.agentId && _.messages && _.messages.length > 0) K[_.identity.agentId] = _.messages;
    return K
}
// @from(Ln 497108, Col 0)
async function so8(q) {
    let K = await Promise.all(q.map(async (z) => {
            try {
                let Y = await O36(w2(z));
                if (Y && Y.messages.length > 0) return {
                    agentId: z,
                    transcript: Y.messages
                };
                return null
            } catch {
                return null
            }
        })),
        _ = {};
    for (let z of K)
        if (z) _[z.agentId] = z.transcript;
    return _
}
// @from(Ln 497126, Col 0)
async function to8() {
    let q = CG(E86() ?? e2(Y7()), I8(), "subagents"),
        K;
    try {
        K = await Cu6(q, {
            withFileTypes: !0
        })
    } catch {
        return []
    }
    return K.filter((_) => _.isFile() && _.name.startsWith("agent-") && _.name.endsWith(".jsonl")).map((_) => _.name.slice(6, -6))
}
// @from(Ln 497138, Col 0)
async function LA7() {
    return so8(await to8())
}
// @from(Ln 497142, Col 0)
function GW6(q) {
    if (q.type === "progress") return !1;
    if (q.type === "attachment" && q.attachment.type === "hook_success" && !q.attachment.content && !q.attachment.stdout?.trim() && !q.attachment.stderr?.trim()) return !1;
    if (q.type === "attachment" && lo8() !== "ant" && RtY.has(q.attachment.type)) return !1;
    return !0
}
// @from(Ln 497149, Col 0)
function eo8(q, K = new Set) {
    for (let _ of q)
        if (_.type === "assistant" && Array.isArray(_.message.content)) {
            for (let z of _.message.content)
                if (z.type === "tool_use" && z.name === GO) K.add(z.id)
        } return K
}
// @from(Ln 497157, Col 0)
function StY(q, K) {
    return q.flatMap((_) => {
        if (_.type === "assistant" && Array.isArray(_.message.content)) {
            let z = _.message.content,
                A = z.some((O) => O.type === "tool_use" && O.name === GO) ? z.filter((O) => !(O.type === "tool_use" && O.name === GO)) : z;
            if (A.length === 0) return [];
            if (_.isVirtual) {
                let {
                    isVirtual: O,
                    ...w
                } = _;
                return [{
                    ...w,
                    message: {
                        ..._.message,
                        content: A
                    }
                }]
            }
            if (A !== z) return [{
                ..._,
                message: {
                    ..._.message,
                    content: A
                }
            }];
            return [_]
        }
        if (_.type === "user" && Array.isArray(_.message.content)) {
            let z = _.message.content,
                A = z.some((O) => O.type === "tool_result" && K.has(O.tool_use_id)) ? z.filter((O) => !(O.type === "tool_result" && K.has(O.tool_use_id))) : z;
            if (A.length === 0) return [];
            if (_.isVirtual) {
                let {
                    isVirtual: O,
                    ...w
                } = _;
                return [{
                    ...w,
                    message: {
                        ..._.message,
                        content: A
                    }
                }]
            }
            if (A !== z) return [{
                ..._,
                message: {
                    ..._.message,
                    content: A
                }
            }];
            return [_]
        }
        if ("isVirtual" in _ && _.isVirtual) {
            let {
                isVirtual: z,
                ...Y
            } = _;
            return [Y]
        }
        return [_]
    })
}
// @from(Ln 497222, Col 0)
function Wz8(q, K = q) {
    let _ = q.filter(GW6);
    if (lo8() === "ant") return _;
    let z = K instanceof Set ? K : eo8(K);
    return StY(_, z)
}
// @from(Ln 497228, Col 0)
async function CtY(q) {
    return (await uC6())[q] || null
}
// @from(Ln 497231, Col 0)
async function UH7(q) {
    try {
        let K = bY(),
            {
                messages: _
            } = await Ut(K),
            z = null;
        for (let Y of _.values())
            if (Y.type === "assistant") {
                let A = Y.message.content;
                if (Array.isArray(A)) {
                    for (let O of A)
                        if (O.type === "tool_use" && O.id === q) {
                            z = Y;
                            break
                        }
                }
            } else if (Y.type === "user") {
            let A = Y.message.content;
            if (Array.isArray(A)) {
                for (let O of A)
                    if (O.type === "tool_result" && O.tool_use_id === q) return null
            }
        }
        return z
    } catch {
        return null
    }
}
// @from(Ln 497260, Col 0)
async function z77(q) {
    try {
        let {
            content: K,
            bytesRead: _,
            bytesTotal: z
        } = await RC(q, 1048576), Y = K.split(`
`);
        if (_ < z) Y.shift();
        let A = null,
            O = -1;
        for (let $ = Y.length - 1; $ >= 0; $--) {
            let j = Y[$].trim();
            if (!j.includes('"hook_deferred_tool"')) continue;
            let H = n8(j);
            if (H?.type === "attachment" && H.attachment?.type === "hook_deferred_tool") {
                A = H.attachment, O = $;
                break
            }
        }
        if (!A) return null;
        let w = `"tool_use_id":"${A.toolUseID}"`;
        for (let $ = O + 1; $ < Y.length; $++)
            if (Y[$].includes(w)) return null;
        return A
    } catch {
        return null
    }
}
// @from(Ln 497289, Col 0)
async function jz8(q) {
    let K = new Map,
        _;
    try {
        _ = await Cu6(q, {
            withFileTypes: !0
        })
    } catch {
        return K
    }
    let z = [];
    for (let Y of _) {
        if (!Y.isFile() || !Y.name.endsWith(".jsonl")) continue;
        let A = sp(KtY(Y.name, ".jsonl"));
        if (!A) continue;
        z.push({
            sessionId: A,
            filePath: CG(q, Y.name)
        })
    }
    return await Promise.all(z.map(async ({
        sessionId: Y,
        filePath: A
    }) => {
        try {
            let O = await GH7(A);
            K.set(Y, {
                path: A,
                mtime: O.mtime.getTime(),
                ctime: O.birthtime.getTime(),
                size: O.size
            })
        } catch {
            E(`Failed to stat session file: ${A}`)
        }
    })), K
}
// @from(Ln 497326, Col 0)
async function Uo8(q, K) {
    let {
        messages: _,
        summaries: z,
        customTitles: Y,
        tags: A,
        agentNames: O,
        agentColors: w,
        agentSettings: $,
        prNumbers: j,
        prUrls: H,
        prRepositories: J,
        modes: X,
        permissionModes: M,
        fileHistorySnapshots: P,
        attributionSnapshots: W,
        contentReplacements: D,
        leafUuids: Z
    } = await Ut(q, {
        keepAllLeaves: !0
    });
    if (_.size === 0) return [];
    let G = [],
        f = new Map;
    for (let V of _.values())
        if (Z.has(V.uuid)) G.push(V);
        else if (V.parentUuid) {
        let k = f.get(V.parentUuid);
        if (k) k.push(V);
        else f.set(V.parentUuid, [V])
    }
    let v = [];
    for (let V of G) {
        let k = P96(_, V);
        if (k.length === 0) continue;
        let N = f.get(V.uuid);
        if (N) N.sort((C, x) => C.timestamp < x.timestamp ? -1 : C.timestamp > x.timestamp ? 1 : 0), k.push(...N);
        let R = k[0],
            h = V.sessionId;
        v.push({
            date: V.timestamp,
            messages: xC6(k),
            fullPath: q,
            value: 0,
            created: new Date(R.timestamp),
            modified: new Date(V.timestamp),
            firstPrompt: SH7(k),
            messageCount: CH7(k),
            isSidechain: R.isSidechain ?? !1,
            sessionId: h,
            leafUuid: V.uuid,
            summary: z.get(V.uuid),
            customTitle: Y.get(h),
            tag: A.get(h),
            agentName: O.get(h),
            agentColor: w.get(h),
            agentSetting: $.get(h),
            mode: X.get(h),
            permissionMode: M.get(h),
            prNumber: j.get(h),
            prUrl: H.get(h),
            prRepository: J.get(h),
            gitBranch: V.gitBranch,
            projectPath: K ?? R.cwd,
            fileHistorySnapshots: io8(P, k),
            attributionSnapshots: ro8(W, k),
            contentReplacements: D.get(h) ?? []
        })
    }
    return v
}
// @from(Ln 497397, Col 0)
async function btY(q, K) {
    let _ = await jz8(q);
    if (_.size === 0) return [];
    let z;
    if (K && _.size > K) z = [..._.values()].sort((A, O) => O.mtime - A.mtime).slice(0, K);
    else z = [..._.values()];
    let Y = [];
    for (let A of z) try {
        let O = await Uo8(A.path);
        Y.push(...O)
    } catch {
        E(`Failed to load session file: ${A.path}`)
    }
    return Y
}
// @from(Ln 497412, Col 0)
async function ItY(q, K, _) {
    let {
        head: z,
        tail: Y
    } = await mm7(q, K, _);
    if (!z) return {
        firstPrompt: "",
        isSidechain: !1
    };
    let A = z.includes('"isSidechain":true') || z.includes('"isSidechain": true'),
        O = Vr(z, "cwd"),
        w = Vr(z, "teamName"),
        $ = Vr(z, "sessionKind"),
        j = $ === "bg" || $ === "daemon" || $ === "daemon-worker" ? $ : void 0,
        H = Vr(z, "agentSetting"),
        J = Vr(z, "entrypoint") ?? kV(Y, "entrypoint"),
        X = z.includes("<command-name>/loop</command-name>"),
        M = kV(Y, "lastPrompt") || xtY(z) || heK(z, "content", 200) || heK(z, "text", 200) || "",
        P = kV(Y, "customTitle") ?? kV(z, "customTitle") ?? kV(Y, "aiTitle") ?? kV(z, "aiTitle"),
        W = utY(Y, "summary", "summary"),
        D = kV(Y, "tag"),
        Z = kV(Y, "gitBranch") ?? Vr(z, "gitBranch"),
        G = kV(Y, "prUrl"),
        f = kV(Y, "prRepository"),
        v, V = kV(Y, "prNumber");
    if (V) v = parseInt(V, 10) || void 0;
    if (!v) {
        let k = Y.lastIndexOf('"prNumber":');
        if (k >= 0) {
            let N = Y.slice(k + 11, k + 25),
                R = parseInt(N.trim(), 10);
            if (R > 0) v = R
        }
    }
    return {
        firstPrompt: M,
        gitBranch: Z,
        isSidechain: A,
        projectPath: O,
        teamName: w,
        sessionKind: j,
        isLoopSession: X,
        customTitle: P,
        summary: W,
        tag: D,
        agentSetting: H,
        entrypoint: J,
        prNumber: v,
        prUrl: G,
        prRepository: f
    }
}
// @from(Ln 497465, Col 0)
function xtY(q) {
    let K = 0,
        _ = !1,
        z = "";
    while (K < q.length) {
        let Y = q.indexOf(`
`, K),
            A = Y >= 0 ? q.slice(K, Y) : q.slice(K);
        if (K = Y >= 0 ? Y + 1 : q.length, !A.includes('"type":"user"') && !A.includes('"type": "user"')) continue;
        if (A.includes('"tool_result"')) continue;
        if (A.includes('"isMeta":true') || A.includes('"isMeta": true')) continue;
        try {
            let O = n8(A);
            if (O.type !== "user") continue;
            let w = O.message;
            if (!w) continue;
            let $ = w.content,
                j = [];
            if (typeof $ === "string") j.push($);
            else if (Array.isArray($))
                for (let H of $) {
                    let J = H;
                    if (J.type === "text" && typeof J.text === "string") j.push(J.text)
                }
            for (let H of j) {
                if (!H) continue;
                let J = H.replaceAll(`
`, " ").trim(),
                    X = vK(J, TV);
                if (X) {
                    let P = X.replace(/^\//, ""),
                        W = vK(J, "command-args")?.trim() || "";
                    if (UF().has(P) || !W) {
                        if (!z) z = X;
                        continue
                    }
                    return W ? `${X} ${W}` : X
                }
                let M = vK(J, "bash-input");
                if (M) return `! ${M}`;
                if (SeK.test(J)) {
                    if (J.startsWith(`<${T16}>`)) _ = !0;
                    continue
                }
                if (J.length > 200) J = J.slice(0, 200).trim() + "…";
                return J
            }
        } catch {
            continue
        }
    }
    if (z) return z;
    if (_) return "Proactive session";
    return ""
}
// @from(Ln 497521, Col 0)
function utY(q, K, _) {
    let z = `{"type":"${K}"`,
        Y = q.length;
    while (Y > 0) {
        let A = q.lastIndexOf(`
`, Y - 1),
            O = q.slice(A + 1, Y);
        if (Y = A, O.startsWith(z)) {
            let w = Vr(O, _);
            if (w !== void 0) return w
        }
        if (A < 0) break
    }
    return
}
// @from(Ln 497537, Col 0)
function heK(q, K, _) {
    let z = [`"${K}":"`, `"${K}": "`];
    for (let Y of z) {
        let A = q.indexOf(Y);
        if (A < 0) continue;
        let O = A + Y.length,
            w = O,
            $ = 0;
        while (w < q.length && $ < _) {
            if (q[w] === "\\") {
                w += 2, $++;
                continue
            }
            if (q[w] === '"') break;
            w++, $++
        }
        return q.slice(O, w).replaceAll("\\n", " ").replaceAll("\\t", " ").trim()
    }
    return ""
}
// @from(Ln 497558, Col 0)
function deK(q) {
    let K = new Map;
    for (let _ of q) {
        if (!_.sessionId) continue;
        let z = K.get(_.sessionId);
        if (!z || _.modified.getTime() > z.modified.getTime()) K.set(_.sessionId, _)
    }
    return Vf6([...K.values()]).map((_, z) => ({
        ..._,
        value: z
    }))
}
// @from(Ln 497570, Col 0)
async function hu6(q, K, _) {
    let Y = [...(await jz8(q)).entries()].sort((w, $) => $[1].mtime - w[1].mtime);
    if (K && Y.length > K) Y = Y.slice(0, K);
    let A = [];
    for (let [w, $] of Y) A.push({
        date: new Date($.mtime).toISOString(),
        messages: [],
        isLite: !0,
        fullPath: $.path,
        value: 0,
        created: new Date($.ctime),
        modified: new Date($.mtime),
        firstPrompt: "",
        messageCount: 0,
        fileSize: $.size,
        isSidechain: !1,
        sessionId: w,
        projectPath: _
    });
    let O = Vf6(A);
    return O.forEach((w, $) => {
        w.value = $
    }), O
}
// @from(Ln 497594, Col 0)
async function mtY(q, K) {
    if (!q.isLite || !q.fullPath) return q;
    let _ = await ItY(q.fullPath, q.fileSize ?? 0, K),
        z = {
            ...q,
            isLite: !1,
            firstPrompt: _.firstPrompt,
            gitBranch: _.gitBranch,
            isSidechain: _.isSidechain,
            teamName: _.teamName,
            sessionKind: _.sessionKind,
            customTitle: _.customTitle,
            summary: _.summary,
            tag: _.tag,
            agentSetting: _.agentSetting,
            prNumber: _.prNumber,
            prUrl: _.prUrl,
            prRepository: _.prRepository,
            projectPath: _.projectPath ?? q.projectPath
        };
    if (!z.firstPrompt && !z.customTitle) z.firstPrompt = "(session)";
    if (z.isSidechain) return E(`Session ${q.sessionId} filtered from /resume: isSidechain=true`), null;
    if (z.teamName) return E(`Session ${q.sessionId} filtered from /resume: teamName=${z.teamName}`), null;
    if (z.sessionKind) return E(`Session ${q.sessionId} filtered from /resume: sessionKind=${z.sessionKind}`), null;
    let Y = ReK.has(meK() ?? "");
    if (!Y && ReK.has(_.entrypoint ?? "")) return E(`Session ${q.sessionId} filtered from /resume: entrypoint=${_.entrypoint}`), null;
    if (!Y && _.isLoopSession) return E(`Session ${q.sessionId} filtered from /resume: /loop session`), null;
    return z
}
// @from(Ln 497623, Col 0)
async function vW6(q, K, _) {
    let z = [],
        Y = Buffer.alloc(Tr),
        A = K;
    while (A < q.length && z.length < _) {
        let $ = q[A];
        A++;
        let j = await mtY($, Y);
        if (j) z.push(j)
    }
    let O = A - K,
        w = O - z.length;
    if (w > 0) E(`/resume: enriched ${O} sessions, ${w} filtered out, ${z.length} visible (${q.length-A} remaining on disk)`);
    return {
        logs: z,
        nextIndex: A
    }
}
// @from(Ln 497641, Col 4)
_tY
// @from(Ln 497641, Col 9)
ztY = 52428800
// @from(Ln 497642, Col 4)
SeK
// @from(Ln 497642, Col 9)
CeK
// @from(Ln 497642, Col 14)
AtY
// @from(Ln 497642, Col 19)
B98 = 52428800
// @from(Ln 497643, Col 4)
VH7
// @from(Ln 497643, Col 9)
e2
// @from(Ln 497643, Col 13)
fW6 = null
// @from(Ln 497644, Col 4)
EeK = !1
// @from(Ln 497645, Col 4)
yeK = 10
// @from(Ln 497646, Col 4)
PtY = 5000
// @from(Ln 497647, Col 4)
geK
// @from(Ln 497647, Col 9)
xH7
// @from(Ln 497647, Col 14)
uH7
// @from(Ln 497647, Col 19)
mH7
// @from(Ln 497647, Col 24)
Su6
// @from(Ln 497647, Col 29)
RtY
// @from(Ln 497647, Col 34)
qa8 = 50
// @from(Ln 497648, Col 4)
ReK
// @from(Ln 497649, Col 4)
g4 = L(() => {
    U4();
    C8();
    y8();
    tk8();
    CA();
    rA();
    B1();
    QF8();
    EP();
    Cf();
    R9();
    wf();
    n7();
    K8();
    VA();
    Q8();
    m8();
    c7();
    Yq();
    br8();
    pK();
    CY();
    mO();
    U8();
    _7();
    b9();
    hm();
    nH();
    e8();
    dc();
    _tY = {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.112",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-04-16T18:33:19Z"
    }.VERSION, SeK = /^(?:\s*<[a-z][\w-]*[\s>]|\[Request interrupted by user[^\]]*\])/;
    CeK = {
        user: "dedup-transcript",
        assistant: "dedup-transcript",
        attachment: "dedup-transcript",
        system: "dedup-transcript",
        progress: "dedup-transcript",
        summary: "always",
        "custom-title": "always",
        "ai-title": "always",
        "last-prompt": "always",
        tag: "always",
        "agent-name": "always",
        "agent-color": "always",
        "agent-setting": "always",
        "pr-link": "always",
        "file-history-snapshot": "always",
        "attribution-snapshot": "always",
        "speculation-accept": "always",
        mode: "always",
        "permission-mode": "always",
        "worktree-state": "always",
        "queue-operation": "always",
        "marble-origami-commit": "always",
        "marble-origami-snapshot": "always",
        "content-replacement": "route-by-agent"
    };
    AtY = new Set(["bash_progress", "powershell_progress", "mcp_progress", ...[], "repl_tool_call"]);
    VH7 = new Map;
    e2 = P1((q) => {
        return CG(jg(), AP(q))
    });
    geK = l5(), xH7 = geK.subscribe;
    uH7 = l5(), mH7 = uH7.subscribe;
    Su6 = P1(async (q) => {
        let {
            messages: K
        } = await UeK(q);
        return new Set(K.keys())
    }, (q) => q);
    RtY = new Set([]);
    ReK = new Set(["sdk-cli", "sdk-ts", "sdk-py"])
})
// @from(Ln 497730, Col 4)
ceK = {}
// @from(Ln 497735, Col 0)
function BtY(q, K = !1) {
    let _ = Nw(),
        z = vp(),
        Y = K ? ["## How to save memories", "", "Write each memory to its own file in the chosen directory (private or team, per the type's scope guidance) using this frontmatter format:", "", ...mh6, "", "- Keep the name, description, and type fields in memory files up-to-date with the content", "- Organize memory semantically by topic, not chronologically", "- Update or remove memories that turn out to be wrong or outdated", "- Do not write duplicate memories. First check if there is an existing memory you can update before writing a new one."] : ["## How to save memories", "", "Saving a memory is a two-step process:", "", "**Step 1** — write the memory to its own file in the chosen directory (private or team, per the type's scope guidance) using this frontmatter format:", "", ...mh6, "", `**Step 2** — add a pointer to that file in \`${YW}\` in the private directory. The single \`${YW}\` indexes both private and team memories — use a path like \`file.md\` for private memories and \`team/file.md\` for team memories. Each entry should be one line, under ~150 characters: \`- [Title](file.md) — one-line hook\`. It has no frontmatter. Never write memory content directly into \`${YW}\`.`, "", `- \`${YW}\` is loaded into your conversation context — lines after ${Ve} will be truncated, so keep the index concise`, "- Keep the name, description, and type fields in memory files up-to-date with the content", "- Organize memory semantically by topic, not chronologically", "- Update or remove memories that turn out to be wrong or outdated", "- Do not write duplicate memories. First check if there is an existing memory you can update before writing a new one."];
    return ["# Memory", "", `You have a persistent, file-based memory system with two directories: a private directory at \`${_}\` and a shared team directory at \`${z}\`. ${sd8}`, "", "You should build up this memory system over time so that future conversations can have a complete picture of who the user is, how they'd like to collaborate with you, what behaviors to avoid or repeat, and the context behind the work the user gives you.", "", "If the user explicitly asks you to remember something, save it immediately as whichever type fits best. If they ask you to forget something, find and remove the relevant entry.", "", "## Memory scope", "", "There are two scope levels:", "", `- private: memories that are private between you and the current user. They persist across conversations with only this specific user and are stored at the root \`${_}\`.`, `- team: memories that are shared with and contributed by all of the users who work within this project directory. Team memories are synced at the beginning of every session and they are stored at \`${z}\`.`, "", ...bC4, ...aH6, "- You MUST avoid saving sensitive data within shared team memories. For example, never save API keys or user credentials.", "", ...Y, "", "## When to access memories", "- When memories (personal or team) seem relevant, or the user references prior work with them or others in their organization.", "- You MUST access memory when the user explicitly asks you to check, recall, or remember.", "- If the user says to *ignore* or *not use* memory: Do not apply remembered facts, cite, compare against, or mention memory content.", ji1, "", ...sH6, "", "## Memory and other forms of persistence", "Memory is one of several persistence mechanisms available to you as you assist the user in a given conversation. The distinction is often that memory can be recalled in future conversations and should not be used for persisting information that is only useful within the scope of the current conversation.", "- When to use or update a plan instead of memory: If you are about to start a non-trivial implementation task and would like to reach alignment with the user on your approach you should use a Plan rather than saving this information to memory. Similarly, if you already have a plan within the conversation and you have changed your approach persist that change by updating the plan rather than saving a memory.", "- When to use or update tasks instead of memory: When you need to break your work in current conversation into discrete steps or keep track of your progress use tasks instead of saving to memory. Tasks are great for persisting information about the work that needs to be done in the current conversation, but memory should be reserved for information that will be useful in future conversations.", ...q ?? [], "", ...Dz8(_)].join(`
`)
}
// @from(Ln 497742, Col 4)
leK = L(() => {
    sy6();
    s88();
    VY();
    ev()
})
// @from(Ln 497749, Col 0)
function eU1(q) {
    let K = q.trim(),
        _ = K.split(`
`),
        z = _.length,
        Y = K.length,
        A = z > Ve,
        O = Y > Zz8;
    if (!A && !O) return {
        content: K,
        lineCount: z,
        byteCount: Y,
        wasLineTruncated: A,
        wasByteTruncated: O
    };
    let w = A ? _.slice(0, Ve).join(`
`) : K;
    if (w.length > Zz8) {
        let j = w.lastIndexOf(`
`, Zz8);
        w = w.slice(0, j > 0 ? j : Zz8)
    }
    let $ = O && !A ? `${o4(Y)} (limit: ${o4(Zz8)}) — index entries are too long` : A && !O ? `${z} lines (limit: ${Ve})` : `${z} lines and ${o4(Y)}`;
    return {
        content: w + `

> WARNING: ${YW} is ${$}. Only part of it was loaded. Keep index entries to one line under ~200 chars; move detail into topic files.`,
        lineCount: z,
        byteCount: Y,
        wasLineTruncated: A,
        wasByteTruncated: O
    }
}
// @from(Ln 497782, Col 0)
async function Iu6(q) {
    let K = V8();
    try {
        await K.mkdir(q)
    } catch (_) {
        let z = Q1(_);
        E(`ensureMemoryDirExists failed for ${q}: ${z??String(_)}`, {
            level: "debug"
        })
    }
}
// @from(Ln 497794, Col 0)
function TW6(q, K) {
    V8().readdir(q).then((z) => {
        let Y = 0,
            A = 0;
        for (let O of z)
            if (O.isFile()) Y++;
            else if (O.isDirectory()) A++;
        d("tengu_memdir_loaded", {
            ...K,
            total_file_count: Y,
            total_subdir_count: A
        })
    }, () => {
        d("tengu_memdir_loaded", K)
    })
}