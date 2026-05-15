# /fork — Pointer + Hydrate Instead of Full Copy (v2.1.118)

## Changelog Anchor

> Fixed `/fork` writing the full parent conversation to disk per fork — now writes a pointer and hydrates on read

## Background — Two Commands Named "Fork"

Claude Code v2.1.142 has two distinct entry points that the user might call "forking":

1. **`/branch` slash command** (alias `/fork`) — Creates a *new resumable session* that branches from the current conversation at this point. The user can switch to the branch (`H.resume(...)`) or come back to the original later via `/resume <id>`.
2. **`/fork` slash command** (the second one) — Spawns a *background agent* that inherits the full parent context as REPL hydration. Different from `/branch` in that the fork is an agent task, not a sibling session.

The v2.1.118 changelog entry is about the `/branch` slash command (`iK4`/`rK4`). The fix is that the writer no longer copies the entire parent JSONL into the new session's JSONL — instead it emits entries that *reference* the parent.

## The Problem — Quadratic Disk Growth

Pre-v2.1.118, every `/branch` invocation produced a full copy of the messages it kept:

```
Parent session (10 MB transcript)
   │
   ├─ /branch → new session 1 (10 MB copy)
   ├─ /branch → new session 2 (10 MB copy)
   └─ /branch → new session 3 (10 MB copy)
```

For users who frequently branched (the common pattern: "explore this avenue → branch back → try another"), this caused disk usage to grow super-linearly with branching depth. A long session that branches 5 times = 6× the disk footprint.

## The Fix — `forkedFrom` Pointer

`iK4` (the branch writer, `cli_inner_pretty.js:428076-428184`) emits each kept entry with a `forkedFrom: { sessionId, messageUuid }` pointer back to the original message in the parent session. On read, the loader looks up the pointer and hydrates the content from disk on demand:

```javascript
// ============================================
// branchCommandWriter - Stream parent JSONL → child JSONL with forkedFrom pointers
// Location: cli_inner_pretty.js:428076-428184
// ============================================

// ORIGINAL (for source lookup):
async function iK4(H, $, q) {
  let K = dK4.randomUUID(),                                  // new session id
    _ = v$(),                                                 // parent session id
    A = gf($6()),                                             // sessions dir
    z = UV(K),                                                // new session's file path
    Y = fA();                                                 // parent's file path
  await _D8.mkdir(A, { recursive: !0, mode: 448 });
  let f;
  try {
    ((f = KD8.createReadStream(Y, { encoding: "utf8" })), await iR6.once(f, "open"));   // open parent JSONL
  } catch (G) {
    if (f8(G)) throw Error("No conversation to branch");
    throw (EH(G), G);
  }
  let O = KD8.createWriteStream(z, { encoding: "utf8", mode: 384 }),                    // open new session JSONL
    M = null;
  O.on("error", (G) => { M = y6(G); });
  let w = cK4.createInterface({ input: f, crlfDelay: 1 / 0 }),                          // line-by-line reader
    D = new Set(H.map((G) => G.uuid)),                                                  // UUIDs we want to keep
    j = new Map(),                                                                       // uuid → parsed parent entry
    J = [],                                                                              // content-replacement records
    X = async () => { O.destroy(); await _D8.unlink(z).catch(() => {}); };
  let L = async (G) => {
    if (M) throw (await X(), M);
    if (!O.write(G)) await iR6.once(O, "drain").catch(() => {});                        // backpressure
  };

  try {
    // ─── First pass: parse the parent JSONL line-by-line, build uuid → entry map ──
    for await (let G of w) {
      if (G.length === 0) continue;
      let V;
      try { V = x$(G); } catch { continue; }
      if (V.type === "content-replacement" && V.sessionId === _) {
        J.push(...V.replacements);                                                       // collect replacements
        continue;
      }
      if (!rm(V) || V.isSidechain || !D.has(V.uuid)) continue;                          // skip non-kept entries
      j.set(V.uuid, V);
    }
  } catch (G) { throw (await X(), G); }
  finally { w.close(); f.destroy(); }

  let P = null,                                                                          // running parentUuid for chain
    Z = null,                                                                            // last emitted entry
    W = [];                                                                              // entries to return to caller

  try {
    // ─── Second pass: walk H (the user-selected message slice) in order ──
    for (let G of H) {
      let V = j.get(G.uuid);
      if (!V) continue;
      let v = { ...V, sessionId: K, parentUuid: P, isSidechain: !1,
                forkedFrom: { sessionId: _, messageUuid: V.uuid } },                    // ← POINTER
        E = { ...V, sessionId: K };                                                      // in-memory copy for caller
      if ((W.push(E), (Z = V), await L(SH(v) + "\n"), V.type !== "progress"))
        P = V.uuid;
    }
  } catch (G) { throw (await X(), G); }

  if (Z === null) throw (await X(), Error("No messages to branch"));

  // ─── Append any extra messages caller provided (e.g. /btw context) ──
  if (q?.length) { ... }

  // ─── Emit consolidated content-replacement record ──
  if (J.length > 0)
    await L(SH({ type: "content-replacement", sessionId: K, replacements: J }) + "\n");

  if ((O.end(), await lK4.finished(O).catch(() => {}), M)) throw (await X(), M);
  return { sessionId: K, title: $, forkPath: z, serializedMessages: W, contentReplacementRecords: J };
}

// READABLE (for understanding):
async function branchCommandWriter(messagesToKeep, customTitle, extraMessages) {
  const newSessionId = randomUUID();
  const parentSessionId = getCurrentSessionId();           // v$
  const sessionsDir = computeSessionsDir(getProjectId());  // gf($6())
  const newJsonlPath = sessionFilePath(newSessionId);
  const parentJsonlPath = currentSessionFilePath();         // fA

  await fs.mkdir(sessionsDir, { recursive: true, mode: 0o700 });

  // ─── Stream-pump the parent JSONL ───────────────────────────────────────────
  let readStream;
  try {
    readStream = fs.createReadStream(parentJsonlPath, { encoding: "utf8" });
    await once(readStream, "open");
  } catch (e) {
    if (isENOENT(e)) throw new Error("No conversation to branch");
    throw e;
  }

  const writeStream = fs.createWriteStream(newJsonlPath, { encoding: "utf8", mode: 0o600 });
  let writeError = null;
  writeStream.on("error", (e) => { writeError = toError(e); });

  const lineReader = readline.createInterface({ input: readStream, crlfDelay: Infinity });
  const keepUuids = new Set(messagesToKeep.map((m) => m.uuid));
  const parentByUuid = new Map();
  const contentReplacements = [];

  const cleanupOnFail = async () => {
    writeStream.destroy();
    await fs.unlink(newJsonlPath).catch(() => {});
  };

  const writeLine = async (line) => {
    if (writeError) throw (await cleanupOnFail(), writeError);
    if (!writeStream.write(line)) await once(writeStream, "drain").catch(() => {});
  };

  // ─── Pass 1: index parent entries by UUID, collecting only entries we'll keep ─
  try {
    for await (const line of lineReader) {
      if (line.length === 0) continue;
      let parsed;
      try { parsed = parseJSON(line); } catch { continue; }
      if (parsed.type === "content-replacement" && parsed.sessionId === parentSessionId) {
        contentReplacements.push(...parsed.replacements);
        continue;
      }
      if (!isMessageEntry(parsed) || parsed.isSidechain || !keepUuids.has(parsed.uuid)) continue;
      parentByUuid.set(parsed.uuid, parsed);
    }
  } catch (e) { throw (await cleanupOnFail(), e); }
  finally { lineReader.close(); readStream.destroy(); }

  // ─── Pass 2: walk in the order the user requested, emit forkedFrom pointers ─
  let runningParentUuid = null;
  let lastWrittenEntry = null;
  const serializedMessages = [];

  try {
    for (const requestedMsg of messagesToKeep) {
      const parentEntry = parentByUuid.get(requestedMsg.uuid);
      if (!parentEntry) continue;

      // ─── KEY: copy entry verbatim BUT rewrite sessionId/parentUuid and add forkedFrom ──
      const forkedEntry = {
        ...parentEntry,
        sessionId: newSessionId,
        parentUuid: runningParentUuid,
        isSidechain: false,
        forkedFrom: { sessionId: parentSessionId, messageUuid: parentEntry.uuid },  // ← POINTER
      };

      // In-memory representation for the caller (no forkedFrom, since the caller has the message verbatim)
      const inMemoryClone = { ...parentEntry, sessionId: newSessionId };
      serializedMessages.push(inMemoryClone);
      lastWrittenEntry = parentEntry;

      await writeLine(stringifyJSON(forkedEntry) + "\n");

      if (parentEntry.type !== "progress") runningParentUuid = parentEntry.uuid;
    }
  } catch (e) { throw (await cleanupOnFail(), e); }

  if (lastWrittenEntry === null) throw (await cleanupOnFail(), new Error("No messages to branch"));

  // ─── Optional: append /btw extra context messages ───────────────────────────
  if (extraMessages?.length) {
    for (const extra of extraMessages) {
      const enriched = {
        ...extra,
        cwd: lastWrittenEntry.cwd,
        userType: lastWrittenEntry.userType,
        entrypoint: lastWrittenEntry.entrypoint,
        version: lastWrittenEntry.version,
        gitBranch: lastWrittenEntry.gitBranch,
        sessionId: newSessionId,
        timestamp: new Date().toISOString(),
      };
      const chained = { ...enriched, parentUuid: runningParentUuid, isSidechain: false };
      serializedMessages.push(enriched);
      await writeLine(stringifyJSON(chained) + "\n");
      if (extra.type !== "progress") runningParentUuid = extra.uuid;
    }
  }

  if (contentReplacements.length > 0) {
    await writeLine(stringifyJSON({
      type: "content-replacement",
      sessionId: newSessionId,
      replacements: contentReplacements,
    }) + "\n");
  }

  writeStream.end();
  await streamFinished(writeStream).catch(() => {});
  if (writeError) throw (await cleanupOnFail(), writeError);

  return {
    sessionId: newSessionId,
    title: customTitle,
    forkPath: newJsonlPath,
    serializedMessages,
    contentReplacementRecords: contentReplacements,
  };
}

// Mapping: iK4→branchCommandWriter, H→messagesToKeep, $→customTitle, q→extraMessages,
//          K→newSessionId, _→parentSessionId, A→sessionsDir, z→newJsonlPath, Y→parentJsonlPath,
//          f→readStream, O→writeStream, M→writeError, w→lineReader, D→keepUuids,
//          j→parentByUuid, J→contentReplacements, X→cleanupOnFail, L→writeLine,
//          P→runningParentUuid, Z→lastWrittenEntry, W→serializedMessages
```

## What `forkedFrom` Looks Like In the JSONL

A branched session's `.jsonl` has entries like:

```json
{
  "uuid": "new-uuid-1",
  "type": "user",
  "sessionId": "child-session-id",
  "parentUuid": null,
  "isSidechain": false,
  "forkedFrom": {
    "sessionId": "parent-session-id",
    "messageUuid": "original-uuid-1"
  },
  ...
}
```

The **full message content is still in the JSONL.** This is critical: the v2.1.118 fix doesn't strip the content. What it does is *annotate* every entry with a pointer back to the parent so the loader can:

1. Detect that this child was forked from a specific parent.
2. Use the parent's message as the canonical source if the child's copy is corrupted or truncated.
3. Render UI cues ("Forked from ../parent-session at message X") in the resume picker and `/insights` views.

## Why Annotate Rather Than Strip?

The original framing of "pointer instead of full copy" suggests the child JSONL might contain only refs, with the loader resolving them on read. The actual implementation keeps the full content in the child but adds the pointer so the loader can lean on the parent when needed.

Why this hybrid:

1. **Resilience.** If the parent JSONL is deleted, the child still has the messages in full. No "broken fork" state.
2. **Cross-references** in lazy-load mode are expensive. The loader would have to keep two file handles open and stitch lines together. A self-contained JSONL is faster to read.
3. **Provenance tracking** without paying for indirection. Each entry knows where it came from for audit/UI without slowing down reads.

So the disk usage is still ~the same as before for content (each branch JSONL is still ~N KB per kept message). The win in v2.1.118 is structural: the `forkedFrom` pointer enables features (resume picker showing fork origin, `/insights` fork tree visualization) that weren't possible without it. Calling it "pointer instead of full copy" in the changelog is a slight simplification — the more accurate description is "pointer alongside full copy".

## Resume Behavior

`H.resume(sessionId, sessionData, "fork")` — the third arg `"fork"` tells the resume handler to take the branched-from path. The fork-aware path:

- Sets `bridgeSessionId: void 0` (cuts the parent's remote-control bridge from the fork — they're independent).
- Sets `worktreeSession: void 0` (forks don't inherit worktree state).
- Skips re-deriving the autoCompact threshold from the parent.
- Doesn't write a new `sessionMeta.json` entry for the child until the user actually submits a prompt.

## `/branch` UX Plumbing — `branchAndResume`

```javascript
// ============================================
// branchAndResume - /branch command handler that orchestrates the writer and the resume jump
// Location: cli_inner_pretty.js:428201-428244
// ============================================

// ORIGINAL (for source lookup):
async function rK4(H, $, q = {}) {
  let K = v$(),
    _ = c3(K);
  try {
    let { sessionId: A, title: z, forkPath: Y, serializedMessages: f, contentReplacementRecords: O } = await iK4(H.messages, q.customTitle, q.extraMessages),
      M = new Date(),
      w = nK4(f.find((Z) => Z.type === "user")),
      D = z?.replace(/\s+/g, " ").trim() ?? (await qf5(w)),
      j = z ? "user" : "auto";
    (await Sb(A, D, Y, j),
      await h9H(A, D, Y, j),
      d("tengu_conversation_forked", { message_count: f.length, has_custom_title: !!z }));
    let J = { ... };  // session-meta object
    let X = z ? ` "${D}"` : "",
      L = _ ? ` ("${_}")` : "",
      P = `Branched conversation${X}. You are now in the new branch (session ${A}). Use /resume ${K}${L} to return to the original, or run \`claude -r ${K}\` in a new terminal.`;
    if (H.resume) (await H.resume(A, J, "fork"), $(P, { display: "system" }));
    else $(`Branched conversation${X}. Resume with: /resume ${A}`);
    return !0;
  } catch (A) { ... }
}

// READABLE (for understanding):
async function branchAndResume(slashContext, addMessage, options = {}) {
  const parentSessionId = getCurrentSessionId();
  const parentSessionTitle = lookupSessionTitle(parentSessionId);    // c3
  try {
    const { sessionId: childSessionId, title: maybeCustomTitle, forkPath, serializedMessages, contentReplacementRecords } =
      await branchCommandWriter(slashContext.messages, options.customTitle, options.extraMessages);

    const now = new Date();
    const derivedFirstPrompt = deriveFirstPromptText(serializedMessages.find((m) => m.type === "user"));
    const finalTitle = maybeCustomTitle?.replace(/\s+/g, " ").trim()
                       ?? (await uniquifyBranchTitle(derivedFirstPrompt));
    const titleSource = maybeCustomTitle ? "user" : "auto";

    await persistSessionTitle(childSessionId, finalTitle, forkPath, titleSource);            // Sb
    await persistSessionMeta(childSessionId, finalTitle, forkPath, titleSource);             // h9H
    telemetry("tengu_conversation_forked", { message_count: serializedMessages.length, has_custom_title: !!maybeCustomTitle });

    const sessionMeta = {
      date: formatDateForUi(now.toISOString(), "T"),
      messages: serializedMessages,
      fullPath: forkPath,
      value: now.getTime(),
      created: now,
      modified: now,
      firstPrompt: derivedFirstPrompt,
      messageCount: serializedMessages.length,
      isSidechain: false,
      sessionId: childSessionId,
      customTitle: finalTitle,
      agentName: finalTitle,
      contentReplacements: contentReplacementRecords,
    };

    const titleSuffix = maybeCustomTitle ? ` "${finalTitle}"` : "";
    const parentTitleHint = parentSessionTitle ? ` ("${parentSessionTitle}")` : "";
    const userMessage =
      `Branched conversation${titleSuffix}. You are now in the new branch (session ${childSessionId}). `
      + `Use /resume ${parentSessionId}${parentTitleHint} to return to the original, or run \`claude -r ${parentSessionId}\` in a new terminal.`;

    if (slashContext.resume) {
      await slashContext.resume(childSessionId, sessionMeta, "fork");   // ← jump to the new branch
      addMessage(userMessage, { display: "system" });
    } else {
      addMessage(`Branched conversation${titleSuffix}. Resume with: /resume ${childSessionId}`);
    }
    return true;
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : "Unknown error occurred";
    addMessage(`Failed to branch conversation: ${errMsg}`);
    return false;
  }
}

// Mapping: rK4→branchAndResume, H→slashContext, $→addMessage, q→options,
//          K→parentSessionId, _→parentSessionTitle, A→childSessionId,
//          z→maybeCustomTitle, Y→forkPath, f→serializedMessages, O→contentReplacementRecords,
//          M→now, w→derivedFirstPrompt, D→finalTitle, j→titleSource,
//          J→sessionMeta, X→titleSuffix, L→parentTitleHint, P→userMessage
```

## /fork (Background Agent) — A Different Path

The second slash command, `/fork` (registered via `lN4`/`Vb5`), spawns a background subagent that *inherits the parent's REPL context*. It doesn't write a new resumable session — it creates an agent thread:

```javascript
// cli_inner_pretty.js:511636-511642
var Tb5 = async (H, $, q) => {
  let K = q.trim();
  if (!K) return (H("Usage: /fork \\<directive\\>", { display: "system" }), null);
  let _ = await lR6(K, $, $.canUseTool ?? tD);            // spawnForkFromDirective
  if (!_) return (H("Cannot fork before the first conversation turn", { display: "system" }), null);
  return (H(`${fCH} forked ${_.name} (${_.agentId.slice(-4)})`, { display: "system" }), null);
};
```

`lR6` (`cli_inner_pretty.js:427943-428022`) creates the background agent with `replHydration: { kind: "fork", log: [...replayLog] }` — the agent inherits the REPL state. This is *not* the v2.1.118 fix — the v2.1.118 fix is specifically for the `/branch` slash command and its sibling.

## Telemetry

```javascript
d("tengu_conversation_forked", {
  message_count: serializedMessages.length,
  has_custom_title: !!maybeCustomTitle,
});
```

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Slash command lives here
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - JSONL persistence
> - [symbol_additions_v2_1_142_compact_cache.md](../00_overview/symbol_additions_v2_1_142_compact_cache.md) - This unit's new symbols

Key functions:
- `branchCommandWriter` (`iK4`) — `cli_inner_pretty.js:428076-428184` — Stream-pump JSONL writer; emits `forkedFrom` pointers
- `branchAndResume` (`rK4`) — `cli_inner_pretty.js:428201-428244` — `/branch` command handler
- `branchSlashCommand` (`Kf5`) — `cli_inner_pretty.js:428245-428247` — `call:` entry point in slash command registry
- `branchCommandConfig` (`$k5`/`qW4`) — `cli_inner_pretty.js:486866-486877` — Registers `/branch` with `aliases: ["fork"]`
- `forkSlashCommand` (`Tb5`) — `cli_inner_pretty.js:511636-511642` — The *other* `/fork` (background agent variant)
- `spawnForkFromDirective` (`lR6`) — `cli_inner_pretty.js:427943-428022` — Spawns the background agent for `/fork`
