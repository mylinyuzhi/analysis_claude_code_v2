# Telemetry, feature flags, usage accounting, and export in 2.1.227

## 1. Architecture: two telemetry planes with different failure semantics

Claude Code does not have one telemetry pipeline. It has a first-party analytics logger and an
operator-controlled OpenTelemetry pipeline. They share identity concepts, but not transport,
initialization, or failure guarantees.

### Dual-plane event routing

**What it does:** Separates product analytics from third-party operational telemetry so user or
administrator settings can disable and route them independently.

**How it works:**
1. `logEventTo1P` (`jwr`, `:614428-614437`) accepts internal `tengu_*` events. Before initialization,
   it queues at most 1,024 entries; after initialization it emits through the first-party logger.
2. `emitOtelEvent` (`Tu`, `:130042-130063`) creates `claude_code.*` log records for the
   operator-configured OTel pipeline.
3. First-party events attach `core_metadata`, `user_metadata`, and optional user id; OTel events use
   resource/runtime attributes and an optional trace context.
4. Both paths catch or isolate exporter failures. Instrumentation must not break the agent loop.
5. Reconfiguration of first-party batching flushes the old provider before swapping it, while OTel
   provider ownership is tied to process shutdown.

**Why this approach:**
- Product experiments need a stable Anthropic event schema, while enterprise observability must obey
  standard OTel environment configuration.
- A single transport would couple privacy, availability, and administrator policy.
- Silent degradation protects core execution, at the cost of making exporter loss observable mainly
  through debug logs and first-export diagnostics.

**Key insight:** The shared word “telemetry” hides two trust boundaries. Feature exposure and product
analytics use the first-party plane; customer-controlled logs, metrics, and traces use the OTel plane.

## 2. Attribute construction and privacy boundaries

### OTel base-attribute projection

**What it does:** Builds one normalized attribute set for metrics and log events without blindly
copying process environment or authentication material.

**How it works:**
1. `buildTelemetryAttributes` (`N2t`, `:129857-129935`) starts with device/user and session identity.
2. Feature switches independently control session id, app version, account UUID, entrypoint, and
   custom resource attributes.
3. In remote sessions, a JWT payload is decoded only to recover organization/account/email identity;
   malformed tokens return no fallback identity.
4. Custom `OTEL_RESOURCE_ATTRIBUTES` keys and values are capped at 255 characters and limited to a
   printable, delimiter-safe character set.
5. When explicit identity attributes already exist, custom keys beginning with `user.` or
   `identity.` are rejected to avoid shadowing canonical identity.
6. Runtime dimensions such as terminal type and Remote Control session id are added last.

**Why this approach:**
- Independent switches give administrators granular data-minimization controls.
- Parsing resource attributes locally is flexible, but strict key/value validation prevents malformed
  exporter payloads and identity spoofing.
- JWT decoding is a last-resort projection, not authentication; no trust decision is based on it.

**Key insight:** Attribute precedence is a security property. Canonical identity wins over free-form
resource attributes, so an operator cannot accidentally create two conflicting `user.id` meanings.

## 3. Content truncation is one hard cap, not four competing writers

### Four-way telemetry content limit

**What it does:** Enforces the strictest applicable content limit across Claude Code and three OTel
SDK settings.

**How it works:**
1. `resolveOtelContentMaxLength` (`FOy`, `:129960-129966`) reads
   `CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH`, general attribute length, log-record attribute length, and
   span attribute length.
2. Missing SDK limits become infinity; the Claude Code default is 61,440 characters.
3. `truncateTelemetryContent` (`iN`, `:129968-129975`) returns content unchanged when it fits.
4. Oversized text reserves room for a self-describing truncation marker and slices the payload to the
   exact winning cap.
5. If the cap is smaller than the marker, it emits a raw prefix rather than exceeding the limit while
   trying to explain truncation.
6. The same helper covers prompts, system reminders, tool schemas, tool inputs/results, model output,
   and raw API-body logging.

**Why this approach:**
- Taking `Math.min` prevents one permissive setting from defeating a stricter backend or signal limit.
- Centralizing truncation avoids inconsistent markers and oversized raw-body events.
- The limit is character-based, which is cheap and matches OTel attribute limits, but it is not an
  exact byte budget for multibyte Unicode.

**Key insight:** The Claude-specific knob is a ceiling, not an override. Administrators can reduce
content exposure, but cannot use it to bypass a stricter SDK/exporter limit.

## 4. Trace correlation chooses live causality before inherited context

### Three-tier trace-context resolution

**What it does:** Attaches OTel log records to the correct active or externally supplied trace.

**How it works:**
1. `getActiveOrStoredContext` (`tvo`, `:130014-130017`) reads AsyncLocalStorage and falls back to a
   stored interaction context only when the active context is root.
2. `resolveLogRecordTraceContext` (`GOy`, `:130034-130040`) returns that context when it contains a
   valid span.
3. Only in noninteractive execution does it attempt W3C extraction from `TRACEPARENT` and
   `TRACESTATE`.
4. If neither source is valid, the event is emitted without a trace context rather than fabricating
   ids.
5. `emitOtelEvent` then attaches event name, timestamp, monotonic event sequence, prompt id, workflow
   fields, and caller attributes.

**Why this approach:**
- A live local span is more precise than inherited environment context.
- Stored interaction context bridges async boundaries where AsyncLocalStorage returns root.
- Environment trace adoption is restricted to headless hosts because an interactive shell may carry
  unrelated ambient variables.

**Key insight:** Correlation is ordered by causal strength: active span, stored interaction span,
external W3C parent, then no trace. This prevents plausible-looking but false joins.

## 5. Exporter selection is signal-specific and fail-fast on invalid configuration

### Metrics, logs, and traces exporter construction

**What it does:** Converts comma-separated OTel exporter settings into signal-specific providers.

**How it works:**
1. `parseExporterKinds` (`G7o`, `:462462-462469`) trims entries and removes `none`.
2. `buildMetricReaders` (`fUb`, `:462485-462537`) supports console, OTLP, and Prometheus.
3. `buildLogExporters` (`TIp`, `:462539-462571`) and `buildTraceExporters` (`mUb`,
   `:462573-462604`) support console and OTLP.
4. OTLP independently selects gRPC, HTTP/JSON, or HTTP/protobuf from per-signal settings with a
   general-protocol fallback.
5. Unknown exporter or protocol names throw during initialization rather than producing a partially
   plausible configuration.
6. Each exporter is wrapped so its first success or failure is logged exactly once.
7. `initializeTelemetry` (`gUb`, `:462618-462776`) constructs providers, registers flush/shutdown
   handlers, and caps shutdown waiting with an operator-configurable timeout.

**Why this approach:**
- Signal-specific construction matches the OTel configuration model and permits mixed backends.
- Dynamic imports avoid loading every exporter dependency on every startup.
- Fail-fast validation trades availability of telemetry for clarity of configuration; core Claude Code
  still continues because top-level initialization catches the error.

**Key insight:** Telemetry setup is strict internally but nonfatal externally: invalid exporter names
abort the telemetry provider, not the coding session.

## 6. OTLP HTTP bodies are buffered to defeat chunked-transfer incompatibility

### Explicit Content-Length transport repair

**What it does:** Ensures OTLP HTTP requests carry a `Content-Length` header, including through an
HTTP proxy.

**How it works:**
1. `buildOtlpOptions` (`W7o`, `:462797-462829`) selects gateway credentials, helper-provided headers,
   explicit OTel headers, and per-signal endpoint/agent options.
2. `wrapAgentWithContentLength` (`j7o`, `:462844-462885`) patches the Node agent's `addRequest`.
3. Requests that already have `Content-Length` or transfer encoding pass through unchanged.
4. Otherwise `write` chunks are converted to buffers and held; callbacks are scheduled without
   sending partial network data.
5. On `end`, the chunks are concatenated, byte length is set, original methods are restored, and the
   complete body is sent once.
6. Invalid chunk types destroy the request with a typed error.
7. `buildOtlpHttpAgentFactory` (`yIp`, `:462887-462912`) applies the wrapper to direct HTTP, HTTPS,
   and proxy agents, while bypassing proxies for loopback endpoints.

**Why this approach:**
- Some Azure Monitor paths reject chunked OTLP requests even though Node naturally streams them.
- Patching the shared agent covers all HTTP exporters without forking OTel packages.
- Buffering adds memory proportional to an export batch and delays the first byte, but telemetry
  payloads are bounded and compatibility is more important than streaming here.

**Key insight:** The patch changes only framing, not exporter serialization. All exporter/protocol
logic remains upstream-compatible while the wire gets the header required by strict collectors.

## 7. Prometheus unit suppression is conditional on the entire metrics destination set

### Prometheus-only metric descriptor policy

**What it does:** Omits OTel metric units only when every configured metrics exporter is Prometheus.

**How it works:**
1. Telemetry initialization returns both a meter and the parsed exporter-kind list.
2. `initializeTelemetryCounters` (`IYv`, `:921837-921854`) tests whether the list is nonempty and every
   entry equals `prometheus`.
3. It passes `omitUnits: true` to `setMeterAndCounters` (`s5i`, `:3706-3778`) only in that case.
4. Mixed Prometheus+OTLP or Prometheus+console configurations retain units for all exporters.
5. Empty exporter lists also retain the normal metric definitions.

**Why this approach:**
- Prometheus exposition generated undesirable `# UNIT` lines, but units remain valuable in OTLP.
- OTel instruments are shared across readers, so per-exporter descriptors are not practical without
  duplicating meters.
- The all-Prometheus predicate chooses predictable cross-reader semantics over optimizing one reader
  in a mixed deployment.

**Key insight:** This is a provider-level compromise: suppress units only when doing so cannot degrade
another configured metrics consumer.

## 8. Model and transcript correlation attributes are attached at the owning boundary

### Request/message/tool provenance correlation

**What it does:** Makes request, transcript, workflow, and tool events joinable without parsing text.

**How it works:**
1. Model-call completion adds `client_request_id` and the latest durable `message.uuid` at the request
   boundary (`:355110-355139`).
2. Tool events use a three-way `tool_source`: built-in, SDK-host built-in MCP, or ordinary MCP
   (`:612900-613140`).
3. Workflow attributes are projected only when a workflow context exists; subagent fields are added
   only for subagent execution.
4. Permission decisions record their explicit reason/source rather than treating every denial as a
   configuration denial.
5. All of these fields flow through `emitOtelEvent`, which supplies trace context and a process-local
   sequence number.

**Why this approach:**
- IDs are reliable join keys; content matching is lossy and privacy-sensitive.
- A three-way tool source distinguishes operator MCP infrastructure from SDK-hosted built-ins, which a
  boolean `is_mcp` cannot express.
- Conditional projection avoids emitting misleading empty or default values.

**Key insight:** Correlation fields are created where ownership is known—request completion,
transcript persistence, or tool projection—not guessed later by the exporter.

## 9. 2.1.222: MCP usage attribution became consumption-scoped

### One-request MCP attribution latch

**What it does:** Attributes a model request to an MCP server only when that request consumes the
server's tool result.

**How it works:**
1. MCP execution records `activeMcpServer` and `activeMcpTool` in the query options.
2. At the next main/subagent query, the loop snapshots those fields into locals (`:367806-367807`).
3. `clearConsumedMcpAttribution` (`V6d`, `:369423-369431`) immediately clears the shared fields.
4. The snapshot is passed into the one model call whose messages contain the MCP result.
5. Retries within that same API loop retain the local snapshot because they are still attempts for the
   same logical request.
6. Recursive continuation starts with cleared options, so later requests are not attributed unless a
   new MCP result is produced.
7. The 2.1.220 loop passed `options.activeMcpServer` directly at every request and did not perform this
   snapshot-and-clear step, making attribution sticky.

**Why this approach:**
- Clearing before the call prevents ordinary recursive continuation from inheriting stale provenance.
- Keeping a local snapshot preserves attribution across retries and fallbacks for the same request.
- Clearing after success would be vulnerable to exceptions; clearing before execution is deterministic.

**Key insight:** The fix is not in `/usage` aggregation. It repairs provenance at the query-state
boundary, so every downstream consumer—including transcript scanning and OTel—gets correct data.

## 10. `/usage` scans local transcripts with bounded, weighted aggregation

### Transcript usage scanner and behavior classifier

**What it does:** Produces approximate daily/weekly usage contributions by behavior, agent, skill,
plugin, and MCP server.

**How it works:**
1. The scanner enumerates project transcripts and nested subagent JSONL files, ignoring files older
   than the requested window.
2. `parseUsageTranscriptLine` (`$Pp`, `:473935-473973`) first searches byte markers for assistant and
   usage records, then extracts timestamp, session, model, token counters, sidechain state, and
   attribution fields.
3. Zero-token, malformed, or old records are discarded without parsing the full JSON object.
4. `accumulateUsageRecord` (`wPp`, `:473986-474002`) estimates weighted cost and updates source maps,
   session statistics, and five-minute concurrency buckets.
5. `classifyUsageBehaviors` (`TPp`, `:474004-474035`) detects >100K uncached input, >150K context,
   subagent-heavy sessions, four-or-more concurrent sessions, and eight-or-more active hours.
6. `rankUsageContributors` (`WXo`, `:474037-474044`) sorts weighted contributions, converts them to
   rounded percentages, and removes rows that round to zero.
7. `collectUsageData` (`jCn`, `:474187-474253`) combines local results with live plan utilization only
   when subscriber authentication makes that endpoint applicable.

**Why this approach:**
- Byte scanning is much cheaper than JSON parsing every line of large transcript histories.
- Cost weighting is more informative than request count for long or expensive turns.
- The analysis is approximate and machine-local; excluding other devices is an explicit trade-off for
  privacy, availability, and no server-side analytics dependency.

**Key insight:** `/usage` is an explanatory estimator, not a billing ledger. Its accuracy depends on
request-scoped attribution—which is why the 2.1.222 latch repair belongs upstream.

## 11. SSE metering assigns cumulative output usage and falls back only when necessary

### Gateway SSE usage accumulator

**What it does:** Meters streamed gateway responses without double-counting cumulative
`message_delta` usage.

**How it works:**
1. `newSseUsageAccumulator` (`RcH`, `:960038-960039`) starts zeroed usage, a seen flag, estimated
   output characters, and `sawOutputTokens`.
2. `consumeSseUsageFrame` (`l9h`, `:960041-960085`) scans SSE fields without allocating a full event
   parser for irrelevant frames.
3. `message_start` replaces input/cache counters from the authoritative usage object.
4. Content deltas add text, partial-JSON, and thinking character counts for fallback estimation.
5. `message_delta.usage.output_tokens` is assigned—not added—because the stream value is cumulative.
6. `finalizeSseUsage` (`LcH`, `:960107-960111`) estimates output as characters/4 only if no
   authoritative output-token field was ever observed.
7. The rolling SSE buffer is abandoned at 8 MiB rather than allowing unbounded memory growth.

**Why this approach:**
- Assignment matches Anthropic SSE semantics and eliminates repeated cumulative addition.
- Character fallback salvages metering from incomplete/nonstandard upstreams.
- The `sawOutputTokens` latch prevents a fallback estimate from overwriting real zero or nonzero usage.

**Key insight:** `seen` and `sawOutputTokens` answer different questions: a stream may contain valid
usage but still require output estimation, or may explicitly report output tokens and forbid it.

## 12. 2.1.225: gateway spend caps reuse the unified-limit UI contract

### Spend-limit selection, warning headers, and rejection

**What it does:** Selects the most relevant applicable gateway cap, exposes warnings through standard
rate-limit headers, and returns an actionable billing error when exceeded.

**How it works:**
1. `createGatewaySpendMeter` (`m9h`, `:960177-960250`) queries user, RBAC-group, and organization
   bindings under a two-second database statement timeout plus a bounded outer timeout.
2. `selectSpendLimitBinding` (`NcH`, `:960252-960260`) calculates utilization and reset time for each
   cap.
3. `chooseDominantSpendLimit` (`BcH`, `:960262-960265`) prefers exceeded over non-exceeded caps; among
   exceeded caps it chooses the latest reset, otherwise the highest utilization.
4. `buildSpendLimitHeaders` (`FcH`, `:960267-960290`) emits unified status, reset, overage reset,
   utilization, threshold, period, and disabled-reason headers.
5. At 75% and 95%, `allowed_warning` plus the surpassed-threshold header drives existing warning UI.
6. On rejection, the gateway returns HTTP 429 `billing_error`, an `x-should-retry: false` header, and
   text containing the period, UTC reset time, and optional operator-configured message.
7. On store failure, configurable fail-open/fail-closed policy decides whether inference continues.

**Why this approach:**
- Reusing `anthropic-ratelimit-unified-*` lets the CLI display gateway caps without a second warning
  state machine.
- Dominant-cap selection gives one deterministic explanation when several scopes apply.
- Fail-open protects availability; fail-closed protects budget. The gateway operator chooses which
  risk matters more.

**Key insight:** The 2.1.225 support is a protocol composition: the gateway supplies rich error text
and standard headers, while Claude Code's existing quota parser and error formatter render them.

## 13. GrowthBook payloads are staged before any live cache is replaced

### Coherent remote-evaluation commit

**What it does:** Prevents malformed, empty, or superseded GrowthBook responses from wiping valid
feature state.

**How it works:**
1. `processRemoteEvalPayload` (`sRa.processRemoteEvalPayload`, `:617630-617688`) obtains the SDK
   payload and builds temporary feature, experiment, non-default, and value collections.
2. Non-object features, malformed experiment assignments, and value-less entries are skipped and
   diagnosed once.
3. An empty usable-value map returns false before touching live caches.
4. The sanitized payload is installed into the candidate client.
5. The method then verifies that the candidate is still the manager's active client.
6. Only after that abort gate does it clear and refill all live maps as one logical commit.
7. Successful callers drain deferred exposures, persist the coherent snapshot, and emit a refresh
   notification.

**Why this approach:**
- Clearing first makes transient bad payloads indistinguishable from intentional all-off flags.
- Staging costs extra allocations, but feature payloads are small and consistency is more important.
- The client identity check prevents a slow old generation from overwriting a newer auth identity.

**Key insight:** The active-client check is the commit token. Generation reset stops stale creation;
identity comparison stops stale asynchronous payload installation.

## 14. Feature lookup has explicit source precedence and null normalization

### Five-source feature resolution

**What it does:** Resolves flags predictably across test overrides, configuration, live evaluation,
disk recovery, and defaults.

**How it works:**
1. `getFeatureValueWithSource` (`sRa.getFeatureValueWithSource`, `:617830-617845`) checks environment
   overrides first and configuration overrides second.
2. If GrowthBook is disabled and disk-cache reading is not explicitly permitted, it returns the
   default with source `disabled`.
3. A live remote-eval value wins over disk and is tagged `payload`.
4. A disk value is accepted only when present and is tagged `disk`; experiment exposure is deferred
   until logging becomes available.
5. Missing values return the caller default with source `fallback`.
6. `coalesceNullFeatureValue` (`iRa`, `:617983`) converts a remote `null` to the typed caller default,
   avoiding a null-feature crash while preserving false, zero, and empty string.

**Why this approach:**
- Explicit override precedence makes tests and managed rollout controls deterministic.
- Disk cache gives fast startup but cannot outrank fresh process state.
- `=== null` rather than falsy coalescing preserves legitimate boolean/numeric experiment values.

**Key insight:** The resolver preserves both value and provenance. That makes security-gate callers able
to choose stricter cached/blocking behavior without redefining the general precedence ladder.

## 15. 2.1.227: OAuth refresh happens before subscription-tier evaluation

### Refresh-before-attributes GrowthBook initialization

**What it does:** Ensures feature evaluation includes the user's current subscription tier even when
the stored access token is expired at session startup.

**How it works:**
1. `createGrowthBookClient` (`sRa.createClient`, `:617746-617803`) snapshots the current generation.
2. In a trusted workspace it calls `refreshOAuthTokenIfNeeded` before resolving auth headers or user
   attributes.
3. The refresh is bounded to five seconds by `GROWTHBOOK_PREINIT_OAUTH_REFRESH_TIMEOUT_MS` (`ARS`) and
   is nonfatal; timeout/failure is logged and startup continues.
4. It then resolves headers and rechecks both disposal and generation.
5. Only now does `getGrowthBookUserAttributes` (`aRa`, `:618113-618155`) read `subscriptionType`,
   `rateLimitTier`, account, organization, and role.
6. The GrowthBook client is created from that refreshed identity and, when authenticated, initializes
   remote evaluation.
7. A transient header-resolution failure is latched. Periodic refresh later retries and rebuilds the
   client once auth becomes available.

**Why this approach:**
- Refreshing after client creation is too late: tier-dependent flags may already be cached or exposed.
- A bounded refresh balances correctness against startup latency and offline resilience.
- Re-reading all attributes after refresh is safer than patching only `subscriptionType`, because
  token rotation may also change account or organization.

**Key insight:** The bug was an ordering failure, not a missing attribute. `subscriptionType` already
existed; it was sampled before expired-login recovery could populate it.

## 16. GrowthBook refresh treats auth rotation as an identity-generation change

### Rotation-aware refresh and retry cadence

**What it does:** Keeps long-running feature state aligned with changing bearer tokens and identities.

**How it works:**
1. `refreshFeatures` (`sRa.refreshFeatures`, `:617920-617949`) refreshes OAuth when the client was
   created authenticated and compares the new bearer with the captured bearer.
2. If the bearer changes, it re-reads user attributes and tests whether account and organization are
   unchanged.
3. `refreshAfterAuthChange` (`:617869-617883`) resets the client, increments generation, preserves
   pending exposures, and optionally preserves logged exposures for the same identity.
4. If initial auth resolution failed transiently, the refresh loop retries headers and rebuilds when a
   bearer becomes available.
5. Otherwise it refreshes features in place, then uses the staged commit algorithm.
6. `getGrowthBookRefreshCadence` (`gbf`, `:618188-618194`) defaults to six hours; a flag can clamp it
   to 5–360 minutes with ±10% jitter.
7. A flagged cadence performs a short jittered retry when the previous refresh produced no successful
   remote evaluation; errors back off for one minute.

**Why this approach:**
- Token changes can imply identity changes, so merely replacing an Authorization header is unsafe.
- Preserving exposure deduplication for the same account/org avoids duplicate experiment events;
  clearing it for a new identity avoids cross-user contamination.
- Jitter prevents synchronized fleets while the retry improves recovery from transient failures.

**Key insight:** Auth state is part of the feature-client generation. The same generation discipline
that protects payload commits also protects experiment identity.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `buildTelemetryAttributes` (`N2t`) - validated OTel identity and resource projection.
- `truncateTelemetryContent` (`iN`) - shared strict-cap truncation.
- `emitOtelEvent` (`Tu`) - OTel log emission and trace attachment.
- `initializeTelemetry` (`gUb`) - metrics/log/trace provider construction.
- `wrapAgentWithContentLength` (`j7o`) - buffered OTLP transport repair.
- `clearConsumedMcpAttribution` (`V6d`) - request-scoped MCP provenance latch.
- `parseUsageTranscriptLine` (`$Pp`) - allocation-conscious transcript usage extraction.
- `createGatewaySpendMeter` (`m9h`) - scoped cap enforcement and response metering.
- `GrowthBookManager` (`sRa`) - feature evaluation, cache, auth, and refresh lifecycle.
