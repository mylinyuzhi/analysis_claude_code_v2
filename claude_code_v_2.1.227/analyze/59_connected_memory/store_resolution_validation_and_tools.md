# Store resolution, validation, and tool behavior

Target anchors: `cli_inner_pretty.js:371391-371436`, `:554933-555185`, `:555281-555642`, and
`:555828-555959`.

## 1. Availability and store identity

### Memory Session Availability Gate

**What it does:** Fails memory operations closed when the session should not contact or expose a
connected memory store.

**How it works:**
1. A paused memory session returns `refused/paused`.
2. A workspace without accepted trust returns `refused/trust_pending`.
3. A session that loses policy, traffic-mode, or sign-in eligibility returns `refused/unavailable`.
4. Only then can the resolver inspect connected mounts.
5. Tool enablement is narrower still: remote/headless shape is excluded, sync availability must hold,
   a product gate must be enabled, and `orgMemoryRead` must not be false (`:371407-371414`).

**Why this approach:**
- Trust is checked at call time, not only when stores connect, because workspace status can change.
- Returning typed refusals lets tool results explain recovery rather than leaking transport errors.
- A single gate makes list/read/write consistent; duplicating checks in each tool would drift.
- The trade-off is that a transient sign-in or traffic change makes already mounted stores appear
  unavailable until eligibility is restored.

**Key insight:** “Tool is registered” and “operation is currently allowed” are separate states. The
resolver rechecks the latter for every call.

### Public Store-ID Derivation

**What it does:** Produces short model-facing store IDs from mount paths without requiring internal
store identifiers in prompts.

**How it works:**
1. Take the final normalized path segment, or fall back to the mount name.
2. Find the store's position in the current connected-store order.
3. Count prior stores with the same basename.
4. Use the basename for the first and append `#2`, `#3`, and so on for later collisions.
5. Grouping-root stores are ordered before project stores when producing prompt context.

**Why this approach:**
- Short IDs are readable and copyable in tool calls.
- Positional suffixes solve common basename collisions without exposing opaque backend IDs.
- Stable opaque IDs would survive reorderings better, but would consume prompt space and be harder for
  users to recognize.
- The current set can change during a session, so prompts explicitly tell the model to relist when
  uncertain.

**Key insight:** The ID is a projection of the current connection set, not a globally stable store
identity. Tools always resolve it against the live set.

### Store Resolution

**What it does:** Converts a public ID into a backend with the correct read/write capability, or a
specific refusal.

**How it works:**
1. Run the session availability gate.
2. Distinguish no stores from a still-connecting store manager.
3. Search live stores by the derived public ID.
4. On a miss, return all current IDs and instruct the caller to run `memory_list`.
5. For a write, require the selected mount, its path capability, and organization policy all to grant
   read-write access.
6. Construct the backend in `rw` or `ro` mode only after capability resolution.

**Why this approach:**
- Central resolution prevents a writable backend from being created before policy checks.
- Enumerating valid IDs turns reordering/staleness into a recoverable model action.
- Throwing exceptions would be simpler internally but would lose the difference between unbound,
  unknown, read-only, and unavailable states.

**Key insight:** Write access is the intersection of three permissions, not merely `store.mode === rw`.

```javascript
// ============================================
// resolveMemoryStore - Resolve a live store and enforce write capability
// Location: cli_inner_pretty.js:554980-555009
// ============================================

// ORIGINAL (for source lookup):
function SPr({ storeId: e, write: t = !1 }) {
  let r = vEa();
  if (r) return r;
  let n = qSe();
  if (n.length === 0)
    return {
      outcome: "refused",
      reason: "unbound",
      message: bGo() === "connecting" ? EEa : "No memory store is connected to this session.",
    };
  let o = n.find((i) => REe(i) === e);
  if (!o) {
    let i = n.map(REe).join(", ");
    return {
      outcome: "refused",
      reason: "unknown_store",
      message: `No memory store with id ${Mni(e)} is connected to this session. Connected stores: ${i}. Call ${bk} with no arguments to list them.`,
    };
  }
  if (t && !vqe(o)) {
    let i = n.filter(vqe).map(REe),
      s = i.length === 0 ? "" : ` Writable stores: ${i.join(", ")}.`;
    return {
      outcome: "refused",
      reason: "read_only",
      message: `The memory store ${Mni(e)} is read-only in this session; changes will not persist.${s}`,
    };
  }
  return { outcome: "resolved", store: o, backend: Pni(o, vqe(o), e) };
}

// READABLE (for understanding):
function resolveMemoryStore({ storeId, write = false }) {
  const unavailable = validateMemorySessionAvailability();
  if (unavailable) return unavailable;
  const stores = getConnectedMemoryStores();
  if (stores.length === 0) return refusedNoConnectedStore();
  const store = stores.find((candidate) => computeMemoryStorePublicId(candidate) === storeId);
  if (!store) return refusedUnknownStore(storeId, stores.map(computeMemoryStorePublicId));
  if (write && !isMemoryStoreWritable(store)) return refusedReadOnlyStore(storeId, stores);
  return {
    outcome: "resolved",
    store,
    backend: createMemoryBackend(store, isMemoryStoreWritable(store), storeId),
  };
}

// Mapping: SPr→resolveMemoryStore, e→storeId, t→write, vEa→validateMemorySessionAvailability,
//          qSe→getConnectedMemoryStores, REe→computeMemoryStorePublicId,
//          vqe→isMemoryStoreWritable, Pni→createMemoryBackend
```

## 2. Path and content safety

### Memory Path Validation

**What it does:** Restricts memory documents to portable text paths and prevents writes into
instruction-bearing namespaces.

**How it works:**
1. Relative paths are rejected early with a suggested absolute path under the store's prompt index.
2. Paths are normalized, must fit in 1,024 UTF-8 bytes, and may not contain control, format,
   private-use, unassigned, surrogate, default-ignorable characters, line separators, or backslashes.
3. Empty segments and dot-prefixed segments are rejected; directory-list prefixes may optionally end
   with `/`.
4. Documents must end in `.md`, `.txt`, `.json`, or `.jsonl`.
5. Writes additionally reject normalized reserved segments such as `skills`, `commands`, `agents`,
   and `hooks`; reads and listings may inspect existing documents there.

**Why this approach:**
- Byte limits match backend/storage reality better than JavaScript character counts.
- Blocking reserved segments on writes prevents memory from becoming an indirect plugin/agent/hook
  installation mechanism.
- Allowing reads preserves compatibility with preexisting store layouts.
- A broad denylist can reject legitimate names, but is safer than allowing shared memory to alter
  executable instruction surfaces.

**Key insight:** Read and write path policies are intentionally asymmetric: inspect broadly, mutate
narrowly.

### Content Validation and Secret Refusal

**What it does:** Bounds document size, rejects meaningless writes, and prevents detected credentials
from entering organization-shared memory.

**How it works:**
1. Input is sanitized before validation and storage.
2. Full UTF-8 content is capped at 102,400 bytes; reads enforce the same cap before returning content.
3. Empty or whitespace-only documents are rejected.
4. The secret scanner runs over both path and content, returning detected label classes but not the
   secret values.
5. Conflict responses withhold current content when the existing document exceeds the read cap.

**Why this approach:**
- Matching read/write caps prevents creation of a document the tool can never subsequently merge.
- Scanning path plus content catches secrets embedded in filenames.
- Secret scanners have false positives, but shared organization scope makes refusal preferable to a
  warning-only policy.
- Full replacement simplifies storage semantics but makes the precondition/version mechanism
  mandatory to avoid accidental deletion.

**Key insight:** The cap is also an information-disclosure boundary: oversized current content is not
echoed into model context even during a conflict.

## 3. Tool algorithms

### Lexical Memory Listing

**What it does:** Lists either connected stores or at most 50 document entries after an optional
directory-aligned prefix and cursor.

**How it works:**
1. With no `store`, return current public IDs, descriptions, writable flags, and index paths.
2. With a store, resolve it and validate `path_prefix` as an optionally trailing directory path.
3. Fetch the backend listing, tolerate a missing store as empty, filter to supported document paths,
   and sort by path.
4. Apply the cursor as the strict comparison `path > cursor`.
5. Return the first 50 entries and a remaining count; the renderer tells the model to reuse the last
   returned path as the next cursor.

**Why this approach:**
- A lexical cursor is stateless, compact, and human-readable.
- It avoids leaking backend page tokens into prompts.
- Concurrent inserts before the cursor may not appear in a continued traversal; callers should restart
  listing when a consistent snapshot matters.
- Sorting the full backend result is simple but costs O(n log n) time and O(n) memory per call.

**Key insight:** Pagination is deterministic over one observed listing, not a snapshot-isolated server
cursor.

### Bounded Memory Read

**What it does:** Reads one document and returns sanitized content, update time, and a public version
token.

**How it works:**
1. Resolve the store read-only and validate an absolute document path.
2. Use `readByPath`; a missing document yields typed `not_found`.
3. Refuse content over 100 KiB before placing it in the result.
4. Sanitize returned text and compute a 12-hex version from the original content.
5. Prefix model-visible output with a warning to treat shared content as reference, not instructions.

**Why this approach:**
- The explicit untrusted-data marker mitigates prompt injection from collaborators.
- Returning a compact version supports the next write without exposing backend hashes.
- Hashing pre-display content avoids sanitizer changes becoming accidental storage versions.

**Key insight:** The content is both useful context and an untrusted input; the renderer preserves that
distinction every time it returns a document.

### Memory Write Permission and Validation Order

**What it does:** Applies interaction-mode permission policy before a full replacement write, then
orders cheap/local validation ahead of backend mutation.

**How it works:**
1. Auto mode delegates to the permission classifier; plan mode always asks; other modes allow normal
   execution.
2. Resolve a writable store.
3. Validate relative/absolute path semantics, reserved segments, content size/emptiness, and secrets,
   in that order.
4. Read the current document once.
5. Parse `if_version` into malformed, create (`new` or empty), or compare (12 lowercase hex) intent.
6. Dispatch to create or update CAS logic; return current content on a bounded conflict.

**Why this approach:**
- Permission review happens before remote mutation, while deterministic safety checks still defend
  every mode.
- Validation order produces the most actionable error without contacting the backend unnecessarily.
- Plan mode asks rather than blanket-refusing so an explicitly approved durable correction can still
  be saved.
- Whole-document replacement is easy to reason about but increases merge cost and deletion risk.

**Key insight:** Permission approval never bypasses path, size, secret, or version invariants.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `validateMemorySessionAvailability` (`vEa`) - call-time trust/service guard.
- `computeMemoryStorePublicId` (`REe`) - current-set public store name.
- `resolveMemoryStore` (`SPr`) - capability resolver.
- `validateMemoryPath` (`YKt`) - read/write path policy.
- `validateMemoryContent` (`nKp`) - size and empty-content policy.
- `validateMemorySecretContent` (`rKp`) - shared-store secret refusal.
- `memoryListTool` (`pKp`) - lexical pagination.
- `memoryReadTool` (`_Kp`) - bounded read.
- `memoryWriteTool` (`HKp`) - permission, validation, and CAS dispatch.
