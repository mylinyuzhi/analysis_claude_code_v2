# Sandbox runtime in 2.1.227

The 2.1.227 sandbox is a policy adapter plus three platform backends. Settings are first merged under
trust-aware rules, then compiled into a common network/filesystem/credential plan. Linux renders that plan
as bubblewrap mounts plus namespaces and seccomp, macOS renders a Seatbelt profile, and Windows combines a
provisioned low-privilege account, session ACLs, and `srt-win exec`. A loopback proxy is the common network
decision and credential-injection boundary.

## 1. Policy construction

### Trust-aware sandbox configuration merge

**What it does:** Combines managed, CLI, user, project, local, host, and session policy without allowing a
less-trusted source to relax a restriction imposed by a more-trusted source.

**How it works:**
1. `buildSandboxRuntimeConfig` (`w_r`) gathers domain rules from sandbox settings and legacy WebFetch
   permission rules.
2. When `allowManagedDomainsOnly` is active, only managed allow entries are admitted; user, project, and
   session-approved hosts cannot widen the set.
3. Denied domains accumulate and retain reason strings. Network `strictAllowlist` is enabled if any
   trusted settings tier enables it.
4. Filesystem write grants are gathered from the applicable settings, while mandatory config, secrets,
   plugin, job, daemon, hook, skill, and state paths are added to deny sets.
5. Deny spellings are resolved through symlinks where safe; both literal and canonical forms are retained
   where later retargeting is possible.
6. `allowManagedReadPathsOnly` limits read reopenings to managed entries.
7. Credential denies and masks are merged with deny-over-mask precedence, platform capability degradation,
   canonical-path collision handling, and trusted-tier injection stripping.
8. `resolveFilesystemPolicy` (`rMe`) chooses strict versus relaxed. Scrub mode and Windows force strict;
   an explicit trusted setting wins; `relaxedIfForced` relaxes only when sandboxing was not explicitly
   enabled.
9. The result contains normalized network, filesystem, credential, git-safe-directory, seccomp, proxy,
   and platform fields for the sandbox runtime.

**Why this approach:**
- Sandbox policy is security-sensitive configuration, so ordinary last-writer-wins merging would let a
  project weaken an administrator restriction.
- Carrying canonical and lexical paths prevents a symlink spelling from changing the protected object
  between configuration and command execution.
- A single adapter keeps backend behavior aligned while still exposing platform constraints explicitly.
- The merge is complex and conservative; ambiguous masks may lose injection or degrade to denial rather
  than risk exposing real bytes.

**Key insight:** Restrictive values compose as a ratchet, while grants are scope-sensitive. The merge is
not symmetric because allowing and denying do not carry the same authority.

Evidence: filesystem-policy selection at `cli_inner_pretty.js:176775-176808`; domain policy at
`176810-176840`; `w_r` at `177047-178131`.

### Relaxed-filesystem semantics and per-command overlays

**What it does:** Separates network confinement from filesystem confinement and safely overlays additional
per-command restrictions without pretending every backend supports the same mutations.

**How it works:**
1. A relaxed filesystem compiles to write access for `/` and no sandbox read-deny plan.
2. Credential file entries in `deny` mode join the read-deny set only when filesystem enforcement is
   active; environment deny/mask and Linux file-mask sentinel binds remain independent.
3. `buildCredentialSandboxPlan` (`nHs`) returns unset environment names, sentinel replacements, masked
   file binds, and mask failures that must degrade to read denial.
4. `wrapSandboxCommand` (`kBu`) uses per-command filesystem/network/credential settings when supplied and
   otherwise the session configuration.
5. On Linux/macOS, per-command allow and deny paths are normalized for that invocation.
6. On Windows, session-level allow grants and ACL denies are already stamped. Per-command read/write
   grants are rejected; only additional denies not already in the session ACL are passed to `srt-win`.
7. Configuration updates on Windows compare the resolved access snapshot and warn that a reset plus
   reinitialize is required if session ACL material changed.

**Why this approach:**
- Some deployments want only egress confinement, so disabling filesystem policy must not disable the
  proxy or environment masking.
- Overlaying restrictions is safe; silently overlaying unsupported grants would create platform-specific
  privilege expansion.
- Windows ACLs are session-wide state rather than per-process namespaces, making live grant mutation
  unsafe.
- The trade-off is asymmetric configuration behavior that callers must surface rather than normalize
  away.

**Key insight:** `filesystem.disabled` disables one enforcement plane, not the sandbox as a whole. Network
proxying and environment credential protection continue independently.

Evidence: `nHs`, `M5y`, `O5y`, and `N5y` at `cli_inner_pretty.js:159233-159309`; per-command wrappers at
`159408-159562`.

## 2. Network boundary

### Deny-first domain decision

**What it does:** Decides every proxied TCP destination using normalized host/port rules, with deterministic
denial under strict allowlisting and an optional user callback otherwise.

**How it works:**
1. `authorizeSandboxNetworkRequest` (`aBu`) rejects the request when runtime policy is unavailable or the
   host is malformed.
2. It normalizes IP/host syntax before matching.
3. Denied-domain rules are checked first and may supply a policy-specific reason.
4. Allowed-domain rules are checked second, including optional port constraints.
5. With no match, absence of a permission callback or `strictAllowlist:true` produces an immediate deny.
6. Otherwise the host and port are passed to the user permission callback.
7. Callback denial and callback failure both deny; every denial is added to the violation stream with an
   encoded command identity.

**Why this approach:**
- Deny precedence prevents a broad allow such as `*.example.com` from overriding a sensitive subdomain.
- Strict mode must be deterministic for managed deployments and headless runs where a prompt is either
  unavailable or itself undesirable.
- Host normalization closes representation differences before wildcard and port matching.
- Interactive prompting improves usability in non-strict mode, at the cost of a request-time round trip.

**Key insight:** An allowlist miss has two meanings: strict policy treats it as a final decision; ordinary
policy treats it as a request for delegated user authority.

Evidence: `aBu` at `cli_inner_pretty.js:158979-159000`; managed-domain preflight at
`176831-176840`.

### Proxy, TLS termination, and credential-injection ordering

**What it does:** Forces sandboxed network traffic through one multiplexed HTTP/SOCKS boundary where host
policy, request filtering, credential substitution, and SigV4 repair can be applied in a safe order.

**How it works:**
1. `initializeSandboxRuntime` (`D5y`) rejects simultaneous TLS termination and an external MITM proxy.
2. It creates or loads the CA, validates platform dependencies, and starts violation monitors.
3. The mux proxy routes both HTTP and SOCKS requests through the domain filter.
4. HTTP requests then pass the optional method/URL request filter.
5. For terminated TLS, header/body sentinels are substituted only for credentials whose injection host
   rules match.
6. AWS SigV4 planning runs after substitutions are known, so supported requests can be re-signed with the
   real credential; unsupported shapes follow explicit deny/passthrough policy.
7. `tlsTerminate.excludeDomains` skips interception and warns if a credential would otherwise inject for
   that host, because the upstream will see only the sentinel.
8. Linux creates network namespaces bridged to the local proxy; macOS Seatbelt and Windows WFP permit only
   the selected loopback proxy path.

**Why this approach:**
- Substitution at egress keeps real secrets out of the sandboxed process.
- TLS termination is required to inspect and repair HTTPS headers/bodies; excluded traffic cannot safely
  receive injected credentials.
- A single mux port reduces backend rules and Windows filter range pressure.
- Interception adds CA management and compatibility cost, so explicit exclusions and an external MITM
  alternative remain available.

**Key insight:** Network authorization happens before secret restoration. A credential never turns an
otherwise denied destination into an allowed one.

Evidence: proxy decision and construction at `cli_inner_pretty.js:159002-159066`; initialization at
`159068-159192`; credential algorithms are expanded in
[`credential_masking_and_sigv4.md`](credential_masking_and_sigv4.md).

## 3. Platform compilers

### Linux mount-order and symlink containment algorithm

**What it does:** Compiles read denies, write grants, nested write denies, and credential sentinels into a
bubblewrap mount order that cannot accidentally re-expose a protected path.

**How it works:**
1. `compileLinuxMountPlan` (`d5y`) starts with a read-only root and bind-mounts only verified existing
   write grants.
2. Write-grant symlinks that resolve outside the expected spelling are rejected.
3. Nested deny-write paths are resolved with a bounded partial resolver. An unresolved path inside a
   writable area is blocked at its creatable ancestor with `/dev/null` or an empty read-only directory.
4. Read-denied directories become tmpfs mounts; explicitly allowed descendants and write grants are
   rebound into those hidden regions.
5. Read-denied files become `/dev/null` read-only binds; Linux credential masks bind sentinel files at the
   canonical target.
6. Deny-write binds already covered by a read-deny tmpfs are skipped.
7. Because later deny-write binds may expose an earlier hidden descendant, the algorithm reapplies
   affected read-deny tmpfs mounts and file masks after write-deny processing.
8. `wrapLinuxSandboxCommand` (`_Nu`) adds network, PID, user, and optional seccomp namespaces, environment
   mutation, proxy bridges, git-safe configuration, then invokes the resolved shell.

**Why this approach:**
- Linux mount operations are order-dependent; a later parent bind can undo a child mask.
- Blocking the nearest creatable ancestor prevents a command from creating a path that did not exist at
  planning time.
- Rebinding legitimate children preserves usability inside broadly denied trees.
- The algorithm favors redundant remounts over a smaller but fragile argument list; Windows handles its
  separate argv budget explicitly.

**Key insight:** The final reapplication pass is essential. Correct individual mounts are insufficient if
a later bind changes the visible mount tree beneath them.

Evidence: `d5y` at `cli_inner_pretty.js:157269-157485`; `_Nu` at `157487-157603`.

### macOS deny-default profile compilation

**What it does:** Renders the common plan into a Seatbelt profile that permits only essential process and
system services, selected proxy sockets, and computed filesystem access.

**How it works:**
1. `compileMacSandboxProfile` (`g5y`) begins with `deny default` and explicitly adds process, same-sandbox
   signal, device, sysctl, preference, and narrowly listed Mach services.
2. Network-unrestricted commands receive `network*`; restricted commands receive only configured loopback
   proxy ports, optional local binding, and selected Unix sockets.
3. Read rules start allow-by-default then layer denies and explicit reopenings, including directory
   metadata needed to traverse protected regions.
4. Write rules allow only declared roots and then apply mandatory denies for sensitive project/config/git
   paths.
5. Delete/create operations on ancestors of denied targets are also denied, preventing replacement of a
   protected descendant by renaming its parent.
6. Linux-only file masks degrade to read denial on macOS before profile construction.
7. `wrapMacSandboxCommand` (`ANu`) injects proxy/CA variables, unsets or replaces credential variables,
   and invokes `sandbox-exec -p <profile>` through the resolved shell.

**Why this approach:**
- Seatbelt is rule-based rather than a mount namespace, so all required host services must be enumerated.
- Ancestor mutation protection closes a common path-replacement escape.
- Degrading masks to deny preserves secrecy but sacrifices clients that require a parseable sentinel.
- A deny-default profile is verbose, but makes missing privileges fail closed.

**Key insight:** Filesystem protection covers object identity, not only byte access; blocking parent
replacement prevents a command from swapping the protected object out from under the policy.

Evidence: read/write rule builders and `g5y` at `cli_inner_pretty.js:157684-158020`; `ANu` at
`158024-158100`.

### Windows provisioned-user and ACL lifecycle

**What it does:** Runs commands as a dedicated sandbox user, combines WFP egress filters with session ACL
stamps, and restores host ACLs during teardown.

**How it works:**
1. Initialization resolves the `srt-win` executable and requires both the provisioned sandbox user and
   stored credential.
2. A WFP self-test verifies that the sandbox user cannot bypass the configured proxy range.
3. TLS termination validates that the sandbox user's Root store contains the expected CA thumbprint.
4. `buildWindowsFilesystemPlan` (`N5y`) normalizes session read/write grants and denies, including
   credential-file denies.
5. Grants are stamped for the sandbox SID, and denies are stamped with the current holder PID so recovery
   can identify their owner.
6. `wrapSandboxCommandArgv` (`K5y`) passes command, proxy, environment, cwd, per-exec additional denies,
   git-safe directories, shell, and CA paths as an argv array with shell execution disabled.
7. Command-line length and mapped-drive failures are translated into actionable errors.
8. Cleanup revokes grants and restores deny ACLs. Unexpected per-path outcomes warn that an ACE may remain
   and name the recovery command.

**Why this approach:**
- Windows lacks the per-process mount namespace used on Linux, so a separate user and ACL boundary is the
  available filesystem primitive.
- Holder-PID stamping makes crash recovery possible without blindly removing ACLs belonging to a live
  session.
- WFP validation proves network containment rather than trusting installation state.
- Session-wide ACLs make dynamic policy changes expensive and require explicit reinitialization.

**Key insight:** Windows enforcement is stateful on the host filesystem. Therefore startup verification
and teardown recovery are part of the security boundary, not optional housekeeping.

Evidence: Windows probes and install/status functions at `cli_inner_pretty.js:158246-158859`; ACL
application at `159093-159165`; teardown at `159624-159684`.

## 4. Lifecycle and observability

### Lazy initialization and hard/soft failure policy

**What it does:** Starts sandbox infrastructure only when a command needs it while distinguishing a
recoverable optional failure from a policy-mandated refusal to run unsandboxed.

**How it works:**
1. Platform support, managed `enabledPlatforms`, dependency probes, feature state, and session-disable
   state determine whether the sandbox can be active.
2. `ensureSandboxInitialized` (`KGu`) lazily invokes initialization on the first sandboxed command.
3. `initializeSandbox` (`XGu`) builds the current trusted config, initializes the runtime, and subscribes
   to settings changes for live non-ACL configuration updates.
4. Concurrent callers share one initialization promise.
5. Failure clears that promise, records a user-facing reason, and emits telemetry.
6. If `failIfUnavailable` or the scrub environment requires sandboxing, the command fails and restart is
   required.
7. Otherwise the runtime marks sandboxing disabled for the remainder of the session and returns a clear
   error for the triggering attempt; later policy avoids repeatedly attempting a known-bad initialization.
8. Reset unsubscribes settings and tears down platform resources, allowing a deliberate fresh attempt.

**Why this approach:**
- Lazy startup avoids proxy, CA, and monitor cost for sessions that never execute sandboxed commands.
- A shared promise prevents duplicate proxy listeners and ACL setup under concurrent Bash calls.
- Managed deployments need a fail-closed option; local defaults preserve usability on unsupported or
  incompletely installed machines.
- Session latching avoids repeated slow failures, with restart/reset as the explicit recovery boundary.

**Key insight:** Optional failure does not silently run the same triggering command unsandboxed. It
disables the feature for future policy decisions and reports that a restart is needed.

Evidence: availability decisions at `cli_inner_pretty.js:178288-178369`; `KGu` and `XGu` at
`178482-178587`.

### Command-correlated violation reporting

**What it does:** Captures enforcement denials from different operating systems, correlates them with the
originating Bash command, and makes the details visible to the model without cluttering the terminal UI.

**How it works:**
1. `SandboxViolationStore` (`Iln`) sanitizes control characters, keeps the latest 100 records, and tracks a
   lifetime total separately.
2. Command text is mapped to a bounded opaque encoded ID before process launch.
3. macOS parses tagged Seatbelt log records; Linux receives structured seccomp events on a private Unix
   socket. Both recover the original command where possible.
4. Configured ignore rules match global message substrings or command-specific substrings before storage.
5. Network and request-filter denials feed the same store.
6. `annotateStderrWithSandboxFailures` (`tWy`) selects only records for the completed command and appends
   them inside `<sandbox_violations>` tags to the Bash stderr returned to the model.
7. The terminal renderer strips that tagged block from its normal stderr display.
8. Monitors are best-effort observability: monitor startup failure warns but does not weaken the already
   active kernel/Seatbelt enforcement.

**Why this approach:**
- The model needs the denied path/host to choose a different action instead of blindly retrying.
- Command correlation prevents concurrent Bash results from receiving each other's violations.
- Bounded storage and sanitization control memory and terminal/prompt injection risk.
- Hiding the structured block from normal UI avoids duplicate noisy diagnostics while preserving model
  feedback.

**Key insight:** Violation monitoring observes an enforcement decision; it does not make the decision.
Failure of the monitor loses explanation, not confinement.

Evidence: `Iln` and platform monitors at `cli_inner_pretty.js:157627-158233`; `tWy` at
`159689-159696`; terminal stripping at `725631-725665`.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `buildSandboxRuntimeConfig` (`w_r`) - Performs trust-aware settings adaptation.
- `initializeSandboxRuntime` (`D5y`) - Starts proxies and platform enforcement.
- `authorizeSandboxNetworkRequest` (`aBu`) - Implements deny-first host policy.
- `compileLinuxMountPlan` (`d5y`) - Orders Linux filesystem mounts safely.
- `compileMacSandboxProfile` (`g5y`) - Renders the macOS Seatbelt profile.
- `wrapSandboxCommandArgv` (`K5y`) - Builds the platform argv/environment wrapper.
- `ensureSandboxInitialized` (`KGu`) - Applies hard/soft lazy-init policy.
