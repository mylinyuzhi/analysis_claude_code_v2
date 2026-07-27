# Plugin configuration, consent, and the `${user_config.*}` shell-injection fix

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). **Baseline:** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`
(718,679 lines), always tagged `(193)` when quoted.

The plugin subsystem got two security bullets in `.207` and one in `.195`, plus a cluster of loader and
lifecycle bugfixes spread across `.195`–`.218`. The through-line is **provenance**: in 2.1.193, a value
that reached a plugin's shell command or a plugin's enable state could come from a file committed to the
repository. Three separate changes in this window cut those paths.

> **Module boundary.** `41_hooks/` owns the hook *execution* pipeline. This document owns the
> `${user_config.*}` rejection **mechanism** and its monitor and MCP-`headersHelper` call sites, and
> quotes the hooks site only as one of the three consumers. At the time of writing
> `claude_code_v_2.1.220/analyze/41_hooks/` is **empty** — if it is later populated, its
> `${user_config.*}` section should link here for the shared predicate and vice versa.
> Agent-name validation (§6) also touches
> [`../53_subagent_limits/README.md`](../53_subagent_limits/README.md), which owns the spawn-side caps
> that a plugin-namespaced agent is charged against.

---

## 1. `.207` — `${user_config.*}` in shell-form commands is rejected

> *"Security: `${user_config.*}` references in shell-form plugin hook commands, plugin monitor commands,
> and MCP `headersHelper` commands are now rejected."*

**Verdict: NET_NEW predicate; two genuine removals and one never-existed.**

| Literal | 220 | 193 |
|---|---|---|
| `plugin hook references ${user_config.*} in shell-form command` (`:519971`) | 1 | 0 |
| `would be re-parsed by the shell` (`:519967`) | 1 | 0 |
| `plugin monitor command references ${user_config.*}` (`:764148`) | 1 | 0 |
| `Monitor commands cannot safely reference` (`:764147`) | 1 | 0 |
| `The substituted value would be passed to a shell` (`:764147`, `:268208`) | 2 | 0 |
| `read the value inside the helper script instead` (`:268208`) | 1 | 0 |

### 1.1 The shared predicate — and a textbook symbol-reuse trap

```javascript
// ============================================
// substituteUserConfig / referencesUserConfig - the substituter and the new detector
// Location: cli_inner_pretty.js:214407-214431
// ============================================

// ORIGINAL (for source lookup):
function sDt(e, t) {
  return e.replace(/\$\{user_config\.([^}]+)\}/g, (r, n) => {
    let o = t[n];
    if (o === void 0)
      throw Error(`Plugin option "${n}" isn't set. Open /plugin manage to configure it, or check that the plugin's userConfig schema declares "${n}".`);
    return String(o);
  });
}
function lor(e, t) {
  try {
    return sDt(e, t) !== e;
  } catch {
    return !0;
  }
}
function muo(e, t, r, n) {
  return e.replace(/\$\{user_config\.([^}]+)\}/g, (o, i) => {
    if (r[i]?.sensitive === !0) return `[sensitive option '${i}' not available in skill content]`;
    let s = t[i];
    if (s === void 0) return o;
    let a = String(s);
    return n ? n(a) : a;
  });
}

// READABLE (for understanding):
function substituteUserConfig(text, options) {                 // throws on an undeclared key
  return text.replace(/\$\{user_config\.([^}]+)\}/g, (_m, key) => {
    let value = options[key];
    if (value === undefined) throw Error(`Plugin option "${key}" isn't set. Open /plugin manage …`);
    return String(value);
  });
}
function referencesUserConfig(text, options) {                 // NEW in 2.1.220
  try { return substituteUserConfig(text, options) !== text; } // substitution changed it → it referenced one
  catch { return true; }                                       // threw = an UNSET reference → still a reference
}
function substituteUserConfigForSkillContent(text, options, schema, sanitize) {
  return text.replace(/\$\{user_config\.([^}]+)\}/g, (whole, key) => {
    if (schema[key]?.sensitive === true) return `[sensitive option '${key}' not available in skill content]`;
    let value = options[key];
    if (value === undefined) return whole;                     // leave the placeholder, don't throw
    return sanitize ? sanitize(String(value)) : String(value);
  });
}

// Mapping: sDt→substituteUserConfig, lor→referencesUserConfig, muo→substituteUserConfigForSkillContent
```

**Trap.** `function lor(` greps **220=1 / 193=1**, which looks like carryover. It is not: 193's `lor`
(`:591395 (193)`) is a *git-progress line filter* that strips `foo: 42% (10/24)` lines from stderr. The
identifier was reused for an unrelated declaration between builds — exactly
[`../_CONVENTIONS.md`](../_CONVENTIONS.md) §4 trap #1, and one of the cleanest examples of it in this
tree. The 193 counterparts of the *other* two functions do exist: `ibe` (`:279570-279579 (193)`) → `sDt`,
and `nOn` (`:279580-279588 (193)`) → `muo`, both byte-equivalent. **2.1.193 had the substituters and no
detector.**

**Why the detector is written as "substitute, then compare" rather than a regex test.** A regex
(`/\$\{user_config\./.test(text)`) would also flag a *literal* mention in, say, a comment that the shell
never expands. Round-tripping through the real substituter guarantees the detector and the enforcement
agree byte-for-byte: if `substituteUserConfig` would have changed the string, `referencesUserConfig` is
true, and there is no way for the two to drift. The `catch { return true }` closes the remaining hole —
an undeclared key makes the substituter throw, and a throwing reference is still a reference, so it must
be refused rather than allowed through on the technicality that no substitution occurred.

### 1.2 Site 1 — plugin hooks (a true removal)

```javascript
// 2.1.193, cli_inner_pretty.js:589407-589423  (inside the hook-command builder)
  if (l) {
    if (!(await Yu(l))) throw Error(`Plugin directory does not exist: ${l}` + …);
    if (c) C = DM(c);
    if (!_) {                              // _ = isExecForm
      if (b) { v = v.replaceAll("${CLAUDE_PLUGIN_ROOT}", …); … }
      if (C) v = ibe(v, C);                // <-- substitutes user_config INTO the shell string
    }
  }
```

```javascript
// 2.1.220, cli_inner_pretty.js:519960-519974
  if (l) {
    if (!(await ey(l))) throw Error(`Plugin directory does not exist: ${l}` + …);
    if (c) I = NW(c);
    if (!A && I) {                         // A = isExecForm, I = pluginOptions
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
```

The substitution line was **replaced by a throw**. The exec-form path is untouched: `:519976-519988`
still runs `sDt` on `command` and every `arg` (`if (I) Oe = sDt(Oe, I)`, `:519984`), because exec-form
arguments go to `execve` without a shell and therefore cannot be re-parsed.

**The remediation the error message offers already existed.** `CLAUDE_PLUGIN_OPTION_<KEY>` is
**220=3 / 193=2**: the settings-schema description (`:59400` / `:55176 (193)`) and the env-injection loop
(`:520003` / `:589452 (193)`) are both carryover; the third 220 hit is the new error text pointing at
them. So the fix is a pure *removal plus signposting* — nothing had to be built to make the safe path
available, which is presumably why it could ship as a point release.

### 1.3 Site 2 — plugin monitors (a true removal)

```javascript
// 2.1.193, cli_inner_pretty.js:642741-642755
function fZf(e, t) {
  let n = t.manifest.userConfig ? DM(fne(t)) : void 0,
    r = (o) => {
      let s = mne(o, t);
      if (n) s = ibe(s, n);                // <-- substitutes into the monitor's shell command
      return one(s).expanded;
    };
  return { name: e.name, command: r(e.command), description: e.description, when: e.when,
           pluginName: t.name, pluginRoot: t.path };
}
```

```javascript
// ============================================
// resolvePluginMonitor - monitor command resolution, with the .207 refusal
// Location: cli_inner_pretty.js:764143-764161
// ============================================

// ORIGINAL (for source lookup):
function nUS(e, t) {
  let r = t.manifest.userConfig ? NW(Eke(t)) : void 0;
  if (r && lor(e.command, r))
    throw new Lr(
      `Monitor "${e.name}" from plugin ${t.name} references \${user_config.*} in its command. The substituted value would be passed to a shell. Monitor commands cannot safely reference \${user_config.*}; have the monitor script read the value from a config file or prompt instead.`,
      "plugin monitor command references ${user_config.*}",
    );
  let n = (o) => {
    let i = Xbe(o, t);
    return g7(i).expanded;
  };
  return { name: e.name, command: n(e.command), description: e.description, when: e.when,
           pluginName: t.name, pluginRoot: t.path };
}

// READABLE (for understanding):
function resolvePluginMonitor(monitor, plugin) {
  let options = plugin.manifest.userConfig ? readPluginOptions(pluginKey(plugin)) : undefined;
  if (options && referencesUserConfig(monitor.command, options))
    throw new ClaudeError("Monitor \"…\" references ${user_config.*} in its command. …",
                          "plugin monitor command references ${user_config.*}");
  let expand = (s) => expandEnvVars(substitutePluginPathVars(s, plugin)).expanded;   // no user_config
  return { name: monitor.name, command: expand(monitor.command), description: monitor.description,
           when: monitor.when, pluginName: plugin.name, pluginRoot: plugin.path };
}

// Mapping: nUS→resolvePluginMonitor, fZf→(193 ancestor), lor→referencesUserConfig,
//          Xbe→substitutePluginPathVars (:214398, 193 twin mne :279561), g7→expandEnvVars,
//          NW→readPluginOptions, Lr→ClaudeError
```

**Monitors have no exec form.** The settings-schema description (`:59512`, byte-identical in 193) defines a
monitor as *"Shell command to run as a persistent background monitor … Runs in the session cwd"* — the
value is always handed to a shell. There is therefore no safe variant to redirect users to, and the error
message says so, offering an out-of-band workaround (config file or prompt) rather than a syntax change.
That asymmetry with the hooks message is the tell that the two sites were fixed with the threat model in
mind rather than by pattern-matching.

Failure handling is *per-monitor*: the caller `oUS` (`:764163-764175`) wraps each `nUS` call in a
`try/catch` and logs `plugin ${n.name}: failed to resolve monitor "${i.name}": ${s}` (`:764173`, 193 twin
`:642767 (193)`), so one rejected monitor does not take down the plugin's other monitors.

### 1.4 Site 3 — MCP `headersHelper` (**not** a removal — this is the honest correction)

```javascript
// 2.1.193, cli_inner_pretty.js:279780-279793   (the http/sse/ws arm of the plugin MCP resolver)
    case "sse": case "http": case "ws": {
      let p = { ...e };
      l = p.url;
      let f = i.length;
      if (p.url) p.url = u(p.url);
      if (((c = i.slice(f)), p.headers)) { let m = {}; for (…) m[g] = u(h); p.headers = m; }
      d = p;
      break;
    }
```

There is **no `headersHelper` handling at all**. 2.1.193 left the field exactly as written in
`plugin.json` — unexpanded, un-substituted. 2.1.220 adds a branch:

```javascript
// 2.1.220, cli_inner_pretty.js:268205-268216
      if (f.headersHelper)
        if (r && lor(f.headersHelper, r)) {
          if (((a = `headersHelper for MCP server '${i ?? "<unnamed>"}' references \${user_config.*}. The substituted value would be passed to a shell; read the value inside the helper script instead (e.g. from an env var set in the server's "env" block).`),
            n && o && i))
            n.push({ type: "mcp-config-invalid", source: t.source, plugin: o, serverName: i, validationError: a });
        } else {
          let g = Xbe(f.headersHelper, t),
            { expanded: y, missingVars: _ } = g7(g);
          (s.push(..._), (f.headersHelper = y));
        }
```

**So for `headersHelper` the changelog bullet over-states the change.** Nothing was removed, because
nothing was substituting. What actually shipped is a **new expansion capability** — `${CLAUDE_PLUGIN_ROOT}`,
`${CLAUDE_PLUGIN_DATA}`, `${CLAUDE_PROJECT_DIR}` and `${ENV_VAR}` are now expanded in `headersHelper`
(`Xbe` + `g7`, `:268213-268215`) — **with `${user_config.*}` carved out of it up front.** The dangerous
capability was declined at the moment the safe ones were granted. Framing this as a *fix* rather than a
*design decision* loses the interesting part.

Note also that this third site **does not throw**. It records a `mcp-config-invalid` entry and sets
`configError` (returned at `:268258` as `{ ...d, configError: a, configErrorReason: p }`), leaving
`headersHelper` unexpanded. `configError` is **220=14 / 193=5**, so this soft-failure channel itself grew
substantially in this window. The three-way split — hooks throw, monitors throw, MCP degrades — tracks who
can recover: a hook or monitor that cannot be built has no fallback, whereas an MCP server with a broken
`headersHelper` can still be surfaced in `/mcp` with its error attached.

---

## 2. `.207` — `pluginConfigs` is no longer read from project settings

> *"Security: `pluginConfigs` is no longer read from project-level `.claude/settings.json`."*

**Verdict: NET_NEW.** `a5g = ["userSettings", "flagSettings", "policySettings"]` **220=1 / 193=0** at
`:191083`; the reader `Yzr` **220=1 / 193=0** at `:191064`.

```javascript
// ============================================
// readTrustedPluginConfig - plugin options/mcpServers from trusted scopes only
// Location: cli_inner_pretty.js:191064-191083
// ============================================

// ORIGINAL (for source lookup):
function Yzr(e) {
  let t = new Set(wT()),
    r,
    n;
  for (let o of a5g) {
    if (!t.has(o)) continue;
    let i = Pr(o)?.pluginConfigs?.[e];
    if (i?.options) r = { ...r, ...i.options };
    if (i?.mcpServers) {
      n = n ?? {};
      for (let [s, a] of Object.entries(i.mcpServers)) n[s] = { ...n[s], ...a };
    }
  }
  return { options: r, mcpServers: n };
}
…
a5g = ["userSettings", "flagSettings", "policySettings"];

// READABLE (for understanding):
function readTrustedPluginConfig(pluginId) {
  let allowed = new Set(getAllowedSettingSources());     // respects allowedSettingSources policy
  let options, mcpServers;
  for (let scope of PLUGIN_CONFIG_SCOPES) {              // user → flag → policy; LAST WINS
    if (!allowed.has(scope)) continue;
    let cfg = readSettingsScope(scope)?.pluginConfigs?.[pluginId];
    if (cfg?.options) options = { ...options, ...cfg.options };
    if (cfg?.mcpServers) {
      mcpServers ??= {};
      for (let [name, server] of Object.entries(cfg.mcpServers))
        mcpServers[name] = { ...mcpServers[name], ...server };   // per-server shallow merge
    }
  }
  return { options, mcpServers };
}
var PLUGIN_CONFIG_SCOPES = ["userSettings", "flagSettings", "policySettings"];

// Mapping: Yzr→readTrustedPluginConfig, a5g→PLUGIN_CONFIG_SCOPES,
//          wT→getAllowedSettingSources (:57664), Pr→readSettingsScope (:63153)
```

### 2.1 What changed, precisely

2.1.193 read plugin config off the **merged effective settings**:

```javascript
// 2.1.193
:279505   let l = jo().pluginConfigs?.[e]?.options ?? {},
:279125   let r = jo().pluginConfigs?.[e]?.mcpServers?.[t],
:279602   let n = jo().pluginConfigs?.[e]?.options ?? {},
// where jo = Lr, :58428:  function Lr() { return lq().settings || {}; }   // fully merged, all scopes
```

`lq().settings` is the merge of `["userSettings", "projectSettings", "localSettings", "flagSettings",
"policySettings"]`. So a repository could ship `.claude/settings.json` containing
`pluginConfigs: { "some-plugin@mkt": { options: { … } } }` and those values would flow straight into
`${user_config.*}` substitution and into plugin MCP server definitions.

2.1.220 routes every *read* through `Yzr` (`:191106`, `:214447`, `:214452`) and drops
`projectSettings` **and** `localSettings` from the source list. Writes are unaffected and still target
`userSettings` explicitly (`:191139`, `:214346`, `:214358`) — that was already true in 193.

### 2.2 Why this scope list, and why `localSettings` went too

The bullet only mentions project settings, but the code removes **two** scopes. That is deliberate and
consistent with `.195` (§3): `.claude/settings.local.json` is nominally per-developer, but nothing stops a
repository from committing one. Both files can arrive over `git pull`; `~/.claude/settings.json`,
`--settings`, and managed policy cannot.

The three that survive are exactly the three that require an action outside the repository:

- `userSettings` — the user's own home-directory file;
- `flagSettings` — the `--settings` CLI flag, typed by whoever launched the process;
- `policySettings` — managed/enterprise settings, installed by an administrator.

Precedence is **last-wins** (`{ ...r, ...i.options }` in list order), so policy beats `--settings` beats
user — the inverse of the "more specific scope wins" rule that governs ordinary settings. For a security
control that is the right direction.

`wT()` (`:57664-57671`) is intersected in first: it filters `V$` (the full ordered scope list, `:57678`)
by `h0t()` (the `allowedSettingSources` policy) while force-adding `flagSettings` and `policySettings`.
So an administrator who narrows `allowedSettingSources` also narrows plugin config, and can never
accidentally lock themselves out of the policy channel.

The **same three-element list literal** appears at `:63681` (`H3r`, auto-mode rule sources — see
[`../38_permissions/auto_mode_availability_and_gating.md`](../38_permissions/auto_mode_availability_and_gating.md)),
`:267966` (`ahy`), and inline at `:280664` and `:280739` (§3). `"userSettings", "flagSettings",
"policySettings"` as a contiguous literal is **220=5 / 193=1** — the shape was invented once before this
window and generalised into a house pattern during it.

---

## 3. `.195` — external plugins enabled only by repo-controlled settings need install consent

> *"Security: external plugins enabled only by a project's `.claude/settings.json` now require explicit
> install consent on every loader path."*

**Verdict: NET_NEW gate + tightened predicate.** `onIndeterminate` **220=7 / 193=0**;
`plugin-not-installed` push sites **220=2 / 193=1**.

The scoping pass proposed `tengu_official_plugin_prompt_overrides` (220=3 / 193=0) as the anchor. **That is
a false anchor** — all three of its hits (`:284944`, `:284947`, `:284955`) are a GrowthBook payload that
overrides *prompt text* for official plugins, unrelated to consent.

### 3.1 The consent predicate, before and after

```javascript
// 2.1.193, cli_inner_pretty.js:479661-479664
  else if (!a) {
    let c = ["userSettings", "localSettings", "flagSettings", "policySettings"].some(
        (p) => _n(p)?.enabledPlugins?.[r] === !0,
      ),
```

```javascript
// 2.1.220, cli_inner_pretty.js:280737-280740
  else if (!a) {
    let d =
        ["userSettings", "flagSettings", "policySettings"].some((m) => Pr(m)?.enabledPlugins?.[n] === !0) ||
        (!hEe({ onIndeterminate: "tracked" }) && Pr("localSettings")?.enabledPlugins?.[n] === !0),
```

`projectSettings` was **already** excluded in 193 — that part of the bullet is carryover. The 220 delta is
that `localSettings` moved from an unconditional member of the trusted set to a **conditional** one:
it counts as consent only when `hEe({ onIndeterminate: "tracked" })` is false, i.e. when the local settings
file is *not* tracked by git.

```javascript
// ============================================
// isLocalSettingsRepoTracked - is .claude/settings.local.json committed to the repo?
// Location: cli_inner_pretty.js:535971-535981
// ============================================

// ORIGINAL (for source lookup):
function hEe({ onIndeterminate: e }) {
  if (!Jd()) {
    if (N4_() && YWe(gn(), gu) === v_.resolve(gn())) return !1;
    return !0;
  }
  let t = gn(),
    r = YUo?.cwd === t ? YUo.value : void 0;
  if (r === void 0) ((r = F4_()), (YUo = { cwd: t, value: r }));
  if (r === "indeterminate") return e === "tracked";
  return r === "tracked";
}

// READABLE (for understanding):
function isLocalSettingsRepoTracked({ onIndeterminate }) {
  if (!isInsideGitRepo()) {
    if (isHomeOrDotClaudeRoot() && …) return false;   // ~/.claude is never "repo-tracked"
    return true;                                      // outside a repo we cannot check → assume tracked
  }
  let cwd = getCwd(),
    cached = trackedCache?.cwd === cwd ? trackedCache.value : undefined;
  if (cached === undefined) { cached = probeGitTracked(); trackedCache = { cwd, value: cached }; }
  if (cached === "indeterminate") return onIndeterminate === "tracked";   // caller picks the safe side
  return cached === "tracked";
}

// Mapping: hEe→isLocalSettingsRepoTracked, Jd→isInsideGitRepo, F4_→probeGitTracked (:535993),
//          YUo→trackedCache, gn→getCwd
```

**The `onIndeterminate` parameter is the whole point.** `probeGitTracked` can return `"tracked"`,
`"untracked"`, or `"indeterminate"` (git unavailable, detached worktree, permission error). Rather than
baking a default, `hEe` makes each caller declare which way an unknown answer should fall — and this is
**220-only** (`onIndeterminate` 220=7 / 193=0). The plugin-consent callers pass
`onIndeterminate: "tracked"` (`:280665`, `:280740`, and also `:283009`, `:831033`, `:832174`), i.e.
*if we cannot tell, assume it is committed and demand consent*. `:323593` is the counter-example:
`gateLocal: hEe({ onIndeterminate: "untracked" })` — a different subsystem choosing the permissive side.
That is a well-designed API: the *policy* lives at the call site, the *probe* is shared and cached.

### 3.2 The second loader path

The bullet's *"on every loader path"* is literal. 2.1.193 had **one** `plugin-not-installed` refusal
(`:479677 (193)`); 2.1.220 has two. The new one is at `:280661-280679`:

```javascript
// ORIGINAL (cli_inner_pretty.js:280660-280679):
        let P = await fyy(E.plugins[b]);
        if (typeof H.entry.source !== "string" && !P) {
          if (
            !(
              ["userSettings", "flagSettings", "policySettings"].some((U) => Pr(U)?.enabledPlugins?.[b] === !0) ||
              (!hEe({ onIndeterminate: "tracked" }) && Pr("localSettings")?.enabledPlugins?.[b] === !0)
            )
          ) {
            let U = await kHe(b, H.entry.source, void 0, void 0, H.entry.version,
                              "sha" in H.entry.source ? H.entry.source.sha : void 0);
            if (!((await n_o(b, U)) ?? (U === "unknown" ? await o_o(b) : null)))
              return (i.push({ type: "plugin-not-installed", source: b, plugin: H.entry.name }), null);
          }
        }
```

`typeof H.entry.source !== "string"` is the **externality test**: a marketplace entry whose `source` is a
string is a *path relative to the marketplace directory* (resolved at `:280726`), i.e. a plugin that ships
inside a marketplace the user already installed. A structured `source` object (`{ source: "github"|"git"|
"url", … }`, carrying an optional `sha`) means the plugin body is fetched from **somewhere else**. Only
that case needs consent, and only that case is gated.

The check then asks whether a real install record exists on disk (`n_o` = a per-marketplace install-dir
probe, `:279599`; `o_o` = the unknown-version fallback, `:279608`) and refuses with `plugin-not-installed`
if not.
So the two paths differ in *what they do when consent is absent*: the earlier path (`:280677`) refuses
before resolution; the later one (`:280753`) refuses after failing to find a cached body. Both end in the
same error type, which is what makes the fix presentable as one bullet.

---

## 4. `.214` — plugins enabled via `--settings` did not load (regression since 2.1.181)

**Verdict: NET_NEW block, five lines.** `--settings` lands in the `flagSettings` scope, and the
`installed_plugins.json` reconciler simply did not look at that scope.

```javascript
// 2.1.193, cli_inner_pretty.js:477403-477425  (excerpt)
async function r0o() {
  let e = new Set(Object.entries(_n("policySettings")?.enabledPlugins || {})
        .filter(([d, p]) => d.includes("@") && p === !0).map(([d]) => d)),
    t = Mt(), n = new Map(), r = new Set();
  for (let d of oO) {                                    // oO = ["userSettings","projectSettings","localSettings"]
    …
    let m = _n(d)?.enabledPlugins || {};
    for (let g of Object.keys(m)) {
      if (!g.includes("@")) continue;
      let h = T0n(d);
      n.set(g, { scope: h, projectPath: h === "user" ? void 0 : t });
    }
  }
  for (let d of e) n.set(d, { scope: "managed", projectPath: void 0 });
```

```javascript
// ============================================
// syncInstalledPluginsFromSettings (excerpt) - the .214 flagSettings fold-in
// Location: cli_inner_pretty.js:277771-277789
// ============================================

// ORIGINAL (for source lookup):
  for (let f of C8) {
    let m = mg(f);
    if (m) { if (n.has(m)) continue; n.add(m); }
    let y = Pr(f)?.enabledPlugins || {};
    for (let _ of Object.keys(y)) {
      if (!Jue().safeParse(_).success) continue;
      let E = Euo(f);
      r.set(_, { scope: E, projectPath: E === "user" ? void 0 : t });
    }
  }
  let o = new Set();
  for (let [f, m] of Object.entries(Pr("flagSettings")?.enabledPlugins || {})) {
    if (m !== !0 || !Jue().safeParse(f).success || r.has(f) || YI(f)) continue;
    (r.set(f, { scope: "user", projectPath: void 0 }), o.add(f));
  }
  for (let f of e) (r.set(f, { scope: "managed", projectPath: void 0 }), o.delete(f));

// READABLE (for understanding):
  for (let scope of FILE_SETTING_SCOPES) {              // ["userSettings","projectSettings","localSettings"]
    let dedupeKey = settingsFileKey(scope);
    if (dedupeKey) { if (seen.has(dedupeKey)) continue; seen.add(dedupeKey); }
    for (let id of Object.keys(readSettingsScope(scope)?.enabledPlugins || {})) {
      if (!pluginIdSchema().safeParse(id).success) continue;      // was: id.includes("@")
      let mapped = mapScope(scope);
      wanted.set(id, { scope: mapped, projectPath: mapped === "user" ? undefined : repoRoot });
    }
  }
  let flagOnly = new Set();                                        // NEW in 2.1.220
  for (let [id, enabled] of Object.entries(readSettingsScope("flagSettings")?.enabledPlugins || {})) {
    if (enabled !== true                       // only explicit true
      || !pluginIdSchema().safeParse(id).success
      || wanted.has(id)                        // a real file scope already claimed it
      || isPluginDisabledByPolicy(id))         // managed policy explicitly says false
      continue;
    wanted.set(id, { scope: "user", projectPath: undefined });     // record it as a user-scope install
    flagOnly.add(id);
  }
  for (let id of policyRequired) { wanted.set(id, { scope: "managed", projectPath: undefined }); flagOnly.delete(id); }

// Mapping: Ggy→syncInstalledPluginsFromSettings, C8→FILE_SETTING_SCOPES (:57679),
//          Pr→readSettingsScope, Jue→pluginIdSchema, YI→isPluginDisabledByPolicy (:237995),
//          Euo→mapScope, r→wanted, o→flagOnly, e→policyRequired
```

Three design details worth naming:

1. **`flagSettings` entries are recorded as `scope: "user"`, not as a scope of their own.** There is no
   `"flag"` scope in `installed_plugins.json`. Recording them as `user` means the install survives into the
   next session even without the flag — which is arguably surprising, but it is the only way to reuse the
   existing on-disk schema. `flagOnly` is tracked separately so `:277817` can decide whether an
   authentication round-trip (`await UB()`) is needed, i.e. the set is used for *this run's* install work,
   not for persistence.
2. **`wanted.has(id)` gives file scopes priority.** A plugin already enabled in `userSettings`/
   `projectSettings`/`localSettings` keeps its real scope and `projectPath`; the flag cannot demote it.
3. **`isPluginDisabledByPolicy(id)` beats the flag.** `YI` (`:237995-237997`) reads
   `Pr("policySettings")?.enabledPlugins?.[e] === !1`. An administrator's explicit `false` cannot be
   overridden by `--settings`. And the final loop re-asserts `scope: "managed"` for policy-*required*
   plugins, deleting them from `flagOnly` so they are not treated as ephemeral.

A sub-delta rode along: the plugin-id test went from the string heuristic `id.includes("@")` (193) to a
real zod schema `Jue().safeParse(id).success` (220, five call sites in this function alone). That also
explains the two new `Skipping orphaned enabledPlugins entry …` debug lines at `:280654` and `:280657`.

---

## 5. `.205` — a failing plugin LSP server no longer blocks another plugin's valid server

> *"Fixed a plugin LSP server that fails to initialize preventing a valid LSP server from another plugin
> handling the same file extension."*

**Verdict: NET_NEW — and it is a two-statement reordering, with zero new literals.** Every string in this
function is byte-identical between builds (`missing required 'extensionToLanguage' field` 220=1/193=1;
`already handled by` 220=1/193=1; `Failed to initialize LSP server` **220=4/193=3** — the extra 220 hit at `:307227` is a NEW `Jee(...)` report call, so this cluster is not literal-free). A literal-count diff
finds nothing. The change is visible only in control flow.

```javascript
// 2.1.193, cli_inner_pretty.js:298338-298360
    for (let [S, H] of Object.entries(b))
      try {
        if (!H.command) throw Error(`Server ${S} missing required 'command' field`);
        if (!H.extensionToLanguage || Object.keys(H.extensionToLanguage).length === 0)
          throw Error(`Server ${S} missing required 'extensionToLanguage' field`);
        let v = Object.keys(H.extensionToLanguage);
        for (let x of v) {                                  // (1) CLAIM the extensions
          let I = x.toLowerCase();
          if (!t.has(I)) t.set(I, []);
          let k = t.get(I);
          if (k) {
            if (k.length > 0 && k[0] !== S)
              T(`LSP: extension ${I} already handled by "${k[0]}"; "${S}" will not be used for ${I} files`, { level: "warn" });
            k.push(S);
          }
        }
        let C = rva(S, H);                                  // (2) THEN build the client — may throw
        e.set(S, C);
      } catch (v) {
        (T(`Failed to initialize LSP server ${S}: ${v.message}`, { level: "error" }), (_ = !0));
      }
```

```javascript
// ============================================
// initializeLspServerRegistry (excerpt) - the .205 statement-order fix
// Location: cli_inner_pretty.js:307205-307230
// ============================================

// ORIGINAL (for source lookup):
    for (let [b, T] of Object.entries(E))
      try {
        if (!T.command) throw Error(`Server ${b} missing required 'command' field`);
        if (!T.extensionToLanguage || Object.keys(T.extensionToLanguage).length === 0)
          throw Error(`Server ${b} missing required 'extensionToLanguage' field`);
        let C = _Qu(b, T);
        e.set(b, C);
        let I = Object.keys(T.extensionToLanguage);
        for (let R of I) {
          let H = R.toLowerCase();
          if (!t.has(H)) t.set(H, []);
          let L = t.get(H);
          if (L) {
            if (L.length > 0 && L[0] !== b)
              w(`LSP: extension ${H} already handled by "${L[0]}"; "${b}" will not be used for ${H} files`, { level: "warn" });
            L.push(b);
          }
        }
      } catch (C) {
        let I = C;
        (Jee(I, "Failed to initialize LSP server"),
          w(`Failed to initialize LSP server ${b}: ${I.message}`, { level: "error" }), (A = !0));
      }

// READABLE (for understanding):
    for (let [serverId, config] of Object.entries(allServers))
      try {
        if (!config.command) throw Error(`Server ${serverId} missing required 'command' field`);
        if (!config.extensionToLanguage || Object.keys(config.extensionToLanguage).length === 0)
          throw Error(`Server ${serverId} missing required 'extensionToLanguage' field`);
        let client = createLspClient(serverId, config);   // (1) build FIRST — a throw here claims nothing
        clientsById.set(serverId, client);
        for (let ext of Object.keys(config.extensionToLanguage)) {   // (2) THEN claim the extensions
          let key = ext.toLowerCase();
          if (!serversByExt.has(key)) serversByExt.set(key, []);
          let list = serversByExt.get(key);
          if (list) {
            if (list.length > 0 && list[0] !== serverId)
              warn(`LSP: extension ${key} already handled by "${list[0]}"; "${serverId}" will not be used for ${key} files`);
            list.push(serverId);
          }
        }
      } catch (err) {
        reportError(err, "Failed to initialize LSP server");
        error(`Failed to initialize LSP server ${serverId}: ${err.message}`);
        anyFailed = true;
      }

// Mapping: _Qu→createLspClient, rva→(193 ancestor), e→clientsById, t→serversByExt, A/_→anyFailed,
//          Jee→reportError (220 only in this position)
```

**Why the order mattered.** The resolver is `c` (`:307244-307251`):

```javascript
function c(E) {
  let A = gze.extname(E).toLowerCase(), b = t.get(A);
  if (!b || b.length === 0) return;
  let T = b[0];
  if (!T) return;
  return e.get(T);            // head of the extension list, looked up in the CLIENT map
}
```

It takes **only `b[0]`** — the first server that claimed the extension — and never falls through to
`b[1]`. In 2.1.193, plugin A's broken server claimed `.foo` at step (1) and then threw at step (2), so it
was in `t.get(".foo")[0]` but never in `e`. Plugin B's working server, processed later, landed at
`t.get(".foo")[1]`. Every `.foo` lookup therefore returned `e.get(A) === undefined` — **no LSP at all**,
exactly the reported symptom. Swapping the two statements makes the throw happen before the claim, so the
extension list is never polluted by a server that does not exist.

**Why not make the resolver fall through instead?** Iterating `b` until a client is found would also work
and would be more robust. The chosen fix is smaller and preserves an invariant that the rest of the module
relies on: *the head of the extension list is the active server*. The `already handled by` warning at
`:307219`, the `lsp-extension-conflict` diagnostic (`PSo`, `:303731-303755`, 220=3/193=3 carryover) and the
`/plugin` validation message at `:266983` all assume that. A fall-through resolver would make "active
server" a function of runtime health rather than of registration order, and three other surfaces would
have to learn that.

The 220 catch block also gained `Jee(I, "Failed to initialize LSP server")` (`:307227`) — the failure is
now reported to the error channel, not only logged. `A = !0` still drives
`$e("lsp_config_load", "lsp_server_config_invalid")` (`:307231`) — carryover.

---

## 6. `.218` — agent markdown files reject names containing `:`

**Verdict: NET_NEW.** `reserved for plugin namespacing` **220=2 / 193=0**.

Two refusal sites, both added in this window:

```javascript
// cli_inner_pretty.js:269869-269873   (frontmatter validation error builder)
  if (!t || typeof t !== "string") return Ee('Missing required "name" field in frontmatter');
  if (t.startsWith("-")) return Ee('Invalid "name": names must not start with "-"');
  if (t.normalize("NFKC").includes(":"))
    return Ee('Invalid "name": names must not contain ":" (reserved for plugin namespacing)');
```

```javascript
// cli_inner_pretty.js:269954-269961   (the agent-file loader)
    if (i.normalize("NFKC").includes(":"))
      return (
        w(`Agent file ${N9e(e)} has invalid name '${N9e(i)}': names must not contain ':' (reserved for plugin namespacing)`,
          { level: "error" }),
        null
      );
```

Both sit immediately after the pre-existing `startsWith("-")` check, which is the 193 shape
(`:269887-269888` retains a third `-`-only variant in `XWu`, the settings-sourced agent loader, which was
*not* given a `:` check).

**The `NFKC` normalisation is the security-relevant part.** A bare `.includes(":")` would miss
U+FF1A FULLWIDTH COLON and the other compatibility variants that NFKC folds to `:`. Because `:` is the
plugin-namespace separator — `plugin:agent`, and the same convention for skills (`:270586` computes the
prefix as everything up to `lastIndexOf(":")`) and MCP (`<server>:<name>`, `:157802`) — an agent whose name
contains a look-alike colon could otherwise be addressed with a name that *renders* as a namespaced agent
while resolving to a local one. Normalising before the test closes the homoglyph path.

Note also `N9e(...)` wrapping both the file path and the name in the log message: names are attacker-
supplied text being written to a terminal, so they are sanitised before display.

**Cross-module:** the agent name is what `SendMessage`/`Agent` address, and the caps that a spawned agent
is charged against are documented in
[`../53_subagent_limits/README.md`](../53_subagent_limits/README.md). The `:`-rejection is upstream of all
of that — a rejected agent file returns `null` and never reaches the registry.

---

## 7. `.206` / `.203` — LSP-only plugins were flagged as disused

> `.206` — *"Fixed false 'disused plugin' tips and skewed disuse telemetry for LSP plugins."*

**Verdict: NET_NEW.** `pluginUsageLspGraceAppliedIds` **220=3 / 193=0** (`:214905`, `:214909`, `:214918`);
`serves code navigation` **220=1 / 193=0** (`:785743`).

```javascript
// ============================================
// applyLspDisuseGraceOnce - one-shot back-date so LSP-only plugins stop reading as unused
// Location: cli_inner_pretty.js:214904-214919
// ============================================

// ORIGINAL (for source lookup):
function hCu(e) {
  let t = xt().pluginUsageLspGraceAppliedIds;
  if (e.every((n) => t?.includes(n))) return;
  let r = Date.now();
  hr((n) => {
    let o = new Set(n.pluginUsageLspGraceAppliedIds),
      i = e.filter((a) => !o.has(a));
    if (i.length === 0) return n;
    let s = { ...n.pluginUsage };
    for (let a of i) {
      let l = s[a];
      if (!l || l.usageCount > 0) continue;
      s[a] = { ...l, lastUsedAt: r, lastUsedNumStartups: n.numStartups };
    }
    return { ...n, pluginUsage: s, pluginUsageLspGraceAppliedIds: [...o, ...i] };
  });
}

// READABLE (for understanding):
function applyLspDisuseGraceOnce(lspPluginIds) {
  let already = readConfig().pluginUsageLspGraceAppliedIds;
  if (lspPluginIds.every((id) => already?.includes(id))) return;      // fast path: nothing new
  let now = Date.now();
  updateConfig((cfg) => {
    let applied = new Set(cfg.pluginUsageLspGraceAppliedIds),
      fresh = lspPluginIds.filter((id) => !applied.has(id));
    if (fresh.length === 0) return cfg;                                // re-read under the lock
    let usage = { ...cfg.pluginUsage };
    for (let id of fresh) {
      let rec = usage[id];
      if (!rec || rec.usageCount > 0) continue;                        // only ever-unused records
      usage[id] = { ...rec, lastUsedAt: now, lastUsedNumStartups: cfg.numStartups };  // restart the clock
    }
    return { ...cfg, pluginUsage: usage, pluginUsageLspGraceAppliedIds: [...applied, ...fresh] };
  });
}

// Mapping: hCu→applyLspDisuseGraceOnce, xt→readConfig, hr→updateConfig
```

**What it does:** for every plugin that ships an LSP server and has *never* recorded a usage tick, resets
its "last used" timestamp and startup counter to now, exactly once per plugin per machine.

**How it works, and why each guard is there:**

1. `e.every(id => already?.includes(id))` is a **read-only fast path** that avoids taking the config write
   lock on every startup once the grace has been applied to all known LSP plugins.
2. The filter is recomputed **inside** the `updateConfig` mutator against the freshly-read config, so two
   concurrent CLI processes cannot double-apply.
3. `if (!rec || rec.usageCount > 0) continue` restricts the back-date to plugins with a *lifetime zero*.
   A plugin that has ever been used has a real timestamp and must not have it overwritten — the grace is
   for records that predate the counter, not a general amnesty.
4. `pluginUsageLspGraceAppliedIds` accumulates monotonically, so the grace is idempotent even if a plugin
   is later disabled and re-enabled.

The caller is `_Cu` (`:215055-215061`):

```javascript
  a = e.filter((l) => l.lspServers && Object.keys(l.lspServers).length > 0).map((l) => l.repository);
  if (a.length > 0) hCu(a);
```

— i.e. the grace is applied to exactly the LSP-providing plugins, immediately before the disuse
computation (`TYr`, `:215065-215068`, which derives `sessionsSinceLastUse` and `daysSinceLastUse` from the
two stamped fields).

**Why a back-date rather than an exemption?** Exempting LSP plugins from disuse entirely would make them
permanently un-reviewable, and the `/plugin` disuse review (`xCf`, `:710562`; telemetry
`tengu_plugin_disuse_review_action`, `:711130`) is a real user-facing feature. Back-dating instead says:
*the counter is now trustworthy; start measuring from here.* A genuinely unused LSP plugin still surfaces —
just one grace period later.

The companion is documentation, not code: the disuse-review prompt at `:785743` (**220=1 / 193=0**) now
tells the reviewing model that LSP counters *"measure value delivery rather than deliberate invocation,
and the tracking shipped recently, so a lifetime zero may just predate it"*, and that it is nonetheless the
**only** LSP signal because *"transcripts can't attribute LSP activity (diagnostics are persisted without
the server's name)"*. The adjacent paragraph (`:785744`) is the harder case — themes, output styles,
monitors and workflows have **no** usage signal at all — and it explicitly forbids the model from
concluding "not touching", requiring it to put the question to the user instead.

---

## 8. `.217` — the frontend-design plugin tip is capped at three lifetime impressions

**Verdict: DELTA — one added property.** `maxLifetimeShows` **220=6 / 193=3**. The framework is carryover;
only the field on this one tip entry is new.

```javascript
// 2.1.193, cli_inner_pretty.js:683021-683028
    {
      id: "frontend-design-plugin",
      priority: 1,
      providerAgnostic: !0,
      content: async (e) => `Working with HTML/CSS? Install the frontend-design plugin:\n${xo("suggestion", e.theme)(`/plugin install frontend-design@${KC}`)}`,
      cooldownSessions: 3,
      isRelevant: async (e) => fHc("frontend-design", e, { filesRead: ["**/*.html", "**/*.css", "**/*.htm"] }),
    },
```

```javascript
// 2.1.220, cli_inner_pretty.js:815590-815598   — identical except for ONE line
    {
      id: "frontend-design-plugin",
      priority: 1,
      providerAgnostic: !0,
      content: async (e) => `Working with HTML/CSS? Install the frontend-design plugin:\n${to("suggestion", e.theme)(`/plugin install frontend-design@${l1}`)}`,
      cooldownSessions: 3,
      maxLifetimeShows: 3,                              // <-- the whole .217 delta
      isRelevant: async (e) => Chm("frontend-design", e, { filesRead: ["**/*.html", "**/*.css", "**/*.htm"] }),
    },
```

The enforcing filter is unchanged carryover —
`.filter((l) => l.maxLifetimeShows === void 0 || WCr(l.id) < l.maxLifetimeShows)` at `:814944`, with the
193 twin at `:682407 (193)` — and 193 already used `maxLifetimeShows: 5` on two other tips
(`:682621 (193)`, `:682654 (193)`). The counter is `WCr` (`:675592-675594`),
`readConfig().tipLifetimeShownCounts?.[id] ?? 0`, also carryover.

So the *mechanism* is old and the *policy* is new: without the field, `cooldownSessions: 3` alone let this
tip reappear every fourth session forever. Three impressions is the same budget `.217` gave the other
new-in-this-window plugin tip at `:815512`. Note there is a sibling counter,
`pluginSuggestionShownCounts` (`yaf`, `:675595-675597`), which is a *different* ledger for the
`SuggestPluginInstall` tool surface — grepping either one alone will mislead.

---

## 9. Bullets in this theme I could not pin

Recorded honestly rather than guessed at. Each row lists the probes actually run in **both** bundles.

| Bullet | Probes (220 / 193) | Why unanchored |
|---|---|---|
| `.195` `/plugin` Enable/Disable broken when `plugin.json` `name` ≠ marketplace entry name | `plugin.json` 60/52; `marketplace` 855/816; `renamedTo` 5/5; `unqualifiedName` 12/6 | Both headline literals are massively pre-existing. `unqualifiedName`'s six new sites (`:340678`, `:340685`, `:499520`, `:709875`, `:710626`, `:710992`) all belong to the `.216` scoped-variant work, not to Enable/Disable. No enable/disable resolver diff isolated. |
| `.196` plugin dependency version pins ignored with a local-folder marketplace | `resolvedVersion` 10/10; `versionPin` 0/0; `pinnedVersion` 0/0; `tengu_plugins_sync_manifest_failed` 1/0 | `resolvedVersion` is exact-match carryover. `:280693` (`if (M && P?.resolvedVersion !== void 0) M.resolvedVersion = P.resolvedVersion`) and the dependency map at `:278961` are the plausible sites but I could not produce a 193 diff for either. |
| `.210` plugin cache writes leaving temp files; locked-file renames on Windows/NFS | `renameWithRetry` 0/0; `EXDEV` 10/8; `EPERM` 56/50; `.tmp` 73/36 | Two candidate mechanisms found, neither attributable: `Fbs` (`:278485-278492`) is a genuine remove-then-retry rename for `EPERM`/`EEXIST`/`EBUSY`, but it lives inside the net-new `tengu_plugin_binary_assets` module; and the retry code set `jue` (`:49993`, `["EXDEV","EPERM","EEXIST","EBUSY"]`) is byte-identical to 193's `SBe` (`:46613 (193)`). |
| `.216` skills/commands changed mid-session not appearing in the slash menu | `tengu_skills_sync_manifest_failed` 1/0 | Gate name confirmed net-new but its emission site was not read; no behavioural diff established. |
| `.206` SDK sessions losing `initialize`-defined agents after a plugin refresh | — | Owned by `51_headless_sdk`; no plugin-side literal. |
| `.210` plugin-provided MCP servers torn down on MCP re-sync | — | Owned by `39_mcp`. |

One incidental observation while reading the atomic-write helpers: `N4l(e, t) { return !1 }` at
`:49900-49902` is the retry predicate for `Gue`/`NLi` (`:49903`, `:49916`) and it is a **constant false**,
so those two helpers' retry loops can never iterate. That is dead machinery in the general
write-then-rename path — worth a look by whoever owns `50_performance`, but it is not the `.210` fix,
because the plugin cache does not route through it.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_skills_plugins.md](../00_overview/symbol_additions_v2_1_220_skills_plugins.md).

Key functions in this document:
- `referencesUserConfig` (`lor`, `:214417`) - the `.207` detector; **do not confuse with 193's `lor` at `:591395 (193)`**
- `substituteUserConfig` (`sDt`, `:214407`) - throwing substituter, carryover (`ibe` `:279570 (193)`)
- `substituteUserConfigForSkillContent` (`muo`, `:214424`) - sensitive-aware variant, carryover
- `resolvePluginMonitor` (`nUS`, `:764143`) - monitor resolution with the `.207` refusal
- `readTrustedPluginConfig` (`Yzr`, `:191064`) + `PLUGIN_CONFIG_SCOPES` (`a5g`, `:191083`) - the `.207` scope narrowing
- `isLocalSettingsRepoTracked` (`hEe`, `:535971`) - the `onIndeterminate` probe behind `.195` consent
- `isPluginDisabledByPolicy` (`YI`, `:237995`) - managed veto over `--settings`
- `syncInstalledPluginsFromSettings` (`Ggy`, `:277771`) - the `.214` `flagSettings` fold-in
- `initializeLspServerRegistry` (inner `a`, `:307192`) + `resolveLspClientForFile` (inner `c`, `:307244`) - the `.205` order fix
- `collectLspExtensionConflicts` (`PSo`, `:303731`) - carryover conflict diagnostic
- `applyLspDisuseGraceOnce` (`hCu`, `:214904`) + `computePluginDisuse` (`_Cu`, `:215055`) - the `.206` grace
- `readTipLifetimeShownCount` (`WCr`, `:675592`) - carryover counter behind `maxLifetimeShows`
- `validateAgentFrontmatterName` (`$hy`, `:269867`) / `loadAgentFromMarkdown` (`JWu`, `:269945`) - the `.218` `:` rejection
