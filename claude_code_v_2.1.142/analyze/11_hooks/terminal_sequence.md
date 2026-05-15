# `terminalSequence` JSON Output Field (v2.1.141)

## Overview

v2.1.141 adds a top-level `terminalSequence: string` field to the hook JSON output schema. The changelog:

> Added `terminalSequence` field to hook JSON output so hooks can emit desktop notifications, window titles, and bells without a controlling terminal

This solves an awkward gap. As of v2.1.139, hooks spawn **detached** (no TTY) — so a hook can't just `printf '\x1b]9;;Done!\x07'` to write an OSC 9 notification, because it has no terminal to write to. Hooks must now ask Claude Code to do it on their behalf via the JSON output protocol. Claude Code validates the sequence against a strict allowlist (OSC 0/1/2/9/99/777 + BEL) and emits it through its own terminal handle.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Hooks
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Terminal IO
> - [symbol_additions_v2_1_142_hooks.md](../00_overview/symbol_additions_v2_1_142_hooks.md) - New symbols

Key functions in this document:

- `parseHookJSONOutput` (`Kh4`) — Recognizes `terminalSequence` in validated output
- `applyHookJSONOutput` (`TW8`) — Routes `terminalSequence` through allowlist when building result
- `validateTerminalSequence` (`Lm6`) — Parses and re-serializes only allowlisted OSCs/BEL
- `emitTerminalSequence` (`Pm6`) — Writes to the top of the terminal-emitter stack
- `dispatchTerminalSequence` (`ZW8`) — Side-channel emitter used in callbacks/MCP hook paths
- `terminalAllowlist` (`DZ5`) — `new Set([0, 1, 2, 9, 99, 777])` — the OSC ps allowlist

## Hook Output Schema (v2.1.142)

```javascript
// ============================================
// hookResponseSchema - JSON-output schema gains terminalSequence
// Location: cli_inner_pretty.js:519020-519121
// ============================================

// ORIGINAL (for source lookup):
(Lu5 = yH(() =>
  y.object({
    continue: y.boolean().describe("Whether Claude should continue after hook (default: true)").optional(),
    suppressOutput: y.boolean().describe("Hide stdout from transcript (default: false)").optional(),
    stopReason: y.string().describe("Message shown when continue is false").optional(),
    decision: y.enum(["approve", "block"]).optional(),
    reason: y.string().describe("Explanation for the decision").optional(),
    systemMessage: y.string().describe("Warning message shown to the user").optional(),
    terminalSequence: y
      .string()
      .describe(
        "A terminal escape sequence (e.g. OSC 9 / OSC 777 desktop-notification) for Claude Code to emit on your behalf. Only notification/title OSCs (0, 1, 2, 9, 99, 777) and BEL are permitted; anything else is dropped.",
      )
      .optional(),
    hookSpecificOutput: y.union([...]).optional(),
  })
)),

// READABLE (for understanding):
const hookSyncResponseSchema = lazySchema(() =>
  z.object({
    continue: z.boolean().optional(),
    suppressOutput: z.boolean().optional(),
    stopReason: z.string().optional(),
    decision: z.enum(["approve", "block"]).optional(),
    reason: z.string().optional(),
    systemMessage: z.string().optional(),
    // NEW v2.1.141: out-of-band terminal output via Claude Code's TTY handle
    terminalSequence: z.string().optional(),
    hookSpecificOutput: z.union([...allEventDiscriminants]).optional(),
  }),
);

// Mapping: Lu5→hookSyncResponseSchema, y→zod, yH→lazySchema
```

## Allowlist Validator

```javascript
// ============================================
// validateTerminalSequence - OSC 0/1/2/9/99/777 + BEL allowlist parser
// Location: cli_inner_pretty.js:467431-467435
// ============================================

// ORIGINAL (for source lookup):
function Lm6(H) {
  let $ = XZ5(H);
  if ($ === null) return null;
  return $.map((q) => (q.kind === "bel" ? BT : EZ(pj(q.ps, q.payload)))).join("");
}

// READABLE (for understanding):
function validateTerminalSequence(input) {
  const parsedTokens = parseEscapeTokens(input);     // XZ5: returns null if any token fails the allowlist
  if (parsedTokens === null) return null;            // ← caller treats null as "rejected, drop"
  return parsedTokens
    .map((token) =>
      token.kind === "bel"
        ? BEL_BYTE                                    // Re-emit BEL
        : encodeOSC(formatOSCBody(token.ps, token.payload))  // Re-emit OSC k;... ST
    )
    .join("");
}

// Mapping: Lm6→validateTerminalSequence, XZ5→parseEscapeTokens,
//   BT→BEL_BYTE, EZ→encodeOSC, pj→formatOSCBody
```

And the underlying allowlist set:

```javascript
// ============================================
// terminalAllowlist - OSC ps codes accepted by validateTerminalSequence
// Location: cli_inner_pretty.js:467456
// ============================================

// ORIGINAL (for source lookup):
DZ5 = new Set([0, 1, 2, 9, 99, 777]);

// READABLE (for understanding):
// 0   = Set icon+window title
// 1   = Set icon name
// 2   = Set window title
// 9   = iTerm2 notification / Windows Terminal progress
// 99  = Notification (xterm.js)
// 777 = Generic notification (kitty, ghostty, et al)
const TERMINAL_ALLOWLIST = new Set([0, 1, 2, 9, 99, 777]);

// Mapping: DZ5→TERMINAL_ALLOWLIST
```

## Validation in Allowlist Parser

Inside `parseEscapeTokens` (XZ5, `cli_inner_pretty.js:~467400-467430`), the OSC-specific code rejects any sequence whose `ps` (the OSC numeric parameter) isn't in `DZ5`:

```javascript
// Excerpted from parseEscapeTokens (XZ5):
if (!/^\d+$/.test(O)) return null;
let w = Number(O);
if (!DZ5.has(w)) return null;                       // ← Reject the entire input if any OSC violates allowlist
```

Note this rejects the **whole input**, not just the offending sequence. If a hook returns `OSC 9 BEL OSC 12 BEL` (where OSC 12 sets the cursor color), nothing is emitted — not even the legal OSC 9. This is intentional: parse-fail = drop-entire-input prevents partial emissions where the second OSC might be a token that confuses the terminal.

## Emit Stack

```javascript
// ============================================
// emitTerminalSequence - Push to currently-active terminal emitter
// Location: cli_inner_pretty.js:467447-467449
// ============================================

// ORIGINAL (for source lookup):
function Pm6(H) {
  F2$.at(-1)?.(H);
}

// READABLE (for understanding):
function emitTerminalSequence(validatedSequence) {
  // F2$ is a stack of emitter callbacks. The topmost entry is the active terminal.
  // .at(-1) returns the most-recently-pushed; ?.( ) is a no-op if the stack is empty.
  terminalEmitterStack.at(-1)?.(validatedSequence);
}

// Mapping: Pm6→emitTerminalSequence, F2$→terminalEmitterStack
```

And the stack manipulators:

```javascript
// ORIGINAL (cli_inner_pretty.js:467436-467446):
function oM4(H) {
  if (H === null) { F2$.length = 0; return; }
  F2$.push(H);
}
function aM4(H) {
  let $ = F2$.lastIndexOf(H);
  if ($ >= 0) F2$.splice($, 1);
}

// READABLE:
function pushTerminalEmitter(emitter) {
  if (emitter === null) { terminalEmitterStack.length = 0; return; }
  terminalEmitterStack.push(emitter);
}
function popTerminalEmitter(emitter) {
  const idx = terminalEmitterStack.lastIndexOf(emitter);
  if (idx >= 0) terminalEmitterStack.splice(idx, 1);
}
```

The stack pattern allows nested terminals (REPL, in-IDE chrome, agent attach session) to layer their write hooks without losing access to the parent when popped.

## Routing in Stream Aggregator

Inside the `dispatchHookOutputStream` (`aP`) consumer loop, the streamed result is checked and emitted as soon as it arrives:

```javascript
// ============================================
// dispatchHookOutputStream - terminalSequence emit branch
// Location: cli_inner_pretty.js:522071-522072
// ============================================

// ORIGINAL (for source lookup):
if (g.terminalSequence) Pm6(g.terminalSequence);

// READABLE (for understanding):
if (yielded.terminalSequence) emitTerminalSequence(yielded.terminalSequence);

// Mapping: g→yielded, Pm6→emitTerminalSequence
```

The same field is set by `applyHookJSONOutput` (`TW8`) at `cli_inner_pretty.js:520641-520648` when transforming the parsed JSON into a result object — but ONLY if the validator returned non-null:

```javascript
// ============================================
// applyHookJSONOutput - terminalSequence allowlist gate
// Location: cli_inner_pretty.js:520641-520648
// ============================================

// ORIGINAL (for source lookup):
if (H.terminalSequence) {
  let D = Lm6(H.terminalSequence);
  if (D !== null) M.terminalSequence = D;
  else
    N(`Hook ${q} (${_}) returned a terminalSequence that was rejected by the allowlist (only OSC 0/1/2/9/99/777 and BEL are permitted)`);
}

// READABLE (for understanding):
if (parsedJSON.terminalSequence) {
  const validated = validateTerminalSequence(parsedJSON.terminalSequence);
  if (validated !== null) {
    result.terminalSequence = validated;
  } else {
    logForDebugging(
      `Hook ${hookName} (${hookEvent}) returned a terminalSequence that was rejected by the allowlist ` +
      `(only OSC 0/1/2/9/99/777 and BEL are permitted)`,
    );
    // Validator failed → the field is NOT placed on result, so the aggregator never emits anything
  }
}

// Mapping: H→parsedJSON, M→result, q→hookName, _→hookEvent, Lm6→validateTerminalSequence
```

## Side-channel Emitter for Non-stream Callers

Callback and side-stream callers (e.g., `YW` — the synchronous hook driver used by PreCompact, SessionEnd) use a parallel helper `ZW8`:

```javascript
// ============================================
// dispatchTerminalSequence - Side-channel emitter for non-streaming hook callers
// Location: cli_inner_pretty.js:522183-522192
// ============================================

// ORIGINAL (for source lookup):
function ZW8(H, $) {
  if (!H || !ZS(H) || !H.terminalSequence) return;
  let q = Lm6(H.terminalSequence);
  if (q !== null) Pm6(q);
  else
    N(`Hook ${$} returned a terminalSequence that was rejected by the allowlist (only OSC 0/1/2/9/99/777 and BEL are permitted)`);
}

// READABLE (for understanding):
function dispatchTerminalSequence(parsedJSON, hookLabel) {
  if (!parsedJSON || !isPlainObject(parsedJSON) || !parsedJSON.terminalSequence) return;
  const validated = validateTerminalSequence(parsedJSON.terminalSequence);
  if (validated !== null) {
    emitTerminalSequence(validated);
  } else {
    logForDebugging(
      `Hook ${hookLabel} returned a terminalSequence that was rejected by the allowlist ` +
      `(only OSC 0/1/2/9/99/777 and BEL are permitted)`,
    );
  }
}

// Mapping: ZW8→dispatchTerminalSequence, H→parsedJSON, $→hookLabel,
//   ZS→isPlainObject, Lm6→validateTerminalSequence, Pm6→emitTerminalSequence
```

This is called from `YW`'s callback/mcp_tool branches at `cli_inner_pretty.js:522255-522283` so non-streaming events (PreCompact, SessionEnd, etc.) also honor `terminalSequence`.

## Key Decisions/Algorithms

### Strict allowlist over taint propagation

**What it does:** Only OSC 0/1/2/9/99/777 and BEL bytes are accepted. Anything else — cursor positioning, color changes, alternate buffer switches — is rejected.

**How it works:**
1. `parseEscapeTokens` walks the input bytewise, identifies each OSC start (`ESC ]`) and end (BEL or `ESC \`).
2. For each OSC, it extracts the `ps` integer and checks `DZ5.has(ps)`.
3. Any failure returns `null` for the entire input — no partial output.

**Why this approach:**
- A hook is **arbitrary user code**. Allowing free-form escape sequences would let a malicious hook clear the screen, hijack the cursor, paint fake prompts ("Approve permission? Y/n"), or do clipboard-paste attacks via OSC 52.
- Allowlisting only notification/title OSCs limits the surface to UI affordances the user expects hooks to emit. There's no legitimate hook use-case for moving the cursor or changing colors.

**Key insight:** This is **defense-in-depth** against compromised hooks, not just malformed ones. The hook process can be a third-party plugin downloaded from a marketplace. Allowlisting at the JSON parse boundary means the worst a malicious hook can do is spam notifications, not impersonate Claude Code's UI.

### Drop entire input on partial violation

**What it does:** If a hook returns `OSC 9 BEL OSC 4 BEL` (4 = palette change), nothing is emitted — not even the legal OSC 9.

**How it works:** The validator's loop returns `null` from `parseEscapeTokens` the instant it encounters a non-allowlisted OSC.

**Why this approach:**
- An attacker could craft a sequence like `OSC 9;Done\x07 OSC 8;;evil-link\x07 OSC 9;Failure\x07` (OSC 8 is hyperlink). Partial emit would let OSC 9s through while suppressing OSC 8 — but the user already saw the embedded hyperlink wired to the previous OSC 9 notification text.
- The safer behavior is "all or nothing": if any token is illegal, treat the entire emission as suspicious.

**Key insight:** This trades helpful-error-messages for security. A user whose legal OSC 9 silently disappears because they accidentally added `\x1b]8;;url\x07` will hit the debug log only — not a clear "your sequence had X invalid bytes." The trade-off is that hooks should ship clean output; the system is intolerant of mixing.

### Re-parse and re-serialize (not pass-through)

**What it does:** Even legal OSCs are re-emitted by `formatOSCBody` rather than passed through verbatim.

**How it works:**
1. `parseEscapeTokens` extracts `(ps, payload)` tuples.
2. `formatOSCBody(ps, payload)` reconstructs `<ps>;<payload>`.
3. `encodeOSC` adds the `ESC ]` prefix and `ST` (or BEL) terminator.

**Why this approach:**
- Normalizes terminator choice (BEL vs `ESC \`) — some terminals prefer one.
- Strips any trailing junk or interior nulls that survived hook output.
- Guarantees the emitted byte stream is **structurally** a valid OSC, regardless of how the hook spelled it.

**Key insight:** This is **canonicalization**. A hook that emits OSC 9 with a multi-byte UTF-8 payload, BEL terminator, and trailing newline ends up emitted as a clean OSC 9 with terminator. The terminal sees a well-formed sequence, not the hook's raw output.

## Diff vs v2.1.112

v2.1.112 had no `terminalSequence` field in the hook output schema. Hooks could only render side-effects by being a foreground process with terminal access — which became impossible in v2.1.139 when hooks moved to `detached: true`.

The v2.1.141 patch adds:
1. `terminalSequence: z.string().optional()` to the sync response schema.
2. Top-level docs string in the schema fallback error message (`cli_inner_pretty.js:520586`).
3. `validateTerminalSequence` (Lm6) — new function.
4. `emitTerminalSequence` (Pm6) — new function.
5. `terminalEmitterStack` (F2$) — new module-level stack.
6. `pushTerminalEmitter`/`popTerminalEmitter` (oM4/aM4) — stack manipulators.
7. `dispatchTerminalSequence` (ZW8) — non-stream caller helper.
8. Apply-result wiring in `applyHookJSONOutput` (TW8) and the aggregator's emit branch in `dispatchHookOutputStream` (aP).
9. `terminalAllowlist` (DZ5) — `new Set([0, 1, 2, 9, 99, 777])` constant.

## Related Reading

- v2.1.139 terminal isolation: see [terminal_isolation.md](./terminal_isolation.md) for why hooks can't write to the terminal directly.
- OSC code references: see `cli_inner_pretty.js:467390-467455` for the bytewise parser implementation.
