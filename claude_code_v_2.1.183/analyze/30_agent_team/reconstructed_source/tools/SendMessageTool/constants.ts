/**
 * SendMessage tool name constant (v2.1.183).
 *
 * 2.1.183 regions: cli_inner_pretty.js:221450  `var zh = "SendMessage";`
 *   `zh` is referenced as the SendMessage tool def's `name:` field (tool def p$p @434568).
 * 2.1.88 ancestor: tools/SendMessageTool/constants.ts (SEND_MESSAGE_TOOL_NAME).
 * scaffold: _scout_dossier_agent_team.md §2 (SendMessage tool name const `zh`).
 * cross-val: re-read `var zh = "SendMessage"` @221450 in the 183 bundle.
 */

// 2.1.183: SEND_MESSAGE_TOOL_NAME = zh @cli_inner_pretty.js:221450 ("SendMessage")
/** Canonical name of the SendMessage tool. */
export const SEND_MESSAGE_TOOL_NAME = 'SendMessage'

// 2.1.183: LIST_AGENTS_TOOL = Gtt @cli_inner_pretty.js:221577 ("ListAgents")
/**
 * The tool name cited by SendMessage.validateInput's "is not a local socket address"
 * rejection — the canonical way to discover valid cross-session addresses. The error
 * literally interpolates this string ("Use an address from ListAgents.", @434622-434627).
 * NOTE the scout dossier tentatively read `Gtt` as an "address-list constant"; the only
 * `Gtt` assignment in the bundle (@221577) is the literal string "ListAgents" (the tool name).
 */
export const LIST_AGENTS_TOOL = 'ListAgents'

// Mapping: zh→SEND_MESSAGE_TOOL_NAME, Gtt→LIST_AGENTS_TOOL
