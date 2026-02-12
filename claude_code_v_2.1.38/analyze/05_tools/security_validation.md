# Bash and Sed Security Validation

The `Bash` tool includes a comprehensive security validation layer to prevent malicious command execution, specifically targeting injection attacks and unauthorized file access. The validation logic is primarily located in `chunks.150.mjs`.

## Main Validation Logic

The `lm` function (chunks.150.mjs:382652) serves as the entry point for Bash command validation. It executes a series of check functions in sequence. If any check returns a `behavior: "ask"` result, the tool use requires explicit user confirmation.

### Validation Checks

The following checks are performed (in order):

1.  **`edY` (JQ Security):**
    *   Checks if the command is `jq`.
    *   Detects `system()` function calls (remote code execution risk).
    *   Detects dangerous flags like `-f`, `--from-file`, `--rawfile`, `--slurpfile`, `-L` which could read arbitrary files.

2.  **`$cY` (Obfuscated Flags):**
    *   Detects ANSI-C quoting (`$'...'`) and locale quoting (`$"..."`) which can hide characters.
    *   Detects empty quotes before flags (`"" -flag`).
    *   Detects quoted characters within flag names.

3.  **`AcY` (Shell Metacharacters):**
    *   Detects shell metacharacters (`|`, `&`, `;`) inside arguments.
    *   Specifically checks for dangerous patterns in `find` command arguments (`-name`, `-path`, `-regex`, `-exec`).

4.  **`qcY` (Dangerous Variables):**
    *   Detects variables used in dangerous contexts like redirections (`< $VAR`) or pipes.

5.  **`KcY` (Command Substitution & Redirection):**
    *   Detects backticks (`` ` ``) and `$()` for command substitution.
    *   Detects process substitution `<()` and `>()`.
    *   Detects input (`<`) and output (`>`) redirection to prevent reading/writing arbitrary files without authorization.

6.  **`YcY` (Newline Injection):**
    *   Detects newlines that could be used to separate multiple commands.

7.  **`zcY` (IFS Injection):**
    *   Detects attempts to manipulate the `IFS` (Internal Field Separator) variable, which can be used to bypass command parsing.

8.  **`wcY` (Proc Environ Access):**
    *   Detects access to `/proc/*/environ`, which can leak sensitive environment variables.

9.  **`HcY` (Malformed Token Injection):**
    *   Uses a tokenizer to detect ambiguous syntax or malformed tokens that could be misinterpreted by the shell.

## Sed Command Validation

The system includes specific validators for `sed` commands:

-   **`OcY`:** Validates `sed` commands to ensure they are safe (e.g., using `-n` or `-E` flags only).
-   **`J6q`:** Validates `sed` substitution commands (`s/search/replace/flags`). It enforces a strict structure and limits flags to prevent arbitrary code execution (e.g., ensuring only `g`, `p`, `i`, `m` flags are used).

## Tool Progress

The `Bash` tool supports a `bash_progress` event type (handled in `ZhA`, chunks.150.mjs:384633). This allows long-running commands to report their execution time and status back to the user interface without blocking the agent's context.
