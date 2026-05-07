
// @from(Ln 497811, Col 0)
function neK(q, K, _, z = !1) {
    let Y = z ? ["## How to save memories", "", "Write each memory to its own file (e.g., `user_role.md`, `feedback_testing.md`) using this frontmatter format:", "", ...mh6, "", "- Keep the name, description, and type fields in memory files up-to-date with the content", "- Organize memory semantically by topic, not chronologically", "- Update or remove memories that turn out to be wrong or outdated", "- Do not write duplicate memories. First check if there is an existing memory you can update before writing a new one."] : ["## How to save memories", "", "Saving a memory is a two-step process:", "", "**Step 1** — write the memory to its own file (e.g., `user_role.md`, `feedback_testing.md`) using this frontmatter format:", "", ...mh6, "", `**Step 2** — add a pointer to that file in \`${YW}\`. \`${YW}\` is an index, not a memory — each entry should be one line, under ~150 characters: \`- [Title](file.md) — one-line hook\`. It has no frontmatter. Never write memory content directly into \`${YW}\`.`, "", `- \`${YW}\` is always loaded into your conversation context — lines after ${Ve} will be truncated, so keep the index concise`, "- Keep the name, description, and type fields in memory files up-to-date with the content", "- Organize memory semantically by topic, not chronologically", "- Update or remove memories that turn out to be wrong or outdated", "- Do not write duplicate memories. First check if there is an existing memory you can update before writing a new one."],
        A = [`# ${q}`, "", `You have a persistent, file-based memory system at \`${K}\`. ${FM6}`, "", "You should build up this memory system over time so that future conversations can have a complete picture of who the user is, how they'd like to collaborate with you, what behaviors to avoid or repeat, and the context behind the work the user gives you.", "", "If the user explicitly asks you to remember something, save it immediately as whichever type fits best. If they ask you to forget something, find and remove the relevant entry.", "", ...IC4, ...aH6, "", ...Y, "", ...xC4, "", ...sH6, "", "## Memory and other forms of persistence", "Memory is one of several persistence mechanisms available to you as you assist the user in a given conversation. The distinction is often that memory can be recalled in future conversations and should not be used for persisting information that is only useful within the scope of the current conversation.", "- When to use or update a plan instead of memory: If you are about to start a non-trivial implementation task and would like to reach alignment with the user on your approach you should use a Plan rather than saving this information to memory. Similarly, if you already have a plan within the conversation and you have changed your approach persist that change by updating the plan rather than saving a memory.", "- When to use or update tasks instead of memory: When you need to break your work in current conversation into discrete steps or keep track of your progress use tasks instead of saving to memory. Tasks are great for persisting information about the work that needs to be done in the current conversation, but memory should be reserved for information that will be useful in future conversations.", "", ..._ ?? [], ""];
    return A.push(...Dz8(K)), A
}
// @from(Ln 497817, Col 0)
function ieK(q) {
    let {
        displayName: K,
        memoryDir: _,
        extraGuidelines: z
    } = q, Y = V8(), A = _ + YW, O = "";
    try {
        O = Y.readFileSync(A, {
            encoding: "utf-8"
        })
    } catch {}
    let w = neK(K, _, z);
    if (O.trim()) {
        let $ = eU1(O),
            j = K === ptY ? "auto" : "agent";
        TW6(_, {
            content_length: $.byteCount,
            line_count: $.lineCount,
            was_truncated: $.wasLineTruncated,
            was_byte_truncated: $.wasByteTruncated,
            memory_type: j
        }), w.push(`## ${YW}`, "", $.content)
    } else w.push(`## ${YW}`, "", `Your ${YW} is currently empty. When you save new memories, they will appear here.`);
    return w.join(`
`)
}
// @from(Ln 497844, Col 0)
function Dz8(q) {
    if (!u8("tengu_coral_fern", !1)) return [];
    let K = e2(Y7()),
        _ = $H() || JJ(),
        z = _ ? `grep -rn "<search term>" ${q} --include="*.md"` : `${a5} with pattern="<search term>" path="${q}" glob="*.md"`,
        Y = _ ? `grep -rn "<search term>" ${K}/ --include="*.jsonl"` : `${a5} with pattern="<search term>" path="${K}/" glob="*.jsonl"`;
    return ["## Searching past context", "", "When looking for past context:", "1. Search topic files in your memory directory:", "```", z, "```", "2. Session transcript logs (last resort — large files, slow):", "```", Y, "```", "Use narrow search terms (error messages, file paths, function names) rather than broad keywords.", ""]
}
// @from(Ln 497852, Col 0)
async function fz8() {
    let q = x3(),
        K = u8("tengu_moth_copse", !1),
        _ = process.env.CLAUDE_COWORK_MEMORY_EXTRA_GUIDELINES,
        z = _ && _.trim().length > 0 ? [_] : void 0;
    if (q && wH()) {
        let Y = Nw();
        if (Ka8.isTeamMemoryEnabled()) {
            let O = Ka8.getTeamMemPath();
            return await Iu6(O), TW6(Y, {
                memory_type: "auto"
            }), TW6(O, {
                memory_type: "team"
            }), ZkK(Y, O, Dz8(Y), z)
        }
        return await Iu6(Y), TW6(Y, {
            memory_type: "auto"
        }), DkK("auto memory", Y, Dz8(Y), z).join(`
`)
    }
    if (Ka8.isTeamMemoryEnabled()) {
        let Y = Nw(),
            A = Ka8.getTeamMemPath();
        return await Iu6(A), TW6(Y, {
            memory_type: "auto"
        }), TW6(A, {
            memory_type: "team"
        }), FtY.buildCombinedMemoryPrompt(z, K)
    }
    if (q) {
        let Y = Nw();
        return await Iu6(Y), TW6(Y, {
            memory_type: "auto"
        }), neK("auto memory", Y, z, K).join(`
`)
    }
    if (d("tengu_memdir_disabled", {
            disabled_by_env_var: S6(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY),
            disabled_by_setting: !S6(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY) && v7().autoMemoryEnabled === !1
        }), u8("tengu_herring_clock", !1)) d("tengu_team_memdir_disabled", {});
    return null
}
// @from(Ln 497894, Col 4)
Ka8
// @from(Ln 497894, Col 9)
Zz8 = 25000
// @from(Ln 497895, Col 4)
ptY = "auto memory"
// @from(Ln 497896, Col 4)
FtY
// @from(Ln 497897, Col 4)
sy6 = L(() => {
    Yq();
    VY();
    y8();
    B1();
    C8();
    jJ();
    EP();
    K8();
    pB();
    Q8();
    m8();
    c7();
    g4();
    a1();
    s88();
    w97();
    Ka8 = (ev(), B7(Tp));
    FtY = (leK(), B7(ceK))
})
// @from(Ln 497923, Col 0)
function UtY(q) {
    return q.replaceAll(":", "-")
}
// @from(Ln 497927, Col 0)
function reK(q) {
    if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) return D66(process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR, "projects", AP(zj(c9()) ?? c9()), "agent-memory-local", q) + xn;
    return D66(b8(), ".claude", "agent-memory-local", q) + xn
}
// @from(Ln 497932, Col 0)
function Jh6(q, K) {
    let _ = UtY(q);
    switch (K) {
        case "project":
            return D66(b8(), ".claude", "agent-memory", _) + xn;
        case "local":
            return reK(_);
        case "user":
            return D66(X46(), "agent-memory", _) + xn
    }
}
// @from(Ln 497944, Col 0)
function d38(q) {
    let K = gtY(q),
        _ = X46();
    if (K.startsWith(D66(_, "agent-memory") + xn)) return !0;
    if (K.startsWith(D66(b8(), ".claude", "agent-memory") + xn)) return !0;
    if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) {
        if (K.includes(xn + "agent-memory-local" + xn) && K.startsWith(D66(process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR, "projects") + xn)) return !0
    } else if (K.startsWith(D66(b8(), ".claude", "agent-memory-local") + xn)) return !0;
    return !1
}
// @from(Ln 497955, Col 0)
function Do8(q) {
    switch (q) {
        case "user":
            return `User (${D66(X46(),"agent-memory")}/)`;
        case "project":
            return "Project (.claude/agent-memory/)";
        case "local":
            return `Local (${reK("...")})`;
        default:
            return "None"
    }
}
// @from(Ln 497968, Col 0)
function mH6(q, K) {
    let _;
    switch (K) {
        case "user":
            _ = "- Since this memory is user-scope, keep learnings general since they apply across all projects";
            break;
        case "project":
            _ = "- Since this memory is project-scope and shared with your team via version control, tailor your memories to this project";
            break;
        case "local":
            _ = "- Since this memory is local-scope (not checked into version control), tailor your memories to this project and machine";
            break
    }
    let z = Jh6(q, K);
    Iu6(z);
    let Y = process.env.CLAUDE_COWORK_MEMORY_EXTRA_GUIDELINES;
    return ieK({
        displayName: "Persistent Agent Memory",
        memoryDir: z,
        extraGuidelines: Y && Y.trim().length > 0 ? [_, Y] : [_]
    })
}
// @from(Ln 497990, Col 4)
pp = L(() => {
    y8();
    sy6();
    VY();
    n7();
    pK();
    b9()
})
// @from(Ln 498004, Col 0)
function oeK() {
    return QtY(mf6(b8()), I8(), "workflows", "scripts") + dtY
}
// @from(Ln 498007, Col 4)
aeK = L(() => {
    y8();
    n7();
    K8();
    m8();
    hm()
})
// @from(Ln 498027, Col 0)
function pM(q) {
    return q.toLowerCase()
}
// @from(Ln 498031, Col 0)
function itY(q) {
    let K = Wq(q),
        _ = pM(K),
        z = [{
            dir: Wq(DZ(Y7(), ".claude", "skills")),
            prefix: "/.claude/skills/"
        }, {
            dir: Wq(DZ(teK(), ".claude", "skills")),
            prefix: "~/.claude/skills/"
        }];
    for (let {
            dir: Y,
            prefix: A
        }
        of z) {
        let O = pM(Y);
        for (let w of [N0, "/"])
            if (_.startsWith(O + w.toLowerCase())) {
                let $ = K.slice(Y.length + w.length),
                    j = $.indexOf("/"),
                    H = N0 === "\\" ? $.indexOf("\\") : -1,
                    J = j === -1 ? H : H === -1 ? j : Math.min(j, H);
                if (J <= 0) return null;
                let X = $.slice(0, J);
                if (!X || X === "." || X.includes("..")) return null;
                if (/[*?[\]]/.test(X)) return null;
                return {
                    skillName: X,
                    pattern: A + X + "/**"
                }
            }
    }
    return null
}
// @from(Ln 498066, Col 0)
function dH7(q, K) {
    if (y1() === "windows") {
        let _ = sX(q),
            z = sX(K);
        return Xz6.relative(_, z)
    }
    return Xz6.relative(q, K)
}
// @from(Ln 498075, Col 0)
function Pj4(q) {
    if (y1() === "windows") return sX(q);
    return q
}
// @from(Ln 498080, Col 0)
function rtY() {
    return wv.map((q) => Ww(q)).filter((q) => q !== void 0)
}
// @from(Ln 498084, Col 0)
function tl8(q) {
    let K = Wq(q),
        _ = pM(K);
    if (_.endsWith(`${N0}.claude${N0}settings.json`) || _.endsWith(`${N0}.claude${N0}settings.local.json`)) return !0;
    return rtY().some((z) => pM(z) === _)
}
// @from(Ln 498091, Col 0)
function otY(q) {
    if (tl8(q)) return !0;
    let K = DZ(Y7(), ".claude", "commands"),
        _ = DZ(Y7(), ".claude", "agents"),
        z = DZ(Y7(), ".claude", "skills");
    return iE(q, K) || iE(q, _) || iE(q, z)
}
// @from(Ln 498099, Col 0)
function eeK(q) {
    let K = pb8();
    if (!K) return !1;
    let _ = DZ(aO(), K),
        z = Mz6(q);
    return z.startsWith(_) && z.endsWith(".md")
}
// @from(Ln 498107, Col 0)
function za8() {
    return DZ(e2(b8()), I8(), "session-memory") + N0
}
// @from(Ln 498111, Col 0)
function zQ1() {
    return DZ(za8(), "summary.md")
}
// @from(Ln 498115, Col 0)
function atY(q) {
    return Mz6(q).startsWith(za8())
}
// @from(Ln 498119, Col 0)
function stY(q) {
    let K = Mz6(q);
    return K.startsWith(oeK()) && K.endsWith(".js")
}
// @from(Ln 498124, Col 0)
function ttY() {
    return DZ(e2(b8()), I8(), "frame") + N0
}
// @from(Ln 498128, Col 0)
function etY(q) {
    let K = ttY(),
        _ = Mz6(q);
    return _ === DZ(K, "frame.html") || _ === DZ(K, "frame.md")
}
// @from(Ln 498134, Col 0)
function qeY(q) {
    let K = e2(b8()),
        _ = Mz6(q);
    return _ === K || _.startsWith(K + N0)
}
// @from(Ln 498140, Col 0)
function mn() {
    return Tw("tengu_scratch")
}
// @from(Ln 498144, Col 0)
function s47() {
    if (y1() === "windows") return "claude";
    return `claude-${process.getuid?.()??0}`
}
// @from(Ln 498149, Col 0)
function Ya8() {
    return DZ(iv(), AP(Y7())) + N0
}
// @from(Ln 498153, Col 0)
function Pz6() {
    return DZ(Ya8(), I8(), "scratchpad")
}
// @from(Ln 498156, Col 0)
async function q65() {
    if (!mn()) throw Error("Scratchpad directory feature is not enabled");
    let q = V8(),
        K = Pz6();
    return await q.mkdir(K, {
        mode: 448
    }), K
}
// @from(Ln 498165, Col 0)
function K65(q) {
    if (!mn()) return !1;
    let K = Pz6(),
        _ = Mz6(q);
    return _ === K || _.startsWith(K + N0)
}
// @from(Ln 498172, Col 0)
function cH7(q) {
    return /^[\\/]{2}wsl(\$|\.localhost)[\\/]/i.test(q)
}
// @from(Ln 498176, Col 0)
function KeY(q, K) {
    let z = Wq(q).split(N0),
        Y = z.at(-1);
    if ((q.startsWith("\\\\") || q.startsWith("//")) && !cH7(q)) return !0;
    for (let A = 0; A < z.length; A++) {
        let O = z[A],
            w = pM(O);
        for (let $ of ntY) {
            if (w !== pM($)) continue;
            if ($ === ".claude") {
                let j = z[A + 1],
                    H = j ? pM(j) : void 0;
                if (K && H) {
                    if (H === "skills" || H === "agents" || H === "commands") break;
                    if (H === "scheduled_tasks.json" && A + 1 === z.length - 1) break
                }
                if (H === "worktrees") break
            }
            return !0
        }
    }
    if (Y) {
        let A = pM(Y);
        if (ltY.some((O) => pM(O) === A)) return !0
    }
    return !1
}
// @from(Ln 498204, Col 0)
function _65(q) {
    if (y1() === "windows" || y1() === "wsl") {
        if (q.indexOf(":", 2) !== -1) return !0
    }
    if (/~\d/.test(q)) return !0;
    if (q.startsWith("\\\\?\\") || q.startsWith("\\\\.\\") || q.startsWith("//?/") || q.startsWith("//./")) return !0;
    if (/[.\s]+$/.test(q)) return !0;
    if (/\.(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i.test(q)) return !0;
    if (/(^|\/|\\)\.{3,}(\/|\\|$)/.test(q)) return !0;
    if (Gp(q) && !cH7(q)) return !0;
    return !1
}
// @from(Ln 498217, Col 0)
function ot6(q, K, _, z) {
    let Y = _ || z,
        A = K ?? Ym(q);
    for (let O of A)
        if (_65(O)) return {
            safe: !1,
            message: `Claude requested permissions to write to ${q}, which contains a suspicious Windows path pattern that requires manual approval.`,
            classifierApprovable: !1
        };
    for (let O of A)
        if (Y) {
            if (tl8(O)) return {
                safe: !1,
                message: `Claude requested permissions to write to ${q}, but you haven't granted it yet.`,
                classifierApprovable: !0
            }
        } else if (otY(O)) return {
        safe: !1,
        message: `Claude requested permissions to write to ${q}, but you haven't granted it yet.`,
        classifierApprovable: !0
    };
    for (let O of A)
        if (KeY(O, Y)) return {
            safe: !1,
            message: `Claude requested permissions to edit ${q} which is a sensitive file.`,
            classifierApprovable: !0
        };
    return {
        safe: !0
    }
}
// @from(Ln 498249, Col 0)
function qp(q) {
    return new Set([Y7(), ...q.additionalWorkingDirectories.keys()])
}
// @from(Ln 498253, Col 0)
function Tk(q, K, _) {
    let z = _ ?? Ym(q),
        Y = Array.from(qp(K)).flatMap((A) => _eY(A));
    return z.every((A) => Y.some((O) => iE(A, O)))
}
// @from(Ln 498259, Col 0)
function iE(q, K) {
    let _ = Wq(q),
        z = Wq(K),
        Y = _.replace(/^\/private\/var\//, "/var/").replace(/^\/private\/tmp(\/|$)/, "/tmp$1"),
        A = z.replace(/^\/private\/var\//, "/var/").replace(/^\/private\/tmp(\/|$)/, "/tmp$1"),
        O = pM(Y),
        w = pM(A),
        $ = dH7(w, O);
    if ($ === "") return !0;
    if (MU($)) return !1;
    return !Xz6.isAbsolute($)
}
// @from(Ln 498272, Col 0)
function zeY(q) {
    switch (q) {
        case "cliArg":
        case "command":
        case "session":
            return Wq(Y7());
        case "userSettings":
        case "policySettings":
        case "projectSettings":
        case "localSettings":
        case "flagSettings":
            return d16(q)
    }
}
// @from(Ln 498287, Col 0)
function QH7(q) {
    return Xz6.join(un, q)
}
// @from(Ln 498291, Col 0)
function YeY({
    patternRoot: q,
    pattern: K,
    rootPath: _
}) {
    let z = Xz6.join(q, K);
    if (q === _) return QH7(K);
    else if (z.startsWith(`${_}${un}`)) {
        let Y = z.slice(_.length);
        return QH7(Y)
    } else {
        let Y = Xz6.relative(_, q);
        if (!Y || Y.startsWith(`..${un}`) || Y === "..") return null;
        else {
            let A = Xz6.join(Y, K);
            return QH7(A)
        }
    }
}
// @from(Ln 498311, Col 0)
function kb6(q, K) {
    let _ = new Set(q.get(null) ?? []);
    for (let [z, Y] of q.entries()) {
        if (z === null) continue;
        for (let A of Y) {
            let O = YeY({
                patternRoot: z,
                pattern: A,
                rootPath: K
            });
            if (O) _.add(O)
        }
    }
    return Array.from(_)
}
// @from(Ln 498327, Col 0)
function Nb6(q) {
    let K = z65(q, "read", "deny"),
        _ = new Map;
    for (let [z, Y] of K.entries()) _.set(z, Array.from(Y.keys()));
    return _
}
// @from(Ln 498334, Col 0)
function AeY(q, K) {
    if (q.startsWith(`${un}${un}`)) {
        let z = q.slice(1);
        if (y1() === "windows" && z.match(/^\/[a-z]\//i)) {
            let Y = z[1]?.toUpperCase() ?? "C",
                A = z.slice(2),
                O = `${Y}:\\`;
            return {
                relativePattern: A.startsWith("/") ? A : "/" + A,
                root: O
            }
        }
        return {
            relativePattern: z,
            root: un
        }
    } else if (q.startsWith(`~${un}`)) return {
        relativePattern: q.slice(1),
        root: teK().normalize("NFC")
    };
    else if (q.startsWith(un)) return {
        relativePattern: q,
        root: zeY(K)
    };
    let _ = q;
    if (q.startsWith(`.${un}`)) _ = q.slice(2);
    return {
        relativePattern: _,
        root: null
    }
}
// @from(Ln 498366, Col 0)
function z65(q, K, _) {
    let z = (() => {
            switch (K) {
                case "edit":
                    return J4;
                case "read":
                    return xq
            }
        })(),
        Y = qP6(q, z, _),
        A = new Map;
    for (let [O, w] of Y.entries()) {
        let {
            relativePattern: $,
            root: j
        } = AeY(O, w.source), H = A.get(j);
        if (H === void 0) H = new Map, A.set(j, H);
        H.set($, w)
    }
    return A
}
// @from(Ln 498388, Col 0)
function ZJ(q, K, _, z) {
    let Y = Wq(q);
    if (y1() === "windows" && Y.includes("\\")) Y = sX(Y);
    let A = z65(K, _, z);
    for (let [O, w] of A.entries()) {
        let $ = Array.from(w.keys()).map((X) => {
                let M = X;
                if (M.endsWith("/**")) M = M.slice(0, -3);
                return M
            }),
            j = seK.default().add($),
            H = dH7(O ?? b8(), Y ?? b8());
        if (H.startsWith(`..${un}`)) continue;
        if (!H) continue;
        let J = j.test(H);
        if (J.ignored && J.rule) {
            let X = J.rule.pattern,
                M = X + "/**";
            if (w.has(M)) return w.get(M) ?? null;
            return w.get(X) ?? null
        }
    }
    return null
}
// @from(Ln 498413, Col 0)
function weY(q) {
    for (let [K, _] of OeY())
        if (q === K || q.startsWith(K + N0)) return _ + q.slice(K.length);
    return q
}
// @from(Ln 498419, Col 0)
function Y65(q, K, _) {
    let z = null;
    for (let Y of q) {
        let A = ZJ(Y, K, _, "allow");
        if (!A) {
            let O = weY(Y);
            if (O !== Y) A = ZJ(O, K, _, "allow")
        }
        if (!A) return null;
        z ??= A
    }
    return z
}
// @from(Ln 498433, Col 0)
function l96(q, K, _) {
    if (typeof q.getPath !== "function") return {
        behavior: "ask",
        message: `Claude requested permissions to use ${q.name}, but you haven't granted it yet.`
    };
    let z = q.getPath(K),
        Y = Ym(z);
    for (let H of Y)
        if ((H.startsWith("\\\\") || H.startsWith("//")) && !cH7(H)) return {
            behavior: "ask",
            message: `Claude requested permissions to read from ${z}, which appears to be a UNC path that could access network resources.`,
            decisionReason: {
                type: "other",
                reason: "UNC path detected (defense-in-depth check)"
            }
        };
    for (let H of Y)
        if (_65(H)) return {
            behavior: "ask",
            message: `Claude requested permissions to read from ${z}, which contains a suspicious Windows path pattern that requires manual approval.`,
            decisionReason: {
                type: "other",
                reason: "Path contains suspicious Windows-specific patterns (alternate data streams, short names, long path prefixes, or three or more consecutive dots) that require manual verification"
            }
        };
    for (let H of Y) {
        let J = ZJ(H, _, "read", "deny");
        if (J) return {
            behavior: "deny",
            message: `Permission to read ${z} has been denied.`,
            decisionReason: {
                type: "rule",
                rule: J
            }
        }
    }
    for (let H of Y) {
        let J = ZJ(H, _, "read", "ask");
        if (J) return {
            behavior: "ask",
            message: `Claude requested permissions to read from ${z}, but you haven't granted it yet.`,
            decisionReason: {
                type: "rule",
                rule: J
            }
        }
    }
    let A = PM6(q, K, _, Y);
    if (A.behavior === "allow") return A;
    if (Tk(z, _, Y)) return {
        behavior: "allow",
        updatedInput: K,
        decisionReason: {
            type: "mode",
            mode: "default"
        }
    };
    let w = Wq(z),
        $ = st6(w, K);
    if ($.behavior !== "passthrough") return $;
    let j = Y65(Y, _, "read");
    if (j) return {
        behavior: "allow",
        updatedInput: K,
        decisionReason: {
            type: "rule",
            rule: j
        }
    };
    return {
        behavior: "ask",
        message: `Claude requested permissions to read from ${z}, but you haven't granted it yet.`,
        suggestions: Gz8(z, "read", _, Y),
        decisionReason: {
            type: "workingDir",
            reason: "Path is outside allowed working directories"
        }
    }
}
// @from(Ln 498513, Col 0)
function PM6(q, K, _, z) {
    if (typeof q.getPath !== "function") return {
        behavior: "ask",
        message: `Claude requested permissions to use ${q.name}, but you haven't granted it yet.`
    };
    let Y = q.getPath(K),
        A = z ?? Ym(Y);
    for (let X of A) {
        let M = ZJ(X, _, "edit", "deny");
        if (M) return {
            behavior: "deny",
            message: `Permission to edit ${Y} has been denied.`,
            decisionReason: {
                type: "rule",
                rule: M
            }
        }
    }
    let O = Wq(Y),
        w = at6(O, K);
    if (w.behavior !== "passthrough") return w;
    let $ = ZJ(Y, {
        ..._,
        alwaysAllowRules: {
            session: _.alwaysAllowRules.session ?? []
        }
    }, "edit", "allow");
    if ($) {
        let X = $.ruleValue.ruleContent;
        if (X && (X.startsWith(VL8.slice(0, -2)) || X.startsWith(kL8.slice(0, -2))) && !X.includes("..") && X.endsWith("/**")) return {
            behavior: "allow",
            updatedInput: K,
            decisionReason: {
                type: "rule",
                rule: $
            }
        }
    }
    let j = ot6(Y, A, void 0, _.isRemoteMode);
    if (!j.safe) {
        let X = itY(Y),
            M = X ? [{
                type: "addRules",
                rules: [{
                    toolName: J4,
                    ruleContent: X.pattern
                }],
                behavior: "allow",
                destination: "session"
            }] : Gz8(Y, "write", _, A);
        return {
            behavior: "ask",
            message: j.message,
            suggestions: M,
            decisionReason: {
                type: "safetyCheck",
                reason: j.message,
                classifierApprovable: j.classifierApprovable
            }
        }
    }
    for (let X of A) {
        let M = ZJ(X, _, "edit", "ask");
        if (M) return {
            behavior: "ask",
            message: `Claude requested permissions to write to ${Y}, but you haven't granted it yet.`,
            decisionReason: {
                type: "rule",
                rule: M
            }
        }
    }
    let H = Tk(Y, _, A);
    if (_.mode === "acceptEdits" && H) return {
        behavior: "allow",
        updatedInput: K,
        decisionReason: {
            type: "mode",
            mode: _.mode
        }
    };
    let J = Y65(A, _, "edit");
    if (J) return {
        behavior: "allow",
        updatedInput: K,
        decisionReason: {
            type: "rule",
            rule: J
        }
    };
    return {
        behavior: "ask",
        message: `Claude requested permissions to write to ${Y}, but you haven't granted it yet.`,
        suggestions: Gz8(Y, "write", _, A),
        decisionReason: !H ? {
            type: "workingDir",
            reason: "Path is outside allowed working directories"
        } : void 0
    }
}
// @from(Ln 498614, Col 0)
function Gz8(q, K, _, z) {
    let Y = !Tk(q, _, z);
    if (K === "read" && Y) {
        let w = Yv(q);
        return Ym(w).map((H) => _j6(H, "session")).filter((H) => H !== void 0)
    }
    let A = _.mode === "plan" && (_.prePlanMode === "auto" || _.prePlanMode === "bypassPermissions" || _.prePlanMode === "acceptEdits" || _.prePlanMode === "dontAsk"),
        O = (_.mode === "default" || _.mode === "plan") && !A;
    if (K === "write" || K === "create") {
        let w = O ? [{
            type: "setMode",
            mode: "acceptEdits",
            destination: "session"
        }] : [];
        if (Y) {
            let $ = Yv(q),
                j = Ym($);
            w.push({
                type: "addDirectories",
                directories: j,
                destination: "session"
            })
        }
        return w
    }
    return O ? [{
        type: "setMode",
        mode: "acceptEdits",
        destination: "session"
    }] : []
}
// @from(Ln 498646, Col 0)
function at6(q, K) {
    let _ = Mz6(q);
    if (eeK(_)) return {
        behavior: "allow",
        updatedInput: K,
        decisionReason: {
            type: "other",
            reason: "Plan files for current session are allowed for writing"
        }
    };
    if (stY(_)) return {
        behavior: "allow",
        updatedInput: K,
        decisionReason: {
            type: "other",
            reason: "Workflow script files for current session are allowed for writing"
        }
    };
    if (etY(_)) return {
        behavior: "allow",
        updatedInput: K,
        decisionReason: {
            type: "other",
            reason: "Frame source files for current session are allowed for writing"
        }
    };
    if (K65(_)) return {
        behavior: "allow",
        updatedInput: K,
        decisionReason: {
            type: "other",
            reason: "Scratchpad files for current session are allowed for writing"
        }
    };
    if (d38(_)) return {
        behavior: "allow",
        updatedInput: K,
        decisionReason: {
            type: "other",
            reason: "Agent memory files are allowed for writing"
        }
    };
    if (YR(_) && Qg()) return {
        behavior: "deny",
        message: "Cannot write to memory while it is toggled off. Run /toggle-memory to re-enable automemory.",
        decisionReason: {
            type: "other",
            reason: "memory access blocked by /toggle-memory"
        }
    };
    if (!hk8() && YR(_)) return {
        behavior: "allow",
        updatedInput: K,
        decisionReason: {
            type: "other",
            reason: "auto memory files are allowed for writing"
        }
    };
    if (pM(_) === pM(DZ(Y7(), ".claude", "launch.json"))) return {
        behavior: "allow",
        updatedInput: K,
        decisionReason: {
            type: "other",
            reason: "Preview launch config is allowed for writing"
        }
    };
    return {
        behavior: "passthrough",
        message: ""
    }
}
// @from(Ln 498718, Col 0)
function st6(q, K) {
    let _ = Mz6(q);
    if (atY(_)) return {
        behavior: "allow",
        updatedInput: K,
        decisionReason: {
            type: "other",
            reason: "Session memory files are allowed for reading"
        }
    };
    if (YR(_) && Qg()) return {
        behavior: "deny",
        message: "Cannot read memory while it is toggled off. Run /toggle-memory to re-enable automemory.",
        decisionReason: {
            type: "other",
            reason: "memory access blocked by /toggle-memory"
        }
    };
    if (qeY(_)) return {
        behavior: "allow",
        updatedInput: K,
        decisionReason: {
            type: "other",
            reason: "Project directory files are allowed for reading"
        }
    };
    if (eeK(_)) return {
        behavior: "allow",
        updatedInput: K,
        decisionReason: {
            type: "other",
            reason: "Plan files for current session are allowed for reading"
        }
    };
    let z = cK6(),
        Y = z.endsWith(N0) ? z : z + N0;
    if (_ === z || _.startsWith(Y)) return {
        behavior: "allow",
        updatedInput: K,
        decisionReason: {
            type: "other",
            reason: "Tool result files are allowed for reading"
        }
    };
    if (K65(_)) return {
        behavior: "allow",
        updatedInput: K,
        decisionReason: {
            type: "other",
            reason: "Scratchpad files for current session are allowed for reading"
        }
    };
    let A = Ya8();
    if (_.startsWith(A)) return {
        behavior: "allow",
        updatedInput: K,
        decisionReason: {
            type: "other",
            reason: "Project temp directory files are allowed for reading"
        }
    };
    if (d38(_)) return {
        behavior: "allow",
        updatedInput: K,
        decisionReason: {
            type: "other",
            reason: "Agent memory files are allowed for reading"
        }
    };
    if (YR(_)) return {
        behavior: "allow",
        updatedInput: K,
        decisionReason: {
            type: "other",
            reason: "auto memory files are allowed for reading"
        }
    };
    let O = DZ(A7(), "tasks") + N0;
    if (_ === O.slice(0, -1) || _.startsWith(O)) return {
        behavior: "allow",
        updatedInput: K,
        decisionReason: {
            type: "other",
            reason: "Task files are allowed for reading"
        }
    };
    let w = DZ(A7(), "teams") + N0;
    if (_ === w.slice(0, -1) || _.startsWith(w)) return {
        behavior: "allow",
        updatedInput: K,
        decisionReason: {
            type: "other",
            reason: "Team files are allowed for reading"
        }
    };
    let $ = uj7() + N0;
    if (_.startsWith($)) return {
        behavior: "allow",
        updatedInput: K,
        decisionReason: {
            type: "other",
            reason: "Bundled skill reference files are allowed for reading"
        }
    };
    return {
        behavior: "passthrough",
        message: ""
    }
}
// @from(Ln 498827, Col 4)
seK
// @from(Ln 498827, Col 9)
ltY
// @from(Ln 498827, Col 14)
ntY
// @from(Ln 498827, Col 19)
un
// @from(Ln 498827, Col 23)
iv
// @from(Ln 498827, Col 27)
uj7
// @from(Ln 498827, Col 32)
_eY
// @from(Ln 498827, Col 37)
OeY
// @from(Ln 498828, Col 4)
Sz = L(() => {
    U4();
    VY();
    pp();
    aeK();
    y8();
    B1();
    Rz();
    n7();
    Q8();
    Yq();
    b9();
    NJ();
    NK();
    g4();
    aY();
    a1();
    Zy6();
    cW();
    ND();
    rC();
    MH();
    g$();
    seK = K6(X$6(), 1), ltY = [".gitconfig", ".gitmodules", ".bashrc", ".bash_profile", ".zshrc", ".zprofile", ".profile", ".ripgreprc", ".mcp.json", ".claude.json"], ntY = [".git", ".vscode", ".idea", ".claude", ".husky"];
    un = Xz6.sep;
    iv = P1(function() {
        let K = z2(),
            _ = V8(),
            z = K;
        try {
            z = _.realpathSync(K)
        } catch {}
        return DZ(z, s47()) + N0
    }), uj7 = P1(function() {
        let K = ctY(16).toString("hex");
        return DZ(iv(), "bundled-skills", {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.112",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-04-16T18:33:19Z"
        }.VERSION, K)
    });
    _eY = P1(Ym);
    OeY = P1(function() {
        let K = [
                ["/private/tmp", "/tmp"],
                ["/private/var", "/var"],
                ["/private/etc", "/etc"],
                ["/usr/bin", "/bin"],
                ["/usr/lib", "/lib"],
                ["/usr/sbin", "/sbin"]
            ],
            _ = new Map,
            z = V8();
        for (let [Y, A] of K) try {
            if (z.realpathSync(A) === Y) _.set(Y, A)
        } catch {}
        return _
    })
})
// @from(Ln 498904, Col 0)
function Sb6() {
    if (lH7 === void 0) lH7 = $65(Ya8(), I8(), "tasks");
    return lH7
}
// @from(Ln 498908, Col 0)
async function iH7() {
    await $eY(Sb6(), {
        recursive: !0
    })
}
// @from(Ln 498914, Col 0)
function $A(q) {
    return $65(Sb6(), `${q}.output`)
}
// @from(Ln 498918, Col 0)
function wa8(q) {
    return O65.add(q), q.finally(() => O65.delete(q)).catch(() => {}), q
}
// @from(Ln 498921, Col 0)
class UU8 {
    #q;
    #K = null;
    #_ = [];
    #Y = 0;
    #z = !1;
    #w = null;
    #A = null;
    constructor(q) {
        this.#q = $A(q)
    }
    append(q) {
        if (this.#z) return;
        if (this.#Y += q.length, this.#Y > Oa8) this.#z = !0, this.#_.push(`
[output truncated: exceeded ${nH7} disk cap]
`);
        else this.#_.push(q);
        if (!this.#w) this.#w = new Promise((K) => {
            this.#A = K
        }), wa8(this.#O())
    }
    flush() {
        return this.#w ?? Promise.resolve()
    }
    cancel() {
        this.#_.length = 0
    }
    async #$() {
        while (!0) {
            try {
                if (!this.#K) await iH7(), this.#K = await w65(this.#q, process.platform === "win32" ? "a" : VW6.O_WRONLY | VW6.O_APPEND | VW6.O_CREAT | j65);
                while (!0)
                    if (await this.#H(), this.#_.length === 0) break
            } finally {
                if (this.#K) {
                    let q = this.#K;
                    this.#K = null, await q.close()
                }
            }
            if (this.#_.length) continue;
            break
        }
    }
    #H() {
        return this.#K.appendFile(this.#j())
    }
    #j() {
        let q = this.#_.splice(0, this.#_.length),
            K = 0;
        for (let Y of q) K += Buffer.byteLength(Y, "utf8");
        let _ = Buffer.allocUnsafe(K),
            z = 0;
        for (let Y of q) z += _.write(Y, z, "utf8");
        return _
    }
    async #O() {
        try {
            await this.#$()
        } catch (q) {
            if (j6(q), this.#_.length > 0) try {
                await this.#$()
            } catch (K) {
                j6(K)
            }
        } finally {
            let q = this.#A;
            this.#w = null, this.#A = null, q()
        }
    }
}
// @from(Ln 498992, Col 0)
function HeY(q) {
    let K = Aa8.get(q);
    if (!K) K = new UU8(q), Aa8.set(q, K);
    return K
}
// @from(Ln 498998, Col 0)
function EwK(q, K) {
    HeY(q).append(K)
}
// @from(Ln 499002, Col 0)
function n2(q) {
    return wa8((async () => {
        let K = Aa8.get(q);
        if (K) await K.flush(), Aa8.delete(q)
    })())
}
// @from(Ln 499008, Col 0)
async function rS4(q, K, _ = H65) {
    try {
        let z = await rw8($A(q), K, _);
        if (!z) return {
            content: "",
            newOffset: K
        };
        return {
            content: z.content,
            newOffset: K + z.bytesRead
        }
    } catch (z) {
        if (Q1(z) === "ENOENT") return {
            content: "",
            newOffset: K
        };
        return j6(z), {
            content: "",
            newOffset: K
        }
    }
}
// @from(Ln 499030, Col 0)
async function w37(q, K = H65) {
    try {
        let {
            content: _,
            bytesTotal: z,
            bytesRead: Y
        } = await RC($A(q), K);
        if (z > Y) return `[${Math.round((z-Y)/1024)}KB of earlier output omitted]
${_}`;
        return _
    } catch (_) {
        if (Q1(_) === "ENOENT") return "";
        return j6(_), ""
    }
}
// @from(Ln 499046, Col 0)
function Kg8(q) {
    return wa8((async () => {
        await iH7();
        let K = $A(q);
        return await (await w65(K, process.platform === "win32" ? "wx" : VW6.O_WRONLY | VW6.O_CREAT | VW6.O_EXCL | j65)).close(), K
    })())
}
// @from(Ln 499054, Col 0)
function uM6(q, K) {
    return wa8((async () => {
        try {
            await iH7();
            let _ = $A(q);
            try {
                await A65(K, _)
            } catch {
                await jeY(_), await A65(K, _)
            }
            return _
        } catch (_) {
            return j6(_), Kg8(q)
        }
    })())
}
// @from(Ln 499070, Col 4)
j65
// @from(Ln 499070, Col 9)
H65 = 8388608
// @from(Ln 499071, Col 4)
Oa8 = 5368709120
// @from(Ln 499072, Col 4)
nH7 = "5GB"
// @from(Ln 499073, Col 4)
lH7
// @from(Ln 499073, Col 9)
O65
// @from(Ln 499073, Col 14)
Aa8
// @from(Ln 499074, Col 4)
EH = L(() => {
    y8();
    m8();
    Yq();
    U8();
    Sz();
    j65 = VW6.O_NOFOLLOW ?? 0;
    O65 = new Set;
    Aa8 = new Map
})
// @from(Ln 499088, Col 0)
function np(q) {
    return q === "completed" || q === "failed" || q === "killed"
}
// @from(Ln 499092, Col 0)
function X65(q) {
    for (let K of Object.values(q))
        if (XeY.has(K.type) && !np(K.status)) return !0;
    return !1
}
// @from(Ln 499098, Col 0)
function M65(q) {
    for (let K of Object.values(q))
        if (K.type === "local_bash" && !np(K.status)) return !0;
    return !1
}
// @from(Ln 499104, Col 0)
function PeY(q) {
    return MeY[q] ?? "x"
}
// @from(Ln 499108, Col 0)
function cR(q) {
    let K = PeY(q),
        _ = JeY(8),
        z = K;
    for (let Y = 0; Y < 8; Y++) z += J65[_[Y] % J65.length];
    return z
}
// @from(Ln 499116, Col 0)
function cf(q, K, _, z) {
    return {
        id: q,
        type: K,
        status: "pending",
        description: _,
        toolUseId: z,
        startTime: Date.now(),
        outputFile: $A(q),
        outputOffset: 0,
        notified: !1
    }
}
// @from(Ln 499129, Col 4)
XeY
// @from(Ln 499129, Col 9)
MeY
// @from(Ln 499129, Col 14)
J65 = "0123456789abcdefghijklmnopqrstuvwxyz"
// @from(Ln 499130, Col 4)
$T = L(() => {
    EH();
    XeY = new Set(["local_agent", "remote_agent", "in_process_teammate", "local_workflow"]);
    MeY = {
        local_bash: "b",
        local_agent: "a",
        remote_agent: "r",
        in_process_teammate: "t",
        local_workflow: "w",
        monitor_mcp: "m",
        dream: "d"
    }
})
// @from(Ln 499147, Col 0)
function W65(q, K) {
    return K ? `${q} ${K}` : q
}
// @from(Ln 499150, Col 0)
class oH7 {
    #q;
    #K = !1;
    #_;
    #Y;
    #z = this.#w.bind(this);
    constructor(q, K, _) {
        this.#q = q, this.#_ = K, this.#Y = _, q.setEncoding("utf-8"), q.on("data", this.#z)
    }
    #w(q) {
        let K = typeof q === "string" ? q : q.toString();
        if (this.#Y) this.#_.writeStderr(K);
        else this.#_.writeStdout(K)
    }
    cleanup() {
        if (this.#K) return;
        this.#K = !0, this.#q.removeListener("data", this.#z), this.#q = null, this.#_ = null, this.#z = () => {}
    }
}
// @from(Ln 499169, Col 0)
class aH7 {
    #q = "running";
    #K;
    #_;
    #Y;
    #z;
    #w = null;
    #A = null;
    #$ = !1;
    #H;
    #j;
    #O;
    #X;
    #D;
    #P = null;
    #J = null;
    #Z = null;
    taskOutput;
    static #W(q) {
        if (q.#D && q.#O) q.#O(q.background.bind(q));
        else q.#S(P65)
    }
    result;
    onTimeout;
    constructor(q, K, _, z, Y = !1, A = Oa8) {
        if (this.#z = q, this.#j = K, this.#X = _, this.#D = Y, this.#H = A, this.taskOutput = z, this.#Y = q.stderr ? new oH7(q.stderr, z, !0) : null, this.#_ = q.stdout ? new oH7(q.stdout, z, !1) : null, Y) this.onTimeout = (O) => {
            this.#O = O
        };
        this.result = this.#R()
    }
    get status() {
        return this.#q
    }
    #G() {
        if (this.#j.reason === "interrupt") return;
        this.kill()
    }
    #V(q, K) {
        let _ = q !== null && q !== void 0 ? q : K === "SIGTERM" ? 144 : 1;
        this.#T(_)
    }
    #v() {
        this.#T(1)
    }
    #T(q) {
        if (this.#J) this.#J(q), this.#J = null
    }
    #N() {
        this.#f();
        let q = this.#w;
        if (q) clearTimeout(q), this.#w = null;
        let K = this.#Z;
        if (K) this.#j.removeEventListener("abort", K), this.#Z = null
    }
    #f() {
        if (this.#A) clearInterval(this.#A), this.#A = null
    }
    #C() {
        this.#A = setInterval(() => {
            WeY(this.taskOutput.path).then((q) => {
                if (q.size > this.#H && this.#q === "backgrounded" && this.#A !== null) this.#$ = !0, this.#f(), this.#S(rH7)
            }, () => {})
        }, DeY), this.#A.unref()
    }
    #R() {
        this.#Z = this.#G.bind(this), this.#j.addEventListener("abort", this.#Z, {
            once: !0
        }), this.#z.once("exit", this.#V.bind(this)), this.#z.once("error", this.#v.bind(this)), this.#w = setTimeout(aH7.#W, this.#X, this);
        let q = new Promise((K) => {
            this.#J = K
        });
        return new Promise((K) => {
            this.#P = K, q.then(this.#E.bind(this))
        })
    }
    async #E(q) {
        if (this.#N(), this.#q === "running" || this.#q === "backgrounded") this.#q = "completed";
        let K = await this.taskOutput.getStdout(),
            _ = {
                code: q,
                stdout: K,
                stderr: this.taskOutput.getStderr(),
                interrupted: q === rH7,
                backgroundTaskId: this.#K
            };
        if (this.taskOutput.stdoutToFile && !this.#K)
            if (this.taskOutput.outputFileRedundant) setImmediate(() => {
                if (!this.#K) this.taskOutput.deleteOutputFile()
            });
            else _.outputFilePath = this.taskOutput.path, _.outputFileSize = this.taskOutput.outputFileSize, _.outputTaskId = this.taskOutput.taskId;
        if (this.#$) _.stderr = W65(`Background command killed: output file exceeded ${nH7}`, _.stderr);
        else if (q === P65) _.stderr = W65(`Command timed out after ${C5(this.#X)}`, _.stderr);
        let z = this.#P;
        if (z) this.#P = null, z(_)
    }
    #S(q) {
        if (this.#q = "killed", this.#z.pid) D65.default(this.#z.pid, "SIGKILL");
        this.#T(q ?? rH7)
    }
    kill() {
        this.#S()
    }
    background(q) {
        if (this.#q === "running") {
            if (this.#K = q, this.#q = "backgrounded", this.#N(), this.taskOutput.stdoutToFile) this.#C();
            else this.taskOutput.spillToDisk();
            return !0
        }
        return !1
    }
    cleanup() {
        this.#_?.cleanup(), this.#Y?.cleanup(), this.taskOutput.clear(), this.#N(), this.#z = null, this.#j = null, this.#O = void 0
    }
}
// @from(Ln 499284, Col 0)
function nU8(q, K, _, z, Y = !1, A = Oa8) {
    return new aH7(q, K, _, z, Y, A)
}
// @from(Ln 499287, Col 0)
class Z65 {
    status = "killed";
    result;
    taskOutput;
    constructor(q) {
        this.taskOutput = new uw(cR("local_bash"), null), this.result = Promise.resolve({
            code: q?.code ?? 145,
            stdout: "",
            stderr: q?.stderr ?? "Command aborted before execution",
            interrupted: !0,
            backgroundTaskId: q?.backgroundTaskId
        })
    }
    background() {
        return !1
    }
    kill() {}
    cleanup() {}
}
// @from(Ln 499307, Col 0)
function a47(q, K) {
    return new Z65({
        backgroundTaskId: q,
        ...K
    })
}
// @from(Ln 499314, Col 0)
function KWK(q) {
    let K = new uw(cR("local_bash"), null);
    return {
        status: "completed",
        result: Promise.resolve({
            code: 1,
            stdout: "",
            stderr: q,
            interrupted: !1,
            preSpawnError: q
        }),
        taskOutput: K,
        background() {
            return !1
        },
        kill() {},
        cleanup() {}
    }
}
// @from(Ln 499333, Col 4)
D65
// @from(Ln 499333, Col 9)
rH7 = 137
// @from(Ln 499334, Col 4)
P65 = 143
// @from(Ln 499335, Col 4)
DeY = 5000
// @from(Ln 499336, Col 4)
t47 = L(() => {
    $T();
    c7();
    EH();
    hb6();
    D65 = K6(_44(), 1)
})
// @from(Ln 499344, Col 0)
function bu(q) {
    return !(("async" in q) && q.async === !0)
}
// @from(Ln 499348, Col 0)
function Bn(q) {
    return "async" in q && q.async === !0
}
// @from(Ln 499351, Col 4)
ZeY
// @from(Ln 499351, Col 9)
f65
// @from(Ln 499351, Col 14)
feY
// @from(Ln 499351, Col 19)
xu6
// @from(Ln 499352, Col 4)
sH7 = L(() => {
    p7();
    pA6();
    rI8();
    ZeY = C6(() => y.enum(["allow", "deny", "ask", "defer"])), f65 = C6(() => y.object({
        prompt: y.string(),
        message: y.string(),
        options: y.array(y.object({
            key: y.string(),
            label: y.string(),
            description: y.string().optional()
        }))
    })), feY = C6(() => y.object({
        continue: y.boolean().describe("Whether Claude should continue after hook (default: true)").optional(),
        suppressOutput: y.boolean().describe("Hide stdout from transcript (default: false)").optional(),
        stopReason: y.string().describe("Message shown when continue is false").optional(),
        decision: y.enum(["approve", "block"]).optional(),
        reason: y.string().describe("Explanation for the decision").optional(),
        systemMessage: y.string().describe("Warning message shown to the user").optional(),
        hookSpecificOutput: y.union([y.object({
            hookEventName: y.literal("PreToolUse"),
            permissionDecision: ZeY().optional(),
            permissionDecisionReason: y.string().optional(),
            updatedInput: y.record(y.string(), y.unknown()).optional(),
            additionalContext: y.string().optional()
        }), y.object({
            hookEventName: y.literal("UserPromptSubmit"),
            additionalContext: y.string().optional(),
            sessionTitle: y.string().describe("Set the session title (same effect as /rename)").optional()
        }), y.object({
            hookEventName: y.literal("SessionStart"),
            additionalContext: y.string().optional(),
            initialUserMessage: y.string().optional(),
            watchPaths: y.array(y.string()).describe("Absolute paths to watch for FileChanged hooks").optional()
        }), y.object({
            hookEventName: y.literal("Setup"),
            additionalContext: y.string().optional()
        }), y.object({
            hookEventName: y.literal("SubagentStart"),
            additionalContext: y.string().optional()
        }), y.object({
            hookEventName: y.literal("PostToolUse"),
            additionalContext: y.string().optional(),
            updatedMCPToolOutput: y.unknown().describe("Updates the output for MCP tools").optional()
        }), y.object({
            hookEventName: y.literal("PostToolUseFailure"),
            additionalContext: y.string().optional()
        }), y.object({
            hookEventName: y.literal("PermissionDenied"),
            retry: y.boolean().optional()
        }), y.object({
            hookEventName: y.literal("Notification"),
            additionalContext: y.string().optional()
        }), y.object({
            hookEventName: y.literal("PermissionRequest"),
            decision: y.union([y.object({
                behavior: y.literal("allow"),
                updatedInput: y.record(y.string(), y.unknown()).optional(),
                updatedPermissions: y.array(oh6()).optional()
            }), y.object({
                behavior: y.literal("deny"),
                message: y.string().optional(),
                interrupt: y.boolean().optional()
            })])
        }), y.object({
            hookEventName: y.literal("Elicitation"),
            action: y.enum(["accept", "decline", "cancel"]).optional(),
            content: y.record(y.string(), y.unknown()).optional()
        }), y.object({
            hookEventName: y.literal("ElicitationResult"),
            action: y.enum(["accept", "decline", "cancel"]).optional(),
            content: y.record(y.string(), y.unknown()).optional()
        }), y.object({
            hookEventName: y.literal("CwdChanged"),
            watchPaths: y.array(y.string()).describe("Absolute paths to watch for FileChanged hooks").optional()
        }), y.object({
            hookEventName: y.literal("FileChanged"),
            watchPaths: y.array(y.string()).describe("Absolute paths to watch for FileChanged hooks").optional()
        }), y.object({
            hookEventName: y.literal("WorktreeCreate"),
            worktreePath: y.string()
        })]).optional()
    })), xu6 = C6(() => {
        let q = y.object({
            async: y.literal(!0),
            asyncTimeout: y.number().optional()
        });
        return y.union([q, feY()])
    })
})
// @from(Ln 499443, Col 0)
function GL(q, K) {
    let {
        signalB: _,
        timeoutMs: z
    } = K ?? {}, Y = F5();
    if (q?.aborted || _?.aborted) return Y.abort(), {
        signal: Y.signal,
        cleanup: () => {}
    };
    let A, O = () => {
        if (A !== void 0) clearTimeout(A);
        Y.abort()
    };
    if (z !== void 0) A = setTimeout(O, z), A.unref?.();
    q?.addEventListener("abort", O), _?.addEventListener("abort", O);
    let w = () => {
        if (A !== void 0) clearTimeout(A);
        q?.removeEventListener("abort", O), _?.removeEventListener("abort", O)
    };
    return {
        signal: Y.signal,
        cleanup: w
    }
}
// @from(Ln 499467, Col 4)
uu6 = L(() => {
    x$()
})
// @from(Ln 499471, Col 0)
function $a8(q, K) {
    return qL6(q, K)
}
// @from(Ln 499475, Col 0)
function G65() {
    return {
        ...Eg1,
        inputSchema: vz8(),
        inputJSONSchema: {
            type: "object",
            properties: {
                ok: {
                    type: "boolean",
                    description: "Whether the condition was met"
                },
                reason: {
                    type: "string",
                    description: "Reason, if the condition was not met"
                }
            },
            required: ["ok"],
            additionalProperties: !1
        },
        async prompt() {
            return "Use this tool to return your verification result. You MUST call this tool exactly once at the end of your response."
        }
    }
}
// @from(Ln 499500, Col 0)
function ja8(q, K) {
    nK8(q, K, "Stop", "", (_) => _bK(_, iW), `You MUST call the ${iW} tool to complete this request. Call this tool now.`, {
        timeout: 5000
    })
}
// @from(Ln 499505, Col 4)
vz8
// @from(Ln 499506, Col 4)
Ha8 = L(() => {
    p7();
    td();
    oe6();
    _7();
    ty();
    vz8 = C6(() => y.object({
        ok: y.boolean().describe("Whether the condition was met"),
        reason: y.string().describe("Reason, if the condition was not met").optional()
    }))
})
// @from(Ln 499520, Col 0)
async function v65(q, K, _, z, Y, A, O, w) {
    let $ = w || `hook-${GeY()}`,
        j = _ === "Stop" || _ === "SubagentStop";
    try {
        let H = j ? `Based on the conversation transcript above, has the following stopping condition been satisfied? Answer based on transcript evidence only.

Condition: ${q.prompt}` : q.prompt,
            J = $a8(H, z);
        E(`Hooks: Processing prompt hook with prompt: ${J}`);
        let X = t8({
                content: J
            }),
            M = q.model ?? OM(),
            P = O && O.length > 0 ? [...keY(O, M), X] : [X];
        E(`Hooks: Querying model with ${P.length} messages`);
        let W = q.timeout ? q.timeout * 1000 : 30000,
            {
                signal: D,
                cleanup: Z
            } = GL(Y, {
                timeoutMs: W
            });
        try {
            let v = await JW6({
                messages: P,
                systemPrompt: sK([j ? `You are evaluating a stop-condition hook in Claude Code. Read the conversation transcript carefully, then judge whether the user-provided condition is satisfied.

Your response must be a JSON object with one of these shapes:
- {"ok": true, "reason": "<quote evidence from the transcript that satisfies the condition>"}
- {"ok": false, "reason": "<quote what is missing or what blocks the condition>"}

Always include a "reason" field, quoting specific text from the transcript whenever possible. If the transcript does not contain clear evidence that the condition is satisfied, return {"ok": false, "reason": "insufficient evidence in transcript"}.` : `You are evaluating a hook condition in Claude Code. Judge whether the user-provided condition is met.

Your response must be a JSON object with one of these shapes:
- {"ok": true, "reason": "<reason the condition is met>"}
- {"ok": false, "reason": "<reason the condition is not met>"}

Always include a "reason" field.`]),
                thinkingConfig: {
                    type: "disabled"
                },
                tools: [],
                signal: D,
                options: {
                    async getToolPermissionContext() {
                        return A.getAppState().toolPermissionContext
                    },
                    model: M,
                    toolChoice: void 0,
                    isNonInteractiveSession: !0,
                    hasAppendSystemPrompt: !1,
                    agents: [],
                    querySource: "hook_prompt",
                    mcpTools: [],
                    agentId: A.agentId,
                    outputFormat: {
                        type: "json_schema",
                        schema: {
                            type: "object",
                            properties: {
                                ok: {
                                    type: "boolean"
                                },
                                reason: {
                                    type: "string"
                                }
                            },
                            required: ["ok", "reason"],
                            additionalProperties: !1
                        }
                    }
                }
            });
            if (Z(), v.isApiErrorMessage) {
                let h = s5(v.message.content).trim();
                return E(`Hooks: prompt-hook evaluator API error: ${h}`, {
                    level: "error"
                }), {
                    hook: q,
                    outcome: "non_blocking_error",
                    message: Y4({
                        type: "hook_non_blocking_error",
                        hookName: K,
                        toolUseID: $,
                        hookEvent: _,
                        stderr: `Hook evaluator API error: ${h}`,
                        stdout: "",
                        exitCode: 1
                    })
                }
            }
            let V = s5(v.message.content);
            A.addResponseLength(V.length);
            let k = V.trim();
            E(`Hooks: Model response: ${k}`);
            let N = k5(k);
            if (!N) return E(`Hooks: error parsing response as JSON: ${k}`), {
                hook: q,
                outcome: "non_blocking_error",
                message: Y4({
                    type: "hook_non_blocking_error",
                    hookName: K,
                    toolUseID: $,
                    hookEvent: _,
                    stderr: "JSON validation failed",
                    stdout: k,
                    exitCode: 1
                })
            };
            let R = vz8().safeParse(N);
            if (!R.success) return E(`Hooks: model response does not conform to expected schema: ${R.error.message}`), {
                hook: q,
                outcome: "non_blocking_error",
                message: Y4({
                    type: "hook_non_blocking_error",
                    hookName: K,
                    toolUseID: $,
                    hookEvent: _,
                    stderr: `Schema validation failed: ${R.error.message}`,
                    stdout: k,
                    exitCode: 1
                })
            };
            if (!R.data.ok) return E(`Hooks: Prompt hook condition was not met: ${R.data.reason}`), {
                hook: q,
                outcome: "blocking",
                blockingError: {
                    blockingError: `[${q.prompt}]: ${R.data.reason}`,
                    command: q.prompt
                },
                preventContinuation: !j,
                stopReason: R.data.reason
            };
            return E(`Hooks: Prompt hook condition was met: ${R.data.reason}`), {
                hook: q,
                outcome: "success",
                message: Y4({
                    type: "hook_success",
                    hookName: K,
                    toolUseID: $,
                    hookEvent: _,
                    content: ""
                })
            }
        } catch (G) {
            if (Z(), D.aborted) return {
                hook: q,
                outcome: "cancelled"
            };
            throw G
        }
    } catch (H) {
        let J = b6(H);
        return E(`Hooks: Prompt hook error: ${J}`), {
            hook: q,
            outcome: "non_blocking_error",
            message: Y4({
                type: "hook_non_blocking_error",
                hookName: K,
                toolUseID: $,
                hookEvent: _,
                stderr: `Error executing prompt hook: ${J}`,
                stdout: "",
                exitCode: 1
            })
        }
    }
}
// @from(Ln 499689, Col 0)
function TeY(q) {
    for (let K = q.length - 1; K >= 0; K--) {
        let _ = q[K];
        if (_.type === "assistant" && "usage" in _.message && _.message.model !== $c) {
            let z = _.message.usage;
            return z.input_tokens + (z.cache_creation_input_tokens ?? 0) + (z.cache_read_input_tokens ?? 0) + z.output_tokens
        }
    }
    return 0
}
// @from(Ln 499700, Col 0)
function VeY(q) {
    let K = 0;
    for (let _ of q) K += _.type === "assistant" || _.type === "user" ? gy6(_.message.content) : I6(_).length / 4;
    return Math.ceil(K)
}
// @from(Ln 499706, Col 0)
function keY(q, K) {
    let _ = DP(K) ? 1e6 : DR1,
        z = Math.floor(_ * veY);
    if (TeY(q) <= z) return q;
    let Y = AR6(q),
        A = 0,
        O = Y.length;
    for (let j = Y.length - 1; j >= 0; j--) {
        let H = VeY(Y[j]);
        if (O < Y.length && A + H > z) break;
        A += H, O = j
    }
    let w = Y.slice(O).flat(),
        $ = q.length - w.length;
    if ($ <= 0) return q;
    return E(`Hooks: truncated Stop transcript ${q.length}→${w.length} msgs (budget ${z}, model ${K})`), d("tengu_hook_prompt_transcript_truncated", {
        droppedMessages: $,
        keptMessages: w.length,
        budget: z,
        evaluatorModel: K
    }), [t8({
        content: `[Earlier conversation truncated to fit the hook evaluator's context window — ${$} earlier messages omitted. Evaluate the condition against the recent transcript below; if the required evidence may be in the omitted prefix, return {"ok": false, "reason": "insufficient evidence in transcript"}.]`
    }), ...w]
}
// @from(Ln 499730, Col 4)
veY = 0.7
// @from(Ln 499731, Col 4)
T65 = L(() => {
    C8();
    O2();
    Nk();
    ZM();
    uu6();
    AJ();
    K8();
    m8();
    mO();
    _7();
    Sq();
    e8();
    Ha8()
})
// @from(Ln 499749, Col 0)
async function k65(q, K, _, z, Y, A, O, w, $) {
    let j = O || `hook-${V65()}`,
        H = A.agentId ? X0(A.agentId) : bY(),
        J = vA(V8(), H).resolvedPath,
        X = Date.now();
    try {
        let M = $a8(q.prompt, z);
        E(`Hooks: Processing agent hook with prompt: ${M}`);
        let W = [t8({
            content: M
        })];
        E(`Hooks: Starting agent query with ${W.length} messages`);
        let D = q.timeout ? q.timeout * 1000 : 60000,
            Z = F5(),
            {
                signal: G,
                cleanup: f
            } = GL(Y, {
                timeoutMs: D
            }),
            v = () => Z.abort();
        G.addEventListener("abort", v);
        let V = Z.signal;
        try {
            let k = G65(),
                R = [...A.options.tools.filter((g) => !e3(g, iW)).filter((g) => !c56.has(g.name)), k],
                h = sK([`You are verifying a stop condition in Claude Code. Your task is to verify that the agent completed the given plan. The conversation transcript is available at: ${J}
You can read this file to analyze the conversation history if needed.

Use the available tools to inspect the codebase and verify the condition.
Use as few steps as possible - be efficient and direct.

When done, return your result using the ${iW} tool with:
- ok: true if the condition is met
- ok: false with reason if the condition is not met`]),
                C = q.model ?? OM(),
                x = 50,
                B = w2(`hook-agent-${V65()}`),
                m = {
                    ...A,
                    agentId: B,
                    abortController: Z,
                    options: {
                        ...A.options,
                        tools: R,
                        mainLoopModel: C,
                        isNonInteractiveSession: !0,
                        thinkingConfig: {
                            type: "disabled"
                        }
                    },
                    setInProgressToolUseIDs: () => {},
                    getAppState() {
                        let g = A.getAppState(),
                            c = g.toolPermissionContext.alwaysAllowRules.session ?? [];
                        return {
                            ...g,
                            toolPermissionContext: {
                                ...g.toolPermissionContext,
                                mode: "dontAsk",
                                alwaysAllowRules: {
                                    ...g.toolPermissionContext.alwaysAllowRules,
                                    session: [...c, `Read(/${J})`]
                                }
                            }
                        }
                    }
                };
            ja8(A.setAppState, B);
            let S = null,
                F = 0,
                U = !1;
            for await (let g of yy({
                messages: W,
                systemPrompt: h,
                userContext: {},
                systemContext: {},
                canUseTool: LX,
                toolUseContext: m,
                querySource: "hook_agent"
            })) {
                if (Jx6(g, () => {}, (c) => A.addResponseLength(c.length), A.setStreamMode ?? (() => {}), () => {}), g.type === "stream_event" || g.type === "stream_request_start") continue;
                if (g.type === "assistant") {
                    if (F++, F >= 50) {
                        U = !0, E(`Hooks: Agent turn ${F} hit max turns, aborting`), Z.abort();
                        break
                    }
                }
                if (g.type === "attachment" && g.attachment.type === "structured_output") {
                    let c = vz8().safeParse(g.attachment.data);
                    if (c.success) {
                        S = c.data, E(`Hooks: Got structured output: ${I6(S)}`), Z.abort();
                        break
                    }
                }
            }
            if (G.removeEventListener("abort", v), f(), iK8(A.setAppState, B), !S) {
                if (U) return E("Hooks: Agent hook did not complete within 50 turns"), d("tengu_agent_stop_hook_max_turns", {
                    durationMs: Date.now() - X,
                    turnCount: F,
                    agentName: $
                }), {
                    hook: q,
                    outcome: "cancelled"
                };
                return E("Hooks: Agent hook did not return structured output"), d("tengu_agent_stop_hook_error", {
                    durationMs: Date.now() - X,
                    turnCount: F,
                    errorType: 1,
                    agentName: $
                }), {
                    hook: q,
                    outcome: "cancelled"
                }
            }
            if (!S.ok) return E(`Hooks: Agent hook condition was not met: ${S.reason}`), {
                hook: q,
                outcome: "blocking",
                blockingError: {
                    blockingError: `Agent hook condition was not met: ${S.reason}`,
                    command: q.prompt
                }
            };
            return E("Hooks: Agent hook condition was met"), d("tengu_agent_stop_hook_success", {
                durationMs: Date.now() - X,
                turnCount: F,
                agentName: $
            }), {
                hook: q,
                outcome: "success",
                message: Y4({
                    type: "hook_success",
                    hookName: K,
                    toolUseID: j,
                    hookEvent: _,
                    content: ""
                })
            }
        } catch (k) {
            if (G.removeEventListener("abort", v), f(), V.aborted) return {
                hook: q,
                outcome: "cancelled"
            };
            throw k
        }
    } catch (M) {
        let P = b6(M);
        return E(`Hooks: Agent hook error: ${P}`), d("tengu_agent_stop_hook_error", {
            durationMs: Date.now() - X,
            errorType: 2,
            agentName: $
        }), {
            hook: q,
            outcome: "non_blocking_error",
            message: Y4({
                type: "hook_non_blocking_error",
                hookName: K,
                toolUseID: j,
                hookEvent: _,
                stderr: `Error executing agent hook: ${P}`,
                stdout: "",
                exitCode: 1
            })
        }
    }
}
// @from(Ln 499915, Col 4)
N65 = L(() => {
    s56();
    C8();
    gq();
    td();
    $0();
    Cf();
    x$();
    ZM();
    uu6();
    K8();
    m8();
    Yq();
    _7();
    Sq();
    g$();
    g4();
    e8();
    Ha8();
    ty()
})
// @from(Ln 499943, Col 0)
function E65(q) {
    let K = L65(q);
    if (K === 4) return h65(q);
    if (K === 6) return EeY(q);
    return !1
}
// @from(Ln 499950, Col 0)
function h65(q) {
    let K = q.split(".").map(Number),
        [_, z] = K;
    if (K.length !== 4 || _ === void 0 || z === void 0 || K.some((Y) => Number.isNaN(Y))) return !1;
    if (_ === 127) return !1;
    if (_ === 0) return !0;
    if (_ === 10) return !0;
    if (_ === 169 && z === 254) return !0;
    if (_ === 172 && z >= 16 && z <= 31) return !0;
    if (_ === 100 && z >= 64 && z <= 127) return !0;
    if (_ === 192 && z === 168) return !0;
    return !1
}
// @from(Ln 499964, Col 0)
function EeY(q) {
    let K = q.toLowerCase();
    if (K === "::1") return !1;
    if (K === "::") return !0;
    let _ = LeY(K);
    if (_ !== null) return h65(_);
    if (K.startsWith("fc") || K.startsWith("fd")) return !0;
    let z = K.split(":")[0];
    if (z && z.length === 4 && z >= "fe80" && z <= "febf") return !0;
    return !1
}
// @from(Ln 499976, Col 0)
function yeY(q) {
    let K = [];
    if (q.includes(".")) {
        let j = q.lastIndexOf(":"),
            H = q.slice(j + 1);
        q = q.slice(0, j);
        let J = H.split(".").map(Number);
        if (J.length !== 4 || J.some((X) => !Number.isInteger(X) || X < 0 || X > 255)) return null;
        K = [J[0] << 8 | J[1], J[2] << 8 | J[3]]
    }
    let _ = q.indexOf("::"),
        z, Y;
    if (_ === -1) z = q.split(":"), Y = [];
    else {
        let j = q.slice(0, _),
            H = q.slice(_ + 2);
        z = j === "" ? [] : j.split(":"), Y = H === "" ? [] : H.split(":")
    }
    let O = 8 - K.length - z.length - Y.length;
    if (O < 0) return null;
    let $ = [...z, ...Array(O).fill("0"), ...Y].map((j) => parseInt(j, 16));
    if ($.some((j) => Number.isNaN(j) || j < 0 || j > 65535)) return null;
    return $.push(...K), $.length === 8 ? $ : null
}
// @from(Ln 500001, Col 0)
function LeY(q) {
    let K = yeY(q);
    if (!K) return null;
    if (K[0] === 0 && K[1] === 0 && K[2] === 0 && K[3] === 0 && K[4] === 0 && K[5] === 65535) {
        let _ = K[6],
            z = K[7];
        return `${_>>8}.${_&255}.${z>>8}.${z&255}`
    }
    return null
}
// @from(Ln 500012, Col 0)
function R65(q, K, _) {
    let z = "all" in K && K.all === !0,
        Y = L65(q);
    if (Y !== 0) {
        if (E65(q)) {
            _(y65(q, q), "");
            return
        }
        let A = Y === 6 ? 6 : 4;
        if (z) _(null, [{
            address: q,
            family: A
        }]);
        else _(null, q, A);
        return
    }
    NeY(q, {
        all: !0
    }, (A, O) => {
        if (A) {
            _(A, "");
            return
        }
        for (let {
                address: j
            }
            of O)
            if (E65(j)) {
                _(y65(q, j), "");
                return
            } let w = O[0];
        if (!w) {
            _(Object.assign(Error(`ENOTFOUND ${q}`), {
                code: "ENOTFOUND",
                hostname: q
            }), "");
            return
        }
        let $ = w.family === 6 ? 6 : 4;
        if (z) _(null, O.map((j) => ({
            address: j.address,
            family: j.family === 6 ? 6 : 4
        })));
        else _(null, w.address, $)
    })
}
// @from(Ln 500059, Col 0)
function y65(q, K) {
    let _ = Error(`HTTP hook blocked: ${q} resolves to ${K} (private/link-local address). Loopback (127.0.0.1, ::1) is allowed for local dev.`);
    return Object.assign(_, {
        code: "ERR_HTTP_HOOK_BLOCKED_ADDRESS",
        hostname: q,
        address: K
    })
}
// @from(Ln 500067, Col 4)
S65 = () => {}
// @from(Ln 500068, Col 0)
async function ReY() {
    let {
        SandboxManager: q
    } = await Promise.resolve().then(() => (yY(), zJ4));
    if (!q.isSandboxingEnabled()) return;
    await q.waitForNetworkInitialization();
    let K = q.getProxyPort();
    if (!K) return;
    return {
        host: "127.0.0.1",
        port: K,
        protocol: "http"
    }
}
// @from(Ln 500083, Col 0)
function SeY() {
    let q = v7();
    return {
        allowedUrls: q.allowedHttpHookUrls,
        allowedEnvVars: q.httpHookAllowedEnvVars
    }
}
// @from(Ln 500091, Col 0)
function CeY(q, K) {
    let z = K.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replaceAll("*", ".*");
    return new RegExp(`^${z}$`).test(q)
}
// @from(Ln 500096, Col 0)
function beY(q) {
    return q.replace(/[\r\n\x00]/g, "")
}
// @from(Ln 500100, Col 0)
function IeY(q, K) {
    let _ = q.replace(/\$\{([A-Z_][A-Z0-9_]*)\}|\$([A-Z_][A-Z0-9_]*)/g, (z, Y, A) => {
        let O = Y ?? A;
        if (!K.has(O)) return E(`Hooks: env var $${O} not in allowedEnvVars, skipping interpolation`, {
            level: "warn"
        }), "";
        return Dk()[O] ?? ""
    });
    return beY(_)
}
// @from(Ln 500110, Col 0)
async function tH7(q, K, _, z) {
    let Y = SeY();
    if (Y.allowedUrls !== void 0) {
        if (!Y.allowedUrls.some((j) => CeY(q.url, j))) {
            let j = `HTTP hook blocked: ${q.url} does not match any pattern in allowedHttpHookUrls`;
            return E(j, {
                level: "warn"
            }), {
                ok: !1,
                body: "",
                error: j
            }
        }
    }
    let A = q.timeout ? q.timeout * 1000 : heY,
        {
            signal: O,
            cleanup: w
        } = GL(z, {
            timeoutMs: A
        });
    try {
        let $ = {
            "Content-Type": "application/json"
        };
        if (q.headers) {
            let M = q.allowedEnvVars ?? [],
                P = Y.allowedEnvVars !== void 0 ? M.filter((D) => Y.allowedEnvVars.includes(D)) : M,
                W = new Set(P);
            for (let [D, Z] of Object.entries(q.headers)) $[D] = IeY(Z, W)
        }
        let j = await ReY(),
            H = !j && ME() !== void 0 && !Xo(q.url);
        if (j) E(`Hooks: HTTP hook POST to ${q.url} (via sandbox proxy :${j.port})`);
        else if (H) E(`Hooks: HTTP hook POST to ${q.url} (via env-var proxy)`);
        else E(`Hooks: HTTP hook POST to ${q.url}`);
        let J = await Z1.post(q.url, _, {
            headers: $,
            signal: O,
            responseType: "text",
            validateStatus: () => !0,
            maxRedirects: 0,
            proxy: j ?? !1,
            lookup: j || H ? void 0 : R65
        });
        w();
        let X = J.data ?? "";
        return E(`Hooks: HTTP hook response status ${J.status}, body length ${X.length}`), {
            ok: J.status >= 200 && J.status < 300,
            statusCode: J.status,
            body: X
        }
    } catch ($) {
        if (w(), O.aborted) return {
            ok: !1,
            body: "",
            aborted: !0
        };
        let j = b6($);
        return E(`Hooks: HTTP hook error: ${j}`, {
            level: "error"
        }), {
            ok: !1,
            body: "",
            error: j
        }
    }
}
// @from(Ln 500178, Col 4)
heY = 600000
// @from(Ln 500179, Col 4)
C65 = L(() => {
    CK();
    uu6();
    K8();
    m8();
    _M();
    a1();
    zy();
    S65()
})
// @from(Ln 500189, Col 0)
async function oc(q, K, _ = u_) {
    let z = {
            ...J9(void 0),
            hook_event_name: "PreCompact",
            trigger: q.trigger,
            custom_instructions: q.customInstructions
        },
        Y = await BX({
            hookInput: z,
            matchQuery: q.trigger,
            signal: K,
            timeoutMs: _
        });
    if (Y.length === 0) return {};
    let A = Y.filter(($) => $.succeeded && !$.blocked && $.output.trim().length > 0).map(($) => $.output.trim()),
        O = [];
    for (let $ of Y)
        if ($.succeeded && !$.blocked)
            if ($.output.trim()) O.push(`PreCompact [${$.command}] completed successfully: ${$.output.trim()}`);
            else O.push(`PreCompact [${$.command}] completed successfully`);
    else if ($.output.trim()) O.push(`PreCompact [${$.command}] failed: ${$.output.trim()}`);
    else O.push(`PreCompact [${$.command}] failed`);
    let w = Y.filter(($) => $.blocked);
    return {
        newCustomInstructions: A.length > 0 ? A.join(`

`) : void 0,
        userDisplayMessage: O.length > 0 ? O.join(`
`) : void 0,
        ...w.length > 0 && {
            blockedBy: w.map(($) => {
                let j = $.output.trim();
                return `[${$.command}]${j?`: ${j}`:""}`
            }).join(`
`)
        }
    }
}
// @from(Ln 500227, Col 0)
async function K36(q, K, _ = u_) {
    let z = {
            ...J9(void 0),
            hook_event_name: "PostCompact",
            trigger: q.trigger,
            compact_summary: q.compactSummary
        },
        Y = await BX({
            hookInput: z,
            matchQuery: q.trigger,
            signal: K,
            timeoutMs: _
        });
    if (Y.length === 0) return {};
    let A = [];
    for (let O of Y)
        if (O.succeeded)
            if (O.output.trim()) A.push(`PostCompact [${O.command}] completed successfully: ${O.output.trim()}`);
            else A.push(`PostCompact [${O.command}] completed successfully`);
    else if (O.output.trim()) A.push(`PostCompact [${O.command}] failed: ${O.output.trim()}`);
    else A.push(`PostCompact [${O.command}] failed`);
    return {
        userDisplayMessage: A.length > 0 ? A.join(`
`) : void 0
    }
}
// @from(Ln 500253, Col 4)
b65 = L(() => {
    K9()
})
// @from(Ln 500256, Col 0)
async function KK6(q, K, _ = u_) {
    let z = {
            ...J9(void 0),
            hook_event_name: "ConfigChange",
            source: q,
            file_path: K
        },
        Y = await BX({
            hookInput: z,
            timeoutMs: _,
            matchQuery: q
        });
    if (q === "policy_settings") return Y.map((A) => ({
        ...A,
        blocked: !1
    }));
    return Y
}
// @from(Ln 500274, Col 4)
I65 = L(() => {
    K9()
})
// @from(Ln 500277, Col 0)
async function O98({
    serverName: q,
    message: K,
    requestedSchema: _,
    permissionMode: z,
    signal: Y,
    timeoutMs: A = u_,
    mode: O,
    url: w,
    elicitationId: $
}) {
    let j = {
            ...J9(z),
            hook_event_name: "Elicitation",
            mcp_server_name: q,
            message: K,
            mode: O,
            url: w,
            elicitation_id: $,
            requested_schema: _
        },
        H = await BX({
            hookInput: j,
            matchQuery: q,
            signal: Y,
            timeoutMs: A
        }),
        J, X;
    for (let M of H) {
        let P = Ja8(M, "Elicitation");
        if (P.blockingError) X = P.blockingError;
        if (P.response) J = P.response
    }
    return {
        elicitationResponse: J,
        blockingError: X
    }
}
// @from(Ln 500315, Col 0)
async function w98({
    serverName: q,
    action: K,
    content: _,
    permissionMode: z,
    signal: Y,
    timeoutMs: A = u_,
    mode: O,
    elicitationId: w
}) {
    let $ = {
            ...J9(z),
            hook_event_name: "ElicitationResult",
            mcp_server_name: q,
            elicitation_id: w,
            mode: O,
            action: K,
            content: _
        },
        j = await BX({
            hookInput: $,
            matchQuery: q,
            signal: Y,
            timeoutMs: A
        }),
        H, J;
    for (let X of j) {
        let M = Ja8(X, "ElicitationResult");
        if (M.blockingError) J = M.blockingError;
        if (M.response) H = M.response
    }
    return {
        elicitationResultResponse: H,
        blockingError: J
    }
}
// @from(Ln 500351, Col 4)
x65 = L(() => {
    K9()
})
// @from(Ln 500354, Col 0)
async function u65(q, K) {
    let _ = await BX({
        hookInput: q,
        timeoutMs: K
    });
    if (_.length > 0) xh6();
    let z = _.flatMap((A) => A.watchPaths ?? []),
        Y = _.map((A) => A.systemMessage).filter((A) => !!A);
    return {
        results: _,
        watchPaths: z,
        systemMessages: Y
    }
}
// @from(Ln 500369, Col 0)
function k18(q, K, _ = u_) {
    let z = {
        ...J9(void 0),
        hook_event_name: "CwdChanged",
        old_cwd: q,
        new_cwd: K
    };
    return u65(z, _)
}
// @from(Ln 500379, Col 0)
function N18(q, K, _ = u_) {
    let z = {
        ...J9(void 0),
        hook_event_name: "FileChanged",
        file_path: q,
        event: K
    };
    return u65(z, _)
}
// @from(Ln 500388, Col 4)
m65 = L(() => {
    K9();
    oH6()
})
// @from(Ln 500392, Col 0)
async function aj6(q, K, _, z) {
    let {
        globs: Y,
        triggerFilePath: A,
        parentFilePath: O,
        timeoutMs: w = u_
    } = z ?? {}, $ = {
        ...J9(void 0),
        hook_event_name: "InstructionsLoaded",
        file_path: q,
        memory_type: K,
        load_reason: _,
        globs: Y,
        trigger_file_path: A,
        parent_file_path: O
    };
    await BX({
        hookInput: $,
        timeoutMs: w,
        matchQuery: _
    })
}
// @from(Ln 500414, Col 4)
B65 = L(() => {
    K9()
})
// @from(Ln 500417, Col 0)
async function lx(q, K = u_) {
    let {
        message: _,
        title: z,
        notificationType: Y
    } = q, A = {
        ...J9(void 0),
        hook_event_name: "Notification",
        message: _,
        title: z,
        notification_type: Y
    };
    await BX({
        hookInput: A,
        timeoutMs: K,
        matchQuery: Y
    })
}
// @from(Ln 500435, Col 4)
p65 = L(() => {
    K9()
})
// @from(Ln 500441, Col 0)
async function* E18(q, K, _, z, Y, A = u_, O) {
    let w = {
        ...J9(void 0, K),
        hook_event_name: "SessionStart",
        source: q,
        agent_type: _,
        model: z
    };
    yield* E0({
        hookInput: w,
        toolUseID: eH7(),
        matchQuery: q,
        signal: Y,
        timeoutMs: A,
        forceSyncExecution: O
    })
}
// @from(Ln 500458, Col 0)
async function* y18(q, K, _ = u_, z) {
    let Y = {
        ...J9(void 0),
        hook_event_name: "Setup",
        trigger: q
    };
    yield* E0({
        hookInput: Y,
        toolUseID: eH7(),
        matchQuery: q,
        signal: K,
        timeoutMs: _,
        forceSyncExecution: z
    })
}
// @from(Ln 500473, Col 0)
async function* f38(q, K, _, z = u_) {
    let Y = {
        ...J9(void 0),
        hook_event_name: "SubagentStart",
        agent_id: q,
        agent_type: K
    };
    yield* E0({
        hookInput: Y,
        toolUseID: eH7(),
        matchQuery: K,
        signal: _,
        timeoutMs: z
    })
}
// @from(Ln 500488, Col 0)
async function VP6(q, K) {
    let {
        getAppState: _,
        setAppState: z,
        signal: Y
    } = K || {}, A = {
        ...J9(void 0),
        hook_event_name: "SessionEnd",
        reason: q
    }, O = await BX({
        getAppState: _,
        hookInput: A,
        matchQuery: q,
        signal: Y,
        timeoutMs: Xa8
    });
    for (let w of O)
        if (!w.succeeded && w.output) process.stderr.write(`SessionEnd hook [${w.command}] failed: ${w.output}
`);
    if (z) {
        let w = I8();
        iK8(z, w)
    }
}
// @from(Ln 500512, Col 4)
F65 = L(() => {
    y8();
    K9();
    ty()
})
// @from(Ln 500520, Col 0)
async function gM6(q, K, _ = u_) {
    let z = K?.getAppState(),
        Y = I8();
    if (!pn("StopFailure", z, Y)) return;
    let A = s5(q.message.content, `
`).trim() || void 0,
        O = q.error ?? "unknown",
        w = {
            ...J9(void 0, void 0, K),
            hook_event_name: "StopFailure",
            error: O,
            error_details: q.errorDetails,
            last_assistant_message: A
        };
    await BX({
        getAppState: K?.getAppState,
        hookInput: w,
        timeoutMs: _,
        matchQuery: O
    })
}
// @from(Ln 500541, Col 0)
async function* w_6(q, K, _ = u_, z = !1, Y, A, O, w, $) {
    let j = Y ? "SubagentStop" : "Stop",
        H = A?.getAppState(),
        J = A?.agentId ?? I8();
    if (!pn(j, H, J)) return;
    let X = O ? fM(O) : void 0,
        M = X ? s5(X.message.content, `
`).trim() || void 0 : void 0,
        P = Y ? {
            ...J9(q),
            hook_event_name: "SubagentStop",
            stop_hook_active: z,
            agent_id: Y,
            agent_transcript_path: X0(Y),
            agent_type: w ?? "",
            last_assistant_message: M
        } : {
            ...J9(q),
            hook_event_name: "Stop",
            stop_hook_active: z,
            last_assistant_message: M
        },
        W;
    yield* E0({
        hookInput: P,
        extendedHookInput: W,
        toolUseID: xeY(),
        signal: K,
        timeoutMs: _,
        toolUseContext: A,
        messages: O,
        requestPrompt: $
    })
}
// @from(Ln 500575, Col 4)
g65 = L(() => {
    y8();
    K9();
    _7();
    g4()
})
// @from(Ln 500584, Col 0)
async function* W38(q, K, _, z, Y = u_) {
    let A = {
        ...J9(_),
        hook_event_name: "TeammateIdle",
        teammate_name: q,
        team_name: K
    };
    yield* E0({
        hookInput: A,
        toolUseID: qJ7(),
        signal: z,
        timeoutMs: Y
    })
}
// @from(Ln 500598, Col 0)
async function* e58(q, K, _, z, Y, A, O, w = u_, $) {
    let j = {
        ...J9(A),
        hook_event_name: "TaskCreated",
        task_id: q,
        task_subject: K,
        task_description: _,
        teammate_name: z,
        team_name: Y
    };
    yield* E0({
        hookInput: j,
        toolUseID: qJ7(),
        signal: O,
        timeoutMs: w,
        toolUseContext: $
    })
}
// @from(Ln 500616, Col 0)
async function* CM6(q, K, _, z, Y, A, O, w = u_, $) {
    let j = {
        ...J9(A),
        hook_event_name: "TaskCompleted",
        task_id: q,
        task_subject: K,
        task_description: _,
        teammate_name: z,
        team_name: Y
    };
    yield* E0({
        hookInput: j,
        toolUseID: qJ7(),
        signal: O,
        timeoutMs: w,
        toolUseContext: $
    })
}
// @from(Ln 500634, Col 4)
U65 = L(() => {
    K9()
})
// @from(Ln 500637, Col 0)
async function* Q58(q, K, _, z, Y, A, O = u_, w, $) {
    let j = z.getAppState(),
        H = z.agentId ?? I8();
    if (!pn("PreToolUse", j, H)) return;
    E(`executePreToolHooks called for tool: ${q}`, {
        level: "verbose"
    });
    let J = {
        ...J9(Y, void 0, z),
        hook_event_name: "PreToolUse",
        tool_name: q,
        tool_input: _,
        tool_use_id: K
    };
    yield* E0({
        hookInput: J,
        toolUseID: K,
        matchQuery: q,
        signal: A,
        timeoutMs: O,
        toolUseContext: z,
        requestPrompt: w,
        toolInputSummary: $
    })
}
// @from(Ln 500662, Col 0)
async function* d58(q, K, _, z, Y, A, O, w = u_) {
    let $ = {
        ...J9(A, void 0, Y),
        hook_event_name: "PostToolUse",
        tool_name: q,
        tool_input: _,
        tool_response: z,
        tool_use_id: K
    };
    yield* E0({
        hookInput: $,
        toolUseID: K,
        matchQuery: q,
        signal: O,
        timeoutMs: w,
        toolUseContext: Y
    })
}
// @from(Ln 500680, Col 0)
async function* c58(q, K, _, z, Y, A, O, w, $ = u_) {
    let j = Y.getAppState(),
        H = Y.agentId ?? I8();
    if (!pn("PostToolUseFailure", j, H)) return;
    let J = {
        ...J9(O, void 0, Y),
        hook_event_name: "PostToolUseFailure",
        tool_name: q,
        tool_input: _,
        tool_use_id: K,
        error: z,
        is_interrupt: A
    };
    yield* E0({
        hookInput: J,
        toolUseID: K,
        matchQuery: q,
        signal: w,
        timeoutMs: $,
        toolUseContext: Y
    })
}
// @from(Ln 500702, Col 0)
async function* $38(q, K, _, z, Y, A, O, w = u_) {
    let $ = Y.getAppState(),
        j = Y.agentId ?? I8();
    if (!pn("PermissionDenied", $, j)) return;
    let H = {
        ...J9(A, void 0, Y),
        hook_event_name: "PermissionDenied",
        tool_name: q,
        tool_input: _,
        tool_use_id: K,
        reason: z
    };
    yield* E0({
        hookInput: H,
        toolUseID: K,
        matchQuery: q,
        signal: O,
        timeoutMs: w,
        toolUseContext: Y
    })
}
// @from(Ln 500723, Col 0)
async function* Be(q, K, _, z, Y, A, O, w = u_, $, j) {
    E(`executePermissionRequestHooks called for tool: ${q}`);
    let H = {
        ...J9(Y, void 0, z),
        hook_event_name: "PermissionRequest",
        tool_name: q,
        tool_input: _,
        permission_suggestions: A
    };
    yield* E0({
        hookInput: H,
        toolUseID: K,
        matchQuery: q,
        signal: O,
        timeoutMs: w,
        toolUseContext: z,
        requestPrompt: $,
        toolInputSummary: j
    })
}
// @from(Ln 500743, Col 4)
Q65 = L(() => {
    y8();
    K8();
    K9()
})
// @from(Ln 500752, Col 0)
function d65(q) {
    return [...q.replace(/[\x00-\x1f\x7f-\x9f]/g, "")].slice(0, meY).join("")
}
// @from(Ln 500755, Col 0)
async function Ma8(q) {
    if (Lz()) return;
    let K = d65(q);
    if (!K) return;
    let _ = I8(),
        z = NH(_);
    if (K === (z && d65(z))) return;
    E(`Hook sessionTitle applied (${[...K].length} chars)`), await AN(_, K, void 0, "hook"), await oP6(_, K, void 0, "hook")
}
// @from(Ln 500764, Col 0)
async function* Tz8(q, K, _, z) {
    let Y = _.getAppState(),
        A = _.agentId ?? I8();
    if (!pn("UserPromptSubmit", Y, A)) return;
    let O = {
        ...J9(K),
        hook_event_name: "UserPromptSubmit",
        prompt: q,
        session_title: NH(I8())
    };
    yield* E0({
        hookInput: O,
        toolUseID: ueY(),
        signal: _.abortController.signal,
        timeoutMs: u_,
        toolUseContext: _,
        requestPrompt: z
    })
}
// @from(Ln 500783, Col 4)
meY = 200
// @from(Ln 500784, Col 4)
c65 = L(() => {
    y8();
    S_8();
    K8();
    K9();
    g4();
    zY()
})
// @from(Ln 500792, Col 0)
async function kW6(q) {
    let K = {
            ...J9(void 0),
            hook_event_name: "WorktreeCreate",
            name: q
        },
        _ = await BX({
            hookInput: K,
            timeoutMs: u_
        }),
        z = _.find((A) => A.succeeded && A.output.trim().length > 0);
    if (!z) {
        let A = _.filter((O) => !O.succeeded).map((O) => `${O.command}: ${O.output.trim()||"no output"}`);
        throw Error(`WorktreeCreate hook failed: ${A.join("; ")||"no successful output"}`)
    }
    return {
        worktreePath: z.output.trim()
    }
}
// @from(Ln 500811, Col 0)
async function mu6(q) {
    let K = Rx()?.WorktreeRemove,
        _ = rL()?.WorktreeRemove,
        z = K && K.length > 0,
        Y = _ && _.length > 0;
    if (!z && !Y) return !1;
    let A = {
            ...J9(void 0),
            hook_event_name: "WorktreeRemove",
            worktree_path: q
        },
        O = await BX({
            hookInput: A,
            timeoutMs: u_
        }),
        w = !1;
    for (let $ of O)
        if ($.succeeded) w = !0;
        else E(`WorktreeRemove hook failed [${$.command}]: ${$.output.trim()}`, {
            level: "error"
        });
    return w
}
// @from(Ln 500834, Col 4)
l65 = L(() => {
    y8();
    K8();
    K9();
    Bc()
})
// @from(Ln 500840, Col 4)
BeY
// @from(Ln 500841, Col 4)
n65 = L(() => {
    b65();
    I65();
    x65();
    m65();
    B65();
    p65();
    F65();
    g65();
    U65();
    Q65();
    c65();
    l65();
    BeY = {
        PreToolUse: Q58,
        PostToolUse: d58,
        PostToolUseFailure: c58,
        PermissionDenied: $38,
        PermissionRequest: Be,
        Notification: lx,
        Stop: w_6,
        SubagentStop: w_6,
        StopFailure: gM6,
        TeammateIdle: W38,
        TaskCreated: e58,
        TaskCompleted: CM6,
        UserPromptSubmit: Tz8,
        SessionStart: E18,
        SessionEnd: VP6,
        Setup: y18,
        SubagentStart: f38,
        PreCompact: oc,
        PostCompact: K36,
        ConfigChange: KK6,
        CwdChanged: k18,
        FileChanged: N18,
        InstructionsLoaded: aj6,
        Elicitation: O98,
        ElicitationResult: w98,
        WorktreeCreate: kW6,
        WorktreeRemove: mu6
    }
})
// @from(Ln 500884, Col 4)
tb8 = {}
// @from(Ln 500948, Col 0)
function d98() {
    let q = process.env.CLAUDE_CODE_SESSIONEND_HOOKS_TIMEOUT_MS,
        K = q ? parseInt(q, 10) : NaN;
    if (Number.isFinite(K) && K > 0) return K;
    let _ = 0;
    for (let z of Rx()?.SessionEnd ?? [])
        for (let Y of z.hooks)
            if (Y.timeout && Y.timeout * 1000 > _) _ = Y.timeout * 1000;
    return Math.max(Xa8, Math.min(_, FeY))
}
// @from(Ln 500959, Col 0)
function r65({
    processId: q,
    hookId: K,
    shellCommand: _,
    asyncResponse: z,
    hookEvent: Y,
    hookName: A,
    command: O,
    asyncRewake: w,
    rewakeMessage: $,
    rewakeSummary: j,
    pluginId: H
}) {
    if (w) {
        let J = _.result.then(async (X) => {
            await new Promise((W) => setImmediate(W));
            let M = await _.taskOutput.getStdout(),
                P = _.taskOutput.getStderr();
            if (_.cleanup(), df({
                    hookId: K,
                    hookName: A,
                    hookEvent: Y,
                    output: M + P,
                    stdout: M,
                    stderr: P,
                    exitCode: X.code,
                    outcome: X.code === 0 ? "success" : "error"
                }), X.code === 2) {
                let W = `Stop hook blocking error from command "${A}":`,
                    D = "Stop hook feedback",
                    Z = IT(`${W} ${P||M}`);
                LY({
                    value: `<${TA}>
<${Mw}>${fJ(D)}</${Mw}>
</${TA}>
${Z}`,
                    mode: "task-notification",
                    stopHookActive: !0
                })
            }
        });
        return !0
    }
    if (!_.background(q)) return !1;
    return fC4({
        processId: q,
        hookId: K,
        asyncResponse: z,
        hookEvent: Y,
        hookName: A,
        command: O,
        shellCommand: _,
        pluginId: H
    }), !0
}
// @from(Ln 501015, Col 0)
function Z66() {
    if (!!I7()) return !1;
    return !EA()
}
// @from(Ln 501020, Col 0)
function J9(q, K, _) {
    let z = K ?? I8(),
        Y = _?.agentType ?? lg();
    return {
        session_id: z,
        transcript_path: xT(z),
        cwd: b8(),
        permission_mode: q,
        agent_id: _?.agentId,
        agent_type: Y
    }
}
// @from(Ln 501033, Col 0)
function a65(q) {
    let K = n8(q),
        _ = xu6().safeParse(K);
    if (_.success) return E("Successfully parsed and validated hook JSON output"), {
        json: _.data
    };
    let z = _.error.issues,
        Y = z[0],
        A = Y ? `${Y.path.join(".")||"(root)"}: ${Y.message}` : "unknown error";
    if (K && typeof K === "object" && "hookSpecificOutput" in K && K.hookSpecificOutput && typeof K.hookSpecificOutput === "object" && !Array.isArray(K.hookSpecificOutput) && !("hookEventName" in K.hookSpecificOutput)) A = 'hookSpecificOutput is missing required field "hookEventName"';
    let O = z.slice(1).map((w) => `  - ${w.path.join(".")||"(root)"}: ${w.message}`).join(`
`);
    return {
        validationError: `Hook JSON output validation failed — ${A}${O?`
`+O:""}

The hook's output was: ${I6(K,null,2)}`
    }
}
// @from(Ln 501052, Col 0)
async function Vz8(q, K, _, z = pP4) {
    if (q.length <= z) return q;
    let Y = await _L6(q, `hook-${K}-${_}`);
    if (YL6(Y)) return d("tengu_hook_output_persisted", {
        source: _,
        originalSizeBytes: q.length,
        persistedSizeBytes: 0,
        truncatedFallback: !0
    }), `${q.slice(0,z)}

[Hook ${_} truncated at ${z} chars — persist-to-disk failed: ${Y.error}]`;
    let A = lK6(Y);
    return d("tengu_hook_output_persisted", {
        source: _,
        originalSizeBytes: Y.originalSize,
        persistedSizeBytes: A.length,
        truncatedFallback: !1
    }), A
}
// @from(Ln 501072, Col 0)
function s65(q) {
    let K = q.trim();
    if (!K.startsWith("{")) return E("Hook output does not start with {, treating as plain text"), {
        plainText: q
    };
    try {
        let _ = a65(K);
        if ("json" in _) return _;
        let z = `${_.validationError}

Expected schema:
${I6({continue:"boolean (optional)",suppressOutput:"boolean (optional)",stopReason:"string (optional)",decision:'"approve" | "block" (optional)',reason:"string (optional)",systemMessage:"string (optional)",permissionDecision:'"allow" | "deny" | "ask" (optional)',hookSpecificOutput:{"for PreToolUse":{hookEventName:'"PreToolUse"',permissionDecision:'"allow" | "deny" | "ask" | "defer" (optional)',permissionDecisionReason:"string (optional)",updatedInput:"object (optional) - Modified tool input to use"},"for UserPromptSubmit":{hookEventName:'"UserPromptSubmit"',additionalContext:"string (required)"},"for PostToolUse":{hookEventName:'"PostToolUse"',additionalContext:"string (optional)"}}},null,2)}`;
        return E(z), {
            plainText: q,
            validationError: z
        }
    } catch (_) {
        return E(`Failed to parse hook output as JSON: ${_}`), {
            plainText: q
        }
    }
}
// @from(Ln 501095, Col 0)
function t65(q) {
    let K = q.trim();
    if (K === "") {
        let _ = xu6().safeParse({});
        if (_.success) return E("HTTP hook returned empty body, treating as empty JSON object"), {
            json: _.data
        }
    }
    if (!K.startsWith("{")) {
        let _ = `HTTP hook must return JSON, but got non-JSON response body: ${K.length>200?K.slice(0,200)+"…":K}`;
        return E(_), {
            validationError: _
        }
    }
    try {
        let _ = a65(K);
        if ("json" in _) return _;
        return E(_.validationError), _
    } catch (_) {
        let z = `HTTP hook must return valid JSON, but parsing failed: ${_}`;
        return E(z), {
            validationError: z
        }
    }
}