
// @from(Ln 364846, Col 4)
GV1 = w(() => {
  KU();
  pV();
  PK1();
  vq0();
  c3();
  V2();
  DQ();
  Hd2 = /^-[a-zA-Z0-9_-]/, tK1 = {
    "--all": "none",
    "--branches": "none",
    "--tags": "none",
    "--remotes": "none"
  }, iq0 = {
    "--since": "string",
    "--after": "string",
    "--until": "string",
    "--before": "string"
  }, eK1 = {
    "--oneline": "none",
    "--graph": "none",
    "--decorate": "none",
    "--no-decorate": "none",
    "--date": "string",
    "--relative-date": "none"
  }, nq0 = {
    "--max-count": "number",
    "-n": "number"
  }, aq0 = {
    "--stat": "none",
    "--numstat": "none",
    "--shortstat": "none",
    "--name-only": "none",
    "--name-status": "none"
  }, AV1 = {
    "--color": "none",
    "--no-color": "none"
  }, Ed2 = {
    "--patch": "none",
    "-p": "none",
    "--no-patch": "none",
    "--no-ext-diff": "none",
    "-s": "none"
  }, zd2 = {
    "--author": "string",
    "--committer": "string",
    "--grep": "string"
  }, $d2 = {
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
        ...aq0,
        ...AV1,
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
        ...eK1,
        ...tK1,
        ...iq0,
        ...nq0,
        ...aq0,
        ...AV1,
        ...Ed2,
        ...zd2,
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
        ...eK1,
        ...aq0,
        ...AV1,
        ...Ed2,
        "--abbrev-commit": "none",
        "--word-diff": "none",
        "--word-diff-regex": "string",
        "--color-words": "none",
        "--pretty": "string",
        "--first-parent": "none",
        "--diff-filter": "string",
        "-m": "none",
        "--quiet": "none"
      }
    },
    "git shortlog": {
      safeFlags: {
        ...tK1,
        ...iq0,
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
        ...eK1,
        ...tK1,
        ...iq0,
        ...nq0,
        ...zd2
      }
    },
    "git stash list": {
      safeFlags: {
        ...eK1,
        ...tK1,
        ...nq0
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
        ...AV1,
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
        let Q = A.split(/\s+/),
          B = new Set(["--contains", "--no-contains", "--points-at", "--sort", "--abbrev"]),
          G = new Set(["--merged", "--no-merged"]),
          Z = 2,
          Y = "";
        while (Z < Q.length) {
          let J = Q[Z];
          if (!J) {
            Z++;
            continue
          }
          if (J.startsWith("-"))
            if (J.includes("=")) Y = J.split("=")[0] || "", Z++;
            else if (B.has(J)) Y = J, Z += 2;
          else Y = J, Z++;
          else {
            let X = Q.slice(2, Z),
              I = X.includes("-l") || X.includes("--list"),
              D = G.has(Y);
            if (!I && !D) return !0;
            Z++
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
      additionalCommandIsDangerousCallback: (A) => !yq0(A)
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
        let Q = bY(A, (Y) => `$${Y}`);
        if (!Q.success) return !0;
        let B = Q.tokens.map((Y) => {
            if (typeof Y === "string") return Y;
            if ("pattern" in Y) return Y.pattern;
            return
          }).filter((Y) => Y !== void 0),
          G = new Set(["-d", "--date", "-r", "--reference", "--iso-8601", "--rfc-3339"]),
          Z = 1;
        while (Z < B.length) {
          let Y = B[Z];
          if (Y.startsWith("--") && Y.includes("=")) Z++;
          else if (Y.startsWith("-"))
            if (G.has(Y)) Z += 2;
            else Z++;
          else {
            if (!Y.startsWith("+")) return !0;
            Z++
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
    }
  }, Xa5 = ["echo", "printf", "wc", "grep", "head", "tail"];
  Wa5 = ["cal", "uptime", "cat", "head", "tail", "wc", "stat", "strings", "hexdump", "od", "nl", "id", "uname", "free", "df", "du", "locale", "groups", "nproc", "docker ps", "docker images", "basename", "dirname", "realpath", "cut", "paste", "tr", "column", "diff", "true", "false", "sleep", "which", "type"], Ka5 = new Set([...Wa5.map(Da5), /^echo(?:\s+(?:'[^']*'|"[^"$<>\n\r]*"|[^|;&`$(){}><#\\!"'\s]+))*(?:\s+2>&1)?\s*$/, /^claude -h$/, /^claude --help$/, /^uniq(?:\s+(?:-[a-zA-Z]+|--[a-zA-Z-]+(?:=\S+)?|-[fsw]\s+\d+))*(?:\s|$)\s*$/, /^pwd$/, /^whoami$/, /^node -v$/, /^npm -v$/, /^python --version$/, /^python3 --version$/, /^tree$/, /^history(?:\s+\d+)?\s*$/, /^alias$/, /^arch(?:\s+(?:--help|-h))?\s*$/, /^ip addr$/, /^ifconfig(?:\s+[a-zA-Z][a-zA-Z0-9_-]*)?\s*$/, /^jq(?!\s+.*(?:-f\b|--from-file|--rawfile|--slurpfile|--run-tests|-L\b|--library-path|\benv\b|\$ENV\b))(?:\s+(?:-[a-zA-Z]+|--[a-zA-Z-]+(?:=\S+)?))*(?:\s+'[^'`]*'|\s+"[^"`]*"|\s+[^-\s'"][^\s]*)+\s*$/, /^cd(?:\s+(?:'[^']*'|"[^"]*"|[^\s;|&`$(){}><#\\]+))?$/, /^ls(?:\s+[^<>()$`|{}&;\n\r]*)?$/, /^find(?:\s+(?:\\[()]|(?!-delete\b|-exec\b|-execdir\b|-ok\b|-okdir\b|-fprint0?\b|-fls\b|-fprintf\b)[^<>()$`|{}&;\n\r\s]|\s)+)?$/])
})
// @from(Ln 365885, Col 0)
function Ua5(A) {
  let Q = Na5(A),
    B = Ca5.get(Q);
  return B !== void 0 ? B : $a5
}
// @from(Ln 365891, Col 0)
function qa5(A) {
  return A.trim().split(/\s+/)[0] || ""
}
// @from(Ln 365895, Col 0)
function Na5(A) {
  let Q = FK(A),
    B = Q[Q.length - 1] || A;
  return qa5(B)
}
// @from(Ln 365901, Col 0)
function Ud2(A, Q, B, G) {
  let Y = Ua5(A)(Q, B, G);
  return {
    isError: Y.isError,
    message: Y.message
  }
}
// @from(Ln 365908, Col 4)
$a5 = (A, Q, B) => ({
    isError: A !== 0,
    message: A !== 0 ? `Command failed with exit code ${A}` : void 0
  })
// @from(Ln 365912, Col 2)
Ca5
// @from(Ln 365913, Col 4)
qd2 = w(() => {
  KU();
  Ca5 = new Map([
    ["grep", (A, Q, B) => ({
      isError: A >= 2,
      message: A === 1 ? "No matches found" : void 0
    })],
    ["rg", (A, Q, B) => ({
      isError: A >= 2,
      message: A === 1 ? "No matches found" : void 0
    })],
    ["find", (A, Q, B) => ({
      isError: A >= 2,
      message: A === 1 ? "Some directories were inaccessible" : void 0
    })],
    ["diff", (A, Q, B) => ({
      isError: A >= 2,
      message: A === 1 ? "Files differ" : void 0
    })],
    ["test", (A, Q, B) => ({
      isError: A >= 2,
      message: A === 1 ? "Condition is false" : void 0
    })],
    ["[", (A, Q, B) => ({
      isError: A >= 2,
      message: A === 1 ? "Condition is false" : void 0
    })]
  ])
})
// @from(Ln 365950, Col 0)
function ja5(A) {
  let Q;
  try {
    Q = ZfA(A)
  } catch {
    return {
      isSearch: !1,
      isRead: !1
    }
  }
  if (Q.length === 0) return {
    isSearch: !1,
    isRead: !1
  };
  let B = !1,
    G = !1,
    Z = null,
    Y = !1,
    J = !1;
  for (let X of Q) {
    if (J) {
      J = !1;
      continue
    }
    if (X === ">" || X === ">>" || X === ">&") {
      J = !0;
      continue
    }
    if (X === "||" || X === "&&" || X === "|" || X === ";") {
      Z = X;
      continue
    }
    let I = X.trim().split(/\s+/)[0];
    if (!I) continue;
    let D = Ma5.has(I),
      W = Ra5.has(I),
      K = _a5.has(I);
    if (Z === "||" && K) continue;
    if (Y = !0, !D && !W) return {
      isSearch: !1,
      isRead: !1
    };
    if (D) B = !0;
    if (W) G = !0
  }
  if (!Y) return {
    isSearch: !1,
    isRead: !1
  };
  return {
    isSearch: B,
    isRead: G
  }
}
// @from(Ln 366005, Col 0)
function Ld2(A) {
  let Q = FK(A);
  if (Q.length === 0) return "other";
  for (let B of Q) {
    let G = B.split(" ")[0] || "";
    if (Pa5.includes(G)) return G
  }
  return "other"
}
// @from(Ln 366015, Col 0)
function Sa5(A, Q) {
  if (Q !== 0) return;
  if (A.match(/\bgit\s+commit\b/)) {
    if (l("tengu_git_operation", {
        operation: "commit"
      }), A.match(/--amend\b/)) l("tengu_git_operation", {
      operation: "commit_amend"
    });
    hb0()?.add(1), T9("git-commits")
  }
  if (A.match(/\bgh\s+pr\s+create\b/)) l("tengu_git_operation", {
    operation: "pr_create"
  }), eU1()?.add(1), T9("pr-creation");
  if (A.match(/\bglab\s+mr\s+create\b/)) l("tengu_git_operation", {
    operation: "pr_create"
  }), eU1()?.add(1), T9("pr-creation");
  if (A.match(/\bgit\s+(checkout|branch|switch)\b/)) T9("branch-management")
}
// @from(Ln 366034, Col 0)
function xa5(A) {
  let Q = FK(A);
  if (Q.length === 0) return !0;
  let B = Q[0]?.trim();
  if (!B) return !0;
  return !Ta5.includes(B)
}
// @from(Ln 366042, Col 0)
function ya5(A) {
  let B = jQ().sandbox?.excludedCommands ?? [];
  if (B.length === 0) return !1;
  for (let G of B) {
    let Z = gq0(G);
    switch (Z.type) {
      case "exact":
        if (A.trim() === Z.command) return !0;
        break;
      case "prefix": {
        let Y = A.trim();
        if (Y === Z.prefix || Y.startsWith(Z.prefix + " ")) return !0;
        break
      }
      case "wildcard":
        if (hq0(Z.pattern, A.trim())) return !0;
        break
    }
  }
  return !1
}
// @from(Ln 366064, Col 0)
function KEA(A) {
  if (!XB.isSandboxingEnabled()) return !1;
  if (A.dangerouslyDisableSandbox && XB.areUnsandboxedCommandsAllowed()) return !1;
  if (!A.command) return !1;
  if (ya5(A.command)) return !1;
  return !0
}
// @from(Ln 366071, Col 0)
async function va5(A, Q, B) {
  let {
    filePath: G,
    newContent: Z
  } = A, Y = Y4(G), J = vA();
  if (!J.existsSync(Y)) return {
    data: {
      stdout: "",
      stderr: `sed: ${G}: No such file or directory
Exit code 1`,
      interrupted: !1
    }
  };
  let X = RW(Y),
    I = J.readFileSync(Y, {
      encoding: X
    });
  if (vG() && B) await ps(Q.updateFileHistoryState, Y, B.uuid);
  let D = _c(Y);
  return ns(Y, Z, X, D), ds(Y, I, Z), Q.readFileState.set(Y, {
    content: Z,
    timestamp: mz(Y),
    offset: void 0,
    limit: void 0
  }), {
    data: {
      stdout: "",
      stderr: "",
      interrupted: !1
    }
  }
}
// @from(Ln 366103, Col 0)
async function* ka5({
  input: A,
  abortController: Q,
  setAppState: B,
  setToolJSX: G,
  preventCwdChanges: Z
}) {
  let {
    command: Y,
    description: J,
    timeout: X,
    shellExecutable: I,
    run_in_background: D
  } = A, W = X || CKA(), K = "", V = "", F = 0, H = void 0, E = !ZV1 && xa5(Y), z = await e51(Y, Q.signal, W, I, (x, b, S) => {
    V = x, K = b, F = S
  }, Z, KEA(A), E), $ = z.result;
  async function O() {
    return (await es.spawn({
      command: Y,
      description: J || Y,
      shellCommand: z
    }, {
      abortController: Q,
      getAppState: async () => {
        throw Error("getAppState not available in runShellCommand context")
      },
      setAppState: B
    })).taskId
  }

  function L(x, b) {
    O().then((S) => {
      if (H = S, l(x, {
          command_type: Ld2(Y)
        }), b) b(S)
    })
  }
  if (z.onTimeout && E) z.onTimeout((x) => {
    L("tengu_bash_command_timeout_backgrounded", x)
  });
  if (D === !0 && !ZV1) {
    let x = await O();
    return l("tengu_bash_command_explicitly_backgrounded", {
      command_type: Ld2(Y)
    }), {
      stdout: "",
      stderr: "",
      code: 0,
      interrupted: !1,
      backgroundTaskId: x
    }
  }
  let M = Date.now(),
    _ = M + Nd2,
    j = void 0;
  while (!0) {
    let x = Date.now(),
      b = Math.max(0, _ - x),
      S = await Promise.race([$, new Promise((AA) => setTimeout(() => AA(null), b))]);
    if (S !== null) {
      if (j) Km2(j, B);
      return S
    }
    if (H) return {
      stdout: "",
      stderr: "",
      code: 0,
      interrupted: !1,
      backgroundTaskId: H
    };
    if (j) {
      if (z.status === "backgrounded") return {
        stdout: "",
        stderr: "",
        code: 0,
        interrupted: !1,
        backgroundTaskId: j,
        backgroundedByUser: !0
      }
    }
    let u = Date.now() - M,
      f = Math.floor(u / 1000);
    if (!ZV1 && H === void 0 && f >= Nd2 / 1000 && G) {
      if (!j) j = Dm2({
        command: Y,
        description: J || Y,
        shellCommand: z
      }, B);
      G({
        jsx: oq0.createElement(yD1, null),
        shouldHidePromptInput: !1,
        shouldContinueAnimation: !0,
        showSpinner: !0
      })
    }
    yield {
      type: "progress",
      fullOutput: K,
      output: V,
      elapsedTimeSeconds: f,
      totalLines: F
    }, _ = Date.now() + Oa5
  }
}
// @from(Ln 366207, Col 0)
async function ba5(A, Q, B) {
  try {
    let G = AQ(A),
      {
        content: Z,
        type: Y,
        schema: J
      } = await sq0(G, B.tool, B.server),
      X = await ixA(Z),
      I = Array.isArray(Z) && Z.some((z) => z.type === "image");
    if (!X || I) {
      if (Array.isArray(Z)) return {
        stdout: fA2(Z),
        structuredContent: Z,
        rawOutputPath: void 0
      };
      else if (typeof Z === "string") return {
        stdout: Z,
        structuredContent: void 0,
        rawOutputPath: void 0
      };
      return null
    }
    let D = typeof Z === "string" ? Z : eA(Z, null, 2),
      W = Date.now(),
      V = `mcp-cli-${Q.replace(/[^a-zA-Z0-9_-]/g,"_").slice(0,30)}-${W}`,
      F = await Z4A(D, V);
    if (Y4A(F)) return null;
    let H = QZ1(Y, J);
    return {
      stdout: BZ1(F.filepath, F.originalSize, H, dSA()),
      structuredContent: void 0,
      rawOutputPath: F.filepath
    }
  } catch (G) {
    return e(G), null
  }
}
// @from(Ln 366245, Col 4)
oq0
// @from(Ln 366245, Col 9)
Nd2 = 2000
// @from(Ln 366246, Col 2)
Oa5 = 1000
// @from(Ln 366247, Col 2)
Ma5
// @from(Ln 366247, Col 7)
Ra5
// @from(Ln 366247, Col 12)
_a5
// @from(Ln 366247, Col 17)
Ta5
// @from(Ln 366247, Col 22)
ZV1
// @from(Ln 366247, Col 27)
wd2
// @from(Ln 366247, Col 32)
YV1
// @from(Ln 366247, Col 37)
Pa5
// @from(Ln 366247, Col 42)
rq0
// @from(Ln 366247, Col 47)
o2
// @from(Ln 366248, Col 4)
YK = w(() => {
  j9();
  KU();
  v1();
  iZ();
  Ib();
  V2();
  fQ();
  T_();
  v6A();
  cC();
  cSA();
  ikA();
  n$0();
  NJ();
  pC();
  qKA();
  gX0();
  wr();
  nK1();
  GV1();
  w6();
  Z0();
  C0();
  JZ();
  jN();
  AZ1();
  GB();
  iX0();
  XX();
  qd2();
  cSA();
  gz0();
  Vb();
  $F();
  A0();
  y9();
  DQ();
  oN();
  OHA();
  oZ();
  oq0 = c(QA(), 1), Ma5 = new Set(["find", "grep", "rg", "ag", "ack", "locate", "which", "whereis"]), Ra5 = new Set(["cat", "head", "tail", "less", "more", "wc", "stat", "file", "strings", "ls", "tree", "du"]), _a5 = new Set(["echo", "true", "false", ":"]);
  Ta5 = ["sleep"], ZV1 = a1(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS), wd2 = m.strictObject({
    command: m.string().describe("The command to execute"),
    timeout: m.number().optional().describe(`Optional timeout in milliseconds (max ${a51()})`),
    description: m.string().optional().describe(`Clear, concise description of what this command does in active voice. Never use words like "complex" or "risk" in the description - just describe what it does.

For simple commands (git, npm, standard CLI tools), keep it brief (5-10 words):
- ls → "List files in current directory"
- git status → "Show working tree status"
- npm install → "Install package dependencies"

For commands that are harder to parse at a glance (piped commands, obscure flags, etc.), add enough context to clarify what it does:
- find . -name "*.tmp" -exec rm {} \\; → "Find and delete all .tmp files recursively"
- git reset --hard origin/main → "Discard all local changes and match remote main"
- curl -s url | jq '.data[]' → "Fetch JSON from URL and extract data array elements"`),
    run_in_background: m.boolean().optional().describe("Set to true to run this command in the background. Use TaskOutput to read the output later."),
    dangerouslyDisableSandbox: m.boolean().optional().describe("Set this to true to dangerously override sandbox mode and run commands without sandboxing."),
    _simulatedSedEdit: m.object({
      filePath: m.string(),
      newContent: m.string()
    }).optional().describe("Internal: pre-computed sed edit result from preview")
  }), YV1 = ZV1 ? wd2.omit({
    run_in_background: !0
  }) : wd2, Pa5 = ["npm", "yarn", "pnpm", "node", "python", "python3", "go", "cargo", "make", "docker", "terraform", "webpack", "vite", "jest", "pytest", "curl", "wget", "build", "test", "serve", "watch", "dev"];
  rq0 = m.object({
    stdout: m.string().describe("The standard output of the command"),
    stderr: m.string().describe("The standard error output of the command"),
    rawOutputPath: m.string().optional().describe("Path to raw output file for large MCP tool outputs"),
    interrupted: m.boolean().describe("Whether the command was interrupted"),
    isImage: m.boolean().optional().describe("Flag to indicate if stdout contains image data"),
    backgroundTaskId: m.string().optional().describe("ID of the background task if command is running in background"),
    backgroundedByUser: m.boolean().optional().describe("True if the user manually backgrounded the command with Ctrl+B"),
    dangerouslyDisableSandbox: m.boolean().optional().describe("Flag to indicate if sandbox mode was overridden"),
    returnCodeInterpretation: m.string().optional().describe("Semantic interpretation for non-error exit codes with special meaning"),
    structuredContent: m.array(m.any()).optional().describe("Structured content blocks from mcp-cli commands")
  });
  o2 = {
    name: X9,
    maxResultSizeChars: 30000,
    strict: !0,
    async description({
      description: A
    }) {
      return A || "Run shell command"
    },
    async prompt() {
      return XA2()
    },
    isConcurrencySafe(A) {
      return this.isReadOnly(A)
    },
    isReadOnly(A) {
      let Q = JV1(A.command);
      return BV1(A, Q).behavior === "allow"
    },
    isSearchOrReadCommand(A) {
      let Q = YV1.safeParse(A);
      if (!Q.success) return {
        isSearch: !1,
        isRead: !1
      };
      return ja5(Q.data.command)
    },
    inputSchema: YV1,
    outputSchema: rq0,
    userFacingName(A) {
      if (!A) return "Bash";
      if (A.command) {
        let Q = HHA(A.command);
        if (Q) return CW1({
          file_path: Q.filePath,
          old_string: "x"
        })
      }
      return KEA(A) && a1(process.env.CLAUDE_CODE_BASH_SANDBOX_SHOW_INDICATOR) ? "SandboxedBash" : "Bash"
    },
    getToolUseSummary(A) {
      if (!A?.command) return null;
      let {
        command: Q,
        description: B
      } = A;
      if (B) return B;
      return YG(Q, Mb)
    },
    isEnabled() {
      return !0
    },
    async checkPermissions(A, Q) {
      return await dq0(A, Q)
    },
    renderToolUseMessage: xP2,
    renderToolUseTag: yP2,
    renderToolUseRejectedMessage: vP2,
    renderToolUseProgressMessage: kP2,
    renderToolUseQueuedMessage: bP2,
    renderToolResultMessage: fP2,
    mapToolResultToToolResultBlockParam({
      interrupted: A,
      stdout: Q,
      stderr: B,
      isImage: G,
      backgroundTaskId: Z,
      backgroundedByUser: Y,
      structuredContent: J
    }, X) {
      if (J && J.length > 0) return {
        tool_use_id: X,
        type: "tool_result",
        content: J
      };
      if (G) {
        let K = Q.trim().match(/^data:([^;]+);base64,(.+)$/);
        if (K) {
          let V = K[1],
            F = K[2];
          return {
            tool_use_id: X,
            type: "tool_result",
            content: [{
              type: "image",
              source: {
                type: "base64",
                media_type: V || "image/jpeg",
                data: F || ""
              }
            }]
          }
        }
      }
      let I = Q;
      if (Q) I = Q.replace(/^(\s*\n)+/, ""), I = I.trimEnd();
      let D = B.trim();
      if (A) {
        if (B) D += IfA;
        D += "<error>Command was aborted before completion</error>"
      }
      let W = Z ? `Command ${Y?"was manually backgrounded by user":"running in background"} with ID: ${Z}. Output is being written to: ${aY(Z)}` : "";
      return {
        tool_use_id: X,
        type: "tool_result",
        content: [I, D, W].filter(Boolean).join(`
`),
        is_error: A
      }
    },
    async call(A, Q, B, G, Z) {
      if (A._simulatedSedEdit) return await va5(A._simulatedSedEdit, Q, G);
      let {
        abortController: Y,
        readFileState: J,
        getAppState: X,
        setAppState: I,
        setToolJSX: D
      } = Q, W = new UKA, K = new UKA, V, F = 0, H = !1, E, $ = !!Q.agentId;
      try {
        let GA = ka5({
            input: A,
            abortController: Y,
            setAppState: I,
            setToolJSX: D,
            preventCwdChanges: $
          }),
          WA;
        do
          if (WA = await GA.next(), !WA.done && Z) {
            let TA = WA.value;
            Z({
              toolUseID: `bash-progress-${F++}`,
              data: {
                type: "bash_progress",
                output: TA.output,
                fullOutput: TA.fullOutput,
                elapsedTimeSeconds: TA.elapsedTimeSeconds,
                totalLines: TA.totalLines
              }
            })
          } while (!WA.done);
        if (E = WA.value, Sa5(A.command, E.code), W.append((E.stdout || "").trimEnd() + IfA), V = Ud2(A.command, E.code, E.stdout || "", E.stderr || ""), E.stderr && E.stderr.includes(".git/index.lock': File exists")) l("tengu_git_index_lock_error", {});
        if (V.isError) {
          if (K.append(E.stderr.trimEnd() + IfA), E.code !== 0) K.append(`Exit code ${E.code}`)
        } else if (e6A(A.command) !== null) K.append(E.stderr.trimEnd() + IfA);
        else W.append(E.stderr.trimEnd() + IfA);
        if (!$) {
          let TA = await X();
          if (B71(TA.toolPermissionContext)) {
            let bA = K.toString();
            K.clear(), K.append(Q71(bA))
          }
        }
        let MA = XB.annotateStderrWithSandboxFailures(A.command, E.stderr || "");
        if (V.isError) throw new ay(E.stdout, MA, E.code, E.interrupted);
        H = E.interrupted
      } finally {
        if (D) D(null)
      }
      let O = W.toString(),
        L = K.toString();
      {
        let GA = c9();
        bA2(A.command, O, GA.signal, Q.options.isNonInteractiveSession).then(async (WA) => {
          for (let MA of WA) {
            let TA = wa5(MA) ? MA : La5(o1(), MA);
            try {
              if (!(await v5.validateInput({
                  file_path: TA
                }, Q)).result) {
                J.delete(TA);
                continue
              }
              await v5.call({
                file_path: TA
              }, Q)
            } catch (bA) {
              J.delete(TA), e(bA)
            }
          }
          l("tengu_bash_tool_haiku_file_paths_read", {
            filePathsExtracted: WA.length,
            readFileStateSize: J.size,
            readFileStateValuesCharLength: FS(J).reduce((MA, TA) => {
              let bA = J.get(TA);
              return MA + (bA?.content.length || 0)
            }, 0)
          })
        }).catch((WA) => {
          if (WA instanceof Error && WA.message.includes("Request was aborted")) return;
          e(WA)
        })
      }
      let M = A.command.split(" ")[0];
      l("tengu_bash_tool_command_executed", {
        command_type: M,
        stdout_length: O.length,
        stderr_length: L.length,
        exit_code: E.code,
        interrupted: H
      });
      let _ = N42(A.command);
      if (_) l("tengu_code_indexing_tool_used", {
        tool: _,
        source: "cli",
        success: E.code === 0
      });
      let j = oZ0(O),
        x = oZ0(L),
        b = rZ0(j),
        S = void 0,
        u = j,
        f = x,
        AA = void 0,
        n = e6A(A.command);
      if (n !== null) {
        let GA = await ba5(O, A.command, n);
        if (GA !== null) u = GA.stdout, AA = GA.structuredContent, S = GA.rawOutputPath
      }
      let y = u;
      if (b) {
        let GA = u.trim().match(/^data:([^;]+);base64,(.+)$/);
        if (GA && GA[1] && GA[2]) {
          let WA = GA[1],
            MA = GA[2],
            TA = Buffer.from(MA, "base64"),
            bA = await x9A(TA, void 0, WA);
          y = `data:${bA.mediaType};base64,${bA.base64}`
        }
      }
      return {
        data: {
          stdout: y,
          stderr: f,
          rawOutputPath: S,
          interrupted: H,
          isImage: b,
          returnCodeInterpretation: V?.message,
          backgroundTaskId: E.backgroundTaskId,
          backgroundedByUser: E.backgroundedByUser,
          structuredContent: AA,
          dangerouslyDisableSandbox: "dangerouslyDisableSandbox" in A ? A.dangerouslyDisableSandbox : void 0
        }
      }
    },
    renderToolUseErrorMessage: hP2
  }
})
// @from(Ln 366577, Col 0)
async function Ct(A, Q, B) {
  let G = A;
  return await Promise.all([...A.matchAll(ha5), ...A.matchAll(ga5)].map(async (Z) => {
    let Y = Z[1]?.trim();
    if (Y) try {
      let J = await B$(o2, {
        command: Y
      }, Q, QU({
        content: []
      }), "");
      if (J.behavior !== "allow") throw k(`Bash command permission check failed for command in ${B}: ${Y}. Error: ${J.message}`), new ny(`Bash command permission check failed for pattern "${Z[0]}": ${J.message||"Permission denied"}`);
      let {
        data: X
      } = await o2.call({
        command: Y
      }, Q), I = await YZ1(o2, X, fa5()), D = typeof I.content === "string" ? I.content : Od2(X.stdout, X.stderr);
      G = G.replace(Z[0], D)
    } catch (J) {
      if (J instanceof ny) throw J;
      ua5(J, Z[0])
    }
  })), G
}
// @from(Ln 366601, Col 0)
function Od2(A, Q, B = !1) {
  let G = [];
  if (A.trim()) G.push(A.trim());
  if (Q.trim())
    if (B) G.push(`[stderr: ${Q.trim()}]`);
    else G.push(`[stderr]
${Q.trim()}`);
  return G.join(B ? " " : `
`)
}
// @from(Ln 366612, Col 0)
function ua5(A, Q, B = !1) {
  if (A instanceof ay) {
    if (A.interrupted) throw new ny(`Bash command interrupted for pattern "${Q}": [Command interrupted]`);
    let Y = Od2(A.stdout, A.stderr, B);
    throw new ny(`Bash command failed for pattern "${Q}": ${Y}`)
  }
  let G = A instanceof Error ? A.message : String(A),
    Z = B ? `[Error: ${G}]` : `[Error]
${G}`;
  throw new ny(Z)
}
// @from(Ln 366623, Col 4)
ha5
// @from(Ln 366623, Col 9)
ga5
// @from(Ln 366624, Col 4)
VEA = w(() => {
  YK();
  XX();
  T1();
  YZ();
  tQ();
  wr();
  ha5 = /```!\s*\n?([\s\S]*?)\n?```/g, ga5 = /(?<!\w|\$)!`([^`]+)`/g
})
// @from(Ln 366633, Col 4)
Md2
// @from(Ln 366633, Col 9)
ma5
// @from(Ln 366633, Col 14)
da5
// @from(Ln 366633, Col 19)
ca5
// @from(Ln 366633, Col 24)
pa5
// @from(Ln 366633, Col 29)
la5
// @from(Ln 366633, Col 34)
ia5
// @from(Ln 366633, Col 39)
na5
// @from(Ln 366633, Col 44)
aa5
// @from(Ln 366633, Col 49)
oa5
// @from(Ln 366633, Col 54)
OYY
// @from(Ln 366633, Col 59)
XV1
// @from(Ln 366633, Col 64)
MYY
// @from(Ln 366634, Col 4)
DfA = w(() => {
  f01();
  Md2 = fL({
    command: oQ(),
    args: dI(oQ()).optional(),
    env: $P(oQ(), oQ()).optional()
  }), ma5 = fL({
    name: oQ(),
    email: oQ().email().optional(),
    url: oQ().url().optional()
  }), da5 = fL({
    type: oQ(),
    url: oQ().url()
  }), ca5 = Md2.partial(), pa5 = Md2.extend({
    platform_overrides: $P(oQ(), ca5).optional()
  }), la5 = fL({
    type: CP(["python", "node", "binary"]),
    entry_point: oQ(),
    mcp_config: pa5
  }), ia5 = fL({
    claude_desktop: oQ().optional(),
    platforms: dI(CP(["darwin", "win32", "linux"])).optional(),
    runtimes: fL({
      python: oQ().optional(),
      node: oQ().optional()
    }).optional()
  }).passthrough(), na5 = fL({
    name: oQ(),
    description: oQ().optional()
  }), aa5 = fL({
    name: oQ(),
    description: oQ().optional(),
    arguments: dI(oQ()).optional(),
    text: oQ()
  }), oa5 = fL({
    type: CP(["string", "number", "boolean", "directory", "file"]),
    title: oQ(),
    description: oQ(),
    required: ZF().optional(),
    default: IBA([oQ(), pR(), ZF(), dI(oQ())]).optional(),
    multiple: ZF().optional(),
    sensitive: ZF().optional(),
    min: pR().optional(),
    max: pR().optional()
  }), OYY = $P(oQ(), IBA([oQ(), pR(), ZF(), dI(oQ())])), XV1 = fL({
    $schema: oQ().optional(),
    dxt_version: oQ().optional().describe("@deprecated Use manifest_version instead"),
    manifest_version: oQ().optional(),
    name: oQ(),
    display_name: oQ().optional(),
    version: oQ(),
    description: oQ(),
    long_description: oQ().optional(),
    author: ma5,
    repository: da5.optional(),
    homepage: oQ().url().optional(),
    documentation: oQ().url().optional(),
    support: oQ().url().optional(),
    icon: oQ().optional(),
    screenshots: dI(oQ()).optional(),
    server: la5,
    tools: dI(na5).optional(),
    tools_generated: ZF().optional(),
    prompts: dI(aa5).optional(),
    prompts_generated: ZF().optional(),
    keywords: dI(oQ()).optional(),
    license: oQ().optional(),
    privacy_policies: dI(oQ()).optional(),
    compatibility: ia5.optional(),
    user_config: $P(oQ(), oa5).optional()
  }).refine((A) => !!(A.dxt_version || A.manifest_version), {
    message: "Either 'dxt_version' (deprecated) or 'manifest_version' must be provided"
  }), MYY = fL({
    status: CP(["signed", "unsigned", "self-signed"]),
    publisher: oQ().optional(),
    issuer: oQ().optional(),
    valid_from: oQ().optional(),
    valid_to: oQ().optional(),
    fingerprint: oQ().optional()
  })
})
// @from(Ln 366715, Col 4)
tq0 = w(() => {
  DfA()
})
// @from(Ln 366722, Col 0)
function Io5(A, Q, B) {
  if (!B) B = Q, Q = {};
  if (typeof B != "function") VU(7);
  return Xo5(A, Q, [Jo5], function (G) {
    return ud2(ZN0(G.data[0], md2(G.data[1])))
  }, 1, B)
}
// @from(Ln 366730, Col 0)
function ZN0(A, Q) {
  return gd2(A, {
    i: 2
  }, Q && Q.out, Q && Q.dictionary)
}
// @from(Ln 366736, Col 0)
function Ko5(A, Q) {
  if (Q) {
    var B = "";
    for (var G = 0; G < A.length; G += 16384) B += String.fromCharCode.apply(null, A.subarray(G, G + 16384));
    return B
  } else if (AN0) return AN0.decode(A);
  else {
    var Z = Wo5(A),
      Y = Z.s,
      B = Z.r;
    if (B.length) VU(8);
    return Y
  }
}
// @from(Ln 366751, Col 0)
function dd2(A, Q, B) {
  if (!B) B = Q, Q = {};
  if (typeof B != "function") VU(7);
  var G = [],
    Z = function () {
      for (var z = 0; z < G.length; ++z) G[z]()
    },
    Y = {},
    J = function (z, $) {
      _d2(function () {
        B(z, $)
      })
    };
  _d2(function () {
    J = B
  });
  var X = A.length - 22;
  for (; Ex(A, X) != 101010256; --X)
    if (!X || A.length - X > 65558) return J(VU(13, 0, 1), null), Z;
  var I = Pf(A, X + 8);
  if (I) {
    var D = I,
      W = Ex(A, X + 16),
      K = W == 4294967295 || D == 65535;
    if (K) {
      var V = Ex(A, X - 12);
      if (K = Ex(A, V) == 101075792, K) D = I = Ex(A, V + 32), W = Ex(A, V + 48)
    }
    var F = Q && Q.filter,
      H = function (z) {
        var $ = Fo5(A, W, K),
          O = $[0],
          L = $[1],
          M = $[2],
          _ = $[3],
          j = $[4],
          x = $[5],
          b = Vo5(A, x);
        W = j;
        var S = function (f, AA) {
          if (f) Z(), J(f, null);
          else {
            if (AA) Y[_] = AA;
            if (!--I) J(null, Y)
          }
        };
        if (!F || F({
            name: _,
            size: L,
            originalSize: M,
            compression: O
          }))
          if (!O) S(null, FV1(A, b, b + L));
          else if (O == 8) {
          var u = A.subarray(b, b + L);
          if (M < 524288 || L > 0.8 * M) try {
            S(null, ZN0(u, {
              out: new FU(M)
            }))
          } catch (f) {
            S(f, null)
          } else G.push(Io5(u, {
            size: M
          }, S))
        } else S(VU(14, "unknown compression type " + O, 1), null);
        else S(null, null)
      };
    for (var E = 0; E < D; ++E) H(E)
  } else J(null, {});
  return Z
}
// @from(Ln 366822, Col 4)
ta5
// @from(Ln 366822, Col 9)
DV1
// @from(Ln 366822, Col 14)
ea5 = ";var __w=require('worker_threads');__w.parentPort.on('message',function(m){onmessage({data:m})}),postMessage=function(m,t){__w.parentPort.postMessage(m,t)},close=process.exit;self=global"
// @from(Ln 366823, Col 2)
Ao5
// @from(Ln 366823, Col 7)
FU
// @from(Ln 366823, Col 11)
A3A
// @from(Ln 366823, Col 16)
jd2
// @from(Ln 366823, Col 21)
QN0
// @from(Ln 366823, Col 26)
BN0
// @from(Ln 366823, Col 31)
Td2
// @from(Ln 366823, Col 36)
Pd2 = function (A, Q) {
    var B = new A3A(31);
    for (var G = 0; G < 31; ++G) B[G] = Q += 1 << A[G - 1];
    var Z = new jd2(B[30]);
    for (var G = 1; G < 30; ++G)
      for (var Y = B[G]; Y < B[G + 1]; ++Y) Z[Y] = Y - B[G] << 5 | G;
    return {
      b: B,
      r: Z
    }
  }
// @from(Ln 366834, Col 2)
Sd2
// @from(Ln 366834, Col 7)
GN0
// @from(Ln 366834, Col 12)
Qo5
// @from(Ln 366834, Col 17)
xd2
// @from(Ln 366834, Col 22)
yd2
// @from(Ln 366834, Col 27)
PYY
// @from(Ln 366834, Col 32)
VV1
// @from(Ln 366834, Col 37)
Tf
// @from(Ln 366834, Col 41)
F5
// @from(Ln 366834, Col 45)
FEA = function (A, Q, B) {
    var G = A.length,
      Z = 0,
      Y = new A3A(Q);
    for (; Z < G; ++Z)
      if (A[Z]) ++Y[A[Z] - 1];
    var J = new A3A(Q);
    for (Z = 1; Z < Q; ++Z) J[Z] = J[Z - 1] + Y[Z - 1] << 1;
    var X;
    if (B) {
      X = new A3A(1 << Q);
      var I = 15 - Q;
      for (Z = 0; Z < G; ++Z)
        if (A[Z]) {
          var D = Z << 4 | A[Z],
            W = Q - A[Z],
            K = J[A[Z] - 1]++ << W;
          for (var V = K | (1 << W) - 1; K <= V; ++K) X[VV1[K] >> I] = D
        }
    } else {
      X = new A3A(G);
      for (Z = 0; Z < G; ++Z)
        if (A[Z]) X[Z] = VV1[J[A[Z] - 1]++] >> 15 - A[Z]
    }
    return X
  }
// @from(Ln 366860, Col 2)
WfA
// @from(Ln 366860, Col 23)
vd2
// @from(Ln 366860, Col 32)
kd2
// @from(Ln 366860, Col 37)
bd2
// @from(Ln 366860, Col 42)
WV1 = function (A) {
    var Q = A[0];
    for (var B = 1; B < A.length; ++B)
      if (A[B] > Q) Q = A[B];
    return Q
  }
// @from(Ln 366866, Col 2)
Yj = function (A, Q, B) {
    var G = Q / 8 | 0;
    return (A[G] | A[G + 1] << 8) >> (Q & 7) & B
  }
// @from(Ln 366870, Col 2)
KV1 = function (A, Q) {
    var B = Q / 8 | 0;
    return (A[B] | A[B + 1] << 8 | A[B + 2] << 16) >> (Q & 7)
  }
// @from(Ln 366874, Col 2)
fd2 = function (A) {
    return (A + 7) / 8 | 0
  }
// @from(Ln 366877, Col 2)
FV1 = function (A, Q, B) {
    if (Q == null || Q < 0) Q = 0;
    if (B == null || B > A.length) B = A.length;
    return new FU(A.subarray(Q, B))
  }
// @from(Ln 366882, Col 2)
hd2
// @from(Ln 366882, Col 7)
VU = function (A, Q, B) {
    var G = Error(Q || hd2[A]);
    if (G.code = A, Error.captureStackTrace) Error.captureStackTrace(G, VU);
    if (!B) throw G;
    return G
  }
// @from(Ln 366888, Col 2)
gd2 = function (A, Q, B, G) {
    var Z = A.length,
      Y = G ? G.length : 0;
    if (!Z || Q.f && !Q.l) return B || new FU(0);
    var J = !B,
      X = J || Q.i != 2,
      I = Q.i;
    if (J) B = new FU(Z * 3);
    var D = function (BA) {
        var DA = B.length;
        if (BA > DA) {
          var CA = new FU(Math.max(DA * 2, BA));
          CA.set(B), B = CA
        }
      },
      W = Q.f || 0,
      K = Q.p || 0,
      V = Q.b || 0,
      F = Q.l,
      H = Q.d,
      E = Q.m,
      z = Q.n,
      $ = Z * 8;
    do {
      if (!F) {
        W = Yj(A, K, 1);
        var O = Yj(A, K + 1, 3);
        if (K += 3, !O) {
          var L = fd2(K) + 4,
            M = A[L - 4] | A[L - 3] << 8,
            _ = L + M;
          if (_ > Z) {
            if (I) VU(0);
            break
          }
          if (X) D(V + M);
          B.set(A.subarray(L, _), V), Q.b = V += M, Q.p = K = _ * 8, Q.f = W;
          continue
        } else if (O == 1) F = kd2, H = bd2, E = 9, z = 5;
        else if (O == 2) {
          var j = Yj(A, K, 31) + 257,
            x = Yj(A, K + 10, 15) + 4,
            b = j + Yj(A, K + 5, 31) + 1;
          K += 14;
          var S = new FU(b),
            u = new FU(19);
          for (var f = 0; f < x; ++f) u[Td2[f]] = Yj(A, K + f * 3, 7);
          K += x * 3;
          var AA = WV1(u),
            n = (1 << AA) - 1,
            y = FEA(u, AA, 1);
          for (var f = 0; f < b;) {
            var p = y[Yj(A, K, n)];
            K += p & 15;
            var L = p >> 4;
            if (L < 16) S[f++] = L;
            else {
              var GA = 0,
                WA = 0;
              if (L == 16) WA = 3 + Yj(A, K, 3), K += 2, GA = S[f - 1];
              else if (L == 17) WA = 3 + Yj(A, K, 7), K += 3;
              else if (L == 18) WA = 11 + Yj(A, K, 127), K += 7;
              while (WA--) S[f++] = GA
            }
          }
          var MA = S.subarray(0, j),
            TA = S.subarray(j);
          E = WV1(MA), z = WV1(TA), F = FEA(MA, E, 1), H = FEA(TA, z, 1)
        } else VU(1);
        if (K > $) {
          if (I) VU(0);
          break
        }
      }
      if (X) D(V + 131072);
      var bA = (1 << E) - 1,
        jA = (1 << z) - 1,
        OA = K;
      for (;; OA = K) {
        var GA = F[KV1(A, K) & bA],
          IA = GA >> 4;
        if (K += GA & 15, K > $) {
          if (I) VU(0);
          break
        }
        if (!GA) VU(2);
        if (IA < 256) B[V++] = IA;
        else if (IA == 256) {
          OA = K, F = null;
          break
        } else {
          var HA = IA - 254;
          if (IA > 264) {
            var f = IA - 257,
              ZA = QN0[f];
            HA = Yj(A, K, (1 << ZA) - 1) + GN0[f], K += ZA
          }
          var zA = H[KV1(A, K) & jA],
            wA = zA >> 4;
          if (!zA) VU(3);
          K += zA & 15;
          var TA = yd2[wA];
          if (wA > 3) {
            var ZA = BN0[wA];
            TA += KV1(A, K) & (1 << ZA) - 1, K += ZA
          }
          if (K > $) {
            if (I) VU(0);
            break
          }
          if (X) D(V + 131072);
          var _A = V + HA;
          if (V < TA) {
            var s = Y - TA,
              t = Math.min(TA, _A);
            if (s + V < 0) VU(3);
            for (; V < t; ++V) B[V] = G[s + V]
          }
          for (; V < _A; ++V) B[V] = B[V - TA]
        }
      }
      if (Q.l = F, Q.p = OA, Q.b = V, Q.f = W, F) W = 1, Q.m = E, Q.d = H, Q.n = z
    } while (!W);
    return V != B.length && J ? FV1(B, 0, V) : B.subarray(0, V)
  }
// @from(Ln 367013, Col 2)
Bo5
// @from(Ln 367013, Col 7)
Go5 = function (A, Q) {
    var B = {};
    for (var G in A) B[G] = A[G];
    for (var G in Q) B[G] = Q[G];
    return B
  }
// @from(Ln 367019, Col 2)
Rd2 = function (A, Q, B) {
    var G = A(),
      Z = A.toString(),
      Y = Z.slice(Z.indexOf("[") + 1, Z.lastIndexOf("]")).replace(/\s+/g, "").split(",");
    for (var J = 0; J < G.length; ++J) {
      var X = G[J],
        I = Y[J];
      if (typeof X == "function") {
        Q += ";" + I + "=";
        var D = X.toString();
        if (X.prototype)
          if (D.indexOf("[native code]") != -1) {
            var W = D.indexOf(" ", 8) + 1;
            Q += D.slice(W, D.indexOf("(", W))
          } else {
            Q += D;
            for (var K in X.prototype) Q += ";" + I + ".prototype." + K + "=" + X.prototype[K].toString()
          }
        else Q += D
      } else B[I] = X
    }
    return Q
  }
// @from(Ln 367042, Col 2)
IV1
// @from(Ln 367042, Col 7)
Zo5 = function (A) {
    var Q = [];
    for (var B in A)
      if (A[B].buffer) Q.push((A[B] = new A[B].constructor(A[B])).buffer);
    return Q
  }
// @from(Ln 367048, Col 2)
Yo5 = function (A, Q, B, G) {
    if (!IV1[B]) {
      var Z = "",
        Y = {},
        J = A.length - 1;
      for (var X = 0; X < J; ++X) Z = Rd2(A[X], Z, Y);
      IV1[B] = {
        c: Rd2(A[J], Z, Y),
        e: Y
      }
    }
    var I = Go5({}, IV1[B].e);
    return Ao5(IV1[B].c + ";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage=" + Q.toString() + "}", B, I, Zo5(I), G)
  }
// @from(Ln 367062, Col 2)
Jo5 = function () {
    return [FU, A3A, jd2, QN0, BN0, Td2, GN0, yd2, kd2, bd2, VV1, hd2, FEA, WV1, Yj, KV1, fd2, FV1, VU, gd2, ZN0, ud2, md2]
  }
// @from(Ln 367065, Col 2)
ud2 = function (A) {
    return postMessage(A, [A.buffer])
  }
// @from(Ln 367068, Col 2)
md2 = function (A) {
    return A && {
      out: A.size && new FU(A.size),
      dictionary: A.dictionary
    }
  }
// @from(Ln 367074, Col 2)
Xo5 = function (A, Q, B, G, Z, Y) {
    var J = Yo5(B, G, Z, function (X, I) {
      J.terminate(), Y(X, I)
    });
    return J.postMessage([A, Q], Q.consume ? [A.buffer] : []),
      function () {
        J.terminate()
      }
  }
// @from(Ln 367083, Col 2)
Pf = function (A, Q) {
    return A[Q] | A[Q + 1] << 8
  }
// @from(Ln 367086, Col 2)
Ex = function (A, Q) {
    return (A[Q] | A[Q + 1] << 8 | A[Q + 2] << 16 | A[Q + 3] << 24) >>> 0
  }
// @from(Ln 367089, Col 2)
eq0 = function (A, Q) {
    return Ex(A, Q) + Ex(A, Q + 4) * 4294967296
  }
// @from(Ln 367092, Col 2)
AN0
// @from(Ln 367092, Col 7)
Do5 = 0
// @from(Ln 367093, Col 2)
Wo5 = function (A) {
    for (var Q = "", B = 0;;) {
      var G = A[B++],
        Z = (G > 127) + (G > 223) + (G > 239);
      if (B + Z > A.length) return {
        s: Q,
        r: FV1(A, B - 1)
      };
      if (!Z) Q += String.fromCharCode(G);
      else if (Z == 3) G = ((G & 15) << 18 | (A[B++] & 63) << 12 | (A[B++] & 63) << 6 | A[B++] & 63) - 65536, Q += String.fromCharCode(55296 | G >> 10, 56320 | G & 1023);
      else if (Z & 1) Q += String.fromCharCode((G & 31) << 6 | A[B++] & 63);
      else Q += String.fromCharCode((G & 15) << 12 | (A[B++] & 63) << 6 | A[B++] & 63)
    }
  }
// @from(Ln 367107, Col 2)
Vo5 = function (A, Q) {
    return Q + 30 + Pf(A, Q + 26) + Pf(A, Q + 28)
  }
// @from(Ln 367110, Col 2)
Fo5 = function (A, Q, B) {
    var G = Pf(A, Q + 28),
      Z = Ko5(A.subarray(Q + 46, Q + 46 + G), !(Pf(A, Q + 8) & 2048)),
      Y = Q + 46 + G,
      J = Ex(A, Q + 20),
      X = B && J == 4294967295 ? Ho5(A, Y) : [J, Ex(A, Q + 24), Ex(A, Q + 42)],
      I = X[0],
      D = X[1],
      W = X[2];
    return [Pf(A, Q + 10), I, D, Z, Y + Pf(A, Q + 30) + Pf(A, Q + 32), W]
  }
// @from(Ln 367121, Col 2)
Ho5 = function (A, Q) {
    for (; Pf(A, Q) != 1; Q += 4 + Pf(A, Q + 2));
    return [eq0(A, Q + 12), eq0(A, Q + 4), eq0(A, Q + 20)]
  }
// @from(Ln 367125, Col 2)
_d2
// @from(Ln 367126, Col 4)
cd2 = w(() => {
  ta5 = sa5("/");
  try {
    DV1 = ta5("worker_threads").Worker
  } catch (A) {}
  Ao5 = DV1 ? function (A, Q, B, G, Z) {
    var Y = !1,
      J = new DV1(A + ea5, {
        eval: !0
      }).on("error", function (X) {
        return Z(X, null)
      }).on("message", function (X) {
        return Z(null, X)
      }).on("exit", function (X) {
        if (X && !Y) Z(Error("exited with code " + X), null)
      });
    return J.postMessage(B, G), J.terminate = function () {
      return Y = !0, DV1.prototype.terminate.call(J)
    }, J
  } : function (A, Q, B, G, Z) {
    setImmediate(function () {
      return Z(Error("async operations unsupported - update to Node 12+ (or Node 10-11 with the --experimental-worker CLI flag)"), null)
    });
    var Y = function () {};
    return {
      terminate: Y,
      postMessage: Y
    }
  }, FU = Uint8Array, A3A = Uint16Array, jd2 = Int32Array, QN0 = new FU([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0]), BN0 = new FU([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0]), Td2 = new FU([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), Sd2 = Pd2(QN0, 2), GN0 = Sd2.b, Qo5 = Sd2.r;
  GN0[28] = 258, Qo5[258] = 28;
  xd2 = Pd2(BN0, 0), yd2 = xd2.b, PYY = xd2.r, VV1 = new A3A(32768);
  for (F5 = 0; F5 < 32768; ++F5) Tf = (F5 & 43690) >> 1 | (F5 & 21845) << 1, Tf = (Tf & 52428) >> 2 | (Tf & 13107) << 2, Tf = (Tf & 61680) >> 4 | (Tf & 3855) << 4, VV1[F5] = ((Tf & 65280) >> 8 | (Tf & 255) << 8) >> 1;
  WfA = new FU(288);
  for (F5 = 0; F5 < 144; ++F5) WfA[F5] = 8;
  for (F5 = 144; F5 < 256; ++F5) WfA[F5] = 9;
  for (F5 = 256; F5 < 280; ++F5) WfA[F5] = 7;
  for (F5 = 280; F5 < 288; ++F5) WfA[F5] = 8;
  vd2 = new FU(32);
  for (F5 = 0; F5 < 32; ++F5) vd2[F5] = 5;
  kd2 = FEA(WfA, 9, 1), bd2 = FEA(vd2, 5, 1), hd2 = ["unexpected EOF", "invalid block type", "invalid length/literal", "invalid distance", "stream finished", "no stream handler", , "no callback", "invalid UTF-8 data", "extra field too long", "date not in range 1980-2099", "filename too long", "stream finishing", "invalid zip data"], Bo5 = new FU(0), IV1 = [];
  AN0 = typeof TextDecoder < "u" && new TextDecoder;
  try {
    AN0.decode(Bo5, {
      stream: !0
    }), Do5 = 1
  } catch (A) {}
  _d2 = typeof queueMicrotask == "function" ? queueMicrotask : typeof setTimeout == "function" ? setTimeout : function (A) {
    A()
  }
})
// @from(Ln 367176, Col 4)
Eo5
// @from(Ln 367177, Col 4)
YN0 = w(() => {
  Eo5 = c(VyA(), 1)
})
// @from(Ln 367180, Col 4)
AJ = U((zo5) => {
  zo5.fromCallback = function (A) {
    return Object.defineProperty(function (...Q) {
      if (typeof Q[Q.length - 1] === "function") A.apply(this, Q);
      else return new Promise((B, G) => {
        Q.push((Z, Y) => Z != null ? G(Z) : B(Y)), A.apply(this, Q)
      })
    }, "name", {
      value: A.name
    })
  };
  zo5.fromPromise = function (A) {
    return Object.defineProperty(function (...Q) {
      let B = Q[Q.length - 1];
      if (typeof B !== "function") return A.apply(this, Q);
      else Q.pop(), A.apply(this, Q).then((G) => B(null, G), B)
    }, "name", {
      value: A.name
    })
  }
})
// @from(Ln 367201, Col 4)
Q3A = U((JN0) => {
  var pd2 = AJ().fromCallback,
    Zw = OG(),
    Uo5 = ["access", "appendFile", "chmod", "chown", "close", "copyFile", "fchmod", "fchown", "fdatasync", "fstat", "fsync", "ftruncate", "futimes", "lchmod", "lchown", "link", "lstat", "mkdir", "mkdtemp", "open", "opendir", "readdir", "readFile", "readlink", "realpath", "rename", "rm", "rmdir", "stat", "symlink", "truncate", "unlink", "utimes", "writeFile"].filter((A) => {
      return typeof Zw[A] === "function"
    });
  Object.assign(JN0, Zw);
  Uo5.forEach((A) => {
    JN0[A] = pd2(Zw[A])
  });
  JN0.exists = function (A, Q) {
    if (typeof Q === "function") return Zw.exists(A, Q);
    return new Promise((B) => {
      return Zw.exists(A, B)
    })
  };
  JN0.read = function (A, Q, B, G, Z, Y) {
    if (typeof Y === "function") return Zw.read(A, Q, B, G, Z, Y);
    return new Promise((J, X) => {
      Zw.read(A, Q, B, G, Z, (I, D, W) => {
        if (I) return X(I);
        J({
          bytesRead: D,
          buffer: W
        })
      })
    })
  };
  JN0.write = function (A, Q, ...B) {
    if (typeof B[B.length - 1] === "function") return Zw.write(A, Q, ...B);
    return new Promise((G, Z) => {
      Zw.write(A, Q, ...B, (Y, J, X) => {
        if (Y) return Z(Y);
        G({
          bytesWritten: J,
          buffer: X
        })
      })
    })
  };
  if (typeof Zw.writev === "function") JN0.writev = function (A, Q, ...B) {
    if (typeof B[B.length - 1] === "function") return Zw.writev(A, Q, ...B);
    return new Promise((G, Z) => {
      Zw.writev(A, Q, ...B, (Y, J, X) => {
        if (Y) return Z(Y);
        G({
          bytesWritten: J,
          buffers: X
        })
      })
    })
  };
  if (typeof Zw.realpath.native === "function") JN0.realpath.native = pd2(Zw.realpath.native);
  else process.emitWarning("fs.realpath.native is not a function. Is fs being monkey-patched?", "Warning", "fs-extra-WARN0003")
})
// @from(Ln 367256, Col 4)
id2 = U((Oo5, ld2) => {
  var Lo5 = NA("path");
  Oo5.checkPath = function (Q) {
    if (process.platform === "win32") {
      if (/[<>:"|?*]/.test(Q.replace(Lo5.parse(Q).root, ""))) {
        let G = Error(`Path contains invalid characters: ${Q}`);
        throw G.code = "EINVAL", G
      }
    }
  }
})
// @from(Ln 367267, Col 4)
rd2 = U((Ro5, XN0) => {
  var nd2 = Q3A(),
    {
      checkPath: ad2
    } = id2(),
    od2 = (A) => {
      let Q = {
        mode: 511
      };
      if (typeof A === "number") return A;
      return {
        ...Q,
        ...A
      }.mode
    };
  Ro5.makeDir = async (A, Q) => {
    return ad2(A), nd2.mkdir(A, {
      mode: od2(Q),
      recursive: !0
    })
  };
  Ro5.makeDirSync = (A, Q) => {
    return ad2(A), nd2.mkdirSync(A, {
      mode: od2(Q),
      recursive: !0
    })
  }
})
// @from(Ln 367295, Col 4)
zx = U((fYY, sd2) => {
  var To5 = AJ().fromPromise,
    {
      makeDir: Po5,
      makeDirSync: IN0
    } = rd2(),
    DN0 = To5(Po5);
  sd2.exports = {
    mkdirs: DN0,
    mkdirsSync: IN0,
    mkdirp: DN0,
    mkdirpSync: IN0,
    ensureDir: DN0,
    ensureDirSync: IN0
  }
})
// @from(Ln 367311, Col 4)
Ut = U((hYY, ed2) => {
  var So5 = AJ().fromPromise,
    td2 = Q3A();

  function xo5(A) {
    return td2.access(A).then(() => !0).catch(() => !1)
  }
  ed2.exports = {
    pathExists: So5(xo5),
    pathExistsSync: td2.existsSync
  }
})
// @from(Ln 367323, Col 4)
WN0 = U((gYY, Ac2) => {
  var HEA = OG();

  function yo5(A, Q, B, G) {
    HEA.open(A, "r+", (Z, Y) => {
      if (Z) return G(Z);
      HEA.futimes(Y, Q, B, (J) => {
        HEA.close(Y, (X) => {
          if (G) G(J || X)
        })
      })
    })
  }

  function vo5(A, Q, B) {
    let G = HEA.openSync(A, "r+");
    return HEA.futimesSync(G, Q, B), HEA.closeSync(G)
  }
  Ac2.exports = {
    utimesMillis: yo5,
    utimesMillisSync: vo5
  }
})
// @from(Ln 367346, Col 4)
B3A = U((uYY, Gc2) => {
  var EEA = Q3A(),
    gF = NA("path"),
    ko5 = NA("util");

  function bo5(A, Q, B) {
    let G = B.dereference ? (Z) => EEA.stat(Z, {
      bigint: !0
    }) : (Z) => EEA.lstat(Z, {
      bigint: !0
    });
    return Promise.all([G(A), G(Q).catch((Z) => {
      if (Z.code === "ENOENT") return null;
      throw Z
    })]).then(([Z, Y]) => ({
      srcStat: Z,
      destStat: Y
    }))
  }

  function fo5(A, Q, B) {
    let G, Z = B.dereference ? (J) => EEA.statSync(J, {
        bigint: !0
      }) : (J) => EEA.lstatSync(J, {
        bigint: !0
      }),
      Y = Z(A);
    try {
      G = Z(Q)
    } catch (J) {
      if (J.code === "ENOENT") return {
        srcStat: Y,
        destStat: null
      };
      throw J
    }
    return {
      srcStat: Y,
      destStat: G
    }
  }

  function ho5(A, Q, B, G, Z) {
    ko5.callbackify(bo5)(A, Q, G, (Y, J) => {
      if (Y) return Z(Y);
      let {
        srcStat: X,
        destStat: I
      } = J;
      if (I) {
        if (KfA(X, I)) {
          let D = gF.basename(A),
            W = gF.basename(Q);
          if (B === "move" && D !== W && D.toLowerCase() === W.toLowerCase()) return Z(null, {
            srcStat: X,
            destStat: I,
            isChangingCase: !0
          });
          return Z(Error("Source and destination must not be the same."))
        }
        if (X.isDirectory() && !I.isDirectory()) return Z(Error(`Cannot overwrite non-directory '${Q}' with directory '${A}'.`));
        if (!X.isDirectory() && I.isDirectory()) return Z(Error(`Cannot overwrite directory '${Q}' with non-directory '${A}'.`))
      }
      if (X.isDirectory() && KN0(A, Q)) return Z(Error(HV1(A, Q, B)));
      return Z(null, {
        srcStat: X,
        destStat: I
      })
    })
  }

  function go5(A, Q, B, G) {
    let {
      srcStat: Z,
      destStat: Y
    } = fo5(A, Q, G);
    if (Y) {
      if (KfA(Z, Y)) {
        let J = gF.basename(A),
          X = gF.basename(Q);
        if (B === "move" && J !== X && J.toLowerCase() === X.toLowerCase()) return {
          srcStat: Z,
          destStat: Y,
          isChangingCase: !0
        };
        throw Error("Source and destination must not be the same.")
      }
      if (Z.isDirectory() && !Y.isDirectory()) throw Error(`Cannot overwrite non-directory '${Q}' with directory '${A}'.`);
      if (!Z.isDirectory() && Y.isDirectory()) throw Error(`Cannot overwrite directory '${Q}' with non-directory '${A}'.`)
    }
    if (Z.isDirectory() && KN0(A, Q)) throw Error(HV1(A, Q, B));
    return {
      srcStat: Z,
      destStat: Y
    }
  }

  function Qc2(A, Q, B, G, Z) {
    let Y = gF.resolve(gF.dirname(A)),
      J = gF.resolve(gF.dirname(B));
    if (J === Y || J === gF.parse(J).root) return Z();
    EEA.stat(J, {
      bigint: !0
    }, (X, I) => {
      if (X) {
        if (X.code === "ENOENT") return Z();
        return Z(X)
      }
      if (KfA(Q, I)) return Z(Error(HV1(A, B, G)));
      return Qc2(A, Q, J, G, Z)
    })
  }

  function Bc2(A, Q, B, G) {
    let Z = gF.resolve(gF.dirname(A)),
      Y = gF.resolve(gF.dirname(B));
    if (Y === Z || Y === gF.parse(Y).root) return;
    let J;
    try {
      J = EEA.statSync(Y, {
        bigint: !0
      })
    } catch (X) {
      if (X.code === "ENOENT") return;
      throw X
    }
    if (KfA(Q, J)) throw Error(HV1(A, B, G));
    return Bc2(A, Q, Y, G)
  }

  function KfA(A, Q) {
    return Q.ino && Q.dev && Q.ino === A.ino && Q.dev === A.dev
  }

  function KN0(A, Q) {
    let B = gF.resolve(A).split(gF.sep).filter((Z) => Z),
      G = gF.resolve(Q).split(gF.sep).filter((Z) => Z);
    return B.reduce((Z, Y, J) => Z && G[J] === Y, !0)
  }

  function HV1(A, Q, B) {
    return `Cannot ${B} '${A}' to a subdirectory of itself, '${Q}'.`
  }
  Gc2.exports = {
    checkPaths: ho5,
    checkPathsSync: go5,
    checkParentPaths: Qc2,
    checkParentPathsSync: Bc2,
    isSrcSubdir: KN0,
    areIdentical: KfA
  }
})
// @from(Ln 367498, Col 4)
Kc2 = U((mYY, Wc2) => {
  var Yw = OG(),
    VfA = NA("path"),
    uo5 = zx().mkdirs,
    mo5 = Ut().pathExists,
    do5 = WN0().utimesMillis,
    FfA = B3A();

  function co5(A, Q, B, G) {
    if (typeof B === "function" && !G) G = B, B = {};
    else if (typeof B === "function") B = {
      filter: B
    };
    if (G = G || function () {}, B = B || {}, B.clobber = "clobber" in B ? !!B.clobber : !0, B.overwrite = "overwrite" in B ? !!B.overwrite : B.clobber, B.preserveTimestamps && process.arch === "ia32") process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`, "Warning", "fs-extra-WARN0001");
    FfA.checkPaths(A, Q, "copy", B, (Z, Y) => {
      if (Z) return G(Z);
      let {
        srcStat: J,
        destStat: X
      } = Y;
      FfA.checkParentPaths(A, J, Q, "copy", (I) => {
        if (I) return G(I);
        if (B.filter) return Jc2(Zc2, X, A, Q, B, G);
        return Zc2(X, A, Q, B, G)
      })
    })
  }

  function Zc2(A, Q, B, G, Z) {
    let Y = VfA.dirname(B);
    mo5(Y, (J, X) => {
      if (J) return Z(J);
      if (X) return EV1(A, Q, B, G, Z);
      uo5(Y, (I) => {
        if (I) return Z(I);
        return EV1(A, Q, B, G, Z)
      })
    })
  }

  function Jc2(A, Q, B, G, Z, Y) {
    Promise.resolve(Z.filter(B, G)).then((J) => {
      if (J) return A(Q, B, G, Z, Y);
      return Y()
    }, (J) => Y(J))
  }

  function po5(A, Q, B, G, Z) {
    if (G.filter) return Jc2(EV1, A, Q, B, G, Z);
    return EV1(A, Q, B, G, Z)
  }

  function EV1(A, Q, B, G, Z) {
    (G.dereference ? Yw.stat : Yw.lstat)(Q, (J, X) => {
      if (J) return Z(J);
      if (X.isDirectory()) return so5(X, A, Q, B, G, Z);
      else if (X.isFile() || X.isCharacterDevice() || X.isBlockDevice()) return lo5(X, A, Q, B, G, Z);
      else if (X.isSymbolicLink()) return Ar5(A, Q, B, G, Z);
      else if (X.isSocket()) return Z(Error(`Cannot copy a socket file: ${Q}`));
      else if (X.isFIFO()) return Z(Error(`Cannot copy a FIFO pipe: ${Q}`));
      return Z(Error(`Unknown file: ${Q}`))
    })
  }

  function lo5(A, Q, B, G, Z, Y) {
    if (!Q) return Xc2(A, B, G, Z, Y);
    return io5(A, B, G, Z, Y)
  }

  function io5(A, Q, B, G, Z) {
    if (G.overwrite) Yw.unlink(B, (Y) => {
      if (Y) return Z(Y);
      return Xc2(A, Q, B, G, Z)
    });
    else if (G.errorOnExist) return Z(Error(`'${B}' already exists`));
    else return Z()
  }

  function Xc2(A, Q, B, G, Z) {
    Yw.copyFile(Q, B, (Y) => {
      if (Y) return Z(Y);
      if (G.preserveTimestamps) return no5(A.mode, Q, B, Z);
      return zV1(B, A.mode, Z)
    })
  }

  function no5(A, Q, B, G) {
    if (ao5(A)) return oo5(B, A, (Z) => {
      if (Z) return G(Z);
      return Yc2(A, Q, B, G)
    });
    return Yc2(A, Q, B, G)
  }

  function ao5(A) {
    return (A & 128) === 0
  }

  function oo5(A, Q, B) {
    return zV1(A, Q | 128, B)
  }

  function Yc2(A, Q, B, G) {
    ro5(Q, B, (Z) => {
      if (Z) return G(Z);
      return zV1(B, A, G)
    })
  }

  function zV1(A, Q, B) {
    return Yw.chmod(A, Q, B)
  }

  function ro5(A, Q, B) {
    Yw.stat(A, (G, Z) => {
      if (G) return B(G);
      return do5(Q, Z.atime, Z.mtime, B)
    })
  }

  function so5(A, Q, B, G, Z, Y) {
    if (!Q) return to5(A.mode, B, G, Z, Y);
    return Ic2(B, G, Z, Y)
  }

  function to5(A, Q, B, G, Z) {
    Yw.mkdir(B, (Y) => {
      if (Y) return Z(Y);
      Ic2(Q, B, G, (J) => {
        if (J) return Z(J);
        return zV1(B, A, Z)
      })
    })
  }

  function Ic2(A, Q, B, G) {
    Yw.readdir(A, (Z, Y) => {
      if (Z) return G(Z);
      return Dc2(Y, A, Q, B, G)
    })
  }

  function Dc2(A, Q, B, G, Z) {
    let Y = A.pop();
    if (!Y) return Z();
    return eo5(A, Y, Q, B, G, Z)
  }

  function eo5(A, Q, B, G, Z, Y) {
    let J = VfA.join(B, Q),
      X = VfA.join(G, Q);
    FfA.checkPaths(J, X, "copy", Z, (I, D) => {
      if (I) return Y(I);
      let {
        destStat: W
      } = D;
      po5(W, J, X, Z, (K) => {
        if (K) return Y(K);
        return Dc2(A, B, G, Z, Y)
      })
    })
  }

  function Ar5(A, Q, B, G, Z) {
    Yw.readlink(Q, (Y, J) => {
      if (Y) return Z(Y);
      if (G.dereference) J = VfA.resolve(process.cwd(), J);
      if (!A) return Yw.symlink(J, B, Z);
      else Yw.readlink(B, (X, I) => {
        if (X) {
          if (X.code === "EINVAL" || X.code === "UNKNOWN") return Yw.symlink(J, B, Z);
          return Z(X)
        }
        if (G.dereference) I = VfA.resolve(process.cwd(), I);
        if (FfA.isSrcSubdir(J, I)) return Z(Error(`Cannot copy '${J}' to a subdirectory of itself, '${I}'.`));
        if (A.isDirectory() && FfA.isSrcSubdir(I, J)) return Z(Error(`Cannot overwrite '${I}' with '${J}'.`));
        return Qr5(J, B, Z)
      })
    })
  }

  function Qr5(A, Q, B) {
    Yw.unlink(Q, (G) => {
      if (G) return B(G);
      return Yw.symlink(A, Q, B)
    })
  }
  Wc2.exports = co5
})
// @from(Ln 367689, Col 4)
zc2 = U((dYY, Ec2) => {
  var H$ = OG(),
    HfA = NA("path"),
    Br5 = zx().mkdirsSync,
    Gr5 = WN0().utimesMillisSync,
    EfA = B3A();

  function Zr5(A, Q, B) {
    if (typeof B === "function") B = {
      filter: B
    };
    if (B = B || {}, B.clobber = "clobber" in B ? !!B.clobber : !0, B.overwrite = "overwrite" in B ? !!B.overwrite : B.clobber, B.preserveTimestamps && process.arch === "ia32") process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`, "Warning", "fs-extra-WARN0002");
    let {
      srcStat: G,
      destStat: Z
    } = EfA.checkPathsSync(A, Q, "copy", B);
    return EfA.checkParentPathsSync(A, G, Q, "copy"), Yr5(Z, A, Q, B)
  }

  function Yr5(A, Q, B, G) {
    if (G.filter && !G.filter(Q, B)) return;
    let Z = HfA.dirname(B);
    if (!H$.existsSync(Z)) Br5(Z);
    return Vc2(A, Q, B, G)
  }

  function Jr5(A, Q, B, G) {
    if (G.filter && !G.filter(Q, B)) return;
    return Vc2(A, Q, B, G)
  }

  function Vc2(A, Q, B, G) {
    let Y = (G.dereference ? H$.statSync : H$.lstatSync)(Q);
    if (Y.isDirectory()) return Fr5(Y, A, Q, B, G);
    else if (Y.isFile() || Y.isCharacterDevice() || Y.isBlockDevice()) return Xr5(Y, A, Q, B, G);
    else if (Y.isSymbolicLink()) return zr5(A, Q, B, G);
    else if (Y.isSocket()) throw Error(`Cannot copy a socket file: ${Q}`);
    else if (Y.isFIFO()) throw Error(`Cannot copy a FIFO pipe: ${Q}`);
    throw Error(`Unknown file: ${Q}`)
  }

  function Xr5(A, Q, B, G, Z) {
    if (!Q) return Fc2(A, B, G, Z);
    return Ir5(A, B, G, Z)
  }

  function Ir5(A, Q, B, G) {
    if (G.overwrite) return H$.unlinkSync(B), Fc2(A, Q, B, G);
    else if (G.errorOnExist) throw Error(`'${B}' already exists`)
  }

  function Fc2(A, Q, B, G) {
    if (H$.copyFileSync(Q, B), G.preserveTimestamps) Dr5(A.mode, Q, B);
    return VN0(B, A.mode)
  }

  function Dr5(A, Q, B) {
    if (Wr5(A)) Kr5(B, A);
    return Vr5(Q, B)
  }

  function Wr5(A) {
    return (A & 128) === 0
  }

  function Kr5(A, Q) {
    return VN0(A, Q | 128)
  }

  function VN0(A, Q) {
    return H$.chmodSync(A, Q)
  }

  function Vr5(A, Q) {
    let B = H$.statSync(A);
    return Gr5(Q, B.atime, B.mtime)
  }

  function Fr5(A, Q, B, G, Z) {
    if (!Q) return Hr5(A.mode, B, G, Z);
    return Hc2(B, G, Z)
  }

  function Hr5(A, Q, B, G) {
    return H$.mkdirSync(B), Hc2(Q, B, G), VN0(B, A)
  }

  function Hc2(A, Q, B) {
    H$.readdirSync(A).forEach((G) => Er5(G, A, Q, B))
  }

  function Er5(A, Q, B, G) {
    let Z = HfA.join(Q, A),
      Y = HfA.join(B, A),
      {
        destStat: J
      } = EfA.checkPathsSync(Z, Y, "copy", G);
    return Jr5(J, Z, Y, G)
  }

  function zr5(A, Q, B, G) {
    let Z = H$.readlinkSync(Q);
    if (G.dereference) Z = HfA.resolve(process.cwd(), Z);
    if (!A) return H$.symlinkSync(Z, B);
    else {
      let Y;
      try {
        Y = H$.readlinkSync(B)
      } catch (J) {
        if (J.code === "EINVAL" || J.code === "UNKNOWN") return H$.symlinkSync(Z, B);
        throw J
      }
      if (G.dereference) Y = HfA.resolve(process.cwd(), Y);
      if (EfA.isSrcSubdir(Z, Y)) throw Error(`Cannot copy '${Z}' to a subdirectory of itself, '${Y}'.`);
      if (H$.statSync(B).isDirectory() && EfA.isSrcSubdir(Y, Z)) throw Error(`Cannot overwrite '${Y}' with '${Z}'.`);
      return $r5(Z, B)
    }
  }

  function $r5(A, Q) {
    return H$.unlinkSync(Q), H$.symlinkSync(A, Q)
  }
  Ec2.exports = Zr5
})
// @from(Ln 367815, Col 4)
$V1 = U((cYY, $c2) => {
  var Cr5 = AJ().fromCallback;
  $c2.exports = {
    copy: Cr5(Kc2()),
    copySync: zc2()
  }
})
// @from(Ln 367822, Col 4)
Rc2 = U((pYY, Mc2) => {
  var Cc2 = OG(),
    wc2 = NA("path"),
    CY = NA("assert"),
    zfA = process.platform === "win32";

  function Lc2(A) {
    ["unlink", "chmod", "stat", "lstat", "rmdir", "readdir"].forEach((B) => {
      A[B] = A[B] || Cc2[B], B = B + "Sync", A[B] = A[B] || Cc2[B]
    }), A.maxBusyTries = A.maxBusyTries || 3
  }

  function FN0(A, Q, B) {
    let G = 0;
    if (typeof Q === "function") B = Q, Q = {};
    CY(A, "rimraf: missing path"), CY.strictEqual(typeof A, "string", "rimraf: path should be a string"), CY.strictEqual(typeof B, "function", "rimraf: callback function required"), CY(Q, "rimraf: invalid options argument provided"), CY.strictEqual(typeof Q, "object", "rimraf: options should be object"), Lc2(Q), Uc2(A, Q, function Z(Y) {
      if (Y) {
        if ((Y.code === "EBUSY" || Y.code === "ENOTEMPTY" || Y.code === "EPERM") && G < Q.maxBusyTries) {
          G++;
          let J = G * 100;
          return setTimeout(() => Uc2(A, Q, Z), J)
        }
        if (Y.code === "ENOENT") Y = null
      }
      B(Y)
    })
  }

  function Uc2(A, Q, B) {
    CY(A), CY(Q), CY(typeof B === "function"), Q.lstat(A, (G, Z) => {
      if (G && G.code === "ENOENT") return B(null);
      if (G && G.code === "EPERM" && zfA) return qc2(A, Q, G, B);
      if (Z && Z.isDirectory()) return CV1(A, Q, G, B);
      Q.unlink(A, (Y) => {
        if (Y) {
          if (Y.code === "ENOENT") return B(null);
          if (Y.code === "EPERM") return zfA ? qc2(A, Q, Y, B) : CV1(A, Q, Y, B);
          if (Y.code === "EISDIR") return CV1(A, Q, Y, B)
        }
        return B(Y)
      })
    })
  }

  function qc2(A, Q, B, G) {
    CY(A), CY(Q), CY(typeof G === "function"), Q.chmod(A, 438, (Z) => {
      if (Z) G(Z.code === "ENOENT" ? null : B);
      else Q.stat(A, (Y, J) => {
        if (Y) G(Y.code === "ENOENT" ? null : B);
        else if (J.isDirectory()) CV1(A, Q, B, G);
        else Q.unlink(A, G)
      })
    })
  }

  function Nc2(A, Q, B) {
    let G;
    CY(A), CY(Q);
    try {
      Q.chmodSync(A, 438)
    } catch (Z) {
      if (Z.code === "ENOENT") return;
      else throw B
    }
    try {
      G = Q.statSync(A)
    } catch (Z) {
      if (Z.code === "ENOENT") return;
      else throw B
    }
    if (G.isDirectory()) UV1(A, Q, B);
    else Q.unlinkSync(A)
  }

  function CV1(A, Q, B, G) {
    CY(A), CY(Q), CY(typeof G === "function"), Q.rmdir(A, (Z) => {
      if (Z && (Z.code === "ENOTEMPTY" || Z.code === "EEXIST" || Z.code === "EPERM")) Ur5(A, Q, G);
      else if (Z && Z.code === "ENOTDIR") G(B);
      else G(Z)
    })
  }

  function Ur5(A, Q, B) {
    CY(A), CY(Q), CY(typeof B === "function"), Q.readdir(A, (G, Z) => {
      if (G) return B(G);
      let Y = Z.length,
        J;
      if (Y === 0) return Q.rmdir(A, B);
      Z.forEach((X) => {
        FN0(wc2.join(A, X), Q, (I) => {
          if (J) return;
          if (I) return B(J = I);
          if (--Y === 0) Q.rmdir(A, B)
        })
      })
    })
  }

  function Oc2(A, Q) {
    let B;
    Q = Q || {}, Lc2(Q), CY(A, "rimraf: missing path"), CY.strictEqual(typeof A, "string", "rimraf: path should be a string"), CY(Q, "rimraf: missing options"), CY.strictEqual(typeof Q, "object", "rimraf: options should be object");
    try {
      B = Q.lstatSync(A)
    } catch (G) {
      if (G.code === "ENOENT") return;
      if (G.code === "EPERM" && zfA) Nc2(A, Q, G)
    }
    try {
      if (B && B.isDirectory()) UV1(A, Q, null);
      else Q.unlinkSync(A)
    } catch (G) {
      if (G.code === "ENOENT") return;
      else if (G.code === "EPERM") return zfA ? Nc2(A, Q, G) : UV1(A, Q, G);
      else if (G.code !== "EISDIR") throw G;
      UV1(A, Q, G)
    }
  }

  function UV1(A, Q, B) {
    CY(A), CY(Q);
    try {
      Q.rmdirSync(A)
    } catch (G) {
      if (G.code === "ENOTDIR") throw B;
      else if (G.code === "ENOTEMPTY" || G.code === "EEXIST" || G.code === "EPERM") qr5(A, Q);
      else if (G.code !== "ENOENT") throw G
    }
  }

  function qr5(A, Q) {
    if (CY(A), CY(Q), Q.readdirSync(A).forEach((B) => Oc2(wc2.join(A, B), Q)), zfA) {
      let B = Date.now();
      do try {
        return Q.rmdirSync(A, Q)
      } catch {}
      while (Date.now() - B < 500)
    } else return Q.rmdirSync(A, Q)
  }
  Mc2.exports = FN0;
  FN0.sync = Oc2
})
// @from(Ln 367963, Col 4)
$fA = U((lYY, jc2) => {
  var qV1 = OG(),
    Nr5 = AJ().fromCallback,
    _c2 = Rc2();

  function wr5(A, Q) {
    if (qV1.rm) return qV1.rm(A, {
      recursive: !0,
      force: !0
    }, Q);
    _c2(A, Q)
  }

  function Lr5(A) {
    if (qV1.rmSync) return qV1.rmSync(A, {
      recursive: !0,
      force: !0
    });
    _c2.sync(A)
  }
  jc2.exports = {
    remove: Nr5(wr5),
    removeSync: Lr5
  }
})
// @from(Ln 367988, Col 4)
bc2 = U((iYY, kc2) => {
  var Or5 = AJ().fromPromise,
    Sc2 = Q3A(),
    xc2 = NA("path"),
    yc2 = zx(),
    vc2 = $fA(),
    Tc2 = Or5(async function (Q) {
      let B;
      try {
        B = await Sc2.readdir(Q)
      } catch {
        return yc2.mkdirs(Q)
      }
      return Promise.all(B.map((G) => vc2.remove(xc2.join(Q, G))))
    });

  function Pc2(A) {
    let Q;
    try {
      Q = Sc2.readdirSync(A)
    } catch {
      return yc2.mkdirsSync(A)
    }
    Q.forEach((B) => {
      B = xc2.join(A, B), vc2.removeSync(B)
    })
  }
  kc2.exports = {
    emptyDirSync: Pc2,
    emptydirSync: Pc2,
    emptyDir: Tc2,
    emptydir: Tc2
  }
})
// @from(Ln 368022, Col 4)
uc2 = U((nYY, gc2) => {
  var Mr5 = AJ().fromCallback,
    fc2 = NA("path"),
    qt = OG(),
    hc2 = zx();

  function Rr5(A, Q) {
    function B() {
      qt.writeFile(A, "", (G) => {
        if (G) return Q(G);
        Q()
      })
    }
    qt.stat(A, (G, Z) => {
      if (!G && Z.isFile()) return Q();
      let Y = fc2.dirname(A);
      qt.stat(Y, (J, X) => {
        if (J) {
          if (J.code === "ENOENT") return hc2.mkdirs(Y, (I) => {
            if (I) return Q(I);
            B()
          });
          return Q(J)
        }
        if (X.isDirectory()) B();
        else qt.readdir(Y, (I) => {
          if (I) return Q(I)
        })
      })
    })
  }

  function _r5(A) {
    let Q;
    try {
      Q = qt.statSync(A)
    } catch {}
    if (Q && Q.isFile()) return;
    let B = fc2.dirname(A);
    try {
      if (!qt.statSync(B).isDirectory()) qt.readdirSync(B)
    } catch (G) {
      if (G && G.code === "ENOENT") hc2.mkdirsSync(B);
      else throw G
    }
    qt.writeFileSync(A, "")
  }
  gc2.exports = {
    createFile: Mr5(Rr5),
    createFileSync: _r5
  }
})
// @from(Ln 368074, Col 4)
lc2 = U((aYY, pc2) => {
  var jr5 = AJ().fromCallback,
    mc2 = NA("path"),
    Nt = OG(),
    dc2 = zx(),
    Tr5 = Ut().pathExists,
    {
      areIdentical: cc2
    } = B3A();

  function Pr5(A, Q, B) {
    function G(Z, Y) {
      Nt.link(Z, Y, (J) => {
        if (J) return B(J);
        B(null)
      })
    }
    Nt.lstat(Q, (Z, Y) => {
      Nt.lstat(A, (J, X) => {
        if (J) return J.message = J.message.replace("lstat", "ensureLink"), B(J);
        if (Y && cc2(X, Y)) return B(null);
        let I = mc2.dirname(Q);
        Tr5(I, (D, W) => {
          if (D) return B(D);
          if (W) return G(A, Q);
          dc2.mkdirs(I, (K) => {
            if (K) return B(K);
            G(A, Q)
          })
        })
      })
    })
  }

  function Sr5(A, Q) {
    let B;
    try {
      B = Nt.lstatSync(Q)
    } catch {}
    try {
      let Y = Nt.lstatSync(A);
      if (B && cc2(Y, B)) return
    } catch (Y) {
      throw Y.message = Y.message.replace("lstat", "ensureLink"), Y
    }
    let G = mc2.dirname(Q);
    if (Nt.existsSync(G)) return Nt.linkSync(A, Q);
    return dc2.mkdirsSync(G), Nt.linkSync(A, Q)
  }
  pc2.exports = {
    createLink: jr5(Pr5),
    createLinkSync: Sr5
  }
})
// @from(Ln 368128, Col 4)
nc2 = U((oYY, ic2) => {
  var wt = NA("path"),
    CfA = OG(),
    xr5 = Ut().pathExists;

  function yr5(A, Q, B) {
    if (wt.isAbsolute(A)) return CfA.lstat(A, (G) => {
      if (G) return G.message = G.message.replace("lstat", "ensureSymlink"), B(G);
      return B(null, {
        toCwd: A,
        toDst: A
      })
    });
    else {
      let G = wt.dirname(Q),
        Z = wt.join(G, A);
      return xr5(Z, (Y, J) => {
        if (Y) return B(Y);
        if (J) return B(null, {
          toCwd: Z,
          toDst: A
        });
        else return CfA.lstat(A, (X) => {
          if (X) return X.message = X.message.replace("lstat", "ensureSymlink"), B(X);
          return B(null, {
            toCwd: A,
            toDst: wt.relative(G, A)
          })
        })
      })
    }
  }

  function vr5(A, Q) {
    let B;
    if (wt.isAbsolute(A)) {
      if (B = CfA.existsSync(A), !B) throw Error("absolute srcpath does not exist");
      return {
        toCwd: A,
        toDst: A
      }
    } else {
      let G = wt.dirname(Q),
        Z = wt.join(G, A);
      if (B = CfA.existsSync(Z), B) return {
        toCwd: Z,
        toDst: A
      };
      else {
        if (B = CfA.existsSync(A), !B) throw Error("relative srcpath does not exist");
        return {
          toCwd: A,
          toDst: wt.relative(G, A)
        }
      }
    }
  }
  ic2.exports = {
    symlinkPaths: yr5,
    symlinkPathsSync: vr5
  }
})
// @from(Ln 368190, Col 4)
rc2 = U((rYY, oc2) => {
  var ac2 = OG();

  function kr5(A, Q, B) {
    if (B = typeof Q === "function" ? Q : B, Q = typeof Q === "function" ? !1 : Q, Q) return B(null, Q);
    ac2.lstat(A, (G, Z) => {
      if (G) return B(null, "file");
      Q = Z && Z.isDirectory() ? "dir" : "file", B(null, Q)
    })
  }

  function br5(A, Q) {
    let B;
    if (Q) return Q;
    try {
      B = ac2.lstatSync(A)
    } catch {
      return "file"
    }
    return B && B.isDirectory() ? "dir" : "file"
  }
  oc2.exports = {
    symlinkType: kr5,
    symlinkTypeSync: br5
  }
})
// @from(Ln 368216, Col 4)
Zp2 = U((sYY, Gp2) => {
  var fr5 = AJ().fromCallback,
    tc2 = NA("path"),
    $x = Q3A(),
    ec2 = zx(),
    hr5 = ec2.mkdirs,
    gr5 = ec2.mkdirsSync,
    Ap2 = nc2(),
    ur5 = Ap2.symlinkPaths,
    mr5 = Ap2.symlinkPathsSync,
    Qp2 = rc2(),
    dr5 = Qp2.symlinkType,
    cr5 = Qp2.symlinkTypeSync,
    pr5 = Ut().pathExists,
    {
      areIdentical: Bp2
    } = B3A();

  function lr5(A, Q, B, G) {
    G = typeof B === "function" ? B : G, B = typeof B === "function" ? !1 : B, $x.lstat(Q, (Z, Y) => {
      if (!Z && Y.isSymbolicLink()) Promise.all([$x.stat(A), $x.stat(Q)]).then(([J, X]) => {
        if (Bp2(J, X)) return G(null);
        sc2(A, Q, B, G)
      });
      else sc2(A, Q, B, G)
    })
  }

  function sc2(A, Q, B, G) {
    ur5(A, Q, (Z, Y) => {
      if (Z) return G(Z);
      A = Y.toDst, dr5(Y.toCwd, B, (J, X) => {
        if (J) return G(J);
        let I = tc2.dirname(Q);
        pr5(I, (D, W) => {
          if (D) return G(D);
          if (W) return $x.symlink(A, Q, X, G);
          hr5(I, (K) => {
            if (K) return G(K);
            $x.symlink(A, Q, X, G)
          })
        })
      })
    })
  }

  function ir5(A, Q, B) {
    let G;
    try {
      G = $x.lstatSync(Q)
    } catch {}
    if (G && G.isSymbolicLink()) {
      let X = $x.statSync(A),
        I = $x.statSync(Q);
      if (Bp2(X, I)) return
    }
    let Z = mr5(A, Q);
    A = Z.toDst, B = cr5(Z.toCwd, B);
    let Y = tc2.dirname(Q);
    if ($x.existsSync(Y)) return $x.symlinkSync(A, Q, B);
    return gr5(Y), $x.symlinkSync(A, Q, B)
  }
  Gp2.exports = {
    createSymlink: fr5(lr5),
    createSymlinkSync: ir5
  }
})
// @from(Ln 368283, Col 4)
Vp2 = U((tYY, Kp2) => {
  var {
    createFile: Yp2,
    createFileSync: Jp2
  } = uc2(), {
    createLink: Xp2,
    createLinkSync: Ip2
  } = lc2(), {
    createSymlink: Dp2,
    createSymlinkSync: Wp2
  } = Zp2();
  Kp2.exports = {
    createFile: Yp2,
    createFileSync: Jp2,
    ensureFile: Yp2,
    ensureFileSync: Jp2,
    createLink: Xp2,
    createLinkSync: Ip2,
    ensureLink: Xp2,
    ensureLinkSync: Ip2,
    createSymlink: Dp2,
    createSymlinkSync: Wp2,
    ensureSymlink: Dp2,
    ensureSymlinkSync: Wp2
  }
})
// @from(Ln 368309, Col 4)
zEA = U((eYY, Fp2) => {
  function nr5(A, {
    EOL: Q = `
`,
    finalEOL: B = !0,
    replacer: G = null,
    spaces: Z
  } = {}) {
    let Y = B ? Q : "";
    return JSON.stringify(A, G, Z).replace(/\n/g, Q) + Y
  }

  function ar5(A) {
    if (Buffer.isBuffer(A)) A = A.toString("utf8");
    return A.replace(/^\uFEFF/, "")
  }
  Fp2.exports = {
    stringify: nr5,
    stripBom: ar5
  }
})
// @from(Ln 368330, Col 4)
HN0 = U((AJY, zp2) => {
  var $EA;
  try {
    $EA = OG()
  } catch (A) {
    $EA = NA("fs")
  }
  var NV1 = AJ(),
    {
      stringify: Hp2,
      stripBom: Ep2
    } = zEA();
  async function or5(A, Q = {}) {
    if (typeof Q === "string") Q = {
      encoding: Q
    };
    let B = Q.fs || $EA,
      G = "throws" in Q ? Q.throws : !0,
      Z = await NV1.fromCallback(B.readFile)(A, Q);
    Z = Ep2(Z);
    let Y;
    try {
      Y = JSON.parse(Z, Q ? Q.reviver : null)
    } catch (J) {
      if (G) throw J.message = `${A}: ${J.message}`, J;
      else return null
    }
    return Y
  }
  var rr5 = NV1.fromPromise(or5);

  function sr5(A, Q = {}) {
    if (typeof Q === "string") Q = {
      encoding: Q
    };
    let B = Q.fs || $EA,
      G = "throws" in Q ? Q.throws : !0;
    try {
      let Z = B.readFileSync(A, Q);
      return Z = Ep2(Z), JSON.parse(Z, Q.reviver)
    } catch (Z) {
      if (G) throw Z.message = `${A}: ${Z.message}`, Z;
      else return null
    }
  }
  async function tr5(A, Q, B = {}) {
    let G = B.fs || $EA,
      Z = Hp2(Q, B);
    await NV1.fromCallback(G.writeFile)(A, Z, B)
  }
  var er5 = NV1.fromPromise(tr5);

  function As5(A, Q, B = {}) {
    let G = B.fs || $EA,
      Z = Hp2(Q, B);
    return G.writeFileSync(A, Z, B)
  }
  var Qs5 = {
    readFile: rr5,
    readFileSync: sr5,
    writeFile: er5,
    writeFileSync: As5
  };
  zp2.exports = Qs5
})
// @from(Ln 368395, Col 4)
Cp2 = U((QJY, $p2) => {
  var wV1 = HN0();
  $p2.exports = {
    readJson: wV1.readFile,
    readJsonSync: wV1.readFileSync,
    writeJson: wV1.writeFile,
    writeJsonSync: wV1.writeFileSync
  }
})
// @from(Ln 368404, Col 4)
LV1 = U((BJY, Np2) => {
  var Bs5 = AJ().fromCallback,
    UfA = OG(),
    Up2 = NA("path"),
    qp2 = zx(),
    Gs5 = Ut().pathExists;

  function Zs5(A, Q, B, G) {
    if (typeof B === "function") G = B, B = "utf8";
    let Z = Up2.dirname(A);
    Gs5(Z, (Y, J) => {
      if (Y) return G(Y);
      if (J) return UfA.writeFile(A, Q, B, G);
      qp2.mkdirs(Z, (X) => {
        if (X) return G(X);
        UfA.writeFile(A, Q, B, G)
      })
    })
  }

  function Ys5(A, ...Q) {
    let B = Up2.dirname(A);
    if (UfA.existsSync(B)) return UfA.writeFileSync(A, ...Q);
    qp2.mkdirsSync(B), UfA.writeFileSync(A, ...Q)
  }
  Np2.exports = {
    outputFile: Bs5(Zs5),
    outputFileSync: Ys5
  }
})
// @from(Ln 368434, Col 4)
Lp2 = U((GJY, wp2) => {
  var {
    stringify: Js5
  } = zEA(), {
    outputFile: Xs5
  } = LV1();
  async function Is5(A, Q, B = {}) {
    let G = Js5(Q, B);
    await Xs5(A, G, B)
  }
  wp2.exports = Is5
})
// @from(Ln 368446, Col 4)
Mp2 = U((ZJY, Op2) => {
  var {
    stringify: Ds5
  } = zEA(), {
    outputFileSync: Ws5
  } = LV1();

  function Ks5(A, Q, B) {
    let G = Ds5(Q, B);
    Ws5(A, G, B)
  }
  Op2.exports = Ks5
})
// @from(Ln 368459, Col 4)
_p2 = U((YJY, Rp2) => {
  var Vs5 = AJ().fromPromise,
    HU = Cp2();
  HU.outputJson = Vs5(Lp2());
  HU.outputJsonSync = Mp2();
  HU.outputJSON = HU.outputJson;
  HU.outputJSONSync = HU.outputJsonSync;
  HU.writeJSON = HU.writeJson;
  HU.writeJSONSync = HU.writeJsonSync;
  HU.readJSON = HU.readJson;
  HU.readJSONSync = HU.readJsonSync;
  Rp2.exports = HU
})