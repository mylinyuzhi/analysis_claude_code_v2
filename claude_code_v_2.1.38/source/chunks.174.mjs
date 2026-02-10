
// @from(Ln 448015, Col 0)
async function h2z(A, q, K) {
    let Y = {
        firstPrompt: "",
        isSidechain: !1
    };
    try {
        let z = await D2z(A, "r");
        try {
            let w = await z.read(K, 0, LT6, 0);
            if (w.bytesRead === 0) return Y;
            let H = K.toString("utf8", 0, w.bytesRead),
                $ = H.includes('"isSidechain":true') || H.includes('"isSidechain": true'),
                O = ET6(H, "cwd"),
                _ = ET6(H, "teamName"),
                J = ET6(H, "agentSetting"),
                X = I2z(H),
                D = Math.max(0, q - LT6),
                j = D === 0 ? H : await (async () => {
                    let T = await z.read(K, 0, LT6, D);
                    return K.toString("utf8", 0, T.bytesRead)
                })(),
                M = sZ1(j, "customTitle"),
                P = sZ1(j, "tag"),
                W = sZ1(j, "gitBranch") ?? ET6(H, "gitBranch"),
                G = sZ1(j, "prUrl"),
                f = sZ1(j, "prRepository"),
                Z, N = sZ1(j, "prNumber");
            if (N) Z = parseInt(N, 10) || void 0;
            if (!Z) {
                let T = j.lastIndexOf('"prNumber":');
                if (T >= 0) {
                    let k = j.slice(T + 11, T + 25),
                        y = parseInt(k.trim(), 10);
                    if (y > 0) Z = y
                }
            }
            return {
                firstPrompt: X,
                gitBranch: W,
                isSidechain: $,
                projectPath: O,
                teamName: _,
                customTitle: M,
                tag: P,
                agentSetting: J,
                prNumber: Z,
                prUrl: G,
                prRepository: f
            }
        } finally {
            await z.close()
        }
    } catch {
        return Y
    }
}
// @from(Ln 448072, Col 0)
function I2z(A) {
    let q = 0,
        K = !1,
        Y = "";
    while (q < A.length) {
        let z = A.indexOf(`
`, q),
            w = z >= 0 ? A.slice(q, z) : A.slice(q);
        if (q = z >= 0 ? z + 1 : A.length, !w.includes('"type":"user"') && !w.includes('"type": "user"')) continue;
        if (w.includes('"tool_result"')) continue;
        if (w.includes('"isMeta":true') || w.includes('"isMeta": true')) continue;
        try {
            let H = _A(w);
            if (H.type !== "user") continue;
            let $ = H.message;
            if (!$) continue;
            let O = $.content,
                _ = "";
            if (typeof O === "string") _ = O;
            else if (Array.isArray(O)) {
                let D = O.find((j) => j.type === "text");
                if (D?.text && typeof D.text === "string") _ = D.text
            }
            if (!_) continue;
            let J = _.replace(/\n/g, " ").trim(),
                X = C4(J, SG);
            if (X) {
                let D = X.replace(/^\//, ""),
                    j = C4(J, "command-args")?.trim() || "";
                if (Cd().has(D) || !j) {
                    if (!Y) Y = X;
                    continue
                }
                return j ? `${X} ${j}` : X
            }
            if (fJq.test(J)) continue;
            if (J.length > 200) J = J.slice(0, 200).trim() + "…";
            return J
        } catch {
            continue
        }
    }
    if (Y) return Y;
    return ""
}
// @from(Ln 448118, Col 0)
function kJq(A) {
    if (!A.includes("\\")) return A;
    try {
        return _A(`"${A}"`)
    } catch {
        return A
    }
}
// @from(Ln 448127, Col 0)
function ET6(A, q) {
    let K = [`"${q}":"`, `"${q}": "`];
    for (let Y of K) {
        let z = A.indexOf(Y);
        if (z < 0) continue;
        let w = z + Y.length,
            H = w;
        while (H < A.length) {
            if (A[H] === "\\") {
                H += 2;
                continue
            }
            if (A[H] === '"') return kJq(A.slice(w, H));
            H++
        }
    }
    return
}
// @from(Ln 448146, Col 0)
function sZ1(A, q) {
    let K = [`"${q}":"`, `"${q}": "`],
        Y;
    for (let z of K) {
        let w = 0;
        while (!0) {
            let H = A.indexOf(z, w);
            if (H < 0) break;
            let $ = H + z.length,
                O = $;
            while (O < A.length) {
                if (A[O] === "\\") {
                    O += 2;
                    continue
                }
                if (A[O] === '"') {
                    Y = kJq(A.slice($, O));
                    break
                }
                O++
            }
            w = O + 1
        }
    }
    return Y
}
// @from(Ln 448173, Col 0)
function tZ1(A, q, K) {
    let z = [...Rd1(A).entries()].sort((H, $) => $[1].mtime - H[1].mtime);
    if (q && z.length > q) z = z.slice(0, q);
    let w = [];
    for (let [H, $] of z) w.push({
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
        sessionId: H,
        projectPath: K
    });
    return m61(w).map((H, $) => ({
        ...H,
        value: $
    }))
}
// @from(Ln 448197, Col 0)
async function x2z(A, q) {
    if (!A.isLite || !A.fullPath) return A;
    let K = await h2z(A.fullPath, A.fileSize ?? 0, q),
        Y = {
            ...A,
            isLite: !1,
            firstPrompt: K.firstPrompt,
            gitBranch: K.gitBranch,
            isSidechain: K.isSidechain,
            teamName: K.teamName,
            customTitle: K.customTitle,
            tag: K.tag,
            agentSetting: K.agentSetting,
            prNumber: K.prNumber,
            prUrl: K.prUrl,
            prRepository: K.prRepository,
            projectPath: K.projectPath ?? A.projectPath
        };
    if (!Y.firstPrompt && !Y.customTitle) return null;
    if (Y.isSidechain || Y.teamName) return null;
    return Y
}
// @from(Ln 448219, Col 0)
async function qY1(A, q, K) {
    let Y = [],
        z = Buffer.alloc(LT6),
        w = q;
    while (w < A.length && Y.length < K) {
        let H = A[w];
        w++;
        let $ = await x2z(H, z);
        if ($) Y.push($)
    }
    return {
        logs: Y,
        nextIndex: w
    }
}
// @from(Ln 448234, Col 4)
j2z
// @from(Ln 448234, Col 9)
eZ1
// @from(Ln 448234, Col 14)
fJq
// @from(Ln 448234, Col 19)
EE = null
// @from(Ln 448235, Col 4)
GJq = !1
// @from(Ln 448236, Col 4)
G2z = 10
// @from(Ln 448237, Col 4)
qFA
// @from(Ln 448237, Col 9)
LT6 = 16384
// @from(Ln 448238, Col 4)
lq = v(() => {
    N8();
    AH();
    hA();
    B6();
    hA();
    N7();
    Ez();
    m6();
    _8();
    p8();
    zq();
    h9();
    lp1();
    cW6();
    Z6();
    y6();
    Sh();
    c$();
    vz();
    u6();
    Tz();
    f0();
    m6();
    w$();
    j2z = {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.38",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-02-10T00:04:56Z"
    }.VERSION, eZ1 = h6(), fJq = new RegExp(`^(?:<local-command-stdout>|<session-start-hook>|<${JC}>|\\s*<ide_opened_file>[\\s\\S]*</ide_opened_file>\\s*$|\\s*<ide_selection>[\\s\\S]*</ide_selection>\\s*$)`);
    qFA = KA(async (A) => {
        let {
            messages: q
        } = await AFA(A);
        return new Set(q.keys())
    }, (A) => A)
})
// @from(Ln 448291, Col 0)
function hc() {
    return process.env.USE_MCP_CLI_DIR || RJq(b2z(), "claude-code-mcp-cli")
}
// @from(Ln 448295, Col 0)
function Af1() {
    if (O$()) {
        let A = process.env.CLAUDE_CODE_SESSION_ID;
        if (A) return A
    }
    return U6()
}
// @from(Ln 448303, Col 0)
function yJq() {
    if (!O$()) return;
    Tq(async () => {
        try {
            let A = ST6();
            await LJq(A, {
                force: !0
            });
            let q = hc();
            if ((await m2z(q)).length === 0) await LJq(q, {
                recursive: !0,
                force: !0
            })
        } catch {}
    })
}
// @from(Ln 448320, Col 0)
function ST6() {
    let A = Af1();
    return RJq(hc(), `${A}.json`)
}
// @from(Ln 448325, Col 0)
function F2z(A) {
    let q = {
        name: A.name,
        type: A.type
    };
    if (A.type === "connected") return {
        ...q,
        capabilities: A.capabilities
    };
    return q
}
// @from(Ln 448336, Col 0)
async function Q2z(A) {
    let q = "";
    try {
        q = await A.description({}, {
            isNonInteractiveSession: !1,
            toolPermissionContext: {
                mode: "default",
                additionalWorkingDirectories: new Map,
                alwaysAllowRules: {},
                alwaysDenyRules: {},
                alwaysAskRules: {},
                isBypassPermissionsModeAvailable: !1
            },
            tools: []
        })
    } catch {}
    return {
        name: A.name,
        description: q,
        inputJSONSchema: A.inputJSONSchema,
        isMcp: A.isMcp,
        originalToolName: A.originalMcpToolName
    }
}
// @from(Ln 448360, Col 0)
async function CJq(A, q, K) {
    if (!O$()) return;
    try {
        await B2z(hc(), {
            recursive: !0
        });
        let Y = await Promise.all(q.filter((O) => O.isMcp).map(Q2z)),
            z = {},
            w = {};
        for (let O of A) {
            z[O.name] = O.config;
            let _ = P5(O.name);
            if (w[_] && w[_] !== O.name) console.warn(`Warning: MCP server name collision detected. Both "${w[_]}" and "${O.name}" normalize to "${_}". Only "${O.name}" will be accessible via normalized lookup.`);
            w[_] = O.name
        }
        let H = {
                clients: A.map(F2z),
                configs: z,
                tools: Y,
                resources: K,
                normalizedNames: w
            },
            $ = ST6();
        await u2z($, Q1(H, null, 2))
    } catch {}
}
// @from(Ln 448386, Col 4)
qf1 = v(() => {
    B6();
    Tz();
    Tj();
    m6()
})
// @from(Ln 448403, Col 0)
function BN(A) {
    return A.toLowerCase()
}
// @from(Ln 448407, Col 0)
function hJq(A, q) {
    if (eA() === "windows") {
        let K = px(A),
            Y = px(q);
        return oe.relative(K, Y)
    }
    return oe.relative(A, q)
}
// @from(Ln 448416, Col 0)
function p76(A) {
    if (eA() === "windows") return px(A);
    return A
}
// @from(Ln 448421, Col 0)
function c2z() {
    return gf.map((A) => Vw(A)).filter((A) => A !== void 0)
}
// @from(Ln 448425, Col 0)
function NkA(A) {
    let q = g4(A),
        K = BN(q);
    if (K.endsWith(`${DG}.claude${DG}settings.json`) || K.endsWith(`${DG}.claude${DG}settings.local.json`)) return !0;
    return c2z().some((Y) => BN(Y) === K)
}
// @from(Ln 448432, Col 0)
function l2z(A) {
    if (NkA(A)) return !0;
    let q = kE(y8(), ".claude", "commands"),
        K = kE(y8(), ".claude", "agents"),
        Y = kE(y8(), ".claude", "skills");
    return Sp(A, q) || Sp(A, K) || Sp(A, Y)
}
// @from(Ln 448440, Col 0)
function i2z(A) {
    if (!hc()) return !1;
    let q = g4(A);
    return Sp(q, hc())
}
// @from(Ln 448446, Col 0)
function IJq(A) {
    let q = kE(UM(), Rj1()),
        K = Kf1(A);
    return K.startsWith(q) && K.endsWith(".md")
}
// @from(Ln 448452, Col 0)
function hT6() {
    return kE(fJ(h6()), U6(), "session-memory") + DG
}
// @from(Ln 448456, Col 0)
function VG1() {
    return kE(hT6(), "summary.md")
}
// @from(Ln 448460, Col 0)
function n2z(A) {
    return Kf1(A).startsWith(hT6())
}
// @from(Ln 448464, Col 0)
function r2z(A) {
    let q = fJ(h6()),
        K = Kf1(A);
    return K === q || K.startsWith(q + DG)
}
// @from(Ln 448470, Col 0)
function nZ1() {
    return i2("tengu_scratch")
}
// @from(Ln 448474, Col 0)
function mRA() {
    if (eA() === "windows") return "claude";
    return `claude-${process.getuid?.()??0}`
}
// @from(Ln 448479, Col 0)
function YC1() {
    let A = process.env.CLAUDE_CODE_TMPDIR || (eA() === "windows" ? U2z() : "/tmp"),
        q = b1(),
        K = A;
    try {
        K = q.realpathSync(A)
    } catch {}
    return kE(K, mRA()) + DG
}
// @from(Ln 448489, Col 0)
function P_6() {
    return kE(YC1(), dx(y8())) + DG
}
// @from(Ln 448493, Col 0)
function _T6() {
    return kE(P_6(), U6(), "scratchpad")
}
// @from(Ln 448497, Col 0)
function xJq() {
    if (!nZ1()) throw Error("Scratchpad directory feature is not enabled");
    let A = b1(),
        q = _T6();
    return A.mkdirSync(q, {
        mode: 448
    }), q
}
// @from(Ln 448506, Col 0)
function bJq(A) {
    if (!nZ1()) return !1;
    let q = _T6(),
        K = Kf1(A);
    return K === q || K.startsWith(q + DG)
}
// @from(Ln 448513, Col 0)
function o2z(A) {
    let K = g4(A).split(DG),
        Y = K[K.length - 1];
    if (A.startsWith("\\\\") || A.startsWith("//")) return !0;
    for (let z = 0; z < K.length; z++) {
        let w = K[z],
            H = BN(w);
        for (let $ of d2z) {
            if (H !== BN($)) continue;
            if ($ === ".claude") {
                let O = K[z + 1];
                if (O && BN(O) === "worktrees") break
            }
            return !0
        }
    }
    if (Y) {
        let z = BN(Y);
        if (p2z.some((w) => BN(w) === z)) return !0
    }
    return !1
}
// @from(Ln 448536, Col 0)
function uJq(A) {
    if (A.indexOf(":", 2) !== -1) return !0;
    if (/~\d/.test(A)) return !0;
    if (A.startsWith("\\\\?\\") || A.startsWith("\\\\.\\") || A.startsWith("//?/") || A.startsWith("//./")) return !0;
    if (/[.\s]+$/.test(A)) return !0;
    if (/\.(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i.test(A)) return !0;
    if (/(^|\/|\\)\.{3,}(\/|\\|$)/.test(A)) return !0;
    if ($f6(A)) return !0;
    return !1
}
// @from(Ln 448547, Col 0)
function NmA(A) {
    let q = D61(A);
    for (let K of q)
        if (uJq(K)) return {
            safe: !1,
            message: `Claude requested permissions to write to ${A}, which contains a suspicious Windows path pattern that requires manual approval.`
        };
    for (let K of q)
        if (l2z(K)) return {
            safe: !1,
            message: `Claude requested permissions to write to ${A}, but you haven't granted it yet.`
        };
    for (let K of q)
        if (i2z(K));
    for (let K of q)
        if (o2z(K)) return {
            safe: !1,
            message: `Claude requested permissions to edit ${A} which is a sensitive file.`
        };
    return {
        safe: !0
    }
}
// @from(Ln 448571, Col 0)
function iG1(A) {
    return new Set([y8(), ...A.additionalWorkingDirectories.keys()])
}
// @from(Ln 448575, Col 0)
function EI(A, q) {
    return D61(A).every((Y) => Array.from(iG1(q)).some((z) => Sp(Y, z)))
}
// @from(Ln 448579, Col 0)
function Sp(A, q) {
    let K = g4(A),
        Y = g4(q),
        z = K.replace(/^\/private\/var\//, "/var/").replace(/^\/private\/tmp(\/|$)/, "/tmp$1"),
        w = Y.replace(/^\/private\/var\//, "/var/").replace(/^\/private\/tmp(\/|$)/, "/tmp$1"),
        H = BN(z),
        $ = BN(w),
        O = hJq($, H);
    if (O === "") return !0;
    if (p61(O)) return !1;
    return !oe.isAbsolute(O)
}
// @from(Ln 448592, Col 0)
function a2z(A) {
    switch (A) {
        case "cliArg":
        case "command":
        case "session":
            return g4(y8());
        case "userSettings":
        case "policySettings":
        case "projectSettings":
        case "localSettings":
        case "flagSettings":
            return RO1(A)
    }
}
// @from(Ln 448607, Col 0)
function zFA(A) {
    return oe.join(Jf, A)
}
// @from(Ln 448611, Col 0)
function s2z({
    patternRoot: A,
    pattern: q,
    rootPath: K
}) {
    let Y = oe.join(A, q);
    if (A === K) return zFA(q);
    else if (Y.startsWith(`${K}${Jf}`)) {
        let z = Y.slice(K.length);
        return zFA(z)
    } else {
        let z = oe.relative(K, A);
        if (!z || z.startsWith(`..${Jf}`) || z === "..") return null;
        else {
            let w = oe.join(z, q);
            return zFA(w)
        }
    }
}
// @from(Ln 448631, Col 0)
function O01(A, q) {
    let K = new Set(A.get(null) ?? []);
    for (let [Y, z] of A.entries()) {
        if (Y === null) continue;
        for (let w of z) {
            let H = s2z({
                patternRoot: Y,
                pattern: w,
                rootPath: q
            });
            if (H) K.add(H)
        }
    }
    return Array.from(K)
}
// @from(Ln 448647, Col 0)
function _01(A) {
    let q = BJq(A, "read", "deny"),
        K = new Map;
    for (let [Y, z] of q.entries()) K.set(Y, Array.from(z.keys()));
    return K
}
// @from(Ln 448654, Col 0)
function t2z(A, q) {
    if (A.startsWith(`${Jf}${Jf}`)) {
        let Y = A.slice(1);
        if (eA() === "windows" && Y.match(/^\/[a-z]\//i)) {
            let z = Y[1]?.toUpperCase() ?? "C",
                w = Y.slice(2),
                H = `${z}:\\`;
            return {
                relativePattern: w.startsWith("/") ? w.slice(1) : w,
                root: H
            }
        }
        return {
            relativePattern: Y,
            root: Jf
        }
    } else if (A.startsWith(`~${Jf}`)) return {
        relativePattern: A.slice(1),
        root: g2z().normalize("NFC")
    };
    else if (A.startsWith(Jf)) return {
        relativePattern: A,
        root: a2z(q)
    };
    let K = A;
    if (A.startsWith(`.${Jf}`)) K = A.slice(2);
    return {
        relativePattern: K,
        root: null
    }
}
// @from(Ln 448686, Col 0)
function BJq(A, q, K) {
    let Y = (() => {
            switch (q) {
                case "edit":
                    return bq;
                case "read":
                    return Jq
            }
        })(),
        z = mmA(A, Y, K),
        w = new Map;
    for (let [H, $] of z.entries()) {
        let {
            relativePattern: O,
            root: _
        } = t2z(H, $.source), J = w.get(_);
        if (J === void 0) J = new Map, w.set(_, J);
        J.set(O, $)
    }
    return w
}
// @from(Ln 448708, Col 0)
function Gj(A, q, K, Y) {
    let z = g4(A);
    if (eA() === "windows" && z.includes("\\")) z = px(z);
    let w = BJq(q, K, Y);
    for (let [H, $] of w.entries()) {
        let O = Array.from($.keys()).map((D) => {
                let j = D;
                if (H === Jf && D.startsWith(Jf)) j = D.slice(1);
                if (j.endsWith("/**")) j = j.slice(0, -3);
                return j
            }),
            _ = SJq.default().add(O),
            J = hJq(H ?? h6(), z ?? h6());
        if (J.startsWith(`..${Jf}`)) continue;
        if (!J) continue;
        let X = _.test(J);
        if (X.ignored && X.rule) {
            let D = X.rule.pattern,
                j = D + "/**";
            if ($.has(j)) return $.get(j) ?? null;
            if (H === Jf && !D.startsWith(Jf)) {
                D = Jf + D;
                let M = D + "/**";
                if ($.has(M)) return $.get(M) ?? null
            }
            return $.get(D) ?? null
        }
    }
    return null
}
// @from(Ln 448739, Col 0)
function ro(A, q, K) {
    if (typeof A.getPath !== "function") return {
        behavior: "ask",
        message: `Claude requested permissions to use ${A.name}, but you haven't granted it yet.`
    };
    let Y = A.getPath(q),
        z = D61(Y);
    for (let J of z)
        if (J.startsWith("\\\\") || J.startsWith("//")) return {
            behavior: "ask",
            message: `Claude requested permissions to read from ${Y}, which appears to be a UNC path that could access network resources.`,
            decisionReason: {
                type: "other",
                reason: "UNC path detected (defense-in-depth check)"
            }
        };
    for (let J of z)
        if (uJq(J)) return {
            behavior: "ask",
            message: `Claude requested permissions to read from ${Y}, which contains a suspicious Windows path pattern that requires manual approval.`,
            decisionReason: {
                type: "other",
                reason: "Path contains suspicious Windows-specific patterns (alternate data streams, short names, long path prefixes, or three or more consecutive dots) that require manual verification"
            }
        };
    for (let J of z) {
        let X = Gj(J, K, "read", "deny");
        if (X) return {
            behavior: "deny",
            message: `Permission to read ${Y} has been denied.`,
            decisionReason: {
                type: "rule",
                rule: X
            }
        }
    }
    for (let J of z) {
        let X = Gj(J, K, "read", "ask");
        if (X) return {
            behavior: "ask",
            message: `Claude requested permissions to read from ${Y}, but you haven't granted it yet.`,
            decisionReason: {
                type: "rule",
                rule: X
            }
        }
    }
    let w = N51(A, q, K);
    if (w.behavior === "allow") return w;
    if (EI(Y, K)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "mode",
            mode: "default"
        }
    };
    let $ = g4(Y),
        O = vmA($, q);
    if (O.behavior !== "passthrough") return O;
    let _ = Gj(Y, K, "read", "allow");
    if (_) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "rule",
            rule: _
        }
    };
    return {
        behavior: "ask",
        message: `Claude requested permissions to read from ${Y}, but you haven't granted it yet.`,
        suggestions: IT6(Y, "read", K),
        decisionReason: {
            type: "workingDir",
            reason: "Path is outside allowed working directories"
        }
    }
}
// @from(Ln 448819, Col 0)
function N51(A, q, K) {
    if (typeof A.getPath !== "function") return {
        behavior: "ask",
        message: `Claude requested permissions to use ${A.name}, but you haven't granted it yet.`
    };
    let Y = A.getPath(q),
        z = D61(Y);
    for (let X of z) {
        let D = Gj(X, K, "edit", "deny");
        if (D) return {
            behavior: "deny",
            message: `Permission to edit ${Y} has been denied.`,
            decisionReason: {
                type: "rule",
                rule: D
            }
        }
    }
    let w = g4(Y),
        H = TmA(w, q);
    if (H.behavior !== "passthrough") return H;
    let $ = Gj(Y, K, "edit", "allow");
    if ($ && $.source === "session") {
        let X = $.ruleValue.ruleContent;
        if (X === Zq6 || X === fq6) return {
            behavior: "allow",
            updatedInput: q,
            decisionReason: {
                type: "rule",
                rule: $
            }
        }
    }
    let O = NmA(Y);
    if (!O.safe) return {
        behavior: "ask",
        message: O.message,
        decisionReason: {
            type: "other",
            reason: O.message
        }
    };
    for (let X of z) {
        let D = Gj(X, K, "edit", "ask");
        if (D) return {
            behavior: "ask",
            message: `Claude requested permissions to write to ${Y}, but you haven't granted it yet.`,
            decisionReason: {
                type: "rule",
                rule: D
            }
        }
    }
    let _ = EI(Y, K);
    if (K.mode === "acceptEdits" && _) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "mode",
            mode: K.mode
        }
    };
    let J = Gj(Y, K, "edit", "allow");
    if (J) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "rule",
            rule: J
        }
    };
    return {
        behavior: "ask",
        message: `Claude requested permissions to write to ${Y}, but you haven't granted it yet.`,
        suggestions: IT6(Y, "write", K),
        decisionReason: !_ ? {
            type: "workingDir",
            reason: "Path is outside allowed working directories"
        } : void 0
    }
}
// @from(Ln 448901, Col 0)
function IT6(A, q, K) {
    let Y = !EI(A, K);
    if (q === "read" && Y) {
        let z = fQ(A);
        return D61(z).map(($) => U76($, "session")).filter(($) => $ !== void 0)
    }
    if (q === "write" || q === "create") {
        let z = [{
            type: "setMode",
            mode: "acceptEdits",
            destination: "session"
        }];
        if (Y) {
            let w = fQ(A),
                H = D61(w);
            z.push({
                type: "addDirectories",
                directories: H,
                destination: "session"
            })
        }
        return z
    }
    return [{
        type: "setMode",
        mode: "acceptEdits",
        destination: "session"
    }]
}
// @from(Ln 448931, Col 0)
function TmA(A, q) {
    let K = Kf1(A);
    if (IJq(K)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "Plan files for current session are allowed for writing"
        }
    };
    if (bJq(K)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "Scratchpad files for current session are allowed for writing"
        }
    };
    if (gu1(K)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "Agent memory files are allowed for writing"
        }
    };
    if (Fu1(K)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "auto memory files are allowed for writing"
        }
    };
    let Y = kE(O8(), "teams") + DG;
    if (K === Y.slice(0, -1) || K.startsWith(Y)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "Team files are allowed for writing"
        }
    };
    let z = kE(O8(), "tasks") + DG;
    if (K === z.slice(0, -1) || K.startsWith(z)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "Task files are allowed for writing"
        }
    };
    return {
        behavior: "passthrough",
        message: ""
    }
}
// @from(Ln 448989, Col 0)
function vmA(A, q) {
    let K = Kf1(A);
    if (n2z(K)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "Session memory files are allowed for reading"
        }
    };
    if (r2z(K)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "Project directory files are allowed for reading"
        }
    };
    if (IJq(K)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "Plan files for current session are allowed for reading"
        }
    };
    let Y = l01(),
        z = Y.endsWith(DG) ? Y : Y + DG;
    if (K === Y || K.startsWith(z)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "Tool result files are allowed for reading"
        }
    };
    if (bJq(K)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "Scratchpad files for current session are allowed for reading"
        }
    };
    let w = P_6();
    if (K.startsWith(w)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "Project temp directory files are allowed for reading"
        }
    };
    if (gu1(K)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "Agent memory files are allowed for reading"
        }
    };
    if (Fu1(K)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "auto memory files are allowed for reading"
        }
    };
    let H = kE(O8(), "tasks") + DG;
    if (K === H.slice(0, -1) || K.startsWith(H)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "Task files are allowed for reading"
        }
    };
    let $ = kE(O8(), "teams") + DG;
    if (K === $.slice(0, -1) || K.startsWith($)) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "Team files are allowed for reading"
        }
    };
    return {
        behavior: "passthrough",
        message: ""
    }
}
// @from(Ln 449081, Col 4)
SJq
// @from(Ln 449081, Col 9)
p2z
// @from(Ln 449081, Col 14)
d2z
// @from(Ln 449081, Col 19)
Jf
// @from(Ln 449082, Col 4)
E2 = v(() => {
    B6();
    U4();
    N7();
    Ez();
    Sw1();
    lq();
    x3();
    Ez();
    CO();
    PJ();
    _H();
    p8();
    E$();
    _8();
    qf1();
    _f6();
    mX();
    Pp();
    gB();
    xW();
    hA();
    SJq = o(Aj1(), 1), p2z = [".gitconfig", ".gitmodules", ".bashrc", ".bash_profile", ".zshrc", ".zprofile", ".profile", ".ripgreprc", ".mcp.json", ".claude.json"], d2z = [".git", ".vscode", ".idea", ".claude"];
    Jf = oe.sep
})
// @from(Ln 449126, Col 0)
function zwz(A) {
    let q = /[*?[{]/,
        K = A.match(q);
    if (!K || K.index === void 0) {
        let $ = _FA(A),
            O = $FA(A);
        return {
            baseDir: $,
            relativePattern: O
        }
    }
    let Y = A.slice(0, K.index),
        z = Math.max(Y.lastIndexOf("/"), Y.lastIndexOf(HFA));
    if (z === -1) return {
        baseDir: "",
        relativePattern: A
    };
    let w = Y.slice(0, z),
        H = A.slice(z + 1);
    if (w === "" && z === 0) w = "/";
    if (eA() === "windows" && /^[A-Za-z]:$/.test(w)) w = w + HFA;
    return {
        baseDir: w,
        relativePattern: H
    }
}
// @from(Ln 449152, Col 0)
async function NR7(A, q, {
    limit: K,
    offset: Y
}, z, w) {
    let H = q,
        $ = A;
    if (wFA(A)) {
        let {
            baseDir: W,
            relativePattern: G
        } = zwz(A);
        if (W) H = W, $ = G
    }
    let O = O01(_01(w), H),
        _ = J6(process.env.CLAUDE_CODE_GLOB_NO_IGNORE || "true"),
        J = J6(process.env.CLAUDE_CODE_GLOB_HIDDEN || "true"),
        X = ["--files", "--glob", $, "--sort=modified", ..._ ? ["--no-ignore"] : [], ...J ? ["--hidden"] : []];
    for (let W of O) X.push("--glob", `!${W}`);
    let j = (await lx(X, H, z)).map((W) => wFA(W) ? W : FJq(H, W)),
        M = j.length > Y + K;
    return {
        files: j.slice(Y, Y + K),
        truncated: M
    }
}
// @from(Ln 449178, Col 0)
function gJq(A) {
    try {
        return b1().readFileSync(A, {
            encoding: "utf8"
        })
    } catch (q) {
        return K1(q), null
    }
}
// @from(Ln 449188, Col 0)
function aW(A) {
    let q = b1();
    return Math.floor(q.statSync(A).mtimeMs)
}
// @from(Ln 449193, Col 0)
function Ca4(A, q = 0, K) {
    let w = b1().readFileSync(A, {
            encoding: "utf8"
        }).split(/\r?\n/),
        H = K !== void 0 && w.length - q > K ? w.slice(q, q + K) : w.slice(q);
    return {
        content: H.join(`
`),
        lineCount: H.length,
        totalLines: w.length
    }
}
// @from(Ln 449206, Col 0)
function ft(A, q, K, Y) {
    let z = q;
    if (Y === "CRLF") z = q.split(`
`).join(`\r
`);
    ek(A, z, {
        encoding: K
    })
}
// @from(Ln 449216, Col 0)
function AX(A) {
    try {
        let K = b1(),
            {
                resolvedPath: Y
            } = QH(K, A),
            {
                buffer: z,
                bytesRead: w
            } = K.readSync(Y, {
                length: 4096
            });
        if (w === 0) return "utf8";
        if (w >= 2) {
            if (z[0] === 255 && z[1] === 254) return "utf16le"
        }
        if (w >= 3 && z[0] === 239 && z[1] === 187 && z[2] === 191) return "utf8";
        return "utf8"
    } catch (K) {
        return K1(K), "utf8"
    }
}
// @from(Ln 449239, Col 0)
function Qd(A, q = "utf8") {
    try {
        let K = b1(),
            {
                resolvedPath: Y
            } = QH(K, A),
            {
                buffer: z,
                bytesRead: w
            } = K.readSync(Y, {
                length: 4096
            }),
            H = z.toString(q, 0, w);
        return wwz(H)
    } catch (K) {
        return K1(K), "LF"
    }
}
// @from(Ln 449258, Col 0)
function wwz(A) {
    let q = 0,
        K = 0;
    for (let Y = 0; Y < A.length; Y++)
        if (A[Y] === `
`)
            if (Y > 0 && A[Y - 1] === "\r") q++;
            else K++;
    return q > K ? "CRLF" : "LF"
}
// @from(Ln 449269, Col 0)
function J01(A) {
    return A.replace(/^\t+/gm, (q) => "  ".repeat(q.length))
}
// @from(Ln 449273, Col 0)
function Hwz(A) {
    let q = A ? g4(A) : void 0,
        K = q ? Awz(h6(), q) : void 0;
    return {
        absolutePath: q,
        relativePath: K
    }
}
// @from(Ln 449282, Col 0)
function L3(A) {
    let {
        relativePath: q
    } = Hwz(A);
    if (q && !q.startsWith("..")) return q;
    let K = Kwz();
    if (A.startsWith(K + HFA)) return "~" + A.slice(K.length);
    return A
}
// @from(Ln 449292, Col 0)
function mP6(A) {
    let q = b1();
    try {
        let K = _FA(A),
            Y = $FA(A, OFA(A));
        if (!q.existsSync(K)) return;
        let H = q.readdirSync(K).filter(($) => $FA($.name, OFA($.name)) === Y && FJq(K, $.name) !== A)[0];
        if (H) return H.name;
        return
    } catch (K) {
        K1(K);
        return
    }
}
// @from(Ln 449307, Col 0)
function Sj1({
    content: A,
    startLine: q
}) {
    if (!A) return "";
    return A.split(/\r?\n/).map((Y, z) => {
        let w = z + q,
            H = String(w);
        if (H.length >= 6) return `${H}→${Y}`;
        return `${H.padStart(6," ")}→${Y}`
    }).join(`
`)
}
// @from(Ln 449321, Col 0)
function CE7(A) {
    let q = b1();
    if (!q.existsSync(A)) return !0;
    try {
        return q.isDirEmptySync(A)
    } catch {
        return !1
    }
}
// @from(Ln 449331, Col 0)
function $J(A) {
    let q = b1(),
        {
            resolvedPath: K,
            isSymlink: Y
        } = QH(q, A);
    if (Y) h(`Reading through symlink: ${A} -> ${K}`);
    let z = AX(K);
    return q.readFileSync(K, {
        encoding: z
    }).replaceAll(`\r
`, `
`)
}
// @from(Ln 449346, Col 0)
function jjA(A) {
    let {
        content: q
    } = Pz8.readFile(A);
    return q
}
// @from(Ln 449353, Col 0)
function ek(A, q, K = {
    encoding: "utf-8"
}) {
    let Y = b1(),
        z = A;
    if (Y.existsSync(A)) try {
        let H = Y.readlinkSync(A);
        z = wFA(H) ? H : e2z(_FA(A), H), h(`Writing through symlink: ${A} -> ${z}`)
    } catch (H) {
        z = A
    }
    let w = `${z}.tmp.${process.pid}.${Date.now()}`;
    try {
        h(`Writing to temp file: ${w}`);
        let H, $ = Y.existsSync(z);
        if ($) H = Y.statSync(z).mode, h(`Preserving file permissions: ${H.toString(8)}`);
        else if (K.mode !== void 0) H = K.mode, h(`Setting permissions for new file: ${H.toString(8)}`);
        let O = {
            encoding: K.encoding,
            flush: !0
        };
        if (!$ && K.mode !== void 0) O.mode = K.mode;
        if (mJq(w, q, O), h(`Temp file written successfully, size: ${q.length} bytes`), $ && H !== void 0) Ywz(w, H), h("Applied original permissions to temp file");
        h(`Renaming ${w} to ${z}`), Y.renameSync(w, z), h(`File ${z} written atomically`)
    } catch (H) {
        h(`Failed to write file atomically: ${H}`), K1(H), c("tengu_atomic_write_error", {});
        try {
            if (Y.existsSync(w)) h(`Cleaning up temp file: ${w}`), Y.unlinkSync(w)
        } catch ($) {
            h(`Failed to clean up temp file: ${$}`)
        }
        h(`Falling back to non-atomic write for ${z}`);
        try {
            let $ = {
                encoding: K.encoding,
                flush: !0
            };
            if (!Y.existsSync(z) && K.mode !== void 0) $.mode = K.mode;
            mJq(z, q, $), h(`File ${z} written successfully with non-atomic fallback`)
        } catch ($) {
            throw h(`Non-atomic write also failed: ${$}`), $
        }
    }
}
// @from(Ln 449398, Col 0)
function L2(A) {
    let q = A / 1024;
    if (q < 1) return `${A} bytes`;
    if (q < 1024) return `${q.toFixed(1).replace(/\.0$/,"")}KB`;
    let K = q / 1024;
    if (K < 1024) return `${K.toFixed(1).replace(/\.0$/,"")}MB`;
    return `${(K/1024).toFixed(1).replace(/\.0$/,"")}GB`
}
// @from(Ln 449407, Col 0)
function ae(A) {
    let q = OFA(A);
    if (!q) return "unknown";
    return QJq?.(q.slice(1))?.name ?? "unknown"
}
// @from(Ln 449413, Col 0)
function KG6(A, q = OU1) {
    try {
        return b1().statSync(A).size <= q
    } catch {
        return !1
    }
}
// @from(Ln 449421, Col 0)
function eG6(A) {
    let q = qwz(A);
    if (eA() === "windows") q = q.replace(/\//g, "\\").toLowerCase();
    return q
}
// @from(Ln 449427, Col 0)
function oo4(A, q) {
    return eG6(A) === eG6(q)
}
// @from(Ln 449430, Col 4)
QJq
// @from(Ln 449430, Col 9)
OU1 = 262144
// @from(Ln 449431, Col 4)
$a4
// @from(Ln 449432, Col 4)
wq = v(() => {
    y6();
    NT1();
    Z6();
    hA();
    G2();
    u6();
    ix();
    N7();
    zq();
    _8();
    Wz8();
    E2();
    x3();
    Ez();
    Promise.resolve().then(() => o(CPA(), 1)).then((A) => {
        QJq = A.getLanguage
    });
    $a4 = KA(async () => {
        let A = Aq();
        setTimeout(() => {
            A.abort()
        }, 1000);
        let q = await Dz8(h6(), A.signal, 15),
            K = 0;
        for (let Y of q)
            if (Qd(Y) === "CRLF") K++;
        return K > 3 ? "CRLF" : "LF"
    })
})
// @from(Ln 449473, Col 0)
function $H(A) {
    let q = se(ij(), Gy);
    if (q.bypassPermissionsModeAccepted && HQ()) return !0;
    if (rL6()) return !0;
    let K = jFA();
    if (q.projects?.[K]?.hasTrustDialogAccepted) return !0;
    let z = yT1(h6());
    if (A) return q.projects?.[z]?.hasTrustDialogAccepted === !0;
    while (!0) {
        if (q.projects?.[z]?.hasTrustDialogAccepted) return !0;
        let H = yT1(cJq(z, ".."));
        if (H === z) break;
        z = H
    }
    return !1
}
// @from(Ln 449490, Col 0)
function jA(A) {
    try {
        nJq(ij(), Gy, (q) => {
            let K = A(q);
            if (K === q) return q;
            return {
                ...K,
                projects: UJq(q.projects)
            }
        }), Ic.config = null, Ic.mtime = 0
    } catch (q) {
        h(`Failed to save config with lock: ${q}`, {
            level: "error"
        });
        let K = se(ij(), Gy),
            Y = A(K);
        if (Y === K) return;
        iJq(ij(), {
            ...Y,
            projects: UJq(K.projects)
        }, Gy), Ic.config = null, Ic.mtime = 0
    }
}
// @from(Ln 449514, Col 0)
function _wz() {
    let A = rd1 + xT6;
    if (A > 0) c("tengu_config_cache_stats", {
        cache_hits: rd1,
        cache_misses: xT6,
        hit_rate: rd1 / A
    });
    rd1 = 0, xT6 = 0
}
// @from(Ln 449524, Col 0)
function JFA(A) {
    if (A.installMethod !== void 0) return A;
    let q = "unknown",
        K = A.autoUpdates ?? !0;
    switch (A.autoUpdaterStatus) {
        case "migrated":
            q = "local";
            break;
        case "installed":
            q = "native";
            break;
        case "disabled":
            K = !1;
            break;
        case "enabled":
        case "no_permissions":
        case "not_configured":
            q = "global";
            break;
        case void 0:
            break
    }
    return {
        ...A,
        installMethod: q,
        autoUpdates: K
    }
}
// @from(Ln 449553, Col 0)
function UJq(A) {
    if (!A) return A;
    let q = {},
        K = !1;
    for (let [Y, z] of Object.entries(A))
        if (z.history !== void 0) {
            K = !0;
            let {
                history: w,
                ...H
            } = z;
            q[Y] = H
        } else q[Y] = z;
    return K ? q : A
}
// @from(Ln 449569, Col 0)
function f6() {
    try {
        let A = null;
        try {
            A = b1().statSync(ij())
        } catch {}
        if (Ic.config && A) {
            if (A.mtimeMs <= Ic.mtime) return rd1++, Ic.config
        }
        xT6++;
        let q = JFA(se(ij(), Gy));
        if (A) Ic = {
            config: q,
            mtime: A.mtimeMs
        }, KY1 = {
            mtime: A.mtimeMs,
            size: A.size
        };
        else Ic = {
            config: q,
            mtime: Date.now()
        }, KY1 = null;
        return JFA(q)
    } catch {
        return JFA(se(ij(), Gy))
    }
}
// @from(Ln 449597, Col 0)
function bT6(A) {
    let q = f6();
    if (q.customApiKeyResponses?.approved?.includes(A)) return "approved";
    if (q.customApiKeyResponses?.rejected?.includes(A)) return "rejected";
    return "new"
}
// @from(Ln 449604, Col 0)
function iJq(A, q, K) {
    let Y = od1(A);
    b1().mkdirSync(Y);
    let w = Object.fromEntries(Object.entries(q).filter(([H, $]) => Q1($) !== Q1(K[H])));
    ek(A, Q1(w, null, 2), {
        encoding: "utf-8",
        mode: 384
    })
}
// @from(Ln 449614, Col 0)
function nJq(A, q, K) {
    let Y = od1(A),
        z = b1();
    z.mkdirSync(Y);
    let w;
    try {
        let H = `${A}.lock`,
            $ = Date.now();
        w = lJq.lockSync(A, {
            lockfilePath: H
        });
        let O = Date.now() - $;
        if (O > 100) h("Lock acquisition took longer than expected - another Claude instance may be running"), c("tengu_config_lock_contention", {
            lock_time_ms: O
        });
        if (KY1 && A === ij()) try {
            let D = z.statSync(A);
            if (D.mtimeMs !== KY1.mtime || D.size !== KY1.size) c("tengu_config_stale_write", {
                read_mtime: KY1.mtime,
                write_mtime: D.mtimeMs,
                read_size: KY1.size,
                write_size: D.size
            })
        } catch (D) {
            if (D.code !== "ENOENT") throw D
        }
        let _ = se(A, q),
            J = K(_);
        if (J === _) return;
        let X = Object.fromEntries(Object.entries(J).filter(([D, j]) => Q1(j) !== Q1(q[D])));
        try {
            let D = od1(A),
                j = DFA(A),
                M = `${A}.backup.${Date.now()}`;
            z.copyFileSync(A, M);
            let P = 5,
                W = z.readdirStringSync(D).filter((G) => G.startsWith(`${j}.backup.`)).sort().reverse();
            for (let G of W.slice(P)) try {
                z.unlinkSync(PF(D, G))
            } catch {}
        } catch (D) {
            if (D.code !== "ENOENT") h(`Failed to backup config: ${D}`, {
                level: "error"
            })
        }
        ek(A, Q1(X, null, 2), {
            encoding: "utf-8",
            mode: 384
        })
    } finally {
        if (w) w()
    }
}
// @from(Ln 449668, Col 0)
function Yf1() {
    if (XFA) return;
    let A = Date.now();
    H8("info", "enable_configs_started"), XFA = !0, se(ij(), Gy, !0), H8("info", "enable_configs_completed", {
        duration_ms: Date.now() - A
    })
}
// @from(Ln 449676, Col 0)
function pJq(A) {
    let q = b1(),
        K = od1(A),
        Y = DFA(A);
    try {
        let z = q.readdirStringSync(K).filter((H) => H.startsWith(`${Y}.backup.`)).sort().reverse();
        if (z.length > 0) return PF(K, z[0]);
        let w = `${A}.backup`;
        try {
            return q.statSync(w), w
        } catch {}
    } catch {}
    return null
}
// @from(Ln 449691, Col 0)
function se(A, q, K) {
    if (!XFA) throw Error("Config accessed before allowed.");
    let Y = b1();
    try {
        let z = Y.readFileSync(A, {
            encoding: "utf-8"
        });
        try {
            let w = _A(Tw1(z));
            return {
                ...X61(q),
                ...w
            }
        } catch (w) {
            let H = w instanceof Error ? w.message : String(w);
            throw new hG(H, A, q)
        }
    } catch (z) {
        if (z.code === "ENOENT") {
            let H = pJq(A);
            if (H) process.stderr.write(`
Claude configuration file not found at: ${A}
A backup file exists at: ${H}
You can manually restore it by running: cp "${H}" "${A}"

`);
            return X61(q)
        }
        if (z instanceof hG && K) throw z;
        if (z instanceof hG) {
            h(`Config file corrupted, resetting to defaults: ${z.message}`, {
                level: "error"
            }), K1(z);
            let H = !1;
            try {
                Y.statSync(`${A}.backup`), H = !0
            } catch {}
            c("tengu_config_parse_error", {
                has_backup: H
            }), process.stderr.write(`
Claude configuration file at ${A} is corrupted: ${z.message}
`);
            let $ = od1(A),
                O = DFA(A),
                _ = Y.readdirStringSync($).filter((M) => M.startsWith(`${O}.corrupted.`)),
                J, X = !1,
                D = Y.readFileSync(A, {
                    encoding: "utf-8"
                });
            for (let M of _) try {
                let P = Y.readFileSync(PF($, M), {
                    encoding: "utf-8"
                });
                if (D === P) {
                    X = !0;
                    break
                }
            } catch {}
            if (!X) {
                J = `${A}.corrupted.${Date.now()}`;
                try {
                    Y.copyFileSync(A, J), h(`Corrupted config backed up to: ${J}`, {
                        level: "error"
                    })
                } catch {}
            }
            let j = pJq(A);
            if (J) process.stderr.write(`The corrupted file has been backed up to: ${J}
`);
            else if (X) process.stderr.write(`The corrupted file has already been backed up.
`);
            if (j) process.stderr.write(`A backup file exists at: ${j}
You can manually restore it by running: cp "${j}" "${A}"

`);
            else process.stderr.write(`
`)
        }
        return X61(q)
    }
}
// @from(Ln 449773, Col 0)
function sz() {
    let A = jFA(),
        q = se(ij(), Gy);
    if (!q.projects) return ad1;
    let K = q.projects[A] ?? ad1;
    if (typeof K.allowedTools === "string") K.allowedTools = j9(K.allowedTools) ?? [];
    return K
}
// @from(Ln 449782, Col 0)
function iH(A) {
    let q = jFA();
    try {
        nJq(ij(), Gy, (K) => {
            let Y = K.projects?.[q] ?? ad1,
                z = A(Y);
            if (z === Y) return K;
            return {
                ...K,
                projects: {
                    ...K.projects,
                    [q]: z
                }
            }
        })
    } catch (K) {
        h(`Failed to save config with lock: ${K}`, {
            level: "error"
        });
        let Y = se(ij(), Gy),
            z = Y.projects?.[q] ?? ad1,
            w = A(z);
        if (w === z) return;
        iJq(ij(), {
            ...Y,
            projects: {
                ...Y.projects,
                [q]: w
            }
        }, Gy)
    }
}
// @from(Ln 449815, Col 0)
function xc() {
    return KZ1() !== null
}
// @from(Ln 449819, Col 0)
function Cp1() {
    return xc() && !J6(process.env.FORCE_AUTOUPDATE_PLUGINS)
}
// @from(Ln 449823, Col 0)
function KZ1() {
    if (J6(process.env.DISABLE_AUTOUPDATER)) return "DISABLE_AUTOUPDATER set";
    if (process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) return "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC set";
    let A = f6();
    if (A.autoUpdates === !1 && (A.installMethod !== "native" || A.autoUpdatesProtectedForNative !== !0)) return "config";
    return null
}
// @from(Ln 449831, Col 0)
function hq6() {
    if (J6(process.env.DISABLE_COST_WARNINGS)) return !1;
    if (i8()) return !1;
    let q = Cn(),
        K = Mk() !== null;
    if (!q.hasToken && !K) return !1;
    let Y = f6(),
        z = Y.oauthAccount?.organizationRole,
        w = Y.oauthAccount?.workspaceRole;
    if (!z || !w) return !1;
    return ["admin", "billing"].includes(z) || ["workspace_admin", "workspace_billing"].includes(w)
}
// @from(Ln 449844, Col 0)
function iu() {
    if (dJq !== null) return dJq;
    if (!i8()) return !1;
    let A = dK();
    if (A === "max" || A === "pro") return !0;
    let K = f6().oauthAccount?.organizationRole;
    return !!K && ["admin", "billing", "owner", "primary_owner"].includes(K)
}
// @from(Ln 449853, Col 0)
function Lh() {
    let A = f6();
    if (A.userID) return A.userID;
    let q = $wz(32).toString("hex");
    return jA((K) => ({
        ...K,
        userID: q
    })), q
}
// @from(Ln 449863, Col 0)
function ZvA() {
    let A = f6();
    if (A.anonymousId) return A.anonymousId;
    let q = `claudecode.v1.${Owz()}`;
    return jA((K) => ({
        ...K,
        anonymousId: q
    })), q
}
// @from(Ln 449873, Col 0)
function rJq() {
    if (!f6().firstStartTime) {
        let q = new Date().toISOString();
        jA((K) => ({
            ...K,
            firstStartTime: K.firstStartTime ?? q
        }))
    }
}
// @from(Ln 449883, Col 0)
function cB(A) {
    let q = y8();
    if (A === "ExperimentalUltraClaudeMd") return cB("User");
    switch (A) {
        case "User":
            return PF(O8(), "CLAUDE.md");
        case "Local":
            return PF(q, "CLAUDE.local.md");
        case "Project":
            return PF(q, "CLAUDE.md");
        case "Managed":
            return PF(df(), "CLAUDE.md");
        case "ExperimentalUltraClaudeMd":
            return PF(O8(), "ULTRACLAUDE.md");
        case "AutoMem":
            return lO6()
    }
}
// @from(Ln 449902, Col 0)
function _jA() {
    return PF(df(), ".claude", "rules")
}
// @from(Ln 449906, Col 0)
function JjA() {
    return PF(O8(), "rules")
}
// @from(Ln 449909, Col 4)
lJq
// @from(Ln 449909, Col 9)
ad1
// @from(Ln 449909, Col 14)
Gy
// @from(Ln 449909, Col 18)
jS$
// @from(Ln 449909, Col 23)
MS$
// @from(Ln 449909, Col 28)
Ic
// @from(Ln 449909, Col 32)
KY1 = null
// @from(Ln 449910, Col 4)
rd1 = 0
// @from(Ln 449911, Col 4)
xT6 = 0
// @from(Ln 449912, Col 4)
XFA = !1
// @from(Ln 449913, Col 4)
jFA
// @from(Ln 449913, Col 9)
dJq = null
// @from(Ln 449914, Col 4)
cA = v(() => {
    m6();
    zq();
    G5();
    hA();
    N7();
    AH();
    Ez();
    qH();
    B6();
    _8();
    wq();
    J7();
    Z6();
    f0();
    y6();
    h9();
    u6();
    Tz();
    $A1();
    xW();
    m6();
    gRA();
    lJq = o(NQ(), 1), ad1 = {
        allowedTools: [],
        mcpContextUris: [],
        mcpServers: {},
        enabledMcpjsonServers: [],
        disabledMcpjsonServers: [],
        hasTrustDialogAccepted: !1,
        projectOnboardingSeenCount: 0,
        hasClaudeMdExternalIncludesApproved: !1,
        hasClaudeMdExternalIncludesWarningShown: !1
    }, Gy = {
        numStartups: 0,
        installMethod: void 0,
        autoUpdates: void 0,
        theme: "dark",
        preferredNotifChannel: "auto",
        verbose: !1,
        editorMode: "normal",
        autoCompactEnabled: !0,
        showTurnDuration: !0,
        hasSeenTasksHint: !1,
        hasUsedStash: !1,
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
        todoFeatureEnabled: !0,
        showExpandedTodos: !1,
        messageIdleNotifThresholdMs: 60000,
        autoConnectIde: !1,
        autoInstallIdeExtension: !0,
        fileCheckpointingEnabled: !0,
        terminalProgressBarEnabled: !0,
        cachedStatsigGates: {},
        cachedDynamicConfigs: {},
        cachedGrowthBookFeatures: {},
        respectGitignore: !0
    };
    jS$ = {
        ...Gy,
        autoUpdates: !1
    }, MS$ = {
        ...ad1
    };
    Ic = {
        config: null,
        mtime: 0
    };
    Tq(async () => {
        _wz()
    });
    jFA = KA(() => {
        let A = y8(),
            q = YX(A);
        if (q) return yT1(q);
        return yT1(cJq(A))
    })
})
// @from(Ln 450001, Col 0)
async function oJq() {
    if (BT6 === null && !uT6) uT6 = Xwz(), BT6 = await uT6, uT6 = null, tp.cache.clear?.()
}
// @from(Ln 450005, Col 0)
function aJq() {
    return tp(!0)
}
// @from(Ln 450009, Col 0)
function Jwz() {
    if (BT6 !== null) return BT6;
    return
}
// @from(Ln 450013, Col 0)
async function Xwz() {
    return
}
// @from(Ln 450016, Col 4)
BT6 = null
// @from(Ln 450017, Col 4)
uT6 = null
// @from(Ln 450018, Col 4)
tp
// @from(Ln 450019, Col 4)
_71 = v(() => {
    cA();
    zq();
    B6();
    J7();
    Bf();
    G5();
    tp = KA((A) => {
        let q = Lh(),
            K = f6(),
            Y, z, w;
        if (A) {
            if (Y = dK() ?? void 0, z = Sn() ?? void 0, Y && K.claudeCodeFirstTokenDate) {
                let _ = new Date(K.claudeCodeFirstTokenDate).getTime();
                if (!isNaN(_)) w = _
            }
        }
        let H = u3(),
            $ = H?.organizationUuid,
            O = H?.accountUuid;
        return {
            deviceId: q,
            sessionId: U6(),
            email: Jwz(),
            appVersion: {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.38",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-02-10T00:04:56Z"
            }.VERSION,
            platform: xA.platform,
            organizationUuid: $,
            accountUuid: O,
            userType: "external",
            subscriptionType: Y,
            rateLimitTier: z,
            firstTokenTime: w,
            ...process.env.GITHUB_ACTIONS === "true" && {
                githubActionsMetadata: {
                    actor: process.env.GITHUB_ACTOR,
                    actorId: process.env.GITHUB_ACTOR_ID,
                    repository: process.env.GITHUB_REPOSITORY,
                    repositoryId: process.env.GITHUB_REPOSITORY_ID,
                    repositoryOwner: process.env.GITHUB_REPOSITORY_OWNER,
                    repositoryOwnerId: process.env.GITHUB_REPOSITORY_OWNER_ID
                }
            }
        }
    })
})
// @from(Ln 450072, Col 0)
function FT6(A) {
    let q = ed1.get(A);
    if (q) $GA({
        experimentId: q.experimentId,
        variationId: q.variationId,
        userAttributes: sJq(),
        experimentMetadata: {
            feature_id: A
        }
    })
}
// @from(Ln 450084, Col 0)
function te() {
    return ZM1()
}
// @from(Ln 450088, Col 0)
function sJq() {
    let A = aJq(),
        q = A.email;
    return {
        id: A.deviceId,
        sessionId: A.sessionId,
        deviceID: A.deviceId,
        platform: A.platform,
        ...A.organizationUuid && {
            organizationUUID: A.organizationUuid
        },
        ...A.accountUuid && {
            accountUUID: A.accountUuid
        },
        ...A.userType && {
            userType: A.userType
        },
        ...A.subscriptionType && {
            subscriptionType: A.subscriptionType
        },
        ...A.rateLimitTier && {
            rateLimitTier: A.rateLimitTier
        },
        ...A.firstTokenTime && {
            firstTokenTime: A.firstTokenTime
        },
        ...q && {
            email: q
        },
        ...A.appVersion && {
            appVersion: A.appVersion
        },
        ...A.githubActionsMetadata && {
            githubActionsMetadata: A.githubActionsMetadata
        }
    }
}
// @from(Ln 450125, Col 0)
async function tJq(A, q, K) {
    if (!te()) return q;
    let Y = await Of1();
    if (!Y) return q;
    let z;
    if (mT6.has(A)) z = mT6.get(A);
    else z = Y.getFeatureValue(A, q);
    if (K) FT6(A);
    return z
}
// @from(Ln 450135, Col 0)
async function WFA(A, q) {
    return tJq(A, q, !0)
}
// @from(Ln 450139, Col 0)
function x8(A, q) {
    if (!te()) return q;
    if (wf1(A, q), ed1.has(A)) FT6(A);
    else sd1.add(A);
    try {
        let K = f6().cachedGrowthBookFeatures?.[A];
        return K !== void 0 ? K : q
    } catch {
        return q
    }
}
// @from(Ln 450151, Col 0)
function i2(A) {
    if (!te()) return !1;
    if (wf1(A, !1), ed1.has(A)) FT6(A);
    else sd1.add(A);
    let q = f6(),
        K = q.cachedGrowthBookFeatures?.[A];
    if (K !== void 0) return Boolean(K);
    return q.cachedStatsigGates?.[A] ?? !1
}
// @from(Ln 450160, Col 0)
async function zJq(A) {
    if (!te()) return !1;
    if (td1) await td1;
    let q = f6(),
        K = q.cachedStatsigGates?.[A];
    if (K !== void 0) return wf1(A, !1), Boolean(K);
    let Y = q.cachedGrowthBookFeatures?.[A];
    if (Y !== void 0) return wf1(A, !1), Boolean(Y);
    return wf1(A, !1), !1
}
// @from(Ln 450171, Col 0)
function UL4() {
    if (!te()) return;
    try {
        QT6(), td1 = Of1().finally(() => {
            td1 = null
        })
    } catch (A) {
        K1(A instanceof Error ? A : Error(`GrowthBook: Auth change refresh failed: ${A}`))
    }
}
// @from(Ln 450182, Col 0)
function QT6() {
    eJq(), zf1?.destroy(), zf1 = null, PFA = !1, td1 = null, ed1.clear(), sd1.clear(), mT6.clear(), MFA.cache?.clear?.(), Of1.cache?.clear?.(), wf1.cache?.clear?.()
}
// @from(Ln 450185, Col 0)
async function jwz() {
    if (!te()) return;
    try {
        let A = await Of1();
        if (!A) return;
        await A.refreshFeatures();
        let q = f6().cachedGrowthBookFeatures;
        if (q) {
            let K = {
                    ...q
                },
                Y = !1;
            for (let z of Object.keys(q)) {
                let w = A.getFeatureValue(z, void 0);
                if (w !== void 0 && !W61(w, q[z])) K[z] = w, Y = !0
            }
            if (Y) jA((z) => ({
                ...z,
                cachedGrowthBookFeatures: K
            }))
        }
    } catch (A) {
        K1(A instanceof Error ? A : Error(`GrowthBook: Light refresh failed: ${A}`))
    }
}
// @from(Ln 450211, Col 0)
function Mwz() {
    if (!te()) return;
    if (Hf1) clearInterval(Hf1);
    if (Hf1 = setInterval(() => {
            jwz()
        }, Dwz), !$f1) $f1 = () => {
        eJq()
    }, process.on("beforeExit", $f1)
}
// @from(Ln 450221, Col 0)
function eJq() {
    if (Hf1) clearInterval(Hf1), Hf1 = null;
    if ($f1) process.removeListener("beforeExit", $f1), $f1 = null
}
// @from(Ln 450225, Col 0)
async function CI(A, q) {
    return WFA(A, q)
}
// @from(Ln 450229, Col 0)
function ep(A, q) {
    return x8(A, q)
}
// @from(Ln 450232, Col 4)
zf1 = null
// @from(Ln 450233, Col 4)
PFA = !1
// @from(Ln 450234, Col 4)
ed1
// @from(Ln 450234, Col 9)
mT6
// @from(Ln 450234, Col 14)
sd1
// @from(Ln 450234, Col 19)
td1 = null
// @from(Ln 450235, Col 4)
MFA
// @from(Ln 450235, Col 9)
Of1
// @from(Ln 450235, Col 14)
wf1
// @from(Ln 450235, Col 19)
Dwz = 21600000
// @from(Ln 450236, Col 4)
Hf1 = null
// @from(Ln 450237, Col 4)
$f1 = null
// @from(Ln 450238, Col 4)
U4 = v(() => {
    an1();
    KoA();
    zoA();
    _71();
    Z6();
    y6();
    qm1();
    cA();
    B0();
    B6();
    m6();
    ed1 = new Map, mT6 = new Map, sd1 = new Set;
    MFA = KA(() => {
        if (!te()) return null;
        let A = sJq(),
            q = "https://api.anthropic.com/",
            Y = $H(!0) || w4() ? DH() : {
                headers: {},
                error: "trust not established"
            };
        PFA = !Y.error;
        let w = new Pr1({
            apiHost: q,
            clientKey: YoA,
            attributes: A,
            remoteEval: !0,
            cacheKeyAttributes: ["id", "organizationUUID"],
            ...Y.error ? {} : {
                apiHostRequestHeaders: Y.headers
            },
            ...{}
        });
        zf1 = w;
        let H = w.init({
            timeout: 5000
        }).then(async ($) => {
            if (zf1 !== w) return;
            let O = w.getPayload();
            if (O?.features) {
                let _ = {};
                for (let [J, X] of Object.entries(O.features)) {
                    let D = X;
                    if ("value" in D && !("defaultValue" in D)) _[J] = {
                        ...D,
                        defaultValue: D.value
                    };
                    else _[J] = D;
                    if (D.source === "experiment" && D.experimentResult) {
                        let {
                            experimentResult: j,
                            experiment: M
                        } = D;
                        if (M?.key && j.variationId !== void 0) ed1.set(J, {
                            experimentId: M.key,
                            variationId: j.variationId
                        })
                    }
                }
                await w.setPayload({
                    ...O,
                    features: _
                });
                for (let [J, X] of Object.entries(_))
                    if ("value" in X) mT6.set(J, X.value);
                for (let J of sd1) FT6(J);
                sd1.clear()
            }
        }).catch(($) => {});
        return process.on("beforeExit", () => zf1?.destroy()), process.on("exit", () => zf1?.destroy()), {
            client: w,
            initialized: H
        }
    }), Of1 = KA(async () => {
        let A = MFA();
        if (!A) return null;
        if (!PFA) {
            if ($H(!0) || w4()) {
                if (!DH().error) {
                    if (QT6(), A = MFA(), !A) return null
                }
            }
        }
        return await A.initialized, Mwz(), A.client
    });
    wf1 = KA(async (A, q) => {
        let K = await tJq(A, q, !1),
            Y = f6();
        if (W61(Y.cachedGrowthBookFeatures?.[A], K)) return;
        jA((z) => ({
            ...z,
            cachedGrowthBookFeatures: {
                ...z.cachedGrowthBookFeatures ?? {},
                [A]: K
            }
        }))
    })
})
// @from(Ln 450336, Col 4)
iSA = {}
// @from(Ln 450349, Col 0)
function fFA(A) {
    if (!A.startsWith("auto:")) return null;
    let q = A.slice(5),
        K = parseInt(q, 10);
    if (isNaN(K)) return h(`Invalid ENABLE_TOOL_SEARCH value "${A}": expected auto:N where N is a number.`), null;
    return Math.max(0, Math.min(100, K))
}
// @from(Ln 450357, Col 0)
function qXq(A) {
    if (!A) return !1;
    return A === "auto" || A.startsWith("auto:")
}
// @from(Ln 450362, Col 0)
function ZFA() {
    let A = process.env.ENABLE_TOOL_SEARCH;
    if (!A) return GFA;
    if (A === "auto") return GFA;
    let q = fFA(A);
    if (q !== null) return q;
    return GFA
}
// @from(Ln 450371, Col 0)
function KXq(A) {
    let q = es1(A),
        K = yG(A, q),
        Y = ZFA() / 100;
    return Math.floor(K * Y)
}
// @from(Ln 450378, Col 0)
function YXq(A) {
    return Math.floor(KXq(A) * Pwz)
}
// @from(Ln 450382, Col 0)
function Gwz() {
    let A = process.env.ENABLE_TOOL_SEARCH,
        q = A ? fFA(A) : null;
    if (q === 0) return "tst";
    if (q === 100) {
        if (J6(process.env.ENABLE_MCP_CLI)) return "mcp-cli";
        return "standard"
    }
    if (qXq(A)) return "tst-auto";
    if (J6(A)) return "tst";
    if (J6(process.env.ENABLE_MCP_CLI)) return "mcp-cli";
    if (FY(process.env.ENABLE_MCP_CLI)) return "standard";
    if (FY(process.env.ENABLE_TOOL_SEARCH)) return "standard";
    return "tst-auto"
}
// @from(Ln 450398, Col 0)
function w91() {
    let A = process.env.ENABLE_TOOL_SEARCH,
        q = A ? fFA(A) : null;
    if (q === 0) return "tst";
    if (q === 100);
    else if (qXq(A)) return "tst-auto";
    if (J6(A)) return "tst";
    if (J6(process.env.ENABLE_EXPERIMENTAL_MCP_CLI)) return "mcp-cli";
    if (q === 100) return "standard";
    if (FY(A)) return "standard";
    if (FY(process.env.ENABLE_EXPERIMENTAL_MCP_CLI)) return "standard";
    if (!BZ()) try {
        if (x8("tengu_mcp_tool_search", !0) === !1) return "standard"
    } catch {}
    return "tst-auto"
}
// @from(Ln 450415, Col 0)
function fwz() {
    try {
        let A = x8("tengu_tool_search_unsupported_models", null);
        if (A && Array.isArray(A) && A.length > 0) return A
    } catch {}
    return Zwz
}
// @from(Ln 450423, Col 0)
function zXq(A) {
    let q = A.toLowerCase(),
        K = fwz();
    for (let Y of K)
        if (q.includes(Y.toLowerCase())) return !1;
    return !0
}
// @from(Ln 450431, Col 0)
function Fp() {
    let A = w91(),
        q = A === "tst" || A === "tst-auto";
    if (!AXq) AXq = !0, h(`[ToolSearch:optimistic] mode=${A}, ENABLE_TOOL_SEARCH=${process.env.ENABLE_TOOL_SEARCH}, result=${q}`);
    switch (A) {
        case "tst":
        case "tst-auto":
            return !0;
        case "mcp-cli":
        case "standard":
            return !1
    }
}
// @from(Ln 450445, Col 0)
function wXq(A) {
    return A.some((q) => q.name === dM)
}
// @from(Ln 450448, Col 0)
async function Vwz(A, q, K) {
    let Y = A.filter((w) => BW(w));
    if (Y.length === 0) return 0;
    return (await Promise.all(Y.map(async (w) => {
        let H = await w.prompt({
                getToolPermissionContext: q,
                tools: A,
                agents: K
            }),
            $ = w.inputJSONSchema ? Q1(w.inputJSONSchema) : w.inputSchema ? Q1(n51(w.inputSchema)) : "";
        return w.name.length + H.length + $.length
    }))).reduce((w, H) => w + H, 0)
}
// @from(Ln 450461, Col 0)
async function XU1(A, q, K, Y, z) {
    let w = q.filter((O) => O.isMcp).length;

    function H(O, _, J, X) {
        c("tengu_tool_search_mode_decision", {
            enabled: O,
            mode: _,
            reason: J,
            checkedModel: A,
            mcpToolCount: w,
            userType: "external",
            ...X
        })
    }
    if (!zXq(A)) return h(`Tool search disabled for model '${A}': model does not support tool_reference blocks. This feature is only available on Claude Sonnet 4+, Opus 4+, and newer models.`), H(!1, "standard", "model_unsupported"), !1;
    if (!wXq(q)) return h("Tool search disabled: ToolSearchTool is not available (may have been disallowed via disallowedTools)."), H(!1, "standard", "mcp_search_unavailable"), !1;
    let $ = w91();
    switch ($) {
        case "tst":
            return H(!0, $, "tst_enabled"), !0;
        case "tst-auto": {
            let {
                enabled: O,
                debugDescription: _,
                metrics: J
            } = await vwz(q, K, Y, A);
            if (O) return h(`Auto tool search enabled: ${_}` + (z ? ` [source: ${z}]` : "")), H(!0, $, "auto_above_threshold", J), !0;
            if (q.some((X) => BW(X)) && !BZ()) try {
                let X = x8("tengu_tst_kx7", !1);
                return h(`Tool search ${X?"enabled":"disabled"} via experiment (tengu_tst_kx7): below threshold, deferred tools present` + (z ? ` [source: ${z}]` : "")), H(X, $, "experiment_enable_tst"), X
            } catch (X) {
                h(`tengu_tst_kx7: GrowthBook not ready, skipping: ${X}`)
            }
            return h(`Auto tool search disabled: ${_}` + (z ? ` [source: ${z}]` : "")), H(!1, $, "auto_below_threshold", J), !1
        }
        case "mcp-cli":
            return H(!1, $, "mcp_cli_mode"), !1;
        case "standard":
            return H(!1, $, "standard_mode"), !1
    }
}
// @from(Ln 450503, Col 0)
function Kp(A) {
    return typeof A === "object" && A !== null && "type" in A && A.type === "tool_reference"
}
// @from(Ln 450507, Col 0)
function Nwz(A) {
    return Kp(A) && "tool_name" in A && typeof A.tool_name === "string"
}
// @from(Ln 450511, Col 0)
function Twz(A) {
    return typeof A === "object" && A !== null && "type" in A && A.type === "tool_result" && "content" in A && Array.isArray(A.content)
}
// @from(Ln 450515, Col 0)
function tBA(A) {
    let q = new Set;
    for (let K of A) {
        if (K.type !== "user") continue;
        let Y = K.message?.content;
        if (!Array.isArray(Y)) continue;
        for (let z of Y)
            if (Twz(z)) {
                for (let w of z.content)
                    if (Nwz(w)) q.add(w.tool_name)
            }
    }
    if (q.size > 0) h(`Dynamic tool loading: found ${q.size} discovered tools in message history`);
    return q
}
// @from(Ln 450530, Col 0)
async function vwz(A, q, K, Y) {
    let z = await Wwz(A, q, K, Y);
    if (z !== null) {
        let $ = KXq(Y);
        return {
            enabled: z >= $,
            debugDescription: `${z} tokens (threshold: ${$}, ${ZFA()}% of context)`,
            metrics: {
                deferredToolTokens: z,
                threshold: $
            }
        }
    }
    let w = await Vwz(A, q, K),
        H = YXq(Y);
    return {
        enabled: w >= H,
        debugDescription: `${w} chars (threshold: ${H}, ${ZFA()}% of context) (char fallback)`,
        metrics: {
            deferredToolDescriptionChars: w,
            charThreshold: H
        }
    }
}
// @from(Ln 450554, Col 4)
GFA = 10
// @from(Ln 450555, Col 4)
Pwz = 2.5
// @from(Ln 450556, Col 4)
Wwz
// @from(Ln 450556, Col 9)
Zwz
// @from(Ln 450556, Col 14)
AXq = !1
// @from(Ln 450557, Col 4)
oL = v(() => {
    U4();
    Js();
    u6();
    zq();
    hA();
    m6();
    kZ6();
    IG1();
    Z6();
    la();
    hf();
    Wk();
    Wwz = KA(async (A, q, K, Y) => {
        let z = A.filter((w) => BW(w));
        if (z.length === 0) return 0;
        try {
            let w = await Kc(z, q, {
                activeAgents: K,
                allAgents: K
            }, Y);
            if (w === 0) return null;
            return Math.max(0, w - lZ6)
        } catch {
            return null
        }
    }, (A) => A.filter((q) => BW(q)).map((q) => q.name).join(","));
    Zwz = ["haiku"]
})
// @from(Ln 450586, Col 4)
$Xq = {}
// @from(Ln 450596, Col 0)
function Ft() {
    return parseInt(process.env.MCP_TOOL_TIMEOUT || "", 10) || Ewz
}
// @from(Ln 450600, Col 0)
function kwz() {
    if (J6(process.env.ENABLE_TOOL_SEARCH) && J6(process.env.ENABLE_EXPERIMENTAL_MCP_CLI) && !HXq) HXq = !0, console.warn(H6.yellow(`Warning: Both ENABLE_TOOL_SEARCH and ENABLE_EXPERIMENTAL_MCP_CLI are set to true.
These are mutually exclusive. Using Tool Search mode.`))
}
// @from(Ln 450605, Col 0)
function O$() {
    return kwz(), w91() === "mcp-cli"
}
// @from(Ln 450609, Col 0)
function bc() {
    return O$() && !FY(process.env.ENABLE_MCP_CLI_ENDPOINT)
}
// @from(Ln 450613, Col 0)
function ce(A) {
    let q = A.match(/^mcp-cli\s+(call|read)\s+([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)(?:\s+([\s\S]+))?$/);
    if (!q) return null;
    let [, K, Y, z, w = ""] = q;
    if (!K || !Y || !z) return null;
    return {
        command: K,
        server: Y,
        tool: z,
        toolName: z,
        args: w,
        fullCommand: A
    }
}
// @from(Ln 450628, Col 0)
function Lwz(A) {
    return /^mcp-cli\s+(call|read)\s+/.test(A)
}
// @from(Ln 450632, Col 0)
function oBA(A) {
    let q = VD(A);
    if (!q || !q.toolName) return null;
    return `${q.serverName}/${q.toolName}`
}
// @from(Ln 450637, Col 4)
Ewz = 1e8
// @from(Ln 450638, Col 4)
HXq = !1
// @from(Ln 450639, Col 4)
Tj = v(() => {
    hA();
    _T();
    oL();
    q3()
})
// @from(Ln 450645, Col 4)
Ac1 = R((Rwz) => {
    class VFA extends Error {
        constructor(A, q, K) {
            super(K);
            Error.captureStackTrace(this, this.constructor), this.name = this.constructor.name, this.code = q, this.exitCode = A, this.nestedError = void 0
        }
    }
    class OXq extends VFA {
        constructor(A) {
            super(1, "commander.invalidArgument", A);
            Error.captureStackTrace(this, this.constructor), this.name = this.constructor.name
        }
    }
    Rwz.CommanderError = VFA;
    Rwz.InvalidArgumentError = OXq
})
// @from(Ln 450661, Col 4)
gT6 = R((Iwz) => {
    var {
        InvalidArgumentError: Swz
    } = Ac1();
    class _Xq {
        constructor(A, q) {
            switch (this.description = q || "", this.variadic = !1, this.parseArg = void 0, this.defaultValue = void 0, this.defaultValueDescription = void 0, this.argChoices = void 0, A[0]) {
                case "<":
                    this.required = !0, this._name = A.slice(1, -1);
                    break;
                case "[":
                    this.required = !1, this._name = A.slice(1, -1);
                    break;
                default:
                    this.required = !0, this._name = A;
                    break
            }
            if (this._name.length > 3 && this._name.slice(-3) === "...") this.variadic = !0, this._name = this._name.slice(0, -3)
        }
        name() {
            return this._name
        }
        _concatValue(A, q) {
            if (q === this.defaultValue || !Array.isArray(q)) return [A];
            return q.concat(A)
        }
        default (A, q) {
            return this.defaultValue = A, this.defaultValueDescription = q, this
        }
        argParser(A) {
            return this.parseArg = A, this
        }
        choices(A) {
            return this.argChoices = A.slice(), this.parseArg = (q, K) => {
                if (!this.argChoices.includes(q)) throw new Swz(`Allowed choices are ${this.argChoices.join(", ")}.`);
                if (this.variadic) return this._concatValue(q, K);
                return q
            }, this
        }
        argRequired() {
            return this.required = !0, this
        }
        argOptional() {
            return this.required = !1, this
        }
    }

    function hwz(A) {
        let q = A.name() + (A.variadic === !0 ? "..." : "");
        return A.required ? "<" + q + ">" : "[" + q + "]"
    }
    Iwz.Argument = _Xq;
    Iwz.humanReadableArgName = hwz
})
// @from(Ln 450715, Col 4)
NFA = R((Bwz) => {
    var {
        humanReadableArgName: uwz
    } = gT6();
    class JXq {
        constructor() {
            this.helpWidth = void 0, this.sortSubcommands = !1, this.sortOptions = !1, this.showGlobalOptions = !1
        }
        visibleCommands(A) {
            let q = A.commands.filter((Y) => !Y._hidden),
                K = A._getHelpCommand();
            if (K && !K._hidden) q.push(K);
            if (this.sortSubcommands) q.sort((Y, z) => {
                return Y.name().localeCompare(z.name())
            });
            return q
        }
        compareOptions(A, q) {
            let K = (Y) => {
                return Y.short ? Y.short.replace(/^-/, "") : Y.long.replace(/^--/, "")
            };
            return K(A).localeCompare(K(q))
        }
        visibleOptions(A) {
            let q = A.options.filter((Y) => !Y.hidden),
                K = A._getHelpOption();
            if (K && !K.hidden) {
                let Y = K.short && A._findOption(K.short),
                    z = K.long && A._findOption(K.long);
                if (!Y && !z) q.push(K);
                else if (K.long && !z) q.push(A.createOption(K.long, K.description));
                else if (K.short && !Y) q.push(A.createOption(K.short, K.description))
            }
            if (this.sortOptions) q.sort(this.compareOptions);
            return q
        }
        visibleGlobalOptions(A) {
            if (!this.showGlobalOptions) return [];
            let q = [];
            for (let K = A.parent; K; K = K.parent) {
                let Y = K.options.filter((z) => !z.hidden);
                q.push(...Y)
            }
            if (this.sortOptions) q.sort(this.compareOptions);
            return q
        }
        visibleArguments(A) {
            if (A._argsDescription) A.registeredArguments.forEach((q) => {
                q.description = q.description || A._argsDescription[q.name()] || ""
            });
            if (A.registeredArguments.find((q) => q.description)) return A.registeredArguments;
            return []
        }
        subcommandTerm(A) {
            let q = A.registeredArguments.map((K) => uwz(K)).join(" ");
            return A._name + (A._aliases[0] ? "|" + A._aliases[0] : "") + (A.options.length ? " [options]" : "") + (q ? " " + q : "")
        }
        optionTerm(A) {
            return A.flags
        }
        argumentTerm(A) {
            return A.name()
        }
        longestSubcommandTermLength(A, q) {
            return q.visibleCommands(A).reduce((K, Y) => {
                return Math.max(K, q.subcommandTerm(Y).length)
            }, 0)
        }
        longestOptionTermLength(A, q) {
            return q.visibleOptions(A).reduce((K, Y) => {
                return Math.max(K, q.optionTerm(Y).length)
            }, 0)
        }
        longestGlobalOptionTermLength(A, q) {
            return q.visibleGlobalOptions(A).reduce((K, Y) => {
                return Math.max(K, q.optionTerm(Y).length)
            }, 0)
        }
        longestArgumentTermLength(A, q) {
            return q.visibleArguments(A).reduce((K, Y) => {
                return Math.max(K, q.argumentTerm(Y).length)
            }, 0)
        }
        commandUsage(A) {
            let q = A._name;
            if (A._aliases[0]) q = q + "|" + A._aliases[0];
            let K = "";
            for (let Y = A.parent; Y; Y = Y.parent) K = Y.name() + " " + K;
            return K + q + " " + A.usage()
        }
        commandDescription(A) {
            return A.description()
        }
        subcommandDescription(A) {
            return A.summary() || A.description()
        }
        optionDescription(A) {
            let q = [];
            if (A.argChoices) q.push(`choices: ${A.argChoices.map((K)=>JSON.stringify(K)).join(", ")}`);
            if (A.defaultValue !== void 0) {
                if (A.required || A.optional || A.isBoolean() && typeof A.defaultValue === "boolean") q.push(`default: ${A.defaultValueDescription||JSON.stringify(A.defaultValue)}`)
            }
            if (A.presetArg !== void 0 && A.optional) q.push(`preset: ${JSON.stringify(A.presetArg)}`);
            if (A.envVar !== void 0) q.push(`env: ${A.envVar}`);
            if (q.length > 0) return `${A.description} (${q.join(", ")})`;
            return A.description
        }
        argumentDescription(A) {
            let q = [];
            if (A.argChoices) q.push(`choices: ${A.argChoices.map((K)=>JSON.stringify(K)).join(", ")}`);
            if (A.defaultValue !== void 0) q.push(`default: ${A.defaultValueDescription||JSON.stringify(A.defaultValue)}`);
            if (q.length > 0) {
                let K = `(${q.join(", ")})`;
                if (A.description) return `${A.description} ${K}`;
                return K
            }
            return A.description
        }
        formatHelp(A, q) {
            let K = q.padWidth(A, q),
                Y = q.helpWidth || 80,
                z = 2,
                w = 2;

            function H(j, M) {
                if (M) {
                    let P = `${j.padEnd(K+2)}${M}`;
                    return q.wrap(P, Y - 2, K + 2)
                }
                return j
            }

            function $(j) {
                return j.join(`
`).replace(/^/gm, " ".repeat(2))
            }
            let O = [`Usage: ${q.commandUsage(A)}`, ""],
                _ = q.commandDescription(A);
            if (_.length > 0) O = O.concat([q.wrap(_, Y, 0), ""]);
            let J = q.visibleArguments(A).map((j) => {
                return H(q.argumentTerm(j), q.argumentDescription(j))
            });
            if (J.length > 0) O = O.concat(["Arguments:", $(J), ""]);
            let X = q.visibleOptions(A).map((j) => {
                return H(q.optionTerm(j), q.optionDescription(j))
            });
            if (X.length > 0) O = O.concat(["Options:", $(X), ""]);
            if (this.showGlobalOptions) {
                let j = q.visibleGlobalOptions(A).map((M) => {
                    return H(q.optionTerm(M), q.optionDescription(M))
                });
                if (j.length > 0) O = O.concat(["Global Options:", $(j), ""])
            }
            let D = q.visibleCommands(A).map((j) => {
                return H(q.subcommandTerm(j), q.subcommandDescription(j))
            });
            if (D.length > 0) O = O.concat(["Commands:", $(D), ""]);
            return O.join(`
`)
        }
        padWidth(A, q) {
            return Math.max(q.longestOptionTermLength(A, q), q.longestGlobalOptionTermLength(A, q), q.longestSubcommandTermLength(A, q), q.longestArgumentTermLength(A, q))
        }
        wrap(A, q, K, Y = 40) {
            let w = new RegExp(`[\\n][${" \\f\\t\\v   -   　\uFEFF"}]+`);
            if (A.match(w)) return A;
            let H = q - K;
            if (H < Y) return A;
            let $ = A.slice(0, K),
                O = A.slice(K).replace(`\r
`, `
`),
                _ = " ".repeat(K),
                X = `\\s${"​"}`,
                D = new RegExp(`
|.{1,${H-1}}([${X}]|$)|[^${X}]+?([${X}]|$)`, "g"),
                j = O.match(D) || [];
            return $ + j.map((M, P) => {
                if (M === `
`) return "";
                return (P > 0 ? _ : "") + M.trimEnd()
            }).join(`
`)
        }
    }
    Bwz.Help = JXq
})
// @from(Ln 450902, Col 4)
TFA = R((Uwz) => {
    var {
        InvalidArgumentError: Fwz
    } = Ac1();
    class XXq {
        constructor(A, q) {
            this.flags = A, this.description = q || "", this.required = A.includes("<"), this.optional = A.includes("["), this.variadic = /\w\.\.\.[>\]]$/.test(A), this.mandatory = !1;
            let K = gwz(A);
            if (this.short = K.shortFlag, this.long = K.longFlag, this.negate = !1, this.long) this.negate = this.long.startsWith("--no-");
            this.defaultValue = void 0, this.defaultValueDescription = void 0, this.presetArg = void 0, this.envVar = void 0, this.parseArg = void 0, this.hidden = !1, this.argChoices = void 0, this.conflictsWith = [], this.implied = void 0
        }
        default (A, q) {
            return this.defaultValue = A, this.defaultValueDescription = q, this
        }
        preset(A) {
            return this.presetArg = A, this
        }
        conflicts(A) {
            return this.conflictsWith = this.conflictsWith.concat(A), this
        }
        implies(A) {
            let q = A;
            if (typeof A === "string") q = {
                [A]: !0
            };
            return this.implied = Object.assign(this.implied || {}, q), this
        }
        env(A) {
            return this.envVar = A, this
        }
        argParser(A) {
            return this.parseArg = A, this
        }
        makeOptionMandatory(A = !0) {
            return this.mandatory = !!A, this
        }
        hideHelp(A = !0) {
            return this.hidden = !!A, this
        }
        _concatValue(A, q) {
            if (q === this.defaultValue || !Array.isArray(q)) return [A];
            return q.concat(A)
        }
        choices(A) {
            return this.argChoices = A.slice(), this.parseArg = (q, K) => {
                if (!this.argChoices.includes(q)) throw new Fwz(`Allowed choices are ${this.argChoices.join(", ")}.`);
                if (this.variadic) return this._concatValue(q, K);
                return q
            }, this
        }
        name() {
            if (this.long) return this.long.replace(/^--/, "");
            return this.short.replace(/^-/, "")
        }
        attributeName() {
            return Qwz(this.name().replace(/^no-/, ""))
        }
        is(A) {
            return this.short === A || this.long === A
        }
        isBoolean() {
            return !this.required && !this.optional && !this.negate
        }
    }
    class DXq {
        constructor(A) {
            this.positiveOptions = new Map, this.negativeOptions = new Map, this.dualOptions = new Set, A.forEach((q) => {
                if (q.negate) this.negativeOptions.set(q.attributeName(), q);
                else this.positiveOptions.set(q.attributeName(), q)
            }), this.negativeOptions.forEach((q, K) => {
                if (this.positiveOptions.has(K)) this.dualOptions.add(K)
            })
        }
        valueFromOption(A, q) {
            let K = q.attributeName();
            if (!this.dualOptions.has(K)) return !0;
            let Y = this.negativeOptions.get(K).presetArg,
                z = Y !== void 0 ? Y : !1;
            return q.negate === (z === A)
        }
    }

    function Qwz(A) {
        return A.split("-").reduce((q, K) => {
            return q + K[0].toUpperCase() + K.slice(1)
        })
    }

    function gwz(A) {
        let q, K, Y = A.split(/[ |,]+/);
        if (Y.length > 1 && !/^[[<]/.test(Y[1])) q = Y.shift();
        if (K = Y.shift(), !q && /^-[^-]$/.test(K)) q = K, K = void 0;
        return {
            shortFlag: q,
            longFlag: K
        }
    }
    Uwz.Option = XXq;
    Uwz.DualOptions = DXq
})
// @from(Ln 451002, Col 4)
jXq = R((iwz) => {
    function cwz(A, q) {
        if (Math.abs(A.length - q.length) > 3) return Math.max(A.length, q.length);
        let K = [];
        for (let Y = 0; Y <= A.length; Y++) K[Y] = [Y];
        for (let Y = 0; Y <= q.length; Y++) K[0][Y] = Y;
        for (let Y = 1; Y <= q.length; Y++)
            for (let z = 1; z <= A.length; z++) {
                let w = 1;
                if (A[z - 1] === q[Y - 1]) w = 0;
                else w = 1;
                if (K[z][Y] = Math.min(K[z - 1][Y] + 1, K[z][Y - 1] + 1, K[z - 1][Y - 1] + w), z > 1 && Y > 1 && A[z - 1] === q[Y - 2] && A[z - 2] === q[Y - 1]) K[z][Y] = Math.min(K[z][Y], K[z - 2][Y - 2] + 1)
            }
        return K[A.length][q.length]
    }

    function lwz(A, q) {
        if (!q || q.length === 0) return "";
        q = Array.from(new Set(q));
        let K = A.startsWith("--");
        if (K) A = A.slice(2), q = q.map((H) => H.slice(2));
        let Y = [],
            z = 3,
            w = 0.4;
        if (q.forEach((H) => {
                if (H.length <= 1) return;
                let $ = cwz(A, H),
                    O = Math.max(A.length, H.length);
                if ((O - $) / O > w) {
                    if ($ < z) z = $, Y = [H];
                    else if ($ === z) Y.push(H)
                }
            }), Y.sort((H, $) => H.localeCompare($)), K) Y = Y.map((H) => `--${H}`);
        if (Y.length > 1) return `
(Did you mean one of ${Y.join(", ")}?)`;
        if (Y.length === 1) return `
(Did you mean ${Y[0]}?)`;
        return ""
    }
    iwz.suggestSimilar = lwz
})