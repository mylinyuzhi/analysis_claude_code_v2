# `/doctor`, `claude doctor`, and `/status`: one diagnostic surface split into three

**Module:** `43_slash_commands` (part 2 of 3 — see [`README.md`](README.md))
**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js` (872,596 lines)
**Baseline:** `…/2.1.193/extract/cli_inner_pretty.js` — every count below is `220=N / 193=M`

`.205 #21` says *"`/doctor` is now a full setup checkup that can fix issues; `/checkup` is its alias."*
That single bullet hides a **three-way restructuring of the diagnostic surface**, and four later releases
(`.203`, `.206`, `.207`, `.210`, `.214`) are follow-on repairs to the seams it opened. This document walks
the whole surface.

The one-line summary: in 2.1.193 there was **one** diagnostic (an Ink dialog) reachable two ways. In
2.1.220 there are **three** distinct things —

| surface | 2.1.193 | 2.1.220 |
|---|---|---|
| `claude doctor` (terminal subcommand) | mounts the **same Ink dialog** in a throwaway React root (`:613206-613228 (193)`) | a **non-interactive text report** that prints and exits (`Ik.doctorHandler`, `:585240-585345`) |
| `/doctor` (slash command) | `type: "local-jsx"`, `immediate: !0`, `requires: { ink: !0 }` — an Ink dialog (`:504453-504461 (193)`) | `type: "prompt"` — a **~10-check LLM skill** with a 155-line instruction corpus (`:785698-785879`) |
| `/status` "System diagnostics" | `Swl()` = three async section builders (`:489571 (193)`) | `LAa()` = **four** builders, one of which now filters (`:666493`) |

---

## 1. `claude doctor` stopped being a UI

```javascript
// ============================================
// claudeDoctorSubcommand - commander registration, before and after
// Location: cli_inner_pretty.js:867754-867762  (and :714616-714628 (193))
// ============================================

// ORIGINAL 2.1.193 (for source lookup):
    e.command("doctor")
      .description("Check the health of your Claude Code auto-updater. Note: The workspace trust dialog is skipped and stdio servers from .mcp.json are spawned for health checks. Only use this command in directories you trust.")
      .action(async () => {
        let [{ doctorHandler: i }, { createRoot: a }] = await Promise.all([…]),
          l = await a(I1(!1));
        await i(l);                                    // handler receives a React root
      }),

// ORIGINAL 2.1.220 (for source lookup):
    e.command("doctor")
      .description("Check the health of your Claude Code installation. Reads settings files in the current directory without a trust prompt. For a full checkup that can also fix issues, run /doctor in a session.")
      .action(async () => {
        let { doctorHandler: i } = await Promise.resolve().then(() => (aC(), Ik));
        await i();                                     // handler takes nothing and writes stdout
      }),

// READABLE (for understanding):
    program.command("doctor")
      .description("Check the health of your Claude Code installation. Reads settings files in the current directory without a trust prompt. For a full checkup that can also fix issues, run /doctor in a session.")
      .action(async () => {
        const { doctorHandler: printInstallationDiagnostics } = await import("./cli/doctor");
        await printInstallationDiagnostics();          // builds string[], writes stdout, exit(0)
      }),

// Mapping: Ik.doctorHandler→printInstallationDiagnostics (:585240), aC→its module initialiser,
//          (193) createRoot/I1→the Ink root the old handler needed
```

Three things changed and each is a finding:

1. **No React root.** The 220 handler builds an array of strings, `Js(n.join("\n") + "\n")` at `:585328`,
   and `await _A(0)` (exit 0) at `:585344`. It is script-safe: `claude doctor | grep` now works.
2. **The security note inverted.** 193 warned that *"stdio servers from `.mcp.json` are spawned for health
   checks. Only use this command in directories you trust."* 220 says *"Reads settings files in the current
   directory without a trust prompt."* The MCP-spawning half is gone — consistent with `.196`'s security
   bullet about `claude mcp list/get` no longer spawning self-approved servers.
3. **It advertises the other surface.** `:585327`:
   `"For a full setup checkup that can also fix issues, run /doctor in a Claude Code session."`
   (**220=1 / 193=0** — the anchor `_scope_v200_205.md` recorded for `.205 #21`.) The reverse
   cross-reference lives in the subcommand's own `--help` text
   (`For a full checkup that can also fix issues` **220=1 / 193=0**).

### What the text report contains (`:585250-585340`)

`Running: <installationType> (<version>)` · `Commit:` (12-char SHA) · `Platform:` · `Package manager:` ·
`Path:` · `Invoked:` (only when it differs from the install path) · `Config install method:` ·
`Search:` (ripgrep, bundled vs system) · `Auto-updates:` · `Auto-update channel:` (`rc` is displayed as
`slow`) · `Last update attempt:` — then four optional blocks: **Invalid settings** (per-file, per-path,
with `Suggested fix:`), **Environment variables** (only `BASH_MAX_OUTPUT_LENGTH`,
`TASK_MAX_OUTPUT_LENGTH`, `CLAUDE_CODE_MAX_OUTPUT_TOKENS`, and only when invalid), **Multiple
installations found**, **Remote Control**, then either the warning list or
`"No installation issues found."` (**220=1 / 193=0**).

Every interpolated value goes through `tq` (`:585346-585348`):

```javascript
function tq(e) { return m_(CIp.stripVTControlCharacters(e)).replaceAll("`", ""); }
```

— strip ANSI, then strip backticks. **Why?** Because the report interpolates *filesystem paths and settings
strings* into text a user will paste into a terminal or an issue. Stripping VT sequences kills a path that
tries to repaint the terminal; stripping backticks kills the "paste this into your shell" command
substitution vector. This is the same never-inline instinct the `/doctor` prompt states explicitly at
`:785709`.

---

## 2. `/doctor` became a prompt command with an alias — and that is how `/checkup` works

**Trap first.** `grep '/checkup'` returns **220=0**, which is why a literal-only pass records `.205 #21` as
unanchored. The alias is not a slash-prefixed literal; it is a field on the command object:

```javascript
// ============================================
// doctorPromptCommand - /doctor as a bundled prompt skill
// Location: cli_inner_pretty.js:785855-785879
// ============================================

// ORIGINAL (for source lookup):
function Tim() {
  ou({
    name: "doctor",
    aliases: ["checkup"],
    isEnabled: () => !Z.DISABLE_DOCTOR_COMMAND,
    survivesBundledKillSwitch: !0,
    requires: { workspace: !0 },
    menuDescription: "Health-check your setup and fix issues: installation, unused extensions, duplicated or bloated memory files, slow hooks, updates, permissions",
    description: "Health-check the user's Claude Code setup and fix issues: … Use when the user asks for a doctor run, checkup, audit, tune-up, or cleanup of their Claude Code setup or configuration.",
    userInvocable: !0,
    disableModelInvocation: !0,
    progressMessage: "running checkup",
    async getPromptForCommand(e) {
      let t = gVS();
      if (e) t += `\n\n## Additional instructions from the user\n\n${e}`;
      return [{ type: "text", text: t }];
    },
  });
}

// READABLE (for understanding):
function registerDoctorCommand() {
  registerBundledPromptCommand({
    name: "doctor",
    aliases: ["checkup"],
    isEnabled: () => !env.DISABLE_DOCTOR_COMMAND,
    survivesBundledKillSwitch: true,          // stays available under disableBundledSkills
    requires: { workspace: true },
    menuDescription: "…",                     // short, for the slash menu
    description: "…",                         // long, for model retrieval (unused: see disableModelInvocation)
    userInvocable: true,
    disableModelInvocation: true,             // the model may NOT call /doctor
    progressMessage: "running checkup",
    async getPromptForCommand(userArgs) {
      let prompt = buildDoctorPrompt();
      if (userArgs) prompt += `\n\n## Additional instructions from the user\n\n${userArgs}`;
      return [{ type: "text", text: prompt }];
    },
  });
}

// Mapping: Tim→registerDoctorCommand, ou→registerBundledPromptCommand (:419629), gVS→buildDoctorPrompt (:785698)
```

Contrast 2.1.193 (`:504453-504461 (193)`), the whole thing:

```javascript
PSf = { name: "doctor",
        description: "Diagnose and verify your Claude Code installation and settings",   // 220=0 / 193=1
        isEnabled: () => !Be.DISABLE_DOCTOR_COMMAND,
        type: "local-jsx", immediate: !0, requires: { ink: !0 },
        load: () => Promise.resolve().then(() => (o0l(), n0l)) };
```

### How `aliases: ["checkup"]` actually resolves

The alias machinery is **carryover** — do not write it up as new:

| resolver | 2.1.220 | 2.1.193 |
|---|---|---|
| `matchesCommandNameOrAlias` | `qNy` `:346394` | `:581167 (193)` |
| tool-side twin | `qa` `:224020` | `:151096 (193)` |
| exact-first resolver | `Cv` `:346396` | same shape |
| typo suggester (flatMaps aliases) | `bpt` `:326569` | present |

```javascript
// :346394-346404
function qNy(e, t) { return e.name === t || Sd(e) === t || (e.aliases?.includes(t) ?? !1); }
function Cv(e, t) {
  let r;
  return (t.find((o) => { if (o.name === e) return !0; if (r === void 0 && qNy(o, e)) r = o; return !1; }) ?? r);
}
```

**Why the two-pass `find`?** `Cv` walks the list once, returning immediately on an exact `name` match but
only *remembering* the first alias match. So **a real command named `checkup` would beat `/doctor`'s
alias**, wherever it sat in the list. That ordering rule is what makes user- and plugin-defined commands
safe to add: they can never be shadowed by a built-in's alias.

### `survivesBundledKillSwitch` — the field that keeps `/doctor` alive when everything else is off

**220=2 / 193=0.** Both sites are the mechanism itself:

```javascript
// :419687-419698
  if (…, e.survivesBundledKillSwitch) vHd.add(i);
  P$s.push(i);
}
function M$s() {
  if (bV()) return P$s.filter((e) => vHd.has(e));
  return [...P$s];
}
// :162055-162057
function bV(e) { return Z.CLAUDE_CODE_DISABLE_BUNDLED_SKILLS || (e ?? eo()).disableBundledSkills === !0; }
```

**What it does:** when an admin sets `CLAUDE_CODE_DISABLE_BUNDLED_SKILLS` or `disableBundledSkills: true`,
every bundled prompt command disappears — *except* the ones in the `vHd` allow-set.

**Why this exists at all:** the `.205` redesign turned `/doctor` from a hard-coded dialog into a bundled
skill, which silently placed it under a pre-existing kill switch aimed at *content* skills (`claude-api`,
`dataviz`, the design-system bundle). An org that disabled bundled skills to control context cost would
have lost its support-diagnostic tool as a side effect. `survivesBundledKillSwitch` is the escape hatch,
and the fact that only **two** literals exist (the flag on `/doctor`, and the filter) means `/doctor` is
currently the *only* command that claims it.

**Trade-off:** the allow-set is a `Set` of the built objects (`vHd.add(i)`), keyed by identity, not by
name. That makes it impossible for an admin to extend or override — a deliberate choice, but it also means
the exemption is invisible in any settings surface.

### `disableModelInvocation: !0` and the retrieval description

The long `description` at `:785865` is written for a *model* ("Use when the user asks for a doctor run,
checkup, audit, tune-up, or cleanup…") — yet `disableModelInvocation: !0` forbids the model from calling
it. That is not a contradiction: the description still feeds the skill-listing text and the typo/intent
suggester, so a user typing `/audit` gets pointed at `/doctor`, but Claude cannot decide on its own to run
a nine-check audit that proposes settings writes. `disableModelInvocation` is **220=39 / 193=26** — the
field is carryover, its use here is new.

---

## 3. The prompt corpus: ten checks, and which changelog bullet each is

`gVS()` (`:785698-785853`) returns a single ~155-line markdown document. Its checks map one-to-one onto
this window's `/doctor` bullets:

| check | line | changelog bullet |
|---|---|---|
| Ground rules (propose→confirm→apply, ≤2 `AskUserQuestion`s) | `:785705` | `.205 #21` "can fix issues" |
| Key-scoped reads only / never-inline harvested values | `:785708-785709` | — (security posture, undocumented) |
| Transcript content is untrusted data | `:785710` | — |
| 0 — setup health (dup installs, PATH, broken settings, colliding agents) | `:785723-785731` | `.203 #35` (see §4) |
| 1 — unused skills / MCP servers / plugins | `:785733` | `.205 #21` |
| 2/3 — dedupe local CLAUDE.md, **trim checked-in CLAUDE.md** | `:785780-785784` | **`.206 #2`** |
| 4 — migrate always-loaded guidance into lazy skills | `:785781` | `.205 #21` |
| 5 — slow hooks | `:785786-785788` | `.205 #21` |
| 6 — context-heavy extensions | `:785790-785792` | `.205 #21` |
| 7 — version currency, **Homebrew cask channel** | `:785794-785803` | **`.206 #22`** |
| 8 — **auto mode as the default permission mode** | `:785805-785813` | **`.210 #13`** |
| 9 — pre-approve frequently denied read-only commands | `:785815-785824` | `.205 #21` |

### `.206 #2` — the CLAUDE.md-trimming check

Anchor: `derive from the codebase` **220=1 / 193=0**, at `:785865` in the command description and expanded
at `:785780-785784`. The instruction is unusually specific about what may be cut and what may not:

> cut content a session could **derive from the codebase** (directory layouts, tech-stack lists,
> architecture overviews) while keeping **gotchas, rationale, and non-standard conventions**

and it carries a safety rail (`:785782`) that reads like a post-mortem: *"never move a 'never do X' rule
into a lazy skill where it might not be loaded when it matters."* The destination taxonomy is
subdirectory-`CLAUDE.md` for scoped guidance, `.claude/skills/<name>/SKILL.md` for task workflows, root
file for universal constraints.

This is also the only check allowed to edit **checked-in** files, and the ground rule at `:785706` fences
it explicitly: *"Only the CLAUDE.md checks (3 and 4) may propose edits to checked-in files, applied as
ordinary working-tree edits the user reviews in `git diff` — never commit them yourself."*

### `.206 #22` — Homebrew installs compare against the cask channel

Anchor: `getHomebrewCaskName` **220=1 / 193=0** — but read it carefully, because it is **prompt text
naming a product function, not a new code path**:

> `Homebrew installs choose their channel by CASK NAME, not settings: the \`claude-code\` cask tracks
> stable and \`claude-code@latest\` tracks latest … (the channel resolution in src/cli/update.ts, via
> \`getHomebrewCaskName()\`)`  — `:785799`

The *implementation* it points at is **carryover**:

```javascript
// :539636-539645   (193 twins at :351945 / :351949)
function Rbr() { …; if (t.includes("/Caskroom/")) return (w(`Detected Homebrew cask installation: ${t}`), !0); return !1; }
function N2t() { return (process.execPath || process.argv[0] || "").match(/\/Caskroom\/([^/]+)\//)?.[1] ?? null; }
```

`Caskroom` is 220=5 / 193=3 and `claude-code@latest` is 220=7 / 193=5 — the two extra hits in each case are
the *prompt* mentioning them. **Verdict: `.206 #22` is a prompt-only delta.** The model is told to
replicate the product's cask-name logic (`which claude`, resolve symlinks, take the `/Caskroom/<name>/`
segment) and hit `https://formulae.brew.sh/api/cask/<cask-name>.json`, with a stated reason:
*"a stable-cask user reads as behind against the faster channel and a latest-cask user reads as up to date
against the lagging one."*

Note the injection guard in the same bullet — the channel string and the Caskroom segment are
settings/filesystem-sourced, so *"use it in the lookup only when it is exactly a known channel name — never
interpolate it unvalidated into the `npm view` command or the URL."*

### `.210 #13` — the auto-mode-default proposal no longer skips on Bedrock/Vertex/Foundry

Anchors: `make auto mode the default permission mode` **220=1 / 193=0** (`:785865`) and
`The provider is NOT a skip reason` **220=1 / 193=0** (`:785812`). The bullet is a *bugfix*, and the fix is
a sentence in the prompt:

> Skip gracefully … when: managed policy sets any `defaultMode`; or `permissions.disableAutoMode: "disable"`
> … appears in any settings scope. **The provider is NOT a skip reason: auto mode is provider-supported on
> every provider, 3P (Bedrock/Vertex/Foundry) included.** Per-model availability … is enforced by the CLI
> at startup and when switching providers or modes, not here — the fallback-with-notice in the proposal
> below already covers it.

This corroborates
[`_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md) §3's finding that
`disableAutoMode` is 7/7 carryover and that `.207`'s real delta was *default availability on
Bedrock/Vertex/Foundry*: `.207` made auto mode available there, and `.210` fixed the doctor check that had
not been told.

Check 8 also states the source restriction precisely, which is the clearest statement of it anywhere in the
bundle (`:785813`): *"an `\"auto\"` defaultMode in project `.claude/settings.json` or
`.claude/settings.local.json` is ignored as repo-controllable — only policy, user, and CLI-flag sources may
grant auto mode."* Compare the enforcement at `:63560`
(`only user/flag/managed settings may set classifier rules`) — see [`38_permissions`](../38_permissions/).

---

## 4. `.203 #35` — the startup "claude command missing or broken" warnings were **deleted**, not moved

`_scope_v200_205.md` and [`_false_delta_ledger.md`](../00_overview/_false_delta_ledger.md) both record this
bullet as **UNANCHORED**, on the grounds that the literal `claude command missing or broken` is absent from
both bundles. It is not absent — the changelog just rewords it. The literal is
`claude command at ${path} missing or broken`, and it is **220=5 / 193=5 carryover**
(`:541064`, `:541073`, `:541084`, `:541092`, `:541099`; 193 twins at `:353196`-`:353231`).

The delta is entirely in **who consumes those messages**, and it is provable by three literals that went to
zero:

| literal | 220 | 193 |
|---|---|---|
| `installBrokenMessages` | **0** | **8** |
| `installPathCount` | **0** | **4** |
| `install-message-` (the notification key prefix) | **0** | **1** |
| `"install-broken"` (the startup banner descriptor id) | **0** | **1** |
| `install check: ` | **1** | **0** |
| `checkInstall` (module export) | **2** | **0** |
| `Run claude install to repair the installation.` | **1** | **0** |

### Before: three consumers, two of them user-visible

```javascript
// 2.1.193 :683281-683306  — the startup effect
    aVe().then((r) => {
      let o = [], s = 0;
      (r.forEach((i, a) => {
        if (i.type === "error") { o.push(i.message); return; }                    // → red startup banner
        if (i.type === "path")  { s++; return; }                                  // → counter only
        let l = i.type === "alias" ? "medium" : "low";
        e({ key: `install-message-${a}-${i.type}`, text: i.message, priority: l, color: "warning" });  // → toast
      }), fL("install", s),
        t((i) => { … return { ...i, setupIssues: { ...a, installBrokenMessages: o, installPathCount: s } }; }));
// 2.1.193 :531832-531838  — the banner that rendered them
    (hxf = { id: "install-broken", tier: "warning", type: "warning",
             isActive: (e) => e.installBrokenMessages.length > 0,
             render: (e) => Pu.jsx(NNl, { messages: e.installBrokenMessages }) }),
```

### After: one consumer, and it is the debug log

```javascript
// ============================================
// reportInstallCheckResults - 2.1.220's replacement for the startup banner
// Location: cli_inner_pretty.js:815895-815902 (call site :815923)
// ============================================

// ORIGINAL (for source lookup):
function oZS(fdR) {
  let rZS = 0;
  for (const Bhm of fdR) {
    if (Bhm.type === "path") rZS++;
    else w(`install check: ${Bhm.message}`, { level: Bhm.type === "error" ? "error" : "info" });
  }
  KM("install", rZS);
}
…
        e7e().then(oZS).catch(xe));

// READABLE (for understanding):
function reportInstallCheckResults(results) {
  let pathIssueCount = 0;
  for (const issue of results) {
    if (issue.type === "path") pathIssueCount++;
    else debugLog(`install check: ${issue.message}`, { level: issue.type === "error" ? "error" : "info" });
  }
  recordInstallPathIssueCount("install", pathIssueCount);
}
…
        checkInstall().then(reportInstallCheckResults).catch(reportError);

// Mapping: oZS→reportInstallCheckResults, e7e→checkInstall (:541048), w→debugLog, KM→recordInstallPathIssueCount
```

No notification, no `setupIssues` write, no banner descriptor. Only the `path` count survives as a metric.

### Where they resurface

`checkInstall` is now imported by the **diagnostics gatherer** — the function behind both `claude doctor`
and `/status`:

```javascript
// :540023-540025, inside Lbr() = getInstallationDiagnostics
    { checkInstall: a } = await Promise.resolve().then(() => (Lmn(), _up));
  for (let y of await a())
    if (y.type === "error") s.push({ issue: y.message, fix: "Run claude install to repair the installation." });
```

**How it works, and why this shape:**
1. `Lbr()` (`:539994-…`) is the single source of `{ warnings: [{issue, fix}], … }` consumed by
   `claude doctor` (`:585250`, rendered at `:585323-585326`) and by `/status`'s `ftf()` (`:666102`,
   `:666115-666117`).
2. Only `type === "error"` rows are promoted; `path` and `alias` rows are not, because `Lbr` already emits
   its own PATH warnings at `:539925-539939` and would otherwise double up.
3. Every promoted row is given the *same* generic fix, `Run claude install to repair the installation.`,
   rather than the per-case fix the checker knows. That is a small regression in fidelity traded for one
   line of glue.
4. The import is **dynamic** (`await Promise.resolve().then(() => (Lmn(), _up))`), keeping the installer
   module out of the diagnostics module's static graph.

**Why delete the startup banner at all?** The five messages are produced by `e7e` (`:541048-541137`), which
runs `lstat`/`readlink`/`access` against the launcher and walks `$PATH`. A false positive — a custom
launcher wrapper, a symlink farm, an unusual `$PATH` — produced a **red warning on every single startup**
with no way to dismiss it. `.207`'s bullet (§6) shows exactly that scenario was real. Moving the output to
`/doctor` and `/status` converts a nag into a lookup, at the cost that a genuinely broken install is now
silent until asked about.

---

## 5. `.206 #20` — `/status` listed the same warning twice, and the fix is one `.filter`

This bullet is the **direct consequence** of §4 and its anchor is the change that resolves both.

```javascript
// ============================================
// statusInstallCheckSection / statusDiagnosticsSection / statusWarnings
// Location: cli_inner_pretty.js:666062-666063, :666101-666121, :666493-666494
// ============================================

// ORIGINAL 2.1.193 (for source lookup):
async function k3a() { return (await aVe()).map((t) => t.message); }              // :353868 (193) — ALL messages
async function R3a() { … e.warnings.forEach((r) => { t.push(r.issue); }); … }     // :353880 (193)
async function Swl() { return [...(await k3a()), ...(await R3a()), ...(await I3a())]; }   // :489571 (193)

// ORIGINAL 2.1.220 (for source lookup):
async function dtf() { return (await e7e()).filter((t) => t.type !== "error").map((t) => t.message); }   // :666062
async function ftf() { let e = await Lbr(), … (e.warnings.forEach((n) => { t.push(n.issue); }), …) }     // :666101
async function LAa() { return (await Promise.all([dtf(), ftf(), ptf(), ctf()])).flat(); }                // :666493

// READABLE (for understanding):
async function statusInstallCheckSection() {
  return (await checkInstall())
    .filter((issue) => issue.type !== "error")     // errors now arrive via getInstallationDiagnostics()
    .map((issue) => issue.message);
}
async function statusDiagnosticsSection() {
  let diag = await getInstallationDiagnostics(), lines = [], { errors } = getSettingsWithErrors();
  if (errors.length > 0) { … lines.push(`Found invalid entries in: ${files}.`); … }
  diag.warnings.forEach((wrn) => { lines.push(wrn.issue); });                     // includes checkInstall errors
  if (diag.hasUpdatePermissions === false) lines.push("No write permissions for auto-updates");
  return lines;
}
async function statusWarnings() {
  return (await Promise.all([statusInstallCheckSection(), statusDiagnosticsSection(),
                             statusProcessWrapperSection(), ctf()])).flat();
}

// Mapping: dtf→statusInstallCheckSection, ftf→statusDiagnosticsSection, ptf→statusProcessWrapperSection,
//          LAa→statusWarnings, e7e→checkInstall, Lbr→getInstallationDiagnostics, eAe→getSettingsWithErrors
```

**The bug, precisely.** `.203` added `checkInstall`'s errors into `Lbr().warnings` (§4). `/status` already
printed `checkInstall`'s *full* message list from a separate section. So from `.203` until `.206`, an error
row appeared **once from `dtf()` and once from `ftf()`** — the same string, two lines apart. The fix is the
five-token `.filter((t) => t.type !== "error")` at `:666063`.

**Why filter in `dtf` rather than stop pushing in `Lbr`?** Because `Lbr` is also what `claude doctor`
prints, and there the errors are wanted — `claude doctor` has no `dtf` equivalent. Filtering at the
*duplicating* consumer keeps the single-consumer surface complete. The alternative (dedupe the flattened
array in `LAa`) would have been string-equality-based and would silently swallow two genuinely distinct
warnings that happened to match.

Note also that `.206` grew a *fourth* section: `LAa` awaits four builders where 193's `Swl` awaited three.
`ptf()` (`:666065-666099`) is the `CLAUDE_CODE_PROCESS_WRAPPER` / self-exec reporting — see
[`36_background_agents`](../36_background_agents/).

---

## 6. `.207 #5` — the auto-updater stopped overwriting a custom launcher

Anchors, all **220>0 / 193=0**: `externally managed` (1, `:541307`),
`not created by the native installer` (4), `is not an npm shim` (1),
`skipped_external_launcher` (1), `Not replacing ` (1).

Two predicates decide whether `~/.local/bin/claude` belongs to Claude Code:

```javascript
// ============================================
// isNativeInstallerSymlink / isNpmShim - "did we create this launcher?"
// Location: cli_inner_pretty.js:539603-539621
// ============================================

// ORIGINAL (for source lookup):
async function Hbr(e) {
  if (Mt() === "windows") return !0;
  try {
    if (!(await kbr.lstat(e)).isSymbolicLink()) return !1;
    let r = await kbr.readlink(e);
    return QYe.resolve(QYe.dirname(e), r).includes(mj_);
  } catch (t) { return qt(t); }
}
async function Ibr(e) {
  let t = await kbr.realpath(e);
  return t.endsWith(".js") || t.includes("node_modules");
}
…  mj_ = QYe.sep + QYe.join("claude", "versions") + QYe.sep

// READABLE (for understanding):
async function isNativeInstallerSymlink(launcherPath) {
  if (platform() === "windows") return true;                       // Windows: assume ours (no symlinks)
  try {
    if (!(await fsp.lstat(launcherPath)).isSymbolicLink()) return false;
    let target = await fsp.readlink(launcherPath);
    return path.resolve(path.dirname(launcherPath), target).includes(VERSIONS_DIR_SEGMENT);
  } catch (err) { return isENOENT(err); }                          // missing == ours to create
}
async function isNpmShim(launcherPath) {
  let real = await fsp.realpath(launcherPath);
  return real.endsWith(".js") || real.includes("node_modules");
}

// Mapping: Hbr→isNativeInstallerSymlink, Ibr→isNpmShim, mj_→VERSIONS_DIR_SEGMENT ("/claude/versions/"),
//          Mt→platform, qt→isENOENT
```

Both are consulted at **three** decision points, always as `!(await Hbr(x)) && !(await Ibr(x).catch(() => !1))`:

| line | decision | outcome when externally managed |
|---|---|---|
| `:539920` | diagnostics | push a `{issue, fix}` warning (see below) |
| `:541030` | replace the launcher symlink | `w(…, {level:"warn"})` and return `"refused"` |
| `:541305` | garbage-collect old `versions/` builds | log `externally managed`, `$e("native_cleanup_versions","skipped_external_launcher")`, return |

**Why `catch(() => !1)` on the npm-shim check but not the symlink check?** `Ibr` calls `realpath`, which
throws on a dangling symlink or a permission error. Treating a throw as "not an npm shim" combined with
`Hbr` already having returned false makes the composite fail **closed** — unknown launcher ⇒ do not touch.
`Hbr` handles its own errors and deliberately returns `true` for `ENOENT`, because "there is no launcher"
means the installer is free to create one.

**The interesting second-order consequence**, spelled out in the diagnostics text (`:539922-539923`):

> `${u} was not created by the native installer (it is not a symlink into the versions/ directory), so
> auto-update leaves it untouched.`
> *Fix:* `If you put a launcher wrapper there on purpose, this is expected — new versions still install
> under $XDG_DATA_HOME/claude/versions, your launcher decides what runs, and **automatic version cleanup is
> disabled on this machine** (the installer cannot tell which version your launcher needs, so it keeps them
> all). To let Claude Code manage the launcher again, remove ${u} and run \`claude update\`.`

That is the `:541305` guard explained to the user: refusing to overwrite the launcher *forces* refusing to
delete old versions, because the launcher is now the only thing that knows which version is live. Disk
grows without bound. The message says so, which is the right call — a silent policy change plus unbounded
disk growth is a much worse bug than the one being fixed.

---

## 7. `.214 #36` — `/status` "System diagnostics" went blank when a shell-config path is a directory

`_scope_v211_214.md` recorded this UNANCHORED (`.zshrc` is 13/13, `shell-config` is 0/0). The fix is real
and is an `EISDIR` branch two frames deeper.

### The failure path, top to bottom

```
hBb()          :672966   LAa().catch(gBb)          gBb → []      ← swallows EVERYTHING
  LAa()        :666493   Promise.all([dtf, ftf, ptf, ctf])
    ftf()      :666102   await Lbr()
      Lbr()    :540022   await Sj_(t)
        Sj_    :539962   await Zcp()               (alias probe)
          Zcp  :538824   await Kzs()
            Kzs  :538808   for (path of Uht()) await kmn(path)     ← readFile on ~/.zshrc etc.
```

`Uht()` (`:538751-538767`) returns `{ zsh: $ZDOTDIR/.zshrc, bash: …, fish: …/config.fish }` — **paths it
never stats**. If any of them is a *directory* (`mkdir ~/.zshrc` is a real thing people do by accident, and
some dotfile managers create `~/.config/fish/config.fish` as a directory), `readFile` throws `EISDIR`.

### The leaf, before and after

```javascript
// ============================================
// readShellConfigLines - the EISDIR guard added in .214
// Location: cli_inner_pretty.js:538784-538792   (193 twin :351263-351271)
// ============================================

// ORIGINAL 2.1.193 (for source lookup):
async function DGt(e) {
  try { return (await qpt.readFile(e, { encoding: "utf8" })).split(`\n`); }
  catch (t) { if (Vo(t)) return null; throw t; }
}

// ORIGINAL 2.1.220 (for source lookup):
async function kmn(e) {
  try { return (await Tbr.readFile(e, { encoding: "utf8" })).split(`\n`); }
  catch (t) {
    if (ti(t)) return null;
    if (Hue(t)) return (w(`Skipping ${e}: path is a directory`, { level: "warn" }), null);
    throw t;
  }
}

// READABLE (for understanding):
async function readShellConfigLines(configPath) {
  try { return (await fsp.readFile(configPath, { encoding: "utf8" })).split("\n"); }
  catch (err) {
    if (isMissingOrUnreadablePath(err)) return null;                    // ENOENT/EACCES/EPERM/ENOTDIR/ELOOP/…
    if (isEISDIR(err)) return (debugLog(`Skipping ${configPath}: path is a directory`, { level: "warn" }), null);
    throw err;
  }
}

// Mapping: DGt/kmn→readShellConfigLines, Vo/ti→isMissingOrUnreadablePath, Hue→isEISDIR (:19649)
```

`path is a directory` is **220=1 / 193=0**. Crucially the *first* guard is unchanged:
`Vo` (`:8971 (193)`) and `ti` (`:19686`, backed by
`JVm = new Set(["ENOENT","EACCES","EPERM","ENOTDIR","ELOOP","ENAMETOOLONG","EROFS"])` at `:19809`) test the
**same seven codes**. `EISDIR` was simply not in the set — an easy omission, since `ENOTDIR` (a path
component is not a directory) *is* there and reads like its counterpart.

### The second, wider guard

`Kzs` (the alias scanner) also grew a `.catch`:

```javascript
// :538810-538814
    let n = await kmn(r).catch((o) => {
      if (dU(o) || P5(o) || tj_.has(Bt(o) ?? ""))
        return (w(`Skipping unreadable shell config ${r} during alias scan: ${le(o)}`, { level: "warn" }), null);
      throw o;
    });
```

`Skipping unreadable shell config` and `during alias scan` are both **220=1 / 193=0**. The tolerated set is
the union of three predicates: `dU` = `ti || isEISDIR || QVm{ENOSPC,EDQUOT,ENFILE,EIO}` (`:19710`),
`P5` = the eleven "weird kernel" codes (`:19690-19705`, `EDEADLK EINTR ENXIO ENODEV ECANCELED ENEEDAUTH
ESTALE EUNKNOWN UNKNOWN ENOMEM` + `Unknown system error*`), and
`tj_ = {EBUSY, EOPNOTSUPP, ENOTSUP, ENOMEM, ERR_FS_FILE_TOO_LARGE, ENOTCONN, EHOSTDOWN, EHOSTUNREACH, ETIMEDOUT}`
(`:538845-538855`).

**Why two layers?** The leaf guard handles the one code that has a *meaningful* message; the wrapper is a
blanket for the long tail of network-filesystem and container failures (`EHOSTUNREACH` on a dead NFS
mount, `ETIMEDOUT` on SMB, `EBUSY` on a Windows-mounted volume) where the right answer is always the same:
skip that file, keep scanning the others. Keeping them separate preserves a specific log line for the
common case while still failing open for the rest. `throw o` at the end means a genuinely unexpected error
still propagates — the layers narrow the swallow, they do not remove it.

### The swallow itself is carryover — say so

```javascript
// 220 :672963-672967          193 :498577
function gBb() { return []; }
function hBb() { return LAa().catch(gBb); }        // 193: return Swl().catch(Qyf);
```

Both builds turn any rejection into an empty section. **That is why the symptom was "blank" rather than a
crash**, and it is *not* what `.214` changed. A reader who greps for the blank-section behaviour will find
identical code in both builds and wrongly conclude nothing changed. The fix is at the leaf; the swallow is
the amplifier that made a single unreadable dotfile erase the whole panel — including the *other* three
sections, which had nothing to do with shell configs.

The section header itself, `System diagnostics`, is **220=1 / 193=1** (`:666592`) — another carryover
literal that proves nothing about this bullet.

---

## 8. Not covered

- `ctf()`, the fourth `/status` warning builder — I read `LAa`'s call but not the body.
- `Lbr()`'s remaining warning producers: `gj_`, `yj_`, `_j_`, `Sj_`, `vj_` (`:539976-540022`). I read the
  Linux glob-pattern warning (`vj_`, `:539979-539993`) and the native-PATH block (`:539915-539941`) only.
- Whether the `/doctor` prompt's nine checks are ever *executed* correctly — this is a model-facing
  instruction corpus, so its behaviour is not statically determinable from the bundle.
- `Ek`/`aC` — the module wrapper around `doctorHandler`; I confirmed the export shape from the commander
  registration only.
- `hasUpdatePermissions` (`:666118`) and the `Transcript retention cleanup is paused…` line (`:666111`),
  both of which appear in `ftf()` and belong to the updater / retention subsystems.

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
- `registerDoctorCommand` (`Tim`, `:785855`) - `/doctor` as a bundled prompt command with `aliases: ["checkup"]`
- `buildDoctorPrompt` (`gVS`, `:785698`) - the ~155-line ten-check instruction corpus
- `registerBundledPromptCommand` (`ou`, `:419629`) - builds a `type: "prompt"` descriptor and pushes it to `P$s`
- `getBundledPromptCommands` (`M$s`, `:419696`) - applies the `disableBundledSkills` kill switch
- `areBundledSkillsDisabled` (`bV`, `:162055`) - env var or `disableBundledSkills` setting
- `printInstallationDiagnostics` (`Ik.doctorHandler`, `:585240`) - the non-interactive `claude doctor` report
- `sanitizeDiagnosticValue` (`tq`, `:585346`) - strip VT sequences and backticks
- `getInstallationDiagnostics` (`Lbr`, `:539994`) - the shared `{warnings, …}` producer
- `checkInstall` (`e7e`, `:541048`) - launcher/PATH checks; exported at `:540570`
- `reportInstallCheckResults` (`oZS`, `:815895`) - debug-log-only startup consumer
- `statusInstallCheckSection` (`dtf`, `:666062`) - now filters `type !== "error"`
- `statusDiagnosticsSection` (`ftf`, `:666101`) - settings errors + `Lbr().warnings`
- `statusWarnings` (`LAa`, `:666493`) - four-builder aggregator
- `isNativeInstallerSymlink` (`Hbr`, `:539603`) - symlink into `…/claude/versions/…`
- `isNpmShim` (`Ibr`, `:539613`) - realpath ends `.js` or contains `node_modules`
- `readShellConfigLines` (`kmn`, `:538784`) - the new `EISDIR` branch
- `scanShellConfigsForClaudeAlias` (`Kzs`, `:538807`) - the new tolerant `.catch`
- `getShellConfigPaths` (`Uht`, `:538751`) - zsh/bash/fish paths, never stat'd
- `isEISDIR` (`Hue`, `:19649`) - `errorCode(e) === "EISDIR"`
- `getHomebrewCaskName` (`N2t`, `:539643`) - `/Caskroom/<name>/` segment (carryover)
- `isHomebrewCaskInstall` (`Rbr`, `:539636`) - carryover
