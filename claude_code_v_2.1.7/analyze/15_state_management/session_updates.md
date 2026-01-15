# Session Management Updates (2.1.7)

> **NEW in 2.0.64** - Named session support (/rename)
> **NEW in 2.1.0** - /teleport and /remote-env commands

---

## Overview

Session management improvements enable:
1. **Named sessions** - Find conversations easily with /rename
2. **Teleport** - Resume remote sessions across machines
3. **Session grouping** - Sessions grouped by project in /resume

---

## Named Sessions (/rename)

### Rename Function

```javascript
// ============================================
// renameSession - Set custom title for session
// Location: chunks.148.mjs:1237-1247
// ============================================

// ORIGINAL (for source lookup):
async function Vz1(A, Q, B) {
  let G = B ?? Bw(A);
  if (qP0(G, A, {
      type: "custom-title",
      customTitle: Q,
      sessionId: A
    }, {
      customTitle: Q
    }), A === q0()) vU().currentSessionTitle = Q;
  l("tengu_session_renamed", {})
}

// READABLE (for understanding):
async function renameSession(sessionId, customTitle, storage) {
  let sessionStorage = storage ?? getSessionStorage(sessionId);

  // Save custom title to storage
  saveSessionMetadata(sessionStorage, sessionId, {
    type: "custom-title",
    customTitle: customTitle,
    sessionId: sessionId
  }, {
    customTitle: customTitle
  });

  // Update current session state if this is the active session
  if (sessionId === getCurrentSessionId()) {
    getGlobalState().currentSessionTitle = customTitle;
  }

  trackEvent("tengu_session_renamed", {});
}

// Mapping: Vz1→renameSession, A→sessionId, Q→customTitle, B→storage
// Bw→getSessionStorage, qP0→saveSessionMetadata, q0→getCurrentSessionId, vU→getGlobalState
```

### Usage

```
/rename my-feature-work

# Now visible in /resume as:
# my-feature-work (2 hours ago)
```

---

## Teleport System

### Resume Remote Session

```javascript
// ============================================
// resumeTeleportSession - Resume session from remote
// Location: chunks.120.mjs:3274-3319
// ============================================

// ORIGINAL (for source lookup):
async function Yt(A, Q) {
  k(`Resuming code session ID: ${A}`);
  try {
    let B = g4()?.accessToken;
    if (!B) throw l("tengu_teleport_resume_error", {
      error_type: "no_access_token"
    }), Error("Claude Code web sessions require authentication...");

    let G = await Wv();
    if (!G) throw l("tengu_teleport_resume_error", {
      error_type: "no_org_uuid"
    }), Error("Unable to get organization UUID...");

    Q?.("validating");
    let Z = await xkA(A),
      Y = await Xq0(Z);

    switch (Y.status) {
      case "match":
      case "no_repo_required":
        break;
      case "not_in_repo":
        throw new uK(`You must run claude --teleport ${A} from a checkout of ${Y.sessionRepo}.`);
      case "mismatch":
        throw new uK(`You must run from ${Y.sessionRepo}, not ${Y.currentRepo}.`);
      // ...
    }
    return await Vi5(A, G, B, Q, Z)
  } catch (B) {
    // Error handling
  }
}

// READABLE (for understanding):
async function resumeTeleportSession(sessionId, progressCallback) {
  logDebug(`Resuming code session ID: ${sessionId}`);
  try {
    // Require Claude.ai authentication (not API key)
    let accessToken = getAuthInfo()?.accessToken;
    if (!accessToken) {
      trackEvent("tengu_teleport_resume_error", { error_type: "no_access_token" });
      throw Error("Claude Code web sessions require authentication with Claude.ai account.");
    }

    // Get org UUID for session URL
    let orgUuid = await getOrganizationUuid();
    if (!orgUuid) {
      trackEvent("tengu_teleport_resume_error", { error_type: "no_org_uuid" });
      throw Error("Unable to get organization UUID");
    }

    progressCallback?.("validating");

    // Fetch session details and validate repository
    let sessionData = await fetchSessionData(sessionId);
    let repoValidation = await validateSessionRepository(sessionData);

    switch (repoValidation.status) {
      case "match":
      case "no_repo_required":
        break;  // Proceed
      case "not_in_repo":
        throw new UserError(`Must run from checkout of ${repoValidation.sessionRepo}`);
      case "mismatch":
        throw new UserError(`Must run from ${repoValidation.sessionRepo}, not ${repoValidation.currentRepo}`);
    }

    // Resume the session
    return await executeResume(sessionId, orgUuid, accessToken, progressCallback, sessionData);
  } catch (error) {
    // Error handling and telemetry
  }
}

// Mapping: Yt→resumeTeleportSession, A→sessionId, Q→progressCallback
// g4→getAuthInfo, Wv→getOrganizationUuid, xkA→fetchSessionData, Xq0→validateSessionRepository
```

### Repository Validation

```javascript
// ============================================
// validateSessionRepository - Check if in correct repo for session
// Location: chunks.120.mjs:3247-3272
// ============================================

// ORIGINAL:
async function Xq0(A) {
  let Q = await aS(),
    B = A.session_context.sources.find((Z) => Z.type === "git_repository");
  if (!B?.url) return {
    status: "no_repo_required"
  };
  let G = w6A(B.url);
  if (!G) return {
    status: "no_repo_required"
  };
  if (!Q) return {
    status: "not_in_repo",
    sessionRepo: G,
    currentRepo: null
  };
  if (Q.toLowerCase() === G.toLowerCase()) return {
    status: "match"
  };
  return {
    status: "mismatch",
    sessionRepo: G,
    currentRepo: Q
  }
}

// READABLE:
async function validateSessionRepository(sessionData) {
  let currentRepo = await getCurrentGitRepository();
  let gitSource = sessionData.session_context.sources.find(s => s.type === "git_repository");

  // No repo requirement
  if (!gitSource?.url) return { status: "no_repo_required" };
  let sessionRepo = extractRepoName(gitSource.url);
  if (!sessionRepo) return { status: "no_repo_required" };

  // Not in any git repo
  if (!currentRepo) return {
    status: "not_in_repo",
    sessionRepo,
    currentRepo: null
  };

  // Check match (case-insensitive)
  if (currentRepo.toLowerCase() === sessionRepo.toLowerCase()) {
    return { status: "match", sessionRepo, currentRepo };
  }

  // Repo mismatch
  return { status: "mismatch", sessionRepo, currentRepo };
}

// Mapping: Xq0→validateSessionRepository, aS→getCurrentGitRepository, w6A→extractRepoName
```

### Validation Statuses

| Status | Description | Action |
|--------|-------------|--------|
| `match` | Current repo matches session repo | Proceed |
| `no_repo_required` | Session not tied to repo | Proceed |
| `not_in_repo` | Must be in specific repo | Error + guidance |
| `mismatch` | In wrong repo | Error + guidance |

---

## Teleport Flow

```
┌────────────────────────────────────────────────────────────────┐
│                    Teleport Resume Flow                         │
│                                                                 │
│  1. claude --teleport <session_id>                              │
│                    │                                            │
│                    v                                            │
│  2. Check Claude.ai Authentication                              │
│                    │                                            │
│                    v                                            │
│  3. Fetch Session Data (API)                                    │
│                    │                                            │
│                    v                                            │
│  4. Validate Repository                                         │
│     ├─ match ──────────┐                                        │
│     ├─ no_repo_required │                                       │
│     ├─ not_in_repo ─── Error: "cd to repo first"               │
│     └─ mismatch ────── Error: "wrong repo"                     │
│                        │                                        │
│                        v                                        │
│  5. Check Git Status (clean working directory)                  │
│     ├─ clean ─────────┐                                         │
│     └─ dirty ──────── Offer: "Stash changes?"                  │
│                       │                                         │
│                       v                                         │
│  6. Resume Session (branch checkout if needed)                  │
└────────────────────────────────────────────────────────────────┘
```

---

## Session Tagging

```javascript
// ============================================
// tagSession - Add tag to session
// Location: chunks.148.mjs:1249-1258
// ============================================

// ORIGINAL:
async function bT0(A, Q, B) {
  let G = B ?? Bw(A);
  if (qP0(G, A, {
      type: "tag",
      tag: Q,
      sessionId: A
    }, {
      tag: Q
    }), A === q0()) vU().currentSessionTag = Q;
  l("tengu_session_tagged", {})
}

// READABLE:
async function tagSession(sessionId, tag, storage) {
  let sessionStorage = storage ?? getSessionStorage(sessionId);
  saveSessionMetadata(sessionStorage, sessionId, {
    type: "tag",
    tag: tag,
    sessionId: sessionId
  }, { tag });

  if (sessionId === getCurrentSessionId()) {
    getGlobalState().currentSessionTag = tag;
  }
  trackEvent("tengu_session_tagged", {});
}

// Mapping: bT0→tagSession
```

---

## Related Commands

| Command | Description |
|---------|-------------|
| `/rename <name>` | Set custom session name |
| `/resume` | List and resume past sessions |
| `/resume <name>` | Resume session by name |
| `--teleport <id>` | Resume web session locally |

---

## Related Symbols

> Symbol mappings: [symbol_index_infra.md](../00_overview/symbol_index_infra.md)

Key functions in this document:
- `renameSession` (Vz1) - Set custom session title
- `tagSession` (bT0) - Add tag to session
- `resumeTeleportSession` (Yt) - Resume remote session
- `validateSessionRepository` (Xq0) - Check repo match
- `getSessionStorage` (Bw) - Get session storage instance
- `getCurrentSessionId` (q0) - Get active session ID

---

## See Also

- [../09_slash_command/](../09_slash_command/) - /rename, /resume commands
- [../24_auth/](../24_auth/) - Claude.ai authentication for teleport

