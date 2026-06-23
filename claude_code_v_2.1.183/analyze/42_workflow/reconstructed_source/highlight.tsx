/**
 * Input-box ultracode keyword highlight (violet shimmer), the per-prompt alt+w
 * dismiss/restore, and the `/config` "Ultracode keyword trigger" toggle row.
 *
 * This is a readable-source reconstruction of the v2.1.183 input-editor surface
 * that paints the `ultracode` keyword. When dynamic workflows are enabled
 * (`isWorkflowsEnabled`) AND the per-session keyword trigger is on
 * (`isUltracodeKeywordTriggerEnabled`), every occurrence of the `ultracode`
 * keyword in the prompt is highlighted with a FIXED violet shimmer and announced
 * via a toast that names the `alt+w` keybinding. `alt+w` dismisses (or restores)
 * the highlight for the current prompt only. A separate `/config` boolean row
 * persists the trigger setting into `userSettings.workflowKeywordTriggerEnabled`.
 *
 * IMPORTANT v2.1.156 → v2.1.183 contrast (see `buildKeywordHighlightSpans`):
 *   In v2.1.156 the workflow keyword used the *rainbow* shimmer — the same
 *   cycling palette as ultrathink / ultraplan, via `cyclingShimmerColor` (`Xq`,
 *   formerly `fI`): `color: Xq(i), shimmerColor: Xq(i, true)` advancing per char.
 *   In v2.1.183 the ultracode keyword uses a *single fixed* violet pair instead —
 *   `{ color: "autoAccept", shimmerColor: "autoAcceptShimmer", priority: 10 }` for
 *   every character (no cycling). ultrathink (`h_`) and ultraplan (`uy`) keep the
 *   rainbow `cyclingShimmerColor`; only the ultracode keyword switched to a flat
 *   color. See the side-by-side in `buildKeywordHighlightSpans` below.
 *
 * ── Evidence (v2.1.183 obfuscated bundle — the only source of truth) ──────────
 *   PRIMARY: /lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js
 *     ultracode keyword spans memo ........... cli_inner_pretty.js:622226  (ji = Pw()&&Jyn() ? yho(Tf) : [])
 *     ignored state + ref ..................... cli_inner_pretty.js:622227-622228  (WA/dy useState, Gv useRef)
 *     alt+w keybinding display text .......... cli_inner_pretty.js:622229  (Jn = Gu("chat:workflowKeywordToggle","Chat","alt+w"))
 *     highlight span builder (memo `gd`) ..... cli_inner_pretty.js:622279-622315
 *       ultrathink rainbow shimmer push ...... cli_inner_pretty.js:622290-622299  (FNe() over h_, cyclingShimmerColor Xq)
 *       ultraplan  rainbow shimmer push ...... cli_inner_pretty.js:622300-622309  (Tue() over uy, cyclingShimmerColor Xq)
 *       ultracode  FIXED violet push ......... cli_inner_pretty.js:622310-622313  (Pw()&&!WA over ji, autoAccept/autoAcceptShimmer)
 *     keyword toast (announce) ............... cli_inner_pretty.js:622349-622358  ("Dynamic workflow requested for this turn · {alt+w} to ignore")
 *     ignored-state auto-reset effect ........ cli_inner_pretty.js:622359-622361
 *     toggleKeywordIgnored callback (`el`) ... cli_inner_pretty.js:622362-622374
 *     keybinding registration ................ cli_inner_pretty.js:623117  (Mr("chat:workflowKeywordToggle", el, {isActive:!ne && ji.length>0}))
 *     theme color tokens ..................... cli_inner_pretty.js:154110-154111  (autoAccept rgb(135,0,255); autoAcceptShimmer rgb(208,180,255))
 *     /config trigger row (`onChange`) ....... cli_inner_pretty.js:479214-479225  (id "workflowKeywordTriggerEnabled")
 *     /config row gate (workflowsToggleable) . cli_inner_pretty.js:483325-483328  (Xyn() && writable settings)
 *     helpers re-verified:
 *       isWorkflowsEnabled                Pw   @148784
 *       isUltracodeKeywordTriggerEnabled  Jyn  @148797
 *       findUltracodeKeyword              yho  @464261  (= matchKeyword(text,"ultracode"))
 *       cyclingShimmerColor               Xq   @134367  (rainbow palettes L8u/D8u @134433-134450)
 *       resolveKeybindingDisplay          Gu   @190153
 *       registerKeybinding                Mr   @187342
 *       isInputDisabledByOverlay          Dwe  @187840
 *       getWorkflowDefaultOn              eNr  @148791
 *       isWorkflowsAvailableIgnoringUser  Xyn  @148794
 *
 * ── 2.1.88 convention mirror (named-TS shape; feature gated-out there) ─────────
 *   /lyz/codespace/3rd/claude-code/src/screens/REPL.tsx — Ink `useMemo` highlight-span
 *     arrays fed to the prompt renderer; `import { Box, Text, useTheme } from '../ink.js'`.
 *   /lyz/codespace/3rd/claude-code/src/hooks/useGlobalKeybindings.tsx,
 *     hooks/useCommandKeybindings.tsx — the keybinding register hook idiom.
 *   /lyz/codespace/3rd/claude-code/src/hooks/notifs/*.tsx — `addNotification`/`removeNotification`.
 *   /lyz/codespace/3rd/claude-code/src/components/ (config UI) — boolean toggle rows with
 *     `{ id, label, value, type:'boolean', onChange }`. The WORKFLOW_SCRIPTS feature is
 *     gated out in 2.1.88, so only the *shape* is borrowed, not an implementation.
 *
 * ── 2.1.156 scaffold (readable logic + names; re-verified against 183) ─────────
 *   /lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/42_workflow/
 *     gate_caps_lifecycle_relations.md §2.4 "Input highlight + dismiss/restore (alt+w)"
 *     + README §2.4. The dismiss/restore state machine (`__/C3` + `nK` ref + `D_` keybinding)
 *     is logic-identical; the spans memo and the shimmer push changed (keyword + flat color).
 *
 * ── Cross-validation note ─────────────────────────────────────────────────────
 *   Re-read every assigned 183 region against this bundle. Confirmed: the memo gate at
 *   :622226 is literally `Pw() && Jyn() ? yho(Tf) : []`; the ultracode push at :622310-622313
 *   is a per-char FIXED `{color:"autoAccept", shimmerColor:"autoAcceptShimmer", priority:10}`
 *   guarded by `Pw() && !WA` (NOT the rainbow `Xq` used by ultrathink/ultraplan two blocks
 *   above); the theme tokens at :154110-154111 are `autoAccept rgb(135,0,255)` /
 *   `autoAcceptShimmer rgb(208,180,255)`; the `el` callback at :622362 toggles the per-prompt
 *   `Gv` ref + `WA` state, emits `tengu_workflow_keyword_dismissed` / `_restored`, and the
 *   keybinding is registered at :623117 only when input is enabled and `ji.length > 0`. The
 *   `/config` row at :479214 writes `userSettings.workflowKeywordTriggerEnabled` (true→undefined
 *   i.e. "on/default", false→false) and logs telemetry `{ ultracodeKeywordTrigger: "on"|"off" }`,
 *   gated by `workflowsToggleable` (Xyn(), :483325). No invented behavior.
 *
 * Mapping (obf → readable), this file:
 *   ji→ultracodeKeywordSpans, WA→isKeywordIgnored, dy→setKeywordIgnored, Gv→ignoredRef,
 *   Jn→keywordToggleKeybinding, Tf→inputText, gd→highlightSpans, h_→ultrathinkSpans,
 *   uy→ultraplanSpans, el→toggleKeywordIgnored, ne→isInputDisabled, Q→isLocalJSXCommandActive,
 *   xa→addNotification, hd→removeNotification, G→logEvent, Pw→isWorkflowsEnabled,
 *   Jyn→isUltracodeKeywordTriggerEnabled, yho→findUltracodeKeyword, Xq→cyclingShimmerColor,
 *   FNe→isUltrathinkActive, Tue→isUltraplanAvailable, Gu→resolveKeybindingDisplay,
 *   Mr→registerKeybinding, Dwe→isInputDisabledByOverlay, eNr→getWorkflowDefaultOn,
 *   Xyn→isWorkflowsAvailableIgnoringUserSetting, co→updateSettings, I→setTelemetryConfig.
 */

import * as React from 'react'
import { useMemo, useState, useRef, useCallback, useEffect } from 'react'

import { isWorkflowsEnabled, isUltracodeKeywordTriggerEnabled } from './gate_and_effort.js' // Pw @148784, Jyn @148797
import { findUltracodeKeyword, type KeywordMatch } from './keyword.js' // yho @464261
import { cyclingShimmerColor } from '../ink/shimmer.js' // Xq @134367 (rainbow palettes L8u/D8u)
import { resolveKeybindingDisplay } from '../hooks/useGlobalKeybindings.js' // Gu @190153
import { registerKeybinding } from '../hooks/useGlobalKeybindings.js' // Mr @187342
import { useNotifications } from '../hooks/notifs/useNotifications.js' // Fi @… (addNotification/removeNotification)
import { logEvent } from '../telemetry.js' // G @3810
import { updateSettings } from '../settings.js' // co @… — persist a settings patch
import {
  getWorkflowDefaultOn, // eNr @148791
  isWorkflowsAvailableIgnoringUserSetting, // Xyn @148794
} from './gate_and_effort.js'

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────

/**
 * A single highlight directive for the prompt renderer: it paints a half-open
 * `[start, end)` slice of the input with an optional theme color, an optional
 * shimmer color (animated), and a stacking `priority` (higher wins on overlap).
 * Mirrors the inline object literals pushed into the `gd` memo in the bundle.
 */
export interface HighlightSpan {
  start: number
  end: number
  /** Theme color token (e.g. `"autoAccept"`, `"warning"`) or undefined to inherit. */
  color?: string
  /** Theme color token for the shimmer overlay; when set the slice animates. */
  shimmerColor?: string
  /** Other visual flags carried by sibling spans (image/dim/inverse). */
  inverse?: boolean
  dimColor?: boolean
  /** Stacking order; ultracode/ultrathink/ultraplan keyword shimmers use 10. */
  priority: number
}

// ──────────────────────────────────────────────────────────────────────────────
// Theme color tokens — the FIXED violet pair the ultracode keyword shimmer uses.
//
// These are token *names*; the renderer resolves them through the active theme.
// They are reused across the auto-accept-mode chrome, hence the names. The light
// theme resolves them to the violet RGB values shown; other themes remap them
// (e.g. ANSI magenta), but the keyword always references the *token*, never RGB.
//   autoAccept        → rgb(135,0,255)   (violet)            @154110
//   autoAcceptShimmer → rgb(208,180,255) (light violet)      @154111
// ──────────────────────────────────────────────────────────────────────────────

// 2.1.183: theme tokens = FZu.autoAccept / FZu.autoAcceptShimmer @154110-154111
const ULTRACODE_KEYWORD_COLOR = 'autoAccept'
const ULTRACODE_KEYWORD_SHIMMER_COLOR = 'autoAcceptShimmer'

// ──────────────────────────────────────────────────────────────────────────────
// Highlight span builder
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Build the per-character highlight spans for keyword shimmers. This reconstructs
 * the three consecutive blocks of the `gd` memo that handle the three "ultra-"
 * surfaces. They are intentionally shown together because the v2.1.156→v2.1.183
 * delta lives precisely in the contrast between them:
 *
 *   ┌── ultrathink (`isUltrathinkActive`) ── RAINBOW, per-char cycling ───────────┐
 *   │  for each char i of span:                                                   │
 *   │    color:        cyclingShimmerColor(i)          // Xq(i)        @622296    │
 *   │    shimmerColor: cyclingShimmerColor(i, true)    // Xq(i, true)  @622297    │
 *   │    priority: 10                                                  @622298    │
 *   ├── ultraplan (`isUltraplanAvailable`) ── RAINBOW, per-char cycling ──────────┤
 *   │    (identical body to ultrathink)                              @622300-622309│
 *   ├── ultracode keyword (this module) ── FIXED violet, NO cycling ─────────────┤
 *   │  for each char i of span:                                                   │
 *   │    color:        "autoAccept"          // FLAT, not Xq(i)        @622313    │
 *   │    shimmerColor: "autoAcceptShimmer"   // FLAT, not Xq(i, true)             │
 *   │    priority: 10                                                             │
 *   └─────────────────────────────────────────────────────────────────────────────┘
 *
 * The ultracode block is also gated differently: it pushes only when
 * `isWorkflowsEnabled() && !isKeywordIgnored` (`Pw() && !WA`), so an `alt+w`
 * dismiss removes the shimmer immediately without recomputing the spans memo.
 *
 * 2.1.183 regions: cli_inner_pretty.js:622290-622313 (within the `gd` memo)
 * 2.1.156 scaffold: gate_caps_lifecycle_relations.md §2.4 — the v2.1.156 build used
 *   `cyclingShimmerColor` for the workflow keyword too; 2.1.183 flattened it to the
 *   fixed violet pair (the only visual change to the keyword highlight this version).
 *
 * Mapping: spans→keywordSpans, char i offset uses (gr - an.start) in the bundle.
 */
// 2.1.183: ultracode keyword spans pushed in gd memo @622310-622313
export function buildUltracodeKeywordSpans(spans: KeywordMatch[]): HighlightSpan[] {
  const out: HighlightSpan[] = []
  for (const span of spans) {
    for (let i = span.start; i < span.end; i++) {
      // FIXED violet — NOT the cycling rainbow used by ultrathink/ultraplan. @622313
      out.push({
        start: i,
        end: i + 1,
        color: ULTRACODE_KEYWORD_COLOR, // "autoAccept"
        shimmerColor: ULTRACODE_KEYWORD_SHIMMER_COLOR, // "autoAcceptShimmer"
        priority: 10,
      })
    }
  }
  return out
}

/**
 * v2.1.156 contrast (NOT used in 183) — kept for documentation only so a reviewer
 * can see exactly what changed. The old workflow-keyword block cycled the rainbow
 * shimmer per character, identical to the ultrathink/ultraplan blocks. In 183 this
 * was replaced by `buildUltracodeKeywordSpans` (flat violet) above.
 *
 * 2.1.183 regions: rainbow form still lives at :622290-622299 (ultrathink) and
 *   :622300-622309 (ultraplan); the keyword no longer uses it.
 */
// 2.1.183: rainbow form (ultrathink/ultraplan) = cyclingShimmerColor Xq @622296-622297
export function buildRainbowKeywordSpans(spans: KeywordMatch[]): HighlightSpan[] {
  const out: HighlightSpan[] = []
  for (const span of spans) {
    for (let i = span.start; i < span.end; i++) {
      const offset = i - span.start
      out.push({
        start: i,
        end: i + 1,
        color: cyclingShimmerColor(offset), // Xq(offset)
        shimmerColor: cyclingShimmerColor(offset, true), // Xq(offset, true)
        priority: 10,
      })
    }
  }
  return out
}

// ──────────────────────────────────────────────────────────────────────────────
// Hook: ultracode keyword highlight + alt+w dismiss/restore
//
// Lives inside the prompt-editor component (`NLf` in the bundle). It owns:
//   • the memoized keyword spans,
//   • the per-prompt "ignored" flag + ref,
//   • the announce toast,
//   • the auto-reset when the keyword leaves the input,
//   • the alt+w toggle callback (registered by the caller).
// ──────────────────────────────────────────────────────────────────────────────

export interface UltracodeKeywordHighlight {
  /** Memoized matches of the `ultracode` keyword in the current input. */
  keywordSpans: KeywordMatch[]
  /** Whether the user dismissed the keyword for this prompt (`alt+w`). */
  isKeywordIgnored: boolean
  /** Highlight spans to merge into the prompt renderer (empty when ignored). */
  highlightSpans: HighlightSpan[]
  /** The alt+w toggle handler; register it with `registerKeybinding`. */
  toggleKeywordIgnored: () => void
  /** Display text of the configured toggle keybinding (for toasts/hints). */
  keywordToggleKeybinding: string
}

/**
 * Reconstruction of the ultracode-keyword slice of the prompt editor.
 *
 * 2.1.183 regions: cli_inner_pretty.js:622226-622374, registration @623117.
 * 2.1.156 scaffold: gate_caps_lifecycle_relations.md §2.4.
 *
 * Mapping: inputText→Tf, ultracodeKeywordSpans→ji, isKeywordIgnored→WA,
 *   setKeywordIgnored→dy, ignoredRef→Gv, keywordToggleKeybinding→Jn,
 *   toggleKeywordIgnored→el, addNotification→xa, removeNotification→hd, logEvent→G.
 */
export function useUltracodeKeywordHighlight(inputText: string): UltracodeKeywordHighlight {
  // ── Keyword spans memo ──────────────────────────────────────────────────────
  // Gated by BOTH the global enablement (`isWorkflowsEnabled`) and the per-session
  // keyword-trigger setting (`isUltracodeKeywordTriggerEnabled`). When either is
  // off, no spans are produced and every downstream effect is a no-op.
  // 2.1.183: ji = Pw() && Jyn() ? yho(Tf) : [] @622226
  const ultracodeKeywordSpans = useMemo<KeywordMatch[]>(
    () => (isWorkflowsEnabled() && isUltracodeKeywordTriggerEnabled() ? findUltracodeKeyword(inputText) : []),
    [inputText],
  )

  // ── Per-prompt "ignored" flag ───────────────────────────────────────────────
  // `isKeywordIgnored` drives the UI (toast text + whether the shimmer paints);
  // `ignoredRef` is the synchronous source of truth the toggle callback reads so
  // rapid alt+w presses flip deterministically without waiting for a re-render.
  // 2.1.183: [WA, dy] = useState(false), Gv = useRef(false) @622227-622228
  const [isKeywordIgnored, setKeywordIgnored] = useState(false)
  const ignoredRef = useRef(false)

  // ── alt+w keybinding display text ───────────────────────────────────────────
  // Resolves the user-configurable shortcut for `chat:workflowKeywordToggle`,
  // falling back to "alt+w". Shown verbatim in the toasts ("… {shortcut} to ignore").
  // 2.1.183: Jn = Gu("chat:workflowKeywordToggle","Chat","alt+w") @622229
  const keywordToggleKeybinding = resolveKeybindingDisplay('chat:workflowKeywordToggle', 'Chat', 'alt+w')

  const { addNotification, removeNotification } = useNotifications() // { addNotification: xa, removeNotification: hd } = Fi() @622316

  // ── Highlight spans ─────────────────────────────────────────────────────────
  // Only painted when workflows are enabled AND the user has not dismissed the
  // keyword for this prompt. The fixed-violet builder reflects the 183 change.
  // 2.1.183: if (Pw() && !WA) push autoAccept/autoAcceptShimmer per char @622310-622313
  const highlightSpans = useMemo<HighlightSpan[]>(() => {
    if (isWorkflowsEnabled() && !isKeywordIgnored) {
      return buildUltracodeKeywordSpans(ultracodeKeywordSpans)
    }
    return []
  }, [ultracodeKeywordSpans, isKeywordIgnored])

  // ── Announce toast ──────────────────────────────────────────────────────────
  // When the keyword is present, enabled, and not ignored, surface a 30s toast
  // that names the dismiss shortcut. Removed otherwise.
  // 2.1.183: effect @622349-622358
  useEffect(() => {
    if (isWorkflowsEnabled() && ultracodeKeywordSpans.length > 0 && !isKeywordIgnored) {
      addNotification({
        key: 'workflow-keyword-active',
        text: `Dynamic workflow requested for this turn${
          keywordToggleKeybinding ? ` · ${keywordToggleKeybinding} to ignore` : ''
        }`,
        priority: 'immediate',
        timeoutMs: 30000, // @622355
      })
    } else {
      removeNotification('workflow-keyword-active')
    }
  }, [addNotification, removeNotification, ultracodeKeywordSpans.length, isKeywordIgnored, keywordToggleKeybinding])

  // ── Auto-reset the ignored flag when the keyword disappears ──────────────────
  // If the user edits the keyword out of the prompt while it was dismissed, clear
  // the ignored state (and its ref + the "ignored" toast) so the next keyword the
  // user types starts fresh, un-dismissed.
  // 2.1.183: if (ji.length === 0 && WA) { dy(false); Gv.current = false; hd("workflow-keyword-ignored") } @622359-622361
  useEffect(() => {
    if (ultracodeKeywordSpans.length === 0 && isKeywordIgnored) {
      setKeywordIgnored(false)
      ignoredRef.current = false
      removeNotification('workflow-keyword-ignored')
    }
  }, [ultracodeKeywordSpans.length, isKeywordIgnored, removeNotification])

  // ── alt+w toggle: dismiss ⇄ restore ─────────────────────────────────────────
  // Reads/writes `ignoredRef` synchronously, mirrors it into React state, emits the
  // matching telemetry event, and shows/removes the "ignored" toast.
  //   dismiss  → tengu_workflow_keyword_dismissed + "Ultracode keyword ignored …"
  //   restore  → tengu_workflow_keyword_restored  + remove the toast
  // No-ops when there is no keyword to toggle.
  // 2.1.183: el = useCallback(...) @622362-622374
  const toggleKeywordIgnored = useCallback(() => {
    if (ultracodeKeywordSpans.length === 0) return // @622363 nothing to toggle
    const nextIgnored = !ignoredRef.current // @622364
    setKeywordIgnored(nextIgnored)
    ignoredRef.current = nextIgnored
    if (nextIgnored) {
      // @622366-622372 dismiss
      logEvent('tengu_workflow_keyword_dismissed', {})
      addNotification({
        key: 'workflow-keyword-ignored',
        text: `Ultracode keyword ignored for this prompt${
          keywordToggleKeybinding ? ` · ${keywordToggleKeybinding} to undo` : ''
        }`,
        priority: 'immediate',
        timeoutMs: 5000, // @622371
      })
    } else {
      // @622373 restore
      logEvent('tengu_workflow_keyword_restored', {})
      removeNotification('workflow-keyword-ignored')
    }
  }, [ultracodeKeywordSpans.length, keywordToggleKeybinding, addNotification, removeNotification])

  return {
    keywordSpans: ultracodeKeywordSpans,
    isKeywordIgnored,
    highlightSpans,
    toggleKeywordIgnored,
    keywordToggleKeybinding,
  }
}

/**
 * Caller-side keybinding registration (lives in the prompt-editor component body).
 * The `alt+w` toggle is only active when the input is editable (no blocking overlay
 * and no JSX command running) AND there is a keyword present to toggle.
 *
 * 2.1.183 region: cli_inner_pretty.js:623117
 *   Mr("chat:workflowKeywordToggle", el, { context: "Chat", isActive: !ne && ji.length > 0 })
 *   where `ne` (isInputDisabled) = isInputDisabledByOverlay() || isLocalJSXCommandActive (@621953).
 *
 * Mapping: registerKeybinding→Mr, toggleKeywordIgnored→el, isInputDisabled→ne.
 */
// 2.1.183: registration = Mr(...) @623117
export function useUltracodeKeywordKeybinding(
  toggleKeywordIgnored: () => void,
  keywordSpanCount: number,
  isInputDisabled: boolean,
): void {
  registerKeybinding('chat:workflowKeywordToggle', toggleKeywordIgnored, {
    context: 'Chat',
    isActive: !isInputDisabled && keywordSpanCount > 0, // @623117
  })
}

// ──────────────────────────────────────────────────────────────────────────────
// /config row — "Ultracode keyword trigger"
//
// A boolean toggle in the settings UI that persists into
// `userSettings.workflowKeywordTriggerEnabled`. Encoding (matches the gate's
// `?? true` default in `isUltracodeKeywordTriggerEnabled`):
//   • on  → store `undefined` (i.e. "unset" == default-on)
//   • off → store `false`
// The whole block (this row + the "Dynamic workflows" row above it) is only
// rendered when `workflowsToggleable` is true — i.e.
// `isWorkflowsAvailableIgnoringUserSetting()` (Xyn) AND the enable/disable settings
// are writable (not pinned by managed policy). See :483325-483328.
// ──────────────────────────────────────────────────────────────────────────────

/** A boolean settings row shape, mirroring the 2.1.88 config UI row idiom. */
export interface BooleanSettingRow {
  id: string
  label: string
  value: boolean
  type: 'boolean'
  onChange: (next: boolean) => void
}

/**
 * Build the "Ultracode keyword trigger" `/config` row.
 *
 * 2.1.183 region: cli_inner_pretty.js:479214-479225
 *   value:    n?.workflowKeywordTriggerEnabled ?? true                     @479217
 *   onChange: let U = M ? undefined : false                                @479220
 *             updateSettings("userSettings", { workflowKeywordTriggerEnabled: U })  @479221
 *             setSettingsData(F => ({ ...F, workflowKeywordTriggerEnabled: U }))    @479222
 *             setTelemetryConfig(F => ({ ...F, ultracodeKeywordTrigger: M ? "on" : "off" }))  @479223
 *
 * 2.1.88 convention: boolean toggle rows `{ id, label, value, type:'boolean', onChange }`
 *   throughout the gated-out config UI; `feature('WORKFLOW_SCRIPTS')` strips this externally.
 *
 * Mapping: settings→n, next→M, storedValue→U, updateSettings→co,
 *   setSettingsData→x, setTelemetryConfig→I.
 */
// 2.1.183: /config row workflowKeywordTriggerEnabled @479214
export function buildUltracodeKeywordTriggerRow(
  settings: { workflowKeywordTriggerEnabled?: boolean } | undefined,
  setSettingsData: (update: (prev: any) => any) => void, // x @479222
  setTelemetryConfig: (update: (prev: any) => any) => void, // I @479223
): BooleanSettingRow {
  return {
    id: 'workflowKeywordTriggerEnabled', // @479215
    label: 'Ultracode keyword trigger', // @479216
    value: settings?.workflowKeywordTriggerEnabled ?? true, // @479217 default ON
    type: 'boolean',
    onChange(next: boolean) {
      // on → undefined (default), off → false. Mirrors the gate's `?? true`. @479220
      const storedValue = next ? undefined : false
      updateSettings('userSettings', { workflowKeywordTriggerEnabled: storedValue }) // @479221
      setSettingsData((prev) => ({ ...prev, workflowKeywordTriggerEnabled: storedValue })) // @479222
      setTelemetryConfig((prev) => ({ ...prev, ultracodeKeywordTrigger: next ? 'on' : 'off' })) // @479223
    },
  }
}

/**
 * Gate for whether the workflow `/config` rows (Dynamic workflows + Ultracode
 * keyword trigger) are shown at all. Reconstruction of the `workflowsToggleable`
 * (`ze`) prop computed for the config screen.
 *
 * 2.1.183 region: cli_inner_pretty.js:483325-483328
 *   ze = Xyn()
 *        && (disableWorkflows.value !== true || disableWorkflows.source === "userSettings")
 *        && (enableWorkflows.source === "default" || enableWorkflows.source === "userSettings")
 *
 * Mapping: isWorkflowsAvailableIgnoringUserSetting→Xyn,
 *   disableWorkflowsSetting→Ce, enableWorkflowsSetting→$e.
 */
// 2.1.183: workflowsToggleable = ze @483325
export function isWorkflowConfigToggleable(
  disableWorkflowsSetting: { value: boolean; source: string },
  enableWorkflowsSetting: { source: string },
): boolean {
  return (
    isWorkflowsAvailableIgnoringUserSetting() && // Xyn() @483326
    (disableWorkflowsSetting.value !== true || disableWorkflowsSetting.source === 'userSettings') && // @483327
    (enableWorkflowsSetting.source === 'default' || enableWorkflowsSetting.source === 'userSettings') // @483328
  )
}

// `getWorkflowDefaultOn` (eNr @148791) is the default for the sibling "Dynamic
// workflows" row (:479205); re-exported here so the config screen can reference it
// without re-importing from the gate module. UNVERIFIED-as-used-here: this file
// does not itself render the "Dynamic workflows" row, but the gate that hides both
// rows is shared, so the symbol is surfaced for the config screen's convenience.
export { getWorkflowDefaultOn }
