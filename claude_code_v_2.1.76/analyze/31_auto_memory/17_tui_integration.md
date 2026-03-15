# TUI Integration - Memory Editor Modal

## Overview

This document details how the Terminal User Interface (TUI) integrates with the auto memory system through the memory editor modal, settings toggle, and file management interface. The TUI provides a user-friendly way to enable/disable auto memory, navigate memory files, and open them in external editors.

**Key insight**: The memory editor modal is a multi-pane interface that adapts based on context — showing different options for user memory, project memory, and auto memory.

**Version**: Claude Code v2.1.76

---

## Component Architecture

### Memory Editor Modal Component

```javascript
// ============================================
// memoryEditorModal - Main memory editor modal component
// Location: chunks.155.mjs:714
// ============================================

// ORIGINAL (for source lookup):
function toY() {
  // React component rendering logic
}

// READABLE (for understanding):
function memoryEditorModal() {
  // State management
  const [autoMemoryEnabled, setAutoMemoryEnabled] = useState(
    userSettings.autoMemoryEnabled
  );
  const [selectedOption, setSelectedOption] = useState(null);

  // Render modal with three sections:
  // 1. Auto-memory toggle switch
  // 2. File/folder selector dropdown
  // 3. Action buttons (Open, Cancel)

  return (
    <Modal title="Memory Editor">
      {/* Auto-memory toggle section */}
      <ToggleSection
        label="Auto-memory (research preview)"
        enabled={autoMemoryEnabled}
        onToggle={handleAutoMemoryToggle}
      />

      {/* File selector section */}
      <DropdownSection
        options={getMemoryOptions()}
        selected={selectedOption}
        onChange={setSelectedOption}
      />

      {/* Action buttons section */}
      <ButtonSection
        onOpen={handleOpenSelection}
        onCancel={handleCancel}
      />
    </Modal>
  );
}

// Mapping: toY→memoryEditorModal
```

### Component Hierarchy

```
memoryEditorModal (toY)
  ├─ AutoMemoryToggle
  │   ├─ Label: "Auto-memory (research preview)"
  │   ├─ Toggle Switch: [x] on / [ ] off
  │   └─ OnChange: handleAutoMemoryToggle
  │
  ├─ FileSelector
  │   ├─ Dropdown Menu
  │   ├─ Options:
  │   │   ├─ User memory (~/.claude/CLAUDE.md)
  │   │   ├─ Project memory (./CLAUDE.md or ./.claude/CLAUDE.md)
  │   │   ├─ auto memory entrypoint (MEMORY.md)
  │   │   ├─ Open auto-memory folder
  │   │   └─ Open {agent} agent memory (if multi-agent)
  │   └─ OnChange: setSelectedOption
  │
  └─ ActionButtons
      ├─ Open Button → handleOpenSelection()
      └─ Cancel Button → closeModal()
```

---

## Auto-Memory Toggle Logic

### Toggle UI Location

**Location**: chunks.155.mjs:558-589

**Visual representation**:
```
+----------------------------------------------------+
| Memory Editor                                      |
+----------------------------------------------------+
|                                                    |
| Auto-memory (research preview): [x] on  [ ] off   |
|                                                    |
| Select file or folder:                             |
| +------------------------------------------------+ |
| | auto memory entrypoint                       v | |
| +------------------------------------------------+ |
|                                                    |
|                        [Open]     [Cancel]         |
+----------------------------------------------------+
```

### Toggle Code Analysis

```javascript
// ============================================
// Auto Memory Toggle Handler
// Location: chunks.155.mjs:561-568
// ============================================

// ORIGINAL (for source lookup):
const handleToggle = () => {
  const newValue = !autoMemoryEnabled;
  Z7("userSettings", { autoMemoryEnabled: newValue });
  recordTelemetry("tengu_auto_memory_toggled", { enabled: newValue });
  setAutoMemoryEnabled(newValue);
};

// READABLE (for understanding):
const handleAutoMemoryToggle = () => {
  // Calculate new state (toggle current value)
  const newEnabledState = !autoMemoryEnabled;

  // Persist to user settings file
  updateUserSettings("userSettings", {
    autoMemoryEnabled: newEnabledState
  });

  // Log telemetry event
  recordTelemetryEvent("tengu_auto_memory_toggled", {
    enabled: newEnabledState
  });

  // Update UI state (immediate visual feedback)
  setAutoMemoryEnabled(newEnabledState);
};

// Mapping: Z7→updateUserSettings
```

**How it works:**
1. **User clicks toggle** → `handleAutoMemoryToggle()` invoked
2. **New state calculated** → `!currentState`
3. **Settings persisted** → Written to `~/.claude/settings.json`
4. **Telemetry logged** → Event sent to analytics backend
5. **UI updated** → React state change triggers re-render
6. **Next turn** → `isAutoMemoryEnabled()` reads updated setting

**Why immediate UI update?**
- **User experience**: Instant visual feedback confirms action
- **State synchronization**: React state matches persisted settings
- **No stale state**: Next toggle operation sees correct current value

---

## File Selection Options

### Dropdown Menu Structure

```javascript
// ============================================
// getMemoryOptions - Builds dropdown option list
// Location: chunks.155.mjs:530-543
// ============================================

// READABLE (for understanding):
function getMemoryOptions() {
  const options = [];

  // User-level memory (global preferences)
  options.push({
    label: "User memory",
    path: "~/.claude/CLAUDE.md",
    type: "file"
  });

  // Project-level memory (project-specific)
  const projectMemoryPath = findProjectMemory(); // ./CLAUDE.md or ./.claude/CLAUDE.md
  if (projectMemoryPath) {
    options.push({
      label: "Project memory",
      path: projectMemoryPath,
      type: "file"
    });
  }

  // Auto memory entrypoint (if enabled)
  if (autoMemoryEnabled) {
    const memoryDir = getAutoMemoryDirectory();
    options.push({
      label: "auto memory entrypoint",
      path: path.join(memoryDir, "MEMORY.md"),
      type: "file"
    });

    options.push({
      label: "Open auto-memory folder",
      path: memoryDir,
      type: "directory"
    });

    // Agent memory directories (if multi-agent scenario)
    const agentDirs = getAgentMemoryDirectories();
    agentDirs.forEach(agentDir => {
      options.push({
        label: `Open ${agentDir.name} agent memory`,
        path: agentDir.path,
        type: "directory"
      });
    });
  }

  return options;
}
```

### Option Table

| Label | Path | Type | Action | Condition |
|-------|------|------|--------|-----------|
| **User memory** | `~/.claude/CLAUDE.md` | file | Open in $EDITOR | Always shown |
| **Project memory** | `./CLAUDE.md` or `./.claude/CLAUDE.md` | file | Open in $EDITOR | If project memory exists |
| **auto memory entrypoint** | `{memoryDir}/MEMORY.md` | file | Open in $EDITOR | If auto memory enabled |
| **Open auto-memory folder** | `{memoryDir}/` | directory | Open in file manager | If auto memory enabled |
| **Open {agent} agent memory** | `{agentMemoryDir}/` | directory | Open in file manager | If multi-agent mode |

### Action Behavior by Type

```javascript
// ============================================
// handleOpenSelection - Opens selected file or folder
// Location: chunks.155.mjs:590-606
// ============================================

// READABLE (for understanding):
function handleOpenSelection() {
  const option = selectedOption;

  if (option.type === "file") {
    // Open file in external editor
    const editor = process.env.VISUAL || process.env.EDITOR || "vi";
    spawn(editor, [option.path], { stdio: "inherit" });

  } else if (option.type === "directory") {
    // Open directory in file manager (platform-specific)
    const command = getPlatformFileManagerCommand();
    spawn(command, [option.path], { detached: true });
  }

  // Close modal after action
  closeModal();
}

// Platform-specific commands:
// macOS: "open {path}"
// Linux: "xdg-open {path}"
// Windows: "explorer {path}"
```

---

## External Editor Integration

### Environment Variable Priority

```javascript
// Editor selection priority chain:
const editor = process.env.VISUAL ||   // Priority 1: Visual editor
               process.env.EDITOR ||   // Priority 2: Default editor
               "vi";                   // Priority 3: Fallback to vi
```

**Why this priority?**
- **$VISUAL**: Intended for GUI editors (e.g., `code`, `subl`, `atom`)
- **$EDITOR**: Intended for terminal editors (e.g., `vim`, `nano`, `emacs`)
- **Fallback**: `vi` is universally available on Unix systems

### Editor Launch Behavior

```javascript
// ============================================
// Editor Launch Process
// ============================================

// Synchronous blocking launch (user cannot continue until editor closes)
spawn(editor, [filePath], {
  stdio: "inherit"  // Inherit stdin/stdout/stderr from TUI process
});

// TUI waits for editor to close
// User edits file, saves, and closes editor
// TUI resumes, modal closes
```

**Why synchronous?**
- **User intent**: User expects to edit file NOW
- **Modal context**: Modal blocks other TUI interactions anyway
- **File watching**: No need to watch file changes (editor closes = done)

---

## File Manager Integration

### Platform Detection

```javascript
// ============================================
// getPlatformFileManagerCommand - Returns platform-specific file manager command
// ============================================

// READABLE (for understanding):
function getPlatformFileManagerCommand() {
  switch (process.platform) {
    case "darwin":  // macOS
      return "open";

    case "linux":   // Linux
      return "xdg-open";

    case "win32":   // Windows
      return "explorer";

    default:
      throw new Error(`Unsupported platform: ${process.platform}`);
  }
}
```

**Why detached?**
- **Parallel workflows**: User can browse files AND use TUI simultaneously
- **Non-blocking**: TUI remains responsive
- **User expectation**: File manager is typically a separate application

---

## Settings Persistence

### Settings File Location

```
~/.claude/settings.json
```

### Settings Structure

```json
{
  "userSettings": {
    "autoMemoryEnabled": true,
    "autoMemoryDirectory": "/custom/path/",
    "theme": "dark",
    ...
  }
}
```

**New in v2.1.59**: The `autoMemoryDirectory` field allows specifying a custom memory directory that bypasses the project-hash path computation. When set, `getAutoMemoryDirectory()` returns this path directly.

### Update Function

```javascript
// ============================================
// updateUserSettings - Persists settings to disk
// Location: chunks.40.mjs:849
// ============================================

// ORIGINAL (for source lookup):
function Z7(key, updates) {
  const settings = loadSettings();
  settings[key] = { ...settings[key], ...updates };
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}

// READABLE (for understanding):
function updateUserSettings(settingsKey, updates) {
  // Load current settings from disk
  const currentSettings = loadSettingsFromFile();

  // Merge updates into existing settings
  currentSettings[settingsKey] = {
    ...currentSettings[settingsKey],
    ...updates
  };

  // Write updated settings back to disk
  fs.writeFileSync(
    settingsFilePath,
    JSON.stringify(currentSettings, null, 2), // Pretty-print with 2-space indent
    "utf8"
  );
}

// Mapping: Z7→updateUserSettings
```

**Why merge instead of replace?**
- **Preserves other settings**: Toggling auto memory doesn't clear theme, editor, etc.
- **Partial updates**: Only specified keys are modified
- **Safe concurrent access**: Other settings writers don't conflict

---

## Keyboard Shortcuts

| Key | Action | Context |
|-----|--------|---------|
| **Tab** | Next element | Any focused element |
| **Shift+Tab** | Previous element | Any focused element |
| **Space** | Toggle switch | Toggle focused |
| **Enter** | Open selection | Open button focused |
| **Esc** | Close modal | Any context |
| **↑/↓** | Navigate dropdown | Dropdown focused |
| **Enter** | Select option | Dropdown focused |

---

## Large File Warning Banner

### Warning Trigger

**Condition**: Any memory file exceeds 40000 characters

**Detection timing**: On modal open (not real-time)

### Warning Display

```
+----------------------------------------------------+
| Large memory files detected:                       |
|    - MEMORY.md (50000 characters, recommended:     |
|      < 40000)                                      |
|                                                    |
|    Large files may impact TUI rendering           |
|    performance. Consider splitting into smaller   |
|    topic files.                                    |
+----------------------------------------------------+
| Auto-memory (research preview): [x] on             |
| ...                                                |
+----------------------------------------------------+
```

**Location**: chunks.160.mjs:1988-2008

**Why on modal open?**
- **Performance**: Scanning files on every turn would slow down conversations
- **User action**: User opening `/memory` signals intent to manage files
- **Relevance**: Warning is actionable in this context (user can edit files)

---

## Verification Steps

### Test 1: Toggle Auto-Memory On → Off → On

1. Launch TUI, press `/memory`
2. Verify current state: `[x] on`
3. Click toggle → State changes to `[ ] off`
4. Close modal, exit TUI
5. Restart TUI, press `/memory`
6. **Expected**: State persisted as `[ ] off`

```bash
cat ~/.claude/settings.json | grep autoMemoryEnabled
# Output: "autoMemoryEnabled": false
```

### Test 2: Open MEMORY.md in External Editor

```bash
export VISUAL=code
```

1. Launch TUI, press `/memory`
2. Select "auto memory entrypoint" from dropdown
3. Click [Open]
4. **Expected**: VS Code opens with MEMORY.md

### Test 3: Open Auto-Memory Folder in Finder/Explorer

1. Launch TUI, press `/memory`
2. Select "Open auto-memory folder" from dropdown
3. Click [Open]
4. **Expected** (macOS): Finder opens to `~/.claude/projects/{hash}/memory/`
5. **Expected** (TUI): Modal closes immediately, TUI remains responsive

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `memoryEditorModal` (toY) - Main memory editor modal component
- `updateUserSettings` (Z7) - Persists settings to disk
- `getLargeMemoryFiles` (DK1) - Scans for oversized files (referenced for warnings)

---

## Key Takeaways

1. **Multi-scope support**: TUI shows user, project, and auto memory options
2. **External editor integration**: Uses $VISUAL/$EDITOR environment variables
3. **Platform-specific file manager**: Adapts to macOS, Linux, Windows
4. **Settings persistence**: Immediate save on toggle, survives TUI restarts
5. **Keyboard accessible**: Full navigation without mouse
6. **Large file warnings**: Proactive alerts for performance issues
7. **Custom directory support** (v2.1.59): `autoMemoryDirectory` setting visible in settings.json

**Design rationale**:
- User-friendly: Visual toggle, dropdown, and action buttons
- Flexible: Supports any external editor via environment variables
- Cross-platform: Adapts to different OS conventions
- Persistent: Settings survive restarts
- Synchronous editor blocking: User must close editor to continue (simplicity trade-off)

**Trade-offs**:
- **Blocking vs Async**: Synchronous editor launch simplifies implementation but blocks TUI
- **Manual file management**: No in-TUI text editor (delegates to external tools)
- **Scan on open**: Large file detection only when modal opens (performance vs real-time)
