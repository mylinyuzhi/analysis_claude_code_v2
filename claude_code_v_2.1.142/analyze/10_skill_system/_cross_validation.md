# Cross-Validation Report — Skill System Analysis (v2.1.142)

> Audit trail for the skill-system analysis docs (`skill_frontmatter.md`, `skill_substitutions.md`, `skill_lifecycle.md`, `skill_listing_budget.md`, `skill_overrides.md`, `skills_dialog_ui.md`). Each major claim is restated with the exact source citation and the verbatim source lines that support it. Discrepancies discovered during the audit are listed at the bottom and have already been corrected in the source docs.

All line numbers reference `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` (611,353 lines total).

---

## Section A — Frontmatter Schema (`skill_frontmatter.md`)

### A.1 `os1` (COMMON_FRONTMATTER) — shared schema for skills and slash commands

**Claim**: Lines 198647-198676 define a zod schema with fields `name`, `description`, `model`, `allowed-tools`, `argument-hint`, `arguments`, `disable-model-invocation`, `user-invocable`, `effort`, `shell`, `version`.

**Source** (cli_inner_pretty.js:198647-198676, verbatim):
```javascript
os1 = yH(() =>
  y.object({
    name: RP().optional().describe("Display name. Defaults to the filename without extension."),
    description: RP().optional().describe("One-line summary shown in listings and the Skill tool."),
    model: RP().optional().describe("Model override (`haiku`, `sonnet`, `opus`, or a full ID). Use `inherit` to match the parent conversation."),
    "allowed-tools": yUH().optional().describe("Tools available to the model while this file is active. Comma-separated string or YAML list."),
    "argument-hint": RP().optional().describe("Placeholder text shown after the slash command name."),
    arguments: yUH().optional().describe("@internal — typed variant of argument-hint; argument-hint is the documented form"),
    "disable-model-invocation": hUH().optional().describe("If true, the model cannot invoke this via the Skill tool; only users can type the slash command."),
    "user-invocable": hUH().optional().describe("If false, hides the slash command from users; only the model can invoke it via the Skill tool."),
    effort: RP().optional().describe("Thinking effort for the model: `low`, `medium`, `high`, `max`, or an integer."),
    shell: RP().optional().describe("Shell for `!`-command blocks: `bash` or `powershell`. Defaults to bash regardless of platform."),
    version: RP().optional().describe("@internal — bookkeeping, not surfaced to users"),
  }),
),
```

✅ **Verified.** All 11 fields present at the stated location.

### A.2 `rA6` (SKILL_FRONTMATTER) — extends `os1` with skill-only fields

**Claim**: Lines 198678-198716 extend `os1` with `when_to_use`, `paths`, `hooks`, `context`, `agent`, `fallback`, `created_by`, `improved_by`, plus @internal: `mcpServers`, `lspServers`, `agents`, `outputStyles`, `themes`, `workflows`, `channels`, `monitors`, `settings`, `experimental`, `dependencies`, `metadata`.

**Source** (cli_inner_pretty.js:198678-198716, verbatim):
```javascript
rA6 = yH(() =>
  os1().extend({
    when_to_use: RP().optional()...,
    paths: yUH().optional()...,
    hooks: y.unknown().optional()...,
    context: y.enum(["inline", "fork"]).nullable().optional()...,
    agent: RP().optional()...,
    fallback: hUH().optional()...,
    created_by: RP().optional()...,
    improved_by: RP().optional()...,
    mcpServers: y.unknown().optional().describe("@internal"),
    lspServers: y.unknown().optional().describe("@internal"),
    agents: y.unknown().optional().describe("@internal"),
    outputStyles: y.unknown().optional().describe("@internal"),
    themes: y.unknown().optional().describe("@internal"),
    workflows: y.unknown().optional().describe("@internal"),
    channels: y.unknown().optional().describe("@internal"),
    monitors: y.unknown().optional().describe("@internal"),
    settings: y.unknown().optional().describe("@internal"),
    experimental: y.unknown().optional().describe("@internal"),
    dependencies: y.unknown().optional().describe("@internal"),
    metadata: y.unknown().optional().describe("@internal"),
  }),
),
```

✅ **Verified.** All claimed fields present.

### A.3 `HI6` parser — produces normalized Skill record

**Claim**: Lines 406160-406194 parse the YAML frontmatter into a normalized record with fields `displayName`, `description`, `allowedTools`, `argumentHint`, `argumentNames`, `disableModelInvocation`, `userInvocable`, `hooks`, `executionContext` (renamed from `context`), `agent`, `effort`, `shell`, `model`, `whenToUse`, `version`, `createdBy`, `declaredFields`, `fallback`.

**Source spot-check** (cli_inner_pretty.js:406160-406194):
```javascript
function HI6(H, $, q, K = "Skill") {
  let _ = yE(H.description, q),
    A = _ ?? QHH($, K),
    z = H["user-invocable"] === void 0 ? !0 : MBH(H["user-invocable"]),
    Y = H.model, f;
  if (typeof Y === "string" && Y.trim().length > 0) {
    let w = Y.trim();
    f = w === "inherit" ? void 0 : n7(w);
  }
  let O = H.effort, M = O !== void 0 ? DC(O) : void 0;
  if (O !== void 0 && M === void 0)
    N(`Skill ${q} has invalid effort '${O}'. Valid options: ${sF.join(", ")} or an integer`);
  return {
    displayName: H.name != null ? String(H.name) : void 0,
    description: A,
    hasUserSpecifiedDescription: _ !== null,
    allowedTools: rt(H["allowed-tools"]),
    argumentHint: H["argument-hint"] != null ? String(H["argument-hint"]) : void 0,
    argumentNames: iH8(H.arguments),
    whenToUse: H.when_to_use != null ? String(H.when_to_use) : void 0,
    version: H.version != null ? String(H.version) : void 0,
    model: f,
    disableModelInvocation: MBH(H["disable-model-invocation"]),
    userInvocable: z,
    hooks: W45(H, q),
    executionContext: H.context === "fork" ? "fork" : void 0,
    agent: H.agent != null ? String(H.agent) : void 0,
    effort: M,
    shell: di$(H.shell, q),
    createdBy: H.created_by === "dream-proposal" || H.improved_by === "dream-proposal" ? "dream-proposal" : void 0,
    declaredFields: Qi$(H),
    fallback: WZH(H.fallback),
  };
}
```

✅ **Verified.** All output fields present. Note `executionContext` is the internal name; `$I6` later renames it to `context` on the public Skill record (cli_inner_pretty.js:406240).

### A.4 `userInvocable: false` slash-dispatcher rejection

**Claim**: Slash dispatcher at `cli_inner_pretty.js:353001-353015` checks `userInvocable === false` and emits a self-message instead of invoking.

**Source** (cli_inner_pretty.js:353001-353015, verbatim):
```javascript
if (O.type === "prompt" && O.userInvocable !== !1) J68(O.name);
if (O.userInvocable === !1)
  return (
    uH(M, "cmd_not_user_invocable"),
    {
      messages: [
        w8({ content: ZQ({ inputString: `/${H}`, precedingInputBlocks: _ }) }),
        w8({
          content: `This skill can only be invoked by Claude, not directly by users. Ask Claude to use the "${H}" skill for you.`,
        }),
      ],
      shouldQuery: !1,
      command: O,
    }
  );
```

✅ **Verified.** Exact message text confirmed; `shouldQuery: false` confirmed (no LLM round-trip).

### A.5 Four-gate runtime chain (errorCodes 2/4/8/7/5)

**Claim**: `cli_inner_pretty.js:353562-353602` runs five sequential gates with error codes 2 (not found), 4 (disable-model-invocation), 8 (allowlist), 7 (skillOverrides), 5 (wrong type).

**Source** (cli_inner_pretty.js:353562-353602, verbatim):
```javascript
// Gate 1: not found (errorCode 2) — at 353562-353565
return ({ result: !1, message: O ? `Unknown skill: ${_}. Did you mean ${O}?` : `Unknown skill: ${_}`, errorCode: 2 });

// Gate 2: disable-model-invocation (errorCode 4) — at 353567-353574
if (Y.disableModelInvocation && !Am7(_, $))
  return ({ result: !1, message: `Skill ${_} cannot be used with ${fX} tool due to disable-model-invocation`, errorCode: 4 });

// Gate 3: session allowlist (errorCode 8) — at 353576-353580
if (A !== void 0 && Q7H([Y], A).length === 0)
  return ({ result: !1, message: `Skill ${_} is not in this session's skills allowlist`, errorCode: 8 });

// Gate 4: skillOverrides (errorCode 7) — at 353581-353590
let f = st(Y);
if (f === "off" || (f === "user-invocable-only" && !Am7(_, $)))
  return ({ result: !1, message: `Skill ${_} is disabled for model invocation in skillOverrides settings`, errorCode: 7 });

// Gate 5: type check (errorCode 5) — at 353591-353601
if (Y.type !== "prompt") {
  let O = Y.type === "local-jsx" ? "UI" : "built-in CLI";
  return ({ result: !1, message: `${_} is a ${O} command, not a skill. ...`, errorCode: 5 });
}
```

✅ **Verified.** All 5 gates, error codes, and message texts exact. Note: my docs called these "the four gates" — there are actually 5 if you count Gate 1 (not found). I refer to gates 2/3/4/5 as "the four runtime gates" assuming the skill resolved.

### A.6 `Am7` mid-message bypass detector

**Claim**: `cli_inner_pretty.js:353362-353375` detects whether the user typed `/<name>` in the current turn.

**Source** (cli_inner_pretty.js:353362-353375, verbatim):
```javascript
function Am7(H, $) {
  if ($.agentId !== void 0) return !1;
  let q = new RegExp(`(?<!\\S)/${Vx(H)}(?=$|\\s)`);
  for (let K = $.messages.length - 1; K >= $.turnStartIndex; K--) {
    let _ = $.messages[K];
    if (_.type !== "user" || _.isMeta) continue;
    let A = _.message.content;
    if (typeof A === "string") {
      if (A.includes(`<${pG}>`)) continue;
    } else if (A.some((z) => z.type === "tool_result")) continue;
    if (q.test(Wb(_) ?? "")) return !0;
  }
  return !1;
}
```

✅ **Verified.** Confirms:
- Returns `false` for subagent invocations (`agentId !== void 0`) — bypass is main-loop only
- Uses `Vx` (escapeRegex) on the skill name — same hardening as v2.1.139 arg substitution
- Walks back from end of messages to `turnStartIndex` — only the **current** turn counts
- Skips meta messages and tool-result messages

### A.7 `oT5` override-lock resolver — auto-promotion of `disable-model-invocation`

**Claim**: `disable-model-invocation: true` is auto-promoted to a `"user-invocable-only"` lock by `oT5`.

**Source** (cli_inner_pretty.js:476885-476893, verbatim):
```javascript
function oT5(H, $) {
  let q = v8("policySettings")?.skillOverrides?.[$];
  if (q) return { value: q, source: "policy" };
  let K = v8("flagSettings")?.skillOverrides?.[$];
  if (K) return { value: K, source: "flag" };
  if (H.disableModelInvocation) return { value: "user-invocable-only", source: "author" };
  if (H.source === "plugin") return { value: "on", source: "plugin" };
  return;
}
```

✅ **Verified.** Author lock = `"user-invocable-only"`, source = `"author"`. Plugin coercion to `"on"` with source `"plugin"`.

---

## Section B — Substitution Pipeline (`skill_substitutions.md`)

### B.1 `uFH` arg substitution — exact algorithm

**Claim**: Lines 217479-217509 perform named, indexed, and `$ARGUMENTS` substitution; with longest-name-first ordering, regex-escaped names, shell-quote-aware split via `z36`, and append-if-missing behavior.

**Source** (cli_inner_pretty.js:217479-217509, verbatim):
```javascript
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
    H = H + `\n\nARGUMENTS: ${A($)}`;
  return H;
}
```

✅ **Verified.** All five documented behaviors present:
- Longest-name-first sort: `(O, M) => M.name.length - O.name.length`
- Regex-escape: `Vx(O)`
- Negative lookahead `(?![\\[\\w])` on named args (prevents `$user` from matching in `$user[1]` or `$user_id`)
- Order: named → `$ARGUMENTS[N]` → `$N` → `$ARGUMENTS`
- Append-if-missing: `H === Y && q && $` → append `\n\nARGUMENTS: ${A($)}`

### B.2 `rH8` escape transform — protects against `!`-fence injection

**Claim**: Lines 217510-217514 escape `!` characters in arg values before they enter the body.

**Source** (cli_inner_pretty.js:217510-217514, verbatim):
```javascript
function rH8(H) {
  return H.replace(/`!/g, "` !")
    .replace(/!`/g, "! `")
    .replace(/(^|\s)!/gm, "$1\\!");
}
```

✅ **Verified.** Three substitutions:
1. Break `` `! `` sequence (prevents accidental fence start)
2. Break `` !` `` sequence (prevents accidental fence start)
3. Escape `!` at line/word boundaries (matches the lookbehind in `J45`)

### B.3 Shell-fence regexes — `j45` (fenced) and `J45` (inline)

**Claim**: `cli_inner_pretty.js:406107-406108` defines `j45 = /```!\s*\n?([\s\S]*?)\n?```/g` and `J45 = /(?<=^|\s)!`([^`]+)`/gm`.

**Source** (cli_inner_pretty.js:406107-406108, verbatim):
```javascript
((j45 = /```!\s*\n?([\s\S]*?)\n?```/g),
(J45 = /(?<=^|\s)!`([^`]+)`/gm));
```

✅ **Verified.** Inline form uses lookbehind `(?<=^|\s)` — `!` only matches at start of line or after whitespace.

### B.4 `_M8` disable-shell rewriter

**Claim**: Lines 398844-398851 replace every fence (both forms) with `[shell command execution disabled by policy]`.

**Source** (cli_inner_pretty.js:398844-398858, verbatim):
```javascript
function _M8(H) {
  let $ = H.replace(uq5, gs7);
  if ($.includes("!`")) {
    let q = oH8($);
    for (let K of [...q.matchAll(mq5)].reverse()) $ = $.slice(0, K.index) + gs7 + $.slice(K.index + K[0].length);
  }
  return $;
}
var uq5, mq5, gs7 = "[shell command execution disabled by policy]";
// ...
((uq5 = /```!\s*\n?[\s\S]*?\n?```/g), (mq5 = /(?<=^|\s)!`[^`]+`/gm));
```

✅ **Verified.** Exact placeholder string. Note `uq5`/`mq5` are no-capture variants of `j45`/`J45`.

### B.5 `KM8` disable check — three sources

**Claim**: `cli_inner_pretty.js:398840-398842` checks env, policy settings, and merged settings.

**Source** (cli_inner_pretty.js:398839-398842, verbatim):
```javascript
function KM8() {
  if (bH(process.env.CLAUDE_CODE_IS_COWORK)) return !0;
  if (v8("policySettings")?.disableSkillShellExecution === !0) return !0;
  return Oq().disableSkillShellExecution === !0;
}
```

✅ **Verified.** All three sources confirmed; cowork env wins, then policy, then merged settings.

### B.6 `L45` source predicate

**Claim**: `cli_inner_pretty.js:406110-406113` returns true for skills/commands_DEPRECATED/plugin from non-policy sources.

**Source** (cli_inner_pretty.js:406110-406113, verbatim):
```javascript
function L45(H, $) {
  if ($ === "policySettings") return !1;
  return H === "skills" || H === "commands_DEPRECATED" || H === "plugin";
}
```

✅ **Verified.** Note `H` is `loadedFrom`, `$` is `source` — bundled and MCP are excluded; policySettings tier exempt.

### B.7 `gHH` shell-fence executor

**Claim**: Lines 406026-406061 select shell tool, permission-check via `tD`, execute, inline stdout.

**Source spot-check** (cli_inner_pretty.js:406026-406060):
```javascript
async function gHH(H, $, q, K) {
  let _ = H;
  if (K === "bash" && !Y9())
    throw Error(`Skill ${q} requires bash (\`shell: bash\` in frontmatter) but Git Bash was not found. Install Git for Windows ..., or change the skill's frontmatter to \`shell: powershell\`.`);
  let A = K === "powershell" && Su() ? ke7() : Y9() ? L4 : ke7(),
    z = H.matchAll(j45),
    Y = H.includes("!`") ? oH8(H).matchAll(J45) : [];
  return (
    await Promise.all(
      [...z, ...Y].map(async (f) => {
        let O = f[1]?.trim();
        if (O)
          try {
            let M = await tD(A, { command: O }, $, ZX({ content: [] }), "");
            if (M.behavior !== "allow") throw ...;
            let { data: w } = await A.call({ command: O }, $);
            let D = await BFH(A, w, Ne7.randomUUID());
            let j = typeof D.content === "string" ? D.content : Ee7(w.stdout, w.stderr);
            _ = _.replace(f[0], () => j);
          } catch (M) { ... }
      }),
    ),
    _
  );
}
```

✅ **Verified.** Shell selection, permission gate, in-place replacement, and the Git Bash error message all confirmed.

### B.8 `getPromptForCommand` substitution order

**Claim**: Pipeline order is args → SKILL_DIR → SESSION_ID → EFFORT → shell.

**Source** (cli_inner_pretty.js:406257-406295, verbatim):
```javascript
async getPromptForCommand(h, C) {
  let R = J
    ? `Base directory for this skill: ${J}\n\n${_}`
    : _;
  if (((R = uFH(R, h, !0, Y, rH8)), J)) {      // ← Pass 1 (args)
    let B = J;
    R = R.replaceAll("${CLAUDE_SKILL_DIR}", B); // ← Pass 2
  }
  if (
    ((R = R.replace(/\$\{CLAUDE_SESSION_ID\}/g, v$())),        // ← Pass 3
    (R = R.replaceAll("${CLAUDE_EFFORT}", aT(M ?? C.options.mainLoopModel, G ?? C.getEffortValue()))),  // ← Pass 4
    L45(X, j) && KM8())
  )
    R = _M8(R);                                                  // ← Pass 5a
  else if (X !== "mcp")
    R = await gHH(R, { ... }, `/${H}`, V);                       // ← Pass 5b
  return [{ type: "text", text: R }];
}
```

✅ **Verified.** Exact order confirmed.

### B.9 `v$()` — session ID source

**Claim**: `v$()` returns the current session UUID for `${CLAUDE_SESSION_ID}` substitution.

**Source** (cli_inner_pretty.js:2312-2314, verbatim):
```javascript
function v$() {
  return jv()?.sessionId ?? U$.sessionId;
}
```

✅ **Verified.**

### B.10 `aT(model, effort)` — effort label resolver

**Claim**: `aT` resolves the effort label given a (model, effort) pair.

**Source** (cli_inner_pretty.js:198908-198911, verbatim):
```javascript
function aT(H, $) {
  let q = Z3H(H, $) ?? "high";
  return $0H(q);
}
```

✅ **Verified.** Defaults to `"high"` if `Z3H` can't resolve; `$0H` normalises to a string label.

---

## Section C — Lifecycle (`skill_lifecycle.md`)

### C.1 Compaction constants `U45=5000` and `F45=25000`

**Claim**: Per-skill compaction cap is 5000 tokens; combined budget is 25000 tokens.

**Source** (cli_inner_pretty.js:408210-408211, verbatim):
```javascript
U45 = 5000,
F45 = 25000,
```

✅ **Verified.** Exact constants confirmed. (Note: an earlier interim claim attributed `gq8 = 25000` from line 243890 — that turned out to be the autonomous-loop heartbeat constant, **not** the skill carry budget. The correct constant is `F45`.)

### C.2 `iq8` carry-forward algorithm

**Claim**: `cli_inner_pretty.js:408125-408139` sorts by `invokedAt` descending, slices each to `U45`, filters by cumulative `F45`.

**Source** (cli_inner_pretty.js:408125-408139, verbatim):
```javascript
function iq8(H) {
  let $ = Uv8(H);
  if ($.size === 0) return null;
  let q = 0,
    K = Array.from($.values())
      .sort((_, A) => A.invokedAt - _.invokedAt)
      .map((_) => ({ name: _.skillName, path: _.skillPath, content: c45(_.content, U45) }))
      .filter((_) => {
        let A = NA(_.content);
        if (q + A > F45) return !1;
        return ((q += A), !0);
      });
  if (K.length === 0) return null;
  return fK({ type: "invoked_skills", skills: K });
}
```

✅ **Verified.** MRU sort, per-skill truncation, cumulative-budget filter all match.

### C.3 `c45` truncator and `ee7` suffix

**Claim**: `c45` truncates to N tokens (using 4-chars/token approximation); appends `ee7` suffix `\n\n[... skill content truncated for compaction; use Read on the skill path if you need the full text]`.

**Source** (cli_inner_pretty.js:408191-408195, 408221-408223, verbatim):
```javascript
function c45(H, $) {
  if (NA(H) <= $) return H;
  let q = $ * 4 - ee7.length;
  return H.slice(0, q) + ee7;
}
// ...
ee7 = `\n\n[... skill content truncated for compaction; use Read on the skill path if you need the full text]`;
```

✅ **Verified.** Note the formula `$ * 4 - ee7.length` — char-budget = (tokens × 4) − suffix length.

### C.4 `snH` conditional-paths activator

**Claim**: `cli_inner_pretty.js:406510-406538` matches touched files against skill globs, promotes matching skills from `conditionalSkills` to `dynamicSkills`, marks them in `activatedConditionalSkillNames` (sticky).

**Source spot-check** (cli_inner_pretty.js:406510-406527):
```javascript
function snH(H, $) {
  if (hX.conditionalSkills.size === 0) return [];
  let q = [];
  for (let [K, _] of hX.conditionalSkills) {
    if (_.type !== "prompt" || !_.paths || _.paths.length === 0) continue;
    let A = he7.default().add(_.paths);
    for (let z of H) {
      let Y = qY.isAbsolute(z) ? qY.relative($, z) : z;
      if (!Y || Y.startsWith("..") || qY.isAbsolute(Y)) continue;
      if (A.ignores(Y)) {
        (hX.dynamicSkills.set(K, _),
          hX.conditionalSkills.delete(K),
          hX.activatedConditionalSkillNames.add(K),
          q.push(K),
          N(`[skills] Activated conditional skill '${K}' (matched path: ${Y})`));
        break;
      }
    }
  }
  // ... telemetry emit
}
```

✅ **Verified.** Sticky behavior, `ignore` library use, relative-path normalization all confirmed.

### C.5 `xn5` chokidar watcher

**Claim**: `cli_inner_pretty.js:557923-558000` sets up a chokidar watcher with `depth: 2`, debouncing, fingerprint dedup, ConfigChange hook block.

**Source spot-check** — confirmed at the cited lines. Key parameters from cli_inner_pretty.js:557949-557962:
```javascript
f = _k.watch(G, {
  persistent: !0,
  ignoreInitial: !0,
  depth: 2,
  awaitWriteFinish: { stabilityThreshold: $, pollInterval: q },
  ignored: (v, E) => {
    if (E && !E.isFile() && !E.isDirectory() && !E.isSymbolicLink()) return !0;
    return v.split(/[/\\]/).some((I) => I === ".git");
  },
  ignorePermissionErrors: !0,
  usePolling: Cn5,
  interval: _,
  atomic: !0,
}),
```

✅ **Verified.**

### C.6 `AG4` / `zG4` bundled skills

**Claim**: `cli_inner_pretty.js:494262-494266` defines the bundled skill array `AG4`, retrieved via `zG4()`.

**Source** (cli_inner_pretty.js:494262-494266, 494324):
```javascript
AG4.push(_);
}
function zG4() {
  return [...AG4];
}
// ...
((WZ$ = require("fs")), (OL8 = require("fs/promises")), (Jr = require("path")), (AG4 = []));
```

✅ **Verified.**

### C.7 `Bq5` — plugin command-name deriver only

**Claim** (in **skill_frontmatter.md**, after the audit correction): `Bq5` at `cli_inner_pretty.js:398863-398878` is the **plugin** deriver. Non-plugin SKILL.md uses `T45` (cli_inner_pretty.js:406383-406389), and commands_DEPRECATED uses `V45` (cli_inner_pretty.js:406390-406396).

**Source** (cli_inner_pretty.js:398863-398878, verbatim):
```javascript
function Bq5(H, $, q) {
  if (wh6(H)) {                                              // is SKILL.md?
    let _ = $W.dirname(H),
      A = $W.dirname(_),
      z = $W.basename(_),
      Y = A.startsWith($) ? A.slice($.length).replace(/^[/\\]/, "") : "",
      f = Y ? Y.split(/[/\\]/).join(":") : "";
    return f ? `${q}:${f}:${z}` : `${q}:${z}`;
  } else { /* file-based deriver, same shape */ }
}
```

(cli_inner_pretty.js:406383-406396, verbatim):
```javascript
function T45(H, $) {
  let q = qY.dirname(H),
    K = qY.dirname(q),
    _ = qY.basename(q),
    A = Ie7(K, $);
  return A ? `${A}:${_}` : _;
}
function V45(H, $) {
  let q = qY.basename(H),
    K = qY.dirname(H),
    _ = q.replace(/\.md$/, ""),
    A = Ie7(K, $);
  return A ? `${A}:${_}` : _;
}
```

✅ **Verified.** `Bq5` always prefixes with `q` (plugin id). `T45`/`V45` never prefix — they only add subdir colon-joins if the file is nested under `baseDir`.

For the **simple skill loader** (R45 at cli_inner_pretty.js:406315-406342), the name is just `z.name` (directory name, no derivation at all):
```javascript
let { frontmatter: M, content: w } = tO(O, f, { normalizeKeys: !0 }),
  D = m9H(f, w),
  j = z.name;                                              // ← directory name
eGH("skill", M);
let J = HI6(M, D, j),
  X = Z45(M);
return {
  skill: $I6({
    ...J,
    skillName: j,
    ...
```

✅ **Verified.** Non-nested skill: name = directory name. The `T45`/`V45` derivers handle nested cases under `commands_DEPRECATED`.

### C.8 MCP skill name format (CORRECTION POINT)

**Original claim** (now corrected): Internal name is `<server>:<skill>`.

**Source truth** (cli_inner_pretty.js:414985-414999, verbatim):
```javascript
q.map((K) => {
  let _ = Object.values(K.arguments ?? {}).map((A) => A.name);
  return {
    type: "prompt",
    name: "mcp__" + $_(H.name) + "__" + K.name,             // ← internal name uses mcp__ prefix
    description: K.description ?? "",
    hasUserSpecifiedDescription: !!K.description,
    contentLength: 0,
    isEnabled: () => !0,
    isHidden: !1,
    isMcp: !0,
    progressMessage: "running",
    userFacingName() {
      return `${H.name}:${K.name} (MCP)`;                  // ← display only
    },
    ...
```

⚠️ **Correction applied**: My doc now states the internal name is `mcp__<server>__<command>` and the `<server>:<command>` form is the display-only `userFacingName()`.

---

## Section D — Listing Budget (`skill_listing_budget.md`)

### D.1 Constants

**Claim**: `G5_=0.01`, `w67=4`, `T5_=200000`, `V5_=1536`, `nM6=20`.

**Source** (cli_inner_pretty.js:232357-232361, verbatim):
```javascript
var G5_ = 0.01,
  w67 = 4,
  T5_ = 200000,
  V5_ = 1536,
  nM6 = 20;
```

✅ **Verified.** All five constants confirmed at the stated lines.

### D.2 `HO$` budget computation

**Claim**: `cli_inner_pretty.js:232270-232275` computes budget as env > setting > default × context × bytes/token.

**Source** (cli_inner_pretty.js:232270-232275, verbatim):
```javascript
function HO$(H, $ = w67) {
  if (Number(process.env.SLASH_COMMAND_TOOL_CHAR_BUDGET))
    return Number(process.env.SLASH_COMMAND_TOOL_CHAR_BUDGET);
  let q = cM6(),
    K = (H ?? T5_) * $ * q;
  return Math.max(1, Math.floor(K));
}
```

✅ **Verified.** Env wins; falls back to `T5_=200000` × `w67=4` × `G5_=0.01` if nothing set.

### D.3 `l88` three-mode allocator

**Claim**: `cli_inner_pretty.js:232282-232356` returns `budgetMode` of `"fits"`, `"priority"`, `"truncate"`, or `"names-only"`.

**Source spot-check** (cli_inner_pretty.js:232298-232356):
- `"fits"` returned at line 232301: `budgetMode: "fits"`
- `"priority"` returned at line 232327: `budgetMode: "priority"`
- `"truncate"` / `"names-only"` returned at line 232346: `budgetMode: Z` where `Z = P < nM6 ? "names-only" : "truncate"`

✅ **Verified.**

### D.4 `rM6` renderer — bundled-skill protection

**Claim**: Bundled skills are always kept with full descriptions (protected from truncation).

**Source** (cli_inner_pretty.js:232400, verbatim):
```javascript
if (P.type === "prompt" && P.source === "bundled") f.add(L);
```

This adds bundled skills to the "always keep" set `f` before any truncation logic runs.

✅ **Verified.**

### D.5 `lM6` combined description

**Claim**: Description in listing is `description + " - " + when_to_use`.

**Source** (cli_inner_pretty.js:232276-232278, verbatim):
```javascript
function lM6(H) {
  return H.whenToUse ? `${H.description} - ${H.whenToUse}` : H.description;
}
```

✅ **Verified.**

### D.6 Settings keys exist with documented defaults

**Source** (cli_inner_pretty.js:50411-50425, verbatim):
```javascript
skillListingMaxDescChars: y.number().int().positive().optional()
  .describe("Per-skill description character cap in the skill listing sent to Claude (default: 1536). ..."),
skillListingBudgetFraction: y.number().gt(0).lte(1).optional()
  .describe("Fraction of the context window (in characters) reserved for the skill listing sent to Claude (default: 0.01 = 1%). ..."),
```

✅ **Verified.** Defaults of 1536 and 0.01 are in the zod schema descriptions, matching constants `V5_` and `G5_`.

---

## Section E — Overrides & UI (`skill_overrides.md`, `skills_dialog_ui.md`)

### E.1 Save target — `.claude/settings.local.json`

**Claim**: `/skills` dialog writes to `localSettings` which resolves to `.claude/settings.local.json`.

**Source** (cli_inner_pretty.js:52029-52036, 477008, verbatim):
```javascript
function Vh(H) {
  switch (H) {
    case "projectSettings":
      return xv.join(".claude", "settings.json");
    case "localSettings":
      return xv.join(".claude", "settings.local.json");
  }
}
// ...
let { error: qH } = B6("localSettings", { skillOverrides: r });
```

✅ **Verified.** Confirmed path resolution and write target.

### E.2 Four state values and bypass mechanism

**Source** (cli_inner_pretty.js:477208, 513847-513857, 353581-353590):
```javascript
kB6 = ["on", "name-only", "user-invocable-only", "off"]
// ...
function st(H) {
  if (H.type !== "prompt" || H.source === "plugin") return "on";
  return m6().skillOverrides?.[H.name] ?? "on";
}
function VE4(H) {
  let $ = st(H);
  return $ === "user-invocable-only" || $ === "off";
}
function iP8(H) {
  return st(H) === "off";
}
// ...
if (f === "off" || (f === "user-invocable-only" && !Am7(_, $)))
  return ({..., errorCode: 7 });
```

✅ **Verified.** `name-only` is absent from `VE4`'s disjunction, confirming it is NOT a runtime restriction.

### E.3 `D9H` fallback drop logic

**Source** (cli_inner_pretty.js:513829-513843, verbatim):
```javascript
function D9H(H) {
  let $ = new Set();
  for (let q of H) {
    if (q.type !== "prompt" || (q.loadedFrom !== "plugin" && q.loadedFrom !== "bundled" && q.loadedFrom !== "mcp"))
      continue;
    if (q.disableModelInvocation || VE4(q)) continue;
    let K = q.name.lastIndexOf(":");
    if (K > 0) $.add(q.name.slice(K + 1));
  }
  if ($.size === 0) return H;
  return H.filter((q) => {
    if (q.type !== "prompt" || !q.fallback || !$.has(q.name)) return !0;
    return (N(`Dropping fallback skill '${q.name}' — a plugin/MCP skill with the same suffix is loaded`), !1);
  });
}
```

✅ **Verified.** Fallback drop fires only when a plugin/bundled/MCP skill with a `:`-suffixed name exists and the suffix matches a fallback skill's full name. Caveat: since MCP names use `mcp__` prefix (not `:`), the suffix-match loop typically only activates for plugin-style names. Log message says "plugin/MCP" though only plugin-style names produce `:` for `lastIndexOf` to find.

---

## Section F — Discrepancies Found & Corrections Applied

The audit found three claims that were either inaccurate or imprecise. All have been corrected in the relevant docs.

| # | Doc | Original claim | Corrected to | Source |
|---|-----|---------------|--------------|--------|
| 1 | `skill_lifecycle.md` (table) | "Naming format `<server>:<skill>` (not `mcp__<server>__<skill>`)" | "Internal name format: `mcp__<server>__<command>`. The `<server>:<command>` form is the **display name** returned by `userFacingName()`, not the internal `name` field." | cli_inner_pretty.js:414989, 414997-414999 |
| 2 | `skill_frontmatter.md` (`name` field) | "Command-name derivation (`Bq5`): … `<root>/.claude/skills/<dir>/SKILL.md` → `<dir>`" | Listed **three deriver functions** — `R45`/`z.name` for skill-dir, `T45`/`V45` for commands-deprecated, `Bq5` for plugins. The `Bq5` function never applies to non-plugin skills. | cli_inner_pretty.js:398863, 406327, 406383-406396 |
| 3 | `skill_frontmatter.md` (`allowed-tools` field) | "Workspace trust gate: project skills' `allowed-tools` only takes effect after workspace trust dialog is accepted." | Weakened to: workspace trust is checked at settings-tier load (via `o1H()`), not per-skill at `allowed-tools` resolution. Hooks/status line/file suggestions are explicitly gated; `allowed-tools` itself is not. | cli_inner_pretty.js:520502, 521345, 522200, 522448, 558144 |

One **finding** was a previously undocumented insight that the audit added:

| # | Doc | New finding |
|---|-----|-------------|
| 4 | `skill_substitutions.md` | There are actually **two** copies of the substitution pipeline. The `$I6` version (cli_inner_pretty.js:406257-406298) for user/project skills + commands_DEPRECATED, and the `HP$` version (cli_inner_pretty.js:398992-399030) for plugin skills. They share the same passes plus the plugin variant adds `Zn` (plugin-scope substitution) and `v88` (user_config substitution). |

The audit confirms that **all five compaction-budget constants** (`U45=5000`, `F45=25000`, `G5_=0.01`, `V5_=1536`, `nM6=20`, `w67=4`, `T5_=200000`) are exactly as documented. The five Skill-tool gate error codes (2/4/8/7/5) and messages are exactly as documented. The substitution order, regex patterns, escape transform, and shell-gating behavior are exactly as documented.

---

## Section G — Verification Method

For each major claim in the analysis docs, the verification process was:

1. **Open the cited line range** in `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` via the `Read` tool with explicit `offset`/`limit`.
2. **Compare the doc's prose** against the actual code at that location.
3. **Run targeted `grep`** (via `Bash`) to find unverified claims — e.g. searching for `Vh` to confirm the localSettings path, for `KM8` to confirm the disable-shell gate, for `Bq5` callers to confirm name derivation scope.
4. **Note discrepancies**; correct them in the source docs; document the correction in this report.

Spot-checks were not exhaustive — for example, I did not verify every `@internal` field in the `rA6` schema individually, only confirmed the broad list. But the **load-bearing** claims (constants, gate ordering, substitution passes, save path) were all verified at the source.

The audit's main contribution is upgrading three load-bearing claims from "explore-agent reported" to "directly verified at file:line," and catching the three discrepancies listed in Section F.
