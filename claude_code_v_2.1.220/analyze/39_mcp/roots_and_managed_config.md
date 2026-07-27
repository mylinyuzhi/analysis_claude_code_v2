# `roots/list`, managed allow/deny `${VAR}` resolution, and reserved server names

> **Type:** one NET-NEW protocol capability + one deep security rewrite + one carryover trap
> · **Versions:** `.196` `.203` `.205` `.219` · **Module:** `39_mcp/`
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`.
> Every `cli_inner_pretty.js:<line>` is a **2.1.220** line I read; baseline lines tagged `(193)`.
> Sections 1–3 and 5 are in the **shared** single-copy region; §4 is duplicated per runtime tree
> (see [`dual_mcp_runtime_trees.md`](./dual_mcp_runtime_trees.md)).

## TL;DR

| Bullet | Verdict | Anchor |
|---|---|---|
| `.203` #3 additional working dirs in `roots/list` + `roots/list_changed` | **NET-NEW.** 193 returned exactly one root and never sent the notification | `roots: { listChanged: !0 }` `:281499`; `omitted from roots/list` 220=2/193=0 |
| `.219` #19 managed allow/deny `${VAR}` from startup + managed-settings env | **NET-NEW, and far deeper than the bullet.** A whole unsafe-expansion detector was added | `policy expansion env` 220=2/193=0 `:281859`/`:281949`; `wildcardVars` 220=3/193=0 |
| `.205` #22 reserved the `Claude Browser` MCP server name | **NET-NEW — and so is `Claude Preview`.** Both literals are 0 in 193 | `:151628-151629`, `:289042` |
| `.196` #4 `claude mcp list`/`get` no longer spawn self-approved `.mcp.json` servers | **CARRYOVER.** 193 already skipped the health check for pending servers | `:611530 (193)` vs `:567559` |

The managed-policy work is the richest thing in this module: `allowedMcpServers` / `deniedMcpServers`
themselves are **220=23 / 193=23** and **17 / 15** — pure carryover keys — while the *evaluation* around
them was rebuilt with a deliberate fail-closed/fail-open asymmetry.

---

## 1. The shared `${VAR}` expander: three lookup tiers, two failure classes

```javascript
// ============================================
// expandEnvPlaceholders - ${VAR} / ${VAR:-default} expansion with missing- and wildcard-var tracking
// Location: cli_inner_pretty.js:267981-268005
// ============================================

// ORIGINAL (for source lookup):
function g7(e, t = process.env, r) {
  let n = [], o = [];
  return {
    expanded: e.replace(/\$\{([A-Za-z_][A-Za-z0-9_]*(?::-[^}]*)?)\}/g, (s, a) => {
      let l = a.indexOf(":-"), c = l === -1 ? a : a.slice(0, l), u = l === -1 ? void 0 : a.slice(l + 2), d = t[c];
      if (typeof d === "string") { if (iWu(d)) o.push(c); return d; }
      if (u !== void 0) return u;
      let p = r?.[c];
      if (typeof p === "string") { if (iWu(p)) o.push(c); return p; }
      return (n.push(c), s);
    }),
    missingVars: n,
    wildcardVars: o,
  };
}

// READABLE (for understanding):
function expandEnvPlaceholders(template, env = process.env, fallbackEnv) {
  let missingVars = [], wildcardVars = [];
  return {
    expanded: template.replace(PLACEHOLDER_RE, (whole, body) => {
      let sep = body.indexOf(":-"),
        name = sep === -1 ? body : body.slice(0, sep),
        inlineDefault = sep === -1 ? undefined : body.slice(sep + 2),
        primary = env[name];
      if (typeof primary === "string") { if (valueInjectsWildcard(primary)) wildcardVars.push(name); return primary; }
      if (inlineDefault !== undefined) return inlineDefault;            // ${VAR:-fallback} beats fallbackEnv
      let secondary = fallbackEnv?.[name];
      if (typeof secondary === "string") { if (valueInjectsWildcard(secondary)) wildcardVars.push(name); return secondary; }
      missingVars.push(name);
      return whole;                                                     // leave "${VAR}" in place -> cannot match
    }),
    missingVars, wildcardVars,
  };
}

// Mapping: g7→expandEnvPlaceholders, iWu→valueInjectsWildcard (:267971), n→missingVars, o→wildcardVars
```

**How it works — the ordering is load-bearing:**
1. **primary `env`** (the caller's map, defaulting to live `process.env`);
2. **inline `${VAR:-default}`** — deliberately *above* the fallback env, because an inline default is
   written in the same file as the pattern and is therefore the most local, most explicit intent;
3. **`fallbackEnv`** — a lower-trust map, only consulted for variables nobody defined;
4. **missing** — the placeholder is left **verbatim** in the output. That is the safe failure: a pattern
   containing a literal `${FOO}` will not match any real URL or command, so an *allowlist* entry with an
   unresolved variable silently admits nothing.

**`valueInjectsWildcard` (`iWu`, `:267971-267979`)** is the security tripwire on *values*:
`e.normalize("NFKC").includes("*") || /%2a/i.test(e)`, and if the value contains `%`, it retries after
`decodeURIComponent`. Three evasion routes are closed at once — a raw `*`, a percent-encoded `%2a`, and a
Unicode look-alike that NFKC folds to `*`. Any such variable is recorded in `wildcardVars`, which §3 turns
into a hard refusal.

**The 2.1.193 baseline** (`one`, `:270423-270437 (193)`) has the same regex and the same inline-default
handling, but **reads `process.env` directly** (`let l = process.env[i];`, `:270432 (193)`) with **no
injectable env, no fallback tier and no `wildcardVars`**. Everything in §2 and §3 is built on top of the
two parameters that were added here.

---

## 2. Which environment feeds a managed policy (`.219` #19)

```javascript
// ============================================
// buildPolicyExpansionEnv / buildPolicyExpansionEnvWithFallback
// Location: cli_inner_pretty.js:281837-281854
// ============================================

// ORIGINAL (for source lookup):
function t8u() {
  let e = {};
  for (let t of GQ()) for (let [r, n] of Object.entries(AMt(t.env))) e[r] ??= n;
  return { ...NQr(), ...e };
}
function Oyy() {
  let e = {};
  return (
    Object.assign(e,
      AMt(xt().env, "globalConfig"),
      pg("userSettings") ? AMt(Pr("userSettings")?.env, "userSettings") : {},
      AMt(Pr("flagSettings")?.env, "flagSettings"),
      AMt(Pr("policySettings")?.env, "policySettings")),
    { env: t8u(), fallbackEnv: e }
  );
}

// READABLE (for understanding):
function buildPolicyExpansionEnv() {
  let fromSettings = {};
  for (let source of getSettingsSourcesWithEnv())                       // GQ() :63159
    for (let [name, value] of Object.entries(expandSettingsEnvBlock(source.env)))
      fromSettings[name] ??= value;                                     // FIRST source wins
  return { ...getFrozenStartupEnv(), ...fromSettings };                 // settings OVERRIDE startup
}
function buildPolicyExpansionEnvWithFallback() {
  let fallback = {};
  Object.assign(fallback,
    expandSettingsEnvBlock(getGlobalConfig().env, "globalConfig"),
    isSettingsScopeTrusted("userSettings") ? expandSettingsEnvBlock(getSettings("userSettings")?.env, "userSettings") : {},
    expandSettingsEnvBlock(getSettings("flagSettings")?.env, "flagSettings"),
    expandSettingsEnvBlock(getSettings("policySettings")?.env, "policySettings"));
  return { env: buildPolicyExpansionEnv(), fallbackEnv: fallback };
}

// Mapping: t8u→buildPolicyExpansionEnv, Oyy→buildPolicyExpansionEnvWithFallback, GQ→getSettingsSourcesWithEnv,
//          AMt→expandSettingsEnvBlock (:267780), NQr→getFrozenStartupEnv (:267771), Pr→getSettings, pg→isSettingsScopeTrusted
```

### Decision: a frozen startup snapshot, not live `process.env`

```javascript
// :267771-267773
function NQr() { return ((dyo ??= Object.freeze({ ...process.env })), dyo); }
```

**What it does:** memoises a frozen copy of `process.env` the first time a policy needs it.

**Why this is the whole point of the bullet:** `process.env` is *mutable at runtime*. Claude Code itself
writes into it during startup (settings `env` blocks are applied to `process.env` at `:267847`), and hooks,
`apiKeyHelper`s and MCP stdio servers can perturb it. If a managed allowlist pattern like
`https://${CORP_HOST}/mcp` resolved against live `process.env`, then **anything that can set an
environment variable later in the process could change what the admin's allowlist means**. Freezing a
snapshot removes that entire class of escalation: the policy is evaluated against the environment as it was
at process start, plus settings-declared values, and nothing else.

`shy()` / `B_s()` (`:267774-267779`) can clear `dyo` — used when the process legitimately re-baselines
(e.g. a settings reload), which is the only sanctioned way the snapshot changes.

**Precedence inside `t8u`:** `{ ...NQr(), ...fromSettings }` means **settings win over the shell**. That is
the opposite of the usual "environment overrides config" instinct, and it is correct here: a *managed*
settings file is higher trust than the shell of whoever launched the CLI. Inside `fromSettings`, `??=`
means the **first** settings source encountered wins, so the iteration order of `GQ()` defines the
precedence chain.

### Decision: deny gets a fallback env, allow does not

The two evaluators, read at `:282089-282115` (`tdt`, deny) and `:282116-282164` (`ZFe`, allow):

```javascript
// deny  (:282094)
let { env: n, fallbackEnv: o } = Oyy(), …
  …  r8u(c, n, o).expanded  …                   // command patterns
  …  n8u(l.serverUrl, n, o).expanded  …         // url patterns  (unsafeExpansion IGNORED, :282111)

// allow (:282124)
let i = t8u(), …
  …  r8u(u, i).expanded  …                      // command patterns, NO fallback
  …  let { expanded: u, unsafeExpansion: d } = n8u(c.serverUrl, i);
     if (d) continue;                            // (:282148-282149) unsafe -> SKIP this allow entry
```

| | deny list | allow list |
|---|---|---|
| env map | `env` **+ `fallbackEnv`** | `env` only |
| unsafe expansion | **ignored** — the entry still matches | **skipped** — the entry cannot match |
| net effect of an ambiguous `${VAR}` | server is **denied** | server is **not admitted** |

**Why:** both choices push toward "no". Giving deny a *wider* env means a denylist entry still resolves
when a variable is only defined in a lower-trust settings scope — an admin's "never talk to this host"
should be hard to accidentally disarm. Denying allow entries the fallback, and dropping them outright when
their expansion is suspicious, means an admin's "only these hosts" cannot be *widened* by a value the
attacker controls. The warning text states the rule verbatim (`:281953`): *"allowlist URL entries using it
fail closed; denylist entries are unaffected"*.

**Ordering:** `ZFe` calls `tdt` first (`:282117`: `if (tdt(e, t)) return !1;`), so deny always beats allow.
And the shape of the allow evaluator is *pattern-kind-sensitive*: if any allow entry is a command pattern
(`n`) and the candidate is a stdio server, **only** command patterns are consulted and a bare
`serverName` entry cannot rescue it (`:282128-282143`); the same for URL patterns. That prevents a loose
name-only entry from admitting a stdio server whose command an admin meant to pin.

The `missingVars` diagnostic (`r8u`, `:281855-281862`) logs
*"MCP policy predicate references environment variable(s) not present in the policy expansion env: …"* —
this is the operator-facing half of the bullet, and the reason the message names the *policy expansion
env* specifically rather than "the environment": the whole point is that it is a different map from
`process.env`.

**Managed-only clamp (carryover):** `Vyy()` (`:282082-282085`) reads `allowedMcpServers` **only** from
`policySettings` when `s8u()` (the `strictMcpConfig`-style flag) is set, while `zyy()` (`:282086-282088`)
always merges deny from every source — documented at `:60972`: *"deniedMcpServers still merges from all
sources, so users can deny servers for themselves."* Same asymmetry, expressed at the settings layer.

---

## 3. The unsafe-expansion detector — a structural diff of two URL expansions

This is the deepest single mechanism in the module and no changelog bullet mentions it.

```javascript
// ============================================
// expandPolicyUrlPattern - expand a URL pattern and decide whether the expansion changed its STRUCTURE
// Location: cli_inner_pretty.js:281925-281956
// ============================================

// ORIGINAL (for source lookup):
function n8u(e, t, r) {
  let o = e.replace(/[\t\n\r]/g, "").replaceAll("*", zMt),
    i = g7(o, t, r),
    s = new Proxy({}, { get: (g, y) => (typeof y === "string" && Object.hasOwn(t, y) ? sSs(String(t[y])) : void 0) }),
    a = g7(o, s),
    l = c_o(i.expanded, zMt),
    c = c_o(a.expanded, zMt),
    u = l?.hostname ?? null,
    d = c?.hostname ?? null,
    p = a.expanded !== o,
    f = p ? Nyy(o, t) : new Map(),
    m =
      i.wildcardVars.length > 0 ||
      (p && Uyy(f, t)) ||
      (u === null) !== (d === null) ||
      (p && u === null) ||
      (l !== null && ((l.hash !== "" && (c?.hash ?? "") === "") || (l.search !== "" && (c?.search ?? "") === ""))) ||
      (p && Gyy(o, t)) ||
      (u !== null && ((u.includes("*") && !(d ?? "").includes("*")) || (u.endsWith(".") && !(d ?? "").endsWith(".")) || (u.includes(zMt) && !(d ?? "").includes(zMt))));
  if (i.missingVars.length > 0) w(`MCP policy predicate references environment variable(s) not present in the policy expansion env: ${i.missingVars.join(", ")}`);
  if (m) w(`MCP policy URL predicate expansion was unsafe — …`);
  return { expanded: i.expanded.replaceAll(zMt, "*"), unsafeExpansion: m };
}

// READABLE (for understanding):
function expandPolicyUrlPattern(pattern, env, fallbackEnv) {
  let masked = pattern.replace(/[\t\n\r]/g, "").replaceAll("*", ADMIN_WILDCARD_SENTINEL),
    real = expandEnvPlaceholders(masked, env, fallbackEnv),
    // expand a SECOND time with every value replaced by a structure-preserving placeholder
    neutralEnv = new Proxy({}, { get: (_, name) =>
      typeof name === "string" && Object.hasOwn(env, name) ? neutralizeValue(String(env[name])) : undefined }),
    neutral = expandEnvPlaceholders(masked, neutralEnv),
    realUrl = parseUrlLoose(real.expanded, ADMIN_WILDCARD_SENTINEL),
    neutralUrl = parseUrlLoose(neutral.expanded, ADMIN_WILDCARD_SENTINEL),
    realHost = realUrl?.hostname ?? null,
    neutralHost = neutralUrl?.hostname ?? null,
    didSubstitute = neutral.expanded !== masked,
    varPositions = didSubstitute ? classifyVarPositions(masked, env) : new Map(),
    unsafe =
      real.wildcardVars.length > 0                                   // (a) a value carried a wildcard
      || (didSubstitute && valueBreaksItsPosition(varPositions, env)) // (b) delimiter in scheme/authority slot
      || (realHost === null) !== (neutralHost === null)               // (c) parseability flipped
      || (didSubstitute && realHost === null)                         // (d) unparseable after substitution
      || (realUrl !== null && ((realUrl.hash !== "" && (neutralUrl?.hash ?? "") === "")
                            || (realUrl.search !== "" && (neutralUrl?.search ?? "") === "")))  // (e) gained ?/#
      || (didSubstitute && valueContainsDotSegment(masked, env))      // (f) ../ traversal
      || (realHost !== null && (( realHost.includes("*") && !(neutralHost ?? "").includes("*"))
                             || (realHost.endsWith(".") && !(neutralHost ?? "").endsWith("."))
                             || (realHost.includes(SENTINEL) && !(neutralHost ?? "").includes(SENTINEL))));  // (g) host shape changed
  if (real.missingVars.length > 0) log(`MCP policy predicate references environment variable(s) not present in the policy expansion env: …`);
  if (unsafe) log(`MCP policy URL predicate expansion was unsafe — …`);
  return { expanded: real.expanded.replaceAll(SENTINEL, "*"), unsafeExpansion: unsafe };
}

// Mapping: n8u→expandPolicyUrlPattern, sSs→neutralizeValue (:281863), c_o→parseUrlLoose (:281418),
//          Nyy→classifyVarPositions (:281870), Uyy→valueBreaksItsPosition (:281904),
//          Gyy→valueContainsDotSegment (:281912), zMt→ADMIN_WILDCARD_SENTINEL (:282869)
```

### Algorithm: differential expansion

**What it does:** decides whether substituting real environment values into an admin's URL pattern has
changed the pattern's *meaning* (its scheme/host/path structure) rather than just filling in a blank.

**How it works:**
1. **Mask the admin's own wildcards.** `replaceAll("*", zMt)` where
   `zMt = \`zzadminwc${randomBytes(8).toString("hex")}zz\`` (`:282869`) — a **per-process random**
   sentinel. Randomness matters: a fixed sentinel could be spelled by an attacker-controlled variable
   value, letting a value masquerade as an admin wildcard. Tabs/CR/LF are stripped first because a URL
   parser treats them as removable but a naive string compare does not.
2. **Expand twice.** Once with the real env; once through a `Proxy` whose `get` returns
   `neutralizeValue(realValue)` for every key the real env has (so *the same set of variables resolve*,
   with different content).
3. **`neutralizeValue` (`sSs`, `:281863-281868`) is shape-preserving, not value-preserving:**
   - a trailing run of dots is preserved and the prefix recursed (`example..` → `zzenvsubzz..`), because a
     trailing dot is meaningful in DNS;
   - a pure dotted-numeric value keeps its dot structure with every digit run → `0` (`10.0.0.1` → `0.0.0.0`),
     so an IPv4 literal stays an IPv4 literal;
   - a hex/colon value → `"::"`, so an IPv6 literal stays an IPv6 literal;
   - anything else → `$yy = "zzenvsubzz"` (`:282816`), an inert alphanumeric token.
   The point: the neutral expansion is what the URL would look like if the values were *boring*. Any
   structural difference between the two parses must have come from the *content* of a value.
4. **Parse both** with `parseUrlLoose` (`c_o`, `:281418-281432`), which tolerates a sentinel in the port
   position by rewriting `:sentinel` to `:0` before retrying `new URL()` — otherwise a legitimate
   `https://host:*/` pattern would be unparseable and flagged.
5. **Seven independent unsafe signals** (a)–(g) above. Each is a distinct attack: (a) wildcard injection;
   (b) a delimiter (`/@#?\` or whitespace, `Fyy` `:282870`; plus `:` for scheme-position vars, `Byy`)
   appearing in a value that sits in the scheme or authority slot; (c)/(d) the expansion becoming
   unparseable, or *becoming* parseable when it should not be; (e) a value smuggling in a `?` or `#`,
   which truncates everything after it in host-matching terms; (f) a `../` / `%2e%2e/` path traversal
   (`Gyy` `:281912-281924`, matching `jyy = /(^|\/)(\.|%2e)(\.|%2e)?(\/|$)/i` after `\`→`/` and `%2e`→`.`
   normalisation); (g) the *hostname* gaining a wildcard, a trailing dot, or a sentinel that the neutral
   host does not have.
6. **Position classification (`Nyy`, `:281870-281902`)** answers "where in the URL does this variable
   land?" by expanding the pattern once per variable with that variable replaced by a unique marker
   `zzv<i>zz` and asking the parsed URL which component contains the marker → `scheme` | `authority` |
   `rest`. Variables that land in `scheme` are computed first and then fed back as a set (`:281899-281901`),
   because a scheme-position variable changes where *every other* variable lands. `Uyy` (`:281904-281911`)
   then only enforces the strict delimiter set on `scheme`/`authority` variables and **skips `rest`** —
   a slash inside a path variable is harmless.

**Why differential expansion instead of a validating regex on values:** the question is not "is this value
suspicious" (unanswerable in general — `/` is legal in a path variable and fatal in a host variable) but
"did this value move the boundary between URL components". Comparing two parses answers exactly that, and
it keeps working as URL parsing evolves, because both sides go through the same parser.

**Trade-offs:** four `g7` expansions and up to N+2 URL parses per policy entry per evaluation — but this
runs on admin policy entries at connect time, not per tool call, so the cost is negligible. The
false-positive risk is real (an unusual but legitimate value can trip (b) or (e)); the code accepts it
because the failure is *fail-closed on the allow side only*, and the log message tells the admin exactly
how to fix it — including the specific remedy for the commonest mistake:

> *"a value restructured the URL, or the expansion is unparseable as a URL (e.g. a whole-URL `${VAR}`:
> rewrite as `https://${HOST}/path` — hostname-position variables are fully supported)"* (`:281953`)

**Key insight:** the sentinel is random per process, the neutralizer preserves *shape classes* rather than
values, and the position classifier is order-dependent. Any one of those three simplified away breaks the
guarantee. This is a genuinely careful piece of security code hiding behind a one-line changelog bullet
about `${VAR}` resolution.

---

## 4. `roots/list` and `notifications/roots/list_changed` (`.203` #3)

### The capability declaration changed

```javascript
// 220 :281497-281502
function Clr() {
  return { roots: { listChanged: !0 }, elicitation: {}, ...(HHe() && { tasks: { requests: { elicitation: { create: {} } } } }) };
}
// 193 :279918
return { roots: {}, elicitation: {}, ...(oOn() && { tasks: { requests: { elicitation: { create: {} } } } }) };
```

`roots: { listChanged: !0 }` is **220=1 / 193=0**. Protocol-wise this is the whole story: a client that
declares `roots.listChanged` is promising the server it will send
`notifications/roots/list_changed` when the root set changes. 2.1.193 declared `roots: {}` — it answered
`roots/list` but never promised, and never sent, updates. `Clr()` is **shared** and called from both
runtime trees (`:294862`, `:300404`), so the capability is identical in both arms.

### What the list contains now

```javascript
// ============================================
// getRootsListResponse - cwd + additional working directories (+ optional plugin staging root)
// Location: cli_inner_pretty.js:293418-293433 (v2) · v1 twin :298960-298975
// ============================================

// ORIGINAL (for source lookup):
function rYu(e = !1) {
  let t = [];
  if (e)
    try { t = [orr()]; }
    catch (o) { w(`MCP: staging root unavailable, omitted from roots/list: ${le(o)}`); }
  let r = new Set(), n = [];
  for (let o of [gn(), ...adt(), ...t]) {
    let i = LKu.pathToFileURL(o).href;
    if (r.has(i)) continue;
    (r.add(i), n.push({ uri: i }));
  }
  return { roots: n };
}

// READABLE (for understanding):
function getRootsListResponse(includeStagingRoot = false) {
  let staging = [];
  if (includeStagingRoot)
    try { staging = [ensurePluginToolStagingDir()]; }                       // may mkdir -> may throw
    catch (err) { log(`MCP: staging root unavailable, omitted from roots/list: ${formatError(err)}`); }
  let seen = new Set(), roots = [];
  for (let dir of [getCwd(), ...getAdditionalWorkingDirectories(), ...staging]) {
    let href = pathToFileURL(dir).href;
    if (seen.has(href)) continue;                                          // dedupe by file:// href
    seen.add(href); roots.push({ uri: href });
  }
  return { roots };
}

// Mapping: rYu→getRootsListResponse, orr→ensurePluginToolStagingDir (:166520), gn→getCwd (:2731),
//          adt→getAdditionalWorkingDirectories (:284573), LKu→node:url
```

The 2.1.193 equivalent is a one-liner (`Lpp`, `:292486-292488 (193)`):

```javascript
function Lpp() { return { roots: [{ uri: dAa.pathToFileURL(mr()).href }] }; }
```

**Design points:**
- **Dedupe by `file://` href, not by path string.** `pathToFileURL` normalises separators and percent-
  encodes, so `/a/b` and `/a/b/` and a Windows `C:\a` vs `c:\a` collapse correctly. Deduping raw paths
  would let the same directory appear twice and some servers treat duplicate roots as an error.
- **cwd is always first**, and `adt()` order is preserved, so a server that (incorrectly) treats the first
  root as primary keeps working.
- **The staging root is opt-in per server and best-effort.** `nYu` (`:293435-293443`) requires
  *not Windows*, a `pluginSource`, and the plugin's basename to be in `BAy = new Set(["documents"])`
  (`:294641`) — i.e. exactly one blessed plugin may see the plugin-tool staging directory. `orr()`
  (`:166520-166524`) *creates* the directory with mode `0o700`, so it can throw (read-only FS, quota); the
  `try/catch` degrades to "omit this root" with a log rather than failing the whole `roots/list` request.
  Failing the request would look to the server like a client that does not support roots at all.

### How the change notification is triggered

```javascript
// notifyMcpRootsListChanged  (UAy, :293444-293449; exported :292803)
function UAy() {
  for (let e of Ubo)
    e.sendRootsListChanged().catch((t) => { w(`MCP: failed to send roots/list_changed: ${le(t)}`); });
}
```

`Ubo` (`:294642`) is the live set of connected clients; every client is added at `:295206` and removed on
teardown (`:295204`). The single caller is the session state-diff watcher (`:568634-568641`):

```javascript
if (e.toolPermissionContext.additionalWorkingDirectories !== t.toolPermissionContext.additionalWorkingDirectories
    && O_o(e.toolPermissionContext))
  Promise.resolve().then(() => (G_(), j_))
    .then((a) => a.mcpClientModule().notifyMcpRootsListChanged())
    .catch((a) => { w(`Failed to notify MCP servers of roots change: ${_n(a).message}`); });
```

**Two-stage change detection, and why both stages are needed:**
1. an identity check on the `additionalWorkingDirectories` object (cheap, catches "nothing touched this");
2. `O_o` (`:284576-284581`) — sorts the directory *paths*, compares element-wise against the cached
   snapshot `xSs`, updates it and returns whether it actually changed. Stage 1 fires on any state clone;
   stage 2 is what stops a spurious notification when a set was rebuilt with the same contents. `O_o` is
   also the writer of the snapshot that `adt()` reads, so **the notification and the list are guaranteed
   consistent**: `rYu` cannot report a stale list after a notification, because the snapshot is updated
   before the notification is dispatched.

**The connect-time race guard (`:295206`):**

```javascript
if ((Ubo.add(y), adt() !== o)) y.sendRootsListChanged().catch(() => {});
```

`o = adt()` is captured at the *start* of `connectToServer` (`:294654`). If `/add-dir` ran while this
server was still connecting, the new client would have answered `roots/list` (if asked) with the old list
and then missed the broadcast — so it is sent a `list_changed` immediately on registration. Note the
identity comparison works precisely because `O_o` replaces the array wholesale rather than mutating it.

**Why fire-and-forget (`.catch(() => {})`):** a notification is advisory. A server that cannot receive it
will re-request `roots/list` on its own schedule, and blocking a connection on a notification failure
would turn a cosmetic problem into an outage.

---

## 5. Reserved server names: `Claude Preview` and `Claude Browser` (`.205` #22)

```javascript
// :151628-151634
var pkg = "Claude Preview", fkg = "Claude Browser", mkg, hkg, gkg;
var Lro = S(() => { ((mkg = El(pkg)), (hkg = El(fkg)), (gkg = new Set([mkg, hkg]))); });
// :151605-151607
function Ler(e) { return gkg.has(El(e)); }
// :151668-151670
function UIt(e, t) { return xY(e) || J_e(e) || Ler(e) || e === dWn; }
```

Both literals are **220=2 / 193=0**, and the normalised forms (`El` `:60201-60205` replaces
`[^a-zA-Z0-9_-]` with `_`, giving `Claude_Preview` / `Claude_Browser`) are **220=3 / 193=0**. So the
changelog's framing — *reserved "Claude Browser" **alongside** "Claude Preview"* — implies `Claude Preview`
was already reserved. **It was not, under this name.** Whatever the previous protection was, it was not
these literals.

`isReservedMcpServerName` (`UIt`) is the composite: claude-in-chrome (`xY`, `:151636`), computer-use
(`J_e`, `:151422`), the two host-surface names (`Ler`), or `dWn = "workspace"` (`:60372`). Its three call
sites refuse the name in three places: `claude mcp add` throws (`:282235`:
*"Cannot add MCP server "X": this name is reserved."*), the config validator skips with
`skipReason: "reserved_name"` (`:282646`), and a subagent/tool path checks it at `:344161`.

**A defect worth recording:** `UIt(e, t)` declares a second parameter and **never reads it**. The validator
computes `y = n === "dynamic" && Z.CLAUDE_CODE_REMOTE` and passes `{ hostCarrier: y }` (`:282645-282646`),
and `hostCarrier` is **220=1 / 193=0** — it appears exactly once, at the call site. So the intended
"host-carrier sessions may use the reserved name" (or the opposite) behaviour is **not implemented** in
2.1.220: the option is computed, passed, and dropped. Either dead scaffolding for a pending change, or a
bug. Do not describe `hostCarrier` as working.

### The security half: a permission-mode *floor* for these servers

```javascript
// ============================================
// resolveMcpPermissionMode - clamps bypass/auto modes for host-surface MCP servers
// Location: cli_inner_pretty.js:289015-289031
// ============================================

// ORIGINAL (for source lookup):
function nze(e, t) {
  let r = e?.mcpInfo?.serverName,
    n = r !== void 0 ? t.mcpPermissionModeOverrides?.[r] : void 0,
    o = t.mode === "bypassPermissions" || t.mode === "auto" || (t.mode === "plan" && t.isBypassPermissionsModeAvailable === !0);
  if (n !== void 0 && o) return n;
  if (o && r !== void 0 && AEy.has(r) && (K9u.has(r) ? t.previewClassifierFloorEnabled === !0 : t.chromeClassifierFloorEnabled === !0))
    return t.canAutoClassifierRun === !0 ? "auto" : "default";
  return t.mode;
}

// READABLE (for understanding):
function resolveMcpPermissionMode(toolUse, ctx) {
  let serverName = toolUse?.mcpInfo?.serverName,
    perServerOverride = serverName !== undefined ? ctx.mcpPermissionModeOverrides?.[serverName] : undefined,
    isPermissiveMode = ctx.mode === "bypassPermissions" || ctx.mode === "auto"
      || (ctx.mode === "plan" && ctx.isBypassPermissionsModeAvailable === true);
  if (perServerOverride !== undefined && isPermissiveMode) return perServerOverride;   // explicit wins
  if (isPermissiveMode && serverName !== undefined && HOST_SURFACE_SERVERS.has(serverName)
      && (PREVIEW_SERVERS.has(serverName) ? ctx.previewClassifierFloorEnabled === true
                                          : ctx.chromeClassifierFloorEnabled === true))
    return ctx.canAutoClassifierRun === true ? "auto" : "default";                     // floor: classifier, else ASK
  return ctx.mode;
}

// Mapping: nze→resolveMcpPermissionMode, AEy→HOST_SURFACE_SERVERS (:289043), K9u→PREVIEW_SERVERS (:289042)
```

with

```javascript
// :289042-289043
((K9u = new Set(["Claude Preview", "Claude Browser"])),
 (AEy = new Set(["claude-in-chrome", "Claude in Chrome", ...K9u])));
```

**The delta:** 2.1.193's `eWe` (`:288297-288308 (193)`) had **one** set (`gup = new Set(["claude-in-chrome",
"Claude in Chrome"])`, `:288316 (193)`) and **one** flag:
`if (o && n !== void 0 && gup.has(n) && t.chromeClassifierFloorEnabled === !0)`. 2.1.220 splits it into an
outer membership test over `AEy` (all four names) and an inner *flag selection*:
preview/browser servers consult the **new** `previewClassifierFloorEnabled` (**220=4 / 193=0**), the Chrome
names keep `chromeClassifierFloorEnabled` (**220=6 / 193=6**, carryover).

**Why reserving the name and flooring the mode are one feature:** these server names identify *host
surfaces* — a browser or a preview pane driven by Claude — whose tool calls act on content the user did not
author (web pages). Two protections are needed. (1) A user-configured server must not be able to *claim*
one of these names, or it would inherit the surface's trust; that is the reservation. (2) Even the real
surface must not run under `bypassPermissions`; that is the floor, which downgrades to `auto` (classifier
adjudicates) or `default` (human asked) — never to "just do it". Being able to roll the two surfaces'
floors independently is what the new flag buys: Chrome can be at one enforcement level while Preview is at
another.

**Ordering note:** the explicit per-server override (`mcpPermissionModeOverrides`, carryover 7/7) is
checked *before* the floor, so an operator can still opt a specific server out. That is the intended
escape hatch, and it is the reason the floor is expressed as a default rather than a hard clamp.

---

## 6. `.196` #4 — CARRYOVER, proven

The bullet: *"Security: `claude mcp list`/`get` no longer spawn self-approved `.mcp.json` servers."*

- The subcommand descriptions naming `⏸ Pending approval` are **byte-identical**: `:585701` / `:585713`
  (220) vs `:613560 (193)` / `:613572 (193)`.
- The status constant is carryover: `hvp = "⏸ Pending approval (run \`claude\` to approve)"` (`:567837`)
  vs `Gtc` (`:611810 (193)`).
- The **branch that prevents the spawn already existed.** 193's handler mapped each entry with
  `{ name: i, server: o[i] ?? a, status: n.has(i) ? Gtc : (await Utc(i, a)).status }` (`:611530 (193)`) —
  a pending server got the static label and `Utc` (the health check that connects) was never called.
  220 does the same at `:567559`: `let l = r.has(s) ? { status: hvp } : await pvp(s, a);`.
- `includePendingProjectServers` is **220=7 / 193=7** and `pendingProjectServers` **8 / 8**.

The only difference in the whole handler is 220's added `issue` field (see
[`errors_and_diagnostics.md`](./errors_and_diagnostics.md) §3), which is the `.219` bullet, not this one.
**Verdict: CARRYOVER.** If a real spawn path was closed in `.196`, it is not in the `list`/`get` handlers
or in any literal they contain; the most likely location is inside `Kj()`'s server-collection pass, where
no literal changed either.

---

## Cross-links

- [`errors_and_diagnostics.md`](./errors_and_diagnostics.md) — the validator that consumes `missingVars`
  and the empty-expansion result; the `claude mcp list` row.
- [`dual_mcp_runtime_trees.md`](./dual_mcp_runtime_trees.md) — §4's twin line numbers.
- 2.1.193 predecessors: [`../../../claude_code_v_2.1.193/analyze/39_mcp/server_name_suggestions.md`](../../../claude_code_v_2.1.193/analyze/39_mcp/server_name_suggestions.md),
  [`../../../claude_code_v_2.1.193/analyze/39_mcp/mcp_login_logout_cli.md`](../../../claude_code_v_2.1.193/analyze/39_mcp/mcp_login_logout_cli.md).
- Managed-settings neighbours: [`../38_permissions/`](../38_permissions/).
- [`README.md`](./README.md) — per-bullet ledger.

## Related Symbols

> Symbol mappings:
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (**MCP** home)
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - [../00_overview/symbol_additions_v2_1_220_mcp.md](../00_overview/symbol_additions_v2_1_220_mcp.md) - this window's MCP additions

Key functions/constants in this document:

- `expandEnvPlaceholders` (`g7`, `cli_inner_pretty.js:267981`) - 3-tier `${VAR}` expander with `wildcardVars`.
- `valueInjectsWildcard` (`iWu`, `cli_inner_pretty.js:267971`) - `*` / `%2a` / NFKC-folded wildcard detector.
- `PLACEHOLDER_SOURCE` (`j_s`, `cli_inner_pretty.js:268008`) - the `${VAR}` regex source string.
- `getFrozenStartupEnv` (`NQr`, `cli_inner_pretty.js:267771`) - memoised frozen `process.env` snapshot.
- `expandSettingsEnvBlock` (`AMt`, `cli_inner_pretty.js:267780`) - settings `env` block minus colour vars.
- `buildPolicyExpansionEnv` (`t8u`, `cli_inner_pretty.js:281837`) - startup snapshot + settings envs.
- `buildPolicyExpansionEnvWithFallback` (`Oyy`, `cli_inner_pretty.js:281842`) - adds the deny-only fallback map.
- `expandPolicyString` (`r8u`, `cli_inner_pretty.js:281855`) - non-URL patterns + missing-var warning.
- `expandPolicyUrlPattern` (`n8u`, `cli_inner_pretty.js:281925`) - differential expansion + `unsafeExpansion`.
- `neutralizeValue` (`sSs`, `cli_inner_pretty.js:281863`) - shape-preserving placeholder generator.
- `classifyVarPositions` (`Nyy`, `cli_inner_pretty.js:281870`) - scheme / authority / rest per variable.
- `valueBreaksItsPosition` (`Uyy`, `cli_inner_pretty.js:281904`) - delimiter check for scheme/authority vars.
- `valueContainsDotSegment` (`Gyy`, `cli_inner_pretty.js:281912`) - `../` / `%2e` traversal check.
- `parseUrlLoose` (`c_o`, `cli_inner_pretty.js:281418`) - sentinel-tolerant URL parse.
- `ADMIN_WILDCARD_SENTINEL` (`zMt`, `cli_inner_pretty.js:282869`) - per-process random `zzadminwc<hex>zz`.
- `NEUTRAL_VALUE_TOKEN` (`$yy`, `cli_inner_pretty.js:282816`) - `"zzenvsubzz"`.
- `AUTHORITY_DELIMITERS` (`Fyy`) / `SCHEME_DELIMITERS` (`Byy`) (`cli_inner_pretty.js:282870`).
- `DOT_SEGMENT_RE` (`jyy`, `cli_inner_pretty.js:282871`).
- `isMcpServerDenied` (`tdt`, `cli_inner_pretty.js:282089`) - deny evaluation, fallback env, ignores unsafe.
- `isMcpServerAllowed` (`ZFe`, `cli_inner_pretty.js:282116`) - allow evaluation, fail-closed on unsafe.
- `getAllowlistSettingsSource` (`Vyy`, `cli_inner_pretty.js:282082`) - managed-only clamp.
- `getClientCapabilities` (`Clr`, `cli_inner_pretty.js:281497`) - now declares `roots.listChanged`.
- `getRootsListResponse` (`rYu`, `cli_inner_pretty.js:293418`) - cwd + additional dirs + staging.
- `shouldIncludeStagingRoot` (`nYu`, `cli_inner_pretty.js:293435`) - non-Windows + blessed plugin only.
- `notifyMcpRootsListChanged` (`UAy`, `cli_inner_pretty.js:293444`) - fan-out over connected clients.
- `CONNECTED_MCP_CLIENTS` (`Ubo`, `cli_inner_pretty.js:294642`) - the notification target set.
- `STAGING_ROOT_PLUGINS` (`BAy`, `cli_inner_pretty.js:294641`) - `Set(["documents"])`.
- `getAdditionalWorkingDirectories` (`adt`, `cli_inner_pretty.js:284573`) - the snapshot `roots/list` reads.
- `updateAdditionalWorkingDirsSnapshot` (`O_o`, `cli_inner_pretty.js:284576`) - sorted diff + snapshot write.
- `ensurePluginToolStagingDir` (`orr`, `cli_inner_pretty.js:166520`) - creates the 0700 staging dir.
- `isReservedMcpServerName` (`UIt`, `cli_inner_pretty.js:151668`) - composite reservation; ignores its 2nd arg.
- `isHostSurfaceServerName` (`Ler`, `cli_inner_pretty.js:151605`) - `Claude Preview` / `Claude Browser`.
- `HOST_SURFACE_NAME_SET` (`gkg`, `cli_inner_pretty.js:151634`) - normalised reserved-name set.
- `normalizeMcpServerName` (`El`, `cli_inner_pretty.js:60201`) - `[^a-zA-Z0-9_-]` → `_`.
- `resolveMcpPermissionMode` (`nze`, `cli_inner_pretty.js:289015`) - the classifier floor.
- `PREVIEW_SERVERS` (`K9u`, `cli_inner_pretty.js:289042`) - `Set(["Claude Preview","Claude Browser"])`.
- `HOST_SURFACE_SERVERS` (`AEy`, `cli_inner_pretty.js:289043`) - the four names the floor applies to.
