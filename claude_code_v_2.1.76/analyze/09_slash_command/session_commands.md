# Session Commands — `/login`, `/logout`, `/init`

## Overview

The session commands manage authentication and project initialization:

- **`/login`**: Authenticate with an Anthropic account
- **`/logout`**: Sign out from the current account
- **`/init`**: Create a CLAUDE.md project documentation file

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure (Auth)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (Slash Commands)

Key functions in this document:
- `loginCommand` - The `/login` command definition
- `logoutCommand` - The `/logout` command definition
- `initCommand` (gdY) - The `/init` command definition
- `getPromptForCommand` - Generates the init prompt

---

## `/login` Command

### Command Definition

**What it does:** Authenticates the user with their Anthropic account, or switches between accounts if already logged in.

```javascript
// ============================================
// loginCommand - /login command definition
// Location: chunks.153.mjs:2468-2478
// ============================================

// ORIGINAL (for source lookup):
lzq = () => ({
    type: "local-jsx",
    name: "login",
    description: RU8() ? "Switch Anthropic accounts" : "Sign in with your Anthropic account",
    isEnabled: () => !process.env.DISABLE_LOGIN_COMMAND,
    isHidden: !1,
    load: () => Promise.resolve().then(() => (xv1(), gU4)),
    userFacingName() {
        return "login"
    }
})

// READABLE (for understanding):
const loginCommand = () => ({
    type: "local-jsx",
    name: "login",
    description: isLoggedIn() ? "Switch Anthropic accounts" : "Sign in with your Anthropic account",
    isEnabled: () => !process.env.DISABLE_LOGIN_COMMAND,
    isHidden: false,
    load: () => Promise.resolve().then(() => (initializeLoginModule(), loginHandlerModule)),
    userFacingName() {
        return "login"
    }
})

// Mapping: lzq→loginCommand, RU8→isLoggedIn, xv1→initializeLoginModule, gU4→loginHandlerModule
```

**Key features:**
- **Dynamic description**: Shows "Switch" if already logged in, "Sign in" otherwise
- **DISABLE_LOGIN_COMMAND env var**: Can disable the command in enterprise deployments
- **Interactive UI**: `local-jsx` type provides account selection dialog

### DISABLE_LOGIN_COMMAND Environment Variable

When `DISABLE_LOGIN_COMMAND=true`:

1. The `/login` command is hidden from the command list
2. `isEnabled()` returns false
3. Attempting to run `/login` shows: `"Login command is disabled"`

**Why this env var:** Enterprise deployments using API keys or service accounts may want to prevent users from logging in with personal accounts.

### Login Flow

```
/login
    │
    ▼
Check DISABLE_LOGIN_COMMAND → If set, show error
    │
    ▼
Check current auth state
    │
    ├── Not logged in → Show sign-in UI
    │   │
    │   ├── Browser-based OAuth flow
    │   │
    │   ├── API key entry (alternative)
    │   │
    │   └── Store credentials
    │
    └── Already logged in → Show account switcher
        │
        ├── List available accounts
        │
        └── Select account → Switch session
```

### Account Types

| Account Type | Authentication Method |
|--------------|----------------------|
| Personal | OAuth via browser |
| Organization | OAuth with org selection |
| API Key | Direct key entry |
| Service Account | Environment variable |

---

## `/logout` Command

### Command Definition

**What it does:** Signs the user out from their current Anthropic account session.

```javascript
// ============================================
// logoutCommand - /logout command definition
// Location: chunks.153.mjs:2486-2497
// ============================================

// ORIGINAL (for source lookup):
nzq = {
    type: "local-jsx",
    name: "logout",
    description: "Sign out from your Anthropic account",
    isEnabled: () => !process.env.DISABLE_LOGOUT_COMMAND,
    isHidden: !1,
    load: () => Promise.resolve().then(() => (Nb8(), cQ4)),
    userFacingName() {
        return "logout"
    }
}

// READABLE (for understanding):
const logoutCommand = {
    type: "local-jsx",
    name: "logout",
    description: "Sign out from your Anthropic account",
    isEnabled: () => !process.env.DISABLE_LOGOUT_COMMAND,
    isHidden: false,
    load: () => Promise.resolve().then(() => (initializeLogoutModule(), logoutHandlerModule)),
    userFacingName() {
        return "logout"
    }
}

// Mapping: nzq→logoutCommand, Nb8→initializeLogoutModule, cQ4→logoutHandlerModule
```

### DISABLE_LOGOUT_COMMAND Environment Variable

When `DISABLE_LOGOUT_COMMAND=true`:

1. The `/logout` command is hidden
2. `isEnabled()` returns false
3. Prevents accidental sign-out in shared environments

**Why separate from DISABLE_LOGIN_COMMAND:** Some deployments may allow login (for account switching) but prevent logout (to maintain authentication state).

### Logout Flow

```
/logout
    │
    ▼
Check DISABLE_LOGOUT_COMMAND → If set, show error
    │
    ▼
Show confirmation dialog
    │
    ├── Cancel → Return to session
    │
    └── Confirm → Clear credentials
        │
        ├── Remove stored auth tokens
        │
        ├── Clear session state
        │
        └── Show sign-in prompt
```

---

## `/init` Command

### Command Definition

**What it does:** Analyzes the current codebase and creates a CLAUDE.md file with project documentation for future Claude Code instances.

```javascript
// ============================================
// initCommand - /init command definition
// Location: chunks.153.mjs:2075-2115
// ============================================

// ORIGINAL (for source lookup):
gdY = {
    type: "prompt",
    name: "init",
    description: "Initialize a new CLAUDE.md file with codebase documentation",
    contentLength: 0,
    isEnabled: () => !0,
    isHidden: !1,
    progressMessage: "analyzing your codebase",
    userFacingName() {
        return "init"
    },
    source: "builtin",
    async getPromptForCommand() {
        return h06(), [{
            type: "text",
            text: `Please analyze this codebase and create a CLAUDE.md file...`
        }]
    }
}

// READABLE (for understanding):
const initCommand = {
    type: "prompt",
    name: "init",
    description: "Initialize a new CLAUDE.md file with codebase documentation",
    contentLength: 0,
    isEnabled: () => true,
    isHidden: false,
    progressMessage: "analyzing your codebase",
    userFacingName() {
        return "init"
    },
    source: "builtin",
    async getPromptForCommand() {
        return [{
            type: "text",
            text: `Please analyze this codebase and create a CLAUDE.md file, which will be given to future instances of Claude Code to operate in this repository.

What to add:
1. Commands that will be commonly used, such as how to build, lint, and run tests...
2. High-level code architecture and structure...

Usage notes:
- If there's already a CLAUDE.md, suggest improvements to it.
- When you make the initial CLAUDE.md, do not repeat yourself...
- Avoid listing every component or file structure that can be easily discovered.
- Don't include generic development practices.
- If there are Cursor rules or Copilot rules, make sure to include the important parts.
- If there is a README.md, make sure to include the important parts.
- Do not make up information...`
        }]
    }
}

// Mapping: gdY→initCommand, h06→initializePromptHelpers
```

**Key features:**
- **Type `prompt`**: Invokes the LLM to analyze the codebase
- **Progress message**: Shows "analyzing your codebase" during execution
- **Smart prompt**: Instructs LLM to avoid redundancy and focus on useful information

### Init Prompt Strategy

**What the prompt instructs the LLM to include:**

1. **Build/test/lint commands** — How to work with the codebase
2. **Architecture overview** — High-level structure that requires reading multiple files
3. **Existing configuration** — Integrate with Cursor rules, Copilot instructions, README

**What the prompt explicitly avoids:**

1. **Generic practices** — No "write good code" advice
2. **File listings** — Discoverable via file exploration
3. **Made-up sections** — No "Common Development Tasks" unless explicitly documented
4. **Repetition** — No restating obvious instructions

### Execution Flow

```
/init
    │
    ▼
parseSlashCommand → { commandName: "init", args: "" }
    │
    ▼
executeCommand → type === "prompt"
    │
    ▼
handlePromptCommand (Wb4)
    │
    ├── getPromptForCommand() → Returns init prompt
    │
    ├── LLM analyzes codebase
    │   │
    │   ├── Reads README.md, package.json, etc.
    │   ├── Explores directory structure
    │   ├── Identifies build tools
    │   └── Checks for existing rules files
    │
    └── LLM writes CLAUDE.md file
```

### CLAUDE.md File Structure

The generated file follows this structure:

```markdown
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
[Build, test, lint commands discovered from package.json, Makefile, etc.]

## Architecture
[High-level architecture description]

## Key Conventions
[Project-specific conventions discovered from code]

## External Integrations
[Any existing Cursor rules, Copilot instructions, etc.]
```

---

## Comparison Table

| Command | Type | Auth Required | Env Control |
|---------|------|---------------|-------------|
| `/login` | `local-jsx` | No | DISABLE_LOGIN_COMMAND |
| `/logout` | `local-jsx` | Yes | DISABLE_LOGOUT_COMMAND |
| `/init` | `prompt` | No | None |

**Design rationale:**
- `/login` and `/logout` are `local-jsx` for interactive UI dialogs
- `/init` is `prompt` to leverage LLM analysis capabilities
- Separate env vars allow fine-grained enterprise control

---

## Security Considerations

### Credential Storage

Authentication credentials are stored securely:

| Platform | Storage Method |
|----------|---------------|
| macOS | Keychain |
| Linux | Secret Service API / encrypted file |
| Windows | Credential Manager |

### Token Refresh

- Access tokens are short-lived
- Refresh tokens automatically renew access
- Logout revokes both tokens

### Multi-Account Support

The login command supports switching between accounts:

1. List stored accounts
2. Select account to switch to
3. New session uses selected account's credentials