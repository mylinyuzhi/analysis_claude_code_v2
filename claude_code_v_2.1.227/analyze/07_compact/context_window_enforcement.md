# Context-window enforcement for native-1M and unknown models

## Version result

Two 2.1.223 changes are strongly anchored in the 2.1.227 target:

- `CLAUDE_CODE_DISABLE_UNKNOWN_MODEL_WINDOW_ENFORCEMENT` has four target sites and no baseline sites.
- The target emits a dedicated notice that an unrecognized model is kept within the assumed window; that
  message and its `source: "unknown-model"` decision do not exist in 2.1.220.

The native-1M change is a narrower delta: the target resolves native capability through the model catalog
instead of treating only a fixed user-facing model list as eligible for the 200K cap. The surrounding
catalog machinery already exists in 2.1.220; the changelog correctly describes a policy expansion, not a
new compaction engine.

### Model Recognition and Native-1M Detection

**What it does:** Determines whether a model is known, whether its underlying canonical model has a native
1M window, and whether provider routing actually supports that window.

**How it works:**
1. `isRecognizedModel` (`Pmr`, `:109405-109421`) canonicalizes aliases and checks the generated catalog,
   including model overrides where appropriate.
2. `findNative1mCatalogModel` (`e_f`, `:612611-612614`) first strips provider and option syntax, then tests
   the catalog's `context.native_1m`; it retries against the unstripped model because gateways may wrap a
   recognizable model ID.
3. `isNative1mCatalogModel` (`DIo`, `:612615-612617`) exposes the result as a predicate used by enforcement
   and warning paths.
4. Separate capability checks preserve provider constraints: Bedrock, Vertex, Foundry, and gateway routes
   must advertise the matching `native_1m_3p` capability before the full window is used.
5. Explicit `[1m]` syntax and the 1M beta header remain distinct opt-in signals; disabling 1M context
   suppresses them.

**Why this approach:**
- A catalog capability scales with model launches, while a fixed ID list silently misses the next native-
  1M entry.
- Provider-specific capability prevents a first-party model property from being assumed on every gateway
  mapping.
- Normalizing both wrapped and unwrapped IDs tolerates provider prefixes without treating arbitrary
  substrings as catalog entries.
- The trade-off is dependence on catalog freshness; unknown-model enforcement supplies a safe fallback
  when freshness fails.

**Key insight:** “The model family supports 1M” and “this route exposes 1M” are separate decisions. The
catalog records both, and the effective window requires agreement.

### Auto-compact Window Resolution

**What it does:** Selects the effective window within which compaction must occur, preserving explicit
administrator/user caps while preventing both native-1M and unknown models from bypassing enforcement.

**How it works:**
1. `resolveAutoCompactWindow` (`q3`, `:213719-213742`) canonicalizes the model and obtains the maximum
   plausible context window from `resolveModelContextWindow` (`Zw`).
2. `CLAUDE_CODE_AUTO_COMPACT_WINDOW` has highest precedence. Its parsed value is clamped to the maximum.
3. The explicit `autoCompactWindow` setting is next, also clamped.
4. Server/client-data overrides and experiments follow. These can tune a model or surface without a new
   client release but cannot expand beyond the resolved maximum.
5. Native-1M models subject to the disable-1M policy receive the standard 200K boundary (`Bbe`); catalog
   detection makes this apply to every matching model rather than a fixed list.
6. Model-specific defaults are considered next.
7. If auto-compaction is enabled and the model is unrecognized, the resolver returns the assumed maximum
   with source `unknown-model`, unless the user explicitly selected a 1M route/header, the ID is an
   unresolved Bedrock application-inference-profile ARN, or a recognized/override mapping exists.
8. Only the remaining cases use source `auto`, the older wait-for-the-API behavior.

**Why this approach:**
- A strict precedence chain makes operator intent predictable: an environment override wins, then a
  settings value, then remotely tunable defaults.
- Every value is `min(maximum, configured)`, so a compaction preference cannot claim a context window the
  route does not have.
- Unknown models are capped at an assumed safe window because waiting for an API “prompt too long” error
  loses the chance to compact gracefully.
- Exempting explicit 1M signals and unparseable provider ARNs avoids enforcing a 200K-style assumption when
  the operator has supplied stronger contrary evidence.
- The escape hatch restores compatibility for private gateways whose model IDs cannot be mapped locally.

**Key insight:** Unknown-model enforcement does not invent a smaller arbitrary window. It takes the same
assumed maximum the client would otherwise use and changes its role from passive estimate to active
compaction boundary.

### Threshold Derivation and Safety Buffer

**What it does:** Converts the resolved context window into the token threshold available to conversation
history before compaction work must begin.

**How it works:**
1. `getCompactionInputBudget` (`Gpe`, `:213745-213751`) computes the system/output reserve and caps that
   reserve at an internal maximum.
2. It calls the window resolver with the active model and any explicit per-session compact setting.
3. The reserve is subtracted from the window; compaction therefore starts before the absolute API limit.
4. Precompute thresholds apply an additional fraction chosen from an experiment/table by session surface.
5. The resulting source label is retained for telemetry and startup diagnostics.

**Why this approach:**
- Compaction itself consumes tokens and the next turn needs output room; triggering at the hard window would
  already be too late.
- Separating window resolution from reserve calculation prevents provider/model policy from being tangled
  with prompt-shape estimates.
- A bounded reserve avoids pathological over-reservation on very large windows while maintaining a fixed
  operational margin.

**Key insight:** The “context window” is not the usable input budget. Enforcement first chooses the outer
window and then removes space that the next request and compaction operation need to succeed.

### Enforcement Warnings and Escape Hatches

**What it does:** Detects when configuration says “cap at 200K” but the effective resolver will not enforce
that cap, and tells unknown-model users exactly why their session is being compacted.

**How it works:**
1. `buildContextCapWarning` (`R$h`, `:922356-922398`) runs only when both disable-1M and auto-compaction are
   active.
2. It excludes provider profiles that cannot be safely interpreted, then recomputes the effective window
   and source.
3. If the source already enforces a boundary at or below 200K, or the model is outside the relevant native-
   1M/unknown category, it records success and returns no warning.
4. Otherwise it reports that the session can grow past the requested limit and recommends an explicit
   `CLAUDE_CODE_AUTO_COMPACT_WINDOW=200000` or settings equivalent.
5. `buildUnknownModelWindowNotice` (`NYv`, `:922412-922424`) activates only for source `unknown-model` and
   explains the assumed token count, modelOverrides/update path, explicit 1M or max-token alternatives,
   and the opt-out variable.

**Why this approach:**
- A startup warning catches configuration that is syntactically accepted but semantically ineffective.
- The unknown-model notice is actionable rather than alarming: it names both the safe default and every
  supported way to provide better information.
- The opt-out is deliberately specific to unknown-model enforcement; it does not disable all compaction or
  weaken recognized-model policies.

**Key insight:** These warnings validate an invariant, not a flag. The code asks whether the resolved
window actually obeys the requested cap, so future model/catalog changes remain covered.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `isRecognizedModel` (`Pmr`) - catalog/override recognition.
- `findNative1mCatalogModel` (`e_f`) - capability lookup after model normalization.
- `resolveAutoCompactWindow` (`q3`) - full precedence and fallback decision.
- `buildContextCapWarning` (`R$h`) - ineffective-cap diagnostic.
- `buildUnknownModelWindowNotice` (`NYv`) - assumed-window explanation.
