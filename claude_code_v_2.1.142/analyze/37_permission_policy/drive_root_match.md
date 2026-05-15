# Drive Root / Filesystem Root Allow-Rule Match Fix — v2.1.133

**Theme:** A user with `permissions.allow: ["Edit(C:\\**)"]` (Windows) or `permissions.allow: ["Edit(/**)"]` (Linux/macOS) expected to allow writes anywhere in the filesystem. Pre-fix, the rule matcher *stripped the trailing `/**` too aggressively*, leaving an empty or root-only prefix that no real path matches. The rule was silently no-op.

This is a *correctness* fix — the rule was valid syntax and validated by the schema, but the matcher's prefix-extraction had an off-by-one for root-only patterns. It has an outsized effect on Windows enterprise admins who frequently grant blanket `Edit(C:\)` access to a managed Claude Code deployment.

---

## 1. The Bug — What the Pre-Fix Matcher Did

The path matcher `yL` (chunks `_top_*`, line 518097-518123) compiles allow-rule path patterns into a glob matcher (via the `ignore` library) and tests the actual file path against the compiled patterns.

When loading rules, each pattern is normalized — if it ends with `/**`, the `/**` is stripped to form a *prefix*. This is a defense against glob-pattern surprises (an `ignore` pattern with `/**` works, but stripping the suffix lets the matcher also handle "prefix match" patterns).

Pre-fix, the strip was unconditional:

```javascript
// Pre-fix (buggy):
let f = Array.from(Y.keys()).map((D) => {
  let j = D;
  if (j.endsWith("/**")) j = j.slice(0, -3);   // ← always strip
  return j;
});
```

For `"/**"` this produces `""`. For `"/c/**"` (the posixified form of `C:\**`) this produces `"/c"`. So far so good — but for `"/**"` itself, the empty-string pattern fed to `ignore.add([""])` is silently ignored by the `ignore` library: a no-op. The rule existed but **matched nothing**.

For `"/c"` (Windows after `MP` posixification), the `ignore` library *does* match files under `/c/...` — but **only when the file path is also relativized against a parent that yields `/c/...`**. The fix exposes both cases cleanly by preserving `/**` for the empty-string case.

---

## 2. The Fix — Restore `/**` When Strip Leaves Only Slashes

In `yL` (line 518100-518110, post-fix):

```javascript
// ============================================
// matchPathRule - Path rule matcher with drive-root preservation
// Location: cli_inner_pretty.js:518097-518123
// ============================================

// ORIGINAL (for source lookup):
function yL(H, $, q, K) {
  let _ = eq(H);
  if (c$() === "windows" && _.includes("\\")) _ = MP(_);
  let A = Oy4($, q, K);
  for (let [z, Y] of A.entries()) {
    let f = Array.from(Y.keys()).map((D) => {
        let j = D;
        if (j.endsWith("/**")) {
          let J = j.slice(0, -3);
          j = /[^/]/.test(J) ? J : "/**";        // ← v2.1.133 FIX
        }
        return j;
      }),
      O = Ky4.default().add(f),
      M = $Q6(z ?? I$(), _ ?? I$());
    if (M.startsWith(`..${x$H}`)) continue;
    if (!M) continue;
    let w = O.test(M);
    if (w.ignored && w.rule) {
      let D = w.rule.pattern,
        j = D + "/**";
      if (Y.has(j)) return Y.get(j) ?? null;
      return Y.get(D) ?? null;
    }
  }
  return null;
}

// READABLE (for understanding):
function matchPathRule(filePath, permContext, mode, behavior) {
  let normalized = normalizePath(filePath);
  if (isWindows() && normalized.includes("\\")) normalized = posixifyPath(normalized);

  // Get the per-cwd map of rule-content → rule for this tool/mode/behavior
  const cwdToRules = getRulesByDirectory(permContext, mode, behavior);

  for (const [cwd, rulesByContent] of cwdToRules.entries()) {
    // Build the glob matcher's input patterns from the rule contents.
    const patterns = Array.from(rulesByContent.keys()).map((ruleContent) => {
      let pattern = ruleContent;
      if (pattern.endsWith("/**")) {
        const prefix = pattern.slice(0, -3);
        // After stripping "/**":
        //   if the prefix has any non-slash char (e.g. "/c", "/home/user"), use it as-is
        //   else (prefix is "", "/", or "//"), the pattern was root-level — restore "/**"
        pattern = /[^/]/.test(prefix) ? prefix : "/**";
      }
      return pattern;
    });

    // Compile via the `ignore` library (gitignore-style glob matcher)
    const matcher = ignoreLibrary().add(patterns);

    // Relativize the file path against the rule's cwd
    const relativized = posixRelative(cwd ?? processCwd(), normalized ?? processCwd());
    if (relativized.startsWith(`..${sep}`)) continue;  // file outside cwd
    if (!relativized) continue;

    const result = matcher.test(relativized);
    if (result.ignored && result.rule) {
      // Map matched pattern back to the original rule object
      const matchedPattern = result.rule.pattern;
      const withGlobstar = matchedPattern + "/**";
      if (rulesByContent.has(withGlobstar)) return rulesByContent.get(withGlobstar) ?? null;
      return rulesByContent.get(matchedPattern) ?? null;
    }
  }
  return null;
}

// Mapping: yL→matchPathRule, eq→normalizePath, MP→posixifyPath, Oy4→getRulesByDirectory,
//   Ky4→ignoreLibrary, $Q6→posixRelative, I$→processCwd, x$H→sep, c$→getPlatform
```

### The key fix line

```javascript
j = /[^/]/.test(J) ? J : "/**";
```

This reads: **"if the stripped prefix contains any non-slash character, use the prefix; otherwise restore `/**` so the root-level pattern still matches."**

| Original pattern (post-posixify) | After strip | `/[^/]/.test` | Final pattern | What it matches |
|---|---|---|---|---|
| `/home/user/**` | `/home/user` | true | `/home/user` | files under `/home/user/` |
| `/**` | `""` | false (no non-slash) | `/**` | everything under root |
| `/c/**` (Windows `C:\**`) | `/c` | true (`c`) | `/c` | files under `/c/` |
| `//` (degenerate) | `//` | false (only slashes) | `/**` | everything |

### The crucial pre-step — `MP` posixifies drive letters

For the Windows case to work, the rule content has already passed through `MP` (the posixifier) at registration time, which converts drive letters to Git-Bash style:

```javascript
// ============================================
// posixifyPath - Convert Windows path to Git-Bash POSIX form
// Location: cli_inner_pretty.js:42851-42860
// ============================================

// ORIGINAL (for source lookup):
MP = SW(
  (H) => {
    if (H.startsWith("\\\\")) return H.replaceAll("\\", "/");
    let $ = H.match(/^([A-Za-z]):[/\\]/);
    if ($) return "/" + $[1].toLowerCase() + H.slice(2).replaceAll("\\", "/");
    return H.replaceAll("\\", "/");
  },
  (H) => H,
  500,
);

// READABLE (for understanding):
const posixifyPath = memoizeLRU(
  (windowsPath) => {
    // UNC paths (\\server\share) just convert backslashes
    if (windowsPath.startsWith("\\\\")) return windowsPath.replaceAll("\\", "/");

    // Drive-letter paths: C:\Users\foo → /c/Users/foo
    const driveMatch = windowsPath.match(/^([A-Za-z]):[/\\]/);
    if (driveMatch) {
      const driveLetter = driveMatch[1].toLowerCase();
      return "/" + driveLetter + windowsPath.slice(2).replaceAll("\\", "/");
    }

    // Relative or already-POSIX paths
    return windowsPath.replaceAll("\\", "/");
  },
  (key) => key,
  500
);

// Mapping: MP→posixifyPath, SW→memoizeLRU, H→windowsPath, $→driveMatch
```

So for Windows:
- Rule content `"C:\\**"` (JSON-escaped) → string `"C:\**"` → posixified by `MP` → `/c/**`
- File `"C:\\Users\\foo\\file.ts"` → posixified → `/c/Users/foo/file.ts`

Both the rule pattern (after strip + restore: `/c`) and the file path are in `/c/...` form. The `ignore` library treats `/c` as a directory-prefix that matches all files under it.

### Key insight — `/[^/]/.test(prefix)` is the smallest correct expression

The team could have written:

```javascript
if (prefix === "" || prefix === "/" || prefix === "//") j = "/**";
else j = prefix;
```

…and it would be equivalent for these specific cases. But the regex `/[^/]/.test(prefix)` is **semantically precise**: "does this string contain any character that isn't a slash?" It correctly handles `/`, `//`, `///` (degenerate), `""`, and also any pathological case like `////` — all collapse to `/**`. The string-literal version would miss `///` and `////`.

The regex is also **future-proof**: if path-normalization ever produces other root forms (`UNC paths //wsl$/`, theoretical edge cases), the same check works without code changes.

---

## 3. Why a Universal Strip Was Wrong

The pre-fix unconditional strip was **trying to be clever** — by stripping `/**`, the matcher could share code paths between glob rules (`/home/**`) and prefix-style rules (`/home`). Both compile to the same ignore-library pattern.

But for root-only patterns, the strip produces an *empty string*, which is **not** a valid ignore-library pattern. The `ignore` library treats `add([""])` as a no-op (it's documented behavior — gitignore files can have empty lines, which are ignored).

The fix preserves the "share code paths" trick for the common case while special-casing root.

### Why not just keep `/**` always?

Performance. The `ignore` library compiles `**` to a regex like `.*` which scans every character of every input path. For a long path tested against many rules, this adds up. Stripping `/**` lets the library use a prefix-match shortcut (`startsWith`) on the trimmed pattern.

For root-only patterns, this optimization doesn't apply (every path starts with root by definition), so the regex form is necessary anyway — the special-case to restore `/**` keeps the optimization where it helps without breaking the edge case.

---

## 4. Visualization — Walking Through a Match

### Case 1: Linux `Edit(/**)`

```
Rule:  permissions.allow: ["Edit(/**)"]
Session cwd: /home/user/project
File written:    /etc/myapp/config.yaml

Step 1: Rule content stored as "/**"
Step 2: yL compiles patterns:
        prefix after strip = ""  → /[^/]/.test("") → false → pattern = "/**"
        ignore.add(["/**"])
Step 3: Posixify file path: /etc/myapp/config.yaml (unchanged)
Step 4: Relativize vs rule cwd:
        posix.relative("/home/user/project", "/etc/myapp/config.yaml")
        = "../../../etc/myapp/config.yaml"
        → starts with "../" → CONTINUE (skip this cwd's rules)
```

⚠ Even with the fix, `Edit(/**)` only matches files **inside the session cwd**. A file outside the cwd is rejected at the relativize step. So `Edit(/**)` in practice means "allow Edit anywhere under the session cwd" — same as `Edit(./**)`.

This is intentional defense: the user shouldn't be able to grant blanket filesystem access via a single rule in a project settings file (which someone else could check in). The relativize-vs-cwd guard ensures rules are *session-cwd-rooted*.

### Case 2: Windows `Edit(C:\\**)` (file in session cwd)

```
Rule:  permissions.allow: ["Edit(C:\\**)"]
Session cwd:  C:\Users\foo\project  (posixified: /c/Users/foo/project)
File written: C:\Users\foo\project\src\app.ts  (posixified: /c/Users/foo/project/src/app.ts)

Step 1: Rule content stored: "C:\\**" → MP → "/c/**"
Step 2: yL compiles patterns:
        prefix after strip = "/c"  → /[^/]/.test("/c") → true → pattern = "/c"
        ignore.add(["/c"])
Step 3: Posixify file path → /c/Users/foo/project/src/app.ts
Step 4: Relativize vs rule cwd:
        posix.relative("/c/Users/foo/project", "/c/Users/foo/project/src/app.ts")
        = "src/app.ts"
        → does NOT start with "../" → CONTINUE
Step 5: ignore.test("src/app.ts") against pattern "/c"
        → wait — pattern "/c" tests against "/c/..." style paths
        → the relativized path "src/app.ts" doesn't start with "/c"
        → no match
```

Hmm — for Windows with cwd-relativization, the `/c` pattern still doesn't match. The relativization strips the drive prefix. So how does `Edit(C:\\**)` work on Windows?

### The real Windows match path

Looking again at `Oy4($, q, K)` — the `cwd` key in the returned map is the **rule's cwd**, set at rule registration time. For *settings.json* rules (the typical case), the cwd is **`null`** or the **session start cwd**.

When `cwd` is the session start cwd (e.g., `/c/Users/foo/project`), the relativized path `src/app.ts` is what's matched against the rule patterns. The rule `/c` doesn't match `src/app.ts`.

So `Edit(C:\\**)` on Windows still mostly fails to match files inside the session cwd — *unless* the rule was registered with `cwd: null` (or `cwd: "/"`), in which case the relativized path *is* the full posixified path. That's the case for **policy-tier rules** and **CLI-flag rules**, which are inherently global.

In practice on Windows, the typical user pattern is:

```json
{
  "permissions": {
    "allow": ["Edit(./**)", "Edit(src/**)"]
  }
}
```

…which is relativized against the cwd already. The drive-root form is used by **enterprise admins** in **managed settings** where `cwd` is `null` and the relativize-step preserves the full path.

### Case 3: Enterprise managed settings, Windows `Edit(C:\\**)` with cwd=null

```
Rule:  permissions.allow: ["Edit(C:\\**)"]   (from managed settings)
Session cwd: C:\Users\foo\project
File written: C:\Users\foo\project\src\app.ts
Rule's stored cwd: null (managed-tier global)

Step 1: Rule content stored: "C:\\**" → MP → "/c/**"
Step 2: prefix = "/c" → pattern = "/c"
Step 3: Posixify file → /c/Users/foo/project/src/app.ts
Step 4: Relativize vs null:
        posix.relative(null ?? processCwd(), "/c/Users/foo/project/src/app.ts")
        → wait, if cwd is null, the relativize falls back to processCwd → same as session cwd
        
        OR the rule loader normalizes null → "/" so the relativize is:
        posix.relative("/", "/c/Users/foo/project/src/app.ts") = "c/Users/foo/project/src/app.ts"
```

Indeed reading the code (`M = $Q6(z ?? I$(), _ ?? I$())` — line 518111), `z` is the rule's cwd, and if null, falls back to `I$()` (process cwd). So even managed rules get relativized.

The deeper truth: **the v2.1.133 fix doesn't change the relativize semantics**. What it fixes is the *compiled pattern* — `/**` now matches everything (not nothing), and `/c` now matches `/c/...` paths (which it always did, but for cases where the relativize step preserves the prefix).

The user-visible effect: **rules of the form `Edit(/**)` and `Edit(C:\\**)` are no longer silent no-ops**. The exact set of files they match depends on cwd-relativization (an orthogonal concern), but the rules now *fire* when applicable instead of being silently broken.

---

## 5. Why the Bug Was Subtle

1. **Schema accepted the rule** — `Hm8` (validator, chunks `_top_*`) doesn't reject `Edit(/**)` because it's syntactically valid
2. **`/permissions list` showed it** — the loaded rule was in the runtime state, just compiled to an empty matcher
3. **No log warning** — `ignore.add([""])` is a silent no-op, not an error
4. **Users who tested ran from cwd that happened to match** — a user testing `Edit(/**)` against a file `./src/file.ts` in their session cwd might have been *separately* matched by another allow rule (or by the working-directory check) and never noticed

The fix is one line, but it required someone to specifically test "I added `Edit(C:\\**)` to my settings — why am I still being prompted for `C:\Users\foo\project\src\file.ts`?" The bug was a perfect storm of valid-but-broken: nothing flagged it.

---

## 6. The Companion Round-Trip Test (Implied by the Fix)

The `if (Y.has(j)) return Y.get(j) ?? null;` line (518118) is the **round-trip** that makes the fix work for both pre-fix and post-fix patterns:

```javascript
if (w.ignored && w.rule) {
  let D = w.rule.pattern,    // the pattern that matched (post-strip: "/c" or "/**")
    j = D + "/**";            // restore "/**" to look up the original rule
  if (Y.has(j)) return Y.get(j) ?? null;
  return Y.get(D) ?? null;
}
```

When the matcher hits, it knows which *compiled* pattern won (`D`). To find the *original* rule object (with metadata: source, ruleBehavior, etc.), it tries:
1. `D + "/**"` — the original pre-strip form (most rules)
2. `D` itself — for rules that didn't have `/**` (rare, e.g., exact-path rules)

The round-trip preserves rule identity through the strip/match cycle. This is what makes `decisionReason: { type: "rule", rule: Y }` return the *user-written* rule, not the *compiled* pattern.

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_v2_1_142_permission.md`](../00_overview/symbol_additions_v2_1_142_permission.md) — Symbols introduced/changed in this module
> - [`symbol_index_infra_platform.md`](../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index_infra_platform.md) — Existing platform/permission symbols

Key functions in this document:
- `matchPathRule` (`yL`) — File-path rule matcher with v2.1.133 prefix-preservation fix
- `posixifyPath` (`MP`) — Converts `C:\foo` → `/c/foo`, used to normalize Windows paths
- `posixRelative` (`$Q6`) — Wrapper that posixifies on Windows then uses `path.posix.relative`
- `getRulesByDirectory` (`Oy4`) — Returns `cwd → ruleContent → rule` nested map
- `normalizePath` (`eq`) — General path normalization (handles `~`, resolves relative)
- `validatePermissionRule` (`Hm8`) — Schema validator (accepts `Edit(/**)` and `Edit(C:\**)`)
- `ignoreLibrary` (`Ky4`) — The third-party gitignore-style matcher
- `findFirstAllowingRule` (`wy4`) — Walks file paths through `yL` looking for an allow match
