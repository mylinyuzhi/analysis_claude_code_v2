# Symbol Index - Integration Infrastructure (Claude Code 2.1.38)

> Symbol mapping table Part 4: External integrations and UI components
> Lookup: Browse by module, or Ctrl+F search for obfuscated/readable name.

---

## Quick Navigation

- [LSP Integration](#module-lsp-integration) - **NEW in 2.1.20**
- [Browser Control](#module-browser-control) - **NEW in 2.1.25**
- [IDE Integration](#module-ide-integration)
- [UI Components](#module-ui-components)
- [Plugin System](#module-plugin-system)
- [Code Indexing](#module-code-indexing)
- [Shell Parser](#module-shell-parser)
- [Slash Commands](#module-slash-commands)

---

## Module: LSP Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| um4 | createLspClient | chunks.133.mjs:1614 | function |
| Fm4 | LspServerInstance | chunks.133.mjs:1785 | function |
| lm4 | LspServerManager | chunks.133.mjs:2172 | function |
| dm4 | loadLspConfigs | chunks.133.mjs:2144 | function |
| om4 | registerDiagnostics | chunks.133.mjs:2350 | function |
| sm4 | checkDiagnosticsRegistry | chunks.133.mjs:2412 | function |
| em4 | registerNotificationHandlers | chunks.133.mjs:2532 | function |
| qvY | CONTENT_MODIFIED_ERROR_CODE | chunks.133.mjs:1959 | constant (-32801) |

---

## Module: Browser Control (Chrome)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| VKz | ChromeOnboarding | chunks.166.mjs:1515 | function/component |
| HBA | getChromeMcpConfig | chunks.166.mjs:1351 | function |
| bHq | installNativeHostManifest | chunks.166.mjs:1407 | function |
| uHq | createNativeHostWrapper | chunks.166.mjs:1455 | function |
| SHq | detectChromeExtension | chunks.166.mjs:1287 | function |
| OKz | CHROME_EXTENSION_ID | chunks.166.mjs:1331 | constant |
| wBA | NATIVE_HOST_NAME | chunks.166.mjs:1492 | constant |

---

## Module: Shell Parser

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| AYz | bashPreFlightCheck | chunks.169.mjs:1838 | function |
| aI | extractRedirections | chunks.169.mjs:2021 | function |
| YYz | checkDangerousRedirection | chunks.169.mjs:2088 | function |
| pz | shellTokenize | chunks.169.mjs:1824 | function (external?) |

---

## Module: Code Indexing

> Full analysis: [14_code_indexing/](../14_code_indexing/)

### Indexing Logic

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| LiY | getFileIndex | chunks.152.mjs:1007 | function |
| xiY | rebuildIndex | chunks.152.mjs:1164 | function |
| SiY | getFilesUsingGit | chunks.152.mjs:1077 | function |
| uiY | searchFileIndex | chunks.152.mjs:1226 | function |
| OIA | refreshIndexCache | chunks.152.mjs:1275 | function |
| IiY | getProjectFiles | chunks.152.mjs:1148 | function |
| BAq | loadIgnorePatterns | chunks.152.mjs:1055 | function |
| sG1 | nativeFileIndex | chunks.152.mjs:1342 | variable |
| tG1 | jsFileListCache | chunks.152.mjs:1344 | variable |
| RiY | CACHE_TTL_MS | chunks.152.mjs:1350 | constant (60000) |

---

## Module: Plugin System

> Full analysis: [25_plugin_system/](../25_plugin_system/)

### Plugin Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $xY | loadPlugin | chunks.143.mjs:1167 | function |
| Pn4 | loadPluginManifest | chunks.143.mjs:889 | function |
| HxY | loadEnabledPlugins | chunks.143.mjs:1118 | function |
| Xn4 | loadPluginHooks | chunks.143.mjs:879 | function |
| Dn4 | mergeHooks | chunks.143.mjs:1107 | function |
| XG6 | readManifestFile | chunks.143.mjs:845 | function |
| ph4 | createNodePlugin | chunks.126.mjs:1902 | function |
| inlinePlugins | inlinePlugins | chunks.1.mjs:2398 | state key |
| useCoworkPlugins | useCoworkPlugins | chunks.1.mjs:2399 | state key |

---

## Module: UI Components (Ink)
