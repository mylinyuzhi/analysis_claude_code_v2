# Credential masking, JWT preservation, and AWS SigV4 repair

## Version result and carryover trap

The 2.1.221 changelog says `mode: "mask"` was added for credential files, and 2.1.224 advertises its
structured/JWT/AWS extensions. The 2.1.220 baseline already contains the core sentinel masking engine,
including six `onExtractNoMatch` sites and twelve `maskClaims` sites. Therefore this report does not
mislabel the engine itself as net-new in the window.

What the 2.1.227 target proves is substantial expansion and public integration:

- `onExtractNoMatch`: 24 target sites versus 6 baseline sites.
- `maskClaims`: 22 target sites versus 12 baseline sites.
- `awsPairs`: 39 target sites versus none in the baseline.
- The settings schema states that the advanced credential block is honored only from user, managed, or
  explicit `--settings` sources, and the runtime requires TLS termination for egress substitution.

This is a useful release-analysis distinction: 2.1.221 can be the release that made a dormant mechanism
reachable while the mechanism's code was already present in 2.1.220. The target/baseline diff proves the
AWS repair layer is new to the window; it does not prove the core sentinel transform was first written
there.

### Selective Capture and Sentinel Replacement

**What it does:** Replaces a whole secret or selected capture-group spans with opaque sentinels while
preserving enough surrounding structure for software inside the sandbox to parse its configuration.

**How it works:**
1. `replaceCapturedSecrets` (`AAo`, `:156433-156471`) compiles the configured regular expression with
   global and match-index flags. Capture group 1 is mandatory on every match; an undefined group is a
   configuration error, while an empty group is ignored.
2. Equal secret values share one logical capture index and one sentinel. This makes repeated appearances
   deterministic and avoids allocating multiple real-secret registry entries.
3. Match spans are recorded against the original string. Optional `maskDuplicates` searches for the same
   value outside explicit regex matches and adds non-overlapping replacements, longest secret first.
4. Replacements are applied in source order, leaving every unselected byte intact.
5. The credential registry stores sentinel-to-real-value mappings together with allowed injection hosts;
   the sandboxed process receives only the transformed string.

**Why this approach:**
- Whole-file denial is safe but breaks clients that must parse JSON, YAML, `.netrc`, URLs, or composite
  credentials before sending a request.
- A capture-group contract makes the administrator choose exactly which substring is secret instead of
  guessing from file format.
- Reusing a sentinel for duplicate values improves consistency but exposes equality between secret spans;
  that is the accepted trade-off for deterministic reverse substitution.
- Regex extraction is flexible across formats but configuration-sensitive, which is why no-match handling
  is a first-class policy rather than a silent success.

**Key insight:** The sandbox does not receive encrypted credentials. It receives syntactically useful
decoys whose opaque markers are meaningful only to the egress proxy.

### Masked File and Environment Construction

**What it does:** Converts configured credential files and environment variables into sandbox-visible
sentinel forms and returns the extra deny/unset actions needed when masking cannot be applied safely.

**How it works:**
1. `maskCredentialFiles` (`G1u`, `:156542-156639`) accepts only regular UTF-8 file content. Directories,
   binary files, unreadable files, and unsupported platform cases are not transformed.
2. Whole-file mode registers the full text as one secret. Extract mode runs the capture algorithm;
   `decode: "jwt"` first verifies JWT structure and substitutes a structurally valid fake token.
3. `MaskedFileStore` (`Lvs`, `:156519-156540`) writes generated copies under a private temporary directory
   with mode `0600`; its plan binds each fake path over the corresponding real path inside the sandbox.
4. `maskCredentialEnvironment` (`V1u`, `:156645-156721`) performs the same operations in memory and returns
   a `setEnvVars` map. The host environment remains unchanged.
5. `buildCredentialSandboxPlan` (`nHs`, `:159233-159250`) composes explicit deny entries, values that
   degraded to deny/unset, masked binds, and the AWS pair registry into one execution plan.
6. The temporary store is disposed after use, removing the sentinel copies recursively.

**Why this approach:**
- A bind-mounted copy lets unmodified applications open the expected pathname; rewriting application
  configuration or intercepting every file read would be more invasive.
- Environment values need no filesystem indirection, so returning a child-process environment overlay is
  cheaper and avoids mutating the parent process.
- UTF-8-only support rejects cases where byte-preserving text replacement cannot be guaranteed.
- The macOS fallback to deny reflects platform enforcement limits: partial usability is not worth exposing
  the real file when the expected overlay cannot be enforced.

**Key insight:** File masking and environment masking are two front ends to one registry. Their outputs
must be created before process launch so every sentinel the child can see already has a host-scoped
reverse-substitution rule.

### No-match Policy

**What it does:** Makes a failed extraction explicit and configurable instead of silently exposing the
real value under the assumption that masking succeeded.

**How it works:**
1. A missing regex match or a JWT with no selected string claim enters the no-match branch.
2. `warn` logs prominently and leaves the real value visible; it preserves compatibility but is fail-open.
3. `deny` converts a file entry into an additional read deny, or an environment entry into an unset name.
4. `error` aborts sandbox-plan construction with an actionable configuration error.
5. In combinations where a later filesystem allow rule could neutralize a degraded file deny, the
   effective policy is rewritten to `error`; this prevents an administrator's intended fail-closed mode
   from becoming inert.

**Why this approach:**
- A single universal failure mode cannot fit both development and production: developers often prefer a
  warning, while managed environments need startup failure or denial.
- Separating `deny` from `error` preserves two distinct guarantees: the command may still run without the
  credential, or it must not run at all.
- The trade-off is configuration complexity. The runtime compensates with schema validation and detailed
  messages naming the exact entry and remediation.

**Key insight:** `onExtractNoMatch` controls what happens to the *real* credential, not merely whether a
warning is printed. Its strongest modes alter the filesystem/environment plan.

### JWT Claim-preserving Masking

**What it does:** Hides selected top-level string claims while preserving the three-part JWT shape and
unmasked metadata that a client may inspect locally.

**How it works:**
1. `isStructurallyValidJwt` (`wAo`, `:156480-156485`) requires three segments, a JSON header containing
   `alg`, and a decodable JSON payload.
2. `maskJwtClaims` (`CAo`, `:156495-156513`) decodes the payload and selects only requested claims whose
   values are strings.
3. Each selected claim receives its own registry sentinel. Non-selected claims remain unchanged.
4. The payload is re-encoded, the original header is retained, and a fixed fake signature is appended.
5. Whole-token JWT masking instead produces a generic valid-looking token with a distant expiration, so
   clients that only check format or expiry continue to the network request.

**Why this approach:**
- Replacing a JWT with an arbitrary marker breaks libraries that parse claims before sending it.
- Keeping non-secret claims supports routing and audience checks, but it intentionally reveals those
  claims inside the sandbox. Administrators must list every sensitive string claim.
- Re-signing a fake local token is unnecessary: it is never meant for upstream validation, only local
  structural checks before egress substitution restores the original value.

**Key insight:** Claim masking preserves semantic shape, not cryptographic validity. The proxy—not the
sandboxed client—is responsible for restoring the real credential before the upstream sees it.

### AWS Pair Registration and SigV4 Repair

**What it does:** Allows AWS clients to sign with sandbox sentinels and then repairs ordinary header-based
SigV4 requests at the TLS-terminating proxy using the real credential pair.

**How it works:**
1. `registerAwsCredentialPairs` (`Q1u`, `:156728-156768`) reads explicit `awsPairs` and adds the conventional
   `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY`/`AWS_SESSION_TOKEN` tuple unless those names are already
   claimed.
2. A pair registers only when both access-key and secret variables use whole-value mask mode and both real
   host values exist. Partial masking emits a warning because the proxy could not recognize the key used
   in the request.
3. The registry maps the access-key sentinel to real key ID, real secret, optional session token, and
   permitted injection hosts.
4. `planAwsSigV4Repair` (`Z1u`, `:156773-156838`) detects header, streaming, presigned, and SigV4a shapes.
   A request is ignored unless its sentinel is registered and the destination matches an allowed host.
5. Unsupported streaming, presigned, and SigV4a shapes default to deny. An explicit `passthrough` forwards
   them unchanged, with the warning that the placeholder-derived signature will fail upstream.
6. For ordinary header SigV4, malformed authorization, missing date, or missing signed headers fail closed.
   Otherwise the proxy injects the real session token, recomputes the payload hash when necessary, rebuilds
   the canonical request, derives the AWS signing key, and replaces `Authorization`.

**Why this approach:**
- Simply substituting the secret after a client has signed is insufficient: the signature authenticates
  the sentinel, so upstream rejects it.
- Re-signing at a TLS-terminating proxy is the only point that has the cleartext request, real secret, and
  final destination together.
- Denying unsupported shapes is safer than forwarding a request known to carry an invalid signature;
  `passthrough` exists for diagnostic compatibility, not successful authentication.
- Full streaming re-signing would require rewriting chained per-chunk signatures and the body stream,
  adding substantial complexity and buffering risk.

**Key insight:** `awsPairs` closes a cryptographic gap in generic sentinel substitution. AWS credentials
cannot be restored as a string alone; every signature derived from them must also be repaired.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `replaceCapturedSecrets` (`AAo`) - capture-group based substitution.
- `maskJwtClaims` (`CAo`) - claim-preserving JWT transformation.
- `maskCredentialFiles` (`G1u`) - fake-file and deny-degradation plan.
- `maskCredentialEnvironment` (`V1u`) - child-environment masking plan.
- `registerAwsCredentialPairs` (`Q1u`) - pairs sentinels with real AWS signing material.
- `planAwsSigV4Repair` (`Z1u`) - request-shape adjudication and re-sign plan.
