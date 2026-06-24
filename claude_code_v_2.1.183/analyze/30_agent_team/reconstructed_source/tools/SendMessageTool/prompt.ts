/**
 * SendMessage tool description + model-facing prompt (v2.1.183).
 *
 * 2.1.183 regions covered (cli_inner_pretty.js):
 *   - buildSendMessagePrompt    (rza) @434285-434313   (the compact markdown prompt body; content @434287-434312)
 *   - SEND_MESSAGE_DESCRIPTION  (nza) @434314          (= "Send a message to another agent")
 *
 * 2.1.88 ancestor mirrored: tools/SendMessageTool/prompt.ts (`getPrompt` / `DESCRIPTION`).
 *   The 88/156 prompt was already this same compact markdown. The v2.1.156 recipient table had a
 *   SINGLE row (`"researcher"` | Teammate by name); the v2.1.183 delta is the ADDITION of a second
 *   row, `"main"` | The main conversation (background subagents only). There was NO `"*"` broadcast
 *   row in the 156 prompt body — the `to:"*"` broadcast rejection lived only in 156 validateInput.
 *   The `uds:`/`bridge:` cross-session addresses are NOT advertised in the 183 prompt body (they are
 *   accepted + format-validated in validateInput, not listed here).
 *
 * scaffold: 30_agent_team/mailbox_lifecycle_and_sendmessage_delta.md §3.1.
 *
 * cross-val (re-read in the 183 bundle): the full `rza` body @434286-434313 was read verbatim and
 *   matched byte-for-byte against assets/tools/SendMessage.md (Description = "Send a message to
 *   another agent"; Search hint = "send messages to agent teammates"). The recipient table is exactly
 *   the two rows reproduced below; the `${""}` empty-template-literal interpolations are bundler join
 *   artifacts present in the source string and are reproduced for fidelity.
 */

// 2.1.183: SEND_MESSAGE_DESCRIPTION = nza @cli_inner_pretty.js:434314
/** One-line tool description (verbatim, byte-exact with assets/tools/SendMessage.md). */
export const SEND_MESSAGE_DESCRIPTION = 'Send a message to another agent'

// 2.1.183: buildSendMessagePrompt = rza @cli_inner_pretty.js:434285
/**
 * The model-facing SendMessage prompt — a compact markdown block. Verbatim from the
 * v2.1.183 bundle (@434287-434312), then `.trim()`ed exactly as the source does.
 *
 * The recipient table lists the two recipient shapes the model addresses by string:
 *   - `"researcher"` -> a teammate by name
 *   - `"main"`       -> the main conversation (background subagents only)  [NEW in v2.1.178 redesign]
 * The cross-session `uds:`/`bridge:` addresses are NOT advertised here (they are accepted +
 * format-validated in validateInput, discoverable via the ListAgents tool).
 */
export function buildSendMessagePrompt(): string {
  return `
# SendMessage

Send a message to another agent.

\`\`\`json
{"to": "researcher", "summary": "assign task 1", "message": "start on task #1"}
\`\`\`

| \`to\` | |
|---|---|
| \`"researcher"\` | Teammate by name |
| \`"main"\` | The main conversation (background subagents only) |${''}

Your plain text output is NOT visible to other agents — to communicate, you MUST call this tool. Messages from teammates are delivered automatically; you don't check an inbox. Refer to active teammates by name; to resume a completed background agent, use the \`agentId\` (format \`a...-...\`) from its spawn result. When relaying, don't quote the original — it's already rendered to the user.${''}

## Protocol responses (legacy)

If you receive a JSON message with \`type: "shutdown_request"\` or \`type: "plan_approval_request"\`, respond with the matching \`_response\` type — echo the \`request_id\`, set \`approve\` true/false:

\`\`\`json
{"to": "team-lead", "message": {"type": "shutdown_response", "request_id": "...", "approve": true}}
{"to": "researcher", "message": {"type": "plan_approval_response", "request_id": "...", "approve": false, "feedback": "add error handling"}}
\`\`\`

Approving shutdown terminates your process. Rejecting plan sends the teammate back to revise. Don't originate \`shutdown_request\` unless asked. Don't send structured JSON status messages — use TaskUpdate.
`.trim()
}

// Mapping: rza->buildSendMessagePrompt, nza->SEND_MESSAGE_DESCRIPTION
//          (v2.1.156 before-picture: prompt iO4 @cli_inner_pretty.js(156):407200 had a one-row
//           recipient table — only `"researcher"` | Teammate by name; v2.1.183 ADDS the `"main"` row
//           (confirmed in the 183 bundle @434298). The `to:"*"` broadcast was rejected in 156
//           validateInput @407495, never a prompt row. Description was already "Send a message to
//           another agent".)
