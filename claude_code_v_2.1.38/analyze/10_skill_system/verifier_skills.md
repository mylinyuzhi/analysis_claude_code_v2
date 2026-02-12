# Verifier Skills System - Deep Analysis (Claude Code 2.1.38)

## Overview

Verifier skills provide automated verification of code changes using project-specific testing strategies. The system follows an **orchestrator-executor architecture**: a central `/verify` skill acts as the coordinator that discovers available verifier skills, analyzes git changes, routes files to the appropriate verifiers, generates a structured verification plan, delegates execution to individual verifier skills, and aggregates results into a unified report.

The core idea is separation of concerns: the `/verify` orchestrator handles *what* to verify and *which* verifier to use, while individual verifier skills (e.g., `verifier-playwright`, `verifier-api`) handle *how* to execute the actual tests. This allows teams to define project-specific verification strategies as skills without modifying the orchestrator logic.

**Implementation status in 2.1.38**: The verifier system prompt (`__z`) is fully specified (244 lines of detailed behavioral instructions), but the skill registration functions (`Njq` for verify and `vjq` for init-verifiers) are **stub implementations** -- they exist in the initialization chain but contain only `return` with no body. The system prompt and lazy initializers are present, suggesting the feature is prepared for activation but not yet wired to `Sj` (registerPromptSkill) in this version.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions and constants in this document:
- `VERIFIER_SYSTEM_PROMPT` (__z) - The complete system prompt for the verify skill, chunks.177.mjs:1933-2176
- `registerVerifySkill` (Njq) - Stub registration function for the verify skill, chunks.177.mjs:1921-1923
- `registerInitVerifiersSkill` (vjq) - Stub registration function for the init-verifiers skill, chunks.177.mjs:1929-1931
- `verifySkillModuleInit` (Tjq) - Lazy initializer for verify skill module, chunks.177.mjs:1925-1927
- `initVerifiersModuleInit` (Ejq) - Lazy initializer for init-verifiers module, chunks.177.mjs:2178-2180
- `registerAllBuiltinSkills` (xjq) - Master function that calls all skill registration functions, chunks.177.mjs:2441-2443
- `builtinSkillsLazyInit` (bjq) - Lazy initializer that loads all skill modules, chunks.177.mjs:2445-2456
- `registerPromptSkill` (Sj) - Skill registration function, chunks.166.mjs:1795-1820

---

## Architecture

### Orchestrator-Executor Pattern

The verifier system uses a two-tier design:

```
User invokes /verify
       │
       ▼
┌──────────────────────────────┐
│     /verify Orchestrator     │  ← Powered by __z system prompt
│  (Phase 1-5 pipeline)       │
├──────────────────────────────┤
│ 1. Discover verifier skills  │  ← Name-based: "verifier" in skill name
│ 2. Analyze git changes       │  ← git status + git diff
│ 3. Route files → verifiers   │  ← Area-to-verifier matching
│ 4. Generate/reuse plan       │  ← Write to ~/.claude/plans/<slug>.md
│ 5. Trigger verifier skills   │  ← Sequential Skill tool invocations
└──────────┬───────────────────┘
           │  For each verifier group
           ▼
┌──────────────────────────────┐
│  verifier-playwright         │  ← Project-defined SKILL.md
│  verifier-api                │
│  verifier-frontend-playwright│  (multi-project repos)
│  verifier-backend-api        │
└──────────────────────────────┘
           │
           ▼
    Aggregated PASS/FAIL report
```

**What it does:** The orchestrator decomposes the verification problem into discovery, analysis, routing, planning, and execution. Each phase has clear inputs and outputs, and the actual test execution is delegated to project-specific verifier skills.

**Why this approach:** By separating the orchestration logic (built into Claude Code) from the verification strategies (defined per-project as skills), the system achieves:
1. **Reusability** -- The same orchestrator works for any project type
2. **Customizability** -- Teams write their own verifier skills with project-specific test commands
3. **Composability** -- Multiple verifiers can run for a single set of changes (UI + API changes in one commit)
4. **Determinism** -- Plans are written to files for reproducibility and reuse

**Key insight:** The verify skill itself is not a test runner -- it is a *meta-skill* that coordinates other skills. It only decides what to verify and which verifier to use, never how to actually run the tests.

### Registration Architecture

```javascript
// ============================================
// registerAllBuiltinSkills - Master registration function for all built-in skills
// Location: chunks.177.mjs:2441-2443
// ============================================

// ORIGINAL (for source lookup):
function xjq() {
    if (Xjq(), Pjq(), fjq(), Njq(), vjq(), kjq(), Cjq(), hjq(), cZ1()) jjq()
}

// READABLE (for understanding):
function registerAllBuiltinSkills() {
    registerRememberSkill();       // Xjq - stub (returns nothing)
    registerSettingsHelpSkill();   // Pjq - stub (returns nothing)
    registerKeybindingsSkill();    // fjq - actual Sj() call
    registerVerifySkill();         // Njq - stub (returns nothing)
    registerInitVerifiersSkill();  // vjq - stub (returns nothing)
    registerDebugSkill();          // kjq - actual Sj() call
    registerBenchmarkSkill();      // Cjq - stub (returns nothing)
    registerSkillifySkill();       // hjq - stub (returns nothing)
    if (isChromeExtensionAvailable()) {
        registerChromeSkill();     // jjq - conditional, actual Sj() call
    }
}

// Mapping: xjq→registerAllBuiltinSkills, Xjq→registerRememberSkill,
// Pjq→registerSettingsHelpSkill, fjq→registerKeybindingsSkill,
// Njq→registerVerifySkill, vjq→registerInitVerifiersSkill,
// kjq→registerDebugSkill, Cjq→registerBenchmarkSkill,
// hjq→registerSkillifySkill, cZ1→isChromeExtensionAvailable, jjq→registerChromeSkill
```

The stub functions for verify and init-verifiers:

```javascript
// ============================================
// registerVerifySkill - Stub for verify skill registration (not yet active)
// Location: chunks.177.mjs:1921-1923
// ============================================

// ORIGINAL (for source lookup):
function Njq() {
    return
}

// READABLE (for understanding):
function registerVerifySkill() {
    return  // No-op: skill not yet registered via Sj() in this version
}

// Mapping: Njq→registerVerifySkill
```

```javascript
// ============================================
// registerInitVerifiersSkill - Stub for init-verifiers skill registration
// Location: chunks.177.mjs:1929-1931
// ============================================

// ORIGINAL (for source lookup):
function vjq() {
    return
}

// READABLE (for understanding):
function registerInitVerifiersSkill() {
    return  // No-op: skill not yet registered via Sj() in this version
}

// Mapping: vjq→registerInitVerifiersSkill
```

The lazy module initializers confirm the system prompt is ready to be used:

```javascript
// ============================================
// verifySkillModuleInit - Lazy initializer for verify skill dependencies
// Location: chunks.177.mjs:1925-1927
// ============================================

// ORIGINAL (for source lookup):
Tjq = v(() => {
    nI()
})

// READABLE (for understanding):
verifySkillModuleInit = lazyInit(() => {
    initSkillRegistry()  // Ensures iHq (skill registry array) is initialized
})

// Mapping: Tjq→verifySkillModuleInit, v→lazyInit, nI→initSkillRegistry
```

```javascript
// ============================================
// initVerifiersModuleInit - Lazy initializer for init-verifiers skill dependencies
// Location: chunks.177.mjs:2178-2180
// ============================================

// ORIGINAL (for source lookup):
Ejq = v(() => {
    nI()
})

// READABLE (for understanding):
initVerifiersModuleInit = lazyInit(() => {
    initSkillRegistry()
})

// Mapping: Ejq→initVerifiersModuleInit, v→lazyInit, nI→initSkillRegistry
```

---

## Verifier Discovery (Phase 1)

### Name-Based Discovery Algorithm

**What it does:** Discovers available verifier skills by scanning the already-loaded skill list for any skill whose name contains "verifier" (case-insensitive).

**How it works:**
1. The orchestrator checks the "Available skills" section visible in the Skill tool description
2. It filters for skills with "verifier" in the name (e.g., `verifier-playwright`, `my-verifier`, `unit-test-verifier`)
3. No filesystem scanning is needed -- only already-loaded skills are considered
4. If no verifiers are found, the orchestrator suggests running `/init-verifiers` and halts

**Why this approach:**
- **Simplicity** -- Name-based convention avoids needing a separate verifier registry or metadata field
- **Zero configuration** -- Any skill with "verifier" in its name automatically becomes discoverable
- **Existing infrastructure** -- Leverages the skill loading system that already parses `.claude/skills/` directories

**Key insight:** The discovery mechanism is purely convention-based. There is no `type: "verifier"` field or special registration. The string match on the skill name is the entire discovery logic. This means any user-created skill named `foo-verifier-bar` will be picked up, while a skill named `test-runner` will not -- even if it performs verification.

**Trade-off:** Convention-based discovery is simple but fragile. If a user names a skill `my-verifier-config` (a configuration helper, not a test runner), it would be incorrectly treated as a verifier. The system relies on users following naming conventions.

### Fallback: No Verifiers Found

When no verifier skills exist, the orchestrator:
1. Informs the user: "No verifier skills found. Run `/init-verifiers` to create one."
2. Does **not** proceed with verification
3. Does **not** attempt to create ad-hoc verifiers or run tests directly

This is a hard stop -- the orchestrator refuses to bypass the verifier skill delegation model.

---

## Area-to-Verifier Routing (Phase 3)

### Routing Algorithm

**What it does:** Maps each changed file to the most appropriate verifier skill based on file type/location and verifier description matching.

**How it works:**
1. Identify changed files from `git status` / `git diff`
2. Read verifier skill descriptions to understand what each covers
3. For each changed file, match it to the verifier whose description best fits
4. When multiple verifiers could apply, use the change-type priority heuristic:
   - **UI changes** (components, pages, stylesheets) → prefer `playwright` / `e2e` verifiers
   - **API changes** (routes, handlers, middleware) → prefer `http` / `api` verifiers
   - **CLI changes** (commands, argument parsing) → prefer `cli` / `tmux` verifiers
5. Group files by their assigned verifier for batch execution

**Why this approach:**
- **Description-based matching** rather than hard-coded path rules allows verifier skills to self-describe what they handle
- **The priority heuristic** (UI → playwright, API → http, CLI → tmux) acts as a tiebreaker when multiple verifiers could plausibly handle a file
- **Grouping by verifier** enables batch execution -- a single verifier invocation covers all its assigned files

**Key insight:** The routing is fundamentally **LLM-driven**, not rule-based. The orchestrator (which is itself an LLM responding to the `__z` system prompt) reads verifier descriptions and makes a judgment call about which verifier best matches each file. The priority heuristic in the prompt (UI/API/CLI preferences) provides guardrails for the LLM's routing decisions.

### Multi-Project Repository Support

For monorepo setups, verifiers use a naming convention: `verifier-<project>-<type>`:

```
frontend/src/components/Button.tsx → verifier-frontend-playwright
backend/src/routes/users.ts       → verifier-backend-api
```

The orchestrator maps files to verifiers based on both the project subdirectory and the change type.

### Routing Decision Tree

```
For each changed file:
  │
  ├─ Read all verifier descriptions
  │
  ├─ Find verifier whose description best matches file
  │    │
  │    ├─ Unique match? → Assign to that verifier
  │    │
  │    └─ Multiple matches? → Apply priority heuristic:
  │         │
  │         ├─ File is UI-related?   → Prefer playwright/e2e verifier
  │         ├─ File is API-related?  → Prefer http/api verifier
  │         └─ File is CLI-related?  → Prefer cli/tmux verifier
  │
  └─ Group all files by assigned verifier
```

---

## Verification Plan (Phase 4)

### Plan Format and Storage

**What it does:** Creates a structured, deterministic verification plan that can be executed exactly as written, and persists it to a file.

**How it works:**
1. Plan files are stored at `~/.claude/plans/<slug>.md`
2. The plan contains 7 sections: Metadata, Files Being Verified, Preconditions, Setup Steps, Verification Steps, Cleanup Steps, and Execution Rules
3. Each verification step specifies: Action, Details, Expected outcome, and Success Criteria
4. The plan is written using the Write tool before any verifier is triggered

### Plan Metadata Structure

```markdown
## Metadata
- **Verifier Skills**: verifier-playwright, verifier-api
- **Project Type**: React web app, Express API
- **Created**: <timestamp>
- **Change Summary**: Added user profile page with new API endpoint
```

The metadata serves dual purposes:
1. **Human readability** -- developers can inspect plans to understand what was tested
2. **Plan reuse logic** -- the "Change Summary" and "Files Being Verified" fields are compared against current git state to determine if the plan can be reused

### Execution Rules (Embedded in Plan)

The plan includes strict execution rules that constrain the verifier skill's behavior:

1. **Execute exactly as written** -- no skipping, modifying, or adding steps
2. **Report PASS or FAIL for each step** -- no ambiguous results
3. **Stop immediately on first FAIL** -- fail-fast strategy
4. **Mark ambiguous results as FAIL** -- conservative interpretation
5. **No rounding up** -- "almost working" is FAIL, not PASS

**Why this approach:** The execution rules enforce determinism. Without them, the verifier skill (which is also an LLM-driven agent) might improvise, skip steps it deems unnecessary, or interpret partial failures as successes. The strict rules convert the verification from a judgment exercise into a mechanical checklist.

**Trade-off:** The fail-fast strategy (stop on first FAIL) means later steps are not tested when an early step fails. This reduces execution time but can mask multiple simultaneous issues. The alternative (run all steps regardless) would give a more complete picture but waste time on steps that depend on failed prerequisites.

---

## Plan Reuse Logic

### When to Reuse vs Regenerate

**What it does:** Determines whether an existing verification plan can be reused for the current set of changes, avoiding redundant plan generation.

**How it works:**
1. If a plan was passed in the prompt, parse it
2. Extract the plan's "Files Being Verified" list and "Change Summary"
3. Run `git diff` to get the current state of changes
4. Compare:
   - **Same files AND same objective** → Reuse plan as-is (skip to Phase 5)
   - **Different files, different objective, OR significant code differences** → Create fresh plan
5. If reusing, write plan to file if not already persisted

### Reuse Decision Algorithm

```
Input: existing_plan, current_git_diff

compare(existing_plan.files, current_diff.files):
  │
  ├─ Files match AND summary matches current changes?
  │    → REUSE: Skip plan generation, proceed to execution
  │
  ├─ New files appeared in diff?
  │    → REGENERATE: New files need new verification steps
  │
  ├─ Files removed from diff?
  │    → REGENERATE: Plan references files no longer changed
  │
  └─ Same files but different change objective?
       → REGENERATE: Different changes need different test strategies
```

**Why this approach:**
- **Efficiency** -- Plan generation requires LLM reasoning; reusing an existing plan avoids this cost
- **Consistency** -- Reusing the same plan across iterative fixes ensures the same verification criteria apply
- **Safety** -- The comparison against git diff prevents stale plans from being reused after the codebase has diverged

**Key insight:** The reuse logic compares at the *semantic* level (files + summary), not at the *diff content* level. This means if you fix a typo in `Button.tsx` after running verification, the same plan can be reused because the file list and change objective haven't changed -- even though the actual diff content is different. This is intentional: the plan tests *behavior*, not specific line changes.

**Trade-off:** Semantic-level comparison is faster but less precise than content-level diffing. A plan that tests "Button renders correctly" might be reused even if the nature of the Button change has shifted from a styling fix to a logic bug. The system accepts this trade-off because regenerating plans is relatively cheap compared to the confusion of over-precise matching.

---

## Multi-Verifier Batch Execution (Phase 5)

### Sequential Execution Strategy

**What it does:** Triggers verifier skills one at a time, passing each the plan file path and its assigned subset of files, then collects results before moving to the next verifier.

**How it works:**
1. From the routing phase, files are grouped by verifier
2. For each verifier group:
   a. Invoke the verifier skill via the Skill tool
   b. Pass the plan file path and the specific file subset in the prompt
   c. Wait for the verifier to complete and return results
   d. Collect results
3. Aggregate results across all verifiers into a single report

**Example invocation sequence for a full-stack change:**

```
Step 1: Invoke verifier-playwright
  - args: "Execute the verification plan at ~/.claude/plans/user-profile.md
           for files: src/components/UserProfile.tsx, src/pages/Profile.tsx"
  - Wait for results

Step 2: Invoke verifier-api
  - args: "Execute the verification plan at ~/.claude/plans/user-profile.md
           for files: src/routes/users.ts, src/middleware/auth.ts"
  - Wait for results

Step 3: Aggregate all results
```

**Why sequential (not parallel):**
- **Resource constraints** -- Each verifier may spin up servers, browsers, or test environments that compete for resources
- **Dependency ordering** -- API verifiers might need to run before e2e verifiers (backend must work for frontend tests to pass)
- **Result clarity** -- Sequential execution makes it clear which verifier produced which results
- **Simplicity** -- Parallel execution would require tracking multiple concurrent subagent sessions

**Trade-off:** Sequential execution is slower but more predictable. For projects with truly independent verifiers (e.g., linting vs. unit tests), parallel execution would be faster. The system chooses simplicity and predictability over speed.

---

## Reporting

### Report Structure

Results are reported **inline in the response** (not to a separate file). The report has three levels:

1. **Per-step results** -- Each verification step gets PASS or FAIL with command, expected, and actual values
2. **Per-verifier summary** -- Results grouped by which verifier produced them
3. **Overall summary** -- Total steps, pass count, fail count, and overall PASS/FAIL

### Report Format

```markdown
## Verification Results

**Verifiers Used**: verifier-playwright, verifier-api
**Plan File**: ~/.claude/plans/user-profile.md

### Summary
- Total Steps: 5
- PASSED: 4
- FAILED: 1

### verifier-playwright Results

#### Step 1: User profile page renders - PASS
- Command: `npx playwright test tests/profile.spec.ts`
- Expected: All tests pass
- Actual: 3/3 tests passed

#### Step 2: Profile form submission - FAIL
- Command: `npx playwright test tests/profile-form.spec.ts`
- Expected: Form submits successfully
- Actual: Timeout waiting for success toast
- **Error**: Element 'data-testid=success-toast' not found within 5000ms

### verifier-api Results

#### Step 3: GET /api/users/:id returns user data - PASS
...

### Overall: FAIL

### Recommended Fixes (if any failures)
1. Check that the success toast component is rendered after form submission
2. Verify the form handler calls the API endpoint correctly
```

**Why inline (not file-based) reporting:**
- **Immediate visibility** -- The user sees results directly in the conversation
- **Actionability** -- Recommended fixes appear right next to the failures
- **Context preservation** -- The conversation retains the full verification context for follow-up questions

### Error Reporting Design

The report includes three levels of detail for failures:
1. **Command** -- What was run (for manual reproduction)
2. **Expected vs Actual** -- What should have happened vs what did happen
3. **Error details** -- Specific error messages, timeouts, or stack traces

This structure is designed for **immediate issue resolution** -- a developer reading the report should be able to start debugging without re-running the tests.

---

## Implementation Status Analysis

### What Exists (v2.1.38)

| Component | Status | Location |
|-----------|--------|----------|
| Verifier system prompt (`__z`) | Complete (244 lines) | chunks.177.mjs:1933-2176 |
| Registration stub (`Njq`) | Stub (empty return) | chunks.177.mjs:1921-1923 |
| Init-verifiers stub (`vjq`) | Stub (empty return) | chunks.177.mjs:1929-1931 |
| Verify module initializer (`Tjq`) | Present, calls `nI()` | chunks.177.mjs:1925-1927 |
| Init-verifiers initializer (`Ejq`) | Present, calls `nI()` | chunks.177.mjs:2178-2180 |
| Registration in `xjq` chain | Present (position 4 and 5 of 9) | chunks.177.mjs:2442 |
| Lazy loading in `bjq` | Present (`Tjq`, `Ejq` both loaded) | chunks.177.mjs:2450-2451 |

### What is Missing

The registration functions `Njq` and `vjq` would need to call `Sj({...})` (like `fjq` does for keybindings-help or `kjq` does for debug) to actually register the skills. A complete registration would look like:

```javascript
// HYPOTHETICAL: What registerVerifySkill would look like when active
function registerVerifySkill() {
    Sj({
        name: "verify",
        description: "Verify code changes by discovering and orchestrating verifier skills",
        allowedTools: ["Bash", "Read", "Write", "Glob", "Grep", "Skill"],
        userInvocable: true,
        async getPromptForCommand(args) {
            return [{
                type: "text",
                text: __z + (args ? `\n\n## Task\n\n${args}` : "")
            }]
        }
    })
}
```

### Pattern Comparison with Active Skills

| Skill | Registration Function | Has `Sj()` Call | Status |
|-------|-----------------------|-----------------|--------|
| keybindings-help | `fjq` | Yes | Active |
| debug | `kjq` | Yes | Active |
| claude-in-chrome | `jjq` | Yes (conditional) | Active |
| verify | `Njq` | No (stub) | Inactive |
| init-verifiers | `vjq` | No (stub) | Inactive |
| remember | `Xjq` | No (stub) | Inactive |
| settings-help | `Pjq` | No (stub) | Inactive |
| benchmark | `Cjq` | No (stub) | Inactive |
| skillify | `hjq` | No (stub) | Inactive |

This shows that the verifier skills are part of a larger set of 6 stub skills that are prepared but not activated in v2.1.38. Only 3 of the 9 built-in prompt skills are fully registered.

---

## Design Rationale Summary

### Why an Orchestrator Pattern?

**Alternatives considered (inferable):**
1. **Direct test execution** -- The /verify skill runs tests itself → Rejected because every project has different test setups
2. **Single monolithic verifier** -- One skill handles all verification types → Rejected because UI testing (Playwright) is fundamentally different from API testing (HTTP requests)
3. **Parallel execution** -- Run all verifiers at once → Rejected for simplicity and resource management

**The chosen approach** (orchestrator + delegated executors) balances:
- **Generality** -- Works for any project structure
- **Specificity** -- Each verifier is purpose-built for its domain
- **Reusability** -- Plans persist and can be re-executed
- **Determinism** -- Strict execution rules prevent LLM improvisation

### Why Plan Files?

Persisting plans to `~/.claude/plans/<slug>.md` enables:
1. **Reuse across sessions** -- The same plan applies to repeated verification of the same changes
2. **Human inspection** -- Plans are Markdown files that developers can read and validate
3. **Version control** -- Plans could be committed to track verification strategies over time
4. **Debugging** -- When verification fails, the plan file shows exactly what was attempted
