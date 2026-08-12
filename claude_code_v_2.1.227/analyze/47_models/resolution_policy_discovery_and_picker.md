# Resolution policy, discovery, and picker

## Resolution layers

Model selection is not one lookup. The final value is the result of a precedence ladder:

1. organization/role default, when present and usable;
2. managed `availableModels` enforcement and `modelOverrides`;
3. account entitlement filtering;
4. subscription/provider tier default;
5. environment/provider alias projection;
6. server and gateway availability;
7. the current surface's own semantics (main loop, plan upgrade, subagent, teammate, or picker).

Keeping these layers separate prevents an availability fallback from being mistaken for authorization.

### Default-model attribution ladder

**What it does:** Resolves the session default while preserving why that model won.

**How it works:**
1. `resolveDefaultModelWithAttribution` (`$mr`, `cli_inner_pretty.js:108993-109007`) first reads the
   server-provided organization default.
2. It validates that default through `Hyo` and entitlement handling; unusable org data does not become
   a blind concrete selection.
3. `resolveTierDefault` (`zuu`, `109027-109039`) computes the provider/account baseline: eligible
   first-party users prefer Opus, Bedrock/Vertex consider probe results and enforcement, Mantle uses
   its provider row, and the general fallback is Sonnet.
4. `Hyo` may replace that baseline under managed enforcement.
5. `resolveEntitledFallback` (`vyo`, `109009-109025`) steps from Opus through Sonnet to Haiku without
   selecting a model denied by account entitlement.
6. The function returns both `setting` and one of `org`, `enforced`, `entitlement`, or `tier`; picker
   descriptions use this attribution instead of reconstructing it.

**Why this approach:**
- The winning model and the reason it won are both user-visible state.
- Applying policy before entitlement would permit an admin alias that the account cannot actually use;
  applying entitlement before policy could escape an administrator's allowlist. The implementation
  rechecks both at each boundary.
- A monolithic “resolve model” function would be shorter but nearly impossible to explain in error and
  picker messages.

**Key insight:** Attribution is a first-class output, not telemetry decoration. It is what lets the UI
distinguish an org default from an enforced replacement and a subscription fallback.

### Managed allowlist enforcement

**What it does:** Selects an allowed model without trusting lower-precedence settings when an admin
policy source is incomplete or broken.

**How it works:**
1. `getAdminModelPolicyState` (`Ayo`, `cli_inner_pretty.js:109218-109269`) classifies policy as
   `active`, `inactive` with or without cascade trust, or `refused`.
2. A failed admin source disables cascade trust; user/project settings cannot fill an unknown admin
   gap.
3. `resolveEnforcedAvailableModel` (`Hyo`, `109041-109192`) activates only with a non-empty policy-owned
   allowlist and enforcement flag.
4. It normalizes the requested selector, resolves family aliases without environment steering, and
   reapplies trusted override maps.
5. Override targets that the server marks unavailable are rejected in favor of the unmapped candidate.
6. Each allowlist entry is classified as a family alias, a recognized canonical form, a dated concrete
   provider id, an ARN, or—in Foundry—a permissive custom id.
7. Candidates must pass both policy matching and runtime/server availability. A `[1m]` suffix is kept
   only if the target supports it.
8. If no entry survives, a warn-once diagnostic explains whether entries were policy-ineligible or
   server-unavailable, then the resolver retains the safest trusted tier baseline.

**Why this approach:**
- Policy-source failure is a security boundary, so fail-closed trust is more important than silently
  honoring a convenient project setting.
- Alias expansion is deferred because administrators may mean “any model in this family,” not today's
  provider default.
- Server availability is checked after authorization: it may narrow an allowed set but must never
  broaden it.
- The branch density is a readability cost paid for provenance-sensitive enforcement and actionable
  warnings.

**Key insight:** `availableModels` is not a picker filter bolted onto the end. It participates in
default resolution, override reversal, alias expansion, entitlement fallback, and runtime availability.

## Safe reverse overrides

### Recognized-key reverse lookup

**What it does:** Maps a provider-specific override target back to a canonical Anthropic model only
when the override key is itself a recognized built-in model.

**How it works:**
1. `findCanonicalOverrideKey` (`Wps`, `cli_inner_pretty.js:109408-109415`) scans the chosen override map
   for a target equal to the incoming model; policy matching may use provider-aware equality.
2. It canonicalizes the override key with `gF`.
3. `isRecognizedCanonicalModel` (`Pmr`, `109405-109406`) accepts catalogue entries and a small legacy
   built-in set.
4. Only recognized keys are returned; unknown keys are ignored and lookup continues/falls through.
5. `Co` tries an explicitly supplied policy map, then user settings, then paired managed overrides,
   before inference-profile and ordinary canonical normalization.

In 2.1.220, `Hot` (`2.1.220:100449-100459`) returned any matching override key verbatim. That allowed a
custom or misspelled key to masquerade as the session's canonical model and corrupt capability,
policy, and display decisions. The 2.1.227 guard implements the 2.1.223 changelog fix.

**Why this approach:**
- Overrides are routing declarations, not authority to create new canonical Anthropic identities.
- Ignoring an unknown key preserves the provider target as a custom model, which is safer than
  attaching built-in capabilities based on an administrator typo.
- The trade-off is that genuinely custom canonical naming cannot use built-in reverse classification;
  it remains a custom model by design.

**Key insight:** Trusting the override *value* is necessary for routing; trusting an arbitrary override
*key* as canonical metadata was the bug.

## Gateway discovery

### Bounded model-list discovery and cache

**What it does:** Discovers models from a custom Anthropic-compatible gateway and makes them available
to the picker without blocking ordinary startup indefinitely.

**How it works:**
1. `isGatewayModelDiscoveryEnabled` (`Bps`, `cli_inner_pretty.js:108044-108050`) requires the explicit
   feature env, logical first-party mode, a non-official custom base URL, and no already-selected
   gateway provider.
2. `fetchGatewayModels` (`kuu`, `108103-108173`) requires an auth token or API key and issues
   `GET /v1/models?limit=1000` with a three-second timeout and redirects disabled.
3. Custom headers are parsed line by line and merged after required headers.
4. The response is schema-validated before use.
5. IDs are kept when `claude` or `anthropic` appears anywhere, case-insensitively.
6. Results are keyed by base URL and written with mode `0600`; identical data avoids a rewrite.
7. Storage V5 is preferred when supplied, with the filesystem path retained as fallback. The in-memory
   cache mirrors either backend.
8. Network, validation, read, and write failures log and leave the previous/no discovery set rather
   than breaking model selection.

The 2.1.220 filter was anchored (`/^(claude|anthropic)/i` at `2.1.220:109914`). The 2.1.227 unanchored
filter (`/(claude|anthropic)/i` at `108143`) admits IDs such as `vertex_ai/claude-*` and
`bedrock/anthropic.claude-*`, exactly matching the 2.1.223 changelog. Storage V5 caching is an adjacent
bundle refactor not named by that bullet.

**Why this approach:**
- Explicit opt-in and a short timeout contain gateway compatibility risk.
- Schema validation and same-origin base-URL keys prevent stale data from another gateway being shown.
- Matching anywhere accepts provider namespaces; it is broader than prefix matching and can admit an
  unusual unrelated id containing those words, but later selection still treats it as a custom model.
- Cache failures are non-fatal because discovery supplements, rather than defines, the core catalogue.

**Key insight:** The regex change broadens discovery, not built-in trust. Canonical recognition still
runs through the stricter catalogue/normalizer path.

## Host-managed model precedence

### Host overlay over stale managed disk data

**What it does:** Ensures an SDK/desktop host's current model-selection keys win when the host declares
that it manages the provider.

**How it works:**
1. `extractHostModelOverlay` (`L2g`, `cli_inner_pretty.js:59526-59534`) copies only `model`,
   `availableModels`, `enforceAvailableModels`, and `fallbackModel` from the parent/host slice.
2. `stripDiskModelPolicy` (`klo`, `59535-59540`) removes `model`, `fallbackModel`, and `modelOverrides`
   from a stale managed-settings object and removes provider-model environment keys.
3. `collectManagedPolicyTiers` (`Ets`, `59569-59599`) keeps the ordinary remote/MDM/file tier merge but
   returns the host overlay separately.
4. `composePolicySettings` (`vkc`, `59659-59737`) strips stale fields in helper, HKCU, or merged policy
   branches whenever `hostManagedProvider` is true, then applies the host overlay last.
5. A paired admin `modelOverrides` map survives only when it belongs to an admin-provided
   `availableModels` allowlist and the host did not replace that allowlist.
6. The same rules operate whether an admin tier exists or only host/HKCU state is present.

The paired-map exception is important: dropping it unconditionally could make an admin allowlist name
models that no longer route on the provider. Retaining it when the host replaces the allowlist would
instead bind unrelated policy domains.

**Why this approach:**
- A host-managed provider is an explicit ownership declaration; stale on-disk model keys must not
  override live host state.
- Field-level stripping preserves unrelated managed policy such as permissions, sandbox, and MCP.
- Applying the whole parent settings object last would be simpler but would grant the host unintended
  precedence over every administrative setting.

**Key insight:** Precedence is scoped to model/provider ownership. The fix is a surgical overlay, not a
general weakening of managed settings.

## Family-preserving restricted model resolution

### Newest permitted family step-down

**What it does:** Keeps a restricted subagent or teammate on the requested model family when a family
alias is denied, instead of immediately inheriting the parent/default model.

**How it works:**
1. `resolvePermittedFamilyAlias` (`yF`, `cli_inner_pretty.js:108908-108918`) strips `[1m]`, recognizes
   only supported family aliases, and activates only for first-party-style model semantics with a real
   allowlist or entitlement restriction.
2. `resolveNewestPermittedFamilyModel` (`Non`, called at `108913`) selects the newest candidate in that
   family.
3. The candidate must pass both managed permission (`k3`/`Pc`) and entitlement (`$V`).
4. A requested `[1m]` suffix survives only if the family's feature gate and selected model support it.
5. `resolveSubagentModel` (`ele`, `475539-475575`) preserves the existing precedence:
   `CLAUDE_CODE_SUBAGENT_MODEL`, tool request, frontmatter/default, then parent inheritance.
6. On a denied explicit alias it uses `yF`; if that fails it inherits the parent. Teammate resolution
   (`OVp`/`$Vp`, `549953-549967`) uses the same family step-down before its default.
7. `resolveSubagentModelWithTelemetry` (`TMp`, `475577-475610`) and `WSa` (`549968-549993`) distinguish
   `family_alias_stepped_down`, `override_dropped`, and family mismatch.
8. Warning helpers announce whether the replacement stayed in-family. Shared callers cover workflows,
   forked skills, slash commands, and resumed background agents.

**Why this approach:**
- A family alias expresses intent more strongly than a generic “use anything” request.
- Selecting only the newest permitted member retains that intent while respecting both administrator
  and account constraints.
- Concrete denied IDs do not silently become a different version unless they can be interpreted as a
  family request; otherwise parent/default inheritance remains the conservative fallback.
- More telemetry categories add complexity but make policy substitution auditable.

**Key insight:** The repair changes fallback semantics, not authorization. It never makes a denied
model allowed; it chooses a better already-allowed substitute.

## Picker construction

### Multi-source model picker pipeline

**What it does:** Produces a deterministic, policy-safe picker from built-ins, discovered/custom rows,
server rows, organization settings, entitlements, and runtime error state.

**How it works:**
1. `buildModelPickerOptions` (`Vhs`, `cli_inner_pretty.js:119260-119275`) wraps construction with counts
   for disabled, dropped, duplicate, and reason categories.
2. `assembleModelPickerRows` (`Txy`, `119316-119385`) begins with built-ins, adds the explicit custom
   model, gateway discovery, and server rows, then admits syntactically safe managed allowlist rows.
3. Current session/org selections that would otherwise disappear are reconciled as aliases, concrete
   rows, or custom rows.
4. `filterModelPickerRowsByPolicy` (`Qgt`, `119415-119427`) preserves already allowed rows, attempts a
   family-preserving replacement for denied aliases, and removes duplicates.
5. Org-default attribution is appended to the row matching both canonical id and `[1m]` state.
6. `applyFableCreditGate` (`Cxy`, `119481-119488`) can disable Fable with a usage-credit explanation;
   authenticated feature evaluation supplies the account/tier facts.
7. Runtime model-error overrides disable affected rows.
8. Disabled rows move to the bottom, while `insertFablePickerRow` (`mhr`, `119490-119525`) keeps Fable
   adjacent to the appropriate family/default block even when entitlement projection removed its
   original anchor.
9. `projectModelPickerCapabilities` (`AQe`, `119429-119456`) exports effort levels, adaptive thinking,
   fast mode, auto mode, promo price, and disabled state to remote/headless consumers.

**Why this approach:**
- Assembly and filtering are separate because a row may need to exist for explanation even when it is
  disabled.
- Canonical deduplication avoids showing aliases and provider IDs as distinct models when they route to
  the same target.
- Moving disabled rows rather than deleting them explains server outages and credit requirements.
- Deterministic Fable insertion is intricate, but prevents entitlement-driven removal of an anchor from
  scrambling menu semantics.

**Key insight:** The picker is a projection of the same policy engine used for execution. It does not
grant access by merely rendering a selectable-looking row.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `resolveDefaultModelWithAttribution` (`$mr`) - reason-preserving default resolution.
- `resolveEnforcedAvailableModel` (`Hyo`) - provenance-aware managed enforcement.
- `findCanonicalOverrideKey` (`Wps`) - recognized-key reverse override lookup.
- `fetchGatewayModels` (`kuu`) - bounded discovery and dual-backend cache.
- `composePolicySettings` (`vkc`) - host-owned model overlay.
- `resolvePermittedFamilyAlias` (`yF`) - newest allowed same-family fallback.
- `buildModelPickerOptions` (`Vhs`) - picker coordinator and diagnostics.
