/**
 * Socket-address parsing + local-socket-address validation for cross-session
 * SendMessage recipients (`uds:` unix-domain socket / `bridge:` Remote-Control peer),
 * with the v2.1.183-new Windows named-pipe (`\\.\pipe\<name>`) support.
 *
 * 2.1.183 regions covered (cli_inner_pretty.js):
 *   - parseSocketAddress     (LLa) @359974-359980  (uds:/bridge:/ leading-slash / \\.\pipe\ schemes)
 *   - isLocalSocketAddress   (Lhe) @359981-359985  (NEW gate — //-prefixed must be a valid named pipe)
 *
 * 2.1.88 ancestor mirrored: utils/peerAddress.ts (`parseAddress`). The 88 parser recognised
 *   `uds:` / `bridge:` and a leading `/` (treated as `uds`); v2.1.183 LLa ADDS a fourth branch:
 *   a leading `\\.\pipe\` is also treated as `uds` (@359978). The 88 source had NO `isLocalSocketAddress`
 *   predicate — it is new in v2.1.183 (grep "is not a local socket address" = 0 in v2.1.156).
 *
 * scaffold: 30_agent_team/mailbox_lifecycle_and_sendmessage_delta.md §3.3.
 *
 * cross-val (re-read in the 183 bundle):
 *   - LLa branch order + slice offsets @359974-359979: uds:->slice(4), bridge:->slice(7),
 *     "/"->target=e, "\\.\pipe\"->target=e, else scheme:"other".
 *   - Lhe @359981: `if (!/^[\\/]{2}/.test(e)) return !0;` then the named-pipe regex
 *     `/^[\\/]{2}[.?][\\/]pipe[\\/]([^\\/]+)$/i` and the `.`/`..` capture rejection.
 */

/** The discrete address schemes a `to:` string can resolve to. */
export type SocketAddressScheme = 'uds' | 'bridge' | 'other'

export interface SocketAddress {
  scheme: SocketAddressScheme
  /** The address payload after the scheme prefix (the socket path / session id / bare name). */
  target: string
}

// 2.1.183: parseSocketAddress = LLa @cli_inner_pretty.js:359974
/**
 * Classify a SendMessage recipient string into a {scheme, target}.
 *
 * - `"uds:<path>"`        -> {scheme:"uds",    target:<path>}            (@359975)
 * - `"bridge:<sessionId>"`-> {scheme:"bridge", target:<sessionId>}       (@359976)
 * - `"/abs/socket.sock"`  -> {scheme:"uds",    target:<the whole string>}(@359977, leading-slash = unix path)
 * - `"\\.\pipe\<name>"`   -> {scheme:"uds",    target:<the whole string>}(@359978, NEW vs v2.1.156)
 * - anything else (a bare teammate name, `"main"`) -> {scheme:"other", target:<string>}
 *
 * Note `scheme:"uds"` covers both an explicit `uds:` prefix and an implicit
 * path/pipe form; the explicit-prefix forms strip the prefix from `target`, the
 * implicit forms keep the whole string as `target`.
 */
export function parseSocketAddress(to: string): SocketAddress {
  if (to.startsWith('uds:')) return { scheme: 'uds', target: to.slice(4) } // @359975
  if (to.startsWith('bridge:')) return { scheme: 'bridge', target: to.slice(7) } // @359976
  if (to.startsWith('/')) return { scheme: 'uds', target: to } // @359977
  // NEW in v2.1.183: a Windows named pipe is a local (uds-equivalent) socket address.
  if (to.startsWith('\\\\.\\pipe\\')) return { scheme: 'uds', target: to } // @359978
  return { scheme: 'other', target: to } // @359979
}

// 2.1.183: isLocalSocketAddress = Lhe @cli_inner_pretty.js:359981
/**
 * A *format* guard for the new cross-session socket transports. Permissive by design:
 *
 * - Any string NOT starting with two slashes/backslashes passes immediately (@359982) —
 *   so a bare teammate name (`"researcher"`), the literal `"main"`, and a `uds:` unix path
 *   (whose target may start with a *single* `/`) all return true.
 * - A `//`-prefixed string must be a well-formed Windows named pipe `\\.\pipe\<name>`
 *   (or `//?/pipe/<name>`, case-insensitive, @359983) AND `<name>` must not be `.` or `..`
 *   (@359984). Otherwise it is rejected as not-a-local-socket-address.
 *
 * It exists to catch a malformed Windows named-pipe address up front (turning an opaque
 * deep-socket failure into an actionable validation message) and to reject the degenerate
 * `\\.\pipe\.` / `\\.\pipe\..` cases. It is NOT a teammate-name validator.
 */
export function isLocalSocketAddress(value: string): boolean {
  if (!/^[\\/]{2}/.test(value)) return true // @359982 — not a //-prefixed UNC/pipe path => accept
  const match = /^[\\/]{2}[.?][\\/]pipe[\\/]([^\\/]+)$/i.exec(value) // @359983 — must be \\.\pipe\<name>
  return match !== null && match[1] !== '.' && match[1] !== '..' // @359984
}

// Mapping: LLa->parseSocketAddress, Lhe->isLocalSocketAddress
//          (v2.1.156 before-picture: lO4 parser @407013, NO Lhe equivalent;
//           v2.1.88 ancestor: parseAddress in utils/peerAddress.ts)
