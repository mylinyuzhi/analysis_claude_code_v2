# Chrome file security and host setup

Chrome uploads cross two trust boundaries: the model asks an MCP tool to name a local path, and the
CLI then sends the file’s bytes to a browser page. The 2.1.227 implementation treats authorization
and stable byte acquisition as separate proofs. It also retains the cross-platform native-host setup
and the Windows launch repair from the 2.1.220 line.

## 1. Upload input transformation

### Batch-aware path-to-content rewrite

**What it does:** Converts `file_upload` paths into base64 file objects before a Chrome bridge call,
including upload actions inside one non-nested `browser_batch`.

**How it works:**
1. `prepareChromeFileUploadInput` (`GgS`) creates one 10 MiB `remaining` budget for the entire call.
2. A direct `file_upload` is delegated to the file processor.
3. A `browser_batch` must contain an `actions` array whose entries are objects with string names.
4. Tool names must be printable ASCII. Nested `browser_batch` is rejected.
5. A case- or whitespace-normalized spelling of `file_upload` is rejected unless the original name
   is exactly `file_upload`; the validator never silently canonicalizes a potentially different
   extension-side dispatch spelling.
6. Only exact upload actions are rewritten. Other batch actions remain byte-for-byte equivalent.
7. Each upload path is authorized, read, optionally digest-checked, assigned a safe display name and
   MIME type, and projected as `{data, name, mimeType}`.
8. The original `paths` field is removed so the browser extension never needs access to the CLI’s
   filesystem namespace.

**Why this approach:**
- Remote, container, and CLI sessions do not necessarily share a filesystem with Chrome. Sending
  bytes makes the bridge independent of path namespace.
- One aggregate budget bounds the WebSocket message, whereas a per-file cap would allow a large
  batch to evade the intended memory and message-size limit.
- Rejecting spelling differentials closes a parser-gap where the CLI and extension could disagree
  about whether an action is an upload.
- Nested batches are refused to keep the validator’s recursion and budget semantics unambiguous.

**Key insight:** The upload fix is not “make Chrome understand remote paths.” It removes paths from
the remote side of the protocol and makes the CLI the sole filesystem reader.

Evidence: `GgS` and `hif` at `cli_inner_pretty.js:589581-589645`. The MCP tool wrappers invoke this
preprocessor in both bundled MCP runtime trees before relay.

## 2. Path authorization

### Raw-and-resolved path policy

**What it does:** Refuses network, suspicious, denied, ask-gated, or unreadable paths both before and
after symlink resolution.

**How it works:**
1. The requested path is normalized, and its raw spelling plus ancestors are inspected before any
   `realpath` call.
2. UNC/network forms and suspicious Windows spellings are rejected at this pre-filesystem stage.
3. The path is resolved with `realpath`; the resolved path and its ancestor chain are inspected
   again.
4. Read `deny` and read `ask` rules are applied to every relevant alias. An `ask` match is refused
   rather than opening a second implicit approval flow inside an upload.
5. Explicit attachment and remote-staging roots are opened as directories without following a
   final symlink. The open descriptor’s `dev`/`ino` must match the name-resolved directory.
6. Staging roots are rejected if they overlap the sensitive configuration directory.
7. A path in the registered attachment root is accepted only with its previously registered digest
   carried forward for later verification.
8. Outside those roots, a session whose `Read` tool is denied or ask-gated is refused.
9. `bypassPermissions` skips only the final generic read-allow check. Network paths, suspicious
   spellings, explicit deny/ask rules, and `Read`-tool restrictions have already been enforced.
10. Normal modes require every resolved ancestor to pass the same read-permission predicate used by
    local file reading.

**Why this approach:**
- Checking before `realpath` matters because resolving a UNC path can itself initiate network I/O.
- Rechecking afterward catches a harmless-looking local symlink that resolves to a network or
  denied path.
- Applying policy to aliases prevents a permitted spelling from becoming a path to denied content.
- Handle-validating an allowed root reduces a directory-swap race between checking a root and using
  it.
- Treating `ask` as refusal is fail-closed: the page destination and side effect are already part of
  another tool transaction.

**Key insight:** `bypassPermissions` is not an upload-security bypass. Its short circuit is placed
after the trust-boundary checks, so it removes only the ordinary session read allowlist gate.

Evidence: `authorizeChromeUploadPath` (`WgS`) at `cli_inner_pretty.js:589646-589720`.

### Registered attachment identity

**What it does:** Ensures a path from the attachment store still contains the exact bytes originally
registered for that attachment.

**How it works:**
1. Authorization detects whether the resolved path belongs to the attachment root.
2. It looks up a stored digest and returns that digest alongside the real path.
3. The file is read using the stable-read algorithm below.
4. The processor hashes the resulting bytes and compares them with the required digest.
5. A mismatch is converted to the same user-safe “not allowed to read” result as other rejected
   uploads, while a detailed diagnostic stays in local logs.

**Why this approach:**
- Root membership proves where a file is, not which attachment it represents.
- A digest binds the user’s earlier attachment registration to the later upload bytes.
- Using a generic user-facing refusal avoids exposing sensitive path/policy detail to the model.

**Key insight:** A trusted attachment directory is not automatically a trusted mutable file. The
digest turns a directory capability into a content-identity capability.

Evidence: `WgS` and `hif` at `cli_inner_pretty.js:589688-589719`, `589617-589642`.

## 3. Descriptor-bound stable reads

### Open-file identity verification

**What it does:** Proves that the opened descriptor still refers to the authorized resolved path,
even if an attacker races pathname replacement.

**How it works:**
1. The reader first `lstat`s the authorized name and requires a regular file.
2. It opens the file read-only with no-follow and platform safety flags.
3. It stats the open descriptor and rejects non-files.
4. Files with `nlink > 1` are refused because another hard-link path could alias content outside the
   allowed directory.
5. `verifyOpenFileBinding` (`dsi`) reads `/proc/self/fd/<fd>` when available.
6. A deleted suffix or a descriptor path different from the authorized real path means the path
   moved during validation.
7. When `/proc` handle lookup is unavailable, the fallback re-resolves the path and requires the
   name’s `dev`/`ino` to match the open descriptor’s sample.
8. `ENAMETOOLONG` during handle lookup is classified as moved rather than silently falling back.

**Why this approach:**
- Path validation followed by a normal `readFile(path)` leaves a classic check/use race.
- An open descriptor provides a stable kernel object that survives pathname changes.
- `/proc/self/fd` gives stronger path binding on Linux; inode/device sampling is a portable fallback.
- Hard-link refusal is conservative and inconveniences package-store files, but prevents an allowed
  name from aliasing a separately reachable object.

**Key insight:** Authorization attaches to the descriptor, not merely to the string that was checked
earlier. This is the main difference between path validation and race-resistant acquisition.

Evidence: `dsi` and `qgS` at `cli_inner_pretty.js:589736-589785`.

### Snapshot-bounded read and growth detection

**What it does:** Reads exactly the validated file snapshot without allowing a concurrently growing
file to exceed the call budget.

**How it works:**
1. The descriptor’s initial size is compared with the remaining aggregate budget.
2. The bounded reader allocates `size + 1` bytes, not merely `size`.
3. It reads positionally until EOF or the extra byte is filled.
4. Reading more than the sampled size returns `grew`.
5. The final buffer length is checked against the remaining budget again.
6. Only after all checks does the reader decrement the shared budget and return bytes.
7. The descriptor closes in `finally` on success, refusal, or read error.

**Why this approach:**
- A size check before an unbounded read can be invalidated by concurrent append.
- The one-byte sentinel detects growth without reading an arbitrarily large file.
- A shared mutable budget makes sequential files in a batch consume one upper bound.
- Positional reads reduce dependence on mutable descriptor offset state.

**Key insight:** The extra byte is a deliberate race detector. It converts “the file may have grown”
from an unbounded-memory problem into a bounded refusal.

Evidence: `readBoundedToSnapshot` (`_if`) and `readStableUploadFile` (`qgS`) at
`cli_inner_pretty.js:589721-589732`, `589756-589785`.

## 4. Browser discovery and native-host setup

### Bounded Windows App Paths launch

**What it does:** Resolves and launches the installed browser executable reliably on Windows, then
falls back to the operating-system URL handler.

**How it works:**
1. `resolveBrowserViaAppPaths` (`xdd`) queries both HKCU and HKLM App Paths with the absolute
   `%SYSTEMROOT%\System32\reg.exe` and a 10-second process timeout.
2. It parses only string default values, removes balanced quotes, expands `%VAR%` case-insensitively,
   and requires an absolute drive or UNC path.
3. Filesystem existence is independently bounded at five seconds.
4. A directory is refused; an executable-like non-directory is accepted.
5. WindowsApps paths receive a narrow exception for unusual stat errors other than missing/not-dir,
   accommodating app execution aliases.
6. `openUrlInChrome` (`utt`) accepts only HTTP(S), detects a compatible browser, and on Windows
   launches the resolved executable detached.
7. If App Paths lookup or spawn fails, it invokes `rundll32 url,OpenURL` and records which fallback
   path was used.
8. macOS uses `open -a`; Linux/WSL tries known browser binaries in order.

**Why this approach:**
- Generic URL handlers can select a non-Chromium browser and break extension setup.
- Registry App Paths identify the actual installed executable without assuming a fixed install
  directory.
- Separate subprocess and stat bounds prevent endpoint security or broken network-backed profiles
  from hanging startup.
- Keeping `rundll32` preserves compatibility when direct discovery fails.

**Key insight:** Windows discovery and URL dispatch are deliberately separate fallbacks. Knowing the
browser’s data directory is not sufficient proof that its executable can be launched.

Evidence: `xdd` and `utt` at `cli_inner_pretty.js:241370-241419`, `241575-241636`.

### Idempotent native-host installation and reconnect suppression

**What it does:** Installs the browser native-messaging manifest while preventing routine rewrites or
headless startup from repeatedly opening the reconnect page.

**How it works:**
1. Setup generates one platform-specific wrapper executable/script and constructs a stable manifest.
2. For each supported manifest directory, existing content is read and compared byte-for-byte with
   the generated JSON.
3. Identical content is left untouched.
4. The installer distinguishes a missing manifest from replacing an existing different manifest.
5. Windows additionally registers the manifest path for each supported browser.
6. The reconnect page is considered only when at least one existing manifest was replaced and no
   target was newly missing.
7. The extension-installed probe must succeed before the page opens.
8. `skipReconnectAutoOpen` suppresses the page for headless/internal setup; the headless entry path
   passes this flag explicitly.

**Why this approach:**
- Content comparison makes installation idempotent and avoids noisy filesystem changes.
- Reconnect is useful after an actual host definition update, but disruptive on every startup or
  when no extension exists.
- The explicit suppression flag is more reliable than inferring interactivity deep inside the
  installer.

**Key insight:** The booleans describe two different facts—“a previously present manifest changed”
and “a manifest location was absent.” The reconnect page opens only for the update case, not for
ordinary first creation or no-op setup.

Evidence: `installChromeNativeHostManifest` (`UZa`) at
`cli_inner_pretty.js:750530-750578`; headless suppression at `864113`.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `prepareChromeFileUploadInput` (`GgS`) — validates batch structure and shares the upload budget.
- `authorizeChromeUploadPath` (`WgS`) — raw/resolved policy and trusted-root proof.
- `verifyOpenFileBinding` (`dsi`) — descriptor-to-path identity check.
- `readStableUploadFile` (`qgS`) — hard-link, growth, and aggregate-size enforcement.
- `resolveBrowserViaAppPaths` (`xdd`) — bounded Windows registry resolution.
- `openUrlInChrome` (`utt`) — cross-platform browser launcher.
- `installChromeNativeHostManifest` (`UZa`) — idempotent manifest and reconnect-page policy.
