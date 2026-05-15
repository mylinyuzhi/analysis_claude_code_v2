# Symbol Additions — Unit 12: Permission Policy

Symbols introduced or significantly changed between v2.1.88 and v2.1.112 in the auto-mode + permissions surface.

These additions complement the existing platform-infrastructure index at [`symbol_index_infra_platform.md`](./symbol_index_infra_platform.md). Once the main index is updated, these entries should be migrated there under the **Module: Permissions** and **Module: Auto Mode** sections.

---

## Module: Auto Mode

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Dk6` | `modelSupportsAutoMode` | chunks.60.mjs:1622-1634 | function |
| `yK8` | `verifyAutoModeGateAccess` | chunks.165.mjs:3-69 | function |
| `$L` | `isAutoModeGateEnabled` | chunks.165.mjs:80-85 | function |
| `ge` | `getAutoModeUnavailableReason` | chunks.165.mjs:87-92 | function |
| `nY7` | `parseAutoModeEnabledState` | chunks.165.mjs:94-97 | function |
| `L98` | `getAutoModeEnabledState` (cached) | chunks.165.mjs:99-102 | function |
| `Pn8` | `getAutoModeEnabledStateIfCached` | chunks.165.mjs:104-108 | function |
| `Wn8` | `hasAutoModeOptInAnySource` | chunks.165.mjs:110-113 | function |
| `lY7` | `isAutoModeDisabledBySettings` | chunks.165.mjs:75-78 | function |
| `rY7` | `isDefaultPermissionModeAuto` | chunks.165.mjs:142-144 | function |
| `oY7` | `useAutoModeDuringPlanEnabled` | chunks.165.mjs:146-148 | function |
| `VU` | `hasAutoModeOptIn` | chunks.19.mjs:1647-1658 | function |
| `cO1` | `useAutoModeDuringPlanSetting` | chunks.19.mjs:1660-1662 | function |
| `DG` | `autoModeStateModule` | (module export object) | object |
| `pe` | `restoreDangerousPermissions` | chunks.164.mjs:2704-2721 | function |
| `Fe` | `handlePermissionModeTransition` | chunks.164.mjs:2723+ | function |
| `WV8` | `isNotOpus47` | chunks.60.mjs:1618-1620 | function |
| `T4` | `AGENT_TOOL_NAME` (`"Agent"`) | chunks.19.mjs:93 | constant |
| `MCK` | `NO_CACHED_AUTO_MODE_CONFIG_SENTINEL` | (module-level constant) | constant |
| `pkY` | `AUTO_MODE_ENABLED_DEFAULT` (`"disabled"`) | (module-level) | constant |

---

## Module: Auto Mode Denials (UX)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| (in `chunks.164.mjs` ring buffer) | `DENIALS` (array) | bundled state | variable |
| (in `chunks.164.mjs`) | `MAX_DENIALS` (`20`) | bundled | constant |
| `recordAutoModeDenial` | `recordAutoModeDenial` | within chunks.164.mjs/150.mjs | function |
| `getAutoModeDenials` | `getAutoModeDenials` | within chunks.164.mjs/150.mjs | function |
| (component) | `RecentDenialsTab` | within chunks.180.mjs | function (React) |
| `t24` | (Tab JSX for Recent denials) | chunks.180.mjs:1070 area | JSX |

---

## Module: Bash Permissions (Hardening)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `N98` | `safeEnvVars` (37-element Set) | chunks.164.mjs:1718 | constant |
| `PkY` | `safeBinaries` (`sudo`, `env`, `nohup`, `timeout`, etc.) | chunks.164.mjs:1716 | constant |
| `IY7` | `envVarAssignmentRegex` (`/^[A-Za-z_]\w*=/`) | chunks.164.mjs:1715 | constant |
| `xSK` | `stripSafeWrappersImpl` | chunks.164.mjs:1717 | function |
| `kkY` | `isSandboxExcludedCommand` | chunks.164.mjs:1722-1762 | function |
| `xY7` | `parseExcludedCommandPattern` (`qR8`) | chunks.164.mjs:1718 | function |
| `sSK` | `commandClassificationCache` (`new Map`) | chunks.164.mjs:1719 | variable |
| `TO` | `splitCompoundCommand` | (utility) | function |
| `uY7` | `stripSafeWrappersRecursive` | helper to walk wrappers | function |
| `jF` | `stripLeadingFlags` | helper used in command equality | function |
| `ZP6` | `wildcardMatch` | chunks.164.mjs:1756 | function |

---

## Module: Classifier (yoloClassifier)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `PK8` | `classifyYoloAction` | chunks.138.mjs (entry) | function |
| `H.shouldBlock` | `classifierResult.shouldBlock` | chunks.164.mjs:2400 | property |
| `H.transcriptTooLong` | `classifierResult.transcriptTooLong` | chunks.164.mjs:2401 | property |
| `H.unavailable` | `classifierResult.unavailable` | chunks.164.mjs:2421 | property |
| `H.reason` | `classifierResult.reason` | chunks.164.mjs:2438 | property |
| `sz` | `AbortError` class | within chunks.* | class |
| `r_` | (alternate abort/error class) | within chunks.* | class |
| `LkY.isAutoModeAllowlistedTool` | `isAutoModeAllowlistedTool` | chunks.164.mjs:2332 | function |
| `S18` | `recordSuccess` (denialTracking) | (utility) | function |
| `Px8` | `createDenialTrackingState` | (utility) | function |
| `Ax6` | `setDenialTracking` (on context) | (utility) | function |
| `kC` | `inProtectedNamespace` | (utility) | function |
| `XY6` | `getSessionInputTokens` | (utility) | function |
| `eu` | `getSessionOutputTokens` | (utility) | function |

---

## Module: Hooks (Permission Decision Re-check)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `hookSpecificOutput.permissionDecision` | string union `"allow" \| "deny" \| "ask" \| "defer"` | chunks.193.mjs:34-52 | property |
| `hookSpecificOutput.decision` | `{ behavior, updatedInput? }` (PermissionRequest) | chunks.193.mjs:99-103 | property |
| `hookSpecificOutput.retry` | bool (PermissionDenied) | chunks.193.mjs:97 | property |
| `H.updatedInput` | (mutable in hook result builder) | chunks.193.mjs:75, 101 | property |
| `permissionBehavior` | hook output → built-in pipeline | chunks.149.mjs:2961+ | property |
| `hookUpdatedInput` (yield type) | hook protocol message | chunks.149.mjs:2999-3001 | yield type |
| `hookPermissionResult` (yield type) | hook protocol message | chunks.149.mjs:2973-2997 | yield type |
| `$38` | `dispatchPermissionDeniedHook` | chunks.153.mjs:1362 | function |
| `Wa8` | `executeHook` | chunks.149.mjs/193.mjs:151 | function |

---

## Module: Permission Setup (v2.1.88 parity)

These functions exist in both v2.1.88 (TypeScript) and v2.1.112 (chunks). Their names map cleanly.

| v2.1.88 (TS) | v2.1.112 (obfuscated) | Notes |
|--------------|------------------------|-------|
| `initialPermissionModeFromCLI` | (in `chunks.150.mjs`) | Same shape, with new auto-mode gate for v2.1.110+ |
| `stripDangerousPermissionsForAutoMode` | `qI6.stripDangerousPermissionsForAutoMode` | Lifts deny rules on auto entry |
| `restoreDangerousPermissions` | `pe` (`chunks.164.mjs:2704`) | Re-installs lifted rules on exit |
| `handlePermissionModeTransition` | `Fe` (`chunks.164.mjs:2723`) | Mode-cycle handler |
| `checkPathSafetyForAutoEdit` | (in path-validation block) | Decides protected-path approval |
| `applyPermissionUpdate` | `EY` | Applies `PermissionUpdate` (addRules/setMode/etc.) |
| `parsePermissionRule` | `h2` | Parses rule string |

---

## Module: Telemetry / Logging (Permission Decisions)

| Event name | Where logged | Notes |
|------------|--------------|-------|
| `tengu_auto_mode_decision` | chunks.164.mjs:2313, 2334, 2360 | Per-tool-call classifier outcome |
| `tengu_tool_use_can_use_tool_rejected` | chunks.153.mjs:1317 | Tool denied (any reason) |
| `tengu_tool_use_can_use_tool_allowed` | chunks.153.mjs:1372 | Tool allowed |
| `tengu_disable_bypass_permissions_mode` | (Statsig gate check) | Reads org policy gate |
| `tengu_auto_mode_config` | (GrowthBook config) | Carries `enabled`, `allowModels`, `disableFastMode`, `forceExternalPermissions`, `twoStageClassifier`, `jsonlTranscript`, `model` |
| `tengu_bash_allowlist_strip_all` | chunks.164.mjs:2364 | Experiment gate |
| `tengu_iron_gate_closed` | chunks.164.mjs:2422 | "Fail closed" experiment for classifier-unavailable |

---

## Cross-References

For the permission flow in `useCanUseTool` (where denials are recorded and notifications fire), see [`37_permission_policy/denied_retry_ux.md`](../37_permission_policy/denied_retry_ux.md).

For the classifier-overflow Agent fallback, see [`37_permission_policy/classifier_hardening.md`](../37_permission_policy/classifier_hardening.md).

For the model-supports-auto-mode gating (Max plan + Opus 4.7), see [`37_permission_policy/auto_mode_dispatch.md`](../37_permission_policy/auto_mode_dispatch.md).

For the Bash bypass closures (`stripSafeWrappers`, `safeEnvVars`, compound check, prototype-property fix), see [`37_permission_policy/bash_bypass_fixes.md`](../37_permission_policy/bash_bypass_fixes.md).

For the mode-integrity fix (`--dangerously-skip-permissions` no longer downgrading), see [`37_permission_policy/dangerously_skip_fix.md`](../37_permission_policy/dangerously_skip_fix.md).
