# MCP Elicitation Handler Complete Analysis (Claude Code 2.1.76)

> Complete analysis of the MCP elicitation system - how MCP servers can request user input through forms and URLs.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP section)

Key concepts:
- Elicitation - MCP server → user input request mechanism
- Form mode - Structured JSON schema input
- URL mode - OAuth/external authentication flows
- Modal priority - Lowest in the modal stack

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ELICITATION SYSTEM ARCHITECTURE                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ MCP Server (requests user input)                               │  │
│  │                                                                 │  │
│  │  {                                                              │  │
│  │    "method": "elicitation/create",                             │  │
│  │    "params": {                                                  │  │
│  │      "message": "Please provide credentials",                  │  │
│  │      "requestedSchema": { ... }  // JSON Schema                │  │
│  │    }                                                           │  │
│  │  }                                                             │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                           │                                          │
│                           ▼                                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Elicitation Handler (chunks.194.mjs)                           │  │
│  │                                                                 │  │
│  │  ├─ Validate elicitation request                               │  │
│  │  ├─ Queue in pendingElicitations                               │  │
│  │  └─ Return elicitation/create result                           │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                           │                                          │
│                           ▼                                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Modal Priority Queue                                           │  │
│  │                                                                 │  │
│  │  1. sandbox-permission (highest)                               │  │
│  │  2. tool-permission                                            │  │
│  │  3. worker-sandbox-permission                                  │  │
│  │  4. elicitation (lowest) ← Elicitation shows here             │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                           │                                          │
│                           ▼                                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ UI Rendering                                                   │  │
│  │                                                                 │  │
│  │  Form Mode:                                                    │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │ Please provide database credentials                      │  │  │
│  │  │                                                           │  │  │
│  │  │ Host: [________________________]                         │  │  │
│  │  │ Port: [________________________]                         │  │  │
│  │  │ Username: [________________________]                     │  │  │
│  │  │ Password: [________________________] (masked)            │  │  │
│  │  │                                                           │  │  │
│  │  │ [Cancel] [Submit]                                         │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  │                                                                 │  │
│  │  URL Mode:                                                     │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │ Please authenticate with Google                          │  │  │
│  │  │                                                           │  │  │
│  │  │ Click the link below to authenticate:                    │  │  │
│  │  │ https://accounts.google.com/oauth/...                    │  │  │
│  │  │                                                           │  │  │
│  │  │ [I've completed authentication] [Cancel]                  │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                           │                                          │
│                           ▼                                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Response Routing                                               │  │
│  │                                                                 │  │
│  │  User submits form → Validate against schema                   │  │
│  │  → Send elicitation/create/response back to MCP server        │  │
│  │  → MCP server continues with provided data                    │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Elicitation Request Format

### Form Mode Request

MCP server requests structured input via JSON Schema:

```javascript
// MCP server sends:
{
  "jsonrpc": "2.0",
  "method": "elicitation/create",
  "params": {
    "message": "Please provide database connection details",
    "requestedSchema": {
      "type": "object",
      "properties": {
        "host": {
          "type": "string",
          "description": "Database host"
        },
        "port": {
          "type": "integer",
          "description": "Database port",
          "default": 5432
        },
        "username": {
          "type": "string",
          "description": "Database username"
        },
        "password": {
          "type": "string",
          "description": "Database password",
          "format": "password"  // UI hint for masking
        }
      },
      "required": ["host", "username", "password"]
    }
  }
}
```

### URL Mode Request

MCP server provides OAuth/external authentication URL:

```javascript
// MCP server sends:
{
  "jsonrpc": "2.0",
  "method": "elicitation/create",
  "params": {
    "message": "Please authenticate with Google",
    "uris": [
      "https://accounts.google.com/o/oauth2/v2/auth?client_id=xxx&redirect_uri=xxx&response_type=code&scope=xxx&state=xyz"
    ]
  }
}
```

---

## Modal Priority Algorithm

Elicitation dialogs have the **lowest priority** in the modal stack, ensuring they don't block more critical interactions:

```javascript
// ============================================
// Modal Priority Selection
// Location: chunks.185.mjs (REPL component)
// ============================================

function getCurrentModal(appState) {
  // Priority 1: Sandbox permission (highest)
  if (appState.sandboxPermissionQueue.length > 0) {
    return {
      type: "sandbox-permission",
      data: appState.sandboxPermissionQueue[0]
    };
  }

  // Priority 2: Tool permission
  if (appState.pendingToolRequest !== null) {
    return {
      type: "tool-permission",
      data: appState.pendingToolRequest
    };
  }

  // Priority 3: Worker sandbox permission
  if (appState.workerSandboxQueue.length > 0) {
    return {
      type: "worker-sandbox-permission",
      data: appState.workerSandboxQueue[0]
    };
  }

  // Priority 4: Elicitation (lowest)
  if (appState.elicitation.queue.length > 0) {
    return {
      type: "elicitation",
      data: appState.elicitation.queue[0]
    };
  }

  return null;  // No modal
}
```

**Key insight:** Elicitation dialogs will only appear when no other permission dialogs are pending. This prevents confusing UI states where multiple modals compete for attention.

---

## UI Components

### Form Mode Rendering

```javascript
// ============================================
// Elicitation Form Component
// Location: chunks.185.mjs (elicitation modal)
// ============================================

function ElicitationFormModal({ elicitation, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({});

  // Build form fields from JSON Schema
  const fields = Object.entries(elicitation.requestedSchema.properties).map(
    ([name, schema]) => ({
      name,
      label: schema.description || name,
      type: schema.format === "password" ? "password" : schema.type,
      required: elicitation.requestedSchema.required?.includes(name),
      default: schema.default
    })
  );

  return (
    <Box flexDirection="column">
      <Text bold>{elicitation.message}</Text>
      <Box marginTop={1}>

        {fields.map(field => (
          <Box key={field.name} flexDirection="column" marginBottom={1}>
            <Text>
              {field.label}
              {field.required && <Text color="red"> *</Text>}
            </Text>

            {field.type === "password" ? (
              <PasswordInput
                value={formData[field.name] || ""}
                onChange={(value) => setFormData({ ...formData, [field.name]: value })}
              />
            ) : field.type === "integer" ? (
              <NumberInput
                value={formData[field.name] || field.default}
                onChange={(value) => setFormData({ ...formData, [field.name]: value })}
              />
            ) : (
              <TextInput
                value={formData[field.name] || field.default || ""}
                onChange={(value) => setFormData({ ...formData, [field.name]: value })}
              />
            )}
          </Box>
        ))}
      </Box>

      <Box marginTop={1}>
        <Button onPress={onCancel}>Cancel</Button>
        <Button onPress={() => onSubmit(formData)}>Submit</Button>
      </Box>
    </Box>
  );
}
```

### URL Mode Rendering

```javascript
// ============================================
// Elicitation URL Component
// Location: chunks.185.mjs (elicitation modal)
// ============================================

function ElicitationUrlModal({ elicitation, onComplete, onCancel }) {
  return (
    <Box flexDirection="column">
      <Text bold>{elicitation.message}</Text>

      <Box marginTop={1}>
        <Text>Click the link below to authenticate:</Text>
      </Box>

      <Box marginTop={1}>
        <Link href={elicitation.uris[0]}>
          {elicitation.uris[0]}
        </Link>
      </Box>

      <Box marginTop={1}>
        <Button onPress={onCancel}>Cancel</Button>
        <Button onPress={onComplete}>I've completed authentication</Button>
      </Box>
    </Box>
  );
}
```

---

## Response Flow

### User Submits Form

```javascript
// ============================================
// Elicitation Response Handling
// Location: chunks.194.mjs
// ============================================

async function handleElicitationSubmit(elicitationId, formData, mcpClient) {
  // Validate against schema
  const validation = validateAgainstSchema(formData, elicitation.requestedSchema);
  if (!validation.valid) {
    // Show validation errors to user
    return { error: validation.errors };
  }

  // Send response back to MCP server
  await mcpClient.sendRequest({
    jsonrpc: "2.0",
    method: "elicitation/create/response",
    params: {
      id: elicitationId,
      action: "accept",
      content: formData
    }
  });

  // Remove from queue
  removeElicitationFromQueue(elicitationId);
}
```

### User Cancels

```javascript
async function handleElicitationCancel(elicitationId, mcpClient) {
  // Send cancellation to MCP server
  await mcpClient.sendRequest({
    jsonrpc: "2.0",
    method: "elicitation/create/response",
    params: {
      id: elicitationId,
      action: "cancel"
    }
  });

  // Remove from queue
  removeElicitationFromQueue(elicitationId);
}
```

---

## Cross-Module Integration

### Elicitation ↔ MCP (06)

```javascript
// In MCP client handler
async function handleMcpMessage(message, context) {
  if (message.method === "elicitation/create") {
    // Queue elicitation request
    context.elicitationQueue.push({
      id: generateId(),
      mcpServerName: context.serverName,
      message: message.params.message,
      requestedSchema: message.params.requestedSchema,
      uris: message.params.uris
    });

    // Trigger UI update
    context.setAppState({ elicitation: { queue: context.elicitationQueue } });

    // Return pending status
    return { status: "pending" };
  }
}
```

### Elicitation ↔ System Reminder (04)

Elicitation requests can generate system-reminder attachments:

```javascript
// Elicitation as attachment type
{
  type: "elicitation",
  serverName: "google-calendar",
  message: "Please authenticate with Google",
  uris: ["https://accounts.google.com/oauth/..."],
  timestamp: "2024-01-15T10:30:00Z"
}
```

### Elicitation ↔ UI (02)

```javascript
// State slice for elicitation in REPL component
interface ElicitationState {
  queue: ElicitationRequest[];
  currentModal: ElicitationRequest | null;
  isLoading: boolean;
}

// In REPL state
{
  elicitation: {
    queue: [],
    currentModal: null,
    isLoading: false
  }
}
```

---

## Supported Schema Types

| Type | UI Component | Notes |
|------|--------------|-------|
| `string` | TextInput | Default text field |
| `string` (format: password) | PasswordInput | Masked input |
| `string` (format: email) | EmailInput | Email validation |
| `string` (format: uri) | URLInput | URL validation |
| `integer` | NumberInput | Integer only |
| `number` | NumberInput | Float allowed |
| `boolean` | Checkbox | True/false toggle |
| `array` | MultiTextInput | Multiple values |
| `object` | NestedForm | Nested structure |

---

## Error Handling

### Schema Validation Errors

```javascript
// Validation error display
{
  error: "Validation failed",
  details: [
    { field: "host", message: "Host is required" },
    { field: "port", message: "Port must be an integer" }
  ]
}
```

### Network Errors

```javascript
// If MCP server disconnects during elicitation
{
  error: "MCP server disconnected",
  elicitationId: "xxx",
  action: "cleanup"  // Remove from queue
}
```

---

## Security Considerations

### Input Sanitization

User input from elicitation forms is sanitized before being sent to MCP servers:

```javascript
function sanitizeElicitationInput(formData, schema) {
  const sanitized = {};

  for (const [key, value] of Object.entries(formData)) {
    const fieldSchema = schema.properties[key];

    if (fieldSchema.type === "string") {
      // Sanitize string input
      sanitized[key] = sanitizeString(value);
    } else if (fieldSchema.type === "integer") {
      // Ensure integer
      sanitized[key] = parseInt(value, 10);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
```

### Sensitive Data Handling

Password fields use masked input and are not logged:

```javascript
// Password handling
if (schema.format === "password") {
  // Don't log, don't store in history
  return {
    ...formData,
    [fieldName]: formData[fieldName]  // Pass through only
  };
}
```

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Binary content handling for elicitation responses |
| 2.1.72 | Elicitation system introduced (form and URL modes) |