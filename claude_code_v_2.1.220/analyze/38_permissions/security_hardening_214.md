# The 2.1.214 Bash-permission hardening sweep

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). Baseline `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`,
always tagged `(193)`.

`2.1.214` shipped nine permission bullets in one release. They are not nine features — they are nine
*narrow* repairs to one mature machine: the static Bash analyzer that decides whether a command can be
auto-approved. This document locates the changed line for each, and says plainly which bullets are
carryover dressed up as new.

The single most important structural fact about this release: **six of the nine bullets are one-line or
one-list changes inside code that already existed in 2.1.193.** Two of them are *deletions*. One of them
(`.214` #2) cannot be anchored at all, and the anchor previously proposed for it is wrong.

---

## 0. The machine being patched

The analyzer has four layers, and the `.214` sweep touched three of them:

| Layer | Entry point (220) | What it decides | `.214` bullets landing here |
|---|---|---|---|
| Parse-tree audit | `Xnr` → the audit at `:209786-209814` | "did tree-sitter see the same bytes bash will?" | #3 (fd redirects), #5 (zsh `[[ ]]`) |
| Command walk | `Rie` `:209829` | per-node semantic extraction | #5 |
| Read-only flag tables | `:392409` (`file`), `:392521` (`man`), `:392566` (`help`), `:213928` (`hYr`) | "is this argv provably read-only?" | #6, #14, #45 |
| Length / tokenizer guard | `AIe = 1e4` `:512643`, `Fsn` `:512253` | "is the command analyzable at all?" | #4 |

Everything the analyzer cannot prove read-only becomes `behavior: "ask"` or
`behavior: "passthrough"` with a `too-complex` reason string. The reason strings are the stable
anchors — they are user-visible and therefore rarely churned for cosmetics.

---

## 1. Bullet #3 — fd-redirect forms now fail closed

> *"Fixed Bash permission checks to fail closed on file-descriptor redirect forms that bash parses
> differently than the permission analyzer."*

**Verdict: NET_NEW.** `Close-fd redirect is followed by a word` 220=2 / 193=0;
`bash treats the dash as close-fd` 220=3 / 193=0.

### The redirect structural pre-audit

**What it does:** Runs a structural audit over *every* `file_redirect` node in the parse tree before the
semantic walk starts, so a redirect in a shape the walker never visits can no longer slip through
unaudited.

**How it works:**

1. `Xnr(command)` parses, then checks byte coverage (`Parser skipped input between top-level statements`
   `:209804`, `Parser did not consume trailing input` `:209807`).
2. **NEW:** a whole-tree redirect sweep `M0u(tree)` (`:209809`) runs *before* `G9g(tree)` (`:209812`),
   which is the command walk.
3. `M0u` (`:210603-210613`) recurses over all nodes; for each node of type `file_redirect` it calls the
   new auditor `P0u`.
4. `P0u` (`:210540-210602`) does two things:
   - a **gap-byte audit**: every byte of the redirect node not covered by a child must match
     `/^(?:[ \t]|\\\n)*$/`, else `Redirect has unparsed bytes between children` (`:210552`) /
     `Redirect has unparsed trailing bytes` (`:210564`);
   - a **token-shape audit** with four refusals: fd-variable assignment (`:210575`),
     `>&`/`<&` target starting with `-` (`:210590`), a word after `>&-`/`<&-` (`:210595`), and more than
     one redirect target (`:210600`).

```javascript
// ============================================
// auditRedirectNodeStructure - the new fail-closed redirect auditor (excerpt)
// Location: cli_inner_pretty.js:210568-210601
// ============================================

// ORIGINAL (for source lookup):
  let t = null,
    r = 0;
  for (let n of e.children) {
    if (!n) continue;
    if (n.type === "variable_name")
      return { kind: "too-complex", reason: `Redirect uses ${n.text} fd-variable assignment — modifies shell variable as side effect` };
    if (n.type === "file_descriptor") continue;
    if (n.type === ">&-" || n.type === "<&-") { t = n.type; continue; }
    if (n.type in Dss) { t = n.type; continue; }
    if ((t === ">&" || t === "<&") && n.text.startsWith("-"))
      return { kind: "too-complex", reason: "Redirect target after >& or <& starts with - — bash treats the dash as close-fd and passes the rest to the command as a hidden argument" };
    if (t === ">&-" || t === "<&-")
      return { kind: "too-complex", reason: "Close-fd redirect is followed by a word — bash passes it to the command as a hidden argument" };
    (r++, (t = null));
  }
  if (r > 1) return { kind: "too-complex", reason: "Redirect has multiple targets — post-redirect args swallowed" };
  return null;

// READABLE (for understanding):
  let lastOperator = null,
    targetCount = 0;
  for (let child of node.children) {
    if (!child) continue;
    if (child.type === "variable_name")            // e.g.  exec {fd}>file
      return tooComplex(`Redirect uses ${child.text} fd-variable assignment — modifies shell variable as side effect`);
    if (child.type === "file_descriptor") continue; // the leading  2  in  2>&1
    if (child.type === ">&-" || child.type === "<&-") { lastOperator = child.type; continue; }
    if (child.type in REDIRECT_OPERATORS)           { lastOperator = child.type; continue; }
    if ((lastOperator === ">&" || lastOperator === "<&") && child.text.startsWith("-"))
      return tooComplex("Redirect target after >& or <& starts with - — bash treats the dash as close-fd and passes the rest to the command as a hidden argument");
    if (lastOperator === ">&-" || lastOperator === "<&-")
      return tooComplex("Close-fd redirect is followed by a word — bash passes it to the command as a hidden argument");
    (targetCount++, (lastOperator = null));
  }
  if (targetCount > 1) return tooComplex("Redirect has multiple targets — post-redirect args swallowed");
  return null;

// Mapping: P0u→auditRedirectNodeStructure, Dss→REDIRECT_OPERATORS, e→node, t→lastOperator, r→targetCount
```

**Why this approach:** the analyzer's job is to reconstruct the argv that bash will hand to `execve`.
The three refused shapes are all cases where **bash moves a token from the redirect into argv**:

- `cmd >&-foo` — bash reads `>&-` as *close stdout*, then `foo` becomes an argument of `cmd`. The
  analyzer's grammar attaches `foo` to the redirect, so the reconstructed argv is missing an argument.
  If `cmd` is `git` and the missing argument is `push`, an allow rule for `git status` matched.
- `cmd >&-` followed by a word: same swallow.
- `exec {v}>file` — the redirect *assigns a shell variable* as a side effect, which the analyzer's
  variable-tracking map would not record.

**Why the pre-pass instead of patching the walker?** 2.1.193 already had the same three-way check
(`fd-variable assignment` 193=1, `Redirect has multiple targets` 193=1) — but only *inside* the redirect
analyzer `$ss` (220 `:210615`, 193 `:224480`-ish), which the walker calls only when it has already
recognised the enclosing command shape. Anything that ended up in an unrecognised shape reached the
generic `BS(node)` refusal or, worse, a shape the walker treated as benign. 220's answer is to hoist the
audit to a tree-wide pre-pass so it is **unconditional**:

| | 2.1.193 | 2.1.220 |
|---|---|---|
| audit call sites | 1 (inside `$ss`) | 3 (`M0u` tree pre-pass `:209809`, `$ss` head `:210620`, plus `P0u`'s own body) |
| control flow at the audit point | `let l = I5d(t);` immediately (`:223886 (193)`) | `{ let c = M0u(t); if (c) return c; } let l = G9g(t);` (`:209808-209812`) |
| `>&-`-followed-by-word | not detected | refused |
| `>& -foo` dash-target | not detected | refused |

**Key insight:** the fix is *three lines of control flow*, not a new analysis. The interesting engineering
decision is that they duplicated the check rather than removing the inner one — because `$ss` is also
reached from paths that never go through `Xnr` (e.g. the `heredoc`/`process_substitution` recursion), so
removing the inner call would have opened a different hole. Belt-and-braces at the cost of running the
same regexes twice on the common path.

---

## 2. Bullet #5 — zsh variable subscripts in `[[ ]]`

> *"Fixed Bash permission checks treating zsh variable subscripts and modifiers in `[[ ]]` comparisons as
> inert text — these commands now prompt for approval."*

**Verdict: NET_NEW, but the anchor everyone reaches for first is CARRYOVER.**

This is a trap worth spelling out. The obvious grep is the reason string:

| literal | 220 | 193 |
|---|---|---|
| `zsh $name[expr] / $name:mod in bare concatenation — recursive eval` | 1 (`:211212`) | **1** (`:225032 (193)`) |
| `zsh $name[expr] / $name:mod in [[ ]] operand — recursive eval` | 1 (`:210371`) | **0** |

So the *bare-concatenation* variant of this rule already shipped in 2.1.193. The delta is the **`[[ ]]`
operand** variant. A `grep -c 'zsh \$name'` returns 220=2 / 193=1 and would be read as "mostly
carryover"; only splitting the two strings shows what changed.

### The `[[ ]]` operand walker

**What it does:** `L0u` (`:210357-…`) walks a `test_command` subtree and, for expansions inside
`unary_expression` / `binary_expression` / `negated_expression` / `parenthesized_expression`
(`I0u`, `:212458`), refuses when the expansion is immediately followed by a `[` or `:<letter>` token.

```javascript
// ============================================
// walkTestCommandOperand - refuses zsh subscript/modifier syntax inside [[ ]]
// Location: cli_inner_pretty.js:210357-210374
// ============================================

// ORIGINAL (for source lookup):
function L0u(e, t, r, n, o) {
  if (I0u.has(e.type)) {
    for (let i = 0; i < e.children.length; i++) {
      let s = e.children[i];
      if (!s) continue;
      if (
        (s.type === "simple_expansion" || s.type === "expansion") &&
        (e.children[i + 1]?.text.startsWith("[") ||
          /^:[a-zA-Z&]/.test(e.children[i + 1]?.text ?? "") ||
          (s.children.some((l) => l?.type === "special_variable_name") &&
            /^\w*(\[|:[a-zA-Z&])/.test(e.children[i + 1]?.text ?? "")))
      )
        return { kind: "too-complex", reason: "zsh $name[expr] / $name:mod in [[ ]] operand — recursive eval", nodeType: e.type, differential: !0 };
      let a = L0u(s, t, r, n, o);
      if (a) return a;
    }
    return null;
  }
  ...
}

// READABLE (for understanding):
function walkTestCommandOperand(node, argvOut, commandsOut, varMap, scopeStack) {
  if (TEST_CONTAINER_NODE_TYPES.has(node.type)) {
    for (let i = 0; i < node.children.length; i++) {
      let child = node.children[i];
      if (!child) continue;
      let next = node.children[i + 1]?.text ?? "";
      if (
        (child.type === "simple_expansion" || child.type === "expansion") &&
        (next.startsWith("[") ||                                     //  $arr[1]
          /^:[a-zA-Z&]/.test(next) ||                                //  $v:h  $v:gs/a/b/
          (child.children.some((c) => c?.type === "special_variable_name") &&
            /^\w*(\[|:[a-zA-Z&])/.test(next)))                       //  $0:A  $#name[...]
      )
        return tooComplex("zsh $name[expr] / $name:mod in [[ ]] operand — recursive eval",
                          { nodeType: node.type, differential: true });
      let inner = walkTestCommandOperand(child, argvOut, commandsOut, varMap, scopeStack);
      if (inner) return inner;
    }
    return null;
  }
  ...
}

// Mapping: L0u→walkTestCommandOperand, I0u→TEST_CONTAINER_NODE_TYPES, e→node, s→child
```

**Why refuse instead of model it?** In zsh, `${v:s/a/b}` and `$v[2,-1]` are *evaluated*, and history-style
modifiers can re-invoke the parser (`:h`, `:t`, `:e`, `:r`, `:gs`, and `:A` which resolves symlinks by
calling out). Faithfully modelling that is a second interpreter. The analyzer instead marks the node
`differential: !0` — its term of art for "bash and zsh disagree here, so any conclusion is unsound" —
and hands the command to the human. Note the third disjunct: `special_variable_name` followed by
`\w*(\[|:…)` catches `$0:A`, where the variable name is a single special character and tree-sitter
lumps the following characters into the *next* sibling.

### The second, undocumented half of bullet #5: `test_command` gained a gap audit

`.214` also extended the **byte-coverage audit** to test commands. This is not mentioned in the changelog.

| literal | 220 | 193 |
|---|---|---|
| `Redirect has unparsed bytes between children` | 1 (`:210552`) | 1 (`:224470 (193)`) |
| `Concatenation has unparsed bytes between children` | 1 (`:211202`) | 1 (`:225022 (193)`) |
| `Test command has unparsed bytes between children` | 1 (`:210338`) | **0** |
| `Test command has unparsed bytes after its last child` | 1 (`:210352`) | **0** |
| `Test command child extends past the node span — gap byte accounting is untrustworthy` | 1 (`:210331`) | **0** |
| `Test command has a synthesized zero-width token — parser diverged from shell` | 1 (`:210396`) | **0** |

The 2.1.193 `test_command` branch (`:224234-224251 (193)`) goes straight into the child loop. 2.1.220
(`:210190-210211`) prefixes it with `R0u(node, node.children.some(c => c?.type === "[["))`:

```javascript
// ============================================
// analyzeTestCommand - 220 prefixes the child walk with a byte-coverage audit
// Location: cli_inner_pretty.js:210190-210211
// ============================================

// ORIGINAL (for source lookup):
  if (e.type === "test_command") {
    let o = R0u(
      e,
      e.children.some((s) => s?.type === "[["),
    );
    if (o) return o;
    let i = ["[["];
    ...
  }

// READABLE (for understanding):
  if (node.type === "test_command") {
    let gapFailure = auditTestCommandByteCoverage(
      node,
      node.children.some((c) => c?.type === "[["),   // second arg: is this [[ ]] (vs [ ])?
    );
    if (gapFailure) return gapFailure;
    let argv = ["[["];
    ...
  }

// Mapping: R0u→auditTestCommandByteCoverage, _0u→isIgnorableGapBytes, e→node
```

`_0u(gapText, isDoubleBracket)` (`:210282-210322`) is the gap classifier: whitespace and line
continuations are always ignorable; `#` comments are ignorable **only inside `[[ ]]`**, because inside
`[ ]` (an ordinary command) a `#` is just an argument. That flag is why the audit takes a second
parameter rather than being a pure function of the node.

**Key insight:** the technique (compare parsed spans against raw bytes, refuse on any uncovered byte
that is not whitespace) was invented for redirects and concatenations in an earlier release. `.214`
*generalized* it to a third node type. Recognising that pattern is worth more to a reader than the
individual reason strings: the analyzer's security posture is "prove the parser saw every byte", and the
work item is "extend that proof to node type N".

---

## 3. Bullet #4 — commands over 10,000 characters

> *"Fixed Bash permission checks misjudging very long commands — commands over 10,000 characters now
> always prompt instead of running automatically."*

**Verdict: one new guard; every other over-length site is byte-equivalent carryover.** This is worked
end-to-end in [`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md) §6.4;
what follows is the confirmation from re-reading the three 2.1.220 lines and the parts §6.4 leaves open.

Re-read in 2.1.220:

- `:512643` — `AIe = 1e4` (a bare `var` initialiser in a declaration list, no gate, no env override).
- `:512253` — `function Fsn(e) { return Wss.test(e) || qss.test(e) || Vss.test(e) || tuo.test(e) || ruo.test(e) || Yss.test(e); }`
  — the six-regex "bash and the analyzer tokenize this differently" predicate.
- `:390644` — `if (e.command.length > AIe || Fsn(e.command))` inside the `sed` guard, whose refusal at
  `:390646-390652` carries `bashMissKind: "sed-dangerous"`.
- `:392119` — **the new line**:

```javascript
// ============================================
// classifyReadOnlyCommand - the one new over-length guard in .214
// Location: cli_inner_pretty.js:392117-392121
// ============================================

// ORIGINAL (for source lookup):
function tvd(e, t) {
  let { command: r } = e;
  if (r.length > AIe) return { behavior: "passthrough", message: "Command too long for read-only analysis" };
  let n = vN().parse(r),
    o = n ? rDt(r, n) : { kind: "simple", commands: [], bareAssignmentNames: [] };
  ...
}

// READABLE (for understanding):
function classifyReadOnlyCommand(bashInput, ctx) {
  let { command } = bashInput;
  if (command.length > MAX_ANALYZABLE_COMMAND_CHARS)                    // 1e4
    return { behavior: "passthrough", message: "Command too long for read-only analysis" };
  let tree = getShellParser().parse(command),
    walk = tree ? walkCommandTree(command, tree) : { kind: "simple", commands: [], bareAssignmentNames: [] };
  ...
}

// Mapping: tvd→classifyReadOnlyCommand, AIe→MAX_ANALYZABLE_COMMAND_CHARS, vN→getShellParser, rDt→walkCommandTree
```

`Command too long for read-only analysis` is **220=1 / 193=0** — the only genuinely new string in the
cluster.

**Why `passthrough` and not `ask`?** `tvd` is the *read-only* fast path: its job is to answer "can I
prove this is read-only and skip the rest of the pipeline?". `passthrough` means "I have no opinion",
so control falls through to the full permission pipeline, which will reach the `ask` default. Returning
`ask` here would have been wrong because a deny rule further down must still be able to fire.

**Why 10,000?** The constant is shared with the tokenizer-divergence guard and with the
truncate-then-match sites (below), and it is not tunable. The clue to its origin is
`Lo_` (`:442699-442702`), which uses the same `1e4`:

```javascript
function Lo_(e) {
  let t = e.length > 1e4 ? e.slice(0, 1e4) : e;
  return Ro_.test(t);
}
```

Regex work on adversarial multi-kilobyte strings is where catastrophic backtracking lives; 10 KB bounds
the worst case while comfortably exceeding any real interactive command. Note the *asymmetry* this
creates and which `.214` deliberately introduced: the **read-only prover** bails out over 10 KB (fail
closed), while the **danger matchers** truncate to 10 KB and keep matching (fail closed the other way —
better to match a dangerous pattern in the first 10 KB than to skip the check).

That second half is invisible in the changelog. In 2.1.193 the danger-pattern entry point simply gave
up: `if (e.length > 1e4) return null;` (`:150813 (193)`) — *no patterns matched at all*, which means an
over-length command could evade the `rm -rf` matcher entirely. 2.1.220 replaced `return null` with
truncate-and-match at `:223566`, `:315070`, and `:442700`. **So `.214` closed two long-command holes and
only documented one.**

Carryover in the same cluster, do not present as new: `sed command requires approval …` 3/3;
`redirect-borne` 2/2; `command is over-length or contains characters bash and the analyzer tokenize
differently` 1/1; `bashMissKind` 220=22 / **193=23** (it shrank). The literal `10,000 characters`
(`:205495`) is a decoy — it is the Windows sandbox argv-length message.

---

## 4. Bullet #6 — `help` and `man` no longer auto-approved

> *"Fixed Bash permission checks to no longer auto-approve certain `help` and `man` commands that could
> run unsafe options, command substitutions, or backslash paths."*

**Verdict: NET_NEW, and it is a two-part change — one table shrank, one callback grew.**

### 4a. `help` lost two safe flags and gained a callback

| | 2.1.193 (`:306065`) | 2.1.220 (`:392566-392570`) |
|---|---|---|
| shape | `help: { safeFlags: { "-d": "none", "-m": "none", "-s": "none" } }` | `help: { additionalCommandIsDangerousCallback: …, safeFlags: { "-d": "none" } }` |
| safe flags | `-d`, `-m`, `-s` | `-d` only |
| extra guard | none | `t.some((r) => r.includes("/") \|\| r.includes("\\") \|\| r.includes("~") \|\| Lf(r))` |

`Lf` (`:209614-209616`) is `e.includes(ENe) || e.includes(Jb)` — the analyzer's two sentinel markers
for "this token contained a command substitution / an unresolvable expansion". So the new callback
refuses any `help` argument that looks like a path (`/`, `\`, `~`) or carries a substitution.

Why did `-m` and `-s` have to go? Bash's `help -m` renders in man-page format and `help -s` prints a
usage synopsis — harmless in bash. But `help` is also an *external* binary on several systems and a
common shell-function name; the flag table is keyed on the bare command name, not on a proven builtin.
Keeping only `-d` (short description) reduces the surface that a shadowing `help` in `$PATH` could
exploit.

### 4b. `man` gained command-substitution and backslash/tilde detection

The `man` callback is 29 lines in both builds and differs in exactly two statements. 2.1.193
(`:306046-306047`):

```javascript
if (((i = !0), o && l.startsWith("-"))) return !0;
if (!s && l.includes("/")) return !0;
```

2.1.220 (`:392546-392548`):

```javascript
if (((s = !0), Lf(l))) return !0;                                       // NEW: command substitution
if (o && l.startsWith("-")) return !0;
if (!i && (l.includes("/") || l.includes("\\") || l.includes("~"))) return !0;   // NEW: \ and ~
```

Three additions: (1) a `Lf` command-substitution check that fires *before* the flag checks, (2) `\\`
and (3) `~` added to the path-detection disjunct. The reason `~` matters is that `man` invokes a pager
and a `MANPATH`-relative lookup; `man ~/x` reaches an arbitrary file, and `man 'a\b'` reaches one whose
name the analyzer's own unescaping would have normalised differently.

**Key insight:** both halves are the same design move — *stop trusting the flag table alone*. The table
answers "is this flag read-only?"; the callback answers "is this argv shape analyzable?". `.214` added
callbacks precisely where a read-only-looking command can still name an arbitrary path.

---

## 5. Bullet #45 — `file -m` / `-f` removed from the read-only table

> *"Changed `file` commands using `-m`/`--magic-file` or `-f`/`--files-from` to require permission
> instead of being auto-allowed as read-only."*

**Verdict: NET_NEW — verified as a deletion.** `"--magic-file"` is 220=**0** / 193=1.

Diffing `file.safeFlags` (220 `:392410-392445`, 193 `:305907-305945`), exactly three keys were deleted:

```
- "-f": "string"            (193:305921)     -> gone
- "--magic-file": "string"  (193:305931)     -> gone
- "-m": "string"            (193:305932)     -> gone
```

`-F`/`--separator` (the output separator) survive at `:392424-392425`, and every other entry is
byte-identical.

**Correction to the changelog:** the bullet names `--files-from` as one of the removed spellings. The long
form `--files-from` **never existed in the table** — 193 listed only the short `-f`. So the accurate
statement is "`-m`, `--magic-file`, and `-f` were removed"; `--files-from` was already not auto-allowed
because unknown flags fall through to the "not provably read-only" path. Minor, but it is the kind of
detail that makes a reader mistrust a doc if it is copied instead of checked.

**Why these three:** `file -m <magicfile>` loads an arbitrary magic database, and libmagic's parser has a
long CVE history; `file -f <listfile>` reads its target list from a file, so the paths `file` touches are
not visible in the argv the analyzer inspected. Both break the invariant that a read-only classification
covers *the paths named on the command line*.

---

## 6. Bullet #14 — `docker` daemon-redirect flags

> *"Added permission prompts for `docker` commands (including the Podman `docker` shim) carrying
> daemon-redirect flags (`--url`, `--connection`, `--identity`, and Podman's remote mode) that previously
> ran without one."*

**Verdict: NET_NEW — the predicate is byte-identical; the flag list nearly doubled.**

| | 2.1.193 | 2.1.220 |
|---|---|---|
| list symbol / line | `oYi` `:227647 (193)` | `hYr` `:213928-213944` |
| entries | 8 | **15** |
| short-flag index | `j5d = new Set(oYi.filter(e => e.length === 2).map(e => e[1]))` `:227648 (193)` | `ozg` (same expression) `:213945` |
| predicate | `uDn` `:226559-226568 (193)` | `cuo` `:212834-212843` — same 10 lines |
| second consumer | none | `yLd` / `WQy` `:428146-428147` (the PowerShell tool's own copy) |

New entries: `-r`, `--url`, `--connection`, `--identity`, `--remote`, `--module`, `--out`.
`"--connection"` is 220=1 (`:213939`) / 193=0.

```javascript
// ============================================
// hasDockerDaemonRedirectFlag - detects a docker/podman flag that retargets the daemon
// Location: cli_inner_pretty.js:212834-212843
// ============================================

// ORIGINAL (for source lookup):
function cuo(e) {
  return e.some((t) => {
    if (hYr.some((n) => t === n || t.startsWith(`${n}=`) || (n.length === 2 && t.length > 2 && t.startsWith(n))))
      return !0;
    let r = t.match(/^-([A-Za-z]+)/)?.[1];
    if (r !== void 0 && r.length >= 2) {
      for (let n of r) if (ozg.has(n)) return !0;
    }
    return !1;
  });
}

// READABLE (for understanding):
function hasDockerDaemonRedirectFlag(argv) {
  return argv.some((arg) => {
    if (DAEMON_REDIRECT_FLAGS.some((flag) =>
          arg === flag ||                                          //  --host
          arg.startsWith(`${flag}=`) ||                            //  --host=tcp://…
          (flag.length === 2 && arg.length > 2 && arg.startsWith(flag))))   //  -Htcp://…
      return true;
    let bundled = arg.match(/^-([A-Za-z]+)/)?.[1];                 //  -itH  (bundled shorts)
    if (bundled !== undefined && bundled.length >= 2) {
      for (let ch of bundled) if (DAEMON_REDIRECT_SHORT_CHARS.has(ch)) return true;
    }
    return false;
  });
}

// Mapping: cuo→hasDockerDaemonRedirectFlag, hYr→DAEMON_REDIRECT_FLAGS, ozg→DAEMON_REDIRECT_SHORT_CHARS
```

**Why this matters at all:** `docker logs` and `docker inspect` are in the read-only table
(`:213947-213964`), each with `additionalCommandIsDangerousCallback: (e, t) => cuo(t)`. An allow rule for
`docker inspect` is a statement about *this machine's* daemon. `docker --host tcp://evil:2375 inspect …`
or `podman --url ssh://…` sends the same read-only verb to a *different* daemon — which is a network
egress and an authentication event, not a local read. The 2.1.193 list covered the Docker CLI's own
spellings (`-H`, `--host`, `--context`, `--config`, TLS material); `.214` adds Podman's
(`--url`, `--connection`, `--identity`, `--remote`, `--module`, `--out`) plus the short `-r`
(`podman --remote`).

The consumer at `:391722` shows how it composes:

```javascript
if (o[0] === "docker" && (cuo(e) || e.slice(o.length).some(Lf))) return !1;
```

A `docker`-prefixed read-only entry is disqualified if any argument is a daemon-redirect flag **or** if
any argument after the matched subcommand carries a command-substitution sentinel. Two independent
disqualifiers on one table row.

**Key insight:** the short-flag bundling branch is the part that is easy to get wrong and easy to miss.
Without it, `docker -itH tcp://evil inspect x` bypasses the whole check, because `-itH` matches none of
the 15 literal spellings. `ozg` exists purely to catch that, and it is derived from the list rather than
hand-written so the two can never drift.

---

## 7. Bullet #1 and #44 — single-segment `dir/**`

These two bullets are one function. They are documented in
[`rule_matching_and_glob_semantics.md`](rule_matching_and_glob_semantics.md) §1, because the interesting
part is the *asymmetry between rule behaviours*, which belongs with the rule matcher rather than with the
Bash analyzer.

---

## 8. Bullet #2 — the PowerShell 5.1 bypass: ANCHORED IN THE SANDBOX GATE, not the permission path

> *"Fixed a permission-check bypass affecting commands run in Windows PowerShell 5.1 sessions."*

> ✅ **RESOLVED — this section's original "UNANCHORED" verdict was wrong.** It was corrected by the
> `by_version/2.1.214.md` pass and re-verified by the orchestrator against both bundles.
> **Verdict: DELTA.** The fix is real, but it lives in the **sandbox exclusion gate**, which is why a
> search of the permission analyzer found nothing:
> `nDd` `:512802-512807` resolves `sandbox.excludedCommands` and is consumed by `H4` `:512818-512826`;
> the decisive literal `must run sandboxed even when a statement matches an exclusion` is
> **220=1 / 193=0**. Full analysis in
> [`../49_sandbox/windows_user_sandbox.md`](../49_sandbox/windows_user_sandbox.md) §5.3–5.4 and
> [`../by_version/2.1.214.md`](../by_version/2.1.214.md) §3.3.
>
> **Lesson worth keeping:** an exclusion list that the *permission* layer honours but the *sandbox*
> layer must override is a cross-layer invariant. Searching one layer for a bullet owned by the other
> is how this was missed. The paragraph below remains correct about the scoping pass's bad anchor.

The anchor recorded for this bullet in the scoping pass (`:169565`) is a **different bullet**.

What `:169565` actually is:

```javascript
P$g =
  "try { $PSDefaultParameterValues['Out-File:Encoding'] = 'utf8' } catch {}; if ($ExecutionContext.SessionState.LanguageMode -eq 'FullLanguage') { try { $OutputEncoding = [System.Text.UTF8Encoding]::new() } catch {}; if ($null -ne $PSStyle) { try { $PSStyle.OutputRendering = 'PlainText' } catch {} } }; ",
```

This is the **PowerShell command prologue**, and it is genuinely net-new (220=1 / 193=0): 2.1.193 built
the command as `a = n + i` (`:301570 (193)`), 2.1.220 builds it as
`l = (M$g(r) ? "" : P$g) + r + s` (`:169535`). But it is an *encoding* fix — it maps to `.214` #25
(`>`/`>>` writing UTF-16LE) and #22/#23 (Python `PYTHONIOENCODING`/`NO_COLOR`, `O$g` at `:169575`), not
to a permission check.

The prologue's suppression predicate is a nice detail in its own right. `M$g` (`:169486-169510`) skips
comments and block comments, then tests whether the command *begins* with a construct PowerShell
requires to be first in a script:

```javascript
/^using\s+(namespace|module|assembly)\b/i.test(r) ||
/^param\s*\(/i.test(r) ||
/^(begin|process|end|clean|dynamicparam)\s*\{/i.test(r) ||
(/^\[\w/.test(r) && !/^\[[\w.]+\]::/.test(r))
```

Prepending anything before `using` or `param(` is a hard parse error, so those commands get no prologue
and forgo the encoding fix rather than failing outright. The last clause is the subtle one: a leading
`[Something]` is an *attribute* (must be first) unless it is `[Type]::Member`, which is an expression
and may be preceded.

Why I am calling the bullet unanchored rather than guessing:

- `PowerShell 5.1` is **220=3 / 193=3**, and all three are carryover strings: the cwd-first shadowing
  refusal (`:430349`, 193 `:450290`) and two system-prompt edition blurbs (`:430575`, `:430578`).
- `LanguageMode` 220=2 / 193=1 — the extra site is the prologue above.
- `ConstrainedLanguage` 2/2, `ErrorActionPreference` 1/1, `--%` (stop-parsing) 4/4,
  `Invoke-Expression` 4/4, `splatting` 1/1, `stop-parsing` 2/2 — every PowerShell-parser landmark
  literal is identical.
- There is no version-detection predicate to point at: `psEdition`, `PSVersionTable`,
  `isWindowsPowerShell` are **0/0** in both builds.

The honest conclusion is that this fix is either (a) inside the PowerShell tokenizer's non-string logic,
which a literal diff cannot see, or (b) the same change as `.216` #22 (invisible-Unicode validation in
the PowerShell tool, `:323491`) reported under a different framing. I have not proven either, so it stays
unanchored. Anyone continuing this should diff `430000-431500` (220) against `450000-451500` (193)
statement by statement rather than by literal.

---

## 9. Bullet #7 — remote-session prompt ordering: UNANCHORED, and its proposed anchor is also wrong

> *"Fixed permission prompts on remote sessions that could proceed before the local confirmation dialog."*

**Verdict: UNANCHORED. The recorded anchor `tengu_rc_permission_nudge` is a different feature entirely.**

`tengu_rc_permission_nudge` is 220=2 / 193=0, which is why it was picked up. Reading both sites shows it
is a **growth upsell**, not an ordering guard:

- `:720479-720493` — `f5a()` resolves a three-field nudge config from
  `CLAUDE_CODE_RC_PERMISSION_NUDGE` (env, JSON) then the gate `tengu_rc_permission_nudge` (`:720487`),
  with `afterPromptCount` (floored at 1), `probability`, and `maxImpressions`.
- `:816798-816818` — after `afterPromptCount` permission prompts, with probability `probability`, it
  queues a banner `"Approve tool calls from your phone · <link>"` and emits
  `tengu_rc_permission_nudge_shown` with `permission_mode` and `prompt_count`.

That is a *marketing* impression counter keyed off the permission-prompt count. Citing it as the fix for
a prompt-ordering race would be wrong.

What the bundle *does* contain, and what is probably the real home of this bullet plus `.217`'s
"Remote Control sessions not showing a pending permission prompt … to viewers that connected after it
appeared", is the **pending-request replay channel**:

| anchor | 220 | 193 |
|---|---|---|
| `pending_permission_requests` | 12 | 9 |
| `pending_user_dialog_requests` | 12 | 9 |
| `getPendingPermissionRequests` | 6 | 6 |
| `processPendingPermissionRequests` | 2 | 2 |

Three new sites each, with the accessor and processor unchanged — i.e. the *mechanism* is carryover and
the *wiring* grew. The new documentation string at `:839684` states the contract, and it is the clearest
statement of intent in the area:

> `request_user_dialog requests still awaiting a response. Sent on the `initialize` response (sibling of
> pending_permission_requests) so a client joining an already-initialized session can re-arm in-flight
> dialogs. Receivers must tolerate the same request_id also arriving as a live or replayed
> control_request frame and render it once.`

Consumers: `:548627-548630` and `:548739-548742` (the SDK client de-structures both lists out of the
`initialize` response and re-arms them), `:755678-755680` (a second transport), `:839692`/`:839701`
(emission), `:840021` (a count in a status payload), `:849408`. This is idempotent replay on connect —
which explains `.217` well. It does not by itself explain "proceeded before the local dialog", so I am
recording `.214` #7 as unanchored and pointing the reader at
[`../54_remote_control/`](../54_remote_control/) for the transport side.

---

## 10. Summary table for the `.214` sweep

| # | Bullet | Verdict | Anchor (2.1.220) | 220 / 193 |
|---|---|---|---|---|
| 1 | `Edit(src/**)` matched nested `dir/` anywhere | NET_NEW | `yap` `:528456-528462` | 1 / 0 |
| 2 | PowerShell 5.1 permission bypass | **DELTA** (corrected — see §8) | `nDd` `:512802-512807`, `H4` `:512818-512826`; literal `must run sandboxed even when a statement matches an exclusion` | 1 / **0** |
| 3 | fd-redirect forms fail closed | NET_NEW | `M0u` pre-pass `:209809`; `P0u` `:210540` | 3 / 0 |
| 4 | commands over 10,000 chars prompt | NET_NEW (1 line) | `:392119` with `AIe` `:512643` | 1 / 0 |
| 5 | zsh subscripts in `[[ ]]` | NET_NEW (the `[[ ]]` variant only) | `:210371`; gap audit `:210323` | 1 / 0 |
| 6 | `help`/`man` no longer auto-approved | NET_NEW (2 parts) | `:392566-392570`, `:392546-392548` | callback 1 / 0 |
| 7 | remote prompts before local dialog | **UNANCHORED** | — (`tengu_rc_permission_nudge` is an upsell) | 2 / 0 |
| 14 | `docker` daemon-redirect flags | NET_NEW (list only) | `hYr` `:213928-213944` | 15 / 8 entries |
| 44 | `dir/**` hook `if:` anchors at cwd | NET_NEW | `yap(gap(n), !0)` `:528541` | 1 / 0 |
| 45 | `file -m`/`-f` require permission | NET_NEW (deletion) | `:392410-392445` | 0 / 1 |

Seven of ten anchored, two disproven, one (`#1`/`#44`) shared with the glob doc.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_permissions.md](../00_overview/symbol_additions_v2_1_220_permissions.md).

Key functions in this document:
- `auditRedirectNodeStructure` (`P0u`, `:210540`) - the new fail-closed redirect auditor
- `walkRedirectsInTree` (`M0u`, `:210603`) - recursive redirect pre-pass, called at `:209809`
- `analyzeRedirectTarget` (`$ss`, `:210615`) - the pre-existing redirect analyzer, now calling `P0u` at its head
- `walkTestCommandOperand` (`L0u`, `:210357`) - `[[ ]]` operand walker with the zsh-subscript refusal
- `auditTestCommandByteCoverage` (`R0u`, `:210323`) - byte-coverage audit newly applied to `test_command`
- `isIgnorableGapBytes` (`_0u`, `:210282`) - gap classifier; `#` comments ignorable only inside `[[ ]]`
- `TEST_CONTAINER_NODE_TYPES` (`I0u`, `:212458`) - the four `[[ ]]` container node types
- `classifyReadOnlyCommand` (`tvd`, `:392117`) - read-only fast path; holds the new over-length guard
- `MAX_ANALYZABLE_COMMAND_CHARS` (`AIe`, `:512643`) - `1e4`
- `hasTokenizerDivergence` (`Fsn`, `:512253`) - six-regex bash/analyzer divergence predicate
- `hasCommandSubstitutionSentinel` (`Lf`, `:209614`) - the `ENe`/`Jb` sentinel test
- `hasDockerDaemonRedirectFlag` (`cuo`, `:212834`) - docker/podman daemon-redirect detector
- `DAEMON_REDIRECT_FLAGS` (`hYr`, `:213928`) - 15-entry flag list (was 8)
- `DAEMON_REDIRECT_SHORT_CHARS` (`ozg`, `:213945`) - derived bundled-short-flag index
- `POWERSHELL_UTF8_PROLOGUE` (`P$g`, `:169565`) - encoding prologue (NOT a permission check)
- `commandMustStartWithDeclaration` (`M$g`, `:169486`) - prologue suppression predicate
- `resolveRemoteControlPermissionNudgeConfig` (`f5a`, `:720478`) - the upsell nudge (NOT an ordering fix)
