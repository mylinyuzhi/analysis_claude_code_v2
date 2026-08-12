# Optimistic concurrency and version-token safety

Target anchors: `cli_inner_pretty.js:555460-555484` and `:555644-555775`.

`memory_write` is always an intentional create or compare-and-swap update. There is no unconditional
overwrite branch.

## 1. Public version tokens

### Canonicalized Public Version

**What it does:** Derives a compact 12-hex token from a canonical equivalence class of content rather
than from the exact stored bytes.

**How it works:**
1. Fast-path content that has neither `<` nor a double newline.
2. Recursively neutralize `antml:`-shaped tag prefixes, with a maximum of 20 passes.
3. Replace double-newline `Human:` and Unicode-confusable `Assistant:` separators with `H:` and `A:`.
4. SHA-256 hash the canonical string as UTF-8.
5. Return the first 12 hexadecimal characters (48 bits).

**Why this approach:**
- The token is short enough for model tool calls and approval surfaces.
- The exact rationale for role-marker canonicalization is not recoverable from readable 2.1.88 source;
  the verified effect is that instruction-shaped spelling variants intentionally share a token.
- A full backend SHA-256 would provide strict byte identity and stronger collision resistance, but is
  longer and backend-specific.
- The trade-off is material: 48-bit truncation and deliberate canonical equivalence mean distinct
  documents can share a public token.

**Key insight:** Two hashes participate, but protect different windows. The public token decides
whether the caller's prior read is accepted; the backend SHA only protects the interval between the
tool's fresh internal read and update. If two contents share a public token, that earlier change is not
detected by the later backend precondition.

```javascript
// ============================================
// computePublicMemoryVersion - Produce the 12-hex model-facing content version
// Location: cli_inner_pretty.js:555482-555484
// ============================================

// ORIGINAL (for source lookup):
function tBe(e) {
  return mKp.createHash("sha256").update(yiS(e), "utf8").digest("hex").slice(0, 12);
}

// READABLE (for understanding):
function computePublicMemoryVersion(content) {
  return crypto
    .createHash("sha256")
    .update(canonicalizeMemoryVersionContent(content), "utf8")
    .digest("hex")
    .slice(0, 12);
}

// Mapping: tBe→computePublicMemoryVersion, e→content, mKp→crypto,
//          yiS→canonicalizeMemoryVersionContent
```

## 2. Precondition parsing

### Version Precondition Parsing

**What it does:** Converts model input into explicit create-only, compare-and-swap, or malformed
intent before any backend mutation is attempted.

**How it works:**
1. Trim the supplied value and lowercase it.
2. Treat `new` or an empty string as create-only intent.
3. Accept exactly 12 hexadecimal characters as compare intent and retain the token.
4. Classify every other value as malformed while preserving the raw input for a corrective message.
5. For malformed input, read state still determines whether the response says “use `new`” or returns
   the existing version/content.

**Why this approach:**
- A small closed grammar prevents accidental last-write-wins behavior.
- Lowercasing accepts uppercase hex without changing token meaning.
- Empty-as-create is a compatibility affordance, while prompts still require explicit `new` so intent
  stays legible.
- Treating malformed input as a conflict rather than a schema exception gives the model the current
  merge base when one exists.

**Key insight:** Every accepted write declares knowledge: either “I assert this path is absent” or “I
read this exact version.” There is no “overwrite whatever is there” form.

### Create-Only CAS

**What it does:** Ensures a model cannot overwrite a path it has not read.

**How it works:**
1. Read the current document before dispatch.
2. If it exists and intent is `new`, return a conflict with current version/content.
3. If it appears absent, call backend `create` with `precondition: "not_exists"`.
4. On a backend conflict, reread the path.
5. If a document now exists, return `version_new_on_existing`; otherwise translate an overlapping
   document/prefix collision into `path_conflict`.

**Why this approach:**
- The preliminary read gives useful conflict content, but cannot prove absence under concurrency.
- The backend `not_exists` precondition closes the time-of-check/time-of-use race.
- A server-assigned unique path could avoid collisions but would make semantic memory organization
  impossible.

**Key insight:** The initial read is for diagnosis; the atomic backend precondition is for correctness.

## 3. Update CAS and retry

### Two-Layer Compare-and-Swap Update

**What it does:** Rejects stale model-visible tokens, then updates atomically using the backend SHA,
with one recovery attempt for a conflict that did not actually change the document.

**How it works:**
1. Compare the caller's public token with the current document's public token. A mismatch returns the
   current bounded content for merge without attempting a write.
2. On a match, call backend `update(id, newContent, current.sha256)`.
3. If the document disappeared, return `missing`.
4. On a backend conflict, reread. If the SHA changed, return a stale-version conflict.
5. If the SHA is unchanged, retry once with the freshly read ID/SHA.
6. On a second conflict, reread again. An unchanged original SHA becomes
   `repeated_spurious_conflict`; a changed SHA becomes a normal stale conflict.

**Why this approach:**
- Public-token checking makes errors understandable to the model; backend SHA provides atomicity.
- One retry absorbs benign backend races or stale entity metadata without creating an unbounded retry
  loop.
- Retrying indefinitely could hide an unhealthy store and amplify load.
- Returning current content reduces merge round trips, at the cost of larger error results; the
  100-KiB cap bounds that cost.

**Key insight:** The retry is allowed only when reread evidence proves the content SHA did not change.
It is not a generic “retry all conflicts” policy.

```javascript
// ============================================
// updateMemoryDocumentCAS - Atomically update and retry one demonstrably spurious conflict
// Location: cli_inner_pretty.js:555746-555775
// ============================================

// ORIGINAL (for source lookup):
async function CiS(e, t, r, n, o) {
  try {
    return (await e.update(n.id, r, n.sha256, { signal: o }), TEa(t, r, "updated"));
  } catch (i) {
    if (i instanceof VD && i.kind === "document") return SRn(t);
    if (!(i instanceof Uae)) throw i;
    let s = await bRn(e, t, { signal: o });
    if (s === null) return SRn(t);
    if (s.sha256 !== n.sha256) return CEa(t, s, tBe(n.content));
    try {
      return (await e.update(s.id, r, s.sha256, { signal: o }), TEa(t, r, "updated"));
    } catch (a) {
      if (a instanceof VD && a.kind === "document") return SRn(t);
      if (!(a instanceof Uae)) throw a;
      let l = await bRn(e, t, { signal: o });
      if (l === null) return SRn(t);
      if (l.sha256 === n.sha256)
        return (
          Ere("write", "repeated_spurious_conflict"),
          {
            outcome: "failed",
            path: t,
            reason: "conflict",
            message: "The memory store rejected this write twice although the document is unchanged. Try again later.",
          }
        );
      return CEa(t, l, tBe(n.content));
    }
  }
}

// READABLE (for understanding):
async function updateMemoryDocumentCAS(backend, path, newContent, current, signal) {
  try {
    await backend.update(current.id, newContent, current.sha256, { signal });
    return buildMemoryWriteSuccess(path, newContent, "updated");
  } catch (error) {
    if (isDocumentMissing(error)) return memoryDocumentMissing(path);
    if (!isConflict(error)) throw error;
    const reread = await readCurrentMemoryDocument(backend, path, { signal });
    if (reread === null) return memoryDocumentMissing(path);
    if (reread.sha256 !== current.sha256) return staleMemoryVersion(path, reread, current.content);
    try {
      await backend.update(reread.id, newContent, reread.sha256, { signal });
      return buildMemoryWriteSuccess(path, newContent, "updated");
    } catch (retryError) {
      if (!isConflict(retryError)) throw retryError;
      const finalRead = await readCurrentMemoryDocument(backend, path, { signal });
      if (finalRead?.sha256 === current.sha256) return repeatedSpuriousConflict(path);
      return finalRead === null
        ? memoryDocumentMissing(path)
        : staleMemoryVersion(path, finalRead, current.content);
    }
  }
}

// Mapping: CiS→updateMemoryDocumentCAS, e→backend, t→path, r→newContent, n→current,
//          o→signal, TEa→buildMemoryWriteSuccess, bRn→readCurrentMemoryDocument,
//          SRn→memoryDocumentMissing, CEa→staleMemoryVersion, Uae→ConflictError
```

## 4. Conflict result design

### Merge-Oriented Conflict Response

**What it does:** Gives the model enough bounded state to merge safely after a rejected write.

**How it works:**
1. Compute the current public version.
2. Report a specific reason: bad token, create-on-existing, stale token, or backend conflict.
3. If current content is within 100 KiB, sanitize and include it.
4. If oversized, withhold it and explain that `memory_read` will also refuse it; the only supported
   actions are wholesale replacement with the current token or leaving it unchanged.
5. Mark the tool result as an error so the agent must explicitly handle the conflict.

**Why this approach:**
- Including content turns the common correction into one retry rather than a separate read plus retry.
- The cap prevents conflict handling from bypassing the normal read boundary.
- Returning a diff would be smaller, but the server/backend exposes full content and a reliable patch
  basis is not guaranteed.

**Key insight:** Error results are deliberately constructive: rejection carries the exact version and,
when safe, the merge base.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `canonicalizeMemoryVersionContent` (`yiS`) - neutralizes protocol-shaped separators.
- `computePublicMemoryVersion` (`tBe`) - creates the public 48-bit token.
- `parseMemoryVersionPrecondition` (`viS`) - selects create, compare, or malformed intent.
- `createMemoryVersionConflict` (`kEa`) - bounded merge-oriented response.
- `createMemoryDocumentCAS` (`TiS`) - atomic create-only path.
- `updateMemoryDocumentCAS` (`CiS`) - atomic update and one evidence-based retry.
