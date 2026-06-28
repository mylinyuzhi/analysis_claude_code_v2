# `claude mcp login <name>` / `logout <name>` CLI + `--no-browser` headless flow

> **Type:** NET-NEW CLI capability · **Version:** 2.1.186 · **Module:** `39_mcp/`
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (VERSION `2.1.193`, build `a1938d2a`). Every `cli_inner_pretty.js:<line>` is a **193** line unless tagged `(183)`.

## TL;DR

v2.1.186 adds two new subcommands under the `mcp` parent command — `claude mcp login <name>` and `claude mcp logout <name>` — that let a user (re)authenticate or sign out of a single MCP server from the shell, **outside** the interactive `/mcp` panel. The login subcommand carries a `--no-browser` flag that, on SSH/headless terminals, prints the authorization URL instead of opening a browser and reads the pasted redirect URL back over `stdin` via a `readline` interface. Both subcommands, the handler module, and all of their user-facing strings are **absent in 183** (`grep -c "Authenticate with an MCP server"` = `0` in 183; `grep -c mcpLoginHandler` = `0`; `grep -c tengu_mcp_login` = `0`).

---

## 1. The command registrations

**What it does.** Wires `login`/`logout` into the `mcp` command builder (`buildMcpCommand`, obfuscated `anc`, `cli_inner_pretty.js:613523`) alongside the pre-existing `serve`/`remove`/`list`/`get`/`add-json`/`add-from-claude-desktop`/`reset-project-choices` subcommands. Both actions lazy-load the new auth-handler module and forward to its handler.

**How it works.** The two `.command(...)` chains sit back-to-back; each `.action` resolves the handler out of the lazily-initialized module `g3o` (`cli_inner_pretty.js:613276`).

```javascript
// ============================================
// mcp login / logout subcommand registration - the new 2.1.186 CLI surface
// Location: cli_inner_pretty.js:613581-613600
// ============================================

// ORIGINAL (for source lookup):
t.command("login <name>")
  .description("Authenticate with an MCP server (HTTP, SSE, or claude.ai connector)")
  .option(
    "--no-browser",
    "Print the authorization URL instead of opening a browser (for SSH/headless sessions — paste the redirect URL back when prompted)",
  )
  .action(async (n, r) => {
    let { mcpLoginHandler: o } = await Promise.resolve().then(() => (h3o(), g3o));
    await o(n, r);
  }),
  t.command("logout <name>")
    .description("Clear stored OAuth credentials for an MCP server")
    .action(async (n) => {
      let { mcpLogoutHandler: r } = await Promise.resolve().then(() => (h3o(), g3o));
      await r(n);
    }),

// READABLE (for understanding):
mcpCommand.command("login <name>")
  .description("Authenticate with an MCP server (HTTP, SSE, or claude.ai connector)")
  .option(
    "--no-browser",
    "Print the authorization URL instead of opening a browser (for SSH/headless sessions — paste the redirect URL back when prompted)",
  )
  .action(async (serverName, options) => {                       // options.browser === false when --no-browser given
    let { mcpLoginHandler } = await lazyLoadMcpAuthModule();     // h3o() initializes, g3o is the module namespace
    await mcpLoginHandler(serverName, options);
  });
mcpCommand.command("logout <name>")
  .description("Clear stored OAuth credentials for an MCP server")
  .action(async (serverName) => {
    let { mcpLogoutHandler } = await lazyLoadMcpAuthModule();
    await mcpLogoutHandler(serverName);
  });

// Mapping: t→mcpCommand, n→serverName, r→options, h3o→lazyLoadMcpAuthModule, g3o→mcpAuthModule,
//   o/r→mcpLoginHandler/mcpLogoutHandler
```

**Why this approach.**
- **`--no-browser` negation flag.** Commander.js maps `--no-browser` to `options.browser === false` (default `true`). So the handler reads `options.browser` everywhere; no extra boolean needs threading. The description explicitly names SSH/headless as the use case — the whole feature exists because an `ssh`'d session has no local browser to open and no loopback port the cloud OAuth callback can reach.
- **Lazy module load.** The handler module `g3o` (`cli_inner_pretty.js:613276`: `gt(g3o, { mcpLogoutHandler: () => D9f, mcpLoginHandler: () => L9f })`) is loaded on demand via `h3o()` (`cli_inner_pretty.js:613503`), which `require("readline")` among other deps. Keeping it lazy means a normal `claude` startup (no `mcp login`) never pulls the readline/OAuth machinery into the hot path.

**Key insight.** The CLI subcommand is a *thin shell* over the same OAuth flow `runOAuthFlow` (`oX`, `cli_inner_pretty.js:281953`) that the interactive `/mcp` panel uses — the new surface is the **entry point** and the **headless paste-URL fallback**, not a second auth implementation.

---

## 2. `mcpLoginHandler` (`L9f`) — transport-kind dispatch

**What it does.** Resolves the named server's transport/auth shape, then branches: claude.ai connectors get a claude.ai authorize link; unsupported/host-managed shapes get a tailored "there is nothing to log into" message; a real `oauth` server runs the OAuth flow with a headless paste-URL fallback.

**How it works (step-by-step).** `mcpLoginHandler` (`L9f`, `cli_inner_pretty.js:613318`) first emits `tengu_mcp_login`, resolves config via `snc(...)`, then classifies the transport kind with `Z9(...)` and `switch`es:

1. **`claudeai-proxy`** (`:613323`) — builds the claude.ai authorize URL with `pRe(config)`. If it can't (`:613325`), it tells the user to run `claude login` first. Otherwise it opens the browser unless `--no-browser` (`if (t.browser) … gc(o)`, `:613332`) and always prints the URL line via the message helper (next section), suffixed with "Once authorized on claude.ai, the connector will be available the next time you start Claude Code."
2. **`unsupported-transport`** (`:613347`) — *"doesn't support OAuth login — it's only available for HTTP and SSE servers."*
3. **`anthropic-hosted`** (`:613352`) — emits the server-supplied `r.message`.
4. **`oauth`** sub-cases (`:613354`) — `inc(config)` distinguishes `static_auth_header` (auth lives in a config `Authorization` header, nothing to log into), `first_party_auth` ("authenticates automatically with your Claude login"), and `first_party_design_auth` ("…with your stored /design-login credential"). Each is a no-op-with-explanation.
5. **generic `oauth`** (`:613375`) — the headless-capable path (section 4).

**Why dispatch on transport kind.** A single "log in" verb has to behave differently for a claude.ai connector (credentials live server-side on claude.ai), a header-auth server (no interactive login at all), and a true OAuth server (browser/redirect dance). Routing on `Z9(...)`'s `kind` keeps the *one* command coherent: every server name the user can type produces a sensible, specific message instead of a generic failure.

**Success message.** On OAuth success (`:613452`) the handler prints either *`Authenticated with "X". Its tools are now available in Claude Code.`* or, if the server is currently disabled (`Bx(e)`), *`Authenticated with "X", but it's currently disabled. Enable it in /mcp for its tools to load.`*

---

## 3. `formatAuthUrlMessage` (`rnc`) — the browser-vs-no-browser header line

**What it does.** Returns the one-line lead-in printed above the authorization URL, worded to match whether a browser was (attempted to be) opened.

```javascript
// ============================================
// formatAuthUrlMessage - the URL lead-in line, worded by --no-browser
// Location: cli_inner_pretty.js:613312-613317
// ============================================

// ORIGINAL (for source lookup):
function rnc(e, t) {
  return `${e ? "If the browser didn't open, visit:" : "Visit this URL to authorize:"}
  ${wD(t)}

`;
}

// READABLE (for understanding):
function formatAuthUrlMessage(browserOpened, url) {
  return `${browserOpened ? "If the browser didn't open, visit:" : "Visit this URL to authorize:"}
  ${hyperlink(url)}

`;
}

// Mapping: rnc→formatAuthUrlMessage, e→browserOpened, t→url, wD→hyperlink
```

**Key insight.** The same URL is always printed; only the lead-in changes. With a browser the URL is a *fallback* ("If the browser didn't open, visit:"); with `--no-browser` it is the *primary* action ("Visit this URL to authorize:"). One helper, two register-appropriate framings — no duplicated print logic.

---

## 4. The headless / `--no-browser` paste-URL flow (the core of the feature)

**What it does.** For a generic `oauth` server, runs `runOAuthFlow` (`oX`, `cli_inner_pretty.js:281953`) with `skipBrowserOpen: !options.browser`. When the OAuth callback cannot be served locally (SSH/headless), it opens a `readline` prompt — *"Or paste the redirect URL here: "* — so the user can complete the loopback redirect by hand. If `stdin` is not a TTY, it aborts with an actionable `ssh -t` message instead of hanging.

**How it works (step-by-step).**

```javascript
// ============================================
// mcpLoginHandler (oauth tail) - the headless paste-URL flow
// Location: cli_inner_pretty.js:613375-613460
// ============================================

// ORIGINAL (for source lookup):
process.stdout.write(`Starting authentication for "${e}"…\n`);
let s = "Or paste the redirect URL here: ",
  i = new AbortController(), a, l = !1,
  c = setInterval(() => {}, 60000),
  u = new Promise((d, p) => { i.signal.addEventListener("abort", () => p(new Vj()), { once: !0 }); });
u.catch(() => {});
try {
  await dbe(e, r.config, { preserveStepUpState: !0 });
  await Promise.race([ u,
    oX(e, r.config,
      (d) => { process.stdout.write(rnc(t.browser, d) + `Waiting for authorization… (^C to cancel)\n`); if (a) a.prompt(); },
      i.signal,
      { skipBrowserOpen: !t.browser,
        onWaitingForCallback: (d) => {
          if (!process.stdin.isTTY) { ((l = !0), i.abort()); return; }
          if (!process.stdout.isTTY) return;
          (rle(), (a = onc.createInterface({ input: process.stdin, output: process.stdout, prompt: s })),
            a.on("SIGINT", () => i.abort()), a.on("close", () => i.abort()),
            a.on("line", (p) => { let f = p.trim();
              if (f && d(f)) return;
              if (f) process.stdout.write(`That doesn't look like a redirect URL — paste the full address from your browser's address bar.\n`);
              a?.prompt(); }));
        } }),
  ]);
} catch (d) {
  if (d instanceof Vj) {
    if (l) return (await zu("cli_mcp_login", "no_tty_stdin"),
      tg(`Couldn't complete authentication for "${e}": stdin isn't a terminal, so authentication can't be completed here. ` +
         "Re-run in an interactive terminal — e.g. `ssh -t` — and paste the redirect URL when prompted."));
    return (await aK("cli_mcp_login", "cancelled"), mN(130));
  }
  return (await zu("cli_mcp_login", "oauth_flow_threw"), tg(`Couldn't complete authentication for "${e}": ${Ae(d)}`));
} finally { if ((clearInterval(c), a)) (a.close(), process.stdout.write(`\n`)); }

// READABLE (for understanding):
process.stdout.write(`Starting authentication for "${serverName}"…\n`);
let PASTE_PROMPT = "Or paste the redirect URL here: ",
  abort = new AbortController(),
  readlineIface, stdinNotTTY = false,
  keepAlive = setInterval(() => {}, 60000),                 // hold the event loop open during the wait
  abortedPromise = new Promise((_, reject) => { abort.signal.addEventListener("abort", () => reject(new OAuthAbort()), { once: true }); });
abortedPromise.catch(() => {});
try {
  await clearStoredOAuth(serverName, config, { preserveStepUpState: true });
  await Promise.race([ abortedPromise,
    runOAuthFlow(serverName, config,
      (url) => { process.stdout.write(formatAuthUrlMessage(options.browser, url) + `Waiting for authorization… (^C to cancel)\n`); readlineIface?.prompt(); },
      abort.signal,
      { skipBrowserOpen: !options.browser,                 // ← --no-browser → never open a browser
        onWaitingForCallback: (submitUrl) => {             // fired when the local callback server cannot be used
          if (!process.stdin.isTTY) { stdinNotTTY = true; abort.abort(); return; }   // headless, no way to paste → abort cleanly
          if (!process.stdout.isTTY) return;
          resetTerminal();
          readlineIface = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: PASTE_PROMPT });
          readlineIface.on("SIGINT", () => abort.abort());
          readlineIface.on("close",  () => abort.abort());
          readlineIface.on("line", (line) => {
            let trimmed = line.trim();
            if (trimmed && submitUrl(trimmed)) return;      // submitUrl validates+accepts the pasted redirect URL
            if (trimmed) process.stdout.write(`That doesn't look like a redirect URL — paste the full address from your browser's address bar.\n`);
            readlineIface?.prompt();
          });
        } }),
  ]);
} catch (err) {
  if (err instanceof OAuthAbort) {
    if (stdinNotTTY)                                        // aborted specifically because stdin wasn't a terminal
      return (logFailure("cli_mcp_login", "no_tty_stdin"),
        printError(`Couldn't complete authentication for "${serverName}": stdin isn't a terminal, so authentication can't be completed here. ` +
                   "Re-run in an interactive terminal — e.g. `ssh -t` — and paste the redirect URL when prompted."));
    return (logCancelled("cli_mcp_login", "cancelled"), exit(130));  // user ^C
  }
  return (logFailure("cli_mcp_login", "oauth_flow_threw"), printError(`Couldn't complete authentication for "${serverName}": ${formatErr(err)}`));
} finally { clearInterval(keepAlive); if (readlineIface) { readlineIface.close(); process.stdout.write("\n"); } }

// Mapping: oX→runOAuthFlow, Vj→OAuthAbort, dbe→clearStoredOAuth, onc→readline, rnc→formatAuthUrlMessage,
//   rle→resetTerminal, zu→logFailure, aK→logCancelled, tg→printError, mN→exit, l→stdinNotTTY, a→readlineIface,
//   d (callback arg)→submitUrl, e→serverName
```

**Why this design.**
- **`skipBrowserOpen: !options.browser` drives the whole decision.** A single boolean (the inverted `--no-browser`) chooses between (a) open the browser + run a loopback callback server, or (b) print the URL and wait for a paste. The OAuth flow itself (`oX`) is unchanged; the CLI only flips this flag and supplies the `onWaitingForCallback` hook.
- **`onWaitingForCallback` is the headless seam.** It fires when the OAuth flow determines the local callback path is unusable. There it makes a *terminal-capability* decision: if `stdin` is a TTY, spin up a readline paste-loop; if not, set `stdinNotTTY` and abort. This separates "headless but interactive (paste works)" from "fully non-interactive (must fail)".
- **The non-TTY abort is actionable, not a hang.** Without this guard, an OAuth login in a non-interactive `ssh host claude mcp login X` would block forever waiting for a paste that can never come. The `ssh -t` hint tells the user exactly how to make stdin a terminal. This is the single most user-valuable line in the feature: it converts a silent hang into a one-line fix.
- **`keepAlive = setInterval(() => {}, 60000)`** holds Node's event loop open while the only pending work is the human paste — otherwise the process could exit early once the synchronous stack drained.
- **Paste validation loop.** `submitUrl(trimmed)` returns truthy only when the pasted string is a valid redirect URL; a non-URL paste reprints the "that doesn't look like a redirect URL" hint and re-prompts rather than aborting, so a fat-fingered paste is recoverable.

**Key insight.** The whole headless capability is *one extra callback* (`onWaitingForCallback`) on the existing OAuth flow plus the inverted `--no-browser` flag. There is no separate "headless OAuth implementation" — the browser path and the paste path differ only in `skipBrowserOpen` and whether the callback server or the readline loop completes the redirect.

---

## 5. `mcpLogoutHandler` (`D9f`)

**What it does.** Clears stored OAuth credentials for one server and prints a kind-appropriate confirmation; special-cases claude.ai connectors (whose credentials are **not** on this machine).

**How it works.** `mcpLogoutHandler` (`D9f`, `cli_inner_pretty.js:613467`) emits `tengu_mcp_logout`, resolves+classifies the same way as login, then `switch`es:
- **`claudeai-proxy`** (`:613472`) — *"X is a claude.ai connector — its credentials live on claude.ai, not this machine. Disconnect it at <claude.ai url>"*. Nothing is deleted locally because there is nothing local to delete.
- **`unsupported-transport`** (`:613480`) — *"doesn't use OAuth — there are no stored credentials to clear."*
- **`anthropic-hosted`** (`:613485`) — clears via `dbe(...)`, prints *`Cleared local credentials for "X". <message>`*.
- **`oauth`** (`:613491`) — clears via `dbe(...)`, then prints *`Signed out of "X". Run \`mcp login X\` to authenticate again.`* (the re-login hint `Run \`mcp login X\`` is only appended when the server still supports interactive login, i.e. `inc(config) === null`).

**Why the claude.ai special-case.** A claude.ai connector authenticates against claude.ai itself; "logging out" locally would do nothing and mislead the user into thinking they had revoked access. The message redirects them to the actual control surface (the claude.ai connectors page), which is the only place that revocation takes effect.

---

## Evidence — NET-NEW (183 grep-diff)

| String / symbol | 193 | 183 | verdict |
|---|---|---|---|
| `Authenticate with an MCP server` (login desc) | 1 (`:613583`) | 0 | NET-NEW |
| `Clear stored OAuth credentials for an MCP server` (logout desc) | 1 (`:613594`) | 0 | NET-NEW |
| `mcpLoginHandler` | present (`:613277`,`:613589`) | 0 | NET-NEW |
| `tengu_mcp_login` | 1 | 0 | NET-NEW |
| `--no-browser` near MCP | 1 (`:613585`) | 0 (the only 183 `--no-browser` is an unrelated `ant` CLI doc string) | NET-NEW |

The `mcp` parent command (`anc`, `:613523`) gained `login`/`logout` between its existing subcommands; the OAuth flow `oX` (`:281953`) and `skipBrowserOpen` plumbing already existed (`skipBrowserOpen` 193:14 / 183:13 — the **+1** is exactly this new CLI path), so the *flow* is reused; the *CLI surface + headless paste/abort UX* is the delta.

---

## Cross-links

- Sibling 193 docs: [`reliability_retries.md`](./reliability_retries.md) (the OAuth `oX` flow gains retry-once on transient — the engine this CLI drives), [`headers_helper_reauth.md`](./headers_helper_reauth.md) (tool-call-time re-auth, the runtime counterpart to this explicit login), [`server_name_suggestions.md`](./server_name_suggestions.md) (the sibling `get`/`remove` subcommands' typo handling), [`README.md`](./README.md).
- Module index: [`README.md`](./README.md).

## Related Symbols

> Symbol mappings live in the central index files (this doc uses **list format**, never a mapping table):
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (**MCP** is the home module)
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations
> - [../00_overview/symbol_additions_v2_1_193_mcp.md](../00_overview/symbol_additions_v2_1_193_mcp.md) — the granular v2.1.193 MCP additions

Key functions in this document:

- `mcpLoginHandler` (`L9f`, `cli_inner_pretty.js:613318`) — login command handler; transport-kind dispatch + headless paste-URL flow.
- `mcpLogoutHandler` (`D9f`, `cli_inner_pretty.js:613467`) — logout command handler; clears stored OAuth creds.
- `formatAuthUrlMessage` (`rnc`, `cli_inner_pretty.js:613312`) — the browser-vs-no-browser URL lead-in line.
- `mcpAuthModule` (`g3o`, `cli_inner_pretty.js:613276`) — exports `{ mcpLoginHandler, mcpLogoutHandler }`; lazy init `h3o` (`:613503`).
- `buildMcpCommand` (`anc`, `cli_inner_pretty.js:613523`) — the `mcp` parent command; login `:613582` / logout `:613593` registered here.
- `runOAuthFlow` (`oX`, `cli_inner_pretty.js:281953`) — the shared OAuth flow driven with `skipBrowserOpen` + `onWaitingForCallback` (carryover; see [`reliability_retries.md`](./reliability_retries.md)).
