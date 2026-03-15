
// @from(Ln 239522, Col 4)
iV8 = E(() => {
    RY();
    F$();
    F9();
    jZ();
    RJ();
    JZ();
    H01();
    J01();
    hp6 = {
        cd: (A) => A.length === 0 ? [vg9()] : [A.join(" ")],
        ls: (A) => {
            let q = P_(A);
            return q.length > 0 ? q : ["."]
        },
        find: (A) => {
            let q = [],
                K = new Set(["-newer", "-anewer", "-cnewer", "-mnewer", "-samefile", "-path", "-wholename", "-ilname", "-lname", "-ipath", "-iwholename"]),
                Y = /^-newer[acmBt][acmtB]$/,
                z = !1,
                _ = !1;
            for (let w = 0; w < A.length; w++) {
                let O = A[w];
                if (!O) continue;
                if (_) {
                    q.push(O);
                    continue
                }
                if (O === "--") {
                    _ = !0;
                    continue
                }
                if (O.startsWith("-")) {
                    if (["-H", "-L", "-P"].includes(O)) continue;
                    if (z = !0, K.has(O) || Y.test(O)) {
                        let $ = A[w + 1];
                        if ($) q.push($), w++
                    }
                    continue
                }
                if (!z) q.push(O)
            }
            return q.length > 0 ? q : ["."]
        },
        mkdir: P_,
        touch: P_,
        rm: P_,
        rmdir: P_,
        mv: P_,
        cp: P_,
        cat: P_,
        head: P_,
        tail: P_,
        sort: P_,
        uniq: P_,
        wc: P_,
        cut: P_,
        paste: P_,
        column: P_,
        file: P_,
        stat: P_,
        diff: P_,
        awk: P_,
        strings: P_,
        hexdump: P_,
        od: P_,
        base64: P_,
        nl: P_,
        sha256sum: P_,
        sha1sum: P_,
        md5sum: P_,
        tr: (A) => {
            let q = A.some((Y) => Y === "-d" || Y === "--delete" || Y.startsWith("-") && Y.includes("d"));
            return P_(A).slice(q ? 1 : 2)
        },
        grep: (A) => {
            let K = Oz4(A, new Set(["-e", "--regexp", "-f", "--file", "--exclude", "--include", "--exclude-dir", "--include-dir", "-m", "--max-count", "-A", "--after-context", "-B", "--before-context", "-C", "--context"]));
            if (K.length === 0 && A.some((Y) => ["-r", "-R", "--recursive"].includes(Y))) return ["."];
            return K
        },
        rg: (A) => {
            return Oz4(A, new Set(["-e", "--regexp", "-f", "--file", "-t", "--type", "-T", "--type-not", "-g", "--glob", "-m", "--max-count", "--max-depth", "-r", "--replace", "-A", "--after-context", "-B", "--before-context", "-C", "--context"]), ["."])
        },
        sed: (A) => {
            let q = [],
                K = !1,
                Y = !1,
                z = !1;
            for (let _ = 0; _ < A.length; _++) {
                if (K) {
                    K = !1;
                    continue
                }
                let w = A[_];
                if (!w) continue;
                if (!z && w === "--") {
                    z = !0;
                    continue
                }
                if (!z && w.startsWith("-")) {
                    if (["-f", "--file"].includes(w)) {
                        let O = A[_ + 1];
                        if (O) q.push(O), K = !0;
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
                Y = !1,
                z = !1;
            for (let _ = 0; _ < A.length; _++) {
                let w = A[_];
                if (w === void 0 || w === null) continue;
                if (!z && w === "--") {
                    z = !0;
                    continue
                }
                if (!z && w.startsWith("-")) {
                    let O = w.split("=")[0];
                    if (O && ["-e", "--expression"].includes(O)) Y = !0;
                    if (O && K.has(O) && !w.includes("=")) _++;
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
                if (A.includes("--no-index")) return P_(A.slice(1)).slice(0, 2)
            }
            return []
        }
    }, Hz4 = Object.keys(hp6), Vg9 = {
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
    }, Sp6 = {
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
    }, kg9 = {
        mv: (A) => !A.some((q) => q?.startsWith("-")),
        cp: (A) => !A.some((q) => q?.startsWith("-"))
    };
    $z4 = /^[A-Za-z0-9_.+-]+$/
})
// @from(Ln 239751, Col 0)
function $0(A, q) {
    for (let K of q) {
        if (!K) continue;
        let Y = K;
        if (K.startsWith("-")) {
            let _ = K.indexOf("=");
            if (_ === -1) continue;
            if (Y = K.slice(_ + 1), !Y) continue
        }
        if (!Y.includes("/") && !Y.includes("://") && !Y.includes("@")) continue;
        if (Y.includes("://")) return !0;
        if (Y.includes("@")) return !0;
        if ((Y.match(/\//g) || []).length >= 2) return !0
    }
    return !1
}
// @from(Ln 239768, Col 0)
function r36(A) {
    if (y8() !== "windows") return !1;
    if (/\\\\[^\s\\/]+(?:@(?:\d+|ssl))?(?:[\\/]|$|\s)/i.test(A)) return !0;
    if (/(?<!:)\/\/[^\s\\/]+(?:@(?:\d+|ssl))?(?:[\\/]|$|\s)/i.test(A)) return !0;
    if (/\/\\{2,}[^\s\\/]/.test(A)) return !0;
    if (/\\{2,}\/[^\s\\/]/.test(A)) return !0;
    if (/@SSL@\d+/i.test(A) || /@\d+@SSL/i.test(A)) return !0;
    if (/DavWWWRoot/i.test(A)) return !0;
    if (/^\\\\(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})[\\/]/.test(A) || /^\/\/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})[\\/]/.test(A)) return !0;
    if (/^\\\\(\[[\da-fA-F:]+\])[\\/]/.test(A) || /^\/\/(\[[\da-fA-F:]+\])[\\/]/.test(A)) return !0;
    return !1
}
// @from(Ln 239781, Col 0)
function Dz4(A, q) {
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
// @from(Ln 239800, Col 0)
function Tz4(A, q, K, Y) {
    let z = q;
    while (z < A.length) {
        let _ = A[z];
        if (!_) {
            z++;
            continue
        }
        if (Y?.xargsTargetCommands && Y.commandName === "xargs" && (!_.startsWith("-") || _ === "--")) {
            if (_ === "--" && z + 1 < A.length) z++, _ = A[z];
            if (_ && Y.xargsTargetCommands.includes(_)) break;
            return !1
        }
        if (_ === "--") {
            if (K.respectsDoubleDash !== !1) {
                z++;
                break
            }
            z++;
            continue
        }
        if (_.startsWith("-") && _.length > 1 && Mz4.test(_)) {
            let w = _.includes("="),
                [O, ...$] = _.split("="),
                H = $.join("=");
            if (!O) return !1;
            let j = K.safeFlags[O];
            if (!j) {
                if (Y?.commandName === "git" && O.match(/^-\d+$/)) {
                    z++;
                    continue
                }
                if ((Y?.commandName === "grep" || Y?.commandName === "rg") && O.startsWith("-") && !O.startsWith("--") && O.length > 2) {
                    let J = O.substring(0, 2),
                        M = O.substring(2);
                    if (K.safeFlags[J] && /^\d+$/.test(M)) {
                        let D = K.safeFlags[J];
                        if (D === "number" || D === "string")
                            if (Dz4(M, D)) {
                                z++;
                                continue
                            } else return !1
                    }
                }
                if (O.startsWith("-") && !O.startsWith("--") && O.length > 2) {
                    for (let J = 1; J < O.length; J++) {
                        let M = "-" + O[J],
                            D = K.safeFlags[M];
                        if (!D) return !1;
                        if (D !== "none") return !1
                    }
                    z++;
                    continue
                } else return !1
            }
            if (j === "none") {
                if (w) return !1;
                z++
            } else {
                let J;
                if (w) J = H, z++;
                else {
                    if (z + 1 >= A.length || A[z + 1] && A[z + 1].startsWith("-") && A[z + 1].length > 1 && Mz4.test(A[z + 1])) return !1;
                    J = A[z + 1] || "", z += 2
                }
                if (j === "string" && J.startsWith("-"))
                    if (O === "--sort" && Y?.commandName === "git" && J.match(/^-[a-zA-Z]/));
                    else return !1;
                if (!Dz4(J, j)) return !1
            }
        } else z++
    }
    return !0
}
// @from(Ln 239874, Col 4)
Cp6
// @from(Ln 239874, Col 9)
M01
// @from(Ln 239874, Col 14)
D01
// @from(Ln 239874, Col 19)
X01
// @from(Ln 239874, Col 24)
P01
// @from(Ln 239874, Col 29)
Ip6
// @from(Ln 239874, Col 34)
oV8
// @from(Ln 239874, Col 39)
aV8
// @from(Ln 239874, Col 44)
Xz4
// @from(Ln 239874, Col 49)
Pz4
// @from(Ln 239874, Col 54)
Wz4
// @from(Ln 239874, Col 59)
Zz4
// @from(Ln 239874, Col 64)
Gz4
// @from(Ln 239874, Col 69)
fz4
// @from(Ln 239874, Col 74)
Mz4
// @from(Ln 239875, Col 4)
W01 = E(() => {
    YK();
    Cp6 = {
        "--all": "none",
        "--branches": "none",
        "--tags": "none",
        "--remotes": "none"
    }, M01 = {
        "--since": "string",
        "--after": "string",
        "--until": "string",
        "--before": "string"
    }, D01 = {
        "--oneline": "none",
        "--graph": "none",
        "--decorate": "none",
        "--no-decorate": "none",
        "--date": "string",
        "--relative-date": "none"
    }, X01 = {
        "--max-count": "number",
        "-n": "number"
    }, P01 = {
        "--stat": "none",
        "--numstat": "none",
        "--shortstat": "none",
        "--name-only": "none",
        "--name-status": "none"
    }, Ip6 = {
        "--color": "none",
        "--no-color": "none"
    }, oV8 = {
        "--patch": "none",
        "-p": "none",
        "--no-patch": "none",
        "--no-ext-diff": "none",
        "-s": "none"
    }, aV8 = {
        "--author": "string",
        "--committer": "string",
        "--grep": "string"
    }, Xz4 = {
        "git diff": {
            safeFlags: {
                ...P01,
                ...Ip6,
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
                "-S": "string",
                "-G": "string",
                "-O": "string",
                "-R": "none"
            }
        },
        "git log": {
            safeFlags: {
                ...D01,
                ...Cp6,
                ...M01,
                ...X01,
                ...P01,
                ...Ip6,
                ...oV8,
                ...aV8,
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
                ...D01,
                ...P01,
                ...Ip6,
                ...oV8,
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
                ...Cp6,
                ...M01,
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
                ...D01,
                ...Cp6,
                ...M01,
                ...X01,
                ...aV8
            },
            additionalCommandIsDangerousCallback: (A, q) => {
                let K = new Set(["expire", "delete", "exists"]);
                for (let Y of q) {
                    if (!Y || Y.startsWith("-")) continue;
                    if (K.has(Y)) return !0;
                    return !1
                }
                return !1
            }
        },
        "git stash list": {
            safeFlags: {
                ...D01,
                ...Cp6,
                ...X01
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
                "--sort": "string"
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
                ...Ip6,
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
            additionalCommandIsDangerousCallback: (A, q) => {
                let K = q.filter((Y) => Y !== "-n");
                if (K.length !== 1) return !0;
                return !/^[a-zA-Z0-9_-]+$/.test(K[0])
            }
        },
        "git remote": {
            safeFlags: {
                "-v": "none",
                "--verbose": "none"
            },
            additionalCommandIsDangerousCallback: (A, q) => {
                return q.some((K) => K !== "-v" && K !== "--verbose")
            }
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
                ...Cp6,
                ...M01,
                ...X01,
                ...aV8,
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
                ...P01,
                ...Ip6,
                ...oV8,
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
            },
            additionalCommandIsDangerousCallback: (A, q) => {
                let K = new Set(["--contains", "--no-contains", "--merged", "--no-merged", "--points-at", "--sort", "--format", "-n"]),
                    Y = 0,
                    z = !1,
                    _ = !1;
                while (Y < q.length) {
                    let w = q[Y];
                    if (!w) {
                        Y++;
                        continue
                    }
                    if (w === "--" && !_) {
                        _ = !0, Y++;
                        continue
                    }
                    if (!_ && w.startsWith("-")) {
                        if (w === "--list" || w === "-l") z = !0;
                        else if (w[0] === "-" && w[1] !== "-" && w.length > 2 && !w.includes("=") && w.slice(1).includes("l")) z = !0;
                        if (w.includes("=")) Y++;
                        else if (K.has(w)) Y += 2;
                        else Y++
                    } else {
                        if (!z) return !0;
                        Y++
                    }
                }
                return !1
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
            additionalCommandIsDangerousCallback: (A, q) => {
                let K = new Set(["--contains", "--no-contains", "--points-at", "--sort"]),
                    Y = new Set(["--merged", "--no-merged"]),
                    z = 0,
                    _ = "",
                    w = !1,
                    O = !1;
                while (z < q.length) {
                    let $ = q[z];
                    if (!$) {
                        z++;
                        continue
                    }
                    if ($ === "--" && !O) {
                        O = !0, _ = "", z++;
                        continue
                    }
                    if (!O && $.startsWith("-")) {
                        if ($ === "--list" || $ === "-l") w = !0;
                        else if ($[0] === "-" && $[1] !== "-" && $.length > 2 && !$.includes("=") && $.slice(1).includes("l")) w = !0;
                        if ($.includes("=")) _ = $.split("=")[0] || "", z++;
                        else if (K.has($)) _ = $, z += 2;
                        else _ = $, z++
                    } else {
                        let H = Y.has(_);
                        if (!w && !H) return !0;
                        z++
                    }
                }
                return !1
            }
        }
    };
    Pz4 = {
        "gh pr view": {
            safeFlags: {
                "--json": "string",
                "--comments": "none",
                "--repo": "string",
                "-R": "string"
            },
            additionalCommandIsDangerousCallback: $0
        },
        "gh pr list": {
            safeFlags: {
                "--state": "string",
                "-s": "string",
                "--author": "string",
                "--assignee": "string",
                "--label": "string",
                "--limit": "number",
                "-L": "number",
                "--base": "string",
                "--head": "string",
                "--search": "string",
                "--json": "string",
                "--draft": "none",
                "--app": "string",
                "--repo": "string",
                "-R": "string"
            },
            additionalCommandIsDangerousCallback: $0
        },
        "gh pr diff": {
            safeFlags: {
                "--color": "string",
                "--name-only": "none",
                "--patch": "none",
                "--repo": "string",
                "-R": "string"
            },
            additionalCommandIsDangerousCallback: $0
        },
        "gh pr checks": {
            safeFlags: {
                "--watch": "none",
                "--required": "none",
                "--fail-fast": "none",
                "--json": "string",
                "--interval": "number",
                "--repo": "string",
                "-R": "string"
            },
            additionalCommandIsDangerousCallback: $0
        },
        "gh issue view": {
            safeFlags: {
                "--json": "string",
                "--comments": "none",
                "--repo": "string",
                "-R": "string"
            },
            additionalCommandIsDangerousCallback: $0
        },
        "gh issue list": {
            safeFlags: {
                "--state": "string",
                "-s": "string",
                "--assignee": "string",
                "--author": "string",
                "--label": "string",
                "--limit": "number",
                "-L": "number",
                "--milestone": "string",
                "--search": "string",
                "--json": "string",
                "--app": "string",
                "--repo": "string",
                "-R": "string"
            },
            additionalCommandIsDangerousCallback: $0
        },
        "gh repo view": {
            safeFlags: {
                "--json": "string"
            },
            additionalCommandIsDangerousCallback: $0
        },
        "gh run list": {
            safeFlags: {
                "--branch": "string",
                "-b": "string",
                "--status": "string",
                "-s": "string",
                "--workflow": "string",
                "-w": "string",
                "--limit": "number",
                "-L": "number",
                "--json": "string",
                "--repo": "string",
                "-R": "string",
                "--event": "string",
                "-e": "string",
                "--user": "string",
                "-u": "string",
                "--created": "string",
                "--commit": "string",
                "-c": "string"
            },
            additionalCommandIsDangerousCallback: $0
        },
        "gh run view": {
            safeFlags: {
                "--log": "none",
                "--log-failed": "none",
                "--exit-status": "none",
                "--verbose": "none",
                "-v": "none",
                "--json": "string",
                "--repo": "string",
                "-R": "string",
                "--job": "string",
                "-j": "string",
                "--attempt": "number",
                "-a": "number"
            },
            additionalCommandIsDangerousCallback: $0
        },
        "gh auth status": {
            safeFlags: {
                "--active": "none",
                "-a": "none",
                "--hostname": "string",
                "-h": "string",
                "--json": "string"
            },
            additionalCommandIsDangerousCallback: $0
        },
        "gh pr status": {
            safeFlags: {
                "--conflict-status": "none",
                "-c": "none",
                "--json": "string",
                "--repo": "string",
                "-R": "string"
            },
            additionalCommandIsDangerousCallback: $0
        },
        "gh issue status": {
            safeFlags: {
                "--json": "string",
                "--repo": "string",
                "-R": "string"
            },
            additionalCommandIsDangerousCallback: $0
        },
        "gh release list": {
            safeFlags: {
                "--exclude-drafts": "none",
                "--exclude-pre-releases": "none",
                "--json": "string",
                "--limit": "number",
                "-L": "number",
                "--order": "string",
                "-O": "string",
                "--repo": "string",
                "-R": "string"
            },
            additionalCommandIsDangerousCallback: $0
        },
        "gh release view": {
            safeFlags: {
                "--json": "string",
                "--repo": "string",
                "-R": "string"
            },
            additionalCommandIsDangerousCallback: $0
        },
        "gh workflow list": {
            safeFlags: {
                "--all": "none",
                "-a": "none",
                "--json": "string",
                "--limit": "number",
                "-L": "number",
                "--repo": "string",
                "-R": "string"
            },
            additionalCommandIsDangerousCallback: $0
        },
        "gh workflow view": {
            safeFlags: {
                "--ref": "string",
                "-r": "string",
                "--yaml": "none",
                "-y": "none",
                "--repo": "string",
                "-R": "string"
            },
            additionalCommandIsDangerousCallback: $0
        },
        "gh label list": {
            safeFlags: {
                "--json": "string",
                "--limit": "number",
                "-L": "number",
                "--order": "string",
                "--search": "string",
                "-S": "string",
                "--sort": "string",
                "--repo": "string",
                "-R": "string"
            },
            additionalCommandIsDangerousCallback: $0
        },
        "gh search repos": {
            safeFlags: {
                "--archived": "none",
                "--created": "string",
                "--followers": "string",
                "--forks": "string",
                "--good-first-issues": "string",
                "--help-wanted-issues": "string",
                "--include-forks": "string",
                "--json": "string",
                "--language": "string",
                "--license": "string",
                "--limit": "number",
                "-L": "number",
                "--match": "string",
                "--number-topics": "string",
                "--order": "string",
                "--owner": "string",
                "--size": "string",
                "--sort": "string",
                "--stars": "string",
                "--topic": "string",
                "--updated": "string",
                "--visibility": "string"
            }
        },
        "gh search issues": {
            safeFlags: {
                "--app": "string",
                "--assignee": "string",
                "--author": "string",
                "--closed": "string",
                "--commenter": "string",
                "--comments": "string",
                "--created": "string",
                "--include-prs": "none",
                "--interactions": "string",
                "--involves": "string",
                "--json": "string",
                "--label": "string",
                "--language": "string",
                "--limit": "number",
                "-L": "number",
                "--locked": "none",
                "--match": "string",
                "--mentions": "string",
                "--milestone": "string",
                "--no-assignee": "none",
                "--no-label": "none",
                "--no-milestone": "none",
                "--no-project": "none",
                "--order": "string",
                "--owner": "string",
                "--project": "string",
                "--reactions": "string",
                "--repo": "string",
                "-R": "string",
                "--sort": "string",
                "--state": "string",
                "--team-mentions": "string",
                "--updated": "string",
                "--visibility": "string"
            }
        },
        "gh search prs": {
            safeFlags: {
                "--app": "string",
                "--assignee": "string",
                "--author": "string",
                "--base": "string",
                "-B": "string",
                "--checks": "string",
                "--closed": "string",
                "--commenter": "string",
                "--comments": "string",
                "--created": "string",
                "--draft": "none",
                "--head": "string",
                "-H": "string",
                "--interactions": "string",
                "--involves": "string",
                "--json": "string",
                "--label": "string",
                "--language": "string",
                "--limit": "number",
                "-L": "number",
                "--locked": "none",
                "--match": "string",
                "--mentions": "string",
                "--merged": "none",
                "--merged-at": "string",
                "--milestone": "string",
                "--no-assignee": "none",
                "--no-label": "none",
                "--no-milestone": "none",
                "--no-project": "none",
                "--order": "string",
                "--owner": "string",
                "--project": "string",
                "--reactions": "string",
                "--repo": "string",
                "-R": "string",
                "--review": "string",
                "--review-requested": "string",
                "--reviewed-by": "string",
                "--sort": "string",
                "--state": "string",
                "--team-mentions": "string",
                "--updated": "string",
                "--visibility": "string"
            }
        },
        "gh search commits": {
            safeFlags: {
                "--author": "string",
                "--author-date": "string",
                "--author-email": "string",
                "--author-name": "string",
                "--committer": "string",
                "--committer-date": "string",
                "--committer-email": "string",
                "--committer-name": "string",
                "--hash": "string",
                "--json": "string",
                "--limit": "number",
                "-L": "number",
                "--merge": "none",
                "--order": "string",
                "--owner": "string",
                "--parent": "string",
                "--repo": "string",
                "-R": "string",
                "--sort": "string",
                "--tree": "string",
                "--visibility": "string"
            }
        },
        "gh search code": {
            safeFlags: {
                "--extension": "string",
                "--filename": "string",
                "--json": "string",
                "--language": "string",
                "--limit": "number",
                "-L": "number",
                "--match": "string",
                "--owner": "string",
                "--repo": "string",
                "-R": "string",
                "--size": "string"
            }
        }
    }, Wz4 = {
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
    }, Zz4 = {
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
        }
    }, Gz4 = {
        pyright: {
            respectsDoubleDash: !1,
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
            additionalCommandIsDangerousCallback: (A, q) => {
                return q.some((K) => K === "--watch" || K === "-w")
            }
        }
    }, fz4 = ["docker ps", "docker images"];
    Mz4 = /^-[a-zA-Z0-9_-]/
})
// @from(Ln 240987, Col 0)
function mg9() {
    let A = ug9;
    if (y8() === "windows") {
        let {
            xargs: q,
            ...K
        } = A;
        A = K
    }
    return A
}
// @from(Ln 240999, Col 0)
function gg9(A) {
    let q = Fz(A, ($) => `$${$}`);
    if (!q.success) return !1;
    let K = q.tokens.map(($) => {
        if (typeof $ !== "string") {
            if ($ = $, $.op === "glob") return $.pattern
        }
        return $
    });
    if (K.some(($) => typeof $ !== "string")) return !1;
    let z = K;
    if (z.length === 0) return !1;
    let _, w = 0,
        O = mg9();
    for (let [$] of Object.entries(O)) {
        let H = $.split(" ");
        if (z.length >= H.length) {
            let j = !0;
            for (let J = 0; J < H.length; J++)
                if (z[J] !== H[J]) {
                    j = !1;
                    break
                } if (j) {
                _ = O[$], w = H.length;
                break
            }
        }
    }
    if (!_) return !1;
    if (z[0] === "git" && z[1] === "ls-remote")
        for (let $ = 2; $ < z.length; $++) {
            let H = z[$];
            if (H && !H.startsWith("-")) {
                if (H.includes("://")) return !1;
                if (H.includes("@") || H.includes(":")) return !1;
                if (H.includes("$")) return !1
            }
        }
    for (let $ = w; $ < z.length; $++) {
        let H = z[$];
        if (!H) continue;
        if (H.includes("$")) return !1;
        if (H.includes("{") && (H.includes(",") || H.includes(".."))) return !1
    }
    if (!Tz4(z, w, _, {
            commandName: z[0],
            rawCommand: A,
            xargsTargetCommands: z[0] === "xargs" ? Bg9 : void 0
        })) return !1;
    if (_.regex && !_.regex.test(A)) return !1;
    if (!_.regex && /`/.test(A)) return !1;
    if (!_.regex && (z[0] === "rg" || z[0] === "grep") && /[\n\r]/.test(A)) return !1;
    if (_.additionalCommandIsDangerousCallback && _.additionalCommandIsDangerousCallback(A, z.slice(w))) return !1;
    return !0
}
// @from(Ln 241055, Col 0)
function Fg9(A) {
    return new RegExp(`^${A}(?:\\s|$)[^<>()$\`|{}&;\\n\\r]*$`)
}
// @from(Ln 241059, Col 0)
function Ug9(A) {
    let q = !1,
        K = !1,
        Y = !1;
    for (let z = 0; z < A.length; z++) {
        let _ = A[z];
        if (Y) {
            Y = !1;
            continue
        }
        if (_ === "\\" && !q) {
            Y = !0;
            continue
        }
        if (_ === "'" && !K) {
            q = !q;
            continue
        }
        if (_ === '"' && !q) {
            K = !K;
            continue
        }
        if (q) continue;
        if (_ === "$") {
            let w = A[z + 1];
            if (w && /[A-Za-z_@*#?!$0-9-]/.test(w)) return !0
        }
        if (K) continue;
        if (_ && /[?*[\]]/.test(_)) return !0
    }
    return !1
}
// @from(Ln 241092, Col 0)
function dg9(A) {
    let q = A.trim();
    if (q.endsWith(" 2>&1")) q = q.slice(0, -5).trim();
    if (r36(q)) return !1;
    if (Ug9(q)) return !1;
    if (gg9(q)) return !0;
    for (let K of Qg9)
        if (K.test(q)) {
            if (q.includes("git") && /\s-c[\s=]/.test(q)) return !1;
            if (q.includes("git") && /\s--exec-path[\s=]/.test(q)) return !1;
            if (q.includes("git") && /\s--config-env[\s=]/.test(q)) return !1;
            return !0
        } return !1
}
// @from(Ln 241107, Col 0)
function cg9(A) {
    return EO(A).some((q) => G01(q.trim()))
}
// @from(Ln 241111, Col 0)
function lg9() {
    let A = $1(),
        q = G1(),
        K = bp6(q, ".git");
    try {
        if (A.existsSync(K)) {
            let w = A.statSync(K);
            if (w.isFile()) return !1;
            if (w.isDirectory()) {
                let O = bp6(K, "HEAD");
                if (A.existsSync(O)) return !1
            }
        }
    } catch {}
    let Y = bp6(q, "HEAD"),
        z = bp6(q, "objects"),
        _ = bp6(q, "refs");
    try {
        let w = A.existsSync(Y),
            O = A.existsSync(z) && A.statSync(z).isDirectory(),
            $ = A.existsSync(_) && A.statSync(_).isDirectory();
        return w || O || $
    } catch {
        return !1
    }
}
// @from(Ln 241138, Col 0)
function Nz4(A) {
    let q = A.replace(/^\.?\//, "");
    return ig9.some((K) => K.test(q))
}
// @from(Ln 241143, Col 0)
function rg9(A) {
    let q = Fz(A, (w) => `$${w}`);
    if (!q.success) return [];
    let K = q.tokens.filter((w) => typeof w === "string");
    if (K.length === 0) return [];
    let Y = K[0];
    if (!Y) return [];
    if (!(Y in Sp6)) return [];
    let z = Sp6[Y];
    if (z !== "write" && z !== "create" || ng9.has(Y)) return [];
    let _ = hp6[Y];
    if (!_) return [];
    return _(K.slice(1))
}
// @from(Ln 241158, Col 0)
function og9(A) {
    let q = EO(A);
    for (let K of q) {
        let Y = K.trim(),
            z = rg9(Y);
        for (let w of z)
            if (Nz4(w)) return !0;
        let {
            redirections: _
        } = ik(Y);
        for (let {
                target: w
            }
            of _)
            if (Nz4(w)) return !0
    }
    return !1
}
// @from(Ln 241177, Col 0)
function Z01(A, q) {
    let {
        command: K
    } = A;
    if (!Fz(K, (w) => `$${w}`).success) return {
        behavior: "passthrough",
        message: "Command cannot be parsed, requires further permission checks"
    };
    if (Rp6(K).behavior !== "passthrough") return {
        behavior: "passthrough",
        message: "Command is not read-only, requires further permission checks"
    };
    if (r36(K)) return {
        behavior: "ask",
        message: "Command contains Windows UNC path that could be vulnerable to WebDAV attacks"
    };
    let z = cg9(K);
    if (q && z) return {
        behavior: "passthrough",
        message: "Compound commands with cd and git require permission checks for enhanced security"
    };
    if (z && lg9()) return {
        behavior: "passthrough",
        message: "Git commands in directories with bare repository structure require permission checks for enhanced security"
    };
    if (z && og9(K)) return {
        behavior: "passthrough",
        message: "Compound commands that create git internal files and run git require permission checks for enhanced security"
    };
    if (z && vA.isSandboxingEnabled() && G1() !== AA()) return {
        behavior: "passthrough",
        message: "Git commands outside the original working directory require permission checks when sandbox is enabled"
    };
    if (EO(K).every((w) => {
            if (Rp6(w).behavior !== "passthrough") return !1;
            return dg9(w)
        })) return {
        behavior: "allow",
        updatedInput: A
    };
    return {
        behavior: "passthrough",
        message: "Command is not read-only, requires further permission checks"
    }
}
// @from(Ln 241222, Col 4)
vz4
// @from(Ln 241222, Col 9)
ug9
// @from(Ln 241222, Col 14)
go2
// @from(Ln 241222, Col 19)
Bg9
// @from(Ln 241222, Col 24)
pg9
// @from(Ln 241222, Col 29)
Qg9
// @from(Ln 241222, Col 34)
ig9
// @from(Ln 241222, Col 39)
ng9
// @from(Ln 241223, Col 4)
sV8 = E(() => {
    jZ();
    RJ();
    $01();
    JZ();
    H01();
    YK();
    lA();
    T1();
    Lz();
    SA();
    iV8();
    W01();
    vz4 = {
        "-h": "none",
        "--help": "none",
        "-V": "none",
        "--version": "none",
        "-H": "none",
        "--hidden": "none",
        "-I": "none",
        "--no-ignore": "none",
        "--no-ignore-vcs": "none",
        "--no-ignore-parent": "none",
        "-s": "none",
        "--case-sensitive": "none",
        "-i": "none",
        "--ignore-case": "none",
        "-g": "none",
        "--glob": "none",
        "--regex": "none",
        "-F": "none",
        "--fixed-strings": "none",
        "-a": "none",
        "--absolute-path": "none",
        "-L": "none",
        "--follow": "none",
        "-p": "none",
        "--full-path": "none",
        "-0": "none",
        "--print0": "none",
        "-d": "number",
        "--max-depth": "number",
        "--min-depth": "number",
        "--exact-depth": "number",
        "-t": "string",
        "--type": "string",
        "-e": "string",
        "--extension": "string",
        "-S": "string",
        "--size": "string",
        "--changed-within": "string",
        "--changed-before": "string",
        "-o": "string",
        "--owner": "string",
        "-E": "string",
        "--exclude": "string",
        "--ignore-file": "string",
        "-c": "string",
        "--color": "string",
        "-j": "number",
        "--threads": "number",
        "--max-buffer-time": "string",
        "--max-results": "number",
        "-1": "none",
        "-q": "none",
        "--quiet": "none",
        "--show-errors": "none",
        "--strip-cwd-prefix": "none",
        "--one-file-system": "none",
        "--prune": "none",
        "--search-path": "string",
        "--base-directory": "string",
        "--path-separator": "string",
        "--batch-size": "number",
        "--no-require-git": "none",
        "--hyperlink": "string",
        "--and": "string",
        "--format": "string"
    }, ug9 = {
        xargs: {
            safeFlags: {
                "-I": "{}",
                "-n": "number",
                "-P": "number",
                "-L": "number",
                "-s": "number",
                "-E": "EOF",
                "-0": "none",
                "-t": "none",
                "-r": "none",
                "-x": "none",
                "-d": "char"
            }
        },
        ...Xz4,
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
            additionalCommandIsDangerousCallback: (A, q) => !xW6(A)
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
            additionalCommandIsDangerousCallback: (A, q) => {
                return q.some((K) => !K.startsWith("-") && /^[a-zA-Z]*e[a-zA-Z]*$/.test(K))
            }
        },
        base64: {
            respectsDoubleDash: !1,
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
        ...Zz4,
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
            additionalCommandIsDangerousCallback: (A, q) => {
                let K = new Set(["-d", "--date", "-r", "--reference", "--iso-8601", "--rfc-3339"]),
                    Y = 0;
                while (Y < q.length) {
                    let z = q[Y];
                    if (z.startsWith("--") && z.includes("=")) Y++;
                    else if (z.startsWith("-"))
                        if (K.has(z)) Y += 2;
                        else Y++;
                    else {
                        if (!z.startsWith("+")) return !0;
                        Y++
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
        lsof: {
            safeFlags: {
                "-?": "none",
                "-h": "none",
                "-v": "none",
                "-a": "none",
                "-b": "none",
                "-C": "none",
                "-l": "none",
                "-n": "none",
                "-N": "none",
                "-O": "none",
                "-P": "none",
                "-Q": "none",
                "-R": "none",
                "-t": "none",
                "-U": "none",
                "-V": "none",
                "-X": "none",
                "-H": "none",
                "-E": "none",
                "-F": "none",
                "-g": "none",
                "-i": "none",
                "-K": "none",
                "-L": "none",
                "-o": "none",
                "-r": "none",
                "-s": "none",
                "-S": "none",
                "-T": "none",
                "-x": "none",
                "-A": "string",
                "-c": "string",
                "-d": "string",
                "-e": "string",
                "-k": "string",
                "-p": "string",
                "-u": "string"
            },
            additionalCommandIsDangerousCallback: (A, q) => q.some((K) => K === "+m" || K.startsWith("+m"))
        },
        pgrep: {
            safeFlags: {
                "-d": "string",
                "--delimiter": "string",
                "-l": "none",
                "--list-name": "none",
                "-a": "none",
                "--list-full": "none",
                "-v": "none",
                "--inverse": "none",
                "-w": "none",
                "--lightweight": "none",
                "-c": "none",
                "--count": "none",
                "-f": "none",
                "--full": "none",
                "-g": "string",
                "--pgroup": "string",
                "-G": "string",
                "--group": "string",
                "-i": "none",
                "--ignore-case": "none",
                "-n": "none",
                "--newest": "none",
                "-o": "none",
                "--oldest": "none",
                "-O": "string",
                "--older": "string",
                "-P": "string",
                "--parent": "string",
                "-s": "string",
                "--session": "string",
                "-t": "string",
                "--terminal": "string",
                "-u": "string",
                "--euid": "string",
                "-U": "string",
                "--uid": "string",
                "-x": "none",
                "--exact": "none",
                "-F": "string",
                "--pidfile": "string",
                "-L": "none",
                "--logpidfile": "none",
                "-r": "string",
                "--runstates": "string",
                "--ns": "string",
                "--nslist": "string",
                "--help": "none",
                "-V": "none",
                "--version": "none"
            }
        },
        tput: {
            safeFlags: {
                "-T": "string",
                "-V": "none",
                "-x": "none"
            },
            additionalCommandIsDangerousCallback: (A, q) => {
                let K = new Set(["init", "reset", "rs1", "rs2", "rs3", "is1", "is2", "is3", "iprog", "if", "rf", "clear", "flash", "mc0", "mc4", "mc5", "mc5i", "mc5p", "pfkey", "pfloc", "pfx", "pfxl", "smcup", "rmcup"]),
                    Y = new Set(["-T"]),
                    z = 0,
                    _ = !1;
                while (z < q.length) {
                    let w = q[z];
                    if (w === "--") _ = !0, z++;
                    else if (!_ && w.startsWith("-")) {
                        if (w === "-S") return !0;
                        if (!w.startsWith("--") && w.length > 2 && w.includes("S")) return !0;
                        if (Y.has(w)) z += 2;
                        else z++
                    } else {
                        if (K.has(w)) return !0;
                        z++
                    }
                }
                return !1
            }
        },
        ss: {
            safeFlags: {
                "-h": "none",
                "--help": "none",
                "-V": "none",
                "--version": "none",
                "-n": "none",
                "--numeric": "none",
                "-r": "none",
                "--resolve": "none",
                "-a": "none",
                "--all": "none",
                "-l": "none",
                "--listening": "none",
                "-o": "none",
                "--options": "none",
                "-e": "none",
                "--extended": "none",
                "-m": "none",
                "--memory": "none",
                "-p": "none",
                "--processes": "none",
                "-i": "none",
                "--info": "none",
                "-s": "none",
                "--summary": "none",
                "-4": "none",
                "--ipv4": "none",
                "-6": "none",
                "--ipv6": "none",
                "-0": "none",
                "--packet": "none",
                "-t": "none",
                "--tcp": "none",
                "-M": "none",
                "--mptcp": "none",
                "-S": "none",
                "--sctp": "none",
                "-u": "none",
                "--udp": "none",
                "-d": "none",
                "--dccp": "none",
                "-w": "none",
                "--raw": "none",
                "-x": "none",
                "--unix": "none",
                "--tipc": "none",
                "--vsock": "none",
                "-f": "string",
                "--family": "string",
                "-A": "string",
                "--query": "string",
                "--socket": "string",
                "-Z": "none",
                "--context": "none",
                "-z": "none",
                "--contexts": "none",
                "-b": "none",
                "--bpf": "none",
                "-E": "none",
                "--events": "none",
                "-H": "none",
                "--no-header": "none",
                "-O": "none",
                "--oneline": "none",
                "--tipcinfo": "none",
                "--tos": "none",
                "--cgroup": "none",
                "--inet-sockopt": "none"
            }
        },
        fd: {
            safeFlags: {
                ...vz4
            }
        },
        fdfind: {
            safeFlags: {
                ...vz4
            }
        },
        ...Gz4,
        ...Wz4
    }, go2 = {
        ...Pz4,
        aki: {
            safeFlags: {
                "-h": "none",
                "--help": "none",
                "-k": "none",
                "--keyword": "none",
                "-s": "none",
                "--semantic": "none",
                "--no-adaptive": "none",
                "-n": "number",
                "--limit": "number",
                "-o": "number",
                "--offset": "number",
                "--source": "string",
                "--exclude-source": "string",
                "-a": "string",
                "--after": "string",
                "-b": "string",
                "--before": "string",
                "--collection": "string",
                "--drive": "string",
                "--folder": "string",
                "--descendants": "none",
                "-m": "string",
                "--meta": "string",
                "-t": "string",
                "--threshold": "string",
                "--kw-weight": "string",
                "--sem-weight": "string",
                "-j": "none",
                "--json": "none",
                "-c": "none",
                "--chunk": "none",
                "--preview": "none",
                "-d": "none",
                "--full-doc": "none",
                "-v": "none",
                "--verbose": "none",
                "--stats": "none",
                "-S": "number",
                "--summarize": "number",
                "--explain": "none",
                "--examine": "string",
                "--url": "string",
                "--multi-turn": "number",
                "--multi-turn-model": "string",
                "--multi-turn-context": "string",
                "--no-rerank": "none",
                "--audit": "none",
                "--local": "none",
                "--staging": "none"
            }
        }
    };
    Bg9 = ["echo", "printf", "wc", "grep", "head", "tail"];
    pg9 = [...fz4, "cal", "uptime", "cat", "head", "tail", "wc", "stat", "strings", "hexdump", "od", "nl", "id", "uname", "free", "df", "du", "locale", "groups", "nproc", "basename", "dirname", "realpath", "cut", "paste", "tr", "column", "tac", "rev", "fold", "expand", "unexpand", "fmt", "comm", "cmp", "numfmt", "readlink", "diff", "true", "false", "sleep", "which", "type", "expr", "test", "getconf", "seq", "tsort", "pr"], Qg9 = new Set([...pg9.map(Fg9), /^echo(?:\s+(?:'[^']*'|"[^"$<>\n\r]*"|[^|;&`$(){}><#\\!"'\s]+))*(?:\s+2>&1)?\s*$/, /^claude -h$/, /^claude --help$/, /^uniq(?:\s+(?:-[a-zA-Z]+|--[a-zA-Z-]+(?:=\S+)?|-[fsw]\s+\d+))*(?:\s|$)\s*$/, /^pwd$/, /^whoami$/, /^node -v$/, /^node --version$/, /^python --version$/, /^python3 --version$/, /^history(?:\s+\d+)?\s*$/, /^alias$/, /^arch(?:\s+(?:--help|-h))?\s*$/, /^ip addr$/, /^ifconfig(?:\s+[a-zA-Z][a-zA-Z0-9_-]*)?\s*$/, /^jq(?!\s+.*(?:-f\b|--from-file|--rawfile|--slurpfile|--run-tests|-L\b|--library-path|\benv\b|\$ENV\b))(?:\s+(?:-[a-zA-Z]+|--[a-zA-Z-]+(?:=\S+)?))*(?:\s+'[^'`]*'|\s+"[^"`]*"|\s+[^-\s'"][^\s]*)+\s*$/, /^cd(?:\s+(?:'[^']*'|"[^"]*"|[^\s;|&`$(){}><#\\]+))?$/, /^ls(?:\s+[^<>()$`|{}&;\n\r]*)?$/, /^find(?:\s+(?:\\[()]|(?!-delete\b|-exec\b|-execdir\b|-ok\b|-okdir\b|-fprint0?\b|-fls\b|-fprintf\b)[^<>()$`|{}&;\n\r\s]|\s)+)?$/]);
    ig9 = [/^HEAD$/, /^objects(?:\/|$)/, /^refs(?:\/|$)/, /^hooks(?:\/|$)/];
    ng9 = new Set(["rm", "rmdir", "sed"])
})
// @from(Ln 242111, Col 0)
async function Vz4(A) {
    let q;
    do q = await A.next(); while (!q.done);
    return q.value
}
// @from(Ln 242116, Col 0)
async function* f01(A, q = 1 / 0) {
    let K = (_) => {
            let w = _.next().then(({
                done: O,
                value: $
            }) => ({
                done: O,
                value: $,
                generator: _,
                promise: w
            }));
            return w
        },
        Y = [...A],
        z = new Set;
    while (z.size < q && Y.length > 0) {
        let _ = Y.shift();
        z.add(K(_))
    }
    while (z.size > 0) {
        let {
            done: _,
            value: w,
            generator: O,
            promise: $
        } = await Promise.race(z);
        if (z.delete($), !_) {
            if (z.add(K(O)), w !== void 0) yield w
        } else if (Y.length > 0) {
            let H = Y.shift();
            z.add(K(H))
        }
    }
}
// @from(Ln 242150, Col 0)
async function T01(A) {
    let q = [];
    for await (let K of A) q.push(K);
    return q
}
// @from(Ln 242155, Col 0)
async function* tV8(A) {
    for (let q of A) yield q
}
// @from(Ln 242158, Col 4)
po2
// @from(Ln 242159, Col 4)
o36 = E(() => {
    po2 = Symbol("NO_VALUE")
})
// @from(Ln 242163, Col 0)
function ag9(A) {
    let q = BigInt(58),
        K = Array(22).fill("1"),
        Y = 21,
        z = A;
    while (z > 0n) {
        let _ = Number(z % q);
        K[Y] = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz" [_], z = z / q, Y--
    }
    return K.join("")
}
// @from(Ln 242175, Col 0)
function sg9(A) {
    let q = A.replace(/-/g, "");
    if (q.length !== 32) throw Error(`Invalid UUID hex length: ${q.length}`);
    return BigInt("0x" + q)
}
// @from(Ln 242181, Col 0)
function kz4(A, q) {
    let K = sg9(q);
    return `${A}_01${ag9(K)}`
}
// @from(Ln 242186, Col 0)
function eV8(A) {
    let q = tg9[A],
        K = process.env[A];
    if (K === void 0) return q;
    return t6(K)
}
// @from(Ln 242193, Col 0)
function mW6() {
    let A = Jy(),
        q = R1(),
        K = {
            "user.id": A
        };
    if (eV8("OTEL_METRICS_INCLUDE_SESSION_ID")) K["session.id"] = q;
    if (eV8("OTEL_METRICS_INCLUDE_VERSION")) K["app.version"] = {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.76",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-03-14T00:12:49Z"
    }.VERSION;
    let Y = L3();
    if (Y) {
        let {
            organizationUuid: z,
            emailAddress: _,
            accountUuid: w
        } = Y;
        if (z) K["organization.id"] = z;
        if (_) K["user.email"] = _;
        if (w && eV8("OTEL_METRICS_INCLUDE_ACCOUNT_UUID")) K["user.account_uuid"] = w, K["user.account_id"] = process.env.CLAUDE_CODE_ACCOUNT_TAGGED_ID || kz4("user", w)
    }
    if (LT.terminal) K["terminal.type"] = LT.terminal;
    return K
}
// @from(Ln 242222, Col 4)
tg9
// @from(Ln 242223, Col 4)
v01 = E(() => {
    T1();
    k8();
    Zr();
    A8();
    fA();
    tg9 = {
        OTEL_METRICS_INCLUDE_SESSION_ID: !0,
        OTEL_METRICS_INCLUDE_VERSION: !1,
        OTEL_METRICS_INCLUDE_ACCOUNT_UUID: !0
    }
})
// @from(Ln 242236, Col 0)
function AF9() {
    return t6(process.env.OTEL_LOG_USER_PROMPTS)
}
// @from(Ln 242240, Col 0)
function N01(A) {
    return AF9() ? A : "<REDACTED>"
}
// @from(Ln 242243, Col 0)
async function pw(A, q = {}) {
    let K = fu1();
    if (!K) {
        if (!Ez4) Ez4 = !0, k(`[3P telemetry] Event dropped (no event logger initialized): ${A}`, {
            level: "warn"
        });
        return
    }
    let Y = {
            ...mW6(),
            "event.name": A,
            "event.timestamp": new Date().toISOString(),
            "event.sequence": eg9++
        },
        z = sk6();
    if (z) Y["prompt.id"] = z;
    let _ = process.env.CLAUDE_CODE_WORKSPACE_HOST_PATHS;
    if (_) Y["workspace.host_paths"] = _.split("|");
    for (let [w, O] of Object.entries(q))
        if (O !== void 0) Y[w] = O;
    K.emit({
        body: `claude_code.${A}`,
        attributes: Y
    })
}
// @from(Ln 242268, Col 4)
eg9 = 0
// @from(Ln 242269, Col 4)
Ez4 = !1
// @from(Ln 242270, Col 4)
FB = E(() => {
    T1();
    v01();
    A8();
    H1()
})
// @from(Ln 242277, Col 0)
function qk8(A) {
    return qF9.includes(A)
}
// @from(Ln 242281, Col 0)
function Kk8(A, q, K, Y) {
    let z;
    if (A.getPath && q) {
        let _ = A.inputSchema.safeParse(q);
        if (_.success) {
            let w = A.getPath(_.data);
            if (w) z = st(w)
        }
    }
    return {
        decision: K,
        source: Y,
        tool_name: A.name,
        ...z && {
            language: z
        }
    }
}
// @from(Ln 242300, Col 0)
function KF9(A) {
    if (A.type === "classifier") return "classifier";
    switch (A.type) {
        case "hook":
            return "hook";
        case "user":
            return A.permanent ? "user_permanent" : "user_temporary";
        case "user_abort":
            return "user_abort";
        case "user_reject":
            return "user_reject";
        default:
            return "unknown"
    }
}
// @from(Ln 242316, Col 0)
function BW6(A, q, K) {
    return {
        messageID: A,
        toolName: hq(q),
        sandboxEnabled: vA.isSandboxingEnabled(),
        ...K !== void 0 && {
            waiting_for_user_permission_ms: K
        }
    }
}
// @from(Ln 242327, Col 0)
function YF9(A, q, K, Y) {
    if (K === "config") {
        d("tengu_tool_use_granted_in_config", BW6(q, A.name, void 0));
        return
    }
    if (K.type === "classifier") {
        d("tengu_tool_use_granted_by_classifier", BW6(q, A.name, Y));
        return
    }
    switch (K.type) {
        case "user":
            d(K.permanent ? "tengu_tool_use_granted_in_prompt_permanent" : "tengu_tool_use_granted_in_prompt_temporary", BW6(q, A.name, Y));
            break;
        case "hook":
            d("tengu_tool_use_granted_by_permission_hook", {
                ...BW6(q, A.name, Y),
                permanent: K.permanent ?? !1
            });
            break;
        default:
            break
    }
}
// @from(Ln 242351, Col 0)
function zF9(A, q, K, Y) {
    if (K === "config") {
        d("tengu_tool_use_denied_in_config", BW6(q, A.name, void 0));
        return
    }
    d("tengu_tool_use_rejected_in_prompt", {
        ...BW6(q, A.name, Y),
        ...K.type === "hook" ? {
            isHook: !0
        } : {
            hasFeedback: K.type === "user_reject" ? K.hasFeedback : !1
        }
    })
}
// @from(Ln 242366, Col 0)
function V01(A, q, K) {
    let {
        tool: Y,
        input: z,
        toolUseContext: _,
        messageId: w,
        toolUseID: O
    } = A, {
        decision: $,
        source: H
    } = q, j = K !== void 0 ? Date.now() - K : void 0;
    if (q.decision === "accept") YF9(Y, w, q.source, j);
    else zF9(Y, w, q.source, j);
    let J = H === "config" ? "config" : KF9(H);
    if (qk8(Y.name)) {
        let M = Kk8(Y, z, $, J);
        Bk6()?.add(1, M)
    }
    if (!_.toolDecisions) _.toolDecisions = new Map;
    _.toolDecisions.set(O, {
        source: J,
        decision: $,
        timestamp: Date.now()
    }), pw("tool_decision", {
        decision: $,
        source: J,
        tool_name: hq(Y.name)
    })
}
// @from(Ln 242395, Col 4)
qF9
// @from(Ln 242396, Col 4)
k01 = E(() => {
    V1();
    o$();
    T1();
    FB();
    Z7();
    Lz();
    qF9 = ["Edit", "Write", "NotebookEdit"]
})
// @from(Ln 242409, Col 0)
function Lz4() {
    xp6.clear(), zk8.clear()
}
// @from(Ln 242413, Col 0)
function a$() {
    if (!(t6(process.env.ENABLE_BETA_TRACING_DETAILED) && Boolean(process.env.BETA_TRACING_ENDPOINT))) return !1;
    return q7() || w8("tengu_trace_lantern", !1)
}
// @from(Ln 242418, Col 0)
function pB(A, q = wF9) {
    if (A.length <= q) return {
        content: A,
        truncated: !1
    };
    return {
        content: A.slice(0, q) + `

[TRUNCATED - Content exceeds 60KB limit]`,
        truncated: !0
    }
}
// @from(Ln 242431, Col 0)
function _k8(A) {
    return _F9("sha256").update(A).digest("hex").slice(0, 12)
}
// @from(Ln 242435, Col 0)
function OF9(A) {
    return `sp_${_k8(A)}`
}
// @from(Ln 242439, Col 0)
function yz4(A) {
    let q = B6(A.message.content);
    return `msg_${_k8(q)}`
}
// @from(Ln 242444, Col 0)
function Yk8(A) {
    let q = A.trim().match($F9);
    return q && q[1] ? q[1].trim() : null
}
// @from(Ln 242449, Col 0)
function HF9(A) {
    let q = [],
        K = [];
    for (let Y of A) {
        let z = Y.message.content;
        if (typeof z === "string") {
            let _ = Yk8(z);
            if (_) K.push(_);
            else q.push(`[USER]
${z}`)
        } else if (Array.isArray(z)) {
            for (let _ of z)
                if (_.type === "text") {
                    let w = Yk8(_.text);
                    if (w) K.push(w);
                    else q.push(`[USER]
${_.text}`)
                } else if (_.type === "tool_result") {
                let w = typeof _.content === "string" ? _.content : B6(_.content),
                    O = Yk8(w);
                if (O) K.push(O);
                else q.push(`[TOOL RESULT: ${_.tool_use_id}]
${w}`)
            }
        }
    }
    return {
        contextParts: q,
        systemReminders: K
    }
}
// @from(Ln 242481, Col 0)
function Rz4(A, q) {
    if (!a$()) return;
    let {
        content: K,
        truncated: Y
    } = pB(`[USER PROMPT]
${q}`);
    A.setAttributes({
        new_context: K,
        ...Y && {
            new_context_truncated: !0,
            new_context_original_length: q.length
        }
    })
}