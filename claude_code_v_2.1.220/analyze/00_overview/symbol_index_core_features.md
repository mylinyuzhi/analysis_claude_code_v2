# Symbol index — Core features (v2.1.220)

**Scope:** Plan mode, background agents, todo/tasks, compact, hooks, skills, thinking, steering, CLI, workflow, agent team, auto memory.

All `File:Line` values are line numbers in the **2.1.220** bundle
`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines, `build_sha 4073f595`). A line tagged `(193)` inside a description refers to
the 2.1.193 baseline and is never used as a `File:Line` value.

> ⚠ **Do not reconcile these symbols against a 2.1.193 index by name.** Identifiers are
> re-mangled between builds and ids are REUSED for unrelated declarations — the #1 analysis
> trap in this tree (`_CONVENTIONS.md` §4 trap 1). Confirmed collisions include `cOt`, `BEy`,
> `OKt`, `yBc` and `lor`. Each source `symbol_additions_*` file lists its own theme's collisions.

> ⚠ **155 obfuscated ids are named two different ways** across the four indexes, and 59 carry
> differing `File:Line` values. Before trusting a row here, check
> [`symbol_alias_conflicts.md`](symbol_alias_conflicts.md) — a mechanically generated register of
> every such disagreement. Same id, two names means at most one analyst was right.

> **Provenance.** Mechanically merged from the per-theme `symbol_additions_v2_1_220_*.md`
> files listed at the bottom, which remain the authoritative sources and additionally carry
> per-theme gate/env-var censuses and notes that are deliberately not duplicated here.
> Rows are deduplicated and sorted by the Obfuscated column within each module section.

---

## Module: Accessibility Settings and Environment

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Feh | CLAUDE_CODE_DISABLE_MOUSE_CLICKS accessor | cli_inner_pretty.js:31082 | function |
| heh | CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN accessor | cli_inner_pretty.js:31105 | function |
| Neh | CLAUDE_CODE_DISABLE_MOUSE accessor | cli_inner_pretty.js:31083 | function |
| reh | CLAUDE_AX_STARTUP_QUIET_MS accessor | cli_inner_pretty.js:31123 | function |
| Snt | readSettingWithSource | cli_inner_pretty.js:63507 | function |
| — | `screenReader` settings group wrapper | cli_inner_pretty.js:60188 | object |
| — | `axScreenReader` zod field | cli_inner_pretty.js:60191 | object |
| — | `emojiCompletionEnabled` zod field | cli_inner_pretty.js:61202 | object |
| — | `vimInsertModeRemaps` zod field | cli_inner_pretty.js:61454 | object |

## Module: Agent Team — Leader-facing UI and validation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $hy | explainAgentFrontmatterError | cli_inner_pretty.js:269867 | function |
| BCu | addSessionHook | cli_inner_pretty.js:215741 | function |
| FCu | addSessionFunctionHook | cli_inner_pretty.js:215736 | function |
| JWu | parseAgentMarkdownFile | cli_inner_pretty.js:269945 | function |
| lfn | getInputRouting | cli_inner_pretty.js:514598 | function |
| NYe | getViewedTeammateTask | cli_inner_pretty.js:514595 | function |
| oa | truncate | cli_inner_pretty.js:160403 | function |
| orn | TEAMMATE_MODE_DEFAULT | cli_inner_pretty.js:318739 | constant |
| qWf | buildLeaderCommandNotice | cli_inner_pretty.js:748982 | function |
| Tas | removeSessionHook | cli_inner_pretty.js:215762 | function |
| tWl | TEAMMATE_MODE_VALUES | cli_inner_pretty.js:58389 | constant |
| uAo | TRANSCRIPT_REPLAY_CAP | cli_inner_pretty.js:324398 | constant |
| upt | appendCappedMessage | cli_inner_pretty.js:324386 | function |
| vid | appendOrReplaceByUuid | cli_inner_pretty.js:324394 | function |
| XWu | parseJsonAgentDefinition | cli_inner_pretty.js:269885 | function |

## Module: Agent Team — Mailbox transport

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _1t | readUnreadMessages | cli_inner_pretty.js:325262 | function |
| _Ao | inFlightPrunes | cli_inner_pretty.js:325710 | variable |
| adr | seenDrops | cli_inner_pretty.js:325709 | variable |
| ann | FAILURE_REASON_MAX_LENGTH | cli_inner_pretty.js:325666 | constant |
| bAo | mailboxPathModule | cli_inner_pretty.js:325696 | variable |
| cdr | MAILBOX_LOCK_OPTIONS | cli_inner_pretty.js:325697 | object |
| cxs | PROTOCOL_FRAME_PROMPT_ERROR | cli_inner_pretty.js:325676 | constant |
| ddr | createIdleNotification | cli_inner_pretty.js:325406 | function |
| exs | isIdleNotification | cli_inner_pretty.js:325418 | function |
| fdr | isShutdownRequest | cli_inner_pretty.js:325528 | function |
| fpt | markMessagesAsRead | cli_inner_pretty.js:325345 | function |
| gdr | getLastPeerDmSummary | cli_inner_pretty.js:325630 | function |
| GDy | DROP_KEY_MAX_CHARS | cli_inner_pretty.js:325663 | constant |
| Gid | describeEntryShape | cli_inner_pretty.js:325137 | function |
| H0t | getTeamsRootDir | cli_inner_pretty.js:14679 | function |
| jid | mailboxEntrySchema | cli_inner_pretty.js:325698 | object |
| KDy | schedulePruneOnce | cli_inner_pretty.js:325203 | function |
| ldr | messageIdentityKey | cli_inner_pretty.js:325342 | function |
| mnn | markMessagesAsReadByPredicate | cli_inner_pretty.js:325610 | function |
| mpt | formatTeammateMessages | cli_inner_pretty.js:325400 | function |
| qDy | reportDroppedEntryOnce | cli_inner_pretty.js:325158 | function |
| qid | partitionValidMailboxEntries | cli_inner_pretty.js:325185 | function |
| qze | readMailbox | cli_inner_pretty.js:325243 | function |
| SAo | markSingleMessageAsRead | cli_inner_pretty.js:325315 | function |
| snn | clearMailbox | cli_inner_pretty.js:325377 | function |
| udr | formatTeammateMessage | cli_inner_pretty.js:325392 | function |
| Use | isStructuredProtocolMessage | cli_inner_pretty.js:325581 | function |
| uxs | isHeadlessLeadDisplayableMessage | cli_inner_pretty.js:325607 | function |
| VDy | reportNonArrayInboxOnce | cli_inner_pretty.js:325173 | function |
| Vid | pruneInvalidMailboxEntries | cli_inner_pretty.js:325210 | function |
| VT | writeToMailbox | cli_inner_pretty.js:325267 | function |
| Vze | IdleNotificationMessageSchema | cli_inner_pretty.js:325711 | object |
| WDy | dropDedupKey | cli_inner_pretty.js:325150 | function |
| Wid | MAX_TRACKED_DROPS | cli_inner_pretty.js:325662 | constant |
| y1t | getInboxPath | cli_inner_pretty.js:325229 | function |
| YDy | ensureInboxDir | cli_inner_pretty.js:325237 | function |
| z0 | parseFrameForDisplay | cli_inner_pretty.js:325559 | function |
| zDy | flushPendingMailboxPrunes | cli_inner_pretty.js:325200 | function |

## Module: Agent Team — Message envelope

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| bLy | MESSAGE_WIRE_VERSION | cli_inner_pretty.js:319767 | constant |
| q0s | sendControlToUdsSocket | cli_inner_pretty.js:319881 | function |
| SLy | newMessageId | cli_inner_pretty.js:319761 | function |
| t1t | newMessageEnvelope | cli_inner_pretty.js:319764 | function |
| W0s | sendToUdsSocket | cli_inner_pretty.js:319863 | function |

## Module: Agent Team — Shared helpers used by this module

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| fb | acquireFileLock | cli_inner_pretty.js:108725 | function |
| gp | collapseNewlines | cli_inner_pretty.js:20753 | function |
| Ie | jsonStringify | cli_inner_pretty.js:19815 | function |
| KQa | addSessionHook (193) | cli_inner_pretty.js:397131 (193) | function |
| Lr | TelemetrySafeError | cli_inner_pretty.js:19800 | class |
| pr | countWhere | cli_inner_pretty.js:24548 | function |
| Ut | jsonParse | cli_inner_pretty.js:19851 | variable |
| xe | reportError | cli_inner_pretty.js:24955 | function |
| zQa | addSessionFunctionHook (193) | cli_inner_pretty.js:397126 (193) | function |

## Module: Agent Team — Teammate lifecycle

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _mt | USER_INTERRUPT_TEXTS | cli_inner_pretty.js:534126 | constant |
| _u | makeApiErrorMessage | cli_inner_pretty.js:530704 | function |
| BMs | classifyTurnApiFailure | cli_inner_pretty.js:530513 | function |
| C8y | findNextClaimableTask | cli_inner_pretty.js:396250 | function |
| DTo | anyOtherTeammateBusy | cli_inner_pretty.js:341674 | function |
| EKe | findTaskByAgentId | cli_inner_pretty.js:395949 | function |
| GMs | buildTeammateSpawnEnv | cli_inner_pretty.js:397036 | function |
| H8y | runInProcessTeammate | cli_inner_pretty.js:396406 | function |
| HKf | notifyLeaderOfFailedTurn | cli_inner_pretty.js:759398 | function |
| inl | initializeTeammateSession | cli_inner_pretty.js:759343 | function |
| Is | createEmitter | cli_inner_pretty.js:1968 | function |
| ite | extractAssistantText | cli_inner_pretty.js:532102 | function |
| k8y | waitForNextTeammateInput | cli_inner_pretty.js:396353 | function |
| kKf | initTeamContextFromSession | cli_inner_pretty.js:759309 | function |
| KU_ | RETRY_SLEEP_CHUNK_MS | cli_inner_pretty.js:535004 | constant |
| Kvd | claimNextOpenTask | cli_inner_pretty.js:396268 | function |
| NMs | TEAMMATE_SYSTEM_PROMPT_ADDENDUM | cli_inner_pretty.js:396113 | constant |
| olp | getTurnFailureReason | cli_inner_pretty.js:530510 | function |
| OMs | wakeRunningTeammate | cli_inner_pretty.js:396079 | function |
| Plp | sleepUntilRetryOrWake | cli_inner_pretty.js:534800 | function |
| qMs | warnTeammateModelNotAllowlisted | cli_inner_pretty.js:397181 | function |
| qU_ | RETRY_BASE_DELAY_MS | cli_inner_pretty.js:535000 | constant |
| R8y | TEAMMATE_FORWARDED_ENV_VARS | cli_inner_pretty.js:397061 | constant |
| RKf | useTeammateInitialization | cli_inner_pretty.js:759430 | function |
| rve | updateTeammateTask | cli_inner_pretty.js:396240 | function |
| T8y | sendToLeadMailbox | cli_inner_pretty.js:396243 | function |
| tdr | setMemberActive | cli_inner_pretty.js:324563 | function |
| x8y | buildTaskClaimPrompt | cli_inner_pretty.js:396258 | function |
| xkm | getTeamTeardownParkTimeoutMs | cli_inner_pretty.js:844847 | function |
| xpr | hasLiveBackgroundWorkForAgent | cli_inner_pretty.js:341451 | function |
| Yse | TEAMMATE_EVICT_DELAY_MS | cli_inner_pretty.js:341922 | constant |
| Yvd | drainMailbox | cli_inner_pretty.js:396288 | function |
| Z2e | computeRetryDelay | cli_inner_pretty.js:534820 | function |
| zCe | makeAgentId | cli_inner_pretty.js:111476 | function |
| zMs | reserveTeammateIdentity | cli_inner_pretty.js:397222 | function |
| zvd | sendIdleNotificationToLead | cli_inner_pretty.js:396246 | function |
| Zvd | buildTeammateSpawnFlags | cli_inner_pretty.js:397199 | function |

## Module: Auto memory — CLAUDE.md / `.claude/rules` loading

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ePt` | `loadRulesDirectory` | cli_inner_pretty.js:235851 | function |
| `ifo` | `loadConditionalRules` (gained the symlink realpath retry at :235996) | cli_inner_pretty.js:235992 | function |
| `IMu` | `loadNestedConditionalRules` (gained the `!pg("projectSettings")` early return) | cli_inner_pretty.js:235987 | function |
| `Lpe` | `loadMemoryFile` | cli_inner_pretty.js:235826 | function |
| `Nir` | `collectExternalMemoryParents` | cli_inner_pretty.js:236007 | function |
| `pg` | `isSettingSourceEnabled` | cli_inner_pretty.js:57672 | function |
| `ufo` | `loadNestedDirectoryMemoryFiles` (`.claude/rules` now inside the `projectSettings` guard) | cli_inner_pretty.js:235962 | function |

## Module: Auto memory — MEMORY.md index size budget

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aLo` | `buildMemoryIndexCapNotice` (returns `{text, overCap}`; 193 `lKn` returned a string) | cli_inner_pretty.js:434055 | function |
| `atr` | `getMemoryMounts` (`null` on failure) | cli_inner_pretty.js:158545 | function |
| `Axe` | `isMemoryIndexHidden` (`tengu_moth_copse` / `CLAUDE_MEMORY_STORES`) | cli_inner_pretty.js:156959 | function |
| `cie` | `MEMORY_INDEX_LINE_CAP` (`200`; carryover, 193 `RY`) | cli_inner_pretty.js:160638 | constant |
| `DS` | `MEMORY_INDEX_FILENAME` (`"MEMORY.md"`) | cli_inner_pretty.js:160637 | constant |
| `fny` | `splitFrontmatterAndPaths` | cli_inner_pretty.js:235627 | function |
| `FPd` | `deliverMemoryIndexCapNotice` (emits `over_cap`, returns `additionalContext`) | cli_inner_pretty.js:436637 | function |
| `gt_` | `findUserPromptIndexMount` | cli_inner_pretty.js:434123 | function |
| `HRt` | `isNestedMemoryStoreRoot` | cli_inner_pretty.js:161961 | function |
| `ht_` | `WARN_AT_FRAC` (`0.8`; carryover, 193 `Nof`) | cli_inner_pretty.js:434080 | constant |
| `Htr` | `truncateMemoryForPrompt` (the actual read limit: 200 lines then 25,000 bytes) | cli_inner_pretty.js:161586 | function |
| `Ixe` | `MEMORY_INDEX_BYTE_CAP` (`25000`; carryover, 193 `Kae`) | cli_inner_pretty.js:160639 | constant |
| `Jqe` | `getUserMemoryIndexPath` | cli_inner_pretty.js:157054 | function |
| `mny` | `loadMemoryFileForPrompt` (the splice order the checker now replays) | cli_inner_pretty.js:235636 | function |
| `NPu` | `stripHtmlComments` | cli_inner_pretty.js:233865 | function |
| `oPd` | `checkTeamMemoryIndexCap` (new plumbing, no splice step) | cli_inner_pretty.js:434139 | function |
| `pl` | `formatBytes` | cli_inner_pretty.js:33132 | function |
| `rPd` | `checkUserMemoryIndexCap` (PostToolUse size check for the user index) | cli_inner_pretty.js:434085 | function |
| `sds` | `stripHtmlCommentTokens` | cli_inner_pretty.js:233869 | function |
| `sLo` | `chooseBindingSizeBasis` (raw-vs-spliced, compares fractions of cap; 220-only) | cli_inner_pretty.js:434052 | function |
| `Too` | `MEMORY_INDEX_READ_WINDOW` (`4 * Ixe` = 100,000; 220-only) | cli_inner_pretty.js:160647 | constant |
| `tPd` | `COMPACT_TARGET_FRAC` (`0.7`; carryover, 193 `Xgl`) | cli_inner_pretty.js:434081 | constant |
| `Vtt` | `readFileWindow` (`{content, bytesRead, bytesTotal}`) | cli_inner_pretty.js:20114 | function |
| `wRt` | `measureTrimmed` (`{trimmed, lineCount, byteCount}`) | cli_inner_pretty.js:160615 | function |
| `xm` | `isAutoMemoryEnabled` | cli_inner_pretty.js:156938 | function |
| `xtr` | `foldPathForCompare` (NFC + lowercase) | cli_inner_pretty.js:160628 | function |

## Module: Auto memory — `<cc-memory>` citation surface (undocumented, 220-only)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Bnu` | `CITATION_FILENAMES_ATTR_RE` (`/\bfilenames="([^"]*)"/`) | cli_inner_pretty.js:160806 | constant |
| `Fnu` | `truncateCitationSentence` (300-char cut with surrogate-pair guard) | cli_inner_pretty.js:160750 | function |
| `gLg` | `buildMemoryTypesPromptSection` (gated by `tengu_ochre_finch`) | cli_inner_pretty.js:160815 | function |
| `gQi` | `MEMORY_CITATION_SENTENCE_CAP` (`300`) | cli_inner_pretty.js:160804 | constant |
| `jnu` | `extractMemoryCitations` (`{sentence, filenames, incomplete}` records) | cli_inner_pretty.js:160765 | function |
| `koo` | `MEMORY_CITATION_TAG_GATE` (`"tengu_salt_marsh"`) | cli_inner_pretty.js:160800 | constant |
| `ktr` | `stripCitationTagsFromContent` (identity-preserving array mapper) | cli_inner_pretty.js:160786 | function |
| `mLg` | `parseCitationFilenames` | cli_inner_pretty.js:160757 | function |
| `nk` | `stripMemoryCitationTags` | cli_inner_pretty.js:160712 | function |
| `obm` | `emitMemoryCitationTelemetry` (`tengu_cc_memory_tag_stripped`) | cli_inner_pretty.js:819751 | function |
| `TRt` | `buildMemoryCitationPromptSection` (gated `## Citing memories` block) | cli_inner_pretty.js:160839 | function |
| `Unu` | `analyzeMemoryCitationTags` (tag/byte counter feeding telemetry) | cli_inner_pretty.js:160716 | function |
| `xoo` | `CITATION_TAG_RE` (`/<\/?cc-memory\b[^>]*>/g`) | cli_inner_pretty.js:160806 | constant |
| `yQi` | `CITATION_TAG_NAME` (`"cc-memory"`) | cli_inner_pretty.js:160801 | constant |

## Module: Auto memory — frontmatter parsing and rewrite safety

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Ig` | `requoteLossyScalars` (per-line losslessness prover; 220-only) | cli_inner_pretty.js:158018 | function |
| `$nu` | `serializeMemoryFile` (`---` + `Bun.YAML.stringify` + body) | cli_inner_pretty.js:160653 | function |
| `Bfo` | `stampNewMemoryContent` (three-path stamper; called from Edit :311213 / Write :311525) | cli_inner_pretty.js:238652 | function |
| `BIg` | `expandBracePatternsWithBudget` (holds the `.217` budget message at :158177) | cli_inner_pretty.js:158159 | function |
| `bru` | `splitAndExpandPatterns` (comma splitter feeding the brace expander) | cli_inner_pretty.js:158139 | function |
| `c1u` | `insertAt` (array splice helper) | cli_inner_pretty.js:238708 | function |
| `cps` | `INDENTED_LINE_RE` (`/^\s+\S/`) | cli_inner_pretty.js:238755 | constant |
| `Doy` | `splitModifiedIndentAndComment` (preserves indent + trailing `#` on update) | cli_inner_pretty.js:238704 | function |
| `DY` | `parseMemoryFrontmatter` (memory-shaped wrapper over `Lp`) | cli_inner_pretty.js:160649 | function |
| `EJi` | `recordUnprovableInlineHash` (flags keys whose inline `#` cannot be requoted; 220-only) | cli_inner_pretty.js:158059 | function |
| `FIg` | `BRACE_EXPANSION_BYTE_BUDGET` (`4194304`) | cli_inner_pretty.js:158228 | constant |
| `fLg` | `slugifyMemoryName` (kebab-cases `name:` unless already `[a-z0-9_-]+`) | cli_inner_pretty.js:160697 | variable |
| `FVr` | `readMetadataString` (non-empty-string metadata reader) | cli_inner_pretty.js:160695 | variable |
| `gV` | `yamlParse` (`Bun.YAML.parse`) | cli_inner_pretty.js:157974 | function |
| `Loy` | `spliceModifiedLine` (byte splice + semantic re-verification; 220-only) | cli_inner_pretty.js:238669 | function |
| `Lp` | `parseFrontmatter` (shared parser; gained the `quoteLossyValues` mode) | cli_inner_pretty.js:158070 | function |
| `lps` | `BLANK_OR_COMMENT_LINE_RE` (`/^\s*(#\ | $)/`) | cli_inner_pretty.js:238755 |
| `MIg` | `SUSPICIOUS_SCALAR_RE` (`/[{}[\]*&#!\ | >%@\`]\ | : /`) |
| `Moy` | `findMetadataBlockEnd` (block scanner tolerant of interior comment runs) | cli_inner_pretty.js:238727 | function |
| `NIg` | `BRACE_EXPANSION_RESULT_BUDGET` (`1000`) | cli_inner_pretty.js:158227 | constant |
| `ntr` | `yamlStringify` (`Bun.YAML.stringify` + trailing newline) | cli_inner_pretty.js:157977 | function |
| `OIg` | `quoteSuspiciousScalars` (post-throw salvage pass; carryover from 193 `XEd`) | cli_inner_pretty.js:157984 | function |
| `Onu` | `withMetadata` (frozen metadata merge) | cli_inner_pretty.js:160696 | variable |
| `pFe` | `stripCR` (trailing `\r` remover) | cli_inner_pretty.js:238701 | function |
| `pLg` | `normalizeMemoryFrontmatter` (builds `{name, description, metadata}`) | cli_inner_pretty.js:160687 | variable |
| `Poy` | `insertModifiedLine` (placement inside `metadata:` / before closing fence) | cli_inner_pretty.js:238711 | function |
| `pRt` | `STRICT_FRONTMATTER_RE` (whole-line closing fence, CRLF-tolerant; 220-only) | cli_inner_pretty.js:158237 | constant |
| `Roy` | `MODIFIED_LINE_RE` (`/^(\s*)modified\s*:/`) | cli_inner_pretty.js:238755 | constant |
| `uie` | `isUnderTeamMemoryDir` | cli_inner_pretty.js:161233 | function |
| `uLg` | `MEMORY_NODE_TYPE` (`"memory"`, forced first key by `$nu`) | cli_inner_pretty.js:160684 | constant |
| `vJi` | `asPlainObject` (non-array object or `{}`) | cli_inner_pretty.js:158132 | function |
| `Wde` | `isUnderMemoryRoot` | cli_inner_pretty.js:157057 | function |
| `wZ` | `FRONTMATTER_RE` (lenient fence; carryover from 193 `eye`) | cli_inner_pretty.js:158237 | constant |
| `yru` | `emptyKeysHazard` (lowest-severity rewrite hazard) | cli_inner_pretty.js:158127 | function |

## Module: Background Agents — Agent View & Status

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Pn` | `classifyRowLane` | cli_inner_pretty.js:801986-801992 | function |
| `a7S` | `COMPACT_HEADER_ROWS` (2) | cli_inner_pretty.js:808501 | constant |
| `cfi` | `FleetActionUnconfirmedError` | cli_inner_pretty.js:808679-808684 | class |
| `Dpi` | `FULL_HEADER_ROWS` (4) | cli_inner_pretty.js:808500 | constant |
| `E5e` | `rowAgeText` (passes `nextAt` only for self-driving rows) | cli_inner_pretty.js:807247 | function |
| `GKS` | `ROWS_PER_NEEDS_ROW` (3) | cli_inner_pretty.js:802084 | constant |
| `HMr` | `prLinks` (filters out non-PR hrefs) | cli_inner_pretty.js:802774-802776 | function |
| `Hum` | `summarizeFan` (todo ratio preferred over agent ratio) | cli_inner_pretty.js:802069 | function |
| `kcl` | `mostRecentTerminalTimestamp` | cli_inner_pretty.js:801993-801999 | function |
| `kMr` | `resolveStateWord` (`Done`/`Failed`/`Stopped`/`Working`/`Needs input`/`Idle`) | cli_inner_pretty.js:803153-803160 | function |
| `kum` | `buildSimpleRows` (the `simple:*` band layout) | cli_inner_pretty.js:802011-802067 | function |
| `lO` | `sanitizeForTerminal` | cli_inner_pretty.js:803333 | function |
| `n7S` | `allocateFleetColumns` (age / label / artifact / flex detail) | cli_inner_pretty.js:802788-802794 | function |
| `nfi` | `classifyRowGroupByState` (live process first, LLM tempo last) | cli_inner_pretty.js:802918-802936 | function |
| `o7S` | `FLEET_SECTION_DESCRIPTIONS` | cli_inner_pretty.js:808672-808677 | object |
| `p7S` | `buildRowActions` (band-scoped key table) | cli_inner_pretty.js:803022-803123 | function |
| `qdm` | `fleetTerminalTitle` (`N awaiting input · claude agents`) | cli_inner_pretty.js:802909-802910 | function |
| `qKS` | `DONE_FOLD_MIN_HIDDEN` (2) | cli_inner_pretty.js:802086 | constant |
| `QYS` | `MIN_AGE_COL` (3) | cli_inner_pretty.js:808484 | constant |
| `r7S` | `prBadgeWidth` | cli_inner_pretty.js:802777-802787 | function |
| `r8t` | `rowLabel` (`session you came from` / `current session`) | cli_inner_pretty.js:802682-802705 | function |
| `rfi` | `resolveDoneCapAndHeader` (compacting header) | cli_inner_pretty.js:802912-802917 | function |
| `Rwt` | `FLEET_STATE_LABELS` (carryover map, byte-identical to 193) | cli_inner_pretty.js:808671 | object |
| `s7S` | `CHROME_ROWS` (8) | cli_inner_pretty.js:808499 | constant |
| `sfi` | `sessionAgeText` (`in 5m` countdown or frozen elapsed) | cli_inner_pretty.js:802677-802681 | function |
| `t7S` | `elapsedSince` | cli_inner_pretty.js:802672-802676 | function |
| `tdl` | `isPlaceholderDetail` | cli_inner_pretty.js:803330-803332 | function |
| `UKS` | `DONE_FOLD_MAX_AGE_MS` (172,800,000 = 48 h) | cli_inner_pretty.js:802082 | constant |
| `v5e` | `resolveStatusText` (needs > fan > detail, `clamp(24,72,0.55×cols)`) | cli_inner_pretty.js:807249-807260 | function |
| `Vdm` | `MIN_DONE_ROWS` (3) | cli_inner_pretty.js:808496 | constant |
| `VKS` | `EMPTY_STATE_ROWS` (4) | cli_inner_pretty.js:802087 | constant |
| `WKS` | `ROWS_PER_LIVE_ROW` (2) | cli_inner_pretty.js:802085 | constant |
| `Xdm` | `rowColorForState` (colour/dim projection of `resolveStateWord`) | cli_inner_pretty.js:803161-803164 | function |
| `YKS` | `computeDoneCap` | cli_inner_pretty.js:802008 | function |
| `Zdm` | `renderPrBadge` (`✗ 2/7` / `5/7` / `✓` + review word) | cli_inner_pretty.js:803190-803213 | function |
| `zKS` | `DONE_FOLD_ROWS` (1) | cli_inner_pretty.js:802088 | constant |

## Module: Background Agents — BackgroundWorker (respawn, upgrade, rekey, adopt)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $hp | FAST_CRASH_WINDOW_MS (5000) | cli_inner_pretty.js:554829 | constant |
| _q_ | EMPTY_IDLE_GRACE_MS (300000) | cli_inner_pretty.js:554837 | constant |
| ARe | isHostManagedProviderDispatch | cli_inner_pretty.js:554842 | function |
| Bhp | DISPATCH_STRING_CAP (4096) | cli_inner_pretty.js:554840 | constant |
| bq_ | RECENT_INPUT_WINDOW_MS (3600000) | cli_inner_pretty.js:554839 | constant |
| d7s | bunPtyHostSpawner | cli_inner_pretty.js:553352-553376 | function |
| dq_ | EXTERNAL_STOP_EXIT_CODES ({129,143}) | cli_inner_pretty.js:554884 | constant |
| Eq_ | isWorkerPhaseTransitionLegal | cli_inner_pretty.js:553500-553513 | function |
| f7s | writeSocketTokensFile | cli_inner_pretty.js:553466-553479 | function |
| Fhp | ADOPT_GRACE_MS (120000) | cli_inner_pretty.js:554836 | constant |
| fq_ | RESUME_INTERRUPTED_TURN_MAX_AGE_MS (3600000) | cli_inner_pretty.js:554827 | constant |
| Ghp | applyProcessWrapperToWorkerEnv | cli_inner_pretty.js:553447-553451 | function |
| gq_ | HOST_WAKE_GRACE_MS (60000) | cli_inner_pretty.js:554831 | constant |
| h7s | hasNonResumableInFlight | cli_inner_pretty.js:553480-553484 | function |
| hq_ | LONG_RUN_RESET_MS (300000) | cli_inner_pretty.js:554830 | constant |
| jhp | buildWorkerEnv | cli_inner_pretty.js:553391-553446 | function |
| Mhp | MAX_RESPAWN_ATTEMPTS (20) | cli_inner_pretty.js:554823 | constant |
| mme | BackgroundWorker | cli_inner_pretty.js:553515-554817 | class |
| mme.adopt | BackgroundWorker.adopt | cli_inner_pretty.js:553981-554075 | function |
| mme.buildClaimFrame | BackgroundWorker.buildClaimFrame | cli_inner_pretty.js:553973-553980 | function |
| mme.cappedDispatch | BackgroundWorker.cappedDispatch | cli_inner_pretty.js:554216-554232 | function |
| mme.checkPid | BackgroundWorker.checkPid | cli_inner_pretty.js:554772-554801 | function |
| mme.claim | BackgroundWorker.claim | cli_inner_pretty.js:553936-553965 | function |
| mme.doSpawn | BackgroundWorker.doSpawn | cli_inner_pretty.js:554302-554471 | function |
| mme.doSpawnUnlessSettledOnDisk | BackgroundWorker.doSpawnUnlessSettledOnDisk | cli_inner_pretty.js:554654-554673 | function |
| mme.fireAuthRekey | BackgroundWorker.fireAuthRekey | cli_inner_pretty.js:553876-553880 | function |
| mme.logVanished | BackgroundWorker.logVanished | cli_inner_pretty.js:554802-554812 | function |
| mme.noteDowngradeRefused | BackgroundWorker.noteDowngradeRefused | cli_inner_pretty.js:553644-553652 | function |
| mme.onExit | BackgroundWorker.onExit | cli_inner_pretty.js:554535-554653 | function |
| mme.onPtyAuthRequired | BackgroundWorker.onPtyAuthRequired | cli_inner_pretty.js:553819-553829 | function |
| mme.pidRecycledAsync | BackgroundWorker.pidRecycledAsync | cli_inner_pretty.js:554766-554770 | function |
| mme.rekeyForAuthMismatch | BackgroundWorker.rekeyForAuthMismatch | cli_inner_pretty.js:553830-553875 | function |
| mme.respawnIfIdleStale | BackgroundWorker.respawnIfIdleStale | cli_inner_pretty.js:553653-553717 | function |
| mme.retireIfSettled | BackgroundWorker.retireIfSettled | cli_inner_pretty.js:553718-553813 | function |
| mme.rosterEntry | BackgroundWorker.rosterEntry | cli_inner_pretty.js:554195-554215 | function |
| mme.scheduleRespawn | BackgroundWorker.scheduleRespawn | cli_inner_pretty.js:554686-554703 | function |
| mme.settleCwdGone | BackgroundWorker.settleCwdGone | cli_inner_pretty.js:554674-554680 | function |
| mme.socketAuth | BackgroundWorker.socketAuth | cli_inner_pretty.js:553966-553972 | function |
| mme.transitionTo | BackgroundWorker.transitionTo | cli_inner_pretty.js:553618-553628 | function |
| mme.unverified | BackgroundWorker.unverified | cli_inner_pretty.js:554076-554111 | function |
| mq_ | MAX_AUTH_REKEYS (3) | cli_inner_pretty.js:554828 | constant |
| Nhp | SLEEP_DETECT_THRESHOLD_MS (u7s*3 = 15000) | cli_inner_pretty.js:554834, :554885 | constant |
| Ohp | isRevivalGuardEnabled | cli_inner_pretty.js:553349-553350 | function |
| p7s | writeAuthSnapshot | cli_inner_pretty.js:553452-553465 | function |
| pq_ | RESUME_AFTER_CRASH_PROMPT | cli_inner_pretty.js:554825-554826 | constant |
| qhp | describeWorkerPhase | cli_inner_pretty.js:553497-553499 | function |
| Sq_ | classifySettleState | cli_inner_pretty.js:553485-553491 | function |
| u7s | PID_POLL_INTERVAL_MS (5000) | cli_inner_pretty.js:554833 | constant |
| Uhp | buildWorkerArgv | cli_inner_pretty.js:553378-553390 | function |
| uq_ | RESPAWN_BACKOFF_MS (10000) | cli_inner_pretty.js:554822 | constant |
| Vhp | DETRITUS_TASK_KINDS | cli_inner_pretty.js:554885 | constant |
| Whp | classifyRekeySafety | cli_inner_pretty.js:553492-553496 | function |
| yq_ | RV_STALL_THRESHOLD_MS (120000) | cli_inner_pretty.js:554835 | constant |

## Module: Background Agents — Build-Timestamp Version Recency

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| eq_ | PRERELEASE_CHANNELS (["dev","engine"]) | cli_inner_pretty.js:552486 | constant |
| fhn | isPrereleaseBuild | cli_inner_pretty.js:552444-552446 | function |
| hhp | isOlderBuild | cli_inner_pretty.js:552469-552473 | function |
| iSr | channelsDiffer | cli_inner_pretty.js:552447-552452 | function |
| mhn | isNewerBuild | cli_inner_pretty.js:552474-552483 | function |
| rUt | parseEmbeddedBuildTimestamp | cli_inner_pretty.js:552453-552468 | function |
| ugt | prereleaseChannelOf | cli_inner_pretty.js:552441-552443 | function |

## Module: Background Agents — Daemon Lock & Process Identity

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $ef | createDaemonLockExclusive | cli_inner_pretty.js:664710-664717 | function |
| _L | readProcStartCached | cli_inner_pretty.js:112415-112428 | function |
| Bef | staleLockAdviceText | cli_inner_pretty.js:664791-664793 | function |
| cAa | procStartMatchesWithRetry | cli_inner_pretty.js:664779-664787 | function |
| csg | PROC_START_MISS_TTL_MS (5000) | cli_inner_pretty.js:112476 | constant |
| dsg | readProcStartUncached | cli_inner_pretty.js:112437-112452 | function |
| eHt | readOwnProcStartMemoised | cli_inner_pretty.js:112412-112414 | function |
| ERc | PROC_START_RETRY_JITTER_MS (250) | cli_inner_pretty.js:112478 | constant |
| Fef | removeDaemonLock | cli_inner_pretty.js:664762-664768 | function |
| gYo | describeUnknownOriginHolder | cli_inner_pretty.js:664834-664836 | function |
| Hbt | describeUnstoppedHolder | cli_inner_pretty.js:664824-664833 | function |
| hYo | PROC_START_RETRY_DELAY_MS (250) | cli_inner_pretty.js:664845 | constant |
| jAe | readDaemonLockRaw | cli_inner_pretty.js:664723-664739 | function |
| K0r | terminateAndWait | cli_inner_pretty.js:664686-664703 | function |
| KAn | stopTransientDaemonByLock | cli_inner_pretty.js:664806-664823 | function |
| lsg | PROC_START_HIT_TTL_MS (60000) | cli_inner_pretty.js:112475 | constant |
| mB | procStartMatches | cli_inner_pretty.js:112404-112408 | function |
| mYo | writeDaemonLockAtomic | cli_inner_pretty.js:664740-664761 | function |
| N5r | readProcStartTwice | cli_inner_pretty.js:112432-112436 | function |
| Nef | markDaemonLockBgDisabled | cli_inner_pretty.js:664718-664722 | function |
| O5r | isPidDefinitelyGone | cli_inner_pretty.js:112329-112336 | function |
| Oef | DAEMON_LOCK_FILENAME ("daemon.lock") | cli_inner_pretty.js:664843 | constant |
| pq | daemonLockPath | cli_inner_pretty.js:664707-664709 | function |
| QH | readVerifiedDaemonLock | cli_inner_pretty.js:664794-664804 | function |
| Uef | daemonVersionDiffers | cli_inner_pretty.js:664837-664840 | function |
| usg | clearProcStartCache | cli_inner_pretty.js:112429-112431 | function |
| VAn | verifyDaemonCmdline | cli_inner_pretty.js:664769-664778 | function |
| Y0r | lockHasProcStartIdentity | cli_inner_pretty.js:664788-664790 | function |
| zAn | PROC_START_VERIFY_ATTEMPTS (2) | cli_inner_pretty.js:664844 | constant |

## Module: Background Agents — Daemon Spawn & Takeover

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _Ia | launcherNotRunnableNotice | cli_inner_pretty.js:680506-680508 | function |
| AJe | waitForDaemonPing | cli_inner_pretty.js:680053-680060 | function |
| ASE | DAEMON_STALE_CHECK_INTERVAL_MS (60000) | cli_inner_pretty.js:870906 | constant |
| Ccf | isNestedConfigDirSituation | cli_inner_pretty.js:680486-680489 | function |
| cJo | binaryTakeoverState ("idle"/"attempted"/"took-over") | cli_inner_pretty.js:680524 | variable |
| CSE | binaryIdentityChanged | cli_inner_pretty.js:870496-870499 | function |
| d$g | resolvePowerShellPath (5 rungs + the new %SYSTEMROOT% PS 5.1 last resort) | cli_inner_pretty.js:168540-168574 | function |
| dGt | isExecutableFileAsync | cli_inner_pretty.js:679891-679898 | function |
| eGb | describeInvokingCommand | cli_inner_pretty.js:680490-680495 | function |
| Gjb | windowsWmiSpawn | cli_inner_pretty.js:679946-679983 | function |
| GX | DAEMON_REACHABLE_TIMEOUT_MS (45000) | cli_inner_pretty.js:680522 | constant |
| ITn | ensureDaemonAskInstall | cli_inner_pretty.js:680554-680582 | function |
| j1m | DAEMON_IDLE_GRACE_MS (5000) | cli_inner_pretty.js:870908 | constant |
| jjb | macosAquaWrapPrefix | cli_inner_pretty.js:679917-679939 | function |
| Jjb | shouldClientRetireDaemonByVersion | cli_inner_pretty.js:680302-680318 | function |
| kcf | shouldAskDaemonServiceInstall | cli_inner_pretty.js:680515-680517 | function |
| Kjb | buildDaemonSpawnEnv | cli_inner_pretty.js:680015-680033 | function |
| kTn | applyAquaWrapPrefix | cli_inner_pretty.js:679941-679944 | function |
| lJo | spawnDaemonProcess | cli_inner_pretty.js:679802-679866 | function |
| OZ | getPowerShellPathCached | cli_inner_pretty.js:168575-168578 | function |
| qjb | joinWindowsArgv | cli_inner_pretty.js:679995-679997 | function |
| Qjb | maybeRetireStaleDaemon | cli_inner_pretty.js:680319-680407 | function |
| Tcf | detectZombieDaemon | cli_inner_pretty.js:680425-680485 | function |
| tGb | warnLogindKillUserProcesses | cli_inner_pretty.js:680496-680505 | function |
| TSE | DAEMON_STARTUP_IDLE_GRACE_MS (GX + j1m = 50000) | cli_inner_pretty.js:870937 | constant |
| Ujb | spawnDaemonThroughLauncher | cli_inner_pretty.js:679867-679889 | function |
| uJo | waitForServiceDaemon | cli_inner_pretty.js:680061-680077 | function |
| Vjb | quoteWindowsArgvToken | cli_inner_pretty.js:679998-680009 | function |
| wcf | rawDaemonReplacementWarned | cli_inner_pretty.js:680525 | variable |
| Wjb | buildWmiScript | cli_inner_pretty.js:679985-679993 | function |
| wSE | LOCK_REPLACE_SETTLE_MS (100) | cli_inner_pretty.js:870907 | constant |
| xcf | noteWrapperSkew | cli_inner_pretty.js:680509-680514 | function |
| Xjb | daemonLaunchTarget | cli_inner_pretty.js:680299-680301 | function |
| xSE | reportManagerListenFailure | cli_inner_pretty.js:870500-870506 | function |
| xTn | spawnDetached | cli_inner_pretty.js:679899-679915 | function |
| zjb | quotePowerShellSingle | cli_inner_pretty.js:680011-680014 | function |
| Zjb | shouldRetireUnwrappedDaemon | cli_inner_pretty.js:680408-680424 | function |

## Module: Background Agents — Footer nudge and waiting counts

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bMS` | `NUDGE_ATTRIBUTION_MS` (120,000 — `←` counts as acted-on) | cli_inner_pretty.js:750000 | constant |
| `EGe` | `renderAgentsFooterHint` (`← N agents` / `← N done` / `← for agents`) | cli_inner_pretty.js:750023-750153 | function |
| `EMS` | `NUDGE_SWEEP_MS` (10,000) | cli_inner_pretty.js:750002 | constant |
| `J6f` | `isFinishedRow` (self-driving success exempted) | cli_inner_pretty.js:749879-749881 | function |
| `Q6f` | `FleetNudgeStore` (`useSyncExternalStore` source) | cli_inner_pretty.js:749882-749984 | class |
| `SMS` | `NUDGE_IGNORED_AFTER_MS` (1,800,000 = 30 min) | cli_inner_pretty.js:750001 | constant |
| `vMS` | `isAwaitingUserInput` (footer needs-input predicate) | cli_inner_pretty.js:749876-749878 | function |
| `xci` | `FOOTER_PULSE_MS` (2,500) | cli_inner_pretty.js:750158 | constant |

## Module: Background Agents — Fork & Lineage

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `gGt` | `spawnBackgroundSessionFromConversation` (nine `keepParent` branches) | cli_inner_pretty.js:683672-683856 | function |
| `gnd` | `packResumeSourceAlive` (`sessionId\ | boundaryAt\ | parentSessionId`) |
| `HJe` | `buildSpawnSeedFromMessages` (backwards scan, breaks early) | cli_inner_pretty.js:683968-683999 | function |
| `hrn` | `parseResumeSourceAlive` (tolerates the legacy 1-field form) | cli_inner_pretty.js:319492-319497 | function |
| `Ipa` | `normalizeForkNameForConfirmation` (splits on `⑂`, rejoins with `·`) | cli_inner_pretty.js:643595-643603 | function |
| `kJo` | `FORK_COORDINATOR_REFUSAL` (`… Use /branch instead.`) | cli_inner_pretty.js:684209 | constant |
| `NO` | `FORK_GLYPH` (`U+2442` OCR FORK) | cli_inner_pretty.js:58422 | constant |
| `Pvo` | `resolveForkLineageFromEnv` (validates then returns 4 roster fields) | cli_inner_pretty.js:319498-319508 | function |
| `RMr` | `rebuildTaskRegistryPostFork` (parent early-return + `> boundaryAt`) | cli_inner_pretty.js:809097-809113 | function |
| `U7S` | `rebuildBackgroundTaskRegistry` | cli_inner_pretty.js:809118 | function |
| `W7S` | `buildBatchedAgentResurrectionNotice` (the `.208 #21` collapse) | cli_inner_pretty.js:809383-809400 | function |
| `xpe` | `ENTER_WORKTREE_TOOL_NAME` (named in the fork's appended prompt) | cli_inner_pretty.js:230895 | constant |

## Module: Background Agents — Job / Session State Store

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Aks | jobStateWritesInFlight | cli_inner_pretty.js:330466-330470 | variable |
| BE | invalidateJobStateCache | cli_inner_pretty.js:330489-330491 | function |
| Bg | logStateWriteFailure | cli_inner_pretty.js:330473-330480 | function |
| BN | jobsRoot | cli_inner_pretty.js:330418-330420 | function |
| Da | readJobState | cli_inner_pretty.js:330492-330573 | function |
| dm | isSettledState | cli_inner_pretty.js:330978-330980 | function |
| Dpt | bridgeReattachEnv | cli_inner_pretty.js:330481-330488 | function |
| Gdr | dropMalformedPersistedField | cli_inner_pretty.js:330411-330417 | function |
| Had | isJobStateWriteInFlight | cli_inner_pretty.js:330459-330461 | function |
| JBe | isPlainExecTemplate | cli_inner_pretty.js:330981-330983 | function |
| kad | watchJobStateMtime | cli_inner_pretty.js:330431-330458 | function |
| Lpt | transientStateReadSeen | cli_inner_pretty.js:330527-330529 | variable |
| mCe | locateSessionTranscript | cli_inner_pretty.js:51513-51549 | function |
| mwo | readJobStateFresh | cli_inner_pretty.js:330574-330580 | function |
| nIe | jobStateCache | cli_inner_pretty.js:330508-330560 | variable |
| oD | stateToOutcome | cli_inner_pretty.js:330969-330974 | function |
| oIe | jobOriginCwd | cli_inner_pretty.js:330990-330993 | function |
| qrt | quarantineJobTranscript | cli_inner_pretty.js:51505-51512 | function |
| rc | jobDir | cli_inner_pretty.js:330421-330423 | function |
| UE | currentJobShort | cli_inner_pretty.js:330424-330430 | function |
| ULi | transcriptHasMessages | cli_inner_pretty.js:51479-51481 | function |
| um | writeJobState | cli_inner_pretty.js:330462-330472 | function |
| XBe | newJobState | cli_inner_pretty.js:330871-330914 | function |
| Ydr | isBlockedNonExecState | cli_inner_pretty.js:330984-330986 | function |
| zB | isTerminalState | cli_inner_pretty.js:330975-330977 | function |
| zLi | classifyTranscriptContent | cli_inner_pretty.js:51482-51504 | function |

## Module: Background Agents — Job Deletion & Adoption Handoff

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| CJe | killJobConfirmed | cli_inner_pretty.js:680761-680800 | function |
| Dcf | reapAdoptedShellsFromExitHandoff | cli_inner_pretty.js:680698-680731 | function |
| EIa | scanPtyHostsForJob | cli_inner_pretty.js:680801-680815 | function |
| fJo | describeKeptWorktreeReason | cli_inner_pretty.js:681111-681117 | function |
| FY_ | ADOPT_CLAIM_RETRY_MS (250) | cli_inner_pretty.js:565198 | constant |
| gDe | findLiveSessionOwner | cli_inner_pretty.js:680688-680697 | function |
| iGb | REAP_MAX_AGE_MS (604800000) | cli_inner_pretty.js:680735 | constant |
| nEr | writeAdoptFile | cli_inner_pretty.js:564907-564927 | function |
| oGb | REAP_CLAIM_RETRY_MS (250) | cli_inner_pretty.js:680734 | constant |
| rEr | ADOPT_STALE_MS (120000) | cli_inner_pretty.js:565196 | constant |
| sGb | REAP_MAX_ENTRIES (256) | cli_inner_pretty.js:680736 | constant |
| Ucf | daemonUnreachableReplyNotice | cli_inner_pretty.js:680861-680863 | function |
| Z3e | deleteJob | cli_inner_pretty.js:681118-681150 | function |
| ZSp | claimAdoptFile | cli_inner_pretty.js:564928-564980 | function |

## Module: Background Agents — Low-Memory & Retire Grace

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ehp | bridgedRetireGraceMs | cli_inner_pretty.js:552623-552625 | function |
| nq_ | MAC_PRESSURE_SYSCTL_NAME ("kern.memorystatus_vm_pressure_level") | cli_inner_pretty.js:552638 | constant |
| o7e | isLowMemory | cli_inner_pretty.js:552605-552607 | function |
| oq_ | readMacVmPressureLevel | cli_inner_pretty.js:552608-552622 | function |
| r7s | isAttachUpgradeEnabled | cli_inner_pretty.js:552626-552628 | function |
| rq_ | MAC_PRESSURE_CRITICAL (4) | cli_inner_pretty.js:552630 | constant |
| t7s | lowMemorySnapshot | cli_inner_pretty.js:552598-552604 | function |
| yhn | macSysctlSymbolCache | cli_inner_pretty.js:552609-552618 | variable |

## Module: Background Agents — Manager Sweep & Prewarm

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $vl | claimSpareWorker (kills the spare if the claim frame cannot be delivered) | cli_inner_pretty.js:869067-869084 | function |
| d$n | SWEEP_INTERVAL_MS (60000) | cli_inner_pretty.js:870133 | constant |
| dSE | BURST_ROUND_DELAY_MS (2000) | cli_inner_pretty.js:870134 | constant |
| eSE | buildSpareClaimFrame ({cwd, env, argv, sessionId, auth}) | cli_inner_pretty.js:869085-869088 | function |
| g1m | SPARE_CLAIM_RETRY_DELAYS_MS ([50,100,150,200,250,300,400,500,500,500]) | cli_inner_pretty.js:869190 | constant |
| pSE | BURST_DEADLINE_MS (300000) | cli_inner_pretty.js:870135 | constant |
| tSE | sendSpareClaimFrame (5 s deadline, ENOENT/ECONNREFUSED ladder) | cli_inner_pretty.js:869089-869103 | function |
| uSE | IDLE_RETIRE_GRACE_MS (3600000) | cli_inner_pretty.js:870131 | constant |
| Vvl | subscribeWorkerSettle | cli_inner_pretty.js:869945-869974 | function |
| Wvl | LOW_MEM_RETIRE_GRACE_MS (60000) | cli_inner_pretty.js:870132 | constant |

## Module: Background Agents — Notification framing / injected-message prefixes

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `dZg` | `SCHEDULED_TASK_HEADER` (`[SCHEDULED TASK - AUTOMATED FIRING …]`) | cli_inner_pretty.js:226513 | constant |
| `Hcs` | `applyScheduledTaskPrefix` (yields to the stronger framing) | cli_inner_pretty.js:226508-226511 | function |
| `Hy` | `TASK_NOTIFICATION_TAG` (`"task-notification"`) | cli_inner_pretty.js:24717 | constant |
| `kcs` | `applySystemNotificationPrefix` (idempotent) | cli_inner_pretty.js:226504-226507 | function |
| `kNt` | `frameMidTurnMessage` (routes `task-notification` / `scheduled-trigger`) | cli_inner_pretty.js:533914-533918 | function |
| `x7r` | `SYSTEM_NOTIFICATION_PREFIX` (4 lines; the 4th is the `.205` delta) | cli_inner_pretty.js:226516-226521 | constant |
| `Zdo` | `SCHEDULED_TASK_PREFIX` | cli_inner_pretty.js:226522 | constant |

## Module: Background Agents — Notifications & Result Reporting

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Dum` | `useBackgroundAgentNotifications` (sends always, counts once) | cli_inner_pretty.js:802130-802141 | function |
| `edm` | `emitResultSeenTelemetry` (`list_open` vs `render`) | cli_inner_pretty.js:802458-802476 | function |
| `Hrm` | `markNotifiedOnce` (FIFO-evicting 200-entry `(sessionId, kind)` map) | cli_inner_pretty.js:771957-771965 | function |
| `hYS` | `hadConcurrentJob` (interval overlap for the `overlap` dimension) | cli_inner_pretty.js:802482-802492 | function |
| `iAe` | `showNotification` (hook first, terminal channel second) | cli_inner_pretty.js:576783-576820 | function |
| `jGe` | `classifyNotificationBand` (`active` / `blocked` / `completed`) | cli_inner_pretty.js:802903-802908 | function |
| `JKS` | `diffNotificationBands` (six-guard edge detector) | cli_inner_pretty.js:802100-802129 | function |
| `Jll` | `consumeNotificationTiming` (one-shot `ms_since_notification`) | cli_inner_pretty.js:771966-771970 | function |
| `Lum` | `IDLE_SEED` (`"idle-seed"` sentinel band) | cli_inner_pretty.js:802145 | constant |
| `pQ_` | `sniffTerminalNotifChannel` (`TERM_PROGRAM` → bell / native) | cli_inner_pretty.js:576821-576834 | function |
| `v6S` | `NOTIFIED_CAP` (200) | cli_inner_pretty.js:771971 | constant |
| `XKS` | `ASK_MAX` (120 — notification-body truncation of `needs`) | cli_inner_pretty.js:802144 | constant |
| `Zum` | `setResultSeenEntryChannel` (also resets the first-open snapshot) | cli_inner_pretty.js:802455-802457 | function |

## Module: Background Agents — Reply delivery and respawn row state

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Bcf` | `jobPresentInDaemon` | cli_inner_pretty.js:680844-680847 | function |
| `LTn` | `writeQueuedPrompt` (stamps `queuedPrompt` on the roster record) | cli_inner_pretty.js:681612-681617 | function |
| `lxr` | `applyReplyOptimistically` (clears `needs`/`block`/`output`) | cli_inner_pretty.js:680848-680860 | function |
| `Mcf` | `REPLY_QUEUED_SUFFIX` | cli_inner_pretty.js:681298 | constant |
| `Ocf` | `wasReplyQueued` (idempotent by content) | cli_inner_pretty.js:680867-680874 | function |
| `RTn` | `deliverReplyToBackgroundJob` (five-stage ladder, 10→60 attempts) | cli_inner_pretty.js:680875-680964 | function |
| `Ucf` | `daemonUnreachableText` | cli_inner_pretty.js:680861-680863 | function |
| `vIa` | `OTHER_TERMINAL_ERROR` | cli_inner_pretty.js:681297 | constant |
| `vSt` | `NOT_RUNNING_ERROR` | cli_inner_pretty.js:681296 | constant |
| `Z3e` | `deleteJob` (`{force:true}` from the agent view's `Ctrl+X`) | cli_inner_pretty.js:681118 | function |

## Module: Background Agents — Roster Store

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| A6 | redactShort | cli_inner_pretty.js:330287-330289 | function |
| aMy | ROSTER_KNOWN_KEYS | cli_inner_pretty.js:330331-330377 | constant |
| bad | redactIssuePath | cli_inner_pretty.js:330284-330286 | function |
| cMy | writeRoster | cli_inner_pretty.js:330294-330306 | function |
| dwo | extractUnknownRosterFields | cli_inner_pretty.js:330031-330036 | function |
| Ead | rosterMutationChain | cli_inner_pretty.js:330319, :330378 | variable |
| eIe | SHORT_ID_RE (/^[a-f0-9]{8}$/) | cli_inner_pretty.js:330063 | constant |
| Eks | prunedOrphanShorts | cli_inner_pretty.js:330929-330931 | variable |
| F1t | isPidLive | cli_inner_pretty.js:330385-330387 | function |
| Fdr | CONNECTION_ERROR_RE | cli_inner_pretty.js:330102 | constant |
| fks | workerRecordSchema | cli_inner_pretty.js:330106-330125 | object |
| gks | classifyPidLiveness | cli_inner_pretty.js:330380-330384 | function |
| hks | controlRequestSchema | cli_inner_pretty.js:330134-330208 | object |
| jdr | ERROR_CODE_PREFIX_RE | cli_inner_pretty.js:330105 | constant |
| lMy | ROSTER_SIZE_CAP (8388608) | cli_inner_pretty.js:330318 | constant |
| mks | rosterFileSchema | cli_inner_pretty.js:330126-330133 | object |
| Nad | adoptRosterOrphans | cli_inner_pretty.js:330915-330967 | function |
| Ndr | RESPAWNING_ERROR_RE | cli_inner_pretty.js:330101 | constant |
| pwo | quarantineRoster | cli_inner_pretty.js:330281-330283 | function |
| qnn | dispatchRequestSchema | cli_inner_pretty.js:330064-330099 | object |
| rIe | mutateRoster | cli_inner_pretty.js:330307-330314 | function |
| Rpt | KICKED_ERROR_RE | cli_inner_pretty.js:330104 | constant |
| Sad | countRosterWorkers | cli_inner_pretty.js:330290-330293 | function |
| Udr | STALLED_ERROR_RE | cli_inner_pretty.js:330103 | constant |
| v6 | readRoster | cli_inner_pretty.js:330213-330280 | function |
| znn | emptyRoster | cli_inner_pretty.js:330210-330212 | function |

## Module: Background Agents — Roster row-state predicates

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `dm` | `isTerminalRow` (`isTerminalState(state) && tempo !== "active"`) | cli_inner_pretty.js:330978-330980 | function |
| `FEe` | `isSelfDriving` (routine / selfWake / `session_cron`) | cli_inner_pretty.js:331003-331005 | function |
| `FH` | `NEEDS_FIRST_PROMPT` (`send a prompt to start`) | cli_inner_pretty.js:331045 | constant |
| `JBe` | `isOneShotExecJob` (`template === "exec"`, no respawn flags) | cli_inner_pretty.js:330981-330983 | function |
| `Kdr` | `IDLE_DETAIL_PLACEHOLDER` (`(idle — send a prompt to start)`) | cli_inner_pretty.js:331238 | constant |
| `oD` | `outcomeOf` (`done`→success, `failed`→failure, `stopped`→stopped) | cli_inner_pretty.js:330969-330974 | function |
| `Wdr` | `TRANSIENT_STATES` (`starting`/`resuming`/`adopted`/`crashed`) | cli_inner_pretty.js:331238 | constant |
| `Ydr` | `isBlockedRespawnableJob` (`state === "blocked" && !isOneShotExecJob`) | cli_inner_pretty.js:330984-330986 | function |
| `zB` | `isTerminalState` | cli_inner_pretty.js:330975-330977 | function |

## Module: Background Agents — Self-Exec Target Resolution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Fko | isRunningFromVersionsDir | cli_inner_pretty.js:396979-396983 | function |
| ian | userLocalClaudePath | cli_inner_pretty.js:396997-396999 | function |
| jfe | applyLauncherPrefix | cli_inner_pretty.js:397000-397004 | function |
| ox | resolveWrappedSelfExec | cli_inner_pretty.js:396984-396986 | function |
| sNt | resolveSelfExecTarget | cli_inner_pretty.js:396987-396996 | function |
| umr | findNewestInstalledVersionBinary | cli_inner_pretty.js:397005-397019 | function |

## Module: Background Agents — Session confirmation line

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `EEb` | `SESSION_WAITING` (`session waiting`, the downgrade form) | cli_inner_pretty.js:643646 | constant |
| `l6p` | `MIN_NAME_COLUMNS` (20) | cli_inner_pretty.js:643649 | constant |
| `Lpa` | `shortenSessionConfirmationLine` (downgrade → drop id → floor name) | cli_inner_pretty.js:643622-643640 | function |
| `nEn` | `CONFIRMATION_SEPARATOR` (`" · "`) | cli_inner_pretty.js:643647 | constant |
| `Nwr` | `SESSION_WAITING_FOR_PROMPT` | cli_inner_pretty.js:643645 | constant |
| `rEn` | `SESSION_RUNNING` | cli_inner_pretty.js:643644 | constant |
| `Rpa` | `parseSessionConfirmationLine` (inverse of the formatter) | cli_inner_pretty.js:643604-643621 | function |
| `uVo` | `formatSessionConfirmationLine` (`state · name · id · chips`) | cli_inner_pretty.js:643641-643643 | function |

## Module: Background Agents — Shipping-policy prompt fragments

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Ciw` | `WORKFLOW_SHIPPING_POLICY` (supersedes the Background Session policy) | cli_inner_pretty.js:224105-224109 | constant |
| `dRu` | `SHIP_DRAFT_PR` (`gh pr create --draft` without asking) | cli_inner_pretty.js:224097-224098 | constant |
| `fRu` | `initShippingPolicyStrings` (lazy initialiser) | cli_inner_pretty.js:224096-224110 | function |
| `pRu` | `SUBAGENT_SHIP_CARVE_OUT` | cli_inner_pretty.js:224099-224101 | constant |
| `Tiw` | `FEATURE_BRANCH_SHIPPING_POLICY` | cli_inner_pretty.js:224102-224104 | constant |
| `uRu` | `SHIP_PROHIBITIONS` (`Never push to main/master, force-push, or merge.`) | cli_inner_pretty.js:224091 | constant |

## Module: Background Agents — Status Classifier

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_Hs` | `heuristicClassifyTail` (last non-empty line → `working`) | cli_inner_pretty.js:334403-334412 | function |
| `acd` | `classifyTailShape` (independent telemetry bucket) | cli_inner_pretty.js:334269-334281 | function |
| `hA` | `DETAIL_MAX_CHARS` (800) | cli_inner_pretty.js:334461 | constant |
| `icd` | `CLASSIFIER_TAIL_MAX` (2000) | cli_inner_pretty.js:334462 | constant |
| `kHs` | `runClassifier` (preclassify → heuristic → 2-attempt LLM) | cli_inner_pretty.js:335956-336042 | function |
| `lcd` | `preclassifyTail` (17 deterministic branches, skips the LLM) | cli_inner_pretty.js:334282-334401 | function |
| `wOy` | `CLASSIFIER_STATE_DESCRIPTIONS` | cli_inner_pretty.js:334671-334679 | object |
| `WOy` | `WAIT_KIND_PRIORITY` (`sandbox`…`dialog`, first-match order) | cli_inner_pretty.js:334738 | constant |
| `xfe` | `waitRegistry` (six slots, emits on text change only) | cli_inner_pretty.js:334739-334760 | object |

## Module: Background Agents — Worktree Locks, Removal & Retention

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $Ru | REPARSE_POINT_REFUSAL ("unremovable reparse point in the worktree") | cli_inner_pretty.js:226263 | constant |
| Acs | sweepStaleWorktrees | cli_inner_pretty.js:225962-226008 | function |
| ARu | isReleasableClaudeLockReason | cli_inner_pretty.js:226041-226046 | function |
| DDt | restoreWorktreeConfig | cli_inner_pretty.js:225888-225921 | function |
| etf | DEFAULT_CLEANUP_PERIOD_DAYS (30) | cli_inner_pretty.js:665753 | constant |
| gRu | clearWindowsReparsePoint | cli_inner_pretty.js:224249-224262 | function |
| GRu | isWorktreeCleanAndPushed | cli_inner_pretty.js:225957-225961 | function |
| HVe | RESOLUTION_CHANGED_REFUSAL | cli_inner_pretty.js:226261 | constant |
| ORu | deleteWorktreeBranch | cli_inner_pretty.js:225647-225652 | function |
| oZg | GIT_UNRECOGNIZED_WORKTREE_RE | cli_inner_pretty.js:226315 | constant |
| pAa | retentionSkipReason | cli_inner_pretty.js:664931-664957 | function |
| qdo | resolveEnterableWorktree | cli_inner_pretty.js:225288-225372 | function |
| RG | retentionCutoffDate | cli_inner_pretty.js:664959-664965 | function |
| rtf | runRetentionSweep | cli_inner_pretty.js:665693-665751 | function |
| RVe | mayReleaseWorktreeLock | cli_inner_pretty.js:225069-225073 | function |
| v7r | NO_REPOSITORY_REFUSAL ("has files but no repository to verify them against") | cli_inner_pretty.js:226262 | constant |
| VNe | ensureNoReparsePoint | cli_inner_pretty.js:224244-224248 | function |
| Vor | removeRootlessAgentWorktree | cli_inner_pretty.js:225653-225719 | function |
| vpe | unlockWorktree | cli_inner_pretty.js:225644-225646 | function |
| vRu | STALE_LOCK_RELEASE_CAP (50) | cli_inner_pretty.js:226268 | constant |
| Wlt | CLAUDE_LOCK_REASON_RE | cli_inner_pretty.js:226313 | constant |
| WRu | releaseStaleClaudeWorktreeLocks | cli_inner_pretty.js:226047-226099 | function |
| Xor | worktreeLockReasonFor | cli_inner_pretty.js:225081-225086 | function |
| ycs | isLockedByLiveSession | cli_inner_pretty.js:225063-225068 | function |
| Yor | releaseWorktreeLockIfOurs | cli_inner_pretty.js:225074-225080 | function |
| zI | caseFoldPath | cli_inner_pretty.js:224238-224243 | function |
| zor | isWindowsUncPath | cli_inner_pretty.js:225285-225287 | function |

## Module: Background agents — command parking and the fleet resume picker

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _cl | listPastSessionsForFleet | cli_inner_pretty.js:801829-801852 | function |
| eN | isDetachedBackgroundSession | cli_inner_pretty.js:112712-112714 | function |
| etS | installGithubAppCommandCall | cli_inner_pretty.js:701699-701713 | function |
| Exn | activeCommandPark | cli_inner_pretty.js:700584 | variable |
| FKS | PAST_SESSION_SCAN_CAP | cli_inner_pretty.js:801853 | constant |
| gcl | isFleetEarlierRowsEnabled | cli_inner_pretty.js:801823-801825 | function |
| NP | isAgentsFleetEnabled | cli_inner_pretty.js:157277-157279 | function |
| plS | mcpCommandCall | cli_inner_pretty.js:714198-714212 | function |
| rBd | loginCommandDescriptor | cli_inner_pretty.js:455393-455401 | function |
| rs | isBackgroundSession | cli_inner_pretty.js:112709-112711 | function |
| Rxf | mcpParkedMessage | cli_inner_pretty.js:714194-714197 | function |
| SVr | isFleetPastSessionsEnabled | cli_inner_pretty.js:157287-157289 | function |
| THs | clearCommandParkBlocked | cli_inner_pretty.js:335140 | function |
| u5t | parkSessionAsNeedsInput | cli_inner_pretty.js:700561-700573 | function |
| uJi | fleetGateRejectedReason | cli_inner_pretty.js:157247-157251 | function |
| wHs | markCommandParkBlocked | cli_inner_pretty.js:335135 | function |
| xvf | armUnparkOnAttach | cli_inner_pretty.js:700574-700583 | function |
| ycl | isFleetResumePickerAllowed | cli_inner_pretty.js:801826-801828 | function |
| Zer | isFleetGateRejected | cli_inner_pretty.js:157244-157246 | function |

## Module: Budget Enforcement (`--max-budget-usd`)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$xm` | shouldHaltRunningAgentsForBudget | cli_inner_pretty.js:843431-843434 | function |
| `aVy` | persistStopMarker (writes `stoppedByUser` to the agent's file) | cli_inner_pretty.js:399905-399917 | function |
| `gmr` | stopAllRunningAgentTasks | cli_inner_pretty.js:399888-399896 | function |
| `TIe` | markTaskStoppedByUser | cli_inner_pretty.js:399897-399904 | function |
| `zcr` | isBudgetExhausted (`maxBudgetUsd !== undefined && totalCost >= it`) | cli_inner_pretty.js:308540-308542 | function |

## Module: CLI — argv fast path and launch validation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $Gb | validateBackgroundLaunchArgv | cli_inner_pretty.js:683486-683511 | function |
| $Om | describeUnparseableEntries | cli_inner_pretty.js:865375 (call) | function |
| _Al | peelDaemonSubcommandArgv | cli_inner_pretty.js:130-134 | function |
| AJo | readFlagValue | cli_inner_pretty.js:683499 (call) | function |
| eje | splitBundledShortFlags | cli_inner_pretty.js:683494 (call) | function |
| gxr | indexOfDoubleDash | cli_inner_pretty.js:683487 (call) | function |
| Jwm | permissionModeArgParser | cli_inner_pretty.js:833642-833645 | function |
| Mle | spawnBackgroundJob | cli_inner_pretty.js:682403-682421 | function |
| N$n | rejectDeepLinkWithExtraArgs | cli_inner_pretty.js:165-175 | function |
| NGb | findPositionalPrompt | cli_inner_pretty.js:683512-683526 | function |
| Ole | indicesConsumedByValueFlags | cli_inner_pretty.js:683489 (call) | function |
| OOm | describeAutoModeSections | cli_inner_pretty.js:865407-865412 | function |
| Vyl | permissionModeChoicesForHelp | cli_inner_pretty.js:833650 | variable |
| WlE | permissionModeChoicesAccepted | cli_inner_pretty.js:833650 | variable |
| ZVt | inheritedLaunchFlags | cli_inner_pretty.js:120-129 | function |

## Module: Code Review — bundled workflows and effort cells

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aRd` | CLEANUP_LENS_TEXTS | cli_inner_pretty.js:424435-424443 | constant |
| `cNs` | buildSinglePassReviewCell | cli_inner_pretty.js:423628 | function |
| `cRd` | codeReviewWorkflowModuleInit | cli_inner_pretty.js:424416-424444 | function |
| `DJy` | CORRECTNESS_ANGLES | cli_inner_pretty.js:424434 | constant |
| `dRd` | DEEP_RESEARCH_WORKFLOW_DESCRIPTION | cli_inner_pretty.js:424883-424884 | constant |
| `fRd` | DEEP_RESEARCH_PHASES | cli_inner_pretty.js:424892-424898 | constant |
| `hRd` | deepResearchWorkflowModuleInit | cli_inner_pretty.js:424889-424899 | function |
| `iRd` | CODE_REVIEW_WORKFLOW_WHEN_TO_USE | cli_inner_pretty.js:424411-424412 | constant |
| `kxo` | registerBundledWorkflow | cli_inner_pretty.js:385327-385335 | function |
| `lRd` | registerCodeReviewWorkflow | cli_inner_pretty.js:424046-424408 | function |
| `MJy` | isDeepResearchModelInvocationDisabled | cli_inner_pretty.js:424445-424448 | function |
| `mRd` | registerDeepResearchWorkflow | cli_inner_pretty.js:424449-424881 | function |
| `OJy` | initBundledWorkflows | cli_inner_pretty.js:424902-424904 | function |
| `oRd` | CODE_REVIEW_WORKFLOW_DESCRIPTION | cli_inner_pretty.js:424409-424410 | constant |
| `PJy` | DEEP_RESEARCH_MODEL_INVOCATION_GATE | cli_inner_pretty.js:424888 | constant |
| `pRd` | DEEP_RESEARCH_WORKFLOW_WHEN_TO_USE | cli_inner_pretty.js:424885-424886 | constant |
| `sRd` | CODE_REVIEW_PHASES | cli_inner_pretty.js:424420-424433 | constant |
| `SSd` | BUNDLED_WORKFLOWS | cli_inner_pretty.js:385340 | variable |
| `uRd` | DEEP_RESEARCH_WORKFLOW_NAME | cli_inner_pretty.js:424882 | constant |
| `ZId` | mediumEffortCell | cli_inner_pretty.js:423844-423875 | function |

## Module: Code Review — command dispatch, fork, stacked commands

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aNy` | dispatchForkedSlashCommand | cli_inner_pretty.js:343059-343170 | function |
| `Cdd` | buildBackgroundAgentFollowUpBlock | cli_inner_pretty.js:342123 | function |
| `epd` | STACKED_COMMAND_CAP (= 5) | cli_inner_pretty.js:344087 | constant |
| `Npr` | parseSubcommandRetarget | cli_inner_pretty.js:342641-342650 | function |
| `qTo` | shouldRunForkInBackground | cli_inner_pretty.js:342396-342399 | function |
| `RAo` | resolveCommandContext | cli_inner_pretty.js:326547-326549 | function |
| `tpd` | parseStackedSlashCommands | cli_inner_pretty.js:343833-343871 | function |
| `VTo` | launchForkedBackgroundAgent | cli_inner_pretty.js:342400 | function |

## Module: Code Review — per-conversation state (billing consent)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `E2s` | resetPerConversationState | cli_inner_pretty.js:448564-448570 | function |
| `kcn` | clearConversation | cli_inner_pretty.js:449427 | function |
| `S$d` | resetConversationAndCloseBrowser | cli_inner_pretty.js:448571-448573 | function |
| `S2s` | PER_CONVERSATION_STATE_DEFAULTS | cli_inner_pretty.js:448580-448595 | object |
| `Xa_` | PER_CONVERSATION_STATE_KEYS | cli_inner_pretty.js:448596 | constant |

## Module: Code Review — slash-command surface

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$qS` | buildUltraFallbackNotice | cli_inner_pretty.js:774534-774579 | function |
| `AqS` | isKnownCellModelFamily | cli_inner_pretty.js:774276-774278 | function |
| `Bnm` | GITHUB_COMMENT_INSTRUCTIONS | cli_inner_pretty.js:774610-774621 | constant |
| `Cir` | CODE_REVIEW_WORKFLOW_NAME | cli_inner_pretty.js:231212 | constant |
| `cMr` | codeReviewCellsByModel | cli_inner_pretty.js:774655-774678 | object |
| `DqS` | buildCodeReviewPrompt | cli_inner_pretty.js:774384-774448 | function |
| `E$y` | REVIEW_SKILL_NAMES | cli_inner_pretty.js:340271 | constant |
| `fne` | cellDescriptor | cli_inner_pretty.js:774605 | function |
| `HqS` | buildCodeReviewTrailer | cli_inner_pretty.js:774346-774349 | function |
| `icl` | parseCodeReviewArgs | cli_inner_pretty.js:774350-774377 | function |
| `iLo` | detectReviewSkillAvailability | cli_inner_pretty.js:433691-433700 | function |
| `jnm` | buildApplyFixesInstructions | cli_inner_pretty.js:774328-774345 | function |
| `Knm` | registerCodeReviewCommand | cli_inner_pretty.js:774580-774602 | function |
| `LqS` | buildCodeReviewArgumentHint | cli_inner_pretty.js:774381-774383 | function |
| `MqS` | buildFinderBudgetHint | cli_inner_pretty.js:774452-774472 | function |
| `Mse` | VERIFY_SKILL_NAME | cli_inner_pretty.js:318664 | constant |
| `PqS` | shouldPublishReviewArtifact | cli_inner_pretty.js:774449-774451 | function |
| `qnm` | REPORT_FINDINGS_REREPORT_CLAUSE | cli_inner_pretty.js:774684-774687 | constant |
| `REe` | CODE_REVIEW_SKILL_NAME | cli_inner_pretty.js:318660 | constant |
| `RqS` | buildCodeReviewDescription | cli_inner_pretty.js:774378-774380 | function |
| `scl` | resolveCellModelFamily | cli_inner_pretty.js:774279-774282 | function |
| `Spr` | slashNameForReviewSkill | cli_inner_pretty.js:340263-340265 | function |
| `trn` | SIMPLIFY_SKILL_NAME | cli_inner_pretty.js:318665 | constant |
| `Unm` | REPORT_FINDINGS_LATE_FIX_INSTRUCTIONS | cli_inner_pretty.js:774688 | constant |
| `Vnm` | resolveCodeReviewEffort | cli_inner_pretty.js:774520-774525 | function |
| `Wnm` | resolveThreadedModelEffort | cli_inner_pretty.js:774283-774286 | function |
| `wpi` | CODE_REVIEW_EFFORT_LEVELS (= `EL`, :119650) | cli_inner_pretty.js:774704 | constant |
| `xqS` | selectCodeReviewCell | cli_inner_pretty.js:774287-774312 | function |
| `Ynm` | codeReviewCommandModuleInit | cli_inner_pretty.js:774627 | function |
| `znm` | shouldRouteToWorkflow | cli_inner_pretty.js:774526-774533 | function |

## Module: Code Review — system-prompt restraint (deep research)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Kep` | AGENT_AND_WORKFLOW_RESTRAINT_CLAUSE | cli_inner_pretty.js:508111-508115 | constant |
| `Qcg` | OPUS5_PROMPT_BUNDLE_KILL_GATE | cli_inner_pretty.js:118750 | constant |
| `ZXn` | usesOpus5PromptBundle | cli_inner_pretty.js:118700-118704 | function |

## Module: Code Review — ultrareview preconditions, launch and billing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `A7d` | ultrareviewHeadlessCommand | cli_inner_pretty.js:497657-497669 | object |
| `Ape` | getReviewDurationNote | cli_inner_pretty.js:226409-226412 | function |
| `dee` | isUltrareviewUsable | cli_inner_pretty.js:226425-226427 | function |
| `E7d` | buildUltrareviewDescription | cli_inner_pretty.js:497595-497597 | function |
| `eir` | isUltrareviewFeatureEnabled | cli_inner_pretty.js:226438-226440 | function |
| `eLu` | isEmptyTreeFallbackEnabled | cli_inner_pretty.js:226422-226424 | function |
| `Epn` | ultrareviewLaunchAcknowledgementNudge | cli_inner_pretty.js:497395-497397 | function |
| `g7d` | formatLargestDiffFiles | cli_inner_pretty.js:497061-497070 | function |
| `Jdo` | buildUltrareviewEntitlementHint | cli_inner_pretty.js:226441-226457 | function |
| `JI_` | tryFetchBranchFromOrigin | cli_inner_pretty.js:497074-497130 | function |
| `jkm` | buildUltrareviewLaunchMessages | cli_inner_pretty.js:844951-844961 | function |
| `kWs` | EMPTY_TREE_SHA | cli_inner_pretty.js:497523 | constant |
| `LYe` | markUltrareviewOverageConfirmed | cli_inner_pretty.js:503512-503514 | function |
| `MFo` | checkOverageGate | cli_inner_pretty.js:497160-497179 | function |
| `nR_` | reviewPullRequestCommand | cli_inner_pretty.js:497635-497648 | object |
| `o_r` | previewInstructions | cli_inner_pretty.js:497071-497073 | function |
| `OBt` | runUltrareviewHeadless | cli_inner_pretty.js:497398-497506 | function |
| `OFo` | launchRemoteReview | cli_inner_pretty.js:497180-497394 | function |
| `OTS` | openUltrareviewConfirmDialog | cli_inner_pretty.js:733003-733054 | function |
| `PFo` | precheckLaunchScope | cli_inner_pretty.js:496639-497060 | function |
| `QI_` | suggestClosestBranchName | cli_inner_pretty.js:497131-497159 | function |
| `QRu` | ULTRAREVIEW_CONFIG_GATE | cli_inner_pretty.js:226458 | constant |
| `rR_` | buildReviewPrompt | cli_inner_pretty.js:497600-497628 | function |
| `Spn` | parseUltrareviewArgs | cli_inner_pretty.js:496622-496638 | function |
| `tLu` | getUltrareviewBlockedReason | cli_inner_pretty.js:226428-226437 | function |
| `tR_` | REVIEW_NO_ARG_PROMPT | cli_inner_pretty.js:497599 | constant |
| `v7d` | ultrareviewInteractiveCommand | cli_inner_pretty.js:497649-497656 | object |
| `Vlt` | getUltrareviewRemoteConfig | cli_inner_pretty.js:226402 | function |
| `Xdo` | getUltrareviewDiffLimits | cli_inner_pretty.js:226417-226421 | function |
| `XNe` | getReviewCostNote | cli_inner_pretty.js:226405-226408 | function |
| `y7d` | buildNoGitRepoRemediation | cli_inner_pretty.js:497507-497511 | function |
| `Z7` | isCwdHomeDirectory | cli_inner_pretty.js:497512-497520 | function |
| `ZI_` | ultrareviewHeadlessCall | cli_inner_pretty.js:497557-497590 | function |
| `ZRu` | getBughunterModelOverride | cli_inner_pretty.js:226413-226416 | function |

## Module: Compact — `/context` breakdown

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aBs` | `COMPACT_BUFFER_LABEL` (`"Compact buffer"`; 193 `Zxo`) | cli_inner_pretty.js:441780 | constant |
| `cUs` | `contextSlashCommandInteractive` (`local-jsx`, `isEnabled: () => !yn()` `:452677`) | cli_inner_pretty.js:452673 | object |
| `E2b` | `normalizeMessagesForContextView` (thin wrapper over `FE`; 193 `F_f`) | cli_inner_pretty.js:674050 | function |
| `FE` | `sliceFromLastCompactBoundary` (**carryover**, 193 `yy` `:601955 (193)`) | cli_inner_pretty.js:533381 | function |
| `igr` | `collectContextData` (non-interactive `/context` entry) | cli_inner_pretty.js:452639 | function |
| `jLo` | `buildContextUsageBreakdown` (**NEW signature** — 5 params + options; 193 `GYn` took 11 positionals) | cli_inner_pretty.js:441581 | function |
| `OUo` | `findLastCompactBoundaryIndex` (reverse scan for `X0(msg)`; 193 `aXn`) | cli_inner_pretty.js:533374 | function |
| `QMu` | `COMPACT_BUFFER_TOKENS` (`13000`; 193 `PXi`) | cli_inner_pretty.js:236926 | constant |
| `sBs` | `AUTOCOMPACT_BUFFER_LABEL` (`"Autocompact buffer"`; 193 `Qxo`) | cli_inner_pretty.js:441779 | constant |
| `uUs` | `contextSlashCommandNonInteractive` (`local`, `supportsNonInteractive: !0`; `isEnabled` `:452689`) | cli_inner_pretty.js:452681 | object |
| `ZMu` | `NON_AUTOCOMPACT_BUFFER_TOKENS` (`3000`; 193 `MXi`) | cli_inner_pretty.js:236927 | constant |

## Module: Compact — auto-compact window resolution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$ny` | `MODEL_DEFAULT_WINDOW_MODELS` (**NEW value** — 4 entries; 193 `o8d` had 2) | cli_inner_pretty.js:237103 | variable |
| `_fo` | `MIN_AUTO_COMPACT_WINDOW` (`1e5`) | cli_inner_pretty.js:237078 | constant |
| `aOu` | `resolveSurfaceScopedWindow` (entrypoint × platform) | cli_inner_pretty.js:236956 | function |
| `Bds` | `resolveExperimentAutoCompactWindow` (demoted `amber_redwood` Opus-4.8 path; 193 `P7` was a veto) | cli_inner_pretty.js:236943 | function |
| `bfo` | `getAutoCompactWindowSource` (193 `WDn`) | cli_inner_pretty.js:237011 | function |
| `Fny` | `getEffectiveBlockingWindow` (193 `i8d`) | cli_inner_pretty.js:237020 | function |
| `gfo` | `readAmberRedwoodGate` (`tengu_amber_redwood2 \ | \ | tengu_amber_redwood3`; 193 `aFt`) |
| `lOu` | `isOverBlockingLimit` (**NEW shape** — lost the Opus-4.8 conjunct; 193 `WXi`) | cli_inner_pretty.js:237068 | function |
| `Mds` | `computeAutoCompactThresholdTokens` (193 `$Zr`) | cli_inner_pretty.js:236911 | function |
| `Nds` | `MAX_AUTO_COMPACT_WINDOW` (`1e6`) | cli_inner_pretty.js:237079 | constant |
| `Nny` | `resolveClientDataWindow` (`rowan_thicket` + persisted cache; `replacesDefault`) | cli_inner_pretty.js:236974 | function |
| `nOu` | `MODEL_AUTO_COMPACT_WINDOWS` (**NEW** — `claude-sonnet-5`: `967000`, `500000` per surface; 193 `BXi = {}`) | cli_inner_pretty.js:237097 | object |
| `o7` | `resolveAutoCompactWindow` (six-tier `{window,configured,source}` ladder; 193 `xj`) | cli_inner_pretty.js:236986 | function |
| `Ony` | `resolveModelDefaultWindow` (reads `nOu`; inert when `!KI()`) | cli_inner_pretty.js:236969 | function |
| `oOu` | `pickPlatformOrDefault` | cli_inner_pretty.js:236952 | function |
| `sOu` | `AUTO_COMPACT_RESERVE_TOKENS` (`20000`; 193 `jXi`) | cli_inner_pretty.js:237077 | constant |
| `uFe` | `classifyContextLevel` (returns `{level: "compact"\ | "blocked"\ | …}`; 193 `f0e`) |
| `vSe` | `getEffectiveAutoCompactWindow` (window − reserve; 193 `Yte`) | cli_inner_pretty.js:237014 | function |
| `yXr` | `getAutoCompactThreshold` (193 `lFt`) | cli_inner_pretty.js:237060 | function |
| `zVe` | `hasExplicitAutoCompactWindow` (**NEW** — `source !== "auto"`; 193 `p0e` enumerated 4 names) | cli_inner_pretty.js:237008 | function |

## Module: Compact — auto-memory side-effect suppression (`.203`)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Gst` | `setMemoryPromptVariantOverride` (the side effect `analysisOnly` suppresses) | cli_inner_pretty.js:161289 | function |
| `iou` | `buildAutoMemoryDirPrompt` (**NEW** `analysisOnly` param) | cli_inner_pretty.js:161881 | function |
| `N$e` | `getMemoryPromptVariant` (reads `Jnu`) | cli_inner_pretty.js:161292 | function |
| `XVr` | `buildAutoMemoryPrompt` (**NEW** `analysisOnly` param) | cli_inner_pretty.js:161743 | function |

## Module: Compact — dispatcher and circuit breakers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `cOu` | `RAPID_REFILL_TURN_WINDOW` (`3`; 193 `VXi`) | cli_inner_pretty.js:237115 | constant |
| `ESe` | `isReactiveCompactAllowed` (gate `tengu_reactive_compact_remote`; 193 `M7`) | cli_inner_pretty.js:236849 | function |
| `FHs` | `autoCompactDispatcher` (async generator; returns the `{kind}` union; 193 `Rxo`) | cli_inner_pretty.js:441115 | function |
| `Gds` | `makeCompactedTurnState` (resets `consecutiveFailures: 0`) | cli_inner_pretty.js:237112 | function |
| `GMd` | `COMPACT_FAILURE_BREAKER_THRESHOLD` (`3`; **carryover**, 193 `ISl` `:470357 (193)`) | cli_inner_pretty.js:441233 | constant |
| `Gny` | `computeRapidRefillCount` (193 `u8d`) | cli_inner_pretty.js:237105 | function |
| `jir` | `isCompactQuerySource` (`e === "compact"`; 193 `dat`) | cli_inner_pretty.js:236858 | function |
| `jMd` | `recordCompactionFailure` (**carryover**, 193 `CSl` `:470189 (193)`) | cli_inner_pretty.js:441054 | function |
| `KI` | `isAutoCompactEnabled` (`DISABLE_COMPACT` → `DISABLE_AUTO_COMPACT` → `autoCompactEnabled`) | cli_inner_pretty.js:236844 | function |
| `Kn_` | `computeFixedPrefixOverflow` (feeds `tengu_auto_compact_prefix_overflow`; 193 `acf`) | cli_inner_pretty.js:441068 | function |
| `Pko` | `compactConversation` (summarization driver; 193 `Aht`) | cli_inner_pretty.js:440219 | function |
| `vfo` | `evaluateRapidRefillBreaker` (`{action:"trip"\ | "proceed"}`; 193 `VDn`) | cli_inner_pretty.js:237108 |
| `Wds` | `RAPID_REFILL_THRASH_MESSAGE` (surfaced at `:337487`, `:338715`) | cli_inner_pretty.js:237116 | constant |
| `Xn_` | `shouldAutoCompact` (**NEW shape** — lost the Opus-4.8 conjunct, gained `agentContext`; 193 `lcf`) | cli_inner_pretty.js:441103 | function |
| `Yn_` | `isColdCompactEnabled` (`CLAUDE_CODE_COLD_COMPACT`; 193 `Xxo`) | cli_inner_pretty.js:441100 | function |
| `zn_` | `isRecognisedCompactionFailure` (4-disjunct; 193 `icf`) | cli_inner_pretty.js:441051 | function |

## Module: Compact — extended-thinking inheritance

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `jOu` | `thinkingConfigFromBudget` (`0` → disabled, else `{type:"enabled",budgetTokens}`) | cli_inner_pretty.js:237871 | function |
| `SXr` | `resolveEffectiveThinkingConfig` (**NEW** — replaced 193's `oVn(model) ? … : {type:"disabled"}`) | cli_inner_pretty.js:237866 | function |
| `yBc` | `resolveSubagentThinkingDisplay` (**NEW**; overlaps `51_headless_sdk`; 193's `yBc` `:9245 (193)` is unrelated) | cli_inner_pretty.js:119662 | function |

## Module: Compact — precomputed compaction

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `nwo` | `runReactiveCompaction` (193 `jKn`) | cli_inner_pretty.js:329022 | function |
| — | `validateRehydratedPrecompute` (**NEW** — `too_old` / `boundary_missing` / `grew_too_much` / `shrank_too_much`) | cli_inner_pretty.js:328486-328492 | function |
| — | `tengu_precomputed_compact_rehydrated` (**NEW**, 220=1/193=0) | cli_inner_pretty.js:328512 | constant |
| — | `tengu_precomputed_compact_rehydrate_rejected` (**NEW**, 220=1/193=0) | cli_inner_pretty.js:328523 | constant |
| — | `tengu_precomputed_compact_persisted` (**NEW**, 220=1/193=0) | cli_inner_pretty.js:328553 | constant |

## Module: Compact — request-size and resume diagnostics

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Bls` | `MAX_REQUEST_BYTES` (`33554432`) | cli_inner_pretty.js:222501 | constant |
| `fir` | `buildUnprocessableAttachmentMessage` | cli_inner_pretty.js:228182 | function |
| `fpo` | `buildImageTooLargeMessage` | cli_inner_pretty.js:228171 | function |
| `Qcs` | `buildRequestTooLargeAttachmentMessage` (**NEW**, 220=2/193=0; names `/compact` as the remedy) | cli_inner_pretty.js:228176 | function |
| `sUo` | `warnUnchainedResumeTranscript` (**NEW** — `tengu_resume_unchained_transcript` `:525013`) | cli_inner_pretty.js:524997 | function |
| `zW` | `PROMPT_TOO_LONG_PREFIX` (`"Prompt is too long"`; **carryover**, 193 `dF` `:237968 (193)`) | cli_inner_pretty.js:228935 | constant |

## Module: Compact — transcript-file compaction (disk GC; **not** conversation compaction)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `rB_` | `TRANSCRIPT_COMPACT_YIELD_FRACTION` (`0.1`; used in the backstop test at `:523963`) | cli_inner_pretty.js:527407 | constant |
| `tB_` | `TRANSCRIPT_BACKSTOP_MAX_BYTES` (`8 * tbr` assigned at `:527550`; declared `:527406`) | cli_inner_pretty.js:527550 | constant |
| `tbr` | `TRANSCRIPT_BACKSTOP_BASE_BYTES` (`20971520` = 20 MiB) | cli_inner_pretty.js:527405 | constant |
| — | `tengu_transcript_compact_failed` (**NEW**; 6 reasons, all file-level) | cli_inner_pretty.js:523812 | constant |
| — | `tengu_transcript_compact` (**NEW**, `{bytesBefore, bytesAfter}`) | cli_inner_pretty.js:523965 | constant |

## Module: Headless Exit Path

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `eVs` | exitProcessHard | cli_inner_pretty.js:522156 | function |
| `GF_` | FORCED_EXIT_WATCHDOG_SLACK_MS | cli_inner_pretty.js:522406 | constant |
| `Oip` | reportStartupFailureAndExit | cli_inner_pretty.js:522195 | function |
| `Pip` | STARTUP_FAILURE_REPORT_DELAY_MS | cli_inner_pretty.js:522398 | constant |
| `Q8s` | armForcedExitWatchdog | cli_inner_pretty.js:522210 | function |
| `T_l` | fatalStreamInputError | cli_inner_pretty.js:840578 | function |
| `Uip` | finalDrainAndExit | cli_inner_pretty.js:522373 | function |
| `zUe` | forcedExitTimer | cli_inner_pretty.js:522402 | variable |

## Module: Headless Process IO (stdout drain, stdin guard)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Bzt` | handleStreamGoneErrors | cli_inner_pretty.js:20520 | function |
| `dCi` | registerProcessIOErrorHandlers | cli_inner_pretty.js:20530 | function |
| `dIl` | writeIfWritable | cli_inner_pretty.js:20538 | function |
| `f9m` | STDOUT_ASSUMED_BYTES_PER_SEC | cli_inner_pretty.js:20646 | constant |
| `fCi` | iterateStreamUntilClose | cli_inner_pretty.js:20612 | function |
| `fIl` | stdoutBytesQueued | cli_inner_pretty.js:20641 | variable |
| `fWe` | markStdoutDrainExternallyClocked | cli_inner_pretty.js:20561 | function |
| `g9m` | waitForStdoutQueueEmpty | cli_inner_pretty.js:20581 | function |
| `gIl` | queuedStdoutBytes | cli_inner_pretty.js:20572 | function |
| `h9m` | _resetStdoutErrorLatchForTesting | cli_inner_pretty.js:20575 | function |
| `hIl` | stdoutExternalClockPromise | cli_inner_pretty.js:20564 | function |
| `Js` | writeToStdout | cli_inner_pretty.js:20542 | function |
| `jzt` | drainStdoutBeforeExit | cli_inner_pretty.js:20552 | function |
| `K0t` | PROCESS_IO_MODULE | cli_inner_pretty.js:20501 | object |
| `lCi` | stdoutEndPromise | cli_inner_pretty.js:20640 | variable |
| `m9m` | STDOUT_MAX_DRAIN_MS | cli_inner_pretty.js:20647 | constant |
| `mIl` | stdoutBytesFlushed | cli_inner_pretty.js:20642 | variable |
| `MUn` | onStdoutQueueDrained | cli_inner_pretty.js:20643 | variable |
| `Oa` | withTimeout | cli_inner_pretty.js:20483 | function |
| `OUn` | getStdoutDrainBudgetMs | cli_inner_pretty.js:20578 | function |
| `p9m` | externalClockGrace | cli_inner_pretty.js:20569 | function |
| `PBr` | peekForStdinData | cli_inner_pretty.js:20597 | function |
| `pCi` | stdoutErrorLatched | cli_inner_pretty.js:20648 | variable |
| `pIl` | everWroteToStdout | cli_inner_pretty.js:20639 | variable |
| `u9m` | STDIN_UNUSABLE_CODES | cli_inner_pretty.js:20652 | constant |
| `uIl` | STREAM_GONE_CODES | cli_inner_pretty.js:20652 | constant |
| `Uzt` | isStdinUnusableError | cli_inner_pretty.js:20516 | function |
| `vr` | delay | cli_inner_pretty.js:20457 | function |
| `y9m` | exitWithError | cli_inner_pretty.js:20594 | function |

## Module: Headless stream-json Input

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `dEm` | getInputPrompt | cli_inner_pretty.js:828110 | function |
| `duf` | readBgStdin | cli_inner_pretty.js:682687 | function |
| `JOn` | StdinControlTransport | cli_inner_pretty.js:839898 | class |
| `LiE` | getStreamJsonStdinIterator | cli_inner_pretty.js:828098 | function |
| `SU` | stripBom | cli_inner_pretty.js:57355 | function |
| `uEm` | MAX_PIPED_STDIN_BYTES | cli_inner_pretty.js:828148 | constant |

## Module: Headless stream-json Output

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Cm` | installStreamJsonStdoutGuard | cli_inner_pretty.js:841083 | function |
| `AMe` | stdoutGuardPendingBuffer | cli_inner_pretty.js:841132 | variable |
| `c1r` | writeStreamJsonFatalResult | cli_inner_pretty.js:849670 | function |
| `F_l` | resetTextOutputAccumulator | cli_inner_pretty.js:843326 | function |
| `k_l` | stdoutGuardInstalled | cli_inner_pretty.js:841131 | variable |
| `MCm` | STDOUT_GUARD_PREFIX | cli_inner_pretty.js:841130 | constant |
| `OCm` | isParseableJsonLine | cli_inner_pretty.js:841075 | function |
| `Ogi` | notifyRunFailedSummary | cli_inner_pretty.js:849666 | function |
| `Qwt` | originalStdoutWrite | cli_inner_pretty.js:841133 | variable |
| `Txm` | feedTextOutputAccumulator | cli_inner_pretty.js:843302 | function |
| `vpE` | INCOMPLETE_RESPONSE_NOTICE | cli_inner_pretty.js:843329 | constant |
| `wxm` | makeTextOutputAccumulator | cli_inner_pretty.js:843299 | function |

## Module: Hooks — Notification event

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `h9` | `fireNotificationHook` (`notification_type` doubles as `matchQuery`) | cli_inner_pretty.js:518948-518952 | function |

## Module: Hooks — `DirectoryAdded` call sites

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Axb` | `addDirectoryCommandCall` (`/add-dir`; hook dispatch :655138) | cli_inner_pretty.js:655118 | function |
| `bs` | `startKeepAlive` (30 s `keep_alive` frames; wraps the SDK hook dispatch) | cli_inner_pretty.js:847193 | function |
| `ke` | `handleRegisterRepoRoot` (3 pre-conditions; hook dispatch :847256) | cli_inner_pretty.js:847216 | function |
| `ZYp` | `addDirectoryErrorView` (`/add-dir` failure JSX) | cli_inner_pretty.js:655097 | function |

## Module: Hooks — async hook backgrounding

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Cke` | `isAsyncHookResponse` | cli_inner_pretty.js:520091 | function |
| `ee` | `onStderrChunk` (named so it can be detached at :520108) | cli_inner_pretty.js:520081 | function |
| `fip` | `registerBackgroundHookProcess` (return value gates the detach) | cli_inner_pretty.js:520095 | function |
| `Nuo` | `registerHookOutputAccessor` | cli_inner_pretty.js:520119 | function |
| `te` | `onStdoutChunk` (named so it can be detached at :520107) | cli_inner_pretty.js:520084 | function |

## Module: Hooks — dispatchers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_nd` | `runSetupHooks` (orchestrator; `Pur` call at :319604) | cli_inner_pretty.js:319581 | function |
| `a2t` | `executeDirectoryAddedHooks` **[export-table]** (NET-NEW `.219`) | cli_inner_pretty.js:518817 | function |
| `Atn` | `executeFileChangedHooks` **[export-table]** | cli_inner_pretty.js:518900 | function |
| `grn` | `executeSessionStartHooks` **[export-table]** | cli_inner_pretty.js:518956 | function |
| `HBe` | `runSessionStartHooks` (orchestrator; `"fork"` source at :320414) | cli_inner_pretty.js:319521 | function |
| `Kon` | `executeSubagentStartHooks` **[export-table]** | cli_inner_pretty.js:518985 | function |
| `oOt` | `executeElicitationHooks` **[export-table]** | cli_inner_pretty.js:518826 | function |
| `slt` | `executeConfigChangeHooks` **[export-table]** | cli_inner_pretty.js:518808 | function |
| `VEe` | `executeStopHooks` **[export-table]** (also `SubagentStop`) | cli_inner_pretty.js:519231 | function |
| `VOt` | `executePreToolHooks` **[export-table]** | cli_inner_pretty.js:317054 | function |
| `vtn` | `executeCwdChangedHooks` **[export-table]** | cli_inner_pretty.js:518896 | function |
| `yrn` | `executeSetupHooks` **[export-table]** | cli_inner_pretty.js:518974 | function |

## Module: Hooks — execution and result handling

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$F_` | `rewritePlaceholdersForPowerShell` (`${VAR}` → `${env:VAR}`) | cli_inner_pretty.js:521987 | function |
| `Afn` | `getUserPromptSubmitHookBlockingMessage` **[export-table]** | cli_inner_pretty.js:520564 | function |
| `bOs` | `getPreToolHookBlockingMessage` **[export-table]** | cli_inner_pretty.js:520536 | function |
| `bVy` | `PRE_TOOL_HOOK_TIMEOUT_STOP_REASON` (NET-NEW `.212`) | cli_inner_pretty.js:401111 | constant |
| `Cke` | `isAsyncHookResponse` | cli_inner_pretty.js:215213 | function |
| `EM` | `executeHooksOutsideREPL` **[export-table]** (batch; trust gate at :521559) | cli_inner_pretty.js:521555 | function |
| `FW` | `hookStatusLabel` (`statusMessage` ?? `describeHook`) | cli_inner_pretty.js:215877 | function |
| `HB` | `isSyncHookResponse` | cli_inner_pretty.js:215210 | function |
| `jYe` | `persistHookOutput` **[export-table]** (spill over `TCu` = 1e4) | cli_inner_pretty.js:519669 | function |
| `lM` | `executeHooks` **[export-table]** (streaming generator) | cli_inner_pretty.js:520573 | function |
| `MF_` | `invokeSdkCallbackHook` | cli_inner_pretty.js:521937 | function |
| `mip` | `hasSurfacedHookSpawnFailure` (once per `<event>:<command>`; NET-NEW) | cli_inner_pretty.js:520567 | function |
| `Mzg` | `HOOK_JSON_OUTPUT_SCHEMA` (zod; `continue`/`stopReason`/`hookSpecificOutput`) | cli_inner_pretty.js:215221 | object |
| `PF_` | `invokeFunctionHook` | cli_inner_pretty.js:521900 | function |
| `Pur` | `getNonBlockableHookErrorMessage` **[export-table]** (NET-NEW `.199`) | cli_inner_pretty.js:520551 | function |
| `pxu` | `salvageAsyncHookJson` (NET-NEW, undocumented; call site :216813) | cli_inner_pretty.js:216665 | function |
| `q2o` | `spawnHookCommand` (env build, exec-vs-shell, `child_process.spawn`) | cli_inner_pretty.js:519921 | function |
| `qUe` | `emitHookMetrics` **[export-table]** | cli_inner_pretty.js:520303 | function |
| `rSe` | `describeHook` (command/prompt/agent/http/mcp_tool renderer) | cli_inner_pretty.js:215859 | function |
| `Sip` | `parseHttpHookBody` (empty body → `{}`) | cli_inner_pretty.js:519710 | function |
| `TN` | `recordHookOutcome` | cli_inner_pretty.js:216615 | function |
| `UAd` | `PRE_TOOL_HOOK_ERROR_STOP_REASON` (NET-NEW `.212`) | cli_inner_pretty.js:401113 | constant |
| `vfn` | `applyHookJsonOutput` (maps validated JSON onto the result record) | cli_inner_pretty.js:519729 | function |
| `W2o` | `parseHookStdout` (JSON parse + zod + expected-schema dump :519700) | cli_inner_pretty.js:519695 | function |
| `wlt` | `getHookJsonOutputSchema` (memoised `Mzg`) | cli_inner_pretty.js:215334 | variable |
| `yan` | `runPreToolUseHooks` (the `.212` error-attribution catch chain :401044-401107) | cli_inner_pretty.js:400931 | function |

## Module: Hooks — registry and event surface

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_ip` | `ASYNC_REWAKE_FLUSH_TIMEOUT_MS` **[export-table]** (`30000`) | cli_inner_pretty.js:521998 | constant |
| `AF_` | `HOOK_EVENT_REGISTRY` **[export-table]** (event → dispatcher, 31 keys) | cli_inner_pretty.js:519419 | object |
| `auE` | `DIRECTORY_ADDED_HOOK_INPUT_SCHEMA` (SDK zod, `directory` + `source`) | cli_inner_pretty.js:835978 | object |
| `CF_` | `HOOK_PROGRESS_TICK_MS` (`300`) | cli_inner_pretty.js:521999 | constant |
| `Hm` | `DEFAULT_HOOK_TIMEOUT_MS` (`600000`; carryover, `tp` :396991 (193)) | cli_inner_pretty.js:317052 | constant |
| `kF_` | `TOOL_MATCHED_HOOK_EVENTS` (5 events whose match query is a tool name) | cli_inner_pretty.js:522101 | constant |
| `lB` | `HOOK_EVENT_NAMES` (31-entry master enum; `DirectoryAdded` at :49396) | cli_inner_pretty.js:49367 | constant |
| `LF_` | `MAX_HOOK_PLUGIN_METRICS` (`20`) | cli_inner_pretty.js:522002 | constant |
| `o3r` | `HOOK_IF_CONDITION_SCHEMA` (zod; description carryover 1/1) | cli_inner_pretty.js:58703 | object |
| `P2o` | `SESSION_END_HOOK_TIMEOUT_MS_DEFAULT` **[export-table]** (`1500`) | cli_inner_pretty.js:521995 | constant |
| `TCu` | `MAX_INLINE_HOOK_OUTPUT_CHARS` (`1e4`) | cli_inner_pretty.js:215345 | constant |
| `uHh` | `buildHookConfigSchemas` (command/prompt/mcp_tool/http/agent union) | cli_inner_pretty.js:58550 | function |
| `wF_` | `HOOK_HTTP_TIMEOUT_MS` (`60000`) | cli_inner_pretty.js:521996 | constant |
| `xF_` | `LIST_FORM_MATCHER_EVENTS` (19 events; `DirectoryAdded` at :522099) | cli_inner_pretty.js:522080 | constant |

## Module: Hooks — selection (matcher and `if:`)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `DF_` | `collectHooksForEvent` (managed → settings → plugin → session registry) | cli_inner_pretty.js:520317 | function |
| `E4` | `hasHookForEvent` **[export-table]** | cli_inner_pretty.js:520347 | function |
| `Efn` | `hookDedupKeyPrefix` (`pluginRoot\ | skillRoot` + `\x00`) | cli_inner_pretty.js:520261 |
| `Eip` | `isBareMcpServerMatcher` **[export-table]** (NET-NEW `.195`) | cli_inner_pretty.js:520197 | function |
| `HF_` | `warnIfBareMcpServerMatcher` (NET-NEW `.195`; `See CHANGELOG v2.1.195` :520215) | cli_inner_pretty.js:520204 | function |
| `IF_` | `hookMatcherMatches` (list-form vs unanchored-regex; class at :520221) | cli_inner_pretty.js:520219 | function |
| `ij` | `canonicalToolName` (legacy tool-name alias map `bMi`) | cli_inner_pretty.js:60285 | function |
| `JEi` | `getBareMcpServerMatchersWarned` **[export-table]** (session Set) | cli_inner_pretty.js:3758 | function |
| `pWn` | `expandToolAliases` (adds the session alias for a tool) | cli_inner_pretty.js:60293 | function |
| `q8s` | `getMatchingHooks` **[export-table]** (match-query switch :520364-520417) | cli_inner_pretty.js:520359 | function |
| `RF_` | `buildRuleContentMatcher` (`undefined` for non-tool events → hook skipped) | cli_inner_pretty.js:520238 | function |
| `S7t` | `reverseSessionAliases` | cli_inner_pretty.js:60297 | function |
| `Tip` | `countHooksByType` | cli_inner_pretty.js:520312 | function |
| `uWn` | `legacyAliasesOf` | cli_inner_pretty.js:60288 | function |
| `V2o` | `isFirstPartyPluginId` (`@`-suffix + `Lw` check) | cli_inner_pretty.js:520264 | function |
| `vip` | `isInternalCallbackHook` | cli_inner_pretty.js:520258 | function |
| `W8s` | `getPluginHookCounts` **[export-table]** | cli_inner_pretty.js:520271 | function |

## Module: Hooks — shared helpers referenced from hook docs

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `cv` | `globalConfigPath` (`~/.claude.json` or `CLAUDE_CONFIG_DIR`) | cli_inner_pretty.js:30751 | variable |
| `Cze` | `matchesPathRule` **[export-table]** (hook `if:`; `yap(gap(n), !0)` at :528541) | cli_inner_pretty.js:528537 | function |
| `Dpr` | `isPathPersistedTrusted` **[export-table]** | cli_inner_pretty.js:535961 | function |
| `fg` | `parsePermissionRuleString` (`Tool(content)` → `{toolName, ruleContent}`) | cli_inner_pretty.js:60333 | function |
| `gap` | `sanitizeGitignoreSigils` (collapse `//`; escape BOM-prefixed `!`/`#`) | cli_inner_pretty.js:528448 | function |
| `gu` | `findCanonicalGitRoot` **[export-table]** | cli_inner_pretty.js:56190 | variable |
| `Ip` | `isCancellationError` (4-way: `tl`/`xy`/`AbortError`/`__CANCEL__`) | cli_inner_pretty.js:19577 | function |
| `jon` | `getPersistedTrustKeyForPath` **[export-table]** | cli_inner_pretty.js:535968 | function |
| `qOe` | `normalizePathSeparators` | cli_inner_pretty.js:51883 | function |
| `Txe` | `isProjectScopeTrustAccepted` **[export-table]** (non-interactive ⇒ true) | cli_inner_pretty.js:535955 | function |
| `Va` | `createAttachmentMessage` **[export-table]** | cli_inner_pretty.js:516567 | function |
| `vB` | `isWorkspacePersistedTrusted` **[export-table]** | cli_inner_pretty.js:535958 | function |
| `wW` | `getWorkspacePersistedTrustKey` **[export-table]** | cli_inner_pretty.js:535965 | function |
| `yE` | `ControlStreamClosedError` (`class yE extends tl {}`) | cli_inner_pretty.js:19767 | class |
| `yn` | `isNonInteractiveSession` | cli_inner_pretty.js:3286 | function |

## Module: Hooks — trust and origin

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$To` | `hasAnyFrontmatterHooks` (deep emptiness test over `lB`) | cli_inner_pretty.js:342071 | function |
| `Add` | `registerFrontmatterHooks` (byte-identical to `VKa` :382414 (193)) | cli_inner_pretty.js:342080 | function |
| `Edd` | `escapeInvisibles` (C1 / `\p{Cf}` / U+2028-9 → `\uXXXX`) | cli_inner_pretty.js:342039 | function |
| `GYe` | `shouldSkipHookDueToTrust` **[export-table]** (session gate; 7/7 carryover) | cli_inner_pretty.js:519618 | function |
| `gzg` | `ALWAYS_TRUSTED_SETTING_SOURCES` (plugin/policySettings/built-in/builtin/bundled) | cli_inner_pretty.js:214491 | constant |
| `lor` | `wouldSubstituteUserConfig` (fail-closed: bare `catch` returns true) | cli_inner_pretty.js:214417 | function |
| `m_` | `scrubControlChars` (`\p{Cc}\p{Cf}` runs → space) | cli_inner_pretty.js:217537 | function |
| `MTo` | `isAgentHookOriginTrusted` (NET-NEW `.218`) | cli_inner_pretty.js:342023 | function |
| `OTo` | `logAgentHooksOriginUntrusted` (NET-NEW `.218`; gate at :342054) | cli_inner_pretty.js:342046 | function |
| `owt` | `applyMainThreadAgentHooks` (`OTo(e, "mainThread")` at :762237) | cli_inner_pretty.js:762226 | function |
| `sDt` | `substituteUserConfig` (textual replace; throws on unset option) | cli_inner_pretty.js:214407 | function |
| `U$y` | `agentHookTrustKey` | cli_inner_pretty.js:342029 | function |
| `vdd` | `agentTrustRoot` (`<p>/.claude/agents` → `<p>`) | cli_inner_pretty.js:342033 | function |
| `vke` | `isAlwaysTrustedSource` | cli_inner_pretty.js:214485 | function |
| `wip` | `getAnthropicCredentialsForOfficialPluginHook` **[export-table]** | cli_inner_pretty.js:520295 | function |
| `YC` | `isStrictPluginOnlyCustomization` | cli_inner_pretty.js:214479 | function |

## Module: Live Model Switch (cross-cutting with `47_models`)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `cud` | modelChangedSince | cli_inner_pretty.js:336901 | function |
| `fxm` | formatUnrecognizedModelError | cli_inner_pretty.js:843115 | function |
| `lud` | resolveRoundTripModel | cli_inner_pretty.js:336898 | function |
| `O_l` | suggestNearestModelId | cli_inner_pretty.js:843110 | function |
| `pxm` | classifyModelRequest | cli_inner_pretty.js:843087 | function |
| `xud` | runQueryTurns | cli_inner_pretty.js:337348 | function |
| `ypE` | classifyUnrecognizedModelShape | cli_inner_pretty.js:843101 | function |

## Module: Performance — installer/updater download retry

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Dbr` | `MAX_DOWNLOAD_ATTEMPTS` (`3`) | cli_inner_pretty.js:540392 | constant |

## Module: Plan Mode — approval dialog and exit

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `e7f` | `buildPlanApprovalAnswer` (consolidated; `Tar` `:640586 (193)` had 4 call sites) | cli_inner_pretty.js:761160 | function |
| `gpt` | `ensurePlansDirectory` | cli_inner_pretty.js:527741 | function |
| `gqt` | `setPlanPublishStatus` | cli_inner_pretty.js:761257 | function |
| `hN` | `EXIT_PLAN_MODE_TOOL_NAME` (`"ExitPlanMode"`) | cli_inner_pretty.js:162389 | constant |
| `Kze` | `scheduleFileSnapshot` (plan + workshop doc) | cli_inner_pretty.js:527927 | function |
| `Lnl` | `logPlanReviewStep` (`tengu_plan_review_step`, **220=1/193=0**) | cli_inner_pretty.js:761410 | function |
| `Mnl` | `markPublishedPlanStale` | cli_inner_pretty.js:761667 | function |
| `S6` | `ExitPlanModeV2Tool` | cli_inner_pretty.js:325968 | object |
| `v4` | `readPlanFile` | cli_inner_pretty.js:527779 | function |
| `VB` | `getPlanFilePath` | cli_inner_pretty.js:527750 | function |
| `YYf` | `nameSessionFromPlan` (first 1,000 chars → session name) | cli_inner_pretty.js:761072 | function |
| `znl` | `PlanApprovalDialog` | cli_inner_pretty.js:761198 | function |
| `Zui` | `onPlanReviewChoice` (`proceed` / `review-artifact` / `skip`) | cli_inner_pretty.js:761422 | function |

## Module: Plan Mode — browser read-only classification

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Es` | `getClaudeInChromePermissionOverrides` (read-only allow `:289356`, plan passthrough `:289440`) | cli_inner_pretty.js:289344 | function |
| `_rp` | `ARGUMENT_DEPENDENT_BROWSER_TOOLS_QUALIFIED` (`len` × 4 prefixes) | cli_inner_pretty.js:513012 | constant |
| `Arp` | `isStrictReadOnlyComputerAction` (`U1_` ∧ `Vqs`) | cli_inner_pretty.js:512905 | function |
| `B1_` | `STRICT_READ_ONLY_BROWSER_TOOL_NAMES` (`vrp` × 4 prefixes) | cli_inner_pretty.js:513038 | constant |
| `BEy` | `browserBatchNeedsPermission` (`some()`, fails closed) | cli_inner_pretty.js:289288 | function |
| `brp` | `QUALIFIED_COMPUTER_TOOL_NAMES` | cli_inner_pretty.js:513016 | constant |
| `COl` | `BROWSER_SELECTION_TOOL_NAMES` (carryover of `TJo` `:12547 (193)`) | cli_inner_pretty.js:34686 | constant |
| `cOt` | `isReadOnlyBrowserCall` | cli_inner_pretty.js:288994 | function |
| `DEs` | `tabsContextIsReadOnly` (`!input.createIfEmpty`) | cli_inner_pretty.js:288988 | function |
| `FEy` | `firstPromptWorthyBatchAction` | cli_inner_pretty.js:289271 | function |
| `len` | `ARGUMENT_DEPENDENT_BROWSER_TOOLS` (3 names → predicate) | cli_inner_pretty.js:289002 | constant |
| `M1_` | `LENIENT_READ_ONLY_BROWSER_TOOL_NAMES` (`yrp` × 4 prefixes + preview tab verbs) | cli_inner_pretty.js:513008 | constant |
| `M_r` | `BROWSER_TOOL_NAME_PREFIXES` (4 spellings) | cli_inner_pretty.js:512997 | constant |
| `n2o` | `isStrictlyReadOnlyBrowserTool` (plan-mode floor exemption) | cli_inner_pretty.js:512911 | function |
| `O1_` | `LENIENT_READ_ONLY_COMPUTER_ACTIONS` (18 actions) | cli_inner_pretty.js:513018 | constant |
| `OKt` | `BROWSER_AUTO_ALLOW_TOOL_NAMES` (9 names; **carryover** of `Kvt` `:12536 (193)`) | cli_inner_pretty.js:34675 | constant |
| `r2o` | `isBrowserToolName` (prefix test over `M_r`) | cli_inner_pretty.js:512870 | function |
| `t2o` | `PREVIEW_BROWSER_PREFIXES` (**220=2/193=0**) | cli_inner_pretty.js:512996 | constant |
| `U1_` | `STRICT_READ_ONLY_COMPUTER_ACTIONS` (5 actions) | cli_inner_pretty.js:513039 | constant |
| `uen` | `describeBrowserAction` | cli_inner_pretty.js:289069 | function |
| `UEy` | `buildChromePermissionPromptTitle` | cli_inner_pretty.js:289295 | function |
| `uOt` | `isPlainObject` | cli_inner_pretty.js:289053 | function |
| `vEy` | `UNCONDITIONALLY_READ_ONLY_BROWSER_TOOLS` (5 names) | cli_inner_pretty.js:289007 | constant |
| `Vqs` | `isLenientReadOnlyComputerAction` (`O1_` ∧ `!save_to_disk`) | cli_inner_pretty.js:512876 | function |
| `wEy` | `BROWSER_TOOL_DESCRIPTIONS` (14 phrases; each **220=1/193=0**) | cli_inner_pretty.js:289091 | object |
| `X9u` | `COMPUTER_ACTION_DESCRIPTIONS` (18 phrases) | cli_inner_pretty.js:289107 | object |
| `xEy` | `describeBrowserBatchActions` (skips read-only sub-actions) | cli_inner_pretty.js:289056 | function |
| `z9u` | `bufferReadIsReadOnly` (`!input.clear`) | cli_inner_pretty.js:288991 | function |
| `zqs` | `isAutoModeAllowlistedTool` (lenient predicate; `rWf` `:597321 (193)`) | cli_inner_pretty.js:512892 | function |

## Module: Plan Mode — mode predicates and auto-mode activation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$N` | `setAutoModeActive` (writes `vfe.active`) | cli_inner_pretty.js:325866 | function |
| `A9` | `isAutoModeActive` (reads `vfe.active`) | cli_inner_pretty.js:325869 | function |
| `Bcn` | `transitionPlanAutoMode` | cli_inner_pretty.js:529762 | function |
| `bdr` | `prepareContextForPlanMode` (transition path; calls `Kfn` at `:529754`) | cli_inner_pretty.js:529746 | function |
| `Dte` | `stripDangerousPermissionsForAutoMode` | cli_inner_pretty.js:529287 | function |
| `gnn` | `isAutoModePermissionSurface` (`auto` OR `plan`+auto; **220=1/193=0**) | cli_inner_pretty.js:325872 | function |
| `gRe` | `restoreDangerousPermissions` | cli_inner_pretty.js:529301 | function |
| `Kfn` | `activatePlanAutoMode` (**220-only extraction**; export literal `:529177`) | cli_inner_pretty.js:529742 | function |
| `Prp` | `decisionReasonIsPlanMode` (`{type:"mode", mode:"plan"}`) | cli_inner_pretty.js:513484 | function |
| `Qqs` | `isAutoOrPlanAutoMode` (classifier-block entry test) | cli_inner_pretty.js:513122 | function |
| `tcr` | `isPlanMode` (`ctx.mode === "plan"`; **220=5/193=0**) | cli_inner_pretty.js:289037 | function |
| `vfe` | `autoModeState` (module-global; declared `:325908`, initialised `:325910` from `Yid()` `:325856`) | cli_inner_pretty.js:325908 | variable |
| `Vfn` | `verifyAutoModeGateAccess` (born-in-plan branch at `:529638`) | cli_inner_pretty.js:529614 | function |
| `xUo` | `shouldPlanUseAutoMode` (`gk() && YMi()`) | cli_inner_pretty.js:529739 | function |
| `YMi` | `resolveUseAutoModeDuringPlan` (4-layer settings, carryover 11/11) | cli_inner_pretty.js:63540 | function |

## Module: Plan Mode — permission-pipeline guards

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bft` | `checkRuleBasedPermissions` (plan guard `:513525`) | cli_inner_pretty.js:513506 | function |
| `cM` | `hasPermissionsToUseTool` | cli_inner_pretty.js:513703 | variable |
| `cvd` | `sandboxedBashAutoAllowAst` (plan guard `:393890`) | cli_inner_pretty.js:393889 | function |
| `Dqy` | `isAcceptEditsAutoAllowedCommand` | cli_inner_pretty.js:393483 | function |
| `Erp` | `matchBatchSubActionPredicate` | cli_inner_pretty.js:512884 | function |
| `H4` | `isSandboxableBashInput` | cli_inner_pretty.js:512818 | function |
| `Lqy` | `ACCEPT_EDITS_FILE_COMMANDS` (`mkdir touch rm rmdir mv cp sed`) | cli_inner_pretty.js:393515 | constant |
| `o$_` | `checkToolPermissions` (plan floor `:513586-513594`; guard `:513574`) | cli_inner_pretty.js:513554 | function |
| `oNt` | `hasPermissionsToUseToolWithSink` | cli_inner_pretty.js:513707 | variable |
| `ovd` | `bashModeSpecificCheck` | cli_inner_pretty.js:393494 | function |
| `P1_` | `AUTO_MODE_SAFE_TOOLS` (~23 built-ins; no Bash) | cli_inner_pretty.js:512965 | constant |
| `Pqy` | `bashAcceptEditsModeAllow` | cli_inner_pretty.js:393486 | function |
| `pvd` | `relaxCircuitBreakerAskForBash` (`gnn`-gated) | cli_inner_pretty.js:394411 | function |
| `q1_` | `FAST_PATH_EXEMPT_TOOLS` | cli_inner_pretty.js:513041 | constant |
| `sG` | `findSafetyCheckReason` | cli_inner_pretty.js:513689 | function |
| `t$_` | `autoModeAdjudication` (holds `$` `:513776`, `H` `:513751`, `A` `:513745`) | cli_inner_pretty.js:513711 | variable |
| `Wqy` | `sandboxedBashAutoAllowPrefix` (plan guard `:393924`) | cli_inner_pretty.js:393923 | function |
| `wrp` | `isFastPathExemptTool` | cli_inner_pretty.js:512923 | function |
| `Y1_` | `modeStillEligibleForAutoDecision` (post-queue revalidation) | cli_inner_pretty.js:513125 | function |

## Module: SDK Control Requests

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bi` | runTrackedControlHandler | cli_inner_pretty.js:847437 | function |
| `bs` | startKeepAlivePump | cli_inner_pretty.js:847193 | function |
| `edE` | SDK_CONTROL_REQUEST_PROGRESS_SCHEMA | cli_inner_pretty.js:837264 | object |
| `I0m` | SDK_SET_PERMISSION_MODE_SCHEMA | cli_inner_pretty.js:838607 | object |
| `It` | syncSdkMcpClients | cli_inner_pretty.js:845949 | function |
| `J` | emitControlRequestProgress | cli_inner_pretty.js:847205 | function |
| `ke` | handleRegisterRepoRoot | cli_inner_pretty.js:847216 | function |
| `ks` | inFlightControlAborts | cli_inner_pretty.js:847191 | variable |
| `L0m` | SDK_SET_MAX_THINKING_TOKENS_SCHEMA | cli_inner_pretty.js:838635 | object |
| `Ma` | runDetachedControlHandler | cli_inner_pretty.js:847446 | function |
| `mr` | respondError | cli_inner_pretty.js:847188 | function |
| `pfE` | handleInitializeControlRequest | cli_inner_pretty.js:849395 | function |
| `Pn` | respondSuccess | cli_inner_pretty.js:847182 | function |
| `R0m` | SDK_SET_MODEL_SCHEMA | cli_inner_pretty.js:838616 | object |

## Module: SDK init Event

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `B6o` | recordInitEmitTiming | cli_inner_pretty.js:593628 | function |
| `CEm` | getSkippedMcpServers | cli_inner_pretty.js:828312 | function |
| `eAr` | buildAmbientInitFields | cli_inner_pretty.js:593569 | function |
| `lCb` | SDK_CAPABILITIES_ENGINE | cli_inner_pretty.js:653849 | constant |
| `Msa` | CAPABILITY_MSG_LIFECYCLE_V1 | cli_inner_pretty.js:593635 | constant |
| `Psa` | CAPABILITY_INTERRUPT_RECEIPT_V1 | cli_inner_pretty.js:593634 | constant |
| `tAr` | buildInitEvent | cli_inner_pretty.js:593588 | function |
| `TEm` | recordSkippedMcpServers | cli_inner_pretty.js:828309 | function |
| `uDp` | SDK_CAPABILITIES_QUERY | cli_inner_pretty.js:593652 | constant |
| `Ulb` | CAPABILITY_INTERRUPT_CANCEL_QUEUED_V1 | cli_inner_pretty.js:593636 | constant |
| `wEm` | SKIPPED_MCP_SERVERS | cli_inner_pretty.js:828315 | variable |
| `zuE` | SDK_INIT_MESSAGE_SCHEMA | cli_inner_pretty.js:836907 | object |

## Module: Scheduled-Task Prompt Banner (cross-cutting with `40_system_prompt`)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `dZg` | SCHEDULED_TASK_HEADER | cli_inner_pretty.js:226513 | constant |
| `Hcs` | prefixScheduledPromptBanner | cli_inner_pretty.js:226508 | function |
| `x7r` | AUTOMATED_EVENT_BANNER | cli_inner_pretty.js:226516 | constant |
| `Zdo` | SCHEDULED_PROMPT_BANNER | cli_inner_pretty.js:226522 | constant |

## Module: Skills

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `"forked_skill_depth_cap"` | background fork refused: over spawn depth | cli_inner_pretty.js:342439 | constant |
| `"forked_skill_depth_chain_cap"` | background fork refused: depth + spawn cap (throws) | cli_inner_pretty.js:342433 | constant |
| `"forked_skill_live_duplicate"` | background fork refused: same skill already live | cli_inner_pretty.js:342426 | constant |
| `"forked_skill_scoping_unpersistable"` | background fork refused: scoping record invalid | cli_inner_pretty.js:342449 | constant |
| `"forked_skill_scoping_write_failed"` | background fork refused: scoping write failed | cli_inner_pretty.js:342453 | constant |
| `"forked_skill_spawn_cap"` | background fork refused: session spawn cap | cli_inner_pretty.js:342442 | constant |
| `"tengu_frontmatter_shadow_mismatch"` | frontmatter shadow-schema field mismatch | cli_inner_pretty.js:157720 | constant |
| `"tengu_frontmatter_shadow_unknown_key"` | frontmatter shadow-schema unknown key | cli_inner_pretty.js:157717 | constant |
| `"tengu_skill_scoped_variant_note"` | directory-scoped skill variant note emitted | cli_inner_pretty.js:340696 | constant |
| `"tengu_slash_command_forked"` | forked slash-command dispatch | cli_inner_pretty.js:343069 | constant |
| `"tengu_stacked_slash_commands"` | stacked slash-skill expansion (`stacked_count`) | cli_inner_pretty.js:343685 | constant |
| `$hy` | validateAgentFrontmatterName | cli_inner_pretty.js:269867 | function |
| `$Ig` | quoteLossyFrontmatterValues | cli_inner_pretty.js:158018 | function |
| `$on` | buildScopedSkillVariantNote | cli_inner_pretty.js:340684 | function |
| `_Ji` | looseScalarUnion (string\ | number\ | boolean\ |
| `_ru` | VALID_SHELL_VALUES (`["bash","powershell"]`) | cli_inner_pretty.js:158238 | constant |
| `aNy` | dispatchForkedSlashCommand | cli_inner_pretty.js:343059 | function |
| `BIg` | expandBracePatterns | cli_inner_pretty.js:158159 | function |
| `bJi` | skillFrontmatterShadowSchema | cli_inner_pretty.js:157776 | object |
| `bru` | splitAndExpandPatternList | cli_inner_pretty.js:158139 | function |
| `bvo` | DATAVIZ_SKILL_ID (`"dataviz"`) | cli_inner_pretty.js:318659 | constant |
| `c8S` | DATAVIZ_SKILL_FILES (9 bundled files) | cli_inner_pretty.js:777505 | object |
| `CBe` | ARTIFACT_DESIGN_SKILL_ID (`"artifact-design"`) | cli_inner_pretty.js:318657 | constant |
| `Cdd` | buildTaskNotificationBlock | cli_inner_pretty.js:342123 | function |
| `cNy` | dispatchSlashCommandByType | cli_inner_pretty.js:343504 | function |
| `Ddd` | FORK_SCOPING_MAX_BYTES (524288) | cli_inner_pretty.js:342387 | constant |
| `DIg` | CANONICAL_FRONTMATTER_KEYS (58 entries) | cli_inner_pretty.js:157899 | constant |
| `dRt` | FRONTMATTER_MAX_BYTES (65536) | cli_inner_pretty.js:158224 | constant |
| `efo` | classifyMemoryPinnedState (absent/malformed/true/false) | cli_inner_pretty.js:235443 | function |
| `EJi` | detectInlineHashHazard | cli_inner_pretty.js:158059 | function |
| `eoo` | parsePositiveIntegerField | cli_inner_pretty.js:158184 | function |
| `epd` | MAX_STACKED_COMMANDS (5) | cli_inner_pretty.js:344087 | constant |
| `eRs` | metaMessageText | cli_inner_pretty.js:346513 | function |
| `F6S` | buildDatavizCalloutForArtifactDesign | cli_inner_pretty.js:772270 | function |
| `FIg` | MAX_EXPANSION_BYTES (4194304) | cli_inner_pretty.js:158228 | constant |
| `fny` | readClaudeMdPathsFrontmatter | cli_inner_pretty.js:235627 | function |
| `FP` | looseScalarField (alias of `_Ji`) | cli_inner_pretty.js:157737 | variable |
| `FTo` | forkedSkillScopingSchema | cli_inner_pretty.js:342113 | object |
| `gru` | canonicalizeFrontmatterKey | cli_inner_pretty.js:157893 | function |
| `gV` | parseYaml (`Bun.YAML.parse`) | cli_inner_pretty.js:157974 | function |
| `HIg` | baseCommandFrontmatterShadowSchema | cli_inner_pretty.js:157739 | object |
| `hru` | emitFrontmatterProbeOnce | cli_inner_pretty.js:157707 | function |
| `Hst` | looseScalarOrStringArrayField | cli_inner_pretty.js:157727 | variable |
| `IIg` | agentFrontmatterShadowSchema | cli_inner_pretty.js:157828 | object |
| `iin` | COMPACTION_TRUNCATION_MARKER | cli_inner_pretty.js:346536 | constant |
| `iOA` | CANONICAL_KEY_BY_NORMALIZED_NAME | cli_inner_pretty.js:157961 | constant |
| `Ist` | looseScalarField (alias of `_Ji`) | cli_inner_pretty.js:157738 | variable |
| `IY` | normalizeFrontmatterDescription | cli_inner_pretty.js:158190 | function |
| `jFs` | buildSkillMetadataFromFrontmatter | cli_inner_pretty.js:438444 | function |
| `jrm` | registerArtifactDesignSkill | cli_inner_pretty.js:772278 | function |
| `JWu` | loadAgentFromMarkdown | cli_inner_pretty.js:269945 | function |
| `LIg` | STRICT_SHADOW_SCHEMAS (`skill`/`agent`/`output-style`) | cli_inner_pretty.js:157886 | object |
| `lNy` | processSlashCommand (exported name, `:343015`) | cli_inner_pretty.js:343268 | function |
| `Lp` | parseFrontmatter | cli_inner_pretty.js:158070 | function |
| `MIg` | YAML_NEEDS_QUOTING_RE | cli_inner_pretty.js:158236 | constant |
| `mru` | FRONTMATTER_PROBE_SEEN | cli_inner_pretty.js:157891 | variable |
| `Mse` | VERIFY_SKILL_ID (`"verify"`) | cli_inner_pretty.js:318664 | constant |
| `NIg` | MAX_EXPANDED_PATTERNS (1000) | cli_inner_pretty.js:158227 | constant |
| `ntr` | stringifyYaml | cli_inner_pretty.js:157977 | function |
| `OIg` | quoteYamlScalarsFallback | cli_inner_pretty.js:157984 | function |
| `Oom` | registerDatavizSkill | cli_inner_pretty.js:777520 | function |
| `otr` | coerceFrontmatterBooleanDefaultFalse | cli_inner_pretty.js:158201 | function |
| `PIg` | SLASH_ONLY_FRONTMATTER_KEYS | cli_inner_pretty.js:157962 | constant |
| `pRt` | FRONTMATTER_STRICT_FENCE_RE | cli_inner_pretty.js:158237 | constant |
| `Pse` | ARTIFACT_CAPABILITIES_SKILL_ID (`"artifact-capabilities"`) | cli_inner_pretty.js:318658 | constant |
| `qde` | coerceFrontmatterBoolean | cli_inner_pretty.js:158204 | function |
| `qTo` | resolveForkBackgroundMode | cli_inner_pretty.js:342396 | function |
| `RAo` | resolveSkillExecutionContext | cli_inner_pretty.js:326547 | function |
| `RIg` | outputStyleFrontmatterShadowSchema | cli_inner_pretty.js:157870 | object |
| `roo` | validateShellFrontmatterValue | cli_inner_pretty.js:158212 | function |
| `rpd` | formatSkillLoadingMetadata (exported name, `:343020`) | cli_inner_pretty.js:343872 | function |
| `Rst` | FRONTMATTER_MAX_LINES (30) | cli_inner_pretty.js:158223 | constant |
| `S0o` | findPriorSkillContent | cli_inner_pretty.js:346523 | function |
| `Sd` | userFacingCommandName | cli_inner_pretty.js:326533 | function |
| `sn_` | readSkillPathsFrontmatter | cli_inner_pretty.js:438436 | function |
| `sOA` | SLASH_ONLY_KEYS_NORMALIZED | cli_inner_pretty.js:157972 | constant |
| `su` | parseFalsyToken (carryover; `:1944 (193)`) | cli_inner_pretty.js:1956 | function |
| `tcn` | buildSkillPromptCommand | cli_inner_pretty.js:438492 | function |
| `Tdd` | TASK_NOTIFICATION_DESC_MAX (4096) | cli_inner_pretty.js:342147 | constant |
| `too` | collectDeclaredFrontmatterFields | cli_inner_pretty.js:158197 | function |
| `tpd` | peelStackedPromptCommands (exported name, `:343017`) | cli_inner_pretty.js:343833 | function |
| `uRt` | reportFrontmatterShadowMismatch | cli_inner_pretty.js:157712 | function |
| `vct` | substituteCommandArguments | cli_inner_pretty.js:237706 | function |
| `vJi` | asPlainObjectOrEmpty | cli_inner_pretty.js:158132 | function |
| `VTo` | spawnForkedSkillAsBackgroundAgent | cli_inner_pretty.js:342400 | function |
| `w9` | isSkillOverriddenOff | cli_inner_pretty.js:326365 | function |
| `wZ` | FRONTMATTER_FENCE_RE | cli_inner_pretty.js:158237 | constant |
| `xfo` | SUBSTITUTION_SENTINEL (`"￿"`) | cli_inner_pretty.js:237746 | constant |
| `yk` | isCommandEnabled | cli_inner_pretty.js:326536 | function |
| `yru` | describeEmptyFrontmatterHazard | cli_inner_pretty.js:158127 | function |
| `Yt` | parseTruthyToken (carryover; `:1938 (193)`) | cli_inner_pretty.js:1950 | function |
| `Zno` | expandPathsFrontmatter | cli_inner_pretty.js:158136 | function |
| `ZNy` | elideDuplicateSkillInvocation | cli_inner_pretty.js:346748 | function |

## Module: Skills — model-invocation gating and the skill listing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `BLo` | buildModelVisibleSkillSet | cli_inner_pretty.js:441278-441285 | function |
| `FLo` | renderSkillListingLines | cli_inner_pretty.js:441264-441276 | function |
| `oin` | checkSkillInvocationBlocked (the `!userTypedThisTurn` refusal) | cli_inner_pretty.js:346456-346463 | function |
| `oKe` | isModelInvocableCommand (filters `disableModelInvocation` out of the listing) | cli_inner_pretty.js:506851-506863 | function |
| `YFo` | buildSkillListingReminder | cli_inner_pretty.js:499488-499499 | function |
| `zL` | getModelInvocableCommands (memoised, applies `oKe`) | cli_inner_pretty.js:507331-507334 | variable |
| `zNy` | didUserTypeCommandThisTurn | cli_inner_pretty.js:346566-346569 | function |

## Module: Steering / Message Provenance

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_kS` | `classifyTaskNotificationOrigin` | cli_inner_pretty.js:737186 | function |
| `dZg` | `SCHEDULED_TASK_BANNER_PREFIX` | cli_inner_pretty.js:226513 | constant |
| `fVe` | `isPeerOrObserverOrigin` | cli_inner_pretty.js:216900 | function |
| `gXa` | `humanOriginForEntrypoint` | cli_inner_pretty.js:737182 | function |
| `Hcs` | `prefixScheduledTaskBanner` | cli_inner_pretty.js:226508 | function |
| `iee` | `isHumanOrAutoContinuation` | cli_inner_pretty.js:216903 | function |
| `juo` | `isHumanTypedOrigin` | cli_inner_pretty.js:216894 | function |
| `kcs` | `prefixSystemNotificationBanner` | cli_inner_pretty.js:226504 | function |
| `kNt` | `applyOriginBanner` | cli_inner_pretty.js:533914 | function |
| `m_l` | `USER_MESSAGE_ORIGIN_SCHEMA` | cli_inner_pretty.js:836439 | variable |
| `Nie` | `isHumanOrLegacyOrigin` | cli_inner_pretty.js:216897 | function |
| `x7r` | `SYSTEM_NOTIFICATION_BANNER` | cli_inner_pretty.js:226516 | constant |
| `Zdo` | `SCHEDULED_TASK_BANNER` | cli_inner_pretty.js:226522 | constant |

## Module: Subagent Text Forwarding

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `iKe` | toWireFrames | cli_inner_pretty.js:341013 | function |
| `tdd` | getSubagentFrameWriter | cli_inner_pretty.js:340754 | function |
| `yBc` | normalizeSubagentThinkingDisplay | cli_inner_pretty.js:119662 | function |
| `Yon` | buildAgentProgressFrame | cli_inner_pretty.js:530801 | function |
| `Zth` | ENV_CLAUDE_CODE_FORWARD_SUBAGENT_TEXT | cli_inner_pretty.js:31043 | variable |

## Module: Todo / Tasks — tracker retention

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$6a` | `isAgentOrTeammateTask` | cli_inner_pretty.js:725784-725787 | function |
| `BQe` | `enterTranscriptView` (`retain: true, evictAfter: undefined`) | cli_inner_pretty.js:725793-725810 | function |
| `eFs` | `resolveTaskEvictAfter` (`retain` and `park` exemptions) | cli_inner_pretty.js:432598-432602 | function |
| `F6a` | `dismissTask` (`evictAfter: 0`; refuses while running) | cli_inner_pretty.js:725822-725835 | function |
| `Hpr` | `KILLED_EVICT_MS` (3,000) | cli_inner_pretty.js:341921 | constant |
| `ice` | `exitTranscriptView` (re-stamps the deadline from now) | cli_inner_pretty.js:725811-725821 | function |
| `N6a` | `releaseTaskRetention` | cli_inner_pretty.js:725789-725792 | function |
| `O6a` | `isLocalAgentTask` | cli_inner_pretty.js:725781-725783 | function |
| `oOf` | `TRANSCRIPT_VIEW_EVICT_MS` (30,000) | cli_inner_pretty.js:725836 | constant |
| `Yse` | `COMPLETED_EVICT_MS` (30,000) | cli_inner_pretty.js:341922 | constant |

## Module: Workflow — bundled registry and command projection

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Dsn` | resolveWorkflowByName | cli_inner_pretty.js:388331-388333 | function |
| `HM_` | getWorkflowCommands | cli_inner_pretty.js:506559-506562 | function |
| `Jxo` | invalidateWorkflowCache | cli_inner_pretty.js:388334-388336 | function |
| `ksn` | getBundledWorkflows | cli_inner_pretty.js:385336-385339 | function |
| `Lep` | createWorkflowCommand | cli_inner_pretty.js:506513-506557 | function |
| `Lft` | getAllWorkflows (memoised; built-in < plugin < user) | cli_inner_pretty.js:388346-388356 | function |
| `Qxo` | redactWorkflowNameForTelemetry | cli_inner_pretty.js:388577-388580 | function |
| `tMs` | isVerbatimBuiltInWorkflow | cli_inner_pretty.js:388574-388576 | function |
| `Zxo` | redactWorkflowDescriptionForTelemetry | cli_inner_pretty.js:388581-388584 | function |

## Module: Workflow

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aJn` | `isWorkflowKeywordTriggerEnabled` | cli_inner_pretty.js:119330 | function |
| `BFo` | `stripUltraplanKeywordFromPrompt` | cli_inner_pretty.js:498306 | function |
| `DN_` | `buildWorkflowKeywordRequest` | cli_inner_pretty.js:516931 | function |
| `DWs` | `findUltracodeMatches` | cli_inner_pretty.js:498297 | function |
| `eXd` | `hasUltraplanKeyword` | cli_inner_pretty.js:498300 | function |
| `FFo` | `findUltraplanMatches` | cli_inner_pretty.js:498291 | function |
| `LWs` | `findKeywordOutsideQuotes` | cli_inner_pretty.js:498250 | function |
| `Q7d` | `QUOTE_AND_BRACKET_PAIRS` | cli_inner_pretty.js:498316 | constant |
| `tXd` | `hasUltracodeKeyword` | cli_inner_pretty.js:498303 | function |
| `Z7d` | `findUltrareviewMatches` | cli_inner_pretty.js:498294 | function |

## Module: Workflow — save path and filesystem guards

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| eDi | atomicWriteFileSyncCore | cli_inner_pretty.js:52256-… | function |
| fn | getClaudeConfigDir | cli_inner_pretty.js:14779 | function |
| G7r | writeScheduledTasks | cli_inner_pretty.js:230132-230145 | function |
| I0t | isClaudeConfigDir | cli_inner_pretty.js:14682-14686 | function |
| jGn | assertDirChainReal | cli_inner_pretty.js:51990-52010 | function |
| MO | tildifyHomePath | cli_inner_pretty.js:51877-51882 | function |
| oVa | saveWorkflowScript | cli_inner_pretty.js:728199-728231 | function |
| rii | WORKFLOW_EXISTS_HINT | cli_inner_pretty.js:728234 | constant |
| wkl | canonicaliseConfigDirPath | cli_inner_pretty.js:14687-14691 | function |
| WSS | resolveWorkflowsDir | cli_inner_pretty.js:728191-728198 | function |
| X$t | getUserWorkflowsDir | cli_inner_pretty.js:388219-388221 | function |
| X5 | atomicWriteFile | cli_inner_pretty.js:52398 | function |

## Module: Workflow — size guideline

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $sn | coerceToKnownSize | cli_inner_pretty.js:389111-389113 | function |
| cEd | DEFAULT_WORKFLOW_SIZE | cli_inner_pretty.js:389143 | constant |
| dEd | describeSizeWithCap | cli_inner_pretty.js:389124-389127 | function |
| Dft | resolveWorkflowSizeGuideline | cli_inner_pretty.js:389152-389155 | function |
| fEd | buildGuidelineSentence | cli_inner_pretty.js:389131-389137 | function |
| g6y | formatSizeWithInlineCap | cli_inner_pretty.js:389114-389117 | function |
| hEd | diffWorkflowSizeAgainstTranscript | cli_inner_pretty.js:389167-389180 | function |
| iMs | buildGuidelineSuffix | cli_inner_pretty.js:389160-389166 | function |
| Kli | positiveFiniteOrUndefined | cli_inner_pretty.js:747610-747612 | function |
| KLS | ASSUMED_TOKENS_PER_AGENT | cli_inner_pretty.js:747639 | constant |
| kya | WorkflowSizeStatusHint | cli_inner_pretty.js:651528-651549 | function |
| mEd | buildSizeChangeReminder | cli_inner_pretty.js:389138-389141 | function |
| nMs | WORKFLOW_SIZE_VALUES | cli_inner_pretty.js:389146 | constant |
| Nsn | memoiseSessionWorkflowSize | cli_inner_pretty.js:389156-389159 | function |
| oMs | sessionWorkflowSizeMemo | cli_inner_pretty.js:389181 | variable |
| pEd | guidelineCaveat | cli_inner_pretty.js:389128-389130 | function |
| Q$t | isWorkflowSizeSetBySettings | cli_inner_pretty.js:389149-389151 | function |
| rko | formatSizeRowValue | cli_inner_pretty.js:389118-389120 | function |
| tko | WORKFLOW_SIZE_AGENT_CAPS | cli_inner_pretty.js:389147 | object |
| uEd | sizeToAgentCap | cli_inner_pretty.js:389121-389123 | function |
| VLS | DEFAULT_AGENT_WARN_CAP | cli_inner_pretty.js:747637 | constant |
| whm | hasExplicitWorkflowSizeGuideline | cli_inner_pretty.js:814920-814922 | function |
| Yfr | initWorkflowSizeModule | cli_inner_pretty.js:389145-389148 | function |
| z5f | computeWorkflowSizeWarning | cli_inner_pretty.js:747613-747635 | function |
| zLS | DEFAULT_TOKEN_WARN_CAP | cli_inner_pretty.js:747638 | constant |

## Module: Workflow — tool definition, runtime and script parsing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $H | parseWorkflowScriptMeta | cli_inner_pretty.js:275599-275629 | function |
| _Ed | RETRACTED_DISPATCH_RESULT | cli_inner_pretty.js:389350-389354 | object |
| a6y | BRIDGE_MIN_INTERVAL_MS | cli_inner_pretty.js:388912 | constant |
| Abs | PARSE_ERROR_SNIPPET_WIDTH | cli_inner_pretty.js:275740 | constant |
| BO_ | UNICODE_ESCAPE_RE_GLOBAL | cli_inner_pretty.js:508588 | constant |
| c6y | createProgressBatcher | cli_inner_pretty.js:388538-388569 | function |
| ctp | repairDoubleEscapedUnicode | cli_inner_pretty.js:508472-508481 | function |
| dgy | formatScriptParseError | cli_inner_pretty.js:275631-275652 | function |
| dk | WORKFLOW_TOOL_NAME | cli_inner_pretty.js:231211 | constant |
| f6y | WORKFLOW_ISOLATION_TYPE_PROSE | cli_inner_pretty.js:388936 | constant |
| fgy | isMetaExportStatement | cli_inner_pretty.js:275665-… | function |
| l6y | SNAPSHOT_HEARTBEAT_MS | cli_inner_pretty.js:388913 | constant |
| ltp | UNICODE_ESCAPE_RE | cli_inner_pretty.js:508587 | constant |
| nko | WorkflowInputError | cli_inner_pretty.js:389344-389349 | class |
| o1 | MAX_WORKFLOW_SCRIPT_BYTES | cli_inner_pretty.js:162044 | constant |
| oEd | isNotWorkflowLog | cli_inner_pretty.js:388907-388909 | function |
| pgy | hasNumericLoc | cli_inner_pretty.js:275653-275664 | function |
| qPs | applyWorkflowProgressEvents | cli_inner_pretty.js:386523-386572 | function |
| rMs | WORKFLOW_TOOL_PROSE | cli_inner_pretty.js:388943-389101 | constant |
| s6y | PROGRESS_BATCH_WINDOW_MS | cli_inner_pretty.js:388911 | constant |
| S6y | WorkflowTool | cli_inner_pretty.js:389355-… | object |
| u6y | resolveReportedWorkflowName | cli_inner_pretty.js:388570-388573 | function |
| UO_ | WINDOWS_PATH_RE | cli_inner_pretty.js:508589 | constant |
| vqs | repairValue | cli_inner_pretty.js:508482-508506 | function |
| Xpn | normalizeToolUseBlocks | cli_inner_pretty.js:531864-… | function |
| yEd | resolveWorkflowScriptSource | cli_inner_pretty.js:389188-389215 | function |

## Module: set_cwd Control Request

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aef` | replaceIfUnsafePath | cli_inner_pretty.js:663601 | function |
| `Hxm` | shouldHoldResultForRunningTasks | cli_inner_pretty.js:843370 | function |
| `Ixm` | shouldMarkIdleWhileWaiting | cli_inner_pretty.js:843373 | function |
| `kxm` | isSessionBusyForCwdChange | cli_inner_pretty.js:843367 | function |
| `QKo` | UNSAFE_PATH_CHARS_RE | cli_inner_pretty.js:663724 | variable |
| `qLb` | handleSetCwdControlRequest | cli_inner_pretty.js:663604 | function |

---

## Source documents

- [`symbol_additions_v2_1_220_accessibility_ui.md`](symbol_additions_v2_1_220_accessibility_ui.md)
- [`symbol_additions_v2_1_220_agent_team.md`](symbol_additions_v2_1_220_agent_team.md)
- [`symbol_additions_v2_1_220_api_reliability.md`](symbol_additions_v2_1_220_api_reliability.md)
- [`symbol_additions_v2_1_220_auto_memory.md`](symbol_additions_v2_1_220_auto_memory.md)
- [`symbol_additions_v2_1_220_background_agents_daemon.md`](symbol_additions_v2_1_220_background_agents_daemon.md)
- [`symbol_additions_v2_1_220_background_agents_view.md`](symbol_additions_v2_1_220_background_agents_view.md)
- [`symbol_additions_v2_1_220_code_review.md`](symbol_additions_v2_1_220_code_review.md)
- [`symbol_additions_v2_1_220_compact.md`](symbol_additions_v2_1_220_compact.md)
- [`symbol_additions_v2_1_220_headless_sdk.md`](symbol_additions_v2_1_220_headless_sdk.md)
- [`symbol_additions_v2_1_220_hooks.md`](symbol_additions_v2_1_220_hooks.md)
- [`symbol_additions_v2_1_220_performance.md`](symbol_additions_v2_1_220_performance.md)
- [`symbol_additions_v2_1_220_plan_mode.md`](symbol_additions_v2_1_220_plan_mode.md)
- [`symbol_additions_v2_1_220_skills_plugins.md`](symbol_additions_v2_1_220_skills_plugins.md)
- [`symbol_additions_v2_1_220_slash_cli.md`](symbol_additions_v2_1_220_slash_cli.md)
- [`symbol_additions_v2_1_220_subagent_limits.md`](symbol_additions_v2_1_220_subagent_limits.md)
- [`symbol_additions_v2_1_220_system_prompt.md`](symbol_additions_v2_1_220_system_prompt.md)
- [`symbol_additions_v2_1_220_workflow.md`](symbol_additions_v2_1_220_workflow.md)
