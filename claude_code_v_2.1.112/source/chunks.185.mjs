
// @from(Ln 477207, Col 4)
VcY = `---
allowed-tools: Bash(git diff *), Bash(git status *), Bash(git log *), Bash(git show *), Bash(git remote show *), Read, Glob, Grep, LS, Task
description: Complete a security review of the pending changes on the current branch
---

You are a senior security engineer conducting a focused security review of the changes on this branch.

GIT STATUS:

\`\`\`
!\`git status\`
\`\`\`

FILES MODIFIED:

\`\`\`
!\`git diff --name-only origin/HEAD...\`
\`\`\`

COMMITS:

\`\`\`
!\`git log --no-decorate origin/HEAD...\`
\`\`\`

DIFF CONTENT:

\`\`\`
!\`git diff origin/HEAD...\`
\`\`\`

Review the complete diff above. This contains all code changes in the PR.


OBJECTIVE:
Perform a security-focused code review to identify HIGH-CONFIDENCE security vulnerabilities that could have real exploitation potential. This is not a general code review - focus ONLY on security implications newly added by this PR. Do not comment on existing security concerns.

CRITICAL INSTRUCTIONS:
1. MINIMIZE FALSE POSITIVES: Only flag issues where you're >80% confident of actual exploitability
2. AVOID NOISE: Skip theoretical issues, style concerns, or low-impact findings
3. FOCUS ON IMPACT: Prioritize vulnerabilities that could lead to unauthorized access, data breaches, or system compromise
4. EXCLUSIONS: Do NOT report the following issue types:
   - Denial of Service (DOS) vulnerabilities, even if they allow service disruption
   - Secrets or sensitive data stored on disk (these are handled by other processes)
   - Rate limiting or resource exhaustion issues

SECURITY CATEGORIES TO EXAMINE:

**Input Validation Vulnerabilities:**
- SQL injection via unsanitized user input
- Command injection in system calls or subprocesses
- XXE injection in XML parsing
- Template injection in templating engines
- NoSQL injection in database queries
- Path traversal in file operations

**Authentication & Authorization Issues:**
- Authentication bypass logic
- Privilege escalation paths
- Session management flaws
- JWT token vulnerabilities
- Authorization logic bypasses

**Crypto & Secrets Management:**
- Hardcoded API keys, passwords, or tokens
- Weak cryptographic algorithms or implementations
- Improper key storage or management
- Cryptographic randomness issues
- Certificate validation bypasses

**Injection & Code Execution:**
- Remote code execution via deseralization
- Pickle injection in Python
- YAML deserialization vulnerabilities
- Eval injection in dynamic code execution
- XSS vulnerabilities in web applications (reflected, stored, DOM-based)

**Data Exposure:**
- Sensitive data logging or storage
- PII handling violations
- API endpoint data leakage
- Debug information exposure

Additional notes:
- Even if something is only exploitable from the local network, it can still be a HIGH severity issue

ANALYSIS METHODOLOGY:

Phase 1 - Repository Context Research (Use file search tools):
- Identify existing security frameworks and libraries in use
- Look for established secure coding patterns in the codebase
- Examine existing sanitization and validation patterns
- Understand the project's security model and threat model

Phase 2 - Comparative Analysis:
- Compare new code changes against existing security patterns
- Identify deviations from established secure practices
- Look for inconsistent security implementations
- Flag code that introduces new attack surfaces

Phase 3 - Vulnerability Assessment:
- Examine each modified file for security implications
- Trace data flow from user inputs to sensitive operations
- Look for privilege boundaries being crossed unsafely
- Identify injection points and unsafe deserialization

REQUIRED OUTPUT FORMAT:

You MUST output your findings in markdown. The markdown output should contain the file, line number, severity, category (e.g. \`sql_injection\` or \`xss\`), description, exploit scenario, and fix recommendation.

For example:

# Vuln 1: XSS: \`foo.py:42\`

* Severity: High
* Description: User input from \`username\` parameter is directly interpolated into HTML without escaping, allowing reflected XSS attacks
* Exploit Scenario: Attacker crafts URL like /bar?q=<script>alert(document.cookie)</script> to execute JavaScript in victim's browser, enabling session hijacking or data theft
* Recommendation: Use Flask's escape() function or Jinja2 templates with auto-escaping enabled for all user inputs rendered in HTML

SEVERITY GUIDELINES:
- **HIGH**: Directly exploitable vulnerabilities leading to RCE, data breach, or authentication bypass
- **MEDIUM**: Vulnerabilities requiring specific conditions but with significant impact
- **LOW**: Defense-in-depth issues or lower-impact vulnerabilities

CONFIDENCE SCORING:
- 0.9-1.0: Certain exploit path identified, tested if possible
- 0.8-0.9: Clear vulnerability pattern with known exploitation methods
- 0.7-0.8: Suspicious pattern requiring specific conditions to exploit
- Below 0.7: Don't report (too speculative)

FINAL REMINDER:
Focus on HIGH and MEDIUM findings only. Better to miss some theoretical issues than flood the report with false positives. Each finding should be something a security engineer would confidently raise in a PR review.

FALSE POSITIVE FILTERING:

> You do not need to run commands to reproduce the vulnerability, just read the code to determine if it is a real vulnerability. Do not use the bash tool or write to any files.
>
> HARD EXCLUSIONS - Automatically exclude findings matching these patterns:
> 1. Denial of Service (DOS) vulnerabilities or resource exhaustion attacks.
> 2. Secrets or credentials stored on disk if they are otherwise secured.
> 3. Rate limiting concerns or service overload scenarios.
> 4. Memory consumption or CPU exhaustion issues.
> 5. Lack of input validation on non-security-critical fields without proven security impact.
> 6. Input sanitization concerns for GitHub Action workflows unless they are clearly triggerable via untrusted input.
> 7. A lack of hardening measures. Code is not expected to implement all security best practices, only flag concrete vulnerabilities.
> 8. Race conditions or timing attacks that are theoretical rather than practical issues. Only report a race condition if it is concretely problematic.
> 9. Vulnerabilities related to outdated third-party libraries. These are managed separately and should not be reported here.
> 10. Memory safety issues such as buffer overflows or use-after-free-vulnerabilities are impossible in rust. Do not report memory safety issues in rust or any other memory safe languages.
> 11. Files that are only unit tests or only used as part of running tests.
> 12. Log spoofing concerns. Outputting un-sanitized user input to logs is not a vulnerability.
> 13. SSRF vulnerabilities that only control the path. SSRF is only a concern if it can control the host or protocol.
> 14. Including user-controlled content in AI system prompts is not a vulnerability.
> 15. Regex injection. Injecting untrusted content into a regex is not a vulnerability.
> 16. Regex DOS concerns.
> 16. Insecure documentation. Do not report any findings in documentation files such as markdown files.
> 17. A lack of audit logs is not a vulnerability.
>
> PRECEDENTS -
> 1. Logging high value secrets in plaintext is a vulnerability. Logging URLs is assumed to be safe.
> 2. UUIDs can be assumed to be unguessable and do not need to be validated.
> 3. Environment variables and CLI flags are trusted values. Attackers are generally not able to modify them in a secure environment. Any attack that relies on controlling an environment variable is invalid.
> 4. Resource management issues such as memory or file descriptor leaks are not valid.
> 5. Subtle or low impact web vulnerabilities such as tabnabbing, XS-Leaks, prototype pollution, and open redirects should not be reported unless they are extremely high confidence.
> 6. React and Angular are generally secure against XSS. These frameworks do not need to sanitize or escape user input unless it is using dangerouslySetInnerHTML, bypassSecurityTrustHtml, or similar methods. Do not report XSS vulnerabilities in React or Angular components or tsx files unless they are using unsafe methods.
> 7. Most vulnerabilities in github action workflows are not exploitable in practice. Before validating a github action workflow vulnerability ensure it is concrete and has a very specific attack path.
> 8. A lack of permission checking or authentication in client-side JS/TS code is not a vulnerability. Client-side code is not trusted and does not need to implement these checks, they are handled on the server-side. The same applies to all flows that send untrusted data to the backend, the backend is responsible for validating and sanitizing all inputs.
> 9. Only include MEDIUM findings if they are obvious and concrete issues.
> 10. Most vulnerabilities in ipython notebooks (*.ipynb files) are not exploitable in practice. Before validating a notebook vulnerability ensure it is concrete and has a very specific attack path where untrusted input can trigger the vulnerability.
> 11. Logging non-PII data is not a vulnerability even if the data may be sensitive. Only report logging vulnerabilities if they expose sensitive information such as secrets, passwords, or personally identifiable information (PII).
> 12. Command injection vulnerabilities in shell scripts are generally not exploitable in practice since shell scripts generally do not run with untrusted user input. Only report command injection vulnerabilities in shell scripts if they are concrete and have a very specific attack path for untrusted input.
>
> SIGNAL QUALITY CRITERIA - For remaining findings, assess:
> 1. Is there a concrete, exploitable vulnerability with a clear attack path?
> 2. Does this represent a real security risk vs theoretical best practice?
> 3. Are there specific code locations and reproduction steps?
> 4. Would this finding be actionable for a security team?
>
> For each finding, assign a confidence score from 1-10:
> - 1-3: Low confidence, likely false positive or noise
> - 4-6: Medium confidence, needs investigation
> - 7-10: High confidence, likely true vulnerability

START ANALYSIS:

Begin your analysis now. Do this in 3 steps:

1. Use a sub-task to identify vulnerabilities. Use the repository exploration tools to understand the codebase context, then analyze the PR changes for security implications. In the prompt for this sub-task, include all of the above.
2. Then for each vulnerability identified by the above sub-task, create a new sub-task to filter out false-positives. Launch these sub-tasks as parallel sub-tasks. In the prompt for these sub-tasks, include everything in the "FALSE POSITIVE FILTERING" instructions.
3. Filter out any vulnerabilities where the sub-task reported a confidence less than 8.

Your final reply must contain the markdown report and nothing else.`
// @from(Ln 477398, Col 4)
QnK
// @from(Ln 477399, Col 4)
dnK = L(() => {
    Lf();
    ds();
    LI6();
    QnK = UnK({
        name: "security-review",
        description: "Complete a security review of the pending changes on the current branch",
        progressMessage: "analyzing code changes for security risks",
        pluginName: "security-review",
        pluginCommand: "security-review",
        async getPromptWhileMarketplaceIsPrivate(q, K) {
            let _ = p2(VcY),
                z = yc(_.frontmatter["allowed-tools"]);
            return [{
                type: "text",
                text: await An(_.content, {
                    ...K,
                    getAppState() {
                        let A = K.getAppState();
                        return {
                            ...A,
                            toolPermissionContext: {
                                ...A.toolPermissionContext,
                                alwaysAllowRules: {
                                    ...A.toolPermissionContext.alwaysAllowRules,
                                    command: z
                                }
                            }
                        }
                    }
                }, "security-review")
            }]
        }
    })
})
// @from(Ln 477434, Col 4)
cnK
// @from(Ln 477435, Col 4)
lnK = L(() => {
    cnK = {
        isEnabled: () => !1,
        isHidden: !0,
        name: "stub"
    }
})
// @from(Ln 477442, Col 4)
kcY
// @from(Ln 477442, Col 9)
NcY
// @from(Ln 477442, Col 14)
U$7
// @from(Ln 477443, Col 4)
nnK = L(() => {
    D_();
    kcY = {
        ghostty: "Ghostty",
        kitty: "Kitty",
        "iTerm.app": "iTerm2",
        WezTerm: "WezTerm"
    }, NcY = {
        type: "local-jsx",
        name: "terminal-setup",
        description: X7.terminal === "Apple_Terminal" ? "Enable Option+Enter key binding for newlines and visual bell" : "Install Shift+Enter key binding for newlines",
        isHidden: X7.terminal !== null && X7.terminal in kcY,
        load: () => Promise.resolve().then(() => (o$6(), s24))
    }, U$7 = NcY
})
// @from(Ln 477458, Col 4)
inK = {}
// @from(Ln 477462, Col 4)
Q$7
// @from(Ln 477462, Col 9)
EcY = async (q, K) => {
    return Q$7.createElement(b_6, {
        onClose: q,
        context: K,
        defaultTab: "Usage"
    })
}
// @from(Ln 477469, Col 4)
rnK = L(() => {
    a98();
    Q$7 = K6(P6(), 1)
})
// @from(Ln 477473, Col 4)
d$7
// @from(Ln 477474, Col 4)
onK = L(() => {
    d$7 = {
        type: "local-jsx",
        name: "usage",
        description: "Show plan usage limits",
        availability: ["claude-ai"],
        load: () => Promise.resolve().then(() => (rnK(), inK))
    }
})
// @from(Ln 477483, Col 4)
anK = {}
// @from(Ln 477488, Col 0)
function ycY(q) {
    let K = s(8),
        {
            onDone: _
        } = q,
        [, z] = Zq(),
        Y;
    if (K[0] !== _ || K[1] !== z) Y = (w) => {
        z(w), _(`Theme set to ${w}`)
    }, K[0] = _, K[1] = z, K[2] = Y;
    else Y = K[2];
    let A;
    if (K[3] !== _) A = () => {
        _("Theme picker dismissed", {
            display: "system"
        })
    }, K[3] = _, K[4] = A;
    else A = K[4];
    let O;
    if (K[5] !== Y || K[6] !== A) O = jW6.createElement(A_, {
        color: "permission"
    }, jW6.createElement(Zx6, {
        onThemeSelect: Y,
        onCancel: A,
        skipExitHandling: !0
    })), K[5] = Y, K[6] = A, K[7] = O;
    else O = K[7];
    return O
}
// @from(Ln 477517, Col 4)
jW6
// @from(Ln 477517, Col 9)
LcY = async (q, K) => {
    return jW6.createElement(ycY, {
        onDone: q
    })
}
// @from(Ln 477522, Col 4)
snK = L(() => {
    o6();
    DJ();
    cn8();
    g6();
    jW6 = K6(P6(), 1)
})
// @from(Ln 477529, Col 4)
hcY
// @from(Ln 477529, Col 9)
c$7
// @from(Ln 477530, Col 4)
tnK = L(() => {
    hcY = {
        type: "local-jsx",
        name: "theme",
        description: "Change the theme",
        load: () => Promise.resolve().then(() => (snK(), anK))
    }, c$7 = hcY
})
// @from(Ln 477547, Col 0)
async function er8(q = {}) {
    let {
        cmd: K,
        prefixArgs: _
    } = q.launcher ?? CC6(), z = I8(), Y = !0;
    if (q.freshIfNoTranscript) Y = await ScY(bY()).then((w) => w.size > 0, () => !1);
    ZS4(), setInterval(() => {}, 1073741824), await aQ(mT(), 2000, "flush timeout").catch(() => {}), u88(), await aQ(_w8(), 2000, "cleanup timeout").catch(() => {}), q.preSpawn?.();
    let A = {
        ...process.env
    };
    delete A.CLAUDE_CODE_TUI_JUST_SWITCHED, Object.assign(A, q.env);
    for (let w of q.dropEnv ?? []) delete A[w];
    let O = RcY(K, Y ? [..._, "--resume", z] : [..._], {
        stdio: "inherit",
        env: A
    });
    O.ref(), pF8();
    for (let w of ["SIGINT", "SIGTERM", "SIGHUP"]) process.removeAllListeners(w), process.on(w, () => {});
    return new Promise(() => {
        O.on("close", (w, $) => {
            let j = $ ? 128 + (CcY.signals[$] ?? 0) : 0;
            process.exit(w ?? j)
        }), O.on("error", (w) => {
            process.stderr.write(`Failed to relaunch Claude Code: ${w.message}
`), process.exit(1)
        })
    })
}
// @from(Ln 477575, Col 4)
l$7 = L(() => {
    y8();
    R9();
    CY();
    bC6();
    BF8();
    g4()
})
// @from(Ln 477583, Col 4)
enK = {}
// @from(Ln 477587, Col 4)
n$7
// @from(Ln 477587, Col 9)
bcY = async (q) => {
    let K = q.trim().toLowerCase();
    if (K === "") return {
        type: "text",
        value: `Current renderer: ${v7().tui??(lq()?"fullscreen":"default")}. Usage: /tui <${n$7.join("|")}>`
    };
    if (!n$7.includes(K)) return {
        type: "text",
        value: `Unknown renderer "${K}". Usage: /tui <${n$7.join("|")}>`
    };
    let _ = K,
        z = _ === "fullscreen";
    if (z === lq()) return {
        type: "text",
        value: `Already using the ${_} renderer.`
    };
    let {
        error: Y
    } = P7("userSettings", {
        tui: _
    });
    if (Y) return {
        type: "text",
        value: `Failed to save setting: ${Y.message}`
    };
    return d("tengu_tui_command", {
        fullscreen: z
    }), er8({
        freshIfNoTranscript: !0,
        env: {
            CLAUDE_CODE_TUI_JUST_SWITCHED: _
        },
        dropEnv: ["CLAUDE_CODE_NO_FLICKER", "CLAUDE_CODE_FORCE_FULLSCREEN_UPSELL"]
    })
}
// @from(Ln 477622, Col 4)
qiK = L(() => {
    C8();
    nO();
    l$7();
    a1();
    n$7 = ["default", "fullscreen"]
})
// @from(Ln 477629, Col 4)
IcY
// @from(Ln 477629, Col 9)
KiK
// @from(Ln 477630, Col 4)
_iK = L(() => {
    IcY = {
        type: "local",
        name: "tui",
        description: "Set the terminal UI renderer (default | fullscreen)",
        argumentHint: "[default|fullscreen]",
        supportsNonInteractive: !1,
        load: () => Promise.resolve().then(() => (qiK(), enK))
    }, KiK = IcY
})
// @from(Ln 477641, Col 0)
function YiK(q) {
    let K = s(4),
        {
            children: _
        } = q,
        z;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) z = [], K[0] = z;
    else z = K[0];
    let Y = Kz6.useRef(z),
        A;
    if (K[1] === Symbol.for("react.memo_cache_sentinel")) A = {
        getDenials: () => Y.current,
        recordDenial: ($) => {
            Y.current = [$, ...Y.current.slice(0, xcY - 1)]
        }
    }, K[1] = A;
    else A = K[1];
    let O = A,
        w;
    if (K[2] !== _) w = Kz6.default.createElement(ziK.Provider, {
        value: O
    }, _), K[2] = _, K[3] = w;
    else w = K[3];
    return w
}
// @from(Ln 477667, Col 0)
function Mu6() {
    return Kz6.useContext(ziK)
}
// @from(Ln 477670, Col 4)
Kz6
// @from(Ln 477670, Col 9)
ziK
// @from(Ln 477670, Col 14)
xcY = 20
// @from(Ln 477671, Col 4)
i_8 = L(() => {
    o6();
    Kz6 = K6(P6(), 1), ziK = Kz6.createContext({
        getDenials: () => [],
        recordDenial: () => {}
    })
})
// @from(Ln 477679, Col 0)
function qo8(q) {
    let K = s(9),
        {
            ruleValue: _
        } = q;
    switch (_.toolName) {
        case KK.name:
            if (_.ruleContent)
                if (_.ruleContent.endsWith(":*") || _.ruleContent.endsWith(" *")) {
                    let z;
                    if (K[0] !== _.ruleContent) z = _.ruleContent.slice(0, -2), K[0] = _.ruleContent, K[1] = z;
                    else z = K[1];
                    let Y;
                    if (K[2] !== z) Y = jN.createElement(T, {
                        dimColor: !0
                    }, "Any Bash command starting with", " ", jN.createElement(T, {
                        bold: !0
                    }, z)), K[2] = z, K[3] = Y;
                    else Y = K[3];
                    return Y
                } else {
                    let z;
                    if (K[4] !== _.ruleContent) z = jN.createElement(T, {
                        dimColor: !0
                    }, "The Bash command ", jN.createElement(T, {
                        bold: !0
                    }, _.ruleContent)), K[4] = _.ruleContent, K[5] = z;
                    else z = K[5];
                    return z
                }
            else {
                let z;
                if (K[6] === Symbol.for("react.memo_cache_sentinel")) z = jN.createElement(T, {
                    dimColor: !0
                }, "Any Bash command"), K[6] = z;
                else z = K[6];
                return z
            }
        default:
            if (!_.ruleContent) {
                let z;
                if (K[7] !== _.toolName) z = jN.createElement(T, {
                    dimColor: !0
                }, "Any use of the ", jN.createElement(T, {
                    bold: !0
                }, _.toolName), " tool"), K[7] = _.toolName, K[8] = z;
                else z = K[8];
                return z
            } else return null
    }
}
// @from(Ln 477730, Col 4)
jN
// @from(Ln 477731, Col 4)
i$7 = L(() => {
    o6();
    g6();
    AZ();
    jN = K6(P6(), 1)
})
// @from(Ln 477738, Col 0)
function ucY(q) {
    switch (q) {
        case "localSettings":
            return {
                label: "Project settings (local)", description: `Saved in ${c16("localSettings")}`, value: q
            };
        case "projectSettings":
            return {
                label: "Project settings", description: `Checked in at ${c16("projectSettings")}`, value: q
            };
        case "userSettings":
            return {
                label: "User settings", description: "Saved in at ~/.claude/settings.json", value: q
            }
    }
}
// @from(Ln 477755, Col 0)
function AiK(q) {
    let K = s(26),
        {
            onAddRules: _,
            onCancel: z,
            ruleValues: Y,
            ruleBehavior: A,
            initialContext: O,
            setToolPermissionContext: w
        } = q,
        $;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) $ = RQ6.map(ucY), K[0] = $;
    else $ = K[0];
    let j = $,
        H;
    if (K[1] !== O || K[2] !== _ || K[3] !== z || K[4] !== A || K[5] !== Y || K[6] !== w) H = (V) => {
        if (V === "cancel") {
            z();
            return
        } else if (RQ6.includes(V)) {
            let k = V,
                N = EY(O, {
                    type: "addRules",
                    rules: Y,
                    behavior: A,
                    destination: k
                });
            Ud({
                type: "addRules",
                rules: Y,
                behavior: A,
                destination: k
            }), w(N);
            let R = Y.map((B) => ({
                    ruleValue: B,
                    ruleBehavior: A,
                    source: k
                })),
                h = Z7.isSandboxingEnabled() && Z7.isAutoAllowBashIfSandboxedEnabled(),
                x = Tx6(N, {
                    sandboxAutoAllowEnabled: h
                }).filter((B) => Y.some((m) => m.toolName === B.rule.ruleValue.toolName && m.ruleContent === B.rule.ruleValue.ruleContent));
            _(R, x.length > 0 ? x : void 0)
        }
    }, K[1] = O, K[2] = _, K[3] = z, K[4] = A, K[5] = Y, K[6] = w, K[7] = H;
    else H = K[7];
    let J = H,
        X;
    if (K[8] !== Y.length) X = O7(Y.length, "rule"), K[8] = Y.length, K[9] = X;
    else X = K[9];
    let M = `Add ${A} permission ${X}`,
        P;
    if (K[10] !== Y) P = Y.map(mcY), K[10] = Y, K[11] = P;
    else P = K[11];
    let W;
    if (K[12] !== P) W = NG.createElement(u, {
        flexDirection: "column",
        paddingX: 2
    }, P), K[12] = P, K[13] = W;
    else W = K[13];
    let D = Y.length === 1 ? "Where should this rule be saved?" : "Where should these rules be saved?",
        Z;
    if (K[14] !== D) Z = NG.createElement(T, null, D), K[14] = D, K[15] = Z;
    else Z = K[15];
    let G;
    if (K[16] !== J) G = NG.createElement(A1, {
        options: j,
        onChange: J
    }), K[16] = J, K[17] = G;
    else G = K[17];
    let f;
    if (K[18] !== Z || K[19] !== G) f = NG.createElement(u, {
        flexDirection: "column",
        marginY: 1
    }, Z, G), K[18] = Z, K[19] = G, K[20] = f;
    else f = K[20];
    let v;
    if (K[21] !== z || K[22] !== W || K[23] !== f || K[24] !== M) v = NG.createElement(R1, {
        title: M,
        onCancel: z,
        color: "permission"
    }, W, f), K[21] = z, K[22] = W, K[23] = f, K[24] = M, K[25] = v;
    else v = K[25];
    return v
}
// @from(Ln 477841, Col 0)
function mcY(q) {
    return NG.createElement(u, {
        flexDirection: "column",
        key: I9(q)
    }, NG.createElement(T, {
        bold: !0
    }, I9(q)), NG.createElement(qo8, {
        ruleValue: q
    }))
}
// @from(Ln 477851, Col 4)
NG
// @from(Ln 477852, Col 4)
OiK = L(() => {
    o6();
    gK();
    g6();
    MH();
    cZ();
    Gi8();
    yY();
    aY();
    a1();
    S4();
    i$7();
    NG = K6(P6(), 1)
})
// @from(Ln 477867, Col 0)
function wiK(q) {
    let K = s(24),
        {
            onCancel: _,
            onSubmit: z,
            ruleBehavior: Y
        } = q,
        [A, O] = r$7.useState(""),
        [w, $] = r$7.useState(0),
        j = $3(),
        H;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) H = {
        context: "Settings"
    }, K[0] = H;
    else H = K[0];
    G1("confirm:no", _, H);
    let {
        columns: J
    } = s1(), X = J - 6, M;
    if (K[1] !== z || K[2] !== Y) M = (R) => {
        let h = R.trim();
        if (h.length === 0) return;
        let C = h2(h);
        z(C, Y)
    }, K[1] = z, K[2] = Y, K[3] = M;
    else M = K[3];
    let P = M,
        W;
    if (K[4] !== Y) W = Zz.createElement(T, {
        bold: !0,
        color: "permission"
    }, "Add ", Y, " permission rule"), K[4] = Y, K[5] = W;
    else W = K[5];
    let D;
    if (K[6] === Symbol.for("react.memo_cache_sentinel")) D = Zz.createElement(Ok, null), K[6] = D;
    else D = K[6];
    let Z, G;
    if (K[7] === Symbol.for("react.memo_cache_sentinel")) Z = Zz.createElement(T, {
        bold: !0
    }, I9({
        toolName: _Z.name
    })), G = Zz.createElement(T, {
        bold: !1
    }, " or "), K[7] = Z, K[8] = G;
    else Z = K[7], G = K[8];
    let f;
    if (K[9] === Symbol.for("react.memo_cache_sentinel")) f = Zz.createElement(T, null, "Permission rules are a tool name, optionally followed by a specifier in parentheses.", D, "e.g.,", " ", Z, G, Zz.createElement(T, {
        bold: !0
    }, I9({
        toolName: KK.name,
        ruleContent: "ls *"
    }))), K[9] = f;
    else f = K[9];
    let v;
    if (K[10] !== w || K[11] !== P || K[12] !== A || K[13] !== X) v = Zz.createElement(u, {
        flexDirection: "column"
    }, f, Zz.createElement(u, {
        borderDimColor: !0,
        borderStyle: "round",
        marginY: 1,
        paddingLeft: 1
    }, Zz.createElement(l4, {
        showCursor: !0,
        value: A,
        onChange: O,
        onSubmit: P,
        placeholder: `Enter permission rule${e6.ellipsis}`,
        columns: X,
        cursorOffset: w,
        onChangeCursorOffset: $
    }))), K[10] = w, K[11] = P, K[12] = A, K[13] = X, K[14] = v;
    else v = K[14];
    let V;
    if (K[15] !== W || K[16] !== v) V = Zz.createElement(u, {
        flexDirection: "column",
        gap: 1,
        borderStyle: "round",
        paddingLeft: 1,
        paddingRight: 1,
        borderColor: "permission"
    }, W, v), K[15] = W, K[16] = v, K[17] = V;
    else V = K[17];
    let k;
    if (K[18] !== j.keyName || K[19] !== j.pending) k = Zz.createElement(u, {
        marginLeft: 3
    }, j.pending ? Zz.createElement(T, {
        dimColor: !0
    }, "Press ", j.keyName, " again to exit") : Zz.createElement(T, {
        dimColor: !0
    }, Zz.createElement(z1, null, Zz.createElement(A8, {
        chord: "enter",
        action: "submit"
    }), Zz.createElement(A8, {
        chord: "escape",
        action: "cancel"
    })))), K[18] = j.keyName, K[19] = j.pending, K[20] = k;
    else k = K[20];
    let N;
    if (K[21] !== k || K[22] !== V) N = Zz.createElement(Zz.Fragment, null, V, k), K[21] = k, K[22] = V, K[23] = N;
    else N = K[23];
    return N
}
// @from(Ln 477969, Col 4)
Zz
// @from(Ln 477969, Col 8)
r$7
// @from(Ln 477970, Col 4)
$iK = L(() => {
    o6();
    Qq();
    NY();
    C$();
    I4();
    g6();
    C7();
    AZ();
    ib6();
    cZ();
    Nq();
    u7();
    Zz = K6(P6(), 1), r$7 = K6(P6(), 1)
})
// @from(Ln 477986, Col 0)
function jiK(q) {
    let K = s(32),
        {
            onHeaderFocusChange: _,
            onStateChange: z
        } = q,
        {
            headerFocused: Y,
            focusHeader: A
        } = uX(),
        O, w;
    if (K[0] !== Y || K[1] !== _) O = () => {
        _?.(Y)
    }, w = [Y, _], K[0] = Y, K[1] = _, K[2] = O, K[3] = w;
    else O = K[2], w = K[3];
    _z6.useEffect(O, w);
    let {
        getDenials: $
    } = Mu6(), [j] = _z6.useState($), [H, J] = _z6.useState(pcY), [X, M] = _z6.useState(BcY), [P, W] = _z6.useState(0), D, Z;
    if (K[4] !== H || K[5] !== j || K[6] !== z || K[7] !== X) D = () => {
        z({
            approved: H,
            retry: X,
            denials: j
        })
    }, Z = [H, X, j, z], K[4] = H, K[5] = j, K[6] = z, K[7] = X, K[8] = D, K[9] = Z;
    else D = K[8], Z = K[9];
    _z6.useEffect(D, Z);
    let G;
    if (K[10] === Symbol.for("react.memo_cache_sentinel")) G = (S) => {
        let F = Number(S);
        J((U) => {
            let g = new Set(U);
            if (g.has(F)) g.delete(F);
            else g.add(F);
            return g
        })
    }, K[10] = G;
    else G = K[10];
    let f = G,
        v;
    if (K[11] === Symbol.for("react.memo_cache_sentinel")) v = (S) => {
        W(Number(S))
    }, K[11] = v;
    else v = K[11];
    let V = v,
        k;
    if (K[12] !== P || K[13] !== Y) k = function(F) {
        if (Y) return;
        if (F.ctrl || F.meta || F.shift) return;
        if (F.key !== "r") return;
        F.preventDefault(), M((U) => {
            let g = new Set(U);
            if (g.has(P)) g.delete(P);
            else g.add(P);
            return g
        }), J((U) => {
            if (U.has(P)) return U;
            let g = new Set(U);
            return g.add(P), g
        })
    }, K[12] = P, K[13] = Y, K[14] = k;
    else k = K[14];
    let N = k;
    if (j.length === 0) {
        let S;
        if (K[15] === Symbol.for("react.memo_cache_sentinel")) S = EG.createElement(T, {
            dimColor: !0
        }, "No recent denials. Commands denied by the auto mode classifier will appear here."), K[15] = S;
        else S = K[15];
        return S
    }
    let R;
    if (K[16] !== H || K[17] !== j || K[18] !== X) {
        let S;
        if (K[20] !== H || K[21] !== X) S = (F, U) => {
            let g = H.has(U),
                c = X.has(U) ? " (retry)" : "";
            return {
                label: EG.createElement(T, null, EG.createElement(D4, {
                    status: g ? "success" : "error",
                    withSpace: !0
                }), F.display, EG.createElement(T, {
                    dimColor: !0
                }, c)),
                value: String(U)
            }
        }, K[20] = H, K[21] = X, K[22] = S;
        else S = K[22];
        R = j.map(S), K[16] = H, K[17] = j, K[18] = X, K[19] = R
    } else R = K[19];
    let h = R,
        C;
    if (K[23] === Symbol.for("react.memo_cache_sentinel")) C = EG.createElement(T, null, "Commands recently denied by the auto mode classifier."), K[23] = C;
    else C = K[23];
    let x = Math.min(10, h.length),
        B;
    if (K[24] !== A || K[25] !== Y || K[26] !== h || K[27] !== x) B = EG.createElement(u, {
        marginTop: 1
    }, EG.createElement(A1, {
        options: h,
        onChange: f,
        onFocus: V,
        visibleOptionCount: x,
        isDisabled: Y,
        onUpFromFirstItem: A
    })), K[24] = A, K[25] = Y, K[26] = h, K[27] = x, K[28] = B;
    else B = K[28];
    let m;
    if (K[29] !== N || K[30] !== B) m = EG.createElement(u, {
        flexDirection: "column",
        onKeyDown: N
    }, C, B), K[29] = N, K[30] = B, K[31] = m;
    else m = K[31];
    return m
}
// @from(Ln 478103, Col 0)
function BcY() {
    return new Set
}
// @from(Ln 478107, Col 0)
function pcY() {
    return new Set
}
// @from(Ln 478110, Col 4)
EG
// @from(Ln 478110, Col 8)
_z6
// @from(Ln 478111, Col 4)
HiK = L(() => {
    o6();
    i_8();
    g6();
    gK();
    Y2();
    BT();
    EG = K6(P6(), 1), _z6 = K6(P6(), 1)
})
// @from(Ln 478121, Col 0)
function JiK(q) {
    let K = s(19),
        {
            directoryPath: _,
            onRemove: z,
            onCancel: Y,
            permissionContext: A,
            setPermissionContext: O
        } = q,
        w;
    if (K[0] !== _ || K[1] !== z || K[2] !== A || K[3] !== O) w = () => {
        let D = EY(A, {
            type: "removeDirectories",
            directories: [_],
            destination: "session"
        });
        O(D), z()
    }, K[0] = _, K[1] = z, K[2] = A, K[3] = O, K[4] = w;
    else w = K[4];
    let $ = w,
        j;
    if (K[5] !== $ || K[6] !== Y) j = (D) => {
        if (D === "yes") $();
        else Y()
    }, K[5] = $, K[6] = Y, K[7] = j;
    else j = K[7];
    let H = j,
        J;
    if (K[8] !== _) J = Wg.createElement(u, {
        marginX: 2,
        flexDirection: "column"
    }, Wg.createElement(T, {
        bold: !0
    }, _)), K[8] = _, K[9] = J;
    else J = K[9];
    let X;
    if (K[10] === Symbol.for("react.memo_cache_sentinel")) X = Wg.createElement(T, null, "Claude Code will no longer have access to files in this directory."), K[10] = X;
    else X = K[10];
    let M;
    if (K[11] === Symbol.for("react.memo_cache_sentinel")) M = [{
        label: "Yes",
        value: "yes"
    }, {
        label: "No",
        value: "no"
    }], K[11] = M;
    else M = K[11];
    let P;
    if (K[12] !== H || K[13] !== Y) P = Wg.createElement(A1, {
        onChange: H,
        onCancel: Y,
        options: M
    }), K[12] = H, K[13] = Y, K[14] = P;
    else P = K[14];
    let W;
    if (K[15] !== Y || K[16] !== J || K[17] !== P) W = Wg.createElement(R1, {
        title: "Remove directory from workspace?",
        onCancel: Y,
        color: "error"
    }, J, X, P), K[15] = Y, K[16] = J, K[17] = P, K[18] = W;
    else W = K[18];
    return W
}
// @from(Ln 478184, Col 4)
Wg
// @from(Ln 478185, Col 4)
XiK = L(() => {
    o6();
    gK();
    g6();
    MH();
    S4();
    Wg = K6(P6(), 1)
})
// @from(Ln 478194, Col 0)
function PiK(q) {
    let K = s(23),
        {
            onExit: _,
            toolPermissionContext: z,
            onRequestAddDirectory: Y,
            onRequestRemoveDirectory: A,
            onHeaderFocusChange: O
        } = q,
        {
            headerFocused: w,
            focusHeader: $
        } = uX(),
        j, H;
    if (K[0] !== w || K[1] !== O) j = () => {
        O?.(w)
    }, H = [w, O], K[0] = w, K[1] = O, K[2] = j, K[3] = H;
    else j = K[2], H = K[3];
    MiK.useEffect(j, H);
    let J;
    if (K[4] !== z.additionalWorkingDirectories) J = Array.from(z.additionalWorkingDirectories.keys()).map(gcY), K[4] = z.additionalWorkingDirectories, K[5] = J;
    else J = K[5];
    let X = J,
        M;
    if (K[6] !== X || K[7] !== Y || K[8] !== A) M = (k) => {
        if (k === "add-directory") {
            Y();
            return
        }
        let N = X.find((R) => R.path === k);
        if (N && N.isDeletable) A(N.path)
    }, K[6] = X, K[7] = Y, K[8] = A, K[9] = M;
    else M = K[9];
    let P = M,
        W;
    if (K[10] !== _) W = () => _("Workspace dialog dismissed", {
        display: "system"
    }), K[10] = _, K[11] = W;
    else W = K[11];
    let D = W,
        Z;
    if (K[12] !== X) {
        Z = X.map(FcY);
        let k;
        if (K[14] === Symbol.for("react.memo_cache_sentinel")) k = {
            label: `Add directory${e6.ellipsis}`,
            value: "add-directory"
        }, K[14] = k;
        else k = K[14];
        Z.push(k), K[12] = X, K[13] = Z
    } else Z = K[13];
    let G = Z,
        f;
    if (K[15] === Symbol.for("react.memo_cache_sentinel")) f = Dg.createElement(u, {
        flexDirection: "row",
        marginTop: 1,
        marginLeft: 2,
        gap: 1
    }, Dg.createElement(T, null, `-  ${Y7()}`), Dg.createElement(T, {
        dimColor: !0
    }, "(Original working directory)")), K[15] = f;
    else f = K[15];
    let v = Math.min(10, G.length),
        V;
    if (K[16] !== $ || K[17] !== D || K[18] !== P || K[19] !== w || K[20] !== G || K[21] !== v) V = Dg.createElement(u, {
        flexDirection: "column",
        marginBottom: 1
    }, f, Dg.createElement(A1, {
        options: G,
        onChange: P,
        onCancel: D,
        visibleOptionCount: v,
        onUpFromFirstItem: $,
        isDisabled: w
    })), K[16] = $, K[17] = D, K[18] = P, K[19] = w, K[20] = G, K[21] = v, K[22] = V;
    else V = K[22];
    return V
}
// @from(Ln 478273, Col 0)
function FcY(q) {
    return {
        label: q.path,
        value: q.path
    }
}
// @from(Ln 478280, Col 0)
function gcY(q) {
    return {
        path: q,
        isCurrent: !1,
        isDeletable: !0
    }
}
// @from(Ln 478287, Col 4)
Dg
// @from(Ln 478287, Col 8)
MiK
// @from(Ln 478288, Col 4)
WiK = L(() => {
    o6();
    Qq();
    y8();
    gK();
    g6();
    BT();
    Dg = K6(P6(), 1), MiK = K6(P6(), 1)
})
// @from(Ln 478298, Col 0)
function QcY(q) {
    let K = s(4),
        {
            rule: _
        } = q,
        z;
    if (K[0] !== _.source) z = E98(_.source), K[0] = _.source, K[1] = z;
    else z = K[1];
    let Y = `From ${z}`,
        A;
    if (K[2] !== Y) A = E7.createElement(T, {
        dimColor: !0
    }, Y), K[2] = Y, K[3] = A;
    else A = K[3];
    return A
}
// @from(Ln 478315, Col 0)
function dcY(q) {
    switch (q) {
        case "allow":
            return "allowed";
        case "deny":
            return "denied";
        case "ask":
            return "ask"
    }
}
// @from(Ln 478326, Col 0)
function ccY(q) {
    let K = s(42),
        {
            rule: _,
            onDelete: z,
            onCancel: Y
        } = q,
        A = $3(),
        O;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) O = {
        context: "Confirmation"
    }, K[0] = O;
    else O = K[0];
    G1("confirm:no", Y, O);
    let w;
    if (K[1] !== _.ruleValue) w = I9(_.ruleValue), K[1] = _.ruleValue, K[2] = w;
    else w = K[2];
    let $;
    if (K[3] !== w) $ = E7.createElement(T, {
        bold: !0
    }, w), K[3] = w, K[4] = $;
    else $ = K[4];
    let j;
    if (K[5] !== _.ruleValue) j = E7.createElement(qo8, {
        ruleValue: _.ruleValue
    }), K[5] = _.ruleValue, K[6] = j;
    else j = K[6];
    let H;
    if (K[7] !== _) H = E7.createElement(QcY, {
        rule: _
    }), K[7] = _, K[8] = H;
    else H = K[8];
    let J;
    if (K[9] !== $ || K[10] !== j || K[11] !== H) J = E7.createElement(u, {
        flexDirection: "column",
        marginX: 2
    }, $, j, H), K[9] = $, K[10] = j, K[11] = H, K[12] = J;
    else J = K[12];
    let X = J,
        M;
    if (K[13] !== A.keyName || K[14] !== A.pending) M = E7.createElement(u, {
        marginLeft: 3
    }, A.pending ? E7.createElement(T, {
        dimColor: !0
    }, "Press ", A.keyName, " again to exit") : E7.createElement(T, {
        dimColor: !0
    }, E7.createElement(A8, {
        chord: "escape",
        action: "cancel"
    }))), K[13] = A.keyName, K[14] = A.pending, K[15] = M;
    else M = K[15];
    let P = M;
    if (_.source === "policySettings") {
        let N;
        if (K[16] === Symbol.for("react.memo_cache_sentinel")) N = E7.createElement(T, {
            bold: !0,
            color: "permission"
        }, "Rule details"), K[16] = N;
        else N = K[16];
        let R;
        if (K[17] === Symbol.for("react.memo_cache_sentinel")) R = E7.createElement(T, {
            italic: !0
        }, "This rule is configured by managed settings and cannot be modified.", `
`, "Contact your system administrator for more information."), K[17] = R;
        else R = K[17];
        let h;
        if (K[18] !== X) h = E7.createElement(u, {
            flexDirection: "column",
            gap: 1,
            borderStyle: "round",
            paddingLeft: 1,
            paddingRight: 1,
            borderColor: "permission"
        }, N, X, R), K[18] = X, K[19] = h;
        else h = K[19];
        let C;
        if (K[20] !== P || K[21] !== h) C = E7.createElement(E7.Fragment, null, h, P), K[20] = P, K[21] = h, K[22] = C;
        else C = K[22];
        return C
    }
    let W;
    if (K[23] !== _.ruleBehavior) W = dcY(_.ruleBehavior), K[23] = _.ruleBehavior, K[24] = W;
    else W = K[24];
    let D;
    if (K[25] !== W) D = E7.createElement(T, {
        bold: !0,
        color: "error"
    }, "Delete ", W, " tool?"), K[25] = W, K[26] = D;
    else D = K[26];
    let Z;
    if (K[27] === Symbol.for("react.memo_cache_sentinel")) Z = E7.createElement(T, null, "Are you sure you want to delete this permission rule?"), K[27] = Z;
    else Z = K[27];
    let G;
    if (K[28] !== Y || K[29] !== z) G = (N) => N === "yes" ? z() : Y(), K[28] = Y, K[29] = z, K[30] = G;
    else G = K[30];
    let f;
    if (K[31] === Symbol.for("react.memo_cache_sentinel")) f = [{
        label: "Yes",
        value: "yes"
    }, {
        label: "No",
        value: "no"
    }], K[31] = f;
    else f = K[31];
    let v;
    if (K[32] !== Y || K[33] !== G) v = E7.createElement(A1, {
        onChange: G,
        onCancel: Y,
        options: f
    }), K[32] = Y, K[33] = G, K[34] = v;
    else v = K[34];
    let V;
    if (K[35] !== X || K[36] !== v || K[37] !== D) V = E7.createElement(u, {
        flexDirection: "column",
        gap: 1,
        borderStyle: "round",
        paddingLeft: 1,
        paddingRight: 1,
        borderColor: "error"
    }, D, X, Z, v), K[35] = X, K[36] = v, K[37] = D, K[38] = V;
    else V = K[38];
    let k;
    if (K[39] !== P || K[40] !== V) k = E7.createElement(E7.Fragment, null, V, P), K[39] = P, K[40] = V, K[41] = k;
    else k = K[41];
    return k
}
// @from(Ln 478453, Col 0)
function lcY(q) {
    let K = s(31),
        {
            options: _,
            searchQuery: z,
            isSearchMode: Y,
            isFocused: A,
            onSelect: O,
            onCancel: w,
            lastFocusedRuleKey: $,
            cursorOffset: j,
            onHeaderFocusChange: H
        } = q,
        J = _xK(),
        {
            headerFocused: X,
            focusHeader: M,
            blurHeader: P
        } = uX(),
        W, D;
    if (K[0] !== P || K[1] !== X || K[2] !== Y) W = () => {
        if (Y && X) P()
    }, D = [Y, X, P], K[0] = P, K[1] = X, K[2] = Y, K[3] = W, K[4] = D;
    else W = K[3], D = K[4];
    HN.useEffect(W, D);
    let Z, G;
    if (K[5] !== X || K[6] !== H) Z = () => {
        H?.(X)
    }, G = [X, H], K[5] = X, K[6] = H, K[7] = Z, K[8] = G;
    else Z = K[7], G = K[8];
    HN.useEffect(Z, G);
    let f = Y && !X,
        v;
    if (K[9] !== j || K[10] !== A || K[11] !== z || K[12] !== f || K[13] !== J) v = E7.createElement(u, {
        marginBottom: 1,
        flexDirection: "column"
    }, E7.createElement(wg, {
        query: z,
        isFocused: f,
        isTerminalFocused: A,
        width: J,
        cursorOffset: j
    })), K[9] = j, K[10] = A, K[11] = z, K[12] = f, K[13] = J, K[14] = v;
    else v = K[14];
    let V = Math.min(10, _.length),
        k;
    if (K[15] !== X || K[16] !== Y) k = Y || X, K[15] = X, K[16] = Y, K[17] = k;
    else k = K[17];
    let N;
    if (K[18] !== M) N = M, K[18] = M, K[19] = N;
    else N = K[19];
    let R;
    if (K[20] !== $ || K[21] !== w || K[22] !== O || K[23] !== _ || K[24] !== V || K[25] !== k || K[26] !== N) R = E7.createElement(A1, {
        options: _,
        onChange: O,
        onCancel: w,
        visibleOptionCount: V,
        isDisabled: k,
        defaultFocusValue: $,
        onUpFromFirstItem: N
    }), K[20] = $, K[21] = w, K[22] = O, K[23] = _, K[24] = V, K[25] = k, K[26] = N, K[27] = R;
    else R = K[27];
    let h;
    if (K[28] !== v || K[29] !== R) h = E7.createElement(u, {
        flexDirection: "column"
    }, v, R), K[28] = v, K[29] = R, K[30] = h;
    else h = K[30];
    return h
}
// @from(Ln 478523, Col 0)
function o$7(q) {
    let K = s(27),
        _, z, Y, A, O, w, $, j, H;
    if (K[0] !== q) {
        let {
            tab: P,
            getRulesOptions: W,
            handleToolSelect: D,
            ...Z
        } = q;
        H = P, Y = D, A = Z, z = u, w = "column", $ = H === "allow" ? 0 : void 0;
        let G;
        if (K[10] === Symbol.for("react.memo_cache_sentinel")) G = {
            allow: "Claude Code won't ask before using allowed tools.",
            ask: "Claude Code will always ask for confirmation before using these tools.",
            deny: "Claude Code will always reject requests to use denied tools."
        }, K[10] = G;
        else G = K[10];
        let f = G[H];
        if (K[11] !== f) j = E7.createElement(T, null, f), K[11] = f, K[12] = j;
        else j = K[12];
        _ = lcY, O = W(H, A.searchQuery), K[0] = q, K[1] = _, K[2] = z, K[3] = Y, K[4] = A, K[5] = O, K[6] = w, K[7] = $, K[8] = j, K[9] = H
    } else _ = K[1], z = K[2], Y = K[3], A = K[4], O = K[5], w = K[6], $ = K[7], j = K[8], H = K[9];
    let J;
    if (K[13] !== Y || K[14] !== H) J = (P) => Y(P, H), K[13] = Y, K[14] = H, K[15] = J;
    else J = K[15];
    let X;
    if (K[16] !== _ || K[17] !== A || K[18] !== O.options || K[19] !== J) X = E7.createElement(_, {
        options: O.options,
        onSelect: J,
        ...A
    }), K[16] = _, K[17] = A, K[18] = O.options, K[19] = J, K[20] = X;
    else X = K[20];
    let M;
    if (K[21] !== z || K[22] !== w || K[23] !== $ || K[24] !== j || K[25] !== X) M = E7.createElement(z, {
        flexDirection: w,
        flexShrink: $
    }, j, X), K[21] = z, K[22] = w, K[23] = $, K[24] = j, K[25] = X, K[26] = M;
    else M = K[26];
    return M
}
// @from(Ln 478565, Col 0)
function DiK(q) {
    let K = s(118),
        {
            onExit: _,
            initialTab: z,
            onRetryDenials: Y
        } = q,
        {
            getDenials: A
        } = Mu6(),
        O;
    if (K[0] !== A) O = A(), K[0] = A, K[1] = O;
    else O = K[1];
    let w = O.length > 0,
        $ = z ?? (w ? "recent" : "allow"),
        j;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) j = [], K[2] = j;
    else j = K[2];
    let [H, J] = HN.useState(j), X = M8(scY), M = R7(), P = K2(), W;
    if (K[3] === Symbol.for("react.memo_cache_sentinel")) W = {
        approved: new Set,
        retry: new Set,
        denials: []
    }, K[3] = W;
    else W = K[3];
    let D = HN.useRef(W),
        Z;
    if (K[4] === Symbol.for("react.memo_cache_sentinel")) Z = (j8) => {
        D.current = j8
    }, K[4] = Z;
    else Z = K[4];
    let G = Z,
        [f, v] = HN.useState(),
        [V, k] = HN.useState(),
        [N, R] = HN.useState(null),
        [h, C] = HN.useState(null),
        [x, B] = HN.useState(!1),
        [m, S] = HN.useState(null),
        [F, U] = HN.useState(!1),
        [g, c] = HN.useState(!0),
        n;
    if (K[5] === Symbol.for("react.memo_cache_sentinel")) n = (j8) => {
        c(j8)
    }, K[5] = n;
    else n = K[5];
    let l = n,
        z6;
    if (K[6] !== X) z6 = new Map, wx6(X).forEach((j8) => {
        z6.set(I6(j8), j8)
    }), K[6] = X, K[7] = z6;
    else z6 = K[7];
    let A6 = z6,
        e;
    if (K[8] !== X) e = new Map, N_6(X).forEach((j8) => {
        e.set(I6(j8), j8)
    }), K[8] = X, K[9] = e;
    else e = K[9];
    let i = e,
        O6;
    if (K[10] !== X) O6 = new Map, $x6(X).forEach((j8) => {
        O6.set(I6(j8), j8)
    }), K[10] = X, K[11] = O6;
    else O6 = K[11];
    let J6 = O6,
        $6;
    if (K[12] !== A6 || K[13] !== J6 || K[14] !== i) $6 = (j8, f8) => {
        let p8 = f8 === void 0 ? "" : f8,
            o8 = (() => {
                switch (j8) {
                    case "allow":
                        return A6;
                    case "deny":
                        return i;
                    case "ask":
                        return J6;
                    case "workspace":
                    case "recent":
                        return new Map
                }
            })(),
            n1 = [];
        if (j8 !== "workspace" && j8 !== "recent" && !p8) n1.push({
            label: `Add a new rule${e6.ellipsis}`,
            value: "add-new-rule"
        });
        let c1 = Array.from(o8.keys()).sort((uq, h4) => {
                let cq = o8.get(uq),
                    C1 = o8.get(h4);
                if (cq && C1) {
                    let W7 = I9(cq.ruleValue).toLowerCase(),
                        $4 = I9(C1.ruleValue).toLowerCase();
                    return W7.localeCompare($4)
                }
                return 0
            }),
            dq = p8.toLowerCase();
        for (let uq of c1) {
            let h4 = o8.get(uq);
            if (h4) {
                let cq = I9(h4.ruleValue);
                if (p8 && !cq.toLowerCase().includes(dq)) continue;
                n1.push({
                    label: cq,
                    value: uq
                })
            }
        }
        return {
            options: n1,
            rulesByKey: o8
        }
    }, K[12] = A6, K[13] = J6, K[14] = i, K[15] = $6;
    else $6 = K[15];
    let H6 = $6,
        q6 = $3(),
        o = !f && !N && !h && !x && !m,
        _6 = o && F,
        r;
    if (K[16] === Symbol.for("react.memo_cache_sentinel")) r = () => {
        U(!1)
    }, K[16] = r;
    else r = K[16];
    let t;
    if (K[17] !== _6) t = {
        isActive: _6,
        onExit: r
    }, K[17] = _6, K[18] = t;
    else t = K[18];
    let {
        query: Y6,
        setQuery: X6,
        cursorOffset: M6,
        handleKeyDown: W6,
        handlePaste: V6
    } = bS(t), f6;
    if (K[19] !== F || K[20] !== o || K[21] !== W6 || K[22] !== X6) f6 = (j8) => {
        if (!o) return;
        if (F) {
            W6(j8);
            return
        }
        if (j8.ctrl || j8.meta) return;
        if (j8.key === "/") j8.preventDefault(), U(!0), X6("");
        else if (j8.key.length === 1 && j8.key !== "j" && j8.key !== "k" && j8.key !== "m" && j8.key !== "i" && j8.key !== "r" && j8.key !== " ") j8.preventDefault(), U(!0), X6(j8.key)
    }, K[19] = F, K[20] = o, K[21] = W6, K[22] = X6, K[23] = f6;
    else f6 = K[23];
    let G6 = f6,
        k6;
    if (K[24] !== H6) k6 = (j8, f8) => {
        let {
            rulesByKey: p8
        } = H6(f8);
        if (j8 === "add-new-rule") {
            R(f8);
            return
        } else {
            v(p8.get(j8));
            return
        }
    }, K[24] = H6, K[25] = k6;
    else k6 = K[25];
    let T6 = k6,
        v6;
    if (K[26] === Symbol.for("react.memo_cache_sentinel")) v6 = () => {
        R(null)
    }, K[26] = v6;
    else v6 = K[26];
    let L6 = v6,
        y6;
    if (K[27] === Symbol.for("react.memo_cache_sentinel")) y6 = (j8, f8) => {
        C({
            ruleValue: j8,
            ruleBehavior: f8
        }), R(null)
    }, K[27] = y6;
    else y6 = K[27];
    let c6 = y6,
        Z8;
    if (K[28] === Symbol.for("react.memo_cache_sentinel")) Z8 = (j8, f8) => {
        C(null);
        for (let p8 of j8) J((o8) => [...o8, `Added ${p8.ruleBehavior} rule ${Y8.bold(I9(p8.ruleValue))}`]);
        if (f8 && f8.length > 0)
            for (let p8 of f8) {
                let o8 = p8.shadowType === "deny" ? "blocked" : "shadowed";
                J((n1) => [...n1, Y8.yellow(`${e6.warning} Warning: ${I9(p8.rule.ruleValue)} is ${o8}`), Y8.dim(`  ${p8.reason}`), Y8.dim(`  Fix: ${p8.fix}`)])
            }
    }, K[28] = Z8;
    else Z8 = K[28];
    let N8 = Z8,
        R6;
    if (K[29] === Symbol.for("react.memo_cache_sentinel")) R6 = () => {
        C(null)
    }, K[29] = R6;
    else R6 = K[29];
    let p6 = R6,
        q8;
    if (K[30] === Symbol.for("react.memo_cache_sentinel")) q8 = () => B(!0), K[30] = q8;
    else q8 = K[30];
    let L8 = q8,
        w8;
    if (K[31] === Symbol.for("react.memo_cache_sentinel")) w8 = (j8) => S(j8), K[31] = w8;
    else w8 = K[31];
    let x8 = w8,
        a6;
    if (K[32] !== H || K[33] !== _ || K[34] !== Y) a6 = () => {
        let j8 = D.current,
            f8 = (n1) => Array.from(n1).map((c1) => j8.denials[c1]).filter(acY),
            p8 = f8(j8.retry);
        if (p8.length > 0) {
            let n1 = p8.map(ocY);
            Y?.(n1), _(void 0, {
                shouldQuery: !0,
                metaMessages: [`Permission granted for: ${n1.join(", ")}. You may now retry ${n1.length===1?"this command":"these commands"} if you would like.`]
            });
            return
        }
        let o8 = f8(j8.approved);
        if (o8.length > 0 || H.length > 0) {
            let n1 = o8.length > 0 ? [`Approved ${o8.map(rcY).join(", ")}`] : [];
            _([...n1, ...H].join(`
`))
        } else _("Permissions dialog dismissed", {
            display: "system"
        })
    }, K[32] = H, K[33] = _, K[34] = Y, K[35] = a6;
    else a6 = K[35];
    let D8 = a6,
        Q6 = o && !F,
        W8;
    if (K[36] !== Q6) W8 = {
        context: "Settings",
        isActive: Q6
    }, K[36] = Q6, K[37] = W8;
    else W8 = K[37];
    G1("confirm:no", D8, W8);
    let G8;
    if (K[38] !== H6 || K[39] !== f || K[40] !== M || K[41] !== X) G8 = () => {
        if (!f) return;
        let {
            options: j8
        } = H6(f.ruleBehavior), f8 = I6(f), p8 = j8.filter(icY).map(ncY), o8 = p8.indexOf(f8), n1;
        if (o8 !== -1) {
            if (o8 < p8.length - 1) n1 = p8[o8 + 1];
            else if (o8 > 0) n1 = p8[o8 - 1]
        }
        k(n1), ACK({
            rule: f,
            initialContext: X,
            setToolPermissionContext(c1) {
                M((dq) => ({
                    ...dq,
                    toolPermissionContext: c1
                }))
            }
        }), J((c1) => [...c1, `Deleted ${f.ruleBehavior} rule ${Y8.bold(I9(f.ruleValue))}`]), v(void 0)
    }, K[38] = H6, K[39] = f, K[40] = M, K[41] = X, K[42] = G8;
    else G8 = K[42];
    let s6 = G8;
    if (f) {
        let j8;
        if (K[43] === Symbol.for("react.memo_cache_sentinel")) j8 = () => v(void 0), K[43] = j8;
        else j8 = K[43];
        let f8;
        if (K[44] !== s6 || K[45] !== f) f8 = E7.createElement(ccY, {
            rule: f,
            onDelete: s6,
            onCancel: j8
        }), K[44] = s6, K[45] = f, K[46] = f8;
        else f8 = K[46];
        return f8
    }
    if (N && N !== "workspace" && N !== "recent") {
        let j8;
        if (K[47] !== N) j8 = E7.createElement(wiK, {
            onCancel: L6,
            onSubmit: c6,
            ruleBehavior: N
        }), K[47] = N, K[48] = j8;
        else j8 = K[48];
        return j8
    }
    if (h) {
        let j8;
        if (K[49] !== h.ruleValue) j8 = [h.ruleValue], K[49] = h.ruleValue, K[50] = j8;
        else j8 = K[50];
        let f8;
        if (K[51] !== M) f8 = (o8) => {
            M((n1) => ({
                ...n1,
                toolPermissionContext: o8
            }))
        }, K[51] = M, K[52] = f8;
        else f8 = K[52];
        let p8;
        if (K[53] !== j8 || K[54] !== f8 || K[55] !== X || K[56] !== h.ruleBehavior) p8 = E7.createElement(AiK, {
            onAddRules: N8,
            onCancel: p6,
            ruleValues: j8,
            ruleBehavior: h.ruleBehavior,
            initialContext: X,
            setToolPermissionContext: f8
        }), K[53] = j8, K[54] = f8, K[55] = X, K[56] = h.ruleBehavior, K[57] = p8;
        else p8 = K[57];
        return p8
    }
    if (x) {
        let j8;
        if (K[58] !== M || K[59] !== X) j8 = (o8, n1) => {
            let dq = {
                    type: "addDirectories",
                    directories: [o8],
                    destination: n1 ? "localSettings" : "session"
                },
                uq = EY(X, dq);
            if (M((h4) => ({
                    ...h4,
                    toolPermissionContext: uq
                })), n1) Ud(dq);
            J((h4) => [...h4, `Added directory ${Y8.bold(o8)} to workspace${n1?" and saved to local settings":" for this session"}`]), B(!1)
        }, K[58] = M, K[59] = X, K[60] = j8;
        else j8 = K[60];
        let f8;
        if (K[61] === Symbol.for("react.memo_cache_sentinel")) f8 = () => B(!1), K[61] = f8;
        else f8 = K[61];
        let p8;
        if (K[62] !== j8 || K[63] !== X) p8 = E7.createElement(Fs6, {
            onAddDirectory: j8,
            onCancel: f8,
            permissionContext: X
        }), K[62] = j8, K[63] = X, K[64] = p8;
        else p8 = K[64];
        return p8
    }
    if (m) {
        let j8;
        if (K[65] !== m) j8 = () => {
            J((n1) => [...n1, `Removed directory ${Y8.bold(m)} from workspace`]), S(null)
        }, K[65] = m, K[66] = j8;
        else j8 = K[66];
        let f8;
        if (K[67] === Symbol.for("react.memo_cache_sentinel")) f8 = () => S(null), K[67] = f8;
        else f8 = K[67];
        let p8;
        if (K[68] !== M) p8 = (n1) => {
            M((c1) => ({
                ...c1,
                toolPermissionContext: n1
            }))
        }, K[68] = M, K[69] = p8;
        else p8 = K[69];
        let o8;
        if (K[70] !== m || K[71] !== j8 || K[72] !== p8 || K[73] !== X) o8 = E7.createElement(JiK, {
            directoryPath: m,
            onRemove: j8,
            onCancel: f8,
            permissionContext: X,
            setPermissionContext: p8
        }), K[70] = m, K[71] = j8, K[72] = p8, K[73] = X, K[74] = o8;
        else o8 = K[74];
        return o8
    }
    let u6;
    if (K[75] !== H6 || K[76] !== D8 || K[77] !== T6 || K[78] !== F || K[79] !== P || K[80] !== V || K[81] !== M6 || K[82] !== Y6) u6 = {
        searchQuery: Y6,
        isSearchMode: F,
        isFocused: P,
        onCancel: D8,
        lastFocusedRuleKey: V,
        cursorOffset: M6,
        getRulesOptions: H6,
        handleToolSelect: T6,
        onHeaderFocusChange: l
    }, K[75] = H6, K[76] = D8, K[77] = T6, K[78] = F, K[79] = P, K[80] = V, K[81] = M6, K[82] = Y6, K[83] = u6;
    else u6 = K[83];
    let h6 = u6,
        _8 = !!f || !!N || !!h || x || !!m,
        R8 = !w,
        x6 = !F,
        i6;
    if (K[84] === Symbol.for("react.memo_cache_sentinel")) i6 = E7.createElement($O, {
        id: "recent",
        title: "Recently denied"
    }, E7.createElement(jiK, {
        onHeaderFocusChange: l,
        onStateChange: G
    })), K[84] = i6;
    else i6 = K[84];
    let v8;
    if (K[85] !== h6) v8 = E7.createElement($O, {
        id: "allow",
        title: "Allow"
    }, E7.createElement(o$7, {
        tab: "allow",
        ...h6
    })), K[85] = h6, K[86] = v8;
    else v8 = K[86];
    let f1;
    if (K[87] !== h6) f1 = E7.createElement($O, {
        id: "ask",
        title: "Ask"
    }, E7.createElement(o$7, {
        tab: "ask",
        ...h6
    })), K[87] = h6, K[88] = f1;
    else f1 = K[88];
    let g8;
    if (K[89] !== h6) g8 = E7.createElement($O, {
        id: "deny",
        title: "Deny"
    }, E7.createElement(o$7, {
        tab: "deny",
        ...h6
    })), K[89] = h6, K[90] = g8;
    else g8 = K[90];
    let w6;
    if (K[91] === Symbol.for("react.memo_cache_sentinel")) w6 = E7.createElement(T, null, "Claude Code can read files in the workspace, and make edits when auto-accept edits is on."), K[91] = w6;
    else w6 = K[91];
    let D6;
    if (K[92] !== _ || K[93] !== X) D6 = E7.createElement($O, {
        id: "workspace",
        title: "Workspace"
    }, E7.createElement(u, {
        flexDirection: "column"
    }, w6, E7.createElement(PiK, {
        onExit: _,
        toolPermissionContext: X,
        onRequestAddDirectory: L8,
        onRequestRemoveDirectory: x8,
        onHeaderFocusChange: l
    }))), K[92] = _, K[93] = X, K[94] = D6;
    else D6 = K[94];
    let U6;
    if (K[95] !== $ || K[96] !== _8 || K[97] !== R8 || K[98] !== x6 || K[99] !== v8 || K[100] !== f1 || K[101] !== g8 || K[102] !== D6) U6 = E7.createElement(JL, {
        title: "Permissions:",
        color: "permission",
        defaultTab: $,
        hidden: _8,
        initialHeaderFocused: R8,
        navFromContent: x6
    }, i6, v8, f1, g8, D6), K[95] = $, K[96] = _8, K[97] = R8, K[98] = x6, K[99] = v8, K[100] = f1, K[101] = g8, K[102] = D6, K[103] = U6;
    else U6 = K[103];
    let F6;
    if (K[104] !== $ || K[105] !== q6.keyName || K[106] !== q6.pending || K[107] !== w || K[108] !== g || K[109] !== F) F6 = E7.createElement(u, {
        marginTop: 1,
        paddingLeft: 1
    }, E7.createElement(T, {
        dimColor: !0
    }, q6.pending ? E7.createElement(E7.Fragment, null, "Press ", q6.keyName, " again to exit") : g ? E7.createElement(E7.Fragment, null, "←/→ tab switch · ↓ return · Esc cancel") : F ? E7.createElement(E7.Fragment, null, "Type to filter · Enter/↓ select · ↑ tabs · Esc clear") : w && $ === "recent" ? E7.createElement(E7.Fragment, null, "Enter approve · r retry · ↑↓ navigate · ←/→ switch · Esc cancel") : E7.createElement(E7.Fragment, null, "↑↓ navigate · Enter select · Type to search · ←/→ switch · Esc cancel"))), K[104] = $, K[105] = q6.keyName, K[106] = q6.pending, K[107] = w, K[108] = g, K[109] = F, K[110] = F6;
    else F6 = K[110];
    let z8;
    if (K[111] !== U6 || K[112] !== F6) z8 = E7.createElement(A_, {
        color: "permission"
    }, U6, F6), K[111] = U6, K[112] = F6, K[113] = z8;
    else z8 = K[113];
    let l6;
    if (K[114] !== G6 || K[115] !== V6 || K[116] !== z8) l6 = E7.createElement(u, {
        flexDirection: "column",
        onKeyDown: G6,
        onPaste: V6
    }, z8), K[114] = G6, K[115] = V6, K[116] = z8, K[117] = l6;
    else l6 = K[117];
    return l6
}
// @from(Ln 479029, Col 0)
function ncY(q) {
    return q.value
}
// @from(Ln 479033, Col 0)
function icY(q) {
    return q.value !== "add-new-rule"
}
// @from(Ln 479037, Col 0)
function rcY(q) {
    return Y8.bold(q.display)
}
// @from(Ln 479041, Col 0)
function ocY(q) {
    return q.display
}
// @from(Ln 479045, Col 0)
function acY(q) {
    return q !== void 0
}
// @from(Ln 479049, Col 0)
function scY(q) {
    return q.toolPermissionContext
}
// @from(Ln 479052, Col 4)
E7
// @from(Ln 479052, Col 8)
HN
// @from(Ln 479053, Col 4)
ZiK = L(() => {
    o6();
    Y3();
    Qq();
    N7();
    MH();
    gK();
    i_8();
    C$();
    R_6();
    g6();
    C7();
    cZ();
    g$();
    e8();
    u7();
    DJ();
    BT();
    EP6();
    OiK();
    SB1();
    i$7();
    $iK();
    HiK();
    XiK();
    WiK();
    E7 = K6(P6(), 1), HN = K6(P6(), 1)
})
// @from(Ln 479081, Col 4)
fiK = {}
// @from(Ln 479085, Col 4)
a$7
// @from(Ln 479085, Col 9)
tcY = async (q, K) => {
    return a$7.createElement(DiK, {
        onExit: q,
        onRetryDenials: (_) => {
            K.setMessages((z) => [...z, oCK(_)])
        }
    })
}
// @from(Ln 479093, Col 4)
GiK = L(() => {
    ZiK();
    _7();
    a$7 = K6(P6(), 1)
})
// @from(Ln 479098, Col 4)
ecY
// @from(Ln 479098, Col 9)
viK
// @from(Ln 479099, Col 4)
TiK = L(() => {
    ecY = {
        type: "local-jsx",
        name: "permissions",
        aliases: ["allowed-tools"],
        description: "Manage allow & deny tool permission rules",
        load: () => Promise.resolve().then(() => (GiK(), fiK))
    }, viK = ecY
})
// @from(Ln 479108, Col 4)
ViK = {}
// @from(Ln 479113, Col 0)
function qlY(q) {
    let K = s(11),
        {
            planContent: _,
            planPath: z,
            editorName: Y
        } = q,
        A;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) A = UM.createElement(T, {
        bold: !0
    }, "Current Plan"), K[0] = A;
    else A = K[0];
    let O;
    if (K[1] !== z) O = UM.createElement(T, {
        dimColor: !0
    }, z), K[1] = z, K[2] = O;
    else O = K[2];
    let w;
    if (K[3] !== _) w = UM.createElement(u, {
        marginTop: 1
    }, UM.createElement(T, null, _)), K[3] = _, K[4] = w;
    else w = K[4];
    let $;
    if (K[5] !== Y) $ = Y && UM.createElement(u, {
        marginTop: 1
    }, UM.createElement(T, {
        dimColor: !0
    }, '"/plan open"'), UM.createElement(T, {
        dimColor: !0
    }, " to edit this plan in "), UM.createElement(T, {
        bold: !0,
        dimColor: !0
    }, Y)), K[5] = Y, K[6] = $;
    else $ = K[6];
    let j;
    if (K[7] !== O || K[8] !== w || K[9] !== $) j = UM.createElement(u, {
        flexDirection: "column"
    }, A, O, w, $), K[7] = O, K[8] = w, K[9] = $, K[10] = j;
    else j = K[10];
    return j
}
// @from(Ln 479154, Col 0)
async function KlY(q, K, _) {
    let {
        getAppState: z,
        setAppState: Y
    } = K, O = z().toolPermissionContext.mode;
    if (O !== "plan") {
        bi(O, "plan"), Y((W) => ({
            ...W,
            toolPermissionContext: EY(zI6(W.toolPermissionContext), {
                type: "setMode",
                mode: "plan",
                destination: "session"
            })
        }));
        let P = _.trim();
        if (P && P !== "open") q("Enabled plan mode", {
            shouldQuery: !0
        });
        else q("Enabled plan mode");
        return null
    }
    let w = lP(),
        $ = eW();
    if (!w) return q("Already in plan mode. No plan written yet."), null;
    if (_.trim().split(/\s+/)[0] === "open") {
        let P = await xS($);
        if (P.error) q(`Failed to open plan in editor: ${P.error}`);
        else q(`Opened plan in editor: ${$}`);
        return null
    }
    let H = XL(),
        J = H ? kH(H) : void 0,
        M = await h9K(UM.createElement(qlY, {
            planContent: w,
            planPath: $,
            editorName: J
        }));
    return q(M), null
}
// @from(Ln 479193, Col 4)
UM
// @from(Ln 479194, Col 4)
kiK = L(() => {
    o6();
    y8();
    g6();
    Tn();
    kj();
    MH();
    vX();
    NJ();
    uS();
    yt();
    UM = K6(P6(), 1)
})
// @from(Ln 479207, Col 4)
_lY
// @from(Ln 479207, Col 9)
NiK
// @from(Ln 479208, Col 4)
EiK = L(() => {
    _lY = {
        type: "local-jsx",
        name: "plan",
        description: "Enable plan mode or view the current session plan",
        argumentHint: "[open|<description>]",
        load: () => Promise.resolve().then(() => (kiK(), ViK))
    }, NiK = _lY
})
// @from(Ln 479218, Col 0)
function Pu6() {
    return u8("tengu_immediate_model_command", !1)
}
// @from(Ln 479221, Col 4)
Ko8 = L(() => {
    B1()
})
// @from(Ln 479225, Col 0)
function yiK(q) {
    let K = s(2),
        {
            cooldown: _
        } = q;
    if (_) {
        let Y;
        if (K[0] === Symbol.for("react.memo_cache_sentinel")) Y = r_8.createElement(T, {
            color: "promptBorder",
            dimColor: !0
        }, B16), K[0] = Y;
        else Y = K[0];
        return Y
    }
    let z;
    if (K[1] === Symbol.for("react.memo_cache_sentinel")) z = r_8.createElement(T, {
        color: "fastMode"
    }, B16), K[1] = z;
    else z = K[1];
    return z
}
// @from(Ln 479247, Col 0)
function HW6(q = !0, K = !1) {
    if (!q) return B16;
    let _ = Ad(H8().theme);
    if (K) return Y8.dim(d7("promptBorder", _)(B16));
    return d7("fastMode", _)(B16)
}
// @from(Ln 479253, Col 4)
r_8
// @from(Ln 479254, Col 4)
s$7 = L(() => {
    o6();
    Y3();
    A3();
    g6();
    h1();
    u$6();
    r_8 = K6(P6(), 1)
})
// @from(Ln 479263, Col 4)
hiK = {}
// @from(Ln 479269, Col 0)
function t$7(q, K) {
    if (zw6(), P7("userSettings", {
            fastMode: q ? !0 : void 0
        }), q) K((_) => {
        let z = !zX(_.mainLoopModel);
        return {
            ..._,
            ...z && {
                mainLoopModel: $n6(),
                mainLoopModelForSession: null
            },
            fastMode: !0
        }
    });
    else K((_) => ({
        ..._,
        fastMode: !1
    }))
}
// @from(Ln 479289, Col 0)
function _o8(q) {
    let K = s(30),
        {
            onDone: _,
            unavailableReason: z
        } = q,
        Y = M8(OlY),
        A = M8(AlY),
        O = R7(),
        [w, $] = LiK.useState(A ?? !1),
        j;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) j = tv1(), K[0] = j;
    else j = K[0];
    let H = j,
        J = H.status === "cooldown",
        X = z !== null,
        M;
    if (K[1] === Symbol.for("react.memo_cache_sentinel")) M = Yf(CT6(!0)), K[1] = M;
    else M = K[1];
    let P = M,
        W;
    if (K[2] !== w || K[3] !== X || K[4] !== Y || K[5] !== _ || K[6] !== O) W = function() {
        if (X) return;
        if (t$7(w, O), d("tengu_fast_mode_toggled", {
                enabled: w,
                source: "picker"
            }), w) {
            let S = HW6(w),
                F = !zX(Y) ? ` · model set to ${wB}` : "";
            _(`${S} Fast mode ON${F} · ${P}`)
        } else O(YlY), _("Fast mode OFF")
    }, K[2] = w, K[3] = X, K[4] = Y, K[5] = _, K[6] = O, K[7] = W;
    else W = K[7];
    let D = W,
        Z;
    if (K[8] !== A || K[9] !== X || K[10] !== _ || K[11] !== O) Z = function() {
        if (X) {
            if (A) t$7(!1, O);
            _("Fast mode OFF", {
                display: "system"
            });
            return
        }
        let S = A ? `${HW6()} Kept Fast mode ON` : "Kept Fast mode OFF";
        _(S, {
            display: "system"
        })
    }, K[8] = A, K[9] = X, K[10] = _, K[11] = O, K[12] = Z;
    else Z = K[12];
    let G = Z,
        f;
    if (K[13] !== X) f = function() {
        if (X) return;
        $(zlY)
    }, K[13] = X, K[14] = f;
    else f = K[14];
    let v = f,
        V;
    if (K[15] !== D || K[16] !== v) V = {
        "confirm:yes": D,
        "confirm:nextField": v,
        "confirm:next": v,
        "confirm:previous": v,
        "confirm:cycleMode": v,
        "confirm:toggle": v
    }, K[15] = D, K[16] = v, K[17] = V;
    else V = K[17];
    let k;
    if (K[18] === Symbol.for("react.memo_cache_sentinel")) k = {
        context: "Confirmation"
    }, K[18] = k;
    else k = K[18];
    L7(V, k);
    let N;
    if (K[19] === Symbol.for("react.memo_cache_sentinel")) N = i3.createElement(T, null, i3.createElement(yiK, {
        cooldown: J
    }), " Fast mode (research preview)"), K[19] = N;
    else N = K[19];
    let R = N,
        h;
    if (K[20] !== X) h = (m) => m.pending ? i3.createElement(T, null, "Press ", m.keyName, " again to exit") : X ? i3.createElement(A8, {
        chord: "escape",
        action: "cancel"
    }) : i3.createElement(z1, null, i3.createElement(A8, {
        chord: "tab",
        action: "toggle"
    }), i3.createElement(A8, {
        chord: "enter",
        action: "confirm"
    }), i3.createElement(A8, {
        chord: "escape",
        action: "cancel"
    })), K[20] = X, K[21] = h;
    else h = K[21];
    let C;
    if (K[22] !== w || K[23] !== z) C = z ? i3.createElement(u, {
        marginLeft: 2
    }, i3.createElement(T, {
        color: "error"
    }, z)) : i3.createElement(i3.Fragment, null, i3.createElement(u, {
        flexDirection: "column",
        gap: 0,
        marginLeft: 2
    }, i3.createElement(u, {
        flexDirection: "row",
        gap: 2
    }, i3.createElement(T, {
        bold: !0
    }, "Fast mode"), i3.createElement(T, {
        color: w ? "fastMode" : void 0,
        bold: w
    }, w ? "ON " : "OFF"), i3.createElement(T, {
        dimColor: !0
    }, P))), J && H.status === "cooldown" && i3.createElement(u, {
        marginLeft: 2
    }, i3.createElement(T, {
        color: "warning"
    }, H.reason === "overloaded" ? "Fast mode overloaded and is temporarily unavailable" : "You've hit your fast limit", " · resets in ", C5(H.resetAt - Date.now(), {
        hideTrailingZeros: !0
    })))), K[22] = w, K[23] = z, K[24] = C;
    else C = K[24];
    let x;
    if (K[25] === Symbol.for("react.memo_cache_sentinel")) x = i3.createElement(T, {
        dimColor: !0
    }, "Learn more:", " ", i3.createElement(yq, {
        url: "https://code.claude.com/docs/en/fast-mode"
    }, "https://code.claude.com/docs/en/fast-mode")), K[25] = x;
    else x = K[25];
    let B;
    if (K[26] !== G || K[27] !== C || K[28] !== h) B = i3.createElement(R1, {
        title: R,
        subtitle: `High-speed mode for ${wB}. Billed as extra usage at a premium rate. Separate rate limits apply.`,
        onCancel: G,
        color: "fastMode",
        inputGuide: h
    }, C, x), K[26] = G, K[27] = C, K[28] = h, K[29] = B;
    else B = K[29];
    return B
}
// @from(Ln 479429, Col 0)
function zlY(q) {
    return !q
}
// @from(Ln 479433, Col 0)
function YlY(q) {
    return {
        ...q,
        fastMode: !1
    }
}
// @from(Ln 479440, Col 0)
function AlY(q) {
    return q.fastMode
}
// @from(Ln 479444, Col 0)
function OlY(q) {
    return q.mainLoopModel
}
// @from(Ln 479447, Col 0)
async function wlY(q, K, _) {
    let z = ST6();
    if (z) return `Fast mode unavailable: ${z}`;
    let {
        mainLoopModel: Y
    } = K();
    if (t$7(q, _), d("tengu_fast_mode_toggled", {
            enabled: q,
            source: "shortcut"
        }), q) {
        let A = HW6(!0),
            O = !zX(Y) ? ` · model set to ${wB}` : "",
            w = Yf(CT6(!0));
        return `${A} Fast mode ON${O} · ${w}`
    } else return "Fast mode OFF"
}
// @from(Ln 479463, Col 0)
async function $lY(q, K, _) {
    if (!q5()) return null;
    await FZ8();
    let z = _?.trim().toLowerCase();
    if (z === "on" || z === "off") {
        let A = await wlY(z === "on", K.getAppState, K.setAppState);
        return q(A), null
    }
    let Y = ST6();
    return d("tengu_fast_mode_picker_shown", {
        unavailable_reason: Y ?? ""
    }), i3.createElement(_o8, {
        onDone: q,
        unavailableReason: Y
    })
}
// @from(Ln 479479, Col 4)
i3
// @from(Ln 479479, Col 8)
LiK
// @from(Ln 479480, Col 4)
e$7 = L(() => {
    o6();
    Nq();
    S4();
    u7();
    s$7();
    g6();
    C7();
    C8();
    N7();
    zf();
    c7();
    fo();
    a1();
    i3 = K6(P6(), 1), LiK = K6(P6(), 1)
})
// @from(Ln 479496, Col 4)
jlY
// @from(Ln 479496, Col 9)
RiK
// @from(Ln 479497, Col 4)
SiK = L(() => {
    zf();
    Ko8();
    jlY = {
        type: "local-jsx",
        name: "fast",
        get description() {
            return `Toggle fast mode (${wB} only)`
        },
        isEnabled: () => q5(),
        get isHidden() {
            return !q5()
        },
        argumentHint: "[on|off]",
        get immediate() {
            return Pu6()
        },
        load: () => Promise.resolve().then(() => (e$7(), hiK))
    }, RiK = jlY
})
// @from(Ln 479518, Col 0)
function CiK({
    onDone: q
}) {
    let [K, _] = Rn.useState(!0), [z, Y] = Rn.useState([]), [A, O] = Rn.useState(!1), [w, $] = Rn.useState(null), [j, H] = Rn.useState(void 0), J = $3(() => q("Guest passes dialog dismissed", {
        display: "system"
    })), X = Rn.useCallback(() => {
        q("Guest passes dialog dismissed", {
            display: "system"
        })
    }, [q]);
    G1("confirm:no", X, {
        context: "Confirmation"
    });

    function M(Z) {
        if (Z.ctrl || Z.meta) return;
        if (Z.key === "return" && w) Z.preventDefault(), hP(w).then((G) => {
            if (G) process.stdout.write(G);
            d("tengu_guest_passes_link_copied", {}), q("Referral link copied to clipboard!")
        })
    }
    if (Rn.useEffect(() => {
            async function Z() {
                try {
                    let G = await U27();
                    if (!G || !G.eligible) {
                        O(!1), _(!1);
                        return
                    }
                    if (O(!0), G.referral_code_details?.referral_link) $(G.referral_code_details.referral_link);
                    H(G.referrer_reward);
                    let f = G.referral_code_details?.campaign ?? "claude_code_guest_pass",
                        v;
                    try {
                        v = await ZdK(f)
                    } catch (R) {
                        j6(R), O(!1), _(!1);
                        return
                    }
                    let V = v.redemptions || [],
                        k = v.limit || 3,
                        N = [];
                    for (let R = 0; R < k; R++) {
                        let h = V[R];
                        N.push({
                            passNumber: R + 1,
                            isAvailable: !h
                        })
                    }
                    Y(N), _(!1)
                } catch (G) {
                    j6(G), O(!1), _(!1)
                }
            }
            Z()
        }, []), K) return M4.createElement(A_, null, M4.createElement(u, {
        flexDirection: "column",
        gap: 1,
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: M
    }, M4.createElement(T, {
        dimColor: !0
    }, "Loading guest pass information…"), M4.createElement(T, {
        dimColor: !0,
        italic: !0
    }, J.pending ? M4.createElement(M4.Fragment, null, "Press ", J.keyName, " again to exit") : M4.createElement(A8, {
        chord: "escape",
        action: "cancel"
    }))));
    if (!A) return M4.createElement(A_, null, M4.createElement(u, {
        flexDirection: "column",
        gap: 1,
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: M
    }, M4.createElement(T, null, "Guest passes are not currently available."), M4.createElement(T, {
        dimColor: !0,
        italic: !0
    }, J.pending ? M4.createElement(M4.Fragment, null, "Press ", J.keyName, " again to exit") : M4.createElement(A8, {
        chord: "escape",
        action: "cancel"
    }))));
    let P = w7(z, (Z) => Z.isAvailable),
        W = [...z].sort((Z, G) => +G.isAvailable - +Z.isAvailable),
        D = (Z) => {
            if (!Z.isAvailable) return M4.createElement(u, {
                key: Z.passNumber,
                flexDirection: "column",
                marginRight: 1
            }, M4.createElement(T, {
                dimColor: !0
            }, "┌─────────╱"), M4.createElement(T, {
                dimColor: !0
            }, ` ) CC ${EV} ┊╱`), M4.createElement(T, {
                dimColor: !0
            }, "└───────╱"));
            return M4.createElement(u, {
                key: Z.passNumber,
                flexDirection: "column",
                marginRight: 1
            }, M4.createElement(T, null, "┌──────────┐"), M4.createElement(T, null, " ) CC ", M4.createElement(T, {
                color: "claude"
            }, EV), " ┊ ( "), M4.createElement(T, null, "└──────────┘"))
        };
    return M4.createElement(A_, null, M4.createElement(u, {
        flexDirection: "column",
        gap: 1,
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: M
    }, M4.createElement(T, {
        color: "permission"
    }, "Guest passes · ", P, " left"), M4.createElement(u, {
        flexDirection: "row",
        marginLeft: 2
    }, W.slice(0, 3).map((Z) => D(Z))), w && M4.createElement(u, {
        marginLeft: 2
    }, M4.createElement(T, null, w)), M4.createElement(u, {
        flexDirection: "column",
        marginLeft: 2
    }, M4.createElement(T, {
        dimColor: !0
    }, j ? `Share a free week of Claude Code with friends. If they love it and subscribe, you'll get ${r_6(j)} of extra usage to keep building. ` : "Share a free week of Claude Code with friends. ", M4.createElement(yq, {
        url: j ? "https://support.claude.com/en/articles/13456702-claude-code-guest-passes" : "https://support.claude.com/en/articles/12875061-claude-code-guest-passes"
    }, "Terms apply."))), M4.createElement(u, null, M4.createElement(T, {
        dimColor: !0,
        italic: !0
    }, J.pending ? M4.createElement(M4.Fragment, null, "Press ", J.keyName, " again to exit") : M4.createElement(z1, null, M4.createElement(A8, {
        chord: "enter",
        action: "copy link"
    }), M4.createElement(A8, {
        chord: "escape",
        action: "cancel"
    }))))))
}
// @from(Ln 479654, Col 4)
M4
// @from(Ln 479654, Col 8)
Rn
// @from(Ln 479655, Col 4)
biK = L(() => {
    A3();
    C$();
    HX();
    g6();
    C7();
    C8();
    a_6();
    U8();
    Nq();
    u7();
    DJ();
    M4 = K6(P6(), 1), Rn = K6(P6(), 1)
})
// @from(Ln 479669, Col 4)
IiK = {}
// @from(Ln 479673, Col 0)
async function HlY(q) {
    let _ = !H8().hasVisitedPasses;
    if (_) {
        let z = Dr8();
        d8((Y) => ({
            ...Y,
            hasVisitedPasses: !0,
            passesLastSeenRemaining: z ?? Y.passesLastSeenRemaining
        }))
    }
    return d("tengu_guest_passes_visited", {
        is_first_visit: _
    }), qj7.createElement(CiK, {
        onDone: q
    })
}
// @from(Ln 479689, Col 4)
qj7
// @from(Ln 479690, Col 4)
xiK = L(() => {
    biK();
    C8();
    a_6();
    h1();
    qj7 = K6(P6(), 1)
})
// @from(Ln 479697, Col 4)
uiK
// @from(Ln 479698, Col 4)
miK = L(() => {
    a_6();
    uiK = {
        type: "local-jsx",
        name: "passes",
        get description() {
            if (o_6()) return "Share a free week of Claude Code with friends and earn extra usage";
            return "Share a free week of Claude Code with friends"
        },
        get isHidden() {
            let {
                eligible: q,
                hasCache: K
            } = sx6();
            return !q || !K
        },
        load: () => Promise.resolve().then(() => (xiK(), IiK))
    }
})
// @from(Ln 479717, Col 4)
BiK = {}
// @from(Ln 479723, Col 0)
function XlY() {
    let q = s(9),
        K;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) K = L4.default.createElement(T, null, "An update to our Consumer Terms and Privacy Policy will take effect on", " ", L4.default.createElement(T, {
        bold: !0
    }, "October 8, 2025"), ". You can accept the updated terms today."), q[0] = K;
    else K = q[0];
    let _;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) _ = L4.default.createElement(T, null, "What's changing?"), q[1] = _;
    else _ = q[1];
    let z, Y;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) z = L4.default.createElement(T, null, "· "), Y = L4.default.createElement(T, {
        bold: !0
    }, "You can help improve Claude "), q[2] = z, q[3] = Y;
    else z = q[2], Y = q[3];
    let A;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) A = L4.default.createElement(u, {
        paddingLeft: 1
    }, L4.default.createElement(T, null, z, Y, L4.default.createElement(T, null, "— Allow the use of your chats and coding sessions to train and improve Anthropic AI models. Change anytime in your Privacy Settings (", L4.default.createElement(yq, {
        url: "https://claude.ai/settings/data-privacy-controls"
    }), ")."))), q[4] = A;
    else A = q[4];
    let O;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) O = L4.default.createElement(u, {
        flexDirection: "column"
    }, _, A, L4.default.createElement(u, {
        paddingLeft: 1
    }, L4.default.createElement(T, null, L4.default.createElement(T, null, "· "), L4.default.createElement(T, {
        bold: !0
    }, "Updates to data retention "), L4.default.createElement(T, null, "— To help us improve our AI models and safety protections, we're extending data retention to 5 years.")))), q[5] = O;
    else O = q[5];
    let w;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) w = L4.default.createElement(yq, {
        url: "https://www.anthropic.com/news/updates-to-our-consumer-terms"
    }), q[6] = w;
    else w = q[6];
    let $;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) $ = L4.default.createElement(yq, {
        url: "https://anthropic.com/legal/terms"
    }), q[7] = $;
    else $ = q[7];
    let j;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) j = L4.default.createElement(L4.default.Fragment, null, K, O, L4.default.createElement(T, null, "Learn more (", w, ") or read the updated Consumer Terms (", $, ") and Privacy Policy (", L4.default.createElement(yq, {
        url: "https://anthropic.com/legal/privacy"
    }), ")")), q[8] = j;
    else j = q[8];
    return j
}
// @from(Ln 479772, Col 0)
function MlY() {
    let q = s(7),
        K;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) K = L4.default.createElement(T, null, "We've updated our Consumer Terms and Privacy Policy."), q[0] = K;
    else K = q[0];
    let _;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) _ = L4.default.createElement(T, null, "What's changing?"), q[1] = _;
    else _ = q[1];
    let z;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) z = L4.default.createElement(u, {
        flexDirection: "column"
    }, L4.default.createElement(T, {
        bold: !0
    }, "Help improve Claude"), L4.default.createElement(T, null, "Allow the use of your chats and coding sessions to train and improve Anthropic AI models. You can change this anytime in Privacy Settings"), L4.default.createElement(yq, {
        url: "https://claude.ai/settings/data-privacy-controls"
    })), q[2] = z;
    else z = q[2];
    let Y;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) Y = L4.default.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, _, z, L4.default.createElement(u, {
        flexDirection: "column"
    }, L4.default.createElement(T, {
        bold: !0
    }, "How this affects data retention"), L4.default.createElement(T, null, "Turning ON the improve Claude setting extends data retention from 30 days to 5 years. Turning it OFF keeps the default 30-day data retention. Delete data anytime."))), q[3] = Y;
    else Y = q[3];
    let A;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) A = L4.default.createElement(yq, {
        url: "https://www.anthropic.com/news/updates-to-our-consumer-terms"
    }), q[4] = A;
    else A = q[4];
    let O;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) O = L4.default.createElement(yq, {
        url: "https://anthropic.com/legal/terms"
    }), q[5] = O;
    else O = q[5];
    let w;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) w = L4.default.createElement(L4.default.Fragment, null, K, Y, L4.default.createElement(T, null, "Learn more (", A, ") or read the updated Consumer Terms (", O, ") and Privacy Policy (", L4.default.createElement(yq, {
        url: "https://anthropic.com/legal/privacy"
    }), ")")), q[6] = w;
    else w = q[6];
    return w
}
// @from(Ln 479817, Col 0)
function Kj7(q) {
    let K = s(34),
        {
            showIfAlreadyViewed: _,
            location: z,
            onDone: Y
        } = q,
        [A, O] = L4.useState(null),
        [w, $] = L4.useState(null),
        j, H;
    if (K[0] !== z || K[1] !== Y || K[2] !== _) j = () => {
        (async function() {
            let [B, m] = await Promise.all([OF(), j36()]), S = m.success ? m.data : null;
            $(S);
            let F = so1(B, m, _);
            if (O(F), !F) {
                Y("skip_rendering");
                return
            }
            ao1(), d("tengu_grove_policy_viewed", {
                location: z,
                dismissable: S?.notice_is_grace_period
            })
        })()
    }, H = [_, z, Y], K[0] = z, K[1] = Y, K[2] = _, K[3] = j, K[4] = H;
    else j = K[3], H = K[4];
    if (L4.useEffect(j, H), A === null) return null;
    if (!A) return null;
    let J;
    if (K[5] !== w?.notice_is_grace_period || K[6] !== Y) J = async function(x) {
        q: switch (x) {
            case "accept_opt_in": {
                await Zu8(!0), d("tengu_grove_policy_submitted", {
                    state: !0,
                    dismissable: w?.notice_is_grace_period
                });
                break q
            }
            case "accept_opt_out": {
                await Zu8(!1), d("tengu_grove_policy_submitted", {
                    state: !1,
                    dismissable: w?.notice_is_grace_period
                });
                break q
            }
            case "defer": {
                d("tengu_grove_policy_dismissed", {
                    state: !0
                });
                break q
            }
            case "escape":
                d("tengu_grove_policy_escaped", {})
        }
        Y(x)
    }, K[5] = w?.notice_is_grace_period, K[6] = Y, K[7] = J;
    else J = K[7];
    let X = J,
        M;
    if (K[8] !== w?.domain_excluded) M = w?.domain_excluded ? [{
        label: "Accept terms · Help improve Claude: OFF (for emails with your domain)",
        value: "accept_opt_out"
    }] : [{
        label: "Accept terms · Help improve Claude: ON",
        value: "accept_opt_in"
    }, {
        label: "Accept terms · Help improve Claude: OFF",
        value: "accept_opt_out"
    }], K[8] = w?.domain_excluded, K[9] = M;
    else M = K[9];
    let P = M,
        W;
    if (K[10] !== w?.notice_is_grace_period || K[11] !== X) W = function() {
        if (w?.notice_is_grace_period) {
            X("defer");
            return
        }
        X("escape")
    }, K[10] = w?.notice_is_grace_period, K[11] = X, K[12] = W;
    else W = K[12];
    let D = W,
        Z;
    if (K[13] !== w?.notice_is_grace_period) Z = L4.default.createElement(u, {
        flexDirection: "column",
        gap: 1,
        flexGrow: 1
    }, w?.notice_is_grace_period ? L4.default.createElement(XlY, null) : L4.default.createElement(MlY, null)), K[13] = w?.notice_is_grace_period, K[14] = Z;
    else Z = K[14];
    let G;
    if (K[15] === Symbol.for("react.memo_cache_sentinel")) G = L4.default.createElement(u, {
        flexShrink: 0
    }, L4.default.createElement(T, {
        color: "professionalBlue"
    }, JlY)), K[15] = G;
    else G = K[15];
    let f;
    if (K[16] !== Z) f = L4.default.createElement(u, {
        flexDirection: "row"
    }, Z, G), K[16] = Z, K[17] = f;
    else f = K[17];
    let v;
    if (K[18] === Symbol.for("react.memo_cache_sentinel")) v = L4.default.createElement(u, {
        flexDirection: "column"
    }, L4.default.createElement(T, {
        bold: !0
    }, "Please select how you'd like to continue"), L4.default.createElement(T, null, "Your choice takes effect immediately upon confirmation.")), K[18] = v;
    else v = K[18];
    let V;
    if (K[19] !== w?.notice_is_grace_period) V = w?.notice_is_grace_period ? [{
        label: "Not now",
        value: "defer"
    }] : [], K[19] = w?.notice_is_grace_period, K[20] = V;
    else V = K[20];
    let k;
    if (K[21] !== P || K[22] !== V) k = [...P, ...V], K[21] = P, K[22] = V, K[23] = k;
    else k = K[23];
    let N;
    if (K[24] !== X) N = (C) => X(C), K[24] = X, K[25] = N;
    else N = K[25];
    let R;
    if (K[26] !== D || K[27] !== k || K[28] !== N) R = L4.default.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, v, L4.default.createElement(A1, {
        options: k,
        onChange: N,
        onCancel: D
    })), K[26] = D, K[27] = k, K[28] = N, K[29] = R;
    else R = K[29];
    let h;
    if (K[30] !== D || K[31] !== R || K[32] !== f) h = L4.default.createElement(R1, {
        title: "Updates to Consumer Terms and Policies",
        color: "professionalBlue",
        onCancel: D,
        inputGuide: PlY
    }, f, R), K[30] = D, K[31] = R, K[32] = f, K[33] = h;
    else h = K[33];
    return h
}
// @from(Ln 479957, Col 0)
function PlY(q) {
    return q.pending ? L4.default.createElement(T, null, "Press ", q.keyName, " again to exit") : L4.default.createElement(z1, null, L4.default.createElement(A8, {
        chord: "enter",
        action: "confirm"
    }), L4.default.createElement(A8, {
        chord: "escape",
        action: "cancel"
    }))
}
// @from(Ln 479967, Col 0)
function _j7(q) {
    let K = s(20),
        {
            settings: _,
            domainExcluded: z,
            onDone: Y
        } = q,
        [A, O] = L4.useState(_.grove_enabled),
        w;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) w = [], K[0] = w;
    else w = K[0];
    L4.default.useEffect(WlY, w);
    let $;
    if (K[1] !== z || K[2] !== A) $ = function(f) {
        if (f.ctrl || f.meta) return;
        if (!z && (f.key === "tab" || f.key === "return" || f.key === " ")) {
            f.preventDefault();
            let v = !A;
            O(v), Zu8(v)
        }
    }, K[1] = z, K[2] = A, K[3] = $;
    else $ = K[3];
    let j = $,
        H;
    if (K[4] === Symbol.for("react.memo_cache_sentinel")) H = L4.default.createElement(T, {
        color: "error"
    }, "false"), K[4] = H;
    else H = K[4];
    let J = H;
    if (z) {
        let G;
        if (K[5] === Symbol.for("react.memo_cache_sentinel")) G = L4.default.createElement(T, {
            color: "error"
        }, "false (for emails with your domain)"), K[5] = G;
        else G = K[5];
        J = G
    } else if (A) {
        let G;
        if (K[6] === Symbol.for("react.memo_cache_sentinel")) G = L4.default.createElement(T, {
            color: "success"
        }, "true"), K[6] = G;
        else G = K[6];
        J = G
    }
    let X;
    if (K[7] !== z) X = (G) => G.pending ? L4.default.createElement(T, null, "Press ", G.keyName, " again to exit") : z ? L4.default.createElement(A8, {
        chord: "escape",
        action: "cancel"
    }) : L4.default.createElement(z1, null, L4.default.createElement(A8, {
        chord: ["enter", "tab", "space"],
        action: "toggle"
    }), L4.default.createElement(A8, {
        chord: "escape",
        action: "cancel"
    })), K[7] = z, K[8] = X;
    else X = K[8];
    let M;
    if (K[9] === Symbol.for("react.memo_cache_sentinel")) M = L4.default.createElement(T, null, "Review and manage your privacy settings at", " ", L4.default.createElement(yq, {
        url: "https://claude.ai/settings/data-privacy-controls"
    })), K[9] = M;
    else M = K[9];
    let P;
    if (K[10] === Symbol.for("react.memo_cache_sentinel")) P = L4.default.createElement(u, {
        width: 44
    }, L4.default.createElement(T, {
        bold: !0
    }, "Help improve Claude")), K[10] = P;
    else P = K[10];
    let W;
    if (K[11] !== J) W = L4.default.createElement(u, null, P, L4.default.createElement(u, null, J)), K[11] = J, K[12] = W;
    else W = K[12];
    let D;
    if (K[13] !== j || K[14] !== W) D = L4.default.createElement(u, {
        flexDirection: "column",
        gap: 1,
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: j
    }, M, W), K[13] = j, K[14] = W, K[15] = D;
    else D = K[15];
    let Z;
    if (K[16] !== Y || K[17] !== X || K[18] !== D) Z = L4.default.createElement(R1, {
        title: "Data Privacy",
        color: "professionalBlue",
        onCancel: Y,
        inputGuide: X
    }, D), K[16] = Y, K[17] = X, K[18] = D, K[19] = Z;
    else Z = K[19];
    return Z
}
// @from(Ln 480058, Col 0)
function WlY() {
    d("tengu_grove_privacy_settings_viewed", {})
}
// @from(Ln 480061, Col 4)
L4
// @from(Ln 480061, Col 8)
JlY = ` _____________
 |          \\  \\
 | NEW TERMS \\__\\
 |              |
 |  ----------  |
 |  ----------  |
 |  ----------  |
 |  ----------  |
 |  ----------  |
 |              |
 |______________|`
// @from(Ln 480072, Col 4)
zj7 = L(() => {
    o6();
    C8();
    g6();
    mR6();
    g_();
    Nq();
    S4();
    u7();
    L4 = K6(P6(), 1)
})
// @from(Ln 480083, Col 4)
FiK = {}
// @from(Ln 480087, Col 0)
async function DlY(q) {
    if (!await uR6()) return q(piK), null;
    let [_, z] = await Promise.all([OF(), j36()]);
    if (!_.success) return q(piK), null;
    let Y = _.data,
        A = z.success ? z.data : null;
    async function O($) {
        if ($ === "escape" || $ === "defer") {
            q("Privacy settings dialog dismissed", {
                display: "system"
            });
            return
        }
        await w()
    }
    async function w() {
        let $ = await OF();
        if (!$.success) {
            q("Unable to retrieve updated privacy settings", {
                display: "system"
            });
            return
        }
        let j = $.data,
            H = j.grove_enabled ? "true" : "false";
        if (q(`"Help improve Claude" set to ${H}.`), Y.grove_enabled !== null && Y.grove_enabled !== j.grove_enabled) d("tengu_grove_policy_toggled", {
            state: j.grove_enabled,
            location: "settings"
        })
    }
    if (Y.grove_enabled !== null) return o_8.createElement(_j7, {
        settings: Y,
        domainExcluded: A?.domain_excluded,
        onDone: w
    });
    return o_8.createElement(Kj7, {
        showIfAlreadyViewed: !0,
        onDone: O,
        location: "settings"
    })
}
// @from(Ln 480128, Col 4)
o_8
// @from(Ln 480128, Col 9)
piK = "Review and manage your privacy settings at https://claude.ai/settings/data-privacy-controls"
// @from(Ln 480129, Col 4)
giK = L(() => {
    zj7();
    C8();
    mR6();
    o_8 = K6(P6(), 1)
})
// @from(Ln 480135, Col 4)
ZlY
// @from(Ln 480135, Col 9)
Yj7
// @from(Ln 480136, Col 4)
UiK = L(() => {
    T7();
    ZlY = {
        type: "local-jsx",
        name: "privacy-settings",
        description: "View and update your privacy settings",
        isEnabled: () => {
            return u26()
        },
        load: () => Promise.resolve().then(() => (giK(), FiK))
    }, Yj7 = ZlY
})
// @from(Ln 480152, Col 0)
function DL(q) {
    if ("statusMessage" in q && q.statusMessage) return q.statusMessage;
    switch (q.type) {
        case "command":
            return q.command;
        case "prompt":
            return q.prompt;
        case "agent":
            return q.prompt;
        case "http":
            return q.url;
        case "callback":
            return "callback";
        case "function":
            return "function"
    }
}
// @from(Ln 480170, Col 0)
function QiK(q) {
    let K = [];
    if (E1("policySettings")?.allowManagedHooksOnly !== !0) {
        let O = $v,
            w = new Set;
        for (let $ of O) {
            let j = Ww($);
            if (j) {
                let J = flY(j);
                if (w.has(J)) continue;
                w.add(J)
            }
            let H = E1($);
            if (!H?.hooks) continue;
            for (let [J, X] of Object.entries(H.hooks))
                for (let M of X)
                    for (let P of M.hooks) K.push({
                        event: J,
                        config: P,
                        matcher: M.matcher,
                        source: $
                    })
        }
    }
    let Y = I8(),
        A = u96(q, Y);
    for (let [O, w] of A.entries())
        for (let $ of w)
            for (let j of $.hooks) K.push({
                event: O,
                config: j,
                matcher: $.matcher,
                source: "sessionHook"
            });
    return K
}
// @from(Ln 480207, Col 0)
function diK(q) {
    switch (q) {
        case "userSettings":
            return "User settings (~/.claude/settings.json)";
        case "projectSettings":
            return "Project settings (.claude/settings.json)";
        case "localSettings":
            return "Local settings (.claude/settings.local.json)";
        case "pluginHook":
            return "Plugin hooks (~/.claude/plugins/*/hooks/hooks.json)";
        case "sessionHook":
            return "Session hooks (in-memory, temporary)";
        case "builtinHook":
            return "Built-in hooks (registered internally by Claude Code)";
        default:
            return q
    }
}
// @from(Ln 480226, Col 0)
function Aj7(q) {
    switch (q) {
        case "userSettings":
            return "User Settings";
        case "projectSettings":
            return "Project Settings";
        case "localSettings":
            return "Local Settings";
        case "pluginHook":
            return "Plugin Hooks";
        case "sessionHook":
            return "Session Hooks";
        case "builtinHook":
            return "Built-in Hooks";
        default:
            return q
    }
}