# Tool Registry and Execution Analysis

This document analyzes the tool registration, validation, and execution flow in version 2.1.38.

## Tool Definition Files

The core tool definitions are primarily found in `chunks.146.mjs` and `chunks.76.mjs`.

- `chunks.146.mjs`: Defines file system interaction tools (`Read`, `Write`).
- `chunks.76.mjs`: Defines file search tools (`Grep`, `Glob`).
- `chunks.166.mjs`: Defines browser control tools (`javascript_tool`, `read_page`, etc.).
- `chunks.140.mjs`: Defines LSP-related tools.
- `chunks.150.mjs`: Contains security validation logic for `Bash` and `Sed`.

## Core Tools Analysis

The following core tools have been identified with their internal variable names and implementations:

### 1. Read Tool (FileReadTool)
- **Tool Name:** `Read` (Internal: `Jq`, variable `i5`)
- **Location:** `chunks.146.mjs` (Definition around line 1754)
- **Capabilities:**
  - Reads local files.
  - Supports `offset` and `limit` for partial reading.
  - Supports `pages` for PDF reading.
  - Can return content as `text`, `image` (base64), `notebook` (parsed cells), or `pdf` metadata.
- **Input Schema:** defined in `OmY` (line 1706).
  - `file_path`: string (required)
  - `offset`: number (optional)
  - `limit`: number (optional)
  - `pages`: string (optional, for PDFs)

### 2. Write Tool (FileWriteTool)
- **Tool Name:** `Write` (Internal: `f5`, variable `vj`)
- **Location:** `chunks.146.mjs` (Definition around line 436)
- **Capabilities:**
  - Writes content to local files.
  - Handles file creation and updates.
  - Checks permissions and timestamps to prevent overwrite conflicts.
  - Integration with LSP to notify file changes.
- **Input Schema:** defined in `dBY` (line 419).
  - `file_path`: string (absolute path)
  - `content`: string

### 3. Grep Tool (Search)
- **Tool Name:** `Grep` (Internal: `s9`, variable `tS`)
- **Location:** `chunks.76.mjs` (Definition around line 1129)
- **Capabilities:**
  - Searches file contents using regex.
  - Supports `ripgrep` flags like `-i`, `-n`, `-C`, `-B`, `-A`.
  - Supports glob filtering.
- **Input Schema:** defined in `Z99` (line 1104).
  - `pattern`: string
  - `path`: string
  - `glob`: string
  - `output_mode`: enum (`content`, `files_with_matches`, `count`)

### 4. Glob Tool (Find)
- **Tool Name:** `Glob` (Internal: `Jz`, variable `WB`)
- **Location:** `chunks.76.mjs` (Definition around line 1495)
- **Capabilities:**
  - Finds files by filename pattern.
- **Input Schema:** defined in `N99` (line 1487).
  - `pattern`: string
  - `path`: string

### 5. Bash Tool
- **Tool Name:** `Bash`
- **Definition:** Likely defined dynamically or in `chunks.162.mjs` (UI component `BYq` handles shell output).
- **Security:** Extensive validation logic in `chunks.150.mjs` (function `lm` and others).
  - Validates commands against dangerous patterns.
  - Supports `bash_progress` events for long-running commands.
  - Truncates output to prevent context overflow.
  - See [Security Validation](security_validation.md) for details.

### 6. Browser Tools
- **Location:** `chunks.166.mjs`
- **Tools:**
  - `javascript_tool`: Execute JS in browser.
  - `read_page`: Read accessibility tree.
  - `find`: Find elements by natural language.
  - `form_input`: Interact with forms.
  - `computer`: Mouse/keyboard control.

## Tool Execution Flow

1. **Agent Request:** The agent generates a `tool_use` block.
2. **Permission Check:** The system checks permissions (e.g., `ro` function in `chunks.146.mjs` for Read, `N51` for Write).
3. **Validation:** Tools have `validateInput` methods (e.g., checks if file exists, is directory, etc.).
4. **Execution:** The `call` method is invoked.
   - For `Read`, it reads the file and returns content or metadata.
   - For `Write`, it writes the file and returns a success message or diff.
   - For `Bash`, it executes the command (likely using `spawn` internally) and streams output via `bash_progress` events.
5. **Output Processing:** Results are formatted (e.g., `mapToolResultToToolResultBlockParam`) and returned to the agent.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions identified:
- `i5` (`Read` tool object)
- `vj` (`Write` tool object)
- `tS` (`Grep` tool object)
- `WB` (`Glob` tool object)
- `lm` (Bash security validation)
- `BYq` (Bash output UI component)
