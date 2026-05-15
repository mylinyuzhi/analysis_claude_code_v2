# File Index — v2.1.142 Extracted Source

This index inventories the files produced by `claude-code-bomb` for Claude Code v2.1.142. It is the entry point for "I want to read the code for feature X" — work backward from the asset listing or grep for a stable string.

The canonical extraction layout is at `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/`.

---

## Top-Level Tree

```
extract/
├─ cli_inner_pretty.js                      (~20 MB, one pretty-printed bundle)
├─ cli_unpack_pretty/                       (per-decl break-up of cli_inner_pretty.js)
│   ├─ _manifest.json                       (file list + name + kind + bytes)
│   ├─ _summary.json                        (kind counts: unknown / fingerprint / node-builtin)
│   ├─ unknown/<id>.js                      (1224 decls that don't match any package fingerprint)
│   ├─ decls/
│   │   ├─ functions/<id>.js                (12,982 function decls)
│   │   ├─ vars/<id>.js                     (18,201 var decls)
│   │   ├─ classes/<id>.js                  (272 class decls)
│   │   ├─ ExpressionStatement/<id>.js      (top-level expression statements)
│   │   └─ IfStatement/<id>.js              (top-level if-statements — runtime guards)
│   ├─ fingerprint/<pkg>/                   (third-party decls matched to known packages)
│   └─ node-builtin/<mod>/                  (node stdlib polyfill modules)
└─ assets/
    ├─ _summary.json                        (asset counts)
    ├─ prompts/, prompts_index.json         (343 prompts, 993 KB total)
    ├─ system_prompts/                      (per-prompt JSON with line offset)
    ├─ tools_index.json                     ([] empty in this build — tool factory changed)
    ├─ slash_commands.json                  (117 slash command names)
    ├─ env_vars.json                        (666 env-var names)
    ├─ cli_flags.json                       (843 CLI flags)
    ├─ feature_gates.json                   (1158 `tengu_*` / experiment keys)
    ├─ endpoints.json                       (358 URLs)
    └─ long_strings/                        (string literals over a size threshold)
```

---

## How to Look Up a Symbol

The most useful entry point is the per-decl view in `cli_unpack_pretty/`:

```
$ cat /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/unknown/<symbol>.js
```

This gives you the **isolated** body of that decl, free of unrelated context. If the symbol is a function or var that appears outside `unknown/`, look in `decls/functions/<id>.js` or `decls/vars/<id>.js` instead. The same id is used across the whole tree, so once you know the obfuscated name, you have the file.

For "what file is this decl in" lookups, `_manifest.json` has the kind + bytes for every output file.

For "where in the bundle was this decl emitted", grep `cli_inner_pretty.js` for the decl name with a leading `var `/`function `/`class `/`let `/`const ` — the lexical position there is stable within a single build but not across versions.

---

## Notable Decls (Preliminary Mapping)

This is a starting-point list of decls identified during the foundation pass. Future units will expand it.

### claude agents (background sessions)

Grep `"claude agents"` in `cli_unpack_pretty/decls/functions/*.js` yields:

- `EQ4.js` — agents dashboard React component (top-level `function EQ4(...)`)
- `H$9.js` — claude-agents related helper
- `Lg6.js` — claude-agents related helper
- `KG$.js` — claude-agents related helper
- `O44.js` — claude-agents related helper
- `RC5.js` — claude-agents related helper
- `T$A.js` — claude-agents related helper
- `T7A.js` — claude-agents related helper
- `W7A.js` — claude-agents related helper
- `WKA.js` — claude-agents related helper
- `ao5.js` — claude-agents related helper
- `bP8.js` — claude-agents related helper
- `qm8.js` — claude-agents related helper

The dashboard state symbols (referenced from `EQ4.js`): `In6`, `vn6`, `kn6`, `jQ4`, `jx7`, `Dx7`, `HG8`.

### /goal command

Grep `"/goal"` and `"active_goal"` in source:

- `Xk4.js` — `/goal` active overlay React component (renders running time, turns, tokens)
- `Xx4.js` — `/goal` related helper
- `T6A.js` — `/goal` slash command definition (`name: "goal"`)
- `ov5` (var decl) — `"/goal is only available in trusted workspaces..."` error string

### SendUserFile tool (new in v2.1.142)

Grep `"SendUserFile"`:

- `decls/vars/NH8.js` — `NH8 = "SendUserFile"` (the tool-name constant)
- `decls/vars/u0.js` — module registry that wires `SendUserFileTool` (alias `BH5`) via the `wi7` namespace
- `decls/ExpressionStatement/_top_9009561.js` — top-level registration `J$(wi7, { SendUserFileTool: () => fH5 })`

### /claude-api skill

- `ks4` (var decl) — the skill body string, ~70 KB Markdown at `cli_inner_pretty.js:593195`
- Surfaced as slash command at `cli_inner_pretty.js:573979` ("Build your AI product with Claude API. Run /claude-api to get started")

### /routines slash command (manages scheduled remote agents)

Reference strings around `cli_inner_pretty.js:385268`:

- "Manage scheduled remote Claude Code agents (routines) via the claude.ai CCR API"
- `${KK().CLAUDE_AI_ORIGIN}/code/routines/${H.id}` — the manage-URL builder
- `searchHint: "manage scheduled remote agent routines"`

### Tool factory rename: `Y9({...})` → `XK({...})`

Per extraction notes (claude-code-bomb 2.1.142 README): the tool factory's outer name changed. Tool defs now reference identifiers for `name` instead of string literals (e.g. `name: Bq` where `Bq = "Read"`).

The 46 tools are wired via `decls/vars/u0.js` (see `uH5 = [CronCreateTool, CronDeleteTool, CronListTool]`, then chains of `RemoteTriggerTool`, `MonitorTool`, `SendUserFileTool`, etc.).

---

## Categorized File Map

### CLI subcommand surface

| Feature | Decls / strings | Location hint |
|---------|-----------------|---------------|
| `claude agents` dashboard | `EQ4` + helpers | `cli_unpack_pretty/decls/functions/EQ4.js` |
| `claude daemon` status | search `"daemon"` + `"clock jumps"` | `cli_inner_pretty.js:586549` (daemon-log message) |
| `claude plugin tag/prune/details` | `claude plugin` strings | grep `"claude plugin"` |
| `claude ultrareview` non-interactive | `"--json"` + `"ultrareview"` | non-interactive CLI handler |
| `claude project purge` | `"project purge"` | argparser + handler |
| `claude auth login/logout/status` | grep `"auth login"` | auth subcommand router |

### Slash commands (full list, 117 entries)

From `assets/slash_commands.json`:

```
/agents, /all, /allcompartments, /async-invoke, /authorize,
/automated-reasoning-policies, /babysit-prs, /bash, /batch, /bin,
/branch, /btw, /callback, /catch-up, /change, /chrome, /claims,
/claude-api, /clear, /commit, /commit-push-pr, /compact, /config,
/create, /custom-models, /dashboard, /deploy, /desktop, /dev,
/devicecode, /doctor, /dream, /effort, /emcc, /etc,
/evaluation-jobs, /events, /exit, /fast, /feedback, /fish, /fo,
/foundation-models, /goal, /groups, /guardrails, /hooks,
/imported-models, /inference-profiles, /init, /install-github-app,
/issue, /ld-linux-, /ld-musl-, /lib, /login, /logonid, /logout,
/loop, /mcp, /memory, /metrics, /model, /model-copy-jobs,
/model-customization-jobs, /model-import-jobs, /model-invocation-job,
/model-invocation-jobs, /morning-checkin, /nh, /opt, /output-style,
/passes, /permissions, /plugin, /powerup, /priv, /private,
/pro-trial-expired, /proc, /prompt-routers,
/provisioned-model-throughput, /provisioned-model-throughputs,
/quit, /rate-limit-options, /register, /remember, /remote-control,
/resume, /rewind, /routines, /sandbox, /sbin, /schedule, /sh,
/skills, /sse, /stats, /status, /stream, /tasks, /teleport,
/tmp, /token, /transfer, /ultrareview, /urlcache,
/use-case-for-model-access, /user, /usr, /var, /ve, /webhook,
/worker, /ws, /zsh
```

Note: many of these (`/ld-linux-`, `/sh`, `/var`, etc.) look like filesystem paths that the extractor's `/`-leading heuristic falsely classified as slash commands. The real, user-facing slash commands are a smaller subset including `/goal`, `/claude-api`, `/routines`, `/scroll-speed`, `/effort`, `/model`, `/agents`, `/plugin`, `/compact`, `/skills`, `/usage`, `/resume`, `/rewind`, `/ultrareview`, `/tui`, `/recap`, `/focus`, etc.

### Tools (46 tools)

The tool list in `assets/tools_index.json` is **empty** in the current extraction because the tool factory was renamed (`Y9` → `XK`) — the extractor's signature detector wasn't fully ported yet. The 46 tools are still in the binary; consult `decls/vars/u0.js` for the wiring:

```
uH5 = [CronCreateTool, CronDeleteTool, CronListTool]
mH5 = []
oi7 = RemoteTriggerTool
ai7 = MonitorTool
BH5 = SendUserFileTool
... (full list continues)
```

The string-literal tool names are easy to grep — search for `NH8 = "SendUserFile"`-style declarations to locate every tool's name constant.

### Prompts (343 prompts, 993 KB)

Browse `assets/prompts/` and `assets/prompts_index.json` to map prompt-fragment text to the emitting decl. The index has the line-offset of every prompt's emit site in `cli_inner_pretty.js`.

Notable prompt themes in this window:

- `/claude-api` skill (huge body, see `cli_inner_pretty.js:593195`)
- `/goal` active hook prompt (around line 486759)
- Compaction prompt with "preserve sensitive user instructions" guidance (v2.1.139)
- Auto-mode classifier prompts including self-modification, scheduling, and hard-deny enforcement (around lines 337567–337695)

### Assets — System Prompts

`assets/system_prompts/` contains per-prompt JSON files. These are the top-level identity / steering / tool-section prompts assembled into the chat system prompt.

### Assets — Env Vars (666 entries)

Notable new env vars in this window (from `env_vars.json`, cross-referenced with the changelog):

- `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` (v2.1.142 — pin Fast Mode to 4.6)
- `ANTHROPIC_WORKSPACE_ID` (v2.1.141 — Workload Identity Federation)
- `CLAUDE_CODE_PLUGIN_PREFER_HTTPS` (v2.1.141)
- `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN` (v2.1.132)
- `CLAUDE_CODE_SESSION_ID` (v2.1.132)
- `CLAUDE_CODE_FORCE_SYNC_OUTPUT` (v2.1.129)
- `CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE` (v2.1.129)
- `CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY` (v2.1.129)
- `CLAUDE_CODE_ENABLE_FEEDBACK_SURVEY_FOR_OTEL` (v2.1.136)
- `ANTHROPIC_BEDROCK_SERVICE_TIER` (v2.1.122)
- `CLAUDE_CODE_FORK_SUBAGENT` (v2.1.117 — now works in non-interactive)
- `DISABLE_UPDATES` (v2.1.118)
- `CLAUDE_CODE_DISABLE_AGENT_VIEW` (v2.1.142 area — disables `claude agents`)

### Assets — CLI flags (843)

Notable new flags in this window:

- `--add-dir`, `--settings`, `--mcp-config`, `--plugin-dir`, `--permission-mode`, `--model`, `--effort`, `--dangerously-skip-permissions` — all extended to `claude agents` dispatch in v2.1.142
- `--cwd <path>` for `claude agents` (v2.1.141)
- `--plugin-url <url>` (v2.1.129)
- `--from-pr` extended to GitLab/Bitbucket/GitHub Enterprise (v2.1.119)

### Assets — Feature gates (1158)

The `tengu_*` experiment keys grew by +36 in this window. See `feature_gates.json` for the full enumeration. Notable categories:

- `claude_code_*` experiment keys driving feature rollout
- Multiple agent-view / `claude agents` related gates
- Plugin-marketplace policy gates

---

## Lookup Workflow

**Goal: Find which decl implements feature X**

1. Pick a unique string (changelog quote, env var, slash command name, etc.).
2. `grep -n "<string>" /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js`
3. From the surrounding ~30 lines, identify the enclosing decl name (the obfuscated identifier just before `=` for vars, or after `function` for fn-decls).
4. Open `cli_unpack_pretty/unknown/<id>.js` (or `decls/functions/<id>.js`) for the isolated decl.
5. If the decl references other obfuscated ids, recurse on those.

**Goal: Map a known feature theme to all related decls**

1. Identify several distinct strings related to the theme.
2. `grep -l "<string>" cli_unpack_pretty/decls/functions/*.js` for each string.
3. Union the file lists — those are your candidate decls.

**Goal: Validate a v2.1.112 → v2.1.142 delta claim**

1. Find the corresponding v2.1.112 chunk (see `../../../claude_code_v_2.1.112/analyze/00_overview/file_index.md`).
2. Grep the same string in v2.1.142 source.
3. Compare obfuscated names — they often shift (e.g. `Y9` → `XK` tool factory). The string literals are the stable anchor.

---

## See Also

- [`changelog_analysis.md`](changelog_analysis.md) — long-form narrative
- [`changelog_to_code_map.md`](changelog_to_code_map.md) — per-bullet pointers
- [`symbol_index_core_execution.md`](symbol_index_core_execution.md) — Core execution mappings (skeleton)
- [`symbol_index_core_features.md`](symbol_index_core_features.md) — Core feature mappings (skeleton)
- [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) — Platform infra mappings (skeleton)
- [`symbol_index_infra_integration.md`](symbol_index_infra_integration.md) — Integration mappings (skeleton)
- `/lyz/codespace/claude-code-bomb/versions/2.1.142/README.md` — extraction notes (tool factory rename, module wrapper count change, etc.)
