# Cross-validation Register 2 — re-measurement of the 125 "verified net-new" anchors

**Scope:** every row of [`_false_delta_ledger.md` §2](_false_delta_ledger.md#2-verified-net-new-anchors).
**Method:** literal (`grep -F`, line-count semantics) against
`versions/2.1.220/extract/cli_inner_pretty.js` (T) and `versions/2.1.193/extract/cli_inner_pretty.js` (B),
plus a read of every cited 2.1.220 line in the live bundle.
**Default verdict was FAIL** — a row is `CONFIRMED_NET_NEW` only if the literal measured `220>0 / 193=0`
*and* the cited line contains it.

**Result: 125 rows tested. 107 CONFIRMED_NET_NEW. 18 defective rows** — 5 of them at the root
(3 `NOT_NET_NEW`, 2 unusable identifier anchors), 5 `MIS-FILED`, 6 wrong cited lines, 2 wrong counts.
Plus 3 duplicated anchors, so the register describes **122 unique anchors, not 125**.

> ⚠ **Register §2 does not meet its own stated criterion.** Its header claims all 125 rows are
> "confirmed `220>0 / 193=0`", but **7 rows are printed in the register with a non-zero 193 count**
> (`needs input` 6/3, OSC-52 2/1, `maxLifetimeShows` 6/3, skill `background` 3/2, user_abort 5/4,
> provider-naming 3/3, plugin-namespacing 3/1). Those rows were never net-new by the register's own
> numbers and must not be cited as introductions without a narrower literal.

---

## 1. Row-by-row measurement

Legend for **VERDICT**: `CONFIRMED_NET_NEW` · `NOT_NET_NEW` · `WRONG_LINE` (literal real, cited line
does not contain it) · `WRONG_ANCHOR` (identifier collision — count is meaningless) ·
`MIS-FILED` (193 ≠ 0, belongs in register §1) · `WRONG_COUNT`.
`m220/m193` = measured with `-F`.

### background_agents (22)

| Anchor | claimed 220/193 | measured 220/193 | line ok? | VERDICT | note |
|---|---|---|---|---|---|
| `tengu_bg_roster_orphan_pruned` | 1/0 | 1/0 | yes :330930 | CONFIRMED_NET_NEW | |
| `.orphaned-` | 1/0 | 1/0 | yes :51506 | CONFIRMED_NET_NEW | quarantine rename |
| `gh auth login for PR status` | 1/0 | 1/0 | yes :316038 | CONFIRMED_NET_NEW | |
| `tengu_bg_handoff_settle` | 1/0 | 1/0 | yes :869956 | CONFIRMED_NET_NEW | |
| `shipping is part of the task` | 1/0 | 1/0 | yes :507957 | CONFIRMED_NET_NEW | |
| `gh pr create --draft` | 2/0 | 2/0 | yes :224098 | CONFIRMED_NET_NEW | 2nd site :507957 |
| `tengu_bg_daemon_macos_aqua_wrap` | 1/0 | 1/0 | yes :679939 | CONFIRMED_NET_NEW | `jjb()` called from :679835 — reachable |
| `tengu_bg_respawn_suppressed` | 2/0 | 2/0 | yes :554662 | CONFIRMED_NET_NEW | |
| `-(?:dev\|engine)\.(\d{8})\.t(\d{6})` | 1/0 | 1/0 | yes :552455 | CONFIRMED_NET_NEW | |
| `CLAUDE_CODE_RESUME_INTERRUPTED_TURN_MAX_AGE_MS` | 6/0 | 6/0 | yes :320147 | CONFIRMED_NET_NEW | |
| `tengu_resume_stale_turn_suppressed` | 1/0 | 1/0 | yes :320211 | CONFIRMED_NET_NEW | |
| `tengu_resume_interrupted_turn` | 2/0 | 2/0 | yes :320161 | CONFIRMED_NET_NEW | |
| `kern.memorystatus_vm_pressure_level` | 1/0 | 1/0 | yes :552638 | CONFIRMED_NET_NEW | |
| `so the work carries over` | 1/0 | 1/0 | yes :413946 | CONFIRMED_NET_NEW | |
| `unlinked reparse point before removal` | 1/0 | 1/0 | yes :224251 | CONFIRMED_NET_NEW | |
| `evict: v.boolean().optional()` | 1/0 | 1/0 | yes :330157 | CONFIRMED_NET_NEW | producer exists (:680764/:680767/:681125) — **not** dead |
| `f.delete(A.short), A.evict` | 1/0 | 1/0 | yes :679374 | CONFIRMED_NET_NEW | |
| `extensions.worktreeConfig` | 4/0 | 4/0 | yes :225915 | CONFIRMED_NET_NEW | |
| `tengu_slash_command_unavailable` | 2/0 | 2/0 | yes :806776 | CONFIRMED_NET_NEW | `unavailable_in_agent_view` is at :806780 (1 hit), `/model` carve-out at :806788 as stated |
| `removeAgentWorktree: git no longer recognizes` | 2/0 | 2/0 | yes :225854 | CONFIRMED_NET_NEW | |
| `tengu_fleet_nudge_state` | 1/0 | 1/0 | yes :749960 | CONFIRMED_NET_NEW | `fleet_needs_input_nudge` = 2/0 at :749921/:749971 |
| `"needs input" park message for /install-github-app` | 6/3 | 6/3 | yes :701705 | **MIS-FILED** | `needs input` exists 3× in 193 (:416813/:416821/:481091). Net-new literal is `while no terminal is attached to this background session` **6/0** |

### permissions (14)

| Anchor | claimed 220/193 | measured 220/193 | line ok? | VERDICT | note |
|---|---|---|---|---|---|
| `indicator: "manual mode"` | 1/0 | 1/0 | yes :58499 | CONFIRMED_NET_NEW | mode-label table `dWl` :58495 |
| `session_transcript_tampering` | 1/0 | 1/0 | yes :345225 | CONFIRMED_NET_NEW | member of the classifier-category array |
| `tengu_settings_auto_mode_rules_untrusted_source_ignored` | 1/0 | 1/0 | yes :63563 | CONFIRMED_NET_NEW | |
| `deferred_non_interactive` | 3/0 | 3/0 | yes :455663 | CONFIRMED_NET_NEW | |
| `tengu_uncompilable_ignore_pattern` | 1/0 | 1/0 | yes :224144 | CONFIRMED_NET_NEW | |
| `too many to analyze for catastrophic removals` | 1/0 | 1/0 | yes :394329 | CONFIRMED_NET_NEW | |
| `hookAskFloor` | 3/0 | 3/0 | yes :400915 | CONFIRMED_NET_NEW | consumed at :513734 — reachable |
| `revocation-resurrecting legacy overlay` | 1/0 | 1/0 | yes :224977 | CONFIRMED_NET_NEW | |
| `r.includes("/") \|\| !t` | 1/0 | 1/0 | yes :528459 | CONFIRMED_NET_NEW | |
| `Close-fd redirect is followed by a word` | 2/0 | 2/0 | yes :210595 | CONFIRMED_NET_NEW | 2nd site :210636 |
| `Command too long for read-only analysis` | 1/0 | 1/0 | yes :392119 | CONFIRMED_NET_NEW | |
| `zsh $name[expr] / $name:mod in [[ ]] operand` | 1/0 | 1/0 | yes :210371 | CONFIRMED_NET_NEW | |
| `"--connection" / "--identity"` (hYr) | 1/0 | 1/0 each | yes :213939 | CONFIRMED_NET_NEW | `"--identity"` is on :213940 |
| `circuitBreaker: "suspiciousWindowsPath"` | 1/0 | 1/0 | yes :528321 | CONFIRMED_NET_NEW | live branch in `ylt()` :528312 |

### subagent_limits (12)

| Anchor | claimed 220/193 | measured 220/193 | line ok? | VERDICT | note |
|---|---|---|---|---|---|
| `The /agents wizard has been removed.` | 1/0 | 1/0 | yes :500583 | CONFIRMED_NET_NEW | |
| `AgentApiErrorTerminationError` | 1/0 | 1/0 | yes :346387 | CONFIRMED_NET_NEW | msg string is at :346385 |
| `PARTIAL output recovered from the agent` | 1/0 | 1/0 | yes :345902 | CONFIRMED_NET_NEW | |
| `tengu_agent_worktree_cwd_escape_blocked` (.203) | 4/0 | 4/0 | yes :314164 | CONFIRMED_NET_NEW | **duplicate of the .216 row below** |
| `harness: subagent output matched instruction-shaped pattern(s):` | 1/0 | 1/0 | yes :345393 | CONFIRMED_NET_NEW | |
| `A repository-committed symlink at .claude, …` | 1/0 | 1/0 | yes :224564 | CONFIRMED_NET_NEW | |
| `CLAUDE_CODE_MAX_SUBAGENTS_PER_SESSION` | 4/0 | 4/0 | yes :231403 | CONFIRMED_NET_NEW | |
| `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION` | 4/0 | 4/0 | yes :231406 | CONFIRMED_NET_NEW | |
| `tengu_agent_worktree_cwd_escape_blocked` (.216) | 4/0 | 4/0 | yes :314164 | CONFIRMED_NET_NEW | same anchor, same line as the .203 row — register has **124 unique anchors, not 125** |
| `"GIT_WORK_TREE"` env scrub | 2/0 | 2/0 (unquoted) | yes :312758 | CONFIRMED_NET_NEW | quoted form is 1/0; 2nd site :225619 |
| `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` | 3/0 | 3/0 | **no** | **WRONG_LINE** | cited :231411 is `gty = 20`; env var is at **:231400** (`gPu()` :231399) |
| `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` | 3/0 | 3/0 | **no** | **WRONG_LINE** | cited :230906 is `var ZDu = 3`; env var is at **:230897** (`hee()` :230896); gate `tengu_hazel_trellis` at :230907 |

### accessibility_ui (10)

| Anchor | claimed 220/193 | measured 220/193 | line ok? | VERDICT | note |
|---|---|---|---|---|---|
| `CLAUDE_CODE_DISABLE_MOUSE_CLICKS` | 3/0 | 3/0 | yes :164999 | CONFIRMED_NET_NEW | |
| `no microphone` | 1/0 | 1/0 | yes :496027 | CONFIRMED_NET_NEW | |
| `LC_TERMINAL === "iTerm2" \|\| Z.TERM_PROGRAM === "Apple_Terminal"` | 1/0 | 1/0 (compound) | yes :261059 | CONFIRMED_NET_NEW | **fragile**: the sub-literal `LC_TERMINAL === "iTerm2"` alone is **4/3** and `TERM_PROGRAM === "Apple_Terminal"` is **5/4**. Only the compound predicate is new |
| `screenReader: l` | 4/0 | 4/0 | yes :635795 | CONFIRMED_NET_NEW | |
| `stripVTControlCharacters` | 5/0 | 5/0 | yes :545755 | CONFIRMED_NET_NEW | |
| `tengu_left_arrow_editing_guard` | 1/0 | 1/0 | yes :559928 | CONFIRMED_NET_NEW | gate default `!0` |
| `CLAUDE_AX_STARTUP_QUIET_MS` | 2/0 | 2/0 | yes :156240 | CONFIRMED_NET_NEW | |
| `emojiCompletionEnabled` + shortcodes + telemetry | 2/0 | 2/0 | yes :746222 | CONFIRMED_NET_NEW | `heart_eyes` is at :745115/:745116, `input_emoji_completion` = 3/0 at :746468/:746750/:746899 — not at the cited line |
| `jXs()` screen-reader announce mapper | 4/0 | **4/3** | no (fn at :559690) | **WRONG_ANCHOR** | 2.1.193 also has a `jXs` — the vendored `__exportStar` helper at 193:106549. Identifier collision, exactly the §1 `yBc` trap. Re-anchor on `cVr("deleted")` = **1/0** at :559693 |
| OSC-52 GNU screen DCS passthrough | 2/1 | 2/1 | yes :216158 | **MIS-FILED** | 193 has 1 (:156014); only the 2nd emit mode is new |

### tools (10)

| Anchor | claimed 220/193 | measured 220/193 | line ok? | VERDICT | note |
|---|---|---|---|---|---|
| `send_message_pin_guard` | 2/0 | 2/0 | yes :418478 | CONFIRMED_NET_NEW | prose half at :418479 (1 hit) |
| `askUserQuestionTimeout` | 9/0 | 9/0 | yes :61218 | CONFIRMED_NET_NEW | wired to config panel :451891-:451902 |
| `a model-supplied worktree outside .claude/worktrees/` | 1/0 | 1/0 | yes :406441 | CONFIRMED_NET_NEW | ledger writes the path in parens; real text has no parens |
| `No entries at this offset` | 3/0 | 3/0 | yes :312208 | CONFIRMED_NET_NEW | |
| `ripgrep spawn blocked: null byte` | 3/0 | 3/0 | yes :204180 | CONFIRMED_NET_NEW | |
| `multiple hard links, which can alias a file…` | 2/0 | 2/0 (short form) | yes :514282 | CONFIRMED_NET_NEW | full sentence is 1/0; 2nd hit of `multiple hard links` is :844683 |
| `pkill: refusing to run…` | 1/0 | 1/0 | yes :313526 | CONFIRMED_NET_NEW | |
| `PYTHONIOENCODING: "utf-8:surrogateescape", NO_COLOR: "1"` | 1/0 | 1/0 | yes :169575 | CONFIRMED_NET_NEW | but the parenthetical literal is wrong — see defect D9 |
| `The user answered: …` | 1/0 | 1/0 | yes :323485 | CONFIRMED_NET_NEW | |
| `tengu_repair_double_escaped_unicode` | 1/0 | 1/0 | yes :508476 | CONFIRMED_NET_NEW | **same anchor is filed again under workflow/.202** — conflicting release attribution |

### skills_plugins (8)

| Anchor | claimed 220/193 | measured 220/193 | line ok? | VERDICT | note |
|---|---|---|---|---|---|
| `tengu_stacked_slash_commands` | 1/0 | 1/0 | yes :343685 | CONFIRMED_NET_NEW | |
| `claude agents --plugin-dir` | 1/0 | **2/1** | yes :865022 | **NOT_NET_NEW** | 193:718546 has the identical `clearPluginCache("claude agents --plugin-dir")` call. See defect D1 |
| `pluginUsageLspGraceAppliedIds` | 3/0 | 3/0 | yes :214905 | CONFIRMED_NET_NEW | |
| `a5g = ["userSettings", "flagSettings", "policySettings"]` | 1/0 | **5/1** | yes :191083 | **NOT_NET_NEW** | 193:386042 is `JWp = ["userSettings", "flagSettings", "policySettings"]` — same array, re-mangled name. See defect D2 |
| `plugin hook references ${user_config.*} in shell-form command` | 1/0 | 1/0 | yes :519971 | CONFIRMED_NET_NEW | |
| `maxLifetimeShows: 3` | 6/3 | 6/3 (field) · 2/0 (`: 3`) | yes :815597 | **MIS-FILED** | the field is carryover (193 :682407/:682621/:682654, value 5). Only the two value-3 tips (:815512, :815597) are new |
| `qde()` frontmatter boolean coercer | 1/0 | **1/1** | yes :158204 | **WRONG_ANCHOR** | 193:599415 is a different `function qde(e)` (a message-prefix predicate). Identifier collision. Re-anchor on the coercer body (`if (Yt(t)) return !0;` :158208) or its wrapper `otr` :158201 |
| skill frontmatter `background` field | 3/2 | 1/0 for `Forks run as background agents` | yes :157797 | **MIS-FILED** | `context: fork` is 3/2 — carryover. Net-new literal is ``Only for `context: fork` `` **1/0** |

### hooks (5)

| Anchor | claimed 220/193 | measured 220/193 | line ok? | VERDICT | note |
|---|---|---|---|---|---|
| `See CHANGELOG v2.1.195` | 1/0 | 1/0 | yes :520215 | CONFIRMED_NET_NEW | |
| `/^[a-zA-Z0-9_\|, -]+$/` | 2/0 | 2/0 | yes :520221 | CONFIRMED_NET_NEW | 2nd site :520198 |
| `CLAUDE_RUNNER_ACTIVITY_FD` | 3/0 | 3/0 | **no** | **WRONG_LINE** | cited :840836; literal is at **:840835** |
| `hook callback timed out after` | 1/0 | 1/0 | yes :520743 | CONFIRMED_NET_NEW | |
| `DirectoryAdded` | 20/0 | 20/0 | yes :49396 | CONFIRMED_NET_NEW | fully wired (emit :518818, dispatch :520412, SDK schema :835980) |

### mcp (5)

| Anchor | claimed 220/193 | measured 220/193 | line ok? | VERDICT | note |
|---|---|---|---|---|---|
| `url_missing_type` | 2/0 | 2/0 | yes :282631 | CONFIRMED_NET_NEW | |
| `omitted from roots/list` | 2/0 | 2/0 | yes :293424 | CONFIRMED_NET_NEW | 2nd copy :298966 is the duplicated MCP module (see §1 of the ledger) |
| `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS` | 3/0 | 3/0 | **no** | **WRONG_LINE** | cited :288857 is the `CLAUDE_AUTO_BACKGROUND_TASKS` guard; the env var is at **:288858**. `tengu_mcp_auto_background` = 1/0 at :288860, `tengu_mcp_tool_auto_backgrounded` = 1/0 at :288896 (not 3) |
| `MCP policy predicate references environment variable(s)…` | 2/0 | 2/0 | yes :281949 | CONFIRMED_NET_NEW | |
| `Leading or trailing whitespace in: ` | 1/0 | 1/0 | yes :282659 | CONFIRMED_NET_NEW | |

### performance (5)

| Anchor | claimed 220/193 | measured 220/193 | line ok? | VERDICT | note |
|---|---|---|---|---|---|
| `highWaterMark: 4194304` | 1/0 | 1/0 | yes :540228 | CONFIRMED_NET_NEW | |
| `(r ?? mM(e))` | 1/0 | 1/0 | yes :513296 | CONFIRMED_NET_NEW | |
| `let r = mM(t);` | 1/0 | 1/0 | yes :425005 | CONFIRMED_NET_NEW | |
| `more ${Et(e, "row")} not shown` | 1/0 | 1/0 | yes :636279 | CONFIRMED_NET_NEW | |
| `didClose for evicted document` | 3/0 | 3/0 | yes :307185 | CONFIRMED_NET_NEW | |

### auth_providers (4)

| Anchor | claimed 220/193 | measured 220/193 | line ok? | VERDICT | note |
|---|---|---|---|---|---|
| `api_request_api_key_helper_failed` | 1/0 | 1/0 | yes :534688 | CONFIRMED_NET_NEW | |
| `tengu_oauth_token_refresh_lock_compromised_pre_post` | 1/0 | 1/0 | yes :155352 | CONFIRMED_NET_NEW | |
| `skipping settings-sourced NODE_EXTRA_CA_CERTS under host-managed provider` | 1/0 | 1/0 | yes :825529 | CONFIRMED_NET_NEW | |
| `tff = 3 * rff` | 2/0 | **1/0** | yes :687512 | WRONG_COUNT | bare `tff` is **4/2** (193 has an unrelated `tff` at :483395/:483454) — do not use the bare identifier. `refreshTokenExpiresAt` = 8/0 is the safe anchor |

### telemetry (4)

| Anchor | claimed 220/193 | measured 220/193 | line ok? | VERDICT | note |
|---|---|---|---|---|---|
| `OTLP request body chunk is not string or Uint8Array` | 1/0 | 1/0 | **no** | **WRONG_LINE** | cited :494964 is the `content-length` test; the throw is at **:494957** (`XKd()` :494953) |
| `CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH` | 2/0 | 2/0 | yes :167274 | CONFIRMED_NET_NEW | |
| `traceparent: Z.TRACEPARENT` | 2/0 | 2/0 | yes :167351 | CONFIRMED_NET_NEW | |
| `logDecision({ decision: "reject", source: { type: "user_abort" } })` | 5/4 | **1/1** | yes :395797 | **NOT_NET_NEW** | 193:427383-427386 is byte-identical, same `case "cancelled":` branch. See defect D3 |

### models (3)

| Anchor | claimed 220/193 | measured 220/193 | line ok? | VERDICT | note |
|---|---|---|---|---|---|
| `Org default` | 2/0 | 2/0 | yes :111167 | CONFIRMED_NET_NEW | 2nd site :120004 |
| `claude-sonnet-5` | 35/0 | 35/0 | yes :14177 | CONFIRMED_NET_NEW | |
| `claude-opus-5` | 42/0 | 42/0 | yes :14365 | CONFIRMED_NET_NEW | |

### remote_control (3)

| Anchor | claimed 220/193 | measured 220/193 | line ok? | VERDICT | note |
|---|---|---|---|---|---|
| `does not point at api.anthropic.com` | 1/0 | 1/0 | yes :535671 | CONFIRMED_NET_NEW | |
| `background_tasks_changed` | 11/0 | 11/0 | **no** | **WRONG_LINE** | cited :837673 is the `tasks` array; the literal is at **:837671** |
| Remote Control provider-naming chain | 3/3 | 3/2 | yes :535665 | **MIS-FILED** | :535643 and :535647 are byte-identical to 193:603899/:603903. Only **:535665** (`${pJt[e]} is set, so this session is using` = **1/0**) is new |

### slash_cli (3)

| Anchor | claimed 220/193 | measured 220/193 | line ok? | VERDICT | note |
|---|---|---|---|---|---|
| `--bg and --print conflict` | 1/0 | 1/0 | yes :683498 | CONFIRMED_NET_NEW | |
| `=== "daemon" ? e.slice(t + 1) : null` | 1/0 | 1/0 | yes :133 | CONFIRMED_NET_NEW | |
| `full setup checkup` | 1/0 | 1/0 | yes :585327 | CONFIRMED_NET_NEW | |

### system_prompt (3)

| Anchor | claimed 220/193 | measured 220/193 | line ok? | VERDICT | note |
|---|---|---|---|---|---|
| `launched you` | 1/0 | 1/0 | yes :507936 | CONFIRMED_NET_NEW | |
| `No human input has been received` | 1/0 | 1/0 | yes :226519 | CONFIRMED_NET_NEW | |
| `isHumanTypedPrompt` | 2/0 | 2/0 | yes :516671 | CONFIRMED_NET_NEW | 2nd site :652560 |

### workflow (3)

| Anchor | claimed 220/193 | measured 220/193 | line ok? | VERDICT | note |
|---|---|---|---|---|---|
| `workflowSizeGuideline` (.202) | 21/0 | 21/0 | yes :60914 | CONFIRMED_NET_NEW | |
| `tengu_repair_double_escaped_unicode` (.202) | 1/0 | 1/0 | yes :508476 | CONFIRMED_NET_NEW | **duplicate** of the tools/.218 row — same literal, same line, two different release attributions |
| `workflowSizeGuideline` / `tko` / `cEd` (.219) | 21/0 | `tko` 1/0, `cEd = "medium"` 1/0 (:389143) | yes :389147 | WRONG_COUNT | the 21 is `workflowSizeGuideline`'s count carried onto a different literal; also duplicates the .202 row |

### api_reliability (2)

| Anchor | claimed 220/193 | measured 220/193 | line ok? | VERDICT | note |
|---|---|---|---|---|---|
| `ERR_STREAM_PREMATURE_CLOSE` | 1/0 | 1/0 | yes :540251 | CONFIRMED_NET_NEW | |
| `ERR_HTTP2_GOAWAY_SESSION` | 1/0 | 1/0 | yes :165078 | CONFIRMED_NET_NEW | `streamRejectedByGoawaySession` = 1/0 at :165081 |

### auto_memory (2)

| Anchor | claimed 220/193 | measured 220/193 | line ok? | VERDICT | note |
|---|---|---|---|---|---|
| `over its ${r.capDesc} read limit` | 1/0 | 1/0 | yes :434076 | CONFIRMED_NET_NEW **(string only)** | ⚠ the *mechanism* is carryover — 193:455251-455253 already says `over the ${n.capDesc} read limit` with `Nof = 0.8` at 193:455255. `read limit` alone is **1/2**. Do not write this up as the introduction of the MEMORY.md size cap |
| `splicedSizeBytes` / `spliceActive` | 3/0 | 3/0 each | yes :434116 | CONFIRMED_NET_NEW | `spliceActive` at :434052/:434118/:434169 |

### code_review (2)

| Anchor | claimed 220/193 | measured 220/193 | line ok? | VERDICT | note |
|---|---|---|---|---|---|
| `tengu_review_remote_precondition_recovery` | 13/0 | 13/0 | yes :496656 | CONFIRMED_NET_NEW | |
| `no_merge_base_empty_tree_fallback` / `empty_tree_bundle` | 1/0 · 6/0 | 1/0 · 6/0 | yes :497365 | CONFIRMED_NET_NEW | |

### headless_sdk (2)

| Anchor | claimed 220/193 | measured 220/193 | line ok? | VERDICT | note |
|---|---|---|---|---|---|
| `scaleBudgetToQueue` / `drainStdoutBeforeExit` | 3/0 | 3/0 · **1/0** | yes :20552 | CONFIRMED_NET_NEW | the 3 is `scaleBudgetToQueue`'s; `drainStdoutBeforeExit` appears once (export map :20513 → `jzt`) |
| `mcp_server_errors` | 3/0 | 3/0 | yes :836952 | CONFIRMED_NET_NEW | |

### sandbox (2)

| Anchor | claimed 220/193 | measured 220/193 | line ok? | VERDICT | note |
|---|---|---|---|---|---|
| `getOrClassify` | 4/0 | 4/0 | yes :809580 | CONFIRMED_NET_NEW | callers :809812/:822244/:842906 |
| `Resolved symlinked deny path` | 1/0 | 1/0 | yes :193923 | CONFIRMED_NET_NEW | |

### agent_team (1)

| Anchor | claimed 220/193 | measured 220/193 | line ok? | VERDICT | note |
|---|---|---|---|---|---|
| `reserved for plugin namespacing` | 3/1 | **2/0** | yes :269872 | CONFIRMED_NET_NEW (**both counts wrong**) | 193 = **0**, not 1; 220 = 2 (:269872, :269957). The row understated itself and was filed as if carryover-tainted |

---

## 2. Defects found — must change in the tree

Ordered by severity. Every line number below was read in the 2.1.220 or 2.1.193 bundle during this pass.

### D1 — `claude agents --plugin-dir` is NOT net-new (root defect)
- Ledger row: `_false_delta_ledger.md:207` (skills_plugins, 2.1.200, claims 1/0).
- Measured: **220 = 2 / 193 = 1**.
- 2.1.193 site: `cli_inner_pretty.js(193):718546` — `(I(r.config.pluginDir), k(r.config.pluginDirNoMcp), R("claude agents --plugin-dir"));`
- 2.1.220 site: `cli_inner_pretty.js:865022` — same call shape, re-mangled identifiers (`lNr`/`cNr`/`QI`).
- The inline-plugin-dir path for `claude agents` shipped **before** 2.1.200. Any module doc presenting
  `--plugin-dir` as a 2.1.200 addition is a false delta. The 2nd 220 hit (:872437) is the commander flag decl.

### D2 — `a5g = ["userSettings", "flagSettings", "policySettings"]` is NOT net-new (root defect)
- Ledger row: `_false_delta_ledger.md:209` (skills_plugins, 2.1.207, claims 1/0).
- Measured on the array literal: **220 = 5 / 193 = 1**.
- 2.1.193 site: `cli_inner_pretty.js(193):386042` — `JWp = ["userSettings", "flagSettings", "policySettings"];`
- 2.1.220 site: `cli_inner_pretty.js:191083` — `a5g = ["userSettings", "flagSettings", "policySettings"];`
- Only the **identifier** `a5g` is new (`a5g` greps 3/0). This is the identifier-remangle trap the ledger's
  own §1 preamble warns about, committed inside §2. The settings-source triple is carryover.

### D3 — `logDecision({decision:"reject", source:{type:"user_abort"}})` is NOT net-new (root defect)
- Ledger row: `_false_delta_ledger.md:261` (telemetry, 2.1.216, claims 5/4 — already not 193=0).
- Measured on the exact construct: **220 = 1 / 193 = 1**.
- 2.1.220 `:395796-395799` and 2.1.193 `:427383-427386` are byte-identical, both inside `case "cancelled":`
  immediately after `logCancelled()`. The `user_abort` source type is 5/4 overall.
- Nothing about the cancelled-branch decision logging is a 2.1.216 delta. Re-scope or drop the row.

### D4 — `jXs` anchor is an identifier collision (accessibility_ui)
- Ledger row: `_false_delta_ledger.md:184` (claims 4/0).
- Measured: **220 = 4 / 193 = 3**. 2.1.193's `jXs` is the vendored `__exportStar` helper
  (`cli_inner_pretty.js(193):106549`, exported at 193:106726) — unrelated to accessibility.
- The 2.1.220 construct **is** new (`function jXs(e, t)` at `:559690`, callers `:559805/:559809/:559821`),
  but the anchor as written reproduces the `yBc` failure. Replace with `cVr("deleted")` (**1/0**, `:559693`).

### D5 — `qde()` anchor is an identifier collision (skills_plugins)
- Ledger row: `_false_delta_ledger.md:212` (claims 1/0).
- Measured on `function qde(`: **220 = 1 / 193 = 1**. 2.1.193:599415 is a *different* `qde(e)` — a
  `startsWith("<tag>")` message-prefix predicate. The 2.1.220 boolean coercer at `:158204` is genuinely new,
  but the count is false. Re-anchor on the coercer body or on `otr()` at `:158201`.

### D6 — `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` cited line is wrong
- Ledger row: `_false_delta_ledger.md:169` cites `:231411`, which is `gty = 20,`.
- The env var is at **`:231400`** inside `function gPu()` (`:231399`). Constants `gty=20 / yty=200 / _ty=200`
  are at `:231411-231413`.

### D7 — `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` cited line is wrong
- Ledger row: `_false_delta_ledger.md:170` cites `:230906`, which is `var ZDu = 3,`.
- The env var is at **`:230897`** inside `function hee()` (`:230896`); `sty = "tengu_hazel_trellis"` at `:230907`,
  `Dus = null` cache at `:230908`.

### D8 — three more wrong cited lines
- `CLAUDE_RUNNER_ACTIVITY_FD` — `_false_delta_ledger.md:221` cites `:840836`; literal is at **`:840835`**.
- `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS` — `_false_delta_ledger.md:231` cites `:288857` (which is the
  `CLAUDE_AUTO_BACKGROUND_TASKS` guard); literal is at **`:288858`**.
- `OTLP request body chunk is not string or Uint8Array` — `_false_delta_ledger.md:258` cites `:494964`;
  the `throw TypeError(...)` is at **`:494957`**.
- `background_tasks_changed` — `_false_delta_ledger.md:276` cites `:837673`; literal is at **`:837671`**.

### D9 — unusable literal in the PYTHONIOENCODING row
- `_false_delta_ledger.md:198` gives `$PSDefaultParameterValues['Out-File:Encoding']='utf8' @169565`.
  As written that greps **0/0** — the real text at `:169565` has spaces:
  `$PSDefaultParameterValues['Out-File:Encoding'] = 'utf8'`. The row's primary anchor (`:169575`) is fine.

### D10 — the register contains duplicates, so it is 122 unique anchors, not 125
- `tengu_agent_worktree_cwd_escape_blocked` `:314164` appears twice (`:162` under 2.1.203 and `:167` under 2.1.216).
- `tengu_repair_double_escaped_unicode` `:508476` appears twice (`:200` tools/2.1.218 and `:300` workflow/2.1.202)
  — with **contradictory release attributions**; at most one can be right.
- `workflowSizeGuideline` (21/0) appears twice (`:299` under 2.1.202, `:301` under 2.1.219).

### D11 — six rows carry a non-zero 193 count inside a "193 = 0" register
`_false_delta_ledger.md:134` (needs input 6/3), `:185` (OSC-52 2/1), `:211` (maxLifetimeShows 6/3),
`:213` (skill `background` 3/2), `:261` (user_abort 5/4), `:277` (provider-naming 3/3).
Narrow replacements verified this pass:
- needs input → `while no terminal is attached to this background session` **6/0** (`:701705`)
- maxLifetimeShows → `maxLifetimeShows: 3` **2/0** (`:815512`, `:815597`); 193 uses value 5 (193:682621/:682654)
- skill background → ``Only for `context: fork` `` **1/0** (`:157797`); `context: fork` itself is 3/2
- provider-naming → `${pJt[e]} is set, so this session is using` **1/0** (`:535665`)

### D12 — auto_memory read-limit row overstates the delta
`_false_delta_ledger.md:314`. The 2.1.220 string at `:434076` is new (reworded), but the feature is not:
2.1.193 `:455251-455253` already emits `over the ${n.capDesc} read limit` / `approaching the ${n.capDesc} read limit`
with the same 0.8 threshold (193 `Nof = 0.8` at `:455255`). Only the wording plus the
"write succeeded, everything past the limit is silently dropped" clause is a 2.1.210 delta.

### D13 — miscellaneous count corrections (cosmetic, but the tree quotes these)
- `reserved for plugin namespacing`: 2/0, not 3/1 (`_false_delta_ledger.md:342`).
- `tff = 3 * rff`: 1/0, not 2/0; bare `tff` is 4/2 (`:252`).
- `drainStdoutBeforeExit`: 1/0, not 3/0 (`:328`).
- `tengu_mcp_auto_background`: 1/0 and `tengu_mcp_tool_auto_backgrounded`: 1/0, not 3 (`:231`).
- `tko` / `cEd = "medium"`: 1/0 each, not 21/0 (`:301`).
- `input_emoji_completion`: 3/0, not 2/0 (`:183`).

---

## 3. Shipped-but-dead / reachability findings

**No new dead-on-arrival code was found among the 125 anchors.** Every single-site anchor I traced is
reachable. The traces that could plausibly have been dead, and were not:

| Anchor | Why it could look dead | Reachability evidence |
|---|---|---|
| `evict: v.boolean().optional()` `:330157` + `A.evict` consumer `:679374` | wire-schema field with no obvious producer | producer chain exists: `:680764` `o = r?.evict ? !0 : void 0` → `:680767` / `:680769` `tT({ proto: Um, op: "kill", short: e, handoff: n, evict: o })`, and `:681125` passes `{ …, evict: !0 }` |
| `jXs()` `:559690` | function decl only | called at `:559805`, `:559809`, `:559821` (kill-line / kill-word handlers) |
| `drainStdoutBeforeExit` (`jzt`) `:20552` | appears once as an export-map entry | called with `scaleBudgetToQueue` at `:522216` and `:840582` |
| `tff = 3 * rff` `:687512` | module-init assignment | consumed by `$xr()` at `:687502`/`:687504` |
| `tengu_bg_daemon_macos_aqua_wrap` `:679939` | probe helper | `jjb()` (`:679917`) called from `:679835` under `Mt() === "macos"` |
| `hookAskFloor` `:400915` | producer-only string | read at `:513734` (`r.hookAskFloor === !0`) and drives the `:513738` branch |
| `askUserQuestionTimeout` `:61218` | settings-schema field | full config-panel row `:451890-:451903`, persisted via `yi("userSettings", …)` `:451900` |
| `DirectoryAdded` `:49396` | new hook event | emit `:518818`, executor `a2t` `:519444`/`:519508`, dispatch `case "DirectoryAdded"` `:520412`, SDK schema `:835980`, add-dir surface `:655141-:655162` / `:847258-:847263` |
| `circuitBreaker: "suspiciousWindowsPath"` `:528321` | one-shot classifier verdict | inside the live loop of `ylt()` `:528312-:528322` |

**One conditional-inertness worth recording (not dead, but off by default in a whole mode):**
`getMcpAutoBackgroundMs` (`SEy`, `:288854`) returns **0** — i.e. MCP auto-backgrounding is disabled —
whenever `isNonInteractiveSession` is true and `CLAUDE_AUTO_BACKGROUND_TASKS` is unset (`:288857`).
So the 2.1.212 MCP auto-background feature is inert for headless/SDK sessions unless that env var is set.
The interactive path is live: `:288860` `Ke("tengu_mcp_auto_background", !0)` defaults the gate to true.

**Re-confirmation of the two known DOA patterns** (both re-read this pass, both still dead in 2.1.220):
- `cqt = null` at `:757708` is the only assignment to `cqt`; all other occurrences
  (`:757198`, `:757199`, `:757303`, `:757304`, `:757364`, `:757377`, `:757379`) are `cqt !== null` reads or
  member accesses behind such a read. The remote reply-channel telemetry inside those guards
  (`tengu_remote_reply_channel_init` `:757204`/`:757208`, `tengu_remote_reply_channel_frame` `:757388`,
  `tengu_remote_subagent_frame_nested` `:757401`) can never fire.
- `qlE = {}` at `:833753` is the only assignment; `rTm(e = qlE)` (`:833732`) hits
  `if (!Object.hasOwn(e, r)) return !0` at `:833737` for every model, so the alias migration and its
  `tengu_alias_migration` event (`:833743`) are unreachable in this build.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](symbol_index_infra_integration.md) - Integrations

Key functions and identifiers referenced in this document:

- `screenReaderAnnounceEdit` (`jXs`, :559690) - screen-reader deletion/typed-char announce mapper; collides with 2.1.193's vendored `__exportStar` alias of the same name
- `announceToScreenReader` (`cVr`, :156250) - the announce sink `jXs` calls; `cVr("deleted")` at :559693 is the safe net-new anchor
- `coerceFrontmatterBoolean` (`qde`, :158204) - yes/no/on/off/1/0 coercer; collides with an unrelated 2.1.193 `qde` message-prefix predicate at 193:599415
- `frontmatterBooleanOrFalse` (`otr`, :158201) - wrapper returning `qde(e) ?? !1`
- `settingsSourcesForPluginResolution` (`a5g`, :191083) - carryover array, renamed from 2.1.193's `JWp`
- `getMcpAutoBackgroundMs` (`SEy`, :288854) - returns 0 for non-interactive sessions without `CLAUDE_AUTO_BACKGROUND_TASKS`
- `resolveMaxSubagentSpawnDepth` (`hee`, :230896) - reads `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` at :230897, gate `tengu_hazel_trellis` (`sty`, :230907), default `ZDu = 3`
- `resolveMaxConcurrentSubagents` (`gPu`, :231399) - reads `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` at :231400, default `gty = 20`
- `remoteControlBlockerForProvider` (`H4_`, :535656) - provider-naming chain; only the :535665 branch is net-new
- `toOtlpBodyBuffer` (`XKd`, :494953) - throws the OTLP chunk TypeError at :494957
- `applyModelAliasMigration` (`rTm`, :833732) - dead: its alias table `qlE` (:833753) is always `{}`
- `useRemoteSession` reply-channel adapter (`cqt`, :757708) - dead: only ever assigned `null`
- `macosAquaLaunchctlPrefix` (`jjb`, :679917) - emits `tengu_bg_daemon_macos_aqua_wrap`, called from :679835
- `drainStdoutBeforeExit` (`jzt`, :20552) - called with `scaleBudgetToQueue` from :522216 and :840582
- `loginExpiryWarning` (`$xr`, :687497) - consumes `tff = 3 * rff` (:687512)
- `writePathCircuitBreakerCheck` (`ylt`, :528312) - emits `circuitBreaker: "suspiciousWindowsPath"`
