# MCP Elicitation UI Complete Analysis (Claude Code 2.1.76)

> Complete source-level analysis of the elicitation dialog UI components, form rendering, and user interaction flow.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP UI section)

Key functions in this document:
- `ElicitationDialog` (ZIq) - Main dispatcher - chunks.190.mjs:1242
- `FormElicitationDialog` (BWz) - Form mode renderer - chunks.190.mjs:1268
- `UrlElicitationDialog` (gWz) - URL mode renderer - chunks.190.mjs (referenced)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ELICITATION UI COMPONENTS                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ ZIq (ElicitationDialog) - Mode Dispatcher                      │  │
│  │                                                                 │  │
│  │  if (mode === "url") → gWz (UrlElicitationDialog)              │  │
│  │  else → BWz (FormElicitationDialog)                            │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                           │                                          │
│           ┌───────────────┴───────────────┐                          │
│           ▼                               ▼                          │
│  ┌─────────────────────┐      ┌─────────────────────┐                │
│  │ BWz (Form Mode)     │      │ gWz (URL Mode)      │                │
│  │                     │      │                     │                │
│  │ • JSON Schema form  │      │ • OAuth URL display │                │
│  │ • Field validation  │      │ • "I'm done" button │                │
│  │ • Keyboard nav      │      │ • Cancel option     │                │
│  │ • Accept/Decline    │      │                     │                │
│  └─────────────────────┘      └─────────────────────┘                │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## ElicitationDialog (ZIq) - Mode Dispatcher

**What it does:**
Dispatches to the appropriate elicitation dialog based on the mode parameter. Supports form mode and URL mode.

**Why this approach:**
- Single entry point simplifies integration with modal priority system
- Memoization prevents unnecessary re-renders
- Clean separation of concerns between form and URL handling

```javascript
// ============================================
// ZIq (ElicitationDialog) - Mode dispatcher
// Location: chunks.190.mjs:1242-1266
// ============================================

// ORIGINAL (for source lookup):
function ZIq(A) {
    let q = A6(7),
        {
            event: K,
            onResponse: Y,
            onWaitingDismiss: z
        } = A;
    if (K.params.mode === "url") {
        let w;
        if (q[0] !== K || q[1] !== Y || q[2] !== z) w = XA.default.createElement(gWz, {
            event: K,
            onResponse: Y,
            onWaitingDismiss: z
        }), q[0] = K, q[1] = Y, q[2] = z, q[3] = w;
        else w = q[3];
        return w
    }
    let _;
    if (q[4] !== K || q[5] !== Y) _ = XA.default.createElement(BWz, {
        event: K,
        onResponse: Y
    }), q[4] = K, q[5] = Y, q[6] = _;
    else _ = q[6];
    return _
}

// READABLE (for understanding):
function ElicitationDialog(props) {
    const cache = useCache(7);
    const { event, onResponse, onWaitingDismiss } = props;

    // URL mode - OAuth/external authentication
    if (event.params.mode === "url") {
        if (cache[0] !== event || cache[1] !== onResponse || cache[2] !== onWaitingDismiss) {
            const urlDialog = (
                <UrlElicitationDialog
                    event={event}
                    onResponse={onResponse}
                    onWaitingDismiss={onWaitingDismiss}
                />
            );
            cache[0] = event;
            cache[1] = onResponse;
            cache[2] = onWaitingDismiss;
            cache[3] = urlDialog;
        }
        return cache[3];
    }

    // Form mode - JSON Schema input
    if (cache[4] !== event || cache[5] !== onResponse) {
        const formDialog = (
            <FormElicitationDialog
                event={event}
                onResponse={onResponse}
            />
        );
        cache[4] = event;
        cache[5] = onResponse;
        cache[6] = formDialog;
    }
    return cache[6];
}

// Mapping: ZIq→ElicitationDialog, A→props, A6→useCache, K→event, Y→onResponse,
//          z→onWaitingDismiss, gWz→UrlElicitationDialog, BWz→FormElicitationDialog
```

---

## FormElicitationDialog (BWz) - Form Mode Renderer

**What it does:**
Renders a form-based elicitation dialog from a JSON Schema. Handles field validation, keyboard navigation, and form submission.

**Why this approach:**
- JSON Schema standard for form definition
- Real-time validation with error display
- Keyboard navigation for power users
- Accept/Decline options for user control

```javascript
// ============================================
// BWz (FormElicitationDialog) - Form mode renderer
// Location: chunks.190.mjs:1268-1380
// ============================================

// ORIGINAL (for source lookup):
function BWz({
    event: A,
    onResponse: q
}) {
    let {
        serverName: K,
        signal: Y
    } = A, z = A.params, {
        message: _,
        requestedSchema: w
    } = z, O = Object.keys(w.properties).length > 0, [$, H] = V_.useState(O ? null : "accept"), [j, J] = V_.useState(() => {
        let y6 = {};
        if (w.properties) {
            for (let [G6, R6] of Object.entries(w.properties))
                if (typeof R6 === "object" && R6 !== null) {
                    if (R6.default !== void 0) y6[G6] = R6.default
                }
        }
        return y6
    }), [M, D] = V_.useState(() => {
        let y6 = {};
        for (let [G6, R6] of Object.entries(w.properties))
            if (Wa6(R6) && R6?.default !== void 0) {
                let T6 = Ma6(String(R6.default), R6);
                if (!T6.isValid && T6.error) y6[G6] = T6.error
            } return y6
    });
    // ... rest of component
}

// READABLE (for understanding):
function FormElicitationDialog({ event, onResponse }) {
    const { serverName, signal } = event;
    const { message, requestedSchema } = event.params;

    // Check if form has fields
    const hasFields = Object.keys(requestedSchema.properties).length > 0;

    // State: selected action (null = field focus, "accept", "decline")
    const [selectedAction, setSelectedAction] = useState(hasFields ? null : "accept");

    // State: form values with defaults
    const [formValues, setFormValues] = useState(() => {
        const defaults = {};
        if (requestedSchema.properties) {
            for (const [fieldName, fieldSchema] of Object.entries(requestedSchema.properties)) {
                if (fieldSchema?.default !== undefined) {
                    defaults[fieldName] = fieldSchema.default;
                }
            }
        }
        return defaults;
    });

    // State: validation errors
    const [errors, setErrors] = useState(() => {
        const initialErrors = {};
        for (const [fieldName, fieldSchema] of Object.entries(requestedSchema.properties)) {
            if (isStringSchema(fieldSchema) && fieldSchema?.default !== undefined) {
                const validation = validateField(String(fieldSchema.default), fieldSchema);
                if (!validation.isValid && validation.error) {
                    initialErrors[fieldName] = validation.error;
                }
            }
        }
        return initialErrors;
    });

    // Handle abort signal
    useEffect(() => {
        if (!signal) return;

        const handleAbort = () => {
            onResponse("cancel");
        };

        if (signal.aborted) {
            handleAbort();
            return;
        }

        signal.addEventListener("abort", handleAbort);
        return () => signal.removeEventListener("abort", handleAbort);
    }, [signal, onResponse]);

    // Build field list from schema
    const fields = useMemo(() => {
        const required = requestedSchema.required ?? [];
        return Object.entries(requestedSchema.properties).map(([name, schema]) => ({
            name: name,
            schema: schema,
            isRequired: required.includes(name)
        }));
    }, [requestedSchema]);

    // State: focused field index
    const [focusedIndex, setFocusedIndex] = useState(hasFields ? 0 : undefined);

    // State: current input value (for text fields)
    const [inputValue, setInputValue] = useState(() => {
        const firstField = fields[0];
        if (firstField && isStringSchema(firstField.schema)) {
            const value = formValues[firstField.name];
            return value !== undefined ? String(value) : "";
        }
        return "";
    });

    // ... keyboard navigation, validation, submission logic
}

// Mapping: BWz→FormElicitationDialog, A→event, q→onResponse, K→serverName,
//          Y→signal, _→message, w→requestedSchema, O→hasFields,
//          $→selectedAction, H→setSelectedAction, j→formValues, J→setFormValues,
//          M→errors, D→setErrors, Wa6→isStringSchema, Ma6→validateField
```

---

## Field Rendering

### Supported Field Types

| JSON Schema Type | UI Component | Validation |
|------------------|--------------|------------|
| `string` | Text input | Min/max length, pattern |
| `string` + `format: "password"` | Masked input | Same as string |
| `integer` / `number` | Number input | Min/max, multipleOf |
| `boolean` | Checkbox | - |
| `array` (enum) | Multi-select | Min/max items |
| `object` | Nested fields | Recursive |

### Field State Management

```javascript
// ============================================
// Field value update handler
// ============================================

function updateFieldValue(fieldName, value) {
    setFormValues((prev) => {
        const updated = { ...prev };
        if (value === undefined) {
            delete updated[fieldName];
        } else {
            updated[fieldName] = value;
        }
        return updated;
    });

    // Clear "required" error if value provided
    if (value !== undefined && errors[fieldName] === "This field is required") {
        clearError(fieldName);
    }
}
```

---

## Keyboard Navigation

### Navigation Keys

| Key | Action |
|-----|--------|
| `↑` / `↓` | Navigate between fields and buttons |
| `Tab` | Move to next focusable element |
| `Enter` | Submit current field / accept form |
| `Escape` | Cancel elicitation |

### Focus Management

```javascript
// ============================================
// Keyboard navigation handler
// ============================================

function handleNavigation(direction) {
    // Validate current field before moving
    if (currentField && isStringSchema(currentField.schema)) {
        validateField(currentField.name, currentField.schema, inputValue);
    }

    const totalItems = fields.length + 2; // fields + accept + decline
    const currentIndex = focusedIndex ?? (selectedAction === "accept" ? fields.length : fields.length + 1);
    const nextIndex = direction === "up"
        ? (currentIndex + totalItems - 1) % totalItems
        : (currentIndex + 1) % totalItems;

    if (nextIndex < fields.length) {
        // Focus a field
        setFocusedIndex(nextIndex);
        setSelectedAction(null);
        updateInputForField(nextIndex);
    } else {
        // Focus a button
        setFocusedIndex(undefined);
        setSelectedAction(nextIndex === fields.length ? "accept" : "decline");
        setInputValue("");
    }
}
```

---

## Form Validation

### Real-Time Validation

```javascript
// ============================================
// Field validation logic
// ============================================

function validateField(fieldName, schema, value) {
    const errors = [];

    // Required check
    if (schema.required && (value === undefined || value === "")) {
        errors.push("This field is required");
    }

    // String validation
    if (schema.type === "string") {
        if (schema.minLength && value.length < schema.minLength) {
            errors.push(`Minimum ${schema.minLength} characters`);
        }
        if (schema.maxLength && value.length > schema.maxLength) {
            errors.push(`Maximum ${schema.maxLength} characters`);
        }
        if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
            errors.push(schema.patternMessage || "Invalid format");
        }
    }

    // Number validation
    if (schema.type === "number" || schema.type === "integer") {
        const num = Number(value);
        if (isNaN(num)) {
            errors.push("Must be a number");
        } else {
            if (schema.minimum !== undefined && num < schema.minimum) {
                errors.push(`Minimum: ${schema.minimum}`);
            }
            if (schema.maximum !== undefined && num > schema.maximum) {
                errors.push(`Maximum: ${schema.maximum}`);
            }
        }
    }

    return errors.length > 0 ? { isValid: false, errors } : { isValid: true };
}
```

---

## Response Handling

### Response Types

```javascript
// ============================================
// Elicitation response types
// ============================================

// Form submission
{
    action: "accept",
    content: {
        host: "localhost",
        port: 5432,
        username: "admin",
        password: "secret"
    }
}

// User declined
{
    action: "decline"
}

// User cancelled (Escape or abort)
{
    action: "cancel"
}
```

### Response Flow

```
User interacts with form
  │
  ├─→ Accept button → Validate all fields
  │     ├─→ Valid → onResponse("accept", values)
  │     └─→ Invalid → Show errors
  │
  ├─→ Decline button → onResponse("decline")
  │
  └─→ Cancel (Esc) → onResponse("cancel")
```

---

## Modal Priority Integration

### Priority Position

Elicitation has the **lowest priority** in the modal stack:

```
1. sandbox-permission     (highest)
2. tool-permission
3. worker-sandbox-permission
4. elicitation            (lowest)
```

### Modal Check in REPL

```javascript
// ============================================
// Modal priority determination
// Location: chunks.196.mjs:387-404
// ============================================

function determineActiveModal() {
    // ... higher priority checks ...

    // Elicitation - priority 6
    if (shouldShowAnimatedModal && elicitation.queue[0]) {
        return "elicitation";
    }

    // ... lower priority checks ...
}
```

### Elicitation Rendering

```javascript
// ============================================
// Elicitation modal in REPL
// Location: chunks.196.mjs:1573
// ============================================

// ORIGINAL:
K2 === "elicitation" && b8.createElement(ZIq, {
    event: o.queue[0],
    onResponse: (result) => handleElicitationResponse(result)
})

// READABLE:
activeModal === "elicitation" && (
    <ElicitationDialog
        event={elicitation.queue[0]}
        onResponse={(result) => handleElicitationResponse(result)}
    />
)
```

---

## Cross-Module Integration

### Elicitation ↔ MCP (06)

- Triggered by `elicitation/create` from MCP server
- Response sent via `elicitation/create/response`

### Elicitation ↔ UI (02)

- Rendered as modal in REPL component
- Lowest priority in modal stack
- Focus management during display

### Elicitation ↔ System Reminder (04)

- Elicitation status in session state
- Progress attachments during flow

---

## Quick Reference

### UI Components

| Obfuscated | Readable | Purpose |
|------------|----------|---------|
| ZIq | ElicitationDialog | Mode dispatcher |
| BWz | FormElicitationDialog | Form mode renderer |
| gWz | UrlElicitationDialog | URL mode renderer |

### State Structure

```javascript
{
    formValues: { [fieldName]: value },
    errors: { [fieldName]: errorMessage },
    focusedIndex: number | undefined,
    selectedAction: "accept" | "decline" | null
}
```

### Response Format

```javascript
onResponse("accept", { /* form values */ });
onResponse("decline");
onResponse("cancel");
```

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Enhanced validation, better error display |
| 2.1.72 | Initial elicitation support |