# Self-hosted runner operator tool suite

Target anchors: `cli_inner_pretty.js:339328-339367` and `:559507-560218`.

## 1. Suite architecture

The tools deliberately split the diagnostic plane by locality:

- Admin API tools answer “what does the service believe?”
- Local HTTP/file tools answer “what is this runner process reporting?”
- Spawn creates a laptop-scale proof runner; its description explicitly says production Kubernetes or
  Docker deployment is taught, not automated.
- Requeue repairs one stuck assignment while recording the observed runner as excluded.

Every admin read returns an `equivalent.ui` path so the operator can repeat the action without Claude.
The API descriptions state that authentication comes from `claude login`, never from secrets entered
into the conversation.

### OAuth Admin Request Boundary

**What it does:** Centralizes authentication, timeout, abort, status normalization, and error messages
for runner administration calls.

**How it works:**
1. Resolve the operator OAuth access token; absence yields a 401-style error instructing `claude login`
   and explicitly rejecting `ANTHROPIC_API_KEY` as a substitute.
2. Build a request against the configured API base with bearer authorization, API version, JSON
   content type, a 20-second timeout, and the tool abort signal.
3. Accept responses below HTTP 500 into the explicit status handler.
4. Convert network-without-response failures into a typed status-0 error.
5. For 401, 403, 404, 409, and 429, preserve status and append targeted login/base-URL guidance for
   authentication failures.
6. Return only response data on success.

**Why this approach:**
- One helper keeps four reads and one requeue operation on the same auth and failure semantics.
- OAuth is kept out of tool inputs, so tokens cannot be echoed into model-visible calls.
- Explicit handling below 500 produces useful operator errors; 5xx/network failures remain exceptional
  and are handled by the surrounding tool runtime.
- A richer typed result could avoid exceptions, but would duplicate error union fields across tools.

**Key insight:** The model chooses resource IDs and actions, but never supplies the credential.

```javascript
// ============================================
// selfHostedRunnerApiRequest - Execute one OAuth-authenticated runner admin request
// Location: cli_inner_pretty.js:559510-559541
// ============================================

// ORIGINAL (for source lookup):
async function U8e(e, t, r, n) {
  g7p();
  let o = await qsS(),
    i = await zo
      .request({
        method: e,
        url: `${QKt()}${t}`,
        data: r,
        headers: {
          Authorization: `Bearer ${o}`,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        timeout: 20000,
        signal: n,
        validateStatus: (s) => s < 500,
      })
      .catch((s) => {
        if (zo.isAxiosError(s) && !zo.isCancel(s) && s.response === void 0) throw new IRn(0, `${e} ${t}: ${s.message}`);
        throw s;
      });
  if (i.status >= 400) {
    let s = i.data?.error?.message ?? $e(i.data),
      a = `HTTP ${i.status} ${e} ${t}: ${s}`;
    if ([401, 403, 404, 409, 429].includes(i.status)) {
      let l = i.status === 401 || i.status === 403 ? WsS : "";
      throw new IRn(i.status, a + l);
    }
    throw Error(a);
  }
  return i.data;
}

// READABLE (for understanding):
async function selfHostedRunnerApiRequest(method, path, body, signal) {
  initializeRunnerApi();
  const accessToken = await requireOperatorOAuthToken();
  const response = await httpClient.request({
    method,
    url: `${getApiBaseUrl()}${path}`,
    data: body,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    timeout: 20_000,
    signal,
    validateStatus: (status) => status < 500,
  });
  if (response.status >= 400) throw normalizeRunnerApiError(response, method, path);
  return response.data;
}

// Mapping: U8e→selfHostedRunnerApiRequest, e→method, t→path, r→body, n→signal,
//          qsS→requireOperatorOAuthToken, zo→httpClient, QKt→getApiBaseUrl,
//          IRn→SelfHostedRunnerApiError
```

### Cross-Tool Result Redaction

**What it does:** Applies the shared secret redactor at the final model-result seam, even when an
individual endpoint is intended to return metadata only.

**How it works:**
1. Admin tools return ordinary JavaScript data objects.
2. `serializeRunnerToolResult` JSON-serializes the object and passes the string through the shared
   redactor before building a `tool_result` block (`:559542-559544`).
3. The metrics tool redacts Prometheus text before both parsing and returning its `raw` field.
4. The log-tail tool redacts decoded bytes before assigning `lines`.
5. Health data is protected by the common result serializer.

**Why this approach:**
- Endpoint schemas and server behavior can evolve; defense at the final seam covers unexpected fields.
- Metrics labels and logs are especially likely to contain account or credential-like material.
- Multiple passes cost CPU and can produce false-positive masking, but diagnostic payloads are small
  under normal defaults and credential safety dominates exact fidelity.
- Server-side metadata-only contracts remain important because client redaction is pattern-based, not
  a proof that arbitrary sensitive data is absent.

**Key insight:** Redaction is layered: source-specific handling reduces exposure early, and the common
serializer is the last boundary before model context.

## 2. Admin read tools

### Service-State Diagnostic Projection

**What it does:** Exposes the minimum service-side evidence needed to diagnose capacity, assignment,
and credential-registration failures.

**How it works:**
1. `get_pool` reads aggregate alive/capacity/queue/backoff/circuit-breaker state.
2. `list_runners` filters by pool and returns lease, locked account, and assignment fields.
3. `list_sessions` optionally adds a server-side status query and returns failure logs, exclusions,
   spawn attempt, and last spawn error.
4. `list_secrets` returns only metadata such as JTI, label, timestamps, and revoked state; secret values
   are not part of the response schema.
5. Each tool is read-only and concurrency-safe and appends the matching Admin UI navigation path.

**Why this approach:**
- Separate tools keep schemas and result sizes aligned with diagnostic questions.
- Returning service state directly is more reliable than parsing UI pages.
- Generic object schemas tolerate server evolution, at the cost of weaker compile-time field guarantees.
- UI equivalence makes the tools educational rather than a one-way automation trap.

**Key insight:** Secret diagnostics operate on lifecycle metadata, never secret material.

## 3. Local health, metrics, and logs

### Local Probe Algorithm

**What it does:** Reads the runner's local health endpoint and projects Prometheus text into a compact
gauge snapshot.

**How it works:**
1. Default to port 8080; port 0 returns `{disabled: true}` without connecting.
2. GET `/healthz` or `/metrics` on `127.0.0.1` with a two-second timeout.
3. Health returns the response body verbatim under `health`, including non-2xx bodies because status
   validation accepts every code.
4. Metrics pass response text through the shared redactor, scan only the
   `claude_code_self_hosted_runner_` prefix, and ignore histogram buckets plus selected noisy counters.
5. Duplicate numeric gauge names are summed; `locked_account` extracts its email label.
6. Connection failures return `{unreachable: true, error}` rather than throwing.

**Why this approach:**
- Loopback-only probes avoid exposing a generic network fetch surface.
- A compact projection answers common capacity questions while `raw` preserves auditability.
- Summing duplicate samples handles label-partitioned gauges, though it can obscure which label
  contributed a value.
- Returning non-2xx health bodies helps diagnosis but means callers must inspect payload/status
  semantics rather than assuming `health` means healthy.

**Key insight:** The metric parser is intentionally selective, not a general Prometheus parser.

### Secret-Redacted Tail Read

**What it does:** Reads the final bytes of a runner log and applies the shared secret redactor before
the text enters model context.

**How it works:**
1. Open the user-supplied log path read-only.
2. Default to the last 65,536 bytes and seek from `max(0, size - bytes)`.
3. Decode the slice as UTF-8.
4. Pass it through the shared redactor, which covers key/value secrets, bearer/basic tokens, URL
   userinfo, JWTs, and common PATs.
5. Return an error-shaped data object on filesystem failure rather than throwing.

**Why this approach:**
- Tail reads bound normal model context and focus on the most recent failure.
- Redaction occurs before tool-result construction, so raw log text is not returned to the model.
- Reading by bytes is efficient and may begin in the middle of a UTF-8 sequence; replacement decoding
  is acceptable for a diagnostic tail.
- The input schema requires a positive integer but sets no maximum. A very large requested byte count
  can allocate and read far more than the 200,000-character result budget; this is a hardening gap.

**Key insight:** The default is bounded, but the caller-controlled override is not. Result truncation
does not prevent pre-result memory allocation.

## 4. Mutation tools and permission membrane

### Detached Local Runner Spawn

**What it does:** Starts a proof runner on the current machine without reading the environment-secret
file into model context.

**How it works:**
1. Resolve base directory, log path, and secret-file path to absolute paths.
2. Create the base/log parent directories.
3. Build positional, space-separated CLI arguments including explicit base dir, capacity, API URL,
   health port, and log path.
4. Spawn the current executable detached with ignored stdio and `windowsHide`, then `unref` it.
5. Write the PID to `./runner-setup/runner.pid` and return PID, paths, port, and a shell-quoted command.
6. The process intentionally survives the Claude session.

**Why this approach:**
- Passing the secret by file path avoids secret value exposure in tool input/output.
- Detachment matches the proof workflow but creates a lifecycle obligation for the operator.
- Reusing the current binary guarantees client/runner version agreement.
- Capacity is positive but uncapped in the schema; operator approval is the main guard against an
  excessive local proof configuration.

**Key insight:** This tool automates the zero-to-one demonstration, not production orchestration.

### Non-Persistable Mutation Consent

**What it does:** Prevents spawn and requeue operations from becoming silently allowlisted while still
supporting classifier review in auto mode.

**How it works:**
1. Both tools report `isReadOnly() === false`.
2. Both ignore whole-tool allow rules and suppress “always allow” persistence.
3. Auto mode returns `passthrough` so the classifier evaluates the specific operation.
4. Other modes return an explicit ask message describing persistent process execution or session
   relaunch.
5. Requeue sends the observed runner ID; the server verifies assignment consistency and appends it to
   exclusions so the same runner is not immediately selected again.

**Why this approach:**
- The risk depends on concrete paths/session IDs and cannot safely be approved once for all future
  calls.
- Classifier review retains automation in auto mode without weakening the invariant.
- Requeue is intentionally narrow rather than exposing arbitrary session mutation.
- Requiring repeated consent adds friction during multi-session repair, but prevents a broad durable
  permission from outliving the diagnostic incident.

**Key insight:** These tools do more than ask once: they opt out of the mechanisms that would make a
past approval permanent.

```javascript
// ============================================
// requeueRunnerSessionPermission - Require per-operation review for session requeue
// Location: cli_inner_pretty.js:559960-559979
// ============================================

// ORIGINAL (for source lookup):
      isReadOnly() {
        return !1;
      },
      ignoresWholeToolAllowRule() {
        return !0;
      },
      suppressesAlwaysAllowRule() {
        return !0;
      },
      toAutoClassifierInput(e) {
        return `requeue session=${e.session_id} off runner=${e.runner_id}`;
      },
      async checkPermissions(e, t) {
        if (mn(t).mode === "auto")
          return { behavior: "passthrough", message: "Requeueing a runner session requires classifier review." };
        return {
          behavior: "ask",
          message: `Requeue session ${e.session_id} off runner ${e.runner_id}? This re-launches the session on another runner in the environment.`,
        };
      },

// READABLE (for understanding):
isReadOnly() {
  return false;
},
ignoresWholeToolAllowRule() {
  return true;
},
suppressesAlwaysAllowRule() {
  return true;
},
toAutoClassifierInput(input) {
  return `requeue session=${input.session_id} off runner=${input.runner_id}`;
},
async checkPermissions(input, context) {
  if (getPermissionMode(context).mode === "auto") {
    return { behavior: "passthrough", message: "Requeueing a runner session requires classifier review." };
  }
  return {
    behavior: "ask",
    message: `Requeue session ${input.session_id} off runner ${input.runner_id}? This re-launches the session on another runner in the environment.`,
  };
},

// Mapping: e→input, t→context, mn→getPermissionMode
```

## 5. Critical edge cases

- `read_health` and `read_metrics` accept any integer port; port 0 is disabled, while invalid negative
  or out-of-range ports fail through the HTTP client and return `unreachable`.
- Admin list responses use permissive object schemas. Server-added fields flow through to the model;
  server-side redaction remains part of the trust boundary.
- `list_sessions` URL-encodes both pool ID and optional status.
- Requeue URL-encodes session ID and passes runner ID only in JSON.
- Spawn writes the PID file after `unref`. If that write fails, the detached runner may already be
  alive even though the tool reports failure.
- Log-tail redaction reduces credential exposure but cannot prove arbitrary sensitive business data is
  safe; operators should still control which log path is supplied.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `selfHostedRunnerApiRequest` (`U8e`) - OAuth/API membrane.
- `buildRunnerAdminUiEquivalent` (`F8e`) - repeatable UI path.
- `serializeRunnerToolResult` (`vre`) - final JSON redaction seam.
- `parseRunnerPrometheusGauges` (`iaS`) - selected metric aggregation.
- `runnerHealthTool` (`T7p`) - local health probe.
- `runnerMetricsTool` (`x7p`) - local metric probe.
- `tailRunnerLogTool` (`B7p`) - file tail and redaction.
- `spawnLocalRunnerTool` (`P7p`) - detached process launch.
- `requeueRunnerSessionTool` (`R7p`) - permission-sensitive repair.
