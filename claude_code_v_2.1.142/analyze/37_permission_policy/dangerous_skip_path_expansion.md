# `--dangerously-skip-permissions` Path-Bypass Expansion — v2.1.121, v2.1.126

**Theme:** Users running with `--dangerously-skip-permissions` (or in `bypassPermissions` mode) want **fewer prompts**, not zero — Claude Code still asks before writing to "always-sensitive" paths like `.env`, `~/.ssh/`, etc., even in YOLO mode. But the previous behavior also prompted for `.claude/skills/`, `.claude/agents/`, `.claude/commands/` — *plugin-author and user-customization paths* — which the user explicitly opted into managing when they configured them. v2.1.121 and v2.1.126 expand the bypass list so YOLO mode skips prompts for these too.

The change is the result of a careful trade-off: **what's a sensitive system path vs what's a user-controlled customization path?** The `.claude/` directory has both — `.claude/settings.json` is sensitive (it controls policy), but `.claude/skills/<my-skill>/SKILL.md` is content the user authors. The new rules cleanly separate the two.

---

## 1. The Three Layers of Path Protection

Even in `bypassPermissions` mode, three categories of paths still prompt:

| Category | Examples | Why |
|---|---|---|
| **Settings/policy files** | `.claude/settings.json`, `.claude/settings.local.json`, `CLAUDE.md`, `.mcp.json` | Modifying these changes how Claude behaves — a malicious edit could escalate privileges |
| **Credential/secret files** | `.env*`, `~/.ssh/*`, `~/.aws/*`, `.npmrc` (with auth) | Direct security risk if exposed or modified |
| **Suspicious path patterns** | UNC paths, Windows reserved names, paths with `...`, alternate streams | OS-level safety hazards |

Each has its own check function:
- `hw8` — settings file check
- `$u5` — extends `hw8` with `.claude/commands/`, `.claude/agents/`, `.claude/skills/` (default behavior)
- `_u5` — credential/sensitive file check (called separately)
- `Yy4` — Windows suspicious pattern check

The **bypass-skip mode** chooses which checks fire. In `--dangerously-skip-permissions`, the most-restrictive `$u5` (which includes user-customization paths) is replaced with the less-restrictive `hw8` (just settings).

---

## 2. The Gate — Line 517968-517981 of `bY$`

```javascript
// ============================================
// pathSafetyCheck - Decide which dangerous-path check applies based on bypass state
// Location: cli_inner_pretty.js:517958-517989
// ============================================

// ORIGINAL (for source lookup):
function bY$(H, $, q, K, _) {
  let A = q || K,
    z = $ ?? uN(H);
  for (let Y of z)
    if (Yy4(Y, _)) return { safe: !1, ... };           // Windows suspicious patterns
  for (let Y of z)
    if (A) {                                             // ← A = bypass active
      if (hw8(Y))                                        // only settings files
        return { safe: !1, message: "...", classifierApprovable: !0 };
    } else if ($u5(Y))                                   // settings + commands/agents/skills
      return { safe: !1, ... };
  for (let Y of z)
    if (_u5(Y, A, _))                                    // credential files, with bypass-aware
      return { safe: !1, message: `Claude requested permissions to edit ${H} which is a sensitive file.`, ... };
  return { safe: !0 };
}

// READABLE (for understanding):
function pathSafetyCheck(filePath, parentDirs, isRemoteMode, isBypassMode, trustedNetworkDirectories) {
  // A: combined bypass flag — either remote-mode admin-approved bypass OR --dangerously-skip-permissions
  const bypassActive = isRemoteMode || isBypassMode;
  const dirs = parentDirs ?? expandParentDirectories(filePath);

  // Layer 1: Windows suspicious paths — ALWAYS check (no bypass override)
  for (const dir of dirs) {
    if (hasSuspiciousWindowsPattern(dir, trustedNetworkDirectories)) {
      return { safe: false, message: "...suspicious Windows path...", classifierApprovable: false };
    }
  }

  // Layer 2: Settings vs user-customization paths
  for (const dir of dirs) {
    if (bypassActive) {
      // Bypass mode: only block writes to settings files
      if (isSettingsFile(dir)) {  // hw8 — only matches .claude/settings.json variants
        return { safe: false, message: "...settings file...", classifierApprovable: true };
      }
    } else {
      // Normal mode: also block writes to .claude/commands, agents, skills
      if (isSettingsOrUserCustomization(dir)) {  // $u5 — includes commands/agents/skills
        return { safe: false, message: "...settings or customization...", classifierApprovable: true };
      }
    }
  }

  // Layer 3: Credential/sensitive files — with bypass awareness (different list)
  for (const dir of dirs) {
    if (isSensitivePath(dir, bypassActive, trustedNetworkDirectories)) {
      return { safe: false, message: `${filePath} which is a sensitive file.`, classifierApprovable: true };
    }
  }

  return { safe: true };
}

// Mapping: bY$→pathSafetyCheck, hw8→isSettingsFile, $u5→isSettingsOrUserCustomization,
//   _u5→isSensitivePath, Yy4→hasSuspiciousWindowsPattern, q→isRemoteMode, K→isBypassMode,
//   A→bypassActive
```

### Key insight — the bypass *narrows* layer 2, doesn't disable it

The change isn't "skip layer 2 entirely under bypass" but "switch the predicate to a narrower one." Settings files (`.claude/settings.json`, `CLAUDE.md`, `.claude.json`, etc.) are *always* protected even under `--dangerously-skip-permissions` — because those control how the agent behaves, and a single write could disable all future protections.

User-customization paths (skills, agents, commands) are protected in normal mode but **un-protected under bypass**, because:
- The user **set up** these directories deliberately (typed `mkdir .claude/skills`, wrote a SKILL.md)
- Writes are typically *additions* to user-authored content, not policy escalations
- A user in YOLO mode actively wants Claude to do work — friction here is unwelcome

### Why `hw8` ≠ `$u5`

```javascript
function hw8(H) {                                  // settings files only
  let $ = eq(H), q = y2($);
  if (q.endsWith(`${sep}.claude${sep}settings.json`) ||
      q.endsWith(`${sep}.claude${sep}settings.local.json`)) return !0;
  return Hu5().some((K) => y2(K) === q);           // managed-settings file list
}

function $u5(H) {                                   // settings + user-customization
  if (hw8(H)) return !0;
  let $ = path.join(getCwd(), ".claude", "commands"),
    q = path.join(getCwd(), ".claude", "agents"),
    K = path.join(getCwd(), ".claude", "skills");
  return ah(H, $) || ah(H, q) || ah(H, K);
}
```

`$u5` returns true for *any path under* `.claude/commands`, `.claude/agents`, `.claude/skills` (using `ah` for hierarchical "is descendant of" check). `hw8` is exact-match against settings files. The bypass mode swaps the check on line 517970/517976.

---

## 3. The Sensitive-File Check `_u5` — Layered Bypass Awareness

Even more interesting: `_u5` (sensitive-file check, lines 517915-517941) **also has bypass awareness**, but at a deeper level — it checks `.claude/` subdirs differently:

```javascript
// ============================================
// isSensitivePath - Sensitive file check with bypass-aware .claude/ subpaths
// Location: cli_inner_pretty.js:517915-517941
// ============================================

// ORIGINAL (for source lookup):
function _u5(H, $, q) {
  let _ = eq(H).split(X_.sep),
    A = _.at(-1);
  if (pd(H) && !qQ6(H) && !KQ6(H, q)) return !0;     // UNC / suspicious
  for (let z = 0; z < _.length; z++) {
    let Y = _[z], f = y2(Y);
    for (let O of tx5) {                              // tx5: protected directory names
      if (f !== y2(O)) continue;
      if (O === ".claude") {
        let M = _[z + 1], w = M ? y2(M) : void 0;
        if ($ && w) {                                 // ← $ = bypass active
          if (w === "skills" || w === "agents" || w === "commands") break;
          if (w === "scheduled_tasks.json" && z + 1 === _.length - 1) break;
        }
        if (w === "worktrees") break;                 // worktrees always allowed
      }
      return !0;
    }
  }
  if (A) {
    let z = y2(A);
    if (sx5.some((Y) => y2(Y) === z)) return !0;      // sx5: protected file names (.env, etc.)
  }
  return !1;
}

// READABLE (for understanding):
function isSensitivePath(filePath, isBypassActive, trustedNetworkDirectories) {
  const segments = normalizePath(filePath).split(SEP);
  const basename = segments.at(-1);

  // UNC paths reaching network resources require approval
  if (isUNC(filePath) && !isWSL(filePath) && !isTrustedNetworkPath(filePath, trustedNetworkDirectories)) {
    return true;
  }

  // Walk each path segment looking for a protected directory name
  for (let i = 0; i < segments.length; i++) {
    const segment = caseFoldedSegment(segments[i]);
    for (const protectedDir of PROTECTED_DIRECTORIES) {  // tx5: [".claude", ".git", ".ssh", ".aws", ...]
      if (segment !== caseFoldedSegment(protectedDir)) continue;

      if (protectedDir === ".claude") {
        // Special-case .claude subdirs: skills/agents/commands not sensitive under bypass
        const nextSegment = segments[i + 1];
        const nextFolded = nextSegment ? caseFoldedSegment(nextSegment) : undefined;

        if (isBypassActive && nextFolded) {
          // Under bypass, allow writes to .claude/skills, .claude/agents, .claude/commands
          if (nextFolded === "skills" || nextFolded === "agents" || nextFolded === "commands") {
            break;  // not sensitive — fall through to next segment
          }
          // Special-case .claude/scheduled_tasks.json (also allowed under bypass)
          if (nextFolded === "scheduled_tasks.json" && i + 1 === segments.length - 1) {
            break;
          }
        }

        // .claude/worktrees/* is git worktrees, always allowed
        if (nextFolded === "worktrees") break;
      }

      return true;  // matched a protected directory
    }
  }

  // Check the basename against the protected file list (e.g. ".env", ".bashrc")
  if (basename) {
    const baseFolded = caseFoldedSegment(basename);
    if (PROTECTED_FILES.some((f) => caseFoldedSegment(f) === baseFolded)) return true;
  }

  return false;
}

// Mapping: _u5→isSensitivePath, $→isBypassActive, q→trustedNetworkDirectories,
//   tx5→PROTECTED_DIRECTORIES, sx5→PROTECTED_FILES, pd→isUNC, qQ6→isWSL,
//   KQ6→isTrustedNetworkPath, ah→isDescendantOf, y2→caseFoldedSegment, eq→normalizePath
```

### Key insight — `.claude/` is two namespaces fused

The `.claude/` directory is special because it contains *both* sensitive config and user content:

```
.claude/
├── settings.json              ← sensitive (policy)
├── settings.local.json        ← sensitive (policy, not checked in)
├── scheduled_tasks.json       ← user content (bypass-allowed)
├── skills/                    ← user content (bypass-allowed)
│   └── my-skill/SKILL.md
├── commands/                  ← user content (bypass-allowed)
│   └── my-cmd.md
├── agents/                    ← user content (bypass-allowed)
│   └── my-agent.md
└── worktrees/                 ← git worktrees (always allowed)
    └── ...
```

The two-segment lookahead in `_u5` (line 517924-517932) is what enables this — when it sees `.claude` as a segment, it peeks at the **next** segment. If that next segment is `skills`/`agents`/`commands` and bypass is active, the parent `.claude` segment is treated as **not sensitive** and the walk continues. If the next segment is `worktrees`, the same break fires regardless of bypass (worktrees are always allowed because they're how Claude Code stores workspace clones).

### Why `scheduled_tasks.json` is a single file special-case

Unlike `skills`/`agents`/`commands` (which are *directories* expected to contain user content), `scheduled_tasks.json` is a single JSON file. The check `nextFolded === "scheduled_tasks.json" && i + 1 === segments.length - 1` means "we're at `.claude/scheduled_tasks.json` and not nested deeper" — `scheduled_tasks.json` is the leaf file. Allowing this under bypass is a single-purpose bypass for the `/schedule` slash command's persistence path.

---

## 4. The Always-Protected `tx5` and `sx5` Lists

Without seeing the constants directly, the names suggest:
- `tx5` (PROTECTED_DIRECTORIES) — `.git`, `.ssh`, `.aws`, `.docker`, `.claude`, possibly `.npm`, `.config`, etc.
- `sx5` (PROTECTED_FILES) — `.env`, `.env.local`, `.bashrc`, `.zshrc`, `.profile`, `.mcp.json`, `CLAUDE.md`, etc.

Searching for `tx5`:

<details>
<summary>Listing the protected sets (chunks `_top_*`)</summary>

The `tx5`/`sx5` sets are loaded from a packed module — they include the classic OS-config paths (`.ssh`, `.aws`, `.kube`, `.docker`) plus the `.env*` family (8 variants from `bA6` list at line 197669-197678). The full list is what gets passed to `_u5`. The team has been maintaining these for several versions; the v2.1.121/126 work is **NOT** about changing the lists themselves but about adding the **`.claude/` subdirectory carve-out** for skills/agents/commands.

</details>

---

## 5. Why This Trade-Off Is Safe

Allowing `.claude/skills`/`agents`/`commands` writes under bypass might sound risky — these directories contain code/markdown that the agent loads. Couldn't a compromised model write a malicious skill that the next session loads?

The mitigation has two parts:

### Part 1 — Skills/agents/commands are scanned, not executed at write time

A skill's `SKILL.md` is read at session start to populate the catalog. The model can invoke `Skill(my-skill)` to *execute* it. If the user is **in bypass mode** and **explicitly opted into** allowing writes to `.claude/skills`, the user has accepted that the agent can write skills that *they* might invoke later. The model itself doesn't auto-invoke newly-written skills — the user has to type `/my-skill` or the model has to make an explicit `Skill` tool call.

### Part 2 — `permissions.deny: ["Skill(...)"]` rules still apply

Even if a malicious skill is written, the `Skill` tool's permission check ([`skill_wildcard_match.md`](./skill_wildcard_match.md)) consults deny rules. Enterprise admins can `policySettings.permissions.deny: ["Skill(my-skill)"]` to block specific skills regardless of how they were created. So:

- **Bypass mode** + write to `.claude/skills/my-skill/SKILL.md` → allowed (no prompt)
- **Then** model tries `Skill(my-skill)` → permission check fires, deny rule honors

The two-layer separation (write-time vs invoke-time) keeps the user's explicit YOLO opt-in from also disabling the rule-driven safety.

---

## 6. The Equivalent for Read — `St$()` Excluded Patterns

The complement to "what to protect from writes" is "what to exclude from reads" — the sandbox-ripgrep used by `Grep` and `Glob` tools excludes these same paths from search results (chunks `_top_*`, line 195125-195127):

```javascript
function St$() {
  return [...Va1.filter((H) => H !== ".git"), ".claude/commands", ".claude/agents"];
}
```

Where `Va1 = [".git", ".vscode", ".idea"]`. So `St$()` returns `[".vscode", ".idea", ".claude/commands", ".claude/agents"]` — these are filtered out of Grep results by default.

The asymmetry: `.claude/skills` is **NOT** in `St$()` (it's only in the write-protection list under non-bypass), and `.git` is in `St$()` only conditionally (the filter excludes it because `.git/config` is handled separately by `xa1` at line 195860). This is layered carefully: `.git` content is hidden from reads but `.git/config` is *explicitly* allowed in some workflows; `.claude/commands` and `.claude/agents` are hidden from reads (so the model doesn't accidentally reverse-engineer the user's custom commands).

---

## 7. The User Experience Story

Before v2.1.121/126, a user in YOLO mode writing a new skill:

```
$ claude --dangerously-skip-permissions
> create a new skill called my-deploy that runs my deploy.sh

Claude wants to write to .claude/skills/my-deploy/SKILL.md, which appears
to be a sensitive file. Approve / Deny?

> approve

[file written]

Claude wants to edit .claude/skills/my-deploy/SKILL.md, ... Approve / Deny?

> approve  ← prompted again on second edit!
```

After:

```
$ claude --dangerously-skip-permissions
> create a new skill called my-deploy that runs my deploy.sh

[skill written, no prompt]
[follow-up edits, no prompt]
```

The friction was the issue. YOLO mode is opted-into specifically to **avoid prompts**; getting them for the user's own customization paths violated that contract.

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_v2_1_142_permission.md`](../00_overview/symbol_additions_v2_1_142_permission.md) — Symbols introduced/changed in this module
> - [`symbol_index_infra_platform.md`](../00_overview/symbol_index_infra_platform.md) — Existing platform/permission symbols

Key functions and constants in this document:
- `pathSafetyCheck` (`bY$`) — Top-level safety check; selects `hw8` vs `$u5` based on bypass state
- `isSettingsFile` (`hw8`) — Matches `.claude/settings.json` and the managed-settings list
- `isSettingsOrUserCustomization` (`$u5`) — Extends `hw8` with `.claude/commands`, `.claude/agents`, `.claude/skills`
- `isSensitivePath` (`_u5`) — Per-segment protected-directory check with `.claude/` subpath carve-out
- `hasSuspiciousWindowsPattern` (`Yy4`) — UNC/reserved-name/three-dots detection
- `protectedDirectoriesList` (`tx5`) — Set of `.git`/`.ssh`/`.aws`/`.claude` etc.
- `protectedFilesList` (`sx5`) — Set of `.env`, `.bashrc`, etc.
- `getSandboxRipgrepExcludes` (`St$`) — Returns `.claude/commands`, `.claude/agents`, etc. for ripgrep exclusion
- `vsCodeIdeaExcludes` (`Va1`) — `[".git", ".vscode", ".idea"]` base list
- `dotEnvVariants` (`bA6`) — 8 `.env*` filenames
- `getManagedSettingsList` (`Hu5`) — Returns managed-settings file paths (for `hw8`)
- `isDescendantOf` (`ah`) — Hierarchical path-containment check used by `$u5`
