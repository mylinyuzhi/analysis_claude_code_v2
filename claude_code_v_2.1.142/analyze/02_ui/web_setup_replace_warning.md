# `/web-setup` Pre-Replace Warning (v2.1.142)

## What changed

`/web-setup` is the slash command that syncs the user's local `gh` CLI
GitHub token to **Claude on the web** so that web-launched remote agents
can clone, push, and read code on the user's behalf. The command is
gated behind feature flag `tengu_cobalt_lantern` and the
`allow_remote_sessions` + `allow_quick_web_setup` setting bits.

In v2.1.141, the command had a single confirmation step: "Connect Claude
on the web to GitHub? · Continue / Cancel." It did not distinguish
between a first-time connect and a re-connect over an existing
**GitHub App** OAuth credential.

v2.1.142 adds detection for an **existing OAuth** connection and shows a
distinct warning when one is present:

- Title and body are unchanged for first-time connects: "Continue" is
  the confirm label.
- When the user has previously installed the Claude GitHub App on
  `claude.ai`, the dialog renders an additional warning paragraph
  (color "warning"), and the confirm button is renamed
  **"Replace connection"** to make the destructive side-effect explicit.

The warning text reads:

> You're already connected via the GitHub App. Continuing replaces your
> authentication credential for Claude Code on the web. Your repository
> access will change to reflect your local token's scopes. You can
> reconnect the GitHub App from claude.ai/settings/connectors later.

This addresses cases where a user had set up the Claude GitHub App
(a *server-side* installation that has its own list of repos and a
scoped permissions token) and would replace it accidentally with their
much broader (often `repo`-wide) local `gh auth` token, silently
*expanding* their remote agent's access without being told.

## Source: detect existing OAuth

```javascript
// ============================================
// getExistingGithubAuthSource - probe sync endpoint for existing auth
// Location: cli_inner_pretty.js:507916-507936
// ============================================

// ORIGINAL (for source lookup):
async function Ek4() {
  let H, $;
  try {
    ({ accessToken: H, orgUUID: $ } = await LV());
  } catch {
    return null;
  }
  let q = `${KK().BASE_API_URL}/api/oauth/organizations/${$}/sync/github/auth`;
  try {
    let K = await o8.get(q, {
      headers: { ...OM(H), "x-organization-uuid": $ },
      timeout: 1e4,
      validateStatus: () => !0,
    });
    if (K.status !== 200 || !K.data?.is_authenticated) return null;
    let _ = K.data.auth_source;
    return _ === "oauth" || _ === "cli_import" ? _ : null;
  } catch {
    return null;
  }
}

// READABLE (for understanding):
async function getExistingGithubAuthSource() {
  let accessToken, orgUUID;
  try {
    ({ accessToken, orgUUID } = await getOAuthCredentials());
  } catch {
    return null;                                  // not signed in to Claude
  }
  const endpoint = `${getApiConfig().BASE_API_URL}/api/oauth/organizations/${orgUUID}/sync/github/auth`;
  try {
    const response = await httpClient.get(endpoint, {
      headers: { ...authHeaders(accessToken), "x-organization-uuid": orgUUID },
      timeout: 10_000,
      validateStatus: () => true,                 // we'll inspect manually
    });
    if (response.status !== 200 || !response.data?.is_authenticated) {
      return null;
    }
    // The server reports one of "oauth" (GitHub App) or "cli_import"
    // (previous /web-setup result). Anything else → treat as "no existing".
    const authSource = response.data.auth_source;
    return authSource === "oauth" || authSource === "cli_import" ? authSource : null;
  } catch {
    return null;                                  // network errors → treat as "no existing"
  }
}

// Mapping: Ek4→getExistingGithubAuthSource, LV→getOAuthCredentials, KK→getApiConfig,
//          o8→httpClient, OM→authHeaders
```

The function is **soft-failing**: any error returns `null`, which means
the warning is suppressed and the dialog falls back to the first-time
"Continue" flow. This is intentional — we don't want to block users
from web-setup just because the auth-state probe fails.

## Source: the confirmation dialog

```javascript
// ============================================
// WebSetupConfirmDialog - renders "Connect GitHub" with optional replace warning
// Location: cli_inner_pretty.js:507995-508096
// ============================================

// ORIGINAL (for source lookup):
function QR5({ onDone: H }) {
  let [$, q] = OsH.useState({ name: "checking" }),
    K = OsH.useRef(!1);
  OsH.useEffect(() => {
    (d("tengu_remote_setup_started", {}),
      FR5().then(async (Y) => {
        if (K.current) return;
        switch (Y.status) {
          case "not_signed_in": /* … */ return;
          case "gh_not_installed":
          case "gh_not_authenticated": /* … */ return;
          case "has_gh_token": {
            let f = await Ek4();
            if (K.current) return;
            q({ name: "confirm", token: Y.token, existingOAuth: f === "oauth" });
          }
        }
      }));
  }, []);
  /* … */
  return b2.createElement(N8, { title: "Connect Claude on the web to GitHub?", onCancel: _, hideInputGuide: !0 },
    b2.createElement(p, { flexDirection: "column" },
      b2.createElement(k, null, "Claude on the web requires connecting to your GitHub account to clone and push code on your behalf."),
      b2.createElement(k, { dimColor: !0 }, "Your local credentials are used to authenticate with GitHub"),
      $.existingOAuth &&
        b2.createElement(p, { marginTop: 1 },
          b2.createElement(k, { color: "warning" },
            "You're already connected via the GitHub App. Continuing replaces your authentication credential for Claude Code on the web. Your repository access will change to reflect your local token's scopes. You can reconnect the GitHub App from claude.ai/settings/connectors later."))),
    b2.createElement(P9, {
      confirmLabel: $.existingOAuth ? "Replace connection" : "Continue",
      cancelLabel: "Cancel",
      onConfirm: () => void A(z),
      onCancel: _,
    }));
}

// READABLE (for understanding):
function WebSetupConfirmDialog({ onDone }) {
  const [state, setState] = React.useState({ name: "checking" });
  const cancelled = React.useRef(false);

  // Phase 1: probe the local `gh` CLI for a token, AND probe the
  // server for an existing GitHub App OAuth credential. Run these
  // sequentially so the existingOAuth flag is known by the time we
  // render the confirm step.
  React.useEffect(() => {
    emitTelemetry("tengu_remote_setup_started", {});
    probeLocalGhToken().then(async (probe) => {
      if (cancelled.current) return;
      switch (probe.status) {
        case "not_signed_in":
          onDone("Not signed in to Claude. Run /login first.");
          return;
        case "gh_not_installed":
        case "gh_not_authenticated":
          // Open browser fallback, then error out with directions.
          /* unchanged from v2.1.141 */
          return;
        case "has_gh_token": {
          // v2.1.142: probe server-side auth state to detect existing
          // GitHub App OAuth credential. existingOAuth flag drives both
          // the warning text and the confirm-button label.
          const existing = await getExistingGithubAuthSource();
          if (cancelled.current) return;
          setState({
            name:           "confirm",
            token:          probe.token,
            existingOAuth:  existing === "oauth",   // "cli_import" doesn't count
                                                    // because it overwrites
                                                    // another /web-setup result,
                                                    // not a GitHub App.
          });
        }
      }
    });
  }, []);

  /* checking + uploading branches render a spinner; omitted */

  return <ConfirmDialog title="Connect Claude on the web to GitHub?" onCancel={cancel} hideInputGuide>
    <Box flexDirection="column">
      <Text>Claude on the web requires connecting to your GitHub account to clone and push code on your behalf.</Text>
      <Text dimColor>Your local credentials are used to authenticate with GitHub</Text>

      {/* v2.1.142: warning paragraph only when an existing GitHub App connection is detected */}
      {state.existingOAuth && (
        <Box marginTop={1}>
          <Text color="warning">
            You're already connected via the GitHub App. Continuing replaces your
            authentication credential for Claude Code on the web. Your repository
            access will change to reflect your local token's scopes. You can
            reconnect the GitHub App from claude.ai/settings/connectors later.
          </Text>
        </Box>
      )}
    </Box>

    <ConfirmButtons
      confirmLabel={state.existingOAuth ? "Replace connection" : "Continue"}
      cancelLabel="Cancel"
      onConfirm={() => void uploadTokenAndOpen(state.token)}
      onCancel={cancel}
    />
  </ConfirmDialog>;
}

// Mapping: QR5→WebSetupConfirmDialog, H→onDone, OsH→React, K.current→cancelled.current,
//          FR5→probeLocalGhToken, Ek4→getExistingGithubAuthSource, d→emitTelemetry,
//          N8→ConfirmDialog, p→Box, k→Text, P9→ConfirmButtons,
//          A→uploadTokenAndOpen, z→state.token, _→cancel
```

## Source: command registration

```javascript
// ============================================
// webSetupCommandDef - /web-setup slash command registration
// Location: cli_inner_pretty.js:508122-508134
// ============================================

// ORIGINAL (for source lookup):
cR5 = {
  type: "local-jsx",
  name: "web-setup",
  description: "Setup Claude Code on the web (requires connecting your GitHub account)",
  availability: ["claude-ai"],
  isEnabled: () => Z$("tengu_cobalt_lantern", !1) && S4("allow_remote_sessions") && S4("allow_quick_web_setup"),
  get isHidden() {
    return !S4("allow_remote_sessions") || !S4("allow_quick_web_setup");
  },
  load: () => Promise.resolve().then(() => (Ik4(), hk4)),
};

// READABLE (for understanding):
const webSetupCommandDef = {
  type:        "local-jsx",
  name:        "web-setup",
  description: "Setup Claude Code on the web (requires connecting your GitHub account)",
  // Only visible on the claude.ai login path — not console / first-party API.
  availability: ["claude-ai"],
  // Triple gate: server feature flag + two user-setting booleans.
  isEnabled: () =>
    getFeatureFlag("tengu_cobalt_lantern", false) &&
    isFeatureEnabled("allow_remote_sessions") &&
    isFeatureEnabled("allow_quick_web_setup"),
  // Hide when either setting is off — even if the feature flag turned the
  // command "on" at the registry level. (Settings can disable per-user.)
  get isHidden() {
    return !isFeatureEnabled("allow_remote_sessions") ||
           !isFeatureEnabled("allow_quick_web_setup");
  },
  load: () => Promise.resolve().then(() => (loadWebSetupModule(), webSetupExports)),
};

// Mapping: cR5→webSetupCommandDef, Z$→getFeatureFlag, S4→isFeatureEnabled,
//          Ik4→loadWebSetupModule, hk4→webSetupExports
```

## Why this approach

### Why detect existing OAuth instead of just warning unconditionally?

**What it does:** The dialog probes the server's
`/api/oauth/organizations/<org>/sync/github/auth` endpoint to ask
"is this user *already* connected to GitHub via the Claude GitHub App?"
and only renders the warning when the answer is "yes via OAuth."

**How it works:**
1. After confirming the local `gh` CLI has a token, the dialog calls
   `getExistingGithubAuthSource()` before transitioning into the confirm
   step.
2. That function reads the user's Claude OAuth credentials (`LV()` →
   `accessToken`/`orgUUID`), then issues a GET to the sync-auth endpoint.
3. The server responds with `auth_source`: `"oauth"` (GitHub App
   installed), `"cli_import"` (previous `/web-setup`), or absent (not
   connected).
4. Only `"oauth"` triggers the warning — `"cli_import"` would be a
   re-run of `/web-setup`, which doesn't replace a GitHub App.

**Why this approach:**
- **First-time users see no extra text**: clutter-free for the common
  case.
- **Replacing an OAuth-installed app is genuinely destructive**: the
  user loses the App's repo-scoped access list and inherits the (often
  broader) scopes of their personal `gh auth` token. They need to know.
- **Replacing a previous CLI-import is benign**: it just refreshes the
  token. No warning needed.

**Key insight:** The probe and the dialog state are decoupled — the
warning text is rendered conditionally on `state.existingOAuth`, set
during the async probe. If the probe fails (network error / timeout /
not signed in), `existingOAuth` stays false and the dialog degrades
gracefully to the first-time prompt. This avoids blocking the entire
flow on a server probe that might fail for unrelated reasons.

### Why a "Replace connection" button label, not just an Esc-to-cancel hint?

The label change does double duty:
1. **Repetition removal**: the warning paragraph already explains what
   continuing will do; the button label confirms it at click time.
2. **Mouse / read-only audit**: screen readers and users who scan only
   the button text get the destructive semantic even without reading
   the paragraph.

The pairing — color-warning paragraph + renamed confirm button — is a
standard "destructive action confirm" pattern from web-UI dialogs,
adapted for the TUI. See also v2.1.118's "Continue" / "Don't ask again"
parallel buttons (similar pattern: two actions, both labeled to
distinguish destructive vs. continuation paths).

## v2.1.112 baseline

`/web-setup` did not exist in v2.1.112. It was added in v2.1.141 (per
the `cobalt_lantern` feature flag rollout). The pre-replace warning
landed in v2.1.142 — the very next release — making this a fast
hardening of a brand-new feature.

The v2.1.88 TS source has no analogue (the feature is post-baseline).

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Slash Commands

Key symbols in this document:

- `webSetupCommandDef` (`cR5`) — slash command registration; `cli_inner_pretty.js:508122-508133`
- `WebSetupConfirmDialog` (`QR5`) — interactive dialog component; `cli_inner_pretty.js:507995-508096`
- `getExistingGithubAuthSource` (`Ek4`) — server probe for existing OAuth; `cli_inner_pretty.js:507916-507936`
- `probeLocalGhToken` (`FR5`) — local `gh` token probe; `cli_inner_pretty.js:507968-507982`
- `uploadGithubTokenForSync` (`kk4`) — uploads token to claude.ai; `cli_inner_pretty.js:507886-507914`
- `tengu_cobalt_lantern` — feature flag gating the whole command
- `tengu_remote_setup_started` / `tengu_remote_setup_result` — telemetry events for funnel analysis

## Testing notes

Observable behaviour:

1. With **no** prior GitHub App connection: the dialog body shows two
   lines + the "Continue" button.
2. With a **GitHub App** OAuth connection (i.e. the user clicked
   "Install Claude GitHub App" on claude.ai previously): the dialog
   body adds a warning-color paragraph, and the confirm button reads
   **"Replace connection"**.
3. With a **prior `/web-setup` token-sync** (`cli_import` auth source):
   the dialog falls back to first-time mode (`existingOAuth = false`).
4. If the auth probe times out (>10s) or fails: dialog falls back to
   first-time mode silently — user is *not* blocked.
5. If the user is not signed in to Claude (no OAuth credentials): the
   probe returns null *before* the network call, again falling back to
   first-time mode.

Esc dismissal of the dialog was separately fixed in v2.1.142 (along
with `/install-github-app`, `/desktop`, `/resume`) by connecting the
Esc handler in the shared dialog component — see
[slash_command_consistency.md](./slash_command_consistency.md).
