# Mailbox identity, lifecycle-tool removal & the SendMessage delta (v2.1.156 → v2.1.183)

> Delta doc in the `30_agent_team/` module. Target bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines). Every citation is `cli_inner_pretty.js:<line>` in the **v2.1.183** bundle unless explicitly tagged as a v2.1.156 or v2.1.88 before-picture.
>
> Scope (deliberately narrow — three things): **(1)** the file mailbox is structurally *unchanged* and I prove it with one short dual-version block, then link the v2.1.156 baseline instead of re-deriving 900 lines; **(2)** the **TeamCreate / TeamDelete lifecycle tools were removed** (and their telemetry with them); **(3)** the **`SendMessage` delta** — the prompt rewrite, the `"main"` recipient routing into the main conversation, the new `bridge:`/`uds:` cross-session socket-address *validation*, and the (non-)delta of the model-facing `message` union. The implicit-team bootstrap and the Agent-tool spawn routing live in the sibling [`implicit_team_and_agent_tool_spawn.md`](implicit_team_and_agent_tool_spawn.md); the tmux spawn fix in [`spawn_backends_and_tmux_fix.md`](spawn_backends_and_tmux_fix.md); coordinator + background-task survival in [`coordinator_and_background_survival.md`](coordinator_and_background_survival.md).

---

## TL;DR

The agent-team **IPC layer did not change**. `writeToMailbox` (`$A`, `:365950`) is the same lock-protected re-read-and-append it has always been, `getInboxPath` (`v4e`, `:365916`) resolves the same `<teamsDir>/<team>/inboxes/<agent>.json`, and the teams root is `Gbe()` = `tr() + "teams"` (config dir, `:735`) — there is no `.claude/teams` string literal in the path function. So the heavy mailbox-protocol analysis in the v2.1.156 baseline ([`mailbox_and_lifecycle_tools.md`](../../../claude_code_v_2.1.156/analyze/30_agent_team/mailbox_and_lifecycle_tools.md) §1–§3, §6) carries over verbatim; this doc only confirms identity.

What *did* change is the **model-facing surface on top of the mailbox**:

1. **`TeamCreate` and `TeamDelete` are gone** (`grep -c` = 0 for both in the v2.1.183 bundle; 6 / 5 hits in v2.1.156). Their telemetry events `tengu_team_created` / `tengu_team_deleted` are gone too (0 vs 1 / 1). The team is now implicit and session-scoped (sibling doc).
2. **`SendMessage`** (`p$p`, `:434568`; schema `o$p`, `:434558`; prompt `rza`, `:434286`) grew two new recipient shapes: `"main"` (route to the **main conversation**, background subagents only) and cross-session socket addresses `uds:` / `bridge:`. `validateInput` gained a new "is this a real local socket address?" gate (`Lhe`, `:359981`) and two new "don't smuggle a protocol/lifecycle JSON frame in a plain-text message" rejections.
3. **The model-facing `message` union is *unchanged*** — `r$p` (`:434542`) is the same three discriminated types (`shutdown_request` / `shutdown_response` / `plan_approval_response`) as v2.1.156 `hh_` (v2.1.156 `:407421`). The dossier flagged a possible "union trim" (open question #5); reading both bundles shows **there was no trim** — `team_permission_update` / `mode_set_request` were never model-submittable in either version; they live only in the internal protocol-frame type-set `iF` (`:366256`), which is itself unchanged.

---

> Symbol mappings live in the central index, never in this doc. The full pointer blockquote and the per-function list for this doc are in the canonical **Related Symbols** section at the bottom (after the analysis).

---

## 1. The mailbox is unchanged — one dual-version proof, then link the baseline

**What it does:** The whole agent-team subsystem talks through one primitive: a per-recipient JSON inbox file `<teamsDir>/<team>/inboxes/<agent>.json` that you append to under an advisory file lock and poll every 500 ms. The decisive design reason (a file is the *only* transport valid across both the in-process async boundary **and** the cross-process OS boundary) is analysed in full in the v2.1.156 baseline ([`mailbox_and_lifecycle_tools.md`](../../../claude_code_v_2.1.156/analyze/30_agent_team/mailbox_and_lifecycle_tools.md) §1). I do not repeat it.

**How it works (the one thing this doc must verify — that the algorithm is byte-for-byte the same):** the universal send `writeToMailbox` (`$A`, `:365950`) still: (1) `ensureInboxDir`; (2) pre-creates the file exclusively with `"[]"` and swallows `EEXIST` (because `proper-lockfile` needs the lockee to exist); (3) takes the per-inbox lock with `LOCK_OPTIONS`; (4) **re-reads** the array under the lock; (5) pushes `{...message, type:"message", read:false}`; (6) atomic-writes; (7) releases in `finally`. The only mechanical differences vs v2.1.156 `aA` (v2.1.156 `:338306`) are the re-mangled symbol names and the position of one debug log line — the control flow is identical.

```javascript
// ============================================
// writeToMailbox - Append a message to a recipient's inbox under an advisory lock (UNCHANGED algorithm)
// Location: cli_inner_pretty.js:365950-365976
// ============================================

// ORIGINAL (for source lookup):
async function $A(e, t, n) {
  await Kyp(n);
  let r = v4e(e, n), o = `${r}.lock`;
  v(`[TeammateMailbox] writeToMailbox: recipient=${e}, from=${t.from}, path=${r}`);
  try { (await ci().writeExclusive(r, "[]"), v("[TeammateMailbox] writeToMailbox: created new inbox file")); }
  catch (i) { if (dn(i) !== "EEXIST") { (v(`[TeammateMailbox] writeToMailbox: failed to create inbox file: ${i}`), De(i)); return; } }
  let s;
  try {
    s = await $h(r, { lockfilePath: o, ...iUt });
    let i = await Fhe(e, n), a = { ...t, type: "message", read: !1 };
    (i.push(a), await ci().atomicWrite(r, Re(i, null, 2)), v(`[TeammateMailbox] Wrote message to ${e}'s inbox from ${t.from}`));
  } catch (i) { (v(`Failed to write to inbox for ${e}: ${i}`), De(i)); }
  finally { if (s) await s(); }
}

// READABLE (for understanding):
async function writeToMailbox(recipientName, message, teamName) {
  await ensureInboxDir(teamName);                                   // Kyp -> <teamsDir>/<team>/inboxes
  let inboxPath = getInboxPath(recipientName, teamName);            // v4e
  let lockFilePath = `${inboxPath}.lock`;
  // Pre-create the file so proper-lockfile has a lockee; EEXIST is fine:
  try { await fs().writeExclusive(inboxPath, "[]"); }              // 'wx' flag
  catch (e) { if (errnoCode(e) !== "EEXIST") { logError(e); return; } }
  let release;
  try {
    release = await lockfileLock(inboxPath, { lockfilePath, ...LOCK_OPTIONS });   // $h + iUt
    let messages = await readMailbox(recipientName, teamName);      // Fhe — RE-READ under lock
    let newMessage = { ...message, type: "message", read: false };
    messages.push(newMessage);
    await fs().atomicWrite(inboxPath, jsonStringify(messages, null, 2));
  } catch (e) { logError(e); }
  finally { if (release) await release(); }
}

// Mapping: $A->writeToMailbox, Kyp->ensureInboxDir, v4e->getInboxPath, Fhe->readMailbox,
//          $h->lockfileLock, iUt->LOCK_OPTIONS, ci->fs, Re->jsonStringify, dn->errnoCode, De->logError, v->logForDebugging
//          (v2.1.156 equivalents: aA, HD_, jhH, h_H, bf, DG$, o7, IH, X8, hH, N)
```

**Why this matters for the delta:** Because `$A` is unchanged, *every* higher-level send still bottoms out in the same primitive — chat (`SendMessage`), idle notification, shutdown request/response, permission request/response. So the only thing a reviewer needs to look at for the v2.1.183 swarm changes is the **surface that calls `writeToMailbox`**, not the IPC underneath it.

**Key insight (the teams-root literal that *isn't* there):** `getTeamsDir` (`Gbe`, `:735`) is `ker.join(tr(), "teams")` where `tr()` (`:825`) is `(process.env.CLAUDE_CONFIG_DIR ?? path.join(os.homedir(), ".claude")).normalize("NFC")`. So the path `~/.claude/teams/...` is *assembled at runtime* from the config-dir helper plus the literal `"teams"` — there is no `".claude/teams"` string in the function (the only `~/.claude/teams/...` literals in v2.1.156 lived inside the now-removed `TeamCreate`/`TeamDelete` *prompt* text, e.g. v2.1.156 `:406520`). v2.1.156's `RxH` (v2.1.156 `:3531`) was the identical shape (`l8() + "teams"`). Confidence: **high** (read directly).

> Carryover, link only — do **not** re-derive: `getInboxPath` (`v4e`, `:365916`), `ensureInboxDir` (`Kyp`, `:365924`), `readMailbox` (`Fhe`, `:365930`, same ENOENT→`[]`, SyntaxError-tolerant, `type:"message"` back-fill), `LOCK_OPTIONS` (`iUt`), the message-type builders/parsers (shutdown/idle/permission), the teammate XML envelope, and the leader↔teammate permission bridge are all structurally identical to v2.1.156. Baseline: [`mailbox_and_lifecycle_tools.md`](../../../claude_code_v_2.1.156/analyze/30_agent_team/mailbox_and_lifecycle_tools.md) §1–§3, §5–§6.

---

## 2. TeamCreate / TeamDelete REMOVED — the model no longer creates or deletes teams

**What it does (before):** In v2.1.156 a team was a *model-driven object*. The model called the **`TeamCreate`** tool to write the team config file, create the matching task-list directory, register the leader as the first member, and stash `teamContext` in app state (def `Th_`, v2.1.156 `:406631`; it emitted `tengu_team_created`). When done, the model called **`TeamDelete`** to tear it down — refusing while any teammate was still active — and emit `tengu_team_deleted` (def `vh_`, v2.1.156 `:406775`). Both gated on the master gate `R7()`. Full before-picture: baseline [`mailbox_and_lifecycle_tools.md`](../../../claude_code_v_2.1.156/analyze/30_agent_team/mailbox_and_lifecycle_tools.md) §4.1–§4.2.

**What it does (after):** Neither tool exists in v2.1.183. The team is created **implicitly at CLI startup** by `initializeSessionTeam` (`j3f`, `:682765`) before the model gets a turn, named deterministically `session-<sessionId[:8]>`, with the leader (`team-lead`) as the sole member; it is never explicitly deleted — it lives and dies with the session. That bootstrap is the subject of the sibling [`implicit_team_and_agent_tool_spawn.md`](implicit_team_and_agent_tool_spawn.md). This section only nails the **removal** evidence.

**How I verified it (grep is the proof here — these are tool-name string constants and telemetry-event strings, so absence is meaningful):**

| Token | v2.1.183 count | v2.1.156 count | Meaning |
|---|---|---|---|
| `TeamCreate` | 0 | 6 | tool name const + def + schema + prompt + uses all gone |
| `TeamDelete` | 0 | 5 | same |
| `tengu_team_created` | 0 | 1 | the create telemetry event is gone |
| `tengu_team_deleted` | 0 | 1 | the delete telemetry event is gone |

Corroborated by the asset extract: the v2.1.183 `assets/tools/` directory ships **no** `TeamCreate.md` / `TeamDelete.md` (only `Agent.md`, `SendMessage.md`, `Task*.md`, etc.) — see [`_asset_anchors.md`](../_asset_anchors.md) (Tools present §, "REMOVED vs 2.1.156: TeamCreate, TeamDelete").

**Why this approach (trade-offs):**

- **Smaller, less error-prone model surface.** In v2.1.156 the model had to (a) decide to create a team, (b) name it, (c) spawn against that name, (d) remember to delete it (and the delete could *fail* if teammates were still active, producing a structured `{success:false}` the model then had to act on). Four model-driven steps with two failure modes. v2.1.183 collapses all of that into "there is exactly one team, it already exists" — the model never names, creates, or deletes a team. The cost is a loss of flexibility (a session cannot host multiple named teams), which the redesign explicitly accepts: the `team_name` Agent parameter is now documented "Deprecated; ignored. The session has a single implicit team." (`:423458`, analysed in the sibling doc).
- **Determinism beats model judgement.** Team *existence* and *naming* are now mechanical (`session-<sessionId[:8]>`), so two independent code paths (e.g. the spawn leaf-functions and the SendMessage router) can both assume the team exists and agree on its name without round-tripping through model output. The spawn leaves now *throw* `"Internal error: session team not initialized…"` if `teamContext.teamName` is missing (`:422659` and peers), which is only safe because the team is guaranteed to exist at boot.

**Key insight:** Removing `TeamCreate`/`TeamDelete` is not just deleting two tools — it relocates *ownership of the team lifecycle* from the model (a probabilistic decision-maker) to the CLI bootstrap (a deterministic one). The telemetry removal (`tengu_team_created`/`_deleted` → 0) is the fingerprint that the *events those tools fired* no longer have a producer; the surviving swarm telemetry (`swarm_backend_detect`, `tengu_coordinator_mode_switched`, `tengu_teammate_mode_changed`) is about *spawning and mode*, not team CRUD. Confidence: **high**.

---

## 3. The SendMessage delta

`SendMessage` is the model's only channel to a teammate (its plain assistant text is never written to any inbox — see the teammate addendum, baseline §5). The tool def is `p$p` (`:434568`), schema `o$p` (`:434558`), description const `nza` (`:434314` = `"Send a message to another agent"`), prompt builder `rza` (`:434286`). Gate is still the master gate `isAgentSwarmsEnabled` (`Sl`, `:293832` — `isEnabled(){return Sl()}`).

### 3.1 The prompt rewrite is *one row*, not a rewrite — and the dossier's "compact markdown" framing applies to v2.1.156 too

**What I expected vs what the source shows:** The dossier described `rza` (`:434286`) as a "terse markdown prompt … rewrite". Reading **both** bundles, the v2.1.156 prompt `iO4` (v2.1.156 `:407201`) was *already* the same compact markdown (a JSON example, a `to` recipient table, the "your plain text is NOT visible … you MUST call this tool" paragraph, and a "Protocol responses (legacy)" section). A line-by-line `diff` of the two prompt bodies yields **exactly one changed hunk**:

```diff
  | `"researcher"` | Teammate by name |
+ | `"main"`       | The main conversation (background subagents only) |
```

So the only model-facing prompt change is the **new `"main"` recipient row**. (There is also a one-word change in the tool's `searchHint` field — v2.1.156 `"send messages to agent teammates (swarm protocol)"` → v2.1.183 `"send messages to agent teammates"`, `:434570` — cosmetic, not part of the prompt the model reads.)

```javascript
// ============================================
// SendMessage prompt builder - the recipient table now lists "main"
// Location: cli_inner_pretty.js:434286-434313 (the changed table rows at :434295-434298)
// ============================================

// ORIGINAL (for source lookup, the recipient-table hunk only):
| \`to\` | |
|---|---|
| \`"researcher"\` | Teammate by name |
| \`"main"\` | The main conversation (background subagents only) |${""}

// READABLE (for understanding):
// The SendMessage tool prompt (rza) is a compact markdown block. The ONLY change vs
// v2.1.156 (iO4) is the added "main" row below — the rest (JSON example, the
// "plain text is NOT visible — you MUST call this tool" paragraph, and the
// "Protocol responses (legacy)" shutdown/plan-approval section) is byte-identical.
//   | to            | meaning                                              |
//   | "researcher"  | Teammate by name                                     |
//   | "main"        | The main conversation (background subagents only)    |   <-- NEW

// Mapping: rza->buildSendMessagePrompt (v2.1.156: iO4). The "${""}" empty-template-literal
//          interpolations are the bundler's join artifacts, present in both versions.
```

**Why a table row rather than prose:** The model needs an unambiguous, scannable map from a `to:` string to a routing target, because `to:` is now *overloaded* (a bare teammate name, the literal `"main"`, or a socket address). A two-column table makes the discrete cases explicit; the prose paragraph below it still carries the *behavioral* rule ("plain text is not visible"). Confidence: **high** (verbatim `diff`).

### 3.2 `"main"` — routing a message back to the main conversation

**What it does:** A background subagent (or any agent with a `to:"main"` plain-text message) can now send a message *up* to the **main conversation** rather than to a teammate inbox. `"main"` is a reserved recipient name (`LY = "main"`, `:362512`); the Agent tool refuses to *name* a teammate `"main"` (schema refine, analysed in the sibling spawn doc) precisely so this routing is unambiguous.

**How it works (step-by-step, in `SendMessage.call`, `:434694-434719`):**

1. `call` first computes the sender identity from the calling task: `o = t.agentId`, `s = cza(t,o)` (the agent's name), and an `origin` descriptor `i` = `{kind:"peer", from:s, senderTaskId:o}` if both are known, else `{kind:"coordinator"}`.
2. If `to === LY` ("main") **and** the message is a plain string:
   - If the caller is itself the main conversation (`o === void 0`, no `agentId`) → refuse: *"You are the main conversation — \"main\" addresses you. Send to a named agent instead."* (no self-messaging).
   - Otherwise → enqueue the message onto the **main conversation's** prompt queue via `enqueuePrompt` (`o_`, the queue's `enqueue`, wired at `:234005`) targeting `getMainAgentId()` (`Ls`, `:2664`), with `priority:"next"`, `isMeta:true`, `skipSlashCommands:true`, and the computed `origin`. Returns *"Message queued for the main conversation's next turn."*

```javascript
// ============================================
// SendMessage.call - the new "main" recipient leg (route to the main conversation queue)
// Location: cli_inner_pretty.js:434694-434719
// ============================================

// ORIGINAL (for source lookup):
async call(e, t, n, r) {
  let o = t.agentId, s = o ? cza(t, o) : void 0,
    i = o !== void 0 && s !== void 0 ? { kind: "peer", from: s, senderTaskId: o } : { kind: "coordinator" },
    a = typeof e.message === "string" && o !== void 0 && s !== void 0 ? lDa(s, e.message) : e.message;
  if (typeof e.message === "string" && typeof a === "string" && e.to === LY) {
    if (o === void 0)
      return { data: { success: !1, message: `You are the main conversation — "${LY}" addresses you. Send to a named agent instead.` } };
    return (
      o_({ mode: "prompt", agentId: Ls(), value: a, priority: "next", origin: i, skipSlashCommands: !0, isMeta: !0 }),
      { data: { success: !0, message: "Message queued for the main conversation's next turn." } }
    );
  }
  // ... (named-teammate / background-resume / structured-message legs below) ...
}

// READABLE (for understanding):
async call(input, ctx, canUseTool, meta) {
  let callerTaskId = ctx.agentId;
  let callerName   = callerTaskId ? resolveAgentName(ctx, callerTaskId) : undefined;     // cza
  let origin = (callerTaskId !== undefined && callerName !== undefined)
      ? { kind: "peer", from: callerName, senderTaskId: callerTaskId }
      : { kind: "coordinator" };
  // If a known peer sends plain text, wrap it in a <agent-message from="..."> relay envelope:
  let payload = (typeof input.message === "string" && callerName !== undefined)
      ? wrapRelayMessage(callerName, input.message)                                       // lDa -> <agent-message from=...>
      : input.message;

  if (typeof input.message === "string" && typeof payload === "string" && input.to === RESERVED_MAIN_NAME) {
    if (callerTaskId === undefined)                                                       // the main conversation itself
      return { data: { success: false, message: `You are the main conversation — "main" addresses you. Send to a named agent instead.` } };
    enqueuePrompt({ mode: "prompt", agentId: getMainAgentId(), value: payload,            // o_ -> main conversation queue
                    priority: "next", origin, skipSlashCommands: true, isMeta: true });
    return { data: { success: true, message: "Message queued for the main conversation's next turn." } };
  }
  // ...
}

// Mapping: cza->resolveAgentName, lDa->wrapRelayMessage (<agent-message from=...> envelope, Nen="agent-message" @:45675),
//          o_->enqueuePrompt (ug.enqueue @:234005), Ls->getMainAgentId, LY->RESERVED_MAIN_NAME ("main")
```

**Why this approach (trade-offs):**

- **Why a queue, not a mailbox file.** Every *teammate* recipient gets a file inbox because teammates may be in a different process. The **main conversation**, by contrast, is always *this* process's REPL — so the natural, lowest-latency channel is the in-memory prompt queue, not a disk file. Routing `"main"` through `enqueuePrompt` (rather than `writeToMailbox("team-lead", …)`) delivers the message as the main agent's *next turn* directly, with `priority:"next"` so it jumps ahead of any backlog. This is also why `"main"` had to become a *reserved* name: if a teammate were named `"main"`, `to:"main"` would be ambiguous between "queue to the REPL" and "write to that teammate's inbox".
- **Why `isMeta:true` + `skipSlashCommands:true`.** The queued message is a *system-injected* turn, not user keystrokes: `isMeta` marks it as not-user-authored (so UI/telemetry treat it correctly), and `skipSlashCommands` prevents a teammate's message body that happens to start with `/` from being interpreted as a slash command in the main session. The `origin` descriptor (`{kind:"peer", from, senderTaskId}`) lets the main conversation attribute the message to the originating agent.
- **Why the relay envelope `lDa`.** When the sender is a known peer, the plain text is wrapped in `<agent-message from="<name>">…</agent-message>` (`lDa`, `:362507`, tag `Nen="agent-message"` `:45675`) *before* being queued, so the main conversation sees *who* the message is from, mirroring how teammate inboxes get `<teammate-message>` envelopes. Note the `to:"main"` self-send guard fires *before* this wrap is used for routing — the wrap (`payload`) is what gets enqueued.

**Key insight:** `"main"` makes the message graph bidirectional for **background subagents**. Previously a teammate could be *messaged* by the leader and could message *peers*, but the prompt explicitly scopes `"main"` to "background subagents only" — i.e. it is the up-channel a detached background agent uses to surface a result to the conversation that spawned it, delivered as that conversation's next turn instead of as an out-of-band notification. Confidence: **high** (read directly at `:434694-434719`).

### 3.3 `validateInput` — new cross-session socket-address validation

**What it does:** `SendMessage.validateInput` (`:434611`) is the protocol gatekeeper. Most of its rules are carried over from v2.1.156 (reject empty `to`; reject `to:"*"` broadcast with "no longer supported — send a message per recipient"; reject `@` in `to` with "there is only one team per session"; require `summary` for string messages; constrain `shutdown_response`). The **new** v2.1.183 logic is the local-socket-address validation in the middle.

**The before-picture is subtle — `bridge:`/`uds:` *parsing* already existed in v2.1.156.** v2.1.156's `validateInput` already called `lO4(H.to)` (v2.1.156 `:407498`, an address-scheme parser) and already rejected a `bridge`/`uds` scheme with an empty target ("address target must not be empty", v2.1.156 `:407500`). So the scheme parser is **not** new. What is new in v2.1.183:

1. **The parser `LLa` (`:359974`) gained a Windows named-pipe branch.** v2.1.156 `lO4` recognised `uds:`, `bridge:`, and a leading `/` (treated as `uds`). v2.1.183 `LLa` adds a fourth case: a leading `\\.\pipe\` is also treated as `uds` (`:359978`).
2. **A real "is this a local socket address?" gate `Lhe` (`:359981`).** This predicate is entirely new in v2.1.183 (`grep "is not a local socket address"` = 0 in v2.1.156). It validates the *target* (and the raw `to`) and, on failure, returns *"'<to>' is not a local socket address. Use an address from ListAgents."* (`:434622-434627`).

```javascript
// ============================================
// SendMessage.validateInput - new local-socket-address gate (bridge:/uds:) + address parser
// Location: cli_inner_pretty.js:434611-434633 (parser LLa :359974, predicate Lhe :359981)
// ============================================

// ORIGINAL (for source lookup):
async validateInput(e, t) {
  if (e.to.trim().length === 0) return { result: !1, message: "to must not be empty", errorCode: 9 };
  if (e.to === "*")
    return { result: !1, message: 'broadcast (to: "*") is no longer supported — send a message per recipient', errorCode: 9 };
  let n = LLa(e.to);
  if ((n.scheme === "bridge" || n.scheme === "uds") && n.target.trim().length === 0)
    return { result: !1, message: "address target must not be empty", errorCode: 9 };
  if (!Lhe(n.target) || !Lhe(e.to))
    return { result: !1, message: `'${e.to}' is not a local socket address. Use an address from ${Gtt}.`, errorCode: 9 };
  if (e.to.includes("@"))
    return { result: !1, message: "to must be a bare teammate name — there is only one team per session", errorCode: 9 };
  // ... string-message rules below (§3.4) ...
}

// ORIGINAL parser + predicate:
function LLa(e) {
  if (e.startsWith("uds:"))      return { scheme: "uds",    target: e.slice(4) };
  if (e.startsWith("bridge:"))   return { scheme: "bridge", target: e.slice(7) };
  if (e.startsWith("/"))         return { scheme: "uds",    target: e };
  if (e.startsWith("\\\\.\\pipe\\")) return { scheme: "uds", target: e };     // NEW vs v2.1.156 lO4
  return { scheme: "other", target: e };
}
function Lhe(e) {
  if (!/^[\\/]{2}/.test(e)) return !0;                                        // not a //-prefixed UNC/pipe path => accept
  let t = /^[\\/]{2}[.?][\\/]pipe[\\/]([^\\/]+)$/i.exec(e);                   // must be \\.\pipe\<name>
  return t !== null && t[1] !== "." && t[1] !== "..";
}

// READABLE (for understanding):
async validateInput(input, ctx) {
  if (input.to.trim().length === 0) return reject("to must not be empty");
  if (input.to === "*") return reject('broadcast (to: "*") is no longer supported — send a message per recipient');
  let addr = parseSocketAddress(input.to);                                    // LLa: {scheme:"uds"|"bridge"|"other", target}
  if ((addr.scheme === "bridge" || addr.scheme === "uds") && addr.target.trim().length === 0)
    return reject("address target must not be empty");
  // NEW in v2.1.183: a //-prefixed target must be a well-formed Windows named pipe (\\.\pipe\<name>);
  // a plain teammate name (no // prefix) passes isLocalSocketAddress trivially.
  if (!isLocalSocketAddress(addr.target) || !isLocalSocketAddress(input.to))
    return reject(`'${input.to}' is not a local socket address. Use an address from ${LIST_AGENTS_TOOL}.`);
  if (input.to.includes("@")) return reject("to must be a bare teammate name — there is only one team per session");
  // ...
}

// Mapping: LLa->parseSocketAddress, Lhe->isLocalSocketAddress, Gtt->LIST_AGENTS_TOOL ("ListAgents" @:221577)
```

**Why this approach (trade-offs and the design intent):**

- **What the gate actually rejects.** `Lhe` is permissive by design: any `to` *not* starting with two slashes/backslashes returns `true` immediately, so an ordinary teammate name (`"researcher"`) and a `uds:` *unix-socket path* (whose target may start with a single `/`, which is not the `//` prefix) both pass. The gate only *bites* on a `//`-prefixed string that is **not** a valid `\\.\pipe\<name>` named pipe — i.e. it is there to catch a malformed Windows named-pipe address (and to reject the degenerate `\\.\pipe\.` / `\\.\pipe\..` cases). It is a *format* guard for the new cross-machine/cross-session socket transport, not a teammate-name guard.
- **The `ListAgents` hint.** On rejection the message points the model at the **`ListAgents`** tool (`Gtt = "ListAgents"`, `:221577`) — the canonical way to discover *valid* addresses (live peer sessions, teammates) instead of guessing a socket path. This is the coordinator-mode discovery surface (cross-session peers are reachable via `uds:` same-machine / `bridge:` cross-machine addresses — see [`coordinator_and_background_survival.md`](coordinator_and_background_survival.md)). Note the dossier's anchor table tentatively read `Gtt` as an "address-list constant"; reading the only `Gtt` assignment in the bundle (`:221577`) shows it is literally the string `"ListAgents"` (the tool name), so the error reads "Use an address from ListAgents." — i.e. *run the ListAgents tool*.
- **Why validate the address shape at all.** The new socket transports (`uds:`, `bridge:`) carry a message across a process/machine boundary to a *peer session*. A malformed pipe address would fail deep in the socket layer with an opaque error; validating the shape up front (and steering the model to `ListAgents`) turns a runtime socket failure into an actionable tool-validation message.

**Key insight:** The cross-session `bridge:`/`uds:` *addressing* is not brand-new (the parser existed in v2.1.156); what v2.1.183 adds is the **format validation + discovery hint** that make those addresses *safely model-usable*, in lock-step with coordinator mode's expansion to cross-session peers. Confidence: **high** for the new `Lhe` gate and the `\\.\pipe\` branch (read directly + grep-confirmed absent in v2.1.156); **medium** only on the *intended* reach of the gate (the regex semantics are read directly, but the full set of inputs that reach it across all callers was not exhaustively enumerated).

### 3.4 Two new "don't smuggle a protocol/lifecycle JSON frame as plain text" rejections

**What it does:** When `message` is a *string*, v2.1.183 adds two new guards (after the existing "summary is required" check) that reject a string that is actually a serialized control frame in disguise:

1. `if (iF(e.message))` → reject: the text must not be a *teammate protocol frame* (permission/mode/plan/shutdown JSON). The error tells the model to use the structured object form (`{"message":{"type":...}}`) for plan/shutdown responses, else send plain text (`:434637-434643`).
2. A `try { let r = Gt(e.message); … }` block that parses the string and, if it is an object whose `type` is one of `["idle_notification","teammate_terminated","task_assignment","task_completed","shutdown_rejected"]`, rejects it as a *lifecycle/task frame* (`:434644-434665`).

```javascript
// ============================================
// SendMessage.validateInput - reject control/lifecycle JSON masquerading as a plain string
// Location: cli_inner_pretty.js:434634-434666 (protocol-frame predicate iF :366256)
// ============================================

// ORIGINAL (for source lookup):
if (typeof e.message === "string") {
  if (!e.summary || e.summary.trim().length === 0)
    return { result: !1, message: "summary is required when message is a string", errorCode: 9 };
  if (iF(e.message))
    return { result: !1, message: 'message text must not be a teammate protocol frame (permission/mode/plan/shutdown JSON) — to respond to a plan or shutdown request, use the structured object form ({"message": {"type": ...}}); otherwise send plain text', errorCode: 9 };
  try {
    let r = Gt(e.message);
    if (r !== null && typeof r === "object" && "type" in r && typeof r.type === "string" &&
        ["idle_notification","teammate_terminated","task_assignment","task_completed","shutdown_rejected"].includes(r.type))
      return { result: !1, message: "message text must not be a teammate lifecycle/task frame (idle/terminated/task/shutdown JSON) — send plain text instead", errorCode: 9 };
  } catch {}
  return { result: !0 };
}

// READABLE (for understanding):
if (typeof input.message === "string") {
  if (!input.summary || input.summary.trim().length === 0)
    return reject("summary is required when message is a string");
  // Guard 1: the string must not be a control/protocol frame (iF: the 10-type protocol set, §3.5):
  if (isProtocolFrame(input.message))
    return reject('message text must not be a teammate protocol frame ... use the structured object form ({"message":{"type":...}}) ... otherwise send plain text');
  // Guard 2: nor a lifecycle/task notification frame:
  try {
    let parsed = jsonParse(input.message);
    if (isObjectWithType(parsed) &&
        ["idle_notification","teammate_terminated","task_assignment","task_completed","shutdown_rejected"].includes(parsed.type))
      return reject("message text must not be a teammate lifecycle/task frame ... send plain text instead");
  } catch {}
  return { result: true };
}

// Mapping: iF->isProtocolFrame (protocol-frame type-set predicate @:366256), Gt->jsonParse
```

**Why this approach:** The mailbox stores *both* chat (`type:"message"`) and serialized control frames (a control frame is `writeToMailbox`'d as a `text` field holding the JSON). A naive model could try to *fake* a control message by hand-serializing the JSON into a plain `message` string — which would land in the recipient's inbox as a chat message whose `text` parses as, say, a `shutdown_request`, confusing the recipient's poll loop. These two guards close that hole at the tool boundary: they detect a string that *parses* as any protocol frame (`iF`) or lifecycle/task notification, and force the model to either use the **structured object** form (which routes through the proper `shutdown_request`/`shutdown_response`/`plan_approval_response` handlers) or send genuine prose. Confidence: **high** (read directly; `iF` is the 10-type set at `:366256`).

### 3.5 The `message` union is UNCHANGED — resolving the dossier's open question #5

**What it does:** The schema's model-facing `message` field is `H.union([H.string(), r$p()])` where `r$p` (`:434542`) is a discriminated union on `type`. The dossier flagged (open question #5 / §3.6 medium-confidence) a possible "trim" — that `team_permission_update` / `mode_set_request` might have been removed from the model-facing union. **Reading both bundles shows there was no trim.**

The v2.1.183 union `r$p` (`:434542`) is exactly three members:

```javascript
// ORIGINAL (cli_inner_pretty.js:434542-434556): r$p, the model-facing message union
H.discriminatedUnion("type", [
  H.object({ type: H.literal("shutdown_request"), reason: H.string().optional() }),
  H.object({ type: H.literal("shutdown_response"),
             request_id: H.string().regex(lza, "must be the request id being responded to"),
             approve: n0(), reason: H.string().optional() }),
  H.object({ type: H.literal("plan_approval_response"),
             request_id: H.string().regex(lza, "must be the request id being responded to"),
             approve: n0(), feedback: H.string().optional() }),
])
```

The v2.1.156 union `hh_` (v2.1.156 `:407421`) is the **same three members** — `shutdown_request`, `shutdown_response`, `plan_approval_response` — and never contained `team_permission_update` or `mode_set_request`. So:

- **No member was removed.** The model-facing union was already these three in v2.1.156.
- **The one real schema delta is a tightening, not a trim:** v2.1.183 adds `.regex(lza, "must be the request id being responded to")` to the `request_id` field of both `shutdown_response` and `plan_approval_response`, where `lza = /^[^\n\r]{1,200}$/` (`:434539`). v2.1.156's `request_id` was a bare `y.string()` (v2.1.156 `:407425`, `:407431`). This bounds the echoed request id to a single line of ≤200 chars — a small input-hygiene guard.
- `team_permission_update` / `mode_set_request` remain in the **internal** protocol-frame set `iF` (`:366256`) — the same 10-type set as v2.1.156 — because the *protocol* still uses them on the wire (e.g. the permission bridge writes a `team_permission_update`); they are simply **not things the model can submit via SendMessage**, which was true in both versions.

**Key insight / caveat honesty:** What looked like a "union trim" in the dossier is not a delta at all — it is the *pre-existing* gap between the **model-facing union** (3 types, both versions) and the **internal protocol type-set** (10 types, both versions). The only genuine `message`-schema change v2.1.183 makes is the `request_id` regex tightening. The dossier's open question #5 is therefore answered **negatively** (no trim). Confidence: **high** (both union declarations read directly; `iF` type-set read directly in v2.1.183 and matches v2.1.156's `$X8`).

### 3.6 What did NOT change in SendMessage (carryover, link only)

- The **string-message send path** `sendTeammateMessage` (`i$p`, `:434357`) is the same `writeToMailbox(to, {from,text,summary,color,…}, team)` it was in v2.1.156 `Ih_`, with the same `{success:false}` "no agent named … is addressable" guard when there is no team — plus a v2.1.183 refinement that, for a non-`team-lead` recipient not in `teamContext.teammates`, it re-reads the team file (`Nhe`, `:362824`) and suggests `Agent({name:'<x>'})` if the name isn't on the roster (`:434367-434377`). Baseline: [`mailbox_and_lifecycle_tools.md`](../../../claude_code_v_2.1.156/analyze/30_agent_team/mailbox_and_lifecycle_tools.md) §4.3.
- The **structured-message legs** `handleShutdownRequest` (`a$p`, `:434391`), `handleShutdownApproval` (`l$p`, `:434402`), `handleShutdownRejection` (`c$p`, `:434455`), `handlePlanApproval`/`Rejection` (`u$p`/`d$p`, `:434464`/`:434490`) all still build a control frame (`Llt`/`wso`/`Cso` shutdown builders at `:366162`/`:366171`/`:366181`) and `writeToMailbox` it — unchanged shape. The in-process shutdown-approval still directly aborts the teammate's `AbortController` (`:434419-434424`). A new pre-dispatch guard refuses structured team-protocol messages from a *background subagent* (only the session itself may send them) at `:434871-434881`.
- The **background-agent resume** path (the bulk of `call`, `:434720-434869`) — queueing to a running agent (`gWe`, `:445814`), resuming a stopped/non-running one in the background (`dLe`), or resuming as an in-process teammate (`eza`) — is a continuation of the v2.1.156 SendMessage→Task bridge and is documented in the Task/background docs, out of scope here.

---

## Confidence & open questions carried from the dossier

- **High confidence:** mailbox `$A` byte-identity (diffed against v2.1.156 `aA`); teams-root `Gbe()` with no `.claude/teams` literal; TeamCreate/TeamDelete removal (grep=0 vs 6/5) and telemetry removal (grep=0 vs 1/1); the `"main"` recipient row + routing leg (read at `:434694-434719`); the new `Lhe` socket-address gate + `\\.\pipe\` parser branch (read + grep-confirmed absent in v2.1.156).
- **Open question #5 — RESOLVED (negatively):** the `message` union was **not** trimmed. Both v2.1.156 `hh_` and v2.1.183 `r$p` are the same three members; `team_permission_update`/`mode_set_request` were never in the model-facing union. The only real schema delta is the `request_id` regex tightening (`lza`).
- **Medium confidence — reach of the `Lhe` gate (§3.3):** the regex semantics and the rejection branch are read directly, but I did not exhaustively enumerate every `to:` input that reaches it across all callers (e.g. coordinator-mode peer sends). Treat the gate as a *format* validator for the new `uds:`/`bridge:` transport, steering to `ListAgents`, rather than a teammate-name validator.
- **`Gtt` reading:** the dossier's anchor table tentatively called `Gtt` an "address-list constant"; the source shows `Gtt = "ListAgents"` (`:221577`, the tool name), so the error means "use an address discovered via the ListAgents tool." Corrected here.
- The implicit-team bootstrap, the Agent-tool `name`/`team_name`/`mode` schema (including the `"main"` *name* refinement), and the spawn dispatcher are **not** in this doc's scope — see [`implicit_team_and_agent_tool_spawn.md`](implicit_team_and_agent_tool_spawn.md). Coordinator mode's cross-session peers (the consumers of `uds:`/`bridge:`) are in [`coordinator_and_background_survival.md`](coordinator_and_background_survival.md).

---

## Related Symbols

> Symbol mappings live in the central index, never in this doc:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent Loop, Tools, State)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Agent Team / swarm lives here)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Permissions, Model)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - per-feature additions: [symbol_additions_v2_1_183_agent_team.md](../00_overview/symbol_additions_v2_1_183_agent_team.md)

Key functions/constants in this document (list format, per CLAUDE.md):

- `writeToMailbox` (obfuscated: `$A`, `cli_inner_pretty.js:365950`) — universal send; lock→re-read→push→atomicWrite; byte-identical algorithm to v2.1.156 `aA`.
- `getInboxPath` (obfuscated: `v4e`, `cli_inner_pretty.js:365916`) — `<teamsDir>/<team>/inboxes/<agent>.json` (carryover).
- `ensureInboxDir` (obfuscated: `Kyp`, `cli_inner_pretty.js:365924`) / `readMailbox` (obfuscated: `Fhe`, `cli_inner_pretty.js:365930`) — carryover.
- `getTeamsDir` (obfuscated: `Gbe`, `cli_inner_pretty.js:735`) — `path.join(tr(), "teams")`; no `.claude/teams` literal.
- `getConfigDir` (obfuscated: `tr`, `cli_inner_pretty.js:825`) — `CLAUDE_CONFIG_DIR ?? ~/.claude` (NFC-normalized).
- `LOCK_OPTIONS` (obfuscated: `iUt`, used `cli_inner_pretty.js:365965`) — proper-lockfile retry/backoff (carryover; v2.1.156 `DG$`).
- `SendMessageTool` (obfuscated: `p$p`, `cli_inner_pretty.js:434568`) — the tool def; gate `isEnabled(){return Sl()}`.
- `SendMessageSchema` (obfuscated: `o$p`, `cli_inner_pretty.js:434558`) — `{to, summary?(max 200), message: string | r$p}`.
- `sendMessageMessageUnion` (obfuscated: `r$p`, `cli_inner_pretty.js:434542`) — 3-type discriminated union (unchanged vs v2.1.156 `hh_`); `request_id` regex `lza` (`:434539`) is new.
- `buildSendMessagePrompt` (obfuscated: `rza`, `cli_inner_pretty.js:434286`) — compact markdown; only the `"main"` table row is new vs v2.1.156 `iO4`.
- `SEND_MESSAGE_DESCRIPTION` (obfuscated: `nza`, `cli_inner_pretty.js:434314`) — `"Send a message to another agent"`.
- `sendTeammateMessage` (obfuscated: `i$p`, `cli_inner_pretty.js:434357`) — string-message leg → `writeToMailbox` (carryover; v2.1.156 `Ih_`).
- `RESERVED_MAIN_NAME` (obfuscated: `LY`, `cli_inner_pretty.js:362512`) — `"main"`; routed to the main conversation in `call`.
- `wrapRelayMessage` (obfuscated: `lDa`, `cli_inner_pretty.js:362507`) — `<agent-message from="…">` envelope; tag `agent-message` (`Nen`, `:45675`).
- `enqueuePrompt` (obfuscated: `o_`, wired at `cli_inner_pretty.js:234005`) — the main conversation's prompt queue `enqueue`.
- `getMainAgentId` (obfuscated: `Ls`, `cli_inner_pretty.js:2664`) — main conversation agent id.
- `resolveAgentName` (obfuscated: `cza`, `cli_inner_pretty.js:434343`) — caller-task name resolver.
- `parseSocketAddress` (obfuscated: `LLa`, `cli_inner_pretty.js:359974`) — `uds:`/`bridge:`/`/`/`\\.\pipe\` scheme parser (the `\\.\pipe\` branch is new).
- `isLocalSocketAddress` (obfuscated: `Lhe`, `cli_inner_pretty.js:359981`) — new local-socket-address format gate.
- `isProtocolFrame` (obfuscated: `iF`, `cli_inner_pretty.js:366256`) — 10-type protocol-frame predicate (unchanged set; v2.1.156 `$X8`).
- `LIST_AGENTS_TOOL` (obfuscated: `Gtt`, `cli_inner_pretty.js:221577`) — the string `"ListAgents"` cited in the socket-address rejection.
- `TEAM_LEAD_NAME` (obfuscated: `np`, `cli_inner_pretty.js:362636`) — `"team-lead"`.
- shutdown frame builders `createShutdownRequest`/`Approved`/`Rejected` (obfuscated: `Llt`/`wso`/`Cso`, `cli_inner_pretty.js:366162`/`:366171`/`:366181`).
- `isAgentSwarmsEnabled` (obfuscated: `Sl`, `cli_inner_pretty.js:293832`) — master gate (carryover; v2.1.156 `R7`).
- v2.1.156 before-picture: `SendMessageTool` (obfuscated: `Bh_`, v2.1.156 `cli_inner_pretty.js:407447`), union `hh_` (v2.1.156 `:407421`), prompt `iO4` (v2.1.156 `:407201`), address parser `lO4` (v2.1.156 `:407013`), `TeamCreateTool`/`TeamDeleteTool` (obfuscated: `Th_`/`vh_`, v2.1.156 `:406631`/`:406775`), team name consts `rd`/`Oo` (v2.1.156 `:216438`/`:216439`).
