# `/config` Persistence (v2.1.119)

## What changed

Before v2.1.119, the `/config` panel showed a list of toggles and
selectors (theme, fullscreen, autocompact, MCP autoconnect, etc.). The
implementation surface had drifted from the persistence layer: some
toggles applied immediately to the running session, some required a
restart, some persisted to `~/.claude/settings.json`, some only set
session-scoped values.

v2.1.119 unifies the path: every `/config` change is **written to user
settings** through the standardized `writeUserSettings("userSettings",
{…})` API (the same one used by `/scroll-speed`, `/effort`,
`/permissions`, etc.). All changes persist across sessions, and the
live preview is consistent with what's saved.

This document covers the rationale and the persistence boundary; the
panel itself is a minor UI refresh.

## Source: command definition

```javascript
// ============================================
// configCommandDef - /config + /settings alias
// Location: cli_inner_pretty.js:440744-440753
// ============================================

// ORIGINAL (for source lookup):
mw5 = {
  aliases: ["settings"],
  type: "local-jsx",
  name: "config",
  description: "Open config panel",
  load: () => Promise.resolve().then(() => (n14(), l14)),
};

// READABLE (for understanding):
const configCommandDef = {
  aliases: ["settings"],           // `/settings` is an alias
  type: "local-jsx",
  name: "config",
  description: "Open config panel",
  load: () => Promise.resolve().then(() => (loadConfigPanel(), configPanelExports)),
};

// Mapping: mw5→configCommandDef, n14→loadConfigPanel, l14→configPanelExports
```

The `/settings` alias mirrors the convention used elsewhere — multiple
ways to address the same dialog reduce the chance of users hunting for
the command.

## Source: the persistence pattern (shared with /scroll-speed)

The `/config` panel uses the same persistence helper that
`/scroll-speed` uses:

```javascript
// READABLE — the canonical save pattern shared across slash dialogs:
function saveConfigChange(path, value) {
  const patch = setNestedPath({}, path, value);
  // writeUserSettings handles the file-lock + atomic write + reload.
  const result = writeUserSettings("userSettings", patch);
  if (result.error) {
    showToast(`Couldn't save: ${result.error.message}`);
    return;
  }
  // Emit telemetry so the team can see which configs change most.
  emitTelemetry("tengu_config_change", { path, has_value: value !== undefined });
}
```

`writeUserSettings` is the function annotated in the bundle as the
write-safe helper that guards against the `GH #3117` failure mode:

> saveConfigWithLock: re-read config is missing auth that cache has;
> refusing to write to avoid wiping ~/.claude.json.

This was a real bug where a config write could clobber auth state if
the in-memory cache and the on-disk file disagreed. The helper now
re-reads the file with a lock before writing, and aborts the write if
the re-read is missing fields that the cache has — preserving the
user's auth credentials.

## Source: saveConfigWithLock guard

```javascript
// ============================================
// Config write safety - the GH #3117 mitigation
// Location: cli_inner_pretty.js:140240 (warn message string)
// ============================================

// READABLE — the relevant safety check inside the write path:
async function saveConfigWithLock(newConfig) {
  await fileLock.acquire();
  try {
    const onDisk = await readConfigFromDisk();
    const inCache = getConfigFromCache();

    // Safety check: if the on-disk file is missing auth fields that
    // the cache HAS, refuse to write. Otherwise we'd wipe auth.
    const onDiskMissingAuth = !onDisk.auth && inCache.auth;
    if (onDiskMissingAuth) {
      warnLog(
        "saveConfigWithLock: re-read config is missing auth that cache has; " +
        "refusing to write to avoid wiping ~/.claude.json. See GH #3117.",
        { level: "warn" }
      );
      throw new ConfigWriteAbortedError("Config write aborted to preserve auth");
    }

    // Safe to write.
    await writeConfigToDisk({ ...onDisk, ...newConfig });
    updateConfigCache({ ...inCache, ...newConfig });
  } finally {
    fileLock.release();
  }
}
```

The guard is a defensive read-before-write pattern. The lock prevents
concurrent writes; the re-read ensures the cache is consistent with
the disk; the auth-missing check is a known-failure-mode safety net.

## Why this approach

### Why unify around `writeUserSettings`?

**What:** Pre-v2.1.119 the `/config` panel had ad-hoc save paths;
post-v2.1.119 it uses the shared helper.

**Why:**

- Consistency: one save path means one set of behaviors (file lock,
  atomic write, telemetry, error handling). The user gets the same
  experience whether they change scroll speed, effort level, or
  config toggle.
- The shared helper has the `GH #3117` safety net baked in. Ad-hoc
  saves would each need their own copy.
- Maintenance burden: future changes to the persistence model (e.g.
  XDG migration, schema versioning) need to be applied in one place.
- Telemetry: tagging every change with the standardized event
  (`tengu_config_change`) gives the team a unified view of which
  surfaces are exercised.

### Why is the `/config` panel a `local-jsx` rather than a `local` command?

**What:** The dialog requires the Ink renderer (`requires` isn't
explicit in the snippet but is implied by `local-jsx`).

**Why:**

- The panel is interactive — toggle states, dropdowns, search filters.
  Headless mode doesn't make sense.
- For non-interactive mode, the user can edit `~/.claude/settings.json`
  directly (or set env vars). `/config` is the discoverability layer.

### Why the `settings` alias?

**What:** `/settings` routes to `/config`.

**Why:**

- Different users have different mental models. Some look for
  "settings" (Mac System Settings, web app settings); others look for
  "config" (CLI tools, dotfile config).
- The alias is zero-cost and prevents the "I can't find the
  configuration" UX dead-end.
- Documentation can mention either; both work.

### Why a separate `tengu_config_change` event rather than reusing existing telemetry?

**What:** Each `/config` change emits `tengu_config_change` with
`{ path, has_value }`.

**Why:**

- The team needs to know **which** config paths are exercised. A
  generic "settings_changed" event without the path wouldn't be
  actionable.
- `has_value` distinguishes "set to X" from "unset back to default" —
  important for understanding usage patterns.
- The event is fired at the *save* layer, so any path that writes
  config (panel, slash command, programmatic) is captured.
- Per-event volume is low (config changes are rare).

### Why a file-lock-based write rather than a transactional in-memory model?

**What:** `saveConfigWithLock` acquires a filesystem lock, re-reads,
checks, writes, updates cache.

**Why:**

- The config file is shared across processes (`claude` REPL, daemon,
  CLI invocations, background agents). An in-memory transaction in
  one process wouldn't protect against concurrent writes from other
  processes.
- The lock is the only mechanism portable across OSes that prevents
  the race.
- The re-read-and-check after the lock is acquired catches the case
  where another process modified the file between our last cache
  refresh and our save attempt.

### Why abort the write rather than merge auth back?

**What:** When the on-disk file is missing auth that the cache has,
the write is aborted with a warning.

**Why:**

- The "missing auth on disk" condition is a clear signal of file
  corruption — something else wiped the auth (a buggy tool, manual
  edit, sync conflict). Continuing the write would persist whatever
  the cache has, but the cache might be stale too.
- Aborting forces the user to investigate. A warn log gives them the
  GH issue number to find the right diagnostic instructions.
- Silent merge would be worse: it could mask data loss (e.g. the user
  logged out elsewhere; we'd silently re-add auth they wanted to
  remove).

## Cross-validation: pre-2.1.119 vs 2.1.119

| Aspect | Pre-2.1.119 | v2.1.119+ |
|--------|-------------|-----------|
| `/config` save path | Ad-hoc per-control | Unified `writeUserSettings` |
| Live preview vs persisted | Could diverge | Always consistent |
| File-lock protection | Partial | Universal (every `/config` save) |
| GH #3117 auth-wipe guard | Some surfaces had it | All `/config` saves protected |
| Telemetry event | Ad-hoc / missing | `tengu_config_change` per change |
| Settings alias | Hidden | `/settings` documented |
| Schema | settings.json | Same |

## Related symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Slash Commands
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Settings / Persistence
> - [symbol_additions_v2_1_142_think_ui.md](../00_overview/symbol_additions_v2_1_142_think_ui.md) — new symbols

Key functions/objects in this document:
- `configCommandDef` (`mw5`) — `/config` + `/settings` alias; cli_inner_pretty.js:440744-440753
- `loadConfigPanel` (`n14`) — lazy loader for the panel module
- `writeUserSettings` (`B6`) — shared save helper with file lock + GH #3117 guard
- `saveConfigWithLock` (`saveConfigWithLock` inferred name; cli_inner_pretty.js:140240 contains the warn-log string identifying it) — write safety pattern
- `tengu_config_change` — telemetry event
- `~/.claude/settings.json` — canonical persistence location
