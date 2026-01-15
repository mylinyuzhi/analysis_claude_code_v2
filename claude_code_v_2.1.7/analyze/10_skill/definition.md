# Skill Definition Guide

## Overview

Skills in Claude Code are reusable AI-powered operations defined in `SKILL.md` files. They allow users to create domain-specific capabilities that Claude can autonomously invoke during conversations.

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

**Key functions:**
- `parseFrontmatter` (NV) - Parse YAML frontmatter from markdown
- `loadSkillsFromDirectory` (cO0) - Scan directory for SKILL.md files
- `extractFirstHeading` (Wx) - Auto-extract description from content

---

## Quick Navigation

- [SKILL.md File Format](#skillmd-file-format)
- [Frontmatter Reference](#frontmatter-reference)
- [Frontmatter Parsing Algorithm](#frontmatter-parsing-algorithm)
- [Content Templates](#content-templates)
- [Directory Structure](#directory-structure)
- [Creating Custom Skills](#creating-custom-skills)
- [Best Practices](#best-practices)

---

## SKILL.md File Format

Skills are defined in `SKILL.md` files with YAML frontmatter followed by markdown content:

```markdown
---
name: my-skill-name
description: What this skill does
when_to_use: When Claude should invoke this skill
allowed-tools: ["Read", "Grep", "Glob", "Edit"]
model: sonnet
disable-model-invocation: false
argument-hint: <optional arguments>
version: 1.0
---

# Skill Title

Your skill instructions here...

## Task

$ARGUMENTS
```

### Structure Breakdown

1. **Frontmatter Block**: YAML metadata between `---` markers
2. **Content Block**: Markdown instructions for Claude
3. **$ARGUMENTS Placeholder**: Where user arguments are injected

---

## Frontmatter Reference

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `when_to_use` | string | **Critical**: Guidance for when LLM should invoke this skill. Without this, skill won't appear in LLM's available skills list. |

### Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `name` | string | Directory name | Display name for the skill |
| `description` | string | First heading | Skill description shown to users |
| `allowed-tools` | string/array | All tools | Tools this skill can use |
| `model` | string | inherit | Model override: `sonnet`, `opus`, `haiku`, `inherit` |
| `disable-model-invocation` | boolean | false | If `true`, skill can only be user-invoked via `/skill-name` |
| `argument-hint` | string | - | Hint text shown in skill argument prompt |
| `version` | string | - | Skill version for tracking |

### Field Details

#### `when_to_use`

This field is critical for LLM invocation. It tells Claude when to automatically invoke your skill:

```yaml
when_to_use: |
  Use this skill when the user asks to:
  - Review code for security issues
  - Check for potential vulnerabilities
  - Audit authentication logic
```

**Key insight:** Without `when_to_use`, the skill is hidden from LLM's available skills. It can still be invoked manually via `/skill-name`.

#### `allowed-tools`

Restricts which tools the skill can use during execution:

```yaml
# Single tool
allowed-tools: Read

# Multiple tools (array)
allowed-tools: ["Read", "Grep", "Glob"]

# All tools (default when omitted)
allowed-tools: "*"
```

#### `model`

Override the model used for skill execution:

```yaml
# Use Sonnet (faster, cheaper)
model: sonnet

# Use Opus (more capable)
model: opus

# Use Haiku (fastest, cheapest)
model: haiku

# Inherit from parent context (default)
model: inherit
```

---

## Frontmatter Parsing Algorithm

```javascript
// ============================================
// parseFrontmatter - Extracts YAML frontmatter from markdown
// Location: chunks.16.mjs:892-919
// ============================================

// ORIGINAL (for source lookup):
function NV(A) {
  let Q = /^---\s*\n([\s\S]*?)---\s*\n?/,
    B = A.match(Q);
  if (!B) return { frontmatter: {}, content: A };
  let G = B[1] || "", Z = A.slice(B[0].length), I = {}, Y = G.split(`\n`);
  for (let J of Y) {
    let W = J.indexOf(":");
    if (W > 0) {
      let X = J.slice(0, W).trim(), V = J.slice(W + 1).trim();
      if (X) { let F = V.replace(/^["']|["']$/g, ""); I[X] = F }
    }
  }
  return { frontmatter: I, content: Z }
}

// READABLE (for understanding):
function parseFrontmatter(fileContent) {
  // Match YAML frontmatter block: ---\nkey: value\n---
  let frontmatterRegex = /^---\s*\n([\s\S]*?)---\s*\n?/;
  let match = fileContent.match(frontmatterRegex);

  if (!match) return { frontmatter: {}, content: fileContent };

  let frontmatterBlock = match[1] || "";
  let contentAfterFrontmatter = fileContent.slice(match[0].length);
  let parsedFrontmatter = {};

  // Parse key: value pairs line by line
  let lines = frontmatterBlock.split('\n');
  for (let line of lines) {
    let colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      let key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      if (key) {
        // Remove surrounding quotes if present
        let cleanValue = value.replace(/^["']|["']$/g, "");
        parsedFrontmatter[key] = cleanValue;
      }
    }
  }

  return { frontmatter: parsedFrontmatter, content: contentAfterFrontmatter };
}

// Mapping: NV→parseFrontmatter, A→fileContent, Q→frontmatterRegex, B→match,
//          G→frontmatterBlock, Z→contentAfterFrontmatter, I→parsedFrontmatter
```

**How it works:**
1. Uses regex to match `---\n...\n---` pattern at file start
2. If no match, returns empty frontmatter with full content
3. Splits frontmatter block by newlines
4. Parses each line as `key: value` pair
5. Strips surrounding quotes from values
6. Returns both parsed frontmatter object and remaining content

**Why this approach:**
- **Simple line-by-line parsing** instead of full YAML parser: Reduces dependencies and bundle size
- **Quote stripping** handles both `"value"` and `'value'`
- **Graceful fallback**: If no frontmatter found, entire file becomes content

**Key insight:** The parser is intentionally minimal - it doesn't support nested YAML, inline arrays, or multi-line values. This is sufficient for skill metadata.

---

## Content Templates

### $ARGUMENTS Placeholder

The `$ARGUMENTS` placeholder is replaced with user-provided arguments at runtime:

```markdown
---
name: review-code
when_to_use: When user asks to review code
argument-hint: <file path or description>
---

# Code Review

Review the following code for issues:

$ARGUMENTS
```

**Injection behavior:**
- If `$ARGUMENTS` exists in content → replaced with user arguments
- If no `$ARGUMENTS` placeholder → arguments appended as `\n\nARGUMENTS: <args>`

```javascript
// ============================================
// Argument injection logic
// Location: chunks.133.mjs (in loadSkillsFromDirectory)
// ============================================

async getPromptForCommand(userArguments, appContext) {
  let skillPrompt = `Base directory for this skill: ${skillDir}\n\n${content}`;

  if (userArguments) {
    if (skillPrompt.includes("$ARGUMENTS")) {
      // Replace placeholder with actual arguments
      skillPrompt = skillPrompt.replaceAll("$ARGUMENTS", userArguments);
    } else {
      // Append if no placeholder
      skillPrompt = skillPrompt + `\n\nARGUMENTS: ${userArguments}`;
    }
  }

  return [{ type: "text", text: skillPrompt }];
}
```

### Base Directory Injection

Every skill prompt is automatically prefixed with its base directory path:

```
Base directory for this skill: /Users/name/.claude/skills/my-skill

[Your skill content here]
```

**Why this matters:**
- Skills can reference files relative to their location
- Enables skill-specific resources (templates, configs)
- Helps Claude understand file context

---

## Directory Structure

### Standard Skill Layout

```
~/.claude/skills/
├── code-review/
│   ├── SKILL.md           # Required: Skill definition
│   └── templates/         # Optional: Supporting files
│       └── review-checklist.md
│
├── deploy-staging/
│   ├── SKILL.md
│   └── scripts/
│       └── pre-deploy.sh
│
└── analyze-logs/
    └── SKILL.md
```

### Discovery Rules

1. **Directory required**: Each skill must be in its own subdirectory
2. **Exact filename**: Must be named `SKILL.md` (case-sensitive)
3. **Symlinks supported**: Can symlink to shared skill definitions
4. **Nested not scanned**: Subdirectories inside skill directory are not scanned

### Three-Tier Locations

| Tier | Path | Priority |
|------|------|----------|
| Managed | `{managed_dir}/.claude/skills/` | Highest (organization policy) |
| User | `~/.claude/skills/` | Medium (personal skills) |
| Project | `.claude/skills/` | Lowest (project-specific) |

**Deduplication:** If same skill name exists in multiple tiers, higher priority wins.

---

## Creating Custom Skills

### Step-by-Step Guide

#### 1. Create Skill Directory

```bash
mkdir -p ~/.claude/skills/my-skill
```

#### 2. Create SKILL.md

```bash
cat > ~/.claude/skills/my-skill/SKILL.md << 'EOF'
---
name: my-skill
description: Does something useful
when_to_use: When user asks to do something useful
allowed-tools: ["Read", "Grep", "Edit"]
---

# My Skill

You are an expert at doing something useful.

## Instructions

1. First, understand what the user wants
2. Then, execute the task
3. Finally, report results

## Task

$ARGUMENTS
EOF
```

#### 3. Test the Skill

```bash
# Invoke via slash command
claude> /my-skill test arguments

# Or let Claude invoke it automatically based on when_to_use
```

### Example Skills

#### Security Audit Skill

```markdown
---
name: security-audit
description: Audit code for security vulnerabilities
when_to_use: |
  Use when the user asks to:
  - Check for security issues
  - Audit authentication/authorization
  - Review for injection vulnerabilities
  - Check for sensitive data exposure
allowed-tools: ["Read", "Grep", "Glob"]
model: opus
---

# Security Audit

You are a security expert. Audit the codebase for vulnerabilities.

## Focus Areas

1. **Injection vulnerabilities** - SQL, command, XSS
2. **Authentication issues** - Weak passwords, missing MFA
3. **Authorization flaws** - IDOR, privilege escalation
4. **Data exposure** - Secrets in code, logging sensitive data
5. **Dependency risks** - Known CVEs in dependencies

## Output Format

For each issue found:
- **Severity**: Critical/High/Medium/Low
- **Location**: File and line number
- **Description**: What the issue is
- **Remediation**: How to fix it

## Target

$ARGUMENTS
```

#### Documentation Generator Skill

```markdown
---
name: generate-docs
description: Generate documentation for code
when_to_use: When user asks to document code, generate API docs, or create README
allowed-tools: ["Read", "Glob", "Write"]
argument-hint: <file or directory path>
---

# Documentation Generator

Generate comprehensive documentation for the specified code.

## Process

1. Read the source code
2. Identify public APIs and interfaces
3. Generate documentation following best practices
4. Include usage examples where helpful

## Output

Create markdown documentation with:
- Overview section
- API reference
- Usage examples
- Configuration options

## Target

$ARGUMENTS
```

---

## Best Practices

### Naming Conventions

| Aspect | Convention | Example |
|--------|------------|---------|
| Directory name | kebab-case | `code-review`, `deploy-staging` |
| Display name | Title Case | `Code Review`, `Deploy Staging` |
| Avoid conflicts | Prefix with domain | `company-code-review` |

### When to Use Guidelines

Write clear, specific `when_to_use` instructions:

```yaml
# Good - Specific triggers
when_to_use: |
  Use this skill when:
  - User explicitly asks to review PR
  - User mentions "code review" or "review changes"
  - User asks to check code quality

# Bad - Too vague
when_to_use: When doing code stuff
```

### Tool Restrictions

Only request tools your skill actually needs:

```yaml
# Good - Minimal permissions
allowed-tools: ["Read", "Grep"]

# Bad - Overly permissive
allowed-tools: "*"
```

### Model Selection

Choose the right model for the task:

| Task Type | Recommended Model |
|-----------|-------------------|
| Complex analysis | `opus` |
| Simple lookup | `haiku` |
| General tasks | `sonnet` (default) |
| Match parent context | `inherit` |

---

## Skill Object Schema

When loaded, each skill becomes an object with these properties:

```typescript
interface SkillObject {
  // Identity
  type: "prompt";                    // Always "prompt" for skills
  name: string;                      // Directory name
  description: string;               // Computed: frontmatter.description || firstHeading
  source: "policySettings" | "userSettings" | "projectSettings";

  // Flags
  isSkill: true;                     // Distinguishes from slash commands
  isHidden: true;                    // Hidden from general command list
  isEnabled: () => boolean;          // Always returns true for skills
  disableModelInvocation: boolean;   // From frontmatter

  // Metadata
  hasUserSpecifiedDescription: boolean;
  whenToUse: string | undefined;     // Critical for LLM selection
  argumentHint: string | undefined;
  version: string | undefined;
  progressMessage: "running";        // Displayed during execution

  // Configuration
  allowedTools: string[];            // Tools skill can invoke
  model: string | undefined;         // Model override

  // Functions
  userFacingName(): string;          // Returns name or directory name
  getPromptForCommand(args: string, context: AppContext): Promise<ContentBlock[]>;
}
```

---

## Skills vs Slash Commands

| Aspect | Skills (SKILL.md) | Slash Commands (*.md) |
|--------|-------------------|----------------------|
| File name | `SKILL.md` (exact) | Any `*.md` file |
| `isSkill` flag | `true` | `false` |
| Directory structure | Subdirectory required | Can be flat |
| LLM invocation | Via Skill Tool | Via `/command` only |
| Progress message | `"loading"` | `"running"` |
| `isHidden` | `true` | `false` |
| Purpose | LLM-invokable operations | User-invokable commands |

---

## Related Modules

- [architecture.md](./architecture.md) - Skill system architecture
- [loading.md](./loading.md) - Skill loading pipeline
- [execution.md](./execution.md) - Skill execution flow
- [../09_slash_command/custom_commands.md](../09_slash_command/custom_commands.md) - Custom command creation
