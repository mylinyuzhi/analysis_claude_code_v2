# Plugin `monitors` Manifest (v2.1.105)

## What it does

Plugins gained a new top-level manifest key, `monitors`, declaring **persistent background watch scripts** that the host arms automatically. Each monitor entry has a `name`, `command`, `description`, and `when` clause; the host runs the command as a long-lived background process and pipes each stdout line into the agent's conversation as a `<task_notification>` event. Two arm-triggers are supported:

- `when: "always"` (default) - arm at session start and on plugin reload. The script begins running the moment the agent starts up.
- `when: "on-skill-invoke:<skill-name>"` - arm the first time that skill is dispatched (via Skill tool or slash command) in the session. Useful for monitors that only matter once a workflow has begun.

This is positioned in the same trust tier as plugin hooks (unsandboxed, runs in the session cwd, sees the user's environment) - the safety story is that a plugin manifest is itself a trust boundary (the user opted into installing the plugin), and the schema description spells this out explicitly: "Background watch scripts the host arms as persistent Monitor tasks (unsandboxed, same trust tier as hooks) so plugins need not instruct the model to arm them."

Workspace trust still applies: if the user has not accepted workspace trust for the current cwd, monitors are skipped with a debug log message.

---

## How it works

### 1. The manifest schema (chunks.18.mjs:2241-2251)

```javascript
// ============================================
// pluginMonitorSchema - Per-monitor zod schema
// Location: chunks.18.mjs:2241-2248
// ============================================

// ORIGINAL (for source lookup):
wi5 = C6(() => y.strictObject({
    name: y.string().min(1).describe("Identifier for this monitor, unique within the plugin. Used to dedupe so re-arming (plugin reload, repeat skill invoke) does not spawn duplicates."),
    command: y.string().min(1).describe('Shell command to run as a persistent background monitor. Each stdout line is delivered to the model as a <task_notification> event; the process runs for the session lifetime. ${CLAUDE_PLUGIN_ROOT}, ${CLAUDE_PLUGIN_DATA}, ${user_config.*}, and ${ENV_VAR} are substituted. Runs in the session cwd — prefix with `cd "${CLAUDE_PLUGIN_ROOT}" && ` if the script needs its own directory.'),
    description: y.string().min(1).describe("Short human-readable description of what is being monitored (shown in task panel and notification summary)."),
    when: y.union([
        y.literal("always"),
        y.string().startsWith("on-skill-invoke:").refine((q) => q.length > 16, { message: "on-skill-invoke: must specify a skill name" })
    ]).default("always").describe('Arm trigger. "always" arms at session start and on plugin reload. "on-skill-invoke:<skill>" arms the first time that skill is dispatched (via Skill tool or slash command).')
}))

// READABLE (for understanding):
const pluginMonitorSchema = lazySchema(() => zod.strictObject({
  name: zod.string().min(1).describe(/* unique within plugin */),
  command: zod.string().min(1).describe(/* shell, persistent, ${...} substituted */),
  description: zod.string().min(1).describe(/* human-readable */),
  when: zod.union([
    zod.literal("always"),
    zod.string().startsWith("on-skill-invoke:").refine(
      s => s.length > 16,  // must have at least 1 char after the prefix
      { message: "on-skill-invoke: must specify a skill name" }
    )
  ]).default("always")
}));

// Mapping: wi5 -> pluginMonitorSchema, C6 -> lazySchema, y -> zod
```

**Why `strictObject` (not `object`)?** Strict mode rejects unknown keys at parse time. If a plugin author adds `monitor.timeout: 5000` thinking it's a supported field, the schema fails loudly instead of silently dropping the value. Plugin manifests are rarely tested by their author against the production schema, so a strict parser surfaces typos.

**Why `.length > 16` instead of `.length > 17`?** The literal `"on-skill-invoke:"` is 16 chars. The check `> 16` means the string must have at least one character after the prefix. Equivalent to "skill name is non-empty" but expressed in terms of total length.

### 2. The array uniqueness constraint (chunks.18.mjs:2248)

```javascript
// ============================================
// pluginMonitorsArraySchema - Wraps array with unique-name refinement
// Location: chunks.18.mjs:2248
// ============================================

// ORIGINAL (for source lookup):
XO1 = C6(() => y.array(wi5()).refine(
  (q) => new Set(q.map((K) => K.name)).size === q.length,
  { message: "Monitor names must be unique within a plugin" }
))

// READABLE (for understanding):
const pluginMonitorsArraySchema = lazySchema(() =>
  zod.array(pluginMonitorSchema()).refine(
    monitors => new Set(monitors.map(m => m.name)).size === monitors.length,
    { message: "Monitor names must be unique within a plugin" }
  )
);
```

The uniqueness check happens **after** all entries parse - if entry 2 has the same `name` as entry 0, the whole array is rejected with a single uniform error. This matters because the runtime dedupe key is `${pluginName}:${monitorName}` (see step 5 below); a duplicate name would race for the dedupe slot and the second monitor would never arm.

### 3. The manifest-level wrapper (chunks.18.mjs:2250-2251)

```javascript
// ============================================
// pluginMonitorsManifestKey - Top-level "monitors" key on plugin manifest
// Location: chunks.18.mjs:2250-2251
// ============================================

// ORIGINAL (for source lookup):
$i5 = C6(() => y.object({
    monitors: y.union([
        gA6().describe("Path to a JSON file containing the monitors array, relative to the plugin root"),
        XO1()
    ]).describe("Background watch scripts the host arms as persistent Monitor tasks (unsandboxed, same trust tier as hooks) so plugins need not instruct the model to arm them. When omitted, monitors/monitors.json at the plugin root is loaded if present.")
}))

// READABLE (for understanding):
const pluginMonitorsManifestSchema = lazySchema(() => zod.object({
  monitors: zod.union([
    relativePathSchema().describe("Path to a JSON file containing the monitors array"),
    pluginMonitorsArraySchema(),
  ])
}));

// Mapping: $i5 -> pluginMonitorsManifestSchema, gA6 -> relativePathSchema, XO1 -> pluginMonitorsArraySchema
```

The schema is a discriminated union: the `monitors` field can be either an inline array (small monitors live in the manifest itself) or a path to a separate JSON file (large monitor lists or monitors that need their own version control). When omitted entirely, the loader falls back to `monitors/monitors.json` at the plugin root, mirroring the convention used by `hooks/hooks.json`.

### 4. The load pipeline (chunks.88.mjs:1799-1838)

```javascript
// ============================================
// loadPluginMonitorsFromManifest - Resolve manifest spec to monitor array
// Location: chunks.88.mjs:1799-1838
// ============================================

// ORIGINAL (for source lookup):
async function K_z(q, K, _, z) {
    let Y;
    if (K.monitors === void 0) {
        let A = uz(q, "monitors", "monitors.json");
        if (await a3(A)) Y = A
    } else if (typeof K.monitors === "string") {
        let A = T68(q, K.monitors);
        if (A === null) {
            z.push({ type: "path-traversal", source: _, plugin: K.name, path: K.monitors, component: "monitors" });
            return
        }
        Y = A
    } else return K.monitors;
    if (Y === void 0) return;
    try {
        let A = await oS8(Y, { encoding: "utf-8" });
        return XO1().parse(n8(A))
    } catch (A) {
        let O = b6(A);
        E(`Failed to load monitors for ${K.name} from ${Y}: ${O}`, { level: "error" });
        z.push({ type: "component-load-failed", source: _, plugin: K.name, component: "monitors", path: Y, reason: O });
        return
    }
}

// READABLE (for understanding):
async function loadPluginMonitorsFromManifest(pluginRoot, manifest, source, errors) {
  let monitorsFilePath;

  // Three paths to resolve where the monitor array lives:
  if (manifest.monitors === undefined) {
    // 1. Convention fallback: <plugin>/monitors/monitors.json
    const conventionPath = joinPath(pluginRoot, "monitors", "monitors.json");
    if (await fileExists(conventionPath)) {
      monitorsFilePath = conventionPath;
    }
  } else if (typeof manifest.monitors === "string") {
    // 2. Manifest declares a relative file path - resolve and validate
    const resolved = resolveRelativeToPluginRoot(pluginRoot, manifest.monitors);
    if (resolved === null) {
      // Path-traversal attack (e.g., monitors: "../../etc/passwd") - record + bail
      errors.push({ type: "path-traversal", source, plugin: manifest.name, path: manifest.monitors, component: "monitors" });
      return;
    }
    monitorsFilePath = resolved;
  } else {
    // 3. Manifest has inline array - return as-is (already parsed)
    return manifest.monitors;
  }

  if (monitorsFilePath === undefined) return;  // no monitors declared, no file found

  try {
    const fileContent = await readFile(monitorsFilePath, { encoding: "utf-8" });
    return pluginMonitorsArraySchema().parse(parseJsonStripComments(fileContent));
  } catch (err) {
    const reason = errorToString(err);
    log(`Failed to load monitors for ${manifest.name} from ${monitorsFilePath}: ${reason}`, { level: "error" });
    errors.push({
      type: "component-load-failed",
      source, plugin: manifest.name,
      component: "monitors", path: monitorsFilePath, reason
    });
  }
}

// Mapping: K_z -> loadPluginMonitorsFromManifest, T68 -> resolveRelativeToPluginRoot,
//          a3 -> fileExists, uz -> joinPath, oS8 -> readFile, n8 -> parseJsonStripComments,
//          E -> log, b6 -> errorToString, XO1 -> pluginMonitorsArraySchema
```

**Why three resolution paths?** The convention-first fallback (path 1) means a plugin author can just drop a `monitors/monitors.json` and have it picked up - matching how `hooks/hooks.json` and `commands/` work. The explicit-path case (path 2) supports authors who want to use a different filename or location. The inline-array case (path 3) supports tiny monitor lists that don't deserve their own file.

**`T68` returns null on path traversal** - the helper rejects any path that contains `..` after normalization. This prevents a plugin manifest from declaring `monitors: "../../../etc/passwd"` and tricking the loader into reading sensitive files.

### 5. The arm pipeline (chunks.205.mjs:2878-2894)

```javascript
// ============================================
// armPluginMonitors - Iterate enabled plugins and spawn the right monitors
// Location: chunks.205.mjs:2878-2894
// ============================================

// ORIGINAL (for source lookup):
async function IP7(q, K, _, z = dzA, Y = FzA) {
    if (!KF()) return;
    if (I7()) return;
    for (let A of UzA(q)) {
        if (!K(A)) continue;
        let O = `${A.pluginName}:${A.name}`;
        if (Y.has(O)) continue;
        Y.add(O);
        try {
            if (await z(A, _) === void 0) Y.delete(O)
        } catch (w) {
            Y.delete(O), E(`plugin monitor ${O}: failed to arm: ${w}`, { level: "error" })
        }
    }
}

// READABLE (for understanding):
async function armPluginMonitors(
  enabledPlugins,
  whenPredicate,           // (monitor) -> boolean. e.g., m => m.when === "always"
  context,
  spawnFn = runPluginMonitor,        // defaults to the real spawner, swappable for tests
  armedSet = ARMED_MONITORS_SET       // module-level Set tracking already-armed monitors
) {
  if (!isPluginMonitorsFeatureEnabled()) return;
  if (isWorkspaceTrustRejected()) return;

  for (const resolvedMonitor of resolveAllPluginMonitors(enabledPlugins)) {
    if (!whenPredicate(resolvedMonitor)) continue;

    // Dedupe key: plugin-name:monitor-name. Mark as armed BEFORE spawn so a
    // concurrent caller can't double-arm.
    const dedupeKey = `${resolvedMonitor.pluginName}:${resolvedMonitor.name}`;
    if (armedSet.has(dedupeKey)) continue;
    armedSet.add(dedupeKey);

    try {
      const taskId = await spawnFn(resolvedMonitor, context);
      if (taskId === undefined) {
        // spawn signalled "skip" (e.g., bridge mode or untrusted workspace) -
        // unwind dedupe entry so a retry can re-arm
        armedSet.delete(dedupeKey);
      }
    } catch (err) {
      armedSet.delete(dedupeKey);
      log(`plugin monitor ${dedupeKey}: failed to arm: ${err}`, { level: "error" });
    }
  }
}

// Mapping: IP7 -> armPluginMonitors, UzA -> resolveAllPluginMonitors,
//          dzA -> runPluginMonitor, FzA -> ARMED_MONITORS_SET,
//          KF -> isPluginMonitorsFeatureEnabled, I7 -> isWorkspaceTrustRejected
```

**Why dedupe by `pluginName:monitorName` instead of by manifest object identity?** Because the arm pipeline is called from two trigger points:

1. `useEffect` mount in `usePluginMonitorsLifecycle` (chunks.205.mjs:2911-2928) - fires at session start with all `when: "always"` monitors.
2. Skill-invocation subscriber (also in `usePluginMonitorsLifecycle`) - fires every time any skill dispatches, looking for matching `on-skill-invoke:<skill>` entries.

Both trigger points iterate over the same plugin list, so without the dedupe set, a session with five skill invocations would re-arm `when: "always"` monitors five times. The dedupe key is `${pluginName}:${name}` because monitor names are only unique **within** a plugin (the schema refinement enforces this), so two different plugins could both have a monitor named "watch-tests" without collision.

**Why `await z(A, _) === void 0` unwinds the dedupe entry?** Because the spawner has its own skip conditions (bridge mode, untrusted workspace) that return `undefined` without throwing. If the spawner skipped, the monitor wasn't actually armed, so the dedupe entry must be removed to allow a future retry. Throws also unwind, but go through the `catch` branch.

### 6. The runtime spawner (chunks.205.mjs:2852-2876)

```javascript
// ============================================
// runPluginMonitor - Spawn one resolved monitor as a long-lived bash task
// Location: chunks.205.mjs:2852-2876
// ============================================

// ORIGINAL (for source lookup):
async function dzA(q, K) {
    if (Kt()) return;
    if (Z66()) {
        E(`Skipping plugin monitor ${q.pluginName}:${q.name} - workspace trust not accepted`);
        return
    }
    let _ = {},
        z = QzA(q, _),
        Y = Id8(z.onBatch),
        A = await al(q.command, K.abortController.signal, "bash", {
            preventCwdChanges: !0,
            shouldUseSandbox: !1,
            onStdout: Y.onData
        });
    return _.id = A.taskOutput.taskId, await Y_6({
        command: q.command,
        description: q.description,
        shellCommand: A,
        toolUseId: void 0,
        agentId: void 0,
        kind: "monitor"
    }, K), A.result.then(() => { Y.flush(!0), z.onExit() }), _.id
}

// READABLE (for understanding):
async function runPluginMonitor(resolvedMonitor, context) {
  if (isInBridgeMode()) return;
  if (isWorkspaceTrustNotAccepted()) {
    log(`Skipping plugin monitor ${resolvedMonitor.pluginName}:${resolvedMonitor.name} - workspace trust not accepted`);
    return;
  }

  // taskRef is mutated once we get a taskId, then closed over by the rate-limiter
  // (which needs the id to call addRowOutput on the right task in the panel)
  const taskRef = {};
  const rateLimiter = createMonitorRateLimiter(resolvedMonitor, taskRef);
  const lineBatcher = createLineBatcher(rateLimiter.onBatch);

  const bashTask = await runBash(
    resolvedMonitor.command,
    context.abortController.signal,
    "bash",
    {
      preventCwdChanges: true,       // can't `cd` away from session cwd
      shouldUseSandbox: false,        // monitor scripts run unsandboxed (trust tier)
      onStdout: lineBatcher.onData,
    }
  );
  taskRef.id = bashTask.taskOutput.taskId;

  // Register with the background task panel so the user sees the monitor
  await registerBackgroundTask({
    command: resolvedMonitor.command,
    description: resolvedMonitor.description,
    shellCommand: bashTask,
    toolUseId: undefined,
    agentId: undefined,
    kind: "monitor",                 // distinguishes monitor tasks from agent tool calls
  }, context);

  // When the process exits (or is killed), flush the partial line buffer and
  // emit the suppressed-events notice if any
  bashTask.result.then(() => {
    lineBatcher.flush(true);
    rateLimiter.onExit();
  });

  return taskRef.id;
}

// Mapping: dzA -> runPluginMonitor, Kt -> isInBridgeMode, Z66 -> isWorkspaceTrustNotAccepted,
//          al -> runBash, Y_6 -> registerBackgroundTask, Id8 -> createLineBatcher,
//          QzA -> createMonitorRateLimiter
```

**Why `shouldUseSandbox: false`?** Sandboxing imposes restrictions that prevent monitors from doing their job (file-system watches, process inspection, network polling). The schema description spells out "unsandboxed, same trust tier as hooks" - this is intentional and is one of the reasons workspace trust is a hard precondition.

**Why `preventCwdChanges: true`?** Without this, a monitor could `cd` and the parent shell would see the cwd change on next invocation. The flag is a defense against accidental session-state pollution; a monitor that needs a different cwd must use `cd "$CLAUDE_PLUGIN_ROOT" && ./watcher.sh` inside the command itself (the schema description explicitly suggests this pattern).

### 7. The rate-limiter wrapper (chunks.205.mjs:2832-2850)

```javascript
// ============================================
// createMonitorRateLimiter - Suppresses bursts of stdout lines
// Location: chunks.205.mjs:2832-2850
// ============================================

// ORIGINAL (for source lookup):
function QzA(q, K, _ = IM6, z = xd8(bd8, K38)) {
    let Y = 0;
    function A() {
        if (Y === 0) return;
        _(q.description, `[plugin monitor "${q.name}" suppressed ${Y} events — output rate exceeded]`, K.id), Y = 0
    }
    return {
        onBatch: (O) => {
            if (!z.tryConsume()) { Y++; return }
            A(), _(q.description, O, K.id)
        },
        onExit: A
    }
}

// READABLE (for understanding):
function createMonitorRateLimiter(
  resolvedMonitor,
  taskRef,
  emit = addRowOutputToTask,           // injectable for tests
  tokenBucket = createTokenBucket(MONITOR_TOKEN_REFILL, MONITOR_TOKEN_BUCKET_SIZE)
) {
  let suppressedCount = 0;

  function flushSuppressedNotice() {
    if (suppressedCount === 0) return;
    emit(
      resolvedMonitor.description,
      `[plugin monitor "${resolvedMonitor.name}" suppressed ${suppressedCount} events — output rate exceeded]`,
      taskRef.id
    );
    suppressedCount = 0;
  }

  return {
    onBatch: (output) => {
      if (!tokenBucket.tryConsume()) {
        suppressedCount++;
        return;
      }
      // Flush any pending suppression notice before emitting the new line, so
      // the user sees "[suppressed 47 events]" then the next real line, not
      // "real line ... [suppressed 47 events]"
      flushSuppressedNotice();
      emit(resolvedMonitor.description, output, taskRef.id);
    },
    onExit: flushSuppressedNotice,
  };
}

// Mapping: QzA -> createMonitorRateLimiter, IM6 -> addRowOutputToTask,
//          xd8 -> createTokenBucket, bd8 -> MONITOR_TOKEN_REFILL, K38 -> MONITOR_TOKEN_BUCKET_SIZE
```

**Why a token bucket?** A monitor that emits 1,000 lines/sec would otherwise flood the conversation with `<task_notification>` events, ballooning context and triggering compaction. The token bucket bounds the emission rate while still letting bursts through (the bucket has a fixed size and refills at a fixed rate). Suppressed lines get a single aggregated "[suppressed N events]" notice on next emission, so the user knows about the burst without seeing all of it.

### 8. The lifecycle hook (chunks.205.mjs:2911-2928)

```javascript
// ============================================
// usePluginMonitorsLifecycle - React effect that arms monitors at session start
// Location: chunks.205.mjs:2911-2928
// ============================================

// ORIGINAL (for source lookup):
function kz5({ enabled: q }) {
    let K = H9(), _ = R7(), z = EX(), Y = M8((A) => A.plugins.enabled);
    Vz5.useEffect(() => {
        if (!q) return;
        let A = () => ({ abortController: new AbortController, taskRegistry: z });
        return IP7(Y, (O) => O.when === "always", A()), sn1.subscribe((O) => {
            IP7(K.getState().plugins.enabled, (w) => w.when === `on-skill-invoke:${O}`, A())
        })
    }, [q, Y, K, _, z])
}

// READABLE (for understanding):
function usePluginMonitorsLifecycle({ enabled }) {
  const appStore = getAppStore();
  const _r7Ref = getR7();   // intentionally unused — kept in deps for cache invalidation
  const taskRegistry = getTaskRegistry();
  const enabledPlugins = useAppStateSelector(state => state.plugins.enabled);

  useEffect(() => {
    if (!enabled) return;

    // Build a fresh context per arm cycle (each monitor gets its own AbortController
    // so it can be killed independently)
    const buildContext = () => ({
      abortController: new AbortController(),
      taskRegistry,
    });

    // 1. Arm all "always" monitors at mount
    armPluginMonitors(
      enabledPlugins,
      monitor => monitor.when === "always",
      buildContext()
    );

    // 2. Subscribe to skill-invocation events; arm matching "on-skill-invoke:" monitors.
    //    Returning the subscription's unsubscribe function from useEffect cleans up on unmount.
    return skillInvocationEventBus.subscribe(skillName => {
      armPluginMonitors(
        appStore.getState().plugins.enabled,
        monitor => monitor.when === `on-skill-invoke:${skillName}`,
        buildContext()
      );
    });
  }, [enabled, enabledPlugins, appStore, _r7Ref, taskRegistry]);
}

// Mapping: kz5 -> usePluginMonitorsLifecycle, H9 -> getAppStore, R7 -> getR7,
//          EX -> getTaskRegistry, M8 -> useAppStateSelector, sn1 -> skillInvocationEventBus,
//          IP7 -> armPluginMonitors, Vz5 -> ReactModule (with useEffect)
```

**Why a subscriber instead of a direct call?** The `on-skill-invoke:<name>` arm trigger fires from inside the Skill tool's `call()` method, but `usePluginMonitorsLifecycle` is a UI-layer hook. They can't be directly wired - the event bus (`sn1`) bridges them. Every successful skill invocation publishes the skill name to the bus, and the hook's effect subscribes once at mount, dispatches as needed, and unsubscribes on unmount.

**Why does the inner callback re-read `appStore.getState().plugins.enabled` instead of closing over `enabledPlugins`?** Because `enabled` plugins can change mid-session (plugin install, plugin enable/disable). The outer `useEffect` only re-runs when one of its deps changes; inside the long-lived subscription, fresh state must be re-read at dispatch time so that newly-installed plugin monitors get armed.

---

## Why this approach?

### Alternative 1: instruct the model to arm monitors

Instead of the host auto-arming, the plugin author could add to their skill prompts: "First, run this background script: `BashOutput run-tests --watch`". Why not?

- **Reliability** - the model might skip the bootstrap step, especially after compaction or when summarizing earlier turns. Critical infrastructure shouldn't depend on the model remembering to bootstrap it.
- **Token cost** - bootstrap instructions live in every plugin's skill prompts, costing turns. The host-arm path is zero-tokens because the user-visible side effect (a task in the panel) is rendered by the runtime, not the model.
- **Trust boundary** - arming a monitor is functionally equivalent to running unsandboxed code at session start. Pushing this through the agent loop runs the script via BashTool, which would prompt for permission. The host-arm path skips that prompt (because plugin install was the trust boundary).

The schema description's "so plugins need not instruct the model to arm them" is a direct callout of this design choice.

### Alternative 2: rebrand the existing `hooks` system

Plugin manifests already have a `hooks` key. Why a new top-level `monitors` key instead of a new hook event like `SessionStart`?

- **Lifecycle mismatch** - hooks are synchronous, event-driven, and short-lived (they run, return, the agent loop continues). Monitors are asynchronous, persistent, and emit events back into the conversation over time.
- **Backpressure** - monitors need rate-limiting (the token bucket above). The hook framework has no such facility and shouldn't grow one.
- **Display** - monitors render as long-lived tasks in the task panel (`kind: "monitor"`). Hooks don't render at all. A unified key would conflate two very different display semantics.

Keeping `monitors` separate keeps each subsystem's mental model clean.

### Alternative 3: one process per arm trigger, no dedupe

Skip the dedupe set and just spawn a fresh process every time a `when: "always"` monitor matches. Why not?

- **Resource cost** - re-arm fires on every skill invocation, every plugin reload, every session-start. Without dedupe, a chatty session could spawn the same monitor 50+ times, each holding a file descriptor and a process slot.
- **State conflict** - a monitor tailing a log file would now have N tail processes, each duplicating the same stdout to the conversation. Notifications would be N-times redundant.

The dedupe key encodes "this monitor's job is to watch X; one process is enough."

---

## Key insight

The `monitors` system is essentially **passive, persistent skills**: it lets a plugin contribute background-task lifecycle to the session without the model having to know the monitor exists. The `on-skill-invoke:<skill>` arm trigger is the bridge between the active-skill world (model dispatches `/test`) and the passive-monitor world (a `monitors` entry with `when: "on-skill-invoke:test"` starts watching the test runner). Once armed, the monitor's stdout flows into the conversation as `<task_notification>` events - which the system reminder catalog (`AMY = new Set(["prompt", "task-notification"])` in chunks.155.mjs:2822) treats as first-class reminder types.

This is also the **first plugin manifest extension** that opens an unsandboxed long-lived execution surface declaratively. Plugin hooks ran short scripts on events (still unsandboxed but bounded by the event lifetime). Plugin slash commands ran on user request (visible). Monitors run unprompted for the session lifetime, which is why the schema description leans hard on the "same trust tier as hooks" framing - the author is opting into "this is as trusted as a hook."
