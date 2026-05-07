
// @from(Ln 426826, Col 0)
async function yK8(q, K) {
    let _ = await Kd("tengu_auto_mode_config", {}),
        z = nY7(_?.enabled),
        Y = lY7();
    if (!(DG?.isAutoModeCircuitBroken() ?? !1)) DG?.setAutoModeCircuitBroken(z === "disabled" || Y);
    let A = G5(),
        O = !!_?.disableFastMode && (!!K || !1),
        w = Dk6(A) && !O,
        $ = !1;
    if (z !== "disabled" && !Y && w) $ = z === "enabled" || Wn8();
    let j = z !== "disabled" && !Y && w;
    E(`[auto-mode] verifyAutoModeGateAccess: enabledState=${z} disabledBySettings=${Y} model=${A} modelSupported=${w} disableFastModeBreakerFires=${O} carouselAvailable=${$} canEnterAuto=${j}`);
    let H = DG?.getAutoModeFlagCli() ?? !1,
        J = (G, f) => {
            if (G.isAutoModeAvailable !== f) E(`[auto-mode] verifyAutoModeGateAccess setAvailable: ${G.isAutoModeAvailable} -> ${f}`);
            return G.isAutoModeAvailable === f ? G : {
                ...G,
                isAutoModeAvailable: f
            }
        };
    if (j) return {
        updateContext: (G) => J(G, $)
    };
    let X;
    if (Y) X = "settings", E("auto mode disabled: disableAutoMode in settings", {
        level: "warn"
    });
    else if (z === "disabled") X = "circuit-breaker", E('auto mode disabled: tengu_auto_mode_config.enabled === "disabled" (circuit breaker)', {
        level: "warn"
    });
    else X = "model", E(`auto mode disabled: model ${G5()} does not support auto mode`, {
        level: "warn"
    });
    let M = E_6(X),
        P = (G) => {
            let f = G.mode === "auto";
            E(`[auto-mode] kickOutOfAutoIfNeeded applying: ctx.mode=${G.mode} ctx.prePlanMode=${G.prePlanMode} reason=${X}`);
            let v = G.mode === "plan" && (G.prePlanMode === "auto" || !!G.strippedDangerousRules);
            if (!f && !v) return J(G, !1);
            if (f) return DG?.setAutoModeActive(!1), sG(!0), {
                ...EY(pe(G), {
                    type: "setMode",
                    mode: "default",
                    destination: "session"
                }),
                isAutoModeAvailable: !1
            };
            return DG?.setAutoModeActive(!1), sG(!0), {
                ...pe(G),
                prePlanMode: G.prePlanMode === "auto" ? "default" : G.prePlanMode,
                isAutoModeAvailable: !1
            }
        },
        W = q.mode === "auto",
        D = q.mode === "plan" && (q.prePlanMode === "auto" || !!q.strippedDangerousRules);
    if (!(W || D || H)) return {
        updateContext: P
    };
    if (W || D) return {
        updateContext: P,
        notification: M
    };
    return {
        updateContext: P,
        notification: q.isAutoModeAvailable ? M : void 0
    }
}
// @from(Ln 426894, Col 0)
function Bg8() {
    return Ab1("tengu_disable_bypass_permissions_mode")
}
// @from(Ln 426898, Col 0)
function lY7() {
    let q = y7() || {};
    return q.disableAutoMode === "disable" || q.permissions?.disableAutoMode === "disable"
}
// @from(Ln 426903, Col 0)
function $L() {
    if (DG?.isAutoModeCircuitBroken() ?? !1) return !1;
    if (lY7()) return !1;
    if (!Dk6(G5())) return !1;
    return !0
}
// @from(Ln 426910, Col 0)
function ge() {
    if (lY7()) return "settings";
    if (DG?.isAutoModeCircuitBroken() ?? !1) return "circuit-breaker";
    if (!Dk6(G5())) return "model";
    return null
}
// @from(Ln 426917, Col 0)
function nY7(q) {
    if (q === "enabled" || q === "disabled" || q === "opt-in") return q;
    return pkY
}
// @from(Ln 426922, Col 0)
function L98() {
    let q = u8("tengu_auto_mode_config", {});
    return nY7(q?.enabled)
}
// @from(Ln 426927, Col 0)
function Pn8() {
    let q = u8("tengu_auto_mode_config", MCK);
    if (q === MCK) return;
    return nY7(q?.enabled)
}
// @from(Ln 426933, Col 0)
function Wn8() {
    if (DG?.getAutoModeFlagCli() ?? !1) return !0;
    return VU()
}
// @from(Ln 426938, Col 0)
function wt() {
    let q = Tw("tengu_disable_bypass_permissions_mode"),
        _ = (y7() || {}).permissions?.disableBypassPermissionsMode === "disable";
    return q || _
}
// @from(Ln 426944, Col 0)
function NJ6(q) {
    let K = q;
    if (q.mode === "bypassPermissions") K = EY(q, {
        type: "setMode",
        mode: "default",
        destination: "session"
    });
    return {
        ...K,
        isBypassPermissionsModeAvailable: !1
    }
}
// @from(Ln 426956, Col 0)
async function iY7(q) {
    if (!q.isBypassPermissionsModeAvailable) return;
    if (!await Bg8()) return;
    E("bypassPermissions mode is being disabled by Statsig gate (async check)", {
        level: "warn"
    }), WK(1, "bypass_permissions_disabled")
}
// @from(Ln 426964, Col 0)
function rY7() {
    return (y7() || {}).permissions?.defaultMode === "auto"
}
// @from(Ln 426968, Col 0)
function oY7() {
    return VU() && $L() && cO1()
}
// @from(Ln 426972, Col 0)
function zI6(q) {
    let K = q.mode;
    if (K === "plan") return q;
    {
        let _ = oY7();
        if (K === "auto") {
            if (_) return {
                ...q,
                prePlanMode: "auto"
            };
            return DG?.setAutoModeActive(!1), sG(!0), {
                ...pe(q),
                prePlanMode: "auto"
            }
        }
        if (_ && K !== "bypassPermissions") return DG?.setAutoModeActive(!0), {
            ...Pu(q),
            prePlanMode: K
        }
    }
    return E(`[prepareContextForPlanMode] plain plan entry, prePlanMode=${K}`, {
        level: "info"
    }), {
        ...q,
        prePlanMode: K
    }
}
// @from(Ln 427000, Col 0)
function dR6(q) {
    if (q.mode === "auto") return Pu(q);
    if (q.mode !== "plan") return q;
    if (!q.prePlanMode || q.prePlanMode === "bypassPermissions") return q;
    let K = oY7(),
        _ = DG?.isAutoModeActive() ?? !1;
    if (K && _) return Pu(q);
    if (!K && !_) return q;
    if (K) return DG?.setAutoModeActive(!0), sG(!1), Pu(q);
    return DG?.setAutoModeActive(!1), sG(!0), pe(q)
}
// @from(Ln 427011, Col 4)
DG
// @from(Ln 427011, Col 8)
pkY = "opt-in"
// @from(Ln 427012, Col 4)
MCK
// @from(Ln 427013, Col 4)
vX = L(() => {
    y8();
    n7();
    Q8();
    aY();
    a1();
    zy();
    OP();
    g$();
    uI();
    B1();
    gE8();
    C8();
    sY();
    $0();
    Yq();
    pv();
    K8();
    CY();
    Sq();
    NK();
    y_7();
    MH();
    cZ();
    DG = (Kn(), B7(Pe));
    MCK = Symbol("no-cached-auto-mode-config")
})
// @from(Ln 427060, Col 0)
function j_6(q, K = "Custom item") {
    let _ = q.split(`
`);
    for (let z of _) {
        let Y = z.trim();
        if (Y) {
            let O = Y.match(/^#+\s+(.+)$/)?.[1] ?? Y;
            return O.length > 100 ? O.substring(0, 97) + "..." : O
        }
    }
    return K
}
// @from(Ln 427073, Col 0)
function kCK(q) {
    if (q === void 0 || q === null) return null;
    if (!q) return [];
    let K = [];
    if (typeof q === "string") K = [q];
    else if (Array.isArray(q)) K = q.filter((z) => typeof z === "string");
    if (K.length === 0) return [];
    let _ = iR(K);
    if (_.includes("*")) return ["*"];
    return _
}
// @from(Ln 427085, Col 0)
function x56(q) {
    let K = kCK(q);
    if (K === null) return q === void 0 ? void 0 : [];
    if (K.includes("*")) return;
    return K
}
// @from(Ln 427092, Col 0)
function yc(q) {
    let K = kCK(q);
    if (K === null) return [];
    return K
}
// @from(Ln 427097, Col 0)
async function rkY(q) {
    try {
        let K = await UkY(q, {
            bigint: !0
        });
        if (K.dev === 0n && K.ino === 0n) return null;
        return `${K.dev}:${K.ino}`
    } catch {
        return null
    }
}
// @from(Ln 427109, Col 0)
function okY(q) {
    let K = ez(q),
        _ = ez(c9());
    if (!K || !_) return K;
    let z = zj(q);
    if (z && tX(z) === tX(_)) return K;
    let Y = tX(K),
        A = tX(_);
    if (Y !== A && Y.startsWith(A + ikY)) return _;
    return K
}
// @from(Ln 427121, Col 0)
function Q_7(q, K) {
    let _ = TCK(lkY()).normalize("NFC"),
        z = okY(K),
        Y = TCK(K),
        A = [];
    while (!0) {
        if (tX(Y) === tX(_)) break;
        let O = jx6(Y, ".claude", q);
        try {
            gkY(O), A.push(O)
        } catch ($) {
            if (!D5($)) throw $
        }
        if (z && tX(Y) === tX(z)) break;
        let w = nkY(Y);
        if (w === Y) break;
        Y = w
    }
    return A
}
// @from(Ln 427141, Col 0)
async function akY(q, K) {
    let _ = [],
        z = new Set;
    async function Y(A) {
        if (K.aborted) return;
        try {
            let O = await vCK(A, {
                bigint: !0
            });
            if (O.isDirectory()) {
                let w = O.dev !== void 0 && O.ino !== void 0 ? `${O.dev}:${O.ino}` : await ckY(A);
                if (z.has(w)) {
                    E(`Skipping already visited directory (circular symlink): ${A}`);
                    return
                }
                z.add(w)
            }
        } catch (O) {
            let w = O instanceof Error ? O.message : String(O);
            E(`Failed to stat directory ${A}: ${w}`);
            return
        }
        try {
            let O = await QkY(A, {
                withFileTypes: !0
            });
            for (let w of O) {
                if (K.aborted) break;
                let $ = jx6(A, w.name);
                try {
                    if (w.isSymbolicLink()) try {
                            let j = await vCK($);
                            if (j.isDirectory()) await Y($);
                            else if (j.isFile() && w.name.endsWith(".md")) _.push($)
                        } catch (j) {
                            let H = j instanceof Error ? j.message : String(j);
                            E(`Failed to follow symlink ${$}: ${H}`)
                        } else if (w.isDirectory()) await Y($);
                        else if (w.isFile() && w.name.endsWith(".md")) _.push($)
                } catch (j) {
                    let H = j instanceof Error ? j.message : String(j);
                    E(`Failed to access ${$}: ${H}`)
                }
            }
        } catch (O) {
            let w = O instanceof Error ? O.message : String(O);
            E(`Failed to read directory ${A}: ${w}`)
        }
    }
    return await Y(q), _
}
// @from(Ln 427192, Col 0)
async function aY7(q) {
    let K = S6(process.env.CLAUDE_CODE_USE_NATIVE_FILE_SEARCH),
        _ = AbortSignal.timeout(3000),
        z = null,
        Y;
    try {
        Y = K ? await akY(q, _) : await dd(["--files", "--hidden", "--follow", "--no-ignore", "--glob", "*.md"], q, _)
    } catch (O) {
        if (D5(O)) return [];
        throw O
    }
    return (await Promise.all(Y.map(async (O) => {
        try {
            let w = await dkY(O, {
                    encoding: "utf-8"
                }),
                {
                    frontmatter: $,
                    content: j
                } = p2(w, O);
            return {
                filePath: O,
                frontmatter: $,
                content: j
            }
        } catch (w) {
            let $ = w instanceof Error ? w.message : String(w);
            return E(`Failed to read/parse markdown file:  ${O}: ${$}`), null
        }
    }))).filter((O) => O !== null)
}
// @from(Ln 427223, Col 4)
VCK
// @from(Ln 427223, Col 9)
ls
// @from(Ln 427224, Col 4)
ds = L(() => {
    U4();
    C8();
    y8();
    K8();
    Q8();
    m8();
    eK();
    Lf();
    pK();
    vX();
    BI();
    aY();
    Rm();
    jJ6();
    VCK = ["commands", "agents", "output-styles", "skills", "workflows", "routines"];
    ls = P1(async function(q, K) {
        let _ = Date.now(),
            z = jx6(A7(), q),
            Y = jx6(SW(), ".claude", q),
            A = Q_7(q, K),
            O = ez(K),
            w = zj(K);
        if (O && w && w !== O) {
            let Z = tX(jx6(O, ".claude", q));
            if (!A.some((f) => tX(f) === Z)) {
                let f = jx6(w, ".claude", q);
                if (!A.includes(f)) A.push(f)
            }
        }
        let [$, j, H] = await Promise.all([aY7(Y).then((Z) => Z.map((G) => ({
            ...G,
            baseDir: Y,
            source: "policySettings"
        }))), L2("userSettings") && !(q === "agents" && HT("agents")) ? aY7(z).then((Z) => Z.map((G) => ({
            ...G,
            baseDir: z,
            source: "userSettings"
        }))) : Promise.resolve([]), L2("projectSettings") && !(q === "agents" && HT("agents")) ? Promise.all(A.map((Z) => aY7(Z).then((G) => G.map((f) => ({
            ...f,
            baseDir: Z,
            source: "projectSettings"
        }))))) : Promise.resolve([])]), J = H.flat(), X = [...$, ...j, ...J], M = await Promise.all(X.map((Z) => rkY(Z.filePath))), P = new Map, W = [];
        for (let [Z, G] of X.entries()) {
            let f = M[Z] ?? null;
            if (f === null) {
                W.push(G);
                continue
            }
            let v = P.get(f);
            if (v !== void 0) {
                E(`Skipping duplicate file '${G.filePath}' from ${G.source} (same inode already loaded from ${v})`);
                continue
            }
            P.set(f, G.source), W.push(G)
        }
        let D = X.length - W.length;
        if (D > 0) E(`Deduplicated ${D} files in ${q} (same inode via symlinks or hard links)`);
        return d("tengu_dir_search", {
            durationMs: Date.now() - _,
            managedFilesFound: $.length,
            userFilesFound: j.length,
            projectFilesFound: J.length,
            projectDirsSearched: A.length,
            subdir: q
        }), W
    }, (q, K) => `${q}:${K}`)
})
// @from(Ln 427295, Col 4)
NCK
// @from(Ln 427296, Col 4)
ECK = L(() => {
    U4();
    K8();
    Lf();
    U8();
    ds();
    Gc8();
    NCK = P1(async (q) => {
        try {
            return (await ls("output-styles", q)).map(({
                filePath: z,
                frontmatter: Y,
                content: A,
                source: O
            }) => {
                try {
                    let $ = skY(z).replace(/\.md$/, ""),
                        j = (Y.name != null ? String(Y.name) : void 0) || $,
                        H = Wp(Y.description, $) ?? j_6(A, `Custom ${$} output style`),
                        J = ht6(Y["keep-coding-instructions"]);
                    if (Y["force-for-plugin"] !== void 0) E(`Output style "${j}" has force-for-plugin set, but this option only applies to plugin output styles. Ignoring.`, {
                        level: "warn"
                    });
                    return {
                        name: j,
                        description: H,
                        prompt: A.trim(),
                        source: O,
                        keepCodingInstructions: J
                    }
                } catch (w) {
                    return j6(w), null
                }
            }).filter((z) => z !== null)
        } catch (K) {
            return j6(K), []
        }
    })
})
// @from(Ln 427336, Col 0)
function eNK() {
    Hx6.cache?.clear?.()
}
// @from(Ln 427339, Col 0)
async function LCK() {
    let q = await Hx6(b8()),
        K = Object.values(q).filter((A) => A !== null && A.source === "plugin" && A.forceForPlugin === !0),
        _ = K[0];
    if (_) {
        if (K.length > 1) E(`Multiple plugins have forced output styles: ${K.map((A)=>A.name).join(", ")}. Using: ${_.name}`, {
            level: "warn"
        });
        return E(`Using forced plugin output style: ${_.name}`), _
    }
    let Y = y7()?.outputStyle || lk;
    return q[Y] ?? null
}
// @from(Ln 427352, Col 4)
yCK
// @from(Ln 427352, Col 9)
lk = "default"
// @from(Ln 427353, Col 4)
GJ6
// @from(Ln 427353, Col 9)
Hx6
// @from(Ln 427354, Col 4)
ec = L(() => {
    Qq();
    U4();
    ECK();
    n7();
    K8();
    Gc8();
    a1();
    yCK = `
## Insights
In order to encourage learning, before and after writing code, always provide brief educational explanations about implementation choices using (with backticks):
"\`${e6.star} Insight ─────────────────────────────────────\`
[2-3 key educational points]
\`─────────────────────────────────────────────────\`"

These insights should be included in the conversation, not in the codebase. You should generally focus on interesting insights that are specific to the codebase or the code you just wrote, rather than general programming concepts.`, GJ6 = {
        [lk]: null,
        Explanatory: {
            name: "Explanatory",
            source: "built-in",
            description: "Claude explains its implementation choices and codebase patterns",
            keepCodingInstructions: !0,
            prompt: `You are an interactive CLI tool that helps users with software engineering tasks. In addition to software engineering tasks, you should provide educational insights about the codebase along the way.

You should be clear and educational, providing helpful explanations while remaining focused on the task. Balance educational content with task completion. When providing insights, you may exceed typical length constraints, but remain focused and relevant.

# Explanatory Style Active
${yCK}`
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
${e6.bullet} **Learn by Doing**
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
${e6.bullet} **Learn by Doing**

**Context:** I've set up the hint feature UI with a button that triggers the hint system. The infrastructure is ready: when clicked, it calls selectHintCell() to determine which cell to hint, then highlights that cell with a yellow background and shows possible values. The hint system needs to decide which empty cell would be most helpful to reveal to the user.

**Your Task:** In sudoku.js, implement the selectHintCell(board) function. Look for TODO(human). This function should analyze the board and return {row, col} for the best cell to hint, or null if the puzzle is complete.

**Guidance:** Consider multiple strategies: prioritize cells with only one possible value (naked singles), or cells that appear in rows/columns/boxes with many filled cells. You could also consider a balanced approach that helps without making it too easy. The board parameter is a 9x9 array where 0 represents empty cells.
\`\`\`

**Partial Function Example:**
\`\`\`
${e6.bullet} **Learn by Doing**

**Context:** I've built a file upload component that validates files before accepting them. The main validation logic is complete, but it needs specific handling for different file type categories in the switch statement.

**Your Task:** In upload.js, inside the validateFile() function's switch statement, implement the 'case "document":' branch. Look for TODO(human). This should validate document files (pdf, doc, docx).

**Guidance:** Consider checking file size limits (maybe 10MB for documents?), validating the file extension matches the MIME type, and returning {valid: boolean, error?: string}. The file object has properties: name, size, type.
\`\`\`

**Debugging Example:**
\`\`\`
${e6.bullet} **Learn by Doing**

**Context:** The user reported that number inputs aren't working correctly in the calculator. I've identified the handleInput() function as the likely source, but need to understand what values are being processed.

**Your Task:** In calculator.js, inside the handleInput() function, add 2-3 console.log statements after the TODO(human) comment to help debug why number inputs fail.

**Guidance:** Consider logging: the raw input value, the parsed result, and any validation state. This will help us understand where the conversion breaks.
\`\`\`

### After Contributions
Share one insight connecting their code to broader patterns or system effects. Avoid praise or repetition.

## Insights
${yCK}`
        }
    }, Hx6 = P1(async function(K) {
        let _ = await NCK(K),
            z = await n97(),
            Y = {
                ...GJ6
            },
            A = _.filter((j) => j.source === "policySettings"),
            O = _.filter((j) => j.source === "userSettings"),
            w = _.filter((j) => j.source === "projectSettings"),
            $ = [z, O, w, A];
        for (let j of $)
            for (let H of j) Y[H.name] = {
                name: H.name,
                description: H.description,
                prompt: H.prompt,
                source: H.source,
                keepCodingInstructions: H.keepCodingInstructions,
                forceForPlugin: H.forceForPlugin
            };
        return Y
    })
})
// @from(Ln 427487, Col 0)
function tkY() {
    return ZX(), B7($b4)
}
// @from(Ln 427491, Col 0)
function ZI6(q) {
    if (x3() && u8("tengu_amber_prism", !1)) return q + ekY;
    return q
}
// @from(Ln 427496, Col 0)
function $CK(q) {
    return `Permission to use ${q} has been denied. ${qA7}`
}
// @from(Ln 427500, Col 0)
function jCK(q) {
    return `Permission to use ${q} has been denied because Claude Code is running in don't ask mode. ${qA7}`
}
// @from(Ln 427504, Col 0)
function $HK(q) {
    return q.startsWith(xCK)
}
// @from(Ln 427508, Col 0)
function HCK(q) {
    let K = xCK,
        _ = "To allow this type of action in the future, the user can add a Bash permission rule to their settings.";
    return `${K}${q}. If you have other tasks that don't depend on this action, continue working on those. ${qA7} To allow this type of action in the future, the user can add a Bash permission rule to their settings.`
}
// @from(Ln 427514, Col 0)
function JCK(q, K) {
    return `${K} is temporarily unavailable, so auto mode cannot determine the safety of ${q} right now. Wait briefly and then try this action again. If it keeps failing, continue with other tasks that don't require this action and come back to it later. Note: reading files, searching code, and other read-only operations do not require the classifier and can still be used.`
}
// @from(Ln 427518, Col 0)
function Gn8(q) {
    return q.startsWith(`<${l0}>`) || q.startsWith(`<${LW}>`) || q.startsWith(`<${TV}>`) || q.startsWith(`<${hu7}>`)
}
// @from(Ln 427522, Col 0)
function YM6(q) {
    return q.type !== "progress" && q.type !== "attachment" && q.type !== "system" && Array.isArray(q.message.content) && q.message.content[0]?.type === "text" && SK6.has(q.message.content[0].text)
}
// @from(Ln 427526, Col 0)
function D38(q) {
    return (q.type === "user" || q.type === "assistant") && q.isVirtual === !0
}
// @from(Ln 427530, Col 0)
function sY7(q) {
    return q.type === "assistant" && q.isApiErrorMessage === !0 && q.message.model === $c
}
// @from(Ln 427534, Col 0)
function fM(q) {
    return q.findLast((K) => K.type === "assistant")
}
// @from(Ln 427538, Col 0)
function uCK(q, K = 8, _ = 65536) {
    let z = [],
        Y = 0,
        A = !1;
    for (let O = q.length - 1; O >= 0; O--) {
        let w = q[O];
        if (w.type === "assistant") {
            let $ = s5(w.message.content, `
`).trim();
            if (!$) continue;
            let j = Buffer.byteLength($, "utf8");
            if (z.length >= K || z.length > 0 && Y + j > _) {
                A = !0;
                break
            }
            z.push($), Y += j
        } else if (w.type === "user") {
            let $ = w.message.content;
            if (typeof $ !== "string" && $.some((j) => j.type === "tool_result")) continue;
            if (w.isMeta) continue;
            break
        }
    }
    return z.reverse(), {
        messages: z,
        capped: A
    }
}
// @from(Ln 427567, Col 0)
function KA7(q) {
    for (let K = q.length - 1; K >= 0; K--) {
        let _ = q[K];
        if (_ && _.type === "assistant") {
            let Y = _.message.content;
            if (Array.isArray(Y)) return Y.some((A) => A.type === "tool_use")
        }
    }
    return !1
}
// @from(Ln 427578, Col 0)
function mCK({
    content: q,
    isApiErrorMessage: K = !1,
    apiError: _,
    error: z,
    errorDetails: Y,
    isVirtual: A,
    usage: O = {
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
        iterations: null,
        speed: null
    }
}) {
    return {
        type: "assistant",
        uuid: ZG(),
        timestamp: new Date().toISOString(),
        message: {
            id: ZG(),
            container: null,
            model: $c,
            role: "assistant",
            stop_reason: "stop_sequence",
            stop_sequence: "",
            type: "message",
            usage: O,
            content: q,
            context_management: null
        },
        requestId: void 0,
        apiError: _,
        error: z,
        errorDetails: Y,
        isApiErrorMessage: K,
        isVirtual: A
    }
}
// @from(Ln 427629, Col 0)
function yj({
    content: q,
    usage: K,
    isVirtual: _
}) {
    return mCK({
        content: typeof q === "string" ? [{
            type: "text",
            text: q === "" ? Yy : q
        }] : q,
        usage: K,
        isVirtual: _
    })
}
// @from(Ln 427644, Col 0)
function _9({
    content: q,
    apiError: K,
    error: _,
    errorDetails: z
}) {
    return mCK({
        content: [{
            type: "text",
            text: q === "" ? Yy : q
        }],
        isApiErrorMessage: !0,
        apiError: K,
        error: _,
        errorDetails: z
    })
}
// @from(Ln 427662, Col 0)
function t8({
    content: q,
    isMeta: K,
    isVisibleInTranscriptOnly: _,
    isVirtual: z,
    isCompactSummary: Y,
    summarizeMetadata: A,
    toolUseResult: O,
    mcpMeta: w,
    uuid: $,
    timestamp: j,
    imagePasteIds: H,
    sourceToolAssistantUUID: J,
    permissionMode: X,
    origin: M
}) {
    return {
        type: "user",
        message: {
            role: "user",
            content: q || Yy
        },
        isMeta: K,
        isVisibleInTranscriptOnly: _,
        isVirtual: z,
        isCompactSummary: Y,
        summarizeMetadata: A,
        uuid: $ || ZG(),
        timestamp: j ?? new Date().toISOString(),
        toolUseResult: O,
        mcpMeta: w,
        imagePasteIds: H,
        sourceToolAssistantUUID: J,
        permissionMode: X,
        origin: M
    }
}
// @from(Ln 427700, Col 0)
function JS({
    inputString: q,
    precedingInputBlocks: K
}) {
    if (K.length === 0) return q;
    return [...K, {
        text: q,
        type: "text"
    }]
}
// @from(Ln 427711, Col 0)
function _e({
    toolUse: q = !1
}) {
    return t8({
        content: [{
            type: "text",
            text: q ? of : M36
        }]
    })
}
// @from(Ln 427722, Col 0)
function zu() {
    return t8({
        content: `<${lU6}>Caveat: The messages below were generated by the user while running local commands. DO NOT respond to these messages or otherwise consider them in your response unless the user explicitly asks you to.</${lU6}>`,
        isMeta: !0
    })
}
// @from(Ln 427729, Col 0)
function wb6(q, K) {
    return `<${TV}>/${q}</${TV}>
            <${LW}>${q}</${LW}>
            <${nH8}>${K}</${nH8}>`
}
// @from(Ln 427735, Col 0)
function BCK(q, K) {
    return [zu(), t8({
        content: wb6("model", q)
    }), t8({
        content: `<${l0}>Set model to ${K}</${l0}>`
    })]
}
// @from(Ln 427743, Col 0)
function jkK({
    toolUseID: q,
    parentToolUseID: K,
    data: _
}) {
    return {
        type: "progress",
        data: _,
        toolUseID: q,
        parentToolUseID: K,
        uuid: ZG(),
        timestamp: new Date().toISOString()
    }
}
// @from(Ln 427758, Col 0)
function Y97(q) {
    return {
        type: "tool_result",
        content: _M6,
        is_error: !0,
        tool_use_id: q
    }
}
// @from(Ln 427767, Col 0)
function vK(q, K) {
    if (!q.trim() || !K.trim()) return null;
    let _ = E16(K),
        z = new RegExp(`<${_}(?:\\s+[^>]*)?>([\\s\\S]*?)<\\/${_}>`, "gi"),
        Y, A = 0,
        O = 0,
        w = new RegExp(`<${_}(?:\\s+[^>]*?)?>`, "gi"),
        $ = new RegExp(`<\\/${_}>`, "gi");
    while ((Y = z.exec(q)) !== null) {
        let j = Y[1],
            H = q.slice(O, Y.index);
        A = 0, w.lastIndex = 0;
        while (w.exec(H) !== null) A++;
        $.lastIndex = 0;
        while ($.exec(H) !== null) A--;
        if (A === 0 && j) return j;
        O = Y.index + Y[0].length
    }
    return null
}
// @from(Ln 427788, Col 0)
function Z78(q) {
    if (q.type === "progress" || q.type === "attachment" || q.type === "system") return !0;
    if (typeof q.message.content === "string") return q.message.content.trim().length > 0;
    if (q.message.content.length === 0) return !1;
    if (q.message.content.length > 1) return !0;
    if (q.message.content[0].type !== "text") return !0;
    let K = q.message.content[0].text;
    if (typeof K !== "string") return !1;
    return K.trim().length > 0 && K !== Yy && K !== of
}
// @from(Ln 427799, Col 0)
function S98(q, K) {
    let _ = K.toString(16).padStart(12, "0");
    return `${q.slice(0,24)}${_}`
}
// @from(Ln 427804, Col 0)
function b98(q) {
    if (q.type === "assistant") return q.message.content.length > 1;
    if (q.type === "user" && typeof q.message.content !== "string") return q.message.content.length > 1;
    return !1
}
// @from(Ln 427810, Col 0)
function KNY(q) {
    return (q.type === "assistant" || q.type === "user") && !b98(q)
}
// @from(Ln 427814, Col 0)
function aP(q, K = !1, _) {
    let z = K,
        Y = [];
    for (let A of q) {
        let O = z,
            w = KNY(A) ? O : !1;
        if (_) {
            let j = _.get(A);
            if (j && j.isNewChain === w) {
                if (Y.push(...j.normalized), b98(A)) z = !0;
                continue
            }
        }
        let $ = _NY(A, O);
        if (_?.set(A, {
                isNewChain: w,
                normalized: $
            }), Y.push(...$), b98(A)) z = !0
    }
    return Y
}
// @from(Ln 427836, Col 0)
function _NY(q, K) {
    switch (q.type) {
        case "assistant": {
            let _ = K || b98(q);
            return q.message.content.map((z, Y) => {
                let A = _ ? S98(q.uuid, Y) : q.uuid;
                return {
                    type: "assistant",
                    timestamp: q.timestamp,
                    message: {
                        ...q.message,
                        content: [z],
                        context_management: q.message.context_management ?? null
                    },
                    isMeta: q.isMeta,
                    isVirtual: q.isVirtual,
                    requestId: q.requestId,
                    uuid: A,
                    error: q.error,
                    isApiErrorMessage: q.isApiErrorMessage,
                    advisorModel: q.advisorModel
                }
            })
        }
        case "attachment":
            return [q];
        case "progress":
            return [q];
        case "system":
            return [q];
        case "user": {
            if (typeof q.message.content === "string") {
                let Y = K ? S98(q.uuid, 0) : q.uuid;
                return [{
                    ...q,
                    uuid: Y,
                    message: {
                        ...q.message,
                        content: [{
                            type: "text",
                            text: q.message.content
                        }]
                    }
                }]
            }
            let _ = K || b98(q),
                z = 0;
            return q.message.content.map((Y, A) => {
                let O = Y.type === "image",
                    w = O && q.imagePasteIds ? q.imagePasteIds[z] : void 0;
                if (O) z++;
                return {
                    ...t8({
                        content: [Y],
                        toolUseResult: q.toolUseResult,
                        mcpMeta: q.mcpMeta,
                        isMeta: q.isMeta,
                        isVisibleInTranscriptOnly: q.isVisibleInTranscriptOnly,
                        isVirtual: q.isVirtual,
                        timestamp: q.timestamp,
                        imagePasteIds: w !== void 0 ? [w] : void 0,
                        origin: q.origin
                    }),
                    uuid: _ ? S98(q.uuid, A) : q.uuid
                }
            })
        }
        default:
            return q
    }
}
// @from(Ln 427908, Col 0)
function RCK(q) {
    return q.type === "assistant" && q.message.content.some((K) => K.type === "tool_use")
}
// @from(Ln 427912, Col 0)
function t48(q) {
    return q.type === "user" && (Array.isArray(q.message.content) && q.message.content[0]?.type === "tool_result" || Boolean(q.toolUseResult))
}
// @from(Ln 427916, Col 0)
function pCK(q, K) {
    let _ = new Map;
    for (let O of q) {
        if (RCK(O)) {
            let w = O.message.content[0]?.id;
            if (w) {
                if (!_.has(w)) _.set(w, {
                    toolUse: null,
                    preHooks: [],
                    toolResult: null,
                    postHooks: []
                });
                _.get(w).toolUse = O
            }
            continue
        }
        if (C98(O) && O.attachment.hookEvent === "PreToolUse") {
            let w = O.attachment.toolUseID;
            if (!_.has(w)) _.set(w, {
                toolUse: null,
                preHooks: [],
                toolResult: null,
                postHooks: []
            });
            _.get(w).preHooks.push(O);
            continue
        }
        if (O.type === "user" && O.message.content[0]?.type === "tool_result") {
            let w = O.message.content[0].tool_use_id;
            if (!_.has(w)) _.set(w, {
                toolUse: null,
                preHooks: [],
                toolResult: null,
                postHooks: []
            });
            _.get(w).toolResult = O;
            continue
        }
        if (C98(O) && O.attachment.hookEvent === "PostToolUse") {
            let w = O.attachment.toolUseID;
            if (!_.has(w)) _.set(w, {
                toolUse: null,
                preHooks: [],
                toolResult: null,
                postHooks: []
            });
            _.get(w).postHooks.push(O);
            continue
        }
    }
    let z = [],
        Y = new Set;
    for (let O of q) {
        if (RCK(O)) {
            let w = O.message.content[0]?.id;
            if (w && !Y.has(w)) {
                Y.add(w);
                let $ = _.get(w);
                if ($ && $.toolUse) {
                    if (z.push($.toolUse), z.push(...$.preHooks), $.toolResult) z.push($.toolResult);
                    z.push(...$.postHooks)
                }
            }
            continue
        }
        if (C98(O) && (O.attachment.hookEvent === "PreToolUse" || O.attachment.hookEvent === "PostToolUse")) continue;
        if (O.type === "user" && O.message.content[0]?.type === "tool_result") continue;
        if (O.type === "system" && O.subtype === "api_error") {
            let w = z.at(-1);
            if (w?.type === "system" && w.subtype === "api_error") z[z.length - 1] = O;
            else z.push(O);
            continue
        }
        z.push(O)
    }
    for (let O of K) z.push(O);
    let A = z.at(-1);
    return z.filter((O) => O.type !== "system" || O.subtype !== "api_error" || O === A)
}
// @from(Ln 427996, Col 0)
function C98(q) {
    return q.type === "attachment" && (q.attachment.type === "hook_blocking_error" || q.attachment.type === "hook_cancelled" || q.attachment.type === "hook_error_during_execution" || q.attachment.type === "hook_non_blocking_error" || q.attachment.type === "hook_success" || q.attachment.type === "hook_system_message" || q.attachment.type === "hook_additional_context" || q.attachment.type === "hook_stopped_continuation" || q.attachment.type === "hook_deferred_tool")
}
// @from(Ln 428000, Col 0)
function FCK(q, K) {
    let _ = new Map,
        z = new Map,
        Y = new Map;
    for (let D of K)
        if (D.type === "assistant") {
            let Z = D.message.id,
                G = _.get(Z);
            if (!G) G = new Set, _.set(Z, G);
            for (let f of D.message.content)
                if (f.type === "tool_use") G.add(f.id), z.set(f.id, Z), Y.set(f.id, f)
        } let A = new Map;
    for (let [D, Z] of z) A.set(D, _.get(Z));
    let O = new Map,
        w = new Map,
        $ = new Map,
        j = new Map,
        H = new Map,
        J = new Set,
        X = new Set;
    for (let D of q) {
        if (D.type === "progress") {
            let Z = D.parentToolUseID,
                G = O.get(Z);
            if (G) G.push(D);
            else O.set(Z, [D]);
            if (D.data.type === "hook_progress") {
                let f = D.data.hookEvent,
                    v = w.get(Z);
                if (!v) v = new Map, w.set(Z, v);
                v.set(f, (v.get(f) ?? 0) + 1)
            }
        }
        if (D.type === "user") {
            for (let Z of D.message.content)
                if (Z.type === "tool_result") {
                    if (j.set(Z.tool_use_id, D), J.add(Z.tool_use_id), Z.is_error) X.add(Z.tool_use_id)
                }
        }
        if (D.type === "assistant")
            for (let Z of D.message.content) {
                if (Z.type === "tool_use") H.set(Z.id, D.uuid);
                if ("tool_use_id" in Z && typeof Z.tool_use_id === "string") J.add(Z.tool_use_id);
                if (Z.type === "advisor_tool_result") {
                    let G = Z;
                    if (G.content.type === "advisor_tool_result_error") X.add(G.tool_use_id)
                }
            }
        if (C98(D)) {
            let Z = D.attachment.toolUseID,
                G = D.attachment.hookEvent,
                f = D.attachment.hookName;
            if (f !== void 0) {
                let v = $.get(Z);
                if (!v) v = new Map, $.set(Z, v);
                let V = v.get(G);
                if (!V) V = new Set, v.set(G, V);
                V.add(f)
            }
        }
    }
    let M = new Map;
    for (let [D, Z] of $) {
        let G = new Map;
        for (let [f, v] of Z) G.set(f, v.size);
        M.set(D, G)
    }
    let P = K.at(-1),
        W = P?.type === "assistant" ? P.message.id : void 0;
    for (let D of q) {
        if (D.type !== "assistant") continue;
        if (D.message.id === W) continue;
        for (let Z of D.message.content)
            if ((Z.type === "server_tool_use" || Z.type === "mcp_tool_use") && !J.has(Z.id)) {
                let G = Z.id;
                J.add(G), X.add(G)
            }
    }
    return {
        siblingToolUseIDs: A,
        progressMessagesByToolUseID: O,
        inProgressHookCounts: w,
        resolvedHookCounts: M,
        toolResultByToolUseID: j,
        toolUseByToolUseID: Y,
        assistantUuidByToolUseID: H,
        normalizedMessageCount: q.length,
        resolvedToolUseIDs: J,
        erroredToolUseIDs: X
    }
}
// @from(Ln 428092, Col 0)
function gK8(q) {
    let K = new Map,
        _ = new Set,
        z = new Map;
    for (let {
            message: A
        }
        of q)
        if (A.type === "assistant") {
            for (let O of A.message.content)
                if (O.type === "tool_use") K.set(O.id, O)
        } else if (A.type === "user") {
        for (let O of A.message.content)
            if (O.type === "tool_result") _.add(O.tool_use_id), z.set(O.tool_use_id, A)
    }
    let Y = new Set;
    for (let A of K.keys())
        if (!_.has(A)) Y.add(A);
    return {
        lookups: {
            ...Ke,
            toolUseByToolUseID: K,
            resolvedToolUseIDs: _,
            toolResultByToolUseID: z
        },
        inProgressToolUseIDs: Y
    }
}
// @from(Ln 428121, Col 0)
function gCK(q, K) {
    let _ = Ue(q);
    if (!_) return Dn8;
    return K.siblingToolUseIDs.get(_) ?? Dn8
}
// @from(Ln 428127, Col 0)
function UCK(q, K) {
    let _ = Ue(q);
    if (!_) return [];
    return K.progressMessagesByToolUseID.get(_) ?? []
}
// @from(Ln 428133, Col 0)
function QCK(q, K, _) {
    let z = _.inProgressHookCounts.get(q)?.get(K) ?? 0,
        Y = _.resolvedHookCounts.get(q)?.get(K) ?? 0;
    return z > Y
}
// @from(Ln 428139, Col 0)
function dCK(q) {
    return new Set(q.filter((K) => K.type === "assistant" && Array.isArray(K.message.content) && K.message.content[0]?.type === "tool_use").map((K) => K.message.content[0].id))
}
// @from(Ln 428143, Col 0)
function zNY(q, K = !1) {
    let _ = !1;
    for (let A = 0; A < q.length; A++) {
        let O = q[A];
        if (O.type === "attachment" || K && D38(O)) {
            _ = !0;
            break
        }
    }
    if (!_) return q;
    let z = [],
        Y = [];
    for (let A = q.length - 1; A >= 0; A--) {
        let O = q[A];
        if (O.type === "attachment") Y.push(O);
        else {
            let w = O.type === "assistant" || O.type === "user" && Array.isArray(O.message.content) && O.message.content[0]?.type === "tool_result",
                $ = K && D38(O);
            if (w && Y.length > 0) {
                for (let j = 0; j < Y.length; j++) z.push(Y[j]);
                if (!$) z.push(O);
                Y.length = 0
            } else if (!$) z.push(O)
        }
    }
    for (let A = 0; A < Y.length; A++) z.push(Y[A]);
    return z.reverse(), z
}
// @from(Ln 428172, Col 0)
function mq7(q) {
    return q.type === "system" && q.subtype === "local_command"
}
// @from(Ln 428176, Col 0)
function YNY(q, K) {
    let _ = q.message.content;
    if (!Array.isArray(_)) return q;
    if (!_.some((Y) => Y.type === "tool_result" && Array.isArray(Y.content) && Y.content.some((A) => {
            if (!Kg(A)) return !1;
            let O = A.tool_name;
            return O && !K.has(i0(O))
        }))) return q;
    return {
        ...q,
        message: {
            ...q.message,
            content: _.map((Y) => {
                if (Y.type !== "tool_result" || !Array.isArray(Y.content)) return Y;
                let A = Y.content.filter((O) => {
                    if (!Kg(O)) return !0;
                    let w = O.tool_name;
                    if (!w) return !0;
                    let $ = i0(w),
                        j = K.has($);
                    if (!j) E(`Filtering out tool_reference for unavailable tool: ${$}`, {
                        level: "warn"
                    });
                    return j
                });
                if (A.length === 0) return {
                    ...Y,
                    content: [{
                        type: "text",
                        text: "[Tool references removed - tools no longer available]"
                    }]
                };
                return {
                    ...Y,
                    content: A
                }
            })
        }
    }
}
// @from(Ln 428217, Col 0)
function _A7(q) {
    let K = q.message.content;
    if (!Array.isArray(K)) return q;
    if (!K.some((z) => z.type === "tool_result" && Array.isArray(z.content) && z.content.some(Kg))) return q;
    return {
        ...q,
        message: {
            ...q.message,
            content: K.map((z) => {
                if (z.type !== "tool_result" || !Array.isArray(z.content)) return z;
                let Y = z.content.filter((A) => !Kg(A));
                if (Y.length === 0) return {
                    ...z,
                    content: [{
                        type: "text",
                        text: "[Tool references removed - tool search not enabled]"
                    }]
                };
                return {
                    ...z,
                    content: Y
                }
            })
        }
    }
}
// @from(Ln 428244, Col 0)
function cCK(q) {
    if (!q.message.content.some((_) => _.type === "tool_use" && ("caller" in _) && _.caller !== null)) return q;
    return {
        ...q,
        message: {
            ...q.message,
            content: q.message.content.map((_) => {
                if (_.type !== "tool_use") return _;
                return {
                    type: "tool_use",
                    id: _.id,
                    name: _.name,
                    input: _.input
                }
            })
        }
    }
}
// @from(Ln 428263, Col 0)
function tY7(q) {
    return q.some((K) => K.type === "tool_result" && Array.isArray(K.content) && K.content.some(Kg))
}
// @from(Ln 428267, Col 0)
function ANY(q) {
    let K = q.message.content;
    if (typeof K === "string") {
        if (K.startsWith("<system-reminder>")) return q;
        return {
            ...q,
            message: {
                ...q.message,
                content: IT(K)
            }
        }
    }
    let _ = !1,
        z = K.map((Y) => {
            if (Y.type === "text" && !Y.text.startsWith("<system-reminder>")) return _ = !0, {
                ...Y,
                text: IT(Y.text)
            };
            return Y
        });
    return _ ? {
        ...q,
        message: {
            ...q.message,
            content: z
        }
    } : q
}
// @from(Ln 428296, Col 0)
function lCK(q) {
    return q.map((K) => {
        if (K.type !== "user") return K;
        let _ = K.message.content;
        if (!Array.isArray(_)) return K;
        if (!_.some((H) => H.type === "tool_result")) return K;
        let Y = [],
            A = [];
        for (let H of _)
            if (H.type === "text" && H.text.startsWith("<system-reminder>")) Y.push(H);
            else A.push(H);
        if (Y.length === 0) return K;
        let O = A.findLastIndex((H) => H.type === "tool_result"),
            w = A[O],
            $ = eY7(w, Y);
        if ($ === null) return K;
        let j = [...A.slice(0, O), $, ...A.slice(O + 1)];
        return {
            ...K,
            message: {
                ...K.message,
                content: j
            }
        }
    })
}
// @from(Ln 428323, Col 0)
function ONY(q) {
    let K;
    for (let _ = 0; _ < q.length; _++) {
        let z = q[_];
        if (z.type !== "user") continue;
        let Y = z.message.content;
        if (!Array.isArray(Y)) continue;
        let A;
        for (let O = 0; O < Y.length; O++) {
            let w = Y[O];
            if (w.type !== "tool_result" || !w.is_error) continue;
            let $ = w.content;
            if (!Array.isArray($)) continue;
            if ($.every((J) => J.type === "text")) continue;
            let j = $.filter((J) => J.type === "text").map((J) => J.text),
                H = j.length > 0 ? [{
                    type: "text",
                    text: j.join(`

`)
                }] : [];
            if (!A) A = Y.slice();
            A[O] = {
                ...w,
                content: H
            }
        }
        if (!A) continue;
        if (!K) K = q.slice();
        K[_] = {
            ...z,
            message: {
                ...z.message,
                content: A
            }
        }
    }
    return K ?? q
}
// @from(Ln 428363, Col 0)
function wNY(q) {
    let K = [...q];
    for (let _ = 0; _ < K.length; _++) {
        let z = K[_];
        if (z.type !== "user") continue;
        let Y = z.message.content;
        if (!Array.isArray(Y)) continue;
        if (!tY7(Y)) continue;
        let A = Y.filter(($) => $.type === "text");
        if (A.length === 0) continue;
        let O = -1;
        for (let $ = _ + 1; $ < K.length; $++) {
            let j = K[$];
            if (j.type !== "user") continue;
            let H = j.message.content;
            if (!Array.isArray(H)) continue;
            if (!H.some((J) => J.type === "tool_result")) continue;
            if (tY7(H)) continue;
            O = $;
            break
        }
        if (O === -1) continue;
        K[_] = {
            ...z,
            message: {
                ...z.message,
                content: Y.filter(($) => $.type !== "text")
            }
        };
        let w = K[O];
        K[O] = {
            ...w,
            message: {
                ...w.message,
                content: [...w.message.content, ...A]
            }
        }
    }
    return K
}
// @from(Ln 428404, Col 0)
function $NY() {
    return {
        [cF1()]: new Set(["document"]),
        [lF1()]: new Set(["document"]),
        [nF1()]: new Set(["document"]),
        [hh8()]: new Set(["image"]),
        [iF1()]: new Set(["document", "image"])
    }
}
// @from(Ln 428414, Col 0)
function K0(q, K = []) {
    let _ = new Set(K.map((P) => P.name)),
        z = zNY(q, !0),
        Y = $NY(),
        A = new Map;
    for (let P = 0; P < z.length; P++) {
        let W = z[P];
        if (!sY7(W)) continue;
        let D = Array.isArray(W.message.content) && W.message.content[0]?.type === "text" ? W.message.content[0].text : void 0;
        if (!D) continue;
        let Z = Y[D];
        if (!Z) continue;
        for (let G = P - 1; G >= 0; G--) {
            let f = z[G];
            if (f.type === "user" && f.isMeta) {
                let v = A.get(f.uuid);
                if (v)
                    for (let V of Z) v.add(V);
                else A.set(f.uuid, new Set(Z));
                break
            }
            if (sY7(f)) continue;
            break
        }
    }
    let O = [];
    for (let P of z) {
        if (P.type === "progress" || P.type === "system" && !mq7(P) || sY7(P)) continue;
        switch (P.type) {
            case "system": {
                let W = t8({
                        content: P.content,
                        uuid: P.uuid,
                        timestamp: P.timestamp
                    }),
                    D = pI(O);
                if (D?.type === "user") {
                    O[O.length - 1] = Zn8(D, W);
                    continue
                }
                O.push(W);
                continue
            }
            case "user": {
                let W = P;
                if (!GS()) W = _A7(P);
                else W = YNY(P, _);
                let D = A.get(W.uuid);
                if (D && W.isMeta) {
                    let G = W.message.content;
                    if (Array.isArray(G)) {
                        let f = G.filter((v) => !D.has(v.type));
                        if (f.length === 0) continue;
                        if (f.length < G.length) W = {
                            ...W,
                            message: {
                                ...W.message,
                                content: f
                            }
                        }
                    }
                }
                if (!Tw("tengu_toolref_defer_j8m")) {
                    let G = W.message.content;
                    if (Array.isArray(G) && !G.some((f) => f.type === "text" && f.text.startsWith(hCK)) && tY7(G)) W = {
                        ...W,
                        message: {
                            ...W.message,
                            content: [...G, {
                                type: "text",
                                text: hCK
                            }]
                        }
                    }
                }
                let Z = pI(O);
                if (Z?.type === "user") {
                    O[O.length - 1] = Zn8(Z, W);
                    continue
                }
                O.push(W);
                continue
            }
            case "assistant": {
                let W = GS(),
                    D = P.message.content,
                    Z;
                for (let v = 0; v < D.length; v++) {
                    let V = D[v];
                    if (V.type !== "tool_use") continue;
                    let k = K.find((h) => e3(h, V.name)),
                        N = k ? wbK(k, V.input) : V.input,
                        R = k?.name ?? V.name;
                    if (W && N === V.input && R === V.name) continue;
                    Z ??= D.slice(), Z[v] = W ? {
                        ...V,
                        name: R,
                        input: N
                    } : {
                        type: "tool_use",
                        id: V.id,
                        name: R,
                        input: N
                    }
                }
                let G = Z ? {
                        ...P,
                        message: {
                            ...P.message,
                            content: Z
                        }
                    } : P,
                    f = !1;
                for (let v = O.length - 1; v >= 0; v--) {
                    let V = O[v];
                    if (V.type !== "assistant" && !JNY(V)) break;
                    if (V.type === "assistant") {
                        if (V.message.id === G.message.id) {
                            O[v] = HNY(V, G), f = !0;
                            break
                        }
                        continue
                    }
                }
                if (!f) O.push(G);
                continue
            }
            case "attachment": {
                let W = Xz7(P.attachment),
                    D = Tw("tengu_chair_sermon") ? W.map(ANY) : W,
                    Z = pI(O);
                if (Z?.type === "user") {
                    O[O.length - 1] = D.reduce((G, f) => jNY(G, f), Z);
                    continue
                }
                O.push(...D);
                continue
            }
        }
    }
    let w = Tw("tengu_toolref_defer_j8m") ? wNY(O) : O,
        $ = qK8(w),
        j = xNY($),
        H = e48(j),
        J = uNY(H),
        X = Tw("tengu_chair_sermon") ? lCK(XNY(J)) : J;
    return ONY(X)
}
// @from(Ln 428563, Col 0)
function jNY(q, K) {
    let _ = fn8(q.message.content),
        z = fn8(K.message.content);
    return {
        ...q,
        message: {
            ...q.message,
            content: nCK(PNY(_, z))
        }
    }
}
// @from(Ln 428575, Col 0)
function HNY(q, K) {
    let _ = [...q.message.content, ...K.message.content],
        z = _.filter((A) => A.type !== "text" || A.text.length === 0 || A.text.trim() !== ""),
        Y = z.some((A) => A.type !== "thinking" && A.type !== "redacted_thinking");
    return {
        ...q,
        message: {
            ...q.message,
            content: Y ? z : _
        }
    }
}
// @from(Ln 428588, Col 0)
function JNY(q) {
    if (q.type !== "user") return !1;
    let K = q.message.content;
    if (typeof K === "string") return !1;
    return K.some((_) => _.type === "tool_result")
}
// @from(Ln 428595, Col 0)
function Zn8(q, K) {
    let _ = fn8(q.message.content),
        z = fn8(K.message.content);
    return {
        ...q,
        uuid: q.isMeta ? K.uuid : q.uuid,
        message: {
            ...q.message,
            content: nCK(MNY(_, z))
        }
    }
}
// @from(Ln 428608, Col 0)
function XNY(q) {
    let K = !1;
    for (let z = 1; z < q.length; z++)
        if (q[z].type === "user" && q[z - 1].type === "user") {
            K = !0;
            break
        } if (!K) return q;
    let _ = [];
    for (let z of q) {
        let Y = _.at(-1);
        if (z.type === "user" && Y?.type === "user") _[_.length - 1] = Zn8(Y, z);
        else _.push(z)
    }
    return _
}
// @from(Ln 428624, Col 0)
function nCK(q) {
    let K = [],
        _ = [];
    for (let z of q)
        if (z.type === "tool_result") K.push(z);
        else _.push(z);
    return [...K, ..._]
}
// @from(Ln 428633, Col 0)
function fn8(q) {
    if (typeof q === "string") return [{
        type: "text",
        text: q
    }];
    return q
}
// @from(Ln 428641, Col 0)
function MNY(q, K) {
    let _ = q.at(-1),
        z = K[0];
    if (_?.type === "text" && z?.type === "text") return [...q.slice(0, -1), {
        ..._,
        text: _.text + `
`
    }, ...K];
    return [...q, ...K]
}
// @from(Ln 428652, Col 0)
function eY7(q, K) {
    if (K.length === 0) return q;
    let _ = q.content;
    if (Array.isArray(_) && _.some(Kg)) return null;
    if (q.is_error) {
        if (K = K.filter((O) => O.type === "text"), K.length === 0) return q
    }
    if (K.every((O) => O.type === "text") && (_ === void 0 || typeof _ === "string")) {
        let O = [(_ ?? "").trim(), ...K.map((w) => w.text.trim())].filter(Boolean).join(`

`);
        return {
            ...q,
            content: O
        }
    }
    let Y = _ === void 0 ? [] : typeof _ === "string" ? _.trim() ? [{
            type: "text",
            text: _.trim()
        }] : [] : [..._],
        A = [];
    for (let O of [...Y, ...K])
        if (O.type === "text") {
            let w = O.text.trim();
            if (!w) continue;
            let $ = A.at(-1);
            if ($?.type === "text") A[A.length - 1] = {
                ...$,
                text: `${$.text}

${w}`
            };
            else A.push({
                type: "text",
                text: w
            })
        } else A.push(O);
    return {
        ...q,
        content: A
    }
}
// @from(Ln 428695, Col 0)
function PNY(q, K) {
    let _ = pI(q);
    if (_?.type !== "tool_result") return [...q, ...K];
    if (!Tw("tengu_chair_sermon")) {
        if (typeof _.content === "string" && K.every((O) => O.type === "text")) {
            let O = q.slice();
            return O[O.length - 1] = eY7(_, K), O
        }
        return [...q, ...K]
    }
    let z = K.filter((O) => O.type !== "tool_result"),
        Y = K.filter((O) => O.type === "tool_result");
    if (z.length === 0) return [...q, ...K];
    let A = eY7(_, z);
    if (A === null) return [...q, ...K];
    return [...q.slice(0, -1), A, ...Y]
}
// @from(Ln 428713, Col 0)
function I98(q, K, _) {
    if (!q) return [];
    return q.map((z) => {
        switch (z.type) {
            case "tool_use": {
                if (typeof z.input !== "string" && !xO(z.input)) throw Error("Tool use input must be a string or object");
                let Y;
                if (typeof z.input === "string") {
                    let A = k5(z.input);
                    if (A === null && z.input.length > 0) d("tengu_tool_input_json_parse_fail", {
                        toolName: PK(z.name),
                        inputLen: z.input.length
                    });
                    Y = A ?? {}
                } else Y = z.input;
                if (typeof Y === "object" && Y !== null) {
                    let A = rK(K, z.name);
                    if (A) {
                        let O = WNY(Y, A.inputSchema);
                        try {
                            Y = ObK(A, O, _)
                        } catch (w) {
                            j6(Error("Error normalizing tool input: " + w)), Y = O
                        }
                    }
                }
                return {
                    ...z,
                    input: Y
                }
            }
            case "text":
                if (z.text.trim().length === 0) d("tengu_model_whitespace_response", {
                    length: z.text.length
                });
                return z;
            case "code_execution_tool_result":
            case "mcp_tool_use":
            case "mcp_tool_result":
            case "container_upload":
                return z;
            case "server_tool_use":
                if (typeof z.input === "string") return {
                    ...z,
                    input: k5(z.input) ?? {}
                };
                return z;
            default:
                return z
        }
    })
}
// @from(Ln 428766, Col 0)
function WNY(q, K) {
    let _ = K._zod?.def;
    if (_?.type !== "object" || !_.shape) return q;
    let z = q;
    for (let [Y, A] of Object.entries(_.shape)) {
        let O = q[Y];
        if (typeof O !== "string") continue;
        let w = DNY(A._zod.def);
        if (w === "array" || w === "object") {
            let $ = k5(O, !1);
            if (w === "array" ? Array.isArray($) : $ !== null && typeof $ === "object" && !Array.isArray($)) {
                if (z === q) z = {
                    ...q
                };
                z[Y] = $
            }
        }
    }
    return z
}
// @from(Ln 428787, Col 0)
function DNY(q) {
    let K = q;
    while (K) switch (K.type) {
        case "optional":
        case "nullable":
        case "default":
            if (!K.innerType) return K.type;
            K = K.innerType._zod.def;
            break;
        case "pipe":
            if (!K.in) return K.type;
            K = K.in._zod.def;
            break;
        default:
            return K.type
    }
    return "unknown"
}
// @from(Ln 428806, Col 0)
function my6(q) {
    return E96(q).trim() === "" || q.trim() === Yy
}
// @from(Ln 428810, Col 0)
function E96(q) {
    return q.replace(ZNY, "").replace(/^\n+/, "")
}
// @from(Ln 428814, Col 0)
function Ue(q) {
    switch (q.type) {
        case "attachment":
            if (C98(q)) return q.attachment.toolUseID;
            return null;
        case "assistant":
            if (q.message.content[0]?.type !== "tool_use") return null;
            return q.message.content[0].id;
        case "user":
            if (q.sourceToolUseID) return q.sourceToolUseID;
            if (q.message.content[0]?.type !== "tool_result") return null;
            return q.message.content[0].tool_use_id;
        case "progress":
            return q.toolUseID;
        case "system":
            return q.subtype === "informational" ? q.toolUseID ?? null : null
    }
}
// @from(Ln 428833, Col 0)
function oF8(q, K) {
    let _ = new Set,
        z = new Set;
    for (let A of q) {
        if (A.type !== "user" && A.type !== "assistant") continue;
        let O = A.message.content;
        if (!Array.isArray(O)) continue;
        for (let w of O) {
            if (w.type === "tool_use") _.add(w.id);
            if (w.type === "tool_result") z.add(w.tool_use_id)
        }
    }
    let Y = new Set([..._].filter((A) => !z.has(A) && !K?.has(A)));
    if (Y.size === 0) return q;
    return q.filter((A) => {
        if (A.type !== "assistant") return !0;
        let O = A.message.content;
        if (!Array.isArray(O)) return !0;
        let w = [];
        for (let $ of O)
            if ($.type === "tool_use") w.push($.id);
        if (w.length === 0) return !0;
        return !w.every(($) => Y.has($))
    })
}
// @from(Ln 428859, Col 0)
function MJ6(q) {
    if (q.type !== "assistant") return null;
    if (Array.isArray(q.message.content)) return q.message.content.filter((K) => K.type === "text").map((K) => K.type === "text" ? K.text : "").join(`
`).trim() || null;
    return null
}
// @from(Ln 428866, Col 0)
function it(q) {
    if (q.type !== "user") return null;
    let K = q.message.content;
    return qu(K)
}
// @from(Ln 428872, Col 0)
function zA7(q) {
    let K = it(q);
    if (K === null) return null;
    let _ = vK(K, "bash-input");
    if (_) return {
        text: _,
        mode: "bash"
    };
    let z = vK(K, TV);
    if (z) {
        let Y = vK(K, nH8) ?? "";
        return {
            text: `${z} ${Y}`,
            mode: "prompt"
        }
    }
    return {
        text: Uu7(K),
        mode: "prompt"
    }
}
// @from(Ln 428894, Col 0)
function s5(q, K = "") {
    return q.filter((_) => _.type === "text").map((_) => _.text).join(K)
}
// @from(Ln 428898, Col 0)
function qu(q) {
    if (typeof q === "string") return q;
    if (Array.isArray(q)) return s5(q, `
`).trim() || null;
    return null
}
// @from(Ln 428905, Col 0)
function Jx6(q, K, _, z, Y, A, O, w, $) {
    if (q.type !== "stream_event" && q.type !== "stream_request_start") {
        if (q.type === "tombstone") {
            A?.(q.message);
            return
        }
        if (q.type === "tool_use_summary") return;
        if (q.type === "assistant") {
            let j = q.message.content.find((H) => H.type === "thinking");
            if (j && j.type === "thinking") O?.(() => ({
                thinking: j.thinking,
                isStreaming: !1,
                streamingEndedAt: Date.now()
            }))
        }
        $?.(() => null), K(q);
        return
    }
    if (q.type === "stream_request_start") {
        z("requesting");
        return
    }
    if (q.event.type === "message_start") {
        if (q.ttftMs != null) w?.({
            type: "start",
            ttftMs: q.ttftMs
        });
        Y((j) => j.length > 0 ? [] : j), $?.((j) => j !== null ? null : j)
    }
    if (q.event.type === "message_stop") {
        z("tool-use"), Y(() => []);
        return
    }
    switch (q.event.type) {
        case "content_block_start":
            switch ($?.(() => null), q.event.content_block.type) {
                case "thinking":
                case "redacted_thinking":
                    z("thinking");
                    return;
                case "text":
                    z("responding");
                    return;
                case "tool_use": {
                    z("tool-input");
                    let j = q.event.content_block,
                        H = q.event.index;
                    Y((J) => {
                        let X = J.findIndex((P) => P.index === H),
                            M = {
                                index: H,
                                contentBlock: j,
                                unparsedToolInput: ""
                            };
                        return X === -1 ? [...J, M] : J.with(X, M)
                    });
                    return
                }
                case "server_tool_use":
                case "web_search_tool_result":
                case "code_execution_tool_result":
                case "mcp_tool_use":
                case "mcp_tool_result":
                case "container_upload":
                case "web_fetch_tool_result":
                case "bash_code_execution_tool_result":
                case "text_editor_code_execution_tool_result":
                case "tool_search_tool_result":
                case "compaction":
                    z("tool-input");
                    return
            }
            return;
        case "content_block_delta":
            switch (q.event.delta.type) {
                case "text_delta": {
                    let j = q.event.delta.text;
                    _(j), $?.((H) => (H ?? "") + j);
                    return
                }
                case "input_json_delta": {
                    let j = q.event.delta.partial_json,
                        H = q.event.index;
                    _(j), Y((J) => {
                        let X = J.find((M) => M.index === H);
                        if (!X) return J;
                        return [...J.filter((M) => M !== X), {
                            ...X,
                            unparsedToolInput: X.unparsedToolInput + j
                        }]
                    });
                    return
                }
                case "thinking_delta":
                    _(q.event.delta.thinking);
                    return;
                case "signature_delta":
                    return;
                default:
                    return
            }
        case "content_block_stop":
            return;
        case "message_delta":
            if (z("responding"), q.event.usage.output_tokens != null) w?.({
                type: "end",
                outputTokens: q.event.usage.output_tokens
            });
            return;
        default:
            z("responding");
            return
    }
}
// @from(Ln 429020, Col 0)
function IT(q) {
    return `<system-reminder>
${q}
</system-reminder>`
}
// @from(Ln 429026, Col 0)
function X_(q) {
    return q.map((K) => {
        if (typeof K.message.content === "string") return {
            ...K,
            message: {
                ...K.message,
                content: IT(K.message.content)
            }
        };
        else if (Array.isArray(K.message.content)) {
            let _ = K.message.content.map((z) => {
                if (z.type === "text") return {
                    ...z,
                    text: IT(z.text)
                };
                return z
            });
            return {
                ...K,
                message: {
                    ...K.message,
                    content: _
                }
            }
        }
        return K
    })
}
// @from(Ln 429055, Col 0)
function fNY(q) {
    if (q.isSubAgent) return LNY(q);
    if (q.reminderType === "sparse") return yNY(q);
    return kNY(q)
}
// @from(Ln 429061, Col 0)
function VNY() {
    let q = vd8();
    switch (q) {
        case "trim":
            return GNY;
        case "cut":
            return vNY;
        case "cap":
            return TNY;
        case null:
            return SCK;
        default:
            return SCK
    }
}
// @from(Ln 429077, Col 0)
function kNY(q) {
    if (q.isSubAgent) return [];
    if (Sj()) return ENY(q);
    let K = OvK(),
        _ = wvK(),
        Y = `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits (with the exception of the plan file mentioned below), run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received.

## Plan File Info:
${q.planExists?`A plan file already exists at ${q.planFilePath}. You can read it and make incremental edits using the ${mM.name} tool.`:`No plan file exists yet. You should create your plan at ${q.planFilePath} using the ${hX.name} tool.`}
You should build your plan incrementally by writing to or editing this file. NOTE that this is the only file you are allowed to edit - other than this you are only allowed to take READ-ONLY actions.

## Plan Workflow

### Phase 1: Initial Understanding
Goal: Gain a comprehensive understanding of the user's request by reading through code and asking them questions. Critical: In this phase you should only use the ${Lc.agentType} subagent type.

1. Focus on understanding the user's request and the code associated with their request. Actively search for existing functions, utilities, and patterns that can be reused — avoid proposing new code when suitable implementations already exist.

2. **Launch up to ${_} ${Lc.agentType} agents IN PARALLEL** (single message, multiple tool calls) to efficiently explore the codebase.
   - Use 1 agent when the task is isolated to known files, the user provided specific file paths, or you're making a small targeted change.
   - Use multiple agents when: the scope is uncertain, multiple areas of the codebase are involved, or you need to understand existing patterns before planning.
   - Quality over quantity - ${_} agents maximum, but you should try to use the minimum number of agents necessary (usually just 1)
   - If using multiple agents: Provide each agent with a specific search focus or area to explore. Example: One agent searches for existing implementations, another explores related components, a third investigating testing patterns

### Phase 2: Design
Goal: Design an implementation approach.

Launch ${Lb8.agentType} agent(s) to design the implementation based on the user's intent and your exploration results from Phase 1.

You can launch up to ${K} agent(s) in parallel.

**Guidelines:**
- **Default**: Launch at least 1 Plan agent for most tasks - it helps validate your understanding and consider alternatives
- **Skip agents**: Only for truly trivial tasks (typo fixes, single-line changes, simple renames)
${K>1?`- **Multiple agents**: Use up to ${K} agents for complex tasks that benefit from different perspectives

Examples of when to use multiple agents:
- The task touches multiple parts of the codebase
- It's a large refactor or architectural change
- There are many edge cases to consider
- You'd benefit from exploring different approaches

Example perspectives by task type:
- New feature: simplicity vs performance vs maintainability
- Bug fix: root cause vs workaround vs prevention
- Refactoring: minimal change vs clean architecture
`:""}
In the agent prompt:
- Provide comprehensive background context from Phase 1 exploration including filenames and code path traces
- Describe requirements and constraints
- Request a detailed implementation plan

### Phase 3: Review
Goal: Review the plan(s) from Phase 2 and ensure alignment with the user's intentions.
1. Read the critical files identified by agents to deepen your understanding
2. Ensure that the plans align with the user's original request
3. Use ${AO} to clarify any remaining questions with the user

${VNY()}

### Phase 5: Call ${zZ.name}
At the very end of your turn, once you have asked the user questions and are happy with your final plan file - you should always call ${zZ.name} to indicate to the user that you are done planning.
This is critical - your turn should only end with either using the ${AO} tool OR calling ${zZ.name}. Do not stop unless it's for these 2 reasons

**Important:** Use ${AO} ONLY to clarify requirements or choose between approaches. Use ${zZ.name} to request plan approval. Do NOT ask about plan approval in any other way - no text questions, no AskUserQuestion. Phrases like "Is this plan okay?", "Should I proceed?", "How does this plan look?", "Any changes before we start?", or similar MUST use ${zZ.name}.

NOTE: At any point in time through this workflow you should feel free to ask the user questions or clarifications using the ${AO} tool. Don't make large assumptions about user intent. The goal is to present a well researched plan to the user, and tie any loose ends before implementation begins.`;
    return X_([t8({
        content: Y,
        isMeta: !0
    })])
}
// @from(Ln 429150, Col 0)
function NNY() {
    let q = $H() ? [xq, "`find`", "`grep`"] : [xq, T9, a5],
        {
            allowedTools: K
        } = Ew();
    return (K && K.length > 0 && !$H() ? q.filter((z) => K.includes(z)) : q).join(", ")
}
// @from(Ln 429158, Col 0)
function ENY(q) {
    let _ = `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits (with the exception of the plan file mentioned below), run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received.

## Plan File Info:
${q.planExists?`A plan file already exists at ${q.planFilePath}. You can read it and make incremental edits using the ${mM.name} tool.`:`No plan file exists yet. You should create your plan at ${q.planFilePath} using the ${hX.name} tool.`}

## Iterative Planning Workflow

You are pair-planning with the user. Explore the code to build context, ask the user questions when you hit decisions you can't make alone, and write your findings into the plan file as you go. The plan file (above) is the ONLY file you may edit — it starts as a rough skeleton and gradually becomes the final plan.

### The Loop

Repeat this cycle until the plan is complete:

1. **Explore** — Use ${NNY()} to read code. Look for existing functions, utilities, and patterns to reuse.${G88()?` You can use the ${Lc.agentType} agent type to parallelize complex searches without filling your context, though for straightforward queries direct tools are simpler.`:""}
2. **Update the plan file** — After each discovery, immediately capture what you learned. Don't wait until the end.
3. **Ask the user** — When you hit an ambiguity or decision you can't resolve from code alone, use ${AO}. Then go back to step 1.

### First Turn

Start by quickly scanning a few key files to form an initial understanding of the task scope. Then write a skeleton plan (headers and rough notes) and ask the user your first round of questions. Don't explore exhaustively before engaging the user.

### Asking Good Questions

- Never ask what you could find out by reading the code
- Batch related questions together (use multi-question ${AO} calls)
- Focus on things only the user can answer: requirements, preferences, tradeoffs, edge case priorities
- Scale depth to the task — a vague feature request needs many rounds; a focused bug fix may need one or none

### Plan File Structure
Your plan file should be divided into clear sections using markdown headers, based on the request. Fill out these sections as you go.
- Begin with a **Context** section: explain why this change is being made — the problem or need it addresses, what prompted it, and the intended outcome
- Include only your recommended approach, not all alternatives
- Ensure that the plan file is concise enough to scan quickly, but detailed enough to execute effectively
- Include the paths of critical files to be modified
- Reference existing functions and utilities you found that should be reused, with their file paths
- Include a verification section describing how to test the changes end-to-end (run the code, use MCP tools, run tests)

### When to Converge

Your plan is ready when you've addressed all ambiguities and it covers: what to change, which files to modify, what existing code to reuse (with file paths), and how to verify the changes. Call ${zZ.name} when the plan is ready for approval.

### Ending Your Turn

Your turn should only end by either:
- Using ${AO} to gather more information
- Calling ${zZ.name} when the plan is ready for approval

**Important:** Use ${zZ.name} to request plan approval. Do NOT ask about plan approval via text or AskUserQuestion.`;
    return X_([t8({
        content: _,
        isMeta: !0
    })])
}
// @from(Ln 429213, Col 0)
function yNY(q) {
    let K = Sj() ? "Follow iterative workflow: explore codebase, interview user, write to plan incrementally." : "Follow 5-phase workflow.",
        _ = `Plan mode still active (see full instructions earlier in conversation). Read-only except plan file (${q.planFilePath}). ${K} End turns with ${AO} (for clarifications) or ${zZ.name} (for plan approval). Never ask about plan approval via text or AskUserQuestion.`;
    return X_([t8({
        content: _,
        isMeta: !0
    })])
}
// @from(Ln 429222, Col 0)
function LNY(q) {
    let _ = `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits, run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received (for example, to make edits). Instead, you should:

## Plan File Info:
${q.planExists?`A plan file already exists at ${q.planFilePath}. You can read it and make incremental edits using the ${mM.name} tool if you need to.`:`No plan file exists yet. You should create your plan at ${q.planFilePath} using the ${hX.name} tool if you need to.`}
You should build your plan incrementally by writing to or editing this file. NOTE that this is the only file you are allowed to edit - other than this you are only allowed to take READ-ONLY actions.
Answer the user's query comprehensively, using the ${AO} tool if you need to ask the user clarifying questions. If you do use the ${AO}, make sure to ask all clarifying questions you need to fully understand the user's intent before proceeding.`;
    return X_([t8({
        content: _,
        isMeta: !0
    })])
}
// @from(Ln 429235, Col 0)
function hNY(q) {
    if (q.reminderType === "sparse") return SNY();
    return RNY()
}
// @from(Ln 429240, Col 0)
function RNY() {
    return X_([t8({
        content: `## Auto Mode Active

Auto mode is active. The user chose continuous, autonomous execution. You should:

1. **Execute immediately** — Start implementing right away. Make reasonable assumptions and proceed on low-risk work.
2. **Minimize interruptions** — Prefer making reasonable assumptions over asking questions for routine decisions.
3. **Prefer action over planning** — Do not enter plan mode unless the user explicitly asks. When in doubt, start coding.
4. **Expect course corrections** — The user may provide suggestions or course corrections at any point; treat those as normal input.
5. **Do not take overly destructive actions** — Auto mode is not a license to destroy. Anything that deletes data or modifies shared or production systems still needs explicit user confirmation. If you reach such a decision point, ask and wait, or course correct to a safer method instead.
6. **Avoid data exfiltration** — Post even routine messages to chat platforms or work tickets only if the user has directed you to. You must not share secrets (e.g. credentials, internal documentation) unless the user has explicitly authorized both that specific secret and its destination.`,
        isMeta: !0
    })])
}
// @from(Ln 429256, Col 0)
function SNY() {
    return X_([t8({
        content: "Auto mode still active (see full instructions earlier in conversation). Execute autonomously, minimize interruptions, prefer action over planning.",
        isMeta: !0
    })])
}
// @from(Ln 429263, Col 0)
function Xz7(q) {
    if (z4()) {
        if (q.type === "teammate_mailbox") return [t8({
            content: tkY().formatTeammateMessages(q.messages),
            isMeta: !0
        })];
        if (q.type === "team_context") return [t8({
            content: `<system-reminder>
# Team Coordination

You are a teammate in team "${q.teamName}".

**Your Identity:**
- Name: ${q.agentName}

**Team Resources:**
- Team config: ${q.teamConfigPath}
- Task list: ${q.taskListPath}

**Team Leader:** The team lead's name is "team-lead". Send updates and completion notifications to them.

Read the team config to discover your teammates' names. Check the task list periodically. Create new tasks when work should be divided. Mark tasks resolved when complete.

**IMPORTANT:** Always refer to teammates by their NAME (e.g., "team-lead", "analyzer", "researcher"), never by UUID. When messaging, use the name directly:

\`\`\`json
{
  "to": "team-lead",
  "message": "Your message here",
  "summary": "Brief 5-10 word preview"
}
\`\`\`
</system-reminder>`,
            isMeta: !0
        })]
    }
    if (q.type in CCK) return CCK[q.type](q);
    switch (q.type) {
        case "file": {
            let _ = q.content;
            switch (_.type) {
                case "image":
                    return X_([R98(Kz.name, {
                        file_path: q.filename
                    }), h98(Kz, _)]);
                case "text":
                    return X_([R98(Kz.name, {
                        file_path: q.filename
                    }), h98(Kz, _), ...q.truncated ? [t8({
                        content: `Note: The file ${q.filename} was too large and has been truncated to the first ${Ya6} lines. Don't tell the user about this truncation. Use ${Kz.name} to read more of the file if you need.`,
                        isMeta: !0
                    })] : []]);
                case "notebook":
                    return X_([R98(Kz.name, {
                        file_path: q.filename
                    }), h98(Kz, _)]);
                case "pdf":
                    return X_([R98(Kz.name, {
                        file_path: q.filename
                    }), h98(Kz, _)])
            }
            break
        }
        case "invoked_skills": {
            if (q.skills.length === 0) return [];
            let _ = q.skills.map((z) => `### Skill: ${z.name}
Path: ${z.path}

${z.content}`).join(`

---

`);
            return X_([t8({
                content: `The following skills were invoked in this session. Continue to follow these guidelines:

${_}`,
                isMeta: !0
            })])
        }
        case "todo_reminder": {
            let _ = q.content.map((Y, A) => `${A+1}. [${Y.status}] ${Y.content}`).join(`
`),
                z = `The TodoWrite tool hasn't been used recently. If you're working on tasks that would benefit from tracking progress, consider using the TodoWrite tool to track progress. Also consider cleaning up the todo list if has become stale and no longer matches what you are working on. Only use it if it's relevant to the current work. This is just a gentle reminder - ignore if not applicable. Make sure that you NEVER mention this reminder to the user
`;
            if (_.length > 0) z += `

Here are the existing contents of your todo list:

[${_}]`;
            return X_([t8({
                content: z,
                isMeta: !0
            })])
        }
        case "task_reminder": {
            if (!kJ()) return [];
            let _ = q.content.map((Y) => `#${Y.id}. [${Y.status}] ${Y.subject}`).join(`
`),
                z = `The task tools haven't been used recently. If you're working on tasks that would benefit from tracking progress, consider using ${YT} to add new tasks and ${gk} to update task status (set to in_progress when starting, completed when done). Also consider cleaning up the task list if it has become stale. Only use these if relevant to the current work. This is just a gentle reminder - ignore if not applicable. Make sure that you NEVER mention this reminder to the user
`;
            if (_.length > 0) z += `

Here are the existing tasks:

${_}`;
            return X_([t8({
                content: z,
                isMeta: !0
            })])
        }
        case "relevant_memories":
            return X_(q.memories.map((z, Y) => {
                let A = z.header ?? B97(z.path, z.mtimeMs),
                    O = z.path.startsWith("<synthesis:");
                return t8({
                    content: `${Y===0&&!O?`Retrieved for possible relevance — use only if it actually applies to what the user asked.

`:""}${A}

${z.content}`,
                    isMeta: !0
                })
            }));
        case "queued_command": {
            let _ = q.origin ?? (q.commandMode === "task-notification" ? {
                    kind: "task-notification"
                } : void 0),
                z = _ !== void 0 || q.isMeta ? {
                    isMeta: !0
                } : {};
            if (Array.isArray(q.prompt)) {
                let Y = q.prompt.filter((w) => w.type === "text").map((w) => w.text).join(`
`),
                    A = q.prompt.filter((w) => w.type === "image"),
                    O = [{
                        type: "text",
                        text: ICK(Y, _)
                    }, ...A];
                return X_([t8({
                    content: O,
                    ...z,
                    origin: _,
                    uuid: q.source_uuid
                })])
            }
            return X_([t8({
                content: ICK(String(q.prompt), _),
                ...z,
                origin: _,
                uuid: q.source_uuid
            })])
        }
        case "diagnostics": {
            if (q.files.length === 0) return [];
            let _ = mF.formatDiagnosticsSummary(q.files);
            return X_([t8({
                content: `<new-diagnostics>The following new diagnostic issues were detected:

${_}</new-diagnostics>`,
                isMeta: !0
            })])
        }
        case "plan_mode":
            return fNY(q);
        case "plan_mode_reentry": {
            let _ = `## Re-entering Plan Mode

You are returning to plan mode after having previously exited it. A plan file exists at ${q.planFilePath} from your previous planning session.

**Before proceeding with any new planning, you should:**
1. Read the existing plan file to understand what was previously planned
2. Evaluate the user's current request against that plan
3. Decide how to proceed:
   - **Different task**: If the user's request is for a different task—even if it's similar or related—start fresh by overwriting the existing plan
   - **Same task, continuing**: If this is explicitly a continuation or refinement of the exact same task, modify the existing plan while cleaning up outdated or irrelevant sections
4. Continue on with the plan process and most importantly you should always edit the plan file one way or the other before calling ${zZ.name}

Treat this as a fresh planning session. Do not assume the existing plan is relevant without evaluating it first.`;
            return X_([t8({
                content: _,
                isMeta: !0
            })])
        }
        case "auto_mode":
            return hNY(q);
        case "mcp_resource": {
            let _ = q.content;
            if (!_ || !_.contents || _.contents.length === 0) return X_([t8({
                content: `<mcp-resource server="${q.server}" uri="${q.uri}">(No content)</mcp-resource>`,
                isMeta: !0
            })]);
            let z = [];
            for (let Y of _.contents)
                if (Y && typeof Y === "object") {
                    if ("text" in Y && typeof Y.text === "string") z.push({
                        type: "text",
                        text: "Full contents of resource:"
                    }, {
                        type: "text",
                        text: Y.text
                    }, {
                        type: "text",
                        text: "Do NOT read this resource again unless you think it may have changed, since you already have the full contents."
                    });
                    else if ("blob" in Y) {
                        let A = "mimeType" in Y ? String(Y.mimeType) : "application/octet-stream";
                        z.push({
                            type: "text",
                            text: `[Binary content: ${A}]`
                        })
                    }
                } if (z.length > 0) return X_([t8({
                content: z,
                isMeta: !0
            })]);
            else return i8(q.server, `No displayable content found in MCP resource ${q.uri}.`), X_([t8({
                content: `<mcp-resource server="${q.server}" uri="${q.uri}">(No displayable content)</mcp-resource>`,
                isMeta: !0
            })])
        }
        case "task_status": {
            let _ = q.status === "killed" ? "stopped" : q.status;
            if (q.status === "killed") return [t8({
                content: IT(`Task "${q.description}" (${q.taskId}) was stopped by the user.`),
                isMeta: !0
            })];
            if (q.status === "running") {
                let Y = [`Background agent "${q.description}" (${q.taskId}) is still running.`];
                if (q.deltaSummary) Y.push(`Progress: ${q.deltaSummary}`);
                if (q.outputFilePath) Y.push(`Do NOT spawn a duplicate. You will be notified when it completes. You can read partial output at ${q.outputFilePath} or send it a message with ${tW}.`);
                else Y.push(`Do NOT spawn a duplicate. You will be notified when it completes. You can check its progress with the ${tN} tool or send it a message with ${tW}.`);
                return [t8({
                    content: IT(Y.join(" ")),
                    isMeta: !0
                })]
            }
            let z = [`Task ${q.taskId}`, `(type: ${q.taskType})`, `(status: ${_})`, `(description: ${q.description})`];
            if (q.deltaSummary) z.push(`Delta: ${q.deltaSummary}`);
            if (q.outputFilePath) z.push(`Read the output file to retrieve the result: ${q.outputFilePath}`);
            else z.push(`You can check its output using the ${tN} tool.`);
            return [t8({
                content: IT(z.join(" ")),
                isMeta: !0
            })]
        }
        case "async_hook_response": {
            let _ = q.response,
                z = [];
            if (_.systemMessage) z.push(t8({
                content: _.systemMessage,
                isMeta: !0
            }));
            if (_.hookSpecificOutput && "additionalContext" in _.hookSpecificOutput && _.hookSpecificOutput.additionalContext) z.push(t8({
                content: _.hookSpecificOutput.additionalContext,
                isMeta: !0
            }));
            return X_(z)
        }
        case "hook_success":
            if (q.hookEvent !== "SessionStart" && q.hookEvent !== "UserPromptSubmit") return [];
            if (q.content === "") return [];
            return [t8({
                content: IT(`${q.hookName} hook success: ${q.content}`),
                isMeta: !0
            })];
        case "context_efficiency":
            return [];
        case "deferred_tools_delta": {
            let _ = [];
            if (q.addedLines.length > 0) _.push(`The following deferred tools are now available via ${Zj}. Their schemas are NOT loaded — calling them directly will fail with InputValidationError. Use ${Zj} with query "select:<name>[,<name>...]" to load tool schemas before calling them:
${q.addedLines.join(`
`)}`);
            if (q.removedNames.length > 0) _.push(`The following deferred tools are no longer available (their MCP server disconnected). Do not search for them — ${Zj} will return no match:
${q.removedNames.join(`
`)}`);
            return X_([t8({
                content: _.join(`

`),
                isMeta: !0
            })])
        }
        case "agent_listing_delta": {
            let _ = [];
            if (q.addedLines.length > 0) {
                let z = q.isInitial ? "Available agent types for the Agent tool:" : "New agent types are now available for the Agent tool:";
                _.push(`${z}
${q.addedLines.join(`
`)}`)
            }
            if (q.removedTypes.length > 0) _.push(`The following agent types are no longer available:
${q.removedTypes.map((z)=>`- ${z}`).join(`
`)}`);
            if (q.isInitial && q.showConcurrencyNote) _.push("When you launch multiple agents for independent work, send them in a single message with multiple tool uses so they run concurrently.");
            return X_([t8({
                content: _.join(`

`),
                isMeta: !0
            })])
        }
        case "mcp_instructions_delta": {
            let _ = [];
            if (q.addedBlocks.length > 0) _.push(`# MCP Server Instructions

The following MCP servers have provided instructions for how to use their tools and resources:

${q.addedBlocks.join(`

`)}`);
            if (q.removedNames.length > 0) _.push(`The following MCP servers have disconnected. Their instructions above no longer apply:
${q.removedNames.join(`
`)}`);
            return X_([t8({
                content: _.join(`

`),
                isMeta: !0
            })])
        }
        case "verify_plan_reminder": {
            let z = `You have completed implementing the plan. Please call the "" tool directly (NOT the ${T4} tool or an agent) to verify that all plan items were completed correctly.`;
            return X_([t8({
                content: z,
                isMeta: !0
            })])
        }
    }
    if (["autocheckpointing", "background_task_status", "todo", "task_progress", "ultramemory", "compaction_reminder", "companion_intro", "pen_mode_enter", "pen_mode_exit"].includes(q.type)) return [];
    return Kh("normalizeAttachmentForAPI", Error(`Unknown attachment type: ${q.type}`)), []
}
// @from(Ln 429596, Col 0)
function iCK(q) {
    if (typeof q !== "object" || q === null) return q;
    let K = q;
    if (typeof K.originalFile === "string" && K.originalFile.length > CNY) return {
        ...K,
        originalFile: null
    };
    return q
}
// @from(Ln 429606, Col 0)
function rCK(q, K, _ = 200) {
    let z = q.length - _;
    if (z <= 0) return q;
    let Y = new Map,
        A;
    for (let O = 0; O < q.length; O++) {
        let w = q[O];
        if (w.type === "assistant" && Array.isArray(w.message.content)) {
            for (let J of w.message.content)
                if (J.type === "tool_use") {
                    let X = rK(K, J.name);
                    if (X?.stripForStorage) Y.set(J.id, X)
                } continue
        }
        if (O >= z || w.type !== "user" || w.isVirtual || w.toolUseResult == null || !Array.isArray(w.message.content)) continue;
        let $ = w.message.content.find((J) => J.type === "tool_result"),
            j = $ && Y.get($.tool_use_id);
        if (!j?.stripForStorage) continue;
        let H = j.stripForStorage(w.toolUseResult);
        if (H === w.toolUseResult) continue;
        if (!A) A = q.slice();
        A[O] = {
            ...w,
            toolUseResult: H
        }
    }
    return A ?? q
}
// @from(Ln 429635, Col 0)
function h98(q, K) {
    try {
        let _ = q.mapToolResultToToolResultBlockParam(K, "1");
        if (Array.isArray(_.content) && _.content.some((Y) => Y.type === "image")) return t8({
            content: _.content,
            isMeta: !0
        });
        let z = typeof _.content === "string" ? _.content : I6(_.content);
        return t8({
            content: `Result of calling the ${q.name} tool:
${z}`,
            isMeta: !0
        })
    } catch {
        return t8({
            content: `Result of calling the ${q.name} tool: Error`,
            isMeta: !0
        })
    }
}
// @from(Ln 429656, Col 0)
function R98(q, K) {
    return t8({
        content: `Called the ${q} tool with the following input: ${I6(K)}`,
        isMeta: !0
    })
}
// @from(Ln 429663, Col 0)
function eO(q, K, _, z) {
    return {
        type: "system",
        subtype: "informational",
        content: q,
        isMeta: !1,
        timestamp: new Date().toISOString(),
        uuid: ZG(),
        toolUseID: _,
        level: K,
        ...z && {
            preventContinuation: z
        }
    }
}