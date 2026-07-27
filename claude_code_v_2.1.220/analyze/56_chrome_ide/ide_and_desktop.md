# IDE, Claude Desktop and Cowork host deltas

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). Baseline `.../2.1.193/extract/cli_inner_pretty.js`, always tagged `(193)`.

Claude Code runs inside several *hosts* — the VS Code extension, JetBrains, Claude Desktop, Cowork
(claude.ai's local-agent surface), and the Agent SDK. This document covers the changelog bullets
about those hosts. It is a mixed bag by design: **five of the eleven are not in this bundle at all**,
and saying so precisely is more useful than manufacturing anchors.

---

## 0. Host taxonomy in the 2.1.220 bundle

The entrypoint display map at `:46385-46396` is the cleanest single view of what "host" means here:

```javascript
    case "remote_mobile":            return "Mobile";
    case "local-agent":
    case "remote_cowork":            return "Cowork";        // :46388-46389
    case "claude_in_slack":
    case "claude-in-slack":          return "Claude Tag in Slack";
    case "claude-in-teams":          return "Claude Tag in Teams";
    case "claude-code-github-action": …
```

Note that **`local-agent` and `remote_cowork` are the same product surface** with two entrypoint
names — one for the VM-hosted variant and one for the local-agent variant. `isCoworkEntrypoint`
(`:46413`) is `Z.CLAUDE_CODE_ENTRYPOINT === "remote_cowork"`, and there is a separate boolean env var
`CLAUDE_CODE_IS_COWORK` (accessor `:32129`, declared `:32593` as `De.bool()`, read at `:270469` and
`:326801`). Two different signals for "am I Cowork" is itself a hint that the `.205` login bullet
(§4) is a plumbing bug rather than an auth bug.

---

## 1. The VS Code bullets are not in this bundle

Three bullets in this window are tagged `[VSCode]`:

| Bullet | Ver | Probe | Verdict |
|---|---|---|---|
| Settings toggle "Enable Remote Control for all sessions" | `.203` | `Enable Remote Control for all sessions` 220=1 / **193=1**, at `:452049` | **CARRYOVER** |
| Remote Control banner now describes what it does | `.211` | `Remote Control lets` 220=0 / 193=0; `Remote Control` 108/90 | **UNANCHORED** |
| RTL text (Arabic/Hebrew/Persian) rendering in the wrong order | `.216` | no candidate literal | **EXTENSION-SIDE** |

The `.203` case is worth spelling out because it is a textbook false delta. The string *is* in this
bundle — read at `:452045-452052`, inside a `/config` settings row:

```javascript
      ...(bk()
        ? [
            {
              id: "remoteControl",
              label: "Enable Remote Control for all sessions",
              value: t.remoteControlAtStartup === void 0 ? "default" : String(t.remoteControlAtStartup),
              options: ["true", "false", "default"],
              type: "enum",
```

So the CLI already exposed the setting (`remoteControlAtStartup`, tri-state `true`/`false`/`default`)
in 2.1.193. What `.203` added is a **toggle in the VS Code extension's settings UI** that writes the
same key. The extension is a separate artefact and is not in `cli_inner_pretty.js`. Citing `:452049`
for this bullet would present a pre-existing CLI row as a new feature.

The `.216` RTL bullet is purely a rendering fix in the extension's webview. There is no bidi/RTL
handling in the CLI's terminal renderer that corresponds to it.

**Rule of thumb for this module:** a `[VSCode]` prefix in the changelog means *the CLI bundle is the
wrong place to look*, unless the bullet also names a CLI setting key or slash command.

---

## 2. The two SDK-host bullets: "desktop stuck running" and "change directory"

These two look like a pair (both are Claude Desktop, both are about session state) and they resolve
very differently.

### 2.1 `.208` — desktop sessions stuck showing "running" — UNANCHORED here

> *"Fixed desktop sessions getting stuck showing 'running' after a slash command was sent mid-turn"*

The relevant predicate family is at `:843367-843385`, and it is *close* to the bullet but does not
prove it:

```javascript
function Ixm({ inputClosed: e, currentState: t, hasActiveTeammates: r, hasRunningBgTasks: n, hasPendingNotification: o }) {
  if ((r || n || o) && Z.CLAUDE_CODE_BG_TASKS_REPORT_RUNNING) return !1;
  return !e && t === "running";
}
function Rxm({ hasActiveTeammates: e, hasRunningBgTasks: t, hasPendingNotification: r }) {
  return !((e || t || r) && Z.CLAUDE_CODE_BG_TASKS_REPORT_RUNNING);
}
```

Counts: `CLAUDE_CODE_BG_TASKS_REPORT_RUNNING` 220=4 / **193=2**, `hasRunningBgTasks` 220=4 / **193=2**,
`hasPendingNotification` 220=6 / **193=2**. Every literal doubled, which is consistent with *one new
predicate* (`Rxm`) being factored out of an existing one — but the counts alone cannot separate that
from a rename, and no string in either build is specific to "slash command sent mid-turn".

**Verdict: UNANCHORED.** The state machine lives in the headless/SDK layer and is owned by
[`../51_headless_sdk/control_requests.md`](../51_headless_sdk/control_requests.md). Recorded here so
the bullet is accounted for.

### 2.2 `.210` — "Change directory" in SDK hosts — NET_NEW, whole control subtype

> *"Fixed 'Change directory' in SDK hosts (e.g. Claude Desktop) failing with 'A turn is in progress'
> on idle sessions that have a running background task"*

**Verdict: NET_NEW.** `set_cwd` is **220=13 / 193=2**, and the two 193 hits (`:301826 (193)`,
`:301857 (193)`) are the unrelated `tengu_shell_set_cwd` telemetry for shell-mode `cd`. The entire
**`set_cwd` SDK control request** is new (see also
[`../51_headless_sdk/control_requests.md`](../51_headless_sdk/control_requests.md)): zod schema
`:839252`, dispatcher arm `:847647-847670`,
handler module exported at `:663497-663503`:

```
validateCdTarget            eYo   :663504
safeWireMessage             aef   :663601
relocateSession             rYo   (called :663687)
handleSetCwdControlRequest  qLb   :663604
cdRuleRefusalMessage        tYo   (called :663653)
```

#### The actual bug: `running` is not the same as `busy`

```javascript
// ============================================
// isSessionBusyForCwdChange - the busy predicate the set_cwd handler consults
// Location: cli_inner_pretty.js:843367-843369 (call site :847652)
// ============================================

// ORIGINAL (for source lookup):
function kxm({ running: e, runPhase: t, mainThreadQueueLength: r }) {
  return (e && t !== "waiting_for_agents") || r > 0;
}

// READABLE (for understanding):
function isSessionBusyForCwdChange({ running, runPhase, mainThreadQueueLength }) {
  return (running && runPhase !== "waiting_for_agents")   // the MAIN thread is doing work
      || mainThreadQueueLength > 0;                       // ...or has queued work
}

// Mapping: kxm→isSessionBusyForCwdChange, e→running, t→runPhase, r→mainThreadQueueLength
```

**This one carve-out is the bullet.** A session that has dispatched subagents or background tasks and
is now waiting on them has `running === true` — the naive check therefore reported "A turn is in
progress" forever, which is precisely the reported symptom ("on idle sessions that have a running
background task"). `runPhase === "waiting_for_agents"` is the state that distinguishes *I am
computing* from *I am waiting for someone else to compute*, and only the former conflicts with a cwd
change: the main thread's transcript is what gets relocated, and subagents do not touch it.
(`waiting_for_agents` is 220=2 / **193=1** — the phase name pre-existed; this consumer is new.)

`mainThreadQueueLength > 0` is the second half and is not redundant: a session can be idle *right
now* with queued input that will start a turn microseconds later.

#### The handler checks busy **twice**, with two different messages

- Entry (`:663605-663614`):
  *"A turn is in progress — the working directory can only change while the session is idle. Wait for
  the turn to finish (or interrupt it), then retry."*
- After validation and any trust prompt (`:663677-663685`):
  *"A turn started while the request was being validated. Retry when the session is idle."*

The validation path can `await` for a long time — `validateCdTarget` hits the filesystem, and the
trust branch (`:663661-663676`) can round-trip a `needs_trust` response to the host and back. Between
those awaits a turn can start. Re-checking closes the TOCTOU window, and the *distinct wording* tells
an SDK author which of the two happened, because the remedies differ (wait vs simply retry).

#### `set_cwd` is also the real home of the "trust boundary" literals

The scoping pass anchored `.211`'s file-upload hardening bullet on `:663633`. That line is the
`unsafe_path` refusal of *this* handler:

> `The target path contains invisible or non-printing characters (control, formatting, zero-width, or
> non-standard space characters such as the narrow no-break space macOS puts in screenshot folder
> names), so it cannot safely cross the trust boundary. The path is deliberately not echoed back.`

The predicate is `QKo` (`:663724`):

```javascript
QKo = /[\p{Cc}\p{Cf}\p{Zl}\p{Zp}\p{Default_Ignorable_Code_Point}⠀]|(?! )\p{Zs}/u;
```

Read it carefully — the design is unusually precise:

- `\p{Cc}` control, `\p{Cf}` format (bidi overrides, ZWJ), `\p{Zl}`/`\p{Zp}` line/paragraph separators,
  `\p{Default_Ignorable_Code_Point}` (ZWSP, variation selectors, soft hyphen…);
- `⠀` BRAILLE PATTERN BLANK — visually empty but *not* in any of the above classes, a classic
  homoglyph-padding character;
- `(?! )\p{Zs}` — **every space separator except ordinary U+0020.** NBSP, NNBSP, ideographic
  space, thin space are all rejected; the plain ASCII space is allowed.

The `(?! )` lookahead is the whole subtlety. Directory names legitimately contain spaces, so a
blanket `\p{Zs}` ban would break `~/My Documents`. But NNBSP (U+202F) is *indistinguishable from a
space on screen*, and the message itself names the real-world source: **macOS puts a narrow no-break
space in screenshot folder names**. So this is not theoretical — the most common way a user hits this
rule is by trying to `cd` into their own screenshots folder, and the message says so.

Two consequences of the rule are visible elsewhere in the same function:

1. **The path is not echoed back** (`:663633`). Echoing an attacker-influenced string containing bidi
   overrides into a host UI is how you make a confirmation dialog say something other than what will
   happen.
2. **The success response sanitises too** (`:663696`): `cwd: QKo.test(l) ? i : l` — if the *actual*
   resolved cwd contains such characters, report the requested directory instead.
3. `safeWireMessage` (`aef`, `:663601-663603`) generalises the pattern:
   `return QKo.test(e) ? t : e` — "use this message unless it contains invisible characters, in
   which case use this safe fallback". It is applied to the Cd-rule refusal (`:663652-663655`,
   fallback *"A Cd permission rule blocks this directory. The rule text contains control or invisible
   characters, so it is not echoed here…"*) and to both halves of the catch-arm error at
   `:847674-847684`.

**Key insight:** the control-request surface is a *trust boundary* in the same sense as the file
upload — a string crossing it is rendered by a GUI the CLI does not control. The bundle's own
`@internal` documentation for the response type (`:839317`) states the invariant explicitly:

> *"Every non-ok outcome leaves the working directory unchanged — but trust may already have been
> durably recorded when the request carried a valid attestation (a busy rejection or relocation
> failure after the latch does not unlatch it; the consent was for the directory, not the attempt)."*

That is a deliberate, documented asymmetry: **consent is durable, the operation is not.** A user who
approved trusting `/work/repo` should not be asked again just because the turn-busy race lost.

---

## 3. `/desktop` and the worktree working-directory bullet

> `.198` — *"Fixed `/desktop` failing with 'Cannot determine working directory' after entering and
> exiting a worktree"*

**Verdict: UNANCHORED.** `Cannot determine working directory` is **220=0 / 193=0** — the literal is
in neither bundle, so the changelog wording is not the source string. There is no candidate error in
the `/desktop` path either.

What *is* readable is the command itself (`Qhr` `:449721-449723`, object `:449727-449736`):

```javascript
function Qhr() {                                     // isDesktopHandoffAvailable
  return Al_() && ns("allow_desktop_handoff");
}
  wl_ = {
    type: "local-jsx",
    name: "desktop",
    aliases: ["app"],
    description: "Continue the current session in Claude Desktop",
    availability: ["claude-ai"],
    isEnabled: Qhr,
    get isHidden() { return !Qhr(); },
  }
```

`allow_desktop_handoff` is 220=3 / 193=3 — carryover policy. The `isHidden` getter is defined in
terms of the same predicate as `isEnabled`, so the command vanishes rather than erroring when the
policy denies it; that is not a `.198` change, it is the pre-existing shape.

The bug is a working-directory-resolution failure in the handoff payload, which after
`EnterWorktree`/`ExitWorktree` would reference a directory that no longer exists. The worktree-escape
machinery is documented by [`../53_subagent_limits/`](../53_subagent_limits/README.md)
(`tengu_agent_worktree_cwd_escape_blocked`, `:314164`, 220=4/193=0); no site in it is specific to
`/desktop`.

---

## 4. Cowork VM mode and the "Not logged in" bullet

> `.205` — *"Fixed Cowork VM-mode local-agent sessions failing to start with 'Not logged in · Please
> run /login' on CLI 2.1.203+"*

**Verdict: UNANCHORED.** `Not logged in` is 220=4 / **193=4** — byte-stable, and the bullet is
explicitly a regression introduced *within this window* (".203+") and fixed inside it, so the net
delta across `.193 → .220` is expected to be zero. This is a case where a zero delta is the *correct*
answer and any anchor would be an artefact.

The readable context that makes the bullet plausible: Cowork has two entrypoint spellings
(`local-agent`, `remote_cowork`, both → `"Cowork"` at `:46388-46389`), one boolean env var
(`CLAUDE_CODE_IS_COWORK`, `:32129`/`:32593`), a settings-file override
(`if (e.coworkPlugins || Z.CLAUDE_CODE_USE_COWORK_PLUGINS) return "cowork_settings.json"` `:62345`),
its own memory-path overrides (`CLAUDE_COWORK_MEMORY_PATH_OVERRIDE` `:32032`, plus
`…_MEMORY_INDEX_CONTENT`, `…_MEMORY_GUIDELINES`, `…_MEMORY_EXTRA_GUIDELINES` at `:32033-32035`), and
its own MCP tool (`mcp__cowork__present_files`, `:152464`). A credential-resolution path that keys
off only one of those signals will misbehave in the variant that sets the other — the exact shape of
the reported regression.

Related but separate: the **`.216` "corporate mTLS / TLS-verify / OAuth scope / proxy settings ignored
in Claude Desktop"** bullet (`:827785`, `host-managed` 220=6/193=0) belongs to
[`../55_auth_providers/`](../55_auth_providers/README.md), which owns the host-managed-provider
settings suppression.

---

## 5. Reserved MCP server names ahead of the Desktop pane rename

> `.205` — *"Reserved the 'Claude Browser' MCP server name (alongside 'Claude Preview') ahead of the
> Claude Desktop pane rename; user-configured MCP servers can no longer register under either name"*

**Verdict: NET_NEW.** `Claude Browser` is 220=2 / **193=0**, and `"Claude Preview"` is likewise **0**
in 193 — so *both* names are new reservations, which the bullet's "alongside" phrasing understates.

```javascript
// ============================================
// RESERVED_MCP_SERVER_NAMES - names a user MCP config may not claim
// Location: cli_inner_pretty.js:151628-151629 (set built :289042-289043)
// ============================================

// ORIGINAL (for source lookup):
var pkg = "Claude Preview",
  fkg = "Claude Browser",
  mkg, hkg, gkg;
var Lro = S(() => {
  ((mkg = El(pkg)), (hkg = El(fkg)), (gkg = new Set([mkg, hkg])));
});
...
  ((K9u = new Set(["Claude Preview", "Claude Browser"])),
    (AEy = new Set(["claude-in-chrome", "Claude in Chrome", ...K9u])));

// READABLE (for understanding):
var CLAUDE_PREVIEW_SERVER_NAME = "Claude Preview",
  CLAUDE_BROWSER_SERVER_NAME = "Claude Browser";
  // normalised forms, for comparison against user config
  NORMALISED_RESERVED = new Set([normalizeServerName(CLAUDE_PREVIEW_SERVER_NAME),
                                 normalizeServerName(CLAUDE_BROWSER_SERVER_NAME)]);
...
  RESERVED_DESKTOP_PANE_NAMES = new Set(["Claude Preview", "Claude Browser"]);
  BROWSER_CONTROL_SERVER_NAMES = new Set(["claude-in-chrome", "Claude in Chrome",
                                          ...RESERVED_DESKTOP_PANE_NAMES]);

// Mapping: pkg→CLAUDE_PREVIEW_SERVER_NAME, fkg→CLAUDE_BROWSER_SERVER_NAME, El→normalizeServerName,
//          gkg→NORMALISED_RESERVED, K9u→RESERVED_DESKTOP_PANE_NAMES, AEy→BROWSER_CONTROL_SERVER_NAMES
```

**Why reserve a name before the feature exists?** The Desktop app is about to expose a pane whose MCP
server registers under `Claude Browser`. If a user's `.mcp.json` already owns that name when the
rename ships, the user's server silently receives browser-control tool calls — or, in the other
direction, the built-in server's privileged treatment is conferred on a user server. Because
`AEy`/`BROWSER_CONTROL_SERVER_NAMES` unions the reserved names with the existing browser-control
names (`:289043`), the *same set* that grants browser-control semantics is the set that is refused to
users. Reserving names ahead of the rename is the only ordering that avoids a migration window in
which both are true.

The two-level structure (`gkg` normalised, `K9u` raw) matters: the *refusal* compares normalised
names so `claude browser` and `Claude  Browser` are also blocked, while the *capability* set compares
raw names because that is what the built-in registration uses.

Ownership: [`../39_mcp/`](../39_mcp/README.md) covers the registration path; this module records the
Chrome/Desktop motivation.

---

## 6. The 403 reconnect loop: a scope-downgrade retry

> `.216` — *"Fixed Claude-in-Chrome 403-looping on reconnect when the session's OAuth token lacks a
> required scope"*

**Verdict: NET_NEW, and it is exactly one `catch` block.**

The scope-widening this bullet is *about* is **carryover**. Both builds compute an upgraded scope set
before refreshing:

| | 2.1.193 | 2.1.220 |
|---|---|---|
| scope constant | `zse = [ove, NN, "user:sessions:claude_code", "user:mcp_servers", "user:file_upload"]` `:36558 (193)` | `trt = [q0e, $5, "user:sessions:claude_code", "user:mcp_servers", "user:file_upload"]` `:24671` |
| upgrade decision | `u = Boolean((v2(d.scopes) \|\| d.subscriptionType) && !d.clientId)` `:136438 (193)` | `u = Boolean((fV(d.scopes) \|\| d.subscriptionType) && !d.clientId)` `:155356` |
| widened set | `let p = u ? es([...zse, ...zNe(d.scopes)]) : d.scopes` `:136439 (193)` | `let p = u ? To([...trt, ...YBr(d.scopes)]) : d.scopes` `:155357` |
| **failure handling** | none — the widened refresh throws | **try/catch with a downgrade retry** `:155359-155365` |

```javascript
// ============================================
// refreshOAuthTokenWithScopeUpgrade (excerpt) - retry with the original scopes on invalid_scope
// Location: cli_inner_pretty.js:155356-155365
// ============================================

// ORIGINAL (for source lookup):
    (O("tengu_oauth_token_refresh_starting", {}), (u = Boolean((fV(d.scopes) || d.subscriptionType) && !d.clientId)));
    let p = u ? To([...trt, ...YBr(d.scopes)]) : d.scopes,
      f;
    try {
      f = await k$e(d.refreshToken, { scopes: p, clientId: d.clientId, signal: l.signal });
    } catch (m) {
      if (!u || !aXi(m) || !Array.isArray(d.scopes) || d.scopes.length === 0 || !fV(d.scopes)) throw m;
      (O("tengu_oauth_refresh_invalid_scope_fallback", {}),
        (f = await k$e(d.refreshToken, { scopes: d.scopes, clientId: d.clientId, signal: l.signal })));
    }

// READABLE (for understanding):
    emitTelemetry("tengu_oauth_token_refresh_starting", {});
    let attemptUpgrade = Boolean((hasClaudeAiScopes(stored.scopes) || stored.subscriptionType) && !stored.clientId);
    let requestedScopes = attemptUpgrade
          ? dedupe([...CLAUDE_AI_OAUTH_SCOPES, ...normalizeScopes(stored.scopes)])   // widen
          : stored.scopes,
      refreshed;
    try {
      refreshed = await refreshToken(stored.refreshToken, { scopes: requestedScopes, clientId: stored.clientId, signal });
    } catch (err) {
      if (!attemptUpgrade                    // we did not widen -> nothing to fall back to
       || !isInvalidScopeError(err)          // a different failure -> do not mask it
       || !Array.isArray(stored.scopes) || stored.scopes.length === 0
       || !hasClaudeAiScopes(stored.scopes)) throw err;
      emitTelemetry("tengu_oauth_refresh_invalid_scope_fallback", {});
      refreshed = await refreshToken(stored.refreshToken,        // retry with EXACTLY what we had
                                     { scopes: stored.scopes, clientId: stored.clientId, signal });
    }

// Mapping: fV→hasClaudeAiScopes, trt→CLAUDE_AI_OAUTH_SCOPES, YBr→normalizeScopes, To→dedupe,
//          k$e→refreshToken, aXi→isInvalidScopeError, u→attemptUpgrade, p→requestedScopes,
//          d→stored, f→refreshed, l→lock
```

**Why the loop happened.** `CLAUDE_AI_OAUTH_SCOPES` includes `user:file_upload` — a scope Claude in
Chrome needs. On refresh the client asks for that scope *even if the existing token was never granted
it*. If the authorization server refuses to mint a token with a scope the user/org has not consented
to, the refresh fails; the client then retries the refresh; the same widened request fails again.
Nothing about the loop is Chrome-specific except that Chrome is what made `user:file_upload`
necessary — which is exactly why the bullet reads as a Claude-in-Chrome bug.

**Why the four guard conditions in the `catch`.** The fallback must be *narrow*, because retrying an
identical request after an unrelated failure is a way to turn one outage into two:

1. `!attemptUpgrade` — if we never widened, the original request already used `stored.scopes`; a
   retry would be byte-identical and pointless.
2. `!isInvalidScopeError(err)` — a network error, a 500, or an expired refresh token must propagate.
   Only `invalid_scope` is evidence that *the scope set* was the problem.
3. `!Array.isArray(stored.scopes) || length === 0` — there must be something to fall back *to*. An
   empty set would have the server apply its own defaults, which is a different request again.
4. `!hasClaudeAiScopes(stored.scopes)` — re-asserts the same predicate that authorised the upgrade,
   so the retry stays on the claude.ai path.

**Key insight:** the fix is *degrade, don't fail*. The upgrade is opportunistic — it exists so that
long-lived tokens pick up new scopes without a re-login — so its failure must not be fatal. A user
whose org forbids `user:file_upload` now keeps a working session (without Chrome uploads) instead of
looping on refresh. The gate `tengu_oauth_refresh_invalid_scope_fallback` (220=1 / **193=0**) exists
to measure how often that degradation happens, because a rising rate means a scope was added that a
population cannot obtain.

Sibling gates in the same function, for orientation: `tengu_oauth_token_refresh_race_resolved`
`:155348`, `tengu_oauth_token_refresh_lock_compromised_pre_post` `:155352`, `…_post_post` `:155367`.
[`../55_auth_providers/`](../55_auth_providers/README.md) owns the lock/CAS machinery.

---

## 7. The `.218` IDE-selection mojibake bullet is mis-anchored

> ⚠ **Release corrected:** this bullet belongs to **`.218`** (CHANGELOG `## 2.1.218`), not `.217`.

> *"Fixed mojibake when a long IDE selection was truncated mid-emoji, and a case where a tool executor
> error could be silently dropped"*

**Verdict: UNANCHORED, and the proposed anchor is wrong.**

`_scope_v215_220.md` row 10 gives `:424599` with the note "surrogate-safe truncation (`Array.from`)".
Reading `:424590-424615` shows it is **JavaScript source inside an embedded skill payload** — the
deep-research web-searcher script:

```javascript
const LABEL_CAP = 40
const LABEL_STRIP = /[\x00-\x1f\x7f-\x9f​-‏‪-‮⁦-⁩﻿"“-‟…]/g
const quotedLabel = s => {
  const cps = Array.from(stripLabelChars(s))
  return '"' + cps.slice(0, LABEL_CAP).join("").trim() + (cps.length > LABEL_CAP ? "…" : "") + '"'
}
```

It truncates *web-page titles* for a research report, not IDE selections. (It is a good example of
the technique — `Array.from` iterates code points so a surrogate pair never splits, and the ellipsis
goes *inside* the quotes — but it is a skill asset, not IDE code.)

The genuine IDE-selection plumbing in this bundle is:

- the reminder tag pair `p7m = /<(ide_opened_file|ide_selection)(?:\s[^>]*)?>[\s\S]*?<\/\1>\n?/g`
  (`:24886`), used to strip prior selections from the transcript;
- the provider registration `K_("ide_selection", async () => $N_(r, t))` (`:516680`), alongside
  `ide_opened_file`, `diagnostics`, `lsp_diagnostics`.

`selectedText` is 0/0 and there is no truncation constant reachable from `$N_` by literal search. The
bullet is not anchorable in this bundle; the truncation most plausibly happens in the IDE extension
before the selection is sent.

---

## 8. `.218` — sandbox restrictions for IDE interactions: not anchorable here

> *"Improved sandbox command restrictions for IDE interactions"*

**Verdict: UNANCHORED.** Both candidate literals are zero in both bundles: `ideSandbox` 0/0,
`IDE interactions` 0/0. There is no IDE-specific branch in the sandbox argv builders
(`:193700-195210`).

This is a **link-only** item. The sandbox work in this window — the bubblewrap/seatbelt builders,
`sandbox.network.strictAllowlist`, `sandbox.filesystem.disabled`, the Windows user sandbox, and the
`.210` late `.claude/*` symlink reconciliation — is documented in:

- [`../49_sandbox/README.md`](../49_sandbox/README.md)
- [`../49_sandbox/network_strict_allowlist.md`](../49_sandbox/network_strict_allowlist.md)
- [`../49_sandbox/filesystem_disabled_and_paths.md`](../49_sandbox/filesystem_disabled_and_paths.md)
- [`../49_sandbox/windows_user_sandbox.md`](../49_sandbox/windows_user_sandbox.md)

If the `.218` bullet has a client-side realisation, it is a change to the *command classification*
consumed by the sandbox rather than to the sandbox itself, which puts it in
[`../38_permissions/`](../38_permissions/README.md).

---

## 9. Summary table for this document

| Bullet | Ver | Verdict | Best anchor |
|---|---|---|---|
| VS Code Remote Control toggle | .203 | CARRYOVER | `:452049` (pre-existing `/config` row) |
| VS Code Remote Control banner | .211 | UNANCHORED (extension) | — |
| VS Code RTL rendering | .216 | EXTENSION-SIDE | — |
| Desktop stuck "running" | .208 | UNANCHORED | `Ixm`/`Rxm` `:843373-843385` (suggestive only) |
| SDK "Change directory" | .210 | **NET_NEW** | `set_cwd` 13/2; `kxm` `:843367`; handler `:663604` |
| `/desktop` working directory | .198 | UNANCHORED (literal 0/0) | `/desktop` object `:449729` |
| Cowork VM-mode login | .205 | UNANCHORED (`Not logged in` 4/4) | entrypoint map `:46388` |
| Reserved MCP names | .205 | **NET_NEW** | `:151628-151629`, `:289042` |
| Chrome 403 reconnect loop | .216 | **NET_NEW** | `tengu_oauth_refresh_invalid_scope_fallback` `:155363` |
| IDE selection mojibake | .218 | UNANCHORED; scope anchor wrong | `:24886`, `:516680` |
| Sandbox for IDE interactions | .218 | UNANCHORED; link only | → `../49_sandbox/` |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `handleSetCwdControlRequest` (`qLb`) - the whole `set_cwd` SDK control subtype, `:663604`
- `isSessionBusyForCwdChange` (`kxm`) - the `waiting_for_agents` carve-out that fixes `.210`, `:843367`
- `safeWireMessage` (`aef`) - swap a message for a safe fallback when it holds invisible characters, `:663601`
- `INVISIBLE_CHARS_RE` (`QKo`) - the control/format/Zs-except-U+0020 predicate, `:663724`
- `validateCdTarget` (`eYo`) - filesystem + rule validation for a cwd change, `:663504`
- `isDesktopHandoffAvailable` (`Qhr`) - `allow_desktop_handoff` policy gate for `/desktop`, `:449721`
- `CLAUDE_BROWSER_SERVER_NAME` (`fkg`) / `CLAUDE_PREVIEW_SERVER_NAME` (`pkg`) - reserved MCP names, `:151628-151629`
- `BROWSER_CONTROL_SERVER_NAMES` (`AEy`) - reserved names unioned with the browser-control set, `:289043`
- `isCoworkEntrypoint` (`:46413`) - `CLAUDE_CODE_ENTRYPOINT === "remote_cowork"`
- `shouldReportRunningForBgTasks` (`Rxm`) - background-task "running" reporting predicate, `:843383`
