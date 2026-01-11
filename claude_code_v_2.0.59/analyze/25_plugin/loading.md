# Plugin Component Loading

> How plugin components (commands, skills, agents, hooks) are loaded at runtime.
>
> **Related Symbols:** See [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Plugin System section

---

## Quick Navigation

- [Loading Architecture](#loading-architecture)
- [Plugin Discovery](#plugin-discovery)
- [Command Loading](#command-loading)
- [Skill Loading](#skill-loading)
- [Agent Loading](#agent-loading)
- [Hook Integration](#hook-integration)
- [Output Style Loading](#output-style-loading)
- [Cache Management](#cache-management)

---

## Loading Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         STARTUP FLOW                                    │
│                                                                         │
│  initializePlugins (L39)                                               │
│          │                                                              │
│          ▼                                                              │
│  syncInstalledPlugins (qX0)  ← Sync settings with registry              │
│          │                                                              │
│          ▼                                                              │
│  getPluginsWithState (l7)    ← Get enabled/disabled plugins             │
│          │                        (memoized)                            │
│          │                                                              │
│          ├──────────────┬──────────────┬──────────────┐                │
│          ▼              ▼              ▼              ▼                │
│     getPluginCmd    getPluginSkills  getPluginAgents  loadHooks        │
│       (PQA)           (iW0)           (_0A)           (_1A)            │
│     (memoized)      (memoized)                                          │
│          │              │              │              │                │
│          └──────────────┴──────────────┴──────────────┘                │
│                                    │                                    │
│                                    ▼                                    │
│                           usePluginLoader ($I1)                         │
│                     (React hook - updates app state)                    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Plugin Discovery

### Get Plugins with State

```javascript
// ============================================
// getPluginsWithState - Get all plugins with enabled/disabled state
// Location: chunks.95.mjs:1751-1765
// ============================================

// ORIGINAL (for source lookup):
l7 = s1(async () => {
  let A = await f85(),         // Load from settings
      Q = [...A.plugins],
      B = [...A.errors],
      G = Iz0();              // Get session plugin dirs

  if (G.length > 0) {
    let Z = await g85(G);     // Load session plugins
    Q.push(...Z.plugins);
    B.push(...Z.errors);
  }

  g(`Found ${Q.length} plugins (${Q.filter((Z)=>Z.enabled).length} enabled, ${Q.filter((Z)=>!Z.enabled).length} disabled)`);

  return {
    enabled: Q.filter((Z) => Z.enabled),
    disabled: Q.filter((Z) => !Z.enabled),
    errors: B
  };
})

// READABLE (for understanding):
getPluginsWithState = memoize(async () => {
  // Load plugins from settings/registry
  const fromSettings = await loadPluginsFromSettings();
  const plugins = [...fromSettings.plugins];
  const errors = [...fromSettings.errors];

  // Load session-only plugins from --plugin-dir CLI arg
  const sessionDirs = getSessionPluginDirs();
  if (sessionDirs.length > 0) {
    const sessionPlugins = await loadSessionPlugins(sessionDirs);
    plugins.push(...sessionPlugins.plugins);
    errors.push(...sessionPlugins.errors);
  }

  log(`Found ${plugins.length} plugins (${plugins.filter(p => p.enabled).length} enabled)`);

  return {
    enabled: plugins.filter(p => p.enabled),
    disabled: plugins.filter(p => !p.enabled),
    errors
  };
});

// Each plugin object contains:
// {
//   name: "code-formatter",
//   enabled: true,
//   path: "/Users/.../.claude/plugins/cache/.../1.2.0",
//   manifest: { ... },
//   source: "code-formatter@claude-plugins-official",
//   commandsPath: "/Users/.../commands",
//   commandsPaths: [...],
//   commandsMetadata: { ... },
//   skillsPath: "/Users/.../skills",
//   skillsPaths: [...]
// }

// Mapping: l7→getPluginsWithState, s1→memoize, f85→loadPluginsFromSettings,
//          Iz0→getSessionPluginDirs, g85→loadSessionPlugins
```

### Load Plugins from Settings

```javascript
// ============================================
// loadPluginsFromSettings - Load plugins based on settings
// Location: chunks.95.mjs (part of l7 dependencies)
// ============================================

// READABLE (for understanding):
async function loadPluginsFromSettings() {
  const plugins = [];
  const errors = [];

  // Get installed plugins registry
  const installed = getInstalledPlugins();

  // Get enabled/disabled settings
  const enabledSettings = getEnabledPluginSettings();

  for (const [pluginId, installEntry] of Object.entries(installed)) {
    try {
      // Determine if enabled (default: true)
      const isEnabled = enabledSettings[pluginId] !== false;

      // Load manifest
      const manifestPath = path.join(installEntry.installPath, ".claude-plugin", "plugin.json");
      const manifest = loadManifestIfExists(manifestPath);

      // Build plugin object with computed paths
      const plugin = {
        name: extractPluginName(pluginId),
        enabled: isEnabled,
        path: installEntry.installPath,
        manifest: manifest,
        source: pluginId,
        commandsPath: computeCommandsPath(installEntry.installPath, manifest),
        commandsPaths: computeExtraCommandsPaths(installEntry.installPath, manifest),
        commandsMetadata: manifest?.commands,
        skillsPath: computeSkillsPath(installEntry.installPath, manifest),
        skillsPaths: computeExtraSkillsPaths(installEntry.installPath, manifest)
      };

      plugins.push(plugin);
    } catch (error) {
      errors.push({
        type: "plugin-load-error",
        source: pluginId,
        error: error.message
      });
    }
  }

  return { plugins, errors };
}
```

---

## Command Loading

### Get Plugin Commands

```javascript
// ============================================
// getPluginCommands - Load commands from all enabled plugins
// Location: chunks.142.mjs:3474-3585
// ============================================

// ORIGINAL (for source lookup):
PQA = s1(async () => {
  let { enabled: A, errors: Q } = await l7(),
      B = [];

  if (Q.length > 0) g(`Plugin loading errors: ${Q.map((G)=>oM(G)).join(", ")}`);

  for (let G of A) {
    // Load from default commandsPath
    if (G.commandsPath) try {
      let Z = await v69(G.commandsPath, G.name, G.source, G.manifest, G.path);
      if (B.push(...Z), Z.length > 0) g(`Loaded ${Z.length} commands from plugin ${G.name}`);
    } catch (Z) {
      g(`Failed to load commands from plugin ${G.name}: ${Z}`, { level: "error" });
    }

    // Load from extra commandsPaths
    if (G.commandsPaths) {
      for (let Z of G.commandsPaths) try {
        let I = RA(), Y = I.statSync(Z);
        if (Y.isDirectory()) {
          let J = await v69(Z, G.name, G.source, G.manifest, G.path);
          B.push(...J);
        } else if (Y.isFile() && Z.endsWith(".md")) {
          // Single file command
          let J = I.readFileSync(Z, { encoding: "utf-8" }),
              { frontmatter: W, content: X } = NV(J),
              V = `${G.name}:${rXA(Z).replace(/\.md$/,"")}`,
              F = { filePath: Z, baseDir: Ka(Z), frontmatter: W, content: X },
              K = RjA(V, F, G.source, G.manifest, G.path, !1);
          if (K) B.push(K);
        }
      } catch (I) {
        g(`Failed to load commands from ${Z}: ${I}`, { level: "error" });
      }
    }

    // Load inline content commands from metadata
    if (G.commandsMetadata) {
      for (let [Z, I] of Object.entries(G.commandsMetadata))
        if (I.content && !I.source) try {
          let { frontmatter: Y, content: J } = NV(I.content),
              W = `${G.name}:${Z}`,
              X = { filePath: `<inline:${W}>`, baseDir: G.path, frontmatter: Y, content: J },
              V = RjA(W, X, G.source, G.manifest, G.path, !1);
          if (V) B.push(V);
        } catch (Y) {
          g(`Failed to load inline command ${Z}: ${Y}`, { level: "error" });
        }
    }
  }

  g(`Total plugin commands loaded: ${B.length}`);
  return B;
})

// READABLE (for understanding):
getPluginCommands = memoize(async () => {
  const { enabled, errors } = await getPluginsWithState();
  const commands = [];

  if (errors.length > 0) {
    log(`Plugin loading errors: ${errors.map(formatError).join(", ")}`);
  }

  for (const plugin of enabled) {
    // 1. Load from default commands directory
    if (plugin.commandsPath) {
      try {
        const loaded = await loadCommandsFromDirectory(
          plugin.commandsPath,
          plugin.name,
          plugin.source,
          plugin.manifest,
          plugin.path
        );
        commands.push(...loaded);
        if (loaded.length > 0) {
          log(`Loaded ${loaded.length} commands from plugin ${plugin.name}`);
        }
      } catch (error) {
        log(`Failed to load commands from plugin ${plugin.name}: ${error}`, { level: "error" });
      }
    }

    // 2. Load from extra commandsPaths
    if (plugin.commandsPaths) {
      for (const cmdPath of plugin.commandsPaths) {
        try {
          const stats = fs.statSync(cmdPath);
          if (stats.isDirectory()) {
            const loaded = await loadCommandsFromDirectory(cmdPath, plugin.name, ...);
            commands.push(...loaded);
          } else if (stats.isFile() && cmdPath.endsWith(".md")) {
            const cmd = loadSingleCommandFile(cmdPath, plugin);
            if (cmd) commands.push(cmd);
          }
        } catch (error) {
          log(`Failed to load commands from ${cmdPath}: ${error}`, { level: "error" });
        }
      }
    }

    // 3. Load inline content commands from manifest
    if (plugin.commandsMetadata) {
      for (const [cmdName, metadata] of Object.entries(plugin.commandsMetadata)) {
        if (metadata.content && !metadata.source) {
          try {
            const cmd = createCommandFromInlineContent(cmdName, metadata, plugin);
            if (cmd) commands.push(cmd);
          } catch (error) {
            log(`Failed to load inline command ${cmdName}: ${error}`, { level: "error" });
          }
        }
      }
    }
  }

  log(`Total plugin commands loaded: ${commands.length}`);
  return commands;
});

// Mapping: PQA→getPluginCommands, l7→getPluginsWithState, v69→loadCommandsFromDirectory,
//          NV→parseFrontmatter, RjA→createCommandObject
```

### Command Object Structure

```javascript
// Command object structure:
{
  name: "plugin-name:command-name",          // Full qualified name
  userFacingName: "plugin-name:command-name",
  description: "Command description",
  filePath: "/path/to/command.md",
  baseDir: "/path/to",
  frontmatter: {
    description: "...",
    model: "claude-sonnet-4-...",
    "allowed-tools": "Read,Write,Edit"
  },
  content: "Command prompt content...",
  source: "plugin-name@marketplace",          // Plugin ID
  manifest: { ... },                          // Plugin manifest
  pluginPath: "/path/to/plugin",
  isSkill: false,
  hidden: false,
  type: "prompt"
}
```

---

## Skill Loading

### Get Plugin Skills

```javascript
// ============================================
// getPluginSkills - Load skills from all enabled plugins
// Location: chunks.142.mjs:3586-3620
// ============================================

// ORIGINAL (for source lookup):
iW0 = s1(async () => {
  g(">>>>> getPluginSkills CALLED <<<<<");
  let { enabled: A, errors: Q } = await l7(),
      B = [];

  if (Q.length > 0) g(`Plugin loading errors: ${Q.map((G)=>oM(G)).join(", ")}`);
  g(`getPluginSkills: Processing ${A.length} enabled plugins`);

  for (let G of A) {
    if (g(`Checking plugin ${G.name}: skillsPath=${G.skillsPath?"exists":"none"}`), G.skillsPath) {
      g(`Attempting to load skills from plugin ${G.name} skillsPath: ${G.skillsPath}`);
      try {
        let Z = await b69(G.skillsPath, G.name, G.source, G.manifest, G.path);
        B.push(...Z);
        g(`Loaded ${Z.length} skills from plugin ${G.name}`);
      } catch (Z) {
        g(`Failed to load skills from plugin ${G.name}: ${Z}`, { level: "error" });
      }
    }

    if (G.skillsPaths) {
      g(`Loading from plugin ${G.name} skillsPaths: ${G.skillsPaths.join(", ")}`);
      for (let Z of G.skillsPaths) try {
        let I = await b69(Z, G.name, G.source, G.manifest, G.path);
        B.push(...I);
        g(`Loaded ${I.length} skills from plugin ${G.name} path: ${Z}`);
      } catch (I) {
        g(`Failed to load skills from ${Z}: ${I}`, { level: "error" });
      }
    }
  }

  g(`Total plugin skills loaded: ${B.length}`);
  return B;
})

// READABLE (for understanding):
getPluginSkills = memoize(async () => {
  log(">>>>> getPluginSkills CALLED <<<<<");
  const { enabled, errors } = await getPluginsWithState();
  const skills = [];

  if (errors.length > 0) {
    log(`Plugin loading errors: ${errors.map(formatError).join(", ")}`);
  }
  log(`getPluginSkills: Processing ${enabled.length} enabled plugins`);

  for (const plugin of enabled) {
    // 1. Load from default skillsPath
    if (plugin.skillsPath) {
      log(`Loading skills from plugin ${plugin.name} skillsPath: ${plugin.skillsPath}`);
      try {
        const loaded = await loadSkillsFromDirectory(
          plugin.skillsPath,
          plugin.name,
          plugin.source,
          plugin.manifest,
          plugin.path
        );
        skills.push(...loaded);
        log(`Loaded ${loaded.length} skills from plugin ${plugin.name}`);
      } catch (error) {
        log(`Failed to load skills from plugin ${plugin.name}: ${error}`, { level: "error" });
      }
    }

    // 2. Load from extra skillsPaths
    if (plugin.skillsPaths) {
      log(`Loading from plugin ${plugin.name} skillsPaths: ${plugin.skillsPaths.join(", ")}`);
      for (const skillPath of plugin.skillsPaths) {
        try {
          const loaded = await loadSkillsFromDirectory(skillPath, plugin.name, ...);
          skills.push(...loaded);
          log(`Loaded ${loaded.length} skills from ${skillPath}`);
        } catch (error) {
          log(`Failed to load skills from ${skillPath}: ${error}`, { level: "error" });
        }
      }
    }
  }

  log(`Total plugin skills loaded: ${skills.length}`);
  return skills;
});

// Mapping: iW0→getPluginSkills, b69→loadSkillsFromDirectory
```

### Load Skills from Directory

```javascript
// ============================================
// loadSkillsFromDirectory - Load SKILL.md files from directory
// Location: chunks.142.mjs:3382-3451
// ============================================

// ORIGINAL (for source lookup):
async function b69(A, Q, B, G, Z) {
  let I = RA(), Y = [];
  try {
    if (!I.existsSync(A)) return [];

    // Check if directory itself is a skill (contains SKILL.md)
    let J = sXA(A, "SKILL.md");
    if (I.existsSync(J)) {
      try {
        let X = I.readFileSync(J, { encoding: "utf-8" }),
            { frontmatter: V, content: F } = NV(X),
            K = `${Q}:${rXA(A)}`,  // plugin-name:skill-dir-name
            D = { filePath: J, baseDir: Ka(J), frontmatter: V, content: F },
            H = RjA(K, D, B, G, Z, !0, { isSkillMode: !0 });
        if (H) Y.push(H);
      } catch (X) {
        g(`Failed to load skill from ${J}: ${X}`, { level: "error" });
      }
      return Y;
    }

    // Otherwise, look for subdirectories with SKILL.md
    let W = I.readdirSync(A);
    for (let X of W) {
      if (!X.isDirectory() && !X.isSymbolicLink()) continue;
      let V = sXA(A, X.name),
          F = sXA(V, "SKILL.md");
      if (I.existsSync(F)) try {
        let K = I.readFileSync(F, { encoding: "utf-8" }),
            { frontmatter: D, content: H } = NV(K),
            C = `${Q}:${X.name}`,  // plugin-name:subdir-name
            E = { filePath: F, baseDir: Ka(F), frontmatter: D, content: H },
            U = RjA(C, E, B, G, Z, !0, { isSkillMode: !0 });
        if (U) Y.push(U);
      } catch (K) {
        g(`Failed to load skill from ${F}: ${K}`, { level: "error" });
      }
    }
  } catch (J) {
    g(`Failed to load skills from directory ${A}: ${J}`, { level: "error" });
  }
  return Y;
}

// READABLE (for understanding):
async function loadSkillsFromDirectory(dirPath, pluginName, source, manifest, pluginPath) {
  const fs = getFs();
  const skills = [];

  try {
    if (!fs.existsSync(dirPath)) return [];

    // Check if this directory IS a skill (contains SKILL.md directly)
    const directSkillPath = path.join(dirPath, "SKILL.md");
    if (fs.existsSync(directSkillPath)) {
      try {
        const content = fs.readFileSync(directSkillPath, { encoding: "utf-8" });
        const { frontmatter, content: markdown } = parseFrontmatter(content);
        const skillName = `${pluginName}:${path.basename(dirPath)}`;
        const skill = createSkillObject(skillName, {
          filePath: directSkillPath,
          baseDir: path.dirname(directSkillPath),
          frontmatter,
          content: markdown
        }, source, manifest, pluginPath);
        if (skill) skills.push(skill);
      } catch (error) {
        log(`Failed to load skill from ${directSkillPath}: ${error}`, { level: "error" });
      }
      return skills;  // Don't look for subdirectories
    }

    // Look for subdirectories containing SKILL.md
    const entries = fs.readdirSync(dirPath);
    for (const entry of entries) {
      if (!entry.isDirectory() && !entry.isSymbolicLink()) continue;

      const subDir = path.join(dirPath, entry.name);
      const skillFile = path.join(subDir, "SKILL.md");

      if (fs.existsSync(skillFile)) {
        try {
          const content = fs.readFileSync(skillFile, { encoding: "utf-8" });
          const { frontmatter, content: markdown } = parseFrontmatter(content);
          const skillName = `${pluginName}:${entry.name}`;
          const skill = createSkillObject(skillName, {
            filePath: skillFile,
            baseDir: path.dirname(skillFile),
            frontmatter,
            content: markdown
          }, source, manifest, pluginPath);
          if (skill) skills.push(skill);
        } catch (error) {
          log(`Failed to load skill from ${skillFile}: ${error}`, { level: "error" });
        }
      }
    }
  } catch (error) {
    log(`Failed to load skills from directory ${dirPath}: ${error}`, { level: "error" });
  }

  return skills;
}

// Mapping: b69→loadSkillsFromDirectory, NV→parseFrontmatter, RjA→createSkillObject
```

---

## Agent Loading

```javascript
// ============================================
// getPluginAgents - Load agents from enabled plugins
// Location: chunks.142.mjs:3642 (referenced)
// ============================================

// READABLE (for understanding):
async function getPluginAgents() {
  const { enabled, errors } = await getPluginsWithState();
  const agents = [];

  for (const plugin of enabled) {
    if (plugin.agentsPath) {
      try {
        const loaded = await loadAgentsFromDirectory(plugin.agentsPath, plugin.name);
        agents.push(...loaded);
      } catch (error) {
        errors.push({
          type: "generic-error",
          source: "plugin-agents",
          error: `Failed to load agents from ${plugin.name}: ${error.message}`
        });
      }
    }
  }

  return agents;
}

// Agent object structure (similar to custom agents):
// {
//   name: "plugin-name:agent-name",
//   description: "Agent description",
//   content: "Agent instructions...",
//   filePath: "/path/to/agent.md"
// }

// Mapping: _0A→getPluginAgents
```

---

## Hook Integration

```javascript
// ============================================
// loadPluginHooks - Load and merge hooks from plugins
// Location: chunks.142.mjs:3652 (referenced)
// ============================================

// READABLE (for understanding):
async function loadPluginHooks() {
  const { enabled } = await getPluginsWithState();
  const allHooks = [];

  for (const plugin of enabled) {
    // Check for hooks in manifest
    if (plugin.manifest?.hooks) {
      if (typeof plugin.manifest.hooks === "string") {
        // Path to hooks file
        const hooksPath = path.join(plugin.path, plugin.manifest.hooks);
        const hooks = loadHooksFile(hooksPath, plugin.name);
        allHooks.push(...hooks);
      } else {
        // Inline hooks definition
        allHooks.push(...normalizeHooks(plugin.manifest.hooks, plugin.name));
      }
    }

    // Check for standard hooks/hooks.json
    const standardPath = path.join(plugin.path, "hooks", "hooks.json");
    if (fs.existsSync(standardPath)) {
      const hooks = loadHooksFile(standardPath, plugin.name);
      allHooks.push(...hooks);
    }
  }

  return allHooks;
}

// Hooks are merged with user hooks and executed in order:
// 1. Enterprise/managed hooks
// 2. User hooks
// 3. Project hooks
// 4. Plugin hooks

// Mapping: _1A→loadPluginHooks
```

---

## Output Style Loading

```javascript
// ============================================
// loadPluginOutputStyles - Load output styles from plugins
// Location: chunks.151.mjs (referenced)
// ============================================

// READABLE (for understanding):
async function loadPluginOutputStyles() {
  const { enabled } = await getPluginsWithState();
  const styles = [];

  for (const plugin of enabled) {
    // Check for outputStyles in manifest
    if (plugin.manifest?.outputStyles) {
      const paths = Array.isArray(plugin.manifest.outputStyles)
        ? plugin.manifest.outputStyles
        : [plugin.manifest.outputStyles];

      for (const stylePath of paths) {
        const fullPath = path.join(plugin.path, stylePath);
        const loaded = await loadOutputStylesFromPath(fullPath, plugin.name);
        styles.push(...loaded);
      }
    }

    // Check for standard output-styles directory
    const standardPath = path.join(plugin.path, "output-styles");
    if (fs.existsSync(standardPath)) {
      const loaded = await loadOutputStylesFromPath(standardPath, plugin.name);
      styles.push(...loaded);
    }
  }

  return styles;
}

// Mapping: AK0→loadPluginOutputStyles
```

---

## Cache Management

### Clear Plugin Caches

```javascript
// ============================================
// clearPluginCaches - Clear all memoized plugin loaders
// Location: chunks.151.mjs:2998
// ============================================

// ORIGINAL (for source lookup):
function AF() {
  l7.cache?.clear?.();      // getPluginsWithState
  PQA.cache?.clear?.();     // getPluginCommands
  iW0.cache?.clear?.();     // getPluginSkills
  g("Plugin caches cleared");
}

// READABLE (for understanding):
function clearPluginCaches() {
  getPluginsWithState.cache?.clear?.();
  getPluginCommands.cache?.clear?.();
  getPluginSkills.cache?.clear?.();
  log("Plugin caches cleared");
}

// When to clear:
// - After enabling/disabling a plugin
// - After installing/uninstalling a plugin
// - After updating a plugin

// Mapping: AF→clearPluginCaches
```

### Clear Commands Cache

```javascript
// ============================================
// clearCommandsCache - Clear only commands cache
// Location: chunks.142.mjs:3378
// ============================================

// ORIGINAL (for source lookup):
function zI1() {
  PQA.cache?.clear?.();
}

// READABLE (for understanding):
function clearCommandsCache() {
  getPluginCommands.cache?.clear?.();
}

// Mapping: zI1→clearCommandsCache
```

### Clear Skills Cache

```javascript
// ============================================
// clearSkillsCache - Clear only skills cache
// Location: chunks.142.mjs:3453
// ============================================

// ORIGINAL (for source lookup):
function f69() {
  iW0.cache?.clear?.();
}

// READABLE (for understanding):
function clearSkillsCache() {
  getPluginSkills.cache?.clear?.();
}

// Mapping: f69→clearSkillsCache
```

---

## usePluginLoader Hook

```javascript
// ============================================
// usePluginLoader - React hook for plugin loading
// Location: chunks.142.mjs:3623-3696
// ============================================

// ORIGINAL (for source lookup):
function $I1() {
  let [, A] = OQ(),  // useContext for app state updater
      Q = UI1.useCallback(async () => {
        try {
          let { enabled: B, disabled: G, errors: Z } = await l7(),
              I = [], Y = [];

          try { I = await PQA(); }
          catch (J) {
            Z.push({ type: "generic-error", source: "plugin-commands", error: J.message });
          }

          try { Y = await _0A(); }
          catch (J) {
            Z.push({ type: "generic-error", source: "plugin-agents", error: J.message });
          }

          try { await _1A(); }
          catch (J) {
            Z.push({ type: "generic-error", source: "plugin-hooks", error: J.message });
          }

          A((J) => ({
            ...J,
            plugins: {
              ...J.plugins,
              enabled: B,
              disabled: G,
              commands: I,
              agents: Y,
              errors: Z
            }
          }));

          g(`Loaded plugins - Enabled: ${B.length}, Disabled: ${G.length}, Commands: ${I.length}, Agents: ${Y.length}`);
        } catch (B) {
          A((Z) => ({
            ...Z,
            plugins: {
              ...Z.plugins,
              enabled: [],
              disabled: [],
              commands: [],
              agents: [],
              errors: [{ type: "generic-error", source: "plugin-system", error: B.message }]
            }
          }));
        }
      }, [A]);

  UI1.useEffect(() => { Q(); }, [Q]);

  return { refreshPlugins: Q };
}

// READABLE (for understanding):
function usePluginLoader() {
  const [, setAppState] = useContext(AppStateContext);

  const refreshPlugins = useCallback(async () => {
    try {
      // Load all plugin data
      const { enabled, disabled, errors } = await getPluginsWithState();
      let commands = [];
      let agents = [];

      // Load commands
      try {
        commands = await getPluginCommands();
      } catch (error) {
        errors.push({ type: "generic-error", source: "plugin-commands", error: error.message });
      }

      // Load agents
      try {
        agents = await getPluginAgents();
      } catch (error) {
        errors.push({ type: "generic-error", source: "plugin-agents", error: error.message });
      }

      // Load hooks
      try {
        await loadPluginHooks();
      } catch (error) {
        errors.push({ type: "generic-error", source: "plugin-hooks", error: error.message });
      }

      // Update app state
      setAppState(prev => ({
        ...prev,
        plugins: {
          ...prev.plugins,
          enabled,
          disabled,
          commands,
          agents,
          errors
        }
      }));

      log(`Loaded plugins - Enabled: ${enabled.length}, Commands: ${commands.length}`);
    } catch (error) {
      // Reset plugin state on catastrophic error
      setAppState(prev => ({
        ...prev,
        plugins: {
          ...prev.plugins,
          enabled: [],
          disabled: [],
          commands: [],
          agents: [],
          errors: [{ type: "generic-error", source: "plugin-system", error: error.message }]
        }
      }));
    }
  }, [setAppState]);

  // Load plugins on mount
  useEffect(() => {
    refreshPlugins();
  }, [refreshPlugins]);

  return { refreshPlugins };
}

// Mapping: $I1→usePluginLoader, l7→getPluginsWithState, PQA→getPluginCommands,
//          _0A→getPluginAgents, _1A→loadPluginHooks
```

---

## Key Symbols Summary

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `l7` | getPluginsWithState | chunks.95.mjs:1751 | Get all plugins (memoized) |
| `PQA` | getPluginCommands | chunks.142.mjs:3474 | Load commands (memoized) |
| `iW0` | getPluginSkills | chunks.142.mjs:3586 | Load skills (memoized) |
| `_0A` | getPluginAgents | chunks.142.mjs:3642 | Load agents |
| `_1A` | loadPluginHooks | chunks.142.mjs:3652 | Load hooks |
| `$I1` | usePluginLoader | chunks.142.mjs:3623 | React hook |
| `AF` | clearPluginCaches | chunks.151.mjs:2998 | Clear all caches |
| `zI1` | clearCommandsCache | chunks.142.mjs:3378 | Clear commands cache |
| `f69` | clearSkillsCache | chunks.142.mjs:3453 | Clear skills cache |
| `b69` | loadSkillsFromDirectory | chunks.142.mjs:3382 | Load SKILL.md files |
| `v69` | loadCommandsFromDirectory | chunks.142.mjs | Load command files |
| `_IA` | clearPluginsWithStateCache | chunks.95.mjs:1731 | Clear l7 cache |

---

## Related Files

- [overview.md](./overview.md) - Plugin system architecture
- [installation.md](./installation.md) - Plugin installation
- [state_management.md](./state_management.md) - Enable/disable state
- [slash_command.md](./slash_command.md) - `/plugin` command
