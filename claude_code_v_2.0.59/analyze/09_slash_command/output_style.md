# Output Style System

## Overview

The `/output-style` command allows users to customize how Claude Code communicates, balancing task efficiency with educational content or hands-on learning. The system supports three built-in styles and allows custom styles via markdown files.

> Symbol mappings: [symbol_index_core.md](../00_overview/symbol_index_core.md)

---

## Command Definition

```javascript
// ============================================
// outputStyleCommand - Set output style
// Location: chunks.152.mjs:1707-1740
// ============================================

// ORIGINAL (for source lookup):
tC9 = {
  type: "local-jsx",
  name: "output-style",
  userFacingName() { return "output-style" },
  description: "Set the output style directly or from a selection menu",
  isEnabled: () => !0,
  isHidden: !1,
  argumentHint: "[style]",
  async call(A, Q, B) {
    if (B = B?.trim() || "", OJ1.includes(B))
      return GA("tengu_output_style_command_inline_help", { args: B }),
        eg.createElement(Nv3, { onDone: A });
    if (MJ1.includes(B)) {
      A("Run /output-style to open the output style selection menu, or /output-style [styleName] to set the output style.", { display: "system" });
      return
    }
    if (B) return GA("tengu_output_style_command_inline", { args: B }),
      eg.createElement(qv3, { args: B, onDone: A });
    return eg.createElement($v3, { onDone: A })
  }
};

// READABLE (for understanding):
const outputStyleCommand = {
  type: "local-jsx",
  name: "output-style",
  description: "Set the output style directly or from a selection menu",
  argumentHint: "[style]",
  isEnabled: () => true,
  isHidden: false,
  async call(onComplete, context, args) {
    args = args?.trim() || "";

    // Info keywords - show current style
    if (INFO_KEYWORDS.includes(args)) {
      trackEvent("tengu_output_style_command_inline_help", { args });
      return <ShowCurrentStyleComponent onDone={onComplete} />;
    }

    // Help keywords - show usage help
    if (HELP_KEYWORDS.includes(args)) {
      onComplete("Run /output-style to open the selection menu, or /output-style [styleName] to set.", { display: "system" });
      return;
    }

    // Direct style setting
    if (args) {
      trackEvent("tengu_output_style_command_inline", { args });
      return <SetStyleDirectComponent args={args} onDone={onComplete} />;
    }

    // Show interactive menu
    return <OutputStyleMenuComponent onDone={onComplete} />;
  }
};

// Mapping: tC9→outputStyleCommand, OJ1→INFO_KEYWORDS, MJ1→HELP_KEYWORDS,
//          $v3→OutputStyleMenuComponent, qv3→SetStyleDirectComponent, Nv3→ShowCurrentStyleComponent
```

---

## `/output-style:new` Command

> **Note:** This command is documented in official Claude Code documentation but was not found in v2.0.59 source code. It may be implemented in a newer version or as a bundled skill.

### Purpose

Quickly create custom output styles by providing a natural language description. Claude generates the appropriate system prompts and saves the style file automatically.

### Usage

```
/output-style:new <description>
```

### Examples

```bash
# Create a UX research specialist style
/output-style:new I want an output style that acts as a UX research specialist

# Create a security-focused code reviewer
/output-style:new Create a style that focuses on security best practices and code review

# Create a minimalist style
/output-style:new I want concise responses with no explanations, just code
```

### Workflow

1. **User provides description** - Natural language description of desired style behavior
2. **Claude generates prompts** - AI generates appropriate system prompts based on description
3. **File creation** - Creates markdown file with proper frontmatter in `~/.claude/output-styles/`
4. **Auto-activation** - New style becomes immediately available for selection
5. **Persistence** - Style persists across sessions

### Generated File Format

When you run `/output-style:new`, Claude creates a file like:

```markdown
---
name: "UX Research Specialist"
description: "Acts as a UX research specialist, focusing on user experience"
---

# UX Research Specialist Style

You are an interactive CLI tool that helps users with software engineering tasks
while acting as a UX research specialist...

[Generated instructions based on your description]
```

### Compared to Manual Creation

| Aspect | `/output-style:new` | Manual Creation |
|--------|---------------------|-----------------|
| **Effort** | Just describe what you want | Write full markdown file |
| **AI-assisted** | Claude generates prompts | You write everything |
| **Customization** | Limited to description | Full control |
| **Location** | Auto-saved to `~/.claude/output-styles/` | Choose your own path |

### Tips

- Be specific about the behavior you want
- Mention particular focus areas (security, performance, UX, etc.)
- Describe the communication style (verbose, concise, educational)
- You can always edit the generated file for fine-tuning

---

## Command Routing

| Argument | Keywords | Component | Behavior |
|----------|----------|-----------|----------|
| No args | (empty) | `OutputStyleMenuComponent` ($v3) | Opens interactive selection menu |
| Info keywords | `list, show, display, current, view, get, check, describe, print, version, about, status, ?` | `ShowCurrentStyleComponent` (Nv3) | Shows current style |
| Help keywords | `help, -h, --help` | System message | Shows usage instructions |
| Style name | Any other string | `SetStyleDirectComponent` (qv3) | Sets style directly (case-insensitive) |

### Info Keywords Array (OJ1)

```javascript
const INFO_KEYWORDS = ["list", "show", "display", "current", "view", "get", "check", "describe", "print", "version", "about", "status", "?"];
```

### Help Keywords Array (MJ1)

```javascript
const HELP_KEYWORDS = ["help", "-h", "--help"];
```

---

## Built-in Styles

Located in `chunks.153.mjs:1967-2058` as the `TQA` (BUILTIN_OUTPUT_STYLES) constant.

### 1. Default

| Property | Value |
|----------|-------|
| **Name** | `"default"` (constant `wK`) |
| **Description** | "Claude completes coding tasks efficiently and provides concise responses" |
| **Prompt** | `null` (no additional prompt) |
| **keepCodingInstructions** | N/A |

**Behavior:** Standard Claude Code mode with no style-specific modifications.

---

### 2. Explanatory

| Property | Value |
|----------|-------|
| **Name** | `"Explanatory"` |
| **Description** | "Claude explains its implementation choices and codebase patterns" |
| **keepCodingInstructions** | `true` |
| **Source** | `"built-in"` |

**Full Prompt:**
```
You are an interactive CLI tool that helps users with software engineering tasks. In addition to software engineering tasks, you should provide educational insights about the codebase along the way.

You should be clear and educational, providing helpful explanations while remaining focused on the task. Balance educational content with task completion. When providing insights, you may exceed typical length constraints, but remain focused and relevant.

# Explanatory Style Active
## Insights
In order to encourage learning, before and after writing code, always provide brief educational explanations about implementation choices using (with backticks):
"`★ Insight ─────────────────────────────────────`
[2-3 key educational points]
`─────────────────────────────────────────────────`"

These insights should be included in the conversation, not in the codebase. You should generally focus on interesting insights that are specific to the codebase or the code you just wrote, rather than general programming concepts.
```

**Key Behavior:**
- Provides `★ Insight` blocks before and after code changes
- Focuses on codebase-specific insights, not general programming concepts
- May exceed typical length constraints for educational content
- Preserves full coding tool instructions (`keepCodingInstructions: true`)

---

### 3. Learning

| Property | Value |
|----------|-------|
| **Name** | `"Learning"` |
| **Description** | "Claude pauses and asks you to write small pieces of code for hands-on practice" |
| **keepCodingInstructions** | `true` |
| **Source** | `"built-in"` |

**Full Prompt:**
```
You are an interactive CLI tool that helps users with software engineering tasks. In addition to software engineering tasks, you should help users learn more about the codebase through hands-on practice and educational insights.

You should be collaborative and encouraging. Balance task completion with learning by requesting user input for meaningful design decisions while handling routine implementation yourself.

# Learning Style Active
## Requesting Human Contributions
In order to encourage learning, ask the human to contribute 2-10 line code pieces when generating 20+ lines involving:
- Design decisions (error handling, data structures)
- Business logic with multiple valid approaches
- Key algorithms or interface definitions

**TodoList Integration**: If using a TodoList for the overall task, include a specific todo item like "Request human input on [specific decision]" when planning to request human input. This ensures proper task tracking. Note: TodoList is not required for all tasks.

Example TodoList flow:
   ✓ "Set up component structure with placeholder for logic"
   ✓ "Request human collaboration on decision logic implementation"
   ✓ "Integrate contribution and complete feature"

### Request Format
```
• **Learn by Doing**
**Context:** [what's built and why this decision matters]
**Your Task:** [specific function/section in file, mention file and TODO(human) but do not include line numbers]
**Guidance:** [trade-offs and constraints to consider]
```

### Key Guidelines
- Frame contributions as valuable design decisions, not busy work
- You must first add a TODO(human) section into the codebase with your editing tools before making the Learn by Doing request
- Make sure there is one and only one TODO(human) section in the code
- Don't take any action or output anything after the Learn by Doing request. Wait for human implementation before proceeding.

### Example Requests

**Whole Function Example:**
```
• **Learn by Doing**

**Context:** I've set up the hint feature UI with a button that triggers the hint system. The infrastructure is ready...

**Your Task:** In sudoku.js, implement the selectHintCell(board) function. Look for TODO(human).

**Guidance:** Consider multiple strategies: prioritize cells with only one possible value...
```

**Partial Function Example:**
```
• **Learn by Doing**

**Context:** I've built a file upload component that validates files before accepting them...

**Your Task:** In upload.js, inside the validateFile() function's switch statement, implement the 'case "document":' branch.

**Guidance:** Consider checking file size limits, validating the file extension matches the MIME type...
```

**Debugging Example:**
```
• **Learn by Doing**

**Context:** The user reported that number inputs aren't working correctly in the calculator...

**Your Task:** In calculator.js, inside the handleInput() function, add 2-3 console.log statements after the TODO(human) comment.

**Guidance:** Consider logging: the raw input value, the parsed result, and any validation state.
```

### After Contributions
Share one insight connecting their code to broader patterns or system effects. Avoid praise or repetition.

## Insights
[Same insight format as Explanatory style]
```

**Key Behavior:**
- Uses `TODO(human)` markers in code for user to implement
- Provides "Learn by Doing" request blocks
- Integrates with TodoList for tracking learning tasks
- Waits for human implementation before proceeding
- Focuses on meaningful design decisions (2-10 line contributions)
- Shares insights after user contributions

---

## Custom Style Creation

### Loading Sources (Priority Order)

Styles are loaded and merged via `loadAllOutputStyles()` (cQA) in `chunks.153.mjs:1923-1941`:

1. **Built-in styles** (TQA) - Default, Explanatory, Learning
2. **Plugin styles** - from installed plugins
3. **User settings** - `~/.claude/output-styles/`
4. **Project settings** - `.claude/output-styles/`
5. **Policy settings** - Enterprise policies (highest priority override)

Later sources **override** earlier ones with the same name.

```javascript
// ============================================
// loadAllOutputStyles - Merge all style sources
// Location: chunks.153.mjs:1923-1941
// ============================================

// ORIGINAL (for source lookup):
async function cQA() {
  let A = await fE9(),      // custom styles from md files
    Q = await AK0(),        // plugin styles
    B = { ...TQA },         // start with built-in styles
    G = A.filter((J) => J.source === "policySettings"),
    Z = A.filter((J) => J.source === "userSettings"),
    I = A.filter((J) => J.source === "projectSettings"),
    Y = [Q, Z, I, G];       // merge order: plugin, user, project, policy
  for (let J of Y)
    for (let W of J) B[W.name] = { /* style config */ };
  return B
}

// READABLE (for understanding):
async function loadAllOutputStyles() {
  const customStyles = await loadCustomOutputStyles();
  const pluginStyles = await loadPluginOutputStyles();
  const styles = { ...BUILTIN_OUTPUT_STYLES };

  // Merge in priority order (later overrides earlier)
  const policyStyles = customStyles.filter(s => s.source === "policySettings");
  const userStyles = customStyles.filter(s => s.source === "userSettings");
  const projectStyles = customStyles.filter(s => s.source === "projectSettings");

  for (const source of [pluginStyles, userStyles, projectStyles, policyStyles]) {
    for (const style of source) {
      styles[style.name] = style;
    }
  }
  return styles;
}

// Mapping: cQA→loadAllOutputStyles, fE9→loadCustomOutputStyles, TQA→BUILTIN_OUTPUT_STYLES
```

### File Format

Create markdown files with YAML frontmatter in `output-styles/` directories:

```markdown
---
name: "My Custom Style"
description: "A custom style for specific use cases"
keep-coding-instructions: true
---

Your custom style prompt here...

This text becomes the `prompt` property and is injected into the system prompt
when this style is active.

You can include:
- Specific instructions for how Claude should behave
- Custom formatting requirements
- Domain-specific guidelines
- Any prompt text that modifies Claude's behavior
```

### Frontmatter Properties

| Property | Required | Type | Description |
|----------|----------|------|-------------|
| `name` | No | string | Display name (defaults to filename without .md) |
| `description` | No | string | Description shown in selection menu |
| `keep-coding-instructions` | No | `"true"`/`"false"` | Whether to preserve default coding tool instructions |

### Loading Implementation

```javascript
// ============================================
// loadCustomOutputStyles - Load styles from md files
// Location: chunks.153.mjs:1892-1920
// ============================================

// ORIGINAL (for source lookup):
fE9 = s1(async () => {
  try {
    return (await _n("output-styles")).map(({
      filePath: B,
      frontmatter: G,
      content: Z,
      source: I
    }) => {
      let J = $b3(B).replace(/\.md$/, ""),  // filename without .md
        W = G.name || J,
        X = G.description || `Custom ${J} output style`,
        V = G["keep-coding-instructions"],
        F = V === "true" ? !0 : V === "false" ? !1 : void 0;
      return { name: W, description: X, prompt: Z.trim(), source: I, keepCodingInstructions: F }
    })
  } catch (A) {
    return []
  }
});

// READABLE (for understanding):
const loadCustomOutputStyles = memoize(async () => {
  try {
    return (await loadMdFiles("output-styles")).map(({
      filePath,
      frontmatter,
      content,
      source
    }) => {
      const filenameBase = basename(filePath).replace(/\.md$/, "");
      const name = frontmatter.name || filenameBase;
      const description = frontmatter.description || `Custom ${filenameBase} output style`;
      const keepCodingInstructions = frontmatter["keep-coding-instructions"] === "true" ? true :
                                     frontmatter["keep-coding-instructions"] === "false" ? false : undefined;
      return { name, description, prompt: content.trim(), source, keepCodingInstructions };
    });
  } catch (error) {
    return [];
  }
});

// Mapping: fE9→loadCustomOutputStyles, _n→loadMdFiles, $b3→basename
```

### Directory Locations

| Location | Source | Priority |
|----------|--------|----------|
| `~/.claude/output-styles/` | userSettings | Medium |
| `.claude/output-styles/` (project) | projectSettings | High |
| Plugin `output-styles/` directory | plugin | Low |
| Enterprise policy | policySettings | Highest |

### Plugin Integration

Plugins can provide custom styles via `manifest.json`:

```json
{
  "name": "my-plugin",
  "outputStyles": "output-styles"
}
```

Or multiple paths:

```json
{
  "outputStyles": ["styles/basic.md", "styles/advanced/"]
}
```

**Schema** (from `chunks.94.mjs:2502`):
- Accepts single path or array of paths
- Paths are relative to plugin root
- Can point to directory or individual .md file

---

## System Integration

### Style Storage

| Setting | Location | Access |
|---------|----------|--------|
| Current style | `localSettings.outputStyle` | `Sg().outputStyle` or `l0()?.outputStyle` |
| Default value | `"default"` (constant `wK`) | - |

### Setting the Style

```javascript
// Set via settings update
cB("localSettings", { outputStyle: "Explanatory" });

// Tracks telemetry
GA("tengu_output_style_changed", {
  style: "Explanatory",
  source: "config_panel",
  settings_source: "localSettings"
});
```

### System Reminder Integration

When a non-default style is active, a system reminder is injected:

```javascript
// ============================================
// generateOutputStyleReminder - Generate style reminder
// Location: chunks.107.mjs:1919-1926
// ============================================

// ORIGINAL (for source lookup):
function KH5() {
  let Q = l0()?.outputStyle || "default";
  if (Q === "default") return [];
  return [{
    type: "output_style",
    style: Q
  }]
}

// READABLE (for understanding):
function generateOutputStyleReminder() {
  const currentStyle = getLocalSettings()?.outputStyle || "default";
  if (currentStyle === "default") return [];
  return [{
    type: "output_style",
    style: currentStyle
  }];
}

// Mapping: KH5→generateOutputStyleReminder, l0→getLocalSettings
```

### Reminder Handler

```javascript
// Location: chunks.154.mjs:126
case "output_style": {
  let styleConfig = BUILTIN_OUTPUT_STYLES[attachment.style];
  if (!styleConfig) return [];
  return wrapInMessageArray([createSystemMessage({
    content: `${styleConfig.name} output style is active. Remember to follow the specific guidelines for this style.`,
    isMeta: true
  })]);
}
```

---

## UI Components

### OutputStyleSelector (uY1)

Main selection UI component used by both `/output-style` command and `/config` panel.

```javascript
// ============================================
// OutputStyleSelector - Style selection UI
// Location: chunks.147.mjs:3116-3157
// ============================================

// ORIGINAL (for source lookup):
function uY1({ initialStyle: A, onComplete: Q, onCancel: B, isStandaloneCommand: G }) {
  let [Z, I] = dQA.useState([]), [Y, J] = dQA.useState(!0);
  dQA.useEffect(() => {
    cQA().then((X) => {
      let V = dV9(X);  // convert to options
      I(V), J(!1)
    }).catch(() => {
      let X = dV9(TQA);
      I(X), J(!1)
    })
  }, []);
  return IN.createElement(hD, {
    title: "Preferred output style",
    // ... renders SelectInput with options
  })
}

// READABLE (for understanding):
function OutputStyleSelector({ initialStyle, onComplete, onCancel, isStandaloneCommand }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllOutputStyles()
      .then(styles => {
        setOptions(convertToOptions(styles));
        setLoading(false);
      })
      .catch(() => {
        setOptions(convertToOptions(BUILTIN_OUTPUT_STYLES));
        setLoading(false);
      });
  }, []);

  return (
    <Panel title="Preferred output style">
      <Text dimColor>This changes how Claude Code communicates with you</Text>
      {loading ? (
        <Text dimColor>Loading output styles...</Text>
      ) : (
        <SelectInput options={options} onChange={onComplete} defaultValue={initialStyle} />
      )}
    </Panel>
  );
}

// Mapping: uY1→OutputStyleSelector, cQA→loadAllOutputStyles, dV9→convertToOptions
```

**UI Display:**
```
Preferred output style

This changes how Claude Code communicates with you

❯ 1. Default ✔    Claude completes coding tasks efficiently and provides concise responses
  2. Explanatory  Claude explains its implementation choices and codebase patterns
  3. Learning     Claude pauses and asks you to write small pieces of code for hands-on practice
```

### Component Hierarchy

```
/output-style command
  └─ outputStyleCommand (tC9)
       ├─ OutputStyleMenuComponent ($v3) - Opens full selection menu
       │    └─ OutputStyleSelector (uY1)
       ├─ SetStyleDirectComponent (qv3) - Direct style setting
       └─ ShowCurrentStyleComponent (Nv3) - Display current style
```

---

## Telemetry Events

| Event | Trigger | Data |
|-------|---------|------|
| `tengu_output_style_command_menu` | Menu interaction | `action`, `from_style`, `to_style` |
| `tengu_output_style_command_inline` | Direct style setting | `args` |
| `tengu_output_style_command_inline_help` | Info keyword used | `args` |
| `tengu_output_style_changed` | Style changed in config | `style`, `source`, `settings_source` |

---

## Related Symbols

> Full mappings: [symbol_index_core.md](../00_overview/symbol_index_core.md)

Key functions in this document:
- `outputStyleCommand` (tC9) - Main command definition
- `OutputStyleMenuComponent` ($v3) - Interactive menu component
- `SetStyleDirectComponent` (qv3) - Direct style setter
- `ShowCurrentStyleComponent` (Nv3) - Current style displayer
- `findStyleCaseInsensitive` (wv3) - Case-insensitive style lookup
- `OutputStyleSelector` (uY1) - Reusable selection UI
- `loadAllOutputStyles` (cQA) - Load and merge all styles
- `loadCustomOutputStyles` (fE9) - Load custom .md styles
- `BUILTIN_OUTPUT_STYLES` (TQA) - Built-in style definitions
- `DEFAULT_STYLE_NAME` (wK) - Default style constant
- `getCurrentStyleConfig` (EE9) - Get current style config
- `generateOutputStyleReminder` (KH5) - System reminder generator

---

## See Also

- [Built-in Commands](./builtin_commands.md) - Command overview
- [System Reminders](../04_system_reminder/mechanism.md) - How reminders are injected
- [Settings System](../03_cli/cli_config.md) - Configuration storage
