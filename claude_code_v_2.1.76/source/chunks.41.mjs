
// @from(Ln 101022, Col 0)
async function wO3() {
    try {
        if (!await IH()) return null;
        if (await _O3()) {
            k("Shallow clone detected, using HEAD-only mode for issue");
            let [{
                stdout: M
            }, D] = await Promise.all([z8(hA(), ["diff", "HEAD"]), Q31()]);
            return {
                remote_base_sha: null,
                remote_base: null,
                patch: M || "",
                untracked_files: D,
                format_patch: null,
                head_sha: null,
                branch_name: null
            }
        }
        let q = await W37();
        if (!q) {
            k("No remote found, using HEAD-only mode for issue");
            let [{
                stdout: M
            }, D] = await Promise.all([z8(hA(), ["diff", "HEAD"]), Q31()]);
            return {
                remote_base_sha: null,
                remote_base: null,
                patch: M || "",
                untracked_files: D,
                format_patch: null,
                head_sha: null,
                branch_name: null
            }
        }
        let {
            stdout: K,
            code: Y
        } = await z8(hA(), ["merge-base", "HEAD", q], {
            preserveOutputOnError: !1
        });
        if (Y !== 0 || !K.trim()) {
            k("Merge-base failed, using HEAD-only mode for issue");
            let [{
                stdout: M
            }, D] = await Promise.all([z8(hA(), ["diff", "HEAD"]), Q31()]);
            return {
                remote_base_sha: null,
                remote_base: null,
                patch: M || "",
                untracked_files: D,
                format_patch: null,
                head_sha: null,
                branch_name: null
            }
        }
        let z = K.trim(),
            [{
                stdout: _
            }, w, {
                stdout: O,
                code: $
            }, {
                stdout: H
            }, {
                stdout: j
            }] = await Promise.all([z8(hA(), ["diff", z]), Q31(), z8(hA(), ["format-patch", `${z}..HEAD`, "--stdout"]), z8(hA(), ["rev-parse", "HEAD"]), z8(hA(), ["rev-parse", "--abbrev-ref", "HEAD"])]),
            J = null;
        if ($ === 0 && O && O.trim()) J = O;
        return {
            remote_base_sha: z,
            remote_base: q,
            patch: _ || "",
            untracked_files: w,
            format_patch: J,
            head_sha: H?.trim() || null,
            branch_name: j?.trim() && j.trim() !== "HEAD" ? j.trim() : null
        }
    } catch (A) {
        return _6(A), null
    }
}
// @from(Ln 101104, Col 0)
function OO3(A) {
    let q = A.split(":")[0] ?? "";
    return q === "localhost" || /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(q)
}
// @from(Ln 101108, Col 4)
M37
// @from(Ln 101108, Col 9)
w37
// @from(Ln 101108, Col 14)
H_
// @from(Ln 101108, Col 18)
O37
// @from(Ln 101108, Col 23)
LJ
// @from(Ln 101108, Col 27)
hA
// @from(Ln 101108, Col 31)
IH
// @from(Ln 101108, Col 35)
k58 = async (A) => {
    return H_(A) !== null
}
// @from(Ln 101110, Col 3)
D37 = async () => {
    return r57()
}
// @from(Ln 101112, Col 3)
kj = async () => {
    return n57()
}
// @from(Ln 101114, Col 3)
oT = async () => {
    return a57()
}
// @from(Ln 101116, Col 3)
Lo = async () => {
    return o57()
}
// @from(Ln 101118, Col 3)
E58 = async () => {
    let {
        code: A
    } = await z8(hA(), ["rev-parse", "@{u}"], {
        preserveOutputOnError: !1
    });
    return A === 0
}
// @from(Ln 101125, Col 3)
Ro = async (A) => {
    let q = ["--no-optional-locks", "status", "--porcelain"];
    if (A?.ignoreUntracked) q.push("-uno");
    let {
        stdout: K
    } = await z8(hA(), q, {
        preserveOutputOnError: !1
    });
    return K.trim().length === 0
}
// @from(Ln 101134, Col 3)
y58 = async () => {
    let [A, q] = await Promise.all([E58(), P37()]);
    if (!A) return {
        hasUpstream: !1,
        needsPush: !0,
        commitsAhead: 0,
        commitsAheadOfDefaultBranch: q
    };
    let {
        stdout: K,
        code: Y
    } = await z8(hA(), ["rev-list", "--count", "@{u}..HEAD"], {
        preserveOutputOnError: !1
    });
    if (Y !== 0) return {
        hasUpstream: !0,
        needsPush: !1,
        commitsAhead: 0,
        commitsAheadOfDefaultBranch: q
    };
    let z = parseInt(K.trim(), 10) || 0;
    return {
        hasUpstream: !0,
        needsPush: z > 0,
        commitsAhead: z,
        commitsAheadOfDefaultBranch: q
    }
}
// @from(Ln 101161, Col 3)
qO3 = async () => {
    let [A, q] = await Promise.all([Ro(), y58()]);
    return {
        hasUncommitted: !A,
        hasUnpushed: q.needsPush,
        commitsAheadOfDefaultBranch: q.commitsAheadOfDefaultBranch
    }
}
// @from(Ln 101168, Col 3)
KO3 = async (A, q) => {
    if (!await Ro()) {
        q?.("committing");
        let {
            code: $,
            stderr: H
        } = await z8(hA(), ["add", "-A"], {
            preserveOutputOnError: !0
        });
        if ($ !== 0) return {
            success: !1,
            error: `Failed to stage changes: ${H}`
        };
        let {
            code: j,
            stderr: J
        } = await z8(hA(), ["commit", "-m", A], {
            preserveOutputOnError: !0
        });
        if (j !== 0) return {
            success: !1,
            error: `Failed to commit: ${J}`
        }
    }
    q?.("pushing");
    let [Y, z] = await Promise.all([y58(), kj()]), _ = Y.hasUpstream ? ["push"] : ["push", "-u", "origin", z], {
        code: w,
        stderr: O
    } = await z8(hA(), _, {
        preserveOutputOnError: !0
    });
    if (w !== 0) return {
        success: !1,
        error: `Failed to push: ${O}`
    };
    return {
        success: !0
    }
}
// @from(Ln 101206, Col 3)
YO3 = async () => {
    let {
        stdout: A
    } = await z8(hA(), ["--no-optional-locks", "status", "--porcelain"], {
        preserveOutputOnError: !1
    });
    return A.trim().split(`
`).map((q) => q.trim().split(" ", 2)[1]?.trim()).filter((q) => typeof q === "string")
}
// @from(Ln 101214, Col 3)
d31 = async () => {
    let {
        stdout: A
    } = await z8(hA(), ["--no-optional-locks", "status", "--porcelain"], {
        preserveOutputOnError: !1
    }), q = [], K = [];
    return A.trim().split(`
`).filter((Y) => Y.length > 0).forEach((Y) => {
        let z = Y.substring(0, 2),
            _ = Y.substring(2).trim();
        if (z === "??") K.push(_);
        else if (_) q.push(_)
    }), {
        tracked: q,
        untracked: K
    }
}
// @from(Ln 101230, Col 3)
TJ6 = async () => {
    return e57()
}
// @from(Ln 101232, Col 3)
L58 = async (A) => {
    try {
        let q = A || `Claude Code auto-stash - ${new Date().toISOString()}`,
            {
                untracked: K
            } = await d31();
        if (K.length > 0) {
            let {
                code: z
            } = await z8(hA(), ["add", ...K], {
                preserveOutputOnError: !1
            });
            if (z !== 0) return !1
        }
        let {
            code: Y
        } = await z8(hA(), ["stash", "push", "--message", q], {
            preserveOutputOnError: !1
        });
        return Y === 0
    } catch (q) {
        return !1
    }
}
// @from(Ln 101255, Col 3)
$37 = 524288000
// @from(Ln 101255, Col 20)
H37 = 5368709120
// @from(Ln 101255, Col 38)
j37 = 20000
// @from(Ln 101255, Col 51)
zO3 = 65536
// @from(Ln 101256, Col 4)
$5 = E(() => {
    U4();
    Up();
    Eq();
    H1();
    lA();
    u_();
    k1();
    Oy();
    yo();
    T58();
    M37 = Symbol("git-root-not-found"), w37 = ZP((A) => {
        let q = Date.now();
        U1("info", "find_git_root_started");
        let K = N58(A),
            Y = K.substring(0, K.indexOf(_37) + 1) || _37,
            z = 0;
        while (K !== Y) {
            try {
                let w = U31(K, ".git");
                z++;
                let O = K37(w);
                if (O.isDirectory() || O.isFile()) return U1("info", "find_git_root_completed", {
                    duration_ms: Date.now() - q,
                    stat_count: z,
                    found: !0
                }), K.normalize("NFC")
            } catch {}
            let _ = J37(K);
            if (_ === K) break;
            K = _
        }
        try {
            let _ = U31(Y, ".git");
            z++;
            let w = K37(_);
            if (w.isDirectory() || w.isFile()) return U1("info", "find_git_root_completed", {
                duration_ms: Date.now() - q,
                stat_count: z,
                found: !0
            }), Y.normalize("NFC")
        } catch {}
        return U1("info", "find_git_root_completed", {
            duration_ms: Date.now() - q,
            stat_count: z,
            found: !1
        }), M37
    }, (A) => A, 50), H_ = tw3();
    O37 = ZP((A) => {
        try {
            let q = Y37(U31(A, ".git"), "utf-8").trim();
            if (!q.startsWith("gitdir:")) return A;
            let K = N58(A, q.slice(7).trim()),
                Y = N58(K, Y37(U31(K, "commondir"), "utf-8").trim());
            if (sw3(Y) !== ".git") return Y.normalize("NFC");
            return J37(Y).normalize("NFC")
        } catch {
            return A
        }
    }, (A) => A, 50), LJ = ew3();
    hA = e1(() => {
        return eO6("git") || "git"
    }), IH = e1(async () => {
        let A = Date.now();
        U1("info", "is_git_check_started");
        let q = H_(G1()) !== null;
        return U1("info", "is_git_check_completed", {
            duration_ms: Date.now() - A,
            is_git: q
        }), q
    })
})
// @from(Ln 101341, Col 0)
async function S58(A, q) {
    let {
        code: K
    } = await RA("git", ["check-ignore", A], {
        preserveOutputOnError: !1,
        cwd: q
    });
    return K === 0
}
// @from(Ln 101351, Col 0)
function PO3() {
    return $O3(jO3(), ".config", "git", "ignore")
}
// @from(Ln 101354, Col 0)
async function Z37(A, q = G1()) {
    try {
        if (!await k58(q)) return;
        let K = `**/${A}`,
            Y = A.endsWith("/") ? `${A}sample-file.txt` : A;
        if (await S58(Y, q)) return;
        let z = PO3(),
            _ = HO3(z);
        await JO3(_, {
            recursive: !0
        });
        try {
            if ((await MO3(z, {
                    encoding: "utf-8"
                })).includes(K)) return;
            await DO3(z, `
${K}
`)
        } catch (w) {
            if (w.code === "ENOENT") await XO3(z, `${K}
`, "utf-8");
            else throw w
        }
    } catch (K) {
        _6(K)
    }
}
// @from(Ln 101381, Col 4)
C58 = E(() => {
    $5();
    lA();
    k1();
    Eq()
})
// @from(Ln 101388, Col 0)
function G37(A) {
    let q = WO3.find((Y) => Y.matches(A));
    if (!q) return null;
    let K = {
        ...q.tip
    };
    if (A.code === "invalid_value" && A.enumValues && !K.suggestion) K.suggestion = `Valid values: ${A.enumValues.map((Y)=>`"${Y}"`).join(", ")}`;
    if (!K.docLink && A.path) {
        let Y = A.path.split(".")[0];
        if (Y) K.docLink = ZO3[Y]
    }
    return K
}
// @from(Ln 101401, Col 4)
WO3
// @from(Ln 101401, Col 9)
ZO3
// @from(Ln 101402, Col 4)
f37 = E(() => {
    WO3 = [{
        matches: (A) => A.path === "permissions.defaultMode" && A.code === "invalid_value",
        tip: {
            suggestion: 'Valid modes: "acceptEdits" (ask before file changes), "plan" (analysis only), "bypassPermissions" (auto-accept all), or "default" (standard behavior)',
            docLink: "https://code.claude.com/docs/en/iam#permission-modes"
        }
    }, {
        matches: (A) => A.path === "apiKeyHelper" && A.code === "invalid_type",
        tip: {
            suggestion: 'Provide a shell command that outputs your API key to stdout. The script should output only the API key. Example: "/bin/generate_temp_api_key.sh"'
        }
    }, {
        matches: (A) => A.path === "cleanupPeriodDays" && A.code === "too_small" && A.expected === "0",
        tip: {
            suggestion: "Must be 0 or greater. Set a positive number for days to retain transcripts (default is 30). Setting 0 disables session persistence entirely: no transcripts are written and existing transcripts are deleted at startup."
        }
    }, {
        matches: (A) => A.path.startsWith("env.") && A.code === "invalid_type",
        tip: {
            suggestion: 'Environment variables must be strings. Wrap numbers and booleans in quotes. Example: "DEBUG": "true", "PORT": "3000"',
            docLink: "https://code.claude.com/docs/en/settings#environment-variables"
        }
    }, {
        matches: (A) => (A.path === "permissions.allow" || A.path === "permissions.deny") && A.code === "invalid_type" && A.expected === "array",
        tip: {
            suggestion: 'Permission rules must be in an array. Format: ["Tool(specifier)"]. Examples: ["Bash(npm run build)", "Edit(docs/**)", "Read(~/.zshrc)"]. Use * for wildcards.'
        }
    }, {
        matches: (A) => A.path.includes("hooks") && A.code === "invalid_type",
        tip: {
            suggestion: 'Hooks use a matcher + hooks array. The matcher is a string: a tool name ("Bash"), pipe-separated list ("Edit|Write"), or empty to match all. Example: {"PostToolUse": [{"matcher": "Edit|Write", "hooks": [{"type": "command", "command": "echo Done"}]}]}'
        }
    }, {
        matches: (A) => A.code === "invalid_type" && A.expected === "boolean",
        tip: {
            suggestion: 'Use true or false without quotes. Example: "includeCoAuthoredBy": true'
        }
    }, {
        matches: (A) => A.code === "unrecognized_keys",
        tip: {
            suggestion: "Check for typos or refer to the documentation for valid fields",
            docLink: "https://code.claude.com/docs/en/settings"
        }
    }, {
        matches: (A) => A.code === "invalid_value" && A.enumValues !== void 0,
        tip: {
            suggestion: void 0
        }
    }, {
        matches: (A) => A.code === "invalid_type" && A.expected === "object" && A.received === null && A.path === "",
        tip: {
            suggestion: "Check for missing commas, unmatched brackets, or trailing commas. Use a JSON validator to identify the exact syntax error."
        }
    }, {
        matches: (A) => A.path === "permissions.additionalDirectories" && A.code === "invalid_type",
        tip: {
            suggestion: 'Must be an array of directory paths. Example: ["~/projects", "/tmp/workspace"]. You can also use --add-dir flag or /add-dir command',
            docLink: "https://code.claude.com/docs/en/iam#working-directories"
        }
    }], ZO3 = {
        permissions: "https://code.claude.com/docs/en/iam#configuring-permissions",
        env: "https://code.claude.com/docs/en/settings#environment-variables",
        hooks: "https://code.claude.com/docs/en/hooks"
    }
})
// @from(Ln 101469, Col 0)
function I58() {
    let A = Np(oD(), {
        unrepresentable: "any"
    });
    return B6(A, null, 2)
}
// @from(Ln 101475, Col 4)
T37 = E(() => {
    K7();
    jC();
    g1()
})
// @from(Ln 101481, Col 0)
function v37(A) {
    return A.code === "invalid_type"
}
// @from(Ln 101485, Col 0)
function N37(A) {
    return A.code === "invalid_value"
}
// @from(Ln 101489, Col 0)
function GO3(A) {
    return A.code === "unrecognized_keys"
}
// @from(Ln 101493, Col 0)
function V37(A) {
    return A.code === "too_small"
}
// @from(Ln 101497, Col 0)
function b58(A) {
    if (A === null) return "null";
    if (A === void 0) return "undefined";
    if (Array.isArray(A)) return "array";
    return typeof A
}
// @from(Ln 101504, Col 0)
function k37(A) {
    let q = A.match(/received (\w+)/);
    return q ? q[1] : void 0
}
// @from(Ln 101509, Col 0)
function vJ6(A, q) {
    return A.issues.map((K) => {
        let Y = K.path.map(String).join("."),
            z = K.message,
            _, w, O, $, H;
        if (N37(K)) w = K.values.map((J) => String(J)), O = w.join(" | "), $ = void 0, H = void 0;
        else if (v37(K)) {
            O = K.expected;
            let J = k37(K.message);
            $ = J ?? b58(K.input), H = J ?? b58(K.input)
        } else if (V37(K)) O = String(K.minimum);
        else if (K.code === "custom" && "params" in K) $ = K.params.received, H = $;
        let j = G37({
            path: Y,
            code: K.code,
            expected: O,
            received: $,
            enumValues: w,
            message: K.message,
            value: $
        });
        if (N37(K)) _ = w?.map((J) => `"${J}"`).join(", "), z = `Invalid value. Expected one of: ${_}`;
        else if (v37(K)) {
            let J = k37(K.message) ?? b58(K.input);
            if (K.expected === "object" && J === "null" && Y === "") z = "Invalid or malformed JSON";
            else z = `Expected ${K.expected}, but received ${J}`
        } else if (GO3(K)) {
            let J = K.keys.join(", ");
            z = `Unrecognized field${K.keys.length>1?"s":""}: ${J}`
        } else if (V37(K)) z = `Number must be greater than or equal to ${K.minimum}`, _ = String(K.minimum);
        return {
            file: q,
            path: Y,
            message: z,
            expected: _,
            invalidValue: H,
            suggestion: j?.suggestion,
            docLink: j?.docLink
        }
    })
}
// @from(Ln 101551, Col 0)
function x58(A) {
    try {
        let q = i1(A),
            K = oD().strict().safeParse(q);
        if (K.success) return {
            isValid: !0
        };
        return {
            isValid: !1,
            error: `Settings validation failed:
` + vJ6(K.error, "settings").map((_) => `- ${_.path}: ${_.message}`).join(`
`),
            fullSchema: I58()
        }
    } catch (q) {
        return {
            isValid: !1,
            error: `Invalid JSON: ${q instanceof Error?q.message:"Unknown parsing error"}`,
            fullSchema: I58()
        }
    }
}
// @from(Ln 101574, Col 0)
function c31(A, q) {
    if (!A || typeof A !== "object") return [];
    let K = A;
    if (!K.permissions || typeof K.permissions !== "object") return [];
    let Y = K.permissions,
        z = [];
    for (let _ of ["allow", "deny", "ask"]) {
        let w = Y[_];
        if (!Array.isArray(w)) continue;
        Y[_] = w.filter((O) => {
            if (typeof O !== "string") return z.push({
                file: q,
                path: `permissions.${_}`,
                message: `Non-string value in ${_} array was removed`,
                invalidValue: O
            }), !1;
            let $ = J58(O);
            if (!$.valid) {
                let H = `Invalid permission rule "${O}" was skipped`;
                if ($.error) H += `: ${$.error}`;
                if ($.suggestion) H += `. ${$.suggestion}`;
                return z.push({
                    file: q,
                    path: `permissions.${_}`,
                    message: H,
                    invalidValue: O
                }), !1
            }
            return !0
        })
    }
    return z
}
// @from(Ln 101607, Col 4)
l31 = E(() => {
    jC();
    f37();
    T37();
    g1();
    M58()
})
// @from(Ln 101614, Col 4)
bW
// @from(Ln 101615, Col 4)
So = E(() => {
    U4();
    YK();
    bW = e1(function() {
        switch (y8()) {
            case "macos":
                return "/Library/Application Support/ClaudeCode";
            case "windows":
                return "C:\\Program Files\\ClaudeCode";
            default:
                return "/etc/claude-code"
        }
    })
})
// @from(Ln 101645, Col 0)
function I37(A, q = {}) {
    let K = q.entryType || q.type;
    if (K === "both") K = rV.FILE_DIR_TYPE;
    if (K) q.type = K;
    if (!A) throw Error("readdirp: root argument is required. Usage: readdirp(root, options)");
    else if (typeof A !== "string") throw TypeError("readdirp: root argument must be a string. Usage: readdirp(root, options)");
    else if (K && !L37.includes(K)) throw Error(`readdirp: Invalid type passed. Use one of ${L37.join(", ")}`);
    return q.root = A, new C37(q)
}
// @from(Ln 101654, Col 4)
rV
// @from(Ln 101654, Col 8)
u58
// @from(Ln 101654, Col 13)
S37 = "READDIRP_RECURSIVE_ERROR"
// @from(Ln 101655, Col 4)
yO3
// @from(Ln 101655, Col 9)
L37
// @from(Ln 101655, Col 14)
LO3
// @from(Ln 101655, Col 19)
RO3
// @from(Ln 101655, Col 24)
hO3 = (A) => yO3.has(A.code)
// @from(Ln 101656, Col 4)
SO3
// @from(Ln 101656, Col 9)
R37 = (A) => !0
// @from(Ln 101657, Col 4)
h37 = (A) => {
        if (A === void 0) return R37;
        if (typeof A === "function") return A;
        if (typeof A === "string") {
            let q = A.trim();
            return (K) => K.basename === q
        }
        if (Array.isArray(A)) {
            let q = A.map((K) => K.trim());
            return (K) => q.some((Y) => K.basename === Y)
        }
        return R37
    }
// @from(Ln 101670, Col 4)
C37
// @from(Ln 101671, Col 4)
b37 = E(() => {
    rV = {
        FILE_TYPE: "files",
        DIR_TYPE: "directories",
        FILE_DIR_TYPE: "files_directories",
        EVERYTHING_TYPE: "all"
    }, u58 = {
        root: ".",
        fileFilter: (A) => !0,
        directoryFilter: (A) => !0,
        type: rV.FILE_TYPE,
        lstat: !1,
        depth: 2147483648,
        alwaysStat: !1,
        highWaterMark: 4096
    };
    Object.freeze(u58);
    yO3 = new Set(["ENOENT", "EPERM", "EACCES", "ELOOP", S37]), L37 = [rV.DIR_TYPE, rV.EVERYTHING_TYPE, rV.FILE_DIR_TYPE, rV.FILE_TYPE], LO3 = new Set([rV.DIR_TYPE, rV.EVERYTHING_TYPE, rV.FILE_DIR_TYPE]), RO3 = new Set([rV.EVERYTHING_TYPE, rV.FILE_DIR_TYPE, rV.FILE_TYPE]), SO3 = process.platform === "win32";
    C37 = class C37 extends NO3 {
        constructor(A = {}) {
            super({
                objectMode: !0,
                autoDestroy: !0,
                highWaterMark: A.highWaterMark
            });
            let q = {
                    ...u58,
                    ...A
                },
                {
                    root: K,
                    type: Y
                } = q;
            this._fileFilter = h37(q.fileFilter), this._directoryFilter = h37(q.directoryFilter);
            let z = q.lstat ? E37 : fO3;
            if (SO3) this._stat = (_) => z(_, {
                bigint: !0
            });
            else this._stat = z;
            this._maxDepth = q.depth ?? u58.depth, this._wantsDir = Y ? LO3.has(Y) : !1, this._wantsFile = Y ? RO3.has(Y) : !1, this._wantsEverything = Y === rV.EVERYTHING_TYPE, this._root = y37(K), this._isDirent = !q.alwaysStat, this._statsProp = this._isDirent ? "dirent" : "stats", this._rdOptions = {
                encoding: "utf8",
                withFileTypes: this._isDirent
            }, this.parents = [this._exploreDir(K, 1)], this.reading = !1, this.parent = void 0
        }
        async _read(A) {
            if (this.reading) return;
            this.reading = !0;
            try {
                while (!this.destroyed && A > 0) {
                    let q = this.parent,
                        K = q && q.files;
                    if (K && K.length > 0) {
                        let {
                            path: Y,
                            depth: z
                        } = q, _ = K.splice(0, A).map((O) => this._formatEntry(O, Y)), w = await Promise.all(_);
                        for (let O of w) {
                            if (!O) continue;
                            if (this.destroyed) return;
                            let $ = await this._getEntryType(O);
                            if ($ === "directory" && this._directoryFilter(O)) {
                                if (z <= this._maxDepth) this.parents.push(this._exploreDir(O.fullPath, z + 1));
                                if (this._wantsDir) this.push(O), A--
                            } else if (($ === "file" || this._includeAsFile(O)) && this._fileFilter(O)) {
                                if (this._wantsFile) this.push(O), A--
                            }
                        }
                    } else {
                        let Y = this.parents.pop();
                        if (!Y) {
                            this.push(null);
                            break
                        }
                        if (this.parent = await Y, this.destroyed) return
                    }
                }
            } catch (q) {
                this.destroy(q)
            } finally {
                this.reading = !1
            }
        }
        async _exploreDir(A, q) {
            let K;
            try {
                K = await TO3(A, this._rdOptions)
            } catch (Y) {
                this._onError(Y)
            }
            return {
                files: K,
                depth: q,
                path: A
            }
        }
        async _formatEntry(A, q) {
            let K, Y = this._isDirent ? A.name : A;
            try {
                let z = y37(kO3(q, Y));
                K = {
                    path: VO3(this._root, z),
                    fullPath: z,
                    basename: Y
                }, K[this._statsProp] = this._isDirent ? A : await this._stat(z)
            } catch (z) {
                this._onError(z);
                return
            }
            return K
        }
        _onError(A) {
            if (hO3(A) && !this.destroyed) this.emit("warn", A);
            else this.destroy(A)
        }
        async _getEntryType(A) {
            if (!A && this._statsProp in A) return "";
            let q = A[this._statsProp];
            if (q.isFile()) return "file";
            if (q.isDirectory()) return "directory";
            if (q && q.isSymbolicLink()) {
                let K = A.fullPath;
                try {
                    let Y = await vO3(K),
                        z = await E37(Y);
                    if (z.isFile()) return "file";
                    if (z.isDirectory()) {
                        let _ = Y.length;
                        if (K.startsWith(Y) && K.substr(_, 1) === EO3) {
                            let w = Error(`Circular symlink detected: "${K}" points to "${Y}"`);
                            return w.code = S37, this._onError(w)
                        }
                        return "directory"
                    }
                } catch (Y) {
                    return this._onError(Y), ""
                }
            }
        }
        _includeAsFile(A) {
            let q = A && A[this._statsProp];
            return q && this._wantsEverything && !q.isDirectory()
        }
    }
})
// @from(Ln 101831, Col 0)
function u37(A, q, K, Y, z) {
    let _ = (w, O) => {
        if (K(A), z(w, O, {
                watchedPath: A
            }), O && A !== O) r31(iO.resolve(A, O), B46, iO.join(A, O))
    };
    try {
        return IO3(A, {
            persistent: q.persistent
        }, _)
    } catch (w) {
        Y(w);
        return
    }
}
// @from(Ln 101846, Col 0)
class Q58 {
    constructor(A) {
        this.fsw = A, this._boundHandleError = (q) => A._handleError(q)
    }
    _watchWithNodeFs(A, q) {
        let K = this.fsw.options,
            Y = iO.dirname(A),
            z = iO.basename(A);
        this.fsw._getWatchedDir(Y).add(z);
        let w = iO.resolve(A),
            O = {
                persistent: K.persistent
            };
        if (!q) q = o31;
        let $;
        if (K.usePolling) {
            let H = K.interval !== K.binaryInterval;
            O.interval = H && cO3(z) ? K.binaryInterval : K.interval, $ = nO3(A, w, O, {
                listener: q,
                rawEmitter: this.fsw._emitRaw
            })
        } else $ = iO3(A, w, O, {
            listener: q,
            errHandler: this._boundHandleError,
            rawEmitter: this.fsw._emitRaw
        });
        return $
    }
    _handleFile(A, q, K) {
        if (this.fsw.closed) return;
        let Y = iO.dirname(A),
            z = iO.basename(A),
            _ = this.fsw._getWatchedDir(Y),
            w = q;
        if (_.has(z)) return;
        let O = async (H, j) => {
            if (!this.fsw._throttle(pO3, A, 5)) return;
            if (!j || j.mtimeMs === 0) try {
                let J = await m37(A);
                if (this.fsw.closed) return;
                let {
                    atimeMs: M,
                    mtimeMs: D
                } = J;
                if (!M || M <= D || D !== w.mtimeMs) this.fsw._emit(JC.CHANGE, A, J);
                if ((BO3 || gO3 || FO3) && w.ino !== J.ino) {
                    this.fsw._closeFile(H), w = J;
                    let X = this._watchWithNodeFs(A, O);
                    if (X) this.fsw._addPathCloser(H, X)
                } else w = J
            } catch (J) {
                this.fsw._remove(Y, z)
            } else if (_.has(z)) {
                let {
                    atimeMs: J,
                    mtimeMs: M
                } = j;
                if (!J || J <= M || M !== w.mtimeMs) this.fsw._emit(JC.CHANGE, A, j);
                w = j
            }
        }, $ = this._watchWithNodeFs(A, O);
        if (!(K && this.fsw.options.ignoreInitial) && this.fsw._isntIgnored(A)) {
            if (!this.fsw._throttle(JC.ADD, A, 0)) return;
            this.fsw._emit(JC.ADD, A, q)
        }
        return $
    }
    async _handleSymlink(A, q, K, Y) {
        if (this.fsw.closed) return;
        let z = A.fullPath,
            _ = this.fsw._getWatchedDir(q);
        if (!this.fsw.options.followSymlinks) {
            this.fsw._incrReadyCount();
            let w;
            try {
                w = await m58(K)
            } catch (O) {
                return this.fsw._emitReady(), !0
            }
            if (this.fsw.closed) return;
            if (_.has(Y)) {
                if (this.fsw._symlinkPaths.get(z) !== w) this.fsw._symlinkPaths.set(z, w), this.fsw._emit(JC.CHANGE, K, A.stats)
            } else _.add(Y), this.fsw._symlinkPaths.set(z, w), this.fsw._emit(JC.ADD, K, A.stats);
            return this.fsw._emitReady(), !0
        }
        if (this.fsw._symlinkPaths.has(z)) return !0;
        this.fsw._symlinkPaths.set(z, !0)
    }
    _handleRead(A, q, K, Y, z, _, w) {
        if (A = iO.join(A, ""), w = this.fsw._throttle("readdir", A, 1000), !w) return;
        let O = this.fsw._getWatchedDir(K.path),
            $ = new Set,
            H = this.fsw._readdirp(A, {
                fileFilter: (j) => K.filterPath(j),
                directoryFilter: (j) => K.filterDir(j)
            });
        if (!H) return;
        return H.on(mO3, async (j) => {
            if (this.fsw.closed) {
                H = void 0;
                return
            }
            let J = j.path,
                M = iO.join(A, J);
            if ($.add(J), j.stats.isSymbolicLink() && await this._handleSymlink(j, A, M, J)) return;
            if (this.fsw.closed) {
                H = void 0;
                return
            }
            if (J === Y || !Y && !O.has(J)) this.fsw._incrReadyCount(), M = iO.join(z, iO.relative(z, M)), this._addToNodeFs(M, q, K, _ + 1)
        }).on(JC.ERROR, this._boundHandleError), new Promise((j, J) => {
            if (!H) return J();
            H.once(F58, () => {
                if (this.fsw.closed) {
                    H = void 0;
                    return
                }
                let M = w ? w.clear() : !1;
                if (j(void 0), O.getChildren().filter((D) => {
                        return D !== A && !$.has(D)
                    }).forEach((D) => {
                        this.fsw._remove(A, D)
                    }), H = void 0, M) this._handleRead(A, !1, K, Y, z, _, w)
            })
        })
    }
    async _handleDir(A, q, K, Y, z, _, w) {
        let O = this.fsw._getWatchedDir(iO.dirname(A)),
            $ = O.has(iO.basename(A));
        if (!(K && this.fsw.options.ignoreInitial) && !z && !$) this.fsw._emit(JC.ADD_DIR, A, q);
        O.add(iO.basename(A)), this.fsw._getWatchedDir(A);
        let H, j, J = this.fsw.options.depth;
        if ((J == null || Y <= J) && !this.fsw._symlinkPaths.has(w)) {
            if (!z) {
                if (await this._handleRead(A, K, _, z, A, Y, H), this.fsw.closed) return
            }
            j = this._watchWithNodeFs(A, (M, D) => {
                if (D && D.mtimeMs === 0) return;
                this._handleRead(M, !1, _, z, A, Y, H)
            })
        }
        return j
    }
    async _addToNodeFs(A, q, K, Y, z) {
        let _ = this.fsw._emitReady;
        if (this.fsw._isIgnored(A) || this.fsw.closed) return _(), !1;
        let w = this.fsw._getWatchHelpers(A);
        if (K) w.filterPath = (O) => K.filterPath(O), w.filterDir = (O) => K.filterDir(O);
        try {
            let O = await QO3[w.statMethod](w.watchPath);
            if (this.fsw.closed) return;
            if (this.fsw._isIgnored(w.watchPath, O)) return _(), !1;
            let $ = this.fsw.options.followSymlinks,
                H;
            if (O.isDirectory()) {
                let j = iO.resolve(A),
                    J = $ ? await m58(A) : A;
                if (this.fsw.closed) return;
                if (H = await this._handleDir(w.watchPath, O, q, Y, z, w, J), this.fsw.closed) return;
                if (j !== J && J !== void 0) this.fsw._symlinkPaths.set(j, J)
            } else if (O.isSymbolicLink()) {
                let j = $ ? await m58(A) : A;
                if (this.fsw.closed) return;
                let J = iO.dirname(w.watchPath);
                if (this.fsw._getWatchedDir(J).add(w.watchPath), this.fsw._emit(JC.ADD, w.watchPath, O), H = await this._handleDir(J, O, q, Y, A, w, j), this.fsw.closed) return;
                if (j !== void 0) this.fsw._symlinkPaths.set(iO.resolve(A), j)
            } else H = this._handleFile(w.watchPath, O, q);
            if (_(), H) this.fsw._addPathCloser(A, H);
            return !1
        } catch (O) {
            if (this.fsw._handleError(O)) return _(), A
        }
    }
}
// @from(Ln 102020, Col 4)
mO3 = "data"
// @from(Ln 102021, Col 4)
F58 = "end"
// @from(Ln 102022, Col 4)
B37 = "close"
// @from(Ln 102023, Col 4)
o31 = () => {}
// @from(Ln 102024, Col 4)
a31
// @from(Ln 102024, Col 9)
p58
// @from(Ln 102024, Col 14)
BO3
// @from(Ln 102024, Col 19)
gO3
// @from(Ln 102024, Col 24)
FO3
// @from(Ln 102024, Col 29)
g37
// @from(Ln 102024, Col 34)
wO
// @from(Ln 102024, Col 38)
JC
// @from(Ln 102024, Col 42)
pO3 = "watch"
// @from(Ln 102025, Col 4)
QO3
// @from(Ln 102025, Col 9)
B46 = "listeners"
// @from(Ln 102026, Col 4)
i31 = "errHandlers"
// @from(Ln 102027, Col 4)
NJ6 = "rawEmitters"
// @from(Ln 102028, Col 4)
UO3
// @from(Ln 102028, Col 9)
dO3
// @from(Ln 102028, Col 14)
cO3 = (A) => dO3.has(iO.extname(A).slice(1).toLowerCase())
// @from(Ln 102029, Col 4)
g58 = (A, q) => {
        if (A instanceof Set) A.forEach(q);
        else q(A)
    }
// @from(Ln 102033, Col 4)
pC6 = (A, q, K) => {
        let Y = A[q];
        if (!(Y instanceof Set)) A[q] = Y = new Set([Y]);
        Y.add(K)
    }
// @from(Ln 102038, Col 4)
lO3 = (A) => (q) => {
        let K = A[q];
        if (K instanceof Set) K.clear();
        else delete A[q]
    }
// @from(Ln 102043, Col 4)
QC6 = (A, q, K) => {
        let Y = A[q];
        if (Y instanceof Set) Y.delete(K);
        else if (Y === K) delete A[q]
    }
// @from(Ln 102048, Col 4)
F37 = (A) => A instanceof Set ? A.size === 0 : !A
// @from(Ln 102049, Col 4)
n31
// @from(Ln 102049, Col 9)
r31 = (A, q, K, Y, z) => {
        let _ = n31.get(A);
        if (!_) return;
        g58(_[q], (w) => {
            w(K, Y, z)
        })
    }
// @from(Ln 102056, Col 4)
iO3 = (A, q, K, Y) => {
        let {
            listener: z,
            errHandler: _,
            rawEmitter: w
        } = Y, O = n31.get(q), $;
        if (!K.persistent) {
            if ($ = u37(A, K, z, _, w), !$) return;
            return $.close.bind($)
        }
        if (O) pC6(O, B46, z), pC6(O, i31, _), pC6(O, NJ6, w);
        else {
            if ($ = u37(A, K, r31.bind(null, q, B46), _, r31.bind(null, q, NJ6)), !$) return;
            $.on(JC.ERROR, async (H) => {
                let j = r31.bind(null, q, i31);
                if (O) O.watcherUnusable = !0;
                if (p58 && H.code === "EPERM") try {
                    await (await bO3(A, "r")).close(), j(H)
                } catch (J) {} else j(H)
            }), O = {
                listeners: z,
                errHandlers: _,
                rawEmitters: w,
                watcher: $
            }, n31.set(q, O)
        }
        return () => {
            if (QC6(O, B46, z), QC6(O, i31, _), QC6(O, NJ6, w), F37(O.listeners)) O.watcher.close(), n31.delete(q), UO3.forEach(lO3(O)), O.watcher = void 0, Object.freeze(O)
        }
    }
// @from(Ln 102086, Col 4)
B58
// @from(Ln 102086, Col 9)
nO3 = (A, q, K, Y) => {
        let {
            listener: z,
            rawEmitter: _
        } = Y, w = B58.get(q), O = w && w.options;
        if (O && (O.persistent < K.persistent || O.interval > K.interval)) x37(q), w = void 0;
        if (w) pC6(w, B46, z), pC6(w, NJ6, _);
        else w = {
            listeners: z,
            rawEmitters: _,
            options: K,
            watcher: CO3(q, K, ($, H) => {
                g58(w.rawEmitters, (J) => {
                    J(JC.CHANGE, q, {
                        curr: $,
                        prev: H
                    })
                });
                let j = $.mtimeMs;
                if ($.size !== H.size || j > H.mtimeMs || j === 0) g58(w.listeners, (J) => J(A, $))
            })
        }, B58.set(q, w);
        return () => {
            if (QC6(w, B46, z), QC6(w, NJ6, _), F37(w.listeners)) B58.delete(q), x37(q), w.options = w.watcher = void 0, Object.freeze(w)
        }
    }
// @from(Ln 102112, Col 4)
p37 = E(() => {
    a31 = process.platform, p58 = a31 === "win32", BO3 = a31 === "darwin", gO3 = a31 === "linux", FO3 = a31 === "freebsd", g37 = uO3() === "OS400", wO = {
        ALL: "all",
        READY: "ready",
        ADD: "add",
        CHANGE: "change",
        ADD_DIR: "addDir",
        UNLINK: "unlink",
        UNLINK_DIR: "unlinkDir",
        RAW: "raw",
        ERROR: "error"
    }, JC = wO, QO3 = {
        lstat: xO3,
        stat: m37
    }, UO3 = [B46, i31, NJ6], dO3 = new Set(["3dm", "3ds", "3g2", "3gp", "7z", "a", "aac", "adp", "afdesign", "afphoto", "afpub", "ai", "aif", "aiff", "alz", "ape", "apk", "appimage", "ar", "arj", "asf", "au", "avi", "bak", "baml", "bh", "bin", "bk", "bmp", "btif", "bz2", "bzip2", "cab", "caf", "cgm", "class", "cmx", "cpio", "cr2", "cur", "dat", "dcm", "deb", "dex", "djvu", "dll", "dmg", "dng", "doc", "docm", "docx", "dot", "dotm", "dra", "DS_Store", "dsk", "dts", "dtshd", "dvb", "dwg", "dxf", "ecelp4800", "ecelp7470", "ecelp9600", "egg", "eol", "eot", "epub", "exe", "f4v", "fbs", "fh", "fla", "flac", "flatpak", "fli", "flv", "fpx", "fst", "fvt", "g3", "gh", "gif", "graffle", "gz", "gzip", "h261", "h263", "h264", "icns", "ico", "ief", "img", "ipa", "iso", "jar", "jpeg", "jpg", "jpgv", "jpm", "jxr", "key", "ktx", "lha", "lib", "lvp", "lz", "lzh", "lzma", "lzo", "m3u", "m4a", "m4v", "mar", "mdi", "mht", "mid", "midi", "mj2", "mka", "mkv", "mmr", "mng", "mobi", "mov", "movie", "mp3", "mp4", "mp4a", "mpeg", "mpg", "mpga", "mxu", "nef", "npx", "numbers", "nupkg", "o", "odp", "ods", "odt", "oga", "ogg", "ogv", "otf", "ott", "pages", "pbm", "pcx", "pdb", "pdf", "pea", "pgm", "pic", "png", "pnm", "pot", "potm", "potx", "ppa", "ppam", "ppm", "pps", "ppsm", "ppsx", "ppt", "pptm", "pptx", "psd", "pya", "pyc", "pyo", "pyv", "qt", "rar", "ras", "raw", "resources", "rgb", "rip", "rlc", "rmf", "rmvb", "rpm", "rtf", "rz", "s3m", "s7z", "scpt", "sgi", "shar", "snap", "sil", "sketch", "slk", "smv", "snk", "so", "stl", "suo", "sub", "swf", "tar", "tbz", "tbz2", "tga", "tgz", "thmx", "tif", "tiff", "tlz", "ttc", "ttf", "txz", "udf", "uvh", "uvi", "uvm", "uvp", "uvs", "uvu", "viv", "vob", "war", "wav", "wax", "wbmp", "wdp", "weba", "webm", "webp", "whl", "wim", "wm", "wma", "wmv", "wmx", "woff", "woff2", "wrm", "wvx", "xbm", "xif", "xla", "xlam", "xls", "xlsb", "xlsm", "xlsx", "xlt", "xltm", "xltx", "xm", "xmind", "xpi", "xpm", "xwd", "xz", "z", "zip", "zipx"]), n31 = new Map;
    B58 = new Map
})
// @from(Ln 102129, Col 4)
e31 = {}
// @from(Ln 102148, Col 0)
function s31(A) {
    return Array.isArray(A) ? A : [A]
}
// @from(Ln 102152, Col 0)
function z$3(A) {
    if (typeof A === "function") return A;
    if (typeof A === "string") return (q) => A === q;
    if (A instanceof RegExp) return (q) => A.test(q);
    if (typeof A === "object" && A !== null) return (q) => {
        if (A.path === q) return !0;
        if (A.recursive) {
            let K = Z9.relative(A.path, q);
            if (!K) return !1;
            return !K.startsWith("..") && !Z9.isAbsolute(K)
        }
        return !1
    };
    return () => !1
}
// @from(Ln 102168, Col 0)
function _$3(A) {
    if (typeof A !== "string") throw Error("string expected");
    A = Z9.normalize(A), A = A.replace(/\\/g, "/");
    let q = !1;
    if (A.startsWith("//")) q = !0;
    let K = /\/\//;
    while (A.match(K)) A = A.replace(K, "/");
    if (q) A = "/" + A;
    return A
}
// @from(Ln 102179, Col 0)
function U37(A, q, K) {
    let Y = _$3(q);
    for (let z = 0; z < A.length; z++) {
        let _ = A[z];
        if (_(Y, K)) return !0
    }
    return !1
}
// @from(Ln 102188, Col 0)
function w$3(A, q) {
    if (A == null) throw TypeError("anymatch: specify first argument");
    let Y = s31(A).map((z) => z$3(z));
    if (q == null) return (z, _) => {
        return U37(Y, z, _)
    };
    return U37(Y, q)
}
// @from(Ln 102196, Col 0)
class r37 {
    constructor(A, q) {
        this.path = A, this._removeWatcher = q, this.items = new Set
    }
    add(A) {
        let {
            items: q
        } = this;
        if (!q) return;
        if (A !== i37 && A !== eO3) q.add(A)
    }
    async remove(A) {
        let {
            items: q
        } = this;
        if (!q) return;
        if (q.delete(A), q.size > 0) return;
        let K = this.path;
        try {
            await aO3(K)
        } catch (Y) {
            if (this._removeWatcher) this._removeWatcher(Z9.dirname(K), Z9.basename(K))
        }
    }
    has(A) {
        let {
            items: q
        } = this;
        if (!q) return;
        return q.has(A)
    }
    getChildren() {
        let {
            items: A
        } = this;
        if (!A) return [];
        return [...A.values()]
    }
    dispose() {
        this.items.clear(), this.path = "", this._removeWatcher = o31, this.items = $$3, Object.freeze(this)
    }
}
// @from(Ln 102238, Col 0)
class c58 {
    constructor(A, q, K) {
        this.fsw = K;
        let Y = A;
        this.path = A = A.replace(Y$3, ""), this.watchPath = Y, this.fullWatchPath = Z9.resolve(Y), this.dirParts = [], this.dirParts.forEach((z) => {
            if (z.length > 1) z.pop()
        }), this.followSymlinks = q, this.statMethod = q ? H$3 : j$3
    }
    entryPath(A) {
        return Z9.join(this.watchPath, Z9.relative(this.watchPath, A.fullPath))
    }
    filterPath(A) {
        let {
            stats: q
        } = A;
        if (q && q.isSymbolicLink()) return this.filterDir(A);
        let K = this.entryPath(A);
        return this.fsw._isntIgnored(K, q) && this.fsw._hasReadPermissions(q)
    }
    filterDir(A) {
        return this.fsw._isntIgnored(this.entryPath(A), A.stats)
    }
}
// @from(Ln 102262, Col 0)
function o37(A, q = {}) {
    let K = new t31(q);
    return K.add(A), K
}
// @from(Ln 102266, Col 4)
U58 = "/"
// @from(Ln 102267, Col 4)
tO3 = "//"
// @from(Ln 102268, Col 4)
i37 = "."
// @from(Ln 102269, Col 4)
eO3 = ".."
// @from(Ln 102270, Col 4)
A$3 = "string"
// @from(Ln 102271, Col 4)
q$3
// @from(Ln 102271, Col 9)
Q37
// @from(Ln 102271, Col 14)
K$3
// @from(Ln 102271, Col 19)
Y$3
// @from(Ln 102271, Col 24)
d58 = (A) => typeof A === "object" && A !== null && !(A instanceof RegExp)
// @from(Ln 102272, Col 4)
d37 = (A) => {
        let q = s31(A).flat();
        if (!q.every((K) => typeof K === A$3)) throw TypeError(`Non-string provided as watch path: ${q}`);
        return q.map(n37)
    }
// @from(Ln 102277, Col 4)
c37 = (A) => {
        let q = A.replace(q$3, U58),
            K = !1;
        if (q.startsWith(tO3)) K = !0;
        while (q.match(Q37)) q = q.replace(Q37, U58);
        if (K) q = U58 + q;
        return q
    }
// @from(Ln 102285, Col 4)
n37 = (A) => c37(Z9.normalize(c37(A)))
// @from(Ln 102286, Col 4)
l37 = (A = "") => (q) => {
        if (typeof q === "string") return n37(Z9.isAbsolute(q) ? q : Z9.join(A, q));
        else return q
    }
// @from(Ln 102290, Col 4)
O$3 = (A, q) => {
        if (Z9.isAbsolute(A)) return A;
        return Z9.join(q, A)
    }
// @from(Ln 102294, Col 4)
$$3
// @from(Ln 102294, Col 9)
H$3 = "stat"
// @from(Ln 102295, Col 4)
j$3 = "lstat"
// @from(Ln 102296, Col 4)
t31
// @from(Ln 102296, Col 9)
g46
// @from(Ln 102297, Col 4)
F46 = E(() => {
    b37();
    p37(); /*! chokidar - MIT License (c) 2012 Paul Miller (paulmillr.com) */
    q$3 = /\\/g, Q37 = /\/\//, K$3 = /\..*\.(sw[px])$|~$|\.subl.*\.tmp/, Y$3 = /^\.[/\\]/;
    $$3 = Object.freeze(new Set);
    t31 = class t31 extends sO3 {
        constructor(A = {}) {
            super();
            this.closed = !1, this._closers = new Map, this._ignoredPaths = new Set, this._throttled = new Map, this._streams = new Set, this._symlinkPaths = new Map, this._watched = new Map, this._pendingWrites = new Map, this._pendingUnlinks = new Map, this._readyCount = 0, this._readyEmitted = !1;
            let q = A.awaitWriteFinish,
                K = {
                    stabilityThreshold: 2000,
                    pollInterval: 100
                },
                Y = {
                    persistent: !0,
                    ignoreInitial: !1,
                    ignorePermissionErrors: !1,
                    interval: 100,
                    binaryInterval: 300,
                    followSymlinks: !0,
                    usePolling: !1,
                    atomic: !0,
                    ...A,
                    ignored: A.ignored ? s31(A.ignored) : s31([]),
                    awaitWriteFinish: q === !0 ? K : typeof q === "object" ? {
                        ...K,
                        ...q
                    } : !1
                };
            if (g37) Y.usePolling = !0;
            if (Y.atomic === void 0) Y.atomic = !Y.usePolling;
            let z = process.env.CHOKIDAR_USEPOLLING;
            if (z !== void 0) {
                let O = z.toLowerCase();
                if (O === "false" || O === "0") Y.usePolling = !1;
                else if (O === "true" || O === "1") Y.usePolling = !0;
                else Y.usePolling = !!O
            }
            let _ = process.env.CHOKIDAR_INTERVAL;
            if (_) Y.interval = Number.parseInt(_, 10);
            let w = 0;
            this._emitReady = () => {
                if (w++, w >= this._readyCount) this._emitReady = o31, this._readyEmitted = !0, process.nextTick(() => this.emit(wO.READY))
            }, this._emitRaw = (...O) => this.emit(wO.RAW, ...O), this._boundRemove = this._remove.bind(this), this.options = Y, this._nodeFsHandler = new Q58(this), Object.freeze(Y)
        }
        _addIgnoredPath(A) {
            if (d58(A)) {
                for (let q of this._ignoredPaths)
                    if (d58(q) && q.path === A.path && q.recursive === A.recursive) return
            }
            this._ignoredPaths.add(A)
        }
        _removeIgnoredPath(A) {
            if (this._ignoredPaths.delete(A), typeof A === "string") {
                for (let q of this._ignoredPaths)
                    if (d58(q) && q.path === A) this._ignoredPaths.delete(q)
            }
        }
        add(A, q, K) {
            let {
                cwd: Y
            } = this.options;
            this.closed = !1, this._closePromise = void 0;
            let z = d37(A);
            if (Y) z = z.map((_) => {
                return O$3(_, Y)
            });
            if (z.forEach((_) => {
                    this._removeIgnoredPath(_)
                }), this._userIgnored = void 0, !this._readyCount) this._readyCount = 0;
            return this._readyCount += z.length, Promise.all(z.map(async (_) => {
                let w = await this._nodeFsHandler._addToNodeFs(_, !K, void 0, 0, q);
                if (w) this._emitReady();
                return w
            })).then((_) => {
                if (this.closed) return;
                _.forEach((w) => {
                    if (w) this.add(Z9.dirname(w), Z9.basename(q || w))
                })
            }), this
        }
        unwatch(A) {
            if (this.closed) return this;
            let q = d37(A),
                {
                    cwd: K
                } = this.options;
            return q.forEach((Y) => {
                if (!Z9.isAbsolute(Y) && !this._closers.has(Y)) {
                    if (K) Y = Z9.join(K, Y);
                    Y = Z9.resolve(Y)
                }
                if (this._closePath(Y), this._addIgnoredPath(Y), this._watched.has(Y)) this._addIgnoredPath({
                    path: Y,
                    recursive: !0
                });
                this._userIgnored = void 0
            }), this
        }
        close() {
            if (this._closePromise) return this._closePromise;
            this.closed = !0, this.removeAllListeners();
            let A = [];
            return this._closers.forEach((q) => q.forEach((K) => {
                let Y = K();
                if (Y instanceof Promise) A.push(Y)
            })), this._streams.forEach((q) => q.destroy()), this._userIgnored = void 0, this._readyCount = 0, this._readyEmitted = !1, this._watched.forEach((q) => q.dispose()), this._closers.clear(), this._watched.clear(), this._streams.clear(), this._symlinkPaths.clear(), this._throttled.clear(), this._closePromise = A.length ? Promise.all(A).then(() => {
                return
            }) : Promise.resolve(), this._closePromise
        }
        getWatched() {
            let A = {};
            return this._watched.forEach((q, K) => {
                let z = (this.options.cwd ? Z9.relative(this.options.cwd, K) : K) || i37;
                A[z] = q.getChildren().sort()
            }), A
        }
        emitWithAll(A, q) {
            if (this.emit(A, ...q), A !== wO.ERROR) this.emit(wO.ALL, A, ...q)
        }
        async _emit(A, q, K) {
            if (this.closed) return;
            let Y = this.options;
            if (p58) q = Z9.normalize(q);
            if (Y.cwd) q = Z9.relative(Y.cwd, q);
            let z = [q];
            if (K != null) z.push(K);
            let _ = Y.awaitWriteFinish,
                w;
            if (_ && (w = this._pendingWrites.get(q))) return w.lastChange = new Date, this;
            if (Y.atomic) {
                if (A === wO.UNLINK) return this._pendingUnlinks.set(q, [A, ...z]), setTimeout(() => {
                    this._pendingUnlinks.forEach((O, $) => {
                        this.emit(...O), this.emit(wO.ALL, ...O), this._pendingUnlinks.delete($)
                    })
                }, typeof Y.atomic === "number" ? Y.atomic : 100), this;
                if (A === wO.ADD && this._pendingUnlinks.has(q)) A = wO.CHANGE, this._pendingUnlinks.delete(q)
            }
            if (_ && (A === wO.ADD || A === wO.CHANGE) && this._readyEmitted) {
                let O = ($, H) => {
                    if ($) A = wO.ERROR, z[0] = $, this.emitWithAll(A, z);
                    else if (H) {
                        if (z.length > 1) z[1] = H;
                        else z.push(H);
                        this.emitWithAll(A, z)
                    }
                };
                return this._awaitWriteFinish(q, _.stabilityThreshold, A, O), this
            }
            if (A === wO.CHANGE) {
                if (!this._throttle(wO.CHANGE, q, 50)) return this
            }
            if (Y.alwaysStat && K === void 0 && (A === wO.ADD || A === wO.ADD_DIR || A === wO.CHANGE)) {
                let O = Y.cwd ? Z9.join(Y.cwd, q) : q,
                    $;
                try {
                    $ = await oO3(O)
                } catch (H) {}
                if (!$ || this.closed) return;
                z.push($)
            }
            return this.emitWithAll(A, z), this
        }
        _handleError(A) {
            let q = A && A.code;
            if (A && q !== "ENOENT" && q !== "ENOTDIR" && (!this.options.ignorePermissionErrors || q !== "EPERM" && q !== "EACCES")) this.emit(wO.ERROR, A);
            return A || this.closed
        }
        _throttle(A, q, K) {
            if (!this._throttled.has(A)) this._throttled.set(A, new Map);
            let Y = this._throttled.get(A);
            if (!Y) throw Error("invalid throttle");
            let z = Y.get(q);
            if (z) return z.count++, !1;
            let _, w = () => {
                let $ = Y.get(q),
                    H = $ ? $.count : 0;
                if (Y.delete(q), clearTimeout(_), $) clearTimeout($.timeoutObject);
                return H
            };
            _ = setTimeout(w, K);
            let O = {
                timeoutObject: _,
                clear: w,
                count: 0
            };
            return Y.set(q, O), O
        }
        _incrReadyCount() {
            return this._readyCount++
        }
        _awaitWriteFinish(A, q, K, Y) {
            let z = this.options.awaitWriteFinish;
            if (typeof z !== "object") return;
            let _ = z.pollInterval,
                w, O = A;
            if (this.options.cwd && !Z9.isAbsolute(A)) O = Z9.join(this.options.cwd, A);
            let $ = new Date,
                H = this._pendingWrites;

            function j(J) {
                rO3(O, (M, D) => {
                    if (M || !H.has(A)) {
                        if (M && M.code !== "ENOENT") Y(M);
                        return
                    }
                    let X = Number(new Date);
                    if (J && D.size !== J.size) H.get(A).lastChange = X;
                    let P = H.get(A);
                    if (X - P.lastChange >= q) H.delete(A), Y(void 0, D);
                    else w = setTimeout(j, _, D)
                })
            }
            if (!H.has(A)) H.set(A, {
                lastChange: $,
                cancelWait: () => {
                    return H.delete(A), clearTimeout(w), K
                }
            }), w = setTimeout(j, _)
        }
        _isIgnored(A, q) {
            if (this.options.atomic && K$3.test(A)) return !0;
            if (!this._userIgnored) {
                let {
                    cwd: K
                } = this.options, z = (this.options.ignored || []).map(l37(K)), w = [...[...this._ignoredPaths].map(l37(K)), ...z];
                this._userIgnored = w$3(w, void 0)
            }
            return this._userIgnored(A, q)
        }
        _isntIgnored(A, q) {
            return !this._isIgnored(A, q)
        }
        _getWatchHelpers(A) {
            return new c58(A, this.options.followSymlinks, this)
        }
        _getWatchedDir(A) {
            let q = Z9.resolve(A);
            if (!this._watched.has(q)) this._watched.set(q, new r37(q, this._boundRemove));
            return this._watched.get(q)
        }
        _hasReadPermissions(A) {
            if (this.options.ignorePermissionErrors) return !0;
            return Boolean(Number(A.mode) & 256)
        }
        _remove(A, q, K) {
            let Y = Z9.join(A, q),
                z = Z9.resolve(Y);
            if (K = K != null ? K : this._watched.has(Y) || this._watched.has(z), !this._throttle("remove", Y, 100)) return;
            if (!K && this._watched.size === 1) this.add(A, q, !0);
            this._getWatchedDir(Y).getChildren().forEach((J) => this._remove(Y, J));
            let O = this._getWatchedDir(A),
                $ = O.has(q);
            if (O.remove(q), this._symlinkPaths.has(z)) this._symlinkPaths.delete(z);
            let H = Y;
            if (this.options.cwd) H = Z9.relative(this.options.cwd, Y);
            if (this.options.awaitWriteFinish && this._pendingWrites.has(H)) {
                if (this._pendingWrites.get(H).cancelWait() === wO.ADD) return
            }
            this._watched.delete(Y), this._watched.delete(z);
            let j = K ? wO.UNLINK_DIR : wO.UNLINK;
            if ($ && !this._isIgnored(Y)) this._emit(j, Y);
            this._closePath(Y)
        }
        _closePath(A) {
            this._closeFile(A);
            let q = Z9.dirname(A);
            this._getWatchedDir(q).remove(Z9.basename(A))
        }
        _closeFile(A) {
            let q = this._closers.get(A);
            if (!q) return;
            q.forEach((K) => K()), this._closers.delete(A)
        }
        _addPathCloser(A, q) {
            if (!q) return;
            let K = this._closers.get(A);
            if (!K) K = [], this._closers.set(A, K);
            K.push(q)
        }
        _readdirp(A, q) {
            if (this.closed) return;
            let K = {
                    type: wO.ALL,
                    alwaysStat: !0,
                    lstat: !0,
                    ...q,
                    depth: 0
                },
                Y = I37(A, K);
            return this._streams.add(Y), Y.once(B37, () => {
                Y = void 0
            }), Y.once(F58, () => {
                if (Y) this._streams.delete(Y), Y = void 0
            }), Y
        }
    };
    g46 = {
        watch: o37,
        FSWatcher: t31
    }
})
// @from(Ln 102601, Col 0)
function l58({
    onlyFirst: A = !1
} = {}) {
    let K = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?(?:\\u0007|\\u001B\\u005C|\\u009C))", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"].join("|");
    return new RegExp(K, A ? void 0 : "g")
}
// @from(Ln 102608, Col 0)
function sY(A) {
    if (typeof A !== "string") throw TypeError(`Expected a \`string\`, got \`${typeof A}\``);
    return A.replace(J$3, "")
}
// @from(Ln 102612, Col 4)
J$3
// @from(Ln 102613, Col 4)
LG = E(() => {
    J$3 = l58()
})
// @from(Ln 102617, Col 0)
function a37(A) {
    return A === 161 || A === 164 || A === 167 || A === 168 || A === 170 || A === 173 || A === 174 || A >= 176 && A <= 180 || A >= 182 && A <= 186 || A >= 188 && A <= 191 || A === 198 || A === 208 || A === 215 || A === 216 || A >= 222 && A <= 225 || A === 230 || A >= 232 && A <= 234 || A === 236 || A === 237 || A === 240 || A === 242 || A === 243 || A >= 247 && A <= 250 || A === 252 || A === 254 || A === 257 || A === 273 || A === 275 || A === 283 || A === 294 || A === 295 || A === 299 || A >= 305 && A <= 307 || A === 312 || A >= 319 && A <= 322 || A === 324 || A >= 328 && A <= 331 || A === 333 || A === 338 || A === 339 || A === 358 || A === 359 || A === 363 || A === 462 || A === 464 || A === 466 || A === 468 || A === 470 || A === 472 || A === 474 || A === 476 || A === 593 || A === 609 || A === 708 || A === 711 || A >= 713 && A <= 715 || A === 717 || A === 720 || A >= 728 && A <= 731 || A === 733 || A === 735 || A >= 768 && A <= 879 || A >= 913 && A <= 929 || A >= 931 && A <= 937 || A >= 945 && A <= 961 || A >= 963 && A <= 969 || A === 1025 || A >= 1040 && A <= 1103 || A === 1105 || A === 8208 || A >= 8211 && A <= 8214 || A === 8216 || A === 8217 || A === 8220 || A === 8221 || A >= 8224 && A <= 8226 || A >= 8228 && A <= 8231 || A === 8240 || A === 8242 || A === 8243 || A === 8245 || A === 8251 || A === 8254 || A === 8308 || A === 8319 || A >= 8321 && A <= 8324 || A === 8364 || A === 8451 || A === 8453 || A === 8457 || A === 8467 || A === 8470 || A === 8481 || A === 8482 || A === 8486 || A === 8491 || A === 8531 || A === 8532 || A >= 8539 && A <= 8542 || A >= 8544 && A <= 8555 || A >= 8560 && A <= 8569 || A === 8585 || A >= 8592 && A <= 8601 || A === 8632 || A === 8633 || A === 8658 || A === 8660 || A === 8679 || A === 8704 || A === 8706 || A === 8707 || A === 8711 || A === 8712 || A === 8715 || A === 8719 || A === 8721 || A === 8725 || A === 8730 || A >= 8733 && A <= 8736 || A === 8739 || A === 8741 || A >= 8743 && A <= 8748 || A === 8750 || A >= 8756 && A <= 8759 || A === 8764 || A === 8765 || A === 8776 || A === 8780 || A === 8786 || A === 8800 || A === 8801 || A >= 8804 && A <= 8807 || A === 8810 || A === 8811 || A === 8814 || A === 8815 || A === 8834 || A === 8835 || A === 8838 || A === 8839 || A === 8853 || A === 8857 || A === 8869 || A === 8895 || A === 8978 || A >= 9312 && A <= 9449 || A >= 9451 && A <= 9547 || A >= 9552 && A <= 9587 || A >= 9600 && A <= 9615 || A >= 9618 && A <= 9621 || A === 9632 || A === 9633 || A >= 9635 && A <= 9641 || A === 9650 || A === 9651 || A === 9654 || A === 9655 || A === 9660 || A === 9661 || A === 9664 || A === 9665 || A >= 9670 && A <= 9672 || A === 9675 || A >= 9678 && A <= 9681 || A >= 9698 && A <= 9701 || A === 9711 || A === 9733 || A === 9734 || A === 9737 || A === 9742 || A === 9743 || A === 9756 || A === 9758 || A === 9792 || A === 9794 || A === 9824 || A === 9825 || A >= 9827 && A <= 9829 || A >= 9831 && A <= 9834 || A === 9836 || A === 9837 || A === 9839 || A === 9886 || A === 9887 || A === 9919 || A >= 9926 && A <= 9933 || A >= 9935 && A <= 9939 || A >= 9941 && A <= 9953 || A === 9955 || A === 9960 || A === 9961 || A >= 9963 && A <= 9969 || A === 9972 || A >= 9974 && A <= 9977 || A === 9979 || A === 9980 || A === 9982 || A === 9983 || A === 10045 || A >= 10102 && A <= 10111 || A >= 11094 && A <= 11097 || A >= 12872 && A <= 12879 || A >= 57344 && A <= 63743 || A >= 65024 && A <= 65039 || A === 65533 || A >= 127232 && A <= 127242 || A >= 127248 && A <= 127277 || A >= 127280 && A <= 127337 || A >= 127344 && A <= 127373 || A === 127375 || A === 127376 || A >= 127387 && A <= 127404 || A >= 917760 && A <= 917999 || A >= 983040 && A <= 1048573 || A >= 1048576 && A <= 1114109
}
// @from(Ln 102621, Col 0)
function UC6(A) {
    return A === 12288 || A >= 65281 && A <= 65376 || A >= 65504 && A <= 65510
}
// @from(Ln 102625, Col 0)
function dC6(A) {
    return A >= 4352 && A <= 4447 || A === 8986 || A === 8987 || A === 9001 || A === 9002 || A >= 9193 && A <= 9196 || A === 9200 || A === 9203 || A === 9725 || A === 9726 || A === 9748 || A === 9749 || A >= 9776 && A <= 9783 || A >= 9800 && A <= 9811 || A === 9855 || A >= 9866 && A <= 9871 || A === 9875 || A === 9889 || A === 9898 || A === 9899 || A === 9917 || A === 9918 || A === 9924 || A === 9925 || A === 9934 || A === 9940 || A === 9962 || A === 9970 || A === 9971 || A === 9973 || A === 9978 || A === 9981 || A === 9989 || A === 9994 || A === 9995 || A === 10024 || A === 10060 || A === 10062 || A >= 10067 && A <= 10069 || A === 10071 || A >= 10133 && A <= 10135 || A === 10160 || A === 10175 || A === 11035 || A === 11036 || A === 11088 || A === 11093 || A >= 11904 && A <= 11929 || A >= 11931 && A <= 12019 || A >= 12032 && A <= 12245 || A >= 12272 && A <= 12287 || A >= 12289 && A <= 12350 || A >= 12353 && A <= 12438 || A >= 12441 && A <= 12543 || A >= 12549 && A <= 12591 || A >= 12593 && A <= 12686 || A >= 12688 && A <= 12773 || A >= 12783 && A <= 12830 || A >= 12832 && A <= 12871 || A >= 12880 && A <= 42124 || A >= 42128 && A <= 42182 || A >= 43360 && A <= 43388 || A >= 44032 && A <= 55203 || A >= 63744 && A <= 64255 || A >= 65040 && A <= 65049 || A >= 65072 && A <= 65106 || A >= 65108 && A <= 65126 || A >= 65128 && A <= 65131 || A >= 94176 && A <= 94180 || A >= 94192 && A <= 94198 || A >= 94208 && A <= 101589 || A >= 101631 && A <= 101662 || A >= 101760 && A <= 101874 || A >= 110576 && A <= 110579 || A >= 110581 && A <= 110587 || A === 110589 || A === 110590 || A >= 110592 && A <= 110882 || A === 110898 || A >= 110928 && A <= 110930 || A === 110933 || A >= 110948 && A <= 110951 || A >= 110960 && A <= 111355 || A >= 119552 && A <= 119638 || A >= 119648 && A <= 119670 || A === 126980 || A === 127183 || A === 127374 || A >= 127377 && A <= 127386 || A >= 127488 && A <= 127490 || A >= 127504 && A <= 127547 || A >= 127552 && A <= 127560 || A === 127568 || A === 127569 || A >= 127584 && A <= 127589 || A >= 127744 && A <= 127776 || A >= 127789 && A <= 127797 || A >= 127799 && A <= 127868 || A >= 127870 && A <= 127891 || A >= 127904 && A <= 127946 || A >= 127951 && A <= 127955 || A >= 127968 && A <= 127984 || A === 127988 || A >= 127992 && A <= 128062 || A === 128064 || A >= 128066 && A <= 128252 || A >= 128255 && A <= 128317 || A >= 128331 && A <= 128334 || A >= 128336 && A <= 128359 || A === 128378 || A === 128405 || A === 128406 || A === 128420 || A >= 128507 && A <= 128591 || A >= 128640 && A <= 128709 || A === 128716 || A >= 128720 && A <= 128722 || A >= 128725 && A <= 128728 || A >= 128732 && A <= 128735 || A === 128747 || A === 128748 || A >= 128756 && A <= 128764 || A >= 128992 && A <= 129003 || A === 129008 || A >= 129292 && A <= 129338 || A >= 129340 && A <= 129349 || A >= 129351 && A <= 129535 || A >= 129648 && A <= 129660 || A >= 129664 && A <= 129674 || A >= 129678 && A <= 129734 || A === 129736 || A >= 129741 && A <= 129756 || A >= 129759 && A <= 129770 || A >= 129775 && A <= 129784 || A >= 131072 && A <= 196605 || A >= 196608 && A <= 262141
}
// @from(Ln 102628, Col 4)
i58 = () => {}
// @from(Ln 102630, Col 0)
function M$3(A) {
    if (!Number.isSafeInteger(A)) throw TypeError(`Expected a code point, got \`${typeof A}\`.`)
}
// @from(Ln 102634, Col 0)
function p46(A, {
    ambiguousAsWide: q = !1
} = {}) {
    if (M$3(A), UC6(A) || dC6(A) || q && a37(A)) return 2;
    return 1
}
// @from(Ln 102640, Col 4)
cC6 = E(() => {
    i58();
    i58()
})
// @from(Ln 102644, Col 4)
n58 = x((FW_, s37) => {
    s37.exports = function() {
        return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F|\uD83D\uDC68(?:\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68\uD83C\uDFFB|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C[\uDFFB-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)\uD83C\uDFFB|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB\uDFFC])|\uD83D\uDC69(?:\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB-\uDFFD])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620)\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDF6\uD83C\uDDE6|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5\uDEEB\uDEEC\uDEF4-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g
    }
})
// @from(Ln 102650, Col 0)
function bH() {
    if (!r58) r58 = new Intl.Segmenter(void 0, {
        granularity: "grapheme"
    });
    return r58
}
// @from(Ln 102657, Col 0)
function lC6(A) {
    if (!A) return "";
    return bH().segment(A)[Symbol.iterator]().next().value?.segment ?? ""
}
// @from(Ln 102662, Col 0)
function lQ(A) {
    if (!A) return "";
    let q = "";
    for (let {
            segment: K
        }
        of bH().segment(A)) q = K;
    return q
}
// @from(Ln 102672, Col 0)
function e37() {
    if (!o58) o58 = new Intl.Segmenter(void 0, {
        granularity: "word"
    });
    return o58
}
// @from(Ln 102679, Col 0)
function s58(A, q) {
    let K = `${A}:${q}`,
        Y = t37.get(K);
    if (!Y) Y = new Intl.RelativeTimeFormat("en", {
        style: A,
        numeric: q
    }), t37.set(K, Y);
    return Y
}
// @from(Ln 102689, Col 0)
function t58() {
    if (!a58) a58 = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return a58
}
// @from(Ln 102693, Col 4)
r58 = null
// @from(Ln 102694, Col 4)
o58 = null
// @from(Ln 102695, Col 4)
t37
// @from(Ln 102695, Col 9)
a58 = null
// @from(Ln 102696, Col 4)
AL = E(() => {
    t37 = new Map
})
// @from(Ln 102700, Col 0)
function D$3(A) {
    if (typeof A !== "string" || A.length === 0) return 0;
    let q = !0;
    for (let Y = 0; Y < A.length; Y++) {
        let z = A.charCodeAt(Y);
        if (z >= 127 || z === 27) {
            q = !1;
            break
        }
    }
    if (q) {
        let Y = 0;
        for (let z = 0; z < A.length; z++)
            if (A.charCodeAt(z) > 31) Y++;
        return Y
    }
    if (A.includes("\x1B")) {
        if (A = sY(A), A.length === 0) return 0
    }
    if (!X$3(A)) {
        let Y = 0;
        for (let z of A) {
            let _ = z.codePointAt(0);
            if (!q97(_)) Y += p46(_, {
                ambiguousAsWide: !1
            })
        }
        return Y
    }
    let K = 0;
    for (let {
            segment: Y
        }
        of bH().segment(A)) {
        if (A97.lastIndex = 0, A97.test(Y)) {
            K += P$3(Y);
            continue
        }
        for (let z of Y) {
            let _ = z.codePointAt(0);
            if (!q97(_)) {
                K += p46(_, {
                    ambiguousAsWide: !1
                });
                break
            }
        }
    }
    return K
}
// @from(Ln 102751, Col 0)
function X$3(A) {
    for (let q of A) {
        let K = q.codePointAt(0);
        if (K >= 127744 && K <= 129791) return !0;
        if (K >= 9728 && K <= 10175) return !0;
        if (K >= 127462 && K <= 127487) return !0;
        if (K >= 65024 && K <= 65039) return !0;
        if (K === 8205) return !0
    }
    return !1
}
// @from(Ln 102763, Col 0)
function P$3(A) {
    let q = A.codePointAt(0);
    if (q >= 127462 && q <= 127487) {
        let K = 0;
        for (let Y of A) K++;
        return K === 1 ? 1 : 2
    }
    if (A.length === 2) {
        if (A.codePointAt(1) === 65039 && (q >= 48 && q <= 57 || q === 35 || q === 42)) return 1
    }
    return 2
}
// @from(Ln 102776, Col 0)
function q97(A) {
    if (A >= 32 && A < 127) return !1;
    if (A >= 160 && A < 768) return A === 173;
    if (A <= 31 || A >= 127 && A <= 159) return !0;
    if (A >= 8203 && A <= 8205 || A === 65279 || A >= 8288 && A <= 8292) return !0;
    if (A >= 65024 && A <= 65039 || A >= 917760 && A <= 917999) return !0;
    if (A >= 768 && A <= 879 || A >= 6832 && A <= 6911 || A >= 7616 && A <= 7679 || A >= 8400 && A <= 8447 || A >= 65056 && A <= 65071) return !0;
    if (A >= 2304 && A <= 3407) {
        let q = A & 127;
        if (q <= 3) return !0;
        if (q >= 58 && q <= 79) return !0;
        if (q >= 81 && q <= 87) return !0;
        if (q >= 98 && q <= 99) return !0
    }
    if (A === 3633 || A >= 3636 && A <= 3642 || A >= 3655 && A <= 3662 || A === 3761 || A >= 3764 && A <= 3772 || A >= 3784 && A <= 3789) return !0;
    if (A >= 1536 && A <= 1541 || A === 1757 || A === 1807 || A === 2274) return !0;
    if (A >= 55296 && A <= 57343) return !0;
    if (A >= 917504 && A <= 917631) return !0;
    return !1
}
// @from(Ln 102796, Col 4)
Y97
// @from(Ln 102796, Col 9)
A97
// @from(Ln 102796, Col 14)
K97
// @from(Ln 102796, Col 19)
W$3
// @from(Ln 102796, Col 24)
f8
// @from(Ln 102797, Col 4)
q3 = E(() => {
    LG();
    cC6();
    AL();
    Y97 = t(n58(), 1), A97 = Y97.default();
    K97 = typeof Bun < "u" && typeof Bun.stringWidth === "function" ? Bun.stringWidth : null, W$3 = {
        ambiguousIsNarrow: !0
    }, f8 = K97 ? (A) => K97(A, W$3) : D$3
})
// @from(Ln 102807, Col 0)
function q91(A, q) {
    if (f8(A) <= q) return A;
    if (q <= 0) return "…";
    if (q < 5) return jq(A, q);
    let K = A.lastIndexOf("/"),
        Y = K >= 0 ? A.slice(K) : A,
        z = K >= 0 ? A.slice(0, K) : "",
        _ = f8(Y);
    if (_ >= q - 1) return VJ6(A, q);
    let w = q - 1 - _;
    if (w <= 0) return VJ6(Y, q);
    return kJ6(z, w) + "…" + Y
}
// @from(Ln 102821, Col 0)
function jq(A, q) {
    if (f8(A) <= q) return A;
    if (q <= 1) return "…";
    let K = 0,
        Y = "";
    for (let {
            segment: z
        }
        of bH().segment(A)) {
        let _ = f8(z);
        if (K + _ > q - 1) break;
        Y += z, K += _
    }
    return Y + "…"
}
// @from(Ln 102837, Col 0)
function VJ6(A, q) {
    if (f8(A) <= q) return A;
    if (q <= 1) return "…";
    let K = [...bH().segment(A)],
        Y = 0,
        z = K.length;
    for (let _ = K.length - 1; _ >= 0; _--) {
        let w = f8(K[_].segment);
        if (Y + w > q - 1) break;
        Y += w, z = _
    }
    return "…" + K.slice(z).map((_) => _.segment).join("")
}
// @from(Ln 102851, Col 0)
function kJ6(A, q) {
    if (f8(A) <= q) return A;
    if (q <= 0) return "";
    let K = 0,
        Y = "";
    for (let {
            segment: z
        }
        of bH().segment(A)) {
        let _ = f8(z);
        if (K + _ > q) break;
        Y += z, K += _
    }
    return Y
}
// @from(Ln 102867, Col 0)
function R3(A, q, K = !1) {
    let Y = A;
    if (K) {
        let z = A.indexOf(`
`);
        if (z !== -1) {
            if (Y = A.substring(0, z), f8(Y) + 1 > q) return jq(Y, q);
            return `${Y}…`
        }
    }
    if (f8(Y) <= q) return Y;
    return jq(Y, q)
}
// @from(Ln 102881, Col 0)
function UK(A, q) {
    if (A < 60000) {
        if (A === 0) return "0s";
        if (A < 1) return `${(A/1000).toFixed(1)}s`;
        return `${Math.round(A/1000).toString()}s`
    }
    let K = Math.floor(A / 86400000),
        Y = Math.floor(A % 86400000 / 3600000),
        z = Math.floor(A % 3600000 / 60000),
        _ = Math.round(A % 60000 / 1000);
    if (_ === 60) _ = 0, z++;
    if (z === 60) z = 0, Y++;
    if (Y === 24) Y = 0, K++;
    let w = q?.hideTrailingZeros;
    if (q?.mostSignificantOnly) {
        if (K > 0) return `${K}d`;
        if (Y > 0) return `${Y}h`;
        if (z > 0) return `${z}m`;
        return `${_}s`
    }
    if (K > 0) {
        if (w && Y === 0 && z === 0) return `${K}d`;
        if (w && z === 0) return `${K}d ${Y}h`;
        return `${K}d ${Y}h ${z}m`
    }
    if (Y > 0) {
        if (w && z === 0 && _ === 0) return `${Y}h`;
        if (w && _ === 0) return `${Y}h ${z}m`;
        return `${Y}h ${z}m ${_}s`
    }
    if (z > 0) {
        if (w && _ === 0) return `${z}m`;
        return `${z}m ${_}s`
    }
    return `${_}s`
}
// @from(Ln 102918, Col 0)
function fq(A) {
    let q = A >= 1000;
    return Z$3(q).format(A).toLowerCase()
}
// @from(Ln 102923, Col 0)
function A91(A, q = {}) {
    let {
        style: K = "narrow",
        numeric: Y = "always",
        now: z = new Date
    } = q, _ = A.getTime() - z.getTime(), w = Math.trunc(_ / 1000), O = [{
        unit: "year",
        seconds: 31536000,
        shortUnit: "y"
    }, {
        unit: "month",
        seconds: 2592000,
        shortUnit: "mo"
    }, {
        unit: "week",
        seconds: 604800,
        shortUnit: "w"
    }, {
        unit: "day",
        seconds: 86400,
        shortUnit: "d"
    }, {
        unit: "hour",
        seconds: 3600,
        shortUnit: "h"
    }, {
        unit: "minute",
        seconds: 60,
        shortUnit: "m"
    }, {
        unit: "second",
        seconds: 1,
        shortUnit: "s"
    }];
    for (let {
            unit: $,
            seconds: H,
            shortUnit: j
        }
        of O)
        if (Math.abs(w) >= H) {
            let J = Math.trunc(w / H);
            if (K === "narrow") return w < 0 ? `${Math.abs(J)}${j} ago` : `in ${J}${j}`;
            return s58("long", Y).format(J, $)
        } if (K === "narrow") return w <= 0 ? "0s ago" : "in 0s";
    return s58(K, Y).format(0, "second")
}
// @from(Ln 102971, Col 0)
function Q46(A, q = {}) {
    let {
        now: K = new Date,
        ...Y
    } = q;
    if (A > K) return A91(A, {
        ...Y,
        now: K
    });
    return A91(A, {
        ...Y,
        numeric: "always",
        now: K
    })
}
// @from(Ln 102987, Col 0)
function iC6(A) {
    let q = A.fileSize !== void 0 ? xq(A.fileSize) : `${A.messageCount} messages`,
        K = [Q46(A.modified, {
            style: "short"
        }), ...A.gitBranch ? [A.gitBranch] : [], q];
    if (A.tag) K.push(`#${A.tag}`);
    if (A.agentSetting) K.push(`agent:${A.agentSetting}`);
    if (A.prNumber) {
        let Y = A.prRepository ? `${A.prRepository.split("/")[1]}#${A.prNumber}` : `PR #${A.prNumber}`;
        K.push(Y)
    }
    return K.join(" · ")
}
// @from(Ln 103001, Col 0)
function EJ6(A, q = !1, K = !0) {
    if (!A) return;
    let Y = new Date(A * 1000),
        z = new Date,
        _ = Y.getMinutes();
    if ((Y.getTime() - z.getTime()) / 3600000 > 24) {
        let $ = {
            month: "short",
            day: "numeric",
            hour: K ? "numeric" : void 0,
            minute: !K || _ === 0 ? void 0 : "2-digit",
            hour12: K ? !0 : void 0
        };
        if (Y.getFullYear() !== z.getFullYear()) $.year = "numeric";
        return Y.toLocaleString("en-US", $).replace(/ ([AP]M)/i, (j, J) => J.toLowerCase()) + (q ? ` (${t58()})` : "")
    }
    return Y.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: _ === 0 ? void 0 : "2-digit",
        hour12: !0
    }).replace(/ ([AP]M)/i, ($, H) => H.toLowerCase()) + (q ? ` (${t58()})` : "")
}
// @from(Ln 103024, Col 0)
function OO(A) {
    if (A < 1000) return String(A);
    let K = (A / 1000).toFixed(1);
    if (K.endsWith(".0")) return `${K.slice(0,-2)}k`;
    return `${K}k`
}
// @from(Ln 103031, Col 0)
function z97(A, q = !1, K = !0) {
    let Y = new Date(A);
    return `${EJ6(Math.floor(Y.getTime()/1000),q,K)}`
}
// @from(Ln 103035, Col 4)
e58 = null
// @from(Ln 103036, Col 4)
A38 = null
// @from(Ln 103037, Col 4)
Z$3 = (A) => {
        if (A) {
            if (!e58) e58 = new Intl.NumberFormat("en-US", {
                notation: "compact",
                maximumFractionDigits: 1,
                minimumFractionDigits: 1
            });
            return e58
        } else {
            if (!A38) A38 = new Intl.NumberFormat("en-US", {
                notation: "compact",
                maximumFractionDigits: 1,
                minimumFractionDigits: 0
            });
            return A38
        }
    }
// @from(Ln 103054, Col 4)
M4 = E(() => {
    q3();
    Z7();
    AL()
})
// @from(Ln 103059, Col 4)
j97 = x((oW_, H97) => {
    var $97 = x6("child_process"),
        _97 = $97.spawn,
        G$3 = $97.exec;
    H97.exports = function(A, q, K) {
        if (typeof q === "function" && K === void 0) K = q, q = void 0;
        if (A = parseInt(A), Number.isNaN(A))
            if (K) return K(Error("pid must be a number"));
            else throw Error("pid must be a number");
        var Y = {},
            z = {};
        switch (Y[A] = [], z[A] = 1, process.platform) {
            case "win32":
                G$3("taskkill /pid " + A + " /T /F", K);
                break;
            case "darwin":
                q38(A, Y, z, function(_) {
                    return _97("pgrep", ["-P", _])
                }, function() {
                    w97(Y, q, K)
                });
                break;
            default:
                q38(A, Y, z, function(_) {
                    return _97("ps", ["-o", "pid", "--no-headers", "--ppid", _])
                }, function() {
                    w97(Y, q, K)
                });
                break
        }
    };

    function w97(A, q, K) {
        var Y = {};
        try {
            Object.keys(A).forEach(function(z) {
                if (A[z].forEach(function(_) {
                        if (!Y[_]) O97(_, q), Y[_] = 1
                    }), !Y[z]) O97(z, q), Y[z] = 1
            })
        } catch (z) {
            if (K) return K(z);
            else throw z
        }
        if (K) return K()
    }

    function O97(A, q) {
        try {
            process.kill(parseInt(A, 10), q)
        } catch (K) {
            if (K.code !== "ESRCH") throw K
        }
    }

    function q38(A, q, K, Y, z) {
        var _ = Y(A),
            w = "";
        _.stdout.on("data", function(H) {
            var H = H.toString("ascii");
            w += H
        });
        var O = function($) {
            if (delete K[A], $ != 0) {
                if (Object.keys(K).length == 0) z();
                return
            }
            w.match(/\d+/g).forEach(function(H) {
                H = parseInt(H, 10), q[A].push(H), q[H] = [], K[H] = 1, q38(H, q, K, Y, z)
            })
        };
        _.on("close", O)
    }
})
// @from(Ln 103147, Col 0)
function yJ6() {
    if (K38 === void 0) K38 = D97(z91(), R1(), "tasks");
    return K38
}
// @from(Ln 103151, Col 0)
async function Y38() {
    await f$3(yJ6(), {
        recursive: !0
    })
}
// @from(Ln 103157, Col 0)
function g2(A) {
    return D97(yJ6(), `${A}.output`)
}
// @from(Ln 103160, Col 0)
class Y91 {
    #A;
    #q = null;
    #K = [];
    #z = null;
    #Y = null;
    constructor(A) {
        this.#A = g2(A)
    }
    append(A) {
        if (this.#K.push(A), !this.#z) this.#z = new Promise((q) => {
            this.#Y = q
        }), this.#H()
    }
    flush() {
        return this.#z ?? Promise.resolve()
    }
    cancel() {
        this.#K.length = 0
    }
    async #w() {
        while (!0) {
            try {
                if (!this.#q) await Y38(), this.#q = await M97(this.#A, process.platform === "win32" ? "a" : U46.O_WRONLY | U46.O_APPEND | U46.O_CREAT | X97);
                while (!0)
                    if (await this.#_(), this.#K.length === 0) break
            } finally {
                if (this.#q) {
                    let A = this.#q;
                    this.#q = null, await A.close()
                }
            }
            if (this.#K.length) continue;
            break
        }
    }
    #_() {
        return this.#q.appendFile(this.#$())
    }
    #$() {
        let A = this.#K.splice(0, this.#K.length),
            q = 0;
        for (let z of A) q += Buffer.byteLength(z, "utf8");
        let K = Buffer.allocUnsafe(q),
            Y = 0;
        for (let z of A) Y += K.write(z, Y, "utf8");
        return K
    }
    async #H() {
        try {
            await this.#w()
        } finally {
            let A = this.#Y;
            this.#z = null, this.#Y = null, A()
        }
    }
}
// @from(Ln 103218, Col 0)
function v$3(A) {
    let q = K91.get(A);
    if (!q) q = new Y91(A), K91.set(A, q);
    return q
}
// @from(Ln 103224, Col 0)
function W97(A, q) {
    v$3(A).append(q)
}
// @from(Ln 103227, Col 0)
async function $O(A) {
    let q = K91.get(A);
    if (q) await q.flush(), K91.delete(A)
}
// @from(Ln 103231, Col 0)
async function Z97(A, q, K = P97) {
    try {
        let Y = await dt6(g2(A), q, K);
        if (!Y) return {
            content: "",
            newOffset: q
        };
        return {
            content: Y.content,
            newOffset: q + Y.bytesRead
        }
    } catch (Y) {
        if (Y.code === "ENOENT") return {
            content: "",
            newOffset: q
        };
        return _6(Y), {
            content: "",
            newOffset: q
        }
    }
}
// @from(Ln 103253, Col 0)
async function z38(A, q = P97) {
    try {
        let {
            content: K,
            bytesTotal: Y,
            bytesRead: z
        } = await ow6(g2(A), q);
        if (Y > z) return `[${Math.round((Y-z)/1024)}KB of earlier output omitted]
${K}`;
        return K
    } catch (K) {
        if (K.code === "ENOENT") return "";
        return _6(K), ""
    }
}
// @from(Ln 103268, Col 0)
async function _38(A) {
    await Y38();
    let q = g2(A);
    return await (await M97(q, process.platform === "win32" ? "wx" : U46.O_WRONLY | U46.O_CREAT | U46.O_EXCL | X97)).close(), q
}
// @from(Ln 103273, Col 0)
async function Co(A, q) {
    try {
        await Y38();
        let K = g2(A);
        try {
            await J97(q, K)
        } catch {
            await T$3(K), await J97(q, K)
        }
        return K
    } catch (K) {
        return _6(K), _38(A)
    }
}
// @from(Ln 103287, Col 4)
X97
// @from(Ln 103287, Col 9)
P97 = 8388608
// @from(Ln 103288, Col 4)
K38
// @from(Ln 103288, Col 9)
K91
// @from(Ln 103289, Col 4)
SM = E(() => {
    SA();
    k1();
    RY();
    T1();
    X97 = U46.O_NOFOLLOW ?? 0;
    K91 = new Map
})
// @from(Ln 103301, Col 0)
function LJ6(A) {
    return A === "completed" || A === "failed" || A === "killed"
}
// @from(Ln 103305, Col 0)
function k$3(A) {
    return V$3[A] ?? "x"
}
// @from(Ln 103309, Col 0)
function oV(A) {
    let q = k$3(A),
        K = N$3(8),
        Y = q;
    for (let z = 0; z < 8; z++) Y += G97[K[z] % G97.length];
    return Y
}
// @from(Ln 103317, Col 0)
function RG(A, q, K, Y) {
    return {
        id: A,
        type: q,
        status: "pending",
        description: K,
        toolUseId: Y,
        startTime: Date.now(),
        outputFile: g2(A),
        outputOffset: 0,
        notified: !1
    }
}
// @from(Ln 103330, Col 4)
V$3
// @from(Ln 103330, Col 9)
G97 = "0123456789abcdefghijklmnopqrstuvwxyz"
// @from(Ln 103331, Col 4)
qL = E(() => {
    SM();
    V$3 = {
        local_bash: "b",
        local_agent: "a",
        remote_agent: "r",
        in_process_teammate: "t",
        local_workflow: "w"
    }
})
// @from(Ln 103341, Col 0)
class nC6 {
    capacity;
    buffer;
    head = 0;
    size = 0;
    constructor(A) {
        this.capacity = A;
        this.buffer = Array(A)
    }
    add(A) {
        if (this.buffer[this.head] = A, this.head = (this.head + 1) % this.capacity, this.size < this.capacity) this.size++
    }
    addAll(A) {
        for (let q of A) this.add(q)
    }
    getRecent(A) {
        let q = [],
            K = this.size < this.capacity ? 0 : this.head,
            Y = Math.min(A, this.size);
        for (let z = 0; z < Y; z++) {
            let _ = (K + this.size - Y + z) % this.capacity;
            q.push(this.buffer[_])
        }
        return q
    }
    toArray() {
        if (this.size === 0) return [];
        let A = [],
            q = this.size < this.capacity ? 0 : this.head;
        for (let K = 0; K < this.size; K++) {
            let Y = (q + K) % this.capacity;
            A.push(this.buffer[Y])
        }
        return A
    }
    clear() {
        this.buffer.length = 0, this.head = 0, this.size = 0
    }
    length() {
        return this.size
    }
}
// @from(Ln 103384, Col 0)
function RJ6(A) {
    return A.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
// @from(Ln 103388, Col 0)
function MC(A) {
    return A.replace(/[０-９]/g, (q) => String.fromCharCode(q.charCodeAt(0) - 65248))
}
// @from(Ln 103392, Col 0)
function _91(A) {
    return A.replace(/\u3000/g, " ")
}
// @from(Ln 103396, Col 0)
function w91(A, q = ",", K = f97) {
    let z = "";
    for (let _ of A) {
        let w = z ? q : "",
            O = w + _;
        if (z.length + O.length <= K) z += O;
        else {
            let $ = K - z.length - w.length - 14;
            if ($ > 0) z += w + _.slice(0, $) + "...[truncated]";
            else z += "...[truncated]";
            return z
        }
    }
    return z
}
// @from(Ln 103411, Col 0)
class w38 {
    maxSize;
    content = "";
    isTruncated = !1;
    totalBytesReceived = 0;
    constructor(A = f97) {
        this.maxSize = A
    }
    append(A) {
        let q = typeof A === "string" ? A : A.toString();
        if (this.totalBytesReceived += q.length, this.isTruncated && this.content.length >= this.maxSize) return;
        if (this.content.length + q.length > this.maxSize) {
            let K = this.maxSize - this.content.length;
            if (K > 0) this.content += q.slice(0, K);
            this.isTruncated = !0
        } else this.content += q
    }
    toString() {
        if (!this.isTruncated) return this.content;
        let A = this.totalBytesReceived - this.maxSize,
            q = Math.round(A / 1024);
        return this.content + `
... [output truncated - ${q}KB removed]`
    }
    clear() {
        this.content = "", this.isTruncated = !1, this.totalBytesReceived = 0
    }
    get length() {
        return this.content.length
    }
    get truncated() {
        return this.isTruncated
    }
    get totalBytes() {
        return this.totalBytesReceived
    }
}
// @from(Ln 103449, Col 0)
function T97(A, q) {
    let K = A.split(`
`);
    if (K.length <= q) return A;
    return K.slice(0, q).join(`
`) + "…"
}
// @from(Ln 103456, Col 4)
f97 = 33554432
// @from(Ln 103458, Col 0)
function Io(A, q, K, Y) {
    if (!q) return {
        effective: K,
        status: "valid"
    };
    let z = parseInt(q, 10);
    if (isNaN(z) || z <= 0) {
        let _ = {
            effective: K,
            status: "invalid",
            message: `Invalid value "${q}" (using default: ${K})`
        };
        return k(`${A} ${_.message}`), _
    }
    if (z > Y) {
        let _ = {
            effective: Y,
            status: "capped",
            message: `Capped from ${z} to ${Y}`
        };
        return k(`${A} ${_.message}`), _
    }
    return {
        effective: z,
        status: "valid"
    }
}
// @from(Ln 103485, Col 4)
rC6 = E(() => {
    H1()
})
// @from(Ln 103489, Col 0)
function O91() {
    return Io("BASH_MAX_OUTPUT_LENGTH", process.env.BASH_MAX_OUTPUT_LENGTH, $38, O38).effective
}
// @from(Ln 103492, Col 4)
O38 = 150000
// @from(Ln 103493, Col 4)
$38 = 30000
// @from(Ln 103494, Col 4)
$91 = E(() => {
    rC6()
})
// @from(Ln 103500, Col 4)
y$3 = 8388608
// @from(Ln 103501, Col 4)
L$3 = 1000
// @from(Ln 103502, Col 4)
R$3 = 4096
// @from(Ln 103503, Col 4)
kw