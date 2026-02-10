
// @from(Ln 382334, Col 0)
function edY(A) {
    let {
        originalCommand: q,
        baseCommand: K
    } = A;
    if (K !== "jq") return {
        behavior: "passthrough",
        message: "Not jq"
    };
    if (/\bsystem\s*\(/.test(q)) return c("tengu_bash_security_check_triggered", {
        checkId: kH.JQ_SYSTEM_FUNCTION,
        subId: 1
    }), {
        behavior: "ask",
        message: "jq command contains system() function which executes arbitrary commands"
    };
    let Y = q.substring(3).trim();
    if (/(?:^|\s)(?:-f\b|--from-file|--rawfile|--slurpfile|-L\b|--library-path)/.test(Y)) return c("tengu_bash_security_check_triggered", {
        checkId: kH.JQ_FILE_ARGUMENTS,
        subId: 1
    }), {
        behavior: "ask",
        message: "jq command contains dangerous flags that could execute code or read arbitrary files"
    };
    return {
        behavior: "passthrough",
        message: "jq command is safe"
    }
}
// @from(Ln 382364, Col 0)
function AcY(A) {
    let {
        unquotedContent: q
    } = A, K = "Command contains shell metacharacters (;, |, or &) in arguments";
    if (/(?:^|\s)["'][^"']*[;&][^"']*["'](?:\s|$)/.test(q)) return c("tengu_bash_security_check_triggered", {
        checkId: kH.SHELL_METACHARACTERS,
        subId: 1
    }), {
        behavior: "ask",
        message: "Command contains shell metacharacters (;, |, or &) in arguments"
    };
    if ([/-name\s+["'][^"']*[;|&][^"']*["']/, /-path\s+["'][^"']*[;|&][^"']*["']/, /-iname\s+["'][^"']*[;|&][^"']*["']/].some((z) => z.test(q))) return c("tengu_bash_security_check_triggered", {
        checkId: kH.SHELL_METACHARACTERS,
        subId: 2
    }), {
        behavior: "ask",
        message: "Command contains shell metacharacters (;, |, or &) in arguments"
    };
    if (/-regex\s+["'][^"']*[;&][^"']*["']/.test(q)) return c("tengu_bash_security_check_triggered", {
        checkId: kH.SHELL_METACHARACTERS,
        subId: 3
    }), {
        behavior: "ask",
        message: "Command contains shell metacharacters (;, |, or &) in arguments"
    };
    return {
        behavior: "passthrough",
        message: "No metacharacters"
    }
}
// @from(Ln 382395, Col 0)
function qcY(A) {
    let {
        fullyUnquotedContent: q
    } = A;
    if (/[<>|]\s*\$[A-Za-z_]/.test(q) || /\$[A-Za-z_][A-Za-z0-9_]*\s*[|<>]/.test(q)) return c("tengu_bash_security_check_triggered", {
        checkId: kH.DANGEROUS_VARIABLES,
        subId: 1
    }), {
        behavior: "ask",
        message: "Command contains variables in dangerous contexts (redirections or pipes)"
    };
    return {
        behavior: "passthrough",
        message: "No dangerous variables"
    }
}
// @from(Ln 382412, Col 0)
function KcY(A) {
    let {
        unquotedContent: q,
        fullyUnquotedContent: K
    } = A;
    if (idY(q, "`")) return {
        behavior: "ask",
        message: "Command contains backticks (`) for command substitution"
    };
    for (let {
            pattern: Y,
            message: z
        }
        of ddY)
        if (Y.test(q)) return c("tengu_bash_security_check_triggered", {
            checkId: kH.DANGEROUS_PATTERNS_COMMAND_SUBSTITUTION,
            subId: 1
        }), {
            behavior: "ask",
            message: `Command contains ${z}`
        };
    if (/</.test(K)) return c("tengu_bash_security_check_triggered", {
        checkId: kH.DANGEROUS_PATTERNS_INPUT_REDIRECTION,
        subId: 1
    }), {
        behavior: "ask",
        message: "Command contains input redirection (<) which could read sensitive files"
    };
    if (/>/.test(K)) return c("tengu_bash_security_check_triggered", {
        checkId: kH.DANGEROUS_PATTERNS_OUTPUT_REDIRECTION,
        subId: 1
    }), {
        behavior: "ask",
        message: "Command contains output redirection (>) which could write to arbitrary files"
    };
    return {
        behavior: "passthrough",
        message: "No dangerous patterns"
    }
}
// @from(Ln 382453, Col 0)
function YcY(A) {
    let {
        fullyUnquotedContent: q
    } = A;
    if (!/[\n\r]/.test(q)) return {
        behavior: "passthrough",
        message: "No newlines"
    };
    if (/[\n\r]\s*[a-zA-Z/.~({$![>|]/.test(q)) return c("tengu_bash_security_check_triggered", {
        checkId: kH.NEWLINES,
        subId: 1
    }), {
        behavior: "ask",
        message: "Command contains newlines that could separate multiple commands"
    };
    return {
        behavior: "passthrough",
        message: "Newlines appear to be within data"
    }
}
// @from(Ln 382474, Col 0)
function zcY(A) {
    let {
        originalCommand: q
    } = A;
    if (/\$IFS|\$\{[^}]*IFS/.test(q)) return c("tengu_bash_security_check_triggered", {
        checkId: kH.IFS_INJECTION,
        subId: 1
    }), {
        behavior: "ask",
        message: "Command contains IFS variable usage which could bypass security validation"
    };
    return {
        behavior: "passthrough",
        message: "No IFS injection detected"
    }
}
// @from(Ln 382491, Col 0)
function wcY(A) {
    let {
        originalCommand: q
    } = A;
    if (/\/proc\/.*\/environ/.test(q)) return c("tengu_bash_security_check_triggered", {
        checkId: kH.PROC_ENVIRON_ACCESS,
        subId: 1
    }), {
        behavior: "ask",
        message: "Command accesses /proc/*/environ which could expose sensitive environment variables"
    };
    return {
        behavior: "passthrough",
        message: "No /proc/environ access detected"
    }
}
// @from(Ln 382508, Col 0)
function HcY(A) {
    let {
        originalCommand: q
    } = A, K = pz(q);
    if (!K.success) return {
        behavior: "passthrough",
        message: "Parse failed, handled elsewhere"
    };
    let Y = K.tokens;
    if (!Y.some((w) => typeof w === "object" && w !== null && ("op" in w) && (w.op === ";" || w.op === "&&" || w.op === "||"))) return {
        behavior: "passthrough",
        message: "No command separators"
    };
    if (pdY(Y)) return c("tengu_bash_security_check_triggered", {
        checkId: kH.MALFORMED_TOKEN_INJECTION,
        subId: 1
    }), {
        behavior: "ask",
        message: "Command contains ambiguous syntax with command separators that could be misinterpreted"
    };
    return {
        behavior: "passthrough",
        message: "No malformed token injection detected"
    }
}
// @from(Ln 382534, Col 0)
function $cY(A) {
    let {
        originalCommand: q,
        baseCommand: K
    } = A, Y = /[|&;]/.test(q);
    if (K === "echo" && !Y) return {
        behavior: "passthrough",
        message: "echo command is safe and has no dangerous flags"
    };
    if (/\$'[^']*'/.test(q)) return c("tengu_bash_security_check_triggered", {
        checkId: kH.OBFUSCATED_FLAGS,
        subId: 5
    }), {
        behavior: "ask",
        message: "Command contains ANSI-C quoting which can hide characters"
    };
    if (/\$"[^"]*"/.test(q)) return c("tengu_bash_security_check_triggered", {
        checkId: kH.OBFUSCATED_FLAGS,
        subId: 6
    }), {
        behavior: "ask",
        message: "Command contains locale quoting which can hide characters"
    };
    if (/\$['"]{2}\s*-/.test(q)) return c("tengu_bash_security_check_triggered", {
        checkId: kH.OBFUSCATED_FLAGS,
        subId: 9
    }), {
        behavior: "ask",
        message: "Command contains empty special quotes before dash (potential bypass)"
    };
    if (/(?:^|\s)(?:''|"")+\s*-/.test(q)) return c("tengu_bash_security_check_triggered", {
        checkId: kH.OBFUSCATED_FLAGS,
        subId: 7
    }), {
        behavior: "ask",
        message: "Command contains empty quotes before dash (potential bypass)"
    };
    let z = !1,
        w = !1,
        H = !1;
    for (let $ = 0; $ < q.length - 1; $++) {
        let O = q[$],
            _ = q[$ + 1];
        if (H) {
            H = !1;
            continue
        }
        if (O === "\\") {
            H = !0;
            continue
        }
        if (O === "'" && !w) {
            z = !z;
            continue
        }
        if (O === '"' && !z) {
            w = !w;
            continue
        }
        if (z || w) continue;
        if (O && _ && /\s/.test(O) && /['"`]/.test(_)) {
            let J = _,
                X = $ + 2,
                D = "";
            while (X < q.length && q[X] !== J) D += q[X], X++;
            if (X < q.length && q[X] === J && D.startsWith("-")) return c("tengu_bash_security_check_triggered", {
                checkId: kH.OBFUSCATED_FLAGS,
                subId: 4
            }), {
                behavior: "ask",
                message: "Command contains quoted characters in flag names"
            }
        }
        if (O && _ && /\s/.test(O) && _ === "-") {
            let J = $ + 1,
                X = "";
            while (J < q.length) {
                let D = q[J];
                if (!D) break;
                if (/[\s=]/.test(D)) break;
                if (/['"`]/.test(D)) {
                    if (K === "cut" && X === "-d" && /['"`]/.test(D)) break;
                    if (J + 1 < q.length) {
                        let j = q[J + 1];
                        if (j && !/[a-zA-Z0-9_'"-]/.test(j)) break
                    }
                }
                X += D, J++
            }
            if (X.includes('"') || X.includes("'")) return c("tengu_bash_security_check_triggered", {
                checkId: kH.OBFUSCATED_FLAGS,
                subId: 1
            }), {
                behavior: "ask",
                message: "Command contains quoted characters in flag names"
            }
        }
    }
    if (/\s['"`]-/.test(A.fullyUnquotedContent)) return c("tengu_bash_security_check_triggered", {
        checkId: kH.OBFUSCATED_FLAGS,
        subId: 2
    }), {
        behavior: "ask",
        message: "Command contains quoted characters in flag names"
    };
    if (/['"`]{2}-/.test(A.fullyUnquotedContent)) return c("tengu_bash_security_check_triggered", {
        checkId: kH.OBFUSCATED_FLAGS,
        subId: 3
    }), {
        behavior: "ask",
        message: "Command contains quoted characters in flag names"
    };
    return {
        behavior: "passthrough",
        message: "No obfuscated flags detected"
    }
}
// @from(Ln 382652, Col 0)
function lm(A) {
    if (CY8(A)) return {
        behavior: "ask",
        message: "Command contains single-quoted backslash pattern that could bypass security checks"
    };
    let q = A.split(" ")[0] || "",
        {
            withDoubleQuotes: K,
            fullyUnquoted: Y
        } = cdY(A, q === "jq"),
        z = {
            originalCommand: A,
            baseCommand: q,
            unquotedContent: K,
            fullyUnquotedContent: ldY(Y)
        },
        w = [ndY, rdY, adY, tdY, sdY];
    for (let $ of w) {
        let O = $(z);
        if (O.behavior === "allow") return {
            behavior: "passthrough",
            message: O.decisionReason?.type === "other" ? O.decisionReason.reason : "Command allowed"
        };
        if (O.behavior !== "passthrough") return O
    }
    let H = [edY, $cY, AcY, qcY, YcY, zcY, wcY, KcY, HcY];
    for (let $ of H) {
        let O = $(z);
        if (O.behavior === "ask") return O
    }
    return {
        behavior: "passthrough",
        message: "Command passed all security checks"
    }
}
// @from(Ln 382687, Col 4)
PhA
// @from(Ln 382687, Col 9)
ddY
// @from(Ln 382687, Col 14)
kH
// @from(Ln 382688, Col 4)
qf6 = v(() => {
    u6();
    M_();
    PhA = /\$\(.*<</, ddY = [{
        pattern: /<\(/,
        message: "process substitution <()"
    }, {
        pattern: />\(/,
        message: "process substitution >()"
    }, {
        pattern: /\$\(/,
        message: "$() command substitution"
    }, {
        pattern: /\$\{/,
        message: "${} parameter substitution"
    }, {
        pattern: /\$\[/,
        message: "$[] legacy arithmetic expansion"
    }, {
        pattern: /~\[/,
        message: "Zsh-style parameter expansion"
    }, {
        pattern: /\(e:/,
        message: "Zsh-style glob qualifiers"
    }, {
        pattern: /<#/,
        message: "PowerShell comment syntax"
    }], kH = {
        INCOMPLETE_COMMANDS: 1,
        JQ_SYSTEM_FUNCTION: 2,
        JQ_FILE_ARGUMENTS: 3,
        OBFUSCATED_FLAGS: 4,
        SHELL_METACHARACTERS: 5,
        DANGEROUS_VARIABLES: 6,
        NEWLINES: 7,
        DANGEROUS_PATTERNS_COMMAND_SUBSTITUTION: 8,
        DANGEROUS_PATTERNS_INPUT_REDIRECTION: 9,
        DANGEROUS_PATTERNS_OUTPUT_REDIRECTION: 10,
        IFS_INJECTION: 11,
        GIT_COMMIT_SUBSTITUTION: 12,
        PROC_ENVIRON_ACCESS: 13,
        MALFORMED_TOKEN_INJECTION: 14
    }
})
// @from(Ln 382733, Col 0)
function X6q(A, q) {
    for (let K of A)
        if (K.startsWith("-") && !K.startsWith("--") && K.length > 2)
            for (let Y = 1; Y < K.length; Y++) {
                let z = "-" + K[Y];
                if (!q.includes(z)) return !1
            } else if (!q.includes(K)) return !1;
    return !0
}
// @from(Ln 382743, Col 0)
function OcY(A, q) {
    let K = A.match(/^\s*sed\s+/);
    if (!K) return !1;
    let Y = A.slice(K[0].length),
        z = pz(Y);
    if (!z.success) return !1;
    let w = z.tokens,
        H = [];
    for (let _ of w)
        if (typeof _ === "string" && _.startsWith("-") && _ !== "--") H.push(_);
    if (!X6q(H, ["-n", "--quiet", "--silent", "-E", "--regexp-extended", "-r", "-z", "--zero-terminated", "--posix"])) return !1;
    let O = !1;
    for (let _ of H) {
        if (_ === "-n" || _ === "--quiet" || _ === "--silent") {
            O = !0;
            break
        }
        if (_.startsWith("-") && !_.startsWith("--") && _.includes("n")) {
            O = !0;
            break
        }
    }
    if (!O) return !1;
    if (q.length === 0) return !1;
    for (let _ of q) {
        let J = _.split(";");
        for (let X of J)
            if (!_cY(X.trim())) return !1
    }
    return !0
}
// @from(Ln 382775, Col 0)
function _cY(A) {
    if (!A) return !1;
    return /^(?:\d+|\d+,\d+)?p$/.test(A)
}
// @from(Ln 382780, Col 0)
function J6q(A, q, K, Y) {
    let z = Y?.allowFileWrites ?? !1;
    if (!z && K) return !1;
    let w = A.match(/^\s*sed\s+/);
    if (!w) return !1;
    let H = A.slice(w[0].length),
        $ = pz(H);
    if (!$.success) return !1;
    let O = $.tokens,
        _ = [];
    for (let Z of O)
        if (typeof Z === "string" && Z.startsWith("-") && Z !== "--") _.push(Z);
    let J = ["-E", "--regexp-extended", "-r", "--posix"];
    if (z) J.push("-i", "--in-place");
    if (!X6q(_, J)) return !1;
    if (q.length !== 1) return !1;
    let X = q[0].trim();
    if (!X.startsWith("s")) return !1;
    let D = X.match(/^s\/(.*?)$/);
    if (!D) return !1;
    let j = D[1],
        M = 0,
        P = -1,
        W = 0;
    while (W < j.length) {
        if (j[W] === "\\") {
            W += 2;
            continue
        }
        if (j[W] === "/") M++, P = W;
        W++
    }
    if (M !== 2) return !1;
    let G = j.slice(P + 1);
    if (!/^[gpimIM]*[1-9]?[gpimIM]*$/.test(G)) return !1;
    return !0
}
// @from(Ln 382818, Col 0)
function QU1(A, q) {
    let K = q?.allowFileWrites ?? !1,
        Y;
    try {
        Y = XcY(A)
    } catch ($) {
        return !1
    }
    let z = JcY(A),
        w = !1,
        H = !1;
    if (K) H = J6q(A, Y, z, {
        allowFileWrites: !0
    });
    else w = OcY(A, Y), H = J6q(A, Y, z);
    if (!w && !H) return !1;
    for (let $ of Y)
        if (H && $.includes(";")) return !1;
    for (let $ of Y)
        if (DcY($)) return !1;
    return !0
}
// @from(Ln 382841, Col 0)
function JcY(A) {
    let q = A.match(/^\s*sed\s+/);
    if (!q) return !1;
    let K = A.slice(q[0].length),
        Y = pz(K);
    if (!Y.success) return !0;
    let z = Y.tokens;
    try {
        let w = 0,
            H = !1;
        for (let $ = 0; $ < z.length; $++) {
            let O = z[$];
            if (typeof O !== "string" && typeof O !== "object") continue;
            if (typeof O === "object" && O !== null && "op" in O && O.op === "glob") return !0;
            if (typeof O !== "string") continue;
            if ((O === "-e" || O === "--expression") && $ + 1 < z.length) {
                H = !0, $++;
                continue
            }
            if (O.startsWith("--expression=")) {
                H = !0;
                continue
            }
            if (O.startsWith("-e=")) {
                H = !0;
                continue
            }
            if (O.startsWith("-")) continue;
            if (w++, H) return !0;
            if (w > 1) return !0
        }
        return !1
    } catch (w) {
        return !0
    }
}
// @from(Ln 382878, Col 0)
function XcY(A) {
    let q = [],
        K = A.match(/^\s*sed\s+/);
    if (!K) return q;
    let Y = A.slice(K[0].length);
    if (/-e[wWe]/.test(Y) || /-w[eE]/.test(Y)) throw Error("Dangerous flag combination detected");
    let z = pz(Y);
    if (!z.success) throw Error(`Malformed shell syntax: ${z.error}`);
    let w = z.tokens;
    try {
        let H = !1,
            $ = !1;
        for (let O = 0; O < w.length; O++) {
            let _ = w[O];
            if (typeof _ !== "string") continue;
            if ((_ === "-e" || _ === "--expression") && O + 1 < w.length) {
                H = !0;
                let J = w[O + 1];
                if (typeof J === "string") q.push(J), O++;
                continue
            }
            if (_.startsWith("--expression=")) {
                H = !0, q.push(_.slice(13));
                continue
            }
            if (_.startsWith("-e=")) {
                H = !0, q.push(_.slice(3));
                continue
            }
            if (_.startsWith("-")) continue;
            if (!H && !$) {
                q.push(_), $ = !0;
                continue
            }
            break
        }
    } catch (H) {
        throw Error(`Failed to parse sed command: ${H instanceof Error?H.message:"Unknown error"}`)
    }
    return q
}
// @from(Ln 382920, Col 0)
function DcY(A) {
    let q = A.trim();
    if (!q) return !1;
    if (/[^\x01-\x7F]/.test(q)) return !0;
    if (q.includes("{") || q.includes("}")) return !0;
    if (q.includes(`
`)) return !0;
    let K = q.indexOf("#");
    if (K !== -1 && !(K > 0 && q[K - 1] === "s")) return !0;
    if (/^!/.test(q) || /[/\d$]!/.test(q)) return !0;
    if (/\d\s*~\s*\d|,\s*~\s*\d|\$\s*~\s*\d/.test(q)) return !0;
    if (/^,/.test(q)) return !0;
    if (/,\s*[+-]/.test(q)) return !0;
    if (/s\\/.test(q) || /\\[|#%@]/.test(q)) return !0;
    if (/\\\/.*[wW]/.test(q)) return !0;
    if (/\/[^/]*\s+[wWeE]/.test(q)) return !0;
    if (/^s\//.test(q) && !/^s\/[^/]*\/[^/]*\/[^/]*$/.test(q)) return !0;
    if (/^s./.test(q) && /[wWeE]$/.test(q)) {
        if (!/^s([^\\\n]).*?\1.*?\1[^wWeE]*$/.test(q)) return !0
    }
    if (/^[wW]\s*\S+/.test(q) || /^\d+\s*[wW]\s*\S+/.test(q) || /^\$\s*[wW]\s*\S+/.test(q) || /^\/[^/]*\/[IMim]*\s*[wW]\s*\S+/.test(q) || /^\d+,\d+\s*[wW]\s*\S+/.test(q) || /^\d+,\$\s*[wW]\s*\S+/.test(q) || /^\/[^/]*\/[IMim]*,\/[^/]*\/[IMim]*\s*[wW]\s*\S+/.test(q)) return !0;
    if (/^e/.test(q) || /^\d+\s*e/.test(q) || /^\$\s*e/.test(q) || /^\/[^/]*\/[IMim]*\s*e/.test(q) || /^\d+,\d+\s*e/.test(q) || /^\d+,\$\s*e/.test(q) || /^\/[^/]*\/[IMim]*,\/[^/]*\/[IMim]*\s*e/.test(q)) return !0;
    let Y = q.match(/s([^\\\n]).*?\1.*?\1(.*?)$/);
    if (Y) {
        let w = Y[2] || "";
        if (w.includes("w") || w.includes("W")) return !0;
        if (w.includes("e") || w.includes("E")) return !0
    }
    if (q.match(/y([^\\\n])/)) {
        if (/[wWeE]/.test(q)) return !0
    }
    return !1
}
// @from(Ln 382954, Col 0)
function D6q(A, q) {
    let K = AD(A.command);
    for (let Y of K) {
        let z = Y.trim();
        if (z.split(/\s+/)[0] !== "sed") continue;
        let H = q.mode === "acceptEdits";
        if (!QU1(z, {
                allowFileWrites: H
            })) return {
            behavior: "ask",
            message: "sed command requires approval (contains potentially dangerous operations)",
            decisionReason: {
                type: "other",
                reason: "sed command contains operations that require explicit approval (e.g., write commands, execute commands)"
            }
        }
    }
    return {
        behavior: "passthrough",
        message: "No dangerous sed operations detected"
    }
}
// @from(Ln 382976, Col 4)
Kf6 = v(() => {
    wG();
    M_()
})
// @from(Ln 382984, Col 0)
function McY() {
    return jcY
}
// @from(Ln 382988, Col 0)
function M6q(A, q) {
    switch (q) {
        case "none":
            return !1;
        case "number":
            return /^\d+$/.test(A);
        case "string":
            return !0;
        case "char":
            return A.length === 1;
        case "{}":
            return A === "{}";
        case "EOF":
            return A === "EOF";
        default:
            return !1
    }
}
// @from(Ln 383007, Col 0)
function WcY(A) {
    let q = pz(A, (_) => `$${_}`);
    if (!q.success) return !1;
    let K = q.tokens.map((_) => {
        if (typeof _ !== "string") {
            if (_ = _, _.op === "glob") return _.pattern
        }
        return _
    });
    if (K.some((_) => typeof _ !== "string")) return !1;
    let z = K;
    if (z.length === 0) return !1;
    let w, H = 0,
        $ = McY();
    for (let [_] of Object.entries($)) {
        let J = _.split(" ");
        if (z.length >= J.length) {
            let X = !0;
            for (let D = 0; D < J.length; D++)
                if (z[D] !== J[D]) {
                    X = !1;
                    break
                } if (X) {
                w = $[_], H = J.length;
                break
            }
        }
    }
    if (!w) return !1;
    if (z[0] === "git" && z[1] === "ls-remote")
        for (let _ = 2; _ < z.length; _++) {
            let J = z[_];
            if (J && !J.startsWith("-")) {
                if (J.includes("://")) return !1;
                if (J.includes("@") || J.includes(":")) return !1;
                if (J.includes("$")) return !1
            }
        }
    let O = H;
    while (O < z.length) {
        let _ = z[O];
        if (!_) {
            O++;
            continue
        }
        if (z[0] === "xargs" && (!_.startsWith("-") || _ === "--")) {
            if (_ === "--" && O + 1 < z.length) O++, _ = z[O];
            if (_ && PcY.includes(_)) break;
            return !1
        }
        if (_ === "--") {
            O++;
            break
        }
        if (_.startsWith("-") && _.length > 1 && j6q.test(_)) {
            let [J, ...X] = _.split("="), D = X.join("=");
            if (!J) return !1;
            let j = w.safeFlags[J];
            if (!j) {
                if (z[0] === "git" && J.match(/^-\d+$/)) {
                    O++;
                    continue
                }
                if ((z[0] === "grep" || z[0] === "rg") && J.startsWith("-") && !J.startsWith("--") && J.length > 2) {
                    let M = J.substring(0, 2),
                        P = J.substring(2);
                    if (w.safeFlags[M] && /^\d+$/.test(P)) {
                        let W = w.safeFlags[M];
                        if (W === "number" || W === "string")
                            if (M6q(P, W)) {
                                O++;
                                continue
                            } else return !1
                    }
                }
                if (J.startsWith("-") && !J.startsWith("--") && J.length > 2) {
                    for (let M = 1; M < J.length; M++) {
                        let P = "-" + J[M];
                        if (!w.safeFlags[P]) return !1
                    }
                    O++;
                    continue
                } else return !1
            }
            if (j === "none") {
                if (D) return !1;
                O++
            } else {
                let M;
                if (D) M = D, O++;
                else {
                    if (O + 1 >= z.length || z[O + 1] && z[O + 1].startsWith("-") && z[O + 1].length > 1 && j6q.test(z[O + 1])) return !1;
                    M = z[O + 1] || "", O += 2
                }
                if (j === "string" && M.startsWith("-"))
                    if (J === "--sort" && z[0] === "git" && M.match(/^-[a-zA-Z]/));
                    else return !1;
                if (!M6q(M, j)) return !1
            }
        } else O++
    }
    if (w.regex && !w.regex.test(A)) return !1;
    if (!w.regex && /`/.test(A)) return !1;
    if (!w.regex && (z[0] === "rg" || z[0] === "grep") && /[\n\r]/.test(A)) return !1;
    if (w.additionalCommandIsDangerousCallback && w.additionalCommandIsDangerousCallback(A)) return !1;
    return !0
}
// @from(Ln 383115, Col 0)
function GcY(A) {
    return new RegExp(`^${A}(?:\\s|$)[^<>()$\`|{}&;\\n\\r]*$`)
}
// @from(Ln 383119, Col 0)
function $f6(A) {
    if (eA() !== "windows") return !1;
    if (/\\\\[a-zA-Z0-9._\-:[\]%]+(?:@(?:\d+|ssl))?(?:\\|$|\s)/i.test(A)) return !0;
    if (/(?:^|\s)\/\/[a-zA-Z0-9._\-:[\]%]+(?:@(?:\d+|ssl))?(?:\/|$|\s)/i.test(A)) return !0;
    if (/@SSL@\d+/i.test(A) || /@\d+@SSL/i.test(A)) return !0;
    if (/DavWWWRoot/i.test(A)) return !0;
    if (/^\\\\(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})[\\/]/.test(A) || /^\/\/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})[\\/]/.test(A)) return !0;
    if (/^\\\\(\[[\da-fA-F:]+\])[\\/]/.test(A) || /^\/\/(\[[\da-fA-F:]+\])[\\/]/.test(A)) return !0;
    return !1
}
// @from(Ln 383130, Col 0)
function VcY(A) {
    let q = !1,
        K = !1,
        Y = !1;
    for (let z = 0; z < A.length; z++) {
        let w = A[z];
        if (Y) {
            Y = !1;
            continue
        }
        if (w === "\\") {
            Y = !0;
            continue
        }
        if (w === "'" && !K) {
            q = !q;
            continue
        }
        if (w === '"' && !q) {
            K = !K;
            continue
        }
        if (q || K) continue;
        if (w && /[?*[\]]/.test(w)) return !0
    }
    return !1
}
// @from(Ln 383158, Col 0)
function NcY(A) {
    let q = A.trim();
    if (q.endsWith(" 2>&1")) q = q.slice(0, -5).trim();
    if ($f6(q)) return !1;
    if (VcY(q)) return !1;
    if (WcY(q)) return !0;
    for (let K of fcY)
        if (K.test(q)) {
            if (q.includes("git") && /\s-c[\s=]/.test(q)) return !1;
            if (q.includes("git") && /\s--exec-path[\s=]/.test(q)) return !1;
            if (q.includes("git") && /\s--config-env[\s=]/.test(q)) return !1;
            return !0
        } return !1
}
// @from(Ln 383173, Col 0)
function TcY(A) {
    return /^git(?:\s|$)/.test(A)
}
// @from(Ln 383177, Col 0)
function vcY(A) {
    return AD(A).some((q) => TcY(q.trim()))
}
// @from(Ln 383181, Col 0)
function EcY() {
    let A = b1(),
        q = h6(),
        K = gU1(q, ".git");
    try {
        if (A.existsSync(K)) {
            let H = A.statSync(K);
            if (H.isFile()) return !1;
            if (H.isDirectory()) {
                let $ = gU1(K, "HEAD");
                if (A.existsSync($)) return !1
            }
        }
    } catch {}
    let Y = gU1(q, "HEAD"),
        z = gU1(q, "objects"),
        w = gU1(q, "refs");
    try {
        let H = A.existsSync(Y),
            $ = A.existsSync(z) && A.statSync(z).isDirectory(),
            O = A.existsSync(w) && A.statSync(w).isDirectory();
        return H || $ || O
    } catch {
        return !1
    }
}
// @from(Ln 383208, Col 0)
function Of6(A, q) {
    let {
        command: K
    } = A;
    if (!pz(K, (H) => `$${H}`).success) return {
        behavior: "passthrough",
        message: "Command cannot be parsed, requires further permission checks"
    };
    if (lm(K).behavior !== "passthrough") return {
        behavior: "passthrough",
        message: "Command is not read-only, requires further permission checks"
    };
    if ($f6(K)) return {
        behavior: "ask",
        message: "Command contains Windows UNC path that could be vulnerable to WebDAV attacks"
    };
    let z = vcY(K);
    if (q && z) return {
        behavior: "passthrough",
        message: "Compound commands with cd and git require permission checks for enhanced security"
    };
    if (z && EcY()) return {
        behavior: "passthrough",
        message: "Git commands in directories with bare repository structure require permission checks for enhanced security"
    };
    if (AD(K).every((H) => {
            if (lm(H).behavior !== "passthrough") return !1;
            return NcY(H)
        })) return {
        behavior: "allow",
        updatedInput: A
    };
    return {
        behavior: "passthrough",
        message: "Command is not read-only, requires further permission checks"
    }
}
// @from(Ln 383245, Col 4)
j6q
// @from(Ln 383245, Col 9)
UU1
// @from(Ln 383245, Col 14)
Yf6
// @from(Ln 383245, Col 19)
zf6
// @from(Ln 383245, Col 24)
wf6
// @from(Ln 383245, Col 29)
Hf6
// @from(Ln 383245, Col 34)
pU1
// @from(Ln 383245, Col 39)
WhA
// @from(Ln 383245, Col 44)
GhA
// @from(Ln 383245, Col 49)
jcY
// @from(Ln 383245, Col 54)
PcY
// @from(Ln 383245, Col 59)
ZcY
// @from(Ln 383245, Col 64)
fcY
// @from(Ln 383246, Col 4)
_f6 = v(() => {
    wG();
    M_();
    qf6();
    Kf6();
    x3();
    N7();
    _8();
    j6q = /^-[a-zA-Z0-9_-]/, UU1 = {
        "--all": "none",
        "--branches": "none",
        "--tags": "none",
        "--remotes": "none"
    }, Yf6 = {
        "--since": "string",
        "--after": "string",
        "--until": "string",
        "--before": "string"
    }, zf6 = {
        "--oneline": "none",
        "--graph": "none",
        "--decorate": "none",
        "--no-decorate": "none",
        "--date": "string",
        "--relative-date": "none"
    }, wf6 = {
        "--max-count": "number",
        "-n": "number"
    }, Hf6 = {
        "--stat": "none",
        "--numstat": "none",
        "--shortstat": "none",
        "--name-only": "none",
        "--name-status": "none"
    }, pU1 = {
        "--color": "none",
        "--no-color": "none"
    }, WhA = {
        "--patch": "none",
        "-p": "none",
        "--no-patch": "none",
        "--no-ext-diff": "none",
        "-s": "none"
    }, GhA = {
        "--author": "string",
        "--committer": "string",
        "--grep": "string"
    }, jcY = {
        xargs: {
            safeFlags: {
                "-I": "{}",
                "-i": "none",
                "-n": "number",
                "-P": "number",
                "-L": "number",
                "-s": "number",
                "-E": "EOF",
                "-e": "EOF",
                "-0": "none",
                "-t": "none",
                "-r": "none",
                "-x": "none",
                "-d": "char"
            }
        },
        "git diff": {
            safeFlags: {
                ...Hf6,
                ...pU1,
                "--dirstat": "none",
                "--summary": "none",
                "--patch-with-stat": "none",
                "--word-diff": "none",
                "--word-diff-regex": "string",
                "--color-words": "none",
                "--no-renames": "none",
                "--no-ext-diff": "none",
                "--check": "none",
                "--ws-error-highlight": "string",
                "--full-index": "none",
                "--binary": "none",
                "--abbrev": "number",
                "--break-rewrites": "none",
                "--find-renames": "none",
                "--find-copies": "none",
                "--find-copies-harder": "none",
                "--irreversible-delete": "none",
                "--diff-algorithm": "string",
                "--histogram": "none",
                "--patience": "none",
                "--minimal": "none",
                "--ignore-space-at-eol": "none",
                "--ignore-space-change": "none",
                "--ignore-all-space": "none",
                "--ignore-blank-lines": "none",
                "--inter-hunk-context": "number",
                "--function-context": "none",
                "--exit-code": "none",
                "--quiet": "none",
                "--cached": "none",
                "--staged": "none",
                "--pickaxe-regex": "none",
                "--pickaxe-all": "none",
                "--no-index": "none",
                "--relative": "string",
                "--diff-filter": "string",
                "-p": "none",
                "-u": "none",
                "-s": "none",
                "-M": "none",
                "-C": "none",
                "-B": "none",
                "-D": "none",
                "-l": "none",
                "-S": "none",
                "-G": "none",
                "-O": "none",
                "-R": "none"
            }
        },
        "git log": {
            safeFlags: {
                ...zf6,
                ...UU1,
                ...Yf6,
                ...wf6,
                ...Hf6,
                ...pU1,
                ...WhA,
                ...GhA,
                "--abbrev-commit": "none",
                "--full-history": "none",
                "--dense": "none",
                "--sparse": "none",
                "--simplify-merges": "none",
                "--ancestry-path": "none",
                "--source": "none",
                "--first-parent": "none",
                "--merges": "none",
                "--no-merges": "none",
                "--reverse": "none",
                "--walk-reflogs": "none",
                "--skip": "number",
                "--max-age": "number",
                "--min-age": "number",
                "--no-min-parents": "none",
                "--no-max-parents": "none",
                "--follow": "none",
                "--no-walk": "none",
                "--left-right": "none",
                "--cherry-mark": "none",
                "--cherry-pick": "none",
                "--boundary": "none",
                "--topo-order": "none",
                "--date-order": "none",
                "--author-date-order": "none",
                "--pretty": "string",
                "--format": "string",
                "--diff-filter": "string",
                "-S": "string",
                "-G": "string",
                "--pickaxe-regex": "none",
                "--pickaxe-all": "none"
            }
        },
        "git show": {
            safeFlags: {
                ...zf6,
                ...Hf6,
                ...pU1,
                ...WhA,
                "--abbrev-commit": "none",
                "--word-diff": "none",
                "--word-diff-regex": "string",
                "--color-words": "none",
                "--pretty": "string",
                "--format": "string",
                "--first-parent": "none",
                "--raw": "none",
                "--diff-filter": "string",
                "-m": "none",
                "--quiet": "none"
            }
        },
        "git shortlog": {
            safeFlags: {
                ...UU1,
                ...Yf6,
                "-s": "none",
                "--summary": "none",
                "-n": "none",
                "--numbered": "none",
                "-e": "none",
                "--email": "none",
                "-c": "none",
                "--committer": "none",
                "--group": "string",
                "--format": "string",
                "--no-merges": "none",
                "--author": "string"
            }
        },
        "git reflog": {
            safeFlags: {
                ...zf6,
                ...UU1,
                ...Yf6,
                ...wf6,
                ...GhA
            }
        },
        "git stash list": {
            safeFlags: {
                ...zf6,
                ...UU1,
                ...wf6
            }
        },
        "git ls-remote": {
            safeFlags: {
                "--branches": "none",
                "-b": "none",
                "--tags": "none",
                "-t": "none",
                "--heads": "none",
                "-h": "none",
                "--refs": "none",
                "--quiet": "none",
                "-q": "none",
                "--exit-code": "none",
                "--get-url": "none",
                "--symref": "none",
                "--sort": "string",
                "--server-option": "string",
                "-o": "string"
            }
        },
        "git status": {
            safeFlags: {
                "--short": "none",
                "-s": "none",
                "--branch": "none",
                "-b": "none",
                "--porcelain": "none",
                "--long": "none",
                "--verbose": "none",
                "-v": "none",
                "--untracked-files": "string",
                "-u": "string",
                "--ignored": "none",
                "--ignore-submodules": "string",
                "--column": "none",
                "--no-column": "none",
                "--ahead-behind": "none",
                "--no-ahead-behind": "none",
                "--renames": "none",
                "--no-renames": "none",
                "--find-renames": "string",
                "-M": "string"
            }
        },
        "git blame": {
            safeFlags: {
                ...pU1,
                "-L": "string",
                "--porcelain": "none",
                "-p": "none",
                "--line-porcelain": "none",
                "--incremental": "none",
                "--root": "none",
                "--show-stats": "none",
                "--show-name": "none",
                "--show-number": "none",
                "-n": "none",
                "--show-email": "none",
                "-e": "none",
                "-f": "none",
                "--date": "string",
                "-w": "none",
                "--ignore-rev": "string",
                "--ignore-revs-file": "string",
                "-M": "none",
                "-C": "none",
                "--score-debug": "none",
                "--abbrev": "number",
                "-s": "none",
                "-l": "none",
                "-t": "none"
            }
        },
        "git ls-files": {
            safeFlags: {
                "--cached": "none",
                "-c": "none",
                "--deleted": "none",
                "-d": "none",
                "--modified": "none",
                "-m": "none",
                "--others": "none",
                "-o": "none",
                "--ignored": "none",
                "-i": "none",
                "--stage": "none",
                "-s": "none",
                "--killed": "none",
                "-k": "none",
                "--unmerged": "none",
                "-u": "none",
                "--directory": "none",
                "--no-empty-directory": "none",
                "--eol": "none",
                "--full-name": "none",
                "--abbrev": "number",
                "--debug": "none",
                "-z": "none",
                "-t": "none",
                "-v": "none",
                "-f": "none",
                "--exclude": "string",
                "-x": "string",
                "--exclude-from": "string",
                "-X": "string",
                "--exclude-per-directory": "string",
                "--exclude-standard": "none",
                "--error-unmatch": "none",
                "--recurse-submodules": "none"
            }
        },
        "git config --get": {
            safeFlags: {
                "--local": "none",
                "--global": "none",
                "--system": "none",
                "--worktree": "none",
                "--default": "string",
                "--type": "string",
                "--bool": "none",
                "--int": "none",
                "--bool-or-int": "none",
                "--path": "none",
                "--expiry-date": "none",
                "-z": "none",
                "--null": "none",
                "--name-only": "none",
                "--show-origin": "none",
                "--show-scope": "none"
            }
        },
        "git remote show": {
            safeFlags: {
                "-n": "none"
            },
            regex: /^git remote show(?:\s+-n)?\s+[a-zA-Z0-9_-]+$/
        },
        "git remote": {
            safeFlags: {
                "-v": "none",
                "--verbose": "none"
            },
            regex: /^git remote(?:\s+(?:-v|--verbose))?$/
        },
        "git merge-base": {
            safeFlags: {
                "--is-ancestor": "none",
                "--fork-point": "none",
                "--octopus": "none",
                "--independent": "none",
                "--all": "none"
            }
        },
        "git rev-parse": {
            safeFlags: {
                "--verify": "none",
                "--short": "string",
                "--abbrev-ref": "none",
                "--symbolic": "none",
                "--symbolic-full-name": "none",
                "--show-toplevel": "none",
                "--show-cdup": "none",
                "--show-prefix": "none",
                "--git-dir": "none",
                "--git-common-dir": "none",
                "--absolute-git-dir": "none",
                "--show-superproject-working-tree": "none",
                "--is-inside-work-tree": "none",
                "--is-inside-git-dir": "none",
                "--is-bare-repository": "none",
                "--is-shallow-repository": "none",
                "--is-shallow-update": "none",
                "--path-prefix": "none"
            }
        },
        "git rev-list": {
            safeFlags: {
                ...UU1,
                ...Yf6,
                ...wf6,
                ...GhA,
                "--count": "none",
                "--reverse": "none",
                "--first-parent": "none",
                "--ancestry-path": "none",
                "--merges": "none",
                "--no-merges": "none",
                "--min-parents": "number",
                "--max-parents": "number",
                "--no-min-parents": "none",
                "--no-max-parents": "none",
                "--skip": "number",
                "--max-age": "number",
                "--min-age": "number",
                "--walk-reflogs": "none",
                "--oneline": "none",
                "--abbrev-commit": "none",
                "--pretty": "string",
                "--format": "string",
                "--abbrev": "number",
                "--full-history": "none",
                "--dense": "none",
                "--sparse": "none",
                "--source": "none",
                "--graph": "none"
            }
        },
        "git describe": {
            safeFlags: {
                "--tags": "none",
                "--match": "string",
                "--exclude": "string",
                "--long": "none",
                "--abbrev": "number",
                "--always": "none",
                "--contains": "none",
                "--first-match": "none",
                "--exact-match": "none",
                "--candidates": "number",
                "--dirty": "none",
                "--broken": "none"
            }
        },
        "git cat-file": {
            safeFlags: {
                "-t": "none",
                "-s": "none",
                "-p": "none",
                "-e": "none",
                "--batch-check": "none",
                "--allow-undetermined-type": "none"
            }
        },
        "git for-each-ref": {
            safeFlags: {
                "--format": "string",
                "--sort": "string",
                "--count": "number",
                "--contains": "string",
                "--no-contains": "string",
                "--merged": "string",
                "--no-merged": "string",
                "--points-at": "string"
            }
        },
        "git grep": {
            safeFlags: {
                "-e": "string",
                "-E": "none",
                "--extended-regexp": "none",
                "-G": "none",
                "--basic-regexp": "none",
                "-F": "none",
                "--fixed-strings": "none",
                "-P": "none",
                "--perl-regexp": "none",
                "-i": "none",
                "--ignore-case": "none",
                "-v": "none",
                "--invert-match": "none",
                "-w": "none",
                "--word-regexp": "none",
                "-n": "none",
                "--line-number": "none",
                "-c": "none",
                "--count": "none",
                "-l": "none",
                "--files-with-matches": "none",
                "-L": "none",
                "--files-without-match": "none",
                "-h": "none",
                "-H": "none",
                "--heading": "none",
                "--break": "none",
                "--full-name": "none",
                "--color": "none",
                "--no-color": "none",
                "-o": "none",
                "--only-matching": "none",
                "-A": "number",
                "--after-context": "number",
                "-B": "number",
                "--before-context": "number",
                "-C": "number",
                "--context": "number",
                "--and": "none",
                "--or": "none",
                "--not": "none",
                "--max-depth": "number",
                "--untracked": "none",
                "--no-index": "none",
                "--recurse-submodules": "none",
                "--cached": "none",
                "--threads": "number",
                "-q": "none",
                "--quiet": "none"
            }
        },
        "git stash show": {
            safeFlags: {
                ...Hf6,
                ...pU1,
                ...WhA,
                "--word-diff": "none",
                "--word-diff-regex": "string",
                "--diff-filter": "string",
                "--abbrev": "number"
            }
        },
        "git worktree list": {
            safeFlags: {
                "--porcelain": "none",
                "-v": "none",
                "--verbose": "none",
                "--expire": "string"
            }
        },
        "git tag": {
            safeFlags: {
                "-l": "none",
                "--list": "none",
                "-n": "number",
                "--contains": "string",
                "--no-contains": "string",
                "--merged": "string",
                "--no-merged": "string",
                "--sort": "string",
                "--format": "string",
                "--points-at": "string",
                "--column": "none",
                "--no-column": "none",
                "-i": "none",
                "--ignore-case": "none"
            }
        },
        "git branch": {
            safeFlags: {
                "-l": "none",
                "--list": "none",
                "-a": "none",
                "--all": "none",
                "-r": "none",
                "--remotes": "none",
                "-v": "none",
                "-vv": "none",
                "--verbose": "none",
                "--color": "none",
                "--no-color": "none",
                "--column": "none",
                "--no-column": "none",
                "--abbrev": "number",
                "--no-abbrev": "none",
                "--contains": "string",
                "--no-contains": "string",
                "--merged": "none",
                "--no-merged": "none",
                "--points-at": "string",
                "--sort": "string",
                "--show-current": "none",
                "-i": "none",
                "--ignore-case": "none"
            },
            additionalCommandIsDangerousCallback: (A) => {
                let q = A.split(/\s+/),
                    K = new Set(["--contains", "--no-contains", "--points-at", "--sort", "--abbrev"]),
                    Y = new Set(["--merged", "--no-merged"]),
                    z = 2,
                    w = "";
                while (z < q.length) {
                    let H = q[z];
                    if (!H) {
                        z++;
                        continue
                    }
                    if (H.startsWith("-"))
                        if (H.includes("=")) w = H.split("=")[0] || "", z++;
                        else if (K.has(H)) w = H, z += 2;
                    else w = H, z++;
                    else {
                        let $ = q.slice(2, z),
                            O = $.includes("-l") || $.includes("--list"),
                            _ = Y.has(w);
                        if (!O && !_) return !0;
                        z++
                    }
                }
                return !1
            }
        },
        file: {
            safeFlags: {
                "--brief": "none",
                "-b": "none",
                "--mime": "none",
                "-i": "none",
                "--mime-type": "none",
                "--mime-encoding": "none",
                "--apple": "none",
                "--check-encoding": "none",
                "-c": "none",
                "--exclude": "string",
                "--exclude-quiet": "string",
                "--print0": "none",
                "-0": "none",
                "-f": "string",
                "-F": "string",
                "--separator": "string",
                "--help": "none",
                "--version": "none",
                "-v": "none",
                "--no-dereference": "none",
                "-h": "none",
                "--dereference": "none",
                "-L": "none",
                "--magic-file": "string",
                "-m": "string",
                "--keep-going": "none",
                "-k": "none",
                "--list": "none",
                "-l": "none",
                "--no-buffer": "none",
                "-n": "none",
                "--preserve-date": "none",
                "-p": "none",
                "--raw": "none",
                "-r": "none",
                "-s": "none",
                "--special-files": "none",
                "--uncompress": "none",
                "-z": "none"
            }
        },
        sed: {
            safeFlags: {
                "--expression": "string",
                "-e": "string",
                "--quiet": "none",
                "--silent": "none",
                "-n": "none",
                "--regexp-extended": "none",
                "-r": "none",
                "--posix": "none",
                "-E": "none",
                "--line-length": "number",
                "-l": "number",
                "--zero-terminated": "none",
                "-z": "none",
                "--separate": "none",
                "-s": "none",
                "--unbuffered": "none",
                "-u": "none",
                "--debug": "none",
                "--help": "none",
                "--version": "none"
            },
            additionalCommandIsDangerousCallback: (A) => !QU1(A)
        },
        "pip list": {
            safeFlags: {
                "--outdated": "none",
                "-o": "none",
                "--uptodate": "none",
                "-u": "none",
                "--editable": "none",
                "-e": "none",
                "--local": "none",
                "-l": "none",
                "--user": "none",
                "--pre": "none",
                "--format": "string",
                "--not-required": "none",
                "--exclude-editable": "none",
                "--include-editable": "none",
                "--exclude": "string",
                "--help": "none",
                "-h": "none",
                "--version": "none",
                "-V": "none",
                "--verbose": "none",
                "-v": "none",
                "--quiet": "none",
                "-q": "none",
                "--no-color": "none",
                "--no-input": "none",
                "--disable-pip-version-check": "none",
                "--no-python-version-warning": "none"
            }
        },
        sort: {
            safeFlags: {
                "--ignore-leading-blanks": "none",
                "-b": "none",
                "--dictionary-order": "none",
                "-d": "none",
                "--ignore-case": "none",
                "-f": "none",
                "--general-numeric-sort": "none",
                "-g": "none",
                "--human-numeric-sort": "none",
                "-h": "none",
                "--ignore-nonprinting": "none",
                "-i": "none",
                "--month-sort": "none",
                "-M": "none",
                "--numeric-sort": "none",
                "-n": "none",
                "--random-sort": "none",
                "-R": "none",
                "--reverse": "none",
                "-r": "none",
                "--sort": "string",
                "--stable": "none",
                "-s": "none",
                "--unique": "none",
                "-u": "none",
                "--version-sort": "none",
                "-V": "none",
                "--zero-terminated": "none",
                "-z": "none",
                "--key": "string",
                "-k": "string",
                "--field-separator": "string",
                "-t": "string",
                "--check": "none",
                "-c": "none",
                "--check-char-order": "none",
                "-C": "none",
                "--merge": "none",
                "-m": "none",
                "--buffer-size": "string",
                "-S": "string",
                "--parallel": "number",
                "--batch-size": "number",
                "--help": "none",
                "--version": "none"
            }
        },
        man: {
            safeFlags: {
                "-a": "none",
                "--all": "none",
                "-d": "none",
                "-f": "none",
                "--whatis": "none",
                "-h": "none",
                "-k": "none",
                "--apropos": "none",
                "-l": "string",
                "-w": "none",
                "-S": "string",
                "-s": "string"
            }
        },
        help: {
            safeFlags: {
                "-d": "none",
                "-m": "none",
                "-s": "none"
            }
        },
        "npm list": {
            safeFlags: {
                "--all": "none",
                "-a": "none",
                "--json": "none",
                "--long": "none",
                "-l": "none",
                "--global": "none",
                "-g": "none",
                "--depth": "number",
                "--omit": "string",
                "--include": "string",
                "--link": "none",
                "--workspace": "string",
                "-w": "string",
                "--workspaces": "none",
                "-ws": "none"
            }
        },
        "mcp-cli servers": {
            safeFlags: {
                "--json": "none"
            }
        },
        "mcp-cli tools": {
            safeFlags: {
                "--json": "none"
            }
        },
        "mcp-cli info": {
            safeFlags: {
                "--json": "none"
            }
        },
        "mcp-cli grep": {
            safeFlags: {
                "--json": "none",
                "-i": "none",
                "--ignore-case": "none"
            }
        },
        "mcp-cli resources": {
            safeFlags: {
                "--json": "none"
            }
        },
        "mcp-cli read": {
            safeFlags: {
                "--json": "none"
            }
        },
        netstat: {
            safeFlags: {
                "-a": "none",
                "-L": "none",
                "-l": "none",
                "-n": "none",
                "-f": "string",
                "-g": "none",
                "-i": "none",
                "-I": "string",
                "-s": "none",
                "-r": "none",
                "-m": "none",
                "-v": "none"
            }
        },
        ps: {
            safeFlags: {
                "-e": "none",
                "-A": "none",
                "-a": "none",
                "-d": "none",
                "-N": "none",
                "--deselect": "none",
                "-f": "none",
                "-F": "none",
                "-l": "none",
                "-j": "none",
                "-y": "none",
                "-w": "none",
                "-ww": "none",
                "--width": "number",
                "-c": "none",
                "-H": "none",
                "--forest": "none",
                "--headers": "none",
                "--no-headers": "none",
                "-n": "string",
                "--sort": "string",
                "-L": "none",
                "-T": "none",
                "-m": "none",
                "-C": "string",
                "-G": "string",
                "-g": "string",
                "-p": "string",
                "--pid": "string",
                "-q": "string",
                "--quick-pid": "string",
                "-s": "string",
                "--sid": "string",
                "-t": "string",
                "--tty": "string",
                "-U": "string",
                "-u": "string",
                "--user": "string",
                "--help": "none",
                "--info": "none",
                "-V": "none",
                "--version": "none"
            },
            additionalCommandIsDangerousCallback: (A) => {
                return /\s[a-zA-Z]*e[a-zA-Z]*(?:\s|$)/.test(A)
            }
        },
        base64: {
            safeFlags: {
                "-d": "none",
                "-D": "none",
                "--decode": "none",
                "-b": "number",
                "--break": "number",
                "-w": "number",
                "--wrap": "number",
                "-i": "string",
                "--input": "string",
                "--ignore-garbage": "none",
                "-h": "none",
                "--help": "none",
                "--version": "none"
            }
        },
        grep: {
            safeFlags: {
                "-e": "string",
                "--regexp": "string",
                "-f": "string",
                "--file": "string",
                "-F": "none",
                "--fixed-strings": "none",
                "-G": "none",
                "--basic-regexp": "none",
                "-E": "none",
                "--extended-regexp": "none",
                "-P": "none",
                "--perl-regexp": "none",
                "-i": "none",
                "--ignore-case": "none",
                "--no-ignore-case": "none",
                "-v": "none",
                "--invert-match": "none",
                "-w": "none",
                "--word-regexp": "none",
                "-x": "none",
                "--line-regexp": "none",
                "-c": "none",
                "--count": "none",
                "--color": "string",
                "--colour": "string",
                "-L": "none",
                "--files-without-match": "none",
                "-l": "none",
                "--files-with-matches": "none",
                "-m": "number",
                "--max-count": "number",
                "-o": "none",
                "--only-matching": "none",
                "-q": "none",
                "--quiet": "none",
                "--silent": "none",
                "-s": "none",
                "--no-messages": "none",
                "-b": "none",
                "--byte-offset": "none",
                "-H": "none",
                "--with-filename": "none",
                "-h": "none",
                "--no-filename": "none",
                "--label": "string",
                "-n": "none",
                "--line-number": "none",
                "-T": "none",
                "--initial-tab": "none",
                "-u": "none",
                "--unix-byte-offsets": "none",
                "-Z": "none",
                "--null": "none",
                "-z": "none",
                "--null-data": "none",
                "-A": "number",
                "--after-context": "number",
                "-B": "number",
                "--before-context": "number",
                "-C": "number",
                "--context": "number",
                "--group-separator": "string",
                "--no-group-separator": "none",
                "-a": "none",
                "--text": "none",
                "--binary-files": "string",
                "-D": "string",
                "--devices": "string",
                "-d": "string",
                "--directories": "string",
                "--exclude": "string",
                "--exclude-from": "string",
                "--exclude-dir": "string",
                "--include": "string",
                "-r": "none",
                "--recursive": "none",
                "-R": "none",
                "--dereference-recursive": "none",
                "--line-buffered": "none",
                "-U": "none",
                "--binary": "none",
                "--help": "none",
                "-V": "none",
                "--version": "none"
            }
        },
        rg: {
            safeFlags: {
                "-e": "string",
                "--regexp": "string",
                "-f": "string",
                "-i": "none",
                "--ignore-case": "none",
                "-S": "none",
                "--smart-case": "none",
                "-F": "none",
                "--fixed-strings": "none",
                "-w": "none",
                "--word-regexp": "none",
                "-v": "none",
                "--invert-match": "none",
                "-c": "none",
                "--count": "none",
                "-l": "none",
                "--files-with-matches": "none",
                "--files-without-match": "none",
                "-n": "none",
                "--line-number": "none",
                "-o": "none",
                "--only-matching": "none",
                "-A": "number",
                "--after-context": "number",
                "-B": "number",
                "--before-context": "number",
                "-C": "number",
                "--context": "number",
                "-H": "none",
                "-h": "none",
                "--heading": "none",
                "--no-heading": "none",
                "-q": "none",
                "--quiet": "none",
                "--column": "none",
                "-g": "string",
                "--glob": "string",
                "-t": "string",
                "--type": "string",
                "-T": "string",
                "--type-not": "string",
                "--type-list": "none",
                "--hidden": "none",
                "--no-ignore": "none",
                "-u": "none",
                "-m": "number",
                "--max-count": "number",
                "-d": "number",
                "--max-depth": "number",
                "-a": "none",
                "--text": "none",
                "-z": "none",
                "-L": "none",
                "--follow": "none",
                "--color": "string",
                "--json": "none",
                "--stats": "none",
                "--help": "none",
                "--version": "none",
                "--debug": "none",
                "--": "none"
            }
        },
        sha256sum: {
            safeFlags: {
                "-b": "none",
                "--binary": "none",
                "-t": "none",
                "--text": "none",
                "-c": "none",
                "--check": "none",
                "--ignore-missing": "none",
                "--quiet": "none",
                "--status": "none",
                "--strict": "none",
                "-w": "none",
                "--warn": "none",
                "--tag": "none",
                "-z": "none",
                "--zero": "none",
                "--help": "none",
                "--version": "none"
            }
        },
        sha1sum: {
            safeFlags: {
                "-b": "none",
                "--binary": "none",
                "-t": "none",
                "--text": "none",
                "-c": "none",
                "--check": "none",
                "--ignore-missing": "none",
                "--quiet": "none",
                "--status": "none",
                "--strict": "none",
                "-w": "none",
                "--warn": "none",
                "--tag": "none",
                "-z": "none",
                "--zero": "none",
                "--help": "none",
                "--version": "none"
            }
        },
        md5sum: {
            safeFlags: {
                "-b": "none",
                "--binary": "none",
                "-t": "none",
                "--text": "none",
                "-c": "none",
                "--check": "none",
                "--ignore-missing": "none",
                "--quiet": "none",
                "--status": "none",
                "--strict": "none",
                "-w": "none",
                "--warn": "none",
                "--tag": "none",
                "-z": "none",
                "--zero": "none",
                "--help": "none",
                "--version": "none"
            }
        },
        tree: {
            safeFlags: {
                "-a": "none",
                "-d": "none",
                "-l": "none",
                "-f": "none",
                "-x": "none",
                "-L": "number",
                "-R": "none",
                "-P": "string",
                "-I": "string",
                "--gitignore": "none",
                "--gitfile": "string",
                "--ignore-case": "none",
                "--matchdirs": "none",
                "--metafirst": "none",
                "--prune": "none",
                "--info": "none",
                "--infofile": "string",
                "--noreport": "none",
                "--charset": "string",
                "--filelimit": "number",
                "-q": "none",
                "-N": "none",
                "-Q": "none",
                "-p": "none",
                "-u": "none",
                "-g": "none",
                "-s": "none",
                "-h": "none",
                "--si": "none",
                "--du": "none",
                "-D": "none",
                "--timefmt": "string",
                "-F": "none",
                "--inodes": "none",
                "--device": "none",
                "-v": "none",
                "-t": "none",
                "-c": "none",
                "-U": "none",
                "-r": "none",
                "--dirsfirst": "none",
                "--filesfirst": "none",
                "--sort": "string",
                "-i": "none",
                "-A": "none",
                "-S": "none",
                "-n": "none",
                "-C": "none",
                "-X": "none",
                "-J": "none",
                "-H": "string",
                "--nolinks": "none",
                "--hintro": "string",
                "--houtro": "string",
                "-T": "string",
                "--hyperlink": "none",
                "--scheme": "string",
                "--authority": "string",
                "--fromfile": "none",
                "--fromtabfile": "none",
                "--fflinks": "none",
                "--help": "none",
                "--version": "none"
            }
        },
        date: {
            safeFlags: {
                "-d": "string",
                "--date": "string",
                "-r": "string",
                "--reference": "string",
                "-u": "none",
                "--utc": "none",
                "--universal": "none",
                "-I": "none",
                "--iso-8601": "string",
                "-R": "none",
                "--rfc-email": "none",
                "--rfc-3339": "string",
                "--debug": "none",
                "--help": "none",
                "--version": "none"
            },
            additionalCommandIsDangerousCallback: (A) => {
                let q = pz(A, (w) => `$${w}`);
                if (!q.success) return !0;
                let K = q.tokens.map((w) => {
                        if (typeof w === "string") return w;
                        if ("pattern" in w) return w.pattern;
                        return
                    }).filter((w) => w !== void 0),
                    Y = new Set(["-d", "--date", "-r", "--reference", "--iso-8601", "--rfc-3339"]),
                    z = 1;
                while (z < K.length) {
                    let w = K[z];
                    if (w.startsWith("--") && w.includes("=")) z++;
                    else if (w.startsWith("-"))
                        if (Y.has(w)) z += 2;
                        else z++;
                    else {
                        if (!w.startsWith("+")) return !0;
                        z++
                    }
                }
                return !1
            }
        },
        hostname: {
            safeFlags: {
                "-f": "none",
                "--fqdn": "none",
                "--long": "none",
                "-s": "none",
                "--short": "none",
                "-i": "none",
                "--ip-address": "none",
                "-I": "none",
                "--all-ip-addresses": "none",
                "-a": "none",
                "--alias": "none",
                "-d": "none",
                "--domain": "none",
                "-A": "none",
                "--all-fqdns": "none",
                "-v": "none",
                "--verbose": "none",
                "-h": "none",
                "--help": "none",
                "-V": "none",
                "--version": "none"
            },
            regex: /^hostname(?:\s+(?:-[a-zA-Z]|--[a-zA-Z-]+))*\s*$/
        },
        info: {
            safeFlags: {
                "-f": "string",
                "--file": "string",
                "-d": "string",
                "--directory": "string",
                "-n": "string",
                "--node": "string",
                "-a": "none",
                "--all": "none",
                "-k": "string",
                "--apropos": "string",
                "-w": "none",
                "--where": "none",
                "--location": "none",
                "--show-options": "none",
                "--vi-keys": "none",
                "--subnodes": "none",
                "-h": "none",
                "--help": "none",
                "--usage": "none",
                "--version": "none"
            }
        },
        pyright: {
            safeFlags: {
                "--outputjson": "none",
                "--project": "string",
                "-p": "string",
                "--pythonversion": "string",
                "--pythonplatform": "string",
                "--typeshedpath": "string",
                "--venvpath": "string",
                "--level": "string",
                "--stats": "none",
                "--verbose": "none",
                "--version": "none",
                "--dependencies": "none",
                "--warnings": "none"
            },
            additionalCommandIsDangerousCallback: (A) => {
                let q = pz(A, (Y) => `$${Y}`);
                if (!q.success) return !0;
                return q.tokens.map((Y) => typeof Y === "string" ? Y : ("pattern" in Y) ? Y.pattern : void 0).filter((Y) => Y !== void 0).some((Y) => Y === "--watch" || Y === "-w")
            }
        },
        "docker compose ps": {
            safeFlags: {
                "--format": "string",
                "--filter": "string",
                "--quiet": "none",
                "-q": "none",
                "--services": "none",
                "--status": "string",
                "--all": "none",
                "-a": "none",
                "--no-trunc": "none",
                "--orphans": "none"
            }
        },
        "docker compose logs": {
            safeFlags: {
                "--follow": "none",
                "-f": "none",
                "--tail": "string",
                "-n": "string",
                "--timestamps": "none",
                "-t": "none",
                "--no-color": "none",
                "--no-log-prefix": "none",
                "--since": "string",
                "--until": "string"
            }
        },
        "docker compose top": {
            safeFlags: {}
        },
        "docker compose config": {
            safeFlags: {
                "--format": "string",
                "--services": "none",
                "--volumes": "none",
                "--profiles": "none"
            }
        },
        "docker logs": {
            safeFlags: {
                "--follow": "none",
                "-f": "none",
                "--tail": "string",
                "-n": "string",
                "--timestamps": "none",
                "-t": "none",
                "--since": "string",
                "--until": "string",
                "--details": "none"
            }
        },
        "docker inspect": {
            safeFlags: {
                "--format": "string",
                "-f": "string",
                "--type": "string",
                "--size": "none",
                "-s": "none"
            }
        }
    };
    PcY = ["echo", "printf", "wc", "grep", "head", "tail"];
    ZcY = ["cal", "uptime", "cat", "head", "tail", "wc", "stat", "strings", "hexdump", "od", "nl", "id", "uname", "free", "df", "du", "locale", "groups", "nproc", "docker ps", "docker images", "basename", "dirname", "realpath", "cut", "paste", "tr", "column", "tac", "rev", "fold", "expand", "unexpand", "readlink", "diff", "true", "false", "sleep", "which", "type"], fcY = new Set([...ZcY.map(GcY), /^echo(?:\s+(?:'[^']*'|"[^"$<>\n\r]*"|[^|;&`$(){}><#\\!"'\s]+))*(?:\s+2>&1)?\s*$/, /^claude -h$/, /^claude --help$/, /^uniq(?:\s+(?:-[a-zA-Z]+|--[a-zA-Z-]+(?:=\S+)?|-[fsw]\s+\d+))*(?:\s|$)\s*$/, /^pwd$/, /^whoami$/, /^node -v$/, /^npm -v$/, /^python --version$/, /^python3 --version$/, /^history(?:\s+\d+)?\s*$/, /^alias$/, /^arch(?:\s+(?:--help|-h))?\s*$/, /^ip addr$/, /^ifconfig(?:\s+[a-zA-Z][a-zA-Z0-9_-]*)?\s*$/, /^jq(?!\s+.*(?:-f\b|--from-file|--rawfile|--slurpfile|--run-tests|-L\b|--library-path|\benv\b|\$ENV\b))(?:\s+(?:-[a-zA-Z]+|--[a-zA-Z-]+(?:=\S+)?))*(?:\s+'[^'`]*'|\s+"[^"`]*"|\s+[^-\s'"][^\s]*)+\s*$/, /^cd(?:\s+(?:'[^']*'|"[^"]*"|[^\s;|&`$(){}><#\\]+))?$/, /^ls(?:\s+[^<>()$`|{}&;\n\r]*)?$/, /^find(?:\s+(?:\\[()]|(?!-delete\b|-exec\b|-execdir\b|-ok\b|-okdir\b|-fprint0?\b|-fls\b|-fprintf\b)[^<>()$`|{}&;\n\r\s]|\s)+)?$/])
})
// @from(Ln 384619, Col 0)
function P6q(A) {
    if (!A) return !1;
    if (A.type === "assistant") {
        let q = gP(A.message.content);
        return q?.type === "text" || q?.type === "thinking" || q?.type === "redacted_thinking"
    }
    if (A.type === "user") {
        let q = A.message.content;
        if (!Array.isArray(q) || q.length === 0) return !1;
        return q.every((K) => ("type" in K) && K.type === "tool_result")
    }
    return !1
}
// @from(Ln 384633, Col 0)
function* ZhA(A) {
    switch (A.type) {
        case "assistant":
            for (let q of iO([A])) {
                if (!et(q)) continue;
                yield {
                    type: "assistant",
                    message: q.message,
                    parent_tool_use_id: null,
                    session_id: U6(),
                    uuid: q.uuid,
                    error: q.error
                }
            }
            return;
        case "progress":
            if (A.data.type === "agent_progress")
                for (let q of iO([A.data.message])) switch (q.type) {
                    case "assistant":
                        if (!et(q)) break;
                        yield {
                            type: "assistant", message: q.message, parent_tool_use_id: A.parentToolUseID, session_id: U6(), uuid: q.uuid, error: q.error
                        };
                        break;
                    case "user":
                        yield {
                            type: "user", message: q.message, parent_tool_use_id: A.parentToolUseID, session_id: U6(), uuid: q.uuid, isSynthetic: q.isMeta || q.isVisibleInTranscriptOnly, tool_use_result: q.mcpMeta ? {
                                content: q.toolUseResult,
                                ...q.mcpMeta
                            } : q.toolUseResult
                        };
                        break
                } else if (A.data.type === "bash_progress") {
                    if (!J6(process.env.CLAUDE_CODE_REMOTE) && !process.env.CLAUDE_CODE_CONTAINER_ID) break;
                    let q = A.parentToolUseID,
                        K = Date.now(),
                        Y = dU1.get(q) || 0;
                    if (K - Y >= RcY) {
                        if (dU1.size >= LcY) {
                            let w = dU1.keys().next().value;
                            if (w !== void 0) dU1.delete(w)
                        }
                        dU1.set(q, K), yield {
                            type: "tool_progress",
                            tool_use_id: A.toolUseID,
                            tool_name: "Bash",
                            parent_tool_use_id: A.parentToolUseID,
                            elapsed_time_seconds: A.data.elapsedTimeSeconds,
                            session_id: U6(),
                            uuid: A.uuid
                        }
                    }
                } break;
        case "user":
            for (let q of iO([A])) yield {
                type: "user",
                message: q.message,
                parent_tool_use_id: null,
                session_id: U6(),
                uuid: q.uuid,
                isSynthetic: q.isMeta || q.isVisibleInTranscriptOnly,
                tool_use_result: q.mcpMeta ? {
                    content: q.toolUseResult,
                    ...q.mcpMeta
                } : q.toolUseResult
            };
            return;
        default:
    }
}
// @from(Ln 384703, Col 0)
async function* W6q(A, q, K, Y) {
    let z = !qk(),
        {
            permissionResult: w,
            assistantMessage: H
        } = A,
        {
            toolUseID: $
        } = w;
    if (!$) return;
    let O = H.message.content,
        _;
    if (Array.isArray(O)) {
        for (let G of O)
            if (G.type === "tool_use" && G.id === $) {
                _ = G;
                break
            }
    }
    if (!_) return;
    let {
        name: J,
        input: X
    } = _;
    if (!q.find((G) => G.name === J)) return;
    let j = X;
    if (w.behavior === "allow")
        if (w.updatedInput !== void 0) j = w.updatedInput;
        else K1(Error(`Orphaned permission for ${J}: updatedInput is undefined, falling back to original tool input`));
    let M = {
            ..._,
            input: j
        },
        P = async () => ({
            ...w,
            decisionReason: {
                type: "mode",
                mode: "default"
            }
        });
    if (K.push(H), z) await bI(K);
    yield {
        ...H,
        session_id: U6(),
        parent_tool_use_id: null
    };
    for await (let G of tZ6([M], [H], P, Y)) if (G.message) {
        if (K.push(G.message), z) await bI(K);
        yield {
            ...G.message,
            session_id: U6(),
            parent_tool_use_id: null
        }
    }
}
// @from(Ln 384759, Col 0)
function A91(A, q, K = kcY) {
    let Y = Rp(K),
        z = new Map,
        w = new Map;
    for (let H of A)
        if (H.type === "assistant" && Array.isArray(H.message.content)) {
            for (let $ of H.message.content)
                if ($.type === "tool_use" && $.name === Jq) {
                    let O = $.input;
                    if (O?.file_path && O?.offset === void 0 && O?.limit === void 0) {
                        let _ = g4(O.file_path, q);
                        z.set($.id, _)
                    }
                } else if ($.type === "tool_use" && $.name === f5) {
                let O = $.input;
                if (O?.file_path && O?.content) {
                    let _ = g4(O.file_path, q);
                    w.set($.id, {
                        filePath: _,
                        content: O.content
                    })
                }
            }
        } for (let H of A)
        if (H.type === "user" && Array.isArray(H.message.content)) {
            for (let $ of H.message.content)
                if ($.type === "tool_result" && $.tool_use_id) {
                    let O = z.get($.tool_use_id);
                    if (O && typeof $.content === "string") {
                        let D = $.content.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "").split(`
`).map((j) => {
                            let M = j.match(/^\s*\d+\u2192(.*)$/);
                            return M ? M[1] : j
                        }).join(`
`).trim();
                        if (H.timestamp) {
                            let j = new Date(H.timestamp).getTime();
                            Y.set(O, {
                                content: D,
                                timestamp: j,
                                offset: void 0,
                                limit: void 0
                            })
                        }
                    }
                    let _ = w.get($.tool_use_id);
                    if (_ && H.timestamp) {
                        let J = new Date(H.timestamp).getTime();
                        Y.set(_.filePath, {
                            content: _.content,
                            timestamp: J,
                            offset: void 0,
                            limit: void 0
                        })
                    }
                }
        } return Y
}
// @from(Ln 384817, Col 4)
kcY = 10
// @from(Ln 384818, Col 4)
LcY = 100
// @from(Ln 384819, Col 4)
RcY = 30000
// @from(Ln 384820, Col 4)
dU1
// @from(Ln 384821, Col 4)
Jf6 = v(() => {
    P61();
    pM();
    _H();
    SD();
    Ez();
    hA();
    lq();
    N8();
    B6();
    $hA();
    y6();
    dU1 = new Map
})
// @from(Ln 384856, Col 0)
function cU1(A) {
    xcY(A, {
        recursive: !0,
        force: !0,
        maxRetries: 3,
        retryDelay: 100
    }, () => {})
}
// @from(Ln 384865, Col 0)
function Df6(A) {
    return q91(YC1(), "speculation", String(process.pid), A)
}
// @from(Ln 384869, Col 0)
function Xf6(A, q) {
    return {
        behavior: "deny",
        message: A,
        decisionReason: {
            type: "other",
            reason: q
        }
    }
}
// @from(Ln 384880, Col 0)
function FcY(A, q, K) {
    let Y = !0;
    for (let z of q) {
        let w = q91(A, z),
            H = q91(K, z);
        try {
            Z6q(f6q(H), {
                recursive: !0
            }), G6q(w, H)
        } catch {
            Y = !1, h(`[Speculation] Failed to copy ${z} to main`)
        }
    }
    return Y
}
// @from(Ln 384896, Col 0)
function jf6(A, q, K, Y, z, w, H) {
    c("tengu_speculation", {
        speculation_id: A,
        outcome: q,
        duration_ms: Date.now() - K,
        suggestion_length: Y,
        tools_executed: VhA(z),
        completed: w !== null,
        coordinator_mode: KY(),
        boundary_type: w?.type,
        boundary_tool: QcY(w),
        boundary_detail: gcY(w),
        ...H
    })
}
// @from(Ln 384912, Col 0)
function VhA(A) {
    return A.filter(NhA).flatMap((q) => q.message.content).filter((q) => typeof q === "object" && q !== null && ("type" in q)).filter((q) => q.type === "tool_result" && !q.is_error).length
}
// @from(Ln 384916, Col 0)
function QcY(A) {
    if (!A) return;
    switch (A.type) {
        case "bash":
            return "Bash";
        case "edit":
        case "denied_tool":
            return A.toolName;
        case "complete":
            return
    }
}
// @from(Ln 384929, Col 0)
function gcY(A) {
    if (!A) return;
    switch (A.type) {
        case "bash":
            return A.command.slice(0, 200);
        case "edit":
            return A.filePath;
        case "denied_tool":
            return A.detail;
        case "complete":
            return
    }
}
// @from(Ln 384943, Col 0)
function NhA(A) {
    return A.type === "user" && "message" in A && Array.isArray(A.message.content)
}
// @from(Ln 384947, Col 0)
function UcY(A) {
    let q = (w) => typeof w === "object" && w !== null && w.type === "tool_result" && typeof w.tool_use_id === "string",
        K = (w) => !w.is_error && !(typeof w.content === "string" && w.content.includes(YN)),
        Y = new Set(A.filter(NhA).flatMap((w) => w.message.content).filter(q).filter(K).map((w) => w.tool_use_id)),
        z = (w) => w.type !== "thinking" && w.type !== "redacted_thinking" && !(w.type === "tool_use" && !Y.has(w.id)) && !(w.type === "tool_result" && !Y.has(w.tool_use_id));
    return A.map((w) => {
        if (!("message" in w) || !Array.isArray(w.message.content)) return w;
        let H = w.message.content.filter(z);
        if (H.length === w.message.content.length) return w;
        if (H.length === 0) return null;
        if (!H.some((O) => O.type !== "text" || O.text !== void 0 && O.text.trim() !== "")) return null;
        return {
            ...w,
            message: {
                ...w.message,
                content: H
            }
        }
    }).filter((w) => w !== null)
}
// @from(Ln 384968, Col 0)
function pcY(A, q, K, Y) {
    return null
}
// @from(Ln 384972, Col 0)
function QG1(A, q) {
    A((K) => {
        if (K.speculation.status !== "active") return K;
        let Y = K.speculation,
            z = q(Y);
        if (!Object.entries(z).some(([H, $]) => Y[H] !== $)) return K;
        return {
            ...K,
            speculation: {
                ...Y,
                ...z
            }
        }
    })
}
// @from(Ln 384988, Col 0)
function fhA(A) {
    A((q) => {
        if (q.speculation.status === "idle") return q;
        return {
            ...q,
            speculation: Y91
        }
    })
}
// @from(Ln 384998, Col 0)
function ThA() {
    return h("[Speculation] enabled=false"), !1
}
// @from(Ln 385001, Col 0)
async function dcY(A, q, K, Y, z) {
    try {
        let w = await A.toolUseContext.getAppState(),
            H = EhA(w);
        if (H) {
            uI(`pipeline_${H}`);
            return
        }
        let $ = {
                ...A,
                messages: [...A.messages, c6({
                    content: q
                }), ...K]
            },
            O = R61(z);
        if (O.signal.aborted) return;
        let _ = Mf6(),
            {
                suggestion: J,
                generationRequestId: X
            } = await khA($, O, _);
        if (O.signal.aborted) return;
        if (LhA(J, _)) return;
        h(`[Speculation] Pipelined suggestion: "${J.slice(0,50)}..."`), QG1(Y, () => ({
            pipelinedSuggestion: {
                text: J,
                promptId: _,
                generationRequestId: X
            }
        }))
    } catch (w) {
        if (w instanceof Error && w.name === "AbortError") return;
        h(`[Speculation] Pipelined suggestion failed: ${w instanceof Error?w.message:String(w)}`)
    }
}
// @from(Ln 385036, Col 0)
async function vhA(A, q, K, Y = !1, z) {
    if (!ThA()) return;
    K91(K);
    let w = ycY().slice(0, 8),
        H = R61(q.toolUseContext.abortController);
    if (H.signal.aborted) return;
    let $ = Date.now(),
        O = {
            current: []
        },
        _ = {
            current: new Set
        },
        J = Df6(w),
        X = Ex();
    try {
        await ScY(J, {
            recursive: !0
        })
    } catch {
        h("[Speculation] Failed to create overlay directory");
        return
    }
    let D = {
        current: q
    };
    K((j) => ({
        ...j,
        speculation: {
            status: "active",
            id: w,
            abort: () => H.abort(),
            startTime: $,
            messagesRef: O,
            writtenPathsRef: _,
            boundary: null,
            suggestionLength: A.length,
            toolUseCount: 0,
            isPipelined: Y,
            contextRef: D
        }
    })), h(`[Speculation] Starting speculation ${w}`);
    try {
        let j = await av({
            promptMessages: [c6({
                content: A
            })],
            cacheSafeParams: z ?? tt(q),
            skipTranscript: !0,
            canUseTool: async (M, P) => {
                let W = BcY.has(M.name),
                    G = mcY.has(M.name);
                if (W) {
                    let Z = await q.toolUseContext.getAppState(),
                        {
                            mode: N,
                            isBypassPermissionsModeAvailable: T
                        } = Z.toolPermissionContext;
                    if (!(N === "acceptEdits" || N === "bypassPermissions" || N === "plan" && T)) {
                        h(`[Speculation] Stopping at file edit: ${M.name}`);
                        let y = "file_path" in P ? P.file_path : void 0;
                        return QG1(K, () => ({
                            boundary: {
                                type: "edit",
                                toolName: M.name,
                                filePath: y ?? "",
                                completedAt: Date.now()
                            }
                        })), H.abort(), Xf6("Speculation paused: file edit requires permission", "speculation_edit_boundary")
                    }
                }
                if (W || G) {
                    let Z = "notebook_path" in P ? "notebook_path" : ("path" in P) ? "path" : "file_path",
                        N = P[Z];
                    if (N) {
                        let T = IcY(X, N);
                        if (hcY(T) || T.startsWith("..")) {
                            if (W) return h(`[Speculation] Denied ${M.name}: path outside cwd: ${N}`), Xf6("Write outside cwd not allowed during speculation", "speculation_write_outside_root");
                            return {
                                behavior: "allow",
                                updatedInput: P,
                                decisionReason: {
                                    type: "other",
                                    reason: "speculation_read_outside_root"
                                }
                            }
                        }
                        if (W) {
                            if (!_.current.has(T)) {
                                let k = q91(J, T);
                                Z6q(f6q(k), {
                                    recursive: !0
                                });
                                try {
                                    G6q(q91(X, T), k)
                                } catch {}
                                _.current.add(T)
                            }
                            P = {
                                ...P,
                                [Z]: q91(J, T)
                            }
                        } else if (_.current.has(T)) P = {
                            ...P,
                            [Z]: q91(J, T)
                        };
                        return h(`[Speculation] ${W?"Write":"Read"} ${N} -> ${P[Z]}`), {
                            behavior: "allow",
                            updatedInput: P,
                            decisionReason: {
                                type: "other",
                                reason: "speculation_file_access"
                            }
                        }
                    }
                    if (G) return {
                        behavior: "allow",
                        updatedInput: P,
                        decisionReason: {
                            type: "other",
                            reason: "speculation_read_default_cwd"
                        }
                    }
                }
                if (M.name === "Bash") {
                    let Z = "command" in P && typeof P.command === "string" ? P.command : "";
                    if (!Z || Of6({
                            command: Z
                        }, Pf6(Z)).behavior !== "allow") return h(`[Speculation] Stopping at bash: ${Z.slice(0,50)||"missing command"}`), QG1(K, () => ({
                        boundary: {
                            type: "bash",
                            command: Z,
                            completedAt: Date.now()
                        }
                    })), H.abort(), Xf6("Speculation paused: bash boundary", "speculation_bash_boundary");
                    return {
                        behavior: "allow",
                        updatedInput: P,
                        decisionReason: {
                            type: "other",
                            reason: "speculation_readonly_bash"
                        }
                    }
                }
                h(`[Speculation] Stopping at denied tool: ${M.name}`);
                let f = String("url" in P && P.url || "file_path" in P && P.file_path || "path" in P && P.path || "command" in P && P.command || "").slice(0, 200);
                return QG1(K, () => ({
                    boundary: {
                        type: "denied_tool",
                        toolName: M.name,
                        detail: f,
                        completedAt: Date.now()
                    }
                })), H.abort(), Xf6(`Tool ${M.name} not allowed during speculation`, "speculation_unknown_tool")
            },
            querySource: "speculation",
            forkLabel: "speculation",
            maxTurns: bcY,
            overrides: {
                abortController: H,
                requireCanUseTool: !0
            },
            onMessage: (M) => {
                if (M.type === "assistant" || M.type === "user") {
                    if (O.current.push(M), O.current.length >= ucY) H.abort();
                    if (NhA(M)) {
                        let P = M.message.content.filter((W) => W.type === "tool_result" && !W.is_error).length;
                        if (P > 0) QG1(K, (W) => ({
                            toolUseCount: W.toolUseCount + P
                        }))
                    }
                }
            }
        });
        if (H.signal.aborted) return;
        QG1(K, () => ({
            boundary: {
                type: "complete",
                completedAt: Date.now(),
                outputTokens: j.totalUsage.output_tokens
            }
        })), h(`[Speculation] Complete: ${VhA(O.current)} tools`), dcY(D.current, A, O.current, K, H)
    } catch (j) {
        if (H.abort(), j instanceof Error && j.name === "AbortError") {
            cU1(J), fhA(K);
            return
        }
        cU1(J), K1(j instanceof Error ? j : Error("Speculation failed")), jf6(w, "error", $, A.length, O.current, null, {
            error_type: j instanceof Error ? j.name : "Unknown",
            error_message: (j instanceof Error ? j.message : String(j)).slice(0, 200),
            error_phase: "start",
            is_pipelined: Y
        }), fhA(K)
    }
}
// @from(Ln 385232, Col 0)
function ccY(A, q, K) {
    if (A.status !== "active") return null;
    let {
        id: Y,
        messagesRef: z,
        writtenPathsRef: w,
        abort: H,
        startTime: $,
        suggestionLength: O,
        isPipelined: _
    } = A, J = z.current, X = Df6(Y), D = Date.now();
    if (H(), K > 0) FcY(X, w.current, Ex());
    cU1(X);
    let j = A.boundary,
        M = Math.min(D, j?.completedAt ?? 1 / 0) - $;
    if (q((P) => {
            if (P.speculation.status === "active" && P.speculation.boundary) j = P.speculation.boundary, M = Math.min(D, j.completedAt ?? 1 / 0) - $;
            return {
                ...P,
                speculation: Y91,
                speculationSessionTimeSavedMs: P.speculationSessionTimeSavedMs + M
            }
        }), h(j === null ? `[Speculation] Accept ${Y}: still running, using ${J.length} messages` : `[Speculation] Accept ${Y}: already complete`), jf6(Y, "accepted", $, O, J, j, {
            message_count: J.length,
            time_saved_ms: M,
            is_pipelined: _
        }), M > 0) {
        let P = {
            type: "speculation-accept",
            timestamp: new Date().toISOString(),
            timeSavedMs: M
        };
        CcY(dO(), Q1(P) + `
`, {
            mode: 384
        }).catch(() => {
            h("[Speculation] Failed to write speculation-accept to transcript")
        })
    }
    return {
        messages: J,
        boundary: j,
        timeSavedMs: M
    }
}
// @from(Ln 385278, Col 0)
function K91(A) {
    A((q) => {
        if (q.speculation.status !== "active") return q;
        let {
            id: K,
            abort: Y,
            startTime: z,
            boundary: w,
            suggestionLength: H,
            messagesRef: $,
            isPipelined: O
        } = q.speculation;
        return h(`[Speculation] Aborting ${K}`), jf6(K, "aborted", z, H, $.current, w, {
            abort_reason: "user_typed",
            is_pipelined: O
        }), Y(), cU1(Df6(K)), {
            ...q,
            speculation: Y91
        }
    })
}