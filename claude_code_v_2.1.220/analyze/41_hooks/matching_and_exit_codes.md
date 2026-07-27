# Hook matching, exit codes, and error attribution (`.195` → `.214`)

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). Baseline `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`,
always tagged `(193)`.

Seven changelog bullets across six releases land inside two functions and four `catch` blocks. None of
them adds a feature. Every one of them is a **one-conjunct or one-branch change** to mature machinery,
and five of the seven are about the same underlying defect class: *the harness losing track of who
caused an outcome*. A hook timeout looked like a user pressing Esc; a stream teardown looked like a
hook failure; a malformed JSON body erased an exit code; a hook that blocked a `SessionStart` produced
no visible output at all.

The hook machine lives in three places, and it helps to have them in mind before reading:

| Layer | Entry point (220) | Responsibility |
|---|---|---|
| **Selection** | `q8s` `:520359` → `IF_` `:520219` → `Cze` `:528537` | which configured hooks match this event? (`matcher`, then `if:`) |
| **Execution** | `lM` `:520573` (streaming) / `EM` `:521555` (batch) → `q2o` `:519921` (spawn) | run them, turn stdout+exit code into a result record |
| **Consumption** | one consumer per event family (`:319554`, `:401044`, `:336713`, `:652420`, …) | turn a result record into transcript messages / permission decisions / turn control |

Every bullet below is a repair at exactly one of those layers.

---

## 1. `.195` — hyphenated matchers now exact-match

> *"Fixed hook matchers with hyphenated identifiers (e.g. `code-reviewer`, `mcp__brave-search`)
> accidentally substring-matching — they now exact-match. Use `mcp__brave-search__.*` to match all tools
> from a hyphenated MCP server."*

**Verdict: NET_NEW, and it is literally one character.**

| anchor | 220 | 193 |
|---|---|---|
| `/^[a-zA-Z0-9_\|, -]+$/` (the extended char class) | 2 (`:520198`, `:520221`) | **0** |
| `/^[a-zA-Z0-9_\|, ]+$/` (the 193 class) | 0 | 1 (`:589636 (193)`) |
| `See CHANGELOG v2.1.195` | 1 (`:520215`) | **0** |
| `matches no tool` / `To match all tools from this server` | 1 / 1 | 0 / 0 |
| `isBareMcpServerMatcher` / `getBareMcpServerMatchersWarned` | 1 / 1 | 0 / 0 |

### The algorithm: one regex decides "list" versus "regex"

**What it does:** `IF_(toolName, matcher, allowsListForm, toolAliases)` decides whether a configured
`matcher` string selects a given tool. It has exactly two modes, and the char class is the *mode
selector* — not a validator.

**How it works:**

1. `!matcher || matcher === "*"` → match everything (`:520220`).
2. Test the matcher against a **fast-path character class**. Which class depends on the event:
   `allowsListForm` events (the 19 in `xF_`, `:522080-522100`) get `/^[a-zA-Z0-9_|, -]+$/`; everything
   else gets `/^[a-zA-Z0-9_|]+$/`.
3. **If it passes**: split on `[|,]` (or just `|`), trim, canonicalise each token through `ij`
   (`:60285`, the legacy tool-name alias map) and expand session aliases through `pWn` (`:60293`), and
   ask `.includes(toolName)` — an **exact string equality test**.
4. **If it fails**: fall through to `new RegExp(matcher)` and `.test(toolName)` — an **unanchored regex
   test**, i.e. substring matching. Also tried against every legacy alias of the tool (`uWn`, `:60288`)
   and every session alias (`S7t`, `:60297`). An invalid regex logs `Invalid regex pattern in hook
   matcher` and returns false.

```javascript
// ============================================
// hookMatcherMatches - list-form fast path vs regex fallback; the hyphen moved the boundary
// Location: cli_inner_pretty.js:520219-520237
// ============================================

// ORIGINAL (for source lookup):
function IF_(e, t, r, n) {
  if (!t || t === "*") return !0;
  if ((r ? /^[a-zA-Z0-9_|, -]+$/ : /^[a-zA-Z0-9_|]+$/).test(t))
    return t
      .split(r ? /[|,]/ : "|")
      .map((s) => s.trim())
      .filter(Boolean)
      .flatMap((s) => pWn(ij(s), n))
      .includes(e);
  try {
    let i = new RegExp(t);
    if (i.test(e)) return !0;
    for (let s of uWn(e)) if (i.test(s)) return !0;
    for (let s of S7t(e, n)) if (i.test(s)) return !0;
    return !1;
  } catch {
    return (w(`Invalid regex pattern in hook matcher: ${t}`), !1);
  }
}

// READABLE (for understanding):
function hookMatcherMatches(toolName, matcher, allowsListForm, sessionAliases) {
  if (!matcher || matcher === "*") return true;
  //  220 ADDED THE HYPHEN TO THE LIST-FORM CLASS.  193 was /^[a-zA-Z0-9_|, ]+$/  (:589636 (193))
  let listFormClass = /^[a-zA-Z0-9_|, -]+$/,
    strictListClass = /^[a-zA-Z0-9_|]+$/;
  if ((allowsListForm ? listFormClass : strictListClass).test(matcher))
    return matcher
      .split(allowsListForm ? /[|,]/ : "|")
      .map((s) => s.trim())
      .filter(Boolean)
      .flatMap((s) => expandToolAliases(canonicalToolName(s), sessionAliases))
      .includes(toolName);                       // <-- EXACT equality
  try {
    let re = new RegExp(matcher);                // <-- UNANCHORED regex: substring semantics
    if (re.test(toolName)) return true;
    for (let legacy of legacyAliasesOf(toolName)) if (re.test(legacy)) return true;
    for (let alias of reverseSessionAliases(toolName, sessionAliases)) if (re.test(alias)) return true;
    return false;
  } catch {
    return (logForDebugging(`Invalid regex pattern in hook matcher: ${matcher}`), false);
  }
}

// Mapping: IF_→hookMatcherMatches, ij→canonicalToolName, pWn→expandToolAliases,
//          uWn→legacyAliasesOf, S7t→reverseSessionAliases, r→allowsListForm, n→sessionAliases
```

### Why adding `-` to the class flips `code-reviewer` from substring to exact

Trace `matcher = "code-reviewer"` on a `PreToolUse` event (`PreToolUse` ∈ `xF_`, so
`allowsListForm = true`):

- **2.1.193**: `/^[a-zA-Z0-9_|, ]+$/.test("code-reviewer")` → **false** (the `-` is not in the class).
  Control reaches the regex branch. `new RegExp("code-reviewer").test(toolName)` is *unanchored*, so it
  returns true for `code-reviewer`, `run-code-reviewer`, `mcp__x__code-reviewer-v2`, and anything else
  containing that substring. A user who wrote a matcher for their agent got a hook firing on unrelated
  tools.
- **2.1.220**: the same test → **true**. Control takes the list branch: `["code-reviewer"]`, and only a
  tool named exactly `code-reviewer` matches.

`mcp__brave-search` is the case that hurts, and it hurts in the *opposite* direction:

- **2.1.193**: fails the class (hyphen) → regex → `/mcp__brave-search/` matches
  `mcp__brave-search__web_search`, `mcp__brave-search__local_search`, … So "hook all tools from this
  server" *accidentally worked*.
- **2.1.220**: passes the class → exact → matches only a tool literally named `mcp__brave-search`,
  which **does not exist**: MCP tools are always `mcp__<server>__<tool>`. The matcher silently matches
  nothing.

That silent-nothing is the whole reason the release also ships a warning.

### The migration aid: `isBareMcpServerMatcher` + a self-referential changelog citation

```javascript
// ============================================
// warnIfBareMcpServerMatcher - once-per-matcher warning for the .195 semantics change
// Location: cli_inner_pretty.js:520197-520218
// ============================================

// ORIGINAL (for source lookup):
function Eip(e) {
  if (!/^[a-zA-Z0-9_|, -]+$/.test(e)) return !1;
  return e
    .split(/[|,]/)
    .map((t) => t.trim())
    .some((t) => t.startsWith("mcp__") && !t.slice(5).includes("__"));
}
function HF_(e, t) {
  if (!t || !kF_.has(e)) return;
  let r = JEi();
  if (r.has(t) || !Eip(t)) return;
  r.add(t);
  let n =
    t.split(/[|,]/).map((o) => o.trim()).find((o) => o.startsWith("mcp__") && !o.slice(5).includes("__")) ?? t;
  w(
    `Hook matcher \`${n}\` matches no tool (it is compared as an exact string). To match all tools from this server, use \`${n}__.*\`. See CHANGELOG v2.1.195.`,
    { level: "warn" },
  );
}

// READABLE (for understanding):
function isBareMcpServerMatcher(matcher) {
  if (!LIST_FORM_CHAR_CLASS.test(matcher)) return false;         // a regex matcher still works: not our problem
  return matcher
    .split(/[|,]/)
    .map((s) => s.trim())
    .some((s) => s.startsWith("mcp__") && !s.slice(5).includes("__"));   // "mcp__brave-search", no second "__"
}

function warnIfBareMcpServerMatcher(hookEventName, matcher) {
  if (!matcher || !TOOL_MATCHED_HOOK_EVENTS.has(hookEventName)) return;  // 5 tool events only
  let warned = getBareMcpServerMatchersWarned();                          // per-session Set
  if (warned.has(matcher) || !isBareMcpServerMatcher(matcher)) return;
  warned.add(matcher);                                                    // once per distinct matcher string
  let offending = matcher.split(/[|,]/).map((s) => s.trim())
        .find((s) => s.startsWith("mcp__") && !s.slice(5).includes("__")) ?? matcher;
  logForDebugging(
    `Hook matcher \`${offending}\` matches no tool (it is compared as an exact string). ` +
    `To match all tools from this server, use \`${offending}__.*\`. See CHANGELOG v2.1.195.`,
    { level: "warn" });
}

// Mapping: Eip→isBareMcpServerMatcher, HF_→warnIfBareMcpServerMatcher,
//          kF_→TOOL_MATCHED_HOOK_EVENTS (:522101), JEi→getBareMcpServerMatchersWarned (:3758)
```

Four details that make this a good piece of engineering rather than a `console.warn`:

1. **It only fires on `kF_`** (`:522101`) — `PreToolUse`, `PostToolUse`, `PostToolUseFailure`,
   `PermissionRequest`, `PermissionDenied`. Those are the only events whose match query is a *tool
   name*; on `SessionStart` a matcher of `mcp__foo` is just a source string that happens to look odd,
   and warning there would be noise.
2. **`Eip` re-tests the char class first.** If the matcher would have taken the *regex* branch anyway
   (e.g. `mcp__brave-search__.*` — the `.` and `*` are not in the class), nothing is wrong and no
   warning is emitted. So the warning fires precisely on the set of matchers whose meaning `.195`
   changed.
3. **`n.slice(5).includes("__")` is the "bare server" test** — 5 is `"mcp__".length`, so a matcher with
   a second `__` names an actual tool and is left alone.
4. **The dedup set is session state, keyed on the raw matcher string** (`bareMcpServerMatchersWarned`,
   `:3758`), and `HF_` is called from inside `q8s` at `:520425` — i.e. on **every dispatch of every tool
   event**. Without the latch a misconfigured matcher would print on every tool call in the session.

**And the string contains `See CHANGELOG v2.1.195`.** A version-numbered changelog citation compiled
into the shipped binary is unusual and is worth reading as an admission: this was a **breaking semantic
change to user configuration** that could not be made backwards-compatible, so the mitigation is to
point the affected user at the release note.

**The alternative they did not take:** keep hyphens out of the class and special-case `mcp__`. That
would have left `code-reviewer` substring-matching — the actual reported bug — so the class had to
change. The residual damage to `mcp__<server>` matchers is collateral, and the warning is the price.

---

## 2. `.214` — single-segment `dir/**` in a hook `if:` condition

> *"Changed single-segment `dir/**` hook `if:` conditions to match only `<cwd>/dir`; write `**/dir/**`
> for any-depth matching. `deny`/`ask` permission rules keep their any-depth match."*

**Verdict: NET_NEW.** This bullet is *one call site* of a function that
[`../38_permissions/rule_matching_and_glob_semantics.md`](../38_permissions/rule_matching_and_glob_semantics.md) §1
documents in full. **Read that first**; this section covers only the hook half and does not repeat the
matcher internals.

The shared function is `yap(pattern, anchorAtRoot)` (`:528456-528462`). Its second argument is the
entire bullet:

| caller | second argument | semantics |
|---|---|---|
| `s9s` matcher builder `:528493` | `r === "allow"` | allow rules anchor; **deny / ask keep any-depth** |
| `Cze` (`matchesPathRule`) `:528541` | `!0` — **always** | hook `if:` conditions always anchor |

### Where a hook `if:` becomes a path match

The chain is four hops and is not obvious from either end:

1. A hook may carry an `if:` field. Its schema (`o3r`, `:58703-58710`) is the same in both builds
   (220=1 / 193=1) and reads:
   > `Permission rule syntax to filter when this hook runs (e.g., "Bash(git *)"). Only runs if the tool
   > call matches the pattern. Avoids spawning hooks for non-matching commands.`
   It is attached to all five hook types — `command` `:58562`, `prompt` `:58597`, `mcp_tool` `:58624`,
   `http` `:58632`, `agent` `:58656`.
2. `RF_` (`:520238-520253`) builds the evaluator. It returns `undefined` for any event that is not one
   of the five tool events, then asks the *tool itself* for a content matcher via
   `preparePermissionMatcher`.
3. For the file tools, `preparePermissionMatcher` is `async ({ file_path: e }) => (t) => Cze(t, e)` —
   `:311013` (Edit), `:311418`, `:314900`, `:439836` (Read). So the `if:` condition's rule content is
   matched against the tool call's `file_path` by `Cze`.
4. `Cze` calls `yap(gap(n), !0)` at `:528541`.

```javascript
// ============================================
// matchesPathRule - the hook `if:` path evaluator; 220 anchors, 193 did not
// Location: cli_inner_pretty.js:528537-528549
// ============================================

// ORIGINAL (for source lookup):
function Cze(e, t) {
  let r = Mi(t);
  if (Mt() === "windows" && r.includes("\\")) r = _U(r);
  let { relativePattern: n, root: o } = Gfn(e, "session"),
    i = yap(gap(n), !0),
    s = Mt() === "windows",
    a = o ?? Ht(),
    l = v2t(s ? Ny(a) : a, s ? Ny(r) : r);
  if (l && jfn.default.isPathValid(l) && jfn.default().add(i).test(l).ignored) return !0;
  let c = e.trim(),
    u = !rTs(c) && !c.endsWith(":*");
  if (c.startsWith("*") || u) return ufe(e, t);
  return !1;
}

// READABLE (for understanding):
function matchesPathRule(ruleString, targetPath) {
  let target = toAbsolute(targetPath);
  if (platform() === "windows" && target.includes("\\")) target = toPosixSlashes(target);
  let { relativePattern, root } = resolveRuleScope(ruleString, "session"),
    enginePattern = normalizeDirGlobForIgnoreEngine(sanitizeGitignoreSigils(relativePattern), /* anchorAtRoot */ true),
    caseFold = platform() === "windows",
    base = root ?? getSessionCwd(),
    relative = posixRelative(caseFold ? lower(base) : base, caseFold ? lower(target) : target);
  if (relative && ignore.isPathValid(relative) && ignore().add(enginePattern).test(relative).ignored) return true;
  let trimmed = ruleString.trim(),
    looksLikeBareCommandRule = !isPathLikeRule(trimmed) && !trimmed.endsWith(":*");
  if (trimmed.startsWith("*") || looksLikeBareCommandRule) return matchesNonPathRule(ruleString, targetPath);
  return false;
}

// Mapping: Cze→matchesPathRule, yap→normalizeDirGlobForIgnoreEngine, gap→sanitizeGitignoreSigils (:528448),
//          Gfn→resolveRuleScope, v2t→posixRelative, jfn→ignore, Ht→getSessionCwd
```

The 2.1.193 twin `$Se` (`:586289-586306 (193)`, also exported as `matchesPathRule` at `:585839 (193)`)
did the `/**`-stripping **inline and unconditionally**:

```javascript
// 2.1.193, :586292-586297
let s = r.replace(/\/{2,}/g, "/");
if (s.endsWith("/**")) {
  let d = s.slice(0, -3);
  s = /[^/]/.test(d) ? d : "/**";
}
```

`src/**` therefore became the gitignore pattern `src`, which has no `/` and so matches at **any depth** —
`vendor/x/src/foo.ts` included. 2.1.220 factors the same three lines into `yap` and passes
`anchorAtRoot = true`, producing `/src`.

Two smaller improvements ride along in the same function and are worth noting because they are the
kind of thing a literal-count diff misses entirely:

- **`gap`** (`:528448-528452`) is new sanitisation applied *before* `yap`: it collapses `//`, and escapes
  a BOM-prefixed `!`/`#` (`﻿!foo` → `\!foo`, bare `﻿` → `[﻿]`). Without it a
  zero-width-BOM prefix would displace gitignore's positional negation sigil.
- **`jfn.default.isPathValid(l)`** replaces 193's hand-rolled `l !== ".." && !l.startsWith("../")`
  (`:586301 (193)`), delegating traversal validation to the `ignore` package.

### Why hook `if:` anchors unconditionally while `deny`/`ask` do not

The permissions doc gives the full fail-safe-direction argument. The hook-specific half:

**A hook `if:` condition is not a privilege grant.** It selects *which program runs*, not *what is
allowed*. There is therefore no "safer" direction to err in — an over-broad `if:` spawns a subprocess
the user did not intend (a correctness and performance problem, and a security problem if that program
was scoped to a directory it now sees outside of); an under-broad `if:` just fails to spawn it. With no
asymmetry to respect, the design picks the semantics a reader would predict from the syntax: `src/**`
means `./src`, exactly like every other tool that takes a path.

The consequence is that hook `if:` and `deny:` rules with the **same text now mean different things** —
`Edit(logs/**)` in a deny rule still matches `vendor/logs/x`, but as a hook `if:` it matches only
`<cwd>/logs/x`. That is a genuinely surprising outcome of a fail-safe-direction argument, and it is
worth stating plainly in any user-facing summary.

### The non-tool-event escape hatch

One behaviour of the `if:` filter is easy to miss and belongs here rather than in the permissions doc.
`RF_` returns `undefined` for every event that is not one of the five tool events, and the filter in
`q8s` treats that as a **skip, not a pass** (`:520503-520517`):

```javascript
if (!C) return (w(`Hook if condition "${L}" cannot be evaluated for non-tool event ${n.hook_event_name}`), !1);
```

So attaching an `if:` to a `SessionStart` or `DirectoryAdded` hook **disables that hook entirely**, with
only a `verbose`-adjacent debug line to say so. This is fail-closed and defensible — an unevaluatable
condition must not be treated as satisfied — but it is silent in normal operation.

---

## 3. `.214` — exit code 2 now blocks even when the stdout JSON is malformed

> *"Fixed hooks with exit code 2 not blocking as documented when the hook's stdout JSON fails schema
> validation"*

**Verdict: NET_NEW, and it is one added conjunct.** The scoping pass recorded this as
`DELTA — the exit-code-2 doc string is carryover; 6 new schema-validation sites`. That framing is
misleading: `schema validation` (220=18 / 193=12) grew for reasons spread across MCP, tasks, and
mailbox code that have nothing to do with hooks. The actual hook change is a **six-character edit**.

### The bug

`q2o`'s command-hook result handling (`:521126` onward) runs in this order:

1. `W2o(stdout)` parses and zod-validates the hook's stdout, returning `{ json }` **or**
   `{ plainText, validationError }`.
2. **If `validationError`** → emit a `hook_non_blocking_error` attachment with a hard-coded
   `exitCode: 1` and `return`.
3. Else if `json` → interpret it (`vfn`), and *inside that branch* honour exit 2
   (`:521225-521226`: `if (Te.status === 2 && !Ce.blockingError) Ce.blockingError = …`).
4. Else, on plain-text output: `status === 0` → success; `status === 2` → **blocking**
   (`:521291-521305`); anything else → non-blocking error.

Step 2 in 2.1.193 was unconditional (`:590440 (193)`: `if (ue) { … return; }`). A hook that printed
`{"contin` and exited 2 therefore short-circuited at step 2 and was reported as a **non-blocking error
with exit code 1** — the exit code the hook actually used was overwritten, and the documented
"exit 2 = block" contract was silently void. The failure mode is nastier than it sounds: the *more*
effort a hook author puts into emitting structured output, the more likely they are to hit it, because
a plain-text hook (no JSON at all) took route 4 and blocked correctly.

### The fix

```javascript
// ============================================
// runHookCommand - the stdout-validation branch; `&& Te.status !== 2` is the whole .214 fix
// Location: cli_inner_pretty.js:521126-521152
// ============================================

// ORIGINAL (for source lookup):
        let { json: he, plainText: Le, validationError: Ae } = W2o(Te.stdout);
        if (Ae && Te.status !== 2) {
          (TN({ hookId: se, hookName: f, hookEvent: p, output: Te.output, stdout: Te.stdout,
                stderr: Ae, exitCode: 1, outcome: "error" }),
            yield {
              message: Va({ type: "hook_non_blocking_error", hookName: f, toolUseID: r, hookEvent: p,
                            stderr: Ae, stdout: Te.stdout, exitCode: 1, command: ee, durationMs: ve }),
              outcome: "non_blocking_error",
              hook: j,
            });
          return;
        }

// READABLE (for understanding):
        let { json, plainText, validationError } = parseHookStdout(result.stdout);
        if (validationError && result.status !== 2) {        // <-- 193 was `if (validationError)`
          recordHookOutcome({ …, exitCode: 1, outcome: "error" });
          yield {
            message: createAttachmentMessage({ type: "hook_non_blocking_error", …, exitCode: 1 }),
            outcome: "non_blocking_error",
            hook,
          };
          return;                                             // exit 2 no longer takes this route
        }
        // …falls through: `json` is undefined, so the `if (json)` block is skipped,
        //   `status === 0` is false, and control reaches the exit-2 blocking arm at :521291:
        //   yield { blockingError: { blockingError: `[${cmd}]: ${stderr || "No stderr output"}`, … },
        //           outcome: "blocking", hook }

// Mapping: W2o→parseHookStdout, Va→createAttachmentMessage, TN→recordHookOutcome,
//          Te→result, Ae→validationError, he→json, Le→plainText
```

**Why a conjunct rather than reordering the checks?** Moving the exit-2 test above the validation test
would have made exit 2 win *always* — including when the JSON parsed fine and carried an explicit
`hookSpecificOutput.permissionDecision: "allow"`. The current order preserves the precedence
"well-formed JSON is authoritative; exit 2 is the fallback signal", and the conjunct only rescues the
case where there is no authoritative JSON to defer to. Note the corresponding line *inside* the JSON
branch (`:521225`) has always used the same precedence: `if (Te.status === 2 && !Ce.blockingError)` —
exit 2 fills in a blocking error only when the JSON did not already specify one.

**What is lost:** the validation error text. On the exit-2 path the user gets
`[<command>]: <stderr>` and never learns that their JSON was malformed. `W2o` does log it
(`:519705` calls `w(n)` with the full expected-schema dump built at `:519701-519704`), so it is in the
debug log — the same "fact to the model, detail to the log" split seen throughout the hook code.

### Adjacent, undocumented: the async-rewake JSON salvage

Same release window, same problem class, **no changelog bullet**.
`async hook JSON output failed schema validation` is **220=1 (`:216693`) / 193=0**.

The `async` / `asyncRewake` hook path (`:519655`-registered flag; description at `:58573-58578`) polls
completed background hooks and reads their stdout looking for a JSON line. In 2.1.193 that value was
used **raw**:

```javascript
// 2.1.193, :472853
(T(`Hooks: Found sync response from ${s.processId}: ${Le(f)}`), (d = f));
```

2.1.220 routes it through `pxu` (`:216665-216698`):

```javascript
// 2.1.220, :216813
(w(`Hooks: Found sync response from ${i.processId}: ${Ie(f)}`), (d = pxu(f, i.hookName)));
```

`pxu` = `salvageAsyncHookJson`. It zod-validates; on success returns the parsed value; on failure it
does **field-level salvage** rather than dropping everything — keeping `systemMessage` if it is a
string, `metrics` if it is a plain object (further filtered to boolean/number values only), and
`hookSpecificOutput` (dropping a non-string `additionalContext` but keeping the rest) — then logs the
first zod issue plus the list of ignored malformed fields, at `level: "error"` if anything was ignored
and `"debug"` otherwise. So a background hook with one bad field still delivers its good fields, and
the log tells you which ones were dropped.

**Why salvage here but not on the synchronous path?** A synchronous hook's caller is still on the stack
and can be told to block; a background hook has already run, may have had side effects, and the model
may already be mid-turn. Discarding its whole payload over one malformed field would lose real work
with no recovery path. The asymmetry is deliberate and it is the more interesting half of the
exit-code-2 story.

---

## 4. `.199` — `SessionStart` / `Setup` / `SubagentStart` no longer swallow stderr on exit 2

> *"Fixed `SessionStart`, `Setup`, and `SubagentStart` hooks silently hiding stderr when exiting with
> code 2 — the error is now shown in the transcript"*

**Verdict: NET_NEW, but the anchor everyone reaches for is CARRYOVER.** `hook_non_blocking_error` is
**220=24 / 193=23** — the attachment *type* is long-standing (23 sites in 193). The new thing is a
single 12-line wrapper and three call sites.

### Why the output vanished

Trace an exit-2 hook on `SessionStart` in 2.1.193:

1. The runner reaches `if (le.status === 2)` (`:590598 (193)`) and yields
   `{ blockingError: { blockingError: "[<cmd>]: <stderr>", command }, outcome: "blocking" }`.
   **There is no `message` field** — the runner deliberately does not mint an attachment, because for
   *tool* events the blocking error is consumed as a permission decision, not as transcript text. This
   is byte-identical in 220 (`:521291-521305`).
2. The `SessionStart` consumer (`:240808-240814 (193)`) is:
   ```javascript
   for await (let p of RFt(e, t, n, d, o, void 0, void 0, s)) {
     if (p.message) i.push(p.message);
     if (p.additionalContexts && …) a.push(…);
     if (p.initialUserMessage) uto = p.initialUserMessage;
     if (p.sessionTitle) c = p.sessionTitle;
     if (p.watchPaths && …) l.push(…);
     if (p.reloadSkills) u = !0;
   }
   ```
   **There is no `p.blockingError` branch.** The record is iterated, matches nothing, and is discarded.

So the defect was a **contract mismatch between a producer that speaks "permission decision" and a
consumer that speaks "transcript message"**, for three events that have no permission decision to make.
Nothing was thrown away by mistake; nobody had written the translation.

### The translation

```javascript
// ============================================
// getNonBlockableHookErrorMessage - re-shapes a blocking error as a non-blocking attachment
// Location: cli_inner_pretty.js:520551-520562
// ============================================

// ORIGINAL (for source lookup):
function Pur(e, t, r = e) {
  return Va({
    type: "hook_non_blocking_error",
    hookName: r,
    toolUseID: xht.randomUUID(),
    hookEvent: e,
    stderr: t.blockingError,
    stdout: "",
    exitCode: 2,
    command: t.command,
  });
}

// READABLE (for understanding):
function getNonBlockableHookErrorMessage(hookEvent, blocking, hookName = hookEvent) {
  return createAttachmentMessage({
    type: "hook_non_blocking_error",   // NOT hook_blocking_error: these events cannot be blocked
    hookName,                          // e.g. "SessionStart:startup", "SubagentStart:code-reviewer"
    toolUseID: crypto.randomUUID(),    // synthetic: there is no tool_use to attach to
    hookEvent,
    stderr: blocking.blockingError,    // the text the user never used to see
    stdout: "",
    exitCode: 2,                       // synthetic: reconstructed, not measured
    command: blocking.command,
  });
}

// Mapping: Pur→getNonBlockableHookErrorMessage, Va→createAttachmentMessage, xht→crypto
```

Three synthetic fields, each with a reason:

- **`exitCode: 2` is reconstructed, not observed.** The `blockingError` record carries no exit code —
  by the time it reaches the consumer, "exit 2" has already been consumed as the *meaning* "block". The
  wrapper re-materialises the number so the transcript renderer, which formats `hook_non_blocking_error`
  around `exitCode`, prints something truthful.
- **`toolUseID` is a fresh UUID.** The attachment renderer keys on it; there is no real tool use.
- **`hookName` defaults to `hookEvent` but every call site overrides it** with a
  `<Event>:<query>` composite — `SessionStart:${source}` `:319556`, `Setup:${trigger}` `:319604`,
  `SubagentStart:${agentType}` `:344398` — so the user can tell *which* configured hook failed when
  several are registered for the same event with different matchers.
- **`hook_non_blocking_error`, not `hook_blocking_error`.** The event genuinely cannot be blocked: the
  session has already started. Labelling it blocking would tell the reader that something was
  prevented, which is false. The type name is the honest one even though the *hook* asked to block.

The consumers also gained a **de-duplication guard** in the same edit (`:319554`, `:319602`, `:344396`):

```javascript
if (p.message && !(p.message.type === "attachment" && p.message.attachment.type === "hook_blocking_error"))
  s.push(p.message);
if (p.blockingError) s.push(Pur("SessionStart", p.blockingError, `SessionStart:${e}`));
```

193 was a bare `if (p.message) i.push(p.message);`. The filter exists because a hook that emits
*well-formed JSON* with `decision: "block"` takes a different runner route — `vfn` (`:519729`) attaches
a real `hook_blocking_error` message *and* sets `blockingError`. Without the filter that hook would now
produce **two** transcript entries. So the one-line addition is matched by a one-clause subtraction;
this is a two-sided fix, not an append.

**Why only these three events?** They are exactly the events dispatched *outside a turn* where an
exit-2 blocking error has no consumer: `SessionStart` and `Setup` run before the first turn,
`SubagentStart` runs during spawn. Every other event either has a permission pipeline to consume the
block (`PreToolUse` family) or a turn-control consumer (`Stop`, `UserPromptSubmit`, …).

---

## 5. `.212` — `continue:false` dropped mid-stream, and infra errors reported as user rejections

> *"Fixed a `continue:false` hook's halt being dropped when the tool fails or completes mid-stream, and
> hook infrastructure errors being misreported as user rejections"*

**Verdict: NET_NEW — and the scoping pass recorded this bullet as UNANCHORED
(`continue: !1` 0/0; only `hookSpecificOutput` and `stopReason` count drift). It is anchorable.** The
bullet has two halves and each has its own 220-only string:

| anchor | 220 | 193 |
|---|---|---|
| `Stop hook cancelled (abort or stream teardown)` | 2 (`:336369`, `:336714`) | **0** |
| `PreToolUse hook failed with an unexpected error` (`UAd`, `:401113`) | 1 | **0** |
| `PreToolUse hook did not respond before its timeout` (`bVy`, `:401111`) | 1 | **0** |
| `other configured hooks may not have completed` | 2 | **0** |
| `PreToolUse hook cancelled (control stream closed)` | 1 (`:401082`) | **0** |
| `PreToolUse hook dispatch failed` | 1 (`:401097`) | **0** |

### Half A — the `Stop`-hook catch stopped treating cancellation as failure

`VEe` / its wrapper is the Stop / SubagentStop dispatcher. Both of its `catch` blocks were rewritten.

```javascript
// ============================================
// executeStopHooksAndCollect - the three-way catch that preserves a mid-stream halt
// Location: cli_inner_pretty.js:336712-336737
// ============================================

// ORIGINAL (for source lookup):
  } catch (C) {
    if (Ip(C) && (i.abortController.signal.aborted || C instanceof yE)) {
      if ((w("Stop hook cancelled (abort or stream teardown)"), !i.abortController.signal.aborted))
        return { blockingErrors: [...E, ...b], preventContinuation: A || T };
      return { blockingErrors: [], preventContinuation: !1 };
    }
    y = !0;
    let I = Date.now() - u;
    return (
      O("tengu_stop_hook_error", { duration: I, queryChainId: wr(i.queryTracking?.chainId),
                                   queryDepth: i.queryTracking?.depth }),
      yield ml(`Stop hook failed: ${le(C)}`, "warning"),
      { blockingErrors: g, preventContinuation: !1 }
    );
  } finally { … }

// READABLE (for understanding):
  } catch (err) {
    if (isCancellationError(err) && (ctx.abortController.signal.aborted || err instanceof ControlStreamClosedError)) {
      logForDebugging("Stop hook cancelled (abort or stream teardown)");
      if (!ctx.abortController.signal.aborted)
        // ARM 2: the STREAM went away, the USER did not abort.  Keep what the hooks already decided.
        return { blockingErrors: [...stopBlockers, ...taskBlockers],
                 preventContinuation: stopPrevented || taskPrevented };
      // ARM 1: the user really did interrupt.  Not a hook failure; no telemetry, no warning.
      return { blockingErrors: [], preventContinuation: false };
    }
    // ARM 3: a genuine hook failure.  Unchanged from 2.1.193.
    failed = true;
    emitTelemetry("tengu_stop_hook_error", { duration: Date.now() - startedAt, … });
    yield warningLine(`Stop hook failed: ${formatError(err)}`);
    return { blockingErrors: accumulatedMessages, preventContinuation: false };
  } finally { … }

// Mapping: Ip→isCancellationError (:19577), yE→ControlStreamClosedError (class yE extends tl, :19767),
//          E→stopBlockers, b→taskBlockers, A→stopPrevented, T→taskPrevented, y→failed
```

The 2.1.193 twin (`:465876-465889 (193)`) has **no discrimination at all**:

```javascript
  } catch (y) {
    g = !0;
    let b = Date.now() - u;
    (V("tengu_stop_hook_error", { duration: b, … }), yield Pc(`Stop hook failed: ${Ae(y)}`, "warning"));
    let _ = [];
    if (p) _.push(p);
    if (f) _.push(f);
    if (m) _.push(m);
    return { blockingErrors: _, preventContinuation: !1 };
  }
```

Every escape — user Esc, control-stream teardown, a real crash — produced the same three outcomes:
the `hook_stop_handler_failed` telemetry latch, a user-visible `Stop hook failed: AbortError` warning,
and **`preventContinuation: !1`**, i.e. the halt a `continue:false` hook had *already* successfully
requested was thrown away.

The predicate is `Ip(e)` (`:19577-19583`):

```javascript
e instanceof tl || e instanceof xy ||
(e instanceof Error && (e.name === "AbortError" || ("__CANCEL__" in e && Boolean(e.__CANCEL__))))
```

— a four-way "is this a cancellation?" test covering the two internal cancel classes, DOM `AbortError`,
and the axios `__CANCEL__` convention. `yE` (`:19767`, `class yE extends tl {}`) is the narrower
"control stream closed" subclass, used across the hook code (20 `instanceof yE` sites in 220).

**`!signal.aborted` is the entire insight.** Two things throw abort-shaped errors, and only one of them
is the user:

| what happened | `signal.aborted` | correct response |
|---|---|---|
| user pressed Esc / turn aborted | `true` | discard everything, say nothing — the user already knows |
| SDK control stream closed, tool finished and tore the stream down mid-hook | `false` | **preserve** the halt and the blocking errors; the hooks' work is still valid |
| a hook actually crashed | (not cancellation-shaped) | telemetry + warning, as before |

Arm 2 is the changelog's "halt being dropped when the tool fails or completes mid-stream". Arm 1 is why
`tengu_stop_hook_error` and the `Stop hook failed:` warning no longer fire on every Esc — which is also
the second half of the bullet read from the other direction: an interrupt was being *reported* as a hook
infrastructure failure.

The sibling catch at `:336368-336371` (the streaming end-turn dispatcher) got arm 1 only —
`w("Stop hook cancelled (abort or stream teardown)"); return;` — because that generator has no
accumulated state to preserve.

### Half B — `PreToolUse` errors stopped looking like an interrupt

Same release, same defect class, in the tool path. 2.1.193's `PreToolUse` dispatcher had **two** error
exits and both yielded a bare stop:

```javascript
// 2.1.193, inner per-result catch, :433298-433322
} catch (p) {
  ke(p);
  (V("tengu_pre_tool_hook_error", { … }),
    yield { type: "message", message: { message: ei({ type: "hook_error_during_execution", … }) } },
    yield { type: "stop" });                                        // <- no stopReason
}
// 2.1.193, outer catch, :433324-433335
} catch (d) {
  if (mh(d))
    if (e.abortController.signal.aborted) T("PreToolUse hook cancelled (parent abort)");
    else (T("PreToolUse hook timed out (per-hook abort)"), V("tengu_sdk_hook_callback_timeout", { … }));
  else ke(d);
  yield { type: "stop" };                                           // <- no stopReason
  return;
}
```

A bare `{ type: "stop" }` is **indistinguishable downstream from an interrupt**. The tool call is
abandoned, and the model is told nothing about why — which is precisely "misreported as user
rejections".

2.1.220 (`:401044-401107`) gives every exit a *reason*, and gives the accumulated hook decision priority
over the generic text:

```javascript
// ============================================
// PRE_TOOL_HOOK_FAILURE_REASONS - the two new stopReason constants
// Location: cli_inner_pretty.js:401110-401113
// ============================================

// ORIGINAL (for source lookup):
var bVy =
    "PreToolUse hook did not respond before its timeout (host client may be unreachable). The tool call was not executed; other configured hooks may not have completed.",
  UAd =
    "PreToolUse hook failed with an unexpected error. The tool call was not executed; other configured hooks may not have completed.";

// READABLE (for understanding):
const PRE_TOOL_HOOK_TIMEOUT_STOP_REASON =
    "PreToolUse hook did not respond before its timeout (host client may be unreachable). " +
    "The tool call was not executed; other configured hooks may not have completed.",
  PRE_TOOL_HOOK_ERROR_STOP_REASON =
    "PreToolUse hook failed with an unexpected error. " +
    "The tool call was not executed; other configured hooks may not have completed.";

// Mapping: bVy→PRE_TOOL_HOOK_TIMEOUT_STOP_REASON, UAd→PRE_TOOL_HOOK_ERROR_STOP_REASON
```

and the four exits become:

| exit | 2.1.193 | 2.1.220 |
|---|---|---|
| inner per-result catch (`:401044`; yields `:401072`/`:401076`) | `yield { type: "stop" }` | `if (u) yield hookPermissionResult(u); else { if (c) yield defer(c); yield { type: "stop", stopReason: d ?? UAd } }` |
| outer, parent abort (`:401081`) | log only, then bare stop | log only (unchanged intent) |
| outer, control stream closed (`:401082`) | *did not exist* | `w("PreToolUse hook cancelled (control stream closed)")` |
| outer, per-hook timeout (`:401083-401095`) | log + telemetry, then bare stop | `if (u) yield hookPermissionResult(u); else yield { type: "stop", stopReason: d ?? bVy }` |
| outer, non-cancellation (`:401096-401104`) | `ke(d)` then bare stop | `xe(oi(_n(p), "PreToolUse hook dispatch failed"))`, then the same `u`-first / `d ?? UAd` shape |

Three separate correctness gains in one edit:

1. **`u` first.** `u` is the deny decision a hook already produced before the stream broke
   (set at `:400947` for a `blockingError`, `:400960` for failed `updatedInput` validation, `:401004`
   for a `deny` permissionBehavior). Yielding it instead of a stop means a hook that *did* decide is
   honoured even if a later sibling hook crashed. In 193 the crash erased the decision.
2. **`d ?? …`.** `d` is the hook's own `stopReason`, captured at `:400969-400971` when a hook yields
   `preventContinuation`. This is the literal "`continue:false` hook's halt being dropped" — 193 threw
   `d` away on every error exit; 220 prefers it over the generic constant.
3. **`c` (the deferred-hook name) is flushed** before stopping (`:401091`, `:401100`), so a
   `permissionDecision: "defer"` recorded earlier is not silently lost either.

Both constants end with *"other configured hooks may not have completed"* — an explicit statement to the
model that the hook set is in an **unknown partial state**. That is the honest thing to say and it is
the difference between an actionable message and a bare stop.

---

## 6. `.210` — a hook callback timeout is no longer a user rejection

> *"Fixed a hook callback timeout being misreported to the model as a user rejection, which made
> unattended sessions stop and wait"*

**Verdict: NET_NEW.** `hook callback timed out after` 220=1 (`:520743`) / 193=0;
`swallowed rejection` 220=1 / 193=0; `tengu_sdk_hook_callback_timeout` 220=4 / 193=3 — the *fourth*
site is the new one (193's three are all in the tool-hook paths at `:433058`, `:433136`, `:433330 (193)`).

### The 2.1.193 shape: no catch at all

```javascript
// 2.1.193, :590066-590079
if ($.type === "callback") {
  let re = $.timeout ? $.timeout * 1000 : s,
    { signal: ce, cleanup: le } = jD(o, { timeoutMs: re });
  yield u3f({ toolUseID: n, hook: $, hookEvent: d, hookInput: e, signal: ce, hookIndex: J,
              toolUseContext: i }).finally(le);
  return;
}
```

A `callback` hook is an **SDK-side JavaScript function**, invoked over the control protocol. If the host
client never answers, the composed timeout signal fires and the awaited promise rejects with an
`AbortError`. There is nothing to catch it: the rejection propagates out of the async generator, out of
`lM`, out of `executeUserPromptSubmitHooks`, and out of `processUserInput` — whose `for await` loop
(`:617682-617722 (193)`) has **no try/catch either**. An `AbortError` arriving at the REPL's
prompt-submission handler is exactly the shape of a user pressing Esc, so it was classified as one: the
prompt was discarded, the model was told the turn was cancelled, and an unattended session parked.

### The 2.1.220 shape: catch, then discriminate by *which signal* fired

```javascript
// ============================================
// runHooks (callback branch) - distinguishes a hook timeout from a real user interrupt
// Location: cli_inner_pretty.js:520719-520750
// ============================================

// ORIGINAL (for source lookup):
      if (j.type === "callback") {
        let de = j.timeout ? j.timeout * 1000 : i,
          { signal: ae, cleanup: Te } = wN(o, { timeoutMs: de });
        try {
          yield await MF_({ toolUseID: r, hook: j, hookEvent: p, hookInput: e, signal: ae,
                            hookIndex: Y, toolUseContext: s }).finally(Te);
        } catch (ve) {
          if (ve instanceof yE) {
            ((L = ve),
              w(`${p} SDK callback hook cancelled (control stream closed); draining sibling hooks`),
              yield { outcome: "cancelled", hook: j });
            return;
          }
          if ((p !== "UserPromptSubmit" && p !== "UserPromptExpansion") || !ae.aborted || o?.aborted) throw ve;
          (w(`${f} callback hook timed out; swallowed rejection: ${le(ve)}`),
            O("tengu_sdk_hook_callback_timeout", { hookEvent: fe(p) }),
            yield {
              blockingError: { blockingError: `${f} hook callback timed out after ${de}ms`, command: rSe(j) },
              suppressOriginalPrompt: !0,
              outcome: "blocking",
              hook: j,
            });
        }
        return;
      }

// READABLE (for understanding):
      if (hook.type === "callback") {
        let timeoutMs = hook.timeout ? hook.timeout * 1000 : defaultTimeoutMs,
          { signal: hookSignal, cleanup } = composeAbortSignal(outerSignal, { timeoutMs });
        try {
          yield await invokeSdkCallbackHook({ …, signal: hookSignal }).finally(cleanup);
        } catch (err) {
          if (err instanceof ControlStreamClosedError) {          // the SDK client went away entirely
            cancellationError = err;
            logForDebugging(`${eventName} SDK callback hook cancelled (control stream closed); draining sibling hooks`);
            yield { outcome: "cancelled", hook };
            return;
          }
          // Swallow ONLY when all three hold:
          //   (a) a prompt-submission event  (b) the HOOK's signal fired  (c) the OUTER signal did NOT
          if ((eventName !== "UserPromptSubmit" && eventName !== "UserPromptExpansion")
              || !hookSignal.aborted || outerSignal?.aborted) throw err;
          logForDebugging(`${hookName} callback hook timed out; swallowed rejection: ${formatError(err)}`);
          emitTelemetry("tengu_sdk_hook_callback_timeout", { hookEvent: eventName });
          yield {
            blockingError: { blockingError: `${hookName} hook callback timed out after ${timeoutMs}ms`,
                             command: describeHook(hook) },
            suppressOriginalPrompt: true,
            outcome: "blocking",
            hook,
          };
        }
        return;
      }

// Mapping: MF_→invokeSdkCallbackHook, wN→composeAbortSignal, yE→ControlStreamClosedError,
//          rSe→describeHook (:215859), o→outerSignal, ae→hookSignal, de→timeoutMs, L→cancellationError
```

**The three-part guard is the whole fix**, and the third clause is the one that matters:

- `hookSignal.aborted` — the *composed* signal, which fires on the per-hook timeout **or** the outer
  signal.
- `!outerSignal?.aborted` — the *outer* (turn/user) signal did not fire.

Together they mean "the timeout fired **and** the user did not interrupt". 2.1.193 could not make that
distinction because it never looked at the signals; by the time an `AbortError` reached a `catch`,
several layers up, the information about *which* controller aborted was gone. **The fix is to
discriminate at the only place where both signal objects are still in scope.**

The first clause (`UserPromptSubmit` / `UserPromptExpansion` only) is a deliberate scope limit. Those
two events have a well-defined "blocked" rendering — `Afn` (`:520564`) formats
`UserPromptSubmit operation blocked by hook:\n<reason>` and the consumer at `:652386-652395` turns it
into a `warning` message with `shouldQuery: false`. Other events have no such channel, so for them the
rejection is still rethrown to whoever can handle it.

`suppressOriginalPrompt: !0` is the finishing touch. The consumer at `:652389-652393` normally appends
`\n\nOriginal prompt: <text>` to a hook block so the user can recover their input. For a *timeout* that
echo is noise — the user's prompt is still in the input box — so the flag suppresses it. The field is
otherwise a documented hook-output option (`:215243-215248`,
`'When decision is "block", omit the original prompt from the block message'`), here set by the harness
on the hook's behalf.

Note the second arm, `err instanceof yE` → `outcome: "cancelled"` **plus** `return` after stashing `L`.
`L` is re-thrown after the sibling generators drain, so a dead control stream cancels the whole set
cleanly instead of leaving half of them unresolved — a separate concern the same edit had to handle.

### Adjacent, undocumented: spawn-failure de-duplication

Same runner, 220-only, no bullet: `spawnFailed` is **220=3 / 193=0** and `surfacedHookSpawnFailures`
is **220=2 / 193=0**. The spawn `catch` (`:520181-520184`) now tags its result
`{ …, status: 1, spawnFailed: !0 }`, and the outcome handler (`:521320-521315`) reads:

```javascript
if (Te.spawnFailed && !mip(p, te)) { yield { outcome: "non_blocking_error", hook: j }; return; }
```

`mip` (`:520567-520572`) is a once-per-`<event>:<command>` latch over session state. So a hook whose
command does not exist produces **one** transcript error per process, not one per tool call. The
default path below it still emits the full `Failed with non-blocking status code: …` attachment for
every other non-zero exit — only unspawnable commands are rate-limited, because those fail identically
forever.

---

## 7. `.214` — `SessionStart` reports source `"fork"`

> *"Changed SessionStart hooks to report source `"fork"` when a session begins as a fork instead of
> `"resume"`"*

**Verdict: NET_NEW, and it is a two-part change the bullet only half describes.**
`"fork" : "resume"` is **220=3 / 193=1**; the single 193 hit (`:688563 (193)`) is a *session-log*
call, not the hook.

| site | 2.1.193 | 2.1.220 |
|---|---|---|
| interactive resume (`:320414`) | `j9("resume", { sessionId: s, sessionTitle: … })` `:371698 (193)` | `HBe(r.forkSession ? "fork" : "resume", { sessionId: r.forkSession ? kt() : s, sessionTitle: … })` |
| headless/agent resume (`:821879`) | not present in this shape | `HBe(Nr === "fork" ? "fork" : "resume", { sessionId: _t, … })` |
| session-log call (`:821907`) | `cH(Sb(ft), gn === "fork" ? "fork" : "resume", …)` `:688563 (193)` | `Zk(S0(_t), Nr === "fork" ? "fork" : "resume", …)` — carryover |
| hook-title source filter | `e === "startup" \|\| e === "resume"` `:240817 (193)` | `e === "startup" \|\| e === "resume" \|\| e === "fork"` `:319568` |
| `/hooks` UI matcher picker | `values: ["startup","resume","clear","compact"]` `:549283 (193)` | `values: ["startup","resume","clear","compact","fork"]` `:696524` |
| SDK payload zod enum | `A.enum(["startup","resume","clear","compact"])` `:698619 (193)` | `v.enum(["startup","resume","clear","compact","fork"])` `:835721` |

So the enum widening touches **six** sites, four of which the bullet does not imply: the id fix, the
title filter, the UI picker's value list, and the SDK schema. Miss the last one and a `--print` session
would reject its own hook payload at the wire boundary.

**The second half of the change is the `sessionId`, and it is the more important one.**
`r.forkSession ? kt() : s` — when forking, the payload carries the *new* session's id (`kt()`), not the
source session's id `s`. A fork creates a new session; reporting the source id would have handed the
hook a `session_id` that does not name the session it is being run for, and `session_id` is the field
every hook uses to correlate with `transcript_path` (both are set together by `Kf`, `:519621-519622`).
So the bullet's user-visible half (`source: "fork"`) rides on a correctness fix the bullet does not
mention.

The third change is at `:319568`: a hook-supplied `sessionTitle` is only honoured when the source is
`startup`, `resume`, or — new — `fork`. Without adding `"fork"` there, the new source value would have
*disabled* a working feature for forked sessions. This is the recurring shape of an enum widening: the
new member has to be threaded into every closed-set test that enumerated the old members, and there is
no compiler to find them. `DirectoryAdded`'s seven registration tables
([`directory_added_hook.md`](directory_added_hook.md) §1) are the same lesson at larger scale.

**Why does `"fork"` matter to a hook author at all?** A `SessionStart` hook typically does
initialisation that must be idempotent per *workspace* but not per *session* — warming a cache, writing
a `CLAUDE_ENV_FILE` (`:520006`, set for `SessionStart`/`Setup`/`CwdChanged`/`FileChanged`). A fork
shares the parent's transcript history but has a new id and may run concurrently with the parent, which
is a materially different situation from a resume, where the parent is gone. Before `.214` the two were
indistinguishable.

---

## 8. Summary

| # | Release | Bullet | Verdict | Anchor (2.1.220) | 220 / 193 |
|---|---|---|---|---|---|
| 1 | `.195` | hyphenated matchers exact-match | NET_NEW (one char) | `/^[a-zA-Z0-9_\|, -]+$/` `:520221`; warning `:520215` | 2 / 0 |
| 2 | `.214` | `dir/**` in hook `if:` anchors at cwd | NET_NEW (one argument) | `yap(gap(n), !0)` `:528541` | 1 / 0 |
| 3 | `.214` | exit 2 blocks despite malformed JSON | NET_NEW (one conjunct) | `if (Ae && Te.status !== 2)` `:521127` | — |
| 4 | `.199` | stderr on exit 2 for 3 non-tool events | NET_NEW (one wrapper, 3 call sites) | `Pur` `:520551`; `:319556`, `:319604`, `:344398` | attachment type 24 / 23 |
| 5 | `.212` | `continue:false` halt / infra-as-rejection | **NET_NEW — previously scored UNANCHORED** | `:336713`; `UAd`/`bVy` `:401111-401113` | 2 / 0, 1 / 0 |
| 6 | `.210` | callback timeout as user rejection | NET_NEW | `:520739-520747` | 1 / 0 |
| 7 | `.214` | `SessionStart` source `"fork"` | NET_NEW (2 parts) | `:320414`, `:319568` | 3 / 1 |
| — | undocumented | async-rewake JSON salvage | NET_NEW | `pxu` `:216665`, call `:216813` | 1 / 0 |
| — | undocumented | spawn-failure de-dup latch | NET_NEW | `mip` `:520567`, `:521320` | 3 / 0 |

Nine changes; **seven are single-expression edits**. That is the signature of a subsystem that is
finished: the remaining defects are not missing features but missing *distinctions* — between a
timeout and an interrupt, a teardown and a crash, a list and a regex, a fork and a resume.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_hooks.md](../00_overview/symbol_additions_v2_1_220_hooks.md).

Key functions in this document:
- `hookMatcherMatches` (`IF_`, `:520219`) - list-form fast path vs unanchored-regex fallback; the `.195` char class
- `isBareMcpServerMatcher` (`Eip`, `:520197`) - detects `mcp__<server>` with no second `__`
- `warnIfBareMcpServerMatcher` (`HF_`, `:520204`) - once-per-matcher `See CHANGELOG v2.1.195` warning
- `TOOL_MATCHED_HOOK_EVENTS` (`kF_`, `:522101`) - the 5 events whose match query is a tool name
- `LIST_FORM_MATCHER_EVENTS` (`xF_`, `:522080`) - the 19 events allowing comma/hyphen list matchers
- `canonicalToolName` / `legacyAliasesOf` / `expandToolAliases` / `reverseSessionAliases` (`ij` `:60285`, `uWn` `:60288`, `pWn` `:60293`, `S7t` `:60297`)
- `matchesPathRule` (`Cze`, `:528537`) - hook `if:` path evaluator; calls `yap(gap(n), !0)` at `:528541`
- `sanitizeGitignoreSigils` (`gap`, `:528448`) - collapses `//`, escapes BOM-prefixed `!`/`#`
- `buildRuleContentMatcher` (`RF_`, `:520238`) - builds the `if:` evaluator; `undefined` for non-tool events
- `HOOK_IF_CONDITION_SCHEMA` (`o3r`, `:58703`) - the `if:` zod field, carryover
- `runHooks` (`lM`, `:520573`) - streaming hook runner; callback branch `:520719`, command branch `:521126`
- `spawnHookCommand` (`q2o`, `:519921`) - env/exec-form/shell resolution and `child_process.spawn`
- `parseHookStdout` (`W2o`, `:519697`) - JSON parse + zod validate + expected-schema dump
- `parseHttpHookBody` (`Sip`, `:519710`) - HTTP variant, empty-body tolerant
- `applyHookJsonOutput` (`vfn`, `:519729`) - maps validated JSON onto the result record
- `salvageAsyncHookJson` (`pxu`, `:216665`) - field-level salvage for async-rewake output
- `getNonBlockableHookErrorMessage` (`Pur`, `:520551`) - synthetic `exitCode: 2` attachment for 3 non-tool events
- `getUserPromptSubmitHookBlockingMessage` (`Afn`, `:520564`) - `UserPromptSubmit operation blocked by hook:` formatter
- `hasSurfacedHookSpawnFailure` (`mip`, `:520567`) - once-per-`event:command` spawn-failure latch
- `isCancellationError` (`Ip`, `:19577`) - 4-way cancellation predicate
- `ControlStreamClosedError` (`yE`, `:19767`) - `class yE extends tl {}`
- `PRE_TOOL_HOOK_TIMEOUT_STOP_REASON` (`bVy`, `:401111`) / `PRE_TOOL_HOOK_ERROR_STOP_REASON` (`UAd`, `:401113`)
- `describeHook` (`rSe`, `:215859`) / `hookStatusLabel` (`FW`, `:215877`) - command/prompt/url renderers
- `runSessionStartHooks` (`HBe`, `:319521`) - `SessionStart` orchestrator; `Pur` call at `:319556`
