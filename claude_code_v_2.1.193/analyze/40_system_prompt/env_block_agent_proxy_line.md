# Env Block — the optional agent-proxy diagnostic line (`${l}` slot)

> **Type:** NET-NEW capability (Remote / managed-egress agent-proxy only) · **Version:** v2.1.183 → v2.1.193
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`
> (VERSION `2.1.193`, build `a1938d2a`). Every `cli_inner_pretty.js:<line>` is a v2.1.193 line unless
> tagged `(183)` / `(v2.1.88)`.

---

## What it does

The environment block — the `<env>…</env>` scaffold that Claude Code injects into every system prompt
to tell the model its working directory, git status, platform, OS version, and (knowledge-cutoff)
suffix — gained **one new optional line**. When the session is running behind Claude Code's
**managed-egress agent proxy** (a policy-enforcing HTTPS proxy that re-terminates TLS, used in Claude
Code Remote / managed sandboxes), the env block now carries a diagnostic line that tells the model:

> *Outbound HTTPS goes through a pre-configured agent proxy (CA bundle: …). If a tool fails TLS
> verification or gets 403/405/407 from the proxy, … run `curl -sS "$HTTPS_PROXY/__agentproxy/status"`
> for per-tool fixes and proxy state; never disable TLS verification or unset HTTPS_PROXY.*

For any normal local session the slot evaluates to the empty string, so the env block is
**byte-for-byte identical** to v2.1.183. This is the only structural change to the env scaffold since
the v2.1.88 named ancestor.

---

## How it works

### 1. The slot in the env builder

The env builder is `computeEnvInfo` (obfuscated: `W3f`, :592845). v2.1.193 adds a local
`l = Nwn()` (:592865) and threads it into the template through a ternary slot placed **between**
`OS Version:` and `</env>`:

```javascript
// ============================================
// computeEnvInfo - env-block builder; NEW: conditional agent-proxy line via the `${l}` slot
// Location: cli_inner_pretty.js:592845-592880 (slot at 592865 + 592873-592878)
// ============================================

// ORIGINAL (for source lookup):
async function W3f(e, t) {
  let [n, r] = await Promise.all([W_(), F2o()]),
    o = "";
  { let c = bh(e); o = c ? `You are powered by the model named ${c}. The exact model ID is ${e}.` : `You are powered by the model ${e}.`; }
  let s = t && t.length > 0 ? `Additional working directories: ${t.join(", ")}\n` : "",
    i = N2o(e),
    a = i ? `\n\nAssistant knowledge cutoff is ${i}.` : "",
    l = Nwn();                                        // ← NEW: read the agent-proxy env line (or undefined)
  return `Here is useful information about the environment you are running in:
<env>
Working directory: ${Mt()}
Is directory a git repo: ${n ? "Yes" : "No"}
${s}Platform: ${Be.platform}
${B2o()}
OS Version: ${r}
${
  l                                                  // ← NEW: emit the proxy line only when present …
    ? `${l}
`
    : ""                                             // … otherwise inject nothing (byte-identical to 183)
}</env>
${o}${a}`;
}

// READABLE (for understanding):
async function computeEnvInfo(modelId, additionalWorkingDirs) {
  let [isGitRepo, osVersion] = await Promise.all([getIsGitRepo(), getOsVersion()]);
  let modelLine = "";
  { let displayName = getModelDisplayName(modelId);
    modelLine = displayName
      ? `You are powered by the model named ${displayName}. The exact model ID is ${modelId}.`
      : `You are powered by the model ${modelId}.`; }
  let additionalDirsInfo = additionalWorkingDirs?.length
        ? `Additional working directories: ${additionalWorkingDirs.join(", ")}\n` : "",
      cutoff = getKnowledgeCutoff(modelId),
      cutoffSuffix = cutoff ? `\n\nAssistant knowledge cutoff is ${cutoff}.` : "",
      agentProxyLine = getAgentProxyEnvLine();        // Nwn() → module var Bki (undefined unless proxy live)
  return `Here is useful information about the environment you are running in:
<env>
Working directory: ${getCwd()}
Is directory a git repo: ${isGitRepo ? "Yes" : "No"}
${additionalDirsInfo}Platform: ${process.env.platform}
${getShellInfoLine()}
OS Version: ${osVersion}
${ agentProxyLine ? `${agentProxyLine}\n` : "" }</env>
${modelLine}${cutoffSuffix}`;
}

// Mapping: W3f→computeEnvInfo, Nwn→getAgentProxyEnvLine, l→agentProxyLine, e→modelId, t→additionalWorkingDirs,
//   bh→getModelDisplayName, N2o→getKnowledgeCutoff, Mt→getCwd, B2o→getShellInfoLine, Be→process.env
```

The v2.1.183 builder (`L_f`, decl 183:580976; env body 580996-581004 — **not** `D_f`@581006, which is
the 3-param `(e,t,n)` sibling = 193 `V3f`@592881; confirmed by the extracted asset filename
`03_env_template_0_L_f.txt`) has **no** `l` / `${l}`: the block went straight from
`OS Version: ${r}` to `</env>`. Confirmed by reading both bundles.

### 2. The getter / setter / module var that back the slot

`Nwn()` is a trivial getter over a module-scoped var `Bki`, with a matching setter `h$t(e)`:

```javascript
// ============================================
// agentProxyEnvLine getter/setter/var - holds the env-block proxy diagnostic line (undefined when no proxy)
// Location: cli_inner_pretty.js:151173-151179
// ============================================

// ORIGINAL (for source lookup):
function h$t(e) { Bki = e; }
function Nwn() { return Bki; }
var Bki;

// READABLE (for understanding):
function setAgentProxyEnvLine(line) { agentProxyEnvLine = line; }  // set during proxy enable
function getAgentProxyEnvLine() { return agentProxyEnvLine; }      // read by computeEnvInfo
var agentProxyEnvLine;                                             // undefined for any non-proxy session

// Mapping: h$t→setAgentProxyEnvLine, Nwn→getAgentProxyEnvLine, Bki→agentProxyEnvLine, e→line
```

Because `Bki` is a plain module global initialised to `undefined`, `Nwn()` returns `undefined` (falsy)
for every session that never enables the proxy, so the slot ternary picks `""` and the env block is
unchanged. The line is therefore *push*-populated, never *pull*-computed inside the prompt builder —
the prompt path stays free of any proxy probing.

### 3. The line text (`C3o` = `buildAgentProxyEnvLine`)

The string itself is built by `C3o` (:616578), which takes the CA-bundle path `e` and an optional
README path `t`:

```javascript
// ============================================
// buildAgentProxyEnvLine - the env-block agent-proxy diagnostic line
// Location: cli_inner_pretty.js:616578-616581
// ============================================

// ORIGINAL (for source lookup):
function C3o(e, t) {
  let n = t ? `see ${t} and ` : "";
  return `Outbound HTTPS goes through a pre-configured agent proxy (CA bundle: ${e}). If a tool fails TLS verification or gets 403/405/407 from the proxy, ${n}run curl -sS "$HTTPS_PROXY/__agentproxy/status" for per-tool fixes and proxy state; never disable TLS verification or unset HTTPS_PROXY.`;
}

// READABLE (for understanding):
function buildAgentProxyEnvLine(caBundlePath, readmePath) {
  let seeReadme = readmePath ? `see ${readmePath} and ` : "";   // README path is only known after it is written
  return `Outbound HTTPS goes through a pre-configured agent proxy (CA bundle: ${caBundlePath}). ` +
         `If a tool fails TLS verification or gets 403/405/407 from the proxy, ${seeReadme}` +
         `run curl -sS "$HTTPS_PROXY/__agentproxy/status" for per-tool fixes and proxy state; ` +
         `never disable TLS verification or unset HTTPS_PROXY.`;
}

// Mapping: C3o→buildAgentProxyEnvLine, e→caBundlePath, t→readmePath, n→seeReadme
```

### 4. Where the line is set — the proxy-enable path (the gate)

`h$t(C3o(…))` is called from exactly one place: the agent-proxy **enable** block (:616455-616470). It
is set twice — first without a README path (so the env line exists immediately), then re-set with the
README path once the README file has been written — and it is **cleared** (`h$t(void 0)`) on proxy
stop:

```javascript
// ============================================
// proxy enable/stop wiring - populates and clears agentProxyEnvLine
// Location: cli_inner_pretty.js:616455-616470 (enable), 616690 (stop)
// ============================================

// ORIGINAL (for source lookup):
//   (enable) :616459  (h$t(C3o(c, void 0)),                       // set immediately, no README yet
//            :616461   v$.writeFile(m, Z8f(g.port, c), "utf8")    // write the README to path `m`
//            :616463     .then(() => { if (iS !== h) return;
//            :616464                    h$t(C3o(c, m)); })         // re-set with the README path `m`
//            :616466     .catch((y) => { …; if (iS !== h) return;
//            :616468                    h$t(C3o(c, void 0)); }),   // README write failed → drop the README ref
//   (stop)  :616690  ((iS = { enabled: !1, noProxy: R3o }), h$t(void 0), x3o?.stop(), (x3o = void 0));

// READABLE (for understanding):
// On proxy ENABLE (CA bundle path = c, proxy port = g.port, README target path = m):
setAgentProxyEnvLine(buildAgentProxyEnvLine(caBundlePath, undefined));      // line is live at once
writeFile(readmePath, buildAgentProxyReadme(port, caBundlePath), "utf8")    // Z8f writes the README
  .then(() => { if (proxyStateChanged()) return;
                setAgentProxyEnvLine(buildAgentProxyEnvLine(caBundlePath, readmePath)); })  // now point the line at the README
  .catch(() => { if (proxyStateChanged()) return;
                 setAgentProxyEnvLine(buildAgentProxyEnvLine(caBundlePath, undefined)); }); // README failed → omit "see <path>"
// On proxy STOP:
setAgentProxyEnvLine(undefined);                                            // slot reverts to "" → env block byte-identical to 183

// Mapping: h$t→setAgentProxyEnvLine, C3o→buildAgentProxyEnvLine, Z8f→buildAgentProxyReadme,
//   c→caBundlePath, m→readmePath, g.port→port, iS!==h → proxy state changed under us
```

### 5. The README it references (`Z8f` = `buildAgentProxyReadme`)

The `see ${readmePath}` clause in the env line points at a `# Claude Code agent proxy` README written
to disk by `Z8f` (:616595). It is a full troubleshooting document — quick-diagnosis steps
(`curl -sS …/__agentproxy/status`), failure classes ("certificate verify failed" / PKIX, 403/407 org
denials, git config conflicts, JVM truststore), and the same "never disable TLS verification, never
unset HTTPS_PROXY" rule:

```javascript
// ============================================
// buildAgentProxyReadme - the on-disk "# Claude Code agent proxy" troubleshooting README
// Location: cli_inner_pretty.js:616595-616620+ (header @616598, status endpoint @616609)
// ============================================

// ORIGINAL (for source lookup):
function Z8f(e, t) {
  let n = QHe.join(t, ".."), r = `http://127.0.0.1:${e}`;
  return `# Claude Code agent proxy

Outbound HTTPS from this session goes through a local proxy at ${r}
(set via HTTPS_PROXY) which tunnels to a policy-enforcing egress proxy. TLS is
re-terminated there, so every tool must trust the CA bundle at
${t}. …

## Quick diagnosis

1. Run: curl -sS ${r}/__agentproxy/status
   It reports proxy state, which trust and git accommodations are active …

## Failure classes and fixes
…`;
}

// READABLE (for understanding):
function buildAgentProxyReadme(proxyPort, caBundlePath) {
  let caDir = pathJoin(caBundlePath, ".."), proxyUrl = `http://127.0.0.1:${proxyPort}`;
  return /* markdown: header + "## Quick diagnosis" (curl …/__agentproxy/status) + "## Failure classes and fixes" */;
}

// Mapping: Z8f→buildAgentProxyReadme, e→proxyPort, t→caBundlePath, QHe.join→pathJoin
```

The `__agentproxy/status` diagnostic endpoint string appears **3×** in 193: the proxy server-side
banner (`GET /__agentproxy/status on this proxy port shows proxy state and recent failures.`, :615539),
the env line (`C3o`, :616580), and the README (`Z8f`, :616609).

---

## Why this approach

**Why a push-populated module var instead of computing the line inside the prompt builder.** The env
builder `W3f` runs on every prompt assembly (potentially many times per turn). The proxy state, by
contrast, changes rarely — once at enable, once at stop. By having the proxy-enable path *push* the
fully-formed line into `Bki` and having the prompt builder merely *read* it (`l = Nwn()`), the prompt
hot-path does zero proxy probing: no `process.env.HTTPS_PROXY` parse, no CA-bundle stat, no network
check. The alternative (recompute the line from env/proxy state on each `W3f` call) would couple the
prompt builder to the proxy subsystem and pay that cost on every assembly. The cost of the chosen
design is a tiny piece of mutable module state, accepted because the line is genuinely a slow-changing
singleton.

**Why two `setAgentProxyEnvLine` calls (the README-path race).** The line wants to reference the
on-disk README (`see ${readmePath} and …`), but the README is written *asynchronously*. Rather than
block the prompt on the file write, the enable path sets the line **immediately without** the README
ref (so the model still learns about the proxy on the very first turn), then **re-sets** it with the
README ref once the file lands. The `if (iS !== h) return;` guard in both the `.then` and `.catch` is
a stale-write check: if the proxy state changed (e.g. proxy stopped) while the README write was in
flight, the late callback must **not** resurrect the line. On README-write failure the `.catch` re-sets
the line *without* the README ref — the model still gets the `__agentproxy/status` curl hint, just no
"see `<path>`". This is a clean three-state design (no-README → README → README-failed) that always
keeps the actionable curl command in the line.

**Why enforce the model behaviour through the env block rather than a tool error.** When a tool hits a
TLS/403/407 failure behind the proxy, the *failure* surfaces as a tool error, but the *remediation*
(trust the CA bundle; never disable TLS; consult `__agentproxy/status`) is policy the model needs
**before** it reacts. Putting it in the env block means the model already holds the proxy contract as
ambient context, so its first instinct on a TLS failure is to inspect the proxy status rather than the
dangerous "disable TLS verification" workaround. The line explicitly forbids the two unsafe escapes
(`never disable TLS verification or unset HTTPS_PROXY`) — this is a *guardrail injected as prompt
context*, the same pattern the env block already uses for git-repo and platform facts.

---

## Key insight

The whole feature is **one conditional line in the env scaffold backed by a single module global**. The
slot ternary `${ l ? `${l}\n` : "" }` is engineered so that when the proxy is off the env block is
**byte-identical** to 183 (the asset grew 198 → 203 bytes, but the *rendered* block for a non-proxy
session is unchanged because the slot collapses to `""`). The complexity (the README, the status
endpoint, the two-phase set, the stale-write guard) all lives in the proxy subsystem; the prompt
builder's footprint is exactly one `let l = Nwn()` and one ternary. That separation is why a local
user sees nothing change and a Remote/managed session gets a fully-wired proxy contract from the first
turn.

---

## Evidence — NET-NEW vs CARRYOVER

| String / structure | 193 | 183 | Verdict |
|--------------------|-----|-----|---------|
| `Outbound HTTPS goes through a pre-configured agent proxy` (`C3o`) | 1 (:616580) | **0** | NET-NEW |
| `__agentproxy/status` | 3 (:615539, :616580, :616609) | **0** | NET-NEW |
| `# Claude Code agent proxy` (README, `Z8f`) | 1 (:616598) | **0** | NET-NEW |
| `## Failure classes and fixes` (README body) | 1 (:616618) | **0** | NET-NEW |
| `${l}` slot in env builder | present (:592873-592878) | **absent** (183 env ends at `OS Version:` @ 580996-581004) | NET-NEW |
| `03_env_template` asset size | **203 B** | 198 B | CHANGED (+5 B = the slot) |
| env scaffold (working dir / git / platform / OS / model line / cutoff) | unchanged | unchanged | **CARRYOVER** |

The *base* agent-proxy machinery already existed in 183 (the bare token `agent-proxy` count rose 29 →
69 across the window, and the 2.1.187 changelog mentions "agent proxy CA system-trust install"). But
the **env-block injection**, the **`C3o` diagnostic line**, the **`Z8f` README**, and the
**`__agentproxy/status` endpoint** are all genuinely net-new in this window (every one count 0 in 183).
The v2.1.88 named ancestor has neither (`grep -rEc 'agentproxy|Outbound HTTPS'` over
`/3rd/claude-code/src` = 0), and its `computeEnvInfo` (`constants/prompts.ts:606`, env literal :640)
ends the `<env>` block directly at `OS Version:` — the `${l}` slot is the **only** structural change to
the env scaffold since 88. Confidence: **high** (clean 0-in-183, exact line anchors, getter/setter
fully traced into the env builder and the proxy enable/stop path).

---

## Cross-links

- Module front-door + carryover ledger: [`README.md`](./README.md)
- The other 193 reminder/catalogue deltas: [`reminder_catalogue_delta_193.md`](./reminder_catalogue_delta_193.md)
- 183 baseline env-block analysis: [`../../../claude_code_v_2.1.183/analyze/40_system_prompt/README.md`](../../../claude_code_v_2.1.183/analyze/40_system_prompt/README.md) (env block section) and its [`reconstructed_source/`](../../../claude_code_v_2.1.183/analyze/40_system_prompt/reconstructed_source/README.md).
- Sandbox / managed-egress context: [`../38_permissions/sandbox_credentials.md`](../38_permissions/sandbox_credentials.md).

---

## Related Symbols

> Symbol mappings live in the symbol index files, never in this doc:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (system-prompt builders)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (**Prompt**; agent-proxy env line)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations
>
> Per-feature additions for this round: [symbol_additions_v2_1_193_system_prompt.md](../00_overview/symbol_additions_v2_1_193_system_prompt.md)
>
> Key symbols in this document:
> - `computeEnvInfo` (`W3f`, :592845) — env-block builder; NEW `l = Nwn()` (:592865) + `${l}` slot (:592873-592878); v2.1.88 `computeEnvInfo` @ `constants/prompts.ts:606`.
> - `buildAgentProxyEnvLine` (`C3o`, :616578) — the diagnostic line text; NET-NEW.
> - `getAgentProxyEnvLine` (`Nwn`, :151176) — slot reader; returns `Bki`.
> - `setAgentProxyEnvLine` (`h$t`, :151173) — push setter; called at :616459/616464/616468, cleared :616690.
> - `agentProxyEnvLine` (`Bki`, :151179) — module var; `undefined` for non-proxy sessions.
> - `buildAgentProxyReadme` (`Z8f`, :616595) — `# Claude Code agent proxy` README builder; NET-NEW.
