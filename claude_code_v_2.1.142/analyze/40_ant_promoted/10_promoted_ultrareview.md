# `/ultrareview` and `claude ultrareview` — From Ant-Gated to GrowthBook-Configured (v2.1.88 → v2.1.142)

## Status snapshot

| | v2.1.88 (TypeScript source) | v2.1.142 (deobfuscated) |
|---|---|---|
| Slash command name | `/ultrareview` | `/ultrareview` (same) |
| CLI subcommand | NOT present | `claude ultrareview [target]` (added v2.1.120) |
| `--json` flag | n/a | `--json` (raw output) |
| `--timeout <minutes>` flag | n/a | Yes |
| Implementation files | `src/commands/review.ts` (57 lines), `src/commands/review/ultrareviewCommand.tsx`, `src/commands/review/ultrareviewEnabled.ts` | `cli_inner_pretty.js:474757-476343` (slash command), `cli_inner_pretty.js:604786-604857` (CLI subcommand) |
| Enablement gate | `isEnabled: () => isUltrareviewEnabled()` reading `tengu_review_bughunter_config.enabled === true` | `isEnabled: () => V1H()` — same GB key + CCR bridge + workspace check |
| Slash command in `slash_commands.json` | n/a | **Yes** (`/ultrareview` listed) |
| Telemetry events | `tengu_review_bughunter_*`, `tengu_ultrareview_*` | Same + `cli_ultrareview` event family for the CLI variant |

### What is `/ultrareview`?

A multi-agent cloud bug-hunting session that runs on Claude Code on the web (CCR). The user types `/ultrareview <PR#>` or `/ultrareview <branch>` (or no argument to review the current branch). The session bundles the local repo, sends it to the cloud, runs parallel agents that look for correctness bugs, security issues, and verification of bug reports. Results come back as a structured finding list, or `--json` for scripting.

`/ultrareview` is the **only** entry point to the remote bughunter path. The vanilla `/review` stays purely local — it just prompts the model to gh-pr-view + analyze.

---

## 1. v2.1.88 implementation (TypeScript source)

### Slash command definition

```typescript
// ============================================
// ultrareviewSlashCommand - v2.1.88 ant-gated entry
// Location: src/commands/review.ts:48-54
// ============================================

// ORIGINAL (for source lookup):
const ultrareview: Command = {
  type: 'local-jsx',
  name: 'ultrareview',
  description: `~10–20 min · Finds and verifies bugs in your branch. Runs in Claude Code on the web. See ${CCR_TERMS_URL}`,
  isEnabled: () => isUltrareviewEnabled(),
  load: () => import('./review/ultrareviewCommand.js'),
}

// READABLE (for understanding):
const ultrareviewSlashCommand = {
  type: 'local-jsx',
  name: 'ultrareview',
  description: 'Finds and verifies bugs in your branch. Runs in CCR.',
  isEnabled: () => growthbookUltrareviewEnabled(),
  load: () => lazyImportUltrareviewCommand(),
};
// Mapping: isUltrareviewEnabled→growthbookUltrareviewEnabled, load→lazyImportUltrareviewCommand
```

### The gate

```typescript
// ============================================
// isUltrareviewEnabled - GrowthBook gate for /ultrareview visibility
// Location: src/commands/review/ultrareviewEnabled.ts:8-14
// ============================================

// ORIGINAL (for source lookup):
export function isUltrareviewEnabled(): boolean {
  const cfg = getFeatureValue_CACHED_MAY_BE_STALE<Record<string, unknown> | null>(
    'tengu_review_bughunter_config', null)
  return cfg?.enabled === true
}

// READABLE (for understanding):
export function isUltrareviewEnabled() {
  const cfg = readGrowthbookCache('tengu_review_bughunter_config', null);
  return cfg?.enabled === true;  // strict === true, not truthy
}
// Mapping: getFeatureValue_CACHED_MAY_BE_STALE→readGrowthbookCache
```

**Note**: v2.1.88 has a GrowthBook gate ONLY. There is no ant-only build-time flag for ultrareview. This is interesting — it tells us ultrareview was already a candidate for external rollout earlier than ultraplan (which was ant-only build flag in v2.1.88).

The "promoted" angle for ultrareview is **(a)** the addition of the `claude ultrareview` CLI subcommand in v2.1.120 making it usable from CI, and **(b)** the addition of the `policy_blocked` / `allow_remote_sessions` enterprise-policy gate.

---

## 2. v2.1.142 implementation (deobfuscated)

### The runtime gate

```javascript
// ============================================
// isUltrareviewEnabledV2 - v2.1.142 composite gate
// Location: cli_inner_pretty.js:474757-474759
// ============================================

// ORIGINAL (for source lookup):
function V1H() {
  return JaH()?.enabled === !0 && YdH() && !I6();
}
function JaH() {
  return Z$("tengu_review_bughunter_config", null);
}

// READABLE (for understanding):
function isUltrareviewEnabled() {
  if (getReviewBughunterConfig()?.enabled !== true) return false;
  if (!isCloudCodeRunnerBridgeAvailable()) return false;
  if (isCurrentlyInRemoteWorkspace()) return false;
  return true;
}
function getReviewBughunterConfig() {
  return getGrowthbookCached("tengu_review_bughunter_config", null);
}
// Mapping: V1H→isUltrareviewEnabled, JaH→getReviewBughunterConfig, YdH→isCloudCodeRunnerBridgeAvailable, I6→isCurrentlyInRemoteWorkspace
```

### Slash command registration

```javascript
// ============================================
// ultrareviewSlashCommandV2 - v2.1.142 registry entry
// Location: cli_inner_pretty.js:476334-476342
// ============================================

// ORIGINAL (for source lookup):
fJ4 = {
  type: "local-jsx",
  name: "ultrareview",
  get description() {
    return `${Or()} \xB7 Est. cost ${CEH()} USD \xB7 Finds and verifies bugs in your branch. Runs in Claude Code on the web. See ${hT5}`;
  },
  isEnabled: () => V1H(),
  load: () => Promise.resolve().then(() => (YJ4(), zJ4)),
};

// READABLE (for understanding):
const ultrareviewSlashCommand = {
  type: "local-jsx",
  name: "ultrareview",
  get description() {
    return `${getDurationNote()} · Est. cost ${getCostNote()} USD · Finds and verifies bugs in your branch. Runs in CCR.`;
  },
  isEnabled: () => isUltrareviewEnabled(),
  load: () => loadUltrareviewCommandLazy(),
};
// Mapping: fJ4→ultrareviewSlashCommand, Or→getDurationNote, CEH→getCostNote, hT5→CCR_TERMS_URL_FOR_REVIEW
```

The new `Est. cost ${CEH()} USD` text in the description is read from the same GB config: `tengu_review_bughunter_config.cost_note`. Default fallback is `$10-$20`.

### `claude ultrareview` CLI subcommand (v2.1.120, present in v2.1.142)

```javascript
// ============================================
// ultrareviewCliHandler - non-interactive CLI entry
// Location: cli_inner_pretty.js:604787-604856
// ============================================

// ORIGINAL (for source lookup):
async function rqA(H, $) {
  let q = () => process.exit(130);
  if ((process.once("SIGINT", q), await $$H(), !S4("allow_remote_sessions")))
    return (uH("cli_ultrareview", "cli_ultrareview_policy_disallowed"),
            hq("Remote sessions are disabled by your organization's policy."));
  await VZ().catch(() => {});
  let K = Number($.timeout),
    _ = Number.isFinite(K) && K > 0 ? K : lqA,
    A = T4(),
    z = await fX8(H, { confirm: !0, skipTaskRegistration: !0, context: { abortController: A, taskRegistry: jaH } });
  if (z.status !== "launched") {
    let O = z.status === "blocked" && z.actionUrl ? `\n  → ${z.actionUrl}` : "";
    return (uH("cli_ultrareview", "cli_ultrareview_launch_failed"),
            hq(`Ultrareview could not launch: ${"message" in z ? z.message : z.body}${O}`));
  }
  (mT$(z.message),
    mT$(`View live progress in the browser: ${z.sessionUrl}`),
    mT$(`Waiting for findings (${Or()})…`),
    process.removeListener("SIGINT", q),
    process.once("SIGINT", () => {
      (mT$(`\nCancelled. The remote review is still running — view it at ${z.sessionUrl}`),
       process.exit(130));
    }));
  let Y;
  try { Y = await aqA(z.sessionId, A.signal, _ * 60 * 1000); }
  catch (O) {
    return (uH("cli_ultrareview", "cli_ultrareview_poll_failed"),
            hq(`Ultrareview failed: ${ZH(O)}\nSession: ${z.sessionUrl}`));
  }
  let f = oqA(Y);
  if ($.json) {
    process.stdout.write(Y + "\n");
    if (f) uH("cli_ultrareview", "cli_ultrareview_remote_error");
    else RH("cli_ultrareview");
    process.exit(f ? 1 : 0);
  }
  if (f) return (uH("cli_ultrareview", "cli_ultrareview_remote_error"),
                 hq(`Review failed: ${f}\nSession: ${z.sessionUrl}`));
  (process.stdout.write(tqA(Y) + "\n"), RH("cli_ultrareview"), process.exit(0));
}

// READABLE (for understanding):
async function ultrareviewCliHandler(target, options) {
  const onSigint = () => process.exit(130);
  process.once("SIGINT", onSigint);

  await initSessionContext();

  // Enterprise policy gate
  if (!isPolicyAllowed("allow_remote_sessions")) {
    recordTelemetryFailure("cli_ultrareview", "cli_ultrareview_policy_disallowed");
    return fatalExit("Remote sessions are disabled by your organization's policy.");
  }

  await ensureAuthHydrated().catch(() => {});

  const timeoutMin = Number.isFinite(Number(options.timeout)) && Number(options.timeout) > 0
    ? Number(options.timeout)
    : DEFAULT_TIMEOUT_MIN;
  const abortController = newAbortController();

  // Launch (skipTaskRegistration: true — CLI doesn't render task pills)
  const launchResult = await launchUltrareview(target, {
    confirm: true,           // CLI auto-confirms billing prompt
    skipTaskRegistration: true,
    context: { abortController, taskRegistry: globalTaskRegistry }
  });

  if (launchResult.status !== "launched") {
    const actionUrl = launchResult.status === "blocked" && launchResult.actionUrl
      ? `\n  → ${launchResult.actionUrl}` : "";
    recordTelemetryFailure("cli_ultrareview", "cli_ultrareview_launch_failed");
    return fatalExit(
      `Ultrareview could not launch: ${"message" in launchResult ? launchResult.message : launchResult.body}${actionUrl}`);
  }

  // Live progress lines to stderr (mT$ writes to stderr)
  writeStderr(launchResult.message);
  writeStderr(`View live progress in the browser: ${launchResult.sessionUrl}`);
  writeStderr(`Waiting for findings (${getDurationNote()})…`);

  // Replace handler — second SIGINT writes session URL and exits 130
  process.removeListener("SIGINT", onSigint);
  process.once("SIGINT", () => {
    writeStderr(`\nCancelled. The remote review is still running — view it at ${launchResult.sessionUrl}`);
    process.exit(130);
  });

  // Block on polling
  let raw;
  try {
    raw = await pollUntilReviewComplete(launchResult.sessionId, abortController.signal, timeoutMin * 60 * 1000);
  } catch (err) {
    recordTelemetryFailure("cli_ultrareview", "cli_ultrareview_poll_failed");
    return fatalExit(`Ultrareview failed: ${formatErr(err)}\nSession: ${launchResult.sessionUrl}`);
  }

  const remoteError = extractRemoteError(raw);

  if (options.json) {
    // --json: write raw payload, exit code reflects remote error
    process.stdout.write(raw + "\n");
    if (remoteError) recordTelemetryFailure("cli_ultrareview", "cli_ultrareview_remote_error");
    else recordTelemetrySuccess("cli_ultrareview");
    process.exit(remoteError ? 1 : 0);
  }

  // Default: pretty-print findings, exit 0 unless remote errored
  if (remoteError) {
    recordTelemetryFailure("cli_ultrareview", "cli_ultrareview_remote_error");
    return fatalExit(`Review failed: ${remoteError}\nSession: ${launchResult.sessionUrl}`);
  }
  process.stdout.write(formatFindings(raw) + "\n");
  recordTelemetrySuccess("cli_ultrareview");
  process.exit(0);
}
// Mapping: rqA→ultrareviewCliHandler, $$H→initSessionContext, S4→isPolicyAllowed, VZ→ensureAuthHydrated, T4→newAbortController, fX8→launchUltrareview, jaH→globalTaskRegistry, mT$→writeStderr, aqA→pollUntilReviewComplete, oqA→extractRemoteError, tqA→formatFindings, ZH→formatErr, hq→fatalExit, uH→recordTelemetryFailure, RH→recordTelemetrySuccess, Or→getDurationNote, lqA→DEFAULT_TIMEOUT_MIN
```

---

## 3. Diff during promotion (88 → 142)

### What changed

| Aspect | v2.1.88 | v2.1.142 |
|---|---|---|
| Slash gate | `tengu_review_bughunter_config.enabled === true` (single check) | Same + `YdH()` CCR bridge + `!I6()` not-in-remote |
| Description | Hard-coded `~10–20 min` and no cost | Reads `Or()` (duration) and `CEH()` (cost) from GB |
| Description cost line | None | `Est. cost $10-$20 USD` (from GB `cost_note`) |
| Non-interactive entry | None | `claude ultrareview [target] [--json] [--timeout N]` |
| Enterprise policy gate | None visible in source | `S4("allow_remote_sessions")` checked in CLI handler |
| CLI auto-confirms billing | n/a | Yes (`confirm: true` in launch call) |
| SIGINT handling | n/a | Two-stage: first SIGINT during launch exits, second SIGINT after launch prints URL |
| `--json` output | n/a | Raw response, exit code 1 if remote errored |
| Telemetry namespace | `tengu_ultrareview_*`, `api_ultrareview_preflight` | Same + `cli_ultrareview` event family |

### Why the `confirm: true` in CLI launch

**Decision:** the CLI auto-bypasses the "are you sure you want to spend $10-$20?" dialog that the interactive flow shows.

**Reasoning:**
- CI use is the killer use case — running `claude ultrareview` on every PR open is the workflow
- An interactive confirm dialog in a non-TTY context would hang forever
- The cost is explicit in the description string and the launch message, so users invoking it knew they'd be billed
- The `allow_remote_sessions` admin policy is the safety net — orgs that can't afford the cost simply disable it globally

**Trade-off:** A user accidentally running `claude ultrareview` (e.g. typo of `claude review`) burns money. Mitigation: the CLI emits the cost estimate to stderr before launching ("Est. cost $10-$20 USD"), so the user sees it before the bill lands.

### Why the two-stage SIGINT

**Decision:** First SIGINT (before remote session is created) just exits. Second SIGINT (after remote session created) prints the session URL.

**Reasoning:**
1. **Before launch**: there's no remote resource to leak — exit 130 cleanly.
2. **After launch**: the remote session is real and is *still running* on Claude.ai's infrastructure. The user paid for that session. Telling them the URL is the equivalent of "you're cancelling locally, but the work continues — here's where to find it."

**Why not auto-archive the remote session on cancel?** Two reasons:
- The remote may be 70% through a 15-minute review; the user might want the findings even after killing local polling.
- Killing remote sessions from a CLI subcommand is async (cross-region call) — would block exit beyond the 130 signal expectation.

**Key insight:** This is the same "don't lose user-paid work" principle that drives the daemon-survives-disconnect design. The CLI subcommand promotes the same care to the non-interactive flow.

### What did NOT change

- The `tengu_review_bughunter_config` GrowthBook key (same in both versions)
- The `fetchUltrareviewPreflight` preflight call (`/v1/ultrareview/preflight`)
- The blocked reasons (`essential-traffic-only`, `data-residency`, `no-auth`) — same enum
- The local `/review` command (still local-only — no remote calls)
- The animated launching state and diffstat in the dialog (added v2.1.113, retained)

---

## 4. Implementation analysis

### Decision: GB config holds duration/cost as `_note` strings

**What it does:** `tengu_review_bughunter_config` has `duration_note` (e.g. `"~10–20 min"`) and `cost_note` (e.g. `"$10-$20"`) as free-form strings.

**How it works:**
1. v2.1.88 hard-coded `~10–20 min` in `review.ts`
2. v2.1.142 reads via `Or()` and `CEH()` with fallback values
3. GB config can update these as cost structure shifts (model upgrades, etc.)

**Why strings, not numbers?**
- The displayed format ("~10–20 min", "$10-$20") includes user-comprehensible imprecision (the `~` and the range)
- Forcing them through numeric config would lose the human nuance
- Strings make the GB config human-editable without code recompilation

**Alternative considered:** numeric `duration_min`, `duration_max`, `cost_usd_min`, `cost_usd_max`. Rejected because the client would have to do formatting and locale, gaining nothing.

### Decision: `claude ultrareview` as a separate CLI handler, not just `claude -p "/ultrareview"`

**What it does:** `claude ultrareview` is a distinct CLI subcommand with its own argv parsing, not a wrapper around `claude -p`.

**How it works:**
1. Parses `[target]`, `--json`, `--timeout`
2. Calls `launchUltrareview` directly (the same function the slash command uses, with `confirm: true`)
3. Polls for completion in the CLI process (no agent loop)

**Why not `claude -p "/ultrareview"`:**
- `-p` runs the agent loop — but ultrareview doesn't need an agent loop, it just polls a remote session
- The agent loop would consume cost/tokens to do nothing (the work is on the remote)
- A dedicated handler can give better exit codes (1 on remote error, 130 on SIGINT, 0 on success) — `-p` returns 0 unless the agent itself errors

**Trade-off:**
- Cost: one more CLI subcommand to maintain, separate code path
- Benefit: CI-friendly behavior, clean exit codes, no agent-loop overhead

**Key insight:** This is the "make the non-interactive path first-class" pattern. Slash commands grow into CLI subcommands when the use case is automated.

### Decision: `skipTaskRegistration: true` in CLI launch

The interactive flow registers a "task" in the local app state, which shows up as a status pill in the REPL. CLI invocations have no REPL to show pills in, so registration is skipped. Without this flag, the launch would create an orphaned entry that nothing ever cleans up.

---

## 5. Public entry points

### Slash command surface
- `/ultrareview` — review current branch
- `/ultrareview <PR#>` — review a GitHub PR
- `/ultrareview <branch>` — review a branch against trunk
- `/ultrareview <branch> <base>` — review branch against explicit base

### CLI surface
- `claude ultrareview [target]` — same target semantics as the slash command
- `claude ultrareview --json` — print raw payload (for scripts)
- `claude ultrareview --timeout <minutes>` — extend the default ~10–20 min ceiling

### Internal hand-offs
- ExitPlanMode does NOT have an "Ultrareview this plan" CTA (that's ultraplan's territory)
- Bughunter's findings can be fed into `/skill bug-trace` for follow-up — separate code path
- The remote review session can be archived via the same `RemoteAgentTask.kill` route

### From the model (via the system prompt)
- Lines 523693 inject explicit text: 'If the user asks about "ultrareview" or how to run it, explain that /ultrareview launches a multi-agent cloud review of the current branch (or /ultrareview <PR#> for a GitHub PR). It is user-triggered and billed; you cannot launch it yourself, so do not attempt to via Bash or otherwise.'
- This is a guardrail: the model knows the feature exists and can describe it, but is told not to launch it via Bash — only the user (or their CI) can launch it.

---

## 6. Cross-references

- See `by_version/v2.1.113-114.md` for parallelized checks + diffstat addition
- See `by_version/v2.1.120.md` for `claude ultrareview` CLI subcommand
- See `00_overview/symbol_index_infra_integration.md` Module: Slash Commands

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `isUltrareviewEnabled` (`V1H`) — runtime gate (cli_inner_pretty.js:474757)
- `getReviewBughunterConfig` (`JaH`) — GB config reader (cli_inner_pretty.js:474742)
- `ultrareviewSlashCommand` (`fJ4`) — slash command (cli_inner_pretty.js:476334)
- `ultrareviewCliHandler` (`rqA`) — CLI subcommand (cli_inner_pretty.js:604787)
- `pollUntilReviewComplete` (`aqA`) — polling loop (cli_inner_pretty.js:604868)
- `extractRemoteError` (`oqA`) — JSON error scraper (cli_inner_pretty.js:604858)
- `formatFindings` (`tqA`) — pretty-printer for findings list
- `getDurationNote` (`Or`) — GB-driven duration string
- `getCostNote` (`CEH`) — GB-driven cost string
- `launchUltrareview` (`fX8`) — shared launch entry (slash + CLI)
