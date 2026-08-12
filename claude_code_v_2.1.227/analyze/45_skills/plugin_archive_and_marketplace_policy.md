# Archive plugin sources and managed marketplace owner wildcards

## Version result

The archive source is a verified 2.1.220→2.1.227 window addition. The discriminated source schema
`source: "archive"` occurs in the target at `:56740` and has no corresponding baseline site. The same is
true for the managed-policy literal `owner/*`. Changelog attribution places archive sources in 2.1.224
and owner wildcards in 2.1.223; the binary corpus proves only their presence by 2.1.227.

### Archive Source Contract

**What it does:** Adds a plugin distribution type that needs neither git nor npm: an HTTPS zip with an
optional 64-hex-character SHA-256 pin.

**How it works:**
1. `archivePluginSourceSchema` (`BUg`, `:56738-56761`) accepts only `source: "archive"`, an HTTPS URL that
   passes the archive URL policy, and an optional SHA-256 digest.
2. The schema permits the plugin root at the archive root or under one wrapper directory. It explicitly
   documents that the digest is both an integrity pin and a fallback version identity.
3. The archive variant is part of the same plugin-source union as npm, git, GitHub, git-subdir, and
   unsupported placeholders (`:56762-56826`). Downstream cache/install code therefore dispatches on one
   discriminant rather than maintaining an archive-only install path.
4. Marketplace HTTP headers may authenticate the archive only when the marketplace URL and archive URL
   have the same origin.

**Why this approach:**
- A zip source supports static artifact servers and enterprise repositories without requiring a package
  registry or repository checkout on the client.
- A discriminated union gives validation and exhaustiveness at one boundary; an arbitrary URL heuristic
  would conflate git repositories, catalogs, and opaque archives.
- Optional pinning balances usability and supply-chain assurance. Unpinned installs remain possible, but
  the downloaded digest is still computed for identity and diagnostics.
- Allowing one wrapper directory matches common release archives while avoiding an unbounded search for a
  plausible plugin root.

**Key insight:** The digest has two roles. It authenticates bytes when configured, and it supplies stable
version identity when ordinary manifest/marketplace version metadata is absent.

### Bounded Download, Redirect, and Header Policy

**What it does:** Fetches archive bytes while preventing redirect-based credential leakage, unsafe target
schemes, unbounded payloads, and silent integrity drift.

**How it works:**
1. `downloadPluginArchive` (`_pd`, `:243178-243209`) rejects the initial URL unless it satisfies the
   archive URL policy.
2. It downloads as an array buffer with a fixed timeout, maximum content length, at most five redirects,
   and an explicit Claude Code user agent.
3. `buildArchiveRedirectGuard` (`BE_`, `:243234-243246`) revalidates every redirect hop; one bad hop aborts
   the chain rather than relying only on the final URL.
4. `stripCrossOriginArchiveHeaders` (`bpd`, `:243214-243223`) removes inherited marketplace headers when a
   redirect crosses origins. The header-name list excludes the generated user agent.
5. The completed byte buffer is hashed with SHA-256. A configured mismatch aborts before extraction and
   reports expected and actual digests.
6. Telemetry records success/failure and elapsed time, but rendered URL helpers redact user information.

**Why this approach:**
- Redirect validation must be per-hop because an apparently safe final URL could be reached through a
  disallowed local/metadata endpoint, and credentials can leak on the first redirected request.
- Same-origin header inheritance enables private artifact servers without forwarding bearer headers to an
  unrelated CDN selected by the server.
- Hashing before extraction prevents malformed or malicious content from reaching filesystem processing
  when a pin is present.
- Buffering simplifies hash verification and zip parsing but consumes memory proportional to the bounded
  archive size; the maximum content length is the compensating control.

**Key insight:** The security boundary is the redirect chain, not merely the requested URL. URL policy and
credential policy are evaluated again at every hop.

### Extraction, Root Selection, and Atomic Promotion

**What it does:** Turns verified zip bytes into exactly one plugin-shaped cache directory without leaving
partial installs or accepting an arbitrary nested directory as the root.

**How it works:**
1. `installPluginArchive` (`AH_`, `:250911-250959`) extracts into a sibling temporary directory, never the
   final cache path.
2. It rejects archives containing no meaningful entries after ignoring macOS metadata.
3. `selectArchivePluginRoot` (`Qmn`, called at `:250929`) promotes one wrapper directory when present.
4. When a marketplace entry declares component paths, those paths must resolve under the selected root.
   The resolver may test one alternate wrapper or the raw archive root, but does not recursively hunt.
5. The selected root is passed through the ordinary manifest parser in probe mode. If the entry did not
   explicitly declare components, the root must contain `.claude-plugin/` or one recognized top-level
   plugin component family.
6. Only after all checks pass is the directory renamed into the cache path. A `finally` block removes the
   extraction directory on every outcome.

**Why this approach:**
- Extract-then-rename gives the cache an atomic visibility boundary: consumers see either no plugin or a
  completely validated one.
- Root-shape validation prevents a zip of unrelated files from becoming an implicitly trusted plugin.
- Declared component paths are stronger evidence than generic shape detection, so they guide wrapper
  selection when available.
- A recursive search would be friendlier to unusual archives but could choose an attacker-controlled or
  accidental nested plugin; the one-wrapper rule is deliberately predictable.

**Key insight:** The installer validates both *archive safety* and *semantic shape*. A valid zip with the
correct digest is still refused if its root cannot satisfy the marketplace's component contract.

### Version Selection for Unversioned Archives

**What it does:** Produces an update identity even when neither the plugin manifest nor marketplace entry
declares a conventional version.

**How it works:**
1. `resolveCachedPluginVersion` (`sCe`, `:248083-248113`) prefers manifest version, then marketplace entry
   version, then source-specific identity.
2. For archive sources, the configured SHA-256 is preferred; otherwise the just-downloaded content digest
   is used.
3. Only the first twelve lowercase hex characters become the visible/cache version string.
4. If a conventional version is declared, changing only the digest does not constitute the update signal;
   the version metadata remains authoritative.

**Why this approach:**
- Content addressing gives unversioned static artifacts deterministic identity without inventing mutable
  timestamps.
- Preferring declared semantic versions preserves normal plugin update behavior and human-readable release
  tracking.
- Truncating the digest improves display and path ergonomics at negligible collision risk for this local
  identity use, though it is not a substitute for full-digest integrity verification.

**Key insight:** Full SHA-256 protects installation; a short digest labels it. Those operations use the
same hash but have different collision requirements.

### Managed GitHub Owner Wildcards

**What it does:** Lets an administrator allow or block every marketplace repository owned by one GitHub
organization using exactly `owner/*`, without turning the policy surface into a general glob matcher.

**How it works:**
1. `parseOwnerWildcard` (`OZu`, `:215588-215591`) accepts only a string ending in `/*` whose owner passes
   the same safe repository-segment validator used elsewhere.
2. `matchesRepositoryOwner` (`wp_`, `:215593-215599`) accepts exactly two valid `owner/repo` segments and
   compares the owner.
3. `isMarketplaceSourceAllowed` (`BZu`, `:215696-215725`) applies owner wildcard matching only when both
   candidate and policy source are GitHub. It also enforces compatible `ref` and `path` constraints.
4. Other `*` forms log an error and fall back to literal equality; they do not become broad glob patterns.
5. The blocklist uses the parallel `qIo` matcher and performs a case-insensitive owner comparison after
   repository normalization.
6. Allow/block checks occur before downloading, so a denied source does not touch the cache filesystem.

**Why this approach:**
- Organization-wide policy avoids enumerating every repository in a managed setting.
- Limiting the syntax to one terminal wildcard prevents path/ref wildcards from creating hard-to-audit
  matches or unexpected cross-host equivalence.
- Invalid wildcard syntax fails narrow rather than broad: a malformed policy can block too little, but it
  cannot accidentally allow every source.
- Matching remains source-aware; `owner/*` is not interpreted for raw git URLs or local paths.

**Key insight:** This is a typed policy sentinel, not general glob support. Its deliberately small language
makes the administrator's blast radius visible from one string.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `downloadPluginArchive` (`_pd`) - bounded fetch, redirect validation, and digest verification.
- `installPluginArchive` (`AH_`) - extraction and semantic root validation.
- `resolveCachedPluginVersion` (`sCe`) - version precedence and digest fallback.
- `parseOwnerWildcard` (`OZu`) - validates the sole supported wildcard form.
- `isMarketplaceSourceAllowed` (`BZu`) - applies managed allowlist semantics.
