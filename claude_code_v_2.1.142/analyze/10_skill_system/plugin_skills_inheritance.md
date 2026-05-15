# Plugin `skills` Inheritance and Validation (v2.1.136 + v2.1.142)

## What it does

Two related changes ship in v2.1.136 and v2.1.142 that tighten plugin manifest validation around the `skills` field:

| Change | Version | Effect |
|--------|---------|--------|
| `skills: ["./"]` no longer rejected | v2.1.142 | The plugin author can explicitly opt into "the plugin root **is** the skill" via a manifest entry instead of relying on the v2.1.142 fallback for root-level `SKILL.md`. The path resolver now treats `./` (the plugin root itself) as a valid skill directory, gated by a marketplace sentinel so the `@skills-dir` auto-loader does not double-register. |
| `plugin.json skills` hides default `skills/` directory | v2.1.136 | When the manifest declares `skills` but the plugin also has a `skills/` folder on disk, the folder is not auto-loaded - but the load is now reported as a `folder-shadowed-by-manifest` advisory in the plugin diagnostic stream, surfaced in `/doctor`, `claude plugin list`, and `/plugin`. |
| Listing a file path shows error | v2.1.136 | `skills` accepted any path before; now it must resolve to a directory. A file path produces a `component-load-failed` error stating "path is a file; expected a directory". |

---

## How it works

### 1. The shared path validator

`kg` (`validatePluginComponentPaths`) is the helper used by `commands`, `agents`, `skills`, `output-styles`, `themes`, and `hooks` manifest paths. v2.1.136 adds a boolean parameter `f` (`expectDir`):

```javascript
// ============================================
// validatePluginComponentPaths - generic path resolver with optional dir check
// Location: cli_inner_pretty.js:229997-230032
// ============================================

// ORIGINAL (for source lookup):
async function kg(H, $, q, K, _, A, z, Y, f = !1) {
  let O = await Promise.all(
      H.map(async (w) => {
        let D = WTH($, w);
        if (D === null) return { relPath: w, fullPath: null, exists: !1, isDirectory: !1 };
        try {
          let j = await V_.stat(D);
          return { relPath: w, fullPath: D, exists: !0, isDirectory: j.isDirectory() };
        } catch {
          return { relPath: w, fullPath: D, exists: !1, isDirectory: !1 };
        }
      }),
    ),
    M = [];
  for (let { relPath: w, fullPath: D, exists: j, isDirectory: J } of O) {
    if (D === null) {
      (N(`${A} path ${w} ${z} escapes plugin directory for ${q}`, { level: "error" }),
        Y.push({ type: "path-traversal", source: K, plugin: q, path: w, component: _ }));
      continue;
    }
    if (!j)
      (N(`${A} path ${w} ${z} not found at ${D} for ${q}`, { level: "error" }),
        Y.push({ type: "path-not-found", source: K, plugin: q, path: D, component: _ }));
    else if (f && !J)
      (N(`${A} path ${w} ${z} is a file, not a directory, for ${q}`, { level: "error" }),
        Y.push({
          type: "component-load-failed",
          source: K,
          plugin: q,
          path: w,
          component: _,
          reason: "path is a file; expected a directory",
        }));
    else M.push(D);
  }
  return M;
}

// READABLE (for understanding):
async function validatePluginComponentPaths(
  pathList,
  pluginRoot,
  pluginName,
  source,
  componentType,
  displayName,
  errorContext,
  errors,
  expectDir = false,                                                  // <-- v2.1.136 added param
) {
  // Resolve each path inside the plugin root (rejects path traversal)
  const resolved = await Promise.all(
    pathList.map(async (relPath) => {
      const fullPath = resolvePluginPathRelative(pluginRoot, relPath);
      if (fullPath === null) return { relPath, fullPath: null, exists: false, isDirectory: false };
      try {
        const stat = await fs.stat(fullPath);
        return { relPath, fullPath, exists: true, isDirectory: stat.isDirectory() };
      } catch {
        return { relPath, fullPath, exists: false, isDirectory: false };
      }
    }),
  );
  const valid = [];
  for (const { relPath, fullPath, exists, isDirectory } of resolved) {
    if (fullPath === null) {
      // Path escapes plugin directory
      log(`${displayName} path ${relPath} ${errorContext} escapes plugin directory for ${pluginName}`, { level: "error" });
      errors.push({ type: "path-traversal", source, plugin: pluginName, path: relPath, component: componentType });
      continue;
    }
    if (!exists) {
      log(`${displayName} path ${relPath} ${errorContext} not found at ${fullPath} for ${pluginName}`, { level: "error" });
      errors.push({ type: "path-not-found", source, plugin: pluginName, path: fullPath, component: componentType });
    } else if (expectDir && !isDirectory) {                            // <-- v2.1.136 strict check
      log(`${displayName} path ${relPath} ${errorContext} is a file, not a directory, for ${pluginName}`, { level: "error" });
      errors.push({
        type: "component-load-failed",
        source, plugin: pluginName, path: relPath, component: componentType,
        reason: "path is a file; expected a directory",
      });
    } else {
      valid.push(fullPath);
    }
  }
  return valid;
}

// Mapping:
//   kg  -> validatePluginComponentPaths,         H   -> pathList,
//   $   -> pluginRoot,                           q   -> pluginName,
//   K   -> source,                               _   -> componentType,
//   A   -> displayName,                          z   -> errorContext,
//   Y   -> errors,                               f   -> expectDir,
//   WTH -> resolvePluginPathRelative
```

In v2.1.142 the plugin loader (`U88`) calls `kg(..., /*expectDir=*/true)` for the `skills` block:

```javascript
// Location: cli_inner_pretty.js:230200-230213
if (Y.skills) {
  let l = Array.isArray(Y.skills) ? Y.skills : [Y.skills];
  // ... resolve subdir + plugin root for self-reference filtering ...
  let HH = (
    await kg(l, H, Y.name, $, "skills", "Skill", "specified in manifest but", A, /*expectDir=*/!0)
  ).filter((qH) => {
    let a = pq.resolve(qH);
    if (a === r) return !1;                              // skip skills/ itself (already auto-loaded)
    if (P === H2 && a === KH) return !1;                 // skip plugin root for skills-dir marketplace
    return !0;
  });
  if (HH.length > 0) M.skillsPaths = HH;
}
```

The `expectDir = true` flag is what makes `skills: ["mycommand.md"]` (a file path) produce the error message.

### 2. The marketplace sentinel `H2` and the `skills: ["./"]` path

When a plugin's manifest sets `skills: ["./"]`, the `kg` helper resolves `./` to the plugin root. The post-filter then checks:

- Is the resolved path the **default skills subdir** (already covered by `skillsPath` auto-scan)? Skip it.
- Is the resolved path the **plugin root** AND is this plugin under the `skills-dir` sentinel marketplace? Skip it.

The second clause is what prevented the false "path escapes plugin directory" error from v2.1.141 - the resolver itself accepts the plugin root, but the filter was rejecting it for non-`skills-dir` plugins, and the resulting empty list caused the loader to fall back to the "no skills declared" path, which then sometimes hit the v2.1.142 root-SKILL.md fallback (covered in [root_skill_md.md](./root_skill_md.md)).

The v2.1.142 fix:
- Resolver `WTH` already returned the plugin root as a valid path (the relative `.` does not start with `..`).
- The filter was relaxed so plugin root is accepted as a skill path for non-`skills-dir` plugins.

### 3. The `WTH` path-traversal guard

```javascript
// ============================================
// resolvePluginPathRelative - path resolver with escape guard
// Location: cli_inner_pretty.js:229990-229995
// ============================================

// ORIGINAL (for source lookup):
function WTH(H, $) {
  let q = pq.resolve(H),
    K = pq.resolve(q, $),
    _ = pq.relative(q, K);
  if (_.startsWith("..") || pq.resolve(_) === _) return null;
  return K;
}

// READABLE (for understanding):
function resolvePluginPathRelative(pluginRoot, relPath) {
  const absRoot = path.resolve(pluginRoot);
  const absResolved = path.resolve(absRoot, relPath);
  const relative = path.relative(absRoot, absResolved);
  // Reject paths that escape the plugin root via `..` or absolute paths
  if (relative.startsWith("..") || path.resolve(relative) === relative) return null;
  return absResolved;
}

// Mapping: WTH -> resolvePluginPathRelative, pq -> path, H -> pluginRoot, $ -> relPath
```

For `relPath = "./"`, `relative` ends up empty string, which does not start with `..` and is not an absolute path resolution - so the function returns the absolute plugin root. That is the path the v2.1.142 filter now accepts.

### 4. The shadowing advisory

`U88` records advisories for the manifest+folder collision case in the plugin error stream (`z`, the second return value):

```javascript
// ============================================
// folderShadowedByManifest advisory - emitted when plugin.json hides default dir
// Location: cli_inner_pretty.js:230063-230090
// ============================================

// ORIGINAL (for source lookup):
for (let [l, r, KH, HH] of [
  ["commands", w, "commands", "commands"],
  ["agents", D, "agents", "agents"],
  ["outputStyles", J, "output-styles", "output-styles"],
  ["themes", X, "themes", "themes"],
]) {
  let qH, a = [l];
  if (l === "themes") {
    if (((qH = Y.experimental?.themes ?? Y.themes), (a = []), Y.experimental?.themes)) a.push("experimental.themes");
    if (Y.themes) a.push("themes");
  } else qH = Y[l];
  if (!qH || !r) continue;
  V36(Y.name, P, KH);
  let t = pq.join(H, HH);
  if (r__(qH, H, t)) continue;
  (N(
    `Plugin ${Y.name}: ${HH}/ folder exists but is not auto-loaded because the manifest sets ${a.map((MH) => `"${MH}"`).join(" and ")}`,
  ),
    z.push({
      type: "folder-shadowed-by-manifest",
      source: $,
      plugin: Y.name,
      component: KH,
      folderPath: t,
      manifestFields: a,
    }));
}

// READABLE (for understanding):
for (const [manifestKey, folderExists, componentKey, folderName] of [
  ["commands",     hasCommandsDir,     "commands",      "commands"],
  ["agents",       hasAgentsDir,       "agents",        "agents"],
  ["outputStyles", hasOutputStylesDir, "output-styles", "output-styles"],
  ["themes",       hasThemesDir,       "themes",        "themes"],
]) {
  let manifestValue, manifestPaths = [manifestKey];
  if (manifestKey === "themes") {
    // themes can live under experimental.themes OR top-level themes
    manifestValue = manifest.experimental?.themes ?? manifest.themes;
    manifestPaths = [];
    if (manifest.experimental?.themes) manifestPaths.push("experimental.themes");
    if (manifest.themes) manifestPaths.push("themes");
  } else {
    manifestValue = manifest[manifestKey];
  }
  // Skip if there is no manifest entry or the default folder does not exist
  if (!manifestValue || !folderExists) continue;
  // Record the marketplace-style "advisory" via the global counter
  recordAdvisoryMarketplaceTransition(manifest.name, marketplace, componentKey);
  const folderPath = path.join(pluginRoot, folderName);
  // If the manifest entries already point at the default folder, do not warn (intent matches reality)
  if (manifestPathsCoverDefaultFolder(manifestValue, pluginRoot, folderPath)) continue;
  // ADVISORY: warn the user that the default folder is shadowed
  log(
    `Plugin ${manifest.name}: ${folderName}/ folder exists but is not auto-loaded because the manifest sets ${manifestPaths.map(name => `"${name}"`).join(" and ")}`,
  );
  warnings.push({
    type: "folder-shadowed-by-manifest",
    source, plugin: manifest.name, component: componentKey,
    folderPath, manifestFields: manifestPaths,
  });
}

// Mapping:
//   r__ -> manifestPathsCoverDefaultFolder,
//   V36 -> recordAdvisoryMarketplaceTransition,
//   z   -> warnings stream,
//   Y   -> manifest,
//   H   -> pluginRoot,
//   $   -> source
```

The advisory rendering helper (`VjH` at `cli_inner_pretty.js:457508`) formats the warning for human display: `"<component> path escapes plugin directory: <path>"`, `"<component> path not found: <path>"`, etc. The `folder-shadowed-by-manifest` type renders via the plugin diagnostic UI in `/doctor` and `/plugin`.

Note: this advisory was extended in v2.1.142 (per the CHANGELOG "Fixed plugin advisories not naming every `plugin.json` key that shadows a default folder") to enumerate **every** manifest key that contributed to the shadow (e.g. both `commands` and `experimental.themes` would be listed if both shadowed the same default folder).

### 5. The `r__` helper - "does the manifest entry already cover the default folder?"

```javascript
// ============================================
// manifestPathsCoverDefaultFolder - is the explicit manifest path covering the default folder?
// Location: cli_inner_pretty.js:230034-230048
// ============================================

// ORIGINAL (for source lookup):
function r__(H, $, q) {
  let K = [];
  if (typeof H === "string") K.push(H);
  else if (Array.isArray(H)) {
    for (let A of H) if (typeof A === "string") K.push(A);
  } else if (H && typeof H === "object") {
    for (let A of Object.values(H))
      if (A && typeof A === "object" && "source" in A && typeof A.source === "string") K.push(A.source);
  }
  let _ = q + pq.sep;
  return K.some((A) => {
    let z = WTH($, A);
    return z !== null && (z + pq.sep).startsWith(_);
  });
}

// READABLE (for understanding):
function manifestPathsCoverDefaultFolder(manifestEntry, pluginRoot, defaultFolderPath) {
  const paths = [];
  if (typeof manifestEntry === "string") paths.push(manifestEntry);
  else if (Array.isArray(manifestEntry)) {
    for (const item of manifestEntry) if (typeof item === "string") paths.push(item);
  } else if (manifestEntry && typeof manifestEntry === "object") {
    // For commands-shape ({ name: { source: "<path>" } }) extract each source
    for (const entry of Object.values(manifestEntry)) {
      if (entry && typeof entry === "object" && "source" in entry && typeof entry.source === "string") {
        paths.push(entry.source);
      }
    }
  }
  const defaultPrefix = defaultFolderPath + path.sep;
  return paths.some((p) => {
    const resolved = resolvePluginPathRelative(pluginRoot, p);
    return resolved !== null && (resolved + path.sep).startsWith(defaultPrefix);
  });
}

// Mapping: r__ -> manifestPathsCoverDefaultFolder, pq -> path, WTH -> resolvePluginPathRelative
```

This is the "do not warn if the author manifested-in the same default path" guard. If `commands: ["commands/foo.md"]` is in the manifest and a `commands/` directory exists, the warning is suppressed because the manifest path is **inside** the default folder (the author is being explicit, not shadowing).

---

## Why this approach

**Why a separate `expectDir` parameter on `kg`?** The same path resolver serves `commands` (file `.md` paths) and `skills`/`agents` (directory paths). Without the flag, the resolver would either silently accept files for `skills` (breaking on first use) or always reject them (regressing `commands`). The flag keeps one helper, both behaviors.

**Why an advisory, not an error, for the shadowing case?** Backwards compatibility - plugins shipped before v2.1.136 that have both a manifest entry and a default folder are not technically wrong, they just have unintentional dead code. Raising it to an error would break the install. The advisory pattern matches the v2.1.122 `/doctor` pattern: surface the issue, do not block.

**Why the marketplace sentinel `H2` for the `["./"]` case?** Because plugins auto-loaded from `~/.claude/skills/` are **already** the skill directory - their plugin root IS the skill folder. Re-injecting it via the manifest would double-count. The sentinel lets the same loader code path serve both regular plugins (where root-as-skill is opt-in) and auto-scanned plugins (where root-as-skill is implicit and already handled).

**Key insight:** The two related changes (v2.1.136 manifest hiding, v2.1.142 `["./"]` validity) both work by gating on what would historically have been a silent fall-through. v2.1.136 says "if the manifest didn't intend to suppress the folder, warn so the user knows the folder is dead." v2.1.142 says "if the manifest explicitly references `./`, accept it for non-auto-loaded plugins." Together they make plugin authors' intent legible to the host without breaking older plugins.

---

## Edge cases

| `plugin.json` `skills` field | `skills/` exists? | Result |
|------------------------------|--------------------|--------|
| omitted                      | yes                | Auto-load from `skills/` (legacy) |
| omitted                      | no, root SKILL.md  | NEW v2.1.142: register plugin root as skill |
| `["./"]`                     | no                 | Register plugin root as skill (manifest opt-in) |
| `["./"]`                     | yes                | Skip `./` (filter rejects plugin root), keep `skills/` auto-load |
| `["foo"]` where `foo/` exists | yes (but `foo` != `skills`) | Only `foo` loads; `skills/` is shadowed -> advisory |
| `["foo.md"]` (file path)     | -                  | NEW v2.1.136: `component-load-failed` error |
| `["nonexistent"]`            | -                  | `path-not-found` error |
| `["../escape"]`              | -                  | `path-traversal` error (unchanged) |

---

## Cross-references

- The v2.1.142 root-level fallback (no manifest, no `skills/`, but root `SKILL.md` exists) - [root_skill_md.md](./root_skill_md.md)
- The `H2 = "skills-dir"` marketplace sentinel and its semantics - [root_skill_md.md](./root_skill_md.md#3-the-marketplace-sentinel-h2)
- Plugin manifest schema (where `skills` is declared) - `26_plugin_packaging`
- `/doctor` plugin diagnostics rendering - `26_plugin_packaging` or `28_cli_commands`
- The `VjH` error formatter renders the `component-load-failed`/`path-not-found`/`path-traversal` types into human strings.
