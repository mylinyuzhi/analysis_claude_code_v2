# Voice Input Support

This document explains how Claude Code v2.1.193 supports voice input. It is a current-version subsystem deep dive, not a claim that the whole voice system is net-new in the v2.1.183 to v2.1.193 window. The older readable 2.1.88 source confirms the same major architecture, while the 2.1.193 bundle adds evidence for current details such as `tap` mode, double-tap submit state, typed interims, and the always-Nova3 voice stream parameters.

## Executive Summary

Voice input is a gated, local microphone to remote STT pipeline:

- `/voice` is a local slash command that toggles persistent settings only after auth, org-policy, local recorder, STT availability, dependency, and microphone checks pass (`cli_inner_pretty.js:572485-572545`).
- The input UI reads `settings.voice.mode`, defaulting to `hold`, and supports both hold-to-talk and tap-to-record modes (`cli_inner_pretty.js:572529-572534`, `650075`, `650167`, `649943-649947`).
- Audio capture is local 16 kHz mono PCM through the bundled native `audio-capture.node` module when usable, with Linux `arecord` and SoX `rec` fallbacks (`cli_inner_pretty.js:63`, `572330-572338`, `572388-572455`, `572461-572462`).
- Speech-to-text is remote: audio frames are sent over OAuth-authenticated WebSocket `/api/ws/speech_to_text/voice_stream`, with `encoding=linear16`, `sample_rate=16000`, `channels=1`, `use_conversation_engine=true`, and `stt_provider=deepgram-nova3` (`cli_inner_pretty.js:571951-571982`).
- Transcripts are integrated into the prompt through a React hook layer that anchors the cursor position, renders interim text, then replaces it with final transcript text without overwriting surrounding user input (`cli_inner_pretty.js:650026-650150`).

## Source Evidence

Primary 2.1.193 evidence:

- Bundle version and native module import: `cli_inner_pretty.js:9`, `cli_inner_pretty.js:62-63`.
- Voice auth and entitlement gates: `Cnr`, `Inr`, `jSt` at `cli_inner_pretty.js:571876-571889`; org-policy explanation builder `gG` at `cli_inner_pretty.js:148824-148829`; entitlement mapping to `allow_voice_mode` at `cli_inner_pretty.js:148870-148875`.
- `/voice` command: parser `_Ff` and handler `bFf` at `cli_inner_pretty.js:572478-572545`; command metadata and `argumentHint:"[hold|tap|off]"` at `cli_inner_pretty.js:572562-572573`.
- Voice state context: `VoiceProvider`, `useVoiceState`, `useSetVoiceState`, `useGetVoiceState`, and default state at `cli_inner_pretty.js:178028-178080`.
- Default keybinding and validation: `space: "voice:pushToTalk"` at `cli_inner_pretty.js:178315-178327`; action schema at `cli_inner_pretty.js:178860-178914`; warning for printable letter bindings at `cli_inner_pretty.js:178999-179009`.
- WebSocket STT client: availability and connection exports at `cli_inner_pretty.js:571894-571902`; endpoint, headers, query params, and frame protocol at `cli_inner_pretty.js:571951-572176`.
- Recording service: dependency checks, recording availability, recorder start/stop at `cli_inner_pretty.js:572330-572455`.
- Main hook: audio buffering, retry, silent-drop replay, focus/tap/hold behavior at `cli_inner_pretty.js:649459-649979`.
- Prompt integration and keybinding handler: `useVoiceIntegration` and `useVoiceKeybindingHandler` exports and bodies at `cli_inner_pretty.js:650011-650358`.

Cross-validation source:

- `/lyz/codespace/3rd/claude-code/src/commands/voice/voice.ts:18-148` validates the command-time gate sequence, settings write, language hint, recorder checks, STT availability check, and microphone permission probe.
- `/lyz/codespace/3rd/claude-code/src/services/voice.ts:190-259` and `:335-382` validate dependency checks, microphone probing, native audio capture, and `arecord`/SoX fallback behavior.
- `/lyz/codespace/3rd/claude-code/src/services/voiceStreamSTT.ts:36-44`, `:98-175`, and `:249-253` validate the endpoint path, finalize timers, OAuth availability, WebSocket connection setup, query parameters, and keyterm forwarding.
- `/lyz/codespace/3rd/claude-code/src/hooks/useVoice.ts:121-199`, `:633-781`, and `:874-1056` validate language normalization, audio-level computation, record-buffer-connect orchestration, release timers, retry behavior, and voice availability checks.
- `/lyz/codespace/3rd/claude-code/src/hooks/useVoiceIntegration.tsx:51-54`, `:118-224`, and `:373-623` validate prompt anchoring, interim transcript rendering, hold-key stripping, and keybinding activation thresholds. The 2.1.193 bundle extends this with tap mode and double-tap submit state.

## Key Decisions and Algorithms

### Voice Availability Gate

**What it does:** Determines whether voice mode is visible and whether `/voice` can enable recording.

**How it works:**
1. `Cnr` checks that the auth provider is Claude.ai and that a usable Claude.ai OAuth token exists (`cli_inner_pretty.js:571876-571882`).
2. `Inr` checks the org policy entitlement `allow_voice_mode` (`cli_inner_pretty.js:571884-571885`).
3. `jSt` combines auth, build gate, and entitlement (`cli_inner_pretty.js:571887-571889`).
4. If the gate fails, `/voice` distinguishes unauthenticated users from policy/availability failures. If Claude.ai auth is absent it returns the login prompt; otherwise it asks `gG("allow_voice_mode", "Voice mode", "is")` for a specific org-policy explanation before falling back to a generic unavailable message (`cli_inner_pretty.js:572485-572491`).
5. The React path separately uses `pfe` to combine user intent from settings, auth, GrowthBook/build availability, and org entitlement; it also emits `tengu_voice_init_gate` once with the key gating dimensions (`cli_inner_pretty.js:626058-626075`).

**Why this approach:**
- It keeps `/voice` from enabling a setting that the runtime hook cannot honor.
- It preserves a useful error hierarchy: unauthenticated users get login guidance, org-denied users get an admin/policy explanation, and unknown failures stay generic.
- The hook-level gate avoids expensive auth checks on every render by tying auth re-evaluation to `authVersion` in the readable 2.1.88 source, while still allowing policy and setting changes to affect the UI.

**Key insight:** Voice mode is not merely a UI feature flag. It is the intersection of user intent, Claude.ai OAuth, organization policy, local microphone availability, and a remote STT endpoint.

### `/voice` Toggle and Mode Selection

**What it does:** Enables or disables voice mode and selects the interaction mode.

**How it works:**
1. `_Ff` parses the command argument. Empty means toggle/default, and only `hold`, `tap`, or `off` are accepted (`cli_inner_pretty.js:572478-572482`).
2. If the argument is invalid, the handler returns an explicit usage message (`cli_inner_pretty.js:572495-572496`).
3. `off`, or an empty command when already enabled, writes `voiceEnabled:false` and `voice.enabled:false`, then logs `tengu_voice_toggled` with `enabled:false` (`cli_inner_pretty.js:572497-572500`).
4. Enabling performs runtime checks before writing settings: recording availability, STT availability, recorder dependencies, and microphone permission (`cli_inner_pretty.js:572502-572527`).
5. The selected mode is the explicit `hold` or `tap` argument, otherwise the existing `settings.voice.mode`, otherwise `hold` (`cli_inner_pretty.js:572529`).
6. Enabling writes both legacy and structured settings fields: `voiceEnabled:true` and `voice:{ enabled:true, mode }` (`cli_inner_pretty.js:572530`).
7. The response text reflects the selected mode: hold says to hold the shortcut; tap says to tap with input empty to start and tap again to send (`cli_inner_pretty.js:572532-572545`).

**Why this approach:**
- Keeping `voiceEnabled` alongside `voice.enabled` preserves compatibility with older settings readers while letting the newer `voice` object carry mode and additional options.
- Runtime checks happen before settings writes, so a failed microphone or missing recorder does not leave the UI in an enabled-but-broken state.
- The command accepts explicit `hold` and `tap` arguments because interaction semantics are materially different and should be user-selectable.

**Key insight:** `/voice` is not the recorder. It is a guarded settings mutation plus a capability probe. Actual recording starts later from key events.

### Local Recording Backend Selection

**What it does:** Finds a local recorder capable of producing 16 kHz mono PCM audio.

**How it works:**
1. The bundle includes a native audio module import for `audio-capture.node` (`cli_inner_pretty.js:62-63`).
2. `checkVoiceDependencies` prefers the native module when available and usable, then accepts `arecord`, then checks for SoX `rec` and returns install guidance when absent (`cli_inner_pretty.js:572330-572338`).
3. `checkRecordingAvailability` rejects remote/no-device environments, validates native audio plus Linux ALSA card presence, probes `arecord`, and gives WSL-specific or SoX-specific failure guidance (`cli_inner_pretty.js:572351-572386`).
4. `startRecording` tries native capture first, then `arecord`, then SoX (`cli_inner_pretty.js:572388-572408`).
5. `arecord` and SoX both emit raw PCM to stdout; the constants show 16000 sample rate and one channel (`cli_inner_pretty.js:572410-572455`, `572461-572462`).
6. `stopRecording` stops the native recorder if active, otherwise terminates the child process (`cli_inner_pretty.js:572450-572455`).

**Why this approach:**
- Native capture is the most portable path across macOS, Linux, and Windows when the bundled module loads.
- Linux needs pragmatic fallbacks because environments vary widely: local ALSA, WSLg PulseAudio, headless Linux, and missing native support behave differently.
- The dependency check and availability check are separate because a command can exist on `PATH` but still fail to open an audio device.

**Key insight:** The recorder selection is capability-based, not platform-name-only. That avoids claiming voice works just because a binary is installed.

### WebSocket STT Stream

**What it does:** Sends captured audio to Anthropic's STT service and receives interim/final transcript events.

**How it works:**
1. `connectVoiceStream` refreshes OAuth, reads the Claude.ai token, and returns `null` if no access token exists (`cli_inner_pretty.js:571951-571954`).
2. The WebSocket base URL comes from `VOICE_STREAM_BASE_URL` or the OAuth API base URL converted from HTTP(S) to WS(S) (`cli_inner_pretty.js:571955-571958`).
3. Query parameters specify raw PCM shape and endpointing: `linear16`, `16000`, one channel, `endpointing_ms=300`, `utterance_end_ms=1000`, selected language, `use_conversation_engine=true`, optional `forward_interims=typed`, and `stt_provider=deepgram-nova3` (`cli_inner_pretty.js:571959-571971`).
4. Auth and client identity are sent as headers, and keyterms are sanitized into `x-config-keyterms` when available (`cli_inner_pretty.js:571973-571982`).
5. The client sends an immediate `KeepAlive`, repeats it every 8000 ms, sends binary audio chunks with `Buffer.from`, and later sends `CloseStream` (`cli_inner_pretty.js:571994-572055`, `572155-572159`).
6. `TranscriptInterim` and `TranscriptText` update live preview; `TranscriptEndpoint` promotes the last pending text to final and can resolve finalization immediately after `CloseStream` (`cli_inner_pretty.js:572057-572080`).
7. Close and error paths promote unreported interim text to final, classify connection failures, and suppress finalize-time errors that would otherwise wipe a good transcript (`cli_inner_pretty.js:572096-572151`).

**Why this approach:**
- Streaming audio while the user speaks allows live interim transcript rendering and avoids waiting for a whole recording file.
- `CloseStream` plus finalize timers gives the caller a bounded wait for final transcript flushes.
- The separate no-data timeout enables silent-drop detection in the higher hook layer.

**Key insight:** The WebSocket is not a simple upload. It is a bidirectional state machine with keepalive, binary frames, explicit close-stream signaling, transcript promotion, and connection-failure classification.

### Recording Session Orchestration

**What it does:** Coordinates local capture, WebSocket connection, retries, buffering, state transitions, and transcript submission.

**How it works:**
1. `useVoice` holds local state and refs for connection, accumulated transcript, release timers, focus/tap flags, audio levels, retry state, and full-audio replay buffer (`cli_inner_pretty.js:649459-649489`).
2. Starting a session immediately transitions state to `recording`, resets per-session refs, then checks recording availability (`cli_inner_pretty.js:649698-649741`).
3. Recording starts before the WebSocket is ready. Chunks are buffered locally until `onReady`, then flushed in roughly 32000-byte frames, about one second of 16 kHz 16-bit mono audio (`cli_inner_pretty.js:649747-649763`, `649870-649890`).
4. The hook computes audio levels with RMS over 16-bit little-endian samples and stores a 16-bar rolling history for the UI (`cli_inner_pretty.js:649447-649457`, `649757-649763`, `649993`).
5. Final transcript chunks accumulate with spaces in hold mode; focus mode flushes final chunks immediately and keeps listening (`cli_inner_pretty.js:649796-649835`).
6. `finishRecording` stops local capture, sends `finalize`, logs completion telemetry, injects transcript when present, or reports connection/no-audio/no-speech errors based on `wsConnected`, `hadAudioSignal`, and duration (`cli_inner_pretty.js:649515-649638`).
7. The hook retries one early pre-transcript WebSocket error after 250 ms, and it replays full audio once when a connected session with audio signal resolves via `no_data_timeout` with no transcript (`cli_inner_pretty.js:649533-649600`, `649837-649858`).

**Why this approach:**
- Starting capture immediately avoids losing speech during OAuth refresh or WebSocket handshake.
- Buffer-then-flush gives low perceived latency without dropping early audio.
- Generation counters and stale checks prevent old async callbacks from corrupting a newer recording session.
- Replay is deliberately narrow: it only fires for the "server accepted audio but returned no transcript" signature, not for normal silence or failed connections.

**Key insight:** The hook optimizes for the user beginning to speak immediately after pressing the key. It accepts temporary buffering complexity to avoid a start-of-recording dead zone.

### Hold and Tap Keybinding Activation

**What it does:** Converts terminal key events into start/continue/stop voice actions without making the default space key unusable.

**How it works:**
1. The default Chat binding maps `space` to `voice:pushToTalk` (`cli_inner_pretty.js:178315-178327`).
2. The keybinding handler resolves the active Chat binding with last-wins semantics, so user overrides can disable or reassign voice without a hidden fallback (`cli_inner_pretty.js:650171-650183`).
3. Bare printable bindings are treated differently from modifier chords. Printable keys may insert text, so the handler waits for rapid repeat counts and strips leaked characters; modifier chords activate immediately (`cli_inner_pretty.js:650185`, `650267-650278`, `650320-650338`).
4. Warmup feedback starts after two rapid events and activation occurs after five rapid events for bare keys (`cli_inner_pretty.js:650339-650353`, constants at `650361-650365`).
5. Hold mode starts recording on activation and uses repeat timing to infer release; if no auto-repeat is seen, a fallback timer arms release detection (`cli_inner_pretty.js:649933-649965`).
6. Tap mode only starts when the prompt input is empty, then a later tap finishes the recording. Processing-state taps are swallowed only when needed (`cli_inner_pretty.js:650279-650305`).
7. Escape cancels an active recording and resets the prompt anchor (`cli_inner_pretty.js:650220-650223`).

**Why this approach:**
- Space is ergonomic as a default push-to-talk key, but a single space must still type a normal space. The rapid-repeat threshold is the compromise.
- Modifier chords are unambiguous and do not insert text, so delaying them would only add latency.
- Tap mode requires empty input before starting so a normal space inside a prompt does not unexpectedly begin recording.

**Key insight:** Voice key handling is primarily an input-conflict algorithm. It protects normal typing first, then recognizes intentional hold/tap patterns from terminal repeat behavior.

### Prompt Anchoring, Auto-submit, and Double-tap Submit

**What it does:** Inserts voice text at the cursor while preserving the user's pre-existing prompt.

**How it works:**
1. `useVoiceIntegration` captures prefix and suffix around the cursor when voice starts (`cli_inner_pretty.js:650040-650060`, `650078-650085`).
2. Interim transcript updates rebuild the prompt as prefix, optional leading space, interim text, optional trailing space, suffix; they only write if the input still matches the last value written by the hook (`cli_inner_pretty.js:650086-650100`).
3. Final transcript insertion uses the same anchor guard, moves the cursor after the inserted transcript, and updates the prefix so later chunks append after prior voice text (`cli_inner_pretty.js:650101-650115`).
4. If `settings.voice.autoSubmit` is true or mode is `tap`, a final transcript of at least three words is submitted automatically (`cli_inner_pretty.js:650116-650117`).
5. In hold mode, if auto-submit did not fire, the hook sets `awaitingVoiceSubmitDoubleTap`, allowing a quick second press at the end of input to submit the transcribed prompt (`cli_inner_pretty.js:650118-650122`, `650224-650260`).

**Why this approach:**
- The prefix/suffix anchor allows dictation in the middle of an existing prompt, not only at the end.
- The last-written-value guard prevents late STT callbacks from refilling an input the user has already submitted or edited.
- Double-tap submit keeps hold mode from auto-sending every transcript while still offering a fast send gesture.

**Key insight:** Transcript insertion is guarded against races with human editing. The hook only owns text that it last wrote.

## Cross-version Notes

- The readable 2.1.88 source validates the core architecture: `/voice` command, Claude.ai OAuth requirement, native audio plus SoX/`arecord` fallback, `voice_stream` WebSocket, keyterm hints, language normalization, interim/final transcript handling, release timers, focus mode, retry, and silent-drop replay.
- The 2.1.193 obfuscated bundle is the authority for current behavior. It shows `argumentHint:"[hold|tap|off]"`, structured `settings.voice.mode`, `awaitingVoiceSubmitDoubleTap`, typed interims, and fixed `deepgram-nova3` query parameters that are not all present in the older readable source.
- The org-policy change described in the version notes is real and narrow: `/voice` now asks the shared policy explanation builder for `allow_voice_mode`, backed by the HIPAA entitlement mapping (`cli_inner_pretty.js:572489-572491`, `148824-148829`, `148870-148875`).

## Related Symbols

> Symbol mappings:
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions and constants in this document:

- `voiceCommandHandler` (`bFf`) - `/voice` command handler for auth/policy checks, settings toggle, and mode selection.
- `parseVoiceCommandMode` (`_Ff`) - parses `hold`, `tap`, `off`, empty, and invalid arguments.
- `isVoiceModeAvailable` (`jSt`) - combines voice auth, build gate, and org entitlement.
- `hasVoiceAuth` (`Cnr`) - validates Claude.ai auth and token presence.
- `isVoiceAllowedByPolicy` (`Inr`) - checks `allow_voice_mode`.
- `useVoiceEnabled` (`pfe`) - React gate combining user intent, auth, build/growth availability, and policy.
- `connectVoiceStream` (`knr`) - OAuth WebSocket client for speech-to-text.
- `voiceStreamPath` (`YBf`) - `/api/ws/speech_to_text/voice_stream`.
- `isVoiceStreamAvailable` (`oFo`) - checks OAuth/token availability for STT.
- `probeVoiceConnectivity` (`rFo`) - classifies connectivity failure signatures.
- `checkVoiceDependencies` (`pFf`) - validates native audio, `arecord`, or SoX availability.
- `checkRecordingAvailability` (`mFf`) - verifies an actual usable local recorder and environment.
- `startRecording` (`szl`) - starts native, `arecord`, or SoX recording.
- `stopRecording` (`izl`) - stops native or child-process recording.
- `useVoice` (`wtm`) - main recording, WebSocket, retry, and transcript orchestration hook.
- `computeAudioLevel` (`imc`) - RMS audio-level computation for the waveform.
- `useVoiceIntegration` (`Zar`) - prompt anchoring, interim/final transcript insertion, auto-submit, and double-tap submit.
- `useVoiceKeybindingHandler` (`elr`) - hold/tap keybinding state machine.
- `voiceDefaultState` (`JRd`) - voice state object including `awaitingVoiceSubmitDoubleTap`.
- `VoiceProvider` (`QRd`) - voice state provider.
- `useVoiceState` (`e0`) - selector hook for voice state.
- `useSetVoiceState` (`Got`) - state setter hook.
- `useGetVoiceState` (`kxn`) - synchronous voice state reader hook.
- `normalizeLanguageForSTT` (`AYe`) - maps language settings to supported STT language codes.
