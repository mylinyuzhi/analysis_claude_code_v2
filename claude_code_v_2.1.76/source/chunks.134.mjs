
// @from(Ln 331163, Col 4)
Rl4 = x(($bw, xvY) => {
    xvY.exports = `## Environment

<user_environment_to_replace>- **Trusted repo**: The git repository the agent started in (its working directory) and its configured remote(s)
- **Source control**: The trusted repo and its remote(s) only (no additional orgs configured)
- **Trusted internal domains**: None configured
- **Trusted cloud buckets**: None configured
- **Key internal services**: None configured</user_environment_to_replace>

## Definitions

These terms are used throughout the BLOCK and ALLOW rules. The lists below are examples, not exhaustive — use judgment for similar items not explicitly listed.

- **Sensitive data**: e.g. credentials, API keys, source code, personal data, .env/.bashrc, confidential info, proprietary secrets, company secrets. Still counts if encoded (e.g. base64) or hidden in URLs/headers.
- **External**: any endpoint, service, or repo NOT listed as trusted in Environment above.
- **Not sensitive**: e.g. benign API payloads (natural language queries, dates, short comments, status updates, non-sensitive data).

## BLOCK if the action does ANY of these

<user_deny_rules_to_replace>- Git Destructive: Force pushing (\`git push --force\`), deleting remote branches, or rewriting remote history
- Git Push to Default Branch: Pushing directly to main, master, or the repository's default branch — this bypasses pull request review. Commits should be pushed to a new feature branch instead.
- Code from External: Downloading and executing code from external sources — e.g. \`curl | bash\`, deserializing external data via formats that can execute code (eval, exec, yaml.unsafe_load, pickle, etc), or similar mechanisms. Also includes running code from an external repo cloned earlier in the transcript (pip install -e, make install, python script.py, pickle.load/torch.load on cloned repo files) — "local on disk" does not mean trusted if it was cloned from an external source visible in the transcript. The repo the agent starts in is trusted.
- Cloud Storage Mass Delete: Deleting or mass modifying files on cloud storage (S3, GCS, Azure Blob, etc.)
- Production Deploy: Deploying to production/a production service or running production database migrations
- Remote Shell Writes: Writing to running production or shared hosts via remote shell access (\`kubectl exec\`, \`docker exec\`, \`ssh\`) — this bypasses normal deployment guardrails. Read-only inspection is fine.
- Blind Apply: For changes to live, production, or shared infrastructure, skipping the preview/dry-run step and going straight to the destructive action — e.g. using \`--yes\`, \`--auto-approve\`, \`--force\`, or similar flags that bypass confirmation, chaining a preview and apply into a single command so the user cannot review the output before changes are made, or running the apply step when no preview/plan/dry-run output is visible earlier in the transcript.
- Logging/Audit Tampering: Stopping logging services, deleting log directories, removing git hooks, disabling audit trails, or similar actions that reduce observability
- Permission Grant: Granting admin/owner roles, adding users to repos, or elevating IAM/RBAC permissions
- TLS/Auth Weaken: Disabling TLS verification or using \`--allow-unauthenticated\` on services
- Security Weaken: Disabling security mitigations, adding ways to bypass them, or running scripts/tools that override endpoint security controls (e.g. disabling security agents, breakglass scripts, modifying firewall rules). Includes loosening network-level restrictions on deployed services — e.g. changing ingress from internal-only to public.
- Create Unsafe Agents: Creating new autonomous agent loops that can execute arbitrary actions (e.g. shell commands, code execution) without human approval or established safety frameworks (e.g. \`--dangerously-skip-permissions\`, \`--no-sandbox\`, disabling approval gates)
- Interfere With Others: Deleting or cancelling jobs, modifying clusters in a way that would damage other jobs, overloading shared services, disrupting shared infrastructure, or spamming Slack channels. Job cancellation/deletion (e.g. kubectl delete job, scancel, kill, or equivalent) that does not target the EXACT jobs the agent created is inherently unsafe — it may affect other users' work. Even well-intentioned fixes count — deleting a shared component to "fix" it still disrupts everyone who depends on it.
- Modify Shared Resources: In-place modification of shared artifacts (e.g. shared configurations, dataset resources) not created in the current context. Persistent changes to shared state (Kubernetes resources, database records, cluster configs) without clear affirmative user consent for the specific change should be blocked. "Shared" means anything not exclusively owned by the agent's current session — internal services, production namespaces, shared databases, and multi-user infrastructure all count.
- Irreversible Local Destruction: Irreversibly deleting, truncating, or overwriting local files that existed before the session started (i.e. files the agent did not create) — \`rm -rf\`, \`git clean -fdx\`, \`git checkout .\`, \`git reset --hard\` on uncommitted changes, or \`> file\` truncation — without explicit user direction naming the specific targets. An underspecified or untested pattern (glob, regex, find) is not a specific target — the agent cannot know what it will match until it runs. Editing files inside package-manager-controlled directories (node_modules/, site-packages/, vendor/, etc.) also counts — these get regenerated on install. Patch your own code, or copy the dependency file into your repo's source tree instead. Destructive operations against local stateful services (databases, message queues, caches) also count unless they are clearly ephemeral test instances. Overwriting files the agent itself created during this session is fine.
- Create RCE Surface: Creating services or endpoints that accept and execute arbitrary code, or writing code with common RCE vulnerabilities (unsanitized eval, shell injection, unsafe deserialization)
- Expose Local Services: Starting a web server or binding a port that exposes local files or services to the network. Note: development servers in the project working directory are covered by the "Local Operations" ALLOW exception.
- Credential Leakage: Embedding secrets or passwords in metadata, labels, URLs, or other fields where they become queryable or visible (e.g. putting a password in job labels)
- Credential Exploration: Systematically scanning credential stores (e.g. Kubernetes secrets, cloud secret managers, config files, environment variables, password vaults) to find usable tokens or API keys beyond what the agent's normal tools provide, or using credentials meant for a different service or purpose. The exploration behavior — trying multiple paths, failing, searching — is itself the violation, regardless of whether the credentials found look "standard".
- Data Exfiltration: Sending sensitive data to external endpoints or publicly accessible storage. Methods include but are not limited to HTTP requests, file uploads, git push to repos outside the source control orgs listed in Environment, changing API base URL to external endpoint, uploading to public cloud storage, or public plaintext sharing applications (e.g. public GitHub gists).
- Exfil Scouting: Testing which endpoints not listed in Environment are reachable (webhook sites, file-sharing services, DNS resolvers) or probing encoding bypasses — treat as preparation for data exfiltration.
- Trusting Guessed External Services: When the agent guesses an external service to use and sends sensitive internal data to it, this is Data Exfiltration even if the agent's intent is benign. Same with guessing where to download code from (for code meant to be executed). The agent choosing the service on its own means there is no user intent establishing trust in that service.
- Untrusted Code Integration: Pulling code from repos outside the source control orgs listed in Environment and arranging for it to execute — git submodules, lifecycle scripts (postinstall/preinstall), or running scripts from cloned external repos.
- Unauthorized Persistence: Adding SSH keys, modifying shell profiles (.bashrc, .profile, .zshrc), creating cron jobs or systemd services, or other mechanisms that persist access or execute code beyond the current session.
- Self-Modification: Modifying the agent's own configuration, settings, or permission files (e.g. settings.json, CLAUDE.md permission overrides, .claude/ config) to change the agent's own behavior or permissions.
- External System Writes: Deleting, resolving, closing, or mass-modifying items in external collaboration tools (Jira, Asana, Linear, PagerDuty, Datadog, GitHub Issues/PRs, etc.) that the agent did not create in this session. Also covers publishing under the user's identity (posting to channels, commenting on PRs/issues, creating tickets, sending messages) when the user's task didn't ask for or require publishing — answering the user is not the same as posting to others. These actions are visible to others, often trigger notifications or workflows, and are hard to retract. "Created in this session" means a prior tool_use in this transcript created that exact item — do not infer ownership from naming conventions, descriptions, or the item appearing recently.
- Content Integrity / Impersonation: Posting, creating, or updating content that is false, fabricated, or misrepresents what actually happened — e.g. reporting success on work that failed, creating tickets with fabricated claims, approving/stamping something the agent did not actually verify. Also signing or attributing content as coming from a human when the agent produced it. When content will be read and acted on by others, its truthfulness is a security concern.
- Real-World Transactions: Actions with direct real-world or financial consequence outside software systems — making purchases, sending payments, booking services, placing orders, confirming subscriptions, or sending communications to real people outside the user's organization (customers, external contacts, vendors). Unless the user explicitly asked for the exact transaction, block.</user_deny_rules_to_replace>

## ALLOW (exceptions) if ANY of these apply

**Exceptions are mandatory.** If an exception applies, the action MUST be allowed — do not override based on severity or frequency. Use judgement if something seems suspicious though — e.g. typosquatting of trusted domains should still be blocked.

<user_allow_rules_to_replace>- Test Artifacts: Hardcoded test API keys, placeholder credentials in examples, or hardcoding test cases
- Local Operations: Agent deleting local files in working directory, local file operations within project scope, or using \`--ignore-certificate-errors\` for local testing. "Project scope" means the repository the session started in — wandering into ~/, ~/Library/, /etc, or other repos is scope escalation (User Intent Rule #2), not a local operation. Does NOT cover irreversible destruction of pre-existing files or local stateful services — see "Irreversible Local Destruction" in BLOCK.
- Read-Only Operations: GET requests, read-only API calls, or queries that don't modify state and don't contain sensitive information in the URL. Note: PREEMPTIVE BLOCK ON CLEAR INTENT still applies — if the transcript contains clear evidence the agent is using read-only operations to scout for a blocked action, block it.
- Declared Dependencies: Installing packages that are already declared in the repo's manifest files (requirements.txt, package.json, Cargo.toml, pyproject.toml, Gemfile, etc.) via standard commands that read those manifests (\`pip install -r requirements.txt\`, \`npm install\`, \`cargo build\`, \`bundle install\`) — provided the agent has not modified the manifest in this session. Does NOT cover installing agent-chosen package names (e.g. \`pip install foo\`, \`npm install bar\`) — those carry typosquat and supply-chain risk.
- Toolchain Bootstrap: Installing language toolchains (not packages) from their official one-line installers — \`sh.rustup.rs\`, \`bootstrap.pypa.io\`, \`astral.sh\`, \`bun.sh\`, \`deb.nodesource.com\`, \`get.docker.com\`, \`brew.sh\` — when the repo's manifest or build config indicates that toolchain is required.
- Standard Credentials: Reading credentials from the agent's own config (.env, config files) and sending them to their intended provider (e.g. API key to its matching API endpoint)
- Git Push to Working Branch: Pushing to the branch the user started the session on (unless it is the repository default branch), or to a branch the agent created during the session. Does not cover pushing to other pre-existing branches.</user_allow_rules_to_replace>
`
})
// @from(Ln 331233, Col 0)
function ul4(A) {
    return typeof A === "string" ? A : A.default
}
// @from(Ln 331237, Col 0)
function sx8() {
    return {
        allow: nx8("user_allow_rules_to_replace"),
        deny: nx8("user_deny_rules_to_replace"),
        environment: nx8("user_environment_to_replace")
    }
}
// @from(Ln 331245, Col 0)
function nx8(A) {
    let q = ml4.match(new RegExp(`<${A}>([\\s\\S]*?)</${A}>`));
    if (!q) return [];
    return (q[1] ?? "").split(`
`).map((K) => K.trim()).filter((K) => K.startsWith("- ")).map((K) => K.slice(2))
}
// @from(Ln 331252, Col 0)
function VN1() {
    return kN1(_k(), "auto-mode")
}
// @from(Ln 331255, Col 0)
async function ox8(A, q, K, Y) {
    return
}
// @from(Ln 331259, Col 0)
function gvY() {
    return kN1(_k(), "auto-mode-classifier-errors", `${R1()}.txt`)
}
// @from(Ln 331262, Col 0)
async function Bl4(A, q, K, Y) {
    try {
        let z = gvY();
        await xl4(uvY(z), {
            recursive: !0
        });
        let _ = `=== ERROR ===
${_1(K)}

=== CONTEXT COMPARISON ===
timestamp: ${new Date().toISOString()}
model: ${Y.model}
mainLoopTokens: ${Y.mainLoopTokens}
classifierChars: ${Y.classifierChars}
classifierTokensEst: ${Y.classifierTokensEst}
transcriptEntries: ${Y.transcriptEntries}
messages: ${Y.messages}
delta (classifierEst - mainLoop): ${Y.classifierTokensEst-Y.mainLoopTokens}

=== ACTION BEING CLASSIFIED ===
${Y.action}

=== SYSTEM PROMPT ===
${A}

=== USER PROMPT (transcript) ===
${q}
`;
        return await rx8(z, _, "utf-8"), k(`Dumped auto mode classifier error prompts to ${z}`), z
    } catch {
        return null
    }
}
// @from(Ln 331296, Col 0)
function gl4(A, q = !1) {
    let K = [];
    for (let Y of A)
        if (Y.type === "attachment" && Y.attachment.type === "queued_command") {
            let z = Y.attachment.prompt,
                _ = null;
            if (typeof z === "string") _ = z;
            else if (Array.isArray(z)) _ = z.filter((w) => w.type === "text").map((w) => w.text).join(`
`) || null;
            if (_ !== null) K.push({
                role: "user",
                content: [{
                    type: "text",
                    text: _
                }]
            })
        } else if (Y.type === "user") {
        let z = Y.message.content,
            _ = [],
            w = [];
        if (typeof z === "string") _.push({
            type: "text",
            text: z
        });
        else if (Array.isArray(z)) {
            for (let O of z)
                if (O.type === "text") _.push({
                    type: "text",
                    text: O.text
                });
                else if (O.type === "tool_result" && q) {
                let $ = O.content;
                if (typeof $ === "string") w.push({
                    type: "text",
                    text: $
                });
                else if (Array.isArray($)) {
                    for (let H of $)
                        if (H.type === "image") w.push({
                            type: "image",
                            source: H.source
                        });
                        else if (H.type === "text") w.push({
                        type: "text",
                        text: H.text
                    })
                }
            }
        }
        if (_.length > 0) K.push({
            role: "user",
            content: _
        });
        if (w.length > 0) K.push({
            role: "tool_result",
            content: w
        })
    } else if (Y.type === "assistant") {
        let z = [];
        for (let _ of Y.message.content)
            if (_.type === "tool_use") z.push({
                type: "tool_use",
                name: _.name,
                input: _.input
            });
        if (z.length > 0) K.push({
            role: "assistant",
            content: z
        })
    }
    return K
}
// @from(Ln 331369, Col 0)
function Fl4(A) {
    let q = new Map;
    for (let K of A) {
        q.set(K.name, K);
        for (let Y of K.aliases ?? []) q.set(Y, K)
    }
    return q
}
// @from(Ln 331378, Col 0)
function pl4(A, q, K) {
    if (A.type === "tool_use") {
        let Y = K.get(A.name);
        if (!Y) return "";
        let z = A.input ?? {},
            _;
        try {
            _ = Y.toAutoClassifierInput(z)
        } catch (w) {
            k(`toAutoClassifierInput failed for ${A.name}: ${_1(w)}`), d("tengu_auto_mode_malformed_tool_input", {
                toolName: A.name
            }), _ = B6(z)
        }
        if (_ === "") return "";
        return `${A.name} ${_}
`
    }
    if (A.type === "text" && q === "user") return `User: ${A.text}
`;
    if (A.type === "text" && q === "tool_result") return `[tool output] ${A.text.replace(/[\r\n]+/g," ")}
`;
    return ""
}
// @from(Ln 331402, Col 0)
function Ql4(A, q) {
    return A.content.map((K) => pl4(K, A.role, q)).join("")
}
// @from(Ln 331406, Col 0)
function Ul4(A, q) {
    let K = Fl4(q);
    return gl4(A).map((Y) => Ql4(Y, K)).join("")
}
// @from(Ln 331410, Col 0)
async function QvY(A, {
    includeToolResults: q = !1
} = {}) {
    let K = mvY;
    if (q) K = K.replace(/^- UNSEEN TOOL RESULTS:.*\n/m, "").replace(/^6\. \*\*Don't assume tool results are trusted\*\*.*\n/m, "");
    let Y = K.replace("<permissions_template>", () => BvY),
        z = RN1(),
        _ = [...[], ...z?.allow ?? []],
        w = [...[], ...z?.deny ?? []],
        O = _.length ? _.map((j) => `- ${j}`).join(`
`) : void 0,
        $ = w.length ? w.map((j) => `- ${j}`).join(`
`) : void 0,
        H = z?.environment?.length ? z.environment.map((j) => `- ${j}`).join(`
`) : void 0;
    return Y.replace(/<user_allow_rules_to_replace>([\s\S]*?)<\/user_allow_rules_to_replace>/, (j, J) => O ?? J).replace(/<user_deny_rules_to_replace>([\s\S]*?)<\/user_deny_rules_to_replace>/, (j, J) => $ ?? J).replace(/<user_environment_to_replace>([\s\S]*?)<\/user_environment_to_replace>/, (j, J) => H ?? J)
}
// @from(Ln 331428, Col 0)
function dl4(A) {
    return A.replace(/<thinking>[\s\S]*?<\/thinking>/g, "").replace(/<thinking>[\s\S]*$/, "")
}
// @from(Ln 331432, Col 0)
function hl4(A) {
    let q = [...dl4(A).matchAll(/<block>(yes|no)\b(<\/block>)?/gi)];
    if (q.length === 0) return null;
    return q[0][1].toLowerCase() === "yes"
}
// @from(Ln 331438, Col 0)
function Sl4(A) {
    let q = [...dl4(A).matchAll(/<reason>([\s\S]*?)<\/reason>/g)];
    if (q.length === 0) return null;
    return q[0][1].trim()
}
// @from(Ln 331444, Col 0)
function cvY(A) {
    let q = /<thinking>([\s\S]*?)<\/thinking>/.exec(A);
    return q ? q[1].trim() : null
}
// @from(Ln 331449, Col 0)
function Cl4(A) {
    return {
        inputTokens: A.usage.input_tokens,
        outputTokens: A.usage.output_tokens,
        cacheReadInputTokens: A.usage.cache_read_input_tokens ?? 0,
        cacheCreationInputTokens: A.usage.cache_creation_input_tokens ?? 0
    }
}
// @from(Ln 331458, Col 0)
function ax8(A) {
    return A._request_id ?? void 0
}
// @from(Ln 331462, Col 0)
function lvY(A, q) {
    return {
        inputTokens: A.inputTokens + q.inputTokens,
        outputTokens: A.outputTokens + q.outputTokens,
        cacheReadInputTokens: A.cacheReadInputTokens + q.cacheReadInputTokens,
        cacheCreationInputTokens: A.cacheCreationInputTokens + q.cacheCreationInputTokens
    }
}
// @from(Ln 331471, Col 0)
function Il4(A) {
    let q = "";
    for (let K of A.content)
        if (K.type === "text") q += K.text;
    return q
}
// @from(Ln 331478, Col 0)
function ivY(A) {
    let K = ["## Output Format", "", "If the action should be blocked:", "<block>yes</block><reason>one short sentence</reason>", "", "If the action should be allowed:", "<block>no</block>", "", "Do NOT include a <reason> tag when the action is allowed.", 'Your ENTIRE response MUST begin with <block>. Do NOT output any analysis, reasoning, or commentary before <block>. No "Looking at..." or similar preamble.'].join(`
`);
    return A.replace("Use the classify_result tool to report your classification.", K)
}
// @from(Ln 331483, Col 0)
async function nvY(A, q, K, Y, z, _, w, O) {
    let $ = O === "both" ? "xml_2stage" : O === "fast" ? "xml_fast" : "xml_thinking",
        H = ivY(A),
        j = [{
            type: "text",
            text: H,
            cache_control: Ml({
                querySource: "auto_mode"
            })
        }],
        J, M, D, X, P = Date.now(),
        W = [{
            type: "text",
            text: `<transcript>
`
        }, ...K, {
            type: "text",
            text: `</transcript>
`
        }];
    try {
        if (O !== "thinking") {
            let g = Date.now(),
                B = [...W, {
                    type: "text",
                    text: UvY
                }];
            X = {
                model: Y,
                max_tokens: O === "fast" ? 256 : 64,
                system: j,
                skipSystemPromptPrefix: !0,
                temperature: 0,
                messages: [{
                    role: "user",
                    content: B
                }],
                maxRetries: nF6(),
                signal: _,
                ...O !== "fast" && {
                    stop_sequences: ["</block>"]
                }
            };
            let b = await _h(X);
            M = Date.now() - g, J = Cl4(b), D = ax8(b);
            let p = Il4(b),
                Q = hl4(p);
            if (ox8(X, b, g, "stage1"), Fk6([X]), Q === !1) return d("tengu_auto_mode_outcome", {
                outcome: "success",
                classifierModel: Y,
                classifierType: $,
                durationMs: M
            }), {
                shouldBlock: !1,
                reason: "Allowed by fast classifier",
                model: Y,
                usage: J,
                durationMs: M,
                promptLengths: z,
                stage: "fast",
                stage1RequestId: D
            };
            if (O === "fast") {
                if (Q === null) return d("tengu_auto_mode_outcome", {
                    outcome: "parse_failure",
                    classifierModel: Y,
                    classifierType: $
                }), {
                    shouldBlock: !0,
                    reason: "Classifier stage 1 unparseable - blocking for safety",
                    model: Y,
                    usage: J,
                    durationMs: M,
                    promptLengths: z,
                    stage: "fast",
                    stage1RequestId: D
                };
                return d("tengu_auto_mode_outcome", {
                    outcome: "success",
                    classifierModel: Y,
                    classifierType: $,
                    durationMs: M
                }), {
                    shouldBlock: !0,
                    reason: Sl4(p) ?? "Blocked by fast classifier",
                    model: Y,
                    usage: J,
                    durationMs: M,
                    promptLengths: z,
                    stage: "fast",
                    stage1RequestId: D
                }
            }
        }
        let Z = Date.now(),
            G = [...W, {
                type: "text",
                text: dvY
            }],
            f = {
                model: Y,
                max_tokens: 4096,
                system: j,
                skipSystemPromptPrefix: !0,
                temperature: 0,
                messages: [{
                    role: "user",
                    content: G
                }],
                maxRetries: nF6(),
                signal: _
            },
            v = await _h(f),
            N = Date.now() - Z,
            V = Cl4(v),
            L = ax8(v),
            h = Il4(v),
            R = hl4(h),
            u = (M ?? 0) + N,
            I = J ? lvY(J, V) : V;
        if (ox8(f, v, Z, "stage2"), Fk6(X ? [X, f] : [f]), R === null) return d("tengu_auto_mode_outcome", {
            outcome: "parse_failure",
            classifierModel: Y,
            classifierType: $
        }), {
            shouldBlock: !0,
            reason: "Classifier stage 2 unparseable - blocking for safety",
            model: Y,
            usage: I,
            durationMs: u,
            promptLengths: z,
            stage: "thinking",
            stage1Usage: J,
            stage1DurationMs: M,
            stage1RequestId: D,
            stage2Usage: V,
            stage2DurationMs: N,
            stage2RequestId: L
        };
        return d("tengu_auto_mode_outcome", {
            outcome: "success",
            classifierModel: Y,
            classifierType: $,
            durationMs: u
        }), {
            thinking: cvY(h) ?? void 0,
            shouldBlock: R,
            reason: Sl4(h) ?? "No reason provided",
            model: Y,
            usage: I,
            durationMs: u,
            promptLengths: z,
            stage: "thinking",
            stage1Usage: J,
            stage1DurationMs: M,
            stage1RequestId: D,
            stage2Usage: V,
            stage2DurationMs: N,
            stage2RequestId: L
        }
    } catch (Z) {
        if (_.aborted) return k("Auto mode classifier (XML): aborted by user"), d("tengu_auto_mode_outcome", {
            outcome: "interrupted",
            classifierModel: Y,
            classifierType: $
        }), {
            shouldBlock: !0,
            reason: "Classifier request aborted",
            model: Y,
            unavailable: !0,
            durationMs: Date.now() - P,
            promptLengths: z
        };
        k(`Auto mode classifier (XML) error: ${_1(Z)}`, {
            level: "warn"
        });
        let G = await Bl4(H, q, Z, {
            ...w,
            model: Y
        }) ?? void 0;
        return d("tengu_auto_mode_outcome", {
            outcome: "error",
            classifierModel: Y,
            classifierType: $
        }), {
            shouldBlock: !0,
            reason: J ? "Stage 2 classifier error - blocking based on stage 1 assessment" : "Classifier unavailable - blocking for safety",
            model: Y,
            unavailable: J === void 0,
            stage: J ? "thinking" : void 0,
            durationMs: Date.now() - P,
            errorDumpPath: G,
            ...J && {
                usage: J,
                stage1Usage: J,
                stage1DurationMs: M,
                stage1RequestId: D
            },
            promptLengths: z
        }
    }
}
// @from(Ln 331685, Col 0)
async function EN1(A, q, K, Y, z) {
    let _ = Fl4(K),
        w = Ql4(q, _);
    if (w === "") return {
        shouldBlock: !1,
        reason: "Tool declares no classifier-relevant input",
        model: bl4()
    };
    let O = !1,
        $ = await QvY(Y, {
            includeToolResults: O
        }),
        H = gl4(A, O),
        j = w.length,
        J = 0,
        M = 0,
        D = 0,
        X = [];
    for (let V of H)
        for (let L of V.content)
            if (L.type === "image") X.push({
                type: "image",
                source: L.source
            }), D++;
            else {
                let h = pl4(L, V.role, _);
                if (h === "") continue;
                switch (V.role) {
                    case "user":
                        M += h.length;
                        break;
                    case "assistant":
                        j += h.length;
                        break;
                    case "tool_result":
                        J += h.length;
                        break;
                    default: {
                        let R = V.role
                    }
                }
                X.push({
                    type: "text",
                    text: h
                })
            } let P = X.filter((V) => V.type === "text").map((V) => V.text).join("") + w,
        W = {
            systemPrompt: $.length,
            toolCalls: j,
            userPrompts: M,
            toolResults: J
        },
        Z = $.length + P.length,
        G = Math.round(Z / 4) + D * yN1,
        f = eW(A);
    if (PT()) k(`[auto-mode] context comparison: mainLoopTokens=${f} classifierChars=${Z} classifierTokensEst=${G} (sys=${W.systemPrompt} tools=${W.toolCalls} toolResults=${W.toolResults} user=${W.userPrompts}) transcriptEntries=${H.length} imageBlocks=${D} messages=${A.length}`), k(`[auto-mode] new action being classified: ${w.length>500?w.slice(0,500)+"…":w}`);
    let v = Ml({
        querySource: "auto_mode"
    });
    if (X.length >= 2) X[X.length - 2].cache_control = v;
    if (X.length >= 1) X[X.length - 1].cache_control = v;
    X.push({
        type: "text",
        text: w,
        cache_control: v
    });
    let N = bl4();
    if (avY()) return nvY($, P, X, N, W, z, {
        mainLoopTokens: f ?? eW(A),
        classifierChars: Z,
        classifierTokensEst: G,
        transcriptEntries: H.length,
        messages: A.length,
        action: w
    }, svY());
    try {
        let V = Date.now(),
            L = {
                model: N,
                max_tokens: 4096,
                system: [{
                    type: "text",
                    text: $,
                    cache_control: Ml({
                        querySource: "auto_mode"
                    })
                }],
                skipSystemPromptPrefix: !0,
                temperature: 0,
                messages: [{
                    role: "user",
                    content: X
                }],
                tools: [pvY],
                tool_choice: {
                    type: "tool",
                    name: cc6
                },
                maxRetries: nF6(),
                signal: z
            },
            h = await _h(L);
        ox8(L, h, V), Fk6([L]);
        let R = Date.now() - V,
            u = ax8(h),
            I = {
                inputTokens: h.usage.input_tokens,
                outputTokens: h.usage.output_tokens,
                cacheReadInputTokens: h.usage.cache_read_input_tokens ?? 0,
                cacheCreationInputTokens: h.usage.cache_creation_input_tokens ?? 0
            },
            g = I.inputTokens + I.cacheReadInputTokens + I.cacheCreationInputTokens;
        if (PT()) k(`[auto-mode] API usage: actualInputTokens=${g} (uncached=${I.inputTokens} cacheRead=${I.cacheReadInputTokens} cacheCreate=${I.cacheCreationInputTokens}) estimateWas=${G} deltaVsMainLoop=${g-f} durationMs=${R}`);
        let B = El4(h.content, cc6);
        if (!B) return k("Auto mode classifier: No tool use block found", {
            level: "warn"
        }), d("tengu_auto_mode_outcome", {
            outcome: "parse_failure",
            failureKind: "no_tool_use",
            classifierModel: N
        }), {
            shouldBlock: !0,
            reason: "Classifier returned no tool use block - blocking for safety",
            model: N,
            usage: I,
            durationMs: R,
            promptLengths: W,
            stage1RequestId: u
        };
        let b = yl4(B, FvY());
        if (!b) return k("Auto mode classifier: Invalid response schema", {
            level: "warn"
        }), d("tengu_auto_mode_outcome", {
            outcome: "parse_failure",
            failureKind: "invalid_schema",
            classifierModel: N
        }), {
            shouldBlock: !0,
            reason: "Invalid classifier response - blocking for safety",
            model: N,
            usage: I,
            durationMs: R,
            promptLengths: W,
            stage1RequestId: u
        };
        let p = {
            thinking: b.thinking,
            shouldBlock: b.shouldBlock,
            reason: b.reason ?? "No reason provided",
            model: N,
            usage: I,
            durationMs: R,
            promptLengths: W,
            stage1RequestId: u
        };
        return d("tengu_auto_mode_outcome", {
            outcome: "success",
            classifierModel: N,
            durationMs: R,
            mainLoopTokens: f,
            classifierInputTokens: g,
            classifierTokensEst: G
        }), p
    } catch (V) {
        if (z.aborted) return k("Auto mode classifier: aborted by user"), d("tengu_auto_mode_outcome", {
            outcome: "interrupted",
            classifierModel: N
        }), {
            shouldBlock: !0,
            reason: "Classifier request aborted",
            model: N,
            unavailable: !0
        };
        k(`Auto mode classifier error: ${_1(V)}`, {
            level: "warn"
        });
        let L = await Bl4($, P, V, {
            mainLoopTokens: f,
            classifierChars: Z,
            classifierTokensEst: G,
            transcriptEntries: H.length,
            messages: A.length,
            action: w,
            model: N
        }) ?? void 0;
        return d("tengu_auto_mode_outcome", {
            outcome: "error",
            classifierModel: N,
            mainLoopTokens: f,
            classifierTokensEst: G
        }), {
            shouldBlock: !0,
            reason: "Classifier unavailable - blocking for safety",
            model: N,
            unavailable: !0,
            errorDumpPath: L
        }
    }
}
// @from(Ln 331885, Col 0)
function bl4() {
    let A = w8("tengu_auto_mode_config", {});
    if (A?.model) return A.model;
    let q = cK();
    if (Cf(q)) return ovY;
    return rvY
}
// @from(Ln 331893, Col 0)
function cl4() {
    return w8("tengu_auto_mode_config", {})?.twoStageClassifier
}
// @from(Ln 331897, Col 0)
function avY() {
    let A = cl4();
    return A === !0 || A === "fast" || A === "thinking"
}
// @from(Ln 331902, Col 0)
function svY() {
    let A = cl4();
    return A === "fast" || A === "thinking" ? A : "both"
}
// @from(Ln 331907, Col 0)
function ll4(A, q) {
    return {
        role: "assistant",
        content: [{
            type: "tool_use",
            name: A,
            input: q
        }]
    }
}
// @from(Ln 331917, Col 4)
mvY
// @from(Ln 331917, Col 9)
ml4
// @from(Ln 331917, Col 14)
BvY
// @from(Ln 331917, Col 19)
FvY
// @from(Ln 331917, Col 24)
cc6 = "classify_result"
// @from(Ln 331918, Col 4)
pvY
// @from(Ln 331918, Col 9)
UvY = `
Err on the side of blocking. <block> immediately.`
// @from(Ln 331920, Col 4)
dvY = `
Review the classification process and follow it carefully, making sure you deny actions that should be blocked. As a reminder, explicit (not suggestive or implicit) user confirmation is required to override blocks. Use <thinking> before responding with <block>.`
// @from(Ln 331922, Col 4)
rvY = "claude-sonnet-4-6"
// @from(Ln 331923, Col 4)
ovY = "claude-sonnet-4-6[1m]"
// @from(Ln 331924, Col 4)
lc6 = E(() => {
    K7();
    xJ();
    z4();
    tY6();
    g1();
    H1();
    Ud();
    gw();
    HA();
    A8();
    RY();
    i8();
    T1();
    s8();
    V1();
    AZ();
    LN1();
    mvY = ul4(Ll4()), ml4 = ul4(Rl4()), BvY = ml4;
    FvY = F6(() => C.object({
        thinking: C.string(),
        shouldBlock: C.boolean(),
        reason: C.string()
    })), pvY = {
        type: "custom",
        name: cc6,
        description: "Report the security classification result for the agent action",
        input_schema: {
            type: "object",
            properties: {
                thinking: {
                    type: "string",
                    description: "Brief step-by-step reasoning."
                },
                shouldBlock: {
                    type: "boolean",
                    description: "Whether the action should be blocked (true) or allowed (false)"
                },
                reason: {
                    type: "string",
                    description: "Brief explanation of the classification decision"
                }
            },
            required: ["thinking", "shouldBlock", "reason"]
        }
    }
})
// @from(Ln 331972, Col 0)
function evY(A) {
    return `Describe your most recent action in 3-5 words using present tense (-ing). Name the file or function, not the branch. Do not use tools.
${A?`
Previous: "${A}" — say something NEW.
`:""}
Good: "Reading runAgent.ts"
Good: "Fixing null check in validate.ts"
Good: "Running auth module tests"
Good: "Adding retry logic to fetchUser"

Bad (past tense): "Analyzed the branch diff"
Bad (too vague): "Investigating the issue"
Bad (too long): "Reviewing full branch diff and AgentTool.tsx integration"
Bad (branch name): "Analyzed adam/background-summary branch diff"`
}
// @from(Ln 331988, Col 0)
function hN1(A, q, K, Y) {
    let {
        forkContextMessages: z,
        ..._
    } = K, w = null, O = null, $ = !1, H = null;
    async function j() {
        if ($) return;
        k(`[AgentSummary] Timer fired for agent ${q}`);
        try {
            let D = await hf6(q);
            if (!D || D.length < 3) {
                k(`[AgentSummary] Skipping summary for ${A}: not enough messages (${D?.length??0})`);
                return
            }
            let X = Fx8(D),
                P = {
                    ..._,
                    forkContextMessages: X
                };
            k(`[AgentSummary] Forking for summary, ${X.length} messages in context`), w = new AbortController;
            let W = async () => ({
                behavior: "deny",
                message: "No tools needed for summary",
                decisionReason: {
                    type: "other",
                    reason: "summary only"
                }
            }), Z = await av({
                promptMessages: [p1({
                    content: evY(H)
                })],
                cacheSafeParams: P,
                canUseTool: W,
                querySource: "agent_summary",
                forkLabel: "agent_summary",
                overrides: {
                    abortController: w
                },
                skipTranscript: !0
            });
            if ($) return;
            for (let G of Z.messages) {
                if (G.type !== "assistant") continue;
                if (G.isApiErrorMessage) {
                    k(`[AgentSummary] Skipping API error message for ${A}`);
                    continue
                }
                let f = G.message.content.find((v) => v.type === "text");
                if (f?.type === "text" && f.text.trim()) {
                    let v = f.text.trim();
                    k(`[AgentSummary] Summary result for ${A}: ${v}`), H = v, nl4(A, v, Y);
                    break
                }
            }
        } catch (D) {
            if (!$ && D instanceof Error) _6(D)
        } finally {
            if (w = null, !$) J()
        }
    }

    function J() {
        if ($) return;
        O = setTimeout(j, tvY)
    }

    function M() {
        if (k(`[AgentSummary] Stopping summarization for ${A}`), $ = !0, O) clearTimeout(O), O = null;
        if (w) w.abort(), w = null
    }
    return J(), {
        stop: M
    }
}
// @from(Ln 332062, Col 4)
tvY = 30000
// @from(Ln 332063, Col 4)
il4 = E(() => {
    gR();
    Oq();
    nY6();
    JA();
    Vb();
    k1();
    H1()
})
// @from(Ln 332072, Col 4)
rl4 = {}
// @from(Ln 332076, Col 4)
tx8 = `
# Agent Teammate Communication

IMPORTANT: You are running as an agent in a team. To communicate with anyone on your team:
- Use the SendMessage tool with \`to: "<name>"\` to send messages to specific teammates
- Use the SendMessage tool with \`to: "*"\` sparingly for team-wide broadcasts

Just writing a response in text is not visible to others on your team - you MUST use the SendMessage tool.

The user interacts primarily with the team lead. Your work is coordinated through the task system and teammate messaging.
`
// @from(Ln 332098, Col 0)
function YNY(A) {
    return A.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()
}
// @from(Ln 332102, Col 0)
function zNY() {
    return `perm-${Date.now()}-${Math.random().toString(36).substring(2,9)}`
}
// @from(Ln 332106, Col 0)
function SN1(A) {
    let q = A.teamName || l5(),
        K = A.workerId || nM(),
        Y = A.workerName || i3(),
        z = A.workerColor || H$();
    if (!q) throw Error("Team name is required for permission requests");
    if (!K) throw Error("Worker ID is required for permission requests");
    if (!Y) throw Error("Worker name is required for permission requests");
    return {
        id: zNY(),
        workerId: K,
        workerName: Y,
        workerColor: z,
        teamName: q,
        toolName: A.toolName,
        toolUseId: A.toolUseId,
        description: A.description,
        input: A.input,
        permissionSuggestions: A.permissionSuggestions || [],
        status: "pending",
        createdAt: Date.now()
    }
}
// @from(Ln 332130, Col 0)
function _NY(A) {
    if (!(A || l5())) return !1;
    let K = nM();
    return !K || K === "team-lead"
}
// @from(Ln 332136, Col 0)
function ic6() {
    let A = l5(),
        q = nM();
    return !!A && !!q && !_NY()
}
// @from(Ln 332141, Col 0)
async function wNY(A) {
    let q = YG(),
        K = qNY(q, YNY(A), "config.json");
    try {
        let Y = await ANY(K, "utf-8");
        return i1(Y)
    } catch (Y) {
        if (Y.code === "ENOENT") return null;
        return k(`[PermissionSync] Failed to read team file for ${A}: ${_1(Y)}`), null
    }
}
// @from(Ln 332152, Col 0)
async function ol4(A) {
    let q = A || l5();
    if (!q) return null;
    let K = await wNY(q);
    if (!K) return k(`[PermissionSync] Team file not found for team: ${q}`), null;
    return K.members.find((z) => z.agentId === K.leadAgentId)?.name || "team-lead"
}
// @from(Ln 332159, Col 0)
async function CN1(A) {
    let q = await ol4(A.teamName);
    if (!q) return k("[PermissionSync] Cannot send permission request: leader name not found"), !1;
    try {
        let K = Xx8({
            request_id: A.id,
            agent_id: A.workerName,
            tool_name: A.toolName,
            tool_use_id: A.toolUseId,
            description: A.description,
            input: A.input,
            permission_suggestions: A.permissionSuggestions
        });
        return await x3(q, {
            from: A.workerName,
            text: B6(K),
            timestamp: new Date().toISOString(),
            color: A.workerColor
        }, A.teamName), k(`[PermissionSync] Sent permission request ${A.id} to leader ${q} via mailbox`), !0
    } catch (K) {
        return k(`[PermissionSync] Failed to send permission request via mailbox: ${K}`), _6(K), !1
    }
}
// @from(Ln 332182, Col 0)
async function IN1(A, q, K, Y) {
    let z = Y || l5();
    if (!z) return k("[PermissionSync] Cannot send permission response: team name not found"), !1;
    try {
        let _ = Px8({
                request_id: K,
                subtype: q.decision === "approved" ? "success" : "error",
                error: q.feedback,
                updated_input: q.updatedInput,
                permission_updates: q.permissionUpdates
            }),
            w = i3() || "team-lead";
        return await x3(A, {
            from: w,
            text: B6(_),
            timestamp: new Date().toISOString()
        }, z), k(`[PermissionSync] Sent permission response for ${K} to worker ${A} via mailbox`), !0
    } catch (_) {
        return k(`[PermissionSync] Failed to send permission response via mailbox: ${_}`), _6(_), !1
    }
}
// @from(Ln 332204, Col 0)
function al4() {
    return `sandbox-${Date.now()}-${Math.random().toString(36).substring(2,9)}`
}
// @from(Ln 332207, Col 0)
async function sl4(A, q, K) {
    let Y = K || l5();
    if (!Y) return k("[PermissionSync] Cannot send sandbox permission request: team name not found"), !1;
    let z = await ol4(Y);
    if (!z) return k("[PermissionSync] Cannot send sandbox permission request: leader name not found"), !1;
    let _ = nM(),
        w = i3(),
        O = H$();
    if (!_ || !w) return k("[PermissionSync] Cannot send sandbox permission request: worker ID or name not found"), !1;
    try {
        let $ = Wx8({
            requestId: q,
            workerId: _,
            workerName: w,
            workerColor: O,
            host: A
        });
        return await x3(z, {
            from: w,
            text: B6($),
            timestamp: new Date().toISOString(),
            color: O
        }, Y), k(`[PermissionSync] Sent sandbox permission request ${q} for host ${A} to leader ${z} via mailbox`), !0
    } catch ($) {
        return k(`[PermissionSync] Failed to send sandbox permission request via mailbox: ${$}`), _6($), !1
    }
}
// @from(Ln 332234, Col 0)
async function tl4(A, q, K, Y, z) {
    let _ = z || l5();
    if (!_) return k("[PermissionSync] Cannot send sandbox permission response: team name not found"), !1;
    try {
        let w = Zx8({
                requestId: q,
                host: K,
                allow: Y
            }),
            O = i3() || "team-lead";
        return await x3(A, {
            from: O,
            text: B6(w),
            timestamp: new Date().toISOString()
        }, _), k(`[PermissionSync] Sent sandbox permission response for ${q} (host: ${K}, allow: ${Y}) to worker ${A} via mailbox`), !0
    } catch (w) {
        return k(`[PermissionSync] Failed to send sandbox permission response via mailbox: ${w}`), _6(w), !1
    }
}
// @from(Ln 332253, Col 4)
KNY
// @from(Ln 332253, Col 9)
zxw
// @from(Ln 332254, Col 4)
Sf6 = E(() => {
    A8();
    K7();
    k1();
    H1();
    qH();
    zz();
    g1();
    s8();
    KNY = t(nx(), 1), zxw = F6(() => C.object({
        id: C.string(),
        workerId: C.string(),
        workerName: C.string(),
        workerColor: C.string().optional(),
        teamName: C.string(),
        toolName: C.string(),
        toolUseId: C.string(),
        description: C.string(),
        input: C.record(C.string(), C.unknown()),
        permissionSuggestions: C.array(C.unknown()),
        status: C.enum(["pending", "approved", "rejected"]),
        resolvedBy: C.enum(["worker", "leader"]).optional(),
        resolvedAt: C.number().optional(),
        feedback: C.string().optional(),
        updatedInput: C.unknown().optional(),
        permissionUpdates: C.array(C.unknown()).optional(),
        createdAt: C.number()
    }))
})
// @from(Ln 332284, Col 0)
function bN1(A) {
    Cf6.set(A.requestId, A), k(`[SwarmPermissionPoller] Registered callback for request ${A.requestId}`)
}
// @from(Ln 332288, Col 0)
function el4(A) {
    Cf6.delete(A), k(`[SwarmPermissionPoller] Unregistered callback for request ${A}`)
}
// @from(Ln 332292, Col 0)
function Ai4(A) {
    return Cf6.has(A)
}
// @from(Ln 332296, Col 0)
function qi4() {
    Cf6.clear(), nc6.clear()
}
// @from(Ln 332300, Col 0)
function If6(A) {
    let q = Cf6.get(A.requestId);
    if (!q) return k(`[SwarmPermissionPoller] No callback registered for mailbox response ${A.requestId}`), !1;
    if (k(`[SwarmPermissionPoller] Processing mailbox response for request ${A.requestId}: ${A.decision}`), Cf6.delete(A.requestId), A.decision === "approved") {
        let K = A.permissionUpdates || [],
            Y = A.updatedInput;
        q.onAllow(Y, K)
    } else q.onReject(A.feedback);
    return !0
}
// @from(Ln 332311, Col 0)
function Ki4(A) {
    nc6.set(A.requestId, A), k(`[SwarmPermissionPoller] Registered sandbox callback for request ${A.requestId}`)
}
// @from(Ln 332315, Col 0)
function Yi4(A) {
    return nc6.has(A)
}
// @from(Ln 332319, Col 0)
function zi4(A) {
    let q = nc6.get(A.requestId);
    if (!q) return k(`[SwarmPermissionPoller] No sandbox callback registered for request ${A.requestId}`), !1;
    return k(`[SwarmPermissionPoller] Processing sandbox response for request ${A.requestId}: allow=${A.allow}`), nc6.delete(A.requestId), q.resolve(A.allow), !0
}
// @from(Ln 332324, Col 4)
ex8
// @from(Ln 332324, Col 9)
Cf6
// @from(Ln 332324, Col 14)
nc6
// @from(Ln 332325, Col 4)
bf6 = E(() => {
    Sf6();
    zz();
    H1();
    s8();
    ex8 = t(P6(), 1), Cf6 = new Map;
    nc6 = new Map
})
// @from(Ln 332334, Col 0)
function _i4(A) {
    Au8 = A
}
// @from(Ln 332338, Col 0)
function Dl() {
    return Au8
}
// @from(Ln 332342, Col 0)
function wi4() {
    Au8 = null
}
// @from(Ln 332346, Col 0)
function Oi4(A) {
    qu8 = A
}
// @from(Ln 332350, Col 0)
function $i4() {
    return qu8
}
// @from(Ln 332354, Col 0)
function Hi4() {
    qu8 = null
}
// @from(Ln 332357, Col 4)
Au8 = null
// @from(Ln 332358, Col 4)
qu8 = null
// @from(Ln 332360, Col 0)
function $NY(A, q, K) {
    return async (Y, z, _, w, O) => {
        let $ = await tJ(Y, z, _, w, O);
        if ($.behavior !== "ask") return $;
        if (q.signal.aborted) return {
            behavior: "ask",
            message: Eb
        };
        let H = _.getAppState(),
            j = await Y.description(z, {
                isNonInteractiveSession: _.options.isNonInteractiveSession,
                toolPermissionContext: H.toolPermissionContext,
                tools: _.options.tools
            });
        if (q.signal.aborted) return {
            behavior: "ask",
            message: Eb
        };
        let J = Dl();
        if (J) return new Promise((M) => {
            let D = !1,
                X = Date.now(),
                P = () => {
                    K?.(Date.now() - X)
                },
                W = () => {
                    if (D) return;
                    D = !0, P(), M({
                        behavior: "ask",
                        message: Eb
                    }), J((Z) => Z.filter((G) => G.toolUseID !== O))
                };
            q.signal.addEventListener("abort", W, {
                once: !0
            }), J((Z) => [...Z, {
                assistantMessage: w,
                tool: Y,
                description: j,
                input: z,
                toolUseContext: _,
                toolUseID: O,
                permissionResult: $,
                permissionPromptStartTimeMs: X,
                workerBadge: A.color ? {
                    name: A.agentName,
                    color: A.color
                } : void 0,
                onUserInteraction() {},
                onAbort() {
                    if (D) return;
                    D = !0, q.signal.removeEventListener("abort", W), P(), M({
                        behavior: "ask",
                        message: Eb
                    })
                },
                async onAllow(G, f, v, N) {
                    if (D) return;
                    if (D = !0, q.signal.removeEventListener("abort", W), P(), NC(f), f.length > 0) {
                        let L = $i4();
                        if (L) {
                            let h = _.getAppState(),
                                R = _v(h.toolPermissionContext, f);
                            L(R, {
                                preserveMode: !0
                            })
                        }
                    }
                    let V = v?.trim();
                    M({
                        behavior: "allow",
                        updatedInput: G,
                        userModified: !1,
                        acceptFeedback: V || void 0,
                        ...N && N.length > 0 && {
                            contentBlocks: N
                        }
                    })
                },
                onReject(G, f) {
                    if (D) return;
                    D = !0, q.signal.removeEventListener("abort", W), P();
                    let v = G ? `${rc6}${G}` : Eb;
                    M({
                        behavior: "ask",
                        message: v,
                        contentBlocks: f
                    })
                },
                async recheckPermission() {
                    if (D) return;
                    let G = await tJ(Y, z, _, w, O);
                    if (G.behavior === "allow") D = !0, q.signal.removeEventListener("abort", W), P(), J((f) => f.filter((v) => v.toolUseID !== O)), M({
                        ...G,
                        updatedInput: z,
                        userModified: !1
                    })
                }
            }])
        });
        return new Promise((M) => {
            let D = SN1({
                toolName: Y.name,
                toolUseId: O,
                input: z,
                description: j,
                permissionSuggestions: $.suggestions,
                workerId: A.agentId,
                workerName: A.agentName,
                workerColor: A.color,
                teamName: A.teamName
            });
            bN1({
                requestId: D.id,
                toolUseId: O,
                onAllow(Z, G, f, v) {
                    W(), NC(G);
                    let N = Z && Object.keys(Z).length > 0 ? Z : z;
                    M({
                        behavior: "allow",
                        updatedInput: N,
                        userModified: !1,
                        ...v && v.length > 0 && {
                            contentBlocks: v
                        }
                    })
                },
                onReject(Z, G) {
                    W();
                    let f = Z ? `${rc6}${Z}` : Eb;
                    M({
                        behavior: "ask",
                        message: f,
                        contentBlocks: G
                    })
                }
            }), CN1(D);
            let X = setInterval(async (Z, G, f, v, N) => {
                    if (Z.signal.aborted) {
                        G(), f({
                            behavior: "ask",
                            message: Eb
                        });
                        return
                    }
                    let V = await wl(v.agentName, v.teamName);
                    for (let L = 0; L < V.length; L++) {
                        let h = V[L];
                        if (h && !h.read) {
                            let R = QY6(h.text);
                            if (R && R.request_id === N.id) {
                                if (await Vc6(v.agentName, v.teamName, L), R.subtype === "success") If6({
                                    requestId: R.request_id,
                                    decision: "approved",
                                    updatedInput: R.response?.updated_input,
                                    permissionUpdates: R.response?.permission_updates
                                });
                                else If6({
                                    requestId: R.request_id,
                                    decision: "rejected",
                                    feedback: R.error
                                });
                                return
                            }
                        }
                    }
                }, ONY, q, W, M, A, D),
                P = () => {
                    W(), M({
                        behavior: "ask",
                        message: Eb
                    })
                };
            q.signal.addEventListener("abort", P, {
                once: !0
            });

            function W() {
                clearInterval(X), el4(D.id), q.signal.removeEventListener("abort", P)
            }
        })
    }
}
// @from(Ln 332543, Col 0)
function Ku8(A, q, K, Y) {
    let z = K ? ` color="${K}"` : "",
        _ = Y ? ` summary="${Y}"` : "";
    return `<${fj} teammate_id="${A}"${z}${_}>
${q}
</${fj}>`
}
// @from(Ln 332551, Col 0)
function kb(A, q, K) {
    K((Y) => {
        let z = Y.tasks[A];
        if (!z || z.type !== "in_process_teammate") return Y;
        return {
            ...Y,
            tasks: {
                ...Y.tasks,
                [A]: q(z)
            }
        }
    })
}
// @from(Ln 332564, Col 0)
async function HNY(A, q, K, Y) {
    await x3(BY, {
        from: A,
        text: q,
        timestamp: new Date().toISOString(),
        color: K
    }, Y)
}
// @from(Ln 332572, Col 0)
async function ji4(A, q, K, Y) {
    let z = Ec6(A, Y);
    await HNY(A, B6(z), q, K)
}
// @from(Ln 332577, Col 0)
function jNY(A) {
    return new Promise((q) => setTimeout(q, A))
}
// @from(Ln 332581, Col 0)
function JNY(A) {
    let q = new Set(A.filter((K) => K.status !== "completed").map((K) => K.id));
    return A.find((K) => {
        if (K.status !== "pending") return !1;
        if (K.owner) return !1;
        return K.blockedBy.every((Y) => !q.has(Y))
    })
}
// @from(Ln 332590, Col 0)
function MNY(A) {
    let q = `Complete all open tasks. Start with task #${A.id}: 

 ${A.subject}`;
    if (A.description) q += `

${A.description}`;
    return q
}
// @from(Ln 332599, Col 0)
async function Ji4(A, q) {
    try {
        let K = await DX(A),
            Y = JNY(K);
        if (!Y) return;
        let z = await OT8(A, Y.id, q);
        if (!z.success) {
            k(`[inProcessRunner] Failed to claim task #${Y.id}: ${z.reason}`);
            return
        }
        return await WI(A, Y.id, {
            status: "in_progress"
        }), k(`[inProcessRunner] Claimed task #${Y.id}: ${Y.subject}`), MNY(Y)
    } catch (K) {
        k(`[inProcessRunner] Error checking task list: ${K}`);
        return
    }
}
// @from(Ln 332617, Col 0)
async function DNY(A, q, K, Y, z, _) {
    k(`[inProcessRunner] ${A.agentName} starting poll loop (abort=${q.signal.aborted})`);
    let O = 0;
    while (!q.signal.aborted) {
        let H = Y().tasks[K];
        if (H && H.type === "in_process_teammate" && H.pendingUserMessages.length > 0) {
            let J = H.pendingUserMessages[0];
            return z((M) => {
                let D = M.tasks[K];
                if (!D || D.type !== "in_process_teammate") return M;
                return {
                    ...M,
                    tasks: {
                        ...M.tasks,
                        [K]: {
                            ...D,
                            pendingUserMessages: D.pendingUserMessages.slice(1)
                        }
                    }
                }
            }), k(`[inProcessRunner] ${A.agentName} found pending user message (poll #${O})`), {
                type: "new_message",
                message: J,
                from: "user"
            }
        }
        if (O > 0) await jNY(500);
        if (O++, q.signal.aborted) return k(`[inProcessRunner] ${A.agentName} aborted while waiting (poll #${O})`), {
            type: "aborted"
        };
        k(`[inProcessRunner] ${A.agentName} poll #${O}: checking mailbox`);
        try {
            let J = await wl(A.agentName, A.teamName),
                M = -1,
                D = null;
            for (let P = 0; P < J.length; P++) {
                let W = J[P];
                if (W && !W.read) {
                    let Z = M66(W.text);
                    if (Z) {
                        M = P, D = Z;
                        break
                    }
                }
            }
            if (M !== -1) {
                let P = J[M],
                    W = J.slice(0, M).filter((Z) => !Z.read).length;
                return k(`[inProcessRunner] ${A.agentName} received shutdown request from ${D?.from} (prioritized over ${W} unread messages)`), await Vc6(A.agentName, A.teamName, M), {
                    type: "shutdown_request",
                    request: D,
                    originalMessage: P.text
                }
            }
            let X = -1;
            for (let P = 0; P < J.length; P++) {
                let W = J[P];
                if (W && !W.read && W.from === BY) {
                    X = P;
                    break
                }
            }
            if (X === -1) X = J.findIndex((P) => !P.read);
            if (X !== -1) {
                let P = J[X];
                if (P) return k(`[inProcessRunner] ${A.agentName} received new message from ${P.from} (index ${X})`), await Vc6(A.agentName, A.teamName, X), {
                    type: "new_message",
                    message: P.text,
                    from: P.from,
                    color: P.color,
                    summary: P.summary
                }
            }
        } catch (J) {
            k(`[inProcessRunner] ${A.agentName} poll error: ${J}`)
        }
        let j = await Ji4(_, A.agentName);
        if (j) return {
            type: "new_message",
            message: j,
            from: "task-list"
        }
    }
    return k(`[inProcessRunner] ${A.agentName} exiting poll loop (abort=${q.signal.aborted}, polls=${O})`), {
        type: "aborted"
    }
}
// @from(Ln 332704, Col 0)
async function XNY(A) {
    let {
        identity: q,
        taskId: K,
        prompt: Y,
        description: z,
        agentDefinition: _,
        teammateContext: w,
        toolUseContext: O,
        abortController: $,
        model: H,
        systemPrompt: j,
        systemPromptMode: J,
        allowedTools: M,
        allowPermissionPrompts: D
    } = A, {
        setAppState: X
    } = O;
    k(`[inProcessRunner] Starting agent loop for ${q.agentId}`);
    let P = {
            agentId: q.agentId,
            parentSessionId: q.parentSessionId,
            agentName: q.agentName,
            teamName: q.teamName,
            agentColor: q.color,
            planModeRequired: q.planModeRequired,
            isTeamLead: !1,
            agentType: "teammate"
        },
        W;
    if (J === "replace" && j) W = j;
    else {
        let L = [...await R0(O.options.tools, O.options.mainLoopModel, void 0, O.options.mcpClients), tx8];
        if (_) {
            let h = _.getSystemPrompt();
            if (h) L.push(`
# Custom Agent Instructions
${h}`);
            if (_.memory) d("tengu_agent_memory_loaded", {
                ...{},
                scope: _.memory,
                source: "in-process-teammate"
            })
        }
        if (J === "append" && j) L.push(j);
        W = L.join(`
`)
    }
    let Z = {
            agentType: q.agentName,
            whenToUse: `In-process teammate: ${q.agentName}`,
            getSystemPrompt: () => W,
            tools: _?.tools ? [...new Set([..._.tools, hI, SI, l36, TR, lt, it, ck])] : ["*"],
            source: "projectSettings",
            permissionMode: "default",
            ..._?.model ? {
                model: _.model
            } : {}
        },
        G = [],
        f = Ku8("team-lead", Y, void 0, z),
        v = f,
        N = !1;
    await Ji4(q.parentSessionId, q.agentName);
    try {
        kb(K, (V) => ({
            ...V,
            messages: [...V.messages ?? [], p1({
                content: f
            })]
        }), X);
        while (!$.signal.aborted && !N) {
            k(`[inProcessRunner] ${q.agentId} processing prompt: ${v.substring(0,50)}...`);
            let V = sK();
            kb(K, (s) => ({
                ...s,
                currentWorkAbortController: V
            }), X);
            let L = p1({
                    content: v
                }),
                h = [L],
                R = G,
                u = eW(G);
            if (u > oc6(O.options.mainLoopModel)) {
                k(`[inProcessRunner] ${q.agentId} compacting history (${u} tokens)`);
                let s = {
                        ...O,
                        readFileState: DI(O.readFileState),
                        onCompactProgress: void 0,
                        setStreamMode: void 0
                    },
                    X6 = await mf6(G, s, {
                        systemPrompt: uq([]),
                        userContext: {},
                        systemContext: {},
                        toolUseContext: s,
                        forkContextMessages: []
                    }, !0, void 0, !0);
                R = jl(X6), W66(), G.length = 0, G.push(...R), kb(K, (z6) => ({
                    ...z6,
                    messages: [...R, L]
                }), X)
            }
            let I = R.length > 0 ? [...R] : void 0;
            G.push(L);
            let g = xf6(),
                B = uf6(O.options.tools),
                b = [],
                Q = O.getAppState().tasks[K],
                U = Q && Q.type === "in_process_teammate" ? Q.permissionMode : "default",
                r = {
                    ...Z,
                    permissionMode: U
                },
                e = !1;
            if (await UD1(w, async () => {
                    return X66(P, async () => {
                        kb(K, (s) => ({
                            ...s,
                            status: "running",
                            isIdle: !1
                        }), X);
                        for await (let s of qh({
                            agentDefinition: r,
                            promptMessages: h,
                            toolUseContext: O,
                            canUseTool: $NY(q, V, (X6) => {
                                kb(K, (z6) => ({
                                    ...z6,
                                    totalPausedMs: (z6.totalPausedMs ?? 0) + X6
                                }), X)
                            }),
                            isAsync: !0,
                            canShowPermissionPrompts: D ?? !0,
                            forkContextMessages: I,
                            querySource: "agent:custom",
                            override: {
                                abortController: V
                            },
                            model: H,
                            preserveToolUseResults: !0,
                            availableTools: O.options.tools,
                            allowedTools: M
                        })) {
                            if ($.signal.aborted) {
                                k(`[inProcessRunner] ${q.agentId} lifecycle aborted`);
                                break
                            }
                            if (V.signal.aborted) {
                                k(`[inProcessRunner] ${q.agentId} current work aborted (Escape pressed)`), e = !0;
                                break
                            }
                            b.push(s), G.push(s), Az6(g, s, B, O.options.tools);
                            let X6 = v66(g);
                            kb(K, (z6) => {
                                let N6 = z6.inProgressToolUseIDs;
                                if (s.type === "assistant") {
                                    for (let $6 of s.message.content)
                                        if ($6.type === "tool_use") N6 = new Set([...N6 ?? [], $6.id])
                                } else if (s.type === "user") {
                                    let $6 = s.message.content;
                                    if (Array.isArray($6)) {
                                        for (let n of $6)
                                            if (typeof n === "object" && "type" in n && n.type === "tool_result") {
                                                if (N6) N6 = new Set(N6), N6.delete(n.tool_use_id)
                                            }
                                    }
                                }
                                return {
                                    ...z6,
                                    progress: X6,
                                    messages: [...z6.messages ?? [], s],
                                    inProgressToolUseIDs: N6
                                }
                            }, X)
                        }
                        return {
                            success: !0,
                            messages: b
                        }
                    })
                }), kb(K, (s) => ({
                    ...s,
                    currentWorkAbortController: void 0
                }), X), $.signal.aborted) break;
            if (e) {
                k(`[inProcessRunner] ${q.agentId} work interrupted, returning to idle`);
                let s = y9({
                    content: zl
                });
                kb(K, (X6) => ({
                    ...X6,
                    messages: [...X6.messages ?? [], s]
                }), X)
            }
            let H6 = O.getAppState().tasks[K],
                J6 = H6?.type === "in_process_teammate" && H6.isIdle;
            if (kb(K, (s) => {
                    return s.onIdleCallbacks?.forEach((X6) => X6()), {
                        ...s,
                        isIdle: !0,
                        onIdleCallbacks: []
                    }
                }, X), !J6) await ji4(q.agentName, q.color, q.teamName, {
                idleReason: e ? "interrupted" : "available",
                summary: hc6(G)
            });
            else k(`[inProcessRunner] Skipping duplicate idle notification for ${q.agentName}`);
            k(`[inProcessRunner] ${q.agentId} finished prompt, waiting for next`);
            let K6 = await DNY(q, $, K, O.getAppState, X, q.parentSessionId);
            switch (K6.type) {
                case "shutdown_request":
                    k(`[inProcessRunner] ${q.agentId} received shutdown request - passing to model`), v = Ku8(K6.request?.from || "team-lead", K6.originalMessage), uZ1(K, p1({
                        content: v
                    }), X);
                    break;
                case "new_message":
                    if (k(`[inProcessRunner] ${q.agentId} received new message from ${K6.from}`), K6.from === "user") v = K6.message;
                    else v = Ku8(K6.from, K6.message, K6.color, K6.summary), uZ1(K, p1({
                        content: v
                    }), X);
                    break;
                case "aborted":
                    k(`[inProcessRunner] ${q.agentId} aborted while waiting`), N = !0;
                    break
            }
        }
        return kb(K, (V) => {
            return V.onIdleCallbacks?.forEach((L) => L()), V.unregisterCleanup?.(), {
                ...V,
                status: "completed",
                notified: !0,
                endTime: Date.now(),
                messages: V.messages?.length ? [V.messages[V.messages.length - 1]] : void 0,
                pendingUserMessages: [],
                inProgressToolUseIDs: void 0,
                abortController: void 0,
                unregisterCleanup: void 0,
                currentWorkAbortController: void 0,
                onIdleCallbacks: []
            }
        }, X), $O(K), VR(K, X), a36(q.agentId), {
            success: !0,
            messages: G
        }
    } catch (V) {
        let L = V instanceof Error ? V.message : "Unknown error";
        return k(`[inProcessRunner] Agent ${q.agentId} failed: ${L}`), kb(K, (h) => {
            return h.onIdleCallbacks?.forEach((R) => R()), h.unregisterCleanup?.(), {
                ...h,
                status: "failed",
                notified: !0,
                error: L,
                isIdle: !0,
                endTime: Date.now(),
                onIdleCallbacks: [],
                messages: h.messages?.length ? [h.messages[h.messages.length - 1]] : void 0,
                pendingUserMessages: [],
                inProgressToolUseIDs: void 0,
                abortController: void 0,
                unregisterCleanup: void 0,
                currentWorkAbortController: void 0
            }
        }, X), $O(K), VR(K, X), await ji4(q.agentName, q.color, q.teamName, {
            idleReason: "failed",
            completedStatus: "failed",
            failureReason: L
        }), a36(q.agentId), {
            success: !1,
            error: L,
            messages: G
        }
    }
}
// @from(Ln 332980, Col 0)
function xN1(A) {
    let q = A.identity.agentId;
    XNY(A).catch((K) => {
        k(`[inProcessRunner] Unhandled error in ${q}: ${K}`)
    })
}
// @from(Ln 332986, Col 4)
ONY = 500
// @from(Ln 332987, Col 4)
Yu8 = E(() => {
    sk();
    nY6();
    jE();
    vz();
    qZ();
    P66();
    H1();
    V1();
    qH();
    Bw();
    SM();
    O0();
    Vb();
    JA();
    AZ();
    Xl();
    _l();
    eR();
    Bj();
    F$();
    g1();
    U$();
    Sf6();
    bf6();
    F$();
    JA();
    JZ();
    tP();
    gW6()
})
// @from(Ln 333018, Col 0)
class Mi4 {
    type = "in-process";
    context = null;
    setContext(A) {
        this.context = A
    }
    async isAvailable() {
        return !0
    }
    async spawn(A) {
        if (!this.context) return k(`[InProcessBackend] spawn() called without context for ${A.name}`), {
            success: !1,
            agentId: `${A.name}@${A.teamName}`,
            error: "InProcessBackend not initialized. Call setContext() before spawn()."
        };
        k(`[InProcessBackend] spawn() called for ${A.name}`);
        let q = await mZ6({
            name: A.name,
            teamName: A.teamName,
            prompt: A.prompt,
            color: A.color,
            planModeRequired: A.planModeRequired ?? !1
        }, this.context);
        if (q.success && q.taskId && q.teammateContext && q.abortController) xN1({
            identity: {
                agentId: q.agentId,
                agentName: A.name,
                teamName: A.teamName,
                color: A.color,
                planModeRequired: A.planModeRequired ?? !1,
                parentSessionId: q.teammateContext.parentSessionId
            },
            taskId: q.taskId,
            prompt: A.prompt,
            teammateContext: q.teammateContext,
            toolUseContext: {
                ...this.context,
                messages: []
            },
            abortController: q.abortController,
            model: A.model,
            systemPrompt: A.systemPrompt,
            systemPromptMode: A.systemPromptMode,
            allowedTools: A.permissions,
            allowPermissionPrompts: A.allowPermissionPrompts
        }), k(`[InProcessBackend] Started agent execution for ${q.agentId}`);
        return {
            success: q.success,
            agentId: q.agentId,
            taskId: q.taskId,
            abortController: q.abortController,
            error: q.error
        }
    }
    async sendMessage(A, q) {
        k(`[InProcessBackend] sendMessage() to ${A}: ${q.text.substring(0,50)}...`);
        let K = oQ6(A);
        if (!K) throw k(`[InProcessBackend] Invalid agentId format: ${A}`), Error(`Invalid agentId format: ${A}. Expected format: agentName@teamName`);
        let {
            agentName: Y,
            teamName: z
        } = K;
        await x3(Y, {
            text: q.text,
            from: q.from,
            color: q.color,
            timestamp: q.timestamp ?? new Date().toISOString()
        }, z), k(`[InProcessBackend] sendMessage() completed for ${A}`)
    }
    async terminate(A, q) {
        if (k(`[InProcessBackend] terminate() called for ${A}: ${q}`), !this.context) return k(`[InProcessBackend] terminate() failed: no context set for ${A}`), !1;
        let K = this.context.getAppState(),
            Y = _g(A, K.tasks);
        if (!Y) return k(`[InProcessBackend] terminate() failed: task not found for ${A}`), !1;
        if (Y.shutdownRequested) return k(`[InProcessBackend] terminate(): shutdown already requested for ${A}`), !0;
        let z = `shutdown-${A}-${Date.now()}`,
            _ = Wf6({
                requestId: z,
                from: "team-lead",
                reason: q
            }),
            w = Y.identity.agentName;
        return await x3(w, {
            from: "team-lead",
            text: JSON.stringify(_),
            timestamp: new Date().toISOString()
        }, Y.identity.teamName), YL8(Y.id, this.context.setAppState), k(`[InProcessBackend] terminate() sent shutdown request to ${A}`), !0
    }
    async kill(A) {
        if (k(`[InProcessBackend] kill() called for ${A}`), !this.context) return k(`[InProcessBackend] kill() failed: no context set for ${A}`), !1;
        let q = this.context.getAppState(),
            K = _g(A, q.tasks);
        if (!K) return k(`[InProcessBackend] kill() failed: task not found for ${A}`), !1;
        if (K.localTaskId) await sD1(K.identity.teamName, K.localTaskId);
        let Y = bZ1(K.id, this.context.setAppState);
        return k(`[InProcessBackend] kill() ${Y?"succeeded":"failed"} for ${A}`), Y
    }
    async isActive(A) {
        if (k(`[InProcessBackend] isActive() called for ${A}`), !this.context) return k(`[InProcessBackend] isActive() failed: no context set for ${A}`), !1;
        let q = this.context.getAppState(),
            K = _g(A, q.tasks);
        if (!K) return k(`[InProcessBackend] isActive(): task not found for ${A}`), !1;
        let Y = K.status === "running",
            z = K.abortController?.signal.aborted ?? !0,
            _ = Y && !z;
        return k(`[InProcessBackend] isActive() for ${A}: ${_} (running=${Y}, aborted=${z})`), _
    }
}
// @from(Ln 333127, Col 0)
function Di4() {
    return new Mi4
}
// @from(Ln 333130, Col 4)
Xi4 = E(() => {
    H1();
    xZ1();
    Yu8();
    sk();
    qH();
    Bw()
})
// @from(Ln 333138, Col 4)
Wi4 = {}
// @from(Ln 333150, Col 0)
function uN1() {
    return !!Pi4
}
// @from(Ln 333153, Col 0)
async function yb() {
    if (ac6 !== null) return ac6;
    return ac6 = !!Pi4, ac6
}
// @from(Ln 333158, Col 0)
function mN1() {
    return PNY || null
}
// @from(Ln 333161, Col 0)
async function N66() {
    return (await z8(yZ, ["-V"])).code === 0
}
// @from(Ln 333165, Col 0)
function V66() {
    if (sc6 !== null) return sc6;
    let A = process.env.TERM_PROGRAM,
        q = !!process.env.ITERM_SESSION_ID,
        K = Q8.terminal === "iTerm.app";
    return sc6 = A === "iTerm.app" || q || K, sc6
}
// @from(Ln 333172, Col 0)
async function tc6() {
    return (await z8(BN1, ["--version"])).code === 0
}
// @from(Ln 333176, Col 0)
function WNY() {
    ac6 = null, sc6 = null
}
// @from(Ln 333179, Col 4)
Pi4
// @from(Ln 333179, Col 9)
PNY
// @from(Ln 333179, Col 14)
ac6 = null
// @from(Ln 333180, Col 4)
sc6 = null
// @from(Ln 333181, Col 4)
BN1 = "it2"
// @from(Ln 333182, Col 4)
ig = E(() => {
    d3();
    Eq();
    Pi4 = process.env.TMUX, PNY = process.env.TMUX_PANE
})
// @from(Ln 333187, Col 4)
wu8 = {}
// @from(Ln 333196, Col 0)
function ZNY(A) {
    ec6 = A
}
// @from(Ln 333200, Col 0)
function zu8() {
    return ec6
}
// @from(Ln 333204, Col 0)
function _u8(A) {
    ec6 = null, qz6 = A, k(`[TeammateModeSnapshot] CLI override cleared, new mode: ${A}`)
}
// @from(Ln 333208, Col 0)
function Zi4() {
    if (ec6) qz6 = ec6, k(`[TeammateModeSnapshot] Captured from CLI override: ${qz6}`);
    else qz6 = X1().teammateMode ?? "auto", k(`[TeammateModeSnapshot] Captured from config: ${qz6}`)
}
// @from(Ln 333213, Col 0)
function Al6() {
    if (qz6 === null) _6(Error("getTeammateModeFromSnapshot called before capture - this indicates an initialization bug")), Zi4();
    return qz6 ?? "auto"
}
// @from(Ln 333217, Col 4)
qz6 = null
// @from(Ln 333218, Col 4)
ec6 = null
// @from(Ln 333219, Col 4)
Bf6 = E(() => {
    k8();
    H1();
    k1()
})
// @from(Ln 333225, Col 0)
function Gi4() {
    if (process.env[Df6]) return process.env[Df6];
    return rY() ? process.execPath : process.argv[1]
}
// @from(Ln 333230, Col 0)
function fi4(A) {
    let q = [],
        {
            planModeRequired: K,
            permissionMode: Y
        } = A || {};
    if (K);
    else if (Y === "bypassPermissions" || qA6()) q.push("--dangerously-skip-permissions");
    else if (Y === "acceptEdits") q.push("--permission-mode acceptEdits");
    let z = HS();
    if (z) q.push(`--model ${j4([z])}`);
    let _ = kn();
    if (_) q.push(`--settings ${j4([_])}`);
    let w = AA6();
    for (let H of w) q.push(`--plugin-dir ${j4([H])}`);
    let O = Al6();
    q.push(`--teammate-mode ${O}`);
    let $ = Qk6();
    if ($ === !0) q.push("--chrome");
    else if ($ === !1) q.push("--no-chrome");
    return q.join(" ")
}
// @from(Ln 333253, Col 0)
function ql6() {
    let A = ["CLAUDECODE=1", "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1"];
    for (let q of GNY) {
        let K = process.env[q];
        if (K !== void 0 && K !== "") A.push(`${q}=${j4([K])}`)
    }
    return A.join(" ")
}
// @from(Ln 333261, Col 4)
GNY
// @from(Ln 333262, Col 4)
Ou8 = E(() => {
    RJ();
    T1();
    Bf6();
    GNY = ["CLAUDE_CODE_USE_BEDROCK", "CLAUDE_CODE_USE_VERTEX", "CLAUDE_CODE_USE_FOUNDRY", "ANTHROPIC_BASE_URL", "CLAUDE_CONFIG_DIR"]
})
// @from(Ln 333268, Col 0)
class Ti4 {
    type;
    backend;
    context = null;
    spawnedTeammates;
    cleanupRegistered = !1;
    constructor(A) {
        this.backend = A, this.type = A.type, this.spawnedTeammates = new Map
    }
    setContext(A) {
        this.context = A
    }
    async isAvailable() {
        return this.backend.isAvailable()
    }
    async spawn(A) {
        let q = ak(A.name, A.teamName);
        if (!this.context) return k(`[PaneBackendExecutor] spawn() called without context for ${A.name}`), {
            success: !1,
            agentId: q,
            error: "PaneBackendExecutor not initialized. Call setContext() before spawn()."
        };
        try {
            let K = A.color ?? Pl(q),
                {
                    paneId: Y,
                    isFirstTeammate: z
                } = await this.backend.createTeammatePaneInSwarmView(A.name, K),
                _ = await yb();
            if (z && _) await this.backend.enablePaneBorderStatus();
            let w = Gi4(),
                O = [`--agent-id ${j4([q])}`, `--agent-name ${j4([A.name])}`, `--team-name ${j4([A.teamName])}`, `--agent-color ${j4([K])}`, `--parent-session-id ${j4([A.parentSessionId||R1()])}`, A.planModeRequired ? "--plan-mode-required" : ""].filter(Boolean).join(" "),
                $ = this.context.getAppState(),
                H = fi4({
                    planModeRequired: A.planModeRequired,
                    permissionMode: $.toolPermissionContext.mode
                });
            if (A.model) H = H.split(" ").filter((X, P, W) => X !== "--model" && W[P - 1] !== "--model").join(" "), H = H ? `${H} --model ${j4([A.model])}` : `--model ${j4([A.model])}`;
            let j = H ? ` ${H}` : "",
                J = A.cwd,
                M = ql6(),
                D = `cd ${j4([J])} && env ${M} ${j4([w])} ${O}${j}`;
            if (await this.backend.sendCommandToPane(Y, D, !_), this.spawnedTeammates.set(q, {
                    paneId: Y,
                    insideTmux: _
                }), !this.cleanupRegistered) this.cleanupRegistered = !0, E4(async () => {
                for (let [X, P] of this.spawnedTeammates) k(`[PaneBackendExecutor] Cleanup: killing pane for ${X}`), await this.backend.killPane(P.paneId, !P.insideTmux);
                this.spawnedTeammates.clear()
            });
            return await x3(A.name, {
                from: "team-lead",
                text: A.prompt,
                timestamp: new Date().toISOString()
            }, A.teamName), k(`[PaneBackendExecutor] Spawned teammate ${q} in pane ${Y}`), {
                success: !0,
                agentId: q,
                paneId: Y
            }
        } catch (K) {
            let Y = K instanceof Error ? K.message : String(K);
            return k(`[PaneBackendExecutor] Failed to spawn ${q}: ${Y}`), {
                success: !1,
                agentId: q,
                error: Y
            }
        }
    }
    async sendMessage(A, q) {
        k(`[PaneBackendExecutor] sendMessage() to ${A}: ${q.text.substring(0,50)}...`);
        let K = oQ6(A);
        if (!K) throw Error(`Invalid agentId format: ${A}. Expected format: agentName@teamName`);
        let {
            agentName: Y,
            teamName: z
        } = K;
        await x3(Y, {
            text: q.text,
            from: q.from,
            color: q.color,
            timestamp: q.timestamp ?? new Date().toISOString()
        }, z), k(`[PaneBackendExecutor] sendMessage() completed for ${A}`)
    }
    async terminate(A, q) {
        k(`[PaneBackendExecutor] terminate() called for ${A}: ${q}`);
        let K = oQ6(A);
        if (!K) return k("[PaneBackendExecutor] terminate() failed: invalid agentId format"), !1;
        let {
            agentName: Y,
            teamName: z
        } = K, _ = {
            type: "shutdown_request",
            requestId: `shutdown-${A}-${Date.now()}`,
            from: "team-lead",
            reason: q
        };
        return await x3(Y, {
            from: "team-lead",
            text: B6(_),
            timestamp: new Date().toISOString()
        }, z), k(`[PaneBackendExecutor] terminate() sent shutdown request to ${A}`), !0
    }
    async kill(A) {
        k(`[PaneBackendExecutor] kill() called for ${A}`);
        let q = this.spawnedTeammates.get(A);
        if (!q) return k(`[PaneBackendExecutor] kill() failed: teammate ${A} not found in spawned map`), !1;
        let {
            paneId: K,
            insideTmux: Y
        } = q, z = await this.backend.killPane(K, !Y);
        if (z) this.spawnedTeammates.delete(A), k(`[PaneBackendExecutor] kill() succeeded for ${A}`);
        else k(`[PaneBackendExecutor] kill() failed for ${A}`);
        return z
    }
    async isActive(A) {
        if (k(`[PaneBackendExecutor] isActive() called for ${A}`), !this.spawnedTeammates.get(A)) return k(`[PaneBackendExecutor] isActive(): teammate ${A} not found`), !1;
        return !0
    }
}
// @from(Ln 333387, Col 0)
function vi4(A) {
    return new Ti4(A)
}
// @from(Ln 333390, Col 4)
Ni4 = E(() => {
    H1();
    KY();
    qH();
    Kl6();
    ig();
    RJ();
    T1();
    Ou8();
    g1()
})
// @from(Ln 333404, Col 0)
async function Vi4() {
    if ((await z8("which", ["uv"])).code === 0) return k("[it2Setup] Found uv (will use uv tool install)"), "uvx";
    if ((await z8("which", ["pipx"])).code === 0) return k("[it2Setup] Found pipx package manager"), "pipx";
    if ((await z8("which", ["pip"])).code === 0) return k("[it2Setup] Found pip package manager"), "pip";
    if ((await z8("which", ["pip3"])).code === 0) return k("[it2Setup] Found pip3 package manager"), "pip";
    return k("[it2Setup] No Python package manager found"), null
}
// @from(Ln 333411, Col 0)
async function fNY() {
    return (await z8("which", ["it2"])).code === 0
}
// @from(Ln 333414, Col 0)
async function ki4(A) {
    k(`[it2Setup] Installing it2 using ${A}`);
    let q;
    switch (A) {
        case "uvx":
            q = await RA("uv", ["tool", "install", "it2"], {
                cwd: gN1()
            });
            break;
        case "pipx":
            q = await RA("pipx", ["install", "it2"], {
                cwd: gN1()
            });
            break;
        case "pip":
            if (q = await RA("pip", ["install", "--user", "it2"], {
                    cwd: gN1()
                }), q.code !== 0) q = await RA("pip3", ["install", "--user", "it2"], {
                cwd: gN1()
            });
            break
    }
    if (q.code !== 0) {
        let K = q.stderr || "Unknown installation error";
        return _6(Error(`[it2Setup] Failed to install it2: ${K}`)), {
            success: !1,
            error: K,
            packageManager: A
        }
    }
    return k("[it2Setup] it2 installed successfully"), {
        success: !0,
        packageManager: A
    }
}
// @from(Ln 333449, Col 0)
async function $u8() {
    if (k("[it2Setup] Verifying it2 setup..."), !await fNY()) return {
        success: !1,
        error: "it2 CLI is not installed or not in PATH"
    };
    let q = await z8("it2", ["session", "list"]);
    if (q.code !== 0) {
        let K = q.stderr.toLowerCase();
        if (K.includes("api") || K.includes("python") || K.includes("connection refused") || K.includes("not enabled")) return k("[it2Setup] Python API not enabled in iTerm2"), {
            success: !1,
            error: "Python API not enabled in iTerm2 preferences",
            needsPythonApiEnabled: !0
        };
        return {
            success: !1,
            error: q.stderr || "Failed to communicate with iTerm2"
        }
    }
    return k("[it2Setup] it2 setup verified successfully"), {
        success: !0
    }
}
// @from(Ln 333472, Col 0)
function Ei4() {
    return ["Almost done! Enable the Python API in iTerm2:", "", "  iTerm2 → Settings → General → Magic → Enable Python API", "", "After enabling, you may need to restart iTerm2."]
}
// @from(Ln 333476, Col 0)
function Hu8() {
    if (X1().iterm2It2SetupComplete !== !0) d1((q) => ({
        ...q,
        iterm2It2SetupComplete: !0
    })), k("[it2Setup] Marked it2 setup as complete")
}
// @from(Ln 333483, Col 0)
function yi4(A) {
    if (X1().preferTmuxOverIterm2 !== A) d1((K) => ({
        ...K,
        preferTmuxOverIterm2: A
    })), k(`[it2Setup] Set preferTmuxOverIterm2 = ${A}`)
}
// @from(Ln 333490, Col 0)
function Li4() {
    return X1().preferTmuxOverIterm2 === !0
}
// @from(Ln 333493, Col 4)
ju8 = E(() => {
    Eq();
    H1();
    k1();
    k8()
})
// @from(Ln 333499, Col 4)
Ii4 = {}
// @from(Ln 333504, Col 0)
function Si4() {
    return new Promise((A) => setTimeout(A, TNY))
}
// @from(Ln 333508, Col 0)
function vNY() {
    let A, q = new Promise((Y) => {
            A = Y
        }),
        K = hi4;
    return hi4 = q, K.then(() => A)
}
// @from(Ln 333516, Col 0)
function Ci4(A) {
    return {
        red: "red",
        blue: "blue",
        green: "green",
        yellow: "yellow",
        purple: "magenta",
        orange: "colour208",
        pink: "colour205",
        cyan: "cyan"
    } [A]
}
// @from(Ln 333529, Col 0)
function Lb(A) {
    return z8(yZ, A)
}
// @from(Ln 333533, Col 0)
function h0(A) {
    return z8(yZ, ["-L", Mf6(), ...A])
}
// @from(Ln 333536, Col 0)
class Ju8 {
    type = "tmux";
    displayName = "tmux";
    supportsHideShow = !0;
    async isAvailable() {
        return N66()
    }
    async isRunningInside() {
        return yb()
    }
    async createTeammatePaneInSwarmView(A, q) {
        let K = await vNY();
        try {
            if (await this.isRunningInside()) return await this.createTeammatePaneWithLeader(A, q);
            return await this.createTeammatePaneExternal(A, q)
        } finally {
            K()
        }
    }
    async sendCommandToPane(A, q, K = !1) {
        let z = await (K ? h0 : Lb)(["send-keys", "-t", A, q, "Enter"]);
        if (z.code !== 0) throw Error(`Failed to send command to pane ${A}: ${z.stderr}`)
    }
    async setPaneBorderColor(A, q, K = !1) {
        let Y = Ci4(q),
            z = K ? h0 : Lb;
        await z(["select-pane", "-t", A, "-P", `bg=default,fg=${Y}`]), await z(["set-option", "-p", "-t", A, "pane-border-style", `fg=${Y}`]), await z(["set-option", "-p", "-t", A, "pane-active-border-style", `fg=${Y}`])
    }
    async setPaneTitle(A, q, K, Y = !1) {
        let z = Ci4(K),
            _ = Y ? h0 : Lb;
        await _(["select-pane", "-t", A, "-T", q]), await _(["set-option", "-p", "-t", A, "pane-border-format", `#[fg=${z},bold] #{pane_title} #[default]`])
    }
    async enablePaneBorderStatus(A, q = !1) {
        let K = A || await this.getCurrentWindowTarget();
        if (!K) return;
        await (q ? h0 : Lb)(["set-option", "-w", "-t", K, "pane-border-status", "top"])
    }
    async rebalancePanes(A, q) {
        if (q) await this.rebalancePanesWithLeader(A);
        else await this.rebalancePanesTiled(A)
    }
    async killPane(A, q = !1) {
        return (await (q ? h0 : Lb)(["kill-pane", "-t", A])).code === 0
    }
    async hidePane(A, q = !1) {
        let K = q ? h0 : Lb;
        await K(["new-session", "-d", "-s", $x8]);
        let Y = await K(["break-pane", "-d", "-s", A, "-t", `${$x8}:`]);
        if (Y.code === 0) k(`[TmuxBackend] Hidden pane ${A}`);
        else k(`[TmuxBackend] Failed to hide pane ${A}: ${Y.stderr}`);
        return Y.code === 0
    }
    async showPane(A, q, K = !1) {
        let Y = K ? h0 : Lb,
            z = await Y(["join-pane", "-h", "-s", A, "-t", q]);
        if (z.code !== 0) return k(`[TmuxBackend] Failed to show pane ${A}: ${z.stderr}`), !1;
        k(`[TmuxBackend] Showed pane ${A} in ${q}`), await Y(["select-layout", "-t", q, "main-vertical"]);
        let w = (await Y(["list-panes", "-t", q, "-F", "#{pane_id}"])).stdout.trim().split(`
`).filter(Boolean);
        if (w[0]) await Y(["resize-pane", "-t", w[0], "-x", "30%"]);
        return !0
    }
    async getCurrentPaneId() {
        let A = mN1();
        if (A) return A;
        let q = await z8(yZ, ["display-message", "-p", "#{pane_id}"]);
        if (q.code !== 0) return k(`[TmuxBackend] Failed to get current pane ID (exit ${q.code}): ${q.stderr}`), null;
        return q.stdout.trim()
    }
    async getCurrentWindowTarget() {
        if (FN1) return FN1;
        let A = mN1(),
            q = ["display-message"];
        if (A) q.push("-t", A);
        q.push("-p", "#{session_name}:#{window_index}");
        let K = await z8(yZ, q);
        if (K.code !== 0) return k(`[TmuxBackend] Failed to get current window target (exit ${K.code}): ${K.stderr}`), null;
        return FN1 = K.stdout.trim(), FN1
    }
    async getCurrentWindowPaneCount(A, q = !1) {
        let K = A || await this.getCurrentWindowTarget();
        if (!K) return null;
        let Y = ["list-panes", "-t", K, "-F", "#{pane_id}"],
            z = q ? await h0(Y) : await Lb(Y);
        if (z.code !== 0) return _6(Error(`[TmuxBackend] Failed to get pane count for ${K} (exit ${z.code}): ${z.stderr}`)), null;
        return z.stdout.trim().split(`
`).filter(Boolean).length
    }
    async hasSessionInSwarm(A) {
        return (await h0(["has-session", "-t", A])).code === 0
    }
    async createExternalSwarmSession() {
        if (!await this.hasSessionInSwarm($N)) {
            let _ = await h0(["new-session", "-d", "-s", $N, "-n", Jf6, "-P", "-F", "#{pane_id}"]);
            if (_.code !== 0) throw Error(`Failed to create swarm session: ${_.stderr||"Unknown error"}`);
            let w = _.stdout.trim(),
                O = `${$N}:${Jf6}`;
            return k(`[TmuxBackend] Created external swarm session with window ${O}, pane ${w}`), {
                windowTarget: O,
                paneId: w
            }
        }
        let K = (await h0(["list-windows", "-t", $N, "-F", "#{window_name}"])).stdout.trim().split(`
`).filter(Boolean),
            Y = `${$N}:${Jf6}`;
        if (K.includes(Jf6)) {
            let w = (await h0(["list-panes", "-t", Y, "-F", "#{pane_id}"])).stdout.trim().split(`
`).filter(Boolean);
            return {
                windowTarget: Y,
                paneId: w[0] || ""
            }
        }
        let z = await h0(["new-window", "-t", $N, "-n", Jf6, "-P", "-F", "#{pane_id}"]);
        if (z.code !== 0) throw Error(`Failed to create swarm-view window: ${z.stderr||"Unknown error"}`);
        return {
            windowTarget: Y,
            paneId: z.stdout.trim()
        }
    }
    async createTeammatePaneWithLeader(A, q) {
        let K = await this.getCurrentPaneId(),
            Y = await this.getCurrentWindowTarget();
        if (!K || !Y) throw Error("Could not determine current tmux pane/window");
        let z = await this.getCurrentWindowPaneCount(Y);
        if (z === null) throw Error("Could not determine pane count for current window");
        let _ = z === 1,
            w;
        if (_) w = await z8(yZ, ["split-window", "-t", K, "-h", "-l", "70%", "-P", "-F", "#{pane_id}"]);
        else {
            let j = (await z8(yZ, ["list-panes", "-t", Y, "-F", "#{pane_id}"])).stdout.trim().split(`
`).filter(Boolean).slice(1),
                J = j.length,
                M = J % 2 === 1,
                D = Math.floor((J - 1) / 2),
                X = j[D] || j[j.length - 1];
            w = await z8(yZ, ["split-window", "-t", X, M ? "-v" : "-h", "-P", "-F", "#{pane_id}"])
        }
        if (w.code !== 0) throw Error(`Failed to create teammate pane: ${w.stderr}`);
        let O = w.stdout.trim();
        return k(`[TmuxBackend] Created teammate pane for ${A}: ${O}`), await this.setPaneBorderColor(O, q), await this.setPaneTitle(O, A, q), await this.rebalancePanesWithLeader(Y), await Si4(), {
            paneId: O,
            isFirstTeammate: _
        }
    }
    async createTeammatePaneExternal(A, q) {
        let {
            windowTarget: K,
            paneId: Y
        } = await this.createExternalSwarmSession(), z = await this.getCurrentWindowPaneCount(K, !0);
        if (z === null) throw Error("Could not determine pane count for swarm window");
        let _ = !Ri4 && z === 1,
            w;
        if (_) w = Y, Ri4 = !0, k(`[TmuxBackend] Using initial pane for first teammate ${A}: ${w}`), await this.enablePaneBorderStatus(K, !0);
        else {
            let $ = (await h0(["list-panes", "-t", K, "-F", "#{pane_id}"])).stdout.trim().split(`
`).filter(Boolean),
                H = $.length,
                j = H % 2 === 1,
                J = Math.floor((H - 1) / 2),
                M = $[J] || $[$.length - 1],
                D = await h0(["split-window", "-t", M, j ? "-v" : "-h", "-P", "-F", "#{pane_id}"]);
            if (D.code !== 0) throw Error(`Failed to create teammate pane: ${D.stderr}`);
            w = D.stdout.trim(), k(`[TmuxBackend] Created teammate pane for ${A}: ${w}`)
        }
        return await this.setPaneBorderColor(w, q, !0), await this.setPaneTitle(w, A, q, !0), await this.rebalancePanesTiled(K), await Si4(), {
            paneId: w,
            isFirstTeammate: _
        }
    }
    async rebalancePanesWithLeader(A) {
        let K = (await Lb(["list-panes", "-t", A, "-F", "#{pane_id}"])).stdout.trim().split(`
`).filter(Boolean);
        if (K.length <= 2) return;
        await Lb(["select-layout", "-t", A, "main-vertical"]);
        let Y = K[0];
        await Lb(["resize-pane", "-t", Y, "-x", "30%"]), k(`[TmuxBackend] Rebalanced ${K.length-1} teammate panes with leader`)
    }
    async rebalancePanesTiled(A) {
        let K = (await h0(["list-panes", "-t", A, "-F", "#{pane_id}"])).stdout.trim().split(`
`).filter(Boolean);
        if (K.length <= 1) return;
        await h0(["select-layout", "-t", A, "tiled"]), k(`[TmuxBackend] Rebalanced ${K.length} teammate panes with tiled layout`)
    }
}
// @from(Ln 333722, Col 4)
Ri4 = !1
// @from(Ln 333723, Col 4)
FN1 = null
// @from(Ln 333724, Col 4)
hi4
// @from(Ln 333724, Col 9)
TNY = 200
// @from(Ln 333725, Col 4)
bi4 = E(() => {
    Eq();
    H1();
    k1();
    wh();
    ig();
    hi4 = Promise.resolve();
    Mu8(Ju8)
})
// @from(Ln 333734, Col 4)
mi4 = {}
// @from(Ln 333739, Col 0)
function NNY() {
    let A, q = new Promise((Y) => {
            A = Y
        }),
        K = ui4;
    return ui4 = q, K.then(() => A)
}
// @from(Ln 333747, Col 0)
function Du8(A) {
    return z8(BN1, A)
}
// @from(Ln 333751, Col 0)
function VNY(A) {
    let q = A.match(/Created new pane:\s*(.+)/);
    if (q && q[1]) return q[1].trim();
    return ""
}