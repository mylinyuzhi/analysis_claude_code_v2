
// @from(Ln 560814, Col 4)
kj5 = `# Managed Agents — Core Concepts

## Architecture

Managed Agents is built around four core concepts:

| Concept | Endpoint | What it is |
|---|---|---|
| **Agent** | \`/v1/agents\` | A persisted, versioned object defining the agent's capabilities and persona: model, system prompt, tools, MCP servers, skills. **Must be created before starting a session.** See the Agents section below. |
| **Session** | \`/v1/sessions\` | A stateful interaction with an agent. References a pre-created agent by ID + an environment + initial instructions. Produces an event stream. |
| **Environment** | \`/v1/environments\` | A template defining the configuration for container provisioning. |
| **Container** | N/A | An isolated compute instance where the agent's **tools** execute (bash, file ops, code). The agent loop does not run here — it runs on Anthropic's orchestration layer and acts on the container via tool calls. |

\`\`\`
                       ┌─────────────────────────────────────┐
                       │  Anthropic orchestration layer      │
Agent (config) ───────▶│  (agent loop: Claude + tool calls)  │
                       └──────────────┬──────────────────────┘
                                      │ tool calls
                                      ▼
Environment (template) ──▶ Container (tool execution workspace)
                                 │
                         Session ─┤
                                 ├── Resources (files, repos — mounted at startup)
                                 ├── Vault IDs (MCP credential references)
                                 └── Conversation (event stream in/out)
\`\`\`

> **Agent creation is a prerequisite.** Sessions reference a pre-created agent by ID — \`model\`/\`system\`/\`tools\` live on the agent object, never on the session. Every flow starts with \`POST /v1/agents\`.

---

## Session Lifecycle

\`\`\`
rescheduling → running ↔ idle → terminated
\`\`\`

| Status         | Description                                                        |
| -------------- | ------------------------------------------------------------------ |
| \`idle\` | Agent has finished the current task, and is awaiting input. It's either waiting for input to continue working via a \`user.message\` or blocked awaiting a \`user.custom_tool_result\` or \`user.tool_confirmation\`. The \`stop_reason\` attached contains more information about why the Agent has stopped working. |
| \`running\` | Session has starting running, and the Agent is actively doing work. |
| \`rescheduling\` | Session is (re)scheduling after a retryable error has occurred, ready to be picked up by the orchestration system. |
| \`terminated\` | Session has terminated, entering an irreversible and unusable state.  |

- Events can be sent when the session is \`running\` or \`idle\`. Messages are queued and processed in order.
- The agent transitions \`idle → running\` when it receives a new event, then back to \`idle\` when done.
- Errors surface as \`session.error\` events in the stream, not as a status value.

### Built-in session features

- **Context compaction** — if you approach max context, the API automatically condenses session history to keep the interaction going
- **Prompt caching** — historical repeated tokens are cached, reducing processing time and cost
- **Extended thinking** — on by default, returned as \`agent.thinking\` events

### Session operations

| Operation | Notes |
|---|---|
| List / fetch | Paginated list or single resource by ID |
| Update | Only \`title\` is updatable |
| Archive | Session becomes **read-only**. Not reversible. |
| Delete | Permanently deletes session, event history, container, and checkpoints. |

---

## Sessions

A session is a running agent instance inside an environment.

### Session Object

Key fields returned by the API:

| Field           | Type     | Description                                         |
| --------------- | -------- | --------------------------------------------------- |
| \`type\` | string | Always \`"session"\` |
| \`id\` | string | Unique session ID |
| \`title\` | string | Human-readable title |
| \`status\` | string | \`idle\`, \`running\`, \`rescheduling\`, \`terminated\` |
| \`created_at\` | string | ISO 8601 timestamp |
| \`updated_at\` | string | ISO 8601 timestamp |
| \`archived_at\` | string | ISO 8601 timestamp (nullable) |
| \`environment_id\` | string | Environment ID |
| \`agent\` | object | Agent configuration |
| \`resources\` | array | Attached files and repos |
| \`metadata\` | object | User-provided key-value pairs (max 8 keys) |
| \`usage\` | object | Token usage statistics |

### Creating a session

**A session is meaningless without an agent.** Sessions reference a pre-created agent by ID. Create the agent first via \`agents.create()\`, then reference it:

\`\`\`ts
// 1. Create the agent (reusable, versioned)
const agent = await client.beta.agents.create(
  {
    name: "Coding Assistant",
    model: "{{OPUS_ID}}",
    system: "You are a helpful coding agent.",
    tools: [{ type: "agent_toolset_20260401"}],
  },
);

// 2. Start a session that references it
const session = await client.beta.sessions.create(
  {
    agent: agent.id,  // string shorthand → latest version. Or: { type: "agent", id: agent.id, version: agent.version }
    environment_id: environmentId,
    title: "Hello World Session",
  },
);
\`\`\`

**Session creation parameters:**

| Field           | Type     | Required | Description                                    |
| --------------- | -------- | -------- | ---------------------------------------------- |
| \`agent\`         | string or object | **Yes** | String shorthand \`"agent_abc123"\` (latest version) or \`{type: "agent", id, version}\` |
| \`environment_id\`| string   | **Yes**  | Environment ID                                 |
| \`title\`         | string   | No       | Human-readable name (appears in logs/dashboards) |
| \`resources\`     | array    | No       | Files or GitHub repos, mounted to the container at startup |
| \`vault_ids\`     | array    | No       | Vault IDs (\`vlt_*\`) — MCP credentials with auto-refresh. See \`shared/managed-agents-tools.md\` → Vaults. |
| \`metadata\`      | object   | No       | User-provided key-value pairs                  |

**Agent configuration fields** (passed to \`agents.create()\`, not \`sessions.create()\`):

| Field         | Type     | Required | Description                                    |
| ------------- | -------- | -------- | ---------------------------------------------- |
| \`name\`        | string   | **Yes**  | Human-readable name (1-256 chars)              |
| \`model\`       | string or object | **Yes** | Claude model ID (bare string, or \`{id, speed}\` object). All Claude 4.5+ models supported. |
| \`system\`      | string   | No       | System prompt — defines the agent's behavior (up to 100K chars) |
| \`tools\`       | array    | No       | Encompasses three kinds: (1) pre-built Claude Agent tools (\`agent_toolset_20260401\`), (2) MCP tools (\`mcp_toolset\`), and (3) custom client-side tools. Max 128. |
| \`mcp_servers\` | array    | No       | MCP server connections — standardized third-party capabilities (e.g. GitHub, Asana). Max 20, unique names. See \`shared/managed-agents-tools.md\` → MCP Servers. |
| \`skills\`      | array    | No       | Customized "best-practices" context with progressive disclosure. Max 64. See \`shared/managed-agents-tools.md\` → Skills. |
| \`description\` | string   | No       | Description of the agent (up to 2048 chars)    |
| \`metadata\`    | object   | No       | Arbitrary key-value pairs (max 16, keys ≤64 chars, values ≤512 chars) |

---

## Agents

**This is where every Managed Agents flow begins.** The agent object is a persisted, versioned configuration — you create it once, then reference it by ID every time you start a session. No agent → no session.

### Agent Object

The API is **flat** — \`model\`, \`system\`, \`tools\` etc. are top-level fields, not wrapped in an \`agent:{}\` sub-object.

| Field              | Type     | Required | Description                                        |
| ------------------ | -------- | -------- | -------------------------------------------------- |
| \`name\`             | string   | Yes      | Human-readable name                                |
| \`model\`            | string   | Yes      | Claude model ID                                    |
| \`system\`           | string   | No       | System prompt                                      |
| \`tools\`            | array    | No       | Agent toolset / MCP toolset / custom tools         |
| \`mcp_servers\`      | array    | No       | MCP server connections                             |
| \`skills\`           | array    | No       | Skill references (max 64)                          |
| \`description\`      | string   | No       | Description of the agent                           |
| \`metadata\`         | object   | No       | Arbitrary key-value pairs                          |

### Lifecycle: create once, run many, update in place

The agent is a **persistent resource**, not a per-run parameter. The intended pattern:

\`\`\`
┌─ setup (once) ─────────┐     ┌─ runtime (every invocation) ─┐
│ agents.create()        │     │ sessions.create(             │
│   → store agent_id     │ ──→ │   agent={type:..., id: ID}   │
│     in config/env/db   │     │ )                            │
└────────────────────────┘     └──────────────────────────────┘
\`\`\`

**Anti-pattern:** calling \`agents.create()\` at the top of every script run. This accumulates orphaned agent objects, pays create latency on every invocation, and defeats the versioning model. If you see \`agents.create()\` in a function that's called per-request or per-cron-tick, that's wrong — hoist it to one-time setup and persist the ID.

### Versioning

Each \`POST /v1/agents/{id}\` (update) creates a new immutable version (numeric timestamp, e.g. \`1772585501101368014\`). The agent's history is append-only — you can't edit a past version.

**Why version:**
- **Reproducibility** — pin a session to a known-good config: \`{type: "agent", id, version: 3}\`
- **Safe iteration** — update the agent without breaking sessions already running on the old version
- **Rollback** — if a new system prompt regresses, pin new sessions back to the prior version while you debug

**\`version\` is optional.** Omit it (or use the string shorthand \`agent="agent_abc123"\`) to get the latest version at session-creation time. Pass it explicitly (\`{type: "agent", id, version: N}\`) to pin for reproducibility.

**Getting the version to pin:** \`agents.create()\` and \`agents.update()\` both return \`version\` in the response. Store it alongside \`agent_id\`. To fetch the current latest for an existing agent: \`GET /v1/agents/{id}\` → \`.version\`.

**When to update vs create new:** Update (\`POST /v1/agents/{id}\`) when it's conceptually the same agent with tweaked behavior (better prompt, extra tool). Create a new agent when it's a different persona/purpose. Rule of thumb: if you'd give it the same \`name\`, update.

### Agent Endpoints

| Operation        | Method   | Path                                  |
| ---------------- | -------- | ------------------------------------- |
| Create           | \`POST\`   | \`/v1/agents\`                          |
| List             | \`GET\`    | \`/v1/agents\`                          |
| Get              | \`GET\`    | \`/v1/agents/{id}\`                     |
| Update           | \`POST\`   | \`/v1/agents/{id}\`                     |
| Archive          | \`POST\`   | \`/v1/agents/{id}/archive\`             |

> ⚠️ **Archive is permanent.** Archiving makes the agent read-only: existing sessions continue to run, but **new sessions cannot reference it**, and there is no unarchive. Since agents have no \`delete\`, this is the terminal lifecycle state. Never archive a production agent as routine cleanup — confirm with the user first.

### Using an Agent in a Session

Reference the agent by string ID (latest version) or by object with an explicit version:

\`\`\`python
# String shorthand — uses the agent's latest version
session = client.beta.sessions.create(
    agent=agent.id,
    environment_id=environment_id,
)

# Or pin to a specific version (int)
session = client.beta.sessions.create(
    agent={"type": "agent", "id": agent.id, "version": agent.version},
    environment_id=environment_id,
)
\`\`\`

`
// @from(Ln 561033, Col 4)
Vj5 = () => {}
// @from(Ln 561034, Col 4)
Ej5 = `# Managed Agents — Environments & Resources

## Environments

Creating a session requires an \`environment_id\`. Environments are **reusable configuration templates** for spinning up containers in Anthropic's infrastructure — you might create different environments for different use cases (e.g. data visualization vs web development, with different package sets). Anthropic handles scaling, container lifecycle, and work orchestration.

**Environment names must be unique.** Creating an environment with an existing name returns 409.

### Networking

| Network Policy                  | Description                                                   |
| ------------------------------- | ------------------------------------------------------------- |
| \`unrestricted\`                  | Full egress (except legal blocklist)                          |
| \`package_managers_and_custom\`   | Package managers + custom \`allowed_hosts\`                      |

\`\`\`json
{
  "networking": {
    "type": "package_managers_and_custom",
    "allowed_hosts": ["api.example.com"]
  }
}
\`\`\`

**MCP caveat:** If using restricted networking, make sure \`allowed_hosts\` includes your MCP server domains. Otherwise the container can't reach them and tools silently fail.

### Creating an environment

The SDK adds \`managed-agents-2026-04-01\` automatically. TypeScript:

\`\`\`ts
const env = await client.beta.environments.create({
  name: "my_env",
  config: {
    type: "cloud",
    networking: { type: "unrestricted" },
  },
});
\`\`\`

### Environment CRUD

| Operation        | Method   | Path                                       | Notes |
| ---------------- | -------- | ------------------------------------------ | ----- |
| Create           | \`POST\`   | \`/v1/environments\`                         | |
| List             | \`GET\`    | \`/v1/environments\`                         | Paginated (\`limit\`, \`after_id\`, \`before_id\`) |
| Get              | \`GET\`    | \`/v1/environments/{id}\`                    | |
| Update           | \`POST\`   | \`/v1/environments/{id}\`                    | Changes apply only to **new** containers; existing sessions keep their original config |
| Delete           | \`DELETE\` | \`/v1/environments/{id}\`                    | Returns 204. |
| Archive          | \`POST\`   | \`/v1/environments/{id}/archive\`            | Makes it **read-only**; existing sessions continue, new sessions cannot reference it. No unarchive — terminal state. |

---

## Resources

Attach files and GitHub repositories to a session. **Session creation blocks until all resources are mounted** — the container won't go \`running\` until every file and repo is in place. Max **999 file resources** per session. Multiple GitHub repositories per session are supported.

### File Uploads (input — host → agent)

Upload a file first via the Files API, then reference by \`file_id\` + \`mount_path\`:

\`\`\`ts
// 1. Upload
const file = await client.beta.files.upload({
  file: fs.createReadStream("data.csv"),
  purpose: "agent",
});

// 2. Attach as a session resource
const session = await client.beta.sessions.create({
  agent: agent.id,
  environment_id: envId,
  resources: [
    { type: "file", file_id: file.id, mount_path: "/workspace/data.csv" }
  ],
});
\`\`\`

**\`mount_path\` is required** and must be absolute. Parent directories are created automatically. Agent working directory defaults to \`/workspace\`. Files are mounted read-only — the agent writes modified versions to new paths.

### Session outputs (output — agent → host)

The agent can write files to \`/mnt/session/outputs/\` during a session. These are automatically captured by the Files API and can be listed and downloaded afterwards:

\`\`\`ts
// After the turn completes, list output files scoped to this session:
for await (const f of client.beta.files.list({
  scope_id: session.id,
  betas: ["managed-agents-2026-04-01"],
})) {
  console.log(f.filename, f.size_bytes);
  const resp = await client.beta.files.download(f.id);
  const text = await resp.text();
}
\`\`\`

**Requirements:**
- The \`write\` tool (or \`bash\`) must be enabled for the agent to create output files.
- Session-scoped \`files.list\` / \`files.download\` captures outputs written to \`/mnt/session/outputs/\`.
- The filter parameter is **\`scope_id\`** (REST query param \`?scope_id=<session_id>\`). The SDK's files resource auto-adds only the \`files-api-2025-04-14\` header, so pass \`betas: ["managed-agents-2026-04-01"]\` explicitly (or both headers on raw HTTP) — without it the API may reject \`scope_id\` as an unknown field. Requires \`@anthropic-ai/sdk\` ≥ 0.88.0 / \`anthropic\` (Python) ≥ 0.92.0 — older versions don't type \`scope_id\`. The \`ant\` CLI does **not** expose this flag yet; use the SDK or curl.
- Pass the session ID returned by \`sessions.create()\` verbatim (e.g. \`sesn_011CZx...\`) — the API validates the prefix.
- There's a brief indexing lag (~1–3s) between \`session.status_idle\` and output files appearing in \`files.list\`. Retry once or twice if empty.

> **Fallback when \`scope_id\` filtering is unavailable** (older SDK, or endpoint returns an error): send a follow-up \`user.message\` asking the agent to \`read\` each file under \`/mnt/session/outputs/\` and return the contents. The agent streams the file bodies back as \`agent.message\` text. This works for text files only and costs output tokens — use it to unblock, not as the primary path.

This gives you a bidirectional file bridge: upload reference data in, download agent artifacts out.

### GitHub Repositories

Clones a GitHub repository into the session container during initialization, before the agent begins execution. The agent can read, edit, commit, and push via \`bash\` (\`git\`). Multiple repositories per session are supported — add one \`resources\` entry per repo. Repositories are cached, so future sessions that use the same repository start faster.

Repositories are attached for the lifetime of the session — to change which repositories are mounted, create a new session. You **can** rotate a repository's \`authorization_token\` on a running session via \`client.beta.sessions.resources.update(resource_id, {session_id, authorization_token})\`; the resource \`id\` is returned at session creation and by \`resources.list()\`.

**Fields:**

| Field | Required | Notes |
|---|---|---|
| \`type\` | ✅ | \`"github_repository"\` |
| \`url\` | ✅ | The GitHub repository URL |
| \`authorization_token\` | ✅ | GitHub Personal Access Token with repository access. **Never echoed in API responses.** |
| \`mount_path\` | ❌ | Path where the repository will be cloned. Defaults to \`/workspace/<repo-name>\`. |
| \`checkout\` | ❌ | \`{type: "branch", name: "..."}\` or \`{type: "commit", sha: "..."}\`. Defaults to the repo's default branch. |

**Token permission levels** (fine-grained PATs):
- \`Contents: Read\` — clone only
- \`Contents: Read and write\` — push changes and create pull requests

**How auth works:** \`authorization_token\` is never placed inside the container. \`git pull\` / \`git push\` and GitHub REST calls against the attached repository are routed through an Anthropic-side git proxy that injects the token after the request leaves the sandbox. Code running in the container — including anything the agent writes — cannot read or exfiltrate it.

> ‼️ **To generate pull requests** you also need GitHub **MCP server** access — the \`github_repository\` resource gives filesystem + git access only. See \`shared/managed-agents-tools.md\` → MCP Servers. The PR workflow is: edit files in the mounted repo → push branch via \`bash\` (authenticated via the git proxy using \`authorization_token\`) → create PR via the MCP \`create_pull_request\` tool (authenticated via the vault).

**TypeScript:**

\`\`\`ts
// 1. Create the agent — declare GitHub MCP (no auth here)
const agent = await client.beta.agents.create(
  {
    name: 'GitHub Agent',
    model: '{{OPUS_ID}}',
    mcp_servers: [
      { type: 'url', name: 'github', url: 'https://api.githubcopilot.com/mcp/' },
    ],
    tools: [
      { type: 'agent_toolset_20260401', default_config: { enabled: true } },
      { type: 'mcp_toolset', mcp_server_name: 'github' },
    ],
  },
);

// 2. Start a session — attach vault for MCP auth + mount the repo
const session = await client.beta.sessions.create({
  agent: agent.id,
  environment_id: envId,
  vault_ids: [vaultId],  // vault contains the GitHub MCP OAuth credential
  resources: [
    {
      type: 'github_repository',
      url: 'https://github.com/owner/repo',
      authorization_token: process.env.GITHUB_TOKEN,  // repo clone token (≠ MCP auth)
      checkout: { type: 'branch', name: 'main' },
    },
  ],
});
\`\`\`

**Python:**

\`\`\`python
import os

agent = client.beta.agents.create(
    name="GitHub Agent",
    model="{{OPUS_ID}}",
    mcp_servers=[{
        "type": "url",
        "name": "github",
        "url": "https://api.githubcopilot.com/mcp/",
    }],
    tools=[
        {"type": "agent_toolset_20260401", "default_config": {"enabled": True}},
        {"type": "mcp_toolset", "mcp_server_name": "github"},
    ],
)

session = client.beta.sessions.create(
    agent=agent.id,
    environment_id=env_id,
    vault_ids=[vault_id],  # vault contains the GitHub MCP OAuth credential
    resources=[{
        "type": "github_repository",
        "url": "https://github.com/owner/repo",
        "authorization_token": os.environ["GITHUB_TOKEN"],  # repo clone token (≠ MCP auth)
        "checkout": {"type": "branch", "name": "main"},
    }],
)
\`\`\`

---

## Files API

Upload and manage files for use as session resources, and download files the agent wrote to \`/mnt/session/outputs/\`.

| Operation        | Method   | Path                                  | SDK |
| ---------------- | -------- | ------------------------------------- | --- |
| Upload           | \`POST\`   | \`/v1/files\`                           | \`client.beta.files.upload({ file })\` |
| List             | \`GET\`    | \`/v1/files?scope_id=...\`              | \`client.beta.files.list({ scope_id, betas: ["managed-agents-2026-04-01"] })\` |
| Get Metadata     | \`GET\`    | \`/v1/files/{id}\`                      | \`client.beta.files.retrieveMetadata(id)\` |
| Download         | \`GET\`    | \`/v1/files/{id}/content\`              | \`client.beta.files.download(id)\` → \`Response\` |
| Delete           | \`DELETE\` | \`/v1/files/{id}\`                      | \`client.beta.files.delete(id)\` |

The \`scope_id\` filter on List scopes the results to files written to \`/mnt/session/outputs/\` by that session. Without the filter, you get all files uploaded to your account.
`
// @from(Ln 561247, Col 4)
Nj5 = () => {}
// @from(Ln 561248, Col 4)
Lj5 = "# Managed Agents — Events & Steering\n\n## Events\n\n### Sending Events\n\nSend events to a session via `POST /v1/sessions/{id}/events`.\n\n| Event Type                | When to Send                                        |\n| ------------------------- | --------------------------------------------------- |\n| `user.message`            | Send a user message |\n| `user.interrupt`          | Interrupt the agent while it's running |\n| `user.tool_confirmation`  | Approve/deny a tool call (when `always_ask` policy) |\n| `user.custom_tool_result` | Provide result for a custom tool call |\n\n### Receiving Events\n\nTwo methods:\n\n1. **Streaming (SSE)**: `GET /v1/sessions/{id}/events/stream` — real-time Server-Sent Events. **Long-lived** — the server sends periodic heartbeats to keep the connection alive.\n2. **Polling**: `GET /v1/sessions/{id}/events` — paginated event list (query params: `limit` default 1000, `page`). **Returns immediately** — this is a plain paginated GET, not a long-poll.\n\nAll received events carry `id`, `type`, and `processed_at` (ISO 8601; `null` if not yet processed by the agent).\n\n> ⚠️ **Robust polling (raw HTTP).** If you bypass the SDK and roll your own poll loop, don't rely on `requests` or `httpx` timeouts as wall-clock caps — they're **per-chunk** read timeouts, reset every time a byte arrives. A trickling response (heartbeats, a wedged chunked-encoding body, a misbehaving proxy) can keep the call blocked indefinitely even with `timeout=(5, 60)` or `httpx.Timeout(120)`. Neither library has a \"total wall-clock\" timeout built in. For a hard deadline: track `time.monotonic()` at the loop level and break/cancel if a single request exceeds your budget (e.g. via a watchdog thread, or `asyncio.wait_for()` around async httpx). **Prefer the SDK** — `client.beta.sessions.events.stream()` and `client.beta.sessions.events.list()` handle timeout + retry sanely.\n>\n> If `GET /v1/sessions/{id}/events` (paginated) ever hangs after headers, you've likely hit `GET /v1/sessions/{id}/events` by mistake or a server-side stall — report it; don't treat it as a client-config problem.\n\n### Event Types (Received)\n\nEvent types use dot notation, grouped by namespace:\n\n| Event Type | Description |\n| --- | --- |\n| `agent.message` | Agent text output |\n| `agent.thinking` | Extended thinking blocks |\n| `agent.tool_use` | Agent used a built-in tool (`agent_toolset_20260401`) |\n| `agent.tool_result` | Result from a built-in tool |\n| `agent.mcp_tool_use` | Agent used an MCP tool |\n| `agent.mcp_tool_result` | Result from an MCP tool |\n| `agent.custom_tool_use` | Agent invoked a custom tool — session goes idle, you respond with `user.custom_tool_result` |\n| `agent.thread_context_compacted` | Conversation context was compacted |\n| `session.status_idle` | Agent has finished the current task, and is awaiting input. It's either waiting for input to continue working via a `user.message` or blocked awaiting a `user.custom_tool_result` or `user.tool_confirmation`. The `stop_reason` attached contains more information about why the Agent has stopped working. |\n| `session.status_running` | Session has starting running, and the Agent is actively doing work. |\n| `session.status_rescheduled` | Session is (re)scheduling after a retryable error has occurred, ready to be picked up by the orchestration system. |\n| `session.status_terminated` | Session has terminated, entering an irreversible and unusable state.  |\n| `session.error` | Error occurred during processing |\n| `span.model_request_start` | Model inference started |\n| `span.model_request_end` | Model inference completed |\n\nThe stream also echoes back user-sent events (`user.message`, `user.interrupt`, `user.tool_confirmation`, `user.custom_tool_result`).\n\n---\n\n## Steering Patterns\n\nPractical patterns for driving a session via the events surface.\n\n### Stream-first ordering\n\n**Open the stream before sending events.** The stream only delivers events that occur *after* it's opened — it does not replay current state or historical events. If you send a message first and open the stream second, early events (including fast status transitions) arrive buffered in a single batch and you lose the ability to react to them in real time.\n\n```ts\n// ✅ Correct — stream and send concurrently\nconst [response] = await Promise.all([\n  streamEvents(sessionId),   // opens SSE connection\n  sendMessage(sessionId, text),\n]);\n\n// ❌ Wrong — events before stream opens arrive as a single buffered batch\nawait sendMessage(sessionId, text);\nconst response = await streamEvents(sessionId);\n```\n\n**For full history,** use `GET /v1/sessions/{id}/events` (paginated list) — the stream only gives you live events from connection onward.\n\n### Reconnecting after a dropped stream\n\n**The SSE stream has no replay.** If your connection drops (httpx read timeout, network blip) and you reconnect, you only get events emitted *after* reconnection. Any events emitted during the gap are lost from the stream.\n\n**The consolidation pattern:** on every (re)connect, overlap the stream with a history fetch and dedupe by event ID:\n\n```python\ndef connect_with_consolidation(client, session_id):\n    # 1. Open the SSE stream first\n    stream = client.beta.sessions.events.stream(session_id=session_id)\n\n    # 2. Fetch history to cover any gap\n    history = client.beta.sessions.events.list(\n        session_id=session_id,\n    )\n\n    # 3. Yield history first, then stream — dedupe by event.id\n    seen = set()\n    for ev in history.data:\n        seen.add(ev.id)\n        yield ev\n    for ev in stream:\n        if ev.id not in seen:\n            seen.add(ev.id)\n            yield ev\n```\n\n### Message queuing\n\n**You don't have to wait for a response before sending the next message.** User events are queued server-side and processed in order. This is useful for chat bridges where the user sends rapid follow-ups:\n\n```ts\n// All three go into one session; agent processes them in order\nawait sendMessage(sessionId, \"Summarize the README\");\nawait sendMessage(sessionId, \"Actually also check the CONTRIBUTING guide\");\nawait sendMessage(sessionId, \"And compare the two\");\n// Stream once — agent responds to all three as a coherent turn\n```\n\nEvents can be sent up to the Session at any time. There is no need to wait on a specific session status to enqueue new events via `client.beta.sessions.events.send()`\n\n### Interrupt\n\nAn `interrupt` event **jumps the queue** (ahead of any pending user messages) and forces the session into `idle`. Use this for \"stop\" / \"nevermind\" / \"cancel\" commands:\n\n```ts\nawait client.beta.sessions.events.send(sessionId, {\n  events: [{ type: 'interrupt' }],\n});\n```\n\nThe agent stops mid-task. It does not see the interrupt as a message — it just halts. Send a follow-up `user` event to explain what to do instead.\n\n> **Note**: Interrupt events may have empty IDs in the current implementation. When troubleshooting, use the `processed_at` timestamp along with surrounding event IDs.\n\n### Event payloads\n\nsome events carry useful metadata beyond the status change itself:\n\n`session.status_idle` — includes a `stop_reason` field which elaborates on why the session stopped and what type of further action is required by the user.\n```json\n{\n  \"id\": \"sevt_456\",\n  \"processed_at\": \"2026-04-07T04:27:43.197Z\",\n  \"stop_reason\": {\n    \"event_ids\": [\n      \"sevt_123\"\n    ],\n    \"type\": \"requires_action\"\n  },\n  \"type\": \"status_idle\"\n}\n```\n\n`span.model_request_end` contains a `model_usage` field for cost tracking and efficiency analysis:\n\n```json\n{\n  \"type\": \"span.model_request_end\",\n  \"id\": \"sevt_456\",\n  \"is_error\": false,\n  \"model_request_start_id\": \"sevt_123\",\n  \"model_usage\": {\n    \"cache_creation_input_tokens\": 0,\n    \"cache_read_input_tokens\": 6656,\n    \"input_tokens\": 3571,\n    \"output_tokens\": 727\n  },\n  \"processed_at\": \"2026-04-07T04:11:32.189Z\"\n}\n```\n\n**`agent.thread_context_compacted`** — emitted when the conversation history was summarized to fit context. Includes `pre_compaction_tokens` so you know how much was squeezed:\n\n```json\n{\n  \"id\": \"sevt_abc123\",\n  \"processed_at\": \"2026-03-24T14:05:15.787Z\",\n  \"type\": \"agent.thread_context_compacted\"\n}\n```\n\n### Archive\n\nWhen done with a session, archive it to free resources:\n\n```ts\nawait client.beta.sessions.archive(sessionId);\n```\n\n> Archiving a **session** is routine cleanup — sessions are per-run and disposable. **Do not generalize this to agents or environments**: those are persistent, reusable resources, and archiving them is permanent (no unarchive; new sessions cannot reference them). See `shared/managed-agents-overview.md` → Common Pitfalls.\n\n\n"
// @from(Ln 561249, Col 4)
yj5 = () => {}
// @from(Ln 561250, Col 4)
Rj5 = `# Managed Agents — Onboarding Flow

> **Invoked via \`/claude-api managed-agents-onboard\`?** You're in the right place. Run the interview below — don't summarize it back to the user, ask the questions.

Use this when a user wants to set up a Managed Agent from scratch. Three steps: **branch on know-vs-explore → configure the template → set up the session**. End by emitting working code.

> Read \`shared/managed-agents-core.md\` alongside this — it has full detail for each knob. This doc is the interview script, not the reference.

---

Claude Managed Agents is a hosted agent: Anthropic runs the agent loop on its orchestration layer and provisions a sandboxed container per session where the agent's tools execute. You supply the agent config and the environment config; the harness — event stream, sandbox orchestration, prompt caching, context compaction, and extended thinking — is handled for you.

**What you supply:**
- **An agent config** — tools, skills, model, system prompt. Reusable and versioned.
- **An environment config** — the sandbox your agent's tools execute in (networking, packages). Reusable across agents.

Each run of the agent is a **session**.

---

## 1. Know or explore?

Ask the user:

> Do you already know the agent you want to build, or would you like to explore some common patterns first?

### Explore path — show the patterns

Four shapes, same runtime code path (\`sessions.create()\` → \`sessions.events.send()\` → stream). Only the trigger and sink differ.

| Pattern | Trigger | Example |
|---|---|---|
| Event-triggered | Webhook | GitHub PR push → CMA (GitHub tool) → Slack | # <------ MC maybe delete?
| Scheduled | Cron | Daily brief: browser + GitHub + Jira → CMA → Slack | # <------ MC maybe delete?
| Fire-and-forget PR | Human | Slack slash-command → CMA (GitHub tool) → PR passing CI |
| Research + dashboard | Human | Topic → CMA (web search + \`frontend-design\` skill) → HTML dashboard |

Ask which shape fits, then continue with the Know path using it as the reference.

### Know path — configure template

Three rounds. Batch the questions in each round; don't ask them one at a time.

**Round A — Tools.** Start here; it's the most concrete part. Three types; ask which the user wants (any combination):

| Type | What it is | How to guide |
|---|---|---|
| **Prebuilt Claude Agent tools** (\`agent_toolset_20260401\`) | Ready-to-use: \`bash\`, \`read\`, \`write\`, \`edit\`, \`glob\`, \`grep\`, \`web_fetch\`, \`web_search\`. Enable all at once, or individually via \`enabled: true/false\`. | Recommend enabling the full toolset. List the 8 tools so the user knows what they're getting. Full detail: \`shared/managed-agents-tools.md\` → Agent Toolset. |
| **MCP tools** | Third-party integrations (GitHub, Linear, Asana, etc.) via \`mcp_toolset\`. Credentials live in a vault, not inline. | Ask which services. For each, walk through MCP server URL + vault credentials. Full detail: \`shared/managed-agents-tools.md\` → MCP Servers + Vaults. |
| **Custom tools** | The user's own app handles these tool calls — agent fires \`agent.custom_tool_use\`, the app sends a result message back. | Ask for each tool: name, description, input schema. The app code that handles the event is *their* code — don't generate it. Full detail: \`shared/managed-agents-tools.md\` → Custom Tools. |

**Round B — Skills, files, and repos.** What the agent has on hand when it starts.

*Skills* — two types; both work the same way — Claude auto-uses them when relevant. Max 64 per agent.
- [ ] **Pre-built Agent Skills**: \`xlsx\`, \`docx\`, \`pptx\`, \`pdf\`. Reference by name.
- [ ] **Custom Skills**: skills uploaded to the user's org via the Skills API. Reference by \`skill_id\` + optional \`version\`. If the skill doesn't exist yet, walk the user through \`POST /v1/skills\` + \`POST /v1/skills/{id}/versions\` (beta header \`skills-2025-10-02\`). Full detail: \`shared/managed-agents-tools.md\` → Skills + Skills API.

*GitHub repositories* — any repos the agent needs on-disk? For each:
- [ ] Repo URL (\`https://github.com/org/repo\`)
- [ ] \`authorization_token\` (PAT or GitHub App token scoped to the repo)
- [ ] Optional \`mount_path\` (defaults to \`/workspace/<repo-name>\`) and \`checkout\` (branch or SHA)

Emit as \`resources: [{type: "github_repository", url, authorization_token, ...}]\`. Full detail: \`shared/managed-agents-environments.md\` → GitHub Repositories.

> ‼️ **PR creation needs the GitHub MCP server too.** \`github_repository\` gives filesystem access only — to open PRs, also attach the GitHub MCP server in Round A and credential it via a vault. The workflow is: edit files in the mounted repo → push branch via \`bash\` → create PR via the MCP \`create_pull_request\` tool.

*Files* — any local files to seed the session with? For each:
- [ ] Upload via the Files API → persist \`file_id\`
- [ ] Choose a \`mount_path\` — absolute, e.g. \`/workspace/data.csv\` (parents auto-created; files mount read-only)

Emit as \`resources: [{type: "file", file_id, mount_path}]\`. Max 999 file resources. Agent working directory defaults to \`/workspace\`. Full detail: \`shared/managed-agents-environments.md\` → Files API.

**Round C — Environment + identity:**
- [ ] Networking: unrestricted internet from the container, or lock egress to specific hosts? (If locked, MCP server domains must be in \`allowed_hosts\` or tools silently fail.)
- [ ] Name?
- [ ] Job (one or two sentences — becomes the system prompt)?
- [ ] Model? (default \`{{OPUS_ID}}\`)

---

## 2. Set up the session

Per-run. Points at the agent + environment, attaches credentials, kicks off.

**Vault credentials** (if the agent declared MCP servers):
- [ ] Existing vault, or create one? (\`client.beta.vaults.create()\` + \`vaults.credentials.create()\`)

Credentials are write-only, matched to MCP servers by URL, auto-refreshed. See \`shared/managed-agents-tools.md\` → Vaults.

**Kickoff:**
- [ ] First message to the agent?

Session creation blocks until all resources mount. Open the event stream before sending the kickoff. Stream is SSE; break on \`session.status_terminated\`, or on \`session.status_idle\` with a terminal \`stop_reason\` — i.e. anything except \`requires_action\`, which fires transiently while the session waits on a tool confirmation or custom-tool result (see \`shared/managed-agents-client-patterns.md\` Pattern 5). Usage lands on \`span.model_request_end\`. Agent-written artifacts end up in \`/mnt/session/outputs/\` — download via \`files.list({scope_id: session.id, betas: ["managed-agents-2026-04-01"]})\`.

---

## 3. Emit the code

Go straight from the last interview answer to the code — no preamble about the setup-vs-runtime split, no "the critical thing to internalize…", no lecture about \`agents.create()\` being one-time. The two-block structure below already shows that; don't narrate it. Generate **two clearly-separated blocks** per language detected (Python/TS/cURL — see SKILL.md → Language Detection):

**Block 1 — Setup (run once, store the IDs):**
1. \`environments.create()\` → persist \`env_id\`
2. \`agents.create()\` with everything from §Round A–C → persist \`agent_id\` and \`agent_version\`

Label: \`# ONE-TIME SETUP — run once, save the IDs to config/.env\`

**Block 2 — Runtime (run on every invocation):**
1. Load \`env_id\` + \`agent_id\` from config/env
2. \`sessions.create(agent=AGENT_ID, environment_id=ENV_ID, resources=[...], vault_ids=[...])\`
3. Open stream, \`events.send()\` the kickoff, loop until \`session.status_terminated\` or \`session.status_idle && stop_reason.type !== 'requires_action'\` (see \`shared/managed-agents-client-patterns.md\` Pattern 5 for the full gate — do not break on bare \`session.status_idle\`)

> ⚠️ **Never emit \`agents.create()\` and \`sessions.create()\` in the same unguarded block.** That teaches the user to create a new agent on every run — the #1 anti-pattern. If they need a single script, wrap agent creation in \`if not os.getenv("AGENT_ID"):\`.

Pull exact syntax from \`python/managed-agents/README.md\`, \`typescript/managed-agents/README.md\`, or \`curl/managed-agents.md\`. Don't invent field names.
`
// @from(Ln 561365, Col 4)
hj5 = () => {}
// @from(Ln 561366, Col 4)
Cj5 = `# Managed Agents — Overview

Managed Agents provisions a container per session as the agent's workspace. The agent loop runs on Anthropic's orchestration layer; the container is where the agent's *tools* execute — bash commands, file operations, code. You create a persisted **Agent** config (model, system prompt, tools, MCP servers, skills), then start **Sessions** that reference it. The session streams events back to you; you send user messages and tool results in.

## ⚠️ THE MANDATORY FLOW: Agent (once) → Session (every run)

**Why agents are separate objects: versioning.** An agent is a persisted, versioned config — every update creates a new immutable version, and sessions pin to a version at creation time. This lets you iterate on the agent (tweak the prompt, add a tool) without breaking sessions already running, roll back if a change regresses, and A/B test versions side-by-side. None of that works if you \`agents.create()\` fresh on every run.

Every session references a pre-created \`/v1/agents\` object. Create the agent once, store the ID, and reuse it across runs.

| Step | Call | Frequency |
|---|---|---|
| 1 | \`POST /v1/agents\` — \`model\`, \`system\`, \`tools\`, \`mcp_servers\`, \`skills\` live here | **ONCE.** Store \`agent.id\` **and** \`agent.version\`. |
| 2 | \`POST /v1/sessions\` — \`agent: "agent_abc123"\` or \`{type: "agent", id, version}\` | **Every run.** String shorthand uses latest version. |

If you're about to write \`sessions.create()\` with \`model\`, \`system\`, or \`tools\` on the session body — **stop**. Those fields live on \`agents.create()\`. The session takes a *pointer* only.

**When generating code, separate setup from runtime.** \`agents.create()\` belongs in a setup script (or a guarded \`if agent_id is None:\` block), not at the top of the hot path. If the user's code calls \`agents.create()\` on every invocation, they're accumulating orphaned agents and paying the create latency for nothing. The correct shape is: create once → persist the ID (config file, env var, secrets manager) → every run loads the ID and calls \`sessions.create()\`.

**To change the agent's behavior, use \`POST /v1/agents/{id}\` — don't create a new one.** Each update bumps the version; running sessions keep their pinned version, new sessions get the latest (or pin explicitly via \`{type: "agent", id, version}\`). See \`shared/managed-agents-core.md\` → Agents → Versioning.

## Beta Headers

Managed Agents is in beta. The SDK sets required beta headers automatically:

| Beta Header                    | What it enables                                      |
| ------------------------------ | ---------------------------------------------------- |
| \`managed-agents-2026-04-01\`    | Agents, Environments, Sessions, Events, Session Resources, Vaults, Credentials |
| \`skills-2025-10-02\`            | Skills API (for managing custom skill definitions)   |
| \`files-api-2025-04-14\`         | Files API for file uploads                           |

**Which beta header goes where:** The SDK sets \`managed-agents-2026-04-01\` automatically on \`client.beta.{agents,environments,sessions,vaults}.*\` calls, and \`files-api-2025-04-14\` / \`skills-2025-10-02\` automatically on \`client.beta.files.*\` / \`client.beta.skills.*\` calls. You do NOT need to add the Skills or Files beta header when calling Managed Agents endpoints. **Exception — session-scoped file listing:** \`client.beta.files.list({scope_id: session.id})\` is a Files endpoint that takes a Managed Agents parameter, so it needs **both** headers. Pass \`betas: ["managed-agents-2026-04-01"]\` explicitly on that call (the SDK adds the Files header; you add the Managed Agents one). See \`shared/managed-agents-environments.md\` → Session outputs.


## Reading Guide

| User wants to...                       | Read these files                                        |
| -------------------------------------- | ------------------------------------------------------- |
| **Get started from scratch / "help me set up an agent"** | \`shared/managed-agents-onboarding.md\` — guided interview (WHERE→WHO→WHAT→WATCH), then emit code |
| Understand how the API works           | \`shared/managed-agents-core.md\`                         |
| See the full endpoint reference        | \`shared/managed-agents-api-reference.md\`                |
| **Create an agent** (required first step) | \`shared/managed-agents-core.md\` (Agents section) + language file |
| Update/version an agent                | \`shared/managed-agents-core.md\` (Agents → Versioning) — update, don't re-create |
| Create a session                       | \`shared/managed-agents-core.md\` + \`{lang}/managed-agents/README.md\` |
| Configure tools and permissions        | \`shared/managed-agents-tools.md\`                        |
| Set up MCP servers                     | \`shared/managed-agents-tools.md\` (MCP Servers section)  |
| Stream events / handle tool_use        | \`shared/managed-agents-events.md\` + language file       |
| Set up environments                    | \`shared/managed-agents-environments.md\` + language file |
| Upload files / attach repos            | \`shared/managed-agents-environments.md\` (Resources)     |
| Store MCP credentials                  | \`shared/managed-agents-tools.md\` (Vaults section)       |
| Call a non-MCP API / CLI that needs a secret | \`shared/managed-agents-client-patterns.md\` Pattern 9 — no container env vars; vaults are MCP-only; keep the secret host-side via a custom tool |

## Common Pitfalls

- **Agent FIRST, then session — NO EXCEPTIONS** — the session's \`agent\` field accepts **only** a string ID or \`{type: "agent", id, version}\`. \`model\`, \`system\`, \`tools\`, \`mcp_servers\`, \`skills\` are **top-level fields on \`POST /v1/agents\`**, never on \`sessions.create()\`. If the user hasn't created an agent, that is step zero of every example.
- **Agent ONCE, not every run** — \`agents.create()\` is a setup step. Store the returned \`agent_id\` and reuse it; don't call \`agents.create()\` at the top of your hot path. If the agent's config needs to change, \`POST /v1/agents/{id}\` — each update creates a new version, and sessions can pin to a specific version for reproducibility.
- **MCP auth goes through vaults** — the agent's \`mcp_servers\` array declares \`{type, name, url}\` only (no auth). Credentials live in vaults (\`client.beta.vaults.credentials.create\`) and attach to sessions via \`vault_ids\`. Anthropic auto-refreshes OAuth tokens using the stored refresh token.
- **Stream to get events** — \`GET /v1/sessions/{id}/events/stream\` is the primary way to receive agent output in real-time.
- **SSE stream has no replay — reconnect with consolidation** — if the stream drops while a \`agent.tool_use\`, \`agent.mcp_tool_use\`, or \`agent.custom_tool_use\` is pending resolution (\`user.tool_confirmation\` for the first two, \`user.custom_tool_result\` for the last one), the session deadlocks (client disconnects → session idles → reconnect happens → no client resolution happens). On every (re)connect: open stream with \`GET /v1/sessions/{id}/events/stream\` , fetch \`GET /v1/sessions/{id}/events\`, dedupe by event ID, then proceed. See \`shared/managed-agents-events.md\` → Reconnecting after a dropped stream.
- **Don't trust HTTP-library timeouts as wall-clock caps** — \`requests\` \`timeout=(c, r)\` and \`httpx.Timeout(n)\` are *per-chunk* read timeouts; they reset every byte, so a trickling connection can block indefinitely. For a hard deadline on raw-HTTP polling, track \`time.monotonic()\` at the loop level and bail explicitly. Prefer the SDK's \`sessions.events.stream()\` / \`session.events.list()\` over hand-rolled HTTP. See \`shared/managed-agents-events.md\` → Receiving Events.
- **Messages queue** — you can send events while the session is \`running\` or \`idle\`; they're processed in order. No need to wait for a response before sending the next message.
- **Cloud environments only** — \`config.type: "cloud"\` is the only supported environment type.
- **Archive is permanent on every resource** — archiving an agent, environment, session, vault, or credential makes it read-only with no unarchive. For agents and environments specifically, archived resources cannot be referenced by new sessions (existing sessions continue). Do not call \`.archive()\` on a production agent or environment as cleanup — **always confirm with the user before archiving**.
`
// @from(Ln 561430, Col 4)
Sj5 = () => {}
// @from(Ln 561431, Col 4)
Ij5 = "# Managed Agents — Tools & Skills\n\n## Tools\n\n### Server tools vs client tools\n\n| Type | Who runs it | How it works |\n|---|---|---|\n| **Prebuilt Claude Agent tools** (`agent_toolset_20260401`) | Anthropic, on the session's container | File ops, bash, web search, etc. Enable all at once or configure individually with `enabled: true/false`. |\n| **MCP tools** (`mcp_toolset`) | Anthropic, on the session's container | Capabilities exposed by connected MCP servers. Grant access per-server via the toolset. |\n| **Custom tools** | **You** — your application handles the call and returns results | Agent emits a `agent.custom_tool_use` event, session goes `idle`, you send back a `user.custom_tool_result` event. |\n\n**Recommendation:** Enable all prebuilt tools via `agent_toolset_20260401`, then disable individually as needed.\n\n**Versioning:** The toolset is a versioned, static resource. When underlying tools change, a new toolset version is created (hence `_20260401`) so you always know exactly what you're getting.\n\n### Agent Toolset\n\nThe `agent_toolset_20260401` provides these built-in tools:\n\n| Tool                   | Description                              |\n| ---------------------- | ---------------------------------------- |\n| `bash` | Execute bash commands in a shell session |\n| `read` | Read a file from the local filesystem, including text, images, PDFs, and Jupyter notebooks |\n| `write` | Write a file to the local filesystem |\n| `edit` | Perform string replacement in a file |\n| `glob` | Fast file pattern matching using glob patterns |\n| `grep` | Text search using regex patterns |\n| `web_fetch` | Fetch content from a URL |\n| `web_search` | Search the web for information |\n\nEnable the full toolset:\n\n```json\n{\n  \"tools\": [\n    { \"type\": \"agent_toolset_20260401\" }\n  ]\n}\n```\n\n### Per-Tool Configuration\n\nOverride defaults for individual tools. This example enables everything except bash:\n\n```json\n{\n  \"tools\": [\n    {\n      \"type\": \"agent_toolset_20260401\",\n      \"default_config\": { \"enabled\": true },\n      \"configs\": [\n        { \"name\": \"bash\", \"enabled\": false }\n      ]\n    }\n  ]\n}\n```\n\n| Field | Required | Description |\n|---|---|---|\n| `type` | ✅ | `\"agent_toolset_20260401\"` |\n| `default_config` | ❌ | Applied to all tools. `{ \"enabled\": bool, \"permission_policy\": {...} }` |\n| `configs` | ❌ | Per-tool overrides: `[{ \"name\": \"...\", \"enabled\": bool, \"permission_policy\": {...} }]` |\n\n### Permission Policies\n\nControl when server-executed tools (agent toolset + MCP) run automatically vs wait for approval. Does not apply to custom tools.\n\n| Policy | Behavior |\n|---|---|\n| `always_allow` | Tool executes automatically (default) |\n| `always_ask` | Session emits `session.status_idle` and pauses until you send a `tool_confirmation` event |\n\n```json\n{\n  \"type\": \"agent_toolset_20260401\",\n  \"default_config\": {\n    \"enabled\": true,\n    \"permission_policy\": { \"type\": \"always_allow\" }\n  },\n  \"configs\": [\n    { \"name\": \"bash\", \"permission_policy\": { \"type\": \"always_ask\" } }\n  ]\n}\n```\n\n**Responding to `always_ask`:** Send a `user.tool_confirmation` event with `tool_use_id` from the triggering `agent_tool_use`/`mcp_tool_use` event:\n\n```json\n{ \"type\": \"tool_confirmation\", \"tool_use_id\": \"sevt_abc123\", \"result\": \"allow\" }\n{ \"type\": \"tool_confirmation\", \"tool_use_id\": \"sevt_def456\", \"result\": \"deny\", \"message\": \"Read .env.example instead\" }\n```\n\nThe optional `message` on a deny is delivered to the agent so it can adjust its approach.\n\nTo enable only specific tools, flip the default off and opt-in per tool:\n\n```json\n{\n  \"tools\": [\n    {\n      \"type\": \"agent_toolset_20260401\",\n      \"default_config\": { \"enabled\": false },\n      \"configs\": [\n        { \"name\": \"bash\", \"enabled\": true },\n        { \"name\": \"read\", \"enabled\": true }\n      ]\n    }\n  ]\n}\n```\n\n### Custom Tools (Client-Side)\n\nCustom tools are executed by **your application**, not Anthropic. The flow:\n\n1. Agent decides to use the tool → session emits a `agent.custom_tool_use` event with inputs\n2. Session goes `idle` waiting for you\n3. Your application executes the tool\n4. You send back a `user.custom_tool_result` event with the output\n5. Session resumes `running`\n\nNo permission policy needed — you're the one executing.\n\n```json\n{\n  \"tools\": [\n    {\n      \"type\": \"custom\",\n      \"name\": \"get_weather\",\n      \"description\": \"Fetch current weather for a city.\",\n      \"input_schema\": {\n        \"type\": \"object\",\n        \"properties\": {\n          \"city\": { \"type\": \"string\", \"description\": \"City name\" }\n        },\n        \"required\": [\"city\"]\n      }\n    }\n  ]\n}\n```\n\n### MCP Servers\n\nMCP (Model Context Protocol) servers expose standardized third-party capabilities (e.g. Asana, GitHub, Linear). **Configuration is split across agent and vault:**\n\n1. **Agent creation** declares which servers to connect to (`type`, `name`, `url` — no auth). The agent's `mcp_servers` array has no auth field.\n2. **Vault** stores the OAuth credentials. Attach via `vault_ids` on session create.\n\nThis keeps secrets out of reusable agent definitions. Each vault credential is tied to one MCP server URL; Anthropic matches credentials to servers by URL.\n\n**Agent side — declare servers (no auth):**\n\n| Field | Required | Description |\n|---|---|---|\n| `type` | ✅ | `\"url\"` |\n| `name` | ✅ | Unique name — referenced by `mcp_toolset.mcp_server_name` |\n| `url` | ✅ | The MCP server's endpoint URL (Streamable HTTP transport) |\n\n```json\n{\n  \"mcp_servers\": [\n    { \"type\": \"url\", \"name\": \"linear\", \"url\": \"https://mcp.linear.app/mcp\" }\n  ],\n  \"tools\": [\n    { \"type\": \"mcp_toolset\", \"mcp_server_name\": \"linear\" }\n  ]\n}\n```\n\n**Session side — attach vault:**\n\n```json\n{\n  \"agent\": \"agent_abc123\",\n  \"environment_id\": \"env_abc123\",\n  \"vault_ids\": [\"vlt_abc123\"]\n}\n```\n\n> 💡 **Per-tool enablement (empirical):** `mcp_toolset` has been observed accepting `default_config: {enabled: false}` + `configs: [{name, enabled: true}]` for an allowlist pattern. The API ref shows only the minimal `{type, mcp_server_name}` form.\n\n> ⚠️ **MCP auth tokens ≠ REST API tokens.** Hosted MCP servers (`mcp.notion.com`, `mcp.linear.app`, etc.) typically require **OAuth bearer tokens**, not the service's native API keys. A Notion `ntn_` integration token authenticates against Notion's REST API but will **not** work as a vault credential for the Notion MCP server. These are different auth systems.\n\n### Vaults — the MCP credential store\n\n**Vaults** store OAuth credentials (access token + refresh token) that Anthropic auto-refreshes on your behalf via standard OAuth 2.0 `refresh_token` grant. This is the only way to authenticate MCP servers in the launch SDK.\n\n#### Credentials and the sandbox\n\nVaults store credentials; those credentials **never enter the sandbox**. This is a deliberate security boundary — code running in the sandbox (including anything the agent writes) cannot read or exfiltrate a vaulted credential, even under prompt injection. Instead, credentials are injected by Anthropic-side proxies **after** a request leaves the sandbox:\n\n- **MCP tool calls** are routed through an Anthropic-side proxy that fetches the credential from the vault and adds it to the outbound request.\n- **Git operations on attached GitHub repositories** (`git pull`, `git push`, GitHub REST calls) are routed through a git proxy that injects the `github_repository` resource's `authorization_token` the same way.\n\n**Not yet supported:** running other authenticated CLIs (e.g. `aws`, `gcloud`, `stripe`) directly inside the sandbox. There is currently no way to set container environment variables or expose vault credentials to arbitrary processes. If you need one of these today:\n\n- **Prefer an MCP server** for that service if one exists — it gets the same vault-backed injection.\n- **Otherwise, register a custom tool:** the agent emits `agent.custom_tool_use`, your orchestrator (which already holds the credential) executes the call and returns `user.custom_tool_result` over the same authenticated event stream. No public endpoint is exposed; the sandbox never sees the secret. See `shared/managed-agents-client-patterns.md` → Pattern 9.\n\n**Do not put API keys in the system prompt or user messages as a workaround** — they persist in the session's event history.\n\n> Formerly known internally as TATs (Tool/Tenant Access Tokens).\n\n**Flow:**\n\n1. Create a vault (`client.beta.vaults.create(...)`) — one per tenant/user, or one shared, depending on your model\n2. Add MCP credentials to it (`client.beta.vaults.credentials.create(...)`) — each credential is tied to one MCP server URL\n3. Reference the vault on session create via `vault_ids: [\"vlt_...\"]`\n4. Anthropic auto-refreshes tokens before they expire; the agent uses the current access token when calling MCP tools\n\n**Credential shape**:\n\n```json\n{\n  \"display_name\": \"Notion (workspace-foo)\",\n  \"auth\": {\n    \"type\": \"mcp_oauth\",\n    \"mcp_server_url\": \"https://mcp.notion.com/mcp\",\n    \"access_token\": \"<current access token>\",\n    \"expires_at\": \"2026-04-02T14:00:00Z\",\n    \"refresh\": {\n      \"refresh_token\": \"<refresh token>\",\n      \"client_id\": \"<your OAuth client_id>\",\n      \"token_endpoint\": \"https://api.notion.com/v1/oauth/token\",\n      \"token_endpoint_auth\": { \"type\": \"none\" }\n    }\n  }\n}\n```\n\nThe `refresh` block is what enables auto-refresh — `token_endpoint` is where Anthropic posts the `refresh_token` grant. `token_endpoint_auth` is a discriminated union:\n\n| `type` | Shape | Use when |\n|---|---|---|\n| `\"none\"` | `{type: \"none\"}` | Public OAuth client (no secret) |\n| `\"client_secret_basic\"` | `{type: \"client_secret_basic\", client_secret: \"...\"}` | Confidential client, secret via HTTP Basic auth |\n| `\"client_secret_post\"` | `{type: \"client_secret_post\", client_secret: \"...\"}` | Confidential client, secret in request body |\n\nOmit `refresh` entirely if you only have an access token with no refresh capability — it'll work until it expires, then the agent loses access.\n\n> 💡 **Getting an OAuth token.** How you obtain the initial access and refresh tokens depends on the MCP server — consult its documentation. Once you have them, store them in a vault credential using the shape above; Anthropic auto-refreshes via the `refresh.token_endpoint` from there.\n\n**Scoping:** Vaults are workspace-scoped. Anyone with developer+ role in the API workspace can create, read (metadata only — secrets are write-only), and attach vaults. `vault_ids` can be set at session **create** time but not via session update (the SDK docstring says \"Not yet supported; requests setting this field are rejected\").\n\n---\n\n## Skills\n\nSkills are reusable, filesystem-based resources that provide your agent with domain-specific expertise: workflows, context, and best practices that transform general-purpose agents into specialists. Unlike prompts (conversation-level instructions for one-off tasks), skills load on-demand and eliminate the need to repeatedly provide the same guidance across multiple conversations.\n\nTwo types — both work the same way; the agent automatically uses them when relevant to the task at hand:\n\n| Type | What it is |\n|---|---|\n| **Pre-built Anthropic skills** | Common document tasks (PowerPoint, Excel, Word, PDF). Reference by name (e.g. `xlsx`). |\n| **Custom skills** | Skills you've created in your organization via the Skills API. Reference by `skill_id` + optional `version`. |\n\n**Max 64 skills per agent.** Agent creation uses `managed-agents-2026-04-01`; the separate Skills API (for managing custom skill definitions) uses `skills-2025-10-02`.\n\n### Enabling skills on a session\n\nSkills are attached to the **agent** definition via `agents.create()`:\n\n```ts\nconst agent = await client.beta.agents.create(\n  {\n    name: \"Financial Agent\",\n    model: \"{{OPUS_ID}}\",\n    system: \"You are a financial analysis agent.\",\n    skills: [\n      { type: \"anthropic\", skill_id: \"xlsx\" },\n      { type: \"custom\", skill_id: \"skill_abc123\", version: \"latest\" },\n    ],\n  }\n);\n```\n\nPython:\n\n```python\nagent = client.beta.agents.create(\n    name=\"Financial Agent\",\n    model=\"{{OPUS_ID}}\",\n    system=\"You are a financial analysis agent.\",\n    skills=[\n        {\"type\": \"anthropic\", \"skill_id\": \"xlsx\"},\n        {\"type\": \"custom\", \"skill_id\": \"skill_abc123\", \"version\": \"latest\"},\n    ]\n)\n```\n\n**Skill reference fields:**\n\n| Field | Anthropic skill | Custom skill |\n|---|---|---|\n| `type` | `\"anthropic\"` | `\"custom\"` |\n| `skill_id` | Skill name (e.g. `\"xlsx\"`, `\"docx\"`, `\"pptx\"`, `\"pdf\"`) | Skill ID from Skills API (e.g. `\"skill_abc123\"`) |\n| `version` | — | `\"latest\"` or a specific version number |\n\n### Skills API\n\n| Operation             | Method   | Path                                            |\n| --------------------- | -------- | ----------------------------------------------- |\n| Create Skill          | `POST`   | `/v1/skills`                                    |\n| List Skills           | `GET`    | `/v1/skills`                                    |\n| Get Skill             | `GET`    | `/v1/skills/{id}`                               |\n| Delete Skill          | `DELETE` | `/v1/skills/{id}`                               |\n| Create Version        | `POST`   | `/v1/skills/{id}/versions`                      |\n| List Versions         | `GET`    | `/v1/skills/{id}/versions`                      |\n| Get Version           | `GET`    | `/v1/skills/{id}/versions/{version}`            |\n| Delete Version        | `DELETE` | `/v1/skills/{id}/versions/{version}`            |\n\n"
// @from(Ln 561432, Col 4)
bj5 = () => {}
// @from(Ln 561433, Col 4)
uj5 = `# Claude Model Catalog

**Only use exact model IDs listed in this file.** Never guess or construct model IDs — incorrect IDs will cause API errors. Use aliases wherever available. For the latest information, WebFetch the Models Overview URL in \`shared/live-sources.md\`, or query the Models API directly (see Programmatic Model Discovery below).

## Programmatic Model Discovery

For **live** capability data — context window, max output tokens, feature support (thinking, vision, effort, structured outputs, etc.) — query the Models API instead of relying on the cached tables below. Use this when the user asks "what's the context window for X", "does model X support vision/thinking/effort", "which models support feature Y", or wants to select a model by capability at runtime.

\`\`\`python
m = client.models.retrieve("claude-opus-4-7")
m.id                 # "claude-opus-4-7"
m.display_name       # "Claude Opus 4.7"
m.max_input_tokens   # context window (int)
m.max_tokens         # max output tokens (int)

# capabilities is an untyped nested dict — bracket access, check ["supported"] at the leaf
caps = m.capabilities
caps["image_input"]["supported"]                       # vision
caps["thinking"]["types"]["adaptive"]["supported"]     # adaptive thinking
caps["effort"]["max"]["supported"]                     # effort: max (also low/medium/high)
caps["structured_outputs"]["supported"]
caps["context_management"]["compact_20260112"]["supported"]

# filter across all models — iterate the page object directly (auto-paginates); do NOT use .data
[m for m in client.models.list()
 if m.capabilities["thinking"]["types"]["adaptive"]["supported"]
 and m.max_input_tokens >= 200_000]
\`\`\`

Top-level fields (\`id\`, \`display_name\`, \`max_input_tokens\`, \`max_tokens\`) are typed attributes. \`capabilities\` is a dict — use bracket access, not attribute access. The API returns the full capability tree for every model with \`supported: true/false\` at each leaf, so bracket chains are safe without \`.get()\` guards. TypeScript SDK: same method names, also auto-paginates on iteration.

### Raw HTTP

\`\`\`bash
curl https://api.anthropic.com/v1/models/claude-opus-4-7 \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01"
\`\`\`

\`\`\`json
{
  "id": "claude-opus-4-7",
  "display_name": "Claude Opus 4.7",
  "max_input_tokens": 200000,
  "max_tokens": 128000,
  "capabilities": {
    "image_input": {"supported": true},
    "structured_outputs": {"supported": true},
    "thinking": {"supported": true, "types": {"enabled": {"supported": false}, "adaptive": {"supported": true}}},
    "effort": {"supported": true, "low": {"supported": true}, …, "max": {"supported": true}},
    …
  }
}
\`\`\`

## Current Models (recommended)

| Friendly Name     | Alias (use this)    | Full ID                       | Context        | Max Output | Status |
|-------------------|---------------------|-------------------------------|----------------|------------|--------|
| Claude Opus 4.7   | \`claude-opus-4-7\`   | —                             | 1M             | 128K       | Active |
| Claude Opus 4.6   | \`claude-opus-4-6\`   | —                             | 1M             | 128K       | Active |
| Claude Sonnet 4.6 | \`claude-sonnet-4-6\` | -                             | 1M             | 64K        | Active |
| Claude Haiku 4.5  | \`claude-haiku-4-5\`  | \`claude-haiku-4-5-20251001\`   | 200K           | 64K        | Active |

### Model Descriptions
- **Claude Opus 4.7** — The most capable Claude model to date — highly autonomous, strong on long-horizon agentic work, knowledge work, vision, and memory. Adaptive thinking only; sampling parameters and \`budget_tokens\` are removed. 1M context window at standard API pricing (no long-context premium) — see \`shared/model-migration.md\` → Migrating to Opus 4.7 for breaking changes.
- **Claude Opus 4.6** — Previous-generation Opus. Supports adaptive thinking (recommended), 128K max output tokens (requires streaming for large outputs). 1M context window.
- **Claude Sonnet 4.6** — Our best combination of speed and intelligence. Supports adaptive thinking (recommended). 1M context window. 64K max output tokens.
- **Claude Haiku 4.5** — Fastest and most cost-effective model for simple tasks.

## Legacy Models (still active)

| Friendly Name     | Alias (use this)    | Full ID                       | Status |
|-------------------|---------------------|-------------------------------|--------|
| Claude Opus 4.5   | \`claude-opus-4-5\`   | \`claude-opus-4-5-20251101\`    | Active |
| Claude Opus 4.1   | \`claude-opus-4-1\`   | \`claude-opus-4-1-20250805\`    | Active |
| Claude Sonnet 4.5 | \`claude-sonnet-4-5\` | \`claude-sonnet-4-5-20250929\`  | Active |
| Claude Sonnet 4   | \`claude-sonnet-4-0\` | \`claude-sonnet-4-20250514\`    | Active |
| Claude Opus 4     | \`claude-opus-4-0\`   | \`claude-opus-4-20250514\`      | Active |

## Deprecated Models (retiring soon)

| Friendly Name     | Alias (use this)    | Full ID                       | Status     | Retires      |
|-------------------|---------------------|-------------------------------|------------|--------------|
| Claude Haiku 3    | —                   | \`claude-3-haiku-20240307\`     | Deprecated | Apr 19, 2026 |

## Retired Models (no longer available)

| Friendly Name     | Full ID                       | Retired     |
|-------------------|-------------------------------|-------------|
| Claude Sonnet 3.7 | \`claude-3-7-sonnet-20250219\`  | Feb 19, 2026 |
| Claude Haiku 3.5  | \`claude-3-5-haiku-20241022\`   | Feb 19, 2026 |
| Claude Opus 3     | \`claude-3-opus-20240229\`      | Jan 5, 2026 |
| Claude Sonnet 3.5 | \`claude-3-5-sonnet-20241022\`  | Oct 28, 2025 |
| Claude Sonnet 3.5 | \`claude-3-5-sonnet-20240620\`  | Oct 28, 2025 |
| Claude Sonnet 3   | \`claude-3-sonnet-20240229\`    | Jul 21, 2025 |
| Claude 2.1        | \`claude-2.1\`                  | Jul 21, 2025 |
| Claude 2.0        | \`claude-2.0\`                  | Jul 21, 2025 |

## Resolving User Requests

When a user asks for a model by name, use this table to find the correct model ID:

| User says...                              | Use this model ID              |
|-------------------------------------------|--------------------------------|
| "opus", "most powerful"                   | \`claude-opus-4-7\`              |
| "opus 4.7"                                | \`claude-opus-4-7\`              |
| "opus 4.6"                                | \`claude-opus-4-6\`              |
| "opus 4.5"                                | \`claude-opus-4-5\`              |
| "opus 4.1"                                | \`claude-opus-4-1\`              |
| "opus 4", "opus 4.0"                      | \`claude-opus-4-0\`              |
| "sonnet", "balanced"                      | \`claude-sonnet-4-6\`            |
| "sonnet 4.6"                              | \`claude-sonnet-4-6\`            |
| "sonnet 4.5"                              | \`claude-sonnet-4-5\`            |
| "sonnet 4", "sonnet 4.0"                  | \`claude-sonnet-4-0\`            |
| "sonnet 3.7"                              | Retired — suggest \`claude-sonnet-4-5\` |
| "sonnet 3.5"                              | Retired — suggest \`claude-sonnet-4-5\` |
| "haiku", "fast", "cheap"                  | \`claude-haiku-4-5\`             |
| "haiku 4.5"                               | \`claude-haiku-4-5\`             |
| "haiku 3.5"                               | Retired — suggest \`claude-haiku-4-5\` |
| "haiku 3"                                 | Deprecated — suggest \`claude-haiku-4-5\` |
`
// @from(Ln 561555, Col 4)
xj5 = () => {}
// @from(Ln 561556, Col 4)
Bj5 = `# Prompt Caching — Design & Optimization

This file covers how to design prompt-building code for effective caching. For language-specific syntax, see the \`## Prompt Caching\` section in each language's README or single-file doc.

## The one invariant everything follows from

**Prompt caching is a prefix match. Any change anywhere in the prefix invalidates everything after it.**

The cache key is derived from the exact bytes of the rendered prompt up to each \`cache_control\` breakpoint. A single byte difference at position N — a timestamp, a reordered JSON key, a different tool in the list — invalidates the cache for all breakpoints at positions ≥ N.

Render order is: \`tools\` → \`system\` → \`messages\`. A breakpoint on the last system block caches both tools and system together.

Design the prompt-building path around this constraint. Get the ordering right and most caching works for free. Get it wrong and no amount of \`cache_control\` markers will help.

---

## Workflow for optimizing existing code

When asked to add or optimize caching:

1. **Trace the prompt assembly path.** Find where \`system\`, \`tools\`, and \`messages\` are constructed. Identify every input that flows into them.
2. **Classify each input by stability:**
   - Never changes → belongs early in the prompt, before any breakpoint
   - Changes per-session → belongs after the global prefix, cache per-session
   - Changes per-turn → belongs at the end, after the last breakpoint
   - Changes per-request (timestamps, UUIDs, random IDs) → **eliminate or move to the very end**
3. **Check rendered order matches stability order.** Stable content must physically precede volatile content. If a timestamp is interpolated into the system prompt header, everything after it is uncacheable regardless of markers.
4. **Place breakpoints at stability boundaries.** See placement patterns below.
5. **Audit for silent invalidators.** See anti-patterns table.

---

## Placement patterns

### Large system prompt shared across many requests

Put a breakpoint on the last system text block. If there are tools, they render before system — the marker on the last system block caches tools + system together.

\`\`\`json
"system": [
  {"type": "text", "text": "<large shared prompt>", "cache_control": {"type": "ephemeral"}}
]
\`\`\`

### Multi-turn conversations

Put a breakpoint on the last content block of the most-recently-appended turn. Each subsequent request reuses the entire prior conversation prefix. Earlier breakpoints remain valid read points, so hits accrue incrementally as the conversation grows.

\`\`\`json
// Last content block of the last user turn
messages[-1].content[-1].cache_control = {"type": "ephemeral"}
\`\`\`

### Shared prefix, varying suffix

Many requests share a large fixed preamble (few-shot examples, retrieved docs, instructions) but differ in the final question. Put the breakpoint at the end of the **shared** portion, not at the end of the whole prompt — otherwise every request writes a distinct cache entry and nothing is ever read.

\`\`\`json
"messages": [{"role": "user", "content": [
  {"type": "text", "text": "<shared context>", "cache_control": {"type": "ephemeral"}},
  {"type": "text", "text": "<varying question>"}  // no marker — differs every time
]}]
\`\`\`

### Prompts that change from the beginning every time

Don't cache. If the first 1K tokens differ per request, there is no reusable prefix. Adding \`cache_control\` only pays the cache-write premium with zero reads. Leave it off.

---

## Architectural guidance

These are the decisions that matter more than marker placement. Fix these first.

**Keep the system prompt frozen.** Don't interpolate "current date: X", "mode: Y", "user name: Z" into the system prompt — those sit at the front of the prefix and invalidate everything downstream. Inject dynamic context as a user or assistant message later in \`messages\`. A message at turn 5 invalidates nothing before turn 5.

**Don't change tools or model mid-conversation.** Tools render at position 0; adding, removing, or reordering a tool invalidates the entire cache. Same for switching models (caches are model-scoped). If you need "modes", don't swap the tool set — give Claude a tool that records the mode transition, or pass the mode as message content. Serialize tools deterministically (sort by name).

**Fork operations must reuse the parent's exact prefix.** Side computations (summarization, compaction, sub-agents) often spin up a separate API call. If the fork rebuilds \`system\` / \`tools\` / \`model\` with any difference, it misses the parent's cache entirely. Copy the parent's \`system\`, \`tools\`, and \`model\` verbatim, then append fork-specific content at the end.

---

## Silent invalidators

When reviewing code, grep for these inside anything that feeds the prompt prefix:

| Pattern | Why it breaks caching |
|---|---|
| \`datetime.now()\` / \`Date.now()\` / \`time.time()\` in system prompt | Prefix changes every request |
| \`uuid4()\` / \`crypto.randomUUID()\` / request IDs early in content | Same — every request is unique |
| \`json.dumps(d)\` without \`sort_keys=True\` / iterating a \`set\` | Non-deterministic serialization → prefix bytes differ |
| f-string interpolating session/user ID into system prompt | Per-user prefix; no cross-user sharing |
| Conditional system sections (\`if flag: system += ...\`) | Every flag combination is a distinct prefix |
| \`tools=build_tools(user)\` where set varies per user | Tools render at position 0; nothing caches across users |

Fix by moving the dynamic piece after the last breakpoint, making it deterministic, or deleting it if it's not load-bearing.

---

## API reference

\`\`\`json
"cache_control": {"type": "ephemeral"}              // 5-minute TTL (default)
"cache_control": {"type": "ephemeral", "ttl": "1h"} // 1-hour TTL
\`\`\`

- Max **4** \`cache_control\` breakpoints per request.
- Goes on any content block: system text blocks, tool definitions, message content blocks (\`text\`, \`image\`, \`tool_use\`, \`tool_result\`, \`document\`).
- Top-level \`cache_control\` on \`messages.create()\` auto-places on the last cacheable block — simplest option when you don't need fine-grained placement.
- Minimum cacheable prefix is model-dependent. Shorter prefixes silently won't cache even with a marker — no error, just \`cache_creation_input_tokens: 0\`:

| Model | Minimum |
|---|---:|
| Opus 4.7, Opus 4.6, Opus 4.5, Haiku 4.5 | 4096 tokens |
| Sonnet 4.6, Haiku 3.5, Haiku 3 | 2048 tokens |
| Sonnet 4.5, Sonnet 4.1, Sonnet 4, Sonnet 3.7 | 1024 tokens |

A 3K-token prompt caches on Sonnet 4.5 but silently won't on Opus 4.7.

**Economics:** Cache reads cost ~0.1× base input price. Cache writes cost **1.25× for 5-minute TTL, 2× for 1-hour TTL**. Break-even depends on TTL: with 5-minute TTL, two requests break even (1.25× + 0.1× = 1.35× vs 2× uncached); with 1-hour TTL, you need at least three requests (2× + 0.2× = 2.2× vs 3× uncached). The 1-hour TTL keeps entries alive across gaps in bursty traffic, but the doubled write cost means it needs more reads to pay off.

---

## Verifying cache hits

The response \`usage\` object reports cache activity:

| Field | Meaning |
|---|---|
| \`cache_creation_input_tokens\` | Tokens written to cache this request (you paid the ~1.25× write premium) |
| \`cache_read_input_tokens\` | Tokens served from cache this request (you paid ~0.1×) |
| \`input_tokens\` | Tokens processed at full price (not cached) |

If \`cache_read_input_tokens\` is zero across repeated requests with identical prefixes, a silent invalidator is at work — diff the rendered prompt bytes between two requests to find it.

**\`input_tokens\` is the uncached remainder only.** Total prompt size = \`input_tokens + cache_creation_input_tokens + cache_read_input_tokens\`. If your agent ran for hours but \`input_tokens\` shows 4K, the rest was served from cache — check the sum, not the single field.

Language-specific access: \`response.usage.cache_read_input_tokens\` (Python/TS/Ruby), \`$message->usage->cacheReadInputTokens\` (PHP), \`resp.Usage.CacheReadInputTokens\` (Go/C#), \`.usage().cacheReadInputTokens()\` (Java).

---

## Invalidation hierarchy

Not every parameter change invalidates everything. The API has three cache tiers, and changes only invalidate their own tier and below:

| Change | Tools cache | System cache | Messages cache |
|---|:---:|:---:|:---:|
| Tool definitions (add/remove/reorder) | ❌ | ❌ | ❌ |
| Model switch | ❌ | ❌ | ❌ |
| \`speed\`, web-search, citations toggle | ✅ | ❌ | ❌ |
| System prompt content | ✅ | ❌ | ❌ |
| \`tool_choice\`, images, \`thinking\` enable/disable | ✅ | ✅ | ❌ |
| Message content | ✅ | ✅ | ❌ |

Implication: you can change \`tool_choice\` per-request or toggle \`thinking\` without losing the tools+system cache. Don't over-worry about these — only tool-definition and model changes force a full rebuild.

---

## 20-block lookback window

Each breakpoint walks backward **at most 20 content blocks** to find a prior cache entry. If a single turn adds more than 20 blocks (common in agentic loops with many tool_use/tool_result pairs), the next request's breakpoint won't find the previous cache and silently misses.

Fix: place an intermediate breakpoint every ~15 blocks in long turns, or put the marker on a block that's within 20 of the previous turn's last cached block.

---

## Concurrent-request timing

A cache entry becomes readable only after the first response **begins streaming**. N parallel requests with identical prefixes all pay full price — none can read what the others are still writing.

For fan-out patterns: send 1 request, await the first streamed token (not the full response), then fire the remaining N−1. They'll read the cache the first one just wrote.
`
// @from(Ln 561728, Col 4)
mj5 = () => {}
// @from(Ln 561729, Col 4)
Fj5 = `# Tool Use Concepts

This file covers the conceptual foundations of tool use with the Claude API. For language-specific code examples, see the \`python/\`, \`typescript/\`, or other language folders. For decision heuristics on which tools to expose, how to manage context in long-running agents, and caching strategy, see \`agent-design.md\`.

## User-Defined Tools

### Tool Definition Structure

> **Note:** When using the Tool Runner (beta), tool schemas are generated automatically from your function signatures (Python), Zod schemas (TypeScript), annotated classes (Java), \`jsonschema\` struct tags (Go), or \`BaseTool\` subclasses (Ruby). The raw JSON schema format below is for the manual approach — including PHP's \`BetaRunnableTool\`, which wraps a run closure around a hand-written schema — or SDKs without tool runner support.

Each tool requires a name, description, and JSON Schema for its inputs:

\`\`\`json
{
  "name": "get_weather",
  "description": "Get current weather for a location",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City and state, e.g., San Francisco, CA"
      },
      "unit": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"],
        "description": "Temperature unit"
      }
    },
    "required": ["location"]
  }
}
\`\`\`

**Best practices for tool definitions:**

- Use clear, descriptive names (e.g., \`get_weather\`, \`search_database\`, \`send_email\`)
- Write detailed descriptions — Claude uses these to decide when to use the tool
- Include descriptions for each property
- Use \`enum\` for parameters with a fixed set of values
- Mark truly required parameters in \`required\`; make others optional with defaults

---

### Tool Choice Options

Control when Claude uses tools:

| Value                             | Behavior                                      |
| --------------------------------- | --------------------------------------------- |
| \`{"type": "auto"}\`                | Claude decides whether to use tools (default) |
| \`{"type": "any"}\`                 | Claude must use at least one tool             |
| \`{"type": "tool", "name": "..."}\` | Claude must use the specified tool            |
| \`{"type": "none"}\`                | Claude cannot use tools                       |

Any \`tool_choice\` value can also include \`"disable_parallel_tool_use": true\` to force Claude to use at most one tool per response. By default, Claude may request multiple tool calls in a single response.

---

### Tool Runner vs Manual Loop

**Tool Runner (Recommended):** The SDK's tool runner handles the agentic loop automatically — it calls the API, detects tool use requests, executes your tool functions, feeds results back to Claude, and repeats until Claude stops calling tools. Available in Python, TypeScript, Java, Go, Ruby, and PHP SDKs (beta). The Python SDK also provides MCP conversion helpers (\`anthropic.lib.tools.mcp\`) to convert MCP tools, prompts, and resources for use with the tool runner — see \`python/claude-api/tool-use.md\` for details.

**Manual Agentic Loop:** Use when you need fine-grained control over the loop (e.g., custom logging, conditional tool execution, human-in-the-loop approval). Loop until \`stop_reason == "end_turn"\`, always append the full \`response.content\` to preserve tool_use blocks, and ensure each \`tool_result\` includes the matching \`tool_use_id\`.

**Stop reasons for server-side tools:** When using server-side tools (code execution, web search, etc.), the API runs a server-side sampling loop. If this loop reaches its default limit of 10 iterations, the response will have \`stop_reason: "pause_turn"\`. To continue, re-send the user message and assistant response and make another API request — the server will resume where it left off. Do NOT add an extra user message like "Continue." — the API detects the trailing \`server_tool_use\` block and knows to resume automatically.

\`\`\`python
# Handle pause_turn in your agentic loop
if response.stop_reason == "pause_turn":
    messages = [
        {"role": "user", "content": user_query},
        {"role": "assistant", "content": response.content},
    ]
    # Make another API request — server resumes automatically
    response = client.messages.create(
        model="{{OPUS_ID}}", messages=messages, tools=tools
    )
\`\`\`

Set a \`max_continuations\` limit (e.g., 5) to prevent infinite loops. For the full guide, see: \`https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons\`

> **Security:** The tool runner executes your tool functions automatically whenever Claude requests them. For tools with side effects (sending emails, modifying databases, financial transactions), validate inputs within your tool functions and consider requiring confirmation for destructive operations. Use the manual agentic loop if you need human-in-the-loop approval before each tool execution.

---

### Handling Tool Results

When Claude uses a tool, the response contains a \`tool_use\` block. You must:

1. Execute the tool with the provided input
2. Send the result back in a \`tool_result\` message
3. Continue the conversation

**Error handling in tool results:** When a tool execution fails, set \`"is_error": true\` and provide an informative error message. Claude will typically acknowledge the error and either try a different approach or ask for clarification.

**Multiple tool calls:** Claude can request multiple tools in a single response. Handle them all before continuing — send all results back in a single \`user\` message.

---

## Server-Side Tools: Code Execution

The code execution tool lets Claude run code in a secure, sandboxed container. Unlike user-defined tools, server-side tools run on Anthropic's infrastructure — you don't execute anything client-side. Just include the tool definition and Claude handles the rest.

### Key Facts

- Runs in an isolated container (1 CPU, 5 GiB RAM, 5 GiB disk)
- No internet access (fully sandboxed)
- Python 3.11 with data science libraries pre-installed
- Containers persist for 30 days and can be reused across requests
- Free when used with web search/web fetch tools; otherwise $0.05/hour after 1,550 free hours/month per organization

### Tool Definition

The tool requires no schema — just declare it in the \`tools\` array:

\`\`\`json
{
  "type": "code_execution_20260120",
  "name": "code_execution"
}
\`\`\`

Claude automatically gains access to \`bash_code_execution\` (run shell commands) and \`text_editor_code_execution\` (create/view/edit files).

### Pre-installed Python Libraries

- **Data science**: pandas, numpy, scipy, scikit-learn, statsmodels
- **Visualization**: matplotlib, seaborn
- **File processing**: openpyxl, xlsxwriter, pillow, pypdf, pdfplumber, python-docx, python-pptx
- **Math**: sympy, mpmath
- **Utilities**: tqdm, python-dateutil, pytz, sqlite3

Additional packages can be installed at runtime via \`pip install\`.

### Supported File Types for Upload

| Type   | Extensions                         |
| ------ | ---------------------------------- |
| Data   | CSV, Excel (.xlsx/.xls), JSON, XML |
| Images | JPEG, PNG, GIF, WebP               |
| Text   | .txt, .md, .py, .js, etc.          |

### Container Reuse

Reuse containers across requests to maintain state (files, installed packages, variables). Extract the \`container_id\` from the first response and pass it to subsequent requests.

### Response Structure

The response contains interleaved text and tool result blocks:

- \`text\` — Claude's explanation
- \`server_tool_use\` — What Claude is doing
- \`bash_code_execution_tool_result\` — Code execution output (check \`return_code\` for success/failure)
- \`text_editor_code_execution_tool_result\` — File operation results

> **Security:** Always sanitize filenames with \`os.path.basename()\` / \`path.basename()\` before writing downloaded files to disk to prevent path traversal attacks. Write files to a dedicated output directory.

---

## Server-Side Tools: Web Search and Web Fetch

Web search and web fetch let Claude search the web and retrieve page content. They run server-side — just include the tool definitions and Claude handles queries, fetching, and result processing automatically.

### Tool Definitions

\`\`\`json
[
  { "type": "web_search_20260209", "name": "web_search" },
  { "type": "web_fetch_20260209", "name": "web_fetch" }
]
\`\`\`

### Dynamic Filtering (Opus 4.7 / Opus 4.6 / Sonnet 4.6)

The \`web_search_20260209\` and \`web_fetch_20260209\` versions support **dynamic filtering** — Claude writes and executes code to filter search results before they reach the context window, improving accuracy and token efficiency. Dynamic filtering is built into these tool versions and activates automatically; you do not need to separately declare the \`code_execution\` tool or pass any beta header.

\`\`\`json
{
  "tools": [
    { "type": "web_search_20260209", "name": "web_search" },
    { "type": "web_fetch_20260209", "name": "web_fetch" }
  ]
}
\`\`\`

Without dynamic filtering, the previous \`web_search_20250305\` version is also available.

> **Note:** Only include the standalone \`code_execution\` tool when your application needs code execution for its own purposes (data analysis, file processing, visualization) independent of web search. Including it alongside \`_20260209\` web tools creates a second execution environment that can confuse the model.

---

## Server-Side Tools: Programmatic Tool Calling

With standard tool use, each tool call is a round trip: Claude calls, the result enters Claude's context, Claude reasons, then calls the next tool. Chained calls accumulate latency and tokens — most of that intermediate data is never needed again.

Programmatic tool calling lets Claude compose those calls into a script. The script runs in the code execution container; when it invokes a tool, the container pauses, the call executes, and the result returns to the running code (not to Claude's context). The script processes it with normal control flow. Only the final output returns to Claude. Use it when chaining many tool calls or when intermediate results are large and should be filtered before reaching the context window.

For full documentation, use WebFetch:

- URL: \`https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling\`

---

## Server-Side Tools: Tool Search

The tool search tool lets Claude dynamically discover tools from large libraries without loading all definitions into the context window. Use it when you have many tools but only a few are relevant to any given request. Discovered tool schemas are appended to the request, not swapped in — this preserves the prompt cache (see \`agent-design.md\` §Caching for Agents).

For full documentation, use WebFetch:

- URL: \`https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool\`

---

## Skills

Skills package task-specific instructions that Claude loads only when relevant. Each skill is a folder containing a \`SKILL.md\` file. The skill's short description sits in context by default; Claude reads the full file when the current task calls for it. Use skills to keep specialized instructions out of the base system prompt without losing discoverability.

For full documentation, use WebFetch:

- URL: \`https://platform.claude.com/docs/en/agents-and-tools/skills\`

---

## Tool Use Examples

You can provide sample tool calls directly in your tool definitions to demonstrate usage patterns and reduce parameter errors. This helps Claude understand how to correctly format tool inputs, especially for tools with complex schemas.

For full documentation, use WebFetch:

- URL: \`https://platform.claude.com/docs/en/agents-and-tools/tool-use/implement-tool-use\`

---

## Server-Side Tools: Computer Use

Computer use lets Claude interact with a desktop environment (screenshots, mouse, keyboard). It can be Anthropic-hosted (server-side, like code execution) or self-hosted (you provide the environment and execute actions client-side).

For full documentation, use WebFetch:

- URL: \`https://platform.claude.com/docs/en/agents-and-tools/computer-use/overview\`

---

## Context Editing

Context editing clears stale tool results and thinking blocks from the transcript as a long-running agent accumulates turns. Unlike compaction (which summarizes), context editing prunes — the cleared content is removed, not replaced. Use it when old tool outputs are no longer relevant and you want to keep the transcript lean without losing the conversation structure. Thresholds for what to clear are configurable.

For full documentation, use WebFetch:

- URL: \`https://platform.claude.com/docs/en/build-with-claude/context-editing\`

---

## Client-Side Tools: Memory

The memory tool enables Claude to store and retrieve information across conversations through a memory file directory. Claude can create, read, update, and delete files that persist between sessions.

### Key Facts

- Client-side tool — you control storage via your implementation
- Supports commands: \`view\`, \`create\`, \`str_replace\`, \`insert\`, \`delete\`, \`rename\`
- Operates on files in a \`/memories\` directory
- The Python, TypeScript, and Java SDKs provide helper classes/functions for implementing the memory backend

> **Security:** Never store API keys, passwords, tokens, or other secrets in memory files. Be cautious with personally identifiable information (PII) — check data privacy regulations (GDPR, CCPA) before persisting user data. The reference implementations have no built-in access control; in multi-user systems, implement per-user memory directories and authentication in your tool handlers.

For full implementation examples, use WebFetch:

- Docs: \`https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool.md\`

---

## Structured Outputs

Structured outputs constrain Claude's responses to follow a specific JSON schema, guaranteeing valid, parseable output. This is not a separate tool — it enhances the Messages API response format and/or tool parameter validation.

Two features are available:

- **JSON outputs** (\`output_config.format\`): Control Claude's response format
- **Strict tool use** (\`strict: true\`): Guarantee valid tool parameter schemas

**Supported models:** {{OPUS_NAME}}, {{SONNET_NAME}}, and {{HAIKU_NAME}}. Legacy models (Claude Opus 4.5, Claude Opus 4.1) also support structured outputs.

> **Recommended:** Use \`client.messages.parse()\` which automatically validates responses against your schema. When using \`messages.create()\` directly, use \`output_config: {format: {...}}\`. The \`output_format\` convenience parameter is also accepted by some SDK methods (e.g., \`.parse()\`), but \`output_config.format\` is the canonical API-level parameter.

### JSON Schema Limitations

**Supported:**

- Basic types: object, array, string, integer, number, boolean, null
- \`enum\`, \`const\`, \`anyOf\`, \`allOf\`, \`$ref\`/\`$def\`
- String formats: \`date-time\`, \`time\`, \`date\`, \`duration\`, \`email\`, \`hostname\`, \`uri\`, \`ipv4\`, \`ipv6\`, \`uuid\`
- \`additionalProperties: false\` (required for all objects)

**Not supported:**

- Recursive schemas
- Numerical constraints (\`minimum\`, \`maximum\`, \`multipleOf\`)
- String constraints (\`minLength\`, \`maxLength\`)
- Complex array constraints
- \`additionalProperties\` set to anything other than \`false\`

The Python and TypeScript SDKs automatically handle unsupported constraints by removing them from the schema sent to the API and validating them client-side.

### Important Notes

- **First request latency**: New schemas incur a one-time compilation cost. Subsequent requests with the same schema use a 24-hour cache.
- **Refusals**: If Claude refuses for safety reasons (\`stop_reason: "refusal"\`), the output may not match your schema.
- **Token limits**: If \`stop_reason: "max_tokens"\`, output may be incomplete. Increase \`max_tokens\`.
- **Incompatible with**: Citations (returns 400 error), message prefilling.
- **Works with**: Batches API, streaming, token counting, extended thinking.

---

## Tips for Effective Tool Use

1. **Provide detailed descriptions**: Claude relies heavily on descriptions to understand when and how to use tools
2. **Use specific tool names**: \`get_current_weather\` is better than \`weather\`
3. **Validate inputs**: Always validate tool inputs before execution
4. **Handle errors gracefully**: Return informative error messages so Claude can adapt
5. **Limit tool count**: Too many tools can confuse the model — keep the set focused
6. **Test tool interactions**: Verify Claude uses tools correctly in various scenarios

For detailed tool use documentation, use WebFetch:

- URL: \`https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview\`
`
// @from(Ln 562057, Col 4)
pj5 = () => {}