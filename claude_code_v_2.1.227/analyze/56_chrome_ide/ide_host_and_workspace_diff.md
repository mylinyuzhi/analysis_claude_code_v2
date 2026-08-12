# IDE host controls and raw workspace diffs

The CLI exposes host control requests used by SDK hosts, Desktop, remote sidebars, and IDE
integrations. Two boundaries matter most: changing the process working directory without crossing a
trust boundary, and returning git diff content without executing repository-configured converters or
leaking read-restricted text.

## 1. Working-directory transaction

### Two-phase idle and trust validation

**What it does:** Changes the live session’s working directory only when the host provides a safe,
authorized path and the session stays idle throughout asynchronous validation.

**How it works:**
1. `handleSetCwdRequest` (`EHE`) rejects immediately if a turn is already running.
2. It requires a non-empty string path. A trust acceptance must also contain
   `trusted_directory`, which is an attestation echo rather than a generic Boolean.
3. Path resolution returns a classified result: not found, not a directory, blocked by a `Cd` rule,
   same directory, or a candidate directory.
4. Invisible/control/default-ignorable Unicode is refused before the path is echoed. The rejection
   intentionally omits the unsafe string.
5. A blocked rule is rendered without terminal affordances; if the rule text itself contains unsafe
   characters, a generic non-echoing explanation replaces it.
6. A same-directory request succeeds without mutation.
7. An untrusted candidate returns `needs_trust`, optionally with a higher trust root. Acceptance is
   valid only when `trusted_directory` exactly equals the resolved directory.
8. Accepted trust is persisted.
9. After all awaits, the handler checks `isBusy()` again. A turn that started during validation
   causes rejection.
10. The directory-move helper changes process/session state, relocates the transcript when needed,
    refreshes git/config state, loads new memory context, and constructs a model-visible stale-cwd
    notice.
11. Enqueuing that notice is best effort; the response returns the actual post-change cwd and
    transcript relocation status.

**Why this approach:**
- A single initial idle check has a time-of-check/time-of-use race because path and trust validation
  await filesystem work.
- Exact-directory echo prevents a host from reusing approval for a different path.
- Refusing to echo invisible characters avoids turning an error dialog into a spoofing channel.
- Directory change is more than `process.chdir`: cached git, settings, transcript location, and model
  context all depend on cwd.

**Key insight:** The second busy check is the transaction boundary. Everything before it prepares
authority; only after it confirms continued idleness may global session state move.

Evidence: `EHE` at `cli_inner_pretty.js:750100-750223` and its move helper immediately above.

## 2. IDE selection projection

### Source-sensitive selection attachment

**What it does:** Converts a host selection into the correct model attachment without treating diff
selections as ordinary editor-file selections.

**How it works:**
1. A selection whose source is `diff` and contains text becomes `selected_lines_in_diff` with file,
   content, and line count.
2. A normal selection requires a recognized IDE MCP client, `lineStart`, text, and file path.
3. Ignored paths are dropped before attachment creation.
4. The ending line is derived as `lineStart + lineCount - 1`.
5. The payload retains the absolute filename for tool semantics and adds a cwd-relative
   `displayPath` for model presentation.
6. Missing or incomplete host state returns an empty list rather than a partially valid reminder.

**Why this approach:**
- Diff coordinates describe a patch view, not necessarily a stable file buffer; keeping a distinct
  attachment type prevents downstream prompts from claiming the lines are current file content.
- Requiring an IDE client avoids accepting unauthenticated selection-shaped ambient state.
- Dropping ignored paths follows the same visibility expectation as other project content.

The CLI does not truncate selection text in this function. Any editor-side collection and truncation
is outside this bundle, so the report does not infer VS Code encoding behavior from unrelated string
helpers.

**Key insight:** Selection provenance is part of the semantic type. The same text and file path mean
different things when selected from a diff versus a live editor.

Evidence: `buildIdeSelectionAttachment` (`A_S`) at `cli_inner_pretty.js:592636-592653`.

## 3. Workspace diff generation

### One-base diff selection with raw content

**What it does:** Chooses one coherent comparison base for stats and hunks, then obtains hunk content
without repository-configured external diff drivers or `textconv`.

**How it works:**
1. `resolveWorkspaceDiffSummary` (`RFo`) first refuses non-git and transient merge/rebase/cherry-pick
   states.
2. In automatic mode it computes working-tree stats against `HEAD`.
3. When the working tree has changes, those stats become the chosen source.
4. When it is clean, the resolver attempts branch-versus-default-branch merge-base comparison.
5. No-commit repositories use cached/untracked fallbacks rather than inventing a branch base.
6. `resolveWorkspaceDiffBase` (`cbn`) turns the selected source into exactly one hunk base (`HEAD`, a
   merge base, or `--cached`).
7. `loadWorkspaceDiffHunks` (`LFo`) performs a cheap shortstat guard, then invokes git diff with
   `--no-ext-diff --no-textconv` for content.
8. It parses bounded hunks and tracks files omitted for per-file size.
9. In the cached/no-commit case, it removes misleading hunks for files that the specialized staged
   reconciliation identifies as untracked-only.

**Why this approach:**
- Computing stats from one base and hunks from another creates a response whose counts cannot explain
  its content.
- Working-tree-first matches what a user normally expects from `/diff`; branch fallback remains useful
  when committed work is the only delta.
- Disabling external drivers and text conversion prevents arbitrary repository-configured programs
  from affecting or generating the transmitted content.
- The trade-off is losing semantic custom diffs for binary/generated formats; byte-oriented,
  reproducible content is preferred at a remote-view boundary.

In 2.1.220, the corresponding content call at `309978` was `git diff <base>` without these two flags.
The flags at `cli_inner_pretty.js:324996` are the direct 2.1.222 changelog anchor.

**Key insight:** “Raw git blob content” is implemented by disabling transformations on the
content-producing call. Applying flags only to summary/count commands would not protect the text
shown to remote clients.

Evidence: `RFo`, `LFo`, and `cbn` at `cli_inner_pretty.js:324857-325009`.

### Permission- and budget-filtered response assembly

**What it does:** Returns useful diff metadata while withholding hunk text that is read-restricted,
oversized, inconsistent, or captured across a cwd/repository transition.

**How it works:**
1. `buildWorkspaceDiffResponse` (`_oH`) records the repository root before summary/hunk work.
2. It resolves summary, base, and hunks, then resolves the repository root again.
3. If the root disappeared or changed, it returns `diff: null`; it never combines results from two
   repositories.
4. Parsed hunk paths must exist in the summary’s `perFileStats` and must not contain the suspicious
   parser artifact `" b/"`.
5. Every path alias/ancestor used by the read-policy helper must be allowed. Restricted paths retain
   stats but move to the `restricted` list.
6. Already parser-skipped large files populate `skippedLarge`.
7. Each remaining file’s hunk text is measured. A file larger than the remaining aggregate budget is
   skipped.
8. Accepted hunks consume a shared 2,000,000-character budget.
9. The response keeps total stats, per-file stats, accepted hunks, restricted paths, skipped-large
   paths, and source/base metadata as distinct fields.

**Why this approach:**
- Rechecking the root closes a mid-request `/cd` or repository replacement race.
- Stats are lower-sensitivity metadata and remain useful even when read policy withholds content.
- Separate `restricted` and `skippedLarge` lists let clients explain absence accurately.
- A shared cap bounds serialization and UI cost; the trade-off is ordering-dependent admission when
  many large diffs compete for the remaining budget.

**Key insight:** An empty hunk array is not automatically an error. It can legitimately mean all
files are untracked, restricted, or too large, while the stats still describe the workspace.

Evidence: `_oH` at `cli_inner_pretty.js:940877-940915`; request/response schema at
`933880-933910`.

## 4. VS Code and Desktop evidence boundary

### CLI-owned Focus semantics versus extension-owned presentation

**What it does:** Separates behavior verifiable in the CLI bundle from VS Code UI changes that ship
in the extension.

**How it works:**
1. The CLI owns transcript classification, Focus fold buckets, live tool aggregation, thinking
   duration, question context, todo visibility, and the local/remote focus setting bridge.
2. These algorithms are pinned and analyzed in [48_accessibility_ui](../48_accessibility_ui/).
3. SDK initialization exposes Remote Control and host state fields that an extension may render.
4. The CLI cannot prove the extension’s command registration, keybinding, banner wording, or view
   container behavior because extension source is not embedded here.
5. Therefore the 2.1.221 Focus-view UI exposure and 2.1.224–2.1.225 VS Code display fixes are linked
   to their verified CLI semantic support but not falsely assigned to a nearby host function.

**Why this approach:**
- Changelog-to-code analysis must distinguish a shared runtime contract from a product-specific UI
  implementation.
- Treating every VS Code bullet as a CLI delta creates false anchors and obscures where a regression
  must actually be fixed.

**Key insight:** A schema field proves that the CLI can communicate state; it does not prove how a
particular extension renders or controls that state.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `handleSetCwdRequest` (`EHE`) — two-phase idle, path, rule, and trust transaction.
- `buildIdeSelectionAttachment` (`A_S`) — source-sensitive selection projection.
- `resolveWorkspaceDiffSummary` (`RFo`) — working-tree/branch comparison selection.
- `loadWorkspaceDiffHunks` (`LFo`) — raw, transformation-disabled hunk loader.
- `buildWorkspaceDiffResponse` (`_oH`) — repository-stable, permission-filtered diff response.
