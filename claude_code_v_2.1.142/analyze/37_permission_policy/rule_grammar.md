# Permission Rule Grammar (v2.1.142)

**Theme:** Permission rules are user-authored strings of the form `Tool(content)`. The shape is small, but every tool interprets `content` differently — Bash treats it as a command prefix with wildcards, Edit treats it as a path glob, Skill treats it as a name with optional trailing-wildcard, MCP servers use `hostPattern`/`pathPattern` envelopes. This document maps the grammar for each rule type, with concrete examples.

The grammar is *split into two halves*:

- **Parsing** (`permissionRuleValueFromString`): split `Tool(content)` into `{toolName, ruleContent}`. Backslash-escaping for parentheses (`\(`, `\)`) lets `Bash(python -c "print\(1\)")` parse cleanly.
- **Matching** (per-tool `checkPermissions` or central matcher like `tS6`): given a rule's `ruleContent`, decide if it matches the current tool input. Each tool has its own matching logic.

---

## 1. The Outer Shape

```
RULE ::= TOOLNAME                      # tool-wide (matches all uses of the tool)
       | TOOLNAME "(" CONTENT ")"      # tool-with-content

TOOLNAME ::= ASCII identifier          # "Bash", "Edit", "Read", "Write", "Skill", ...
                                       # Also: "mcp__SERVER__TOOL" or "mcp__SERVER"

CONTENT  ::= bytes-with-escaped-parens # anything; ( and ) must be backslash-escaped
```

### Parsing algorithm (`permissionRuleValueFromString`)

Bundle implementation lives in the per-tool validators. The 2.1.88 TypeScript baseline is at `/lyz/codespace/3rd/claude-code/src/utils/permissions/permissionRuleParser.ts`. The key invariants:

1. Find the **first unescaped `(`** — backslash-counts before `(` determine escape state.
2. Find the **last unescaped `)`** — same logic.
3. Closing `)` must be the **last character** — else treat as plain tool name.
4. `Tool()` and `Tool(*)` both collapse to a tool-wide rule (no content).
5. Empty tool name (e.g., `(foo)`) collapses to a plain-string tool name.

The unescaper reverses `\\` and `\(`/`\)` after splitting:

```javascript
// ============================================
// unescapeRuleContent - Reverse the escape sequences in rule content
// Location: 2.1.88 src/utils/permissions/permissionRuleParser.ts (mirrored in bundle)
// ============================================

// ORIGINAL (for source lookup):
// (2.1.88 TypeScript source — bundle equivalent uses split paren counters eu8/vwq)
function unescapeRuleContent(content: string): string {
  return content
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\\\/g, '\\');
}

// READABLE (for understanding):
function unescapeRuleContent(escapedContent) {
  // Order matters: unescape parens first, then backslashes.
  // The reverse order would un-escape a literal "\\(" into "(" and lose the backslash.
  return escapedContent
    .replace(/\\\(/g, '(')      // \( → (
    .replace(/\\\)/g, ')')      // \) → )
    .replace(/\\\\/g, '\\');    // \\ → \
}

// Mapping: 1:1 (the bundle's per-decl is split across `eu8`/`vwq` for paren counting)
```

**Validation** (`Hm8`, line 50222): rejects empty rules and mismatched parens. Open + close count must match.

---

## 2. Bash Rule Grammar (`Bash(...)`)

Bash is the largest grammar by far. The content is a *command prefix* with optional wildcards.

### Forms

| Form | Example | Matches |
|---|---|---|
| Plain command | `Bash(ls)` | exactly `ls` (no args) |
| Command with args | `Bash(ls -la)` | exactly `ls -la` |
| Prefix wildcard | `Bash(ls *)` or `Bash(ls:*)` | `ls foo`, `ls -la`, `ls /etc` |
| Just the command | `Bash(npm)` | exactly `npm` |
| Command + subcommand | `Bash(git diff *)` | `git diff`, `git diff main`, `git diff HEAD~1` |
| Deep prefix | `Bash(git diff main *)` | `git diff main`, `git diff main HEAD~1` |
| Tool-wide | `Bash` | any Bash invocation |

### The two wildcard syntaxes

- `Bash(cmd *)` — space-asterisk; natural reading: "cmd with any args"
- `Bash(cmd:*)` — colon-asterisk; legacy Bash-specific form

Both work identically. The space form is preferred and shows up in permission prompts; the colon form is preserved for backward compat.

### What's stripped from the command before matching

The bash classifier's wrapper-stripper `WdK` (cli_inner_pretty.js:205239) transparently strips these **wrapper commands** so an allow/deny rule against `rm` also fires for `sudo rm`, `env A=B rm`, `watch rm`:

```
sh bash zsh fish csh tcsh ksh dash
cmd powershell pwsh
env xargs command builtin noglob
nice stdbuf nohup timeout time
watch ionice chrt setsid taskset
strace ltrace script flock unshare nsenter
sudo doas pkexec
```

This is the **`N64` set** (cli_inner_pretty.js:421159-421195). See [`bash_wrapper_deny.md`](./bash_wrapper_deny.md) for the v2.1.113 expansion that added the bottom three rows.

### Compound commands

When the command contains `&&`, `||`, `;`, `|`, each segment is parsed and **each is checked separately against the rules**. `safe && rm -rf /` fires the deny rule on the `rm` segment even though the first segment is allowed. v2.1.97 closed an earlier bypass where compound segments slipped past per-segment checks.

### Env-var prefixes

`A=B C=D cmd args` (Bash's env-var-prefix syntax) is recognized:

- The env-var prefix is **stripped** before matching the command head (`cmd`)
- The env-var names are checked against a **safe-env-var allowlist** (`N98`, 37 entries: `LANG`, `LC_*`, `PATH` if non-shadowing, etc.). Unknown env names fail the auto-allow.
- v2.1.97 fixed a bypass where `LD_PRELOAD=evil cmd` slipped through.

### `find -exec` / `-delete` exclusion

The v2.1.113 fix prevents `Bash(find:*)` from auto-approving `find . -exec rm {} \;` — see [`find_exec_delete_block.md`](./find_exec_delete_block.md). The static analyzer scans find's argv for action predicates (`-exec`, `-execdir`, `-ok`, `-okdir`, `-delete`, `-fprint`, `-fprint0`, `-fprintf`, `-fls`) and rejects auto-allow.

### `/dev/tcp` redirects

Bash's `/dev/tcp/host/port` and `/dev/udp/...` redirects are explicit network operations. The classifier rejects auto-allow on any command with a redirect target matching `/^\/dev\/(tcp|udp)\//` — v2.1.97 closed this bypass class.

### Shell expansion (v2.1.139 relaxation)

Pre-v2.1.139, the sandbox auto-allow path (`autoAllowBashIfSandboxed`) rejected any argument containing `$`, backticks, `*`, `?`, `[]`. v2.1.139 added `v64` (AST-aware path, cli_inner_pretty.js:420551) that *accepts* shell expansion when:

- The AST parse succeeds
- Env-var prefix env names are all in the safe allowlist
- No `/dev/tcp` redirects
- `rm`/`rmdir` targets pass the dangerous-path check (`IX6`)

See [`auto_allow_shell_expansion.md`](./auto_allow_shell_expansion.md).

### Examples

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",          // matches npm run build, npm run test, etc.
      "Bash(git diff *)",         // git diff, git diff main, git diff -- path
      "Bash(ls)",                 // exact: just `ls`
      "Bash(echo *)"              // any echo invocation
    ],
    "deny": [
      "Bash(rm -rf /)",           // exact (rare — usually you'd use a path-based deny)
      "Bash(curl *)",             // any curl invocation
      "Bash(npm publish *)"       // npm publish with any args
    ]
  }
}
```

---

## 3. Edit/Write/Read/MultiEdit Rule Grammar (`Edit(...)`)

These tools share a **path-matching** grammar.

### Forms

| Form | Example | Matches |
|---|---|---|
| Tool-wide | `Edit` | any Edit invocation |
| Specific file | `Edit(/abs/path/file.ts)` | exactly that path |
| Glob | `Edit(/src/**/*.ts)` | any .ts file under /src |
| Glob with prefix | `Edit(./src/**)` | any file under cwd/src |
| Directory match | `Edit(./src/)` | matches files in ./src |
| Drive root (Windows) | `Edit(C:\\**)` | any file on C: drive |
| Filesystem root | `Edit(/**)` | any file on filesystem |

### Path normalization

The matcher (`yL`, cli_inner_pretty.js:518097) normalizes paths before comparison:

1. **Tilde expansion**: `~/foo` → `/home/user/foo` (Linux/macOS) or `C:\Users\user\foo` (Windows)
2. **Backslash → forward slash on Windows** (`MP` posixification): `C:\foo` → `/c/foo`
3. **Relative-to-absolute**: `./src/foo` → absolute via cwd lookup
4. **Symlink resolution**: symlinks resolved via filesystem stat (path doesn't traverse outside `additionalDirectories`)

### Glob semantics

Backed by the `ignore` library — same syntax as `.gitignore`:

- `*` matches a single path segment (no `/`)
- `**` matches zero or more path segments
- `?` matches a single character
- `[a-z]` character classes
- `!pattern` negates (rarely useful in allow lists)

### The v2.1.133 drive-root fix

```javascript
// ============================================
// matchPathRule - Drive-root pattern preserves /** suffix
// Location: cli_inner_pretty.js:518097-518123
// ============================================

// ORIGINAL (for source lookup):
let f = Array.from(Y.keys()).map((D) => {
  let j = D;
  if (j.endsWith("/**")) {
    let J = j.slice(0, -3);
    j = /[^/]/.test(J) ? J : "/**";
  }
  return j;
});

// READABLE (for understanding):
const patterns = Array.from(rulesByContent.keys()).map((ruleContent) => {
  let pattern = ruleContent;
  if (pattern.endsWith("/**")) {
    const prefix = pattern.slice(0, -3);  // strip /**
    // If the prefix contains any non-slash char, use it as prefix-match.
    // If the prefix is "", "/", "//", etc., keep /** so root matches.
    pattern = /[^/]/.test(prefix) ? prefix : "/**";
  }
  return pattern;
});

// Mapping: yL→matchPathRule, Y→rulesByContent, D→ruleContent, J→prefix
```

**Why:** Without this fix, `Edit(/**)` stripped to `""` which the `ignore` library treats as a no-op. With the fix, the stripped-to-root case keeps `/**` so root patterns work. See [`drive_root_match.md`](./drive_root_match.md).

### `additionalDirectories` interaction

`permissions.additionalDirectories` is a list of paths that are *added* to the cwd-based directory tree for path rule matching. This is how `--add-dir /some/other/dir` works — the new dir becomes a valid cwd-anchor for path rules.

Pre-fix (v2.1.133): mapped network drives passed via `--add-dir` were being denied because the path normalizer was off-by-one. The fix correctly handles UNC paths and drive-letter mappings.

### Examples

```json
{
  "permissions": {
    "allow": [
      "Edit(./src/**)",                // any file under cwd/src
      "Write(./build/**)",             // can write anywhere under build
      "Read(./node_modules/**)",       // any file under node_modules (Read default-allow anyway)
      "Edit(C:\\projects\\**)"         // (Windows) any file under projects
    ],
    "deny": [
      "Edit(./.env*)",                 // never edit .env files (always sensitive)
      "Edit(./node_modules/**)",       // never modify node_modules
      "Write(./.git/**)"               // never write to .git internals
    ]
  }
}
```

---

## 4. Skill Rule Grammar (`Skill(...)`)

Skills are slash commands packaged as tools. Permission rules name the skill.

### Forms

| Form | Example | Matches |
|---|---|---|
| Tool-wide | `Skill` | any Skill invocation |
| Exact name | `Skill(commit)` | only the `commit` skill |
| Prefix wildcard | `Skill(commit *)` | `commit`, `commit hotfix`, `commit a feature` |
| Bash-style wildcard | `Skill(commit:*)` | same as `commit *` |

### v2.1.121 introduction, v2.1.139 fix

- **v2.1.121**: introduced `Skill(name *)` syntax, but the matcher only honored exact match — wildcard rules were *accepted* by the schema but **silently never matched**.
- **v2.1.139**: fixed the matcher to do prefix-match like Bash. See [`skill_wildcard_match.md`](./skill_wildcard_match.md).

### Matcher (post-fix)

```javascript
// ============================================
// skillRuleMatcher - Prefix-aware skill name matcher
// Location: cli_inner_pretty.js:353604-353658 (within Skill tool's checkPermissions)
// ============================================

// ORIGINAL (for source lookup):
O = (j) => {
  let J = j.startsWith("/") ? j.substring(1) : j;
  if (J === _) return !0;
  if (J.endsWith(":*") || J.endsWith(" *")) {
    let X = J.slice(0, -2);
    return _.startsWith(X);
  }
  return !1;
};

// READABLE (for understanding):
const matchesSkillRule = (rulePattern) => {
  // Skill names may have a leading slash from the rule string (`/commit`); strip it.
  const normalized = rulePattern.startsWith("/") ? rulePattern.substring(1) : rulePattern;

  // Exact match
  if (normalized === skillName) return true;

  // Prefix match: trailing " *" or ":*"
  if (normalized.endsWith(":*") || normalized.endsWith(" *")) {
    const prefix = normalized.slice(0, -2);
    return skillName.startsWith(prefix);
  }

  return false;
};

// Mapping: O→matchesSkillRule, j→rulePattern, J→normalized, _→skillName, X→prefix
```

### The two wildcard syntaxes

Same as Bash:
- `Skill(commit *)` — natural reading
- `Skill(commit:*)` — Bash-style legacy form

### `skillOverrides` (v2.1.129)

The `skillOverrides` settings key is a **separate authority** that sits above the permission system. It controls *availability* per-skill:

```json
{
  "skillOverrides": {
    "deploy": "off",                  // not visible to model or `/`
    "advanced-refactor": "name-only", // visible by name, description hidden
    "debug": "user-invocable-only"    // user can call via `/`, model can't auto-invoke
  }
}
```

`skillOverrides: "off"` makes the skill **invisible**, so `Skill(deploy)` allow rules have nothing to fire on. See [`skill_wildcard_match.md`](./skill_wildcard_match.md) for the layered authority semantics.

---

## 5. MCP Server / Tool Rule Grammar

MCP tools have a structured name: `mcp__<server>__<tool>`. Rules can target the tool or the server.

### Forms

| Form | Example | Matches |
|---|---|---|
| Specific MCP tool | `mcp__github__create_issue` | only that tool |
| Server-wide | `mcp__github` | all tools from `github` server |
| Server wildcard | `mcp__github__*` | (alternate form) all tools from `github` |

### Server-name matching (in `toolMatchesRule`)

```javascript
// 2.1.88 TS reference:
const ruleInfo = mcpInfoFromString(rule.ruleValue.toolName)
const toolInfo = mcpInfoFromString(toolNameForRuleMatch)
return (
  ruleInfo !== null &&
  toolInfo !== null &&
  (ruleInfo.toolName === undefined || ruleInfo.toolName === '*') &&
  ruleInfo.serverName === toolInfo.serverName
)
```

A rule `mcp__github` (no third underscore segment) matches any tool whose server is `github`. A rule `mcp__github__*` is treated as wildcard. A rule `mcp__github__create_issue` is exact.

### `deniedMcpServers` (separate from `permissions.deny`)

Settings can also include `deniedMcpServers` — a parallel structure that blocks **the server itself from connecting**, not the tools post-connect. This shape uses **`hostPattern`** and **`pathPattern`** envelopes for marketplace-loaded servers:

```json
{
  "deniedMcpServers": [
    {
      "source": "hostPattern",
      "hostPattern": "evil.com$"
    },
    {
      "source": "pathPattern",
      "pathPattern": "^/opt/approved/"
    }
  ]
}
```

Schema lives at `cli_inner_pretty.js:49650-49662`:

```javascript
// ============================================
// mcpServerSourcePatternSchema - MCP server pattern envelope (host/path)
// Location: cli_inner_pretty.js:49650-49662
// ============================================

// ORIGINAL (for source lookup):
source: y.literal("hostPattern"),
hostPattern: y.string(),
// ... or:
source: y.literal("pathPattern"),
pathPattern: y.string()
  .describe('Regex pattern matched against the .path field of file and directory sources. Use in strictKnownMarketplaces to allow filesystem-based marketplaces alongside hostPattern restrictions for network sources. Use ".*" to allow all filesystem paths, or a narrower pattern (e.g., "^/opt/approved/") to restrict to specific directories.'),

// READABLE (for understanding):
const mcpServerSourcePatternSchema = z.union([
  z.object({
    source: z.literal("hostPattern"),
    hostPattern: z.string(),
  }),
  z.object({
    source: z.literal("pathPattern"),
    pathPattern: z.string()
      .describe("Regex pattern matched against the .path field of file and directory sources..."),
  }),
]);

// Mapping: 1:1 (no obfuscation, schema names appear in literal form in the schema)
```

### Mixed-case hostname fix (v2.1.128)

`deniedMcpServers` patterns with a `*://` scheme wildcard weren't matching mixed-case hostnames. The fix lowercases both sides before matching.

---

## 6. WebFetch Rule Grammar (`WebFetch(domain:...)`)

WebFetch rules use the **domain:** prefix format. The validator (cli_inner_pretty.js:50184) enforces this:

```
Valid:
  WebFetch(domain:example.com)
  WebFetch(domain:*.google.com)
  WebFetch(domain:github.com)

Invalid (validation error):
  WebFetch(https://example.com)    # URLs not accepted
  WebFetch(example.com)            # missing "domain:" prefix
  WebFetch                         # tool-wide is rare — almost everything is hostnames
```

The wildcard form (`*.google.com`) matches any subdomain.

---

## 7. WebSearch Rule Grammar (`WebSearch(...)`)

WebSearch rules use **free-form text** (the search query). Examples:

```json
"WebSearch(claude ai)"
"WebSearch(typescript tutorial)"
```

This is essentially "always allow these specific queries" — rarely used in practice. The validator (cli_inner_pretty.js:50180) just whitelists the format.

---

## 8. Agent Rule Grammar (`Agent(...)`)

The `Agent` tool runs a subagent. Permission rules target the **agent type**:

```json
{
  "permissions": {
    "deny": ["Agent(Explore)", "Agent(general)"],
    "allow": ["Agent(code-reviewer)"]
  }
}
```

`getDenyRuleForAgent` (2.1.88: src/utils/permissions/permissions.ts:308) walks deny rules with `ruleValue.toolName === agentToolName` and matches the `ruleContent` against the agent type.

### Case-insensitive matching (v2.1.140)

v2.1.140 made `subagent_type` matching case- and separator-insensitive: `Agent(Code Reviewer)` now matches `code-reviewer` (and vice versa).

---

## 9. Putting It Together — A Worked Example

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(git diff *)",
      "Edit(./src/**)",
      "Skill(commit *)"
    ],
    "deny": [
      "Bash(rm:*)",                    // matches rm, sudo rm, env A=B rm (post-v2.1.113)
      "Bash(curl *)",                  // matches curl directly and via wrappers
      "Edit(./.env*)",
      "Edit(./node_modules/**)",
      "WebFetch(domain:evil.com)"
    ],
    "ask": [
      "Bash(npm publish *)"            // require prompt even if otherwise allowed
    ],
    "additionalDirectories": ["/work/external-project"]
  },
  "autoMode": {
    "allow": ["$defaults", "Allow my internal monitoring tool"],
    "hard_deny": ["$defaults", "Block any write to /etc/secrets/**"]
  },
  "skillOverrides": {
    "deploy": "user-invocable-only"
  }
}
```

How this evaluates for `Bash(sudo rm -rf /etc/secrets/keys)`:

1. **Bash wrapper strip**: `sudo` recognized as wrapper → command head becomes `rm`
2. **Deny rule check**: `Bash(rm:*)` matches → `behavior: "deny"`. Done.

How this evaluates for `Edit(./src/components/Button.tsx)`:

1. **Deny check**: `./.env*`, `./node_modules/**` — neither matches.
2. **Ask check**: nothing.
3. **Tool callback**: Edit's `checkPermissions` runs path normalization, dangerous-path check (`bY$`), then returns `passthrough`.
4. **Mode**: not bypass.
5. **Allow check**: `Edit(./src/**)` matches → `behavior: "allow"`. Done.

How this evaluates for `Skill(commit hotfix)` with `skillOverrides.commit` unset:

1. **Skill availability**: `commit` skill is visible (no override → default `on`)
2. **Deny check**: nothing.
3. **Tool callback** (Skill's `checkPermissions`): matches allow rule `Skill(commit *)` → `behavior: "allow"`. Done.

How this evaluates for `Skill(deploy)` when `skillOverrides.deploy === "user-invocable-only"` and the model invokes it:

1. **Skill availability**: `deploy` is `user-invocable-only` → model **can't see it**. The model would never emit this tool call. (Even if it did somehow, `checkPermissions` would deny.)

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_v2_1_142_permission_arch.md`](../00_overview/symbol_additions_v2_1_142_permission_arch.md) — Symbols introduced/used in this document

Key functions and constants in this document:
- `permissionRuleValueFromString` (2.1.88 TS reference) — Parse `Tool(content)` into structured rule value
- `unescapeRuleContent` (2.1.88 TS reference) — Reverse the `\(`/`\)`/`\\` escapes
- `findUnescapedParen` — Paren-counting routines (`eu8`, `vwq` in bundle)
- `validatePermissionRuleSyntax` (`Hm8`) — Reject empty / mismatched-paren rules (cli_inner_pretty.js:50222)
- `wrapperStripper` (`WdK`) — Bash wrapper-stripping AST walker (cli_inner_pretty.js:205239)
- `safeAutoAllowWrappers` (`N64`) — 33-wrapper set (cli_inner_pretty.js:421159)
- `matchPathRule` (`yL`) — Path glob matcher with drive-root fix (cli_inner_pretty.js:518097)
- `findDangerousFlags` (`gz6`) — find-flags blocking auto-allow (cli_inner_pretty.js:205409)
- `findSafeFlags` (`Qz6`) — find-flags that don't block (paired with `gz6`)
- `safeEnvVarAllowlist` (`N98`) — Safe env-var names for Bash env-prefix (37 entries)
- `skillRuleMatcher` (inline `O` inside `SnH.checkPermissions`) — Skill prefix-wildcard matcher
- `mcpInfoFromString` (2.1.88 TS reference) — Split `mcp__server__tool` → `{serverName, toolName}`
- `webFetchValidator` (inline in `cli_inner_pretty.js:50184`) — Validate `WebFetch(domain:...)` shape
