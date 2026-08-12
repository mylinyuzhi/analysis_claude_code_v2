# Plugin usability and bundled prompt-audit changes

## Version result

Five 2.1.221 changelog items are independently visible as 2.1.220-to-2.1.227 window deltas:

- catalog-miss refresh/retry text and `refreshMarketplaceOnCatalogMiss` are target-only;
- the auto-activation telemetry and three-outcome activation result are target-only;
- Claude Desktop marketplace/plugin-name compatibility warnings are target-only;
- plugin `skills` accepts `.`/`./`, with two target-only root-level `SKILL.md` correction sites;
- the bundled `claude-api` skill contains a target-only `prompt-audit` subcommand and workflow.

These are related usability changes, not one shared algorithm. The first four change plugin runtime and
validation behavior; `prompt-audit` is versioned instructional content executed through the existing
skill mechanism.

### Refresh-on-miss Plugin Resolution

**What it does:** Gives a specifically requested plugin one fresh marketplace lookup before returning
“not found,” while avoiding unnecessary or policy-invalid network refreshes.

**How it works:**
1. `installPluginWithCatalogRecovery` (`pUf`, `:671024-671148`) parses the requested plugin and optional
   marketplace, then checks the current catalog.
2. A miss in a named marketplace calls `refreshMarketplaceOnCatalogMiss` (`hFr`, `:670916-670936`).
3. Refresh is ineligible for globally disabled updates, missing/non-refreshable sources, policy blocks,
   or sources whose update policy says not to refresh.
4. Eligible refresh uses the normal marketplace updater with `skipIfRecent`, then evicts the in-memory
   marketplace entry so the next lookup cannot reuse the stale parsed value.
5. A successful refresh triggers exactly one re-lookup. A failed refresh is recorded separately from a
   genuine post-refresh absence and the final message retains a manual update hint.
6. Unqualified searches do not refresh every configured marketplace; they continue searching only the
   currently readable refreshable catalogs.

**Why this approach:**
- Refreshing only after a miss keeps the normal installation path fast and cache-friendly.
- Scoping the retry to an explicitly named marketplace avoids turning one install command into N network
  updates.
- Reusing the normal updater preserves source authentication, locking, rate limiting, and policy checks.
- A single retry prevents an unavailable upstream from becoming an unbounded install loop. Its trade-off
  is that an unqualified stale catalog may still require the user to name or refresh the marketplace.

**Key insight:** The retry invalidates both the on-disk/upstream cache and the parsed in-memory entry. A
network refresh without eviction would still perform the second lookup against stale process state.

### Cache-safe Immediate Activation

**What it does:** Activates newly installed plugins in the current session when reloading their components
will not invalidate the conversation's prompt cache or produce load errors.

**How it works:**
1. Install UI paths collect the successfully installed, enabled plugin IDs; disabled-by-default and
   explicitly disabled plugins are reported but not treated as activation candidates.
2. `activatePluginsAfterInstall` (`JOm`, `:794269-794283`) delegates the safety decision to
   `attemptSafePluginActivation` (`PYE`, `:794285-794304`).
3. The attempt computes reload cache impact before changing active components. If the current prompt
   prefix would be invalidated, activation stops with `cache_impact`.
4. It refreshes plugin caches and resolves newly exposed dependencies. If dependency installation changed
   the set, cache impact is checked again before a second refresh.
5. Aggregate refresh failure or an error owned by one of the newly installed plugins becomes
   `refresh_failed` or `plugin_load_error`; only a clean result becomes `activated`.
6. All non-clean outcomes set `plugins.needsRefresh`. UI callers translate the result into “now active,”
   a targeted load-error message, or `/reload-plugins` guidance.

**Why this approach:**
- Immediate activation removes a surprising extra command for the common safe case.
- Cache impact is checked both before and after dependency resolution because dependencies can enlarge the
  active prompt/tool surface after the first check.
- The reload is attempted transactionally at the application-state layer; uncertainty falls back to the
  older explicit reload workflow.
- This is intentionally opportunistic. Preserving prompt-cache correctness and a coherent tool registry
  is more valuable than guaranteeing zero-reload installation.

**Key insight:** “Installed” and “safe to activate in this conversation” are distinct states. The new path
optimizes the second without weakening its cache and load-integrity gates.

### Cross-product Validation and Plugin-root Skills

**What it does:** Warns authors when names accepted by Claude Code will fail Claude Desktop managed sync,
and makes a plugin whose root itself is a skill expressible without an artificial wrapper directory.

**How it works:**
1. `validateMarketplaceManifest` (`Fja`, `:672754-672995`) first performs normal schema validation.
2. It compares marketplace and plugin names with Claude Desktop's reserved-name set and stricter
   `[A-Za-z0-9._-]`, alphanumeric-first, 128-character grammar.
3. Violations are warnings, not local errors: Claude Code can still consume the marketplace, while the
   message explains whether Desktop would reject the whole marketplace or drop one plugin entry.
4. The plugin skill-directory schema at `:56288-56302` accepts the ordinary `./path` form plus the exact
   `.` sentinel; descriptions state that `.`/`./` mean the plugin root.
5. Runtime component validation and `validatePluginManifest` (`CFr`, `:672571-672752`) detect a skills
   entry aimed directly at `SKILL.md`. They suggest the parent directory, with the special root fix `.`.

**Why this approach:**
- Local acceptance and managed Desktop distribution are different compatibility targets. A warning lets
  local-only authors proceed without hiding a deployment failure from marketplace publishers.
- `.` is modeled as a narrow schema alternative, not a relaxation that accepts arbitrary non-relative
  paths.
- Skills are directory resources, not individual Markdown files; correcting to the directory preserves
  sibling scripts/assets and the loader's trust boundary.
- The trade-off is a compatibility warning from a product the user may not target, but its wording makes
  that scope explicit.

**Key insight:** Validation distinguishes “invalid here” from “valid here but non-portable.” That lets the
CLI remain backward-compatible while making managed marketplace sync predictable.

### Bundled `prompt-audit` Workflow

**What it does:** Adds a non-interactive audit mode to the bundled `claude-api` skill for finding prompt,
skill, and tool-description patterns written for older model behavior.

**How it works:**
1. The target-only subcommand row is embedded in the bundled skill at `:886497` and routes directly to
   `shared/prompt-audit.md`.
2. The workflow establishes scope and target-model assumptions from the request/repository instead of
   pausing for clarification.
3. It inventories prompt-bearing surfaces, records provenance, and scans documented stale patterns.
4. It produces two deliverables: a finding report with `file:line`, rationale, and confidence, plus a
   proposed diff.
5. Edits are applied only when the invoking request explicitly asks for them; otherwise the audit remains
   read-only.
6. The same audit is referenced by the migration subcommand so model migration covers prompt behavior as
   well as API syntax.

**Why this approach:**
- Shipping the workflow as skill content allows its knowledge and checks to evolve without adding a new
  privileged runtime or executable parser.
- Non-interactive assumption reporting makes repository-wide audits batchable while keeping uncertainty
  visible in the result.
- Separating proposed changes from application supports review and prevents an audit request from
  silently rewriting prompts.
- Instructional workflows depend on model compliance more than a fixed AST linter would, but can reason
  about prose semantics and model-version context that syntax rules miss.

**Key insight:** `prompt-audit` is a new named workflow on an old skill engine. Its implementation is the
versioned audit protocol, not a new JavaScript command handler.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `refreshMarketplaceOnCatalogMiss` (`hFr`) - bounded eligible refresh attempt.
- `installPluginWithCatalogRecovery` (`pUf`) - stale-catalog retry and install resolution.
- `activatePluginsAfterInstall` (`JOm`) - activation outcome and fallback state.
- `attemptSafePluginActivation` (`PYE`) - cache-impact/dependency/load checks.
- `validatePluginManifest` (`CFr`) - path validation and root skill correction.
- `validateMarketplaceManifest` (`Fja`) - cross-product naming warnings.
