# Goal Status Attachment Rendering (`db7` case `"goal_status"`)

## What it does

When the Stop-hook consumer ([goal_stop_hook_consumer.md](./goal_stop_hook_consumer.md)) yields a `goal_status` attachment, it lands in the transcript as a message-stream attachment. The transcript renderer `db7` (`cli_inner_pretty.js:346787`) dispatches by `attachment.type`, and `case "goal_status":` produces the inline UI block.

This produces three inline strings the user sees while a goal runs:

- `⏸ Goal not yet met... continuing` (with spinner glyph) — yielded after every Stop-hook block
- `✓ Goal achieved (1m 23s · 5 turns · 2.4k tokens)` — yielded on the turn the goal completes
- *(nothing)* — for sentinel registration/clear attachments (filtered out)

The overlay panel ([goal_overlay_panel.md](./goal_overlay_panel.md)) is a *separate* surface that reads `appState.activeGoal`. These transcript renders are independent — they show in the **scrolling conversation history**, not in the modal dialog.

---

## How it works

### 1. The renderer branch

```javascript
// ============================================
// attachmentRenderer goal_status branch
// Location: cli_inner_pretty.js:347071-347110
// ============================================

// ORIGINAL (for source lookup):
case "goal_status": {
  if (H.sentinel) return null;
  let A = [];
  if (H.met) {
    if (H.durationMs !== void 0) A.push(t7(H.durationMs, { mostSignificantOnly: !0 }));
    if (H.iterations !== void 0) A.push(`${H.iterations} ${S8(H.iterations, "turn")}`);
    if (H.tokens !== void 0) A.push(`${r9(H.tokens)} tokens`);
  }
  let z = A.length > 0 ? ` (${A.join(" \xB7 ")})` : "";
  return gq.default.createElement(
    p,
    { flexDirection: "column", marginTop: 1 },
    gq.default.createElement(
      k,
      null,
      gq.default.createElement(Rq, { status: H.met ? "success" : "pending", withSpace: !0 }),
      gq.default.createElement(k, { dimColor: !H.met }, H.met ? "Goal achieved" : "Goal not yet met… continuing"),
      z ? gq.default.createElement(k, { dimColor: !0 }, z) : null,
      !q ? gq.default.createElement(k, null, " ", gq.default.createElement(YX, null)) : null,
    ),
    q ? gq.default.createElement(p, { paddingLeft: 2 },
        gq.default.createElement(k, { dimColor: !0, wrap: "wrap" }, "Goal: ", H.condition)) : null,
    q && H.reason ? gq.default.createElement(p, { paddingLeft: 2 },
        gq.default.createElement(k, { dimColor: !0, wrap: "wrap" }, "Reason: ", H.reason)) : null,
  );
}

// READABLE (for understanding):
case "goal_status": {
  // 1. Sentinel attachments are markers for the resume path only — never rendered.
  //    These are produced by registerGoal/clearGoal (CaH/baH) and have sentinel: true.
  if (attachment.sentinel) return null;
  // 2. Build the "(1m · 5 turns · 2.4k tokens)" stats string — only on met=true.
  const statsParts = [];
  if (attachment.met) {
    if (attachment.durationMs !== undefined) statsParts.push(formatDuration(attachment.durationMs, { mostSignificantOnly: true }));
    if (attachment.iterations !== undefined) statsParts.push(`${attachment.iterations} ${pluralize(attachment.iterations, "turn")}`);
    if (attachment.tokens !== undefined) statsParts.push(`${formatThousands(attachment.tokens)} tokens`);
  }
  const statsSuffix = statsParts.length > 0 ? ` (${statsParts.join(" · ")})` : "";
  // 3. Render the line.
  return (
    <Column marginTop={1}>
      <Text>
        <StatusGlyph status={attachment.met ? "success" : "pending"} withSpace />
        <Text dimColor={!attachment.met}>
          {attachment.met ? "Goal achieved" : "Goal not yet met… continuing"}
        </Text>
        {statsSuffix ? <Text dimColor>{statsSuffix}</Text> : null}
        {/* In non-verbose mode, append an inline spinner indicating the model is still working */}
        {!verbose ? <Text> <Spinner /></Text> : null}
      </Text>
      {/* In verbose mode, render the goal condition as a separate indented line */}
      {verbose ? (
        <Row paddingLeft={2}>
          <Text dimColor wrap="wrap">Goal: {attachment.condition}</Text>
        </Row>
      ) : null}
      {/* In verbose mode, also render the subagent's reason for blocking */}
      {verbose && attachment.reason ? (
        <Row paddingLeft={2}>
          <Text dimColor wrap="wrap">Reason: {attachment.reason}</Text>
        </Row>
      ) : null}
    </Column>
  );
}

// Mapping:
//   db7   -> attachmentRenderer   (function name)
//   H     -> attachment           (the inner attachment object)
//   q     -> verbose              (from db7's destructured args)
//   Rq    -> StatusGlyph,         YX -> Spinner,
//   p     -> Column / Row,        k -> Text,
//   t7    -> formatDuration,      r9 -> formatThousands,
//   S8    -> pluralize
```

### 2. The output by message kind

The branch differentiates on `(sentinel, met, verbose)`:

| `sentinel` | `met` | `verbose` | Rendered output |
|------------|-------|-----------|-----------------|
| `true` | * | * | (nothing — early return null) |
| `false` | `false` | `false` | `⏸ Goal not yet met… continuing ⠋` (spinner) |
| `false` | `false` | `true` | `⏸ Goal not yet met… continuing`<br>`  Goal: <condition>`<br>`  Reason: <subagent's reason>` |
| `false` | `true` | `false` | `✓ Goal achieved (1m 23s · 5 turns · 2.4k tokens) ⠋` (spinner) |
| `false` | `true` | `true` | `✓ Goal achieved (1m 23s · 5 turns · 2.4k tokens)`<br>`  Goal: <condition>`<br>`  Reason: <subagent's final reason>` |

Notice the achievement line *also* has the inline spinner in non-verbose mode. That's because the model is in the middle of producing its final response when the achievement attachment is emitted — the spinner indicates the assistant turn is still ongoing.

### 3. The status glyph

`Rq` is `StatusGlyph` — it maps a status string to an Ink-colored character:

- `status: "success"` → `✓` in success-color (green)
- `status: "pending"` → `⏸` (or similar) in pending-color (yellow/amber)
- (other statuses exist for error/info elsewhere)

So the same component renders the green check on achievement and the yellow pause-glyph on blocking. The visual continuity emphasizes that both events come from the same Stop-hook subsystem.

### 4. The verbose flag

`q` (the destructured `verbose` arg of `db7`) is set by the host based on a toggle (typically `--verbose` / Ctrl+R). In non-verbose mode, the user sees one-line summaries; in verbose mode, each `goal_status` is expanded with the condition and reason. This is the same toggle that controls all attachment renderers in `db7`.

**Why the verbose split:** Goals can have long conditions (up to 4000 chars). Showing the condition on every progress line would dominate the screen in long-running goals. The verbose mode is opt-in for users who want to see the full context of every block.

### 5. The spinner suffix

The `<Spinner />` (`YX`) at the end of the non-verbose layout is the standard "model thinking" glyph. It's added to indicate "this isn't a static line — work is still happening." Without it, the user might think the conversation has paused. With it, the user sees a continuous "still working" indicator that's visually consistent with other model-busy states.

In verbose mode the spinner is omitted because the multi-line layout already conveys ongoing activity.

---

## Two surfaces, two paths

The user sees goal state in **three** places at once:

| Surface | Code | When it shows | Source of truth |
|---------|------|---------------|-----------------|
| Transcript "Goal not yet met... continuing" / "Goal achieved" lines | `db7 case "goal_status"` (this doc) | Inline in the conversation history, persistent | Transcript `goal_status` attachments |
| Overlay dialog (`/goal` bare) | `Xk4` (GoalOverlayPanel) | Modal, on user demand | `appState.activeGoal` + last achieved attachment |
| Status badge (`◎ /goal active`) | `Xx4` (GoalActiveBadge) | Always-on while goal is active | `appState.activeGoal?.setAt` |

The two-source design lets the overlay and badge update instantly (no transcript scan) while the transcript provides a persistent record that survives `/compact` and resumes.

---

## Why this approach

**Why is the goal_status renderer in the same `db7` function as every other attachment type, rather than its own module?** Because `db7` is the **single dispatch point** for inline transcript attachments — every attachment type (todo_reminder, hook_permission_decision, teammate_shutdown, etc.) gets a `case "..."`. Splitting goal out would create an exception to the dispatch pattern with no upside.

**Why does the renderer show the inline spinner in non-verbose mode?** Because the goal_status attachment is yielded **mid-turn** by the Stop-hook consumer, before the model's next response actually starts. Without the spinner, the user would see "Goal not yet met... continuing" with nothing under it for several seconds while the model thinks. The spinner reassures the user that work continues.

**Why doesn't this renderer render the sentinel attachments at all?** Because sentinels are pure transcript markers — they exist so `findGoalToRestore` (`Eg4`) can find the goal when resuming a session, not to communicate anything to the user. The actual user-facing acknowledgement comes from the system message emitted by `registerGoal`/`clearGoal` ("Goal set: X" / "Goal cleared: X").

**Why split stats between this renderer and the overlay panel?** Because they show *the same data at different lifecycle moments*:

- Transcript: stats at the moment of achievement, frozen forever in the message log.
- Overlay (active): live-updating stats while the goal runs.
- Overlay (achieved): stats from the most recent goal_status attachment (read from the transcript).

The overlay's achievement view (line 507676-507728 in `Xk4`) literally calls `oP4(messages)` to find the most recent non-sentinel met=true attachment. So both surfaces converge on the same attachment shape — the transcript is the source of truth, and the overlay is one of its readers.

---

## Key insight

The renderer is a **45-line case branch** that handles four output variants from three boolean inputs. There's no goal-specific machinery — no timer subscriptions, no state derivations, no callbacks. It reads the attachment, formats it as Ink elements, and returns. All the heavy lifting (when to emit the attachment, what stats to put in it) happens upstream in `Co7`. This separation means the renderer can be tested in isolation by handing it a synthetic attachment, and the consumer can be tested by checking what attachments it emits. The split is what makes both ends ergonomic to reason about despite the feature spanning multiple subsystems.

---

## Cross-references

- [goal_stop_hook_consumer.md](./goal_stop_hook_consumer.md) — `Co7` — the producer of these attachments (both `met=true` achievement and `met=false` progress)
- [goal_overlay_panel.md](./goal_overlay_panel.md) — `Xk4` — the modal renderer that *also* reads achievement attachments via `oP4`
- [goal_command.md](./goal_command.md) — `sP4` — the sentinel attachment producer (registration/clear markers, filtered out by `H.sentinel`)
- `db7` (the parent attachment renderer) — `21_terminal_renderer` or wherever the general attachment rendering is documented
