# Analysis conventions for 2.1.227

1. Citations without another version tag refer to
   `/lyz/codespace/claude-code-bomb/versions/2.1.227/extract/cli_inner_pretty.js`.
2. `(220)` refers to the 2.1.220 pretty bundle; `(2.1.88 source)` refers to
   `/lyz/codespace/3rd/claude-code/src`.
3. Obfuscated names are local to this build. Never import a mangled name from an older index.
4. Exact string counts use fixed-string matching. A count is evidence of presence, not behavior;
   surrounding control flow must still be read.
5. Symbol mappings live only in `00_overview/symbol_index_*.md`. Module documents use related-symbol
   lists, never mapping tables.
6. Every deobfuscated code excerpt includes one header block, ORIGINAL, READABLE, and a final Mapping
   comment.
7. A general comparison table is allowed when it does not map obfuscated symbols. Symbol mappings are
   tables only inside the four canonical index files.
