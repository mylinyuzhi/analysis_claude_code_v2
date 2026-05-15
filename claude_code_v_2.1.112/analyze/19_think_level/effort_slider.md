# `/effort` Interactive Slider (v2.1.111)

## What changed

In v2.1.88, `/effort` was a typed-argument command: `/effort high` would
set the level; `/effort` (no args) printed a usage message. The user had
to know all five level names and type one correctly.

In v2.1.111, when `/effort` is invoked **without arguments**, an
**interactive slider** opens. The user navigates with ←/→ between
5 positions (`low`/`medium`/`high`/`xhigh`/`max`), each rendered with a
distinctive style (warning yellow, success green, permission purple,
shimmer for xhigh, rainbow-animated for max). Enter confirms; Esc/Ctrl+C
cancels.

The typed-argument paths (`/effort high`, `/effort current`,
`/effort auto`) all still work — the slider is an additional entry
point, not a replacement.

## Source: v2.1.88 baseline

`src/commands/effort/index.ts`:

```typescript
import type { Command } from '../../commands.js'
import { shouldInferenceConfigCommandBeImmediate } from '../../utils/immediateCommand.js'

export default {
  type: 'local-jsx',
  name: 'effort',
  description: 'Set effort level for model usage',
  argumentHint: '[low|medium|high|max|auto]',
  get immediate() {
    return shouldInferenceConfigCommandBeImmediate()
  },
  load: () => import('./effort.js'),
} satisfies Command
```

`src/commands/effort/effort.tsx` (excerpt):

```typescript
export async function call(
  onDone: LocalJSXCommandOnDone,
  _context: unknown,
  args?: string,
): Promise<React.ReactNode> {
  args = args?.trim() || ''

  if (COMMON_HELP_ARGS.includes(args)) {
    onDone('Usage: /effort [low|medium|high|max|auto]\n\n…')
    return
  }

  if (!args || args === 'current' || args === 'status') {
    return <ShowCurrentEffort onDone={onDone} />     // ← no slider; just prints current
  }

  const result = executeEffort(args)
  return <ApplyEffortAndClose result={result} onDone={onDone} />
}
```

The `argumentHint` listed 5 options (`low|medium|high|max|auto`) — note
`auto` was already present but not `xhigh`. The "no args" path showed
the *current* effort level. No slider.

## Source: v2.1.112 obfuscated chunks

### Command definition

```javascript
// ============================================
// effortCommandDef - /effort slash command descriptor
// Location: chunks.189.mjs:1430-1444
// ============================================

// ORIGINAL (for source lookup):
YtK = {
    type: "local-jsx",
    name: "effort",
    description: "Set effort level for model usage",
    argumentHint: "[low|medium|high|xhigh|max|auto]",
    get immediate() {
        return Pu6()
    },
    load: () => Promise.resolve().then(() => (ztK(), _tK))
}

// READABLE (for understanding):
const effortCommandDef = {
  type: "local-jsx",
  name: "effort",
  description: "Set effort level for model usage",
  // argumentHint now includes `xhigh` (was `[low|medium|high|max|auto]` in v2.1.88).
  argumentHint: "[low|medium|high|xhigh|max|auto]",
  get immediate() {
    return shouldInferenceConfigCommandBeImmediate();
  },
  load: () => Promise.resolve().then(() => (initEffortModule(), effortModuleExports))
};

// Mapping: YtK→effortCommandDef, Pu6→shouldInferenceConfigCommandBeImmediate,
//          ztK→initEffortModule, _tK→effortModuleExports
```

### Entry handler (the dispatch logic)

```javascript
// ============================================
// effortCommandEntrypoint - /effort async handler
// Location: chunks.189.mjs:1359-1383
// ============================================

// ORIGINAL (for source lookup):
async function poY(q, K, _) {
    if (_ = _?.trim() || "", VoY.includes(_)) {
        q(`Usage: /effort [low|medium|high|xhigh|max|auto]

Effort levels:
- low: Quick, straightforward implementation
- medium: Balanced approach with standard testing
- high: Comprehensive implementation with extensive testing
- xhigh: Extended reasoning with thorough analysis (Opus 4.7 only)
- max: Maximum capability with deepest reasoning (Opus 4.6/4.7 only)
- auto: Use the default effort level for your model`);
        return
    }
    if (_ === "current" || _ === "status") return B4.createElement(EoY, {
        onDone: q
    });
    if (!_) return B4.createElement(IoY, {
        onDone: q
    });
    let z = sj7(_);
    return B4.createElement(LoY, {
        result: z,
        onDone: q
    })
}

// READABLE (for understanding):
async function effortCommandEntrypoint(onDone, _context, args) {
  args = args?.trim() || "";

  // help/-h/--help → print usage and exit
  if (EFFORT_HELP_ARGS.includes(args)) {
    onDone(`Usage: /effort [low|medium|high|xhigh|max|auto]

Effort levels:
- low: Quick, straightforward implementation
- medium: Balanced approach with standard testing
- high: Comprehensive implementation with extensive testing
- xhigh: Extended reasoning with thorough analysis (Opus 4.7 only)
- max: Maximum capability with deepest reasoning (Opus 4.6/4.7 only)
- auto: Use the default effort level for your model`);
    return;
  }

  // `current`/`status` → render the read-only component
  if (args === "current" || args === "status") {
    return React.createElement(ShowCurrentEffortFC, { onDone });
  }

  // No arg → OPEN THE INTERACTIVE SLIDER  ← new in v2.1.111
  if (!args) {
    return React.createElement(EffortSliderComponent, { onDone });
  }

  // Typed level → dispatch + close
  const result = executeEffortArg(args);
  return React.createElement(ApplyEffortAndCloseFC, { result, onDone });
}

// Mapping: poY→effortCommandEntrypoint, VoY→EFFORT_HELP_ARGS,
//          B4→React, EoY→ShowCurrentEffortFC, IoY→EffortSliderComponent,
//          sj7→executeEffortArg, LoY→ApplyEffortAndCloseFC
```

### The slider component

```javascript
// ============================================
// EffortSliderComponent - 5-position interactive slider with ←/→/Enter
// Location: chunks.189.mjs:1193-1341
// ============================================

// ORIGINAL (for source lookup):
function IoY(q) {
    let K = s(48), { onDone: _ } = q,
        z = M8(BoY),               // appState.effortValue
        Y = R7(),                  // setAppState
        A;
    q: {
        if (!z) { A = esK; break q }    // default to esK=3 (xhigh) when no AppState
        let $6;
        if (K[0] !== z) $6 = J66.findIndex((q6) => q6.value === z), K[0] = z, K[1] = $6;
        else $6 = K[1];
        A = $6 === -1 ? esK : $6   // fallback to esK on unknown saved value
    }
    let O = A, [w, $] = B4.useState(O), j;
    if (K[2] !== w || K[3] !== _ || K[4] !== Y)
        j = ($6, H6) => {
            if (H6.leftArrow) $(moY);              // prevEffortIndex
            else if (H6.rightArrow) $(uoY);        // nextEffortIndex
            else if (H6.return) {
                let q6 = J66[w], o = sj7(q6.value);
                if (o.effortUpdate)
                    Y((_6) => ({ ..._6, effortValue: o.effortUpdate.value }));
                _(o.message)
            } else if (H6.escape || H6.ctrl && ($6 === "c" || $6 === "d"))
                _("Cancelled")
        }, K[2] = w, K[3] = _, K[4] = Y, K[5] = j;
    else j = K[5];
    XR(j);
    // …rendering of slider track, ▲ cursor, level labels…
    return /* slider JSX with `Speed […track…] Intelligence` header
              and `←/→ to change effort · Enter to confirm` footer */;
}

// READABLE (for understanding):
function EffortSliderComponent({ onDone }) {
  // Cache: read effortValue out of AppState. Use the React-compiler manual cache.
  const appStateEffort = useAppState(s => s.effortValue);
  const setAppState = useSetAppState();

  // Initial slider position: index of current effort in SLIDER_LEVELS, else
  // DEFAULT_SLIDER_INDEX (3, the xhigh position). The default position is
  // intentional — the slider is centered on `xhigh` for Opus 4.7 launch UX.
  const initialIndex = useMemo(() => {
    if (!appStateEffort) return DEFAULT_SLIDER_INDEX;
    const found = SLIDER_LEVELS.findIndex(l => l.value === appStateEffort);
    return found === -1 ? DEFAULT_SLIDER_INDEX : found;
  }, [appStateEffort]);

  const [sliderIndex, setSliderIndex] = React.useState(initialIndex);

  // Key handler: ←/→ to move, Enter to commit, Esc/Ctrl+C/Ctrl+D to cancel.
  const onKeypress = React.useCallback((char, key) => {
    if (key.leftArrow) {
      setSliderIndex(prevEffortIndex);     // clamps at 0 (low)
    } else if (key.rightArrow) {
      setSliderIndex(nextEffortIndex);     // clamps at 4 (max)
    } else if (key.return) {
      const chosen = SLIDER_LEVELS[sliderIndex];
      const result = executeEffortArg(chosen.value);
      if (result.effortUpdate) {
        setAppState(prev => ({ ...prev, effortValue: result.effortUpdate.value }));
      }
      onDone(result.message);
    } else if (key.escape || (key.ctrl && (char === "c" || char === "d"))) {
      onDone("Cancelled");
    }
  }, [sliderIndex, onDone, setAppState]);

  useStdinKeypress(onKeypress);

  // Rendering: header "Speed [track] Intelligence"; cursor ▲ at offset
  // SLIDER_TICK_POSITIONS[sliderIndex]; 5 level labels; footer "←/→ to
  // change effort · Enter to confirm".
  return /* … see render section … */;
}

// Mapping: IoY→EffortSliderComponent, M8→useAppState, R7→useSetAppState,
//          BoY→selector for effortValue, J66→SLIDER_LEVELS,
//          esK→DEFAULT_SLIDER_INDEX, moY→prevEffortIndex,
//          uoY→nextEffortIndex, sj7→executeEffortArg, XR→useStdinKeypress
```

### Slider constants

```javascript
// ============================================
// SLIDER_LEVELS - the 5 visible slider positions with color styling
// Location: chunks.189.mjs:1412-1427
// ============================================

J66 = [
    { value: "low",    color: "warning" },             // yellow
    { value: "medium", color: "success" },             // green
    { value: "high",   color: "permission" },          // purple
    { value: "xhigh",  color: "autoAccept-shimmer" },  // animated shimmer #d0b4ff
    { value: "max",    color: "rainbow-animated" }     // cycling rainbow
];

hoY = [1, 10, 20, 30, 40];  // SLIDER_TICK_POSITIONS — x-offset of ▲ cursor
RoY = [5, 5, 5, 6];         // SLIDER_LABEL_SPACERS — pad widths between labels

esK = 3;                    // DEFAULT_SLIDER_INDEX (the xhigh position)
qtK = 42;                   // SLIDER_TRACK_WIDTH (track ── characters wide)
SoY = "#d0b4ff";            // SHIMMER_HIGHLIGHT_COLOR (for xhigh shimmer)

VoY = ["help", "-h", "--help"];   // EFFORT_HELP_ARGS
```

### Helper functions

```javascript
// ============================================
// nextEffortIndex / prevEffortIndex - clamped slider navigation
// Location: chunks.189.mjs:1347-1353
// ============================================

// ORIGINAL (for source lookup):
function uoY(q) {
    return Math.min(J66.length - 1, q + 1)
}
function moY(q) {
    return Math.max(0, q - 1)
}

// READABLE (for understanding):
function nextEffortIndex(current) {
  // Right-arrow: advance by 1, but cap at the last position.
  return Math.min(SLIDER_LEVELS.length - 1, current + 1);
}

function prevEffortIndex(current) {
  // Left-arrow: retreat by 1, but cap at 0.
  return Math.max(0, current - 1);
}

// Mapping: uoY→nextEffortIndex, moY→prevEffortIndex, J66→SLIDER_LEVELS
```

### Dispatch (typed-arg path still works)

```javascript
// ============================================
// executeEffortArg - dispatches "auto"/"unset"/"<level>"/<invalid>
// Location: chunks.189.mjs:1061-1068
// ============================================

// ORIGINAL (for source lookup):
function sj7(q) {
    let K = q.toLowerCase();
    if (K === "auto" || K === "unset") return NoY();
    if (!Nh8(K)) return {
        message: `Invalid argument: ${q}. Valid options are: low, medium, high, xhigh, max, auto`
    };
    return koY(K)
}

// READABLE (for understanding):
function executeEffortArg(rawArg) {
  const arg = rawArg.toLowerCase();
  if (arg === "auto" || arg === "unset") return clearEffortLevel();
  if (!isValidEffortLevel(arg)) {
    return {
      message: `Invalid argument: ${rawArg}. Valid options are: low, medium, high, xhigh, max, auto`
    };
  }
  return setEffortValueFromSlider(arg);
}

// Mapping: sj7→executeEffortArg, NoY→clearEffortLevel,
//          Nh8→isValidEffortLevel, koY→setEffortValueFromSlider
```

## Why this approach

### Why a slider for `/effort` (and not for `/model`)?

**What:** The slider opens automatically on `/effort` with no args. The
analogous `/model` with no args still produces a *picker* (multi-line
list), not a slider.

**Why:**
- **Effort is scalar**: it has a clear "more or less" gradient. A slider
  naturally maps to the cost/quality trade-off ("←speed     intelligence→").
- **Models are categorical**: Opus and Sonnet aren't on a continuum;
  switching is a discrete choice with implications (cache invalidation,
  pricing, capability differences).
- **Effort has 5 values**: small enough to fit on a single line; a list
  would waste vertical space.
- **Friction reduction**: typing `xhigh` correctly is hard
  (`x-high`? `xHigh`?). Arrow keys avoid the typo problem.

### Why default the slider position to `xhigh` (index 3)?

**What:** When AppState has no saved effort value, the slider starts at
position 3 (`xhigh`), not 0 (`low`) or 2 (`high`).

**Why:**
- The slider is presented to first-time users in the context of Opus 4.7
  launch; centering on `xhigh` showcases the new tier.
- For non-Opus-4.7 users, position 3 still maps to "deeper thinking"
  visually — even though the actual effort resolves to `high` (silent
  downgrade), the user sees they're at the "intelligence" end of the
  spectrum.
- If AppState **does** have a saved effort, the slider opens **at that
  position**, so subsequent uses are stable.

**Trade-off:** Defaulting to position 3 means a first-time slider user
who just hits Enter (without moving) confirms `xhigh`. On non-supported
models this silently downgrades to `high` — same as not setting effort
at all. The "no-op for non-Opus-4.7" outcome is a positive trade-off:
the user has signaled intent without committing to a costly setting.

### Why three terminating events: Enter / Esc / Ctrl+C+D?

**What:** The handler explicitly intercepts:
- `key.return` (Enter) → commit selection
- `key.leftArrow` / `key.rightArrow` → move
- `key.escape` → cancel
- `key.ctrl && (char === "c" || char === "d")` → cancel

**Why three cancel paths:**
- **Esc** is the cultural standard for "exit this modal." This is what
  most users will reach for.
- **Ctrl+C** is the standard "interrupt" — useful when Esc is mapped to
  something else (vi mode, IDE wrappers).
- **Ctrl+D** is the EOF signal — included because some terminal emulators
  produce Ctrl+D instead of Esc on certain key bindings.

The triple-fallback ensures *any reasonable cancel gesture* works
without retraining the user.

### Why latch `unpinOpus47LaunchEffort` on slider Enter?

**What:** When the user confirms the slider (any value, even `xhigh`),
the dispatch path calls `setEffortValueFromSlider` which sets the
`unpinOpus47LaunchEffort` flag in app config.

**Why even on `xhigh` re-selection?**

This is the key insight from the latch design: by *interacting with the
slider at all*, the user has demonstrated awareness of the effort knob.
The launch nudge has served its purpose. Whether they pick `xhigh`,
`high`, or `max` is irrelevant — they've expressed intent, and the
auto-default should now step aside.

The alternative — only latching when the user changes *away* from
`xhigh` — would create a confusing UX: "I confirmed xhigh and now
nothing changed" feels broken, even if it's technically a no-op.

### The slider rendering math

**What it does:** Builds an ASCII slider track with a ▲ cursor under
the selected level label.

**How it works:**
1. The track is `SLIDER_TRACK_WIDTH` (= 42) characters wide.
2. Per level, the cursor position is `SLIDER_TICK_POSITIONS[index]`
   characters from the left:
   - low = 1, medium = 10, high = 20, xhigh = 30, max = 40.
3. The slider renders as two lines:
   - **Track**: dimmed `─` characters before the cursor; ▲ at cursor
     position; dimmed `─` after.
   - **Labels**: 5 level names with `SLIDER_LABEL_SPACERS` widths between.
4. Header: `Speed [some spaces] Intelligence`.
5. Footer: `←/→ to change effort · Enter to confirm`.

**Why the explicit pad table?** Different labels have different widths
(`low`=3, `medium`=6, `high`=4, `xhigh`=5, `max`=3) and they need
visual alignment. A fixed-width font and the right pad-array produces
even spacing without a font-metrics calculation.

**Why hardcoded positions?** A general layout algorithm would be
overkill for 5 known levels. Hardcoding is simpler, more readable, and
trivially adjustable when a tier is added.

## Cross-validation: v2.1.88 → v2.1.112

| Aspect | v2.1.88 | v2.1.112 | Δ |
|--------|---------|----------|---|
| `argumentHint` | `[low\|medium\|high\|max\|auto]` | `[low\|medium\|high\|xhigh\|max\|auto]` | Added `xhigh` |
| No-args path | Prints current effort level | Opens interactive slider | New behavior |
| Help text | 5 levels listed | 6 levels listed (incl. `xhigh`) | Updated |
| `current` / `status` args | Renders `<ShowCurrentEffort>` | Renders `<ShowCurrentEffortFC>` | Same behavior, refactored |
| Typed-arg path | Calls `executeEffort` | Calls `executeEffortArg` (`sj7`) | Refactored |
| Dispatch on confirm | (no slider, only `executeEffort`) | `sj7` then `setAppState` then `onDone(message)` | New |
| `unpinOpus47LaunchEffort` side-effect | (none) | Latched on any commit | New |
| `--effort` CLI flag | (none) | `chunks.222.mjs:42-46` validator accepts `xhigh` | New |

## Related symbols

> Symbol mappings:
> - [symbol_index.md](../00_overview/symbol_index.md) - scoped diff index
> - [symbol_additions_unit_16.md](../00_overview/symbol_additions_unit_16.md) - new symbols from this unit

Key functions in this document:
- `effortCommandDef` (YtK) — `/effort` command descriptor; chunks.189.mjs:1430-1444
- `effortCommandEntrypoint` (poY) — dispatch handler; chunks.189.mjs:1359-1383
- `EffortSliderComponent` (IoY) — the slider React component; chunks.189.mjs:1193-1341
- `executeEffortArg` (sj7) — typed-arg dispatch; chunks.189.mjs:1061-1068
- `setEffortValueFromSlider` (koY) — persists effort + latches unpin; chunks.189.mjs:980-1019
- `clearEffortLevel` (NoY) — handles `/effort auto`/`unset`; chunks.189.mjs:1033-1059
- `ShowCurrentEffortFC` (EoY) — `/effort current`/`status` read-only; chunks.189.mjs:1070-1077
- `ApplyEffortAndCloseFC` (LoY) — typed-arg commit + close; chunks.189.mjs:1083-1104
- `EffortLevelLabel` (zz8) — renders a single slider level; chunks.189.mjs:1106-1143
- `nextEffortIndex` (uoY), `prevEffortIndex` (moY) — clamped navigation
- `SLIDER_LEVELS` (J66) — 5-position config; chunks.189.mjs:1412-1427
- `DEFAULT_SLIDER_INDEX` (esK) — = 3 (xhigh); chunks.189.mjs:1391
- `SLIDER_TRACK_WIDTH` (qtK) — = 42 chars; chunks.189.mjs:1393
- `SLIDER_TICK_POSITIONS` (hoY) — `[1, 10, 20, 30, 40]`; chunks.189.mjs:1427
- `SHIMMER_HIGHLIGHT_COLOR` (SoY) — `#d0b4ff` for xhigh; chunks.189.mjs:1399
