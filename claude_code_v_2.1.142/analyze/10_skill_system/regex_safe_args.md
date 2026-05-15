# Regex-Safe Argument Substitution (v2.1.139)

## What it does

Skill markdown bodies can reference frontmatter-declared argument names with `$name` syntax. For example:

```yaml
---
name: deploy
arguments: [target, build_id]
---

Deploy to $target using build $build_id.
```

When the user types `/deploy production 42`, the host substitutes `$target -> production`, `$build_id -> 42`, and sends the expanded body to the model.

v2.1.139 fixes a latent bug: if an argument name contained regex metacharacters (`.`, `*`, `+`, `?`, `^`, `$`, `{`, `}`, `(`, `)`, `|`, `[`, `]`, `\`), the substitution silently failed. The host built a `RegExp` from `\$${name}(?![\[\w])`, so a frontmatter `arguments: ["foo.bar"]` produced the regex `\$foo.bar(?![\[\w])` - which matches `$foo<any-char>bar`, not literal `$foo.bar`. v2.1.142 ships the fix via the new `escapeRegex` helper `Vx`.

---

## How it works

### 1. The escaper

```javascript
// ============================================
// escapeRegex - Escape regex metacharacters in a string
// Location: cli_inner_pretty.js:9491-9493
// ============================================

// ORIGINAL (for source lookup):
function Vx(H) {
  return H.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// READABLE (for understanding):
function escapeRegex(input) {
  // Each regex metacharacter is replaced with its escaped form.
  // E.g. "foo.bar" -> "foo\.bar", "list[0]" -> "list\[0\]", "a*b" -> "a\*b".
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Mapping: Vx -> escapeRegex, H -> input
```

The character class covers every metacharacter that has special meaning inside a `RegExp` literal. The replacement `\\$&` prepends `\\` to the matched character (one backslash in the source string, which becomes one backslash in the regex).

### 2. The argument substitution function

```javascript
// ============================================
// substituteArgsInPrompt - Expand $arg placeholders in skill body
// Location: cli_inner_pretty.js:217479-217509
// ============================================

// ORIGINAL (for source lookup):
function uFH(H, $, q = !0, K = [], _) {
  if ($ === void 0 || $ === null) return H;
  let A = (O) => {
      let M = O ?? "";
      return _ ? _(M) : M;
    },
    z = z36($),
    Y = H,
    f = K.map((O, M) => ({ name: O, i: M }))
      .filter((O) => Boolean(O.name))
      .sort((O, M) => M.name.length - O.name.length);
  for (let { name: O, i: M } of f) H = H.replace(new RegExp(`\\$${Vx(O)}(?![\\[\\w])`, "g"), () => A(z[M]));
  if (
    ((H = H.replace(/\$ARGUMENTS\[(\d+)\]/g, (O, M) => {
      let w = parseInt(M, 10);
      return A(z[w]);
    })),
    (H = H.replace(/\$(\d+)(?!\w)/g, (O, M) => {
      let w = parseInt(M, 10);
      return A(z[w]);
    })),
    (H = H.replaceAll("$ARGUMENTS", () => A($))),
    H === Y && q && $)
  )
    H =
      H +
      `

ARGUMENTS: ${A($)}`;
  return H;
}

// READABLE (for understanding):
function substituteArgsInPrompt(
  content,
  rawArgs,
  appendIfNoPlaceholder = true,
  argumentNames = [],
  postprocess,
) {
  if (rawArgs === undefined || rawArgs === null) return content;
  const escape = (value) => {
    const safe = value ?? "";
    return postprocess ? postprocess(safe) : safe;
  };
  const parsedArgs = parseArgumentString(rawArgs);
  const original = content;
  // Sort by descending length so that "$longArg" is replaced before "$arg" would consume part of it
  const namedArgs = argumentNames
    .map((name, i) => ({ name, i }))
    .filter(({ name }) => Boolean(name))
    .sort((a, b) => b.name.length - a.name.length);
  for (const { name, i } of namedArgs) {
    // <-- v2.1.139 FIX: every name is now wrapped in escapeRegex(...) before being
    //     embedded in the regex source. Previously this was `\\$${name}(?![\\[\\w])`
    //     which let regex metacharacters in `name` change the matcher semantics.
    content = content.replace(
      new RegExp(`\\$${escapeRegex(name)}(?![\\[\\w])`, "g"),
      () => escape(parsedArgs[i]),
    );
  }
  // $ARGUMENTS[N] - indexed access
  content = content.replace(/\$ARGUMENTS\[(\d+)\]/g, (_, indexStr) => escape(parsedArgs[parseInt(indexStr, 10)]));
  // $N - shorthand for $ARGUMENTS[N]
  content = content.replace(/\$(\d+)(?!\w)/g, (_, indexStr) => escape(parsedArgs[parseInt(indexStr, 10)]));
  // $ARGUMENTS - full arguments string
  content = content.replaceAll("$ARGUMENTS", () => escape(rawArgs));
  if (content === original && appendIfNoPlaceholder && rawArgs) {
    content = `${content}\n\nARGUMENTS: ${escape(rawArgs)}`;
  }
  return content;
}

// Mapping:
//   uFH -> substituteArgsInPrompt,    H   -> content,
//   $   -> rawArgs,                   q   -> appendIfNoPlaceholder,
//   K   -> argumentNames,             _   -> postprocess,
//   z36 -> parseArgumentString,       Vx  -> escapeRegex,
//   z   -> parsedArgs,                Y   -> original,
//   f   -> namedArgs
```

### 3. Where this function is called

The expansion happens inside the skill-prompt builder (`$I6.getPromptForCommand`, `cli_inner_pretty.js:406257`):

```javascript
// ============================================
// formatCommand.getPromptForCommand - The per-invocation expansion entry point
// Location: cli_inner_pretty.js:406257-406296 (relevant lines 406263)
// ============================================

// ORIGINAL (for source lookup):
async getPromptForCommand(h, C) {
  let R = J ? `Base directory for this skill: ${J}\n\n${_}` : _;
  if (((R = uFH(R, h, !0, Y, rH8)), J)) {                    // <-- line 406263
    let B = J;
    R = R.replaceAll("${CLAUDE_SKILL_DIR}", B);
  }
  // ... ${CLAUDE_SESSION_ID}, ${CLAUDE_EFFORT}, shell-fence handling ...
}

// READABLE (for understanding):
async getPromptForCommand(rawArgs, toolUseContext) {
  let body = baseDir ? `Base directory for this skill: ${baseDir}\n\n${markdownContent}` : markdownContent;
  // Argument substitution lives here. argumentNames is captured at skill-load time
  // from frontmatter; rH8 is the shell-fence post-processor that escapes `!` chars
  // inside replacement values so they cannot be re-interpreted as shell-fence triggers.
  body = substituteArgsInPrompt(body, rawArgs, /*appendIfNoPlaceholder*/ true, argumentNames, escapeShellBang);
  if (baseDir) body = body.replaceAll("${CLAUDE_SKILL_DIR}", baseDir);
  body = body.replace(/\$\{CLAUDE_SESSION_ID\}/g, sessionId());
  body = body.replaceAll("${CLAUDE_EFFORT}", effortValueFor(modelOverride ?? mainLoopModel, skillEffort ?? toolUseContext.getEffortValue()));
  // ...
  return [{ type: "text", text: body }];
}

// Mapping: h -> rawArgs, C -> toolUseContext, Y -> argumentNames, rH8 -> escapeShellBang,
//          J -> baseDir, _ -> markdownContent, M -> modelOverride, G -> skillEffort, aT -> effortValueFor
```

The post-processor `rH8` (`escapeShellBang`) protects against a related security issue: the substituted argument value cannot inject `!command` shell fences via cleverly placed `` ` `` characters.

### 4. The parseArgumentString helper

```javascript
// ============================================
// parseArgumentString - Split a raw arg string into tokens
// Location: cli_inner_pretty.js:217462-217466
// ============================================

// ORIGINAL (for source lookup):
function z36(H) {
  if (!H || !H.trim()) return [];
  let $ = KX(H);
  return $.length > 0 ? $ : H.split(/\s+/).filter(Boolean);
}

// READABLE (for understanding):
function parseArgumentString(input) {
  if (!input || !input.trim()) return [];
  // Try shell-style tokenizer first (handles quoted strings like 'hello world')
  let tokens = tryParseShellCommand(input);
  // Fall back to plain whitespace split if shell parsing fails
  return tokens.length > 0 ? tokens : input.split(/\s+/).filter(Boolean);
}

// Mapping: z36 -> parseArgumentString, KX -> tryParseShellCommand
```

This is the same logic as the v2.1.88 TypeScript source at `src/utils/argumentSubstitution.ts:parseArguments` - the regex-safe escape is the only semantic delta.

---

## Why this approach

**Why escape, not validate?** The simpler fix would be to reject argument names that contain regex metacharacters at skill load time. But:

- Plugin authors may already have skills in the wild with such names (e.g. `version.tag`).
- Some metacharacters (`-`, `_`) are not even in the metacharacter class but other dot-style names are surprisingly common.
- The `Vx` escaper is a well-known idiom; using it makes the substitution behave intuitively (`$foo.bar` matches literal `$foo.bar`, not `$foo<any>bar`).

**Why the descending-length sort?** Without it, `$arg` would be replaced before `$argument`, swallowing the prefix and leaving `ument` literal in the output. The sort ensures longer names win when one is a prefix of another.

**Why the `(?![\[\w])` negative lookahead?** It prevents `$arg` from matching inside `$argument` (word character follows) or `$ARGUMENTS[0]` (`[` follows). The shorthand `$0..$9` matchers have their own `(?!\w)` lookahead for the same reason.

**Key insight:** The fix is two characters wide - wrapping `${O}` (raw name) with `Vx(...)` (escaped name) - but it required someone to notice that frontmatter argument names are user-controlled input flowing into a constructed regex. This is the kind of edge case that surfaces only when a plugin author picks a metacharacter-containing name and reports "my substitution doesn't work."

---

## Cross-references

- `Vx` is also used by the `Skill(name *)` wildcard rule path (see `skill_wildcard.md`) and by the goal command's stop-hook prompt match path (see `../39_goal/`).
- The v2.1.88 source-of-truth for this function is `src/utils/argumentSubstitution.ts:substituteArguments` - same behavior, except v2.1.88 did **not** call `escapeRegex` on the argument name.
- The shell-fence post-processor `rH8` (`escapeShellBang`) at `cli_inner_pretty.js:217510-217514` is part of the v2.1.91 disable-shell-execution policy (covered in v2.1.112 `10_skill_system/disable_shell_execution.md`).
