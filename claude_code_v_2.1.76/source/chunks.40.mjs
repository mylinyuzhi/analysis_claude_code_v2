
// @from(Ln 98963, Col 0)
function k23(A) {
    return function() {
        return A
    }
}
// @from(Ln 98968, Col 4)
aK7
// @from(Ln 98969, Col 4)
sK7 = E(() => {
    aK7 = k23
})
// @from(Ln 98972, Col 4)
E23
// @from(Ln 98972, Col 9)
tK7
// @from(Ln 98973, Col 4)
eK7 = E(() => {
    sK7();
    Km1();
    Mt6();
    E23 = !cw6 ? hw6 : function(A, q) {
        return cw6(A, "toString", {
            configurable: !0,
            enumerable: !1,
            value: aK7(q),
            writable: !0
        })
    }, tK7 = E23
})
// @from(Ln 98987, Col 0)
function h23(A) {
    var q = 0,
        K = 0;
    return function() {
        var Y = R23(),
            z = L23 - (Y - K);
        if (K = Y, z > 0) {
            if (++q >= y23) return arguments[0]
        } else q = 0;
        return A.apply(void 0, arguments)
    }
}
// @from(Ln 98999, Col 4)
y23 = 800
// @from(Ln 99000, Col 4)
L23 = 16
// @from(Ln 99001, Col 4)
R23
// @from(Ln 99001, Col 9)
A57
// @from(Ln 99002, Col 4)
q57 = E(() => {
    R23 = Date.now;
    A57 = h23
})
// @from(Ln 99006, Col 4)
S23
// @from(Ln 99006, Col 9)
k31
// @from(Ln 99007, Col 4)
q58 = E(() => {
    eK7();
    q57();
    S23 = A57(tK7), k31 = S23
})
// @from(Ln 99013, Col 0)
function C23(A, q) {
    return k31(V31(A, q, hw6), A + "")
}
// @from(Ln 99016, Col 4)
K57
// @from(Ln 99017, Col 4)
Y57 = E(() => {
    Mt6();
    A58();
    q58();
    K57 = C23
})
// @from(Ln 99024, Col 0)
function I23(A, q, K) {
    if (!A_(K)) return !1;
    var Y = typeof q;
    if (Y == "number" ? Vx(K) && fn(q, K.length) : Y == "string" && (q in K)) return Gx(K[q], A);
    return !1
}
// @from(Ln 99030, Col 4)
z57
// @from(Ln 99031, Col 4)
_57 = E(() => {
    jw6();
    Nw6();
    yk6();
    AG();
    z57 = I23
})
// @from(Ln 99039, Col 0)
function b23(A) {
    return K57(function(q, K) {
        var Y = -1,
            z = K.length,
            _ = z > 1 ? K[z - 1] : void 0,
            w = z > 2 ? K[2] : void 0;
        if (_ = A.length > 3 && typeof _ == "function" ? (z--, _) : void 0, w && z57(K[0], K[1], w)) _ = z < 3 ? void 0 : _, z = 1;
        q = Object(q);
        while (++Y < z) {
            var O = K[Y];
            if (O) A(q, O, Y, _)
        }
        return q
    })
}
// @from(Ln 99054, Col 4)
w57
// @from(Ln 99055, Col 4)
O57 = E(() => {
    Y57();
    _57();
    w57 = b23
})
// @from(Ln 99060, Col 4)
x23
// @from(Ln 99060, Col 9)
C46
// @from(Ln 99061, Col 4)
$57 = E(() => {
    iK7();
    O57();
    x23 = w57(function(A, q, K, Y) {
        lK7(A, q, K, Y)
    }), C46 = x23
})
// @from(Ln 99072, Col 0)
function U1(A, q, K = {}) {
    let Y = m23();
    if (!Y) return;
    let z = {
            timestamp: new Date().toISOString(),
            level: A,
            event: q,
            data: K
        },
        _ = $1();
    try {
        _.appendFileSync(Y, B6(z) + `
`)
    } catch {
        try {
            _.mkdirSync(u23(Y)), _.appendFileSync(Y, B6(z) + `
`)
        } catch {}
    }
}
// @from(Ln 99093, Col 0)
function m23() {
    return process.env.CLAUDE_CODE_DIAGNOSTICS_FILE
}
// @from(Ln 99096, Col 0)
async function HJ6(A, q, K) {
    let Y = Date.now();
    U1("info", `${A}_started`);
    try {
        let z = await q(),
            _ = K ? K(z) : {};
        return U1("info", `${A}_completed`, {
            duration_ms: Date.now() - Y,
            ..._
        }), z
    } catch (z) {
        throw U1("error", `${A}_failed`, {
            duration_ms: Date.now() - Y
        }), z
    }
}
// @from(Ln 99112, Col 4)
u_ = E(() => {
    SA();
    g1()
})
// @from(Ln 99117, Col 0)
function vo(A) {
    switch (A) {
        case "userSettings":
            return "user";
        case "projectSettings":
            return "project";
        case "localSettings":
            return "project, gitignored";
        case "flagSettings":
            return "cli flag";
        case "policySettings":
            return "managed"
    }
}
// @from(Ln 99132, Col 0)
function jJ6(A) {
    switch (A) {
        case "userSettings":
            return "User";
        case "projectSettings":
            return "Project";
        case "localSettings":
            return "Local";
        case "flagSettings":
            return "Flag";
        case "policySettings":
            return "Managed";
        case "plugin":
            return "Plugin";
        case "built-in":
            return "Built-in"
    }
}
// @from(Ln 99151, Col 0)
function E31(A) {
    switch (A) {
        case "userSettings":
            return "user settings";
        case "projectSettings":
            return "shared project settings";
        case "localSettings":
            return "project local settings";
        case "flagSettings":
            return "command line arguments";
        case "policySettings":
            return "enterprise managed settings";
        case "cliArg":
            return "CLI argument";
        case "command":
            return "command configuration";
        case "session":
            return "current session"
    }
}
// @from(Ln 99172, Col 0)
function H57(A) {
    switch (A) {
        case "userSettings":
            return "User settings";
        case "projectSettings":
            return "Shared project settings";
        case "localSettings":
            return "Project local settings";
        case "flagSettings":
            return "Command line arguments";
        case "policySettings":
            return "Enterprise managed settings";
        case "cliArg":
            return "CLI argument";
        case "command":
            return "Command configuration";
        case "session":
            return "Current session"
    }
}
// @from(Ln 99193, Col 0)
function j57(A) {
    if (A === "") return [];
    let q = A.split(",").map((Y) => Y.trim()),
        K = [];
    for (let Y of q) switch (Y) {
        case "user":
            K.push("userSettings");
            break;
        case "project":
            K.push("projectSettings");
            break;
        case "local":
            K.push("localSettings");
            break;
        default:
            throw Error(`Invalid setting source: ${Y}. Valid options are: user, project, local`)
    }
    return K
}
// @from(Ln 99213, Col 0)
function pQ() {
    let A = Iu1(),
        q = new Set(A);
    return q.add("policySettings"), q.add("flagSettings"), Array.from(q)
}
// @from(Ln 99219, Col 0)
function SH(A) {
    return pQ().includes(A)
}
// @from(Ln 99222, Col 4)
VG
// @from(Ln 99222, Col 8)
kC6
// @from(Ln 99222, Col 13)
J57 = "https://json.schemastore.org/claude-code-settings.json"
// @from(Ln 99223, Col 4)
O2 = E(() => {
    T1();
    VG = ["userSettings", "projectSettings", "localSettings", "flagSettings", "policySettings"];
    kC6 = ["localSettings", "projectSettings", "userSettings"]
})
// @from(Ln 99229, Col 0)
function F6(A) {
    let q;
    return () => q ??= A()
}
// @from(Ln 99233, Col 4)
K58 = {}
// @from(Ln 99239, Col 4)
y31
// @from(Ln 99239, Col 9)
M57
// @from(Ln 99239, Col 14)
CW
// @from(Ln 99240, Col 4)
EC6 = E(() => {
    y31 = ["acceptEdits", "bypassPermissions", "default", "dontAsk", "plan"], M57 = [...y31, "auto"], CW = M57
})
// @from(Ln 99244, Col 0)
function W57(A) {
    return !0
}
// @from(Ln 99248, Col 0)
function L31(A) {
    return D57[A] ?? D57.default
}
// @from(Ln 99252, Col 0)
function _C(A) {
    return L31(A).external
}
// @from(Ln 99256, Col 0)
function wC(A) {
    return CW.includes(A) ? A : "default"
}
// @from(Ln 99260, Col 0)
function QQ(A) {
    return L31(A).title
}
// @from(Ln 99264, Col 0)
function Z57(A) {
    return A === "default" || A === void 0
}
// @from(Ln 99268, Col 0)
function yC6(A) {
    return L31(A).symbol
}
// @from(Ln 99272, Col 0)
function kG(A) {
    return L31(A).color
}
// @from(Ln 99275, Col 4)
X57
// @from(Ln 99275, Col 9)
P57
// @from(Ln 99275, Col 14)
D57
// @from(Ln 99276, Col 4)
rD = E(() => {
    K7();
    EC6();
    X57 = F6(() => y4.enum(CW)), P57 = F6(() => y4.enum(y31)), D57 = {
        default: {
            title: "Default",
            shortTitle: "Default",
            symbol: "",
            color: "text",
            external: "default"
        },
        plan: {
            title: "Plan Mode",
            shortTitle: "Plan",
            symbol: "⏸",
            color: "planMode",
            external: "plan"
        },
        acceptEdits: {
            title: "Accept edits",
            shortTitle: "Accept",
            symbol: "⏵⏵",
            color: "autoAccept",
            external: "acceptEdits"
        },
        bypassPermissions: {
            title: "Bypass Permissions",
            shortTitle: "Bypass",
            symbol: "⏵⏵",
            color: "error",
            external: "bypassPermissions"
        },
        dontAsk: {
            title: "Don't Ask",
            shortTitle: "DontAsk",
            symbol: "⏵⏵",
            color: "error",
            external: "dontAsk"
        },
        ...{
            auto: {
                title: "Auto mode",
                shortTitle: "Auto",
                symbol: "⏵⏵",
                color: "warning",
                external: "default"
            }
        }
    }
})
// @from(Ln 99326, Col 4)
r4 = "Agent"
// @from(Ln 99327, Col 4)
I46 = "Task"
// @from(Ln 99328, Col 4)
R31 = "verification"
// @from(Ln 99329, Col 4)
OC = "TaskStop"
// @from(Ln 99330, Col 4)
G57 = `
- Stops a running background task by its ID
- Takes a task_id parameter identifying the task to stop
- Returns a success or failure status
- Use this tool when you need to terminate a long-running task
`
// @from(Ln 99336, Col 4)
$C = "TaskOutput"
// @from(Ln 99337, Col 4)
UQ = {}
// @from(Ln 99345, Col 4)
Y58 = "SendUserMessage"
// @from(Ln 99346, Col 4)
z58 = "Brief"
// @from(Ln 99347, Col 4)
_58 = "Send a message to the user"
// @from(Ln 99348, Col 4)
w58 = "Send a message the user will read. Text outside this tool is visible in the detail view, but most won't open it — the answer lives here.\n\n`message` supports markdown. `attachments` takes file paths (absolute or cwd-relative) for images, diffs, logs.\n\n`status` labels intent: 'normal' when replying to what they just asked; 'proactive' when you're initiating — a scheduled task finished, a blocker surfaced during background work, you need input on something they haven't asked about. Set it honestly; downstream routing uses it."
// @from(Ln 99349, Col 4)
g23
// @from(Ln 99350, Col 4)
gu = E(() => {
    g23 = `## Talking to the user

${"SendUserMessage"} is where your replies go. Text outside it is visible if the user expands the detail view, but most won't — assume unread. Anything you want them to actually see goes through ${"SendUserMessage"}. The failure mode: the real answer lives in plain text while ${"SendUserMessage"} just says "done!" — they see "done!" and miss everything.

So: every time the user says something, the reply they actually read comes through ${"SendUserMessage"}. Even for "hi". Even for "thanks".

If you can answer right away, send the answer. If you need to go look — run a command, read files, check something — ack first in one line ("On it — checking the test output"), then work, then send the result. Without the ack they're staring at a spinner.

For longer work: ack → work → result. Between those, send a checkpoint when something useful happened — a decision you made, a surprise you hit, a phase boundary. Skip the filler ("running tests...") — a checkpoint earns its place by carrying information.

Keep messages tight — the decision, the file:line, the PR number. Second person always ("your config"), never third.`
})
// @from(Ln 99364, Col 0)
function EG(A) {
    return T57[A] ?? A
}
// @from(Ln 99368, Col 0)
function v57(A) {
    let q = [];
    for (let [K, Y] of Object.entries(T57))
        if (Y === A) q.push(K);
    return q
}
// @from(Ln 99375, Col 0)
function F23(A) {
    return A.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)")
}
// @from(Ln 99379, Col 0)
function p23(A) {
    return A.replace(/\\\(/g, "(").replace(/\\\)/g, ")").replace(/\\\\/g, "\\")
}
// @from(Ln 99383, Col 0)
function CH(A) {
    let q = Q23(A, "(");
    if (q === -1) return {
        toolName: EG(A)
    };
    let K = U23(A, ")");
    if (K === -1 || K <= q) return {
        toolName: EG(A)
    };
    if (K !== A.length - 1) return {
        toolName: EG(A)
    };
    let Y = A.substring(0, q),
        z = A.substring(q + 1, K);
    if (!Y) return {
        toolName: EG(A)
    };
    if (z === "" || z === "*") return {
        toolName: EG(Y)
    };
    let _ = p23(z);
    return {
        toolName: EG(Y),
        ruleContent: _
    }
}
// @from(Ln 99410, Col 0)
function L5(A) {
    if (!A.ruleContent) return A.toolName;
    let q = F23(A.ruleContent);
    return `${A.toolName}(${q})`
}
// @from(Ln 99416, Col 0)
function Q23(A, q) {
    for (let K = 0; K < A.length; K++)
        if (A[K] === q) {
            let Y = 0,
                z = K - 1;
            while (z >= 0 && A[z] === "\\") Y++, z--;
            if (Y % 2 === 0) return K
        } return -1
}
// @from(Ln 99426, Col 0)
function U23(A, q) {
    for (let K = A.length - 1; K >= 0; K--)
        if (A[K] === q) {
            let Y = 0,
                z = K - 1;
            while (z >= 0 && A[z] === "\\") Y++, z--;
            if (Y % 2 === 0) return K
        } return -1
}
// @from(Ln 99435, Col 4)
f57
// @from(Ln 99435, Col 9)
T57
// @from(Ln 99436, Col 4)
SP = E(() => {
    f57 = (gu(), k4(UQ)).BRIEF_TOOL_NAME, T57 = {
        Task: r4,
        KillShell: OC,
        AgentOutputTool: $C,
        BashOutputTool: $C,
        ...f57 ? {
            Brief: f57
        } : {}
    }
})
// @from(Ln 99448, Col 0)
function lO(A) {
    let q = A.replace(/[^a-zA-Z0-9_-]/g, "_");
    if (A.startsWith("claude.ai ")) q = q.replace(/_+/g, "_").replace(/^_|_$/g, "");
    return q
}
// @from(Ln 99454, Col 0)
function iV(A) {
    let q = A.split("__"),
        [K, Y, ...z] = q;
    if (K !== "mcp" || !Y) return null;
    let _ = z.length > 0 ? z.join("__") : void 0;
    return {
        serverName: Y,
        toolName: _
    }
}
// @from(Ln 99465, Col 0)
function HC(A) {
    return `mcp__${lO(A)}__`
}
// @from(Ln 99469, Col 0)
function $58(A, q) {
    return `${HC(A)}${lO(q)}`
}
// @from(Ln 99473, Col 0)
function LC6(A) {
    return A.mcpInfo ? $58(A.mcpInfo.serverName, A.mcpInfo.toolName) : A.name
}
// @from(Ln 99477, Col 0)
function h31(A, q) {
    let K = `mcp__${lO(q)}__`;
    return A.replace(K, "")
}
// @from(Ln 99482, Col 0)
function S31(A) {
    let q = A.replace(/\s*\(MCP\)\s*$/, "");
    q = q.trim();
    let K = q.indexOf(" - ");
    if (K !== -1) return q.substring(K + 3).trim();
    return q
}
// @from(Ln 99489, Col 4)
sy = () => {}
// @from(Ln 99491, Col 0)
function N57(A) {
    return H58.filePatternTools.includes(A)
}
// @from(Ln 99495, Col 0)
function V57(A) {
    return H58.bashPrefixTools.includes(A)
}
// @from(Ln 99499, Col 0)
function k57(A) {
    return H58.customValidation[A]
}
// @from(Ln 99502, Col 4)
H58
// @from(Ln 99503, Col 4)
E57 = E(() => {
    H58 = {
        filePatternTools: ["Read", "Write", "Edit", "Glob", "NotebookRead", "NotebookEdit"],
        bashPrefixTools: ["Bash"],
        customValidation: {
            WebSearch: (A) => {
                if (A.includes("*") || A.includes("?")) return {
                    valid: !1,
                    error: "WebSearch does not support wildcards",
                    suggestion: "Use exact search terms without * or ?",
                    examples: ["WebSearch(claude ai)", "WebSearch(typescript tutorial)"]
                };
                return {
                    valid: !0
                }
            },
            WebFetch: (A) => {
                if (A.includes("://") || A.startsWith("http")) return {
                    valid: !1,
                    error: "WebFetch permissions use domain format, not URLs",
                    suggestion: 'Use "domain:hostname" format',
                    examples: ["WebFetch(domain:example.com)", "WebFetch(domain:github.com)"]
                };
                if (!A.startsWith("domain:")) return {
                    valid: !1,
                    error: 'WebFetch permissions must use "domain:" prefix',
                    suggestion: 'Use "domain:hostname" format',
                    examples: ["WebFetch(domain:example.com)", "WebFetch(domain:*.google.com)"]
                };
                return {
                    valid: !0
                }
            }
        }
    }
})
// @from(Ln 99540, Col 0)
function y57(A, q) {
    let K = 0,
        Y = q - 1;
    while (Y >= 0 && A[Y] === "\\") K++, Y--;
    return K % 2 !== 0
}
// @from(Ln 99547, Col 0)
function j58(A, q) {
    let K = 0;
    for (let Y = 0; Y < A.length; Y++)
        if (A[Y] === q && !y57(A, Y)) K++;
    return K
}
// @from(Ln 99554, Col 0)
function c23(A) {
    for (let q = 0; q < A.length - 1; q++)
        if (A[q] === "(" && A[q + 1] === ")") {
            if (!y57(A, q)) return !0
        } return !1
}
// @from(Ln 99561, Col 0)
function J58(A) {
    if (!A || A.trim() === "") return {
        valid: !1,
        error: "Permission rule cannot be empty"
    };
    let q = j58(A, "("),
        K = j58(A, ")");
    if (q !== K) return {
        valid: !1,
        error: "Mismatched parentheses",
        suggestion: "Ensure all opening parentheses have matching closing parentheses"
    };
    if (c23(A)) {
        let w = A.substring(0, A.indexOf("("));
        if (!w) return {
            valid: !1,
            error: "Empty parentheses with no tool name",
            suggestion: "Specify a tool name before the parentheses"
        };
        return {
            valid: !1,
            error: "Empty parentheses",
            suggestion: `Either specify a pattern or use just "${w}" without parentheses`,
            examples: [`${w}`, `${w}(some-pattern)`]
        }
    }
    let Y = CH(A),
        z = iV(Y.toolName);
    if (z) {
        if (Y.ruleContent !== void 0 || j58(A, "(") > 0) return {
            valid: !1,
            error: "MCP rules do not support patterns in parentheses",
            suggestion: `Use "${Y.toolName}" without parentheses, or use "mcp__${z.serverName}__*" for all tools`,
            examples: [`mcp__${z.serverName}`, `mcp__${z.serverName}__*`, z.toolName && z.toolName !== "*" ? `mcp__${z.serverName}__${z.toolName}` : void 0].filter(Boolean)
        };
        return {
            valid: !0
        }
    }
    if (!Y.toolName || Y.toolName.length === 0) return {
        valid: !1,
        error: "Tool name cannot be empty"
    };
    if (Y.toolName[0] !== Y.toolName[0]?.toUpperCase() && !d23.has(Y.toolName)) return {
        valid: !1,
        error: "Tool names must start with uppercase",
        suggestion: `Use "${String(Y.toolName).charAt(0).toUpperCase()+String(Y.toolName).slice(1)}"`
    };
    let _ = k57(Y.toolName);
    if (_ && Y.ruleContent !== void 0) {
        let w = _(Y.ruleContent);
        if (!w.valid) return w
    }
    if (V57(Y.toolName) && Y.ruleContent !== void 0) {
        let w = Y.ruleContent;
        if (w.includes(":*") && !w.endsWith(":*")) return {
            valid: !1,
            error: "The :* pattern must be at the end",
            suggestion: "Move :* to the end for prefix matching, or use * for wildcard matching",
            examples: ["Bash(npm run:*) - prefix matching (legacy)", "Bash(npm run *) - wildcard matching"]
        };
        if (w === ":*") return {
            valid: !1,
            error: "Prefix cannot be empty before :*",
            suggestion: "Specify a command prefix before :*",
            examples: ["Bash(npm:*)", "Bash(git:*)"]
        }
    }
    if (N57(Y.toolName) && Y.ruleContent !== void 0) {
        let w = Y.ruleContent;
        if (w.includes(":*")) return {
            valid: !1,
            error: 'The ":*" syntax is only for Bash prefix rules',
            suggestion: 'Use glob patterns like "*" or "**" for file matching',
            examples: [`${Y.toolName}(*.ts) - matches .ts files`, `${Y.toolName}(src/**) - matches all files in src`, `${Y.toolName}(**/*.test.ts) - matches test files`]
        };
        if (w.includes("*") && !w.match(/^\*|\*$|\*\*|\/\*|\*\.|\*\)/) && !w.includes("**")) return {
            valid: !1,
            error: "Wildcard placement might be incorrect",
            suggestion: "Wildcards are typically used at path boundaries",
            examples: [`${Y.toolName}(*.js) - all .js files`, `${Y.toolName}(src/*) - all files directly in src`, `${Y.toolName}(src/**) - all files recursively in src`]
        }
    }
    return {
        valid: !0
    }
}
// @from(Ln 99648, Col 4)
d23
// @from(Ln 99648, Col 9)
C31
// @from(Ln 99649, Col 4)
M58 = E(() => {
    K7();
    SP();
    sy();
    E57();
    d23 = new Set([]);
    C31 = F6(() => C.string().superRefine((A, q) => {
        let K = J58(A);
        if (!K.valid) {
            let Y = K.error;
            if (K.suggestion) Y += `. ${K.suggestion}`;
            if (K.examples && K.examples.length > 0) Y += `. Examples: ${K.examples.join(", ")}`;
            q.addIssue({
                code: C.ZodIssueCode.custom,
                message: Y,
                params: {
                    received: A
                }
            })
        }
    }))
})
// @from(Ln 99671, Col 4)
Fu
// @from(Ln 99672, Col 4)
L57 = E(() => {
    Fu = ["PreToolUse", "PostToolUse", "PostToolUseFailure", "Notification", "UserPromptSubmit", "SessionStart", "SessionEnd", "Stop", "SubagentStart", "SubagentStop", "PreCompact", "PostCompact", "PermissionRequest", "Setup", "TeammateIdle", "TaskCompleted", "Elicitation", "ElicitationResult", "ConfigChange", "WorktreeCreate", "WorktreeRemove", "InstructionsLoaded"]
})
// @from(Ln 99675, Col 4)
R57 = () => {}
// @from(Ln 99676, Col 4)
JJ6 = E(() => {
    L57();
    R57()
})
// @from(Ln 99681, Col 0)
function l23() {
    let A = C.object({
            type: C.literal("command").describe("Bash command hook type"),
            command: C.string().describe("Shell command to execute"),
            timeout: C.number().positive().optional().describe("Timeout in seconds for this specific command"),
            statusMessage: C.string().optional().describe("Custom status message to display in spinner while hook runs"),
            once: C.boolean().optional().describe("If true, hook runs once and is removed after execution"),
            async: C.boolean().optional().describe("If true, hook runs in background without blocking"),
            asyncRewake: C.boolean().optional().describe("If true, hook runs in background and wakes the model on exit code 2 (blocking error). Implies async.")
        }),
        q = C.object({
            type: C.literal("prompt").describe("LLM prompt hook type"),
            prompt: C.string().describe("Prompt to evaluate with LLM. Use $ARGUMENTS placeholder for hook input JSON."),
            timeout: C.number().positive().optional().describe("Timeout in seconds for this specific prompt evaluation"),
            model: C.string().optional().describe('Model to use for this prompt hook (e.g., "claude-sonnet-4-6"). If not specified, uses the default small fast model.'),
            statusMessage: C.string().optional().describe("Custom status message to display in spinner while hook runs"),
            once: C.boolean().optional().describe("If true, hook runs once and is removed after execution")
        }),
        K = C.object({
            type: C.literal("http").describe("HTTP hook type"),
            url: C.string().url().describe("URL to POST the hook input JSON to"),
            timeout: C.number().positive().optional().describe("Timeout in seconds for this specific request"),
            headers: C.record(C.string(), C.string()).optional().describe('Additional headers to include in the request. Values may reference environment variables using $VAR_NAME or ${VAR_NAME} syntax (e.g., "Authorization": "Bearer $MY_TOKEN"). Only variables listed in allowedEnvVars will be interpolated.'),
            allowedEnvVars: C.array(C.string()).optional().describe("Explicit list of environment variable names that may be interpolated in header values. Only variables listed here will be resolved; all other $VAR references are left as empty strings. Required for env var interpolation to work."),
            statusMessage: C.string().optional().describe("Custom status message to display in spinner while hook runs"),
            once: C.boolean().optional().describe("If true, hook runs once and is removed after execution")
        }),
        Y = C.object({
            type: C.literal("agent").describe("Agentic verifier hook type"),
            prompt: C.string().describe('Prompt describing what to verify (e.g. "Verify that unit tests ran and passed."). Use $ARGUMENTS placeholder for hook input JSON.'),
            timeout: C.number().positive().optional().describe("Timeout in seconds for agent execution (default 60)"),
            model: C.string().optional().describe('Model to use for this agent hook (e.g., "claude-sonnet-4-6"). If not specified, uses Haiku.'),
            statusMessage: C.string().optional().describe("Custom status message to display in spinner while hook runs"),
            once: C.boolean().optional().describe("If true, hook runs once and is removed after execution")
        });
    return {
        BashCommandHookSchema: A,
        PromptHookSchema: q,
        HttpHookSchema: K,
        AgentHookSchema: Y
    }
}
// @from(Ln 99723, Col 4)
h57
// @from(Ln 99723, Col 9)
S57
// @from(Ln 99723, Col 14)
ty
// @from(Ln 99724, Col 4)
I31 = E(() => {
    K7();
    JJ6();
    h57 = F6(() => {
        let {
            BashCommandHookSchema: A,
            PromptHookSchema: q,
            AgentHookSchema: K,
            HttpHookSchema: Y
        } = l23();
        return C.discriminatedUnion("type", [A, q, K, Y])
    }), S57 = F6(() => C.object({
        matcher: C.string().optional().describe('String pattern to match (e.g. tool names like "Write")'),
        hooks: C.array(h57()).describe("List of hooks to execute when the matcher matches")
    })), ty = F6(() => C.partialRecord(C.enum(Fu), C.array(S57())))
})
// @from(Ln 99740, Col 4)
D58
// @from(Ln 99740, Col 9)
tP_
// @from(Ln 99740, Col 14)
X58
// @from(Ln 99740, Col 19)
C57
// @from(Ln 99740, Col 24)
i23
// @from(Ln 99740, Col 29)
n23
// @from(Ln 99740, Col 34)
r23
// @from(Ln 99740, Col 39)
o23
// @from(Ln 99740, Col 44)
a23
// @from(Ln 99740, Col 49)
s23
// @from(Ln 99740, Col 54)
t23
// @from(Ln 99740, Col 59)
pu
// @from(Ln 99740, Col 63)
I57
// @from(Ln 99741, Col 4)
b46 = E(() => {
    K7();
    D58 = F6(() => C.enum(["local", "user", "project", "dynamic", "enterprise", "claudeai", "managed"])), tP_ = F6(() => C.enum(["stdio", "sse", "sse-ide", "http", "ws", "sdk"])), X58 = F6(() => C.object({
        type: C.literal("stdio").optional(),
        command: C.string().min(1, "Command cannot be empty"),
        args: C.array(C.string()).default([]),
        env: C.record(C.string(), C.string()).optional()
    })), C57 = F6(() => C.object({
        clientId: C.string().optional(),
        callbackPort: C.number().int().positive().optional(),
        authServerMetadataUrl: C.string().url().startsWith("https://", {
            message: "authServerMetadataUrl must use https://"
        }).optional()
    })), i23 = F6(() => C.object({
        type: C.literal("sse"),
        url: C.string(),
        headers: C.record(C.string(), C.string()).optional(),
        headersHelper: C.string().optional(),
        oauth: C57().optional()
    })), n23 = F6(() => C.object({
        type: C.literal("sse-ide"),
        url: C.string(),
        ideName: C.string(),
        ideRunningInWindows: C.boolean().optional()
    })), r23 = F6(() => C.object({
        type: C.literal("ws-ide"),
        url: C.string(),
        ideName: C.string(),
        authToken: C.string().optional(),
        ideRunningInWindows: C.boolean().optional()
    })), o23 = F6(() => C.object({
        type: C.literal("http"),
        url: C.string(),
        headers: C.record(C.string(), C.string()).optional(),
        headersHelper: C.string().optional(),
        oauth: C57().optional()
    })), a23 = F6(() => C.object({
        type: C.literal("ws"),
        url: C.string(),
        headers: C.record(C.string(), C.string()).optional(),
        headersHelper: C.string().optional()
    })), s23 = F6(() => C.object({
        type: C.literal("sdk"),
        name: C.string()
    })), t23 = F6(() => C.object({
        type: C.literal("claudeai-proxy"),
        url: C.string(),
        id: C.string()
    })), pu = F6(() => C.union([X58(), i23(), n23(), r23(), o23(), a23(), s23(), t23()])), I57 = F6(() => C.object({
        mcpServers: C.record(C.string(), pu())
    }))
})
// @from(Ln 99794, Col 0)
function RC6(A, q) {
    let K = A.toLowerCase();
    return q.autoUpdate ?? (nV.has(K) && !e23.has(K))
}
// @from(Ln 99799, Col 0)
function Kw3(A) {
    if (nV.has(A.toLowerCase())) return !1;
    if (qw3.test(A)) return !0;
    return Aw3.test(A)
}
// @from(Ln 99805, Col 0)
function u57(A, q) {
    let K = A.toLowerCase();
    if (!nV.has(K)) return null;
    if (q.source === "github") {
        if (!(q.repo || "").toLowerCase().startsWith(`${b31}/`)) return `The name '${A}' is reserved for official Anthropic marketplaces. Only repositories from 'github.com/${b31}/' can use this name.`;
        return null
    }
    if (q.source === "git" && q.url) {
        let Y = q.url.toLowerCase(),
            z = Y.includes("github.com/anthropics/"),
            _ = Y.includes("git@github.com:anthropics/");
        if (z || _) return null;
        return `The name '${A}' is reserved for official Anthropic marketplaces. Only repositories from 'github.com/${b31}/' can use this name.`
    }
    return `The name '${A}' is reserved for official Anthropic marketplaces and can only be used with GitHub sources from the '${b31}' organization.`
}
// @from(Ln 99822, Col 0)
function SC6(A) {
    return typeof A === "string" && A.startsWith("./")
}
// @from(Ln 99826, Col 0)
function No(A) {
    return A.source === "file" || A.source === "directory"
}
// @from(Ln 99829, Col 4)
nV
// @from(Ln 99829, Col 8)
e23
// @from(Ln 99829, Col 13)
Aw3
// @from(Ln 99829, Col 18)
qw3
// @from(Ln 99829, Col 23)
b31 = "anthropics"
// @from(Ln 99830, Col 4)
dQ
// @from(Ln 99830, Col 8)
MJ6
// @from(Ln 99830, Col 13)
b57
// @from(Ln 99830, Col 18)
W58
// @from(Ln 99830, Col 23)
Z58
// @from(Ln 99830, Col 28)
m57
// @from(Ln 99830, Col 33)
Yw3
// @from(Ln 99830, Col 38)
B57
// @from(Ln 99830, Col 43)
zw3
// @from(Ln 99830, Col 48)
_w3
// @from(Ln 99830, Col 53)
ww3
// @from(Ln 99830, Col 58)
Ow3
// @from(Ln 99830, Col 63)
$w3
// @from(Ln 99830, Col 68)
Hw3
// @from(Ln 99830, Col 73)
x57
// @from(Ln 99830, Col 78)
jw3
// @from(Ln 99830, Col 83)
Jw3
// @from(Ln 99830, Col 88)
Mw3
// @from(Ln 99830, Col 93)
Dw3
// @from(Ln 99830, Col 98)
DJ6
// @from(Ln 99830, Col 103)
Xw3
// @from(Ln 99830, Col 108)
g57
// @from(Ln 99830, Col 113)
Pw3
// @from(Ln 99830, Col 118)
x46
// @from(Ln 99830, Col 123)
hC6
// @from(Ln 99830, Col 128)
P58
// @from(Ln 99830, Col 133)
Ww3
// @from(Ln 99830, Col 138)
G58
// @from(Ln 99830, Col 143)
Vo
// @from(Ln 99830, Col 147)
XJ6
// @from(Ln 99830, Col 152)
Zw3
// @from(Ln 99830, Col 157)
z0_
// @from(Ln 99830, Col 162)
Gw3
// @from(Ln 99830, Col 167)
CC6
// @from(Ln 99830, Col 172)
fw3
// @from(Ln 99830, Col 177)
Tw3
// @from(Ln 99830, Col 182)
IC6
// @from(Ln 99830, Col 187)
_0_
// @from(Ln 99830, Col 192)
vw3
// @from(Ln 99830, Col 197)
PJ6
// @from(Ln 99831, Col 4)
IW = E(() => {
    K7();
    I31();
    b46();
    nV = new Set(["claude-code-marketplace", "claude-code-plugins", "claude-plugins-official", "anthropic-marketplace", "anthropic-plugins", "agent-skills", "life-sciences", "knowledge-work-plugins"]), e23 = new Set(["knowledge-work-plugins"]);
    Aw3 = /(?:official[^a-z0-9]*(anthropic|claude)|(?:anthropic|claude)[^a-z0-9]*official|^(?:anthropic|claude)[^a-z0-9]*(marketplace|plugins|official))/i, qw3 = /[^\u0020-\u007E]/;
    dQ = F6(() => C.string().startsWith("./")), MJ6 = F6(() => dQ().endsWith(".json")), b57 = F6(() => C.union([dQ().refine((A) => A.endsWith(".mcpb") || A.endsWith(".dxt"), {
        message: "MCPB file path must end with .mcpb or .dxt"
    }).describe("Path to MCPB file relative to plugin root"), C.string().url().refine((A) => A.endsWith(".mcpb") || A.endsWith(".dxt"), {
        message: "MCPB URL must end with .mcpb or .dxt"
    }).describe("URL to MCPB file")])), W58 = F6(() => dQ().endsWith(".md")), Z58 = F6(() => C.union([W58(), dQ()])), m57 = F6(() => C.object({
        name: C.string().min(1, "Author name cannot be empty").describe("Display name of the plugin author or organization"),
        email: C.string().optional().describe("Contact email for support or feedback"),
        url: C.string().optional().describe("Website, GitHub profile, or organization URL")
    })), Yw3 = F6(() => C.object({
        name: C.string().min(1, "Plugin name cannot be empty").refine((A) => !A.includes(" "), {
            message: 'Plugin name cannot contain spaces. Use kebab-case (e.g., "my-plugin")'
        }).describe("Unique identifier for the plugin, used for namespacing (prefer kebab-case)"),
        version: C.string().optional().describe("Semantic version (e.g., 1.2.3) following semver.org specification"),
        description: C.string().optional().describe("Brief, user-facing explanation of what the plugin provides"),
        author: m57().optional().describe("Information about the plugin creator or maintainer"),
        homepage: C.string().url().optional().describe("Plugin homepage or documentation URL"),
        repository: C.string().optional().describe("Source code repository URL"),
        license: C.string().optional().describe("SPDX license identifier (e.g., MIT, Apache-2.0)"),
        keywords: C.array(C.string()).optional().describe("Tags for plugin discovery and categorization"),
        dependencies: C.array(Zw3()).optional().describe(`Plugins that must be enabled for this plugin to function. Bare names (no "@marketplace") are resolved against the declaring plugin's own marketplace.`)
    })), B57 = F6(() => C.object({
        description: C.string().optional().describe("Brief, user-facing explanation of what these hooks provide"),
        hooks: C.lazy(() => ty()).describe("The hooks provided by the plugin, in the same format as the one used for settings")
    })), zw3 = F6(() => C.object({
        hooks: C.union([MJ6().describe("Path to file with additional hooks (in addition to those in hooks/hooks.json, if it exists), relative to the plugin root"), C.lazy(() => ty()).describe("Additional hooks (in addition to those in hooks/hooks.json, if it exists)"), C.array(C.union([MJ6().describe("Path to file with additional hooks (in addition to those in hooks/hooks.json, if it exists), relative to the plugin root"), C.lazy(() => ty()).describe("Additional hooks (in addition to those in hooks/hooks.json, if it exists)")]))])
    })), _w3 = F6(() => C.object({
        source: Z58().optional().describe("Path to command markdown file, relative to plugin root"),
        content: C.string().optional().describe("Inline markdown content for the command"),
        description: C.string().optional().describe("Command description override"),
        argumentHint: C.string().optional().describe('Hint for command arguments (e.g., "[file]")'),
        model: C.string().optional().describe("Default model for this command"),
        allowedTools: C.array(C.string()).optional().describe("Tools allowed when command runs")
    }).refine((A) => A.source && !A.content || !A.source && A.content, {
        message: 'Command must have either "source" (file path) or "content" (inline markdown), but not both'
    })), ww3 = F6(() => C.object({
        commands: C.union([Z58().describe("Path to additional command file or skill directory (in addition to those in the commands/ directory, if it exists), relative to the plugin root"), C.array(Z58().describe("Path to additional command file or skill directory (in addition to those in the commands/ directory, if it exists), relative to the plugin root")).describe("List of paths to additional command files or skill directories"), C.record(C.string(), _w3()).describe('Object mapping of command names to their metadata and source files. Command name becomes the slash command name (e.g., "about" → "/plugin:about")')])
    })), Ow3 = F6(() => C.object({
        agents: C.union([W58().describe("Path to additional agent file (in addition to those in the agents/ directory, if it exists), relative to the plugin root"), C.array(W58().describe("Path to additional agent file (in addition to those in the agents/ directory, if it exists), relative to the plugin root")).describe("List of paths to additional agent files")])
    })), $w3 = F6(() => C.object({
        skills: C.union([dQ().describe("Path to additional skill directory (in addition to those in the skills/ directory, if it exists), relative to the plugin root"), C.array(dQ().describe("Path to additional skill directory (in addition to those in the skills/ directory, if it exists), relative to the plugin root")).describe("List of paths to additional skill directories")])
    })), Hw3 = F6(() => C.object({
        outputStyles: C.union([dQ().describe("Path to additional output styles directory or file (in addition to those in the output-styles/ directory, if it exists), relative to the plugin root"), C.array(dQ().describe("Path to additional output styles directory or file (in addition to those in the output-styles/ directory, if it exists), relative to the plugin root")).describe("List of paths to additional output styles directories or files")])
    })), x57 = F6(() => C.string().min(1)), jw3 = F6(() => C.string().min(2).refine((A) => A.startsWith("."), {
        message: 'File extensions must start with dot (e.g., ".ts", not "ts")'
    })), Jw3 = F6(() => C.object({
        mcpServers: C.union([MJ6().describe("MCP servers to include in the plugin (in addition to those in the .mcp.json file, if it exists)"), b57().describe("Path or URL to MCPB file containing MCP server configuration"), C.record(C.string(), pu()).describe("MCP server configurations keyed by server name"), C.array(C.union([MJ6().describe("Path to MCP servers configuration file"), b57().describe("Path or URL to MCPB file"), C.record(C.string(), pu()).describe("Inline MCP server configurations")])).describe("Array of MCP server configurations (paths, MCPB files, or inline definitions)")])
    })), Mw3 = F6(() => C.object({
        type: C.enum(["string", "number", "boolean", "directory", "file"]).describe("Type of the configuration value"),
        title: C.string().describe("Human-readable label shown in the config dialog"),
        description: C.string().describe("Help text shown beneath the field in the config dialog"),
        required: C.boolean().optional().describe("If true, validation fails when this field is empty"),
        default: C.union([C.string(), C.number(), C.boolean(), C.array(C.string())]).optional().describe("Default value used when the user provides nothing"),
        multiple: C.boolean().optional().describe("For string type: allow an array of strings"),
        sensitive: C.boolean().optional().describe("If true, masks dialog input and stores value in secure storage (keychain/credentials file) instead of settings.json"),
        min: C.number().optional().describe("Minimum value (number type only)"),
        max: C.number().optional().describe("Maximum value (number type only)")
    }).strict()), Dw3 = F6(() => C.object({
        userConfig: C.record(C.string().regex(/^[A-Za-z_]\w*$/, "Option keys must be valid identifiers (letters, digits, underscore; no leading digit) — they become CLAUDE_PLUGIN_OPTION_<KEY> env vars in hooks"), Mw3()).optional().describe("User-configurable values this plugin needs. Prompted at enable time when PLUGIN_OPTIONS feature is on. Non-sensitive values saved to settings.json; sensitive values to secure storage (macOS keychain or .credentials.json). Available as ${user_config.KEY} in MCP/LSP server config, hook commands, and (non-sensitive only) skill/agent content. " + "Note: sensitive values share a single keychain entry with OAuth tokens — keep " + "secret counts small to stay under the ~2KB stdin-safe limit (see INC-3028).")
    })), DJ6 = F6(() => C.strictObject({
        command: C.string().min(1).refine((A) => {
            if (A.includes(" ") && !A.startsWith("/")) return !1;
            return !0
        }, {
            message: "Command should not contain spaces. Use args array for arguments."
        }).describe('Command to execute the LSP server (e.g., "typescript-language-server")'),
        args: C.array(x57()).optional().describe("Command-line arguments to pass to the server"),
        extensionToLanguage: C.record(jw3(), x57()).refine((A) => Object.keys(A).length > 0, {
            message: "extensionToLanguage must have at least one mapping"
        }).describe("Mapping from file extension to LSP language ID. File extensions and languages are derived from this mapping."),
        transport: C.enum(["stdio", "socket"]).default("stdio").describe("Communication transport mechanism"),
        env: C.record(C.string(), C.string()).optional().describe("Environment variables to set when starting the server"),
        initializationOptions: C.unknown().optional().describe("Initialization options passed to the server during initialization"),
        settings: C.unknown().optional().describe("Settings passed to the server via workspace/didChangeConfiguration"),
        workspaceFolder: C.string().optional().describe("Workspace folder path to use for the server"),
        startupTimeout: C.number().int().positive().optional().describe("Maximum time to wait for server startup (milliseconds)"),
        shutdownTimeout: C.number().int().positive().optional().describe("Maximum time to wait for graceful shutdown (milliseconds)"),
        restartOnCrash: C.boolean().optional().describe("Whether to restart the server if it crashes"),
        maxRestarts: C.number().int().nonnegative().optional().describe("Maximum number of restart attempts before giving up")
    })), Xw3 = F6(() => C.object({
        lspServers: C.union([MJ6().describe("Path to .lsp.json configuration file relative to plugin root"), C.record(C.string(), DJ6()).describe("LSP server configurations keyed by server name"), C.array(C.union([MJ6().describe("Path to LSP configuration file"), C.record(C.string(), DJ6()).describe("Inline LSP server configurations")])).describe("Array of LSP server configurations (paths or inline definitions)")])
    })), g57 = F6(() => C.string().refine((A) => !A.includes("..") && !A.includes("//"), "Package name cannot contain path traversal patterns").refine((A) => {
        let q = /^@[a-z0-9][a-z0-9-._]*\/[a-z0-9][a-z0-9-._]*$/,
            K = /^[a-z0-9][a-z0-9-._]*$/;
        return q.test(A) || K.test(A)
    }, "Invalid npm package name format")), Pw3 = F6(() => C.object({
        settings: C.record(C.string(), C.unknown()).optional().describe("Settings to merge when plugin is enabled. Only allowlisted keys are kept (currently: agent)")
    })), x46 = F6(() => C.object({
        ...Yw3().shape,
        ...zw3().partial().shape,
        ...ww3().partial().shape,
        ...Ow3().partial().shape,
        ...$w3().partial().shape,
        ...Hw3().partial().shape,
        ...Jw3().partial().shape,
        ...Xw3().partial().shape,
        ...Pw3().partial().shape,
        ...Dw3().partial().shape
    })), hC6 = F6(() => C.discriminatedUnion("source", [C.object({
        source: C.literal("url"),
        url: C.string().url().describe("Direct URL to marketplace.json file"),
        headers: C.record(C.string(), C.string()).optional().describe("Custom HTTP headers (e.g., for authentication)")
    }), C.object({
        source: C.literal("github"),
        repo: C.string().describe("GitHub repository in owner/repo format"),
        ref: C.string().optional().describe('Git branch or tag to use (e.g., "main", "v1.0.0"). Defaults to repository default branch.'),
        path: C.string().optional().describe("Path to marketplace.json within repo (defaults to .claude-plugin/marketplace.json)"),
        sparsePaths: C.array(C.string()).optional().describe('Directories to include via git sparse-checkout (cone mode). Use for monorepos where the marketplace lives in a subdirectory. Example: [".claude-plugin", "plugins"]. If omitted, the full repository is cloned.')
    }), C.object({
        source: C.literal("git"),
        url: C.string().describe("Full git repository URL"),
        ref: C.string().optional().describe('Git branch or tag to use (e.g., "main", "v1.0.0"). Defaults to repository default branch.'),
        path: C.string().optional().describe("Path to marketplace.json within repo (defaults to .claude-plugin/marketplace.json)"),
        sparsePaths: C.array(C.string()).optional().describe('Directories to include via git sparse-checkout (cone mode). Use for monorepos where the marketplace lives in a subdirectory. Example: [".claude-plugin", "plugins"]. If omitted, the full repository is cloned.')
    }), C.object({
        source: C.literal("npm"),
        package: g57().describe("NPM package containing marketplace.json")
    }), C.object({
        source: C.literal("file"),
        path: C.string().describe("Local file path to marketplace.json")
    }), C.object({
        source: C.literal("directory"),
        path: C.string().describe("Local directory containing .claude-plugin/marketplace.json")
    }), C.object({
        source: C.literal("hostPattern"),
        hostPattern: C.string().describe('Regex pattern to match the host/domain extracted from any marketplace source type. For github sources, matches against "github.com". For git sources (SSH or HTTPS), extracts the hostname from the URL. Use in strictKnownMarketplaces to allow all marketplaces from a specific host (e.g., "^github\\.mycompany\\.com$").')
    }), C.object({
        source: C.literal("pathPattern"),
        pathPattern: C.string().describe('Regex pattern matched against the .path field of file and directory sources. Use in strictKnownMarketplaces to allow filesystem-based marketplaces alongside hostPattern restrictions for network sources. Use ".*" to allow all filesystem paths, or a narrower pattern (e.g., "^/opt/approved/") to restrict to specific directories.')
    })])), P58 = F6(() => C.string().length(40).regex(/^[a-f0-9]{40}$/, "Must be a full 40-character lowercase git commit SHA")), Ww3 = F6(() => C.union([dQ().describe("Path to the plugin root, relative to the marketplace root (the directory containing .claude-plugin/, not .claude-plugin/ itself)"), C.object({
        source: C.literal("npm"),
        package: g57().or(C.string()).describe("Package name (or url, or local path, or anything else that can be passed to `npm` as a package)"),
        version: C.string().optional().describe("Specific version or version range (e.g., ^1.0.0, ~2.1.0)"),
        registry: C.string().url().optional().describe("Custom NPM registry URL (defaults to using system default, likely npmjs.org)")
    }).describe("NPM package as plugin source"), C.object({
        source: C.literal("pip"),
        package: C.string().describe("Python package name as it appears on PyPI"),
        version: C.string().optional().describe("Version specifier (e.g., ==1.0.0, >=2.0.0, <3.0.0)"),
        registry: C.string().url().optional().describe("Custom PyPI registry URL (defaults to using system default, likely pypi.org)")
    }).describe("Python package as plugin source"), C.object({
        source: C.literal("url"),
        url: C.string().describe("Full git repository URL (https:// or git@)"),
        ref: C.string().optional().describe('Git branch or tag to use (e.g., "main", "v1.0.0"). Defaults to repository default branch.'),
        sha: P58().optional().describe("Specific commit SHA to use")
    }), C.object({
        source: C.literal("github"),
        repo: C.string().describe("GitHub repository in owner/repo format"),
        ref: C.string().optional().describe('Git branch or tag to use (e.g., "main", "v1.0.0"). Defaults to repository default branch.'),
        sha: P58().optional().describe("Specific commit SHA to use")
    }), C.object({
        source: C.literal("git-subdir"),
        url: C.string().describe("Git repository: GitHub owner/repo shorthand, https://, or git@ URL"),
        path: C.string().min(1).describe('Subdirectory within the repo containing the plugin (e.g., "tools/claude-plugin"). Cloned sparsely using partial clone (--filter=tree:0) to minimize bandwidth for monorepos.'),
        ref: C.string().optional().describe('Git branch or tag to use (e.g., "main", "v1.0.0"). Defaults to repository default branch.'),
        sha: P58().optional().describe("Specific commit SHA to use")
    }).describe("Plugin located in a subdirectory of a larger repository (monorepo). Only the specified subdirectory is materialized; the rest of the repo is not downloaded.")]));
    G58 = F6(() => x46().partial().extend({
        name: C.string().min(1, "Plugin name cannot be empty").refine((A) => !A.includes(" "), {
            message: 'Plugin name cannot contain spaces. Use kebab-case (e.g., "my-plugin")'
        }).describe("Unique identifier matching the plugin name"),
        source: Ww3().describe("Where to fetch the plugin from"),
        category: C.string().optional().describe('Category for organizing plugins (e.g., "productivity", "development")'),
        tags: C.array(C.string()).optional().describe("Tags for searchability and discovery"),
        strict: C.boolean().optional().default(!0).describe("Require the plugin manifest to be present in the plugin folder. If false, the marketplace entry provides the manifest.")
    })), Vo = F6(() => C.object({
        name: C.string().min(1, "Marketplace must have a name").refine((A) => !A.includes(" "), {
            message: 'Marketplace name cannot contain spaces. Use kebab-case (e.g., "my-marketplace")'
        }).refine((A) => !A.includes("/") && !A.includes("\\") && !A.includes("..") && A !== ".", {
            message: 'Marketplace name cannot contain path separators (/ or \\), ".." sequences, or be "."'
        }).refine((A) => !Kw3(A), {
            message: 'Marketplace name cannot impersonate official Anthropic/Claude marketplaces. Names containing "official", "anthropic", or "claude" in official-sounding combinations are reserved.'
        }).refine((A) => A.toLowerCase() !== "inline", {
            message: 'Marketplace name "inline" is reserved for --plugin-dir session plugins'
        }),
        owner: m57().describe("Marketplace maintainer or curator information"),
        plugins: C.array(G58()).describe("Collection of available plugins in this marketplace"),
        forceRemoveDeletedPlugins: C.boolean().optional().describe("When true, plugins removed from this marketplace will be automatically uninstalled and flagged for users"),
        metadata: C.object({
            pluginRoot: C.string().optional().describe("Base path for relative plugin sources"),
            version: C.string().optional().describe("Marketplace version"),
            description: C.string().optional().describe("Marketplace description")
        }).optional().describe("Optional marketplace metadata")
    })), XJ6 = F6(() => C.string().regex(/^[a-z0-9][-a-z0-9._]*@[a-z0-9][-a-z0-9._]*$/i, "Plugin ID must be in format: plugin@marketplace")), Zw3 = F6(() => C.string().regex(/^[a-z0-9][-a-z0-9._]*(@[a-z0-9][-a-z0-9._]*)?$/i, "Dependency must be a plugin name, optionally qualified with @marketplace")), z0_ = F6(() => C.union([XJ6(), C.object({
        id: XJ6().describe('Plugin identifier (e.g., "formatter@tools")'),
        version: C.string().optional().describe('Version constraint (e.g., "^2.0.0")'),
        required: C.boolean().optional().describe("If true, cannot be disabled"),
        config: C.record(C.string(), C.unknown()).optional().describe("Plugin-specific configuration")
    })])), Gw3 = F6(() => C.object({
        version: C.string().describe("Currently installed version"),
        installedAt: C.string().describe("ISO 8601 timestamp of installation"),
        lastUpdated: C.string().optional().describe("ISO 8601 timestamp of last update"),
        installPath: C.string().describe("Absolute path to the installed plugin directory"),
        gitCommitSha: C.string().optional().describe("Git commit SHA for git-based plugins (for version tracking)")
    })), CC6 = F6(() => C.object({
        version: C.literal(1).describe("Schema version 1"),
        plugins: C.record(XJ6(), Gw3()).describe("Map of plugin IDs to their installation metadata")
    })), fw3 = F6(() => C.enum(["managed", "user", "project", "local"])), Tw3 = F6(() => C.object({
        scope: fw3().describe("Installation scope"),
        projectPath: C.string().optional().describe("Project path (required for project/local scopes)"),
        installPath: C.string().describe("Absolute path to the versioned plugin directory"),
        version: C.string().optional().describe("Currently installed version"),
        installedAt: C.string().optional().describe("ISO 8601 timestamp of installation"),
        lastUpdated: C.string().optional().describe("ISO 8601 timestamp of last update"),
        gitCommitSha: C.string().optional().describe("Git commit SHA for git-based plugins")
    })), IC6 = F6(() => C.object({
        version: C.literal(2).describe("Schema version 2"),
        plugins: C.record(XJ6(), C.array(Tw3())).describe("Map of plugin IDs to arrays of installation entries")
    })), _0_ = F6(() => C.union([CC6(), IC6()])), vw3 = F6(() => C.object({
        source: hC6().describe("Where to fetch the marketplace from"),
        installLocation: C.string().describe("Local cache path where marketplace manifest is stored"),
        lastUpdated: C.string().describe("ISO 8601 timestamp of last marketplace refresh"),
        autoUpdate: C.boolean().optional().describe("Whether to automatically update this marketplace and its installed plugins on startup")
    })), PJ6 = F6(() => C.record(C.string(), vw3()))
})
// @from(Ln 100050, Col 4)
Nw3
// @from(Ln 100050, Col 9)
Vw3
// @from(Ln 100050, Col 14)
F57
// @from(Ln 100051, Col 4)
p57 = E(() => {
    K7();
    Nw3 = F6(() => C.object({
        allowedDomains: C.array(C.string()).optional(),
        allowManagedDomainsOnly: C.boolean().optional().describe("When true (and set in managed settings), only allowedDomains and WebFetch(domain:...) allow rules from managed settings are respected. User, project, local, and flag settings domains are ignored. Denied domains are still respected from all sources."),
        allowUnixSockets: C.array(C.string()).optional().describe("macOS only: Unix socket paths to allow. Ignored on Linux (seccomp cannot filter by path)."),
        allowAllUnixSockets: C.boolean().optional().describe("If true, allow all Unix sockets (disables blocking on both platforms)."),
        allowLocalBinding: C.boolean().optional(),
        httpProxyPort: C.number().optional(),
        socksProxyPort: C.number().optional()
    }).optional()), Vw3 = F6(() => C.object({
        allowWrite: C.array(C.string()).optional().describe("Additional paths to allow writing within the sandbox. Merged with paths from Edit(...) allow permission rules."),
        denyWrite: C.array(C.string()).optional().describe("Additional paths to deny writing within the sandbox. Merged with paths from Edit(...) deny permission rules."),
        denyRead: C.array(C.string()).optional().describe("Additional paths to deny reading within the sandbox. Merged with paths from Read(...) deny permission rules.")
    }).optional()), F57 = F6(() => C.object({
        enabled: C.boolean().optional(),
        autoAllowBashIfSandboxed: C.boolean().optional(),
        allowUnsandboxedCommands: C.boolean().optional().describe("Allow commands to run outside the sandbox via the dangerouslyDisableSandbox parameter. When false, the dangerouslyDisableSandbox parameter is completely ignored and all commands must run sandboxed. Default: true."),
        network: Nw3(),
        filesystem: Vw3(),
        ignoreViolations: C.record(C.string(), C.array(C.string())).optional(),
        enableWeakerNestedSandbox: C.boolean().optional(),
        enableWeakerNetworkIsolation: C.boolean().optional().describe("macOS only: Allow access to com.apple.trustd.agent in the sandbox. Needed for Go-based CLI tools (gh, gcloud, terraform, etc.) to verify TLS certificates when using httpProxyPort with a MITM proxy and custom CA. " + "**Reduces security** — opens a potential data exfiltration vector through the trustd service. Default: false"),
        excludedCommands: C.array(C.string()).optional(),
        ripgrep: C.object({
            command: C.string(),
            args: C.array(C.string()).optional()
        }).optional().describe("Custom ripgrep configuration for bundled ripgrep support")
    }).passthrough())
})
// @from(Ln 100082, Col 0)
function WJ6(A) {
    return "serverName" in A && A.serverName !== void 0
}
// @from(Ln 100086, Col 0)
function x31(A) {
    return "serverCommand" in A && A.serverCommand !== void 0
}
// @from(Ln 100090, Col 0)
function u31(A) {
    return "serverUrl" in A && A.serverUrl !== void 0
}
// @from(Ln 100093, Col 4)
kw3
// @from(Ln 100093, Col 9)
Ew3
// @from(Ln 100093, Col 14)
yw3
// @from(Ln 100093, Col 19)
Lw3
// @from(Ln 100093, Col 24)
Rw3
// @from(Ln 100093, Col 29)
oD
// @from(Ln 100094, Col 4)
jC = E(() => {
    K7();
    rD();
    M58();
    O2();
    IW();
    p57();
    I31();
    I31();
    kw3 = F6(() => C.record(C.string(), C.coerce.string())), Ew3 = F6(() => C.object({
        allow: C.array(C31()).optional().describe("List of permission rules for allowed operations"),
        deny: C.array(C31()).optional().describe("List of permission rules for denied operations"),
        ask: C.array(C31()).optional().describe("List of permission rules that should always prompt for confirmation"),
        defaultMode: C.enum(CW).optional().describe("Default permission mode when Claude Code needs access"),
        disableBypassPermissionsMode: C.enum(["disable"]).optional().describe("Disable the ability to bypass permission prompts"),
        ...{
            disableAutoMode: C.enum(["disable"]).optional().describe("Disable auto mode")
        },
        additionalDirectories: C.array(C.string()).optional().describe("Additional directories to include in the permission scope")
    }).passthrough()), yw3 = F6(() => C.object({
        source: hC6().describe("Where to fetch the marketplace from"),
        installLocation: C.string().optional().describe("Local cache path where marketplace manifest is stored (auto-generated if not provided)"),
        autoUpdate: C.boolean().optional().describe("Whether to automatically update this marketplace and its installed plugins on startup")
    })), Lw3 = F6(() => C.object({
        serverName: C.string().regex(/^[a-zA-Z0-9_-]+$/, "Server name can only contain letters, numbers, hyphens, and underscores").optional().describe("Name of the MCP server that users are allowed to configure"),
        serverCommand: C.array(C.string()).min(1, "Server command must have at least one element (the command)").optional().describe("Command array [command, ...args] to match exactly for allowed stdio servers"),
        serverUrl: C.string().optional().describe('URL pattern with wildcard support (e.g., "https://*.example.com/*") for allowed remote MCP servers')
    }).refine((A) => {
        return [A.serverName !== void 0, A.serverCommand !== void 0, A.serverUrl !== void 0].filter(Boolean).length === 1
    }, {
        message: 'Entry must have exactly one of "serverName", "serverCommand", or "serverUrl"'
    })), Rw3 = F6(() => C.object({
        serverName: C.string().regex(/^[a-zA-Z0-9_-]+$/, "Server name can only contain letters, numbers, hyphens, and underscores").optional().describe("Name of the MCP server that is explicitly blocked"),
        serverCommand: C.array(C.string()).min(1, "Server command must have at least one element (the command)").optional().describe("Command array [command, ...args] to match exactly for blocked stdio servers"),
        serverUrl: C.string().optional().describe('URL pattern with wildcard support (e.g., "https://*.example.com/*") for blocked remote MCP servers')
    }).refine((A) => {
        return [A.serverName !== void 0, A.serverCommand !== void 0, A.serverUrl !== void 0].filter(Boolean).length === 1
    }, {
        message: 'Entry must have exactly one of "serverName", "serverCommand", or "serverUrl"'
    })), oD = F6(() => C.object({
        $schema: C.literal(J57).optional().describe("JSON Schema reference for Claude Code settings"),
        apiKeyHelper: C.string().optional().describe("Path to a script that outputs authentication values"),
        awsCredentialExport: C.string().optional().describe("Path to a script that exports AWS credentials"),
        awsAuthRefresh: C.string().optional().describe("Path to a script that refreshes AWS authentication"),
        gcpAuthRefresh: C.string().optional().describe("Command to refresh GCP authentication (e.g., gcloud auth application-default login)"),
        fileSuggestion: C.object({
            type: C.literal("command"),
            command: C.string()
        }).optional().describe("Custom file suggestion configuration for @ mentions"),
        respectGitignore: C.boolean().optional().describe("Whether file picker should respect .gitignore files (default: true). Note: .ignore files are always respected."),
        cleanupPeriodDays: C.number().nonnegative().int().optional().describe("Number of days to retain chat transcripts (default: 30). Setting to 0 disables session persistence entirely: no transcripts are written and existing transcripts are deleted at startup."),
        env: kw3().optional().describe("Environment variables to set for Claude Code sessions"),
        attribution: C.object({
            commit: C.string().optional().describe("Attribution text for git commits, including any trailers. Empty string hides attribution."),
            pr: C.string().optional().describe("Attribution text for pull request descriptions. Empty string hides attribution.")
        }).optional().describe("Customize attribution text for commits and PRs. Each field defaults to the standard Claude Code attribution if not set."),
        includeCoAuthoredBy: C.boolean().optional().describe("Deprecated: Use attribution instead. Whether to include Claude's co-authored by attribution in commits and PRs (defaults to true)"),
        includeGitInstructions: C.boolean().optional().describe("Include built-in commit and PR workflow instructions in Claude's system prompt (default: true)"),
        permissions: Ew3().optional().describe("Tool usage permissions configuration"),
        model: C.string().optional().describe("Override the default model used by Claude Code"),
        availableModels: C.array(C.string()).optional().describe('Allowlist of models that users can select. Accepts family aliases ("opus" allows any opus version), version prefixes ("opus-4-5" allows only that version), and full model IDs. If undefined, all models are available. If empty array, only the default model is available. Typically set in managed settings by enterprise administrators.'),
        modelOverrides: C.record(C.string(), C.string()).optional().describe('Override mapping from Anthropic model ID (e.g. "claude-opus-4-6") to provider-specific model ID (e.g. a Bedrock inference profile ARN). Typically set in managed settings by enterprise administrators.'),
        enableAllProjectMcpServers: C.boolean().optional().describe("Whether to automatically approve all MCP servers in the project"),
        enabledMcpjsonServers: C.array(C.string()).optional().describe("List of approved MCP servers from .mcp.json"),
        disabledMcpjsonServers: C.array(C.string()).optional().describe("List of rejected MCP servers from .mcp.json"),
        allowedMcpServers: C.array(Lw3()).optional().describe("Enterprise allowlist of MCP servers that can be used. Applies to all scopes including enterprise servers from managed-mcp.json. If undefined, all servers are allowed. If empty array, no servers are allowed. Denylist takes precedence - if a server is on both lists, it is denied."),
        deniedMcpServers: C.array(Rw3()).optional().describe("Enterprise denylist of MCP servers that are explicitly blocked. If a server is on the denylist, it will be blocked across all scopes including enterprise. Denylist takes precedence over allowlist - if a server is on both lists, it is denied."),
        hooks: ty().optional().describe("Custom commands to run before/after tool executions"),
        worktree: C.object({
            symlinkDirectories: C.array(C.string()).optional().describe('Directories to symlink from main repository to worktrees to avoid disk bloat. Must be explicitly configured - no directories are symlinked by default. Common examples: "node_modules", ".cache", ".bin"'),
            sparsePaths: C.array(C.string()).optional().describe("Directories to include when creating worktrees, via git sparse-checkout (cone mode). " + "Dramatically faster in large monorepos — only the listed paths are written to disk.")
        }).optional().describe("Git worktree configuration for --worktree flag."),
        disableAllHooks: C.boolean().optional().describe("Disable all hooks and statusLine execution"),
        allowManagedHooksOnly: C.boolean().optional().describe("When true (and set in managed settings), only hooks from managed settings run. User, project, and local hooks are ignored."),
        allowedHttpHookUrls: C.array(C.string()).optional().describe('Allowlist of URL patterns that HTTP hooks may target. Supports * as a wildcard (e.g. "https://hooks.example.com/*"). When set, HTTP hooks with non-matching URLs are blocked. If undefined, all URLs are allowed. If empty array, no HTTP hooks are allowed. Arrays merge across settings sources (same semantics as allowedMcpServers).'),
        httpHookAllowedEnvVars: C.array(C.string()).optional().describe("Allowlist of environment variable names HTTP hooks may interpolate into headers. When set, each hook's effective allowedEnvVars is the intersection with this list. If undefined, no restriction is applied. Arrays merge across settings sources (same semantics as allowedMcpServers)."),
        allowManagedPermissionRulesOnly: C.boolean().optional().describe("When true (and set in managed settings), only permission rules (allow/deny/ask) from managed settings are respected. User, project, local, and CLI argument permission rules are ignored."),
        allowManagedMcpServersOnly: C.boolean().optional().describe("When true (and set in managed settings), allowedMcpServers is only read from managed settings. deniedMcpServers still merges from all sources, so users can deny servers for themselves. Users can still add their own MCP servers, but only the admin-defined allowlist applies."),
        statusLine: C.object({
            type: C.literal("command"),
            command: C.string(),
            padding: C.number().optional()
        }).optional().describe("Custom status line display configuration"),
        enabledPlugins: C.record(C.string(), C.union([C.array(C.string()), C.boolean(), C.undefined()])).optional().describe('Enabled plugins using plugin-id@marketplace-id format. Example: { "formatter@anthropic-tools": true }. Also supports extended format with version constraints.'),
        extraKnownMarketplaces: C.record(C.string(), yw3()).optional().describe("Additional marketplaces to make available for this repository. Typically used in repository .claude/settings.json to ensure team members have required plugin sources."),
        strictKnownMarketplaces: C.array(hC6()).optional().describe("Enterprise strict list of allowed marketplace sources. When set in managed settings, ONLY these exact sources can be added as marketplaces. The check happens BEFORE downloading, so blocked sources never touch the filesystem. " + "Note: this is a policy gate only — it does NOT register marketplaces. " + "To pre-register allowed marketplaces for users, also set extraKnownMarketplaces."),
        blockedMarketplaces: C.array(hC6()).optional().describe("Enterprise blocklist of marketplace sources. When set in managed settings, these exact sources are blocked from being added as marketplaces. The check happens BEFORE downloading, so blocked sources never touch the filesystem."),
        forceLoginMethod: C.enum(["claudeai", "console"]).optional().describe('Force a specific login method: "claudeai" for Claude Pro/Max, "console" for Console billing'),
        forceLoginOrgUUID: C.string().optional().describe("Organization UUID to use for OAuth login"),
        otelHeadersHelper: C.string().optional().describe("Path to a script that outputs OpenTelemetry headers"),
        outputStyle: C.string().optional().describe("Controls the output style for assistant responses"),
        language: C.string().optional().describe('Preferred language for Claude responses and voice dictation (e.g., "japanese", "spanish")'),
        skipWebFetchPreflight: C.boolean().optional().describe("Skip the WebFetch blocklist check for enterprise environments with restrictive security policies"),
        sandbox: F57().optional(),
        feedbackSurveyRate: C.number().min(0).max(1).optional().describe("Probability (0–1) that the session quality survey appears when eligible. 0.05 is a reasonable starting point."),
        spinnerTipsEnabled: C.boolean().optional().describe("Whether to show tips in the spinner"),
        spinnerVerbs: C.object({
            mode: C.enum(["append", "replace"]),
            verbs: C.array(C.string())
        }).optional().describe('Customize spinner verbs. mode: "append" adds verbs to defaults, "replace" uses only your verbs.'),
        spinnerTipsOverride: C.object({
            excludeDefault: C.boolean().optional(),
            tips: C.array(C.string())
        }).optional().describe("Override spinner tips. tips: array of tip strings. excludeDefault: if true, only show custom tips (default: false)."),
        syntaxHighlightingDisabled: C.boolean().optional().describe("Whether to disable syntax highlighting in diffs"),
        terminalTitleFromRename: C.boolean().optional().describe("Whether /rename updates the terminal tab title (defaults to true). Set to false to keep auto-generated topic titles."),
        alwaysThinkingEnabled: C.boolean().optional().describe("When false, thinking is disabled. When absent or true, thinking is enabled automatically for supported models."),
        effortLevel: C.enum(["low", "medium", "high"]).optional().catch(void 0).describe("Persisted effort level for supported models."),
        fastMode: C.boolean().optional().describe("When true, fast mode is enabled. When absent or false, fast mode is off."),
        fastModePerSessionOptIn: C.boolean().optional().describe("When true, fast mode does not persist across sessions. Each session starts with fast mode off."),
        promptSuggestionEnabled: C.boolean().optional().describe("When false, prompt suggestions are disabled. When absent or true, prompt suggestions are enabled."),
        agent: C.string().optional().describe("Name of an agent (built-in or custom) to use for the main thread. Applies the agent's system prompt, tool restrictions, and model."),
        companyAnnouncements: C.array(C.string()).optional().describe("Company announcements to display at startup (one will be randomly selected if multiple are provided)"),
        pluginConfigs: C.record(C.string(), C.object({
            mcpServers: C.record(C.string(), C.record(C.string(), C.union([C.string(), C.number(), C.boolean(), C.array(C.string())]))).optional().describe("User configuration values for MCP servers keyed by server name"),
            options: C.record(C.string(), C.union([C.string(), C.number(), C.boolean(), C.array(C.string())])).optional().describe("Non-sensitive option values from plugin manifest userConfig, keyed by option name. Sensitive values go to secure storage instead.")
        })).optional().describe("Per-plugin configuration including MCP server user configs, keyed by plugin ID (plugin@marketplace format)"),
        remote: C.object({
            defaultEnvironmentId: C.string().optional().describe("Default environment ID to use for remote sessions")
        }).optional().describe("Remote session configuration"),
        autoUpdatesChannel: C.enum(["latest", "stable"]).optional().describe("Release channel for auto-updates (latest or stable)"),
        minimumVersion: C.string().optional().describe("Minimum version to stay on - prevents downgrades when switching to stable channel"),
        plansDirectory: C.string().optional().describe("Custom directory for plan files, relative to project root. If not set, defaults to ~/.claude/plans/"),
        ...{},
        ...{},
        ...{
            voiceEnabled: C.boolean().optional().describe("Enable voice mode (hold-to-talk dictation)")
        },
        ...{},
        ...{
            defaultView: C.enum(["chat", "transcript"]).optional().describe("Default transcript view: chat (SendUserMessage checkpoints only) or transcript (full)")
        },
        prefersReducedMotion: C.boolean().optional().describe("Reduce or disable animations for accessibility (spinner shimmer, flash effects, etc.)"),
        autoMemoryEnabled: C.boolean().optional().describe("Enable auto-memory for this project. When false, Claude will not read from or write to the auto-memory directory."),
        autoMemoryDirectory: C.string().optional().describe("Custom directory path for auto-memory storage. Supports ~/ prefix for home directory expansion. Ignored if set in projectSettings (checked-in .claude/settings.json) for security. When unset, defaults to ~/.claude/projects/<sanitized-cwd>/memory/."),
        showThinkingSummaries: C.boolean().optional().describe("Show thinking summaries in the transcript view (ctrl+o). Default: false."),
        skipDangerousModePermissionPrompt: C.boolean().optional().describe("Whether the user has accepted the bypass permissions mode dialog"),
        ...{
            skipAutoPermissionPrompt: C.boolean().optional().describe("Whether the user has accepted the auto mode opt-in dialog"),
            autoMode: C.object({
                allow: C.array(C.string()).optional().describe("Rules for the auto mode classifier allow section"),
                deny: C.array(C.string()).optional().describe("Rules for the auto mode classifier deny section"),
                environment: C.array(C.string()).optional().describe("Entries for the auto mode classifier environment section")
            }).optional().describe("Auto mode classifier prompt customization")
        },
        disableAutoMode: C.enum(["disable"]).optional().describe("Disable auto mode"),
        sshConfigs: C.array(C.object({
            id: C.string().describe("Unique identifier for this SSH config. Used to match configs across settings sources."),
            name: C.string().describe("Display name for the SSH connection"),
            sshHost: C.string().describe('SSH host in format "user@hostname" or "hostname", or a host alias from ~/.ssh/config'),
            sshPort: C.number().int().optional().describe("SSH port (default: 22)"),
            sshIdentityFile: C.string().optional().describe("Path to SSH identity file (private key)"),
            startDirectory: C.string().optional().describe("Default working directory on the remote host. Supports tilde expansion (e.g. ~/projects). If not specified, defaults to the remote user home directory. Can be overridden by the [dir] positional argument in `claude ssh <config> [dir]`.")
        })).optional().describe("SSH connection configurations for remote environments. Typically set in managed settings by enterprise administrators to pre-configure SSH connections for team members."),
        claudeMdExcludes: C.array(C.string()).optional().describe('Glob patterns or absolute paths of CLAUDE.md files to exclude from loading. Patterns are matched against absolute file paths using picomatch. Only applies to User, Project, and Local memory types (Managed/policy files cannot be excluded). Examples: "/home/user/monorepo/CLAUDE.md", "**/code/CLAUDE.md", "**/some-dir/.claude/rules/**"'),
        pluginTrustMessage: C.string().optional().describe('Custom message to append to the plugin trust warning shown before installation. Only read from policy settings (managed-settings.json / MDM). Useful for enterprise administrators to add organization-specific context (e.g., "All plugins from our internal marketplace are vetted and approved.").')
    }).passthrough())
})
// @from(Ln 100258, Col 0)
async function bC6(A, q, K, Y) {
    try {
        let z = await hw3(Sw3(A, "config"), "utf-8");
        return Cw3(z, q, K, Y)
    } catch {
        return null
    }
}
// @from(Ln 100267, Col 0)
function Cw3(A, q, K, Y) {
    let z = A.split(`
`),
        _ = q.toLowerCase(),
        w = Y.toLowerCase(),
        O = !1;
    for (let $ of z) {
        let H = $.trim();
        if (H.length === 0 || H[0] === "#" || H[0] === ";") continue;
        if (H[0] === "[") {
            O = uw3(H, _, K);
            continue
        }
        if (!O) continue;
        let j = Iw3(H);
        if (j && j.key.toLowerCase() === w) return j.value
    }
    return null
}
// @from(Ln 100287, Col 0)
function Iw3(A) {
    let q = 0;
    while (q < A.length && mw3(A[q])) q++;
    if (q === 0) return null;
    let K = A.slice(0, q);
    while (q < A.length && (A[q] === " " || A[q] === "\t")) q++;
    if (q >= A.length || A[q] !== "=") return null;
    q++;
    while (q < A.length && (A[q] === " " || A[q] === "\t")) q++;
    let Y = bw3(A, q);
    return {
        key: K,
        value: Y
    }
}
// @from(Ln 100303, Col 0)
function bw3(A, q) {
    let K = "",
        Y = !1,
        z = q;
    while (z < A.length) {
        let _ = A[z];
        if (!Y && (_ === "#" || _ === ";")) break;
        if (_ === '"') {
            Y = !Y, z++;
            continue
        }
        if (_ === "\\" && z + 1 < A.length) {
            let w = A[z + 1];
            if (Y) {
                switch (w) {
                    case "n":
                        K += `
`;
                        break;
                    case "t":
                        K += "\t";
                        break;
                    case "b":
                        K += "\b";
                        break;
                    case '"':
                        K += '"';
                        break;
                    case "\\":
                        K += "\\";
                        break;
                    default:
                        K += w;
                        break
                }
                z += 2;
                continue
            }
            if (w === "\\") {
                K += "\\", z += 2;
                continue
            }
        }
        K += _, z++
    }
    if (!Y) K = xw3(K);
    return K
}
// @from(Ln 100352, Col 0)
function xw3(A) {
    let q = A.length;
    while (q > 0 && (A[q - 1] === " " || A[q - 1] === "\t")) q--;
    return A.slice(0, q)
}
// @from(Ln 100358, Col 0)
function uw3(A, q, K) {
    let Y = 1;
    while (Y < A.length && A[Y] !== "]" && A[Y] !== " " && A[Y] !== "\t" && A[Y] !== '"') Y++;
    if (A.slice(1, Y).toLowerCase() !== q) return !1;
    if (K === null) return Y < A.length && A[Y] === "]";
    while (Y < A.length && (A[Y] === " " || A[Y] === "\t")) Y++;
    if (Y >= A.length || A[Y] !== '"') return !1;
    Y++;
    let _ = "";
    while (Y < A.length && A[Y] !== '"') {
        if (A[Y] === "\\" && Y + 1 < A.length) {
            let w = A[Y + 1];
            if (w === "\\" || w === '"') {
                _ += w, Y += 2;
                continue
            }
            _ += w, Y += 2;
            continue
        }
        _ += A[Y], Y++
    }
    if (Y >= A.length || A[Y] !== '"') return !1;
    if (Y++, Y >= A.length || A[Y] !== "]") return !1;
    return _ === K
}
// @from(Ln 100384, Col 0)
function mw3(A) {
    return A >= "a" && A <= "z" || A >= "A" && A <= "Z" || A >= "0" && A <= "9" || A === "-"
}
// @from(Ln 100387, Col 4)
Q57 = () => {}
// @from(Ln 100402, Col 0)
function l57() {
    ZJ6.clear()
}
// @from(Ln 100405, Col 0)
async function rT(A) {
    let q = m31(A ?? G1()),
        K = ZJ6.get(q);
    if (K !== void 0) return K;
    let Y = H_(q);
    if (!Y) return ZJ6.set(q, null), null;
    let z = ey(Y, ".git");
    try {
        if ((await c57(z)).isFile()) {
            let w = (await u46(z, "utf-8")).trim();
            if (w.startsWith("gitdir:")) {
                let O = w.slice(7).trim(),
                    $ = m31(Y, O);
                return ZJ6.set(q, $), $
            }
        }
        return ZJ6.set(q, z), z
    } catch {
        return ZJ6.set(q, null), null
    }
}
// @from(Ln 100426, Col 0)
async function xC6(A) {
    try {
        let q = (await u46(ey(A, "HEAD"), "utf-8")).trim();
        if (q.startsWith("ref:")) {
            let K = q.slice(4).trim();
            if (K.startsWith("refs/heads/")) return {
                type: "branch",
                name: K.slice(11)
            };
            let Y = await Eo(A, K);
            return Y ? {
                type: "detached",
                sha: Y
            } : {
                type: "detached",
                sha: ""
            }
        }
        return {
            type: "detached",
            sha: q
        }
    } catch {
        return null
    }
}
// @from(Ln 100452, Col 0)
async function Eo(A, q) {
    let K = await d57(A, q);
    if (K) return K;
    let Y = await f58(A);
    if (Y && Y !== A) return d57(Y, q);
    return null
}
// @from(Ln 100459, Col 0)
async function d57(A, q) {
    try {
        let K = (await u46(ey(A, q), "utf-8")).trim();
        if (K.startsWith("ref:")) return Eo(A, K.slice(4).trim());
        return K
    } catch {}
    try {
        let K = await u46(ey(A, "packed-refs"), "utf-8");
        for (let Y of K.split(`
`)) {
            if (Y.startsWith("#") || Y.startsWith("^")) continue;
            let z = Y.indexOf(" ");
            if (z === -1) continue;
            if (Y.slice(z + 1) === q) return Y.slice(0, z)
        }
    } catch {}
    return null
}
// @from(Ln 100477, Col 0)
async function f58(A) {
    try {
        let q = (await u46(ey(A, "commondir"), "utf-8")).trim();
        return m31(A, q)
    } catch {
        return null
    }
}
// @from(Ln 100485, Col 0)
async function Fw3(A, q, K) {
    try {
        let Y = (await u46(ey(A, q), "utf-8")).trim();
        if (Y.startsWith("ref:")) {
            let z = Y.slice(4).trim();
            if (z.startsWith(K)) return z.slice(K.length)
        }
    } catch {}
    return null
}
// @from(Ln 100495, Col 0)
class i57 {
    gitDir = null;
    initialized = !1;
    initPromise = null;
    watchedPaths = [];
    branchRefPath = null;
    cache = new Map;
    async ensureStarted() {
        if (this.initialized) return;
        if (this.initPromise) return this.initPromise;
        return this.initPromise = this.start(), this.initPromise
    }
    async start() {
        if (this.gitDir = await rT(), this.initialized = !0, !this.gitDir) return;
        this.watchPath(ey(this.gitDir, "HEAD"), () => {
            this.onHeadChanged()
        }), this.watchPath(ey(this.gitDir, "config"), () => {
            this.invalidate()
        }), await this.watchCurrentBranchRef(), E4(async () => {
            this.stopWatching()
        })
    }
    watchPath(A, q) {
        this.watchedPaths.push(A), Bw3(A, {
            interval: pw3
        }, q)
    }
    async watchCurrentBranchRef() {
        if (!this.gitDir) return;
        let A = await xC6(this.gitDir);
        if (!A || A.type !== "branch") return;
        let q = ey(this.gitDir, "refs", "heads", A.name);
        if (q === this.branchRefPath) return;
        if (this.branchRefPath) U57(this.branchRefPath), this.watchedPaths = this.watchedPaths.filter((K) => K !== this.branchRefPath);
        this.branchRefPath = q, this.watchPath(q, () => {
            this.invalidate()
        })
    }
    async onHeadChanged() {
        await this.watchCurrentBranchRef(), this.invalidate()
    }
    invalidate() {
        for (let A of this.cache.values()) A.dirty = !0
    }
    stopWatching() {
        for (let A of this.watchedPaths) U57(A);
        this.watchedPaths = [], this.branchRefPath = null
    }
    async get(A, q) {
        await this.ensureStarted();
        let K = this.cache.get(A);
        if (K && !K.dirty) return K.value;
        if (K) K.dirty = !1;
        let Y = await q(),
            z = this.cache.get(A);
        if (z && !z.dirty) z.value = Y;
        if (!z) this.cache.set(A, {
            value: Y,
            dirty: !1,
            compute: q
        });
        return Y
    }
    reset() {
        this.stopWatching(), this.cache.clear(), this.initialized = !1, this.initPromise = null, this.gitDir = null
    }
}
// @from(Ln 100562, Col 0)
async function Qw3() {
    let A = await rT();
    if (!A) return "HEAD";
    let q = await xC6(A);
    if (!q) return "HEAD";
    return q.type === "branch" ? q.name : "HEAD"
}
// @from(Ln 100569, Col 0)
async function Uw3() {
    let A = await rT();
    if (!A) return "";
    let q = await xC6(A);
    if (!q) return "";
    if (q.type === "branch") return await Eo(A, `refs/heads/${q.name}`) ?? "";
    return q.sha
}
// @from(Ln 100577, Col 0)
async function dw3() {
    let A = await rT();
    if (!A) return null;
    let q = await bC6(A, "remote", "origin", "url");
    if (q) return q;
    let K = await f58(A);
    if (K && K !== A) return bC6(K, "remote", "origin", "url");
    return null
}
// @from(Ln 100586, Col 0)
async function cw3() {
    let A = await rT();
    if (!A) return "main";
    let q = await Fw3(A, "refs/remotes/origin/HEAD", "refs/remotes/origin/");
    if (q) return q;
    for (let K of ["main", "master"])
        if (await Eo(A, `refs/remotes/origin/${K}`)) return K;
    return "main"
}
// @from(Ln 100596, Col 0)
function n57() {
    return B31.get("branch", Qw3)
}
// @from(Ln 100600, Col 0)
function r57() {
    return B31.get("head", Uw3)
}
// @from(Ln 100604, Col 0)
function o57() {
    return B31.get("remoteUrl", dw3)
}
// @from(Ln 100608, Col 0)
function a57() {
    return B31.get("defaultBranch", cw3)
}
// @from(Ln 100611, Col 0)
async function g31(A) {
    let q = await rT(A);
    if (!q) return null;
    let K = await xC6(q);
    if (!K) return null;
    if (K.type === "branch") return Eo(q, `refs/heads/${K.name}`);
    return K.sha
}
// @from(Ln 100619, Col 0)
async function s57(A) {
    let q;
    try {
        let Y = (await u46(ey(A, ".git"), "utf-8")).trim();
        if (!Y.startsWith("gitdir:")) return null;
        q = m31(A, Y.slice(7).trim())
    } catch {
        return null
    }
    let K = await xC6(q);
    if (!K) return null;
    if (K.type === "branch") return Eo(q, `refs/heads/${K.name}`);
    return K.sha
}
// @from(Ln 100633, Col 0)
async function F31(A) {
    let q = await rT(A);
    if (!q) return null;
    let K = await bC6(q, "remote", "origin", "url");
    if (K) return K;
    let Y = await f58(q);
    if (Y && Y !== q) return bC6(Y, "remote", "origin", "url");
    return null
}
// @from(Ln 100642, Col 0)
async function t57() {
    let A = await rT();
    if (!A) return !1;
    try {
        return await c57(ey(A, "shallow")), !0
    } catch {
        return !1
    }
}
// @from(Ln 100651, Col 0)
async function e57() {
    try {
        let A = await rT();
        if (!A) return 0;
        return (await gw3(ey(A, "worktrees"))).length + 1
    } catch {
        return 1
    }
}
// @from(Ln 100660, Col 4)
ZJ6
// @from(Ln 100660, Col 9)
pw3 = 1000
// @from(Ln 100661, Col 4)
B31
// @from(Ln 100662, Col 4)
yo = E(() => {
    $5();
    lA();
    KY();
    Q57();
    ZJ6 = new Map;
    B31 = new i57
})
// @from(Ln 100671, Col 0)
function p31(A) {
    let q = A.slice(A.lastIndexOf(".")).toLowerCase();
    return lw3.has(q)
}
// @from(Ln 100676, Col 0)
function A37(A) {
    let q = Math.min(A.length, iw3),
        K = 0;
    for (let Y = 0; Y < q; Y++) {
        let z = A[Y];
        if (z === 0) return !0;
        if (z < 32 && z !== 9 && z !== 10 && z !== 13) K++
    }
    return K / q > 0.1
}
// @from(Ln 100686, Col 4)
lw3
// @from(Ln 100686, Col 9)
iw3 = 8192
// @from(Ln 100687, Col 4)
T58 = E(() => {
    lw3 = new Set([".png", ".jpg", ".jpeg", ".gif", ".bmp", ".ico", ".webp", ".tiff", ".tif", ".mp4", ".mov", ".avi", ".mkv", ".webm", ".wmv", ".flv", ".m4v", ".mpeg", ".mpg", ".mp3", ".wav", ".ogg", ".flac", ".aac", ".m4a", ".wma", ".aiff", ".opus", ".zip", ".tar", ".gz", ".bz2", ".7z", ".rar", ".xz", ".z", ".tgz", ".iso", ".exe", ".dll", ".so", ".dylib", ".bin", ".o", ".a", ".obj", ".lib", ".app", ".msi", ".deb", ".rpm", ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".odt", ".ods", ".odp", ".ttf", ".otf", ".woff", ".woff2", ".eot", ".pyc", ".pyo", ".class", ".jar", ".war", ".ear", ".node", ".wasm", ".rlib", ".sqlite", ".sqlite3", ".db", ".mdb", ".idx", ".psd", ".ai", ".eps", ".sketch", ".fig", ".xd", ".blend", ".3ds", ".max", ".swf", ".fla", ".lockb", ".dat", ".data"])
})
// @from(Ln 100690, Col 4)
gC6 = {}
// @from(Ln 100700, Col 0)
function v58() {
    fJ6.clear(), GJ6.clear()
}
// @from(Ln 100703, Col 0)
async function cQ() {
    let A = await uC6();
    if (!A) return null;
    if (A.host !== "github.com") return null;
    return `${A.owner}/${A.name}`
}
// @from(Ln 100709, Col 0)
async function uC6() {
    let A = G1();
    if (GJ6.has(A)) return GJ6.get(A) ?? null;
    try {
        let q = await Lo();
        if (k(`Git remote URL: ${q}`), !q) return k("No git remote URL found"), GJ6.set(A, null), fJ6.set(A, null), null;
        let K = BC6(q);
        if (k(`Parsed repository: ${K?`${K.host}/${K.owner}/${K.name}`:null} from URL: ${q}`), GJ6.set(A, K), K && K.host === "github.com") fJ6.set(A, `${K.owner}/${K.name}`);
        else fJ6.set(A, null);
        return K
    } catch (q) {
        return k(`Error detecting repository: ${q}`), GJ6.set(A, null), fJ6.set(A, null), null
    }
}
// @from(Ln 100724, Col 0)
function mC6() {
    return fJ6.get(G1()) ?? null
}
// @from(Ln 100728, Col 0)
function BC6(A) {
    let q = A.trim(),
        K = q.match(/^git@([^:]+):([^/]+)\/([^/]+?)(?:\.git)?$/);
    if (K?.[1] && K[2] && K[3]) {
        if (!q37(K[1])) return null;
        return {
            host: K[1],
            owner: K[2],
            name: K[3]
        }
    }
    let Y = q.match(/^(https?|ssh|git):\/\/(?:[^@]+@)?([^/:]+(?::\d+)?)\/([^/]+)\/([^/]+?)(?:\.git)?$/);
    if (Y?.[1] && Y[2] && Y[3] && Y[4]) {
        let z = Y[1],
            _ = Y[2],
            w = _.split(":")[0] ?? "";
        if (!q37(w)) return null;
        return {
            host: z === "https" || z === "http" ? _ : w,
            owner: Y[3],
            name: Y[4]
        }
    }
    return null
}
// @from(Ln 100754, Col 0)
function m46(A) {
    let q = A.trim(),
        K = BC6(q);
    if (K) {
        if (K.host !== "github.com") return null;
        return `${K.owner}/${K.name}`
    }
    if (!q.includes("://") && !q.includes("@") && q.includes("/")) {
        let Y = q.split("/");
        if (Y.length === 2 && Y[0] && Y[1]) {
            let z = Y[1].replace(/\.git$/, "");
            return `${Y[0]}/${z}`
        }
    }
    return k(`Could not parse repository from: ${q}`), null
}
// @from(Ln 100771, Col 0)
function q37(A) {
    if (!A.includes(".")) return !1;
    let q = A.split(".").pop();
    if (!q) return !1;
    return /^[a-zA-Z]+$/.test(q)
}
// @from(Ln 100777, Col 4)
fJ6
// @from(Ln 100777, Col 9)
GJ6
// @from(Ln 100778, Col 4)
yG = E(() => {
    $5();
    H1();
    lA();
    fJ6 = new Map, GJ6 = new Map
})
// @from(Ln 100784, Col 4)
h58 = {}
// @from(Ln 100835, Col 0)
function tw3() {
    function A(q) {
        let K = w37(q);
        return K === M37 ? null : K
    }
    return A.cache = w37.cache, A
}
// @from(Ln 100843, Col 0)
function ew3() {
    function A(q) {
        let K = H_(q);
        if (!K) return null;
        return O37(K)
    }
    return A.cache = O37.cache, A
}
// @from(Ln 100852, Col 0)
function V58(A) {
    return rT(A)
}
// @from(Ln 100855, Col 0)
async function AO3() {
    let A = G1(),
        q = H_(A);
    if (!q) return !1;
    try {
        let [K, Y] = await Promise.all([z37(A), z37(q)]);
        return K === Y
    } catch {
        return A === q
    }
}
// @from(Ln 100867, Col 0)
function X37(A) {
    let q = A.trim();
    if (!q) return null;
    let K = q.match(/^git@([^:]+):(.+?)(?:\.git)?$/);
    if (K && K[1] && K[2]) return `${K[1]}/${K[2]}`.toLowerCase();
    let Y = q.match(/^(?:https?|ssh):\/\/(?:[^@]+@)?([^/]+)\/(.+?)(?:\.git)?$/);
    if (Y && Y[1] && Y[2]) {
        let z = Y[1],
            _ = Y[2];
        if (OO3(z) && _.startsWith("git/")) {
            let w = _.slice(4),
                O = w.split("/");
            if (O.length >= 3 && O[0].includes(".")) return w.toLowerCase();
            return `github.com/${w}`.toLowerCase()
        }
        return `${z}/${_}`.toLowerCase()
    }
    return null
}
// @from(Ln 100886, Col 0)
async function FC6() {
    let A = await Lo();
    if (!A) return null;
    let q = X37(A);
    if (!q) return null;
    return nw3("sha256").update(q).digest("hex").substring(0, 16)
}
// @from(Ln 100893, Col 0)
async function P37() {
    let A = await oT(),
        {
            stdout: q,
            code: K
        } = await z8(hA(), ["rev-list", "--count", `${A}..HEAD`]);
    if (K !== 0) return null;
    return parseInt(q.trim(), 10) || 0
}
// @from(Ln 100902, Col 0)
async function R58() {
    try {
        let [A, q, K, Y, z, _] = await Promise.all([D37(), kj(), Lo(), E58(), Ro(), TJ6()]);
        return {
            commitHash: A,
            branchName: q,
            remoteUrl: K,
            isHeadOnRemote: Y,
            isClean: z,
            worktreeCount: _
        }
    } catch (A) {
        return null
    }
}
// @from(Ln 100917, Col 0)
async function ho() {
    let {
        parseGitRemote: A
    } = await Promise.resolve().then(() => (yG(), gC6)), q = await Lo();
    if (!q) return k("Local GitHub repo: unknown"), null;
    let K = A(q);
    if (K && K.host === "github.com") {
        let Y = `${K.owner}/${K.name}`;
        return k(`Local GitHub repo: ${Y}`), Y
    }
    return k("Local GitHub repo: unknown"), null
}
// @from(Ln 100929, Col 0)
async function W37() {
    let {
        stdout: A,
        code: q
    } = await z8(hA(), ["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"], {
        preserveOutputOnError: !1
    });
    if (q === 0 && A.trim()) return A.trim();
    let {
        stdout: K,
        code: Y
    } = await z8(hA(), ["remote", "show", "origin", "--", "HEAD"], {
        preserveOutputOnError: !1
    });
    if (Y === 0) {
        let _ = K.match(/HEAD branch: (\S+)/);
        if (_ && _[1]) return `origin/${_[1]}`
    }
    let z = ["origin/main", "origin/staging", "origin/master"];
    for (let _ of z) {
        let {
            code: w
        } = await z8(hA(), ["rev-parse", "--verify", _], {
            preserveOutputOnError: !1
        });
        if (w === 0) return _
    }
    return null
}
// @from(Ln 100959, Col 0)
function _O3() {
    return t57()
}
// @from(Ln 100962, Col 0)
async function Q31() {
    let {
        stdout: A,
        code: q
    } = await z8(hA(), ["ls-files", "--others", "--exclude-standard"], {
        preserveOutputOnError: !1
    });
    if (q !== 0 || !A.trim()) return [];
    let K = A.trim().split(`
`).filter(Boolean),
        Y = [],
        z = 0;
    for (let _ of K) {
        if (Y.length >= j37) {
            k(`Untracked file capture: reached max file count (${j37})`);
            break
        }
        if (p31(_)) continue;
        try {
            let O = (await rw3(_)).size;
            if (O > $37) {
                k(`Untracked file capture: skipping ${_} (exceeds ${$37} bytes)`);
                continue
            }
            if (z + O > H37) {
                k(`Untracked file capture: reached total size limit (${H37} bytes)`);
                break
            }
            if (O === 0) {
                Y.push({
                    path: _,
                    content: ""
                });
                continue
            }
            let $ = Math.min(zO3, O),
                H = await aw3(_, "r");
            try {
                let j = Buffer.alloc($),
                    {
                        bytesRead: J
                    } = await H.read(j, 0, $, 0),
                    M = j.subarray(0, J);
                if (A37(M)) continue;
                let D;
                if (O <= $) D = M.toString("utf-8");
                else D = await ow3(_, "utf-8");
                Y.push({
                    path: _,
                    content: D
                }), z += O
            } finally {
                await H.close()
            }
        } catch (w) {
            k(`Failed to read untracked file ${_}: ${w}`)
        }
    }
    return Y
}