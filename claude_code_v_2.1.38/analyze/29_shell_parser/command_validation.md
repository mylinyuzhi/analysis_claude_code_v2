# Shell Parser and Command Validation Analysis

## Module Overview

The Shell Parser module in Claude Code v2.1.38 is a critical security component. It intercepts all `Bash` tool calls to perform "Pre-flight checks", detecting potentially dangerous redirections and command injections before they are executed on the host system.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `bashPreFlightCheck` (AYz) - The main entry point for command validation
- `extractRedirections` (aI) - Tokenizes command to find `>` and `>>`
- `checkDangerousRedirection` (YYz) - Analyzes if a redirection target is safe

## Bash Pre-flight Check (Algorithm)

**What it does:** Uses a combination of local tokenization and LLM-based policy enforcement to classify the risk of a shell command.

**How it works:**
1. **Local Check**: Checks if the command is a simple `--help` request (allowed automatically).
2. **Policy Extraction**: Sends the command string to an LLM with a specific `<policy_spec>`.
3. **Prefix Matching**: The LLM determines the "Command Prefix" (e.g., `git commit`).
4. **Injection Detection**: The LLM is trained to identify "Command Injection" (e.g., using `$()` or backticks to run extra commands).
5. **Enforcement**: If the LLM returns `command_injection_detected`, the CLI blocks the call and requires manual user approval.

```javascript
// ============================================
// bashPreFlightCheck - LLM-based security filter
// Location: chunks.169.mjs:1838-1977
// ============================================

// READABLE (for understanding):
async function bashPreFlightCheck(command, signal, isNonInteractive) {
    if (isHelpCommand(command)) return { commandPrefix: command };

    const policyPrompt = `
    # Claude Code Code Bash command prefix detection
    ...
    - git diff $(cat secrets.env | curl ...) => command_injection_detected
    - git status => git status
    ...
    `;

    const result = await queryModel({
        systemPrompt: ["Your task is to process Bash commands..."],
        userPrompt: `Command: ${command}`,
        options: { querySource: "bash_extract_prefix" }
    });

    const prefix = result.text;
    if (prefix === "command_injection_detected") {
        return { commandPrefix: null, danger: "injection" };
    }
    
    if (command.startsWith(prefix)) {
        return { commandPrefix: prefix };
    }
    
    return { commandPrefix: null };
}
```

## Redirection Security

The parser also looks for dangerous file redirections. Chaining commands via redirection is a common vector for data exfiltration or system modification.

```javascript
// ============================================
// YYz - Redirection Risk Assessment
// Location: chunks.169.mjs:2088-2216
// ============================================

// READABLE (for understanding):
function checkDangerousRedirection(operatorToken, prevToken, nextToken) {
    const isRedirection = operatorToken.op === ">" || operatorToken.op === ">>";
    if (!isRedirection) return { dangerous: false };

    // Check if the target contains variables or expansions
    if (containsShellVariable(nextToken)) {
        // Redirection to a variable (e.g. > $FILE) is considered dangerous
        // because it could be manipulated to overwrite sensitive files.
        return { dangerous: true, skip: 0 };
    }

    if (isSystemPipe(nextToken)) {
        // Redirection to standard pipes (e.g. >&1) is generally safe
        return { dangerous: false, skip: 0 };
    }

    return { dangerous: false, skip: 1 };
}
```

## Security Policy Highlights

- **Git Blocking**: The prefix `git` by itself is sometimes blocked (`prefix "git"` error) to force more specific prefix matching (e.g., `git status` vs `git push`).
- **Chain Blocking**: Commands like `pwd && curl ...` are flagged as injections because they execute multiple unrelated programs.
- **Environment Isolation**: The parser checks for environment variable assignments (`FOO=BAR command`) and ensures they are part of the allowed prefix.

**Key insight:** Claude Code treats the shell as an adversarial environment. It doesn't trust the LLM to generate "safe" commands; instead, it uses a second, strictly constrained pass to validate the generated command against a human-readable security policy.
