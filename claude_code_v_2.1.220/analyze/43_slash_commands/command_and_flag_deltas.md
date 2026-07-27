# The long tail: twenty command deltas and a contaminated flag list

**Module:** `43_slash_commands` (part 3 of 3 — see [`README.md`](README.md))
**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js` (872,596 lines)
**Baseline:** `…/2.1.193/extract/cli_inner_pretty.js` — every count below is `220=N / 193=M`

Twenty small bullets, most of them one-line changes inside mature machinery, plus a triage of the
51 "new CLI flags" the asset diff reports (of which **fewer than a third are Claude Code's own**).

The bullets are grouped by *where the change actually lives*, not by release, because that is what makes
the pattern visible: six are **argv-parsing** changes, six are **command-descriptor** changes, five are
**message-routing** changes, and three are **display-label** changes.

§1.6 closes cross-validation cycle **C12** (the `.200 #11` `--plugin-dir` ownership standoff between this
module and [`45_skills`](../45_skills/)); this module now owns that bullet outright.

---

## 1. Argv and launch-path parsing

### 1.1 `.199 #15` — `claude --dangerously-skip-permissions daemon <subcommand>` was treated as a prompt

**NET-NEW.** `=== "daemon" ? e.slice(t + 1) : null` is **220=1 / 193=0**, at `:133`.

```javascript
// ============================================
// peelDaemonSubcommandArgv - lets skip-permission flags precede the `daemon` subcommand
// Location: cli_inner_pretty.js:130-134 (call site :872316-872326)
// ============================================

// ORIGINAL (for source lookup):
function _Al(e) {
  let t = 0;
  while (e[t] === "--dangerously-skip-permissions" || e[t] === "--allow-dangerously-skip-permissions") t++;
  return e[t] === "daemon" ? e.slice(t + 1) : null;
}
…
  {
    let m = _Al(t);
    if (m !== null) {
      r("cli_daemon_path");
      …
      let { daemonMain: _ } = await Promise.resolve().then(() => (n$m(), r$m));
      await _(m);
      return;
    }
  }

// READABLE (for understanding):
function peelDaemonSubcommandArgv(argv) {
  let i = 0;
  while (argv[i] === "--dangerously-skip-permissions" || argv[i] === "--allow-dangerously-skip-permissions") i++;
  return argv[i] === "daemon" ? argv.slice(i + 1) : null;    // null == "this is not a daemon invocation"
}

// Mapping: _Al→peelDaemonSubcommandArgv, r→recordStartupPath, daemonMain→the daemon entry point
```

2.1.193's test was a bare positional check:

```javascript
// :718427 (193)
  if (t[0] === "daemon") { n("cli_daemon_path"); … await g(t.slice(1)); return; }
```

**How it works:** the daemon dispatch happens in a *pre-commander* fast path — a hand-rolled `argv[0]`
switch that runs before the option parser exists, so the process can start a daemon without paying for
settings load, MCP config, or the React runtime. Anything the fast path does not recognise falls through
to `claude <prompt>`. In 193 that meant `claude --dangerously-skip-permissions daemon status` had
`argv[0] === "--dangerously-skip-permissions"`, missed the check, and was eventually parsed as an
interactive launch whose positional prompt was `daemon status`.

**Why a `while` loop rather than a filter?** Three reasons, all visible in the code:
1. It only tolerates the two skip-permission spellings, and only as a *prefix*. `claude --model opus daemon
   status` still falls through — the fast path deliberately refuses to understand value-taking flags,
   because peeling `--model opus` requires knowing that `--model` consumes an argument, which is exactly
   the knowledge the fast path is avoiding.
2. `e.slice(t + 1)` **discards the peeled flags**. The daemon is never handed
   `--dangerously-skip-permissions`. Skip-permissions is a *session* property; a daemon that inherited it
   would apply it to every session it later spawns. Dropping it is a fail-safe, not an oversight.
3. Returning `null` rather than `[]` distinguishes "not a daemon call" from "daemon call with no
   subcommand" — `[]` is a legitimate result (`claude daemon`), and `if (m !== null)` reads correctly for
   both.

**Key insight:** the two spellings hard-coded here are precisely the two that a user is most likely to put
in a shell alias or a wrapper script (`alias claude='claude --dangerously-skip-permissions'`). The bug
class is "my alias broke a subcommand", and the fix is scoped to exactly that class rather than
generalising the fast path.

### 1.2 `.198 #20` — `--bg` with `--print` is rejected up front

**NET-NEW.** `unattachable` is **220=1 / 193=0**, at `:683498`, inside `$Gb`.

```javascript
// ============================================
// validateBackgroundLaunchArgv - three pre-spawn refusals for `claude --bg`
// Location: cli_inner_pretty.js:683486-683511 (caller :682403-682405)
// ============================================

// ORIGINAL (for source lookup):
function $Gb(e) {
  let t = gxr(e), r = t >= 0 ? e.slice(0, t) : e, n = Ole(r), o = r.filter((s, a) => !n.has(a));
  if (QYs(o)) return JYs(r);
  if (o.some((s) => { let { peeled: a, rest: l } = eje(s);
        return s === "--print" || s.startsWith("--print=") || a.includes("-p") || l === "-p"; }))
    return "--bg and --print conflict: --print never starts the interactive session that `claude agents` attaches to, so the job would be unattachable. The prompt is the positional — drop --print: `claude --bg '<task>'`.";
  let i = AJo(r, "--permission-mode");
  if ((i === "bypassPermissions" || o.includes("--dangerously-skip-permissions") || o.includes("--allow-dangerously-skip-permissions")) && !I8() && !xt().bypassPermissionsModeAccepted)
    return "--bg with bypassPermissions requires accepting the disclaimer first. Run `claude --dangerously-skip-permissions` once interactively.";
  if (i === "auto" && !KMi())
    return "--bg with auto mode requires opting in first. Run `claude --permission-mode auto` once interactively.";
  return null;
}
…
async function Mle(e, t, r = "shell", n, o, i, s) {
  let a = $Gb(e);
  if (a) return { ok: !1, error: a, reason: "gate_blocked" };

// READABLE (for understanding):
function validateBackgroundLaunchArgv(argv) {
  const endOfOptions = indexOfDoubleDash(argv),
        opts = endOfOptions >= 0 ? argv.slice(0, endOfOptions) : argv,   // never inspect post-`--` words
        valueSlots = indicesConsumedByValueFlags(opts),
        flags = opts.filter((_, i) => !valueSlots.has(i));               // …nor a flag's own VALUE
  if (isPrintOutputFormatConflict(flags)) return describePrintConflict(opts);
  if (flags.some(isPrintFlag)) return PRINT_CONFLICT_MESSAGE;
  const mode = readFlagValue(opts, "--permission-mode");
  if ((mode === "bypassPermissions" || flags.includes("--dangerously-skip-permissions") || …)
      && !isBypassAllowedHere() && !globalConfig().bypassPermissionsModeAccepted)
    return BYPASS_NEEDS_DISCLAIMER_MESSAGE;
  if (mode === "auto" && !hasAcceptedAutoMode()) return AUTO_NEEDS_OPT_IN_MESSAGE;
  return null;                                                            // null == launch is allowed
}

// Mapping: $Gb→validateBackgroundLaunchArgv, gxr→indexOfDoubleDash, Ole→indicesConsumedByValueFlags,
//          eje→splitBundledShortFlags, AJo→readFlagValue, Mle→spawnBackgroundJob
```

The two later messages are **220=1 / 193=1 carryover** — only the `--print` arm is new. Three details
worth naming:

- **Both `--` and value slots are excluded before matching.** `claude --bg --model -p` must not trip the
  `-p` test, because `-p` there is `--model`'s value. `Ole` computes the value-consuming indices; `gxr`
  finds `--`. Without either, the validator would refuse legitimate launches — a false positive on a
  *pre-flight* check is worse than the bug it prevents, because there is no way to override it.
- **`eje(s)` splits bundled short flags**, so `-vp` is caught as well as `-p`.
- **The message names the fix**: `The prompt is the positional — drop --print: \`claude --bg '<task>'\``.
  The reason it can do that is that the two flags are not merely incompatible, they are *redundant*: `--bg`
  already takes the task as its positional.

**Why up front rather than at attach time?** Without the check, the launch succeeded: a job directory was
created, a roster row appeared, and the worker ran headless to completion — but `claude agents` could never
attach to it, because attaching means taking over an interactive REPL that `--print` never started. The
user saw a row they could not open and a job they could not steer. Refusing at `Mle`'s first line costs
nothing and leaves no artefact (`reason: "gate_blocked"` returns before the job dir is created at
`:682411`).

### 1.3 `.211 #29` — integer env vars accepting `1e6` and `64_000` — **UNANCHORED**

`_scope_v211_214.md` recorded this THIN/UNANCHORED and I could not improve on it. `64_000` is **220=1 /
193=1** and its single site (`:794381`) is inside the bundled `claude-api` skill's reference text, not a
parser. `scientific` is 1/1 and unrelated. `parseIntEnv` / `coerceInteger` / `replaceAll("_","")` are all
**0/0**. `Number(e)` is 220=46 / 193=41, far too common to diff usefully.

If the change is real it is a coercion inside the env-var zod schema (`:60613`+) expressed with existing
primitives — `Number()` already accepts `1e6`, and a numeric separator like `64_000` is only valid in
*source* literals, not in `Number("64_000")`, so a strip step would be needed. I found no such step.
**Verdict: UNANCHORED.** Do not cite `64_000`.

### 1.4 `.212 #2` — `claude auto-mode reset` and `--yes`

**NET-NEW.** `auto-mode reset` **220=1 / 193=0** (`:865404`); `"--yes"` **220=4 / 193=0**.

The handler (`:865340-865412`) is a five-stage ladder, and the interesting part is the `--yes` interaction:

1. Read the user settings file; a read error that is not `ENOENT` aborts with `settings_file_unreadable`.
2. Parse; invalid JSON aborts with `settings_file_invalid`.
3. If there is no `autoMode` section at all, print
   `Auto mode configuration is already at defaults — <file> has no autoMode section.` and succeed (idempotent).
4. **The lossy-write guard** (`:865370-865382`):
   ```javascript
   let s = EU(t),
     a = s.settings === null ? []
        : s.errors.filter((u) => u.severity === "warning").map((u) => ROm(u.path) || "unknown entry"),
     l = $Om(a);
   if (a.length > 0 && e.yes)
     return (await uL("cli_auto_mode_reset", "lossy_write_unconfirmed"),
       fm(`Not resetting: ${t} also contains ${yvl(a.length,"entry","entries")} this version of Claude Code cannot parse — ${l.join(", ")} — and saving the file would delete ${a.length === 1 ? "it" : "them"} too. Fix or remove ${…} first, or run the command without --yes to review and confirm.`));
   ```
5. Otherwise print the sections that will be removed, print the additional collateral loss if any, and —
   **unless `--yes`** — prompt `Reset auto mode configuration to defaults?`.

**Why does `--yes` make the command *stricter*?** This inverts the usual meaning of a confirmation-skip
flag and it is the most interesting decision here. The settings writer
(`Tm("userSettings", …)` at `:865400`) **rewrites the file from its validated in-memory view**, so any key
the running build's schema does not recognise — a key from a newer Claude Code, or a typo — is silently
dropped on save. Interactively that is acceptable: step 5 lists the collateral damage and the human
approves it. Non-interactively there is nobody to approve, so the only safe answers are "destroy unknown
data silently" or "refuse". It refuses. `--yes` is therefore not "skip the prompt" but "assert that there
is nothing to prompt about", and the error text names both remedies (fix the entries, or drop `--yes`).

Note `severity === "warning"` is the selector: schema *errors* would already have failed step 2, so this
set is exactly the "parsed fine, but I don't know this key" rows.

### 1.5 `.198`–`.212` — `--fork-name`, `--org`, `--remote-name` are **`gh repo fork`** flags

Fully derived in [`fork_and_subtask.md`](fork_and_subtask.md) §3. Summarised here because it is the entry
point to §4's flag triage: `new Set(["--org", "--fork-name", "--remote-name"])` at `:443144` is the
value-taking-flag set for the `gh repo fork` rule in the auto-mode command analyser. Claude Code's own
fork flag is `--fork-session`, **12/12 carryover**.

### 1.6 `.200 #11` — `claude agents --plugin-dir <dir>` ignored when the flag follows `agents`

> Changelog: *"Fixed `claude agents --plugin-dir <dir>` not showing the plugin's agents and skills in the
> agent view when the flag is placed after `agents`"* (`CHANGELOG.md:537`).

**Verdict: DELTA — three inserted lines. Narrower than every register in this tree claims.**

This bullet was the C12 ownership cycle in
[`_xval_contradictions.md`](../00_overview/_xval_contradictions.md) §2: `43_slash_commands` deferred it to
`45_skills`, `45_skills` deferred it back, and both `by_version/2.1.200.md:69` and
`changelog_to_code_map.md` end its doc column with *"— gap"*. It is analysed here. **This module owns it.**

#### The counts, re-measured

| Anchor | 220 | 193 | Note |
|---|---|---|---|
| `claude agents --plugin-dir` (bare) | **2** | **1** | `:865022`, `:872437` vs `:718546 (193)`. **Not net-new.** |
| `claude agents --plugin-dir (commander action)` | **1** | **0** | `:865022` — the new label only |
| `optsWithGlobals` | 2 | 1 | 193 has only the commander method `:609203 (193)`; the **call** `:867683` is 1/0 |
| `areSideloadFlagsDisabledByPolicy` | 2 | 2 | export entry + one call site, both bundles |
| `viaCommander` | 1 | 1 | the commander path's own telemetry — live in **both** builds |

The false-delta ledger recorded this anchor as **1/0 (net-new)**. That is wrong: `193:718546` carries the
byte-identical `R("claude agents --plugin-dir")` `clearPluginCache` call. 2.1.220 has **two** sites, and
`:872437` is the 193 one, unchanged. The literal is carryover; only the parenthesised *label* is new, and a
label is not a mechanism.

The seed anchor for this hole described the fix as *"a post-commander re-parse of raw argv"*. **That
mechanism also pre-exists.** 193's `agentsCommandHandler` already re-parsed `process.argv` at `:710511 (193)`.
The pre-parser itself is byte-identical modulo mangling: `$$n` `:69-108` ≡ `KZt` `:65-104 (193)`, same
handler table, same `agents`-positional swallow, same `=`-form handling. So the delta is neither the
literal nor the re-parse — it is **what the re-parsed value is allowed to affect**.

#### Why the flag is lost in the first place: three separate commander behaviours

The interesting question is not what the fix does but why a hand-rolled argv scan has to exist beside a
fully configured commander. Three independent facts in the vendored commander conspire to destroy the
value, and each one alone would be enough.

**(a) `enablePositionalOptions()` stops root parsing at the subcommand name.** The program is built with it
at `:850888` (`new fgp().configureHelp(d4e()).enablePositionalOptions()`).

```javascript
// ============================================
// Command._parseCommand - positional-options mode breaks out of the root option loop
// Location: cli_inner_pretty.js:556001-556004 (vendored commander)
// ============================================

// ORIGINAL (for source lookup):
        if ((this._enablePositionalOptions || this._passThroughOptions) && t.length === 0 && r.length === 0) {
          if (this._findCommand(a)) {
            if ((t.push(a), o.length > 0)) r.push(...o);
            break;
          }

// READABLE (for understanding):
        if ((this._enablePositionalOptions || this._passThroughOptions) && operands.length === 0 && unknown.length === 0) {
          if (this._findCommand(token)) {          // token is a registered subcommand name, e.g. "agents"
            operands.push(token);
            if (remaining.length > 0) unknown.push(...remaining);
            break;                                 // <- root NEVER parses anything after "agents"
          }

// Mapping: t→operands, r→unknown, a→token, o→remaining
```

So for `claude agents --plugin-dir ./p`, the root program sees `agents`, finds the subcommand, and
**breaks**. Its own `pluginDir` keeps the `[]` default installed at `:851294-851299`.

**(b) The `preAction` hook reads the *root's* option value, not the actioned command's.** The global inline-
plugin loader lives in the hook registered at `:850891`:

```javascript
// ============================================
// preActionInlinePluginLoader - the global --plugin-dir loader, blind to post-subcommand flags
// Location: cli_inner_pretty.js:850905-850910 (hook registered :850891)
// ============================================

// ORIGINAL (for source lookup):
    let c = i.getOptionValue("pluginDir");
    if (Array.isArray(c) && c.length > 0 && c.every((g) => typeof g === "string"))
      (lNr(c), QI("preAction: --plugin-dir inline plugins"));
    let u = i.getOptionValue("pluginDirNoMcp");
    if (Array.isArray(u) && u.length > 0 && u.every((g) => typeof g === "string"))
      (cNr(u), QI("preAction: --plugin-dir-no-mcp inline plugins"));

// READABLE (for understanding):
    let pluginDirs = hookedCommand.getOptionValue("pluginDir");        // hookedCommand === the ROOT program
    if (Array.isArray(pluginDirs) && pluginDirs.length > 0 && pluginDirs.every((d) => typeof d === "string"))
      { setInlinePlugins(pluginDirs); clearPluginCache("preAction: --plugin-dir inline plugins"); }
    let pluginDirsNoMcp = hookedCommand.getOptionValue("pluginDirNoMcp");
    ...

// Mapping: i→hookedCommand, c→pluginDirs, u→pluginDirsNoMcp, lNr→setInlinePlugins,
//          cNr→setInlinePluginsNoMcp, QI→clearPluginCache
```

`i` is not the `agents` command. Commander's dispatcher at `:555859` invokes
`o.callback(o.hookedCommand, this)` — first argument is the command the hook was *registered on* (the root
program), second is the command being actioned. Combined with (a), `getOptionValue("pluginDir")` is
**always `[]`** for `claude agents --plugin-dir X`, and the `Array.isArray && length > 0` guard silently
skips. This is the original bug, and it is structural: the global loader cannot see post-subcommand flags
by construction. **This hook is unchanged between the two builds** (193 `:712178-712183`).

**(c) `optsWithGlobals()` merges ancestors *over* the subcommand, so the root's empty default wins.** The
`agents` subcommand declares its own `--plugin-dir` at `:867648-867651` — and, unlike the root's, **with no
`argParser` and no default**, so it parses to a bare string, last-wins, despite the description saying
"(repeatable)". One might expect the handler to just read that. It cannot:

```javascript
// ============================================
// Command.optsWithGlobals - reduce order makes ANCESTORS override the subcommand
// Location: cli_inner_pretty.js:556033-556034, :555411-555414
// ============================================

// ORIGINAL (for source lookup):
    optsWithGlobals() {
      return this._getCommandAndAncestors().reduce((e, t) => Object.assign(e, t.opts()), {});
    }
...
    _getCommandAndAncestors() {
      let e = [];
      for (let t = this; t; t = t.parent) e.push(t);
      return e;
    }

// READABLE (for understanding):
    optsWithGlobals() {
      // _getCommandAndAncestors() === [self, parent, grandparent, ...]
      // Object.assign is later-wins, so PARENT overwrites SELF.
      return this._getCommandAndAncestors()
        .reduce((merged, cmd) => Object.assign(merged, cmd.opts()), {});
    }

// Mapping: e→merged, t→cmd
```

Order is `[agents, program]`; `Object.assign` is later-wins; therefore the root's `pluginDir: []` **overwrites**
the value `agents` actually parsed. `optsWithGlobals().pluginDir` is `[]` no matter where the user put the
flag. Reading the parsed options is not merely awkward here — it is *actively lossy*. After (a) and (c),
**raw `process.argv` is the only surviving copy of the user's `--plugin-dir`.**

#### What 2.1.193 did with the re-parse: forwarded it to children, never applied it locally

```javascript
// ============================================
// agentsCommandHandler (2.1.193) - re-parses argv, but only to build child argv
// Location: cli_inner_pretty.js:710511, :710516-710519 (193)
// ============================================

// ORIGINAL (for source lookup):
        ]),
        { config: i } = KZt(process.argv.slice(2));
      ...
      let a = await o(s(!1)),
        l = {
          cwdFilter: e.cwd,
          dispatchExtraArgs: eYe(ZKe(i, DLc.resolve)),

// READABLE (for understanding):
        ]),
        { config: reparsed } = preParseAgentsArgv(process.argv.slice(2));
      ...
      let root = await createRoot(getBaseRenderOptions(false)),
        fleetProps = {
          cwdFilter: opts.cwd,
          dispatchExtraArgs: flattenCliConfig(resolveCliConfigPaths(reparsed, path.resolve)),
          // ...and that is the ONLY use of `reparsed`. No setInlinePlugins. No clearPluginCache.

// Mapping: KZt→preParseAgentsArgv, i→reparsed, eYe→flattenCliConfig, ZKe→resolveCliConfigPaths,
//          e→opts, o→createRoot, s→getBaseRenderOptions
```

That is the whole bug in one line. `dispatchExtraArgs` is the argv handed to sessions the agent view
*dispatches*; a child launched from the view therefore did get `--plugin-dir`. The **agent-view process
itself** never called `setInlinePlugins`, so the plugin's agents and skills were missing from the list you
were looking at — exactly the changelog's wording ("not showing the plugin's agents and skills in the
agent view").

#### The delta: three inserted lines

```javascript
// ============================================
// agentsCommandHandler - the .200 fix: apply the re-parsed plugin dirs to THIS process
// Location: cli_inner_pretty.js:865016-865023
// ============================================

// ORIGINAL (for source lookup):
  if (process.stdout.isTTY) {
    if ((await etr(), NP())) {
      let r = fJi();
      O("tengu_fleetview", { viaCommander: !0, relaunch: r });
      let { config: n } = $$n(process.argv.slice(2));
      if (n.pluginDir.length > 0 || n.pluginDirNoMcp.length > 0)
        (lNr(n.pluginDir), cNr(n.pluginDirNoMcp), QI("claude agents --plugin-dir (commander action)"));
      $$r(A4t({ ...t, ...n }));

// READABLE (for understanding):
  if (process.stdout.isTTY) {
    if ((await hydrateFleetGate(), isAgentsFleetEnabled())) {
      let relaunch = consumeAgentViewRelaunchMarker();
      logEvent("tengu_fleetview", { viaCommander: true, relaunch });

      // Hoisted ABOVE the dynamic imports below — plugin state must be seeded
      // before any fleet-view module is loaded and starts reading it.
      let { config: reparsed } = preParseAgentsArgv(process.argv.slice(2));

      // [.200 FIX] apply to the CURRENT process, not just to dispatched children
      if (reparsed.pluginDir.length > 0 || reparsed.pluginDirNoMcp.length > 0) {
        setInlinePlugins(reparsed.pluginDir);
        setInlinePluginsNoMcp(reparsed.pluginDirNoMcp);
        clearPluginCache("claude agents --plugin-dir (commander action)");
      }
      // [.200 FIX] argv re-parse spread LAST so it wins over the lossy optsWithGlobals()
      setCliSessionConfigCarried(cliCarriesSessionConfig({ ...optsWithGlobals, ...reparsed }));

// Mapping: $$n→preParseAgentsArgv, n→reparsed, t→optsWithGlobals (2nd handler arg),
//          lNr→setInlinePlugins, cNr→setInlinePluginsNoMcp, QI→clearPluginCache,
//          $$r→setCliSessionConfigCarried, A4t→cliCarriesSessionConfig,
//          NP→isAgentsFleetEnabled, fJi→consumeAgentViewRelaunchMarker, O→logEvent
```

Two supporting changes complete it:

- **The action gained a second parameter.** `:867681-867683` is
  `.action(async (i, s) => { … await a(i, s.optsWithGlobals()); })`; 193 `:714557-714559 (193)` was
  `.action(async (i) => { … await a(i); })`. Hence `agentsCommandHandler`'s new signature
  `async function G_E(e, t = {})` at `:865007` (193: `async function lhm(e)` `:710487 (193)`). The
  defaulted `t = {}` keeps the one-arg call shape valid.
- **The re-parse moved earlier.** In 193 it was the tail of the `let` chain that also awaits the fleet-view
  dynamic imports (`:710500-710511 (193)`). In 220 it sits at `:865020`, *before* the `Promise.all` at
  `:865024-865034`. It has to: `clearPluginCache` must invalidate before `mountFleetViewWithComposerBack`
  and friends are imported and begin reading plugin state. Note the two call sites differ in binding
  style for the same reason — `:865022` calls `lNr`/`cNr`/`QI` **statically**, because
  `agentsCommandHandler` is itself inside a lazily imported module (`COm`/`xOm` `:865005`, `:865073`) and
  has already paid the load cost, whereas the fast path at `:872433-872437` still dynamic-imports them to
  keep them off the cold-start path.

### Why a hand-rolled argv scan, and what it gets wrong

**What it does:** `$$n` (`:69-108`) walks `process.argv.slice(2)` with a six-entry handler table
(`--cwd`, `--settings`, `--add-dir`, `--plugin-dir`, `--plugin-dir-no-mcp`, `--mcp-config`) plus a boolean
`--strict-mcp-config`, returning `{ hasAgentsPositional, cwdFilter, config, rest }`. Everything it does not
recognise falls through to `rest`.

**How it works:**
1. `:88-91` swallows the **first** bare `agents` token only (`a === "agents" && !t`), so
   `claude agents --add-dir agents` does not misread the second occurrence as the subcommand.
2. `:96-98` splits on the first `=`, so `--plugin-dir=./p` and `--plugin-dir ./p` both work — commander
   supports both forms and a re-parser that handled only one would reintroduce the bug for the other.
3. `:99-103` each handler `push`es, so repeats accumulate into an **array**. This is what restores the
   "(repeatable)" semantics the `agents` subcommand's own declaration silently dropped by omitting an
   `argParser`.
4. `:101-102` if a value-taking flag is the last token, the flag itself is pushed to `rest` rather than
   consuming `undefined` — the scan degrades to "unknown token" instead of storing garbage.
5. Position is irrelevant throughout. That is the entire point: it is immune to (a).

**Failure modes it does *not* handle:**
- **No `--` end-of-options sentinel.** `claude agents -- --plugin-dir X` is still picked up.
- **No short flags or clusters.** `-p`-style aliases for these options would be missed.
- **A flag-shaped value is consumed blindly.** `--plugin-dir --json` sets `pluginDir` to `"--json"`.
- **`rest` is a heuristic, not a parse.** An unknown value-taking flag contributes *both* its tokens to
  `rest`, which is why `--setting-sources user` is what pushes an invocation off the fast path (below).

These are accepted because the scan is only ever used to **seed plugin state and build child argv**;
commander still performs the authoritative parse for everything else, and a nonsensical path fails later
at plugin load with a real error rather than silently.

**Why this approach:** the alternatives are all worse or unavailable. Declaring `--plugin-dir` on the root
*and* on `agents` is what they already do, and (c) shows it cannot work while `optsWithGlobals()` merges
ancestor-last. Dropping `enablePositionalOptions()` would fix (a) globally but would change how every
subcommand's options are parsed — `claude mcp add … -- npx foo --flag` style pass-through depends on it.
Reversing the `optsWithGlobals()` reduce order means patching vendored commander. Giving the subcommand
option an accumulating `argParser` would fix its *type* but not (a) or (c). Re-reading `process.argv` is
the only change that is local to the one handler that needs it.

**Key insight:** the re-parse is not a parser *upgrade*, it is a **parser bypass** — an admission that by
the time an action handler runs, commander has already discarded the information, twice, in two unrelated
ways. The 2.1.200 fix is not "start re-reading argv" (193 already did) but "**stop throwing away what the
re-read found**": `:865021-865022` applies it locally and `:865023` spreads it **after** `optsWithGlobals`
so the argv truth overrides the merged-options lie.

#### Which invocations were actually broken

The commander path is only reached when the pre-commander fast path declines. That guard is
`s$m` (`:872134-872152`), **byte-identical to 193's `KDc` `:718253-718271 (193)`**: it returns true only
when every remaining token is a debug flag. Combined with `$$n`+`rEE` stripping the flags they know, plain
`claude agents --plugin-dir ./p` leaves `rest` empty, takes the **fast path** at `:872415-872438`, and was
therefore *already working in 2.1.193*.

The broken invocations are those carrying a token neither `$$n` (`:69-108`) nor `rEE` (`:872154-872173`)
recognises, which forces `s$m(rest) === false`. In practice: `--setting-sources`, and `--all` without
`--json` (`--json` exits earlier at `:865008-865015` via `R1` `:545739-545748`, which is
`process.stdout.write` + `process.exit(0)`). Those fall through to commander, reach
`agentsCommandHandler`, and in 193 lost the flag. This is why the bullet reads "when the flag is placed
after `agents`" but the real trigger is narrower still — *placed after `agents` **and** accompanied by a
flag the fast-path pre-parser does not know*.

#### Undocumented consequence: the new site has no managed-policy gate

The fast path gates inline plugins behind managed settings at `:872445-872458`: it calls
`areSideloadFlagsDisabledByPolicy()` (`uPt` `:238011-238013`, i.e.
`policySettings?.disableSideloadFlags === true`) and, if set, collects `--plugin-dir` / `--plugin-dir-no-mcp`
into a list and calls `exitWithError(sideloadFlagsBlockedMessage(list))` (`dPt` `:238014`).

**The new commander-action site at `:865021-865022` performs no such check.** `areSideloadFlagsDisabledByPolicy`
is **220=2 / 193=2** and in 2.1.220 its only call site remains `:872446` — the fast path. So on exactly the
invocations the `.200` fix newly enables (`claude agents --setting-sources … --plugin-dir X`), inline
plugins are now loaded **without** consulting `disableSideloadFlags`, whereas the same flag on the fast
path is refused. The fix closed a usability gap and opened a policy-enforcement asymmetry. Not in any
changelog; flagged here as a finding, not a verified exploit — I did not trace whether a later gate in the
fleet-view mount re-checks the policy.

---

## 2. Command-descriptor deltas

### 2.1 `.206 #1` — `/cd` gained `/add-dir`'s directory suggestions

**NET-NEW.** `new Set(["add-dir", "cd"])` **220=1 / 193=0** (`:654321`). The delta is an equality test
becoming a set membership test, in two places:

| | 2.1.193 | 2.1.220 |
|---|---|---|
| completion trigger | `if (Pt && Pt.commandName === "add-dir" && Pt.args)` `:629488 (193)` | `if (_r && wzo.has(_r.commandName) && _r.args)` `:746493` |
| "has argument completions" set | `aYf = new Set(["add-dir","resume","plugin","plugins","marketplace"])` `:628777 (193)` | `qRS = new Set([...wzo, "resume","plugin","plugins","marketplace"])` `:744165` |
| the set itself | — | `wzo = new Set(["add-dir","cd"])` `:654321` |

Both consumers had to change: `qRS` decides whether the input handler even *asks* for completions, and the
`wzo.has(...)` branch decides whether the completions are **directory** completions (`T("directory")` at
`:746507`) rather than file or command ones. Defining `wzo` once and spreading it into `qRS` makes the two
impossible to desynchronise — the class of bug where a command is "completable" but produces the wrong
completion kind.

Trailing whitespace short-circuits (`if (Wr.match(/\s+$/)) { cancel; return; }`, `:746495`): once the user
has typed a complete directory and a space, the popup closes rather than re-suggesting siblings. That is
also the guard that makes `.211`'s shell-mode `!` bullet tractable — see "not covered".

### 2.2 `.198` — `/login` from the agent view

**NET-NEW**, via a capability the host injects. `fleetHostCall` is **220=8 / 193=7**, and the extra one is
`/login`'s:

```javascript
// ============================================
// loginCommandDescriptor + the agent-view host capability object
// Location: cli_inner_pretty.js:455393-455401 and :806722-806736
// ============================================

// ORIGINAL (for source lookup):
var rBd = () => ({
  type: "local-jsx",
  name: "login",
  get description() { return bno() ? "Switch Anthropic accounts" : "Sign in with your Anthropic account"; },
  isEnabled: () => !Z.DISABLE_LOGIN_COMMAND,
  fleetHostCall: async ({ login: e }) => e(),
});
…
            if (Tl.fleetHostCall) {
              (qr(), Tl.fleetHostCall({
                    exit: Nn,
                    relaunch: () => PMe("manual"),
                    login: () => e({ type: "login", collapsed: [...df.current], groupMode: On, sessionModel: ib.current }),
                    setError: ho, setInfo: _O,
                  }, Es).catch((ch) => { (xe(ch), ho(le(ch))); }));
              return;
            }

// READABLE (for understanding):
const loginCommandDescriptor = () => ({
  type: "local-jsx", name: "login",
  get description() { return isLoggedIn() ? "Switch Anthropic accounts" : "Sign in with your Anthropic account"; },
  isEnabled: () => !env.DISABLE_LOGIN_COMMAND,
  fleetHostCall: async ({ login }) => login(),        // agent view knows how; the command does not
});
// host side:
  agentViewHostCapabilities = {
    exit, relaunch, login: () => dispatch({ type: "login", collapsed, groupMode, sessionModel }),
    setError, setInfo,
  };

// Mapping: rBd→loginCommandDescriptor, bno→isLoggedIn, PMe→relaunchAgentView, Nn→exitAgentView
```

2.1.193's capability object had four members — `{ exit, relaunch, setError, setInfo }` (`:677499 (193)`) —
and `/login` carried no `fleetHostCall` at all, so it hit the "isn't available in agent view" refusal.

**Why a host capability instead of letting `/login` render its own dialog?** The agent view is a
full-screen alternate-buffer UI with its own reducer and its own key handling; it does not mount the REPL's
local-jsx surface, so a command that returns JSX has nowhere to render. `fleetHostCall` is the escape:
the command declares *what* it needs (`login`), the host supplies *how* (`dispatch({type:"login", …})`,
carrying the view state — `collapsed`, `groupMode`, `sessionModel` — so the view can be restored
afterwards). The five commands with a `fleetHostCall` in 2.1.220 are `/login` (`:455400`), one at `:495215`,
one at `:501441`, `/exit` (`:501725`), and one at `:502076`; `qM_` (`:507443`) memoises the filtered list.

### 2.3 `.208 #43` / `.203 #32` — `/install-github-app` and `/mcp` in background and agent-view sessions

These are **two different guards** and the bullets conflate them.

**Agent view: pure carryover.** The refusal
`/${name} isn't available in agent view — attach to a session to run it` is **220=1 / 193=1**, and the
enclosing condition is byte-identical:

```javascript
// 220 :806739-806743        193 :677506-677510
if (Tl.type !== "prompt" && Tl.name !== "model") {
  let ch = es.toLowerCase(), Xa = Xce();
  if (!f5e.some((ic) => ic.kind !== "command" && (ic.name === ch || ic.aliases?.includes(ch))) && (!Xa || Xa.name === Tl.name)) { … }
```

What *is* new here is the telemetry — `tengu_slash_command_unavailable` **220=2 / 193=0** with
`{ command_name, surface: "fleet-local"|"fleet-cloud", reason: "unavailable_in_agent_view" }` (`:806776-806782`),
and the `/resume` carve-out inserted above it (§3.1). The `/model` exemption at `:806739` is also carryover.

**Background sessions: genuinely new.** A background session with no attached terminal cannot show a
dialog, so both commands now *park the session* instead of failing:

```javascript
// ============================================
// parkSessionAsNeedsInput - marks a bg session "needs input" so the user can be routed to it
// Location: cli_inner_pretty.js:700561-700583
// ============================================

// ORIGINAL (for source lookup):
async function u5t(e, t) {
  if (!eN()) return !1;
  let r = await wHs(e, t);
  switch (r.kind) {
    case "refused": return !1;
    case "already":
      if (Exn?.needs !== e) xvf(e, { tempo: "idle", needs: void 0, detail: "" });
      return !0;
    case "wrote": return (xvf(e, r.prior), !0);
  }
}
function xvf(e, t) {
  Exn?.unsubscribe();
  let r = p0t(() => {
    if (eN()) return;
    let n = Exn;
    if (!n || n.needs !== e) return;
    ((Exn = null), n.unsubscribe(), THs(e, n.prior));
  });
  Exn = { needs: e, prior: t, unsubscribe: r };
}

// READABLE (for understanding):
async function parkSessionAsNeedsInput(needsLabel, blockedReason) {
  if (!isDetachedBackgroundSession()) return false;
  const result = await markCommandParkBlocked(needsLabel, blockedReason);
  switch (result.kind) {
    case "refused": return false;                                  // roster said no
    case "already":                                                // already parked for something else
      if (activePark?.needs !== needsLabel) armUnparkOnAttach(needsLabel, { tempo: "idle", needs: undefined, detail: "" });
      return true;
    case "wrote": return (armUnparkOnAttach(needsLabel, result.prior), true);
  }
}
function armUnparkOnAttach(needsLabel, priorState) {
  activePark?.unsubscribe();
  const unsubscribe = onAttacherCapsChange(() => {                 // fires when a terminal attaches
    if (isDetachedBackgroundSession()) return;                     // still detached — keep the park
    const park = activePark;
    if (!park || park.needs !== needsLabel) return;
    (activePark = null, park.unsubscribe(), clearCommandParkBlocked(needsLabel, park.prior));
  });
  activePark = { needs: needsLabel, prior: priorState, unsubscribe };
}

// Mapping: u5t→parkSessionAsNeedsInput, xvf→armUnparkOnAttach, Exn→activePark,
//          eN→isDetachedBackgroundSession (:112712), wHs→markCommandParkBlocked (:335135),
//          THs→clearCommandParkBlocked (:335140), p0t→onAttacherCapsChange
```

`eN()` is **220=1 / 193=0**: `function eN() { return rs() && !AS(); }` — background session **and** no
attacher. The two call sites:

```javascript
// :701699-701712   /install-github-app
async function etS(e) {
  if (eN()) {
    let t = await u5t("open this session to finish /install-github-app", "/install-github-app requested");
    return (e(t ? `Can't run /install-github-app while no terminal is attached to this background session. This session now shows "needs input" in agent view — open it and run the command again.`
                : "Can't run /install-github-app while no terminal is attached to this background session. Attach to it and run the command again.",
              { display: "system" }), null);
  }
  return aT.jsx(qvf, { onDone: e });
}
// :714194-714211   /mcp   (clS/ulS/dlS at :714216-714220)
```

Counts: `Can't run /install-github-app while no terminal is attached` **220=2 / 193=0**;
`Can't open MCP settings while no terminal is attached` **220=1 / 193=0**;
`open this session to manage MCP servers` **220=1 / 193=0**;
`steer without the panel` **220=2 / 193=0**.

Three design points:
- **The message is conditional on whether parking succeeded.** If `u5t` returns `true` the user is told the
  session now shows `needs input`; if `false` they are told to attach manually. Never promise a UI affordance
  that was not created.
- **The park auto-clears on attach**, via `onAttacherCapsChange`, restoring `prior` — so a session parked
  for `/mcp` and then attached does not stay flagged forever.
- **`/mcp` offers a text alternative** that works headless: `use \`/mcp enable|disable|reconnect <server>\`
  to steer without the panel`. `plSf` (`:714198-714211`) routes those subcommands *before* the `eN()`
  check, so only the panel-opening forms park.

### 2.4 `.202` — `/rename` on background sessions

**Descriptor-level delta only.** The non-interactive `/rename` variant gained a visibility gate:

```javascript
// 220 :496503-496513                       193 :527948-527956
    { type: "local", name: "rename", aliases: ["name"],
      supportsNonInteractive: !0,
      description: "Rename the current conversation",
      argumentHint: "[name]",
      isEnabled: () => yn(),                 // ← NEW: non-interactive only
      get isHidden() { return !yn(); },      // ← NEW
      load: … }
// yn() :3286-3288  →  return !Ot.isInteractive;
```

In 2.1.193 both the `local-jsx` and the `local` `/rename` descriptors were registered unconditionally, and
`Cv`'s first-exact-name-wins rule (`:346396`) made the winner depend on registry order. Gating the `local`
variant on `isNonInteractive()` makes the pair deterministic.

**Honest limit:** I could not prove this *is* `.202`'s "renames on background sessions being reverted" —
the reversion symptom would live in whatever persists the title, not in the descriptor. Recorded as a real
descriptor delta with an unproven bullet mapping.

### 2.5 `.203 #22` — `/exit` warning after all agents completed: **UNANCHORED**

`running background agents` is **0/0** in both bundles; `agents still running` has one 220 hit
(`:532845`) which is *prompt text in the auto-mode consent guidance*, not the exit dialog. The `/exit`
descriptors (`:501716-501735`) show a genuine 220 delta —
`fleetHostCall: async ({ exit: e }) => e()` and a dynamic description
`rs() ? "Detach from this background session (it keeps running)" : "Exit the CLI"` (`:501710`) — but
neither is the warning. **UNANCHORED.**

### 2.6 `.211 #15` — `/loop` hiding the session from `/resume`: the obvious anchor is wrong

The `/resume` filter is **byte-identical carryover**:

```javascript
// 220 :527375                                              193 :585485
if (!a && r.isLoopSession) return (w(`Session ${e.sessionId} filtered from /resume: /loop session`), null);
```

`_scope_v211_214.md` proposed `tengu_loop_command` / `tengu_loop_noop_fold` (both 220=1 / 193=0). Reading
them: `tengu_loop_command` (`:789923`) is *invocation* telemetry
(`{ has_args, is_interval_only }`), and `tengu_loop_noop_fold` (`:230733`, `vir()`) gates the
**consecutive-`noop:true` terminal fold** — its consumers are the `ScheduleWakeup` schema's `noop` field
(`:403154-403161`), a transcript-collapse call (`:691753`), and the wakeup renderer (`:820414`). Neither
touches `/resume`.

`isLoopSession` is written into the transcript header by something I did not isolate (the literal appears
only at the destructure `:527150` and the filter `:527375`). **Verdict: the filter is carryover; the fix is
in the writer; the proposed anchors are unrelated.**

---

## 3. Message routing

### 3.1 `.212 #6` — `/resume` in the agent view opens a past-session picker

**NET-NEW.** Gate: `CLAUDE_CODE_FLEET_PAST_SESSIONS` **220=1 / 193=0** and
`tengu_fleet_past_sessions` **220=1 / 193=0**, both at `:157288`.

```javascript
// ============================================
// isFleetPastSessionsEnabled / isFleetResumePickerAllowed / listPastSessionsForFleet
// Location: cli_inner_pretty.js:157287-157289, 801823-801853
// ============================================

// ORIGINAL (for source lookup):
function SVr() { return Og.CLAUDE_CODE_FLEET_PAST_SESSIONS === !0 || Ke("tengu_fleet_past_sessions", !1); }
function gcl() { return ycl() && SVr(); }
function ycl() { return !ql() && !qbi(); }
async function _cl(e, t) {
  try {
    let r = gn(), n = await Oxe(r);
    return (await obr(n, void 0, t ? FKS : void 0)).flatMap((s) => {
      if (!s.sessionId || !s.fullPath) return [];
      if (e.has(s.sessionId)) return [];
      if (!t && s.sessionKind === "bg") return [];
      return [{ sessionId: s.sessionId, fullPath: s.fullPath,
                title: Uf(xi(hKt(s))) || s.sessionId.slice(0, 8),
                modified: s.modified, cwd: s.relocatedCwd ?? s.projectPath ?? r }];
    });
  } catch (r) { … return null; }
}
var FKS = 200;

// READABLE (for understanding):
function isFleetPastSessionsEnabled() {
  return env.CLAUDE_CODE_FLEET_PAST_SESSIONS === true || getFeatureValue("tengu_fleet_past_sessions", false);
}
function isFleetEarlierRowsEnabled() { return isFleetResumePickerAllowed() && isFleetPastSessionsEnabled(); }
function isFleetResumePickerAllowed() { return !isSafeMode() && !isRestrictedLaunch(); }
async function listPastSessionsForFleet(excludedSessionIds, includeBackground) {
  const cwd = originalCwd(), index = await loadSessionIndex(cwd);
  return (await enumerateSessions(index, undefined, includeBackground ? PAST_SESSION_SCAN_CAP : undefined))
    .flatMap((s) => { … });
}
const PAST_SESSION_SCAN_CAP = 200;

// Mapping: SVr→isFleetPastSessionsEnabled, gcl→isFleetEarlierRowsEnabled, ycl→isFleetResumePickerAllowed,
//          _cl→listPastSessionsForFleet, FKS→PAST_SESSION_SCAN_CAP, Ke→getFeatureValue
```

The picker branch is inserted **inside** the agent-view unavailable-command guard, before the refusal
(`:806745-806765`):

```javascript
if (Tl.name === "resume" && !Es.trim() && as.current !== "remote" && !d && ycl()) {
  …
  let vm = new Set(p0e);
  if (gcl()) { for (let qh of f0e.rows) if (qh.kind === "earlier") vm.add(qh.entry.sessionId); }
  _cl(vm, !0).then((qh) => {
    if (Wh !== Lt.current) return;                                   // stale-response guard
    if (qh === null) { (pe("fleet_view_resume_picker", "load_failed"), It({ entries: [], failed: !0 })); return; }
    let aP = qh.filter((T5) => !bO.current.has(T5.sessionId.slice(0, 8)) && !Zq.current.has(T5.sessionId));
    (be("fleet_view_resume_picker", { count: aP.length }), It({ entries: aP, failed: !1 }));
  });
  return;
}
```

**Four preconditions, in this order:** the command is `resume`; **the argument is empty** (`/resume <term>`
still refuses, because search needs the REPL); the view is local, not remote; and the picker is allowed
(`ycl()` — not safe mode, not a restricted launch).

**The deleted-session handling — the part the bullet mentions.** Two ref-held sets exclude rows:
`bO.current` holds the **8-char short ids of roster rows whose deletion is in flight**, and `Zq.current`
holds the `sessionId` / `resumeSessionId` those rows own (populated together at `:805274-805280`, and both
*undone* by the rollback closure at `:805288-805290` if the delete is cancelled). Deletion is optimistic —
the row vanishes immediately and the on-disk removal happens after — so between the two there is a window
where a past-session scan would happily re-offer the session the user just deleted.

The exclusion is applied **twice**, which is the giveaway that this is a race and not a filter:

| where | line | effect |
|---|---|---|
| when the list is built | `:806761` | the row never appears |
| when a row is chosen | `:805989` | `deleting_in_flight` → `This session is being deleted — reopen /resume once it finishes` |

The second check exists because the deletion can *start* while the picker is open. There are three more
guards in the same ladder at selection time (`:805984-806001`): `session_live_elsewhere`
(`Can't open — this session is running in another terminal`), `already_in_list`
(checked against both the roster and the live-worker list), and `transcript_gone`
(`stat` on `fullPath` fails → `This conversation's file is no longer on disk — it may have been cleaned up`).

**And it resumes as a background session.** The chosen entry is handed to `jTn(sessionId, {intent, name,
cwd, inFlight, linkScanPath})` at `:806017-806023` — the background-session seed writer — with a cwd
sanity check first (`:806009-806020`: non-absolute, or a path that fails `isDirectory()`, falls back to the
view's cwd and emits `cwd_fallback`). That is what makes this "resume **as a background session**" rather
than "resume".

`FKS = 200` bounds the scan only on the `includeBackground` path; the plain path is unbounded, on the
assumption that the roster is already the bounded view.

### 3.2 `.208 #27` — `/release-notes` "Show all" injected the changelog into every request

**NET-NEW**, and the best bug in this document. `Show all` itself is **220=2 / 193=2 carryover** — the label
proves nothing. The delta is *how the selected text is delivered*.

```javascript
// ============================================
// emitReleaseNotesAsNotice - deliver changelog text as UI-only, never as transcript
// Location: cli_inner_pretty.js:720265-720267 (callers :720288, :720299, :720355)
// ============================================

// ORIGINAL 2.1.193 (for source lookup):
      if (h === NOl) { r(FOl(n), { display: "system" }); return; }          // :527603 (193)  "Show all"
      …
      r(t$o(y[0], y[1]), { display: "system" });                            // :527615 (193)  one version

// ORIGINAL 2.1.220 (for source lookup):
function Zkn(e, t, r) {
  (t({ type: "append", messages: [ml(e, "notice")] }), r(void 0, { display: "skip" }));
}
…
      if (((uLf.current = !0), tmS === Lni)) { Zkn(c5a(Z5t), o5a, eWt); return; }     // :720287-720289
      …
      Zkn(Dni(dLf[0], dLf[1]), o5a, eWt);                                            // :720299
      …
    if (n.length === 0) return (Zkn(`See the full changelog at: ${CEp}`, t.applyMessageOp, e), null);   // :720355

// READABLE (for understanding):
function emitReleaseNotesAsNotice(text, applyMessageOp, onDone) {
  applyMessageOp({ type: "append", messages: [systemMessage(text, "notice")] });   // UI-only static message
  onDone(undefined, { display: "skip" });                                          // nothing enters the transcript
}

// Mapping: Zkn→emitReleaseNotesAsNotice, ml→systemMessage (:533218), o5a→applyMessageOp,
//          c5a→formatAllReleaseNotes, Dni→formatOneVersionReleaseNotes, Lni→SHOW_ALL_SENTINEL
```

**The mechanism of the bug.** A `local-jsx` command that calls `onDone(text, { display: "system" })` has
its text wrapped by the executor at `:343584`:

```javascript
[UH(tft(y, t)), UH(`<local-command-stdout>${fIe(String(C))}</local-command-stdout>`), ...R]
```

Those are real conversation messages. "Show all" concatenates **every** version's notes
(`c5a` joins `Dni(version, bullets)` for the whole array), so one keypress permanently added the entire
changelog to the conversation — re-sent, re-tokenised and re-cached on every subsequent turn for the rest
of the session.

The fix routes through `applyMessageOp` (**220=12 / 193=9**) with `ml(text, "notice")`
(`{ type: "system", subtype: "informational", isMeta: !1, level: "notice", … }`, `:533218-533230`), which
is a *renderer* message, and returns `display: "skip"` so the executor's transcript-append branch is not
taken at all.

**Why apply it to the single-version path too?** `Zkn` is called from all three sites, including the
one-version case and the "no notes" case. A single version is a few hundred tokens, not tens of thousands —
but the *category* is wrong either way: release notes are something you read, not something Claude should
reason over. Fixing the category rather than the size is why one four-line helper covers the whole command.

### 3.3 `.208 #45` / `.208 #24` — `/usage` stale bars and the rate-limited "as of" note

**NET-NEW.** `rateLimitedVia` **220=9 / 193=0**; `Showing last-known usage` **220=1 / 193=0**;
`could not refresh` **220=1 / 193=0**; the `as of` formatter `:670406-670409` (` as of ${…}` **220=2 / 193=1**).

```javascript
// :670406-670409
function Uof(e) { if (e === void 0) return ""; return ` as of ${HZ(new Date(e))}`; }
```

The `seeded` arm of the fetch switch (`:670451-670475`) is the whole story:

```javascript
        case "seeded": {
          let CNb = NX.seedSource === "headers" ? "headers" : Dof.current === null ? "persisted" : Pof.current;
          let Ekk = CNb === "persisted";
          if ((SNb((vkk) => (NX.seedSource === "headers" ? NX.utilization : (vkk ?? NX.utilization))),
              (Pof.current = CNb), NX.seedSource === "headers")) j0a.current = void 0;
          else if (Dof.current === null) j0a.current = NX.seedFetchedAtMs;
          (ANb(NX.seedSource === "persisted"
              ? `Showing last-known usage${Ekk ? Uof(j0a.current) : ""}${NX.rateLimitedVia !== null ? " (rate limited — try again in a moment)" : " (could not refresh)"}`
              : NX.rateLimitedVia !== null
                ? "Per-model breakdown unavailable (rate limited — try again in a moment)"
                : "Could not refresh usage data"),
            $e("usage_plan_limits",
               NX.rateLimitedVia === null ? "refresh_failed_seeded"
                 : NX.rateLimitedVia === "envelope" ? "rate_limited_seeded_envelope" : "rate_limited_seeded_http_429"));
```

Three orthogonal facts are tracked and each changes the copy:
1. **Where the seed came from** — `headers` (piggy-backed on a live API response: fresh, so no timestamp is
   shown and `j0a.current` is cleared) vs `persisted` (read off disk: stale, so the timestamp *is* shown).
2. **Why the refresh failed** — `rateLimitedVia` distinguishes `null` (a plain failure → `could not
   refresh`), `"envelope"` (the API's own rate-limit envelope), and HTTP 429. The user-facing text collapses
   the last two into `rate limited — try again in a moment`, but the telemetry reason keeps them apart —
   `rate_limited_seeded_envelope` vs `rate_limited_seeded_http_429`.
3. **Whether bars can be shown at all** — the `seeded` arm keeps whatever utilization it already had
   (`vkk ?? NX.utilization`) rather than clearing it, which is the actual "stale bars" fix: previously a
   failed refresh presumably blanked or froze them with no explanation.

`Ekk` (`= CNb === "persisted"`) gates the timestamp, so `as of` never appears on a header-seeded read —
correctly, since a header seed *is* current.

### 3.4 `.211 #19` — `/clear` did not reset the session cost counter

**NET-NEW**, and it is two inserted calls in a comma sequence.

```javascript
// ============================================
// conversationResetSequence - the /clear reset, before and after
// Location: cli_inner_pretty.js:449529-449539  (193 twin :485411-485418)
// ============================================

// ORIGINAL 2.1.193 (for source lookup):
  if ((j6t(),
    yield { type: "conversation_reset", newConversationId: KTl.randomUUID() },
    Jdr({ setCurrentAsParent: !0 }),
    Fxa(),
    process.env.CLAUDE_CODE_SESSION_ID))
    process.env.CLAUDE_CODE_SESSION_ID = xt();

// ORIGINAL 2.1.220 (for source lookup):
  if ((Icn(),
    yield { type: "conversation_reset", newConversationId: M$d.randomUUID() },
    PSi(),                       // ← NEW
    Att(),                       // ← NEW
    Mbi({ setCurrentAsParent: !0 }),
    A$d(),
    Ept(),
    process.env.CLAUDE_CODE_SESSION_ID))
    process.env.CLAUDE_CODE_SESSION_ID = kt();

// READABLE (for understanding):
    flushSessionCostToDisk();      // PSi → the callback registered by registerSessionCostSaver
    resetCostState();              // Att → zero totalCostUSD, durations, lines, modelUsage, promptId
    regenerateSessionId({ setCurrentAsParent: true });

// Mapping: PSi→flushSessionCostToDisk (:3111), Att→resetCostState (:3114), DSi→registerSessionCostSaver (:3108),
//          Mbi→regenerateSessionId, Icn→(pre-reset hook)
```

`resetCostState` zeroes ten fields (`:3114-3126`): `totalCostUSD`, `totalAPIDuration`,
`totalAPIDurationWithoutRetries`, `totalToolDuration`, `startTime = Date.now()`, `totalLinesAdded`,
`totalLinesRemoved`, `hasUnknownModelCost`, `modelUsage = {}`, `promptId = null`.

**The ordering is the design.** `PSi()` before `Att()` before `Mbi()`:
1. flush the *old* session's cost to disk while the counters still hold it and the session id still
   identifies it;
2. zero the counters;
3. only then mint the new session id.

Reversing any pair loses or misattributes the spend. `registerSessionCostSaver` (`DSi`) is **220=1 /
193=0** and its single registration is `DSi(() => Qen())` at `:308774` — a late-bound indirection so the
state module (line 3,000) does not have to import the persistence module (line 308,000).

`resetCostState` itself is **carryover** (`CYe` at `:2917 (193)`); its 193 callers were only the gateway
path (`:386120 (193)`) and one other (`:688562 (193)`). It was simply never wired into `/clear`.

### 3.5 `.212 #40` — bare `/btw` reopens the side-question panel

**NET-NEW.** `/btw` sites went **down** (220=7 / 193=9), which is exactly why the scope pass flagged it as
a delta rather than an addition. The change is in the handler's empty-argument branch:

```javascript
// ============================================
// btwCommandCall - bare /btw now reopens the last side question
// Location: cli_inner_pretty.js:661737-661748  (193 twin :483010-483014)
// ============================================

// ORIGINAL 2.1.193 (for source lookup):
async function Wpf(e, t, n) {
  let r = n?.trim();
  if (!r) return (e("Usage: /btw <your question>", { display: "system" }), null);
  return (mn((o) => ({ ...o, btwUseCount: o.btwUseCount + 1 })), e_.jsx(Bpf, { question: r, context: t, onDone: e }));
}

// ORIGINAL 2.1.220 (for source lookup):
async function eLb(e, t, r) {
  let n = r?.trim();
  if (!n) {
    let o = W3t().at(-1);
    if (!o) return (e("Usage: /btw <your question>", { display: "system" }), null);
    return Md.jsx(REa, { question: o.question, initialResponse: o.response, context: t, onDone: e });
  }
  return (await hr((o) => ({ ...o, btwUseCount: o.btwUseCount + 1 })), Md.jsx(REa, { question: n, context: t, onDone: e }));
}

// READABLE (for understanding):
async function btwCommandCall(emit, toolUseContext, rawArgs) {
  const question = rawArgs?.trim();
  if (!question) {
    const last = getSideQuestionHistory().at(-1);                       // :652811
    if (!last) return (emit("Usage: /btw <your question>", { display: "system" }), null);
    return <SideQuestionPanel question={last.question} initialResponse={last.response} … />;   // replay
  }
  await updateGlobalConfig((c) => ({ ...c, btwUseCount: c.btwUseCount + 1 }));
  return <SideQuestionPanel question={question} … />;                    // fresh
}

// Mapping: Wpf/eLb→btwCommandCall, W3t→getSideQuestionHistory, REa/Bpf→SideQuestionPanel,
//          hr/mn→updateGlobalConfig
```

Two things fall out of the restructure:
- **`btwUseCount` is not incremented on the reopen path.** Reopening a panel to re-read an answer is not a
  new use of the feature, and the counter drives the tip/discoverability system. (`btwUseCount` 220=3 /
  193=5.)
- **`initialResponse` is threaded in** (220=7 / 193=5), so the panel renders the recorded answer instead of
  re-asking the model. Reopening costs zero tokens.
- The usage string still exists for the genuinely-empty-history case, so the command never becomes a no-op.

Related, and unchanged: the `/btw` shorthand regex `rCb = /^\/btw\b/gi` (`:652912`, 193 `:482363`) and the
`(+N earlier /btw)` counter (`:661453`).

### 3.6 `.208 #18` — `/upgrade` showing a login flow: **changelog↔code discrepancy**

The `/upgrade` handler's control flow is **the same in both builds**:

```javascript
// 220 :719553-719596                              193 :561203-561218
    await Tc(n);                          //  await gc("https://claude.ai/upgrade/max");
    …
    return RRf.jsx(fje, { startingMessage: "Starting new login following /upgrade. …", onDone: … });
  } catch (o) {
    (xe(o), setTimeout(e, 0, `Failed to open browser. Please visit ${n} to upgrade.`));
  }
  return null;
```

On success it still returns the **login component**; only a *thrown* browser-open error takes the text
path, and that path is byte-equivalent to 193's. `Failed to open browser` is **220=3 / 193=3**;
`Couldn't open your browser` is 1/1.

The only real 220 deltas in `/upgrade` are cosmetic-plus-attribution:
`callUpgradeFromSurface` **220=2 / 193=0** (`:719549`, `:719887`) and a UTM-tagged URL builder
`IRf(campaign)` → `https://claude.ai/upgrade/max?utm_source=claude_code&utm_medium=cli&utm_campaign=<surface>`
(`:719545-719546`, `utm_campaign` 220=2 / 193=1). 193 used the bare URL.

**Verdict: the `.208` bullet's fix is not present in the 2.1.220 client.** Either it was reverted, or it
lives server-side in what `Tc()` does. Report it as a discrepancy, not an implemented fix.

### 3.7 `.198 #26` — `/branch` derived its name from the compaction summary

**NET-NEW**, and a clean structural change: a one-message reader became an array scan with a classifier.

```javascript
// ============================================
// deriveBranchNameFromMessages - skip compaction summaries and meta when naming a branch
// Location: cli_inner_pretty.js:500107-500112  (193 twin :482519-482525)
// ============================================

// ORIGINAL 2.1.193 (for source lookup):
function JAl(e) {
  let t = e?.message?.content;
  if (!t) return "Branched conversation";
  let n = typeof t === "string" ? t : t.find((r) => r.type === "text")?.text;
  if (!n) return "Branched conversation";
  return n.replace(/\s+/g, " ").trim().slice(0, 100).trimEnd() || "Branched conversation";
}

// ORIGINAL 2.1.220 (for source lookup):
function nJd(e) {
  let t = { commandFallback: "" }, r;
  for (let n of e) if (((r = oxt(n, t)), r !== void 0)) break;
  return ((r ??= t.commandFallback), r.replace(/\s+/g, " ").trim().slice(0, 100).trimEnd() || "Branched conversation");
}

// READABLE (for understanding):
function deriveBranchNameFromMessages(messages) {
  const state = { commandFallback: "" };
  let prompt;
  for (const m of messages) if ((prompt = extractPromptFromMessage(m, state)) !== undefined) break;
  prompt ??= state.commandFallback;                       // a slash command counts only if nothing better exists
  return prompt.replace(/\s+/g, " ").trim().slice(0, 100).trimEnd() || "Branched conversation";
}

// Mapping: JAl/nJd→deriveBranchNameFromMessages (exported as deriveFirstPrompt at :500106),
//          oxt→extractPromptFromMessage (:49401)
```

The classifier it now delegates to:

```javascript
// :49401-49436, condensed
function oxt(e, t) {
  if (e.type !== "user") return;
  if (e.isMeta === !0 || e.isCompactSummary === !0) return;        // ← THE FIX
  …
      if (i.type === "tool_result") return;                        // tool-result-only turns are not prompts
  …
    let a = D0h.exec(s);                                           // /<command-name>…</command-name>
    if (a) { if (!t.commandFallback) t.commandFallback = a[1]; continue; }
    let l = /<bash-input>([\s\S]*?)<\/bash-input>/.exec(s);
    if (l) return `! ${l[1].trim()}`;
    if (xLi.test(s)) continue;                                     // /^\s*<tag[\s>]|\[Request interrupted by user…\]/
    if (s.length > 200) s = ma(s, 200).trim() + "…";
    return s;
}
```

**Why this fixes the bullet exactly.** After a compaction, the first `user`-role entry in the transcript is
the compaction summary, carrying `isCompactSummary: true`. 193's `JAl` was handed "the first message" by
its caller and read its text unconditionally, so every branch taken from a compacted conversation was named
after the summary's opening words. `oxt`'s second line skips it and the loop keeps walking.

Three further behaviours come free with the delegation, all of which 193's reader lacked:
- **`commandFallback` is a fallback, not a match.** A conversation that opens with `/plan` yields
  `commandFallback = "plan"` but the loop continues; only if *no* real prompt is ever found does `plan`
  become the name.
- **`<bash-input>` is unwrapped** to `! <cmd>`, so a session opened with `!npm test` is named after the
  command, not after the XML.
- **System-reminder-shaped and "[Request interrupted by user…]" turns are skipped** via `xLi`.

`oxt` itself is **carryover** (193 has it, with three callers, and the same `xLi` regex at `:47943 (193)`);
`commandFallback` went 220=10 / 193=8 — the +2 being `nJd`'s two references. **So the delta is the
delegation, not the classifier.**

### 3.8 `.206 #3` — `/commit-push-pr` auto-allows push to `remote.pushDefault`

**NET-NEW.** `remote.pushDefault` **220=2 / 193=0**; `getGitPushShellPatterns` **220=1 / 193=0**;
the enabling field `getAllowedTools` **220=5 / 193=0**.

```javascript
// ============================================
// getGitPushShellPatterns + the dynamic allowed-tools hook on /commit-push-pr
// Location: cli_inner_pretty.js:55575-55595, 449740-449741, 449876-449892
// ============================================

// ORIGINAL (for source lookup):
async function Tkh() {
  let { stdout: e, code: t } = await an(fo(), [...Sl, "remote"], { preserveOutputOnError: !1, useCwd: !0 });
  if (t !== 0) return null;
  let r = e.split(`\n`).map((o) => o.trim()).filter(Boolean),
    n = await wkh("remote.pushDefault");
  if (n && r.includes(n)) return n;
  if (r.length === 1) return r[0] ?? null;
  return null;
}
async function g5n() {
  let e = new Set(["origin"]), t = await Tkh();
  if (t && Akh.test(t)) e.add(t);
  return [...e].flatMap((r) => [`git push ${r} *`, `git push -u ${r} *`]);
}
…
async function Cl_() { return J$d([...X$d, ...(await g5n())]); }
…
  ((X$d = ["git checkout -b *","git add *","git status *","git commit *","gh pr create *","gh pr edit *","gh pr view *"]),
    (Tl_ = ["ToolSearch","mcp__slack__send_message","mcp__claude_ai_Slack__slack_send_message"]),
    (z$d = J$d([...X$d, "git push origin *", "git push -u origin *"])));
  ((xl_ = { type: "prompt", name: f0s, description: "Commit, push, and open a PR",
            allowedTools: z$d, getAllowedTools: Cl_, … }));

// READABLE (for understanding):
async function resolveDefaultPushRemote() {
  const remotes = (await git(["remote"])).stdout.split("\n").map(s => s.trim()).filter(Boolean);
  const pushDefault = await gitConfigGet("remote.pushDefault");
  if (pushDefault && remotes.includes(pushDefault)) return pushDefault;   // configured AND real
  if (remotes.length === 1) return remotes[0] ?? null;                    // sole remote
  return null;                                                            // ambiguous → origin only
}
async function getGitPushShellPatterns() {
  const names = new Set(["origin"]);
  const resolved = await resolveDefaultPushRemote();
  if (resolved && SAFE_REMOTE_NAME.test(resolved)) names.add(resolved);   // /^[A-Za-z0-9][A-Za-z0-9._-]*$/
  return [...names].flatMap((n) => [`git push ${n} *`, `git push -u ${n} *`]);
}
async function commitPushPrAllowedTools() {
  return toToolPatterns([...COMMIT_PUSH_PR_BASE_PATTERNS, ...(await getGitPushShellPatterns())]);
}

// Mapping: Tkh→resolveDefaultPushRemote, wkh→gitConfigGet, g5n→getGitPushShellPatterns,
//          Akh→SAFE_REMOTE_NAME (:56201), Cl_→commitPushPrAllowedTools, J$d→toToolPatterns (:449862),
//          X$d→COMMIT_PUSH_PR_BASE_PATTERNS, z$d→the static fallback list
```

**Why the resolution is that conservative.** The permission patterns produced here are *pre-approvals*: a
`Bash(git push <remote> *)` rule means the model can push to that remote without asking. So the resolver
refuses to guess:
- `remote.pushDefault` is honoured **only if it names a remote that actually exists** (`r.includes(n)`) —
  a stale config value pointing at a deleted remote does not mint a rule.
- A sole remote is honoured regardless of its name; **two or more remotes with no `pushDefault` yields
  `null`**, and only `origin` is pre-approved. That is the ambiguous case, and ambiguity resolves to the
  narrow answer.
- The name is validated against `/^[A-Za-z0-9][A-Za-z0-9._-]*$/` before it is interpolated into a pattern
  string. A remote named `origin; rm -rf /` would otherwise become a permission rule. Since `git remote`
  output and `git config` values are repo-controlled, this is a real injection surface.

`J$d` (`:449862`) doubles every shell pattern into `Bash(p)` **and** `PowerShell(p)`, then appends `Tl_`
(the Slack/ToolSearch tools).

**Why keep both `allowedTools` and `getAllowedTools`?** `allowedTools` is a static array evaluated at
module init and cannot run git; `getAllowedTools` is async and can. The static list is retained as the
`origin`-only fallback for any consumer that reads the field synchronously (the `/config` display, the
skill listing). The pair is the general mechanism — `getAllowedTools` is **220=5 / 193=0**, so this is a new
capability of the prompt-command shape, of which `/commit-push-pr` is one user.

---

## 4. Display labels: the `.200` "Manual" rename

**PARTIAL delta, exactly as the brief predicted** — `defaultMode` is 220=44 / 193=32, but the wire value
never changed. The rename is confined to a display table and an input alias.

```javascript
// ============================================
// permissionModeDisplayTable - Default→Manual, plus a new `indicator` field
// Location: cli_inner_pretty.js:58495-58544  (193 twin :54283-54302)
// ============================================

// ORIGINAL 2.1.193 (for source lookup):
  Chs = {
    default: { title: "Default", shortTitle: "Default", symbol: "", color: "text", external: "default" },
    plan: { title: "Plan Mode", shortTitle: "Plan", symbol: Icn, color: "planMode", external: "plan" },
    …
    auto: { title: "Auto mode", shortTitle: "Auto", symbol: "⏵⏵", color: "warning", external: "auto" },
  };

// ORIGINAL 2.1.220 (for source lookup):
  dWl = {
    default: { title: "Manual", shortTitle: "Manual", indicator: "manual mode", symbol: X4r, color: "inactive", external: "default" },
    plan:    { title: "Plan",   shortTitle: "Plan",   indicator: "plan mode",   symbol: X4r, color: "planMode", external: "plan" },
    acceptEdits: { title: "Accept edits", shortTitle: "Accept", indicator: "accept edits", …, external: "acceptEdits" },
    bypassPermissions: { title: "Bypass Permissions", shortTitle: "Bypass", indicator: "bypass permissions", …, external: "bypassPermissions" },
    dontAsk: { title: "Don't Ask", shortTitle: "DontAsk", indicator: "don't ask", …, external: "dontAsk" },
    auto:    { title: "Auto",   shortTitle: "Auto",   indicator: "auto mode",   …, external: "auto" },
  };

// READABLE (for understanding):
  permissionModeDisplayTable = {
    // key = internal mode id · title/shortTitle = UI labels · indicator = lowercase prose phrase
    // external = THE WIRE VALUE (settings, SDK, --print) — identical in both builds
    default:           { title: "Manual",             shortTitle: "Manual",  indicator: "manual mode",        symbol: MODE_GLYPH, color: "inactive",   external: "default" },
    plan:              { title: "Plan",               shortTitle: "Plan",    indicator: "plan mode",          symbol: MODE_GLYPH, color: "planMode",   external: "plan" },
    acceptEdits:       { title: "Accept edits",       shortTitle: "Accept",  indicator: "accept edits",       symbol: "⏵⏵",       color: "autoAccept", external: "acceptEdits" },
    bypassPermissions: { title: "Bypass Permissions", shortTitle: "Bypass",  indicator: "bypass permissions", symbol: "⏵⏵",       color: "error",      external: "bypassPermissions" },
    dontAsk:           { title: "Don't Ask",          shortTitle: "DontAsk", indicator: "don't ask",          symbol: "⏵⏵",       color: "error",      external: "dontAsk" },
    auto:              { title: "Auto",               shortTitle: "Auto",    indicator: "auto mode",          symbol: "⏵⏵",       color: "warning",    external: "auto" },
  };

// Mapping: Chs/dWl→permissionModeDisplayTable, X4r→MODE_GLYPH
```

Four changes in one table: `Default`→`Manual`, `Plan Mode`→`Plan`, `Auto mode`→`Auto`, and a **new
`indicator` field on all six rows** (`indicator: "` is **220=6 / 193=0**) carrying the lowercase phrase used
in prose — e.g. the shortcut hint at `:815406`:
*"Hit shift+tab to cycle between **manual mode**, auto-accept edit mode, and plan mode"*.

**`external` is unchanged on every row.** That is the whole reason the rename is safe: `external` is the
value written to settings, sent over the SDK, and printed by `--print`. Renaming the *display* while
pinning the *wire* value is what lets old settings files, CI configs and IDE extensions keep working.

### The input side: `manual` becomes an accepted alias

```javascript
// :58323-58325  (exported as normalizePermissionModeAlias at :58296)
function fL(e) { return e === "manual" ? "default" : e; }
// :58339        (exported as PERMISSION_MODE_MANUAL_ALIAS at :58303)
  QOe = "manual";
```

`fL` is **220=1 / 193=0** as a definition and is threaded into every ingestion point:

| site | what it normalises |
|---|---|
| `:58492-58493` | two zod enum preprocessors (`pWl`, `r3r`) |
| `:60596` | `permissions.defaultMode` in the settings schema |
| `:118913`, `:118944` | runtime permission-mode resolution and the settings default |
| `:269995`, `:270125` | agent-definition frontmatter |
| `:529373` | one more resolution path |
| `:546576-546577` | the background-session argv peeler (`--permission-mode x` and `--permission-mode=x`) |
| `:547596`, `:835526` | SDK / control-protocol schemas |
| `:871058`, `:871078` | `claude schedule` task flags |
| `:551621-551622` | the routine schema, which additionally `.transform(e => e === QOe ? "default" : e)` |

And the `--help` surface shows the *new* name while accepting both:

```javascript
// :833650
  ((Vyl = J5.map((e) => (e === "default" ? QOe : e))), (WlE = [...J5, QOe]));
// :833642-833645
function Jwm(e) { if (!WlE.includes(e)) throw new iUt(`Allowed choices are ${Vyl.join(", ")}.`); return e; }
// :851174
  new id("--permission-mode <mode>", "Permission mode to use for the session").choices(Vyl).argParser(Jwm),
```

`Vyl` = the *displayed* choice list with `default` replaced by `manual`; `WlE` = the *accepted* set,
containing both. So `--help` prints `manual`, `--permission-mode default` still works, and the error message
only advertises the new spelling. 2.1.193 passed the raw enum `BP` to `.choices()` and used
`.argParser(String)` (`:712431 (193)`).

The settings-schema description states it too (`:60599`):
*"Default permission mode when Claude Code needs access (`'manual'` is accepted as an alias for `'default'`)"*
— 193's was the same sentence without the parenthetical (`:56226 (193)`).

**IDE surfaces are out of scope of this bundle.** The `.200` bullet mentions VS Code and JetBrains; those
labels live in the extensions, not here. The CLI's contribution is the display table and the alias.

### `.200` — AskUserQuestion no longer auto-continues by default

The **entire** auto-continue surface is 220-only:

| anchor | 220 | 193 |
|---|---|---|
| `askUserQuestionTimeout` (settings key) | 9 | **0** |
| `afkTimeoutMs` | 9 | **0** |
| `afk_timeout` | 2 | **0** |
| `auto-continue` | 4 | **0** |
| `tengu_ask_user_question_afk_auto_advance` | 1 | **0** |
| `tengu_ask_user_question_timeout_changed` | 1 | **0** |

```javascript
// :61218-61226   settings schema
      askUserQuestionTimeout: v.enum(["60s", "5m", "10m", "never"]).optional().catch(void 0)
        .describe("Idle time before Claude's questions auto-continue with any answers selected so far. " +
                  "Defaults to never — auto-continue only runs when explicitly set to 60s/5m/10m."),
// :452190        the /config row's option order
  vNd = ["never", "60s", "5m", "10m"];
// :451890-451903 the /config row
      { id: "askUserQuestionTimeout", label: "Question auto-continue timeout",
        value: r?.askUserQuestionTimeout ?? TCe() ?? "never", options: [...vNd], type: "enum",
        async onChange(F) { … O("tengu_ask_user_question_timeout_changed", { value: fe(G), source: Ee("config_panel") }); } },
```

Three details:
- **`never` is first in `vNd`**, so it is both the documented default and the first option in the picker.
- **`.catch(void 0)`** on the enum means an unrecognised value in settings (say `"30s"`) silently becomes
  `undefined` → `never`, rather than failing the whole settings parse. Fail-safe in the "do not
  auto-answer" direction.
- The auto-advance fires `NDn(j2, "afk_timeout")` (`:767118`) with *whatever was selected so far*
  (`hadPartialAnswers` is a telemetry dimension), so the timeout genuinely submits a partial answer — which
  is precisely why the default must be off.

**Honest framing:** the changelog says "no longer auto-continues", implying a removal, but there is no
`afk`-named auto-advance in 2.1.193 at all. Either the feature shipped and was defaulted off inside this
window, or an earlier ungated implementation existed under a name I did not find. What 2.1.220 shows is a
complete opt-in mechanism defaulting to `never`.

---

## 5. Triage of the 51 "new CLI flags"

[`_raw_asset_diff_193_to_220.md`](../00_overview/_raw_asset_diff_193_to_220.md) lists 51 new entries in
`cli_flags.json`. Its own header says *provenance only*. Having grepped each one in the 2.1.220 bundle and
read its first site, here is what they actually are. **Only 8 are new Claude Code CLI options.**

### 5.1 Genuinely Claude Code's own CLI (8)

| flag | line | owner |
|---|---|---|
| `--scaffold` | `:592289` | `claude plugin eval` — run each case's `scaffold_script` |
| `--no-scaffold` | `:592292` | `claude plugin eval` |
| `--keep-temp` | `:592297` | `claude plugin eval` — preserve scaffold dirs |
| `--publish-report` | `:592300` | `claude plugin eval` — publish the HTML report to claude.ai |
| `--interview` | `:592320` | `claude plugin eval init` — hidden alias for `-i/--interactive` |
| `--forward-subagent-text` | `:851029` | top-level; `--print` + `--output-format=stream-json` only |
| `--append-subagent-system-prompt` | `:329848`, `:329929` | inherited-flag list for spawned sessions |
| `--yes` | `:865376` | `claude auto-mode reset` (§1.4) |

Five of the eight belong to **one new subcommand group**, `claude plugin eval` — which no bullet in this
window mentions. Worth a note for [`45_skills`](../45_skills/): the eval harness supports cases, tags,
runs, `--judge-model` (default haiku), `--max-cost-usd` with a documented overrun bound, `--threshold`,
`--ablation with-without` (a no-plugin baseline arm), and an operator grant `--allow-tools` for gated tools.

### 5.2 Argv Claude Code *builds* for a sandbox helper (8) — not user-facing

`--cap-drop` (`:194106`, bubblewrap `--unshare-user --cap-drop ALL --proc /proc`), `--deny-read`
(`:195036`), `--deny-write` (`:195037`), `--proxy-port-range` (`:194907`), `--sandbox-user` (`:194908`),
`--sandbox-user-sid` (`:194946`), `--holder-pid` (`:194946`), `--srt-win` (`:195113`). These are options of
the Windows/Linux sandbox runtime helper (`acl stamp|restore|grant`), constructed by Claude Code. See
[`49_sandbox`](../49_sandbox/).

### 5.3 git / gh tokens (10)

Built into git argv by Claude Code, or recognised by its permission analyser:

`--end-of-options` (`:225648` `git branch -D --end-of-options <name>`; also `:496758`, `:497093`),
`--unset-all` (`:225915` `git config --local --unset-all extensions.worktreeConfig`),
`--get-all` (`:446238-446239`), `--no-textconv` (`:55748` etc.),
`--no-tags` (`:497120`), `--push-option` + `--receive-pack` (the `git push`
argument-consuming sets at `:223802` and `:443142`), and the `gh repo fork` trio
`--org` / `--fork-name` / `--remote-name` (`:443144`, §1.5).

`--end-of-options` is the most interesting of these as a *security* delta rather than a flag delta: `git
branch -D --end-of-options <name>` guarantees a branch named `-f` cannot be read as an option. That belongs
to [`36_background_agents`](../36_background_agents/) (worktree teardown) and
[`52_code_review`](../52_code_review/) (`:496758`, `:497093`).

### 5.4 Docker daemon-redirect tokens (3)

`--connection`, `--identity`, `--module` — all inside `hYr` at `:213932-213944`, the list of docker flags
that redirect the daemon (alongside `--host`, `--context`, `--config`, `--tlscacert`, `--tlscert`,
`--tlskey`, `--url`, `--remote`, `--out`). [`_false_delta_ledger.md`](../00_overview/_false_delta_ledger.md)
already attributes `--connection`/`--identity` to `.214` permissions.

### 5.5 Not flags at all — extractor false positives (19)

**CSS custom properties** from the embedded design-system / dataviz / artifact skill payloads:
`--accent` (`:362652` `cssVar('--accent', '#2563eb')`), `--ink`, `--ink-muted` (`:362653`),
`--muted`, `--grid`, `--ground` (`:786694`), `--sticky`, `--sticky-ink`, `--claude` (`:786696`
`--claude:#d97706; --sticky:#f4e187; --sticky-ink:#3b3320;`), `--fill-accent` (`:374081`),
`--surface` (`:591568`).

**Python/JS argparse options inside a bundled skill's helper script** (`:777117`, `:777442-777447`):
`--mode`, `--surface`, `--pairs`, `--ordinal` — these are `ap.add_argument(...)` calls in a chart-generation
script the dataviz skill ships, not Claude Code options.

**Substring artefacts:**

| "flag" | what it really matched |
|---|---|
| `--hand` | `--handle-uri` (`:166`) |
| `--hard` | `--hard-fail` (`:25022`, `process.argv.includes("--hard-fail")`) |
| `--line` | the CSS var `--line-porcelain` (`:213218`) |
| `--good` | the GitHub field `--good-first-issues` (`:213781`) |
| `--ui` | `for (var ui = this.scopeStack.length - 1; ui >= 0; --ui)` in vendored acorn (`:274036`) |

`--max-filesize` (`:447085`) is a **ripgrep** option in a secret-scanning invocation;
`--ignore-environment` (`:312656`) is an `env(1)` option the subagent env-scrub argv parser recognises;
`--on-branch` (`:321863`) is a code-review outcome-branch selector owned by
[`52_code_review`](../52_code_review/).

**Summary: 8 real Claude Code flags, 21 argv-we-construct-for-other-programs, 19 false positives, 3 owned
by other modules.** Anyone reading the asset diff as a feature list will over-count Claude Code's CLI
surface by roughly 6×.

---

## 6. Not covered

- `.211 #12` shell-mode `!` with the path popup open — `autocomplete` is 28/28 and I did not isolate the
  changed branch. The `/\s+$/` short-circuit at `:746495` is adjacent but I could not tie it to the bullet.
- `.212 #24` routines reporting a next-run in year 1 — `nextRun` / `year 1` are 0/0; pure date arithmetic.
- `.211 #32` / `.207 #24` `/usage-credits` confirmations — anchored at
  `tengu_usage_credits_admin_request_confirm_shown` (`:692741`, 220=1/193=0) but owned by
  [`55_auth_providers`](../55_auth_providers/).
- `.213`… there is no `.213`; the window skips it.
- `ctf()`, the fourth `/status` warning builder (see
  [`doctor_and_diagnostics.md`](doctor_and_diagnostics.md) §5).
- The `claude plugin eval` handler itself (`pluginEvalHandler`, dynamic import at `:592304`) — I read only
  the commander registration.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_slash_cli.md](../00_overview/symbol_additions_v2_1_220_slash_cli.md).

Key functions in this document:
- `peelDaemonSubcommandArgv` (`_Al`, `:130`) - skip-permission prefix then `daemon`
- `preParseAgentsArgv` (`$$n`, `:69`) - position-blind argv scan; ≡ `KZt` `:65 (193)`, carryover
- `agentsCommandHandler` (`G_E`, `:865007`) - gained the `t = {}` second parameter and the `.200` fix
- `preParseDispatchDefaults` (`rEE`, `:872154`) - strips `--model`/`--effort`/`--agent`/permission flags
- `isOnlyDebugFlags` (`s$m`, `:872134`) - fast-path guard; ≡ `KDc` `:718253 (193)`, carryover
- `setInlinePlugins` (`lNr`, `:3530`) / `setInlinePluginsNoMcp` (`cNr`, `:3536`) - write `Ot.inlinePlugins`
- `clearPluginCache` (`QI`, `:281306`) - labelled invalidation; the label is the anchor
- `setCliSessionConfigCarried` (`$$r`, `:2798`) / `cliCarriesSessionConfig` (`A4t`, `:592502`)
- `areSideloadFlagsDisabledByPolicy` (`uPt`, `:238011`) - `disableSideloadFlags`; **fast path only**
- `sideloadFlagsBlockedMessage` (`dPt`, `:238014`) - the managed-settings refusal text
- `printAndExit` (`R1`, `:545739`) - `stdout.write` + `process.exit(0)`; ends the `--json` branch
- `validateBackgroundLaunchArgv` (`$Gb`, `:683486`) - `--print`, bypass-disclaimer, auto-mode opt-in
- `emitReleaseNotesAsNotice` (`Zkn`, `:720265`) - `applyMessageOp` + `display: "skip"`
- `systemMessage` (`ml`, `:533218`) - `{type:"system", subtype:"informational", level}`
- `resetCostState` (`Att`, `:3114`) - zeroes ten cost/duration fields
- `flushSessionCostToDisk` (`PSi`, `:3111`) - invokes the registered saver
- `registerSessionCostSaver` (`DSi`, `:3108`) - late-bound persistence hook
- `btwCommandCall` (`eLb`, `:661737`) - bare `/btw` replays the last side question
- `getSideQuestionHistory` (`W3t`, `:652811`) - the `/btw` history array
- `deriveBranchNameFromMessages` (`nJd`, `:500107`) - array scan with `commandFallback`
- `extractPromptFromMessage` (`oxt`, `:49401`) - skips `isMeta` / `isCompactSummary` / tool-results
- `getGitPushShellPatterns` (`g5n`, `:55590`) - `git push <remote> *` for origin + default
- `resolveDefaultPushRemote` (`Tkh`, `:55575`) - `remote.pushDefault` if real, else sole remote
- `commitPushPrAllowedTools` (`Cl_`, `:449740`) - the `getAllowedTools` implementation
- `normalizePermissionModeAlias` (`fL`, `:58323`) - `manual` → `default`
- `PERMISSION_MODE_MANUAL_ALIAS` (`QOe`, `:58339`) - `"manual"`
- `permissionModeDisplayTable` (`dWl`, `:58495`) - titles, indicators, colors; `external` unchanged
- `permissionModeChoicesForHelp` (`Vyl`, `:833650`) - displayed list, `default`→`manual`
- `permissionModeChoicesAccepted` (`WlE`, `:833650`) - accepted set, both spellings
- `parkSessionAsNeedsInput` (`u5t`, `:700561`) - park a detached bg session for a UI-needing command
- `armUnparkOnAttach` (`xvf`, `:700574`) - clears the park when a terminal attaches
- `isDetachedBackgroundSession` (`eN`, `:112712`) - `isBackgroundSession() && !hasAttacher()`
- `markCommandParkBlocked` (`wHs`, `:335135`) / `clearCommandParkBlocked` (`THs`, `:335140`)
- `isFleetPastSessionsEnabled` (`SVr`, `:157287`) - env var or `tengu_fleet_past_sessions`
- `listPastSessionsForFleet` (`_cl`, `:801829`) - scan capped at `FKS = 200`
- `loginCommandDescriptor` (`rBd`, `:455393`) - gained `fleetHostCall`
- `commandDirectorySuggestionSet` (`wzo`, `:654321`) - `{"add-dir","cd"}`
- `formatUsageAsOfSuffix` (`Uof`, `:670406`) - `" as of <time>"`
