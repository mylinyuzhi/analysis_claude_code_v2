# `claude_code.skill_activated` OTel Event (v2.1.126)

## What it does

v2.1.126 adds a new OpenTelemetry event - `claude_code.skill_activated` - that fires every time a skill is activated through the CLI, regardless of activation source. The event carries an `invocation_trigger` attribute that classifies the activation as one of:

- `"user-slash"` - user typed `/skill-name`
- `"claude-proactive"` - the model invoked the skill via the Skill tool from the main loop
- `"nested-skill"` - the model invoked the skill via the Skill tool from inside another fork

Plus optional `skill.name`, `skill.source`, `skill.kind`, `plugin.name`, and `marketplace.name` attributes. Custom skills are redacted as `"custom_skill"` to keep PII out of the OTel pipeline.

This is the canonical telemetry hook for monitoring skill usage in enterprise deployments - prior versions logged skill invocations only via internal `d("tengu_…")` event names, which were Anthropic-internal and not exposed.

---

## How it works

### 1. The event emitter

```javascript
// ============================================
// emitSkillActivatedOtel - The skill_activated OpenTelemetry event emitter
// Location: cli_inner_pretty.js:218520-218533
// ============================================

// ORIGINAL (for source lookup):
function Qf$(H, $, q) {
  let K = $?.type === "prompt" ? $.source : void 0,
    _ = $?.type === "prompt" ? $.pluginInfo : void 0,
    A = _ ? mq(_.repository).marketplace : void 0,
    Y = K === "builtin" || K === "bundled" || (K === "plugin" && rE(A)) || XY();
  M1("skill_activated", {
    "skill.name": Y ? H : "custom_skill",
    invocation_trigger: q,
    ...(K && { "skill.source": K }),
    ...($?.kind && { "skill.kind": $.kind }),
    ...(Y && _ && { "plugin.name": _.pluginManifest.name }),
    ...(Y && A && { "marketplace.name": A }),
  });
}

// READABLE (for understanding):
function emitSkillActivatedOtel(skillName, command, invocationTrigger) {
  const source = command?.type === "prompt" ? command.source : undefined;
  const pluginInfo = command?.type === "prompt" ? command.pluginInfo : undefined;
  const marketplace = pluginInfo ? parseRepoSpec(pluginInfo.repository).marketplace : undefined;
  // Names are exposed only when the skill comes from a trusted/official source,
  // OR when the user has explicitly opted into tool-detail logging.
  const isFirstParty =
    source === "builtin" || source === "bundled" ||
    (source === "plugin" && isOfficialMarketplace(marketplace)) ||
    isToolDetailLoggingEnabled();
  emitOtelLogEvent("skill_activated", {
    "skill.name": isFirstParty ? skillName : "custom_skill",
    invocation_trigger: invocationTrigger,
    ...(source && { "skill.source": source }),
    ...(command?.kind && { "skill.kind": command.kind }),
    ...(isFirstParty && pluginInfo && { "plugin.name": pluginInfo.pluginManifest.name }),
    ...(isFirstParty && marketplace && { "marketplace.name": marketplace }),
  });
}

// Mapping:
//   Qf$ -> emitSkillActivatedOtel,        H   -> skillName,
//   $   -> command,                       q   -> invocationTrigger,
//   K   -> source,                        _   -> pluginInfo,
//   A   -> marketplace,                   Y   -> isFirstParty,
//   M1  -> emitOtelLogEvent,              mq  -> parseRepoSpec,
//   rE  -> isOfficialMarketplace,         XY  -> isToolDetailLoggingEnabled
```

### 2. Three call sites - one per trigger

The function is called from exactly three places, mapping 1:1 to the three trigger values:

#### a. User-typed slash command (`"user-slash"`)

```javascript
// ============================================
// processPromptSlashCommand - user-slash trigger emission
// Location: cli_inner_pretty.js:352727-352736 (forked variant)
// ============================================

// ORIGINAL (for source lookup):
async function sc_(H, $, q, K, _, A, z = []) {
  let Y = hm();
  d("tengu_slash_command_forked", {
    command_name: H.name,
    _PROTO_skill_name: H.name,
    invocation_trigger: "user-slash",
    ...N7H(H.source, H.loadedFrom, H.kind, H.createdBy),
    ...JkH(H.source, H.name),
    ...(H.pluginInfo && E7H(H.pluginInfo)),
  });
  // ...
}

// READABLE (for understanding):
async function dispatchForkedSlashCommand(command, args, ...) {
  const agentId = newAgentId();
  recordInternalEvent("tengu_slash_command_forked", {
    command_name: command.name,
    _PROTO_skill_name: command.name,
    invocation_trigger: "user-slash",
    ...skillSourceMetadata(command.source, command.loadedFrom, command.kind, command.createdBy),
    ...sourceFingerprint(command.source, command.name),
    ...(command.pluginInfo && pluginMetadata(command.pluginInfo)),
  });
  // emitSkillActivatedOtel(command.name, command, "user-slash") is called via the same path
  // ...
}

// Mapping: sc_ -> dispatchForkedSlashCommand, d -> recordInternalEvent,
//          N7H -> skillSourceMetadata, JkH -> sourceFingerprint, E7H -> pluginMetadata
```

The inline path also fires `Qf$(skillName, command, "user-slash")` via `processPromptSlashCommand` (`ec_`/`$l_` at `cli_inner_pretty.js:352942` and `352979`).

#### b. Model-invoked from main loop (`"claude-proactive"`)

```javascript
// ============================================
// SkillTool inline-call path - claude-proactive trigger emission
// Location: cli_inner_pretty.js:353681-353704
// ============================================

// ORIGINAL (for source lookup):
async call({ skill: H, args: $ }, q, K, _, A) {
  let z = H.trim(),
    Y = z.startsWith("/") ? z.substring(1) : z;
  q.options.activeSkill = Y;
  let f = await yV6(q),
    O = Xy(Y, f);
  if (O) q.options.activeSkill = O.name;
  if ((J68(Y), O?.type === "prompt" && O.context === "fork")) return ql_(O, Y, $, q, K, _, A);
  // ... process the inline expansion ...
  let G = q.queryTracking?.depth ?? 0,
    V = G > 0 ? "nested-skill" : "claude-proactive",
    v = RD()?.agentId,
    E = O?.type === "prompt" ? O.source : void 0;
  (d("tengu_skill_tool_invocation", {
    command_name: Z,
    _PROTO_skill_name: Y,
    execution_context: "inline",
    invocation_trigger: V,
    query_depth: G,
    ...(v && { parent_agent_id: v }),
    ...N7H(E, O?.loadedFrom, O?.kind, O?.type === "prompt" ? O.createdBy : void 0),
    // ...
  }),
    Qf$(Y, O, V));                       // <-- the OTel emission

// READABLE (for understanding):
async call({ skill: skillNameRaw, args }, toolUseContext, ...) {
  const trimmed = skillNameRaw.trim();
  const skillName = trimmed.startsWith("/") ? trimmed.substring(1) : trimmed;
  toolUseContext.options.activeSkill = skillName;
  const availableCommands = await getMcpAndStaticCommands(toolUseContext);
  const command = findCommand(skillName, availableCommands);
  if (command) toolUseContext.options.activeSkill = command.name;
  // Forked-context skill -> hand off to the forked-call path (which has its own emission below)
  if (command?.type === "prompt" && command.context === "fork") {
    return runForkedSkill(command, skillName, args, toolUseContext, ...);
  }
  // ... inline expansion path ...
  const queryDepth = toolUseContext.queryTracking?.depth ?? 0;
  // Depth=0 -> first-turn invocation from the main loop. Depth>0 -> recursion from inside a fork.
  const trigger = queryDepth > 0 ? "nested-skill" : "claude-proactive";
  const parentAgentId = getCurrentAgentMetadata()?.agentId;
  const source = command?.type === "prompt" ? command.source : undefined;
  recordInternalEvent("tengu_skill_tool_invocation", {
    command_name: telemetryName,
    _PROTO_skill_name: skillName,
    execution_context: "inline",
    invocation_trigger: trigger,
    query_depth: queryDepth,
    ...(parentAgentId && { parent_agent_id: parentAgentId }),
    ...skillSourceMetadata(source, command?.loadedFrom, command?.kind, command?.type === "prompt" ? command.createdBy : undefined),
    // ...
  });
  emitSkillActivatedOtel(skillName, command, trigger);              // the OTel emission
}

// Mapping:
//   d   -> recordInternalEvent,       Qf$ -> emitSkillActivatedOtel,
//   yV6 -> getMcpAndStaticCommands,   Xy  -> findCommand,
//   ql_ -> runForkedSkill,            RD  -> getCurrentAgentMetadata,
//   N7H -> skillSourceMetadata,       J68 -> recordSkillInvokeStart
```

#### c. Model-invoked from inside a fork (`"nested-skill"`)

The same `V = G > 0 ? "nested-skill" : "claude-proactive"` line picks the trigger based on `query_depth`. The forked variant at `cli_inner_pretty.js:353385`:

```javascript
// ============================================
// SkillTool forked-call path - claude-proactive/nested-skill trigger emission
// Location: cli_inner_pretty.js:353385-353406
// ============================================

// ORIGINAL (for source lookup):
let J = K.queryTracking?.depth ?? 0,
  X = J > 0 ? "nested-skill" : "claude-proactive",
  L = RD()?.agentId;
(d("tengu_skill_tool_invocation", {
  command_name: D,
  _PROTO_skill_name: $,
  execution_context: "fork",
  invocation_trigger: X,
  query_depth: J,
  ...(L && { parent_agent_id: L }),
  ...j,
  ...N7H(H.source, H.loadedFrom, H.kind, H.createdBy),
  ...JkH(H.source, $),
  attribution_shown: $X$(H.source, $) !== null,
  skill_content_chars: H.contentLength,
  ...!1,
  ...(H.pluginInfo && {
    ...E7H(H.pluginInfo),
    plugin_name: M ? H.pluginInfo.pluginManifest.name : "third-party",
    plugin_repository: M ? H.pluginInfo.repository : "third-party",
  }),
}),
  Qf$($, H, X));                          // <-- the OTel emission

// READABLE (for understanding):
const queryDepth = toolUseContext.queryTracking?.depth ?? 0;
// Same depth -> trigger mapping as the inline path. Forked execution does NOT change the trigger;
// the trigger reflects WHO initiated the call (user vs. model), not HOW it runs (inline vs. fork).
const trigger = queryDepth > 0 ? "nested-skill" : "claude-proactive";
const parentAgentId = getCurrentAgentMetadata()?.agentId;
recordInternalEvent("tengu_skill_tool_invocation", {
  command_name: telemetryName,
  _PROTO_skill_name: skillName,
  execution_context: "fork",                                          // differs from inline path
  invocation_trigger: trigger,
  query_depth: queryDepth,
  ...(parentAgentId && { parent_agent_id: parentAgentId }),
  ...extraMetadata,
  ...skillSourceMetadata(command.source, command.loadedFrom, command.kind, command.createdBy),
  ...sourceFingerprint(command.source, skillName),
  attribution_shown: getSkillAttributionHint(command.source, skillName) !== null,
  skill_content_chars: command.contentLength,
  // ...
  ...(command.pluginInfo && {
    ...pluginMetadata(command.pluginInfo),
    plugin_name: isOfficialPluginSource ? command.pluginInfo.pluginManifest.name : "third-party",
    plugin_repository: isOfficialPluginSource ? command.pluginInfo.repository : "third-party",
  }),
});
emitSkillActivatedOtel(skillName, command, trigger);                  // the OTel emission

// Mapping:
//   d   -> recordInternalEvent,       Qf$ -> emitSkillActivatedOtel,
//   N7H -> skillSourceMetadata,       JkH -> sourceFingerprint,
//   E7H -> pluginMetadata,            $X$ -> getSkillAttributionHint,
//   RD  -> getCurrentAgentMetadata,   M   -> isOfficialPluginSource
```

### 3. The `query_depth` mechanism

`queryTracking.depth` is incremented every time a skill invocation forks a child query. The main loop starts at depth 0, the first fork is depth 1, a fork inside that fork is depth 2, etc. The `G > 0 ? "nested-skill" : "claude-proactive"` ternary therefore distinguishes:

- Skill invoked by the model in the user-facing turn -> `claude-proactive`
- Skill invoked by the model from inside another forked skill (or Agent-tool task) -> `nested-skill`

The user-typed path is independent of depth - it always emits `"user-slash"` because the user-as-actor is what defines the trigger.

### 4. The privacy gate (`Y` / `isFirstParty`)

The `skill.name`, `plugin.name`, and `marketplace.name` fields can leak project-specific names if logged unconditionally. The gate is:

```javascript
let Y = K === "builtin" || K === "bundled" || (K === "plugin" && rE(A)) || XY();
```

Decoded: the skill name is logged in cleartext only when one of these is true:

1. Source is `"builtin"` (the binary's own slash commands like `/init`, `/review`)
2. Source is `"bundled"` (skills shipped inside the CLI binary like `simplify`, `claude-api`)
3. Source is `"plugin"` AND the plugin's marketplace is an "official" marketplace (anthropics/claude-plugins-official and similar; see `rE` / `isOfficialMarketplace`)
4. `XY()` returns true - which means the user/admin explicitly opted into `OTEL_LOG_TOOL_DETAILS=1`

For everything else, `skill.name` is redacted to `"custom_skill"`, and plugin/marketplace fields are dropped. This matches the v2.1.117 redaction policy for user-prompt and tool-result OTel events.

### 5. The internal `tengu_*` events still fire

Note that the OTel emission is **additional** to the Anthropic-internal `tengu_slash_command_*` and `tengu_skill_tool_invocation` events. Those continue to flow through `d()` (the internal analytics pipe), while `Qf$` emits the OTel event that customers can subscribe to. The two have different schemas - the internal events carry more details (cost, latency, etc.) that the OTel event intentionally does not expose to keep the spec stable.

---

## Why this approach

**Why a separate OTel event instead of reusing the internal `tengu_` events?**

- Schema stability - internal events change shape across releases; OTel events are a public contract.
- Privacy posture - the internal events log user prompts, command args, etc.; the OTel event sticks to skill identity and trigger.
- Visibility scope - enterprise OTel customers can ingest skill_activated without subscribing to the entire Claude Code analytics pipe.

**Why three triggers, not "user vs. model"?** The `nested-skill` distinction matters for two reasons:

1. Cost attribution - a nested-skill invocation runs in a forked sub-agent with its own token budget, separate from the user-facing turn. Enterprises tracking skill cost can filter by trigger.
2. Routing analysis - if a skill is mostly invoked from inside other forks (`nested-skill`) rather than the main loop (`claude-proactive`), that's a signal that other skills are routing to it, which informs the skill catalog design.

**Why redact custom skill names but not built-ins?** Custom skills can reveal project structure (e.g. `/deploy-acme-prod` leaks the customer name). Built-ins are the same for every Claude Code user, so their names are public knowledge. The "official marketplace" branch lets a plugin author opt their skill names in to telemetry by publishing through the official channel.

**Why log the marketplace name and not just the plugin name?** Because plugin names can collide across marketplaces (two different `git-helpers` plugins from different marketplaces). The marketplace name disambiguates them and lets enterprises track adoption of specific plugin distributions.

**Key insight:** The `invocation_trigger` attribute is the load-bearing field. Without it the event would just say "this skill ran" - useful, but not actionable. With it, enterprises can answer "what fraction of skill invocations are model-initiated vs. user-initiated?", "which skills does the model chain together via nested invocation?", and "are users typing `/skill` or expecting the model to dispatch them?". Those answers shape skill catalog design.

---

## Cross-references

- The internal `d("tengu_…")` analytics pipe - `34_telemetry`
- `OTEL_LOG_TOOL_DETAILS` env var (gates the cleartext skill name) - `34_telemetry`
- Skill source values (`"builtin"`, `"bundled"`, `"plugin"`, `"mcp"`, `"skills-dir"`) - [skill_overrides.md](./skill_overrides.md)
- Plugin marketplace and the `rE` / `isOfficialMarketplace` predicate - `26_plugin_packaging`
- The Skill tool itself and its `validateInput` / `call` paths - the rest of this module
- The v2.1.117 `OTEL_LOG_TOOL_DETAILS` redaction policy (sister change applied to other events)
