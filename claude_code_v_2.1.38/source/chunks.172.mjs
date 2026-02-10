
// @from(Ln 441844, Col 4)
jmA = {}
// @from(Ln 441858, Col 0)
function nYz() {
    let A = N_q(pYz(import.meta.url));
    return N_q(Hp1())
}
// @from(Ln 441863, Col 0)
function rYz(A) {
    if (!D9() || typeof Bun > "u" || !Bun.embeddedFiles) return null;
    for (let q of Bun.embeddedFiles) {
        let K = q.name;
        if (K && K.endsWith(A)) return q
    }
    return null
}
// @from(Ln 441871, Col 0)
async function T_q(A) {
    let q = rYz(A);
    if (!q) return null;
    let K = await q.arrayBuffer();
    return new Uint8Array(K)
}
// @from(Ln 441877, Col 0)
async function oYz() {
    let A = b1();
    if (D9()) {
        let H = await T_q("tree-sitter.wasm"),
            $ = await T_q("tree-sitter-bash.wasm");
        if (H && $) {
            await md1.init({
                wasmBinary: H
            }), aZ1 = new md1, Fd1 = await MT6.load($), aZ1.setLanguage(Fd1), h("tree-sitter: loaded from embedded"), c("tengu_tree_sitter_load", {
                success: !0,
                from_embedded: !0
            });
            return
        }
    }
    let K = nYz(),
        Y = !1,
        z = Y ? PT6(K, "web-tree-sitter", "tree-sitter.wasm") : PT6(K, "tree-sitter.wasm"),
        w = Y ? PT6(K, "tree-sitter-bash", "tree-sitter-bash.wasm") : PT6(K, "tree-sitter-bash.wasm");
    if (!A.existsSync(z) || !A.existsSync(w)) {
        h("tree-sitter: WASM files not found"), c("tengu_tree_sitter_load", {
            success: !1
        });
        return
    }
    await md1.init({
        locateFile: (H) => H.endsWith("tree-sitter.wasm") ? z : H
    }), aZ1 = new md1, Fd1 = await MT6.load(A.readFileBytesSync(w)), aZ1.setLanguage(Fd1), h("tree-sitter: loaded from disk"), c("tengu_tree_sitter_load", {
        success: !0,
        from_embedded: !1
    })
}
// @from(Ln 441909, Col 0)
async function v_q() {
    if (!DmA) DmA = oYz();
    await DmA
}
// @from(Ln 441913, Col 0)
async function aYz(A) {
    if (await v_q(), !A || A.length > dYz || !aZ1 || !Fd1) return null;
    try {
        let q = aZ1.parse(A),
            K = q?.rootNode;
        if (!K) return null;
        let Y = E_q(K),
            z = sYz(Y);
        return {
            tree: q,
            rootNode: K,
            envVars: z,
            commandNode: Y,
            originalCommand: A
        }
    } catch {
        return null
    }
}
// @from(Ln 441933, Col 0)
function E_q(A) {
    let {
        type: q,
        children: K,
        parent: Y
    } = A;
    if (XmA.has(q)) return A;
    if (q === "variable_assignment" && Y) return Y.children.find((z) => z && XmA.has(z.type) && z.startIndex > A.startIndex) ?? null;
    if (q === "pipeline" || q === "redirected_statement") return K.find((z) => z && XmA.has(z.type)) ?? null;
    for (let z of K) {
        let w = z && E_q(z);
        if (w) return w
    }
    return null
}
// @from(Ln 441949, Col 0)
function sYz(A) {
    if (!A || A.type !== "command") return [];
    let q = [];
    for (let K of A.children) {
        if (!K) continue;
        if (K.type === "variable_assignment") q.push(K.text);
        else if (K.type === "command_name" || K.type === "word") break
    }
    return q
}
// @from(Ln 441960, Col 0)
function tYz(A) {
    if (A.type === "declaration_command") {
        let Y = A.children[0];
        return Y && cYz.has(Y.text) ? [Y.text] : []
    }
    let q = [],
        K = !1;
    for (let Y of A.children) {
        if (!Y || Y.type === "variable_assignment") continue;
        if (Y.type === "command_name" || !K && Y.type === "word") {
            K = !0, q.push(Y.text);
            continue
        }
        if (lYz.has(Y.type)) q.push(eYz(Y.text));
        else if (iYz.has(Y.type)) break
    }
    return q
}
// @from(Ln 441979, Col 0)
function eYz(A) {
    return A.length >= 2 && (A[0] === '"' && A.at(-1) === '"' || A[0] === "'" && A.at(-1) === "'") ? A.slice(1, -1) : A
}
// @from(Ln 441982, Col 4)
dYz = 1e4
// @from(Ln 441983, Col 4)
cYz
// @from(Ln 441983, Col 9)
lYz
// @from(Ln 441983, Col 14)
iYz
// @from(Ln 441983, Col 19)
XmA
// @from(Ln 441983, Col 24)
aZ1 = null
// @from(Ln 441984, Col 4)
Fd1 = null
// @from(Ln 441985, Col 4)
DmA = null
// @from(Ln 441986, Col 4)
MmA = v(() => {
    V_q();
    _8();
    am();
    u6();
    Z6();
    cYz = new Set(["export", "declare", "typeset", "readonly", "local", "unset", "unsetenv"]), lYz = new Set(["word", "string", "raw_string", "number"]), iYz = new Set(["command_substitution", "process_substitution"]), XmA = new Set(["command", "declaration_command"])
})
// @from(Ln 441994, Col 0)
class k_q {
    originalCommand;
    constructor(A) {
        this.originalCommand = A
    }
    toString() {
        return this.originalCommand
    }
    getPipeSegments() {
        try {
            let A = rZ1(this.originalCommand),
                q = [],
                K = [];
            for (let Y of A)
                if (Y === "|") {
                    if (K.length > 0) q.push(K.join(" ")), K = []
                } else K.push(Y);
            if (K.length > 0) q.push(K.join(" "));
            return q.length > 0 ? q : [this.originalCommand]
        } catch {
            return [this.originalCommand]
        }
    }
    withoutOutputRedirections() {
        if (!this.originalCommand.includes(">")) return this.originalCommand;
        let {
            commandWithoutRedirections: A,
            redirections: q
        } = aI(this.originalCommand);
        return q.length > 0 ? A : this.originalCommand
    }
    getOutputRedirections() {
        let {
            redirections: A
        } = aI(this.originalCommand);
        return A
    }
}
// @from(Ln 442033, Col 0)
function PmA(A, q) {
    let K = A;
    q(K);
    for (let Y of K.children)
        if (Y) PmA(Y, q)
}
// @from(Ln 442040, Col 0)
function Azz(A) {
    let q = [];
    return PmA(A, (K) => {
        if (K.type === "pipeline") {
            for (let Y of K.children)
                if (Y && Y.type === "|") q.push(Y.startIndex)
        }
    }), q
}
// @from(Ln 442050, Col 0)
function qzz(A) {
    let q = [];
    return PmA(A, (K) => {
        if (K.type === "file_redirect") {
            let Y = K.children,
                z = Y.find((H) => H && (H.type === ">" || H.type === ">>")),
                w = Y.find((H) => H && H.type === "word");
            if (z && w) q.push({
                startIndex: K.startIndex,
                endIndex: K.endIndex,
                target: w.text,
                operator: z.type
            })
        }
    }), q
}
// @from(Ln 442066, Col 0)
class L_q {
    originalCommand;
    pipePositions;
    redirectionNodes;
    constructor(A, q, K) {
        this.originalCommand = A, this.pipePositions = q, this.redirectionNodes = K
    }
    toString() {
        return this.originalCommand
    }
    getPipeSegments() {
        if (this.pipePositions.length === 0) return [this.originalCommand];
        let A = [],
            q = 0;
        for (let Y of this.pipePositions) {
            let z = this.originalCommand.slice(q, Y).trim();
            if (z) A.push(z);
            q = Y + 1
        }
        let K = this.originalCommand.slice(q).trim();
        if (K) A.push(K);
        return A
    }
    withoutOutputRedirections() {
        if (this.redirectionNodes.length === 0) return this.originalCommand;
        let A = [...this.redirectionNodes].sort((K, Y) => Y.startIndex - K.startIndex),
            q = this.originalCommand;
        for (let K of A) q = q.slice(0, K.startIndex) + q.slice(K.endIndex);
        return q.trim().replace(/\s+/g, " ")
    }
    getOutputRedirections() {
        return this.redirectionNodes.map(({
            target: A,
            operator: q
        }) => ({
            target: A,
            operator: q
        }))
    }
}
// @from(Ln 442106, Col 4)
Kzz
// @from(Ln 442106, Col 9)
WT6
// @from(Ln 442107, Col 4)
R_q = v(() => {
    zq();
    wG();
    Kzz = KA(async () => {
        try {
            let {
                parseCommand: A
            } = await Promise.resolve().then(() => (MmA(), jmA)), q = await A("echo test");
            if (!q) return !1;
            return q.tree.delete(), !0
        } catch {
            return !1
        }
    }), WT6 = {
        async parse(A) {
            if (!A) return null;
            if (await Kzz()) try {
                let {
                    parseCommand: K
                } = await Promise.resolve().then(() => (MmA(), jmA)), Y = await K(A);
                if (Y) {
                    let z = Azz(Y.rootNode),
                        w = qzz(Y.rootNode);
                    return Y.tree.delete(), new L_q(A, z, w)
                }
            } catch {}
            return new k_q(A)
        }
    }
})
// @from(Ln 442137, Col 0)
async function Yzz(A, q, K) {
    if (q.filter((_) => {
            let J = _.trim();
            return Sd1.test(J)
        }).length > 1) {
        let _ = {
            type: "other",
            reason: "Multiple directory changes in one command require approval for clarity"
        };
        return {
            behavior: "ask",
            decisionReason: _,
            message: d_(qq.name, _)
        }
    }
    let z = new Map;
    for (let _ of q) {
        let J = _.trim();
        if (!J) continue;
        let X = await K({
            ...A,
            command: J
        });
        z.set(J, X)
    }
    let w = Array.from(z.entries()).find(([, _]) => _.behavior === "deny");
    if (w) {
        let [_, J] = w;
        return {
            behavior: "deny",
            message: J.behavior === "deny" ? J.message : `Permission denied for: ${_}`,
            decisionReason: {
                type: "subcommandResults",
                reasons: z
            }
        }
    }
    if (Array.from(z.values()).every((_) => _.behavior === "allow")) return {
        behavior: "allow",
        updatedInput: A,
        decisionReason: {
            type: "subcommandResults",
            reasons: z
        }
    };
    let $ = [];
    for (let [, _] of z)
        if (_.behavior !== "allow" && "suggestions" in _ && _.suggestions) $.push(..._.suggestions);
    let O = {
        type: "subcommandResults",
        reasons: z
    };
    return {
        behavior: "ask",
        message: d_(qq.name, O),
        decisionReason: O,
        suggestions: $.length > 0 ? $ : void 0
    }
}
// @from(Ln 442196, Col 0)
async function zzz(A) {
    if (!A.includes(">")) return A;
    return (await WT6.parse(A))?.withoutOutputRedirections() ?? A
}
// @from(Ln 442200, Col 0)
async function y_q(A, q) {
    if (tOq(A.command)) {
        let w = lm(A.command),
            H = {
                type: "other",
                reason: w.behavior === "ask" && w.message ? w.message : "This command uses shell operators that require approval for safety"
            };
        return {
            behavior: "ask",
            message: d_(qq.name, H),
            decisionReason: H
        }
    }
    let K = await WT6.parse(A.command);
    if (!K) return {
        behavior: "passthrough",
        message: "Failed to parse command"
    };
    let Y = K.getPipeSegments();
    if (Y.length <= 1) return {
        behavior: "passthrough",
        message: "No pipes found in command"
    };
    let z = await Promise.all(Y.map((w) => zzz(w)));
    return Yzz(A, z, q)
}
// @from(Ln 442226, Col 4)
C_q = v(() => {
    i0();
    wG();
    PJ();
    qf6();
    R_q()
})
// @from(Ln 442242, Col 0)
function I_q(A) {
    let q = A.length;
    if (q <= WmA) return A.map((Y) => `'${Y}'`).join(", ");
    return `${A.slice(0,WmA).map((Y)=>`'${Y}'`).join(", ")}, and ${q-WmA} more`
}
// @from(Ln 442248, Col 0)
function Hzz(A) {
    let q = A.match(h_q);
    if (!q || q.index === void 0) return A;
    let K = A.substring(0, q.index),
        Y = K.lastIndexOf("/");
    if (Y === -1) return ".";
    return K.substring(0, Y) || "/"
}
// @from(Ln 442257, Col 0)
function GmA(A, q, K) {
    let Y = K === "read" ? "read" : "edit",
        z = Gj(A, q, Y, "deny");
    if (z !== null) return {
        allowed: !1,
        decisionReason: {
            type: "rule",
            rule: z
        }
    };
    if (K !== "read") {
        let H = NmA(A);
        if (!H.safe) return {
            allowed: !1,
            decisionReason: {
                type: "other",
                reason: H.message
            }
        }
    }
    if (EI(A, q)) {
        if (K === "read" || q.mode === "acceptEdits") return {
            allowed: !0
        }
    }
    if (K === "read") {
        let H = vmA(A, {});
        if (H.behavior === "allow") return {
            allowed: !0,
            decisionReason: H.decisionReason
        }
    }
    if (K !== "read") {
        let H = TmA(A, {});
        if (H.behavior === "allow") return {
            allowed: !0,
            decisionReason: H.decisionReason
        }
    }
    let w = Gj(A, q, Y, "allow");
    if (w !== null) return {
        allowed: !0,
        decisionReason: {
            type: "rule",
            rule: w
        }
    };
    return {
        allowed: !1
    }
}
// @from(Ln 442309, Col 0)
function $zz(A, q, K, Y) {
    if (p61(A)) {
        let O = GT6(A) ? A : ZT6(q, A),
            {
                resolvedPath: _
            } = QH(b1(), O),
            J = GmA(_, K, Y);
        return {
            allowed: J.allowed,
            resolvedPath: _,
            decisionReason: J.decisionReason
        }
    }
    let z = Hzz(A),
        w = GT6(z) ? z : ZT6(q, z),
        {
            resolvedPath: H
        } = QH(b1(), w),
        $ = GmA(H, K, Y);
    return {
        allowed: $.allowed,
        resolvedPath: H,
        decisionReason: $.decisionReason
    }
}
// @from(Ln 442335, Col 0)
function x_q(A) {
    if (A === "~" || A.startsWith("~/")) return ZmA() + A.slice(1);
    return A
}
// @from(Ln 442340, Col 0)
function Ozz(A) {
    if (A === "*" || A.endsWith("/*")) return !0;
    let q = A === "/" ? A : A.replace(/\/$/, "");
    if (q === "/") return !0;
    let K = ZmA();
    if (q === K) return !0;
    if (wzz(q) === "/") return !0;
    return !1
}
// @from(Ln 442350, Col 0)
function b_q(A, q, K, Y) {
    let z = x_q(A.replace(/^['"]|['"]$/g, ""));
    if (z.includes("$") || z.includes("%")) return {
        allowed: !1,
        resolvedPath: z,
        decisionReason: {
            type: "other",
            reason: "Shell expansion syntax in paths requires manual approval"
        }
    };
    if (h_q.test(z)) {
        if (Y === "write" || Y === "create") return {
            allowed: !1,
            resolvedPath: z,
            decisionReason: {
                type: "other",
                reason: "Glob patterns are not allowed in write operations. Please specify an exact file path."
            }
        };
        return $zz(z, q, K, Y)
    }
    let w = GT6(z) ? z : ZT6(q, z),
        {
            resolvedPath: H
        } = QH(b1(), w),
        $ = GmA(H, K, Y);
    return {
        allowed: $.allowed,
        resolvedPath: H,
        decisionReason: $.decisionReason
    }
}
// @from(Ln 442383, Col 0)
function _zz(A, q, K) {
    let Y = fmA[A],
        z = Y(q);
    for (let w of z) {
        let H = x_q(w.replace(/^['"]|['"]$/g, "")),
            $ = GT6(H) ? H : ZT6(K, H);
        if (Ozz($)) return {
            behavior: "ask",
            message: `Dangerous ${A} operation detected: '${$}'

This command would remove a critical system directory. This requires explicit approval and cannot be auto-allowed by permission rules.`,
            decisionReason: {
                type: "other",
                reason: `Dangerous ${A} operation on critical path: ${$}`
            },
            suggestions: []
        }
    }
    return {
        behavior: "passthrough",
        message: `No dangerous removals detected for ${A} command`
    }
}
// @from(Ln 442407, Col 0)
function S_q(A, q, K = []) {
    let Y = [],
        z = !1;
    for (let w = 0; w < A.length; w++) {
        let H = A[w];
        if (H === void 0 || H === null) continue;
        if (H.startsWith("-")) {
            let $ = H.split("=")[0];
            if ($ && ["-e", "--regexp", "-f", "--file"].includes($)) z = !0;
            if ($ && q.has($) && !H.includes("=")) w++;
            continue
        }
        if (!z) {
            z = !0;
            continue
        }
        Y.push(H)
    }
    return Y.length > 0 ? Y : K
}
// @from(Ln 442428, Col 0)
function jzz(A, q, K, Y, z, w) {
    let H = fmA[A],
        $ = H(q),
        O = w ?? u_q[A],
        _ = Dzz[A];
    if (_ && !_(q)) return {
        behavior: "ask",
        message: `${A} with flags requires manual approval to ensure path safety. For security, Claude Code cannot automatically validate ${A} commands that use flags, as some flags like --target-directory=PATH can bypass path validation.`,
        decisionReason: {
            type: "other",
            reason: `${A} command with flags requires manual approval`
        }
    };
    if (z && O !== "read") return {
        behavior: "ask",
        message: "Commands that change directories and perform write operations require explicit approval to ensure paths are evaluated correctly. For security, Claude Code cannot automatically determine the final working directory when 'cd' is used in compound commands.",
        decisionReason: {
            type: "other",
            reason: "Compound command contains cd with write operation - manual approval required to prevent path resolution bypass"
        }
    };
    for (let J of $) {
        let {
            allowed: X,
            resolvedPath: D,
            decisionReason: j
        } = b_q(J, K, Y, O);
        if (!X) {
            let M = Array.from(iG1(Y)),
                P = I_q(M),
                W = j?.type === "other" ? j.reason : `${A} in '${D}' was blocked. For security, Claude Code may only ${Xzz[A]} the allowed working directories for this session: ${P}.`;
            if (j?.type === "rule") return {
                behavior: "deny",
                message: W,
                decisionReason: j
            };
            return {
                behavior: "ask",
                message: W,
                blockedPath: D,
                decisionReason: j
            }
        }
    }
    return {
        behavior: "passthrough",
        message: `Path validation passed for ${A} command`
    }
}
// @from(Ln 442478, Col 0)
function Mzz(A, q) {
    return (K, Y, z, w) => {
        let H = jzz(A, K, Y, z, w, q);
        if (H.behavior === "deny") return H;
        if (A === "rm" || A === "rmdir") {
            let $ = _zz(A, K, Y);
            if ($.behavior !== "passthrough") return $
        }
        if (H.behavior === "passthrough") return H;
        if (H.behavior === "ask") {
            let $ = q ?? u_q[A],
                O = [];
            if (H.blockedPath)
                if ($ === "read") {
                    let _ = fQ(H.blockedPath),
                        J = U76(_, "session");
                    if (J) O.push(J)
                } else O.push({
                    type: "addDirectories",
                    directories: [fQ(H.blockedPath)],
                    destination: "session"
                });
            if ($ === "write" || $ === "create") O.push({
                type: "setMode",
                mode: "acceptEdits",
                destination: "session"
            });
            H.suggestions = O
        }
        return H
    }
}
// @from(Ln 442511, Col 0)
function Pzz(A) {
    let q = pz(A, (z) => `$${z}`);
    if (!q.success) return [];
    let K = q.tokens,
        Y = [];
    for (let z of K)
        if (typeof z === "string") Y.push(z);
        else if (typeof z === "object" && z !== null && "op" in z && z.op === "glob" && "pattern" in z) Y.push(String(z.pattern));
    return Y
}
// @from(Ln 442522, Col 0)
function Wzz(A, q, K, Y) {
    let z = VmA(A),
        w = Pzz(z);
    if (w.length === 0) return {
        behavior: "passthrough",
        message: "Empty command - no paths to validate"
    };
    let [H, ...$] = w;
    if (!H || !Jzz.includes(H)) return {
        behavior: "passthrough",
        message: `Command '${H}' is not a path-restricted command`
    };
    let O = H === "sed" && QU1(z) ? "read" : void 0;
    return Mzz(H, O)($, q, K, Y)
}
// @from(Ln 442538, Col 0)
function Gzz(A, q, K, Y) {
    if (Y && A.length > 0) return {
        behavior: "ask",
        message: "Commands that change directories and write via output redirection require explicit approval to ensure paths are evaluated correctly. For security, Claude Code cannot automatically determine the final working directory when 'cd' is used in compound commands.",
        decisionReason: {
            type: "other",
            reason: "Compound command contains cd with output redirection - manual approval required to prevent path resolution bypass"
        }
    };
    for (let {
            target: z
        }
        of A) {
        if (z === "/dev/null") continue;
        let {
            allowed: w,
            resolvedPath: H,
            decisionReason: $
        } = b_q(z, q, K, "create");
        if (!w) {
            let O = Array.from(iG1(K)),
                _ = I_q(O),
                J = $?.type === "other" ? $.reason : $?.type === "rule" ? `Output redirection to '${H}' was blocked by a deny rule.` : `Output redirection to '${H}' was blocked. For security, Claude Code may only write to files in the allowed working directories for this session: ${_}.`;
            if ($?.type === "rule") return {
                behavior: "deny",
                message: J,
                decisionReason: $
            };
            return {
                behavior: "ask",
                message: J,
                blockedPath: H,
                suggestions: [{
                    type: "addDirectories",
                    directories: [fQ(H)],
                    destination: "session"
                }]
            }
        }
    }
    return {
        behavior: "passthrough",
        message: "No unsafe redirections found"
    }
}
// @from(Ln 442584, Col 0)
function fT6(A, q, K, Y) {
    if (/>>\s*>\s*\(|>\s*>\s*\(|<\s*\(/.test(A.command)) return {
        behavior: "ask",
        message: "Process substitution (>(...) or <(...)) can execute arbitrary commands and requires manual approval",
        decisionReason: {
            type: "other",
            reason: "Process substitution requires manual approval"
        }
    };
    let {
        redirections: z,
        hasDangerousRedirection: w
    } = aI(A.command);
    if (w) return {
        behavior: "ask",
        message: "Shell expansion syntax in paths requires manual approval",
        decisionReason: {
            type: "other",
            reason: "Shell expansion syntax in paths requires manual approval"
        }
    };
    let H = Gzz(z, q, K, Y);
    if (H.behavior !== "passthrough") return H;
    let $ = AD(A.command);
    for (let O of $) {
        let _ = Wzz(O, q, K, Y);
        if (_.behavior === "ask" || _.behavior === "deny") return _
    }
    return {
        behavior: "passthrough",
        message: "All path commands validated successfully"
    }
}
// @from(Ln 442617, Col 4)
WmA = 5
// @from(Ln 442618, Col 4)
h_q
// @from(Ln 442618, Col 9)
m2 = (A) => A.filter((q) => !q?.startsWith("-"))
// @from(Ln 442619, Col 4)
fmA
// @from(Ln 442619, Col 9)
Jzz
// @from(Ln 442619, Col 14)
Xzz
// @from(Ln 442619, Col 19)
u_q
// @from(Ln 442619, Col 24)
Dzz
// @from(Ln 442620, Col 4)
B_q = v(() => {
    _8();
    E2();
    CO();
    Ez();
    wG();
    M_();
    km();
    Kf6();
    h_q = /[*?[\]{}]/;
    fmA = {
        cd: (A) => A.length === 0 ? [ZmA()] : [A.join(" ")],
        ls: (A) => {
            let q = m2(A);
            return q.length > 0 ? q : ["."]
        },
        find: (A) => {
            let q = [],
                K = new Set(["-newer", "-anewer", "-cnewer", "-mnewer", "-samefile", "-path", "-wholename", "-ilname", "-lname", "-ipath", "-iwholename"]),
                Y = /^-newer[acmBt][acmtB]$/,
                z = !1;
            for (let w = 0; w < A.length; w++) {
                let H = A[w];
                if (!H) continue;
                if (H.startsWith("-")) {
                    if (["-H", "-L", "-P"].includes(H)) continue;
                    if (z = !0, K.has(H) || Y.test(H)) {
                        let $ = A[w + 1];
                        if ($) q.push($), w++
                    }
                    continue
                }
                if (!z) q.push(H)
            }
            return q.length > 0 ? q : ["."]
        },
        mkdir: m2,
        touch: m2,
        rm: m2,
        rmdir: m2,
        mv: m2,
        cp: m2,
        cat: m2,
        head: m2,
        tail: m2,
        sort: m2,
        uniq: m2,
        wc: m2,
        cut: m2,
        paste: m2,
        column: m2,
        file: m2,
        stat: m2,
        diff: m2,
        awk: m2,
        strings: m2,
        hexdump: m2,
        od: m2,
        base64: m2,
        nl: m2,
        sha256sum: m2,
        sha1sum: m2,
        md5sum: m2,
        tr: (A) => {
            let q = A.some((Y) => Y === "-d" || Y === "--delete" || Y.startsWith("-") && Y.includes("d"));
            return m2(A).slice(q ? 1 : 2)
        },
        grep: (A) => {
            let K = S_q(A, new Set(["-e", "--regexp", "-f", "--file", "--exclude", "--include", "--exclude-dir", "--include-dir", "-m", "--max-count", "-A", "--after-context", "-B", "--before-context", "-C", "--context"]));
            if (K.length === 0 && A.some((Y) => ["-r", "-R", "--recursive"].includes(Y))) return ["."];
            return K
        },
        rg: (A) => {
            return S_q(A, new Set(["-e", "--regexp", "-f", "--file", "-t", "--type", "-T", "--type-not", "-g", "--glob", "-m", "--max-count", "--max-depth", "-r", "--replace", "-A", "--after-context", "-B", "--before-context", "-C", "--context"]), ["."])
        },
        sed: (A) => {
            let q = [],
                K = !1,
                Y = !1;
            for (let z = 0; z < A.length; z++) {
                if (K) {
                    K = !1;
                    continue
                }
                let w = A[z];
                if (!w) continue;
                if (w.startsWith("-")) {
                    if (["-f", "--file"].includes(w)) {
                        let H = A[z + 1];
                        if (H) q.push(H), K = !0;
                        Y = !0
                    } else if (["-e", "--expression"].includes(w)) K = !0, Y = !0;
                    else if (w.includes("e") || w.includes("f")) Y = !0;
                    continue
                }
                if (!Y) {
                    Y = !0;
                    continue
                }
                q.push(w)
            }
            return q
        },
        jq: (A) => {
            let q = [],
                K = new Set(["-e", "--expression", "-f", "--from-file", "--arg", "--argjson", "--slurpfile", "--rawfile", "--args", "--jsonargs", "-L", "--library-path", "--indent", "--tab"]),
                Y = !1;
            for (let z = 0; z < A.length; z++) {
                let w = A[z];
                if (w === void 0 || w === null) continue;
                if (w.startsWith("-")) {
                    let H = w.split("=")[0];
                    if (H && ["-e", "--expression"].includes(H)) Y = !0;
                    if (H && K.has(H) && !w.includes("=")) z++;
                    continue
                }
                if (!Y) {
                    Y = !0;
                    continue
                }
                q.push(w)
            }
            return q
        },
        git: (A) => {
            if (A.length >= 1 && A[0] === "diff") {
                if (A.includes("--no-index")) return A.slice(1).filter((Y) => !Y?.startsWith("-")).slice(0, 2)
            }
            return []
        }
    }, Jzz = Object.keys(fmA), Xzz = {
        cd: "change directories to",
        ls: "list files in",
        find: "search files in",
        mkdir: "create directories in",
        touch: "create or modify files in",
        rm: "remove files from",
        rmdir: "remove directories from",
        mv: "move files to/from",
        cp: "copy files to/from",
        cat: "concatenate files from",
        head: "read the beginning of files from",
        tail: "read the end of files from",
        sort: "sort contents of files from",
        uniq: "filter duplicate lines from files in",
        wc: "count lines/words/bytes in files from",
        cut: "extract columns from files in",
        paste: "merge files from",
        column: "format files from",
        tr: "transform text from files in",
        file: "examine file types in",
        stat: "read file stats from",
        diff: "compare files from",
        awk: "process text from files in",
        strings: "extract strings from files in",
        hexdump: "display hex dump of files from",
        od: "display octal dump of files from",
        base64: "encode/decode files from",
        nl: "number lines in files from",
        grep: "search for patterns in files from",
        rg: "search for patterns in files from",
        sed: "edit files in",
        git: "access files with git from",
        jq: "process JSON from files in",
        sha256sum: "compute SHA-256 checksums for files in",
        sha1sum: "compute SHA-1 checksums for files in",
        md5sum: "compute MD5 checksums for files in"
    }, u_q = {
        cd: "read",
        ls: "read",
        find: "read",
        mkdir: "create",
        touch: "create",
        rm: "write",
        rmdir: "write",
        mv: "write",
        cp: "write",
        cat: "read",
        head: "read",
        tail: "read",
        sort: "read",
        uniq: "read",
        wc: "read",
        cut: "read",
        paste: "read",
        column: "read",
        tr: "read",
        file: "read",
        stat: "read",
        diff: "read",
        awk: "read",
        strings: "read",
        hexdump: "read",
        od: "read",
        base64: "read",
        nl: "read",
        grep: "read",
        rg: "read",
        sed: "write",
        git: "read",
        jq: "read",
        sha256sum: "read",
        sha1sum: "read",
        md5sum: "read"
    }, Dzz = {
        mv: (A) => !A.some((q) => q?.startsWith("-")),
        cp: (A) => !A.some((q) => q?.startsWith("-"))
    }
})
// @from(Ln 442830, Col 0)
function fzz(A) {
    return Zzz.includes(A)
}
// @from(Ln 442834, Col 0)
function Vzz(A, q) {
    let K = A.trim(),
        [Y] = K.split(/\s+/);
    if (!Y) return {
        behavior: "passthrough",
        message: "Base command not found"
    };
    if (q.mode === "acceptEdits" && fzz(Y)) return {
        behavior: "allow",
        updatedInput: {
            command: A
        },
        decisionReason: {
            type: "mode",
            mode: "acceptEdits"
        }
    };
    return {
        behavior: "passthrough",
        message: `No mode-specific handling for '${Y}' in ${q.mode} mode`
    }
}
// @from(Ln 442857, Col 0)
function m_q(A, q) {
    if (q.mode === "bypassPermissions") return {
        behavior: "passthrough",
        message: "Bypass mode is handled in main permission flow"
    };
    if (q.mode === "dontAsk") return {
        behavior: "passthrough",
        message: "DontAsk mode is handled in main permission flow"
    };
    let K = AD(A.command);
    for (let Y of K) {
        let z = Vzz(Y, q);
        if (z.behavior !== "passthrough") return z
    }
    return {
        behavior: "passthrough",
        message: "No mode-specific validation required"
    }
}
// @from(Ln 442876, Col 4)
Zzz
// @from(Ln 442877, Col 4)
F_q = v(() => {
    wG();
    Zzz = ["mkdir", "touch", "rm", "rmdir", "mv", "cp", "sed"]
})
// @from(Ln 442882, Col 0)
function g_q(A) {
    return `prompt: ${A.trim()}`
}
// @from(Ln 442886, Col 0)
function ne() {
    return !1
}
// @from(Ln 442890, Col 0)
function EmA(A) {
    return []
}
// @from(Ln 442894, Col 0)
function U_q(A) {
    return []
}
// @from(Ln 442898, Col 0)
function Qd1(A) {
    return []
}
// @from(Ln 442901, Col 0)
async function VT6(A, q, K, Y, z, w) {
    return {
        matches: !1,
        confidence: "high",
        reason: "This feature is disabled"
    }
}
// @from(Ln 442908, Col 0)
async function p_q(A, q, K) {
    return q || null
}
// @from(Ln 442911, Col 4)
Q_q = "prompt:"
// @from(Ln 442913, Col 0)
function d_q(A, q, K, Y) {
    return
}
// @from(Ln 442917, Col 0)
function NT6(A) {
    return [{
        type: "addRules",
        rules: [{
            toolName: qq.name,
            ruleContent: A
        }],
        behavior: "allow",
        destination: "localSettings"
    }]
}
// @from(Ln 442929, Col 0)
function r_q(A) {
    return [{
        type: "addRules",
        rules: [{
            toolName: qq.name,
            ruleContent: `${A}:*`
        }],
        behavior: "allow",
        destination: "localSettings"
    }]
}
// @from(Ln 442941, Col 0)
function c_q(A) {
    return /^[a-zA-Z0-9_-]{1,64}$/.test(A)
}
// @from(Ln 442945, Col 0)
function l_q(A) {
    return [{
        type: "addRules",
        rules: [{
            toolName: A,
            ruleContent: void 0
        }],
        behavior: "allow",
        destination: "localSettings"
    }]
}
// @from(Ln 442957, Col 0)
function Nzz(A, q) {
    let K = ce(A);
    if (!K) return null;
    try {
        if (AD(A).length > 1) return null
    } catch {
        return null
    }
    let {
        server: Y,
        toolName: z
    } = K;
    if (!c_q(Y) || !c_q(z)) return {
        behavior: "deny",
        message: "Invalid MCP server or tool name. Names must contain only letters, numbers, hyphens, and underscores.",
        decisionReason: {
            type: "other",
            reason: "Security: Invalid characters in MCP identifier"
        }
    };
    let w = `mcp__${Y}__${z}`,
        H = {
            name: w
        },
        $ = ImA(q, H);
    if ($) return {
        behavior: "deny",
        message: `MCP tool ${Y}/${z} has been denied`,
        decisionReason: {
            type: "rule",
            rule: $
        }
    };
    let O = xmA(q, H);
    if (O) return {
        behavior: "ask",
        message: d_(w),
        decisionReason: {
            type: "rule",
            rule: O
        },
        suggestions: l_q(w)
    };
    let _ = hmA(q, H);
    if (_) return {
        behavior: "allow",
        updatedInput: {
            command: A
        },
        decisionReason: {
            type: "rule",
            rule: _
        }
    };
    return {
        behavior: "ask",
        message: d_(w),
        decisionReason: {
            type: "other",
            reason: "MCP tool requires permission"
        },
        suggestions: l_q(w)
    }
}
// @from(Ln 443022, Col 0)
function Tzz(A) {
    if (A.endsWith(":*")) return !1;
    for (let q = 0; q < A.length; q++)
        if (A[q] === "*") {
            let K = 0,
                Y = q - 1;
            while (Y >= 0 && A[Y] === "\\") K++, Y--;
            if (K % 2 === 0) return !0
        } return !1
}
// @from(Ln 443033, Col 0)
function RmA(A, q) {
    let K = A.trim(),
        Y = "\x00ESCAPED_STAR\x00",
        z = "\x00ESCAPED_BACKSLASH\x00",
        w = "",
        H = 0;
    while (H < K.length) {
        let X = K[H];
        if (X === "\\" && H + 1 < K.length) {
            let D = K[H + 1];
            if (D === "*") {
                w += "\x00ESCAPED_STAR\x00", H += 2;
                continue
            } else if (D === "\\") {
                w += "\x00ESCAPED_BACKSLASH\x00", H += 2;
                continue
            }
        }
        w += X, H++
    }
    let _ = w.replace(/[.+?^${}()|[\]\\'"]/g, "\\$&").replace(/\*/g, ".*").replace(new RegExp("\x00ESCAPED_STAR\x00", "g"), "\\*").replace(new RegExp("\x00ESCAPED_BACKSLASH\x00", "g"), "\\\\");
    return new RegExp(`^${_}$`).test(q)
}
// @from(Ln 443057, Col 0)
function ymA(A) {
    let q = LmA(A);
    if (q !== null) return {
        type: "prefix",
        prefix: q
    };
    if (Tzz(A)) return {
        type: "wildcard",
        pattern: A
    };
    return {
        type: "exact",
        command: A
    }
}
// @from(Ln 443073, Col 0)
function i_q(A) {
    let K = A.split(`
`).filter((Y) => {
        let z = Y.trim();
        return z !== "" && !z.startsWith("#")
    });
    if (K.length === 0) return A;
    return K.join(`
`)
}
// @from(Ln 443084, Col 0)
function VmA(A) {
    let q = [/^timeout\s+\d+[smhd]?\s+/, /^time\s+/, /^nice\s+-n\s+-?\d+\s+/, /^nohup\s+/],
        K = /^([A-Za-z_][A-Za-z0-9_]*)=([A-Za-z0-9_./:-]+)\s+/,
        Y = A,
        z = "";
    while (Y !== z) {
        z = Y, Y = i_q(Y);
        let w = Y.match(K);
        if (w) {
            let H = w[1],
                $ = !1;
            if (vzz.has(H)) Y = Y.replace(K, "")
        }
    }
    z = "";
    while (Y !== z) {
        z = Y, Y = i_q(Y);
        for (let w of q) Y = Y.replace(w, "")
    }
    return Y.trim()
}
// @from(Ln 443106, Col 0)
function kmA(A, q, K) {
    let Y = A.command.trim(),
        z = aI(Y).commandWithoutRedirections,
        H = (K === "exact" ? [Y, z] : [z]).flatMap(($) => {
            let O = VmA($);
            return O !== $ ? [$, O] : [$]
        });
    return Array.from(q.entries()).filter(([$]) => {
        let O = ymA($);
        return H.some((_) => {
            switch (O.type) {
                case "exact":
                    return O.command === _;
                case "prefix":
                    switch (K) {
                        case "exact":
                            return O.prefix === _;
                        case "prefix":
                            if (_ === O.prefix) return !0;
                            return _.startsWith(O.prefix + " ")
                    }
                    break;
                case "wildcard":
                    if (K === "exact") return !1;
                    return RmA(O.pattern, _)
            }
        })
    }).map(([, $]) => $)
}
// @from(Ln 443136, Col 0)
function CmA(A, q, K) {
    let Y = XI(q, qq, "deny"),
        z = kmA(A, Y, K),
        w = XI(q, qq, "ask"),
        H = kmA(A, w, K),
        $ = XI(q, qq, "allow"),
        O = kmA(A, $, K);
    return {
        matchingDenyRules: z,
        matchingAskRules: H,
        matchingAllowRules: O
    }
}
// @from(Ln 443150, Col 0)
function n_q(A, q, K, Y) {
    let z = SmA(A, q);
    if (z.behavior !== "passthrough") return z;
    let w = o_q(A, q, Y);
    if (w.behavior === "deny" || w.behavior === "ask") return w;
    if (!J6(process.env.CLAUDE_CODE_DISABLE_COMMAND_INJECTION_CHECK)) {
        let $ = lm(A.command);
        if ($.behavior !== "passthrough") {
            let O = {
                type: "other",
                reason: $.behavior === "ask" && $.message ? $.message : "This command contains patterns that could pose security risks and requires approval"
            };
            return {
                behavior: "ask",
                message: d_(qq.name, O),
                decisionReason: O,
                suggestions: []
            }
        }
    }
    if (w.behavior === "allow") return w;
    let H = K?.commandPrefix ? r_q(K.commandPrefix) : NT6(A.command);
    return {
        ...w,
        suggestions: H
    }
}
// @from(Ln 443178, Col 0)
function Ezz(A, q) {
    let K = A.command.trim(),
        {
            matchingDenyRules: Y,
            matchingAskRules: z
        } = CmA(A, q, "prefix");
    if (Y[0] !== void 0) return {
        behavior: "deny",
        message: `Permission to use ${qq.name} with command ${K} has been denied.`,
        decisionReason: {
            type: "rule",
            rule: Y[0]
        }
    };
    if (z[0] !== void 0) return {
        behavior: "ask",
        message: d_(qq.name),
        decisionReason: {
            type: "rule",
            rule: z[0]
        }
    };
    return {
        behavior: "allow",
        updatedInput: A,
        decisionReason: {
            type: "other",
            reason: "Auto-allowed with sandbox (autoAllowBashIfSandboxed enabled)"
        }
    }
}
// @from(Ln 443210, Col 0)
function g1q(A, q, K, Y) {
    if (!ne()) return !1;
    let z = Qd1(q);
    if (z.length === 0) return !1;
    let w = h6(),
        H = VT6(A, w, z, "allow", K, Y);
    return H.catch(() => {}), kzz.set(A, H), !0
}
// @from(Ln 443218, Col 0)
async function zmA(A, q, K = KmA) {
    let Y = await q.getAppState(),
        z = pz(A.command);
    if (!z.success) {
        let T = {
            type: "other",
            reason: `Command contains malformed syntax that cannot be parsed: ${z.error}`
        };
        return {
            behavior: "ask",
            decisionReason: T,
            message: d_(qq.name, T)
        }
    }
    if (b8.isSandboxingEnabled() && b8.isAutoAllowBashIfSandboxedEnabled() && Sc(A)) {
        let T = Ezz(A, Y.toolPermissionContext);
        if (T.behavior !== "passthrough") return T
    }
    let w = SmA(A, Y.toolPermissionContext);
    if (w.behavior === "deny") return w;
    let H = !1;
    if (ne() && !H) {
        let T = EmA(Y.toolPermissionContext),
            k = U_q(Y.toolPermissionContext),
            y = T.length > 0,
            B = k.length > 0;
        if (y || B) {
            let [S, m] = await Promise.all([y ? VT6(A.command, h6(), T, "deny", q.abortController.signal, q.options.isNonInteractiveSession) : null, B ? VT6(A.command, h6(), k, "ask", q.abortController.signal, q.options.isNonInteractiveSession) : null]);
            if (q.abortController.signal.aborted) throw new dz;
            if (S) d_q(A.command, "deny", T, S);
            if (m) d_q(A.command, "ask", k, m);
            if (S?.matches && S.confidence === "high") return {
                behavior: "deny",
                message: `Denied by Bash prompt rule: "${S.matchedDescription}"`,
                decisionReason: {
                    type: "other",
                    reason: `Denied by Bash prompt rule: "${S.matchedDescription}"`
                }
            };
            if (m?.matches && m.confidence === "high") {
                let b = await K(A.command, q.abortController.signal, q.options.isNonInteractiveSession);
                if (q.abortController.signal.aborted) throw new dz;
                let g = b?.commandPrefix ? r_q(b.commandPrefix) : NT6(A.command);
                return {
                    behavior: "ask",
                    message: d_(qq.name),
                    decisionReason: {
                        type: "other",
                        reason: `Required by Bash prompt rule: "${m.matchedDescription}"`
                    },
                    suggestions: g,
                    ...{}
                }
            }
        }
    }
    let $ = await y_q(A, (T) => zmA(T, q, K));
    if ($.behavior !== "passthrough") {
        if ($.behavior === "allow") {
            let T = lm(A.command);
            if (T.behavior !== "passthrough" && T.behavior !== "allow") return Y = await q.getAppState(), {
                behavior: "ask",
                message: d_(qq.name, {
                    type: "other",
                    reason: T.message ?? "Command contains patterns that require approval"
                }),
                decisionReason: {
                    type: "other",
                    reason: T.message ?? "Command contains patterns that require approval"
                },
                ...{}
            };
            Y = await q.getAppState();
            let k = fT6(A, h6(), Y.toolPermissionContext, !1);
            if (k.behavior !== "passthrough") return k
        }
        if ($.behavior === "ask") return Y = await q.getAppState(), {
            ...$,
            ...{}
        };
        return $
    }
    if (!J6(process.env.CLAUDE_CODE_DISABLE_COMMAND_INJECTION_CHECK)) {
        let T = lm(A.command);
        if (T.behavior === "ask" && T.message?.includes("${")) {
            Y = await q.getAppState();
            let k = {
                type: "other",
                reason: T.message
            };
            return {
                behavior: "ask",
                message: d_(qq.name, k),
                decisionReason: k,
                suggestions: [],
                ...{}
            }
        }
    }
    let O = AD(A.command).filter((T) => {
            if (T === `cd ${h6()}`) return !1;
            return !0
        }),
        _ = O.filter((T) => Sd1.test(T));
    if (_.length > 1) {
        let T = {
            type: "other",
            reason: "Multiple directory changes in one command require approval for clarity"
        };
        return {
            behavior: "ask",
            decisionReason: T,
            message: d_(qq.name, T)
        }
    }
    let J = _.length > 0;
    Y = await q.getAppState();
    let X = O.map((T) => {
        let k = Nzz(T, Y.toolPermissionContext);
        if (k !== null) return k;
        return o_q({
            command: T
        }, Y.toolPermissionContext, J)
    });
    if (X.find((T) => T.behavior === "deny") !== void 0) return {
        behavior: "deny",
        message: `Permission to use ${qq.name} with command ${A.command} has been denied.`,
        decisionReason: {
            type: "subcommandResults",
            reasons: new Map(X.map((T, k) => [O[k], T]))
        }
    };
    let j = fT6(A, h6(), Y.toolPermissionContext, J);
    if (j.behavior !== "passthrough") return j;
    let M = X.find((T) => T.behavior === "ask");
    if (M !== void 0) return M;
    if (w.behavior === "allow") return w;
    let P = J6(process.env.CLAUDE_CODE_DISABLE_COMMAND_INJECTION_CHECK) ? !1 : O.some((T) => lm(T).behavior !== "passthrough");
    if (X.every((T) => T.behavior === "allow") && !P) return {
        behavior: "allow",
        updatedInput: A,
        decisionReason: {
            type: "subcommandResults",
            reasons: new Map(X.map((T, k) => [O[k], T]))
        }
    };
    let W = await K(A.command, q.abortController.signal, q.options.isNonInteractiveSession);
    if (q.abortController.signal.aborted) throw new dz;
    if (Y = await q.getAppState(), O.length === 1) {
        let T = n_q({
            command: O[0]
        }, Y.toolPermissionContext, W, J);
        if (T.behavior === "ask" || T.behavior === "passthrough") return {
            ...T,
            ...{}
        };
        return T
    }
    let G = new Map;
    for (let T of O) G.set(T, n_q({
        ...A,
        command: T
    }, Y.toolPermissionContext, W?.subcommandPrefixes.get(T), J));
    if (O.every((T) => {
            return G.get(T)?.behavior === "allow"
        })) return {
        behavior: "allow",
        updatedInput: A,
        decisionReason: {
            type: "subcommandResults",
            reasons: G
        }
    };
    let f = new Map;
    for (let T of G.values())
        if (T.behavior === "ask" || T.behavior === "passthrough") {
            let k = "suggestions" in T ? T.suggestions : void 0,
                y = I81(k);
            for (let B of y) {
                let S = M9(B);
                f.set(S, B)
            }
        } let Z = {
            type: "subcommandResults",
            reasons: G
        },
        N = f.size > 0 ? [{
            type: "addRules",
            rules: Array.from(f.values()),
            behavior: "allow",
            destination: "localSettings"
        }] : void 0;
    return {
        behavior: "passthrough",
        message: d_(qq.name, Z),
        decisionReason: Z,
        suggestions: N,
        ...{}
    }
}
// @from(Ln 443418, Col 4)
LmA = (A) => {
        return A.match(/^(.+):\*$/)?.[1] ?? null
    }
// @from(Ln 443421, Col 4)
vzz
// @from(Ln 443421, Col 9)
SmA = (A, q) => {
        let K = A.command.trim(),
            {
                matchingDenyRules: Y,
                matchingAskRules: z,
                matchingAllowRules: w
            } = CmA(A, q, "exact");
        if (Y[0] !== void 0) return {
            behavior: "deny",
            message: `Permission to use ${qq.name} with command ${K} has been denied.`,
            decisionReason: {
                type: "rule",
                rule: Y[0]
            }
        };
        if (z[0] !== void 0) return {
            behavior: "ask",
            message: d_(qq.name),
            decisionReason: {
                type: "rule",
                rule: z[0]
            }
        };
        if (w[0] !== void 0) return {
            behavior: "allow",
            updatedInput: A,
            decisionReason: {
                type: "rule",
                rule: w[0]
            }
        };
        let H = {
            type: "other",
            reason: "This command requires approval"
        };
        return {
            behavior: "passthrough",
            message: d_(qq.name, H),
            decisionReason: H,
            suggestions: NT6(K)
        }
    }
// @from(Ln 443463, Col 4)
o_q = (A, q, K) => {
        let Y = A.command.trim(),
            z = SmA(A, q);
        if (z.behavior === "deny" || z.behavior === "ask") return z;
        let {
            matchingDenyRules: w,
            matchingAskRules: H,
            matchingAllowRules: $
        } = CmA(A, q, "prefix");
        if (w[0] !== void 0) return {
            behavior: "deny",
            message: `Permission to use ${qq.name} with command ${Y} has been denied.`,
            decisionReason: {
                type: "rule",
                rule: w[0]
            }
        };
        if (H[0] !== void 0) return {
            behavior: "ask",
            message: d_(qq.name),
            decisionReason: {
                type: "rule",
                rule: H[0]
            }
        };
        let O = fT6(A, h6(), q, K);
        if (O.behavior !== "passthrough") return O;
        if (z.behavior === "allow") return z;
        if ($[0] !== void 0) return {
            behavior: "allow",
            updatedInput: A,
            decisionReason: {
                type: "rule",
                rule: $[0]
            }
        };
        let _ = D6q(A, q);
        if (_.behavior !== "passthrough") return _;
        let J = m_q(A, q);
        if (J.behavior !== "passthrough") return J;
        if (qq.isReadOnly(A)) return {
            behavior: "allow",
            updatedInput: A,
            decisionReason: {
                type: "other",
                reason: "Read-only command is allowed"
            }
        };
        let X = {
            type: "other",
            reason: "This command requires approval"
        };
        return {
            behavior: "passthrough",
            message: d_(qq.name, X),
            decisionReason: X,
            suggestions: NT6(Y)
        }
    }
// @from(Ln 443522, Col 4)
kzz
// @from(Ln 443523, Col 4)
km = v(() => {
    i0();
    xd1();
    k2();
    qf6();
    wG();
    M_();
    qH();
    N7();
    CO();
    PJ();
    C_q();
    hA();
    B_q();
    wG();
    F_q();
    Kf6();
    Tj();
    u6();
    m6();
    GV();
    vzz = new Set(["GOEXPERIMENT", "GOOS", "GOARCH", "CGO_ENABLED", "GO111MODULE", "RUST_BACKTRACE", "RUST_LOG", "NODE_ENV", "PYTHONUNBUFFERED", "PYTHONDONTWRITEBYTECODE", "PYTEST_DISABLE_PLUGIN_AUTOLOAD", "PYTEST_DEBUG", "ANTHROPIC_API_KEY", "LANG", "LANGUAGE", "LC_ALL", "LC_CTYPE", "LC_TIME", "CHARSET", "TERM", "COLORTERM", "NO_COLOR", "FORCE_COLOR", "TZ", "LS_COLORS", "LSCOLORS", "GREP_COLOR", "GREP_COLORS", "GCC_COLORS", "TIME_STYLE", "BLOCK_SIZE", "BLOCKSIZE"]);
    kzz = new Map
})
// @from(Ln 443548, Col 0)
function Lzz(A) {
    let K = C8().sandbox?.excludedCommands ?? [];
    if (K.length === 0) return !1;
    for (let Y of K) {
        let z = ymA(Y);
        switch (z.type) {
            case "exact":
                if (A.trim() === z.command) return !0;
                break;
            case "prefix": {
                let w = A.trim();
                if (w === z.prefix || w.startsWith(z.prefix + " ")) return !0;
                break
            }
            case "wildcard":
                if (RmA(z.pattern, A.trim())) return !0;
                break
        }
    }
    return !1
}
// @from(Ln 443570, Col 0)
function Sc(A) {
    if (!b8.isSandboxingEnabled()) return !1;
    if (A.dangerouslyDisableSandbox && b8.areUnsandboxedCommandsAllowed()) return !1;
    if (!A.command) return !1;
    if (Lzz(A.command)) return !1;
    return !0
}
// @from(Ln 443577, Col 4)
xd1 = v(() => {
    k2();
    p8();
    km();
    wG();
    U4()
})
// @from(Ln 443584, Col 4)
nk$
// @from(Ln 443584, Col 9)
rk$
// @from(Ln 443585, Col 4)
a_q = v(() => {
    i7();
    e7();
    Rg1();
    yw();
    m6();
    Z6();
    hA();
    nk$ = u.object({
        thinking: u.string(),
        matchedDescription: u.string(),
        userIntended: u.boolean(),
        shouldBlock: u.boolean(),
        confidence: u.enum(["high", "medium", "low"]),
        reason: u.string()
    }), rk$ = u.object({
        thinking: u.string(),
        matchedDescription: u.string(),
        shouldBlock: u.boolean(),
        confidence: u.enum(["high", "medium", "low"]),
        reason: u.string()
    })
})
// @from(Ln 443608, Col 4)
s_q = () => {}
// @from(Ln 443610, Col 0)
function Sx1(A) {
    return Ta1(A)
}
// @from(Ln 443614, Col 0)
function dD1(A) {
    return umA.flatMap((q) => (A.alwaysAllowRules[q] || []).map((K) => ({
        source: q,
        ruleBehavior: "allow",
        ruleValue: lP(K)
    })))
}
// @from(Ln 443622, Col 0)
function d_(A, q) {
    if (q) switch (q.type) {
        case "hook":
            return q.reason ? `Hook '${q.hookName}' blocked this action: ${q.reason}` : `Hook '${q.hookName}' requires approval for this ${A} command`;
        case "rule": {
            let Y = M9(q.rule.ruleValue),
                z = Sx1(q.rule.source);
            return `Permission rule '${Y}' from ${z} requires approval for this ${A} command`
        }
        case "subcommandResults": {
            let Y = [];
            for (let [z, w] of q.reasons)
                if (w.behavior === "ask" || w.behavior === "passthrough")
                    if (A === "Bash") {
                        let {
                            commandWithoutRedirections: H,
                            redirections: $
                        } = aI(z), O = $.length > 0 ? H : z;
                        Y.push(O)
                    } else Y.push(z);
            if (Y.length > 0) return `This ${A} command contains multiple operations. The following part${Y.length>1?"s":""} require${Y.length>1?"":"s"} approval: ${Y.join(", ")}`;
            return `This ${A} command contains multiple operations that require approval`
        }
        case "permissionPromptTool":
            return `Tool '${q.permissionPromptToolName}' requires approval for this ${A} command`;
        case "sandboxOverride":
            return "Run outside of the sandbox";
        case "workingDir":
            return q.reason;
        case "other":
            return q.reason;
        case "mode":
            return `Current permission mode (${CQ(q.mode)}) requires approval for this ${A} command`;
        case "asyncAgent":
            return q.reason
    }
    return `Claude requested permissions to use ${A}, but you haven't granted it yet.`
}
// @from(Ln 443661, Col 0)
function tU(A) {
    return umA.flatMap((q) => (A.alwaysDenyRules[q] || []).map((K) => ({
        source: q,
        ruleBehavior: "deny",
        ruleValue: lP(K)
    })))
}
// @from(Ln 443669, Col 0)
function cD1(A) {
    return umA.flatMap((q) => (A.alwaysAskRules[q] || []).map((K) => ({
        source: q,
        ruleBehavior: "ask",
        ruleValue: lP(K)
    })))
}
// @from(Ln 443677, Col 0)
function BmA(A, q) {
    if (q.ruleValue.ruleContent !== void 0) return !1;
    if (q.ruleValue.toolName === A.name) return !0;
    let K = VD(q.ruleValue.toolName),
        Y = VD(A.name);
    return K !== null && Y !== null && (K.toolName === void 0 || K.toolName === "*") && K.serverName === Y.serverName
}
// @from(Ln 443685, Col 0)
function hmA(A, q) {
    return dD1(A).find((K) => BmA(q, K)) || null
}
// @from(Ln 443689, Col 0)
function ImA(A, q) {
    return tU(A).find((K) => BmA(q, K)) || null
}
// @from(Ln 443693, Col 0)
function xmA(A, q) {
    return cD1(A).find((K) => BmA(q, K)) || null
}
// @from(Ln 443697, Col 0)
function cEA(A, q, K) {
    return tU(A).find((Y) => Y.ruleValue.toolName === q && Y.ruleValue.ruleContent === K) || null
}
// @from(Ln 443701, Col 0)
function pEA(A, q, K) {
    return A.filter((Y) => cEA(q, K, Y.agentType) === null)
}
// @from(Ln 443705, Col 0)
function XI(A, q, K) {
    return mmA(A, q.name, K)
}
// @from(Ln 443709, Col 0)
function mmA(A, q, K) {
    let Y = new Map,
        z = [];
    switch (K) {
        case "allow":
            z = dD1(A);
            break;
        case "deny":
            z = tU(A);
            break;
        case "ask":
            z = cD1(A);
            break
    }
    for (let w of z)
        if (w.ruleValue.toolName === q && w.ruleValue.ruleContent !== void 0 && w.ruleBehavior === K) Y.set(w.ruleValue.ruleContent, w);
    return Y
}
// @from(Ln 443727, Col 0)
async function Rzz(A, q, K, Y, z, w) {
    try {
        for await (let H of I51(A.name, K, q, Y, z, w, Y.abortController.signal)) {
            if (!H.permissionRequestResult) continue;
            let $ = H.permissionRequestResult;
            if ($.behavior === "allow") {
                let O = $.updatedInput ?? q;
                if ($.updatedPermissions?.length) nC($.updatedPermissions), Y.setAppState((_) => ({
                    ..._,
                    toolPermissionContext: WV(_.toolPermissionContext, $.updatedPermissions)
                }));
                return {
                    behavior: "allow",
                    updatedInput: O,
                    decisionReason: {
                        type: "hook",
                        hookName: "PermissionRequest"
                    }
                }
            }
            if ($.behavior === "deny") {
                if ($.interrupt) h(`Hook interrupt: tool=${A.name} hookMessage=${$.message}`), Y.abortController.abort();
                return {
                    behavior: "deny",
                    message: $.message || "Permission denied by hook",
                    decisionReason: {
                        type: "hook",
                        hookName: "PermissionRequest",
                        reason: $.message
                    }
                }
            }
        }
    } catch (H) {
        K1(H instanceof Error ? H : Error(`PermissionRequest hook failed for headless agent: ${String(H)}`))
    }
    return null
}
// @from(Ln 443765, Col 0)
async function yzz(A, q, K, Y) {
    if (K.abortController.signal.aborted) throw new dz;
    let z = await K.getAppState(),
        w = ImA(z.toolPermissionContext, A);
    if (w) return {
        behavior: "deny",
        decisionReason: {
            type: "rule",
            rule: w
        },
        message: `Permission to use ${A.name} has been denied.`
    };
    let H = xmA(z.toolPermissionContext, A);
    if (H) {
        if (!(A.name === h4 && b8.isSandboxingEnabled() && b8.isAutoAllowBashIfSandboxedEnabled() && Sc(q))) return {
            behavior: "ask",
            decisionReason: {
                type: "rule",
                rule: H
            },
            message: d_(A.name)
        }
    }
    let $ = {
        behavior: "passthrough",
        message: d_(A.name)
    };
    try {
        let X = A.inputSchema.parse(q);
        $ = await A.checkPermissions(X, K)
    } catch (X) {
        if (X instanceof dz || X instanceof Oz) throw X;
        K1(X)
    }
    if ($?.behavior === "deny") return $;
    if (A.requiresUserInteraction?.() && $?.behavior === "ask") return $;
    if (z = await K.getAppState(), z.toolPermissionContext.mode === "bypassPermissions" || z.toolPermissionContext.mode === "plan" && z.toolPermissionContext.isBypassPermissionsModeAvailable) return {
        behavior: "allow",
        updatedInput: t_q($, q),
        decisionReason: {
            type: "mode",
            mode: z.toolPermissionContext.mode
        }
    };
    let _ = hmA(z.toolPermissionContext, A);
    if (_) return {
        behavior: "allow",
        updatedInput: t_q($, q),
        decisionReason: {
            type: "rule",
            rule: _
        }
    };
    let J = $.behavior === "passthrough" ? {
        ...$,
        behavior: "ask",
        message: d_(A.name, $.decisionReason)
    } : $;
    if (J.behavior === "ask" && J.suggestions) h(`Permission suggestions for ${A.name}: ${Q1(J.suggestions,null,2)}`);
    return J
}
// @from(Ln 443826, Col 0)
async function bzq({
    rule: A,
    initialContext: q,
    setToolPermissionContext: K
}) {
    if (A.source === "policySettings" || A.source === "flagSettings" || A.source === "command") throw Error("Cannot delete permission rules from read-only settings");
    let Y = a2(q, {
        type: "removeRules",
        rules: [A.ruleValue],
        behavior: A.ruleBehavior,
        destination: A.source
    });
    switch (A.source) {
        case "localSettings":
        case "userSettings":
        case "projectSettings": {
            Rr8(A);
            break
        }
        case "cliArg":
        case "session":
            break
    }
    K(Y)
}
// @from(Ln 443852, Col 0)
function e_q(A, q) {
    let K = new Map;
    for (let z of A) {
        let w = `${z.source}:${z.ruleBehavior}`;
        if (!K.has(w)) K.set(w, []);
        K.get(w).push(z.ruleValue)
    }
    let Y = [];
    for (let [z, w] of K) {
        let [H, $] = z.split(":");
        Y.push({
            type: q,
            rules: w,
            behavior: $,
            destination: H
        })
    }
    return Y
}
// @from(Ln 443872, Col 0)
function AJq(A, q) {
    let K = e_q(q, "addRules");
    return WV(A, K)
}
// @from(Ln 443877, Col 0)
function pk7(A, q) {
    let K = A;
    if (pR1()) {
        let z = ["userSettings", "projectSettings", "localSettings", "cliArg", "session"],
            w = ["allow", "deny", "ask"];
        for (let H of z)
            for (let $ of w) K = a2(K, {
                type: "replaceRules",
                rules: [],
                behavior: $,
                destination: H
            })
    }
    let Y = e_q(q, "replaceRules");
    return WV(K, Y)
}
// @from(Ln 443894, Col 0)
function t_q(A, q) {
    return ("updatedInput" in A ? A.updatedInput : void 0) ?? q
}
// @from(Ln 443897, Col 4)
umA
// @from(Ln 443897, Col 9)
uX = async (A, q, K, Y, z) => {
    let w = await yzz(A, q, K, Y);
    if (w.behavior === "allow") {
        let H = await K.getAppState();
        return w
    }
    if (w.behavior === "ask") {
        let H = await K.getAppState();
        if (H.toolPermissionContext.mode === "dontAsk") return {
            behavior: "deny",
            decisionReason: {
                type: "mode",
                mode: "dontAsk"
            },
            message: bmA(A.name)
        };
        if (H.toolPermissionContext.shouldAvoidPermissionPrompts) {
            let $ = await Rzz(A, q, z, K, H.toolPermissionContext.mode, w.suggestions);
            if ($) return $;
            return {
                behavior: "deny",
                decisionReason: {
                    type: "asyncAgent",
                    reason: "Permission prompts are not available in this context"
                },
                message: bmA(A.name)
            }
        }
    }
    return w
}
// @from(Ln 443928, Col 4)
PJ = v(() => {
    CO();
    qH();
    GV();
    y6();
    Z6();
    KL();
    E$();
    _T();
    xd1();
    k2();
    oj();
    wG();
    m6();
    a_q();
    B6();
    s_q();
    N8();
    aM();
    u6();
    U$();
    umA = [...gf, "cliArg", "command", "session"]
})
// @from(Ln 443955, Col 0)
function Szz(A) {
    let q = A.join(" ").trim();
    if (Oi4(q)) return rRA();
    return hd(A)
}
// @from(Ln 443961, Col 0)
function hzz({
    processPwd: A,
    originalCwd: q
}) {
    let {
        resolvedPath: K,
        isSymlink: Y
    } = QH(b1(), A);
    return Y ? K === Czz(q) : !1
}
// @from(Ln 443972, Col 0)
function qJq({
    permissionModeCli: A,
    dangerouslySkipPermissions: q,
    ...K
}) {
    let Y = C8() || {},
        z = i2("tengu_disable_bypass_permissions_mode"),
        w = Y.permissions?.disableBypassPermissionsMode === "disable",
        H = z || w,
        $ = [],
        O;
    if (q) $.push("bypassPermissions");
    if (A) $.push(jC(A));
    if (Y.permissions?.defaultMode) $.push(Y.permissions.defaultMode);
    let _;
    for (let J of $) {
        if (J === "bypassPermissions" && H) {
            if (z) h("bypassPermissions mode is disabled by Statsig gate", {
                level: "warn"
            }), O = "Bypass permissions mode was disabled by your organization policy";
            else h("bypassPermissions mode is disabled by settings", {
                level: "warn"
            }), O = "Bypass permissions mode was disabled by settings";
            continue
        }
        if (J === "delegate" && !l8()) {
            h("delegate mode requested but agent swarms not enabled, falling back", {
                level: "warn"
            });
            continue
        }
        _ = {
            mode: J,
            notification: O
        };
        break
    }
    if (!_) _ = {
        mode: "default",
        notification: O
    };
    return _
}
// @from(Ln 444016, Col 0)
function hd(A) {
    if (A.length === 0) return [];
    let q = [];
    for (let K of A) {
        if (!K) continue;
        let Y = "",
            z = !1;
        for (let w of K) switch (w) {
            case "(":
                z = !0, Y += w;
                break;
            case ")":
                z = !1, Y += w;
                break;
            case ",":
                if (z) Y += w;
                else {
                    if (Y.trim()) q.push(Y.trim());
                    Y = ""
                }
                break;
            case " ":
                if (z) Y += w;
                else if (Y.trim()) q.push(Y.trim()), Y = "";
                break;
            default:
                Y += w
        }
        if (Y.trim()) q.push(Y.trim())
    }
    return q
}
// @from(Ln 444049, Col 0)
function KJq({
    allowedToolsCli: A,
    disallowedToolsCli: q,
    baseToolsCli: K,
    permissionMode: Y,
    allowDangerouslySkipPermissions: z,
    addDirs: w
}) {
    let H = hd(A),
        $ = hd(q);
    if (K && K.length > 0) {
        let Z = Szz(K),
            N = new Set(Z),
            k = rRA().filter((y) => !N.has(y));
        $ = [...$, ...k]
    }
    let O = [],
        _ = new Map,
        J = process.env.PWD;
    if (J && J !== y8() && hzz({
            originalCwd: y8(),
            processPwd: J
        })) _.set(J, {
        path: J,
        source: "session"
    });
    let X = i2("tengu_disable_bypass_permissions_mode"),
        D = C8() || {},
        j = D.permissions?.disableBypassPermissionsMode === "disable",
        M = (Y === "bypassPermissions" || z) && !X && !j,
        P = Q76(),
        W = [],
        G = AJq({
            mode: Y,
            additionalWorkingDirectories: _,
            alwaysAllowRules: {
                cliArg: H
            },
            alwaysDenyRules: {
                cliArg: $
            },
            alwaysAskRules: {},
            isBypassPermissionsModeAvailable: M
        }, P),
        f = [...D.permissions?.additionalDirectories || [], ...w];
    for (let Z of f) {
        let N = cG1(Z, G);
        if (N.resultType === "success") G = a2(G, {
            type: "addDirectories",
            directories: [N.absolutePath],
            destination: "cliArg"
        });
        else if (N.resultType !== "alreadyInWorkingDirectory" && N.resultType !== "pathNotFound") O.push(lG1(N))
    }
    return {
        toolPermissionContext: G,
        warnings: O,
        dangerousPermissions: W
    }
}
// @from(Ln 444109, Col 0)
async function QmA() {
    return zJq("tengu_disable_bypass_permissions_mode")
}
// @from(Ln 444113, Col 0)
function rD1() {
    let A = i2("tengu_disable_bypass_permissions_mode"),
        K = (C8() || {}).permissions?.disableBypassPermissionsMode === "disable";
    return A || K
}
// @from(Ln 444119, Col 0)
function oD1(A) {
    let q = A;
    if (A.mode === "bypassPermissions") q = a2(A, {
        type: "setMode",
        mode: "default",
        destination: "session"
    });
    return {
        ...q,
        isBypassPermissionsModeAvailable: !1
    }
}
// @from(Ln 444131, Col 0)
async function YJq(A) {
    if (!A.isBypassPermissionsModeAvailable) return;
    if (!await QmA()) return;
    h("bypassPermissions mode is being disabled by Statsig gate (async check)", {
        level: "warn"
    }), nK(1, "bypass_permissions_disabled")
}
// @from(Ln 444138, Col 4)
qp = v(() => {
    PJ();
    KL();
    oj();
    B6();
    p8();
    E$();
    vf6();
    CO();
    _8();
    U4();
    Z6();
    w$();
    $P();
    S9()
})
// @from(Ln 444173, Col 0)
function vp(A, q = "Custom item") {
    let K = A.split(`
`);
    for (let Y of K) {
        let z = Y.trim();
        if (z) {
            let H = z.match(/^#+\s+(.+)$/)?.[1] ?? z;
            return H.length > 100 ? H.substring(0, 97) + "..." : H
        }
    }
    return q
}
// @from(Ln 444186, Col 0)
function $Jq(A) {
    if (A === void 0 || A === null) return null;
    if (!A) return [];
    let q = [];
    if (typeof A === "string") q = [A];
    else if (Array.isArray(A)) q = A.filter((Y) => typeof Y === "string");
    if (q.length === 0) return [];
    let K = hd(q);
    if (K.includes("*")) return ["*"];
    return K
}
// @from(Ln 444198, Col 0)
function HK1(A) {
    let q = $Jq(A);
    if (q === null) return A === void 0 ? void 0 : [];
    if (q.includes("*")) return;
    return q
}
// @from(Ln 444205, Col 0)
function Vh(A) {
    let q = $Jq(A);
    if (q === null) return [];
    return q
}
// @from(Ln 444210, Col 0)
async function Fzz(A) {
    try {
        let q = await uzz(A, {
            bigint: !0
        });
        return `${q.dev}:${q.ino}`
    } catch {
        return null
    }
}
// @from(Ln 444221, Col 0)
function FkA(A, q) {
    let K = wJq(mzz()).normalize("NFC"),
        Y = YX(q),
        z = wJq(q),
        w = [];
    if (!UmA(z)) return w;
    while (!0) {
        if (z === K) break;
        let H = TT6(z, ".claude", A);
        if (UmA(H)) w.push(H);
        if (Y && z === Y) break;
        let $ = Izz(z);
        if ($ === z) break;
        z = $
    }
    return w
}
// @from(Ln 444238, Col 0)
async function Qzz(A, q) {
    let K = [],
        Y = new Set;
    async function z(w) {
        if (q.aborted) return;
        try {
            let H = await HJq(w, {
                bigint: !0
            });
            if (H.isDirectory()) {
                let $ = H.dev !== void 0 && H.ino !== void 0 ? `${H.dev}:${H.ino}` : await Bzz(w);
                if (Y.has($)) {
                    h(`Skipping already visited directory (circular symlink): ${w}`);
                    return
                }
                Y.add($)
            }
        } catch (H) {
            let $ = H instanceof Error ? H.message : String(H);
            h(`Failed to stat directory ${w}: ${$}`);
            return
        }
        try {
            let H = await xzz(w, {
                withFileTypes: !0
            });
            for (let $ of H) {
                if (q.aborted) break;
                let O = TT6(w, $.name);
                try {
                    if ($.isSymbolicLink()) try {
                            let _ = await HJq(O);
                            if (_.isDirectory()) await z(O);
                            else if (_.isFile() && $.name.endsWith(".md")) K.push(O)
                        } catch (_) {
                            let J = _ instanceof Error ? _.message : String(_);
                            h(`Failed to follow symlink ${O}: ${J}`)
                        } else if ($.isDirectory()) await z(O);
                        else if ($.isFile() && $.name.endsWith(".md")) K.push(O)
                } catch (_) {
                    let J = _ instanceof Error ? _.message : String(_);
                    h(`Failed to access ${O}: ${J}`)
                }
            }
        } catch (H) {
            let $ = H instanceof Error ? H.message : String(H);
            h(`Failed to read directory ${w}: ${$}`)
        }
    }
    return await z(A), K
}
// @from(Ln 444289, Col 0)
async function gmA(A) {
    let q = Aq(),
        K = setTimeout(() => q.abort(), 3000);
    try {
        if (!UmA(A)) return [];
        let z = J6(process.env.CLAUDE_CODE_USE_NATIVE_FILE_SEARCH) ? await Qzz(A, q.signal) : await lx(["--files", "--hidden", "--follow", "--no-ignore", "--glob", "*.md"], A, q.signal);
        return (await Promise.all(z.map(async (H) => {
            try {
                let $ = await bzz(H, {
                        encoding: "utf-8"
                    }),
                    {
                        frontmatter: O,
                        content: _
                    } = yD($, H);
                return {
                    filePath: H,
                    frontmatter: O,
                    content: _
                }
            } catch ($) {
                let O = $ instanceof Error ? $.message : String($);
                return h(`Failed to read/parse markdown file:  ${H}: ${O}`), null
            }
        }))).filter((H) => H !== null)
    } finally {
        clearTimeout(K)
    }
}
// @from(Ln 444318, Col 4)
UAq
// @from(Ln 444318, Col 9)
Qp
// @from(Ln 444319, Col 4)
Ep = v(() => {
    ix();
    Lg();
    qp();
    Z6();
    G2();
    hA();
    $A1();
    u6();
    E$();
    zq();
    h9();
    UAq = ["commands", "agents", "output-styles", "skills"];
    Qp = KA(async function(A, q) {
        let K = Date.now(),
            Y = TT6(O8(), A),
            z = TT6(df(), ".claude", A),
            w = FkA(A, q),
            [H, $, O] = await Promise.all([gmA(z).then((P) => P.map((W) => ({
                ...W,
                baseDir: z,
                source: "policySettings"
            }))), qX("userSettings") ? gmA(Y).then((P) => P.map((W) => ({
                ...W,
                baseDir: Y,
                source: "userSettings"
            }))) : Promise.resolve([]), qX("projectSettings") ? Promise.all(w.map((P) => gmA(P).then((W) => W.map((G) => ({
                ...G,
                baseDir: P,
                source: "projectSettings"
            }))))) : Promise.resolve([])]),
            _ = O.flat(),
            J = [...H, ...$, ..._],
            X = await Promise.all(J.map((P) => Fzz(P.filePath))),
            D = new Map,
            j = [];
        for (let [P, W] of J.entries()) {
            let G = X[P] ?? null;
            if (G === null) {
                j.push(W);
                continue
            }
            let f = D.get(G);
            if (f !== void 0) {
                h(`Skipping duplicate file '${W.filePath}' from ${W.source} (same inode already loaded from ${f})`);
                continue
            }
            D.set(G, W.source), j.push(W)
        }
        let M = J.length - j.length;
        if (M > 0) h(`Deduplicated ${M} files in ${A} (same inode via symlinks or hard links)`);
        return c("tengu_dir_search", {
            durationMs: Date.now() - K,
            managedFilesFound: H.length,
            userFilesFound: $.length,
            projectFilesFound: _.length,
            projectDirsSearched: w.length,
            subdir: A
        }), j
    }, (A, q) => `${A}:${q}`)
})
// @from(Ln 444383, Col 4)
OJq
// @from(Ln 444384, Col 4)
_Jq = v(() => {
    zq();
    y6();
    Ep();
    oO6();
    Z6();
    OJq = KA(async (A) => {
        try {
            return (await Qp("output-styles", A)).map(({
                filePath: Y,
                frontmatter: z,
                content: w,
                source: H
            }) => {
                try {
                    let O = gzz(Y).replace(/\.md$/, ""),
                        _ = z.name || O,
                        J = z.description || vp(w, `Custom ${O} output style`),
                        X = z["keep-coding-instructions"],
                        D = X === !0 || X === "true" ? !0 : X === !1 || X === "false" ? !1 : void 0;
                    if (z["force-for-plugin"] !== void 0) h(`Output style "${_}" has force-for-plugin set, but this option only applies to plugin output styles. Ignoring.`, {
                        level: "warn"
                    });
                    return {
                        name: _,
                        description: J,
                        prompt: w.trim(),
                        source: H,
                        keepCodingInstructions: D
                    }
                } catch ($) {
                    return K1($ instanceof Error ? $ : Error(String($))), null
                }
            }).filter((Y) => Y !== null)
        } catch (q) {
            return K1(q instanceof Error ? q : Error(String(q))), []
        }
    })
})
// @from(Ln 444423, Col 0)
async function V91(A) {
    let q = await OJq(A),
        K = await U0A(),
        Y = {
            ...D51
        },
        z = q.filter((O) => O.source === "policySettings"),
        w = q.filter((O) => O.source === "userSettings"),
        H = q.filter((O) => O.source === "projectSettings"),
        $ = [K, w, H, z];
    for (let O of $)
        for (let _ of O) Y[_.name] = {
            name: _.name,
            description: _.description,
            prompt: _.prompt,
            source: _.source,
            keepCodingInstructions: _.keepCodingInstructions,
            forceForPlugin: _.forceForPlugin
        };
    return Y
}
// @from(Ln 444444, Col 0)
async function rBA() {
    let A = await V91(h6()),
        q = Object.values(A).filter((w) => w !== null && w.source === "plugin" && w.forceForPlugin === !0),
        K = q[0];
    if (K) {
        if (q.length > 1) h(`Multiple plugins have forced output styles: ${q.map((w)=>w.name).join(", ")}. Using: ${K.name}`, {
            level: "warn"
        });
        return h(`Using forced plugin output style: ${K.name}`), K
    }
    let z = C8()?.outputStyle || Wj;
    return A[z] ?? null
}
// @from(Ln 444457, Col 4)
JJq
// @from(Ln 444457, Col 9)
Wj = "default"
// @from(Ln 444458, Col 4)
D51
// @from(Ln 444459, Col 4)
Em = v(() => {
    b7();
    p8();
    _Jq();
    oO6();
    N7();
    Z6();
    JJq = `
## Insights
In order to encourage learning, before and after writing code, always provide brief educational explanations about implementation choices using (with backticks):
"\`${l1.star} Insight ─────────────────────────────────────\`
[2-3 key educational points]
\`─────────────────────────────────────────────────\`"

These insights should be included in the conversation, not in the codebase. You should generally focus on interesting insights that are specific to the codebase or the code you just wrote, rather than general programming concepts.`, D51 = {
        [Wj]: null,
        Explanatory: {
            name: "Explanatory",
            source: "built-in",
            description: "Claude explains its implementation choices and codebase patterns",
            keepCodingInstructions: !0,
            prompt: `You are an interactive CLI tool that helps users with software engineering tasks. In addition to software engineering tasks, you should provide educational insights about the codebase along the way.

You should be clear and educational, providing helpful explanations while remaining focused on the task. Balance educational content with task completion. When providing insights, you may exceed typical length constraints, but remain focused and relevant.

# Explanatory Style Active
${JJq}`
        },
        Learning: {
            name: "Learning",
            source: "built-in",
            description: "Claude pauses and asks you to write small pieces of code for hands-on practice",
            keepCodingInstructions: !0,
            prompt: `You are an interactive CLI tool that helps users with software engineering tasks. In addition to software engineering tasks, you should help users learn more about the codebase through hands-on practice and educational insights.

You should be collaborative and encouraging. Balance task completion with learning by requesting user input for meaningful design decisions while handling routine implementation yourself.   

# Learning Style Active
## Requesting Human Contributions
In order to encourage learning, ask the human to contribute 2-10 line code pieces when generating 20+ lines involving:
- Design decisions (error handling, data structures)
- Business logic with multiple valid approaches  
- Key algorithms or interface definitions

**TodoList Integration**: If using a TodoList for the overall task, include a specific todo item like "Request human input on [specific decision]" when planning to request human input. This ensures proper task tracking. Note: TodoList is not required for all tasks.

Example TodoList flow:
   ✓ "Set up component structure with placeholder for logic"
   ✓ "Request human collaboration on decision logic implementation"
   ✓ "Integrate contribution and complete feature"

### Request Format
\`\`\`
${l1.bullet} **Learn by Doing**
**Context:** [what's built and why this decision matters]
**Your Task:** [specific function/section in file, mention file and TODO(human) but do not include line numbers]
**Guidance:** [trade-offs and constraints to consider]
\`\`\`

### Key Guidelines
- Frame contributions as valuable design decisions, not busy work
- You must first add a TODO(human) section into the codebase with your editing tools before making the Learn by Doing request      
- Make sure there is one and only one TODO(human) section in the code
- Don't take any action or output anything after the Learn by Doing request. Wait for human implementation before proceeding.

### Example Requests

**Whole Function Example:**
\`\`\`
${l1.bullet} **Learn by Doing**

**Context:** I've set up the hint feature UI with a button that triggers the hint system. The infrastructure is ready: when clicked, it calls selectHintCell() to determine which cell to hint, then highlights that cell with a yellow background and shows possible values. The hint system needs to decide which empty cell would be most helpful to reveal to the user.

**Your Task:** In sudoku.js, implement the selectHintCell(board) function. Look for TODO(human). This function should analyze the board and return {row, col} for the best cell to hint, or null if the puzzle is complete.

**Guidance:** Consider multiple strategies: prioritize cells with only one possible value (naked singles), or cells that appear in rows/columns/boxes with many filled cells. You could also consider a balanced approach that helps without making it too easy. The board parameter is a 9x9 array where 0 represents empty cells.
\`\`\`

**Partial Function Example:**
\`\`\`
${l1.bullet} **Learn by Doing**

**Context:** I've built a file upload component that validates files before accepting them. The main validation logic is complete, but it needs specific handling for different file type categories in the switch statement.

**Your Task:** In upload.js, inside the validateFile() function's switch statement, implement the 'case "document":' branch. Look for TODO(human). This should validate document files (pdf, doc, docx).

**Guidance:** Consider checking file size limits (maybe 10MB for documents?), validating the file extension matches the MIME type, and returning {valid: boolean, error?: string}. The file object has properties: name, size, type.
\`\`\`

**Debugging Example:**
\`\`\`
${l1.bullet} **Learn by Doing**

**Context:** The user reported that number inputs aren't working correctly in the calculator. I've identified the handleInput() function as the likely source, but need to understand what values are being processed.

**Your Task:** In calculator.js, inside the handleInput() function, add 2-3 console.log statements after the TODO(human) comment to help debug why number inputs fail.

**Guidance:** Consider logging: the raw input value, the parsed result, and any validation state. This will help us understand where the conversion breaks.
\`\`\`

### After Contributions
Share one insight connecting their code to broader patterns or system effects. Avoid praise or repetition.

## Insights
${JJq}`
        }
    }
})
// @from(Ln 444571, Col 0)
function Uzz() {
    return H$(), ay(Lx4)
}
// @from(Ln 444575, Col 0)
function bmA(A) {
    return `Permission to use ${A} has been denied. ${pzz}`
}
// @from(Ln 444579, Col 0)
function zP6(A) {
    return A.type !== "progress" && A.type !== "attachment" && A.type !== "system" && Array.isArray(A.message.content) && A.message.content[0]?.type === "text" && DOA.has(A.message.content[0].text)
}
// @from(Ln 444583, Col 0)
function pmA(A) {
    return A.type === "assistant" && A.isApiErrorMessage === !0 && A.message.model === eD1
}
// @from(Ln 444587, Col 0)
function GN(A) {
    let q = A.filter((K) => K.type === "assistant");
    return gP(q)
}
// @from(Ln 444592, Col 0)
function cd1(A) {
    for (let q = A.length - 1; q >= 0; q--) {
        let K = A[q];
        if (K && K.type === "assistant") {
            let z = K.message.content;
            if (Array.isArray(z)) return z.some((w) => w.type === "tool_use")
        }
    }
    return !1
}
// @from(Ln 444603, Col 0)
function DJq({
    content: A,
    isApiErrorMessage: q = !1,
    apiError: K,
    error: Y,
    usage: z = {
        input_tokens: 0,
        output_tokens: 0,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 0,
        server_tool_use: {
            web_search_requests: 0,
            web_fetch_requests: 0
        },
        service_tier: null,
        cache_creation: {
            ephemeral_1h_input_tokens: 0,
            ephemeral_5m_input_tokens: 0
        },
        inference_geo: null,
        iterations: null
    }
}) {
    return {
        type: "assistant",
        uuid: _f(),
        timestamp: new Date().toISOString(),
        message: {
            id: _f(),
            container: null,
            model: eD1,
            role: "assistant",
            stop_reason: "stop_sequence",
            stop_sequence: "",
            type: "message",
            usage: z,
            content: A,
            context_management: null
        },
        requestId: void 0,
        apiError: K,
        error: Y,
        isApiErrorMessage: q
    }
}
// @from(Ln 444649, Col 0)
function qR({
    content: A,
    usage: q
}) {
    return DJq({
        content: typeof A === "string" ? [{
            type: "text",
            text: A === "" ? iv : A
        }] : A,
        usage: q
    })
}
// @from(Ln 444662, Col 0)
function pY({
    content: A,
    apiError: q,
    error: K
}) {
    return DJq({
        content: [{
            type: "text",
            text: A === "" ? iv : A
        }],
        isApiErrorMessage: !0,
        apiError: q,
        error: K
    })
}
// @from(Ln 444678, Col 0)
function c6({
    content: A,
    isMeta: q,
    isVisibleInTranscriptOnly: K,
    isCompactSummary: Y,
    summarizeMetadata: z,
    toolUseResult: w,
    mcpMeta: H,
    uuid: $,
    thinkingMetadata: O,
    timestamp: _,
    todos: J,
    imagePasteIds: X,
    sourceToolAssistantUUID: D,
    permissionMode: j
}) {
    return {
        type: "user",
        message: {
            role: "user",
            content: A || iv
        },
        isMeta: q,
        isVisibleInTranscriptOnly: K,
        isCompactSummary: Y,
        summarizeMetadata: z,
        uuid: $ ?? _f(),
        timestamp: _ ?? new Date().toISOString(),
        toolUseResult: w,
        mcpMeta: H,
        thinkingMetadata: O,
        todos: J,
        imagePasteIds: X,
        sourceToolAssistantUUID: D,
        permissionMode: j
    }
}
// @from(Ln 444716, Col 0)
function pZ({
    inputString: A,
    precedingInputBlocks: q
}) {
    if (q.length === 0) return A;
    return [...q, {
        text: A,
        type: "text"
    }]
}
// @from(Ln 444727, Col 0)
function FG1({
    toolUse: A = !1
}) {
    return c6({
        content: [{
            type: "text",
            text: A ? YN : ts
        }]
    })
}
// @from(Ln 444738, Col 0)
function wP() {
    return c6({
        content: `<${FI6}>Caveat: The messages below were generated by the user while running local commands. DO NOT respond to these messages or otherwise consider them in your response unless the user explicitly asks you to.</${FI6}>`,
        isMeta: !0
    })
}
// @from(Ln 444745, Col 0)
function U1q({
    toolUseID: A,
    parentToolUseID: q,
    data: K
}) {
    return {
        type: "progress",
        data: K,
        toolUseID: A,
        parentToolUseID: q,
        uuid: _f(),
        timestamp: new Date().toISOString()
    }
}
// @from(Ln 444760, Col 0)
function KhA(A) {
    return {
        type: "tool_result",
        content: _M1,
        is_error: !0,
        tool_use_id: A
    }
}
// @from(Ln 444769, Col 0)
function C4(A, q) {
    if (!A.trim() || !q.trim()) return null;
    let K = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        Y = new RegExp(`<${K}(?:\\s+[^>]*)?>([\\s\\S]*?)<\\/${K}>`, "gi"),
        z, w = 0,
        H = 0,
        $ = new RegExp(`<${K}(?:\\s+[^>]*?)?>`, "gi"),
        O = new RegExp(`<\\/${K}>`, "gi");
    while ((z = Y.exec(A)) !== null) {
        let _ = z[1],
            J = A.slice(H, z.index);
        w = 0, $.lastIndex = 0;
        while ($.exec(J) !== null) w++;
        O.lastIndex = 0;
        while (O.exec(J) !== null) w--;
        if (w === 0 && _) return _;
        H = z.index + z[0].length
    }
    return null
}
// @from(Ln 444790, Col 0)
function et(A) {
    if (A.type === "progress" || A.type === "attachment" || A.type === "system") return !0;
    if (typeof A.message.content === "string") return A.message.content.trim().length > 0;
    if (A.message.content.length === 0) return !1;
    if (A.message.content.length > 1) return !0;
    if (A.message.content[0].type !== "text") return !0;
    return A.message.content[0].text.trim().length > 0 && A.message.content[0].text !== iv && A.message.content[0].text !== YN
}
// @from(Ln 444799, Col 0)
function iO(A) {
    let q = !1;
    return A.flatMap((K) => {
        switch (K.type) {
            case "assistant":
                return q = q || K.message.content.length > 1, K.message.content.map((Y) => {
                    let z = q ? _f() : K.uuid;
                    return {
                        type: "assistant",
                        timestamp: K.timestamp,
                        message: {
                            ...K.message,
                            content: [Y],
                            context_management: K.message.context_management ?? null
                        },
                        isMeta: K.isMeta,
                        requestId: K.requestId,
                        uuid: z,
                        error: K.error,
                        isApiErrorMessage: K.isApiErrorMessage
                    }
                });
            case "attachment":
                return [K];
            case "progress":
                return [K];
            case "system":
                return [K];
            case "user": {
                if (typeof K.message.content === "string") {
                    let z = q ? _f() : K.uuid;
                    return [{
                        ...K,
                        uuid: z,
                        message: {
                            ...K.message,
                            content: [{
                                type: "text",
                                text: K.message.content
                            }]
                        }
                    }]
                }
                q = q || K.message.content.length > 1;
                let Y = 0;
                return K.message.content.map((z) => {
                    let w = z.type === "image",
                        H = w && K.imagePasteIds ? K.imagePasteIds[Y] : void 0;
                    if (w) Y++;
                    return {
                        ...c6({
                            content: [z],
                            toolUseResult: K.toolUseResult,
                            mcpMeta: K.mcpMeta,
                            isMeta: K.isMeta,
                            isVisibleInTranscriptOnly: K.isVisibleInTranscriptOnly,
                            timestamp: K.timestamp,
                            imagePasteIds: H !== void 0 ? [H] : void 0
                        }),
                        uuid: q ? _f() : K.uuid
                    }
                })
            }
        }
    })
}
// @from(Ln 444866, Col 0)
function XJq(A) {
    return A.type === "assistant" && A.message.content.some((q) => q.type === "tool_use")
}
// @from(Ln 444870, Col 0)
function jJq(A) {
    return A.type === "user" && (Array.isArray(A.message.content) && A.message.content[0]?.type === "tool_result" || Boolean(A.toolUseResult))
}
// @from(Ln 444874, Col 0)
function t9q(A, q) {
    let K = new Map;
    for (let H of A) {
        if (XJq(H)) {
            let $ = H.message.content[0]?.id;
            if ($) {
                if (!K.has($)) K.set($, {
                    toolUse: null,
                    preHooks: [],
                    toolResult: null,
                    postHooks: []
                });
                K.get($).toolUse = H
            }
            continue
        }
        if (dd1(H) && H.attachment.hookEvent === "PreToolUse") {
            let $ = H.attachment.toolUseID;
            if (!K.has($)) K.set($, {
                toolUse: null,
                preHooks: [],
                toolResult: null,
                postHooks: []
            });
            K.get($).preHooks.push(H);
            continue
        }
        if (H.type === "user" && H.message.content[0]?.type === "tool_result") {
            let $ = H.message.content[0].tool_use_id;
            if (!K.has($)) K.set($, {
                toolUse: null,
                preHooks: [],
                toolResult: null,
                postHooks: []
            });
            K.get($).toolResult = H;
            continue
        }
        if (dd1(H) && H.attachment.hookEvent === "PostToolUse") {
            let $ = H.attachment.toolUseID;
            if (!K.has($)) K.set($, {
                toolUse: null,
                preHooks: [],
                toolResult: null,
                postHooks: []
            });
            K.get($).postHooks.push(H);
            continue
        }
    }
    let Y = [],
        z = new Set;
    for (let H of A) {
        if (XJq(H)) {
            let $ = H.message.content[0]?.id;
            if ($ && !z.has($)) {
                z.add($);
                let O = K.get($);
                if (O && O.toolUse) {
                    if (Y.push(O.toolUse), Y.push(...O.preHooks), O.toolResult) Y.push(O.toolResult);
                    Y.push(...O.postHooks)
                }
            }
            continue
        }
        if (dd1(H) && (H.attachment.hookEvent === "PreToolUse" || H.attachment.hookEvent === "PostToolUse")) continue;
        if (H.type === "user" && H.message.content[0]?.type === "tool_result") continue;
        if (H.type === "system" && H.subtype === "api_error") {
            let $ = Y.at(-1);
            if ($?.type === "system" && $.subtype === "api_error") Y[Y.length - 1] = H;
            else Y.push(H);
            continue
        }
        Y.push(H)
    }
    for (let H of q) Y.push(H);
    let w = Y.at(-1);
    return Y.filter((H) => H.type !== "system" || H.subtype !== "api_error" || H === w)
}
// @from(Ln 444954, Col 0)
function dd1(A) {
    return A.type === "attachment" && (A.attachment.type === "hook_blocking_error" || A.attachment.type === "hook_cancelled" || A.attachment.type === "hook_error_during_execution" || A.attachment.type === "hook_non_blocking_error" || A.attachment.type === "hook_success" || A.attachment.type === "hook_system_message" || A.attachment.type === "hook_additional_context" || A.attachment.type === "hook_stopped_continuation")
}
// @from(Ln 444958, Col 0)
function e9q(A, q) {
    let K = new Map,
        Y = new Map,
        z = new Map;
    for (let j of q)
        if (j.type === "assistant") {
            let M = j.message.id,
                P = K.get(M);
            if (!P) P = new Set, K.set(M, P);
            for (let W of j.message.content)
                if (W.type === "tool_use") P.add(W.id), Y.set(W.id, M), z.set(W.id, W)
        } let w = new Map;
    for (let [j, M] of Y) w.set(j, K.get(M));
    let H = new Map,
        $ = new Map,
        O = new Map,
        _ = new Map,
        J = new Set,
        X = new Set;
    for (let j of A) {
        if (j.type === "progress") {
            let M = j.parentToolUseID,
                P = H.get(M);
            if (P) P.push(j);
            else H.set(M, [j]);
            if (j.data.type === "hook_progress") {
                let W = j.data.hookEvent,
                    G = $.get(M);
                if (!G) G = new Map, $.set(M, G);
                G.set(W, (G.get(W) ?? 0) + 1)
            }
        }
        if (j.type === "user") {
            for (let M of j.message.content)
                if (M.type === "tool_result") {
                    if (_.set(M.tool_use_id, j), J.add(M.tool_use_id), M.is_error) X.add(M.tool_use_id)
                }
        }
        if (dd1(j)) {
            let M = j.attachment.toolUseID,
                P = j.attachment.hookEvent,
                W = j.attachment.hookName;
            if (W !== void 0) {
                let G = O.get(M);
                if (!G) G = new Map, O.set(M, G);
                let f = G.get(P);
                if (!f) f = new Set, G.set(P, f);
                f.add(W)
            }
        }
    }
    let D = new Map;
    for (let [j, M] of O) {
        let P = new Map;
        for (let [W, G] of M) P.set(W, G.size);
        D.set(j, P)
    }
    return {
        siblingToolUseIDs: w,
        progressMessagesByToolUseID: H,
        inProgressHookCounts: $,
        resolvedHookCounts: D,
        toolResultByToolUseID: _,
        toolUseByToolUseID: z,
        normalizedMessageCount: A.length,
        resolvedToolUseIDs: J,
        erroredToolUseIDs: X
    }
}
// @from(Ln 445028, Col 0)
function a9q(A, q) {
    let K = Re(A);
    if (!K) return new Set;
    return q.siblingToolUseIDs.get(K) ?? new Set
}
// @from(Ln 445034, Col 0)
function s9q(A, q) {
    let K = Re(A);
    if (!K) return [];
    return q.progressMessagesByToolUseID.get(K) ?? []
}
// @from(Ln 445040, Col 0)
function AYq(A, q, K) {
    let Y = K.inProgressHookCounts.get(A)?.get(q) ?? 0,
        z = K.resolvedHookCounts.get(A)?.get(q) ?? 0;
    return Y > z
}
// @from(Ln 445046, Col 0)
function dzz(A) {
    let q = [],
        K = [];
    for (let Y = A.length - 1; Y >= 0; Y--) {
        let z = A[Y];
        if (z.type === "attachment") K.unshift(z);
        else if ((z.type === "assistant" || z.type === "user" && Array.isArray(z.message.content) && z.message.content[0]?.type === "tool_result") && K.length > 0) q.unshift(z, ...K), K.length = 0;
        else q.unshift(z)
    }
    return q.unshift(...K), q
}
// @from(Ln 445058, Col 0)
function Gb4(A) {
    return A.type === "system" && A.subtype === "local_command"
}