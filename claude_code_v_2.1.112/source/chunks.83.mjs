
// @from(Ln 219498, Col 4)
Zy6 = L(() => {
    NK();
    ct6 = {
        "--all": "none",
        "--branches": "none",
        "--tags": "none",
        "--remotes": "none"
    }, rh8 = {
        "--since": "string",
        "--after": "string",
        "--until": "string",
        "--before": "string"
    }, oh8 = {
        "--oneline": "none",
        "--graph": "none",
        "--decorate": "none",
        "--no-decorate": "none",
        "--date": "string",
        "--relative-date": "none"
    }, ah8 = {
        "--max-count": "number",
        "-n": "number"
    }, sh8 = {
        "--stat": "none",
        "--numstat": "none",
        "--shortstat": "none",
        "--name-only": "none",
        "--name-status": "none"
    }, lt6 = {
        "--color": "none",
        "--no-color": "none"
    }, Mg1 = {
        "--patch": "none",
        "-p": "none",
        "--no-patch": "none",
        "--no-ext-diff": "none",
        "-s": "none"
    }, Pg1 = {
        "--author": "string",
        "--committer": "string",
        "--grep": "string"
    }, nt6 = {
        "git diff": {
            safeFlags: {
                ...sh8,
                ...lt6,
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
                ...oh8,
                ...ct6,
                ...rh8,
                ...ah8,
                ...sh8,
                ...lt6,
                ...Mg1,
                ...Pg1,
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
                ...oh8,
                ...sh8,
                ...lt6,
                ...Mg1,
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
                ...ct6,
                ...rh8,
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
                ...oh8,
                ...ct6,
                ...rh8,
                ...ah8,
                ...Pg1
            },
            additionalCommandIsDangerousCallback: (q, K) => {
                let _ = new Set(["expire", "delete", "exists"]);
                for (let z of K) {
                    if (!z || z.startsWith("-")) continue;
                    if (_.has(z)) return !0;
                    return !1
                }
                return !1
            }
        },
        "git stash list": {
            safeFlags: {
                ...oh8,
                ...ct6,
                ...ah8
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
                ...lt6,
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
            additionalCommandIsDangerousCallback: (q, K) => {
                let _ = K.filter((z) => z !== "-n");
                if (_.length !== 1) return !0;
                return !/^[a-zA-Z0-9_-]+$/.test(_[0])
            }
        },
        "git remote": {
            safeFlags: {
                "-v": "none",
                "--verbose": "none"
            },
            additionalCommandIsDangerousCallback: (q, K) => {
                return K.some((_) => _ !== "-v" && _ !== "--verbose")
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
                ...ct6,
                ...rh8,
                ...ah8,
                ...Pg1,
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
                ...sh8,
                ...lt6,
                ...Mg1,
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
            additionalCommandIsDangerousCallback: (q, K) => {
                let _ = new Set(["--contains", "--no-contains", "--merged", "--no-merged", "--points-at", "--sort", "--format", "-n"]),
                    z = 0,
                    Y = !1,
                    A = !1;
                while (z < K.length) {
                    let O = K[z];
                    if (!O) {
                        z++;
                        continue
                    }
                    if (O === "--" && !A) {
                        A = !0, z++;
                        continue
                    }
                    if (!A && O.startsWith("-")) {
                        if (O === "--list" || O === "-l") Y = !0;
                        else if (O[0] === "-" && O[1] !== "-" && O.length > 2 && !O.includes("=") && O.slice(1).includes("l")) Y = !0;
                        if (O.includes("=")) z++;
                        else if (_.has(O)) z += 2;
                        else z++
                    } else {
                        if (!Y) return !0;
                        z++
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
            additionalCommandIsDangerousCallback: (q, K) => {
                let _ = new Set(["--contains", "--no-contains", "--points-at", "--sort"]),
                    z = new Set(["--merged", "--no-merged"]),
                    Y = 0,
                    A = "",
                    O = !1,
                    w = !1;
                while (Y < K.length) {
                    let $ = K[Y];
                    if (!$) {
                        Y++;
                        continue
                    }
                    if ($ === "--" && !w) {
                        w = !0, A = "", Y++;
                        continue
                    }
                    if (!w && $.startsWith("-")) {
                        if ($ === "--list" || $ === "-l") O = !0;
                        else if ($[0] === "-" && $[1] !== "-" && $.length > 2 && !$.includes("=") && $.slice(1).includes("l")) O = !0;
                        if ($.includes("=")) A = i5($, "="), Y++;
                        else if (_.has($)) A = $, Y += 2;
                        else A = $, Y++
                    } else {
                        let j = z.has(A);
                        if (!O && !j) return !0;
                        Y++
                    }
                }
                return !1
            }
        }
    };
    it6 = {
        "gh pr view": {
            safeFlags: {
                "--json": "string",
                "--comments": "none",
                "--repo": "string",
                "-R": "string"
            },
            additionalCommandIsDangerousCallback: Sf
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
            additionalCommandIsDangerousCallback: Sf
        },
        "gh pr diff": {
            safeFlags: {
                "--color": "string",
                "--name-only": "none",
                "--patch": "none",
                "--repo": "string",
                "-R": "string"
            },
            additionalCommandIsDangerousCallback: Sf
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
            additionalCommandIsDangerousCallback: Sf
        },
        "gh issue view": {
            safeFlags: {
                "--json": "string",
                "--comments": "none",
                "--repo": "string",
                "-R": "string"
            },
            additionalCommandIsDangerousCallback: Sf
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
            additionalCommandIsDangerousCallback: Sf
        },
        "gh repo view": {
            safeFlags: {
                "--json": "string"
            },
            additionalCommandIsDangerousCallback: Sf
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
            additionalCommandIsDangerousCallback: Sf
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
            additionalCommandIsDangerousCallback: Sf
        },
        "gh auth status": {
            safeFlags: {
                "--active": "none",
                "-a": "none",
                "--hostname": "string",
                "-h": "string",
                "--json": "string"
            },
            additionalCommandIsDangerousCallback: Sf
        },
        "gh pr status": {
            safeFlags: {
                "--conflict-status": "none",
                "-c": "none",
                "--json": "string",
                "--repo": "string",
                "-R": "string"
            },
            additionalCommandIsDangerousCallback: Sf
        },
        "gh issue status": {
            safeFlags: {
                "--json": "string",
                "--repo": "string",
                "-R": "string"
            },
            additionalCommandIsDangerousCallback: Sf
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
            additionalCommandIsDangerousCallback: Sf
        },
        "gh release view": {
            safeFlags: {
                "--json": "string",
                "--repo": "string",
                "-R": "string"
            },
            additionalCommandIsDangerousCallback: Sf
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
            additionalCommandIsDangerousCallback: Sf
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
            additionalCommandIsDangerousCallback: Sf
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
            additionalCommandIsDangerousCallback: Sf
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
    }, th8 = {
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
    }, SP4 = {
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
    }, CP4 = {
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
            additionalCommandIsDangerousCallback: (q, K) => {
                return K.some((_) => _ === "--watch" || _ === "-w")
            }
        }
    }, eh8 = ["docker ps", "docker images"];
    hP4 = /^-[a-zA-Z0-9_-]/
})
// @from(Ln 220615, Col 0)
function Gg1(q) {
    let K = q.length;
    if (K <= Wg1) return q.map((z) => `'${z}'`).join(", ");
    return `${q.slice(0,Wg1).map((z)=>`'${z}'`).join(", ")}, and ${K-Wg1} more`
}
// @from(Ln 220621, Col 0)
function B7z(q) {
    let K = q.match(xP4);
    if (!K || K.index === void 0) return q;
    let _ = q.substring(0, K.index),
        z = y1() === "windows" ? Math.max(_.lastIndexOf("/"), _.lastIndexOf("\\")) : _.lastIndexOf("/");
    if (z === -1) return ".";
    return _.substring(0, z) || "/"
}
// @from(Ln 220630, Col 0)
function kK6(q) {
    if (q === "~" || q.startsWith("~/") || process.platform === "win32" && q.startsWith("~\\")) return IP4() + q.slice(1);
    return q
}
// @from(Ln 220635, Col 0)
function vg1(q) {
    if (!Z7.isSandboxingEnabled()) return !1;
    let {
        allowOnly: K,
        denyWithinAllow: _
    } = Z7.getFsWriteConfig(), z = Ym(q), Y = K.flatMap(bP4), A = _.flatMap(bP4);
    return z.every((O) => {
        for (let w of A)
            if (iE(O, w)) return !1;
        return Y.some((w) => iE(O, w))
    })
}
// @from(Ln 220648, Col 0)
function fg1(q, K, _, z) {
    let Y = _ === "read" ? "read" : "edit",
        A = ZJ(q, K, Y, "deny");
    if (A !== null) return {
        allowed: !1,
        decisionReason: {
            type: "rule",
            rule: A
        }
    };
    if (_ !== "read") {
        let $ = at6(q, {});
        if ($.behavior === "allow") return {
            allowed: !0,
            decisionReason: $.decisionReason
        }
    }
    if (_ !== "read") {
        let $ = ot6(q, z, void 0, K.isRemoteMode);
        if (!$.safe) return {
            allowed: !1,
            decisionReason: {
                type: "safetyCheck",
                reason: $.message,
                classifierApprovable: $.classifierApprovable
            }
        }
    }
    let O = Tk(q, K, z);
    if (O) {
        if (_ === "read" || K.mode === "acceptEdits") return {
            allowed: !0
        }
    }
    if (_ === "read") {
        let $ = st6(q, {});
        if ($.behavior === "allow") return {
            allowed: !0,
            decisionReason: $.decisionReason
        }
    }
    if (_ !== "read" && !O && vg1(q)) return {
        allowed: !0,
        decisionReason: {
            type: "other",
            reason: "Path is in sandbox write allowlist"
        }
    };
    let w = ZJ(q, K, Y, "allow");
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
// @from(Ln 220709, Col 0)
function p7z(q, K, _, z) {
    if (MU(q)) {
        let j = Dg1(q) ? q : Zg1(K, q),
            {
                resolvedPath: H,
                isCanonical: J
            } = vA(V8(), j),
            X = fg1(H, _, z, J ? [H] : void 0);
        return {
            allowed: X.allowed,
            resolvedPath: H,
            decisionReason: X.decisionReason
        }
    }
    let Y = B7z(q),
        A = Dg1(Y) ? Y : Zg1(K, Y),
        {
            resolvedPath: O,
            isCanonical: w
        } = vA(V8(), A),
        $ = fg1(O, _, z, w ? [O] : void 0);
    return {
        allowed: $.allowed,
        resolvedPath: O,
        decisionReason: $.decisionReason
    }
}
// @from(Ln 220737, Col 0)
function fy6(q) {
    let K = q.replace(/[\\/]+/g, "/");
    if (K === "*" || K.endsWith("/*")) return !0;
    let _ = K === "/" ? K : K.replace(/\/$/, "");
    if (_ === "/") return !0;
    if (F7z.test(_)) return !0;
    let z = IP4().replace(/[\\/]+/g, "/");
    if (_ === z) return !0;
    if (m7z(_) === "/") return !0;
    if (g7z.test(_)) return !0;
    return !1
}
// @from(Ln 220750, Col 0)
function rt6(q, K, _, z) {
    let Y = kK6(q.replace(/^['"]|['"]$/g, ""));
    if (Gp(Y)) return {
        allowed: !1,
        resolvedPath: Y,
        decisionReason: {
            type: "other",
            reason: "UNC network paths require manual approval"
        }
    };
    if (Y.startsWith("~")) return {
        allowed: !1,
        resolvedPath: Y,
        decisionReason: {
            type: "other",
            reason: "Tilde expansion variants (~user, ~+, ~-) in paths require manual approval"
        }
    };
    if (Y.includes("$") || y1() === "windows" && Y.includes("%") || Y.startsWith("=")) return {
        allowed: !1,
        resolvedPath: Y,
        decisionReason: {
            type: "other",
            reason: "Shell expansion syntax in paths requires manual approval"
        }
    };
    if (xP4.test(Y)) {
        if (z === "write" || z === "create") return {
            allowed: !1,
            resolvedPath: Y,
            decisionReason: {
                type: "other",
                reason: "Glob patterns are not allowed in write operations. Please specify an exact file path."
            }
        };
        return p7z(Y, K, _, z)
    }
    let A = Dg1(Y) ? Y : Zg1(K, Y),
        {
            resolvedPath: O,
            isCanonical: w
        } = vA(V8(), A),
        $ = fg1(O, _, z, w ? [O] : void 0);
    return {
        allowed: $.allowed,
        resolvedPath: O,
        decisionReason: $.decisionReason
    }
}
// @from(Ln 220799, Col 4)
Wg1 = 5
// @from(Ln 220800, Col 4)
xP4
// @from(Ln 220800, Col 9)
bP4
// @from(Ln 220800, Col 14)
F7z
// @from(Ln 220800, Col 19)
g7z
// @from(Ln 220801, Col 4)
Gy6 = L(() => {
    U4();
    NK();
    Yq();
    b9();
    yY();
    Zy6();
    Sz();
    xP4 = /[*?[\]{}]/;
    bP4 = P1(Ym);
    F7z = /^[A-Za-z]:\/?$/, g7z = /^[A-Za-z]:\/[^/]+$/
})
// @from(Ln 220814, Col 0)
function Tg1(q) {
    return q.match(/^(.+):\*$/)?.[1] ?? null
}
// @from(Ln 220818, Col 0)
function d7z(q) {
    if (q.endsWith(":*")) return !1;
    for (let K = 0; K < q.length; K++)
        if (q[K] === "*") {
            let _ = 0,
                z = K - 1;
            while (z >= 0 && q[z] === "\\") _++, z--;
            if (_ % 2 === 0) return !0
        } return !1
}
// @from(Ln 220829, Col 0)
function Vk(q, K, _ = !1, z = !1) {
    let Y = q.trim(),
        A = z ? Y.replace(/[ \t]+/g, " ") : Y,
        O = z ? K.replace(/[ \t]+/g, " ") : K,
        w = "",
        $ = 0;
    while ($ < A.length) {
        let W = A[$];
        if (W === "\\" && $ + 1 < A.length) {
            let D = A[$ + 1];
            if (D === "*") {
                w += "\x00ESCAPED_STAR\x00", $ += 2;
                continue
            } else if (D === "\\") {
                w += "\x00ESCAPED_BACKSLASH\x00", $ += 2;
                continue
            }
        }
        w += W, $++
    }
    let J = w.replace(/[.+?^${}()|[\]\\'"]/g, "\\$&").replaceAll("*", ".*").replace(U7z, "\\*").replace(Q7z, "\\\\"),
        X = (w.match(/\*/g) || []).length;
    if (J.endsWith(" .*") && X === 1) J = J.slice(0, -3) + "( .*)?";
    let M = "s" + (_ ? "i" : "");
    return new RegExp(`^${J}$`, M).test(O)
}
// @from(Ln 220856, Col 0)
function qR8(q) {
    let K = Tg1(q);
    if (K !== null) return {
        type: "prefix",
        prefix: K
    };
    if (d7z(q)) return {
        type: "wildcard",
        pattern: q
    };
    return {
        type: "exact",
        command: q
    }
}
// @from(Ln 220872, Col 0)
function KR8(q, K) {
    return [{
        type: "addRules",
        rules: [{
            toolName: q,
            ruleContent: K
        }],
        behavior: "allow",
        destination: "localSettings"
    }]
}
// @from(Ln 220884, Col 0)
function tt6(q, K) {
    return [{
        type: "addRules",
        rules: [{
            toolName: q,
            ruleContent: `${K} *`
        }],
        behavior: "allow",
        destination: "localSettings"
    }]
}
// @from(Ln 220895, Col 4)
U7z
// @from(Ln 220895, Col 9)
Q7z
// @from(Ln 220896, Col 4)
NK6 = L(() => {
    U7z = new RegExp("\x00ESCAPED_STAR\x00", "g"), Q7z = new RegExp("\x00ESCAPED_BACKSLASH\x00", "g")
})
// @from(Ln 220899, Col 4)
uP4 = 50000
// @from(Ln 220900, Col 4)
Vg1 = 500000
// @from(Ln 220901, Col 4)
et6 = 4
// @from(Ln 220902, Col 4)
mP4 = 400000
// @from(Ln 220903, Col 4)
BP4 = 200000
// @from(Ln 220904, Col 4)
av = 50
// @from(Ln 220905, Col 4)
pP4 = 1e4
// @from(Ln 220907, Col 0)
function c7z() {
    let q = u8("tengu_auto_mode_config", {})?.enabled;
    return q === "enabled" || q === "disabled" || q === "opt-in" ? q : "opt-in"
}
// @from(Ln 220912, Col 0)
function EK6(q, K, _) {
    return
}
// @from(Ln 220916, Col 0)
function gP4(q) {
    let K = q.find((_) => _.name === "claude-vscode");
    if (K && K.type === "connected") {
        FP4 = K, K.client.setNotificationHandler(l7z(), async (z) => {
            let {
                eventName: Y,
                eventData: A
            } = z.params;
            d(`tengu_vscode_${Y}`, A)
        });
        let _ = {
            tengu_vscode_review_upsell: Tw("tengu_vscode_review_upsell"),
            tengu_vscode_onboarding: Tw("tengu_vscode_onboarding"),
            tengu_quiet_fern: u8("tengu_quiet_fern", !1),
            tengu_vscode_cc_auth: u8("tengu_vscode_cc_auth", !1),
            tengu_slate_ribbon: u8("tengu_slate_ribbon", !1)
        };
        _.tengu_auto_mode_state = c7z(), K.client.notification({
            method: "experiment_gates",
            params: {
                gates: _
            }
        })
    }
}
// @from(Ln 220941, Col 4)
l7z
// @from(Ln 220941, Col 9)
FP4 = null
// @from(Ln 220942, Col 4)
vy6 = L(() => {
    K8();
    p7();
    B1();
    C8();
    l7z = C6(() => y.object({
        method: y.literal("log_event"),
        params: y.object({
            eventName: y.string(),
            eventData: y.object({}).passthrough()
        })
    }))
})
// @from(Ln 220956, Col 0)
function UP4(q, K) {
    let _ = Object.create(null),
        z = 0;
    for (let Y of q) {
        let A = K(Y, z++);
        if (_[A] === void 0) _[A] = [];
        _[A].push(Y)
    }
    return _
}
// @from(Ln 220967, Col 0)
function dP4(q) {
    QP4 = q
}
// @from(Ln 220971, Col 0)
function cP4() {
    return QP4
}
// @from(Ln 220974, Col 4)
QP4 = null
// @from(Ln 220976, Col 0)
function Ej6(q, K) {
    let _ = I8(),
        z = {
            type: "queue-operation",
            operation: q,
            timestamp: new Date().toISOString(),
            sessionId: _,
            ...K !== void 0 && {
                content: K
            }
        };
    Ng1(z)
}
// @from(Ln 220990, Col 0)
function oP4(q) {
    rP4.add(q)
}
// @from(Ln 220994, Col 0)
function aP4(q) {
    return rP4.delete(q)
}
// @from(Ln 220998, Col 0)
function yK6() {
    nP4 = Object.freeze([...zO]), iP4.emit()
}
// @from(Ln 221002, Col 0)
function zR8() {
    return nP4
}
// @from(Ln 221006, Col 0)
function sP4() {
    return [...zO]
}
// @from(Ln 221010, Col 0)
function kg1() {
    return zO.length
}
// @from(Ln 221014, Col 0)
function qe6() {
    return zO.length > 0
}
// @from(Ln 221018, Col 0)
function Dj(q) {
    zO.push({
        ...q,
        priority: q.priority ?? "next"
    }), yK6(), Ej6("enqueue", typeof q.value === "string" ? q.value : void 0)
}
// @from(Ln 221025, Col 0)
function LY(q) {
    zO.push({
        ...q,
        priority: q.priority ?? "later"
    }), yK6(), Ej6("enqueue", typeof q.value === "string" ? q.value : void 0)
}
// @from(Ln 221032, Col 0)
function Ke6(q) {
    if (zO.length === 0) return;
    let K = -1,
        _ = 1 / 0;
    for (let Y = 0; Y < zO.length; Y++) {
        let A = zO[Y];
        if (q && !q(A)) continue;
        let O = _R8[A.priority ?? "next"];
        if (O < _) K = Y, _ = O
    }
    if (K === -1) return;
    let [z] = zO.splice(K, 1);
    return yK6(), Ej6("dequeue"), z
}
// @from(Ln 221047, Col 0)
function Lj6(q) {
    if (zO.length === 0) return;
    let K = -1,
        _ = 1 / 0;
    for (let z = 0; z < zO.length; z++) {
        let Y = zO[z];
        if (q && !q(Y)) continue;
        let A = _R8[Y.priority ?? "next"];
        if (A < _) K = z, _ = A
    }
    if (K === -1) return;
    return zO[K]
}
// @from(Ln 221061, Col 0)
function Ty6(q) {
    let K = [],
        _ = [];
    for (let z of zO)
        if (q(z)) K.push(z);
        else _.push(z);
    if (K.length === 0) return [];
    zO.length = 0, zO.push(..._), yK6();
    for (let z of K) Ej6("dequeue");
    return K
}
// @from(Ln 221073, Col 0)
function tP4(q) {
    if (q.length === 0) return;
    let K = zO.length;
    for (let _ = zO.length - 1; _ >= 0; _--)
        if (q.includes(zO[_])) zO.splice(_, 1);
    if (zO.length !== K) yK6();
    for (let _ of q) Ej6("remove")
}
// @from(Ln 221082, Col 0)
function eP4(q) {
    let K = [];
    for (let _ = zO.length - 1; _ >= 0; _--)
        if (q(zO[_])) K.unshift(zO.splice(_, 1)[0]);
    if (K.length > 0) {
        yK6();
        for (let _ of K) Ej6("remove")
    }
    return K
}
// @from(Ln 221093, Col 0)
function qW4() {
    if (zO.length === 0) return;
    zO.length = 0, yK6()
}
// @from(Ln 221098, Col 0)
function i7z(q) {
    return !n7z.has(q)
}
// @from(Ln 221102, Col 0)
function hj6(q) {
    return i7z(q.mode) && !q.isMeta
}
// @from(Ln 221106, Col 0)
function KW4(q) {
    if (q.origin?.kind === "channel") return !0;
    return hj6(q)
}
// @from(Ln 221111, Col 0)
function r7z(q) {
    return typeof q === "string" ? q : s5(q, `
`)
}
// @from(Ln 221116, Col 0)
function o7z(q, K) {
    if (typeof q === "string") return [];
    let _ = [],
        z = 0;
    for (let Y of q)
        if (Y.type === "image" && Y.source.type === "base64") _.push({
            id: K + z,
            type: "image",
            content: Y.source.data,
            mediaType: Y.source.media_type,
            filename: `image${z+1}`
        }), z++;
    return _
}
// @from(Ln 221131, Col 0)
function YR8(q, K) {
    if (zO.length === 0) return;
    let {
        editable: _ = [],
        nonEditable: z = []
    } = UP4([...zO], (j) => hj6(j) ? "editable" : "nonEditable");
    if (_.length === 0) return;
    let Y = _.map((j) => r7z(j.value)),
        A = [...Y, q].filter(Boolean).join(`
`),
        O = Y.join(`
`).length + 1 + K,
        w = [],
        $ = Date.now();
    for (let j of _) {
        if (j.pastedContents) {
            for (let J of Object.values(j.pastedContents))
                if (J.type === "image") w.push(J)
        }
        let H = o7z(j.value, $);
        w.push(...H), $ += H.length
    }
    for (let j of _) Ej6("popAll", typeof j.value === "string" ? j.value : void 0);
    return zO.length = 0, zO.push(...z), yK6(), {
        text: A,
        cursorOffset: O,
        images: w
    }
}
// @from(Ln 221161, Col 0)
function AR8(q) {
    let K = _R8[q];
    return zO.filter((_) => _R8[_.priority ?? "next"] <= K)
}
// @from(Ln 221166, Col 0)
function _W4(q) {
    return typeof q.value === "string" && q.value.trim().startsWith("/") && !q.skipSlashCommands
}
// @from(Ln 221169, Col 4)
zO
// @from(Ln 221169, Col 8)
nP4
// @from(Ln 221169, Col 13)
iP4
// @from(Ln 221169, Col 18)
rP4
// @from(Ln 221169, Col 23)
yj6
// @from(Ln 221169, Col 28)
_R8
// @from(Ln 221169, Col 33)
n7z
// @from(Ln 221170, Col 4)
b$ = L(() => {
    y8();
    _7();
    g4();
    nH();
    zO = [], nP4 = Object.freeze([]), iP4 = l5(), rP4 = new Set;
    yj6 = iP4.subscribe;
    dP4((q) => Dj({
        mode: "prompt",
        value: `/${q}`
    }));
    _R8 = {
        now: 0,
        next: 1,
        later: 2
    };
    n7z = new Set(["task-notification"])
})
// @from(Ln 221192, Col 0)
function sv(q) {
    if (!I7()) return;
    if (_e6.length >= s7z) _e6.shift();
    _e6.push(q)
}
// @from(Ln 221198, Col 0)
function ze6() {
    if (_e6.length === 0) return [];
    return _e6.splice(0).map((K) => ({
        ...K,
        uuid: a7z(),
        session_id: I8()
    }))
}
// @from(Ln 221207, Col 0)
function I$(q, K, _) {
    sv({
        type: "system",
        subtype: "task_notification",
        task_id: q,
        tool_use_id: _?.toolUseId,
        status: K,
        output_file: _?.outputFile ?? "",
        summary: _?.summary ?? "",
        usage: _?.usage,
        skip_transcript: _?.skipTranscript
    })
}
// @from(Ln 221220, Col 4)
s7z = 1000
// @from(Ln 221221, Col 4)
_e6
// @from(Ln 221222, Col 4)
BP = L(() => {
    y8();
    _e6 = []
})
// @from(Ln 221227, Col 0)
function fJ(q) {
    return q.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
}
// @from(Ln 221231, Col 0)
function O_(q) {
    return fJ(q).replaceAll('"', "&quot;").replaceAll("'", "&apos;")
}
// @from(Ln 221235, Col 0)
function AW4(q) {
    return q.isNonInteractiveSession
}
// @from(Ln 221239, Col 0)
function OR8(q) {
    let K = zW4.get(q);
    if (K) return K;
    let _ = qqz(q);
    return zW4.set(q, _), _
}
// @from(Ln 221246, Col 0)
function qqz(q) {
    try {
        let K = new YW4.Ajv({
            allErrors: !0
        });
        if (!K.validateSchema(q)) return {
            error: K.errorsText(K.errors)
        };
        let z = K.compile(q);
        return {
            tool: {
                ...Eg1,
                inputJSONSchema: q,
                async call(Y) {
                    if (!z(Y)) {
                        let O = z.errors?.map((w) => `${w.instancePath||"root"}: ${w.message}`).join(", ");
                        throw new XV(`Output does not match required schema: ${O}`, `StructuredOutput schema mismatch: ${(O??"").slice(0,150)}`)
                    }
                    return {
                        data: "Structured output provided successfully",
                        structured_output: Y
                    }
                }
            }
        }
    } catch (K) {
        return {
            error: K instanceof Error ? K.message : String(K)
        }
    }
}
// @from(Ln 221277, Col 4)
YW4
// @from(Ln 221277, Col 9)
t7z
// @from(Ln 221277, Col 14)
e7z
// @from(Ln 221277, Col 19)
iW = "StructuredOutput"
// @from(Ln 221278, Col 4)
Eg1
// @from(Ln 221278, Col 9)
zW4
// @from(Ln 221279, Col 4)
td = L(() => {
    p7();
    gq();
    m8();
    e8();
    YW4 = K6(bj8(), 1), t7z = C6(() => y.object({}).passthrough()), e7z = C6(() => y.string().describe("Structured output tool result"));
    Eg1 = Iq({
        isMcp: !1,
        isEnabled() {
            return !0
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        isOpenWorld() {
            return !1
        },
        name: iW,
        searchHint: "return the final response as structured JSON",
        maxResultSizeChars: 1e5,
        async description() {
            return "Return structured output in the requested format"
        },
        async prompt() {
            return "Use this tool to return your final response in the requested structured format. You MUST call this tool exactly once at the end of your response to provide the structured output."
        },
        get inputSchema() {
            return t7z()
        },
        get outputSchema() {
            return e7z()
        },
        async call(q) {
            return {
                data: "Structured output provided successfully",
                structured_output: q
            }
        },
        async checkPermissions(q) {
            return {
                behavior: "allow",
                updatedInput: q
            }
        },
        renderToolUseMessage(q) {
            let K = Object.keys(q);
            if (K.length === 0) return null;
            if (K.length <= 3) return K.map((_) => `${_}: ${I6(q[_])}`).join(", ");
            return `${K.length} fields: ${K.slice(0,3).join(", ")}…`
        },
        renderToolUseRejectedMessage() {
            return "Structured output rejected"
        },
        renderToolUseErrorMessage() {
            return "Structured output error"
        },
        renderToolUseProgressMessage() {
            return null
        },
        renderToolResultMessage(q) {
            return q
        },
        mapToolResultToToolResultBlockParam(q, K) {
            return {
                tool_use_id: K,
                type: "tool_result",
                content: q
            }
        }
    }), zW4 = new WeakMap
})
// @from(Ln 221354, Col 0)
function pP(q) {
    return q
}
// @from(Ln 221358, Col 0)
function w2(q) {
    return q
}
// @from(Ln 221362, Col 0)
function OW4(q) {
    return Kqz.test(q) ? q : null
}
// @from(Ln 221365, Col 4)
Kqz
// @from(Ln 221366, Col 4)
Cf = L(() => {
    Kqz = /^a(?:.+-)?[0-9a-f]{16}$/
})
// @from(Ln 221373, Col 0)
function F5(q = zqz) {
    let K = new AbortController;
    return _qz(q, K.signal), K
}
// @from(Ln 221378, Col 0)
function Yqz(q) {
    let K = this.deref();
    q.deref()?.abort(K?.signal.reason)
}
// @from(Ln 221383, Col 0)
function Aqz(q) {
    let K = this.deref(),
        _ = q.deref();
    if (K && _) K.signal.removeEventListener("abort", _)
}
// @from(Ln 221389, Col 0)
function tv(q, K) {
    let _ = F5(K);
    if (q.signal.aborted) return _.abort(q.signal.reason), _;
    let z = new WeakRef(_),
        Y = new WeakRef(q),
        A = Yqz.bind(Y, z);
    return q.signal.addEventListener("abort", A, {
        once: !0
    }), _.signal.addEventListener("abort", Aqz.bind(Y, new WeakRef(A)), {
        once: !0
    }), _
}
// @from(Ln 221401, Col 4)
zqz = 50
// @from(Ln 221402, Col 4)
x$ = () => {}
// @from(Ln 221404, Col 0)
function wR8(q) {
    let K = q.indexOf(`
`),
        _ = (K === -1 ? q : q.slice(0, K)).trim();
    if (!_.startsWith("#") || _.startsWith("#!")) return;
    return _.replace(/^#+\s*/, "") || void 0
}
// @from(Ln 221412, Col 0)
function Oqz() {
    return `
- If this is an existing file, you MUST use the ${xq} tool first to read the file's contents. This tool will fail if you did not read the file first.`
}
// @from(Ln 221417, Col 0)
function wW4() {
    return `Writes a file to the local filesystem.

Usage:
- This tool will overwrite the existing file if there is one at the provided path.${Oqz()}
- Prefer the Edit tool for modifying existing files — it only sends the diff. Only use this tool to create new files or for complete rewrites.
- NEVER create documentation files (*.md) or README files unless explicitly requested by the User.
- Only use emojis if the user explicitly requests it. Avoid writing emojis to files unless asked.`
}
// @from(Ln 221426, Col 4)
IK = "Write"
// @from(Ln 221427, Col 4)
u$ = L(() => {
    Rz()
})
// @from(Ln 221431, Col 0)
function LK6() {
    let q = new Date,
        K = q.getFullYear(),
        _ = String(q.getMonth() + 1).padStart(2, "0"),
        z = String(q.getDate()).padStart(2, "0");
    return `${K}-${_}-${z}`
}
// @from(Ln 221439, Col 0)
function $W4() {
    return new Date().toLocaleString("en-US", {
        month: "long",
        year: "numeric"
    })
}
// @from(Ln 221445, Col 4)
$R8
// @from(Ln 221446, Col 4)
Rj6 = L(() => {
    U4();
    $R8 = P1(LK6)
})
// @from(Ln 221450, Col 4)
Tp = {}
// @from(Ln 221472, Col 0)
function $qz(q) {
    if (q.includes("\x00")) throw new TD(`Null byte in path key: "${q}"`);
    let K;
    try {
        K = decodeURIComponent(q)
    } catch {
        K = q
    }
    if (K !== q && (K.includes("..") || K.includes("/"))) throw new TD(`URL-encoded traversal in path key: "${q}"`);
    let _ = q.normalize("NFKC");
    if (_ !== q && (_.includes("..") || _.includes("/") || _.includes("\\") || _.includes("\x00"))) throw new TD(`Unicode-normalized traversal in path key: "${q}"`);
    if (q.includes("\\")) throw new TD(`Backslash in path key: "${q}"`);
    if (q.startsWith("/")) throw new TD(`Absolute path key: "${q}"`);
    return q
}
// @from(Ln 221488, Col 0)
function Ye6() {
    if (!x3()) return !1;
    return u8("tengu_herring_clock", !1)
}
// @from(Ln 221493, Col 0)
function vp() {
    return (yg1(Nw(), "team") + jR8).normalize("NFC")
}
// @from(Ln 221497, Col 0)
function HR8() {
    if (!Ye6()) return !1;
    return X81() === "has-content"
}
// @from(Ln 221501, Col 0)
async function JW4(q) {
    let K = [],
        _ = q;
    for (let z = jW4(_); _ !== z; z = jW4(_)) try {
        let Y = await HW4(_);
        return K.length === 0 ? Y : yg1(Y, ...K.reverse())
    } catch (Y) {
        let A = Q1(Y);
        if (A === "ENOENT") try {
                if ((await wqz(_)).isSymbolicLink()) throw new TD(`Dangling symlink detected (target does not exist): "${_}"`)
            } catch (O) {
                if (O instanceof TD) throw O
            } else if (A === "ELOOP") throw new TD(`Symlink loop detected in path: "${_}"`);
            else if (A !== "ENOTDIR" && A !== "ENAMETOOLONG") throw new TD(`Cannot verify path containment (${A}): "${_}"`);
        K.push(_.slice(z.length + jR8.length)), _ = z
    }
    return q
}
// @from(Ln 221519, Col 0)
async function XW4(q) {
    let K;
    try {
        K = await HW4(vp().replace(/[/\\]+$/, ""))
    } catch (_) {
        let z = Q1(_);
        if (z === "ENOENT" || z === "ENOTDIR") return !0;
        return !1
    }
    if (q === K) return !0;
    return q.startsWith(K + jR8)
}
// @from(Ln 221532, Col 0)
function MW4(q) {
    let K = Lg1(q),
        _ = vp();
    return K + jR8 === _ || K.startsWith(_)
}
// @from(Ln 221537, Col 0)
async function jqz(q) {
    if (q.includes("\x00")) throw new TD(`Null byte in path: "${q}"`);
    let K = Lg1(q),
        _ = vp();
    if (!K.startsWith(_)) throw new TD(`Path escapes team memory directory: "${q}"`);
    let z = await JW4(K);
    if (!await XW4(z)) throw new TD(`Path escapes team memory directory via symlink: "${q}"`);
    return K
}
// @from(Ln 221546, Col 0)
async function JR8(q) {
    $qz(q);
    let K = vp(),
        _ = yg1(K, q),
        z = Lg1(_);
    if (!z.startsWith(K)) throw new TD(`Key escapes team memory directory: "${q}"`);
    let Y = await JW4(z);
    if (!await XW4(Y)) throw new TD(`Key escapes team memory directory via symlink: "${q}"`);
    return z
}
// @from(Ln 221557, Col 0)
function Ae6(q) {
    return Ye6() && MW4(q)
}
// @from(Ln 221560, Col 4)
TD
// @from(Ln 221561, Col 4)
ev = L(() => {
    y8();
    B1();
    m8();
    VY();
    TD = class TD extends Error {
        constructor(q) {
            super(q);
            this.name = "PathTraversalError"
        }
    }
})
// @from(Ln 221580, Col 0)
function PW4(q) {
    if (!q.endsWith(".md")) return !1;
    if (Wqz.isTeamMemPath(q)) return !1;
    return YR(q)
}
// @from(Ln 221586, Col 0)
function Dqz(q) {
    return wH() && PW4(q)
}
// @from(Ln 221589, Col 0)
async function Zqz(q, K) {
    let _, z;
    try {
        z = (await Xqz(q)).mtime, _ = await Jqz(q, "utf-8")
    } catch {
        return !1
    }
    let Y = zy6.exec(_);
    if (!Y) return !1;
    let A = Y[1] ?? "",
        O = K(A);
    if (O === null) return !0;
    if (O === A) return !0;
    let w = `---
${O}---
${_.slice(Y[0].length)}`;
    try {
        return await Pqz(q, w, "utf-8"), await Mqz(q, new Date, z), !0
    } catch ($) {
        return E(`tinyMemoryStamps: stamp failed for ${q}: ${String($)}`, {
            level: "debug"
        }), !1
    }
}
// @from(Ln 221614, Col 0)
function XR8(q, K) {
    if (!PW4(q)) return K;
    let _ = zy6.exec(K);
    if (!_) return K;
    let z = _[1] ?? "",
        Y = z;
    if (wH() && !/^created:/m.test(Y)) Y = `${Y}created: ${LK6()}
`;
    if (!/^originSessionId:/m.test(Y)) Y = `${Y}originSessionId: ${I8()}
`;
    if (Y === z) return K;
    return `---
${Y}---
${K.slice(_[0].length)}`
}
// @from(Ln 221630, Col 0)
function DW4() {
    let q = new Map;
    WW4 = async (K) => {
        if (!Dqz(K)) return;
        let _ = LK6();
        if (q.get(K) === _) return;
        if (q.set(K, _), !await Zqz(K, (Y) => {
                if (Y.match(/^last_read: (\d{4}-\d{2}-\d{2})$/m)?.[1] === _) return null;
                if (/^last_read:/m.test(Y)) return Y.replace(/^last_read:.*$/m, `last_read: ${_}`);
                return `${Y}last_read: ${_}
`
            })) q.delete(K)
    }
}
// @from(Ln 221644, Col 0)
async function MR8(q) {
    await WW4(q)
}
// @from(Ln 221647, Col 4)
Wqz
// @from(Ln 221647, Col 9)
WW4 = async () => {}
// @from(Ln 221648, Col 4)
Vy6 = L(() => {
    y8();
    Rj6();
    K8();
    Lf();
    VY();
    Wqz = (ev(), B7(Tp))
})
// @from(Ln 221656, Col 0)
class hg1 {
    constructor(q) {
        this._client = q
    }
    async * callToolStream(q, K = zU, _) {
        let z = this._client,
            Y = {
                ..._,
                task: _?.task ?? (z.isToolTask(q.name) ? {} : void 0)
            },
            A = z.requestStream({
                method: "tools/call",
                params: q
            }, K, Y),
            O = z.getToolOutputValidator(q.name);
        for await (let w of A) {
            if (w.type === "result" && O) {
                let $ = w.result;
                if (!$.structuredContent && !$.isError) {
                    yield {
                        type: "error",
                        error: new SK(V5.InvalidRequest, `Tool ${q.name} has an output schema but did not return structured content`)
                    };
                    return
                }
                if ($.structuredContent) try {
                    let j = O($.structuredContent);
                    if (!j.valid) {
                        yield {
                            type: "error",
                            error: new SK(V5.InvalidParams, `Structured content does not match the tool's output schema: ${j.errorMessage}`)
                        };
                        return
                    }
                } catch (j) {
                    if (j instanceof SK) {
                        yield {
                            type: "error",
                            error: j
                        };
                        return
                    }
                    yield {
                        type: "error",
                        error: new SK(V5.InvalidParams, `Failed to validate structured content: ${j instanceof Error?j.message:String(j)}`)
                    };
                    return
                }
            }
            yield w
        }
    }
    async getTask(q, K) {
        return this._client.getTask({
            taskId: q
        }, K)
    }
    async getTaskResult(q, K, _) {
        return this._client.getTaskResult({
            taskId: q
        }, K, _)
    }
    async listTasks(q, K) {
        return this._client.listTasks(q ? {
            cursor: q
        } : void 0, K)
    }
    async cancelTask(q, K) {
        return this._client.cancelTask({
            taskId: q
        }, K)
    }
    requestStream(q, K, _) {
        return this._client.requestStream(q, K, _)
    }
}
// @from(Ln 221732, Col 4)
ZW4 = L(() => {
    _P()
})
// @from(Ln 221736, Col 0)
function PR8(q, K) {
    if (!q || K === null || typeof K !== "object") return;
    if (q.type === "object" && q.properties && typeof q.properties === "object") {
        let _ = K,
            z = q.properties;
        for (let Y of Object.keys(z)) {
            let A = z[Y];
            if (_[Y] === void 0 && Object.prototype.hasOwnProperty.call(A, "default")) _[Y] = A.default;
            if (_[Y] !== void 0) PR8(A, _[Y])
        }
    }
    if (Array.isArray(q.anyOf)) {
        for (let _ of q.anyOf)
            if (typeof _ !== "boolean") PR8(_, K)
    }
    if (Array.isArray(q.oneOf)) {
        for (let _ of q.oneOf)
            if (typeof _ !== "boolean") PR8(_, K)
    }
}
// @from(Ln 221757, Col 0)
function fqz(q) {
    if (!q) return {
        supportsFormMode: !1,
        supportsUrlMode: !1
    };
    let K = q.form !== void 0,
        _ = q.url !== void 0;
    return {
        supportsFormMode: K || !K && !_,
        supportsUrlMode: _
    }
}
// @from(Ln 221769, Col 4)
WR8
// @from(Ln 221770, Col 4)
fW4 = L(() => {
    v91();
    _P();
    V_1();
    Hg6();
    ZW4();
    WR8 = class WR8 extends pg6 {
        constructor(q, K) {
            super(K);
            if (this._clientInfo = q, this._cachedToolOutputValidators = new Map, this._cachedKnownTaskTools = new Set, this._cachedRequiredTaskTools = new Set, this._listChangedDebounceTimers = new Map, this._capabilities = K?.capabilities ?? {}, this._jsonSchemaValidator = K?.jsonSchemaValidator ?? new $U6, K?.listChanged) this._pendingListChangedConfig = K.listChanged
        }
        _setupListChangedHandlers(q) {
            if (q.tools && this._serverCapabilities?.tools?.listChanged) this._setupListChangedHandler("tools", Ig6, q.tools, async () => {
                return (await this.listTools()).tools
            });
            if (q.prompts && this._serverCapabilities?.prompts?.listChanged) this._setupListChangedHandler("prompts", Cg6, q.prompts, async () => {
                return (await this.listPrompts()).prompts
            });
            if (q.resources && this._serverCapabilities?.resources?.listChanged) this._setupListChangedHandler("resources", Rg6, q.resources, async () => {
                return (await this.listResources()).resources
            })
        }
        get experimental() {
            if (!this._experimental) this._experimental = {
                tasks: new hg1(this)
            };
            return this._experimental
        }
        registerCapabilities(q) {
            if (this.transport) throw Error("Cannot register capabilities after connecting to transport");
            this._capabilities = a$8(this._capabilities, q)
        }
        setRequestHandler(q, K) {
            let z = IZ6(q)?.method;
            if (!z) throw Error("Schema is missing a method literal");
            let Y;
            if (q16(z)) {
                let O = z;
                Y = O._zod?.def?.value ?? O.value
            } else {
                let O = z;
                Y = O._def?.value ?? O.value
            }
            if (typeof Y !== "string") throw Error("Schema method literal must be a string");
            let A = Y;
            if (A === "elicitation/create") {
                let O = async (w, $) => {
                    let j = DV($r, w);
                    if (!j.success) {
                        let Z = j.error instanceof Error ? j.error.message : String(j.error);
                        throw new SK(V5.InvalidParams, `Invalid elicitation request: ${Z}`)
                    }
                    let {
                        params: H
                    } = j.data;
                    H.mode = H.mode ?? "form";
                    let {
                        supportsFormMode: J,
                        supportsUrlMode: X
                    } = fqz(this._capabilities.elicitation);
                    if (H.mode === "form" && !J) throw new SK(V5.InvalidParams, "Client does not support form-mode elicitation requests");
                    if (H.mode === "url" && !X) throw new SK(V5.InvalidParams, "Client does not support URL-mode elicitation requests");
                    let M = await Promise.resolve(K(w, $));
                    if (H.task) {
                        let Z = DV(Or, M);
                        if (!Z.success) {
                            let G = Z.error instanceof Error ? Z.error.message : String(Z.error);
                            throw new SK(V5.InvalidParams, `Invalid task creation result: ${G}`)
                        }
                        return Z.data
                    }
                    let P = DV(z16, M);
                    if (!P.success) {
                        let Z = P.error instanceof Error ? P.error.message : String(P.error);
                        throw new SK(V5.InvalidParams, `Invalid elicitation result: ${Z}`)
                    }
                    let W = P.data,
                        D = H.mode === "form" ? H.requestedSchema : void 0;
                    if (H.mode === "form" && W.action === "accept" && W.content && D) {
                        if (this._capabilities.elicitation?.form?.applyDefaults) try {
                            PR8(D, W.content)
                        } catch {}
                    }
                    return W
                };
                return super.setRequestHandler(q, O)
            }
            if (A === "sampling/createMessage") {
                let O = async (w, $) => {
                    let j = DV(c31, w);
                    if (!j.success) {
                        let W = j.error instanceof Error ? j.error.message : String(j.error);
                        throw new SK(V5.InvalidParams, `Invalid sampling request: ${W}`)
                    }
                    let {
                        params: H
                    } = j.data, J = await Promise.resolve(K(w, $));
                    if (H.task) {
                        let W = DV(Or, J);
                        if (!W.success) {
                            let D = W.error instanceof Error ? W.error.message : String(W.error);
                            throw new SK(V5.InvalidParams, `Invalid task creation result: ${D}`)
                        }
                        return W.data
                    }
                    let M = H.tools || H.toolChoice ? ug6 : aY6,
                        P = DV(M, J);
                    if (!P.success) {
                        let W = P.error instanceof Error ? P.error.message : String(P.error);
                        throw new SK(V5.InvalidParams, `Invalid sampling result: ${W}`)
                    }
                    return P.data
                };
                return super.setRequestHandler(q, O)
            }
            return super.setRequestHandler(q, K)
        }
        assertCapability(q, K) {
            if (!this._serverCapabilities?.[q]) throw Error(`Server does not support ${q} (required for ${K})`)
        }
        async connect(q, K) {
            if (await super.connect(q), q.sessionId !== void 0) return;
            try {
                let _ = await this.request({
                    method: "initialize",
                    params: {
                        protocolVersion: K16,
                        capabilities: this._capabilities,
                        clientInfo: this._clientInfo
                    }
                }, u31, K);
                if (_ === void 0) throw Error(`Server sent invalid initialize result: ${_}`);
                if (!b$8.includes(_.protocolVersion)) throw Error(`Server's protocol version is not supported: ${_.protocolVersion}`);
                if (this._serverCapabilities = _.capabilities, this._serverVersion = _.serverInfo, q.setProtocolVersion) q.setProtocolVersion(_.protocolVersion);
                if (this._instructions = _.instructions, await this.notification({
                        method: "notifications/initialized"
                    }), this._pendingListChangedConfig) this._setupListChangedHandlers(this._pendingListChangedConfig), this._pendingListChangedConfig = void 0
            } catch (_) {
                throw this.close(), _
            }
        }
        getServerCapabilities() {
            return this._serverCapabilities
        }
        getServerVersion() {
            return this._serverVersion
        }
        getInstructions() {
            return this._instructions
        }
        assertCapabilityForMethod(q) {
            switch (q) {
                case "logging/setLevel":
                    if (!this._serverCapabilities?.logging) throw Error(`Server does not support logging (required for ${q})`);
                    break;
                case "prompts/get":
                case "prompts/list":
                    if (!this._serverCapabilities?.prompts) throw Error(`Server does not support prompts (required for ${q})`);
                    break;
                case "resources/list":
                case "resources/templates/list":
                case "resources/read":
                case "resources/subscribe":
                case "resources/unsubscribe":
                    if (!this._serverCapabilities?.resources) throw Error(`Server does not support resources (required for ${q})`);
                    if (q === "resources/subscribe" && !this._serverCapabilities.resources.subscribe) throw Error(`Server does not support resource subscriptions (required for ${q})`);
                    break;
                case "tools/call":
                case "tools/list":
                    if (!this._serverCapabilities?.tools) throw Error(`Server does not support tools (required for ${q})`);
                    break;
                case "completion/complete":
                    if (!this._serverCapabilities?.completions) throw Error(`Server does not support completions (required for ${q})`);
                    break;
                case "initialize":
                    break;
                case "ping":
                    break
            }
        }
        assertNotificationCapability(q) {
            switch (q) {
                case "notifications/roots/list_changed":
                    if (!this._capabilities.roots?.listChanged) throw Error(`Client does not support roots list changed notifications (required for ${q})`);
                    break;
                case "notifications/initialized":
                    break;
                case "notifications/cancelled":
                    break;
                case "notifications/progress":
                    break
            }
        }
        assertRequestHandlerCapability(q) {
            if (!this._capabilities) return;
            switch (q) {
                case "sampling/createMessage":
                    if (!this._capabilities.sampling) throw Error(`Client does not support sampling capability (required for ${q})`);
                    break;
                case "elicitation/create":
                    if (!this._capabilities.elicitation) throw Error(`Client does not support elicitation capability (required for ${q})`);
                    break;
                case "roots/list":
                    if (!this._capabilities.roots) throw Error(`Client does not support roots capability (required for ${q})`);
                    break;
                case "tasks/get":
                case "tasks/list":
                case "tasks/result":
                case "tasks/cancel":
                    if (!this._capabilities.tasks) throw Error(`Client does not support tasks capability (required for ${q})`);
                    break;
                case "ping":
                    break
            }
        }
        assertTaskCapability(q) {
            xj8(this._serverCapabilities?.tasks?.requests, q, "Server")
        }
        assertTaskHandlerCapability(q) {
            if (!this._capabilities) return;
            uj8(this._capabilities.tasks?.requests, q, "Client")
        }
        async ping(q) {
            return this.request({
                method: "ping"
            }, Ar, q)
        }
        async complete(q, K) {
            return this.request({
                method: "completion/complete",
                params: q
            }, n31, K)
        }
        async setLoggingLevel(q, K) {
            return this.request({
                method: "logging/setLevel",
                params: {
                    level: q
                }
            }, Ar, K)
        }
        async getPrompt(q, K) {
            return this.request({
                method: "prompts/get",
                params: q
            }, Q31, K)
        }
        async listPrompts(q, K) {
            return this.request({
                method: "prompts/list",
                params: q
            }, Sg6, K)
        }
        async listResources(q, K) {
            return this.request({
                method: "resources/list",
                params: q
            }, yg6, K)
        }
        async listResourceTemplates(q, K) {
            return this.request({
                method: "resources/templates/list",
                params: q
            }, Lg6, K)
        }
        async readResource(q, K) {
            return this.request({
                method: "resources/read",
                params: q
            }, hg6, K)
        }
        async subscribeResource(q, K) {
            return this.request({
                method: "resources/subscribe",
                params: q
            }, Ar, K)
        }
        async unsubscribeResource(q, K) {
            return this.request({
                method: "resources/unsubscribe",
                params: q
            }, Ar, K)
        }
        async callTool(q, K = zU, _) {
            if (this.isToolTaskRequired(q.name)) throw new SK(V5.InvalidRequest, `Tool "${q.name}" requires task-based execution. Use client.experimental.tasks.callToolStream() instead.`);
            let z = await this.request({
                    method: "tools/call",
                    params: q
                }, K, _),
                Y = this.getToolOutputValidator(q.name);
            if (Y) {
                if (!z.structuredContent && !z.isError) throw new SK(V5.InvalidRequest, `Tool ${q.name} has an output schema but did not return structured content`);
                if (z.structuredContent) try {
                    let A = Y(z.structuredContent);
                    if (!A.valid) throw new SK(V5.InvalidParams, `Structured content does not match the tool's output schema: ${A.errorMessage}`)
                } catch (A) {
                    if (A instanceof SK) throw A;
                    throw new SK(V5.InvalidParams, `Failed to validate structured content: ${A instanceof Error?A.message:String(A)}`)
                }
            }
            return z
        }
        isToolTask(q) {
            if (!this._serverCapabilities?.tasks?.requests?.tools?.call) return !1;
            return this._cachedKnownTaskTools.has(q)
        }
        isToolTaskRequired(q) {
            return this._cachedRequiredTaskTools.has(q)
        }
        cacheToolMetadata(q) {
            this._cachedToolOutputValidators.clear(), this._cachedKnownTaskTools.clear(), this._cachedRequiredTaskTools.clear();
            for (let K of q) {
                if (K.outputSchema) {
                    let z = this._jsonSchemaValidator.getValidator(K.outputSchema);
                    this._cachedToolOutputValidators.set(K.name, z)
                }
                let _ = K.execution?.taskSupport;
                if (_ === "required" || _ === "optional") this._cachedKnownTaskTools.add(K.name);
                if (_ === "required") this._cachedRequiredTaskTools.add(K.name)
            }
        }
        getToolOutputValidator(q) {
            return this._cachedToolOutputValidators.get(q)
        }
        async listTools(q, K) {
            let _ = await this.request({
                method: "tools/list",
                params: q
            }, bg6, K);
            return this.cacheToolMetadata(_.tools), _
        }
        _setupListChangedHandler(q, K, _, z) {
            let Y = GE7.safeParse(_);
            if (!Y.success) throw Error(`Invalid ${q} listChanged options: ${Y.error.message}`);
            if (typeof _.onChanged !== "function") throw Error(`Invalid ${q} listChanged options: onChanged must be a function`);
            let {
                autoRefresh: A,
                debounceMs: O
            } = Y.data, {
                onChanged: w
            } = _, $ = async () => {
                if (!A) {
                    w(null, null);
                    return
                }
                try {
                    let H = await z();
                    w(null, H)
                } catch (H) {
                    let J = H instanceof Error ? H : Error(String(H));
                    w(J, null)
                }
            }, j = () => {
                if (O) {
                    let H = this._listChangedDebounceTimers.get(q);
                    if (H) clearTimeout(H);
                    let J = setTimeout($, O);
                    this._listChangedDebounceTimers.set(q, J)
                } else $()
            };
            this.setNotificationHandler(K, j)
        }
        async sendRootsListChanged() {
            return this.notification({
                method: "notifications/roots/list_changed"
            })
        }
    }
})
// @from(Ln 222140, Col 0)
function Rg1(q) {}
// @from(Ln 222142, Col 0)
function DR8(q) {
    if (typeof q == "function") throw TypeError("`callbacks` must be an object, got a function instead. Did you mean `{onEvent: fn}`?");
    let {
        onEvent: K = Rg1,
        onError: _ = Rg1,
        onRetry: z = Rg1,
        onComment: Y
    } = q, A = "", O = !0, w, $ = "", j = "";

    function H(W) {
        let D = O ? W.replace(/^\xEF\xBB\xBF/, "") : W,
            [Z, G] = Gqz(`${A}${D}`);
        for (let f of Z) J(f);
        A = G, O = !1
    }

    function J(W) {
        if (W === "") {
            M();
            return
        }
        if (W.startsWith(":")) {
            Y && Y(W.slice(W.startsWith(": ") ? 2 : 1));
            return
        }
        let D = W.indexOf(":");
        if (D !== -1) {
            let Z = W.slice(0, D),
                G = W[D + 1] === " " ? 2 : 1,
                f = W.slice(D + G);
            X(Z, f, W);
            return
        }
        X(W, "", W)
    }

    function X(W, D, Z) {
        switch (W) {
            case "event":
                j = D;
                break;
            case "data":
                $ = `${$}${D}
`;
                break;
            case "id":
                w = D.includes("\x00") ? void 0 : D;
                break;
            case "retry":
                /^\d+$/.test(D) ? z(parseInt(D, 10)) : _(new Sg1(`Invalid \`retry\` value: "${D}"`, {
                    type: "invalid-retry",
                    value: D,
                    line: Z
                }));
                break;
            default:
                _(new Sg1(`Unknown field "${W.length>20?`${W.slice(0,20)}…`:W}"`, {
                    type: "unknown-field",
                    field: W,
                    value: D,
                    line: Z
                }));
                break
        }
    }

    function M() {
        $.length > 0 && K({
            id: w,
            event: j || void 0,
            data: $.endsWith(`
`) ? $.slice(0, -1) : $
        }), w = void 0, $ = "", j = ""
    }

    function P(W = {}) {
        A && W.consume && J(A), O = !0, w = void 0, $ = "", j = "", A = ""
    }
    return {
        feed: H,
        reset: P
    }
}
// @from(Ln 222226, Col 0)
function Gqz(q) {
    let K = [],
        _ = "",
        z = 0;
    for (; z < q.length;) {
        let Y = q.indexOf("\r", z),
            A = q.indexOf(`
`, z),
            O = -1;
        if (Y !== -1 && A !== -1 ? O = Math.min(Y, A) : Y !== -1 ? O = Y : A !== -1 && (O = A), O === -1) {
            _ = q.slice(z);
            break
        } else {
            let w = q.slice(z, O);
            K.push(w), z = O + 1, q[z - 1] === "\r" && q[z] === `
` && z++
        }
    }
    return [K, _]
}
// @from(Ln 222246, Col 4)
Sg1
// @from(Ln 222247, Col 4)
Cg1 = L(() => {
    Sg1 = class Sg1 extends Error {
        constructor(q, K) {
            super(q), this.name = "ParseError", this.type = K.type, this.field = K.field, this.value = K.value, this.line = K.line
        }
    }
})
// @from(Ln 222255, Col 0)
function vqz(q) {
    let K = globalThis.DOMException;
    return typeof K == "function" ? new K(q, "SyntaxError") : SyntaxError(q)
}
// @from(Ln 222260, Col 0)
function Ig1(q) {
    return q instanceof Error ? "errors" in q && Array.isArray(q.errors) ? q.errors.map(Ig1).join(", ") : ("cause" in q) && q.cause instanceof Error ? `${q}: ${Ig1(q.cause)}` : q.message : `${q}`
}
// @from(Ln 222264, Col 0)
function GW4(q) {
    return {
        type: q.type,
        message: q.message,
        code: q.code,
        defaultPrevented: q.defaultPrevented,
        cancelable: q.cancelable,
        timeStamp: q.timeStamp
    }
}
// @from(Ln 222275, Col 0)
function Tqz() {
    let q = "document" in globalThis ? globalThis.document : void 0;
    return q && typeof q == "object" && "baseURI" in q && typeof q.baseURI == "string" ? q.baseURI : void 0
}
// @from(Ln 222279, Col 4)
bg1
// @from(Ln 222279, Col 9)
TW4 = (q) => {
        throw TypeError(q)
    }
// @from(Ln 222282, Col 4)
Ug1 = (q, K, _) => K.has(q) || TW4("Cannot " + _)
// @from(Ln 222283, Col 4)
Iz = (q, K, _) => (Ug1(q, K, "read from private field"), _ ? _.call(q) : K.get(q))
// @from(Ln 222284, Col 4)
rW = (q, K, _) => K.has(q) ? TW4("Cannot add the same private member more than once") : K instanceof WeakSet ? K.add(q) : K.set(q, _)
// @from(Ln 222285, Col 4)
DH = (q, K, _, z) => (Ug1(q, K, "write to private field"), K.set(q, _), _)
// @from(Ln 222286, Col 4)
Ts = (q, K, _) => (Ug1(q, K, "access private method"), _)
// @from(Ln 222287, Col 4)
Oy
// @from(Ln 222287, Col 8)
Sj6
// @from(Ln 222287, Col 13)
ky6
// @from(Ln 222287, Col 18)
ZR8
// @from(Ln 222287, Col 23)
fR8
// @from(Ln 222287, Col 28)
$e6
// @from(Ln 222287, Col 33)
yy6
// @from(Ln 222287, Col 38)
je6
// @from(Ln 222287, Col 43)
hK6
// @from(Ln 222287, Col 48)
Ny6
// @from(Ln 222287, Col 53)
Ly6
// @from(Ln 222287, Col 58)
Ey6
// @from(Ln 222287, Col 63)
Oe6
// @from(Ln 222287, Col 68)
Vp
// @from(Ln 222287, Col 72)
xg1
// @from(Ln 222287, Col 77)
ug1
// @from(Ln 222287, Col 82)
mg1
// @from(Ln 222287, Col 87)
vW4
// @from(Ln 222287, Col 92)
Bg1
// @from(Ln 222287, Col 97)
pg1
// @from(Ln 222287, Col 102)
we6
// @from(Ln 222287, Col 107)
Fg1
// @from(Ln 222287, Col 112)
gg1
// @from(Ln 222287, Col 117)
hy6
// @from(Ln 222288, Col 4)
VW4 = L(() => {
    Cg1();
    bg1 = class bg1 extends Event {
        constructor(q, K) {
            var _, z;
            super(q), this.code = (_ = K == null ? void 0 : K.code) != null ? _ : void 0, this.message = (z = K == null ? void 0 : K.message) != null ? z : void 0
        } [Symbol.for("nodejs.util.inspect.custom")](q, K, _) {
            return _(GW4(this), K)
        } [Symbol.for("Deno.customInspect")](q, K) {
            return q(GW4(this), K)
        }
    };
    hy6 = class hy6 extends EventTarget {
        constructor(q, K) {
            var _, z;
            super(), rW(this, Vp), this.CONNECTING = 0, this.OPEN = 1, this.CLOSED = 2, rW(this, Oy), rW(this, Sj6), rW(this, ky6), rW(this, ZR8), rW(this, fR8), rW(this, $e6), rW(this, yy6), rW(this, je6, null), rW(this, hK6), rW(this, Ny6), rW(this, Ly6, null), rW(this, Ey6, null), rW(this, Oe6, null), rW(this, ug1, async (Y) => {
                var A;
                Iz(this, Ny6).reset();
                let {
                    body: O,
                    redirected: w,
                    status: $,
                    headers: j
                } = Y;
                if ($ === 204) {
                    Ts(this, Vp, we6).call(this, "Server sent HTTP 204, not reconnecting", 204), this.close();
                    return
                }
                if (w ? DH(this, ky6, new URL(Y.url)) : DH(this, ky6, void 0), $ !== 200) {
                    Ts(this, Vp, we6).call(this, `Non-200 status code (${$})`, $);
                    return
                }
                if (!(j.get("content-type") || "").startsWith("text/event-stream")) {
                    Ts(this, Vp, we6).call(this, 'Invalid content type, expected "text/event-stream"', $);
                    return
                }
                if (Iz(this, Oy) === this.CLOSED) return;
                DH(this, Oy, this.OPEN);
                let H = new Event("open");
                if ((A = Iz(this, Oe6)) == null || A.call(this, H), this.dispatchEvent(H), typeof O != "object" || !O || !("getReader" in O)) {
                    Ts(this, Vp, we6).call(this, "Invalid response body, expected a web ReadableStream", $), this.close();
                    return
                }
                let J = new TextDecoder,
                    X = O.getReader(),
                    M = !0;
                do {
                    let {
                        done: P,
                        value: W
                    } = await X.read();
                    W && Iz(this, Ny6).feed(J.decode(W, {
                        stream: !P
                    })), P && (M = !1, Iz(this, Ny6).reset(), Ts(this, Vp, Fg1).call(this))
                } while (M)
            }), rW(this, mg1, (Y) => {
                DH(this, hK6, void 0), !(Y.name === "AbortError" || Y.type === "aborted") && Ts(this, Vp, Fg1).call(this, Ig1(Y))
            }), rW(this, Bg1, (Y) => {
                typeof Y.id == "string" && DH(this, je6, Y.id);
                let A = new MessageEvent(Y.event || "message", {
                    data: Y.data,
                    origin: Iz(this, ky6) ? Iz(this, ky6).origin : Iz(this, Sj6).origin,
                    lastEventId: Y.id || ""
                });
                Iz(this, Ey6) && (!Y.event || Y.event === "message") && Iz(this, Ey6).call(this, A), this.dispatchEvent(A)
            }), rW(this, pg1, (Y) => {
                DH(this, $e6, Y)
            }), rW(this, gg1, () => {
                DH(this, yy6, void 0), Iz(this, Oy) === this.CONNECTING && Ts(this, Vp, xg1).call(this)
            });
            try {
                if (q instanceof URL) DH(this, Sj6, q);
                else if (typeof q == "string") DH(this, Sj6, new URL(q, Tqz()));
                else throw Error("Invalid URL")
            } catch {
                throw vqz("An invalid or illegal string was specified")
            }
            DH(this, Ny6, DR8({
                onEvent: Iz(this, Bg1),
                onRetry: Iz(this, pg1)
            })), DH(this, Oy, this.CONNECTING), DH(this, $e6, 3000), DH(this, fR8, (_ = K == null ? void 0 : K.fetch) != null ? _ : globalThis.fetch), DH(this, ZR8, (z = K == null ? void 0 : K.withCredentials) != null ? z : !1), Ts(this, Vp, xg1).call(this)
        }
        get readyState() {
            return Iz(this, Oy)
        }
        get url() {
            return Iz(this, Sj6).href
        }
        get withCredentials() {
            return Iz(this, ZR8)
        }
        get onerror() {
            return Iz(this, Ly6)
        }
        set onerror(q) {
            DH(this, Ly6, q)
        }
        get onmessage() {
            return Iz(this, Ey6)
        }
        set onmessage(q) {
            DH(this, Ey6, q)
        }
        get onopen() {
            return Iz(this, Oe6)
        }
        set onopen(q) {
            DH(this, Oe6, q)
        }
        addEventListener(q, K, _) {
            let z = K;
            super.addEventListener(q, z, _)
        }
        removeEventListener(q, K, _) {
            let z = K;
            super.removeEventListener(q, z, _)
        }
        close() {
            Iz(this, yy6) && clearTimeout(Iz(this, yy6)), Iz(this, Oy) !== this.CLOSED && (Iz(this, hK6) && Iz(this, hK6).abort(), DH(this, Oy, this.CLOSED), DH(this, hK6, void 0))
        }
    };
    Oy = new WeakMap, Sj6 = new WeakMap, ky6 = new WeakMap, ZR8 = new WeakMap, fR8 = new WeakMap, $e6 = new WeakMap, yy6 = new WeakMap, je6 = new WeakMap, hK6 = new WeakMap, Ny6 = new WeakMap, Ly6 = new WeakMap, Ey6 = new WeakMap, Oe6 = new WeakMap, Vp = new WeakSet, xg1 = function() {
        DH(this, Oy, this.CONNECTING), DH(this, hK6, new AbortController), Iz(this, fR8)(Iz(this, Sj6), Ts(this, Vp, vW4).call(this)).then(Iz(this, ug1)).catch(Iz(this, mg1))
    }, ug1 = new WeakMap, mg1 = new WeakMap, vW4 = function() {
        var q;
        let K = {
            mode: "cors",
            redirect: "follow",
            headers: {
                Accept: "text/event-stream",
                ...Iz(this, je6) ? {
                    "Last-Event-ID": Iz(this, je6)
                } : void 0
            },
            cache: "no-store",
            signal: (q = Iz(this, hK6)) == null ? void 0 : q.signal
        };
        return "window" in globalThis && (K.credentials = this.withCredentials ? "include" : "same-origin"), K
    }, Bg1 = new WeakMap, pg1 = new WeakMap, we6 = function(q, K) {
        var _;
        Iz(this, Oy) !== this.CLOSED && DH(this, Oy, this.CLOSED);
        let z = new bg1("error", {
            code: K,
            message: q
        });
        (_ = Iz(this, Ly6)) == null || _.call(this, z), this.dispatchEvent(z)
    }, Fg1 = function(q, K) {
        var _;
        if (Iz(this, Oy) === this.CLOSED) return;
        DH(this, Oy, this.CONNECTING);
        let z = new bg1("error", {
            code: K,
            message: q
        });
        (_ = Iz(this, Ly6)) == null || _.call(this, z), this.dispatchEvent(z), DH(this, yy6, setTimeout(Iz(this, gg1), Iz(this, $e6)))
    }, gg1 = new WeakMap, hy6.CONNECTING = 0, hy6.OPEN = 1, hy6.CLOSED = 2
})
// @from(Ln 222446, Col 0)
function Ry6(q) {
    if (!q) return {};
    if (q instanceof Headers) return Object.fromEntries(q.entries());
    if (Array.isArray(q)) return Object.fromEntries(q);
    return {
        ...q
    }
}
// @from(Ln 222455, Col 0)
function Cj6(q = fetch, K) {
    if (!K) return q;
    return async (_, z) => {
        let Y = {
            ...K,
            ...z,
            headers: z?.headers ? {
                ...Ry6(K.headers),
                ...Ry6(z.headers)
            } : K.headers
        };
        return q(_, Y)
    }
}
// @from(Ln 222469, Col 0)
async function Vqz(q) {
    return (await Qg1).getRandomValues(new Uint8Array(q))
}
// @from(Ln 222472, Col 0)
async function kqz(q) {
    let _ = "",
        z = await Vqz(q);
    for (let Y = 0; Y < q; Y++) {
        let A = z[Y] % 66;
        _ += "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~" [A]
    }
    return _
}
// @from(Ln 222481, Col 0)
async function Nqz(q) {
    return await kqz(q)
}
// @from(Ln 222484, Col 0)
async function Eqz(q) {
    let K = await (await Qg1).subtle.digest("SHA-256", new TextEncoder().encode(q));
    return btoa(String.fromCharCode(...new Uint8Array(K))).replace(/\//g, "_").replace(/\+/g, "-").replace(/=/g, "")
}
// @from(Ln 222488, Col 0)
async function dg1(q) {
    if (!q) q = 43;
    if (q < 43 || q > 128) throw `Expected a length between 43 and 128. Received ${q}.`;
    let K = await Nqz(q),
        _ = await Eqz(K);
    return {
        code_verifier: K,
        code_challenge: _
    }
}
// @from(Ln 222498, Col 4)
Qg1
// @from(Ln 222499, Col 4)
kW4 = L(() => {
    Qg1 = globalThis.crypto?.webcrypto ?? globalThis.crypto ?? import("node:crypto").then((q) => q.webcrypto)
})
// @from(Ln 222502, Col 4)
bf
// @from(Ln 222502, Col 8)
EW4
// @from(Ln 222502, Col 13)
He6
// @from(Ln 222502, Col 18)
yqz
// @from(Ln 222502, Col 23)
GR8
// @from(Ln 222502, Col 28)
vR8
// @from(Ln 222502, Col 33)
TR8
// @from(Ln 222502, Col 38)
NW4
// @from(Ln 222502, Col 43)
Lqz
// @from(Ln 222502, Col 48)
hqz
// @from(Ln 222502, Col 53)
yW4
// @from(Ln 222502, Col 58)
f0w
// @from(Ln 222502, Col 63)
G0w