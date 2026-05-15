# ShareOnboardingGuide — Upload ONBOARDING.md & Get a Team Share Link

> **Tool name:** `ShareOnboardingGuide`
> **Source:** `cli_inner_pretty.js:387305-387409` (`xH5` declaration)
> **Search hint:** *upload ONBOARDING.md and get a team share link*

---

## Overview

`ShareOnboardingGuide` uploads the `ONBOARDING.md` in the current directory and returns a share URL teammates can open in Claude Code. The default mode (`check`) is smart: if a local file exists it uploads and returns a fresh link; if no local file exists it returns the *existing* org link without uploading.

The tool size-caps uploads at **64 KB** (`qO8 = 65536`) — an onboarding doc is meant to be a starting compass, not a manual.

---

## Schema

```javascript
// ============================================
// shareOnboardingInputSchema - CH5 with four-mode enum
// Location: cli_inner_pretty.js:387280-387296
// ============================================

// ORIGINAL (for source lookup):
CH5 = yH(() =>
  y.strictObject({
    mode: y.enum(["check", "update", "create", "delete"]).default("check").describe("'check' (default): ..."),
    short_code: y.string().regex(/^[A-Za-z0-9_-]{1,64}$/).optional().describe("Short code of a specific guide ..."),
  }),
);

// READABLE (for understanding):
const shareOnboardingInputSchema = lazySchema(() =>
  z.strictObject({
    mode: z.enum(["check", "update", "create", "delete"]).default("check"),
    short_code: z.string().regex(/^[A-Za-z0-9_-]{1,64}$/).optional(),
  }),
);

// Mapping: CH5→shareOnboardingInputSchema
```

Output: `{ status, share_url?, short_code?, message }` with status one of `created | updated | deleted | has_existing | unavailable`.

---

## Key Behavior

### Four modes with different semantics

| mode | If ONBOARDING.md present | If no local file |
|------|--------------------------|------------------|
| `check` (default) | Upload, replace most-recent guide, return fresh URL | Return existing guide URL (status `has_existing`), no upload |
| `update` | Upload to specific `short_code` (or most-recent), return updated URL | Error |
| `create` | Always make a NEW guide regardless of existing ones | Error |
| `delete` | Remove guide (by short_code or most-recent) — local file not needed | Same |

### Size cap

```javascript
if (fileSize > qO8) return errorResult(`${ZL$} is over ${qO8 / 1024}KB. Trim it before sharing.`);
```

64 KB cap (`qO8 = 65536`). Onboarding docs are meant to be brief — if you've got 64 KB of onboarding, you're shipping documentation, not onboarding.

### `has_existing` status

```javascript
if (existingGuide && !localFile) return {
  data: {
    status: "has_existing",
    share_url: existingGuide.share_url,
    short_code: existingGuide.short_code,
    message: `A guide already exists for this org at ${share_url} (short_code: ${short_code}). If this link is what the user needed, share it. If they want to create or update a guide, tell them to run /team-onboarding themselves (it scans local session data and cannot be invoked by the model).`,
  },
};
```

The message is crafted to **redirect the model out of the loop**: "if they want to create or update a guide, tell them to run `/team-onboarding` themselves." The slash command does richer work (scanning the user's recent session data, summarizing patterns) that the model can't substitute for.

### `isDestructive: (H) => H.mode === "delete"`

Delete mode is flagged destructive (triggers extra permission prompts in non-skip-permissions configs).

---

## Key Insights

**Why is the default mode `check` instead of `create`?**
- Idempotency. Calling the tool twice in a session with `check` doesn't accumulate guides — it updates the latest one.
- Discoverability. If a guide already exists and there's no local file, the model returns the existing link instead of erroring or creating a duplicate.
- The model can't accidentally pollute the org with multiple stale guides through repeated calls.

**Why is "no local file + check" not an error?** Because the model may not know whether a guide exists. The `check` mode is the introspection path: "tell me what guide this org has (if any), and update it if I have something to push." This makes the tool useful as a starter discovery call.

**Why explicitly route the user to `/team-onboarding`?** That slash command does work the model literally can't do — it accesses session-history aggregations through internal APIs that aren't exposed to tools. The `has_existing` message acknowledges this asymmetry and points the user at the right surface.

**`short_code` regex `[A-Za-z0-9_-]{1,64}`** is permissive enough for URL-safe slugs but rejects path-traversal-style inputs (`..`, `/`, etc.) before they reach the API.

**`isConcurrencySafe: false`** — uploading the same guide twice concurrently would race on the org's most-recent-guide pointer. Serializing through the tool registry prevents the inconsistent state.

---

## v2.1.112 → v2.1.142 Deltas

- The tool exists in 2.1.112 and 2.1.142 with the same surface; the description and prompt are stable across this window.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_utility.md](../00_overview/symbol_additions_v2_1_142_tools_utility.md) — *Module: Tools — Onboarding*

Key functions in this document:
- `ShareOnboardingGuideTool` (`xH5`) — declaration with `isDestructive: mode === "delete"`
- `shareOnboardingInputSchema` (`CH5`) — mode + short_code
- `ONBOARDING_FILENAME` (`ZL$`) — `"ONBOARDING.md"`
- `ONBOARDING_MAX_BYTES` (`qO8`) — `65536`
- `findMostRecentOrgGuide` (`IE6`) — guide lookup
- `listOrgGuides` (`EE6`) — list org guides
- `updateOrgGuide` (`NE6`) / `createOrgGuide` (`ci7`) / `deleteOrgGuide` (`li7`) — guide mutators
- `formatOnboardingResult` (`SE6`) — output formatter
