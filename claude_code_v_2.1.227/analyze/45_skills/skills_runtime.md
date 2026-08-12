# Skills runtime in 2.1.227

The 2.1.227 skill system is a lazy command compiler. It discovers `SKILL.md` files from several trust
scopes, normalizes their metadata into one prompt-command object, advertises only safe summaries to the
model, and expands the full body only after an invocation passes policy and permission checks. The same
object can execute inline or seed a forked agent.

## 1. Parsing and normalization

### Frontmatter capability normalization

**What it does:** Converts permissive YAML frontmatter into a stable runtime command while keeping user
errors local to the affected capability.

**How it works:**
1. The shadow schema recognizes display, tool, argument, visibility, effort, shell, `paths`, hook,
   execution-context, agent, background, fallback, and metadata fields.
2. `parseSkillFrontmatterFields` (`RGo`) derives a description from explicit metadata or the Markdown
   body, defaulting `user-invocable` to true.
3. Tool declarations accept a comma-separated string or YAML array and are normalized into canonical
   rule strings.
4. `model: inherit` becomes no override; other model aliases are normalized. Invalid effort values are
   reported and ignored rather than preventing the skill from loading.
5. Hooks are validated against the shared hook schema. Invalid hooks are dropped while the skill body
   remains available.
6. Only `context: fork` changes the execution context; missing, null, or `inline` all compile to inline.
7. Loose booleans are coerced for model/user invocation, background, and fallback behavior.
8. `createSkillCommand` (`Lkr`) substitutes skill/project directory variables in tool rules and records
   body length plus a content hash for later disclosure and reinvocation logic.

**Why this approach:**
- Older and third-party skills use several YAML scalar shapes, so tolerant normalization preserves
  compatibility.
- A bad optional effort or hook should not erase otherwise useful instructions.
- Reducing fields to one command representation lets filesystem, plugin, bundled, and MCP sources share
  invocation code.
- Tolerance can conceal author mistakes, so schema-shadow telemetry and explicit warnings retain
  diagnostics without turning them into fatal startup failures.

**Key insight:** Validation is capability-granular. A malformed optional power is removed; the skill is
not granted that power and the instruction body need not disappear.

Evidence: skill shadow schema at `cli_inner_pretty.js:122963-123114`; `RGo` and `Lkr` at
`376012-376179`.

### Argument, variable, and shell-output expansion

**What it does:** Renders a skill body for one invocation while preserving unmatched placeholders and
requiring every embedded shell command to pass ordinary Bash/PowerShell permission checks.

**How it works:**
1. `expandSkillArguments` (`ASt`) shell-splits the raw argument string and orders named parameters from
   longest to shortest to prevent prefix capture.
2. It temporarily masks escaped dollars before replacing named `$name`, `$ARGUMENTS[n]`, `$n`, and the
   whole `$ARGUMENTS` token.
3. Missing indexed arguments are restored verbatim. If the body used no placeholder, nonempty arguments
   are appended in an `ARGUMENTS:` block.
4. Source-specific escaping removes internal sentinels and neutralizes Markdown shell markers in values.
5. The prompt renderer expands `${CLAUDE_SKILL_DIR}`, `${CLAUDE_PROJECT_DIR}`,
   `${CLAUDE_SESSION_ID}`, and the resolved `${CLAUDE_EFFORT}`.
6. `executeSkillShellBlocks` (`D5e`) extracts fenced or inline `!` commands and chooses the declared
   shell, with an explicit Git Bash requirement on Windows.
7. Each block receives a distinct synthetic tool-use ID, runs through the normal shell permission check,
   and executes only on `allow`.
8. Successful stdout/stderr replaces the exact source marker; interruption, denial, and execution error
   abort rendering with a bounded explanation.

**Why this approach:**
- Preserving unmatched placeholders lets nested scripts or later tools consume them instead of silently
  deleting author intent.
- Longest-name-first replacement removes ambiguity between parameters such as `$file` and `$filename`.
- Reusing shell-tool authorization prevents skill frontmatter from becoming a permission bypass.
- Parallel shell expansion reduces latency, but it means authors must not depend on textual block order
  for side effects.

**Key insight:** `allowed-tools` can pre-authorize a matching command rule for prompt rendering, but the
embedded command still travels through the same permission engine as a normal tool call.

Evidence: `ASt` at `cli_inner_pretty.js:215242-215281`; prompt expansion in `Lkr` at
`376135-376177`; `D5e` at `375873-375902`.

## 2. Discovery and precedence

### Multi-scope discovery, bounds, and canonical deduplication

**What it does:** Builds a deterministic skill set from managed, user, synced, project, ancestor, legacy
command, plugin, MCP, and bundled sources without loading the same physical file twice.

**How it works:**
1. `loadSkillDirectory` (`j9t`) accepts only directory/symlink entries whose child `SKILL.md` is a regular
   file no larger than the configured limit.
2. A transient empty `/mnt` read is retried once after 250 ms to handle mount races.
3. Reserved sync-owned directory names and explicitly disabled user-plugin projections are skipped.
4. Each valid file is parsed independently; failures are logged and do not cancel sibling loads.
5. `loadSkillDirectorySet` (`Dob`) loads sources concurrently in the order managed, user, synced,
   project, nested-project, and deprecated commands.
6. A synced skill loses to any local skill with the same name.
7. Realpaths are resolved and identical physical files are deduplicated, protecting against symlink or
   multi-source aliases.
8. The combined command catalog adds plugin, MCP, bundled, and built-in commands, then applies fallback,
   name, and alias collision filters.

**Why this approach:**
- Concurrent scanning keeps startup cost bounded by the slowest scope rather than their sum.
- File-size and type checks prevent named pipes, devices, or oversized instructions from blocking load.
- Realpath deduplication addresses identity; name precedence separately addresses user intent.
- Partial loading improves availability, at the cost of a catalog that can omit only the failing source
  instead of failing loudly as a whole.

**Key insight:** “Same name” and “same file” are different conflicts. The loader resolves both, using
scope policy for the former and canonical filesystem identity for the latter.

Evidence: `j9t` at `cli_inner_pretty.js:376361-376479`; `Dob` at `376628-376699`; source assembly
through `nQb` and `sQb` at `526595-526670`.

### Directory-scoped and conditional activation

**What it does:** Discovers skills near files being touched and activates `paths:`-conditional skills
without paying their catalog/context cost before they become relevant.

**How it works:**
1. `discoverNestedSkillDirs` (`Pob`) walks from a touched file's directory toward the workspace root and
   probes each ancestor's `.claude/skills` directory once.
2. Gitignored directories, sync-owned resolved paths, backup-like `~N` paths, and locations outside the
   workspace boundary are rejected.
3. `loadDynamicSkills` (`kXs`) parses new directories and stores skills under a key containing both the
   skill root and name, so same-named nested skills remain distinct.
4. Initial `paths:` skills are withheld in a conditional map unless already activated.
5. `activateConditionalSkills` (`Mob`) converts touched absolute paths to workspace-relative paths and
   rejects escape paths.
6. It matches the normalized patterns with the shared ignore/glob engine; the first match moves the
   skill permanently into the dynamic catalog for the session.
7. Newly discovered names are emitted as a dynamic attachment only if the directory is an absolute
   descendant of the working directory and its rendered relative name passes safety filtering.
8. When names collide, nested skills are exposed as `subdir:name`, with descriptions explaining their
   file scope; a unique unqualified name remains unmodified.

**Why this approach:**
- File-local workflows should appear only when work enters their subtree.
- Monotonic activation avoids a skill disappearing midway through a task after the model has relied on
  it.
- Root-qualified collision names preserve both capabilities without unpredictable last-writer wins.
- Walking ancestors on file operations adds I/O, so probed directories are cached and excluded domains
  are rejected early.

**Key insight:** `paths:` is an activation trigger, not a per-call authorization filter. Once a matching
file is touched, the skill remains available for coherent session behavior.

Evidence: `Pob`, `kXs`, and `Mob` at `cli_inner_pretty.js:376749-376868`; directory scoping at
`526672-526759`; dynamic disclosure at `584675-584690`.

### Plugin-skill ingestion and collision policy

**What it does:** Converts every enabled plugin's configured skill locations into namespace-qualified
commands while isolating failures and preventing a user-level projection from being loaded twice.

**How it works:**
1. `loadPluginSkillPath` (`hfd`) first checks for a root `SKILL.md`; if absent, it scans immediate child
   directories for one.
2. Files must be regular and at most 1 MiB; per-plugin realpath tracking suppresses repeats across custom
   paths.
3. A root skill may provide its name in frontmatter; invalid name characters are replaced. Child skills
   inherit their directory name.
4. `createPluginSkillCommand` (`Mmn`) prefixes the canonical name with the plugin name and permits an
   unprefixed alias only for a valid frontmatter name.
5. Plugin variables and user config are expanded through plugin-owned substitution helpers; skill mode
   additionally exposes the skill directory.
6. Hooks are accepted only for actual plugin-skill mode and validated before attachment.
7. `loadPluginSkills` (`yfd`) processes enabled plugins concurrently. An error in one path produces an
   empty result for that path, not for other plugins.
8. Canonical paths already surfaced by the user skill loader are removed, then remaining plugin skills
   are deduplicated by realpath.
9. Final catalog filtering removes plugin aliases that collide with any other command and drops thin
   fallback skills when a canonical plugin/MCP suffix exists.

**Why this approach:**
- Namespacing makes plugin provenance explicit and avoids global-name capture.
- The optional alias preserves ergonomics only when it is unambiguous.
- User-loader ownership prevents an installed plugin projected into the user skills folder from appearing
  twice with different identities.
- Failure isolation favors a usable partial plugin catalog over all-or-nothing startup.

**Key insight:** The plugin name is the stable authority boundary; unqualified aliases are conveniences
that are automatically revoked on collision.

Evidence: `Mmn`, `hfd`, and `yfd` at `cli_inner_pretty.js:245418-245835`; alias and fallback filtering
at `526767-526803`.

## 3. Disclosure and invocation

### Lazy model disclosure

**What it does:** Shows the model a searchable catalog of eligible skill names and summaries without
putting every `SKILL.md` body into the prompt.

**How it works:**
1. `isSkillToolEligible` (`Qot`) requires a prompt command that is neither model-disabled nor otherwise
   hidden by the runtime kill switch.
2. Built-in, bundled, local skill-directory, and legacy-command sources are eligible directly.
3. Other sources need an explicit description or `when_to_use`, preventing opaque prompts from being
   advertised to the model.
4. User-only slash skills remain available to the slash-command surface but are absent from the Skill
   tool catalog.
5. The prompt attachment renders only name/description metadata as “available skills.”
6. Full Markdown is expanded only by `getPromptForCommand` after the model or user chooses one.
7. Dynamic discoveries append only the newly safe names; they do not replay the complete catalog.

**Why this approach:**
- Lazy bodies avoid a context tax proportional to every installed skill.
- Requiring descriptive metadata makes tool selection meaningful and reduces accidental invocation.
- Separate model and user catalogs implement `disable-model-invocation` without making the slash command
  unusable.
- The model cannot inspect unadvertised bodies proactively, trading discoverability for context and
  authority control.

**Key insight:** Skill discovery is metadata disclosure; skill invocation is instruction disclosure. The
runtime deliberately separates those events.

Evidence: `Qot` and catalog filters at `cli_inner_pretty.js:526816-526867`; prompt attachment at
`584664-584690`.

### Invocation authorization and permission rules

**What it does:** Rejects unauthorized or ambiguous Skill-tool calls before rendering their bodies or
executing embedded commands.

**How it works:**
1. The Skill tool trims an optional slash prefix, materializes remotely synced skills when applicable,
   and resolves the name/alias against the complete current catalog.
2. Unknown names receive directory-scoped alternatives first, then a bounded edit-distance suggestion.
3. A forked skill cannot invoke itself from the child context; the child is told to execute the already
   supplied body directly.
4. `authorizeSkillInvocation` (`KIn`) rejects model invocation for `disable-model-invocation` and tells
   the model to ask the user rather than recreate the workflow.
5. Main sessions apply the host skills allowlist and per-skill overrides/kill switches.
6. Non-prompt CLI/UI commands and MCP prompts masquerading as local skills are rejected.
7. Deny rules are checked using Skill-wide, canonical skill, command-name, display-name, and alias
   patterns.
8. Permission checking gives deny precedence over allow. A skill with no meaningful capability fields is
   auto-allowed; otherwise the user is asked and may save exact-name or name-plus-arguments rules.

**Why this approach:**
- Authorization before body rendering prevents denied instructions or shell markers from entering the
  active context.
- Deny-first ordering is fail-safe when rules overlap.
- Exact and wildcard persistence gives users separate authority over a workflow and all its arguments.
- Auto-allowing instruction-only skills avoids unnecessary prompts, while capability-bearing skills
  retain an explicit consent boundary.

**Key insight:** `disable-model-invocation` is not merely menu visibility. It is enforced at dispatch and
the refusal explicitly forbids the model from cloning the reserved workflow.

Evidence: `KIn` at `cli_inner_pretty.js:544897-544943`; Skill tool validation and permissions at
`545289-545432`.

### Inline context layering and reinvocation elision

**What it does:** Injects inline skill instructions for the current turn, applies temporary tool/model/
effort layers, and avoids duplicating byte-identical instructions already present in conversation
history.

**How it works:**
1. The Skill tool marks the active skill and delegates rendering to the shared slash-command processor.
2. Progress and recursive Skill-tool wrapper messages are removed from the injected message set.
3. `elideRepeatedSkillContent` (`ErS`) searches prior context for the rendered content and checks whether
   it survived as a normal message or a compaction attachment.
4. If the prior and current bodies are byte-identical, the new body is replaced with a short reminder
   carrying only new arguments.
5. If dynamic output or arguments changed the body, a reinvocation marker is prepended and the changed
   body remains.
6. If compaction retained only a truncated body, the full instructions are reintroduced.
7. Allowed tools, model override, and effort become context layers returned with the new messages; they
   are scoped by the surrounding turn/session context rather than mutating global defaults.
8. Attribution and telemetry record canonical source/provenance without exposing third-party repository
   names as official.

**Why this approach:**
- Repeated instruction bodies waste context and prompt-cache capacity.
- Byte equality is conservative: any dynamic shell output or argument expansion change preserves the new
  content.
- Compaction awareness prevents an elision marker from pointing at instructions no longer available.
- Context layers isolate a skill's execution policy but add lifecycle bookkeeping to message processing.

**Key insight:** Reinvocation is elided only when the exact rendered instructions are still recoverable;
the runtime never assumes that the same skill name means the same effective prompt.

Evidence: `ErS` at `cli_inner_pretty.js:545167-545193`; inline dispatch at
`545434-545526`.

### Forked and background skill execution

**What it does:** Runs `context: fork` skills in an isolated subagent and optionally converts the fork
into a durable background task whose result arrives later.

**How it works:**
1. `resolveCommandContext` (`W4o`) gives a dynamic `getContext` decision precedence over static
   frontmatter and otherwise defaults to inline.
2. `prepareForkedCommandContext` (`$En`) renders the body once, records invocation attribution, and
   freezes allowed/disallowed command policy where the skill requires replacement semantics.
3. It selects the requested agent definition or falls back to `general-purpose`, rejects the absence of
   any runnable agent, and removes partial read-state snapshots.
4. Non-MCP skills may extract prompt mentions/attachments into the child; MCP-backed content keeps its
   remote resource contract instead.
5. `executeForkedSkill` (`grS`) assigns a child agent ID/depth, resolves tools and optional skill effort,
   and adds skill hook/context layers.
6. When background policy resolves true, it launches through the durable background-agent path and
   returns immediately with the agent identity.
7. Otherwise it streams a synchronous subagent, forwards tool-use progress, suppresses internal state
   frames, and reduces final messages to result text.
8. Final cleanup unregisters the child in all synchronous terminal paths; deferred invocation recording
   occurs only after a background launch commits.

**Why this approach:**
- Forking protects the main conversation from long or specialized execution traces.
- Shared preparation keeps inline/fork policy consistent while allowing the fork to freeze permission
  denies against mid-run mutation.
- Background mode improves responsiveness but changes delivery to an eventual task notification.
- Extracting only relevant attachments reduces child context; MCP content stays remote to avoid
  pretending it is a local file tree.

**Key insight:** Background is a delivery policy layered on fork execution, not a third prompt context.
The same prepared skill prompt either streams to completion or commits to the background runtime.

Evidence: `W4o` at `cli_inner_pretty.js:364040-364042`; `$En` at `355352-355418`; `grS` at
`544995-545151`.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `parseSkillFrontmatterFields` (`RGo`) - Normalizes skill metadata.
- `createSkillCommand` (`Lkr`) - Compiles one skill into a prompt command.
- `loadSkillDirectorySet` (`Dob`) - Merges filesystem skill scopes.
- `activateConditionalSkills` (`Mob`) - Activates `paths:` skills.
- `authorizeSkillInvocation` (`KIn`) - Enforces model, host, settings, and permission policy.
- `executeForkedSkill` (`grS`) - Runs synchronous or background forked skills.
