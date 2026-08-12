# Slash-command registry, dispatch, menu, and relaunch state

## Scope and evidence

This document analyzes the current 2.1.227 implementation rather than treating the changelog as a
specification. The primary bundle anchors are:

| Concern | 2.1.227 location |
|---|---|
| Command state and invalidation | `cli_inner_pretty.js:122856-122919` |
| Bundled skill projection | `cli_inner_pretty.js:242856-242906` |
| Plugin command loading | `cli_inner_pretty.js:245534-245570` |
| Catalog assembly and working-directory overlays | `cli_inner_pretty.js:526578-526721` |
| Headless/remote projections | `cli_inner_pretty.js:526767-526943` |
| Parser and dispatch | `cli_inner_pretty.js:480140-481400` |
| Stacked and forked prompt commands | `cli_inner_pretty.js:480606-480815`, `:481405-481442` |
| Menu ranking | `cli_inner_pretty.js:834223-834437` |
| Shared suggestion renderer | `cli_inner_pretty.js:740140-740600` |
| `/tui` relaunch call | `cli_inner_pretty.js:821502-821607` |
| Resume-leaf persistence helper | `cli_inner_pretty.js:485905-485936` |
| `/fork` and `/subtask` descriptors | `cli_inner_pretty.js:484251-484332` |
| `claude doctor` and `/doctor` | `cli_inner_pretty.js:670380-670472`, `:876408-876432`, `:965533-965542` |

The 2.1.220 comparison anchors are `:506805-506814` for plugin-alias filtering,
`:654366-654794` for suggestion rendering, and `:732389-732498` for `/tui`.

## Architecture overview

The runtime does not have one monolithic “slash command class.” A command is a descriptor whose
`type` chooses one of three execution contracts:

| Type | Payload | Execution boundary | Headless behavior |
|---|---|---|---|
| `local-jsx` | Interactive Ink component | UI callback/promise | Refused with a terminal-only explanation |
| `local` | Lazy `call(args, context, rawInput)` module | Same process | Allowed only when `supportsNonInteractive` |
| `prompt` | Prompt blocks plus optional tools/model/effort | Main loop or isolated agent | Allowed unless explicitly disabled |

That descriptor is enriched with source, aliases, enablement, visibility, invocation policy,
availability requirements, and optional subcommand routes. The same catalog is then projected into
the terminal menu, non-interactive CLI, remote clients, model-visible Skill tool, and thin-client
surfaces.

## Catalog construction and precedence

### Multi-source command catalog assembly

**What it does:** Builds one ordered command list from local skills, workflows, plugins, bundled
content, and built-ins while isolating failures in optional sources.

**How it works:**
1. `loadAllSkillSources` (`nQb`, `:526595-526632`) loads skill-directory commands and plugin skills in
   parallel. Each branch catches its own error and substitutes an empty list, so a broken plugin does
   not remove terminal built-ins.
2. The same function appends registered bundled skills and built-in-plugin skills. The bundled kill
   switch is applied by `getBundledSkills` (`mDo`, `:242903-242906`); designated survivors such as
   `/doctor` remain.
3. `assembleCommandCatalog` (`sQb`, `:526657-526670`) concurrently loads that skill group, plugin
   command files through `loadPluginCommands` (`Gvr`), and dynamic workflow commands.
4. It concatenates sources in this order: skill-directory commands, workflows, plugin command files,
   plugin skills, bundled skills, built-in-plugin skills, then terminal built-ins.
5. `dropShadowedFallbackSkills` (`zae`) removes fallback skills when a real plugin, bundled, or MCP
   implementation with the same suffix exists.
6. `filterPluginAliasCollisions` (`cQb`) removes plugin aliases that would steal protected names, and
   the final list is recorded for attribution and cached by the environment/settings key.

**Why this approach:**
- Source failures are independent, so recovery is graceful and built-in support commands remain
  usable when customization is malformed.
- User and project customizations precede terminal built-ins, allowing an exact custom command name to
  win without allowing a loose alias to hijack another exact name.
- A single ordered catalog keeps menu, parser, Skill tool, and remote projections consistent.
- The trade-off is subtle precedence: changing concatenation order changes behavior even if every
  descriptor is unchanged. Caching improves startup cost but requires explicit invalidation after
  plugin or skill changes.

**Key insight:** Precedence is a property of catalog assembly plus exact-first lookup, not of a numeric
priority field on each command.

### Working-directory overlays and scoped names

**What it does:** Adds commands discovered for the active directory without allowing nested
`.claude/skills` entries to silently replace the base catalog.

**How it works:**
1. `resolveCommandsForWorkingDirectory` (`b0`, `:526672-526721`) starts from the cached base catalog and
   filters descriptors by availability and `isEnabled`.
2. It obtains additional dynamic/path-sensitive skills and records the base names, aliases, and skill
   roots already present.
3. A dynamic skill with the same `skillRoot` as a base skill is dropped as a duplicate.
4. An unambiguous nested skill is inserted before the first terminal built-in. If its unqualified name
   collides, `scopeSkillToDirectory` (`lQb`, `:526746-526755`) rewrites the canonical name to
   `<relative-path>:<name>`, removes aliases, and explains the scope in the description.
5. Fallback entries are admitted only when neither a base name nor another dynamic entry owns that
   name.
6. The merged list is passed through fallback-shadow removal again.

**Why this approach:**
- Directory-aware skills must be close to the files they govern, but silently replacing a global skill
  would make invocations depend on cwd in an invisible way.
- Namespacing only on collision preserves short names for the common case while retaining both
  implementations in ambiguous cases.
- Inserting overlays before built-ins preserves customization precedence. It also means ordering is
  security-sensitive and must be kept deterministic.

**Key insight:** The runtime resolves path scope by rewriting identity, not by attaching an invisible
priority predicate to two commands with the same name.

### Exact-name-first alias resolution

**What it does:** Resolves an invocation to a descriptor while ensuring a real command name always
beats another command's alias.

**How it works:**
1. `findCommand` (`WH`, `:379869-379877`) scans the ordered list once.
2. It returns immediately when `descriptor.name === requestedName`.
3. During that scan it remembers only the first match from `userFacingName()` or `aliases`.
4. If no exact canonical name appears anywhere, it returns the remembered fallback.
5. `getCommandOrThrow` (`nwt`) wraps this lookup and reports the available names and aliases for
   internal call sites that require a result.

**Why this approach:**
- A two-pass conceptual rule is implemented in one physical scan: exact names are authoritative, while
  aliases remain convenient fallbacks.
- It avoids building and synchronizing a second alias map when command arrays change dynamically.
- Lookup is O(number of commands), but command lists are small enough that predictable precedence is
  more valuable than a hash-table optimization.

**Key insight:** An alias encountered near the start of the list never prevents a later exact name from
winning.

## Surface projection and the 2.1.221 repair

### Non-interactive eligibility projection

**What it does:** Derives the headless command surface from the main catalog without exposing UI-only
commands.

**How it works:**
1. `isNonInteractiveCommand` (`G3p`, `:526919-526920`) accepts prompt descriptors unless
   `disableNonInteractive` is set.
2. A `local` descriptor is accepted only when `supportsNonInteractive` is true.
3. `local-jsx` descriptors are excluded because their completion contract is an Ink callback rather
   than a textual result.
4. `filterCommandsForHeadless` (`b8e`) returns an empty set when slash commands are globally disabled;
   otherwise it applies the predicate to the already-resolved catalog.
5. If a UI command nevertheless reaches dispatch in a headless host, `dispatchResolvedSlashCommand`
   returns an explicit “opens an interactive panel” result rather than hanging on an unresolved UI
   promise (`:481120`).

**Why this approach:**
- One catalog prevents interactive and SDK command semantics from drifting.
- Projection at the edge is simpler than maintaining a parallel registry.
- The defensive dispatch check covers callers that bypass normal projection, at the cost of duplicating
  one eligibility rule at the execution boundary.

**Key insight:** Headless support is descriptor capability plus a final fail-safe, not a different
command implementation.

### Terminal-only name yielding in headless sessions

**What it does:** Lets plugin- and organization-delivered skills use names such as `/help` and
`/feedback` when the terminal-only built-in with that name cannot run in the current non-interactive
session.

**How it works:**
1. `filterPluginAliasCollisions` builds a set of names and aliases that plugin aliases may not claim.
2. In 2.1.220 every non-plugin command contributed all of its names, including terminal-only `help` and
   `feedback`.
3. In 2.1.227 the function detects `isNonInteractiveSession && !isNonInteractiveCommand(command)`.
4. If that unavailable command's name or alias is in `HEADLESS_YIELDABLE_NAMES` (`Aya` = `help`,
   `feedback`), it does not reserve the name.
5. Plugin aliases colliding with all other available or protected names are still removed.
6. The exact-name-first resolver then reaches the delivered skill rather than an unavailable terminal
   surface.

**Why this approach:**
- Removing the terminal command globally would alter interactive behavior; yielding only during catalog
  preparation for headless sessions keeps the change local.
- A two-name allow-set is conservative. General “unavailable commands never reserve names” behavior
  could expose surprising or unsafe aliases when a command is disabled for policy rather than UI
  reasons.
- The trade-off is a special-case set that must be updated when more terminal-only built-ins need the
  same behavior.

**Key insight:** The 2.1.221 fix changes collision ownership, not the prompt skill loader or the parser.

## Parse, normalize, and dispatch

### Slash syntax and subcommand normalization

**What it does:** Converts raw input into a canonical command name and argument string, including MCP
URI templates and colon-addressed subcommands.

**How it works:**
1. `parseSlashCommand` (`yEe`, `:480140-480149`) separates `/name` from the remaining text and marks MCP
   forms specially.
2. A malformed slash becomes ordinary user text in non-interactive mode, but produces command-syntax
   feedback in the terminal.
3. MCP URI-template syntax is matched against registered template commands before ordinary lookup.
4. `findCommand` resolves the initial name and `isEnabled` is applied. Disabled descriptors are treated
   as absent at this stage.
5. If no command matches and arguments exist, the first argument token is retried as a colon namespace:
   `/parent child rest` becomes lookup of `parent:child` plus `rest`.
6. A descriptor-level subcommand route can redirect to a dedicated target name; the dispatcher records
   the consumed route for telemetry and preserves any local-review fallback warning.
7. Unknown command handling avoids misclassifying an absolute filesystem path, computes a bounded
   Damerau-Levenshtein suggestion, and returns text appropriate to interactive or headless hosts.

**Why this approach:**
- Canonicalization before execution makes downstream dispatch independent of how the user spelled a
  subcommand or alias.
- Colon names keep the registry flat while providing hierarchical command UX.
- Falling back to user text for path-like inputs prevents `/var/...` and similar prompts from being
  swallowed as typos.
- Multiple normalization stages increase complexity, but each resolves a different namespace:
  URI templates, aliases, colon subcommands, and descriptor routes.

**Key insight:** The command that is instrumented and dispatched can differ from the token originally
typed, but resolution preserves both raw input and canonical identity.

### Type-directed command dispatch

**What it does:** Executes the resolved descriptor according to its `local-jsx`, `local`, or `prompt`
contract and converts all outcomes into main-loop messages.

**How it works:**
1. `dispatchResolvedSlashCommand` (`I5b`, `:481064-481400`) rechecks enablement and skill overrides at
   the execution boundary.
2. Non-user-invocable prompt skills return a message instructing the user to ask Claude to invoke the
   skill; they are not silently executed.
3. `local-jsx` resolves a lazy component loader, mounts the returned UI, and settles a promise when the
   component callback completes. Headless callers receive a textual refusal.
4. `local` loads a call module and handles typed results: `skip`, `compact`, `query`, or ordinary text.
   Sensitive arguments are replaced with `***` in the persisted command echo.
5. `prompt` first executes `UserPromptExpansion` hooks. It then chooses inline versus fork context,
   applies effort/tool settings, and turns the prompt into user/meta messages for the main query loop.
6. Abort and exception paths produce distinct telemetry and transcript-safe result messages.
7. The outer `processSlashCommand` (`x5b`) performs sanitized attribution, decides whether a synthetic
   command boundary is needed, and returns model/tool/effort overrides to the caller.

**Why this approach:**
- Typed results avoid making every local command understand transcript serialization.
- Rechecking policy at dispatch protects against catalog staleness after settings changes.
- Prompt commands reuse the main agent loop while local commands remain deterministic host actions.
- The common result envelope is flexible, but the dispatcher is necessarily branch-heavy because UI,
  state mutation, compaction, and model prompts have different lifecycles.

**Key insight:** A slash command is not automatically a model prompt; the descriptor type is the hard
boundary between host UI, deterministic local work, and agent execution.

### Bounded stacked prompt expansion

**What it does:** Allows compatible prompt skills to be chained in one input without recursively
executing arbitrary command types.

**How it works:**
1. `peelStackedPromptCommands` (`$1p`, `:481405-481442`) repeatedly trims the remaining arguments and
   looks for a leading slash command.
2. It stops at the fixed stack cap `D1p`; any remainder stays ordinary arguments and a warning is added.
3. Each candidate must resolve to an enabled, user-invocable `prompt` command.
4. Fork-context commands, dynamic-context commands, commands whose arguments may themselves contain
   slash commands, disabled skills, and non-prompt commands terminate peeling.
5. An optional predicate can consume a command without appending it, which supports special caller
   routing while still advancing the parser.
6. The base prompt expands first. Every peeled command independently runs expansion hooks, contributes
   messages, and merges allowed tools, denied tools, model, and effort into the result.

**Why this approach:**
- Iteration with a cap avoids recursive parser growth and denial-of-service inputs.
- Restricting the feature to context-free inline prompt commands makes composition associative enough
  to reason about.
- Merging policy outputs is powerful, but later commands can replace model/effort while tool lists are
  accumulated; callers must understand that order matters.

**Key insight:** “Stacking” is a guarded prompt-composition algorithm, not generic command piping.

### Isolated fork-context prompt execution

**What it does:** Runs a prompt command in a dedicated agent context when the descriptor requests
`context: "fork"` or dynamically selects fork mode.

**How it works:**
1. The prompt branch runs `UserPromptExpansion` and `UserPromptSubmit` hooks before spawning so policy
   can block or add context.
2. `executeForkedSlashCommand` (`k5b`, `:480606-480815`) derives a sanitized telemetry name and decides
   whether the fork is foreground or background.
3. It materializes the skill prompt, context layers, allowed/denied rules, base agent, file-history
   snapshot, and an optional frozen deny list.
4. Background mode registers an agent task and returns an agent reference immediately.
5. Foreground mode streams agent events into progress messages but suppresses transport-only metrics and
   spinner controls.
6. On completion it summarizes output, records the invocation, settles the turn boundary, executes Stop
   hooks, and clears progress state.
7. Abort and error branches preserve the user's command message and settle the same cleanup boundaries.

**Why this approach:**
- A separate agent prevents a large specialist skill from contaminating the parent conversation while
  still inheriting the relevant context and permissions.
- Sharing the file-history snapshot preserves edit coherence.
- Foreground and background share prompt materialization, reducing semantic drift, at the price of a
  sizeable orchestration function.

**Key insight:** Fork-context skills are full agent executions with transcript and policy boundaries,
not prompt text wrapped in a cosmetic subagent label.

## Autocomplete ranking and rendering

### Slash-menu candidate ranking

**What it does:** Produces a stable, useful command menu for an empty slash and a relevance-ranked list
for a typed query.

**How it works:**
1. `buildSlashMenuSuggestions` (`S1l`, `:834318-834437`) rejects non-command input and inputs that have
   moved into free-form arguments.
2. For bare `/`, it filters hidden/off commands, selects up to five prompt commands by decayed usage
   score, then groups the remainder by local, user/local settings, project settings, policy settings,
   and other sources. Each group is alphabetized.
3. For a query, `getCommandFuzzyIndex` (`CHv`) builds or reuses a Fuse index weighted toward canonical
   name, display name, segmented name parts, aliases, and finally description terms.
4. Results are re-sorted by explicit product rules: exact name, exact alias, shortest prefix, alias
   prefix, quantized Fuse score, then decayed usage.
5. A hidden exact match is included only when no visible command owns the same name. This permits direct
   discovery of intentionally hidden commands without duplicating a visible entry.
6. The suggestion records retain the query and matched alias so selection can insert the correct
   spelling and rendering can emphasize the match.

**Why this approach:**
- Pure fuzzy score often ranks a popular description match above an exact command prefix. The explicit
  sort ladder preserves user expectations.
- Usage boosts make bare `/` personal without permanently locking old choices at the top: the score
  halves every seven days and has a 10% floor.
- Caching Fuse avoids rebuilding an index on each keystroke; invalidation is tied to command-array
  identity.
- The trade-off is a complex comparator, but every tier encodes a visible UX promise.

**Key insight:** Fuzzy search finds candidates; deterministic product rules, not Fuse alone, decide the
final order.

### Unicode-safe match highlighting and selected-row color

**What it does:** Renders query hits without recoloring every match or splitting emoji/accented
graphemes, while keeping the selected row visually distinct.

**How it works:**
1. `findHighlightRanges` (`Gsm`, `:740147-740165`) first searches for a contiguous lowercase substring;
   otherwise it constructs ordered subsequence ranges. `contiguousOnly` disables the second mode for
   description text.
2. The lowercase-length guard remains: when Unicode case folding changes UTF-16 length, the function
   returns no highlight ranges rather than risk mapping indices to the wrong original units.
3. New in 2.1.227, every range passes through `expandRangesToGraphemes` (`qsm`, `:740302-740316`). For
   non-Latin-1-ish text it obtains grapheme start offsets from the shared `Intl.Segmenter`, expands each
   start/end to enclosing boundaries, and merges overlap.
4. `renderHighlightedText` (`AZt`, `:740166-740214`) renders all spans in the row's inherited color.
   Matched spans use `bold`; unmatched spans are dim only when the row is not selected.
5. `renderSuggestionRow` (`Vsm`) chooses the `suggestion` color only for the selected row (unless an
   item explicitly supplies a color) and passes `isSelected` through to text rendering.
6. The same row renderer handles commands, files, MCP resources, agents, emoji, source lanes, and
   wrapped descriptions, so the fix applies consistently.

**Why this approach:**
- ANSI recoloring made several matches look selected at once. Bold preserves match information while a
  single blue row communicates navigation state.
- JavaScript slice offsets are UTF-16 code units; a fuzzy range can land inside an emoji sequence or a
  base-character/combining-mark cluster. Expanding only when text crosses a quick character-class test
  avoids Segmenter cost for ordinary ASCII names.
- Returning no highlight on unstable case-fold length favors intact text over imperfect emphasis.
- Grapheme expansion can bold slightly more than the exact code point match, but that is the correct
  user-perceived character.

**Key insight:** The 2.1.227 fix separates two semantics that 2.1.220 conflated: bold means “matched,”
and blue means “selected.”

## Relaunch safety and `/tui`

### Explicit resume-leaf persistence before renderer relaunch

**What it does:** Ensures switching renderers resumes from the conversation state currently visible,
including the state “rewound before the first message.”

**How it works:**
1. `/tui` validates `default|fullscreen`, handles background/screen-reader restrictions, refuses a real
   switch while local work is active, and saves the user setting.
2. Before feedback UI or process relaunch, it now calls `persistResumeLeafBeforeRelaunch` (`W6t`,
   `:485928-485936`) with the current in-memory messages.
3. The helper selects the last durable user **or assistant** message using `isPersistableMessage`
   (`SEe`), excluding progress and ignorable empty attachments.
4. If a durable conversational message exists, `appendExplicitSessionLeaf` (`jDr`) writes a
   `last-prompt` record whose `leafUuid` is that message.
5. If none exists but the transcript file/backend has bytes, it writes the same explicit record with
   `leafUuid: null`.
6. Relaunch then uses `--resume <session-id>`. The explicit leaf controls reconstruction, so a stale
   pre-rewind leaf is not inferred from older transcript content.

**Why this approach:**
- 2.1.220 searched only for the last durable **user** message and wrote nothing if none existed. After a
  rewind before the first message, `/tui` therefore left the earlier persisted leaf active and the
  relaunched renderer resurrected the removed conversation.
- Reusing a shared relaunch helper also covers restart/update paths and centralizes transcript/backend
  fallback behavior.
- Persisting `null` is an explicit tombstone-like boundary. It is safer than deleting transcript bytes,
  because history remains recoverable while normal resume honors the current empty branch.

**Key insight:** Correctly representing “no current message” requires writing state; skipping the write
means “keep the previous leaf,” which is a different operation.

## Revalidated 2.1.220-owned command surfaces

### Conditional `/fork` and `/subtask` registry branch

**What it does:** Chooses between legacy in-conversation fork semantics and the newer background-session
`/fork` plus `/subtask` pair.

**How it works:**
1. The 2.1.227 bundle still contains two descriptors named `fork` (`:484278-484296`) and one named
   `subtask` (`:484323-484332`).
2. `buildBuiltinCommandTable` (`rQb`, `:526444-526576`) evaluates the agent-view/fleet gate and demo
   flag.
3. When the fleet surface is available, it inserts the background-session `/fork` descriptor and the
   in-conversation `/subtask` descriptor.
4. Otherwise it inserts only the legacy `/fork` descriptor, whose handler spawns the inherited-context
   subagent.
5. The newer `/fork` has no local loader on the descriptor and is resolved by the central lazy dialog
   table; legacy `/fork` and `/subtask` retain explicit lazy loaders.
6. All three are disabled in coordinator mode.

**Why this approach:**
- The background-session implementation depends on the agent-view infrastructure. Keeping the legacy
  implementation provides a functional fallback when that infrastructure is disabled.
- A registry-time branch prevents an unusable command from appearing in the menu.
- The cost is semantic variation within the same version: `/fork` can mean two different operations
  depending on the gate.

**Key insight:** The conditional swap documented in 2.1.220 is still architecture, not retired migration
code, in 2.1.227.

### Diagnostic surface separation

**What it does:** Keeps read-only installation diagnostics available as `claude doctor` while exposing a
model-assisted, proposal-and-confirmation cleanup workflow as `/doctor`.

**How it works:**
1. The Commander subcommand at `:965533-965542` lazily invokes the text-mode doctor handler.
2. The handler gathers install type, version, path, ripgrep, updater state, invalid settings,
   environment-variable issues, duplicate installs, Remote Control checks, and warning/fix pairs, then
   writes a deterministic report and exits (`:670380-670472`).
3. The `/doctor` descriptor is still a bundled prompt skill with alias `checkup`, workspace requirement,
   `userInvocable: true`, and `disableModelInvocation: true` (`:876408-876432`).
4. `survivesBundledKillSwitch` adds the descriptor object to an identity set during registration; when
   bundled skills are disabled, `/doctor` survives while ordinary bundled content is removed.
5. The 2.1.227 prompt retains propose-before-write rules and expands the audit across installation,
   unused extensions, memory files, slow hooks, version, auto mode, and conservative read-only
   pre-approvals.
6. The CLI report ends by directing users to `/doctor` for fixes, preserving the boundary between
   deterministic diagnosis and agent-assisted remediation.

**Why this approach:**
- Installation diagnosis must work even when the interactive app or bundled skills are unhealthy.
- Remediation needs conversation, user confirmation, and project context, making a prompt skill the
  better surface.
- `disableModelInvocation` prevents Claude from starting a broad configuration audit without an
  explicit user slash command.
- The identity-based kill-switch survivor is intentionally non-configurable; admins cannot accidentally
  grant the exemption to an arbitrary same-named skill.

**Key insight:** `claude doctor` and `/doctor` share a problem domain but deliberately have different
trust and mutation boundaries.

## 2.1.220-to-2.1.227 assessment

| Change | Verdict | Exact mechanism |
|---|---|---|
| 2.1.221 terminal-only built-in name collision | Verified delta | `cQb` gains non-interactive eligibility plus `Aya = {help, feedback}` yielding at `:526767-526783`, `:527178` |
| 2.1.227 selected-row/match styling | Verified delta | `AZt` keeps inherited color and bolds matched spans; `Vsm` supplies selection color at `:740166-740214`, `:740404-740536` |
| 2.1.227 emoji/accent glyph preservation | Verified delta | new `qsm` grapheme-boundary expansion at `:740302-740316` |
| 2.1.227 `/tui` rewind resurrection | Verified delta | old last-user-only write replaced by `W6t(messages)`; explicit null leaf fallback at `:485928-485936`, call at `:821588` |
| `/fork`/`/subtask` conditional registry | Revalidated carryover | descriptors `:484275-484332`, registry branch `:526453` |
| `claude doctor` versus `/doctor` split | Revalidated and evolved | deterministic CLI `:670380-670472`; bundled skill `:876408-876432` |
| Core parser, exact-first lookup, type dispatcher | Revalidated carryover with refactoring | `WH`, `x5b`, `I5b`; architecture remains the same despite 2.1.227 remangling and new routes |

The four direct 2.1.221/2.1.227 changes are narrow but attach to shared boundaries. The alias change
modifies catalog ownership, the menu change modifies a renderer shared with non-command suggestions,
and the `/tui` fix modifies the durable session leaf used by relaunch. These are higher-leverage changes
than their changelog wording suggests.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `assembleCommandCatalog` (`sQb`) and `resolveCommandsForWorkingDirectory` (`b0`) - catalog and scope.
- `filterPluginAliasCollisions` (`cQb`) and `findCommand` (`WH`) - identity and precedence.
- `parseSlashCommand` (`yEe`), `processSlashCommand` (`x5b`), and
  `dispatchResolvedSlashCommand` (`I5b`) - invocation pipeline.
- `peelStackedPromptCommands` (`$1p`) and `executeForkedSlashCommand` (`k5b`) - prompt composition.
- `buildSlashMenuSuggestions` (`S1l`) and `getCommandFuzzyIndex` (`CHv`) - discovery and ranking.
- `findHighlightRanges` (`Gsm`), `expandRangesToGraphemes` (`qsm`), and
  `renderHighlightedText` (`AZt`) - 2.1.227 rendering repair.
- `persistResumeLeafBeforeRelaunch` (`W6t`) and `appendExplicitSessionLeaf` (`jDr`) - `/tui` state repair.
