
// @from(Ln 407521, Col 19)
eEK
// @from(Ln 407521, Col 24)
j0Y
// @from(Ln 407521, Col 29)
J0Y
// @from(Ln 407521, Col 34)
P0Y
// @from(Ln 407521, Col 39)
D0Y
// @from(Ln 407522, Col 4)
KyK = L(() => {
    S_7();
    Re();
    oEK();
    aEK = new Set(["pwsh", "pwsh.exe", "powershell", "powershell.exe"]);
    QWY = new Set(["/", "–", "—", "―"]);
    iWY = new Set(["invoke-webrequest", "iwr", "invoke-restmethod", "irm", "new-object", "start-bitstransfer"]);
    eEK = new Set(["where-object", "sort-object", "select-object", "group-object", "format-table", "format-list", "format-wide", "format-custom"]);
    j0Y = new Set(["register-scheduledtask", "new-scheduledtask", "new-scheduledtaskaction", "set-scheduledtask"]);
    J0Y = new Set(["set-item", "si", "new-item", "ni", "remove-item", "ri", "del", "rm", "rd", "rmdir", "erase", "clear-item", "cli", "set-content", "add-content", "ac"]);
    P0Y = new Set(["set-alias", "sal", "new-alias", "nal", "set-variable", "sv", "new-variable", "nv"]);
    D0Y = new Set(["invoke-wmimethod", "iwmi", "invoke-cimmethod"])
})
// @from(Ln 407538, Col 0)
async function zyK(q) {
    let K = q.trim();
    if (!K) return "";
    let _ = await SI6(K);
    return J_7(_)[0] ?? ""
}
// @from(Ln 407545, Col 0)
function v0Y(q) {
    return qR8(q)
}
// @from(Ln 407549, Col 0)
function D_6(q) {
    if (q.includes(`
`) || q.includes("*")) return [];
    return KR8(I5, q)
}
// @from(Ln 407555, Col 0)
function I_7(q, K, _, z) {
    let Y = q.command.trim();

    function A(M, P) {
        return M.toLowerCase() === P.toLowerCase()
    }

    function O(M, P) {
        return M.toLowerCase().startsWith(P.toLowerCase())
    }

    function w(M) {
        if (z === "allow") return M;
        return Sc8(M)
    }
    let $ = Y.split(/\s+/)[0] ?? "",
        j = Sc8($),
        H = BY(j),
        J = Y.slice($.length).replace(/^\s+/, " "),
        X = H + J;
    return Array.from(K.entries()).filter(([M]) => {
        let P = v0Y(M);

        function W(D) {
            switch (P.type) {
                case "exact":
                    return A(P.command, D);
                case "prefix":
                    switch (_) {
                        case "exact":
                            return A(P.prefix, D);
                        case "prefix": {
                            if (A(D, P.prefix)) return !0;
                            return O(D, P.prefix + " ")
                        }
                    }
                    break;
                case "wildcard":
                    if (_ === "exact") return !1;
                    return Vk(P.pattern, D, !0, !0)
            }
        }
        if (W(Y)) return !0;
        if (W(X)) return !0;
        if (P.type === "exact") {
            let D = P.command.split(/\s+/)[0] ?? "";
            if (BY(w(D)) === H) {
                let G = P.command.slice(D.length).replace(/^\s+/, " ");
                if (A(G, J)) return !0
            }
        } else if (P.type === "prefix") {
            let D = P.prefix.split(/\s+/)[0] ?? "";
            if (BY(w(D)) === H) {
                let G = P.prefix.slice(D.length).replace(/^\s+/, " "),
                    f = H + G;
                if (_ === "exact") {
                    if (A(f, X)) return !0
                } else if (A(X, f) || O(X, f + " ")) return !0
            }
        } else if (P.type === "wildcard") {
            let D = P.pattern.split(/\s+/)[0] ?? "";
            if (BY(w(D)) === H && _ !== "exact") {
                let G = P.pattern.slice(D.length).replace(/^\s+/, " "),
                    f = H + G;
                if (Vk(f, X, !0, !0)) return !0
            }
        }
        return !1
    }).map(([, M]) => M)
}
// @from(Ln 407626, Col 0)
function mI6(q, K, _) {
    let z = qP6(K, I5, "deny"),
        Y = I_7(q, z, _, "deny"),
        A = qP6(K, I5, "ask"),
        O = I_7(q, A, _, "ask"),
        w = qP6(K, I5, "allow"),
        $ = I_7(q, w, _, "allow");
    return {
        matchingDenyRules: Y,
        matchingAskRules: O,
        matchingAllowRules: $
    }
}
// @from(Ln 407640, Col 0)
function YyK(q, K) {
    let _ = q.command.trim(),
        {
            matchingDenyRules: z,
            matchingAskRules: Y,
            matchingAllowRules: A
        } = mI6(q, K, "exact");
    if (z[0] !== void 0) return {
        behavior: "deny",
        message: `Permission to use ${I5} with command ${_} has been denied.`,
        decisionReason: {
            type: "rule",
            rule: z[0]
        }
    };
    if (Y[0] !== void 0) return {
        behavior: "ask",
        message: Qz(I5),
        decisionReason: {
            type: "rule",
            rule: Y[0]
        }
    };
    if (A[0] !== void 0) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "rule",
            rule: A[0]
        }
    };
    let O = {
        type: "other",
        reason: "This command requires approval"
    };
    return {
        behavior: "passthrough",
        message: Qz(I5, O),
        decisionReason: O,
        suggestions: D_6(_)
    }
}
// @from(Ln 407683, Col 0)
function T0Y(q, K) {
    let _ = q.command.trim(),
        z = YyK(q, K);
    if (z.behavior === "deny" || z.behavior === "ask") return z;
    let {
        matchingDenyRules: Y,
        matchingAskRules: A,
        matchingAllowRules: O
    } = mI6(q, K, "prefix");
    if (Y[0] !== void 0) return {
        behavior: "deny",
        message: `Permission to use ${I5} with command ${_} has been denied.`,
        decisionReason: {
            type: "rule",
            rule: Y[0]
        }
    };
    if (A[0] !== void 0) return {
        behavior: "ask",
        message: Qz(I5),
        decisionReason: {
            type: "rule",
            rule: A[0]
        }
    };
    if (z.behavior === "allow") return z;
    if (O[0] !== void 0) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "rule",
            rule: O[0]
        }
    };
    let w = {
        type: "other",
        reason: "This command requires approval"
    };
    return {
        behavior: "passthrough",
        message: Qz(I5, w),
        decisionReason: w,
        suggestions: D_6(_)
    }
}
// @from(Ln 407728, Col 0)
async function V0Y(q, K) {
    if (!q.valid) return [{
        text: K,
        element: {
            name: await zyK(K),
            nameType: "unknown",
            elementType: "CommandAst",
            args: [],
            text: K
        },
        statement: null,
        isSafeOutput: !1
    }];
    let _ = [];
    for (let z of q.statements) {
        for (let Y of z.commands) {
            if (Y.elementType !== "CommandAst") continue;
            _.push({
                text: Y.text,
                element: Y,
                statement: z,
                isSafeOutput: Y.nameType !== "application" && eM6(Y.name) && Y.args.length === 0
            })
        }
        if (z.nestedCommands)
            for (let Y of z.nestedCommands) _.push({
                text: Y.text,
                element: Y,
                statement: z,
                isSafeOutput: Y.nameType !== "application" && eM6(Y.name) && Y.args.length === 0
            })
    }
    if (_.length > 0) return _;
    return [{
        text: K,
        element: {
            name: await zyK(K),
            nameType: "unknown",
            elementType: "CommandAst",
            args: [],
            text: K
        },
        statement: null,
        isSafeOutput: !1
    }]
}
// @from(Ln 407774, Col 0)
async function AyK(q, K) {
    let _ = K.getAppState().toolPermissionContext,
        z = q.command.trim();
    if (!z) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "Empty command is safe"
        }
    };
    let Y = await SI6(z),
        A = YyK(q, _);
    if (A.behavior === "deny") return A;
    let {
        matchingDenyRules: O,
        matchingAskRules: w
    } = mI6(q, _, "prefix");
    if (O[0] !== void 0) return {
        behavior: "deny",
        message: `Permission to use ${I5} with command ${z} has been denied.`,
        decisionReason: {
            type: "rule",
            rule: O[0]
        }
    };
    let $ = null;
    if (w[0] !== void 0) $ = {
        behavior: "ask",
        message: Qz(I5),
        decisionReason: {
            type: "rule",
            rule: w[0]
        }
    };
    if ($ === null && Gp(z)) $ = {
        behavior: "ask",
        message: "Command contains a UNC path that could trigger network requests"
    };
    if (A.behavior === "allow" && !Y.valid && $ === null && H_7(z.split(/\s+/)[0] ?? "") !== "application") return A;
    if (!Y.valid) {
        let S = z.replace(/<#[\s\S]*?#>/g, " ").replace(/`[\r\n]+\s*/g, "").replaceAll("`", "");
        for (let U of S.split(/[;|\n\r{}()&]+/)) {
            let g = U.trim();
            if (!g) continue;
            let c = g.split(/\s+/);
            for (let n = 0; n < c.length; n++) {
                let l = c[n].replace(/^['"]|['"]$/g, "");
                if (!l) continue;
                if (BY(l) === "remove-item")
                    for (let e of c.slice(n + 1)) {
                        if (qg.has(e[0] ?? "")) continue;
                        if (Fc8(e)) return II6(e)
                    }
                let z6 = [l, ...c.slice(n + 1)].join(" "),
                    {
                        matchingDenyRules: A6
                    } = mI6({
                        command: z6
                    }, _, "prefix");
                if (A6[0] !== void 0) return {
                    behavior: "deny",
                    message: `Permission to use ${I5} with command ${z} has been denied.`,
                    decisionReason: {
                        type: "rule",
                        rule: A6[0]
                    }
                }
            }
        }
        if ($ !== null) return $;
        let F = {
            type: "other",
            reason: `Command contains malformed syntax that cannot be parsed: ${Y.errors[0]?.message??"unknown error"}`
        };
        return {
            behavior: "ask",
            decisionReason: F,
            message: Qz(I5, F)
        }
    }
    let j = await V0Y(Y, z),
        H = [];
    if ($ !== null) H.push($);
    let J = qyK(z, Y);
    if (J.behavior !== "passthrough") {
        let S = {
            type: "other",
            reason: J.behavior === "ask" && J.message ? J.message : "This command contains patterns that could pose security risks and requires approval"
        };
        H.push({
            behavior: "ask",
            message: Qz(I5, S),
            decisionReason: S,
            suggestions: D_6(z)
        })
    }
    if (Y.hasUsingStatements) {
        let S = {
            type: "other",
            reason: "Command contains a `using` statement that may load external code (module or assembly)"
        };
        H.push({
            behavior: "ask",
            message: Qz(I5, S),
            decisionReason: S,
            suggestions: D_6(z)
        })
    }
    if (Y.hasScriptRequirements) {
        let S = {
            type: "other",
            reason: "Command contains a `#Requires` directive that may trigger module loading"
        };
        H.push({
            behavior: "ask",
            message: Qz(I5, S),
            decisionReason: S,
            suggestions: D_6(z)
        })
    }
    if (Y.hasBackgroundJob) {
        let S = {
            type: "other",
            reason: "Command uses the background job operator (`&`) which spawns a child PowerShell process"
        };
        H.push({
            behavior: "ask",
            message: Qz(I5, S),
            decisionReason: S,
            suggestions: D_6(z)
        })
    }
    let X = /^(?:[\w.]+\\)?(env|hklm|hkcu|function|alias|variable|cert|wsman|registry)::?/i;

    function M(S) {
        let F = S;
        if (F.length > 0 && qg.has(F[0])) {
            let U = F.indexOf(":", 1);
            if (U > 0) F = F.substring(U + 1)
        }
        return F.replaceAll("`", "")
    }

    function P(S) {
        let F = M(S);
        if (X.test(F)) return {
            behavior: "ask",
            message: `Command argument '${S}' uses a non-filesystem provider path and requires approval`
        };
        if (Gp(F)) return {
            behavior: "ask",
            message: `Command argument '${S}' contains a UNC path that could trigger network requests`
        };
        return null
    }
    q: for (let S of Y.statements) {
        for (let F of S.commands) {
            if (F.elementType !== "CommandAst") continue;
            for (let U of F.args) {
                let g = P(U);
                if (g !== null) {
                    H.push(g);
                    break q
                }
            }
        }
        if (S.nestedCommands)
            for (let F of S.nestedCommands)
                for (let U of F.args) {
                    let g = P(U);
                    if (g !== null) {
                        H.push(g);
                        break q
                    }
                }
    }
    for (let {
            text: S,
            element: F
        }
        of j) {
        let U = F.name !== "" ? [F.name, ...F.args].join(" ") : null,
            g = {
                command: S
            },
            {
                matchingDenyRules: c,
                matchingAskRules: n
            } = mI6(g, _, "prefix"),
            l = c[0],
            z6 = n[0];
        if (l === void 0 && U !== null) {
            let {
                matchingDenyRules: A6,
                matchingAskRules: e
            } = mI6({
                command: U
            }, _, "prefix");
            if (l = A6[0], z6 === void 0) z6 = e[0]
        }
        if (l !== void 0) H.push({
            behavior: "deny",
            message: `Permission to use ${I5} with command ${z} has been denied.`,
            decisionReason: {
                type: "rule",
                rule: l
            }
        });
        else if (z6 !== void 0) H.push({
            behavior: "ask",
            message: Qz(I5),
            decisionReason: {
                type: "rule",
                rule: z6
            }
        })
    }
    let W = j.length > 1 && j.some(({
            element: S
        }) => m38(S.name)),
        D = j.length > 1 && j.some(({
            element: S
        }) => v_7(S)),
        Z = j.some(({
            element: S
        }) => BY(S.name) === "git");
    if (W && Z) H.push({
        behavior: "ask",
        message: "Compound commands with cd/Set-Location and git require approval to prevent bare repository attacks"
    });
    if (Z && kQ6()) H.push({
        behavior: "ask",
        message: "Git command in a directory with bare-repository indicators (HEAD, objects/, refs/ in cwd without .git/HEAD). Git may execute hooks from cwd."
    });
    if (Z) {
        let S = j.some(({
                element: U,
                statement: g
            }) => {
                for (let n of U.redirections ?? [])
                    if (u38(n.target)) return !0;
                let c = BY(U.name);
                if (!_yK.has(c)) return !1;
                if (U.args.flatMap((n) => n.split(",")).some((n) => u38(n))) return !0;
                if (g !== null)
                    for (let n of g.commands) {
                        if (n.elementType === "CommandAst") continue;
                        if (u38(n.text)) return !0
                    }
                return !1
            }),
            F = bc8(Y).some((U) => u38(U.target));
        if (S || F) H.push({
            behavior: "ask",
            message: "Command writes to a git-internal path (HEAD, objects/, refs/, hooks/, .git/) and runs git. This could plant a malicious hook that git then executes."
        })
    }
    if (j.some(({
            element: S
        }) => {
            let F = S.name.toLowerCase(),
                U = F.slice(Math.max(F.lastIndexOf("\\"), F.lastIndexOf("/")) + 1);
            return G0Y.has(U)
        }) && j.length > 1) H.push({
        behavior: "ask",
        message: Z ? "Compound command extracts an archive and runs git. Archive contents may plant bare-repository indicators (HEAD, hooks/, refs/) that git then treats as the repository root." : "Compound command extracts an archive followed by other commands. Archive contents (symlinks, config files) cannot be validated and may redirect subsequent path operations."
    });
    if (j.some(({
            element: F
        }) => {
            for (let g of F.redirections ?? [])
                if (Ic8(g.target)) return !0;
            let U = BY(F.name);
            if (!_yK.has(U)) return !1;
            return F.args.flatMap((g) => g.split(",")).some(Ic8)
        }) || bc8(Y).some((F) => Ic8(F.target))) H.push({
        behavior: "ask",
        message: "Command writes to .git/ — hooks or config planted there execute on the next git operation."
    });
    let f = lEK(q, Y, _, W);
    if (f.behavior !== "passthrough") H.push(f);
    if (A.behavior === "allow" && j[0] !== void 0 && j.every((S) => S.element.nameType !== "application" && !OW(S.text, S.element))) H.push(A);
    if (xc8(z, Y)) H.push({
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "Command is read-only and safe to execute"
        }
    });
    if (bc8(Y).length > 0) H.push({
        behavior: "ask",
        message: "Command contains file redirections that could write to arbitrary paths",
        suggestions: D_6(z)
    });
    let V = T_7(q, Y, _);
    if (V.behavior !== "passthrough") H.push(V);
    let k = H.find((S) => S.behavior === "deny");
    if (k !== void 0) return k;
    let N = H.find((S) => S.behavior === "ask");
    if (N !== void 0) return N;
    let R = H.find((S) => S.behavior === "allow");
    if (R !== void 0) return R;
    let h = j.filter(({
            element: S,
            isSafeOutput: F
        }) => {
            if (F) return !1;
            if (S.nameType === "application") return !0;
            if (BY(S.name) === "set-location" && S.args.length > 0) {
                let g = S.args.find((c) => c.length === 0 || !qg.has(c[0]));
                if (g && f0Y(b8(), g) === b8()) return !1
            }
            return !0
        }),
        C = [],
        x = new Set;
    for (let {
            text: S,
            element: F,
            statement: U
        }
        of h) {
        let c = T0Y({
            command: S
        }, _);
        if (c.behavior === "deny") return {
            behavior: "deny",
            message: `Permission to use ${I5} with command ${z} has been denied.`,
            decisionReason: c.decisionReason
        };
        if (c.behavior === "ask") {
            if (U !== null) x.add(U);
            C.push(S);
            continue
        }
        if (c.behavior === "allow" && F.nameType !== "application" && !D) {
            if (OW(S, F)) {
                if (U !== null) x.add(U);
                C.push(S);
                continue
            }
            continue
        }
        if (c.behavior === "allow") {
            if (U !== null) x.add(U);
            C.push(S);
            continue
        }
        if (U !== null && !W && !D && f_7(U) && tM6(F, S)) continue;
        if (U !== null && !W && !D) {
            if (T_7({
                    command: S
                }, {
                    valid: !0,
                    errors: [],
                    variables: Y.variables,
                    hasStopParsing: Y.hasStopParsing,
                    originalCommand: S,
                    statements: [U]
                }, _).behavior === "allow") continue
        }
        if (U !== null) x.add(U);
        C.push(S)
    }
    for (let S of Y.statements)
        if (!f_7(S) && !x.has(S)) C.push(S.text);
    if (C.length === 0) {
        if (wL(Y).hasScriptBlocks) return {
            behavior: "ask",
            message: Qz(I5),
            decisionReason: {
                type: "other",
                reason: "Pipeline consists of output-formatting cmdlets with script blocks — block content cannot be verified"
            }
        };
        return {
            behavior: "allow",
            updatedInput: q,
            decisionReason: {
                type: "other",
                reason: "All pipeline commands are individually allowed"
            }
        }
    }
    let B = {
            type: "other",
            reason: "This command requires approval"
        },
        m = [];
    for (let S of C) m.push(...D_6(S));
    return {
        behavior: "passthrough",
        message: Qz(I5, B),
        decisionReason: B,
        suggestions: m
    }
}
// @from(Ln 408173, Col 4)
_yK
// @from(Ln 408173, Col 9)
G0Y
// @from(Ln 408174, Col 4)
OyK = L(() => {
    n7();
    pK();
    g$();
    NK6();
    Re();
    Zy6();
    IEK();
    UEK();
    nEK();
    KyK();
    bI6();
    _yK = new Set(["new-item", "set-content", "add-content", "out-file", "copy-item", "move-item", "rename-item", "expand-archive", "invoke-webrequest", "invoke-restmethod", "tee-object", "export-csv", "export-clixml"]), G0Y = new Set(["tar", "tar.exe", "bsdtar", "bsdtar.exe", "unzip", "unzip.exe", "7z", "7z.exe", "7za", "7za.exe", "gzip", "gzip.exe", "gunzip", "gunzip.exe", "expand-archive"])
})
// @from(Ln 408189, Col 0)
function BI6(q = process.env) {
    let K = q.BASH_DEFAULT_TIMEOUT_MS;
    if (K) {
        let _ = parseInt(K, 10);
        if (!isNaN(_) && _ > 0) return _
    }
    return 120000
}
// @from(Ln 408198, Col 0)
function gc8(q = process.env) {
    let K = q.BASH_MAX_TIMEOUT_MS;
    if (K) {
        let _ = parseInt(K, 10);
        if (!isNaN(_) && _ > 0) return Math.max(_, BI6(q))
    }
    return Math.max(600000, BI6(q))
}
// @from(Ln 408207, Col 0)
function Uc8() {
    return BI6()
}
// @from(Ln 408211, Col 0)
function F38() {
    return gc8()
}
// @from(Ln 408215, Col 0)
function k0Y() {
    if (S6(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS)) return null;
    return "  - You can use the `run_in_background` parameter to run the command in the background. Only use this if you don't need the result immediately and are OK being notified when the command completes later. You do not need to check the output right away - you'll be notified when it finishes."
}
// @from(Ln 408220, Col 0)
function N0Y() {
    if (S6(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS)) return null;
    return "  - Avoid unnecessary `Start-Sleep` commands:\n    - Do not sleep between commands that can run immediately — just run them.\n    - If your command is long running and you would like to be notified when it finishes — simply run your command using `run_in_background`. There is no need to sleep in this case.\n    - Do not retry failing commands in a sleep loop — diagnose the root cause or consider an alternative approach.\n    - If waiting for a background task you started with `run_in_background`, you will be notified when it completes — do not poll.\n    - If you must poll an external process, use a check command rather than sleeping first.\n    - If you must sleep, keep the duration short to avoid blocking the user."
}
// @from(Ln 408225, Col 0)
function E0Y(q) {
    if (q === "desktop") return "PowerShell edition: Windows PowerShell 5.1 (powershell.exe)\n   - Pipeline chain operators `&&` and `||` are NOT available — they cause a parser error. To run B only if A succeeds: `A; if ($?) { B }`. To chain unconditionally: `A; B`.\n   - Ternary (`?:`), null-coalescing (`??`), and null-conditional (`?.`) operators are NOT available. Use `if/else` and explicit `$null -eq` checks instead.\n   - Avoid `2>&1` on native executables. In 5.1, redirecting a native command's stderr inside PowerShell wraps each line in an ErrorRecord (NativeCommandError) and sets `$?` to `$false` even when the exe returned exit code 0. stderr is already captured for you — don't redirect it.\n   - Default file encoding is UTF-16 LE (with BOM). When writing files other tools will read, pass `-Encoding utf8` to `Out-File`/`Set-Content`.\n   - `ConvertFrom-Json` returns a PSCustomObject, not a hashtable. `-AsHashtable` is not available.";
    if (q === "core") return "PowerShell edition: PowerShell 7+ (pwsh)\n   - Pipeline chain operators `&&` and `||` ARE available and work like bash. Prefer `cmd1 && cmd2` over `cmd1; cmd2` when cmd2 should only run if cmd1 succeeds.\n   - Ternary (`$cond ? $a : $b`), null-coalescing (`??`), and null-conditional (`?.`) operators are available.\n   - Default file encoding is UTF-8 without BOM.";
    return "PowerShell edition: unknown — assume Windows PowerShell 5.1 for compatibility\n   - Do NOT use `&&`, `||`, ternary `?:`, null-coalescing `??`, or null-conditional `?.`. These are PowerShell 7+ only and parser-error on 5.1.\n   - To chain commands conditionally: `A; if ($?) { B }`. Unconditionally: `A; B`."
}
// @from(Ln 408230, Col 0)
async function wyK() {
    let q = k0Y(),
        K = N0Y(),
        _ = await lU8();
    return `Executes a given PowerShell command with optional timeout. Working directory persists between commands; shell state (variables, functions) does not.

IMPORTANT: This tool is for terminal operations via PowerShell: git, npm, docker, and PS cmdlets. DO NOT use it for file operations (reading, writing, editing, searching, finding files) - use the specialized tools for this instead.

${E0Y(_)}

Before executing the command, please follow these steps:

1. Directory Verification:
   - If the command will create new directories or files, first use \`Get-ChildItem\` (or \`ls\`) to verify the parent directory exists and is the correct location

2. Command Execution:
   - Always quote file paths that contain spaces with double quotes
   - Capture the output of the command.

PowerShell Syntax Notes:
   - Variables use $ prefix: $myVar = "value"
   - Escape character is backtick (\`), not backslash
   - Use Verb-Noun cmdlet naming: Get-ChildItem, Set-Location, New-Item, Remove-Item
   - Common aliases: ls (Get-ChildItem), cd (Set-Location), cat (Get-Content), rm (Remove-Item)
   - Pipe operator | works similarly to bash but passes objects, not text
   - Use Select-Object, Where-Object, ForEach-Object for filtering and transformation
   - String interpolation: "Hello $name" or "Hello $($obj.Property)"
   - Registry access uses PSDrive prefixes: \`HKLM:\\SOFTWARE\\...\`, \`HKCU:\\...\` — NOT raw \`HKEY_LOCAL_MACHINE\\...\`
   - Environment variables: read with \`$env:NAME\`, set with \`$env:NAME = "value"\` (NOT \`Set-Variable\` or bash \`export\`)
   - Call native exe with spaces in path via call operator: \`& "C:\\Program Files\\App\\app.exe" arg1 arg2\`

Interactive and blocking commands (will hang — this tool runs with -NonInteractive):
   - NEVER use \`Read-Host\`, \`Get-Credential\`, \`Out-GridView\`, \`$Host.UI.PromptForChoice\`, or \`pause\`
   - Destructive cmdlets (\`Remove-Item\`, \`Stop-Process\`, \`Clear-Content\`, etc.) may prompt for confirmation. Add \`-Confirm:$false\` when you intend the action to proceed. Use \`-Force\` for read-only/hidden items.
   - Never use \`git rebase -i\`, \`git add -i\`, or other commands that open an interactive editor

Passing multiline strings (commit messages, file content) to native executables:
   - Use a single-quoted here-string so PowerShell does not expand \`$\` or backticks inside. The closing \`'@\` MUST be at column 0 (no leading whitespace) on its own line — indenting it is a parse error:
<example>
git commit -m @'
Commit message here.
Second line with $literal dollar signs.
'@
</example>
   - Use \`@'...'@\` (single-quoted, literal) not \`@"..."@\` (double-quoted, interpolated) unless you need variable expansion
   - For arguments containing \`-\`, \`@\`, or other characters PowerShell parses as operators, use the stop-parsing token: \`git log --% --format=%H\`

Usage notes:
  - The command argument is required.
  - You can specify an optional timeout in milliseconds (up to ${F38()}ms / ${F38()/60000} minutes). If not specified, commands will timeout after ${Uc8()}ms (${Uc8()/60000} minutes).
  - It is very helpful if you write a clear, concise description of what this command does.
  - If the output exceeds ${Lb6()} characters, output will be truncated before being returned to you.
${q?q+`
`:""}  - Avoid using PowerShell to run commands that have dedicated tools, unless explicitly instructed:
    - File search: Use ${T9} (NOT Get-ChildItem -Recurse)
    - Content search: Use ${a5} (NOT Select-String)
    - Read files: Use ${xq} (NOT Get-Content)
    - Edit files: Use ${J4}
    - Write files: Use ${IK} (NOT Set-Content/Out-File)
    - Communication: Output text directly (NOT Write-Output/Write-Host)
  - When issuing multiple commands:
    - If the commands are independent and can run in parallel, make multiple ${I5} tool calls in a single message.
    - If the commands depend on each other and must run sequentially, chain them in a single ${I5} call (see edition-specific chaining syntax above).
    - Use \`;\` only when you need to run commands sequentially but don't care if earlier commands fail.
    - DO NOT use newlines to separate commands (newlines are ok in quoted strings and here-strings)
  - Do NOT prefix commands with \`cd\` or \`Set-Location\` -- the working directory is already set to the correct project directory automatically.
${K?K+`
`:""}  - For git commands:
    - Prefer to create a new commit rather than amending an existing commit.
    - Before running destructive operations (e.g., git reset --hard, git push --force, git checkout --), consider whether there is a safer alternative that achieves the same goal. Only use destructive operations when they are truly the best approach.
    - Never skip hooks (--no-verify) or bypass signing (--no-gpg-sign, -c commit.gpgsign=false) unless the user has explicitly asked for it. If a hook fails, investigate and fix the underlying issue.`
}
// @from(Ln 408302, Col 4)
$yK = L(() => {
    Q8();
    P58();
    Rb6();
    Rz();
    u$();
    jJ()
})
// @from(Ln 408311, Col 0)
function HyK(q, {
    verbose: K,
    theme: _
}) {
    let {
        command: z
    } = q;
    if (!z) return null;
    let Y = z;
    if (!K) {
        let A = Y.split(`
`),
            O = A.length > jyK,
            w = Y.length > x_7;
        if (O || w) {
            let $ = Y;
            if (O) $ = A.slice(0, jyK).join(`
`);
            if ($.length > x_7) $ = $.slice(0, x_7);
            return d_.createElement(T, null, $.trim(), "…")
        }
    }
    return Y
}
// @from(Ln 408336, Col 0)
function JyK(q, {
    verbose: K,
    tools: _,
    terminalSize: z,
    inProgressToolCallCount: Y
}) {
    let A = q.at(-1);
    if (!A || !A.data) return d_.createElement(_1, {
        height: 1
    }, d_.createElement(T, {
        dimColor: !0
    }, "Running…"));
    let O = A.data;
    return d_.createElement(gC6, {
        fullOutput: O.fullOutput,
        output: O.output,
        elapsedTimeSeconds: O.elapsedTimeSeconds,
        totalLines: O.totalLines,
        totalBytes: O.totalBytes,
        timeoutMs: O.timeoutMs,
        taskId: O.taskId,
        verbose: K
    })
}
// @from(Ln 408361, Col 0)
function XyK() {
    return d_.createElement(_1, {
        height: 1
    }, d_.createElement(T, {
        dimColor: !0
    }, "Waiting…"))
}
// @from(Ln 408369, Col 0)
function MyK(q, K, {
    verbose: _,
    theme: z,
    tools: Y,
    style: A
}) {
    let w = K.at(-1)?.data?.timeoutMs,
        {
            stdout: $,
            stderr: j,
            interrupted: H,
            returnCodeInterpretation: J,
            isImage: X,
            backgroundTaskId: M
        } = q;
    if (X) return d_.createElement(_1, {
        height: 1
    }, d_.createElement(T, {
        dimColor: !0
    }, "[Image data detected and sent to Claude]"));
    return d_.createElement(u, {
        flexDirection: "column"
    }, $ !== "" ? d_.createElement(LR, {
        content: $,
        verbose: _
    }) : null, j.trim() !== "" ? d_.createElement(LR, {
        content: j,
        verbose: _,
        isError: !0
    }) : null, $ === "" && j.trim() === "" ? d_.createElement(_1, {
        height: 1
    }, d_.createElement(T, {
        dimColor: !0
    }, M ? d_.createElement(d_.Fragment, null, "Running in the background", " ", d_.createElement(A8, {
        chord: "down",
        action: "manage",
        parens: !0
    })) : H ? "Interrupted" : J || "(No output)")) : null, w ? d_.createElement(_1, null, d_.createElement(pX6, {
        timeoutMs: w
    })) : null)
}
// @from(Ln 408411, Col 0)
function PyK(q, {
    verbose: K,
    progressMessagesForMessage: _,
    tools: z
}) {
    return d_.createElement(d$, {
        result: q,
        verbose: K
    })
}
// @from(Ln 408421, Col 4)
d_
// @from(Ln 408421, Col 8)
jyK = 2
// @from(Ln 408422, Col 4)
x_7 = 160
// @from(Ln 408423, Col 4)
WyK = L(() => {
    u7();
    ny();
    GK();
    Bj6();
    wg8();
    Og8();
    g6();
    d_ = K6(P6(), 1)
})
// @from(Ln 408433, Col 4)
Qd8 = {}
// @from(Ln 408445, Col 0)
function x0Y(q) {
    let K = q.trim();
    if (!K) return {
        isSearch: !1,
        isRead: !1
    };
    let _ = K.split(/\s*[;|]\s*/).filter(Boolean);
    if (_.length === 0) return {
        isSearch: !1,
        isRead: !1
    };
    let z = !1,
        Y = !1,
        A = !1;
    for (let O of _) {
        let w = O.trim().split(/\s+/)[0];
        if (!w) continue;
        let $ = BY(w);
        if (I0Y.has($)) continue;
        A = !0;
        let j = C0Y.has($),
            H = b0Y.has($);
        if (!j && !H) return {
            isSearch: !1,
            isRead: !1
        };
        if (j) z = !0;
        if (H) Y = !0
    }
    if (!A) return {
        isSearch: !1,
        isRead: !1
    };
    return {
        isSearch: z,
        isRead: Y
    }
}
// @from(Ln 408484, Col 0)
function p0Y(q) {
    let K = q.trim().split(/\s+/)[0];
    if (!K) return !0;
    let _ = BY(K);
    return !B0Y.includes(_)
}
// @from(Ln 408491, Col 0)
function TyK(q) {
    let K = q.trim().split(/[;|&\r\n]/)[0]?.trim() ?? "",
        _ = /^(?:start-sleep|sleep)(?:\s+-s(?:econds)?)?\s+(\d+(?:\.\d*)?)\s*$/i.exec(K);
    if (!_) return null;
    let z = parseFloat(_[1]);
    if (z < iU8) return null;
    let Y = q.trim().slice(K.length).replace(/^[\s;|&]+/, "");
    return Y ? `Start-Sleep ${z} followed by: ${Y}` : `standalone Start-Sleep ${z}`
}
// @from(Ln 408501, Col 0)
function GyK() {
    return y1() === "windows" && Z7.isSandboxEnabledInSettings() && !Z7.areUnsandboxedCommandsAllowed()
}
// @from(Ln 408505, Col 0)
function Qc8(q) {
    let _ = q.trim().split(/\s+/)[0] || "";
    for (let z of U0Y)
        if (_.toLowerCase() === z.toLowerCase()) return z;
    return "other"
}
// @from(Ln 408511, Col 0)
async function* Q0Y({
    input: q,
    abortController: K,
    taskRegistry: _,
    abortSpeculation: z,
    setToolJSX: Y,
    emitToolProgress: A,
    preventCwdChanges: O,
    isMainThread: w,
    toolUseId: $,
    agentId: j,
    sessionEnvVars: H
}) {
    let {
        command: J,
        description: X,
        timeout: M,
        run_in_background: P,
        dangerouslyDisableSandbox: W
    } = q, D = Math.min(M || Uc8(), F38()), Z = "", G = "", f = 0, v = 0, V = void 0, k = !1, N = !1, R = null;

    function h() {
        return new Promise((l) => {
            R = () => l(null)
        })
    }
    let C = !pI6 && p0Y(J);
    if (!await $e()) return {
        stdout: "",
        stderr: "PowerShell is not available on this system.",
        code: 0,
        interrupted: !1
    };
    let B;
    try {
        B = await al(J, K.signal, "powershell", {
            timeout: D,
            onProgress(l, z6, A6, e, i) {
                G = l, Z = z6, f = A6, v = i ? e : 0
            },
            preventCwdChanges: O,
            shouldUseSandbox: y1() === "windows" ? !1 : AL({
                command: J,
                dangerouslyDisableSandbox: W
            }),
            shouldAutoBackground: C,
            sessionEnvVars: H
        })
    } catch (l) {
        return j6(l), {
            stdout: "",
            stderr: `Failed to execute PowerShell command: ${b6(l)}`,
            code: 0,
            interrupted: !1
        }
    }
    let m = B.result;
    async function S() {
        return (await Y_6({
            command: J,
            description: X || J,
            shellCommand: B,
            toolUseId: $,
            agentId: j
        }, {
            abortController: K,
            taskRegistry: _,
            abortSpeculation: z
        })).taskId
    }

    function F(l, z6) {
        if (c) {
            if (!cc8(c, B, X || J, _, z, $)) return;
            V = c, d(l, {
                command_type: Qc8(J)
            }), z6?.(c);
            return
        }
        S().then((A6) => {
            V = A6;
            let e = R;
            if (e) R = null, e();
            if (d(l, {
                    command_type: Qc8(J)
                }), z6) z6(A6)
        })
    }
    if (B.onTimeout && C) B.onTimeout((l) => {
        F("tengu_powershell_command_timeout_backgrounded", l)
    });
    if (P === !0 && !pI6) {
        let l = await S();
        return d("tengu_powershell_command_explicitly_backgrounded", {
            command_type: Qc8(J)
        }), {
            stdout: "",
            stderr: "",
            code: 0,
            interrupted: !1,
            backgroundTaskId: l
        }
    }
    uw.startPolling(B.taskOutput.taskId);
    let U = Date.now(),
        g = U + ZyK,
        c = void 0,
        n = null;
    try {
        while (!0) {
            let l = Date.now(),
                z6 = Math.max(0, g - l),
                A6 = h(),
                e = await Promise.race([m, new Promise((J6) => setTimeout(($6) => $6(null), z6, J6).unref()), A6]);
            if (e !== null) {
                if (n = e, e.backgroundTaskId !== void 0) {
                    if (lc8(e.backgroundTaskId, e, _)) I$(e.backgroundTaskId, FI6(e), {
                        toolUseId: $,
                        summary: X || J
                    });
                    let J6 = {
                            ...e,
                            backgroundTaskId: void 0
                        },
                        {
                            taskOutput: $6
                        } = B;
                    if ($6.stdoutToFile && !$6.outputFileRedundant) J6.outputFilePath = $6.path, J6.outputFileSize = $6.outputFileSize, J6.outputTaskId = $6.taskId;
                    return J6
                }
                return e
            }
            if (V) return {
                stdout: k ? Z : "",
                stderr: "",
                code: 0,
                interrupted: !1,
                backgroundTaskId: V,
                assistantAutoBackgrounded: N
            };
            if (K.signal.aborted && K.signal.reason === "interrupt" && !k) {
                if (k = !0, !pI6) {
                    F("tengu_powershell_command_interrupt_backgrounded");
                    continue
                }
                B.kill()
            }
            if (c) {
                if (B.status === "backgrounded") return {
                    stdout: "",
                    stderr: "",
                    code: 0,
                    interrupted: !1,
                    backgroundTaskId: c,
                    backgroundedByUser: !0
                }
            }
            let i = Date.now() - U,
                O6 = Math.floor(i / 1000);
            if (!pI6 && V === void 0 && O6 >= ZyK / 1000) {
                if (!c) c = dc8({
                    command: J,
                    description: X || J,
                    shellCommand: B,
                    agentId: j
                }, _, $);
                if (Y?.({
                        jsx: u_7.createElement(G96, null),
                        shouldHidePromptInput: !1,
                        shouldContinueAnimation: !0,
                        showSpinner: !0
                    }), $) A?.({
                    kind: "background_hint",
                    toolUseId: $
                })
            }
            yield {
                type: "progress",
                fullOutput: Z,
                output: G,
                elapsedTimeSeconds: O6,
                totalLines: f,
                totalBytes: v,
                taskId: B.taskOutput.taskId,
                ...M ? {
                    timeoutMs: D
                } : void 0
            }, g = Date.now() + u0Y
        }
    } finally {
        if (uw.stopPolling(B.taskOutput.taskId), !V && B.status !== "backgrounded") {
            if (c) nc8(c, n ? FI6(n) : "stopped", _);
            B.cleanup()
        }
    }
}
// @from(Ln 408707, Col 4)
u_7
// @from(Ln 408707, Col 9)
DyK = `
`
// @from(Ln 408709, Col 4)
C0Y
// @from(Ln 408709, Col 9)
b0Y
// @from(Ln 408709, Col 14)
I0Y
// @from(Ln 408709, Col 19)
ZyK = 2000
// @from(Ln 408710, Col 4)
u0Y = 1000
// @from(Ln 408711, Col 4)
m0Y = 15000
// @from(Ln 408712, Col 4)
B0Y
// @from(Ln 408712, Col 9)
fyK = "Enterprise policy requires sandboxing, but sandboxing is not available on native Windows. Shell command execution is blocked on this platform by policy."
// @from(Ln 408713, Col 4)
pI6
// @from(Ln 408713, Col 9)
vyK
// @from(Ln 408713, Col 14)
F0Y
// @from(Ln 408713, Col 19)
g0Y
// @from(Ln 408713, Col 24)
U0Y
// @from(Ln 408713, Col 29)
KP6
// @from(Ln 408714, Col 4)
PI6 = L(() => {
    p7();
    y8();
    C8();
    gq();
    pl();
    q68();
    Q8();
    m8();
    c7();
    U8();
    Jk();
    NK();
    Rc8();
    $G();
    yY();
    BP();
    g96();
    X58();
    Rb6();
    EH();
    hb6();
    mj6();
    ND();
    xM6();
    $K8();
    eU8();
    zt();
    z78();
    kEK();
    OyK();
    $yK();
    bI6();
    WyK();
    u_7 = K6(P6(), 1), C0Y = new Set(["select-string", "get-childitem", "findstr", "where.exe"]), b0Y = new Set(["get-content", "get-item", "test-path", "resolve-path", "get-process", "get-service", "get-childitem", "get-location", "get-filehash", "get-acl", "format-hex"]), I0Y = new Set(["write-output", "write-host"]);
    B0Y = ["start-sleep", "sleep"];
    pI6 = S6(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS), vyK = C6(() => y.strictObject({
        command: y.string().describe("The PowerShell command to execute"),
        timeout: qL(y.number().optional()).describe(`Optional timeout in milliseconds (max ${F38()})`),
        description: y.string().optional().describe("Clear, concise description of what this command does in active voice."),
        run_in_background: _W(y.boolean().optional()).describe("Set to true to run this command in the background. Use Read to read the output later."),
        dangerouslyDisableSandbox: _W(y.boolean().optional()).describe("Set this to true to dangerously override sandbox mode and run commands without sandboxing.")
    })), F0Y = C6(() => pI6 ? vyK().omit({
        run_in_background: !0
    }) : vyK()), g0Y = C6(() => y.object({
        stdout: y.string().describe("The standard output of the command"),
        stderr: y.string().describe("The standard error output of the command"),
        interrupted: y.boolean().describe("Whether the command was interrupted"),
        returnCodeInterpretation: y.string().optional().describe("Semantic interpretation for non-error exit codes with special meaning"),
        isImage: y.boolean().optional().describe("Flag to indicate if stdout contains image data"),
        persistedOutputPath: y.string().optional().describe("Path to persisted full output when too large for inline"),
        persistedOutputSize: y.number().optional().describe("Total output size in bytes when persisted"),
        backgroundTaskId: y.string().optional().describe("ID of the background task if command is running in background"),
        backgroundedByUser: y.boolean().optional().describe("True if the user manually backgrounded the command with Ctrl+B"),
        assistantAutoBackgrounded: y.boolean().optional().describe("True if the command was auto-backgrounded by the assistant-mode blocking budget")
    })), U0Y = ["npm", "yarn", "pnpm", "node", "python", "python3", "go", "cargo", "make", "docker", "terraform", "webpack", "vite", "jest", "pytest", "curl", "Invoke-WebRequest", "build", "test", "serve", "watch", "dev"];
    KP6 = Iq({
        name: I5,
        searchHint: "execute Windows PowerShell commands",
        maxResultSizeChars: 30000,
        strict: !0,
        async description({
            description: q
        }) {
            return q || "Run PowerShell command"
        },
        async prompt() {
            return wyK()
        },
        isConcurrencySafe(q) {
            return this.isReadOnly?.(q) ?? !1
        },
        isSearchOrReadCommand(q) {
            if (!q.command) return {
                isSearch: !1,
                isRead: !1
            };
            return x0Y(q.command)
        },
        isReadOnly(q) {
            if (gEK(q.command)) return !1;
            return xc8(q.command)
        },
        toAutoClassifierInput(q) {
            return q.command
        },
        get inputSchema() {
            return F0Y()
        },
        get outputSchema() {
            return g0Y()
        },
        userFacingName() {
            return "PowerShell"
        },
        getToolUseSummary(q) {
            if (!q?.command) return null;
            let {
                command: K,
                description: _
            } = q;
            if (_) return _;
            return w5(K, av)
        },
        getActivityDescription(q) {
            if (!q?.command) return "Running command";
            return `Running ${q.description??w5(q.command,av)}`
        },
        isEnabled() {
            return !0
        },
        async validateInput(q) {
            if (GyK()) return {
                result: !1,
                message: fyK,
                errorCode: 11
            };
            if (KF() && !pI6 && !q.run_in_background) {
                let K = TyK(q.command);
                if (K !== null) return {
                    result: !1,
                    message: `Blocked: ${K}. To wait for a condition, use Monitor with an until-loop (e.g. \`until <check>; do sleep 2; done\` — Monitor runs bash). To wait for a command you started, use run_in_background: true. Do not chain shorter sleeps to work around this block.`,
                    errorCode: 10
                }
            }
            return {
                result: !0
            }
        },
        async checkPermissions(q, K) {
            return await AyK(q, K)
        },
        renderToolUseMessage: HyK,
        renderToolUseProgressMessage: JyK,
        renderToolUseQueuedMessage: XyK,
        renderToolResultMessage: MyK,
        renderToolUseErrorMessage: PyK,
        mapToolResultToToolResultBlockParam({
            interrupted: q,
            stdout: K,
            stderr: _,
            isImage: z,
            persistedOutputPath: Y,
            persistedOutputSize: A,
            backgroundTaskId: O,
            backgroundedByUser: w,
            assistantAutoBackgrounded: $
        }, j) {
            if (z) {
                let M = oU8(K, j);
                if (M) return M
            }
            let H = K;
            if (Y) {
                let M = K ? K.replace(/^(\s*\n)+/, "").trimEnd() : "",
                    P = se6(M, KL6);
                H = lK6({
                    filepath: Y,
                    originalSize: A ?? 0,
                    isJson: !1,
                    preview: P.preview,
                    hasMore: P.hasMore
                })
            } else if (K) H = K.replace(/^(\s*\n)+/, ""), H = H.trimEnd();
            let J = _.trim();
            if (q) {
                if (_) J += DyK;
                J += "<error>Command was aborted before completion</error>"
            }
            let X = "";
            if (O) {
                let M = $A(O);
                if ($) X = `Command exceeded the assistant-mode blocking budget (${m0Y/1000}s) and was moved to the background with ID: ${O}. It is still running — you will be notified when it completes. Output is being written to: ${M}. In assistant mode, delegate long-running work to a subagent or use run_in_background to keep this conversation responsive.`;
                else if (w) X = `Command was manually backgrounded by user with ID: ${O}. Output is being written to: ${M}`;
                else X = `Command running in background with ID: ${O}. Output is being written to: ${M}`
            }
            return {
                tool_use_id: j,
                type: "tool_result",
                content: [H, J, X].filter(Boolean).join(`
`),
                is_error: q
            }
        },
        async call(q, K, _, z, Y) {
            if (GyK()) throw Error(fyK);
            let {
                abortController: A,
                setToolJSX: O,
                emitToolProgress: w
            } = K, $ = !K.agentId, j = 0;
            try {
                let H = Q0Y({
                        input: q,
                        abortController: A,
                        taskRegistry: K.taskRegistry,
                        abortSpeculation: K.abortSpeculation,
                        setToolJSX: O,
                        emitToolProgress: w,
                        preventCwdChanges: !$,
                        isMainThread: $,
                        toolUseId: K.toolUseId,
                        agentId: K.agentId,
                        sessionEnvVars: K.sessionEnvVars
                    }),
                    J;
                do
                    if (J = await H.next(), !J.done && Y) {
                        let x = J.value;
                        Y({
                            toolUseID: `ps-progress-${j++}`,
                            data: {
                                type: "powershell_progress",
                                output: x.output,
                                fullOutput: x.fullOutput,
                                elapsedTimeSeconds: x.elapsedTimeSeconds,
                                totalLines: x.totalLines,
                                totalBytes: x.totalBytes,
                                timeoutMs: x.timeoutMs,
                                taskId: x.taskId
                            }
                        })
                    } while (!J.done);
                let X = J.value;
                if (!(X.code === 0 && !X.stdout && X.stderr && !X.backgroundTaskId)) $u8(q.command, X.code, X.stdout);
                let P = X.interrupted && A.signal.reason === "interrupt",
                    W = "";
                if ($) {
                    let x = K.getAppState();
                    if (tU8(x.toolPermissionContext)) W = sU8("")
                }
                if (X.backgroundTaskId) {
                    let x = ee6(X.stdout || "", q.command);
                    if ($ && x.hints.length > 0)
                        for (let B of x.hints) b38(B);
                    return {
                        data: {
                            stdout: x.stripped,
                            stderr: [X.stderr || "", W].filter(Boolean).join(`
`),
                            interrupted: !1,
                            backgroundTaskId: X.backgroundTaskId,
                            backgroundedByUser: X.backgroundedByUser,
                            assistantAutoBackgrounded: X.assistantAutoBackgrounded
                        }
                    }
                }
                let D = new iU6,
                    Z = (X.stdout || "").trimEnd();
                D.append(Z + DyK);
                let G = VEK(q.command, X.code, Z, X.stderr || ""),
                    f = rU8(D.toString()),
                    v = ee6(f, q.command);
                if (f = v.stripped, $ && v.hints.length > 0)
                    for (let x of v.hints) b38(x);
                if (X.preSpawnError) throw Error(X.preSpawnError);
                if (G.isError && !P) throw new JV(f, X.stderr || "", X.code, X.interrupted);
                let V = 67108864,
                    k, N;
                if (X.outputFilePath && X.outputTaskId) try {
                    let x = await h0Y(X.outputFilePath);
                    N = x.size, await tj6();
                    let B = ae6(X.outputTaskId, !1);
                    if (x.size > V) await R0Y(X.outputFilePath, V);
                    try {
                        await S0Y(X.outputFilePath, B)
                    } catch {
                        await L0Y(X.outputFilePath, B)
                    }
                    k = B
                } catch {}
                let R = D58(f),
                    h = f;
                if (R) {
                    let x = await aU8(f, X.outputFilePath, N, vO(K.options.mainLoopModel));
                    if (x) h = x;
                    else R = !1
                }
                let C = [X.stderr || "", W].filter(Boolean).join(`
`);
                return d("tengu_powershell_tool_command_executed", {
                    command_type: Qc8(q.command),
                    stdout_length: h.length,
                    stderr_length: C.length,
                    exit_code: X.code,
                    interrupted: X.interrupted,
                    powershell_edition: await lU8() ?? "unknown"
                }), {
                    data: {
                        stdout: h,
                        stderr: C,
                        interrupted: X.interrupted,
                        returnCodeInterpretation: G.message,
                        isImage: R,
                        persistedOutputPath: k,
                        persistedOutputSize: N
                    }
                }
            } finally {
                if (O) O(null);
                if (K.toolUseId) w?.({
                    kind: "clear",
                    toolUseId: K.toolUseId
                })
            }
        },
        isResultTruncated(q) {
            return yR(q.stdout) || yR(q.stderr)
        }
    })
})
// @from(Ln 409028, Col 0)
async function An(q, K, _, z) {
    let Y = q,
        A = z === "powershell" && ly6() ? c0Y() : KK,
        O = q.matchAll(l0Y),
        w = q.includes("!`") ? q.matchAll(n0Y) : [];
    return await Promise.all([...O, ...w].map(async ($) => {
        let j = $[1]?.trim();
        if (j) try {
            let H = await LX(A, {
                command: j
            }, K, yj({
                content: []
            }), "");
            if (H.behavior !== "allow") throw E(`Shell command permission check failed for command in ${_}: ${j}. Error: ${H.message}`), new rg(`Shell command permission check failed for pattern "${$[0]}": ${H.message||"Permission denied"}`);
            let {
                data: J
            } = await A.call({
                command: j
            }, K), X = await zL6(A, J, d0Y()), M = typeof X.content === "string" ? X.content : VyK(J.stdout, J.stderr);
            Y = Y.replace($[0], () => M)
        } catch (H) {
            if (H instanceof rg) throw H;
            i0Y(H, $[0])
        }
    })), Y
}
// @from(Ln 409055, Col 0)
function VyK(q, K, _ = !1) {
    let z = [];
    if (q.trim()) z.push(q.trim());
    if (K.trim())
        if (_) z.push(`[stderr: ${K.trim()}]`);
        else z.push(`[stderr]
${K.trim()}`);
    return z.join(_ ? " " : `
`)
}
// @from(Ln 409066, Col 0)
function i0Y(q, K, _ = !1) {
    if (q instanceof JV) {
        if (q.interrupted) throw new rg(`Shell command interrupted for pattern "${K}": [Command interrupted]`);
        let A = VyK(q.stdout, q.stderr, _);
        throw new rg(`Shell command failed for pattern "${K}": ${A}`)
    }
    let z = b6(q),
        Y = _ ? `[Error: ${z}]` : `[Error]
${z}`;
    throw new rg(Y)
}
// @from(Ln 409077, Col 4)
c0Y
// @from(Ln 409077, Col 9)
l0Y
// @from(Ln 409077, Col 14)
n0Y
// @from(Ln 409078, Col 4)
LI6 = L(() => {
    AZ();
    K8();
    m8();
    _7();
    g$();
    ND();
    uK6();
    c0Y = (() => {
        let q;
        return () => {
            if (!q) q = (PI6(), B7(Qd8)).PowerShellTool;
            return q
        }
    })(), l0Y = /```!\s*\n?([\s\S]*?)\n?```/g, n0Y = /(?<=^|\s)!`([^`]+)`/gm
})
// @from(Ln 409095, Col 0)
function kyK(q) {
    r0Y = q
}
// @from(Ln 409098, Col 4)
r0Y = null
// @from(Ln 409111, Col 0)
function s0Y(q, K) {
    if (K === "policySettings") return !1;
    return q === "skills" || q === "commands_DEPRECATED" || q === "plugin"
}
// @from(Ln 409116, Col 0)
function g38(q, K) {
    switch (q) {
        case "policySettings":
            return Se(SW(), ".claude", K);
        case "userSettings":
            return Se(A7(), K);
        case "projectSettings":
            return `.claude/${K}`;
        case "plugin":
            return "plugin";
        default:
            return ""
    }
}
// @from(Ln 409131, Col 0)
function U38(q) {
    let K = [q.name, q.description, q.whenToUse].filter(Boolean).join(" ");
    return w_(K)
}
// @from(Ln 409135, Col 0)
async function t0Y(q) {
    try {
        return await o0Y(q)
    } catch {
        return null
    }
}
// @from(Ln 409143, Col 0)
function e0Y(q, K) {
    if (!q.hooks) return;
    let _ = sN().safeParse(q.hooks);
    if (!_.success) {
        E(`Invalid hooks in skill '${K}': ${_.error.message}`);
        return
    }
    return _.data
}
// @from(Ln 409153, Col 0)
function qDY(q) {
    if (!q.paths) return;
    let K = Lt6(q.paths).map((_) => {
        return _.endsWith("/**") ? _.slice(0, -3) : _
    }).filter((_) => _.length > 0);
    if (K.length === 0 || K.every((_) => _ === "**")) return;
    return K
}
// @from(Ln 409162, Col 0)
function m_7(q, K, _, z = "Skill") {
    let Y = Wp(q.description, _),
        A = Y ?? j_6(K, z),
        O = q["user-invocable"] === void 0 ? !0 : Yy6(q["user-invocable"]),
        w = q.model,
        $;
    if (typeof w === "string" && w.trim().length > 0) {
        let J = w.trim();
        $ = J === "inherit" ? void 0 : K5(J)
    }
    let j = q.effort,
        H = j !== void 0 ? id(j) : void 0;
    if (j !== void 0 && H === void 0) E(`Skill ${_} has invalid effort '${j}'. Valid options: ${UI.join(", ")} or an integer`);
    return {
        displayName: q.name != null ? String(q.name) : void 0,
        description: A,
        hasUserSpecifiedDescription: Y !== null,
        allowedTools: yc(q["allowed-tools"]),
        argumentHint: q["argument-hint"] != null ? String(q["argument-hint"]) : void 0,
        argumentNames: HS8(q.arguments),
        whenToUse: q.when_to_use != null ? String(q.when_to_use) : void 0,
        version: q.version != null ? String(q.version) : void 0,
        model: $,
        disableModelInvocation: Yy6(q["disable-model-invocation"]),
        userInvocable: O,
        hooks: e0Y(q, _),
        executionContext: q.context === "fork" ? "fork" : void 0,
        agent: q.agent != null ? String(q.agent) : void 0,
        effort: H,
        shell: vh8(q.shell, _),
        createdBy: q.created_by === "dream-proposal" || q.improved_by === "dream-proposal" ? "dream-proposal" : void 0
    }
}
// @from(Ln 409196, Col 0)
function B_7({
    skillName: q,
    displayName: K,
    description: _,
    hasUserSpecifiedDescription: z,
    markdownContent: Y,
    allowedTools: A,
    argumentHint: O,
    argumentNames: w,
    whenToUse: $,
    version: j,
    model: H,
    disableModelInvocation: J,
    userInvocable: X,
    source: M,
    baseDir: P,
    loadedFrom: W,
    hooks: D,
    executionContext: Z,
    agent: G,
    paths: f,
    effort: v,
    shell: V,
    createdBy: k
}) {
    return {
        type: "prompt",
        name: q,
        description: _,
        hasUserSpecifiedDescription: z,
        allowedTools: A,
        argumentHint: O,
        argNames: w.length > 0 ? w : void 0,
        whenToUse: $,
        version: j,
        model: H,
        disableModelInvocation: J,
        userInvocable: X,
        context: Z,
        agent: G,
        effort: v,
        paths: f,
        contentLength: Y.length,
        isHidden: !X,
        progressMessage: "running",
        userFacingName() {
            return K || q
        },
        source: M,
        loadedFrom: W,
        createdBy: k,
        hooks: D,
        skillRoot: P,
        async getPromptForCommand(N, R) {
            let h = P ? `Base directory for this skill: ${P}

${Y}` : Y;
            if (h = qL6(h, N, !0, w), P) {
                let C = process.platform === "win32" ? P.replaceAll("\\", "/") : P;
                h = h.replaceAll("${CLAUDE_SKILL_DIR}", C)
            }
            if (h = h.replace(/\$\{CLAUDE_SESSION_ID\}/g, I8()), s0Y(W, M) && Wc8()) h = Dc8(h);
            else if (W !== "mcp") h = await An(h, {
                ...R,
                getAppState() {
                    let C = R.getAppState();
                    return {
                        ...C,
                        toolPermissionContext: {
                            ...C.toolPermissionContext,
                            alwaysAllowRules: {
                                ...C.toolPermissionContext.alwaysAllowRules,
                                command: A
                            }
                        }
                    }
                }
            }, `/${q}`, V);
            return [{
                type: "text",
                text: h
            }]
        }
    }
}
// @from(Ln 409281, Col 0)
async function gI6(q, K) {
    let _ = V8(),
        z;
    try {
        z = await _.readdir(q)
    } catch (A) {
        if (!D5(A)) j6(A);
        return []
    }
    return (await Promise.all(z.map(async (A) => {
        try {
            if (!A.isDirectory() && !A.isSymbolicLink()) return null;
            let O = Se(q, A.name),
                w = Se(O, "SKILL.md"),
                $;
            try {
                $ = await _.readFile(w, {
                    encoding: "utf-8"
                })
            } catch (W) {
                if (!t1(W)) E(`[skills] failed to read ${w}: ${W}`, {
                    level: "warn"
                });
                return null
            }
            let {
                frontmatter: j,
                content: H
            } = p2($, w), J = Ee(w, H), X = A.name, M = m_7(j, J, X), P = qDY(j);
            return {
                skill: B_7({
                    ...M,
                    skillName: X,
                    markdownContent: J,
                    source: K,
                    baseDir: O,
                    loadedFrom: "skills",
                    paths: P
                }),
                filePath: w
            }
        } catch (O) {
            return j6(O), null
        }
    }))).filter((A) => A !== null)
}
// @from(Ln 409328, Col 0)
function p_7(q) {
    return /^skill\.md$/i.test(ic8(q))
}
// @from(Ln 409332, Col 0)
function KDY(q) {
    let K = new Map;
    for (let z of q) {
        let Y = zP6(z.filePath),
            A = K.get(Y) ?? [];
        A.push(z), K.set(Y, A)
    }
    let _ = [];
    for (let [z, Y] of K) {
        let A = Y.filter((O) => p_7(O.filePath));
        if (A.length > 0) {
            let O = A[0];
            if (A.length > 1) E(`Multiple skill files found in ${z}, using ${ic8(O.filePath)}`);
            _.push(O)
        } else _.push(...Y)
    }
    return _
}
// @from(Ln 409351, Col 0)
function yyK(q, K) {
    let _ = K.endsWith(_P6) ? K.slice(0, -1) : K;
    if (!q.startsWith(_ + _P6)) return "";
    let z = q.slice(_.length + 1);
    return z ? z.split(_P6).join(":") : ""
}
// @from(Ln 409358, Col 0)
function _DY(q, K) {
    let _ = zP6(q),
        z = zP6(_),
        Y = ic8(_),
        A = yyK(z, K);
    return A ? `${A}:${Y}` : Y
}
// @from(Ln 409366, Col 0)
function zDY(q, K) {
    let _ = ic8(q),
        z = zP6(q),
        Y = _.replace(/\.md$/, ""),
        A = yyK(z, K);
    return A ? `${A}:${Y}` : Y
}
// @from(Ln 409374, Col 0)
function YDY(q) {
    return p_7(q.filePath) ? _DY(q.filePath, q.baseDir) : zDY(q.filePath, q.baseDir)
}
// @from(Ln 409377, Col 0)
async function ADY(q) {
    try {
        let K = await ls("commands", q),
            _ = KDY(K),
            z = [];
        for (let {
                baseDir: Y,
                filePath: A,
                frontmatter: O,
                content: w,
                source: $
            }
            of _) try {
            let H = p_7(A) ? zP6(A) : void 0,
                J = YDY({
                    baseDir: Y,
                    filePath: A,
                    frontmatter: O,
                    content: w,
                    source: $
                }),
                X = m_7(O, w, J, "Custom command");
            z.push({
                skill: B_7({
                    ...X,
                    skillName: J,
                    displayName: void 0,
                    markdownContent: Ee(A, w),
                    source: $,
                    baseDir: H,
                    loadedFrom: "commands_DEPRECATED",
                    paths: void 0
                }),
                filePath: A
            })
        } catch (j) {
            j6(j)
        }
        return z
    } catch (K) {
        return j6(K), []
    }
}
// @from(Ln 409421, Col 0)
function rc8() {
    F_7.cache?.clear?.(), ls.cache?.clear?.(), BJ.conditionalSkills.clear(), BJ.activatedConditionalSkillNames.clear()
}
// @from(Ln 409425, Col 0)
function g_7() {
    return {
        dynamicSkillDirs: new Set,
        dynamicSkills: new Map,
        conditionalSkills: new Map,
        activatedConditionalSkillNames: new Set
    }
}
// @from(Ln 409434, Col 0)
function LyK(q) {
    BJ = q
}
// @from(Ln 409438, Col 0)
function hyK(q) {
    return U_7.subscribe(() => {
        try {
            q()
        } catch (K) {
            j6(K)
        }
    })
}
// @from(Ln 409447, Col 0)
async function vb6(q, K) {
    let _ = V8(),
        z = K.endsWith(_P6) ? K.slice(0, -1) : K,
        Y = [];
    for (let A of q) {
        let O = zP6(A);
        while (O.startsWith(z + _P6)) {
            let w = Se(O, ".claude", "skills");
            if (!BJ.dynamicSkillDirs.has(w)) {
                BJ.dynamicSkillDirs.add(w);
                try {
                    if (await _.stat(w), await cA1(O, z)) {
                        E(`[skills] Skipped gitignored skills dir: ${w}`);
                        continue
                    }
                    Y.push(w)
                } catch {}
            }
            let $ = zP6(O);
            if ($ === O) break;
            O = $
        }
    }
    return Y.sort((A, O) => O.split(_P6).length - A.split(_P6).length)
}
// @from(Ln 409472, Col 0)
async function Tb6(q) {
    if (!L2("projectSettings") || HT("skills")) {
        E("[skills] Dynamic skill discovery skipped: projectSettings disabled or plugin-only policy");
        return
    }
    if (q.length === 0) return;
    let K = new Set(BJ.dynamicSkills.keys()),
        _ = await Promise.all(q.map((Y) => gI6(Y, "projectSettings")));
    for (let Y = _.length - 1; Y >= 0; Y--)
        for (let {
                skill: A
            }
            of _[Y] ?? [])
            if (A.type === "prompt") BJ.dynamicSkills.set(A.name, A);
    let z = _.flat().length;
    if (z > 0) {
        let Y = [...BJ.dynamicSkills.keys()].filter((A) => !K.has(A));
        if (E(`[skills] Dynamically discovered ${z} skills from ${q.length} directories`), Y.length > 0) d("tengu_dynamic_skills_changed", {
            source: "file_operation",
            previousCount: K.size,
            newCount: BJ.dynamicSkills.size,
            addedCount: Y.length,
            directoryCount: q.length
        })
    }
    U_7.emit()
}
// @from(Ln 409500, Col 0)
function RyK() {
    return Array.from(BJ.dynamicSkills.values())
}
// @from(Ln 409504, Col 0)
function Vb6(q, K) {
    if (BJ.conditionalSkills.size === 0) return [];
    let _ = [];
    for (let [z, Y] of BJ.conditionalSkills) {
        if (Y.type !== "prompt" || !Y.paths || Y.paths.length === 0) continue;
        let A = EyK.default().add(Y.paths);
        for (let O of q) {
            let w = NyK(O) ? a0Y(K, O) : O;
            if (!w || w.startsWith("..") || NyK(w)) continue;
            if (A.ignores(w)) {
                BJ.dynamicSkills.set(z, Y), BJ.conditionalSkills.delete(z), BJ.activatedConditionalSkillNames.add(z), _.push(z), E(`[skills] Activated conditional skill '${z}' (matched path: ${w})`);
                break
            }
        }
    }
    if (_.length > 0) d("tengu_dynamic_skills_changed", {
        source: "conditional_paths",
        previousCount: BJ.dynamicSkills.size - _.length,
        newCount: BJ.dynamicSkills.size,
        addedCount: _.length,
        directoryCount: 0
    }), U_7.emit();
    return _
}
// @from(Ln 409529, Col 0)
function SyK() {
    BJ.dynamicSkillDirs.clear(), BJ.dynamicSkills.clear(), BJ.conditionalSkills.clear(), BJ.activatedConditionalSkillNames.clear()
}
// @from(Ln 409532, Col 4)
EyK
// @from(Ln 409532, Col 9)
F_7
// @from(Ln 409532, Col 14)
BJ
// @from(Ln 409532, Col 18)
U_7
// @from(Ln 409533, Col 4)
ol = L(() => {
    U4();
    y8();
    C8();
    Nk();
    oe6();
    K8();
    hf();
    Q8();
    m8();
    Lf();
    Yq();
    lA1();
    U8();
    ds();
    Sq();
    LI6();
    aY();
    Rm();
    jJ6();
    Th();
    nH();
    d97();
    Q97();
    EyK = K6(X$6(), 1);
    F_7 = P1(async (q) => {
        let K = Se(A7(), "skills"),
            _ = Se(SW(), ".claude", "skills"),
            z = Q_7("skills", q);
        E(`Loading skills from: managed=${_}, user=${K}, project=[${z.join(", ")}]`);
        let Y = tG(),
            A = HT("skills"),
            O = L2("projectSettings") && !A;
        if (S9()) {
            if (Y.length === 0 || !O) return E(`[bare] Skipping skill dir discovery (${Y.length===0?"no --add-dir":"projectSettings disabled or skillsLocked"})`), [];
            return (await Promise.all(Y.map((v) => gI6(Se(v, ".claude", "skills"), "projectSettings")))).flat().map((v) => v.skill)
        }
        let [w, $, j, H, J] = await Promise.all([S6(process.env.CLAUDE_CODE_DISABLE_POLICY_SKILLS) ? Promise.resolve([]) : gI6(_, "policySettings"), L2("userSettings") && !A ? gI6(K, "userSettings") : Promise.resolve([]), O ? Promise.all(z.map((f) => gI6(f, "projectSettings"))) : Promise.resolve([]), O ? Promise.all(Y.map((f) => gI6(Se(f, ".claude", "skills"), "projectSettings"))) : Promise.resolve([]), A ? Promise.resolve([]) : ADY(q)]), X = [...w, ...$, ...j.flat(), ...H.flat(), ...J], M = await Promise.all(X.map(({
            skill: f,
            filePath: v
        }) => f.type === "prompt" ? t0Y(v) : Promise.resolve(null))), P = new Map, W = [];
        for (let f = 0; f < X.length; f++) {
            let v = X[f];
            if (v === void 0 || v.skill.type !== "prompt") continue;
            let {
                skill: V
            } = v, k = M[f];
            if (k === null || k === void 0) {
                W.push(V);
                continue
            }
            let N = P.get(k);
            if (N !== void 0) {
                E(`Skipping duplicate skill '${V.name}' from ${V.source} (same file already loaded from ${N})`);
                continue
            }
            P.set(k, V.source), W.push(V)
        }
        let D = X.length - W.length;
        if (D > 0) E(`Deduplicated ${D} skills (same file)`);
        let Z = [],
            G = [];
        for (let f of W)
            if (f.type === "prompt" && f.paths && f.paths.length > 0 && !BJ.activatedConditionalSkillNames.has(f.name)) G.push(f);
            else Z.push(f);
        for (let f of G) BJ.conditionalSkills.set(f.name, f);
        if (G.length > 0) E(`[skills] ${G.length} conditional skills stored (activated when matching files are touched)`);
        return E(`Loaded ${W.length} unique skills (${Z.length} unconditional, ${G.length} conditional, managed: ${w.length}, user: ${$.length}, project: ${j.flat().length}, additional: ${H.flat().length}, legacy commands: ${J.length})`), Z
    });
    BJ = g_7(), U_7 = l5();
    kyK({
        createSkillCommand: B_7,
        parseSkillFrontmatterFields: m_7
    })
})
// @from(Ln 409614, Col 0)
function wDY(q) {
    return q.split(byK.sep).join(CyK.sep)
}
// @from(Ln 409618, Col 0)
function Ce(q) {
    let K = wDY(q);
    return d_7 ? K.toLowerCase() : K
}
// @from(Ln 409623, Col 0)
function Q38(q) {
    let K = A7(),
        _ = Ce(q),
        z = Ce(K);
    if (!_.startsWith(z)) return null;
    if (_.includes("/session-memory/") && _.endsWith(".md")) return "session_memory";
    if (_.includes("/projects/") && _.endsWith(".jsonl")) return "session_transcript";
    return null
}
// @from(Ln 409633, Col 0)
function ac8(q) {
    let K = q.split(byK.sep).join(CyK.sep);
    if (K.includes("session-memory") && (K.includes(".md") || K.endsWith("*"))) return "session_memory";
    if (K.includes(".jsonl") || K.includes("projects") && K.includes("*.jsonl")) return "session_transcript";
    return null
}
// @from(Ln 409640, Col 0)
function YP6(q) {
    if (x3()) return YR(q);
    return !1
}
// @from(Ln 409645, Col 0)
function IyK(q) {
    if (oc8.isTeamMemFile(q)) return "team";
    if (YP6(q)) return "personal";
    return null
}
// @from(Ln 409651, Col 0)
function $DY(q) {
    if (x3()) return d38(q);
    return !1
}
// @from(Ln 409656, Col 0)
function AP6(q) {
    if (YP6(q)) return !0;
    if (oc8.isTeamMemFile(q)) return !0;
    if (Q38(q) !== null) return !0;
    if ($DY(q)) return !0;
    return !1
}
// @from(Ln 409664, Col 0)
function l_7(q) {
    let K = ODY(q),
        _ = Ce(K);
    if (x3() && (_.includes("/agent-memory/") || _.includes("/agent-memory-local/"))) return !0;
    if (oc8.isTeamMemoryEnabled() && oc8.isTeamMemPath(K)) return !0;
    if (x3()) {
        let w = Nw(),
            $ = Ce(w.replace(/[/\\]+$/, "")),
            j = Ce(w);
        if (_ === $ || _.startsWith(j)) return !0
    }
    let z = Ce(A7()),
        Y = Ce(X46()),
        A = _.startsWith(z),
        O = _.startsWith(Y);
    if (!A && !O) return !1;
    if (_.includes("/session-memory/")) return !0;
    if (A && _.includes("/projects/")) return !0;
    if (x3() && _.includes("/memory/")) return !0;
    return !1
}
// @from(Ln 409686, Col 0)
function xyK(q) {
    let K = A7(),
        _ = X46(),
        z = x3() ? Nw().replace(/[/\\]+$/, "") : "",
        Y = Ce(q);
    if (![K, _, z].filter(Boolean).some(($) => {
            if (Y.includes(Ce($))) return !0;
            if (d_7) return Y.includes(sX($).toLowerCase());
            return !1
        })) return !1;
    let w = q.match(/(?:[A-Za-z]:[/\\]|\/)[^\s'"]+/g);
    if (!w) return !1;
    for (let $ of w) {
        let j = $.replace(/[,;|&>]+$/, ""),
            H = d_7 ? LA6(j) : j;
        if (AP6(H) || l_7(H)) return !0
    }
    return !1
}
// @from(Ln 409706, Col 0)
function uyK(q) {
    if (ac8(q) !== null) return !0;
    if (x3() && (q.replaceAll("\\", "/").includes("agent-memory/") || q.replaceAll("\\", "/").includes("agent-memory-local/"))) return !0;
    return !1
}
// @from(Ln 409711, Col 4)
oc8
// @from(Ln 409711, Col 9)
d_7
// @from(Ln 409712, Col 4)
UI6 = L(() => {
    VY();
    pp();
    Q8();
    rC();
    oc8 = (ev(), B7(Tp)), d_7 = process.platform === "win32"
})
// @from(Ln 409720, Col 0)
function sc8(q) {
    let K = `${Sb6()}/`,
        _ = ".output";
    if (q.startsWith(K) && q.endsWith(".output")) {
        let z = q.slice(K.length, -7);
        if (z.length > 0 && z.length <= 20 && /^[a-zA-Z0-9_-]+$/.test(z)) return z
    }
    return null
}
// @from(Ln 409730, Col 0)
function myK({
    file_path: q,
    offset: K,
    limit: _,
    pages: z
}, {
    verbose: Y
}) {
    if (!q) return null;
    if (sc8(q)) return "";
    let A = Y ? q : S3(q);
    if (z) return oK.createElement(oK.Fragment, null, oK.createElement(YG, {
        filePath: q
    }, A), ` · pages ${z}`);
    if (Y && (K || _)) {
        let O = K ?? 1,
            w = _ ? `lines ${O}-${O+_-1}` : `from line ${O}`;
        return oK.createElement(oK.Fragment, null, oK.createElement(YG, {
            filePath: q
        }, A), ` · ${w}`)
    }
    return oK.createElement(YG, {
        filePath: q
    }, A)
}
// @from(Ln 409756, Col 0)
function ByK({
    file_path: q
}) {
    let K = q ? sc8(q) : null;
    if (!K) return null;
    return oK.createElement(T, {
        dimColor: !0
    }, " ", K)
}
// @from(Ln 409766, Col 0)
function pyK(q) {
    switch (q.type) {
        case "image": {
            let {
                originalSize: K
            } = q.file, _ = o4(K);
            return oK.createElement(_1, {
                height: 1
            }, oK.createElement(T, null, "Read image (", _, ")"))
        }
        case "notebook": {
            let {
                cells: K
            } = q.file;
            if (!K || K.length < 1) return oK.createElement(T, {
                color: "error"
            }, "No cells found in notebook");
            return oK.createElement(_1, {
                height: 1
            }, oK.createElement(T, null, "Read ", oK.createElement(T, {
                bold: !0
            }, K.length), " cells"))
        }
        case "pdf": {
            let {
                originalSize: K
            } = q.file, _ = o4(K);
            return oK.createElement(_1, {
                height: 1
            }, oK.createElement(T, null, "Read PDF (", _, ")"))
        }
        case "parts":
            return oK.createElement(_1, {
                height: 1
            }, oK.createElement(T, null, "Read ", oK.createElement(T, {
                bold: !0
            }, q.file.count), " ", q.file.count === 1 ? "page" : "pages", " (", o4(q.file.originalSize), ")"));
        case "text": {
            let {
                numLines: K
            } = q.file;
            return oK.createElement(_1, {
                height: 1
            }, oK.createElement(T, null, "Read ", oK.createElement(T, {
                bold: !0
            }, K), " ", K === 1 ? "line" : "lines"))
        }
        case "file_unchanged":
            return oK.createElement(_1, {
                height: 1
            }, oK.createElement(T, {
                dimColor: !0
            }, "Unchanged since last read"))
    }
}
// @from(Ln 409822, Col 0)
function FyK(q, {
    verbose: K
}) {
    if (!K && typeof q === "string") {
        if (q.includes(Ov)) return oK.createElement(_1, null, oK.createElement(T, {
            color: "error"
        }, "File not found"));
        if (vK(q, "tool_use_error")) return oK.createElement(_1, null, oK.createElement(T, {
            color: "error"
        }, "Error reading file"))
    }
    return oK.createElement(d$, {
        result: q,
        verbose: K
    })
}
// @from(Ln 409839, Col 0)
function gyK(q) {
    if (q?.file_path?.startsWith(aO())) return "Reading Plan";
    if (q?.file_path && sc8(q.file_path)) return "Read agent output";
    return "Read"
}
// @from(Ln 409845, Col 0)
function n_7(q) {
    if (!q?.file_path) return null;
    let K = sc8(q.file_path);
    if (K) return K;
    return S3(q.file_path)
}
// @from(Ln 409851, Col 4)
oK
// @from(Ln 409852, Col 4)
UyK = L(() => {
    _7();
    ny();
    S96();
    GK();
    g6();
    eK();
    c7();
    NJ();
    EH();
    oK = K6(P6(), 1)
})
// @from(Ln 409874, Col 0)
function PDY(q) {
    if (MDY.has(q)) return !0;
    if (q.startsWith("/proc/") && (q.endsWith("/fd/0") || q.endsWith("/fd/1") || q.endsWith("/fd/2"))) return !0;
    return !1
}
// @from(Ln 409880, Col 0)
function DDY(q) {
    let K = OP6.basename(q),
        _ = /^(.+)([ \u202F])(AM|PM)(\.png)$/,
        z = K.match(_);
    if (!z) return;
    let Y = z[2],
        A = Y === " " ? WDY : " ";
    return q.replace(`${Y}${z[3]}${z[4]}`, `${A}${z[3]}${z[4]}`)
}
// @from(Ln 409890, Col 0)
function ZDY(q) {
    let K = A7();
    if (!q.startsWith(K)) return null;
    let _ = q.split(XDY.sep).join(JDY.sep);
    if (_.includes("/session-memory/") && _.endsWith(".md")) return "session_memory";
    if (_.includes("/projects/") && _.endsWith(".jsonl")) return "session_transcript";
    return null
}
// @from(Ln 409899, Col 0)
function vDY() {
    return w44
}
// @from(Ln 409903, Col 0)
function TDY(q) {
    return vJ8(q)
}
// @from(Ln 409907, Col 0)
function NDY() {
    let q = G5().toLowerCase();
    return kDY.some((K) => K.test(q))
}
// @from(Ln 409912, Col 0)
function EDY(q) {
    let K = lyK.get(q);
    if (K === void 0) return "";
    return RZ4(K)
}
// @from(Ln 409917, Col 0)
async function QyK(q, K, _) {
    let z = _ ?? as().maxTokens,
        Y = J04(q, K);
    if (!Y || Y <= z / 4) return;
    let O = await nyK(q) ?? Y;
    if (O > z) throw new Pc8(O, z)
}
// @from(Ln 409925, Col 0)
function tc8(q, K, _, z) {
    return {
        type: "image",
        file: {
            base64: q.toString("base64"),
            type: `image/${K}`,
            originalSize: _,
            dimensions: z
        }
    }
}
// @from(Ln 409936, Col 0)
async function dyK(q, K, _, z, Y, A, O, w, $, j, H, J) {
    if (z === "ipynb") {
        let N = await AWK(_),
            R = I6(N),
            h = Buffer.byteLength(R);
        if (h > w) throw Error(`Notebook content (${o4(h)}) exceeds maximum allowed size (${o4(w)}). Use ${S7} with jq to read specific portions:
  cat "${q}" | jq '.cells[:20]' # First 20 cells
  cat "${q}" | jq '.cells[100:120]' # Cells 100-120
  cat "${q}" | jq '.cells | length' # Count total cells
  cat "${q}" | jq '.cells[] | select(.cell_type=="code") | .source' # All code sources`);
        await QyK(R, z, $);
        let C = await V8().stat(_);
        j.set(K, {
            content: R,
            timestamp: Math.floor(C.mtimeMs),
            offset: Y,
            limit: A
        }), H.nestedMemoryAttachmentTriggers?.add(K);
        let x = {
            type: "notebook",
            file: {
                filePath: q,
                cells: N
            }
        };
        return cF({
            operation: "read",
            tool: "FileReadTool",
            filePath: K,
            content: R
        }), {
            data: x
        }
    }
    let X = vO(H.options.mainLoopModel);
    if (cyK.has(z)) {
        let N = await F97(_, $, void 0, X);
        H.nestedMemoryAttachmentTriggers?.add(K), cF({
            operation: "read",
            tool: "FileReadTool",
            filePath: K,
            content: N.file.base64
        });
        let R = N.file.dimensions ? GE6(N.file.dimensions) : null;
        return {
            data: N,
            ...R && {
                newMessages: [t8({
                    content: R,
                    isMeta: !0
                })]
            }
        }
    }
    if (ek6(z)) {
        if (O) {
            let m = Lb1(O),
                S = await wi1(_, m ?? void 0);
            if (!S.success) throw Error(S.error.message);
            d("tengu_pdf_page_extraction", {
                success: !0,
                pageCount: S.data.file.count,
                fileSize: S.data.file.originalSize,
                hasPageRange: !0
            }), cF({
                operation: "read",
                tool: "FileReadTool",
                filePath: K,
                content: `PDF pages ${O}`
            });
            let U = (await jDY(S.data.file.outputDir)).filter((c) => c.endsWith(".jpg")).sort(),
                g = await Promise.all(U.map(async (c) => {
                    let n = OP6.join(S.data.file.outputDir, c),
                        l = await HDY(n),
                        {
                            block: z6
                        } = await sE({
                            data: l,
                            mediaType: "jpeg",
                            limits: X
                        });
                    return z6
                }));
            return {
                data: S.data,
                ...g.length > 0 && {
                    newMessages: [t8({
                        content: g,
                        isMeta: !0
                    })]
                }
            }
        }
        let N = await yI8(_);
        if (N !== null && N > Ty8) throw Error(`This PDF has ${N} pages, which is too many to read at once. Use the pages parameter to read specific page ranges (e.g., pages: "1-5"). Maximum ${r$6} pages per request.`);
        let h = await V8().stat(_);
        if (!za6() || h.size > E24) {
            let m = await wi1(_);
            if (m.success) d("tengu_pdf_page_extraction", {
                success: !0,
                pageCount: m.data.file.count,
                fileSize: m.data.file.originalSize
            });
            else d("tengu_pdf_page_extraction", {
                success: !1,
                available: m.error.reason !== "unavailable",
                fileSize: h.size
            })
        }
        if (!za6()) throw Error(`Reading full PDFs is not supported with this model. Use a newer model (Sonnet 3.5 v2 or later), or use the pages parameter to read specific page ranges (e.g., pages: "1-5", maximum ${r$6} pages per request). Page extraction requires poppler-utils: install with \`brew install poppler\` on macOS or \`apt-get install poppler-utils\` on Debian/Ubuntu.`);
        let x = await RC4(_);
        if (!x.success) throw Error(x.error.message);
        let B = x.data;
        return cF({
            operation: "read",
            tool: "FileReadTool",
            filePath: K,
            content: B.file.base64
        }), {
            data: B,
            newMessages: [t8({
                content: [{
                    type: "document",
                    source: {
                        type: "base64",
                        media_type: "application/pdf",
                        data: B.file.base64
                    }
                }],
                isMeta: !0
            })]
        }
    }
    let M = Y === 0 ? 0 : Y - 1,
        {
            content: P,
            lineCount: W,
            totalLines: D,
            totalBytes: Z,
            readBytes: G,
            mtimeMs: f
        } = await m56(_, M, A, A === void 0 ? w : void 0, H.abortController.signal);
    await QyK(P, z, $), j.set(K, {
        content: P,
        timestamp: Math.floor(f),
        offset: Y,
        limit: A
    }), H.nestedMemoryAttachmentTriggers?.add(K), MR8(K);
    let v = {
        type: "text",
        file: {
            filePath: q,
            content: P,
            numLines: W,
            startLine: Y,
            totalLines: D
        }
    };
    if (YP6(K)) lyK.set(v, f);
    cF({
        operation: "read",
        tool: "FileReadTool",
        filePath: K,
        content: P
    });
    let V = ZDY(K),
        k = $46(K);
    return d("tengu_session_file_read", {
        totalLines: D,
        readLines: W,
        totalBytes: Z,
        readBytes: G,
        offset: Y,
        ...A !== void 0 && {
            limit: A
        },
        ...k !== void 0 && {
            ext: k
        },
        ...J !== void 0 && {
            messageID: J
        },
        is_session_memory: V === "session_memory",
        is_session_transcript: V === "session_transcript"
    }), {
        data: v
    }
}
// @from(Ln 410124, Col 0)
async function F97(q, K = as().maxTokens, _, z) {
    let Y = await V8().readFileBytes(q, _),
        A = Y.length;
    if (A === 0) throw Error(`Image file is empty: ${q}`);
    let O = fE6(Y),
        w = O.split("/")[1] || "png",
        $;
    try {
        let H = await zs(Y, A, w, z);
        $ = tc8(H.buffer, H.mediaType, A, H.dimensions)
    } catch (H) {
        if (H instanceof xd) throw H;
        j6(H), $ = tc8(Y, w, A)
    }
    if (Math.ceil($.file.base64.length * 0.125) > K) try {
        let H = await u24(Y, K, O);
        return {
            type: "image",
            file: {
                base64: H.base64,
                type: H.mediaType,
                originalSize: A
            }
        }
    } catch (H) {
        j6(H);
        try {
            let J = await Promise.resolve().then(() => K6(Bm1(), 1)),
                M = await (J.default || J)(Y).resize(400, 400, {
                    fit: "inside",
                    withoutEnlargement: !0
                }).jpeg({
                    quality: 20
                }).toBuffer();
            return tc8(M, "jpeg", A)
        } catch (J) {
            return j6(J), tc8(Y, w, A)
        }
    }
    return $
}
// @from(Ln 410165, Col 4)
MDY
// @from(Ln 410165, Col 9)
WDY
// @from(Ln 410165, Col 14)
Pc8
// @from(Ln 410165, Col 19)
cyK
// @from(Ln 410165, Col 24)
fDY
// @from(Ln 410165, Col 29)
GDY
// @from(Ln 410165, Col 34)
Kz
// @from(Ln 410165, Col 38)
VDY = `

<system-reminder>
Whenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.
</system-reminder>
`
// @from(Ln 410171, Col 4)
kDY
// @from(Ln 410171, Col 9)
lyK