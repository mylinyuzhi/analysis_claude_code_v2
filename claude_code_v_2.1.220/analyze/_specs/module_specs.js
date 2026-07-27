export const meta = {
  name: 'cc220-modules',
  description: 'Write deep source-anchored module docs for the 2.1.193->2.1.220 delta tree',
  phases: [
    { title: 'Write', detail: 'one agent per module dir: scout -> verify -> write docs + symbol additions' },
  ],
}

const ROOT = '/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.220'
const AN = ROOT + '/analyze'

// ---------------------------------------------------------------------------
// Module registry. args = { group: 'A' | 'B' | 'C' }
// ---------------------------------------------------------------------------
const MODULES = [
  // ======================= GROUP A - the densest / highest-value =======================
  {
    group: 'A', dir: '47_models', themes: 'models',
    title: 'Models, the model registry rewrite, and fast mode',
    docs: [
      'model_catalogue_rewrite.md - the undocumented headline: imperative camelCase model data -> declarative snake_case catalogue',
      'opus5_and_sonnet5.md - the two default-model releases (.197 Sonnet 5, .219 Opus 5): entries, 1M context, promo pricing, alias resolution per provider',
      'fast_mode.md - eligibility predicate, the Opus 4.7 changelog/code discrepancy, org+flag gating, cooldown, toggle telemetry',
      'org_default_models_and_picker.md - .196 org/role default models, /model picker ordering + entitlement drops + price-row fixes, model-switch announcements',
    ],
    seed: `Ground truth sections 1, 6.2, 6.3 and open questions 2-6 are ALL yours - they are the spine of this module.
Catalogue at :14028-14496 (17 model ids, lines listed in ground truth). Alias table :14461-14486.
Fast mode: capability sites :14324/:14357/:14392, predicate mv :109468-109474, gate xji :109461-109466,
zod fields :61190/:61194, unavailability strings :109390-109433, cooldown :109500/:109509,
tengu_fast_mode_toggled :109484. Sonnet 5 promo wug :120046-120050, pricing suffix Goe :120053.
mid_conv_system support fn :150508-150526 (the .201 revert). Short-name map :100233.
Capability branches :109715/:109775, id normaliser :111121, allow-lists :119685-119710.
ANTHROPIC_DEFAULT_SONNET_MODEL custom-row builder :120031-120043.
ALSO: 'anthropic_google_cloud' + CLAUDE_CODE_USE_ANTHROPIC_GOOGLE_CLOUD are an unannounced provider channel - trace it.
ALSO: grep 'Org default' / 'Role default' for .196, and tengu_alias_migration.`,
    minDocs: 5,
  },
  {
    group: 'A', dir: '36_background_agents', themes: 'background_agents',
    symbolSuffix: 'background_agents_daemon',
    title: 'Background agents part 1 — the daemon, workers, and the session store',
    docs: [
      'README.md - the module index AND the per-bullet ledger for ALL 112 background_agents bullets in the window (coordinate: part 2 appends its own sections, so scope your ledger to the daemon/worker/store bullets and link to part 2 docs for the rest)',
      'daemon_lifecycle.md - daemon spawn/handover/lock/socket/auth token, version-recency handover judged by embedded build timestamp, stale-binary refusal, control-socket failures, idle reaping, macOS aqua wrap, PowerShell 7 preference on Windows, CLAUDE_CODE_PROCESS_WRAPPER',
      'worker_respawn_and_upgrade.md - respawn/revival guards, stop honouring vs respawn races, in-background upgrade after a CLI update, downgrade refusal, crash loops, prewarm bursts, probe rescue, resume conflicts, adopt/claim/link handoff',
      'session_store_and_worktrees.md - the roster and session store, undeletable/reappearing rows, claude rm, worktree locks and the periodic sweep, non-git dirs, PATH/env/base-URL inheritance from the dispatching shell',
    ],
    seed: `THIS IS THE DENSEST THEME IN THE WINDOW - 112 of 578 bullets (~20%). It is split across TWO agents:
YOU are part 1 (daemon / worker lifecycle / session store). Part 2 owns the agent VIEW, /fork->background,
and notifications, and writes agent_view_and_status.md, fork_to_background_session.md,
bg_notifications_and_reporting.md. Do not write those three files.
The 2.1.193 tree's 36_background_agents/ is your format reference.
CLAUDE_CODE_PROCESS_WRAPPER (220=13/193=0) at :60632 is a confirmed net-new anchor.
The 326-new-gate list in 00_overview/_raw_asset_diff_193_to_220.md is your richest lead: it contains
~40 tengu_bg_* / tengu_adopt_* / tengu_daemon_* names, and these are YOURS:
tengu_bg_adopt_token_lost_respawn, tengu_bg_attach_wake_after_reap, tengu_bg_daemon_macos_aqua_wrap,
tengu_bg_daemon_spawn_launcher_fallback, tengu_bg_daemon_bg_disabled_skip, tengu_bg_handoff_settle,
tengu_bg_launcher_fork_and_exit, tengu_bg_launcher_replacement_raw, tengu_bg_launcher_worker_refused,
tengu_bg_prewarm_burst{,_concurrency,_delay_ms}, tengu_bg_pty_auth_mismatch,
tengu_bg_respawn_{downgrade_refused,probe_rescue,resume_conflict,suppressed}, tengu_bg_revival_guard,
tengu_bg_roster_orphan_pruned, tengu_bg_rv_auth_mismatch, tengu_bg_stdin_unreadable,
tengu_daemon_refuse_stale_upgrade, tengu_daemon_upgrade_refused_stale_binary,
tengu_daemon_upgrade_respawn_unreachable, tengu_adopt_{claim,exit_handoff,exit_reap,link}.
Grep each, read the emitter, map it to its changelog bullet(s). The scoping files rate 16 of the
.200-.205 background bullets UNANCHORED because they are internal daemon changes with no distinguishing
literal - for those, work from the GATE names instead of the bullet text, and if a bullet still has no
anchor, say so rather than guessing. PRIORITISE mechanism depth over bullet coverage.`,
    minDocs: 4,
  },
  {
    group: 'A', dir: '36_background_agents', themes: 'background_agents',
    symbolSuffix: 'background_agents_view',
    title: 'Background agents part 2 — the agent view, /fork, and notifications',
    docs: [
      'agent_view_and_status.md - the claude agents view: the status state machine (Working / Needs input / Needs attention / Done), the classifier-written headlines, PR link detection, blocked-session peeks with a worded staleness clock, Ctrl+X semantics, sections layout, full-width status column, attach/cold-attach transcript rendering',
      'fork_to_background_session.md - .212 /fork becomes a background session copy while /subtask takes over the in-session subagent role; fork naming from the prompt, live-parent protection, fork lineage, --fork-name',
      'bg_notifications_and_reporting.md - the Notification hook agent_needs_input / agent_completed events, background result-reporting honesty (no fabricated results, waiting for real completion), the [SYSTEM NOTIFICATION - NOT USER INPUT] framing, footer waiting counts and the N-done pulse, /tasks retention',
    ],
    seed: `THIS IS THE DENSEST THEME IN THE WINDOW - 112 of 578 bullets (~20%). It is split across TWO agents:
YOU are part 2 (agent view / fork / notifications). Part 1 owns the daemon, worker respawn/upgrade, and the
session store, and writes README.md + daemon_lifecycle.md + worker_respawn_and_upgrade.md +
session_store_and_worktrees.md. DO NOT write README.md and do not write those three files - part 1's README
links to your docs, so use exactly the three filenames listed above.
CONFIRMED TRAPS from the scoping pass (do not present these as introductions): the state labels
'Needs input' (220=2/193=2) and 'Needs attention' (220=1/193=1) are CARRYOVER strings - the delta is the
state machine that assigns them; the bare-#N PR link format string is 1/1 carryover; the
'[SYSTEM NOTIFICATION - NOT USER INPUT]' literal is 1/1 carryover (the .205 delta is where it is injected);
'currently running as a background agent' is 3/3 carryover.
Your gates from the new-gate list: tengu_bg_agent_notification, tengu_bg_reply_outcome, tengu_bg_result_seen,
tengu_agent_view_leader_command_notice. /subtask anchors: name:"subtask" :500574, usage :500549,
--fork-name in a flag set :443144. Coordinate with 43_slash_commands (they cover /fork and /subtask as
COMMANDS and their argument handling; you cover the background-session mechanics and the agent-view row).`,
    minDocs: 3,
  },
  {
    group: 'A', dir: '38_permissions', themes: 'permissions',
    title: 'Permissions and auto mode',
    docs: [
      'security_hardening_214.md - the .214 batch: dir/** rules, PowerShell 5.1 bypass, FD-redirect fail-closed, over-length, zsh subscripts, help/man, docker daemon-redirect, remote-session ordering',
      'auto_mode_availability_and_gating.md - .207 default-on for Bedrock/Vertex/Foundry, disableAutoMode carryover, settings-source restriction, onboarding wizard, claude auto-mode reset',
      'classifier_adjudication.md - the classifier: outcome taxonomy, scope preamble, staged xml_s1/s2, model default + pinning, queueing, hook ask floor, what moved from dialog to classifier in .218',
      'rule_matching_and_glob_semantics.md - single-segment dir/** semantics split between permission rules and hook if:, rule-matcher compilation/caching, worktree-root rule persistence, Write/NotebookEdit/Glob rule warnings',
      'destructive_command_rules.md - dangerous-rm/catastrophic-removal rules, unresolvable-variable rule, transcript-tamper rule, docker, file -m/-f',
    ],
    seed: `Ground truth section 6.4 is a WORKED EXAMPLE for this module - read it and imitate the method exactly;
it also hands you the finished analysis of the over-length bullet (only :392119 is new; AIe :512643; Fsn :512253;
bashMissKind 22/23 carryover; zshBraceDiff 20/20 carryover; the '10,000 characters' literal at :205495 is a DECOY).
Classifier corpus :443172 (outcome taxonomy incl. automode-unavailable fail-closed), :443183 (scope preamble),
:443379 (Unverifiable Deletion Target rule), staged telemetry :444073/:444181, stall log :444344, beta self-heal :444418.
New gates to chase: tengu_auto_mode_{beta_latch,classifier_queue,env_onboarding_*,repo_visibility_lookup_failed,
setup_wizard_*}, tengu_destructive_command_warning, tengu_agent_worktree_cwd_escape_blocked,
tengu_cowork_auto_mode_include_allowed_write_mcp. 'auto-mode reset' at :865404. dangerous 220=136/193=117.
disableAutoMode is 7/7 CARRYOVER - the delta is default availability, not the kill switch.`,
    minDocs: 5,
  },
  {
    group: 'A', dir: '53_subagent_limits', themes: 'subagent_limits',
    title: 'Subagent orchestration limits',
    docs: [
      'spawn_depth_gate.md - the .217->.219 depth flip-flop and how a GrowthBook gate shipped it',
      'concurrency_and_session_caps.md - the three plain-constant budget caps, their refusal messages, and /clear reset',
      'budget_and_delegation_hardening.md - --max-budget-usd halting bg agents, re-delegation discouragement, Explore model inheritance, isolation:worktree containment, Agent indirect-prompt-injection hardening, Task mode deprecation',
    ],
    seed: `Ground truth sections 2 and 6.1 give you the complete verified skeleton: env accessors :32122-32125,
readers gPu/Q7r/yPu :231400-231406, constants gty=20/yty=200/_ty=200 :231411-231413,
getMaxSubagentSpawnDepth hee :230896-230906 with gate tengu_hazel_trellis and ZDu=3,
refusal messages :398328 (depth) / :398397 (per-session) / :398411 (concurrent) / :403669 (web search).
193 depth refusal for comparison :430482 (193). Depth LIMITING itself is carryover - only the env override,
the gate, the value, and the sibling caps are new. Chase: tengu_defer_cap_{ms,refused_queued,refused_restartable},
'Hardened the Agent tool against indirect prompt injection' (.210) and 'agents are now less likely to
re-delegate' (.203) - both are prompt-text deltas, so diff the Agent tool description in both bundles.`,
    minDocs: 4,
  },
  {
    group: 'A', dir: '39_mcp', themes: 'mcp',
    title: 'MCP: auto-backgrounding, diagnostics, and configuration',
    docs: [
      'auto_background_tool_calls.md - .212 MCP calls over 2 minutes move to the background (CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS)',
      'errors_and_diagnostics.md - HTTP status/error text in claude mcp list and /mcp, whitespace warnings, url-without-type, empty-url, not-configured states, transient refresh errors',
      'oauth_timeouts_and_reconnect.md - per-server request_timeout_ms, OAuth scope narrowing, single-failed-refresh recovery, plugin MCP re-sync/teardown, idle web wake reconnect',
      'roots_and_managed_config.md - roots/list additional dirs + notifications/roots/list_changed, managed allowlist/denylist ${VAR} resolution source change, self-approval security fix, reserved server names',
    ],
    seed: `Confirmed net-new: CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS 220=3/193=0 first :32120; mcp_server_errors 220=3/193=0
first :593620 (shared with 51_headless_sdk - coordinate, do not duplicate: you own the MCP-side production of the
list, they own the init-event shape). New gates to chase in the diff file: tengu_mcp_* names, plus
'Claude Browser'/'Claude Preview' reserved names (.205), roots/list (.203), request_timeout_ms (.206).
The 2.1.193 tree's 39_mcp/ is your format reference and documents the pre-existing idle-timeout +
headersHelper reauth machinery - build ON it, and say plainly which parts are carryover.`,
    minDocs: 5,
  },
  {
    group: 'A', dir: '44_telemetry', themes: 'telemetry',
    title: 'Telemetry and OpenTelemetry',
    docs: [
      'otel_attributes_and_correlation.md - .214 message.uuid + client_request_id + tool_source, .202 workflow.run_id/workflow.name, trace/span context propagation fixes',
      'content_truncation_and_exporters.md - CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH over the 60KB cap, chunked-encoding rejection (Azure Monitor), managed OTEL_EXPORTER_OTLP_ENDPOINT precedence',
      'cost_and_usage_metering.md - message_delta double-counting, gateway spend metering for Bedrock ARNs, rate-limit over-counting, /clear cost reset, monotonic turn duration',
    ],
    seed: `Confirmed: CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH 220=2/193=0 first :24390; tool_source 220=1/193=0 at :152009;
client_request_id 220=7/193=5 (PARTIAL - split the bullet); workflow.run_id 220=3/193=2 (PARTIAL).
The 2.1.193 tree's 44_telemetry/assistant_response_event.md documents TELEMETRY_CONTENT_LIMIT_BYTES=61440 -
find the 220 equivalent and show how the new env var overrides it. Chase gates tengu_otel_* / feature_flag_writes /
gate_denied / gate_error / gate_skip (all in the new-gate list) and the GrowthBook null-eval crash fix (.214).`,
    minDocs: 4,
  },
  {
    group: 'A', dir: '42_workflow', themes: 'workflow',
    title: 'The Workflow tool and dynamic workflow sizing',
    docs: [
      'workflow_size_guideline.md - .202 /config setting -> .219 workflowSizeGuideline settings key -> .220 medium default; how the guideline reaches the model',
      'workflow_runtime_and_ui.md - workflow OTEL attrs, /workflows list layout, agent grid for late-joining Remote clients, unicode-quote parse fix + error line reporting, save dialog CLAUDE_CONFIG_DIR, left-arrow nav, phase list truncation',
    ],
    seed: `Confirmed net-new: workflowSizeGuideline 220=21/193=0 - zod :60914, set-by-settings predicate :389150,
resolution with fallback :389153, TWO prompt-injection sites :389362/:389365 (rMs + iMs(...)),
/config gating workflowSizeGuidelineToggleable :451231/:451295, row id :451504.
The Workflow tool description itself is a huge prompt string around :388988 - diff it against 193 to find
every documented behaviour change (the size guideline sentence, agentType, effort, isolation wording).
The .220 release is a single 'Bug fixes and reliability improvements' bullet, but the size-guideline default
change lands in .219 - reconcile which build actually carries 'medium'. Also grep 'fewer than 15 agents'.`,
    minDocs: 3,
  },
  {
    group: 'A', dir: '04_tools', themes: 'tools',
    title: 'Tool surface and individual tool behaviour',
    docs: [
      'tool_surface_delta_220.md - 50 -> 65 tool entries: which are genuinely new, which are detector noise, deferred/ToolSearch plumbing',
      'end_conversation_tool.md - the EndConversation tool: four-layer gating, model floor, entrypoint allow-list, reflection prompts, marker write',
      'shell_tools_deltas.md - Bash and PowerShell: heartbeat for long calls, timeout auto-background messaging, cd-after-background correctness, pkill self-match, Windows encoding/stdin/exit-code fixes, SIGTERM tree kill',
      'file_and_search_tools_deltas.md - Read/Edit/Write/Grep/Glob/NotebookEdit fixes, long-line memory blowup, edit read cache bound, Windows \\u path corruption',
      'web_and_misc_tools_deltas.md - WebSearch/WebFetch retries + overload text, ReportFindings, SendMessage token reduction, TaskStop/TaskOutput cross-agent lookup, tool-result renderer crashes',
    ],
    seed: `Ground truth section 5 lists the 14 new tool .md files and warns which are detector noise -
VERIFY EACH with a 193 zero-count before calling it new. Ground truth 4.1 gives you the whole
EndConversation surface already (PB :231369, export table :412952-412962, registry wire :425147,
marker log :413153, semver floor compare :412940-412949, gate tengu_end_conversation_tool_call).
ReportFindings: description :403823, searchHint :403879. Chase tengu_deferred_stub_tool + tengu_defer_cap_* for
the deferred-tool machinery, and the .214 'periodic progress heartbeat for long-running tool calls'.`,
    minDocs: 6,
  },

  // ======================= GROUP B =======================
  {
    group: 'B', dir: '48_accessibility_ui', themes: 'accessibility_ui',
    title: 'Accessibility and terminal UX',
    docs: [
      'screen_reader_mode.md - the .208 promotion of a feature already present in 193, the plain-text renderer, and the announcement surface (.210/.216/.218/.219): permission-mode announcements, deleted-text announcements, decorative-glyph hiding, table reading, cursor positioning for magnifiers, typed-character echo',
      'vim_and_input.md - vimInsertModeRemaps, s/S in NORMAL, left-arrow-on-empty returning to agent view, Ctrl+J newline, paste handling (Ctrl+J-encoded newlines, paste markers leaking to editors, [Pasted text #N] re-expansion), inline Ctrl+R history search, "?" edge case',
      'emoji_completion.md - the net-new emoji shortcode autocomplete (:heart:) and emojiCompletionEnabled',
      'terminal_rendering.md - streaming render cost, synchronized output under tmux (and the .200 correction retracted in .212), table caps, fullscreen/layout fixes, hyperlinks (FORCE_HYPERLINK), mouse controls, jump-to-bottom pill, ghost frames, diff previews in narrow layouts, welcome-banner resize, transcript scroll/jump behaviour',
    ],
    seed: `CRITICAL: ground truth section 3 proves screen reader mode ALREADY EXISTS in 2.1.193 (setting :55849 (193),
resolver :137296-137299 (193), flag :714398 (193), byte-identical description). Do NOT write it as an
introduction. The 220 delta: source-tracking resolver :156204-156208 (returns 'flag'/'settings'), the renderer,
and the announcements. Net-new confirmed: emojiCompletionEnabled 220=2/193=0 :61202;
vimInsertModeRemaps 220=2/193=0 :61454; CLAUDE_CODE_DISABLE_MOUSE_CLICKS 220=3/193=0 :31082.
Chase 'axScreenReader' consumers, 'announce'/'aria'-style helpers, and the .199/.216 screen-reader output bullets.
SCALE NOTE: accessibility_ui is the SECOND densest theme (63 of 578 bullets) but the scoping pass rated
25 of them UNANCHORED and gave the .211-.214 slice ZERO rich-depth rows - terminal/UI fixes rarely leave a
greppable string. So DO NOT drive this module from the bullet list. Drive it from the RENDER CODE: locate the
screen-reader renderer, the ink/terminal writer, the paste handler, the completion engine, and the mouse/key
input path, document those mechanisms properly, and then map whichever bullets those mechanisms explain.
State plainly in the README how many bullets you could and could not anchor.`,
    minDocs: 5,
  },
  {
    group: 'B', dir: '49_sandbox', themes: 'sandbox',
    title: 'Sandbox: filesystem and network controls',
    docs: [
      'network_strict_allowlist.md - .219 sandbox.network.strictAllowlist promoted from dark enforcement to a public setting',
      'filesystem_disabled_and_paths.md - .216 sandbox.filesystem.disabled, late .claude/* symlink reconciliation, worktree/junction escapes, IDE-interaction restrictions',
    ],
    seed: `Ground truth section 3: strictAllowlist 220=4/193=1 - the ENFORCEMENT existed at :211506 (193);
new in 220 are zod :49648, settings merge :62415, managed aggregation :205177, enforcement now :195200.
filesystem.disabled 220=7/193=6 - find WHICH site is new (220 zod area :49737, first hit :195430).
Also: the Windows sandbox argv/CreateProcessW limit error jVg :205490-205497 (a decoy for the .214
over-length bullet, but a real sandbox mechanism worth documenting), Linux bridge socket :205500+,
session-allowed-hosts remember (.211), tengu_agent_worktree_cwd_escape_blocked.
Frame both bullets honestly as dark-launch -> public-setting promotions.`,
    minDocs: 3,
  },
  {
    group: 'B', dir: '50_performance', themes: 'performance',
    title: 'Performance and memory',
    docs: [
      'memory_bounds_and_leaks.md - the .208 leak batch (MCP stderr 64MB, LSP LRU 50 docs, async hook output, tool-result payloads), edit read cache 16MB, updater streaming, long-line reads, image retention',
      'cpu_and_caching.md - .216 quadratic message normalization, rule-matcher compilation cache, tool-pool assembly cache (7x), context-usage re-analysis, render subtree skipping, task-list re-render',
      'disk_and_transcript.md - transcript size reduction (79x), checkpoint pruning, binary/startup size (-7MB lazy load), resume memory with many worktrees',
    ],
    seed: `These bullets are stated as measurements, so your job is to find the MECHANISM and the CONSTANT.
Grep for the caps themselves: 64MB / 67108864, 50 (LSP doc LRU), 16MB / 16777216, 200 (table rows),
2 MiB settings cap (.214), 2s exit drain (.214). Each cap is a named constant - find it, give its line,
and prove the 193 side had no cap (or a different one). tengu_edit_string_lengths is in the new-gate list.
Be careful: 'Improved terminal layout and rendering performance' style bullets are often UNANCHORABLE -
say so rather than inventing an anchor. Coordinate with 48_accessibility_ui on render-cost bullets:
you own resource bounds, they own visual behaviour.`,
    minDocs: 4,
  },
  {
    group: 'B', dir: '51_headless_sdk', themes: 'headless_sdk',
    title: 'Headless, print mode, and the SDK stream-json surface',
    docs: [
      'stream_json_init_and_output.md - mcp_server_errors in the init event, output truncation at exit + the byte-scaled drain, blank/CRLF input lines, -p answer loss on mid-stream error',
      'subagent_text_forwarding.md - --forward-subagent-text / CLAUDE_CODE_FORWARD_SUBAGENT_TEXT and the .219 nested depth-2+ forwarding keyed by spawning Agent tool_use id',
      'control_requests.md - set_model mid-turn application, non-string set_model payload, completion-before-handler-finished, initialize-registered SDK MCP servers, register_repo_root, change-directory on idle sessions',
    ],
    seed: `Confirmed net-new: forward-subagent-text 220=2/193=0 first :829537; mcp_server_errors 220=3/193=0 :593620
(coordinate with 39_mcp - you own the init-event shape, they own producing the list);
register_repo_root 220=15/193=3 (the control request PRE-EXISTED; only the DirectoryAdded hook firing is new -
coordinate with 41_hooks). Grep 'control_request', 'set_model', 'stream-json', '--print'.
Several .208/.212/.214 bullets are here. Say clearly which are anchorable and which are not.`,
    minDocs: 4,
  },
  {
    group: 'B', dir: '41_hooks', themes: 'hooks',
    title: 'Hooks',
    docs: [
      'directory_added_hook.md - the net-new DirectoryAdded event end to end',
      'matching_and_exit_codes.md - hyphenated-identifier exact matching (.195), single-segment dir/** if: semantics (.214), exit-code-2 blocking + schema validation, stderr surfacing for SessionStart/Setup/SubagentStart, continue:false halt, callback timeout misreport, SessionStart source "fork"',
      'hook_trust_and_origin.md - agent frontmatter hooks requiring the agent folder\'s own workspace trust, and the plugin ${user_config.*} shell-injection fix as it applies to hooks',
    ],
    seed: `Ground truth 4.2 gives you DirectoryAdded complete: enum :49396, empty slots :271032/:271149,
payload :518818, dispatcher a2t :519444/:519508, switch :520412, matcher list :522099,
/add-dir call site with three failure paths :655141-655162. register_repo_root is 220=15/193=3 so the
control request is CARRYOVER - only the hook firing is new. New gate tengu_agent_hooks_origin_untrusted
is your anchor for the .218 trust bullet. Coordinate with 38_permissions on the dir/** semantics split
(they own permission rules, you own hook if: conditions) and with 45_skills on \${user_config.*}.`,
    minDocs: 4,
  },
  {
    group: 'B', dir: '52_code_review', themes: 'code_review',
    title: 'Review and research commands',
    docs: [
      'code_review_background_subagent.md - .218 /code-review runs as a background subagent, stacked-slash-command review target, cloud vs local routing, the multi-agent review script and its effort parameterization',
      'ultrareview_argument_handling.md - the .212/.214/.218 /ultrareview argument batch: descriptive args, PR refs, branch fetch/typo suggestions, no-merge-base, billing confirmation after /clear, non-interactive routing, error feedback',
      'manual_invocation_gating.md - .215 /verify and /code-review no longer self-invoked, .218 /deep-research manual only, .202 /review back to single-pass',
    ],
    seed: `Anchors seen: Cir = "code-review" :231212; REe = "code-review" :318660; the cloud-review failure text
:318328; a slash-command set including code-review/verify/simplify :309712; a workflow comment describing the
review pipeline 'Scope -> Find (barrier) -> group-by-location -> Verify -> Sweep (xhigh/max) -> Synthesize'
at :424055-424056 with 'Effort parameterization mirrors the inline /code-review cells' - that is a rich,
quotable artefact. Also the Workflow-tool prompt at :269622 mentions /simplify and /code-review fan-out.
Grep 'ultrareview', 'deep-research', 'merge base', 'billing'. The .202 vs .218 /review-vs-/code-review
split is a genuine policy oscillation worth a table.`,
    minDocs: 4,
  },
  {
    group: 'B', dir: '45_skills', themes: 'skills_plugins',
    title: 'Skills and plugins',
    docs: [
      'skill_context_fork_background.md - .218 context: fork skills default to background, background: false opt-out, and the boolean-spelling tolerance (yes/no/on/off/1/0)',
      'skill_loading_and_stacking.md - .199 stacked slash-skill invocation up to 5, .202 duplicate-instruction fix, .210 $1/$2 placeholder preservation, brace-expansion budget (.217), /dataviz + verify-skill rewriting',
      'plugin_config_and_security.md - .207 ${user_config.*} shell-injection rejection, pluginConfigs scope restriction, project-settings consent, marketplace/dependency/cache fixes, LSP-plugin handling, agent names rejecting ":"',
    ],
    seed: `context: fork is 220=3/193=2 - the ENUM MEMBER is carryover (193 :149313, :230371, :398210).
The delta is the background default + the opt-out. In 220 the enum area is around :157793.
Chase gates tengu_cobalt_plinth_dataviz / tengu_cobalt_plinth_* (the new-gate list has five
tengu_cobalt_plinth_* siblings - work out what that family gates), plus tengu_alias_migration is NOT yours.
The 2.1.193 tree's 45_skills/ documents frontmatter case tolerance and malformed-YAML handling - build on it.
Coordinate with 41_hooks on \${user_config.*} (they cover the hooks path, you cover monitors + headersHelper
+ the general rejection) and with 53_subagent_limits on agent-name validation.`,
    minDocs: 4,
  },
  {
    group: 'B', dir: '43_slash_commands', themes: 'slash_cli',
    title: 'Slash commands and the CLI surface',
    docs: [
      'fork_and_subtask.md - .212 splits /fork (background copy) from /subtask (in-session subagent), naming, and the agent-view row',
      'doctor_and_diagnostics.md - /doctor becomes a full checkup with /checkup alias, its new checks (CLAUDE.md trimming, auto-mode default, launcher, update channel), /status changes',
      'command_and_flag_deltas.md - the long tail: /resume picker in agent view, claude auto-mode reset, /cd suggestions, /btw, /release-notes context leak, /context, /clear resets, /loop, /usage, /upgrade, /login, /rename, /branch, /commit-push-pr, /exit, /install-github-app, permission-mode Manual rename, AskUserQuestion auto-continue, integer env var spellings',
    ],
    seed: `Confirmed: /subtask command object name:"subtask" :500574, usage string :500549; 'auto-mode reset' :865404;
--fork-name in a flag set :443144. '/checkup' as a literal is 220=0 - so find how the alias is registered
(likely an aliases array on the doctor command object); this is a good example of why literal-grep alone fails.
The 51 new CLI flags in the diff file include --fork-name, --publish-report, --interview, --scaffold,
--sandbox-user, --proxy-port-range and many git-passthrough flags - triage which belong to Claude Code's own
CLI vs a bundled git/sandbox helper, and say which. .200's permission-mode 'Manual' rename touches defaultMode
(220=44/193=32) - a real but partial delta.`,
    minDocs: 4,
  },

  // ======================= GROUP C - breadth modules =======================
  {
    group: 'C', dir: '05_plan_mode', themes: 'plan_mode',
    title: 'Plan mode deltas',
    docs: ['README.md only - one substantial doc covering every plan-mode bullet in the window'],
    seed: `Bullets: .212 plan mode auto-running file-modifying Bash without a prompt (a real security fix),
.218 plan mode with auto no longer prompting for un-provable-read-only Bash (classifier adjudicates),
.198 read-only auto-allow when a session STARTS in plan mode, .199 state-changing browser tool calls +
read-only browser_batch, .210 plan approvals without edits mislabeled '(edited by user)' + stale snapshot
overwrite, .212 approval-dialog footer splitting 'ctrl+g to edit in <editor>'.
The 2.1.193 tree's 05_plan_mode/ is a current-state appendix - reuse its structure and only document deltas.
Coordinate with 38_permissions (they own the classifier itself; you own the plan-mode interaction).`,
    minDocs: 1,
  },
  {
    group: 'C', dir: '07_compact', themes: 'compact',
    title: 'Compaction and context accounting deltas',
    docs: ['README.md only - one substantial doc'],
    seed: `Bullets: .198 subagents + compaction inherit the session's extended-thinking configuration,
.217 auto-compact never triggering for Opus 4.8 on Bedrock + /compact failing once over the limit,
.218 /context reporting stale pre-compact usage after compacting from the message picker,
.218 fork-session lineage lost after compaction in headless/SDK, .208 context window resetting to 200k
after auto-update (false '100% context used'), .203 context-usage indicator re-analyzing the whole
transcript every turn (perf - coordinate with 50_performance), .196 /context showing 0 tokens for all
tool groups on Bedrock, .198 /branch deriving its fork name from the compaction summary.
The 2.1.193 tree's 07_compact/README.md documented the {kind} discriminated-union dispatcher - check whether
that shape survived to 220 and say so. Note the 1M-context models change the compaction threshold math.`,
    minDocs: 1,
  },
  {
    group: 'C', dir: '30_agent_team', themes: 'agent_team',
    title: 'Agent team deltas',
    docs: ['README.md only - one substantial doc'],
    seed: `Bullets: .207 crash loop from a malformed teammate mailbox message (repeated errors every second
until the file was deleted), .212 a stopping teammate sending the leader duplicate idle notifications when
team init re-ran, .198 a teammate dying on an API error now reports 'failed' to the lead + messaging a stuck
teammate wakes it to retry. Also new gate tengu_agent_view_leader_command_notice and the .199 bullet about
typing /model or /fast while viewing a subagent opening the lead's picker.
The 2.1.193 tree's 30_agent_team/ covers teammateMode/iterm2, --effort inheritance, and stop attribution -
check which survived and whether teammateMode gained members.`,
    minDocs: 1,
  },
  {
    group: 'C', dir: '31_auto_memory', themes: 'auto_memory',
    title: 'Auto memory deltas',
    docs: ['README.md only - one substantial doc'],
    seed: `Bullets: .214 ISO 'modified' timestamp in memory frontmatter, .214 frontmatter values silently
truncated at an inline '#', .210 MEMORY.md index over its read limit now an explicit error instead of silent
truncation, .211 memory index over-limit warning measuring only loaded content (excluding frontmatter and
HTML comments). New gate tengu_cc_memory_tag_stripped is likely relevant.
The 2.1.193 tree's 31_auto_memory/ documents the tengu_billiard_aviary removal and the MEMORY.md compact
reminder - confirm the current state. Grep 'MEMORY.md', 'modified:', frontmatter parsers.`,
    minDocs: 1,
  },
  {
    group: 'C', dir: '40_system_prompt', themes: 'system_prompt',
    title: 'System prompt and reminder deltas',
    docs: ['README.md only - one substantial doc'],
    seed: `Bullets: .201 Sonnet 5 mid-conversation system role (GROUND TRUTH 6.3 PROVES THIS WAS REVERTED by .220 -
that is your headline), .207 spurious prompt-injection warnings from benign system-generated updates,
.210 the ultracode keyword opt-in firing on non-human input such as webhook payloads and relayed PR comments,
.198 subagents treating launcher messages as task direction but never as user approval,
.205 background task notifications explicitly stating no human input occurred (anti-fabrication),
.212 prompt-caching mid-conversation system block behind gateways, .211 Bedrock/Vertex trailing-block billing.
mid_conv_system capability sites :14207/:14355/:14390/:14428, support fn :150508-150526,
tengu_mid_conv_system_fallback_retry :509912. Grep 'ultracode' for the human-origin gate.
Coordinate with 47_models (they own the catalogue; you own the prompt/reminder consequences).`,
    minDocs: 1,
  },
  {
    group: 'C', dir: '46_todo_tasks', themes: 'todo_tasks',
    title: 'Task tracking deltas',
    docs: ['README.md only - one substantial doc'],
    seed: `Bullets: .208 completed background agents staying listed in /tasks until cleanup, .208 input
responsiveness while agent task lists update (task updates no longer re-render the whole UI),
.210 pressing left-arrow to open the agents view dropping the task tracker, .212 agent-view / claude agents
--json 'Needs input' state, .203 TaskStop/TaskOutput failing to find agents spawned by another agent.
Also new gate tengu_dead_probe_taskoutput_legacy_params and tengu_dead_probe_taskstop_shell_id - these
'dead_probe' gates are a whole family in the new-gate list; work out what a dead-probe gate is (they look
like instrumentation for code paths Anthropic believes are unreachable) and document the pattern - that is
a genuinely interesting, previously undocumented mechanism. The 2.1.193 tree's 46_todo_tasks/ is your base.`,
    minDocs: 1,
  },
  {
    group: 'C', dir: '54_remote_control', themes: 'remote_control',
    title: 'Remote Control deltas',
    docs: ['README.md only - one substantial doc'],
    seed: `Bullets across .196/.202/.203/.205/.207/.208/.211/.212/.218/.219: mid-turn crash recovery,
wrong permission mode shown, commands from mobile/web failing with 'Unknown command', uncaptioned
images/files dropped, task status lost on reconnect, desktop-hosted sessions not showing bg agents,
viewers joining after a permission prompt, stale fast-mode status after model switch/reconnect/failed org
check, 'session ready' push firing when Remote Control was not enabled, the base-URL restriction
('only available via api.anthropic.com' + naming the specific setting), /remote-control when logged out,
heartbeats after worker replacement, VSCode banner + settings toggle, full task state on membership change.
Grep 'Remote Control', 'remote_control', 'heartbeat', and the tengu_* remote gates in the diff file.`,
    minDocs: 1,
  },
  {
    group: 'B', dir: '55_auth_providers', themes: 'auth_providers',
    title: 'Authentication and provider plumbing',
    docs: [
      'login_and_credentials.md - login-expiry warning (5 -> 3 days), apiKeyHelper error surfacing within 3 attempts, parallel sessions logging out after wake-from-sleep on a shared credential store, Enterprise forceLoginMethod extension to VS Code/SDK/setup-token/install-github-app, feature flags stale after token rotation, gateway /login',
      'aws_and_provider_plumbing.md - Bedrock/Vertex/Foundry/Mantle/Claude-Platform-on-AWS: SSO credential churn, sso_region mismatch, awsCredentialExport and credential_process stall guards, awsAuthRefresh, the gateway provider channel and its new env vars',
      'transport_settings.md - mTLS/CA-bundle/OAuth-scope/proxy settings: ignored-with-a-warning in hosted sessions, honoured in Claude Desktop, in-place cert rotation, keep-alive pooling disabled after a stale-connection error',
    ],
    seed: `Bullets: .203/.219 login-expiry warning (5 -> 3 days), .208 apiKeyHelper errors surfaced within 3
attempts instead of ~10 silent retries, .211 parallel sessions all logging out after wake-from-sleep,
.212 Enterprise forceLoginMethod extended to VS Code/SDK/setup-token/install-github-app, .207 Bedrock SSO
credentials requested every request + .208 sso_region mismatch regression, .206 Bedrock awsCredentialExport
startup hang + .214 Windows credential_process 60s stall guard, .198 awsAuthRefresh for Claude Platform on
AWS/Mantle, .206 gateway /login for Anthropic-operated public gateway endpoints, .212/.207 mTLS/CA/OAuth
transport settings ignored with a warning in hosted sessions, .217 corporate mTLS in Claude Desktop,
.214 keep-alive pooling disabled after a stale-connection error, .211 feature flags stale after token rotation.
New env vars to chase: CLAUDE_CODE_USE_GATEWAY, CLAUDE_GATEWAY_ALLOW_LOOPBACK,
CLAUDE_CODE_USE_ANTHROPIC_GOOGLE_CLOUD (all in the new-env list). Coordinate with 47_models on provider ids
(they own the catalogue's provider_ids and alias resolution; you own auth, credential resolution, and transport).
SCOPING NOTE: this theme has 25 bullets and the .206-.210 slice alone rated SIX of them CARRYOVER - the
highest carryover density of any theme in the window. Expect to be writing "the mechanism already existed,
here is the one-line fix" repeatedly, and treat that as the finding.
CONFIRMED CARRYOVER from the scoping pass: awsAuthRefresh 220=10/193=10; anthropicAws count DROPPED 46->35
(the catalogue rewrite renamed it anthropic_aws - so .198's "added Claude Platform on AWS as an upstream
provider" is a RENAME plus server-side work, not an introduction).`,
    minDocs: 4,
  },
  {
    group: 'C', dir: '56_chrome_ide', themes: 'chrome_ide',
    title: 'Claude in Chrome and IDE integration deltas',
    docs: ['README.md only - one substantial doc'],
    seed: `Bullets: .198 Claude in Chrome GA, .211 file-upload path hardening + uploads from remote/CLI +
save_to_disk on screenshot actions actually writing the file + Windows setup pages + startup hang when the
extension is enabled but Chrome is not running, .199 repeatedly opening the reconnect page across
builds/config dirs, .210 late .claude/* symlink sandbox reconciliation is NOT yours,
.199 plan mode + browser tool calls is 05_plan_mode's, .211/.203 VSCode items, .198 /desktop after
worktree exit, .205 Cowork VM-mode local-agent login failure, .218 sandbox command restrictions for IDE
interactions. New gates: tengu_chrome_install_upsell{,_shown}, tengu_dead_probe_chrome_legacy_socket,
tengu_bridge_* family (the bridge is the Chrome/Cowork transport - work out its architecture).
Grep 'browser_batch', 'save_to_disk', 'chrome', 'bridge'.`,
    minDocs: 1,
  },
  {
    group: 'C', dir: '57_api_reliability', themes: 'api_reliability',
    title: 'API, streaming, and retry reliability deltas',
    docs: ['README.md only - one substantial doc'],
    seed: `Bullets: .196 streaming idle watchdog on by default for all providers (GROUND TRUTH: the literal
count DROPPED 4 -> 2, so frame it as removed gating), .199 retry-count changes (CLAUDE_CODE_RETRY_WATCHDOG
default 300 + lifting the 15 cap on CLAUDE_CODE_MAX_RETRIES - the literals are carryover, so grep the
NUMBERS), .199 SSL/TLS cert errors failing fast with a fix hint instead of burning retries, .199 mid-stream
overloaded/server errors keeping the partial with an incomplete-response notice, .199 transient 429s
retried for subscribers, .198 ECONNRESET retry, .214 'Socket is closed' behind Windows corporate proxies,
.208 HTTP/2 GOAWAY, .212 conversations with many images failing 'Request too large' + better message,
.212 web search/fetch returning 'API Error' as content + 529 retries, .212 prompt caching behind gateways,
.211 Bedrock/Vertex/Mantle/Foundry trailing-system-block billing regression, .208 Bedrock 'Truncated event
message received' naming the content-type, .218 the doomed-retry loop after context overflow with a large
thinking budget. Chase tengu_api_retry_after_too_long, tengu_effort_unsupported_retry,
tengu_convolute_arcades_retry{,_outcome,_tools} (an unexplained new retry family - work out what it is).`,
    minDocs: 1,
  },
]

const DOC_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['dir', 'files_written', 'anchors_verified', 'net_new_count', 'carryover_count', 'false_deltas_caught', 'not_covered', 'confidence', 'summary'],
  properties: {
    dir: { type: 'string' },
    files_written: { type: 'array', items: { type: 'string' } },
    anchors_verified: { type: 'number', description: 'how many cli_inner_pretty.js lines you personally READ in the 2.1.220 bundle' },
    net_new_count: { type: 'number' },
    carryover_count: { type: 'number' },
    false_deltas_caught: {
      type: 'array',
      description: 'changelog bullets that read as new but are carryover, with proof',
      items: {
        type: 'object', additionalProperties: false,
        required: ['bullet_gist', 'anchor', 'count_220', 'count_193'],
        properties: { bullet_gist: { type: 'string' }, anchor: { type: 'string' }, count_220: { type: 'number' }, count_193: { type: 'number' } },
      },
    },
    not_covered: { type: 'string', description: 'bullets in your theme you did NOT cover, and why - be honest' },
    confidence: { type: 'string', enum: ['HIGH', 'MEDIUM', 'LOW'] },
    summary: { type: 'string' },
  },
}

// args may arrive as an object OR as a JSON-encoded string; handle both, and accept a bare "B".
let parsedArgs = args
if (typeof parsedArgs === 'string') {
  const raw = parsedArgs.trim()
  if (raw === 'A' || raw === 'B' || raw === 'C') parsedArgs = { group: raw }
  else {
    try { parsedArgs = JSON.parse(raw) } catch (e) { parsedArgs = {} }
  }
}
const group = (parsedArgs && parsedArgs.group) || 'A'
const selected = MODULES.filter((m) => m.group === group)
log(`group ${group}: ${selected.length} module writers -> ${selected.map((m) => m.symbolSuffix || m.dir).join(', ')}`)
if (selected.length === 0) throw new Error(`no modules matched group "${group}" (args was ${JSON.stringify(args)})`)

phase('Write')

const results = await parallel(selected.map((m) => () => agent(
`You are a senior software reverse-engineering analyst producing deobfuscation documentation for
Claude Code v2.1.220. You own exactly one module directory and you write finished, publishable docs.

## Step 0 - MANDATORY reading (do this first, completely)
1. ${AN}/_CONVENTIONS.md               - bundles, citation rule, traps, doc format. Non-negotiable.
2. ${AN}/_GROUND_TRUTH_verified_anchors.md - hand-verified anchors + the false-delta trap list.
3. ${AN}/00_overview/_raw_asset_diff_193_to_220.md - the 326 new feature gates / new flags / new tools.
4. Your theme's rows in whichever of these scoping files are relevant (they cover the whole 579-bullet
   window, split by release range; each has a per-bullet anchor probe with 220/193 counts):
     ${AN}/00_overview/_scope_v195_199.md
     ${AN}/00_overview/_scope_v200_205.md
     ${AN}/00_overview/_scope_v206_210.md
     ${AN}/00_overview/_scope_v211_214.md
     ${AN}/00_overview/_scope_v215_220.md
   Grep them for your theme slug to find your bullets fast:  grep -n '${m.themes}' ${AN}/00_overview/_scope_*.md
   If a scoping file is missing, proceed without it and say so.
5. Skim one exemplar doc from the previous tree for FORMAT:
   /lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.193/analyze/38_permissions/classify_all_shell.md

## Step 1 - YOUR ASSIGNMENT
Directory:  ${AN}/${m.dir}/
Theme slug: ${m.themes}
Title:      ${m.title}

Write these documents (plus a README.md that indexes them and tells the window's story for this theme):
${m.docs.map((d, i) => `  ${i + 1}. ${d}`).join('\n')}

Minimum ${m.minDocs} files total including README.md. If a planned doc turns out to have too little
source substance, MERGE it into a sibling rather than padding it - and say so in the README.

### Seed anchors already verified for you (build on these; do not re-derive, but DO re-read each line you cite)
${m.seed}

## Step 2 - METHOD (this is what separates a good doc from a rejected one)
For every claim:
  T=/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js
  B=/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js
  grep -c 'literal' $T $B      # ALWAYS both, ALWAYS before you write the sentence
  grep -n 'literal' $T         # then Read the site with offset/limit and UNDERSTAND it
Then follow the code: read the function that contains the anchor, its callers, its constants, its gate.
A doc that only lists anchors is a failure. A doc that explains the MECHANISM and the DESIGN REASONING is
the deliverable. Use the depth template in _CONVENTIONS.md section 5.3 for every key algorithm/decision:
What it does / How it works (numbered) / Why this approach (rationale, alternatives, trade-offs) / Key insight.

Explain constants and thresholds (why this number?), ordering (why is this check first?), failure modes
(what happens on a bad value?), and who consumes the result. Include dual-version code snippets in the
exact format of _CONVENTIONS.md section 5.2 for the 3-8 most important functions in your module -
ORIGINAL must be verbatim from the 2.1.220 bundle.

Cross-validate against the v2.1.88 named TypeScript tree at /lyz/codespace/3rd/claude-code/src/ when it
helps recover a real identifier name or the original design intent - cite it as
\`3rd/claude-code/src/<path>\` and remember it is 132 versions stale, so it corroborates NAMES and INTENT,
never current behaviour.

## Step 3 - HONESTY REQUIREMENTS (graded strictly)
- Every changelog bullet in your theme must be accounted for: implemented-and-anchored, carryover,
  server-side, or unanchored. Put a per-bullet ledger table in your README (bullet | version | verdict |
  anchor | doc section). This is the single most useful artefact for a reader.
- If the code contradicts the changelog, say so explicitly and prove it. Ground truth 6.2 and 6.3 are
  worked examples of exactly this - discrepancies are findings, not embarrassments.
- Never present a carryover mechanism as an introduction. Prefer "this is carryover" when unsure.
- Do not invent a line number. If you did not read it in the 2.1.220 bundle, do not cite it.
- If you run out of budget before covering everything, cover the deepest items well and list the rest in
  the README's "Not covered" section. Partial-but-honest beats complete-but-fabricated.

## Step 4 - FORMAT COMPLIANCE (checked mechanically afterwards)
- Every doc ends with a \`## Related Symbols\` section in LIST format (_CONVENTIONS.md 5.1).
  NO \`| Obfuscated | Readable |\` tables anywhere in ${m.dir}/. NO section titled "Symbol Mapping
  Reference" or "Symbol Index Reference".
- Write ONE extra file: ${AN}/00_overview/symbol_additions_v2_1_220_${m.symbolSuffix || m.dir.replace(/^[0-9]+_/, '')}.md
  containing your symbol table(s) in the format of _CONVENTIONS.md section 6, grouped under
  \`## Module: <name>\` headings, with a header line naming which symbol_index_*.md file each group
  must be merged into. Every row needs a line number you actually read.
- English only. Relative links must have the right depth (from ${m.dir}/x.md the overview is ../00_overview/x.md).

## Step 5 - SELF-VERIFY before returning
Run these and fix anything they find:
  grep -rn '| Obfuscated' ${AN}/${m.dir}/          # must be empty
  grep -rln 'Related Symbols' ${AN}/${m.dir}/      # must list every .md you wrote
  grep -c '' ${AN}/${m.dir}/*.md                   # sanity-check sizes
Re-read 5 randomly chosen line citations from your own docs in the 2.1.220 bundle and confirm they say
what you claimed. Report the count you re-verified.

Write only inside ${AN}/${m.dir}/ and the one symbol_additions file. Return the structured result.`,
  { label: `mod:${m.symbolSuffix || m.dir}`, phase: 'Write', schema: DOC_SCHEMA },
)))

const ok = results.filter(Boolean)
log(`group ${group} done: ${ok.length}/${selected.length} modules`)
return {
  group,
  modules: ok,
  failed: selected.length - ok.length,
  all_false_deltas: ok.flatMap((r) => r.false_deltas_caught || []),
}
