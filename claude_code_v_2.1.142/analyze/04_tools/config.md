# Config — Get/Set Claude Code Settings (Legacy Tool; Absorbed Into `/config` in v2.1.142)

> **Tool name:** `Config` (legacy)
> **Source:** `/lyz/codespace/3rd/claude-code/src/tools/ConfigTool/ConfigTool.ts` (2.1.88)
> **Status in v2.1.142:** The tool is **not registered in the v2.1.142 bundle**; configuration is now exclusively the `/config` slash command.

---

## Overview

In 2.1.88, `ConfigTool` was a model-callable tool that could read and write Claude Code settings (theme, model, `permissions.defaultMode`, voice, etc.). In v2.1.142 this surface was removed from the model's tool list and replaced with the `/config` slash command — the model can suggest it, but cannot directly modify settings.

---

## Legacy Schema (2.1.88)

```typescript
// From src/tools/ConfigTool/ConfigTool.ts

const inputSchema = lazySchema(() =>
  z.strictObject({
    setting: z.string().describe('The setting key (e.g., "theme", "model", "permissions.defaultMode")'),
    value: z.union([z.string(), z.boolean(), z.number()]).optional()
      .describe('The new value. Omit to get current value.'),
  }),
);

const outputSchema = lazySchema(() =>
  z.object({
    success: z.boolean(),
    operation: z.enum(['get', 'set']).optional(),
    setting: z.string().optional(),
    value: z.unknown().optional(),
    previousValue: z.unknown().optional(),
    newValue: z.unknown().optional(),
    error: z.string().optional(),
  }),
);

export const ConfigTool = buildTool({
  name: CONFIG_TOOL_NAME,
  searchHint: 'get or set Claude Code settings (theme, model)',
  // ...
  isReadOnly(input) {
    return input.value === undefined;  // GET is readonly, SET is not
  },
  async checkPermissions(input) {
    if (input.value === undefined) {
      return { behavior: 'allow', updatedInput: input };  // auto-allow reads
    }
    return {
      behavior: 'ask',                                   // ask for writes
      message: `Set ${input.setting} to ${value}`,
    };
  },
  // ... type coercion, validation, settings.json write, AppState sync ...
});
```

Key legacy behavior highlights:
- **GET** returned the current value (auto-allowed, no prompt).
- **SET** asked for permission and wrote to either `global` config or `userSettings`.
- **Special-case `remoteControlAtStartup`** accepted `"default"` to unset and fall back to platform default.
- **Voice settings** required pre-flight checks (mic permission, sox dependency, etc.) before the SET took effect.

---

## Why Removed?

**The model shouldn't be able to silently rewrite the user's settings.**

While SET went through a permission prompt, the prompt was prone to:
- **Confusion**: "Set theme to dark" sounds harmless, but "Set permissions.defaultMode to allowAll" could nullify the user's security policies.
- **Phishing-by-prompt**: A prompt-injection attack could induce Claude to suggest a settings change that the user might allow under the wrong premise.
- **Audit trail dilution**: Settings changes via tool calls mixed with the conversation; hunting for "what changed when" required scanning all tool_use entries.

**The fix: settings changes go through `/config`.** That command:
- Is invoked explicitly by the user (not by the model).
- Has its own UI (interactive picker / form), not a one-line tool_use.
- Records changes in a dedicated audit path.
- Can be gated by managed-settings policy on the admin side.

The model can still **suggest** settings to change ("you might want to try `/config theme=dark`") via SendUserMessage, but cannot enact them.

---

## Migration Path

| 2.1.88 ConfigTool call | v2.1.142 equivalent |
|------------------------|---------------------|
| `Config({setting: "theme"})` | `/config` interactive picker → user reads current value |
| `Config({setting: "theme", value: "dark"})` | Model says "use /config to set theme to dark"; user runs `/config` |
| Voice settings | `/voice` slash command; or directly in `/config` |

The `supportedSettings.ts` whitelist of settable settings still exists internally; it's just consulted by `/config` rather than the tool surface.

---

## Key Insights

**Removing the tool tightened the trust boundary.** Configuration is now firmly in the "user-initiated changes" lane. The model's role is to inform, not to mutate.

**The internal infrastructure (config getters, validators, settings.json writers) is unchanged** — the same code that ConfigTool called is now called from `/config`. The tool was a *surface* removal, not an infrastructure change.

**`isReadOnly(input)` returning value-dependent was a clever pattern** — the same tool could be both a read tool and a write tool. The runtime used this to skip permission prompts for reads but require them for writes. In retrospect, splitting into `ConfigGet` and `ConfigSet` tools might have been clearer; the unified surface was concise but ambiguous.

**Why the v2.1.142 bundle doesn't include it at all:** A removed tool can either be (a) removed entirely or (b) kept with `isEnabled: () => false`. The bundle uses option (a) — no entry in `_index.json`, no constant for `CONFIG_TOOL_NAME` in the bundle's tool list. The TS source likely keeps the file for SDK builds that still expose it via a non-CLI entry point.

---

## v2.1.112 → v2.1.142 Deltas

- The tool is not registered in v2.1.142's `_index.json`.
- The `/config` slash command is now the only path for user-initiated settings changes.
- `/config` itself underwent improvements:
  - **v2.1.119:** Config settings (theme, editor mode, verbose, etc.) now persist to `~/.claude/settings.json` and participate in project/local/policy override precedence.
  - **v2.1.116:** `/config` search now matches option values.
  - **v2.1.128:** Fixed tab navigation in `/config` stranding focus.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_utility.md](../00_overview/symbol_additions_v2_1_142_tools_utility.md) — *Module: Tools — Inactive Legacy*

Key references in this document:
- 2.1.88 TS source: `src/tools/ConfigTool/ConfigTool.ts`
- Settings infrastructure (still active in v2.1.142): `getInitialSettings`, `updateSettingsForSource`, `saveGlobalConfig`
- Replacement slash command: `/config`
