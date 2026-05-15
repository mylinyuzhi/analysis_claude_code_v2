# `FORCE_PROMPT_CACHING_5M` — Hard 5-Minute TTL Override

**Added:** v2.1.108
**Affects:** All users, all providers
**Location:** `chunks.194.mjs:1035` (first line of `is1HourCacheEligible`)

## What it does

When set to a truthy value, forces **every** cache_control marker in the session to use the default 5-minute TTL — even for users who would otherwise qualify for 1-hour TTL via subscription tier + allowlist. This is the **kill-switch** counterpart to `ENABLE_PROMPT_CACHING_1H`.

## v2.1.88 baseline

Did not exist. The only TTL knob was `ENABLE_PROMPT_CACHING_1H_BEDROCK` (opt-in for Bedrock only). There was no way to opt **out** of the 1h-TTL allowlist if a user was on a `repl_main_thread*` source as a subscriber — they got 1h whether they wanted it or not.

## v2.1.112 implementation

The check is the **very first** statement of `is1HourCacheEligible`:

```javascript
// ============================================
// is1HourCacheEligible - First gate: FORCE_PROMPT_CACHING_5M override
// Location: chunks.194.mjs:1035
// ============================================

// ORIGINAL (for source lookup):
function o85(q) {
    if (S6(process.env.FORCE_PROMPT_CACHING_5M)) return !1;
    // ... rest of decision tree below
}

// READABLE (for understanding):
function is1HourCacheEligible(querySource) {
  if (parseExplicitTrue(process.env.FORCE_PROMPT_CACHING_5M)) {
    return false;  // Hard downgrade — no further checks
  }
  // ... rest of decision tree below
}

// Mapping: o85→is1HourCacheEligible, S6→parseExplicitTrue
```

## Algorithm: Why First?

The position of this gate matters. It runs **before** the explicit opt-in checks:

```
FORCE_PROMPT_CACHING_5M ?     ← step 1: HIGHEST PRIORITY (this doc)
  └─ true  → return false (force 5m)
  └─ false → fall through

ENABLE_PROMPT_CACHING_1H ?    ← step 2: explicit opt-in
  └─ true  → return true

Bedrock + _1H_BEDROCK ?       ← step 3: Bedrock-specific opt-in
  └─ true  → return true

isSubscriber + !isUsingOverage ?  ← step 4: subscriber gate
  └─ false → return false
  └─ true  → check allowlist

Allowlist match ?             ← step 5: implicit opt-in via session source
```

**Why the override beats explicit opt-in:**

If a user sets *both* `ENABLE_PROMPT_CACHING_1H=1` and `FORCE_PROMPT_CACHING_5M=1`, the 5-minute force wins. This is correct because:

1. **Specificity:** A user who explicitly sets the override is making a deliberate choice for this session — they likely have a reason (debugging cache behavior, comparing TTLs, billing concerns on a forked deployment).
2. **Safety:** If both are set by mistake (e.g. one in `~/.zshrc`, one in a `.envrc`), the safer default is the **shorter** TTL — it doesn't tie up server resources for an hour.
3. **Convention:** Hard-stop flags ("force off") universally override soft-on flags in shell environments.

## Why this approach

**The problem it solves:** A user on the implicit allowlist (subscriber, `repl_main_thread*` session) wants to occasionally downgrade to 5-min TTL without changing tier or sources.

**Use cases:**
- **Debugging cache behavior:** Want to see what happens when the cache expires; can't wait an hour.
- **Comparing performance:** Want to A/B test 1h vs 5m TTL effect on session continuity.
- **Cost-conscious power users:** Even subscribers may want to minimize Anthropic's server-side cache footprint when working on sensitive material (more frequent eviction = less data persists).
- **Test isolation:** CI/integration tests that exercise cache paths need predictable TTLs.

**Alternative considered:** A `DISABLE_PROMPT_CACHING_1H` flag (matching the naming of `DISABLE_PROMPT_CACHING`). Rejected because:

| Naming | Semantic implication | Why rejected |
|--------|---------------------|--------------|
| `DISABLE_PROMPT_CACHING_1H` | "Turn off 1h" | Ambiguous: does it disable caching entirely? Or just downgrade to 5m? |
| `FORCE_PROMPT_CACHING_5M` | "Force this specific TTL" | Unambiguous: caching stays on, TTL is forced to 5m |

The "force" naming is clearer and aligns with the symmetric `ENABLE_PROMPT_CACHING_1H` opt-in.

## Trade-offs

**Compatibility:** Setting `FORCE_PROMPT_CACHING_5M=1` doesn't break anything — it just reduces cache hit rate for sessions that run longer than 5 minutes between turns. Cache reads/writes still work normally.

**Cost:** For a long-running session (~30+ minutes idle between turns), this can re-pay for the system prompt + tool schemas (~20K tokens) once per 5-minute window. At 2.50/MTok input cache write, that's ~5 cents per cache reload — material if it happens dozens of times in a session.

**Diagnostic value:** The flag gives Anthropic an easy way to ask users for repro: "Try `FORCE_PROMPT_CACHING_5M=1 claude` and see if the bug still reproduces." Bisecting 1h-vs-5m behavior would otherwise require subscription/source manipulation.

## Key insight

The order of the `if` statements in `is1HourCacheEligible` is its specification. Each gate has a documented precedence:

1. **Force-off** (`FORCE_PROMPT_CACHING_5M`)
2. **Explicit on** (`ENABLE_PROMPT_CACHING_1H`)
3. **Bedrock legacy on** (`ENABLE_PROMPT_CACHING_1H_BEDROCK`)
4. **Subscriber gate** (`isSubscriber() && !isUsingOverage`)
5. **Allowlist match** (`querySource` ∈ GrowthBook-controlled list)

Adding a new override or opt-in in the future means choosing one of these five slots — the order encodes which override wins, and that's the only authoritative reference for cross-flag interaction.

## Related symbols

- `is1HourCacheEligible` (`o85`) at chunks.194.mjs:1034
- `parseExplicitTrue` (`S6`) — env-var truthy parser (matches `"1"`, `"true"`, etc., case-insensitive)

See [cache_1h_ttl.md](./cache_1h_ttl.md) for the full decision tree.
