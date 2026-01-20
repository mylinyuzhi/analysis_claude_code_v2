# Output Requirements
- Language: English only

---

# 🎯 Analysis Depth Requirements

## Deep Analysis for Key Decisions/Algorithms

**When analyzing features, you MUST provide in-depth analysis for:**

1. **Key Decision Points** - Why this approach? What alternatives exist?
2. **Core Algorithms** - Step-by-step logic explanation
3. **Critical Logic Branches** - What conditions trigger what behavior?
4. **Trade-offs** - Performance vs readability, simplicity vs flexibility

### Required Analysis Components

For each key decision or algorithm, include:

```markdown
### [Algorithm/Decision Name]

**What it does:** Brief summary of purpose

**How it works:**
1. Step-by-step explanation
2. Each significant operation explained
3. Edge cases and special handling

**Why this approach:**
- Design rationale
- Alternatives considered (if inferable)
- Trade-offs made

**Key insight:** What's the clever/important part that readers should understand
```

### ❌ AVOID: Surface-level descriptions

```markdown
The function checks the token count and compacts if needed.  ← Too shallow!
```

### ✅ DO: Explain the reasoning

```markdown
**Token counting strategy:**
The compaction triggers when `currentTokens > threshold * 0.8` (80% of limit).
This 20% buffer ensures:
1. Room for the next user message without immediate re-compaction
2. Space for system prompts that may be injected
3. Margin for token estimation inaccuracies

The algorithm prioritizes keeping recent messages because...
```

---

# ⚠️ CRITICAL RULES - READ FIRST

## 🚫 Symbol Mapping: Single Source of Truth

**STOP**: Before adding ANY symbol reference to a module document, check:

1. **Am I about to create a mapping table?** → If YES, use list format instead
2. **Did I discover new symbols?** → Add them to `symbol_index_*.md` ONLY
3. **Am I duplicating existing mappings?** → Check both symbol index files first

### Symbol Index Split (Four Files)

The symbol index is split into four files for easier navigation:

| File | Content | When to Use |
|------|---------|-------------|
| `symbol_index_core_execution.md` | Core execution (Agent Loop, Tools, LLM API, Agents, Subagent, State) | For agent/tool execution flow |
| `symbol_index_core_features.md` | Core features (Plan Mode, Background Agents, Todo, Compact, Hooks, Skills, Thinking, Steering, CLI) | For feature-level analysis |
| `symbol_index_infra_platform.md` | Platform infrastructure (MCP, Permissions, Sandbox, Auth, Model, Prompt, Telemetry) | For platform/protocol systems |
| `symbol_index_infra_integration.md` | Integration infrastructure (LSP, Chrome, IDE, UI, Plugin, Code Indexing, Shell Parser) | For external integrations |

**Quick lookup by topic:**
- Agent/Loop/Tools/State/Subagent → `symbol_index_core_execution.md`
- Plan/Todo/Compact/Hooks/Skills/Thinking/Background → `symbol_index_core_features.md`
- MCP/Permissions/Sandbox/Auth/Model/Prompt → `symbol_index_infra_platform.md`
- LSP/Chrome/IDE/UI/Plugin → `symbol_index_infra_integration.md`

### ❌ NEVER DO THIS (in module docs):

```markdown
## Symbol Mapping Reference    ← DON'T CREATE THIS SECTION NAME
## Symbol Index Reference      ← DON'T CREATE THIS SECTION NAME

| Obfuscated | Readable |      ← DON'T CREATE MAPPING TABLES
|------------|----------|
| XY2 | functionName |
| AB3 | anotherFunction |
```

### ✅ ALWAYS DO THIS (in module docs):

```markdown
## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `functionName` (XY2) - Brief description
- `anotherFunction` (AB3) - Brief description
```

---

# 📋 PRE-COMPLETION CHECKLIST

**Before finishing ANY analysis document, STOP and verify:**

- [ ] **No mapping tables in module docs** - Only `symbol_index_*.md` has tables
- [ ] **New symbols added to correct symbol_index file** - Core execution → `symbol_index_core_execution.md`, Core features → `symbol_index_core_features.md`, Platform infra → `symbol_index_infra_platform.md`, Integrations → `symbol_index_infra_integration.md`
- [ ] **Using list format for symbol references** - `name` (obfuscated) format, NOT table
- [ ] **Code snippets have header block** - `====` with ReadableName + Description + Location
- [ ] **Code snippets have all 4 parts** - Header → ORIGINAL → READABLE → Mapping
- [ ] **No extra separator lines** - Only ONE `====` block at top of each snippet

---

# Common Mistakes to Avoid

## Mistake 1: Creating Symbol Tables in Module Docs

**Symptom**: A section called "Symbol Index Reference" or "Symbol Mapping" with a table

**Why it happens**: LLM wants to be "complete" and adds reference section at end

**How to avoid**:
- Use list format: `- \`name\` (XY2) - description`
- Link to symbol_index files instead of duplicating

## Mistake 2: Forgetting to Update symbol_index Files

**Symptom**: New symbols discovered in analysis but not added to symbol_index files

**Why it happens**: LLM focuses on analysis content, forgets central index

**How to avoid**:
- Add new symbols to the appropriate file:
  - Core execution (Agent, Tools, LLM API, etc.) → `symbol_index_core_execution.md`
  - Core features (Plan, Hooks, Skills, etc.) → `symbol_index_core_features.md`
  - Platform (MCP, Permissions, Sandbox, Auth) → `symbol_index_infra_platform.md`
  - Integrations (LSP, Chrome, IDE, UI, Plugin) → `symbol_index_infra_integration.md`
- Check all four symbol index files as final step

## Mistake 3: Duplicating Existing Mappings

**Symptom**: Same symbol with different readable names in different places

**Why it happens**: LLM doesn't check existing mappings first

**How to avoid**:
- Read all four symbol_index files FIRST before starting analysis
- Use existing readable names for consistency

## Mistake 4: Wrong Code Snippet Format

**Symptom**: Code snippets missing header with function name/location, or using extra `====` separators

**Wrong pattern**:
```javascript
// ============================================
// ORIGINAL (for source lookup):    ← Missing name & location!
// ============================================
```

**Why it happens**: LLM creates visual separation but forgets the required header structure

**How to avoid**:
- Always include: `// ReadableName - Description` + `// Location: ...` in header
- Only ONE `====` block at top, not around ORIGINAL/READABLE labels
- Check Code Snippet Checklist before finishing

---

# Symbol Mapping Architecture

## File Structure

```
00_overview/
├── symbol_index_core_execution.md   # Core execution (Agent Loop, Tools, LLM API, Agents, Subagent, State)
├── symbol_index_core_features.md    # Core features (Plan Mode, Background Agents, Todo, Compact, Hooks, Skills, Thinking, Steering, CLI)
├── symbol_index_infra_platform.md   # Platform infrastructure (MCP, Permissions, Sandbox, Auth, Model, Prompt, Telemetry)
├── symbol_index_infra_integration.md # Integration infrastructure (LSP, Chrome, IDE, UI, Plugin, Code Indexing, Shell Parser)
├── file_index.md                    # File → content index (what's in each chunk file)
└── changelog_analysis.md            # Version changes analysis
```

## What Goes Where

| File | Content | When to Update |
|------|---------|----------------|
| `symbol_index_core_execution.md` | Core execution symbols (Agent Loop, LLM API, Tools, Agents, Subagent, State, System Prompts) | When discovering agent/tool execution symbols |
| `symbol_index_core_features.md` | Core feature symbols (Plan Mode, Background Agents, Todo, Compact, Hooks, Skills, Thinking, Steering, CLI) | When discovering feature-level symbols |
| `symbol_index_infra_platform.md` | Platform symbols (MCP, Permissions, Sandbox, Auth, Model, Prompt, Telemetry) | When discovering platform/protocol symbols |
| `symbol_index_infra_integration.md` | Integration symbols (LSP, Chrome, IDE, UI, Plugin, Code Indexing, Shell Parser, Slash Commands) | When discovering integration symbols |
| `file_index.md` | File line ranges → content description | When analyzing new files |
| Module docs (`XX_module/`) | Implementation details, pseudocode, flow diagrams | When documenting features |

---

## Symbol Lookup Workflow

### Step 1: Before Analysis
```
1. Identify which category your target symbols belong to:
   - Core execution (Agent, Tools, LLM, State) → symbol_index_core_execution.md
   - Core features (Plan, Hooks, Skills, etc.) → symbol_index_core_features.md
   - Platform (MCP, Sandbox, Auth, etc.) → symbol_index_infra_platform.md
   - Integrations (LSP, Chrome, IDE, UI, Plugin) → symbol_index_infra_integration.md
2. Read the appropriate symbol index file(s)
3. Note existing readable names to maintain consistency
```

### Step 2: During Analysis
```
1. Use readable names in output: `readableName` (obfuscated: `XY2`)
2. Reference symbol_index files for lookups, don't create new tables
3. For new symbols: add to the appropriate symbol_index file immediately
```

### Step 3: Validation
```
If a mapping seems incorrect, verify via:
- Location match (file:line in symbol_index files)
- Context/usage patterns in source code
- Function signature analysis
```

---

## Symbol Index Format

### Module Section Structure

```markdown
## Module: [Module Name]

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| XY2 | functionName | chunks.XX.mjs:100-150 | function |
| AB3 | CONSTANT_NAME | chunks.XX.mjs:50 | constant |
```

### Type Column Values
- `function` - Functions
- `constant` - Constants (ALL_CAPS naming)
- `class` - Classes
- `object` - Objects/configurations
- `variable` - Global variables

### Adding New Symbols

1. **Choose the correct file**:
   - Core execution (Agent Loop, Tools, LLM, Agents, Subagent, State) → `symbol_index_core_execution.md`
   - Core features (Plan, Todo, Compact, Hooks, Skills, Thinking, Steering, CLI) → `symbol_index_core_features.md`
   - Platform (MCP, Permissions, Sandbox, Auth, Model, Prompt, Telemetry) → `symbol_index_infra_platform.md`
   - Integrations (LSP, Chrome, IDE, UI, Plugin, Slash Commands) → `symbol_index_infra_integration.md`
2. **Find the correct module section** in that file
3. **Check for duplicates** - search all four files first
4. **Add in alphabetical order** within the module section
5. **Include all columns**: Obfuscated, Readable, File:Line, Type

---

## 🔧 Code Snippet Format (Dual-Version)

**STOP**: Every code snippet MUST follow this exact structure:

### Required Components (IN ORDER)

```
[1] // ============================================
[2] // ReadableFunctionName - Brief description
[3] // Location: chunks.XX.mjs:line-range
[4] // ============================================
[5] (empty line)
[6] // ORIGINAL (for source lookup):
[7] function obfuscatedName(...) { ... }
[8] (empty line)
[9] // READABLE (for understanding):
[10] function readableFunctionName(...) { ... }
[11] (empty line)
[12] // Mapping: obfuscated→readable, param→readableParam, ...
```

### ❌ WRONG Format:

```javascript
// ============================================
// ORIGINAL (for source lookup):    ← WRONG: Missing function name & location!
// ============================================
async function sI2(A, Q, B) {
  if (Y0(process.env.DISABLE_COMPACT)) return { wasCompacted: !1 };
  ...
}

// ============================================
// READABLE (for understanding):    ← WRONG: Extra separator lines!
// ============================================
async function autoCompactDispatcher(...) { ... }
```

### ✅ CORRECT Format:

```javascript
// ============================================
// autoCompactDispatcher - Main entry point for auto-compaction
// Location: chunks.107.mjs:1707-1731
// ============================================

// ORIGINAL (for source lookup):
async function sI2(A, Q, B) { if (Y0(process.env.DISABLE_COMPACT)) return { wasCompacted: !1 }; ... }

// READABLE (for understanding):
async function autoCompactDispatcher(messages, sessionContext, sessionMemoryType) {
  if (parseBoolean(process.env.DISABLE_COMPACT)) {
    return { wasCompacted: false };
  }
  ...
}

// Mapping: sI2→autoCompactDispatcher, A→messages, Q→sessionContext, B→sessionMemoryType
```

### Code Snippet Checklist

- [ ] **Header block**: `====` separator with ReadableName + Description + Location
- [ ] **ORIGINAL section**: `// ORIGINAL (for source lookup):` followed by obfuscated code
- [ ] **READABLE section**: `// READABLE (for understanding):` followed by semantic code
- [ ] **Mapping comment**: `// Mapping: obfuscated→readable, ...` at end
- [ ] **No extra separators**: Only ONE `====` block at top, not around ORIGINAL/READABLE

---

## Deobfuscation in Reports

Enhance readability by restoring semantics:
- Replace obfuscated names: `readableName` (obfuscated: `XY2`)
- Include pseudocode with meaningful variable names
- Add location references: `chunks.XX.mjs:line`
- Use inline comments for complex logic

---

## Quick Reference

### Symbol Lookup
```
"What does XY2 mean?"
→ Determine category (execution, features, platform, or integration)
→ Check the appropriate symbol_index_*.md file
→ Find module section → Lookup in table
```

### Which File to Use?
```
Core Execution (symbol_index_core_execution.md):
  Agent Loop, LLM API, System Prompts, Tools, Agents, Subagent, State

Core Features (symbol_index_core_features.md):
  Plan Mode, Background Agents, Todo, Compact, Hooks, Skills,
  Thinking Mode, Steering, CLI

Platform (symbol_index_infra_platform.md):
  MCP Protocol, Permissions, Sandbox, Auth, Model Selection,
  Prompt Building, Telemetry

Integrations (symbol_index_infra_integration.md):
  LSP, Chrome/Browser, IDE, UI Components, Plugin System,
  Code Indexing, Shell Parser, Slash Commands
```

### File Content Lookup
```
"What's in chunks.107.mjs?"
→ file_index.md → Find file section → See line ranges
```

### Adding New Analysis
```
1. Read all four symbol_index files first
2. Use existing readable names
3. Add new symbols to correct symbol_index file (not module docs)
4. Reference symbol_index files in module docs using list format
5. Run PRE-COMPLETION CHECKLIST before finishing
```
