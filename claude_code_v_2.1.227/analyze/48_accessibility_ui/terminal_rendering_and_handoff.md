# Terminal rendering, clipboard ownership, and fullscreen history

The 2.1.227 terminal layer remains capability-driven. It does not assume that every TTY implements
the same escape sequences, nor that the model's compacted context and the user's visible scrollback
have the same retention policy. Terminal-mode transitions are owned by the renderer, clipboard
backends are selected by environment, and complex content has accessibility and narrow-width
fallbacks.

## Capability and mode ownership

### Synchronized-output capability decision

**What it does:** Decides whether frames can be wrapped in DEC synchronized-output markers to reduce
flicker without sending unsupported control sequences.

**How it works:**
1. `recordSynchronizedOutputProbe` (`wSd`, `cli_inner_pretty.js:269679-269681`) stores the asynchronous
   DECRQM capability probe result.
2. `getSynchronizedOutputSupport` (`TSd`) returns `undefined` inside tmux while the probe is pending,
   preserving a tri-state rather than prematurely reporting `false`.
3. `supportsSynchronizedOutput` (`bae`, `cli_inner_pretty.js:269686-269718`) first honors a daemon
   host capability; under tmux it requires an explicitly positive probe.
4. Outside tmux it accepts the force environment setting, a maintained terminal-program list,
   JetBrains, sufficiently recent Konsole/VTE, and known TERM/session markers such as kitty, foot,
   Alacritty, Zed, and Windows Terminal.
5. A positive probe is the last generic fallback; otherwise support is denied.
6. The renderer also refuses sync markers when stdout is not a TTY or its TTY handlers are inactive.

**Why this approach:**
- Synchronized output improves visual stability but an unsupported private mode can display garbage
  or stall updates.
- tmux must be probe-gated because support depends on its version and forwarding behavior, not merely
  on the outer terminal.
- Known-terminal heuristics provide immediate startup behavior while the explicit probe covers newer
  implementations.
- Maintaining a heuristic list costs complexity, but default-off would discard a major rendering
  improvement for common terminals.

**Key insight:** `undefined` is operationally meaningful: it tells a daemon or caller that discovery
is incomplete. Collapsing pending and unsupported into one boolean would recreate the earlier tmux
misclassification.

### Fullscreen and mouse-mode resolution

**What it does:** Chooses the renderer mode and the amount of mouse tracking using explicit safety
precedence.

**How it works:**
1. `resolveFullscreenReason` (`BQe`, `cli_inner_pretty.js:127423-127454`) forces fullscreen for
   background sessions, then automatically disables it for screen-reader mode.
2. Environment overrides, tmux control mode, Windows-over-SSH constraints, user settings, and rollout
   gates are evaluated in that order.
3. `mapFullscreenReasonToMode` (`C0u`) converts the diagnostic reason into `fullscreen` or `default`.
4. `resolveMouseTrackingMode` (`Yde`, `cli_inner_pretty.js:127462-127466`) maps
   `CLAUDE_CODE_DISABLE_MOUSE` to `off/full` and the lower-precedence
   `CLAUDE_CODE_DISABLE_MOUSE_CLICKS` to `scroll/full`.
5. With neither override, full click, drag, hover, and scroll tracking is enabled.

**Why this approach:**
- Returning a reason instead of only a boolean makes diagnostics and telemetry explain why a mode was
  selected.
- Screen-reader default mode avoids alternate-screen semantics that conflict with assistive review,
  while background sessions need deterministic fullscreen ownership.
- The mouse tri-state lets users retain wheel scrolling while suppressing click/hover escape traffic.
- Strict precedence is less flexible than merging booleans, but it makes conflicting configuration
  predictable.

**Key insight:** Renderer and mouse choices are policy decisions with provenance. The code preserves
the reason so automatic accessibility and environment fallbacks are distinguishable from explicit
user settings.

### External-program terminal handoff

**What it does:** Temporarily releases terminal input and tracking modes before launching an external
editor or program, then restores exactly the modes Claude Code owns.

**How it works:**
1. `TerminalRenderer.prepareTerminalForHandoff` (`AAr`,
   `cli_inner_pretty.js:274434-274438`) pauses render scheduling.
2. It disables mouse tracking when active and disables focus/event reporting through the handoff
   reset sequence.
3. It suspends stdin only after writing those resets, so the child does not inherit a terminal that
   still emits Claude-specific mouse/focus bytes.
4. `restoreTerminalAfterHandoff` resumes stdin, reinstates the configured mouse and focus modes, and
   then resumes rendering.
5. Alternate-screen enter/exit follows a larger symmetric sequence that also owns bracketed paste,
   cursor visibility, background color, and frame reset.

**Why this approach:**
- Pausing reads alone is insufficient: enabled mouse/focus modes cause the terminal itself to write
  escape sequences into the child process.
- Central renderer methods keep mode ownership symmetric and prevent each external-tool caller from
  reconstructing fragile escape sequences.
- Reset-before-suspend and restore-before-resume minimize races at the process boundary.
- The trade-off is dependence on the renderer even for nonvisual handoffs, but the renderer is the
  component that knows which modes are active.

**Key insight:** A clean handoff transfers terminal ownership, not just stdin ownership. Every mode
Claude enabled must be disabled before the child starts and restored afterward.

## Clipboard paths

### Backend selection and OSC-52 framing

**What it does:** Copies text through native platform tools, terminal multiplexers, and OSC-52 while
accounting for SSH and multiplexer framing.

**How it works:**
1. `setClipboardText` (`gk`, `cli_inner_pretty.js:189530-189551`) base64-encodes UTF-8 text.
2. Outside SSH it also invokes the native platform writer; under tmux it attempts `load-buffer -w`
   and retries without `-w` for compatibility.
3. It predicts the active multiplexer and selects raw OSC-52, tmux DCS wrapping, or GNU screen DCS
   wrapping.
4. GNU screen payloads are split into 76-character base64 chunks (`Y5u`) and each chunk is separately
   DCS-framed, respecting screen's control-string constraints.
5. `writeNativeClipboard` (`iWu`, `cli_inner_pretty.js:189553-189587`) selects `pbcopy`, Wayland,
   X11, native addon, or PowerShell based on platform and probe state.
6. Native probes are asynchronous; a successful late probe retries the requested copy rather than
   silently losing it.

**Why this approach:**
- OSC-52 works across remote terminals, while native tools give better local desktop integration;
  emitting both where safe maximizes success.
- Multiplexers require different escaping and size handling, so one raw sequence is not portable.
- A 76-character chunk is conservative overhead for GNU screen.
- Multiple backends increase maintenance, but clipboard behavior is otherwise dependent on one
  environment-specific tool being present.

**Key insight:** Clipboard copy is a delivery fan-out with transport-specific framing, not a single
escape sequence.

### Wayland generation-serialized selection writes

**What it does:** Writes both the standard clipboard and primary selection without allowing an older
copy operation to overwrite a newer selection.

**How it works:**
1. `ClipboardBackendState` (`Z5u`, `cli_inner_pretty.js:189439-189480`) maintains a monotonically
   increasing `waylandCopyGeneration`.
2. `writeWaylandClipboardSelections` (`BZy`, `cli_inner_pretty.js:189588-189593`) reserves a
   generation for the requested text.
3. It awaits `wl-copy` for the standard clipboard first.
4. After that process completes, it compares its generation with the latest generation.
5. If another copy started meanwhile, the stale operation returns without touching primary
   selection.
6. Only the latest operation starts `wl-copy --primary` with the same text.

**Why this approach:**
- `wl-copy` processes can own selections, so launching standard and primary writes concurrently can
  race in both process lifetime and selection ownership.
- Serial order guarantees the two selections agree for the latest request.
- A generation token cancels only the stale second phase without requiring process abortion or a
  global mutex.
- A newer request can leave the previous primary selection briefly unchanged until its own first
  phase completes, which is preferable to an old operation overwriting new content.

**Key insight:** Awaiting two commands is not enough; the generation check between them is what makes
the two-phase copy linearizable with respect to newer user selections. The 2.1.220 implementation
started both `wl-copy` processes without this ordering.

### Copy-on-select event gating

**What it does:** Emits at most one clipboard write for a completed nonempty terminal selection.

**How it works:**
1. `useCopyOnSelect` (`Qwi`, `cli_inner_pretty.js:762717-762746`) subscribes to selection state only
   when terminal selection is enabled.
2. Dragging or a cleared selection resets its “already copied” ref.
3. An unchanged active selection is ignored after the first write.
4. The user `copyOnSelect` setting is checked before extracting text.
5. Empty or whitespace-only content is marked handled but not written.
6. A valid selection is stored for native-copy hints, emits telemetry, and calls the current writer.

**Why this approach:**
- Terminal selection emits many state notifications while dragging; edge-triggering prevents a
  clipboard process per mouse movement.
- Deferring until dragging ends avoids copying partial text.
- Treating empty selection as handled prevents repeated futile writes.
- The hook relies on the writer's generation logic for cross-event Wayland ordering, keeping UI and
  backend responsibilities separate.

**Key insight:** The 2.1.224 reliability fix spans two layers: the hook suppresses duplicate selection
events, and the Wayland backend orders the two selection owners for each accepted event.

## Fullscreen compaction history

### Separate model-context and UI-scrollback compaction

**What it does:** Prunes compacted model context while preserving the complete visible fullscreen
history across repeated compactions.

**How it works:**
1. When `handleInteractiveMessage` (`jB`, `cli_inner_pretty.js:916257-916274`) receives a compact
   boundary, it resolves the boundary's preserved-message UUIDs against the current UI list.
2. It stores preserved messages with their anchor and builds a UUID set for de-duplication.
3. In fullscreen, it dispatches `remove-uuids-and-append`: retain every existing UI message except
   preserved duplicates, then append the compact boundary.
4. In default mode, it replaces the visible list with the boundary because ordinary terminal
   scrollback already owns prior output.
5. When the anchor arrives, the held preserved tail is appended; if no anchor arrives, a settlement
   path later appends it and records telemetry.
6. Independently, `createConversationRecorder` (`IFh`, `cli_inner_pretty.js:936021-936085`) flushes
   persistence before the boundary and prunes the in-memory conversation/model message arrays to the
   compact boundary.
7. Subsequent model requests therefore see compacted context even though fullscreen users can still
   scroll through older rendered messages.

**Why this approach:**
- Model context and UI history have different constraints: token limits require pruning one, while
  user orientation benefits from retaining the other.
- Removing preserved UUIDs before re-appending avoids duplicate messages around the boundary.
- Default mode can rely on the terminal emulator's scrollback; fullscreen alternate-screen mode must
  own its own history.
- Full retention costs client memory, but only in the mode where the application is responsible for
  scrollback.

**Key insight:** The 2.1.224 fix replaces the baseline fullscreen reducer action
`trim-to-last-boundary-excluding-and-append` (`2.1.220:763322`, call at `822593`) with a de-duplication
action (`cli_inner_pretty.js:853671-853672`). Repeated compactions no longer redefine the previous
boundary as the beginning of visible history.

## Content rendering

### Hyperlink override and heuristic policy

**What it does:** Chooses whether OSC-8 hyperlinks are safe, with an explicit optimistic path for
surfaces that know they are interactive.

**How it works:**
1. The library detector (`OUs`, `cli_inner_pretty.js:276022-276066`) honors `FORCE_HYPERLINK`, command
   flags, TTY/color status, CI exclusions, and versioned terminal heuristics.
2. `resolveHyperlinkOverride` (`kvt`, `cli_inner_pretty.js:276069-276074`) gives daemon-host
   capabilities precedence and treats explicit force configuration as authoritative.
3. `supportsTerminalHyperlinks` (`dL`, `cli_inner_pretty.js:276076-276099`) applies application-level
   heuristics for known terminal programs, JetBrains, Windows Terminal, recent tmux, LC_TERMINAL, and
   kitty.
4. `TerminalLink` (`ui`, `cli_inner_pretty.js:276101-276124`) normally uses the full detector.
5. With `assumeSupport`, it uses an explicit override when present and otherwise defaults to true;
   callers use this only where a clickable link is preferable and the output context is known.
6. Unsupported paths render the provided fallback or plain label without OSC-8 sequences.

**Why this approach:**
- Host/force overrides must beat heuristics because they carry direct environment knowledge.
- Conservative general detection avoids control sequences in logs and incapable terminals.
- `assumeSupport` lets interactive error/login surfaces remain useful when heuristics lag a new
  terminal.
- The split creates two policies to understand, but makes optimism explicit at the call site.

**Key insight:** Capability inference and caller intent are separate. `assumeSupport` does not bypass
an explicit negative override; it only changes the unknown default.

### Adaptive markdown-table layout

**What it does:** Renders readable tables within terminal width, switches to vertical cards when
wrapping becomes excessive, and emits sentence-like rows for screen readers.

**How it works:**
1. `renderMarkdownTable` (`VVf`, `cli_inner_pretty.js:721556-721708`) caps data at 200 rows and caches
   rendered cell content for the invocation.
2. In screen-reader mode, `renderTableForScreenReader` (`k4a`,
   `cli_inner_pretty.js:721456-721474`) emits each row as `Header: value.` sentences and appends a
   truncation notice.
3. For visual output, compute each column's minimum width from its longest word and preferred width
   from its complete cells, both with a three-column minimum.
4. Subtract borders and margins from terminal width. If preferred widths fit, use them unchanged.
5. If minimum widths fit, distribute remaining space in proportion to each column's preferred-minus-
   minimum capacity.
6. If even minimum widths do not fit, shrink proportionally and enable hard wrapping.
7. Measure wrapped header and row heights. If any exceeds four lines, switch to vertical cards.
8. Build the box table, measure every final line, and fall back to cards if actual display width still
   exceeds the terminal.

**Why this approach:**
- Minimum-word widths preserve readability, while proportional slack favors columns that can use it.
- The second measurement catches ANSI and Unicode display-width effects that estimates may miss.
- A vertical fallback is more usable than extremely tall wrapped cells or broken borders.
- Per-invocation caching and a 200-row cap bound expensive Markdown and wrapping work, trading full
  display for an explicit truncation message.

**Key insight:** Table layout is a staged optimization with a correctness fallback. It first seeks the
best horizontal allocation, then validates the result using actual terminal widths rather than
trusting character counts.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `supportsSynchronizedOutput` (`bae`) - combines host capability, probe, and terminal heuristics.
- `resolveFullscreenReason` (`BQe`) - selects fullscreen/default mode with diagnostic provenance.
- `resolveMouseTrackingMode` (`Yde`) - resolves full, scroll-only, or disabled mouse tracking.
- `setClipboardText` (`gk`) - fans clipboard text out to native, multiplexer, and OSC-52 paths.
- `writeWaylandClipboardSelections` (`BZy`) - generation-orders clipboard and primary selection.
- `useCopyOnSelect` (`Qwi`) - edge-triggers selection copying.
- `handleInteractiveMessage` (`jB`) - applies compaction boundaries to UI history.
- `createConversationRecorder` (`IFh`) - separately applies boundaries to persisted/model context.
- `supportsTerminalHyperlinks` (`dL`) - evaluates hyperlink heuristics.
- `renderMarkdownTable` (`VVf`) - performs cached, adaptive table layout.
