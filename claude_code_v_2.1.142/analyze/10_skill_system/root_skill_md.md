# Root-Level `SKILL.md` as a Plugin Skill (v2.1.142)

## What it does

Before v2.1.142 a plugin had two ways to surface a skill:

1. Auto-load: drop a `<plugin-root>/skills/<name>/SKILL.md` file. The plugin loader scans `skills/`, finds every directory containing a `SKILL.md`, and registers each as a skill named after the directory.
2. Manifest: declare `"skills": ["<path>"]` (or `["<path-a>", "<path-b>"]`) in `plugin.json` and let the loader resolve each entry as a skill directory.

v2.1.142 adds a third path for the common case where a plugin **is** a single skill: if the plugin has neither a `skills/` subdirectory nor a `skills` manifest entry, but a `SKILL.md` file exists at the plugin root, the loader registers the plugin root itself as one skill.

This collapses the boilerplate from `my-plugin/skills/my-plugin/SKILL.md` to just `my-plugin/SKILL.md` for single-skill plugins.

---

## How it works

### 1. The fallback branch in the plugin loader

The plugin loader (`U88` in `cli_inner_pretty.js:230049`) walks each plugin directory once at session startup. After it processes the manifest, it falls through a series of optional component sources (`commands`, `agents`, `output-styles`, `themes`, `skills`, `hooks`, `monitors`). The skill block in v2.1.142 looks like this:

```javascript
// ============================================
// pluginRootSkillFallback - The root-level SKILL.md detection
// Location: cli_inner_pretty.js:230198-230213
// ============================================

// ORIGINAL (for source lookup):
let R = pq.join(H, "skills");
if (G) M.skillsPath = R;
if (Y.skills) {
  let l = Array.isArray(Y.skills) ? Y.skills : [Y.skills],
    r = pq.resolve(R),
    KH = pq.resolve(H),
    HH = (await kg(l, H, Y.name, $, "skills", "Skill", "specified in manifest but", A, !0)).filter((qH) => {
      let a = pq.resolve(qH);
      if (a === r) return !1;
      if (P === H2 && a === KH) return !1;
      return !0;
    });
  if (HH.length > 0) M.skillsPaths = HH;
} else if (!G && P !== H2) {
  if (await H_(pq.join(H, "SKILL.md"))) M.skillsPaths = [H];
}

// READABLE (for understanding):
let skillsSubdir = path.join(pluginRoot, "skills");
if (hasSkillsSubdir) pluginInfo.skillsPath = skillsSubdir;          // default scan path

if (manifest.skills) {
  // Explicit manifest entry path
  let list = Array.isArray(manifest.skills) ? manifest.skills : [manifest.skills];
  let resolvedSkillsDir = path.resolve(skillsSubdir);
  let resolvedPluginRoot = path.resolve(pluginRoot);
  let resolvedSkillPaths = (
    await validatePluginComponentPaths(
      list, pluginRoot, manifest.name, sourceTag,
      "skills", "Skill", "specified in manifest but",
      errors, /*expectDir=*/true,
    )
  ).filter((skillPath) => {
    let abs = path.resolve(skillPath);
    if (abs === resolvedSkillsDir) return false;                    // already auto-loaded
    if (marketplace === SKILLS_DIR_SENTINEL && abs === resolvedPluginRoot) {
      return false;                                                  // skills-dir marketplace
                                                                     // never re-injects root
    }
    return true;
  });
  if (resolvedSkillPaths.length > 0) pluginInfo.skillsPaths = resolvedSkillPaths;
} else if (!hasSkillsSubdir && marketplace !== SKILLS_DIR_SENTINEL) {
  // NEW v2.1.142 fallback - no skills/ subdir, no manifest entry,
  // and the plugin is not auto-loaded from the .claude/skills/ scanner.
  // If the plugin root itself has a SKILL.md, treat the whole plugin as one skill.
  if (await pathExists(path.join(pluginRoot, "SKILL.md"))) {
    pluginInfo.skillsPaths = [pluginRoot];
  }
}

// Mapping:
//   U88 -> loadPluginFromDir,
//   R   -> skillsSubdir,         G  -> hasSkillsSubdir,
//   M   -> pluginInfo,           H  -> pluginRoot,
//   Y   -> manifest,             $  -> sourceTag,
//   A   -> errors,               P  -> marketplace,
//   H2  -> SKILLS_DIR_SENTINEL ("skills-dir"),
//   pq  -> path,                 H_ -> pathExists,
//   kg  -> validatePluginComponentPaths
```

### 2. The downstream skill scanner

The scanner that consumes `skillsPaths` ([`nX5` cli_inner_pretty.js:457453](.)) already handles "the path **is** the skill" by checking for a root-level `SKILL.md` before falling back to the per-directory subdir scan:

```javascript
// ============================================
// scanPluginSkillsPaths - Scans each skillsPath entry for SKILL.md
// Location: cli_inner_pretty.js:457453-457486
// ============================================

// ORIGINAL (for source lookup):
async function nX5(H) {
  let $ = [];
  for (let q of H) {
    if (!q) continue;
    try {
      let _ = Kr.join(q, "SKILL.md");
      if ((await _r.stat(_)).isFile()) {
        let z = "";
        try {
          let Y = await cY4(_, dY4),
            { frontmatter: f } = tO(Y, _);
          z = typeof f.name === "string" ? f.name.trim() : "";
        } catch {}
        $.push({ name: z || Kr.basename(q), path: q });
        continue;
      }
    } catch {}
    let K;
    try {
      K = await _r.readdir(q, { withFileTypes: !0 });
    } catch (_) { nx6(q, _); continue; }
    for (let _ of K) {
      if (!_.isDirectory() && !_.isSymbolicLink()) continue;
      let A = Kr.join(q, _.name);
      try {
        if ((await _r.stat(Kr.join(A, "SKILL.md"))).isFile()) $.push({ name: _.name, path: A });
      } catch {}
    }
  }
  return $;
}

// READABLE (for understanding):
async function scanSkillsPaths(skillsPaths) {
  let out = [];
  for (let dir of skillsPaths) {
    if (!dir) continue;
    // Branch A: `dir/SKILL.md` exists at the root - treat dir as the skill
    try {
      let skillMd = path.join(dir, "SKILL.md");
      if ((await fs.stat(skillMd)).isFile()) {
        // Use the frontmatter `name` if provided, otherwise use the directory name
        let name = "";
        try {
          let head = await readFirstNBytes(skillMd, MAX_SKILL_MD_BYTES);
          let { frontmatter } = parseFrontmatter(head, skillMd);
          name = typeof frontmatter.name === "string" ? frontmatter.name.trim() : "";
        } catch {}
        out.push({ name: name || path.basename(dir), path: dir });
        continue;          // do not recurse - the directory itself is the skill
      }
    } catch {}
    // Branch B: directory does not have a root SKILL.md - scan immediate subdirs
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch (err) { logScanFailure(dir, err); continue; }
    for (let entry of entries) {
      if (!entry.isDirectory() && !entry.isSymbolicLink()) continue;
      let subdir = path.join(dir, entry.name);
      try {
        if ((await fs.stat(path.join(subdir, "SKILL.md"))).isFile()) {
          out.push({ name: entry.name, path: subdir });
        }
      } catch {}
    }
  }
  return out;
}

// Mapping:
//   nX5 -> scanSkillsPaths,
//   Kr  -> path,                 _r -> fs,
//   q   -> dir,                  _  -> skillMd / err / entry / subdir (reused),
//   dY4 -> MAX_SKILL_MD_BYTES (1048576),
//   cY4 -> readFirstNBytes,      tO -> parseFrontmatter,
//   z   -> name,                 nx6 -> logScanFailure
```

The fact that this function already supported "the path **is** the skill" is what made the v2.1.142 change trivial - the loader just had to call it with `[H]` (the plugin root) in the right gate.

### 3. The marketplace sentinel `H2`

The constant `H2 = "skills-dir"` (`cli_inner_pretty.js:218312`) is a sentinel marketplace name for plugins auto-loaded from `~/.claude/skills/`. When a user drops `~/.claude/skills/<skill>/SKILL.md`, the host treats each as a one-skill plugin with `marketplace: "skills-dir"`. For those, the v2.1.142 fallback is intentionally **skipped** - the user's `~/.claude/skills/<skill>/` is already the skill directory, so re-injecting it as a plugin-root skill would double-register it.

The gate is the `P !== H2` clause:

```javascript
} else if (!G && P !== H2) {                  // !hasSkillsSubdir && marketplace !== "skills-dir"
  if (await H_(pq.join(H, "SKILL.md"))) {     // SKILL.md exists at plugin root
    M.skillsPaths = [H];                       // register the plugin root as a skill path
  }
}
```

### 4. Plugin component listing for `/plugin details` and `/context`

The other helper that consumes `skillsPath` + `skillsPaths` is the plugin inventory function (`nX5` for the inventory variant at `cli_inner_pretty.js:457453`). The fact that the same helper feeds both the runtime loader and the `claude plugin details` UI means a v2.1.142 plugin with a root-level `SKILL.md` shows up as one skill in both places without a separate code path.

---

## Why this approach

**Single-skill plugins are the dominant shape.** Most published plugins ship one skill. Forcing them into the `skills/<name>/SKILL.md` boilerplate doubles the directory depth and forces the author to pick a subdir name (often duplicated from the plugin name). The v2.1.142 fallback removes that friction.

**Why a fallback, not an alternative?** The loader cannot simply "look for `SKILL.md` always" because:

- A plugin can have multiple skills (`skills/foo/SKILL.md` and `skills/bar/SKILL.md`) - those must still be discovered.
- The plugin author might want to ship a `SKILL.md` as documentation (e.g. a top-level README-like file) without it being a registered skill - but only if they also declare an explicit `skills` field.

The chosen rule - "root-level `SKILL.md` becomes a skill **only** when nothing else declares a skill" - keeps both behaviors working without breaking older plugins.

**Why exclude the `skills-dir` marketplace?** Those plugins are themselves rooted at `~/.claude/skills/<name>/`, which the v2.1.121 `.claude/skills/` scanner already loaded as a top-level skill. Letting the v2.1.142 fallback re-register it would create a duplicate at the plugin layer with a slightly different name (the directory basename rather than the frontmatter `name`).

**Key insight:** The marketplace sentinel `H2 = "skills-dir"` is doing dual duty - it acts as both a flag ("this plugin came from the auto-skill scanner") and a privilege gate ("this plugin should not apply the root-SKILL.md fallback"). Without that sentinel, the v2.1.142 change would have created a regression for every `.claude/skills/` user.

---

## Edge cases

| Scenario | Behavior |
|----------|----------|
| `SKILL.md` and `skills/` both exist, no manifest entry | `skills/` subdirs win; root `SKILL.md` is ignored (legacy behavior preserved) |
| `SKILL.md` and `skills:` in manifest | Manifest entries win; root `SKILL.md` is ignored unless explicitly listed |
| `SKILL.md` only, no `skills/`, no manifest entry, plugin in regular marketplace | NEW v2.1.142 - root SKILL.md registered as one skill, name from frontmatter or plugin basename |
| `SKILL.md` only, plugin in `skills-dir` marketplace | Root SKILL.md *not* re-registered (already loaded by `.claude/skills/` scanner) |
| Frontmatter `name:` provided | Used as the skill name |
| No `name:` frontmatter | Skill name = `path.basename(pluginRoot)` |

---

## Files involved

- `cli_inner_pretty.js:230198-230213` - The fallback branch in `U88` (plugin manifest loader)
- `cli_inner_pretty.js:457453-457486` - `nX5` scanner that handles "the path **is** the skill"
- `cli_inner_pretty.js:218312` - The `H2 = "skills-dir"` marketplace sentinel
- `cli_inner_pretty.js:229990-229995` - `WTH` path-traversal guard used by `kg`
- `cli_inner_pretty.js:229997-230032` - `kg` (validatePluginComponentPaths) - the directory-vs-file check that makes the `skills: ["./"]` form work (cross-link: [plugin_skills_inheritance.md](./plugin_skills_inheritance.md))
