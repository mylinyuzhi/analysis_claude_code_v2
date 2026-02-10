# Claude Code v2.1.38 - Chunked Source Files

This directory contains the split and formatted source code of Claude Code CLI v2.1.38 for analysis purposes.

## File Structure

### 1. Chunk Files (chunks.1.mjs - chunks.190.mjs)
- **Count**: 190 files
- **Size**: ~95KB each (max 100KB per chunk)
- **Format**: Beautified JavaScript with proper indentation and line breaks
- **Purpose**: Individual code segments split by AST (Abstract Syntax Tree) parser
- **Content**: Top-level declarations (functions, classes, variables) extracted from the original source

### 2. Index File (chunks.index.json)
- **Size**: ~18,814 entries
- **Format**: JSON key-value pairs
- **Purpose**: Maps obfuscated symbol names to their chunk file locations
- **Example**:
  ```json
  {
    "sI2": "chunks.107.mjs",
    "A61": "chunks.45.mjs",
    "mV1": "chunks.1.mjs"
  }
  ```
- **Usage**: Quick lookup to find which chunk contains a specific symbol

### 3. Entry File (cli.chunks.mjs)
- **Size**: ~121KB
- **Format**: Beautified JavaScript
- **Purpose**: Contains code that couldn't be split into individual chunks
- **Content**:
  - File header (shebang, version comment)
  - Module imports
  - Export declarations with multiple specifiers
  - Complex variable declarations (destructuring, etc.)
  - Special cases that need to stay in entry point

## Generation Process

```
2138_cli.js (11MB minified)
    ↓ js-beautify
cli.beautify.mjs (17MB formatted)
    ↓ acorn AST parser + split.js
chunks/*.mjs (190 files + index + entry)
```

**Split Criteria**:
- Maximum chunk size: 100,000 characters
- Split by top-level AST nodes (functions, classes, variable declarations)
- Preserves `@from(line, col)` annotations for source mapping

## Usage for Analysis

### Finding a Symbol
1. Search `chunks.index.json` for the obfuscated name
2. Open the corresponding chunk file
3. Analyze the code with full context

### Deobfuscation Workflow
1. Process chunks individually or by module
2. Build symbol mapping tables (obfuscated → readable)
3. Update analysis docs with semantic names
4. Track progress: processed chunks / 190 total

### Context Window Optimization
- Single chunk: ~21K tokens (fits easily in 200K token window)
- Can load 8-10 related chunks simultaneously for dependency analysis
- Much more efficient than processing 17MB monolithic file

## Notes

- All chunks are formatted with `js-beautify` for readability
- Original source locations preserved in `@from()` comments
- Name conflicts handled with numeric suffixes (e.g., `name_1`, `name_2`)
- Case-insensitive filesystem support (all lowercase chunk references)

## Related Files

- **Source**: `../2138_cli.js` (original minified)
- **Formatted**: `../cli.beautify.mjs` (beautified before split)
- **Split Script**: `../../scripts/split.js` (generator)
- **Analysis Docs**: `../../docs/` (deobfuscation analysis)
